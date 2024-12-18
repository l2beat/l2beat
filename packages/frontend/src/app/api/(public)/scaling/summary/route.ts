import { UnixTime } from '@l2beat/shared-pure'
import { unstable_cache as cache } from 'next/cache'
import { NextResponse } from 'next/server'
import { getScalingApiEntries } from '~/server/features/scaling/summary/get-scaling-api-entries'
import { getTvlChart } from '~/server/features/scaling/tvl/get-tvl-chart-data'

export async function GET() {
  const data = await getCachedData()
  return NextResponse.json({ success: true, data })
}

const getCachedData = cache(
  async () => {
    const entries = await getScalingApiEntries()
    const data = await getTvlChart({
      range: '30d',
      excludeAssociatedTokens: false,
      filter: { type: 'layer2' },
    })
    return {
      chart: {
        types: ['timestamp', 'native', 'canonical', 'external', 'ethPrice'],
        data: data.map(([timestamp, native, canonical, external, ethPrice]) => [
          timestamp,
          native / 100,
          canonical / 100,
          external / 100,
          ethPrice / 100,
        ]),
      },
      projects: Object.fromEntries(entries.map((entry) => [entry.id, entry])),
    }
  },
  ['scaling-summary-route'],
  { tags: ['activity'], revalidate: UnixTime.DAY },
)
