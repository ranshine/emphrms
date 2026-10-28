import { z } from "zod";

const amount = z.number().min(0, "Amount cannot be negative").max(9_999_999_999);

export const monthSchema = z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/, "Month must be YYYY-MM");

export const createSalarySchema = z
  .object({
    employeeId: z.string().regex(/^\d+$/, "Select an employee"),
    month: monthSchema,
    basic: amount,
    allowances: amount.default(0),
    deductions: amount.default(0),
  })
  .refine((v) => v.deductions <= v.basic + v.allowances, {
    message: "Deductions cannot exceed basic plus allowances",
    path: ["deductions"],
  });
