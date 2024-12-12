import { NextResponse } from 'next/server'
import { getTvlChart2 } from '~/server/features/scaling/tvl/get-tvl-chart-data-2'

export async function GET() {
  const data = await getTvlChart2({
    range: '7d',
    excludeAssociatedTokens: false,
    filter: { type: 'layer2' },
  })
  return NextResponse.json(data)
}
