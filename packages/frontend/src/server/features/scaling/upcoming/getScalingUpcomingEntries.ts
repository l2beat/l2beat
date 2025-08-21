import type {
  Project,
  ProjectScalingProofSystem,
  ProjectScalingStack,
} from '@l2beat/config'
import { ps } from '~/server/projects'
import { getProofSystemWithName } from '~/utils/project/getProofSystemWithName'
import type { CommonScalingEntry } from '../getCommonScalingEntry'
import { getCommonScalingEntry } from '../getCommonScalingEntry'

export async function getScalingUpcomingEntries() {
  const [projects, zkCatalogProjects] = await Promise.all([
    ps.getProjects({
      select: ['statuses', 'scalingInfo', 'display'],
      where: ['isScaling', 'isUpcoming'],
    }),
    ps.getProjects({
      select: ['zkCatalogInfo'],
    }),
  ])

  const entries = projects
    .map((project) => getScalingUpcomingEntry(project, zkCatalogProjects))
    .sort((a, b) => b.initialOrder - a.initialOrder)

  return entries
}

export interface ScalingUpcomingEntry extends CommonScalingEntry {
  initialOrder: number
  proofSystem: ProjectScalingProofSystem | undefined
  stacks: ProjectScalingStack[] | undefined
  purposes: string[]
}

export function getScalingUpcomingEntry(
  project: Project<'scalingInfo' | 'statuses' | 'display'>,
  zkCatalogProjects: Project<'zkCatalogInfo'>[],
): ScalingUpcomingEntry {
  return {
    ...getCommonScalingEntry({
      project,
      ongoingAnomaly: false,
      changes: undefined,
    }),
    proofSystem: getProofSystemWithName(
      project.scalingInfo.proofSystem,
      zkCatalogProjects,
    ),
    stacks: project.scalingInfo.stacks,
    purposes: project.scalingInfo.purposes,
    initialOrder: project.addedAt,
  }
}
