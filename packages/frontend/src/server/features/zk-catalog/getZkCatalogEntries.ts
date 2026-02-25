import type { Project, ProjectZkCatalogInfo } from '@l2beat/config'
import type { ZkCatalogAttester } from '@l2beat/config/build/common/zkCatalogAttesters'

import type { FilterableEntry } from '~/components/table/filters/filterableValue'
import {
  get7dTvsBreakdown,
  type SevenDayTvsBreakdown,
} from '~/server/features/scaling/tvs/get7dTvsBreakdown'
import type { CommonProjectEntry } from '~/server/features/utils/getCommonProjectEntry'
import { ps } from '~/server/projects'
import { manifest } from '~/utils/Manifest'
import {
  type ContractUtils,
  getContractUtils,
} from '~/utils/project/contracts-and-permissions/getContractUtils'
import {
  getTrustedSetupsWithVerifiersAndAttesters,
  type TrustedSetupsByProofSystem,
} from './utils/getTrustedSetupsWithVerifiersAndAttesters'
import { getZkCatalogProjectTvs } from './utils/getZkCatalogProjectTvs'

export type TrustedSetupVerifierData = {
  count: number
  attesters: (ZkCatalogAttester & { icon: string; iconDark?: string })[]
}

export interface ZkCatalogEntry extends CommonProjectEntry, FilterableEntry {
  name: string
  icon: string
  creator?: string
  tvs: {
    value: number
    numberOfProjects: number
  }
  techStack: ProjectZkCatalogInfo['techStack']
  trustedSetupsByProofSystem: TrustedSetupsByProofSystem
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
      get7dTvsBreakdown({ type: 'all' }),
      getContractUtils(),
    ])

  return zkCatalogProjects
    .map((project) =>
      getZkCatalogEntry(project, allProjects, tvs, contractUtils),
    )
    .sort((a, b) => b.tvs.value - a.tvs.value)
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
  const trustedSetupsByProofSystem = getTrustedSetupsWithVerifiersAndAttesters(
    project,
    contractUtils,
    tvs,
    allProjects,
  )
  const { tvs: tvsForProject, numberOfProjects } = getZkCatalogProjectTvs(
    project,
    allProjects,
    tvs,
  )

  return {
    id: project.id,
    slug: project.slug,
    backgroundColor: undefined,
    statuses: project.statuses,
    name: project.name,
    icon: manifest.getUrl(`/icons/${project.slug}.png`),
    creator: project.zkCatalogInfo.creator,
    tvs: {
      value: tvsForProject,
      numberOfProjects,
    },
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
