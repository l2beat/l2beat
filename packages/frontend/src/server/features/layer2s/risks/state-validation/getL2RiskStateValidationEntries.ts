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
import type { PercentageChangePeriod } from '~/utils/calculatePercentageChange'
import {
  type ContractUtils,
  getContractUtils,
} from '~/utils/project/contracts-and-permissions/getContractUtils'
import type { ProjectWithPageMetadata } from '~/utils/project/getProjectUrl'
import { getProofSystemWithName } from '~/utils/project/getProofSystemWithName'
import { getUsedZkCatalogProjects } from '~/utils/project/getUsedZkCatalogProjects'
import { type CommonL2Entry, getCommonL2Entry } from '../../getCommonL2Entry'

export async function getL2RiskStateValidationEntries() {
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
        'defiInfo',
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
    getL2RiskStateValidationValidityEntry(
      project,
      projectsChangeReport.getChanges(project.id),
      zkCatalogProjects,
      contractUtils,
      tvs,
      allProjects,
    ),
  )
  const optimisticEntries = optimisticProjects.map((project) =>
    getL2RiskStateValidationOptimisticEntry(
      project,
      projectsChangeReport.getChanges(project.id),
      zkCatalogProjects,
      tvs,
      contractUtils,
    ),
  )
  const noProofsEntries = noProofsProjects.map((project) =>
    getL2RiskStateValidationNoProofsEntry(
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
  changePeriod: PercentageChangePeriod | undefined
  additionalTrustAssumptionsPercentage: number | undefined
  syncWarning: string | undefined
}

export interface L2RiskStateValidationValidityEntry extends CommonL2Entry {
  tvsOrder: number
  proofSystem: ProjectScalingProofSystem
  isa: string | undefined
  trustedSetups: TrustedSetupsByProofSystem[string][]
  executionDelay: number | undefined
  executionDelayMode: 'always' | 'if-challenged' | undefined
  permissioned: boolean | undefined
  tvs: TvsData
}

function getL2RiskStateValidationValidityEntry(
  project: Project<
    'scalingInfo' | 'statuses' | 'display' | 'scalingRisks',
    'contracts' | 'tvsInfo'
  >,
  changes: ProjectChanges,
  zkCatalogProjects: Project<'zkCatalogInfo'>[],
  contractUtils: ContractUtils,
  tvs: SevenDayTvsBreakdown,
  allProjects: ProjectWithPageMetadata[],
): L2RiskStateValidationValidityEntry {
  const proofSystem = project.scalingInfo?.proofSystem
  assert(proofSystem, 'Proof system is required')

  const usedZkCatalogProjects = getUsedZkCatalogProjects(
    proofSystem,
    zkCatalogProjects,
  )

  const isas = uniq(
    usedZkCatalogProjects.flatMap(
      (zkCatalogProject) =>
        zkCatalogProject.zkCatalogInfo.techStack.zkVM
          ?.filter((tag) => tag.type === 'ISA')
          .map((tag) => tag.name) ?? [],
    ),
  )

  const trustedSetups = usedZkCatalogProjects.flatMap((zkCatalogProject) =>
    Object.values(
      getTrustedSetupsWithVerifiersAndAttesters(
        zkCatalogProject,
        contractUtils,
        tvs,
        allProjects,
        { id: project.id, contracts: project.contracts },
      ),
    ),
  )

  const projectTvs = tvs.projects[project.id.toString()]
  return {
    ...getCommonL2Entry({ project, changes }),
    tvsOrder: projectTvs?.breakdown?.total ?? -1,
    proofSystem: getProofSystemWithName(proofSystem, zkCatalogProjects),
    isa: isas.length > 0 ? isas.join(' / ') : undefined,
    trustedSetups,
    executionDelay: project.scalingRisks.self.stateValidation?.executionDelay,
    executionDelayMode:
      project.scalingRisks.self.stateValidation?.executionDelayMode,
    permissioned: project.scalingRisks.self.stateValidation?.permissioned,
    tvs: getTvsData(project, projectTvs),
  }
}

export interface L2RiskStateValidationOptimisticEntry extends CommonL2Entry {
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
        ids: string[]
        successful: { count: number; attesters: string[] }
        unsuccessful: { count: number; attesters: string[] }
        notVerified: { count: number; attesters: string[] }
      }
    | undefined
}

function getL2RiskStateValidationOptimisticEntry(
  project: Project<
    'scalingInfo' | 'statuses' | 'display' | 'scalingRisks',
    'contracts' | 'tvsInfo'
  >,
  changes: ProjectChanges,
  zkCatalogProjects: Project<'zkCatalogInfo'>[],
  tvs: SevenDayTvsBreakdown,
  contractUtils: ContractUtils,
): L2RiskStateValidationOptimisticEntry {
  const proofSystem = project.scalingInfo?.proofSystem
  assert(proofSystem, 'Proof system is required')

  const usedZkCatalogProjects = getUsedZkCatalogProjects(
    proofSystem,
    zkCatalogProjects,
  )

  const { stateValidation } =
    project.scalingRisks.stacked ?? project.scalingRisks.self

  let zkCatalog: L2RiskStateValidationOptimisticEntry['zkCatalog']
  if (usedZkCatalogProjects.length > 0) {
    const allVerifiers = usedZkCatalogProjects.flatMap((zkCatalogProject) =>
      Object.values(
        getTrustedSetupsWithVerifiersAndAttesters(
          zkCatalogProject,
          contractUtils,
          tvs,
          [],
          { id: project.id, contracts: project.contracts },
        ),
      ).map((ts) => ts.verifiers),
    )

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
      name: usedZkCatalogProjects.map((p) => p.name).join(' / '),
      ids: usedZkCatalogProjects.map((p) => p.id),
      successful: aggregateStatus('successful'),
      unsuccessful: aggregateStatus('unsuccessful'),
      notVerified: aggregateStatus('notVerified'),
    }
  }

  const projectTvs = tvs.projects[project.id.toString()]
  return {
    ...getCommonL2Entry({ project, changes }),
    tvsOrder: projectTvs?.breakdown?.total ?? -1,
    proofSystem: getProofSystemWithName(proofSystem, zkCatalogProjects),
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

export interface L2RiskStateValidationNoProofsEntry extends CommonL2Entry {
  tvsOrder: number
  tvs: TvsData
}

function getL2RiskStateValidationNoProofsEntry(
  project: Project<
    'scalingInfo' | 'statuses' | 'display' | 'scalingRisks',
    'contracts' | 'tvsInfo'
  >,
  changes: ProjectChanges,
  tvs: SevenDayTvsBreakdown,
): L2RiskStateValidationNoProofsEntry {
  const projectTvs = tvs.projects[project.id.toString()]
  return {
    ...getCommonL2Entry({ project, changes }),
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
    changePeriod: projectTvs?.changePeriod,
    additionalTrustAssumptionsPercentage:
      projectTvs?.additionalTrustAssumptionsPercentage,
    syncWarning: getTvsSyncWarning(projectTvs?.syncState),
  }
}
