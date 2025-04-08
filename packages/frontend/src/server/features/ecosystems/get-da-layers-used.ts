import type { Project } from '@l2beat/config'

export function getDaLayersUsed(ecosystemProjects: Project<'scalingInfo'>[]) {
  return ecosystemProjects
    .map((p) => p.scalingInfo.daLayer)
    .reduce(
      (acc, curr) => {
        const record = acc[curr]
        if (record) {
          acc[curr] = record + 1
        } else {
          acc[curr] = 1
        }
        return acc
      },
      {} as Record<string, number>,
    )
}
