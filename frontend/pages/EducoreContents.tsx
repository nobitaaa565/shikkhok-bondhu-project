import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import ApiService from '../ApiService';


// --- Interfaces ---
interface Material {
  id: string;
  title: string;
  type: string;
  url?: string;
  size: string;
  description: string;
  content?: string;
  directions: string;
  likes: number;
  views: number;
  grade: string;
  subject: string;
  unit: string;
  lesson: string;
}

interface GroupedLesson {
  lessonName: string;
  tools: Material[];
}

interface GroupedUnit {
  unitName: string;
  lessons: GroupedLesson[];
}

const isYouTubeUrl = (url: string | null | undefined) => {
  if (!url) return false;
  return url.includes('youtube.com') || url.includes('youtu.be');
};

// --- HTML Content Renderer ---
const FormattedText: React.FC<{ text: string }> = ({ text }) => {
  if (!text) return null;
  return <div className="formatted-content" dangerouslySetInnerHTML={{ __html: text }} />;
};

// --- Custom Modern Dropdown ---
interface DropdownOption { id: string; title: string; }
interface ModernDropdownProps { label: string; options: DropdownOption[]; selectedId: string; onSelect: (id: string) => void; placeholder?: string; disabled?: boolean; }
const ModernDropdown: React.FC<ModernDropdownProps> = ({ label, options, selectedId, onSelect, placeholder = 'Select...', disabled = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => { if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) setIsOpen(false); };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  const selectedOption = options.find(o => o.id === selectedId);
  return (
    <div className={`ModernDropdown relative ${disabled ? 'opacity-50 pointer-events-none' : ''}`} ref={dropdownRef}>
      <label className="block mono text-[0.625rem] text-[#f59e0b]/80 uppercase font-black mb-2 ml-1 tracking-widest">{label}</label>
      <button onClick={() => setIsOpen(!isOpen)} className={`w-full md:w-72 flex items-center justify-between px-5 py-3 rounded-xl border transition-all duration-200 bg-[#0f172a] backdrop-blur-sm group ${isOpen ? 'border-[#f59e0b] ring-1 ring-[#f59e0b]/50 shadow-[0_0_15px_rgba(245,158,11,0.15)]' : 'border-white/10 hover:border-[#f59e0b]/50'}`}>
        <span className={`font-black text-xs uppercase truncate pr-4 ${selectedOption ? 'text-white' : 'text-white/40'}`}>{selectedOption ? selectedOption.title : placeholder}</span>
        <svg className={`w-4 h-4 text-[#f59e0b] transition-transform duration-300 ${isOpen ? 'rotate-180' : 'group-hover:translate-y-0.5'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" /></svg>
      </button>
      {isOpen && (
        <div className="absolute z-50 top-full left-0 right-0 mt-2 bg-[#0f172a] border border-[#f59e0b]/20 rounded-xl shadow-2xl overflow-hidden animate-fadeIn backdrop-blur-xl ring-1 ring-black/5">
          <div className="max-h-60 overflow-y-auto custom-scrollbar p-2 space-y-1">
            {options.length > 0 ? options.map(option => (
              <button key={option.id} onClick={() => { onSelect(option.id); setIsOpen(false); }} className={`w-full text-left px-4 py-2.5 rounded-lg text-[0.65rem] font-black uppercase transition-all flex items-center justify-between ${selectedId === option.id ? 'bg-[#f59e0b] text-white force-text-white shadow-md' : 'text-white/70 hover:bg-[#f59e0b]/10 hover:text-[#f59e0b]'}`}>
                {option.title}{selectedId === option.id && <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
              </button>
            )) : <div className="px-4 py-3 text-xs text-white/40 italic text-center">No options</div>}
          </div>
        </div>
      )}
    </div>
  );
};

// --- Tool Item Component ---
const ToolItem: React.FC<{ tool: Material; onPreview: (m: Material) => void; isBookmarked: boolean; onToggleBookmark: (id: string) => void; onDownload: (m: Material) => void }> = ({ tool, onPreview, isBookmarked, onToggleBookmark, onDownload }) => {
  const renderTinyPreview = () => {
    if (tool.type === 'video') {
      const isYT = isYouTubeUrl(tool.url);
      return (
        <div className="relative w-16 h-12 rounded-lg bg-black overflow-hidden border border-white/10 group-hover/tool:border-[#f59e0b]/30">
          {tool.url && isYT && !tool.url.includes('placehold.co') ? (
            <img src={`https://img.youtube.com/vi/${tool.url.split('/').pop()?.split('?')[0]}/0.jpg`} className="w-full h-full object-cover opacity-50" />
          ) : (
            <div className="w-full h-full bg-slate-800 flex items-center justify-center opacity-30">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
            </div>
          )}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-6 h-6 rounded-full bg-[#f59e0b]/80 flex items-center justify-center text-white shadow-lg">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
            </div>
          </div>
        </div>
      );
    }
    if (tool.type === 'image' || (tool.url && tool.url.match(/\.(jpg|jpeg|png|webp|gif)$/i))) {
      return (
        <div className="w-16 h-12 rounded-lg bg-black overflow-hidden border border-white/10 group-hover/tool:border-[#f59e0b]/30">
          <img src={tool.url || 'https://placehold.co/100x100/0f172a/f59e0b?text=IMG'} className="w-full h-full object-cover group-hover/tool:scale-110 transition-transform" />
        </div>
      );
    }
    return (
      <div className="w-16 h-12 rounded-lg bg-white/5 flex flex-col items-center justify-center border border-white/10 group-hover/tool:border-[#f59e0b]/30 relative overflow-hidden">
        <svg className="w-5 h-5 text-[#f59e0b]/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <div className="absolute top-0 right-0 w-3 h-3 bg-[#f59e0b]/20 rounded-bl-lg border-b border-l border-[#f59e0b]/40"></div>
      </div>
    );
  };

  return (
    <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-4 flex flex-col md:flex-row items-center gap-4 hover:border-[#f59e0b]/40 hover:bg-white/[0.05] transition-all group/tool shadow-lg">
      <div className="shrink-0 group-hover/tool:scale-105 transition-transform">
        {renderTinyPreview()}
      </div>
      <div className="flex-1 min-w-0 text-center md:text-left">
        <h5 className="font-black text-sm text-white uppercase tracking-tight group-hover/tool:text-[#f59e0b] transition-colors truncate mb-1">{tool.title}</h5>
        <div className="flex justify-center md:justify-start items-center gap-3 text-[0.6rem] font-bold text-white/30 uppercase mono tracking-widest">
          <span className="px-1.5 py-0.5 rounded bg-white/5 border border-white/5 text-[#f59e0b]/80">{tool.type}</span>
          <span className="w-1 h-1 rounded-full bg-white/10"></span>
          <span>{tool.size}</span>
        </div>
      </div>
      <div className="flex gap-2 shrink-0">
        <button
          onClick={() => onToggleBookmark(tool.id)}
          className={`px-3 py-2 rounded-xl flex items-center justify-center transition-all border ${isBookmarked ? 'bg-amber-500 border-amber-400 text-black shadow-lg' : 'bg-white/5 text-white/40 border-white/10 hover:text-white hover:bg-white/10'}`}
          title={isBookmarked ? "Remove Bookmark" : "Add Bookmark"}
        >
          <svg className={`w-4 h-4 ${isBookmarked ? 'fill-current' : 'fill-none'}`} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
          </svg>
        </button>
        <button onClick={() => onPreview(tool)} className="px-4 py-2 rounded-xl bg-white/5 text-white/60 hover:text-white hover:bg-white/10 transition-all text-[0.6rem] font-black uppercase border border-white/10">View</button>
        <button onClick={() => onDownload(tool)} className="px-4 py-2 rounded-xl bg-[#f59e0b] text-white force-text-white text-[0.6rem] font-black uppercase shadow-lg hover:brightness-110 transition-all">Download</button>
      </div>
    </div>
  );
};

