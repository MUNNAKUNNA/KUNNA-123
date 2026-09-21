import React from 'react';
import { 
  Bot, 
  Mic, 
  Settings, 
  Sparkles, 
  CalendarCheck, 
  Code2, 
  Smartphone, 
  Palette, 
  Globe, 
  Volume2,
  VolumeX,
  ShieldCheck
} from 'lucide-react';
import { AssistantMode, SupportedLanguage, UserPreferences } from '../types';

interface HeaderProps {
  currentMode: AssistantMode;
  onSelectMode: (mode: AssistantMode) => void;
  userPreferences: UserPreferences;
  onOpenPreferences: () => void;
  isListening: boolean;
  isSpeaking: boolean;
  onToggleVoiceMode: () => void;
  onChangeLanguage: (lang: SupportedLanguage) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentMode,
  onSelectMode,
  userPreferences,
  onOpenPreferences,
  isListening,
  isSpeaking,
  onToggleVoiceMode,
  onChangeLanguage,
}) => {
  const modes: Array<{ id: AssistantMode; label: string; icon: React.ReactNode }> = [
    { id: 'chat', label: 'AI Chat', icon: <Bot className="w-4 h-4" /> },
    { id: 'voice', label: 'Voice Mode', icon: <Mic className="w-4 h-4" /> },
    { id: 'personal', label: 'Personal Hub', icon: <CalendarCheck className="w-4 h-4" /> },
    { id: 'coding', label: 'Coding & Android', icon: <Code2 className="w-4 h-4" /> },
    { id: 'creative', label: 'Creative Studio', icon: <Palette className="w-4 h-4" /> },
    { id: 'device', label: 'Device Assistant', icon: <Smartphone className="w-4 h-4" /> },
  ];

  const languages: Array<{ id: SupportedLanguage; label: string }> = [
    { id: 'auto', label: 'Auto' },
    { id: 'english', label: 'EN' },
    { id: 'hindi', label: 'हिन्दी' },
    { id: 'odia', label: 'ଓଡ଼ିଆ' },
    { id: 'sambalpuri', label: 'ସମ୍ବଲପୁରୀ' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Logo & Identity */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/20 text-white font-bold text-lg">
                  M
                </div>
                <span className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-slate-900 ${
                  isSpeaking ? 'bg-amber-400 animate-pulse' : isListening ? 'bg-rose-500 animate-ping' : 'bg-emerald-400'
                }`} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-base font-bold text-white tracking-tight flex items-center gap-1.5">
                    MAYRA
                    <span className="text-xs px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono font-medium">
                      v2.5
                    </span>
                  </h1>
                  <span className="hidden md:inline-flex items-center gap-1 text-[11px] text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded-full border border-slate-700/50">
                    <ShieldCheck className="w-3 h-3 text-emerald-400" />
                    Private & Verified
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 leading-tight">
                  Personal AI Assistant • Smart, Fast & Helpful
                </p>
              </div>
            </div>

            {/* Mobile Action Controls */}
            <div className="flex sm:hidden items-center gap-1.5">
              <button
                type="button"
                onClick={onToggleVoiceMode}
                className={`p-2 rounded-lg border transition-all ${
                  isListening
                    ? 'bg-rose-500/20 border-rose-500 text-rose-300 animate-pulse'
                    : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
                }`}
                title="Voice Assistant"
              >
                <Mic className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={onOpenPreferences}
                className="p-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 hover:text-white"
                title="Settings & Memory"
              >
                <Settings className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Language bar & Voice Status & Settings */}
          <div className="flex items-center justify-between sm:justify-end gap-2 text-xs">
            {/* Language Selector */}
            <div className="flex items-center gap-1 bg-slate-800/80 p-1 rounded-lg border border-slate-700/60 overflow-x-auto">
              <Globe className="w-3.5 h-3.5 text-slate-400 ml-1.5 mr-0.5 shrink-0" />
              {languages.map((l) => (
                <button
                  key={l.id}
                  type="button"
                  onClick={() => onChangeLanguage(l.id)}
                  className={`px-2 py-1 rounded-md text-[11px] font-medium whitespace-nowrap transition-all ${
                    userPreferences.language === l.id
                      ? 'bg-emerald-500 text-white font-semibold shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
                  }`}
                >
                  {l.label}
                </button>
              ))}
            </div>

            {/* Desktop Quick Voice & Settings */}
            <div className="hidden sm:flex items-center gap-1.5">
              <button
                type="button"
                onClick={onToggleVoiceMode}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                  isListening
                    ? 'bg-rose-500/20 border-rose-500/80 text-rose-300 shadow-md shadow-rose-500/20 animate-pulse'
                    : isSpeaking
                    ? 'bg-amber-500/20 border-amber-500/80 text-amber-300'
                    : 'bg-slate-800 hover:bg-slate-700/80 border-slate-700 text-slate-300'
                }`}
              >
                <Mic className={`w-3.5 h-3.5 ${isListening ? 'animate-bounce' : ''}`} />
                <span>{isListening ? 'Listening...' : isSpeaking ? 'Speaking...' : 'Voice Mode'}</span>
              </button>

              <button
                type="button"
                onClick={onOpenPreferences}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700/80 border border-slate-700 text-slate-300 text-xs transition-colors"
                title="Memory, Persona & Privacy"
              >
                <Settings className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Memory & Preferences</span>
              </button>
            </div>
          </div>
        </div>

        {/* Mode Navigation Bar */}
        <nav className="flex items-center gap-1.5 mt-2.5 overflow-x-auto pb-1 scrollbar-none">
          {modes.map((m) => {
            const isActive = currentMode === m.id;
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => onSelectMode(m.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-emerald-600/90 text-white shadow-sm shadow-emerald-900/40 border border-emerald-500/40'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 border border-transparent'
                }`}
              >
                {m.icon}
                <span>{m.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
