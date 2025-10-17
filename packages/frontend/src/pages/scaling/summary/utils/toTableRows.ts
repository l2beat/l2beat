import type { ScalingSummaryEntry } from '~/server/features/scaling/summary/getScalingSummaryEntries'
import type { SevenDayTvsBreakdown } from '~/server/features/scaling/tvs/get7dTvsBreakdown'

export function toTableRows({
  projects,
  sevenDayBreakdown,
  excludeAssociatedTokens,
}: {
  projects: ScalingSummaryEntry[]
  sevenDayBreakdown: SevenDayTvsBreakdown | undefined
  excludeAssociatedTokens: boolean
}) {
  return projects.map((project) => {
    const sevenDayBreakdownProject = sevenDayBreakdown?.projects[project.id]
    return {
      ...project,
      tvs: {
        associatedTokens: project.tvs.associatedTokens,
        ...sevenDayBreakdownProject,
        warnings: excludeAssociatedTokens
          ? project.tvs.associatedTokensExcludedWarnings
          : project.tvs.warnings,
      },
    }
  })
}

export type ScalingSummaryTableRow = ReturnType<typeof toTableRows>[number]
