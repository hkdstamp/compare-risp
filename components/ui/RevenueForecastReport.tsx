'use client'

import { useState, useEffect } from 'react'
import { SimulationResult, RevenueForecastItem, ResourceConfig } from '@/lib/types'
import { pricingCatalog } from '@/lib/pricing-catalog'
import { calculateInsurancePlan } from '@/lib/simulator'
import { formatCurrency } from '@/lib/utils'
import { FileTextIcon, TrendingUpIcon } from '@/components/icons'

interface RevenueForecastReportProps {
  result: SimulationResult
  insurancePlanKey: string
  usage: number
  resources: ResourceConfig[]
}

export default function RevenueForecastReport({ 
  result, 
  insurancePlanKey, 
  usage, 
  resources 
}: RevenueForecastReportProps) {
  const [forecastData, setForecastData] = useState<RevenueForecastItem[]>([])

  useEffect(() => {
    calculateForecast()
  }, [result, insurancePlanKey, usage, resources])

  const calculateForecast = () => {
    const currentCoverage = result.coverage || 1.0
    const hours = pricingCatalog.metadata.hours_per_month
    
    // 保険プランの情報を取得（保険期間の減額計算用）
    const insurancePlan = pricingCatalog.insurance_plans[insurancePlanKey]
    const insuranceTermMonths = insurancePlan.term_months // 1 or 12

    const forecasts: RevenueForecastItem[] = []

    // カバレッジポイントの計算
    let coveragePoints: number[]
    
    if (currentCoverage === 0) {
      // カバレッジ0%の場合: 0%, 5%, 10%, 15%, 20% の5パターン
      coveragePoints = [0, 0.05, 0.10, 0.15, 0.20]
    } else if (currentCoverage === 1.0) {
      // カバレッジ100%の場合: 80%, 85%, 90%, 95%, 100% の5パターン
      coveragePoints = [0.80, 0.85, 0.90, 0.95, 1.0]
    } else {
      // カバレッジ範囲: 現在の±10% (ただし0-100%の範囲内)
      const minCoverage = Math.max(0, currentCoverage - 0.1)
      const maxCoverage = Math.min(1.0, currentCoverage + 0.1)
      
      // -10%, -5%, 現在, +5%, +10%の5パターンを計算
      coveragePoints = [
        minCoverage,
        currentCoverage - 0.05 >= minCoverage ? currentCoverage - 0.05 : minCoverage,
        currentCoverage,
        currentCoverage + 0.05 <= maxCoverage ? currentCoverage + 0.05 : maxCoverage,
        maxCoverage
      ]
    }

    // 重複を除去
    const uniqueCoveragePoints = Array.from(new Set(coveragePoints))
      .filter(c => c >= 0 && c <= 1)
      .sort((a, b) => a - b)

    uniqueCoveragePoints.forEach(coverage => {
      const planResult = calculateInsurancePlan(
        pricingCatalog,
        resources,
        insurancePlanKey,
        coverage,
        usage,
        hours
      )

      const monthlyCost = planResult.result.monthly_cost
      const premium = planResult.result.premium
      const expectedRefund = planResult.result.expected_refund || 0

      // レベニュー = 保険料の20% (保険料が0の場合は0)
      const revenue = premium > 0 ? premium * 0.20 : 0

      // 12ヶ月合計
      const total12months = {
        monthly_cost: monthlyCost * 12,
        premium: premium * 12,
        expected_refund: expectedRefund * 12,
        revenue: revenue * 12
      }

      // 3年間（36ヶ月）の計算
      // 36ヶ月合計 = 12ヶ月合計 × 3
      const total36months_base = {
        monthly_cost: total12months.monthly_cost * 3,
        premium: total12months.premium * 3,
        expected_refund: total12months.expected_refund * 3,
        revenue: total12months.revenue * 3
      }

      // 3年間の返金見込みは保険期間分を減額
      // 30日保証（1ヶ月）: 1ヶ月分減額
      // 1年保証（12ヶ月）: 12ヶ月分減額
      const refundDeduction = expectedRefund * insuranceTermMonths
      const expectedRefund3Years = total36months_base.expected_refund - refundDeduction

      const total36months = {
        monthly_cost: total36months_base.monthly_cost,
        premium: total36months_base.premium,
        expected_refund_3years: expectedRefund3Years,
        revenue: total36months_base.revenue
      }

      forecasts.push({
        coverage: coverage * 100, // パーセント表示
        monthly_cost: monthlyCost,
        premium,
        expected_refund: expectedRefund,
        revenue,
        total_12months: total12months,
        total_36months: total36months
      })
    })

    setForecastData(forecasts)
  }

  if (forecastData.length === 0) {
    return null
  }

  return (
    <section className="bg-white rounded-xl shadow-lg p-6 border border-warning-200">
      {/* ヘッダー */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-warning-100 rounded-lg">
          <FileTextIcon className="text-warning-600" size={24} />
        </div>
        <div>
          <h3 className="text-xl font-bold text-secondary-900">
            収益見込みレポート
          </h3>
          <p className="text-sm text-secondary-600">
            {result.coverage === 0 
              ? '想定カバレッジ 0%～20% 範囲での収益予測（3年契約RI/SP付帯前提）'
              : result.coverage === 1.0
              ? '想定カバレッジ 80%～100% 範囲での収益予測（3年契約RI/SP付帯前提）'
              : '想定カバレッジ ±10% 範囲での収益予測（3年契約RI/SP付帯前提）'
            }
          </p>
        </div>
      </div>

      {/* 説明 */}
      <div className="mb-4 p-3 bg-warning-50 border border-warning-200 rounded-lg">
        <div className="flex items-start gap-2">
          <TrendingUpIcon className="text-warning-600 flex-shrink-0 mt-0.5" size={18} />
          <div className="text-sm text-warning-900">
            <p className="font-semibold mb-1">計算条件：</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>
                {result.coverage === 0 
                  ? '想定カバレッジ0%の場合: 0%～20%の範囲で計算'
                  : result.coverage === 1.0
                  ? '想定カバレッジ100%の場合: 80%～100%の範囲で計算'
                  : '設定した想定カバレッジから±10%の範囲で計算'
                }
              </li>
              <li>レベニュー = 保険料 × 20%</li>
              <li>保険料が0の場合、レベニューも0</li>
              <li>3年契約RI/SP付帯前提での36ヶ月計算</li>
              <li>3年間の返金見込みは保険期間分を減額（30日保証:1ヶ月分、1年保証:12ヶ月分）</li>
            </ul>
          </div>
        </div>
      </div>

      {/* テーブル */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-warning-50 border-b-2 border-warning-300">
              <th className="px-4 py-3 text-left text-sm font-semibold text-secondary-900">
                想定<br/>カバレッジ
              </th>
              <th className="px-4 py-3 text-right text-sm font-semibold text-secondary-900">
                保険コミットメント<br/>月額
              </th>
              <th className="px-4 py-3 text-right text-sm font-semibold text-secondary-900">
                保険料<br/>(月額)
              </th>
              <th className="px-4 py-3 text-right text-sm font-semibold text-secondary-900">
                返金見込<br/>(月額)
              </th>
              <th className="px-4 py-3 text-right text-sm font-semibold text-warning-700">
                レベニュー<br/>(月額)
              </th>
              <th className="px-4 py-3 text-right text-sm font-semibold text-warning-700 bg-warning-100">
                レベニュー<br/>(12ヶ月)
              </th>
              <th className="px-4 py-3 text-right text-sm font-semibold text-accent-600 bg-accent-50">
                3年間<br/>返金見込
              </th>
              <th className="px-4 py-3 text-right text-sm font-semibold text-primary-700 bg-primary-100">
                レベニュー<br/>(36ヶ月)
              </th>
            </tr>
          </thead>
          <tbody>
            {forecastData.map((item, index) => {
              const isCurrentCoverage = Math.abs(item.coverage - ((result.coverage || 1.0) * 100)) < 0.01
              
              return (
                <tr 
                  key={index}
                  className={`border-b border-secondary-200 hover:bg-warning-50 transition-colors ${
                    isCurrentCoverage ? 'bg-warning-100 font-semibold' : ''
                  }`}
                >
                  <td className="px-4 py-3 text-left">
                    <div className="flex items-center gap-2">
                      <span className={isCurrentCoverage ? 'text-warning-700 font-bold' : 'text-secondary-900'}>
                        {item.coverage.toFixed(0)}%
                      </span>
                      {isCurrentCoverage && (
                        <span className="text-xs bg-warning-600 text-white px-2 py-0.5 rounded">
                          現在
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right text-secondary-900">
                    {formatCurrency(item.monthly_cost)}
                  </td>
                  <td className="px-4 py-3 text-right text-secondary-900">
                    {formatCurrency(item.premium)}
                  </td>
                  <td className="px-4 py-3 text-right text-accent-600 font-medium">
                    {formatCurrency(item.expected_refund)}
                  </td>
                  <td className="px-4 py-3 text-right text-warning-700 font-semibold">
                    {formatCurrency(item.revenue)}
                  </td>
                  <td className="px-4 py-3 text-right bg-warning-50">
                    <div className="font-bold text-warning-700 text-lg">
                      {formatCurrency(item.total_12months.revenue)}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right bg-accent-50">
                    <div className="font-bold text-accent-600">
                      {formatCurrency(item.total_36months.expected_refund_3years)}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right bg-primary-50">
                    <div className="font-bold text-primary-700 text-lg">
                      {formatCurrency(item.total_36months.revenue)}
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
          <tfoot>
            <tr className="bg-warning-100 border-t-2 border-warning-300">
              <td className="px-4 py-3 text-left font-bold text-secondary-900">
                合計範囲
              </td>
              <td className="px-4 py-3 text-right text-secondary-900 font-semibold">
                {formatCurrency(Math.min(...forecastData.map(d => d.monthly_cost)))}
                <br/>
                <span className="text-xs">～</span>
                <br/>
                {formatCurrency(Math.max(...forecastData.map(d => d.monthly_cost)))}
              </td>
              <td className="px-4 py-3 text-right text-secondary-900 font-semibold">
                {formatCurrency(Math.min(...forecastData.map(d => d.premium)))}
                <br/>
                <span className="text-xs">～</span>
                <br/>
                {formatCurrency(Math.max(...forecastData.map(d => d.premium)))}
              </td>
              <td className="px-4 py-3 text-right text-accent-600 font-semibold">
                {formatCurrency(Math.min(...forecastData.map(d => d.expected_refund)))}
                <br/>
                <span className="text-xs">～</span>
                <br/>
                {formatCurrency(Math.max(...forecastData.map(d => d.expected_refund)))}
              </td>
              <td className="px-4 py-3 text-right text-warning-700 font-bold">
                {formatCurrency(Math.min(...forecastData.map(d => d.revenue)))}
                <br/>
                <span className="text-xs">～</span>
                <br/>
                {formatCurrency(Math.max(...forecastData.map(d => d.revenue)))}
              </td>
              <td className="px-4 py-3 text-right bg-warning-200">
                <div className="font-bold text-warning-800 text-lg">
                  {formatCurrency(Math.min(...forecastData.map(d => d.total_12months.revenue)))}
                </div>
                <div className="text-xs text-secondary-600">～</div>
                <div className="font-bold text-warning-800 text-lg">
                  {formatCurrency(Math.max(...forecastData.map(d => d.total_12months.revenue)))}
                </div>
              </td>
              <td className="px-4 py-3 text-right bg-accent-100">
                <div className="font-bold text-accent-700 text-lg">
                  {formatCurrency(Math.min(...forecastData.map(d => d.total_36months.expected_refund_3years)))}
                </div>
                <div className="text-xs text-secondary-600">～</div>
                <div className="font-bold text-accent-700 text-lg">
                  {formatCurrency(Math.max(...forecastData.map(d => d.total_36months.expected_refund_3years)))}
                </div>
              </td>
              <td className="px-4 py-3 text-right bg-primary-200">
                <div className="font-bold text-primary-800 text-lg">
                  {formatCurrency(Math.min(...forecastData.map(d => d.total_36months.revenue)))}
                </div>
                <div className="text-xs text-secondary-600">～</div>
                <div className="font-bold text-primary-800 text-lg">
                  {formatCurrency(Math.max(...forecastData.map(d => d.total_36months.revenue)))}
                </div>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* 注釈 */}
      <div className="mt-4 text-xs text-secondary-600 space-y-1">
        <p>※ レベニュー = 保険料 × 20%</p>
        <p>※ 保険料が0の場合、レベニューも0として計算されます</p>
        <p>※ 12ヶ月合計は月額の12倍、36ヶ月合計は12ヶ月合計の3倍で計算</p>
        <p>※ 3年間の返金見込みは、保険期間分を減額（30日保証: 1ヶ月分減額、1年保証: 12ヶ月分減額）</p>
        <p>※ 背景色が強調されている行が現在の設定値です</p>
      </div>
    </section>
  )
}
