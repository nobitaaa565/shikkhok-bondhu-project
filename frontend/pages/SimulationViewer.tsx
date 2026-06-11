
import React, { useEffect, useRef, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import FractionSimulation from '../components/Simulations/FractionSimulation';

const SimulationViewer: React.FC = () => {
    const { simId } = useParams<{ simId: string }>();
    const [isFullscreen, setIsFullscreen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    const renderSimulation = () => {
        switch (simId) {
            case 'fraction-addition':
                return <FractionSimulation />;
            default:
                return (
                    <div className="text-center space-y-4">
                        <div className="w-20 h-20 rounded-full bg-violet-500/10 border-2 border-dashed border-violet-500/30 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-500">
                            <svg className="w-10 h-10 text-violet-400 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                            </svg>
                        </div>
                        <h2 className="text-xl font-black uppercase tracking-widest text-white/20">Simulation Not Found</h2>
                        <p className="text-white/10 text-xs uppercase tracking-tighter">Please select a valid experimental module</p>
                    </div>
                );
        }
    };

    // Native fullscreen on the wrapper element — same as storybook
    const toggleFullscreen = () => {
        const elem = wrapperRef.current;
        if (!elem) return;

        if (!document.fullscreenElement) {
            elem.requestFullscreen().catch(err => {
                console.error(`Fullscreen error: ${err.message}`);
            });
        } else {
            document.exitFullscreen();
        }
    };

    // State driven by the browser's fullscreenchange event — same as storybook
    useEffect(() => {
        const handleFsChange = () => setIsFullscreen(!!document.fullscreenElement);
        document.addEventListener('fullscreenchange', handleFsChange);
        return () => document.removeEventListener('fullscreenchange', handleFsChange);
    }, []);

    return (
        <div
            ref={wrapperRef}
            className="min-h-screen bg-[#0f172a] text-white flex flex-col items-center justify-start p-4 pt-8 relative"
        >
            {/* Fullscreen: floating X exit button (top-right) */}
            {isFullscreen && (
                <button
                    onClick={toggleFullscreen}
                    title="Exit Fullscreen"
                    className="fixed top-6 right-6 p-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all opacity-40 hover:opacity-100 z-[100]"
                >
                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            )}

            {/* Fullscreen: centered "Fraction" title at top */}
            {isFullscreen && (
                <div className="absolute top-6 left-0 w-full flex justify-center z-[90] pointer-events-none">
                    <h2 className="text-4xl font-black uppercase tracking-[0.4em] hero-text-gradient opacity-70">
                        Fraction
                    </h2>
                </div>
            )}

            {/* Normal mode: full header */}
            {!isFullscreen && (
                <header className="w-full max-w-6xl flex justify-between items-center mb-8 z-10">
                    <div>
                        <h1 className="text-3xl font-black uppercase tracking-tighter hero-text-gradient">
                            Interactive Simulation: {simId?.replace(/-/g, ' ')}
                        </h1>
                        <p className="text-white/40 text-xs uppercase font-semibold mt-1">Experimental Learning Module</p>
                    </div>
                    <div className="flex gap-4">
                        <button
                            onClick={toggleFullscreen}
                            className="px-6 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-black uppercase hover:bg-white/10 transition-all"
                        >
                            Enter Fullscreen
                        </button>
                        <Link
                            to="/dashboard"
                            className="px-6 py-2 rounded-xl bg-[#7c3aed] text-xs font-black uppercase hover:opacity-90 transition-all"
                        >
                            Back to Dashboard
                        </Link>
                    </div>
                </header>
            )}

            {/* Simulation content */}
            <main className={`w-full max-w-6xl relative flex flex-col items-center justify-start ${isFullscreen ? 'pt-20 !max-w-none h-screen overflow-hidden' : 'pt-0 pb-8 px-4 flex-1'}`}>
                {renderSimulation()}

                {/* Visual Grid Background */}
                <div className="absolute inset-0 pointer-events-none opacity-5 bg-[radial-gradient(#7c3aed_1px,transparent_1px)] [background-size:32px_32px]"></div>
            </main>

            {/* Normal mode: footer */}
            {!isFullscreen && (
                <footer className="mt-8 text-white/20 text-[0.6rem] uppercase font-black tracking-[0.2em] z-10">
                    Powered by Shikkhok Bondhu Engine • v1.0.0
                </footer>
            )}

            <style>{`
                .hero-text-gradient {
                    background: linear-gradient(135deg, #fff 0%, #94a3b8 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }
            `}</style>
        </div>
    );
};

export default SimulationViewer;
