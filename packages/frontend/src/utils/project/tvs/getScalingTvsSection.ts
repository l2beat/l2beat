import type { Project } from '@l2beat/config'
import type { ScalingTvsSectionProps } from '~/components/projects/sections/ScalingTvsSection'
import { isTvsChartDataEmpty } from '~/server/features/utils/isChartDataEmpty'
import type { SsrHelpers } from '~/trpc/server'

export async function getScalingTvsSection(
  helpers: SsrHelpers,
  project: Project<never, 'archivedAt'>,
): Promise<Pick<ScalingTvsSectionProps, 'defaultRange'> | undefined> {
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
