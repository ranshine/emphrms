"use client";

import { useState } from "react";
import { Alert, DatePicker, Form, InputNumber, Modal } from "antd";
import type { Dayjs } from "dayjs";
import EmployeeSelect from "@/features/employees/components/EmployeeSelect";
import { salaryService } from "../services/salary.service";
import type { SalaryRecord } from "../types/salary.types";

type FormValues = {
  employeeId: string;
  month: Dayjs;
  basic: number;
  allowances?: number;
  deductions?: number;
};

type Props = {
  open: boolean;
  defaultMonth: Dayjs;
  onClose: () => void;
  onCreated: (salary: SalaryRecord) => void;
};

export default function AddSalaryModal({ open, defaultMonth, onClose, onCreated }: Props) {
  const [form] = Form.useForm<FormValues>();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleOk = async () => {
    const { month, ...values } = await form.validateFields();
    setSubmitting(true);
    setError(null);
    try {
      const salary = await salaryService.create({ ...values, month: month.format("YYYY-MM") });
      onCreated(salary);
      form.resetFields();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not add salary record");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      title="Add Salary Record"
      open={open}
      okText="Add"
      confirmLoading={submitting}
      onOk={handleOk}
      onCancel={onClose}
      afterClose={() => setError(null)}
      destroyOnHidden
    >
      {error && <Alert type="error" title={error} showIcon style={{ marginBottom: 16 }} />}
      <Form<FormValues>
        form={form}
        layout="vertical"
        requiredMark="optional"
        initialValues={{ month: defaultMonth, allowances: 0, deductions: 0 }}
      >
        <Form.Item label="Employee" name="employeeId" rules={[{ required: true }]}>
          <EmployeeSelect />
        </Form.Item>
        <Form.Item label="Month" name="month" rules={[{ required: true }]}>
          <DatePicker picker="month" style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item label="Basic" name="basic" rules={[{ required: true }]}>
          <InputNumber min={0} precision={2} style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item label="Allowances" name="allowances">
          <InputNumber min={0} precision={2} style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item label="Deductions" name="deductions">
          <InputNumber min={0} precision={2} style={{ width: "100%" }} />
        </Form.Item>
      </Form>
    </Modal>
  );
}
