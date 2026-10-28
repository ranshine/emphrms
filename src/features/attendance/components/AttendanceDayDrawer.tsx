"use client";

import { useEffect, useState } from "react";
import { Alert, Drawer, Space, Table, Tag } from "antd";
import type { TableProps } from "antd";
import { attendanceService } from "../services/attendance.service";
import type { AttendanceDay, AttendanceRow, AttendanceStatus } from "../types/attendance.types";

const STATUS_TAG: Record<AttendanceStatus | "NONE", { text: string; color?: string }> = {
  YES: { text: "Present", color: "green" },
  NO: { text: "Absent", color: "red" },
  NONE: { text: "Not marked" },
};

const columns: TableProps<AttendanceRow>["columns"] = [
  { title: "Code", dataIndex: "employeeCode" },
  { title: "Employee", dataIndex: "employeeName" },
  {
    title: "Status",
    dataIndex: "status",
    filters: [
      { text: "Present", value: "YES" },
      { text: "Absent", value: "NO" },
      { text: "Not marked", value: "NONE" },
    ],
    onFilter: (value, row) => (row.status ?? "NONE") === value,
    render: (status: AttendanceStatus | null) => {
      const tag = STATUS_TAG[status ?? "NONE"];
      return <Tag color={tag.color}>{tag.text}</Tag>;
    },
  },
];

type Props = {
  /** ISO date to show, or null when closed */
  date: string | null;
  onClose: () => void;
};

export default function AttendanceDayDrawer({ date, onClose }: Props) {
  const [day, setDay] = useState<AttendanceDay | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!date) return;
    let cancelled = false;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reset before fetching the new day
    setDay(null);
    setError(null);
    attendanceService
      .getDay(date)
      .then((result) => !cancelled && setDay(result))
      .catch((err) => !cancelled && setError(err instanceof Error ? err.message : "Could not load"));
    return () => {
      cancelled = true;
    };
  }, [date]);

  const count = (status: AttendanceStatus | null) =>
    day?.rows.filter((r) => r.status === status).length ?? 0;

  return (
    <Drawer
      title={`Attendance, ${date ?? ""}`}
      open={date !== null}
      onClose={onClose}
      size={520}
      destroyOnHidden
    >
      {error && <Alert type="error" title={error} showIcon style={{ marginBottom: 16 }} />}
      {day && (
        <Space style={{ marginBottom: 16 }}>
          <Tag color="green">Present {count("YES")}</Tag>
          <Tag color="red">Absent {count("NO")}</Tag>
          <Tag>Not marked {count(null)}</Tag>
        </Space>
      )}
      <Table<AttendanceRow>
        rowKey="employeeId"
        columns={columns}
        dataSource={day?.rows ?? []}
        loading={!day && !error}
        pagination={false}
        size="small"
      />
    </Drawer>
  );
}
