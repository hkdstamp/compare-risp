export default function Header() {
  return (
    <header className="bg-white rounded-xl shadow-lg p-6 mb-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
            🌊 Ripple 保険RI/SP 収益シミュレーター
          </h1>
          <p className="text-gray-600 mt-2">
            MSP向けコスト最適化・収益モデル分析ツール (Next.js Edition)
          </p>
        </div>
        <div className="hidden md:flex items-center space-x-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-2 rounded-lg">
          <span className="text-sm font-semibold">⚡ Powered by Next.js + Cloudflare</span>
        </div>
      </div>
    </header>
  )
}
