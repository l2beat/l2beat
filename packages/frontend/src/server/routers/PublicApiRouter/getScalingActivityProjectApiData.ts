import { getActivityChart } from '~/server/features/scaling/activity/getActivityChart'
import type { ActivityTimeRange } from '~/server/features/scaling/activity/utils/range'
import { ps } from '~/server/projects'

interface Params {
  slug: string
  range: ActivityTimeRange
}

export async function getScalingActivityProjectApiData({
  slug,
  range,
}: Params) {
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
    filter: isEthereum
      ? { type: 'all' }
      : { type: 'projects', projectIds: project ? [project.id] : [] },
    range: { type: range },
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
}
