/** YES = present, NO = absent */
export type AttendanceStatus = "YES" | "NO";

export type AttendanceRow = {
  employeeId: string;
  employeeCode: string;
  employeeName: string;
  /** null until attendance has been marked for the day */
  status: AttendanceStatus | null;
};

export type AttendanceDay = {
  /** ISO date, YYYY-MM-DD */
  date: string;
  rows: AttendanceRow[];
};

export type SaveAttendanceInput = {
  /** ISO date, YYYY-MM-DD */
  date: string;
  records: { employeeId: string; status: AttendanceStatus }[];
};

export type AttendanceSummaryDay = {
  /** ISO date, YYYY-MM-DD */
  date: string;
  present: number;
  absent: number;
  notMarked: number;
};
