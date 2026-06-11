
import React, { useState } from 'react';
import ApiService from '../ApiService';
import { ManagedItem, AdminTab } from './types';
import { FormattableTextArea } from './AdminComponents';

interface ItemEditorProps {
   item: ManagedItem;
   setItem: React.Dispatch<React.SetStateAction<ManagedItem | null>>;
   activeTab: AdminTab;
   onSave: (e: React.FormEvent) => void;
   onCancel: () => void;
}

const ItemEditor: React.FC<ItemEditorProps> = ({ item, setItem, activeTab, onSave, onCancel }) => {
   const fileInputRef = React.useRef<HTMLInputElement>(null);

   const [uploading, setUploading] = useState(false);

   const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
         setUploading(true);
         try {
            const category = activeTab === 'exclusive' ? 'exclusive' : 'strategy';
            const data = await ApiService.uploadFile(file, category, true);

            // Auto-detect type based on extension
            const fileName = file.name.toLowerCase();
            let autoType = item.type;
            if (fileName.match(/\.(jpg|jpeg|png|webp|gif|svg)$/i)) autoType = 'image';
            else if (fileName.endsWith('.pdf')) autoType = 'pdf';
            else if (fileName.match(/\.(mp4|webm|ogg|mov)$/i)) autoType = 'video';
            else if (fileName.match(/\.(pptx|ppt|pdf)$/i)) autoType = 'presentation';

            setItem({ ...item, videoUrl: data.file, type: autoType });
         } catch (err) {
            alert('File transmission failed.');
         } finally {
            setUploading(false);
         }
      }
   };

   const getFileName = (url: string | null | undefined) => {
      if (!url) return '';
      const parts = url.split('/');
      return parts[parts.length - 1];
   };

   return (
      <div className="tile p-6 bg-slate-900/60 border-cyan-500/30 animate-fadeIn shadow-xl">
         <div className="flex justify-between items-center mb-6 border-b border-white/5 pb-4">
            <div>
               <h2 className="text-xl font-black text-white uppercase tracking-tighter">Modify {activeTab === 'exclusive' ? 'Repository Asset' : 'Strategy Node'}</h2>
               <p className="text-[0.55rem] text-cyan-400 font-bold uppercase mono tracking-widest mt-0.5">Reference ID: {item.id}</p>
            </div>
            <button onClick={onCancel} className="text-red-500 hover:text-red-400 text-[0.6rem] font-black uppercase flex items-center gap-2 group transition-all">
               <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
               Back
            </button>
         </div>

         <form onSubmit={onSave} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
               <div className="space-y-1">
                  <label className="mono text-[0.55rem] font-black text-white/30 uppercase tracking-widest">Primary Title</label>
                  <input type="text" value={item.title} onChange={e => setItem({ ...item, title: e.target.value })} className="contact-input py-2 px-3 bg-black/40 border-white/10 text-white font-bold text-xs" required />
               </div>
               <div className="space-y-1">
                  <label className="mono text-[0.55rem] font-black text-white/30 uppercase tracking-widest">Position / Order</label>
                  <input type="number" value={item.position || 0} onChange={e => setItem({ ...item, position: parseInt(e.target.value) || 0 })} className="contact-input py-2 px-3 bg-black/40 border-white/10 text-white font-bold text-xs" />
               </div>
               <div className="space-y-1">
                  <label className="mono text-[0.55rem] font-black text-white/30 uppercase tracking-widest">Lead Architect</label>
                  <input type="text" value={item.author || ''} onChange={e => setItem({ ...item, author: e.target.value })} className="contact-input py-2 px-3 bg-black/40 border-white/10 text-white font-bold text-xs" />
               </div>
            </div>

            {activeTab !== 'strategies' && (
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                     <label className="mono text-[0.55rem] font-black text-white/30 uppercase tracking-widest">Subtitle</label>
                     <input type="text" value={item.subtitle || ''} onChange={e => setItem({ ...item, subtitle: e.target.value })} className="contact-input py-2 px-3 bg-black/40 border-white/10 text-white font-bold text-xs" placeholder="e.g. Chapter 1 - Introduction" />
                  </div>
                  <div className="space-y-1">
                     <label className="mono text-[0.55rem] font-black text-white/30 uppercase tracking-widest">Asset Category / Type</label>
                     <select value={item.type} onChange={e => setItem({ ...item, type: e.target.value })} className="contact-input py-2 px-3 bg-black/40 border-white/10 text-white font-bold text-xs">
                        <option value="video">Video Lesson</option>
                        <option value="pdf">Framework (PDF)</option>
                        <option value="quiz">Logic (Quiz)</option>
                        <option value="presentation">Deck</option>
                        <option value="image">Diagram / Image</option>
                     </select>
                  </div>
               </div>
            )}

            {activeTab === 'strategies' && (
               <div className="space-y-2 p-4 bg-white/5 rounded-2xl border border-white/5">
                  <label className="mono text-[0.55rem] font-black text-amber-500 uppercase tracking-widest">Strategy Aesthetic (Book Cover)</label>
                  <div className="flex flex-wrap gap-3 pt-1">
                     {['bg-rose-900', 'bg-emerald-900', 'bg-amber-900', 'bg-indigo-900', 'bg-cyan-900', 'bg-slate-800', 'bg-purple-900', 'bg-blue-900'].map(color => (
                        <button
                           key={color}
                           type="button"
                           onClick={() => setItem({ ...item, bookCover: color })}
                           className={`w-10 h-10 rounded-xl border-2 transition-all ${color} ${item.bookCover === color ? 'border-amber-500 scale-110 shadow-lg shadow-amber-900/40' : 'border-white/5 hover:border-white/20'}`}
                        />
                     ))}
                  </div>
               </div>
            )}

            {/* Content Configuration - Available for both Repository and Strategies now */}
            <div className="space-y-4">
               <div className="p-4 bg-white/5 rounded-2xl border border-white/5 space-y-4">
                  <h3 className="text-xs font-black text-cyan-400 uppercase tracking-widest border-b border-white/5 pb-2">Digital Asset Configuration</h3>

                  {/* File Upload Simulation */}
                  <div className="space-y-1">
                     <label className="mono text-[0.55rem] font-black text-white/30 uppercase tracking-widest">Asset Source (URL / Video / File)</label>
                     <div className="flex flex-col gap-2">
                        <div className="flex gap-2">
                           <input type="text" value={item.videoUrl || ''} onChange={e => setItem({ ...item, videoUrl: e.target.value })} className="flex-1 contact-input py-2 px-3 bg-black/60 border-white/5 text-cyan-400 font-mono text-[0.6rem]" placeholder="https://..." />
                           <input
                              type="file"
                              ref={fileInputRef}
                              className="hidden"
                              onChange={handleFileUpload}
                           />
                           <button
                              type="button"
                              disabled={uploading}
                              onClick={() => fileInputRef.current?.click()}
                              className="px-3 py-2 bg-cyan-600/20 rounded-lg text-[0.55rem] font-black uppercase text-cyan-400 hover:bg-cyan-600 hover:text-white transition-colors disabled:opacity-50 border border-cyan-500/30"
                           >
                              {uploading ? 'Synching...' : 'Upload'}
                           </button>
                        </div>
                        {item.videoUrl && (
                           <div className="px-3 py-1.5 bg-white/5 rounded-lg border border-white/5 flex items-center justify-between">
                              <span className="text-[0.5rem] font-black text-white/40 uppercase tracking-widest">Active File:</span>
                              <span className="text-[0.55rem] font-bold text-cyan-400 mono truncate max-w-[200px]">{getFileName(item.videoUrl)}</span>
                           </div>
                        )}
                     </div>
                  </div>

                  <div className="space-y-1 w-full">
                     <label className="mono text-[0.55rem] font-black text-white/30 uppercase tracking-widest">Extra Provided Links</label>
                     <input type="text" value={item.extraLinks || ''} onChange={e => setItem({ ...item, extraLinks: e.target.value })} className="w-full contact-input py-2 px-3 bg-black/60 border-white/5 text-cyan-400 font-mono text-[0.6rem]" placeholder="https://resource1.com, https://resource2.com" />
                  </div>
               </div>
            </div>

            <FormattableTextArea
               label={activeTab === 'strategies' ? "Full Strategy Content & Methodology" : "General Content"}
               value={item.content || ''}
               onChange={val => setItem({ ...item, content: val })}
               onImageUpload={activeTab === 'strategies' ? async (file) => {
                  const data = await ApiService.uploadFile(file, 'strategy', true);
                  return data.file;
               } : undefined}
            />

            {activeTab !== 'strategies' && (
               <>
                  <FormattableTextArea
                     label="Pedagogy Description"
                     value={item.description || ''}
                     onChange={val => setItem({ ...item, description: val })}
                  />

                  <FormattableTextArea
                     label="Implementation Directions"
                     value={item.directions || ''}
                     onChange={val => setItem({ ...item, directions: val })}
                  />
               </>
            )}

            <div className="pt-6 flex gap-4 border-t border-white/5">
               <button type="button" onClick={onCancel} className="flex-1 py-3 text-[0.6rem] font-black uppercase text-red-500 hover:text-red-400 transition-all rounded-xl border border-white/5">Discard</button>
               <button type="submit" className="flex-1 py-3 bg-cyan-600 text-white force-text-white text-[0.65rem] font-black uppercase tracking-widest rounded-xl shadow-lg hover:bg-cyan-500 transition-all transform active:scale-[0.98]">Deploy Sync</button>
            </div>
         </form >
      </div >
   );
};

export default ItemEditor;
