
import React, { useState, useRef, useEffect } from 'react';

export const ConfirmModal: React.FC<{
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  type?: 'danger' | 'warning';
}> = ({ isOpen, title, message, onConfirm, onCancel, confirmText = "Confirm", type = 'danger' }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="tile w-full max-w-md p-8 bg-slate-900 border-white/10 shadow-2xl relative overflow-hidden confirm-modal transition-colors duration-300">
        <div className={`absolute top-0 left-0 w-full h-1 ${type === 'danger' ? 'bg-red-500' : 'bg-amber-500'}`}></div>

        <div className="mb-6">
          <h3 className="text-xl font-black text-white uppercase tracking-tight mb-2 confirm-title">{title}</h3>
          <p className="text-white/40 text-sm leading-relaxed confirm-text">{message}</p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-3 rounded-xl bg-white/5 text-white/60 hover:text-white hover:bg-white/10 text-[0.65rem] font-black uppercase tracking-widest transition-all confirm-cancel"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 py-3 rounded-xl text-white force-text-white text-[0.65rem] font-black uppercase tracking-widest transition-all shadow-lg ${type === 'danger' ? 'bg-red-600 hover:bg-red-500 shadow-red-900/20' : 'bg-amber-600 hover:bg-amber-500 shadow-amber-900/20'}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
      <style>{`
        [data-theme='light'] .confirm-modal { background-color: #ffffff !important; border-color: #e2e8f0 !important; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1) !important; }
        [data-theme='light'] .confirm-title { color: #0f172a !important; }
        [data-theme='light'] .confirm-text { color: #64748b !important; }
        [data-theme='light'] .confirm-cancel { background-color: #f1f5f9 !important; color: #64748b !important; border: 1px solid #cbd5e1 !important; }
        [data-theme='light'] .confirm-cancel:hover { background-color: #e2e8f0 !important; color: #334155 !important; }
      `}</style>
    </div>
  );
};

export const FormattableTextArea: React.FC<{
  value: string;
  onChange: (val: string) => void;
  label: string;
  onImageUpload?: (file: File) => Promise<string>;
}> = ({ value, onChange, label, onImageUpload }) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value;
    }
  }, []);

  const applyCommand = (command: string, arg?: string) => {
    document.execCommand(command, false, arg);
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const handleImageFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onImageUpload) {
      try {
        const url = await onImageUpload(file);
        applyCommand('insertImage', url);
        // Important: Reset input so same file can be uploaded twice if needed
        e.target.value = '';
      } catch (err) {
        alert("Image integration failed.");
      }
    }
  };

  const ToolbarButton = ({ cmd, arg, label, icon, onClick }: { cmd?: string, arg?: string, label?: string, icon?: React.ReactNode, onClick?: () => void }) => (
    <button
      type="button"
      onClick={() => onClick ? onClick() : applyCommand(cmd!, arg)}
      className="h-8 px-2 flex items-center justify-center rounded hover:bg-white/10 text-white transition-colors"
      title={label}
    >
      {icon || <span className="font-bold text-xs uppercase">{label}</span>}
    </button>
  );

  return (
    <div className="space-y-2">
      <label className="mono text-[0.625rem] font-black text-white/30 uppercase tracking-widest ml-1">{label}</label>

      <div className="relative group border border-white/10 rounded-xl overflow-hidden bg-black/40">
        <div className="flex flex-wrap gap-1 p-1 bg-white/5 border-b border-white/10">
          <ToolbarButton cmd="bold" icon={<b className="text-sm">B</b>} label="Bold" />
          <ToolbarButton cmd="italic" icon={<i className="text-sm serif">I</i>} label="Italic" />
          <ToolbarButton cmd="underline" icon={<span className="underline text-sm">U</span>} label="Underline" />
          <div className="w-px h-6 bg-white/10 mx-1 self-center" />
          <ToolbarButton cmd="formatBlock" arg="h3" label="H3" />
          <ToolbarButton cmd="formatBlock" arg="p" label="P" />
          <div className="w-px h-6 bg-white/10 mx-1 self-center" />
          <ToolbarButton cmd="insertUnorderedList" icon={<span className="text-xs">• List</span>} label="Bullets" />
          <ToolbarButton cmd="insertOrderedList" icon={<span className="text-xs">1. List</span>} label="Numbers" />
          <div className="w-px h-6 bg-white/10 mx-1 self-center" />
          <ToolbarButton cmd="indent" icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 6h16M10 12h10M10 18h10M4 12l3 3-3 3" strokeWidth={2} /></svg>} label="Indent" />
          <ToolbarButton cmd="outdent" icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 6h16M10 12h10M10 18h10M7 12l-3 3 3 3" strokeWidth={2} /></svg>} label="Outdent" />
          {onImageUpload && (
            <>
              <div className="w-px h-6 bg-white/10 mx-1 self-center" />
              <ToolbarButton
                onClick={() => fileInputRef.current?.click()}
                icon={<svg className="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>}
                label="Insert Image"
              />
              <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageFile} />
            </>
          )}
        </div>
        <div
          ref={editorRef}
          contentEditable
          onInput={(e) => onChange(e.currentTarget.innerHTML)}
          className="contact-input bg-transparent border-none focus:bg-transparent focus:ring-0 min-h-[300px] text-sm font-sans overflow-y-auto formatted-content-editor p-4 outline-none"
        />
      </div>

      <style>{`
        .formatted-content-editor { line-height: 2.0; color: rgba(255,255,255,0.9); font-size: 1.25rem; text-align: justify; }
        /* Force all children to inherit color, overriding pasted inline styles */
        .formatted-content-editor * { 
           color: inherit !important; 
           background-color: transparent !important; 
           font-family: 'CustomBangla', 'Inter', sans-serif !important; 
           font-size: inherit !important; 
           line-height: inherit !important; 
           text-align: inherit !important; 
        }
        .formatted-content-editor p, .formatted-content-editor li, .formatted-content-editor div { color: inherit; }
        .formatted-content-editor b, .formatted-content-editor h3, .formatted-content-editor strong { font-weight: 800; color: #ffffff; }
        .formatted-content-editor h3 { font-size: 1.5rem; font-weight: 900; margin: 1.5rem 0 0.75rem 0; line-height: 1.2; }
        .formatted-content-editor ul { list-style-type: disc; padding-left: 2rem; margin: 1rem 0; }
        .formatted-content-editor ol { list-style-type: decimal; padding-left: 2rem; margin: 1rem 0; }
        .formatted-content-editor p { margin-bottom: 2.5rem; }
        .formatted-content-editor br { display: block; margin-top: 1.5rem; content: ""; }
        .formatted-content-editor img { max-width: 120px; max-height: 120px; object-fit: cover; border-radius: 0.75rem; border: 2px solid rgba(255,255,255,0.1); margin: 0.75rem 0; display: inline-block; vertical-align: middle; }
        .formatted-content-editor blockquote { border-left: 4px solid #f59e0b; padding-left: 1.5rem; margin: 2rem 0; color: rgba(255,255,255,0.6); font-style: italic; }

        /* Light Mode Theme Overrides */
        [data-theme='light'] .formatted-content-editor { color: #1e293b !important; }
        [data-theme='light'] .formatted-content-editor p, 
        [data-theme='light'] .formatted-content-editor li, 
        [data-theme='light'] .formatted-content-editor div { color: #334155 !important; }
        [data-theme='light'] .formatted-content-editor b, 
        [data-theme='light'] .formatted-content-editor h3, 
        [data-theme='light'] .formatted-content-editor strong { color: #0f172a !important; }
        [data-theme='light'] .formatted-content-editor blockquote { color: #475569 !important; border-left-color: #f59e0b !important; }
      `}</style>
    </div>
  );
};

