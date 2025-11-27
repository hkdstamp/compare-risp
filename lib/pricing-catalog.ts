import { PricingCatalog, ResourceConfig } from './types'

export const pricingCatalog: PricingCatalog = {
  metadata: {
    region: "ap-northeast-1",
    hours_per_month: 730
  },
  resources: {
    ec2: {
      "t3.micro": {
        on_demand_hourly_usd: 0.0136,
        standard_ri: {
          "1yr": {
            NoUpfront: { hourly_usd: 0.0086, upfront_usd: 0 },
            PartialUpfront: { hourly_usd: 0.0041, upfront_usd: 36 },
            AllUpfront: { hourly_usd: 0.0, upfront_usd: 70 }
          },
          "3yr": {
            NoUpfront: { hourly_usd: 0.0059, upfront_usd: 0 },
            PartialUpfront: { hourly_usd: 0.0027, upfront_usd: 72 },
            AllUpfront: { hourly_usd: 0.0, upfront_usd: 134 }
          }
        }
      },
      "t3.small": {
        on_demand_hourly_usd: 0.0272,
        standard_ri: {
          "1yr": {
            NoUpfront: { hourly_usd: 0.0171, upfront_usd: 0 },
            PartialUpfront: { hourly_usd: 0.0081, upfront_usd: 71 },
            AllUpfront: { hourly_usd: 0.0, upfront_usd: 140 }
          },
          "3yr": {
            NoUpfront: { hourly_usd: 0.0118, upfront_usd: 0 },
            PartialUpfront: { hourly_usd: 0.0054, upfront_usd: 143 },
            AllUpfront: { hourly_usd: 0.0, upfront_usd: 269 }
          }
        }
      },
      "t3.medium": {
        on_demand_hourly_usd: 0.0544,
        standard_ri: {
          "1yr": {
            NoUpfront: { hourly_usd: 0.0342, upfront_usd: 0 },
            PartialUpfront: { hourly_usd: 0.0163, upfront_usd: 143 },
            AllUpfront: { hourly_usd: 0.0, upfront_usd: 280 }
          },
          "3yr": {
            NoUpfront: { hourly_usd: 0.0235, upfront_usd: 0 },
            PartialUpfront: { hourly_usd: 0.0109, upfront_usd: 286 },
            AllUpfront: { hourly_usd: 0.0, upfront_usd: 538 }
          }
        }
      },
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
        },
        savings_plans: {
          "1yr": { hourly_usd: 0.0653 },  // ~40% discount from on-demand
          "3yr": { hourly_usd: 0.0435 }   // ~60% discount from on-demand
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
        },
        savings_plans: {
          "1yr": { hourly_usd: 0.1306 },  // ~40% discount from on-demand
          "3yr": { hourly_usd: 0.0870 }   // ~60% discount from on-demand
        }
      },
      "t3.2xlarge": {
        on_demand_hourly_usd: 0.4352,
        standard_ri: {
          "1yr": {
            NoUpfront: { hourly_usd: 0.2741, upfront_usd: 0 },
            PartialUpfront: { hourly_usd: 0.1305, upfront_usd: 1144 },
            AllUpfront: { hourly_usd: 0.0, upfront_usd: 2242 }
          },
          "3yr": {
            NoUpfront: { hourly_usd: 0.188, upfront_usd: 0 },
            PartialUpfront: { hourly_usd: 0.087, upfront_usd: 2288 },
            AllUpfront: { hourly_usd: 0.0, upfront_usd: 4300 }
          }
        }
      },
      "m5.large": {
        on_demand_hourly_usd: 0.124,
        standard_ri: {
          "1yr": {
            NoUpfront: { hourly_usd: 0.078, upfront_usd: 0 },
            PartialUpfront: { hourly_usd: 0.037, upfront_usd: 326 },
            AllUpfront: { hourly_usd: 0.0, upfront_usd: 638 }
          },
          "3yr": {
            NoUpfront: { hourly_usd: 0.054, upfront_usd: 0 },
            PartialUpfront: { hourly_usd: 0.025, upfront_usd: 652 },
            AllUpfront: { hourly_usd: 0.0, upfront_usd: 1226 }
          }
        }
      },
      "m5.xlarge": {
        on_demand_hourly_usd: 0.248,
        standard_ri: {
          "1yr": {
            NoUpfront: { hourly_usd: 0.156, upfront_usd: 0 },
            PartialUpfront: { hourly_usd: 0.074, upfront_usd: 652 },
            AllUpfront: { hourly_usd: 0.0, upfront_usd: 1277 }
          },
          "3yr": {
            NoUpfront: { hourly_usd: 0.107, upfront_usd: 0 },
            PartialUpfront: { hourly_usd: 0.050, upfront_usd: 1304 },
            AllUpfront: { hourly_usd: 0.0, upfront_usd: 2452 }
          }
        }
      },
      "c5.large": {
        on_demand_hourly_usd: 0.11,
        standard_ri: {
          "1yr": {
            NoUpfront: { hourly_usd: 0.069, upfront_usd: 0 },
            PartialUpfront: { hourly_usd: 0.033, upfront_usd: 289 },
            AllUpfront: { hourly_usd: 0.0, upfront_usd: 566 }
          },
          "3yr": {
            NoUpfront: { hourly_usd: 0.048, upfront_usd: 0 },
            PartialUpfront: { hourly_usd: 0.022, upfront_usd: 578 },
            AllUpfront: { hourly_usd: 0.0, upfront_usd: 1087 }
          }
        }
      }
    },
    rds: {
      "db.t4g.micro": {
        on_demand_hourly_usd: 0.02,
        standard_ri: {
          "1yr": {
            NoUpfront: { hourly_usd: 0.0156, upfront_usd: 0 },
            PartialUpfront: { hourly_usd: 0.0074, upfront_usd: 65 },
            AllUpfront: { hourly_usd: 0.0, upfront_usd: 128 }
          },
          "3yr": {
            NoUpfront: { hourly_usd: 0.0104, upfront_usd: 0 },
            PartialUpfront: { hourly_usd: 0.005, upfront_usd: 131 },
            AllUpfront: { hourly_usd: 0.0, upfront_usd: 257 }
          }
        }
      },
      "db.t4g.small": {
        on_demand_hourly_usd: 0.04,
        standard_ri: {
          "1yr": {
            NoUpfront: { hourly_usd: 0.0312, upfront_usd: 0 },
            PartialUpfront: { hourly_usd: 0.0148, upfront_usd: 130 },
            AllUpfront: { hourly_usd: 0.0, upfront_usd: 256 }
          },
          "3yr": {
            NoUpfront: { hourly_usd: 0.0208, upfront_usd: 0 },
            PartialUpfront: { hourly_usd: 0.0100, upfront_usd: 263 },
            AllUpfront: { hourly_usd: 0.0, upfront_usd: 515 }
          }
        }
      },
      "db.t4g.medium": {
        on_demand_hourly_usd: 0.08,
        standard_ri: {
          "1yr": {
            NoUpfront: { hourly_usd: 0.0624, upfront_usd: 0 },
            PartialUpfront: { hourly_usd: 0.0296, upfront_usd: 260 },
            AllUpfront: { hourly_usd: 0.0, upfront_usd: 511 }
          },
          "3yr": {
            NoUpfront: { hourly_usd: 0.0416, upfront_usd: 0 },
            PartialUpfront: { hourly_usd: 0.0200, upfront_usd: 525 },
            AllUpfront: { hourly_usd: 0.0, upfront_usd: 1030 }
          }
        }
      },
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
        },
        savings_plans: {
          "1yr": { hourly_usd: 0.1212 },  // ~40% discount from on-demand
          "3yr": { hourly_usd: 0.0808 }   // ~60% discount from on-demand
        }
      },
      "db.m5.large": {
        on_demand_hourly_usd: 0.248,
        standard_ri: {
          "1yr": {
            NoUpfront: { hourly_usd: 0.1932, upfront_usd: 0 },
            PartialUpfront: { hourly_usd: 0.0917, upfront_usd: 804 },
            AllUpfront: { hourly_usd: 0.0, upfront_usd: 1586 }
          },
          "3yr": {
            NoUpfront: { hourly_usd: 0.1288, upfront_usd: 0 },
            PartialUpfront: { hourly_usd: 0.0620, upfront_usd: 1629 },
            AllUpfront: { hourly_usd: 0.0, upfront_usd: 3192 }
          }
        }
      },
      "db.r5.large": {
        on_demand_hourly_usd: 0.312,
        standard_ri: {
          "1yr": {
            NoUpfront: { hourly_usd: 0.2430, upfront_usd: 0 },
            PartialUpfront: { hourly_usd: 0.1153, upfront_usd: 1010 },
            AllUpfront: { hourly_usd: 0.0, upfront_usd: 1993 }
          },
          "3yr": {
            NoUpfront: { hourly_usd: 0.1620, upfront_usd: 0 },
            PartialUpfront: { hourly_usd: 0.0779, upfront_usd: 2046 },
            AllUpfront: { hourly_usd: 0.0, upfront_usd: 4010 }
          }
        }
      }
    },
    elasticache: {
      "cache.t4g.micro": {
        on_demand_hourly_usd: 0.018,
        standard_ri: {
          "1yr": {
            NoUpfront: { hourly_usd: 0.0140, upfront_usd: 0 },
            PartialUpfront: { hourly_usd: 0.0067, upfront_usd: 58 },
            AllUpfront: { hourly_usd: 0.0, upfront_usd: 115 }
          },
          "3yr": {
            NoUpfront: { hourly_usd: 0.0094, upfront_usd: 0 },
            PartialUpfront: { hourly_usd: 0.0045, upfront_usd: 118 },
            AllUpfront: { hourly_usd: 0.0, upfront_usd: 231 }
          }
        }
      },
      "cache.t4g.small": {
        on_demand_hourly_usd: 0.036,
        standard_ri: {
          "1yr": {
            NoUpfront: { hourly_usd: 0.0281, upfront_usd: 0 },
            PartialUpfront: { hourly_usd: 0.0133, upfront_usd: 117 },
            AllUpfront: { hourly_usd: 0.0, upfront_usd: 230 }
          },
          "3yr": {
            NoUpfront: { hourly_usd: 0.0187, upfront_usd: 0 },
            PartialUpfront: { hourly_usd: 0.0090, upfront_usd: 237 },
            AllUpfront: { hourly_usd: 0.0, upfront_usd: 464 }
          }
        }
      },
      "cache.m5.large": {
        on_demand_hourly_usd: 0.186,
        standard_ri: {
          "1yr": {
            NoUpfront: { hourly_usd: 0.1449, upfront_usd: 0 },
            PartialUpfront: { hourly_usd: 0.0688, upfront_usd: 603 },
            AllUpfront: { hourly_usd: 0.0, upfront_usd: 1190 }
          },
          "3yr": {
            NoUpfront: { hourly_usd: 0.0966, upfront_usd: 0 },
            PartialUpfront: { hourly_usd: 0.0465, upfront_usd: 1222 },
            AllUpfront: { hourly_usd: 0.0, upfront_usd: 2394 }
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

// Service and instance type metadata for UI
export const serviceMetadata = {
  ec2: {
    name: "Amazon EC2",
    description: "Elastic Compute Cloud - Virtual Servers",
    instances: [
      { value: "t3.micro", label: "t3.micro (2 vCPU, 1 GiB)" },
      { value: "t3.small", label: "t3.small (2 vCPU, 2 GiB)" },
      { value: "t3.medium", label: "t3.medium (2 vCPU, 4 GiB)" },
      { value: "t3.large", label: "t3.large (2 vCPU, 8 GiB)" },
      { value: "t3.xlarge", label: "t3.xlarge (4 vCPU, 16 GiB)" },
      { value: "t3.2xlarge", label: "t3.2xlarge (8 vCPU, 32 GiB)" },
      { value: "m5.large", label: "m5.large (2 vCPU, 8 GiB)" },
      { value: "m5.xlarge", label: "m5.xlarge (4 vCPU, 16 GiB)" },
      { value: "c5.large", label: "c5.large (2 vCPU, 4 GiB)" }
    ]
  },
  rds: {
    name: "Amazon RDS",
    description: "Relational Database Service",
    instances: [
      { value: "db.t4g.micro", label: "db.t4g.micro (2 vCPU, 1 GiB)" },
      { value: "db.t4g.small", label: "db.t4g.small (2 vCPU, 2 GiB)" },
      { value: "db.t4g.medium", label: "db.t4g.medium (2 vCPU, 4 GiB)" },
      { value: "db.t4g.large", label: "db.t4g.large (2 vCPU, 8 GiB)" },
      { value: "db.m5.large", label: "db.m5.large (2 vCPU, 8 GiB)" },
      { value: "db.r5.large", label: "db.r5.large (2 vCPU, 16 GiB)" }
    ]
  },
  elasticache: {
    name: "Amazon ElastiCache",
    description: "In-Memory Data Store",
    instances: [
      { value: "cache.t4g.micro", label: "cache.t4g.micro (2 vCPU, 0.5 GiB)" },
      { value: "cache.t4g.small", label: "cache.t4g.small (2 vCPU, 1.37 GiB)" },
      { value: "cache.m5.large", label: "cache.m5.large (2 vCPU, 6.38 GiB)" }
    ]
  }
}
