
import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

interface HeaderProps {
  userRole: 'educator' | 'admin' | null;
  onLogout: () => void;
  onLogin: () => void;
  toggleSidebar: () => void;
  sidebarAvailable: boolean;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const Header: React.FC<HeaderProps> = ({ userRole, onLogout, onLogin, toggleSidebar, sidebarAvailable, theme, toggleTheme }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [profileAvatar, setProfileAvatar] = useState<string | null>(null);
  const profileDropdownRef = useRef<HTMLDivElement>(null);

  const location = useLocation();
  const navigate = useNavigate();

  const isAuthenticated = userRole !== null;
  const isAdmin = userRole === 'admin';
  const isHomePage = location.pathname === '/';

  const appRoutes = [
    '/dashboard',
    '/training',
    '/community',
    '/shikkhok-exclusive',
    '/teaching-strategies',
    '/profile',
    '/library'
  ];

  const showNavLinks = !isAdmin && !appRoutes.some(route => location.pathname.startsWith(route));

  const updateAvatar = () => {
    const saved = localStorage.getItem('educore_user_avatar');
    setProfileAvatar(saved);
  };

  useEffect(() => {
    updateAvatar();

    const handleClickOutside = (event: MouseEvent) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target as Node)) {
        setIsProfileDropdownOpen(false);
      }
    };

