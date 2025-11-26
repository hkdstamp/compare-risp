'use client'

import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js'
import { Bar } from 'react-chartjs-2'
import { PlanResult } from '@/lib/types'
import { formatCurrency } from '@/lib/utils'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

interface MonthlyChartProps {
  baselineCost: number
  insurance: PlanResult
  standard: PlanResult
}

export default function MonthlyChart({ baselineCost, insurance, standard }: MonthlyChartProps) {
  const data = {
    labels: ['月次コスト', '月次削減額'],
    datasets: [
      {
        label: '通常価格',
        data: [baselineCost, 0],
        backgroundColor: 'rgba(148, 163, 184, 0.7)',
        borderColor: 'rgba(148, 163, 184, 1)',
        borderWidth: 2,
      },
      {
        label: '保険RI/SP',
        data: [insurance.monthly_cost, insurance.monthly_savings],
        backgroundColor: 'rgba(16, 185, 129, 0.7)',
        borderColor: 'rgba(16, 185, 129, 1)',
        borderWidth: 2,
      },
      {
        label: '標準RI/SP',
        data: [standard.monthly_cost, standard.monthly_savings],
        backgroundColor: 'rgba(37, 99, 235, 0.7)',
        borderColor: 'rgba(37, 99, 235, 1)',
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
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-4">📊 月次コスト比較</h3>
      <Bar data={data} options={options} />
    </div>
  )
}
