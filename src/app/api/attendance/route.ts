import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { badRequest, unauthorized } from "@/lib/http";
import { prisma } from "@/lib/prisma";
import { dateSchema, saveAttendanceSchema } from "@/features/attendance/server/attendance.schema";
import type { AttendanceDay } from "@/features/attendance/types/attendance.types";

/** Employees who should be marked: everyone except inactive staff. */
const markable = { status: { not: "INACTIVE" as const } };

export async function GET(req: Request) {
  if (!(await getSession())) return unauthorized();

  const parsed = dateSchema.safeParse(new URL(req.url).searchParams.get("date"));
  if (!parsed.success) return badRequest("Date must be YYYY-MM-DD");

  const [employees, day] = await Promise.all([
    prisma.employee.findMany({
      where: markable,
      orderBy: [{ firstName: "asc" }, { lastName: "asc" }],
    }),
    prisma.attendance.findUnique({ where: { date: new Date(parsed.data) } }),
  ]);
  const present = new Set(day?.presentIds);
  const absent = new Set(day?.absentIds);

  const result: AttendanceDay = {
    date: parsed.data,
    rows: employees.map((e) => ({
      employeeId: e.id.toString(),
      employeeCode: e.employeeCode,
      employeeName: `${e.firstName} ${e.lastName}`,
      status: present.has(e.id) ? "YES" : absent.has(e.id) ? "NO" : null,
    })),
  };
  return NextResponse.json(result);
}

export async function POST(req: Request) {
  if (!(await getSession())) return unauthorized();

  const parsed = saveAttendanceSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return badRequest(parsed.error.issues[0]?.message ?? "Invalid attendance data");
  }
  const { date, records } = parsed.data;

  // Reject dates later than today anywhere on Earth (UTC+14), so a client's local "today" is always allowed.
  const latestAllowed = new Date(Date.now() + 14 * 60 * 60 * 1000).toISOString().slice(0, 10);
  if (date > latestAllowed) return badRequest("Cannot mark attendance for a future date");

  // If an employee appears twice, the last entry wins.
  const choice = new Map(records.map((r) => [r.employeeId, r.status]));
  const ids = [...choice.keys()];
  const found = await prisma.employee.count({ where: { id: { in: ids.map(BigInt) } } });
  if (found !== ids.length) return badRequest("One or more employees were not found");

  const yes = ids.filter((id) => choice.get(id) === "YES");
  const no = ids.filter((id) => choice.get(id) === "NO");

  // One atomic statement: move each id into its new list, keep everyone else's mark as it was.
  await prisma.$executeRaw`
    insert into public.attendance as a (date, present_ids, absent_ids)
    values (${date}::date, ${yes}::text[]::bigint[], ${no}::text[]::bigint[])
    on conflict (date) do update set
      present_ids = array(
        select distinct x
        from unnest(array_cat(
          array(select p from unnest(a.present_ids) p where p <> all(${no}::text[]::bigint[])),
          ${yes}::text[]::bigint[]
        )) x
        order by x),
      absent_ids = array(
        select distinct x
        from unnest(array_cat(
          array(select p from unnest(a.absent_ids) p where p <> all(${yes}::text[]::bigint[])),
          ${no}::text[]::bigint[]
        )) x
        order by x)`;

  return NextResponse.json({ saved: ids.length });
}
