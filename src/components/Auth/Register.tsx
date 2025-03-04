import { useState } from 'react';
import { Card, Form, Input, Button, Typography, Alert, Space } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from '../../store';
import { registerUser } from '../../store/authSlice';

const { Title, Text } = Typography;

interface RegisterFormValues {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export const Register = ({ onSwitchToLogin }: { onSwitchToLogin: () => void }) => {
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector(state => state.auth);
  const [form] = Form.useForm();
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = async (values: RegisterFormValues) => {
    setLocalError(null);
    
    if (values.password !== values.confirmPassword) {
      setLocalError('两次输入的密码不一致');
      return;
    }
    
    const result = await registerUser(
      values.username, 
      values.email, 
      values.password
    )(dispatch);
    
    if (!result.success) {
      setLocalError(result.error as string);
    }
  };

  return (
    <Card style={{ width: 400, margin: '0 auto', marginTop: 50 }}>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <div style={{ textAlign: 'center' }}>
          <Title level={2}>注册</Title>
          <Text type="secondary">创建账号以使用待办事项管理系统</Text>
        </div>

        {(error || localError) && (
          <Alert
            message="注册错误"
            description={error || localError}
            type="error"
            showIcon
          />
        )}

        <Form
          form={form}
          name="register"
          layout="vertical"
          onFinish={handleSubmit}
          autoComplete="off"
        >
          <Form.Item
            name="username"
            rules={[
              { required: true, message: '请输入用户名！' },
              { min: 3, message: '用户名至少3个字符' }
            ]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="用户名"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="email"
            rules={[
              { required: true, message: '请输入邮箱！' },
              { type: 'email', message: '请输入有效的邮箱地址！' }
            ]}
          >
            <Input
              prefix={<MailOutlined />}
              placeholder="邮箱"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              { required: true, message: '请输入密码！' },
              { min: 6, message: '密码至少6个字符' }
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="密码"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            rules={[
              { required: true, message: '请确认密码！' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('两次输入的密码不一致！'));
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="确认密码"
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
              注册
            </Button>
          </Form.Item>
        </Form>

        <div style={{ textAlign: 'center' }}>
          <Text>已有账号？</Text>
          <Button type="link" onClick={onSwitchToLogin}>
            登录
          </Button>
        </div>
      </Space>
    </Card>
  );
}; 