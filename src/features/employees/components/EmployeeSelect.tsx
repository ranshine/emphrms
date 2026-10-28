"use client";

import { useEffect, useState } from "react";
import { Select } from "antd";
import { employeeService } from "../services/employee.service";
import type { Employee } from "../types/employee.types";

type Props = {
  value?: string;
  onChange?: (value: string) => void;
};

/** Searchable employee dropdown; value is the employee id. Works inside Form.Item. */
export default function EmployeeSelect({ value, onChange }: Props) {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    employeeService
      .list()
      .then(setEmployees)
      .finally(() => setLoading(false));
  }, []);

  return (
    <Select
      showSearch={{ optionFilterProp: "label" }}
      placeholder="Select employee"
      loading={loading}
      value={value}
      onChange={onChange}
      options={employees.map((e) => ({
        value: e.id,
        label: `${e.firstName} ${e.lastName} (${e.employeeCode})`,
      }))}
    />
  );
}
