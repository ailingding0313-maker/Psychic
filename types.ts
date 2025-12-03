export interface TraitScores {
  O: number;
  C: number;
  E: number;
  A: number;
  N: number;
}

export interface Preferences {
  name: string;
  gender: string;
  skin: string;
  hair: string;
  hairStyle: string;
}

export interface ClosetItem {
  id: number;
  img: string; // Base64
  category: 'Outerwear' | 'Tops' | 'Bottoms' | 'Accessories';
  color: string;
  desc: string;
}

export interface HistoryItem {
  date: string;
  title: string;
  img: string;
}

export interface StrategyResult {
  vibeTitle: string;
  moodBoost: string;
  psychAnalysis: string;
  styleName: string;
  silhouette: string;
  keyItem: string;
  usedClosetItem: boolean;
  hexColors: string[];
  colorPsychology: string;
  outfitDesc: string;
  shopTerms: string[];
  suggestedCategory: string;
  suggestedColor: string;
}

export interface AppState {
  currentMood: string | null;
  userCloset: ClosetItem[];
  preferences: Preferences;
  traits: TraitScores;
  history: HistoryItem[];
}

export const INITIAL_STATE: AppState = {
  currentMood: null,
  userCloset: [],
  preferences: { 
    name: "User", 
    gender: "Womenswear", 
    skin: "Medium", 
    hair: "Brown", 
    hairStyle: "Long Straight" 
  },
  traits: { O: 5, C: 5, E: 5, A: 5, N: 5 },
  history: []
};