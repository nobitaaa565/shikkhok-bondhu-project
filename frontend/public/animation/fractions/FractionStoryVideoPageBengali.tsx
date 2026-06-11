import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LivePizza } from './LivePizza';
import { LiveChocolate } from './LiveChocolate';

const toBengaliNum = (num: number | string) => num.toString().replace(/[0-9]/g, (d) => ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'][parseInt(d)]);

// --- SVGs for UI ---
const XIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
);

// --- Story Data ---
type StoryScene = {
    id: string;
    narratorText?: string | ((step: number) => string);
    rumiText?: string | ((step: number) => string);
    rumiAudio?: string | ((step: number) => string);
    renderVisual: (stepIndex: number, setStepIndex: (i: number | ((prev: number) => number)) => void) => React.ReactNode;
};

const SCENES: StoryScene[] = [
    // Scene 1: The Mystery
    {
        id: 's1-mystery',
        rumiText: (step: number) => step === 0 ? "হ্যালো বন্ধুরা! আমি রুমি! আজ আমি তোমাদের ভগ্নাংশের জাদু বুঝতে সাহায্য করব!" : "তোমরা কি প্রস্তুত? চলো এই রহস্যময় বাক্সটা খুলে দেখি ভেতরে কী আছে...",
        rumiAudio: (step: number) => step === 0 ? "/animation/fractions-bangla/b1.mp3" : "/animation/fractions-bangla/b2.mp3",
        renderVisual: (step, setStep) => (
            <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
                <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key="closed-box"
                            initial={{ scale: 0, rotate: -10 }}
                            animate={{ scale: 1, rotate: 0 }}
                            exit={{ scale: 0.8, opacity: 0, y: 50 }}
                            transition={{ type: "spring", bounce: 0.5 }}
                            className={`flex flex-col items-center group relative ${step === 0 ? 'invisible opacity-0' : ''}`}
                        >
                            <span className="text-[12rem] drop-shadow-[0_0_60px_rgba(139,92,246,0.8)] z-10">📦</span>
                            <div className="absolute -bottom-4 bg-slate-800 border-2 border-violet-500 text-white px-4 py-2 rounded-xl shadow-[0_0_20px_rgba(139,92,246,0.4)] text-sm tracking-wider uppercase font-black opacity-0 group-hover:opacity-100 transition-all z-20 whitespace-nowrap">
                                ✨ ম্যাজিক বক্স ✨
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        )
    },
    // Concept 1: What is a fraction? (LIVE PIZZA)
    {
        id: 'c1-what-is',
        rumiText: (step: number) => step === 0 ? "ওয়াও, আস্ত একটা পিৎজা! কিন্তু দাঁড়াও, এটাকে যদি আমরা সমান টুকরো করে কাটি..." : step === 1 ? "সেটাই হলো ভগ্নাংশ! দেখো, দুই ভাগের এক ভাগ হলো অর্ধেক বা এক-দ্বিতীয়াংশ (১/২)।" : step === 2 ? "আবার কাটলে, এটা হয়ে গেল এক-চতুর্থাংশ (১/৪)!" : "৮ টুকরো করলে, প্রতিটা টুকরো হবে পুরোটার এক-অষ্টমাংশ (১/৮)!",
        rumiAudio: (step: number) => step === 0 ? "/animation/fractions-bangla/b3.mp3" : step === 1 ? "/animation/fractions-bangla/b4.mp3" : step === 2 ? "/animation/fractions-bangla/b5.mp3" : "/animation/fractions-bangla/b6.mp3",
        renderVisual: (step, setStep) => {
            const parts = step === 0 ? 1 : step === 1 ? 2 : step === 2 ? 4 : 8;
            return (
                <div className="w-full h-full flex flex-col items-center justify-center space-y-12 pt-40 pb-40">

                    {/* Fraction display */}
                    <motion.div
                        key={parts}
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-4 text-3xl font-black text-white bg-slate-800/80 px-8 py-4 rounded-2xl border border-slate-700 shadow-xl backdrop-blur-md"
                    >
                        <span>এক টুকরো হলো</span>
                        <span className="text-violet-400 bg-violet-400/10 px-4 py-1 rounded-xl font-mono text-4xl border border-violet-400/20 drop-shadow-[0_0_15px_rgba(167,139,250,0.4)]">
                            ১/{toBengaliNum(parts)}
                        </span>
                    </motion.div>

                    {/* Live Physical Pizza */}
                    <div className="relative">
                        {/* Cutting line guides that flash right before a cut */}
                        {step > 0 && (
                            <div className="absolute inset-0 pointer-events-none z-10 flex items-center justify-center">
                                <motion.div
                                    initial={{ scaleX: 0, opacity: 1 }}
                                    animate={{ scaleX: 1, opacity: 0 }}
                                    transition={{ duration: 0.5, ease: "easeOut" }}
                                    className="absolute w-[120%] h-1 bg-white/80 shadow-[0_0_10px_white]"
                                />
                                {parts >= 4 && (
                                    <motion.div
                                        initial={{ scaleY: 0, opacity: 1 }}
                                        animate={{ scaleY: 1, opacity: 0 }}
                                        transition={{ duration: 0.5, ease: "easeOut" }}
                                        className="absolute h-[120%] w-1 bg-white/80 shadow-[0_0_10px_white]"
                                    />
                                )}
                                {parts >= 8 && (
                                    <>
                                        <motion.div
                                            initial={{ scaleX: 0, opacity: 1 }} animate={{ scaleX: 1, opacity: 0 }} transition={{ duration: 0.5 }}
                                            className="absolute w-[120%] h-1 bg-white/80 shadow-[0_0_10px_white] rotate-45"
                                        />
                                        <motion.div
                                            initial={{ scaleX: 0, opacity: 1 }} animate={{ scaleX: 1, opacity: 0 }} transition={{ duration: 0.5 }}
                                            className="absolute w-[120%] h-1 bg-white/80 shadow-[0_0_10px_white] -rotate-45"
                                        />
                                    </>
                                )}
                            </div>
                        )}

                        <LivePizza parts={parts} separated={parts > 1} className="w-64 h-64 z-0" />
                    </div>

                    <button
                        className="px-8 py-3 bg-violet-600 hover:bg-violet-500 text-white rounded-full font-black tracking-wide shadow-[0_0_20px_rgba(124,58,237,0.4)] transition-all uppercase invisible opacity-0"
                        onClick={() => setStep((s) => (s + 1) % 4)}
                    >
                        আবার কাটো! 🗡️
                    </button>
                </div>
            );
        }
    },
    // Concept 3: Comparing Fractions
    {
        id: 'c3-comparing',
        rumiText: (step: number) => step === 0 ? "এখন চলো তুলনা করে দেখি! আমাদের কাছে দুটো খালি গ্লাস আছে। একটা হলো ১/২ এর জন্য, আর অন্যটা ১/৪ এর জন্য।" : step === 1 ? "তোমরা কি জানো কোন গ্লাসটা বেশি ভরবে? ১/২ নাকি ১/৪? চলো জুস ঢেলে দেখে নিই!" : "দেখেছো? নিচের সংখ্যাটা যত ছোট হবে, অংশটা তত বড় হবে! অর্ধেক আসলে এক-চতুর্থাংশের চেয়ে অনেক বেশি!",
        rumiAudio: (step: number) => step === 0 ? "/animation/fractions-bangla/b7.mp3" : step === 1 ? "/animation/fractions-bangla/b8.mp3" : "/animation/fractions-bangla/b9.mp3",
        renderVisual: (step, setStep) => {
            const showBigger = step > 1;

            // Wavy SVG for the top of the juice
            const WavyJuice = ({ height, color }: { height: number, color: string }) => (
                <div className="absolute bottom-0 left-0 right-0 w-full rounded-b-xl overflow-hidden flex flex-col justify-end" style={{ height: `${height}%` }}>
                    <svg className="w-[200%] h-4 shrink-0" viewBox="0 0 100 20" preserveAspectRatio="none" style={{ animation: 'wave 3s linear infinite' }}>
                        <path d="M0 10 Q 12.5 0 25 10 T 50 10 T 75 10 T 100 10 V 20 H 0 Z" fill={color} />
                    </svg>
                    <div className="w-full flex-grow bg-gradient-to-t from-orange-600 to-orange-400" style={{ marginTop: '-1px' }} />
                </div>
            );

            return (
                <div className="w-full h-full flex flex-col items-center justify-center space-y-16 pt-24">
                    <div className="flex justify-center items-end gap-16 h-72 border-b-4 border-slate-700 w-full max-w-2xl px-8 pb-4">

                        {/* 1/2 Glass */}
                        <div className="flex flex-col items-center gap-4">
                            <span className="text-2xl font-black text-orange-400 bg-orange-400/10 px-4 py-2 rounded-lg border border-orange-400/20 font-mono">১ / ২</span>
                            <motion.div
                                className="w-24 border-x-4 border-b-4 border-slate-400/50 rounded-b-xl relative bg-white/5 backdrop-blur-md overflow-hidden shine-effect"
                                initial={{ height: 160, scale: 1 }}
                                animate={{ height: 160, scale: 1 }}
                                transition={{ duration: 0.8, type: "spring" }}
                            >
                                {/* Static Glass markings */}
                                <div className="absolute top-1/2 left-0 w-3 h-0.5 bg-slate-400/50 z-10" />
                                <div className="absolute top-1/4 left-0 w-2 h-0.5 bg-slate-400/30 z-10" />
                                <div className="absolute top-3/4 left-0 w-2 h-0.5 bg-slate-400/30 z-10" />

                                <motion.div
                                    className="absolute bottom-0 left-0 right-0 w-full"
                                    initial={{ height: '0%' }}
                                    animate={{ height: showBigger ? '50%' : '0%' }}
                                    transition={{ duration: 1, type: "spring", bounce: 0.3 }}
                                >
                                    <WavyJuice height={100} color="#f97316" />
                                </motion.div>
                            </motion.div>
                        </div>

                        {/* 1/4 Glass */}
                        <div className="flex flex-col items-center gap-4">
                            <span className="text-2xl font-black text-orange-400 bg-orange-400/10 px-4 py-2 rounded-lg border border-orange-400/20 font-mono">১ / ৪</span>
                            <motion.div
                                className="w-24 border-x-4 border-b-4 border-slate-400/50 rounded-b-xl relative bg-white/5 backdrop-blur-md overflow-hidden shine-effect"
                                initial={{ height: 160, scale: 1 }}
                                animate={{ height: 160, scale: 1 }}
                                transition={{ duration: 0.8, type: "spring" }}
                            >
                                {/* Static Glass markings */}
                                <div className="absolute top-1/2 left-0 w-3 h-0.5 bg-slate-400/50 z-10" />
                                <div className="absolute top-1/4 left-0 w-2 h-0.5 bg-slate-400/30 z-10" />
                                <div className="absolute top-3/4 left-0 w-2 h-0.5 bg-slate-400/30 z-10" />

                                <motion.div
                                    className="absolute bottom-0 left-0 right-0 w-full"
                                    initial={{ height: '0%' }}
                                    animate={{ height: showBigger ? '25%' : '0%' }}
                                    transition={{ duration: 1, type: "spring", bounce: 0.3 }}
                                >
                                    <WavyJuice height={100} color="#f97316" />
                                </motion.div>
                            </motion.div>
                        </div>
                    </div>

                    <div className="h-16 flex items-start justify-center w-full z-10">
                        <AnimatePresence>
                            {showBigger && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.5, y: -20 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.5 }}
                                    className="text-6xl font-black text-white bg-slate-800/90 px-10 py-4 rounded-3xl shadow-[0_0_40px_rgba(249,115,22,0.4)] border-2 border-orange-500/50 backdrop-blur font-mono"
                                >
                                    <span className="text-orange-400">১/২</span> &gt; <span className="text-orange-400">১/৪</span>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <div className="flex gap-4 z-20 mt-4 h-14 items-center justify-center invisible opacity-0">
                        {step === 0 && (
                            <button className="px-8 py-3 bg-blue-500 text-white rounded-full font-black shadow-[0_0_20px_rgba(59,130,246,0.3)] text-lg transition-transform uppercase hover:scale-105 active:scale-95" onClick={() => setStep(1)}>
                                প্রশ্ন করো 🤔
                            </button>
                        )}
                        {step === 1 && (
                            <button className="px-8 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-900 rounded-full font-black shadow-[0_0_20px_rgba(16,185,129,0.3)] text-lg transition-transform uppercase hover:scale-105 active:scale-95" onClick={() => setStep(2)}>
                                জুস ঢালো! 🧃
                            </button>
                        )}
                        {step === 2 && (
                            <button className="px-8 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-full font-bold shadow-md text-lg transition-colors uppercase" onClick={() => setStep(0)}>
                                রিসেট 🔄
                            </button>
                        )}
                    </div>
                </div>
            );
        }
    },
    // Concept 5: Diving / Sharing (LIVE CHOCOLATE)
    {
        id: 'c5-sharing',
        rumiText: (step: number) => step === 0 ? "এবার হলো চূড়ান্ত পরীক্ষা! আমার কাছে একটা বড় চকলেট বার আছে..." : step === 1 ? "আর এটা আমাকে আমার ৬ জন কাজিনের মাঝে সমানভাবে ভাগ করতে হবে! চলো এটাকে ভেঙে নিই।" : step === 2 ? "একটা তোমার জন্য, একটা তোমার জন্য... এভাবেই সবার মাঝে ভাগ করে দিচ্ছি!" : step === 3 ? "তোমরা কি অনুমান করতে পারো, প্রত্যেক কাজিন চকলেটের কত ভগ্নাংশ পেল?" : "ইয়ে! প্রত্যেক কাজিন ৬ টুকরোর ঠিক ১ টুকরো পেয়েছে... অর্থাৎ এক-ষষ্ঠাংশ (১/৬)!",
        rumiAudio: (step: number) => step === 0 ? "/animation/fractions-bangla/b10.mp3" : step === 1 ? "/animation/fractions-bangla/b11.mp3" : step === 2 ? "/animation/fractions-bangla/b12.mp3" : step === 3 ? "/animation/fractions-bangla/b13.mp3" : "/animation/fractions-bangla/b14.mp3",
        renderVisual: (step, setStep) => {
            const showCousins = step >= 1;
            const chocolatesDistributed = step >= 2;
            const showAnswer = step >= 4;

            const flownPieces = chocolatesDistributed ? [0, 1, 2, 3, 4, 5] : [];

            return (
                <div className="w-full h-full flex flex-col items-center justify-center space-y-6">

                    <AnimatePresence mode="popLayout">
                        {/* The Chocolate Bar */}
                        <motion.div
                            key="choc"
                            initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.5, opacity: 0 }}
                            className="relative z-10 p-4 rounded-3xl bg-slate-800/50 border border-slate-700 shadow-2xl backdrop-blur mt-2"
                        >
                            <LiveChocolate flownPieces={flownPieces} className="w-[150px] h-[100px]" />
                        </motion.div>
                    </AnimatePresence>

                    {/* Friends Receiving Chocolates */}
                    <div className="h-40 w-full flex items-center justify-center">
                        {showCousins && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                                className="w-full max-w-4xl flex flex-wrap justify-center gap-6 px-4"
                            >
                                {['👶🏽', '👦🏻', '👧🏾', '🧒🏼', '👦🏿', '👧🏽'].map((emoji, kidId) => (
                                    <div key={kidId} className="flex flex-col items-center gap-2 relative">
                                        {/* Avatar */}
                                        <div className="w-16 h-16 bg-slate-700 border-2 border-slate-600 rounded-full flex items-center justify-center text-3xl shadow-lg relative overflow-visible">
                                            <span className="relative z-10">{emoji}</span>
                                            {/* Received chocolates drop in here */}
                                            {chocolatesDistributed && (
                                                <motion.div
                                                    initial={{ y: -50, opacity: 0 }}
                                                    animate={{ y: 0, opacity: 1 }}
                                                    transition={{ delay: 0.2 + (kidId * 0.1), type: 'spring' }}
                                                    className="absolute -bottom-2 -right-2 drop-shadow-lg z-20 flex items-center justify-center"
                                                >
                                                    <svg width="24" height="24" viewBox="0 0 56 56">
                                                        <rect width="56" height="56" rx="6" fill="#78350f" stroke="#451a03" strokeWidth="2" />
                                                        <rect x="6" y="6" width="44" height="44" rx="4" fill="#92400e" />
                                                    </svg>
                                                </motion.div>
                                            )}
                                        </div>
                                        <div className="h-8 mt-2">
                                            {showAnswer && (
                                                <motion.div initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: kidId * 0.1, type: "spring" }}>
                                                    <span className="bg-slate-800 text-emerald-400 font-bold px-4 py-1.5 rounded-full text-base border border-emerald-400/20 font-mono drop-shadow-[0_0_10px_rgba(16,185,129,0.3)]">১ / ৬</span>
                                                </motion.div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </motion.div>
                        )}
                    </div>

                    <div className="h-14 flex items-center justify-center invisible opacity-0">
                        {step < 4 && (
                            <button
                                className="px-8 py-3 bg-rose-500 hover:bg-rose-400 text-white rounded-full font-black shadow-[0_0_20px_rgba(244,63,94,0.4)] text-lg transition-transform hover:scale-105 active:scale-95 uppercase tracking-wide border border-rose-400 z-20"
                                onClick={() => setStep(step + 1)}
                            >
                                {step === 0 ? "কাজিনদের দেখাও 👶" : step === 1 ? "ভাঙো এবং ভাগ করো! 🍫" : step === 2 ? "প্রশ্ন করো 🤔" : "কত ভগ্নাংশ? 💡"}
                            </button>
                        )}
                        {step === 4 && (
                            <button className="px-6 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-full font-bold shadow-md text-sm transition-colors uppercase z-20" onClick={() => setStep(0)}>
                                সিন রিসেট করো
                            </button>
                        )}
                    </div>
                </div>
            );
        }
    },
    // Ending
    {
        id: 'end',
        rumiText: "দারুণ করেছ! মনে রেখো, ভগ্নাংশ হলো কোনো কিছুর সমান কয়েকটা অংশ মাত্র! তোমরা সবাই এখন ভগ্নাংশের মাস্টার!",
        rumiAudio: (step: number) => "/animation/fractions-bangla/b15.mp3",
        renderVisual: (step, setStep) => {
            return (
                <div className="w-full h-full flex flex-col items-center justify-center">
                    <motion.div initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', bounce: 0.5, duration: 1 }} className="flex flex-col items-center gap-8">
                        <div className="text-[12rem] drop-shadow-[0_0_60px_rgba(251,191,36,0.6)]">🏆</div>
                        <h2 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-amber-400 to-orange-500 px-8 py-4 uppercase tracking-tighter">
                            ফ্র্যাকশন মাস্টার!
                        </h2>
                    </motion.div>
                </div>
            );
        }
    }
];


