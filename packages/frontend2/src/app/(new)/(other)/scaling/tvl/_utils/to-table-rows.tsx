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
              external: excludeAssociatedTokens
                ? project?.tvl.breakdown.external -
                  project?.tvl.breakdown.associated.external
                : project?.tvl.breakdown.external,
              canonical: excludeAssociatedTokens
                ? project?.tvl.breakdown.canonical -
                  project?.tvl.breakdown.associated.canonical
                : project?.tvl.breakdown.canonical,
              native: excludeAssociatedTokens
                ? project?.tvl.breakdown.native -
                  project?.tvl.breakdown.associated.native
                : project?.tvl.breakdown.native,
              associated: excludeAssociatedTokens
                ? project?.tvl.breakdown.associated
                : undefined,
            }
          : undefined,
      },
    }
  })
}

export type ScalingTvlTableRow = ReturnType<typeof toTableRows>[number]
