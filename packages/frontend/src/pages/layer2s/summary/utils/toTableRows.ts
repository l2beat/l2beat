import compact from 'lodash/compact'
import type { L2SummaryEntry } from '~/server/features/layer2s/summary/getL2SummaryEntries'
import type { TvsTableData } from '~/server/features/layer2s/tvs/getTvsTableData'
import { getTvsSyncWarning } from '~/server/features/layer2s/tvs/utils/syncStatus'

export function toTableRows({
  entries,
  data,
}: {
  entries: L2SummaryEntry[]
  data: TvsTableData | undefined
}) {
  return entries.map((entry) => {
    const projectData = data?.[entry.id]

    if (!projectData) {
      return {
        ...entry,
        tvs: {
          ...entry.tvs,
          breakdown: undefined,
          change: undefined,
          changePeriod: undefined,
          additionalTrustAssumptionsPercentage: undefined,
          syncWarning: undefined,
        },
      }
    }

    const {
      warnings,
      breakdown,
      change,
      changePeriod,
      additionalTrustAssumptionsPercentage,
      syncState,
    } = projectData

    const tvsSyncWarning = getTvsSyncWarning(syncState)

    return {
      ...entry,
      statuses: {
        ...entry.statuses,
        syncWarning: compact([
          tvsSyncWarning,
          entry.statuses?.syncWarning,
        ]).join('\n'),
      },
      tvs: {
        ...entry.tvs,
        breakdown,
        change,
        changePeriod,
        warnings: [...entry.tvs.warnings, ...warnings],
        additionalTrustAssumptionsPercentage,
        syncWarning: tvsSyncWarning,
      },
    }
  })
}

export type L2SummaryTableRow = ReturnType<typeof toTableRows>[number]
