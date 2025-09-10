import type { Project, ProjectZkCatalogInfo } from '@l2beat/config'
import type { ZkCatalogAttester } from '@l2beat/config/build/common/zkCatalogAttesters'
import uniq from 'lodash/uniq'
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
  getTrustedSetupsWithVerifiersAndAttesters,
  type TrustedSetupsByProofSystem,
} from './getTrustedSetupsWithVerifiersAndAttesters'

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
  const [zkCatalogProjects, allProjects, tvs] = await Promise.all([
    ps.getProjects({
      select: ['zkCatalogInfo', 'display', 'statuses'],
    }),
    ps.getProjects({
      optional: ['daBridge', 'isBridge', 'isScaling', 'isDaLayer'],
    }),
    get7dTvsBreakdown({ type: 'layer2' }),
  ])

  return zkCatalogProjects
    .map((project) => getZkCatalogEntry(project, allProjects, tvs))
    .sort((a, b) => b.tvs - a.tvs)
}

function getZkCatalogEntry(
  project: Project<'zkCatalogInfo' | 'display' | 'statuses'>,
  allProjects: Project<
    never,
    'daBridge' | 'isBridge' | 'isScaling' | 'isDaLayer'
  >[],
  tvs: SevenDayTvsBreakdown,
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
