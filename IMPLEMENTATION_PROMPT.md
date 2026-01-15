# MSP Revenue Simulator - Implementation Prompt

このプロンプトは、AWS MSP収益シミュレーションツールの完全な実装とUIを再現するためのガイドです。

## 🎯 プロジェクト概要

**MSP向け保険コミットメント & 標準RI/SP コスト最適化・収益モデルシミュレーションツール**

AWS Managed Service Provider (MSP) 向けのコスト最適化シミュレーションツールです。保険型コミットメント（保険コミットメント）と標準RI/SPの2つのモデルを比較し、最適な購入戦略を提案します。

### 核となるビジネスロジック

1. **保険コミットメント**: 短期保証（30日/1年）で柔軟性が高く、一定の料金率と保険料が発生
   - **料金体系**: 標準RI/SP 3年NoUpfrontの100%使用時コストを基準として、カバレッジに応じて課金
   - **保険料率**: 30日保証50%、1年保証33%
   - **返金機能**: カバレッジが低い場合、削減額がマイナスになると返金が発生
2. **標準RI/SP**: AWS標準の1年/3年予約で、NoUpfront/PartialUpfront/AllUpfrontの支払いオプション
3. **累積コスト比較**: 通常価格と各プランの累積コストを可視化し、損益分岐点を表示
4. **割引率情報モーダル**: 各プランの割引率、保険料率、実効割引率を確認できる情報モーダル

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
│   │   ├── CostCards.tsx         # コストカード表示（返金見込み表示機能付き）★
│   │   ├── RevenueHighlight.tsx  # 収益ハイライト
│   │   ├── CumulativeChart.tsx   # 累積コストグラフ（メインチャート）★
│   │   ├── MonthlyChart.tsx      # 月次コストグラフ
│   │   ├── DetailsTable.tsx      # リソース詳細テーブル（返金見込み列付き）★
│   │   └── DiscountRateInfo.tsx  # 割引率情報モーダル ★
│   ├── icons/                    # SVGアイコンコンポーネント ★
│   │   └── index.tsx             # 全アイコン定義（24種類）
│   ├── Header.tsx                # ヘッダー
│   ├── Footer.tsx                # フッター
│   ├── ResourceInfo.tsx          # リソース情報表示
│   ├── ResourceSelector.tsx      # 動的リソース選択UI（SVGアイコン対応）★
│   ├── SimulationConfig.tsx      # シミュレーション設定パネル（情報アイコン付き）★
│   └── SimulationResults.tsx     # シミュレーション結果表示
├── lib/                          # ビジネスロジック & ユーティリティ
│   ├── types.ts                  # TypeScript型定義（全データ構造、返金見込みフィールド含む）★
│   ├── simulator.ts              # コア計算ロジック（返金見込み計算機能付き）★
│   ├── pricing-catalog.ts        # AWS価格カタログ（18種類以上）★
│   └── utils.ts                  # ユーティリティ関数
├── public/                       # 静的ファイル
├── CALCULATION_SPECIFICATION.md  # 計算仕様詳細ドキュメント ★
├── amplify.yml                   # AWS Amplify ビルド設定
├── next.config.js                # Next.js設定（API Routes対応）
├── tailwind.config.js            # TailwindCSS設定（Alphuas配色）★
├── tsconfig.json                 # TypeScript設定
└── package.json                  # 依存関係
```

## 🎨 主要コンポーネント詳細

### 0. アイコンコンポーネント（components/icons/index.tsx）★★

**重要な設計変更**: 絵文字からSVGアイコンへの完全移行

#### 実装されているアイコン（24種類）

```typescript
// components/icons/index.tsx

interface IconProps {
  className?: string
  size?: number  // デフォルト: 24
}

// 主要アイコン
export function ShieldIcon        // 保険コミットメント
export function CalendarIcon      // 契約期間
export function DollarIcon        // 支払方法
export function ChartBarIcon      // 統計
export function CoinsIcon         // 返金見込み ★
export function BalanceIcon       // 料金
export function InfoIcon          // 情報
export function XIcon             // 閉じる
export function RocketIcon        // シミュレーション実行
export function RefreshIcon       // リセット

// リソース用アイコン
export function ServerIcon        // EC2
export function DatabaseIcon      // RDS
export function ZapIcon           // ElastiCache
export function PackageIcon       // パッケージ
export function PlusIcon          // 追加
export function TrashIcon         // 削除

// チャート用アイコン
export function LineChartIcon     // 累積コストグラフ
export function BarChartIcon      // 月次コストグラフ
export function TargetIcon        // 損益分岐点
export function TrendingUpIcon    // 収益トレンド
export function ActivityIcon      // アクティビティ
export function SearchIcon        // 検索
export function FileTextIcon      // ドキュメント
```

#### 使用例

```typescript
import { ShieldIcon, CoinsIcon, CalendarIcon } from '@/components/icons'

