'use client'

import { useState } from 'react'
import { InfoIcon, XIcon, ShieldIcon, FileTextIcon, BalanceIcon, ChartBarIcon } from '@/components/icons'

export default function DiscountRateInfo() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Info Icon Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center justify-center w-8 h-8 text-primary-600 bg-primary-100 rounded-full hover:bg-primary-200 transition-colors"
        title="割引率の詳細情報"
      >
        <InfoIcon size={18} />
      </button>

      {/* Modal Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-secondary-900 bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-secondary-200">
            {/* Header */}
            <div className="sticky top-0 bg-gradient-to-r from-primary-600 to-accent-600 text-white px-6 py-4 flex items-center justify-between rounded-t-xl">
              <h3 className="text-xl font-bold flex items-center gap-3">
                <ChartBarIcon size={24} />
                割引率の概要
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-white hover:bg-opacity-20 rounded-full w-8 h-8 flex items-center justify-center transition"
              >
                <XIcon size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Insurance Commitment Section */}
              <section>
                <h4 className="text-lg font-bold text-secondary-900 mb-3 flex items-center gap-2">
                  <ShieldIcon size={22} className="text-accent-600" />
                  保険コミットメント
                </h4>
                <div className="bg-success-50 border-l-4 border-success-500 p-4 mb-4">
                  <p className="text-sm text-secondary-700">
                    <strong>注記：</strong>EC2はComputeSP 3年相当（40%割引）で算定、その他サービスは3年RI/SPで算定
                  </p>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr className="bg-secondary-100">
                        <th className="border border-secondary-300 px-4 py-2 text-left text-secondary-700">プラン</th>
                        <th className="border border-secondary-300 px-4 py-2 text-center text-secondary-700">割引率</th>
                        <th className="border border-secondary-300 px-4 py-2 text-center text-secondary-700">保険料率</th>
                        <th className="border border-secondary-300 px-4 py-2 text-center text-secondary-700">実効割引率</th>
                        <th className="border border-secondary-300 px-4 py-2 text-right text-secondary-700">月額料金<br/>(EC2 t3.large)</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="hover:bg-secondary-50">
                        <td className="border border-secondary-300 px-4 py-2 text-secondary-900">30日保証</td>
                        <td className="border border-secondary-300 px-4 py-2 text-center font-semibold text-success-600">40%</td>
                        <td className="border border-secondary-300 px-4 py-2 text-center text-secondary-700">50%</td>
                        <td className="border border-secondary-300 px-4 py-2 text-center font-semibold text-primary-600">20.0%</td>
                        <td className="border border-secondary-300 px-4 py-2 text-right text-secondary-900">$63.53</td>
                      </tr>
                      <tr className="hover:bg-secondary-50">
                        <td className="border border-secondary-300 px-4 py-2 text-secondary-900">1年保証</td>
                        <td className="border border-secondary-300 px-4 py-2 text-center font-semibold text-success-600">40%</td>
                        <td className="border border-secondary-300 px-4 py-2 text-center text-secondary-700">33%</td>
                        <td className="border border-secondary-300 px-4 py-2 text-center font-semibold text-primary-600">26.8%</td>
                        <td className="border border-secondary-300 px-4 py-2 text-right text-secondary-900">$58.13</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="mt-3 text-xs text-secondary-600 space-y-1">
                  <p>✅ 契約期間30日または1年（短期契約が可能）</p>
                  <p>✅ Savingsの損失分は返金される柔軟性</p>
                  <p>✅ 初期費用ゼロ</p>
                  <p>✅ EC2はComputeSP 3年相当（40%割引）を基準に算定</p>
                </div>
              </section>

              {/* Standard RI/SP Section */}
              <section>
                <h4 className="text-lg font-bold text-secondary-900 mb-3 flex items-center gap-2">
                  <FileTextIcon size={22} className="text-primary-600" />
                  標準RI/SP
                </h4>
                <div className="bg-primary-50 border-l-4 border-primary-500 p-4 mb-4">
                  <p className="text-sm text-secondary-700">
                    <strong>注記：</strong>SPは、ComputeSavingsPlansから簡易的に算定
                  </p>
                </div>

                {/* Reserved Instance Table */}
                <h5 className="font-semibold text-secondary-800 mb-2">Reserved Instance (RI)</h5>
                <div className="overflow-x-auto mb-4">
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr className="bg-secondary-100">
                        <th className="border border-secondary-300 px-4 py-2 text-left text-secondary-700">契約期間</th>
                        <th className="border border-secondary-300 px-4 py-2 text-left text-secondary-700">支払方法</th>
                        <th className="border border-secondary-300 px-4 py-2 text-center text-secondary-700">割引率</th>
                        <th className="border border-secondary-300 px-4 py-2 text-right text-secondary-700">初期費用</th>
                        <th className="border border-secondary-300 px-4 py-2 text-right text-secondary-700">月額料金<br/>(EC2 t3.large)</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="hover:bg-secondary-50">
                        <td className="border border-secondary-300 px-4 py-2 text-secondary-900" rowSpan={3}>1年</td>
                        <td className="border border-secondary-300 px-4 py-2 text-secondary-900">NoUpfront (全額後払い)</td>
                        <td className="border border-secondary-300 px-4 py-2 text-center font-semibold text-primary-600">37.0%</td>
                        <td className="border border-secondary-300 px-4 py-2 text-right text-secondary-900">$0</td>
                        <td className="border border-secondary-300 px-4 py-2 text-right text-secondary-900">$50.01</td>
                      </tr>
                      <tr className="hover:bg-secondary-50">
                        <td className="border border-secondary-300 px-4 py-2 text-secondary-900">PartialUpfront (50%前払い)</td>
                        <td className="border border-secondary-300 px-4 py-2 text-center font-semibold text-primary-600">40.0%</td>
                        <td className="border border-secondary-300 px-4 py-2 text-right text-secondary-900">$286</td>
                        <td className="border border-secondary-300 px-4 py-2 text-right text-secondary-900">$47.63</td>
                      </tr>
                      <tr className="hover:bg-secondary-50">
                        <td className="border border-secondary-300 px-4 py-2 text-secondary-900">AllUpfront (100%前払い)</td>
                        <td className="border border-secondary-300 px-4 py-2 text-center font-semibold text-primary-600">41.2%</td>
                        <td className="border border-secondary-300 px-4 py-2 text-right text-secondary-900">$560</td>
                        <td className="border border-secondary-300 px-4 py-2 text-right text-secondary-900">$46.67</td>
                      </tr>
                      <tr className="hover:bg-secondary-50">
                        <td className="border border-secondary-300 px-4 py-2 text-secondary-900" rowSpan={3}>3年</td>
                        <td className="border border-secondary-300 px-4 py-2 text-secondary-900">NoUpfront (全額後払い)</td>
                        <td className="border border-secondary-300 px-4 py-2 text-center font-semibold text-primary-600">56.8%</td>
                        <td className="border border-secondary-300 px-4 py-2 text-right text-secondary-900">$0</td>
                        <td className="border border-secondary-300 px-4 py-2 text-right text-secondary-900">$34.31</td>
                      </tr>
                      <tr className="hover:bg-secondary-50">
                        <td className="border border-secondary-300 px-4 py-2 text-secondary-900">PartialUpfront (50%前払い)</td>
                        <td className="border border-secondary-300 px-4 py-2 text-center font-semibold text-primary-600">60.0%</td>
                        <td className="border border-secondary-300 px-4 py-2 text-right text-secondary-900">$572</td>
                        <td className="border border-secondary-300 px-4 py-2 text-right text-secondary-900">$31.80</td>
                      </tr>
                      <tr className="hover:bg-secondary-50">
                        <td className="border border-secondary-300 px-4 py-2 text-secondary-900">AllUpfront (100%前払い)</td>
                        <td className="border border-secondary-300 px-4 py-2 text-center font-semibold text-primary-600">62.4%</td>
                        <td className="border border-secondary-300 px-4 py-2 text-right text-secondary-900">$1,075</td>
                        <td className="border border-secondary-300 px-4 py-2 text-right text-secondary-900">$29.86</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Savings Plans Table */}
                <h5 className="font-semibold text-secondary-800 mb-2">Compute Savings Plans (SP)</h5>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr className="bg-secondary-100">
                        <th className="border border-secondary-300 px-4 py-2 text-left text-secondary-700">契約期間</th>
                        <th className="border border-secondary-300 px-4 py-2 text-center text-secondary-700">割引率</th>
                        <th className="border border-secondary-300 px-4 py-2 text-right text-secondary-700">初期費用</th>
                        <th className="border border-secondary-300 px-4 py-2 text-right text-secondary-700">月額料金<br/>(EC2 t3.large)</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="hover:bg-secondary-50">
                        <td className="border border-secondary-300 px-4 py-2 text-secondary-900">1年</td>
                        <td className="border border-secondary-300 px-4 py-2 text-center font-semibold text-primary-600">20.0%</td>
                        <td className="border border-secondary-300 px-4 py-2 text-right text-secondary-900">$0</td>
                        <td className="border border-secondary-300 px-4 py-2 text-right text-secondary-900">$63.54</td>
                      </tr>
                      <tr className="hover:bg-secondary-50">
                        <td className="border border-secondary-300 px-4 py-2 text-secondary-900">3年</td>
                        <td className="border border-secondary-300 px-4 py-2 text-center font-semibold text-primary-600">40.0%</td>
                        <td className="border border-secondary-300 px-4 py-2 text-right text-secondary-900">$0</td>
                        <td className="border border-secondary-300 px-4 py-2 text-right text-secondary-900">$47.65</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="mt-3 text-xs text-secondary-600 space-y-1">
                  <p>✅ 初期費用ゼロ（全額後払い）</p>
                  <p>✅ インスタンスファミリー、リージョン、OSをまたいで適用可能</p>
                  <p>✅ 柔軟性が高く、RIより使いやすい</p>
                </div>
              </section>

              {/* Comparison Section */}
              <section className="bg-gradient-to-r from-primary-50 to-accent-50 rounded-lg p-4 border border-primary-200">
                <h4 className="text-lg font-bold text-secondary-900 mb-3 flex items-center gap-2">
                  <BalanceIcon size={22} className="text-accent-600" />
                  使い分けの指針
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-start gap-2">
                    <span className="text-primary-600 font-bold">1.</span>
                    <p className="text-secondary-700"><strong>最大割引を求める：</strong>RI 3年 AllUpfront (62.4%)</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-primary-600 font-bold">2.</span>
                    <p className="text-secondary-700"><strong>初期費用を避けたい：</strong>RI 3年 NoUpfront (56.8%) または SP 3年 (40.0%)</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-primary-600 font-bold">3.</span>
                    <p className="text-secondary-700"><strong>柔軟性を重視：</strong>保険コミットメント 1年保証 (26.8%) ← 短期契約＋返金保証</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-primary-600 font-bold">4.</span>
                    <p className="text-secondary-700"><strong>超短期利用：</strong>保険コミットメント 30日保証 (20.0%)</p>
                  </div>
                </div>
              </section>

              {/* Footer Note */}
              <div className="text-xs text-secondary-500 border-t border-secondary-200 pt-4">
                <p>※ EC2 t3.large (オンデマンド $0.1088/時間、730時間/月、$79.42/月) を基準とした計算例</p>
                <p>※ 実際の料金は、リージョン、インスタンスタイプ、利用時間により異なります</p>
              </div>
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 bg-secondary-100 px-6 py-4 flex justify-end rounded-b-xl border-t border-secondary-200">
              <button
                onClick={() => setIsOpen(false)}
                className="px-6 py-2 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition shadow-sm"
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
