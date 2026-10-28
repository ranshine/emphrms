import type { Employee, Salary as SalaryRow } from "@/generated/prisma/client";
import type { SalaryRecord } from "../types/salary.types";

export function toSalaryRecord(row: SalaryRow & { employee: Employee }): SalaryRecord {
  return {
    id: row.id.toString(),
    employeeId: row.employeeId.toString(),
    employeeName: `${row.employee.firstName} ${row.employee.lastName}`,
    employeeCode: row.employee.employeeCode,
    month: row.month.toISOString().slice(0, 7),
    basic: row.basic.toNumber(),
    allowances: row.allowances.toNumber(),
    deductions: row.deductions.toNumber(),
    netPay: row.netPay.toNumber(),
  };
}
