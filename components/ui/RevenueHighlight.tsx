import { formatCurrency } from '@/lib/utils'
import { useLanguage } from '@/components/LanguageProvider'

interface RevenueHighlightProps {
  insuranceSavings: number
  standardSavings: number
  revenueDiff: number
}

export default function RevenueHighlight({ insuranceSavings, standardSavings, revenueDiff }: RevenueHighlightProps) {
  const { t } = useLanguage()

  return (
    <div className="bg-gradient-to-r from-warning-500 to-warning-600 rounded-xl shadow-lg p-8 border border-warning-400">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2">
          <div className="text-white/90 text-sm font-medium">{t('mspGrossProfitWarranty')}</div>
          <div className="text-white text-2xl font-bold">{formatCurrency(insuranceSavings)} {t('monthly')}</div>
        </div>

        <div className="space-y-2">
          <div className="text-white/90 text-sm font-medium">{t('mspGrossProfitStandard')}</div>
          <div className="text-white text-2xl font-bold">{formatCurrency(standardSavings)} {t('monthly')}</div>
        </div>

        <div className="space-y-2 bg-white/20 backdrop-blur-sm px-4 py-3 rounded-lg border-2 border-white/30">
          <div className="text-white/90 text-sm font-medium">{t('profitDiff')}</div>
          <div className={`text-2xl font-bold ${revenueDiff >= 0 ? 'text-green-200' : 'text-red-200'}`}>
            {revenueDiff >= 0 ? '+' : ''}{formatCurrency(Math.abs(revenueDiff))} {t('monthly')}
            <span className="text-sm ml-2">
              {revenueDiff > 0 ? t('warrantyBetter') : revenueDiff < 0 ? t('standardBetter') : ''}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
