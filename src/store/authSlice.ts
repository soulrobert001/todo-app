import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User, AuthState, CheckIn } from '../types/user';
import { AppDispatch } from './index';

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  loading: false,
  error: null
};

// 模拟用户数据（实际应用中应该从数据库获取）
const mockUsers: User[] = [
  {
    id: '1',
    username: 'demo',
    email: 'demo@example.com',
    createdAt: new Date('2023-01-01'),
    lastLogin: new Date(),
    checkIns: [
      {
        id: '1',
        date: new Date('2023-03-01'),
        mood: 'good',
        note: '今天完成了项目规划'
      }
    ],
    preferences: {
      theme: 'light',
      language: 'zh',
      notifications: true
    }
  }
];

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action: PayloadAction<User>) => {
      state.isAuthenticated = true;
      state.user = action.payload;
      state.loading = false;
      state.error = null;
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
    },
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
    addCheckIn: (state, action: PayloadAction<Omit<CheckIn, 'id'>>) => {
      if (state.user) {
        const newCheckIn = {
          id: Date.now().toString(),
          ...action.payload
        };
        state.user.checkIns = [...state.user.checkIns, newCheckIn];
      }
    }
  }
});

// 模拟登录函数
export const loginUser = (username: string, password: string) => async (dispatch: AppDispatch) => {
  dispatch(loginStart());
  
  try {
    // 模拟API调用延迟
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // 检查用户是否存在
    const user = mockUsers.find(u => u.username === username);
    
    if (user && password === '123456') { // 在实际应用中应使用加密密码
      dispatch(loginSuccess({
        ...user,
        lastLogin: new Date()
      }));
      return { success: true };
    } else {
      dispatch(loginFailure('用户名或密码错误'));
      return { success: false, error: '用户名或密码错误' };
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : '登录失败，请稍后再试';
    dispatch(loginFailure(errorMessage));
    return { success: false, error: errorMessage };
  }
};

// 模拟注册函数
export const registerUser = (username: string, email: string, password: string) => async (dispatch: AppDispatch) => {
  dispatch(loginStart());
  
  try {
    // 模拟API调用延迟
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // 检查用户是否已存在
    const userExists = mockUsers.some(u => u.username === username || u.email === email);
    
    if (userExists) {
      dispatch(loginFailure('用户名或邮箱已被使用'));
      return { success: false, error: '用户名或邮箱已被使用' };
    } else if (password.length < 6) {
      // 密码长度验证
      dispatch(loginFailure('密码长度必须至少为6个字符'));
      return { success: false, error: '密码长度必须至少为6个字符' };
    } else {
      // 在实际应用中，这里应该对密码进行哈希处理
      // const hashedPassword = hashPassword(password);
      
      const newUser: User = {
        id: (mockUsers.length + 1).toString(),
        username,
        email,
        // password: hashedPassword, // 在实际应用中会存储哈希后的密码
        createdAt: new Date(),
        lastLogin: new Date(),
        checkIns: [],
        preferences: {
          theme: 'light',
          language: 'zh',
          notifications: true
        }
      };
      
      mockUsers.push(newUser);
      dispatch(loginSuccess(newUser));
      return { success: true };
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : '注册失败，请稍后再试';
    dispatch(loginFailure(errorMessage));
    return { success: false, error: errorMessage };
  }
};

export const { 
  loginStart, 
  loginSuccess, 
  loginFailure, 
  logout, 
  updateUser,
  addCheckIn
} = authSlice.actions;

export default authSlice.reducer; 