import { Form, Input, Button, Card, Typography, Switch, Radio, Avatar, Upload, message } from 'antd';
import { UserOutlined, UploadOutlined } from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from '../../store';
import { updateUser } from '../../store/authSlice';
import { useState } from 'react';

const { Title } = Typography;

interface UserSettingsFormValues {
  username: string;
  email: string;
  theme: 'light' | 'dark';
  language: 'zh' | 'en';
  notifications: boolean;
}

export const UserSettings = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(state => state.auth.user);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  if (!user) {
    return <div>请先登录</div>;
  }

  const handleSubmit = (values: UserSettingsFormValues) => {
    setLoading(true);
    
    // 模拟API调用延迟
    setTimeout(() => {
      dispatch(updateUser({
        username: values.username,
        email: values.email,
        preferences: {
          theme: values.theme,
          language: values.language,
          notifications: values.notifications
        }
      }));
      
      setLoading(false);
      message.success('设置已更新');
    }, 1000);
  };

  return (
    <div style={{ padding: '24px 0' }}>
      <Title level={2} style={{ marginBottom: 24 }}>用户设置</Title>
      
      <Card>
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            username: user.username,
            email: user.email,
            theme: user.preferences.theme,
            language: user.preferences.language,
            notifications: user.preferences.notifications
          }}
          onFinish={handleSubmit}
        >
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <Avatar 
              size={100} 
              icon={<UserOutlined />} 
              src={user.avatar}
              style={{ marginBottom: 16 }}
            />
            <div>
              <Upload
                name="avatar"
                showUploadList={false}
                beforeUpload={() => {
                  message.info('此功能在演示版本中不可用');
                  return false;
                }}
              >
                <Button icon={<UploadOutlined />}>更换头像</Button>
              </Upload>
            </div>
          </div>

          <Form.Item
            name="username"
            label="用户名"
            rules={[{ required: true, message: '请输入用户名' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="email"
            label="邮箱"
            rules={[
              { required: true, message: '请输入邮箱' },
              { type: 'email', message: '请输入有效的邮箱地址' }
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="theme"
            label="主题"
          >
            <Radio.Group>
              <Radio.Button value="light">浅色</Radio.Button>
              <Radio.Button value="dark">深色</Radio.Button>
            </Radio.Group>
          </Form.Item>

          <Form.Item
            name="language"
            label="语言"
          >
            <Radio.Group>
              <Radio.Button value="zh">中文</Radio.Button>
              <Radio.Button value="en">English</Radio.Button>
            </Radio.Group>
          </Form.Item>

          <Form.Item
            name="notifications"
            label="通知"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              保存设置
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}; 