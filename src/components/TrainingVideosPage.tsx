import React, { useState, useEffect } from 'react';
import { ArrowLeft, Play, Search, Clock, ExternalLink } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { supabase, TrainingVideo } from '../lib/supabase';

interface TrainingVideosPageProps {
  onNavigate: (page: 'athlete-dashboard' | 'coach-dashboard') => void;
}

const TrainingVideosPage: React.FC<TrainingVideosPageProps> = ({ onNavigate }) => {
  const { profile } = useAuth();
  const { t } = useLanguage();
  const [videos, setVideos] = useState<TrainingVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSport, setSelectedSport] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');

  // Sample training videos data
  const sampleVideos: TrainingVideo[] = [
    {
      id: '1',
      title: 'How to Sprint Faster - Proper Running Form',
      description: 'Learn proper sprinting technique and form for maximum speed',
      youtube_url: 'https://www.youtube.com/watch?v=30R3G32X4mE',
      sport: 'Athletics',
      difficulty_level: 'Beginner',
      created_at: new Date().toISOString()
    },
    {
      id: '2',
      title: '100m Sprint Training - Elite Techniques',
      description: 'Advanced sprint training techniques used by professional athletes',
      youtube_url: 'https://www.youtube.com/watch?v=PUdB-VHoCH0',
      sport: 'Athletics',
      difficulty_level: 'Advanced',
      created_at: new Date().toISOString()
    },
    {
      id: '3',
      title: 'Basketball Shooting Form - Perfect Your Shot',
      description: 'Master basketball shooting fundamentals and improve accuracy',
      youtube_url: 'https://www.youtube.com/watch?v=fPe8wXqhd_0',
      sport: 'Basketball',
      difficulty_level: 'Intermediate',
      created_at: new Date().toISOString()
    },
    {
      id: '4',
      title: 'Freestyle Swimming Technique - Complete Guide',
      description: 'Learn proper freestyle swimming stroke technique',
      youtube_url: 'https://www.youtube.com/watch?v=rJpFVvho0o4',
      sport: 'Swimming',
      difficulty_level: 'Beginner',
      created_at: new Date().toISOString()
    },
    {
      id: '5',
      title: 'Football Skills - Dribbling and Ball Control',
      description: 'Master essential football dribbling and ball control skills',
      youtube_url: 'https://www.youtube.com/watch?v=yS3HYYQhMVE',
      sport: 'Football',
      difficulty_level: 'Intermediate',
      created_at: new Date().toISOString()
    },
    {
      id: '6',
      title: 'Badminton Footwork - Court Movement Basics',
      description: 'Essential badminton footwork patterns and court positioning',
      youtube_url: 'https://www.youtube.com/watch?v=dMYZLuHU4eI',
      sport: 'Badminton',
      difficulty_level: 'Intermediate',
      created_at: new Date().toISOString()
    },
    {
      id: '7',
      title: 'Tennis Serve - Proper Technique and Power',
      description: 'Learn the fundamentals of a powerful and accurate tennis serve',
      youtube_url: 'https://www.youtube.com/watch?v=8Oc_9UuWHOg',
      sport: 'Tennis',
      difficulty_level: 'Intermediate',
      created_at: new Date().toISOString()
    },
    {
      id: '8',
      title: 'Cricket Batting Basics - Proper Stance and Shots',
      description: 'Learn fundamental cricket batting techniques and shots',
      youtube_url: 'https://www.youtube.com/watch?v=VXOOJJmzhQw',
      sport: 'Cricket',
      difficulty_level: 'Beginner',
      created_at: new Date().toISOString()
    },
    {
      id: '9',
      title: 'Volleyball Spiking - Attack Techniques',
      description: 'Master volleyball spiking and attacking techniques',
      youtube_url: 'https://www.youtube.com/watch?v=A4NyBdnLWNs',
      sport: 'Volleyball',
      difficulty_level: 'Advanced',
      created_at: new Date().toISOString()
    },
    {
      id: '10',
      title: 'Field Hockey Skills - Stick Work and Dribbling',
      description: 'Essential field hockey stick handling and dribbling skills',
      youtube_url: 'https://www.youtube.com/watch?v=Zq8MoJy2UuI',
      sport: 'Hockey',
      difficulty_level: 'Intermediate',
      created_at: new Date().toISOString()
    },
    {
      id: '11',
      title: 'Yoga for Athletes - Flexibility and Recovery',
      description: 'Yoga routines designed specifically for athletic performance',
      youtube_url: 'https://www.youtube.com/watch?v=GLy2rYHwUqY',
      sport: 'Fitness',
      difficulty_level: 'Beginner',
      created_at: new Date().toISOString()
    },
    {
      id: '12',
      title: 'Strength Training for Athletes - Complete Workout',
      description: 'Complete strength training routine for athletic performance',
      youtube_url: 'https://www.youtube.com/watch?v=UItWltVZZmE',
      sport: 'Fitness',
      difficulty_level: 'Beginner',
      created_at: new Date().toISOString()
    }
  ];

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const { data, error } = await supabase
        .from('training_videos')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.log('No videos in database, using sample data');
        setVideos(sampleVideos);
      } else {
        setVideos(data && data.length > 0 ? data : sampleVideos);
      }
    } catch (error) {
      console.error('Error fetching videos:', error);
      setVideos(sampleVideos);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (profile?.user_type === 'athlete') {
      onNavigate('athlete-dashboard');
    } else {
      onNavigate('coach-dashboard');
    }
  };

  const getYouTubeVideoId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const getYouTubeThumbnail = (url: string) => {
    const videoId = getYouTubeVideoId(url);
    return videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : '';
  };

  const openVideo = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const filteredVideos = videos.filter(video => {
    const matchesSearch = video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         video.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSport = selectedSport === 'all' || video.sport === selectedSport;
    const matchesLevel = selectedLevel === 'all' || video.difficulty_level === selectedLevel;
    
    return matchesSearch && matchesSport && matchesLevel;
  });

  const sports = [...new Set(videos.map(v => v.sport).filter(Boolean))];
  const levels = [...new Set(videos.map(v => v.difficulty_level).filter(Boolean))];

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
            <h1 className="text-xl font-semibold text-gray-900">{t('training.title')}</h1>
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
                placeholder="Search training videos..."
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
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="all">All Levels</option>
              {levels.map(level => (
                <option key={level} value={level}>{level}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Videos Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVideos.map((video) => (
            <div key={video.id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative">
                <img
                  src={getYouTubeThumbnail(video.youtube_url)}
                  alt={video.title}
                  className="w-full h-48 object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.pexels.com/photos/863988/pexels-photo-863988.jpeg?auto=compress&cs=tinysrgb&w=480&h=270&dpr=1';
                  }}
                />
                <button
                  onClick={() => openVideo(video.youtube_url)}
                  className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 hover:bg-opacity-60 transition-all group"
                >
                  <div className="bg-white rounded-full p-4 group-hover:scale-110 transition-transform">
                    <Play className="h-8 w-8 text-orange-600" />
                  </div>
                </button>
                {video.difficulty_level && (
                  <div className="absolute top-4 right-4">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      video.difficulty_level === 'Beginner' ? 'bg-green-100 text-green-800' :
                      video.difficulty_level === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {video.difficulty_level}
                    </span>
                  </div>
                )}
              </div>
              <div className="p-6">
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{video.title}</h3>
                {video.description && (
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">{video.description}</p>
                )}
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <span>{video.sport}</span>
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>Video</span>
                  </div>
                </div>
                <button
                  onClick={() => openVideo(video.youtube_url)}
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
                >
                  <ExternalLink className="h-4 w-4" />
                  <span>Watch on YouTube</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredVideos.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Play className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No videos found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrainingVideosPage;