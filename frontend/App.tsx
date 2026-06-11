
import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import AdminLogin from './pages/AdminLogin';
import SignUp from './pages/SignUp';
import Training from './pages/Training';
import CourseView from './pages/CourseView';
import Community from './pages/Community';
import EducoreContents from './pages/EducoreContents';
import TeachingStrategies from './pages/TeachingStrategies';
import Profile from './pages/Profile';
import Library from './pages/Library';
import Resources from './pages/Resources';
import Impact from './pages/Impact';
import LilysStoryPage from './pages/LilysStoryPage';
import TheAntAndTheGrasshopperPage from './pages/TheAntAndTheGrasshopperPage';
import SimulationViewer from './pages/SimulationViewer';
import FractionStoryPage from './public/animation/fractions/FractionStoryPage';
import FractionStoryVideoPage from './public/animation/fractions/FractionStoryVideoPage';
import FractionStoryVideoPageBengali from './public/animation/fractions/FractionStoryVideoPageBengali';
import TeachingAidAnimationPage from './public/animation/teaching-aid/TeachingAidAnimationPage';

import AdminPanel from './admin/AdminPanel';

import { INITIAL_TRAINING, INITIAL_EXCLUSIVE, INITIAL_STRATEGIES } from './data';

const App: React.FC = () => {
  const [userRole, setUserRole] = useState<'educator' | 'admin' | null>(() => {
    const role = localStorage.getItem('userRole');
    const token = localStorage.getItem('accessToken');
    return (role && token) ? (role as 'educator' | 'admin') : null;
  });

  const isAuthenticated = userRole !== null && !!localStorage.getItem('accessToken');
  const isEducator = userRole === 'educator';
  const isAdmin = userRole === 'admin';

  // Data Sync Initialization
  useEffect(() => {
    // Force clear for demo if needed or check existence
    if (!localStorage.getItem('educore_training')) {
      localStorage.setItem('educore_training', JSON.stringify(INITIAL_TRAINING));
    }
    if (!localStorage.getItem('educore_exclusive')) {
      localStorage.setItem('educore_exclusive', JSON.stringify(INITIAL_EXCLUSIVE));
    }
    if (!localStorage.getItem('educore_strategies')) {
      localStorage.setItem('educore_strategies', JSON.stringify(INITIAL_STRATEGIES));
    }
  }, []);

  const handleLogin = (role: 'educator' | 'admin') => {
    setUserRole(role);
    localStorage.setItem('userRole', role);
  };

  const handleLogout = () => {
    setUserRole(null);
    localStorage.removeItem('userRole');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('educore_user_avatar');
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* Storybook route is outside the Layout wrapper to avoid the sidebar */}
        <Route
          path="/lilys-story"
          element={
            <LilysStoryPage
              userRole={userRole}
              onLogout={handleLogout}
              onLogin={() => handleLogin('educator')}
            />
          }
        />
        <Route
          path="/storybook"
          element={<Navigate to="/lilys-story" replace />}
        />
        <Route
          path="/the-ant-and-the-grasshopper"
          element={
            <TheAntAndTheGrasshopperPage
              userRole={userRole}
              onLogout={handleLogout}
              onLogin={() => handleLogin('educator')}
            />
          }
        />

        <Route
          path="/simulation/:simId"
          element={
            <SimulationViewer />
          }
        />
        <Route
          path="/fraction-story"
          element={
            <FractionStoryPage />
          }
        />
        <Route
          path="/fraction-video"
          element={
            <FractionStoryVideoPage />
          }
        />
        <Route
          path="/fraction-video-bengali"
          element={
            <FractionStoryVideoPageBengali />
          }
        />
        <Route
          path="/teaching-aid-animation"
          element={
            <TeachingAidAnimationPage />
          }
        />

        {/* All other routes are wrapped in Layout */}
        <Route path="*" element={
          <Layout userRole={userRole} onLogout={handleLogout} onLogin={() => handleLogin('educator')}>
            <Routes>
              <Route path="/" element={<Home isAuthenticated={isAuthenticated} />} />
              <Route path="/impact" element={<Impact />} />

              <Route path="/login" element={isAuthenticated ? <Navigate to={isAdmin ? "/admin" : "/dashboard"} /> : <Login onLogin={handleLogin} />} />
              <Route path="/admin" element={isAdmin ? <AdminPanel /> : <AdminLogin onLogin={handleLogin} />} />

              <Route path="/admin-login" element={<Navigate to="/admin" replace />} />
              <Route path="/admin-panel" element={<Navigate to="/admin" replace />} />

              <Route path="/signup" element={isAuthenticated ? <Navigate to="/dashboard" /> : <SignUp onLogin={() => handleLogin('educator')} />} />

              <Route path="/dashboard" element={isEducator ? <Dashboard /> : <Navigate to={isAdmin ? "/admin" : "/login"} />} />
              <Route path="/training" element={isEducator ? <Training /> : <Navigate to={isAdmin ? "/admin" : "/login"} />} />
              <Route path="/training/course/:courseId" element={isEducator ? <CourseView /> : <Navigate to={isAdmin ? "/admin" : "/login"} />} />
              <Route path="/community" element={isEducator ? <Community /> : <Navigate to={isAdmin ? "/admin" : "/login"} />} />
              <Route path="/shikkhok-exclusive" element={isEducator ? <EducoreContents /> : <Navigate to={isAdmin ? "/admin" : "/login"} />} />
              <Route path="/teaching-strategies" element={isEducator ? <TeachingStrategies /> : <Navigate to={isAdmin ? "/admin" : "/login"} />} />
              <Route path="/teaching-strategies/:strategyId" element={isEducator ? <TeachingStrategies /> : <Navigate to={isAdmin ? "/admin" : "/login"} />} />
              <Route path="/profile" element={isEducator ? <Profile onLogout={handleLogout} /> : <Navigate to={isAdmin ? "/admin" : "/login"} />} />
              <Route path="/library" element={isEducator ? <Library /> : <Navigate to={isAdmin ? "/admin" : "/login"} />} />
              <Route path="/resources" element={isEducator ? <Resources /> : <Navigate to={isAdmin ? "/admin" : "/login"} />} />

              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </Layout>
        } />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
