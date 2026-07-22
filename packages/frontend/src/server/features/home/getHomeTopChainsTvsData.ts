import compact from 'lodash/compact'
import type { Layer2sSummaryEntry } from '../layer2s/summary/getLayer2sSummaryEntries'
import type { SevenDayTvsBreakdown } from '../layer2s/tvs/get7dTvsBreakdown'
import type { TvsTableData } from '../layer2s/tvs/getTvsTableData'
import { getAssociatedTokenWarning } from '../layer2s/tvs/utils/getAssociatedTokenWarning'

/**
 * Builds the TvsTableData subset for the top chains card from the 7d
 * breakdown that getLayer2sSummaryData already computed, so the home page
 * doesn't have to run the tvs.table query (which recomputes the breakdown
 * for every rollup) a second time.
 */
export function getHomeTopChainsTvsData(
  entries: Layer2sSummaryEntry[],
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
