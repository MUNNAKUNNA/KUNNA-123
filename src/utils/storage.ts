import { UserPreferences, ReminderItem, NoteItem, ChatMessage } from '../types';

const PREFS_KEY = 'mayra_user_preferences_v1';
const REMINDERS_KEY = 'mayra_reminders_v1';
const NOTES_KEY = 'mayra_notes_v1';
const CHAT_KEY = 'mayra_chat_history_v1';

export const defaultPreferences: UserPreferences = {
  name: 'Munna',
  language: 'auto',
  style: 'concise',
  voiceEnabled: true,
  voiceSpeed: 1.0,
  voicePitch: 1.05,
  speechLang: 'en-US',
};

export const defaultReminders: ReminderItem[] = [
  {
    id: 'rem-1',
    title: 'Review Kotlin Jetpack Compose code structure',
    dueTime: 'Today, 4:00 PM',
    completed: false,
    type: 'todo',
    priority: 'high',
  },
  {
    id: 'rem-2',
    title: 'Check YouTube video script and prompt concepts',
    dueTime: 'Today, 7:30 PM',
    completed: false,
    type: 'reminder',
    priority: 'normal',
  },
  {
    id: 'rem-3',
    title: 'Study Odia and Sambalpuri language prompts',
    dueTime: 'Tomorrow, 10:00 AM',
    completed: true,
    type: 'schedule',
    priority: 'normal',
  },
];

export const defaultNotes: NoteItem[] = [
  {
    id: 'note-1',
    title: 'Android Permissions Guide',
    content: 'Remember to declare RECORD_AUDIO and POST_NOTIFICATIONS in AndroidManifest.xml and request runtime permissions before starting Foreground Services.',
    tag: 'Android',
    updatedAt: 'Today',
  },
  {
    id: 'note-2',
    title: 'Creative Prompt Guidelines',
    content: 'Always include Subject, Environment, Lighting, Camera, Composition, Color palette, Style, Mood, Aspect ratio, and Typography.',
    tag: 'Creative',
    updatedAt: 'Yesterday',
  },
];

export const loadPreferences = (): UserPreferences => {
  try {
    const raw = localStorage.getItem(PREFS_KEY);
    return raw ? { ...defaultPreferences, ...JSON.parse(raw) } : defaultPreferences;
  } catch (e) {
    return defaultPreferences;
  }
};

export const savePreferences = (prefs: UserPreferences) => {
  try {
    localStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
  } catch (e) {
    console.error('Failed to save preferences:', e);
  }
};

export const loadReminders = (): ReminderItem[] => {
  try {
    const raw = localStorage.getItem(REMINDERS_KEY);
    return raw ? JSON.parse(raw) : defaultReminders;
  } catch (e) {
    return defaultReminders;
  }
};

export const saveReminders = (items: ReminderItem[]) => {
  try {
    localStorage.setItem(REMINDERS_KEY, JSON.stringify(items));
  } catch (e) {
    console.error('Failed to save reminders:', e);
  }
};

export const loadNotes = (): NoteItem[] => {
  try {
    const raw = localStorage.getItem(NOTES_KEY);
    return raw ? JSON.parse(raw) : defaultNotes;
  } catch (e) {
    return defaultNotes;
  }
};

export const saveNotes = (items: NoteItem[]) => {
  try {
    localStorage.setItem(NOTES_KEY, JSON.stringify(items));
  } catch (e) {
    console.error('Failed to save notes:', e);
  }
};

export const loadChatHistory = (): ChatMessage[] => {
  try {
    const raw = localStorage.getItem(CHAT_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
};

export const saveChatHistory = (messages: ChatMessage[]) => {
  try {
    // Keep last 30 messages in storage
    const trimmed = messages.slice(-30);
    localStorage.setItem(CHAT_KEY, JSON.stringify(trimmed));
  } catch (e) {
    console.error('Failed to save chat history:', e);
  }
};

export const clearMemoryAndHistory = () => {
  try {
    localStorage.removeItem(CHAT_KEY);
    localStorage.removeItem(REMINDERS_KEY);
    localStorage.removeItem(NOTES_KEY);
  } catch (e) {
    console.error('Failed to clear memory:', e);
  }
};
