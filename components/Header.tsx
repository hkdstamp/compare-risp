export default function Header() {
  return (
    <header className="bg-white rounded-xl shadow-lg p-6 mb-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
            Ripple スマート予約割引 収益シミュレーター
          </h1>
          <p className="text-gray-600 mt-2">
            Ripple/Wave向けコスト最適化・収益モデル分析ツール 
          </p>
        </div>
      </div>
    </header>
  )
}
