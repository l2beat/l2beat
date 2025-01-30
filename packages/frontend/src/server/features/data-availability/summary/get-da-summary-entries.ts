import {
  type BlockchainDaLayer,
  type DaChallengeMechanism,
  type DaServiceDaLayer,
  type DataAvailabilityLayer,
  type UsedInProject,
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
import type { EconomicSecurityData } from '../project/utils/get-da-project-economic-security'
import { getUniqueProjectsInUse } from '../utils/get-da-projects'
import { getDaProjectsEconomicSecurity } from '../utils/get-da-projects-economic-security'
import {
  getDaProjectsTvl,
  pickTvlForProjects,
} from '../utils/get-da-projects-tvl'
import { getDaBridgeRisks, getDaLayerRisks } from '../utils/get-da-risks'
import { kindToType } from '../utils/kind-to-layer-type'

export async function getDaSummaryEntries(): Promise<DaSummaryEntry[]> {
  const uniqueProjectsInUse = getUniqueProjectsInUse()
  const [economicSecurity, tvlPerProject] = await Promise.all([
    getDaProjectsEconomicSecurity(),
    getDaProjectsTvl(uniqueProjectsInUse),
  ])
  const getTvs = pickTvlForProjects(tvlPerProject)

  const dacEntries = getDacEntries(getTvs)
  const entries = daLayers.map((daLayer) =>
    getDaSummaryEntry(daLayer, economicSecurity[daLayer.id], getTvs),
  )

  return [
    ...dacEntries,
    ...entries,
    getEthereumEntry(economicSecurity, getTvs),
  ].sort((a, b) => b.tvs - a.tvs)
}

export interface DaSummaryEntry extends CommonProjectEntry {
  isPublic: boolean
  economicSecurity: EconomicSecurityData | undefined
  risks: RosetteValue[]
  fallback: DataAvailabilityLayer | undefined
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
  daLayer: BlockchainDaLayer | DaServiceDaLayer,
  economicSecurity: EconomicSecurityData | undefined,
  getTvs: (projectIds: ProjectId[]) => number,
): DaSummaryEntry {
  const bridges = daLayer.bridges
    .map((daBridge): DaBridgeSummaryEntry => {
      const bridgeRisks = getDaBridgeRisks(daBridge)
      return {
        name: daBridge.display.name,
        slug: daBridge.display.slug,
        href: `/data-availability/projects/${daLayer.display.slug}/${daBridge.display.slug}`,
        statuses: {
          yellowWarning: daBridge.display.warning,
          redWarning: daBridge.display.redWarning,
          verificationWarning: isDaBridgeVerified(daLayer, daBridge)
            ? undefined
            : true,
          underReview:
            !!daLayer.isUnderReview || daBridge.isUnderReview
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
          daBridge.type === 'StandaloneDacBridge' && !daBridge.hideMembers
            ? {
                memberCount: daBridge.membersCount,
                requiredMembers: daBridge.requiredMembers,
                membersArePublic:
                  !!daBridge.knownMembers && daBridge.knownMembers.length > 0,
              }
            : undefined,
      }
    })
    .sort((a, b) => b.tvs - a.tvs)

  const usedIn = uniq(
    daLayer.bridges.flatMap((bridge) =>
      bridge.usedIn.map((project) => project.id),
    ),
  )
  const tvs = usedIn.length === 0 ? 0 : getTvs(usedIn)

  return {
    id: ProjectId(daLayer.id),
    slug: daLayer.display.slug,
    name: daLayer.display.name,
    nameSecondLine: kindToType(daLayer.kind),
    href: bridges[0]?.href,
    statuses: {
      underReview: !!daLayer.isUnderReview ? 'config' : undefined,
    },
    isPublic: daLayer.systemCategory === 'public',
    economicSecurity,
    risks: mapLayerRisksToRosetteValues(
      getDaLayerRisks(daLayer, tvs, economicSecurity),
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
    .filter((project) => project.dataAvailabilitySolution)
    .map((project) => ({
      parentProject: project,
      daLayer: project.dataAvailabilitySolution!,
    }))

  return projects.map(({ parentProject, daLayer }) => {
    const usedIn = toUsedInProject([parentProject])
    const tvs = getTvs([parentProject.id])
    const dacInfo =
      daLayer.bridge.type === 'IntegratedDacBridge' &&
      !daLayer.bridge.hideMembers
        ? {
            memberCount: daLayer.bridge.membersCount,
            requiredMembers: daLayer.bridge.requiredMembers,
            membersArePublic:
              !!daLayer.bridge.knownMembers &&
              daLayer.bridge.knownMembers.length > 0,
          }
        : undefined

    const bridgeRisks = getDaBridgeRisks(daLayer.bridge)
    const bridgeEntry: DaBridgeSummaryEntry = {
      name: daLayer.display?.name ?? `${parentProject.display.name} DAC`,
      slug: parentProject.display.slug,
      href: `/scaling/projects/${parentProject.display.slug}`,
      statuses: {},
      tvs,
      risks: {
        isNoBridge: bridgeRisks.isNoBridge,
        values: mapBridgeRisksToRosetteValues(bridgeRisks),
      },
      dacInfo,
      usedIn,
    }
    const daLayerRisks = getDaLayerRisks(daLayer, tvs)

    const projectEntry: DaSummaryEntry = {
      id: parentProject.id,
      slug: parentProject.display.slug,
      name: daLayer.display?.name ?? `${parentProject.display.name} DAC`,
      nameSecondLine: kindToType(daLayer.kind),
      href: `/scaling/projects/${parentProject.display.slug}#da-layer`,
      statuses: {},
      risks: mapLayerRisksToRosetteValues(daLayerRisks),
      fallback: daLayer.fallback,
      challengeMechanism: daLayer.challengeMechanism,
      isPublic: daLayer.systemCategory === 'public',
      economicSecurity: undefined,
      tvs,
      bridges: [bridgeEntry],
    }

    return projectEntry
  })
}

function getEthereumEntry(
  economicSecurity: Record<string, EconomicSecurityData>,
  getTvs: (projectIds: ProjectId[]) => number,
): DaSummaryEntry {
  const bridge = ethereumDaLayer.bridges[0]
  assert(bridge, 'Ethereum DA layer has no bridges')
  mapBridgeRisksToRosetteValues(bridge.risks)
  return {
    id: ProjectId.ETHEREUM,
    slug: ethereumDaLayer.display.slug,
    name: ethereumDaLayer.display.name,
    nameSecondLine: kindToType(ethereumDaLayer.kind),
    href: `/data-availability/projects/${ethereumDaLayer.display.slug}/${ethereumDaLayer.bridges[0].display.slug}`,
    statuses: {},
    economicSecurity: economicSecurity[ethereumDaLayer.id],
    tvs: getTvs(
      ethereumDaLayer.bridges
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
          ethereumDaLayer.bridges
            .flatMap((bridge) => bridge.usedIn)
            .map((usedIn) => usedIn.id),
        ),
        risks: {
          values: mapBridgeRisksToRosetteValues(bridge.risks),
          isNoBridge: false,
        },
        dacInfo: undefined,
        usedIn: ethereumDaLayer.bridges.flatMap((bridge) => bridge.usedIn),
      },
    ],
    isPublic: true,
    challengeMechanism: undefined,
    fallback: undefined,
    risks: mapLayerRisksToRosetteValues(ethereumDaLayer.risks),
  }
}
