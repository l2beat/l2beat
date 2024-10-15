import { DaRiskEntry } from '~/server/features/data-availability/risks/get-da-risk-entries'
import { type DaSummaryEntry } from '~/server/features/data-availability/summary/get-da-summary-entries'

export function groupBySystem<T extends DaSummaryEntry | DaRiskEntry>(
  entries: T[],
) {
  return entries.reduce<Record<'publicSystems' | 'customSystems', T[]>>(
    (acc, layer) => {
      if (layer.systemCategory === 'public') {
        acc.publicSystems.push(layer)
      } else {
        acc.customSystems.push(layer)
      }
      return acc
    },
    {
      publicSystems: [],
      customSystems: [],
    },
  )
}
