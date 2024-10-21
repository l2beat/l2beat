import { type DaBridge, type DaLayer, getDaProjectKey } from '@l2beat/config'
import { getProjectDetails } from '~/app/(top-nav)/data-availability/projects/[layer]/_utils/get-project-details'
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
import { mapRisksToGrisiniItems } from '~/app/(side-nav)/data-availability/_utils/map-risks-to-rosette-values'
import { GrisiniValue } from '~/components/grisini/types'

export async function getDaProjectEntry(daLayer: DaLayer, daBridge: DaBridge) {
  // TODO: Remove it to re-enable per-combination TVL
  const tvlSource = daLayer.kind === 'DAC' ? daBridge : daLayer
  const usedInIds = tvlSource.usedIn.map((p) => p.id)

  const [
    economicSecurity,
    tvs,
    projectsVerificationStatuses,
    contractsVerificationStatuses,
    manuallyVerifiedContracts,
    implementationChangeReport,
  ] = await Promise.all([
    getDaProjectEconomicSecurity(daLayer),
    getDaProjectTvl(usedInIds),
    getProjectsVerificationStatuses(),
    getContractsVerificationStatuses(daLayer),
    getManuallyVerifiedContracts(daLayer),
    getImplementationChangeReport(),
  ])

  const isVerified =
    !!projectsVerificationStatuses[getDaProjectKey(daLayer, daBridge)]
  const grisiniValues = mapRisksToGrisiniItems(
    getDaRisks(daLayer, daBridge, tvs, economicSecurity),
  )

  const projectDetails = getProjectDetails({
    daLayer,
    daBridge,
    isVerified,
    contractsVerificationStatuses,
    manuallyVerifiedContracts,
    implementationChangeReport,
    grisiniValues,
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
    },
    bridges: daLayer.bridges.map((bridge) => ({
      id: bridge.id,
      name: bridge.display.name,
      slug: bridge.display.slug,
    })),
    header: getHeader({
      grisiniValues,
      daLayer,
      daBridge,
      tvs,
      economicSecurity,
    }),
    projectDetails,
  }
}

interface HeaderParams {
  grisiniValues: GrisiniValue[]
  daLayer: DaLayer
  daBridge: DaBridge
  tvs: number
  economicSecurity: EconomicSecurityData | undefined
}

function getHeader({
  grisiniValues,
  daLayer,
  daBridge,
  tvs,
  economicSecurity,
}: HeaderParams) {
  return {
    grisiniValues,
    links: getDataAvailabilityProjectLinks(
      daLayer.display.links,
      daBridge.display.links,
    ),
    tvs,
    economicSecurity,
    durationStorage:
      daLayer.kind === 'PublicBlockchain' ? daLayer.pruningWindow : undefined,
    usedIn: daBridge.usedIn,
  }
}

export type DaProjectEntry = Awaited<ReturnType<typeof getDaProjectEntry>>
