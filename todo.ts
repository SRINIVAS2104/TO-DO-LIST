import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Todo {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority?: 'low' | 'medium' | 'high';
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTodoData {
  title: string;
  description?: string;
  priority?: 'low' | 'medium' | 'high';
  dueDate?: string;
}

export interface UpdateTodoData {
  title?: string;
  description?: string;
  completed?: boolean;
  priority?: 'low' | 'medium' | 'high';
  dueDate?: string;
}

export class TodoService {
  private static readonly STORAGE_KEY = 'todos';

  private static generateId(): string {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }

  static async getAllTodos(): Promise<Todo[]> {
    try {
      const todosJson = await AsyncStorage.getItem(this.STORAGE_KEY);
      if (todosJson) {
        return JSON.parse(todosJson);
      }
      return [];
    } catch (error) {
      console.error('Error loading todos:', error);
      return [];
    }
  }

  static async getTodayTodos(): Promise<Todo[]> {
    const allTodos = await this.getAllTodos();
    const today = new Date().toDateString();
    
    return allTodos.filter(todo => {
      if (!todo.dueDate) return true; // Include todos without due dates in today's view
      const todoDate = new Date(todo.dueDate).toDateString();
      const isOverdue = new Date(todo.dueDate) < new Date() && !todo.completed;
      return todoDate === today || isOverdue;
    });
  }

  static async createTodo(data: CreateTodoData): Promise<Todo> {
    const newTodo: Todo = {
      id: this.generateId(),
      title: data.title,
      description: data.description,
      completed: false,
      priority: data.priority || 'medium',
      dueDate: data.dueDate,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const todos = await this.getAllTodos();
    todos.push(newTodo);
    
    await AsyncStorage.setItem(this.STORAGE_KEY, JSON.stringify(todos));
    return newTodo;
  }

  static async updateTodo(id: string, updates: UpdateTodoData): Promise<Todo | null> {
    const todos = await this.getAllTodos();
    const todoIndex = todos.findIndex(todo => todo.id === id);
    
    if (todoIndex === -1) {
      return null;
    }

    todos[todoIndex] = {
      ...todos[todoIndex],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    await AsyncStorage.setItem(this.STORAGE_KEY, JSON.stringify(todos));
    return todos[todoIndex];
  }

  static async deleteTodo(id: string): Promise<boolean> {
    const todos = await this.getAllTodos();
    const filteredTodos = todos.filter(todo => todo.id !== id);
    
    await AsyncStorage.setItem(this.STORAGE_KEY, JSON.stringify(filteredTodos));
    return true;
  }

  static async getCompletedCount(): Promise<number> {
    const todos = await this.getAllTodos();
    return todos.filter(todo => todo.completed).length;
  }

  static async getTotalCount(): Promise<number> {
    const todos = await this.getAllTodos();
    return todos.length;
  }
}