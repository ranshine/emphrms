"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Alert, Button, Checkbox, Form, Input, Typography } from "antd";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { ROUTES } from "@/constants/routes";
import { authService } from "../services/auth.service";
import type { LoginRequest } from "../types/auth.types";

export default function LoginForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (values: LoginRequest) => {
    setLoading(true);
    setError(null);
    try {
      await authService.login(values);
      router.replace(ROUTES.dashboard);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Typography.Title level={3} style={{ marginBottom: 4 }}>
        Sign in
      </Typography.Title>
      <Typography.Paragraph type="secondary">
        Enter your credentials to access your account.
      </Typography.Paragraph>

      {error && <Alert type="error" title={error} showIcon style={{ marginBottom: 16 }} />}

      <Form<LoginRequest>
        layout="vertical"
        size="large"
        requiredMark={false}
        initialValues={{ remember: true }}
        onFinish={handleSubmit}
      >
        <Form.Item
          label="User ID"
          name="userId"
          rules={[{ required: true, message: "Please enter your user ID" }]}
        >
          <Input prefix={<UserOutlined />} placeholder="User ID" autoComplete="username" />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: "Please enter your password" }]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="Password"
            autoComplete="current-password"
          />
        </Form.Item>

        <Form.Item name="remember" valuePropName="checked">
          <Checkbox>Remember me</Checkbox>
        </Form.Item>

        <Form.Item style={{ marginBottom: 0 }}>
          <Button type="primary" htmlType="submit" block loading={loading}>
            Sign in
          </Button>
        </Form.Item>
      </Form>
    </>
  );
}
