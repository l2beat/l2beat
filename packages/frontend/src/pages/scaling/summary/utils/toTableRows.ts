import compact from 'lodash/compact'
import type { ScalingSummaryEntry } from '~/server/features/scaling/summary/getScalingSummaryEntries'
import type { TvsTableData } from '~/server/features/scaling/tvs/getTvsTableData'
import { getTvsSyncWarning } from '~/server/features/scaling/tvs/utils/syncStatus'

export function toTableRows({
  entries,
  data,
}: {
  entries: ScalingSummaryEntry[]
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
          additionalTrustAssumptionsPercentage: undefined,
          syncWarning: undefined,
        },
      }
    }

    const {
      warnings,
      breakdown,
      change,
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
        warnings: [...entry.tvs.warnings, ...warnings],
        additionalTrustAssumptionsPercentage,
        syncWarning: tvsSyncWarning,
      },
    }
  })
}

export type ScalingSummaryTableRow = ReturnType<typeof toTableRows>[number]
