import { useEffect, useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import LandingPage from './pages/LandingPage';
import FeedPage from './pages/FeedPage';
import ProfilePage from './pages/ProfilePage';
import MessagesPage from './pages/MessagesPage';
import DiscoverPage from './pages/DiscoverPage';
import NotificationsPage from './pages/NotificationsPage';
import WritePage from './pages/WritePage';
import SearchPage from './pages/SearchPage';
import SettingsPage from './pages/SettingsPage';
import NewsPage from './pages/NewsPage';
import Navigation from './components/Navigation';
import { AuthProvider } from './contexts/AuthContext';

gsap.registerPlugin(ScrollTrigger);

function App() {
  const [navVisible, setNavVisible] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Show nav on all pages except landing
    setNavVisible(location.pathname !== '/');
    
    // Scroll to top on route change
    window.scrollTo(0, 0);
    
    // Refresh ScrollTrigger on route change
    ScrollTrigger.refresh();
  }, [location.pathname]);

  return (
    <AuthProvider>
      <div className="relative min-h-screen bg-paper">
        {/* Grain Overlay */}
        <div className="grain-overlay" />
        
        {/* Navigation - shown on all pages except landing */}
        {navVisible && <Navigation />}
        
        {/* Routes */}
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/feed" element={<FeedPage />} />
          <Route path="/profile/:username?" element={<ProfilePage />} />
          <Route path="/messages/:conversationId?" element={<MessagesPage />} />
          <Route path="/discover" element={<DiscoverPage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/write" element={<WritePage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/news" element={<NewsPage />} />
        </Routes>
      </div>
    </AuthProvider>
  );
}

export default App;
