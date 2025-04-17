import { UnixTime } from '@l2beat/shared-pure'
import { unstable_cache as cache } from 'next/cache'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import {
  ActivityChartParams,
  getActivityChart,
} from '~/server/features/scaling/activity/get-activity-chart'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams

  const params = {
    filter: { type: searchParams.get('type') ?? 'all' },
    range: searchParams.get('range') ?? '30d',
  }
  const parsedParams = ActivityChartParams.safeParse(params)

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
  async (params: ActivityChartParams) => {
    const { data } = await getActivityChart(params)
    const latestActivityData = data.at(-1)

    if (!latestActivityData) {
      return {
        success: false,
        error: 'Missing data.',
      } as const
    }

    // Strip ethereum data points
    const projectsDataPoints = data.map(
      ([timestamp, projectsTxCount, _, projectsUopsCount]) =>
        [timestamp, projectsTxCount, projectsUopsCount] as const,
    )

    return {
      success: true,
      data: {
        chart: {
          types: ['timestamp', 'count', 'uopsCount'],
          data: projectsDataPoints,
        },
      },
    } as const
  },
  ['scaling-activity-route'],
  {
    tags: ['hourly-data'],
    revalidate: UnixTime.HOUR,
  },
)
