# MSP Revenue Simulator - Implementation Prompt

このプロンプトは、AWS MSP収益シミュレーションツールの完全な実装とUIを再現するためのガイドです。

## 🎯 プロジェクト概要

**MSP向け保険RI/SP & 標準RI/SP コスト最適化・収益モデルシミュレーションツール**

AWS Managed Service Provider (MSP) 向けのコスト最適化シミュレーションツールです。保険型Reserved Instance/Savings Plan（保険RI/SP）と標準RI/SPの2つのモデルを比較し、最適な購入戦略を提案します。

### 核となるビジネスロジック

1. **保険RI/SP**: 短期保証（30日/1年）で柔軟性が高く、一定の割引率とプレミアム料金が発生
2. **標準RI/SP**: AWS標準の1年/3年予約で、NoUpfront/PartialUpfront/AllUpfrontの支払いオプション
3. **累積コスト比較**: 通常価格と各プランの累積コストを可視化し、損益分岐点を表示

## 🛠️ 技術スタック

```json
{
  "framework": "Next.js 15.0.3+ (App Router)",
  "runtime": "React 19.0.0+",
  "language": "TypeScript 5.6.0+",
  "styling": "TailwindCSS 3.4.14+",
  "charts": "React Chart.js 2 + Chart.js",
  "deployment": "AWS Amplify Hosting",
  "node": "18.x or higher"
}
```

## 📁 プロジェクト構造

```
/
├── app/                          # Next.js App Router
│   ├── api/                      # API Routes (Node.js runtime)
│   │   ├── simulate/route.ts     # POST /api/simulate - シミュレーション実行
│   │   ├── pricing/route.ts      # GET /api/pricing - 価格カタログ取得
│   │   └── resources/route.ts    # GET /api/resources - リソース設定取得
│   ├── layout.tsx                # ルートレイアウト
│   ├── page.tsx                  # メインページ（シミュレーション画面）
│   └── globals.css               # TailwindCSS + グローバルスタイル
├── components/                   # Reactコンポーネント
│   ├── ui/                       # 再利用可能UIコンポーネント
│   │   ├── CostCards.tsx         # コストカード表示
│   │   ├── RevenueHighlight.tsx  # 収益ハイライト
│   │   ├── CumulativeChart.tsx   # 累積コストグラフ（メインチャート）★
│   │   ├── MonthlyChart.tsx      # 月次コストグラフ
│   │   └── DetailsTable.tsx      # リソース詳細テーブル
│   ├── Header.tsx                # ヘッダー
│   ├── Footer.tsx                # フッター
│   ├── ResourceInfo.tsx          # リソース情報表示
│   ├── ResourceSelector.tsx      # 動的リソース選択UI ★
│   ├── SimulationConfig.tsx      # シミュレーション設定パネル
│   └── SimulationResults.tsx     # シミュレーション結果表示
├── lib/                          # ビジネスロジック & ユーティリティ
│   ├── types.ts                  # TypeScript型定義（全データ構造）★
│   ├── simulator.ts              # コア計算ロジック ★
│   ├── pricing-catalog.ts        # AWS価格カタログ（18種類以上）★
│   └── utils.ts                  # ユーティリティ関数
├── public/                       # 静的ファイル
├── amplify.yml                   # AWS Amplify ビルド設定
├── next.config.js                # Next.js設定（API Routes対応）
├── tailwind.config.js            # TailwindCSS設定
├── tsconfig.json                 # TypeScript設定
└── package.json                  # 依存関係
```

## 🎨 主要コンポーネント詳細

### 1. CumulativeChart.tsx（累積コストグラフ）★★★

**最重要コンポーネント** - 損益分岐点を可視化するメインチャート

#### 機能
- **5本のライン表示**:
  1. 通常価格（グレー実線）: On-Demand累積コスト
  2. 保険RI/SP累積（緑実線）: 月次ランニングコストの累積
  3. 保険RI/SP総支出（緑破線）: 初期費用 + 全期間の月額料金合計（固定値）
  4. 標準RI/SP累積（青実線）: 月次ランニングコストの累積
  5. 標準RI/SP総支出（青破線）: 初期費用 + 全期間の月額料金合計（固定値）

- **損益分岐点の表示**:
  - 破線（総支出）が通常価格の実線と交差する点が損益分岐点
  - グラフヘッダーにバッジ表示（例: "標準RI/SP 損益分岐: 7ヶ月"）
  - ツールチップにも損益分岐点を表示

- **重要な計算ロジック**:
```typescript
// 総支出の計算（各月で固定値）
const termMonths = cumulative.months.length  // 12 or 36
const standardTotalCost = standardPlan.initial_cost + (standardPlan.monthly_cost * termMonths)
const standardTotalExpenditure = cumulative.months.map(() => standardTotalCost)
```

