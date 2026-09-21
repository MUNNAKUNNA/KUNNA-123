import React, { useState } from 'react';
import { 
  CheckSquare, 
  Square, 
  Plus, 
  Trash2, 
  Calendar, 
  Clock, 
  FileText, 
  Tag, 
  Sparkles,
  BookOpen,
  AlertCircle
} from 'lucide-react';
import { ReminderItem, NoteItem } from '../types';

interface PersonalHubProps {
  reminders: ReminderItem[];
  notes: NoteItem[];
  onAddReminder: (item: Omit<ReminderItem, 'id'>) => void;
  onToggleReminder: (id: string) => void;
  onDeleteReminder: (id: string) => void;
  onAddNote: (item: Omit<NoteItem, 'id' | 'updatedAt'>) => void;
  onDeleteNote: (id: string) => void;
  onAskMayraToPlan: (goal: string) => void;
}

export const PersonalHub: React.FC<PersonalHubProps> = ({
  reminders,
  notes,
  onAddReminder,
  onToggleReminder,
  onDeleteReminder,
  onAddNote,
  onDeleteNote,
  onAskMayraToPlan,
}) => {
  const [activeTab, setActiveTab] = useState<'tasks' | 'notes' | 'study'>('tasks');
  const [newTitle, setNewTitle] = useState('');
  const [newDue, setNewDue] = useState('Today, 6:00 PM');
  const [newType, setNewType] = useState<'reminder' | 'todo' | 'schedule'>('todo');

  // Note form state
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [noteTag, setNoteTag] = useState('General');

  // Study plan state
  const [studySubject, setStudySubject] = useState('');
  const [studyHours, setStudyHours] = useState('2 hours');

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    onAddReminder({
      title: newTitle.trim(),
      dueTime: newDue,
      completed: false,
      type: newType,
      priority: 'normal',
    });
    setNewTitle('');
  };

  const handleCreateNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteTitle.trim() || !noteContent.trim()) return;
    onAddNote({
      title: noteTitle.trim(),
      content: noteContent.trim(),
      tag: noteTag,
    });
    setNoteTitle('');
    setNoteContent('');
  };

  const handleCreateStudyPlan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studySubject.trim()) return;
    onAskMayraToPlan(`MAYRA, please create a structured daily study schedule for "${studySubject}" with ${studyHours} per day. Include clear milestones and time blocks.`);
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 max-w-6xl mx-auto w-full space-y-6">
      {/* Tab Selector */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Calendar className="w-5 h-5 text-emerald-400" />
            Personal Assistant Hub
          </h2>
          <p className="text-xs text-slate-400">
            Manage your reminders, tasks, notes, and study schedules.
          </p>
        </div>

        <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
          <button
            type="button"
            onClick={() => setActiveTab('tasks')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeTab === 'tasks' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Tasks & Reminders ({reminders.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('notes')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeTab === 'notes' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Notes ({notes.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('study')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeTab === 'study' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Study Planner
          </button>
        </div>
      </div>

      {/* TASKS & REMINDERS VIEW */}
      {activeTab === 'tasks' && (
        <div className="space-y-6">
          {/* Quick Add Form */}
          <form onSubmit={handleCreateTask} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Plus className="w-3.5 h-3.5 text-emerald-400" /> Add New Item
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
              <input
                type="text"
                placeholder="What do you need to do? (e.g. Finish Android Gradle config)"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="sm:col-span-6 px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 outline-none focus:border-emerald-500"
              />
              <input
                type="text"
                placeholder="Due (e.g. Today, 5:00 PM)"
                value={newDue}
                onChange={(e) => setNewDue(e.target.value)}
                className="sm:col-span-3 px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 outline-none focus:border-emerald-500"
              />
              <select
                value={newType}
                onChange={(e) => setNewType(e.target.value as any)}
                className="sm:col-span-2 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 outline-none focus:border-emerald-500"
              >
                <option value="todo">To-Do Task</option>
                <option value="reminder">Reminder</option>
                <option value="schedule">Schedule</option>
              </select>
              <button
                type="submit"
                className="sm:col-span-1 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs flex items-center justify-center transition-colors"
              >
                Add
              </button>
            </div>
          </form>

          {/* List of items */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {reminders.map((item) => (
              <div
                key={item.id}
                className={`p-3.5 rounded-xl border transition-all flex items-start justify-between gap-3 ${
                  item.completed
                    ? 'bg-slate-950/60 border-slate-850 opacity-60'
                    : 'bg-slate-900/90 border-slate-800 hover:border-slate-700'
                }`}
              >
                <button
                  type="button"
                  onClick={() => onToggleReminder(item.id)}
                  className="mt-0.5 text-emerald-400 hover:text-emerald-300 transition-colors"
                >
                  {item.completed ? (
                    <CheckSquare className="w-4 h-4" />
                  ) : (
                    <Square className="w-4 h-4 text-slate-500" />
                  )}
                </button>

                <div className="flex-1 text-left">
                  <p className={`text-xs font-medium ${item.completed ? 'line-through text-slate-400' : 'text-slate-100'}`}>
                    {item.title}
                  </p>
                  <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-500" />
                      {item.dueTime}
                    </span>
                    <span className="px-1.5 py-0.2 rounded text-[10px] bg-slate-800 text-slate-300 border border-slate-700/50 uppercase">
                      {item.type}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onDeleteReminder(item.id)}
                  className="text-slate-500 hover:text-rose-400 p-1 transition-colors"
                  title="Delete item"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* NOTES VIEW */}
      {activeTab === 'notes' && (
        <div className="space-y-6">
          {/* Create Note */}
          <form onSubmit={handleCreateNote} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-cyan-400" /> New Quick Note
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <input
                type="text"
                placeholder="Note Title"
                value={noteTitle}
                onChange={(e) => setNoteTitle(e.target.value)}
                className="sm:col-span-2 px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 outline-none focus:border-cyan-500"
              />
              <input
                type="text"
                placeholder="Tag (e.g. Work, Ideas, Code)"
                value={noteTag}
                onChange={(e) => setNoteTag(e.target.value)}
                className="sm:col-span-1 px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 outline-none focus:border-cyan-500"
              />
            </div>
            <textarea
              rows={3}
              placeholder="Write your note, idea or project draft..."
              value={noteContent}
              onChange={(e) => setNoteContent(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 outline-none focus:border-cyan-500 resize-none"
            />
            <div className="flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-medium text-xs transition-colors"
              >
                Save Note
              </button>
            </div>
          </form>

          {/* Notes Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {notes.map((note) => (
              <div
                key={note.id}
                className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-xs font-semibold text-white truncate">{note.title}</h3>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-cyan-300 border border-slate-700">
                      {note.tag}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-2 whitespace-pre-wrap leading-relaxed line-clamp-4">
                    {note.content}
                  </p>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-[11px] text-slate-500">
                  <span>{note.updatedAt}</span>
                  <button
                    type="button"
                    onClick={() => onDeleteNote(note.id)}
                    className="text-slate-500 hover:text-rose-400 p-1 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* STUDY & PRODUCTIVITY PLANNER VIEW */}
      {activeTab === 'study' && (
        <div className="space-y-6">
          <div className="p-5 rounded-2xl bg-gradient-to-tr from-slate-900 via-slate-900 to-emerald-950/30 border border-slate-800 space-y-4">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">MAYRA Study & Goal Planner</h3>
                <p className="text-xs text-slate-300 mt-0.5">
                  Let MAYRA generate an optimal daily revision and study routine tailored to your subject and available hours.
                </p>
              </div>
            </div>

            <form onSubmit={handleCreateStudyPlan} className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-2">
              <input
                type="text"
                placeholder="Subject or Skill (e.g. Android Jetpack Compose & Kotlin, or Class 12 Physics)"
                value={studySubject}
                onChange={(e) => setStudySubject(e.target.value)}
                className="sm:col-span-7 px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 outline-none focus:border-emerald-500"
              />
              <select
                value={studyHours}
                onChange={(e) => setStudyHours(e.target.value)}
                className="sm:col-span-3 px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 outline-none focus:border-emerald-500"
              >
                <option value="1 hour">1 hour / day</option>
                <option value="2 hours">2 hours / day</option>
                <option value="3 hours">3 hours / day</option>
                <option value="4+ hours">4+ hours / day</option>
              </select>
              <button
                type="submit"
                className="sm:col-span-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Generate Plan</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
