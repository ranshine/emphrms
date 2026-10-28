import { apiClient } from "@/lib/api-client";
import type { LoginRequest, LoginResponse } from "../types/auth.types";

export const authService = {
  login: (payload: LoginRequest) => apiClient.post<LoginResponse>("/auth/login", payload),
  logout: () => apiClient.post<void>("/auth/logout"),
};
