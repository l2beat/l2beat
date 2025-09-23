import type { Project } from '@l2beat/config'
import { temporarilyExtractFirstElement } from '../utils'

export type ProjectsByDaLayer = Record<string, number>

export function getProjectsByDaLayer(
  ecosystemProjects: Project<'scalingInfo'>[],
): ProjectsByDaLayer {
  const projectsByDaLayer = ecosystemProjects.reduce((acc, curr) => {
    const daLayer = curr.scalingInfo.daLayer
    const da = temporarilyExtractFirstElement(daLayer)
    // TODO: this is a hack - support daLayer being a list!
    if (da === undefined) return acc
    if (!acc[da]) {
      acc[da] = 0
    }
    acc[da] += 1
    return acc
  }, {} as ProjectsByDaLayer)

  // Sort the entries so that Ethereum is always first
  const sortedEntries = Object.entries(projectsByDaLayer).sort(([a], [b]) => {
    if (a === 'Ethereum') return -1
    if (b === 'Ethereum') return 1
    return a.localeCompare(b)
  })

  return Object.fromEntries(sortedEntries)
}
