import React, { useState } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';
import LandingPage from './components/LandingPage';
import AuthPage from './components/AuthPage';
import AthleteDashboard from './components/AthleteDashboard';
import CoachDashboard from './components/CoachDashboard';
import AssessmentPage from './components/AssessmentPage';
import TrainingVideosPage from './components/TrainingVideosPage';
import CoachConnectionPage from './components/CoachConnectionPage';

function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <AppContent />
      </LanguageProvider>
    </AuthProvider>
  );
}

function AppContent() {
  const [currentPage, setCurrentPage] = useState<'landing' | 'auth' | 'athlete-dashboard' | 'coach-dashboard' | 'assessment' | 'training' | 'coaches'>('landing');

  const navigateTo = (page: typeof currentPage) => {
    setCurrentPage(page);
  };

  // Bypass authentication loading - show landing page directly
  switch (currentPage) {
    case 'landing':
      return <LandingPage onNavigate={navigateTo} />;
    case 'auth':
      return <AuthPage onNavigate={navigateTo} />;
    case 'athlete-dashboard':
      return <AthleteDashboard onNavigate={navigateTo} />;
    case 'coach-dashboard':
      return <CoachDashboard onNavigate={navigateTo} />;
    case 'assessment':
      return <AssessmentPage onNavigate={navigateTo} />;
    case 'training':
      return <TrainingVideosPage onNavigate={navigateTo} />;
    case 'coaches':
      return <CoachConnectionPage onNavigate={navigateTo} />;
    default:
      return <LandingPage onNavigate={navigateTo} />;
  }
}

export default App;