import React, { useState } from 'react';
import { 
  X, 
  Settings, 
  User, 
  Globe, 
  Volume2, 
  ShieldCheck, 
  Trash2, 
  Save, 
  Lock,
  Sparkles
} from 'lucide-react';
import { UserPreferences, SupportedLanguage } from '../types';

interface PreferencesModalProps {
  isOpen: boolean;
  onClose: () => void;
  preferences: UserPreferences;
  onSavePreferences: (prefs: UserPreferences) => void;
  onClearMemory: () => void;
}

export const PreferencesModal: React.FC<PreferencesModalProps> = ({
  isOpen,
  onClose,
  preferences,
  onSavePreferences,
  onClearMemory,
}) => {
  const [name, setName] = useState(preferences.name);
  const [language, setLanguage] = useState<SupportedLanguage>(preferences.language);
  const [style, setStyle] = useState<'concise' | 'balanced' | 'detailed'>(preferences.style);
  const [voiceEnabled, setVoiceEnabled] = useState(preferences.voiceEnabled);
  const [voiceSpeed, setVoiceSpeed] = useState(preferences.voiceSpeed);
  const [voicePitch, setVoicePitch] = useState(preferences.voicePitch);
  const [confirmClear, setConfirmClear] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    onSavePreferences({
      ...preferences,
      name,
      language,
      style,
      voiceEnabled,
      voiceSpeed,
      voicePitch,
    });
    onClose();
  };

  const handleClear = () => {
    onClearMemory();
    setConfirmClear(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Settings className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">MAYRA Settings & Memory</h3>
              <p className="text-[11px] text-slate-400">Personalize identity, languages, voice, and privacy.</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* User Nickname */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-emerald-400" /> What should MAYRA call you?
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Munna"
              className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 outline-none focus:border-emerald-500"
            />
          </div>

          {/* Preferred Language */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-emerald-400" /> Default Language Matching
            </label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as any)}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white outline-none focus:border-emerald-500"
            >
              <option value="auto">Auto-detect (Match whatever user speaks)</option>
              <option value="hindi">Hindi / Hinglish (हिन्दी)</option>
              <option value="english">English</option>
              <option value="odia">Odia (ଓଡ଼ିଆ)</option>
              <option value="sambalpuri">Sambalpuri (ସମ୍ବଲପୁରୀ)</option>
            </select>
            <p className="text-[11px] text-slate-400">
              MAYRA seamlessly responds in Hindi, English, Odia, Sambalpuri, or mixed Hinglish.
            </p>
          </div>

          {/* Response Style */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" /> Response Personality & Style
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'concise', label: 'Concise & Fast', desc: 'Direct answers' },
                { id: 'balanced', label: 'Balanced', desc: 'Friendly & clear' },
                { id: 'detailed', label: 'Detailed', desc: 'Deep explanations' },
              ].map((st) => (
                <button
                  key={st.id}
                  type="button"
                  onClick={() => setStyle(st.id as any)}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    style === st.id
                      ? 'bg-emerald-950/50 border-emerald-500 text-white'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <p className="text-xs font-medium">{st.label}</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">{st.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Voice Settings */}
          <div className="space-y-3 pt-2 border-t border-slate-800">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Volume2 className="w-3.5 h-3.5 text-emerald-400" /> Text-to-Speech (TTS) Voice
              </label>
              <button
                type="button"
                onClick={() => setVoiceEnabled(!voiceEnabled)}
                className={`text-xs px-2.5 py-1 rounded-lg border font-medium transition-colors ${
                  voiceEnabled
                    ? 'bg-emerald-600/30 border-emerald-500/50 text-emerald-300'
                    : 'bg-slate-950 border-slate-800 text-slate-500'
                }`}
              >
                {voiceEnabled ? 'Enabled' : 'Disabled'}
              </button>
            </div>

            {voiceEnabled && (
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] text-slate-400">
                    <span>Speech Speed</span>
                    <span className="font-mono">{voiceSpeed}x</span>
                  </div>
                  <input
                    type="range"
                    min="0.8"
                    max="1.4"
                    step="0.1"
                    value={voiceSpeed}
                    onChange={(e) => setVoiceSpeed(Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] text-slate-400">
                    <span>Voice Pitch</span>
                    <span className="font-mono">{voicePitch}</span>
                  </div>
                  <input
                    type="range"
                    min="0.8"
                    max="1.3"
                    step="0.05"
                    value={voicePitch}
                    onChange={(e) => setVoicePitch(Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Privacy & Safety section */}
          <div className="pt-3 border-t border-slate-800 space-y-2">
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-850 text-xs text-slate-400 flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <p className="text-[11px] leading-relaxed">
                <strong className="text-slate-200">Privacy First Principle:</strong> MAYRA stores memories locally on your device. It never leaks sensitive credentials, passwords, or files.
              </p>
            </div>

            {/* Clear memory button */}
            <div className="flex justify-between items-center pt-1">
              <span className="text-[11px] text-slate-500">Reset stored memory</span>
              {confirmClear ? (
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] text-rose-400">Are you sure?</span>
                  <button
                    type="button"
                    onClick={handleClear}
                    className="text-xs px-2.5 py-1 rounded bg-rose-600 hover:bg-rose-500 text-white font-medium transition-colors"
                  >
                    Yes, Clear All
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmClear(false)}
                    className="text-xs px-2 py-1 rounded bg-slate-800 text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setConfirmClear(true)}
                  className="text-[11px] text-rose-400 hover:text-rose-300 flex items-center gap-1 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Clear Conversation & Memory</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end gap-2 px-5 py-3 border-t border-slate-800 bg-slate-950/60">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs flex items-center gap-1.5 transition-colors"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Preferences</span>
          </button>
        </div>
      </div>
    </div>
  );
};
