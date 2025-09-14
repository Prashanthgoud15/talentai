import React, { useState } from 'react';
import { Trophy, Target, TrendingUp, Medal, Play, Users, Calendar, Star, LogOut, Camera } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import LanguageSelector from './LanguageSelector';

interface AthleteDashboardProps {
  onNavigate: (page: 'assessment' | 'training' | 'coaches' | 'landing') => void;
}

const AthleteDashboard: React.FC<AthleteDashboardProps> = ({ onNavigate }) => {
  const { profile, signOut } = useAuth();
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'overview' | 'performance' | 'achievements' | 'community'>('overview');

  const handleLogout = async () => {
    await signOut();
    onNavigate('landing');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <Trophy className="h-8 w-8 text-orange-600" />
              <span className="text-xl font-bold text-gray-900">TalentEcosystem</span>
            </div>
            <div className="flex items-center space-x-2">
              <LanguageSelector />
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {profile?.full_name?.split(' ').map(n => n[0]).join('') || 'U'}
                  </span>
                </div>
                <span className="text-gray-900 font-medium">{profile?.full_name || 'User'}</span>
              </div>
              <button
                onClick={handleLogout}
                className="text-gray-500 hover:text-gray-700 p-2"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Navigation */}
        <div className="flex space-x-1 mb-8 bg-gray-100 p-1 rounded-lg w-fit">
          {[
            { id: 'overview', label: t('nav.dashboard'), icon: Target },
            { id: 'performance', label: 'Performance', icon: TrendingUp },
            { id: 'achievements', label: t('dashboard.achievements'), icon: Medal },
            { id: 'community', label: t('nav.community'), icon: Users },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as any)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                activeTab === id
                  ? 'bg-white text-orange-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{label}</span>
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">{t('dashboard.performanceScore')}</p>
                    <p className="text-3xl font-bold text-orange-600">87</p>
                  </div>
                  <div className="bg-orange-100 p-3 rounded-lg">
                    <Target className="h-6 w-6 text-orange-600" />
                  </div>
                </div>
                <div className="mt-4">
                  <div className="bg-gray-200 rounded-full h-2">
                    <div className="bg-orange-600 h-2 rounded-full" style={{ width: '87%' }}></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">+5% from last month</p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">{t('dashboard.trainingHours')}</p>
                    <p className="text-3xl font-bold text-emerald-600">42</p>
                  </div>
                  <div className="bg-emerald-100 p-3 rounded-lg">
                    <Calendar className="h-6 w-6 text-emerald-600" />
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-4">This month</p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">{t('dashboard.rank')}</p>
                    <p className="text-3xl font-bold text-blue-600">#23</p>
                  </div>
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <Trophy className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-4">State leaderboard</p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">{t('dashboard.achievements')}</p>
                    <p className="text-3xl font-bold text-purple-600">8</p>
                  </div>
                  <div className="bg-purple-100 p-3 rounded-lg">
                    <Medal className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-4">Badges earned</p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  onClick={() => onNavigate('assessment')}
                  className="flex items-center justify-center space-x-3 p-4 bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-lg hover:from-orange-700 hover:to-orange-800 transition-all"
                >
                  <Camera className="h-5 w-5" />
                  <span>{t('dashboard.newAssessment')}</span>
                </button>
                <button 
                  onClick={() => onNavigate('training')}
                  className="flex items-center justify-center space-x-3 p-4 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-lg hover:from-emerald-700 hover:to-emerald-800 transition-all"
                >
                  <Play className="h-5 w-5" />
                  <span>{t('dashboard.watchTraining')}</span>
                </button>
                <button 
                  onClick={() => onNavigate('coaches')}
                  className="flex items-center justify-center space-x-3 p-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all"
                >
                  <Users className="h-5 w-5" />
                  <span>{t('dashboard.connectCoaches')}</span>
                </button>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
              <div className="space-y-4">
                <div className="flex items-center space-x-4 p-3 bg-green-50 rounded-lg">
                  <div className="bg-green-600 p-2 rounded-full">
                    <Target className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">Completed Speed Assessment</p>
                    <p className="text-sm text-gray-600">New personal best: 100m in 11.2s</p>
                  </div>
                  <span className="text-xs text-gray-500">2 hours ago</span>
                </div>
                <div className="flex items-center space-x-4 p-3 bg-blue-50 rounded-lg">
                  <div className="bg-blue-600 p-2 rounded-full">
                    <Medal className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">Earned "Consistent Performer" Badge</p>
                    <p className="text-sm text-gray-600">Completed 7 days of training</p>
                  </div>
                  <span className="text-xs text-gray-500">1 day ago</span>
                </div>
                <div className="flex items-center space-x-4 p-3 bg-purple-50 rounded-lg">
                  <div className="bg-purple-600 p-2 rounded-full">
                    <Users className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">Coach Recommendation</p>
                    <p className="text-sm text-gray-600">Coach Sharma wants to connect with you</p>
                  </div>
                  <span className="text-xs text-gray-500">3 days ago</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Performance Tab */}
        {activeTab === 'performance' && (
          <div className="space-y-8">
            {/* Performance Chart */}
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Performance Trends</h2>
              <div className="h-64 bg-gray-50 rounded-lg p-4">
                <div className="h-full relative">
                  {/* Mock Chart Data */}
                  <div className="flex items-end justify-between h-48 mb-4">
                    {[65, 72, 68, 78, 85, 82, 87, 90, 88, 92, 89, 95].map((value, index) => (
                      <div key={index} className="flex flex-col items-center">
                        <div 
                          className="bg-orange-600 rounded-t-sm transition-all hover:bg-orange-700"
                          style={{ 
                            height: `${(value / 100) * 180}px`,
                            width: '20px'
                          }}
                        ></div>
                        <span className="text-xs text-gray-500 mt-1">
                          {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][index]}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Performance Score Over Time</span>
                    <span className="text-green-600">↗ +28% this year</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-3">Speed (100m)</h3>
                <div className="text-3xl font-bold text-orange-600 mb-2">11.2s</div>
                <div className="flex items-center text-sm">
                  <span className="text-green-600">↓ 0.3s</span>
                  <span className="text-gray-500 ml-1">improvement</span>
                </div>
                <div className="mt-4 bg-gray-200 rounded-full h-2">
                  <div className="bg-orange-600 h-2 rounded-full" style={{ width: '85%' }}></div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-3">Endurance</h3>
                <div className="text-3xl font-bold text-emerald-600 mb-2">92%</div>
                <div className="flex items-center text-sm">
                  <span className="text-green-600">↑ 8%</span>
                  <span className="text-gray-500 ml-1">improvement</span>
                </div>
                <div className="mt-4 bg-gray-200 rounded-full h-2">
                  <div className="bg-emerald-600 h-2 rounded-full" style={{ width: '92%' }}></div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-3">Strength</h3>
                <div className="text-3xl font-bold text-blue-600 mb-2">78%</div>
                <div className="flex items-center text-sm">
                  <span className="text-green-600">↑ 12%</span>
                  <span className="text-gray-500 ml-1">improvement</span>
                </div>
                <div className="mt-4 bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: '78%' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Achievements Tab */}
        {activeTab === 'achievements' && (
          <div className="space-y-8">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Your Achievements</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl">
                  <div className="bg-orange-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Trophy className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Speed Demon</h3>
                  <p className="text-sm text-gray-600">Achieved sub-12s in 100m sprint</p>
                  <div className="mt-3 flex justify-center">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                </div>

                <div className="text-center p-4 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl">
                  <div className="bg-emerald-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Medal className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Consistent Performer</h3>
                  <p className="text-sm text-gray-600">7 consecutive days of training</p>
                  <div className="mt-3 flex justify-center">
                    {[...Array(4)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                    ))}
                    <Star className="h-4 w-4 text-gray-300" />
                  </div>
                </div>

                <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
                  <div className="bg-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Target className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Goal Crusher</h3>
                  <p className="text-sm text-gray-600">Exceeded monthly targets</p>
                  <div className="mt-3 flex justify-center">
                    {[...Array(3)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                    ))}
                    <Star className="h-4 w-4 text-gray-300" />
                    <Star className="h-4 w-4 text-gray-300" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Community Tab */}
        {activeTab === 'community' && (
          <div className="space-y-8">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Community Leaderboard</h2>
              <div className="space-y-4">
                {[
                  { rank: 1, name: 'Arjun Sharma', score: 95, badge: 'gold' },
                  { rank: 2, name: 'Sneha Patel', score: 92, badge: 'silver' },
                  { rank: 3, name: 'Raj Kumar', score: 89, badge: 'bronze' },
                  { rank: 4, name: 'You (Priya Kumar)', score: 87, badge: 'current' },
                  { rank: 5, name: 'Amit Singh', score: 85, badge: 'none' },
                ].map((athlete, index) => (
                  <div
                    key={index}
                    className={`flex items-center justify-between p-4 rounded-lg ${
                      athlete.badge === 'current' ? 'bg-orange-50 border-2 border-orange-200' : 'bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                        athlete.badge === 'gold' ? 'bg-yellow-500' :
                        athlete.badge === 'silver' ? 'bg-gray-400' :
                        athlete.badge === 'bronze' ? 'bg-orange-600' :
                        athlete.badge === 'current' ? 'bg-orange-600' :
                        'bg-gray-600'
                      }`}>
                        {athlete.rank}
                      </div>
                      <div>
                        <p className={`font-medium ${athlete.badge === 'current' ? 'text-orange-600' : 'text-gray-900'}`}>
                          {athlete.name}
                        </p>
                        <p className="text-sm text-gray-600">Score: {athlete.score}</p>
                      </div>
                    </div>
                    {athlete.badge !== 'none' && athlete.badge !== 'current' && (
                      <Medal className={`h-6 w-6 ${
                        athlete.badge === 'gold' ? 'text-yellow-500' :
                        athlete.badge === 'silver' ? 'text-gray-400' :
                        'text-orange-600'
                      }`} />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AthleteDashboard;