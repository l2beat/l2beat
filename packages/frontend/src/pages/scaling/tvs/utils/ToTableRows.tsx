import type { ScalingTvsEntry } from '~/server/features/scaling/tvs/getScalingTvsEntries'
import type { TvsTableData } from '~/server/features/scaling/tvs/getTvsTableData'

export function toTableRows({
  projects,
  tvsTableData,
}: {
  projects: ScalingTvsEntry[]
  tvsTableData: TvsTableData | undefined
}) {
  return projects.map((project) => {
    const tvsTableProjectData = tvsTableData?.[project.id]
    return {
      ...project,
      tvs: {
        ...project.tvs,
        data: tvsTableProjectData,
      },
    }
  })
}

export type ScalingTvsTableRow = ReturnType<typeof toTableRows>[number]
