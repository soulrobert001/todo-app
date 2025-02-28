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
  const todos = useAppSelector(state => state.items);
  const filter = useAppSelector(state => state.filter);
  const sortBy = useAppSelector(state => state.sortBy);
  const sortOrder = useAppSelector(state => state.sortOrder);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingTodo, setEditingTodo] = useState<TodoItem | null>(null);
  const [form] = Form.useForm();

  const handleAddTodo = (values: any) => {
    try {
      if (editingTodo) {
        const updatedTodo: TodoItem = {
          ...editingTodo,
          title: values.title.trim(),
          dueDate: values.dueDate ? values.dueDate.toDate() : undefined,
          priority: values.priority || 'medium',
          category: values.category || 'other',
          description: values.description,
          reminder: values.reminder !== undefined ? values.reminder : false
        };
        dispatch(updateTodo(updatedTodo));
      } else {
        const todo: TodoItem = {
          id: Date.now(),
          title: values.title.trim(),
          completed: false,
          createdAt: new Date(),
          dueDate: values.dueDate ? values.dueDate.toDate() : undefined,
          priority: values.priority || 'medium',
          category: values.category || 'other',
          description: values.description || '',
          reminder: values.reminder !== undefined ? values.reminder : false
        };
        dispatch(addTodo(todo));
      }
      setIsModalVisible(false);
      setTimeout(() => {
        form.resetFields();
        setEditingTodo(null);
      }, 100);
    } catch (error) {
      console.error('添加/更新任务出错:', error);
    }
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
    .filter((todo: TodoItem) => {
      if (filter.status === 'active') return !todo.completed;
      if (filter.status === 'completed') return todo.completed;
      return true;
    })
    .filter((todo: TodoItem) => filter.priority === 'all' || todo.priority === filter.priority)
    .filter((todo: TodoItem) => filter.category === 'all' || todo.category === filter.category)
    .filter((todo: TodoItem) => todo.title.toLowerCase().includes(filter.search.toLowerCase()))
    .sort((a: TodoItem, b: TodoItem) => {
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
          <Button type="primary" icon={<PlusOutlined />} onClick={() => {
            setEditingTodo(null);
            form.resetFields();
            form.setFieldsValue({
              priority: 'medium',
              category: 'other',
              reminder: false
            });
            setIsModalVisible(true);
          }}>
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
          renderItem={(todo: TodoItem) => (
            <List.Item
              key={todo.id}
              actions={[
                <Button
                  type="text"
                  icon={<EditOutlined />}
                  onClick={() => {
                    setEditingTodo(todo);
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
        title={editingTodo ? "编辑任务" : "新建任务"}
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
            label="提醒"
            initialValue={false}
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