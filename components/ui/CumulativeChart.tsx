'use client'

import { useEffect, useRef } from 'react'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js'
import { Line } from 'react-chartjs-2'
import { CumulativeData, PlanResult } from '@/lib/types'
import { formatCurrency } from '@/lib/utils'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler)

interface CumulativeChartProps {
  cumulative: CumulativeData
  standardPlan: PlanResult
  insurancePlan: PlanResult
}

export default function CumulativeChart({ cumulative, standardPlan, insurancePlan }: CumulativeChartProps) {
  // Calculate total contract expenditure (constant for all months)
  // Total = Initial cost + (Monthly cost × Contract term)
  const termMonths = cumulative.months.length
  
  // Standard RI/SP total expenditure: initial cost + total monthly cost over contract term
  const standardTotalCost = standardPlan.initial_cost + (standardPlan.monthly_cost * termMonths)
  const standardTotalExpenditure = cumulative.months.map(() => standardTotalCost)
  
  // Insurance RI/SP total expenditure: initial cost + total monthly cost over contract term
  const insuranceTotalCost = insurancePlan.initial_cost + (insurancePlan.monthly_cost * termMonths)
  const insuranceTotalExpenditure = cumulative.months.map(() => insuranceTotalCost)

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
        label: '保険RI/SP（累積）',
        data: cumulative.insurance,
        borderColor: 'rgba(16, 185, 129, 1)',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        borderWidth: 2,
        tension: 0.4,
        fill: true,
      },
      {
        label: '保険RI/SP（総支出）',
        data: insuranceTotalExpenditure,
        borderColor: 'rgba(16, 185, 129, 0.6)',
        backgroundColor: 'rgba(16, 185, 129, 0.05)',
        borderWidth: 2,
        borderDash: [5, 5],
        tension: 0.4,
        fill: false,
        pointRadius: 0,
      },
      {
        label: '標準RI/SP（累積）',
        data: cumulative.standard,
        borderColor: 'rgba(37, 99, 235, 1)',
        backgroundColor: 'rgba(37, 99, 235, 0.1)',
        borderWidth: 2,
        tension: 0.4,
        fill: true,
      },
      {
        label: '標準RI/SP（総支出）',
        data: standardTotalExpenditure,
        borderColor: 'rgba(37, 99, 235, 0.6)',
        backgroundColor: 'rgba(37, 99, 235, 0.05)',
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
            return original.map((label: any) => {
              // Add dash pattern visual to legend for dashed lines
              if (label.text.includes('総支出')) {
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
              footer.push('🎯 保険RI/SP 損益分岐点')
            }
            
            // Check if standard break-even month
            if (standardPlan.break_even_months !== null && month === standardPlan.break_even_months) {
              footer.push('🎯 標準RI/SP 損益分岐点')
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

  // Determine term duration from the number of months
  const termDisplay = termMonths === 12 ? '1年' : termMonths === 36 ? '3年' : `${termMonths}ヶ月`

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-gray-900">
          💹 累積コスト推移（契約期間: {termDisplay}）
        </h3>
        <div className="flex gap-4 text-sm">
          {standardPlan.break_even_months !== null ? (
            <div className="flex items-center gap-2">
              <span className="inline-block w-3 h-3 rounded-full bg-blue-500"></span>
              <span className="text-gray-600">
                標準RI/SP 損益分岐: <span className="font-semibold text-blue-600">{standardPlan.break_even_months}ヶ月</span>
              </span>
            </div>
          ) : standardPlan.monthly_savings > 0 ? (
            <div className="flex items-center gap-2">
              <span className="inline-block w-3 h-3 rounded-full bg-blue-500"></span>
              <span className="text-gray-600">
                標準RI/SP: <span className="font-semibold text-blue-600">即座に節約</span>
              </span>
            </div>
          ) : null}
          {insurancePlan.break_even_months !== null ? (
            <div className="flex items-center gap-2">
              <span className="inline-block w-3 h-3 rounded-full bg-green-500"></span>
              <span className="text-gray-600">
                保険RI/SP 損益分岐: <span className="font-semibold text-green-600">{insurancePlan.break_even_months}ヶ月</span>
              </span>
            </div>
          ) : insurancePlan.monthly_savings > 0 ? (
            <div className="flex items-center gap-2">
              <span className="inline-block w-3 h-3 rounded-full bg-green-500"></span>
              <span className="text-gray-600">
                保険RI/SP: <span className="font-semibold text-green-600">即座に節約</span>
              </span>
            </div>
          ) : null}
        </div>
      </div>
      <div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-start gap-2">
          <span className="text-blue-600 text-lg">ℹ️</span>
          <div className="text-sm text-blue-900">
            <p className="font-semibold mb-1">グラフの見方：</p>
            <ul className="list-disc list-inside space-y-1">
              <li><strong>実線</strong>: 累積ランニングコスト（月々の利用料金の合計）</li>
              <li><strong>破線（総支出）</strong>: 契約期間全体の総支出額（初期費用 + 全期間の月額料金合計）を各月で表示</li>
              <li>標準RI/SPの破線が通常価格の実線と交差する点が<strong>損益分岐点</strong>です</li>
              <li>横軸は標準RI/SPの契約期間（{termDisplay}）に合わせて表示されます</li>
            </ul>
          </div>
        </div>
      </div>
      <Line data={data} options={options} />
    </div>
  )
}