// 基本使用
<ShieldIcon className="text-accent-600" size={20} />

// アイコン付きテキスト
<div className="flex items-center gap-2">
  <CoinsIcon className="text-accent-600" size={18} />
  <span>返金見込み</span>
</div>

// アイコン付きボタン
<button className="flex items-center gap-2">
  <RocketIcon size={20} />
  <span>シミュレーション実行</span>
</button>
```

#### アイコンの利点

- ✅ **スケーラブル**: サイズを自由に調整可能
- ✅ **カスタマイズ可能**: 色をTailwindクラスで指定
- ✅ **アクセシビリティ**: スクリーンリーダー対応
- ✅ **パフォーマンス**: SVGは軽量
- ✅ **一貫性**: デザインシステム全体で統一

---

### 1. DiscountRateInfo.tsx（割引率情報モーダル）★★

**新規追加コンポーネント** - シミュレーション設定の情報アイコンから開くモーダル

#### 機能

- **保険コミットメント情報表示**:
  - 30日保証プラン（割引率60%、保険料率50%、実効割引率30.0%）
  - 1年保証プラン（割引率60%、保険料率33%、実効割引率40.2%）
  - 特徴: 短期契約、未使用分返金、初期費用ゼロ
  - 注記: ComputeSP 3年相当で算定

- **標準RI/SP情報表示**:
  - Reserved Instance（RI）詳細テーブル
    - 1年契約: NoUpfront (37.0%), PartialUpfront (40.0%), AllUpfront (41.2%)
    - 3年契約: NoUpfront (56.8%), PartialUpfront (60.0%), AllUpfront (62.4%)
  - Compute Savings Plans（SP）詳細テーブル
    - 1年契約: 40.0%割引
    - 3年契約: 60.0%割引
  - 注記: ComputeSavingsPlansから簡易的に算定

- **使い分けガイドライン**:
  - 最大割引を求める → RI 3年 AllUpfront (62.4%)
  - 初期費用を避けたい → SP 1年 (40.0%) または 保険コミットメント 1年 (40.2%)
  - 柔軟性を重視 → 保険コミットメント 1年 (40.2%)
  - 超短期利用 → 保険コミットメント 30日 (30.0%)

#### 実装ポイント

```typescript
// components/ui/DiscountRateInfo.tsx
'use client'

import { useState } from 'react'
import { InfoIcon, XIcon } from '@/components/icons'

export default function DiscountRateInfo() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* 情報アイコンボタン */}
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 hover:bg-secondary-100 rounded-lg transition-colors"
        aria-label="割引率情報を表示"
      >
        <InfoIcon className="text-secondary-600" size={20} />
      </button>

      {/* モーダル */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* ヘッダー */}
            <div className="sticky top-0 bg-gradient-to-r from-primary-600 to-accent-600 text-white p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">割引率情報</h2>
                <button onClick={() => setIsOpen(false)}>
                  <XIcon size={24} />
                </button>
              </div>
            </div>

            {/* コンテンツ */}
            <div className="p-6 space-y-6">
              {/* 保険コミットメントセクション */}
              <section>
                <h3 className="text-xl font-bold text-accent-700 mb-2">
                  保険コミットメント
                </h3>
                <p className="text-sm text-secondary-600 mb-4">
                  ※ ComputeSP 3年相当で算定
                </p>
                {/* 保険プランテーブル */}
                <table className="w-full">
                  <thead className="bg-accent-50">
                    <tr>
                      <th>プラン</th>
                      <th>割引率</th>
                      <th>保険料率</th>
                      <th>実効割引率</th>
                      <th>月額料金</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>30日保証</td>
                      <td>60%</td>
                      <td>50%</td>
                      <td className="font-bold text-accent-600">30.0%</td>
                      <td>$55.60</td>
                    </tr>
                    <tr>
                      <td>1年保証</td>
                      <td>60%</td>
                      <td>33%</td>
                      <td className="font-bold text-accent-600">40.2%</td>
                      <td>$47.50</td>
                    </tr>
                  </tbody>
                </table>
                {/* 特徴リスト */}
                <ul className="mt-3 space-y-1 text-sm">
                  <li>✓ 短期契約（30日または1年）</li>
                  <li>✓ 未使用分は返金される</li>
                  <li>✓ 初期費用ゼロ</li>
                  <li>✓ 1年保証は標準RI/SPと同等の割引率</li>
                </ul>
              </section>

              {/* 標準RI/SPセクション */}
              <section>
                <h3 className="text-xl font-bold text-primary-700 mb-2">
                  標準RI/SP
                </h3>
                <p className="text-sm text-secondary-600 mb-4">
                  ※ SPは、ComputeSavingsPlansから簡易的に算定
                </p>
                {/* RIテーブル、SPテーブル、使い分けガイドライン */}
              </section>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
