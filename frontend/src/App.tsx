import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { SessionProvider } from './context/SessionContext';
import { TopNavigation } from './components/TopNavigation';
import { MobileBottomNavigation } from './components/MobileBottomNavigation';
import { WelcomePage } from './pages/WelcomePage';
import { DashboardPage } from './pages/DashboardPage';
import { ChatPage } from './pages/ChatPage';
import { AssessmentPage } from './pages/AssessmentPage';
import { GuidancePage } from './pages/GuidancePage';
import { TrustedAdultPage } from './pages/TrustedAdultPage';
import { EmergencyPage } from './pages/EmergencyPage';
import { ResourcesPage } from './pages/ResourcesPage';
import { PrivacyPage } from './pages/PrivacyPage';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export function App() {
  const location = useLocation();
  const isWelcomeScreen = location.pathname === '/welcome';

  return (
    <SessionProvider>
      <div className="min-h-screen bg-[#F7F5FF] text-slate-800 flex flex-col font-sans selection:bg-sakhi-lavender-200 selection:text-sakhi-lavender-900">
        <ScrollToTop />
        
        {/* Top Navigation Bar */}
        {!isWelcomeScreen && <TopNavigation />}

        {/* Main Content Area (padding bottom adjusted for mobile bar) */}
        <main className={`flex-1 ${!isWelcomeScreen ? 'pb-24 lg:pb-10' : ''}`}>
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/welcome" element={<WelcomePage />} />
            <Route path="/chat" element={<ChatPage />} />
            <Route path="/assessment" element={<AssessmentPage />} />
            <Route path="/guidance" element={<GuidancePage />} />
            <Route path="/trusted-adults" element={<TrustedAdultPage />} />
            <Route path="/emergency" element={<EmergencyPage />} />
            <Route path="/resources" element={<ResourcesPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            {/* Catch-all fallback */}
            <Route path="*" element={<DashboardPage />} />
          </Routes>
        </main>

        {/* Fixed Mobile Bottom Navigation */}
        {!isWelcomeScreen && <MobileBottomNavigation />}
      </div>
    </SessionProvider>
  );
}

export default App;
