import { layer2s, layer3s } from '@l2beat/config'
import { UnixTime } from '@l2beat/shared-pure'
import { unstable_cache as cache } from 'next/cache'
import { type NextRequest, NextResponse } from 'next/server'
import { getTvlChart } from '~/server/features/scaling/tvl/get-tvl-chart-data'
import { TvlChartRange } from '~/server/features/scaling/tvl/utils/range'

const projects = [...layer2s, ...layer3s]

export async function GET(
  request: NextRequest,
  props: { params: Promise<{ slug: string }> },
) {
  const params = await props.params
  const searchParams = request.nextUrl.searchParams
  const range = TvlChartRange.catch('30d').parse(searchParams.get('range'))

  const response = await getCachedResponse(params.slug, range)

  return NextResponse.json(response)
}

const getCachedResponse = cache(
  async (slug: string, range: TvlChartRange) => {
    const project = projects.find((p) => p.display.slug === slug)

    if (!project) {
      return {
        success: false,
        error: 'Project not found.',
      } as const
    }

    const data = await getTvlChart({
      range,
      excludeAssociatedTokens: false,
      filter: { type: 'projects', projectIds: [project.id] },
    })

    const oldestTvlData = data.at(0)
    const latestTvlData = data.at(-1)

    if (!oldestTvlData || !latestTvlData) {
      return {
        success: false,
        error: 'Missing data.',
      } as const
    }

    const centsValue = latestTvlData[1] + latestTvlData[2] + latestTvlData[3]
    const ethValue = centsValue / latestTvlData[4]

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
  ['scaling-tvl-project-route'],
  {
    tags: ['tvl'],
    revalidate: UnixTime.HOUR,
  },
)
