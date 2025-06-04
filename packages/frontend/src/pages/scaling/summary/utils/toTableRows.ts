import type { ScalingSummaryEntry } from '~/server/features/scaling/summary/getScalingSummaryEntries'

export function toTableRows({
  projects,
  excludeAssociatedTokens,
}: {
  projects: ScalingSummaryEntry[]
  excludeAssociatedTokens?: boolean
}) {
  return projects.map((project) => {
    return {
      ...project,
      tvs: {
        ...project.tvs,
        warnings: excludeAssociatedTokens
          ? project.tvs.associatedTokensExcludedWarnings
          : project.tvs.warnings,
        change: excludeAssociatedTokens
          ? project.tvs.associatedTokensExcludedChange
          : project.tvs.change,
        breakdown: project?.tvs.breakdown
          ? {
              ...project.tvs.breakdown,
              total: excludeAssociatedTokens
                ? project.tvs.breakdown.total - project.tvs.breakdown.associated
                : project.tvs.breakdown.total,
              associated: excludeAssociatedTokens
                ? 0
                : project.tvs.breakdown.associated,
            }
          : undefined,
      },
    }
  })
}

export type ScalingSummaryTableRow = ReturnType<typeof toTableRows>[number]
