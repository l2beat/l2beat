import {
  type ActivityChartParams,
  getActivityChart,
} from '~/server/features/layer2s/activity/getActivityChart'
import type { ActivityProjectFilterType } from '~/server/features/layer2s/activity/utils/projectFilterUtils'
import type { ChartRange } from '~/utils/range/range'

interface Params {
  range: ChartRange
  type: ActivityProjectFilterType
  projectIds: string[]
}

export async function getLayer2sActivityApiData({
  range,
  type,
  projectIds,
}: Params) {
  const params: ActivityChartParams = {
    filter: type === 'projects' ? { type: 'projects', projectIds } : { type },
    range,
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
