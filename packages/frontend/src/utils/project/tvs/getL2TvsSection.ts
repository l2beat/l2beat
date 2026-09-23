import type { Project } from '@l2beat/config'
import { UnixTime } from '@l2beat/shared-pure'
import type { L2TvsSectionProps } from '~/components/projects/sections/tvs/L2TvsSection'
import { getDetailedTvsChart } from '~/server/features/layer2s/tvs/getDetailedTvsChart'
import { checkIfTvsExist } from '~/server/features/layer2s/tvs/utils/checkIfTvsExist'
import { optionToRange } from '~/utils/range/range'
import { getTvsChartCaption } from '../chart-figures/chartCaptions'
import { getTvsJsonUrl } from '../chart-figures/chartJsonLinks'

export async function getL2TvsSection(
  project: Project<never, 'archivedAt' | 'tvsConfig'>,
): Promise<
  Pick<L2TvsSectionProps, 'defaultRange' | 'caption' | 'jsonUrl'> | undefined
> {
  const hasData = await checkIfTvsExist(
    project.id,
    !project.archivedAt ? UnixTime.now() - 365 * UnixTime.DAY : undefined,
  )

  if (!hasData) {
    return undefined
  }

  const rangeOption = project.archivedAt ? 'max' : '1y'
  const defaultRange = optionToRange(rangeOption)
  // Same query as the chart's defaults: all tokens, RWA restricted excluded.
  const chart = await getDetailedTvsChart({
    filter: { type: 'projects', projectIds: [project.id] },
    range: defaultRange,
    excludeAssociatedTokens: false,
    excludeRwaRestrictedTokens: true,
  })

  return {
    defaultRange,
    caption: getTvsChartCaption(project.name, chart.chart),
    // The public endpoint only serves projects with a TVS config.
    jsonUrl: project.tvsConfig
      ? getTvsJsonUrl(project.slug, rangeOption)
      : undefined,
  }
}
