import { type ScalingSummaryEntry } from '~/server/features/scaling/summary/get-scaling-summary-entries'

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
      tvl: {
        ...project.tvl,
        warnings: excludeAssociatedTokens
          ? project.tvl.associatedTokensExcludedChange
          : project.tvl.warnings,
        change: excludeAssociatedTokens
          ? project.tvl.associatedTokensExcludedChange
          : project.tvl.change,
        breakdown: project?.tvl.breakdown
          ? {
              ...project.tvl.breakdown,
              total: excludeAssociatedTokens
                ? project.tvl.breakdown.total - project.tvl.breakdown.associated
                : project.tvl.breakdown.total,
              associated: excludeAssociatedTokens
                ? 0
                : project.tvl.breakdown.associated,
            }
          : undefined,
      },
    }
  })
}

export type ScalingSummaryTableRow = ReturnType<typeof toTableRows>[number]
