import { NextResponse } from 'next/server'
import { getTvlChart } from '~/server/features/tvl/get-tvl-chart'

export const dynamic = 'force-dynamic'

export async function GET() {
  const chart = await getTvlChart({ range: '7d', type: 'layer2' })
  return NextResponse.json({
    length: chart.length,
    chart: chart.map((c) => [
      new Date(c[0] * 1000).toISOString(),
      `Sum: ${c[1] + c[2] + c[3]}`,
    ]),
  })
}
