import React, { useState } from 'react';

interface TutorialOverlayProps {
  onClose: () => void;
}

export const TutorialOverlay: React.FC<TutorialOverlayProps> = ({ onClose }) => {
  const [step, setStep] = useState(1);

  const steps = [
    {
      id: 1,
      icon: "fa-wand-magic-sparkles",
      title: "Daily Style",
      desc: "Select your current mood and context. Psychic uses psychology to generate the perfect outfit strategy."
    },
    {
      id: 2,
      icon: "fa-shirt",
      title: "Smart Closet",
      desc: "Upload photos of your clothes. The AI will prioritize items from your closet to create the best outfit for you!"
    },
    {
      id: 3,
      icon: "fa-user",
      title: "Your Profile",
      desc: "Manage your Big Five personality traits, style preferences, and view your outfit history."
    }
  ];

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      onClose();
    }
  };

  const currentStep = steps[step - 1];

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-[3000] flex flex-col justify-center items-center text-white p-10 text-center animate-fade-in">
      
      <div className="animate-slide-up key={step}">
        <i className={`fa-solid ${currentStep.icon} text-5xl mb-6 text-[#fbbf24]`}></i>
        <div className="font-brand text-2xl mb-4">{currentStep.title}</div>
        <div className="text-sm leading-relaxed text-gray-300 mb-10 max-w-xs mx-auto">
          {currentStep.desc}
        </div>
      </div>

      <button 
        onClick={handleNext}
        className="w-48 py-4 bg-white text-black font-bold uppercase tracking-widest text-xs rounded-2xl hover:bg-gray-100 transition-colors shadow-lg"
      >
        {step === 3 ? "Get Started" : "Next"}
      </button>

      <div className="flex gap-2 mt-8 justify-center">
        {[1, 2, 3].map(i => (
          <div 
            key={i} 
            className={`w-2 h-2 rounded-full transition-colors ${i === step ? 'bg-white' : 'bg-gray-600'}`}
          />
        ))}
      </div>
    </div>
  );
};