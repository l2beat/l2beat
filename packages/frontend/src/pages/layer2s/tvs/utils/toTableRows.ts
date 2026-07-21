import compact from 'lodash/compact'
import type { Layer2sTvsEntry } from '~/server/features/layer2s/tvs/getLayer2sTvsEntries'
import type { TvsTableData } from '~/server/features/layer2s/tvs/getTvsTableData'
import { getTvsSyncWarning } from '~/server/features/layer2s/tvs/utils/syncStatus'

export function toTableRows({
  entries,
  data,
}: {
  entries: Layer2sTvsEntry[]
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
          additionalTrustAssumptionsPercentage,
        },
        warnings: [...entry.tvs.warnings, ...warnings],
        syncWarning: tvsSyncWarning,
      },
    }
  })
}

export type Layer2sTvsTableRow = ReturnType<typeof toTableRows>[number]
