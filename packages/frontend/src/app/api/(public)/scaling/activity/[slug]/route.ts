import { layer2s, layer3s } from '@l2beat/config'
import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { unstable_cache as cache } from 'next/cache'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { getActivityChart } from '~/server/features/scaling/activity/get-activity-chart'
import type { ActivityProjectFilter } from '~/server/features/scaling/activity/utils/project-filter-utils'
import { ActivityTimeRange } from '~/server/features/scaling/activity/utils/range'

const projectsIds = [...layer2s, ...layer3s]
  .map((p) => ({
    id: p.id,
    slug: p.display.slug,
  }))
  .concat({
    id: ProjectId.ETHEREUM,
    slug: 'ethereum',
  })

export async function GET(
  request: NextRequest,
  props: { params: Promise<{ slug: string }> },
) {
  const params = await props.params
  const searchParams = request.nextUrl.searchParams
  const range = ActivityTimeRange.catch('30d').parse(searchParams.get('range'))
  const response = await getCachedResponse(params.slug, range)

  return NextResponse.json(response)
}

const getCachedResponse = cache(
  async (slug: string, range: ActivityTimeRange) => {
    const project = projectsIds.find((p) => p.slug === slug)

    if (!project) {
      return {
        success: false,
        error: 'Project not found.',
      } as const
    }

    const isEthereum = project.slug === 'ethereum'

    const filter: ActivityProjectFilter = isEthereum
      ? { type: 'all' }
      : { type: 'projects', projectIds: [project.id] }

    const { data } = await getActivityChart(filter, range, false)

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