    window.addEventListener('profileUpdate', updateAvatar);
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      window.removeEventListener('profileUpdate', updateAvatar);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    onLogout();
    navigate('/');
    setIsProfileDropdownOpen(false);
  };

  const handleAutoLogin = () => {
    navigate('/login');
    setIsMobileMenuOpen(false);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsMobileMenuOpen(false);
    setIsProfileDropdownOpen(false);
  };

  const scrollToSection = (id: string) => {
    setIsMobileMenuOpen(false);
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className={`py-6 px-6 md:px-12 bg-[var(--bg-dark)]/50 backdrop-blur-md sticky top-0 z-[100] border-b border-white/5 w-full`}>
      <div className={`flex justify-between items-center w-full ${isHomePage ? 'max-w-6xl mx-auto' : ''}`}>
        <div className="flex items-center gap-3 md:gap-6">
          {isAuthenticated && sidebarAvailable && (
            <button onClick={toggleSidebar} className="lg:hidden p-2 hover:bg-white/5 rounded-lg text-white">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          )}

          {showNavLinks && (
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className={`md:hidden p-2 hover:bg-white/5 rounded-lg ${isMobileMenuOpen ? 'text-red-500' : 'text-white'}`}>
              {isMobileMenuOpen ? (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              ) : (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
              )}
            </button>
          )}

          <button onClick={() => handleNavigation(isAdmin ? '/admin' : '/')} className="flex items-center gap-3">
            <div className={`w-9 h-9 md:w-10 md:h-10 focus-border flex items-center justify-center font-black text-lg md:text-xl shrink-0 ${isAdmin ? 'text-cyan-500 border-cyan-500/50' : ''}`}>
              {isAdmin ? 'A' : 'S'}
            </div>
            <div className="flex flex-col items-start leading-none md:flex-row md:items-center md:gap-2">
              <span className="font-bold tracking-[0.005em] text-sm md:text-xl uppercase text-white">
                {isAdmin ? 'SYSTEM' : 'SHIKKHOK'}
              </span>
              <span className={`font-bold tracking-[0.005em] text-sm md:text-xl uppercase ${isAdmin ? 'text-cyan-500' : 'focus-text'}`}>
                {isAdmin ? 'ADMIN' : 'BONDHU'}
              </span>
            </div>
          </button>
        </div>

        {showNavLinks && (
          <div className="hidden md:flex justify-center gap-10 mono text-sm uppercase font-bold text-white/40">
            <button onClick={() => scrollToSection('why-us')} className="hover:text-white transition-colors">Why Us</button>
            <button onClick={() => scrollToSection('about')} className="hover:text-white transition-colors">About</button>
            <button onClick={() => scrollToSection('contact')} className="hover:text-white transition-colors">Contact</button>
          </div>
        )}

        <div className="flex gap-4 items-center">
          <div onClick={toggleTheme} className={`relative rounded-full cursor-pointer transition-colors duration-500 w-[42px] h-[22px] md:w-[60px] md:h-[30px] ${theme === 'dark' ? 'bg-[#1E293B] border-white/20' : 'bg-[#60A5FA] border-[#3B82F6]'}`}>
            <div className={`absolute top-1/2 -translate-y-1/2 bg-white rounded-full shadow-lg transform transition-transform duration-300 w-[16px] h-[16px] md:w-[24px] md:h-[24px] ${theme === 'dark' ? 'translate-x-[23px] md:translate-x-[33px]' : 'translate-x-[3px] md:translate-x-[3px]'}`} />
          </div>

          {isAuthenticated ? (
            <div className="relative" ref={profileDropdownRef}>
              <button
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                className={`flex items-center gap-2 group p-1 pr-3 rounded-full border transition-all bg-white/5 ${isAdmin ? 'border-cyan-500/30 hover:border-cyan-500' : 'border-white/10 hover:border-white/20'}`}
              >
                {isAdmin ? (
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-cyan-600 flex items-center justify-center text-white font-black shadow-lg">
                    A
                  </div>
                ) : (
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-[var(--amethyst-focus)] to-[var(--amethyst-deep)] flex items-center justify-center text-white font-black shadow-lg overflow-hidden">
                    {profileAvatar ? (
                      <img src={profileAvatar} alt="Avatar" className="w-full h-full object-cover" />
                    ) : 'J'}
                  </div>
                )}
                <span className={`hidden sm:block text-xs font-black uppercase transition-colors ${isAdmin ? 'text-cyan-100 group-hover:text-white' : 'text-white/80 group-hover:text-white'}`}>
                  {isAdmin ? 'Administrator' : 'Zannatul F.'}
                </span>
                <svg className={`w-4 h-4 text-white/40 transition-transform duration-300 ${isProfileDropdownOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </button>

              {isProfileDropdownOpen && (
                <div className="absolute right-0 mt-3 w-56 bg-[var(--bg-dark)] border border-white/10 rounded-2xl shadow-2xl overflow-hidden py-2 animate-fadeIn backdrop-blur-xl z-[110]">
                  {isAdmin ? (
                    <>
                      <div className="px-4 py-3 border-b border-white/5 mb-2 bg-cyan-900/10">
                        <div className="text-xs font-black text-white uppercase tracking-tighter">System Admin</div>
                        <div className="text-[0.625rem] text-cyan-500 font-bold uppercase mono">Root Access</div>
                      </div>
                      <button onClick={() => handleNavigation('/admin')} className="w-full text-left px-4 py-2.5 text-xs font-bold uppercase text-white/60 hover:text-white hover:bg-white/5 transition-all flex items-center gap-3">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>
                        Command Hub
                      </button>
                      <button onClick={() => handleNavigation('/dashboard')} className="w-full text-left px-4 py-2.5 text-xs font-bold uppercase text-white/60 hover:text-white hover:bg-white/5 transition-all flex items-center gap-3">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
                        Educator View
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="px-4 py-3 border-b border-white/5 mb-2">
                        <div className="text-xs font-black text-white uppercase tracking-tighter">Zannatul Ferdushie</div>
                        <div className="text-[0.625rem] text-[var(--amethyst-focus)] font-bold uppercase mono">Senior Educator</div>
                      </div>
                      <button onClick={() => handleNavigation('/profile')} className="w-full text-left px-4 py-2.5 text-xs font-bold uppercase text-white/60 hover:text-white hover:bg-white/5 transition-all flex items-center gap-3">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                        Profile Settings
                      </button>
                      <button onClick={() => handleNavigation('/library')} className="w-full text-left px-4 py-2.5 text-xs font-bold uppercase text-white/60 hover:text-white hover:bg-white/5 transition-all flex items-center gap-3">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" /></svg>
                        Knowledge Repository
                      </button>
                    </>
                  )}

                  <div className="h-px bg-white/5 my-2"></div>
                  <button onClick={handleLogout} className="w-full text-left px-4 py-2.5 text-xs font-bold uppercase text-red-400 hover:bg-red-400/10 transition-all flex items-center gap-3">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex gap-2">
              <button onClick={handleAutoLogin} className="hidden sm:block mono text-xs border border-white/10 px-4 py-2 hover:bg-white hover:text-black transition-all font-bold">LOGIN</button>
              <button onClick={() => handleNavigation('/signup')} className="mono text-xs bg-[var(--amethyst-focus)] px-4 py-2 hover:brightness-110 transition-all font-bold text-white uppercase force-text-white">SIGN UP</button>
            </div>
          )}
        </div>
      </div>

      {showNavLinks && isMobileMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-[var(--bg-dark)] border-b border-white/10 p-6 md:hidden flex flex-col gap-4 shadow-2xl animate-fadeIn z-[90]">
          <button onClick={() => scrollToSection('why-us')} className="text-left py-3 px-2 text-white/70 hover:text-white rounded font-bold uppercase tracking-wider transition-colors">Why Us</button>
          <button onClick={() => scrollToSection('about')} className="text-left py-3 px-2 text-white/70 hover:text-white rounded font-bold uppercase tracking-wider transition-colors">About</button>
          <button onClick={() => scrollToSection('contact')} className="text-left py-3 px-2 text-white/70 hover:text-white rounded font-bold uppercase tracking-wider transition-colors">Contact</button>

          {!isAuthenticated && (
            <>
              <div className="h-px bg-white/10 my-2"></div>
              <button
                onClick={handleAutoLogin}
                className="text-left py-3 px-2 text-[var(--amethyst-focus)] hover:text-white rounded font-bold uppercase tracking-widest transition-colors"
              >
                Login
              </button>
            </>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
