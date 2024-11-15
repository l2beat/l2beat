import { UnixTime } from '@l2beat/shared-pure'
import { unstable_cache as cache } from 'next/cache'
import { type NextRequest, NextResponse } from 'next/server'
import { getTvlChart } from '~/server/features/scaling/tvl/get-tvl-chart-data'
import { TvlChartRange } from '~/server/features/scaling/tvl/utils/range'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const range = TvlChartRange.catch('30d').parse(searchParams.get('range'))
  return getCachedResponse(range)
}

const getCachedResponse = cache(
  async (range: TvlChartRange) => {
    const data = await getTvlChart({
      range,
      excludeAssociatedTokens: false,
      filter: { type: 'layer2' },
    })

    const latestTvlData = data.at(-1)

    if (!latestTvlData) {
      return NextResponse.json({
        success: false,
        error: 'Missing data.',
      })
    }

    const centsValue = latestTvlData[1] + latestTvlData[2] + latestTvlData[3]
    const ethValue = centsValue / latestTvlData[4]

    return NextResponse.json({
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
    })
  },
  ['scaling-tvl-route'],
  {
    revalidate: 10 * UnixTime.MINUTE,
  },
)
