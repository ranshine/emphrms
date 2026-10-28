"use client";

import { useState } from "react";
import { Alert, DatePicker, Form, Input, Modal, Select } from "antd";
import type { Dayjs } from "dayjs";
import { employeeService } from "../services/employee.service";
import type { Employee, EmployeeStatus } from "../types/employee.types";

type FormValues = {
  employeeCode: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  department?: string;
  designation?: string;
  dateOfJoining?: Dayjs;
  status: EmployeeStatus;
};

type Props = {
  open: boolean;
  onClose: () => void;
  onCreated: (employee: Employee) => void;
};

export default function AddEmployeeModal({ open, onClose, onCreated }: Props) {
  const [form] = Form.useForm<FormValues>();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleOk = async () => {
    const { dateOfJoining, ...values } = await form.validateFields();
    setSubmitting(true);
    setError(null);
    try {
      const employee = await employeeService.create({
        ...values,
        dateOfJoining: dateOfJoining?.format("YYYY-MM-DD"),
      });
      onCreated(employee);
      form.resetFields();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not add employee");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      title="Add Employee"
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
        initialValues={{ status: "ACTIVE" }}
      >
        <Form.Item label="Employee code" name="employeeCode" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item label="First name" name="firstName" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item label="Last name" name="lastName" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item
          label="Email"
          name="email"
          rules={[{ required: true }, { type: "email", message: "Enter a valid email" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item label="Phone" name="phone">
          <Input />
        </Form.Item>
        <Form.Item label="Department" name="department">
          <Input />
        </Form.Item>
        <Form.Item label="Designation" name="designation">
          <Input />
        </Form.Item>
        <Form.Item label="Date of joining" name="dateOfJoining">
          <DatePicker style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item label="Status" name="status">
          <Select
            options={[
              { value: "ACTIVE", label: "Active" },
              { value: "ON_LEAVE", label: "On Leave" },
              { value: "INACTIVE", label: "Inactive" },
            ]}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}
