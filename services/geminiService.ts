import { GoogleGenAI, Type } from "@google/genai";
import { AppState, ClosetItem, StrategyResult } from "../types";

// NOTE: In a real app, use process.env.API_KEY. 
// For this generation, we assume the environment variable is set.
const genAI = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

const MODEL_NAME = 'gemini-2.5-flash';

export const analyzeClosetItem = async (base64Image: string): Promise<{ category: string; color: string; desc: string }> => {
  try {
    const prompt = `Analyze this clothing item. Return JSON with keys: "category" (one of: "Outerwear", "Tops", "Bottoms", "Accessories"), "color" (e.g. "Navy Blue"), "desc" (short description e.g. "Denim Jacket").`;
    
    const response = await genAI.models.generateContent({
      model: MODEL_NAME,
      contents: {
        parts: [
          { text: prompt },
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: base64Image
            }
          }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            category: { type: Type.STRING, enum: ["Outerwear", "Tops", "Bottoms", "Accessories"] },
            color: { type: Type.STRING },
            desc: { type: Type.STRING }
          },
          required: ["category", "color", "desc"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    return JSON.parse(text);
  } catch (error) {
    console.error("Closet Analysis Error:", error);
    throw error;
  }
};

export const generateStrategy = async (
  state: AppState,
  goal: string,
  context: string,
  weather: string,
  temp: number
): Promise<StrategyResult> => {
  try {
    const closetSummary = state.userCloset.length > 0
      ? JSON.stringify(state.userCloset.map(i => `${i.color} ${i.desc} (${i.category})`))
      : "No items in closet";

    const prompt = `
      User: ${state.preferences.name}. 
      Profile: ${JSON.stringify(state.preferences)}. 
      Traits: ${JSON.stringify(state.traits)}.
      Current Mood: ${state.currentMood}. 
      Goal Mood: ${goal}. 
      Context: ${context}. 
      Weather: ${weather}, ${temp}°C.
      
      CLOSET INVENTORY: ${closetSummary}.
      
      Act as a fashion psychologist named "Psychic".
      
      CRITICAL INSTRUCTION: 
      1. SCAN the User's Closet Inventory FIRST.
      2. Is there an item in the closet that FITS the mood/weather/goal?
      3. IF YES: You MUST choose that item as the "keyItem". Set "usedClosetItem": true.
      4. IF NO: Suggest a new item. Set "usedClosetItem": false.
      
      Strictly analyze Temperature for feasibility.
      
      Return JSON strictly matching the schema.
    `;

    const response = await genAI.models.generateContent({
      model: MODEL_NAME,
      contents: {
        parts: [{ text: prompt }]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            vibeTitle: { type: Type.STRING },
            moodBoost: { type: Type.STRING },
            psychAnalysis: { type: Type.STRING },
            styleName: { type: Type.STRING },
            silhouette: { type: Type.STRING },
            keyItem: { type: Type.STRING },
            usedClosetItem: { type: Type.BOOLEAN },
            hexColors: { type: Type.ARRAY, items: { type: Type.STRING } },
            colorPsychology: { type: Type.STRING },
            outfitDesc: { type: Type.STRING },
            shopTerms: { type: Type.ARRAY, items: { type: Type.STRING } },
            suggestedCategory: { type: Type.STRING },
            suggestedColor: { type: Type.STRING }
          },
          required: ["vibeTitle", "moodBoost", "psychAnalysis", "styleName", "keyItem", "usedClosetItem", "hexColors"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    return JSON.parse(text);
  } catch (error) {
    console.error("Strategy Generation Error:", error);
    throw error;
  }
};