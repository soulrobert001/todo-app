import { useState } from 'react';
import { Card, Form, Input, Button, Typography, Alert, Space } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from '../../store';
import { loginUser } from '../../store/authSlice';

const { Title, Text } = Typography;

interface LoginFormValues {
  username: string;
  password: string;
}

export const Login = ({ onSwitchToRegister }: { onSwitchToRegister: () => void }) => {
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector(state => state.auth);
  const [form] = Form.useForm();
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = async (values: LoginFormValues) => {
    setLocalError(null);
    const result = await loginUser(values.username, values.password)(dispatch);
    
    if (!result.success) {
      setLocalError(result.error as string);
    }
  };

  return (
    <Card style={{ width: 400, margin: '0 auto', marginTop: 50 }}>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <div style={{ textAlign: 'center' }}>
          <Title level={2}>登录</Title>
          <Text type="secondary">登录以访问您的待办事项</Text>
        </div>

        {(error || localError) && (
          <Alert
            message="登录错误"
            description={error || localError}
            type="error"
            showIcon
          />
        )}

        <Form
          form={form}
          name="login"
          layout="vertical"
          onFinish={handleSubmit}
          autoComplete="off"
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: '请输入用户名！' }]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="用户名"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: '请输入密码！' }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="密码"
              size="large"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              block
              loading={loading}
            >
              登录
            </Button>
          </Form.Item>
        </Form>

        <div style={{ textAlign: 'center' }}>
          <Text>还没有账号？</Text>
          <Button type="link" onClick={onSwitchToRegister}>
            注册账号
          </Button>
        </div>
      </Space>
    </Card>
  );
}; 