
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ApiService from '../ApiService';


interface Resource { name: string; type: string }
interface Lesson { id: string; title: string; duration: string; description: string; videoUrl?: string; resources: Resource[]; }
interface Module { id: string; title: string; lessons: Lesson[]; }
interface CourseData { id: string; title: string; instructor: string; modules: Module[]; image: string; }

interface CourseProgress {
  completed: string[];
  lastSeen: string | null;
  finished: boolean;
}

const CourseView: React.FC = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();


  const [courseData, setCourseData] = useState<CourseData | null>(null);
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);
  const [completedLessonIds, setCompletedLessonIds] = useState<string[]>([]);
  const [isCourseFinished, setIsCourseFinished] = useState(false);

  useEffect(() => {
    const fetchCourse = async () => {
      if (!courseId) return;
      try {
        const course = await ApiService.getCourse(courseId);
        setCourseData(course);
      } catch (err) {
        console.error("Failed to fetch course:", err);
        const data = JSON.parse(localStorage.getItem('educore_training') || '[]');
        const localCourse = data.find((c: any) => c.id === courseId);
        if (localCourse) {
          setCourseData(localCourse);
        } else {
          navigate('/training');
        }
      }
    };
    fetchCourse();
  }, [courseId, navigate]);

  useEffect(() => {
    if (!courseId || !courseData) return;

    const savedProgress = JSON.parse(localStorage.getItem('educore_progress') || '{}');
    const progress: CourseProgress = savedProgress[courseId] || { completed: [], lastSeen: null, finished: false };

    setCompletedLessonIds(progress.completed);
    setIsCourseFinished(progress.finished);

    if (progress.lastSeen) {
      setActiveLessonId(progress.lastSeen);
    } else if (courseData.modules?.[0]?.lessons?.[0]) {
      setActiveLessonId(courseData.modules[0].lessons[0].id);
    }
  }, [courseId, courseData]);

  const saveProgress = (completed: string[], lastSeen: string | null, finished: boolean) => {
    if (!courseId) return;
    const savedProgress = JSON.parse(localStorage.getItem('educore_progress') || '{}');
    savedProgress[courseId] = { completed, lastSeen, finished };
    localStorage.setItem('educore_progress', JSON.stringify(savedProgress));
  };

  useEffect(() => {
    // Scroll to top when active lesson changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeLessonId]);

  if (!courseData || !activeLessonId) return <div className="p-20 text-center mono uppercase font-black text-white/20">Accessing Data Core...</div>;

  const allLessons = courseData.modules.flatMap(m => m.lessons);
  const activeLessonIndex = allLessons.findIndex(l => l.id === activeLessonId);
  const activeLesson = allLessons[activeLessonIndex];
  const overallProgress = Math.round((completedLessonIds.length / allLessons.length) * 100) || 0;

  function getYouTubeEmbedUrl(input: string | undefined) {
    if (!input) return null;
    const trimmedInput = input.trim();
    if (trimmedInput.includes('<iframe')) {
      const match = trimmedInput.match(/src=["'](.+?)["']/);
      return match ? match[1] : null;
    }
    if (trimmedInput.includes('youtube.com/embed/')) return trimmedInput;
    if (trimmedInput.includes('youtube.com/watch?v=')) {
      const urlParams = new URLSearchParams(trimmedInput.split('?')[1]);
      const v = urlParams.get('v');
      return v ? `https://www.youtube.com/embed/${v}` : null;
    }
    if (trimmedInput.includes('youtu.be/')) {
      const id = trimmedInput.split('youtu.be/')[1]?.split('?')[0];
      return id ? `https://www.youtube.com/embed/${id}` : null;
    }
    return null;
  }

  const handleLessonComplete = () => {
    let newCompleted = completedLessonIds;
    if (!completedLessonIds.includes(activeLessonId)) {
      newCompleted = [...completedLessonIds, activeLessonId];
      setCompletedLessonIds(newCompleted);
    }

    const nextIndex = activeLessonIndex + 1;
    let nextId = activeLessonId;

    if (nextIndex < allLessons.length) {
      nextId = allLessons[nextIndex].id;
      setActiveLessonId(nextId);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    saveProgress(newCompleted, nextId, isCourseFinished);
  };

  const handleCourseComplete = () => {
    setIsCourseFinished(true);
    saveProgress(completedLessonIds, activeLessonId, true);
    alert("Congratulations! Course successfully marked as completed.");
  };

  const isLessonLocked = (lessonId: string) => {
    const index = allLessons.findIndex(l => l.id === lessonId);
    if (index === 0) return false;
    const prevLessonId = allLessons[index - 1].id;
    return !completedLessonIds.includes(prevLessonId);
  };

  const isLessonCompleted = (lessonId: string) => completedLessonIds.includes(lessonId);
  const isLastLesson = activeLessonIndex === allLessons.length - 1;

  const ytUrl = getYouTubeEmbedUrl(activeLesson.videoUrl);

  return (
    <div className="flex flex-col min-h-screen animate-fadeIn max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/training')} className="w-10 h-10 rounded-full bg-white/5 [html[data-theme='light']_&]:bg-slate-100 hover:bg-white/10 [html[data-theme='light']_&]:hover:bg-slate-200 flex items-center justify-center text-white transition-colors border border-white/10">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          </button>
          <div>
            <h1 className="text-xl font-black uppercase tracking-tight leading-none mb-1">{courseData.title}</h1>
            <p className="text-[0.625rem] text-white/40 [html[data-theme='light']_&]:text-slate-500 font-bold uppercase mono tracking-widest">{courseData.instructor} • Educator Portal</p>
          </div>
        </div>
        <div className="flex items-center gap-6 min-w-[200px]">
          <div className="flex-1">
            <div className="flex justify-between text-[0.625rem] uppercase font-bold mb-1.5">
              <span className="text-white/40 [html[data-theme='light']_&]:text-slate-500">Knowledge Retention</span>
              <span className="text-[var(--amethyst-focus)]">{overallProgress}%</span>
            </div>
            <div className="h-2 bg-white/5 [html[data-theme='light']_&]:bg-slate-200 rounded-full overflow-hidden border border-white/5 [html[data-theme='light']_&]:border-slate-300">
              <div className="h-full bg-[var(--amethyst-focus)] transition-all duration-700 shadow-[0_0_10px_rgba(124,58,237,0.4)]" style={{ width: `${overallProgress}%` }}></div>
            </div>
          </div>
          {isCourseFinished && (
            <div className="px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
              <span className="text-emerald-400 font-black uppercase text-[0.55rem] tracking-widest flex items-center gap-2">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                Verified
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 pb-24 items-start">
        <div className="flex-1 flex flex-col w-full min-w-0">
          <div className="aspect-video bg-black rounded-2xl overflow-hidden relative border border-white/10 [html[data-theme='light']_&]:border-slate-200 shadow-2xl group ring-1 ring-white/5">
            {ytUrl ? (
              <iframe className="w-full h-full" src={ytUrl} title="Educational Transmission" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
            ) : activeLesson.videoUrl ? (
              <video
                key={activeLessonId}
                className="w-full h-full object-contain bg-black"
                controls
                autoPlay={false}
                playsInline
                poster={ApiService.resolveMediaUrl(courseData.image)}
                src={ApiService.resolveMediaUrl(activeLesson.videoUrl)}
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-white/20 uppercase font-black text-xs space-y-4">
                <svg className="w-16 h-16 opacity-5 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                <span className="tracking-[0.2em]">Signal Lost - Check Source</span>
              </div>
            )}
          </div>

          <div className="mt-6 flex flex-col md:flex-row md:items-center justify-between gap-6 py-6 border-b border-white/5 [html[data-theme='light']_&]:border-slate-200">
            <div>
              <h2 className="text-2xl font-black uppercase tracking-tight mb-1">{activeLesson.title}</h2>
              <p className="text-white/30 [html[data-theme='light']_&]:text-slate-500 text-[0.65rem] font-bold uppercase mono tracking-widest">Duration: {activeLesson.duration} • Module Index {activeLessonIndex + 1}</p>
            </div>

            <div className="flex items-center gap-3">
              {isLessonCompleted(activeLessonId) ? (
                <div className="flex gap-2">
                  <span className="text-emerald-400 font-black uppercase text-[0.65rem] flex items-center gap-2 bg-emerald-500/10 px-4 py-2.5 rounded-xl border border-emerald-500/20">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                    Completed
                  </span>
                  {isLastLesson && !isCourseFinished && (
                    <button onClick={handleCourseComplete} className="bg-amber-500 hover:bg-amber-400 text-black font-black uppercase text-[0.65rem] px-6 py-2.5 rounded-xl shadow-[0_0_20px_rgba(245,158,11,0.3)] transition-all transform active:scale-95 flex items-center gap-2">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                      Finalize Course
                    </button>
                  )}
                </div>
              ) : (
                <button onClick={handleLessonComplete} className="bg-emerald-500 hover:bg-emerald-400 text-black font-black uppercase text-[0.65rem] px-8 py-3 rounded-xl shadow-[0_5px_20px_rgba(16,185,129,0.3)] transition-all transform hover:-translate-y-1 active:scale-95 flex items-center gap-2">
                  {isLastLesson ? 'Complete Last Module' : 'Complete & Next Unit'}
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                </button>
              )}
            </div>
          </div>

          <div className="mt-8 space-y-8">
            <div className="space-y-4">
              {/* Updated Methodology Overview text color for Light Mode to black (solid opacity) */}
              <h3 className="text-xs font-black uppercase text-white/40 [html[data-theme='light']_&]:!text-black tracking-[0.2em] flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[var(--amethyst-focus)]"></div>
                Methodology Overview
              </h3>
              {/* Methodology description text in black for light mode */}
              <p className="text-white/60 [html[data-theme='light']_&]:text-black leading-relaxed text-sm whitespace-pre-wrap">{activeLesson.description}</p>
            </div>

            {/* Updated Verified Assets background color for Dark Mode to #0e1223, and Pure White for Light Mode */}
            <div className="tile p-6 bg-white [html[data-theme='dark']_&]:bg-[#0e1223] border-l-4 border-l-[var(--amethyst-focus)] [html[data-theme='light']_&]:border border-[html[data-theme='light']_&]:border-slate-200">
              <h3 className="mono text-[0.625rem] text-[var(--amethyst-focus)] font-black uppercase mb-6 flex items-center gap-3">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                </svg>
                Verified Assets
              </h3>
              {activeLesson.resources && activeLesson.resources.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {activeLesson.resources.map((res, idx) => (
                    <div key={idx} onClick={() => window.open(ApiService.resolveMediaUrl((res as any).file || (res as any).url), '_blank')} className="flex items-center gap-4 p-4 rounded-xl bg-black/40 [html[data-theme='light']_&]:bg-slate-50 border border-white/5 [html[data-theme='light']_&]:border-slate-200 hover:border-[var(--amethyst-focus)]/50 transition-all group cursor-pointer shadow-sm">
                      <div className="w-10 h-10 flex items-center justify-center bg-white/5 [html[data-theme='light']_&]:bg-white rounded-lg text-white/40 [html[data-theme='light']_&]:text-slate-400 group-hover:text-white [html[data-theme='light']_&]:group-hover:text-slate-900 transition-colors border border-white/5 [html[data-theme='light']_&]:border-slate-200">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-bold text-white/80 [html[data-theme='light']_&]:text-slate-900 group-hover:text-white [html[data-theme='light']_&]:group-hover:text-black truncate">{res.name}</div>
                        <div className="text-[0.55rem] font-bold text-white/20 [html[data-theme='light']_&]:text-slate-400 uppercase mono">{res.type} Format</div>
                      </div>
                      <svg className="w-5 h-5 text-white/10 [html[data-theme='light']_&]:text-slate-200 group-hover:text-[var(--amethyst-focus)] group-hover:translate-x-1 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                    </div>
                  ))}
                </div>
              ) : <p className="text-white/20 [html[data-theme='light']_&]:text-slate-300 text-xs italic opacity-50 px-2">No secondary assets detected for this segment.</p>}
            </div>
          </div>
        </div>

        {/* Curriculum Flow Sidebar Container - Pure White in Light Mode, #0e1223 in Dark Mode */}
        <div className="w-full lg:w-96 flex flex-col bg-white [html[data-theme='dark']_&]:bg-[#0e1223] border border-white/5 [html[data-theme='light']_&]:border-slate-200 rounded-3xl overflow-hidden shrink-0 lg:sticky lg:top-28 max-h-[calc(100vh-140px)] shadow-xl">
          <div className="p-5 bg-white/5 [html[data-theme='light']_&]:bg-slate-50 border-b border-white/5 [html[data-theme='light']_&]:border-slate-200 flex items-center justify-between">
            <h3 className="font-black uppercase tracking-tight text-xs">Curriculum Flow</h3>
            <span className="px-2 py-0.5 rounded-full bg-white/10 [html[data-theme='light']_&]:bg-slate-200 text-[0.5rem] font-bold text-white/40 [html[data-theme='light']_&]:text-slate-500 uppercase">{allLessons.length} Units</span>
          </div>
          <div className="overflow-y-auto flex-1 custom-scrollbar">
            {courseData.modules.map((module) => (
              <div key={module.id} className="border-b border-white/5 [html[data-theme='light']_&]:border-slate-200 last:border-b-0">
                <div className="px-5 py-3.5 bg-white/[0.02] [html[data-theme='light']_&]:bg-slate-50 flex items-center gap-3">
                  <div className="w-1.5 h-4 bg-[var(--amethyst-focus)] rounded-full"></div>
                  <h4 className="text-[0.65rem] font-black text-white/60 [html[data-theme='light']_&]:text-slate-500 uppercase tracking-widest">{module.title}</h4>
                </div>
                <div className="py-1">
                  {module.lessons.map((lesson) => {
                    const isLocked = isLessonLocked(lesson.id);
                    const isActive = lesson.id === activeLessonId;
                    const isCompleted = isLessonCompleted(lesson.id);
                    return (
                      <button
                        key={lesson.id}
                        disabled={isLocked && !isCompleted}
                        onClick={() => {
                          setActiveLessonId(lesson.id);
                          saveProgress(completedLessonIds, lesson.id, isCourseFinished);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className={`w-full text-left px-5 py-3.5 flex items-start gap-4 transition-all border-l-[3px] group ${isActive ? 'bg-[var(--amethyst-focus)]/10 border-l-[var(--amethyst-focus)]' : 'border-l-transparent hover:bg-white/5 [html[data-theme="light"]_&]:hover:bg-slate-50'} ${isLocked ? 'opacity-30 cursor-not-allowed grayscale' : 'opacity-100 cursor-pointer'}`}
                      >
                        <div className="mt-1 shrink-0">
                          {isCompleted ? (
                            <svg className="w-4 h-4 text-emerald-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                          ) : isLocked ? (
                            <svg className="w-4 h-4 text-white/20 [html[data-theme='light']_&]:text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                          ) : (
                            <svg className={`w-4 h-4 ${isActive ? 'text-[var(--amethyst-focus)]' : 'text-white/40 [html[data-theme="light"]_&]:text-slate-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /></svg>
                          )}
                        </div>
                        <div className="min-w-0">
                          <div className={`text-xs font-bold leading-tight mb-1 transition-colors ${isActive ? 'text-white [html[data-theme="light"]_&]:text-slate-900' : 'text-white/60 [html[data-theme="light"]_&]:text-slate-600 group-hover:text-white [html[data-theme="light"]_&]:group-hover:text-slate-900'}`}>{lesson.title}</div>
                          <div className={`text-[0.6rem] font-bold uppercase mono tracking-widest ${isActive ? 'text-[var(--amethyst-focus)]' : 'text-white/20 [html[data-theme="light"]_&]:text-slate-400'}`}>{lesson.duration}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
          {overallProgress === 100 && !isCourseFinished && (
            <div className="p-4 bg-amber-500/5 [html[data-theme='light']_&]:bg-amber-500/10 border-t border-amber-500/20 [html[data-theme='light']_&]:border-amber-500/30">
              <button onClick={handleCourseComplete} className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-black font-black uppercase text-[0.65rem] rounded-xl transition-all shadow-lg flex items-center justify-center gap-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                Finalize Course
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseView;
