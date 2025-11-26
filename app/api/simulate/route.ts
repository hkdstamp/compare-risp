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
      save_history = false
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
    
    // Create resources with usage and coverage
    const resources: ResourceConfig[] = defaultResources.map(res => ({
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

    // Calculate insurance plan
    const { result: insuranceResult, details: insuranceDetails } = calculateInsurancePlan(
      pricingCatalog,
      resources,
      insurance,
      coverage,
      usage,
      hours
    )

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

    // Calculate cumulative costs
    const cumulativeData = calculateCumulativeCosts(baselineCost, insuranceResult, standardResult)

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
