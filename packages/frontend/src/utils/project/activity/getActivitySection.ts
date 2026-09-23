import type { Project } from '@l2beat/config'
import type { ActivitySectionProps } from '~/components/projects/sections/ActivitySection'
import { checkIfActivityExists } from '~/server/features/layer2s/activity/utils/checkIfActivityExists'
import type { SsrHelpers } from '~/trpc/server'
import { optionToRange } from '~/utils/range/range'
import { getActivityChartCaption } from '../chart-figures/chartCaptions'
import { getActivityJsonUrl } from '../chart-figures/chartJsonLinks'

export async function getActivitySection(
  project: Project<never, 'archivedAt' | 'activityConfig'>,
  helpers: SsrHelpers,
): Promise<
  | Pick<
      ActivitySectionProps,
      'defaultRange' | 'dataSource' | 'chartDescription'
    >
  | undefined
> {
  if (!project.activityConfig) return undefined

  const rangeOption = project.archivedAt ? 'max' : '1y'
  const range = optionToRange(rangeOption)
  const hasData = await checkIfActivityExists(project.id, range[0] ?? undefined)
  if (!hasData) {
    return undefined
  }

  const chart = await helpers.queryClient.fetchQuery(
    helpers.trpc.activity.chart.queryOptions({
      range,
      filter: { type: 'projects', projectIds: [project.id] },
    }),
  )

  return {
    defaultRange: range,
    dataSource:
      project.activityConfig.type === 'day'
        ? project.activityConfig.dataSource
        : undefined,
    chartDescription: {
      caption: getActivityChartCaption(project.name, chart.data),
      jsonUrl: getActivityJsonUrl(project.slug, rangeOption),
    },
  }
}
