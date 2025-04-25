import { UnixTime } from '@l2beat/shared-pure'
import { unstable_cache as cache } from 'next/cache'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import {
  TvsChartDataParams,
  getTvsChart,
} from '~/server/features/scaling/tvs/get-tvs-chart-data'
import { ps } from '~/server/projects'

export async function GET(
  request: NextRequest,
  props: { params: Promise<{ slug: string }> },
) {
  const { slug } = await props.params
  const response = await getCachedResponse(slug, request.nextUrl.searchParams)
  return NextResponse.json(response)
}

const getCachedResponse = cache(
  async (slug: string, searchParams: URLSearchParams) => {
    const project = await ps.getProject({
      slug,
      where: ['tvsConfig', 'isScaling'],
    })

    if (!project) {
      return {
        success: false,
        error: 'Project not found.',
      } as const
    }

    const range = searchParams.get('range') as
      | TvsChartDataParams['range']
      | null

    const params: TvsChartDataParams = {
      range: range ?? '30d',
      filter: { type: 'projects', projectIds: [project.id] },
      excludeAssociatedTokens:
        searchParams.get('excludeAssociatedTokens') === 'true',
      previewRecategorisation: false,
    }
    const parsedParams = TvsChartDataParams.safeParse(params)

    if (parsedParams.error) {
      return {
        success: false,
        errors: parsedParams.error.errors,
      } as const
    }

    const data = await getTvsChart(params)

    const oldestTvsData = data.at(0)
    const latestTvsData = data.at(-1)

    if (!oldestTvsData || !latestTvsData) {
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
  ['scaling-tvs-project-route'],
  {
    tags: ['hourly-data'],
    revalidate: UnixTime.HOUR,
  },
)
