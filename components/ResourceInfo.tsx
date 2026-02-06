'use client';

import { useLanguage } from './LanguageProvider'

export default function ResourceInfo() {
  const { t } = useLanguage()
  const resources = [
    { icon: '🖥️', name: 'EC2 t3.large', quantity: 3 },
    { icon: '🖥️', name: 'EC2 t3.xlarge', quantity: 2 },
    { icon: '🗄️', name: 'RDS db.t4g.large', quantity: 2 },
  ]

  return (
    <section className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-4">
        📦 {t('resourceTitle')}
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {resources.map((resource, index) => (
          <div
            key={index}
            className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border-l-4 border-primary-600"
          >
            <span className="text-2xl">{resource.icon}</span>
            <div>
              <div className="font-semibold text-gray-900">{resource.name}</div>
              <div className="text-sm text-gray-600">× {resource.quantity}台</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
