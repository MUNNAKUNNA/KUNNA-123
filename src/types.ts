export type AssistantMode = 
  | 'chat'
  | 'personal'
  | 'voice'
  | 'coding'
  | 'creative'
  | 'device'
  | 'web';

export type SupportedLanguage = 
  | 'auto'
  | 'english'
  | 'hindi'
  | 'odia'
  | 'sambalpuri';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  mode?: AssistantMode;
  actions?: Array<{ type: string; title: string; detail?: string }>;
  groundingSources?: Array<{ uri: string; title: string }>;
}

export interface UserPreferences {
  name: string;
  language: SupportedLanguage;
  style: 'concise' | 'balanced' | 'detailed';
  voiceEnabled: boolean;
  voiceSpeed: number;
  voicePitch: number;
  speechLang: string;
}

export interface ReminderItem {
  id: string;
  title: string;
  dueTime: string;
  completed: boolean;
  type: 'reminder' | 'todo' | 'schedule';
  priority: 'normal' | 'high';
}

export interface NoteItem {
  id: string;
  title: string;
  content: string;
  tag: string;
  updatedAt: string;
}

export interface DeviceApp {
  id: string;
  name: string;
  icon: string;
  category: 'productivity' | 'media' | 'system' | 'social';
  actionUrl?: string;
  description: string;
}

export interface DeviceNotification {
  id: string;
  app: string;
  title: string;
  message: string;
  time: string;
  unread: boolean;
}
