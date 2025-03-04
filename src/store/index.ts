import { configureStore, combineReducers } from '@reduxjs/toolkit';
import todoReducer from './todoSlice';
import authReducer from './authSlice';

// 定义root reducer，组合所有功能的reducer
const rootReducer = combineReducers({
  todos: todoReducer,
  auth: authReducer
});

const loadState = () => {
  try {
    const serializedState = localStorage.getItem('appState');
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch {
    return undefined;
  }
};

const saveState = (state: RootState) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem('appState', serializedState);
  } catch {
    // 忽略写入错误
  }
};

export const store = configureStore({
  reducer: rootReducer,
  preloadedState: loadState()
});

store.subscribe(() => {
  saveState(store.getState());
});

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;

import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

// 创建自定义hooks用于在组件中访问store
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;