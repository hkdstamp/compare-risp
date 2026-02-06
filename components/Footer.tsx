'use client';

import { useLanguage } from './LanguageProvider'

export default function Footer() {
  const { t } = useLanguage()

  return (
    <footer className="text-center py-6 mt-8">
      <p className="text-secondary-400 text-sm">
        {t('footerRights')}
      </p>
    </footer>
  )
}
