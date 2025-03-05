import type {
  Project,
  ProjectScalingCategory,
  ProjectScalingStack,
} from '@l2beat/config'
import { groupByScalingTabs } from '~/app/(side-nav)/scaling/_utils/group-by-scaling-tabs'
import { ps } from '~/server/projects'
import type { CommonScalingEntry } from '../get-common-scaling-entry'
import { getCommonScalingEntry } from '../get-common-scaling-entry'

export async function getScalingUpcomingEntries() {
  const projects = await ps.getProjects({
    select: ['statuses', 'scalingInfo', 'display'],
    where: ['isScaling', 'isUpcoming'],
  })

  const entries = projects
    .map((project) => getScalingUpcomingEntry(project))
    .sort((a, b) => b.initialOrder - a.initialOrder)

  return groupByScalingTabs(entries)
}

export interface ScalingUpcomingEntry extends CommonScalingEntry {
  initialOrder: number
  category: ProjectScalingCategory
  stack: ProjectScalingStack | undefined
  purposes: string[]
}

function getScalingUpcomingEntry(
  project: Project<'scalingInfo' | 'statuses' | 'display'>,
): ScalingUpcomingEntry {
  return {
    ...getCommonScalingEntry({ project, changes: undefined }),
    category: project.scalingInfo.type,
    stack: project.scalingInfo.stack,
    purposes: project.scalingInfo.purposes,
    initialOrder: project.addedAt.toNumber(),
  }
}
