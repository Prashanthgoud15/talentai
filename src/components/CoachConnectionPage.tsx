import React, { useState, useEffect } from 'react';
import { ArrowLeft, Users, Search, MapPin, Star, MessageCircle, UserPlus, CheckCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { supabase, UserProfile, CoachAthleteConnection } from '../lib/supabase';

interface CoachConnectionPageProps {
  onNavigate: (page: 'athlete-dashboard' | 'coach-dashboard') => void;
}

const CoachConnectionPage: React.FC<CoachConnectionPageProps> = ({ onNavigate }) => {
  const { profile } = useAuth();
  const { t } = useLanguage();
  const [coaches, setCoaches] = useState<UserProfile[]>([]);
  const [connections, setConnections] = useState<CoachAthleteConnection[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSport, setSelectedSport] = useState('all');
  const [isSampleData, setIsSampleData] = useState(false);

  // Sample coaches data
  const sampleCoaches: UserProfile[] = [
    {
      id: '550e8400-e29b-41d4-a716-446655440001',
      full_name: 'Rajesh Kumar',
      user_type: 'coach',
      age: 35,
      primary_sport: 'Athletics',
      location_state: 'Karnataka',
      preferred_language: 'en',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440002',
      full_name: 'Priya Sharma',
      user_type: 'coach',
      age: 32,
      primary_sport: 'Swimming',
      location_state: 'Maharashtra',
      preferred_language: 'hi',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440003',
      full_name: 'Arjun Reddy',
      user_type: 'coach',
      age: 40,
      primary_sport: 'Basketball',
      location_state: 'Telangana',
      preferred_language: 'te',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440004',
      full_name: 'Meera Patel',
      user_type: 'coach',
      age: 28,
      primary_sport: 'Badminton',
      location_state: 'Gujarat',
      preferred_language: 'en',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440005',
      full_name: 'Vikram Singh',
      user_type: 'coach',
      age: 45,
      primary_sport: 'Football',
      location_state: 'Punjab',
      preferred_language: 'hi',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ];

  useEffect(() => {
    if (profile?.user_type === 'athlete') {
      fetchCoaches();
      fetchConnections();
    }
  }, [profile]);

  const fetchCoaches = async () => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_type', 'coach')
        .order('created_at', { ascending: false });

      if (error) {
        console.log('No coaches in database, using sample data');
        setCoaches(sampleCoaches);
        setIsSampleData(true);
      } else {
        setCoaches(data && data.length > 0 ? data : sampleCoaches);
        setIsSampleData(data && data.length === 0);
      }
    } catch (error) {
      console.error('Error fetching coaches:', error);
      setCoaches(sampleCoaches);
      setIsSampleData(true);
    } finally {
      setLoading(false);
    }
  };

  const fetchConnections = async () => {
    if (!profile?.id) return;

    try {
      const { data, error } = await supabase
        .from('coach_athlete_connections')
        .select('*')
        .eq('athlete_id', profile.id);

      if (error) {
        console.log('No connections found');
        setConnections([]);
      } else {
        setConnections(data || []);
      }
    } catch (error) {
      console.error('Error fetching connections:', error);
      setConnections([]);
    }
  };

  const handleBack = () => {
    if (profile?.user_type === 'athlete') {
      onNavigate('athlete-dashboard');
    } else {
      onNavigate('coach-dashboard');
    }
  };

  const sendConnectionRequest = async (coachId: string) => {
    if (!profile?.id) return;

    try {
      const { error } = await supabase
        .from('coach_athlete_connections')
        .insert({
          coach_id: coachId,
          athlete_id: profile.id,
          status: 'pending'
        });

      if (error) {
        if (error.code === '23505') {
          alert('You have already sent a request to this coach.');
        } else {
          throw error;
        }
      } else {
        // Refresh connections
        fetchConnections();
        alert('Connection request sent successfully!');
      }
    } catch (error: any) {
      console.error('Error sending connection request:', error);
      alert('Failed to send connection request. Please try again.');
    }
  };

  const getConnectionStatus = (coachId: string) => {
    return connections.find(conn => conn.coach_id === coachId);
  };

  const filteredCoaches = coaches.filter(coach => {
    const matchesSearch = coach.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         coach.location_state?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSport = selectedSport === 'all' || coach.primary_sport === selectedSport;
    
    return matchesSearch && matchesSport;
  });

  const sports = [...new Set(coaches.map(c => c.primary_sport).filter(Boolean))];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-orange-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={handleBack}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-800"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>{t('common.back')} to Dashboard</span>
            </button>
            <h1 className="text-xl font-semibold text-gray-900">{t('dashboard.connectCoaches')}</h1>
            <div className="w-24"></div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search coaches by name or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
            <select
              value={selectedSport}
              onChange={(e) => setSelectedSport(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="all">All Sports</option>
              {sports.map(sport => (
                <option key={sport} value={sport}>{sport}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Coaches Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCoaches.map((coach) => {
            const connectionStatus = getConnectionStatus(coach.id);
            
            return (
              <div key={coach.id} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mr-4">
                    <span className="text-white font-semibold">
                      {coach.full_name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{coach.full_name}</h3>
                    <p className="text-sm text-gray-600">{t('auth.coach')}</p>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  {coach.primary_sport && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Star className="h-4 w-4 mr-2" />
                      <span>{coach.primary_sport}</span>
                    </div>
                  )}
                  {coach.location_state && (
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="h-4 w-4 mr-2" />
                      <span>{coach.location_state}</span>
                    </div>
                  )}
                  {coach.age && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Users className="h-4 w-4 mr-2" />
                      <span>{coach.age} years experience</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                    ))}
                    <span className="text-sm text-gray-600 ml-1">4.8</span>
                  </div>
                  
                  {connectionStatus ? (
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full flex items-center space-x-1 ${
                      connectionStatus.status === 'accepted' ? 'bg-green-100 text-green-800' :
                      connectionStatus.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {connectionStatus.status === 'accepted' && <CheckCircle className="h-3 w-3" />}
                      <span>
                        {connectionStatus.status === 'accepted' ? 'Connected' :
                         connectionStatus.status === 'pending' ? 'Pending' : 'Rejected'}
                      </span>
                    </span>
                  ) : isSampleData ? (
                    <span className="px-3 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-600">
                      Sample Coach
                    </span>
                  ) : (
                    <button
                      onClick={() => sendConnectionRequest(coach.id)}
                      className="flex items-center space-x-1 bg-orange-600 hover:bg-orange-700 text-white px-3 py-1 rounded-lg text-sm font-medium transition-colors"
                    >
                      <UserPlus className="h-4 w-4" />
                      <span>Connect</span>
                    </button>
                  )}
                </div>

                {connectionStatus?.status === 'accepted' && (
                  <button className="w-full flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-colors">
                    <MessageCircle className="h-4 w-4" />
                    <span>Message Coach</span>
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {filteredCoaches.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Users className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No coaches found</h3>
            <p className="text-gray-600">Try adjusting your search criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CoachConnectionPage;