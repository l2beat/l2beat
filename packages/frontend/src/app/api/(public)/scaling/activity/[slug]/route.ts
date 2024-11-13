import { layer2s, layer3s } from '@l2beat/config'
import { ProjectId } from '@l2beat/shared-pure'
import { type NextRequest, NextResponse } from 'next/server'
import { getActivityChart } from '~/server/features/scaling/activity/get-activity-chart'
import { type ActivityProjectFilter } from '~/server/features/scaling/activity/utils/project-filter-utils'
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

  const project = projectsIds.find((p) => p.slug === params.slug)

  if (!project) {
    return NextResponse.json({
      success: false,
      error: 'Project not found.',
    })
  }

  const isEthereum = project.slug === 'ethereum'

  const filter: ActivityProjectFilter = isEthereum
    ? { type: 'all' }
    : { type: 'projects', projectIds: [project.id] }

  const { data } = await getActivityChart(filter, range)

  const oldestProjectData = data.at(0)
  const latestProjectData = data.at(-1)

  if (!oldestProjectData || !latestProjectData) {
    return NextResponse.json({
      success: false,
      error: 'Missing data.',
    })
  }

  // Unfortunately, ethereum data is being served along with other projects data
  const dataPoints = data.map(
    ([timestamp, projectsTxCount, ethereumTxCount]) =>
      [timestamp, isEthereum ? ethereumTxCount : projectsTxCount] as const,
  )

  return NextResponse.json({
    success: true,
    data: {
      chart: {
        types: ['timestamp', 'count'],
        data: dataPoints,
      },
    },
  })
}
