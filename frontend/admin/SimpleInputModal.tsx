import React, { useState } from 'react';

interface SimpleInputModalProps {
    title: string;
    label: string;
    placeholder?: string;
    onSubmit: (value: string) => void;
    onCancel: () => void;
}

const SimpleInputModal: React.FC<SimpleInputModalProps> = ({ title, label, placeholder, onSubmit, onCancel }) => {
    const [value, setValue] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (value.trim()) {
            onSubmit(value);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fadeIn">
            <div className={`bg-slate-900 border border-white/10 rounded-2xl p-8 w-full max-w-md shadow-2xl relative simple-modal transition-colors duration-300`}>
                <button
                    onClick={onCancel}
                    className="absolute top-4 right-4 text-white/30 hover:text-white transition-colors close-btn"
                >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>

                <h3 className="text-xl font-black text-white uppercase tracking-tight mb-6 modal-title">{title}</h3>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-[0.65rem] font-black text-cyan-400 uppercase tracking-widest modal-label">{label}</label>
                        <input
                            type="text"
                            value={value}
                            onChange={(e) => setValue(e.target.value)}
                            placeholder={placeholder}
                            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white font-bold focus:outline-none focus:border-cyan-500/50 transition-all modal-input"
                            autoFocus
                        />
                    </div>

                    <div className="flex gap-4 pt-2">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="flex-1 py-3 rounded-xl border border-white/10 text-white/60 font-black text-[0.65rem] uppercase hover:bg-white/5 transition-all modal-cancel"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={!value.trim()}
                            className="flex-1 py-3 rounded-xl bg-cyan-600 text-white force-text-white font-black text-[0.65rem] uppercase tracking-widest hover:bg-cyan-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-cyan-900/20"
                        >
                            Confirm
                        </button>
                    </div>
                </form>
            </div>
            <style>{`
                [data-theme='light'] .simple-modal { background-color: #ffffff !important; border-color: #e2e8f0 !important; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1) !important; }
                [data-theme='light'] .modal-title { color: #0f172a !important; }
                [data-theme='light'] .modal-label { color: #0891b2 !important; }
                [data-theme='light'] .modal-input { background-color: #f8fafc !important; border-color: #cbd5e1 !important; color: #0f172a !important; }
                [data-theme='light'] .modal-input:focus { border-color: #0891b2 !important; box-shadow: 0 0 0 3px rgba(8, 145, 178, 0.1) !important; }
                [data-theme='light'] .modal-cancel { border-color: #e2e8f0 !important; color: #64748b !important; }
                [data-theme='light'] .close-btn { color: #94a3b8 !important; }
                [data-theme='light'] .close-btn:hover { color: #0f172a !important; }
            `}</style>
        </div>
    );
};

export default SimpleInputModal;
