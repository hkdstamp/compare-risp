import { NextRequest, NextResponse } from 'next/server'
import { pricingCatalog, defaultResources } from '@/lib/pricing-catalog'
import { calculateInsurancePlan, calculateStandardPlan, calculateCumulativeCosts, mergeDetails } from '@/lib/simulator'
import { SimulationParams, SimulationResult, ResourceConfig } from '@/lib/types'

export async function POST(request: NextRequest) {
  try {
    const body: SimulationParams = await request.json()
    
    const {
      insurance = '1y',
      standard_term = '1yr',
      standard_option = 'NoUpfront',
      coverage = 1.0,
      usage = 1.0,
      user_id,
      save_history = false,
      resources: customResources
    } = body

    // Validate parameters
    if (coverage < 0 || coverage > 1) {
      return NextResponse.json(
        { error: 'Coverage must be between 0 and 1' },
        { status: 400 }
      )
    }
    
    if (usage < 0 || usage > 1) {
      return NextResponse.json(
        { error: 'Usage must be between 0 and 1' },
        { status: 400 }
      )
    }

    const hours = pricingCatalog.metadata.hours_per_month
    
    // Use custom resources if provided, otherwise use default
    const baseResources = customResources && customResources.length > 0 ? customResources : defaultResources
    
    // Validate resources exist in pricing catalog
    for (const res of baseResources) {
      if (!pricingCatalog.resources[res.service]) {
        return NextResponse.json(
          { error: `Unknown service: ${res.service}` },
          { status: 400 }
        )
      }
      if (!pricingCatalog.resources[res.service][res.instance]) {
        return NextResponse.json(
          { error: `Unknown instance type: ${res.instance} for service ${res.service}` },
          { status: 400 }
        )
      }
      if (res.quantity < 1 || res.quantity > 100) {
        return NextResponse.json(
          { error: 'Quantity must be between 1 and 100' },
          { status: 400 }
        )
      }
    }
    
    // Create resources with usage and coverage
    const resources: ResourceConfig[] = baseResources.map(res => ({
      ...res,
      usage,
      coverage
    }))

    // Calculate baseline cost
    let baselineCost = 0
    for (const res of resources) {
      const onDemandRate = pricingCatalog.resources[res.service][res.instance].on_demand_hourly_usd
      baselineCost += onDemandRate * hours * res.quantity * usage
    }

    // Calculate standard plan first to get term duration
    const termMonths = standard_term === '1yr' ? 12 : 36
    
    // Calculate standard plan
    const { result: standardResult, details: standardDetails } = calculateStandardPlan(
      pricingCatalog,
      resources,
      standard_term,
      standard_option,
      coverage,
      usage,
      hours
    )

    // Calculate insurance plan (using standard term for break-even calculation)
    const { result: insuranceResult, details: insuranceDetails } = calculateInsurancePlan(
      pricingCatalog,
      resources,
      insurance,
      coverage,
      usage,
      hours,
      termMonths
    )

    // Calculate cumulative costs with term duration
    const cumulativeData = calculateCumulativeCosts(baselineCost, insuranceResult, standardResult, termMonths)

    // Merge details
    const details = mergeDetails(insuranceDetails, standardDetails)

    const response: SimulationResult = {
      baseline_cost: baselineCost,
      insurance: insuranceResult,
      standard: standardResult,
      cumulative: cumulativeData,
      details
    }

    // TODO: Save to D1 database if save_history is true and user_id is provided
    // This would require Cloudflare Workers environment

    return NextResponse.json(response)
  } catch (error) {
    console.error('Simulation error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}