#### 実装ポイント
```typescript
// components/ui/CumulativeChart.tsx
'use client'

import { Line } from 'react-chartjs-2'
import { CumulativeData, PlanResult } from '@/lib/types'
import { formatCurrency } from '@/lib/utils'

interface CumulativeChartProps {
  cumulative: CumulativeData
  standardPlan: PlanResult
  insurancePlan: PlanResult
}

export default function CumulativeChart({ cumulative, standardPlan, insurancePlan }: CumulativeChartProps) {
  const termMonths = cumulative.months.length
  
  // 総支出 = 初期費用 + (月額料金 × 契約期間)
  const standardTotalCost = standardPlan.initial_cost + (standardPlan.monthly_cost * termMonths)
  const standardTotalExpenditure = cumulative.months.map(() => standardTotalCost)
  
  const insuranceTotalCost = insurancePlan.initial_cost + (insurancePlan.monthly_cost * termMonths)
  const insuranceTotalExpenditure = cumulative.months.map(() => insuranceTotalCost)

  const data = {
    labels: cumulative.months.map(m => `${m}ヶ月`),
    datasets: [
      {
        label: '通常価格',
        data: cumulative.on_demand,
        borderColor: 'rgba(148, 163, 184, 1)',
        borderWidth: 2,
        tension: 0.4,
        fill: true,
      },
      {
        label: '保険RI/SP（累積）',
        data: cumulative.insurance,
        borderColor: 'rgba(16, 185, 129, 1)',
        borderWidth: 2,
        tension: 0.4,
        fill: true,
      },
      {
        label: '保険RI/SP（総支出）',
        data: insuranceTotalExpenditure,
        borderColor: 'rgba(16, 185, 129, 0.6)',
        borderWidth: 2,
        borderDash: [5, 5],  // 破線パターン
        tension: 0.4,
        fill: false,
        pointRadius: 0,
      },
      {
        label: '標準RI/SP（累積）',
        data: cumulative.standard,
        borderColor: 'rgba(37, 99, 235, 1)',
        borderWidth: 2,
        tension: 0.4,
        fill: true,
      },
      {
        label: '標準RI/SP（総支出）',
        data: standardTotalExpenditure,
        borderColor: 'rgba(37, 99, 235, 0.6)',
        borderWidth: 3,
        borderDash: [5, 5],  // 破線パターン
        tension: 0.4,
        fill: false,
        pointRadius: 0,
      },
    ],
  }

  const options = {
    responsive: true,
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
          generateLabels: (chart: any) => {
            const original = ChartJS.defaults.plugins.legend.labels.generateLabels(chart)
            return original.map((label: any) => {
              if (label.text.includes('総支出')) {
                label.lineDash = [5, 5]  // 凡例にも破線を表示
              }
              return label
            })
          },
        },
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            return `${context.dataset.label}: ${formatCurrency(context.parsed.y)}`
          },
          footer: function(tooltipItems: any[]) {
            const month = tooltipItems[0].dataIndex + 1
            let footer = []
            
            if (insurancePlan.break_even_months === month) {
              footer.push('🎯 保険RI/SP 損益分岐点')
            }
            if (standardPlan.break_even_months === month) {
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
          callback: (value: any) => formatCurrency(value),
        },
        title: {
          display: true,
          text: '累積コスト (USD)',
        },
      },
      x: {
        title: {
          display: true,
          text: '経過月数',
        },
      },
    },
  }

  const termDisplay = termMonths === 12 ? '1年' : termMonths === 36 ? '3年' : `${termMonths}ヶ月`

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-gray-900">
          💹 累積コスト推移（契約期間: {termDisplay}）
        </h3>
        <div className="flex gap-4 text-sm">
          {standardPlan.break_even_months !== null && (
            <div className="flex items-center gap-2">
              <span className="inline-block w-3 h-3 rounded-full bg-blue-500"></span>
              <span className="text-gray-600">
                標準RI/SP 損益分岐: <span className="font-semibold text-blue-600">{standardPlan.break_even_months}ヶ月</span>
              </span>
            </div>
          )}
          {insurancePlan.break_even_months !== null && (
            <div className="flex items-center gap-2">
              <span className="inline-block w-3 h-3 rounded-full bg-green-500"></span>
              <span className="text-gray-600">
                保険RI/SP 損益分岐: <span className="font-semibold text-green-600">{insurancePlan.break_even_months}ヶ月</span>
              </span>
            </div>
          )}
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
```

### 2. ResourceSelector.tsx（動的リソース選択）★★

AWS複数サービスのリソースを動的に追加・削除・編集できるUI

#### 機能
- EC2、RDS、ElastiCacheから選択
- インスタンスタイプ選択（スペック情報付き）
- 台数入力（1-100台）
- リソース追加/削除ボタン
- リアルタイムサマリー表示

