import { layer2s, layer3s } from '@l2beat/config'
import { UnixTime } from '@l2beat/shared-pure'
import { unstable_cache as cache } from 'next/cache'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { getTvsChart } from '~/server/features/scaling/tvs/get-tvs-chart-data'
import { TvsChartRange } from '~/server/features/scaling/tvs/utils/range'

const projects = [...layer2s, ...layer3s]

export async function GET(
  request: NextRequest,
  props: { params: Promise<{ slug: string }> },
) {
  const params = await props.params
  const searchParams = request.nextUrl.searchParams
  const range = TvsChartRange.catch('30d').parse(searchParams.get('range'))

  const response = await getCachedResponse(params.slug, range)

  return NextResponse.json(response)
}

const getCachedResponse = cache(
  async (slug: string, range: TvsChartRange) => {
    const project = projects.find((p) => p.display.slug === slug)

    if (!project) {
      return {
        success: false,
        error: 'Project not found.',
      } as const
    }

    const data = await getTvsChart({
      range,
      excludeAssociatedTokens: false,
      filter: { type: 'projects', projectIds: [project.id] },
      previewRecategorisation: false,
    })

    const oldestTvsData = data.at(0)
    const latestTvsData = data.at(-1)

    if (!oldestTvsData || !latestTvsData) {
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
  ['scaling-tvs-project-route'],
  {
    tags: ['hourly-data'],
    revalidate: UnixTime.HOUR,
  },
)
