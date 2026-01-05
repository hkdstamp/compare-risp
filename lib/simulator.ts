import { PricingCatalog, ResourceConfig, PlanResult, DetailItem, CumulativeData } from './types'

export function calculateInsurancePlan(
  catalog: PricingCatalog,
  resources: ResourceConfig[],
  insuranceKey: string,
  coverage: number,
  usage: number,
  hours: number,
  standardTermMonths: number
): { result: PlanResult; details: DetailItem[] } {
  const plan = catalog.insurance_plans[insuranceKey]
  let totalBaseline = 0
  let totalMonthlyCost = 0
  let totalPremium = 0
  const details: DetailItem[] = []

  let totalExpectedRefund = 0

  for (const res of resources) {
    const onDemandRate = catalog.resources[res.service][res.instance].on_demand_hourly_usd
    const coverageQty = res.quantity * coverage
    const remainingQty = Math.max(res.quantity - coverageQty, 0)

    const baseline = onDemandRate * hours * res.quantity * usage
    const discountedUsageCost = onDemandRate * hours * coverageQty * usage * (1.0 - plan.discount_rate)
    const premiumBase = onDemandRate * hours * coverageQty * plan.discount_rate
    const premium = premiumBase * plan.premium_rate
    const remainingCost = onDemandRate * hours * remainingQty * usage
    
    // Initial monthly cost calculation (with premium)
    const monthlyCostWithPremium = discountedUsageCost + premium + remainingCost

    // Calculate expected refund
    // New logic:
    // 1. Unapplied portions are refundable only when coverage is 0%
    // 2. For coverage > 0%, refunds apply when savings difference is negative
    //    - Compare actual savings vs 100% coverage savings
    //    - If actual savings is less (negative difference), refund compensates the gap
    // 3. Subtract base savings from calculated refund; if result is negative, refund = 0
    
    const premiumAt100Coverage = onDemandRate * hours * res.quantity * plan.discount_rate * plan.premium_rate
    let expectedRefund = 0
    
    if (coverage === 0) {
      // When coverage is 0%, all unapplied portions are refundable
      expectedRefund = premiumAt100Coverage - premium
    } else {
      // When coverage > 0%, calculate based on savings difference
      // Calculate savings at actual coverage (with premium)
      const actualSavings = baseline - monthlyCostWithPremium
      
      // Calculate savings at 100% coverage
      const discountedAt100 = onDemandRate * hours * res.quantity * usage * (1.0 - plan.discount_rate)
      const costAt100 = discountedAt100 + premiumAt100Coverage
      const savingsAt100 = baseline - costAt100
      
      // If actual savings is less than 100% savings (negative difference), calculate refund
      const savingsDiff = actualSavings - savingsAt100
      if (savingsDiff < 0) {
        // Initial refund compensates the negative difference
        const initialRefund = -savingsDiff
        
        // Subtract base savings (actualSavings) from refund
        // If result is negative, refund = 0
        expectedRefund = Math.max(0, initialRefund - actualSavings)
      }
    }
    
    // Final monthly cost: if refund occurs, premium = 0
    const monthlyCost = expectedRefund > 0 
      ? discountedUsageCost + remainingCost  // Premium = 0 when refund exists
      : monthlyCostWithPremium                // Premium included when no refund

    details.push({
      resource: `${res.service}:${res.instance}`,
      baseline_cost: baseline,
      insurance_cost: monthlyCost,
      insurance_premium: premium,
      insurance_savings: baseline - monthlyCost,
      insurance_expected_refund: expectedRefund,
      standard_cost: 0,
      standard_upfront: 0,
      standard_savings: 0
    })

    totalBaseline += baseline
    totalMonthlyCost += monthlyCost
    totalPremium += premium
    totalExpectedRefund += expectedRefund
  }

  const monthlySavings = totalBaseline - totalMonthlyCost
  
  // Effective savings including expected refund
  const effectiveMonthlySavings = monthlySavings + totalExpectedRefund

  // Insurance RI/SP break-even calculation
  // IMPORTANT: Use the STANDARD RI/SP contract term (not insurance plan's term)
  // because we compare insurance costs over the same period as standard RI/SP
  // Total Expenditure = 0 (no initial) + (monthly_cost × standard_term_months)
  // Break-even: when on-demand cumulative >= total expenditure
  let breakEven = null
  if (monthlySavings > 0) {
    const totalExpenditure = 0 + (totalMonthlyCost * standardTermMonths)
    
    // Break-even = when on-demand cumulative exceeds this fixed total
    breakEven = Math.ceil(totalExpenditure / totalBaseline)
    
    // If break-even is beyond contract term, no break-even
    if (breakEven > standardTermMonths) {
      breakEven = null
    }
  }

  return {
    result: {
      name: `Insurance RI/SP ${plan.name}`,
      monthly_cost: totalMonthlyCost,
      monthly_savings: effectiveMonthlySavings,
      initial_cost: 0,
      premium: totalPremium,
      expected_refund: totalExpectedRefund,
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
      insurance_expected_refund: 0,
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
  
  // Calculate break-even point: the month when on-demand cumulative exceeds TOTAL expenditure
  // 
  // IMPORTANT: Total Expenditure is a FIXED value (the horizontal dashed line in graph)
  // Total Expenditure = initial_cost + (monthly_cost × term_months)
  // 
  // In the graph:
  // - Dashed line (RI/SP total expenditure) = initial_cost + (monthly_cost × termMonths) [FIXED]
  // - Solid grey line (on-demand cumulative) = baseline_cost × N [INCREASES each month]
  // 
  // Break-even: The first month when on-demand cumulative ≥ TOTAL expenditure
  // This is when: baseline_cost × N ≥ initial_cost + (monthly_cost × termMonths)
  // 
  // Solving for N:
  //   N ≥ (initial_cost + monthly_cost × termMonths) / baseline_cost
  //   N ≥ total_expenditure / baseline_cost
  //
  // Therefore: N = ceil(total_expenditure / baseline_cost)
  //
  // This is the month when you START saving money (on-demand becomes more expensive than total)
  let breakEven = null
  if (monthlySavings > 0) {
    // Calculate total expenditure for the entire contract term
    const totalExpenditure = totalInitialCost + (totalMonthlyEffective * termMonths)
    
    // Break-even = when on-demand cumulative exceeds this fixed total
    breakEven = Math.ceil(totalExpenditure / totalBaseline)
    
    // If break-even is beyond contract term, it means you never break even
    if (breakEven > termMonths) {
      breakEven = null
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
