import { DetailItem } from '@/lib/types'
import { formatCurrency } from '@/lib/utils'
import { useLanguage } from '@/components/LanguageProvider'
import { SearchIcon } from '@/components/icons'

interface DetailsTableProps {
  details: DetailItem[]
  isMSPMode?: boolean
}

export default function DetailsTable({ details, isMSPMode = true }: DetailsTableProps) {
  const { t } = useLanguage()

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-secondary-200">
      <h3 className="text-xl font-bold text-secondary-900 mb-4 flex items-center gap-2">
        <SearchIcon size={24} className="text-primary-600" />
        {t('resourceBreakdown')}
      </h3>
      
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-secondary-100 border-b-2 border-secondary-300">
              <th className="px-4 py-3 text-left font-semibold text-secondary-700">{t('resource')}</th>
              <th className="px-4 py-3 text-right font-semibold text-secondary-700">{t('onDemandCost')}</th>
              <th className="px-4 py-3 text-right font-semibold text-secondary-700">{t('commitmentWarranty')}</th>
              {isMSPMode && <th className="px-4 py-3 text-right font-semibold text-secondary-700">{t('riskPremium')}</th>}
              <th className="px-4 py-3 text-right font-semibold text-secondary-700">{t('expectedRefund')}</th>
              <th className="px-4 py-3 text-right font-semibold text-secondary-700">{t('warrantyInitialCost')}</th>
              <th className="px-4 py-3 text-right font-semibold text-secondary-700">{isMSPMode ? t('warrantySavings') : t('costSavings')}</th>
              <th className="px-4 py-3 text-right font-semibold text-secondary-700">{t('standardRiSp')}</th>
              <th className="px-4 py-3 text-right font-semibold text-secondary-700">{t('standardInitialCost')}</th>
              <th className="px-4 py-3 text-right font-semibold text-secondary-700">{isMSPMode ? t('standardSavings') : t('costSavings')}</th>
            </tr>
          </thead>
          <tbody>
            {details.map((detail, index) => (
              <tr key={index} className="border-b border-secondary-200 hover:bg-secondary-50 transition">
                <td className="px-4 py-3 font-semibold text-secondary-900">{detail.resource}</td>
                <td className="px-4 py-3 text-right text-secondary-700">{formatCurrency(detail.baseline_cost)}</td>
                <td className="px-4 py-3 text-right text-secondary-700">{formatCurrency(detail.insurance_cost)}</td>
                {isMSPMode && <td className="px-4 py-3 text-right text-secondary-700">{formatCurrency(detail.insurance_premium)}</td>}
                <td className="px-4 py-3 text-right font-medium text-accent-600">
                  {formatCurrency(detail.insurance_expected_refund)}
                </td>
                <td className="px-4 py-3 text-right text-secondary-700">{formatCurrency(detail.insurance_upfront)}</td>
                <td className="px-4 py-3 text-right font-semibold text-success-600">
                  {formatCurrency(detail.insurance_savings)}
                  {detail.insurance_expected_refund > 0 && (
                    <div className="text-xs text-secondary-500 mt-1">
                      ({formatCurrency(detail.insurance_savings - detail.insurance_expected_refund)} + {formatCurrency(detail.insurance_expected_refund)})
                    </div>
                  )}
                </td>
                <td className="px-4 py-3 text-right text-secondary-700">{formatCurrency(detail.standard_cost)}</td>
                <td className="px-4 py-3 text-right text-secondary-700">{formatCurrency(detail.standard_upfront)}</td>
                <td className="px-4 py-3 text-right font-semibold text-primary-600">
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
