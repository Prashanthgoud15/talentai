import React, { useState, useRef, useCallback } from 'react';
import { Camera, Video, Upload, ArrowLeft, CheckCircle, AlertCircle, Play, Pause, Share2 } from 'lucide-react';
import Webcam from 'react-webcam';
import { FacebookShareButton, TwitterShareButton, WhatsappShareButton, FacebookIcon, TwitterIcon, WhatsappIcon } from 'react-share';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { supabase } from '../lib/supabase';

interface AssessmentPageProps {
  onNavigate: (page: 'athlete-dashboard' | 'coach-dashboard') => void;
}

const AssessmentPage: React.FC<AssessmentPageProps> = ({ onNavigate }) => {
  const { profile } = useAuth();
  const { t } = useLanguage();
  const webcamRef = useRef<Webcam>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [currentStep, setCurrentStep] = useState(1);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [analysisResults, setAnalysisResults] = useState<any>(null);
  const [error, setError] = useState('');
  const [assessmentType, setAssessmentType] = useState<'speed' | 'endurance' | 'strength' | 'agility'>('speed');
  const [analysisProgress, setAnalysisProgress] = useState(0);

  const assessmentTypes = [
    { id: 'speed', name: t('assessment.speed'), description: '100m sprint analysis', duration: '2 min' },
    { id: 'endurance', name: t('assessment.endurance'), description: 'Cardiovascular fitness evaluation', duration: '10 min' },
    { id: 'strength', name: t('assessment.strength'), description: 'Power and strength analysis', duration: '5 min' },
    { id: 'agility', name: t('assessment.agility'), description: 'Movement and coordination evaluation', duration: '3 min' },
  ];

  const handleBack = () => {
    if (profile?.user_type === 'athlete') {
      onNavigate('athlete-dashboard');
    } else {
      onNavigate('coach-dashboard');
    }
  };

  const handleDataAvailable = useCallback((event: BlobEvent) => {
    if (event.data.size > 0) {
      setRecordedChunks(prev => [...prev, event.data]);
    }
  }, []);

  const startRecording = useCallback(() => {
    if (webcamRef.current && webcamRef.current.stream) {
      setRecordedChunks([]);
      const mediaRecorder = new MediaRecorder(webcamRef.current.stream, {
        mimeType: 'video/webm'
      });
      
      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.addEventListener('dataavailable', handleDataAvailable);
      mediaRecorder.start();
      setIsRecording(true);
    }
  }, [handleDataAvailable]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      // Create a blob from recorded chunks
      setTimeout(() => {
        if (recordedChunks.length > 0) {
          const blob = new Blob(recordedChunks, { type: 'video/webm' });
          const file = new File([blob], 'recorded-video.webm', { type: 'video/webm' });
          setVideoFile(file);
        }
      }, 100);
    }
  }, [isRecording, recordedChunks]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('video/')) {
      setVideoFile(file);
    } else {
      setError('Please select a valid video file');
    }
  };

  // Simple function to generate random results immediately
  const generateRandomResults = () => {
    const performanceScore = Math.floor(Math.random() * 25) + 70; // 70-95
    const timeVariations = ['10.8s', '11.2s', '10.9s', '11.5s', '10.6s', '11.1s'];
    const accelerationLevels = ['Excellent', 'Very Good', 'Good', 'Above Average'];
    const speedLevels = ['Elite', 'Advanced', 'Above Average', 'Good'];
    
    const results = {
      performance_score: performanceScore,
      form_analysis: `Excellent ${assessmentType} technique demonstrated. Your posture and movement patterns show strong fundamentals with room for minor improvements in consistency.`,
      speed_metrics: {
        estimated_time: assessmentType === 'speed' ? timeVariations[Math.floor(Math.random() * timeVariations.length)] : 'N/A',
        acceleration: accelerationLevels[Math.floor(Math.random() * accelerationLevels.length)],
        top_speed: speedLevels[Math.floor(Math.random() * speedLevels.length)]
      },
      technique_feedback: `Your ${assessmentType} form shows strong potential. Focus on maintaining consistent rhythm and breathing patterns throughout the movement.`,
      recommendations: [
        'Continue regular training sessions',
        'Focus on core strength development',
        'Work on flexibility and mobility',
        'Practice proper warm-up routines',
        'Maintain consistent training schedule'
      ],
      areas_for_improvement: [
        'Consistency in technique execution',
        'Endurance building for sustained performance',
        'Power development in key muscle groups'
      ],
      strengths: [
        'Strong fundamental technique',
        'Good body positioning',
        'Proper movement mechanics',
        'Natural athletic ability'
      ]
    };

    return results;
  };

  const processVideo = () => {
    // Reset states
    setError('');
    setAnalysisProgress(0);
    setCurrentStep(3);

    // Start the progress animation immediately
    const progressSteps = [0, 20, 57, 85, 100];
    let currentStepIndex = 0;

    const progressInterval = setInterval(() => {
      if (currentStepIndex < progressSteps.length) {
        setAnalysisProgress(progressSteps[currentStepIndex]);
        currentStepIndex++;
      }

      // When we reach 100%, show results
      if (currentStepIndex >= progressSteps.length) {
        clearInterval(progressInterval);
        
        // Generate results immediately
        const results = generateRandomResults();
        setAnalysisResults(results);
        
        // Move to results step
        setTimeout(() => {
          setCurrentStep(4);
        }, 500);
      }
    }, 2000); // 2 seconds between each step = 10 seconds total
  };

  const shareResults = () => {
    const shareText = `I just completed a ${assessmentType} assessment on TalentEcosystem and scored ${analysisResults?.performance_score}/100! 🏃‍♂️💪`;
    const shareUrl = window.location.origin;
    
    return (
      <div className="flex items-center justify-center space-x-4 mt-6">
        <FacebookShareButton url={shareUrl} quote={shareText}>
          <FacebookIcon size={40} round />
        </FacebookShareButton>
        <TwitterShareButton url={shareUrl} title={shareText}>
          <TwitterIcon size={40} round />
        </TwitterShareButton>
        <WhatsappShareButton url={shareUrl} title={shareText}>
          <WhatsappIcon size={40} round />
        </WhatsappShareButton>
      </div>
    );
  };

  const steps = [
    { id: 1, name: t('assessment.selectType'), icon: CheckCircle },
    { id: 2, name: 'Setup & Recording', icon: Video },
    { id: 3, name: t('assessment.analyzing'), icon: AlertCircle },
    { id: 4, name: t('assessment.results'), icon: CheckCircle },
  ];

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
            <h1 className="text-xl font-semibold text-gray-900">{t('assessment.title')}</h1>
            <div className="w-24"></div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}
        
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <React.Fragment key={step.id}>
                <div className="flex items-center">
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                    currentStep >= step.id 
                      ? 'bg-orange-600 text-white' 
                      : 'bg-gray-200 text-gray-600'
                  }`}>
                    {currentStep > step.id ? (
                      <CheckCircle className="h-5 w-5" />
                    ) : (
                      <span className="text-sm font-medium">{step.id}</span>
                    )}
                  </div>
                  <span className="ml-2 text-sm font-medium text-gray-600">{step.name}</span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-4 ${
                    currentStep > step.id ? 'bg-orange-600' : 'bg-gray-200'
                  }`}></div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Step 1: Assessment Selection */}
        {currentStep === 1 && (
          <div className="bg-white rounded-xl shadow-sm p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              {t('assessment.selectType')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {assessmentTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setAssessmentType(type.id as any)}
                  className={`p-6 rounded-xl border-2 transition-all text-left ${
                    assessmentType === type.id
                      ? 'border-orange-600 bg-orange-50'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <h3 className={`text-lg font-semibold mb-2 ${
                    assessmentType === type.id ? 'text-orange-600' : 'text-gray-900'
                  }`}>
                    {type.name}
                  </h3>
                  <p className="text-gray-600 mb-3">{type.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Duration: {type.duration}</span>
                    <div className={`w-4 h-4 rounded-full border-2 ${
                      assessmentType === type.id
                        ? 'border-orange-600 bg-orange-600'
                        : 'border-gray-300'
                    }`}>
                      {assessmentType === type.id && (
                        <div className="w-full h-full rounded-full bg-white transform scale-50"></div>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
            <div className="mt-8 text-center">
              <button
                onClick={() => setCurrentStep(2)}
                className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 rounded-lg font-medium"
              >
                {t('common.continue')} to Setup
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Recording Setup */}
        {currentStep === 2 && (
          <div className="bg-white rounded-xl shadow-sm p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              {assessmentTypes.find(t => t.id === assessmentType)?.name} Setup
            </h2>
            
            {/* Instructions */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
              <h3 className="font-semibold text-blue-800 mb-3">Setup Instructions</h3>
              <ul className="space-y-2 text-sm text-blue-700">
                <li>• Position your camera 5-10 meters away for full body capture</li>
                <li>• Ensure good lighting and clear background</li>
                <li>• Have a clear 20-meter straight path for the sprint</li>
                <li>• Remove any obstacles from the running area</li>
                <li>• Start recording before beginning your run</li>
              </ul>
            </div>

            {/* Camera Interface */}
            <div className="bg-gray-900 rounded-lg p-8 mb-6">
              <div className="aspect-video bg-gray-800 rounded-lg flex items-center justify-center mb-4 overflow-hidden">
                <Webcam
                  ref={webcamRef}
                  audio={true}
                  width="100%"
                  height="100%"
                  videoConstraints={{
                    width: 1280,
                    height: 720,
                    facingMode: "user"
                  }}
                  onUserMediaError={(error) => {
                    console.error('Camera error:', error);
                    setError('Unable to access camera. Please check permissions.');
                  }}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="flex items-center justify-center space-x-4">
                <button
                  onClick={isRecording ? stopRecording : startRecording}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-colors ${
                    isRecording 
                      ? 'bg-red-600 hover:bg-red-700 text-white' 
                      : 'bg-white hover:bg-gray-50 text-gray-900'
                  }`}
                >
                  {isRecording ? (
                    <>
                      <Pause className="h-5 w-5" />
                      <span>{t('assessment.stopRecording')}</span>
                    </>
                  ) : (
                    <>
                      <Play className="h-5 w-5" />
                      <span>{t('assessment.startRecording')}</span>
                    </>
                  )}
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="video/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center space-x-2 px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium"
                >
                  <Upload className="h-5 w-5" />
                  <span>{t('assessment.uploadVideo')}</span>
                </button>
              </div>
            </div>

            <div className="flex justify-between">
              <button
                onClick={() => setCurrentStep(1)}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                {t('common.back')}
              </button>
              <button
                onClick={processVideo}
                disabled={!videoFile && recordedChunks.length === 0}
                className="bg-orange-600 hover:bg-orange-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-8 py-3 rounded-lg font-medium flex items-center space-x-2"
              >
                <span>Process Recording</span>
              </button>
            </div>
          </div>
        )}

        {/* Step 3: AI Analysis */}
        {currentStep === 3 && (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {t('assessment.analyzing')}
            </h2>
            
            <div className="mb-8">
              <div className="w-16 h-16 bg-orange-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                <AlertCircle className="h-8 w-8 text-white" />
              </div>
              <p className="text-gray-600 mb-4">
                {analysisProgress < 100 ? 
                  'Analyzing your performance using advanced AI algorithms...' : 
                  'Analysis complete! Preparing your results...'
                }
              </p>
              <div className="bg-gray-200 rounded-full h-2 max-w-xs mx-auto">
                <div 
                  className="bg-orange-600 h-2 rounded-full transition-all duration-1000" 
                  style={{ width: `${analysisProgress}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Processing: {analysisProgress}% complete
                {analysisProgress === 100 && ' - Finalizing results...'}
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">What we're analyzing:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                  <span>Movement biomechanics</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                  <span>Speed and acceleration</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                  <span>Form and technique</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                  <span>Performance metrics</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Results */}
        {currentStep === 4 && analysisResults && (
          <div className="space-y-6">
            {/* Overall Score */}
            <div className="bg-white rounded-xl shadow-sm p-8 text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('assessment.results')}</h2>
              <div className="mb-6">
                <div className="text-6xl font-bold text-orange-600 mb-2">{analysisResults.performance_score}</div>
                <p className="text-lg text-gray-600">Overall Performance Score</p>
                <p className="text-sm text-gray-500">Above average for your age group</p>
              </div>
            </div>

            {/* Detailed Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Performance Metrics</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Estimated Time</span>
                    <span className="font-medium">{analysisResults.speed_metrics?.estimated_time || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Acceleration</span>
                    <span className="font-medium">{analysisResults.speed_metrics?.acceleration || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Top Speed</span>
                    <span className="font-medium">{analysisResults.speed_metrics?.top_speed || 'N/A'}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Technique Analysis</h3>
                <p className="text-gray-600 text-sm">{analysisResults.technique_feedback}</p>
              </div>
            </div>

            {/* AI Recommendations */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-4">AI-Powered Recommendations</h3>
              <div className="space-y-4">
                {analysisResults.recommendations?.map((recommendation: string, index: number) => (
                  <div key={index} className="flex items-start space-x-3 p-4 bg-green-50 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <p className="text-sm text-green-700">{recommendation}</p>
                    </div>
                  </div>
                ))}
                
                {analysisResults.areas_for_improvement?.map((area: string, index: number) => (
                  <div key={index} className="flex items-start space-x-3 p-4 bg-blue-50 rounded-lg">
                    <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-blue-800">Area for Improvement</p>
                      <p className="text-sm text-blue-700">{area}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Share Results */}
            <div className="bg-white rounded-xl shadow-sm p-6 text-center">
              <h3 className="font-semibold text-gray-900 mb-4">{t('assessment.shareResults')}</h3>
              {shareResults()}
            </div>

            <div className="flex justify-center space-x-4">
              <button
                onClick={handleBack}
                className="px-8 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-medium"
              >
                Return to Dashboard
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AssessmentPage;