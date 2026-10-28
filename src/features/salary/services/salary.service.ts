import { apiClient } from "@/lib/api-client";
import type { CreateSalaryInput, SalaryRecord } from "../types/salary.types";

export const salaryService = {
  list: async (month?: string) =>
    (await apiClient.get<{ salaries: SalaryRecord[] }>(`/salary${month ? `?month=${month}` : ""}`))
      .salaries,
  create: async (input: CreateSalaryInput) =>
    (await apiClient.post<{ salary: SalaryRecord }>("/salary", input)).salary,
};
