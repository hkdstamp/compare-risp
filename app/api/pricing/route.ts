import { NextResponse } from 'next/server'
import { pricingCatalog } from '@/lib/pricing-catalog'

export async function GET() {
  return NextResponse.json(pricingCatalog)
}