#### 実装ポイント
```typescript
// components/ResourceSelector.tsx
'use client'

import { serviceMetadata } from '@/lib/pricing-catalog'
import { ResourceConfig } from '@/lib/types'

interface ResourceSelectorProps {
  resources: ResourceConfig[]
  onChange: (resources: ResourceConfig[]) => void
}

const serviceIcons: Record<string, string> = {
  ec2: '🖥️',
  rds: '🗄️',
  elasticache: '⚡'
}

export default function ResourceSelector({ resources, onChange }: ResourceSelectorProps) {
  const addResource = () => {
    const newResource: ResourceConfig = {
      service: 'ec2',
      instance: 't3.large',
      quantity: 1,
      usage: 1.0,
      coverage: 1.0
    }
    onChange([...resources, newResource])
  }

  const removeResource = (index: number) => {
    onChange(resources.filter((_, i) => i !== index))
  }

  const updateResource = (index: number, field: keyof ResourceConfig, value: any) => {
    const updated = [...resources]
    updated[index] = { ...updated[index], [field]: value }
    onChange(updated)
  }

  const getInstanceOptions = (service: string) => {
    return serviceMetadata[service as keyof typeof serviceMetadata]?.instances || []
  }

  return (
    <section className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-gray-900">
          📦 シミュレーション対象リソース (東京リージョン)
        </h3>
        <button
          onClick={addResource}
          className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
        >
          <span>+</span>
          <span>リソース追加</span>
        </button>
      </div>

      <div className="space-y-4">
        {resources.map((resource, index) => (
          <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
              {/* サービス選択 */}
              <div className="md:col-span-3">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  サービス
                </label>
                <select
                  value={resource.service}
                  onChange={(e) => {
                    const newService = e.target.value
                    const firstInstance = getInstanceOptions(newService)[0]?.value
                    updateResource(index, 'service', newService)
                    if (firstInstance) {
                      updateResource(index, 'instance', firstInstance)
                    }
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                >
                  {Object.entries(serviceMetadata).map(([key, meta]) => (
                    <option key={key} value={key}>
                      {serviceIcons[key]} {meta.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* インスタンスタイプ選択 */}
              <div className="md:col-span-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  インスタンスタイプ
                </label>
                <select
                  value={resource.instance}
                  onChange={(e) => updateResource(index, 'instance', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                >
                  {getInstanceOptions(resource.service).map((inst) => (
                    <option key={inst.value} value={inst.value}>
                      {inst.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* 台数入力 */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  台数
                </label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={resource.quantity}
                  onChange={(e) => updateResource(index, 'quantity', parseInt(e.target.value) || 1)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>

              {/* 削除ボタン */}
              <div className="md:col-span-3">
                <button
                  onClick={() => removeResource(index)}
                  className="w-full px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors"
                >
                  🗑️ 削除
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* サマリー表示 */}
      <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-900">
          <strong>合計リソース数:</strong> {resources.reduce((sum, r) => sum + r.quantity, 0)}台
        </p>
      </div>
    </section>
  )
}
```

### 3. lib/simulator.ts（コア計算ロジック）★★★

保険RI/SPと標準RI/SPのコスト計算エンジン

#### 主要関数

**calculateInsurancePlan**: 保険RI/SPの月次コスト計算
```typescript
export function calculateInsurancePlan(
  catalog: PricingCatalog,
  resources: ResourceConfig[],
  insuranceKey: string,
  coverage: number,
  usage: number,
  hours: number
): { result: PlanResult; details: DetailItem[] } {
  const plan = catalog.insurance_plans[insuranceKey]
  let totalMonthlyCost = 0
  let totalPremium = 0
  
  for (const res of resources) {
    const onDemandRate = catalog.resources[res.service][res.instance].on_demand_hourly_usd
    const coverageQty = res.quantity * coverage
    
    // 割引適用後のコスト
    const discountedCost = onDemandRate * hours * coverageQty * usage * (1.0 - plan.discount_rate)
    
    // プレミアム料金
    const premiumBase = onDemandRate * hours * coverageQty * plan.discount_rate
    const premium = premiumBase * plan.premium_rate
    
    totalMonthlyCost += discountedCost + premium
    totalPremium += premium
  }
  
  // 損益分岐点の計算（初期費用がないので常にnull）
  return {
    result: {
      name: `Insurance RI/SP ${plan.name}`,
      monthly_cost: totalMonthlyCost,
      monthly_savings: baselineCost - totalMonthlyCost,
      initial_cost: 0,
      premium: totalPremium,
      break_even_months: null,
    },
    details: [...]
  }
}
```

**calculateStandardPlan**: 標準RI/SPの月次コスト計算
```typescript
export function calculateStandardPlan(
  catalog: PricingCatalog,
  resources: ResourceConfig[],
  standardTerm: string,
  standardOption: string,
  coverage: number,
  usage: number,
  hours: number
): { result: PlanResult; details: DetailItem[] } {
  let totalMonthlyEffective = 0
  let totalInitialCost = 0
  
  for (const res of resources) {
    const pricing = catalog.resources[res.service][res.instance]
    const riPricing = pricing.standard_ri[standardTerm][standardOption]
    
    const coverageQty = res.quantity * coverage
    
    // 月次実効コスト
    const monthlyCost = riPricing.hourly_usd * hours * coverageQty * usage
    
    // 初期費用（一括払いの場合のみ）
    const upfrontPerInstance = riPricing.upfront_usd
    const initialCost = upfrontPerInstance * coverageQty
    
    totalMonthlyEffective += monthlyCost
    totalInitialCost += initialCost
  }
  
  // 損益分岐点の計算
  const break_even_months = calculateBreakEvenMonths(
    baselineCost,
    totalMonthlyEffective,
    totalInitialCost
  )
  
  return {
    result: {
      name: `Standard RI/SP ${standardTerm} ${standardOption}`,
      monthly_cost: totalMonthlyEffective,
      monthly_savings: baselineCost - totalMonthlyEffective,
      initial_cost: totalInitialCost,
      premium: 0,
      break_even_months,
    },
    details: [...]
  }
}
```

