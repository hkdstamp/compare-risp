import { NextResponse } from 'next/server'
import { defaultResources } from '@/lib/pricing-catalog'

export async function GET() {
  return NextResponse.json(defaultResources)
}
