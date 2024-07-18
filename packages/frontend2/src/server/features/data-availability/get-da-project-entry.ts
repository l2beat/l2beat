import { type DaBridge, type DaLayer } from '@l2beat/config'
import { getProjectDetails } from '~/app/(legacy)/data-availability/projects/[layer]/_utils/get-project-details'
import { mapRisksToRosetteValues } from '~/app/(new)/data-availability/_utils/map-risks-to-rosette-values'
import { type RosetteValue } from '~/app/_components/rosette/types'
import { getProjectLinks } from '~/utils/project/get-project-links'
import { getImplementationChangeReport } from '../implementation-change-report/get-implementation-change-report'
import { getManuallyVerifiedContracts } from '../verification-status/get-manually-verified-contracts'
import { getVerificationStatus } from '../verification-status/get-verification-status'
import {
  type EconomicSecurityData,
  getDaProjectEconomicSecurity,
} from './utils/get-da-project-economic-security'
import { getDaProjectTvl } from './utils/get-da-project-tvl'
import { getDaRisks } from './utils/get-da-risks'
import { getUsedInProjects } from './utils/get-used-in-projects'
import { kindToType } from './utils/kind-to-layer-type'

export async function getDaProjectEntry(daLayer: DaLayer, daBridge: DaBridge) {
  const economicSecurity = await getDaProjectEconomicSecurity(daLayer)
  const tvs = await getDaProjectTvl(daBridge.usedIn)
  const verificationStatus = await getVerificationStatus()
  const manuallyVerifiedContracts = getManuallyVerifiedContracts()
  const implementationChangeReport = await getImplementationChangeReport()

  const rosetteValues = mapRisksToRosetteValues(
    getDaRisks(daLayer, daBridge, tvs, economicSecurity),
  )

  const projectDetails = getProjectDetails({
    daLayer,
    daBridge: daBridge,
    verificationStatus,
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
      daBridge: daBridge,
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
  daBridge: bridge,
  tvs,
  economicSecurity,
}: HeaderParams) {
  return {
    rosetteValues,
    links: getProjectLinks(daLayer.display.links),
    tvs,
    economicSecurity,
    durationStorage:
      daLayer.kind === 'public-blockchain'
        ? daLayer.dataAvailabilitySampling?.pruningWindow
        : undefined,
    usedIn: getUsedInProjects(bridge),
  }
}

export type DaProjectEntry = Awaited<ReturnType<typeof getDaProjectEntry>>
