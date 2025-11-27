import { PricingCatalog, ResourceConfig, PlanResult, DetailItem, CumulativeData } from './types'

export function calculateInsurancePlan(
  catalog: PricingCatalog,
  resources: ResourceConfig[],
  insuranceKey: string,
  coverage: number,
  usage: number,
  hours: number
): { result: PlanResult; details: DetailItem[] } {
  const plan = catalog.insurance_plans[insuranceKey]
  let totalBaseline = 0
  let totalMonthlyCost = 0
  let totalPremium = 0
  const details: DetailItem[] = []

  for (const res of resources) {
    const onDemandRate = catalog.resources[res.service][res.instance].on_demand_hourly_usd
    const coverageQty = res.quantity * coverage
    const remainingQty = Math.max(res.quantity - coverageQty, 0)

    const baseline = onDemandRate * hours * res.quantity * usage
    const discountedUsageCost = onDemandRate * hours * coverageQty * usage * (1.0 - plan.discount_rate)
    const premiumBase = onDemandRate * hours * coverageQty * plan.discount_rate
    const premium = premiumBase * plan.premium_rate
    const remainingCost = onDemandRate * hours * remainingQty * usage
    const monthlyCost = discountedUsageCost + premium + remainingCost

    details.push({
      resource: `${res.service}:${res.instance}`,
      baseline_cost: baseline,
      insurance_cost: monthlyCost,
      insurance_premium: premium,
      insurance_savings: baseline - monthlyCost,
      standard_cost: 0,
      standard_upfront: 0,
      standard_savings: 0
    })

    totalBaseline += baseline
    totalMonthlyCost += monthlyCost
    totalPremium += premium
  }

  const monthlySavings = totalBaseline - totalMonthlyCost

  // Insurance RI/SP has no initial cost, so break-even is immediate if there are savings
  let breakEven = null
  if (monthlySavings > 0) {
    breakEven = 1  // Immediate break-even (no upfront cost)
  }

  return {
    result: {
      name: `Insurance RI/SP ${plan.name}`,
      monthly_cost: totalMonthlyCost,
      monthly_savings: monthlySavings,
      initial_cost: 0,
      premium: totalPremium,
      break_even_months: breakEven
    },
    details
  }
}

