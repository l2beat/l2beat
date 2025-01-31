import type {
  DaChallengeMechanism,
  DaProject,
  TableReadyValue,
  UsedInProject,
} from '@l2beat/config'
import {
  daLayers,
  ethereumDaLayer,
  isDaBridgeVerified,
  layer2s,
  layer3s,
  toUsedInProject,
} from '@l2beat/config'
import { assert, ProjectId } from '@l2beat/shared-pure'
import { uniq } from 'lodash'
import {
  mapBridgeRisksToRosetteValues,
  mapLayerRisksToRosetteValues,
} from '~/app/(side-nav)/data-availability/_utils/map-risks-to-rosette-values'
import { type RosetteValue } from '~/components/rosette/types'
import type { CommonProjectEntry } from '../../utils/get-common-project-entry'
import { getUniqueProjectsInUse } from '../utils/get-da-projects'
import { getDaProjectsEconomicSecurity } from '../utils/get-da-projects-economic-security'
import {
  getDaProjectsTvs,
  pickTvsForProjects,
} from '../utils/get-da-projects-tvs'
import { getDaBridgeRisks, getDaLayerRisks } from '../utils/get-da-risks'
import { kindToType } from '../utils/kind-to-layer-type'

export async function getDaSummaryEntries(): Promise<DaSummaryEntry[]> {
  const uniqueProjectsInUse = getUniqueProjectsInUse()
  const [economicSecurity, tvsPerProject] = await Promise.all([
    getDaProjectsEconomicSecurity(),
    getDaProjectsTvs(uniqueProjectsInUse),
  ])
  const getTvs = pickTvsForProjects(tvsPerProject)
  const dacEntries = getDacEntries(getTvs)
  const entries = daLayers.map((daLayer) =>
    getDaSummaryEntry(daLayer, economicSecurity[daLayer.id], getTvs),
  )

  return [
    ...dacEntries,
    ...entries,
    getEthereumEntry(economicSecurity[ethereumDaLayer.id], getTvs),
  ].sort((a, b) => b.tvs - a.tvs)
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
  project: DaProject,
  economicSecurity: number | undefined,
  getTvs: (projectIds: ProjectId[]) => number,
): DaSummaryEntry {
  const bridges = project.daLayer.bridges
    .map((daBridge): DaBridgeSummaryEntry => {
      const bridgeRisks = getDaBridgeRisks(daBridge)
      return {
        name: daBridge.display.name,
        slug: daBridge.display.slug,
        href: `/data-availability/projects/${project.display.slug}/${daBridge.display.slug}`,
        statuses: {
          verificationWarning: isDaBridgeVerified(daBridge) ? undefined : true,
          underReview:
            !!project.isUnderReview || daBridge.isUnderReview
              ? 'config'
              : undefined,
        },
        tvs: getTvs(daBridge.usedIn.map((project) => project.id)),
        risks: {
          isNoBridge: bridgeRisks.isNoBridge,
          values: mapBridgeRisksToRosetteValues(bridgeRisks),
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
    project.daLayer.bridges.flatMap((bridge) =>
      bridge.usedIn.map((project) => project.id),
    ),
  )
  const tvs = usedIn.length === 0 ? 0 : getTvs(usedIn)

  return {
    id: ProjectId(project.id),
    slug: project.display.slug,
    name: project.display.name,
    nameSecondLine: kindToType(project.daLayer.kind),
    href: bridges[0]?.href,
    statuses: {
      underReview: !!project.isUnderReview ? 'config' : undefined,
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
      daLayer: project.customDa,
    }))

  return projects
    .map(({ parentProject, daLayer }) => {
      if (!daLayer) {
        return undefined
      }

      const usedIn = toUsedInProject([parentProject])
      const tvs = getTvs([parentProject.id])
      const dacInfo = daLayer.dac
        ? {
            memberCount: daLayer.dac.membersCount,
            requiredMembers: daLayer.dac.requiredMembers,
            membersArePublic:
              !!daLayer.dac.knownMembers && daLayer.dac.knownMembers.length > 0,
          }
        : undefined

      const bridgeEntry: DaBridgeSummaryEntry = {
        name: daLayer.name ?? `${parentProject.display.name} DAC`,
        slug: parentProject.display.slug,
        href: `/scaling/projects/${parentProject.display.slug}`,
        statuses: {},
        tvs,
        risks: {
          isNoBridge: !!daLayer.isNoBridge,
          values: mapBridgeRisksToRosetteValues(daLayer.risks),
        },
        dacInfo,
        usedIn,
      }

      const projectEntry: DaSummaryEntry = {
        id: parentProject.id,
        slug: parentProject.display.slug,
        name: daLayer.name ?? `${parentProject.display.name} DAC`,
        nameSecondLine: daLayer.type,
        href: `/scaling/projects/${parentProject.display.slug}#da-layer`,
        statuses: {},
        risks: mapLayerRisksToRosetteValues(daLayer.risks),
        fallback: daLayer.fallback,
        challengeMechanism: daLayer.challengeMechanism ?? 'None',
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
  economicSecurity: number | undefined,
  getTvs: (projectIds: ProjectId[]) => number,
): DaSummaryEntry {
  const bridge = ethereumDaLayer.daLayer.bridges[0]
  assert(bridge, 'Ethereum DA layer has no bridges')

  return {
    id: ProjectId.ETHEREUM,
    slug: ethereumDaLayer.display.slug,
    name: ethereumDaLayer.display.name,
    nameSecondLine: kindToType(ethereumDaLayer.daLayer.kind),
    href: `/data-availability/projects/${ethereumDaLayer.display.slug}/${ethereumDaLayer.daLayer.bridges[0]?.display.slug}`,
    statuses: {},
    economicSecurity: economicSecurity,
    tvs: getTvs(
      ethereumDaLayer.daLayer.bridges
        .flatMap((bridge) => bridge.usedIn)
        .map((usedIn) => usedIn.id),
    ),
    bridges: [
      {
        name: bridge.display.name,
        slug: bridge.display.slug,
        href: `/data-availability/projects/${ethereumDaLayer.display.slug}/${bridge.display.slug}`,
        statuses: {},
        tvs: getTvs(
          ethereumDaLayer.daLayer.bridges
            .flatMap((bridge) => bridge.usedIn)
            .map((usedIn) => usedIn.id),
        ),
        risks: {
          values: mapBridgeRisksToRosetteValues(bridge.risks),
          isNoBridge: false,
        },
        dacInfo: undefined,
        usedIn: ethereumDaLayer.daLayer.bridges.flatMap(
          (bridge) => bridge.usedIn,
        ),
      },
    ],
    isPublic: true,
    challengeMechanism: undefined,
    fallback: undefined,
    risks: mapLayerRisksToRosetteValues(ethereumDaLayer.daLayer.risks),
  }
}
