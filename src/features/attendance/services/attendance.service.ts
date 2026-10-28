import { apiClient } from "@/lib/api-client";
import type {
  AttendanceDay,
  AttendanceSummaryDay,
  SaveAttendanceInput,
} from "../types/attendance.types";

export const attendanceService = {
  getDay: (date: string) => apiClient.get<AttendanceDay>(`/attendance?date=${date}`),
  save: (input: SaveAttendanceInput) => apiClient.post<{ saved: number }>("/attendance", input),
  summary: async (from: string, to: string) =>
    (await apiClient.get<{ days: AttendanceSummaryDay[] }>(
      `/attendance/summary?from=${from}&to=${to}`,
    )).days,
};
