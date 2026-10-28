"use client";

import { useCallback, useEffect, useState } from "react";
import { Alert, Button, Card, Typography } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { employeeService } from "../services/employee.service";
import type { Employee } from "../types/employee.types";
import AddEmployeeModal from "./AddEmployeeModal";
import EmployeeTable from "./EmployeeTable";

export default function EmployeesView() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setEmployees(await employeeService.list());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load employees");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initial data load
    load();
  }, [load]);

  return (
    <>
      <Typography.Title level={4} style={{ marginTop: 0 }}>
        Employees
      </Typography.Title>
      <Card
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setModalOpen(true)}>
            Add Employee
          </Button>
        }
      >
        {error && <Alert type="error" title={error} showIcon style={{ marginBottom: 16 }} />}
        <EmployeeTable employees={employees} loading={loading} />
      </Card>
      <AddEmployeeModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onCreated={(employee) => setEmployees((prev) => [employee, ...prev])}
      />
    </>
  );
}
