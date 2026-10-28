"use client";

import { useCallback, useEffect, useState } from "react";
import { Alert, App, Button, Card, DatePicker, Radio, Space, Table, Tag, Typography } from "antd";
import type { TableProps } from "antd";
import { CheckOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import type { Dayjs } from "dayjs";
import { attendanceService } from "../services/attendance.service";
import type { AttendanceRow, AttendanceStatus } from "../types/attendance.types";

export default function AttendanceView() {
  const { message } = App.useApp();
  const [date, setDate] = useState<Dayjs>(() => dayjs());
  const [rows, setRows] = useState<AttendanceRow[]>([]);
  // Choices not saved yet, keyed by employee id.
  const [pending, setPending] = useState<Record<string, AttendanceStatus>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const dateKey = date.format("YYYY-MM-DD");

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const day = await attendanceService.getDay(dateKey);
      setRows(day.rows);
      setPending({});
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load attendance");
    } finally {
      setLoading(false);
    }
  }, [dateKey]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- data load on date change
    load();
  }, [load]);

  const statusOf = (row: AttendanceRow) => pending[row.employeeId] ?? row.status;

  const counts = rows.reduce(
    (acc, row) => {
      const status = statusOf(row);
      if (status === "YES") acc.present += 1;
      else if (status === "NO") acc.absent += 1;
      else acc.notMarked += 1;
      return acc;
    },
    { present: 0, absent: 0, notMarked: 0 },
  );

  const markAllPresent = () =>
    setPending(Object.fromEntries(rows.map((r) => [r.employeeId, "YES" as const])));

  const save = async () => {
    const records = Object.entries(pending).map(([employeeId, status]) => ({ employeeId, status }));
    setSaving(true);
    try {
      await attendanceService.save({ date: dateKey, records });
      message.success(`Saved attendance for ${dateKey}`);
      await load();
    } catch (err) {
      message.error(err instanceof Error ? err.message : "Could not save attendance");
    } finally {
      setSaving(false);
    }
  };

  const columns: TableProps<AttendanceRow>["columns"] = [
    { title: "Code", dataIndex: "employeeCode" },
    { title: "Employee", dataIndex: "employeeName" },
    {
      title: "Present?",
      render: (_, row) => (
        <Radio.Group
          optionType="button"
          buttonStyle="solid"
          value={statusOf(row)}
          onChange={(e) => setPending((prev) => ({ ...prev, [row.employeeId]: e.target.value }))}
          options={[
            { value: "YES", label: "Yes" },
            { value: "NO", label: "No" },
          ]}
        />
      ),
    },
  ];

  const unsaved = Object.keys(pending).length;

  return (
    <>
      <Typography.Title level={4} style={{ marginTop: 0 }}>
        Attendance
      </Typography.Title>
      <Card
        extra={
          <Space wrap>
            <DatePicker
              allowClear={false}
              value={date}
              disabledDate={(d) => d.isAfter(dayjs(), "day")}
              onChange={(value) => value && setDate(value)}
            />
            <Button onClick={markAllPresent} disabled={rows.length === 0}>
              Mark all present
            </Button>
            <Button
              type="primary"
              icon={<CheckOutlined />}
              loading={saving}
              disabled={unsaved === 0}
              onClick={save}
            >
              Save{unsaved > 0 ? ` (${unsaved})` : ""}
            </Button>
          </Space>
        }
      >
        {error && <Alert type="error" title={error} showIcon style={{ marginBottom: 16 }} />}
        <Space style={{ marginBottom: 16 }}>
          <Tag color="green">Present {counts.present}</Tag>
          <Tag color="red">Absent {counts.absent}</Tag>
          <Tag>Not marked {counts.notMarked}</Tag>
        </Space>
        <Table<AttendanceRow>
          rowKey="employeeId"
          columns={columns}
          dataSource={rows}
          loading={loading}
          pagination={false}
          scroll={{ x: "max-content" }}
        />
      </Card>
    </>
  );
}
