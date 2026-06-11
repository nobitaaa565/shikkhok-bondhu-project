
import React from 'react';
import { useNavigate } from 'react-router-dom';

const Impact: React.FC = () => {
  const navigate = useNavigate();

  const metrics = [
    { 
      label: 'Educators Empowered', 
      value: '15,402', 
      growth: '+22%', 
      icon: (
        <svg className="w-8 h-8 text-[var(--amethyst-focus)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      )
    },
    { 
      label: 'Students Reached', 
      value: '2.5M+', 
      growth: '+45%', 
      icon: (
        <svg className="w-8 h-8 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 14l9-5-9-5-9 5 9 5z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
        </svg>
      )
    },
    { 
      label: 'Resources Shared', 
      value: '500k+', 
      growth: '+18%', 
      icon: (
        <svg className="w-8 h-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z" />
        </svg>
      )
    },
    { 
      label: 'Partner Schools', 
      value: '850+', 
      growth: '+12%', 
      icon: (
        <svg className="w-8 h-8 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      )
    },
  ];

  const stories = [
    {
      name: "The Detroit Initiative",
      role: "Public School District",
      quote: "EduCore transformed our STEM curriculum. We saw a 30% increase in student engagement within one semester.",
      stat: "30% Engagement Boost",
      image: (
        <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      )
    },
    {
      name: "Rural Access Project",
      role: "Community Outreach",
      quote: "For the first time, our remote teachers have access to world-class materials instantly. It bridges the gap.",
      stat: "100% Resource Availability",
      image: (
        <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      )
    },
    {
      name: "Global STEM Alliance",
      role: "International Non-Profit",
      quote: "Standardizing quality across 12 countries was impossible until we adopted EduCore's collaborative framework.",
      stat: "12 Countries Unified",
      image: (
        <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    }
  ];

  return (
    <div className="space-y-32">
      {/* Hero Section */}
      <section className="text-center pt-20 relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-2xl h-64 bg-[var(--amethyst-focus)] blur-[120px] opacity-20 -z-10 pointer-events-none"></div>
        
        <div className="flex items-center justify-center gap-2 mono text-sm text-[var(--amethyst-focus)] mb-6 font-bold uppercase">
          <span className="status-pulse"></span> Measuring Change
        </div>
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black leading-none gradient-text mb-8 tracking-tighter uppercase">
          The Butterfly Effect<br />of Education
        </h1>
        <p className="max-w-3xl mx-auto text-white/60 leading-relaxed text-lg md:text-xl mb-12">
          We believe that empowering a single teacher can transform the lives of hundreds of students. Here is the data behind our mission to democratize educational excellence.
        </p>
      </section>

      {/* Metrics Grid */}
      <section>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.map((m, i) => (
            <div key={i} className="tile p-4 md:p-8 text-center group hover:-translate-y-2 transition-transform duration-500">
              <div className="flex justify-center mb-6 group-hover:scale-110 transition-transform duration-300">{m.icon}</div>
              <div className="stat-number text-3xl md:text-5xl mb-2">{m.value}</div>
              <div className="mono text-xs text-white/40 uppercase font-bold mb-4">{m.label}</div>
              <div className="inline-block px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-bold">
                {m.growth} YoY
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Map / Global Reach Visualization */}
      <section className="tile p-10 md:p-20 overflow-hidden relative border-amber-500/30">
        <div className="absolute top-0 right-0 p-10 opacity-5 text-9xl text-white font-black">WORLD</div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="mono text-sm text-amber-500 mb-4 font-black uppercase">GLOBAL FOOTPRINT</div>
            <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tighter uppercase">Breaking Borders<br/>Through Knowledge</h2>
            <p className="text-white/60 leading-relaxed mb-8">
              EduCore is currently active in 120+ countries, translating resources into 15 languages and adapting curriculums for local cultural contexts.
            </p>
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-white/5 pb-2">
                <span className="font-bold uppercase text-sm">North America</span>
                <span className="mono text-amber-500 font-bold">45%</span>
              </div>
              <div className="flex items-center justify-between border-b border-white/5 pb-2">
                <span className="font-bold uppercase text-sm">Europe</span>
                <span className="mono text-amber-500 font-bold">30%</span>
              </div>
              <div className="flex items-center justify-between border-b border-white/5 pb-2">
                <span className="font-bold uppercase text-sm">Asia Pacific</span>
                <span className="mono text-amber-500 font-bold">15%</span>
              </div>
              <div className="flex items-center justify-between border-b border-white/5 pb-2">
                <span className="font-bold uppercase text-sm">Emerging Markets</span>
                <span className="mono text-amber-500 font-bold">10%</span>
              </div>
            </div>
          </div>
          <div className="relative h-[400px] bg-white/5 rounded-2xl border border-white/10 flex items-center justify-center group">
             {/* Abstract Map Graphic */}
             <div className="absolute inset-0 flex items-center justify-center opacity-30">
                <svg viewBox="0 0 200 100" className="w-full h-full fill-current text-[var(--amethyst-focus)]">
                   <path d="M20,50 Q50,20 80,50 T140,50 T180,50" fill="none" stroke="currentColor" strokeWidth="0.5" />
                   <path d="M10,30 Q60,80 110,30 T190,60" fill="none" stroke="currentColor" strokeWidth="0.5" />
                   <circle cx="40" cy="40" r="2" />
                   <circle cx="90" cy="60" r="3" />
                   <circle cx="150" cy="30" r="2" />
                   <circle cx="170" cy="70" r="1" />
                </svg>
             </div>
             <div className="text-center z-10">
               <div className="flex justify-center text-[var(--amethyst-focus)] mb-2 animate-pulse">
                 <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                 </svg>
               </div>
               <div className="mono text-[0.625rem] uppercase font-bold text-white/50">Live Activity Map</div>
             </div>
          </div>
        </div>
      </section>

      {/* Stories */}
      <section>
        <div className="text-center mb-16">
          <div className="mono text-sm text-[var(--amethyst-focus)] mb-4 font-black uppercase">SUCCESS STORIES</div>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight uppercase">Real World Impact</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stories.map((story, i) => (
            <div key={i} className="tile p-10 flex flex-col justify-between group hover:border-[var(--amethyst-focus)]/50 transition-colors">
              <div>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded bg-[var(--amethyst-deep)] flex items-center justify-center border border-white/10">
                    {story.image}
                  </div>
                  <div>
                    <h3 className="font-black uppercase text-sm tracking-tight">{story.name}</h3>
                    <p className="mono text-xs text-white/40 uppercase">{story.role}</p>
                  </div>
                </div>
                <p className="text-white/70 italic text-lg leading-relaxed mb-8">"{story.quote}"</p>
              </div>
              <div className="border-t border-white/5 pt-6">
                <div className="mono text-[0.625rem] text-[var(--amethyst-focus)] font-black uppercase">Key Result</div>
                <div className="text-2xl font-black mt-1 gradient-text">{story.stat}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Vision 2030 */}
      <section className="bg-gradient-to-b from-[var(--amethyst-deep)]/20 to-transparent p-12 md:p-24 rounded-3xl border border-white/5 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[var(--amethyst-focus)] to-transparent opacity-50"></div>
        
        <h2 className="text-4xl md:text-6xl font-black mb-8 tracking-tighter uppercase">Vision 2030</h2>
        <p className="max-w-2xl mx-auto text-white/60 text-lg mb-12">
          Our commitment to the United Nations Sustainable Development Goal 4: Quality Education. By 2030, we aim to provide free, high-quality digital resources to 10 million underserved classrooms.
        </p>
        <button 
          onClick={() => navigate('/signup')}
          className="cta-button focus-border px-12 py-5 text-sm"
        >
          <span className="relative z-10">Join the Movement</span>
        </button>
      </section>

    </div>
  );
};

export default Impact;
