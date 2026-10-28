"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { App, Button, Layout, Menu, theme } from "antd";
import type { MenuProps } from "antd";
import {
  CheckSquareOutlined,
  DashboardOutlined,
  DollarOutlined,
  LogoutOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { siteConfig } from "@/config/site";
import { ROUTES } from "@/constants/routes";
import { authService } from "@/features/auth/services/auth.service";

const { Header, Sider, Content } = Layout;

const menuItems: MenuProps["items"] = [
  {
    key: ROUTES.dashboard,
    icon: <DashboardOutlined />,
    label: <Link href={ROUTES.dashboard}>Dashboard</Link>,
  },
  {
    key: ROUTES.employees,
    icon: <TeamOutlined />,
    label: <Link href={ROUTES.employees}>Employees</Link>,
  },
  {
    key: ROUTES.attendance,
    icon: <CheckSquareOutlined />,
    label: <Link href={ROUTES.attendance}>Attendance</Link>,
  },
  {
    key: ROUTES.salary,
    icon: <DollarOutlined />,
    label: <Link href={ROUTES.salary}>Salary</Link>,
  },
];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { message } = App.useApp();
  const { token } = theme.useToken();

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch (err) {
      message.error(err instanceof Error ? err.message : "Logout failed");
      return;
    }
    router.replace(ROUTES.login);
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed}>
        <div style={{ color: "#fff", padding: 16, fontWeight: 600, fontSize: 18 }}>
          {collapsed ? "HR" : siteConfig.name}
        </div>
        <Menu theme="dark" mode="inline" selectedKeys={[pathname]} items={menuItems} />
      </Sider>
      <Layout>
        <Header
          style={{
            background: token.colorBgContainer,
            paddingInline: 24,
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
          }}
        >
          <Button icon={<LogoutOutlined />} onClick={handleLogout}>
            Logout
          </Button>
        </Header>
        <Content style={{ margin: 24 }}>{children}</Content>
      </Layout>
    </Layout>
  );
}
