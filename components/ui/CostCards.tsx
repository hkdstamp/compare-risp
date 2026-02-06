import { PlanResult } from '@/lib/types'
import { formatCurrency } from '@/lib/utils'
import { useLanguage } from '@/components/LanguageProvider'
import { TrendingUpIcon, ShieldIcon, FileTextIcon, CoinsIcon } from '@/components/icons'

interface CostCardsProps {
  baselineCost: number
  insurance: PlanResult
  standard: PlanResult
  isMSPMode?: boolean
}

export default function CostCards({ baselineCost, insurance, standard, isMSPMode = true }: CostCardsProps) {
  const { t } = useLanguage()

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Baseline Card */}
      <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-secondary-400 hover:shadow-xl transition transform hover:-translate-y-1">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-secondary-100 rounded-lg">
            <TrendingUpIcon size={28} className="text-secondary-600" />
          </div>
          <h3 className="text-lg font-bold text-secondary-900">{t('onDemandCost')}</h3>
        </div>
        <div className="space-y-2">
          <div className="text-3xl font-bold text-secondary-900">{formatCurrency(baselineCost)}</div>
          <div className="text-sm text-secondary-600">{t('monthlyCost')}</div>
        </div>
      </div>

      {/* Insurance Card */}
      <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-accent-500 hover:shadow-xl transition transform hover:-translate-y-1">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-accent-100 rounded-lg">
            <ShieldIcon size={28} className="text-accent-600" />
          </div>
          <h3 className="text-lg font-bold text-secondary-900">{t('commitmentWarranty')}</h3>
        </div>
        <div className="space-y-3">
          <div>
            <div className="text-3xl font-bold text-secondary-900">{formatCurrency(insurance.monthly_cost)}</div>
            <div className="text-sm text-secondary-600">{t('monthlyCost')}</div>
            <div className="text-xs text-secondary-500 mt-1">{t('includesOnDemandNote')}</div>
          </div>
          <div className="bg-success-50 px-3 py-2 rounded-lg border border-success-200">
            <div className="text-sm font-semibold text-success-700">
              {isMSPMode ? t('monthlySavings') : t('costSavings')}: {formatCurrency(insurance.monthly_savings)}
            </div>
            {(insurance.expected_refund ?? 0) > 0 && (
              <div className="text-xs text-success-600 mt-1">
                ({t('effectiveSavings')}: {formatCurrency(insurance.monthly_savings - (insurance.expected_refund ?? 0))} + {t('expectedRefund')}: {formatCurrency(insurance.expected_refund)})
              </div>
            )}
          </div>
          {isMSPMode && (
            <div className="text-sm text-secondary-600">{t('riskPremium')}: {formatCurrency(insurance.premium)}</div>
          )}
          {(insurance.expected_refund ?? 0) > 0 && (
            <div className="flex items-center gap-2 text-sm text-accent-600 font-medium">
              <CoinsIcon size={16} />
              {t('expectedRefund')}: {formatCurrency(insurance.expected_refund)}
            </div>
          )}
          {insurance.initial_cost > 0 && (
            <div className="text-sm text-secondary-600">{t('initialCost')}: {formatCurrency(insurance.initial_cost)}</div>
          )}
          <div className="text-sm text-secondary-600">
            {isMSPMode ? t('breakEven') : t('paybackPeriod')}: {insurance.break_even_months ? `${insurance.break_even_months}${t('months')}` : '-'}
          </div>
        </div>
      </div>

      {/* Standard Card */}
      <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-primary-500 hover:shadow-xl transition transform hover:-translate-y-1">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-primary-100 rounded-lg">
            <FileTextIcon size={28} className="text-primary-600" />
          </div>
          <h3 className="text-lg font-bold text-secondary-900">{t('standardRiSp')}</h3>
        </div>
        <div className="space-y-3">
          <div>
            <div className="text-3xl font-bold text-secondary-900">{formatCurrency(standard.monthly_cost)}</div>
            <div className="text-sm text-secondary-600">{t('monthlyCost')}</div>
            <div className="text-xs text-secondary-500 mt-1">{t('includesOnDemandNote')}</div>
          </div>
          <div className="bg-primary-50 px-3 py-2 rounded-lg border border-primary-200">
            <div className="text-sm font-semibold text-primary-700">{isMSPMode ? t('savingsAmount') : t('costSavings')}: {formatCurrency(standard.monthly_savings)}</div>
          </div>
          <div className="text-sm text-secondary-600">{t('initialCost')}: {formatCurrency(standard.initial_cost)}</div>
          <div className="text-sm text-secondary-600">
            {isMSPMode ? t('breakEven') : t('paybackPeriod')}: {standard.break_even_months ? `${standard.break_even_months}${t('months')}` : '-'}
          </div>
        </div>
      </div>
    </div>
  )
}
