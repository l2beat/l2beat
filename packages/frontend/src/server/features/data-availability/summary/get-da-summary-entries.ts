import {
  type BlockchainDaLayer,
  type DaChallengeMechanism,
  type DaCommitteeSecurityRisk,
  type DaEconomicSecurityRisk,
  type DaFraudDetectionRisk,
  type DaRelayerFailureRisk,
  type DaUpgradeabilityRisk,
  type DacDaLayer,
  type DataAvailabilityLayer,
  type UsedInProject,
  daLayers,
  ethereumDaLayer,
  isDaBridgeVerified,
} from '@l2beat/config'
import { ProjectId } from '@l2beat/shared-pure'
import { uniq } from 'lodash'
import { type CommonProjectEntry } from '../../utils/get-common-project-entry'
import { type EconomicSecurityData } from '../project/utils/get-da-project-economic-security'
import { getUniqueProjectsInUse } from '../utils/get-da-projects'
import { getDaProjectsEconomicSecurity } from '../utils/get-da-projects-economic-security'
import {
  getDaProjectsTvl,
  pickTvlForProjects,
} from '../utils/get-da-projects-tvl'
import { getDaBridgeRisks, getDaLayerRisks } from '../utils/get-da-risks'
import { kindToType } from '../utils/kind-to-layer-type'

export async function getDaSummaryEntries() {
  const uniqueProjectsInUse = getUniqueProjectsInUse()
  const [economicSecurity, tvlPerProject] = await Promise.all([
    getDaProjectsEconomicSecurity(),
    getDaProjectsTvl(uniqueProjectsInUse),
  ])
  const getTvs = pickTvlForProjects(tvlPerProject)
  return {
    ethereumEntry: getEthereumEntry(economicSecurity, getTvs),
    entries: daLayers
      .map((daLayer) =>
        getDaSummaryEntry(daLayer, economicSecurity[daLayer.id], getTvs),
      )
      .sort((a, b) => b.tvs - a.tvs),
  }
}

export interface DaSummaryEntry extends CommonProjectEntry {
  isPublic: boolean
  economicSecurity: EconomicSecurityData | undefined
  risks: {
    economicSecurity: DaEconomicSecurityRisk
    fraudDetection: DaFraudDetectionRisk
  }
  fallback: DataAvailabilityLayer | undefined
  challengeMechanism: DaChallengeMechanism | undefined
  tvs: number
  bridges: DaBridgeSummaryEntry[]
}

export interface DaBridgeSummaryEntry extends Omit<CommonProjectEntry, 'id'> {
  tvs: number
  risks: {
    isNoBridge: boolean
    relayerFailure: DaRelayerFailureRisk
    upgradeability: DaUpgradeabilityRisk
    committeeSecurity: DaCommitteeSecurityRisk
  }
  usedIn: UsedInProject[]
  dacInfo:
    | {
        memberCount: number
        requiredMemebers: number
        membersArePublic: boolean
      }
    | undefined
}

function getDaSummaryEntry(
  daLayer: BlockchainDaLayer | DacDaLayer,
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
          daBridge.type === 'DAC'
            ? {
                memberCount: daBridge.membersCount,
                requiredMemebers: daBridge.requiredMembers,
                membersArePublic:
                  !!daBridge.knownMembers &&
                  daBridge.knownMembers.length > 0 &&
                  !daBridge.hideMembers,
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
    fallback: daLayer.fallback,
    challengeMechanism: daLayer.challengeMechanism,
    tvs,
    bridges,
  }
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
    usedIn: ethereumDaLayer.bridges.flatMap((bridge) => bridge.usedIn),
    economicSecurity: economicSecurity[ethereumDaLayer.id],
    bridge: ethereumDaLayer.bridges[0].display.name,
    tvs: getTvs(
      ethereumDaLayer.bridges
        .flatMap((bridge) => bridge.usedIn)
        .map((usedIn) => usedIn.id),
    ),
  }
}
