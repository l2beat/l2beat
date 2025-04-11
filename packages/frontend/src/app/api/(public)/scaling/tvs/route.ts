import { UnixTime } from '@l2beat/shared-pure'
import { unstable_cache as cache } from 'next/cache'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { getTvsChart } from '~/server/features/scaling/tvs/get-tvs-chart-data'
import { TvsChartRange } from '~/server/features/scaling/tvs/utils/range'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const range = TvsChartRange.catch('30d').parse(searchParams.get('range'))
  const response = await getCachedResponse(range)

  return NextResponse.json(response)
}

const getCachedResponse = cache(
  async (range: TvsChartRange) => {
    const data = await getTvsChart({
      range,
      excludeAssociatedTokens: false,
      filter: { type: 'layer2' },
      previewRecategorisation: false,
    })

    const latestTvsData = data.at(-1)

    if (!latestTvsData) {
      return {
        success: false,
        error: 'Missing data.',
      } as const
    }

    const centsValue = latestTvsData[1] + latestTvsData[2] + latestTvsData[3]
    const ethValue = centsValue / latestTvsData[4]

    return {
      success: true,
      data: {
        usdValue: centsValue / 100,
        ethValue,
        chart: {
          types: ['timestamp', 'native', 'canonical', 'external', 'ethPrice'],
          data: data.map(
            ([timestamp, native, canonical, external, ethPrice]) => [
              timestamp,
              native / 100,
              canonical / 100,
              external / 100,
              ethPrice / 100,
            ],
          ),
        },
      },
    } as const
  },
  ['scaling-tvs-route'],
  {
    tags: ['hourly-data'],
    revalidate: UnixTime.HOUR,
  },
)
