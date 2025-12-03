import React, { useEffect, useState } from 'react';

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFading(true);
      setTimeout(onComplete, 500); // Wait for fade out transition
    }, 2500);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className={`fixed inset-0 z-[1000] flex flex-col items-center justify-center bg-bg-body transition-opacity duration-500 ${fading ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
      <div className="relative mb-6">
        <i className="fa-regular fa-eye text-6xl text-ink-main animate-pulse"></i>
        <i className="fa-solid fa-star text-xl text-accent absolute -top-1 -right-4 animate-bounce"></i>
      </div>
      <h1 className="font-brand text-4xl text-ink-main tracking-widest mb-3">PSYCHIC</h1>
      <p className="font-sans text-xs uppercase tracking-[0.2em] text-ink-sec">Psychology-First Fashion</p>
    </div>
  );
};