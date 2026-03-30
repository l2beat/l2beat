import compact from 'lodash/compact'
import type { ScalingSummaryEntry } from '~/server/features/scaling/summary/getScalingSummaryEntries'
import type { TvsTableData } from '~/server/features/scaling/tvs/getTvsTableData'

export function toTableRows({
  projects,
  tvsTableData,
}: {
  projects: ScalingSummaryEntry[]
  tvsTableData: TvsTableData | undefined
}) {
  return projects.map((project) => {
    const tvsTableProjectData = tvsTableData?.[project.id]
    return {
      ...project,
      tvs: {
        ...tvsTableProjectData,
        associatedTokens: project.tvs.associatedTokens,
        warnings: compact([
          ...project.tvs.warnings,
          tvsTableData?.[project.id]?.associatedTokenWarning,
        ]),
      },
    }
  })
}

export type ScalingSummaryTableRow = ReturnType<typeof toTableRows>[number]
