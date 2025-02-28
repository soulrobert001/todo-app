import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TodoItem, TodoPriority, TodoCategory } from '../types/todo';

interface TodoState {
  items: TodoItem[];
  filter: {
    status: 'all' | 'active' | 'completed';
    priority: TodoPriority | 'all';
    category: TodoCategory | 'all';
    search: string;
  };
  sortBy: 'createdAt' | 'dueDate' | 'priority';
  sortOrder: 'asc' | 'desc';
}

const initialState: TodoState = {
  items: [],
  filter: {
    status: 'all',
    priority: 'all',
    category: 'all',
    search: ''
  },
  sortBy: 'createdAt',
  sortOrder: 'desc'
};

export const todoSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    setTodos: (state, action: PayloadAction<TodoItem[]>) => {
      state.items = action.payload;
    },
    addTodo: (state, action: PayloadAction<TodoItem>) => {
      state.items.push(action.payload);
    },
    updateTodo: (state, action: PayloadAction<TodoItem>) => {
      const index = state.items.findIndex(todo => todo.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },
    deleteTodo: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter(todo => todo.id !== action.payload);
    },
    setFilter: (state, action: PayloadAction<Partial<TodoState['filter']>>) => {
      state.filter = { ...state.filter, ...action.payload };
    },
    setSortBy: (state, action: PayloadAction<TodoState['sortBy']>) => {
      state.sortBy = action.payload;
    },
    setSortOrder: (state, action: PayloadAction<TodoState['sortOrder']>) => {
      state.sortOrder = action.payload;
    }
  }
});

export const {
  setTodos,
  addTodo,
  updateTodo,
  deleteTodo,
  setFilter,
  setSortBy,
  setSortOrder
} = todoSlice.actions;

export default todoSlice.reducer;