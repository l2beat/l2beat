import { type DaBridge, type DaLayer, getDaProjectKey } from '@l2beat/config'
import {
  mapBridgeRisksToRosetteValues,
  mapLayerRisksToRosetteValues,
} from '~/app/(side-nav)/data-availability/_utils/map-risks-to-rosette-values'
import { getProjectDetails } from '~/app/(top-nav)/data-availability/projects/[layer]/_utils/get-project-details'
import { type RosetteValue } from '~/components/rosette/types'
import { getDataAvailabilityProjectLinks } from '~/utils/project/get-project-links'
import { getImplementationChangeReport } from '../../implementation-change-report/get-implementation-change-report'
import { getContractsVerificationStatuses } from '../../verification-status/get-contracts-verification-statuses'
import { getManuallyVerifiedContracts } from '../../verification-status/get-manually-verified-contracts'
import { getProjectsVerificationStatuses } from '../../verification-status/get-projects-verification-statuses'
import { getDaRisks } from '../utils/get-da-risks'
import { kindToType } from '../utils/kind-to-layer-type'
import {
  type EconomicSecurityData,
  getDaProjectEconomicSecurity,
} from './utils/get-da-project-economic-security'
import { getDaProjectTvl } from './utils/get-da-project-tvl'

export async function getDaProjectEntry(daLayer: DaLayer, daBridge: DaBridge) {
  const [
    economicSecurity,
    tvsEntries,
    projectsVerificationStatuses,
    contractsVerificationStatuses,
    manuallyVerifiedContracts,
    implementationChangeReport,
  ] = await Promise.all([
    getDaProjectEconomicSecurity(daLayer),
    getDaProjectTvl(
      Object.fromEntries(
        daLayer.bridges.map((b) => [b.id, b.usedIn.map((u) => u.id)] as const),
      ),
    ),
    getProjectsVerificationStatuses(),
    getContractsVerificationStatuses(daLayer),
    getManuallyVerifiedContracts(daLayer),
    getImplementationChangeReport(),
  ])

  const layerTvs = Object.values(tvsEntries).reduce((acc, tvs) => acc + tvs, 0)

  const isVerified =
    !!projectsVerificationStatuses[getDaProjectKey(daLayer, daBridge)]
  const grissiniValues = mapLayerRisksToRosetteValues(
    getDaRisks(
      daLayer,
      daBridge,
      layerTvs,
      economicSecurity,
    ),
  )

  const projectDetails = getProjectDetails({
    daLayer,
    daBridge,
    isVerified,
    contractsVerificationStatuses,
    manuallyVerifiedContracts,
    implementationChangeReport,
    grissiniValues,
  })

  return {
    name: daLayer.display.name,
    slug: daLayer.display.slug,
    kind: daLayer.kind,
    type: kindToType(daLayer.kind),
    description: `${daLayer.display.description} ${daBridge.display.description}`,
    isUnderReview: daLayer.isUnderReview,
    isUpcoming: daLayer.isUpcoming,
    selectedBridge: {
      id: daBridge.id,
      name: daBridge.display.name,
      slug: daBridge.display.slug,
      type: daBridge.type,
      grissiniValues: mapBridgeRisksToRosetteValues(daBridge.risks),
    },
    bridges: daLayer.bridges.map((bridge) => ({
      id: bridge.id,
      name: bridge.display.name,
      slug: bridge.display.slug,
      grissiniValues: mapBridgeRisksToRosetteValues(bridge.risks),
      tvs: tvsEntries[bridge.id] ?? 0,
      usedIn: bridge.usedIn,
    })),
    header: getHeader({
      daLayerGrissiniValues: grissiniValues,
      daBridgeGrissiniValues: mapBridgeRisksToRosetteValues(daBridge.risks),
      daLayer,
      daBridge,
      tvs: layerTvs,
      economicSecurity,
    }),
    projectDetails,
  }
}

interface HeaderParams {
  daLayerGrissiniValues: RosetteValue[]
  daBridgeGrissiniValues: RosetteValue[]
  daLayer: DaLayer
  daBridge: DaBridge
  tvs: number
  economicSecurity: EconomicSecurityData | undefined
}

function getHeader({
  daLayerGrissiniValues,
  daBridgeGrissiniValues,
  daLayer,
  daBridge,
  tvs,
  economicSecurity,
}: HeaderParams) {
  return {
    daLayerGrissiniValues,
    daBridgeGrissiniValues,
    links: getDataAvailabilityProjectLinks(
      daLayer.display.links,
      daBridge.display.links,
    ),
    tvs,
    economicSecurity,
    durationStorage:
      daLayer.kind === 'PublicBlockchain' ? daLayer.pruningWindow : undefined,
    usedIn: daLayer.usedIn,
  }
}

export type DaProjectEntry = Awaited<ReturnType<typeof getDaProjectEntry>>
