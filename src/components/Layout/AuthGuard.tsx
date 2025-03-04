import { Navigate, Outlet } from 'react-router-dom';
import { useAppSelector } from '../../store';

interface AuthGuardProps {
  requireAuth: boolean;
  redirectTo: string;
}

export const AuthGuard = ({ requireAuth, redirectTo }: AuthGuardProps) => {
  const { isAuthenticated } = useAppSelector(state => state.auth);

  // 如果需要认证但未认证，重定向到登录页
  if (requireAuth && !isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  // 如果已认证但访问登录页，重定向到首页
  if (!requireAuth && isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  // 正常渲染子路由
  return <Outlet />;
}; 