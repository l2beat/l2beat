import { type DaBridge, type DaLayer, getDaProjectKey } from '@l2beat/config'
import { type UsedInProject } from '@l2beat/config/build/src/projects/other/da-beat/types/UsedInProject'
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
import {
  getDaProjectsTvl,
  pickTvlForProjects,
} from '../utils/get-da-projects-tvl'
import { getDaRisks } from '../utils/get-da-risks'
import { kindToType } from '../utils/kind-to-layer-type'
import {
  type EconomicSecurityData,
  getDaProjectEconomicSecurity,
} from './utils/get-da-project-economic-security'

export async function getDaProjectEntry(daLayer: DaLayer, daBridge: DaBridge) {
  const uniqueProjectsInUse = [
    ...new Set(
      daLayer.bridges.flatMap((bridge) =>
        bridge.usedIn.map((project) => project.id),
      ),
    ),
  ]
  const [
    economicSecurity,
    tvlPerProject,
    projectsVerificationStatuses,
    contractsVerificationStatuses,
    manuallyVerifiedContracts,
    implementationChangeReport,
  ] = await Promise.all([
    getDaProjectEconomicSecurity(daLayer),
    getDaProjectsTvl(uniqueProjectsInUse),
    getProjectsVerificationStatuses(),
    getContractsVerificationStatuses(daLayer),
    getManuallyVerifiedContracts(daLayer),
    getImplementationChangeReport(),
  ])

  const layerTvs =
    tvlPerProject.reduce((acc, value) => acc + value.tvl, 0) / 100
  const getSumFor = pickTvlForProjects(tvlPerProject)

  const isVerified =
    !!projectsVerificationStatuses[getDaProjectKey(daLayer, daBridge)]
  const grissiniValues = mapLayerRisksToRosetteValues(
    getDaRisks(daLayer, daBridge, layerTvs, economicSecurity),
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
      tvs: getSumFor(bridge.usedIn.map((project) => project.id)),
      type: bridge.type,
      usedIn: bridge.usedIn.sort(
        (a, b) => getSumFor([b.id]) - getSumFor([a.id]),
      ),
    })),
    header: getHeader({
      daLayerGrissiniValues: grissiniValues,
      daBridgeGrissiniValues: mapBridgeRisksToRosetteValues(daBridge.risks),
      daLayer,
      tvs: layerTvs,
      economicSecurity,
      usedIn: daLayer.usedIn.sort(
        (a, b) => getSumFor([b.id]) - getSumFor([a.id]),
      ),
    }),
    projectDetails,
  }
}

interface HeaderParams {
  daLayerGrissiniValues: RosetteValue[]
  daBridgeGrissiniValues: RosetteValue[]
  daLayer: DaLayer
  tvs: number
  economicSecurity: EconomicSecurityData | undefined
  usedIn: UsedInProject[]
}

function getHeader({
  daLayerGrissiniValues,
  daBridgeGrissiniValues,
  daLayer,
  tvs,
  economicSecurity,
  usedIn,
}: HeaderParams) {
  return {
    daLayerGrissiniValues,
    daBridgeGrissiniValues,
    links: getDataAvailabilityProjectLinks(daLayer),
    tvs,
    economicSecurity,
    durationStorage:
      daLayer.kind === 'PublicBlockchain' ? daLayer.pruningWindow : undefined,
    numberOfOperators: daLayer.numberOfOperators,
    usedIn,
  }
}

export type DaProjectEntry = Awaited<ReturnType<typeof getDaProjectEntry>>
