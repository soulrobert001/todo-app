import { useState } from 'react';
import { TodoItem } from '../types/todo';
import { useAppDispatch, useAppSelector } from '../store';
import { addTodo, updateTodo, deleteTodo, setFilter, setSortBy, setSortOrder } from '../store/todoSlice';
import { Button, Input, Select, DatePicker, Space, Card, List, Tag, Modal, Form, Radio } from 'antd';
import { PlusOutlined, DeleteOutlined, EditOutlined, CalendarOutlined, SortAscendingOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { Option } = Select;
const { TextArea } = Input;

export function TodoList() {
  const dispatch = useAppDispatch();
  const todos = useAppSelector(state => state.todos.items);
  const filter = useAppSelector(state => state.todos.filter);
  const sortBy = useAppSelector(state => state.todos.sortBy);
  const sortOrder = useAppSelector(state => state.todos.sortOrder);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  const handleAddTodo = (values: any) => {
    const todo: TodoItem = {
      id: Date.now(),
      title: values.title.trim(),
      completed: false,
      createdAt: new Date(),
      dueDate: values.dueDate?.toDate(),
      priority: values.priority,
      category: values.category,
      description: values.description,
      reminder: values.reminder
    };
    dispatch(addTodo(todo));
    form.resetFields();
    setIsModalVisible(false);
  };

  const handleToggleTodo = (todo: TodoItem) => {
    dispatch(updateTodo({ ...todo, completed: !todo.completed }));
  };

  const handleDeleteTodo = (id: number) => {
    dispatch(deleteTodo(id));
  };

  const handleFilterChange = (type: string, value: any) => {
    dispatch(setFilter({ [type]: value }));
  };

  const handleSortChange = (value: any) => {
    dispatch(setSortBy(value));
  };

  const handleSortOrderChange = () => {
    dispatch(setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc'));
  };

  const filteredTodos = todos
    .filter(todo => {
      if (filter.status === 'active') return !todo.completed;
      if (filter.status === 'completed') return todo.completed;
      return true;
    })
    .filter(todo => filter.priority === 'all' || todo.priority === filter.priority)
    .filter(todo => filter.category === 'all' || todo.category === filter.category)
    .filter(todo => todo.title.toLowerCase().includes(filter.search.toLowerCase()))
    .sort((a, b) => {
      let comparison = 0;
      if (sortBy === 'createdAt') {
        comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      } else if (sortBy === 'dueDate') {
        const aTime = a.dueDate ? new Date(a.dueDate).getTime() : Infinity;
        const bTime = b.dueDate ? new Date(b.dueDate).getTime() : Infinity;
        comparison = aTime - bTime;
      } else if (sortBy === 'priority') {
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        comparison = priorityOrder[a.priority] - priorityOrder[b.priority];
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

  return (
    <Card className="todo-list" title="待办事项管理系统">
      <Space direction="vertical" style={{ width: '100%' }} size="large">
        <Space wrap>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalVisible(true)}>
            新建任务
          </Button>
          <Input.Search
            placeholder="搜索任务"
            style={{ width: 200 }}
            onChange={e => handleFilterChange('search', e.target.value)}
          />
          <Select
            defaultValue="all"
            style={{ width: 120 }}
            onChange={value => handleFilterChange('status', value)}
          >
            <Option value="all">全部</Option>
            <Option value="active">进行中</Option>
            <Option value="completed">已完成</Option>
          </Select>
          <Select
            defaultValue="all"
            style={{ width: 120 }}
            onChange={value => handleFilterChange('priority', value)}
          >
            <Option value="all">全部优先级</Option>
            <Option value="high">高优先级</Option>
            <Option value="medium">中优先级</Option>
            <Option value="low">低优先级</Option>
          </Select>
          <Select
            defaultValue="all"
            style={{ width: 120 }}
            onChange={value => handleFilterChange('category', value)}
          >
            <Option value="all">全部分类</Option>
            <Option value="work">工作</Option>
            <Option value="personal">个人</Option>
            <Option value="shopping">购物</Option>
            <Option value="study">学习</Option>
            <Option value="other">其他</Option>
          </Select>
          <Select
            defaultValue="createdAt"
            style={{ width: 120 }}
            onChange={handleSortChange}
          >
            <Option value="createdAt">创建时间</Option>
            <Option value="dueDate">截止日期</Option>
            <Option value="priority">优先级</Option>
          </Select>
          <Button
            icon={<SortAscendingOutlined />}
            onClick={handleSortOrderChange}
          >
            {sortOrder === 'asc' ? '升序' : '降序'}
          </Button>
        </Space>

        <List
          dataSource={filteredTodos}
          renderItem={todo => (
            <List.Item
              key={todo.id}
              actions={[
                <Button
                  type="text"
                  icon={<EditOutlined />}
                  onClick={() => {
                    form.setFieldsValue({
                      ...todo,
                      dueDate: todo.dueDate ? dayjs(todo.dueDate) : undefined
                    });
                    setIsModalVisible(true);
                  }}
                />,
                <Button
                  type="text"
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() => handleDeleteTodo(todo.id)}
                />
              ]}
            >
              <List.Item.Meta
                title={
                  <Space>
                    <input
                      type="checkbox"
                      checked={todo.completed}
                      onChange={() => handleToggleTodo(todo)}
                    />
                    <span style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}>
                      {todo.title}
                    </span>
                    <Tag color={todo.priority === 'high' ? 'red' : todo.priority === 'medium' ? 'orange' : 'green'}>
                      {todo.priority === 'high' ? '高' : todo.priority === 'medium' ? '中' : '低'}
                    </Tag>
                    <Tag color="blue">{todo.category}</Tag>
                  </Space>
                }
                description={
                  <Space direction="vertical">
                    {todo.description && <div>{todo.description}</div>}
                    {todo.dueDate && (
                      <Space>
                        <CalendarOutlined />
                        {dayjs(todo.dueDate).format('YYYY-MM-DD HH:mm')}
                      </Space>
                    )}
                  </Space>
                }
              />
            </List.Item>
          )}
        />
      </Space>

      <Modal
        title="任务详情"
        open={isModalVisible}
        onOk={() => form.submit()}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
        }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleAddTodo}
        >
          <Form.Item
            name="title"
            label="标题"
            rules={[{ required: true, message: '请输入任务标题' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="description"
            label="描述"
          >
            <TextArea rows={4} />
          </Form.Item>
          <Form.Item
            name="priority"
            label="优先级"
            rules={[{ required: true, message: '请选择优先级' }]}
          >
            <Radio.Group>
              <Radio.Button value="high">高</Radio.Button>
              <Radio.Button value="medium">中</Radio.Button>
              <Radio.Button value="low">低</Radio.Button>
            </Radio.Group>
          </Form.Item>
          <Form.Item
            name="category"
            label="分类"
            rules={[{ required: true, message: '请选择分类' }]}
          >
            <Select>
              <Option value="work">工作</Option>
              <Option value="personal">个人</Option>
              <Option value="shopping">购物</Option>
              <Option value="study">学习</Option>
              <Option value="other">其他</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="dueDate"
            label="截止日期"
          >
            <DatePicker showTime />
          </Form.Item>
          <Form.Item
            name="reminder"
            valuePropName="checked"
          >
            <Radio.Group>
              <Radio value={true}>开启提醒</Radio>
              <Radio value={false}>关闭提醒</Radio>
            </Radio.Group>
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
}