'use client'

import { SimulationResult, ResourceConfig } from '@/lib/types'
import { formatCurrency } from '@/lib/utils'
import CostCards from './ui/CostCards'
import RevenueHighlight from './ui/RevenueHighlight'
import CumulativeChart from './ui/CumulativeChart'
import MonthlyChart from './ui/MonthlyChart'
import DetailsTable from './ui/DetailsTable'
import RevenueForecastReport from './ui/RevenueForecastReport'

interface SimulationResultsProps {
  result: SimulationResult
  insurancePlanKey: string
  usage: number
  resources: ResourceConfig[]
}

export default function SimulationResults({ result, insurancePlanKey, usage, resources }: SimulationResultsProps) {
  const revenueDiff = result.insurance.monthly_savings - result.standard.monthly_savings

  return (
    <section className="space-y-6 animate-fadeIn">
      <CostCards
        baselineCost={result.baseline_cost}
        insurance={result.insurance}
        standard={result.standard}
      />

      <RevenueHighlight
        insuranceSavings={result.insurance.monthly_savings}
        standardSavings={result.standard.monthly_savings}
        revenueDiff={revenueDiff}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CumulativeChart 
          cumulative={result.cumulative}
          standardPlan={result.standard}
          insurancePlan={result.insurance}
        />
        <MonthlyChart
          baselineCost={result.baseline_cost}
          insurance={result.insurance}
          standard={result.standard}
        />
      </div>

      <DetailsTable details={result.details} />

      <RevenueForecastReport 
        result={result}
        insurancePlanKey={insurancePlanKey}
        usage={usage}
        resources={resources}
      />
    </section>
  )
}
