import React, { useState } from 'react';
import { AppState, StrategyResult, HistoryItem } from '../types';
import { generateStrategy } from '../services/geminiService';

interface ViewDailyProps {
  state: AppState;
  updateHistory: (item: HistoryItem) => void;
  setMood: (mood: string | null) => void;
}

const MOODS = [
  { label: 'Anxious 🌪️', val: 'Anxious' },
  { label: 'Tired ☁️', val: 'Tired' },
  { label: 'Calm 🍃', val: 'Calm' },
  { label: 'Confident 🔥', val: 'Confident' },
  { label: 'Gloomy 🌧️', val: 'Gloomy' },
  { label: 'Excited ✨', val: 'Excited' }
];

export const ViewDaily: React.FC<ViewDailyProps> = ({ state, updateHistory, setMood }) => {
  const [goal, setGoal] = useState('calm');
  const [context, setContext] = useState('University');
  const [weather, setWeather] = useState('Sunny');
  const [temp, setTemp] = useState(4);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<StrategyResult | null>(null);
  const [aiImage, setAiImage] = useState<string>('');

  const handleGenerate = async () => {
    if (!state.currentMood) {
      alert("Please select your current mood first.");
      return;
    }
    setLoading(true);
    setResult(null);

    try {
      const strategy = await generateStrategy(state, goal, context, weather, temp);
      setResult(strategy);

      // Simple AI Image Fallback Logic
      const safeGender = state.preferences.gender === "Menswear" ? "man" : "woman";
      const shortItem = strategy.keyItem ? strategy.keyItem.split(' ').slice(0, 3).join(' ') : "fashion";
      const aiPrompt = `fashion photo, ${safeGender}, ${shortItem}, ${strategy.styleName} style`;
      const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(aiPrompt)}?width=800&height=1000&nologo=true&seed=${Math.random()}`;
      setAiImage(url);

      updateHistory({
        date: new Date().toLocaleDateString(),
        title: strategy.vibeTitle,
        img: url
      });

    } catch (e) {
      alert("Generation failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setMood(null);
    setResult(null);
    setAiImage('');
  };

  return (
    <div className="animate-fade-in max-w-xl mx-auto px-6 py-8">
      <div className="text-center mb-8">
        <div className="font-brand text-2xl font-semibold text-ink-main">PSYCHIC</div>
        <div className="text-[9px] text-ink-sec tracking-[0.15em] mt-1 font-bold uppercase">Psychology-First Fashion</div>
      </div>

      <div className="bg-white rounded-[20px] p-7 shadow-sm border border-white/50 mb-6 relative">
        <div className="text-[11px] uppercase tracking-[0.15em] text-ink-sec mb-4 font-bold flex items-center gap-3 after:content-[''] after:flex-1 after:h-px after:bg-gray-200">
          1. Current Mood
        </div>
        <div className="grid grid-cols-3 gap-2">
          {MOODS.map((m) => (
            <div
              key={m.val}
              onClick={() => setMood(m.val)}
              className={`border rounded-2xl py-4 px-2 text-center text-[13px] cursor-pointer transition-all ${state.currentMood === m.val ? 'bg-ink-main text-white border-ink-main shadow-md' : 'bg-white border-gray-200 text-ink-sec hover:border-ink-main hover:text-ink-main'}`}
            >
              {m.label}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-[20px] p-7 shadow-sm border border-white/50 mb-6 relative">
        <div className="text-[11px] uppercase tracking-[0.15em] text-ink-sec mb-4 font-bold flex items-center gap-3 after:content-[''] after:flex-1 after:h-px after:bg-gray-200">
          2. Goal & Context
        </div>
        
        <div className="mb-4">
          <label className="block text-xs font-semibold mb-1.5 text-ink-main">Desired Mood</label>
          <div className="relative">
            <select value={goal} onChange={(e) => setGoal(e.target.value)} className="w-full p-3.5 rounded-xl border border-gray-200 bg-white text-sm outline-none focus:border-ink-main appearance-none text-ink-main">
              <option value="calm">Calm & Grounded (Regulation)</option>
              <option value="confident">Confident & Powerful (Armor)</option>
              <option value="creative">Creative & Expressive (Flow)</option>
              <option value="social">Social & Magnetic (Connection)</option>
              <option value="safe">Safe & Cozy (Protection)</option>
            </select>
            <i className="fa-solid fa-chevron-down absolute right-4 top-4 text-xs text-gray-400 pointer-events-none"></i>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div>
            <label className="block text-xs font-semibold mb-1.5 text-ink-main">Context</label>
            <div className="relative">
              <select value={context} onChange={(e) => setContext(e.target.value)} className="w-full p-3.5 rounded-xl border border-gray-200 bg-white text-sm outline-none focus:border-ink-main appearance-none text-ink-main">
                <option value="University">📚 University</option>
                <option value="Office">💼 Office</option>
                <option value="Date">🍷 Date</option>
                <option value="Casual">☕ Casual</option>
                <option value="Home">🏠 Home</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1.5 text-ink-main">Weather</label>
            <div className="relative">
              <select value={weather} onChange={(e) => setWeather(e.target.value)} className="w-full p-3.5 rounded-xl border border-gray-200 bg-white text-sm outline-none focus:border-ink-main appearance-none text-ink-main">
                <option value="Sunny">☀️ Sunny</option>
                <option value="Rainy">🌧️ Rainy</option>
                <option value="Cold">❄️ Cold</option>
                <option value="Mild">⛅ Mild</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl border border-gray-200">
          <i className="fa-solid fa-temperature-half text-gray-400"></i>
          <input 
            type="range" 
            min="-10" 
            max="40" 
            value={temp} 
            onChange={(e) => setTemp(parseInt(e.target.value))}
            className="flex-1 h-1 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-ink-main"
          />
          <span className="text-xs font-semibold min-w-[30px]">{temp}°C</span>
        </div>
      </div>

      <div className="flex gap-3 mt-8">
        <button onClick={handleReset} className="w-[30%] py-4 bg-gray-100 text-ink-main border border-gray-200 rounded-2xl font-semibold text-[13px] flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors">
          <i className="fa-solid fa-rotate-right"></i> Reset
        </button>
        <button onClick={handleGenerate} disabled={loading} className="flex-1 py-4 bg-ink-main text-white rounded-2xl font-semibold text-[13px] tracking-widest uppercase flex items-center justify-center gap-2 shadow-lg hover:bg-black active:scale-95 transition-all disabled:opacity-70 disabled:cursor-not-allowed">
          {loading ? <><i className="fa-solid fa-spinner fa-spin"></i> Analyzing...</> : <span>✨ Generate Look</span>}
        </button>
      </div>

      <div className="text-center text-[10px] text-gray-300 mt-4">Powered by Gemini 2.5 Flash</div>

      {result && (
        <div className="bg-white rounded-[20px] p-7 shadow-sm border border-ink-main mt-6 relative animate-slide-up">
          <div className="text-[11px] uppercase tracking-[0.15em] text-ink-main mb-4 font-bold flex items-center gap-3 after:content-[''] after:flex-1 after:h-px after:bg-gray-200">
            Your Editorial Strategy
          </div>

          <img 
            src={aiImage} 
            alt="AI Outfit" 
            className="w-full aspect-[4/5] bg-gray-100 rounded-2xl object-cover mb-6 shadow-md"
            onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80"; }}
          />

          <div className="font-serif text-3xl font-semibold italic text-ink-main mb-3 leading-tight tracking-tight">
            "{result.vibeTitle}"
          </div>

          <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 mb-6 text-amber-900 text-[13px] italic flex items-start gap-3">
            <i className="fa-solid fa-lightbulb mt-1"></i>
            <span>{result.moodBoost}</span>
          </div>

          <p className="text-sm leading-relaxed text-ink-sec mb-6">
            {state.preferences.name !== 'User' ? `${state.preferences.name}, ` : ''}{result.psychAnalysis}
          </p>

          <div className="text-[11px] uppercase tracking-[0.15em] text-ink-sec mb-4 font-bold flex items-center gap-3 after:content-[''] after:flex-1 after:h-px after:bg-gray-200">
            Color Psychology
          </div>
          <div className="flex gap-3 mb-6 items-center">
            {result.hexColors.map((c, i) => (
              <div key={i} className="w-10 h-10 rounded-full border border-black/10 shadow-sm" style={{ backgroundColor: c }}></div>
            ))}
          </div>
          <p className="text-[13px] text-ink-sec mb-6 italic">{result.colorPsychology}</p>

          <div className="grid grid-cols-2 gap-5 border-y border-gray-200 py-6 mb-6">
            <div>
              <div className="text-[10px] uppercase text-gray-400 tracking-widest mb-1">Archetype</div>
              <div className="text-sm font-semibold text-ink-main">{result.styleName}</div>
            </div>
            <div>
              <div className="text-[10px] uppercase text-gray-400 tracking-widest mb-1">Silhouette</div>
              <div className="text-sm font-semibold text-ink-main">{result.silhouette}</div>
            </div>
            <div>
              <div className="text-[10px] uppercase text-gray-400 tracking-widest mb-1">Key Item</div>
              <div className="text-sm font-semibold text-ink-main">{result.keyItem}</div>
            </div>
          </div>

          <div className="text-[11px] uppercase tracking-[0.15em] text-ink-sec mb-4 font-bold flex items-center gap-3 after:content-[''] after:flex-1 after:h-px after:bg-gray-200">
            Shop The Look
          </div>
          <div className="flex flex-wrap gap-2 mb-6">
            {result.shopTerms.map((term, i) => (
              <a 
                key={i} 
                href={`https://www.google.com/search?tbm=shop&q=${encodeURIComponent(`${term} ${state.preferences.gender}`)}`}
                target="_blank"
                rel="noreferrer"
                className="text-[11px] px-4 py-2 rounded-full border border-gray-200 text-ink-main bg-white hover:bg-gray-50 hover:border-ink-main transition-all font-medium flex items-center gap-1.5"
              >
                {term} <i className="fa-solid fa-arrow-up-right-from-square text-[9px]"></i>
              </a>
            ))}
          </div>

          {(result.usedClosetItem || findClosetMatch(state.userCloset, result.suggestedCategory, result.suggestedColor)) && (
            <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-200 text-emerald-800">
              <div className="flex items-center gap-2 text-[13px] font-bold mb-1">
                <i className="fa-solid fa-check-circle"></i> From Your Closet
              </div>
              <p className="text-[13px] m-0 text-emerald-900">
                {result.usedClosetItem 
                  ? `We built this look around your: ${result.keyItem}`
                  : `Closet Match: Try your ${findClosetMatch(state.userCloset, result.suggestedCategory, result.suggestedColor)?.desc}.`
                }
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Helper
function findClosetMatch(closet: any[], cat: string, col: string) {
  if(!cat || !col) return null;
  return closet.find(i => 
    (i.category === cat) && 
    (i.color.toLowerCase().includes(col.toLowerCase()) || col.toLowerCase().includes(i.color.toLowerCase()))
  );
}