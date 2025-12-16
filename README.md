# 🌊 Alphaus MSP Revenue Simulator - Next.js Edition

> MSP向け保険RI/SP & 標準RI/SP コスト最適化・収益モデルシミュレーションツール

## 🚀 概要

Ripple連携と保険RI/SPを活用したMSP収益モデルのシミュレーションツールです。**Next.js 15 (App Router) + React 19 + TailwindCSS + AWS Amplify** の最新モダンスタック構成で、高速・スケーラブルなアプリケーションを実現しています。

**🆕 マイクロフロントエンド対応**: 会社ホームページ、他のWebアプリ、single-spaアプリなど、様々な環境から利用可能です。

## ✨ 主要機能

### 📊 コスト最適化シミュレーション
- **保険RI/SP**: 30日保証 / 1年保証
- **標準RI/SP**: 1年・3年予約 × NoUpfront/PartialUpfront/AllUpfront
- **リアルタイム計算**: 月次コスト、削減額、損益分岐点
- **累積コスト推移**: 12ヶ月のグラフ可視化
- **🆕 動的リソース選択**: 複数のAWSサービスとインスタンスタイプを自由に組み合わせ

### 🎨 モダンUI/UX
- **Next.js 15** App Router (最新版)
- **React 19** 新機能対応
- TailwindCSS スタイリング
- React Chart.js 2 可視化
- レスポンシブデザイン
- スムーズアニメーション
- **🆕 インタラクティブなリソースセレクター**: ドラッグ&ドロップ不要の直感的な選択UI

### ⚡ 高パフォーマンス
- サーバーサイドレンダリング (SSR)
- 静的サイト生成 (SSG)
- AWS Amplify グローバルCDN配信
- 最適化されたバンドルサイズ

### 🔗 複数環境からの統合
- **スタンドアロン**: 直接URLアクセス
- **iframe埋め込み**: 他のWebアプリ内に埋め込み
- **single-spa統合**: マイクロフロントエンドとして統合
- **PostMessage API**: 双方向通信をサポート

## 🏗️ 技術スタック

### フロントエンド
- **Next.js 15**: 最新Reactフレームワーク (App Router)
- **React 19**: 最新UIライブラリ with Actions & Optimistic Updates
- **TypeScript 5.6**: 最新型安全性
- **TailwindCSS 3.4**: ユーティリティファーストCSS
- **React Chart.js 2**: データ可視化

### バックエンド
- **Next.js 15 API Routes**: サーバーレスAPI
- **TypeScript 5.6**: 型安全なロジック

### デプロイメント
- **AWS Amplify Hosting**: マネージドホスティング & CI/CD
- **CloudFront CDN**: グローバル配信
- **Lambda@Edge**: サーバーレスAPI実行

## 📦 インストール

```bash
# 依存関係のインストール
npm install

# 環境変数を設定
cp .env.example .env.local
# .env.local を編集して環境に合わせて設定
```

## 🚀 開発

### ローカル開発サーバー

```bash
# 開発サーバーを起動
npm run dev
```

ブラウザで http://localhost:3000 にアクセス

### ビルド

```bash
# プロダクションビルド
npm run build

# ビルドをローカルで確認
npm run start
```

## 🔗 統合方法

compare-rispは以下の3つの方法で他のアプリケーションに統合できます：

### 1. 直接URL統合（最もシンプル）

```html
<a href="https://compare-risp.your-domain.com" target="_blank">
  コスト比較シミュレーターを開く
</a>
```

詳細: [docs/STANDALONE.md](./docs/STANDALONE.md)

### 2. iframe埋め込み統合（推奨）

```html
<iframe 
  id="compare-risp-frame"
  src="https://compare-risp.your-domain.com"
  style="width: 100%; min-height: 900px; border: none;"
  title="Cost Comparison Simulator"
  allow="clipboard-write"
></iframe>
```

