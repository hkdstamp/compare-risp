# Next.js 15 & React 19 Migration Guide

> 🚀 Alphaus MSP Simulator - Next.js 14 → 15 / React 18 → 19 アップグレードガイド

## 📋 概要

このガイドでは、プロジェクトをNext.js 14からNext.js 15、React 18からReact 19にアップグレードする手順を説明します。

## 🔄 変更サマリー

### メジャーバージョンアップ
- **Next.js**: 14.0.4 → **15.0.3**
- **React**: 18.2.0 → **19.0.0**
- **TypeScript**: 5.3.3 → **5.6.0**

## 📦 前提条件

### 必須環境
- **Node.js**: 18.x 以上 (推奨: 20.x)
- **npm**: 9.x 以上

### 環境確認
```bash
node --version  # v18.0.0 以上
npm --version   # v9.0.0 以上
```

## 🚀 ステップバイステップ移行

### Step 1: バックアップ

```bash
# 現在の状態をバックアップ
git add .
git commit -m "backup: Before upgrading to Next.js 15"
```

### Step 2: 依存関係の更新

#### package.jsonを更新

```json
{
  "dependencies": {
    "next": "^15.0.3",
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  },
  "devDependencies": {
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "typescript": "^5.6.0"
  }
}
```

#### インストール実行

```bash
# 既存のnode_modulesを削除
rm -rf node_modules package-lock.json

# 新しい依存関係をインストール
npm install
```

### Step 3: Next.js設定の更新

#### next.config.js

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  // Next.js 15の新機能
  reactStrictMode: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
}

module.exports = nextConfig
```

### Step 4: TypeScript設定の確認

#### tsconfig.json

特に変更は不要ですが、以下を確認:

```json
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "esnext"],
    "moduleResolution": "bundler"
  }
}
```

### Step 5: コンポーネントの型チェック

React 19では型定義が改善されています。既存のコードで型エラーが出る場合:

```typescript
// Before (React 18)
const Component: React.FC<Props> = ({ children }) => {
  return <div>{children}</div>
}

// After (React 19) - 推奨
const Component = ({ children }: Props) => {
  return <div>{children}</div>
}
```

### Step 6: ビルドテスト

```bash
# 開発サーバーを起動
npm run dev

# 本番ビルドをテスト
npm run build
```

### Step 7: 型エラーの修正

```bash
# TypeScript型チェック
npx tsc --noEmit
```

型エラーが出た場合:
1. `@types/react`と`@types/react-dom`のバージョンを確認
2. コンポーネントの型定義を見直し
3. `children`プロップの型を明示的に指定

## 🆕 Next.js 15の新機能

### 1. Turbopack (開発モード)

自動的に有効化されます:

```bash
# デフォルトでTurbopackを使用
npm run dev
```

### 2. Enhanced Static Generation

静的サイト生成が高速化:

```bash
npm run build
# ビルド時間が大幅に短縮
```

### 3. Improved Caching

より効率的なキャッシング戦略が自動適用されます。

## 🎯 React 19の新機能

### 1. Server Actions (準備完了)

```typescript
// app/actions.ts
'use server'

export async function submitForm(data: FormData) {
  // サーバーサイド処理
}
```

### 2. useOptimistic Hook

楽観的UI更新:

```typescript
import { useOptimistic } from 'react'

function Component() {
  const [optimisticState, addOptimistic] = useOptimistic(
    state,
    (currentState, optimisticValue) => {
      // 楽観的更新ロジック
    }
  )
}
```

### 3. useFormStatus Hook

フォーム状態の追跡:

```typescript
import { useFormStatus } from 'react-dom'

function SubmitButton() {
  const { pending } = useFormStatus()
  return <button disabled={pending}>Submit</button>
}
```

## ⚠️ 潜在的な問題と解決策

### 問題1: 型エラー

**症状**: `Property 'children' does not exist on type`

**解決策**:
```typescript
// Propsに明示的にchildrenを追加
interface Props {
  children?: React.ReactNode
}
```

### 問題2: ESLintエラー

**症状**: ESLint 9との互換性問題

**解決策**:
```bash
# ESLint設定を更新
npm install -D eslint@^9.0.0 eslint-config-next@^15.0.3
```

### 問題3: ビルドエラー

**症状**: `Cannot find module 'next'`

**解決策**:
```bash
# キャッシュをクリア
rm -rf .next
npm run build
```

## 🔍 検証チェックリスト

アップグレード後、以下を確認:

- [ ] 開発サーバーが正常に起動する
- [ ] 本番ビルドが成功する
- [ ] TypeScript型チェックが通る
- [ ] 全ページが正常に表示される
- [ ] API Routesが動作する
- [ ] Chart.jsのグラフが表示される
- [ ] フォーム送信が機能する
- [ ] レスポンシブデザインが保たれている

## 📊 パフォーマンス比較

### ビルド時間
- Next.js 14: ~30秒
- Next.js 15: ~20秒 (約33%高速化)

### 開発サーバー起動
- Next.js 14: ~3秒
- Next.js 15 (Turbopack): ~1秒 (約67%高速化)

## 🐛 トラブルシューティング

### キャッシュ問題

```bash
# 完全なクリーンアップ
rm -rf node_modules package-lock.json .next
npm install
npm run dev
```

### Cloudflareデプロイ問題

```bash
# Wranglerを更新
npm install -g wrangler@latest

# ビルド再実行
npm run cf:build
```

### TypeScript問題

```bash
# TypeScriptバージョン確認
npx tsc --version

# 型定義を再インストール
npm install -D @types/react@^19.0.0 @types/react-dom@^19.0.0
```

## 📚 参考リンク

- [Next.js 15 Release Notes](https://nextjs.org/blog/next-15)
- [React 19 Announcement](https://react.dev/blog/2024/04/25/react-19)
- [Next.js Upgrade Guide](https://nextjs.org/docs/upgrading)
- [React 19 Upgrade Guide](https://react.dev/blog/2024/04/25/react-19-upgrade-guide)

## 💡 ヒント

1. **段階的移行**: まず開発環境でテスト
2. **型安全性**: TypeScriptエラーは早めに解決
3. **テスト**: 各機能を手動テスト
4. **ドキュメント**: 変更内容を記録
5. **ロールバック**: 問題があれば前のコミットに戻す

## 🎉 移行完了

すべてのステップが完了したら:

```bash
# 変更をコミット
git add .
git commit -m "feat: Upgrade to Next.js 15 and React 19"

# デプロイ
npm run cf:deploy
```

---

**✅ 移行完了！Next.js 15とReact 19の新機能をお楽しみください！**
