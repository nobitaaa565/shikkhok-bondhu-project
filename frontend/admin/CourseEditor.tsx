
import React, { useState, useRef } from 'react';
import ApiService from '../ApiService';
import { Course, Module, Lesson, Resource } from './types';
import { FormattableTextArea, VideoPreview, ConfirmModal } from './AdminComponents';

interface CourseEditorProps {
  course: Course;
  setCourse: React.Dispatch<React.SetStateAction<Course | null>>;
  onSave: (e: React.FormEvent) => void;
  onCancel: () => void;
}

const CourseEditor: React.FC<CourseEditorProps> = ({ course, setCourse, onSave, onCancel }) => {
  const [collapsedIds, setCollapsedIds] = useState<Set<string>>(new Set());
  const [uploading, setUploading] = useState<string | null>(null); // moduleId-lessonId-type
  const [confirmState, setConfirmState] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type: 'module' | 'lesson';
    moduleId?: string;
    lessonId?: string;
  }>({
    isOpen: false,
    title: '',
    message: '',
    type: 'module'
  });

  const getFileName = (url: string | null | undefined) => {
    if (!url) return '';
    const parts = url.split('/');
    return parts[parts.length - 1];
  };

  const toggleCollapse = (id: string) => {
    const next = new Set(collapsedIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setCollapsedIds(next);
  };

  const addModule = () => {
    const title = prompt("Enter Module Title:", "New Block");
    if (title === null) return;

    setCourse(prev => {
      if (!prev) return null;
      const newModule: Module = {
        id: `m-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        title: title || 'Untitled Segment',
        lessons: []
      };
      return { ...prev, modules: [...prev.modules, newModule] };
    });
  };

  const triggerDeleteModule = (moduleId: string) => {
    setConfirmState({
      isOpen: true,
      title: "Delete Module",
      message: "Permanently remove this module?",
      type: 'module',
      moduleId
    });
  };

  const triggerDeleteLesson = (moduleId: string, lessonId: string) => {
    setConfirmState({
      isOpen: true,
      title: "Delete Lesson Unit",
      message: "Permanently remove this lesson?",
      type: 'lesson',
      moduleId,
      lessonId
    });
  };

  const handleConfirmDelete = () => {
    const { type, moduleId, lessonId } = confirmState;

    if (type === 'module' && moduleId) {
      setCourse(prev => {
        if (!prev) return null;
        return { ...prev, modules: prev.modules.filter(m => m.id !== moduleId) };
      });
    } else if (type === 'lesson' && moduleId && lessonId) {
      setCourse(prev => {
        if (!prev) return null;
        return {
          ...prev,
          modules: prev.modules.map(m => {
            if (m.id === moduleId) {
              return { ...m, lessons: m.lessons.filter(l => l.id !== lessonId) };
            }
            return m;
          })
        };
      });
    }

    setConfirmState({ ...confirmState, isOpen: false });
  };

  const addLesson = (moduleId: string) => {
    setCourse(prev => {
      if (!prev) return null;
      const newLesson: Lesson = {
        id: `l-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        title: 'New Lesson Unit',
        duration: '00:00',
        description: '',
        videoUrl: '',
        resources: []
      };
      return {
        ...prev,
        modules: prev.modules.map(m => m.id === moduleId ? { ...m, lessons: [...m.lessons, newLesson] } : m)
      };
    });
  };

  const handleLessonUpdate = (moduleId: string, lessonId: string, updates: Partial<Lesson>) => {
    setCourse(prev => {
      if (!prev) return null;
      return {
        ...prev,
        modules: prev.modules.map(mod => mod.id === moduleId ? {
          ...mod,
          lessons: mod.lessons.map(les => les.id === lessonId ? { ...les, ...updates } : les)
        } : mod)
      };
    });
  };

  const handleFileUpload = async (moduleId: string, lessonId: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploading(`${moduleId}-${lessonId}-file`);
      try {
        const data = await ApiService.uploadFile(file, 'training', true);
        const newRes: Resource = { name: file.name, type: file.name.split('.').pop() || 'file', url: data.file };
        setCourse(prev => {
          if (!prev) return null;
          return {
            ...prev,
            modules: prev.modules.map(m => m.id === moduleId ? {
              ...m,
              lessons: m.lessons.map(l => l.id === lessonId ? { ...l, resources: [...l.resources, newRes] } : l)
            } : m)
          };
        });
      } catch (err) {
        alert('File ingestion failed.');
      } finally {
        setUploading(null);
        event.target.value = '';
      }
    }
  };

  /* Duration Helper Logic */
  const formatTime = (seconds: number) => {
    if (isNaN(seconds) || seconds === 0) return '00:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const probeVideoDuration = (fileUrl: string): Promise<string> => {
    return new Promise((resolve) => {
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.onloadedmetadata = () => {
        resolve(formatTime(video.duration));
      };
      video.onerror = () => {
        resolve(''); // Fail silently
      };
      video.src = fileUrl;
    });
  };

  const handleVideoUpload = async (moduleId: string, lessonId: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploading(`${moduleId}-${lessonId}-video`);
      try {
        const data = await ApiService.uploadFile(file, 'training', true);

        // Auto-fetch duration from uploaded file
        let detectedDuration = 'Synced';
        try {
          // File object itself can sometimes be probed directly via URL.createObjectURL before upload, 
          // but here we use the returned URL or the Blob URL to be safe.
          const tempUrl = URL.createObjectURL(file);
          const duration = await probeVideoDuration(tempUrl);
          if (duration) detectedDuration = duration;
          URL.revokeObjectURL(tempUrl);
        } catch (e) {
          console.warn('Could not probe duration', e);
        }

        handleLessonUpdate(moduleId, lessonId, {
          videoUrl: data.file,
          duration: detectedDuration
        });
      } catch (err) {
        alert('Video transmission failed.');
      } finally {
        setUploading(null);
        event.target.value = '';
      }
    }
  };

  const handleVideoUrlChange = async (moduleId: string, lessonId: string, url: string) => {
    handleLessonUpdate(moduleId, lessonId, { videoUrl: url });

    // Attempt to sniff YouTube duration if possible (requires API usually, but we can try basic heuristics or set a "Live" status)
    // For now, only direct file links can be probed client-side easily without CORS issues, 
    // unless we have a backend helper. We'll stick to local file probing and naive YouTube fallback.
    if (url.includes('youtube') || url.includes('youtu.be')) {
      // YouTube duration fetching client-side is hard without API key. 
      // We'll leave it as is or set a placeholder if it was empty.
      return;
    }

    // If it's a direct link to mp4/webm, try probing
    if (url.match(/\.(mp4|webm|ogg)$/i)) {
      const duration = await probeVideoDuration(url);
      if (duration) {
        handleLessonUpdate(moduleId, lessonId, { duration });
      }
    }
  };

  /* Reordering Logic */
  const moveModule = (index: number, direction: 'up' | 'down') => {
    setCourse(prev => {
      if (!prev) return null;
      const newModules = [...prev.modules];
      if (direction === 'up' && index > 0) {
        [newModules[index], newModules[index - 1]] = [newModules[index - 1], newModules[index]];
      } else if (direction === 'down' && index < newModules.length - 1) {
        [newModules[index], newModules[index + 1]] = [newModules[index + 1], newModules[index]];
      }
      return { ...prev, modules: newModules };
    });
  };

  const moveLesson = (moduleId: string, lessonIndex: number, direction: 'up' | 'down') => {
    setCourse(prev => {
      if (!prev) return null;
      return {
        ...prev,
        modules: prev.modules.map(mod => {
          if (mod.id !== moduleId) return mod;
          const newLessons = [...mod.lessons];
          if (direction === 'up' && lessonIndex > 0) {
            [newLessons[lessonIndex], newLessons[lessonIndex - 1]] = [newLessons[lessonIndex - 1], newLessons[lessonIndex]];
          } else if (direction === 'down' && lessonIndex < newLessons.length - 1) {
            [newLessons[lessonIndex], newLessons[lessonIndex + 1]] = [newLessons[lessonIndex + 1], newLessons[lessonIndex]];
          }
          return { ...mod, lessons: newLessons };
        })
      };
    });
  };

  const moveResource = (moduleId: string, lessonId: string, resIndex: number, direction: 'left' | 'right') => {
    setCourse(prev => {
      if (!prev) return null;
      return {
        ...prev,
        modules: prev.modules.map(mod => {
          if (mod.id !== moduleId) return mod;
          return {
            ...mod,
            lessons: mod.lessons.map(les => {
              if (les.id !== lessonId) return les;
              const newRes = [...les.resources];
              if (direction === 'left' && resIndex > 0) {
                [newRes[resIndex], newRes[resIndex - 1]] = [newRes[resIndex - 1], newRes[resIndex]];
              } else if (direction === 'right' && resIndex < newRes.length - 1) {
                [newRes[resIndex], newRes[resIndex + 1]] = [newRes[resIndex + 1], newRes[resIndex]];
              }
              return { ...les, resources: newRes };
            })
          };
        })
      };
    });
  };

  return (
    <div className="tile p-5 bg-slate-900/60 border-cyan-500/30 animate-fadeIn relative">
      <ConfirmModal
        isOpen={confirmState.isOpen}
        title={confirmState.title}
        message={confirmState.message}
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmState({ ...confirmState, isOpen: false })}
        confirmText="Yes, Delete"
      />

      <div className="flex justify-between items-center mb-6 border-b border-white/5 pb-4">
        <div>
          <h2 className="text-xl font-black text-white uppercase tracking-tighter">Architectural Sync: {course.title || 'New Deployment'}</h2>
          <p className="text-[0.55rem] text-cyan-400 font-bold uppercase mono tracking-widest mt-0.5">Status: System Build Mode</p>
        </div>
        <button onClick={onCancel} className="text-red-500 hover:text-red-400 text-[0.65rem] font-black uppercase flex items-center gap-2 group transition-all">
          <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          Abort
        </button>
      </div>

      <form onSubmit={onSave} className="space-y-6">
        <section className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-white/5 rounded-2xl border border-white/5">
          <div className="space-y-1">
            <label className="mono text-[0.55rem] font-black text-white/30 uppercase tracking-widest">Structural Title</label>
            <input type="text" value={course.title} onChange={e => setCourse({ ...course, title: e.target.value })} className="contact-input py-2 px-3 bg-black/40 border-white/10 text-white font-bold text-xs" required />
          </div>
          <div className="space-y-1">
            <label className="mono text-[0.55rem] font-black text-white/30 uppercase tracking-widest">Instructor</label>
            <input type="text" value={course.instructor} onChange={e => setCourse({ ...course, instructor: e.target.value })} className="contact-input py-2 px-3 bg-black/40 border-white/10 text-white font-bold text-xs" required />
          </div>
          <div className="space-y-1">
            <label className="mono text-[0.55rem] font-black text-white/30 uppercase tracking-widest">Tier</label>
            <select value={course.level} onChange={e => setCourse({ ...course, level: e.target.value })} className="contact-input py-2 px-3 bg-black/40 border-white/10 text-white font-bold text-xs">
              <option value="Beginner">Foundational</option>
              <option value="Intermediate">Specialist</option>
              <option value="Advanced">Elite</option>
            </select>
          </div>
          <div className="space-y-1">
            <label className="mono text-[0.55rem] font-black text-white/30 uppercase tracking-widest">Thumbnail URL</label>
            <input type="text" value={course.image} onChange={e => setCourse({ ...course, image: e.target.value })} className="contact-input py-2 px-3 bg-black/40 border-white/10 text-white font-bold text-xs" />
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <h3 className="text-sm font-black text-white uppercase tracking-tight">Deployment Schema</h3>
            <button type="button" onClick={addModule} className="bg-cyan-600 hover:bg-cyan-500 text-white px-4 py-1.5 rounded-lg text-[0.55rem] font-black uppercase tracking-widest transition-all">+ Add Block</button>
          </div>

          <div className="space-y-4">
            {course.modules.length > 0 ? course.modules.map((m, mIdx) => {
              const isModuleCollapsed = collapsedIds.has(m.id);
              return (
                <div key={m.id} className="tile p-3 bg-black/40 border-l-2 border-l-cyan-500 relative group/module animate-fadeIn">
                  <div className="flex flex-col md:flex-row md:items-center gap-3 mb-4">
                    <div className="flex-1">
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => toggleCollapse(m.id)}
                          className={`shrink-0 w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 border border-white/10 text-white/40 hover:text-white transition-all ${isModuleCollapsed ? '-rotate-90' : ''}`}
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" /></svg>
                        </button>
                        <span className="shrink-0 flex items-center justify-center w-8 h-8 rounded-lg bg-cyan-600/10 text-cyan-500 font-bold mono text-xs border border-cyan-500/20">
                          {mIdx + 1}
                        </span>
                        <input
                          type="text"
                          value={m.title}
                          onChange={e => {
                            const val = e.target.value;
                            setCourse(prev => prev ? {
                              ...prev,
                              modules: prev.modules.map(mod => mod.id === m.id ? { ...mod, title: val } : mod)
                            } : null);
                          }}
                          className="bg-white/5 border border-white/10 text-white font-black uppercase text-xs rounded-lg px-3 py-1.5 w-full focus:ring-1 focus:ring-cyan-500/30 outline-none transition-all"
                        />
                        <div className="flex gap-1">
                          <button type="button" onClick={() => moveModule(mIdx, 'up')} disabled={mIdx === 0} className="shrink-0 px-2 py-1.5 rounded-lg bg-white/5 text-white/40 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent"><svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 15l7-7 7 7" /></svg></button>
                          <button type="button" onClick={() => moveModule(mIdx, 'down')} disabled={mIdx === course.modules.length - 1} className="shrink-0 px-2 py-1.5 rounded-lg bg-white/5 text-white/40 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent"><svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" /></svg></button>
                        </div>
                        <button
                          type="button"
                          onClick={() => addLesson(m.id)}
                          className="shrink-0 px-3 py-1.5 rounded-lg bg-cyan-600/10 text-cyan-400 text-[0.55rem] font-black uppercase tracking-widest hover:bg-cyan-600 hover:text-white transition-all border border-cyan-500/20"
                        >
                          + Unit
                        </button>
                        <button
                          type="button"
                          onClick={() => triggerDeleteModule(m.id)}
                          className="shrink-0 px-3 py-1.5 rounded-lg bg-red-600/10 text-red-500 text-[0.55rem] font-black uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all border border-red-500/20"
                        >
                          Del
                        </button>
                      </div>
                    </div>
                  </div>

                  {!isModuleCollapsed && (
                    <div className="space-y-4 pl-4 md:pl-6 border-l border-white/5 mb-2">
                      {m.lessons.length > 0 ? m.lessons.map((l, lIdx) => {
                        const isLessonCollapsed = collapsedIds.has(l.id);
                        return (
                          <div key={l.id} className="p-4 bg-white/5 rounded-xl border border-white/5 space-y-4 group/lesson relative animate-fadeIn">
                            <div className="flex justify-between items-center pb-2 border-b border-white/5">
                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => toggleCollapse(l.id)}
                                  className={`shrink-0 w-6 h-6 flex items-center justify-center rounded bg-white/5 border border-white/10 text-white/40 hover:text-white transition-all ${isLessonCollapsed ? '-rotate-90' : ''}`}
                                >
                                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" /></svg>
                                </button>
                                <span className="text-[0.55rem] font-bold text-white/20 mono bg-white/5 px-1.5 py-0.5 rounded">#{lIdx + 1}</span>
                                <div className="w-2 h-2 rounded-full bg-cyan-500"></div>
                                <h4 className="text-[0.55rem] font-black text-white/40 uppercase tracking-[0.2em]">Lesson Unit</h4>
                                {isLessonCollapsed && <span className="text-[0.45rem] font-black text-cyan-400 bg-cyan-400/5 px-1 rounded uppercase ml-2">Hidden</span>}
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="flex gap-1 mr-2 opacity-50 group-hover/lesson:opacity-100 transition-opacity">
                                  <button type="button" onClick={() => moveLesson(m.id, lIdx, 'up')} disabled={lIdx === 0} className="p-1 rounded bg-white/5 text-white/40 hover:text-cyan-400 disabled:opacity-30 disabled:hover:text-white/40"><svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 15l7-7 7 7" /></svg></button>
                                  <button type="button" onClick={() => moveLesson(m.id, lIdx, 'down')} disabled={lIdx === m.lessons.length - 1} className="p-1 rounded bg-white/5 text-white/40 hover:text-cyan-400 disabled:opacity-30 disabled:hover:text-white/40"><svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" /></svg></button>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => triggerDeleteLesson(m.id, l.id)}
                                  className="p-1.5 rounded bg-red-600/10 text-red-500 hover:bg-red-600 hover:text-white transition-all"
                                >
                                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                </button>
                              </div>
                            </div>

                            {!isLessonCollapsed && (
                              <div className="space-y-4">
                                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                                  <div className="lg:col-span-8 grid grid-cols-2 gap-3">
                                    <div className="space-y-1">
                                      <label className="mono text-[0.5rem] text-white/20 uppercase font-black">Unit Title</label>
                                      <input type="text" value={l.title} onChange={e => handleLessonUpdate(m.id, l.id, { title: e.target.value })} className="contact-input py-1.5 px-3 bg-black/40 border-white/5 text-xs font-bold" />
                                    </div>
                                    <div className="space-y-1">
                                      <label className="mono text-[0.5rem] text-white/20 uppercase font-black">Duration (Auto)</label>
                                      <input type="text" value={l.duration} onChange={e => handleLessonUpdate(m.id, l.id, { duration: e.target.value })} className="contact-input py-1.5 px-3 bg-black/40 border-white/5 text-xs font-bold" placeholder="00:00" />
                                    </div>
                                    <div className="col-span-2 space-y-2">
                                      <label className="mono text-[0.5rem] text-white/20 uppercase font-black">Video Resource</label>
                                      <div className="flex flex-col gap-2">
                                        <div className="flex gap-2">
                                          <input type="text" value={l.videoUrl || ''} onChange={e => handleVideoUrlChange(m.id, l.id, e.target.value)} className="contact-input py-1.5 px-3 bg-black/40 border-white/5 text-[0.55rem] font-mono text-cyan-400 flex-1" placeholder="Paste URL or Embed Code..." />
                                          <label className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-[0.55rem] font-black uppercase tracking-widest transition-all cursor-pointer flex items-center justify-center min-w-[90px]">
                                            {uploading === `${m.id}-${l.id}-video` ? 'Syncing...' : 'Upload'}
                                            <input type="file" accept="video/*" className="hidden" onChange={(e) => handleVideoUpload(m.id, l.id, e)} disabled={!!uploading} />
                                          </label>
                                        </div>
                                        {l.videoUrl && !l.videoUrl.includes('<iframe') && (
                                          <div className="px-3 py-1 bg-white/5 rounded border border-white/5 flex items-center justify-between">
                                            <span className="text-[0.45rem] font-black text-white/20 uppercase">Active:</span>
                                            <span className="text-[0.5rem] font-bold text-cyan-400 mono truncate">{getFileName(l.videoUrl)}</span>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="lg:col-span-4">
                                    <VideoPreview url={l.videoUrl} />
                                  </div>
                                </div>

                                <FormattableTextArea label="Methodology" value={l.description} onChange={val => handleLessonUpdate(m.id, l.id, { description: val })} />

                                <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                                  <div className="flex flex-wrap gap-2">
                                    {l.resources.length > 0 ? l.resources.map((res, rIdx) => (
                                      <div key={rIdx} className="flex items-center gap-2 bg-cyan-500/5 px-2 py-1.5 rounded border border-cyan-500/10 group/res relative">
                                        <div className="text-[0.5rem] font-bold text-cyan-500/60 mono pr-1 border-r border-cyan-500/10">#{rIdx + 1}</div>
                                        <div className="flex items-center gap-1 opacity-0 group-hover/res:opacity-100 transition-opacity">
                                          <button type="button" onClick={() => moveResource(m.id, l.id, rIdx, 'left')} disabled={rIdx === 0} className="w-4 h-4 rounded-full bg-white/5 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 disabled:opacity-0"><svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" /></svg></button>
                                          <button type="button" onClick={() => moveResource(m.id, l.id, rIdx, 'right')} disabled={rIdx === l.resources.length - 1} className="w-4 h-4 rounded-full bg-white/5 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 disabled:opacity-0"><svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg></button>
                                        </div>
                                        <div className="flex flex-col min-w-0">
                                          <span className="text-[0.45rem] font-black text-white/20 uppercase truncate">File:</span>
                                          <span className="text-[0.55rem] font-bold text-white/70 uppercase truncate max-w-[120px]">{res.name}</span>
                                        </div>
                                        <button type="button" onClick={() => {
                                          setCourse(prev => prev ? {
                                            ...prev,
                                            modules: prev.modules.map(mod => mod.id === m.id ? {
                                              ...mod,
                                              lessons: mod.lessons.map(les => les.id === l.id ? {
                                                ...les,
                                                resources: les.resources.filter((_, ri) => ri !== rIdx)
                                              } : les)
                                            } : mod)
                                          } : null);
                                        }} className="text-red-500 hover:text-red-400 transition-colors ml-1"><svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg></button>
                                      </div>
                                    )) : <span className="text-[0.45rem] text-white/10 uppercase font-black italic">No secondary assets</span>}
                                  </div>
                                  <label className="shrink-0 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-[0.5rem] font-black text-cyan-400 uppercase cursor-pointer hover:bg-cyan-500 hover:text-white transition-all flex items-center gap-1">
                                    {uploading === `${m.id}-${l.id}-file` ? (
                                      <span className="animate-pulse">Syncing...</span>
                                    ) : (
                                      <>
                                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>
                                        Add Data
                                      </>
                                    )}
                                    <input type="file" className="hidden" onChange={(e) => handleFileUpload(m.id, l.id, e)} disabled={!!uploading} />
                                  </label>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      }) : (
                        <div className="p-4 text-center border border-dashed border-white/5 rounded-xl opacity-20 text-[0.55rem] font-black uppercase tracking-widest">No Units</div>
                      )}
                    </div>
                  )}

                  {isModuleCollapsed && m.lessons.length > 0 && (
                    <div className="mt-2 px-3 py-1.5 bg-cyan-500/5 rounded-lg border border-cyan-500/10 flex items-center justify-between">
                      <span className="text-[0.5rem] font-black text-cyan-400 uppercase tracking-widest">{m.lessons.length} Units Hidden</span>
                      <button type="button" onClick={() => toggleCollapse(m.id)} className="text-[0.5rem] font-black text-white/40 hover:text-white uppercase tracking-widest">Expand</button>
                    </div>
                  )}
                </div>
              );
            }) : (
              <div className="p-10 text-center border border-dashed border-white/5 rounded-2xl opacity-20 text-[0.65rem] font-black uppercase tracking-widest">Empty Architecture</div>
            )}
          </div>
        </section>

        <div className="pt-6 border-t border-white/10 flex gap-4">
          <button type="button" onClick={onCancel} className="flex-1 py-3 text-[0.6rem] font-black uppercase text-red-500 hover:text-red-400 transition-all rounded-xl border border-white/5">Discard</button>
          <button type="submit" className="flex-1 py-3 bg-cyan-600 text-white force-text-white text-[0.65rem] font-black uppercase tracking-widest rounded-xl shadow-lg hover:bg-cyan-500 transition-all transform active:scale-[0.98]">Deploy Sync</button>
        </div>
      </form>
    </div>
  );
};

export default CourseEditor;
