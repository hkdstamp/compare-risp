'use client'

import { useState } from 'react'

export default function DiscountRateInfo() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Info Icon Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center justify-center w-6 h-6 text-sm font-medium text-blue-600 bg-blue-100 rounded-full hover:bg-blue-200 transition-colors"
        title="割引率の詳細情報"
      >
        <span className="text-xs">ℹ️</span>
      </button>

      {/* Modal Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-4 flex items-center justify-between rounded-t-xl">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <span>📊</span>
                割引率の概要
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-white hover:bg-opacity-20 rounded-full w-8 h-8 flex items-center justify-center transition"
              >
                ✕
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Insurance RI/SP Section */}
              <section>
                <h4 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <span>🛡️</span>
                  保険RI/SP
                </h4>
                <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-4">
                  <p className="text-sm text-gray-700">
                    <strong>注記：</strong>ComputeSP 3年相当で算定
                  </p>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="border border-gray-300 px-4 py-2 text-left">プラン</th>
                        <th className="border border-gray-300 px-4 py-2 text-center">割引率</th>
                        <th className="border border-gray-300 px-4 py-2 text-center">保険料率</th>
                        <th className="border border-gray-300 px-4 py-2 text-center">実効割引率</th>
                        <th className="border border-gray-300 px-4 py-2 text-right">月額料金<br/>(EC2 t3.large)</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="hover:bg-gray-50">
                        <td className="border border-gray-300 px-4 py-2">30日保証</td>
                        <td className="border border-gray-300 px-4 py-2 text-center font-semibold text-green-600">60%</td>
                        <td className="border border-gray-300 px-4 py-2 text-center">50%</td>
                        <td className="border border-gray-300 px-4 py-2 text-center font-semibold text-blue-600">30.0%</td>
                        <td className="border border-gray-300 px-4 py-2 text-right">$55.60</td>
                      </tr>
                      <tr className="hover:bg-gray-50">
                        <td className="border border-gray-300 px-4 py-2">1年保証</td>
                        <td className="border border-gray-300 px-4 py-2 text-center font-semibold text-green-600">60%</td>
                        <td className="border border-gray-300 px-4 py-2 text-center">33%</td>
                        <td className="border border-gray-300 px-4 py-2 text-center font-semibold text-blue-600">40.2%</td>
                        <td className="border border-gray-300 px-4 py-2 text-right">$47.50</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="mt-3 text-xs text-gray-600 space-y-1">
                  <p>✅ 契約期間30日または1年（短期契約が可能）</p>
                  <p>✅ 未使用分は返金される柔軟性</p>
                  <p>✅ 初期費用ゼロ</p>
                  <p>✅ 1年保証の実効割引率が標準RI/SPと同等レベル</p>
                </div>
              </section>

              {/* Standard RI/SP Section */}
              <section>
                <h4 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <span>📋</span>
                  標準RI/SP
                </h4>
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4">
                  <p className="text-sm text-gray-700">
                    <strong>注記：</strong>SPは、ComputeSavingsPlansから簡易的に算定
                  </p>
                </div>

                {/* Reserved Instance Table */}
                <h5 className="font-semibold text-gray-800 mb-2">Reserved Instance (RI)</h5>
                <div className="overflow-x-auto mb-4">
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="border border-gray-300 px-4 py-2 text-left">契約期間</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">支払方法</th>
                        <th className="border border-gray-300 px-4 py-2 text-center">割引率</th>
                        <th className="border border-gray-300 px-4 py-2 text-right">初期費用</th>
                        <th className="border border-gray-300 px-4 py-2 text-right">月額料金<br/>(EC2 t3.large)</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="hover:bg-gray-50">
                        <td className="border border-gray-300 px-4 py-2" rowSpan={3}>1年</td>
                        <td className="border border-gray-300 px-4 py-2">NoUpfront (全額後払い)</td>
                        <td className="border border-gray-300 px-4 py-2 text-center font-semibold text-blue-600">37.0%</td>
                        <td className="border border-gray-300 px-4 py-2 text-right">$0</td>
                        <td className="border border-gray-300 px-4 py-2 text-right">$50.01</td>
                      </tr>
                      <tr className="hover:bg-gray-50">
                        <td className="border border-gray-300 px-4 py-2">PartialUpfront (50%前払い)</td>
                        <td className="border border-gray-300 px-4 py-2 text-center font-semibold text-blue-600">40.0%</td>
                        <td className="border border-gray-300 px-4 py-2 text-right">$286</td>
                        <td className="border border-gray-300 px-4 py-2 text-right">$47.63</td>
                      </tr>
                      <tr className="hover:bg-gray-50">
                        <td className="border border-gray-300 px-4 py-2">AllUpfront (100%前払い)</td>
                        <td className="border border-gray-300 px-4 py-2 text-center font-semibold text-blue-600">41.2%</td>
                        <td className="border border-gray-300 px-4 py-2 text-right">$560</td>
                        <td className="border border-gray-300 px-4 py-2 text-right">$46.67</td>
                      </tr>
                      <tr className="hover:bg-gray-50">
                        <td className="border border-gray-300 px-4 py-2" rowSpan={3}>3年</td>
                        <td className="border border-gray-300 px-4 py-2">NoUpfront (全額後払い)</td>
                        <td className="border border-gray-300 px-4 py-2 text-center font-semibold text-blue-600">56.8%</td>
                        <td className="border border-gray-300 px-4 py-2 text-right">$0</td>
                        <td className="border border-gray-300 px-4 py-2 text-right">$34.31</td>
                      </tr>
                      <tr className="hover:bg-gray-50">
                        <td className="border border-gray-300 px-4 py-2">PartialUpfront (50%前払い)</td>
                        <td className="border border-gray-300 px-4 py-2 text-center font-semibold text-blue-600">60.0%</td>
                        <td className="border border-gray-300 px-4 py-2 text-right">$572</td>
                        <td className="border border-gray-300 px-4 py-2 text-right">$31.80</td>
                      </tr>
                      <tr className="hover:bg-gray-50">
                        <td className="border border-gray-300 px-4 py-2">AllUpfront (100%前払い)</td>
                        <td className="border border-gray-300 px-4 py-2 text-center font-semibold text-blue-600">62.4%</td>
                        <td className="border border-gray-300 px-4 py-2 text-right">$1,075</td>
                        <td className="border border-gray-300 px-4 py-2 text-right">$29.86</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Savings Plans Table */}
                <h5 className="font-semibold text-gray-800 mb-2">Compute Savings Plans (SP)</h5>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="border border-gray-300 px-4 py-2 text-left">契約期間</th>
                        <th className="border border-gray-300 px-4 py-2 text-center">割引率</th>
                        <th className="border border-gray-300 px-4 py-2 text-right">初期費用</th>
                        <th className="border border-gray-300 px-4 py-2 text-right">月額料金<br/>(EC2 t3.large)</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="hover:bg-gray-50">
                        <td className="border border-gray-300 px-4 py-2">1年</td>
                        <td className="border border-gray-300 px-4 py-2 text-center font-semibold text-blue-600">40.0%</td>
                        <td className="border border-gray-300 px-4 py-2 text-right">$0</td>
                        <td className="border border-gray-300 px-4 py-2 text-right">$47.67</td>
                      </tr>
                      <tr className="hover:bg-gray-50">
                        <td className="border border-gray-300 px-4 py-2">3年</td>
                        <td className="border border-gray-300 px-4 py-2 text-center font-semibold text-blue-600">60.0%</td>
                        <td className="border border-gray-300 px-4 py-2 text-right">$0</td>
                        <td className="border border-gray-300 px-4 py-2 text-right">$31.75</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="mt-3 text-xs text-gray-600 space-y-1">
                  <p>✅ 初期費用ゼロ（全額後払い）</p>
                  <p>✅ インスタンスファミリー、リージョン、OSをまたいで適用可能</p>
                  <p>✅ 柔軟性が高く、RIより使いやすい</p>
                </div>
              </section>

              {/* Comparison Section */}
              <section className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4">
                <h4 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <span>⚖️</span>
                  使い分けの指針
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold">1.</span>
                    <p><strong>最大割引を求める：</strong>RI 3年 AllUpfront (62.4%)</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold">2.</span>
                    <p><strong>初期費用を避けたい：</strong>SP 1年 (40.0%) または 保険RI/SP 1年保証 (40.2%)</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold">3.</span>
                    <p><strong>柔軟性を重視：</strong>保険RI/SP 1年保証 (40.2%) ← 高割引率＋短期契約＋返金保証</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold">4.</span>
                    <p><strong>超短期利用：</strong>保険RI/SP 30日保証 (30.0%)</p>
                  </div>
                </div>
              </section>

              {/* Footer Note */}
              <div className="text-xs text-gray-500 border-t pt-4">
                <p>※ EC2 t3.large (オンデマンド $0.1088/時間、730時間/月、$79.42/月) を基準とした計算例</p>
                <p>※ 実際の料金は、リージョン、インスタンスタイプ、利用時間により異なります</p>
              </div>
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 bg-gray-100 px-6 py-4 flex justify-end rounded-b-xl">
              <button
                onClick={() => setIsOpen(false)}
                className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
              >
                閉じる
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
