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
  get7dTvsBreakdown,
  type SevenDayTvsBreakdown,
} from '~/server/features/layer2s/tvs/get7dTvsBreakdown'
import { compareTvs } from '~/server/features/layer2s/tvs/utils/compareTvs'
import { getTvsSyncWarning } from '~/server/features/layer2s/tvs/utils/syncStatus'
import {
  getProjectsChangeReport,
  type ProjectChanges,
} from '~/server/features/projects-change-report/getProjectsChangeReport'
import {
  getTrustedSetupsWithVerifiersAndAttesters,
  type TrustedSetupsByProofSystem,
} from '~/server/features/zk-catalog/utils/getTrustedSetupsWithVerifiersAndAttesters'
import { ps } from '~/server/projects'
import {
  type ContractUtils,
  getContractUtils,
} from '~/utils/project/contracts-and-permissions/getContractUtils'
import type { ProjectWithPageMetadata } from '~/utils/project/getProjectUrl'
import {
  type CommonLayer2sEntry,
  getCommonLayer2sEntry,
} from '../../getCommonLayer2sEntry'

export async function getLayer2sRiskStateValidationEntries() {
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
      whereNot: ['archivedAt'],
    }),
    ps.getProjects({
      select: ['zkCatalogInfo'],
    }),
    ps.getProjects({
      optional: [
        'display',
        'daBridge',
        'scalingInfo',
        'daLayer',
        'privacyInfo',
      ],
    }),
    getContractUtils(),
    get7dTvsBreakdown({ type: 'all' }),
  ])

  const [withProofSystem, noProofsProjects] = partition(
    projects,
    (p) => !!p.scalingInfo.proofSystem,
  )

  const [validityProjects, optimisticProjects] = partition(
    withProofSystem,
    (p) => p.scalingInfo.proofSystem?.type === 'Validity',
  )

  const validityEntries = validityProjects.map((project) =>
    getLayer2sRiskStateValidationValidityEntry(
      project,
      projectsChangeReport.getChanges(project.id),
      zkCatalogProjects,
      contractUtils,
      tvs,
      allProjects,
    ),
  )
  const optimisticEntries = optimisticProjects.map((project) =>
    getLayer2sRiskStateValidationOptimisticEntry(
      project,
      projectsChangeReport.getChanges(project.id),
      zkCatalogProjects,
      tvs,
      contractUtils,
    ),
  )
  const noProofsEntries = noProofsProjects.map((project) =>
    getLayer2sRiskStateValidationNoProofsEntry(
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

export interface Layer2sRiskStateValidationValidityEntry
  extends CommonLayer2sEntry {
  tvsOrder: number
  proofSystem: ProjectScalingProofSystem
  isa: string | undefined
  trustedSetupsByProofSystem: TrustedSetupsByProofSystem
  executionDelay: number | undefined
  executionDelayMode: 'always' | 'if-challenged' | undefined
  permissioned: boolean | undefined
  tvs: TvsData
}

function getLayer2sRiskStateValidationValidityEntry(
  project: Project<
    'scalingInfo' | 'statuses' | 'display' | 'scalingRisks',
    'contracts' | 'tvsInfo'
  >,
  changes: ProjectChanges,
  zkCatalogProjects: Project<'zkCatalogInfo'>[],
  contractUtils: ContractUtils,
  tvs: SevenDayTvsBreakdown,
  allProjects: ProjectWithPageMetadata[],
): Layer2sRiskStateValidationValidityEntry {
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
    ...getCommonLayer2sEntry({ project, changes }),
    tvsOrder: projectTvs?.breakdown?.total ?? -1,
    proofSystem: {
      ...proofSystem,
      name: proofSystem.name ?? zkCatalogProject?.name,
    },
    isa: isa?.name,
    trustedSetupsByProofSystem,
    executionDelay: project.scalingRisks.self.stateValidation?.executionDelay,
    executionDelayMode:
      project.scalingRisks.self.stateValidation?.executionDelayMode,
    permissioned: project.scalingRisks.self.stateValidation?.permissioned,
    tvs: getTvsData(project, projectTvs),
  }
}

export interface Layer2sRiskStateValidationOptimisticEntry
  extends CommonLayer2sEntry {
  tvsOrder: number
  proofSystem: ProjectScalingProofSystem
  executionDelay: number | undefined
  executionDelayMode: 'always' | 'if-challenged' | undefined
  challengePeriod: number | undefined
  initialBond: { value: string; token?: string } | undefined
  permissioned: boolean | undefined
  defenderAdvantage:
    | { multiplier: number; shape: 'linear' }
    | { shape: 'log' }
    | 'not-applicable'
    | 'not-assessed'
    | undefined
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

function getLayer2sRiskStateValidationOptimisticEntry(
  project: Project<
    'scalingInfo' | 'statuses' | 'display' | 'scalingRisks',
    'contracts' | 'tvsInfo'
  >,
  changes: ProjectChanges,
  zkCatalogProjects: Project<'zkCatalogInfo'>[],
  tvs: SevenDayTvsBreakdown,
  contractUtils: ContractUtils,
): Layer2sRiskStateValidationOptimisticEntry {
  const proofSystem = project.scalingInfo?.proofSystem
  assert(proofSystem, 'Proof system is required')

  const zkCatalogProject = zkCatalogProjects.find(
    (p) => p.id === proofSystem.zkCatalogId,
  )

  const { stateValidation } =
    project.scalingRisks.stacked ?? project.scalingRisks.self

  let zkCatalog: Layer2sRiskStateValidationOptimisticEntry['zkCatalog']
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
    ...getCommonLayer2sEntry({ project, changes }),
    tvsOrder: projectTvs?.breakdown?.total ?? -1,
    proofSystem: {
      ...proofSystem,
      name: proofSystem.name ?? zkCatalogProject?.name,
    },
    executionDelay: stateValidation?.executionDelay,
    executionDelayMode: stateValidation?.executionDelayMode,
    challengePeriod: stateValidation?.challengeDelay,
    initialBond: stateValidation?.initialBond,
    permissioned: stateValidation?.permissioned,
    defenderAdvantage: stateValidation?.defenderAdvantage,
    tvs: getTvsData(project, projectTvs),
    zkCatalog,
  }
}

export interface Layer2sRiskStateValidationNoProofsEntry
  extends CommonLayer2sEntry {
  tvsOrder: number
  tvs: TvsData
}

function getLayer2sRiskStateValidationNoProofsEntry(
  project: Project<
    'scalingInfo' | 'statuses' | 'display' | 'scalingRisks',
    'contracts' | 'tvsInfo'
  >,
  changes: ProjectChanges,
  tvs: SevenDayTvsBreakdown,
): Layer2sRiskStateValidationNoProofsEntry {
  const projectTvs = tvs.projects[project.id.toString()]
  return {
    ...getCommonLayer2sEntry({ project, changes }),
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
