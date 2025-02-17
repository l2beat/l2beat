import { UnixTime } from '@l2beat/shared-pure'
import { unstable_cache as cache } from 'next/cache'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { getActivityChart } from '~/server/features/scaling/activity/get-activity-chart'
import { ActivityTimeRange } from '~/server/features/scaling/activity/utils/range'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const range = ActivityTimeRange.catch('30d').parse(searchParams.get('range'))
  const response = await getCachedResponse(range)

  return NextResponse.json(response)
}

const getCachedResponse = cache(
  async (range: ActivityTimeRange) => {
    const { data } = await getActivityChart({ type: 'all' }, range, false)

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
