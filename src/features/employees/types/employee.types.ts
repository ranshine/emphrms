export type EmployeeStatus = "ACTIVE" | "ON_LEAVE" | "INACTIVE";

export type Employee = {
  id: string;
  employeeCode: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  department: string | null;
  designation: string | null;
  /** ISO date, YYYY-MM-DD */
  dateOfJoining: string | null;
  status: EmployeeStatus;
};

export type CreateEmployeeInput = {
  employeeCode: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  department?: string;
  designation?: string;
  /** ISO date, YYYY-MM-DD */
  dateOfJoining?: string;
  status?: EmployeeStatus;
};
