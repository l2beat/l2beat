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
        data: project.tvl.data && {
          total: project.tvl.data.breakdown.total,
          breakdown: {
            ...project?.tvl.data.breakdown,
            external: excludeAssociatedTokens
              ? project.tvl.data.breakdown.external -
                project.tvl.data.associated.external
              : project.tvl.data.breakdown.external,
            canonical: excludeAssociatedTokens
              ? project.tvl.data.breakdown.canonical -
                project.tvl.data.associated.canonical
              : project.tvl.data.breakdown.canonical,
            native: excludeAssociatedTokens
              ? project.tvl.data.breakdown.native -
                project.tvl.data.associated.native
              : project.tvl.data.breakdown.native,
            associated: !excludeAssociatedTokens
              ? project.tvl.data.associated
              : { native: 0, canonical: 0, external: 0 },
          },
          change: {
            total: excludeAssociatedTokens
              ? project.tvl.data.changeExcludingAssociated.total
              : project.tvl.data.change.total,
            canonical: excludeAssociatedTokens
              ? project.tvl.data.changeExcludingAssociated.canonical
              : project.tvl.data.change.canonical,
            native: excludeAssociatedTokens
              ? project.tvl.data.changeExcludingAssociated.native
              : project.tvl.data.change.native,
            external: excludeAssociatedTokens
              ? project.tvl.data.changeExcludingAssociated.external
              : project.tvl.data.change.external,
          },
        },
      },
    }
  })
}

export type ScalingTvlTableRow = ReturnType<typeof toTableRows>[number]
