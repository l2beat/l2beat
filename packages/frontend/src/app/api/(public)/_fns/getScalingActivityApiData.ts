import {
  type ActivityChartParams,
  getActivityChart,
} from '~/server/features/scaling/activity/get-activity-chart'
import type { ActivityProjectFilterType } from '~/server/features/scaling/activity/utils/project-filter-utils'
import type { ActivityTimeRange } from '~/server/features/scaling/activity/utils/range'

interface Params {
  range: ActivityTimeRange
  type: ActivityProjectFilterType
  projectIds: string[]
}

export async function getScalingActivityApiData({
  range,
  type,
  projectIds,
}: Params) {
  const params: ActivityChartParams = {
    filter: type === 'projects' ? { type: 'projects', projectIds } : { type },
    range,
    previewRecategorisation: false,
  }

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
}
