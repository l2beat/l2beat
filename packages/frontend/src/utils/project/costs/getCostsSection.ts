import type { Project } from '@l2beat/config'
import type { CostsSectionProps } from '~/components/projects/sections/costs/CostsSection'
import { checkIfCostsExist } from '~/server/features/layer2s/costs/utils/checkIfCostsExist'
import type { SsrHelpers } from '~/trpc/server'
import { optionToRange } from '~/utils/range/range'
import { getCostsChartCaption } from '../chart-figures/chartCaptions'
import { getTrackedTransactions } from '../tracked-txs/getTrackedTransactions'

export async function getCostsSection(
  project: Project<
    never | 'scalingInfo',
    'costsInfo' | 'archivedAt' | 'trackedTxsConfig'
  >,
  helpers: SsrHelpers,
): Promise<
  | Pick<
      CostsSectionProps,
      'trackedTransactions' | 'defaultRange' | 'chartDescription'
    >
  | undefined
> {
  if (!project.costsInfo) return undefined

  const trackedTransactions = getTrackedTransactions(project, 'l2costs')

  if (!trackedTransactions) return undefined

  const range = project.archivedAt ? optionToRange('max') : optionToRange('1y')
  const hasData = await checkIfCostsExist(project.id, range[0] ?? undefined)
  if (!hasData) return undefined

  const chart = await helpers.queryClient.fetchQuery(
    helpers.trpc.costs.projectChart.queryOptions({
      range,
      projectId: project.id,
    }),
  )

  return {
    trackedTransactions,
    defaultRange: range,
    chartDescription: { caption: getCostsChartCaption(project.name, chart) },
  }
}
