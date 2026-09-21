import React, { useState, useEffect } from 'react';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Radio, 
  Sparkles, 
  RefreshCw, 
  Clock, 
  SunMedium, 
  Play, 
  Send 
} from 'lucide-react';
import { isSpeechRecognitionSupported, isSpeechSynthesisSupported } from '../utils/speech';

interface VoiceCanvasProps {
  isListening: boolean;
  isSpeaking: boolean;
  transcript: string;
  onToggleListening: () => void;
  onStopSpeaking: () => void;
  onSubmitCommand: (command: string) => void;
  lastResponse: string | null;
}

export const VoiceCanvas: React.FC<VoiceCanvasProps> = ({
  isListening,
  isSpeaking,
  transcript,
  onToggleListening,
  onStopSpeaking,
  onSubmitCommand,
  lastResponse,
}) => {
  const [typedCommand, setTypedCommand] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const voiceTriggers = [
    { label: '"Hey MAYRA, what time is it?"', query: "Hey MAYRA, what time is it?" },
    { label: '"Hi MAYRA, tell me today\'s weather"', query: "Hi MAYRA, tell me today's weather" },
    { label: '"MAYRA, listen: set a reminder for 6 PM"', query: "MAYRA, listen: set a reminder for 6 PM" },
    { label: '"MAYRA, open YouTube"', query: "MAYRA, open YouTube" },
    { label: '"MAYRA, mujhe ek short Hindi shayari sunao"', query: "MAYRA, mujhe ek short Hindi shayari sunao" },
  ];

  const handleSendTyped = (e: React.FormEvent) => {
    e.preventDefault();
    if (!typedCommand.trim()) return;
    onSubmitCommand(typedCommand.trim());
    setTypedCommand('');
  };

  const hasSpeech = isSpeechRecognitionSupported();

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-8 max-w-3xl mx-auto w-full text-center space-y-6">
      {/* Assistant Status Badge */}
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs text-slate-300 shadow-sm">
        <Radio className={`w-3.5 h-3.5 ${isListening ? 'text-rose-400 animate-pulse' : isSpeaking ? 'text-amber-400 animate-bounce' : 'text-emerald-400'}`} />
        <span className="font-medium">
          {isListening ? 'Listening for command...' : isSpeaking ? 'MAYRA is speaking...' : 'Voice Mode Ready'}
        </span>
        <span className="text-slate-500">•</span>
        <span className="text-slate-400 font-mono text-[11px]">{currentTime}</span>
      </div>

      {/* Visual Glowing Voice Orb */}
      <div className="relative my-4 flex items-center justify-center">
        {/* Animated Ripple Circles when listening or speaking */}
        {(isListening || isSpeaking) && (
          <>
            <div className={`absolute w-44 h-44 rounded-full border-2 animate-ping opacity-25 ${
              isListening ? 'border-rose-500' : 'border-amber-400'
            }`} />
            <div className={`absolute w-36 h-36 rounded-full border-2 animate-pulse opacity-40 ${
              isListening ? 'border-rose-400' : 'border-amber-300'
            }`} />
          </>
        )}

        {/* Center Orb Button */}
        <button
          type="button"
          onClick={onToggleListening}
          className={`relative z-10 w-28 h-28 sm:w-32 sm:h-32 rounded-full flex flex-col items-center justify-center shadow-2xl transition-all transform active:scale-95 ${
            isListening
              ? 'bg-gradient-to-tr from-rose-600 via-pink-600 to-rose-500 text-white shadow-rose-600/50 ring-4 ring-rose-500/40'
              : isSpeaking
              ? 'bg-gradient-to-tr from-amber-500 via-yellow-500 to-orange-500 text-white shadow-amber-500/50 ring-4 ring-amber-500/40'
              : 'bg-gradient-to-tr from-emerald-600 via-teal-600 to-cyan-600 text-white hover:brightness-110 shadow-emerald-500/30'
          }`}
          title={isListening ? "Stop listening" : "Tap to speak with MAYRA"}
        >
          {isListening ? (
            <Mic className="w-10 h-10 animate-bounce" />
          ) : isSpeaking ? (
            <Volume2 className="w-10 h-10 animate-pulse" />
          ) : (
            <Mic className="w-10 h-10" />
          )}
          <span className="text-[11px] font-semibold tracking-wide uppercase mt-1">
            {isListening ? 'Listening' : isSpeaking ? 'Speaking' : 'Tap to Talk'}
          </span>
        </button>
      </div>

      {/* Voice Transcript / Live Spoken Feedback */}
      <div className="w-full max-w-xl bg-slate-900/90 border border-slate-800 rounded-2xl p-4 min-h-[90px] flex flex-col items-center justify-center text-center shadow-inner">
        {isListening ? (
          <div className="space-y-1">
            <span className="text-[11px] font-semibold text-rose-400 uppercase tracking-wider">
              Hearing your voice:
            </span>
            <p className="text-sm font-medium text-white italic">
              "{transcript || 'Listening... Speak now ("Hey MAYRA...")'}"
            </p>
          </div>
        ) : lastResponse ? (
          <div className="space-y-2 text-left w-full">
            <div className="flex items-center justify-between text-[11px] text-slate-400 border-b border-slate-800 pb-1">
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> MAYRA Response:
              </span>
              {isSpeaking && (
                <button
                  type="button"
                  onClick={onStopSpeaking}
                  className="text-amber-400 hover:text-amber-300 flex items-center gap-1"
                >
                  <VolumeX className="w-3 h-3" /> Stop Audio
                </button>
              )}
            </div>
            <p className="text-xs sm:text-sm text-slate-200 line-clamp-4 leading-relaxed">
              {lastResponse}
            </p>
          </div>
        ) : (
          <div className="text-xs text-slate-400">
            {hasSpeech ? (
              <p>Say <span className="text-emerald-400 font-semibold">"Hey MAYRA"</span> or tap the microphone to start.</p>
            ) : (
              <p className="text-amber-400">Speech recognition is not active in this browser. You can type commands below.</p>
            )}
          </div>
        )}
      </div>

      {/* Fallback Command Input */}
      <form onSubmit={handleSendTyped} className="w-full max-w-xl flex items-center gap-2">
        <input
          type="text"
          value={typedCommand}
          onChange={(e) => setTypedCommand(e.target.value)}
          placeholder='Or type a voice command e.g. "MAYRA, what time is it?"'
          className="flex-1 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-xs text-white placeholder-slate-500 outline-none"
        />
        <button
          type="submit"
          disabled={!typedCommand.trim()}
          className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-medium text-xs flex items-center gap-1.5 transition-colors"
        >
          <span>Send</span>
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>

      {/* Quick Activation Triggers */}
      <div className="w-full max-w-xl text-left pt-2">
        <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
          One-Tap Voice Commands:
        </p>
        <div className="flex flex-wrap gap-2">
          {voiceTriggers.map((trig, i) => (
            <button
              key={i}
              type="button"
              onClick={() => onSubmitCommand(trig.query)}
              className="px-3 py-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-emerald-500/50 text-[11px] text-slate-300 hover:text-emerald-300 transition-all text-left"
            >
              {trig.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