```

---

### 2. CumulativeChart.tsx（累積コストグラフ）★★★

**最重要コンポーネント** - 損益分岐点を可視化するメインチャート

#### 機能
- **5本のライン表示**:
  1. 通常価格（グレー実線）: On-Demand累積コスト
  2. 保険コミットメント累積（緑実線）: 月次ランニングコストの累積
  3. 保険コミットメント総支出（緑破線）: 初期費用 + 全期間の月額料金合計（固定値）
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
        label: '保険コミットメント（累積）',
        data: cumulative.insurance,
        borderColor: 'rgba(16, 185, 129, 1)',
        borderWidth: 2,
        tension: 0.4,
        fill: true,
      },
      {
        label: '保険コミットメント（総支出）',
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
              footer.push('🎯 保険コミットメント 損益分岐点')
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
    <div className="bg-white rounded-xl shadow-lg p-6 border border-primary-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-secondary-900 flex items-center gap-2">
          <LineChartIcon className="text-primary-600" size={24} />
          累積コスト推移（契約期間: {termDisplay}）
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
                保険コミットメント 損益分岐: <span className="font-semibold text-green-600">{insurancePlan.break_even_months}ヶ月</span>
              </span>
            </div>
          )}
        </div>
      </div>
      <div className="mb-3 p-3 bg-primary-50 border border-primary-200 rounded-lg">
        <div className="flex items-start gap-2">
          <InfoIcon className="text-primary-600" size={20} />
          <div className="text-sm text-primary-900">
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

### 3. CostCards.tsx（コストカード表示）★★

**返金見込み表示機能を含む**

#### 機能

- **通常価格カード**: オンデマンド価格表示
- **保険コミットメントカード**: 
  - 月額コスト
  - 月間削減額（基本削減 + 返金見込みの内訳表示）★
  - 💰 返金見込み（単独表示）★
  - 保険料
  - 損益分岐月
- **標準RI/SPカード**:
  - 月額コスト
  - 月間削減額
  - 初期費用
  - 損益分岐月

#### 実装ポイント

```typescript
// components/ui/CostCards.tsx
'use client'

import { formatCurrency } from '@/lib/utils'
import { ShieldIcon, CalendarIcon, CoinsIcon, BalanceIcon } from '@/components/icons'

// 保険コミットメントカード内の返金見込み表示
{insurance.expected_refund && insurance.expected_refund > 0 && (
  <>
    {/* 月間削減額の内訳 */}
    <div className="flex items-center justify-between p-3 bg-success-50 rounded-lg">
      <div className="flex items-center gap-2">
        <BalanceIcon className="text-success-600" size={20} />
        <span className="text-sm font-medium text-secondary-700">月間削減額</span>
      </div>
      <div className="text-right">
        <div className="text-lg font-bold text-success-600">
          {formatCurrency(insurance.monthly_savings)}
        </div>
        <div className="text-xs text-secondary-600">
          (基本削減: {formatCurrency(insurance.monthly_savings - insurance.expected_refund)} + 
          返金見込: {formatCurrency(insurance.expected_refund)})
        </div>
      </div>
    </div>

    {/* 返金見込み（単独表示） */}
    <div className="flex items-center justify-between p-3 bg-accent-50 rounded-lg">
      <div className="flex items-center gap-2">
        <CoinsIcon className="text-accent-600" size={20} />
        <span className="text-sm font-medium text-secondary-700">💰 返金見込</span>
      </div>
      <div className="text-lg font-bold text-accent-600">
        {formatCurrency(insurance.expected_refund)}
      </div>
    </div>
  </>
)}
```

---

### 4. DetailsTable.tsx（リソース詳細テーブル）★★

**返金見込み列を含む**

#### 機能

- リソース別のコスト詳細表示
- **返金見込み列**の追加 ★
- 保険削減額の内訳表示（削減額 + 返金見込み）★

#### テーブル列構成

| 列名 | 説明 |
|------|------|
| リソース | サービス:インスタンスタイプ |
| 通常価格 | オンデマンド月額コスト |
| 保険コミットメント | 保険プラン月額コスト |
| 保険料 | プレミアム料金 |
| **返金見込** | 未使用分の返金額 ★ |
| 保険削減額 | 月間削減額（内訳付き）★ |
| 標準RI/SP | 標準プラン月額コスト |
| 標準初期コスト | 前払い費用 |
| 標準削減額 | 月間削減額 |

#### 実装ポイント

```typescript
// components/ui/DetailsTable.tsx
'use client'

