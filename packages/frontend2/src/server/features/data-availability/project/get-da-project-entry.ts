import { type DaBridge, type DaLayer, getDaProjectKey } from '@l2beat/config'
import { getProjectDetails } from '~/app/(legacy)/data-availability/projects/[layer]/_utils/get-project-details'
import { mapRisksToRosetteValues } from '~/app/(new)/data-availability/_utils/map-risks-to-rosette-values'
import { type RosetteValue } from '~/app/_components/rosette/types'
import { getProjectLinks } from '~/utils/project/get-project-links'
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
  const economicSecurity = await getDaProjectEconomicSecurity(daLayer)
  // TODO: Remove it to re-enable per-combination TVL
  const tvlSource = daLayer.kind === 'DAC' ? daBridge : daLayer
  const usedInIds = tvlSource.usedIn.map((p) => p.id)
  const tvs = await getDaProjectTvl(usedInIds)
  const projectsVerificationStatuses = await getProjectsVerificationStatuses()
  const contractsVerificationStatuses =
    await getContractsVerificationStatuses(daLayer)
  const manuallyVerifiedContracts = await getManuallyVerifiedContracts(daLayer)
  const implementationChangeReport = await getImplementationChangeReport()

  const isVerified =
    !!projectsVerificationStatuses[getDaProjectKey(daLayer, daBridge)]
  const rosetteValues = mapRisksToRosetteValues(
    getDaRisks(daLayer, daBridge, tvs, economicSecurity),
  )

  const projectDetails = getProjectDetails({
    daLayer,
    daBridge,
    isVerified,
    contractsVerificationStatuses,
    manuallyVerifiedContracts,
    implementationChangeReport,
    rosetteValues,
  })

  return {
    name: daLayer.display.name,
    slug: daLayer.display.slug,
    type: kindToType(daLayer.kind),
    iconSrc: `/icons/${daLayer.display.slug}.png`,
    description: `${daLayer.display.description} ${daBridge.display.description}`,
    isUnderReview: daLayer.isUnderReview,
    isUpcoming: daLayer.isUpcoming,
    selectedBridge: {
      id: daBridge.id,
      name: daBridge.display.name,
      slug: daBridge.display.slug,
    },
    bridges: daLayer.bridges.map((bridge) => ({
      id: bridge.id,
      name: bridge.display.name,
      slug: bridge.display.slug,
    })),
    header: getHeader({
      rosetteValues,
      daLayer,
      daBridge,
      tvs,
      economicSecurity,
    }),
    projectDetails,
  }
}

interface HeaderParams {
  rosetteValues: RosetteValue[]
  daLayer: DaLayer
  daBridge: DaBridge
  tvs: number
  economicSecurity: EconomicSecurityData | undefined
}

function getHeader({
  rosetteValues,
  daLayer,
  daBridge,
  tvs,
  economicSecurity,
}: HeaderParams) {
  return {
    rosetteValues,
    links: getProjectLinks(daLayer.display.links, daBridge.display.links),
    tvs,
    economicSecurity,
    durationStorage:
      daLayer.kind === 'PublicBlockchain' ? daLayer.pruningWindow : undefined,
    usedIn: daBridge.usedIn,
  }
}

export type DaProjectEntry = Awaited<ReturnType<typeof getDaProjectEntry>>
