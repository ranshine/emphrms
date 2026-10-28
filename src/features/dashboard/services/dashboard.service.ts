import dayjs from "dayjs";
import { apiClient } from "@/lib/api-client";
import type { DashboardStats } from "../types/dashboard.types";

export const dashboardService = {
  // Sends the browser's local date so "today" matches the user's time zone.
  stats: () => apiClient.get<DashboardStats>(`/dashboard/stats?date=${dayjs().format("YYYY-MM-DD")}`),
};