import { SearchIcon } from '@/components/icons'

// テーブルヘッダー
<thead className="bg-secondary-50">
  <tr>
    <th>リソース</th>
    <th>通常価格</th>
    <th>保険コミットメント</th>
    <th>保険料</th>
    <th className="text-accent-600">返金見込</th> {/* 新規追加 */}
    <th>保険削減額</th>
    <th>標準RI/SP</th>
    <th>標準初期コスト</th>
    <th>標準削減額</th>
  </tr>
</thead>

// テーブルボディ（返金見込み列）
<td className="text-right">
  <span className="text-accent-600 font-medium">
    {formatCurrency(detail.insurance_expected_refund)}
  </span>
</td>

// 保険削減額（内訳表示）
<td className="text-right">
  <span className="text-success-600 font-semibold">
    {formatCurrency(detail.insurance_savings)}
  </span>
  {detail.insurance_expected_refund > 0 && (
    <div className="text-xs text-secondary-600 mt-1">
      ({formatCurrency(detail.insurance_savings - detail.insurance_expected_refund)} + 
      {formatCurrency(detail.insurance_expected_refund)})
    </div>
  )}
</td>
```

---

### 5. ResourceSelector.tsx（動的リソース選択）★★

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

import { ServerIcon, DatabaseIcon, ZapIcon, PackageIcon, PlusIcon, TrashIcon, InfoIcon } from '@/components/icons'

const ServiceIcon = ({ service, className = '', size = 20 }: { service: string; className?: string; size?: number }) => {
  switch (service) {
    case 'ec2':
      return <ServerIcon className={className} size={size} />
    case 'rds':
      return <DatabaseIcon className={className} size={size} />
    case 'elasticache':
      return <ZapIcon className={className} size={size} />
    default:
      return <PackageIcon className={className} size={size} />
  }
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
        <div className="flex items-center gap-2">
          <PackageIcon className="text-primary-600" size={24} />
          <h3 className="text-xl font-bold text-secondary-900">
            シミュレーション対象リソース (東京リージョン)
          </h3>
        </div>
        <button
          onClick={addResource}
          className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
        >
          <PlusIcon size={18} />
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
                      {meta.name}
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
                  className="w-full px-4 py-2 bg-danger-500 hover:bg-danger-600 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <TrashIcon size={18} />
                  <span>削除</span>
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

### 6. lib/simulator.ts（コア計算ロジック）★★★

保険コミットメントと標準RI/SPのコスト計算エンジン

#### 主要関数

**calculateInsurancePlan**: 保険コミットメントの月次コスト計算
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
  let totalExpectedRefund = 0  // 返金見込み合計 ★
  const details: DetailItem[] = []
  
  for (const res of resources) {
    const onDemandRate = catalog.resources[res.service][res.instance].on_demand_hourly_usd
    const coverageQty = res.quantity * coverage
    const remainingQty = res.quantity - coverageQty
    
    // 割引適用後のコスト
    const discountedCost = onDemandRate * hours * coverageQty * usage * (1.0 - plan.discount_rate)
    
    // プレミアム料金
    const premiumBase = onDemandRate * hours * coverageQty * plan.discount_rate
    const premium = premiumBase * plan.premium_rate
    
    // 返金見込み計算 ★
    const premiumAt100Coverage = onDemandRate * hours * res.quantity * plan.discount_rate * plan.premium_rate
    const expectedRefund = premiumAt100Coverage - premium
    
    // 残りリソースのコスト
    const remainingCost = onDemandRate * hours * remainingQty * usage
    
    const monthlyCost = discountedCost + premium + remainingCost
    
    totalMonthlyCost += monthlyCost
    totalPremium += premium
    totalExpectedRefund += expectedRefund  // 返金見込み集計 ★
    
    // 詳細データに返金見込みを追加 ★
    details.push({
      resource: `${res.service}:${res.instance}`,
      baseline_cost: onDemandRate * hours * res.quantity * usage,
      insurance_cost: monthlyCost,
      insurance_premium: premium,
      insurance_expected_refund: expectedRefund,  // 返金見込み ★
      insurance_savings: baselineCost - monthlyCost,
      // ...
    })
  }
  
  // 実効削減額 = 基本削減額 + 返金見込み ★
  const baseSavings = baselineCost - totalMonthlyCost
  const effectiveMonthlySavings = baseSavings + totalExpectedRefund
  
  return {
    result: {
      name: `Insurance Commitment ${plan.name}`,
      monthly_cost: totalMonthlyCost,
      monthly_savings: effectiveMonthlySavings,  // 実効削減額 ★
      initial_cost: 0,
      premium: totalPremium,
      expected_refund: totalExpectedRefund,  // 返金見込み ★
      break_even_months: calculateBreakEvenMonths(baselineCost, totalMonthlyCost, 0),
    },
    details
  }
}

/**
 * 最新の計算ロジック（2026年1月実装）
 * 
 * ### 基本パラメータ:
 * - 保険コミットメント料金: 標準RI/SP 3年NoUpfrontの100%使用時コストを基準
 * - 保険料率: 30日保証 50% / 1年保証 33%
 * 
 * ### 計算手順:
 * 
 * 1. **オンデマンドカバー分の算出**
 *    ```
 *    onDemandCoveredCost = onDemandRate × hours × coverageQty × 1.0
 *    ```
 * 
 * 2. **保険コミットメント月額の算出**
 *    ```
 *    // 3年NoUpfront基準コストの算出
 *    baseline3yrNoUpfront = 3年NoUpfront時間単価 × 時間数 × 全台数
 *    insuranceCoveredCost = baseline3yrNoUpfront × coverage
 *    ```
 * 
 * 3. **削減額の算出**
 *    ```
 *    savingsAmount = onDemandCoveredCost - insuranceCoveredCost
 *    ```
 * 
 * 4. **返金額の決定**
 *    ```
 *    if (savingsAmount < 0):
 *      expectedRefund = -savingsAmount
 *    else:
 *      expectedRefund = 0
 *    ```
 * 
 * 5. **保険料の算出**
 *    ```
 *    if (expectedRefund === 0):
 *      premium = savingsAmount × plan.premium_rate
 *    else:
 *      premium = 0
 *    ```
 * 
 * 6. **月額コストの算出**
 *    ```
 *    monthlyCost = insuranceCoveredCost + premium + remainingCost - expectedRefund
 *    ```
 * 
 * ### 計算例:
 * 
 * **ケース1: カバレッジ70%（返金なし）**
 * - オンデマンドカバー: $212.69
 * - 保険コミットメント月額: $85.03
 * - 削減額: $127.66 (正の値)
 * - 返金: $0
 * - 保険料: $127.66 × 0.33 = $42.13
 * - 月額コスト: $85.03 + $42.13 + $91.10 = $218.26
 * 
 * **ケース2: カバレッジ30%（返金なし）**
 * - オンデマンドカバー: $91.10
 * - 保険コミットメント月額: $36.44
 * - 削減額: $54.66 (正の値)
 * - 返金: $0
 * - 保険料: $54.66 × 0.33 = $18.04
 * - 月額コスト: $36.44 + $18.04 + $212.58 = $267.06
 * 
 * ### レベニュー計算:
 * ```
 * revenue = premium × 0.20  // 保険料の20%
 * ```
 */
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
    
    // 保険コミットメントの累積コスト（月次コストのみ、初期費用なし）
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

**返金見込みの計算**:
- 保険コミットメントの特徴的な機能
- カバレッジを下げることで未使用分の保険料が返金として還元
- 実効削減額 = 基本削減額 + 返金見込み

### 7. lib/types.ts（型定義）★

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
  monthly_savings: number         // 月次削減額（実効削減額）★
  monthly_cash_savings?: number   // キャッシュ削減額
  initial_cost: number            // 初期費用（一括払い）
  premium: number                 // プレミアム料金（保険のみ）
  expected_refund?: number        // 返金見込み（保険のみ）★
  break_even_months: number | null // 損益分岐点（月数）
}

// 累積データ（グラフ用）
export interface CumulativeData {
  months: number[]        // [1, 2, 3, ..., 12] or [..., 36]
  on_demand: number[]     // 通常価格の累積コスト
  insurance: number[]     // 保険コミットメントの累積ランニングコスト
  standard: number[]      // 標準RI/SPの累積ランニングコスト
}

// シミュレーション結果
export interface SimulationResult {
  baseline_cost: number       // ベースライン月次コスト
  insurance: PlanResult       // 保険コミットメントの結果
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
  insurance_expected_refund: number  // 返金見込み ★
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

### 8. lib/pricing-catalog.ts（価格カタログ）★

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
      discount_rate: 0.60,   // 60% discount
      premium_rate: 0.50,    // 50% premium on saved amount
      term_months: 1,
      effective_discount_rate: 0.30  // 実効割引率: 30.0%
    },
    '1y': {
      name: '1-year guarantee',
      discount_rate: 0.60,   // 60% discount
      premium_rate: 0.33,    // 33% premium on saved amount
      term_months: 12,
      effective_discount_rate: 0.402  // 実効割引率: 40.2%
    }
  }
}

/**
 * 保険コミットメントの実効割引率の計算
 * 
 * 実効割引率 = (オンデマンド月額 - 月額合計) / オンデマンド月額
 * 
 * 例: 1年保証プラン
 *   オンデマンド月額: $79.42
 *   割引後コスト: $79.42 × (1 - 0.60) = $31.77
 *   保険料: $79.42 × 0.60 × 0.33 = $15.73
 *   月額合計: $31.77 + $15.73 = $47.50
 *   実効割引率: ($79.42 - $47.50) / $79.42 = 40.2%
 * 
 * 結論:
 *   1年保証（40.2%）≈ RI AllUpfront（41.2%）≈ SP 1年（40.0%）
 *   保険コミットメントは標準RI/SPと同等の割引率を実現
 */
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

### カラーパレット（Alphuas Cloud配色）
```typescript
// TailwindCSS設定 - 全スケール定義
const colors = {
  // Primary: Sky Blue（メインカラー）
  primary: {
    50: '#f0f9ff',
    100: '#e0f2fe',
    200: '#b9e6fe',
    300: '#7dd3fc',
    400: '#38bdf8',
    500: '#0ea5e9',  // メイン
    600: '#0284c7',
    700: '#0369a1',
    800: '#075985',
    900: '#0c4a6e',
    950: '#082f49',
  },
  // Secondary: Slate Gray（サブカラー）
  secondary: {
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',  // メイン
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a',
  },
  // Accent: Cyan（アクセント - 保険コミットメント用）
  accent: {
    50: '#ecfeff',
    100: '#cffafe',
    200: '#a5f3fc',
    300: '#67e8f9',
    400: '#22d3ee',
    500: '#06b6d4',  // メイン
    600: '#0891b2',
    700: '#0e7490',
    800: '#155e75',
    900: '#164e63',
  },
  // Success: Green（削減額表示用）
  success: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e',  // メイン
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#14532d',
  },
  // Warning: Amber（警告用）
  warning: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b',  // メイン
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f',
  },
  // Danger: Red（エラー・削除用）
  danger: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444',  // メイン
    600: '#dc2626',
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d',
  },
  // チャート色（RGBA形式）
  chart: {
    onDemand: 'rgba(100, 116, 139, 1)',      // Secondary-500
    insurance: 'rgba(6, 182, 212, 1)',       // Accent-500
    insuranceDashed: 'rgba(6, 182, 212, 0.6)',
    standard: 'rgba(14, 165, 233, 1)',       // Primary-500
    standardDashed: 'rgba(14, 165, 233, 0.6)',
  }
}
```

### カラー使用ガイドライン

- **Primary (Sky Blue)**: ボタン、標準RI/SP関連、主要アクション
- **Secondary (Slate Gray)**: 通常価格、テキスト、境界線
- **Accent (Cyan)**: 保険コミットメント関連、強調表示
- **Success (Green)**: 削減額、ポジティブ指標
- **Warning (Amber)**: 収益差額、注意喚起
- **Danger (Red)**: エラー、削除アクション

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

### 0. 返金見込みの実装

**重要**: 保険コミットメントの特徴的な機能

#### 計算ロジック

```typescript
// 100%カバレッジ時の保険料
const premiumAt100Coverage = オンデマンド時間単価 × 稼働時間 × リソース数量 × 割引率 × 保険料率

