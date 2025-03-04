declare module 'react-router-dom' {
  import * as React from 'react';

  export interface RouteProps {
    path?: string;
    element?: React.ReactNode;
    children?: React.ReactNode;
  }

  export const Routes: React.FC<{children: React.ReactNode}>;
  export const Route: React.FC<RouteProps>;
  export const BrowserRouter: React.FC<{children: React.ReactNode}>;
  export const Link: React.FC<{to: string; style?: React.CSSProperties; children: React.ReactNode}>;
  export function useNavigate(): (path: string) => void;
  export function useLocation(): {pathname: string; search: string; hash: string};
  export const Outlet: React.FC;
  export const Navigate: React.FC<{to: string; replace?: boolean}>;
} 