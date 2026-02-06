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
    <div className="bg-accent-500 rounded-xl shadow-lg p-8 border border-accent-400">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="flex flex-col gap-8">
          <div className="space-y-1">
            <div className="text-white/90 text-sm font-medium">{t('mspGrossProfitWarranty')}</div>
            <div className="text-white text-3xl font-bold tracking-tight">{formatCurrency(insuranceSavings)} <span className="text-lg font-normal text-white/80">{t('monthly')}</span></div>
          </div>

          <div className="space-y-1">
            <div className="text-white/90 text-sm font-medium">{t('mspGrossProfitStandard')}</div>
            <div className="text-white text-3xl font-bold tracking-tight">{formatCurrency(standardSavings)} <span className="text-lg font-normal text-white/80">{t('monthly')}</span></div>
          </div>
        </div>

        <div className="bg-white/20 backdrop-blur-sm px-6 py-8 rounded-xl border border-white/30 h-full flex flex-col justify-center">
          <div className="text-white/90 text-sm font-medium mb-1">{t('profitDiff')}</div>
          <div className={`text-4xl font-bold ${revenueDiff >= 0.005 ? 'text-green-300' : 'text-white'} tracking-tight`}>
            {revenueDiff >= 0.005 ? '+' : ''}{formatCurrency(Math.abs(revenueDiff))} <span className="text-xl font-normal text-white/80">{t('monthly')}</span>
          </div>
          <div className="mt-2 text-sm font-medium text-white/90 bg-white/20 inline-block px-3 py-1 rounded-full self-start">
            {Math.abs(revenueDiff) < 0.005 ? t('noDifference') : revenueDiff > 0 ? t('warrantyBetter') : t('standardBetter')}
          </div>
        </div>
      </div>
    </div>
  )
}
