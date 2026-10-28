import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { badRequest, toDateString, unauthorized } from "@/lib/http";
import { prisma } from "@/lib/prisma";
import { dateSchema, MAX_SUMMARY_DAYS } from "@/features/attendance/server/attendance.schema";
import type { AttendanceSummaryDay } from "@/features/attendance/types/attendance.types";

const MS_PER_DAY = 24 * 60 * 60 * 1000;

/** Per-day present / absent / not-marked counts for every day from `from` to `to`, newest first. */
export async function GET(req: Request) {
  if (!(await getSession())) return unauthorized();

  const params = new URL(req.url).searchParams;
  const from = dateSchema.safeParse(params.get("from"));
  const to = dateSchema.safeParse(params.get("to"));
  if (!from.success || !to.success) return badRequest("from and to must be YYYY-MM-DD");

  const start = new Date(from.data);
  const end = new Date(to.data);
  const dayCount = Math.round((end.getTime() - start.getTime()) / MS_PER_DAY) + 1;
  if (dayCount < 1) return badRequest("from cannot be after to");
  if (dayCount > MAX_SUMMARY_DAYS) return badRequest(`Range cannot exceed ${MAX_SUMMARY_DAYS} days`);

  const [employees, rows] = await Promise.all([
    prisma.employee.findMany({ where: { status: { not: "INACTIVE" } }, select: { id: true } }),
    prisma.attendance.findMany({ where: { date: { gte: start, lte: end } } }),
  ]);
  // Count only ids that still belong to a markable employee, matching the day detail view.
  const markable = new Set(employees.map((e) => e.id));
  const byDate = new Map(rows.map((r) => [toDateString(r.date), r]));

  const days: AttendanceSummaryDay[] = [];
  for (let i = dayCount - 1; i >= 0; i--) {
    const date = toDateString(new Date(start.getTime() + i * MS_PER_DAY));
    const row = byDate.get(date);
    const present = row ? row.presentIds.filter((id) => markable.has(id)).length : 0;
    const absent = row ? row.absentIds.filter((id) => markable.has(id)).length : 0;
    days.push({ date, present, absent, notMarked: Math.max(markable.size - present - absent, 0) });
  }
  return NextResponse.json({ days });
}