const EducoreContents: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedGrade, setSelectedGrade] = useState('g3');
  const [selectedSubject, setSelectedSubject] = useState('math');
  const [searchQuery, setSearchQuery] = useState('');
  const [previewMaterial, setPreviewMaterial] = useState<Material | null>(null);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [bookmarks, setBookmarks] = useState<string[]>([]);

  const [expandedUnits, setExpandedUnits] = useState<Set<string>>(new Set(['Unit 1: The Basics']));
  const [expandedLessons, setExpandedLessons] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch public exclusive materials from backend
        const backendMaterials = await ApiService.getExclusiveMaterials();

        // Map backend materials to Material interface
        const mappedBackend: Material[] = backendMaterials.map((f: any) => ({
          ...f,
          id: f.id.toString(), // Ensure string ID
          url: ApiService.resolveMediaUrl(f.file || f.url || f.videoUrl)
        }));

        const localData = JSON.parse(localStorage.getItem('educore_exclusive') || '[]');

        // Merge strategy: Backend is primary
        setMaterials(mappedBackend.length > 0 ? mappedBackend : localData);
      } catch (err) {
        console.error("Failed to sync exclusive content:", err);
        setMaterials(JSON.parse(localStorage.getItem('educore_exclusive') || '[]'));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const savedBookmarks = JSON.parse(localStorage.getItem('educore_bookmarks') || '[]');
    setBookmarks(savedBookmarks);

    // Deep link check
    const queryParams = new URLSearchParams(location.search);
    const targetId = queryParams.get('id');
    const targetGrade = queryParams.get('grade');
    const targetSubject = queryParams.get('subject');
    const previewId = queryParams.get('preview');

    if (previewId) {
      const match = materials.find((m: Material) => m.id === previewId);
      if (match) setPreviewMaterial(match);
    } else if (targetId && targetGrade && targetSubject) {
      // Library "Exception" path: Filter and expand context
      setSelectedGrade(targetGrade);
      setSelectedSubject(targetSubject);

      const item = materials.find((m: Material) => m.id === targetId);
      if (item) {
        setExpandedUnits(prev => new Set(prev).add(item.unit));
        setExpandedLessons(prev => new Set(prev).add(`${item.unit}-${item.lesson}`));

        // Use a slight timeout to allow the browser to process the scroll if needed
        setTimeout(() => {
          const el = document.getElementById(`tool-${targetId}`);
          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 300);
      }
    }
  }, [location.search]);

  const handleToggleBookmark = (id: string) => {
    const bookmarkKey = `exclusive:${id}`;
    let newBookmarks;
    if (bookmarks.includes(bookmarkKey)) {
      newBookmarks = bookmarks.filter(b => b !== bookmarkKey);
    } else {
      newBookmarks = [...bookmarks, bookmarkKey];
    }
    setBookmarks(newBookmarks);
    localStorage.setItem('educore_bookmarks', JSON.stringify(newBookmarks));
  };

  const toggleUnit = (unitName: string) => {
    const next = new Set(expandedUnits);
    next.has(unitName) ? next.delete(unitName) : next.add(unitName);
    setExpandedUnits(next);
  };

  const toggleLesson = (lessonId: string) => {
    const next = new Set(expandedLessons);
    next.has(lessonId) ? next.delete(lessonId) : next.add(lessonId);
    setExpandedLessons(next);
  };

  const groupedUnits = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();

    const isVisible = (m: Material) => m.type !== 'structure' && (m as any).status !== 'Hidden';

    // Filter materials
    let filtered = materials;
    if (q) {
      // Global search across all grades/subjects
      filtered = materials.filter(m =>
        isVisible(m) && (
          m.title.toLowerCase().includes(q) ||
          m.lesson.toLowerCase().includes(q) ||
          m.unit.toLowerCase().includes(q)
        )
      );
    } else {
      // Standard filter
      filtered = materials.filter(m => m.grade === selectedGrade && m.subject === selectedSubject && isVisible(m));
    }

    const unitsMap: { [key: string]: { [key: string]: Material[] } } = {};
    filtered.forEach(m => {
      const uName = m.unit || 'Unit 1';
      const lName = m.lesson || 'Lesson 1';
      if (!unitsMap[uName]) unitsMap[uName] = {};
      if (!unitsMap[uName][lName]) unitsMap[uName][lName] = [];
      unitsMap[uName][lName].push(m);
    });

    return Object.entries(unitsMap).map(([unitName, lessonsMap]) => ({
      unitName,
      lessons: Object.entries(lessonsMap).map(([lessonName, tools]) => ({
        lessonName,
        tools
      }))
    }));
  }, [materials, selectedGrade, selectedSubject, searchQuery]);

  // Handle auto-expansion based on search
  useEffect(() => {
    if (!searchQuery.trim()) return;
    const q = searchQuery.toLowerCase().trim();

    const newExpandedUnits = new Set<string>();
    const newExpandedLessons = new Set<string>();

    groupedUnits.forEach(unit => {
      unit.lessons.forEach(lesson => {
        let contentMatches = lesson.tools.some(t => t.title.toLowerCase().includes(q));

        if (contentMatches) {
          newExpandedUnits.add(unit.unitName);
          newExpandedLessons.add(`${unit.unitName}-${lesson.lessonName}`);
        } else if (lesson.lessonName.toLowerCase().includes(q)) {
          newExpandedUnits.add(unit.unitName);
        }
      });
    });

    setExpandedUnits(prev => new Set([...prev, ...newExpandedUnits]));
    setExpandedLessons(prev => new Set([...prev, ...newExpandedLessons]));
  }, [groupedUnits, searchQuery]);

  const closePreview = () => {
    setPreviewMaterial(null);
    navigate('/shikkhok-exclusive', { replace: true });
  };

  const handleDownload = async (tool: Material) => {
    if (!tool.url) {
      alert('No download source available.');
      return;
    }

    if (isYouTubeUrl(tool.url)) {
      alert('YouTube videos cannot be downloaded directly. They are available for streaming only.');
      return;
    }

    try {
      const response = await fetch(tool.url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      // Extract filename from URL or title
      const fileName = tool.url.split('/').pop()?.split('?')[0] || `${tool.title}.file`;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error('Download failed:', err);
      // Fallback for external links
      window.open(tool.url, '_blank');
    }
  };

  return (
    <div className="space-y-12 pb-20 max-w-7xl mx-auto">
      {previewMaterial && (
        <div className="fixed top-[88px] inset-x-0 bottom-0 z-[150] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="tile w-full max-w-4xl p-8 bg-[#0f172a] border-[#f59e0b]/30 h-full max-h-[85vh] overflow-hidden relative rounded-[2.5rem] flex flex-col">
            <div className="flex justify-between items-start mb-6 shrink-0">
              <div className="flex items-center gap-4">
                <div className="w-2.5 h-10 bg-[#f59e0b] rounded-full shadow-[0_0_15px_#f59e0b]"></div>
                <div>
                  <h2 className="text-2xl font-black text-white uppercase tracking-tighter leading-none mb-1">{previewMaterial.title}</h2>
                  <p className="text-[0.55rem] text-[#f59e0b] font-black uppercase mono tracking-widest">{previewMaterial.unit} • {previewMaterial.lesson}</p>
                </div>
              </div>
              <button onClick={closePreview} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-red-500 hover:bg-red-500/10 transition-colors font-bold text-xl">✕</button>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
              <div className="aspect-video bg-black preview-stage rounded-3xl border border-white/5 mb-8 flex items-center justify-center overflow-hidden shadow-2xl relative">
                {previewMaterial.type === 'video' ? (
                  isYouTubeUrl(previewMaterial.url) ? (
                    <iframe
                      className="w-full h-full"
                      src={previewMaterial.url?.replace('watch?v=', 'embed/')}
                      title="Video Preview"
                      frameBorder="0"
                      allowFullScreen
                    />
                  ) : (
                    <video
                      className="w-full h-full bg-black object-contain"
                      controls
                      playsInline
                      src={previewMaterial.url!}
                    />
                  )
                ) : (previewMaterial.type === 'pdf' || (previewMaterial.url && previewMaterial.url.toLowerCase().endsWith('.pdf'))) ? (
                  <div className="flex flex-col items-center justify-center text-center p-8">
                    <div className="w-20 h-20 bg-red-500/10 rounded-2xl flex items-center justify-center mb-4 ring-1 ring-red-500/20">
                      <svg className="w-10 h-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">PDF Document</h3>
                    <p className="text-white/40 text-sm mb-6 max-w-md">This resource is a PDF file. You can view it directly in your browser or download it for offline access.</p>
                    <a
                      href={previewMaterial.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-6 py-3 bg-red-600 hover:bg-red-500 text-white rounded-xl font-bold text-sm tracking-wide transition-all shadow-lg shadow-red-900/20 flex items-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                      Open PDF Document
                    </a>
                  </div>
                ) : (previewMaterial.type === 'image' || (previewMaterial.url && previewMaterial.url.toLowerCase().match(/\.(jpg|jpeg|png|webp|gif|svg)$/i))) ? (
                  <img src={previewMaterial.url || 'https://placehold.co/800x450/0f172a/f59e0b?text=Asset+View'} className="w-full h-full object-contain p-4" alt="Asset Preview" />
                ) : previewMaterial.type === 'quiz' ? (
                  <div className="flex flex-col items-center justify-center text-center p-8">
                    <div className="w-20 h-20 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-4 ring-1 ring-emerald-500/20">
                      <svg className="w-10 h-10 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Interactive Quiz</h3>
                    <p className="text-white/40 text-sm mb-6 max-w-md">Test your knowledge with this interactive assessment. Complete all questions to gauge your understanding.</p>
                    <a
                      href={previewMaterial.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-sm tracking-wide transition-all shadow-lg shadow-emerald-900/20 flex items-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      Start Quiz
                    </a>
                  </div>
                ) : previewMaterial.type === 'presentation' ? (
                  <div className="flex flex-col items-center justify-center text-center p-8">
                    <div className="w-20 h-20 bg-orange-500/10 rounded-2xl flex items-center justify-center mb-4 ring-1 ring-orange-500/20">
                      <svg className="w-10 h-10 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" /></svg>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Presentation Slides</h3>
                    <p className="text-white/40 text-sm mb-6 max-w-md">View the slide deck for this lesson. Use the arrow keys to navigate through the content.</p>
                    <a
                      href={previewMaterial.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-6 py-3 bg-orange-600 hover:bg-orange-500 text-white rounded-xl font-bold text-sm tracking-wide transition-all shadow-lg shadow-orange-900/20 flex items-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
                      View Slides
                    </a>
                  </div>
                ) : (
                  <img src={previewMaterial.url || 'https://placehold.co/800x450/0f172a/f59e0b?text=Asset+View'} className="w-full h-full object-contain" alt="Asset Preview" />
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2.5">
                  <h4 className="mono text-[0.7rem] font-black text-[#f59e0b] uppercase tracking-[0.2em] flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#f59e0b]"></div>
                    Context & Pedagogy
                  </h4>
                  <div className="p-4 bg-black/40 rounded-2xl border border-white/5 text-sm font-medium">
                    {previewMaterial.description ? <FormattedText text={previewMaterial.description} /> : <span className="text-white/20 italic">No description provided.</span>}
                  </div>
                </div>
                <div className="space-y-2.5">
                  <h4 className="mono text-[0.7rem] font-black text-emerald-400 uppercase tracking-[0.2em] flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                    Implementation Strategy
                  </h4>
                  <div className="p-4 bg-black/40 rounded-2xl border border-white/5 text-xs font-normal">
                    {previewMaterial.directions ? <FormattedText text={previewMaterial.directions} /> : <span className="text-white/20 italic">Specific implementation guidelines pending.</span>}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <header className="relative tile p-8 md:p-12 overflow-hidden border-[#f59e0b]/30 bg-gradient-to-br from-[#0f172a] via-[#0f172a] to-[#f59e0b]/5 rounded-[2.5rem]">
        <div className="absolute top-0 right-0 p-8 opacity-5 text-[#f59e0b] pointer-events-none transform rotate-12"><svg className="w-48 h-48" fill="currentColor" viewBox="0 0 24 24"><path d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg></div>
        <div className="relative z-10 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white uppercase tracking-tighter mb-4 leading-none">SHIKKHOK <span className="text-[#f59e0b]">EXCLUSIVE</span></h1>
          <p className="text-[#f59e0b]/60 max-w-3xl mx-auto md:mx-0 text-lg md:text-xl font-serif italic border-l-0 md:border-l-4 border-[#f59e0b]/20 md:pl-6">Access premium, pedagogical frameworks engineered for high-impact classroom delivery.</p>
        </div>
      </header>

      {/* Search and Filters Section */}
      <div className="space-y-10">
        <div className="relative group max-w-3xl mx-auto">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Units, Lessons, or Content..."
            className="w-full bg-[#0f172a] border border-white/10 rounded-3xl py-5 pl-14 pr-14 text-base text-white focus:outline-none focus:ring-2 focus:ring-[#f59e0b]/30 focus:border-[#f59e0b]/50 transition-all placeholder:text-white/20 shadow-2xl"
          />
          <svg className="w-6 h-6 absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-[#f59e0b] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="absolute right-5 top-1/2 -translate-y-1/2 text-red-500 hover:text-red-400 transition-colors p-1" title="Clear Search">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          )}
        </div>

        <div className={`flex flex-col md:flex-row items-center justify-center gap-8 border-b border-white/5 pb-12 transition-opacity duration-300 ${searchQuery ? 'opacity-30 pointer-events-none' : 'opacity-100'}`}>
          <ModernDropdown label="Grade Architecture" selectedId={selectedGrade} onSelect={setSelectedGrade} options={[{ id: 'g1', title: 'Grade 1' }, { id: 'g2', title: 'Grade 2' }, { id: 'g3', title: 'Grade 3' }, { id: 'g4', title: 'Grade 4' }, { id: 'g5', title: 'Grade 5' }]} />
          <ModernDropdown label="Core Discipline" selectedId={selectedSubject} onSelect={setSelectedSubject} options={[{ id: 'bangla', title: 'Bangla' }, { id: 'english', title: 'English' }, { id: 'math', title: 'Mathematics' }, { id: 'science', title: 'Science' }]} />
        </div>
      </div>

      <div className="space-y-6">
        {groupedUnits.length > 0 ? groupedUnits.map(unit => {
          const isUnitExpanded = expandedUnits.has(unit.unitName);
          const firstItem = unit.lessons[0]?.tools[0];

          return (
            <div key={unit.unitName} className="tile p-0 overflow-hidden bg-[#0f172a] border-white/5 rounded-[2.5rem] shadow-xl transition-all">
              <button
                onClick={() => toggleUnit(unit.unitName)}
                className={`w-full flex items-center justify-between p-8 text-left transition-colors ${isUnitExpanded ? 'bg-white/[0.03]' : 'hover:bg-white/[0.02]'}`}
              >
                <div className="flex items-center gap-6">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${isUnitExpanded ? 'bg-[#f59e0b] text-white shadow-[0_0_20px_rgba(245,158,11,0.4)]' : 'bg-white/5 text-white/20 border border-white/10'}`}>
                    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-3 mb-1">
                      <h3 className="text-2xl font-black text-white uppercase tracking-tighter leading-none">{unit.unitName}</h3>
                      {searchQuery && firstItem && (
                        <div className="flex items-center gap-2">
                          <span className="text-[0.65rem] font-black uppercase text-white bg-[#7c3aed] px-2.5 py-0.5 rounded-full shadow-lg border border-white/10">{firstItem.grade.toUpperCase()}</span>
                          <span className="text-[0.65rem] font-black uppercase text-white bg-[#f59e0b] px-2.5 py-0.5 rounded-full shadow-lg border border-white/10">{firstItem.subject.toUpperCase()}</span>
                        </div>
                      )}
                    </div>
                    <span className="text-[0.6rem] font-bold text-white/30 uppercase mono tracking-[0.2em]">{unit.lessons.length} LESSON MODULES</span>
                  </div>
                </div>
                <div className={`w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/20 transition-transform duration-500 ${isUnitExpanded ? 'rotate-180 text-[#f59e0b]' : ''}`}>
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                </div>
              </button>

              {isUnitExpanded && (
                <div className="p-4 md:p-8 space-y-4 bg-black/20">
                  {unit.lessons.map(lesson => {
                    const lessonId = `${unit.unitName}-${lesson.lessonName}`;
                    const isLessonExpanded = expandedLessons.has(lessonId);

                    return (
                      <div key={lessonId} className="bg-white/5 rounded-[2rem] border border-white/5 overflow-hidden transition-all">
                        <button
                          onClick={() => toggleLesson(lessonId)}
                          className={`w-full flex items-center justify-between px-6 py-5 text-left transition-colors ${isLessonExpanded ? 'bg-white/5' : 'hover:bg-white/[0.08]'}`}
                        >
                          <div className="flex items-center gap-4">
                            <div className={`w-2 h-6 rounded-full shadow-[0_0_8px_#f59e0b] ${isLessonExpanded ? 'bg-[#f59e0b]' : 'bg-white/10'}`}></div>
                            <div className="flex items-center gap-2">
                              <h4 className="text-sm font-black text-white uppercase tracking-widest">{lesson.lessonName}</h4>
                            </div>
                            <span className="text-[0.55rem] font-bold text-white/20 uppercase mono tracking-widest bg-white/5 px-2 py-0.5 rounded ml-2">{lesson.tools.length} Tools</span>
                          </div>
                          <div className={`transition-transform duration-300 text-white/20 ${isLessonExpanded ? 'rotate-180' : ''}`}>
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                          </div>
                        </button>

                        {isLessonExpanded && (
                          <div className="px-6 pb-6 pt-2 space-y-3 animate-fadeIn">
                            {lesson.tools.map(tool => (
                              <div key={tool.id} id={`tool-${tool.id}`}>
                                <ToolItem
                                  tool={tool}
                                  onPreview={setPreviewMaterial}
                                  isBookmarked={bookmarks.includes(`exclusive:${tool.id}`)}
                                  onToggleBookmark={handleToggleBookmark}
                                  onDownload={handleDownload}
                                />
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        }) : (
          <div className="p-32 text-center border-4 border-dashed border-white/5 rounded-[3rem] opacity-20">
            <div className="mb-6 flex justify-center"><svg className="w-20 h-20 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg></div>
            <h3 className="font-black uppercase text-xl text-white tracking-[0.2em]">{searchQuery ? 'No matches found in library' : 'No assets mapped to this coordinate'}</h3>
          </div>
        )}
      </div>

      <style>{`
        .formatted-content { line-height: 2.0; color: rgba(255,255,255,0.8); font-size: 1.25rem; text-align: justify; }
        .formatted-content p, .formatted-content li { color: rgba(255,255,255,0.8); }
        .formatted-content b, .formatted-content strong { font-weight: 800; color: #ffffff; }
        .formatted-content h3 { font-size: 1.25rem; font-weight: 900; margin: 1.5rem 0 0.75rem 0; line-height: 1.3; color: #ffffff; }
        .formatted-content ul { list-style-type: disc; padding-left: 1.5rem; margin: 0.75rem 0; }
        .formatted-content ol { list-style-type: decimal; padding-left: 1.5rem; margin: 0.75rem 0; }
        .formatted-content p { margin-bottom: 0.5rem; }
        .formatted-content blockquote { border-left: 3px solid #06b6d4; padding-left: 1rem; color: rgba(255,255,255,0.6); font-style: italic; margin: 1rem 0; }
        
        /* Force children to use explicit colors to override pasted styles */
        .formatted-content * { 
           color: rgba(255,255,255,0.9) !important; 
           background-color: transparent !important; 
           font-family: 'CustomBangla', 'Inter', sans-serif !important; 
           font-size: inherit !important; 
           line-height: inherit !important; 
           text-align: inherit !important; 
        }
        .formatted-content p, .formatted-content li { color: rgba(255,255,255,0.9) !important; }

        .formatted-content b, .formatted-content strong { font-weight: 900; color: #ffffff !important; }
        .formatted-content h3 { font-size: 1.25rem; font-weight: 900; margin: 1.5rem 0 0.75rem 0; line-height: 1.3; color: #ffffff !important; }
        .formatted-content ul { list-style-type: disc; padding-left: 1.5rem; margin: 0.75rem 0; }
        .formatted-content ol { list-style-type: decimal; padding-left: 1.5rem; margin: 0.75rem 0; }
        .formatted-content p { margin-bottom: 0.5rem; }
        .formatted-content blockquote { border-left: 3px solid #06b6d4; padding-left: 1rem; color: rgba(255,255,255,0.6) !important; font-style: italic; margin: 1rem 0; }
        
        /* Light Mode Overrides */
        [data-theme='light'] .formatted-content,
        [data-theme='light'] .formatted-content * { color: #1e293b !important; }
        
        [data-theme='light'] .formatted-content h3,
        [data-theme='light'] .formatted-content b, 
        [data-theme='light'] .formatted-content strong { color: #0f172a !important; }
        [data-theme='light'] .formatted-content blockquote { color: #475569 !important; border-left-color: #06b6d4 !important; }
      `}</style>
    </div>
  );
};

export default EducoreContents;