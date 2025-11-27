'use client'

import { useState } from 'react'
import { formatPercentage } from '@/lib/utils'

interface SimulationConfigProps {
  onSimulate: (params: any) => void
  isLoading: boolean
}

export default function SimulationConfig({ onSimulate, isLoading }: SimulationConfigProps) {
  const [insurance, setInsurance] = useState('1y')
  const [standardTerm, setStandardTerm] = useState('1yr')
  const [standardOption, setStandardOption] = useState('NoUpfront')
  const [coverage, setCoverage] = useState(100)
  const [usage, setUsage] = useState(100)

  const handleSimulate = () => {
    onSimulate({
      insurance,
      standard_term: standardTerm,
      standard_option: standardOption,
      coverage: coverage / 100,
      usage: usage / 100
    })
  }

  const handleReset = () => {
    setInsurance('1y')
    setStandardTerm('1yr')
    setStandardOption('NoUpfront')
    setCoverage(100)
    setUsage(100)
  }

  return (
    <section className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-3 border-b-4 border-primary-600">
        シミュレーション設定
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {/* Insurance Plan */}
        <div className="flex flex-col">
          <label className="flex items-center gap-2 font-semibold text-gray-700 mb-2">
            <span className="text-xl">🛡️</span>
            保険RI/SPプラン
          </label>
          <select
            value={insurance}
            onChange={(e) => setInsurance(e.target.value)}
            className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition"
          >
            <option value="30d">30日保証 (30%割引 / 50%保険料)</option>
            <option value="1y">1年保証 (45%割引 / 33%保険料)</option>
          </select>
          <small className="text-gray-500 mt-1">保証期間終了後、未使用分は返金</small>
        </div>

        {/* Standard Term */}
        <div className="flex flex-col">
          <label className="flex items-center gap-2 font-semibold text-gray-700 mb-2">
            <span className="text-xl">📅</span>
            標準RI/SP 契約期間
          </label>
          <select
            value={standardTerm}
            onChange={(e) => setStandardTerm(e.target.value)}
            className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition"
          >
            <option value="1yr">1年予約</option>
            <option value="3yr">3年予約</option>
          </select>
        </div>

        {/* Standard Option */}
        <div className="flex flex-col">
          <label className="flex items-center gap-2 font-semibold text-gray-700 mb-2">
            <span className="text-xl">💰</span>
            標準RI/SP タイプ
          </label>
          <select
            value={standardOption}
            onChange={(e) => setStandardOption(e.target.value)}
            className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition"
          >
            <optgroup label="Reserved Instance (RI)">
              <option value="NoUpfront">RI - NoUpfront (全額後払い)</option>
              <option value="PartialUpfront">RI - PartialUpfront (50%前払い)</option>
              <option value="AllUpfront">RI - AllUpfront (100%前払い)</option>
            </optgroup>
            <optgroup label="Savings Plans (SP)">
              <option value="SavingsPlan">SP - Compute Savings Plan</option>
            </optgroup>
          </select>
        </div>

        {/* Coverage */}
        <div className="flex flex-col">
          <label className="flex items-center gap-2 font-semibold text-gray-700 mb-2">
            <span className="text-xl">📊</span>
            想定カバレッジ: <span className="text-primary-600">{formatPercentage(coverage / 100)}</span>
          </label>
          <input
            type="range"
            min="0"
            max="100"
            step="5"
            value={coverage}
            onChange={(e) => setCoverage(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
          />
          <small className="text-gray-500 mt-1">リソース全体の何%をRI/SPでカバーするか</small>
        </div>

        {/* Usage */}
        <div className="flex flex-col">
          <label className="flex items-center gap-2 font-semibold text-gray-700 mb-2">
            <span className="text-xl">⚡</span>
            想定利用率: <span className="text-primary-600">{formatPercentage(usage / 100)}</span>
          </label>
          <input
            type="range"
            min="0"
            max="100"
            step="5"
            value={usage}
            onChange={(e) => setUsage(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
          />
          <small className="text-gray-500 mt-1">リソースの実稼働率</small>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 flex-wrap">
        <button
          onClick={handleSimulate}
          disabled={isLoading}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className="text-xl">🚀</span>
          シミュレーション実行
        </button>
        <button
          onClick={handleReset}
          disabled={isLoading}
          className="flex items-center gap-2 px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className="text-xl">🔄</span>
          リセット
        </button>
      </div>
    </section>
  )
}
