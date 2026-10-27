"use client";

import { useState } from "react";
import {
  App,
  Button,
  Card,
  Col,
  Layout,
  Menu,
  Row,
  Statistic,
  Table,
  Tag,
  Typography,
} from "antd";
import type { TableProps } from "antd";
import {
  CalendarOutlined,
  DashboardOutlined,
  DollarOutlined,
  PlusOutlined,
  TeamOutlined,
} from "@ant-design/icons";

const { Header, Sider, Content } = Layout;

type Employee = {
  key: string;
  name: string;
  department: string;
  role: string;
  status: "Active" | "On Leave";
};

const columns: TableProps<Employee>["columns"] = [
  { title: "Name", dataIndex: "name" },
  { title: "Department", dataIndex: "department" },
  { title: "Role", dataIndex: "role" },
  {
    title: "Status",
    dataIndex: "status",
    render: (status: Employee["status"]) => (
      <Tag color={status === "Active" ? "green" : "orange"}>{status}</Tag>
    ),
  },
];

export default function Home() {
  const [collapsed, setCollapsed] = useState(false);
  const [employees] = useState<Employee[]>([]);
  const { message } = App.useApp();

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed}>
        <div style={{ color: "#fff", padding: 16, fontWeight: 600, fontSize: 18 }}>
          {collapsed ? "HR" : "EmpHRMS"}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={["dashboard"]}
          items={[
            { key: "dashboard", icon: <DashboardOutlined />, label: "Dashboard" },
            { key: "employees", icon: <TeamOutlined />, label: "Employees" },
            { key: "leave", icon: <CalendarOutlined />, label: "Leave" },
            { key: "payroll", icon: <DollarOutlined />, label: "Payroll" },
          ]}
        />
      </Sider>
      <Layout>
        <Header style={{ background: "#fff", paddingInline: 24 }}>
          <Typography.Title level={4} style={{ margin: 0, lineHeight: "64px" }}>
            Dashboard
          </Typography.Title>
        </Header>
        <Content style={{ margin: 24 }}>
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={8}>
              <Card>
                <Statistic title="Total Employees" value={employees.length} prefix={<TeamOutlined />} />
              </Card>
            </Col>
            <Col xs={24} sm={8}>
              <Card>
                <Statistic
                  title="On Leave"
                  value={employees.filter((e) => e.status === "On Leave").length}
                  prefix={<CalendarOutlined />}
                />
              </Card>
            </Col>
            <Col xs={24} sm={8}>
              <Card>
                <Statistic
                  title="Departments"
                  value={new Set(employees.map((e) => e.department)).size}
                />
              </Card>
            </Col>
          </Row>
          <Card
            title="Employees"
            style={{ marginTop: 16 }}
            extra={
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => message.info("Add employee form coming soon")}
              >
                Add Employee
              </Button>
            }
          >
            <Table columns={columns} dataSource={employees} pagination={false} />
          </Card>
        </Content>
      </Layout>
    </Layout>
  );
}
