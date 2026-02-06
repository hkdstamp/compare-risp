'use client';

import { useLanguage } from './LanguageProvider';

export default function Header() {
  const { t, language, setLanguage } = useLanguage();

  return (
    <header className="bg-white rounded-xl shadow-lg p-6 mb-6">
      <div className="flex flex-col-reverse md:flex-row md:items-center justify-between gap-4 md:gap-0">
        <div>
          <h1 className="text-2xl font-bold text-primary-600">
            {t('title')}
          </h1>
          <p className="text-gray-600 mt-2">
            {t('subtitle')}
          </p>
        </div>
        <div className="self-start md:self-auto flex items-center bg-gray-100 rounded-lg p-1" role="group" aria-label="Language selection">
          <button
            onClick={() => setLanguage('ja')}
            aria-pressed={language === 'ja'}
            aria-label="Switch to Japanese language"
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
            aria-pressed={language === 'en'}
            aria-label="Switch to English language"
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
