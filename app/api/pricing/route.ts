import { NextResponse } from 'next/server'
import { pricingCatalog } from '@/lib/pricing-catalog'

export const runtime = 'edge'

export async function GET() {
  return NextResponse.json(pricingCatalog)
}
