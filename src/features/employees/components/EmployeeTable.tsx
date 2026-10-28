"use client";

import { Table, Tag } from "antd";
import type { TableProps } from "antd";
import type { Employee, EmployeeStatus } from "../types/employee.types";

const STATUS_LABEL: Record<EmployeeStatus, { text: string; color: string }> = {
  ACTIVE: { text: "Active", color: "green" },
  ON_LEAVE: { text: "On Leave", color: "orange" },
  INACTIVE: { text: "Inactive", color: "default" },
};

const columns: TableProps<Employee>["columns"] = [
  { title: "Code", dataIndex: "employeeCode" },
  {
    title: "Name",
    render: (_, e) => `${e.firstName} ${e.lastName}`,
  },
  { title: "Email", dataIndex: "email" },
  { title: "Department", dataIndex: "department", render: (v) => v ?? "-" },
  { title: "Designation", dataIndex: "designation", render: (v) => v ?? "-" },
  { title: "Joined", dataIndex: "dateOfJoining", render: (v) => v ?? "-" },
  {
    title: "Status",
    dataIndex: "status",
    render: (status: EmployeeStatus) => (
      <Tag color={STATUS_LABEL[status].color}>{STATUS_LABEL[status].text}</Tag>
    ),
  },
];

type Props = {
  employees: Employee[];
  loading?: boolean;
};

export default function EmployeeTable({ employees, loading }: Props) {
  return (
    <Table<Employee>
      rowKey="id"
      columns={columns}
      dataSource={employees}
      loading={loading}
      pagination={false}
      scroll={{ x: "max-content" }}
    />
  );
}