// 実際のカバレッジでの保険料
const premiumBase = オンデマンド時間単価 × 稼働時間 × (リソース数量 × カバレッジ率) × 割引率
const premiumActual = premiumBase × 保険料率

// 返金見込み
const expectedRefund = premiumAt100Coverage - premiumActual
```

#### 実効削減額の計算

```typescript
// 基本削減額
const baseSavings = 通常価格月額 - 月額コスト

// 実効削減額（返金見込みを含む）
const effectiveMonthlySavings = baseSavings + expectedRefund
```

#### 効果

- カバレッジ50%の場合: 返金見込み $35.74（保険料の50%）
- カバレッジ70%の場合: 返金見込み $21.44（保険料の30%）
- カバレッジ100%の場合: 返金見込み $0（全額使用）
- **実効削減額は常に一定**（30.0%の削減率を維持）

#### UI表示

**CostCards.tsx**:
```typescript
// 月間削減額の内訳表示
<div className="text-xs text-secondary-600">
  (基本削減: {formatCurrency(savings - refund)} + 
  返金見込: {formatCurrency(refund)})
</div>

// 返金見込み単独表示
<div className="flex items-center gap-2">
  <CoinsIcon className="text-accent-600" size={18} />
  <span>💰 返金見込</span>
  <span className="font-bold text-accent-600">
    {formatCurrency(expectedRefund)}
  </span>
