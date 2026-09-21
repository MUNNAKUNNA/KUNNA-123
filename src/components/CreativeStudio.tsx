import React, { useState } from 'react';
import { 
  Palette, 
  Sparkles, 
  Copy, 
  Check, 
  Film, 
  Youtube, 
  Music, 
  Image as ImageIcon,
  ArrowRight,
  Layers,
  Send
} from 'lucide-react';

interface CreativeStudioProps {
  onAskMayraCreative: (prompt: string) => void;
}

export const CreativeStudio: React.FC<CreativeStudioProps> = ({
  onAskMayraCreative,
}) => {
  const [idea, setIdea] = useState('');
  const [style, setStyle] = useState('Cinematic Photorealism');
  const [aspectRatio, setAspectRatio] = useState('16:9');
  const [category, setCategory] = useState<'image' | 'video' | 'youtube' | 'music'>('image');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPrompt, setGeneratedPrompt] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const presets = [
    { label: "Cinematic Sci-Fi City", idea: "A futuristic smart city in 2050 with neon monorails and lush vertical gardens at twilight", cat: 'image' },
    { label: "YouTube Thumbnail (AI)", idea: "High-contrast dramatic YouTube thumbnail of a futuristic AI assistant interface glowing", cat: 'youtube' },
    { label: "Odisha Heritage Art", idea: "An ancient Konark Sun Temple stone wheel glowing with mystical golden sunset light", cat: 'image' },
    { label: "Video Drone B-Roll", idea: "Sweeping cinematic FPV drone shot through misty Western Ghats mountains at sunrise", cat: 'video' },
    { label: "Lo-Fi Music Concept", idea: "Cozy rainy evening study beat with soothing Indian bamboo flute (Bansuri) melody", cat: 'music' },
  ];

  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!idea.trim()) return;

    if (category !== 'image') {
      // Send directly to MAYRA
      let promptQuery = '';
      if (category === 'youtube') {
        promptQuery = `MAYRA (Creative Mode): Generate 5 viral YouTube titles, an engaging description, SEO tags, and a thumbnail prompt for: "${idea}".`;
      } else if (category === 'video') {
        promptQuery = `MAYRA (Creative Mode): Create a detailed cinematic video prompt with scene transitions, camera movements, and lighting for: "${idea}".`;
      } else {
        promptQuery = `MAYRA (Creative Mode): Create a song concept with lyrics, BPM, instruments, and mood for: "${idea}".`;
      }
      onAskMayraCreative(promptQuery);
      return;
    }

    setIsGenerating(true);
    try {
      const res = await fetch('/api/creative-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          idea,
          style,
          ratio: aspectRatio,
        }),
      });
      const data = await res.json();
      if (data.result) {
        setGeneratedPrompt(data.result);
      } else {
        onAskMayraCreative(`MAYRA, generate a detailed 10-point AI image prompt for: "${idea}" in style ${style} with ratio ${aspectRatio}.`);
      }
    } catch (err) {
      onAskMayraCreative(`MAYRA, generate a detailed 10-point AI image prompt for: "${idea}" in style ${style} with ratio ${aspectRatio}.`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    if (!generatedPrompt) return;
    navigator.clipboard.writeText(generatedPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 max-w-5xl mx-auto w-full space-y-6">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Palette className="w-5 h-5 text-emerald-400" />
            Creative Studio & Prompt Architect
          </h2>
          <p className="text-xs text-slate-400">
            Generate 10-dimension AI image prompts, cinematic video prompts, YouTube branding, and music concepts.
          </p>
        </div>

        {/* Category Pill Switcher */}
        <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
          <button
            type="button"
            onClick={() => setCategory('image')}
            className={`px-2.5 py-1 rounded-lg font-medium flex items-center gap-1 transition-all ${
              category === 'image' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Image Prompts</span>
          </button>
          <button
            type="button"
            onClick={() => setCategory('video')}
            className={`px-2.5 py-1 rounded-lg font-medium flex items-center gap-1 transition-all ${
              category === 'video' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Film className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Video Prompts</span>
          </button>
          <button
            type="button"
            onClick={() => setCategory('youtube')}
            className={`px-2.5 py-1 rounded-lg font-medium flex items-center gap-1 transition-all ${
              category === 'youtube' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Youtube className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">YouTube Titles</span>
          </button>
          <button
            type="button"
            onClick={() => setCategory('music')}
            className={`px-2.5 py-1 rounded-lg font-medium flex items-center gap-1 transition-all ${
              category === 'music' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Music className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Music Concepts</span>
          </button>
        </div>
      </div>

      {/* Generator Form Card */}
      <form onSubmit={handleGenerate} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
            Your Creative Idea or Subject
          </label>
          <input
            type="text"
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
            placeholder="e.g. Cyberpunk street market at dusk with holographic lanterns and wet reflections"
            className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 outline-none focus:border-emerald-500"
          />
        </div>

        {category === 'image' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-medium text-slate-400 mb-1">
                Visual Art Style
              </label>
              <select
                value={style}
                onChange={(e) => setStyle(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 outline-none focus:border-emerald-500"
              >
                <option value="Cinematic Photorealism">Cinematic Photorealism (8K, RAW, 35mm)</option>
                <option value="Hyper-realistic Portrait">Hyper-realistic Studio Portrait</option>
                <option value="Concept Art / Sci-Fi">Digital Concept Art & Sci-Fi</option>
                <option value="Anime / Studio Ghibli">Anime Aesthetic (Ghibli / Makoto Shinkai)</option>
                <option value="Minimalist Vector / Brand">Minimalist Vector & Modern Branding</option>
                <option value="Oil Painting / Classical">Oil Painting & Impressionist</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-400 mb-1">
                Aspect Ratio
              </label>
              <select
                value={aspectRatio}
                onChange={(e) => setAspectRatio(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 outline-none focus:border-emerald-500"
              >
                <option value="16:9">16:9 (Landscape / Wallpaper / Cinematic)</option>
                <option value="9:16">9:16 (Portrait / Mobile / Reel / Shorts)</option>
                <option value="1:1">1:1 (Square / Instagram / Avatar)</option>
                <option value="4:3">4:3 (Classic Academy)</option>
                <option value="3:4">3:4 (Editorial Portrait)</option>
              </select>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between pt-2">
          {/* Presets */}
          <div className="flex flex-wrap gap-1.5">
            {presets.slice(0, 3).map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setIdea(p.idea);
                  setCategory(p.cat as any);
                }}
                className="text-[11px] px-2 py-1 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-emerald-300 transition-colors"
              >
                {p.label}
              </button>
            ))}
          </div>

          <button
            type="submit"
            disabled={!idea.trim() || isGenerating}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-medium text-xs flex items-center gap-2 transition-colors shrink-0"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isGenerating ? 'MAYRA is crafting...' : 'Architect Prompt'}</span>
          </button>
        </div>
      </form>

      {/* Generated Result Card */}
      {generatedPrompt && (
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-emerald-500/40 space-y-4 shadow-lg shadow-emerald-950/20">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
                <Layers className="w-4 h-4" />
              </span>
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                MAYRA Master Prompt Breakdown (10 Dimensions)
              </h3>
            </div>
            <button
              type="button"
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied to Clipboard!' : 'Copy Full Prompt'}</span>
            </button>
          </div>

          <div className="bg-slate-950 rounded-xl p-4 border border-slate-850 font-mono text-xs text-emerald-200/90 whitespace-pre-wrap leading-relaxed overflow-x-auto">
            {generatedPrompt}
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => onAskMayraCreative(`MAYRA, please create 3 variations of this prompt with different color palettes and lighting: ${generatedPrompt.slice(0, 150)}...`)}
              className="text-xs text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1"
            >
              <span>Ask MAYRA for variations</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
