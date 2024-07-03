import { NextResponse } from 'next/server'
import { getTvlChart } from '~/server/features/tvl/get-tvl-chart'
import SuperJSON from 'superjson'

export const dynamic = 'force-dynamic'

export async function GET() {
  return NextResponse.json(
    SuperJSON.serialize(await getTvlChart({ range: '7d', type: 'all' })),
  )
}
