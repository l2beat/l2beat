import {
  ProjectService,
  type ProjectWith,
  type ScalingProjectCategory,
  type ScalingProjectStack,
} from '@l2beat/config'
import { groupByTabs } from '~/utils/group-by-tabs'
import {
  type CommonScalingEntry,
  getCommonScalingEntry2,
} from '../get-common-scaling-entry'

export async function getScalingUpcomingEntries() {
  const projects = await ProjectService.STATIC.getProjects({
    select: ['statuses', 'scalingInfo'],
    optional: ['countdowns'],
    where: ['isScaling', 'isUpcoming'],
  })

  const entries = projects
    .sort((a, b) => b.addedAt.toNumber() - a.addedAt.toNumber())
    .map((project) => getScalingUpcomingEntry(project))

  return groupByTabs(entries)
}

export interface ScalingUpcomingEntry extends CommonScalingEntry {
  category: ScalingProjectCategory
  provider: ScalingProjectStack | undefined
  purposes: string[]
}

function getScalingUpcomingEntry(
  project: ProjectWith<'scalingInfo' | 'statuses', 'countdowns'>,
): ScalingUpcomingEntry {
  return {
    ...getCommonScalingEntry2({
      project,
      changes: undefined,
      syncStatus: undefined,
    }),
    category: project.scalingInfo.type,
    provider: project.scalingInfo.stack,
    purposes: project.scalingInfo.purposes,
  }
}
