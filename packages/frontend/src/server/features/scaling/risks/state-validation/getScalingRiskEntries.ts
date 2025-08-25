import type { Project } from '@l2beat/config'
import partition from 'lodash/partition'
import { groupByScalingTabs } from '~/pages/scaling/utils/groupByScalingTabs'
import {
  getProjectsChangeReport,
  type ProjectChanges,
} from '~/server/features/projects-change-report/getProjectsChangeReport'
import { ps } from '~/server/projects'
import {
  type CommonScalingEntry,
  getCommonScalingEntry,
} from '../../getCommonScalingEntry'

export async function getScalingRiskStateValidationEntries() {
  const [projectsChangeReport, projects] = await Promise.all([
    getProjectsChangeReport(),
    ps.getProjects({
      select: [
        'statuses',
        'scalingInfo',
        'scalingRisks',
        'display',
        'scalingTechnology',
      ],
      optional: ['customDa', 'scalingDa'],
      where: ['isScaling'],
      whereNot: ['isUpcoming', 'archivedAt'],
    }),
  ])

  const [zkProjects, optimisticProjects] = partition(
    projects.filter((p) => p.scalingInfo.proofSystem),
    (p) => p.scalingInfo.proofSystem?.type === 'Validity',
  )

  const zkEntries = zkProjects.map((project) =>
    getScalingRiskStateValidationZkEntry(
      project,
      projectsChangeReport.getChanges(project.id),
    ),
  )
  const optimisticEntries = optimisticProjects.map((project) =>
    getScalingRiskStateValidationOptimisticEntry(
      project,
      projectsChangeReport.getChanges(project.id),
    ),
  )

  return {
    zk: groupByScalingTabs(zkEntries),
    optimistic: groupByScalingTabs(optimisticEntries),
  }
}

export interface ScalingRiskStateValidationZkEntry extends CommonScalingEntry {}

function getScalingRiskStateValidationZkEntry(
  project: Project<'scalingInfo' | 'statuses' | 'display'>,
  changes: ProjectChanges,
): ScalingRiskStateValidationZkEntry {
  return {
    ...getCommonScalingEntry({ project, changes }),
  }
}
export interface ScalingRiskStateValidationOptimisticEntry
  extends CommonScalingEntry {}

function getScalingRiskStateValidationOptimisticEntry(
  project: Project<'scalingInfo' | 'statuses' | 'display'>,
  changes: ProjectChanges,
): ScalingRiskStateValidationOptimisticEntry {
  return {
    ...getCommonScalingEntry({ project, changes }),
  }
}
