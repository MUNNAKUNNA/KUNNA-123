import React, { useState } from 'react';
import Markdown from 'react-markdown';
import { 
  Bot, 
  User, 
  Copy, 
  Check, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  FileText, 
  ExternalLink,
  Code,
  ArrowRight
} from 'lucide-react';
import { ChatMessage, ReminderItem, NoteItem } from '../types';

interface ChatTimelineProps {
  messages: ChatMessage[];
  isLoading: boolean;
  onQuickPrompt: (prompt: string) => void;
  onSpeak: (text: string) => void;
  isSpeaking: boolean;
  onSaveActionAsReminder?: (title: string) => void;
  onSaveActionAsNote?: (title: string, content: string) => void;
}

export const ChatTimeline: React.FC<ChatTimelineProps> = ({
  messages,
  isLoading,
  onQuickPrompt,
  onSpeak,
  isSpeaking,
  onSaveActionAsReminder,
  onSaveActionAsNote,
}) => {
  const [copiedIndex, setCopiedIndex] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(id);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const samplePrompts = [
    { label: "Today's Schedule", text: "MAYRA, what's on my schedule and to-do list for today?" },
    { label: "Thumbnail Prompt (Hindi)", text: "MAYRA, mujhe ek cinematic YouTube thumbnail prompt chahiye." },
    { label: "Kotlin Android Code", text: "Write complete Kotlin Jetpack Compose code for a custom audio recorder with runtime permissions." },
    { label: "Odia & Sambalpuri", text: "MAYRA, can you explain what is Machine Learning in Sambalpuri and Odia?" },
    { label: "Set Reminder", text: "MAYRA, set a reminder for 5:30 PM: 'Team sync and code deployment'." },
    { label: "Current Tech News", text: "MAYRA, search the latest Android and AI developer announcements today." },
  ];

  return (
    <div className="flex-1 flex flex-col justify-between overflow-y-auto px-3 sm:px-6 py-4 space-y-4">
      {/* If no messages, show friendly Welcome Card */}
      {messages.length === 0 && (
        <div className="max-w-2xl mx-auto my-auto py-8 text-center space-y-6">
          <div className="inline-flex p-3.5 rounded-2xl bg-gradient-to-tr from-emerald-500/20 via-teal-500/10 to-cyan-500/20 border border-emerald-500/30 text-emerald-400">
            <Bot className="w-10 h-10" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              Namaste! I'm <span className="text-emerald-400">MAYRA</span>
            </h2>
            <p className="text-sm text-slate-300 max-w-lg mx-auto leading-relaxed">
              Your intelligent, fast and friendly personal AI assistant. I can help with tasks, reminders, coding, creative prompts, device shortcuts, and questions in English, Hindi, Odia, or Sambalpuri.
            </p>
          </div>

          {/* Quick Prompts Grid */}
          <div className="pt-2">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
              Try asking MAYRA:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-left">
              {samplePrompts.map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => onQuickPrompt(p.text)}
                  className="p-3 rounded-xl bg-slate-900/80 hover:bg-slate-850 border border-slate-800 hover:border-emerald-500/40 text-xs transition-all group"
                >
                  <div className="flex items-center justify-between font-medium text-slate-200 group-hover:text-emerald-300">
                    <span>{p.label}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-emerald-400 transition-transform group-hover:translate-x-0.5" />
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">
                    {p.text}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Messages Stream */}
      {messages.map((msg) => {
        const isUser = msg.role === 'user';
        return (
          <div
            key={msg.id}
            className={`flex items-start gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
          >
            {/* Assistant Avatar */}
            {!isUser && (
              <div className="w-8 h-8 rounded-lg bg-emerald-600/90 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-md shadow-emerald-950/50 mt-1">
                M
              </div>
            )}

            {/* Message Bubble */}
            <div
              className={`max-w-[88%] sm:max-w-[78%] rounded-2xl p-4 text-sm leading-relaxed border transition-all ${
                isUser
                  ? 'bg-emerald-600/90 text-white rounded-tr-sm border-emerald-500 shadow-sm'
                  : 'bg-slate-900/95 text-slate-200 rounded-tl-sm border-slate-800 shadow-md'
              }`}
            >
              {/* Header meta */}
              <div className="flex items-center justify-between gap-4 mb-1.5 pb-1 border-b border-white/10 text-[11px] opacity-75">
                <span className="font-semibold">
                  {isUser ? 'You' : 'MAYRA'}
                </span>
                <span className="text-[10px]">{msg.timestamp}</span>
              </div>

              {/* Message Content */}
              {isUser ? (
                <div className="whitespace-pre-wrap">{msg.content}</div>
              ) : (
                <div className="prose prose-invert prose-sm max-w-none space-y-2 text-slate-200">
                  <Markdown
                    components={{
                      pre({ children }) {
                        return <>{children}</>;
                      },
                      code({ className, children, ...props }) {
                        const codeString = String(children).replace(/\n$/, '');
                        const isInline = !className && !codeString.includes('\n');
                        if (isInline) {
                          return (
                            <code className="px-1.5 py-0.5 rounded bg-slate-800 text-emerald-300 font-mono text-[11px] font-normal" {...props}>
                              {children}
                            </code>
                          );
                        }
                        const codeId = `code-${Math.random()}`;
                        return (
                          <div className="my-2 rounded-xl bg-slate-950 border border-slate-800 overflow-hidden not-prose">
                            <div className="flex items-center justify-between px-3 py-1.5 bg-slate-900/90 border-b border-slate-800 text-[11px] text-slate-400">
                              <span className="flex items-center gap-1 font-mono text-emerald-400">
                                <Code className="w-3 h-3" />
                                {className ? className.replace('language-', '') : 'code'}
                              </span>
                              <button
                                type="button"
                                onClick={() => handleCopy(codeString, codeId)}
                                className="flex items-center gap-1 hover:text-white transition-colors"
                              >
                                {copiedIndex === codeId ? (
                                  <>
                                    <Check className="w-3 h-3 text-emerald-400" />
                                    <span>Copied!</span>
                                  </>
                                ) : (
                                  <>
                                    <Copy className="w-3 h-3" />
                                    <span>Copy</span>
                                  </>
                                )}
                              </button>
                            </div>
                            <pre className="p-3 overflow-x-auto text-xs font-mono text-emerald-200/90 bg-slate-950/70">
                              <code>{children}</code>
                            </pre>
                          </div>
                        );
                      },
                    }}
                  >
                    {msg.content}
                  </Markdown>
                </div>
              )}

              {/* Grounding Sources if any */}
              {msg.groundingSources && msg.groundingSources.length > 0 && (
                <div className="mt-3 pt-2 border-t border-slate-800/80">
                  <span className="text-[10px] uppercase font-semibold text-slate-400 flex items-center gap-1 mb-1">
                    <ExternalLink className="w-3 h-3 text-emerald-400" /> Grounded Web Sources
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {msg.groundingSources.map((src, i) => (
                      <a
                        key={i}
                        href={src.uri}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[11px] bg-slate-800 hover:bg-slate-750 px-2 py-0.5 rounded text-emerald-300 hover:text-emerald-200 border border-slate-700/60 inline-flex items-center gap-1 truncate max-w-xs"
                      >
                        <span>{src.title || src.uri}</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Suggested Assistant Actions */}
              {!isUser && (
                <div className="mt-3 pt-2 flex items-center justify-between border-t border-slate-800/60 text-xs">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onSpeak(msg.content)}
                      className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-colors flex items-center gap-1 text-[11px]"
                      title="Listen with TTS"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>Speak</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleCopy(msg.content, msg.id)}
                      className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-colors flex items-center gap-1 text-[11px]"
                      title="Copy response"
                    >
                      {copiedIndex === msg.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                      <span>Copy</span>
                    </button>
                  </div>

                  {/* 1-Click Save to Reminders or Notes if relevant */}
                  <div className="flex items-center gap-1">
                    {onSaveActionAsReminder && (
                      <button
                        type="button"
                        onClick={() => onSaveActionAsReminder(msg.content.slice(0, 60))}
                        className="text-[11px] text-slate-400 hover:text-emerald-300 px-2 py-1 rounded bg-slate-800/60 hover:bg-slate-800 transition-colors inline-flex items-center gap-1"
                        title="Add to Reminders"
                      >
                        <Clock className="w-3 h-3 text-emerald-400" />
                        <span>Set Task</span>
                      </button>
                    )}
                    {onSaveActionAsNote && (
                      <button
                        type="button"
                        onClick={() => onSaveActionAsNote("MAYRA Note", msg.content)}
                        className="text-[11px] text-slate-400 hover:text-cyan-300 px-2 py-1 rounded bg-slate-800/60 hover:bg-slate-800 transition-colors inline-flex items-center gap-1"
                        title="Save to Notes"
                      >
                        <FileText className="w-3 h-3 text-cyan-400" />
                        <span>Save Note</span>
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* User Avatar */}
            {isUser && (
              <div className="w-8 h-8 rounded-lg bg-slate-800 text-slate-300 flex items-center justify-center font-bold text-xs shrink-0 border border-slate-700 mt-1">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        );
      })}

      {/* Loading Indicator */}
      {isLoading && (
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-600/90 text-white flex items-center justify-center font-bold text-xs shrink-0 animate-pulse">
            M
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-2xl rounded-tl-sm p-4 text-slate-300 text-xs flex items-center gap-3">
            <div className="flex gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
            <span className="text-slate-400">MAYRA is thinking...</span>
          </div>
        </div>
      )}
    </div>
  );
};
