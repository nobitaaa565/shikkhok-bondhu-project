
import React from 'react';
import { Course } from './types';

interface TrainingListViewProps {
  courses: Course[];
  onAction: (type: 'edit' | 'add' | 'delete', course?: Course) => void;
}

const TrainingListView: React.FC<TrainingListViewProps> = ({ courses, onAction }) => {
  return (
    <div className="tile p-0 overflow-hidden bg-slate-900/40 border-white/5 animate-fadeIn">
      <div className="p-4 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
        <h3 className="text-sm font-black uppercase text-white tracking-tight">Training Architecture Database</h3>
        <button onClick={() => onAction('add')} className="bg-cyan-600 hover:bg-cyan-500 text-white px-4 py-2 rounded-lg text-[0.55rem] font-black uppercase tracking-widest transition-all shadow-lg">+ New Course</button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-white/5">
              <th className="px-6 py-3 text-[0.55rem] font-black text-white/30 uppercase tracking-widest">Detail</th>
              <th className="px-6 py-3 text-[0.55rem] font-black text-white/30 uppercase tracking-widest">Instructor</th>
              <th className="px-6 py-3 text-[0.55rem] font-black text-white/30 uppercase tracking-widest">Blocks</th>
              <th className="px-6 py-3 text-[0.55rem] font-black text-white/30 uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {courses.length > 0 ? courses.map((c) => (
              <tr key={c.id} className="group hover:bg-white/[0.02] transition-colors">
                <td className="px-6 py-3">
                  <div className="text-xs font-bold text-white group-hover:text-cyan-400 transition-colors">{c.title || 'Untitled'}</div>
                  <div className="text-[0.45rem] text-cyan-500/60 font-black uppercase tracking-wider">{c.level}</div>
                </td>
                <td className="px-6 py-3 text-xs text-white/60 font-medium">{c.instructor}</td>
                <td className="px-6 py-3 text-[0.65rem] font-bold text-white/40 mono">{c.modules?.length || 0} Mod</td>
                <td className="px-6 py-3 text-right">
                  <div className="flex justify-end gap-1.5">
                    <button onClick={() => onAction('edit', c)} className="p-1.5 rounded-md bg-white/5 text-white/20 hover:text-white transition-all" title="Edit">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                    </button>
                    <button onClick={() => onAction('delete', c)} className="p-1.5 rounded-md bg-red-500/5 text-white/20 hover:text-red-400 transition-all" title="Delete">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </div>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={4} className="px-6 py-10 text-center text-white/10 font-black uppercase text-xs tracking-widest">Memory Empty</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TrainingListView;
