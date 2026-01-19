'use client'

import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js'
import { Bar } from 'react-chartjs-2'
import { PlanResult } from '@/lib/types'
import { formatCurrency } from '@/lib/utils'
import { BarChartIcon } from '@/components/icons'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

interface MonthlyChartProps {
  baselineCost: number
  insurance: PlanResult
  standard: PlanResult
  isMSPMode?: boolean
}

export default function MonthlyChart({ baselineCost, insurance, standard, isMSPMode = true }: MonthlyChartProps) {
  const data = {
    labels: ['月次コスト', isMSPMode ? '月次削減額' : 'コスト削減'],
    datasets: [
      {
        label: '通常価格',
        data: [baselineCost, 0],
        backgroundColor: 'rgba(100, 116, 139, 0.7)', // secondary-500
        borderColor: 'rgba(100, 116, 139, 1)',
        borderWidth: 2,
      },
      {
        label: '保険コミットメント',
        data: [insurance.monthly_cost, insurance.monthly_savings],
        backgroundColor: 'rgba(34, 197, 94, 0.7)', // success-500
        borderColor: 'rgba(34, 197, 94, 1)',
        borderWidth: 2,
      },
      {
        label: '標準RI/SP',
        data: [standard.monthly_cost, standard.monthly_savings],
        backgroundColor: 'rgba(14, 165, 233, 0.7)', // primary-500
        borderColor: 'rgba(14, 165, 233, 1)',
        borderWidth: 2,
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          usePointStyle: true,
          padding: 15,
          font: {
            size: 12,
            weight: '600' as const,
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
          text: 'コスト (USD)',
          font: {
            weight: '600' as const,
          },
        },
      },
    },
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-secondary-200">
      <h3 className="text-xl font-bold text-secondary-900 mb-4 flex items-center gap-2">
        <BarChartIcon size={24} className="text-primary-600" />
        月次コスト比較
      </h3>
      <Bar data={data} options={options} />
    </div>
  )
}
