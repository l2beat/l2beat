import compact from 'lodash/compact'
import type { L2TvsEntry } from '~/server/features/layer2s/tvs/getL2TvsEntries'
import type { TvsTableData } from '~/server/features/layer2s/tvs/getTvsTableData'
import { getTvsSyncWarning } from '~/server/features/layer2s/tvs/utils/syncStatus'

export function toTableRows({
  entries,
  data,
}: {
  entries: L2TvsEntry[]
  data: TvsTableData | undefined
}) {
  return entries.map((entry) => {
    const projectData = data?.[entry.id]

    if (!projectData) {
      return {
        ...entry,
        tvs: {
          ...entry.tvs,
          data: undefined,
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
        data: {
          breakdown,
          change,
          changePeriod,
          additionalTrustAssumptionsPercentage,
        },
        warnings: [...entry.tvs.warnings, ...warnings],
        syncWarning: tvsSyncWarning,
      },
    }
  })
}

export type L2TvsTableRow = ReturnType<typeof toTableRows>[number]
