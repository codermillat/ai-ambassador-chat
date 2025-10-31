// Fix: Define and export interfaces and types. This file should not contain constants or circular dependencies.
export interface User {
  id: number;
  name: string;
  avatar: string;
  isOnline: boolean;
  title: string;
  subtitle: string;
  country: string;
  qualification: string;
  about: string;
  flag: string;
  isAi: boolean;
}

export type View = 'main' | 'chat' | 'signin';

export type Tab = 'student' | 'staff' | 'ai_ambassador' | 'inbox' | 'content' | 'scholarships';

export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: string;
  mailtoLink?: string;
  pdfGenerator?: () => void;
}