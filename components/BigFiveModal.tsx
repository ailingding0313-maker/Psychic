import React, { useState } from 'react';
import { TraitScores } from '../types';

interface BigFiveModalProps {
  initialTraits: TraitScores;
  onSave: (traits: TraitScores) => void;
  isOpen: boolean;
  onClose: () => void; // Optional if mandatory
}

const QUESTIONS = [
  { id: 'E', text: "1. I see myself as outgoing, sociable." },
  { id: 'E', text: "2. I see myself as talkative." },
  { id: 'A', text: "3. I see myself as helpful and unselfish." },
  { id: 'A', text: "4. I see myself as trusting and forgiving." },
  { id: 'C', text: "5. I see myself as thorough and reliable." },
  { id: 'C', text: "6. I see myself as organized." },
  { id: 'N', text: "7. I see myself as anxious or easily upset." },
  { id: 'N', text: "8. I see myself as moody." },
  { id: 'O', text: "9. I see myself as imaginative and original." },
  { id: 'O', text: "10. I see myself as artistic." }
];

export const BigFiveModal: React.FC<BigFiveModalProps> = ({ initialTraits, onSave, isOpen }) => {
  const [answers, setAnswers] = useState<number[]>(Array(10).fill(5));

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newTraits: TraitScores = { O: 0, C: 0, E: 0, A: 0, N: 0 };
    
    QUESTIONS.forEach((q, idx) => {
      // @ts-ignore
      newTraits[q.id] += parseInt(answers[idx].toString());
    });
    
    onSave(newTraits);
  };

  const handleRangeChange = (index: number, val: string) => {
    const newAnswers = [...answers];
    newAnswers[index] = parseInt(val);
    setAnswers(newAnswers);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-[4px] z-[2000] flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg max-h-[85vh] overflow-y-auto rounded-[24px] p-8 shadow-2xl">
        <h2 className="font-serif text-2xl font-bold mb-3 text-ink-main">Personality Profile</h2>
        <p className="text-sm text-ink-sec mb-6">
          Psychic needs to know the real you to suggest outfits that feel right. 
          Rate each statement from 0 (Not at all) to 10 (Completely).
        </p>

        <form onSubmit={handleSubmit}>
          {QUESTIONS.map((q, idx) => (
            <div key={idx} className="mb-6 border-b border-gray-100 pb-4 last:border-0">
              <div className="font-semibold text-sm mb-3 text-ink-main">{q.text}</div>
              <div className="flex items-center gap-3">
                <span className="text-[10px] uppercase text-gray-400 font-bold w-8 text-center">No</span>
                <input 
                  type="range" 
                  min="0" 
                  max="10" 
                  value={answers[idx]} 
                  onChange={(e) => handleRangeChange(idx, e.target.value)}
                  className="flex-1 accent-ink-main h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <span className="text-[10px] uppercase text-gray-400 font-bold w-8 text-center">Yes</span>
              </div>
            </div>
          ))}
          <button type="submit" className="w-full py-4 bg-ink-main text-white font-bold uppercase tracking-widest text-xs rounded-2xl hover:bg-black transition-all shadow-lg active:scale-95">
            Save Profile
          </button>
        </form>
      </div>
    </div>
  );
};