export const VideoPreview: React.FC<{ url?: string }> = ({ url }) => {
  const isYouTube = (input: string) => {
    return input.includes('youtube.com') || input.includes('youtu.be') || input.includes('<iframe');
  };

  const getYouTubeEmbedUrl = (input: string) => {
    const trimmedInput = input.trim();
    if (trimmedInput.includes('<iframe')) {
      const match = trimmedInput.match(/src=["'](.+?)["']/);
      return match ? match[1] : null;
    }
    if (trimmedInput.includes('youtube.com/embed/')) return trimmedInput;
    if (trimmedInput.includes('youtube.com/watch?v=')) {
      const id = trimmedInput.split('v=')[1]?.split('&')[0];
      return id ? `https://www.youtube.com/embed/${id}` : null;
    }
    if (trimmedInput.includes('youtu.be/')) {
      const id = trimmedInput.split('youtu.be/')[1]?.split('?')[0];
      return id ? `https://www.youtube.com/embed/${id}` : null;
    }
    return null;
  };

  if (!url) {
    return (
      <div className="aspect-video bg-black/40 rounded-xl flex items-center justify-center text-white/20 text-[0.6rem] uppercase font-black border border-white/5 border-dashed">
        <div className="text-center px-4">
          <svg className="w-8 h-8 mx-auto mb-2 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
          Waiting for Source
        </div>
      </div>
    );
  }

  if (isYouTube(url)) {
    const embedUrl = getYouTubeEmbedUrl(url);
    if (!embedUrl) return <div className="aspect-video bg-red-900/20 rounded-xl flex items-center justify-center text-red-500 text-[0.5rem] font-bold border border-red-500/20">Invalid YT Source</div>;
    return (
      <div className="aspect-video rounded-xl overflow-hidden border border-white/10 shadow-lg bg-black relative group">
        <iframe className="w-full h-full" src={embedUrl} title="YT" frameBorder="0" allowFullScreen></iframe>
      </div>
    );
  }

  return (
    <div className="aspect-video rounded-xl overflow-hidden border border-white/10 shadow-lg bg-black relative group">
      <video className="w-full h-full object-cover" src={url} controls={false} />
      <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="px-3 py-1.5 rounded-lg bg-cyan-600 text-white text-[0.55rem] font-black uppercase shadow-xl">Native File Ingested</div>
      </div>
    </div>
  );
};
