export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  createdAt: Date;
  lastLogin: Date;
  checkIns: CheckIn[];
  preferences: {
    theme: 'light' | 'dark';
    language: 'zh' | 'en';
    notifications: boolean;
  };
}

export interface CheckIn {
  id: string;
  date: Date;
  mood: 'great' | 'good' | 'neutral' | 'bad' | 'terrible';
  note?: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  error: string | null;
} 