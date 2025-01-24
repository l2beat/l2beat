import {
  type Project,
  ProjectService,
  type ScalingProjectCategory,
  type ScalingProjectStack,
} from '@l2beat/config'
import { groupByTabs } from '~/utils/group-by-tabs'
import {
  type CommonScalingEntry,
  getCommonScalingEntry,
} from '../get-common-scaling-entry'

export async function getScalingUpcomingEntries() {
  const projects = await ProjectService.STATIC.getProjects({
    select: ['statuses', 'scalingInfo'],
    where: ['isScaling', 'isUpcoming'],
  })

  const entries = projects
    .map((project) => getScalingUpcomingEntry(project))
    .sort((a, b) => b.initialOrder - a.initialOrder)

  return groupByTabs(entries)
}

export interface ScalingUpcomingEntry extends CommonScalingEntry {
  initialOrder: number
  category: ScalingProjectCategory
  provider: ScalingProjectStack | undefined
  purposes: string[]
}

function getScalingUpcomingEntry(
  project: Project<'scalingInfo' | 'statuses'>,
): ScalingUpcomingEntry {
  return {
    ...getCommonScalingEntry({ project, changes: undefined }),
    category: project.scalingInfo.type,
    provider: project.scalingInfo.stack,
    purposes: project.scalingInfo.purposes,
    initialOrder: project.addedAt.toNumber(),
  }
}
