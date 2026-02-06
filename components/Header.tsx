'use client';

import { useLanguage } from './LanguageProvider';

export default function Header() {
  const { t, language, setLanguage } = useLanguage();

  return (
    <header className="bg-white rounded-xl shadow-lg p-6 mb-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
            {t('title')}
          </h1>
          <p className="text-gray-600 mt-2">
            {t('subtitle')}
          </p>
        </div>
        <div className="flex items-center bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setLanguage('ja')}
            className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
              language === 'ja'
                ? 'bg-white text-primary-600 shadow-sm'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            Japanese
          </button>
          <button
            onClick={() => setLanguage('en')}
            className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
              language === 'en'
                ? 'bg-white text-primary-600 shadow-sm'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            English
          </button>
        </div>
      </div>
    </header>
  )
}
