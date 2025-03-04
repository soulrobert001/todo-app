import { Card, Typography, Row, Col, Progress, Statistic, Table } from 'antd';
import { useAppSelector } from '../../store';

const { Title, Text } = Typography;

export const StatsPage = () => {
  const todos = useAppSelector(state => state.todos.items);
  const checkIns = useAppSelector(state => state.auth.user?.checkIns || []);

  // 计算待办事项统计数据
  const completedTodos = todos.filter(todo => todo.completed);
  const completionRate = todos.length > 0 
    ? Math.round((completedTodos.length / todos.length) * 100) 
    : 0;

  // 按优先级分组
  const todosByPriority = {
    high: todos.filter(todo => todo.priority === 'high'),
    medium: todos.filter(todo => todo.priority === 'medium'),
    low: todos.filter(todo => todo.priority === 'low')
  };

  // 按分类分组
  const todosByCategory = {
    work: todos.filter(todo => todo.category === 'work'),
    personal: todos.filter(todo => todo.category === 'personal'),
    shopping: todos.filter(todo => todo.category === 'shopping'),
    study: todos.filter(todo => todo.category === 'study'),
    other: todos.filter(todo => todo.category === 'other')
  };

  // 计算心情统计
  const moodStats = {
    great: checkIns.filter(checkIn => checkIn.mood === 'great').length,
    good: checkIns.filter(checkIn => checkIn.mood === 'good').length,
    neutral: checkIns.filter(checkIn => checkIn.mood === 'neutral').length,
    bad: checkIns.filter(checkIn => checkIn.mood === 'bad').length,
    terrible: checkIns.filter(checkIn => checkIn.mood === 'terrible').length
  };

  // 计算最近完成的任务
  const recentCompletedTodos = [...completedTodos]
    .sort((a, b) => {
      const aDate = new Date(a.createdAt);
      const bDate = new Date(b.createdAt);
      return bDate.getTime() - aDate.getTime();
    })
    .slice(0, 5);

  // 表格列定义
  const columns = [
    {
      title: '任务名称',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: '优先级',
      dataIndex: 'priority',
      key: 'priority',
      render: (priority: string) => {
        const colors = {
          high: 'red',
          medium: 'orange',
          low: 'green'
        };
        return <Text style={{ color: colors[priority as keyof typeof colors] }}>{priority}</Text>;
      }
    },
    {
      title: '分类',
      dataIndex: 'category',
      key: 'category',
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: Date) => new Date(date).toLocaleDateString()
    }
  ];

  return (
    <div style={{ padding: '24px 0' }}>
      <Title level={2} style={{ marginBottom: 24 }}>统计分析</Title>
      
      <Row gutter={[16, 16]}>
        <Col xs={24} md={8}>
          <Card title="任务完成率">
            <Progress
              type="circle"
              percent={completionRate}
              format={percent => `${percent}%`}
              width={120}
              style={{ display: 'block', margin: '0 auto' }}
            />
            <div style={{ textAlign: 'center', marginTop: 16 }}>
              <Text>已完成 {completedTodos.length} / 总计 {todos.length}</Text>
            </div>
          </Card>
        </Col>
        
        <Col xs={24} md={8}>
          <Card title="按优先级">
            <div>
              <Text>高优先级：</Text>
              <Progress 
                percent={Math.round((todosByPriority.high.length / Math.max(todos.length, 1)) * 100)} 
                strokeColor="#f5222d" 
              />
            </div>
            <div>
              <Text>中优先级：</Text>
              <Progress 
                percent={Math.round((todosByPriority.medium.length / Math.max(todos.length, 1)) * 100)} 
                strokeColor="#fa8c16" 
              />
            </div>
            <div>
              <Text>低优先级：</Text>
              <Progress 
                percent={Math.round((todosByPriority.low.length / Math.max(todos.length, 1)) * 100)} 
                strokeColor="#52c41a" 
              />
            </div>
          </Card>
        </Col>
        
        <Col xs={24} md={8}>
          <Card title="按分类">
            <Row gutter={[8, 8]}>
              <Col span={12}>
                <Statistic 
                  title="工作" 
                  value={todosByCategory.work.length} 
                  valueStyle={{ fontSize: '1.2rem' }}
                />
              </Col>
              <Col span={12}>
                <Statistic 
                  title="个人" 
                  value={todosByCategory.personal.length} 
                  valueStyle={{ fontSize: '1.2rem' }}
                />
              </Col>
              <Col span={12}>
                <Statistic 
                  title="购物" 
                  value={todosByCategory.shopping.length} 
                  valueStyle={{ fontSize: '1.2rem' }}
                />
              </Col>
              <Col span={12}>
                <Statistic 
                  title="学习" 
                  value={todosByCategory.study.length} 
                  valueStyle={{ fontSize: '1.2rem' }}
                />
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
      
      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} md={12}>
          <Card title="心情统计">
            <div>
              <Text>很好：</Text>
              <Progress 
                percent={Math.round((moodStats.great / Math.max(checkIns.length, 1)) * 100)} 
                strokeColor="#52c41a" 
              />
            </div>
            <div>
              <Text>好：</Text>
              <Progress 
                percent={Math.round((moodStats.good / Math.max(checkIns.length, 1)) * 100)} 
                strokeColor="#1890ff" 
              />
            </div>
            <div>
              <Text>一般：</Text>
              <Progress 
                percent={Math.round((moodStats.neutral / Math.max(checkIns.length, 1)) * 100)} 
                strokeColor="#faad14" 
              />
            </div>
            <div>
              <Text>不好：</Text>
              <Progress 
                percent={Math.round((moodStats.bad / Math.max(checkIns.length, 1)) * 100)} 
                strokeColor="#fa8c16" 
              />
            </div>
            <div>
              <Text>糟糕：</Text>
              <Progress 
                percent={Math.round((moodStats.terrible / Math.max(checkIns.length, 1)) * 100)} 
                strokeColor="#f5222d" 
              />
            </div>
          </Card>
        </Col>
        
        <Col xs={24} md={12}>
          <Card title="最近完成的任务">
            <Table 
              dataSource={recentCompletedTodos.map(todo => ({...todo, key: todo.id}))} 
              columns={columns} 
              pagination={false}
              size="small"
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}; 