import React, { createContext, useContext, useState, useEffect } from 'react';
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
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('snacks-language');
    return (saved === 'en' ? 'en' : 'no') as Language;
  });

  useEffect(() => {
    localStorage.setItem('snacks-language', language);
  }, [language]);

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
