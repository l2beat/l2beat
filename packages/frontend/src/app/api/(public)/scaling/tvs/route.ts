import { UnixTime } from '@l2beat/shared-pure'
import { unstable_cache as cache } from 'next/cache'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import {
  TvsChartDataParams,
  getTvsChart,
} from '~/server/features/scaling/tvs/get-tvs-chart-data'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams

  const params = {
    range: searchParams.get('range') ?? '30d',
    filter: { type: searchParams.get('type') ?? 'layer2' },
    excludeAssociatedTokens:
      searchParams.get('excludeAssociatedTokens') === 'true',
  }

  const parsedParams = TvsChartDataParams.safeParse(params)
  if (parsedParams.error) {
    return NextResponse.json({
      success: false,
      error: parsedParams.error.errors,
    })
  }

  const response = await getCachedResponse(parsedParams.data)

  return NextResponse.json(response)
}

const getCachedResponse = cache(
  async (params: TvsChartDataParams) => {
    const data = await getTvsChart(params)

    const latestTvsData = data.at(-1)

    if (!latestTvsData) {
      return {
        success: false,
        error: 'Missing data.',
      } as const
    }

    const usdValue = latestTvsData[1] + latestTvsData[2] + latestTvsData[3]
    const ethValue = usdValue / latestTvsData[4]

    return {
      success: true,
      data: {
        usdValue,
        ethValue,
        chart: {
          types: ['timestamp', 'native', 'canonical', 'external', 'ethPrice'],
          data: data.map(
            ([timestamp, native, canonical, external, ethPrice]) => [
              timestamp,
              native,
              canonical,
              external,
              ethPrice,
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
