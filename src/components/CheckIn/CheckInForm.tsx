import { Form, Input, Button, Radio, Card, Typography, DatePicker, message } from 'antd';
import { SmileOutlined, MehOutlined, FrownOutlined } from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from '../../store';
import { addCheckIn } from '../../store/authSlice';
import { CheckIn } from '../../types/user';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { TextArea } = Input;

interface CheckInFormValues {
  date: dayjs.Dayjs;
  mood: CheckIn['mood'];
  note?: string;
}

export const CheckInForm = () => {
  const dispatch = useAppDispatch();
  const [form] = Form.useForm();
  const user = useAppSelector(state => state.auth.user);
  const checkIns = user?.checkIns || [];

  const handleSubmit = (values: CheckInFormValues) => {
    dispatch(addCheckIn({
      date: values.date.toDate(),
      mood: values.mood,
      note: values.note
    }));
    
    message.success('打卡成功！');
    form.resetFields();
  };

  const hasCheckedInToday = checkIns.some(checkIn => {
    const checkInDate = new Date(checkIn.date);
    const today = new Date();
    return checkInDate.getDate() === today.getDate() &&
           checkInDate.getMonth() === today.getMonth() &&
           checkInDate.getFullYear() === today.getFullYear();
  });

  return (
    <Card style={{ width: '100%' }}>
      <Title level={3}>每日打卡</Title>
      <Text type="secondary">记录您的心情和日常笔记</Text>
      
      {hasCheckedInToday ? (
        <div style={{ marginTop: 16, textAlign: 'center' }}>
          <Text strong style={{ fontSize: 16, color: '#52c41a' }}>
            <SmileOutlined style={{ marginRight: 8 }} />
            您今天已经打卡了！
          </Text>
        </div>
      ) : (
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            date: dayjs(),
            mood: 'good'
          }}
          style={{ marginTop: 24 }}
        >
          <Form.Item
            name="date"
            label="日期"
            rules={[{ required: true, message: '请选择日期' }]}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          
          <Form.Item
            name="mood"
            label="今日心情"
            rules={[{ required: true, message: '请选择心情' }]}
          >
            <Radio.Group>
              <Radio.Button value="great">
                <SmileOutlined style={{ color: '#52c41a' }} /> 很好
              </Radio.Button>
              <Radio.Button value="good">
                <SmileOutlined style={{ color: '#1890ff' }} /> 好
              </Radio.Button>
              <Radio.Button value="neutral">
                <MehOutlined style={{ color: '#faad14' }} /> 一般
              </Radio.Button>
              <Radio.Button value="bad">
                <FrownOutlined style={{ color: '#fa8c16' }} /> 不好
              </Radio.Button>
              <Radio.Button value="terrible">
                <FrownOutlined style={{ color: '#f5222d' }} /> 糟糕
              </Radio.Button>
            </Radio.Group>
          </Form.Item>
          
          <Form.Item
            name="note"
            label="笔记"
          >
            <TextArea rows={4} placeholder="写下今天的感想..." />
          </Form.Item>
          
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              打卡
            </Button>
          </Form.Item>
        </Form>
      )}
    </Card>
  );
}; 