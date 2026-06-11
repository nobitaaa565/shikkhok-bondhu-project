
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
  onLogout: () => void;
  isCollapsed: boolean;
  toggleCollapse: () => void;
  fontSize: number;
  setFontSize: (size: number) => void;
  theme: 'light' | 'dark';
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar, onLogout, isCollapsed, toggleCollapse, fontSize, setFontSize, theme }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isLight = theme === 'light';

  const navItems = [
    {
      name: 'Dashboard',
      path: '/dashboard',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
      )
    },
    /*
    {
      name: 'Training',
      path: '/training',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path d="M12 14l9-5-9-5-9 5 9 5z" />
          <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
        </svg>
      )
    },
    */
    {
      name: 'Community',
      path: '/community',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      )
    },
    {
      name: 'Shikkhok Exclusive',
      path: '/shikkhok-exclusive',
      special: true,
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
      )
    },
    {
      name: 'Teaching Strategies',
      path: '/teaching-strategies',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      )
    },
    {
      name: 'Library',
      path: '/library',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
        </svg>
      )
    },
  ];

  const handleLogout = () => {
    onLogout();
    navigate('/');
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    if (isOpen) {
      toggleSidebar();
    }
  };

  const increaseFont = () => setFontSize(Math.min(24, fontSize + 1));
  const decreaseFont = () => setFontSize(Math.max(12, fontSize - 1));

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[90] lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      <aside className={`
        fixed lg:sticky 
        top-0 lg:top-[88px] 
        h-screen lg:h-[calc(100vh-88px)]
        left-0 z-[95]
        ${isCollapsed ? 'lg:w-20' : 'lg:w-72'}
        w-64 
        ${isLight ? 'bg-white border-r-slate-200 shadow-xl' : 'bg-[var(--bg-dark)] lg:bg-white/5 border-r-white/10 backdrop-blur-xl'}
        border-r
        transform transition-all duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className={`h-full flex flex-col ${isCollapsed ? 'px-6 lg:px-2' : 'px-6'} pt-24 pb-8 lg:py-8 overflow-y-auto overflow-x-hidden`}>

          <div className="lg:hidden mb-6 px-2">
            <div className={`mono text-xs font-bold ${isLight ? 'text-slate-400' : 'text-white/30'}`}>Menu</div>
          </div>

          <div className={`flex items-center justify-end mb-6 ${isCollapsed ? 'flex-col gap-4' : ''}`}>
            <button
              onClick={toggleCollapse}
              className={`hidden lg:flex w-8 h-8 items-center justify-center rounded-lg ${isLight ? 'bg-slate-100 hover:bg-slate-200 text-slate-400' : 'bg-white/5 hover:bg-white/10 text-white/50'} transition-colors sidebar-item`}
              title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            >
              {isCollapsed ? (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" /></svg>
              ) : (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" /></svg>
              )}
            </button>
          </div>

          <nav className="flex-1 space-y-2">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              const baseButtonClasses = "w-full flex items-center py-3 rounded-lg mono text-sm font-bold transition-all sidebar-item";
              const spacingClasses = `px-4 gap-4 ${isCollapsed ? 'lg:justify-center lg:px-2 lg:gap-0' : ''}`;

              if (item.special) {
                return (
                  <button
                    key={item.path}
                    onClick={() => handleNavigation(item.path)}
                    className={`
                      ${baseButtonClasses} ${spacingClasses} relative overflow-hidden group
                      ${isActive
                        ? (isLight ? 'bg-amber-600 force-text-white border-transparent shadow-lg' : 'bg-amber-500/20 text-amber-400 border border-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.3)]')
                        : (isLight ? 'text-amber-600 border border-amber-200/50 hover:bg-amber-50' : 'text-amber-200/80 border border-amber-500/10 hover:bg-white/5')}
                    `}
                  >
                    {!isLight && <div className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ${isCollapsed ? 'lg:hidden' : ''}`}></div>}
                    <span className={`text-base flex-shrink-0 ${isActive && isLight ? 'force-text-white' : (isLight ? '' : 'drop-shadow-[0_0_5px_rgba(245,158,11,0.8)]')} ${isCollapsed ? 'lg:drop-shadow-none' : ''}`}>{item.icon}</span>
                    <span className={`whitespace-nowrap ${isCollapsed ? 'lg:hidden' : ''}`}>{item.name}</span>
                  </button>
                );
              }

              return (
                <button
                  key={item.path}
                  onClick={() => handleNavigation(item.path)}
                  className={`
                    ${baseButtonClasses} ${spacingClasses}
                    ${isActive
                      ? 'bg-[#7c3aed] text-white force-text-white border-transparent shadow-lg'
                      : isLight
                        ? 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
                        : 'text-white/60 hover:text-white hover:bg-white/5'}
                  `}
                >
                  <span className="flex-shrink-0">{item.icon}</span>
                  <span className={`whitespace-nowrap ${isCollapsed ? 'lg:hidden' : ''}`}>{item.name}</span>
                </button>
              );
            })}
          </nav>

          <div className="mt-auto pt-10 space-y-4">
            <div className={`tile px-2 py-2 rounded-lg border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-black/20 border-white/5'} sidebar-box ${isCollapsed ? 'lg:hidden' : ''}`}>
              <div className="flex items-center justify-between">
                <button onClick={decreaseFont} className={`w-8 h-8 flex items-center justify-center rounded ${isLight ? 'bg-slate-200 hover:bg-slate-300 text-slate-600' : 'bg-white/5 hover:bg-white/10 text-white'} transition-colors`}>
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" /></svg>
                </button>
                <div className="text-center">
                  <div className={`mono text-[0.5rem] font-bold ${isLight ? 'text-slate-400' : 'text-white/30'}`}>Font Size</div>
                  <div className={`text-xs font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>{fontSize}px</div>
                </div>
                <button onClick={increaseFont} className={`w-8 h-8 flex items-center justify-center rounded ${isLight ? 'bg-slate-200 hover:bg-slate-300 text-slate-600' : 'bg-white/5 hover:bg-white/10 text-white'} transition-colors`}>
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                </button>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className={`
                w-full flex items-center py-3 rounded-lg mono text-xs font-bold text-red-400/80 hover:text-red-400 hover:bg-red-400/5 transition-all border border-transparent hover:border-red-400/20
                px-4 gap-2 ${isCollapsed ? 'lg:justify-center lg:px-2 lg:gap-0' : ''} sidebar-item
              `}
            >
              <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span className={`whitespace-nowrap ${isCollapsed ? 'lg:hidden' : ''}`}>Sign Out</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