**特徴**:
- ✅ シンプルな実装（複雑なビルド・デプロイ不要）
- ✅ PostMessage APIで双方向通信可能（オプション）
- ✅ 完全な分離（CSS・JSの競合なし）
- ✅ single-spa環境でも使用可能

詳細: [docs/IFRAME_INTEGRATION.md](./docs/IFRAME_INTEGRATION.md)

### 3. single-spa統合（iframe版）

```vue
<!-- Vue 3 例 -->
<template>
  <iframe
    :src="iframeUrl"
    class="simulator-iframe"
    title="Cost Comparison Simulator"
  />
</template>

<script setup>
const iframeUrl = process.env.NODE_ENV === 'development'
  ? 'http://localhost:3000'
  : 'https://compare-risp.your-domain.com';
</script>
```

**シンプルな構成**:
- ✅ デプロイは1つ（Next.jsアプリのみ）
- ✅ ラッパーモジュール不要
- ✅ single-spaのルーティングと統合可能

詳細: [docs/SINGLE_SPA_INTEGRATION.md](./docs/SINGLE_SPA_INTEGRATION.md)

統合ガイドの概要: [docs/INTEGRATION.md](./docs/INTEGRATION.md)

## 🌐 デプロイ

### AWS Amplify デプロイ（推奨）

**シンプルな1ステップデプロイ** - Next.jsアプリのみをデプロイ

