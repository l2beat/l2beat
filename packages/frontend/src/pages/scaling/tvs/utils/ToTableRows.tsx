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
          total: project.tvs.data.breakdown.total,
          breakdown: {
            ...project?.tvs.data.breakdown,
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
            associated: !excludeAssociatedTokens
              ? project.tvs.data.associated
              : { native: 0, canonical: 0, external: 0 },
          },
          change: {
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
          },
        },
      },
    }
  })
}

export type ScalingTvsTableRow = ReturnType<typeof toTableRows>[number]
