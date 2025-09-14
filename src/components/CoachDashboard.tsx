import React, { useState } from 'react';
import { Trophy, Users, TrendingUp, AlertTriangle, Search, Filter, LogOut, Plus, Eye } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import LanguageSelector from './LanguageSelector';

interface CoachDashboardProps {
  onNavigate: (page: 'assessment' | 'landing') => void;
}

const CoachDashboard: React.FC<CoachDashboardProps> = ({ onNavigate }) => {
  const { profile, signOut } = useAuth();
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'overview' | 'athletes' | 'analytics' | 'discovery'>('overview');

  const handleLogout = async () => {
    await signOut();
    onNavigate('landing');
  };

  const athletes = [
    { id: 1, name: 'Priya Kumar', sport: 'Athletics', score: 87, trend: 'up', status: 'active' },
    { id: 2, name: 'Arjun Patel', sport: 'Swimming', score: 92, trend: 'up', status: 'active' },
    { id: 3, name: 'Sneha Sharma', sport: 'Basketball', score: 78, trend: 'down', status: 'injury_risk' },
    { id: 4, name: 'Raj Kumar', sport: 'Football', score: 85, trend: 'stable', status: 'active' },
    { id: 5, name: 'Meera Singh', sport: 'Badminton', score: 90, trend: 'up', status: 'active' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <Trophy className="h-8 w-8 text-orange-600" />
              <span className="text-xl font-bold text-gray-900">TalentEcosystem</span>
              <span className="ml-4 px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">{t('auth.coach')}</span>
            </div>
            <div className="flex items-center space-x-2">
              <LanguageSelector />
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {profile?.full_name?.split(' ').map(n => n[0]).join('') || 'C'}
                  </span>
                </div>
                <span className="text-gray-900 font-medium">{profile?.full_name || 'Coach'}</span>
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
            { id: 'overview', label: 'Overview', icon: TrendingUp },
            { id: 'athletes', label: 'My Athletes', icon: Users },
            { id: 'analytics', label: 'Analytics', icon: TrendingUp },
            { id: 'discovery', label: 'Talent Discovery', icon: Search },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as any)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                activeTab === id
                  ? 'bg-white text-blue-600 shadow-sm'
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
                    <p className="text-sm text-gray-600">Total Athletes</p>
                    <p className="text-3xl font-bold text-blue-600">24</p>
                  </div>
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-4">+3 this month</p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Avg Performance</p>
                    <p className="text-3xl font-bold text-emerald-600">84.2</p>
                  </div>
                  <div className="bg-emerald-100 p-3 rounded-lg">
                    <TrendingUp className="h-6 w-6 text-emerald-600" />
                  </div>
                </div>
                <div className="mt-4">
                  <div className="bg-gray-200 rounded-full h-2">
                    <div className="bg-emerald-600 h-2 rounded-full" style={{ width: '84%' }}></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">+2.1% improvement</p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">At Risk Athletes</p>
                    <p className="text-3xl font-bold text-red-600">3</p>
                  </div>
                  <div className="bg-red-100 p-3 rounded-lg">
                    <AlertTriangle className="h-6 w-6 text-red-600" />
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-4">Require attention</p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Success Rate</p>
                    <p className="text-3xl font-bold text-purple-600">92%</p>
                  </div>
                  <div className="bg-purple-100 p-3 rounded-lg">
                    <Trophy className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-4">Athletes improving</p>
              </div>
            </div>

            {/* Alerts & Notifications */}
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Alerts & Recommendations</h2>
              <div className="space-y-4">
                <div className="flex items-center space-x-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                  <div className="flex-1">
                    <p className="font-medium text-red-800">Injury Risk Alert</p>
                    <p className="text-sm text-red-600">Sneha Sharma showing signs of overtraining - recommend rest day</p>
                  </div>
                  <button className="text-red-600 hover:text-red-800 text-sm font-medium">Review</button>
                </div>
                <div className="flex items-center space-x-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  <div className="flex-1">
                    <p className="font-medium text-green-800">Performance Breakthrough</p>
                    <p className="text-sm text-green-600">Arjun Patel achieved new personal best - consider advanced training</p>
                  </div>
                  <button className="text-green-600 hover:text-green-800 text-sm font-medium">View</button>
                </div>
                <div className="flex items-center space-x-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <Users className="h-5 w-5 text-blue-600" />
                  <div className="flex-1">
                    <p className="font-medium text-blue-800">New Talent Match</p>
                    <p className="text-sm text-blue-600">3 potential athletes identified in your region - review profiles</p>
                  </div>
                  <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">Explore</button>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
              <div className="space-y-4">
                <div className="flex items-center space-x-4 p-3 hover:bg-gray-50 rounded-lg">
                  <div className="bg-emerald-600 p-2 rounded-full">
                    <TrendingUp className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">Priya Kumar completed assessment</p>
                    <p className="text-sm text-gray-600">New performance score: 87 (+3 improvement)</p>
                  </div>
                  <span className="text-xs text-gray-500">2 hours ago</span>
                </div>
                <div className="flex items-center space-x-4 p-3 hover:bg-gray-50 rounded-lg">
                  <div className="bg-blue-600 p-2 rounded-full">
                    <Users className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">New athlete request</p>
                    <p className="text-sm text-gray-600">Rahul Verma wants to join your training program</p>
                  </div>
                  <span className="text-xs text-gray-500">5 hours ago</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Athletes Tab */}
        {activeTab === 'athletes' && (
          <div className="space-y-6">
            {/* Search and Filter */}
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">My Athletes</h2>
                <button
                  onClick={() => onNavigate('assessment')}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Athlete</span>
                </button>
              </div>
              <div className="flex space-x-4 mb-6">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search athletes..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                  <Filter className="h-4 w-4" />
                  <span>Filter</span>
                </button>
              </div>
            </div>

            {/* Athletes List */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Athlete</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sport</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Performance</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trend</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {athletes.map((athlete) => (
                      <tr key={athlete.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center mr-3">
                              <span className="text-white text-sm font-medium">
                                {athlete.name.split(' ').map(n => n[0]).join('')}
                              </span>
                            </div>
                            <div className="font-medium text-gray-900">{athlete.name}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{athlete.sport}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="text-sm font-medium text-gray-900">{athlete.score}</div>
                            <div className="ml-2 w-16 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-blue-600 h-2 rounded-full" 
                                style={{ width: `${athlete.score}%` }}
                              ></div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className={`flex items-center text-sm ${
                            athlete.trend === 'up' ? 'text-green-600' : 
                            athlete.trend === 'down' ? 'text-red-600' : 
                            'text-gray-600'
                          }`}>
                            <TrendingUp className={`h-4 w-4 mr-1 ${
                              athlete.trend === 'down' ? 'rotate-180' : 
                              athlete.trend === 'stable' ? 'rotate-90' : ''
                            }`} />
                            {athlete.trend}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            athlete.status === 'active' ? 'bg-green-100 text-green-800' :
                            athlete.status === 'injury_risk' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {athlete.status.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button className="text-blue-600 hover:text-blue-900 mr-3">
                            <Eye className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-8">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Performance Analytics</h2>
              <div className="h-64 bg-gray-50 rounded-lg p-4">
                <div className="h-full">
                  {/* Mock Analytics Chart */}
                  <div className="flex items-end justify-between h-48 mb-4">
                    {[78, 82, 85, 88, 84, 90, 87, 92, 89, 94, 91, 96].map((value, index) => (
                      <div key={index} className="flex flex-col items-center">
                        <div 
                          className="bg-blue-600 rounded-t-sm transition-all hover:bg-blue-700"
                          style={{ 
                            height: `${(value / 100) * 180}px`,
                            width: '18px'
                          }}
                        ></div>
                        <span className="text-xs text-gray-500 mt-1">
                          {['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'][index]}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Team Average Performance</span>
                    <span className="text-green-600">↗ +18% improvement</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Discovery Tab */}
        {activeTab === 'discovery' && (
          <div className="space-y-8">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Talent Discovery</h2>
              <div className="text-center py-12">
                <Search className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">Discover new talent in your region</p>
                <button
                  onClick={() => onNavigate('assessment')}
                  className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg"
                >
                  Launch Talent Search
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CoachDashboard;