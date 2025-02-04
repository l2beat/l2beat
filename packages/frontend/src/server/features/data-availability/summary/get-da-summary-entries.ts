import type {
  DaChallengeMechanism,
  Project,
  TableReadyValue,
  UsedInProject,
} from '@l2beat/config'
import {
  ProjectService,
  isDaBridgeVerified,
  layer2s,
  layer3s,
} from '@l2beat/config'
import { assert, ProjectId } from '@l2beat/shared-pure'
import { uniq } from 'lodash'
import {
  mapBridgeRisksToRosetteValues,
  mapLayerRisksToRosetteValues,
} from '~/app/(side-nav)/data-availability/_utils/map-risks-to-rosette-values'
import { type RosetteValue } from '~/components/rosette/types'
import type { CommonProjectEntry } from '../../utils/get-common-project-entry'
import { getDaBridges } from '../utils/get-da-bridges'
import { getUniqueProjectsInUse } from '../utils/get-da-projects'
import { getDaProjectsEconomicSecurity } from '../utils/get-da-projects-economic-security'
import {
  getDaProjectsTvs,
  pickTvsForProjects,
} from '../utils/get-da-projects-tvs'
import { getDaLayerRisks } from '../utils/get-da-risks'

export async function getDaSummaryEntries(): Promise<DaSummaryEntry[]> {
  const uniqueProjectsInUse = await getUniqueProjectsInUse()
  const [economicSecurity, tvsPerProject] = await Promise.all([
    getDaProjectsEconomicSecurity(),
    getDaProjectsTvs(uniqueProjectsInUse),
  ])
  const getTvs = pickTvsForProjects(tvsPerProject)
  const dacEntries = getDacEntries(getTvs)

  const projects = await ProjectService.STATIC.getProjects({
    select: ['daLayer', 'daBridges', 'statuses'],
  })
  const entries = projects.map((project) =>
    project.id === ProjectId.ETHEREUM
      ? getEthereumEntry(project, economicSecurity[project.id], getTvs)
      : getDaSummaryEntry(project, economicSecurity[project.id], getTvs),
  )

  return [...dacEntries, ...entries].sort((a, b) => b.tvs - a.tvs)
}

export interface DaSummaryEntry extends CommonProjectEntry {
  isPublic: boolean
  economicSecurity: number | undefined
  risks: RosetteValue[]
  fallback: TableReadyValue | undefined
  challengeMechanism: DaChallengeMechanism | undefined
  tvs: number
  bridges: DaBridgeSummaryEntry[]
}

export interface DaBridgeSummaryEntry extends Omit<CommonProjectEntry, 'id'> {
  tvs: number
  risks: {
    values: RosetteValue[]
    isNoBridge: boolean
  }
  usedIn: UsedInProject[]
  dacInfo:
    | {
        memberCount: number
        requiredMembers: number
        membersArePublic: boolean
      }
    | undefined
}

function getDaSummaryEntry(
  project: Project<'daLayer' | 'daBridges' | 'statuses'>,
  economicSecurity: number | undefined,
  getTvs: (projectIds: ProjectId[]) => number,
): DaSummaryEntry {
  const bridges = getDaBridges(project)
    .map((daBridge): DaBridgeSummaryEntry => {
      return {
        name: daBridge.display.name,
        slug: daBridge.display.slug,
        href: `/data-availability/projects/${project.slug}/${daBridge.display.slug}`,
        statuses: {
          verificationWarning: isDaBridgeVerified(daBridge) ? undefined : true,
          underReview:
            !!project.statuses.isUnderReview || daBridge.isUnderReview
              ? 'config'
              : undefined,
        },
        tvs: getTvs(daBridge.usedIn.map((project) => project.id)),
        risks: {
          isNoBridge: !!daBridge.risks.isNoBridge,
          values: mapBridgeRisksToRosetteValues(daBridge.risks),
        },
        usedIn: daBridge.usedIn.sort((a, b) => getTvs([b.id]) - getTvs([a.id])),
        dacInfo:
          daBridge.dac && !daBridge.dac.hideMembers
            ? {
                memberCount: daBridge.dac.membersCount,
                requiredMembers: daBridge.dac.requiredMembers,
                membersArePublic:
                  !!daBridge.dac.knownMembers &&
                  daBridge.dac.knownMembers.length > 0,
              }
            : undefined,
      }
    })
    .sort((a, b) => b.tvs - a.tvs)

  const usedIn = uniq(
    getDaBridges(project).flatMap((bridge) =>
      bridge.usedIn.map((project) => project.id),
    ),
  )
  const tvs = usedIn.length === 0 ? 0 : getTvs(usedIn)

  return {
    id: ProjectId(project.id),
    slug: project.slug,
    name: project.name,
    nameSecondLine: project.daLayer.type,
    href: bridges[0]?.href,
    statuses: {
      underReview: project.statuses.isUnderReview ? 'config' : undefined,
    },
    isPublic: project.daLayer.systemCategory === 'public',
    economicSecurity,
    risks: mapLayerRisksToRosetteValues(
      getDaLayerRisks(project.daLayer, tvs, economicSecurity),
    ),
    fallback: undefined,
    challengeMechanism: undefined,
    tvs,
    bridges,
  }
}

