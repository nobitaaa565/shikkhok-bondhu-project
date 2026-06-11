
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import ApiService from '../ApiService';

interface Strategy {
  id: string; title: string; author: string; grade: string; subject: string; bookCover: string;
  content: string;
  readTime: string;
  date: string;
  type?: string;
  status?: string;
}

const FormattedText: React.FC<{ text: string }> = ({ text }) => {
  if (!text) return null;
  return <div className="formatted-content" dangerouslySetInnerHTML={{ __html: text }} />;
};

const ModernDropdown: React.FC<{ label: string; options: { id: string; title: string }[]; selectedId: string; onSelect: (id: string) => void }> = ({ label, options, selectedId, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const selectedOption = options.find(o => o.id === selectedId);
  return (
    <div className="relative w-full md:w-72" ref={dropdownRef}>
      <label className="block mono text-[0.625rem] text-[#f59e0b] uppercase font-black mb-2">{label}</label>
      <button onClick={() => setIsOpen(!isOpen)} className="w-full flex items-center justify-between px-5 py-3 rounded-xl border border-white/10 bg-[var(--tile-bg)] text-sm font-bold text-white hover:border-[#f59e0b]/50">
        {selectedOption ? selectedOption.title : 'Select...'}
        <svg className="w-4 h-4 text-[#f59e0b]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
      </button>
      {isOpen && (
        <div className="absolute z-50 top-full left-0 right-0 mt-2 bg-slate-900 border border-white/10 rounded-xl shadow-2xl p-2 space-y-1">
          {options.map(o => (
            <button key={o.id} onClick={() => { onSelect(o.id); setIsOpen(false); }} className={`w-full text-left px-4 py-2 rounded-lg text-sm font-bold ${selectedId === o.id ? 'bg-[#f59e0b] text-white force-text-white' : 'text-white/60 hover:bg-white/5'}`}>{o.title}</button>
          ))}
        </div>
      )}
    </div>
  );
};

const TeachingStrategies: React.FC = () => {
  const { strategyId } = useParams();
  const navigate = useNavigate();
  const [selectedGrade, setSelectedGrade] = useState('g3');
  const [selectedSubject, setSelectedSubject] = useState('math');
  const [selectedUnit, setSelectedUnit] = useState('all');
  const [readingStrategy, setReadingStrategy] = useState<Strategy | null>(null);
  const [strategies, setStrategies] = useState<Strategy[]>([]);
  const [bookmarks, setBookmarks] = useState<string[]>([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await ApiService.getStrategies();
        // The backend returns snake_case or slightly different fields? 
        // Let's ensure compatibility.
        const mappedData = data.map((s: any) => ({
          ...s,
          // If backend uses default models.DateField it might be YYYY-MM-DD
          // If frontend expects more, we can adjust.
          date: s.date || new Date(s.uploaded_at).toLocaleDateString()
        }));
        setStrategies(mappedData);
      } catch (err) {
        console.error("Failed to fetch strategies:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    setBookmarks(JSON.parse(localStorage.getItem('educore_bookmarks') || '[]'));

    // Handle deep-link
    if (strategyId) {
      // Find will work after state is updated in fetchData
    }
  }, [strategyId]);

  // Deep-link effect
  useEffect(() => {
    if (strategyId && strategies.length > 0) {
      const match = strategies.find((s: Strategy) => String(s.id) === strategyId);
      if (match) setReadingStrategy(match);
    }
  }, [strategyId, strategies]);

  const toggleBookmark = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const bookmarkKey = `strategy:${id}`;
    let newBookmarks;
    if (bookmarks.includes(bookmarkKey)) {
      newBookmarks = bookmarks.filter(b => b !== bookmarkKey);
    } else {
      newBookmarks = [...bookmarks, bookmarkKey];
    }
    setBookmarks(newBookmarks);
    localStorage.setItem('educore_bookmarks', JSON.stringify(newBookmarks));
  };

  const filtered = strategies.filter(s => {
    const matchesGrade = s.grade === selectedGrade;
    const matchesSubject = s.subject === selectedSubject;
    const matchesUnit = selectedUnit === 'all' || s.unit === selectedUnit;
    const isVisible = s.type !== 'structure' && s.status !== 'Hidden';
    return matchesGrade && matchesSubject && matchesUnit && isVisible;
  });

  const handleBack = () => {
    setReadingStrategy(null);
    navigate('/teaching-strategies');
  };

  const handleOpenStrategy = (s: Strategy) => {
    setReadingStrategy(s);
    navigate(`/teaching-strategies/${s.id}`);
  };

  if (readingStrategy) {
    return (
      <>
        <div className="max-w-4xl mx-auto py-12 animate-fadeIn">
          <button onClick={handleBack} className="flex items-center gap-2 text-xs font-black uppercase text-[#f59e0b] mb-12 hover:underline"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg> Back to Library</button>
          <div className="flex flex-col md:flex-row gap-12 items-end mb-16">
            <div className="relative group/cover">
              <div className={`w-40 h-56 rounded-xl shadow-2xl ${readingStrategy.bookCover} shrink-0 border-l-4 border-white/20 p-4 flex flex-col justify-between items-center text-center force-text-white`}>
                <span className="mono text-[0.5rem] font-black text-white/40 uppercase force-text-white">Strategy</span>
                <div className="font-bold text-lg text-white leading-tight force-text-white">{readingStrategy.title}</div>
                <div className="w-8 h-8 rounded-full bg-white/10"></div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <h1 className="text-5xl font-black text-white uppercase tracking-tighter leading-none">{readingStrategy.title}</h1>
                <button
                  onClick={(e) => toggleBookmark(e, readingStrategy.id)}
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-all border ${bookmarks.includes(`strategy:${readingStrategy.id}`) ? 'bg-amber-500 border-amber-400 text-black' : 'bg-white/5 border-white/10 text-white/40 hover:text-white'}`}
                >
                  <svg className={`w-6 h-6 ${bookmarks.includes(`strategy:${readingStrategy.id}`) ? 'fill-current' : 'fill-none'}`} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                  </svg>
                </button>
              </div>
              <p className="text-white/40 font-bold uppercase text-xs italic">Authored by {readingStrategy.author} • {readingStrategy.date}</p>
            </div>
          </div>
          <article className="text-white/80 leading-normal text-lg font-sans border-t border-white/5 pt-12">
            {/* Step 1 badge */}
            <div className="mb-6">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 text-white font-black text-sm shadow-lg shadow-amber-500/30 [html[data-theme='light']_&]:shadow-amber-400/50 [html[data-theme='light']_&]:ring-2 [html[data-theme='light']_&]:ring-amber-400/40">
                    01
                  </span>
                  <span className="text-[0.65rem] font-black uppercase tracking-[0.2em] text-amber-500 bg-amber-400/15 border border-amber-400/40 px-3 py-1.5 rounded-full [html[data-theme='light']_&]:text-amber-600 [html[data-theme='light']_&]:bg-amber-100 [html[data-theme='light']_&]:border-amber-300">
                    Step
                  </span>
                </div>
                <div className="flex-1 h-px bg-gradient-to-r from-amber-400/30 via-white/10 to-transparent [html[data-theme='light']_&]:from-amber-400/50 [html[data-theme='light']_&]:via-slate-200 [html[data-theme='light']_&]:to-transparent" />
              </div>
            </div>
            {readingStrategy.title.includes('সেশন ৪. ভগ্নাংশের যোগ') && (
              <div className="mb-10 animate-fadeIn space-y-12">
                <Link to="/simulation/fraction-addition" className="group block no-underline transition-transform hover:scale-[1.01]">
                  <div className="relative w-full rounded-2xl overflow-hidden border border-white/10 bg-[#0f172a] hover:border-[#f59e0b]/50 transition-all duration-500 shadow-2xl flex flex-col md:flex-row items-center p-6 md:p-8 gap-8 [html[data-theme='light']_&]:bg-white [html[data-theme='light']_&]:border-slate-200 [html[data-theme='light']_&]:shadow-xl [html[data-theme='light']_&]:hover:border-amber-400">
                    <div className="w-full md:w-52 aspect-square rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/10 flex items-center justify-center border border-white/5 relative shrink-0 [html[data-theme='light']_&]:bg-amber-50/50 [html[data-theme='light']_&]:border-slate-100">
                      <div className="absolute inset-0 bg-[radial-gradient(#f59e0b_1px,transparent_1px)] bg-[size:16px_16px] opacity-10"></div>
                      <img src="/images/fraction-story/magic_pizza.png" alt="Simulation Preview" className="w-4/5 h-4/5 object-contain group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500" />
                      <div className="absolute top-3 left-3 px-2 py-0.5 rounded bg-amber-500 text-white font-black text-[0.55rem] uppercase tracking-widest shadow-lg shadow-amber-500/30">Interactive</div>
                    </div>
                    <div className="flex-1 space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse border-2 border-emerald-500/20 shadow-[0_0_12px_rgba(16,185,129,0.5)]"></span>
                          <span className="mono text-[0.65rem] font-black uppercase tracking-[0.25em] text-[#f59e0b] bg-amber-400/10 border border-amber-400/20 px-2 py-0.5 rounded-md">Recommended Simulation</span>
                        </div>
                        <h2 className="text-3xl font-black text-white uppercase tracking-tightest group-hover:text-[#f59e0b] transition-colors leading-none [html[data-theme='light']_&]:text-slate-800">Fraction Addition Lab</h2>
                      </div>
                      <p className="text-sm text-white/50 font-serif leading-relaxed italic pr-6 [html[data-theme='light']_&]:text-slate-600">
                        Experience the logic of adding fractions through visual manipulation. Perfect for student exploration or classroom demonstrations.
                      </p>
                      <div className="flex items-center gap-4 pt-2">
                        <div className="px-8 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white font-black text-xs uppercase tracking-[0.1em] shadow-xl shadow-amber-500/20 group-hover:brightness-110 group-hover:-translate-y-0.5 transition-all active:translate-y-0 active:scale-95 flex items-center gap-2">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                          Launch Simulator
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>

                <div className="mt-12 mb-10 flex items-center gap-6 opacity-30 [html[data-theme='light']_&]:opacity-100 [html[data-theme='light']_&]:text-slate-300">
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent to-white/15 [html[data-theme='light']_&]:to-slate-200"></div>
                  <span className="mono text-[0.55rem] font-black uppercase tracking-[0.3em] text-white/30 [html[data-theme='light']_&]:text-slate-400">Begin Theoretical Content</span>
                  <div className="h-px flex-1 bg-gradient-to-l from-transparent to-white/15 [html[data-theme='light']_&]:to-slate-200"></div>
                </div>

                {/* Step 2 badge - NO VIDEO */}
                <div className="mb-6">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-3">
                      <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-violet-400 to-fuchsia-500 text-white font-black text-sm shadow-lg shadow-violet-500/30 [html[data-theme='light']_&]:shadow-violet-400/50 [html[data-theme='light']_&]:ring-2 [html[data-theme='light']_&]:ring-violet-400/40">
                        02
                      </span>
                      <span className="text-[0.65rem] font-black uppercase tracking-[0.2em] text-violet-400 bg-violet-400/15 border border-violet-400/40 px-3 py-1.5 rounded-full [html[data-theme='light']_&]:text-violet-600 [html[data-theme='light']_&]:bg-violet-100 [html[data-theme='light']_&]:border-violet-300">
                        Step
                      </span>
                    </div>
                    <div className="flex-1 h-px bg-gradient-to-r from-violet-400/30 via-white/10 to-transparent [html[data-theme='light']_&]:from-violet-400/50 [html[data-theme='light']_&]:via-slate-200 [html[data-theme='light']_&]:to-transparent" />
                  </div>
                </div>
              </div>
            )}

            {readingStrategy.title.includes('সেশন ১. ভগ্নাংশের ধারণা') && (
              <div className="mb-10 flex justify-center">
                <div className="w-full max-w-xl rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-black">
                  <video
                    src="/animation/teaching-aid/teaching-aid.mp4"
                    controls
                    className="w-full aspect-video outline-none object-contain"
                  />
                </div>
              </div>
            )}

            {readingStrategy.title.toLowerCase().includes('the ant and the grasshopper') && (
              <div className="mb-10 animate-fadeIn space-y-12">
                <Link to="/the-ant-and-the-grasshopper" target="_blank" className="group block no-underline transition-all hover:scale-[1.01]">
                  <div className="relative w-full rounded-2xl overflow-hidden border border-white/10 bg-[#0f172a] hover:border-emerald-500/50 transition-all duration-500 shadow-2xl flex flex-col md:flex-row items-center p-6 md:p-8 gap-8 [html[data-theme='light']_&]:bg-white [html[data-theme='light']_&]:border-slate-200 [html[data-theme='light']_&]:shadow-xl">
                    <div className="w-full md:w-52 aspect-square rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/10 flex items-center justify-center border border-white/5 relative shrink-0 [html[data-theme='light']_&]:bg-emerald-50/50 [html[data-theme='light']_&]:border-slate-100 overflow-hidden">
                      <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] bg-[size:16px_16px] opacity-10"></div>
                      <img
                        src="/storybook/ant_grasshopper/cover.png"
                        alt="Storybook Cover"
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute top-3 left-3 px-2 py-0.5 rounded bg-emerald-500 text-white font-black text-[0.55rem] uppercase tracking-widest shadow-lg shadow-emerald-500/30">Interactive</div>
                    </div>
                    <div className="flex-1 space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse border-2 border-cyan-400/20 shadow-[0_0_12px_rgba(34,211,238,0.5)]"></span>
                          <span className="mono text-[0.65rem] font-black uppercase tracking-[0.25em] text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-2 py-0.5 rounded-md">Curated Resource</span>
                        </div>
                        <h2 className="text-3xl font-black text-white uppercase tracking-tightest group-hover:text-emerald-400 transition-colors leading-none [html[data-theme='light']_&]:text-slate-800">The Ant & Grasshopper</h2>
                      </div>
                      <p className="text-sm text-white/50 font-serif leading-relaxed italic pr-6 [html[data-theme='light']_&]:text-slate-600">
                        Explore the classic fable of hard work and foresight with an immersive, narrated storybook designed for primary classrooms.
                      </p>
                      <div className="flex items-center gap-4 pt-2">
                        <div className="px-8 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-black text-xs uppercase tracking-[0.1em] shadow-xl shadow-emerald-500/20 group-hover:brightness-110 group-hover:-translate-y-0.5 transition-all active:translate-y-0 active:scale-95 flex items-center gap-2">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                          Open Storybook
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>

                <div className="mt-12 mb-10 flex items-center gap-6 opacity-30 [html[data-theme='light']_&]:opacity-100 [html[data-theme='light']_&]:text-slate-300">
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent to-white/15 [html[data-theme='light']_&]:to-slate-200"></div>
                  <span className="mono text-[0.55rem] font-black uppercase tracking-[0.3em] text-white/30 [html[data-theme='light']_&]:text-slate-400">Strategy Breakdown</span>
                  <div className="h-px flex-1 bg-gradient-to-l from-transparent to-white/15 [html[data-theme='light']_&]:to-slate-200"></div>
                </div>
              </div>
            )}

            <div>
              <FormattedText text={readingStrategy.content} />
            </div>

            {/* Step 2 */}
            {readingStrategy.title.includes('সেশন ১. ভগ্নাংশের ধারণা') && (
              <div className="mt-12">
                <div className="mb-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center gap-3">
                      <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-violet-400 to-fuchsia-500 text-white font-black text-sm shadow-lg shadow-violet-500/30 [html[data-theme='light']_&]:shadow-violet-400/50 [html[data-theme='light']_&]:ring-2 [html[data-theme='light']_&]:ring-violet-400/40">
                        02
                      </span>
                      <span className="text-[0.65rem] font-black uppercase tracking-[0.2em] text-violet-400 bg-violet-400/15 border border-violet-400/40 px-3 py-1.5 rounded-full [html[data-theme='light']_&]:text-violet-600 [html[data-theme='light']_&]:bg-violet-100 [html[data-theme='light']_&]:border-violet-300">
                        Step
                      </span>
                    </div>
                    <div className="flex-1 h-px bg-gradient-to-r from-violet-400/30 via-white/10 to-transparent [html[data-theme='light']_&]:from-violet-400/50 [html[data-theme='light']_&]:via-slate-200 [html[data-theme='light']_&]:to-transparent" />
                  </div>
                </div>
                <div className="flex justify-center">
                  <div className="w-full max-w-xl rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-black [html[data-theme='light']_&]:border-slate-200">
                    <video
                      src="/animation/teaching-aid/aid-strategy.mp4"
                      controls
                      className="w-full aspect-video outline-none object-contain"
                    />
                  </div>
                </div>
                <div className="mt-10">
                  <FormattedText text={readingStrategy.content} />
                </div>
              </div>
            )}
          </article>
        </div>
        <style>{`
          .formatted-content { line-height: 2.2; color: rgba(255,255,255,0.85); font-size: 1.5rem; text-align: justify; }
          /* Force children to use explicit colors to override pasted styles */
          .formatted-content * { 
             color: inherit !important; 
             background-color: transparent !important; 
             font-family: 'CustomBangla', 'Inter', sans-serif !important; 
             font-size: inherit !important; 
             line-height: inherit !important; 
             text-align: inherit !important; 
          }
          .formatted-content p, .formatted-content li { color: rgba(255,255,255,0.9) !important; }

          .formatted-content b, .formatted-content strong { font-weight: 900; color: #ffffff !important; }
          .formatted-content h3 { font-size: 1.75rem; font-weight: 900; margin: 2rem 0 1rem 0; color: #ffffff !important; line-height: 1.2; }
          .formatted-content ul { list-style-type: disc; padding-left: 2rem; margin-bottom: 1.5rem; }
          .formatted-content ol { list-style-type: decimal; padding-left: 2rem; margin-bottom: 1.5rem; }
          .formatted-content p { margin-bottom: 2.5rem; }
          .formatted-content br { display: block; margin-top: 1.5rem; content: ""; }
          .formatted-content img { max-width: 100%; height: auto; border-radius: 1.5rem; border: 1px solid rgba(255,255,255,0.1); margin: 2.5rem 0; display: block; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5); }
          .formatted-content blockquote { border-left: 4px solid #f59e0b; padding-left: 1.5rem; margin: 2rem 0; color: rgba(255,255,255,0.6) !important; font-style: italic; }

          /* Light Mode Overrides */
          [data-theme='light'] .formatted-content,
          [data-theme='light'] .formatted-content * { color: #1e293b !important; }
          
          [data-theme='light'] .formatted-content h3, 
          [data-theme='light'] .formatted-content b, 
          [data-theme='light'] .formatted-content strong { color: #0f172a !important; }
          
          [data-theme='light'] .formatted-content blockquote { color: #475569 !important; border-left-color: #f59e0b !important; }
          [data-theme='light'] .formatted-content img { border-color: #cbd5e1 !important; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1) !important; }
          
          /* Force White Text on Book Covers even in Light Mode */
          [data-theme='light'] .force-text-white,
          [data-theme='light'] .force-text-white * { color: #ffffff !important; }
        `}</style>
      </>
    );
  }

  return (
    <div className="space-y-12 pb-20">
      <header className="relative tile p-8 md:p-12 overflow-hidden border-[#f59e0b]/30">
        <div className="absolute top-0 right-0 p-4 opacity-10 text-[#f59e0b] pointer-events-none"><svg className="w-32 h-32" fill="currentColor" viewBox="0 0 24 24"><path d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2" /></svg></div>
        <div className="relative z-10">
          <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter mb-4">Teaching <span className="text-[#f59e0b]">Strategies</span></h1>
          <p className="text-[#f59e0b]/60 max-w-2xl text-lg md:text-xl font-serif">Bridging the gap between theory and the vibrant reality of the classroom.</p>
        </div>
      </header>

      <div className="flex flex-col md:flex-row gap-6 border-b border-white/5 pb-8">
        <ModernDropdown
          label="Classification"
          selectedId={selectedGrade}
          onSelect={(id) => { setSelectedGrade(id); setSelectedUnit('all'); }}
          options={[{ id: 'g1', title: 'Grade 1' }, { id: 'g2', title: 'Grade 2' }, { id: 'g3', title: 'Grade 3' }, { id: 'g4', title: 'Grade 4' }, { id: 'g5', title: 'Grade 5' }]}
        />
        <ModernDropdown
          label="Discipline"
          selectedId={selectedSubject}
          onSelect={(id) => { setSelectedSubject(id); setSelectedUnit('all'); }}
          options={[{ id: 'bangla', title: 'Bangla' }, { id: 'english', title: 'English' }, { id: 'math', title: 'Mathematics' }, { id: 'science', title: 'Science' }, { id: 'bgs', title: 'Global Studies' }]}
        />
        <ModernDropdown
          label="Unit"
          selectedId={selectedUnit}
          onSelect={setSelectedUnit}
          options={[
            { id: 'all', title: 'All Units' },
            ...Array.from(new Set(strategies.filter(s => s.grade === selectedGrade && s.subject === selectedSubject && s.unit).map(s => s.unit))).sort().map(unit => ({ id: unit as string, title: unit as string }))
          ]}
        />
      </div>

      <div className="grid grid-cols-1 gap-12">
        {loading ? (
          <div className="p-20 text-center animate-pulse">
            <div className="w-12 h-12 rounded-full border-2 border-[#f59e0b] border-t-transparent animate-spin mx-auto mb-4"></div>
            <p className="mono text-[0.625rem] text-white/20 uppercase font-black">Syncing Core Data...</p>
          </div>
        ) : filtered.length > 0 ? filtered.map(s => {
          const isBookmarked = bookmarks.includes(`strategy:${s.id}`);
          return (
            <div key={s.id} className="flex flex-col md:flex-row gap-8 items-start group pb-12 border-b border-white/5 last:border-0 relative">
              <div onClick={() => handleOpenStrategy(s)} className={`w-32 md:w-44 aspect-[3/4] ${s.bookCover} rounded-xl shadow-xl cursor-pointer hover:-rotate-3 transition-transform duration-500 border-l-4 border-white/20 shrink-0 flex flex-col justify-between items-center p-4 relative overflow-hidden`}>
                <span className="mono text-[0.4rem] font-black uppercase text-white/40">Educore Hub</span>
                <div className="font-bold text-center text-white text-sm leading-tight px-1">{s.title}</div>
                <div className="w-6 h-6 rounded-full bg-white/5"></div>
                {/* Bookmark Button Overlay */}
                <button
                  onClick={(e) => toggleBookmark(e, s.id)}
                  className={`absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center transition-all border ${isBookmarked ? 'bg-amber-500 border-amber-400 text-black' : 'bg-black/40 backdrop-blur-sm border-white/10 text-white/40 hover:text-white'}`}
                >
                  <svg className={`w-4 h-4 ${isBookmarked ? 'fill-current' : 'fill-none'}`} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                  </svg>
                </button>
              </div>
              <div className="space-y-4">
                <h3 className="text-2xl font-black text-white group-hover:text-[#f59e0b] transition-colors uppercase tracking-tight cursor-pointer" onClick={() => handleOpenStrategy(s)}>{s.title}</h3>
                <div className="text-white/80 text-sm leading-tight line-clamp-3 italic font-serif">
                  <FormattedText text={s.content} />
                </div>
                <button onClick={() => handleOpenStrategy(s)} className="text-[0.625rem] font-black uppercase tracking-widest border-b border-[#f59e0b] pb-1 text-[#f59e0b]">Study Strategy</button>
              </div>
            </div>
          );
        }) : (
          <div className="p-20 text-center opacity-20"><h3 className="font-black uppercase text-white">No strategies found</h3></div>
        )}
      </div>
      <style>{`
        .formatted-content { line-height: 1.7; color: rgba(255,255,255,0.85); font-size: 1.1rem; }
        /* Force children to inherit to override pasted styles */
        /* Force children to use explicit colors to override pasted styles */
        .formatted-content * { 
             color: inherit !important; 
             background-color: transparent !important; 
             font-family: 'CustomBangla', 'Inter', sans-serif !important; 
             font-size: inherit !important; 
             line-height: inherit !important; 
             text-align: inherit !important; 
        }
        .formatted-content p, .formatted-content li { color: rgba(255,255,255,0.9) !important; }

        .formatted-content b, .formatted-content strong { font-weight: 900; color: #ffffff !important; }
        .formatted-content h3 { font-size: 1.75rem; font-weight: 900; margin: 2rem 0 1rem 0; color: #ffffff !important; line-height: 1.2; }
        .formatted-content ul { list-style-type: disc; padding-left: 2rem; margin-bottom: 1.5rem; }
        .formatted-content ol { list-style-type: decimal; padding-left: 2rem; margin-bottom: 1.5rem; }
        .formatted-content p { margin-bottom: 1rem; }
        .formatted-content img { max-width: 100%; height: auto; border-radius: 1.5rem; border: 1px solid rgba(255,255,255,0.1); margin: 2.5rem 0; display: block; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5); }
        .formatted-content blockquote { border-left: 4px solid #f59e0b; padding-left: 1.5rem; margin: 2rem 0; color: rgba(255,255,255,0.6) !important; font-style: italic; }

        /* Light Mode Overrides */
        [data-theme='light'] .formatted-content,
        [data-theme='light'] .formatted-content * { color: #1e293b !important; }
        
        [data-theme='light'] .formatted-content h3, 
        [data-theme='light'] .formatted-content b, 
        [data-theme='light'] .formatted-content strong { color: #0f172a !important; }
        
        [data-theme='light'] .formatted-content blockquote { color: #475569 !important; border-left-color: #f59e0b !important; }
        [data-theme='light'] .formatted-content img { border-color: #cbd5e1 !important; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1) !important; }
      `}</style>
    </div>
  );
};

export default TeachingStrategies;
