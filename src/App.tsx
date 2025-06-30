import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { Dashboard } from './pages/Dashboard';
import { Lessons } from './pages/Lessons';
import { Progress } from './pages/Progress';
import { Translation } from './pages/Translation';
import { Writing } from './pages/Writing';
import { useThemeStore } from './stores/themeStore';
import { useLanguageStore } from './stores/languageStore';
import Login from './pages/Login';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { useAuthStore } from './stores/authStore';
import './i18n';

function App() {
  const { theme } = useThemeStore();
  const { language, isRTL } = useLanguageStore();
  const { isAuthenticated } = useAuthStore();
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  useEffect(() => {
    // Apply theme to document
    const root = document.documentElement;
    root.classList.remove('light', 'dark', 'high-contrast');
    root.classList.add(theme);
    
    // Apply RTL direction
    root.dir = isRTL ? 'rtl' : 'ltr';
    root.lang = language;

    // Set document title
    document.title = 'SmartLearn - Inclusive Educational Platform';
  }, [theme, isRTL, language]);

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <Router>
        <div className="App min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />} />
            <Route path="/" element={<Layout />}>
              <Route path="dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" replace />} />
              <Route path="lessons" element={isAuthenticated ? <Lessons /> : <Navigate to="/login" replace />} />
              <Route path="progress" element={isAuthenticated ? <Progress /> : <Navigate to="/login" replace />} />
              <Route path="translation" element={isAuthenticated ? <Translation /> : <Navigate to="/login" replace />} />
              <Route path="writing" element={isAuthenticated ? <Writing /> : <Navigate to="/login" replace />} />
            </Route>
          </Routes>
        </div>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;