import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { badRequest, unauthorized } from "@/lib/http";
import { prisma } from "@/lib/prisma";
import { dateSchema } from "@/features/attendance/server/attendance.schema";
import type { DashboardStats } from "@/features/dashboard/types/dashboard.types";

export async function GET(req: Request) {
  if (!(await getSession())) return unauthorized();

  // The client sends its local date; fall back to the server's UTC date.
  const requested = new URL(req.url).searchParams.get("date");
  const parsed = dateSchema.safeParse(requested ?? new Date().toISOString().slice(0, 10));
  if (!parsed.success) return badRequest("Date must be YYYY-MM-DD");

  const date = parsed.data;
  const month = date.slice(0, 7);

  const markableEmployee = { status: { not: "INACTIVE" as const } };
  const day = await prisma.attendance.findUnique({ where: { date: new Date(date) } });

  const [total, active, markable, present, absent, salary] = await Promise.all([
    prisma.employee.count(),
    prisma.employee.count({ where: { status: "ACTIVE" } }),
    prisma.employee.count({ where: markableEmployee }),
    // Count only ids that still belong to a markable employee.
    prisma.employee.count({ where: { ...markableEmployee, id: { in: day?.presentIds ?? [] } } }),
    prisma.employee.count({ where: { ...markableEmployee, id: { in: day?.absentIds ?? [] } } }),
    prisma.salary.aggregate({
      where: { month: new Date(`${month}-01`) },
      _count: true,
      _sum: { netPay: true },
    }),
  ]);

  const stats: DashboardStats = {
    employees: { total, active },
    attendance: { date, present, absent, notMarked: Math.max(markable - present - absent, 0) },
    salary: {
      month,
      recordCount: salary._count,
      totalNetPay: salary._sum.netPay?.toNumber() ?? 0,
    },
  };
  return NextResponse.json(stats);
}