1. [AWS Amplify Console](https://console.aws.amazon.com/amplify/) にアクセス
2. **New app** → **Host web app** をクリック
3. GitHubリポジトリを接続: `compare-risp`
4. ブランチを選択: `main` または `genspark_ai_developer`
5. ビルド設定を確認（`amplify.yml`が自動検出されます）
6. **Save and deploy** をクリック

**完了！** - 追加のデプロイやビルドは不要です。

詳細は [AMPLIFY_DEPLOYMENT.md](./AMPLIFY_DEPLOYMENT.md) を参照してください。

### ローカルビルド確認

```bash
# プロダクションビルド
npm run build

# ビルドを確認
npm run start
```

## 📁 プロジェクト構造

```
/
├── app/                      # Next.js App Router
│   ├── api/                  # API Routes
│   │   ├── simulate/         # シミュレーションAPI
│   │   ├── pricing/          # 価格情報API
│   │   └── resources/        # リソース情報API
│   ├── layout.tsx            # ルートレイアウト
│   ├── page.tsx              # メインページ
│   └── globals.css           # グローバルCSS
├── components/               # Reactコンポーネント
│   ├── ui/                   # UIコンポーネント
│   │   ├── CostCards.tsx
│   │   ├── RevenueHighlight.tsx
│   │   ├── CumulativeChart.tsx
│   │   ├── MonthlyChart.tsx
│   │   └── DetailsTable.tsx
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── SimulationConfig.tsx
│   ├── SimulationResults.tsx
│   └── ResourceInfo.tsx
├── lib/                      # ユーティリティ & ロジック
│   ├── types.ts              # TypeScript型定義
│   ├── simulator.ts          # 計算ロジック
│   ├── pricing-catalog.ts    # 価格カタログ
│   └── utils.ts              # ユーティリティ関数
├── public/                   # 静的ファイル
├── amplify.yml               # AWS Amplify ビルド設定
├── next.config.js            # Next.js設定
├── tailwind.config.js        # TailwindCSS設定
├── tsconfig.json             # TypeScript設定
└── package.json              # 依存関係
```

## 🎯 API エンドポイント

### `POST /api/simulate`
コスト最適化シミュレーションを実行

**Request Body:**
```json
{
  "insurance": "1y",
  "standard_term": "1yr",
  "standard_option": "NoUpfront",
  "coverage": 1.0,
  "usage": 1.0
}
```

**Response:**
```json
{
  "baseline_cost": 1234.56,
  "insurance": {...},
  "standard": {...},
  "cumulative": {...},
  "details": [...]
}
```

### `GET /api/pricing`
価格カタログを取得

### `GET /api/resources`
デフォルトリソース設定を取得

## 📦 対応リソース（動的選択可能）

### 🆕 選択可能なAWSサービス

#### Amazon EC2（Elastic Compute Cloud）
- **t3ファミリー**: t3.micro, t3.small, t3.medium, t3.large, t3.xlarge, t3.2xlarge
- **m5ファミリー**: m5.large, m5.xlarge
- **c5ファミリー**: c5.large

#### Amazon RDS（Relational Database Service）
- **t4gファミリー**: db.t4g.micro, db.t4g.small, db.t4g.medium, db.t4g.large
- **m5ファミリー**: db.m5.large
- **r5ファミリー**: db.r5.large

#### Amazon ElastiCache（In-Memory Data Store）
- **t4gファミリー**: cache.t4g.micro, cache.t4g.small
- **m5ファミリー**: cache.m5.large

### 🎛️ 柔軟な構成
- **複数サービス**: EC2、RDS、ElastiCacheを自由に組み合わせ
- **台数指定**: 各リソース1〜100台まで指定可能
- **リアルタイム追加/削除**: UIから簡単にリソースを追加・削除

### 📊 デフォルト構成（例）
- EC2 t3.large × 3台
- EC2 t3.xlarge × 2台
- RDS db.t4g.large × 2台

## 💰 価格データ

AWS 東京リージョン (ap-northeast-1) の公式価格を使用  
全20種類以上のインスタンスタイプをサポート

## 🆕 Next.js 15 & React 19 新機能

### Next.js 15の主な改善点
- **Turbopack**: 高速な開発ビルド (dev モードで自動有効化)
- **React 19サポート**: 最新Reactの機能を完全サポート
- **改善されたキャッシング**: より効率的なキャッシュ戦略
- **Enhanced Static Generation**: 静的サイト生成の最適化
- **Improved Performance**: ビルドとランタイムの性能向上

### React 19の新機能
- **Actions**: サーバーアクションとフォーム統合
- **Optimistic Updates**: 楽観的UI更新のサポート
- **useOptimistic Hook**: 楽観的状態管理
- **useFormStatus**: フォーム状態の追跡
- **Improved Suspense**: より良い非同期処理

### 本プロジェクトでの活用
- ✅ React 19の型定義を完全サポート
- ✅ Next.js 15の最適化機能を活用
- ✅ 本番環境でのconsole.logを自動削除
- ✅ React Strict Modeを有効化
- ✅ 最新のビルドツールチェーン

## 🎨 カスタマイズ

### TailwindCSS カラーテーマ

`tailwind.config.js` でカラーパレットをカスタマイズ可能:

```js
theme: {
  extend: {
    colors: {
      primary: {
        // カスタムカラー
      }
    }
  }
}
```

### リソース設定

`lib/pricing-catalog.ts` でリソースと価格を変更可能。

## 🔧 トラブルシューティング

### ビルドエラー

```bash
# node_modulesを削除して再インストール
rm -rf node_modules
npm install
```

### TypeScriptエラー

```bash
# 型チェックを実行
npx tsc --noEmit
```

### AWS Amplifyデプロイエラー

Amplify Consoleのビルドログを確認してください。一般的な問題：

- **Node.js バージョン**: Amplifyは Node.js 18.x を使用
- **環境変数**: 必要な環境変数が設定されているか確認
- **ビルドメモリ**: 大規模プロジェクトの場合、サポートに連絡してメモリを増やす

## 📝 ライセンス

MIT License - © 2025 Alphaus Cloud Group

## 🤝 コントリビューション

プルリクエストを歓迎します！

## 📧 サポート

問題や質問がある場合は、[Issues](https://github.com/hkdstamp/compare-risp/issues) を作成してください。

---

**⚡ Built with Next.js 15 + React 19 + TailwindCSS + AWS Amplify**

### 📋 バージョン情報
- Next.js: 15.0.3
- React: 19.0.0
- TypeScript: 5.6.0
- TailwindCSS: 3.4.14
- Node.js: 18+ required