**calculateCumulativeCosts**: 累積コストデータ生成
```typescript
export function calculateCumulativeCosts(
  baselineMonthly: number,
  insurancePlan: PlanResult,
  standardPlan: PlanResult,
  termMonths: number
): CumulativeData {
  const months: number[] = []
  const on_demand: number[] = []
  const insurance: number[] = []
  const standard: number[] = []

  for (let month = 1; month <= termMonths; month++) {
    months.push(month)
    
    // 通常価格の累積コスト
    on_demand.push(baselineMonthly * month)
    
    // 保険RI/SPの累積コスト（月次コストのみ、初期費用なし）
    insurance.push(insurancePlan.monthly_cost * month)
    
    // 標準RI/SPの累積コスト（月次コストのみ、初期費用は別途）
    standard.push(standardPlan.monthly_cost * month)
  }

  return { months, on_demand, insurance, standard }
}
```

**重要な設計思想**:
- `cumulative` データは**累積ランニングコストのみ**を含む
- **初期費用は含まない**（グラフコンポーネント側で追加）
- これにより、累積コストと総支出を分けて可視化できる

### 4. lib/types.ts（型定義）★

全データ構造を定義

```typescript
// lib/types.ts

// リソース設定
export interface ResourceConfig {
  service: string      // 'ec2' | 'rds' | 'elasticache'
  instance: string     // 't3.large', 'db.t4g.large', etc.
  quantity: number     // 1-100台
  usage?: number       // 稼働率 0.0-1.0
  coverage?: number    // カバレッジ 0.0-1.0
}

// プラン結果
export interface PlanResult {
  name: string                    // プラン名
  monthly_cost: number            // 月次コスト（実効コスト）
  monthly_savings: number         // 月次削減額
  monthly_cash_savings?: number   // キャッシュ削減額
  initial_cost: number            // 初期費用（一括払い）
  premium: number                 // プレミアム料金（保険のみ）
  break_even_months: number | null // 損益分岐点（月数）
}

// 累積データ（グラフ用）
export interface CumulativeData {
  months: number[]        // [1, 2, 3, ..., 12] or [..., 36]
  on_demand: number[]     // 通常価格の累積コスト
  insurance: number[]     // 保険RI/SPの累積ランニングコスト
  standard: number[]      // 標準RI/SPの累積ランニングコスト
}

// シミュレーション結果
export interface SimulationResult {
  baseline_cost: number       // ベースライン月次コスト
  insurance: PlanResult       // 保険RI/SPの結果
  standard: PlanResult        // 標準RI/SPの結果
  cumulative: CumulativeData  // 累積コストデータ
  details: DetailItem[]       // リソース別詳細
  simulation_id?: string      // シミュレーションID
}

// シミュレーションパラメータ
export interface SimulationParams {
  insurance: string           // '30d' | '1y'
  standard_term: string       // '1yr' | '3yr'
  standard_option: string     // 'NoUpfront' | 'PartialUpfront' | 'AllUpfront'
  coverage: number            // カバレッジ 0.0-1.0
  usage: number               // 稼働率 0.0-1.0
  user_id?: string
  save_history?: boolean
  resources?: ResourceConfig[] // カスタムリソース配列
}

// リソース詳細
export interface DetailItem {
  resource: string            // 'ec2:t3.large'
  baseline_cost: number
  insurance_cost: number
  insurance_premium: number
  insurance_savings: number
  standard_cost: number
  standard_upfront: number
  standard_savings: number
}

// 価格カタログ
export interface PricingCatalog {
  metadata: {
    region: string
    hours_per_month: number
  }
  resources: {
    [service: string]: {
      [instance: string]: {
        on_demand_hourly_usd: number
        standard_ri: {
          [term: string]: {
            [option: string]: {
              hourly_usd: number
              upfront_usd: number
            }
          }
        }
      }
    }
  }
  insurance_plans: {
    [key: string]: InsurancePlan
  }
}

// 保険プラン
export interface InsurancePlan {
  name: string
  discount_rate: number   // 0.30 = 30% discount
  premium_rate: number    // 0.50 = 50% premium on saved amount
  term_months: number     // 1 or 12
}
```

### 5. lib/pricing-catalog.ts（価格カタログ）★

AWS東京リージョンの実際の価格データ（18種類以上のインスタンスタイプ）

