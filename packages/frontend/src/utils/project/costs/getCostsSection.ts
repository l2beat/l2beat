import type { Project } from '@l2beat/config'
import type { CostsSectionProps } from '~/components/projects/sections/costs/CostsSection'
import { getProjectCostsChart } from '~/server/features/layer2s/costs/getProjectCostsChart'
import { checkIfCostsExist } from '~/server/features/layer2s/costs/utils/checkIfCostsExist'
import { optionToRange } from '~/utils/range/range'
import { getCostsChartCaption } from '../chart-figures/chartCaptions'
import { getTrackedTransactions } from '../tracked-txs/getTrackedTransactions'

export async function getCostsSection(
  project: Project<
    never | 'scalingInfo',
    'costsInfo' | 'archivedAt' | 'trackedTxsConfig'
  >,
): Promise<
  | Pick<CostsSectionProps, 'trackedTransactions' | 'defaultRange' | 'caption'>
  | undefined
> {
  if (!project.costsInfo) return undefined

  const trackedTransactions = getTrackedTransactions(project, 'l2costs')

  if (!trackedTransactions) return undefined

  const range = project.archivedAt ? optionToRange('max') : optionToRange('1y')
  const hasData = await checkIfCostsExist(project.id, range[0] ?? undefined)
  if (!hasData) return undefined

  const chart = await getProjectCostsChart({ range, projectId: project.id })

  return {
    trackedTransactions,
    defaultRange: range,
    caption: getCostsChartCaption(project.name, chart),
  }
}
