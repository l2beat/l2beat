import { UnixTime } from '@l2beat/shared-pure'
import { unstable_cache as cache } from 'next/cache'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { ActivityChartParams } from '~/server/features/scaling/activity/get-activity-chart'
import { getScalingActivityApiData } from '../../_fns/getScalingActivityApiData'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams

  const type = searchParams.get('type') as
    | ActivityChartParams['filter']['type']
    | null
  const range = searchParams.get('range') as ActivityChartParams['range'] | null
  const projectIds = searchParams.get('projectIds')

  if (type === 'projects' && !projectIds) {
    return NextResponse.json({
      success: false,
      errors: [{ message: 'projectIds is required for "projects" type' }],
    })
  }

  const params: ActivityChartParams = {
    filter:
      type === 'projects'
        ? { type: 'projects', projectIds: projectIds?.split(',') ?? [] }
        : { type: type ?? 'all' },
    range: range ?? '30d',
    previewRecategorisation: false,
  }
  const parsedParams = ActivityChartParams.safeParse(params)

  if (parsedParams.error) {
    return NextResponse.json({
      success: false,
      errors: parsedParams.error.errors,
    })
  }

  const response = await getCachedResponse({
    projectIds:
      parsedParams.data.filter.type === 'projects'
        ? parsedParams.data.filter.projectIds
        : [],
    range: parsedParams.data.range,
    type: parsedParams.data.filter.type,
  })

  return NextResponse.json(response)
}

const getCachedResponse = cache(
  getScalingActivityApiData,
  ['scaling-activity-route'],
  {
    tags: ['hourly-data'],
    revalidate: UnixTime.HOUR,
  },
)
