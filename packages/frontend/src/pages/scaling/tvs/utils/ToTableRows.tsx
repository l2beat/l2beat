import type { SevenDayTvsBreakdown } from '~/server/features/scaling/tvs/get7dTvsBreakdown'
import type { ScalingTvsEntry } from '~/server/features/scaling/tvs/getScalingTvsEntries'

export function toTableRows({
  projects,
  sevenDayBreakdown,
}: {
  projects: ScalingTvsEntry[]
  sevenDayBreakdown: SevenDayTvsBreakdown | undefined
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
