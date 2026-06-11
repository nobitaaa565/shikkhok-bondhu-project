
import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import TheAntAndTheGrasshopper from '../components/TheAntAndTheGrasshopper';

interface StorybookPageProps {
    userRole: 'educator' | 'admin' | null;
    onLogout: () => void;
    onLogin: () => void;
}

const TheAntAndTheGrasshopperPage: React.FC<StorybookPageProps> = ({ userRole, onLogout, onLogin }) => {
    const [theme, setTheme] = useState<'light' | 'dark'>(() => {
        return (document.documentElement.getAttribute('data-theme') as 'light' | 'dark') || 'dark';
    });

    const isLight = theme === 'light';

    const toggleTheme = () => {
        setTheme(prev => {
            const next = prev === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', next);
            return next;
        });
    };

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
    }, []);

    return (
        <div
            className="flex flex-col min-h-screen relative overflow-hidden"
            style={{ backgroundColor: isLight ? '#f0f4f8' : '#0f172a', transition: 'background-color 0.3s ease' }}
        >
            {!isLight && (
                <>
                    <video
                        autoPlay muted loop playsInline
                        style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: -2 }}
                    >
                        <source src="/storybook/images/bg.mp4" type="video/mp4" />
                    </video>
                    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1, backdropFilter: 'blur(3px)', background: 'rgba(0,0,0,0.15)' }} />
                </>
            )}

            {isLight && (
                <div
                    style={{
                        position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1,
                        background: 'linear-gradient(135deg, #f0f4f8 0%, #e8edf5 50%, #f5f0ff 100%)',
                    }}
                />
            )}

            <Header
                userRole={userRole}
                onLogout={onLogout}
                onLogin={onLogin}
                toggleSidebar={() => { }}
                sidebarAvailable={false}
                theme={theme}
                toggleTheme={toggleTheme}
            />

            <main className="flex-grow flex items-center justify-center pt-[100px] pb-10 relative z-10 w-full min-w-0">
                <TheAntAndTheGrasshopper />
            </main>

            <div
                className="relative z-10"
                style={isLight ? { backgroundColor: '#f0f4f8', borderTop: '1px solid rgba(15,23,42,0.08)' } : {}}
            >
                <Footer />
            </div>
        </div>
    );
};

export default TheAntAndTheGrasshopperPage;
