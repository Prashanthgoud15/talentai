import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'hi' | 'te';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    // Navigation
    'nav.dashboard': 'Dashboard',
    'nav.assessment': 'Assessment',
    'nav.training': 'Training',
    'nav.community': 'Community',
    'nav.logout': 'Logout',
    
    // Landing Page
    'landing.title': 'Discover India\'s Hidden Champions',
    'landing.subtitle': 'AI-powered sports talent ecosystem that democratizes athlete discovery, provides scientific performance tracking, and bridges the gap between rural talent and world-class coaching.',
    'landing.startJourney': 'Start Your Journey',
    'landing.watchDemo': 'Watch Demo',
    
    // Auth
    'auth.signIn': 'Sign In',
    'auth.signUp': 'Sign Up',
    'auth.email': 'Email Address',
    'auth.password': 'Password',
    'auth.confirmPassword': 'Confirm Password',
    'auth.fullName': 'Full Name',
    'auth.age': 'Age',
    'auth.primarySport': 'Primary Sport',
    'auth.location': 'Location (State)',
    'auth.language': 'Preferred Language',
    'auth.athlete': 'Athlete',
    'auth.coach': 'Coach',
    'auth.createAccount': 'Create Account',
    'auth.alreadyHaveAccount': 'Already have an account? Sign in',
    'auth.dontHaveAccount': 'Don\'t have an account? Sign up',
    'auth.passwordMismatch': 'Passwords do not match',
    'auth.genericError': 'An error occurred. Please try again.',
    'auth.invalidCredentials': 'Invalid email or password. Please check your credentials and try again.',
    'auth.signupError': 'Failed to create account. Please try again.',
    'auth.userExists': 'An account with this email already exists. Please sign in instead.',
    'auth.passwordTooShort': 'Password must be at least 6 characters long',
    'auth.invalidEmail': 'Please enter a valid email address',
    
    // Dashboard
    'dashboard.performanceScore': 'Performance Score',
    'dashboard.trainingHours': 'Training Hours',
    'dashboard.rank': 'Rank',
    'dashboard.achievements': 'Achievements',
    'dashboard.newAssessment': 'New Assessment',
    'dashboard.watchTraining': 'Watch Training Videos',
    'dashboard.connectCoaches': 'Connect with Coaches',
    
    // Assessment
    'assessment.title': 'AI Performance Assessment',
    'assessment.selectType': 'Choose Your Assessment Type',
    'assessment.speed': 'Speed Assessment',
    'assessment.endurance': 'Endurance Test',
    'assessment.strength': 'Strength Assessment',
    'assessment.agility': 'Agility Test',
    'assessment.startRecording': 'Start Recording',
    'assessment.stopRecording': 'Stop Recording',
    'assessment.uploadVideo': 'Upload Video',
    'assessment.analyzing': 'AI Analysis in Progress',
    'assessment.results': 'Assessment Results',
    'assessment.shareResults': 'Share Results',
    
    // Training
    'training.title': 'Training Videos',
    'training.beginner': 'Beginner',
    'training.intermediate': 'Intermediate',
    'training.advanced': 'Advanced',
    
    // Common
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
    'common.back': 'Back',
    'common.continue': 'Continue',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
  },
  hi: {
    // Navigation
    'nav.dashboard': 'डैशबोर्ड',
    'nav.assessment': 'मूल्यांकन',
    'nav.training': 'प्रशिक्षण',
    'nav.community': 'समुदाय',
    'nav.logout': 'लॉग आउट',
    
    // Landing Page
    'landing.title': 'भारत के छुपे हुए चैंपियन खोजें',
    'landing.subtitle': 'AI-संचालित खेल प्रतिभा पारिस्थितिकी तंत्र जो एथलीट खोज को लोकतांत्रिक बनाता है, वैज्ञानिक प्रदर्शन ट्रैकिंग प्रदान करता है।',
    'landing.startJourney': 'अपनी यात्रा शुरू करें',
    'landing.watchDemo': 'डेमो देखें',
    
    // Auth
    'auth.signIn': 'साइन इन',
    'auth.signUp': 'साइन अप',
    'auth.email': 'ईमेल पता',
    'auth.password': 'पासवर्ड',
    'auth.confirmPassword': 'पासवर्ड की पुष्टि करें',
    'auth.fullName': 'पूरा नाम',
    'auth.age': 'उम्र',
    'auth.primarySport': 'मुख्य खेल',
    'auth.location': 'स्थान (राज्य)',
    'auth.language': 'पसंदीदा भाषा',
    'auth.athlete': 'एथलीट',
    'auth.coach': 'कोच',
    'auth.createAccount': 'खाता बनाएं',
    'auth.alreadyHaveAccount': 'पहले से खाता है? साइन इन करें',
    'auth.dontHaveAccount': 'खाता नहीं है? साइन अप करें',
    'auth.passwordMismatch': 'पासवर्ड मेल नहीं खाते',
    'auth.genericError': 'एक त्रुटि हुई। कृपया पुनः प्रयास करें।',
    'auth.invalidCredentials': 'गलत ईमेल या पासवर्ड। कृपया अपनी जानकारी जांचें और पुनः प्रयास करें।',
    'auth.signupError': 'खाता बनाने में असफल। कृपया पुनः प्रयास करें।',
    'auth.userExists': 'इस ईमेल के साथ पहले से खाता मौजूद है। कृपया साइन इन करें।',
    'auth.passwordTooShort': 'पासवर्ड कम से कम 6 अक्षर का होना चाहिए',
    'auth.invalidEmail': 'कृपया एक वैध ईमेल पता दर्ज करें',
    
    // Dashboard
    'dashboard.performanceScore': 'प्रदर्शन स्कोर',
    'dashboard.trainingHours': 'प्रशिक्षण घंटे',
    'dashboard.rank': 'रैंक',
    'dashboard.achievements': 'उपलब्धियां',
    'dashboard.newAssessment': 'नया मूल्यांकन',
    'dashboard.watchTraining': 'प्रशिक्षण वीडियो देखें',
    'dashboard.connectCoaches': 'कोच से जुड़ें',
    
    // Assessment
    'assessment.title': 'AI प्रदर्शन मूल्यांकन',
    'assessment.selectType': 'अपना मूल्यांकन प्रकार चुनें',
    'assessment.speed': 'गति मूल्यांकन',
    'assessment.endurance': 'सहनशीलता परीक्षण',
    'assessment.strength': 'शक्ति मूल्यांकन',
    'assessment.agility': 'चपलता परीक्षण',
    'assessment.startRecording': 'रिकॉर्डिंग शुरू करें',
    'assessment.stopRecording': 'रिकॉर्डिंग बंद करें',
    'assessment.uploadVideo': 'वीडियो अपलोड करें',
    'assessment.analyzing': 'AI विश्लेषण प्रगति में',
    'assessment.results': 'मूल्यांकन परिणाम',
    'assessment.shareResults': 'परिणाम साझा करें',
    
    // Training
    'training.title': 'प्रशिक्षण वीडियो',
    'training.beginner': 'शुरुआती',
    'training.intermediate': 'मध्यम',
    'training.advanced': 'उन्नत',
    
    // Common
    'common.loading': 'लोड हो रहा है...',
    'common.error': 'त्रुटि',
    'common.success': 'सफलता',
    'common.back': 'वापस',
    'common.continue': 'जारी रखें',
    'common.save': 'सेव करें',
    'common.cancel': 'रद्द करें',
  },
  te: {
    // Navigation
    'nav.dashboard': 'డాష్‌బోర్డ్',
    'nav.assessment': 'అంచనా',
    'nav.training': 'శిక్షణ',
    'nav.community': 'సమాజం',
    'nav.logout': 'లాగ్ అవుట్',
    
    // Landing Page
    'landing.title': 'భారతదేశ దాచిన ఛాంపియన్‌లను కనుగొనండి',
    'landing.subtitle': 'AI-శక్తితో కూడిన క్రీడా ప్రతిభ పర్యావరణ వ్యవస్థ అథ్లెట్ కనుగొనడాన్ని ప్రజాస్వామ్యీకరిస్తుంది, శాస్త్రీయ పనితీరు ట్రాకింగ్ అందిస్తుంది.',
    'landing.startJourney': 'మీ ప్రయాణాన్ని ప్రారంభించండి',
    'landing.watchDemo': 'డెమో చూడండి',
    
    // Auth
    'auth.signIn': 'సైన్ ఇన్',
    'auth.signUp': 'సైన్ అప్',
    'auth.email': 'ఇమెయిల్ చిరునామా',
    'auth.password': 'పాస్‌వర్డ్',
    'auth.confirmPassword': 'పాస్‌వర్డ్ నిర్ధారించండి',
    'auth.fullName': 'పూర్తి పేరు',
    'auth.age': 'వయస్సు',
    'auth.primarySport': 'ప్రధాన క్రీడ',
    'auth.location': 'స్థానం (రాష్ట్రం)',
    'auth.language': 'ప్రాధాన్య భాష',
    'auth.athlete': 'అథ్లెట్',
    'auth.coach': 'కోచ్',
    'auth.createAccount': 'ఖాతా సృష్టించండి',
    'auth.alreadyHaveAccount': 'ఇప్పటికే ఖాతా ఉందా? సైన్ ఇన్ చేయండి',
    'auth.dontHaveAccount': 'ఖాతా లేదా? సైన్ అప్ చేయండి',
    'auth.passwordMismatch': 'పాస్‌వర్డ్‌లు సరిపోలలేదు',
    'auth.genericError': 'లోపం సంభవించింది. దయచేసి మళ్లీ ప్రయత్నించండి.',
    'auth.invalidCredentials': 'తప్పు ఇమెయిల్ లేదా పాస్‌వర్డ్. దయచేసి మీ వివరాలను తనిఖీ చేసి మళ్లీ ప్రయత్నించండి.',
    'auth.signupError': 'ఖాతా సృష్టించడంలో విఫలమైంది. దయచేసి మళ్లీ ప్రయత్నించండి.',
    'auth.userExists': 'ఈ ఇమెయిల్‌తో ఖాతా ఇప్పటికే ఉంది. దయచేసి సైన్ ఇన్ చేయండి.',
    'auth.passwordTooShort': 'పాస్‌వర్డ్ కనీసం 6 అక్షరాలు ఉండాలి',
    'auth.invalidEmail': 'దయచేసి చెల్లుబాటు అయ్యే ఇమెయిల్ చిరునామా నమోదు చేయండి',
    
    // Dashboard
    'dashboard.performanceScore': 'పనితీరు స్కోర్',
    'dashboard.trainingHours': 'శిక్షణ గంటలు',
    'dashboard.rank': 'ర్యాంక్',
    'dashboard.achievements': 'విజయాలు',
    'dashboard.newAssessment': 'కొత్త అంచనా',
    'dashboard.watchTraining': 'శిక్షణ వీడియోలు చూడండి',
    'dashboard.connectCoaches': 'కోచ్‌లతో కనెక్ట్ అవ్వండి',
    
    // Assessment
    'assessment.title': 'AI పనితీరు అంచనా',
    'assessment.selectType': 'మీ అంచనా రకాన్ని ఎంచుకోండి',
    'assessment.speed': 'వేగం అంచనా',
    'assessment.endurance': 'సహనశీలత పరీక్ష',
    'assessment.strength': 'బలం అంచనా',
    'assessment.agility': 'చురుకుదనం పరీక్ష',
    'assessment.startRecording': 'రికార్డింగ్ ప్రారంభించండి',
    'assessment.stopRecording': 'రికార్డింగ్ ఆపండి',
    'assessment.uploadVideo': 'వీడియో అప్‌లోడ్ చేయండి',
    'assessment.analyzing': 'AI విశ్లేషణ ప్రగతిలో',
    'assessment.results': 'అంచనా ఫలితాలు',
    'assessment.shareResults': 'ఫలితాలను పంచుకోండి',
    
    // Training
    'training.title': 'శిక్షణ వీడియోలు',
    'training.beginner': 'ప్రారంభకుడు',
    'training.intermediate': 'మధ్యస్థ',
    'training.advanced': 'అధునాతన',
    
    // Common
    'common.loading': 'లోడ్ అవుతోంది...',
    'common.error': 'లోపం',
    'common.success': 'విజయం',
    'common.back': 'వెనుకకు',
    'common.continue': 'కొనసాగించు',
    'common.save': 'సేవ్ చేయండి',
    'common.cancel': 'రద్దు చేయండి',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('preferred_language') as Language;
    if (savedLanguage && ['en', 'hi', 'te'].includes(savedLanguage)) {
      setLanguage(savedLanguage);
    }
  }, []);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('preferred_language', lang);
  };

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[typeof language]] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};