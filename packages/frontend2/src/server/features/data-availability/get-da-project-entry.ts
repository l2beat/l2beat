import { layer2s, layer3s, type DaBridge, type DaLayer } from '@l2beat/config'
import { assert } from '@l2beat/shared-pure'
import { getProjectLinks } from '~/utils/project/get-project-links'
import { getDaRisks } from './utils/get-da-risks'
import { mapRisksToRosetteValues } from '~/app/(new)/data-availability/_utils/map-risks-to-rosette-values'
import { getProjectDetails } from '~/app/(legacy)/data-availability/projects/[layer]/_utils/get-project-details'
import { getVerificationStatus } from '../verification-status/get-verification-status'
import { getManuallyVerifiedContracts } from '../verification-status/get-manually-verified-contracts'
import { type RosetteValue } from '~/app/_components/rosette/types'
import { getImplementationChangeReport } from '../implementation-change-report/get-implementation-change-report'
import { getDaProjectTvl } from './utils/get-da-project-tvl'
import { kindToType } from './utils/kind-to-layer-type'
import {
  DaProjectEconomicSecurity,
  getDaProjectEconomicSecurity,
} from './utils/get-da-project-economic-security'

export async function getDaProjectEntry(daLayer: DaLayer, bridge: DaBridge) {
  const economicSecurity = await getDaProjectEconomicSecurity(daLayer)
  const tvs = await getDaProjectTvl(bridge.usedIn)
  const verificationStatus = await getVerificationStatus()
  const manuallyVerifiedContracts = getManuallyVerifiedContracts()
  const implementationChangeReport = await getImplementationChangeReport()

  const rosetteValues = mapRisksToRosetteValues(getDaRisks(daLayer, bridge))

  const projectDetails = getProjectDetails({
    daLayer,
    bridge,
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
    // TODO: How to handle description for layer x bridge combination?
    description: daLayer.display.description,
    isUnderReview: daLayer.isUnderReview,
    isUpcoming: daLayer.isUpcoming,
    selectedBridge: {
      id: bridge.id,
      name: bridge.display.name,
      slug: bridge.display.slug,
    },
    bridges: daLayer.bridges.map((bridge) => ({
      id: bridge.id,
      name: bridge.display.name,
      slug: bridge.display.slug,
    })),
    header: getHeader({
      rosetteValues,
      daLayer,
      bridge,
      tvs,
      economicSecurity,
    }),
    projectDetails,
  }
}

function getHeader({
  rosetteValues,
  daLayer,
  bridge,
  tvs,
  economicSecurity,
}: {
  rosetteValues: RosetteValue[]
  daLayer: DaLayer
  bridge: DaBridge
  tvs: number
  economicSecurity: DaProjectEconomicSecurity | undefined
}) {
  return {
    rosetteValues,
    links: getProjectLinks(daLayer.display.links),
    tvs,
    economicSecurity,
    durationStorage:
      daLayer.kind === 'public-blockchain'
        ? daLayer.storageDuration
        : undefined,
    usedIn: getUsedIn(bridge),
  }
}

function getUsedIn(bridge: DaBridge) {
  return bridge.usedIn.map((projectId) => {
    const project = [...layer2s, ...layer3s].find((p) => p.id === projectId)
    assert(project, `Project not found: ${projectId}`)
    return {
      id: project.id,
      name: project.display.name,
    }
  })
}

export type DaProjectEntry = Awaited<ReturnType<typeof getDaProjectEntry>>
