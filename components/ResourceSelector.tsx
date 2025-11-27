'use client'

import { serviceMetadata } from '@/lib/pricing-catalog'
import { ResourceConfig } from '@/lib/types'

interface ResourceSelectorProps {
  resources: ResourceConfig[]
  onChange: (resources: ResourceConfig[]) => void
}

const serviceIcons: Record<string, string> = {
  ec2: '🖥️',
  rds: '🗄️',
  elasticache: '⚡'
}

export default function ResourceSelector({ resources, onChange }: ResourceSelectorProps) {
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
    <section className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-gray-900">
          📦 シミュレーション対象リソース (東京リージョン)
        </h3>
        <button
          onClick={addResource}
          className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
        >
          <span>+</span>
          <span>リソース追加</span>
        </button>
      </div>

      <div className="space-y-4">
        {resources.map((resource, index) => (
          <div
            key={index}
            className="p-4 bg-gray-50 rounded-lg border border-gray-200"
          >
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
              {/* Service Selection */}
              <div className="md:col-span-3">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  サービス
                </label>
                <select
                  value={resource.service}
                  onChange={(e) => {
                    const newService = e.target.value
                    const firstInstance = getInstanceOptions(newService)[0]?.value
                    updateResource(index, 'service', newService)
                    if (firstInstance) {
                      updateResource(index, 'instance', firstInstance)
                    }
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  {Object.entries(serviceMetadata).map(([key, meta]) => (
                    <option key={key} value={key}>
                      {serviceIcons[key]} {meta.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Instance Type Selection */}
              <div className="md:col-span-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  インスタンスタイプ
                </label>
                <select
                  value={resource.instance}
                  onChange={(e) => updateResource(index, 'instance', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  台数
                </label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={resource.quantity}
                  onChange={(e) => updateResource(index, 'quantity', parseInt(e.target.value) || 1)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              {/* Resource Summary */}
              <div className="md:col-span-2">
                <div className="text-center p-2 bg-white rounded-lg border border-gray-200">
                  <div className="text-2xl mb-1">{serviceIcons[resource.service]}</div>
                  <div className="text-sm font-semibold text-gray-900">× {resource.quantity}</div>
                </div>
              </div>

              {/* Remove Button */}
              <div className="md:col-span-1 flex items-end justify-center">
                <button
                  onClick={() => removeResource(index)}
                  disabled={resources.length === 1}
                  className="px-3 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  title="削除"
                >
                  🗑️
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-start gap-2">
          <span className="text-blue-600 text-lg">ℹ️</span>
          <div className="text-sm text-blue-900">
            <p className="font-semibold mb-1">リソース選択のヒント：</p>
            <ul className="list-disc list-inside space-y-1">
              <li>予約可能なAWSサービス（EC2、RDS、ElastiCache）を選択できます</li>
              <li>複数のインスタンスタイプを組み合わせてシミュレーション可能</li>
              <li>台数は1〜100台まで指定できます</li>
              <li>最低1つのリソースが必要です</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between p-4 bg-gray-100 rounded-lg">
        <div>
          <span className="text-sm font-medium text-gray-700">合計リソース数: </span>
          <span className="text-lg font-bold text-primary-600">
            {resources.reduce((sum, r) => sum + r.quantity, 0)} 台
          </span>
        </div>
        <div>
          <span className="text-sm font-medium text-gray-700">サービス種類: </span>
          <span className="text-lg font-bold text-primary-600">
            {resources.length} 種類
          </span>
        </div>
      </div>
    </section>
  )
}
