"use client";

import { Card, Flex, Typography, theme } from "antd";
import { siteConfig } from "@/config/site";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const { token } = theme.useToken();

  return (
    <Flex
      vertical
      align="center"
      justify="center"
      gap={24}
      style={{ minHeight: "100vh", padding: 16, background: token.colorBgLayout }}
    >
      <Typography.Title level={2} style={{ margin: 0, color: token.colorPrimary }}>
        {siteConfig.name}
      </Typography.Title>
      <Card style={{ width: "100%", maxWidth: 400 }}>{children}</Card>
    </Flex>
  );
}