```typescript
// lib/pricing-catalog.ts
import { PricingCatalog } from './types'

export const pricingCatalog: PricingCatalog = {
  metadata: {
    region: 'ap-northeast-1',  // 東京
    hours_per_month: 730
  },
  resources: {
    ec2: {
      't3.large': {
        on_demand_hourly_usd: 0.1088,
        standard_ri: {
          '1yr': {
            NoUpfront: { hourly_usd: 0.0639, upfront_usd: 0 },
            PartialUpfront: { hourly_usd: 0.0306, upfront_usd: 225 },
            AllUpfront: { hourly_usd: 0.0, upfront_usd: 558 }
          },
          '3yr': {
            NoUpfront: { hourly_usd: 0.0456, upfront_usd: 0 },
            PartialUpfront: { hourly_usd: 0.0219, upfront_usd: 478 },
            AllUpfront: { hourly_usd: 0.0, upfront_usd: 1075 }
          }
        }
      },
      't3.xlarge': {
        on_demand_hourly_usd: 0.2176,
        standard_ri: {
          '1yr': {
            NoUpfront: { hourly_usd: 0.1278, upfront_usd: 0 },
            PartialUpfront: { hourly_usd: 0.0612, upfront_usd: 450 },
            AllUpfront: { hourly_usd: 0.0, upfront_usd: 1116 }
          },
          '3yr': {
            NoUpfront: { hourly_usd: 0.0912, upfront_usd: 0 },
            PartialUpfront: { hourly_usd: 0.0438, upfront_usd: 956 },
            AllUpfront: { hourly_usd: 0.0, upfront_usd: 2150 }
          }
        }
      },
      // ... 他のEC2インスタンスタイプ
    },
    rds: {
      'db.t4g.large': {
        on_demand_hourly_usd: 0.192,
        standard_ri: {
          '1yr': {
            NoUpfront: { hourly_usd: 0.114, upfront_usd: 0 },
            PartialUpfront: { hourly_usd: 0.055, upfront_usd: 430 },
            AllUpfront: { hourly_usd: 0.0, upfront_usd: 1000 }
          },
          '3yr': {
            NoUpfront: { hourly_usd: 0.081, upfront_usd: 0 },
            PartialUpfront: { hourly_usd: 0.039, upfront_usd: 912 },
            AllUpfront: { hourly_usd: 0.0, upfront_usd: 2050 }
          }
        }
      },
      // ... 他のRDSインスタンスタイプ
    },
    elasticache: {
      'cache.t4g.micro': {
        on_demand_hourly_usd: 0.023,
        standard_ri: {
          '1yr': {
            NoUpfront: { hourly_usd: 0.014, upfront_usd: 0 },
            PartialUpfront: { hourly_usd: 0.007, upfront_usd: 52 },
            AllUpfront: { hourly_usd: 0.0, upfront_usd: 122 }
          },
          '3yr': {
            NoUpfront: { hourly_usd: 0.010, upfront_usd: 0 },
            PartialUpfront: { hourly_usd: 0.005, upfront_usd: 109 },
            AllUpfront: { hourly_usd: 0.0, upfront_usd: 245 }
          }
        }
      },
      // ... 他のElastiCacheインスタンスタイプ
    }
  },
  insurance_plans: {
    '30d': {
      name: '30-day guarantee',
      discount_rate: 0.30,   // 30% discount
      premium_rate: 0.50,    // 50% premium on saved amount
      term_months: 1
    },
    '1y': {
      name: '1-year guarantee',
      discount_rate: 0.45,   // 45% discount
      premium_rate: 0.33,    // 33% premium on saved amount
      term_months: 12
    }
  }
}

// サービスメタデータ（UI表示用）
export const serviceMetadata = {
  ec2: {
    name: 'Amazon EC2',
    icon: '🖥️',
    instances: [
      { value: 't3.micro', label: 't3.micro (2 vCPU, 1 GiB)' },
      { value: 't3.small', label: 't3.small (2 vCPU, 2 GiB)' },
      { value: 't3.medium', label: 't3.medium (2 vCPU, 4 GiB)' },
      { value: 't3.large', label: 't3.large (2 vCPU, 8 GiB)' },
      { value: 't3.xlarge', label: 't3.xlarge (4 vCPU, 16 GiB)' },
      { value: 't3.2xlarge', label: 't3.2xlarge (8 vCPU, 32 GiB)' },
      { value: 'm5.large', label: 'm5.large (2 vCPU, 8 GiB)' },
      { value: 'm5.xlarge', label: 'm5.xlarge (4 vCPU, 16 GiB)' },
      { value: 'c5.large', label: 'c5.large (2 vCPU, 4 GiB)' }
    ]
  },
  rds: {
    name: 'Amazon RDS',
    icon: '🗄️',
    instances: [
      { value: 'db.t4g.micro', label: 'db.t4g.micro (2 vCPU, 1 GiB)' },
      { value: 'db.t4g.small', label: 'db.t4g.small (2 vCPU, 2 GiB)' },
      { value: 'db.t4g.medium', label: 'db.t4g.medium (2 vCPU, 4 GiB)' },
      { value: 'db.t4g.large', label: 'db.t4g.large (2 vCPU, 8 GiB)' },
      { value: 'db.m5.large', label: 'db.m5.large (2 vCPU, 8 GiB)' },
      { value: 'db.r5.large', label: 'db.r5.large (2 vCPU, 16 GiB)' }
    ]
  },
  elasticache: {
    name: 'Amazon ElastiCache',
    icon: '⚡',
    instances: [
      { value: 'cache.t4g.micro', label: 'cache.t4g.micro (2 vCPU, 0.5 GiB)' },
      { value: 'cache.t4g.small', label: 'cache.t4g.small (2 vCPU, 1.37 GiB)' },
      { value: 'cache.m5.large', label: 'cache.m5.large (2 vCPU, 6.38 GiB)' }
    ]
  }
}

// デフォルトリソース構成
export const defaultResources: ResourceConfig[] = [
  { service: 'ec2', instance: 't3.large', quantity: 3, usage: 1.0, coverage: 1.0 },
  { service: 'ec2', instance: 't3.xlarge', quantity: 2, usage: 1.0, coverage: 1.0 },
  { service: 'rds', instance: 'db.t4g.large', quantity: 2, usage: 1.0, coverage: 1.0 }
]
```

