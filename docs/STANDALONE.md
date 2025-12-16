# compare-risp スタンドアロンデプロイガイド

このドキュメントでは、compare-rispをスタンドアロンアプリケーションとしてデプロイする方法を説明します。

## 📋 目次

- [概要](#概要)
- [デプロイオプション](#デプロイオプション)
- [AWS Amplify へのデプロイ](#aws-amplify-へのデプロイ)
- [Vercel へのデプロイ](#vercel-へのデプロイ)
- [その他のプラットフォーム](#その他のプラットフォーム)
- [環境変数の設定](#環境変数の設定)
- [カスタムドメインの設定](#カスタムドメインの設定)

---

## 概要

compare-rispは**Next.js 15**で構築されており、以下の特徴があります：

- ✅ App Router使用
- ✅ API Routes（サーバーレス関数）
- ✅ React 19
- ✅ Tailwind CSS v3
- ✅ TypeScript

これらの機能を完全にサポートするプラットフォームにデプロイできます。

---

## デプロイオプション

| プラットフォーム | 推奨度 | 理由 | コスト |
|---------------|--------|------|--------|
| **AWS Amplify** | ⭐⭐⭐⭐⭐ | Next.js完全サポート、既存設定あり | 低〜中 |
| **Vercel** | ⭐⭐⭐⭐⭐ | Next.js開発元、最高のパフォーマンス | 無料〜中 |
| **Netlify** | ⭐⭐⭐⭐ | シンプル、Next.js対応 | 無料〜中 |
| **自社サーバー** | ⭐⭐⭐ | 完全コントロール | 中〜高 |

---

## AWS Amplify へのデプロイ

### 前提条件

- AWSアカウント
- GitHubリポジトリ（またはGitLab, Bitbucket）
- AWS CLIインストール（オプション）

### ステップ1: Amplifyコンソールでアプリを作成

1. [AWS Amplify Console](https://console.aws.amazon.com/amplify/)にアクセス
2. 「新しいアプリ」→「ホスティング」を選択
3. GitHubリポジトリを接続
4. ブランチを選択（例: `main`）

### ステップ2: ビルド設定

Amplifyは自動的にNext.jsを検出しますが、`amplify.yml`で設定をカスタマイズ可能:

```yaml
# amplify.yml（既に存在）
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

### ステップ3: 環境変数の設定

Amplifyコンソール → アプリ設定 → 環境変数:

```
NODE_VERSION=18
NEXT_PUBLIC_APP_URL=https://your-app.amplifyapp.com
```

### ステップ4: デプロイ

- 自動デプロイ: GitHubにプッシュすると自動的にデプロイ
- 手動デプロイ: Amplifyコンソールから「デプロイを開始」

### ステップ5: カスタムドメイン設定（オプション）

Amplifyコンソール → ドメイン管理:

```
compare-risp.your-domain.com → your-app.amplifyapp.com
```

### デプロイ後の確認

```bash
# アプリにアクセス
curl https://your-app.amplifyapp.com

# API Routesの確認
curl -X POST https://your-app.amplifyapp.com/api/simulate \
  -H "Content-Type: application/json" \
  -d '{"coverage": 0.8, "usage": 1.0, "insurance": "1y"}'
```

### コスト見積もり

- ビルド時間: 約5分/デプロイ
- ホスティング: 月額$0〜50（トラフィックによる）

詳細: [AMPLIFY_DEPLOYMENT.md](../AMPLIFY_DEPLOYMENT.md)

---

## Vercel へのデプロイ

### ステップ1: Vercelアカウントを作成

[https://vercel.com/signup](https://vercel.com/signup)

### ステップ2: プロジェクトをインポート

1. Vercelダッシュボード → 「New Project」
2. GitHubリポジトリをインポート
3. プロジェクト設定:
   - **Framework Preset**: Next.js
   - **Root Directory**: `compare-risp/`
   - **Build Command**: `npm run build`（自動検出）
   - **Output Directory**: `.next`（自動検出）

### ステップ3: 環境変数の設定

```
NEXT_PUBLIC_APP_URL=https://compare-risp.vercel.app
```

### ステップ4: デプロイ

「Deploy」ボタンをクリック → 数分で完了

### ステップ5: カスタムドメイン設定

プロジェクト設定 → Domains:

```
compare-risp.your-domain.com
```

### Vercelの利点

- ✅ **最速のビルド**: 30秒〜1分
- ✅ **エッジネットワーク**: 世界中で高速アクセス
- ✅ **自動プレビュー**: PRごとにプレビューURL生成
- ✅ **分析ダッシュボード**: パフォーマンス監視

### コスト見積もり

- Hobbyプラン: 無料（商用利用制限あり）
- Proプラン: $20/月

---

## その他のプラットフォーム

### Netlify

```bash
# netlify.toml を作成
[build]
  command = "npm run build"
  publish = ".next"

[build.environment]
  NODE_VERSION = "18"

[[plugins]]
  package = "@netlify/plugin-nextjs"
```

### 自社サーバー（Node.js）

```bash
# ビルド
npm run build

# 本番サーバー起動
npm run start

# またはPM2で永続化
pm2 start npm --name "compare-risp" -- start
```

#### nginx リバースプロキシ設定

```nginx
server {
    listen 80;
    server_name compare-risp.your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Docker デプロイ

```dockerfile
# Dockerfile（新規作成）
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV production

COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000

CMD ["npm", "start"]
```

```bash
# ビルドと起動
docker build -t compare-risp .
docker run -p 3000:3000 compare-risp
```

---

## 環境変数の設定

### 必須環境変数

| 変数名 | 説明 | 例 |
|--------|------|-----|
| `NODE_ENV` | 環境モード | `production` |
| `NEXT_PUBLIC_APP_URL` | アプリのベースURL | `https://compare-risp.example.com` |

### オプション環境変数

| 変数名 | 説明 | デフォルト |
|--------|------|-----------|
| `PORT` | サーバーポート | `3000` |
| `NEXT_PUBLIC_ENABLE_ANALYTICS` | アナリティクス有効化 | `false` |
| `ALLOWED_ORIGINS` | PostMessage許可オリジン | `*` |

### .env.production の例

```bash
# .env.production（新規作成）
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://compare-risp.your-domain.com
PORT=3000

# PostMessage APIのセキュリティ設定
ALLOWED_ORIGINS=https://your-main-site.com,https://your-company.com

# アナリティクス（オプション）
NEXT_PUBLIC_ENABLE_ANALYTICS=true
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

---

## カスタムドメインの設定

### DNSレコードの設定

#### AWS Amplify の場合

```
CNAME: compare-risp  →  your-app.amplifyapp.com
```

#### Vercel の場合

```
CNAME: compare-risp  →  cname.vercel-dns.com
```

### SSL証明書

- AWS Amplify: 自動的にLet's Encrypt証明書を発行
- Vercel: 自動的にSSL証明書を発行
- 自社サーバー: Let's EncryptのCertbotを使用

```bash
# Certbotでの証明書取得
sudo certbot --nginx -d compare-risp.your-domain.com
```

---

## パフォーマンス最適化

### next.config.js の本番設定

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // 画像最適化
  images: {
    domains: ['your-domain.com'],
    formats: ['image/avif', 'image/webp'],
  },
  
  // コンパイラー最適化
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  // 圧縮
  compress: true,
  
  // SWC minify（高速）
  swcMinify: true,
}

module.exports = nextConfig
```

### CDN キャッシュ設定

```javascript
// next.config.js に追加
module.exports = {
  async headers() {
    return [
      {
        source: '/:all*(svg|jpg|png|webp|avif)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};
```

---

## モニタリングとログ

### Vercel Analytics

```bash
npm install @vercel/analytics
```

```typescript
// app/layout.tsx に追加
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

### AWS CloudWatch（Amplify）

Amplifyコンソールでログとメトリクスを自動収集。

---

## トラブルシューティング

### ビルドが失敗する

```bash
# ローカルでビルドテスト
npm run build

# Node.jsバージョン確認
node -v  # 18.x以上推奨
```

### API Routesが動作しない

- サーバーレス関数がサポートされているか確認
- 静的エクスポート（`output: 'export'`）を使用していないか確認

### 環境変数が反映されない

- `NEXT_PUBLIC_`プレフィックスがついているか確認
- ビルド時に環境変数が設定されているか確認
- 再ビルドを実行

---

## 次のステップ

- [iframe埋め込み統合の実装](./IFRAME_INTEGRATION.md)
- [single-spa統合の実装](./SINGLE_SPA_INTEGRATION.md)
- [API リファレンス](./API.md)
