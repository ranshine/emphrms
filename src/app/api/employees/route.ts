import { NextResponse } from "next/server";
import { Prisma } from "@/generated/prisma/client";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { toEmployee } from "@/features/employees/server/employee.mapper";
import { createEmployeeSchema } from "@/features/employees/server/employee.schema";

const unauthorized = () => NextResponse.json({ message: "Unauthorized" }, { status: 401 });

export async function GET() {
  if (!(await getSession())) return unauthorized();

  const rows = await prisma.employee.findMany({ orderBy: { id: "desc" } });
  return NextResponse.json({ employees: rows.map(toEmployee) });
}

export async function POST(req: Request) {
  if (!(await getSession())) return unauthorized();

  const parsed = createEmployeeSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json(
      { message: parsed.error.issues[0]?.message ?? "Invalid employee data" },
      { status: 400 },
    );
  }
  const { dateOfJoining, ...data } = parsed.data;

  try {
    const row = await prisma.employee.create({
      data: { ...data, dateOfJoining: dateOfJoining ? new Date(dateOfJoining) : undefined },
    });
    return NextResponse.json({ employee: toEmployee(row) }, { status: 201 });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
      return NextResponse.json(
        { message: "An employee with this code or email already exists" },
        { status: 409 },
      );
    }
    throw err;
  }
}
