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
    const projectData = data?.[project.id]

    if (!projectData) {
      return {
        ...project,
        tvs: {
          ...project.tvs,
          data: undefined,
        },
      }
    }

    const { warnings, breakdown, change } = projectData

    return {
      ...project,
      tvs: {
        ...project.tvs,
        data: {
          breakdown,
          change,
        },
        warnings: [...project.tvs.warnings, ...warnings],
      },
    }
  })
}

export type ScalingTvsTableRow = ReturnType<typeof toTableRows>[number]
