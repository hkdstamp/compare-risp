# コードドキュメント & 環境構築手順書

> Alphaus MSP Revenue Simulator - Next.js Edition

**最終更新**: 2025年12月16日  
**バージョン**: 2.0.0

---

## 目次

1. [環境構築手順](#環境構築手順)
2. [主要モジュール・機能の説明](#主要モジュール機能の説明)
3. [テストの実行方法](#テストの実行方法)
4. [トラブルシューティング](#トラブルシューティング)

---

## 環境構築手順

### 前提条件

開発環境で本アプリケーションを動作させるために、以下のソフトウェアが必要です。

| ソフトウェア | 最小バージョン | 推奨バージョン | 確認コマンド |
|------------|--------------|--------------|------------|
| **Node.js** | 18.x | 20.x 以上 | `node --version` |
| **npm** | 9.x | 10.x 以上 | `npm --version` |
| **Git** | 2.x | 最新版 | `git --version` |

#### Node.jsのインストール（未インストールの場合）

**macOSの場合:**
```bash
# Homebrewを使用
brew install node@20

# または、公式インストーラーを使用
# https://nodejs.org/ からダウンロード
```

**Windowsの場合:**
```bash
# 公式インストーラーを使用
# https://nodejs.org/ からダウンロード

# または、Chocolateyを使用
choco install nodejs-lts
```

**Linuxの場合:**
```bash
# Ubuntu/Debian
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# CentOS/RHEL
curl -fsSL https://rpm.nodesource.com/setup_20.x | sudo bash -
sudo yum install -y nodejs
```

---

### ステップ 1: リポジトリのクローン

```bash
# HTTPSでクローン
git clone https://github.com/your-org/wave-microfrontend.git

# または、SSHでクローン
git clone git@github.com:your-org/wave-microfrontend.git

# compare-rispディレクトリに移動
cd wave-microfrontend/compare-risp
```

---

### ステップ 2: 依存関係のインストール

```bash
# npmを使用して依存関係をインストール
npm install
```

**インストールされる主な依存関係:**
- `next@^15.0.3`: Next.jsフレームワーク
- `react@^19.0.0`: Reactライブラリ
- `react-chartjs-2@^5.2.0`: Chart.jsのReactラッパー
- `chart.js@^4.4.1`: グラフ描画ライブラリ
- `typescript@^5.6.0`: TypeScript
- `tailwindcss@^3.4.14`: CSSフレームワーク

**依存関係のインストールに失敗した場合:**
```bash
# キャッシュをクリアして再インストール
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

---

### ステップ 3: 環境変数の設定（オプション）

現在のバージョンでは環境変数の設定は不要ですが、将来的な拡張のために設定ファイルを準備できます。

```bash
# .env.localファイルを作成（オプション）
touch .env.local
```

**.env.local（将来の拡張用）:**
```env
# アプリケーションURL（本番環境）
NEXT_PUBLIC_APP_URL=https://compare-risp.your-domain.com

# API エンドポイント（カスタマイズする場合）
# NEXT_PUBLIC_API_BASE_URL=/api

# 開発モード（デバッグログを有効化）
# NEXT_PUBLIC_DEBUG=true
```

---

### ステップ 4: 開発サーバーの起動

```bash
# 開発サーバーを起動（ポート3012で起動）
npm run dev
```

**成功時の出力例:**
```
   ▲ Next.js 15.0.3
   - Local:        http://localhost:3012
   - Environments: .env.local

 ✓ Ready in 2.3s
```

---

### ステップ 5: ブラウザでアクセス

ブラウザを開いて、以下のURLにアクセスします。

```
http://localhost:3012
```

**初期画面が表示されれば成功です！**

![初期画面](https://via.placeholder.com/800x400?text=Simulation+UI+Screenshot)

---

### ステップ 6: プロダクションビルド（デプロイ前の確認）

```bash
# プロダクションビルドを実行
npm run build

# ビルドをローカルで確認
npm run start
```

**ビルド成功時の出力例:**
```
   ▲ Next.js 15.0.3

   Creating an optimized production build ...
 ✓ Compiled successfully
 ✓ Linting and checking validity of types
 ✓ Collecting page data
 ✓ Generating static pages (3/3)
 ✓ Finalizing page optimization

Route (app)                              Size     First Load JS
┌ ○ /                                    5.2 kB         120 kB
├ ○ /api/pricing                         0 B                0 B
├ ○ /api/resources                       0 B                0 B
└ ○ /api/simulate                        0 B                0 B

○  (Static)  prerendered as static HTML

✨  Done in 15.2s.
```

---

## 主要モジュール・機能の説明

本セクションでは、アプリケーションの中核を担う主要なファイル、クラス、関数について説明します。

---

### 1. コアビジネスロジック（lib/）

#### lib/simulator.ts

**役割:** コスト最適化シミュレーションのコア計算ロジック

**主要関数:**

##### `calculateInsurancePlan()`
```typescript
export function calculateInsurancePlan(
  catalog: PricingCatalog,
  resources: ResourceConfig[],
  insuranceKey: string,
  coverage: number,
  usage: number,
  hours: number,
  standardTermMonths: number
): { result: PlanResult; details: DetailItem[] }
```

**実装意図:**
- **保険RI/SPのコスト計算**: 保険料率、割引率、返金見込みを考慮した月額コストを算出
- **返金見込み機能**: カバレッジが100%未満の場合、未使用分の保険料を返金として計算
  - 計算式: `返金見込み = (100%カバレッジ時の保険料) - (実際のカバレッジ時の保険料)`
  - これにより、カバレッジを下げることで得られる返金額を可視化
- **損益分岐点計算**: 標準RI/SPの契約期間を基準に、保険RI/SPの損益分岐点を算出
  - 重要: 保険RI/SPの契約期間ではなく、標準RI/SPの契約期間で比較
  - 計算式: `損益分岐点 = ceil(総支出 / 月額ベースラインコスト)`

**ロジックの詳細:**
```typescript
// 返金見込み計算の実装
const premiumAt100Coverage = onDemandRate * hours * res.quantity * plan.discount_rate * plan.premium_rate
const expectedRefund = premiumAt100Coverage - premium

// 損益分岐点計算の実装
// IMPORTANT: standardTermMonths（標準RI/SPの契約期間）を使用
const totalExpenditure = 0 + (totalMonthlyCost * standardTermMonths)
let breakEven = Math.ceil(totalExpenditure / totalBaseline)
if (breakEven > standardTermMonths) {
  breakEven = null  // 契約期間内に損益分岐しない場合
}
```

---

##### `calculateStandardPlan()`
```typescript
export function calculateStandardPlan(
  catalog: PricingCatalog,
  resources: ResourceConfig[],
  term: string,
  option: string,
  coverage: number,
  usage: number,
  hours: number
): { result: PlanResult; details: DetailItem[] }
```

**実装意図:**
- **標準RI/SPのコスト計算**: 初期費用、時間単価、月額コストを算出
- **Savings Plans対応**: `option === 'SavingsPlan'` の場合、Savings Plans料金を適用
- **実効コスト計算**: 初期費用を契約期間で按分し、月額実効コストを算出
  - 計算式: `月額実効コスト = (初期費用 / 契約期間月数) + (時間単価 × 時間 × 数量)`
- **損益分岐点計算**: オンデマンドの累積コストが総支出を超える月を算出

**ロジックの詳細:**
```typescript
// Savings Plans判定
const isSavingsPlan = option === 'SavingsPlan'

if (isSavingsPlan) {
  // Savings Plans料金を使用
  reservedRate = resourcePricing.savings_plans[term].hourly_usd
  upfront = 0  // Savings Plansは初期費用ゼロ
} else {
  // Reserved Instance料金を使用
  const plan = resourcePricing.standard_ri[term][option]
  reservedRate = plan.hourly_usd
  upfront = plan.upfront_usd
}

// 損益分岐点計算（総支出ベース）
const totalExpenditure = totalInitialCost + (totalMonthlyEffective * termMonths)
let breakEven = Math.ceil(totalExpenditure / totalBaseline)
if (breakEven > termMonths) {
  breakEven = null
}
```

---

##### `calculateCumulativeCosts()`
```typescript
export function calculateCumulativeCosts(
  baselineCost: number,
  insurancePlan: PlanResult,
  standardPlan: PlanResult,
  standardTerm: string
): CumulativeData
```

**実装意図:**
- **累積コスト推移の計算**: 12ヶ月分の累積コストデータを生成
- **グラフ描画用データ**: Chart.jsで使用するデータ構造を返す
- **総支出の可視化**: 初期費用 + 月額コスト × 月数の累積を計算

**ロジックの詳細:**
```typescript
// 保険RI/SPの累積コスト（初期費用ゼロ）
insuranceCumulative.push(insurancePlan.monthly_cost * month)

// 標準RI/SPの総支出（初期費用 + 月額コスト × 月数）
// IMPORTANT: これは「累積」ではなく「総支出」
standardCumulative.push(
  standardPlan.initial_cost + (standardPlan.monthly_cost * month)
)
```

---

#### lib/pricing-catalog.ts

**役割:** AWS価格カタログの管理

**データ構造:**
```typescript
export const pricingCatalog: PricingCatalog = {
  metadata: {
    region: "ap-northeast-1",
    hours_per_month: 730
  },
  resources: {
    ec2: {
      "t3.large": {
        on_demand_hourly_usd: 0.1088,
        standard_ri: {
          "1yr": {
            NoUpfront: { hourly_usd: 0.0685, upfront_usd: 0 },
            PartialUpfront: { hourly_usd: 0.0326, upfront_usd: 286 },
            AllUpfront: { hourly_usd: 0.0, upfront_usd: 560 }
          },
          "3yr": { /* ... */ }
        },
        savings_plans: {
          "1yr": { hourly_usd: 0.0653 },
          "3yr": { hourly_usd: 0.0435 }
        }
      },
      // ... 他のインスタンスタイプ
    },
    rds: { /* ... */ },
    elasticache: { /* ... */ },
    // ... 他のサービス
  },
  insurance_plans: {
    "30d": {
      name: "30-Day Guarantee",
      discount_rate: 0.30,
      premium_rate: 0.10
    },
    "1y": {
      name: "1-Year Guarantee",
      discount_rate: 0.35,
      premium_rate: 0.05
    }
  }
}
```

**実装意図:**
- **データの一元管理**: 全てのAWSリソース価格を一箇所で管理
- **高速アクセス**: インメモリデータによる即座のアクセス
- **保守性**: 価格変更時は、このファイルのみを更新すればよい

**対応リソース（18種類以上）:**
- **EC2**: t3.micro, t3.small, t3.medium, t3.large, t3.xlarge, t3.2xlarge, c5.large, c5.xlarge, c5.2xlarge, c5.4xlarge, c5.9xlarge, c5.18xlarge
- **RDS**: db.t3.micro, db.t3.small, db.t3.medium, db.r5.large, db.r5.xlarge, db.r5.2xlarge
- **ElastiCache**: cache.t3.micro, cache.t3.small, cache.r5.large

---

#### lib/types.ts

**役割:** TypeScript型定義の管理

**主要な型定義:**

```typescript
// リソース設定
export interface ResourceConfig {
  service: string      // "ec2", "rds", "elasticache"
  instance: string     // "t3.large", "db.r5.xlarge", etc.
  quantity: number     // リソース数量
  usage?: number       // 使用率（0-1）
  coverage?: number    // カバレッジ（0-1）
}

// プラン結果
export interface PlanResult {
  name: string                   // プラン名
  monthly_cost: number           // 月額コスト
  monthly_savings: number        // 月額削減額
  initial_cost: number           // 初期費用
  premium: number                // 保険料（保険RI/SPのみ）
  expected_refund?: number       // 返金見込み（保険RI/SPのみ）
  break_even_months: number | null // 損益分岐点（月）
}

// シミュレーション結果
export interface SimulationResult {
  baseline_cost: number          // ベースライン月額コスト
  insurance: PlanResult          // 保険RI/SP結果
  standard: PlanResult           // 標準RI/SP結果
  cumulative: CumulativeData     // 累積コストデータ
  details: DetailItem[]          // リソース別詳細
  coverage?: number              // カバレッジ（0-1）
}

// 累積コストデータ（グラフ用）
export interface CumulativeData {
  months: number[]               // 月（1-12）
  on_demand: number[]            // オンデマンド累積コスト
  insurance: number[]            // 保険RI/SP累積コスト
  standard: number[]             // 標準RI/SP総支出
}
```

**実装意図:**
- **型安全性**: コンパイル時のエラー検出
- **コードの自己文書化**: 型定義がドキュメントとして機能
- **IDE支援**: 自動補完とリファクタリング支援

---

### 2. APIエンドポイント（app/api/）

#### app/api/simulate/route.ts

**役割:** シミュレーション実行API

**エンドポイント:** `POST /api/simulate`

**リクエストボディ:**
```json
{
  "insurance": "30d",
  "standard_term": "1y",
  "standard_option": "no_upfront",
  "coverage": 0.8,
  "usage": 0.8,
  "resources": [
    { "service": "ec2", "instance": "t3.large", "quantity": 10 }
  ]
}
```

**レスポンス:**
```json
{
  "baseline_cost": 7944.0,
  "insurance": {
    "name": "Insurance RI/SP 30-Day Guarantee",
    "monthly_cost": 5661.6,
    "monthly_savings": 2282.4,
    "initial_cost": 0,
    "premium": 793.44,
    "expected_refund": 158.688,
    "break_even_months": 9
  },
  "standard": { /* ... */ },
  "cumulative": { /* ... */ },
  "details": [ /* ... */ ]
}
```

**実装意図:**
- **サーバー側計算**: コア計算ロジックをクライアント側に露出しない
- **バリデーション**: 入力値の検証をサーバー側で実行
- **エラーハンドリング**: 適切なHTTPステータスコードとエラーメッセージを返す

---

#### app/api/pricing/route.ts

**役割:** 価格カタログ取得API

**エンドポイント:** `GET /api/pricing`

**レスポンス:** `pricingCatalog` オブジェクト全体を返す

---

#### app/api/resources/route.ts

**役割:** デフォルトリソース設定取得API

**エンドポイント:** `GET /api/resources`

**レスポンス:**
```json
[
  { "service": "ec2", "instance": "t3.large", "quantity": 10 }
]
```

---

### 3. UIコンポーネント（components/）

#### components/ResourceSelector.tsx

**役割:** 動的リソース選択UI

**主要機能:**
- サービス選択（EC2, RDS, ElastiCache）
- インスタンスタイプ選択（動的にフィルタリング）
- 数量入力
- リソースの追加・削除

**実装意図:**
- **動的フィルタリング**: サービス選択時に、そのサービスで利用可能なインスタンスタイプのみを表示
- **SVGアイコン**: 絵文字ではなくSVGアイコンを使用し、視認性を向上
- **ユーザビリティ**: ドラッグ&ドロップ不要の直感的な操作

---

#### components/SimulationConfig.tsx

**役割:** シミュレーション設定パネル

**主要機能:**
- 保険プラン選択（30日保証/1年保証）
- 標準プラン選択（1年/3年、支払方法）
- カバレッジ設定（0-100%、スライダー）
- 使用率設定（0-100%、スライダー）
- 割引率情報モーダルの表示

**実装意図:**
- **情報アイコン**: 各設定項目に情報アイコンを配置し、説明を表示
- **リアルタイムプレビュー**: スライダー変更時に即座に値を更新
- **バリデーション**: 無効な値の入力を防止

---

#### components/SimulationResults.tsx

**役割:** シミュレーション結果表示

**主要機能:**
- コストカード（月額コスト、削減額、ROI）
- 累積コストグラフ
- 月次コスト比較グラフ
- リソース別詳細テーブル

**実装意図:**
- **可視化**: グラフとテーブルで多角的に結果を表示
- **返金見込み表示**: カバレッジが100%未満の場合、返金見込みを強調表示
- **損益分岐点表示**: グラフ上に注釈として表示

---

#### components/ui/CumulativeChart.tsx

**役割:** 累積コストグラフ（Chart.js）

**実装意図:**
- **損益分岐点の可視化**: 縦線で損益分岐点を表示
- **総支出の表示**: 標準RI/SPの総支出を水平点線で表示
- **レスポンシブ**: コンテナサイズに自動適応

**Chart.js設定の詳細:**
```typescript
const data = {
  labels: cumulative.months,
  datasets: [
    {
      label: 'On-Demand',
      data: cumulative.on_demand,
      borderColor: 'rgb(156, 163, 175)',
      backgroundColor: 'rgba(156, 163, 175, 0.1)',
    },
    {
      label: insurance.name,
      data: cumulative.insurance,
      borderColor: 'rgb(59, 130, 246)',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
    },
    {
      label: standard.name,
      data: cumulative.standard,
      borderColor: 'rgb(16, 185, 129)',
      backgroundColor: 'rgba(16, 185, 129, 0.1)',
      borderDash: [5, 5],  // 点線
    },
  ]
}

const options = {
  // ... 損益分岐点の注釈設定
  plugins: {
    annotation: {
      annotations: {
        breakEvenLine: {
          type: 'line',
          xMin: insurance.break_even_months,
          xMax: insurance.break_even_months,
          borderColor: 'rgb(239, 68, 68)',
          borderWidth: 2,
          borderDash: [10, 5],
        }
      }
    }
  }
}
```

---

### 4. PostMessage API（app/page.tsx）

**役割:** 親アプリケーションとの双方向通信

**実装意図:**
- **iframe統合**: 親アプリから設定を受信し、結果を送信
- **セキュリティ**: オリジン検証により、不正なメッセージを拒否
- **イベント駆動**: メッセージ受信時に自動的にシミュレーション再実行

**実装詳細:**
```typescript
const handleMessage = (event: MessageEvent<PostMessageData>) => {
  // オリジン検証
  const allowedOrigins = [
    'http://localhost:3000',
    'https://wave.onedev.alphaus.cloud',
  ]
  const isLocalhost = event.origin.startsWith('http://localhost:')
  const isAllowed = allowedOrigins.includes(event.origin) || 
                    (process.env.NODE_ENV === 'development' && isLocalhost)
  
  if (!isAllowed) {
    console.warn('[compare-risp] Unknown origin:', event.origin)
    return
  }

  // メッセージタイプ別処理
  switch (event.data.type) {
    case 'UPDATE_CONFIG':
      // 設定を更新し、シミュレーション再実行
      break
    case 'GET_RESULT':
      // 現在の結果を親に送信
      window.parent.postMessage({
        type: 'SIMULATION_RESULT',
        result: simulationResult
      }, event.origin)
      break
  }
}
```

---

## テストの実行方法

### 現在のバージョン

現在のバージョン（2.0.0）では、自動テストは実装されていません。以下の手動テスト手順を実行してください。

### 手動テスト手順

#### 1. 基本動作テスト

```bash
# 開発サーバーを起動
npm run dev

# ブラウザで http://localhost:3012 にアクセス
```

**確認項目:**
- ✅ 初期画面が正常に表示される
- ✅ リソース選択ができる
- ✅ シミュレーション設定ができる
- ✅ "シミュレーション実行" ボタンをクリックすると結果が表示される
- ✅ グラフが正常に描画される

#### 2. API動作テスト

**方法1: ブラウザの開発者ツール**
```javascript
// Consoleで実行
fetch('/api/simulate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    insurance: '30d',
    standard_term: '1y',
    standard_option: 'no_upfront',
    coverage: 0.8,
    usage: 0.8,
    resources: [
      { service: 'ec2', instance: 't3.large', quantity: 10 }
    ]
  })
})
.then(res => res.json())
.then(data => console.log(data))
```

**方法2: curlコマンド**
```bash
curl -X POST http://localhost:3012/api/simulate \
  -H "Content-Type: application/json" \
  -d '{
    "insurance": "30d",
    "standard_term": "1y",
    "standard_option": "no_upfront",
    "coverage": 0.8,
    "usage": 0.8,
    "resources": [
      {"service": "ec2", "instance": "t3.large", "quantity": 10}
    ]
  }'
