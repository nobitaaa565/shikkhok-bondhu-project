
import React, { useState, useMemo } from 'react';

const BrowsingContent: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedGrade, setSelectedGrade] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [sortBy, setSortBy] = useState('popular');

  const categories = ['All', 'Science', 'Mathematics', 'History', 'Art', 'Language'];
  const grades = ['All', '9th Grade', '10th Grade', '11th Grade', '12th Grade'];
  const types = ['All', 'Lesson Plan', 'Worksheet', 'Presentation', 'Quiz'];

  // Enhanced Data with numeric values for sorting
  const resources = [
    { id: 1, title: 'Interactive Periodic Table', author: 'Dr. Aris', category: 'Science', grade: '10th Grade', type: 'Presentation', downloads: 1200, rating: 4.9, date: '2024-10-15' },
    { id: 2, title: 'World War II Timeline', author: 'Sarah J.', category: 'History', grade: '11th Grade', type: 'Worksheet', downloads: 850, rating: 4.7, date: '2024-10-20' },
    { id: 3, title: 'Matrix Algebra Masterclass', author: 'Prof. X', category: 'Mathematics', grade: '12th Grade', type: 'Lesson Plan', downloads: 2400, rating: 5.0, date: '2024-09-01' },
    { id: 4, title: 'Modernist Poetry Guide', author: 'Elena R.', category: 'Language', grade: '12th Grade', type: 'Presentation', downloads: 430, rating: 4.5, date: '2024-10-22' },
    { id: 5, title: 'Color Theory Workbook', author: 'Mark T.', category: 'Art', grade: '9th Grade', type: 'Worksheet', downloads: 1100, rating: 4.8, date: '2024-10-05' },
    { id: 6, title: 'Neuroscience for Kids', author: 'Lab 101', category: 'Science', grade: '9th Grade', type: 'Lesson Plan', downloads: 900, rating: 4.9, date: '2024-10-23' },
    { id: 7, title: 'Calculus Derivatives', author: 'MathWiz', category: 'Mathematics', grade: '12th Grade', type: 'Quiz', downloads: 3100, rating: 4.6, date: '2024-08-15' },
    { id: 8, title: 'Renaissance Art History', author: 'DaVinci Code', category: 'Art', grade: '10th Grade', type: 'Presentation', downloads: 650, rating: 4.7, date: '2024-10-10' },
  ];

  const filteredResources = useMemo(() => {
    return resources
      .filter(res => {
        const matchesSearch = res.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              res.author.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || res.category === selectedCategory;
        const matchesGrade = selectedGrade === 'All' || res.grade === selectedGrade;
        const matchesType = selectedType === 'All' || res.type === selectedType;
        
        return matchesSearch && matchesCategory && matchesGrade && matchesType;
      })
      .sort((a, b) => {
        if (sortBy === 'popular') return b.downloads - a.downloads;
        if (sortBy === 'rated') return b.rating - a.rating;
        if (sortBy === 'newest') return new Date(b.date).getTime() - new Date(a.date).getTime();
        return 0;
      });
  }, [resources, searchQuery, selectedCategory, selectedGrade, selectedType, sortBy]);

  const formatNumber = (num: number) => {
    return num >= 1000 ? (num / 1000).toFixed(1) + 'k' : num;
  };

  const getTypeStyles = (type: string) => {
    switch (type) {
      case 'Lesson Plan': return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      case 'Worksheet': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'Presentation': return 'bg-orange-500/10 text-orange-400 border-orange-500/30';
      case 'Quiz': return 'bg-pink-500/10 text-pink-400 border-pink-500/30';
      default: return 'bg-white/5 text-white/40 border-white/10';
    }
  };

  return (
    <div className="space-y-10">
      <header className="text-center space-y-6">
        <h1 className="text-5xl font-black hero-text-gradient uppercase tracking-tighter">Global Resource Library</h1>
        
        {/* Search Bar */}
        <div className="max-w-2xl mx-auto relative group z-10">
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search titles, authors..." 
            className="contact-input pl-14 py-5 focus-border"
          />
          <span className="absolute left-6 top-1/2 -translate-y-1/2 text-xl opacity-30 group-focus-within:opacity-100 transition-opacity text-[var(--amethyst-focus)]">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
        </div>
      </header>

      {/* Filter & Sort Controls */}
      <div className="space-y-6">
        {/* Category Pills */}
        <div className="flex flex-wrap gap-3 justify-center">
          {categories.map(cat => (
            <button 
              key={cat} 
              onClick={() => setSelectedCategory(cat)}
              className={`px-6 py-2 rounded-full mono text-sm font-black uppercase border transition-all ${selectedCategory === cat ? 'bg-[var(--amethyst-focus)] text-white force-text-white border-[var(--amethyst-focus)]' : 'border-white/10 text-white/40 hover:border-white/30 hover:text-white'}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Filters Row */}
        <div className="flex flex-col md:flex-row justify-center gap-4 max-w-4xl mx-auto">
          <select 
            value={selectedGrade} 
            onChange={(e) => setSelectedGrade(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-[var(--amethyst-focus)]"
          >
            <option value="" disabled>Select Grade</option>
            {grades.map(g => <option key={g} value={g} className="bg-[var(--bg-dark)]">{g}</option>)}
          </select>

          <select 
            value={selectedType} 
            onChange={(e) => setSelectedType(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-[var(--amethyst-focus)]"
          >
            <option value="" disabled>Select Type</option>
            {types.map(t => <option key={t} value={t} className="bg-[var(--bg-dark)]">{t}</option>)}
          </select>

          <div className="md:ml-auto flex items-center gap-2">
            <span className="mono text-xs text-white/40 uppercase font-bold">Sort By:</span>
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent border-none text-[var(--amethyst-focus)] font-bold text-sm uppercase focus:outline-none cursor-pointer"
            >
              <option value="popular" className="bg-[var(--bg-dark)]">Popularity</option>
              <option value="rated" className="bg-[var(--bg-dark)]">Highest Rated</option>
              <option value="newest" className="bg-[var(--bg-dark)]">Newest</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredResources.length > 0 ? (
          filteredResources.map((res) => (
            <div key={res.id} className="tile p-8 group cursor-pointer flex flex-col justify-between h-full hover:-translate-y-2">
              <div>
                <div className="flex justify-between items-start mb-6">
                  <div className="mono text-xs text-[var(--amethyst-focus)] font-black uppercase bg-[var(--amethyst-deep)]/50 px-2 py-1 rounded">{res.category}</div>
                  <div className="text-sm font-bold text-yellow-400 flex items-center gap-1">
                     <svg className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 24 24">
                       <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                     </svg>
                     {res.rating}
                  </div>
                </div>
                <h3 className="text-2xl font-black mb-2 uppercase tracking-tight group-hover:text-[var(--amethyst-focus)] transition-colors">{res.title}</h3>
                <div className="flex gap-2 text-xs mono mb-4">
                  <span className="border border-white/10 px-2 py-1 rounded text-white/40">{res.grade}</span>
                  <span className={`border px-2 py-1 rounded ${getTypeStyles(res.type)}`}>{res.type}</span>
                </div>
                <p className="text-white/40 text-sm mono uppercase mb-6">By {res.author}</p>
              </div>
              
              <div className="flex items-center justify-between pt-6 border-t border-white/5">
                <div className="flex items-center gap-2">
                  <span className="text-sm opacity-30">
                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                  </span>
                  <span className="mono text-xs font-bold text-white/50">{formatNumber(res.downloads)}</span>
                </div>
                <button className="p-2 rounded bg-white/5 group-hover:bg-[var(--amethyst-focus)] transition-colors text-white">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-20">
            <div className="text-6xl mb-4 opacity-20 inline-block">
               <svg className="w-20 h-20 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
               </svg>
            </div>
            <h3 className="text-xl font-bold uppercase text-white/50">No resources found</h3>
            <p className="text-white/30 text-sm mt-2">Try adjusting your filters or search query.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BrowsingContent;
