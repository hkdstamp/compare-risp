'use client'

import { serviceMetadata } from '@/lib/pricing-catalog'
import { ResourceConfig } from '@/lib/types'
import { useLanguage } from '@/components/LanguageProvider'
import { ServerIcon, DatabaseIcon, ZapIcon, PackageIcon, PlusIcon, TrashIcon, InfoIcon } from '@/components/icons'

interface ResourceSelectorProps {
  resources: ResourceConfig[]
  onChange: (resources: ResourceConfig[]) => void
}

const ServiceIcon = ({ service, size = 24 }: { service: string; size?: number }) => {
  const iconClass = 'text-primary-600'
  switch (service) {
    case 'ec2':
      return <ServerIcon size={size} className={iconClass} />
    case 'rds':
      return <DatabaseIcon size={size} className={iconClass} />
    case 'elasticache':
      return <ZapIcon size={size} className={iconClass} />
    default:
      return <ServerIcon size={size} className={iconClass} />
  }
}

export default function ResourceSelector({ resources, onChange }: ResourceSelectorProps) {
  const { t } = useLanguage()
  const addResource = () => {
    const newResource: ResourceConfig = {
      service: 'ec2',
      instance: 't3.large',
      quantity: 1,
      usage: 1.0,
      coverage: 1.0
    }
    onChange([...resources, newResource])
  }

  const removeResource = (index: number) => {
    onChange(resources.filter((_, i) => i !== index))
  }

  const updateResource = (index: number, field: keyof ResourceConfig, value: any) => {
    const updated = [...resources]
    updated[index] = { ...updated[index], [field]: value }
    onChange(updated)
  }

  const getInstanceOptions = (service: string) => {
    return serviceMetadata[service as keyof typeof serviceMetadata]?.instances || []
  }

  return (
    <section className="bg-white rounded-xl shadow-lg p-6 border border-secondary-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-secondary-900 flex items-center gap-2">
          <PackageIcon size={24} className="text-primary-600" />
          {t('resourceTitle')}
        </h3>
        <button
          onClick={addResource}
          className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2 shadow-sm"
        >
          <PlusIcon size={18} />
          <span>{t('addResourceBtn')}</span>
        </button>
      </div>

      <div className="space-y-4">
        {resources.map((resource, index) => (
          <div
            key={index}
            className="p-4 bg-secondary-50 rounded-lg border border-secondary-200"
          >
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
              {/* Service Selection */}
              <div className="md:col-span-3">
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  {t('service')}
                </label>
                <select
                  value={resource.service}
                  onChange={(e) => {
                    const newService = e.target.value
                    const firstInstance = getInstanceOptions(newService)[0]?.value
                    const updated = [...resources]
                    updated[index] = {
                      ...updated[index],
                      service: newService,
                      instance: firstInstance || updated[index].instance
                    }
                    onChange(updated)
                  }}
                  className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white text-secondary-900"
                >
                  {Object.entries(serviceMetadata).map(([key, meta]) => (
                    <option key={key} value={key}>
                      {meta.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Instance Type Selection */}
              <div className="md:col-span-4">
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  {t('instanceType')}
                </label>
                <select
                  value={resource.instance}
                  onChange={(e) => updateResource(index, 'instance', e.target.value)}
                  className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white text-secondary-900"
                >
                  {getInstanceOptions(resource.service).map((inst) => (
                    <option key={inst.value} value={inst.value}>
                      {inst.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Quantity Input */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  {t('quantity')}
                </label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={resource.quantity}
                  onChange={(e) => updateResource(index, 'quantity', parseInt(e.target.value) || 1)}
                  className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white text-secondary-900"
                />
              </div>

              {/* Resource Summary */}
              <div className="md:col-span-2">
                <div className="flex flex-col items-center justify-center p-2 bg-white rounded-lg border border-secondary-200">
                  <ServiceIcon service={resource.service} size={28} />
                  <div className="text-sm font-semibold text-secondary-900 mt-1">× {resource.quantity}</div>
                </div>
              </div>

              {/* Remove Button */}
              <div className="md:col-span-1 flex items-end justify-center">
                <button
                  onClick={() => removeResource(index)}
                  disabled={resources.length === 1}
                  className="px-3 py-2 text-danger-600 hover:text-danger-700 hover:bg-danger-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  title="削除"
                >
                  <TrashIcon size={20} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 p-4 bg-primary-50 border border-primary-200 rounded-lg">
        <div className="flex items-start gap-3">
          <InfoIcon size={20} className="text-primary-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-secondary-800">
            <p className="font-semibold mb-1">{t('resourceHint')}：</p>
            <ul className="list-disc list-inside space-y-1">
              <li>{t('hint1')}</li>
              <li>{t('hint2')}</li>
              <li>{t('hint3')}</li>
              <li>{t('hint4')}</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between p-4 bg-secondary-100 rounded-lg border border-secondary-200">
        <div>
          <span className="text-sm font-medium text-secondary-700">{t('totalResources')}: </span>
          <span className="text-lg font-bold text-primary-600">
            {resources.reduce((sum, r) => sum + r.quantity, 0)} {t('units')}
          </span>
        </div>
        <div>
          <span className="text-sm font-medium text-secondary-700">{t('serviceTypes')}: </span>
          <span className="text-lg font-bold text-primary-600">
            {resources.length} {t('types')}
          </span>
        </div>
      </div>
    </section>
  )
}
