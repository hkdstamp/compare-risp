# single-spa統合ガイド（iframe版）

このドキュメントでは、compare-rispをsingle-spaマイクロフロントエンドアプリケーションにiframeとして統合する方法を説明します。

## 📋 目次

- [概要](#概要)
- [アーキテクチャ](#アーキテクチャ)
- [セットアップ](#セットアップ)
- [実装例](#実装例)
- [PostMessage通信](#postmessage通信)
- [トラブルシューティング](#トラブルシューティング)

---

## 概要

compare-rispはNext.js 15で構築されたフルスタックアプリケーションです。single-spa環境では、**iframeを使ったシンプルな統合**を推奨します。

### このアプローチの特徴

- ✅ **シンプル**: 複雑なラッパー不要、1つのデプロイのみ
- ✅ **完全な分離**: Next.jsアプリが独立して動作
- ✅ **柔軟な通信**: PostMessage APIで親子間通信可能
- ✅ **メンテナンス容易**: Next.jsアプリの更新が独立

### 必要なもの

1. **Next.jsアプリ**: AWS Amplifyにデプロイ（1つだけ）
2. **ホストアプリ**: single-spaコンテナでiframeを管理

---

## アーキテクチャ

```
single-spaコンテナ (ホストアプリ)
    ↓ ルーティング
Vueコンポーネント or Reactコンポーネント
    ↓ iframe埋め込み
Next.jsアプリ (AWS Amplify)
    ↓ PostMessage (オプション)
ホストアプリ ←→ Next.jsアプリ
```

### デプロイ構成

```
[ホストアプリ] ─── iframe ───→ [Next.jsアプリ (AWS Amplify)]
localhost:3012                   localhost:3000 (開発)
your-host.com                    your-app.amplifyapp.com (本番)
```

---

## セットアップ

### ステップ1: Next.jsアプリのデプロイ

```bash
# compare-rispをAWS Amplifyにデプロイ
# AMPLIFY_DEPLOYMENT.mdを参照
```

**デプロイURL**: `https://your-app.amplifyapp.com`

### ステップ2: Content-Security-Policy設定

[next.config.js](next.config.js)で既に設定済み：

```javascript
async headers() {
  return [
    {
      source: '/:path*',
      headers: [
        {
          key: 'Content-Security-Policy',
          value: process.env.NODE_ENV === 'development'
            ? "frame-ancestors 'self' http://localhost:* https://localhost:*"
            : "frame-ancestors 'self' https://your-company.com https://*.your-company.com",
        },
      ],
    },
  ];
}
```

### ステップ3: 開発環境の起動

```bash
# Next.jsアプリを起動
npm run dev
# → http://localhost:3000

# ホストアプリを起動（別ターミナル）
cd /path/to/host-app
npm run dev
# → http://localhost:3012
```

---

## 実装例

### Vue 3での実装

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

// 環境に応じたURL
const iframeUrl = computed(() => {
  return process.env.NODE_ENV === 'development'
    ? 'http://localhost:3000'
    : 'https://your-app.amplifyapp.com';
});

const simulatorFrame = ref<HTMLIFrameElement | null>(null);

// iframeロード完了
const onIframeLoad = () => {
  console.log('Simulator iframe loaded');
  
  // iframeにメッセージを送信（オプション）
  sendMessageToIframe({
    type: 'INIT',
    data: { /* 初期設定 */ }
  });
};

// iframeにメッセージを送信
const sendMessageToIframe = (message: any) => {
  if (simulatorFrame.value?.contentWindow) {
    const targetOrigin = new URL(iframeUrl.value).origin;
    simulatorFrame.value.contentWindow.postMessage(message, targetOrigin);
  }
};

// iframeからのメッセージを受信
const handleMessage = (event: MessageEvent) => {
  // オリジン検証
  const allowedOrigins = [
    'http://localhost:3000',
    'https://your-app.amplifyapp.com'
  ];
  
  if (!allowedOrigins.includes(event.origin)) {
    return;
  }
  
  console.log('Received from iframe:', event.data);
  
  // メッセージタイプに応じた処理
  switch (event.data.type) {
    case 'SIMULATION_COMPLETE':
      console.log('Simulation result:', event.data.result);
      // 結果を使った処理
      break;
      
    case 'ERROR':
      console.error('Simulator error:', event.data.error);
      break;
  }
};

// ライフサイクル
onMounted(() => {
  window.addEventListener('message', handleMessage);
});

onUnmounted(() => {
  window.removeEventListener('message', handleMessage);
});
</script>

<style scoped>
.simulator-container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.simulator-iframe {
  width: 100%;
  min-height: 900px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

@media (max-width: 768px) {
  .simulator-iframe {
    min-height: 700px;
  }
}
</style>
```

### Reactでの実装

```tsx
// SimulatorContainer.tsx
import React, { useEffect, useRef, useCallback } from 'react';

const IFRAME_URL = process.env.NODE_ENV === 'development'
  ? 'http://localhost:3000'
  : 'https://your-app.amplifyapp.com';

const ALLOWED_ORIGINS = [
  'http://localhost:3000',
  'https://your-app.amplifyapp.com'
];

export const SimulatorContainer: React.FC = () => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // iframeにメッセージを送信
  const sendMessage = useCallback((message: any) => {
    if (iframeRef.current?.contentWindow) {
      const targetOrigin = new URL(IFRAME_URL).origin;
      iframeRef.current.contentWindow.postMessage(message, targetOrigin);
    }
  }, []);

  // iframeからのメッセージを受信
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // オリジン検証
      if (!ALLOWED_ORIGINS.includes(event.origin)) {
        return;
      }

      console.log('Received from iframe:', event.data);

      switch (event.data.type) {
        case 'SIMULATION_COMPLETE':
          console.log('Simulation result:', event.data.result);
          break;

        case 'ERROR':
          console.error('Simulator error:', event.data.error);
          break;
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  // iframeロード完了
  const handleLoad = () => {
    console.log('Simulator iframe loaded');
    
    // 初期化メッセージを送信（オプション）
    sendMessage({
      type: 'INIT',
      data: { /* 初期設定 */ }
    });
  };

  return (
    <div className="simulator-container">
      <h1>MSPコスト比較シミュレーター</h1>
      
      <iframe
        ref={iframeRef}
        src={IFRAME_URL}
        className="simulator-iframe"
        title="Cost Comparison Simulator"
        allow="clipboard-write"
        onLoad={handleLoad}
      />
    </div>
  );
};
```

### single-spaルーティング設定

```typescript
// root-config.ts (single-spa設定)
import { registerApplication, start } from 'single-spa';

registerApplication({
  name: '@wave/commitment-simulator',
  app: () => import('./CommitmentSimulatorAppContainer.vue'),
  activeWhen: ['/commitment-simulator', '/compare-risp'],
  customProps: {
    // カスタムプロパティ（オプション）
  }
});

start();
```

---

## PostMessage通信

### メッセージタイプ一覧

#### Next.jsアプリ → ホストアプリ

| タイプ | データ | 説明 |
|--------|-------|------|
| `READY` | `{}` | アプリの初期化完了 |
| `SIMULATION_COMPLETE` | `{ result: SimulationResult }` | シミュレーション完了 |
| `ERROR` | `{ error: string }` | エラー発生 |

#### ホストアプリ → Next.jsアプリ

| タイプ | データ | 説明 |
|--------|-------|------|
| `INIT` | `{ config: any }` | 初期設定 |
| `SET_PARAMS` | `{ params: SimulationParams }` | パラメータ設定 |
| `USER_CHANGED` | `{ user: User }` | ユーザー変更 |

### Next.jsアプリ側の実装（オプション）

PostMessage通信を実装する場合は、[app/layout.tsx](app/layout.tsx)または専用コンポーネントに追加：

```typescript
// components/PostMessageHandler.tsx
'use client';

import { useEffect } from 'react';

export function PostMessageHandler() {
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // オリジン検証
      const allowedOrigins = [
        'http://localhost:3012',
        'https://your-host-app.com'
      ];
      
      if (!allowedOrigins.includes(event.origin)) {
        return;
      }

      console.log('[compare-risp] Received:', event.data);

      switch (event.data.type) {
        case 'INIT':
          // 初期化処理
          break;

        case 'SET_PARAMS':
          // パラメータを設定
          // stateを更新したり、URLを変更したり
          break;

        case 'USER_CHANGED':
          // ユーザー情報を更新
          break;
      }
    };

    window.addEventListener('message', handleMessage);

    // 準備完了を通知
    if (window.parent !== window) {
      window.parent.postMessage({ type: 'READY' }, '*');
    }

    return () => window.removeEventListener('message', handleMessage);
  }, []);

  return null;
}
```

```typescript
// app/layout.tsx に追加
import { PostMessageHandler } from '@/components/PostMessageHandler';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <PostMessageHandler />
        {children}
      </body>
    </html>
  );
}
```

---

## デプロイ

### シンプルなデプロイフロー

**必要なデプロイ: 1つだけ**

```bash
# 1. Next.jsアプリをAWS Amplifyにデプロイ
git push origin main
# → Amplifyが自動デプロイ

# 完了！
```

### 環境ごとのURL

| 環境 | Next.jsアプリURL | ホストアプリURL |
|------|-----------------|----------------|
| 開発 | `http://localhost:3000` | `http://localhost:3012` |
| 本番 | `https://your-app.amplifyapp.com` | `https://your-host-app.com` |

---

## トラブルシューティング

### iframeが表示されない

**確認項目**:
1. Next.jsアプリが起動しているか
   ```bash
   npm run dev  # http://localhost:3000
   ```

2. iframeのURLが正しいか
   ```javascript
   console.log('iframe src:', simulatorFrame.value?.src);
   ```

3. Content-Security-Policyエラーがないか
   - ブラウザのコンソールを確認
   - [next.config.js](next.config.js)の`frame-ancestors`設定を確認

4. ネットワークエラーがないか
   - ブラウザのDevToolsでネットワークタブを確認

### PostMessageが届かない

**デバッグ方法**:

```javascript
// ホストアプリ側
const handleMessage = (event: MessageEvent) => {
  console.log('Origin:', event.origin);
  console.log('Data:', event.data);
  console.log('Expected origin:', new URL(iframeUrl.value).origin);
};
```

**確認項目**:
- オリジン検証が正しいか
- targetOriginが`'*'`ではなく具体的なオリジンを指定しているか
- Next.jsアプリ側でPostMessageを送信しているか（実装が必要な場合）

### CORSエラーが発生する

**原因**: APIリクエストのCORS設定が不足

**解決策**: インフラ側でCORS設定を追加
- CloudFrontやALBでCORSヘッダーを設定
- または[app/api/*/route.ts](app/api)で個別に設定（非推奨）

### スタイルが崩れる

**原因**: iframeの高さが不足している

**解決策**:

```css
.simulator-iframe {
  min-height: 900px;  /* 十分な高さを確保 */
  height: auto;
}
```

または、動的に高さを調整：

```javascript
// Next.jsアプリ → ホストアプリ
window.parent.postMessage({
  type: 'RESIZE',
  height: document.body.scrollHeight
}, '*');

// ホストアプリ
const handleMessage = (event: MessageEvent) => {
  if (event.data.type === 'RESIZE') {
    iframeRef.current.style.height = `${event.data.height}px`;
  }
};
```

---

## パフォーマンス最適化

### プリロード

```html
<!-- ホストアプリのHTML -->
<link rel="preconnect" href="https://your-app.amplifyapp.com">
<link rel="dns-prefetch" href="https://your-app.amplifyapp.com">
```

### 遅延ロード

single-spaのルーティングで自動的に遅延ロードが実現されます：

```typescript
// /compare-rispにアクセスしたときのみiframeをマウント
registerApplication({
  name: '@wave/commitment-simulator',
  app: () => import('./CommitmentSimulatorAppContainer.vue'),
  activeWhen: ['/compare-risp']
});
```

### キャッシュ戦略

Next.jsアプリ側で静的アセットをキャッシュ：

```javascript
// next.config.js
module.exports = {
  async headers() {
    return [
      {
        source: '/_next/static/:path*',
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

## セキュリティ考慮事項

### 1. Content-Security-Policy

[next.config.js](next.config.js)で設定済み：

```javascript
headers: [
  {
    key: 'Content-Security-Policy',
    value: "frame-ancestors 'self' https://your-company.com"
  }
]
```

### 2. PostMessageオリジン検証

**必須**: 常にオリジンを検証

```typescript
const ALLOWED_ORIGINS = [
  'http://localhost:3012',
  'https://your-host-app.com'
];

window.addEventListener('message', (event) => {
  if (!ALLOWED_ORIGINS.includes(event.origin)) {
    console.warn('Blocked message from:', event.origin);
    return;
  }
  // 処理を続行
});
```

### 3. 機密情報の扱い

- PostMessageで機密情報を送信しない
- 必要な場合はHTTPS必須
- トークンは親ウィンドウで管理

---

## 次のステップ

- [iframe統合の詳細](./IFRAME_INTEGRATION.md) - PostMessage APIの詳細
- [スタンドアロン使用](./STANDALONE.md) - 単体での使い方
- [AWS Amplifyデプロイ](../AMPLIFY_DEPLOYMENT.md) - デプロイ手順
