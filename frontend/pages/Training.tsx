
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ApiService from '../ApiService';

const Training: React.FC = () => {
  const navigate = useNavigate();
  const [sortBy, setSortBy] = useState<'newest' | 'popular'>('popular');
  const [onlineCourses, setOnlineCourses] = useState<any[]>([]);
  const [bookmarks, setBookmarks] = useState<string[]>([]);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const backendCourses = await ApiService.getCourses();
        const localData = JSON.parse(localStorage.getItem('educore_training') || '[]');

        // Merge strategy: Backend is primary, local is fallback
        setOnlineCourses(backendCourses.length > 0 ? backendCourses : localData);
      } catch (err) {
        console.error("Failed to sync training:", err);
        setOnlineCourses(JSON.parse(localStorage.getItem('educore_training') || '[]'));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const savedBookmarks = JSON.parse(localStorage.getItem('educore_bookmarks') || '[]');
    setBookmarks(savedBookmarks);
  }, []);

  const toggleBookmark = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const bookmarkKey = `training:${id}`;
    let newBookmarks;
    if (bookmarks.includes(bookmarkKey)) {
      newBookmarks = bookmarks.filter(b => b !== bookmarkKey);
    } else {
      newBookmarks = [...bookmarks, bookmarkKey];
    }
    setBookmarks(newBookmarks);
    localStorage.setItem('educore_bookmarks', JSON.stringify(newBookmarks));
  };

  const sortedCourses = [...onlineCourses].sort((a, b) => {
    if (sortBy === 'popular') {
      return (b.enrolled || 0) - (a.enrolled || 0);
    }
    return b.id.localeCompare(a.id);
  });

  const getLevelBadgeStyle = (level: string) => {
    const base = "absolute top-4 left-4 z-20 px-3 py-1.5 rounded-full text-[0.65rem] font-black uppercase tracking-wider border-2 shadow-xl bg-[#0f172a]";
    switch (level) {
      case 'Beginner': return `${base} border-[#34d399] text-[#34d399]`;
      case 'Intermediate': return `${base} border-[#60a5fa] text-[#60a5fa]`;
      case 'Advanced': return `${base} border-[#c084fc] text-[#c084fc]`;
      default: return `${base} border-white/20 text-white/60`;
    }
  };

  return (
    <div className="space-y-12 training-page pb-20 max-w-7xl mx-auto">
      <header className="relative tile p-8 md:p-12 overflow-hidden border-purple-500/20 bg-gradient-to-br from-[var(--tile-bg)] via-[var(--tile-bg)] to-purple-500/10 rounded-[2.5rem] [html[data-theme='light']_&]:to-purple-500/5">
        <div className="absolute top-0 right-0 p-4 opacity-10 text-purple-500 pointer-events-none">
          <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 24 24"><path d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" /></svg>
        </div>
        <div className="relative z-10 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter mb-4">Teacher <span className="text-purple-400">Training Hub</span></h1>
          <p className="text-purple-100/60 [html[data-theme='light']_&]:text-slate-600 max-w-2xl mx-auto md:mx-0 text-lg md:text-xl font-serif italic border-l-0 md:border-l-4 border-purple-500/30 md:pl-6">"Who dares to teach must never cease to learn."</p>
        </div>
      </header>

      <section className="space-y-6">
        <div className="flex justify-between items-end px-2">
          <h2 className="text-xl font-black uppercase tracking-tight flex items-center gap-3">Certified Courses</h2>
          <div className="flex gap-4">
            <button
              onClick={() => setSortBy('newest')}
              className={`text-[0.625rem] uppercase font-black transition-all pb-1 tracking-widest ${sortBy === 'newest' ? 'text-[var(--amethyst-focus)] border-b-2 border-[var(--amethyst-focus)]' : 'text-white/40 [html[data-theme="light"]_&]:text-slate-400 hover:text-white [html[data-theme="light"]_&]:hover:text-slate-900'}`}
            >
              Newest
            </button>
            <button
              onClick={() => setSortBy('popular')}
              className={`text-[0.625rem] uppercase font-black transition-all pb-1 tracking-widest ${sortBy === 'popular' ? 'text-[var(--amethyst-focus)] border-b-2 border-[var(--amethyst-focus)]' : 'text-white/40 [html[data-theme="light"]_&]:text-slate-400 hover:text-white [html[data-theme="light"]_&]:hover:text-slate-900'}`}
            >
              Popular
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sortedCourses.map((course) => {
            const isBookmarked = bookmarks.includes(`training:${course.id}`);
            return (
              <div
                key={course.id}
                className="tile p-0 group cursor-pointer hover:-translate-y-2 transition-all duration-500 flex flex-col h-full rounded-[2rem] overflow-hidden shadow-lg border-white/5 [html[data-theme='light']_&]:border-slate-200"
                onClick={() => navigate(`/training/course/${course.id}`)}
              >
                <div className="h-52 relative overflow-hidden">
                  <img src={ApiService.resolveMediaUrl(course.image) || 'https://placehold.co/600x400/2E1065/FFF?text=Course'} alt={course.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className={getLevelBadgeStyle(course.level || 'Beginner')}>{course.level || 'Beginner'}</div>

                  {/* Bookmark Button */}
                  <button
                    onClick={(e) => toggleBookmark(e, course.id)}
                    className={`absolute top-4 right-4 z-30 w-10 h-10 rounded-full flex items-center justify-center transition-all border ${isBookmarked ? 'bg-amber-500 border-amber-400 shadow-lg shadow-amber-500/40 text-black' : 'bg-black/30 backdrop-blur-md border-white/20 text-white hover:bg-black/50 hover:scale-110'}`}
                  >
                    <svg className={`w-5 h-5 ${isBookmarked ? 'fill-current' : 'fill-none'}`} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                    </svg>
                  </button>
                </div>
                <div className="p-6 flex-1 flex flex-col bg-white [html[data-theme='dark']_&]:bg-transparent">
                  <h3 className="text-xl font-black text-white mb-2 leading-tight group-hover:text-[var(--amethyst-focus)] transition-colors uppercase tracking-tight">{course.title}</h3>
                  <p className="text-white/40 [html[data-theme='light']_&]:text-slate-500 text-[0.65rem] font-bold uppercase mono tracking-widest mb-6">By {course.instructor}</p>
                  <button className="w-full mt-auto bg-[var(--amethyst-focus)] hover:brightness-110 text-white force-text-white font-black uppercase text-[0.65rem] tracking-widest py-4 rounded-xl shadow-lg transition-all transform active:scale-[0.98]">
                    Enroll Now
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default Training;
