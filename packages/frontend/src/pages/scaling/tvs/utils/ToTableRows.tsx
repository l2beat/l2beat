import type { ScalingTvsEntry } from '~/server/features/scaling/tvs/getScalingTvsEntries'

export function toTableRows({
  projects,
  excludeAssociatedTokens,
}: {
  projects: ScalingTvsEntry[]
  excludeAssociatedTokens?: boolean
}) {
  return projects.map((project) => {
    return {
      ...project,
      tvs: {
        ...project.tvs,
        data: project.tvs.data && {
          breakdown: {
            ...project?.tvs.data.breakdown,
            total: excludeAssociatedTokens
              ? project.tvs.data.breakdown.total -
                project.tvs.data.associated.total
              : project.tvs.data.breakdown.total,
            external: excludeAssociatedTokens
              ? project.tvs.data.breakdown.external -
                project.tvs.data.associated.external
              : project.tvs.data.breakdown.external,
            canonical: excludeAssociatedTokens
              ? project.tvs.data.breakdown.canonical -
                project.tvs.data.associated.canonical
              : project.tvs.data.breakdown.canonical,
            native: excludeAssociatedTokens
              ? project.tvs.data.breakdown.native -
                project.tvs.data.associated.native
              : project.tvs.data.breakdown.native,
            ether: excludeAssociatedTokens
              ? project.tvs.data.breakdown.ether -
                project.tvs.data.associated.ether
              : project.tvs.data.breakdown.ether,
            stablecoin: excludeAssociatedTokens
              ? project.tvs.data.breakdown.stablecoin -
                project.tvs.data.associated.stablecoin
              : project.tvs.data.breakdown.stablecoin,
            btc: excludeAssociatedTokens
              ? project.tvs.data.breakdown.btc - project.tvs.data.associated.btc
              : project.tvs.data.breakdown.btc,
            other: excludeAssociatedTokens
              ? project.tvs.data.breakdown.other -
                project.tvs.data.associated.other
              : project.tvs.data.breakdown.other,
          },
          change: {
            ...project.tvs.data.change,
            total: excludeAssociatedTokens
              ? project.tvs.data.changeExcludingAssociated.total
              : project.tvs.data.change.total,
            canonical: excludeAssociatedTokens
              ? project.tvs.data.changeExcludingAssociated.canonical
              : project.tvs.data.change.canonical,
            native: excludeAssociatedTokens
              ? project.tvs.data.changeExcludingAssociated.native
              : project.tvs.data.change.native,
            external: excludeAssociatedTokens
              ? project.tvs.data.changeExcludingAssociated.external
              : project.tvs.data.change.external,
            ether: excludeAssociatedTokens
              ? project.tvs.data.changeExcludingAssociated.ether
              : project.tvs.data.change.ether,
            stablecoin: excludeAssociatedTokens
              ? project.tvs.data.changeExcludingAssociated.stablecoin
              : project.tvs.data.change.stablecoin,
            btc: excludeAssociatedTokens
              ? project.tvs.data.changeExcludingAssociated.btc
              : project.tvs.data.change.btc,
            other: excludeAssociatedTokens
              ? project.tvs.data.changeExcludingAssociated.other
              : project.tvs.data.change.other,
          },
        },
      },
    }
  })
}

export type ScalingTvsTableRow = ReturnType<typeof toTableRows>[number]
