import type {
  BlockchainDaLayer,
  DaBridgeRisks,
  DaChallengeMechanism,
  DaLayerRisks,
  DaServiceDaLayer,
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
import { ProjectId } from '@l2beat/shared-pure'
import { uniq } from 'lodash'
import type { CommonProjectEntry } from '../../utils/get-common-project-entry'
import type { EconomicSecurityData } from '../project/utils/get-da-project-economic-security'
import { getUniqueProjectsInUse } from '../utils/get-da-projects'
import { getDaProjectsEconomicSecurity } from '../utils/get-da-projects-economic-security'
import {
  getDaProjectsTvs,
  pickTvsForProjects,
} from '../utils/get-da-projects-tvs'
import { getDaBridgeRisks, getDaLayerRisks } from '../utils/get-da-risks'
import { kindToType } from '../utils/kind-to-layer-type'

export async function getDaSummaryEntries() {
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

  return {
    ethereumEntry: getEthereumEntry(economicSecurity, getTvs),
    entries: [...dacEntries, ...entries].sort((a, b) => b.tvs - a.tvs),
  }
}

export interface DaSummaryEntry extends CommonProjectEntry {
  isPublic: boolean
  economicSecurity: EconomicSecurityData | undefined
  risks: DaLayerRisks
  fallback: TableReadyValue | undefined
  challengeMechanism: DaChallengeMechanism | undefined
  tvs: number
  bridges: DaBridgeSummaryEntry[]
}

export interface DaBridgeSummaryEntry extends Omit<CommonProjectEntry, 'id'> {
  tvs: number
  risks: DaBridgeRisks & { isNoBridge: boolean }
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
        risks: getDaBridgeRisks(daBridge),
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
    risks: getDaLayerRisks(daLayer, tvs, economicSecurity),
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

    const bridgeEntry: DaBridgeSummaryEntry = {
      name: daLayer.display?.name ?? `${parentProject.display.name} DAC`,
      slug: parentProject.display.slug,
      href: `/scaling/projects/${parentProject.display.slug}`,
      statuses: {},
      tvs,
      risks: getDaBridgeRisks(daLayer.bridge),
      dacInfo,
      usedIn,
    }

    const projectEntry: DaSummaryEntry = {
      id: parentProject.id,
      slug: parentProject.display.slug,
      name: daLayer.display?.name ?? `${parentProject.display.name} DAC`,
      nameSecondLine: kindToType(daLayer.kind),
      href: `/scaling/projects/${parentProject.display.slug}#da-layer`,
      statuses: {},
      risks: getDaLayerRisks(daLayer, tvs),
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

export interface DaSummaryEthereumEntry extends Omit<CommonProjectEntry, 'id'> {
  usedIn: UsedInProject[]
  economicSecurity: EconomicSecurityData | undefined
  tvs: number
  bridge: string
}

function getEthereumEntry(
  economicSecurity: Record<string, EconomicSecurityData>,
  getTvs: (projectIds: ProjectId[]) => number,
): DaSummaryEthereumEntry {
  return {
    slug: ethereumDaLayer.display.slug,
    name: ethereumDaLayer.display.name,
    nameSecondLine: kindToType(ethereumDaLayer.kind),
    href: `/data-availability/projects/${ethereumDaLayer.display.slug}/${ethereumDaLayer.bridges[0].display.slug}`,
    statuses: {},
    usedIn: ethereumDaLayer.bridges
      .flatMap((bridge) => bridge.usedIn)
      .sort((a, b) => getTvs([b.id]) - getTvs([a.id])),
    economicSecurity: economicSecurity[ethereumDaLayer.id],
    bridge: ethereumDaLayer.bridges[0].display.name,
    tvs: getTvs(
      ethereumDaLayer.bridges
        .flatMap((bridge) => bridge.usedIn)
        .map((usedIn) => usedIn.id),
    ),
  }
}
