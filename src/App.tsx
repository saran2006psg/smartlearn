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
import './i18n';

function App() {
  const { theme } = useThemeStore();
  const { language, isRTL } = useLanguageStore();

  useEffect(() => {
    // Apply theme to document
    const root = document.documentElement;
    root.classList.remove('light', 'dark', 'high-contrast');
    root.classList.add(theme);
    
    // Apply RTL direction
    root.dir = isRTL ? 'rtl' : 'ltr';
    root.lang = language;
  }, [theme, isRTL, language]);

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/" element={<Layout />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="lessons" element={<Lessons />} />
            <Route path="progress" element={<Progress />} />
            <Route path="translation" element={<Translation />} />
            <Route path="writing" element={<Writing />} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;