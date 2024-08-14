import { type ScalingTvlEntry } from '~/server/features/scaling/tvl/get-scaling-tvl-entries'

export function toTableRows({
  projects,
  excludeAssociatedTokens,
}: {
  projects: ScalingTvlEntry[]
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

export type ScalingTvlTableRow = ReturnType<typeof toTableRows>[number]
