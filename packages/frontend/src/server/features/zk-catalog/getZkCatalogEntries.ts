import type { Project, ProjectZkCatalogInfo } from '@l2beat/config'
import type { ZkCatalogAttester } from '@l2beat/config/build/common/zkCatalogAttesters'

import type { FilterableEntry } from '~/components/table/filters/filterableValue'
import {
  get7dTvsBreakdown,
  type SevenDayTvsBreakdown,
} from '~/server/features/scaling/tvs/get7dTvsBreakdown'
import type { CommonProjectEntry } from '~/server/features/utils/getCommonProjectEntry'
import { getProjectIcon } from '~/server/features/utils/getProjectIcon'
import { ps } from '~/server/projects'
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
  attesters: (ZkCatalogAttester & { icon: string })[]
}

export interface ZkCatalogEntry extends CommonProjectEntry, FilterableEntry {
  name: string
  icon: string
  creator?: string
  tvs: number
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
  const trustedSetupsByProofSystem = getTrustedSetupsWithVerifiersAndAttesters(
    project,
    contractUtils,
    tvs,
    allProjects,
  )
  const { tvs: tvsForProject } = getZkCatalogProjectTvs(
    project,
    allProjects,
    tvs,
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
