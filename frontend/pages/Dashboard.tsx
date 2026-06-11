
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const stats = [
    {
      label: 'Total Resources',
      value: '1,284',
      change: '+12%',
      icon: (
        <svg className="w-8 h-8 text-[var(--amethyst-focus)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      )
    },
    {
      label: 'Total Downloads',
      value: '15.2k',
      change: '+8.5%',
      icon: (
        <svg className="w-8 h-8 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
      )
    },
    {
      label: 'Hours Saved',
      value: '42h',
      change: '-8h',
      icon: (
        <svg className="w-8 h-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      label: 'Avg. Rating',
      value: '4.9',
      change: '+0.2',
      icon: (
        <svg className="w-8 h-8 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 01-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
      )
    },
  ];

  const recentUploads = [
    {
      title: 'Fractions Basics',
      type: 'Presentation',
      date: 'Oct 24, 2024',
      status: 'Published',
      stats: { views: 245, downloads: 12 }
    },
    {
      title: 'Multiplication Tables',
      type: 'Worksheet',
      date: 'Scheduled: Oct 28',
      status: 'Scheduled',
      remaining: '2d 4h',
      stats: { views: 0, downloads: 0 }
    },
    {
      title: 'Addition & Subtraction',
      type: 'Quiz',
      date: 'Oct 20, 2024',
      status: 'Published',
      stats: { views: 890, downloads: 45 }
    },
  ];

  const getMaterialIcon = (type: string) => {
    switch (type) {
      case 'Presentation': return (
        <svg className="w-5 h-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      );
      case 'Worksheet': return (
        <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      );
      default: return (
        <svg className="w-5 h-5 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
    }
  };

  return (
    <div className="space-y-16 relative">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black hero-text-gradient uppercase tracking-tighter">Welcome back, Zannatul Ferdushie</h1>
          <p className="text-white/40 text-xs mt-2 uppercase font-semibold">
            Dashboard Overview • {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </p>
        </div>
      </header>

      {/* Stats Grid - 2x2 on Mobile */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="tile p-4 md:p-6 group cursor-pointer border-l-2 md:border-l-4 border-l-[var(--amethyst-focus)]">
            <div className="flex justify-between items-start mb-2 md:mb-4">
              <span className="text-xl md:text-2xl [&>svg]:w-6 [&>svg]:h-6 md:[&>svg]:w-8 md:[&>svg]:h-8">{stat.icon}</span>
              <span className={`text-[0.625rem] md:text-xs font-black px-1.5 py-0.5 md:px-2 md:py-1 rounded ${stat.change.startsWith('+') ? 'bg-emerald-500/10 text-emerald-400' : 'bg-[var(--amethyst-deep)] text-[var(--amethyst-focus)] [html[data-theme="light"]_&]:!bg-[#7c3aed]/50 [html[data-theme="light"]_&]:!text-[#2e1065]'}`}>
                {stat.change}
              </span>
            </div>
            <div className="stat-number text-xl md:text-3xl mb-1 font-black">{stat.value}</div>
            <div className="text-[0.625rem] md:text-xs text-white/40 uppercase font-black truncate">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-20">

        {/* Recent Uploads Section */}
        <div className="lg:col-span-2 space-y-6">
          {/* Headword */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-2.5 h-8 bg-[#7c3aed] rounded-full"></div>
              <h2 className="text-2xl font-black uppercase tracking-tighter text-white [html[data-theme='light']_&]:text-[#0F172A]">
                My Recent Uploads
              </h2>
            </div>
          </div>

          {/* Big Container */}
          <div className="p-8 rounded-3xl border border-white/5 bg-[#0f172a] shadow-2xl [html[data-theme='light']_&]:bg-white [html[data-theme='light']_&]:border-slate-200">
            <div className="grid grid-cols-1 gap-4">
              {recentUploads.map((item, i) => (
                <div
                  key={i}
                  className="p-5 rounded-2xl bg-[#1e293b] border border-white/5 hover:border-[var(--amethyst-focus)]/50 transition-all group flex flex-col md:flex-row items-start md:items-center justify-between gap-4 [html[data-theme='light']_&]:bg-[#f8fafc] [html[data-theme='light']_&]:border-slate-200 [html[data-theme='light']_&]:shadow-sm [html[data-theme='light']_&]:hover:border-[var(--amethyst-focus)]"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-[var(--amethyst-deep)] flex items-center justify-center text-lg border border-white/5 group-hover:scale-110 transition-transform [html[data-theme='light']_&]:bg-slate-100 [html[data-theme='light']_&]:border-slate-200">
                      {getMaterialIcon(item.type)}
                    </div>
                    <div>
                      <h3 className="font-black text-sm uppercase tracking-tight text-white mb-1 group-hover:text-[var(--amethyst-focus)] transition-colors [html[data-theme='light']_&]:text-slate-800">{item.title}</h3>
                      <div className="flex items-center gap-3">
                        <span className="text-[0.625rem] font-bold px-2 py-0.5 rounded bg-white/10 text-white/50 uppercase [html[data-theme='light']_&]:bg-slate-100 [html[data-theme='light']_&]:text-slate-500">{item.type}</span>
                        <span className="text-[0.625rem] text-white/30 uppercase font-bold [html[data-theme='light']_&]:text-slate-400">{item.date}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 border-white/5 pt-4 md:pt-0 [html[data-theme='light']_&]:border-slate-200">
                    {/* Stats */}
                    <div className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <span className="text-[0.7rem] font-black text-white [html[data-theme='light']_&]:text-slate-700">{item.stats.views}</span>
                        <span className="text-[0.5rem] uppercase text-white/30 font-bold [html[data-theme='light']_&]:text-slate-400">Views</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <span className="text-[0.7rem] font-black text-white [html[data-theme='light']_&]:text-slate-700">{item.stats.downloads}</span>
                        <span className="text-[0.5rem] uppercase text-white/30 font-bold [html[data-theme='light']_&]:text-slate-400">Downloads</span>
                      </div>
                    </div>

                    {/* Status */}
                    <div className="text-right min-w-[80px]">
                      <div className={`text-[0.6rem] font-black uppercase tracking-wider mb-1 ${item.status === 'Published' ? 'text-emerald-400' : 'text-amber-400'}`}>
                        {item.status}
                      </div>
                      {item.status === 'Scheduled' && item.remaining && (
                        <div className="text-[0.5rem] text-white/40 font-bold uppercase [html[data-theme='light']_&]:text-slate-500">
                          {item.remaining}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 text-center">
              <button className="text-xs font-bold uppercase text-white/40 hover:text-white transition-colors [html[data-theme='light']_&]:text-slate-400 [html[data-theme='light']_&]:hover:text-[var(--amethyst-focus)]">View Full Library History</button>
            </div>
          </div>
        </div>

        {/* Quick Actions Section */}
        <div className="space-y-6">
          {/* Headword */}
          <div className="flex items-center gap-4">
            <div className="w-2.5 h-8 bg-[#7c3aed] rounded-full"></div>
            <h2 className="text-2xl font-black uppercase tracking-tighter text-white [html[data-theme='light']_&]:text-[#0F172A]">
              Quick Actions
            </h2>
          </div>

          {/* Big Container */}
          <div className="p-8 rounded-3xl border border-white/5 bg-[#0f172a] shadow-2xl [html[data-theme='light']_&]:bg-white [html[data-theme='light']_&]:border-slate-200">
            <div className="space-y-4">
              <button className="w-full text-left p-5 rounded-2xl bg-[#1e293b] hover:bg-[var(--amethyst-focus)] hover:text-white transition-all group border border-white/5 hover:border-[var(--amethyst-focus)] hover:shadow-lg hover:-translate-y-1 duration-300 [html[data-theme='light']_&]:bg-[#f8fafc] [html[data-theme='light']_&]:border-slate-200">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-[var(--amethyst-focus)] group-hover:text-white group-hover:bg-white/20 transition-colors [html[data-theme='light']_&]:bg-slate-100 [html[data-theme='light']_&]:group-hover:bg-white/20 [html[data-theme='light']_&]:group-hover:text-white">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <svg className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
                <span className="text-xs font-black uppercase tracking-wider block mb-1 group-hover:force-text-white [html[data-theme='light']_&]:text-slate-800">Schedule Workshop</span>
                <span className="text-[0.6rem] text-white/40 group-hover:force-text-white group-hover:opacity-80 leading-tight block [html[data-theme='light']_&]:text-slate-500">Set up a new session for your students</span>
              </button>

              <button className="w-full text-left p-5 rounded-2xl bg-[#1e293b] hover:bg-[var(--amethyst-focus)] hover:text-white transition-all group border border-white/5 hover:border-[var(--amethyst-focus)] hover:shadow-lg hover:-translate-y-1 duration-300 [html[data-theme='light']_&]:bg-[#f8fafc] [html[data-theme='light']_&]:border-slate-200">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-[var(--amethyst-focus)] group-hover:text-white group-hover:bg-white/20 transition-colors [html[data-theme='light']_&]:bg-slate-100 [html[data-theme='light']_&]:group-hover:bg-white/20 [html[data-theme='light']_&]:group-hover:text-white">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                    </svg>
                  </div>
                  <svg className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
                <span className="text-xs font-black uppercase tracking-wider block mb-1 group-hover:force-text-white [html[data-theme='light']_&]:text-slate-800">Invite Collaborator</span>
                <span className="text-[0.6rem] text-white/40 group-hover:force-text-white group-hover:opacity-80 leading-tight block [html[data-theme='light']_&]:text-slate-500">Add a peer to your shared library</span>
              </button>

              <button className="w-full text-left p-5 rounded-2xl bg-[#1e293b] hover:bg-[var(--amethyst-focus)] hover:text-white transition-all group border border-white/5 hover:border-[var(--amethyst-focus)] hover:shadow-lg hover:-translate-y-1 duration-300 [html[data-theme='light']_&]:bg-[#f8fafc] [html[data-theme='light']_&]:border-slate-200">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-[var(--amethyst-focus)] group-hover:text-white group-hover:bg-white/20 transition-colors [html[data-theme='light']_&]:bg-slate-100 [html[data-theme='light']_&]:group-hover:bg-white/20 [html[data-theme='light']_&]:group-hover:text-white">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <svg className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
                <span className="text-xs font-black uppercase tracking-wider block mb-1 group-hover:force-text-white [html[data-theme='light']_&]:text-slate-800">Generate Report</span>
                <span className="text-[0.6rem] text-white/40 group-hover:force-text-white group-hover:opacity-80 leading-tight block [html[data-theme='light']_&]:text-slate-500">Export monthly engagement analytics</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div >
  );
};

export default Dashboard;