function getDacEntries(
  getTvs: (projectIds: ProjectId[]) => number,
): DaSummaryEntry[] {
  const projects = [...layer2s, ...layer3s]
    .filter((project) => project.customDa)
    .map((project) => ({
      parentProject: project,
      customDa: project.customDa,
    }))

  return projects
    .map(({ parentProject, customDa }) => {
      if (!customDa) {
        return undefined
      }

      const usedIn: UsedInProject[] = [
        {
          id: parentProject.id,
          name: parentProject.display.name,
          slug: parentProject.display.slug,
        },
      ]
      const tvs = getTvs([parentProject.id])
      const dacInfo = customDa.dac
        ? {
            memberCount: customDa.dac.membersCount,
            requiredMembers: customDa.dac.requiredMembers,
            membersArePublic:
              !!customDa.dac.knownMembers &&
              customDa.dac.knownMembers.length > 0,
          }
        : undefined

      const bridgeEntry: DaBridgeSummaryEntry = {
        name: customDa.name ?? `${parentProject.display.name} DAC`,
        slug: parentProject.display.slug,
        href: `/scaling/projects/${parentProject.display.slug}`,
        statuses: {},
        tvs,
        risks: {
          isNoBridge: !!customDa.risks.isNoBridge,
          values: mapBridgeRisksToRosetteValues(customDa.risks),
        },
        dacInfo,
        usedIn,
      }

      const projectEntry: DaSummaryEntry = {
        id: parentProject.id,
        slug: parentProject.display.slug,
        name: customDa.name ?? `${parentProject.display.name} DAC`,
        nameSecondLine: customDa.type,
        href: `/scaling/projects/${parentProject.display.slug}#da-layer`,
        statuses: {},
        risks: mapLayerRisksToRosetteValues(customDa.risks),
        fallback: customDa.fallback,
        challengeMechanism: customDa.challengeMechanism ?? 'None',
        isPublic: false,
        economicSecurity: undefined,
        tvs,
        bridges: [bridgeEntry],
      }

      return projectEntry
    })
    .filter((x) => x !== undefined)
}

function getEthereumEntry(
  project: Project<'daLayer' | 'daBridges' | 'statuses'>,
  economicSecurity: number | undefined,
  getTvs: (projectIds: ProjectId[]) => number,
): DaSummaryEntry {
  const bridge = project.daBridges[0]
  assert(bridge, 'Ethereum DA layer has no bridges')

  return {
    id: ProjectId.ETHEREUM,
    slug: project.slug,
    name: project.name,
    nameSecondLine: project.daLayer.type,
    href: `/data-availability/projects/${project.slug}/${bridge.display.slug}`,
    statuses: {},
    economicSecurity: economicSecurity,
    tvs: getTvs(bridge.usedIn.map((usedIn) => usedIn.id)),
    bridges: [
      {
        name: bridge.display.name,
        slug: bridge.display.slug,
        href: `/data-availability/projects/${project.slug}/${bridge.display.slug}`,
        statuses: {},
        tvs: getTvs(bridge.usedIn.map((usedIn) => usedIn.id)),
        risks: {
          values: mapBridgeRisksToRosetteValues(bridge.risks),
          isNoBridge: false,
        },
        dacInfo: undefined,
        usedIn: bridge.usedIn,
      },
    ],
    isPublic: true,
    challengeMechanism: undefined,
    fallback: undefined,
    risks: mapLayerRisksToRosetteValues(project.daLayer.risks),
  }
}
