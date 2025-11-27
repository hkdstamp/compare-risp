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

  return {
    result: {
      name: `Insurance RI/SP ${plan.name}`,
      monthly_cost: totalMonthlyCost,
      monthly_savings: monthlySavings,
      initial_cost: 0,
      premium: totalPremium,
      break_even_months: monthlySavings > 0 ? 1 : null
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
  let breakEven = null
  if (totalInitialCost > 0 && totalMonthlyCashSavings > 0) {
    breakEven = Math.ceil(totalInitialCost / totalMonthlyCashSavings)
  } else if (totalInitialCost === 0 && monthlySavings > 0) {
    // For Savings Plans (no upfront), break-even is immediate
    breakEven = 1
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
