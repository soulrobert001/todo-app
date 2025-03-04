import { Card, Typography, List, Tag, Empty, Tooltip } from 'antd';
import { SmileOutlined, MehOutlined, FrownOutlined, CalendarOutlined } from '@ant-design/icons';
import { useAppSelector } from '../../store';
import { CheckIn } from '../../types/user';
import dayjs from 'dayjs';

const { Title, Text, Paragraph } = Typography;

export const CheckInHistory = () => {
  const checkIns = useAppSelector(state => state.auth.user?.checkIns || []);

  const getMoodIcon = (mood: CheckIn['mood']) => {
    switch (mood) {
      case 'great':
        return <SmileOutlined style={{ color: '#52c41a' }} />;
      case 'good':
        return <SmileOutlined style={{ color: '#1890ff' }} />;
      case 'neutral':
        return <MehOutlined style={{ color: '#faad14' }} />;
      case 'bad':
        return <FrownOutlined style={{ color: '#fa8c16' }} />;
      case 'terrible':
        return <FrownOutlined style={{ color: '#f5222d' }} />;
      default:
        return <MehOutlined />;
    }
  };

  const getMoodText = (mood: CheckIn['mood']) => {
    switch (mood) {
      case 'great':
        return '很好';
      case 'good':
        return '好';
      case 'neutral':
        return '一般';
      case 'bad':
        return '不好';
      case 'terrible':
        return '糟糕';
      default:
        return '未知';
    }
  };

  const getMoodColor = (mood: CheckIn['mood']) => {
    switch (mood) {
      case 'great':
        return '#52c41a';
      case 'good':
        return '#1890ff';
      case 'neutral':
        return '#faad14';
      case 'bad':
        return '#fa8c16';
      case 'terrible':
        return '#f5222d';
      default:
        return '#d9d9d9';
    }
  };

  // 按日期降序排序
  const sortedCheckIns = [...checkIns].sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  return (
    <Card style={{ width: '100%' }}>
      <Title level={3}>打卡历史</Title>
      <Text type="secondary">查看您的打卡记录</Text>
      
      {sortedCheckIns.length === 0 ? (
        <Empty
          description="暂无打卡记录"
          style={{ margin: '24px 0' }}
        />
      ) : (
        <List
          style={{ marginTop: 16 }}
          itemLayout="horizontal"
          dataSource={sortedCheckIns}
          renderItem={(checkIn) => {
            const checkInDate = new Date(checkIn.date);
            return (
              <List.Item>
                <List.Item.Meta
                  title={
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <Tooltip title={dayjs(checkInDate).format('YYYY-MM-DD HH:mm:ss')}>
                        <Text>
                          <CalendarOutlined style={{ marginRight: 8 }} />
                          {dayjs(checkInDate).format('YYYY年MM月DD日')}
                        </Text>
                      </Tooltip>
                      <Tag color={getMoodColor(checkIn.mood)} style={{ marginLeft: 12 }}>
                        {getMoodIcon(checkIn.mood)} {getMoodText(checkIn.mood)}
                      </Tag>
                    </div>
                  }
                  description={
                    checkIn.note ? (
                      <Paragraph
                        ellipsis={{ rows: 2, expandable: true, symbol: '展开' }}
                        style={{ marginTop: 8, marginBottom: 0 }}
                      >
                        {checkIn.note}
                      </Paragraph>
                    ) : (
                      <Text type="secondary">无笔记</Text>
                    )
                  }
                />
              </List.Item>
            );
          }}
        />
      )}
    </Card>
  );
}; 