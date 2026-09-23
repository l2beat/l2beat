import type { Project } from '@l2beat/config'
import { UnixTime } from '@l2beat/shared-pure'
import {
  DEFAULT_EXCLUDE_RWA_RESTRICTED_TOKENS,
  getProjectTvsChartQuery,
} from '~/components/chart/tvs/projectTvsChartQuery'
import type { L2TvsSectionProps } from '~/components/projects/sections/tvs/L2TvsSection'
import { checkIfTvsExist } from '~/server/features/layer2s/tvs/utils/checkIfTvsExist'
import type { SsrHelpers } from '~/trpc/server'
import { optionToRange } from '~/utils/range/range'
import { getTvsChartCaption } from '../chart-figures/chartCaptions'
import { getTvsJsonUrl } from '../chart-figures/chartJsonLinks'

export async function getL2TvsSection(
  project: Project<never, 'archivedAt' | 'tvsConfig'>,
  helpers: SsrHelpers,
): Promise<
  Pick<L2TvsSectionProps, 'defaultRange' | 'chartDescription'> | undefined
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
  const chart = await helpers.queryClient.fetchQuery(
    helpers.trpc.tvs.detailedChart.queryOptions(
      getProjectTvsChartQuery(
        project.id,
        defaultRange,
        DEFAULT_EXCLUDE_RWA_RESTRICTED_TOKENS,
      ),
    ),
  )

  return {
    defaultRange,
    chartDescription: {
      caption: getTvsChartCaption(project.name, chart.chart),
      jsonUrl: hasPublicTvsEndpoint(project)
        ? getTvsJsonUrl(project.slug, rangeOption)
        : undefined,
    },
  }
}

// Mirrors the `where` filter of the /api/scaling/tvs/:slug handler.
function hasPublicTvsEndpoint(project: Project<never, 'tvsConfig'>) {
  return project.tvsConfig !== undefined
}
