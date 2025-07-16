import type { Project } from '@l2beat/config'
import type { ActivitySectionProps } from '~/components/projects/sections/ActivitySection'

import { isActivityChartDataEmpty } from '~/server/features/utils/isChartDataEmpty'
import type { SsrHelpers } from '~/trpc/server'

export async function getActivitySection(
  helpers: SsrHelpers,
  project: Project<never, 'archivedAt'>,
): Promise<Pick<ActivitySectionProps, 'defaultRange'> | undefined> {
  const range = project.archivedAt ? 'max' : '1y'
  const data = await helpers.activity.chart.fetch({
    range: { type: range },
    filter: { type: 'projects', projectIds: [project.id] },
  })

  if (isActivityChartDataEmpty(data)) {
    return undefined
  }

  return {
    defaultRange: range,
  }
}
