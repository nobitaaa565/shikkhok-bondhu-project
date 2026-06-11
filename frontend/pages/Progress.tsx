
import React from 'react';

const Progress: React.FC = () => {
  const skills = [
    { name: 'Resource Quality', percent: 85, color: 'var(--amethyst-focus)' },
    { name: 'Community Interaction', percent: 62, color: '#3B82F6' },
    { name: 'Training Completion', percent: 45, color: '#10B981' },
    { name: 'AI Tool Proficiency', percent: 92, color: '#F59E0B' },
  ];

  const badges = [
    { 
      icon: (
        <svg className="w-8 h-8 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ), 
      name: 'Fast Starter', 
      earned: true 
    },
    { 
      icon: (
        <svg className="w-8 h-8 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
      ), 
      name: 'Quality King', 
      earned: true 
    },
    { 
      icon: (
        <svg className="w-8 h-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ), 
      name: 'Collaborator', 
      earned: false 
    },
    { 
      icon: (
        <svg className="w-8 h-8 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ), 
      name: 'Scholar', 
      earned: true 
    },
    { 
      icon: (
        <svg className="w-8 h-8 text-pink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
        </svg>
      ), 
      name: 'Creative', 
      earned: false 
    },
  ];

  return (
    <div className="space-y-16">
      <header>
        <h1 className="text-4xl font-black hero-text-gradient uppercase tracking-tighter mb-4">Growth Tracking</h1>
        <p className="text-white/40 max-w-xl leading-relaxed">Visualize your journey as an educator. Track your skill development, achievements, and professional impact.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <section className="space-y-8">
          <h2 className="text-xl font-black uppercase tracking-tight">Core Proficiencies</h2>
          <div className="space-y-8">
            {skills.map((skill, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between items-end mono text-[0.625rem] uppercase font-bold">
                  <span className="text-white/60">{skill.name}</span>
                  <span className="text-white">{skill.percent}%</span>
                </div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full shadow-[0_0_10px_rgba(124,58,237,0.3)] transition-all duration-1000" 
                    style={{ width: `${skill.percent}%`, backgroundColor: skill.color }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-8">
          <h2 className="text-xl font-black uppercase tracking-tight">Achievements</h2>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
            {badges.map((badge, i) => (
              <div key={i} className={`tile p-6 text-center group transition-all ${badge.earned ? 'opacity-100' : 'opacity-20 grayscale'}`}>
                <div className="mb-3 flex justify-center group-hover:scale-125 transition-transform duration-500">{badge.icon}</div>
                <div className="mono text-[0.5rem] font-black uppercase text-white/50">{badge.name}</div>
              </div>
            ))}
          </div>
          <div className="tile p-6 bg-white/5 border-dashed border-white/10 text-center">
            <p className="text-[0.625rem] mono uppercase text-white/30">Complete 3 more Science workshops to unlock "Einstein's Heir"</p>
          </div>
        </section>
      </div>

      <div className="tile p-12 text-center bg-gradient-to-br from-[var(--amethyst-deep)] to-transparent">
        <h3 className="text-2xl font-black uppercase mb-4 tracking-tight">Leaderboard Ranking</h3>
        <div className="flex justify-center items-end gap-10 py-8">
          <div className="flex flex-col items-center">
            <div className="w-12 h-20 bg-white/5 rounded-t-lg mb-2 relative flex items-end justify-center pb-2 font-black">2</div>
            <div className="text-[0.625rem] mono uppercase">Sarah J.</div>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-12 h-32 bg-[var(--amethyst-focus)]/40 border border-[var(--amethyst-focus)] rounded-t-lg mb-2 relative flex items-end justify-center pb-2 font-black text-xl">1</div>
            <div className="text-[0.625rem] mono uppercase text-[var(--amethyst-focus)] font-black">YOU</div>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-12 h-16 bg-white/5 rounded-t-lg mb-2 relative flex items-end justify-center pb-2 font-black">3</div>
            <div className="text-[0.625rem] mono uppercase">Mark T.</div>
          </div>
        </div>
        <p className="text-[0.625rem] mono uppercase text-white/30 mt-4">Top 1% of Educators in your region</p>
      </div>
    </div>
  );
};

export default Progress;
