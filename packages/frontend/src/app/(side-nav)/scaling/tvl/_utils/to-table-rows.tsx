import { type ScalingTvlEntry } from '~/server/features/scaling/tvl/get-scaling-tvl-entries'

export type ScalingTvlTableRow = ReturnType<typeof toTableRows>[number]
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
          ...project.tvl.data,
          breakdown: {
            ...project?.tvl.data.breakdown,
            external: excludeAssociatedTokens
              ? project.tvl.data.breakdown.external -
                project.tvl.data.breakdown.associated.external
              : project.tvl.data.breakdown.external,
            canonical: excludeAssociatedTokens
              ? project.tvl.data.breakdown.canonical -
                project.tvl.data.breakdown.associated.canonical
              : project.tvl.data.breakdown.canonical,
            native: excludeAssociatedTokens
              ? project.tvl.data.breakdown.native -
                project.tvl.data.breakdown.associated.native
              : project.tvl.data.breakdown.native,
            associated: !excludeAssociatedTokens
              ? project.tvl.data.breakdown.associated
              : {
                  native: 0,
                  canonical: 0,
                  external: 0,
                },
          },
        },
      },
    }
  })
}
