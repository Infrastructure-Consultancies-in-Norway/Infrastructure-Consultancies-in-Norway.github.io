import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getTranslation } from '../translations/translations';

type Language = 'no' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  getImagePath: (path: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

interface LanguageProviderProps {
  children: React.ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [language, setLanguageState] = useState<Language>(() => {
    // First, check URL parameter
    const params = new URLSearchParams(location.search);
    const urlLang = params.get('lang');
    if (urlLang === 'en' || urlLang === 'no') {
      return urlLang;
    }
    // Fallback to localStorage
    const saved = localStorage.getItem('snacks-language');
    return (saved === 'en' ? 'en' : 'no') as Language;
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    // Update URL with language parameter
    const params = new URLSearchParams(location.search);
    params.set('lang', lang);
    navigate(`${location.pathname}?${params.toString()}`, { replace: true });
  };

  useEffect(() => {
    localStorage.setItem('snacks-language', language);
    // Sync URL with current language if not already set
    const params = new URLSearchParams(location.search);
    const urlLang = params.get('lang');
    if (urlLang !== language) {
      params.set('lang', language);
      navigate(`${location.pathname}?${params.toString()}`, { replace: true });
    }
  }, [language, location.pathname, location.search, navigate]);

  const t = (key: string): string => {
    return getTranslation(language, key);
  };

  const getImagePath = (path: string): string => {
    if (language === 'en') {
      // Check if this is a local path (starts with /)
      if (path.startsWith('/')) {
        const extension = path.substring(path.lastIndexOf('.'));
        const basePath = path.substring(0, path.lastIndexOf('.'));
        const engPath = `${basePath}(ENG)${extension}`;
        
        // Return the ENG version path - browser will show error if it doesn't exist
        // For better UX, we could implement a check, but for now we rely on 
        // the list of known ENG images
        const knownEngImages = [
          '/Historie01.png',
          '/Spatial_Breakdown_System_01.png',
          '/Spatial_Breakdown_System_04.png',
          '/Objekt-navn01.png',
          '/Egenskapssett01.png'
        ];
        
        if (knownEngImages.includes(path)) {
          return engPath;
        }
      }
    }
    return path;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, getImagePath }}>
      {children}
    </LanguageContext.Provider>
  );
};
