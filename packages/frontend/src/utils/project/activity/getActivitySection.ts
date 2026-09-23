import type { Project } from '@l2beat/config'
import type { ActivitySectionProps } from '~/components/projects/sections/ActivitySection'
import { getActivityChart } from '~/server/features/layer2s/activity/getActivityChart'
import { checkIfActivityExists } from '~/server/features/layer2s/activity/utils/checkIfActivityExists'
import { optionToRange } from '~/utils/range/range'
import { getActivityChartCaption } from '../chart-figures/chartCaptions'
import { getActivityJsonUrl } from '../chart-figures/chartJsonLinks'

export async function getActivitySection(
  project: Project<never, 'archivedAt' | 'activityConfig'>,
): Promise<
  | Pick<
      ActivitySectionProps,
      'defaultRange' | 'dataSource' | 'caption' | 'jsonUrl'
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

  const chart = await getActivityChart({
    filter: { type: 'projects', projectIds: [project.id] },
    range,
  })

  return {
    defaultRange: range,
    dataSource:
      project.activityConfig.type === 'day'
        ? project.activityConfig.dataSource
        : undefined,
    caption: getActivityChartCaption(
      project.name,
      chart.data.map(([timestamp, txCount, , uopsCount]) => [
        timestamp,
        txCount,
        uopsCount,
      ]),
    ),
    jsonUrl: getActivityJsonUrl(project.slug, rangeOption),
  }
}
