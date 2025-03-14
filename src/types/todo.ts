export type TodoPriority = 'high' | 'medium' | 'low';
export type TodoCategory = 'work' | 'personal' | 'shopping' | 'study' | 'other';

export interface TodoItem {
  id: number;
  title: string;
  completed: boolean;
  createdAt: Date;
  dueDate?: Date;
  priority: TodoPriority;
  category: TodoCategory;
  description: string;
  reminder: boolean;
}