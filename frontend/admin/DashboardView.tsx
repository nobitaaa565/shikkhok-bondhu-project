
import React from 'react';

import { Course, ManagedItem } from './types';

interface DashboardViewProps {
   courses: Course[];
   exclusiveItems: ManagedItem[];
   strategies: ManagedItem[];
}

const DashboardView: React.FC<DashboardViewProps> = ({ courses, exclusiveItems, strategies }) => {
   return (
      <div className="tile p-12 bg-cyan-900/10 border-l-4 border-l-cyan-500 text-center animate-fadeIn">
         <h3 className="text-2xl font-black text-white uppercase tracking-tighter mb-4">Core Persistence Layer Online</h3>
         <p className="text-white/40 text-sm max-w-xl mx-auto mb-10 leading-relaxed font-medium">Administrators can now manage nested course architectures, including modules, video lessons, and digital resource assets. All changes are synchronized to production instantly.</p>
         <div className="flex justify-center gap-12">
            <div className="text-center group">
               <div className="text-4xl font-black text-cyan-400 group-hover:scale-110 transition-transform">{courses.length}</div>
               <div className="text-[0.6rem] font-black text-white/30 uppercase tracking-[0.2em] mt-2">Active Courses</div>
            </div>
            <div className="w-px h-12 bg-white/10 self-center"></div>
            <div className="text-center group">
               <div className="text-4xl font-black text-amber-400 group-hover:scale-110 transition-transform">{exclusiveItems.length}</div>
               <div className="text-[0.6rem] font-black text-white/30 uppercase tracking-[0.2em] mt-2">Verified Assets</div>
            </div>
            <div className="w-px h-12 bg-white/10 self-center"></div>
            <div className="text-center group">
               <div className="text-4xl font-black text-purple-400 group-hover:scale-110 transition-transform">{strategies.length}</div>
               <div className="text-[0.6rem] font-black text-white/30 uppercase tracking-[0.2em] mt-2">Strategies</div>
            </div>
         </div>
      </div>
   );
};

export default DashboardView;
