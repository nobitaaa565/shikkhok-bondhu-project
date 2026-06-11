
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import ApiService from '../ApiService';

type LibraryTab = 'uploaded' | 'tools' | 'strategies' | 'training';

// Shared Mock Data for resolving IDs (Replicated from source pages for consistency)
const MOCK_COMMUNITY_RESOURCES = [
  { id: 1, title: 'Interactive Periodic Table', author: 'Dr. Aris', category: 'Science', type: 'Presentation', thumbnailColor: 'bg-emerald-500/10' },
  { id: 2, title: 'World War II Timeline', author: 'Sarah J.', category: 'History', type: 'Worksheet', thumbnailColor: 'bg-amber-500/10' },
  { id: 3, title: 'Matrix Algebra Masterclass', author: 'Prof. X', category: 'Mathematics', type: 'Lesson Plan', thumbnailColor: 'bg-blue-500/10' },
  { id: 4, title: 'Modernist Poetry Guide', author: 'Elena R.', category: 'Language', type: 'Presentation', thumbnailColor: 'bg-rose-500/10' },
];

const Library: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<LibraryTab>('uploaded');
  const [allStrategies, setAllStrategies] = useState<any[]>([]);
  const [allTraining, setAllTraining] = useState<any[]>([]);
  const [allExclusive, setAllExclusive] = useState<any[]>([]);
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [strategies, training, exclusive] = await Promise.all([
          ApiService.getStrategies(),
          ApiService.getCourses(),
          ApiService.getExclusiveMaterials()
        ]);

        const mappedStrategies = strategies.map((s: any) => ({ ...s, id: s.id.toString() }));
        const mappedTraining = training.map((t: any) => ({
          ...t,
          id: t.id.toString(),
          image: ApiService.resolveMediaUrl(t.image)
        }));
        const mappedExclusive = exclusive.map((f: any) => ({
          ...f,
          id: f.id.toString(),
          url: ApiService.resolveMediaUrl(f.file || f.url || f.videoUrl)
        }));

        setAllStrategies(mappedStrategies);
        setAllTraining(mappedTraining);
        setAllExclusive(mappedExclusive);

        const savedBookmarks = JSON.parse(localStorage.getItem('educore_bookmarks') || '[]');
        setBookmarks(savedBookmarks);
      } catch (err) {
        console.error("Failed to sync library:", err);
        // Fallback to local if API fails (optional but good for robustness)
        setAllStrategies(JSON.parse(localStorage.getItem('educore_strategies') || '[]'));
        setAllTraining(JSON.parse(localStorage.getItem('educore_training') || '[]'));
        setAllExclusive(JSON.parse(localStorage.getItem('educore_exclusive') || '[]'));
        setBookmarks(JSON.parse(localStorage.getItem('educore_bookmarks') || '[]'));
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const saveBookmarks = (newBookmarks: string[]) => {
    setBookmarks(newBookmarks);
    localStorage.setItem('educore_bookmarks', JSON.stringify(newBookmarks));
  };

  const removeBookmark = (e: React.MouseEvent, bKey: string) => {
    e.stopPropagation();
    const newBookmarks = bookmarks.filter(b => b !== bKey);
    saveBookmarks(newBookmarks);
  };

  // 1. Uploaded (Static Mock)
  const uploaded = [
    { id: 'up1', title: 'Linear Algebra Slides', date: 'Oct 24, 2024', type: 'presentation', size: '12MB', views: 45 },
    { id: 'up2', title: 'Calculus Quiz Pack', date: 'Oct 20, 2024', type: 'pdf', size: '4MB', views: 128 },
  ];

  // 2. Tools (Exclusive + Community Bookmarks)
  const toolsItems = useMemo(() => {
    return bookmarks.map(bKey => {
      const [type, id] = bKey.split(':');
      if (type === 'exclusive') {
        const item = allExclusive.find(e => e.id === id);
        return item ? { ...item, libType: 'Exclusive', libKey: bKey, originalId: id } : null;
      }
      if (type === 'community') {
        const item = MOCK_COMMUNITY_RESOURCES.find(r => r.id.toString() === id);
        return item ? { ...item, libType: 'Community', libKey: bKey, originalId: id } : null;
      }
      return null;
    }).filter(item => item !== null);
  }, [bookmarks, allExclusive]);

  // 3. Bookmarked Strategies
  const bookmarkedStrategies = useMemo(() => {
    return bookmarks
      .filter(bKey => bKey.startsWith('strategy:'))
      .map(bKey => {
        const id = bKey.split(':')[1];
        const item = allStrategies.find(s => s.id === id);
        return item ? { ...item, libKey: bKey } : null;
      })
      .filter(item => item !== null);
  }, [bookmarks, allStrategies]);

  // 4. Bookmarked Training
  const bookmarkedTraining = useMemo(() => {
    return bookmarks
      .filter(bKey => bKey.startsWith('training:'))
      .map(bKey => {
        const id = bKey.split(':')[1];
        const item = allTraining.find(t => t.id === id);
        return item ? { ...item, libKey: bKey } : null;
      })
      .filter(item => item !== null);
  }, [bookmarks, allTraining]);

  const getIcon = (type: string) => {
    switch (type?.toLowerCase()) {
      case 'video': return <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>;
      case 'pdf':
      case 'document': return <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>;
      case 'presentation': return <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" /></svg>;
      default: return <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>;
    }
  };

  const handleToolClick = (item: any) => {
    if (item.libType === 'Exclusive') {
      // Navigate to exclusive page with parameters to auto-filter and expand
      navigate(`/shikkhok-exclusive?id=${item.originalId}&grade=${item.grade}&subject=${item.subject}`);
    } else {
      navigate('/community');
    }
  };

  return (
    <div className="space-y-12 pb-20 max-w-7xl mx-auto animate-fadeIn">
      <header className="relative tile p-8 md:p-12 overflow-hidden border-purple-500/20 bg-gradient-to-br from-[var(--tile-bg)] via-[var(--tile-bg)] to-purple-500/10 rounded-[2.5rem]">
        <div className="absolute top-0 right-0 p-8 opacity-5 text-purple-500 pointer-events-none transform rotate-12">
          <svg className="w-48 h-48" fill="currentColor" viewBox="0 0 24 24"><path d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" /></svg>
        </div>
        <div className="relative z-10 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter mb-4">Knowledge <span className="text-purple-400">Repository</span></h1>
          <p className="text-purple-100/60 max-w-2xl mx-auto md:mx-0 text-lg md:text-xl font-serif italic border-l-0 md:border-l-4 border-purple-500/30 md:pl-6">"Centralizing your professional assets and pedagogical inspiration."</p>
        </div>
      </header>

      <div className="flex flex-col gap-8">
        {/* Tab Switcher */}
        <div className="flex flex-wrap bg-white/5 p-1.5 rounded-2xl border border-white/10 backdrop-blur-xl shadow-xl self-start">
          {[
            { id: 'uploaded', label: 'My Uploads' },
            { id: 'tools', label: 'Tools' },
            { id: 'strategies', label: 'Strategies' },
            { id: 'training', label: 'Training' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as LibraryTab)}
              className={`px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === tab.id ? 'bg-[var(--amethyst-focus)] text-white shadow-lg' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

          {/* UPLOADED TAB */}
          {activeTab === 'uploaded' && uploaded.map(item => (
            <div key={item.id} className="tile p-6 flex flex-col justify-between group hover:border-[var(--amethyst-focus)]/40 transition-all cursor-pointer">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center text-[var(--amethyst-focus)] border border-purple-500/20">
                  {getIcon(item.type)}
                </div>
                <span className="text-[0.625rem] font-bold text-white/30 uppercase mono">{item.size}</span>
              </div>
              <div>
                <h3 className="text-xl font-black text-white uppercase tracking-tight mb-2 group-hover:text-[var(--amethyst-focus)] transition-colors">{item.title}</h3>
                <div className="flex items-center gap-4 text-[0.65rem] text-white/40 font-bold uppercase mono tracking-widest">
                  <span>{item.date}</span>
                  <span className="w-1 h-1 rounded-full bg-white/10"></span>
                  <span>{item.views} Views</span>
                </div>
              </div>
              <div className="mt-6 pt-6 border-t border-white/5 flex justify-between items-center">
                <button className="text-[0.625rem] font-black uppercase text-white/30 hover:text-white">Delete</button>
                <button className="px-4 py-2 rounded-lg bg-[var(--amethyst-focus)] text-white force-text-white text-[0.6rem] font-black uppercase tracking-widest shadow-lg">Download</button>
              </div>
            </div>
          ))}

          {/* TOOLS TAB (Exclusive + Community Bookmarks) */}
          {activeTab === 'tools' && toolsItems.map((item: any) => (
            <div key={item.libKey} onClick={() => handleToolClick(item)} className="tile p-6 flex flex-col justify-between group hover:border-amber-500/40 transition-all cursor-pointer">
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${item.libType === 'Community' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' : 'bg-amber-500/10 text-amber-500 border-amber-500/20'}`}>
                  {getIcon(item.type || 'document')}
                </div>
                <div className={`text-[0.55rem] font-black uppercase px-2 py-0.5 rounded-full ${item.libType === 'Community' ? 'bg-blue-500 text-white' : 'bg-amber-500 text-black'}`}>{item.libType} Aid</div>
              </div>
              <div>
                <h3 className="text-xl font-black text-white uppercase tracking-tight mb-2 group-hover:text-amber-500 transition-colors">{item.title}</h3>
                <p className="text-[0.65rem] text-white/40 font-bold uppercase mono tracking-widest">By {item.instructor || item.author || 'Educore'}</p>
              </div>
              <div className="mt-6 pt-6 border-t border-white/5 flex justify-between items-center">
                <button onClick={(e) => removeBookmark(e, item.libKey)} className="text-[0.625rem] font-black uppercase text-red-400 hover:text-red-300">Discard</button>
                <button
                  className="px-4 py-2 rounded-lg bg-white/5 text-white/60 hover:text-white text-[0.6rem] font-black uppercase tracking-widest border border-white/10"
                >
                  View Detail
                </button>
              </div>
            </div>
          ))}

          {/* STRATEGIES TAB (Bookmarked Strategies) */}
          {activeTab === 'strategies' && bookmarkedStrategies.map((item: any) => (
            <div key={item.libKey} onClick={() => navigate(`/teaching-strategies/${item.id}`)} className="tile p-6 flex flex-col justify-between group hover:border-[#f59e0b]/40 transition-all cursor-pointer relative">
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-16 rounded shadow-xl ${item.bookCover} border-l-2 border-white/20`}></div>
                <button onClick={(e) => removeBookmark(e, item.libKey)} className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-red-400 hover:bg-red-400/10 transition-colors z-10" title="Remove Bookmark">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
              </div>
              <div>
                <h3 className="text-xl font-black text-white uppercase tracking-tight mb-2 group-hover:text-[#f59e0b] transition-colors">{item.title}</h3>
                <p className="text-[0.65rem] text-white/40 font-bold uppercase mono tracking-widest mb-1">Grade {item.grade?.replace('g', '')}</p>
                <span className="text-[0.55rem] font-black uppercase text-white/20">{item.readTime}</span>
              </div>
              <div className="mt-6 pt-6 border-t border-white/5 flex justify-end">
                <button className="px-4 py-2 rounded-lg bg-[#f59e0b] text-white force-text-white text-[0.6rem] font-black uppercase tracking-widest shadow-lg">Read Strategy</button>
              </div>
            </div>
          ))}

          {/* TRAINING TAB (Bookmarked Courses) */}
          {activeTab === 'training' && bookmarkedTraining.map((item: any) => (
            <div key={item.libKey} onClick={() => navigate(`/training/course/${item.id}`)} className="tile p-0 overflow-hidden group hover:border-[var(--amethyst-focus)]/40 transition-all cursor-pointer flex flex-col relative">
              <div className="h-32 relative">
                <img src={item.image} alt={item.title} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                <div className="absolute inset-0 bg-black/40"></div>
                <div className="absolute bottom-2 left-2 px-2 py-1 bg-[var(--amethyst-focus)] text-white text-[0.5rem] font-black uppercase rounded">{item.level}</div>
                <button onClick={(e) => removeBookmark(e, item.libKey)} className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/60 text-red-400 hover:bg-black/80 transition-colors flex items-center justify-center z-10" title="Remove Bookmark">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-black text-white uppercase tracking-tight group-hover:text-[var(--amethyst-focus)] transition-colors mb-1">{item.title}</h3>
                  <p className="text-[0.55rem] text-white/40 font-bold uppercase mono">{item.duration} Path</p>
                </div>
                <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                    <span className="text-[0.5rem] font-black text-emerald-500 uppercase tracking-widest">Enrolled</span>
                  </div>
                  <svg className="w-4 h-4 text-white/20 group-hover:text-[var(--amethyst-focus)] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty States */}
        {((activeTab === 'uploaded' && uploaded.length === 0) ||
          (activeTab === 'tools' && toolsItems.length === 0) ||
          (activeTab === 'strategies' && bookmarkedStrategies.length === 0) ||
          (activeTab === 'training' && bookmarkedTraining.length === 0)) && (
            <div className="col-span-full p-32 text-center border-4 border-dashed border-white/5 rounded-[3rem] opacity-20">
              <div className="mb-6 flex justify-center">
                <svg className="w-20 h-20 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
              </div>
              <h3 className="font-black uppercase text-xl text-white tracking-[0.2em]">No bookmarked assets found</h3>
              <p className="text-white/40 text-xs font-bold uppercase mono mt-2">Visit other sectors to add content to your repository.</p>
            </div>
          )}
      </div>
    </div>
  );
};

export default Library;
