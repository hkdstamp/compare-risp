import { DetailItem } from '@/lib/types'
import { formatCurrency } from '@/lib/utils'

interface DetailsTableProps {
  details: DetailItem[]
}

export default function DetailsTable({ details }: DetailsTableProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-4">🔍 リソース別詳細内訳</h3>
      
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-100 border-b-2 border-gray-300">
              <th className="px-4 py-3 text-left font-semibold text-gray-700">リソース</th>
              <th className="px-4 py-3 text-right font-semibold text-gray-700">通常価格</th>
              <th className="px-4 py-3 text-right font-semibold text-gray-700">保険RI/SP</th>
              <th className="px-4 py-3 text-right font-semibold text-gray-700">保険料</th>
              <th className="px-4 py-3 text-right font-semibold text-gray-700">返金見込</th>
              <th className="px-4 py-3 text-right font-semibold text-gray-700">保険削減額</th>
              <th className="px-4 py-3 text-right font-semibold text-gray-700">標準RI/SP</th>
              <th className="px-4 py-3 text-right font-semibold text-gray-700">標準初期コスト</th>
              <th className="px-4 py-3 text-right font-semibold text-gray-700">標準削減額</th>
            </tr>
          </thead>
          <tbody>
            {details.map((detail, index) => (
              <tr key={index} className="border-b border-gray-200 hover:bg-gray-50 transition">
                <td className="px-4 py-3 font-semibold text-gray-900">{detail.resource}</td>
                <td className="px-4 py-3 text-right text-gray-700">{formatCurrency(detail.baseline_cost)}</td>
                <td className="px-4 py-3 text-right text-gray-700">{formatCurrency(detail.insurance_cost)}</td>
                <td className="px-4 py-3 text-right text-gray-700">{formatCurrency(detail.insurance_premium)}</td>
                <td className="px-4 py-3 text-right font-medium text-emerald-600">
                  {formatCurrency(detail.insurance_expected_refund)}
                </td>
                <td className="px-4 py-3 text-right font-semibold text-green-600">
                  {formatCurrency(detail.insurance_savings)}
                  {detail.insurance_expected_refund > 0 && (
                    <div className="text-xs text-gray-500 mt-1">
                      ({formatCurrency(detail.insurance_savings - detail.insurance_expected_refund)} + {formatCurrency(detail.insurance_expected_refund)})
                    </div>
                  )}
                </td>
                <td className="px-4 py-3 text-right text-gray-700">{formatCurrency(detail.standard_cost)}</td>
                <td className="px-4 py-3 text-right text-gray-700">{formatCurrency(detail.standard_upfront)}</td>
                <td className="px-4 py-3 text-right font-semibold text-blue-600">
                  {formatCurrency(detail.standard_savings)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
