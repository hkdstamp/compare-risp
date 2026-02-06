'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations, Language, TranslationKey } from '@/lib/translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('ja');

  // Load saved language preference (if validation allows)
  useEffect(() => {
    // Check if we can access localStorage (might fail in iframe)
    try {
      const saved = localStorage.getItem('app_language') as Language;
      if (saved && (saved === 'ja' || saved === 'en')) {
        setLanguage(saved);
      }
    } catch (e) {
      console.warn('LocalStorage access denied (iframe context?)');
    }
  }, []);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    try {
      localStorage.setItem('app_language', lang);
    } catch (e) {
      // Ignore iframe errors
    }
    
    // Update HTML lang attribute for accessibility/browsers
    if (typeof document !== 'undefined') {
      document.documentElement.lang = lang;
    }
  };

  const t = (key: TranslationKey): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