</div>
```

**DetailsTable.tsx**:
```typescript
// 返金見込み列
<th className="text-accent-600">返金見込</th>

// 保険削減額の内訳
{detail.insurance_expected_refund > 0 && (
  <div className="text-xs text-secondary-600 mt-1">
    ({formatCurrency(detail.insurance_savings - detail.insurance_expected_refund)} + 
    {formatCurrency(detail.insurance_expected_refund)})
  </div>
)}
```

---

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
    "chart.js": "^4.4.1"
  },
  "devDependencies": {
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "typescript": "^5.6",
    "tailwindcss": "^3.4.14",
    "postcss": "^8",
    "autoprefixer": "^10",
    "eslint": "^9",
    "eslint-config-next": "^15"
  }
}
```

**注意**: `clsx`, `uuid` の依存関係は現在の実装では使用されていません。

---

## 📝 関連ドキュメント

### 計算仕様書 (CALCULATION_SPECIFICATION.md)

詳細な計算ロジック、割引率の詳細、返金見込みの計算方法などが記載されています。

**主要セクション**:
1. 割引率の詳細 (RI/SP/保険コミットメント)
2. 基本用語定義
3. 保険コミットメント計算 (返金見込み含む)
4. 標準RI/SP計算
5. 累積コスト計算
6. UI設計
7. データ構造
8. グラフ仕様
9. 計算例

