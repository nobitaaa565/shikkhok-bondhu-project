
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';

interface LayoutProps {
  children: React.ReactNode;
  userRole: 'educator' | 'admin' | null;
  onLogout: () => void;
  onLogin: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, userRole, onLogout, onLogin }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false); // State for desktop sidebar

  // Theme State
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  // Font Size State (Default 14px)
  const [fontSize, setFontSize] = useState(14);

  const location = useLocation();
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const toggleDesktopSidebar = () => setIsSidebarCollapsed(!isSidebarCollapsed);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';
  const isHomePage = location.pathname === '/';
  const isImpactPage = location.pathname === '/impact';
  const isAdminPanel = location.pathname === '/admin' || location.pathname === '/admin-panel';

  const isAuthenticated = userRole !== null;
  const isAdmin = userRole === 'admin';
  const isEducator = userRole === 'educator';

  // Apply Font Size to Root
  useEffect(() => {
    document.documentElement.style.fontSize = `${fontSize}px`;
  }, [fontSize]);

  // Apply Theme to Root
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Identify pages that require the Orange theme override
  const isOrangeThemePage = location.pathname.startsWith('/shikkhok-exclusive') || location.pathname.startsWith('/teaching-strategies');

  // Show sidebar only if Authenticated as Educator OR Admin AND NOT on home/impact/admin pages
  const showSidebar = (isEducator || (isAdmin && !isAdminPanel)) && !isHomePage && !isImpactPage;

  // Reset scroll position on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // Apply Font Size to Root
  useEffect(() => {
    document.documentElement.style.fontSize = `${fontSize}px`;
  }, [fontSize]);

  // Apply Theme to Root
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <div className={`flex flex-col min-h-screen relative ${isOrangeThemePage ? 'theme-override-orange' : ''}`}>
      {/* Background elements */}
      <div
        className="fixed inset-0 z-0 bg-[var(--bg-dark)] transition-colors duration-300"
      ></div>

      {/* Header - Z-index 50 */}
      <Header
        userRole={userRole}
        onLogout={onLogout}
        onLogin={onLogin}
        toggleSidebar={toggleSidebar}
        sidebarAvailable={showSidebar}
        theme={theme}
        toggleTheme={toggleTheme}
      />

      {/* Main Container - Z-index 10 to sit above background */}
      <div className="flex flex-1 relative z-10">
        {/* Sidebar - Only available for educators */}
        {showSidebar && (
          <Sidebar
            isOpen={sidebarOpen}
            toggleSidebar={toggleSidebar}
            onLogout={onLogout}
            isCollapsed={isSidebarCollapsed}
            toggleCollapse={toggleDesktopSidebar}
            fontSize={fontSize}
            setFontSize={setFontSize}
            theme={theme}
          />
        )}

        {/* Main Content Area */}
        <main className={`flex-1 flex flex-col pt-8 w-full min-w-0 ${isAdminPanel ? 'px-4 md:px-6' : 'px-6 md:px-12'} ${(!isAuthPage && !isAuthenticated) || isHomePage || isImpactPage || isAdminPanel ? 'max-w-7xl mx-auto' : ''}`}>
          <div className="flex-1">
            {children}
          </div>
          {/* Footer - Only on non-auth and non-admin pages */}
          {!isAuthPage && !isAdminPanel && (
            <div className="mt-32">
              <Footer />
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Layout;
