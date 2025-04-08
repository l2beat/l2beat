import type { Project } from '@l2beat/config'

export type DaLayersUsed = Record<string, number>

export function getDaLayersUsed(
  ecosystemProjects: Project<'scalingInfo'>[],
): DaLayersUsed {
  return ecosystemProjects
    .map((p) => p.scalingInfo.daLayer)
    .reduce((acc, curr) => {
      const record = acc[curr]
      if (record) {
        acc[curr] = record + 1
      } else {
        acc[curr] = 1
      }
      return acc
    }, {} as DaLayersUsed)
}
