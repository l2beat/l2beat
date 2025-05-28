import { UnixTime } from '@l2beat/shared-pure'
import { unstable_cache as cache } from 'next/cache'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { ActivityChartParams } from '~/server/features/scaling/activity/get-activity-chart'
import { ps } from '~/server/projects'
import { getScalingActivityProjectApiData } from '../../../_fns/getScalingActivityProjectApiData'

export async function GET(
  request: NextRequest,
  props: { params: Promise<{ slug: string }> },
) {
  const { slug } = await props.params
  const range = request.nextUrl.searchParams.get('range') as
    | ActivityChartParams['range']
    | null

  const response = await getCachedResponse(slug, range)
  return NextResponse.json(response)
}

const getCachedResponse = cache(
  async (slug: string, range: ActivityChartParams['range'] | null) => {
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

    const params: ActivityChartParams = {
      filter: isEthereum
        ? { type: 'all' }
        : { type: 'projects', projectIds: project ? [project.id] : [] },
      range: range ?? '30d',
      previewRecategorisation: false,
    }
    const parsedParams = ActivityChartParams.safeParse(params)
    if (parsedParams.error) {
      return {
        success: false,
        errors: parsedParams.error.errors,
      } as const
    }

    const response = await getScalingActivityProjectApiData({
      slug,
      range: parsedParams.data.range,
    })

    return response
  },
  ['scaling-activity-project-route'],
  {
    tags: ['hourly-data'],
    revalidate: UnixTime.HOUR,
  },
)