## 🎨 UI/UXデザインパターン

### カラーパレット
```typescript
// TailwindCSS設定
const colors = {
  primary: {
    50: '#f0f9ff',
    100: '#e0f2fe',
    500: '#0ea5e9',
    600: '#0284c7',
    700: '#0369a1',
  },
  // グレースケール
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    700: '#374151',
    900: '#111827',
  },
  // チャート色
  chart: {
    onDemand: 'rgba(148, 163, 184, 1)',      // グレー
    insurance: 'rgba(16, 185, 129, 1)',      // 緑
    insuranceDashed: 'rgba(16, 185, 129, 0.6)',
    standard: 'rgba(37, 99, 235, 1)',        // 青
    standardDashed: 'rgba(37, 99, 235, 0.6)',
  }
}
```

### レイアウトパターン
- **最大幅**: `max-w-7xl mx-auto` (1280px中央揃え)
- **カード**: `rounded-xl shadow-lg p-6`
- **入力フィールド**: `rounded-lg border-gray-300 focus:ring-2 focus:ring-primary-500`
- **ボタン**: `rounded-lg font-medium transition-colors`

### レスポンシブデザイン
```css
/* モバイル優先 */
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* コンテンツ */}
</div>

/* ブレークポイント */
sm: '640px'   // スマホ横
md: '768px'   // タブレット
lg: '1024px'  // デスクトップ
xl: '1280px'  // 大画面
```

## 📊 データフロー

```
1. ユーザー入力（ResourceSelector + SimulationConfig）
   ↓
2. app/page.tsx → handleSimulate()
   ↓
3. POST /api/simulate (app/api/simulate/route.ts)
   ↓
4. lib/simulator.ts → 計算ロジック実行
   - calculateInsurancePlan()
   - calculateStandardPlan()
   - calculateCumulativeCosts()
   ↓
5. SimulationResult を返却
   ↓
6. SimulationResults.tsx → UIレンダリング
   - CostCards
   - RevenueHighlight
   - CumulativeChart ★ （メイングラフ）
   - MonthlyChart
   - DetailsTable
```

## 🔑 重要な実装ポイント

### 1. 総支出グラフの正しい実装

**❌ 間違った実装**:
```typescript
// 累積データに初期費用を含めてしまう（間違い）
standard.push(standardPlan.monthly_cost * month + standardPlan.initial_cost)
```

**✅ 正しい実装**:
```typescript
// lib/simulator.ts - 累積データは月次コストのみ
standard.push(standardPlan.monthly_cost * month)

// components/ui/CumulativeChart.tsx - グラフ側で総支出を計算
const standardTotalCost = standardPlan.initial_cost + (standardPlan.monthly_cost * termMonths)
const standardTotalExpenditure = cumulative.months.map(() => standardTotalCost)
```

### 2. 損益分岐点の計算

```typescript
function calculateBreakEvenMonths(
  baselineMonthly: number,
  planMonthly: number,
  initialCost: number
): number | null {
  if (planMonthly >= baselineMonthly) {
    return null  // 損益分岐点なし（コスト増）
  }
  
  const monthlySavings = baselineMonthly - planMonthly
  const breakEvenMonths = Math.ceil(initialCost / monthlySavings)
  
  return breakEvenMonths
}
```

### 3. Next.js 15 App Router API Routes

```typescript
// app/api/simulate/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { pricingCatalog, defaultResources } from '@/lib/pricing-catalog'
import { calculateInsurancePlan, calculateStandardPlan, calculateCumulativeCosts } from '@/lib/simulator'

export async function POST(request: NextRequest) {
  try {
    const params = await request.json()
    
    // バリデーション
    if (!params.insurance || !params.standard_term || !params.standard_option) {
      return NextResponse.json({ error: 'Invalid parameters' }, { status: 400 })
    }
    
    // リソース取得（カスタムまたはデフォルト）
    const resources = params.resources || defaultResources
    
    // 計算実行
    const hours = pricingCatalog.metadata.hours_per_month
    const baselineCost = calculateBaselineCost(resources, hours, params.usage)
    
    const insuranceResult = calculateInsurancePlan(
      pricingCatalog,
      resources,
      params.insurance,
      params.coverage,
      params.usage,
      hours
    )
    
    const standardResult = calculateStandardPlan(
      pricingCatalog,
      resources,
      params.standard_term,
      params.standard_option,
      params.coverage,
      params.usage,
      hours
    )
    
    // 契約期間の決定（標準プランの期間に合わせる）
    const termMonths = params.standard_term === '1yr' ? 12 : 36
    
    const cumulative = calculateCumulativeCosts(
      baselineCost,
      insuranceResult.result,
      standardResult.result,
      termMonths
    )
    
    const result: SimulationResult = {
      baseline_cost: baselineCost,
      insurance: insuranceResult.result,
      standard: standardResult.result,
      cumulative,
      details: mergeDetails(insuranceResult.details, standardResult.details),
    }
    
    return NextResponse.json(result)
  } catch (error) {
    console.error('Simulation error:', error)
    return NextResponse.json({ error: 'Simulation failed' }, { status: 500 })
  }
}
```

