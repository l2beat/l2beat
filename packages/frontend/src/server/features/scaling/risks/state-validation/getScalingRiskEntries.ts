import type { Project, ProjectScalingProofSystem } from '@l2beat/config'
import { assert } from '@l2beat/shared-pure'
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
  const [projectsChangeReport, projects, zkCatalogProjects] = await Promise.all(
    [
      getProjectsChangeReport(),
      ps.getProjects({
        select: [
          'statuses',
          'scalingInfo',
          'scalingRisks',
          'display',
          'scalingTechnology',
        ],
        where: ['isScaling'],
        whereNot: ['isUpcoming', 'archivedAt'],
      }),
      ps.getProjects({
        select: ['zkCatalogInfo'],
      }),
    ],
  )

  const [zkProjects, optimisticProjects] = partition(
    projects.filter(
      (p) =>
        p.scalingInfo.proofSystem &&
        p.statuses.reviewStatus !== 'initialReview',
    ),
    (p) => p.scalingInfo.proofSystem?.type === 'Validity',
  )

  const zkEntries = zkProjects.map((project) =>
    getScalingRiskStateValidationZkEntry(
      project,
      projectsChangeReport.getChanges(project.id),
      zkCatalogProjects,
    ),
  )
  const optimisticEntries = optimisticProjects.map((project) =>
    getScalingRiskStateValidationOptimisticEntry(
      project,
      projectsChangeReport.getChanges(project.id),
      zkCatalogProjects,
    ),
  )

  return {
    zk: groupByScalingTabs(zkEntries),
    optimistic: groupByScalingTabs(optimisticEntries),
  }
}

export interface ScalingRiskStateValidationZkEntry extends CommonScalingEntry {
  proofSystem: ProjectScalingProofSystem
  isa: string | undefined
}

function getScalingRiskStateValidationZkEntry(
  project: Project<'scalingInfo' | 'statuses' | 'display'>,
  changes: ProjectChanges,
  zkCatalogProjects: Project<'zkCatalogInfo'>[],
): ScalingRiskStateValidationZkEntry {
  const proofSystem = project.scalingInfo?.proofSystem
  assert(proofSystem, 'Proof system is required')

  const zkCatalogProject = zkCatalogProjects.find(
    (p) => p.id === proofSystem.zkCatalogId,
  )
  assert(zkCatalogProject, `zkCatalogProject not found: ${project.id}`)

  const isa = zkCatalogProject.zkCatalogInfo.techStack.zkVM?.find(
    (tag) => tag.type === 'ISA',
  )

  return {
    ...getCommonScalingEntry({ project, changes }),
    proofSystem: {
      ...proofSystem,
      name: proofSystem.name ?? zkCatalogProject?.name,
    },
    isa: isa?.name,
  }
}
export interface ScalingRiskStateValidationOptimisticEntry
  extends CommonScalingEntry {
  proofSystem: ProjectScalingProofSystem
}

function getScalingRiskStateValidationOptimisticEntry(
  project: Project<'scalingInfo' | 'statuses' | 'display'>,
  changes: ProjectChanges,
  zkCatalogProjects: Project<'zkCatalogInfo'>[],
): ScalingRiskStateValidationOptimisticEntry {
  const proofSystem = project.scalingInfo?.proofSystem
  assert(proofSystem, 'Proof system is required')

  const zkCatalogProject = zkCatalogProjects.find(
    (p) => p.id === proofSystem.zkCatalogId,
  )

  return {
    ...getCommonScalingEntry({ project, changes }),
    proofSystem: {
      ...proofSystem,
      name: proofSystem.name ?? zkCatalogProject?.name,
    },
  }
}
