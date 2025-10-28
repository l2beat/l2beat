import type { SevenDayTvsBreakdown } from '~/server/features/scaling/tvs/get7dTvsBreakdown'
import type { ScalingTvsEntry } from '~/server/features/scaling/tvs/getScalingTvsEntries'

export function toTableRows({
  projects,
  excludeAssociatedTokens,
  sevenDayBreakdown,
}: {
  projects: ScalingTvsEntry[]
  sevenDayBreakdown: SevenDayTvsBreakdown | undefined
  excludeAssociatedTokens?: boolean
}) {
  return projects.map((project) => {
    const sevenDayBreakdownProject = sevenDayBreakdown?.projects[project.id]
    return {
      ...project,
      tvs: {
        ...project.tvs,
        data: sevenDayBreakdownProject && {
          ...sevenDayBreakdownProject,
        },
      },
    }
  })
}

export type ScalingTvsTableRow = ReturnType<typeof toTableRows>[number]
