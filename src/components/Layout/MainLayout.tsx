import { useState } from 'react';
import { Layout, Menu, Button, Avatar, Dropdown, theme } from 'antd';
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  UserOutlined,
  CheckSquareOutlined,
  CalendarOutlined,
  SettingOutlined,
  LogoutOutlined,
  BarChartOutlined,
  HomeOutlined
} from '@ant-design/icons';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store';
import { logout } from '../../store/authSlice';

const { Header, Sider, Content } = Layout;

export const MainLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const user = useAppSelector(state => state.auth.user);
  const { token } = theme.useToken();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/auth');
  };

  const items = [
    {
      key: '/',
      icon: <HomeOutlined />,
      label: <Link to="/">待办事项</Link>,
    },
    {
      key: '/checkin',
      icon: <CalendarOutlined />,
      label: <Link to="/checkin">打卡</Link>,
    },
    {
      key: '/stats',
      icon: <BarChartOutlined />,
      label: <Link to="/stats">统计</Link>,
    },
    {
      key: '/settings',
      icon: <SettingOutlined />,
      label: <Link to="/settings">设置</Link>,
    },
  ];

  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: '个人资料',
      onClick: () => navigate('/settings')
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
      onClick: handleLogout
    }
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider trigger={null} collapsible collapsed={collapsed} theme="light">
        <div style={{ 
          height: 64, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          padding: '16px'
        }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center' }}>
            <CheckSquareOutlined style={{ fontSize: 24, color: token.colorPrimary }} />
            {!collapsed && <span style={{ marginLeft: 12, fontSize: 18, fontWeight: 'bold' }}>任务管理系统</span>}
          </Link>
        </div>
        <Menu
          theme="light"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={items}
        />
      </Sider>
      <Layout>
        <Header style={{ 
          padding: '0 16px', 
          background: token.colorBgContainer, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          boxShadow: '0 1px 4px rgba(0,21,41,.08)'
        }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{ fontSize: '16px', width: 64, height: 64 }}
          />
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {user && (
              <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
                <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                  <Avatar 
                    icon={<UserOutlined />} 
                    src={user.avatar}
                    style={{ marginRight: 8 }}
                  />
                  <span>{user.username}</span>
                </div>
              </Dropdown>
            )}
          </div>
        </Header>
        <Content style={{ 
          margin: '24px 16px', 
          padding: 24, 
          background: token.colorBgContainer,
          borderRadius: token.borderRadius,
          minHeight: 280
        }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};