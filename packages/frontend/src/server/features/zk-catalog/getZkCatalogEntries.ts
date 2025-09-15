import type {
  Project,
  ProjectZkCatalogInfo,
  TrustedSetup,
  ZkCatalogTag,
} from '@l2beat/config'
import type { ZkCatalogAttester } from '@l2beat/config/build/common/zkCatalogAttesters'
import { notUndefined } from '@l2beat/shared-pure'
import groupBy from 'lodash/groupBy'
import uniq from 'lodash/uniq'
import uniqBy from 'lodash/uniqBy'
import type { FilterableEntry } from '~/components/table/filters/filterableValue'
import {
  get7dTvsBreakdown,
  type SevenDayTvsBreakdown,
} from '~/server/features/scaling/tvs/get7dTvsBreakdown'
import type { CommonProjectEntry } from '~/server/features/utils/getCommonProjectEntry'
import { getProjectIcon } from '~/server/features/utils/getProjectIcon'
import { ps } from '~/server/projects'
import { getLogger } from '~/server/utils/logger'
import {
  type ContractUtils,
  getContractUtils,
  type UsedInProject,
} from '~/utils/project/contracts-and-permissions/getContractUtils'

export type TrustedSetupVerifierData = {
  count: number
  attesters: (ZkCatalogAttester & { icon: string })[]
}

export interface ZkCatalogEntry extends CommonProjectEntry, FilterableEntry {
  name: string
  icon: string
  creator?: string
  tvs: number
  techStack: ProjectZkCatalogInfo['techStack']
  trustedSetupsByProofSystem: Record<
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
      projectsUsedIn: UsedInProject[]
    }
  >
}

export async function getZkCatalogEntries(): Promise<ZkCatalogEntry[]> {
  const [zkCatalogProjects, allProjects, tvs, contractUtils] =
    await Promise.all([
      ps.getProjects({
        select: ['zkCatalogInfo', 'display', 'statuses'],
      }),
      ps.getProjects({
        optional: ['daBridge', 'isBridge', 'isScaling', 'isDaLayer'],
      }),
      get7dTvsBreakdown({ type: 'layer2' }),
      getContractUtils(),
    ])

  return zkCatalogProjects
    .map((project) =>
      getZkCatalogEntry(project, allProjects, tvs, contractUtils),
    )
    .sort((a, b) => b.tvs - a.tvs)
}

function getZkCatalogEntry(
  project: Project<'zkCatalogInfo' | 'display' | 'statuses'>,
  allProjects: Project<
    never,
    'daBridge' | 'isBridge' | 'isScaling' | 'isDaLayer'
  >[],
  tvs: SevenDayTvsBreakdown,
  contractUtils: ContractUtils,
): ZkCatalogEntry {
  const usedInVerifiers = uniq(
    project.zkCatalogInfo.verifierHashes.flatMap((v) => v.usedBy),
  )
  const projectsForTvs = uniq(
    usedInVerifiers.flatMap((vp) => {
      const project = allProjects.find((p) => p.id === vp)
      if (!project) {
        const logger = getLogger().for('getZkCatalogEntry')
        logger.warn(`Project ${vp} not found`)
        return []
      }

      // if project is a DA bridge we want to get summed TVS of all projects secured by this bridge
      if (project.daBridge) {
        return project.daBridge.usedIn.flatMap((p) => p.id)
      }
      return vp
    }),
  )

  const tvsForProject = projectsForTvs.reduce((acc, p) => {
    const projectTvs = tvs.projects[p]?.breakdown.total
    if (!projectTvs) {
      return acc
    }
    return acc + projectTvs
  }, 0)

  const trustedSetupsByProofSystem = getTrustedSetupsWithVerifiersAndAttesters(
    project,
    allProjects,
    contractUtils,
  )

  return {
    id: project.id,
    slug: project.slug,
    backgroundColor: undefined,
    statuses: project.statuses,
    name: project.name,
    icon: getProjectIcon(project.slug),
    creator: project.zkCatalogInfo.creator,
    tvs: tvsForProject,
    techStack: project.zkCatalogInfo.techStack,
    trustedSetupsByProofSystem,
    filterable: [
      ...[
        ...(project.zkCatalogInfo.techStack.finalWrap ?? []),
        ...(project.zkCatalogInfo.techStack.zkVM ?? []),
      ].map((techStack) => ({
        id: techStack.type,
        value: techStack.name,
      })),
    ],
  }
}

function getTrustedSetupsWithVerifiersAndAttesters(
  project: Project<'zkCatalogInfo'>,
  allProjects: Project<
    never,
    'daBridge' | 'isBridge' | 'isScaling' | 'isDaLayer'
  >[],
  contractUtils: ContractUtils,
): ZkCatalogEntry['trustedSetupsByProofSystem'] {
  const grouped = groupBy(
    project.zkCatalogInfo.trustedSetups,
    (e) => `${e.proofSystem.type}-${e.proofSystem.id}`,
  )
  return Object.fromEntries(
    Object.entries(grouped).map(([key, trustedSetups]) => {
      const trustedSetupVerifiers = project.zkCatalogInfo.verifierHashes.filter(
        (v) => key === `${v.proofSystem.type}-${v.proofSystem.id}`,
      )

      const groupedByStatus = groupBy(
        trustedSetupVerifiers,
        (v) => v.verificationStatus,
      )

      const projectsUsedIn = uniqBy(
        trustedSetupVerifiers.flatMap((v) =>
          v.knownDeployments.flatMap((d) =>
            contractUtils.getUsedIn(project.id, d.chain, d.address),
          ),
        ),
        (u) => u.id,
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
          projectsUsedIn,
        },
      ]
    }),
  )
}

export function getVerifiersWithAttesters(
  verifiers: Record<string, ProjectZkCatalogInfo['verifierHashes']>,
  key: 'successful' | 'unsuccessful' | 'notVerified',
): TrustedSetupVerifierData | undefined {
  const verifiersForStatus = verifiers[key]
  if (!verifiersForStatus || verifiersForStatus.length === 0) return undefined

  return {
    count: verifiersForStatus.length,
    attesters: verifiersForStatus
      .flatMap((v) => v.attesters)
      .filter(notUndefined)
      .map((a) => ({
        ...a,
        icon: getProjectIcon(a.id),
      })),
  }
}
