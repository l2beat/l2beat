import type { Project } from '@l2beat/config'
import type { ActivitySectionProps } from '~/components/projects/sections/ActivitySection'
import { isActivityChartDataEmpty } from '~/server/features/utils/isChartDataEmpty'
import type { SsrHelpers } from '~/trpc/server'
import { optionToRange } from '~/utils/range/range'

export async function getActivitySection(
  helpers: SsrHelpers,
  project: Project<never, 'archivedAt' | 'activityConfig'>,
): Promise<
  Pick<ActivitySectionProps, 'defaultRange' | 'dataSource'> | undefined
> {
  if (!project.activityConfig) return undefined

  const rangeOption = project.archivedAt ? 'max' : '1y'
  const range = optionToRange(rangeOption)
  const data = await helpers.queryClient.fetchQuery(
    helpers.trpc.activity.chart.queryOptions({
      range,
      filter: { type: 'projects', projectIds: [project.id] },
    }),
  )

  if (isActivityChartDataEmpty(data)) {
    return undefined
  }

  return {
    defaultRange: range,
    dataSource:
      project.activityConfig.type === 'day'
        ? project.activityConfig.dataSource
        : undefined,
  }
}
