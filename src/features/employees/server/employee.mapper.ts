import type { Employee as EmployeeRow } from "@/generated/prisma/client";
import type { Employee } from "../types/employee.types";

/** Converts a database row to the JSON-safe shape the UI uses (BigInt and Date become strings). */
export function toEmployee(row: EmployeeRow): Employee {
  return {
    id: row.id.toString(),
    employeeCode: row.employeeCode,
    firstName: row.firstName,
    lastName: row.lastName,
    email: row.email,
    phone: row.phone,
    department: row.department,
    designation: row.designation,
    dateOfJoining: row.dateOfJoining ? row.dateOfJoining.toISOString().slice(0, 10) : null,
    status: row.status,
  };
}