### GitHubリポジトリ

プロジェクトは `genspark_ai_developer` ブランチで開発されています。

**リポジトリ**: https://github.com/hkdstamp/compare-risp  
**Pull Request**: [#1 - Complete MSP Revenue Simulator](https://github.com/hkdstamp/compare-risp/pull/1)

---

## 🔧 トラブルシューティング (追加項目)

### 返金見込みが0になる
**原因**: カバレッジが100%に設定されている  
**解決**: カバレッジを100%未満に設定すると返金見込みが発生します

### SVGアイコンが表示されない
**原因**: `components/icons/index.tsx`がインポートされていない  
**解決**: `import { ShieldIcon, ... } from '@/components/icons'`を確認

### 割引率モーダルが開かない
**原因**: `DiscountRateInfo`コンポーネントが`SimulationConfig`に追加されていない  
**解決**: `SimulationConfig.tsx`に`<DiscountRateInfo />`を追加

### 色が正しく表示されない
**原因**: `tailwind.config.js`のカラーパレットが古い  
**解決**: Alphuas Cloud配色（Primary, Secondary, Accent, Successなど）を確認
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

### Phase 5: アイコンコンポーネント ★
- [ ] `components/icons/index.tsx` - 24種類のSVGアイコン定義
  - [ ] ShieldIcon, CalendarIcon, DollarIcon
  - [ ] CoinsIcon, BalanceIcon, InfoIcon, XIcon
  - [ ] ServerIcon, DatabaseIcon, ZapIcon, PackageIcon
  - [ ] PlusIcon, TrashIcon, SearchIcon
  - [ ] LineChartIcon, BarChartIcon, TargetIcon
  - [ ] 他のアイコン

### Phase 6: UIコンポーネント（基本）
- [ ] `components/Header.tsx`
- [ ] `components/Footer.tsx`
- [ ] `components/ResourceInfo.tsx`

### Phase 7: UIコンポーネント（入力）
- [ ] `components/ResourceSelector.tsx` - 動的リソース選択（SVGアイコン対応）★
- [ ] `components/SimulationConfig.tsx` - 設定パネル（情報アイコン付き）★

### Phase 8: UIコンポーネント（結果表示）
- [ ] `components/ui/DiscountRateInfo.tsx` - 割引率情報モーダル ★★
- [ ] `components/ui/CostCards.tsx` - 返金見込み表示機能付き ★★
- [ ] `components/ui/RevenueHighlight.tsx`
- [ ] `components/ui/CumulativeChart.tsx` - メインチャート（SVGアイコン対応）★★★
- [ ] `components/ui/MonthlyChart.tsx` - SVGアイコン対応 ★
- [ ] `components/ui/DetailsTable.tsx` - 返金見込み列付き ★★
- [ ] `components/SimulationResults.tsx`

### Phase 9: メインページ
- [ ] `app/page.tsx` - シミュレーション画面

### Phase 10: スタイリング（Alphuas配色）★
- [ ] `app/globals.css` - グローバルスタイル（スクロールバーカスタマイズ）
- [ ] `tailwind.config.js` - Alphuas Cloud風カラーパレット
  - [ ] Primary (Sky Blue)
  - [ ] Secondary (Slate Gray)
  - [ ] Accent (Cyan - 保険コミットメント用)
  - [ ] Success, Warning, Danger
  - [ ] 全スケール（50-950）定義

### Phase 11: ドキュメント作成 ★
- [ ] `CALCULATION_SPECIFICATION.md` - 計算仕様詳細
  - [ ] 割引率の詳細（RI/SP/保険コミットメント）
  - [ ] 返金見込み計算ロジック
  - [ ] 実効削減額の計算方法
  - [ ] 計算例とグラフ仕様

### Phase 12: デプロイ設定
- [ ] `amplify.yml` - AWS Amplify設定
- [ ] `next.config.js` - Next.js設定確認

### Phase 13: テスト
- [ ] ローカル開発サーバーで動作確認
- [ ] 返金見込み計算の検証
  - [ ] カバレッジ50%で返金見込み$35.74
  - [ ] カバレッジ70%で返金見込ま$21.44
  - [ ] カバレッジ100%で返金見込み$0
- [ ] 割引率情報モーダルの表示確認
- [ ] SVGアイコンの表示確認
- [ ] プロダクションビルドテスト
- [ ] 各テストシナリオ実行

### Phase 14: デプロイ
- [ ] AWS Amplifyにデプロイ
- [ ] 本番環境で動作確認

## 🎉 完成確認

すべてのチェックリストが完了したら、以下を確認してください：

✅ ローカルで`npm run dev`が正常に起動  
✅ リソース選択UIが動作（SVGアイコン表示）★  
✅ シミュレーション実行が成功  
✅ 返金見込みが正しく計算・表示される★  
✅ 割引率情報モーダルが正しく表示される★  
✅ グラフが正しく表示（5本のライン、SVGアイコン）  
✅ 損益分岐点が表示される  
✅ Alphuas Cloud配色が正しく適用されている★  
✅ レスポンシブデザインが機能  
✅ プロダクションビルドが成功  
✅ AWS Amplifyデプロイが成功  

---

**🌊 このプロンプトで、完全なMSP収益シミュレーションツールを再現できます！**

---

## 🆕 最新の機能追加（2025-11-28更新）

### 1. 返金見込み機能 ★★★

**追加日**: 2025-11-28  
**目的**: 保険コミットメントでカバレッジを100%未満に設定した際の未使用分保険料を返金見込みとして計算・表示

**計算ロジック**:
- 返金見込み = 100%カバレッジ時の保険料 - 実際のカバレッジでの保険料
- 実効削減額 = 基本削減額 + 返金見込み

**影響するファイル**:
- `lib/simulator.ts`: 返金見込み計算ロジック追加
- `lib/types.ts`: `expected_refund`, `insurance_expected_refund` フィールド追加
- `components/ui/CostCards.tsx`: 返金見込み表示機能
- `components/ui/DetailsTable.tsx`: 返金見込み列追加
- `CALCULATION_SPECIFICATION.md`: 詳細仕様ドキュメント

### 2. 割引率情報モーダル ★★

**追加日**: 2025-11-28  
**目的**: 各プランの割引率、保険料率、実効割引率を詳細に確認できるモーダル

**表示内容**:
- 保険コミットメント: 30日保証 (30.0%), 1年保証 (40.2%)
- 標準RI/SP: RI 1年/3年, SP 1年/3年
- 使い分けガイドライン

**影響するファイル**:
- `components/ui/DiscountRateInfo.tsx`: 新規モーダルコンポーネント
- `components/SimulationConfig.tsx`: 情報アイコン追加

### 3. SVGアイコンシステム ★★

**追加日**: 2025-11-28  
**目的**: 絵文字からプロフェッショナルSVGアイコンへの完全移行

**アイコン数**: 24種類  
**利点**: スケーラブル、カスタマイズ可能、アクセシビリティ向上

**影響するファイル**:
- `components/icons/index.tsx`: 全アイコン定義
- 全UIコンポーネント: 絵文字からSVGアイコンへ置き換え

### 4. Alphuas Cloud配色 ★★

**追加日**: 2025-11-28  
**目的**: Alphuas Cloudのブランドカラーに合わせたプロフェッショナルな配色

**カラーパレット**:
- Primary: Sky Blue (#0ea5e9) - 標準RI/SP用
- Accent: Cyan (#06b6d4) - 保険コミットメント用
- Secondary: Slate Gray - テキスト・境界線
- Success: Green - 削減額表示
- Warning: Amber - 収益差額
- Danger: Red - エラー・削除

**影響するファイル**:
- `tailwind.config.js`: 完全なカラースケール定義
- `app/globals.css`: スクロールバーカスタマイズ
- 全UIコンポーネント: 新しい配色適用

---

Generated: 2025-11-28 (更新)  
Version: 2.1.0  
Framework: Next.js 15 + React 19 + TypeScript 5.6 + TailwindCSS 3.4  

**主要機能**:
- ✅ 返金見込み計算・表示
- ✅ 割引率情報モーダル
- ✅ SVGアイコンシステム
- ✅ Alphuas Cloud配色
- ✅ 累積コスト比較
- ✅ 損益分岐点表示
