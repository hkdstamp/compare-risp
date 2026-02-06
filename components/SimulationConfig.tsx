'use client'

import { useState } from 'react'
import { formatPercentage } from '@/lib/utils'
import { useLanguage } from '@/components/LanguageProvider'
import DiscountRateInfo from '@/components/ui/DiscountRateInfo'
import { ShieldIcon, CalendarIcon, DollarIcon, ChartBarIcon, ActivityIcon, RocketIcon, RefreshIcon, InfoIcon } from '@/components/icons'

interface SimulationConfigProps {
  onSimulate: (params: any) => void
  isLoading: boolean
}

export default function SimulationConfig({ onSimulate, isLoading }: SimulationConfigProps) {
  const { t } = useLanguage()
  const [insurance, setInsurance] = useState('1y')
  const [standardTerm, setStandardTerm] = useState('1yr')
  const [standardOption, setStandardOption] = useState('SavingsPlan')
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
    setStandardOption('SavingsPlan')
    setCoverage(100)
    setUsage(100)
  }

  return (
    <section className="bg-white rounded-xl shadow-lg p-6 border border-secondary-200">
      <div className="flex items-center justify-between mb-6 pb-3 border-b-2 border-primary-500">
        <h2 className="text-2xl font-bold text-secondary-900">
          {t('settings')}
        </h2>
        <div className="flex items-center gap-2">
          <span className="text-sm text-secondary-600">{t('discountDetails')}</span>
          <DiscountRateInfo />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {/* Insurance Plan */}
        <div className="flex flex-col">
          <label className="flex items-center gap-2 font-semibold text-secondary-700 mb-2">
            <ShieldIcon size={20} className="text-accent-600" />
            {t('planLabel')}
          </label>
          <select
            value={insurance}
            onChange={(e) => setInsurance(e.target.value)}
            className="px-4 py-2 border border-secondary-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition bg-white text-secondary-900"
          >
            <option value="30d">{t('warranty30d')}</option>
            <option value="1y">{t('warranty1y')}</option>
          </select>
          <small className="text-secondary-500 mt-1">{t('warrantyHint')}</small>
        </div>

        {/* Standard Term */}
        <div className="flex flex-col">
          <label className="flex items-center gap-2 font-semibold text-secondary-700 mb-2">
            <CalendarIcon size={20} className="text-primary-600" />
            {t('termLabel')}
          </label>
          <select
            value={standardTerm}
            onChange={(e) => setStandardTerm(e.target.value)}
            className="px-4 py-2 border border-secondary-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition bg-white text-secondary-900"
          >
            <option value="1yr">{t('term1yr')}</option>
            <option value="3yr">{t('term3yr')}</option>
          </select>
        </div>

        {/* Standard Option */}
        <div className="flex flex-col">
          <label className="flex items-center gap-2 font-semibold text-secondary-700 mb-2">
            <DollarIcon size={20} className="text-success-600" />
            {t('typeLabel')}
          </label>
          <select
            value={standardOption}
            onChange={(e) => setStandardOption(e.target.value)}
            className="px-4 py-2 border border-secondary-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition bg-white text-secondary-900"
          >
            <optgroup label={t('ri')}>
              <option value="NoUpfront">{t('optionNoUpfront')}</option>
              <option value="PartialUpfront">{t('optionPartialUpfront')}</option>
              <option value="AllUpfront">{t('optionAllUpfront')}</option>
            </optgroup>
            <optgroup label={t('sp')}>
              <option value="SavingsPlan">{t('optionComputeSP')}</option>
              <option value="EC2-SavingsPlan">{t('optionEC2SP')}</option>
            </optgroup>
          </select>
        </div>

        {/* Coverage */}
        <div className="flex flex-col">
          <label className="flex items-center gap-2 font-semibold text-secondary-700 mb-2">
            <ChartBarIcon size={20} className="text-primary-600" />
            {t('coverageLabel')}: <span className="text-primary-600">{formatPercentage(coverage / 100)}</span>
          </label>
          <input
            type="range"
            min="0"
            max="100"
            step="5"
            value={coverage}
            onChange={(e) => setCoverage(Number(e.target.value))}
            className="w-full h-2 bg-secondary-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
          />
          <small className="text-secondary-500 mt-1">{t('coverageHint')}</small>
        </div>

        {/* Usage */}
        <div className="flex flex-col">
          <label className="flex items-center gap-2 font-semibold text-secondary-700 mb-2">
            <ActivityIcon size={20} className="text-accent-600" />
            {t('uptimeLabel')}: <span className="text-primary-600">{formatPercentage(usage / 100)}</span>
          </label>
          <input
            type="range"
            min="0"
            max="100"
            step="5"
            value={usage}
            onChange={(e) => setUsage(Number(e.target.value))}
            className="w-full h-2 bg-secondary-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
          />
          <small className="text-secondary-500 mt-1">{t('uptimeHint')}</small>
        </div>
      </div>

      {/* Important Note */}
      <div className="mb-6 bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-lg">
        <div className="flex items-start gap-3">
          <InfoIcon size={20} className="text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-secondary-700 font-medium mb-1">{t('importantNote')}</p>
            <p className="text-sm text-secondary-600">
              {t('noteContent')}
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 flex-wrap">
        <button
          onClick={handleSimulate}
          disabled={isLoading}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-accent-600 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <RocketIcon size={20} />
          {isLoading ? t('calculating') : t('simulate')}
        </button>
        <button
          onClick={handleReset}
          disabled={isLoading}
          className="flex items-center gap-2 px-6 py-3 bg-secondary-200 text-secondary-700 font-semibold rounded-lg hover:bg-secondary-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <RefreshIcon size={20} />
          {t('reset')}
        </button>
      </div>
    </section>
  )
}
