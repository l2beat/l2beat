import compact from 'lodash/compact'
import type { L2SummaryEntry } from '../layer2s/summary/getL2SummaryEntries'
import type { SevenDayTvsBreakdown } from '../layer2s/tvs/get7dTvsBreakdown'
import type { TvsTableData } from '../layer2s/tvs/getTvsTableData'
import { getAssociatedTokenWarning } from '../layer2s/tvs/utils/getAssociatedTokenWarning'

export function getHomeTopChainsTvsData(
  entries: L2SummaryEntry[],
  breakdown: SevenDayTvsBreakdown,
): TvsTableData {
  const result: TvsTableData = {}
  for (const entry of entries) {
    const values = breakdown.projects[entry.id.toString()]
    if (!values) {
      continue
    }

    const associatedTokenWarning =
      values.breakdown.total > 0
        ? getAssociatedTokenWarning({
            associatedRatio:
              values.breakdown.associated / values.breakdown.total,
            name: entry.name,
            associatedTokens: entry.tvs.associatedTokens,
          })
        : undefined

    result[entry.id.toString()] = {
      ...values,
      warnings: compact([
        associatedTokenWarning?.sentiment === 'bad' && associatedTokenWarning,
      ]),
    }
  }
  return result
}
