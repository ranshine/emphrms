"use client";

import { useCallback, useEffect, useState } from "react";
import { Alert, Button, Card, DatePicker, Space, Table, Typography } from "antd";
import type { TableProps } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import type { Dayjs } from "dayjs";
import { formatCurrency } from "@/lib/format";
import { salaryService } from "../services/salary.service";
import type { SalaryRecord } from "../types/salary.types";
import AddSalaryModal from "./AddSalaryModal";

const money = (v: number) => formatCurrency(v);

const columns: TableProps<SalaryRecord>["columns"] = [
  { title: "Code", dataIndex: "employeeCode" },
  { title: "Employee", dataIndex: "employeeName" },
  { title: "Basic", dataIndex: "basic", align: "right", render: money },
  { title: "Allowances", dataIndex: "allowances", align: "right", render: money },
  { title: "Deductions", dataIndex: "deductions", align: "right", render: money },
  { title: "Net pay", dataIndex: "netPay", align: "right", render: money },
];

export default function SalaryView() {
  const [month, setMonth] = useState<Dayjs>(() => dayjs());
  const [salaries, setSalaries] = useState<SalaryRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const monthKey = month.format("YYYY-MM");

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setSalaries(await salaryService.list(monthKey));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load salary records");
    } finally {
      setLoading(false);
    }
  }, [monthKey]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- data load on month change
    load();
  }, [load]);

  const total = salaries.reduce((sum, s) => sum + s.netPay, 0);

  return (
    <>
      <Typography.Title level={4} style={{ marginTop: 0 }}>
        Salary
      </Typography.Title>
      <Card
        extra={
          <Space>
            <DatePicker
              picker="month"
              allowClear={false}
              value={month}
              onChange={(value) => value && setMonth(value)}
            />
            <Button type="primary" icon={<PlusOutlined />} onClick={() => setModalOpen(true)}>
              Add Salary Record
            </Button>
          </Space>
        }
      >
        {error && <Alert type="error" title={error} showIcon style={{ marginBottom: 16 }} />}
        <Table<SalaryRecord>
          rowKey="id"
          columns={columns}
          dataSource={salaries}
          loading={loading}
          pagination={false}
          scroll={{ x: "max-content" }}
          summary={() =>
            salaries.length > 0 ? (
              <Table.Summary.Row>
                <Table.Summary.Cell index={0} colSpan={5}>
                  <strong>Total net pay</strong>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={5} align="right">
                  <strong>{money(total)}</strong>
                </Table.Summary.Cell>
              </Table.Summary.Row>
            ) : null
          }
        />
      </Card>
      <AddSalaryModal
        open={modalOpen}
        defaultMonth={month}
        onClose={() => setModalOpen(false)}
        onCreated={(salary) => {
          if (salary.month === monthKey) setSalaries((prev) => [...prev, salary]);
        }}
      />
    </>
  );
}
