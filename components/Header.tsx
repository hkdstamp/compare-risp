'use client';

import { useLanguage } from './LanguageProvider';

export default function Header() {
  const { t } = useLanguage();

  return (
    <header className="bg-white rounded-xl shadow-lg p-6 mb-6">
      <div>
        <h1 className="text-2xl font-bold text-primary-600">
          {t('title')}
        </h1>
        <p className="text-gray-600 mt-2">
          {t('subtitle')}
        </p>
      </div>
    </header>
  )
}
