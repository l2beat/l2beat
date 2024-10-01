import { type ScalingSummaryEntryV2 } from '~/server/features/scaling/summary/get-scaling-summary-entries-v2'

export function toTableRows({
  projects,
  excludeAssociatedTokens,
}: {
  projects: ScalingSummaryEntryV2[]
  excludeAssociatedTokens?: boolean
}) {
  return projects.map((project) => {
    return {
      ...project,
      tvl: {
        ...project.tvl,
        breakdown: project?.tvl.breakdown
          ? {
              ...project?.tvl.breakdown,
              total: excludeAssociatedTokens
                ? project?.tvl.breakdown.total -
                  project?.tvl.breakdown.associated
                : project?.tvl.breakdown.total,
              associated: excludeAssociatedTokens
                ? 0
                : project?.tvl.breakdown.associated,
            }
          : undefined,
      },
    }
  })
}

export type ScalingSummaryTableRow = ReturnType<typeof toTableRows>[number]
