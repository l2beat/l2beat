import type {
  Project,
  ProjectZkCatalogInfo,
  TrustedSetup,
  ZkCatalogTag,
} from '@l2beat/config'
import type { ZkCatalogAttester } from '@l2beat/config/build/common/zkCatalogAttesters'
import { assert, notUndefined, type ProjectId } from '@l2beat/shared-pure'
import groupBy from 'lodash/groupBy'
import uniq from 'lodash/uniq'
import uniqBy from 'lodash/uniqBy'
import type { UsedInProjectWithIcon } from '~/components/ProjectsUsedIn'
import type { FilterableEntry } from '~/components/table/filters/filterableValue'
import {
  get7dTvsBreakdown,
  type SevenDayTvsBreakdown,
} from '~/server/features/scaling/tvs/get7dTvsBreakdown'
import type { CommonProjectEntry } from '~/server/features/utils/getCommonProjectEntry'
import { getProjectIcon } from '~/server/features/utils/getProjectIcon'
import { ps } from '~/server/projects'
import { getLogger } from '~/server/utils/logger'

export interface ZkCatalogEntry extends CommonProjectEntry, FilterableEntry {
  name: string
  icon: string
  creator?: string
  tvs: number
  projectsUsedIn: UsedInProjectWithIcon[]
  verifiers: {
    successfulCount: number
    unsuccessfulCount: number
    notVerifiedCount: number
  }
  attesters: (ZkCatalogAttester & { icon: string })[]
  techStack: ProjectZkCatalogInfo['techStack']
  trustedSetups: Record<
    string,
    (TrustedSetup & { proofSystem: ZkCatalogTag })[]
  >
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

  return zkCatalogProjects.map((project) =>
    getZkCatalogEntry(project, allProjects, tvs),
  )
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

  const trustedSetups = groupBy(
    project.zkCatalogInfo.trustedSetups,
    (e) => `${e.proofSystem.type}-${e.proofSystem.id}`,
  )

  return {
    id: project.id,
    slug: project.slug,
    statuses: project.statuses,
    name: project.name,
    icon: getProjectIcon(project.slug),
    creator: project.zkCatalogInfo.creator,
    tvs: tvsForProject,
    verifiers: {
      successfulCount: project.zkCatalogInfo.verifierHashes.filter(
        (v) => v.verificationStatus === 'successful',
      ).length,
      unsuccessfulCount: project.zkCatalogInfo.verifierHashes.filter(
        (v) => v.verificationStatus === 'unsuccessful',
      ).length,
      notVerifiedCount: project.zkCatalogInfo.verifierHashes.filter(
        (v) => v.verificationStatus === 'notVerified',
      ).length,
    },
    attesters: uniqBy(
      project.zkCatalogInfo.verifierHashes
        .flatMap((v) =>
          v.attesters?.map((a) => ({ ...a, icon: getProjectIcon(a.id) })),
        )
        .filter(notUndefined),
      (a) => a?.id,
    ),
    techStack: project.zkCatalogInfo.techStack,
    projectsUsedIn: getProjectsUsedIn(usedInVerifiers, allProjects),
    trustedSetups,
    filterable: [
      ...[
        ...(project.zkCatalogInfo.techStack.finalWrap ?? []),
        ...(project.zkCatalogInfo.techStack.zkVM ?? []),
      ].map((techStack) => ({
        id: 'techStack' as const,
        value: `${techStack.type}: ${techStack.name}`,
      })),
    ],
  }
}

function getProjectsUsedIn(
  usedInVerifiers: ProjectId[],
  allProjects: Project<
    never,
    'daBridge' | 'isBridge' | 'isScaling' | 'isDaLayer'
  >[],
): UsedInProjectWithIcon[] {
  return usedInVerifiers
    .map((id) => {
      const project = allProjects.find((p) => p.id === id)
      if (!project) {
        const logger = getLogger().for('getProjectsUsedIn')
        logger.warn(`Project ${id} not found`)
        return undefined
      }

      const href = getProjectHref(project, allProjects)

      return {
        id: id,
        name: project.name,
        slug: project.slug,
        icon: getProjectIcon(project.slug),
        href,
      }
    })
    .filter((e) => e !== undefined)
}

function getProjectHref(
  project: Project<never, 'daBridge' | 'isBridge' | 'isScaling' | 'isDaLayer'>,
  allProjects: Project<
    never,
    'daBridge' | 'isBridge' | 'isScaling' | 'isDaLayer'
  >[],
) {
  if (project.isBridge) return `/bridges/projects/${project.slug}`
  if (project.isScaling) return `/scaling/projects/${project.slug}`
  if (project.isDaLayer) {
    const daBridge = allProjects.find((p) => p.id === project.daBridge?.daLayer)
    assert(daBridge, `DA bridge ${project.id} not found`)

    return `/data-availability/projects/${project.slug}/${daBridge.slug}`
  }
  if (project.daBridge) {
    const daLayer = allProjects.find((p) => p.id === project.daBridge?.daLayer)
    assert(daLayer, `DA layer ${project.daBridge.daLayer} not found`)

    return `/data-availability/projects/${daLayer.slug}/${project.slug}`
  }

  throw new Error(`Unknown project type: ${project.id}`)
}
