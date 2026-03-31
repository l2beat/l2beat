import compact from 'lodash/compact'
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
    return {
      ...entry,
      tvs: {
        ...projectData,
        associatedTokens: entry.tvs.associatedTokens,
        warnings: compact([
          ...entry.tvs.warnings,
          ...(projectData?.warnings ?? []),
        ]),
      },
    }
  })
}

export type ScalingSummaryTableRow = ReturnType<typeof toTableRows>[number]