### 4. AWS Amplify デプロイ設定

```yaml
# amplify.yml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm ci
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: .next
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
      - .next/cache/**/*
```

```javascript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,  // Amplify対応
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
  // ⚠️ 注意: output: 'export' は API Routes と互換性がないため削除
}

module.exports = nextConfig
```

## 📦 依存関係

```json
{
  "name": "alphaus-msp-simulator-nextjs",
  "version": "2.0.0",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "next": "^15.0.3",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "react-chartjs-2": "^5.2.0",
    "chart.js": "^4.4.1",
    "clsx": "^2.1.0",
    "uuid": "^9.0.1"
  },
  "devDependencies": {
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "@types/uuid": "^9",
    "typescript": "^5.6",
    "tailwindcss": "^3.4.14",
    "postcss": "^8",
    "autoprefixer": "^10",
    "eslint": "^9",
    "eslint-config-next": "^15"
  }
}
```

## 🚀 デプロイ手順

### AWS Amplify デプロイ

1. **AWS Amplify Console にアクセス**
   ```
   https://console.aws.amazon.com/amplify/
   ```

2. **新しいアプリを作成**
   - "New app" → "Host web app" をクリック
   - GitHubリポジトリを接続
   - ブランチ選択: `main` または `genspark_ai_developer`

3. **ビルド設定確認**
   - `amplify.yml` が自動検出される
   - Node.js 18.x が使用される

4. **デプロイ実行**
   - "Save and deploy" をクリック
   - 初回デプロイ: 3-5分
   - 以降の`git push`で自動デプロイ

5. **動作確認**
   - デプロイ完了後、AmplifyのURLにアクセス
   - 例: `https://main.d1a2b3c4d5e6f.amplifyapp.com`

### ローカル開発

```bash
# 依存関係インストール
npm install

# 開発サーバー起動
npm run dev

# ブラウザで確認
# http://localhost:3000

# プロダクションビルド
npm run build
npm run start
```

## 🧪 テストシナリオ

### 1. 基本シミュレーション
- **リソース**: EC2 t3.large × 3台
- **保険**: 1年保証（45% discount, 33% premium）
- **標準**: 1年 AllUpfront
- **期待**: 標準RI/SPの損益分岐点が6-8ヶ月で表示される

### 2. 3年契約シミュレーション
- **リソース**: RDS db.t4g.large × 2台
- **標準**: 3年 AllUpfront
- **期待**: グラフが36ヶ月まで表示される

### 3. 複数サービス混在
- **リソース**: 
  - EC2 t3.xlarge × 2台
  - RDS db.m5.large × 1台
  - ElastiCache cache.t4g.small × 3台
- **期待**: すべてのリソースが正しく計算される

### 4. 損益分岐点の確認
- **AllUpfront**: 初期費用が大きいため損益分岐点が遅い（10-15ヶ月）
- **NoUpfront**: 初期費用0のため損益分岐点が早い（1-2ヶ月）

## 🎓 学習ポイント

### Next.js 15 App Router
- サーバーコンポーネントとクライアントコンポーネントの使い分け
- API Routesの実装（`route.ts`パターン）
- `'use client'`ディレクティブの使用

### React 19
- 最新のフック（useOptimisticなど利用可能）
- コンポーネント設計パターン
- 状態管理の最適化

### TypeScript
- 厳密な型定義
- インターフェース設計
- 型安全性の確保

### データ可視化
- Chart.js / React Chart.js 2
- カスタムツールチップ
- レスポンシブチャート

### ビジネスロジック
- コスト計算アルゴリズム
- 損益分岐点の計算
- 累積データ生成

## 🔧 カスタマイズガイド

### 新しいAWSサービスの追加

1. **価格データ追加** (`lib/pricing-catalog.ts`):
```typescript
resources: {
  // 既存のサービス...
  lambda: {  // 新サービス
    '128mb': {
      on_demand_hourly_usd: 0.0000002,
      standard_ri: {
        '1yr': {
          NoUpfront: { hourly_usd: 0.00000015, upfront_usd: 0 },
          // ...
        }
      }
    }
  }
}
```

2. **メタデータ追加** (`lib/pricing-catalog.ts`):
```typescript
export const serviceMetadata = {
  // 既存のサービス...
  lambda: {
    name: 'AWS Lambda',
    icon: '⚡',
    instances: [
      { value: '128mb', label: '128 MB Memory' },
      { value: '256mb', label: '256 MB Memory' },
    ]
  }
}
```

