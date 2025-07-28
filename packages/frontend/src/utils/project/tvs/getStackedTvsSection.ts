import type { Project } from '@l2beat/config'
import type { StackedTvsSectionProps } from '~/components/projects/sections/StackedTvsSection'
import { isTvsChartDataEmpty } from '~/server/features/utils/isChartDataEmpty'
import type { SsrHelpers } from '~/trpc/server'

export async function getStackedTvsSection(
  helpers: SsrHelpers,
  project: Project<never, 'archivedAt'>,
): Promise<Pick<StackedTvsSectionProps, 'defaultRange'> | undefined> {
  const range = project.archivedAt ? 'max' : '1y'
  const data = await helpers.tvs.chart.fetch({
    range: { type: range },
    filter: { type: 'projects', projectIds: [project.id] },
    excludeAssociatedTokens: false,
  })

  if (isTvsChartDataEmpty(data.chart)) {
    return undefined
  }

  return {
    defaultRange: range,
  }
}
