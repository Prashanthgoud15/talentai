import React from 'react';
import { Trophy, Target, Users, Zap, Play } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import LanguageSelector from './LanguageSelector';

interface LandingPageProps {
  onNavigate: (page: 'auth' | 'athlete-dashboard' | 'coach-dashboard') => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  const { t } = useLanguage();
  const { user, profile } = useAuth();

  React.useEffect(() => {
    if (user && profile) {
      if (profile.user_type === 'athlete') {
        onNavigate('athlete-dashboard');
      } else {
        onNavigate('coach-dashboard');
      }
    }
  }, [user, profile, onNavigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-blue-50">
      {/* Header */}
      <header className="relative z-10 bg-white/80 backdrop-blur-sm border-b border-orange-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <Trophy className="h-8 w-8 text-orange-600" />
              <span className="text-xl font-bold text-gray-900">TalentEcosystem</span>
            </div>
            <div className="flex items-center space-x-4">
              <LanguageSelector />
              <button
                onClick={() => onNavigate('auth')}
                className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
              >
                {t('landing.startJourney')}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              {t('landing.title').split(' ').slice(0, 2).join(' ')}
              <span className="block text-orange-600">{t('landing.title').split(' ').slice(2).join(' ')}</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              {t('landing.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => onNavigate('auth')}
                className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-4 rounded-lg font-medium text-lg transition-all transform hover:scale-105 flex items-center justify-center space-x-2"
              >
                <Play className="h-5 w-5" />
                <span>{t('landing.startJourney')}</span>
              </button>
              <button className="border-2 border-orange-600 text-orange-600 hover:bg-orange-600 hover:text-white px-8 py-4 rounded-lg font-medium text-lg transition-all">
                {t('landing.watchDemo')}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Revolutionizing Sports Development
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our platform combines cutting-edge AI technology with deep understanding of India's sports ecosystem.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="group p-6 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl hover:shadow-lg transition-all">
              <div className="bg-orange-600 w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Target className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">AI Talent Discovery</h3>
              <p className="text-gray-600">Video-based assessments powered by machine learning for accurate talent identification from anywhere in India.</p>
            </div>

            <div className="group p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl hover:shadow-lg transition-all">
              <div className="bg-blue-600 w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Users className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Coach Network</h3>
              <p className="text-gray-600">Connect with certified coaches and access world-class training programs tailored to Indian conditions.</p>
            </div>

            <div className="group p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl hover:shadow-lg transition-all">
              <div className="bg-purple-600 w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Offline-First</h3>
              <p className="text-gray-600">Works seamlessly in areas with limited connectivity, ensuring no talent is left behind due to infrastructure gaps.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-orange-50 to-blue-50">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Ready to Unleash Your Potential?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Join thousands of athletes and coaches who are already transforming Indian sports
          </p>
          <button
            onClick={() => onNavigate('auth')}
            className="bg-gradient-to-r from-orange-600 to-blue-600 hover:from-orange-700 hover:to-blue-700 text-white px-8 py-4 rounded-lg font-medium text-lg transition-all transform hover:scale-105"
          >
            {t('landing.startJourney')}
          </button>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;