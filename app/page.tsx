"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import SimulationConfig from "@/components/SimulationConfig";
import SimulationResults from "@/components/SimulationResults";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ResourceSelector from "@/components/ResourceSelector";
import { SimulationResult, ResourceConfig } from "@/lib/types";
import { defaultResources } from "@/lib/pricing-catalog";
import { cn } from "@/lib/utils";

// PostMessage APIの型定義
interface PostMessageData {
  type: string;
  [key: string]: any;
}

function HomeContent() {
  const searchParams = useSearchParams();
  const [simulationResult, setSimulationResult] =
    useState<SimulationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [resources, setResources] =
    useState<ResourceConfig[]>(defaultResources);
  const [simulationParams, setSimulationParams] = useState<any>(null);
  const [isEmbedded, setIsEmbedded] = useState(true);

  // モード判定: URLパラメータ mode=customer なら顧客モード、それ以外はMSPモード
  const isMSPMode = searchParams.get("mode") !== "customer";

  // PostMessage APIの初期化
  useEffect(() => {
    // iframe内で実行されているかチェック
    const inIframe = window.self !== window.top;
    setIsEmbedded(inIframe);

    // 親ウィンドウからのメッセージを受信
    const handleMessage = (event: MessageEvent<PostMessageData>) => {
      // セキュリティ: 開発環境と本番環境のオリジンを許可
      const allowedOrigins = [
        "http://localhost:3000",
        "http://localhost:3001",
        "http://localhost:3010",
        "https://wave.onedev.alphaus.cloud",
        "https://alphaus.cloud",
        "https://*.alphaus.cloud",
        "https://*.*.alphaus.cloud",
        "https://*.webflow.com",
        "https://*.webflow.io", // 本番環境のオリジンに置き換え
        // 必要に応じて他のオリジンを追加
      ];

      // 開発環境では全てのlocalhostを許可
      const isLocalhost = event.origin.startsWith("http://localhost:");
      const isAllowed =
        allowedOrigins.includes(event.origin) ||
        (process.env.NODE_ENV === "development" && isLocalhost);

      if (!isAllowed) {
        console.warn("[compare-risp] Unknown origin:", event.origin);
        return;
      }

      console.log("[compare-risp] Received message:", event.data);

      // メッセージタイプごとに処理
      switch (event.data.type) {
        case "SET_INITIAL_PARAMS":
          handleSetInitialParams(event.data.params);
          break;

        case "USER_CHANGED":
          handleUserChanged(event.data.user);
          break;

        case "VENDOR_CHANGED":
          handleVendorChanged(event.data.vendor);
          break;

        case "REQUEST_RESULT":
          handleRequestResult();
          break;
      }
    };

    window.addEventListener("message", handleMessage);

    // 親ウィンドウに準備完了を通知
    if (inIframe && window.parent) {
      window.parent.postMessage({ type: "READY" }, "*");
    }

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  // 初期パラメータを設定
  const handleSetInitialParams = (params: any) => {
    console.log("[compare-risp] Setting initial params:", params);

    if (params.resources && Array.isArray(params.resources)) {
      setResources(params.resources);
    }

    // シミュレーションを自動実行
    if (params.coverage !== undefined || params.usage !== undefined) {
      handleSimulate(params);
    }
  };

  // ユーザー変更を処理
  const handleUserChanged = (user: any) => {
    console.log("[compare-risp] User changed:", user);
    // 必要に応じてユーザー情報を保存
  };

  // ベンダー変更を処理
  const handleVendorChanged = (vendor: string) => {
    console.log("[compare-risp] Vendor changed:", vendor);
    // 必要に応じてベンダー情報を反映
  };

  // 現在の結果をリクエスト
  const handleRequestResult = () => {
    if (simulationResult && window.parent) {
      window.parent.postMessage(
        {
          type: "SIMULATION_COMPLETE",
          result: simulationResult,
        },
        "*",
      );
    }
  };

  // シミュレーション実行
  const handleSimulate = async (params: any) => {
    setIsLoading(true);
    setSimulationParams(params); // Save params for revenue forecast
    try {
      const response = await fetch("/api/simulate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...params,
          resources, // Include selected resources in simulation
        }),
      });

      if (!response.ok) {
        throw new Error("Simulation failed");
      }

      const data = await response.json();
      // Add coverage to result
      data.coverage = params.coverage;
      setSimulationResult(data);

      // iframe内の場合、親ウィンドウに結果を通知
      if (isEmbedded && window.parent) {
        window.parent.postMessage(
          {
            type: "SIMULATION_COMPLETE",
            result: data,
          },
          "*",
        );
      }
    } catch (error) {
      console.error("Error:", error);

      // iframe内の場合、親ウィンドウにエラーを通知
      if (isEmbedded && window.parent) {
        window.parent.postMessage(
          {
            type: "ERROR",
            error: "シミュレーションエラーが発生しました",
            code: "SIMULATION_FAILED",
          },
          "*",
        );
      }

      alert("シミュレーションエラーが発生しました。もう一度お試しください。");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={cn(
        "min-h-screen transition-colors duration-500",
        !isEmbedded && "bg-blue-50",
      )}
    >
      <div className={cn("mx-auto px-4 py-6", !isEmbedded && "max-w-7xl")}>
        <Header />

        <main className="space-y-6">
          <ResourceSelector resources={resources} onChange={setResources} />

          <SimulationConfig onSimulate={handleSimulate} isLoading={isLoading} />

          {isLoading && (
            <div className="bg-white rounded-xl shadow-lg p-8 border border-secondary-200">
              <div className="flex flex-col items-center justify-center space-y-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                <p className="text-secondary-600">計算中...</p>
              </div>
            </div>
          )}

          {simulationResult && !isLoading && simulationParams && (
            <SimulationResults
              result={simulationResult}
              insurancePlanKey={simulationParams.insurance}
              usage={simulationParams.usage}
              resources={resources}
              isMSPMode={isMSPMode}
            />
          )}
        </main>

        <Footer />
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          Loading...
        </div>
      }
    >
      <HomeContent />
    </Suspense>
  );
}
