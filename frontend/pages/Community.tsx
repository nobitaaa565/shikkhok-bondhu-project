
import React, { useState, useMemo, useEffect, useRef } from 'react';
import ApiService from '../ApiService';

// --- Types ---
type CommunityView = 'library' | 'forum';

interface Resource {
  id: number;
  title: string;
  author: string;
  authorRep: number;
  category: string;
  grade: string;
  type: string;
  downloads: number;
  rating: number;
  description: string;
  date: string;
  thumbnailColor: string;
  fileUrl?: string;
  fileType?: string;
}

interface ForumQuestion {
  id: number;
  title: string;
  author: string;
  tags: string[];
  votes: number;
  answers: number;
  isSolved: boolean;
  views: number;
  date: string;
  snippet: string;
}

// --- Resource Detail Modal ---
const ResourceDetailModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  resource: Resource | null;
}> = ({ isOpen, onClose, resource }) => {
  if (!isOpen || !resource) return null;

  const isImage = ['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'].includes(resource.type.toLowerCase()) || resource.fileUrl?.match(/\.(jpg|jpeg|png|gif|svg|webp)$/i);
  const isVideo = ['mp4', 'webm', 'ogg'].includes(resource.type.toLowerCase()) || resource.fileUrl?.match(/\.(mp4|webm|ogg)$/i);
  const isPdf = resource.type.toLowerCase() === 'pdf' || resource.fileUrl?.toLowerCase().endsWith('.pdf');

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[var(--tile-bg)] border border-white/10 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl animate-scaleIn flex flex-col">
        <div className="p-6 border-b border-white/5 flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-2xl font-black text-[var(--text-primary)] uppercase tracking-tighter">{resource.title}</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="px-2 py-0.5 rounded bg-[var(--amethyst-focus)]/10 text-[var(--amethyst-focus)] text-[0.6rem] font-black uppercase">{resource.category}</span>
              <span className="text-[0.6rem] font-bold text-white/40 uppercase mono">{resource.grade} • Shared by {resource.author}</span>
            </div>
          </div>
          <button onClick={onClose} className="text-white/20 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/5">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {/* File Content Preview */}
          <div className="w-full bg-black/20 rounded-xl overflow-hidden min-h-[300px] flex items-center justify-center border border-white/5 shadow-inner">
            {isImage ? (
              <img src={resource.fileUrl} alt={resource.title} className="max-w-full max-h-[600px] object-contain" />
            ) : isVideo ? (
              <video src={resource.fileUrl} controls className="max-w-full max-h-[600px]" />
            ) : isPdf ? (
              <iframe src={`${resource.fileUrl}#toolbar=0`} className="w-full h-[600px]" title={resource.title} />
            ) : (
              <div className="flex flex-col items-center gap-4 text-white/20">
                <div className="w-20 h-20 rounded-2xl bg-white/5 flex items-center justify-center">
                  <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <p className="text-xs font-bold uppercase tracking-widest">{resource.type} file - No visual preview</p>
                <button
                  onClick={() => resource.fileUrl && window.open(resource.fileUrl, '_blank')}
                  className="px-6 py-2 rounded-lg bg-[var(--amethyst-focus)] text-white text-[0.625rem] font-black uppercase tracking-widest hover:brightness-110 shadow-lg shadow-[var(--amethyst-focus)]/20"
                >
                  Download File
                </button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              <h3 className="text-xs font-black uppercase tracking-widest text-white/40">Description</h3>
              <p className="text-sm leading-relaxed text-[var(--text-primary)]/80 italic">
                {resource.description}
              </p>
            </div>
            <div className="space-y-6">
              <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-3">
                <h3 className="text-[0.625rem] font-black uppercase tracking-widest text-white/30 border-b border-white/5 pb-2">Resource Info</h3>
                <div className="flex justify-between items-center text-[0.625rem]">
                  <span className="text-white/40 font-bold uppercase tracking-widest">Type</span>
                  <span className="text-white font-black uppercase">{resource.type}</span>
                </div>
                <div className="flex justify-between items-center text-[0.625rem]">
                  <span className="text-white/40 font-bold uppercase tracking-widest">Uploaded</span>
                  <span className="text-white font-black uppercase">{resource.date}</span>
                </div>
                <div className="flex justify-between items-center text-[0.625rem]">
                  <span className="text-white/40 font-bold uppercase tracking-widest">Author Rep</span>
                  <span className="text-amber-500 font-black uppercase">{resource.authorRep} pts</span>
                </div>
              </div>

              <button
                onClick={() => resource.fileUrl && window.open(resource.fileUrl, '_blank')}
                className="w-full py-3 bg-[var(--amethyst-focus)] text-white font-black text-xs uppercase tracking-widest rounded-xl hover:brightness-110 shadow-xl shadow-[var(--amethyst-focus)]/20 transition-all active:scale-95"
              >
                Download Resource
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Upload Modal Component ---
const UploadModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onUpload: (file: File, metadata: any) => Promise<void>;
  loading: boolean;
}> = ({ isOpen, onClose, onUpload, loading }) => {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Science');
  const [grade, setGrade] = useState('All Grades');
  const [description, setDescription] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      alert('Please select a file');
      return;
    }
    onUpload(file, { title, subject: category, grade, description });
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[var(--tile-bg)] border border-white/10 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-scaleIn">
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black text-[var(--text-primary)] uppercase tracking-tighter">Share Resource</h2>
            <p className="text-[0.625rem] text-white/40 uppercase tracking-widest mono">Contribute to the collective intelligence</p>
          </div>
          <button onClick={onClose} className="text-white/20 hover:text-white transition-colors">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="space-y-2">
            <label className="text-[0.625rem] font-bold text-white/40 uppercase tracking-widest ml-1">Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Creative Writing Prompts"
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm text-[var(--text-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--amethyst-focus)] transition-all placeholder:text-white/10"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[0.625rem] font-bold text-white/40 uppercase tracking-widest ml-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm text-[var(--text-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--amethyst-focus)] transition-all"
              >
                {['Science', 'Mathematics', 'History', 'Art', 'Language', 'Other'].map(cat => (
                  <option key={cat} value={cat} className="bg-[var(--tile-bg)] text-[var(--text-primary)]">{cat}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[0.625rem] font-bold text-white/40 uppercase tracking-widest ml-1">Grade</label>
              <select
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm text-[var(--text-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--amethyst-focus)] transition-all"
              >
                {['All Grades', '1st Grade', '2nd Grade', '3rd Grade', '4th Grade', '5th Grade', 'Higher Ed'].map(g => (
                  <option key={g} value={g} className="bg-[var(--tile-bg)] text-[var(--text-primary)]">{g}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[0.625rem] font-bold text-white/40 uppercase tracking-widest ml-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Tell others what this resource is about..."
              rows={3}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm text-[var(--text-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--amethyst-focus)] transition-all placeholder:text-white/10 resize-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[0.625rem] font-bold text-white/40 uppercase tracking-widest ml-1">File</label>
            <div
              onClick={() => fileInputRef.current?.click()}
              className={`w-full border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all ${file ? 'border-[var(--amethyst-focus)] bg-[var(--amethyst-focus)]/5' : 'border-white/10 hover:border-white/20 bg-white/[0.02]'}`}
            >
              <svg className={`w-8 h-8 ${file ? 'text-[var(--amethyst-focus)]' : 'text-white/20'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <div className="text-center font-sans">
                <p className="text-sm font-bold text-[var(--text-primary)]">{file ? file.name : 'Select or drop a file'}</p>
                <p className="text-[0.625rem] text-white/30 uppercase mono">{file ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : 'PDF, DOCX, XLSX, etc. up to 10MB'}</p>
              </div>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />
            </div>
          </div>

          <div className="pt-2 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-4 rounded-xl border border-white/10 text-white/60 font-black text-xs uppercase tracking-widest hover:text-white hover:bg-white/5 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !file}
              className="flex-[2] py-3 px-4 rounded-xl bg-[var(--amethyst-focus)] text-white font-black text-xs uppercase tracking-widest hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-[var(--amethyst-focus)]/20 transition-all active:scale-95"
            >
              {loading ? 'Sharing...' : 'Publish Resource'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Community: React.FC = () => {
  const [activeView, setActiveView] = useState<CommunityView>('library');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('popular');
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [questions, setQuestions] = useState<ForumQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);

  useEffect(() => {
    const savedBookmarks = JSON.parse(localStorage.getItem('educore_bookmarks') || '[]');
    setBookmarks(savedBookmarks);
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const files = await ApiService.listFiles('community');
      const mappedResources: Resource[] = files.map((f: any) => ({
        id: f.id,
        title: f.title || f.file.split('/').pop(),
        author: f.owner_username || 'Teacher',
        authorRep: 1200,
        category: f.subject || 'Other',
        grade: f.grade || 'All Grades',
        type: f.file_type || 'File',
        downloads: 0,
        rating: 5.0,
        date: f.uploaded_at ? new Date(f.uploaded_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
        thumbnailColor: f.file_type === 'pdf' ? 'bg-rose-500/10' : ['xlsx', 'csv', 'xls'].includes(f.file_type?.toLowerCase()) ? 'bg-emerald-500/10' : 'bg-blue-500/10',
        description: f.description || `Shared community resource: ${f.title || 'Educational Material'}`,
        fileUrl: ApiService.resolveMediaUrl(f.file)
      }));
      setResources(mappedResources);
      setQuestions([]);
    } catch (err) {
      console.error('Failed to fetch community data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleBookmark = (id: number) => {
    const bookmarkKey = `community:${id}`;
    let newBookmarks;
    if (bookmarks.includes(bookmarkKey)) {
      newBookmarks = bookmarks.filter(b => b !== bookmarkKey);
    } else {
      newBookmarks = [...bookmarks, bookmarkKey];
    }
    setBookmarks(newBookmarks);
    localStorage.setItem('educore_bookmarks', JSON.stringify(newBookmarks));
  };

  const handleFileUpload = async (file: File, metadata: any) => {
    try {
      setLoading(true);
      const ext = file.name.split('.').pop() || '';
      await ApiService.uploadFile(file, 'community', true, {
        ...metadata,
        file_type: ext
      });
      alert('Resource shared successfully!');
      setIsUploadModalOpen(false);
      fetchData();
    } catch (err) {
      console.error('Upload failed:', err);
      alert('Failed to share resource');
    } finally {
      setLoading(false);
    }
  };

  const categories = ['All', 'Science', 'Mathematics', 'History', 'Art', 'Language'];

  const filteredResources = useMemo(() => {
    return resources.filter(res => {
      const matchesSearch = res.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        res.author.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || res.category === selectedCategory;
      return matchesSearch && matchesCategory;
    }).sort((a, b) => {
      if (sortBy === 'popular') return b.downloads - a.downloads;
      if (sortBy === 'rated') return b.rating - a.rating;
      return 0;
    });
  }, [resources, searchQuery, selectedCategory, sortBy]);

  return (
    <div className="flex flex-col gap-8 pb-20 animate-fadeIn text-[var(--text-primary)]">
      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUpload={handleFileUpload}
        loading={loading}
      />

      <ResourceDetailModal
        isOpen={!!selectedResource}
        onClose={() => setSelectedResource(null)}
        resource={selectedResource}
      />

      <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-white/5 pb-8">
        <div>
          <h1 className="text-3xl md:text-5xl font-black hero-text-gradient uppercase tracking-tighter">Community</h1>
          <p className="text-white/40 text-sm mono mt-1 uppercase tracking-widest">Collaborate • Shared Intelligence • Peer Resources</p>
        </div>

        <div className="flex bg-white/5 p-1 rounded-xl border border-white/10 backdrop-blur-xl shrink-0 h-fit">
          <button
            onClick={() => setActiveView('library')}
            className={`px-6 py-2.5 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${activeView === 'library' ? 'bg-[var(--amethyst-focus)] text-white shadow-lg' : 'text-white/40 hover:text-white'}`}
          >
            Library
          </button>
          <button
            onClick={() => setActiveView('forum')}
            className={`px-6 py-2.5 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${activeView === 'forum' ? 'bg-[var(--amethyst-focus)] text-white shadow-lg' : 'text-white/40 hover:text-white'}`}
          >
            Forum
          </button>
        </div>
      </header>

      <div className="flex flex-col lg:flex-row gap-8">
        <aside className="w-full lg:w-72 shrink-0 space-y-6">
          <div className="relative group">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search community..."
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-sm text-[var(--text-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--amethyst-focus)] transition-all placeholder:text-white/20"
            />
            <svg className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-[var(--amethyst-focus)] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          <div className="tile p-5 border-l-4 border-l-[var(--amethyst-focus)]">
            <h3 className="text-xs font-black uppercase tracking-widest mb-3">Contribute</h3>
            <p className="text-[0.65rem] text-white/40 leading-relaxed mb-5 italic">Earn reputation by sharing your best lesson materials with peers.</p>
            <button
              onClick={() => activeView === 'library' ? setIsUploadModalOpen(true) : alert('Forum coming soon')}
              disabled={loading}
              className="w-full py-2.5 bg-[var(--amethyst-focus)] text-white force-text-white font-black text-[0.625rem] uppercase tracking-widest rounded-lg hover:brightness-110 shadow-lg transition-all disabled:opacity-50"
            >
              {loading ? 'Processing...' : (activeView === 'library' ? 'Upload Content' : 'Post Question')}
            </button>
          </div>

          <div className="space-y-4">
            <h4 className="mono text-[0.625rem] font-bold uppercase text-white/30 ml-1">Categories</h4>
            <div className="flex flex-wrap gap-2">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg border text-[0.625rem] font-black uppercase transition-all ${selectedCategory === cat ? 'bg-[var(--amethyst-focus)] border-[var(--amethyst-focus)] text-white' : 'border-white/10 text-white/40 hover:border-white/20 hover:text-white'}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </aside>

        <main className="flex-1 min-w-0">
          {activeView === 'library' ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4 px-2">
                <span className="text-[0.625rem] font-black uppercase text-white/30 tracking-widest">{filteredResources.length} Verified Modules</span>
                <div className="flex gap-4 text-[0.625rem] font-black uppercase">
                  <button onClick={() => setSortBy('popular')} className={sortBy === 'popular' ? 'text-[var(--amethyst-focus)]' : 'text-white/20 hover:text-white'}>Popular</button>
                  <button onClick={() => setSortBy('rated')} className={sortBy === 'rated' ? 'text-[var(--amethyst-focus)]' : 'text-white/20 hover:text-white'}>Top Rated</button>
                </div>
              </div>

              {loading && resources.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-white/20">
                  <div className="w-12 h-12 border-4 border-[var(--amethyst-focus)]/20 border-t-[var(--amethyst-focus)] rounded-full animate-spin mb-4"></div>
                  <span className="mono text-[0.625rem] uppercase tracking-widest">Accessing Library...</span>
                </div>
              ) : filteredResources.length === 0 ? (
                <div className="tile p-20 text-center border-dashed">
                  <div className="text-white/10 font-black text-6xl mb-4">EMPTY</div>
                  <p className="text-white/30 text-[0.625rem] uppercase tracking-widest mono">No community resources found. Be the first to upload!</p>
                </div>
              ) : filteredResources.map(res => {
                const isBookmarked = bookmarks.includes(`community:${res.id}`);
                return (
                  <div
                    key={res.id}
                    onClick={() => setSelectedResource(res)}
                    className="tile p-0 overflow-hidden group hover:border-[var(--amethyst-focus)]/30 transition-all duration-300 flex flex-col md:flex-row h-auto md:h-44 relative cursor-pointer"
                  >
                    <div className={`w-full md:w-52 ${res.thumbnailColor} border-b md:border-b-0 md:border-r border-white/5 flex flex-col items-center justify-center relative shrink-0`}>
                      <div className="text-white/10 font-black text-7xl select-none absolute inset-0 flex items-center justify-center">{res.type ? res.type[0] : 'F'}</div>
                      <div className="z-10 w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center text-white shadow-xl backdrop-blur-sm">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                      </div>
                      <span className="mt-2 z-10 mono text-[0.5rem] font-black uppercase text-white/50 tracking-widest">{res.type}</span>
                    </div>

                    <div className="flex-1 p-5 flex flex-col justify-between min-w-0">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded bg-[var(--amethyst-focus)]/10 text-[var(--amethyst-focus)] text-[0.55rem] font-black uppercase tracking-tighter">{res.category}</span>
                            <span className="text-[0.6rem] font-bold text-white/20 mono uppercase">{res.grade} • {res.date}</span>
                          </div>
                        </div>
                        <h3 className="text-lg font-black text-[var(--text-primary)] uppercase tracking-tight group-hover:text-[var(--amethyst-focus)] transition-colors truncate">{res.title}</h3>
                        <p className="text-white/40 text-xs leading-relaxed line-clamp-2 mt-1 pr-4">{res.description}</p>
                      </div>

                      <div className="flex items-center gap-4 mt-4 pt-4 border-t border-white/5">
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 rounded-full bg-white/5 flex items-center justify-center text-[0.5rem] font-black text-white/50 border border-white/10">{res.author[0]}</div>
                          <span className="text-[0.625rem] font-bold text-white/60 uppercase">{res.author} <span className="text-white/20 ml-1">({res.authorRep} Rep)</span></span>
                        </div>
                        <div className="h-4 w-px bg-white/10"></div>
                        <div className="flex items-center gap-1.5 text-[0.6rem] font-bold text-white/20 uppercase mono">
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                          {res.downloads}
                        </div>
                      </div>
                    </div>

                    <div className="p-5 flex flex-row md:flex-col items-center justify-center gap-3 md:border-l border-white/5 md:bg-white/[0.01]">
                      <button
                        onClick={(e) => { e.stopPropagation(); handleToggleBookmark(res.id); }}
                        className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all border ${isBookmarked ? 'bg-amber-500 border-amber-400 text-black shadow-lg shadow-amber-500/20' : 'bg-white/5 text-white/40 border-white/10 hover:text-white'}`}
                      >
                        <svg className={`w-5 h-5 ${isBookmarked ? 'fill-current' : 'fill-none'}`} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                        </svg>
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); setSelectedResource(res); }}
                        className="px-6 py-2.5 rounded-lg bg-white/5 hover:bg-[var(--amethyst-focus)] border border-white/10 text-[0.625rem] font-black uppercase text-white transition-all w-full md:w-auto"
                      >
                        View
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between mb-4 px-2">
                <span className="text-[0.625rem] font-black uppercase text-white/30 tracking-widest">Global Discussions</span>
                <div className="flex gap-4 text-[0.625rem] font-black uppercase text-white/40">
                  <button className="text-[var(--amethyst-focus)]">Newest</button>
                  <button>Frequent</button>
                  <button>Unanswered</button>
                </div>
              </div>

              {loading && questions.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-white/20">
                  <div className="w-12 h-12 border-4 border-[var(--amethyst-focus)]/20 border-t-[var(--amethyst-focus)] rounded-full animate-spin mb-4"></div>
                  <span className="mono text-[0.625rem] uppercase tracking-widest">Connecting to Forum...</span>
                </div>
              ) : questions.length === 0 ? (
                <div className="tile p-20 text-center border-dashed">
                  <svg className="w-12 h-12 text-white/10 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <p className="text-white/30 text-[0.625rem] uppercase tracking-widest mono">No discussions found in the forum yet.</p>
                </div>
              ) : questions.map(q => (
                <div key={q.id} className="tile p-5 group hover:bg-white/[0.03] transition-all cursor-pointer border-l-4 border-l-transparent hover:border-l-[var(--amethyst-focus)]">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex md:flex-col items-center justify-start gap-4 min-w-[70px]">
                      <div className="text-center">
                        <div className="text-lg font-black text-white/80">{q.votes}</div>
                        <div className="text-[0.5rem] mono uppercase text-white/30">Votes</div>
                      </div>
                      <div className={`text-center px-2 py-2 rounded-lg border w-full ${q.isSolved ? 'border-emerald-500/50 text-emerald-400 bg-emerald-500/10' : q.answers > 0 ? 'border-purple-500/30 text-purple-400 bg-purple-500/5' : 'border-white/10 text-white/20'}`}>
                        <div className="text-sm font-black">{q.answers}</div>
                        <div className="text-[0.45rem] mono uppercase">Answers</div>
                      </div>
                    </div>

                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-[0.6rem] font-bold text-white/20 uppercase">asked {q.date} by <span className="text-[var(--amethyst-focus)]">{q.author}</span></span>
                        {q.isSolved && (
                          <span className="flex items-center gap-1 text-[0.55rem] font-black text-emerald-400 uppercase tracking-tighter border border-emerald-500/20 px-1.5 py-0.5 rounded bg-emerald-500/5">
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                            Solved
                          </span>
                        )}
                      </div>
                      <h3 className="text-lg font-bold text-[var(--text-primary)] group-hover:text-[var(--amethyst-focus)] transition-colors tracking-tight leading-tight">{q.title}</h3>
                      <p className="text-white/40 text-xs leading-relaxed line-clamp-2 italic opacity-80">"{q.snippet}"</p>
                      <div className="flex flex-wrap gap-2 pt-2">
                        {q.tags.map(tag => (
                          <span key={tag} className="px-2 py-0.5 rounded-md bg-white/5 border border-white/5 text-[0.55rem] font-bold text-white/30 uppercase group-hover:text-white/60 transition-colors">#{tag}</span>
                        ))}
                      </div>
                    </div>

                    <div className="hidden lg:flex flex-col items-end justify-center min-w-[60px] opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="text-[0.5rem] mono text-white/20 uppercase mb-1">{q.views} Views</div>
                      <svg className="w-4 h-4 text-[var(--amethyst-focus)]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Community;
