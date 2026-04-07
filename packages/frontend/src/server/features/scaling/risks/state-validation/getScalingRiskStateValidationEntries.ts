import type { Project, ProjectScalingProofSystem } from '@l2beat/config'
import { assert } from '@l2beat/shared-pure'
import partition from 'lodash/partition'
import {
  getProjectsChangeReport,
  type ProjectChanges,
} from '~/server/features/projects-change-report/getProjectsChangeReport'
import {
  get7dTvsBreakdown,
  type SevenDayTvsBreakdown,
} from '~/server/features/scaling/tvs/get7dTvsBreakdown'
import {
  getTrustedSetupsWithVerifiersAndAttesters,
  type TrustedSetupsByProofSystem,
} from '~/server/features/zk-catalog/utils/getTrustedSetupsWithVerifiersAndAttesters'
import { ps } from '~/server/projects'
import {
  type ContractUtils,
  getContractUtils,
} from '~/utils/project/contracts-and-permissions/getContractUtils'
import {
  type CommonScalingEntry,
  getCommonScalingEntry,
} from '../../getCommonScalingEntry'

export async function getScalingRiskStateValidationEntries() {
  const [
    projectsChangeReport,
    projects,
    zkCatalogProjects,
    allProjects,
    contractUtils,
    tvs,
  ] = await Promise.all([
    getProjectsChangeReport(),
    ps.getProjects({
      select: ['statuses', 'scalingInfo', 'scalingRisks', 'display'],
      optional: ['contracts'],
      where: ['isScaling'],
      whereNot: ['isUpcoming', 'archivedAt'],
    }),
    ps.getProjects({
      select: ['zkCatalogInfo'],
    }),
    ps.getProjects({
      optional: ['daBridge', 'isScaling', 'isDaLayer'],
    }),
    getContractUtils(),
    get7dTvsBreakdown({ type: 'all' }),
  ])

  const reviewedProjects = projects.filter(
    (p) => p.statuses.reviewStatus !== 'initialReview',
  )

  const [withProofSystem, noProofsProjects] = partition(
    reviewedProjects,
    (p) => !!p.scalingInfo.proofSystem,
  )

  const [validityProjects, optimisticProjects] = partition(
    withProofSystem,
    (p) => p.scalingInfo.proofSystem?.type === 'Validity',
  )

  const validityEntries = validityProjects.map((project) =>
    getScalingRiskStateValidationValidityEntry(
      project,
      projectsChangeReport.getChanges(project.id),
      zkCatalogProjects,
      contractUtils,
      tvs,
      allProjects,
    ),
  )
  const optimisticEntries = optimisticProjects.map((project) =>
    getScalingRiskStateValidationOptimisticEntry(
      project,
      projectsChangeReport.getChanges(project.id),
      zkCatalogProjects,
    ),
  )
  const noProofsEntries = noProofsProjects.map((project) =>
    getScalingRiskStateValidationNoProofsEntry(
      project,
      projectsChangeReport.getChanges(project.id),
    ),
  )

  return {
    validity: validityEntries,
    optimistic: optimisticEntries,
    noProofs: noProofsEntries,
  }
}

export interface ScalingRiskStateValidationValidityEntry
  extends CommonScalingEntry {
  proofSystem: ProjectScalingProofSystem
  isa: string | undefined
  trustedSetupsByProofSystem: TrustedSetupsByProofSystem
  executionDelay: number | undefined
}

function getScalingRiskStateValidationValidityEntry(
  project: Project<
    'scalingInfo' | 'statuses' | 'display' | 'scalingRisks',
    'contracts'
  >,
  changes: ProjectChanges,
  zkCatalogProjects: Project<'zkCatalogInfo'>[],
  contractUtils: ContractUtils,
  tvs: SevenDayTvsBreakdown,
  allProjects: Project<never, 'daBridge' | 'isScaling' | 'isDaLayer'>[],
): ScalingRiskStateValidationValidityEntry {
  const proofSystem = project.scalingInfo?.proofSystem
  assert(proofSystem, 'Proof system is required')

  const zkCatalogProject = zkCatalogProjects.find(
    (p) => p.id === proofSystem.zkCatalogId,
  )
  assert(zkCatalogProject, `zkCatalogProject not found: ${project.id}`)

  const isa = zkCatalogProject.zkCatalogInfo.techStack.zkVM?.find(
    (tag) => tag.type === 'ISA',
  )

  const trustedSetupsByProofSystem = getTrustedSetupsWithVerifiersAndAttesters(
    zkCatalogProject,
    contractUtils,
    tvs,
    allProjects,
    { id: project.id, contracts: project.contracts },
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
  project: Project<
    'scalingInfo' | 'statuses' | 'display' | 'scalingRisks',
    'contracts'
  >,
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

export type ScalingRiskStateValidationNoProofsEntry = CommonScalingEntry

function getScalingRiskStateValidationNoProofsEntry(
  project: Project<
    'scalingInfo' | 'statuses' | 'display' | 'scalingRisks',
    'contracts'
  >,
  changes: ProjectChanges,
): ScalingRiskStateValidationNoProofsEntry {
  return getCommonScalingEntry({ project, changes })
}
