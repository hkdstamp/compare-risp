'use client'

import { useEffect, useRef } from 'react'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js'
import { Line } from 'react-chartjs-2'
import { CumulativeData } from '@/lib/types'
import { formatCurrency } from '@/lib/utils'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler)

interface CumulativeChartProps {
  cumulative: CumulativeData
}

export default function CumulativeChart({ cumulative }: CumulativeChartProps) {
  const data = {
    labels: cumulative.months.map(m => `${m}ヶ月`),
    datasets: [
      {
        label: '通常価格',
        data: cumulative.on_demand,
        borderColor: 'rgba(148, 163, 184, 1)',
        backgroundColor: 'rgba(148, 163, 184, 0.1)',
        borderWidth: 2,
        tension: 0.4,
        fill: true,
      },
      {
        label: '保険RI/SP',
        data: cumulative.insurance,
        borderColor: 'rgba(16, 185, 129, 1)',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        borderWidth: 2,
        tension: 0.4,
        fill: true,
      },
      {
        label: '標準RI/SP',
        data: cumulative.standard,
        borderColor: 'rgba(37, 99, 235, 1)',
        backgroundColor: 'rgba(37, 99, 235, 0.1)',
        borderWidth: 2,
        tension: 0.4,
        fill: true,
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
          text: '累積コスト (USD)',
          font: {
            weight: '600' as const,
          },
        },
      },
      x: {
        title: {
          display: true,
          text: '経過月数',
          font: {
            weight: '600' as const,
          },
        },
      },
    },
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-4">💹 12ヶ月累積コスト推移</h3>
      <Line data={data} options={options} />
    </div>
  )
}
