import { create } from 'zustand';
import { User } from '../types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string) => Promise<void>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: {
    id: '1',
    name: 'राजेश कुमार',
    email: 'rajesh@example.com',
    role: 'student',
    profileImage: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150',
    preferences: {
      language: 'hi',
      theme: 'light',
      fontSize: 'medium',
    },
  },
  isAuthenticated: true,
  isLoading: false,

  login: async (email: string) => {
    set({ isLoading: true });
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockUser: User = {
      id: '1',
      name: 'राजेश कुमार',
      email,
      role: 'student',
      preferences: {
        language: 'hi',
        theme: 'light',
        fontSize: 'medium',
      },
    };
    
    set({ user: mockUser, isAuthenticated: true, isLoading: false });
  },

  logout: () => {
    set({ user: null, isAuthenticated: false });
  },

  updateUser: (updates: Partial<User>) => {
    const { user } = get();
    if (user) {
      set({ user: { ...user, ...updates } });
    }
  },
}));