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
    // 1. First priority: Post-load override check from Referrer
    // If referrer is explicitly Japanese, force Japanese.
    // If referrer is NOT Japanese but we are in a Webflow context, default to English.
    if (typeof document !== 'undefined' && document.referrer) {
      if (document.referrer.includes('/jp/')) {
        setLanguage('ja');
        return;
      }
      // If referrer exists but isn't JP, and we know it's our site, prefer EN.
      // This handles the case where the English site is root '/' without '/en/' segment.
      if (document.referrer.includes('alphaus') || document.referrer.includes('webflow')) {
         setLanguage('en');
         return;
      }
    }

    // 2. Third priority: localStorage
    try {
      const saved = localStorage.getItem('app_language') as Language;
      if (saved && (saved === 'ja' || saved === 'en')) {
        setLanguage(saved);
        return;
      }
    } catch (e) {
      console.warn('LocalStorage access denied (iframe context?)');
    }

    // 3. Fallback: Browser language
    if (typeof navigator !== 'undefined' && navigator.language.startsWith('en')) {
      setLanguage('en');
    }
  }, []);

  // Listen for language change messages (e.g., from Webflow parent)
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Accept messages like { type: 'SET_LANGUAGE', lang: 'en' }
      if (event.data && event.data.type === 'SET_LANGUAGE') {
        const newLang = event.data.lang;
        if (newLang === 'ja' || newLang === 'en') {
          handleSetLanguage(newLang);
        }
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('message', handleMessage);
      return () => window.removeEventListener('message', handleMessage);
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
