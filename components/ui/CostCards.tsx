import { PlanResult } from '@/lib/types'
import { formatCurrency } from '@/lib/utils'
import { TrendingUpIcon, ShieldIcon, FileTextIcon, CoinsIcon } from '@/components/icons'

interface CostCardsProps {
  baselineCost: number
  insurance: PlanResult
  standard: PlanResult
  isMSPMode?: boolean
}

export default function CostCards({ baselineCost, insurance, standard, isMSPMode = true }: CostCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Baseline Card */}
      <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-secondary-400 hover:shadow-xl transition transform hover:-translate-y-1">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-secondary-100 rounded-lg">
            <TrendingUpIcon size={28} className="text-secondary-600" />
          </div>
          <h3 className="text-lg font-bold text-secondary-900">通常価格 (On-Demand)</h3>
        </div>
        <div className="space-y-2">
          <div className="text-3xl font-bold text-secondary-900">{formatCurrency(baselineCost)}</div>
          <div className="text-sm text-secondary-600">月額コスト</div>
        </div>
      </div>

      {/* Insurance Card */}
      <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-accent-500 hover:shadow-xl transition transform hover:-translate-y-1">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-accent-100 rounded-lg">
            <ShieldIcon size={28} className="text-accent-600" />
          </div>
          <h3 className="text-lg font-bold text-secondary-900">スマート予約割引</h3>
        </div>
        <div className="space-y-3">
          <div>
            <div className="text-3xl font-bold text-secondary-900">{formatCurrency(insurance.monthly_cost)}</div>
            <div className="text-sm text-secondary-600">月額コスト</div>
            <div className="text-xs text-secondary-500 mt-1">※ 適用されない分のオンデマンドコストを含みます</div>
          </div>
          <div className="bg-success-50 px-3 py-2 rounded-lg border border-success-200">
            <div className="text-sm font-semibold text-success-700">
              {isMSPMode ? '月間削減額' : 'コスト削減'}: {formatCurrency(insurance.monthly_savings)}
            </div>
            {insurance.expected_refund && insurance.expected_refund > 0 && (
              <div className="text-xs text-success-600 mt-1">
                (実質削減: {formatCurrency(insurance.monthly_savings - insurance.expected_refund)} + コスト還元見込: {formatCurrency(insurance.expected_refund)})
              </div>
            )}
          </div>
          {isMSPMode && (
            <div className="text-sm text-secondary-600">リスクプレミアム料: {formatCurrency(insurance.premium)}</div>
          )}
          {insurance.expected_refund && insurance.expected_refund > 0 && (
            <div className="flex items-center gap-2 text-sm text-accent-600 font-medium">
              <CoinsIcon size={16} />
              コスト還元見込: {formatCurrency(insurance.expected_refund)}
            </div>
          )}
          {insurance.initial_cost > 0 && (
            <div className="text-sm text-secondary-600">初期コスト: {formatCurrency(insurance.initial_cost)}</div>
          )}
          <div className="text-sm text-secondary-600">
            {isMSPMode ? '損益分岐' : 'コスト回収期間'}: {insurance.break_even_months ? `${insurance.break_even_months}ヶ月` : '-'}
          </div>
        </div>
      </div>

      {/* Standard Card */}
      <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-primary-500 hover:shadow-xl transition transform hover:-translate-y-1">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-primary-100 rounded-lg">
            <FileTextIcon size={28} className="text-primary-600" />
          </div>
          <h3 className="text-lg font-bold text-secondary-900">標準RI/SP</h3>
        </div>
        <div className="space-y-3">
          <div>
            <div className="text-3xl font-bold text-secondary-900">{formatCurrency(standard.monthly_cost)}</div>
            <div className="text-sm text-secondary-600">月額コスト</div>
            <div className="text-xs text-secondary-500 mt-1">※ 適用されない分のオンデマンドコストを含みます</div>
          </div>
          <div className="bg-primary-50 px-3 py-2 rounded-lg border border-primary-200">
            <div className="text-sm font-semibold text-primary-700">{isMSPMode ? '削減額' : 'コスト削減'}: {formatCurrency(standard.monthly_savings)}</div>
          </div>
          <div className="text-sm text-secondary-600">初期コスト: {formatCurrency(standard.initial_cost)}</div>
          <div className="text-sm text-secondary-600">
            {isMSPMode ? '損益分岐' : 'コスト回収期間'}: {standard.break_even_months ? `${standard.break_even_months}ヶ月` : '-'}
          </div>
        </div>
      </div>
    </div>
  )
}
