# 🌊 Alphaus MSP Revenue Simulator - Next.js Edition

> MSP向け保険RI/SP & 標準RI/SP コスト最適化・収益モデルシミュレーションツール

## 🚀 概要

Ripple連携と保険RI/SPを活用したMSP収益モデルのシミュレーションツールです。**Next.js 15 (App Router) + React 19 + TailwindCSS + Cloudflare Pages** の最新モダンスタック構成で、高速・スケーラブルなアプリケーションを実現しています。

## ✨ 主要機能

### 📊 コスト最適化シミュレーション
- **保険RI/SP**: 30日保証 / 1年保証
- **標準RI/SP**: 1年・3年予約 × NoUpfront/PartialUpfront/AllUpfront
- **リアルタイム計算**: 月次コスト、削減額、損益分岐点
- **累積コスト推移**: 12ヶ月のグラフ可視化

### 🎨 モダンUI/UX
- **Next.js 15** App Router (最新版)
- **React 19** 新機能対応
- TailwindCSS スタイリング
- React Chart.js 2 可視化
- レスポンシブデザイン
- スムーズアニメーション

### ⚡ 高パフォーマンス
- サーバーサイドレンダリング (SSR)
- 静的サイト生成 (SSG)
- Cloudflare Pages グローバル配信
- 最適化されたバンドルサイズ

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
- **Cloudflare Pages**: エッジ配信
- **@cloudflare/next-on-pages 1.13+**: Next.js 15 → Cloudflare 変換

## 📦 インストール

```bash
cd nextjs

# 依存関係のインストール
npm install
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

## 🌐 Cloudflare Pages デプロイ

### ビルド & デプロイ

```bash
# Cloudflare Pages 用にビルド
npm run cf:build

# デプロイ
npm run cf:deploy
```

### ローカルでCloudflare環境をプレビュー

```bash
npm run cf:preview
```

## 📁 プロジェクト構造

```
nextjs/
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

## 📦 対象リソース

- **EC2 t3.large** × 3台
- **EC2 t3.xlarge** × 2台
- **RDS db.t4g.large** × 2台

## 💰 価格データ

AWS 東京リージョン (ap-northeast-1) の公式価格を使用

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

### Cloudflareデプロイエラー

```bash
# Wranglerを再インストール
npm install -g wrangler@latest
```

## 📝 ライセンス

MIT License - © 2025 Alphaus Cloud Group

## 🤝 コントリビューション

プルリクエストを歓迎します！

## 📧 サポート

問題や質問がある場合は、[Issues](https://github.com/hkdstamp/compare-risp/issues) を作成してください。

---

**⚡ Built with Next.js 15 + React 19 + TailwindCSS + Cloudflare Pages**

### 📋 バージョン情報
- Next.js: 15.0.3
- React: 19.0.0
- TypeScript: 5.6.0
- TailwindCSS: 3.4.14
- Node.js: 18+ required
