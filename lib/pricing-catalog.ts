import { PricingCatalog, ResourceConfig } from './types'

export const pricingCatalog: PricingCatalog = {
  metadata: {
    region: "ap-northeast-1",
    hours_per_month: 730
  },
  resources: {
    ec2: {
      "t3.large": {
        on_demand_hourly_usd: 0.1088,
        standard_ri: {
          "1yr": {
            NoUpfront: { hourly_usd: 0.0685, upfront_usd: 0 },
            PartialUpfront: { hourly_usd: 0.0326, upfront_usd: 286 },
            AllUpfront: { hourly_usd: 0.0, upfront_usd: 560 }
          },
          "3yr": {
            NoUpfront: { hourly_usd: 0.047, upfront_usd: 0 },
            PartialUpfront: { hourly_usd: 0.0218, upfront_usd: 572 },
            AllUpfront: { hourly_usd: 0.0, upfront_usd: 1075 }
          }
        }
      },
      "t3.xlarge": {
        on_demand_hourly_usd: 0.2176,
        standard_ri: {
          "1yr": {
            NoUpfront: { hourly_usd: 0.1371, upfront_usd: 0 },
            PartialUpfront: { hourly_usd: 0.0653, upfront_usd: 572 },
            AllUpfront: { hourly_usd: 0.0, upfront_usd: 1121 }
          },
          "3yr": {
            NoUpfront: { hourly_usd: 0.094, upfront_usd: 0 },
            PartialUpfront: { hourly_usd: 0.0435, upfront_usd: 1144 },
            AllUpfront: { hourly_usd: 0.0, upfront_usd: 2150 }
          }
        }
      }
    },
    rds: {
      "db.t4g.large": {
        on_demand_hourly_usd: 0.202,
        standard_ri: {
          "1yr": {
            NoUpfront: { hourly_usd: 0.1572, upfront_usd: 0 },
            PartialUpfront: { hourly_usd: 0.0746, upfront_usd: 653 },
            AllUpfront: { hourly_usd: 0.0, upfront_usd: 1289 }
          },
          "3yr": {
            NoUpfront: { hourly_usd: 0.1048, upfront_usd: 0 },
            PartialUpfront: { hourly_usd: 0.0504, upfront_usd: 1325 },
            AllUpfront: { hourly_usd: 0.0, upfront_usd: 2596 }
          }
        }
      }
    }
  },
  insurance_plans: {
    "30d": {
      name: "30-day guarantee",
      discount_rate: 0.30,
      premium_rate: 0.50,
      term_months: 1
    },
    "1y": {
      name: "1-year guarantee",
      discount_rate: 0.45,
      premium_rate: 0.33,
      term_months: 12
    }
  }
}

export const defaultResources: ResourceConfig[] = [
  { service: "ec2", instance: "t3.large", quantity: 3, usage: 1.0, coverage: 1.0 },
  { service: "ec2", instance: "t3.xlarge", quantity: 2, usage: 1.0, coverage: 1.0 },
  { service: "rds", instance: "db.t4g.large", quantity: 2, usage: 1.0, coverage: 1.0 }
]
