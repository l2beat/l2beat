import { UnixTime } from '@l2beat/shared-pure'
import { unstable_cache as cache } from 'next/cache'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import {
  ActivityChartParams,
  getActivityChart,
} from '~/server/features/scaling/activity/get-activity-chart'
import { ps } from '~/server/projects'

export async function GET(
  request: NextRequest,
  props: { params: Promise<{ slug: string }> },
) {
  const { slug } = await props.params
  const searchParams = request.nextUrl.searchParams

  const params = {
    filter: { type: 'projects', projectIds: [slug] },
    range: searchParams.get('range') ?? '30d',
  }
  const parsedParams = ActivityChartParams.safeParse(params)
  if (parsedParams.error) {
    return NextResponse.json({
      success: false,
      error: parsedParams.error.errors,
    })
  }

  const response = await getCachedResponse(slug, parsedParams.data)
  return NextResponse.json(response)
}

const getCachedResponse = cache(
  async (slug: string, params: ActivityChartParams) => {
    const isEthereum = slug === 'ethereum'
    const project = await ps.getProject({
      slug,
      where: ['activityConfig', 'isScaling'],
    })

    if (!project && !isEthereum) {
      return {
        success: false,
        error: 'Project not found.',
      } as const
    }

    const { data } = await getActivityChart({
      ...params,
      filter: isEthereum ? { type: 'all' } : params.filter,
    })

    const oldestProjectData = data.at(0)
    const latestProjectData = data.at(-1)

    if (!oldestProjectData || !latestProjectData) {
      return {
        success: false,
        error: 'Missing data.',
      } as const
    }

    // Unfortunately, ethereum data is being served along with other projects data
    const dataPoints = data.map(
      ([
        timestamp,
        projectsTxCount,
        ethereumTxCount,
        projectsUopsCount,
        ethereumUopsCount,
      ]) =>
        [
          timestamp,
          isEthereum ? ethereumTxCount : projectsTxCount,
          isEthereum ? ethereumUopsCount : projectsUopsCount,
        ] as const,
    )

    return {
      success: true,
      data: {
        chart: {
          types: ['timestamp', 'count', 'uopsCount'],
          data: dataPoints,
        },
      },
    } as const
  },
  ['scaling-activity-project-route'],
  {
    tags: ['hourly-data'],
    revalidate: UnixTime.HOUR,
  },
)
