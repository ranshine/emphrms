import { z } from "zod";

const optionalText = z
  .string()
  .trim()
  .optional()
  .transform((v) => (v ? v : undefined));

export const createEmployeeSchema = z.object({
  employeeCode: z.string().trim().min(1, "Employee code is required"),
  firstName: z.string().trim().min(1, "First name is required"),
  lastName: z.string().trim().min(1, "Last name is required"),
  email: z.string().trim().toLowerCase().email("Enter a valid email"),
  phone: optionalText,
  department: optionalText,
  designation: optionalText,
  dateOfJoining: z.iso.date().optional(),
  status: z.enum(["ACTIVE", "ON_LEAVE", "INACTIVE"]).optional(),
});
