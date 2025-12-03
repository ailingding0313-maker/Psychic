import React from 'react';
import { AppState, Preferences } from '../types';

interface ViewProfileProps {
  state: AppState;
  onUpdatePreferences: (prefs: Preferences) => void;
  onRetakeTest: () => void;
}

export const ViewProfile: React.FC<ViewProfileProps> = ({ state, onUpdatePreferences, onRetakeTest }) => {
  const handleChange = (key: keyof Preferences, val: string) => {
    onUpdatePreferences({ ...state.preferences, [key]: val });
  };

  const traitLabels: Record<string, string> = { O: "Openness", C: "Conscientiousness", E: "Extraversion", A: "Agreeableness", N: "Sensitivity" };

  return (
    <div className="animate-fade-in max-w-xl mx-auto px-6 py-8">
      <h1 className="text-2xl font-bold mb-6">Profile</h1>

      <div className="bg-white rounded-[20px] p-7 shadow-sm border border-white/50 mb-6 relative">
        <div className="text-[11px] uppercase tracking-[0.15em] text-ink-sec mb-4 font-bold flex items-center gap-3 after:content-[''] after:flex-1 after:h-px after:bg-gray-200">
          Personal Info
        </div>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 text-2xl">
            <i className="fa-solid fa-user"></i>
          </div>
          <div className="flex-1">
            <label className="block text-[11px] font-bold mb-1">Display Name</label>
            <input 
              type="text" 
              value={state.preferences.name} 
              onChange={(e) => handleChange('name', e.target.value)}
              className="w-full p-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-ink-main"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[20px] p-7 shadow-sm border border-white/50 mb-6 relative">
        <div className="text-[11px] uppercase tracking-[0.15em] text-ink-sec mb-4 font-bold flex items-center gap-3 after:content-[''] after:flex-1 after:h-px after:bg-gray-200">
          Big Five Summary
        </div>
        <div className="bg-gray-50 rounded-2xl p-5 mb-4 border border-gray-100">
          {Object.entries(state.traits).map(([key, val]) => (
            <div key={key} className="flex items-center justify-between text-[13px] mb-2 last:mb-0">
              <div className="w-28 font-semibold">{traitLabels[key]}</div>
              <div className="flex-1 h-1.5 bg-gray-200 rounded-full mx-3 overflow-hidden">
                <div className="h-full bg-ink-main rounded-full" style={{ width: `${((val as number) / 20) * 100}%` }}></div>
              </div>
              <div className="w-6 text-right text-gray-500 font-mono text-xs">{val as number}</div>
            </div>
          ))}
          {Object.keys(state.traits).length === 0 && <div className="text-center text-gray-400 text-xs">No data.</div>}
        </div>
        <button onClick={onRetakeTest} className="w-full py-3 bg-gray-50 border border-gray-200 rounded-2xl text-[13px] font-semibold flex items-center justify-center gap-2 hover:bg-gray-100">
          <i className="fa-solid fa-pen-to-square"></i> Retake Personality Test
        </button>
      </div>

      <div className="bg-white rounded-[20px] p-7 shadow-sm border border-white/50 mb-6 relative">
        <div className="text-[11px] uppercase tracking-[0.15em] text-ink-sec mb-4 font-bold flex items-center gap-3 after:content-[''] after:flex-1 after:h-px after:bg-gray-200">
          Appearance Settings
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] font-bold mb-1">Gender Style</label>
            <select value={state.preferences.gender} onChange={(e) => handleChange('gender', e.target.value)} className="w-full p-3 rounded-xl border border-gray-200 text-sm bg-white">
              <option>Womenswear</option><option>Menswear</option><option>Unisex</option>
            </select>
          </div>
          <div>
            <label className="block text-[11px] font-bold mb-1">Skin Tone</label>
            <select value={state.preferences.skin} onChange={(e) => handleChange('skin', e.target.value)} className="w-full p-3 rounded-xl border border-gray-200 text-sm bg-white">
              <option>Fair</option><option>Medium</option><option>Tan</option><option>Deep</option>
            </select>
          </div>
          <div>
            <label className="block text-[11px] font-bold mb-1">Hair Color</label>
            <select value={state.preferences.hair} onChange={(e) => handleChange('hair', e.target.value)} className="w-full p-3 rounded-xl border border-gray-200 text-sm bg-white">
              <option>Black</option><option>Brown</option><option>Blonde</option><option>Red</option>
            </select>
          </div>
          <div>
            <label className="block text-[11px] font-bold mb-1">Hair Style</label>
            <select value={state.preferences.hairStyle} onChange={(e) => handleChange('hairStyle', e.target.value)} className="w-full p-3 rounded-xl border border-gray-200 text-sm bg-white">
              <option>Long Straight</option><option>Wavy</option><option>Short</option><option>Buzz Cut</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[20px] p-7 shadow-sm border border-white/50 mb-6 relative">
        <div className="text-[11px] uppercase tracking-[0.15em] text-ink-sec mb-4 font-bold flex items-center gap-3 after:content-[''] after:flex-1 after:h-px after:bg-gray-200">
          OOTD History
        </div>
        <div className="flex flex-col gap-3">
          {state.history.map((h, i) => (
            <div key={i} className="flex items-center gap-4 p-3 border border-gray-100 rounded-2xl bg-gray-50">
              <img src={h.img} className="w-12 h-12 rounded-lg object-cover bg-gray-200" alt="history" />
              <div className="flex-1">
                <div className="text-[10px] text-gray-400 uppercase font-bold">{h.date}</div>
                <div className="text-[13px] font-semibold text-ink-main">{h.title}</div>
              </div>
            </div>
          ))}
          {state.history.length === 0 && <div className="text-center text-xs text-gray-400 py-4">No history yet.</div>}
        </div>
      </div>
    </div>
  );
};