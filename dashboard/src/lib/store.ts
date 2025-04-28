import { create } from 'zustand';

interface User {
  id: number;
  email: string;
  roles: string[];
}

interface Notification {
  id: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: Date;
}

interface AppState {
  user: User | null;
  setUser: (user: User | null) => void;
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => void;
  removeNotification: (id: string) => void;
}

export const useAppStore = create<AppState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  notifications: [],
  addNotification: (notification) => 
    set((state) => ({ 
      notifications: [
        ...state.notifications, 
        { 
          ...notification, 
          id: Math.random().toString(36).substring(2, 9),
          timestamp: new Date(),
        }
      ] 
    })),
  removeNotification: (id) => 
    set((state) => ({ 
      notifications: state.notifications.filter((n) => n.id !== id) 
    })),
}));
