/**
 * MAYRA AI ASSISTANT
 * Smart, friendly, fast and reliable AI personal assistant
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, 
  Mic, 
  MicOff, 
  Sparkles, 
  Globe, 
  Trash2, 
  StopCircle,
  HelpCircle,
  Clock,
  Compass,
  ArrowUp
} from 'lucide-react';
import { 
  AssistantMode, 
  ChatMessage, 
  UserPreferences, 
  ReminderItem, 
  NoteItem, 
  SupportedLanguage 
} from './types';
import { 
  loadPreferences, 
  savePreferences, 
  loadReminders, 
  saveReminders, 
  loadNotes, 
  saveNotes, 
  loadChatHistory, 
  saveChatHistory,
  clearMemoryAndHistory 
} from './utils/storage';
import { 
  startListening, 
  speakText, 
  stopSpeech, 
  isSpeechRecognitionSupported, 
  isSpeechSynthesisSupported 
} from './utils/speech';
import { Header } from './components/Header';
import { ChatTimeline } from './components/ChatTimeline';
import { VoiceCanvas } from './components/VoiceCanvas';
import { PersonalHub } from './components/PersonalHub';
import { DeviceSimulator } from './components/DeviceSimulator';
import { CreativeStudio } from './components/CreativeStudio';
import { CodingHub } from './components/CodingHub';
import { PreferencesModal } from './components/PreferencesModal';

export default function App() {
  const [currentMode, setCurrentMode] = useState<AssistantMode>('chat');
  const [userPreferences, setUserPreferences] = useState<UserPreferences>(loadPreferences);
  const [reminders, setReminders] = useState<ReminderItem[]>(loadReminders);
  const [notes, setNotes] = useState<NoteItem[]>(loadNotes);
  const [messages, setMessages] = useState<ChatMessage[]>(loadChatHistory);
  
  const [inputPrompt, setInputPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [searchGrounding, setSearchGrounding] = useState(false);
  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);

  // Voice State
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceTranscript, setVoiceTranscript] = useState('');
  const [lastSpokenResponse, setLastSpokenResponse] = useState<string | null>(null);

  const stopListeningRef = useRef<(() => void) | null>(null);

  // Sync state to local storage
  useEffect(() => {
    savePreferences(userPreferences);
  }, [userPreferences]);

  useEffect(() => {
    saveReminders(reminders);
  }, [reminders]);

  useEffect(() => {
    saveNotes(notes);
  }, [notes]);

  useEffect(() => {
    saveChatHistory(messages);
  }, [messages]);

  // Handle Speech Recognition
  const toggleListening = () => {
    if (isListening) {
      if (stopListeningRef.current) {
        stopListeningRef.current();
        stopListeningRef.current = null;
      }
      setIsListening(false);
      // If user spoke something, send it automatically
      if (voiceTranscript.trim()) {
        handleSendMessage(voiceTranscript.trim());
        setVoiceTranscript('');
      }
      return;
    }

    // Stop speaking if MAYRA is talking
    stopSpeech();
    setIsSpeaking(false);

    // Map language code for recognition
    let langCode = 'en-US';
    if (userPreferences.language === 'hindi') langCode = 'hi-IN';
    else if (userPreferences.language === 'odia') langCode = 'or-IN';
    else if (userPreferences.language === 'sambalpuri') langCode = 'or-IN';

    const stop = startListening(
      (transcript, isFinal) => {
        setVoiceTranscript(transcript);
        if (isFinal) {
          setIsListening(false);
          handleSendMessage(transcript);
          setVoiceTranscript('');
        }
      },
      (error) => {
        console.warn('Speech error:', error);
        setIsListening(false);
      },
      () => {
        setIsListening(false);
      },
      langCode
    );

    if (stop) {
      stopListeningRef.current = stop;
      setIsListening(true);
    }
  };

  // Speak text with TTS
  const handleSpeak = (text: string) => {
    if (isSpeaking) {
      stopSpeech();
      setIsSpeaking(false);
      return;
    }

    let speechLang = 'en-US';
    if (userPreferences.language === 'hindi') speechLang = 'hi-IN';
    else if (userPreferences.language === 'odia') speechLang = 'or-IN';

    speakText(text, {
      rate: userPreferences.voiceSpeed,
      pitch: userPreferences.voicePitch,
      lang: speechLang,
      onStart: () => setIsSpeaking(true),
      onEnd: () => setIsSpeaking(false),
    });
  };

  // Process natural commands locally or with AI
  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend !== undefined ? textToSend : inputPrompt).trim();
    if (!query || isLoading) return;

    setInputPrompt('');

    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      mode: currentMode,
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setIsLoading(true);

    // Check for quick device/time commands (Section 5 & 16)
    const lower = query.toLowerCase();
    if (lower.includes('what time is it') || lower.includes('kya time hua') || lower.includes('samaya kete')) {
      const now = new Date();
      const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const reply = `The current time is ${timeStr}.`;
      addAssistantReply(reply, newMessages);
      setIsLoading(false);
      return;
    }

    // Check for quick reminder command
    if (lower.startsWith('set reminder') || lower.startsWith('set a reminder') || lower.startsWith('remind me to')) {
      const title = query.replace(/^(set reminder|set a reminder|remind me to)\s*(for|to)?/i, '').trim();
      const newRem: ReminderItem = {
        id: `rem-${Date.now()}`,
        title: title || 'New Reminder',
        dueTime: 'Scheduled',
        completed: false,
        type: 'reminder',
        priority: 'normal',
      };
      setReminders((prev) => [newRem, ...prev]);
      const reply = `Reminder scheduled: "${newRem.title}". You can check and manage it anytime in your Personal Hub!`;
      addAssistantReply(reply, newMessages, [{ type: 'reminder', title: newRem.title }]);
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.slice(-10), // send last 10 messages for context
          userPreferences,
          currentMode,
          searchGrounding,
        }),
      });

      const data = await res.json().catch(() => null);
      if (!res.ok) {
        const fallbackText = data?.reply || "I am momentarily experiencing high traffic or connectivity spikes. Please try again in a moment.";
        addAssistantReply(fallbackText, newMessages);
        return;
      }

      const replyText = data?.reply || "I didn't fully understand that. Please say it another way.";

      // Extract web sources if search grounding was active
      const groundingSources = data?.groundingMetadata?.groundingChunks?.map((chunk: any) => ({
        uri: chunk.web?.uri || '',
        title: chunk.web?.title || 'Web Search Source',
      })).filter((s: any) => !!s.uri);

      addAssistantReply(replyText, newMessages, data?.actions, groundingSources);
    } catch (err: any) {
      console.error('Chat error:', err);
      const fallback = "The required service isn't currently available. Please check your network connection and try again.";
      addAssistantReply(fallback, newMessages);
    } finally {
      setIsLoading(false);
    }
  };

  const addAssistantReply = (
    content: string, 
    prevHistory: ChatMessage[], 
    actions?: Array<{ type: string; title: string; detail?: string }>,
    groundingSources?: Array<{ uri: string; title: string }>
  ) => {
    const assistantMsg: ChatMessage = {
      id: `msg-${Date.now() + 1}`,
      role: 'assistant',
      content,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      mode: currentMode,
      actions,
      groundingSources,
    };

    setMessages([...prevHistory, assistantMsg]);
    setLastSpokenResponse(content);

    // If in Voice Mode or voiceEnabled, speak response concisely!
    if (currentMode === 'voice' || (userPreferences.voiceEnabled && isListening)) {
      handleSpeak(content);
    }
  };

  // Personal Hub actions
  const handleAddReminder = (item: Omit<ReminderItem, 'id'>) => {
    const newRem = { ...item, id: `rem-${Date.now()}` };
    setReminders((prev) => [newRem, ...prev]);
  };

  const handleToggleReminder = (id: string) => {
    setReminders((prev) =>
      prev.map((r) => (r.id === id ? { ...r, completed: !r.completed } : r))
    );
  };

  const handleDeleteReminder = (id: string) => {
    setReminders((prev) => prev.filter((r) => r.id !== id));
  };

  const handleAddNote = (item: Omit<NoteItem, 'id' | 'updatedAt'>) => {
    const newNote = {
      ...item,
      id: `note-${Date.now()}`,
      updatedAt: 'Just now',
    };
    setNotes((prev) => [newNote, ...prev]);
  };

  const handleDeleteNote = (id: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
  };

  const handleSaveActionAsReminder = (title: string) => {
    handleAddReminder({
      title,
      dueTime: 'Today',
      completed: false,
      type: 'todo',
      priority: 'normal',
    });
  };

  const handleSaveActionAsNote = (title: string, content: string) => {
    handleAddNote({
      title,
      content,
      tag: 'MAYRA',
    });
  };

  // Clear all memories
  const handleClearMemory = () => {
    clearMemoryAndHistory();
    setMessages([]);
    setReminders([]);
    setNotes([]);
  };

  // Quick prompt triggers
  const handleTriggerQuickPrompt = (prompt: string) => {
    setCurrentMode('chat');
    handleSendMessage(prompt);
  };

  return (
    <div className="flex flex-col h-screen bg-slate-950 text-slate-100 font-sans overflow-hidden">
      {/* Top Header */}
      <Header
        currentMode={currentMode}
        onSelectMode={(mode) => {
          stopSpeech();
          setIsSpeaking(false);
          setCurrentMode(mode);
        }}
        userPreferences={userPreferences}
        onOpenPreferences={() => setIsPreferencesOpen(true)}
        isListening={isListening}
        isSpeaking={isSpeaking}
        onToggleVoiceMode={toggleListening}
        onChangeLanguage={(lang) => setUserPreferences((prev) => ({ ...prev, language: lang }))}
      />

      {/* Main Mode Content */}
      <main className="flex-1 flex flex-col min-h-0 overflow-hidden relative">
        {currentMode === 'chat' && (
          <ChatTimeline
            messages={messages}
            isLoading={isLoading}
            onQuickPrompt={handleTriggerQuickPrompt}
            onSpeak={handleSpeak}
            isSpeaking={isSpeaking}
            onSaveActionAsReminder={handleSaveActionAsReminder}
            onSaveActionAsNote={handleSaveActionAsNote}
          />
        )}

        {currentMode === 'voice' && (
          <VoiceCanvas
            isListening={isListening}
            isSpeaking={isSpeaking}
            transcript={voiceTranscript}
            onToggleListening={toggleListening}
            onStopSpeaking={() => {
              stopSpeech();
              setIsSpeaking(false);
            }}
            onSubmitCommand={handleSendMessage}
            lastResponse={lastSpokenResponse}
          />
        )}

        {currentMode === 'personal' && (
          <PersonalHub
            reminders={reminders}
            notes={notes}
            onAddReminder={handleAddReminder}
            onToggleReminder={handleToggleReminder}
            onDeleteReminder={handleDeleteReminder}
            onAddNote={handleAddNote}
            onDeleteNote={handleDeleteNote}
            onAskMayraToPlan={handleTriggerQuickPrompt}
          />
        )}

        {currentMode === 'device' && (
          <DeviceSimulator
            onSpeak={handleSpeak}
            onExecuteDeviceCommand={handleTriggerQuickPrompt}
          />
        )}

        {currentMode === 'creative' && (
          <CreativeStudio onAskMayraCreative={handleTriggerQuickPrompt} />
        )}

        {currentMode === 'coding' && (
          <CodingHub onAskMayraCode={handleTriggerQuickPrompt} />
        )}
      </main>

      {/* Bottom Command Bar (Active in Chat, Coding, and Personal modes) */}
      {(currentMode === 'chat' || currentMode === 'coding' || currentMode === 'personal') && (
        <div className="border-t border-slate-850 bg-slate-900/90 backdrop-blur-md px-3 sm:px-6 py-2.5">
          <div className="max-w-4xl mx-auto flex flex-col gap-1.5">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2 bg-slate-950 rounded-2xl border border-slate-800 focus-within:border-emerald-500/80 focus-within:ring-1 focus-within:ring-emerald-500/40 p-1.5 transition-all shadow-lg"
            >
              {/* Voice toggle in input bar */}
              <button
                type="button"
                onClick={toggleListening}
                className={`p-2.5 rounded-xl transition-all ${
                  isListening
                    ? 'bg-rose-500 text-white shadow-md shadow-rose-500/30 animate-pulse'
                    : 'text-slate-400 hover:text-emerald-300 hover:bg-slate-900'
                }`}
                title={isListening ? 'Stop listening' : 'Speak to MAYRA'}
              >
                <Mic className="w-4 h-4" />
              </button>

              {/* Text Input */}
              <input
                type="text"
                value={inputPrompt}
                onChange={(e) => setInputPrompt(e.target.value)}
                placeholder={
                  isListening
                    ? 'Listening to your voice...'
                    : userPreferences.language === 'hindi'
                    ? 'MAYRA se poochiye (e.g. "Mujhe ek Kotlin project banana hai...")'
                    : userPreferences.language === 'odia' || userPreferences.language === 'sambalpuri'
                    ? 'MAYRA କୁ ପଚାରନ୍ତୁ... (Ask in Odia, Sambalpuri, or English)'
                    : 'Ask MAYRA anything... (Everyday tasks, coding, prompts, plans)'
                }
                className="flex-1 bg-transparent px-2 text-xs sm:text-sm text-white placeholder-slate-500 outline-none"
              />

              {/* Search Grounding toggle */}
              <button
                type="button"
                onClick={() => setSearchGrounding(!searchGrounding)}
                className={`px-2.5 py-1.5 rounded-xl text-xs flex items-center gap-1.5 transition-colors ${
                  searchGrounding
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-medium'
                    : 'text-slate-500 hover:text-slate-300'
                }`}
                title="Google Search Grounding (Live Information)"
              >
                <Globe className="w-3.5 h-3.5" />
                <span className="hidden md:inline text-[11px]">
                  {searchGrounding ? 'Search On' : 'Search'}
                </span>
              </button>

              {/* Send Button */}
              <button
                type="submit"
                disabled={!inputPrompt.trim() || isLoading}
                className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:hover:bg-emerald-600 text-white transition-colors"
                title="Send to MAYRA"
              >
                <ArrowUp className="w-4 h-4 font-bold" />
              </button>
            </form>

            <div className="flex items-center justify-between text-[11px] text-slate-500 px-1">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-emerald-400" />
                Language: <strong className="text-slate-300 capitalize">{userPreferences.language}</strong>
                <span className="hidden sm:inline">• Say "Hey MAYRA" to activate</span>
              </span>

              {messages.length > 0 && (
                <button
                  type="button"
                  onClick={() => setMessages([])}
                  className="hover:text-rose-400 transition-colors flex items-center gap-1"
                >
                  <Trash2 className="w-3 h-3" />
                  <span className="hidden sm:inline">Clear Chat</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Preferences / Memory Modal */}
      <PreferencesModal
        isOpen={isPreferencesOpen}
        onClose={() => setIsPreferencesOpen(false)}
        preferences={userPreferences}
        onSavePreferences={setUserPreferences}
        onClearMemory={handleClearMemory}
      />
    </div>
  );
}
