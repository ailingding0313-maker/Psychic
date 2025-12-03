import React, { useState } from 'react';
import { AppState, ClosetItem } from '../types';
import { analyzeClosetItem } from '../services/geminiService';

interface ViewClosetProps {
  state: AppState;
  addClosetItem: (item: ClosetItem) => void;
  removeClosetItem: (id: number) => void;
  updateClosetItemCategory: (id: number, cat: any) => void;
}

export const ViewCloset: React.FC<ViewClosetProps> = ({ state, addClosetItem, removeClosetItem, updateClosetItemCategory }) => {
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64 = reader.result as string;
        try {
          const analysis = await analyzeClosetItem(base64.split(',')[1]);
          const newItem: ClosetItem = {
            id: Date.now(),
            img: base64,
            category: analysis.category as any,
            color: analysis.color,
            desc: analysis.desc
          };
          addClosetItem(newItem);
        } catch (error) {
          alert("Failed to analyze image. Please try again.");
        } finally {
          setUploading(false);
        }
      };
      reader.readAsDataURL(file);
    } catch (error) {
      setUploading(false);
    }
  };

  const renderCategory = (title: string, catKey: string) => {
    const items = state.userCloset.filter(i => i.category === catKey);
    return (
      <div className="mt-6">
        <div className="text-[11px] uppercase tracking-[0.15em] text-ink-sec mb-4 font-bold flex items-center gap-3 after:content-[''] after:flex-1 after:h-px after:bg-gray-200">
          {title}
        </div>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(100px,1fr))] gap-3">
          {items.map(item => (
            <div key={item.id} className="bg-white rounded-xl overflow-hidden border border-gray-200 flex flex-col transition-transform hover:scale-[1.02]">
              <div className="relative w-full aspect-square bg-gray-50">
                <img src={item.img} alt={item.desc} className="w-full h-full object-cover" />
                <button 
                  onClick={() => { if(confirm('Delete item?')) removeClosetItem(item.id); }}
                  className="absolute top-1 right-1 w-6 h-6 bg-white/90 rounded-full flex items-center justify-center text-red-500 shadow-sm text-sm"
                >
                  <i className="fa-solid fa-times"></i>
                </button>
              </div>
              <div className="p-2 border-t border-gray-100 bg-gray-50">
                <select 
                  value={item.category} 
                  onChange={(e) => updateClosetItemCategory(item.id, e.target.value)}
                  className="w-full text-[10px] p-1 rounded border border-gray-200 bg-white"
                >
                  <option value="Outerwear">Outerwear</option>
                  <option value="Tops">Tops</option>
                  <option value="Bottoms">Bottoms</option>
                  <option value="Accessories">Accessories</option>
                </select>
              </div>
            </div>
          ))}
          {items.length === 0 && <div className="text-xs text-gray-300 italic col-span-2">No items yet.</div>}
        </div>
      </div>
    );
  };

  return (
    <div className="animate-fade-in max-w-xl mx-auto px-6 py-8">
      <h1 className="text-2xl font-bold mb-2">Virtual Closet</h1>
      <p className="text-[13px] text-ink-sec mb-6">Upload items. Psychic will try to build outfits using these items first.</p>

      <label className="block border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center cursor-pointer bg-gray-50 hover:bg-white hover:border-ink-main transition-all group">
        {uploading ? (
          <div className="text-accent text-xs font-bold animate-pulse">Analyzing Pattern & Color...</div>
        ) : (
          <>
            <i className="fa-solid fa-cloud-arrow-up text-3xl text-gray-300 mb-3 group-hover:text-ink-main transition-colors"></i>
            <div className="font-semibold text-[13px]">Add New Item</div>
          </>
        )}
        <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} disabled={uploading} />
      </label>

      {renderCategory('Outerwear', 'Outerwear')}
      {renderCategory('Tops', 'Tops')}
      {renderCategory('Bottoms', 'Bottoms')}
      {renderCategory('Shoes & Accessories', 'Accessories')}
    </div>
  );
};