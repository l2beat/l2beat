import type {
  Project,
  ProjectRedWarning,
  ProjectZkCatalogInfo,
} from '@l2beat/config'
import type { ZkCatalogAttester } from '@l2beat/config/build/common/zkCatalogAttesters'

import type { FilterableEntry } from '~/components/table/filters/filterableValue'
import { getRowBackgroundColor } from '~/components/table/utils/rowType'
import {
  get7dTvsBreakdown,
  type SevenDayTvsBreakdown,
} from '~/server/features/layer2s/tvs/get7dTvsBreakdown'
import type { CommonProjectEntry } from '~/server/features/utils/getCommonProjectEntry'
import { ps } from '~/server/projects'
import { manifest } from '~/utils/Manifest'
import {
  type ContractUtils,
  getContractUtils,
} from '~/utils/project/contracts-and-permissions/getContractUtils'
import {
  PROJECT_PAGE_METADATA_FIELDS,
  type ProjectWithPageMetadata,
} from '~/utils/project/getProjectUrl'
import { getSingleParticipantWarnings } from '~/utils/project/getSingleParticipantTrustedSetupWarnings'
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
  quantumResistant?: boolean
  /** Project page that the red warning's anchor resolves against. */
  detailsHref: string
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
        whereNot: ['archivedAt'],
      }),
      ps.getProjects({
        optional: ['display', ...PROJECT_PAGE_METADATA_FIELDS],
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
  allProjects: ProjectWithPageMetadata[],
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

  const redWarning = getZkCatalogRedWarning(project)

  return {
    id: project.id,
    slug: project.slug,
    backgroundColor: getRowBackgroundColor({ redWarning }),
    statuses: { ...project.statuses, redWarning },
    detailsHref: `/zk-catalog/${project.slug}`,
    name: project.name,
    description: project.display.description,
    icon: manifest.getUrl(`/icons/${project.slug}.png`),
    creator: project.zkCatalogInfo.creator,
    quantumResistant: project.zkCatalogInfo.quantumResistant,
    tvs: {
      value: tvsForProject,
      numberOfProjects,
    },
    techStack: project.zkCatalogInfo.techStack,
    trustedSetupsByProofSystem,
    filterable: [
      ...(project.zkCatalogInfo.techStack.finalWrap ?? []),
      ...(project.zkCatalogInfo.techStack.zkVM ?? []),
    ].map((techStack) => ({
      id: techStack.type,
      value: techStack.name,
    })),
  }
}

/**
 * The project's own red warning, plus one sentence per trusted setup that
 * rests on a single participant, so the table flags those rows like any
 * other red warning.
 */
function getZkCatalogRedWarning(
  project: Project<'zkCatalogInfo' | 'statuses'>,
): ProjectRedWarning | undefined {
  const trustedSetupWarnings = getSingleParticipantWarnings(
    project.zkCatalogInfo.trustedSetups,
  )
  const own = project.statuses.redWarning
  if (trustedSetupWarnings.length === 0) return own
  return {
    text: [own?.text, ...trustedSetupWarnings].filter(Boolean).join(' '),
    detailAnchor: 'trusted-setups',
  }
}
