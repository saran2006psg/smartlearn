import { create } from 'zustand';
import { Language } from '../types';
import i18n from '../i18n';

interface LanguageState {
  language: Language;
  setLanguage: (language: Language) => void;
  isRTL: boolean;
}

export const useLanguageStore = create<LanguageState>((set) => ({
  language: 'hi',
  isRTL: false,
  
  setLanguage: (language: Language) => {
    const isRTL = language === 'ur';
    
    set({ language, isRTL });
    
    // Update i18n
    i18n.changeLanguage(language);
    
    // Update document direction
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
    
    // Store preference
    localStorage.setItem('vaaniplus-language', language);
  },
}));

// Initialize language from localStorage
const savedLanguage = localStorage.getItem('vaaniplus-language') as Language;
if (savedLanguage) {
  useLanguageStore.getState().setLanguage(savedLanguage);
}