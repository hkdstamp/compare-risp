# compare-risp 統合ガイド

このドキュメントでは、compare-rispアプリケーションを様々な環境に統合する方法を説明します。

## 📋 目次

- [概要](#概要)
- [統合方法の選択](#統合方法の選択)
- [方法1: 直接URL統合](#方法1-直接url統合)
- [方法2: iframe埋め込み統合](#方法2-iframe埋め込み統合)
- [方法3: single-spa統合](#方法3-single-spa統合)
- [セキュリティ考慮事項](#セキュリティ考慮事項)

---

## 概要

compare-rispは、MSP向けのコスト比較シミュレーターです。以下の3つの方法で統合できます：

1. **直接URL統合** - 最もシンプル。別タブまたはウィンドウで開く
2. **iframe埋め込み** - ページ内に埋め込み、PostMessage APIで通信
3. **single-spa統合** - マイクロフロントエンドとして既存のsingle-spaアプリに統合

---

## 統合方法の選択

| 要件 | 推奨方法 | 理由 |
|------|---------|------|
| 会社ホームページからリンク | 直接URL統合 | 実装が最もシンプル |
| 他のアプリ内に埋め込み | iframe埋め込み | ページ遷移なしで利用可能 |
| 既存のsingle-spaアプリから | single-spa統合 | 他のマイクロアプリと統一 |
| シミュレーション結果を取得したい | iframe埋め込み | PostMessage APIで結果を受信 |
| SEOが重要 | 直接URL統合 | iframeはSEO的に不利 |

---

## 方法1: 直接URL統合

### 基本的な使い方

```html
<!-- シンプルなリンク -->
<a href="https://compare-risp.your-domain.com" target="_blank">
  コスト比較シミュレーターを開く
</a>

<!-- ボタンで新しいウィンドウを開く -->
<button onclick="window.open('https://compare-risp.your-domain.com', '_blank', 'width=1200,height=800')">
  シミュレーターを起動
</button>
```

### URLパラメータでの初期値設定

```html
<!-- 初期パラメータ付きでリンク -->
<a href="https://compare-risp.your-domain.com?coverage=0.8&usage=1.0&insurance=1y" target="_blank">
  シミュレーターを開く（カバレッジ80%）
</a>
```

#### サポートされているURLパラメータ

| パラメータ | 型 | 説明 | 例 |
|-----------|-----|------|-----|
| `coverage` | number (0-1) | RIカバレッジ率 | `0.8` (80%) |
| `usage` | number (0-1) | リソース使用率 | `1.0` (100%) |
| `insurance` | string | 保険プラン | `1y`, `3y` |
| `standard_term` | string | 標準プラン期間 | `1yr`, `3yr` |
| `standard_option` | string | 支払いオプション | `NoUpfront`, `PartialUpfront`, `AllUpfront` |

### JavaScript経由での起動

```javascript
// パラメータをプログラム的に設定
function openSimulator(config) {
  const params = new URLSearchParams({
    coverage: config.coverage || 0.8,
    usage: config.usage || 1.0,
    insurance: config.insurancePlan || '1y'
  });
  
  const url = `https://compare-risp.your-domain.com?${params.toString()}`;
  window.open(url, '_blank', 'width=1200,height=800');
}

// 使用例
openSimulator({
  coverage: 0.9,
  usage: 1.0,
  insurancePlan: '3y'
});
```

### メリット・デメリット

**メリット:**
- ✅ 実装が最もシンプル
- ✅ パフォーマンスが最高
- ✅ すべての機能が利用可能
- ✅ メンテナンスが不要

**デメリット:**
- ❌ ページ遷移が発生する
- ❌ シミュレーション結果を直接取得できない
- ❌ UIの統一感が出にくい

詳細: [STANDALONE.md](./STANDALONE.md)

---

## 方法2: iframe埋め込み統合

### 基本的な埋め込み

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>コスト比較ツール</title>
</head>
<body>
  <h1>MSPコスト比較シミュレーター</h1>
  
  <!-- iframe埋め込み -->
  <iframe 
    id="compare-risp-frame"
    src="https://compare-risp.your-domain.com"
    style="width: 100%; height: 900px; border: 1px solid #ddd; border-radius: 8px;"
    allow="clipboard-write"
  ></iframe>
  
  <script src="./compare-risp-integration.js"></script>
</body>
</html>
```

### PostMessage APIによる通信

#### 親ページ → iframe（パラメータ送信）

```javascript
// compare-risp-integration.js
const frame = document.getElementById('compare-risp-frame');
const IFRAME_ORIGIN = 'https://compare-risp.your-domain.com';

// iframe読み込み完了後に初期パラメータを送信
frame.addEventListener('load', () => {
  frame.contentWindow.postMessage({
    type: 'SET_INITIAL_PARAMS',
    params: {
      coverage: 0.8,
      usage: 1.0,
      insurance: '1y',
      resources: [
        { service: 'ec2', instance: 't3.medium', quantity: 10 },
        { service: 'rds', instance: 'db.t3.large', quantity: 2 }
      ]
    }
  }, IFRAME_ORIGIN);
});

// ユーザー情報の変更を通知
function updateUserInfo(user) {
  frame.contentWindow.postMessage({
    type: 'USER_CHANGED',
    user: {
      id: user.id,
      name: user.name,
      vendor: user.vendor
    }
  }, IFRAME_ORIGIN);
}
```

#### iframe → 親ページ（結果受信）

```javascript
// シミュレーション結果を受信
window.addEventListener('message', (event) => {
  // セキュリティチェック
  if (event.origin !== IFRAME_ORIGIN) {
    console.warn('Unknown origin:', event.origin);
    return;
  }
  
  // メッセージタイプごとに処理
  switch (event.data.type) {
    case 'SIMULATION_COMPLETE':
      handleSimulationResult(event.data.result);
      break;
      
    case 'READY':
      console.log('compare-risp is ready');
      break;
      
    case 'ERROR':
      console.error('Simulation error:', event.data.error);
      break;
  }
});

function handleSimulationResult(result) {
  console.log('シミュレーション結果:', result);
  
  // 結果を表示
  document.getElementById('result-summary').innerHTML = `
    <h3>シミュレーション結果</h3>
    <p>保険プラン総コスト: ¥${result.insurance.totalCost.toLocaleString()}</p>
    <p>標準プラン総コスト: ¥${result.standard.totalCost.toLocaleString()}</p>
    <p>差額: ¥${result.savings.toLocaleString()}</p>
  `;
  
  // データベースに保存したり、他の処理を実行
  saveSimulationToDatabase(result);
}
```

### メッセージAPIリファレンス

#### 親 → iframe に送信可能なメッセージ

**1. SET_INITIAL_PARAMS - 初期パラメータ設定**

```typescript
{
  type: 'SET_INITIAL_PARAMS',
  params: {
    coverage: number,        // 0-1
    usage: number,          // 0-1
    insurance: string,      // '1y' | '3y'
    standard_term: string,  // '1yr' | '3yr'
    standard_option: string, // 'NoUpfront' | 'PartialUpfront' | 'AllUpfront'
    resources?: Array<{
      service: string,
      instance: string,
      quantity: number
    }>
  }
}
```

**2. USER_CHANGED - ユーザー情報変更**

```typescript
{
  type: 'USER_CHANGED',
  user: {
    id: string,
    name: string,
    vendor?: string
  }
}
```

**3. REQUEST_RESULT - 現在の結果をリクエスト**

```typescript
{
  type: 'REQUEST_RESULT'
}
```

#### iframe → 親 から受信可能なメッセージ

**1. READY - 初期化完了**

```typescript
{
  type: 'READY'
}
```

**2. SIMULATION_COMPLETE - シミュレーション完了**

```typescript
{
  type: 'SIMULATION_COMPLETE',
  result: {
    insurance: {
      totalCost: number,
      monthlyCost: number,
      details: Array<{...}>
    },
    standard: {
      totalCost: number,
      monthlyCost: number,
      details: Array<{...}>
    },
    savings: number,
    savingsPercentage: number,
    coverage: number
  }
}
```

**3. ERROR - エラー発生**

```typescript
{
  type: 'ERROR',
  error: string
}
```

### レスポンシブ対応

```css
/* iframe高さを自動調整 */
#compare-risp-frame {
  width: 100%;
  min-height: 800px;
  height: calc(100vh - 200px);
  border: none;
}

/* モバイル対応 */
@media (max-width: 768px) {
  #compare-risp-frame {
    min-height: 600px;
    height: calc(100vh - 100px);
  }
}
```

### メリット・デメリット

**メリット:**
- ✅ ページ内に埋め込める
- ✅ 双方向通信が可能
- ✅ シミュレーション結果を取得できる
- ✅ すべての機能が利用可能

**デメリット:**
- ❌ 初回読み込みに時間がかかる
- ❌ PostMessage APIの実装が必要
- ❌ クロスオリジン制約に注意

詳細: [IFRAME_INTEGRATION.md](./IFRAME_INTEGRATION.md)

---

## 方法3: single-spa統合（iframe版）

### 概要

compare-rispは、**シンプルなiframe**を使用してsingle-spaマイクロフロントエンドアプリケーションに統合できます。

**特徴**:
- ✅ ラッパーモジュール不要（複雑なビルド・デプロイ不要）
- ✅ デプロイは1つ（Next.jsアプリのみ）
- ✅ single-spaのルーティングと統合可能
- ✅ PostMessage APIで通信可能（オプション）

### 前提条件

- 既存のsingle-spaコンテナアプリが存在する
- Vue 3、React、または他のフレームワークコンポーネント

### Vue 3での実装例

```vue
<!-- CommitmentSimulatorAppContainer.vue -->
<template>
  <div class="simulator-container">
    <h1>MSPコスト比較シミュレーター</h1>
    
    <iframe
      ref="simulatorFrame"
      :src="iframeUrl"
      class="simulator-iframe"
      title="Cost Comparison Simulator"
      allow="clipboard-write"
      @load="onIframeLoad"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';

const iframeUrl = computed(() => {
  return process.env.NODE_ENV === 'development'
    ? 'http://localhost:3000'
    : 'https://your-app.amplifyapp.com';
});

const simulatorFrame = ref<HTMLIFrameElement | null>(null);

const onIframeLoad = () => {
  console.log('Simulator loaded');
};

// PostMessage通信（オプション）
const handleMessage = (event: MessageEvent) => {
  const allowedOrigins = [
    'http://localhost:3000',
    'https://your-app.amplifyapp.com'
  ];
  
  if (!allowedOrigins.includes(event.origin)) {
    return;
  }
  
  if (event.data.type === 'SIMULATION_COMPLETE') {
    console.log('Simulation result:', event.data.result);
  }
};

onMounted(() => {
  window.addEventListener('message', handleMessage);
});

onUnmounted(() => {
  window.removeEventListener('message', handleMessage);
});
</script>

<style scoped>
.simulator-iframe {
  width: 100%;
  min-height: 900px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
}
</style>
```

### Reactでの実装例

```tsx
import React, { useRef, useEffect } from 'react';

const IFRAME_URL = process.env.NODE_ENV === 'development'
  ? 'http://localhost:3000'
  : 'https://your-app.amplifyapp.com';

export const SimulatorContainer: React.FC = () => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== new URL(IFRAME_URL).origin) {
        return;
      }

      if (event.data.type === 'SIMULATION_COMPLETE') {
        console.log('Simulation result:', event.data.result);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  return (
    <div className="simulator-container">
      <iframe
        ref={iframeRef}
        src={IFRAME_URL}
        style={{ width: '100%', minHeight: '900px', border: 'none' }}
        title="Cost Comparison Simulator"
      />
    </div>
  );
};
```

### single-spaアプリとして登録

```typescript
// root-config.ts
import { registerApplication, start } from 'single-spa';

registerApplication({
  name: '@wave/commitment-simulator',
  app: () => import('./CommitmentSimulatorAppContainer.vue'),
  activeWhen: ['/commitment-simulator', '/compare-risp']
});

start();
```

### PostMessage通信（オプション）

```typescript
// シミュレーション結果を受信する場合
const handleMessage = (event: MessageEvent) => {
  // オリジン検証
  const allowedOrigins = [
    'http://localhost:3000',
    'https://your-app.amplifyapp.com'
  ];
  
  if (!allowedOrigins.includes(event.origin)) {
    return;
  }

  switch (event.data.type) {
    case 'SIMULATION_COMPLETE':
      console.log('シミュレーション完了:', event.data.result);
      break;
      
    case 'ERROR':
      console.error('エラー:', event.data.error);
      break;
  }
};

window.addEventListener('message', handleMessage);
```

### メリット・デメリット

**メリット:**
- ✅ **シンプル**: ラッパーモジュール不要
- ✅ **デプロイが容易**: Next.jsアプリ1つのみ
- ✅ **メンテナンス容易**: 複雑な依存関係なし
- ✅ URLルーティングと連動
- ✅ PostMessage APIで通信可能

**デメリット:**
- ⚠️ single-spa環境が必須
- ⚠️ iframe特有の制約（高さ調整など）

詳細: [SINGLE_SPA_INTEGRATION.md](./SINGLE_SPA_INTEGRATION.md)

---

## セキュリティ考慮事項

### Content Security Policy (CSP)

iframe埋め込みを使用する場合、親ページのCSPを設定:

```html
<meta http-equiv="Content-Security-Policy" 
      content="frame-src https://compare-risp.your-domain.com;">
```

### PostMessage オリジン検証

必ず送信元を検証してください:

```javascript
window.addEventListener('message', (event) => {
  // ✅ 良い例: オリジンを検証
  if (event.origin !== 'https://compare-risp.your-domain.com') {
    return;
  }
  
  // ❌ 悪い例: すべてのオリジンを許可
  // processMessage(event.data);
});
```

### 認証トークンの扱い

```javascript
// ✅ 良い例: 必要な情報のみを送信
frame.contentWindow.postMessage({
  type: 'AUTH',
  token: 'short-lived-jwt-token'
}, 'https://compare-risp.your-domain.com');

// ❌ 悪い例: 機密情報を送信
// frame.contentWindow.postMessage({
//   type: 'AUTH',
//   password: 'user-password',
//   apiKey: 'secret-key'
// }, '*');
```

### HTTPS の使用

本番環境では必ずHTTPSを使用してください:

- ✅ `https://compare-risp.your-domain.com`
- ❌ `http://compare-risp.your-domain.com`

---

## トラブルシューティング

### iframe が表示されない

```javascript
// コンソールでエラーを確認
iframe.addEventListener('error', (e) => {
  console.error('iframe load error:', e);
});

// X-Frame-Options ヘッダーを確認
// サーバー側で設定が必要な場合あり
```

### PostMessage が届かない

```javascript
// デバッグ用のログを追加
window.addEventListener('message', (event) => {
  console.log('Received message:', {
    origin: event.origin,
    data: event.data
  });
});
```

### single-spa でマウントされない

```javascript
// single-spaのデバッグモードを有効化
import { setDebugMode } from 'single-spa';
setDebugMode(true);
```

---

## サポート

問題が発生した場合:

1. このドキュメントのトラブルシューティングセクションを確認
2. [GitHub Issues](https://github.com/your-org/compare-risp/issues) で既知の問題を検索
3. 新しいIssueを作成して質問

---

## 関連ドキュメント

- [STANDALONE.md](./STANDALONE.md) - スタンドアロンデプロイガイド
- [IFRAME_INTEGRATION.md](./IFRAME_INTEGRATION.md) - iframe統合の詳細
- [SINGLE_SPA_INTEGRATION.md](./SINGLE_SPA_INTEGRATION.md) - single-spa統合の詳細
- [API.md](./API.md) - API リファレンス
