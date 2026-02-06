export const translations = {
  ja: {
    // Header
    title: "Ripple コミットメント保証 収益シミュレーター",
    subtitle: "Ripple/Wave向けコスト最適化・収益モデル分析ツール",

    // Config
    settings: "シミュレーション設定",
    discountDetails: "割引率の詳細",
    
    // Labels
    planLabel: "コミットメント保証プラン",
    termLabel: "標準RI/SP 契約期間",
    typeLabel: "標準RI/SP タイプ",
    coverageLabel: "想定カバレッジ",
    uptimeLabel: "想定利用率",
    
    // Hints
    warrantyHint: "保証期間終了後、Savingsの損失分は返金",
    coverageHint: "リソース全体の何%をRI/SPでカバーするか",
    uptimeHint: "リソースの実稼働率",
    
    // Buttons
    simulate: "シミュレーション実行",
    calculating: "計算中...",
    reset: "リセット",
    addResource: "リソース追加",

    // Options
    warranty30d: "30日保証 (40%割引 / 50%リスクプレミアム料)",
    warranty1y: "1年保証 (40%割引 / 33%リスクプレミアム料)",
    term1yr: "1年予約",
    term3yr: "3年予約",
    optionNoUpfront: "RI - NoUpfront (全額後払い)",
    optionPartialUpfront: "RI - PartialUpfront (50%前払い)",
    optionAllUpfront: "RI - AllUpfront (100%前払い)",
    optionComputeSP: "SP - Compute Savings Plan",
    optionEC2SP: "SP - EC2 Savings Plan",
    
    // Optgroups
    ri: "Reserved Instance (RI)",
    sp: "Savings Plans (SP)",

    // Resource Selector
    resourceTitle: "シミュレーション対象リソース (東京リージョン)",
    addResourceBtn: "リソース追加",
    service: "サービス",
    instanceType: "インスタンスタイプ",
    quantity: "台数",
    totalResources: "合計リソース数",
    units: "台",
    serviceTypes: "サービス種類",
    types: "種類",
    resourceHint: "リソース選択のヒント",
    hint1: "予約可能なAWSサービス（EC2、RDS、ElastiCache）を選択できます",
    hint2: "複数のインスタンスタイプを組み合わせてシミュレーション可能",
    hint3: "台数は1〜100台まで指定できます",
    hint4: "最低1つのリソースが必要です",

    // Warning
    importantNote: "重要な注意事項",
    noteContent: "対象リソースのサービスに対応する標準RI/SPが１年契約のみの場合、１年保証のコミットメント保証は提供されません。本シミュレーションでは考慮していないため、ご留意ください。",

    // Cost Cards
    onDemandCost: "通常価格 (On-Demand)",
    monthlyCost: "月額コスト",
    commitmentWarranty: "コミットメント保証",
    includesOnDemandNote: "※ 適用されない分のオンデマンドコストを含みます",
    monthlySavings: "月間削減額",
    costSavings: "コスト削減",
    effectiveSavings: "実質削減",
    expectedRefund: "返金見込",
    riskPremium: "リスクプレミアム料",
    initialCost: "初期コスト",
    breakEven: "損益分岐",
    paybackPeriod: "コスト回収期間",
    standardRiSp: "標準RI/SP",
    savingsAmount: "削減額",
    months: "ヶ月",

    // Revenue Highlight
    mspGrossProfitWarranty: "MSP想定粗利 (コミットメント保証)",
    mspGrossProfitStandard: "MSP想定粗利 (標準RI/SP)",
    profitDiff: "収益差額 (保証 vs 標準)",
    warrantyBetter: "(保証が有利)",
    standardBetter: "(標準が有利)",
    monthly: "月",

    // Charts
    monthlyCostComparison: "月次コスト比較",
    cumulativeCostTrend: "累積コスト推移",
    contractTerm: "契約期間",
    contract1Year: "1年",
    contract3Year: "3年",
    graphLegend: "グラフの見方",
    legendSolid: "実線",
    legendSolidDesc: ": 累積ランニングコスト（月々の利用料金の合計）",
    legendDashed: "破線（総支出）",
    legendDashedDesc: ": 契約期間全体の総支出額（初期費用 + 全期間の月額料金合計）を各月で表示",
    legendBreakEven: "標準RI/SPの破線が通常価格の実線と交差する点が<strong>損益分岐点</strong>です",
    legendXAxis: "横軸は標準RI/SPの契約期間に合わせて表示されます",
    breakEvenPoint: "損益分岐点",
    costUsd: "コスト (USD)",
    elapsedMonths: "経過月数",
    cumulativeCostUsd: "累積コスト (USD)",
    cumulativeLabel: "（累積）",
    totalExpenditureLabel: "（総支出）",
    breakEvenPointLabel: " 損益分岐点",

    // Details Table
    resourceBreakdown: "リソース別詳細内訳",
    resource: "リソース",
    warrantyInitialCost: "保証初期コスト",
    warrantySavings: "保証削減額",
    standardInitialCost: "標準初期コスト",
    standardSavings: "標準削減額",

    // Customer Comparison
    costReductionComparison: "コスト削減効果の比較",
    effectiveCost: "実効コスト",
    reductionRate: "削減率",
    recommended: "おすすめ",
    initialFee: "初期費用",
    warrantyAdvantage: "コミットメント保証の優位性",
    comparedToStandard: "標準RI/SPと比較して",
    cheaper: "お得",
    moreExpensive: "高い",
    initialCostDiff: "初期費用の差",
    notRequired: "不要",
    warrantyFeatures: "コミットメント保証の特徴",
    featureZeroUpfront: "• 初期費用ゼロで導入可能",
    featureRefund: "• Savingsの損失に応じて返金あり",
    featureFlexibleTerm: "• 柔軟な契約期間（30日/1年）",
    featureHighSavings: "• 高いコスト削減効果",

    // Revenue Forecast
    revenueForecastReport: "収益見込みレポート",
    revenueForecastDesc0to20: "想定カバレッジ 0%～20% 範囲での収益予測（3年契約RI/SP付帯前提）",
    revenueForecastDesc80to100: "想定カバレッジ 80%～100% 範囲での収益予測（3年契約RI/SP付帯前提）",
    revenueForecastDescPlusMinus10: "想定カバレッジ ±10% 範囲での収益予測（3年契約RI/SP付帯前提）",
    calculationConditions: "計算条件",
    conditionCoverage0: "想定カバレッジ0%の場合: 0%～20%の範囲で計算",
    conditionCoverage100: "想定カバレッジ100%の場合: 80%～100%の範囲で計算",
    conditionCoveragePlusMinus: "設定した想定カバレッジから±10%の範囲で計算",
    conditionRevenueFormula: "レベニュー = リスクプレミアム料 × 20%",
    conditionRevenueZero: "リスクプレミアム料が0の場合、レベニューも0",
    condition3Year: "3年契約RI/SP付帯前提での36ヶ月計算",
    conditionRefundDeduction: "3年間の返金見込みは保証期間分を減額（30日保証:1ヶ月分、1年保証:12ヶ月分）",
    
    // Forecast Table Headers
    headerCoverage: "想定カバレッジ",
    headerWarrantyMonthly: "コミットメント保証\n月額",
    headerRiskPremiumMonthly: "リスクプレミアム料\n(月額)",
    headerRefundMonthly: "返金見込\n(月額)",
    headerRevenueMonthly: "レベニュー\n(月額)",
    headerRevenue12Months: "レベニュー\n(12ヶ月)",
    headerRefund3Years: "3年間\n返金見込",
    headerRevenue36Months: "レベニュー\n(36ヶ月)",
    
    // Forecast Table Body/Footer
    current: "現在",
    totalRange: "合計範囲",
    
    // Forecast Notes
    noteRevenueFormula: "※ レベニュー = リスクプレミアム料 × 20%",
    noteRevenueZero: "※ リスクプレミアム料が0の場合、レベニューも0として計算されます",
    noteTotalCalc: "※ 12ヶ月合計は月額の12倍、36ヶ月合計は12ヶ月合計の3倍で計算",
    noteRefundDeduction: "※ 3年間の返金見込みは、保証期間分を減額（30日保証: 1ヶ月分減額、1年保証: 12ヶ月分減額）",
    noteHighlight: "※ 背景色が強調されている行が現在の設定値です",

    // Footer
    footerRights: "© 2025 Alphaus Cloud Group - MSPコスト最適化プラットフォーム"
  },
  en: {
    // Header
    title: "Ripple Guaranteed Commitment Revenue Simulator",
    subtitle: "Cost Optimization & Revenue Analysis Tool for Ripple/Wave",

    // Config
    settings: "Simulation Settings",
    discountDetails: "Discount Details",
    
    // Labels
    planLabel: "Guaranteed Commitment Plan",
    termLabel: "Standard RI/SP Term",
    typeLabel: "Standard RI/SP Type",
    coverageLabel: "Estimated Coverage",
    uptimeLabel: "Estimated Utilization Rate",
    
    // Hints
    warrantyHint: "After the warranty period expires, any lost savings will be refunded.",
    coverageHint: "Percentage of resources covered by RI/SP",
    uptimeHint: "Estimated resource utilization rate",
    
    // Buttons
    simulate: "Run Simulation",
    calculating: "Calculating...",
    reset: "Reset",
    addResource: "Add Resource",

    // Options
    warranty30d: "30-Day Guarantee (40% Disc. / 50% Premium)",
    warranty1y: "1-Year Guarantee (40% Disc. / 33% Premium)",
    term1yr: "1 Year Reservation",
    term3yr: "3 Year Reservation",
    optionNoUpfront: "RI - No Upfront",
    optionPartialUpfront: "RI - Partial Upfront",
    optionAllUpfront: "RI - All Upfront",
    optionComputeSP: "SP - Compute Savings Plan",
    optionEC2SP: "SP - EC2 Savings Plan",
    
    // Optgroups
    ri: "Reserved Instance (RI)",
    sp: "Savings Plans (SP)",

    // Resource Selector
    resourceTitle: "Simulation Target Resources (Tokyo Region)",
    addResourceBtn: "Add Resource",
    service: "Service",
    instanceType: "Instance Type",
    quantity: "Number of Units",
    totalResources: "Total Resources",
    units: "units",
    serviceTypes: "Service Types",
    types: "types",
    resourceHint: "Resource Selection Hints",
    hint1: "Select from reservable AWS services (EC2, RDS, ElastiCache)",
    hint2: "Combine multiple instance types for simulation",
    hint3: "Specify between 1 to 100 units",
    hint4: "At least one resource is required",

    // Warning
    importantNote: "Important Note",
    noteContent: "If the standard RI/SP corresponding to the target resource service is only available for a 1-year term, the 1-year Guaranteed Commitment is not provided. Please note that this simulation does not account for this limitation.",

    // Cost Cards
    onDemandCost: "On-Demand Price",
    monthlyCost: "Monthly Cost",
    commitmentWarranty: "Guaranteed Commitment Price",
    includesOnDemandNote: "* Includes uncovered on-demand costs",
    monthlySavings: "Savings",
    costSavings: "Cost Savings",
    effectiveSavings: "Effective Savings",
    expectedRefund: "Estimated Refund",
    riskPremium: "Risk Premium",
    initialCost: "Initial Cost",
    breakEven: "Break Even",
    paybackPeriod: "Payback Period",
    standardRiSp: "Standard RI/SP Cost",
    savingsAmount: "Savings",
    months: "mo",

    // Revenue Highlight
    mspGrossProfitWarranty: "MSP Estimated Gross Profit (Guaranteed Commitment)",
    mspGrossProfitStandard: "MSP Estimated Gross Profit (Standard Commitment)",
    profitDiff: "Revenue Difference (Guaranteed vs Standard)",
    warrantyBetter: "(Guaranteed Commitment is better)",
    standardBetter: "(Standard is better)",
    monthly: "/ month",

    // Charts
    monthlyCostComparison: "Monthly Cost Comparison",
    cumulativeCostTrend: "Cumulative Cost Trend",
    contractTerm: "Term",
    contract1Year: "1 Year",
    contract3Year: "3 Years",
    graphLegend: "Legend",
    legendSolid: "Solid Line",
    legendSolidDesc: ": Cumulative Running Cost (Total Monthly Usage fees)",
    legendDashed: "Dashed Line (Total Expenditure)",
    legendDashedDesc: ": Shows total expenditure (Initial Fee + Total Monthly Fee for the entire term) for each month",
    legendBreakEven: "The <strong>break-even point</strong> is where the dashed line for standard RI/SP intersects with the solid line for regular price.",
    legendXAxis: "The horizontal axis corresponds to the standard RI/SP contract period (1 year).",
    breakEvenPoint: "Break-Even Point",
    costUsd: "Cost (USD)",
    elapsedMonths: "Months Elapsed",
    cumulativeCostUsd: "Cumulative Cost (USD)",
    cumulativeLabel: " (Cumulative)",
    totalExpenditureLabel: " (Total)",
    breakEvenPointLabel: " Break-Even Point",
    
    // Details Table
    resourceBreakdown: "Detailed Breakdown by Resource",
    resource: "Resource",
    warrantyInitialCost: "Guaranteed Commitment Initial Cost",
    warrantySavings: "Guaranteed Commitment Savings",
    standardInitialCost: "Standard Commitment Initial Cost",
    standardSavings: "Standard Commitment Savings",

    // Customer Comparison
    costReductionComparison: "Cost Reduction Comparison",
    effectiveCost: "Effective Cost",
    reductionRate: "Reduction Rate",
    recommended: "Recommended",
    initialFee: "Initial Fee",
    warrantyAdvantage: "Advantage of Guaranteed Commitment",
    comparedToStandard: "Compared to Standard RI/SP",
    cheaper: "cheaper",
    moreExpensive: "more expensive",
    initialCostDiff: "Initial Cost Difference",
    notRequired: "Not Required",
    warrantyFeatures: "Features of Guaranteed Commitment",
    featureZeroUpfront: "• No upfront cost required",
    featureRefund: "• Refunds for unused Savings",
    featureFlexibleTerm: "• Flexible terms (30 days / 1 year)",
    featureHighSavings: "• High cost savings",

    // Revenue Forecast
    revenueForecastReport: "Projected Revenue Report",
    revenueForecastDesc0to20: "Projected Revenue for 0-20% Coverage (Assuming 3-year RI/SP)",
    revenueForecastDesc80to100: "Projected Revenue for 80-100% Coverage (Assuming 3-year RI/SP)",
    revenueForecastDescPlusMinus10: "Projected Revenue for ±10% Coverage (Assuming 3-year RI/SP)",
    calculationConditions: "Calculation Conditions",
    conditionCoverage0: "0% Coverage: Calculated for 0-20% range",
    conditionCoverage100: "In the case of an assumed coverage of 100%, the calculation is made within the range of 80% to 100%.",
    conditionCoveragePlusMinus: "Calculated for range ±10% from current coverage",
    conditionRevenueFormula: "Revenue = Risk Premium × 20%",
    conditionRevenueZero: "If Risk Premium is 0, Revenue is 0",
    condition3Year: "36-month calculation based on a 3-year contract with RI/SP included",
    conditionRefundDeduction: "The expected refund for a 3-year period will be reduced by the amount of the warranty period (30-day: 1mo, 1-year: 12mo)",
    
    // Forecast Table Headers
    headerCoverage: "Expected\nCoverage",
    headerWarrantyMonthly: "Guaranteed Commitment\nMonthly Cost",
    headerRiskPremiumMonthly: "Risk Premium\n(Monthly)",
    headerRefundMonthly: "Estimated Refund\n(Monthly)",
    headerRevenueMonthly: "Estimated Revenue\n(Monthly)",
    headerRevenue12Months: "Estimated Revenue\n(12 Months)",
    headerRefund3Years: "Estimated Refund\n(3 Years)",
    headerRevenue36Months: "Estimated Revenue\n(36 Months)",
    
    // Forecast Table Body/Footer
    current: "Current",
    totalRange: "Total Range",
    
    // Forecast Notes
    noteRevenueFormula: "* Revenue = Risk Premium × 20%",
    noteRevenueZero: "* If Risk Premium is 0, Revenue is treated as 0",
    noteTotalCalc: "* The total for 12 months is calculated as 12 times the monthly amount, and the total for 36 months is calculated as 3 times the total for 12 months.",
    noteRefundDeduction: "* The expected refund for a 3-year period will be reduced by the amount of the warranty period (30-day: -1mo, 1-year: -12mo)",
    noteHighlight: "* Highlighted row indicates current settings",

    // Footer
    footerRights: "© 2025 Alphaus Cloud Group - MSP Cost Optimization Platform"
  }
};

export type Language = 'ja' | 'en';
export type TranslationKey = keyof typeof translations.ja;
