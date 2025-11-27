# MSP Revenue Simulator - 計算仕様とUI設計ドキュメント

## 📋 目次

1. [概要](#概要)
2. [計算仕様](#計算仕様)
   - [割引率の詳細](#1-割引率の詳細)
   - [基本用語定義](#2-基本用語定義)
   - [保険RI/SP計算](#3-保険risp計算)
   - [標準RI/SP計算](#4-標準risp計算)
   - [累積コスト計算](#5-累積コスト計算)
3. [UI設計](#ui設計)
4. [データ構造](#データ構造)
5. [グラフ仕様](#グラフ仕様)
6. [計算例](#計算例)

---

## 概要

このシミュレーターは、AWS保険RI/SPと標準RI/SP（Reserved InstancesおよびSavings Plans）のコスト比較を行い、損益分岐点を算出するツールです。

### 主な機能

- 💰 保険RI/SPと標準RI/SPのコスト計算
- 📊 累積コストの可視化
- 🎯 損益分岐点の自動算出
- 📈 契約期間全体の総支出比較

---

## 計算仕様

### 1. 割引率の詳細

#### 1.1 Reserved Instance (RI) の割引率

**1年契約の割引率**

| 支払方法 | 時間単価 | 初期費用 | 月額実効コスト | 割引率 |
|---------|---------|---------|--------------|-------|
| NoUpfront | $0.0685 | $0 | $50.01 | **37.0%** |
| PartialUpfront | $0.0326 | $286 | $47.63 | **40.0%** |
| AllUpfront | $0.00 | $560 | $46.67 | **41.2%** |

**3年契約の割引率**

| 支払方法 | 時間単価 | 初期費用 | 月額実効コスト | 割引率 |
|---------|---------|---------|--------------|-------|
| NoUpfront | $0.047 | $0 | $34.31 | **56.8%** |
| PartialUpfront | $0.0218 | $572 | $31.80 | **60.0%** |
| AllUpfront | $0.00 | $1,075 | $29.86 | **62.4%** |

**割引率の計算方法**

```typescript
// NoUpfrontの場合（時間単価ベース）
割引率 = (オンデマンド時間単価 - RI時間単価) / オンデマンド時間単価 × 100

// PartialUpfront/AllUpfrontの場合（実効コストベース）
月額実効コスト = (初期費用 / 契約期間月数) + (時間単価 × 730時間)
割引率 = (オンデマンド月額 - 月額実効コスト) / オンデマンド月額 × 100
```

**重要なポイント**
- ✅ 前払いが多いほど割引率が高い
- ✅ 契約期間が長いほど割引率が高い
- ✅ 1年AllUpfront (41.2%) vs 3年AllUpfront (62.4%)
- ✅ NoUpfrontは初期費用ゼロだが割引率は最も低い

---

#### 1.2 Compute Savings Plans (SP) の割引率

| 契約期間 | 時間単価 | 初期費用 | 月額料金 | 割引率 |
|---------|---------|---------|---------|-------|
| 1年 | $0.0653 | $0 | $47.67 | **40.0%** |
| 3年 | $0.0435 | $0 | $31.75 | **60.0%** |

**割引率の計算方法**

```typescript
割引率 = (オンデマンド時間単価 - SP時間単価) / オンデマンド時間単価 × 100
```

**Savings Plansの特徴**
- ✅ 初期費用ゼロ（全額後払い）
- ✅ 1年契約で40%割引（RI PartialUpfrontと同等）
- ✅ 3年契約で60%割引（RI PartialUpfrontと同等）
- ✅ インスタンスファミリー、リージョン、OSをまたいで適用可能
- ✅ 柔軟性が高く、RIより使いやすい

**RI vs Savings Plans 比較**

| 項目 | RI 1年 AllUpfront | SP 1年 | RI 3年 AllUpfront | SP 3年 |
|------|------------------|--------|------------------|--------|
| 割引率 | 41.2% | 40.0% | 62.4% | 60.0% |
| 初期費用 | $560 | $0 | $1,075 | $0 |
| 柔軟性 | 低 | 高 | 低 | 高 |
| 推奨度 | △ | ◎ | △ | ◎ |

**結論**: Savings Plansは初期費用ゼロで高い割引率を実現し、柔軟性も高いため、多くのケースで推奨されます。

---

#### 1.3 保険RI/SP の割引率

| プラン | 割引率 | 保険料率 | 実効割引率 | 月額料金 |
|-------|-------|---------|-----------|---------|
| 30日保証 | 30% | 50% | **15.0%** | $67.51 |
| 1年保証 | 45% | 33% | **30.1%** | $55.48 |

**割引率の計算方法**

```typescript
// 割引後コスト
割引後コスト = オンデマンド月額 × (1 - 割引率)

// 保険料
保険料 = オンデマンド月額 × 割引率 × 保険料率

// 月額合計
月額合計 = 割引後コスト + 保険料

// 実効割引率
実効割引率 = (オンデマンド月額 - 月額合計) / オンデマンド月額 × 100
```

**計算例: 1年保証プラン**

```
オンデマンド月額: $79.42
割引率: 45%
保険料率: 33%

割引後コスト = $79.42 × (1 - 0.45) = $43.68
保険料 = $79.42 × 0.45 × 0.33 = $11.79
月額合計 = $43.68 + $11.79 = $55.48

実効割引率 = ($79.42 - $55.48) / $79.42 × 100 = 30.1%
```

**保険RI/SPの特徴**
- ✅ 契約期間30日または1年（短期契約が可能）
- ✅ 未使用分は返金される柔軟性
- ✅ 初期費用ゼロ
- ❌ 保険料により実効割引率は標準RI/SPより低い
- ❌ 1年保証（30.1%）< RI NoUpfront（37.0%）< SP 1年（40.0%）

**割引率の比較（1年契約）**

```
標準RI/SP:
  RI NoUpfront:       37.0%
  RI PartialUpfront:  40.0%
  RI AllUpfront:      41.2%
  Savings Plan:       40.0%

保険RI/SP:
  1年保証（実効）:    30.1%
  30日保証（実効）:   15.0%
```

**使い分けの指針**

1. **最大割引を求める**: RI AllUpfront (41.2%) またはSP (40.0%)
2. **初期費用を避けたい**: SP 1年 (40.0%) またはRI NoUpfront (37.0%)
3. **柔軟性を重視**: 保険RI/SP 1年保証 (30.1%)
4. **超短期利用**: 保険RI/SP 30日保証 (15.0%)

---

### 2. 基本用語定義

#### 通常価格（On-Demand Cost）
```
通常価格月額 = オンデマンド時間単価 × 月間稼働時間 × リソース数量 × 利用率
```

#### 総支出（Total Expenditure）
```
総支出 = 初期費用 + (月額料金 × 契約期間月数)
```
- **特徴**: 契約期間全体の固定値（グラフ上の横線）
- **用途**: 損益分岐点の算出に使用

#### 累積コスト（Cumulative Cost）
```
累積コスト(N月目) = 月額料金 × N
```
- **特徴**: 月ごとに増加する値（グラフ上の上昇線）

#### 損益分岐月（Break-Even Month）
```
損益分岐月 = ceil(総支出 / 通常価格月額)
```
- **定義**: 通常価格累積 ≥ RI/SP総支出 となる最初の月
- **意味**: この月からRI/SPを使用した方が通常価格より安くなる

---

### 3. 保険RI/SP計算

#### 2.1 月額コスト計算

```typescript
// カバレッジ対象リソース
coverageQty = リソース数量 × カバレッジ率

// 残りリソース（オンデマンド使用）
remainingQty = リソース数量 - coverageQty

// 割引後の使用コスト
discountedUsageCost = オンデマンド時間単価 × 稼働時間 × coverageQty × 利用率 × (1.0 - 割引率)

// 保険プレミアム
premiumBase = オンデマンド時間単価 × 稼働時間 × coverageQty × 割引率
premium = premiumBase × 保険料率

// 残りリソースのコスト
remainingCost = オンデマンド時間単価 × 稼働時間 × remainingQty × 利用率

// 月額合計
monthlyCost = discountedUsageCost + premium + remainingCost
```

#### 2.2 月間削減額計算

```typescript
monthlySavings = 通常価格月額 - 月額コスト
```

#### 2.3 総支出計算

```typescript
// 保険RI/SPは初期費用ゼロ
initialCost = 0

// 標準RI/SPの契約期間を使用（重要！）
totalExpenditure = 0 + (monthlyCost × 標準RI/SP契約期間月数)
```

**重要**: 保険RI/SP自体の契約期間（30日）ではなく、**選択した標準RI/SPの契約期間**を使用します。これにより公平な比較が可能になります。

#### 2.4 損益分岐月計算

```typescript
if (monthlySavings > 0) {
  breakEvenMonths = ceil(totalExpenditure / 通常価格月額)
  
  // 契約期間を超える場合はnull
  if (breakEvenMonths > 標準RI/SP契約期間月数) {
    breakEvenMonths = null
  }
}
```

---

### 4. 標準RI/SP計算

#### 3.1 Reserved Instance（RI）の場合

```typescript
// 価格情報取得
reservedRate = RIプラン.hourly_usd
upfront = RIプラン.upfront_usd

// カバレッジ計算
coverageQty = リソース数量 × カバレッジ率
remainingQty = リソース数量 - coverageQty

// 月額ランニングコスト
reservedMonthlyRecurring = reservedRate × 稼働時間 × coverageQty × 利用率

// 月額償却初期費用
reservedMonthlyAmortized = (upfront × coverageQty) / 契約期間月数

// 月額実効コスト
reservedMonthlyEffective = reservedMonthlyRecurring + reservedMonthlyAmortized

// 残りリソースのコスト
remainingMonthlyCost = オンデマンド時間単価 × 稼働時間 × remainingQty × 利用率

// 月額合計
monthlyEffective = reservedMonthlyEffective + remainingMonthlyCost

// 総初期費用
totalInitialCost = upfront × coverageQty
```

#### 3.2 Savings Plan（SP）の場合

```typescript
// Savings Planは初期費用ゼロ
upfront = 0
reservedRate = SavingsPlan.hourly_usd

// RI NoUpfrontと同じ計算方法
// ただしupfront = 0のため、月額償却は発生しない
```

#### 3.3 月間削減額計算

```typescript
monthlySavings = 通常価格月額 - 月額実効コスト
```

#### 3.4 総支出計算

```typescript
totalExpenditure = totalInitialCost + (monthlyEffective × 契約期間月数)
```

#### 3.5 損益分岐月計算

```typescript
if (monthlySavings > 0) {
  breakEvenMonths = ceil(totalExpenditure / 通常価格月額)
  
  // 契約期間を超える場合はnull
  if (breakEvenMonths > 契約期間月数) {
    breakEvenMonths = null
  }
}
```

---

### 5. 累積コスト計算

```typescript
for (month = 1 to 契約期間月数) {
  cumulative.months.push(month)
  cumulative.on_demand.push(通常価格月額 × month)
  cumulative.insurance.push(保険RI/SP月額 × month)
  cumulative.standard.push(標準RI/SP月額 × month)
}
```

---

## UI設計

### 1. シミュレーション設定パネル

#### 入力項目

| 項目 | 説明 | 選択肢 | デフォルト |
|------|------|--------|-----------|
| 🛡️ 保険RI/SPプラン | 保険プランの選択 | 30日保証 (30%割引/50%保険料)<br>1年保証 (45%割引/33%保険料) | 1年保証 |
| 📅 標準RI/SP 契約期間 | 標準プランの契約期間 | 1年予約<br>3年予約 | 1年予約 |
| 💰 標準RI/SP タイプ | 標準プランの支払方法 | **RI**:<br>- NoUpfront（全額後払い）<br>- PartialUpfront（50%前払い）<br>- AllUpfront（100%前払い）<br>**SP**:<br>- Compute Savings Plan | NoUpfront |
| 📊 想定カバレッジ | RI/SPでカバーする割合 | 0% - 100% (5%刻み) | 100% |
| ⚡ 想定利用率 | リソースの実稼働率 | 0% - 100% (5%刻み) | 100% |

#### アクションボタン

- 🚀 **シミュレーション実行**: 計算を実行
- 🔄 **リセット**: 設定を初期値に戻す

---

### 2. 結果表示パネル

#### 2.1 サマリーカード

**通常価格カード（グレー）**
- 💵 月額コスト: $XXX.XX
- サブテキスト: オンデマンド価格

**保険RI/SPカード（グリーン）**
- 🛡️ 月額コスト: $XXX.XX
- 💰 月間削減額: $XXX.XX (XX%)
- 💳 保険料: $XXX.XX
- 初期費用: $0
- 🎯 損益分岐: XX ヶ月

**標準RI/SPカード（ブルー）**
- 📊 月額コスト: $XXX.XX
- 💰 月間削減額: $XXX.XX (XX%)
- 💵 初期費用: $XXX.XX
- 🎯 損益分岐: XX ヶ月

#### 2.2 詳細内訳テーブル

| リソース | 通常価格 | 保険RI/SP<br>月額 | 保険料 | 削減額 | 標準RI/SP<br>月額 | 初期費用 | 削減額 |
|---------|---------|-----------------|--------|--------|-----------------|---------|--------|
| ec2:t3.large | $XXX | $XXX | $XX | $XX (XX%) | $XXX | $XXX | $XX (XX%) |
| rds:db.t4g.large | $XXX | $XXX | $XX | $XX (XX%) | $XXX | $XXX | $XX (XX%) |

---

### 3. 累積コストグラフ

#### 3.1 グラフの種類

**実線（Solid Lines）**: 累積ランニングコスト
- 灰色: 通常価格（オンデマンド）累積
- 緑色: 保険RI/SP 累積
- 青色: 標準RI/SP 累積

**破線（Dashed Lines）**: 総支出
- 緑色破線: 保険RI/SP 総支出
- 青色破線: 標準RI/SP 総支出

#### 3.2 グラフの見方

```
コスト
  ↑
  │     ／
  │    ／        標準RI/SP総支出（破線）────────────
  │   ／       ／
  │  ／     ／    通常価格累積（実線）
  │ ／    ／   ／
  │／   ／  ／
  │  ／ ／      標準RI/SP累積（実線）
  │／／   
  └──────────────────────────→ 月
  1   8        15                    時間
      ↑        ↑
  保険損益分岐  標準損益分岐
```

#### 3.3 損益分岐点の表示

- **グラフヘッダー**: 
  - 🔵 標準RI/SP 損益分岐: XX ヶ月
  - 🟢 保険RI/SP 損益分岐: XX ヶ月

- **ツールチップ**: 
  - 該当月にマウスオーバーすると
  - 🎯 保険RI/SP 損益分岐点
  - 🎯 標準RI/SP 損益分岐点

#### 3.4 情報ボックス

```
ℹ️ グラフの見方：
• 実線: 累積ランニングコスト（月々の利用料金の合計）
• 破線（総支出）: 契約期間全体の総支出額（初期費用 + 全期間の月額料金合計）を各月で表示
• 標準RI/SPの破線が通常価格の実線と交差する点が損益分岐点です
• 横軸は標準RI/SPの契約期間（1年 or 3年）に合わせて表示されます
```

---

## データ構造

### 1. リソース設定

```typescript
interface ResourceConfig {
  service: string           // サービス名: "ec2", "rds", "elasticache"
  instance: string          // インスタンスタイプ: "t3.large", "db.t4g.large"
  quantity: number          // 数量: 1-100
  usage?: number           // 利用率: 0.0-1.0
  coverage?: number        // カバレッジ率: 0.0-1.0
}
```

### 2. プラン結果

```typescript
interface PlanResult {
  name: string                      // プラン名
  monthly_cost: number              // 月額コスト（実効）
  monthly_savings: number           // 月間削減額
  initial_cost: number              // 初期費用
  premium: number                   // 保険料（保険RI/SPのみ）
  break_even_months: number | null  // 損益分岐月（nullは損益分岐なし）
}
```

### 3. シミュレーション結果

```typescript
interface SimulationResult {
  baseline_cost: number      // 通常価格月額
  insurance: PlanResult      // 保険RI/SP結果
  standard: PlanResult       // 標準RI/SP結果
  cumulative: CumulativeData // 累積データ
  details: DetailItem[]      // リソース別詳細
}
```

### 4. 累積データ

```typescript
interface CumulativeData {
  months: number[]       // [1, 2, 3, ..., 12] または [1, 2, ..., 36]
  on_demand: number[]    // 通常価格累積配列
  insurance: number[]    // 保険RI/SP累積配列
  standard: number[]     // 標準RI/SP累積配列
}
```

### 5. 価格カタログ

```typescript
interface PricingCatalog {
  metadata: {
    region: string              // "ap-northeast-1"
    hours_per_month: number     // 730
  }
  resources: {
    [service: string]: {
      [instance: string]: {
        on_demand_hourly_usd: number  // オンデマンド時間単価
        standard_ri: {
          [term: string]: {           // "1yr" | "3yr"
            [option: string]: {       // "NoUpfront" | "PartialUpfront" | "AllUpfront"
              hourly_usd: number      // RI時間単価
              upfront_usd: number     // RI前払い費用
            }
          }
        }
        savings_plans?: {
          [term: string]: {           // "1yr" | "3yr"
            hourly_usd: number        // SP時間単価
          }
        }
      }
    }
  }
  insurance_plans: {
    [key: string]: InsurancePlan
  }
}
```

---

## グラフ仕様

### 1. Chart.js設定

```typescript
{
  type: 'line',
  responsive: true,
  maintainAspectRatio: true,
  interaction: {
    mode: 'index',
    intersect: false
  }
}
```

### 2. データセット設定

| ラベル | 色 | スタイル | 説明 |
|--------|-----|---------|------|
| 通常価格 | rgba(148, 163, 184, 1) | 実線 | オンデマンド累積コスト |
| 保険RI/SP（累積） | rgba(16, 185, 129, 1) | 実線 | 保険RI/SP累積コスト |
| 保険RI/SP（総支出） | rgba(16, 185, 129, 0.6) | 破線 | 保険RI/SP総支出（固定） |
| 標準RI/SP（累積） | rgba(37, 99, 235, 1) | 実線 | 標準RI/SP累積コスト |
| 標準RI/SP（総支出） | rgba(37, 99, 235, 0.6) | 破線 | 標準RI/SP総支出（固定） |

### 3. 軸設定

**Y軸（縦軸）**
- ラベル: 累積コスト (USD)
- フォーマット: $X,XXX.XX
- 開始値: 0

**X軸（横軸）**
- ラベル: 経過月数
- フォーマット: Xヶ月
- 範囲: 1 ～ 契約期間月数

---

## 計算例

### ケース1: EC2 t3.large × 3台（標準RI/SP 1年 NoUpfront）

#### 前提条件
- リソース: EC2 t3.large × 3台
- カバレッジ: 100%
- 利用率: 100%
- 稼働時間: 730時間/月
- 保険プラン: 1年保証（45%割引、33%保険料）
- 標準プラン: 1年RI NoUpfront

#### 価格データ
- オンデマンド時間単価: $0.1088
- RI 1年 NoUpfront 時間単価: $0.0685
- RI 1年 NoUpfront 前払い: $0

#### 計算結果

**通常価格**
```
月額 = $0.1088 × 730時間 × 3台 × 100% = $238.25
```

**保険RI/SP**
```
割引後コスト = $0.1088 × 730 × 3 × (1 - 0.45) = $131.04
保険料 = $0.1088 × 730 × 3 × 0.45 × 0.33 = $35.34
月額合計 = $131.04 + $35.34 = $166.38
月間削減額 = $238.25 - $166.38 = $71.87 (30.2%)

総支出（12ヶ月） = $0 + ($166.38 × 12) = $1,996.56
損益分岐月 = ceil($1,996.56 / $238.25) = 9ヶ月
```

**標準RI/SP（1年 NoUpfront）**
```
月額ランニング = $0.0685 × 730 × 3 × 100% = $150.01
月額償却 = $0 / 12 = $0
月額合計 = $150.01 + $0 = $150.01
月間削減額 = $238.25 - $150.01 = $88.24 (37.0%)
初期費用 = $0

総支出（12ヶ月） = $0 + ($150.01 × 12) = $1,800.12
損益分岐月 = ceil($1,800.12 / $238.25) = 8ヶ月
```

#### 結果サマリー

| プラン | 月額コスト | 初期費用 | 総支出（12ヶ月） | 損益分岐月 |
|--------|-----------|---------|----------------|-----------|
| 通常価格 | $238.25 | - | $2,859.00 | - |
| 保険RI/SP | $166.38 | $0 | $1,996.56 | 9ヶ月 |
| 標準RI/SP | $150.01 | $0 | $1,800.12 | 8ヶ月 |

**結論**: 標準RI/SP NoUpfrontが最も早く損益分岐（8ヶ月）、総支出も最小。

---

### ケース2: EC2 t3.large × 3台（標準RI/SP 1年 AllUpfront）

#### 価格データ
- RI 1年 AllUpfront 時間単価: $0.00
- RI 1年 AllUpfront 前払い: $560/台

#### 計算結果

**標準RI/SP（1年 AllUpfront）**
```
月額ランニング = $0.00 × 730 × 3 × 100% = $0
月額償却 = ($560 × 3) / 12 = $140.00
月額合計 = $0 + $140.00 = $140.00
月間削減額 = $238.25 - $140.00 = $98.25 (41.2%)
初期費用 = $560 × 3 = $1,680

総支出（12ヶ月） = $1,680 + ($140.00 × 12) = $3,360
損益分岐月 = ceil($3,360 / $238.25) = 15ヶ月
```

#### 結果サマリー

| プラン | 月額コスト | 初期費用 | 総支出（12ヶ月） | 損益分岐月 |
|--------|-----------|---------|----------------|-----------|
| 通常価格 | $238.25 | - | $2,859.00 | - |
| 標準RI/SP | $140.00 | $1,680 | $3,360.00 | 15ヶ月 |

**注意**: 高い初期費用により、損益分岐月が15ヶ月（契約期間12ヶ月を超過）となり、1年契約では損益分岐に達しない。

---

### ケース3: 標準RI/SP契約期間による保険RI/SP損益分岐月の変化

#### 前提条件
- リソース: EC2 t3.large × 3台
- 通常価格月額: $238.25
- 保険RI/SP月額: $166.38

#### 標準RI/SP 1年契約の場合

```
保険RI/SP総支出 = $0 + ($166.38 × 12) = $1,996.56
損益分岐月 = ceil($1,996.56 / $238.25) = 9ヶ月
```

#### 標準RI/SP 3年契約の場合

```
保険RI/SP総支出 = $0 + ($166.38 × 36) = $5,989.68
損益分岐月 = ceil($5,989.68 / $238.25) = 26ヶ月
```

**重要**: 保険RI/SPの損益分岐月は、**選択した標準RI/SPの契約期間**に依存します。これは公平な比較のための設計です。

---

## まとめ

### 計算の特徴

1. **総支出は固定値**: 初期費用 + (月額 × 契約期間) で算出される契約全体のコスト
2. **損益分岐点は総支出ベース**: 通常価格累積が総支出を超える月を算出
3. **保険RI/SPは標準契約期間を使用**: 公平な比較のため、標準RI/SPの契約期間で総支出を計算
4. **累積コストとは別**: 累積は月々のランニングコストの合計、総支出は契約全体のコミットメント

### UI設計の特徴

1. **5つの線で表現**: 通常価格、保険累積、保険総支出、標準累積、標準総支出
2. **実線と破線で区別**: 累積は実線、総支出は破線
3. **損益分岐点を明示**: グラフヘッダーとツールチップで表示
4. **契約期間に応じた表示**: 1年なら12ヶ月、3年なら36ヶ月分を表示

### 技術スタック

- **フレームワーク**: Next.js 15.5.2 (App Router)
- **言語**: TypeScript 5.6.0
- **UI**: React 19.0.0, TailwindCSS 3.4.14
- **グラフ**: Chart.js 4.x, react-chartjs-2
- **デプロイ**: AWS Amplify

---

**最終更新日**: 2025-11-27  
**バージョン**: 2.0.0