```

#### 3. エッジケーステスト

**テストケース:**
- ❌ カバレッジ = 0%（エラーまたは警告を表示）
- ✅ カバレッジ = 100%（返金見込みが0になる）
- ✅ リソース数量 = 1
- ✅ リソース数量 = 100
- ✅ 複数のリソースを追加

#### 4. プロダクションビルドテスト

```bash
# プロダクションビルドを実行
npm run build

# ビルド成功を確認
echo $?  # 0が返ればビルド成功

# ローカルでプロダクションビルドを実行
npm run start

# ブラウザで http://localhost:3000 にアクセスし、動作確認
```

---

### 将来のテスト計画（未実装）

将来的には、以下のテストを実装する予定です。

#### 単体テスト（Jest）

**対象:**
- `lib/simulator.ts`の計算ロジック
- `lib/pricing-catalog.ts`のデータ構造

**テスト例:**
```typescript
// __tests__/simulator.test.ts
import { calculateInsurancePlan } from '../lib/simulator'
import { pricingCatalog } from '../lib/pricing-catalog'

describe('calculateInsurancePlan', () => {
  it('should calculate insurance plan correctly', () => {
    const result = calculateInsurancePlan(
      pricingCatalog,
      [{ service: 'ec2', instance: 't3.large', quantity: 10 }],
      '30d',
      0.8,
      0.8,
      730,
      12
    )
    expect(result.result.monthly_cost).toBeCloseTo(5661.6, 1)
  })
})
```

#### 統合テスト（Playwright）

**対象:**
- UI操作フロー
- API呼び出し
- グラフ描画

#### E2Eテスト（Cypress）

**対象:**
- 完全なユーザーフロー
- PostMessage API
- iframe統合

---

## トラブルシューティング

### 問題1: `npm install` が失敗する

**原因:** Node.jsバージョンが古い

**解決策:**
```bash
# Node.jsバージョンを確認
node --version

