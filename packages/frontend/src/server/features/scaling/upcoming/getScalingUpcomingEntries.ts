import type {
  Project,
  ProjectScalingCategory,
  ProjectScalingStack,
} from '@l2beat/config'
import { groupByScalingTabs } from '~/pages/scaling/utils/groupByScalingTabs'
import { ps } from '~/server/projects'
import type { CommonScalingEntry } from '../getCommonScalingEntry'
import { getCommonScalingEntry } from '../getCommonScalingEntry'

export async function getScalingUpcomingEntries() {
  const projects = await ps.getProjects({
    select: ['statuses', 'scalingInfo', 'display'],
    where: ['isScaling', 'isUpcoming'],
    optional: ['hasTestnet'],
  })

  const entries = projects
    .map((project) => getScalingUpcomingEntry(project))
    .sort((a, b) => b.initialOrder - a.initialOrder)

  return groupByScalingTabs(entries)
}

export interface ScalingUpcomingEntry extends CommonScalingEntry {
  hasTestnet: boolean
  initialOrder: number
  category: ProjectScalingCategory
  stacks: ProjectScalingStack[] | undefined
  purposes: string[]
}

export function getScalingUpcomingEntry(
  project: Project<'scalingInfo' | 'statuses' | 'display', 'hasTestnet'>,
): ScalingUpcomingEntry {
  const commonEntry = getCommonScalingEntry({
    project,
    ongoingAnomaly: false,
    changes: undefined,
  })
  return {
    ...commonEntry,
    hasTestnet: !!project.hasTestnet,
    category: project.scalingInfo.type,
    stacks: project.scalingInfo.stacks,
    purposes: project.scalingInfo.purposes,
    initialOrder: project.addedAt,
    filterable: [
      {
        id: 'hasTestnet',
        value: project.hasTestnet ? 'Yes' : 'No',
      },
      ...(commonEntry.filterable ?? []),
    ],
  }
}
