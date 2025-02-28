import { configureStore } from '@reduxjs/toolkit';
import todoReducer from './todoSlice';

const loadState = () => {
  try {
    const serializedState = localStorage.getItem('todoState');
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch (err) {
    return undefined;
  }
};

const saveState = (state: RootState) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem('todoState', serializedState);
  } catch (err) {
    // 忽略写入错误
  }
};

export const store = configureStore({
  reducer: todoReducer,
  preloadedState: loadState()
});

store.subscribe(() => {
  saveState(store.getState());
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

// 创建自定义hooks用于在组件中访问store

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;