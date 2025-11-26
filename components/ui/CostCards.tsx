import { PlanResult } from '@/lib/types'
import { formatCurrency } from '@/lib/utils'

interface CostCardsProps {
  baselineCost: number
  insurance: PlanResult
  standard: PlanResult
}

export default function CostCards({ baselineCost, insurance, standard }: CostCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Baseline Card */}
      <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-gray-400 hover:shadow-xl transition transform hover:-translate-y-1">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-3xl">📈</span>
          <h3 className="text-lg font-bold text-gray-900">通常価格 (On-Demand)</h3>
        </div>
        <div className="space-y-2">
          <div className="text-3xl font-bold text-gray-900">{formatCurrency(baselineCost)}</div>
          <div className="text-sm text-gray-600">月額コスト</div>
        </div>
      </div>

      {/* Insurance Card */}
      <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-green-500 hover:shadow-xl transition transform hover:-translate-y-1">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-3xl">🛡️</span>
          <h3 className="text-lg font-bold text-gray-900">保険RI/SP</h3>
        </div>
        <div className="space-y-3">
          <div>
            <div className="text-3xl font-bold text-gray-900">{formatCurrency(insurance.monthly_cost)}</div>
            <div className="text-sm text-gray-600">月額コスト</div>
          </div>
          <div className="bg-green-50 px-3 py-2 rounded-lg">
            <div className="text-sm font-semibold text-green-700">削減額: {formatCurrency(insurance.monthly_savings)}</div>
          </div>
          <div className="text-sm text-gray-600">保険料: {formatCurrency(insurance.premium)}</div>
          <div className="text-sm text-gray-600">
            損益分岐: {insurance.break_even_months ? `${insurance.break_even_months}ヶ月` : '-'}
          </div>
        </div>
      </div>

      {/* Standard Card */}
      <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-blue-500 hover:shadow-xl transition transform hover:-translate-y-1">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-3xl">📋</span>
          <h3 className="text-lg font-bold text-gray-900">標準RI/SP</h3>
        </div>
        <div className="space-y-3">
          <div>
            <div className="text-3xl font-bold text-gray-900">{formatCurrency(standard.monthly_cost)}</div>
            <div className="text-sm text-gray-600">月額コスト</div>
          </div>
          <div className="bg-blue-50 px-3 py-2 rounded-lg">
            <div className="text-sm font-semibold text-blue-700">削減額: {formatCurrency(standard.monthly_savings)}</div>
          </div>
          <div className="text-sm text-gray-600">初期コスト: {formatCurrency(standard.initial_cost)}</div>
          <div className="text-sm text-gray-600">
            損益分岐: {standard.break_even_months ? `${standard.break_even_months}ヶ月` : '-'}
          </div>
        </div>
      </div>
    </div>
  )
}
