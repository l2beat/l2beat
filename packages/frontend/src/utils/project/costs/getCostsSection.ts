import type { Project } from '@l2beat/config'
import type { CostsSectionProps } from '~/components/projects/sections/costs/CostsSection'
import type { SsrHelpers } from '~/trpc/server'
import { getTrackedTransactions } from '../tracked-txs/getTrackedTransactions'

export async function getCostsSection(
  helpers: SsrHelpers,
  project: Project<
    never | 'scalingInfo',
    'costsInfo' | 'archivedAt' | 'trackedTxsConfig'
  >,
): Promise<
  Pick<CostsSectionProps, 'trackedTransactions' | 'defaultRange'> | undefined
> {
  if (!project.costsInfo) return undefined

  const trackedTransactions = getTrackedTransactions(project, 'l2costs')

  if (!trackedTransactions) return undefined

  const range = project.archivedAt ? 'max' : '1y'
  const data = await helpers.costs.projectChart.fetch({
    range,
    projectId: project.id,
  })

  if (!data || data.chart.length === 0) return undefined

  return {
    trackedTransactions,
    defaultRange: range,
  }
}
