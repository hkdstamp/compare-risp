# iframe埋め込み統合ガイド

このドキュメントでは、compare-rispをiframeとして他のWebアプリケーションに埋め込む方法を詳しく説明します。

## 📋 目次

- [概要](#概要)
- [基本的な埋め込み](#基本的な埋め込み)
- [PostMessage API](#postmessage-api)
- [実装例](#実装例)
- [高度な統合](#高度な統合)
- [トラブルシューティング](#トラブルシューティング)

---

## 概要

iframe統合は、compare-rispを他のWebページに埋め込み、PostMessage APIを使って双方向通信を行う方法です。

### メリット

- ✅ ページ遷移なしで利用可能
- ✅ シミュレーション結果を取得できる
- ✅ 初期パラメータを動的に設定できる
- ✅ UIの統一感を保てる

### デメリット

- ⚠️ 初回読み込みに時間がかかる
- ⚠️ PostMessage APIの実装が必要
- ⚠️ クロスオリジン制約に注意

---

## 基本的な埋め込み

### 最小限の実装

```html
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>コスト比較ツール</title>
  <style>
    body {
      margin: 0;
      padding: 20px;
      font-family: sans-serif;
    }
    .container {
      max-width: 1200px;
      margin: 0 auto;
    }
    #compare-risp-frame {
      width: 100%;
      min-height: 900px;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>MSPコスト比較シミュレーター</h1>
    
    <iframe 
      id="compare-risp-frame"
      src="https://compare-risp.your-domain.com"
      title="Cost Comparison Simulator"
      allow="clipboard-write"
    ></iframe>
  </div>
</body>
</html>
```

### レスポンシブ対応

```css
/* モバイルフレンドリーなスタイル */
#compare-risp-frame {
  width: 100%;
  min-height: 800px;
  height: calc(100vh - 200px);
  border: none;
}

@media (max-width: 768px) {
  #compare-risp-frame {
    min-height: 600px;
    height: calc(100vh - 100px);
  }
}

@media (max-width: 480px) {
  #compare-risp-frame {
    min-height: 500px;
    height: calc(100vh - 80px);
  }
}
```

---

## PostMessage API

### アーキテクチャ

```
親ページ (your-app.com)
    ↓ postMessage
iframe (compare-risp.your-domain.com)
    ↓ 処理
iframe (compare-risp.your-domain.com)
    ↓ postMessage
親ページ (your-app.com)
```

### セキュリティの重要性

```javascript
// ✅ 良い例: オリジンを検証
window.addEventListener('message', (event) => {
  if (event.origin !== 'https://compare-risp.your-domain.com') {
    console.warn('Unknown origin:', event.origin);
    return;
  }
  // 処理を続行
});

// ❌ 悪い例: すべてのオリジンを許可
window.addEventListener('message', (event) => {
  // オリジン検証なし - セキュリティリスク
  processMessage(event.data);
});
```

### メッセージフォーマット

すべてのメッセージは以下の形式:

```typescript
interface Message {
  type: string;      // メッセージタイプ
  [key: string]: any; // その他のデータ
}
```

---

## 実装例

### 完全な統合例

```html
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <title>コスト比較ツール統合</title>
  <style>
    body {
      margin: 0;
      padding: 20px;
      font-family: system-ui, -apple-system, sans-serif;
      background: #f9fafb;
    }
    .container {
      max-width: 1400px;
      margin: 0 auto;
    }
    .header {
      background: white;
      padding: 20px;
      border-radius: 8px;
      margin-bottom: 20px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }
    .controls {
      display: flex;
      gap: 10px;
      margin-bottom: 20px;
    }
    button {
      padding: 10px 20px;
      border: none;
      border-radius: 6px;
      background: #3b82f6;
      color: white;
      cursor: pointer;
      font-size: 14px;
    }
    button:hover {
      background: #2563eb;
    }
    button:disabled {
      background: #9ca3af;
      cursor: not-allowed;
    }
    #status {
      padding: 10px;
      border-radius: 6px;
      margin-top: 10px;
    }
    #status.ready { background: #d1fae5; color: #065f46; }
    #status.loading { background: #fef3c7; color: #92400e; }
    #status.error { background: #fee2e2; color: #991b1b; }
    #result-panel {
      background: white;
      padding: 20px;
      border-radius: 8px;
      margin-bottom: 20px;
      display: none;
    }
    #compare-risp-frame {
      width: 100%;
      min-height: 900px;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      background: white;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>MSPコスト比較シミュレーター</h1>
      
      <div class="controls">
        <button id="btn-preset-1" onclick="loadPreset1()">プリセット1 (カバレッジ80%)</button>
        <button id="btn-preset-2" onclick="loadPreset2()">プリセット2 (カバレッジ60%)</button>
        <button id="btn-request-result" onclick="requestResult()" disabled>現在の結果を取得</button>
      </div>
      
      <div id="status" class="loading">読み込み中...</div>
    </div>
    
    <!-- シミュレーション結果表示パネル -->
    <div id="result-panel">
      <h2>最新のシミュレーション結果</h2>
      <div id="result-content"></div>
    </div>
    
    <!-- compare-risp iframe -->
    <iframe 
      id="compare-risp-frame"
      src="https://compare-risp.your-domain.com"
      title="Cost Comparison Simulator"
      allow="clipboard-write"
    ></iframe>
  </div>

  <script>
    const IFRAME_ORIGIN = 'https://compare-risp.your-domain.com';
    const frame = document.getElementById('compare-risp-frame');
    const statusEl = document.getElementById('status');
    const resultPanel = document.getElementById('result-panel');
    const resultContent = document.getElementById('result-content');
    let isReady = false;

    // iframe読み込み完了
    frame.addEventListener('load', () => {
      console.log('iframe loaded');
    });

    // メッセージ受信
    window.addEventListener('message', (event) => {
      // セキュリティ: オリジン検証
      if (event.origin !== IFRAME_ORIGIN) {
        console.warn('Unknown origin:', event.origin);
        return;
      }

      console.log('Received message:', event.data);

      // メッセージタイプごとに処理
      switch (event.data.type) {
        case 'READY':
          handleReady();
          break;
        
        case 'SIMULATION_COMPLETE':
          handleSimulationComplete(event.data.result);
          break;
        
        case 'ERROR':
          handleError(event.data.error);
          break;
      }
    });

    // READY メッセージ処理
    function handleReady() {
      isReady = true;
      statusEl.textContent = '準備完了';
      statusEl.className = 'ready';
      document.getElementById('btn-request-result').disabled = false;
      console.log('compare-risp is ready');
    }

    // シミュレーション完了処理
    function handleSimulationComplete(result) {
      console.log('Simulation result:', result);
      
      // 結果パネルを表示
      resultPanel.style.display = 'block';
      
      // 結果を整形して表示
      resultContent.innerHTML = `
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px;">
          <div style="padding: 15px; background: #f0f9ff; border-radius: 6px;">
            <h3 style="margin: 0 0 10px 0; color: #0369a1;">保険プラン</h3>
            <p style="margin: 5px 0;"><strong>総コスト:</strong> ¥${result.insurance.totalCost.toLocaleString()}</p>
            <p style="margin: 5px 0;"><strong>月額:</strong> ¥${result.insurance.monthlyCost.toLocaleString()}</p>
          </div>
          
          <div style="padding: 15px; background: #fef3c7; border-radius: 6px;">
            <h3 style="margin: 0 0 10px 0; color: #92400e;">標準プラン</h3>
            <p style="margin: 5px 0;"><strong>総コスト:</strong> ¥${result.standard.totalCost.toLocaleString()}</p>
            <p style="margin: 5px 0;"><strong>月額:</strong> ¥${result.standard.monthlyCost.toLocaleString()}</p>
          </div>
          
          <div style="padding: 15px; background: #d1fae5; border-radius: 6px;">
            <h3 style="margin: 0 0 10px 0; color: #065f46;">削減額</h3>
            <p style="margin: 5px 0;"><strong>削減額:</strong> ¥${result.savings.toLocaleString()}</p>
            <p style="margin: 5px 0;"><strong>削減率:</strong> ${result.savingsPercentage.toFixed(1)}%</p>
          </div>
        </div>
      `;
      
      // 結果をデータベースに保存（例）
      saveToDatabase(result);
    }

    // エラー処理
    function handleError(error) {
      statusEl.textContent = 'エラー: ' + error;
      statusEl.className = 'error';
      console.error('Simulation error:', error);
    }

    // プリセット1を読み込み
    function loadPreset1() {
      if (!isReady) {
        alert('アプリの準備ができていません');
        return;
      }

      frame.contentWindow.postMessage({
        type: 'SET_INITIAL_PARAMS',
        params: {
          coverage: 0.8,
          usage: 1.0,
          insurance: '1y',
          standard_term: '1yr',
          standard_option: 'NoUpfront',
          resources: [
            { service: 'ec2', instance: 't3.medium', quantity: 10 },
            { service: 'ec2', instance: 't3.large', quantity: 5 },
            { service: 'rds', instance: 'db.t3.large', quantity: 2 }
          ]
        }
      }, IFRAME_ORIGIN);
      
      statusEl.textContent = 'プリセット1を読み込みました';
      statusEl.className = 'ready';
    }

    // プリセット2を読み込み
    function loadPreset2() {
      if (!isReady) {
        alert('アプリの準備ができていません');
        return;
      }

      frame.contentWindow.postMessage({
        type: 'SET_INITIAL_PARAMS',
        params: {
          coverage: 0.6,
          usage: 0.8,
          insurance: '3y',
          standard_term: '3yr',
          standard_option: 'PartialUpfront',
          resources: [
            { service: 'ec2', instance: 't3.xlarge', quantity: 20 },
            { service: 'rds', instance: 'db.r5.xlarge', quantity: 5 }
          ]
        }
      }, IFRAME_ORIGIN);
      
      statusEl.textContent = 'プリセット2を読み込みました';
      statusEl.className = 'ready';
    }

    // 現在の結果をリクエスト
    function requestResult() {
      if (!isReady) {
        alert('アプリの準備ができていません');
        return;
      }

      frame.contentWindow.postMessage({
        type: 'REQUEST_RESULT'
      }, IFRAME_ORIGIN);
    }

    // データベースに保存（例）
    function saveToDatabase(result) {
      // 実際のAPIエンドポイントに送信
      fetch('/api/save-simulation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          result: result,
          timestamp: new Date().toISOString(),
          userId: getCurrentUserId() // 現在のユーザーID
        })
      })
      .then(response => response.json())
      .then(data => {
        console.log('Saved to database:', data);
      })
      .catch(error => {
        console.error('Failed to save:', error);
      });
    }

    // ダミー関数
    function getCurrentUserId() {
      return 'user-123';
    }
  </script>
</body>
</html>
```

---

## 高度な統合

### ユーザー情報の同期

```javascript
// ユーザーがログインしたときに通知
function onUserLogin(user) {
  frame.contentWindow.postMessage({
    type: 'USER_CHANGED',
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      vendor: user.vendor
    }
  }, IFRAME_ORIGIN);
}

// ユーザーがログアウトしたときに通知
function onUserLogout() {
  frame.contentWindow.postMessage({
    type: 'USER_CHANGED',
    user: null
  }, IFRAME_ORIGIN);
}
```

### 動的な高さ調整

```javascript
// iframe内のコンテンツ高さに応じて自動調整
window.addEventListener('message', (event) => {
  if (event.origin !== IFRAME_ORIGIN) return;
  
  if (event.data.type === 'RESIZE') {
    frame.style.height = event.data.height + 'px';
  }
});
```

### ローディング状態の管理

```javascript
let loadingTimeout;

frame.addEventListener('load', () => {
  // タイムアウトを設定（30秒以内に READY が来ない場合エラー）
  loadingTimeout = setTimeout(() => {
    statusEl.textContent = 'タイムアウト: アプリの読み込みに失敗しました';
    statusEl.className = 'error';
  }, 30000);
});

function handleReady() {
  clearTimeout(loadingTimeout);
  isReady = true;
  statusEl.textContent = '準備完了';
  statusEl.className = 'ready';
}
```

### エラーリトライ

```javascript
let retryCount = 0;
const MAX_RETRIES = 3;

function handleError(error) {
  console.error('Error:', error);
  
  if (retryCount < MAX_RETRIES) {
    retryCount++;
    statusEl.textContent = `エラーが発生しました。再試行中... (${retryCount}/${MAX_RETRIES})`;
    statusEl.className = 'loading';
    
    // 3秒後に再試行
    setTimeout(() => {
      frame.src = frame.src; // iframeをリロード
    }, 3000);
  } else {
    statusEl.textContent = 'エラー: 再試行回数の上限に達しました';
    statusEl.className = 'error';
  }
}
```

---

## トラブルシューティング

### iframe が表示されない

**問題**: iframeが空白または読み込まれない

**解決策**:

1. **X-Frame-Options ヘッダーを確認**

```javascript
// compare-risp側で設定（next.config.js）
module.exports = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN', // または 'ALLOW-FROM https://your-site.com'
          },
        ],
      },
    ];
  },
};
```

2. **CSP（Content Security Policy）を確認**

```html
<!-- 親ページで設定 -->
<meta http-equiv="Content-Security-Policy" 
      content="frame-src https://compare-risp.your-domain.com;">
```

3. **CORS設定を確認**

```javascript
// compare-risp側のAPI Routes
export async function POST(request) {
  const response = NextResponse.json(data);
  response.headers.set('Access-Control-Allow-Origin', 'https://your-site.com');
  return response;
}
```

### PostMessage が届かない

**問題**: メッセージが送受信されない

**デバッグ方法**:

```javascript
// 送信側
console.log('Sending message:', message);
frame.contentWindow.postMessage(message, IFRAME_ORIGIN);

// 受信側
window.addEventListener('message', (event) => {
  console.log('Received:', {
    origin: event.origin,
    data: event.data
  });
});
```

**よくある原因**:

1. オリジンが一致していない
2. iframe読み込み完了前にメッセージを送信
3. `contentWindow` が null

**解決策**:

```javascript
// iframe読み込み完了を待つ
function sendMessage(message) {
  if (isReady) {
    frame.contentWindow.postMessage(message, IFRAME_ORIGIN);
  } else {
    // READYメッセージを待つ
    const handler = (event) => {
      if (event.data.type === 'READY') {
        window.removeEventListener('message', handler);
        frame.contentWindow.postMessage(message, IFRAME_ORIGIN);
      }
    };
    window.addEventListener('message', handler);
  }
}
```

### パフォーマンスが悪い

**問題**: iframe読み込みが遅い

**最適化**:

1. **遅延読み込み（Lazy Loading）**

```javascript
// ビューポートに入ったときに読み込む
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      frame.src = 'https://compare-risp.your-domain.com';
      observer.disconnect();
    }
  });
});

observer.observe(frame);
```

2. **プリロード**

```html
<link rel="preconnect" href="https://compare-risp.your-domain.com">
<link rel="dns-prefetch" href="https://compare-risp.your-domain.com">
```

---

## 次のステップ

- [single-spa統合の実装](./SINGLE_SPA_INTEGRATION.md)
- [API リファレンス](./API.md)
- [セキュリティベストプラクティス](./SECURITY.md)
