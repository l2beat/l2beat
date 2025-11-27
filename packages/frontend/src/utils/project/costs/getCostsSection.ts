import type { Project } from '@l2beat/config'
import type { CostsSectionProps } from '~/components/projects/sections/costs/CostsSection'
import { env } from '~/env'
import type { SsrHelpers } from '~/trpc/server'
import { optionToRange } from '~/utils/range/range'
import { getTrackedTransactions } from '../tracked-txs/getTrackedTransactions'

export async function getCostsSection(
  helpers: SsrHelpers,
  project: Project<
    never | 'scalingInfo',
    'costsInfo' | 'archivedAt' | 'trackedTxsConfig'
  >,
): Promise<
  | Pick<
      CostsSectionProps,
      'trackedTransactions' | 'defaultRange' | 'bigQueryOutage'
    >
  | undefined
> {
  if (!project.costsInfo) return undefined

  const trackedTransactions = getTrackedTransactions(project, 'l2costs')

  if (!trackedTransactions) return undefined

  const range = project.archivedAt ? optionToRange('max') : optionToRange('1y')
  const data = await helpers.costs.projectChart.fetch({
    range,
    projectId: project.id,
  })

  if (!data || data.chart.length === 0) return undefined

  return {
    trackedTransactions,
    defaultRange: range,
    bigQueryOutage: env.CLIENT_SIDE_BIG_QUERY_OUTAGE,
  }
}
