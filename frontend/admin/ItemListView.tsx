
import React from 'react';
import { ManagedItem, AdminTab } from './types';

interface ItemListViewProps {
  activeTab: AdminTab;
  items: ManagedItem[];
  onAction: (type: 'edit' | 'add' | 'delete', tab: AdminTab, item?: ManagedItem, defaults?: Partial<ManagedItem>) => void;
}

const ItemListView: React.FC<ItemListViewProps> = ({ activeTab, items, onAction }) => {
  return (
    <div className="tile p-0 overflow-hidden bg-slate-900/40 border-white/5 animate-fadeIn">
      <div className="p-4 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
        <h3 className="text-sm font-black uppercase text-white tracking-tight">
          {activeTab === 'exclusive' ? 'Premium Repository' : 'Frameworks'}
        </h3>
        <button onClick={() => onAction('add', activeTab)} className="bg-cyan-600 hover:bg-cyan-500 text-white px-4 py-2 rounded-lg text-[0.55rem] font-black uppercase tracking-widest transition-all shadow-lg">+ New Item</button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-white/5">
              <th className="px-6 py-3 text-[0.55rem] font-black text-white/30 uppercase tracking-widest">Descriptor</th>
              <th className="px-6 py-3 text-[0.55rem] font-black text-white/30 uppercase tracking-widest">Class</th>
              <th className="px-6 py-3 text-[0.55rem] font-black text-white/30 uppercase tracking-widest">
                {activeTab === 'exclusive' ? 'Type' : 'Author'}
              </th>
              <th className="px-6 py-3 text-[0.55rem] font-black text-white/30 uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {items.length > 0 ? items.map((item) => (
              <tr key={item.id} className="group hover:bg-white/[0.02] transition-colors">
                <td className="px-6 py-3">
                  <div className="text-xs font-bold text-white group-hover:text-cyan-400 transition-colors">{item.title || 'Untitled'}</div>
                  <div className="text-[0.45rem] text-white/20 font-black uppercase mono tracking-wider">{item.date}</div>
                </td>
                <td className="px-6 py-3">
                  <div className="flex gap-1.5">
                    <span className="px-1.5 py-0.5 rounded bg-white/5 text-[0.45rem] font-bold text-white/40 uppercase border border-white/5">G{item.grade?.replace('g', '')}</span>
                    <span className="px-1.5 py-0.5 rounded bg-cyan-500/10 text-[0.45rem] font-bold text-cyan-500 uppercase border border-cyan-500/20">{item.subject}</span>
                  </div>
                </td>
                <td className="px-6 py-3 font-medium">
                  <span className="text-[0.55rem] font-black text-white/60 uppercase tracking-[0.1em]">
                    {activeTab === 'exclusive' ? (item.type || 'N/A') : (item.author || 'Admin')}
                  </span>
                </td>
                <td className="px-6 py-3 text-right">
                  <div className="flex justify-end gap-1.5">
                    <button onClick={() => onAction('edit', activeTab, item)} className="p-1.5 rounded-md bg-white/5 text-white/20 hover:text-white transition-all">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                    </button>
                    <button onClick={() => onAction('delete', activeTab, item)} className="p-1.5 rounded-md bg-red-500/5 text-white/20 hover:text-red-400 transition-all">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </div>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={4} className="px-6 py-10 text-center text-white/10 font-black uppercase text-xs tracking-widest">Empty</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ItemListView;
