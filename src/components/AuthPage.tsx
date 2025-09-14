import React, { useState, useEffect } from 'react';
import { Trophy, User, UserCheck, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import LanguageSelector from './LanguageSelector';

interface AuthPageProps {
  onNavigate: (page: 'landing' | 'athlete-dashboard' | 'coach-dashboard') => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ onNavigate }) => {
  const { signUp, signIn, user, profile } = useAuth();
  const { t, language, setLanguage } = useLanguage();
  
  const [selectedUserType, setSelectedUserType] = useState<'athlete' | 'coach' | null>(null);
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    age: '',
    primarySport: '',
    locationState: '',
  });

  // Navigate to dashboard after successful authentication
  useEffect(() => {
    if (user && profile) {
      if (profile.user_type === 'athlete') {
        onNavigate('athlete-dashboard');
      } else if (profile.user_type === 'coach') {
        onNavigate('coach-dashboard');
      }
    }
  }, [user, profile, onNavigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserType) {
      setError('Please select whether you are an athlete or coach');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      if (isLogin) {
        console.log('Attempting signin with:', formData.email);
        await signIn(formData.email, formData.password);
      } else {
        if (formData.password !== formData.confirmPassword) {
          throw new Error(t('auth.passwordMismatch'));
        }
        
        if (!formData.fullName.trim()) {
          throw new Error('Full name is required');
        }
        
        console.log('Attempting signup with:', formData.email, selectedUserType);
        await signUp(formData.email, formData.password, {
          full_name: formData.fullName,
          user_type: selectedUserType,
          age: formData.age ? parseInt(formData.age) : undefined,
          primary_sport: formData.primarySport,
          location_state: formData.locationState,
          preferred_language: language,
        });
      }
      
      console.log('Authentication successful');
      // Navigation will be handled by the auth context and App component
    } catch (err: any) {
      console.error('Authentication error:', err);
      let errorMessage = err.message || t('auth.genericError');
      
      // Handle specific Supabase auth errors
      if (err.message?.includes('Invalid login credentials')) {
        errorMessage = isLogin ? t('auth.invalidCredentials') : t('auth.signupError');
      } else if (err.message?.includes('User already registered') || err.message?.includes('user_already_exists')) {
        if (!isLogin) {
          setIsLogin(true);
          errorMessage = t('auth.userExists');
        } else {
          errorMessage = t('auth.invalidCredentials');
        }
        errorMessage = t('auth.userExists');
      } else if (err.message?.includes('Password should be at least')) {
        errorMessage = t('auth.passwordTooShort');
      } else if (err.message?.includes('Invalid email')) {
        errorMessage = t('auth.invalidEmail');
      } else if (err.message?.includes('Email not confirmed')) {
        errorMessage = 'Please check your email and click the confirmation link';
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const sports = [
    'Athletics (Track & Field)',
    'Badminton',
    'Basketball',
    'Boxing',
    'Cricket',
    'Football',
    'Hockey',
    'Swimming',
    'Tennis',
    'Volleyball',
    'Wrestling',
  ];

  const states = [
    'Andhra Pradesh', 'Assam', 'Bihar', 'Gujarat', 'Haryana', 'Karnataka',
    'Kerala', 'Maharashtra', 'Odisha', 'Punjab', 'Rajasthan', 'Tamil Nadu',
    'Uttar Pradesh', 'West Bengal', 'Telangana', 'Madhya Pradesh'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <button
            onClick={() => onNavigate('landing')}
            className="inline-flex items-center text-gray-600 hover:text-gray-800 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            {t('common.back')}
          </button>
          <div className="flex justify-center mb-4">
            <LanguageSelector />
          </div>
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Trophy className="h-8 w-8 text-orange-600" />
            <span className="text-2xl font-bold text-gray-900">TalentEcosystem</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {isLogin ? t('auth.signIn') : t('auth.signUp')}
          </h1>
          <p className="text-gray-600">
            {isLogin ? 'Sign in to continue your journey' : 'Create your account to get started'}
          </p>
        </div>

        {/* User Type Selection */}
        <form onSubmit={handleAuth} className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">{t('auth.signUp')}:</h2>
          
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <button
              type="button"
              onClick={() => setSelectedUserType('athlete')}
              className={`p-4 rounded-lg border-2 transition-all ${
                selectedUserType === 'athlete'
                  ? 'border-orange-600 bg-orange-50 text-orange-600'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <User className="h-8 w-8 mx-auto mb-2" />
              <div className="font-medium">{t('auth.athlete')}</div>
              <div className="text-sm text-gray-500">Track progress, get discovered</div>
            </button>
            <button
              type="button"
              onClick={() => setSelectedUserType('coach')}
              className={`p-4 rounded-lg border-2 transition-all ${
                selectedUserType === 'coach'
                  ? 'border-blue-600 bg-blue-50 text-blue-600'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <UserCheck className="h-8 w-8 mx-auto mb-2" />
              <div className="font-medium">{t('auth.coach')}</div>
              <div className="text-sm text-gray-500">Discover and develop talent</div>
            </button>
          </div>

          {/* Form */}
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('auth.email')}
              </label>
              <input
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="your@email.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('auth.password')}
              </label>
              <div className="relative">
                <input
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            {!isLogin && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('auth.confirmPassword')}
                  </label>
                  <div className="relative">
                    <input
                      name="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('auth.fullName')}
                  </label>
                  <input
                    name="fullName"
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Your full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('auth.age')}
                  </label>
                  <input
                    name="age"
                    type="number"
                    min="10"
                    max="50"
                    value={formData.age}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Enter your age"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('auth.location')}
                  </label>
                  <select 
                    name="locationState"
                    value={formData.locationState}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    <option>Select your state</option>
                    {states.map(state => (
                      <option key={state} value={state}>{state}</option>
                    ))}
                  </select>
                </div>
                {selectedUserType === 'athlete' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('auth.primarySport')}
                    </label>
                    <select 
                      name="primarySport"
                      value={formData.primarySport}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    >
                      <option>Select your sport</option>
                      {sports.map(sport => (
                        <option key={sport} value={sport}>{sport}</option>
                      ))}
                    </select>
                  </div>
                )}
              </>
            )}
          </div>

          <button
            type="submit"
            disabled={!selectedUserType || loading}
            className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center min-h-[48px]"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                <span>{isLogin ? 'Signing in...' : 'Creating account...'}</span>
              </>
            ) : (
              isLogin ? t('auth.signIn') : t('auth.createAccount')
            )}
          </button>

          <div className="text-center mt-4">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-orange-600 hover:text-orange-700 text-sm"
            >
              {isLogin ? t('auth.dontHaveAccount') : t('auth.alreadyHaveAccount')}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

export default AuthPage;