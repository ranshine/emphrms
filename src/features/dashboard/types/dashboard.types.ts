export type DashboardStats = {
  employees: { total: number; active: number };
  attendance: {
    /** ISO date the counts are for, YYYY-MM-DD */
    date: string;
    present: number;
    absent: number;
    notMarked: number;
  };
  salary: {
    /** YYYY-MM */
    month: string;
    recordCount: number;
    totalNetPay: number;
  };
};
