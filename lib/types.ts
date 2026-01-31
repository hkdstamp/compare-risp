// Simulation types
export interface ResourceConfig {
  service: string
  instance: string
  quantity: number
  usage?: number
  coverage?: number
}

export interface PlanResult {
  name: string
  monthly_cost: number
  monthly_savings: number
  monthly_cash_savings?: number
  initial_cost: number
  premium: number
  expected_refund?: number
  break_even_months: number | null
}

export interface SimulationParams {
  insurance: string
  standard_term: string
  standard_option: string
  coverage: number
  usage: number
  user_id?: string
  save_history?: boolean
  resources?: ResourceConfig[]
}

export interface SimulationResult {
  baseline_cost: number
  insurance: PlanResult
  standard: PlanResult
  cumulative: CumulativeData
  details: DetailItem[]
  simulation_id?: string
  coverage?: number  // 想定カバレッジ (0-1)
}

// Revenue Forecast types
export interface RevenueForecastItem {
  coverage: number        // カバレッジ (%)
  monthly_cost: number    // 月額コスト
  premium: number         // リスクプレミアム料
  expected_refund: number // 返金見込み
  revenue: number         // レベニュー (リスクプレミアム料の30%)
  total_12months: {       // 12ヶ月合計
    monthly_cost: number
    premium: number
    expected_refund: number
    revenue: number
  }
  total_36months: {       // 36ヶ月合計（3年間）
    monthly_cost: number
    premium: number
    expected_refund_3years: number  // 3年間の返金見込（保険期間分を減額）
    revenue: number
  }
}

export interface CumulativeData {
  months: number[]
  on_demand: number[]
  insurance: number[]
  standard: number[]
}

export interface DetailItem {
  resource: string
  baseline_cost: number
  insurance_cost: number
  insurance_premium: number
  insurance_savings: number
  insurance_expected_refund: number
  standard_cost: number
  standard_upfront: number
  standard_savings: number
}

// Pricing types
export interface PricingCatalog {
  metadata: {
    region: string
    hours_per_month: number
  }
  resources: {
    [service: string]: {
      [instance: string]: {
        on_demand_hourly_usd: number
        standard_ri: {
          [term: string]: {
            [option: string]: {
              hourly_usd: number
              upfront_usd: number
            }
          }
        }
        savings_plans?: {
          [term: string]: {
            hourly_usd: number
          }
        }
        ec2_savings_plans?: {
          [term: string]: {
            hourly_usd: number
          }
        }
      }
    }
  }
  insurance_plans: {
    [key: string]: InsurancePlan
  }
}

export interface InsurancePlan {
  name: string
  discount_rate: number
  premium_rate: number
  term_months: number
}

// History types
export interface SimulationHistory {
  id: string
  user_id: string
  insurance_plan: string
  standard_term: string
  standard_option: string
  coverage: number
  usage: number
  baseline_cost: number
  insurance_cost: number
  insurance_savings: number
  insurance_premium: number
  standard_cost: number
  standard_savings: number
  standard_upfront: number
  insurance_break_even: number | null
  standard_break_even: number | null
  revenue_diff: number
  created_at: number
}

// Config types
export interface SavedConfig {
  id: string
  user_id: string
  name: string
  description: string
  insurance_plan: string
  standard_term: string
  standard_option: string
  coverage: number
  usage: number
  is_default: number
  created_at: number
  updated_at: number
}
