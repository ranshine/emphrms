"use client";

import { useEffect, useState } from "react";
import { Alert, Button, Card, DatePicker, Table, Tag } from "antd";
import type { TableProps } from "antd";
import dayjs from "dayjs";
import type { Dayjs } from "dayjs";
import { attendanceService } from "../services/attendance.service";
import type { AttendanceSummaryDay } from "../types/attendance.types";
import AttendanceDayDrawer from "./AttendanceDayDrawer";

/** Day-by-day present / absent counts for a month; click a date to see every employee's status. */
export default function DailyAttendanceCard() {
  const [month, setMonth] = useState<Dayjs>(() => dayjs());
  const [days, setDays] = useState<AttendanceSummaryDay[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<string | null>(null);

  const monthKey = month.format("YYYY-MM");

  useEffect(() => {
    let cancelled = false;
    // Future days can't be marked, so the range stops at today.
    const from = month.startOf("month").format("YYYY-MM-DD");
    const monthEnd = month.endOf("month");
    const to = (monthEnd.isAfter(dayjs()) ? dayjs() : monthEnd).format("YYYY-MM-DD");
    // eslint-disable-next-line react-hooks/set-state-in-effect -- loading state for the fetch below
    setLoading(true);
    setError(null);
    attendanceService
      .summary(from, to)
      .then((result) => !cancelled && setDays(result))
      .catch((err) => !cancelled && setError(err instanceof Error ? err.message : "Could not load"))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
    // monthKey changes exactly when `month` does
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [monthKey]);

  const columns: TableProps<AttendanceSummaryDay>["columns"] = [
    {
      title: "Date",
      dataIndex: "date",
      render: (date: string) => (
        <Button type="link" style={{ padding: 0 }} onClick={() => setSelected(date)}>
          {dayjs(date).format("ddd, DD MMM YYYY")}
        </Button>
      ),
    },
    { title: "Present", dataIndex: "present", render: (v: number) => <Tag color="green">{v}</Tag> },
    { title: "Absent", dataIndex: "absent", render: (v: number) => <Tag color="red">{v}</Tag> },
    { title: "Not marked", dataIndex: "notMarked", render: (v: number) => <Tag>{v}</Tag> },
  ];

  return (
    <>
      <Card
        title="Daily attendance"
        style={{ marginTop: 16 }}
        extra={
          <DatePicker
            picker="month"
            allowClear={false}
            value={month}
            disabledDate={(d) => d.isAfter(dayjs(), "month")}
            onChange={(value) => value && setMonth(value)}
          />
        }
      >
        {error && <Alert type="error" title={error} showIcon style={{ marginBottom: 16 }} />}
        <Table<AttendanceSummaryDay>
          rowKey="date"
          columns={columns}
          dataSource={days}
          loading={loading}
          pagination={false}
          size="middle"
          scroll={{ x: "max-content" }}
          onRow={(row) => ({ onClick: () => setSelected(row.date), style: { cursor: "pointer" } })}
        />
      </Card>
      <AttendanceDayDrawer date={selected} onClose={() => setSelected(null)} />
    </>
  );
}
