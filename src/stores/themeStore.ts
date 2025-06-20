import { create } from 'zustand';
import { Theme } from '../types';

interface ThemeState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

export const useThemeStore = create<ThemeState>((set, get) => ({
  theme: 'light',
  
  setTheme: (theme: Theme) => {
    set({ theme });
    
    // Update document class for Tailwind dark mode
    const root = document.documentElement;
    root.classList.remove('light', 'dark', 'high-contrast');
    root.classList.add(theme);
    
    // Store preference
    localStorage.setItem('vaaniplus-theme', theme);
  },
  
  toggleTheme: () => {
    const { theme } = get();
    const themes: Theme[] = ['light', 'dark', 'high-contrast'];
    const currentIndex = themes.indexOf(theme);
    const nextTheme = themes[(currentIndex + 1) % themes.length];
    get().setTheme(nextTheme);
  },
}));

// Initialize theme from localStorage
const savedTheme = localStorage.getItem('vaaniplus-theme') as Theme;
if (savedTheme) {
  useThemeStore.getState().setTheme(savedTheme);
}