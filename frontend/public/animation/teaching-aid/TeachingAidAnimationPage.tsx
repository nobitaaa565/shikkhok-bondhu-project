import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// --- SVGs for UI ---
const XIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M6 18L18 6M6 6l12 12" />
    </svg>
);

const CheckIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" />
    </svg>
);

// --- Audio map: globalStepIndex → audio file ---
const AUDIO_MAP: Record<number, string> = {
    0: '/animation/teaching-aid/aid-audio/intro.mp3',
    1: '/animation/teaching-aid/aid-audio/t1.mp3',
    2: '/animation/teaching-aid/aid-audio/t2.mp3',
    3: '/animation/teaching-aid/aid-audio/t3.mp3',
    5: '/animation/teaching-aid/aid-audio/t5.mp3',
    6: '/animation/teaching-aid/aid-audio/t6.mp3',
    7: '/animation/teaching-aid/aid-audio/t7.mp3',
    8: '/animation/teaching-aid/aid-audio/t8.mp3',
    9: '/animation/teaching-aid/aid-audio/t9.mp3',
    10: '/animation/teaching-aid/aid-audio/t10.mp3',
    12: '/animation/teaching-aid/aid-audio/t12.mp3',
    14: '/animation/teaching-aid/aid-audio/t14.mp3',
    15: '/animation/teaching-aid/aid-audio/t15.mp3',
    16: '/animation/teaching-aid/aid-audio/t16.mp3',
    18: '/animation/teaching-aid/aid-audio/t18.mp3',
    20: '/animation/teaching-aid/aid-audio/t20.mp3',
    22: '/animation/teaching-aid/aid-audio/t22.mp3',
};

