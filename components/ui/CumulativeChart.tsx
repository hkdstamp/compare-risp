'use client'

import { useRef } from 'react'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js'
import { Line } from 'react-chartjs-2'
import { CumulativeData, PlanResult } from '@/lib/types'
import { formatCurrency } from '@/lib/utils'
import { useLanguage } from '@/components/LanguageProvider'
import { LineChartIcon, InfoIcon, TargetIcon } from '@/components/icons'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler)

interface CumulativeChartProps {
  cumulative: CumulativeData
  standardPlan: PlanResult
  insurancePlan: PlanResult
  isMSPMode?: boolean
}

export default function CumulativeChart({ cumulative, standardPlan, insurancePlan, isMSPMode = true }: CumulativeChartProps) {
  const { t } = useLanguage()

  // Calculate total contract expenditure (constant for all months)
  // Total = Initial cost + (Monthly cost × Contract term)
  const termMonths = cumulative.months.length
  
  // Standard RI/SP total expenditure: initial cost + total monthly cost over contract term
  const standardTotalCost = standardPlan.initial_cost + (standardPlan.monthly_cost * termMonths)
  const standardTotalExpenditure = cumulative.months.map(() => standardTotalCost)
  
  // Insurance Commitment total expenditure: initial cost + total monthly cost over contract term
  const insuranceTotalCost = insurancePlan.initial_cost + (insurancePlan.monthly_cost * termMonths)
  const insuranceTotalExpenditure = cumulative.months.map(() => insuranceTotalCost)

  const data = {
    labels: cumulative.months.map(m => `${m}${t('months')}`),
    datasets: [
      {
        label: t('onDemandCost'),
        data: cumulative.on_demand,
        borderColor: 'rgba(100, 116, 139, 1)', // secondary-500
        backgroundColor: 'rgba(100, 116, 139, 0.1)',
        borderWidth: 2,
        tension: 0.4,
        fill: true,
      },
      {
        label: t('commitmentWarranty') + t('cumulativeLabel'),
        data: cumulative.insurance,
        borderColor: 'rgba(34, 197, 94, 1)', // success-500
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        borderWidth: 2,
        tension: 0.4,
        fill: true,
      },
      {
        label: t('commitmentWarranty') + t('totalExpenditureLabel'),
        data: insuranceTotalExpenditure,
        borderColor: 'rgba(34, 197, 94, 0.6)', // success-500 with opacity
        backgroundColor: 'rgba(34, 197, 94, 0.05)',
        borderWidth: 2,
        borderDash: [5, 5],
        tension: 0.4,
        fill: false,
        pointRadius: 0,
      },
      {
        label: t('standardRiSp') + t('cumulativeLabel'),
        data: cumulative.standard,
        borderColor: 'rgba(14, 165, 233, 1)', // primary-500
        backgroundColor: 'rgba(14, 165, 233, 0.1)',
        borderWidth: 2,
        tension: 0.4,
        fill: true,
      },
      {
        label: t('standardRiSp') + t('totalExpenditureLabel'),
        data: standardTotalExpenditure,
        borderColor: 'rgba(14, 165, 233, 0.6)', // primary-500 with opacity
        backgroundColor: 'rgba(14, 165, 233, 0.05)',
        borderWidth: 3,
        borderDash: [5, 5],
        tension: 0.4,
        fill: false,
        pointRadius: 0,
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          usePointStyle: true,
          padding: 15,
          font: {
            size: 11,
            weight: '600' as const,
          },
          generateLabels: (chart: any) => {
            const original = ChartJS.defaults.plugins.legend.labels.generateLabels(chart)
            const totalLabel = t('totalExpenditureLabel')
            return original.map((label: any) => {
              // Add dash pattern visual to legend for dashed lines
              if (label.text.includes(totalLabel)) {
                label.lineDash = [5, 5]
              }
              return label
            })
          },
        },
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            let label = context.dataset.label || ''
            if (label) {
              label += ': '
            }
            label += formatCurrency(context.parsed.y)
            return label
          },
          footer: function(tooltipItems: any[]) {
            const monthIndex = tooltipItems[0].dataIndex
            const month = monthIndex + 1
            
            let footer = []
            
            // Check if insurance break-even month
            if (insurancePlan.break_even_months !== null && month === insurancePlan.break_even_months) {
              footer.push('◆ ' + t('commitmentWarranty') + t('breakEvenPointLabel'))
            }
            
            // Check if standard break-even month
            if (standardPlan.break_even_months !== null && month === standardPlan.break_even_months) {
              footer.push('◆ ' + t('standardRiSp') + t('breakEvenPointLabel'))
            }
            
            return footer
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value: any) {
            return formatCurrency(value)
          },
        },
        title: {
          display: true,
          text: t('cumulativeCostUsd'),
          font: {
            weight: '600' as const,
          },
        },
      },
      x: {
        title: {
          display: true,
          text: t('elapsedMonths'),
          font: {
            weight: '600' as const,
          },
        },
      },
    },
  }

  // Determine term duration from the number of months
  const termDisplay = termMonths === 12 ? t('contract1Year') : termMonths === 36 ? t('contract3Year') : `${termMonths}${t('months')}`

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-secondary-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-secondary-900 flex items-center gap-2">
          <LineChartIcon size={24} className="text-primary-600" />
          {t('cumulativeCostTrend')}（{t('contractTerm')}: {termDisplay}）
        </h3>
        <div className="flex gap-4 text-sm">
          {standardPlan.break_even_months !== null && (
            <div className="flex items-center gap-2">
              <TargetIcon size={16} className="text-primary-600" />
              <span className="text-secondary-600">
                {t('standardRiSp')} {t('breakEven')}: <span className="font-semibold text-primary-600">{standardPlan.break_even_months}{t('months')}</span>
              </span>
            </div>
          )}
          {insurancePlan.break_even_months !== null && (
            <div className="flex items-center gap-2">
              <TargetIcon size={16} className="text-success-600" />
              <span className="text-secondary-600">
                {t('commitmentWarranty')} {t('breakEven')}: <span className="font-semibold text-success-600">{insurancePlan.break_even_months}{t('months')}</span>
              </span>
            </div>
          )}
        </div>
      </div>
      <div className="mb-3 p-3 bg-primary-50 border border-primary-200 rounded-lg">
        <div className="flex items-start gap-3">
          <InfoIcon size={20} className="text-primary-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-secondary-800">
            <p className="font-semibold mb-1">{t('graphLegend')}：</p>
            <ul className="list-disc list-inside space-y-1">
              <li><strong>{t('legendSolid')}</strong>{t('legendSolidDesc')}</li>
              <li><strong>{t('legendDashed')}</strong>{t('legendDashedDesc')}</li>
              <li dangerouslySetInnerHTML={{ __html: t('legendBreakEven') }} />
              <li>{t('legendXAxis').replace('{termDisplay}', termDisplay)}</li>
            </ul>
          </div>
        </div>
      </div>
      <Line data={data} options={options} />
    </div>
  )
}
