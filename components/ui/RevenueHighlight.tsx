import { formatCurrency } from '@/lib/utils'

interface RevenueHighlightProps {
  insuranceSavings: number
  standardSavings: number
  revenueDiff: number
}

export default function RevenueHighlight({ insuranceSavings, standardSavings, revenueDiff }: RevenueHighlightProps) {
  return (
    <div className="bg-gradient-to-r from-warning-500 to-warning-600 rounded-xl shadow-lg p-8 border border-warning-400">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2">
          <div className="text-white/90 text-sm font-medium">MSP想定粗利 (保険コミットメント)</div>
          <div className="text-white text-2xl font-bold">{formatCurrency(insuranceSavings)} / 月</div>
        </div>

        <div className="space-y-2">
          <div className="text-white/90 text-sm font-medium">MSP想定粗利 (標準RI/SP)</div>
          <div className="text-white text-2xl font-bold">{formatCurrency(standardSavings)} / 月</div>
        </div>

        <div className="space-y-2 bg-white/20 backdrop-blur-sm px-4 py-3 rounded-lg border-2 border-white/30">
          <div className="text-white/90 text-sm font-medium">収益差額 (保険 vs 標準)</div>
          <div className={`text-2xl font-bold ${revenueDiff >= 0 ? 'text-green-200' : 'text-red-200'}`}>
            {revenueDiff >= 0 ? '+' : ''}{formatCurrency(Math.abs(revenueDiff))} / 月
            <span className="text-sm ml-2">
              {revenueDiff > 0 ? '(保険が有利)' : revenueDiff < 0 ? '(標準が有利)' : ''}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
