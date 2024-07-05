import { NextResponse } from 'next/server'
import SuperJSON from 'superjson'
import { getTvlChart } from '~/server/features/tvl/get-tvl-chart'

export const dynamic = 'force-dynamic'

export async function GET() {
  return NextResponse.json(
    SuperJSON.serialize(await getTvlChart({ range: '7d', type: 'all' })),
  )
}