const FractionStoryVideoPageBengali: React.FC = () => {
    const navigate = useNavigate();
    const [sceneIndex, setSceneIndex] = useState(0);
    const [stepIndex, setStepIndex] = useState(0); // For intra-scene state
    const [hasStarted, setHasStarted] = useState(false);
    const [isStarting, setIsStarting] = useState(false);

    const scene = SCENES[sceneIndex];
    const rumiAudioRef = React.useRef<HTMLAudioElement | null>(null);
    const bgAudioRef = React.useRef<HTMLAudioElement | null>(null);

    const currentRumiAudio = typeof scene.rumiAudio === 'function' ? scene.rumiAudio(stepIndex) : scene.rumiAudio;

    React.useEffect(() => {
        let timeoutId: NodeJS.Timeout;

        if (currentRumiAudio && hasStarted) {
            if (rumiAudioRef.current) {
                rumiAudioRef.current.pause();
                rumiAudioRef.current.currentTime = 0;
            }
            const newAudio = new Audio(currentRumiAudio);

            // Expose audio state to DOM for the browser subagent video recorder
            const setPlayingTrue = () => document.body.setAttribute('data-audio-playing', 'true');
            const setPlayingFalse = () => document.body.setAttribute('data-audio-playing', 'false');

            newAudio.addEventListener('play', setPlayingTrue);
            newAudio.addEventListener('pause', setPlayingFalse);
            newAudio.addEventListener('ended', setPlayingFalse);

            rumiAudioRef.current = newAudio;

            timeoutId = setTimeout(() => {
                if (rumiAudioRef.current) {
                    rumiAudioRef.current.play().catch(e => {
                        console.log("Audio play prevented:", e);
                        setPlayingFalse();
                    });
                }
            }, 200);
        }

        return () => {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
        };
    }, [currentRumiAudio, hasStarted]);

    React.useEffect(() => {
        return () => {
            if (rumiAudioRef.current) {
                rumiAudioRef.current.pause();
                document.body.setAttribute('data-audio-playing', 'false');
            }
        };
    }, []);

    React.useEffect(() => {
        const bgAudio = new Audio('/animation/fractions/bg.mp3');
        bgAudio.loop = true;
        bgAudio.volume = 0.3;
        bgAudioRef.current = bgAudio;

        if (hasStarted) {
            bgAudio.play().catch(e => console.log("BG Audio play prevented:", e));
        }

        return () => {
            bgAudio.pause();
            bgAudio.currentTime = 0;
        };
    }, [hasStarted]);

    const prevScene = React.useCallback(() => {
        if (sceneIndex > 0) {
            setSceneIndex(sceneIndex - 1);
            setStepIndex(0);
        }
    }, [sceneIndex]);

    const nextScene = React.useCallback(() => {
        if (sceneIndex < SCENES.length - 1) {
            setSceneIndex(sceneIndex + 1);
            setStepIndex(0);
        }
    }, [sceneIndex]);

    const handleNextAction = React.useCallback(() => {
        const scene = SCENES[sceneIndex];
        if (scene.id === 's1-mystery') {
            if (stepIndex === 0) setStepIndex(1);
            else nextScene();
        } else if (scene.id === 'c1-what-is') {
            if (stepIndex < 3) setStepIndex(stepIndex + 1);
            else nextScene();
        } else if (scene.id === 'c3-comparing') {
            if (stepIndex < 2) setStepIndex(stepIndex + 1);
            else nextScene();
        } else if (scene.id === 'c5-sharing') {
            if (stepIndex < 4) setStepIndex(stepIndex + 1);
            else nextScene();
        } else {
            nextScene();
        }
    }, [sceneIndex, stepIndex, nextScene]);

    React.useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.code === 'Space' || e.code === 'ArrowRight') {
                e.preventDefault();
                handleNextAction();
            } else if (e.code === 'ArrowLeft') {
                e.preventDefault();
                prevScene();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleNextAction, prevScene]);

    const currentRumiText = scene.rumiText ? (typeof scene.rumiText === 'function' ? scene.rumiText(stepIndex) : scene.rumiText) : null;
    const currentNarratorText = scene.narratorText ? (typeof scene.narratorText === 'function' ? scene.narratorText(stepIndex) : scene.narratorText) : null;

    const customFontStyle = (
        <style>{`
            @font-face {
                font-family: 'CustomBangla';
                src: url('/animation/fractions-bangla/font2.ttf') format('truetype');
            }
            .bangla-wrapper * {
                font-family: 'CustomBangla', ui-sans-serif, system-ui, sans-serif !important;
            }
        `}</style>
    );

    if (!hasStarted) {
        return (
            <div className="w-screen h-screen bg-[#0f172a] flex items-center justify-center p-2 relative overflow-hidden font-sans bangla-wrapper">
                {customFontStyle}
                <button
                    className="px-10 py-5 bg-violet-600 hover:bg-violet-500 text-white rounded-full font-black text-2xl tracking-wide shadow-[0_0_30px_rgba(124,58,237,0.5)] transition-all uppercase"
                    onClick={() => {
                        setIsStarting(true);
                        setTimeout(() => setHasStarted(true), 1000);
                    }}
                    disabled={isStarting}
                >
                    {isStarting ? "শুরু হচ্ছে..." : "অ্যানিমেশন শুরু করুন"}
                </button>
            </div>
        );
    }

    return (
        <div className="w-screen h-screen bg-[#0f172a] flex items-center justify-center p-2 relative overflow-hidden font-sans bangla-wrapper">
            {customFontStyle}

            {/* Background decoration */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
                <div className="absolute top-10 left-10 text-9xl">➕</div>
                <div className="absolute bottom-20 right-20 text-9xl">➗</div>
                <div className="absolute top-1/2 right-1/4 text-8xl">➖</div>
                <div className="absolute bottom-10 left-1/4 text-8xl">✖️</div>
            </div>

            <div className="w-full max-w-6xl h-full max-h-[90vh] bg-[#1e293b] rounded-[2rem] shadow-[0_0_80px_rgba(0,0,0,0.8)] border border-slate-700/50 flex flex-col overflow-hidden relative z-10 mx-auto">

                {/* Header (Platform matched) */}
                <div className="h-16 bg-slate-900/50 border-b border-slate-800 flex items-center justify-between px-8 shrink-0 backdrop-blur-sm z-20">
                    <div className="flex items-center gap-3">
                        <div className="w-2.5 h-6 bg-violet-500 rounded-full"></div>
                        <h1 className="text-xl font-black text-white tracking-tight uppercase">অ্যানিমেটেড গল্প: ভগ্নাংশ</h1>
                    </div>
                    <div className="flex gap-4 items-center">
                        <span className="text-slate-400 font-bold text-xs uppercase tracking-widest">সিন {toBengaliNum(sceneIndex + 1)} এর {toBengaliNum(SCENES.length)}</span>
                        <button onClick={() => navigate('/dashboard')} className="text-slate-400 hover:text-white transition-colors bg-slate-800 hover:bg-slate-700 p-2 rounded-full border border-slate-700">
                            <XIcon />
                        </button>
                    </div>
                </div>

                {/* Main Content Area (Unpartitioned Stage) */}
                <div className="flex-grow relative bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-800 via-slate-900 to-slate-900 overflow-hidden shadow-inner isolate flex items-center justify-center">

                    {/* Glow effect in center */}
                    <div className="absolute inset-0 bg-violet-600/5 blur-[120px] rounded-full mix-blend-screen pointer-events-none" />

                    {/* Rumi Character & Speech Cloud - Animated Position */}
                    <AnimatePresence>
                        <motion.div
                            className="absolute bottom-24 z-40 flex flex-col justify-end items-center pointer-events-auto cursor-pointer"
                            initial={false}
                            animate={{
                                left: sceneIndex === 0 && stepIndex === 0 ? '50%' : '25%',
                                x: '-50%',
                                scale: sceneIndex === 0 && stepIndex === 0 ? 1.2 : 1,
                            }}
                            transition={{ type: "spring", stiffness: 80, damping: 15 }}
                            onClick={() => {
                                if (sceneIndex === 0 && stepIndex === 0) setStepIndex(1);
                            }}
                        >
                            {/* Animated Speech Cloud */}
                            <div className="absolute bottom-[100%] mb-4 w-[350px]">
                                <AnimatePresence mode="wait">
                                    {currentRumiText && (
                                        <motion.div
                                            key={`rumi-speech-${currentRumiText}`}
                                            initial={{ opacity: 0, scale: 0.8, y: 20 }}
                                            animate={{ opacity: 1, scale: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.9, y: 10 }}
                                            transition={{ type: "spring", stiffness: 200, damping: 20 }}
                                            className="relative bg-white text-slate-800 p-6 rounded-[2rem] shadow-2xl border-4 border-slate-100"
                                        >
                                            {/* Cloud bumps */}
                                            <div className="absolute -top-4 left-6 w-10 h-10 bg-white rounded-full -z-10"></div>
                                            <div className="absolute -top-6 right-8 w-14 h-14 bg-white rounded-full -z-10"></div>
                                            <div className="absolute -left-2 top-8 w-8 h-8 bg-white rounded-full -z-10"></div>

                                            {/* Cloud tail pointing down to Rumi */}
                                            <svg className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-12 h-12 text-white drop-shadow-lg" viewBox="0 0 40 40">
                                                <path d="M 0 0 Q 20 20 40 40 Q 30 10 20 0 Z" fill="currentColor" />
                                            </svg>

                                            <p className="font-bold text-lg leading-snug relative z-10 text-center">
                                                {currentRumiText}
                                            </p>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Rumi Avatar */}
                            <img
                                src="/rumi.gif"
                                alt="Rumi"
                                className="h-[280px] w-auto object-contain drop-shadow-[0_0_20px_rgba(0,0,0,0.5)] transform translate-y-4"
                            />
                        </motion.div>
                    </AnimatePresence>

                    {/* Interactive Visuals */}
                    <div
                        className="absolute inset-0 z-10 transition-all duration-1000 ease-in-out"
                        style={{
                            left: sceneIndex === 0 && stepIndex === 0 ? '0%' : '40%',
                            opacity: sceneIndex === 0 && stepIndex === 0 ? 0 : 1,
                            pointerEvents: sceneIndex === 0 && stepIndex === 0 ? 'none' : 'auto'
                        }}
                    >
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={scene.id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 1.05 }}
                                transition={{ duration: 0.5, ease: 'easeInOut' }}
                                className="absolute inset-0 flex items-center justify-center p-8"
                            >
                                {scene.renderVisual(stepIndex, setStepIndex)}
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Navigation Controls floating bottom right of Stage */}
                    <div className="absolute bottom-8 right-8 z-30 flex items-center gap-4 bg-slate-900/80 p-3 rounded-full backdrop-blur border border-slate-700 shadow-xl invisible opacity-0">
                        <button
                            onClick={prevScene}
                            disabled={sceneIndex === 0}
                            className="w-10 h-10 flex items-center justify-center bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-full font-bold border border-slate-600 shadow disabled:opacity-30 transition-all group"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                        </button>

                        {/* Progress Indicators */}
                        <div className="flex gap-1.5 px-2">
                            {SCENES.map((_, i) => (
                                <div key={i} className={`w-1.5 h-1.5 rounded-full ${i === sceneIndex ? 'bg-violet-400 w-4 shadow-[0_0_8px_rgba(167,139,250,0.8)]' : 'bg-slate-600'} transition-all duration-300`} />
                            ))}
                        </div>

                        <button
                            onClick={nextScene}
                            disabled={sceneIndex === SCENES.length - 1}
                            className="px-5 py-2 flex items-center gap-2 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white rounded-full font-black shadow-[0_0_15px_rgba(139,92,246,0.4)] disabled:opacity-30 transition-all text-xs tracking-widest uppercase border border-white/10 group"
                        >
                            পরবর্তী
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                        </button>
                    </div>

                </div>
            </div>

        </div>
    );
};

export default FractionStoryVideoPageBengali;
