
import React from 'react';
import { Link } from 'react-router-dom';

const Resources: React.FC = () => {
    return (
        <div className="space-y-12 pb-20 max-w-7xl mx-auto animate-fadeIn">
            {/* Header */}
            <header className="relative tile p-8 md:p-12 overflow-hidden border-[#7c3aed]/30 bg-gradient-to-br from-[#0f172a] via-[#0f172a] to-[#7c3aed]/5 rounded-[2.5rem]">
                <div className="absolute top-0 right-0 p-8 opacity-5 text-[#7c3aed] pointer-events-none transform rotate-12">
                    <svg className="w-48 h-48" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                </div>
                <div className="relative z-10 text-center md:text-left">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white uppercase tracking-tighter mb-4 leading-none">
                        INTERACTIVE <span className="text-[#7c3aed]">RESOURCES</span>
                    </h1>
                    <p className="text-white/40 max-w-3xl mx-auto md:mx-0 text-lg md:text-xl font-serif italic border-l-0 md:border-l-4 border-[#7c3aed]/20 md:pl-6">
                        Dive into our curated collection of immersive stories and interactive simulations designed to make learning alive.
                    </p>
                </div>
            </header>

            {/* Interactive Library Section */}
            <section className="w-full mt-10">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <div className="w-2.5 h-8 bg-[#7c3aed] rounded-full shadow-[0_0_10px_#7c3aed]"></div>
                        <h2 className="text-3xl font-black uppercase tracking-tighter text-white [html[data-theme='light']_&]:text-[#0F172A]">
                            Interactive Library
                        </h2>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {/* Lily's Story */}
                    <Link
                        to="/lilys-story"
                        target="_blank"
                        className="group block p-6 rounded-[2.5rem] border border-white/5 bg-[#0f172a] shadow-2xl hover:border-violet-500/40 hover:-translate-y-1 transition-all duration-500 [html[data-theme='light']_&]:bg-white [html[data-theme='light']_&]:border-slate-200"
                    >
                        <div className="w-full h-44 rounded-3xl bg-gradient-to-br from-amber-400 via-orange-500 to-rose-500 flex items-center justify-center mb-6 shadow-lg relative overflow-hidden group-hover:scale-[1.02] transition-transform duration-500">
                            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
                            <svg className="w-20 h-20 text-white relative z-10 drop-shadow-2xl" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                            <span className="absolute top-4 right-4 text-[0.6rem] font-black uppercase px-3 py-1 rounded-full bg-white/20 text-white backdrop-blur-md tracking-wider border border-white/10">Interactive</span>
                        </div>
                        <div className="space-y-3">
                            <div className="flex items-start justify-between gap-2">
                                <h3 className="text-xl font-black uppercase tracking-tight text-white group-hover:text-violet-400 transition-colors [html[data-theme='light']_&]:text-slate-800">Lily's Story</h3>
                                <svg className="w-5 h-5 text-white/20 group-hover:text-violet-400 group-hover:translate-x-1 transition-all shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                            </div>
                            <p className="text-sm text-white/40 leading-relaxed font-serif italic [html[data-theme='light']_&]:text-slate-500">An immersive interactive story about courage, intelligence, and thinking outside the box.</p>
                            <div className="flex items-center gap-3 pt-3 border-t border-white/5 [html[data-theme='light']_&]:border-slate-100">
                                <span className="text-[0.6rem] font-black px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 uppercase tracking-widest border border-emerald-500/20">Published</span>
                            </div>
                        </div>
                    </Link>

                    {/* Ant and Grasshopper */}
                    <Link
                        to="/the-ant-and-the-grasshopper"
                        target="_blank"
                        className="group block p-6 rounded-[2.5rem] border border-white/5 bg-[#0f172a] shadow-2xl hover:border-emerald-500/40 hover:-translate-y-1 transition-all duration-500 [html[data-theme='light']_&]:bg-white [html[data-theme='light']_&]:border-slate-200"
                    >
                        <div className="w-full h-44 rounded-3xl bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-500 flex items-center justify-center mb-6 shadow-lg relative overflow-hidden group-hover:scale-[1.02] transition-transform duration-500">
                            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
                            <svg className="w-20 h-20 text-white relative z-10 drop-shadow-2xl" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                            <span className="absolute top-4 right-4 text-[0.6rem] font-black uppercase px-3 py-1 rounded-full bg-white/20 text-white backdrop-blur-md tracking-wider border border-white/10">Interactive</span>
                        </div>
                        <div className="space-y-3">
                            <div className="flex items-start justify-between gap-2">
                                <h3 className="text-xl font-black uppercase tracking-tight text-white group-hover:text-emerald-400 transition-colors [html[data-theme='light']_&]:text-slate-800">The Ant & Grasshopper</h3>
                                <svg className="w-5 h-5 text-white/20 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                            </div>
                            <p className="text-sm text-white/40 leading-relaxed font-serif italic [html[data-theme='light']_&]:text-slate-500">A classic fable about the importance of hard work and planning for the future.</p>
                            <div className="flex items-center gap-3 pt-3 border-t border-white/5 [html[data-theme='light']_&]:border-slate-100">
                                <span className="text-[0.6rem] font-black px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 uppercase tracking-widest border border-emerald-500/20">New Content</span>
                            </div>
                        </div>
                    </Link>
                </div>
            </section>

            {/* Interactive Simulations Section */}
            <section className="w-full mt-24">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <div className="w-2.5 h-8 bg-orange-500 rounded-full shadow-[0_0_10px_#f97316]"></div>
                        <h2 className="text-3xl font-black uppercase tracking-tighter text-white [html[data-theme='light']_&]:text-[#0F172A]">
                            Interactive Simulations
                        </h2>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {/* Fraction Addition Lab */}
                    <Link
                        to="/simulation/fraction-addition"
                        className="group block p-6 rounded-[2.5rem] border border-white/5 bg-[#0f172a] shadow-2xl hover:border-orange-500/40 hover:-translate-y-1 transition-all duration-500 [html[data-theme='light']_&]:bg-white [html[data-theme='light']_&]:border-slate-200"
                    >
                        <div className="w-full h-44 rounded-3xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center mb-6 shadow-lg relative overflow-hidden group-hover:scale-[1.02] transition-transform duration-500">
                            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
                            <svg className="w-20 h-20 text-white relative z-10 drop-shadow-2xl" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                            <span className="absolute top-4 right-4 text-[0.6rem] font-black uppercase px-3 py-1 rounded-full bg-orange-500 text-white shadow-lg tracking-wider border border-orange-400/20">Math Lab</span>
                        </div>
                        <div className="space-y-3">
                            <div className="flex items-start justify-between gap-2">
                                <h3 className="text-xl font-black uppercase tracking-tight text-white group-hover:text-orange-400 transition-colors [html[data-theme='light']_&]:text-slate-800">Fraction Addition Lab</h3>
                                <svg className="w-5 h-5 text-white/20 group-hover:text-orange-400 group-hover:translate-x-1 transition-all shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                            </div>
                            <p className="text-sm text-white/40 leading-relaxed font-serif italic [html[data-theme='light']_&]:text-slate-500">Visualize and solve fraction addition problems with interactive visual models.</p>
                            <div className="flex items-center gap-3 pt-3 border-t border-white/5 [html[data-theme='light']_&]:border-slate-100">
                                <span className="text-[0.6rem] font-black px-2.5 py-1 rounded-full bg-orange-500/10 text-orange-400 uppercase tracking-widest border border-orange-500/20">Beta</span>
                            </div>
                        </div>
                    </Link>

                    {/* Fraction Story */}
                    <Link
                        to="/fraction-story"
                        className="group block p-6 rounded-[2.5rem] border border-white/5 bg-[#0f172a] shadow-2xl hover:border-yellow-500/40 hover:-translate-y-1 transition-all duration-500 [html[data-theme='light']_&]:bg-white [html[data-theme='light']_&]:border-slate-200"
                    >
                        <div className="w-full h-44 rounded-3xl bg-gradient-to-br from-yellow-400 via-amber-500 to-orange-500 flex items-center justify-center mb-6 shadow-lg relative overflow-hidden group-hover:scale-[1.02] transition-transform duration-500">
                            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
                            <div className="text-7xl relative z-10 drop-shadow-2xl">🍕</div>
                            <span className="absolute top-4 right-4 text-[0.6rem] font-black uppercase px-3 py-1 rounded-full bg-yellow-500 text-white shadow-lg tracking-wider border border-yellow-400/20">Animated Story</span>
                        </div>
                        <div className="space-y-3">
                            <div className="flex items-start justify-between gap-2">
                                <h3 className="text-xl font-black uppercase tracking-tight text-white group-hover:text-yellow-400 transition-colors [html[data-theme='light']_&]:text-slate-800">Fraction Story</h3>
                                <svg className="w-5 h-5 text-white/20 group-hover:text-yellow-400 group-hover:translate-x-1 transition-all shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                            </div>
                            <p className="text-sm text-white/40 leading-relaxed font-serif italic [html[data-theme='light']_&]:text-slate-500">An interactive, guided story introducing fractions with real-world examples.</p>
                            <div className="flex items-center gap-3 pt-3 border-t border-white/5 [html[data-theme='light']_&]:border-slate-100">
                                <span className="text-[0.6rem] font-black px-2.5 py-1 rounded-full bg-yellow-500/10 text-yellow-400 uppercase tracking-widest border border-yellow-500/20">New Release</span>
                            </div>
                        </div>
                    </Link>

                    {/* Teaching Aid Animation */}
                    <Link
                        to="/teaching-aid-animation"
                        className="group block p-6 rounded-[2.5rem] border border-white/5 bg-[#0f172a] shadow-2xl hover:border-violet-500/40 hover:-translate-y-1 transition-all duration-500 [html[data-theme='light']_&]:bg-white [html[data-theme='light']_&]:border-slate-200"
                    >
                        <div className="w-full h-44 rounded-3xl bg-gradient-to-br from-violet-400 via-purple-500 to-fuchsia-500 flex items-center justify-center mb-6 shadow-lg relative overflow-hidden group-hover:scale-[1.02] transition-transform duration-500">
                            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
                            <svg className="w-20 h-20 text-white relative z-10 drop-shadow-2xl" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="absolute top-4 right-4 text-[0.6rem] font-black uppercase px-3 py-1 rounded-full bg-violet-500 text-white shadow-lg tracking-wider border border-violet-400/20">Strategy Demo</span>
                        </div>
                        <div className="space-y-3">
                            <div className="flex items-start justify-between gap-2">
                                <h3 className="text-xl font-black uppercase tracking-tight text-white group-hover:text-violet-400 transition-colors [html[data-theme='light']_&]:text-slate-800">Teaching Aid</h3>
                                <svg className="w-5 h-5 text-white/20 group-hover:text-violet-400 group-hover:translate-x-1 transition-all shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                            </div>
                            <p className="text-sm text-white/40 leading-relaxed font-serif italic [html[data-theme='light']_&]:text-slate-500">Interactive animation demonstrating how to use cutouts to teach concepts.</p>
                            <div className="flex items-center gap-3 pt-3 border-t border-white/5 [html[data-theme='light']_&]:border-slate-100">
                                <span className="text-[0.6rem] font-black px-2.5 py-1 rounded-full bg-violet-500/10 text-violet-400 uppercase tracking-widest border border-violet-500/20">Interactive Aid</span>
                            </div>
                        </div>
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default Resources;
