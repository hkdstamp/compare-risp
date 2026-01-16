# API リファレンス

compare-rispの統合APIの完全なリファレンスです。

## 📋 目次

- [PostMessage API](#postmessage-api)
- [URLパラメータ](#urlパラメータ)
- [データ型](#データ型)
- [イベント](#イベント)
- [エラーハンドリング](#エラーハンドリング)

---

## PostMessage API

iframe統合およびsingle-spa統合で使用するPostMessage APIのリファレンスです。

### メッセージフォーマット

すべてのメッセージは以下の形式:

```typescript
interface Message {
  type: string;      // メッセージタイプ
  [key: string]: any; // 追加データ
}
```

---

## 親 → compare-risp（送信）

### SET_INITIAL_PARAMS

シミュレーションの初期パラメータを設定します。

```typescript
{
  type: 'SET_INITIAL_PARAMS',
  params: SimulationParams
}
```

**SimulationParams:**

```typescript
interface SimulationParams {
  coverage: number;          // 0-1: RIカバレッジ率
  usage: number;            // 0-1: リソース使用率
  insurance: InsurancePlan; // '1y' | '3y': 保険プラン
  standard_term?: StandardTerm;    // '1yr' | '3yr': 標準プラン期間
  standard_option?: PaymentOption; // 支払いオプション
  resources?: ResourceConfig[];    // リソース設定（オプション）
}

type InsurancePlan = '1y' | '3y';
type StandardTerm = '1yr' | '3yr';
type PaymentOption = 'NoUpfront' | 'PartialUpfront' | 'AllUpfront';

interface ResourceConfig {
  service: string;    // 'ec2' | 'rds' | 'elasticache' など
  instance: string;   // 't3.medium', 'db.t3.large' など
  quantity: number;   // リソース数量
}
```

**使用例:**

```javascript
iframe.contentWindow.postMessage({
  type: 'SET_INITIAL_PARAMS',
  params: {
    coverage: 0.8,
    usage: 1.0,
    insurance: '1y',
    standard_term: '1yr',
    standard_option: 'NoUpfront',
    resources: [
      { service: 'ec2', instance: 't3.medium', quantity: 10 },
      { service: 'rds', instance: 'db.t3.large', quantity: 2 }
    ]
  }
}, 'https://compare-risp.your-domain.com');
```

---

### USER_CHANGED

ユーザー情報の変更を通知します。

```typescript
{
  type: 'USER_CHANGED',
  user: User | null
}
```

**User:**

```typescript
interface User {
  id: string;
  name: string;
  email?: string;
  vendor?: string;  // 'aws' | 'azure' | 'gcp' など
}
```

**使用例:**

```javascript
// ユーザーログイン時
iframe.contentWindow.postMessage({
  type: 'USER_CHANGED',
  user: {
    id: 'user-123',
    name: '田中太郎',
    email: 'tanaka@example.com',
    vendor: 'aws'
  }
}, 'https://compare-risp.your-domain.com');

// ユーザーログアウト時
iframe.contentWindow.postMessage({
  type: 'USER_CHANGED',
  user: null
}, 'https://compare-risp.your-domain.com');
```

---

### VENDOR_CHANGED

ベンダー（クラウドプロバイダ）の変更を通知します。

```typescript
{
  type: 'VENDOR_CHANGED',
  vendor: string  // 'aws' | 'azure' | 'gcp'
}
```

**使用例:**

```javascript
iframe.contentWindow.postMessage({
  type: 'VENDOR_CHANGED',
  vendor: 'aws'
}, 'https://compare-risp.your-domain.com');
```

---

### REQUEST_RESULT

現在のシミュレーション結果をリクエストします。

```typescript
{
  type: 'REQUEST_RESULT'
}
```

**使用例:**

```javascript
iframe.contentWindow.postMessage({
  type: 'REQUEST_RESULT'
}, 'https://compare-risp.your-domain.com');

// SIMULATION_COMPLETE メッセージで結果が返される
```

---

## compare-risp → 親（受信）

### READY

compare-rispの初期化が完了したことを通知します。

```typescript
{
  type: 'READY'
}
```

**使用例:**

```javascript
window.addEventListener('message', (event) => {
  if (event.data.type === 'READY') {
    console.log('compare-risp is ready');
    // 初期パラメータを送信
    sendInitialParams();
  }
});
```

---

### SIMULATION_COMPLETE

シミュレーションが完了し、結果が利用可能になったことを通知します。

```typescript
{
  type: 'SIMULATION_COMPLETE',
  result: SimulationResult
}
```

**SimulationResult:**

```typescript
interface SimulationResult {
  insurance: PlanResult;
  standard: PlanResult;
  savings: number;           // 削減額（円）
  savingsPercentage: number; // 削減率（%）
  coverage: number;          // カバレッジ率
  cumulative: CumulativeData;
}

interface PlanResult {
  totalCost: number;         // 総コスト（円）
  monthlyCost: number;       // 月額コスト（円）
  details: ResourceDetail[]; // リソースごとの詳細
}

interface ResourceDetail {
  service: string;           // サービス名
  instance: string;          // インスタンスタイプ
  quantity: number;          // 数量
  onDemandCost: number;      // オンデマンドコスト
  riCost: number;           // RIコスト
  savings: number;          // 削減額
}

interface CumulativeData {
  months: number[];          // 月番号の配列
  insurance: number[];       // 保険プランの累積コスト
  standard: number[];        // 標準プランの累積コスト
}
```

**使用例:**

```javascript
window.addEventListener('message', (event) => {
  if (event.data.type === 'SIMULATION_COMPLETE') {
    const result = event.data.result;
    
    console.log('総削減額:', result.savings);
    console.log('削減率:', result.savingsPercentage + '%');
    
    // 結果を表示
    displayResults(result);
  }
});
```

---

### ERROR

エラーが発生したことを通知します。

```typescript
{
  type: 'ERROR',
  error: string,
  code?: string
}
```

**エラーコード:**

| コード | 説明 |
|--------|------|
| `INVALID_PARAMS` | パラメータが不正 |
| `SIMULATION_FAILED` | シミュレーション実行エラー |
| `NETWORK_ERROR` | ネットワークエラー |
| `UNKNOWN_ERROR` | 不明なエラー |

**使用例:**

```javascript
window.addEventListener('message', (event) => {
  if (event.data.type === 'ERROR') {
    console.error('Error:', event.data.error);
    console.error('Code:', event.data.code);
    
    showErrorMessage(event.data.error);
  }
});
```

---

### RESIZE

iframeの高さ変更をリクエストします（オプション）。

```typescript
{
  type: 'RESIZE',
  height: number  // ピクセル単位
}
```

**使用例:**

```javascript
window.addEventListener('message', (event) => {
  if (event.data.type === 'RESIZE') {
    const iframe = document.getElementById('compare-risp-frame');
    iframe.style.height = event.data.height + 'px';
  }
});
```

---

## URLパラメータ

直接URL統合で使用可能なクエリパラメータです。

### サポートされているパラメータ

| パラメータ | 型 | 説明 | デフォルト | 例 |
|-----------|-----|------|-----------|-----|
| `coverage` | number | RIカバレッジ率（0-1） | `1.0` | `0.8` |
| `usage` | number | リソース使用率（0-1） | `1.0` | `0.9` |
| `insurance` | string | 保険プラン | `1y` | `1y`, `3y` |
| `standard_term` | string | 標準プラン期間 | `1yr` | `1yr`, `3yr` |
| `standard_option` | string | 支払いオプション | `NoUpfront` | `NoUpfront`, `PartialUpfront`, `AllUpfront` |

### 使用例

```
https://compare-risp.your-domain.com?coverage=0.8&usage=1.0&insurance=3y
```

```javascript
// プログラム的に生成
const params = new URLSearchParams({
  coverage: '0.8',
  usage: '1.0',
  insurance: '3y',
  standard_term: '3yr',
  standard_option: 'PartialUpfront'
});

const url = `https://compare-risp.your-domain.com?${params.toString()}`;
window.open(url, '_blank');
```

---

## データ型

### 完全な型定義

```typescript
// サービスタイプ
type ServiceType = 
  | 'ec2' 
  | 'rds' 
  | 'elasticache' 
  | 'redshift' 
  | 'opensearch';

// インスタンスタイプの例
type EC2Instance = 
  | 't3.micro' 
  | 't3.small' 
  | 't3.medium' 
  | 't3.large' 
  | 't3.xlarge'
  | 't3.2xlarge'
  | 'm5.large'
  | 'm5.xlarge'
  // ... その他のインスタンスタイプ
  ;

type RDSInstance = 
  | 'db.t3.micro'
  | 'db.t3.small'
  | 'db.t3.medium'
  | 'db.t3.large'
  | 'db.r5.large'
  | 'db.r5.xlarge'
  // ... その他のインスタンスタイプ
  ;

// リージョン
type AWSRegion = 
  | 'us-east-1'
  | 'us-west-2'
  | 'ap-northeast-1'
  | 'eu-west-1'
  // ... その他のリージョン
  ;

// 完全なリソース設定
interface ResourceConfig {
  service: ServiceType;
  instance: string;
  quantity: number;
  region?: AWSRegion;
}

// 価格情報
interface PricingInfo {
  onDemand: number;     // オンデマンド時間単価
  ri1Year: {
    noUpfront: number;
    partialUpfront: number;
    allUpfront: number;
  };
  ri3Year: {
    noUpfront: number;
    partialUpfront: number;
    allUpfront: number;
  };
}
```

---

## イベント

### single-spa統合で使用されるイベント

```typescript
// MicroAppApi を介したイベント通信

// compare-rispが発行
api.publish('compare-risp:ready', {});
api.publish('compare-risp:simulation-complete', result);
api.publish('compare-risp:error', error);

// compare-rispが購読
api.subscribe('compare-risp:set-params', (params) => {
  // パラメータを設定
});

// その他のマイクロアプリとの連携
api.subscribe('user:changed', (user) => {
  // ユーザー変更に反応
});

api.subscribe('vendor:changed', (vendor) => {
  // ベンダー変更に反応
});
```

---

## エラーハンドリング

### エラータイプ

```typescript
interface ErrorResponse {
  type: 'ERROR';
  error: string;
  code: ErrorCode;
  details?: any;
}

type ErrorCode = 
  | 'INVALID_PARAMS'
  | 'SIMULATION_FAILED'
  | 'NETWORK_ERROR'
  | 'API_ERROR'
  | 'UNKNOWN_ERROR';
```

### エラーハンドリングの例

```javascript
window.addEventListener('message', (event) => {
  if (event.data.type === 'ERROR') {
    switch (event.data.code) {
      case 'INVALID_PARAMS':
        alert('パラメータが不正です。入力内容を確認してください。');
        break;
      
      case 'SIMULATION_FAILED':
        alert('シミュレーションに失敗しました。もう一度お試しください。');
        break;
      
      case 'NETWORK_ERROR':
        alert('ネットワークエラーが発生しました。接続を確認してください。');
        break;
      
      default:
        alert('エラーが発生しました: ' + event.data.error);
    }
    
    // エラーログを送信
    logError({
      code: event.data.code,
      error: event.data.error,
      timestamp: new Date().toISOString()
    });
  }
});
```

---

## ベストプラクティス

### 1. タイムアウト処理

```javascript
function sendMessageWithTimeout(message, timeout = 5000) {
  return new Promise((resolve, reject) => {
    const handler = (event) => {
      if (event.data.type === 'SIMULATION_COMPLETE') {
        window.removeEventListener('message', handler);
        clearTimeout(timer);
        resolve(event.data.result);
      }
    };
    
    const timer = setTimeout(() => {
      window.removeEventListener('message', handler);
      reject(new Error('Timeout'));
    }, timeout);
    
    window.addEventListener('message', handler);
    iframe.contentWindow.postMessage(message, IFRAME_ORIGIN);
  });
}
```

### 2. リトライ処理

```javascript
async function simulateWithRetry(params, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const result = await sendMessageWithTimeout({
        type: 'SET_INITIAL_PARAMS',
        params
      });
      return result;
    } catch (error) {
      console.warn(`Retry ${i + 1}/${maxRetries}:`, error);
      if (i === maxRetries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
}
```

### 3. 型安全なメッセージ送信

```typescript
type MessageType = 
  | { type: 'SET_INITIAL_PARAMS'; params: SimulationParams }
  | { type: 'USER_CHANGED'; user: User | null }
  | { type: 'REQUEST_RESULT' };

function sendTypedMessage(message: MessageType) {
  iframe.contentWindow?.postMessage(message, IFRAME_ORIGIN);
}

// 使用例
sendTypedMessage({
  type: 'SET_INITIAL_PARAMS',
  params: { coverage: 0.8, usage: 1.0, insurance: '1y' }
});
```

---

## サンプルコード集

完全な実装例は以下を参照してください:

- [基本的なiframe統合](./IFRAME_INTEGRATION.md#実装例)
- [single-spa統合](./SINGLE_SPA_INTEGRATION.md#統合実装)
- [エラーハンドリング例](./IFRAME_INTEGRATION.md#エラーリトライ)

---

## 関連ドキュメント

- [統合ガイド](./INTEGRATION.md)
- [iframe統合](./IFRAME_INTEGRATION.md)
- [single-spa統合](./SINGLE_SPA_INTEGRATION.md)
