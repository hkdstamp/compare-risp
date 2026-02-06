import { PlanResult } from '@/lib/types'
import { formatCurrency } from '@/lib/utils'
import { ChartBarIcon, ShieldIcon, FileTextIcon, CoinsIcon, TrendingUpIcon } from '@/components/icons'
import { useLanguage } from '@/components/LanguageProvider'

interface CustomerCostComparisonProps {
  baselineCost: number
  insurance: PlanResult
  standard: PlanResult
}

export default function CustomerCostComparison({ baselineCost, insurance, standard }: CustomerCostComparisonProps) {
  const { t } = useLanguage()

  // コミットメント保証の実効コスト（返金を考慮）
  const insuranceEffectiveCost = insurance.monthly_cost - (insurance.expected_refund || 0)
  const insuranceTotalSavings = baselineCost - insuranceEffectiveCost
  
  // 標準RI/SPのコスト削減
  const standardSavings = baselineCost - standard.monthly_cost

  return (
    <div className="bg-gradient-to-br from-primary-50 to-accent-50 rounded-xl shadow-lg p-6 border-2 border-primary-200">
      <h3 className="text-2xl font-bold text-secondary-900 mb-6 flex items-center gap-3">
        <ChartBarIcon size={28} className="text-primary-600" />
        {t('costReductionComparison')}
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* On-Demand Baseline */}
        <div className="bg-white rounded-lg p-5 shadow-md border border-secondary-200">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-2 bg-secondary-100 rounded-lg">
              <TrendingUpIcon size={20} className="text-secondary-600" />
            </div>
            <h4 className="font-bold text-secondary-900">{t('onDemandCost')}</h4>
          </div>
          <div className="space-y-2">
            <div className="text-3xl font-bold text-secondary-900">{formatCurrency(baselineCost)}</div>
            <div className="text-sm text-secondary-600">{t('monthlyCost')}</div>
            <div className="mt-4 pt-4 border-t border-secondary-200">
              <div className="text-sm text-secondary-600">{t('costSavings')}</div>
              <div className="text-xl font-semibold text-secondary-500">-</div>
            </div>
          </div>
        </div>

        {/* Insurance Commitment */}
        <div className="bg-white rounded-lg p-5 shadow-md border-2 border-accent-400 relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-accent-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
            {t('recommended')}
          </div>
          <div className="flex items-center gap-2 mb-3">
            <div className="p-2 bg-accent-100 rounded-lg">
              <ShieldIcon size={20} className="text-accent-600" />
            </div>
            <h4 className="font-bold text-secondary-900">{t('commitmentWarranty')}</h4>
          </div>
          <div className="space-y-2">
            <div className="text-sm text-secondary-600">{t('monthlyCost')}</div>
            <div className="text-2xl font-bold text-secondary-900">{formatCurrency(insurance.monthly_cost)}</div>
            
            {insurance.expected_refund && insurance.expected_refund > 0 && (
              <div className="bg-accent-50 px-3 py-2 rounded-lg border border-accent-200 mt-2">
                <div className="flex items-center gap-2 text-sm text-accent-700">
                  <CoinsIcon size={16} />
                  <span>{t('expectedRefund')}: {formatCurrency(insurance.expected_refund)}</span>
                </div>
              </div>
            )}
            
            <div className="mt-4 pt-4 border-t border-accent-200">
              <div className="text-sm text-secondary-600 mb-1">{t('effectiveCost')}</div>
              <div className="text-3xl font-bold text-accent-600">{formatCurrency(insuranceEffectiveCost)}</div>
            </div>
            
            <div className="bg-success-50 px-4 py-3 rounded-lg border border-success-300 mt-3">
              <div className="text-sm text-success-700 font-medium mb-1">{t('costSavings')}</div>
              <div className="text-2xl font-bold text-success-600">{formatCurrency(insuranceTotalSavings)}</div>
              <div className="text-xs text-success-600 mt-1">
                {t('reductionRate')}: {((insuranceTotalSavings / baselineCost) * 100).toFixed(1)}%
              </div>
            </div>
          </div>
        </div>

        {/* Standard RI/SP */}
        <div className="bg-white rounded-lg p-5 shadow-md border border-primary-200">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-2 bg-primary-100 rounded-lg">
              <FileTextIcon size={20} className="text-primary-600" />
            </div>
            <h4 className="font-bold text-secondary-900">{t('standardRiSp')}</h4>
          </div>
          <div className="space-y-2">
            <div className="text-sm text-secondary-600">{t('monthlyCost')}</div>
            <div className="text-3xl font-bold text-secondary-900">{formatCurrency(standard.monthly_cost)}</div>
            
            {standard.initial_cost > 0 && (
              <div className="bg-amber-50 px-3 py-2 rounded-lg border border-amber-200 mt-2">
                <div className="text-xs text-amber-700">{t('initialFee')}</div>
                <div className="text-sm font-semibold text-amber-800">{formatCurrency(standard.initial_cost)}</div>
              </div>
            )}
            
            <div className="mt-4 pt-4 border-t border-primary-200">
              <div className="bg-primary-50 px-4 py-3 rounded-lg border border-primary-200">
                <div className="text-sm text-primary-700 font-medium mb-1">{t('costSavings')}</div>
                <div className="text-2xl font-bold text-primary-600">{formatCurrency(standardSavings)}</div>
                <div className="text-xs text-primary-600 mt-1">
                  {t('reductionRate')}: {((standardSavings / baselineCost) * 100).toFixed(1)}%
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Comparison Summary */}
      <div className="mt-6 bg-white rounded-lg p-5 border-2 border-accent-300">
        <h4 className="font-bold text-secondary-900 mb-3 flex items-center gap-2">
          <CoinsIcon size={20} className="text-accent-600" />
          {t('warrantyAdvantage')}
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-secondary-600">{t('comparedToStandard')}</span>
              <span className="text-lg font-bold text-accent-600">
                {formatCurrency(Math.abs(insuranceEffectiveCost - standard.monthly_cost))}
                {insuranceEffectiveCost < standard.monthly_cost ? ` ${t('cheaper')}` : ` ${t('moreExpensive')}`}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-secondary-600">{t('initialCostDiff')}</span>
              <span className="text-lg font-bold text-success-600">
                {formatCurrency(standard.initial_cost)} {t('notRequired')}
              </span>
            </div>
          </div>
          <div className="bg-accent-50 p-4 rounded-lg border border-accent-200">
            <div className="text-sm text-accent-700 mb-2">✅ {t('warrantyFeatures')}</div>
            <ul className="text-xs text-secondary-700 space-y-1">
              <li>{t('featureZeroUpfront')}</li>
              <li>{t('featureRefund')}</li>
              <li>{t('featureFlexibleTerm')}</li>
              <li>{t('featureHighSavings')}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
