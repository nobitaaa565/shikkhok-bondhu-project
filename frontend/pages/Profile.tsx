
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

interface Resource {
  id: string;
  title: string;
  category: string;
  type: string;
  downloads: number;
  rating: number;
  date: string;
}

interface Badge {
  id: string;
  name: string;
  icon: React.ReactNode;
  earned: boolean;
  color: string;
}

// Define props interface for Profile component
interface ProfileProps {
  onLogout: () => void;
}

const Profile: React.FC<ProfileProps> = ({ onLogout }) => {
  const navigate = useNavigate();
  const [isPublic, setIsPublic] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'resources' | 'settings'>('overview');

  // Image states
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [coverImage, setCoverImage] = useState<string | null>(null);

  const profileInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  // Load saved data
  useEffect(() => {
    const savedProfile = localStorage.getItem('educore_user_avatar');
    const savedCover = localStorage.getItem('educore_user_cover');
    if (savedProfile) setProfileImage(savedProfile);
    if (savedCover) setCoverImage(savedCover);
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'avatar' | 'cover') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        if (type === 'avatar') {
          setProfileImage(base64String);
          localStorage.setItem('educore_user_avatar', base64String);
          // Optional: Dispatch event to notify header
          window.dispatchEvent(new Event('profileUpdate'));
        } else {
          setCoverImage(base64String);
          localStorage.setItem('educore_user_cover', base64String);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Mock User Resources
  const myResources: Resource[] = [
    { id: '1', title: 'Calculus: Limits & Continuity', category: 'Mathematics', type: 'Presentation', downloads: 1240, rating: 4.9, date: 'Oct 12, 2024' },
    { id: '2', title: 'Advanced Derivatives Guide', category: 'Mathematics', type: 'Worksheet', downloads: 850, rating: 4.8, date: 'Sep 28, 2024' },
    { id: '3', title: 'Math in Modern Architecture', category: 'Mathematics', type: 'Lesson Plan', downloads: 2100, rating: 5.0, date: 'Aug 15, 2024' },
  ];

  // Mock Badges
  const myBadges: Badge[] = [
    {
      id: 'b1', name: 'Fast Starter', earned: true, color: 'text-orange-400',
      icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
    },
    {
      id: 'b2', name: 'Quality King', earned: true, color: 'text-purple-400',
      icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>
    },
    {
      id: 'b3', name: 'Scholar', earned: true, color: 'text-emerald-400',
      icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.247 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
    }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-20 animate-fadeIn">

      {/* Top Banner / Hero Profile */}
      <div className="relative h-48 md:h-64 rounded-3xl overflow-hidden mb-[-80px] z-0 group">
        {coverImage ? (
          <img src={coverImage} alt="Cover" className="w-full h-full object-cover" />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--amethyst-deep)] via-[var(--bg-dark)] to-[var(--amethyst-deep)]"></div>
        )}
        <div className="absolute inset-0 opacity-10 crystal-grid"></div>
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[var(--bg-dark)] to-transparent"></div>

        {/* Cover Photo Update Trigger */}
        <button
          onClick={() => coverInputRef.current?.click()}
          className="absolute top-4 right-4 p-3 bg-black/60 backdrop-blur-md rounded-xl text-white opacity-0 group-hover:opacity-100 transition-all border border-white/10 hover:bg-black/80 flex items-center gap-2 text-[0.6rem] font-black uppercase tracking-widest"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
          Update Cover
        </button>
        <input type="file" ref={coverInputRef} className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'cover')} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10 px-4 md:px-8">

        {/* LEFT COLUMN: Fixed Profile & Controls */}
        <div className="lg:col-span-4 space-y-6">
          <div className="tile p-8 text-center md:text-left">
            <div className="relative inline-block mb-6 group/avatar">
              <div className="w-32 h-32 rounded-3xl bg-[var(--amethyst-deep)] border-2 border-[var(--amethyst-focus)]/50 flex items-center justify-center text-[var(--amethyst-focus)] shadow-2xl relative overflow-hidden">
                {profileImage ? (
                  <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}

                {/* Avatar Update Overlay */}
                <button
                  onClick={() => profileInputRef.current?.click()}
                  className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-opacity text-white"
                >
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                </button>
                <input type="file" ref={profileInputRef} className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'avatar')} />
              </div>
              {/* Status Indicator */}
              <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-emerald-500 border-4 border-[var(--tile-bg)] flex items-center justify-center shadow-lg z-10" title="Active Educator">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" /></svg>
              </div>
            </div>

            <h1 className="text-2xl font-black uppercase tracking-tighter mb-1">Zannatul Ferdushie</h1>
            <p className="mono text-[0.625rem] text-[var(--amethyst-focus)] font-black uppercase mb-6 tracking-widest">Senior Mathematics Educator</p>

            <div className="space-y-4 pt-4 border-t border-white/5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-white/40 uppercase font-bold mono">Account Impact</span>
                <span className="text-white font-black">42.5k Points</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-white/40 uppercase font-bold mono">Community Rank</span>
                <span className="text-amber-400 font-black">#84 Global</span>
              </div>
            </div>
          </div>

          {/* Visibility Toggle */}
          <div className="tile p-6 bg-white/[0.02]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="mono text-[0.625rem] font-black uppercase text-white/40">Profile Visibility</h3>
              <span className={`px-2 py-0.5 rounded text-[0.5rem] font-black uppercase ${isPublic ? 'bg-emerald-500/10 text-emerald-400' : 'bg-white/10 text-white/30'}`}>
                {isPublic ? 'Public' : 'Restricted'}
              </span>
            </div>
            <button
              onClick={() => setIsPublic(!isPublic)}
              className="w-full flex items-center justify-between p-3 rounded-lg bg-black/20 border border-white/10 hover:border-[var(--amethyst-focus)]/50 transition-all group"
            >
              <span className="text-xs font-bold text-white/60 group-hover:text-white">Toggle Privacy</span>
              <div className={`w-10 h-5 rounded-full relative transition-colors duration-300 ${isPublic ? 'bg-[var(--amethyst-focus)]' : 'bg-white/10'}`}>
                <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all duration-300 ${isPublic ? 'left-6' : 'left-1'}`}></div>
              </div>
            </button>
            <p className="text-[0.6rem] text-white/20 mt-3 italic leading-relaxed">
              When public, other educators can view your portfolio and reputation badges.
            </p>
          </div>

          {/* Nav Menu */}
          <div className="tile p-4 space-y-2">
            {[
              { id: 'overview', label: 'Portfolio Overview', icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg> },
              { id: 'resources', label: 'My Resources', icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253m0-13C19.832 18.247 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg> },
              { id: 'settings', label: 'Account Settings', icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg> },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-black uppercase transition-all ${activeTab === tab.id ? 'bg-[var(--amethyst-focus)] text-white shadow-lg' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
            <div className="h-px bg-white/5 my-4"></div>
            <button
              onClick={() => {
                onLogout();
                navigate('/');
              }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-black uppercase text-red-400 hover:bg-red-400/10 transition-all"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
              Sign Out
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: Tab Content */}
        <div className="lg:col-span-8 space-y-8">

          {activeTab === 'overview' && (
            <>
              {/* Professional Bio Card */}
              <div className="tile p-8 md:p-10 space-y-6">
                <div>
                  <h2 className="text-xl font-black uppercase tracking-tight mb-4 flex items-center gap-2">
                    <svg className="w-5 h-5 text-[var(--amethyst-focus)]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                    Professional Introduction
                  </h2>
                  <div className="bg-black/20 rounded-2xl p-6 border border-white/5 relative group">
                    <p className="font-serif text-white/80 leading-relaxed italic text-lg">
                      "Dedicated educator with over 15 years of experience in high-level mathematics pedagogy. My focus lies in bridging the gap between theoretical calculus and real-world industrial applications, empowering students to see the beauty in complex abstractions."
                    </p>
                    <button className="absolute top-4 right-4 p-2 bg-white/5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity text-white/50 hover:text-white">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="mono text-[0.625rem] font-black uppercase text-white/30">Primary Institution</h3>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded bg-white/5 flex items-center justify-center text-white/40 border border-white/5">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                      </div>
                      <span className="text-sm font-bold text-white/80">New York City Science High School</span>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h3 className="mono text-[0.625rem] font-black uppercase text-white/30">Global Collaborations</h3>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded bg-white/5 flex items-center justify-center text-white/40 border border-white/5">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      </div>
                      <span className="text-sm font-bold text-white/80">14 Active Shared Modules</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Achievements Showcase */}
              <div className="tile p-8 space-y-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-black uppercase tracking-tight flex items-center gap-2">
                    <svg className="w-5 h-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>
                    Expertise Badges
                  </h2>
                  <button onClick={() => navigate('/progress')} className="text-[0.625rem] font-black uppercase text-[var(--amethyst-focus)] hover:underline">View All</button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {myBadges.map(badge => (
                    <div key={badge.id} className="group relative">
                      <div className="tile p-4 md:p-6 bg-black/40 border border-white/10 flex flex-col items-center justify-center gap-3 hover:border-amber-400/50 transition-all hover:bg-amber-400/5 cursor-default">
                        <div className={`${badge.color} group-hover:scale-125 transition-transform duration-500`}>
                          {badge.icon}
                        </div>
                        <span className="mono text-[0.5rem] font-black uppercase text-white/30 text-center">{badge.name}</span>
                      </div>
                      {/* Tooltip on hover */}
                      <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 rounded bg-black text-[0.5rem] text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20 pointer-events-none">
                        Certified Mastery
                      </div>
                    </div>
                  ))}
                  {/* Empty Slot Placeholder */}
                  <div className="tile p-4 md:p-6 bg-white/5 border-dashed border-white/10 flex flex-col items-center justify-center opacity-30">
                    <svg className="w-6 h-6 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                    <span className="mono text-[0.5rem] font-black uppercase text-white/50 mt-2">Next Milestone</span>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === 'resources' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between px-2">
                <h2 className="text-xl font-black uppercase tracking-tight">Resource Portfolio</h2>
                <button className="px-4 py-2 bg-[var(--amethyst-focus)] text-white text-[0.625rem] font-black uppercase rounded shadow-lg">New Module</button>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {myResources.map(res => (
                  <div key={res.id} className="tile p-6 flex flex-col md:flex-row items-center justify-between group hover:border-[var(--amethyst-focus)]/50 transition-all">
                    <div className="flex items-center gap-6 w-full md:w-auto mb-4 md:mb-0">
                      <div className="w-12 h-12 rounded-xl bg-[var(--amethyst-deep)] border border-white/5 flex items-center justify-center text-[var(--amethyst-focus)] group-hover:border-[var(--amethyst-focus)]/50 transition-colors">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[0.55rem] font-black uppercase text-[var(--amethyst-focus)] bg-[var(--amethyst-deep)]/50 px-1.5 py-0.5 rounded tracking-tighter">{res.category}</span>
                          <span className="text-[0.55rem] mono text-white/20 uppercase">{res.date}</span>
                        </div>
                        <h3 className="text-base font-black text-white uppercase group-hover:text-[var(--amethyst-focus)] transition-colors">{res.title}</h3>
                        <div className="flex items-center gap-4 mt-1">
                          <span className="flex items-center gap-1 text-[0.6rem] text-white/30 uppercase font-bold">
                            <svg className="w-3 h-3 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                            {res.downloads}
                          </span>
                          <span className="flex items-center gap-1 text-[0.6rem] text-white/30 uppercase font-bold">
                            <svg className="w-3 h-3 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                            {res.rating}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 w-full md:w-auto">
                      <button className="flex-1 md:flex-none px-4 py-2 text-[0.625rem] font-black uppercase text-white/40 hover:text-white transition-all bg-white/5 rounded">Manage</button>
                      <button className="flex-1 md:flex-none px-4 py-2 text-[0.625rem] font-black uppercase text-white transition-all bg-white/10 hover:bg-[var(--amethyst-focus)] rounded">Analytics</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="tile p-8 space-y-8 animate-fadeIn">
              <h3 className="text-xl font-black uppercase tracking-tight">Public Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="mono text-[0.625rem] uppercase text-white/30 block ml-1 font-bold">Display Name</label>
                  <input type="text" defaultValue="Zannatul Ferdushie" className="contact-input bg-black/20 border-white/10 focus:border-[var(--amethyst-focus)]" />
                </div>
                <div className="space-y-2">
                  <label className="mono text-[0.625rem] uppercase text-white/30 block ml-1 font-bold">Email Address</label>
                  <input type="email" defaultValue="zannatul@edu.com" className="contact-input bg-black/20 border-white/10 focus:border-[var(--amethyst-focus)]" />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="mono text-[0.625rem] uppercase text-white/30 block ml-1 font-bold">Institution / School</label>
                  <input type="text" defaultValue="New York City Science High School" className="contact-input bg-black/20 border-white/10 focus:border-[var(--amethyst-focus)]" />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="mono text-[0.625rem] uppercase text-white/30 block ml-1 font-bold">Professional Introduction (Bio)</label>
                  <textarea
                    className="contact-input bg-black/20 border-white/10 focus:border-[var(--amethyst-focus)] min-h-[120px] leading-relaxed"
                    defaultValue="Dedicated educator with over 15 years of experience in high-level mathematics pedagogy. My focus lies in bridging the gap between theoretical calculus and real-world industrial applications, empowering students to see the beauty in complex abstractions."
                  ></textarea>
                </div>
              </div>

              <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                <button className="text-[0.625rem] font-black uppercase text-white/30 hover:text-white transition-colors">Discard Changes</button>
                <button className="cta-button py-3 px-10 text-[0.625rem] font-black uppercase tracking-tighter shadow-2xl">Update Portfolio</button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default Profile;