# 18.x未満の場合、Node.jsをアップデート
# macOS
brew upgrade node

# Windows/Linux
# 公式インストーラーをダウンロード: https://nodejs.org/
```

---

### 問題2: ポート3012が既に使用中

**エラーメッセージ:**
```
Error: listen EADDRINUSE: address already in use :::3012
```

**解決策:**
```bash
# ポート3012を使用しているプロセスを確認
lsof -i :3012

# プロセスを終了
kill -9 <PID>

# または、別のポートを使用
npm run dev -- -p 3013
```

---

### 問題3: TypeScriptエラーが表示される

**エラーメッセージ:**
```
Type error: Cannot find module '@/lib/types'
```

**解決策:**
```bash
# node_modulesを再インストール
rm -rf node_modules package-lock.json
npm install

# TypeScriptキャッシュをクリア
rm -rf .next
npm run dev
```

---

### 問題4: グラフが表示されない

**原因:** Chart.jsの依存関係エラー

**解決策:**
```bash
# Chart.js関連パッケージを再インストール
npm install chart.js react-chartjs-2

# ブラウザのキャッシュをクリアしてリロード
# Cmd+Shift+R (macOS) / Ctrl+Shift+R (Windows/Linux)
```

---

### 問題5: APIが500エラーを返す

**デバッグ手順:**

1. サーバーログを確認
```bash
# 開発サーバーのログを確認
# ターミナルに表示されているエラーメッセージを確認
```

2. リクエストボディを確認
```javascript
// ブラウザのDevToolsで確認
// Network タブ → simulate → Payload
```

3. APIコードを確認
```bash
# app/api/simulate/route.ts のconsole.logを追加
console.log('Request body:', request.body)
```

---

## まとめ

本ドキュメントでは、以下の内容をカバーしました:

1. ✅ 環境構築手順（前提条件からアプリケーション起動まで）
2. ✅ 主要モジュール・機能の説明（コアロジック、API、UIコンポーネント）
3. ✅ テストの実行方法（手動テスト、将来のテスト計画）
4. ✅ トラブルシューティング（よくある問題と解決策）

開発・保守作業を開始する際は、このドキュメントを参照してください。

**質問や追加の説明が必要な場合は、開発チームに問い合わせてください。**
