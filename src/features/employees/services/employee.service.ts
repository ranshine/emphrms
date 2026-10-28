import { apiClient } from "@/lib/api-client";
import type { CreateEmployeeInput, Employee } from "../types/employee.types";

export const employeeService = {
  list: async () => (await apiClient.get<{ employees: Employee[] }>("/employees")).employees,
  create: async (input: CreateEmployeeInput) =>
    (await apiClient.post<{ employee: Employee }>("/employees", input)).employee,
};