const TeachingAidAnimationPage: React.FC = () => {
    const navigate = useNavigate();
    const [globalStepIndex, setGlobalStepIndex] = useState(0);
    const stepIndex = globalStepIndex - 1;
    const [hasStarted, setHasStarted] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const bgAudioRef = useRef<HTMLAudioElement | null>(null);
    const isMutedRef = useRef(false);

    // Keep ref in sync with state for use inside effects
    useEffect(() => { isMutedRef.current = isMuted; }, [isMuted]);

    // Play audio whenever step changes
    useEffect(() => {
        const audioSrc = AUDIO_MAP[globalStepIndex];

        // Stop any currently playing audio
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
            audioRef.current = null;
        }

        if (!audioSrc || !hasStarted) return;

        const audio = new Audio(audioSrc);
        audio.muted = isMutedRef.current;
        audioRef.current = audio;

        const setPlayingTrue = () => document.body.setAttribute('data-audio-playing', 'true');
        const setPlayingFalse = () => document.body.setAttribute('data-audio-playing', 'false');
        audio.addEventListener('play', setPlayingTrue);
        audio.addEventListener('pause', setPlayingFalse);
        audio.addEventListener('ended', setPlayingFalse);

        const timeoutId = setTimeout(() => {
            audio.play().catch(e => console.log('Audio play prevented:', e));
        }, 200);

        return () => {
            clearTimeout(timeoutId);
            audio.pause();
            setPlayingFalse();
        };
    }, [globalStepIndex, hasStarted]);

    // Background music — starts on first user interaction, loops forever
    useEffect(() => {
        if (!hasStarted) return;
        const bgAudio = new Audio('/animation/fractions/bg.mp3');
        bgAudio.loop = true;
        bgAudio.volume = 0.2;
        bgAudio.muted = isMutedRef.current;
        bgAudioRef.current = bgAudio;
        bgAudio.play().catch(e => console.log('BG audio play prevented:', e));
        return () => {
            bgAudio.pause();
            bgAudio.currentTime = 0;
        };
    }, [hasStarted]);

    // Sync mute state to both voiceover and bg audio
    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.muted = isMuted;
        }
        if (bgAudioRef.current) {
            bgAudioRef.current.muted = isMuted;
        }
    }, [isMuted]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                document.body.setAttribute('data-audio-playing', 'false');
            }
            if (bgAudioRef.current) {
                bgAudioRef.current.pause();
            }
        };
    }, []);

    // Refs for measuring DOM positions for the flying cards animation
    const f1Ref = useRef<HTMLImageElement>(null);
    const f2Ref = useRef<HTMLImageElement>(null);
    const f3Ref = useRef<HTMLImageElement>(null);
    const f4Ref = useRef<HTMLImageElement>(null);
    const f5Ref = useRef<HTMLImageElement>(null);
    const f6Ref = useRef<HTMLImageElement>(null);
    const f7Ref = useRef<HTMLImageElement>(null);
    const f8Ref = useRef<HTMLImageElement>(null);
    const containerABodyRef = useRef<HTMLDivElement>(null);
    const containerBBodyRef = useRef<HTMLDivElement>(null);
    const mainAreaRef = useRef<HTMLDivElement>(null);

    // Stores the computed fly start/end coords for each card
    interface CardCoords {
        startX: number; startY: number; startW: number; startH: number;
        endX: number; endY: number; endW: number; endH: number;
    }
    const [flyCoords, setFlyCoords] = useState<Record<string, CardCoords>>({});

    useEffect(() => {
        if (stepIndex === 6 && containerABodyRef.current && containerBBodyRef.current) {
            const containerARect = containerABodyRef.current.getBoundingClientRect();
            const containerBRect = containerBBodyRef.current.getBoundingClientRect();

            const refs = {
                f1: { ref: f1Ref, target: containerARect },
                f2: { ref: f2Ref, target: containerBRect },
                f3: { ref: f3Ref, target: containerARect },
                f4: { ref: f4Ref, target: containerBRect },
                f5: { ref: f5Ref, target: containerARect },
                f6: { ref: f6Ref, target: containerBRect },
                f7: { ref: f7Ref, target: containerARect },
                f8: { ref: f8Ref, target: containerBRect },
            };

            const newCoords: Record<string, CardCoords> = {};

            Object.entries(refs).forEach(([id, item]) => {
                if (item.ref.current) {
                    const rect = item.ref.current.getBoundingClientRect();
                    newCoords[id] = {
                        startX: rect.left,
                        startY: rect.top,
                        startW: rect.width,
                        startH: rect.height,
                        endX: item.target.left,
                        endY: item.target.top,
                        endW: item.target.width,
                        endH: item.target.height,
                    };
                }
            });

            setFlyCoords(newCoords);
        } else if (stepIndex !== 6) {
            setFlyCoords({});
        }
    }, [globalStepIndex]);

    // rumiText is removed as it's not being used in the current UI

    // Spacebar triggers the start button when not yet started
    useEffect(() => {
        if (hasStarted) return;
        const handleKey = (e: KeyboardEvent) => {
            if (e.code === 'Space') {
                e.preventDefault();
                setHasStarted(true);
            }
        };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [hasStarted]);

    // --- Start Screen ---
    if (!hasStarted) {
        return (
            <div className="w-screen h-screen bg-[#0f172a] flex items-center justify-center relative overflow-hidden">
                {/* Background decoration */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
                    <div className="absolute top-10 left-10 text-9xl">➕</div>
                    <div className="absolute bottom-20 right-20 text-9xl">➗</div>
                    <div className="absolute top-1/2 right-1/4 text-8xl">➖</div>
                    <div className="absolute bottom-10 left-1/4 text-8xl">✖️</div>
                </div>
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center gap-8 text-center"
                >
                    <h1 className="text-6xl font-black text-white tracking-tight" style={{ fontFamily: 'CustomBangla, sans-serif' }}>
                        টিচিং এইড
                    </h1>
                    <div className="h-1.5 w-40 bg-violet-500 rounded-full" />
                    <p className="text-slate-400 text-lg max-w-sm" style={{ fontFamily: 'CustomBangla, sans-serif' }}>
                        সমতুল ভগ্নাংশ শিক্ষার অ্যানিমেশন
                    </p>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.97 }}
                        className="mt-4 px-12 py-5 bg-violet-600 hover:bg-violet-500 text-white rounded-full font-black text-2xl tracking-wide shadow-[0_0_40px_rgba(124,58,237,0.5)] transition-colors uppercase border border-violet-400/30"
                        style={{ fontFamily: 'CustomBangla, sans-serif' }}
                        onClick={() => setHasStarted(true)}
                    >
                        শুরু করুন ▶
                    </motion.button>
                </motion.div>
            </div>
        );
    }

    return (
        <div
            className={`w-screen h-screen bg-[#0f172a] flex items-center justify-center p-2 relative overflow-hidden font-sans ${globalStepIndex === 0 ? 'cursor-pointer' : ''}`}
            onClick={() => globalStepIndex === 0 && setGlobalStepIndex(1)}
        >
            {/* Background decoration */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
                <div className="absolute top-10 left-10 text-9xl">➕</div>
                <div className="absolute bottom-20 right-20 text-9xl">➗</div>
                <div className="absolute top-1/2 right-1/4 text-8xl">➖</div>
                <div className="absolute bottom-10 left-1/4 text-8xl">✖️</div>
            </div>

            <div className="w-full max-w-6xl h-full max-h-[90vh] bg-[#1e293b] rounded-[2rem] shadow-[0_0_80px_rgba(0,0,0,0.8)] border border-slate-700/50 flex flex-col relative z-10 mx-auto">
                {/* Header (Platform matched) */}
                <div className="h-16 bg-slate-900/50 border-b border-slate-800 flex items-center justify-between px-8 shrink-0 backdrop-blur-sm z-20 rounded-t-[2rem]">
                    <div className="flex items-center gap-3">
                        <div className="w-2.5 h-6 bg-violet-500 rounded-full"></div>
                        <h1 className="text-xl font-black text-white tracking-tight uppercase">Teaching Aid Animation</h1>
                    </div>
                    <div className="flex gap-4 items-center">
                        <div className="flex items-center gap-2 bg-slate-800/50 p-1 rounded-full border border-slate-700/50">
                            <button
                                onClick={() => setGlobalStepIndex(Math.max(0, globalStepIndex - 1))}
                                disabled={globalStepIndex === 0}
                                className="px-4 py-1.5 rounded-full text-sm font-bold text-white bg-slate-700 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                Prev
                            </button>
                            <span className="text-slate-400 font-bold text-xs px-2">
                                {globalStepIndex === 0 ? "Intro" : `Step ${globalStepIndex}`}
                            </span>
                            <button
                                onClick={() => setGlobalStepIndex(globalStepIndex + 1)}
                                className="px-4 py-1.5 rounded-full text-sm font-bold text-white bg-violet-600 hover:bg-violet-500 transition-colors"
                            >
                                Next
                            </button>
                        </div>
                        <div className="w-px h-6 bg-slate-700 mx-2"></div>
                        {/* Mute/Unmute Button */}
                        <button
                            onClick={(e) => { e.stopPropagation(); setIsMuted(m => !m); }}
                            className="text-slate-400 hover:text-white transition-colors bg-slate-800 hover:bg-slate-700 p-2 rounded-full border border-slate-700"
                            title={isMuted ? 'Unmute' : 'Mute'}
                        >
                            {isMuted ? (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072M12 6v12m-3.536-9.536a5 5 0 000 7.072M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                                </svg>
                            )}
                        </button>
                        <div className="w-px h-6 bg-slate-700 mx-2"></div>
                        <button onClick={() => navigate('/dashboard')} className="text-slate-400 hover:text-white transition-colors bg-slate-800 hover:bg-slate-700 p-2 rounded-full border border-slate-700">
                            <XIcon />
                        </button>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="flex-grow relative bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-800 via-slate-900 to-slate-900 shadow-inner isolate flex items-center justify-center rounded-b-[2rem]">
                    {/* Glow effect in center - hidden on intro */}
                    {globalStepIndex > 0 && (
                        <div className="absolute inset-0 bg-violet-600/5 blur-[120px] rounded-full mix-blend-screen pointer-events-none" />
                    )}

                    {/* All content fades out at step 23 */}
                    <AnimatePresence>
                        {stepIndex < 21 && (
                            <motion.div
                                key="all-content"
                                initial={{ opacity: 1 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.8 }}
                                className="absolute inset-0"
                            >

                                {/* Intro Page Content inside container */}
                                <AnimatePresence>
                                    {globalStepIndex === 0 && (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 1.1 }}
                                            className="relative z-50 text-center flex flex-col items-center justify-center cursor-pointer mt-[180px]"
                                        >
                                            <motion.h1
                                                initial={{ y: -20, opacity: 0 }}
                                                animate={{ y: 0, opacity: 1 }}
                                                className="text-white text-7xl font-black tracking-tighter mb-4"
                                                style={{ fontFamily: 'CustomBangla, sans-serif' }}
                                            >
                                                টিচিং এইড
                                            </motion.h1>
                                            <motion.div
                                                initial={{ scaleX: 0 }}
                                                animate={{ scaleX: 1 }}
                                                transition={{ delay: 0.3 }}
                                                className="h-1.5 w-48 bg-violet-500 rounded-full mb-8"
                                            />
                                            <motion.div
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ delay: 0.5 }}
                                                className="space-y-4 text-center"
                                                style={{ fontFamily: 'CustomBangla, sans-serif' }}
                                            >
                                                <p className="text-slate-400 text-2xl font-medium max-w-lg leading-relaxed text-center mx-auto">
                                                    শিক্ষক ভগ্নাংশের ধারণা শিক্ষার্থীদের বুঝানোর জন্য আমাদের এই টিচিং এইড টি ব্যবহার করতে পারেন।
                                                </p>
                                                <p className="text-slate-500 text-lg text-center">
                                                    এই একটি এইড দিয়ে শিক্ষক ক্লাসে ধারণা দেওয়া এবং অ্যাসেসমেন্ট সম্পন্ন করতে পারবেন।
                                                </p>
                                            </motion.div>
                                            <motion.div
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ delay: 1.2, duration: 2, repeat: Infinity }}
                                                className="mt-20 text-violet-400 font-bold uppercase tracking-widest text-sm text-center"
                                                style={{ fontFamily: 'CustomBangla, sans-serif' }}
                                            >

                                            </motion.div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* Step 8+: Table Surface */}
                                <AnimatePresence>
                                    {stepIndex >= 7 && stepIndex < 20 && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 20 }}
                                            className="absolute bottom-0 left-0 right-0 h-28 z-0 pointer-events-none"
                                        >
                                            {/* Stylized wood table top */}
                                            <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-b from-amber-800 to-amber-950 border-t-4 border-amber-600 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]" />
                                            {/* Table edge highlight */}
                                            <div className="absolute bottom-[60px] left-0 right-0 h-1 bg-amber-400/20" />
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* Container A - Left Side */}
                                <AnimatePresence>
                                    {stepIndex >= 5 && stepIndex < 20 && (
                                        <motion.div
                                            key="container-a"
                                            initial={{ opacity: 0, x: -80 }}
                                            animate={{
                                                opacity: 1,
                                                x: stepIndex >= 7 ? 180 : 0,
                                                y: -80
                                            }}
                                            exit={{ opacity: 0, x: -80 }}
                                            transition={{ type: "spring", stiffness: 80, delay: 0.1 }}
                                            className="absolute left-14 top-1/2 -translate-y-1/2 z-20 pointer-events-none"
                                        >
                                            <div className="w-40 h-48 rounded-2xl border-4 border-amber-400 bg-amber-900/30 backdrop-blur-sm shadow-[0_0_30px_rgba(251,191,36,0.3)] flex flex-col overflow-hidden">
                                                {/* Container header */}
                                                <div className="bg-amber-400 py-2 flex items-center justify-center">
                                                    <span className="text-2xl font-black text-amber-900 tracking-widest">A</span>
                                                </div>
                                                {/* Container body */}
                                                <div ref={containerABodyRef} className="flex-grow relative p-2 pt-1">
                                                    <AnimatePresence>
                                                        {stepIndex >= 6 ? (
                                                            <>
                                                                {/* f7 - deepest, most behind */}
                                                                <motion.img
                                                                    key="f7-in-a-static"
                                                                    src="/animation/teaching-aid/f7.png"
                                                                    alt="f7-placed"
                                                                    initial={{ opacity: 0, y: 10 }}
                                                                    animate={{ opacity: stepIndex >= 18 ? 0 : 1, y: 0, rotate: 0 }}
                                                                    transition={{ delay: 1.3 }}
                                                                    className="absolute object-contain rounded-xl drop-shadow-sm"
                                                                    style={{ width: '50%', top: '50%', left: 0, right: 0, margin: '0 auto', zIndex: 1 }}
                                                                />
                                                                {/* f5 - third layer */}
                                                                <motion.img
                                                                    key="f5-in-a-static"
                                                                    src="/animation/teaching-aid/f5.png"
                                                                    alt="f5-placed"
                                                                    initial={{ opacity: 0, y: 10 }}
                                                                    animate={{ opacity: stepIndex >= 12 ? 0 : 1, y: 0, rotate: 0 }}
                                                                    transition={{ delay: 1.1 }}
                                                                    className="absolute object-contain rounded-xl drop-shadow-md"
                                                                    style={{ width: '50%', top: '34%', left: 0, right: 0, margin: '0 auto', zIndex: 2 }}
                                                                />
                                                                {/* f3 - second layer */}
                                                                <motion.img
                                                                    key="f3-in-a-static"
                                                                    src="/animation/teaching-aid/f3.png"
                                                                    alt="f3-placed"
                                                                    initial={{ opacity: 0, y: 10 }}
                                                                    animate={{ opacity: stepIndex >= 10 ? 0 : 1, y: 0, rotate: 0 }}
                                                                    transition={{ delay: 0.9 }}
                                                                    className="absolute object-contain rounded-xl drop-shadow-md"
                                                                    style={{ width: '50%', top: '18%', left: 0, right: 0, margin: '0 auto', zIndex: 3 }}
                                                                />
                                                                {/* f1 - on top */}
                                                                <motion.img
                                                                    key="f1-in-a-static"
                                                                    src="/animation/teaching-aid/f1.png"
                                                                    alt="f1-placed"
                                                                    initial={{ opacity: 0, y: -10 }}
                                                                    animate={{ opacity: stepIndex >= 8 ? 0 : 1, y: 0, rotate: 0 }}
                                                                    transition={{ delay: 0.7 }}
                                                                    className="absolute object-contain rounded-xl drop-shadow-xl"
                                                                    style={{ width: '50%', top: '2%', left: 0, right: 0, margin: '0 auto', zIndex: 4 }}
                                                                />
                                                            </>
                                                        ) : (
                                                            <motion.span key="empty-a" className="absolute inset-0 flex items-center justify-center text-amber-400/30 text-5xl font-black">∅</motion.span>
                                                        )}
                                                    </AnimatePresence>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* Flying Card Overlays - uses ref-measured viewport positions */}
                                {Object.entries(flyCoords).map(([id, coords]) => {
                                    const c = coords as CardCoords;
                                    return (
                                        <motion.img
                                            key={`${id}-flying`}
                                            src={`/animation/teaching-aid/${id}.png`}
                                            alt={`${id}-flying`}
                                            initial={{
                                                left: c.startX,
                                                top: c.startY,
                                                width: c.startW,
                                                height: c.startH,
                                                opacity: 1,
                                                rotate: 0,
                                            }}
                                            animate={{
                                                left: c.endX,
                                                top: c.endY,
                                                width: c.endW * 0.6, // Matching the static width style
                                                height: c.endH * 0.6,
                                                opacity: 0,
                                                rotate: 0, // Match the final state rotation
                                            }}
                                            transition={{
                                                type: "spring",
                                                stiffness: 60,
                                                damping: 15,
                                                delay: id === 'f1' || id === 'f2' ? 0 :
                                                    id === 'f3' || id === 'f4' ? 0.2 :
                                                        id === 'f5' || id === 'f6' ? 0.4 : 0.6
                                            }}
                                            className="fixed z-[100] pointer-events-none drop-shadow-2xl rounded-xl"
                                            style={{ margin: 0 }} // Fixed positioning override
                                        />
                                    );
                                })}

                                {/* Container B - Right Side */}
                                <AnimatePresence>
                                    {stepIndex >= 5 && stepIndex < 20 && (
                                        <motion.div
                                            key="container-b"
                                            initial={{ opacity: 0, x: 80 }}
                                            animate={{
                                                opacity: 1,
                                                x: stepIndex >= 7 ? -180 : 0,
                                                y: -80
                                            }}
                                            exit={{ opacity: 0, x: 80 }}
                                            transition={{ type: "spring", stiffness: 80, delay: 0.1 }}
                                            className="absolute right-14 top-1/2 -translate-y-1/2 z-20 pointer-events-none"
                                        >
                                            <div className="w-40 h-48 rounded-2xl border-4 border-blue-400 bg-blue-900/30 backdrop-blur-sm shadow-[0_0_30px_rgba(96,165,250,0.3)] flex flex-col overflow-hidden">
                                                {/* Container header */}
                                                <div className="bg-blue-400 py-2 flex items-center justify-center">
                                                    <span className="text-2xl font-black text-blue-900 tracking-widest">B</span>
                                                </div>
                                                {/* Container body */}
                                                <div ref={containerBBodyRef} className="flex-grow relative p-2 pt-1">
                                                    <AnimatePresence>
                                                        {stepIndex >= 6 ? (
                                                            <>
                                                                {/* f8 - deepest, most behind */}
                                                                <motion.img
                                                                    key="f8-in-b-static"
                                                                    src="/animation/teaching-aid/f8.png"
                                                                    alt="f8-placed"
                                                                    initial={{ opacity: 0, y: 10 }}
                                                                    animate={{ opacity: ((stepIndex >= 13 && stepIndex < 16) || stepIndex >= 19) ? 0 : 1, y: 0, rotate: 0 }}
                                                                    transition={{ delay: (stepIndex >= 16 && stepIndex < 19) ? 0.5 : 1.3 }}
                                                                    className="absolute object-contain rounded-xl drop-shadow-sm"
                                                                    style={{ width: '50%', top: '50%', left: 0, right: 0, margin: '0 auto', zIndex: 1 }}
                                                                />
                                                                {/* f2 - third layer */}
                                                                <motion.img
                                                                    key="f2-in-b-static"
                                                                    src="/animation/teaching-aid/f2.png"
                                                                    alt="f2-placed"
                                                                    initial={{ opacity: 0, y: 10 }}
                                                                    animate={{ opacity: stepIndex >= 9 ? 0 : 1, y: 0, rotate: 0 }}
                                                                    transition={{ delay: 1.1 }}
                                                                    className="absolute object-contain rounded-xl drop-shadow-md"
                                                                    style={{ width: '50%', top: '34%', left: 0, right: 0, margin: '0 auto', zIndex: 2 }}
                                                                />
                                                                {/* f4 - second layer */}
                                                                <motion.img
                                                                    key="f4-in-b-static"
                                                                    src="/animation/teaching-aid/f4.png"
                                                                    alt="f4-placed"
                                                                    initial={{ opacity: 0, y: 10 }}
                                                                    animate={{ opacity: stepIndex >= 11 ? 0 : 1, y: 0, rotate: 0 }}
                                                                    transition={{ delay: 0.9 }}
                                                                    className="absolute object-contain rounded-xl drop-shadow-md"
                                                                    style={{ width: '50%', top: '18%', left: 0, right: 0, margin: '0 auto', zIndex: 3 }}
                                                                />
                                                                {/* f6 - on top */}
                                                                <motion.img
                                                                    key="f6-in-b-static"
                                                                    src="/animation/teaching-aid/f6.png"
                                                                    alt="f6-placed"
                                                                    initial={{ opacity: 0, y: -10 }}
                                                                    animate={{ opacity: stepIndex >= 17 ? 0 : 1, y: 0, rotate: 0 }}
                                                                    transition={{ delay: 0.7 }}
                                                                    className="absolute object-contain rounded-xl drop-shadow-xl"
                                                                    style={{ width: '50%', top: '2%', left: 0, right: 0, margin: '0 auto', zIndex: 4 }}
                                                                />
                                                            </>
                                                        ) : (
                                                            <motion.span key="empty-b" className="absolute inset-0 flex items-center justify-center text-blue-400/30 text-5xl font-black">∅</motion.span>
                                                        )}
                                                    </AnimatePresence>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>


                                {/* Step 8: Student and Teacher Characters */}
                                <AnimatePresence>
                                    {stepIndex >= 7 && stepIndex < 20 && (
                                        <>
                                            {/* Teacher character at top center */}
                                            <motion.img
                                                key="teacher-char"
                                                src="/animation/teaching-aid/teacher.png"
                                                alt="Teacher"
                                                initial={{ y: -450, opacity: 0, x: "-50%" }}
                                                animate={{ y: -340, opacity: 1, x: "-50%" }}
                                                exit={{ y: -450, opacity: 0, x: "-50%" }}
                                                transition={{ type: "spring", stiffness: 40, damping: 15, delay: 0.3 }}
                                                className="absolute top-1/2 left-1/2 w-48 z-10 pointer-events-none drop-shadow-2xl"
                                            />
                                            {/* Student character at bottom center */}
                                            <motion.img
                                                key="student-char"
                                                src="/animation/teaching-aid/student.png"
                                                alt="Student"
                                                initial={{ y: 300, opacity: 0, x: "-50%" }}
                                                animate={{ y: 0, opacity: 1, x: "-50%" }}
                                                exit={{ y: 300, opacity: 0, x: "-50%" }}
                                                transition={{ type: "spring", stiffness: 40, damping: 15 }}
                                                className="absolute bottom-4 left-1/2 w-32 z-30 pointer-events-none drop-shadow-2xl"
                                            />
                                        </>
                                    )}
                                </AnimatePresence>

                                {/* Hint Text under Teacher - Step 16 (Moved outside to ensure instant vanish in Step 21) */}
                                <AnimatePresence>
                                    {stepIndex >= 15 && stepIndex < 20 && (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.8, x: "-50%", y: -160 }}
                                            animate={{ opacity: 1, scale: 1, x: "-50%", y: -150 }}
                                            exit={{ opacity: 0, scale: 0.8, transition: { duration: 0 } }}
                                            transition={{ type: "spring", stiffness: 100, damping: 20 }}
                                            className="absolute top-1/2 left-1/2 z-20 w-80 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-3 rounded-2xl shadow-2xl text-center pointer-events-auto"
                                        >
                                            <div className="text-white text-sm font-medium leading-relaxed">
                                                <p>If you are unable to match the shape with fraction value, I am giving you a hint.</p>
                                                <p className="mt-2 pt-1 border-t border-white/5 opacity-90">
                                                    Hint is <span className="text-yellow-400 font-black px-1.5 py-0.5 bg-yellow-400/10 rounded border border-yellow-400/20">'Color'</span>
                                                </p>
                                            </div>
                                            {/* Little arrow at top center of bubble */}
                                            <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white/10 backdrop-blur-md border-l border-t border-white/20 rotate-45" />
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* Step 9 & 10: Floating Cards Out to Grid 3 (Center) */}
                                {/* Grid 3: Side-by-side comparison comparison */}
                                <AnimatePresence>
                                    {stepIndex >= 8 && stepIndex < 20 && (
                                        <motion.div
                                            key="grid-3-container"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="absolute left-1/2 top-[calc(50%+10px)] -translate-x-1/2 -translate-y-1/2 z-[60] flex gap-16 items-start justify-center pointer-events-none"
                                            style={{ transform: 'translate(-50%, -50%)' }} // Vertical adjustment
                                        >
                                            {/* Left Column: f1, f3, f5 */}
                                            <motion.div
                                                layout
                                                transition={{ layout: { type: "spring", stiffness: 50, damping: 20 } }}
                                                className="flex flex-col gap-2 items-center"
                                            >
                                                {/* Floating f1 - Step 9 (Vanish in Step 15) */}
                                                <AnimatePresence>
                                                    {stepIndex >= 8 && stepIndex < 14 && (
                                                        <motion.img
                                                            key="f1-floating-out"
                                                            src="/animation/teaching-aid/f1.png"
                                                            alt="f1-floating"
                                                            initial={{ x: -240, y: -60, width: "80px", opacity: 0 }}
                                                            animate={{ x: 0, y: 0, width: "80px", opacity: 1 }}
                                                            exit={{ opacity: 0, scale: 0.5 }}
                                                            transition={{ type: "spring", stiffness: 50, damping: 12 }}
                                                            className="drop-shadow-2xl rounded-xl"
                                                        />
                                                    )}
                                                </AnimatePresence>

                                                {/* Floating f3 - Step 11 (Vanish in Step 15) */}
                                                <AnimatePresence>
                                                    {stepIndex >= 10 && stepIndex < 14 && (
                                                        <motion.img
                                                            key="f3-floating-out"
                                                            src="/animation/teaching-aid/f3.png"
                                                            alt="f3-floating"
                                                            initial={{ x: -240, y: -20, width: "80px", opacity: 0 }}
                                                            animate={{ x: 0, y: 0, width: "80px", opacity: 1 }}
                                                            exit={{ opacity: 0, scale: 0.5 }}
                                                            transition={{ type: "spring", stiffness: 50, damping: 12 }}
                                                            className="drop-shadow-2xl rounded-xl"
                                                        />
                                                    )}
                                                </AnimatePresence>
                                                {/* Floating f5 - Step 13 */}
                                                <AnimatePresence>
                                                    {stepIndex >= 12 && (
                                                        <motion.img
                                                            key="f5-floating-out"
                                                            src="/animation/teaching-aid/f5.png"
                                                            alt="f5-floating"
                                                            layout
                                                            initial={{ x: -240, y: 20, width: "80px", opacity: 0 }}
                                                            animate={{ x: 0, y: 0, width: "80px", opacity: 1 }}
                                                            transition={{
                                                                type: "spring",
                                                                stiffness: 50,
                                                                damping: 12,
                                                                layout: { type: "spring", stiffness: 50, damping: 20 }
                                                            }}
                                                            className="drop-shadow-2xl rounded-xl"
                                                        />
                                                    )}
                                                </AnimatePresence>

                                                {/* Floating f7 - Step 19 */}
                                                <AnimatePresence>
                                                    {stepIndex >= 18 && (
                                                        <motion.img
                                                            key="f7-floating-out"
                                                            src="/animation/teaching-aid/f7.png"
                                                            alt="f7-floating"
                                                            layout
                                                            initial={{ x: -240, y: 60, width: "80px", opacity: 0 }}
                                                            animate={{ x: 0, y: 0, width: "80px", opacity: 1 }}
                                                            transition={{
                                                                type: "spring",
                                                                stiffness: 50,
                                                                damping: 12,
                                                                layout: { type: "spring", stiffness: 50, damping: 20 }
                                                            }}
                                                            className="drop-shadow-2xl rounded-xl"
                                                        />
                                                    )}
                                                </AnimatePresence>
                                            </motion.div>

                                            {/* Right Column: f2, f4, f8 */}
                                            <motion.div
                                                layout
                                                transition={{ layout: { type: "spring", stiffness: 50, damping: 20 } }}
                                                className="flex flex-col gap-2 items-center"
                                            >
                                                {/* Floating f2 - Step 10 (Vanish in Step 15) */}
                                                <AnimatePresence>
                                                    {stepIndex >= 9 && stepIndex < 14 && (
                                                        <motion.img
                                                            key="f2-floating-out"
                                                            src="/animation/teaching-aid/f2.png"
                                                            alt="f2-floating"
                                                            initial={{ x: 240, y: -60, width: "80px", opacity: 0 }}
                                                            animate={{ x: 0, y: 0, width: "80px", opacity: 1 }}
                                                            exit={{ opacity: 0, scale: 0.5 }}
                                                            transition={{ type: "spring", stiffness: 50, damping: 12 }}
                                                            className="drop-shadow-2xl rounded-xl"
                                                        />
                                                    )}
                                                </AnimatePresence>

                                                {/* Floating f4 - Step 12 (Vanish in Step 15) */}
                                                <AnimatePresence>
                                                    {stepIndex >= 11 && stepIndex < 14 && (
                                                        <motion.img
                                                            key="f4-floating-out"
                                                            src="/animation/teaching-aid/f4.png"
                                                            alt="f4-floating"
                                                            initial={{ x: 240, y: -20, width: "80px", opacity: 0 }}
                                                            animate={{ x: 0, y: 0, width: "80px", opacity: 1 }}
                                                            exit={{ opacity: 0, scale: 0.5 }}
                                                            transition={{ type: "spring", stiffness: 50, damping: 12 }}
                                                            className="drop-shadow-2xl rounded-xl"
                                                        />
                                                    )}
                                                </AnimatePresence>

                                                {/* Floating f8 - Step 14 (Goes back in Step 17) */}
                                                <AnimatePresence>
                                                    {stepIndex >= 13 && stepIndex < 16 && (
                                                        <motion.img
                                                            key="f8-floating-out"
                                                            src="/animation/teaching-aid/f8.png"
                                                            alt="f8-floating"
                                                            layout
                                                            initial={{ x: 240, y: 20, width: "80px", opacity: 0 }}
                                                            animate={{ x: 0, y: 0, width: "80px", opacity: 1 }}
                                                            exit={{ x: 240, y: 20, opacity: 0 }}
                                                            transition={{
                                                                type: "spring",
                                                                stiffness: 50,
                                                                damping: 12,
                                                                layout: { type: "spring", stiffness: 50, damping: 20 }
                                                            }}
                                                            className="drop-shadow-2xl rounded-xl"
                                                        />
                                                    )}
                                                </AnimatePresence>

                                                {/* Floating f6 - Step 18 */}
                                                <AnimatePresence>
                                                    {stepIndex >= 17 && (
                                                        <motion.img
                                                            key="f6-floating-out"
                                                            src="/animation/teaching-aid/f6.png"
                                                            alt="f6-floating"
                                                            layout
                                                            initial={{ x: 240, y: -60, width: "80px", opacity: 0 }}
                                                            animate={{ x: 0, y: 0, width: "80px", opacity: 1 }}
                                                            transition={{
                                                                type: "spring",
                                                                stiffness: 50,
                                                                damping: 12,
                                                                layout: { type: "spring", stiffness: 50, damping: 20 }
                                                            }}
                                                            className="drop-shadow-2xl rounded-xl"
                                                        />
                                                    )}
                                                </AnimatePresence>

                                                {/* Floating f8 - Step 20 */}
                                                <AnimatePresence>
                                                    {stepIndex >= 19 && (
                                                        <motion.img
                                                            key="f8-floating-out-final"
                                                            src="/animation/teaching-aid/f8.png"
                                                            alt="f8-floating-final"
                                                            layout
                                                            initial={{ x: 240, y: 60, width: "80px", opacity: 0 }}
                                                            animate={{ x: 0, y: 0, width: "80px", opacity: 1 }}
                                                            transition={{
                                                                type: "spring",
                                                                stiffness: 50,
                                                                damping: 12,
                                                                layout: { type: "spring", stiffness: 50, damping: 20 }
                                                            }}
                                                            className="drop-shadow-2xl rounded-xl"
                                                        />
                                                    )}
                                                </AnimatePresence>
                                            </motion.div>

                                            {/* Correct Sign between f1 and f2 - Vanish in Step 15 */}
                                            <AnimatePresence>
                                                {stepIndex >= 9 && stepIndex < 14 && (
                                                    <motion.div
                                                        key="correct-sign-1"
                                                        initial={{ opacity: 0, scale: 0, x: '-50%', y: '-50%' }}
                                                        animate={{ opacity: 1, scale: 1, x: '-50%', y: '-50%' }}
                                                        exit={{ opacity: 0, scale: 0, transition: { delay: 0 } }}
                                                        transition={{ delay: 0.8 }}
                                                        className="absolute left-1/2 top-[25px] z-[70] bg-green-500 rounded-full p-1 shadow-lg pointer-events-none"
                                                    >
                                                        <CheckIcon className="w-5 h-5 text-white" />
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>

                                            {/* Correct Sign between f3 and f4 - Vanish in Step 15 */}
                                            <AnimatePresence>
                                                {stepIndex >= 11 && stepIndex < 14 && (
                                                    <motion.div
                                                        key="correct-sign-2"
                                                        initial={{ opacity: 0, scale: 0, x: '-50%', y: '-50%' }}
                                                        animate={{ opacity: 1, scale: 1, x: '-50%', y: '-50%' }}
                                                        exit={{ opacity: 0, scale: 0, transition: { delay: 0 } }}
                                                        transition={{ delay: 0.8 }}
                                                        className="absolute left-1/2 top-[90px] z-[70] bg-green-500 rounded-full p-1 shadow-lg pointer-events-none"
                                                    >
                                                        <CheckIcon className="w-5 h-5 text-white" />
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>


                                            {/* Correct Sign between f5 and f6 - Appears in Step 18 */}
                                            <AnimatePresence>
                                                {stepIndex >= 17 && (
                                                    <motion.div
                                                        key="correct-sign-3"
                                                        initial={{ opacity: 0, scale: 0, x: '-50%', y: '-50%' }}
                                                        animate={{ opacity: 1, scale: 1, x: '-50%', y: '-50%' }}
                                                        transition={{ delay: 0.8 }}
                                                        className="absolute left-1/2 top-[25px] z-[70] bg-green-500 rounded-full p-1 shadow-lg pointer-events-none"
                                                    >
                                                        <CheckIcon className="w-5 h-5 text-white" />
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>

                                            {/* Correct Sign between f7 and f8 - Appears in Step 20 */}
                                            <AnimatePresence>
                                                {stepIndex >= 19 && (
                                                    <motion.div
                                                        key="correct-sign-4"
                                                        initial={{ opacity: 0, scale: 0, x: '-50%', y: '-50%' }}
                                                        animate={{ opacity: 1, scale: 1, x: '-50%', y: '-50%' }}
                                                        transition={{ delay: 0.8 }}
                                                        className="absolute left-1/2 top-[90px] z-[70] bg-green-500 rounded-full p-1 shadow-lg pointer-events-none"
                                                    >
                                                        <CheckIcon className="w-5 h-5 text-white" />
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {stepIndex >= 0 && (
                                    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-8">
                                        <AnimatePresence mode="wait">
                                            {(stepIndex >= 0 && stepIndex < 2) ? (
                                                <motion.div
                                                    key="f11-image"
                                                    initial={{ opacity: 0, scale: 0.9 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    exit={{ opacity: 0, scale: 1.05 }}
                                                    transition={{ duration: 0.6, ease: 'easeOut' }}
                                                    className="relative flex flex-col items-center justify-center"
                                                >
                                                    <img
                                                        src="/animation/teaching-aid/f11.png"
                                                        alt="Teaching Aid"
                                                        className="max-w-2xl drop-shadow-2xl rounded-2xl"
                                                    />

                                                    <AnimatePresence>
                                                        {stepIndex === 1 && (
                                                            <>
                                                                {/* Vertical Line - Shifted 1px left */}
                                                                <motion.div
                                                                    initial={{ scaleY: 0, opacity: 0 }}
                                                                    animate={{ scaleY: 1, opacity: 1 }}
                                                                    exit={{ opacity: 0 }}
                                                                    transition={{ duration: 0.4 }}
                                                                    className="absolute left-1/2 top-0 bottom-0 w-1 bg-transparent border-l-4 border-dashed border-red-500 origin-top -translate-x-1/2 ml-[-1px] z-30"
                                                                />
                                                                {/* Horizontal Line - Shifted 1px up */}
                                                                <motion.div
                                                                    initial={{ scaleX: 0, opacity: 0 }}
                                                                    animate={{ scaleX: 1, opacity: 1 }}
                                                                    exit={{ opacity: 0 }}
                                                                    transition={{ duration: 0.4, delay: 0.2 }}
                                                                    className="absolute top-1/2 left-0 right-0 h-1 bg-transparent border-t-4 border-dashed border-red-500 origin-left -translate-y-1/2 mt-[-1px] z-30"
                                                                />
                                                            </>
                                                        )}
                                                    </AnimatePresence>
                                                </motion.div>
                                            ) : (
                                                <motion.div
                                                    key="four-pieces"
                                                    initial={{ opacity: 0, scale: 0.9 }}
                                                    animate={{
                                                        opacity: 1,
                                                        scale: stepIndex >= 3 ? 0.4 : 1
                                                    }}
                                                    exit={{ opacity: 0, scale: 1.05 }}
                                                    transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
                                                    className="grid grid-cols-2 max-w-2xl w-full gap-4 origin-center"
                                                >
                                                    {/* Quadrant 2: Top Left */}
                                                    <motion.img
                                                        ref={f1Ref}
                                                        initial={{ x: "100%", y: "100%", opacity: 0, scale: 0.2 }}
                                                        animate={{
                                                            x: stepIndex >= 3 ? -30 : 0,
                                                            y: stepIndex >= 4 ? [0, -120] : 0,
                                                            scale: 1,
                                                            opacity: stepIndex >= 6 ? 0 : 1
                                                        }}
                                                        transition={{ type: "spring", stiffness: 100, delay: stepIndex >= 4 ? 0.2 : 0 }}
                                                        src="/animation/teaching-aid/f1.png"
                                                        alt="f1"
                                                        className="w-full h-auto rounded-tl-2xl drop-shadow-xl"
                                                    />
                                                    {/* Quadrant 1: Top Right */}
                                                    <motion.img
                                                        ref={f2Ref}
                                                        initial={{ x: "-100%", y: "100%", opacity: 0, scale: 0.2 }}
                                                        animate={{
                                                            x: stepIndex >= 3 ? 30 : 0,
                                                            y: stepIndex >= 4 ? [0, -120] : 0,
                                                            opacity: stepIndex >= 6 ? 0 : 1,
                                                            scale: 1
                                                        }}
                                                        transition={{ type: "spring", stiffness: 100, delay: stepIndex >= 4 ? 0.2 : 0 }}
                                                        src="/animation/teaching-aid/f2.png"
                                                        alt="f2"
                                                        className="w-full h-auto rounded-tr-2xl drop-shadow-xl"
                                                    />
                                                    {/* Quadrant 3: Bottom Left */}
                                                    <motion.img
                                                        ref={f3Ref}
                                                        initial={{ x: "100%", y: "-100%", opacity: 0, scale: 0.2 }}
                                                        animate={{
                                                            x: stepIndex >= 3 ? -30 : 0,
                                                            y: stepIndex >= 4 ? [0, -120] : 0,
                                                            opacity: stepIndex >= 6 ? 0 : 1,
                                                            scale: 1
                                                        }}
                                                        transition={{ type: "spring", stiffness: 100, delay: stepIndex >= 4 ? 0.2 : 0 }}
                                                        src="/animation/teaching-aid/f3.png"
                                                        alt="f3"
                                                        className="w-full h-auto rounded-bl-2xl drop-shadow-xl"
                                                    />
                                                    {/* Quadrant 4: Bottom Right */}
                                                    <motion.img
                                                        ref={f4Ref}
                                                        initial={{ x: "-100%", y: "-100%", opacity: 0, scale: 0.2 }}
                                                        animate={{
                                                            x: stepIndex >= 3 ? 30 : 0,
                                                            y: stepIndex >= 4 ? [0, -120] : 0,
                                                            opacity: stepIndex >= 6 ? 0 : 1,
                                                            scale: 1
                                                        }}
                                                        transition={{ type: "spring", stiffness: 100, delay: stepIndex >= 4 ? 0.2 : 0 }}
                                                        src="/animation/teaching-aid/f4.png"
                                                        alt="f4"
                                                        className="w-full h-auto rounded-br-2xl drop-shadow-xl"
                                                    />

                                                    {/* Step 5 Additional Pieces */}
                                                    <AnimatePresence>
                                                        {stepIndex >= 4 && (
                                                            <>
                                                                <motion.img
                                                                    ref={f5Ref}
                                                                    initial={{ x: -30, y: 500, opacity: 0 }}
                                                                    animate={{
                                                                        x: -30,
                                                                        y: 0,
                                                                        opacity: stepIndex >= 6 ? 0 : 1
                                                                    }}
                                                                    exit={{ opacity: 0 }}
                                                                    transition={{ type: "spring", stiffness: 100 }}
                                                                    src="/animation/teaching-aid/f5.png"
                                                                    alt="f5"
                                                                    className="w-full h-auto rounded-tl-2xl drop-shadow-xl"
                                                                />
                                                                <motion.img
                                                                    ref={f6Ref}
                                                                    initial={{ x: 30, y: 500, opacity: 0 }}
                                                                    animate={{
                                                                        x: 30,
                                                                        y: 0,
                                                                        opacity: stepIndex >= 6 ? 0 : 1
                                                                    }}
                                                                    exit={{ opacity: 0 }}
                                                                    transition={{ type: "spring", stiffness: 100 }}
                                                                    src="/animation/teaching-aid/f6.png"
                                                                    alt="f6"
                                                                    className="w-full h-auto rounded-tr-2xl drop-shadow-xl"
                                                                />
                                                                <motion.img
                                                                    ref={f7Ref}
                                                                    initial={{ x: -30, y: 500, opacity: 0 }}
                                                                    animate={{
                                                                        x: -30,
                                                                        y: 0,
                                                                        opacity: stepIndex >= 6 ? 0 : 1
                                                                    }}
                                                                    exit={{ opacity: 0 }}
                                                                    transition={{ type: "spring", stiffness: 100 }}
                                                                    src="/animation/teaching-aid/f7.png"
                                                                    alt="f7"
                                                                    className="w-full h-auto rounded-bl-2xl drop-shadow-xl"
                                                                />
                                                                <motion.img
                                                                    ref={f8Ref}
                                                                    initial={{ x: 30, y: 500, opacity: 0 }}
                                                                    animate={{
                                                                        x: 30,
                                                                        y: 0,
                                                                        opacity: stepIndex >= 6 ? 0 : 1
                                                                    }}
                                                                    exit={{ opacity: 0 }}
                                                                    transition={{ type: "spring", stiffness: 100 }}
                                                                    src="/animation/teaching-aid/f8.png"
                                                                    alt="f8"
                                                                    className="w-full h-auto rounded-br-2xl drop-shadow-xl"
                                                                />
                                                            </>
                                                        )}
                                                    </AnimatePresence>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                        {/* Subtitles container */}
                                        <div className={`absolute bottom-10 left-0 w-full flex px-12 z-[1000] pointer-events-none transition-all duration-500 ${stepIndex >= 21 ? 'opacity-0' : ''} ${(stepIndex < 7 || stepIndex >= 20)
                                            ? 'justify-center'
                                            : (stepIndex === 7 || stepIndex % 2 !== 0)
                                                ? 'justify-start pl-[calc(50%+80px)]' // Right side for Step 8 and odd indices (Step 10, 12, etc.)
                                                : 'justify-end pr-[calc(50%+80px)]' // Left side for even indices starting Step 9 (Step 9, 11, etc.)
                                            }`}>
                                            <AnimatePresence mode="wait">
                                                {stepIndex === 0 && (
                                                    <motion.p key="subtitle-0" style={{ fontFamily: 'CustomBangla, sans-serif' }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="text-xl text-amber-200 bg-slate-900/80 px-8 py-4 rounded-full backdrop-blur-md pointer-events-auto border relative z-50 border-amber-500/20">
                                                        শিক্ষক ক্লাসের আগেই প্রথমে আমাদের ওয়েবসাইট থেকে টিচিং এইড টি ডাউনলোড করে A4 পেপারে প্রিন্ট করে নিবেন।
                                                    </motion.p>
                                                )}
                                                {stepIndex === 1 && (
                                                    <motion.p key="subtitle-1" style={{ fontFamily: 'CustomBangla, sans-serif' }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="text-xl text-red-300 bg-slate-900/80 px-8 py-4 rounded-full backdrop-blur-md pointer-events-auto border relative z-50 border-red-500/20">
                                                        এভাবে লাল দাগ বরাবর ভাঁজ করে কেটে নিবেন।
                                                    </motion.p>
                                                )}
                                                {stepIndex === 2 && (
                                                    <motion.p key="subtitle-2" style={{ fontFamily: 'CustomBangla, sans-serif' }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="text-xl text-violet-300 bg-slate-900/80 px-8 py-4 rounded-full backdrop-blur-md pointer-events-auto border relative z-50 border-violet-500/20">
                                                        কাটার পর প্রতিটি A4 পেজ থেকে ৪ টি করে কার্ড পাওয়া যাবে।
                                                    </motion.p>
                                                )}

                                                {stepIndex === 4 && (
                                                    <motion.p key="subtitle-4" style={{ fontFamily: 'CustomBangla, sans-serif' }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="text-xl text-cyan-300 bg-slate-900/80 px-8 py-4 rounded-full backdrop-blur-md pointer-events-auto border relative z-50 border-cyan-500/20">
                                                        এভাবে সব গুলো পেজ কেটে কার্ড গুলো থেকে shape এবং value আলাদা করে নিবেন।
                                                    </motion.p>
                                                )}
                                                {stepIndex === 5 && (
                                                    <motion.p key="subtitle-5" style={{ fontFamily: 'CustomBangla, sans-serif' }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="text-xl text-blue-300 bg-slate-900/80 px-8 py-4 rounded-full backdrop-blur-md pointer-events-auto border relative z-50 border-blue-500/20">
                                                        দুটি বক্স নিবেন কার্ড গুলো রাখার জন্য।
                                                    </motion.p>
                                                )}
                                                {stepIndex === 6 && (
                                                    <motion.p key="subtitle-6" style={{ fontFamily: 'CustomBangla, sans-serif' }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="text-xl text-emerald-300 bg-slate-900/80 px-8 py-4 rounded-full backdrop-blur-md pointer-events-auto border relative z-50 border-emerald-500/20">
                                                        A বক্সে সকল রঙিন shape এর কার্ড এবং B বক্সে value দেওয়া কার্ড গুলো রাখবেন।
                                                    </motion.p>
                                                )}
                                                {stepIndex === 7 && (
                                                    <motion.p key="subtitle-7" style={{ fontFamily: 'CustomBangla, sans-serif' }} initial={{ opacity: 0, y: -40 }} animate={{ opacity: 1, y: -40 }} exit={{ opacity: 0, y: -40 }} className="text-base text-indigo-300 bg-slate-900/80 px-6 py-2 rounded-full backdrop-blur-md pointer-events-auto border relative z-50 border-indigo-500/20">
                                                        এবার বক্স গুলো শিক্ষার্থীদের মাঝে গ্রুপে গ্রুপে ভাগ করে দিবেন।
                                                    </motion.p>
                                                )}
                                                {stepIndex === 8 && (
                                                    <motion.p key="subtitle-8" style={{ fontFamily: 'CustomBangla, sans-serif' }} initial={{ opacity: 0, y: -40 }} animate={{ opacity: 1, y: -40 }} exit={{ opacity: 0, y: -40 }} className="text-base text-rose-300 bg-slate-900/80 px-6 py-2 rounded-full backdrop-blur-md pointer-events-auto border relative z-50 border-rose-500/20">
                                                        ডেমো হিসেবে একটি কার্ড A বক্স থেকে নিবেন।
                                                    </motion.p>
                                                )}
                                                {stepIndex === 9 && (
                                                    <motion.p key="subtitle-9" style={{ fontFamily: 'CustomBangla, sans-serif' }} initial={{ opacity: 0, y: -40 }} animate={{ opacity: 1, y: -40 }} exit={{ opacity: 0, y: -40 }} className="text-base text-yellow-300 bg-slate-900/80 px-6 py-2 rounded-full backdrop-blur-md pointer-events-auto border relative z-50 border-yellow-500/20">
                                                        এবং B বক্স থেকে এর সমতুল্য কার্ডটি নিয়ে মিলিয়ে দেখবেন।
                                                    </motion.p>
                                                )}

                                                {stepIndex === 11 && (
                                                    <motion.p key="subtitle-11" style={{ fontFamily: 'CustomBangla, sans-serif' }} initial={{ opacity: 0, y: -40 }} animate={{ opacity: 1, y: -40 }} exit={{ opacity: 0, y: -40 }} className="text-base text-yellow-300 bg-slate-900/80 px-6 py-2 rounded-full backdrop-blur-md pointer-events-auto border relative z-50 border-yellow-500/20">
                                                        এভাবে আরও একটি কার্ড জোড়া মিলিয়ে দেখবেন। এবং কোনো একটি কার্ড ভুল হলে শিক্ষক একটি ক্লু দেবেন।
                                                    </motion.p>
                                                )}

                                                {stepIndex === 13 && (
                                                    <motion.p key="subtitle-13" style={{ fontFamily: 'CustomBangla, sans-serif' }} initial={{ opacity: 0, y: -40 }} animate={{ opacity: 1, y: -40 }} exit={{ opacity: 0, y: -40 }} className="text-base text-orange-400 bg-slate-900/80 px-6 py-2 rounded-full backdrop-blur-md pointer-events-auto border relative z-50 border-orange-500/20">
                                                        ইচ্ছে করে দুটি ভুল কার্ড নিয়ে জিজ্ঞেস করুন, "এই দুটি কি সমতুল্য মনে হচ্ছে?"
                                                    </motion.p>
                                                )}
                                                {stepIndex === 14 && (
                                                    <motion.p key="subtitle-14" style={{ fontFamily: 'CustomBangla, sans-serif' }} initial={{ opacity: 0, y: -40 }} animate={{ opacity: 1, y: -40 }} exit={{ opacity: 0, y: -40 }} className="text-base text-red-400 bg-slate-900/80 px-6 py-2 rounded-full backdrop-blur-md pointer-events-auto border relative z-50 border-red-500/20">
                                                        শিক্ষক শিক্ষার্থী কে বলবে যে এই কার্ড জোড়া মেলেনি।
                                                    </motion.p>
                                                )}
                                                {stepIndex === 15 && (
                                                    <motion.p key="subtitle-15" style={{ fontFamily: 'CustomBangla, sans-serif' }} initial={{ opacity: 0, y: -40 }} animate={{ opacity: 1, y: -40 }} exit={{ opacity: 0, y: -40 }} className="text-base text-amber-300 bg-slate-900/80 px-6 py-2 rounded-full backdrop-blur-md pointer-events-auto border relative z-50 border-amber-500/20">
                                                        ( এখানে jean piaget's theory এর concrete operational stage (৭ থেকে ১১ বছর) কে মাথায় রেখে কালার কে ক্লু হিসেবে দিবেন) যাতে সঠিক shape এর জন্য value খুঁজে পেতে সহজ হয়।
                                                    </motion.p>
                                                )}

                                                {stepIndex === 17 && (
                                                    <motion.p key="subtitle-17" style={{ fontFamily: 'CustomBangla, sans-serif' }} initial={{ opacity: 0, y: -40 }} animate={{ opacity: 1, y: -40 }} exit={{ opacity: 0, y: -40 }} className="text-base text-sky-300 bg-slate-900/80 px-6 py-2 rounded-full backdrop-blur-md pointer-events-auto border relative z-50 border-sky-500/20">
                                                        ভুল কার্ড এর সঠিক value মিলিয়ে দেখাবেন।
                                                    </motion.p>
                                                )}

                                                {stepIndex === 19 && (
                                                    <motion.p key="subtitle-19" style={{ fontFamily: 'CustomBangla, sans-serif' }} initial={{ opacity: 0, y: -40 }} animate={{ opacity: 1, y: -40 }} exit={{ opacity: 0, y: -40 }} className="text-base text-sky-400 bg-slate-900/80 px-6 py-2 rounded-full backdrop-blur-md pointer-events-auto border relative z-50 border-sky-500/20">
                                                        একইভাবে বাকি কার্ডগুলোর জোড়া মিলিয়ে দিবেন। এভাবে কার্ড এর গেম টা বুঝিয়ে দেবেন।
                                                    </motion.p>
                                                )}

                                            </AnimatePresence>

                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Final Screen - outside all-content so it stays visible */}
                    <AnimatePresence>
                        {stepIndex === 21 && (
                            <motion.div
                                key="final-screen-outer"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.8 }}
                                className="absolute inset-0 z-[200] flex flex-col items-center justify-center p-12 overflow-hidden"
                            >

                                {/* Glowing radial pulse behind everything */}
                                <motion.div
                                    key="glow-pulse"
                                    initial={{ opacity: 0, scale: 0.5 }}
                                    animate={{ opacity: [0, 0.15, 0], scale: [0.5, 2, 2.5] }}
                                    transition={{ duration: 2, ease: 'easeOut', delay: 0.1 }}
                                    className="absolute inset-0 bg-violet-500 rounded-full blur-[120px] pointer-events-none"
                                />

                                {/* Floating sparkle particles */}
                                {[...Array(10)].map((_, i) => (
                                    <motion.div
                                        key={`spark-${i}`}
                                        initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
                                        animate={{
                                            opacity: [0, 1, 0],
                                            scale: [0, 1, 0],
                                            x: (i % 2 === 0 ? 1 : -1) * (60 + i * 30),
                                            y: -(80 + i * 20),
                                        }}
                                        transition={{ delay: 0.2 + i * 0.08, duration: 1.2, ease: 'easeOut' }}
                                        className="absolute text-lg pointer-events-none select-none"
                                        style={{ top: '45%', left: '50%' }}
                                    >
                                        {['✨', '⭐', '🌟', '💫', '✦', '✧', '★', '✩', '🎉', '🏆'][i]}
                                    </motion.div>
                                ))}

                                {/* Checkmark badge */}
                                <motion.div
                                    key="check-badge"
                                    initial={{ scale: 0, rotate: -180, opacity: 0 }}
                                    animate={{ scale: 1, rotate: 0, opacity: 1 }}
                                    transition={{ delay: 0.3, type: 'spring', stiffness: 200, damping: 15 }}
                                    className="mb-4 w-14 h-14 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center shadow-[0_0_30px_rgba(139,92,246,0.6)]"
                                >
                                    <CheckIcon className="w-7 h-7 text-white" />
                                </motion.div>

                                {/* Title */}
                                <motion.div
                                    key="final-title"
                                    initial={{ opacity: 0, y: -30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, type: 'spring', stiffness: 100, delay: 0.2 }}
                                    className="mb-8 text-center"
                                >
                                    <h2
                                        className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400 tracking-tight mb-3"
                                        style={{ fontFamily: 'CustomBangla, sans-serif' }}
                                    >
                                        শিক্ষকের সর্বশেষ করণীয়
                                    </h2>
                                    <motion.div
                                        initial={{ scaleX: 0 }}
                                        animate={{ scaleX: 1 }}
                                        transition={{ delay: 0.5, duration: 0.5 }}
                                        className="h-1 w-32 bg-gradient-to-r from-violet-500 to-fuchsia-500 mx-auto rounded-full"
                                    />
                                </motion.div>

                                {/* Card */}
                                <motion.div
                                    key="final-card"
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.6, duration: 0.6, type: 'spring', stiffness: 90 }}
                                    className="max-w-2xl bg-white/5 border border-violet-500/20 rounded-2xl p-8 backdrop-blur-md shadow-xl text-center"
                                    style={{ fontFamily: 'CustomBangla, sans-serif' }}
                                >
                                    <motion.p
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.9, duration: 0.5 }}
                                        className="text-slate-200 text-lg leading-relaxed mb-4"
                                    >
                                        ক্লাসে একটিভিটির মাধ্যমে ভগ্নাংশের ধারণা সব শিক্ষার্থীদের বুঝিয়ে দেওয়া হয়ে গেলে, একি এইড ব্যবহার করে শিক্ষক অ্যাসেসমেন্ট সম্পন্ন করতে পারবেন।
                                    </motion.p>
                                    <motion.p
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 1.2, duration: 0.5 }}
                                        className="text-violet-300 text-base leading-relaxed"
                                    >
                                        একটি সময় বেঁধে দিয়ে একজন শিক্ষার্থী সর্বোচ্চ কতগুলো কার্ড সঠিক ভাবে মিলাতে পারে এভাবে তাকে ইভালুয়েট করবেন।
                                    </motion.p>
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default TeachingAidAnimationPage;

