import type {
  DaChallengeMechanism,
  Project,
  TableReadyValue,
  UsedInProject,
} from '@l2beat/config'
import { layer2s, layer3s } from '@l2beat/config'
import { assert, ProjectId } from '@l2beat/shared-pure'
import {
  mapBridgeRisksToRosetteValues,
  mapLayerRisksToRosetteValues,
} from '~/app/(side-nav)/data-availability/_utils/map-risks-to-rosette-values'
import { type RosetteValue } from '~/components/rosette/types'
import { ps } from '~/server/projects'
import type { CommonProjectEntry } from '../../utils/get-common-project-entry'
import { getDaLayerRisks } from '../utils/get-da-layer-risks'
import { getDaProjectsEconomicSecurity } from '../utils/get-da-projects-economic-security'
import {
  getDaProjectsTvs,
  pickTvsForProjects,
} from '../utils/get-da-projects-tvs'
import { getDaUsers } from '../utils/get-da-users'

export async function getDaSummaryEntries(): Promise<DaSummaryEntry[]> {
  const [layers, bridges] = await Promise.all([
    ps.getProjects({ select: ['daLayer', 'statuses'] }),
    ps.getProjects({ select: ['daBridge', 'statuses'] }),
  ])

  const uniqueProjectsInUse = getDaUsers(layers, bridges)
  const [economicSecurity, tvsPerProject] = await Promise.all([
    getDaProjectsEconomicSecurity(),
    getDaProjectsTvs(uniqueProjectsInUse),
  ])
  const getTvs = pickTvsForProjects(tvsPerProject)
  const dacEntries = getDacEntries(getTvs)

  const entries = layers.map((project) =>
    project.id === ProjectId.ETHEREUM
      ? getEthereumEntry(
          project,
          bridges.filter((x) => x.daBridge.daLayer === project.id),
          economicSecurity[project.id],
          getTvs,
        )
      : getDaSummaryEntry(
          project,
          bridges.filter((x) => x.daBridge.daLayer === project.id),
          economicSecurity[project.id],
          getTvs,
        ),
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
  layer: Project<'daLayer' | 'statuses'>,
  bridges: Project<'daBridge' | 'statuses'>[],
  economicSecurity: number | undefined,
  getTvs: (projectIds: ProjectId[]) => number,
): DaSummaryEntry {
  const daBridges = bridges.map(
    (b): DaBridgeSummaryEntry => ({
      name: b.daBridge.name,
      slug: b.slug,
      href: `/data-availability/projects/${layer.slug}/${b.slug}`,
      statuses: {
        verificationWarning: b.statuses.isUnverified,
        underReview:
          layer.statuses.isUnderReview || b.statuses.isUnderReview
            ? 'config'
            : undefined,
      },
      tvs: getTvs(b.daBridge.usedIn.map((project) => project.id)),
      risks: {
        isNoBridge: !!b.daBridge.risks.isNoBridge,
        values: mapBridgeRisksToRosetteValues(b.daBridge.risks),
      },
      usedIn: b.daBridge.usedIn.sort((a, b) => getTvs([b.id]) - getTvs([a.id])),
      dacInfo: undefined,
    }),
  )

  if (layer.daLayer.usedWithoutBridgeIn.length > 0) {
    daBridges.unshift({
      name: 'No Bridge',
      slug: 'no-bridge',
      href: `/data-availability/projects/${layer.slug}/no-bridge`,
      statuses: {},
      tvs: getTvs(
        layer.daLayer.usedWithoutBridgeIn.map((project) => project.id),
      ),
      risks: {
        isNoBridge: true,
        values: mapBridgeRisksToRosetteValues({ isNoBridge: true }),
      },
      usedIn: layer.daLayer.usedWithoutBridgeIn.sort(
        (a, b) => getTvs([b.id]) - getTvs([a.id]),
      ),
      dacInfo: undefined,
    })
  }

  daBridges.sort((a, b) => b.tvs - a.tvs)

  const tvs = getTvs(
    layer.daLayer.usedWithoutBridgeIn
      .concat(bridges.flatMap((p) => p.daBridge.usedIn))
      .map((x) => x.id),
  )

  return {
    id: ProjectId(layer.id),
    slug: layer.slug,
    name: layer.name,
    nameSecondLine: layer.daLayer.type,
    href: daBridges[0]?.href,
    statuses: {
      underReview: layer.statuses.isUnderReview ? 'config' : undefined,
    },
    isPublic: layer.daLayer.systemCategory === 'public',
    economicSecurity,
    risks: mapLayerRisksToRosetteValues(
      getDaLayerRisks(layer.daLayer, tvs, economicSecurity),
    ),
    fallback: undefined,
    challengeMechanism: undefined,
    tvs,
    bridges: daBridges,
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
  layer: Project<'daLayer' | 'statuses'>,
  bridges: Project<'daBridge' | 'statuses'>[],
  economicSecurity: number | undefined,
  getTvs: (projectIds: ProjectId[]) => number,
): DaSummaryEntry {
  const bridge = bridges[0]
  assert(bridge, 'Ethereum DA layer has no bridges')

  return {
    id: ProjectId.ETHEREUM,
    slug: layer.slug,
    name: layer.name,
    nameSecondLine: layer.daLayer.type,
    href: `/data-availability/projects/${layer.slug}/${bridge.slug}`,
    statuses: {},
    economicSecurity: economicSecurity,
    tvs: getTvs(bridge.daBridge.usedIn.map((usedIn) => usedIn.id)),
    bridges: [
      {
        name: bridge.daBridge.name,
        slug: bridge.slug,
        href: `/data-availability/projects/${layer.slug}/${bridge.slug}`,
        statuses: {},
        tvs: getTvs(bridge.daBridge.usedIn.map((usedIn) => usedIn.id)),
        risks: {
          values: mapBridgeRisksToRosetteValues(bridge.daBridge.risks),
          isNoBridge: false,
        },
        dacInfo: undefined,
        usedIn: bridge.daBridge.usedIn,
      },
    ],
    isPublic: true,
    challengeMechanism: undefined,
    fallback: undefined,
    risks: mapLayerRisksToRosetteValues(layer.daLayer.risks),
  }
}
