"use client";

import { App, ConfigProvider } from "antd";
import { theme } from "@/config/theme";

export default function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ConfigProvider theme={theme}>
      <App>{children}</App>
    </ConfigProvider>
  );
}
