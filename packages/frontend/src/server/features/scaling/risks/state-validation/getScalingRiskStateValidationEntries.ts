import type {
  Project,
  ProjectScalingProofSystem,
  TrustedSetup,
  ZkCatalogTag,
} from '@l2beat/config'
import { assert, type ProjectId } from '@l2beat/shared-pure'
import groupBy from 'lodash/groupBy'
import partition from 'lodash/partition'
import { groupByScalingTabs } from '~/pages/scaling/utils/groupByScalingTabs'
import {
  getProjectsChangeReport,
  type ProjectChanges,
} from '~/server/features/projects-change-report/getProjectsChangeReport'
import {
  getVerifiersWithAttesters,
  type TrustedSetupVerifierData,
} from '~/server/features/zk-catalog/getZkCatalogEntries'
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
        select: ['statuses', 'scalingInfo', 'scalingRisks', 'display'],
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
  trustedSetupsByProofSystem?: Record<
    string,
    {
      trustedSetups: (TrustedSetup & {
        proofSystem: ZkCatalogTag
      })[]
      verifiers: {
        successful?: TrustedSetupVerifierData
        unsuccessful?: TrustedSetupVerifierData
        notVerified?: TrustedSetupVerifierData
      }
    }
  >
  executionDelay: number | undefined
}

function getScalingRiskStateValidationZkEntry(
  project: Project<'scalingInfo' | 'statuses' | 'display' | 'scalingRisks'>,
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

  const trustedSetupsByProofSystem = getTrustedSetupsByProofSystem(
    zkCatalogProject,
    project.id,
  )

  return {
    ...getCommonScalingEntry({ project, changes }),
    proofSystem: {
      ...proofSystem,
      name: proofSystem.name ?? zkCatalogProject?.name,
    },
    isa: isa?.name,
    trustedSetupsByProofSystem,
    executionDelay: project.scalingRisks.self.stateValidation?.executionDelay,
  }
}

export interface ScalingRiskStateValidationOptimisticEntry
  extends CommonScalingEntry {
  proofSystem: ProjectScalingProofSystem
  executionDelay: number | undefined
  challengePeriod: number | undefined
  initialBond: string | undefined
}

function getScalingRiskStateValidationOptimisticEntry(
  project: Project<'scalingInfo' | 'statuses' | 'display' | 'scalingRisks'>,
  changes: ProjectChanges,
  zkCatalogProjects: Project<'zkCatalogInfo'>[],
): ScalingRiskStateValidationOptimisticEntry {
  const proofSystem = project.scalingInfo?.proofSystem
  assert(proofSystem, 'Proof system is required')

  const zkCatalogProject = zkCatalogProjects.find(
    (p) => p.id === proofSystem.zkCatalogId,
  )

  const { stateValidation } =
    project.scalingRisks.stacked ?? project.scalingRisks.self

  return {
    ...getCommonScalingEntry({ project, changes }),
    proofSystem: {
      ...proofSystem,
      name: proofSystem.name ?? zkCatalogProject?.name,
    },
    executionDelay: stateValidation?.executionDelay,
    challengePeriod: stateValidation?.challengeDelay,
    initialBond: stateValidation?.initialBond,
  }
}

function getTrustedSetupsByProofSystem(
  project: Project<'zkCatalogInfo'>,
  projectId: ProjectId,
): ScalingRiskStateValidationZkEntry['trustedSetupsByProofSystem'] {
  const relevantVerifiers = project.zkCatalogInfo.verifierHashes.filter((v) =>
    v.usedBy.includes(projectId),
  )

  const relevantProofSystemIds = new Set(
    relevantVerifiers.map((v) => `${v.proofSystem.type}-${v.proofSystem.id}`),
  )

  const grouped = groupBy(
    project.zkCatalogInfo.trustedSetups.filter((ts) =>
      relevantProofSystemIds.has(`${ts.proofSystem.type}-${ts.proofSystem.id}`),
    ),
    (ts) => `${ts.proofSystem.type}-${ts.proofSystem.id}`,
  )

  return Object.fromEntries(
    Object.entries(grouped).map(([key, trustedSetups]) => {
      const trustedSetupVerifiers = relevantVerifiers.filter(
        (v) => key === `${v.proofSystem.type}-${v.proofSystem.id}`,
      )

      const groupedByStatus = groupBy(
        trustedSetupVerifiers,
        (v) => v.verificationStatus,
      )
      return [
        key,
        {
          trustedSetups,
          verifiers: {
            successful: getVerifiersWithAttesters(
              groupedByStatus,
              'successful',
            ),
            unsuccessful: getVerifiersWithAttesters(
              groupedByStatus,
              'unsuccessful',
            ),
            notVerified: getVerifiersWithAttesters(
              groupedByStatus,
              'notVerified',
            ),
          },
        },
      ]
    }),
  )
}
