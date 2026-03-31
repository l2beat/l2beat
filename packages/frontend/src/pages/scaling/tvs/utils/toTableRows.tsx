import type { ScalingTvsEntry } from '~/server/features/scaling/tvs/getScalingTvsEntries'
import type { TvsTableData } from '~/server/features/scaling/tvs/getTvsTableData'

export function toTableRows({
  entries,
  data,
}: {
  entries: ScalingTvsEntry[]
  data: TvsTableData | undefined
}) {
  return entries.map((project) => {
    const tvsTableProjectData = data?.[project.id]
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
