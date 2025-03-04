import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider, theme } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import { MainLayout } from './components/Layout/MainLayout';
import { AuthGuard } from './components/Layout/AuthGuard';
import { AuthPage } from './components/Auth/AuthPage';
import { TodoList } from './components/TodoList';
import { CheckInPage } from './components/CheckIn/CheckInPage';
import { StatsPage } from './components/Stats/StatsPage';
import { UserSettings } from './components/Settings/UserSettings';
import { useAppSelector } from './store';
import './App.css';

const { defaultAlgorithm, darkAlgorithm } = theme;

function App() {
  const { theme: themeMode } = useAppSelector(state => state.auth.user?.preferences || { theme: 'light' });

  return (
    <ConfigProvider
      locale={zhCN}
      theme={{
        token: {
          colorPrimary: '#1890ff',
        },
        algorithm: themeMode === 'dark' ? darkAlgorithm : defaultAlgorithm,
      }}
    >
      <BrowserRouter>
        <Routes>
          {/* 公共路由 - 不需要认证 */}
          <Route element={<AuthGuard requireAuth={false} redirectTo="/" />}>
            <Route path="/auth" element={<AuthPage />} />
          </Route>

          {/* 受保护路由 - 需要认证 */}
          <Route element={<AuthGuard requireAuth={true} redirectTo="/auth" />}>
            <Route element={<MainLayout />}>
              <Route path="/" element={<TodoList />} />
              <Route path="/checkin" element={<CheckInPage />} />
              <Route path="/stats" element={<StatsPage />} />
              <Route path="/settings" element={<UserSettings />} />
            </Route>
          </Route>

          {/* 默认重定向 */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ConfigProvider>
  );
}

export default App;
