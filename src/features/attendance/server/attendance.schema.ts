import { z } from "zod";

export const dateSchema = z.iso.date("Date must be YYYY-MM-DD");

export const saveAttendanceSchema = z.object({
  date: dateSchema,
  records: z
    .array(
      z.object({
        employeeId: z.string().regex(/^\d+$/, "Invalid employee"),
        status: z.enum(["YES", "NO"]),
      }),
    )
    .min(1, "Nothing to save")
    .max(5000),
});

export const MAX_SUMMARY_DAYS = 62;
