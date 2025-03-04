import { Row, Col, Card, Typography, Statistic } from 'antd';
import { CalendarOutlined, BarChartOutlined, TrophyOutlined } from '@ant-design/icons';
import { useAppSelector } from '../../store';
import { CheckInForm } from './CheckInForm';
import { CheckInHistory } from './CheckInHistory';

const { Title } = Typography;

export const CheckInPage = () => {
  const checkIns = useAppSelector(state => state.auth.user?.checkIns || []);
  
  // 计算连续打卡天数
  const calculateStreak = (): number => {
    if (checkIns.length === 0) return 0;
    
    const sortedDates = [...checkIns]
      .map(checkIn => new Date(checkIn.date))
      .sort((a, b) => b.getTime() - a.getTime());
    
    // 检查最近的打卡是否是今天
    const today = new Date();
    const latestDate = sortedDates[0];
    const isToday = latestDate.getDate() === today.getDate() && 
                   latestDate.getMonth() === today.getMonth() && 
                   latestDate.getFullYear() === today.getFullYear();
    
    if (!isToday) return 0;
    
    let streak = 1;
    let currentDate = latestDate;
    
    for (let i = 1; i < sortedDates.length; i++) {
      const prevDate = new Date(currentDate);
      prevDate.setDate(prevDate.getDate() - 1);
      
      if (
        sortedDates[i].getDate() === prevDate.getDate() && 
        sortedDates[i].getMonth() === prevDate.getMonth() && 
        sortedDates[i].getFullYear() === prevDate.getFullYear()
      ) {
        streak++;
        currentDate = sortedDates[i];
      } else {
        break;
      }
    }
    
    return streak;
  };
  
  // 计算本周打卡次数
  const calculateWeeklyCheckIns = (): number => {
    if (checkIns.length === 0) return 0;
    
    const today = new Date();
    const firstDayOfWeek = new Date(today);
    const day = today.getDay() || 7; // 如果是周日，getDay()返回0，设置为7
    firstDayOfWeek.setDate(today.getDate() - day + 1); // 周一
    firstDayOfWeek.setHours(0, 0, 0, 0);
    
    return checkIns.filter(checkIn => {
      const checkInDate = new Date(checkIn.date);
      return checkInDate >= firstDayOfWeek;
    }).length;
  };
  
  // 计算总打卡天数
  const totalCheckIns = checkIns.length;
  
  return (
    <div style={{ padding: '24px 0' }}>
      <Title level={2} style={{ marginBottom: 24 }}>打卡系统</Title>
      
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic 
              title="连续打卡" 
              value={calculateStreak()} 
              suffix="天" 
              prefix={<CalendarOutlined />} 
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic 
              title="本周打卡" 
              value={calculateWeeklyCheckIns()} 
              suffix="次" 
              prefix={<BarChartOutlined />} 
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic 
              title="总打卡天数" 
              value={totalCheckIns} 
              suffix="天" 
              prefix={<TrophyOutlined />} 
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
      </Row>
      
      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        <Col xs={24} md={12}>
          <CheckInForm />
        </Col>
        <Col xs={24} md={12}>
          <CheckInHistory />
        </Col>
      </Row>
    </div>
  );
}; 