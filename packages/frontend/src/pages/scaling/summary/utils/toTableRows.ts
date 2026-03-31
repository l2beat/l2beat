import type { ScalingSummaryEntry } from '~/server/features/scaling/summary/getScalingSummaryEntries'
import type { TvsTableData } from '~/server/features/scaling/tvs/getTvsTableData'

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
        },
      }
    }

    const {
      warnings,
      breakdown,
      change,
      additionalTrustAssumptionsPercentage,
    } = projectData

    return {
      ...entry,
      tvs: {
        ...entry.tvs,
        breakdown,
        change,
        warnings: [...entry.tvs.warnings, ...warnings],
        additionalTrustAssumptionsPercentage,
      },
    }
  })
}

export type ScalingSummaryTableRow = ReturnType<typeof toTableRows>[number]
