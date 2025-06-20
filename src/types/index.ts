export interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'teacher' | 'parent' | 'hr';
  profileImage?: string;
  preferences: {
    language: string;
    theme: 'light' | 'dark' | 'high-contrast';
    fontSize: 'small' | 'medium' | 'large';
  };
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  category: 'math' | 'science' | 'alphabets' | 'numbers' | 'sentences';
  level: 'beginner' | 'intermediate' | 'advanced';
  duration: number;
  videoUrl?: string;
  avatarData?: string;
  isCompleted: boolean;
  progress: number;
}

export interface Progress {
  userId: string;
  lessonId: string;
  completionPercentage: number;
  lastAccessed: Date;
  score?: number;
}

export interface Translation {
  id: string;
  text: string;
  language: string;
  islVideoUrl?: string;
  avatarData?: string;
  timestamp: Date;
}

export type Theme = 'light' | 'dark' | 'high-contrast';
export type Language = 'en' | 'hi' | 'gu' | 'ta' | 'kn' | 'bn' | 'ur';
export type UserRole = 'student' | 'teacher' | 'parent' | 'hr';