export type SalaryRecord = {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeCode: string;
  /** YYYY-MM */
  month: string;
  basic: number;
  allowances: number;
  deductions: number;
  netPay: number;
};

export type CreateSalaryInput = {
  employeeId: string;
  /** YYYY-MM */
  month: string;
  basic: number;
  allowances?: number;
  deductions?: number;
};
