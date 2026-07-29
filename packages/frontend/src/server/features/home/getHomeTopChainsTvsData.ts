import compact from 'lodash/compact'
import type { ScalingSummaryEntry } from '../scaling/summary/getScalingSummaryEntries'
import type { SevenDayTvsBreakdown } from '../scaling/tvs/get7dTvsBreakdown'
import type { TvsTableData } from '../scaling/tvs/getTvsTableData'
import { getAssociatedTokenWarning } from '../scaling/tvs/utils/getAssociatedTokenWarning'

export function getHomeTopChainsTvsData(
  entries: ScalingSummaryEntry[],
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
