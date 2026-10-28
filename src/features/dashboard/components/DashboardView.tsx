"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Alert, Card, Col, Row, Skeleton, Statistic, Typography } from "antd";
import { CheckCircleOutlined, DollarOutlined, TeamOutlined } from "@ant-design/icons";
import { ROUTES } from "@/constants/routes";
import DailyAttendanceCard from "@/features/attendance/components/DailyAttendanceCard";
import { formatCurrency } from "@/lib/format";
import { dashboardService } from "../services/dashboard.service";
import type { DashboardStats } from "../types/dashboard.types";

export default function DashboardView() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    dashboardService
      .stats()
      .then(setStats)
      .catch((err) => setError(err instanceof Error ? err.message : "Could not load dashboard"));
  }, []);

  return (
    <>
      <Typography.Title level={4} style={{ marginTop: 0 }}>
        Dashboard
      </Typography.Title>
      {error && <Alert type="error" title={error} showIcon style={{ marginBottom: 16 }} />}
      {!stats && !error && <Skeleton active />}
      {stats && (
        <Row gutter={[16, 16]}>
          <Col xs={24} md={8}>
            <Card style={{ height: "100%" }} title="Employees" extra={<Link href={ROUTES.employees}>View</Link>}>
              <Row gutter={16}>
                <Col span={12}>
                  <Statistic
                    title="Total"
                    value={stats.employees.total}
                    prefix={<TeamOutlined />}
                  />
                </Col>
                <Col span={12}>
                  <Statistic title="Active" value={stats.employees.active} />
                </Col>
              </Row>
            </Card>
          </Col>
          <Col xs={24} md={8}>
            <Card
              style={{ height: "100%" }}
              title="Attendance today"
              extra={<Link href={ROUTES.attendance}>Mark</Link>}
            >
              <Row gutter={16}>
                <Col span={8}>
                  <Statistic
                    title="Present"
                    value={stats.attendance.present}
                    prefix={<CheckCircleOutlined />}
                  />
                </Col>
                <Col span={8}>
                  <Statistic title="Absent" value={stats.attendance.absent} />
                </Col>
                <Col span={8}>
                  <Statistic title="Not marked" value={stats.attendance.notMarked} />
                </Col>
              </Row>
            </Card>
          </Col>
          <Col xs={24} md={8}>
            <Card style={{ height: "100%" }} title="Salary" extra={<Link href={ROUTES.salary}>View</Link>}>
              <Statistic
                title={`Net pay, ${stats.salary.month} (${stats.salary.recordCount} records)`}
                value={formatCurrency(stats.salary.totalNetPay)}
                prefix={<DollarOutlined />}
              />
            </Card>
          </Col>
        </Row>
      )}
      <DailyAttendanceCard />
    </>
  );
}
