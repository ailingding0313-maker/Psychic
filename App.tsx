import React, { useState, useEffect } from 'react';
import { INITIAL_STATE, AppState, TraitScores, Preferences, HistoryItem, ClosetItem } from './types';
import { ViewDaily } from './components/ViewDaily';
import { ViewCloset } from './components/ViewCloset';
import { ViewProfile } from './components/ViewProfile';
import { TutorialOverlay } from './components/TutorialOverlay';
import { BigFiveModal } from './components/BigFiveModal';
import { SplashScreen } from './components/SplashScreen';

export default function App() {
  // State
  const [appState, setAppState] = useState<AppState>(INITIAL_STATE);
  const [activeView, setActiveView] = useState<'daily' | 'closet' | 'profile'>('daily');
  
  // UI Flow State
  const [showSplash, setShowSplash] = useState(true);
  const [showTutorial, setShowTutorial] = useState(false);
  const [showBigFive, setShowBigFive] = useState(false);

  // Load from local storage on mount
  useEffect(() => {
    const savedTraits = localStorage.getItem('mindfit_traits');
    const savedPrefs = localStorage.getItem('mindfit_prefs');
    const savedHistory = localStorage.getItem('mindfit_history');
    const savedCloset = localStorage.getItem('mindfit_closet');
    const tutorialSeen = localStorage.getItem('mindfit_tutorial');

    const newState = { ...INITIAL_STATE };
    if (savedTraits) newState.traits = JSON.parse(savedTraits);
    if (savedPrefs) newState.preferences = JSON.parse(savedPrefs);
    if (savedHistory) newState.history = JSON.parse(savedHistory);
    if (savedCloset) newState.userCloset = JSON.parse(savedCloset);
    setAppState(newState);

    // Flow control is handled in onSplashComplete
  }, []);

  const handleSplashComplete = () => {
    setShowSplash(false);
    const tutorialSeen = localStorage.getItem('mindfit_tutorial');
    const hasTraits = localStorage.getItem('mindfit_traits');

    if (!tutorialSeen) {
      setShowTutorial(true);
    } else if (!hasTraits) {
      setShowBigFive(true);
    }
  };

  const handleTutorialClose = () => {
    setShowTutorial(false);
    localStorage.setItem('mindfit_tutorial', 'true');
    const hasTraits = localStorage.getItem('mindfit_traits');
    if (!hasTraits) {
      setShowBigFive(true);
    }
  };

  const saveTraits = (traits: TraitScores) => {
    setAppState(prev => {
      const next = { ...prev, traits };
      localStorage.setItem('mindfit_traits', JSON.stringify(traits));
      return next;
    });
    setShowBigFive(false);
  };

  const savePreferences = (preferences: Preferences) => {
    setAppState(prev => {
      const next = { ...prev, preferences };
      localStorage.setItem('mindfit_prefs', JSON.stringify(preferences));
      return next;
    });
  };

  const updateHistory = (item: HistoryItem) => {
    setAppState(prev => {
      const next = { ...prev, history: [item, ...prev.history] };
      localStorage.setItem('mindfit_history', JSON.stringify(next.history));
      return next;
    });
  };

  // Closet Actions
  const addClosetItem = (item: ClosetItem) => {
    setAppState(prev => {
      const next = { ...prev, userCloset: [...prev.userCloset, item] };
      localStorage.setItem('mindfit_closet', JSON.stringify(next.userCloset));
      return next;
    });
  };
  
  const removeClosetItem = (id: number) => {
    setAppState(prev => {
      const next = { ...prev, userCloset: prev.userCloset.filter(i => i.id !== id) };
      localStorage.setItem('mindfit_closet', JSON.stringify(next.userCloset));
      return next;
    });
  };

  const updateClosetItemCategory = (id: number, cat: any) => {
    setAppState(prev => {
      const next = { 
        ...prev, 
        userCloset: prev.userCloset.map(i => i.id === id ? { ...i, category: cat } : i) 
      };
      localStorage.setItem('mindfit_closet', JSON.stringify(next.userCloset));
      return next;
    });
  };

  const setMood = (mood: string | null) => {
    setAppState(prev => ({ ...prev, currentMood: mood }));
  };

  return (
    <>
      {showSplash && <SplashScreen onComplete={handleSplashComplete} />}
      {showTutorial && <TutorialOverlay onClose={handleTutorialClose} />}
      <BigFiveModal 
        isOpen={showBigFive} 
        initialTraits={appState.traits} 
        onSave={saveTraits}
        onClose={() => setShowBigFive(false)}
      />

      <div className="absolute top-5 right-5 z-[800]">
        <button 
          onClick={() => setShowTutorial(true)}
          className="w-8 h-8 rounded-full bg-white border border-gray-200 text-ink-sec shadow-sm flex items-center justify-center hover:bg-ink-main hover:text-white transition-colors"
        >
          <i className="fa-solid fa-question"></i>
        </button>
      </div>

      <div className={showSplash ? 'hidden' : 'block'}>
        {activeView === 'daily' && (
          <ViewDaily 
            state={appState} 
            updateHistory={updateHistory} 
            setMood={setMood} 
          />
        )}
        {activeView === 'closet' && (
          <ViewCloset 
            state={appState} 
            addClosetItem={addClosetItem} 
            removeClosetItem={removeClosetItem}
            updateClosetItemCategory={updateClosetItemCategory}
          />
        )}
        {activeView === 'profile' && (
          <ViewProfile 
            state={appState} 
            onUpdatePreferences={savePreferences} 
            onRetakeTest={() => setShowBigFive(true)} 
          />
        )}
      </div>

      <nav className="fixed bottom-0 left-0 right-0 h-[70px] bg-white/95 backdrop-blur-md border-t border-gray-100 flex justify-around items-center z-[900] pb-safe">
        <NavButton 
          active={activeView === 'daily'} 
          onClick={() => setActiveView('daily')} 
          icon="fa-wand-magic-sparkles" 
          label="DAILY" 
        />
        <NavButton 
          active={activeView === 'closet'} 
          onClick={() => setActiveView('closet')} 
          icon="fa-shirt" 
          label="CLOSET" 
        />
        <NavButton 
          active={activeView === 'profile'} 
          onClick={() => setActiveView('profile')} 
          icon="fa-user" 
          label="PROFILE" 
        />
      </nav>
    </>
  );
}

const NavButton = ({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: string; label: string }) => (
  <div 
    onClick={onClick}
    className={`flex flex-col items-center gap-1.5 cursor-pointer w-[60px] transition-all duration-300 ${active ? 'text-ink-main' : 'text-gray-400'}`}
  >
    <i className={`fa-solid ${icon} text-xl transition-transform duration-200 ${active ? '-translate-y-0.5' : ''}`}></i>
    <span className="text-[9px] font-bold tracking-wider">{label}</span>
  </div>
);