3. **アイコン追加** (`components/ResourceSelector.tsx`):
```typescript
const serviceIcons: Record<string, string> = {
  ec2: '🖥️',
  rds: '🗄️',
  elasticache: '⚡',
  lambda: '⚡'  // 追加
}
```

### 新しい保険プランの追加

```typescript
// lib/pricing-catalog.ts
insurance_plans: {
  // 既存プラン...
  '2y': {  // 2年保証プラン
    name: '2-year guarantee',
    discount_rate: 0.50,   // 50% discount
    premium_rate: 0.25,    // 25% premium
    term_months: 24
  }
}
```

## 🐛 トラブルシューティング

### ビルドエラー: "export const runtime = 'edge'" が必要
**原因**: Cloudflare Pages用の設定が残っている  
**解決**: API Routesから`export const runtime = 'edge'`を削除

### グラフが表示されない
**原因**: Chart.js未登録  
**解決**: `ChartJS.register(...)`を確認

### 累積コストが正しく表示されない
**原因**: 初期費用の二重計上  
**解決**: `lib/simulator.ts`の`calculateCumulativeCosts`で初期費用を含めない

### 損益分岐点が表示されない
**原因**: `break_even_months`が`null`  
**解決**: 月次削減額がマイナスの場合は損益分岐点なし（正常動作）

## 📚 参考資料

- [Next.js 15 Documentation](https://nextjs.org/docs)
- [React 19 Documentation](https://react.dev/)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)
- [Chart.js Documentation](https://www.chartjs.org/docs/)
- [AWS Amplify Hosting Documentation](https://docs.amplify.aws/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

## 🎯 実装チェックリスト

プロジェクトを再現する際は、以下の順序で実装してください：

### Phase 1: プロジェクトセットアップ
- [ ] Next.js 15プロジェクト作成（`npx create-next-app@latest`）
- [ ] 依存関係インストール（Chart.js, React Chart.js 2, uuid）
- [ ] TailwindCSS設定
- [ ] TypeScript設定

### Phase 2: 基本構造
- [ ] `lib/types.ts` - 型定義
- [ ] `lib/utils.ts` - ユーティリティ関数
- [ ] `lib/pricing-catalog.ts` - 価格カタログ
- [ ] `app/layout.tsx` - ルートレイアウト

### Phase 3: コアロジック
- [ ] `lib/simulator.ts` - 計算ロジック
  - [ ] `calculateInsurancePlan()`
  - [ ] `calculateStandardPlan()`
  - [ ] `calculateCumulativeCosts()`
  - [ ] `calculateBreakEvenMonths()`

### Phase 4: API Routes
- [ ] `app/api/simulate/route.ts` - シミュレーションAPI
- [ ] `app/api/pricing/route.ts` - 価格取得API
- [ ] `app/api/resources/route.ts` - リソース取得API

### Phase 5: UIコンポーネント（基本）
- [ ] `components/Header.tsx`
- [ ] `components/Footer.tsx`
- [ ] `components/ResourceInfo.tsx`

### Phase 6: UIコンポーネント（入力）
- [ ] `components/ResourceSelector.tsx` - 動的リソース選択 ★
- [ ] `components/SimulationConfig.tsx` - 設定パネル

### Phase 7: UIコンポーネント（結果表示）
- [ ] `components/ui/CostCards.tsx`
- [ ] `components/ui/RevenueHighlight.tsx`
- [ ] `components/ui/CumulativeChart.tsx` - メインチャート ★★★
- [ ] `components/ui/MonthlyChart.tsx`
- [ ] `components/ui/DetailsTable.tsx`
- [ ] `components/SimulationResults.tsx`

### Phase 8: メインページ
- [ ] `app/page.tsx` - シミュレーション画面

### Phase 9: スタイリング
- [ ] `app/globals.css` - グローバルスタイル
- [ ] TailwindCSS カスタマイズ

### Phase 10: デプロイ設定
- [ ] `amplify.yml` - AWS Amplify設定
- [ ] `next.config.js` - Next.js設定確認

### Phase 11: テスト
- [ ] ローカル開発サーバーで動作確認
- [ ] プロダクションビルドテスト
- [ ] 各テストシナリオ実行

### Phase 12: デプロイ
- [ ] AWS Amplifyにデプロイ
- [ ] 本番環境で動作確認

## 🎉 完成確認

すべてのチェックリストが完了したら、以下を確認してください：

✅ ローカルで`npm run dev`が正常に起動  
✅ リソース選択UIが動作  
✅ シミュレーション実行が成功  
✅ グラフが正しく表示（5本のライン）  
✅ 損益分岐点が表示される  
✅ レスポンシブデザインが機能  
✅ プロダクションビルドが成功  
✅ AWS Amplifyデプロイが成功  

---

**🌊 このプロンプトで、完全なMSP収益シミュレーションツールを再現できます！**

Generated: 2025-11-27  
Version: 2.0.0  
Framework: Next.js 15 + React 19 + TypeScript 5.6 + TailwindCSS 3.4
