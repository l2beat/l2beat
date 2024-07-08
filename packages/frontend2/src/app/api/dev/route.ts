import { NextResponse } from 'next/server'
import { getTvlChart } from '~/server/features/tvl/get-tvl-chart'

export const dynamic = 'force-dynamic'

export async function GET() {
  const chart = await getTvlChart({ range: '7d', type: 'layer2' })
  return NextResponse.json({
    length: chart.length,
    chart,
  })
}
