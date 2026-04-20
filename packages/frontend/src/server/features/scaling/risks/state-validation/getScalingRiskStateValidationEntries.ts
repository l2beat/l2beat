import type {
  Project,
  ProjectAssociatedToken,
  ProjectScalingProofSystem,
  WarningWithSentiment,
} from '@l2beat/config'
import { assert, notUndefined } from '@l2beat/shared-pure'
import partition from 'lodash/partition'
import uniq from 'lodash/uniq'
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
      where: ['scalingInfo'],
      whereNot: ['isUpcoming', 'archivedAt'],
    }),
    ps.getProjects({
      select: ['zkCatalogInfo'],
    }),
    ps.getProjects({
      optional: ['daBridge', 'scalingInfo', 'isDaLayer'],
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

export interface TvsData {
  associatedTokens: ProjectAssociatedToken[]
  warnings: WarningWithSentiment[]
  breakdown: SevenDayTvsBreakdown['projects'][string]['breakdown'] | undefined
  change: SevenDayTvsBreakdown['projects'][string]['change'] | undefined
  additionalTrustAssumptionsPercentage: number | undefined
  syncWarning: string | undefined
}

export interface ScalingRiskStateValidationValidityEntry
  extends CommonScalingEntry {
  tvsOrder: number
  proofSystem: ProjectScalingProofSystem
  isa: string | undefined
  trustedSetupsByProofSystem: TrustedSetupsByProofSystem
  executionDelay: number | undefined
  tvs: TvsData
}

function getScalingRiskStateValidationValidityEntry(
  project: Project<
    'scalingInfo' | 'statuses' | 'display' | 'scalingRisks',
    'contracts' | 'tvsInfo'
  >,
  changes: ProjectChanges,
  zkCatalogProjects: Project<'zkCatalogInfo'>[],
  contractUtils: ContractUtils,
  tvs: SevenDayTvsBreakdown,
  allProjects: Project<never, 'daBridge' | 'scalingInfo' | 'isDaLayer'>[],
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

  const projectTvs = tvs.projects[project.id.toString()]
  return {
    ...getCommonScalingEntry({ project, changes }),
    tvsOrder: projectTvs?.breakdown?.total ?? -1,
    proofSystem: {
      ...proofSystem,
      name: proofSystem.name ?? zkCatalogProject?.name,
    },
    isa: isa?.name,
    trustedSetupsByProofSystem,
    executionDelay: project.scalingRisks.self.stateValidation?.executionDelay,
    tvs: getTvsData(project, projectTvs),
  }
}

export interface ScalingRiskStateValidationOptimisticEntry
  extends CommonScalingEntry {
  tvsOrder: number
  proofSystem: ProjectScalingProofSystem
  executionDelay: number | undefined
  challengePeriod: number | undefined
  initialBond: string | undefined
  tvs: TvsData
  zkCatalog:
    | {
        name: string
        id: string
        successful: { count: number; attesters: string[] }
        unsuccessful: { count: number; attesters: string[] }
        notVerified: { count: number; attesters: string[] }
      }
    | undefined
}

function getScalingRiskStateValidationOptimisticEntry(
  project: Project<
    'scalingInfo' | 'statuses' | 'display' | 'scalingRisks',
    'contracts' | 'tvsInfo'
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

    const aggregateStatus = (
      key: 'successful' | 'unsuccessful' | 'notVerified',
    ) => {
      const verifiers = allVerifiers.flatMap((v) => v[key]).filter(notUndefined)
      const count = verifiers.reduce((sum, v) => sum + v.count, 0)
      const attesters = uniq(
        verifiers.flatMap((v) => v.attesters.map((a) => a.name)),
      )
      return { count, attesters }
    }

    zkCatalog = {
      name: zkCatalogProject.name,
      id: proofSystem.zkCatalogId,
      successful: aggregateStatus('successful'),
      unsuccessful: aggregateStatus('unsuccessful'),
      notVerified: aggregateStatus('notVerified'),
    }
  }

  const projectTvs = tvs.projects[project.id.toString()]
  return {
    ...getCommonScalingEntry({ project, changes }),
    tvsOrder: projectTvs?.breakdown?.total ?? -1,
    proofSystem: {
      ...proofSystem,
      name: proofSystem.name ?? zkCatalogProject?.name,
    },
    executionDelay: stateValidation?.executionDelay,
    challengePeriod: stateValidation?.challengeDelay,
    initialBond: stateValidation?.initialBond,
    tvs: getTvsData(project, projectTvs),
    zkCatalog,
  }
}

export interface ScalingRiskStateValidationNoProofsEntry
  extends CommonScalingEntry {
  tvsOrder: number
  tvs: TvsData
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
    tvs: getTvsData(project, projectTvs),
  }
}

function getTvsData(
  project: {
    id: { toString(): string }
    tvsInfo?: {
      associatedTokens?: ProjectAssociatedToken[]
      warnings?: WarningWithSentiment[]
    }
  },
  projectTvs: SevenDayTvsBreakdown['projects'][string] | undefined,
): TvsData {
  return {
    associatedTokens: project.tvsInfo?.associatedTokens ?? [],
    warnings: project.tvsInfo?.warnings ?? [],
    breakdown: projectTvs?.breakdown,
    change: projectTvs?.change,
    additionalTrustAssumptionsPercentage:
      projectTvs?.additionalTrustAssumptionsPercentage,
    syncWarning: getTvsSyncWarning(projectTvs?.syncState),
  }
}
