import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { badRequest, isForeignKeyViolation, isUniqueViolation, unauthorized } from "@/lib/http";
import { prisma } from "@/lib/prisma";
import { toSalaryRecord } from "@/features/salary/server/salary.mapper";
import { createSalarySchema, monthSchema } from "@/features/salary/server/salary.schema";

const monthStart = (month: string) => new Date(`${month}-01`);

export async function GET(req: Request) {
  if (!(await getSession())) return unauthorized();

  const month = new URL(req.url).searchParams.get("month");
  if (month && !monthSchema.safeParse(month).success) return badRequest("Month must be YYYY-MM");

  const rows = await prisma.salary.findMany({
    where: month ? { month: monthStart(month) } : undefined,
    include: { employee: true },
    orderBy: [{ month: "desc" }, { employee: { firstName: "asc" } }],
  });
  return NextResponse.json({ salaries: rows.map(toSalaryRecord) });
}

export async function POST(req: Request) {
  if (!(await getSession())) return unauthorized();

  const parsed = createSalarySchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return badRequest(parsed.error.issues[0]?.message ?? "Invalid salary data");
  const { employeeId, month, basic, allowances, deductions } = parsed.data;

  try {
    const row = await prisma.salary.create({
      data: {
        employeeId: BigInt(employeeId),
        month: monthStart(month),
        basic,
        allowances,
        deductions,
        netPay: basic + allowances - deductions,
      },
      include: { employee: true },
    });
    return NextResponse.json({ salary: toSalaryRecord(row) }, { status: 201 });
  } catch (err) {
    if (isUniqueViolation(err)) {
      return NextResponse.json(
        { message: "A salary record already exists for this employee and month" },
        { status: 409 },
      );
    }
    if (isForeignKeyViolation(err)) return badRequest("Employee not found");
    throw err;
  }
}
