import type {
  Project,
  ProjectAssociatedToken,
  ProjectScalingProofSystem,
  WarningWithSentiment,
} from '@l2beat/config'
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
import { compareTvs } from '~/server/features/scaling/tvs/utils/compareTvs'
import { getTvsSyncWarning } from '~/server/features/scaling/tvs/utils/syncStatus'
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
      optional: ['contracts', 'tvsInfo'],
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
      tvs,
      contractUtils,
    ),
  )
  const noProofsEntries = noProofsProjects.map((project) =>
    getScalingRiskStateValidationNoProofsEntry(
      project,
      projectsChangeReport.getChanges(project.id),
      tvs,
    ),
  )

  return {
    validity: validityEntries.sort(compareTvs),
    optimistic: optimisticEntries.sort(compareTvs),
    noProofs: noProofsEntries.sort(compareTvs),
  }
}

export interface ScalingRiskStateValidationValidityEntry
  extends CommonScalingEntry {
  tvsOrder: number
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
    tvsOrder: tvs.projects[project.id.toString()]?.breakdown?.total ?? -1,
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
  tvsOrder: number
  proofSystem: ProjectScalingProofSystem
  executionDelay: number | undefined
  challengePeriod: number | undefined
  initialBond: string | undefined
  zkCatalog:
    | {
        name: string
        id: string
        hasSuccessful: boolean
        hasUnsuccessful: boolean
        hasNotVerified: boolean
      }
    | undefined
}

function getScalingRiskStateValidationOptimisticEntry(
  project: Project<
    'scalingInfo' | 'statuses' | 'display' | 'scalingRisks',
    'contracts'
  >,
  changes: ProjectChanges,
  zkCatalogProjects: Project<'zkCatalogInfo'>[],
  tvs: SevenDayTvsBreakdown,
  contractUtils: ContractUtils,
): ScalingRiskStateValidationOptimisticEntry {
  const proofSystem = project.scalingInfo?.proofSystem
  assert(proofSystem, 'Proof system is required')

  const zkCatalogProject = zkCatalogProjects.find(
    (p) => p.id === proofSystem.zkCatalogId,
  )

  const { stateValidation } =
    project.scalingRisks.stacked ?? project.scalingRisks.self

  let zkCatalog: ScalingRiskStateValidationOptimisticEntry['zkCatalog']
  if (zkCatalogProject && proofSystem.zkCatalogId) {
    const trustedSetups = getTrustedSetupsWithVerifiersAndAttesters(
      zkCatalogProject,
      contractUtils,
      tvs,
      [],
      { id: project.id, contracts: project.contracts },
    )
    const allVerifiers = Object.values(trustedSetups).map((ts) => ts.verifiers)
    const hasUnsuccessful = allVerifiers.some((v) => v.unsuccessful)
    const hasNotVerified = allVerifiers.some((v) => v.notVerified)
    const hasSuccessful = allVerifiers.some((v) => v.successful)

    zkCatalog = {
      name: zkCatalogProject.name,
      id: proofSystem.zkCatalogId,
      hasSuccessful,
      hasUnsuccessful,
      hasNotVerified,
    }
  }

  return {
    ...getCommonScalingEntry({ project, changes }),
    tvsOrder: tvs.projects[project.id.toString()]?.breakdown?.total ?? -1,
    proofSystem: {
      ...proofSystem,
      name: proofSystem.name ?? zkCatalogProject?.name,
    },
    executionDelay: stateValidation?.executionDelay,
    challengePeriod: stateValidation?.challengeDelay,
    initialBond: stateValidation?.initialBond,
    zkCatalog,
  }
}

export interface ScalingRiskStateValidationNoProofsEntry
  extends CommonScalingEntry {
  tvsOrder: number
  tvs: {
    associatedTokens: ProjectAssociatedToken[]
    warnings: WarningWithSentiment[]
    breakdown: SevenDayTvsBreakdown['projects'][string]['breakdown'] | undefined
    change: SevenDayTvsBreakdown['projects'][string]['change'] | undefined
    additionalTrustAssumptionsPercentage: number | undefined
    syncWarning: string | undefined
  }
}

function getScalingRiskStateValidationNoProofsEntry(
  project: Project<
    'scalingInfo' | 'statuses' | 'display' | 'scalingRisks',
    'contracts' | 'tvsInfo'
  >,
  changes: ProjectChanges,
  tvs: SevenDayTvsBreakdown,
): ScalingRiskStateValidationNoProofsEntry {
  const projectTvs = tvs.projects[project.id.toString()]
  return {
    ...getCommonScalingEntry({ project, changes }),
    tvsOrder: projectTvs?.breakdown?.total ?? -1,
    tvs: {
      associatedTokens: project.tvsInfo?.associatedTokens ?? [],
      warnings: project.tvsInfo?.warnings ?? [],
      breakdown: projectTvs?.breakdown,
      change: projectTvs?.change,
      additionalTrustAssumptionsPercentage:
        projectTvs?.additionalTrustAssumptionsPercentage,
      syncWarning: getTvsSyncWarning(projectTvs?.syncState),
    },
  }
}