export function calculateStandardPlan(
  catalog: PricingCatalog,
  resources: ResourceConfig[],
  term: string,
  option: string,
  coverage: number,
  usage: number,
  hours: number
): { result: PlanResult; details: DetailItem[] } {
  let totalBaseline = 0
  let totalMonthlyEffective = 0
  let totalMonthlyCashSavings = 0
  let totalInitialCost = 0
  const details: DetailItem[] = []

  const termMonths = term === '1yr' ? 12 : 36

  // Check if this is a Savings Plan
  const isSavingsPlan = option === 'SavingsPlan'

  for (const res of resources) {
    const resourcePricing = catalog.resources[res.service][res.instance]
    const onDemandRate = resourcePricing.on_demand_hourly_usd

    let reservedRate: number
    let upfront: number

    if (isSavingsPlan) {
      // Use Savings Plans pricing
      if (!resourcePricing.savings_plans || !resourcePricing.savings_plans[term]) {
        // Fallback to RI NoUpfront if SP not available
        const plan = resourcePricing.standard_ri[term]['NoUpfront']
        reservedRate = plan.hourly_usd
        upfront = 0
      } else {
        reservedRate = resourcePricing.savings_plans[term].hourly_usd
        upfront = 0  // Savings Plans have no upfront payment
      }
    } else {
      // Use Reserved Instance pricing
      const plan = resourcePricing.standard_ri[term][option]
      reservedRate = plan.hourly_usd
      upfront = plan.upfront_usd
    }

    const coverageQty = res.quantity * coverage
    const remainingQty = Math.max(res.quantity - coverageQty, 0)

    const baseline = onDemandRate * hours * res.quantity * usage
    const reservedMonthlyRecurring = reservedRate * hours * coverageQty * usage
    const reservedMonthlyAmortized = (upfront * coverageQty) / termMonths
    const reservedMonthlyEffective = reservedMonthlyRecurring + reservedMonthlyAmortized
    const remainingMonthlyCost = onDemandRate * hours * remainingQty * usage
    const monthlyEffective = reservedMonthlyEffective + remainingMonthlyCost
    const monthlyCash = baseline - (reservedMonthlyRecurring + remainingMonthlyCost)

    details.push({
      resource: `${res.service}:${res.instance}`,
      baseline_cost: baseline,
      insurance_cost: 0,
      insurance_premium: 0,
      insurance_savings: 0,
      standard_cost: monthlyEffective,
      standard_upfront: upfront * coverageQty,
      standard_savings: baseline - monthlyEffective
    })

    totalBaseline += baseline
    totalMonthlyEffective += monthlyEffective
    totalMonthlyCashSavings += monthlyCash
    totalInitialCost += upfront * coverageQty
  }

  const monthlySavings = totalBaseline - totalMonthlyEffective
  
  // Calculate break-even point: the month when on-demand cumulative cost exceeds total expenditure
  // 
  // In the graph:
  // - Dashed line (RI/SP total expenditure) = initial_cost + (monthly_cost × N)
  // - Solid grey line (on-demand cumulative) = baseline_cost × N
  // 
  // Break-even: The first month when on-demand cumulative ≥ RI/SP total expenditure
  // This is when: baseline_cost × N ≥ initial_cost + (monthly_cost × N)
  // 
  // Rearranging:
  //   baseline_cost × N - monthly_cost × N ≥ initial_cost
  //   (baseline_cost - monthly_cost) × N ≥ initial_cost
  //   monthly_savings × N ≥ initial_cost
  //   N ≥ initial_cost / monthly_savings
  //
  // Therefore: N = ceil(initial_cost / monthly_savings)
  //
  // This is the month when you START saving money (on-demand becomes more expensive)
  let breakEven = null
  if (monthlySavings > 0) {
    if (totalInitialCost > 0) {
      // With initial cost: calculate the month when on-demand cumulative exceeds total expenditure
      breakEven = Math.ceil(totalInitialCost / monthlySavings)
    } else {
      // No initial cost (e.g., Savings Plans, NoUpfront): 
      // Total expenditure is always lower than on-demand from month 1
      breakEven = 1
    }
  }

  // Create plan name
  let planName: string
  if (isSavingsPlan) {
    planName = `Compute Savings Plan ${term === '1yr' ? '1年' : '3年'}`
  } else {
    planName = `Standard RI ${term} ${option}`
  }

  return {
    result: {
      name: planName,
      monthly_cost: totalMonthlyEffective,
      monthly_savings: monthlySavings,
      initial_cost: totalInitialCost,
      premium: 0,
      break_even_months: breakEven
    },
    details
  }
}

export function calculateCumulativeCosts(
  baselineCost: number,
  insuranceResult: PlanResult,
  standardResult: PlanResult,
  termMonths: number = 12
): CumulativeData {
  const cumulative: CumulativeData = {
    months: [],
    on_demand: [],
    insurance: [],
    standard: []
  }

  for (let month = 1; month <= termMonths; month++) {
    cumulative.months.push(month)
    cumulative.on_demand.push(baselineCost * month)
    cumulative.insurance.push(insuranceResult.monthly_cost * month)
    cumulative.standard.push(standardResult.monthly_cost * month)
  }

  return cumulative
}

export function mergeDetails(insuranceDetails: DetailItem[], standardDetails: DetailItem[]): DetailItem[] {
  return insuranceDetails.map((insDetail, index) => ({
    ...insDetail,
    standard_cost: standardDetails[index].standard_cost,
    standard_upfront: standardDetails[index].standard_upfront,
    standard_savings: standardDetails[index].standard_savings
  }))
}
