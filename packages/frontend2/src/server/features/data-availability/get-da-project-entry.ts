import { layer2s, layer3s, type DaBridge, type DaLayer } from '@l2beat/config'
import { assert, assertUnreachable } from '@l2beat/shared-pure'
import { getProjectLinks } from '~/utils/project/get-project-links'
import { getDaRisks } from './utils/get-da-risks'
import { mapRisksToRosetteValues } from '~/app/(new)/data-availability/_utils/map-risks-to-rosette-values'

export async function getDaProjectEntry(daLayer: DaLayer, bridge: DaBridge) {
  // const economicSecurity = await getDaEconomicSecurity()
  // const tvs = await getDaProjectTvl(bridge.usedIn)

  return {
    name: daLayer.display.name,
    slug: daLayer.display.slug,
    // TODO: How to handle description for layer x bridge combination?
    description: daLayer.display.description,
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
    risks: mapRisksToRosetteValues(getDaRisks(daLayer, bridge)),
    type: kindToType(daLayer.kind),
    links: getProjectLinks(daLayer.display.links),
    tvs: 1000,
    // TODO: economic security for single project
    economicSecurity: {
      id: 'noclue',
      status: 'Synced',
      economicSecurity: 10,
    },
    durationStorage:
      daLayer.kind === 'PublicBlockchain' ? daLayer.storageDuration : undefined,
    usedIn: getUsedIn(bridge),
  }
}

function kindToType(kind: DaLayer['kind']) {
  switch (kind) {
    case 'PublicBlockchain':
      return 'Public blockchain'
    case 'DAC':
      return 'Data Availability Committee'
    default:
      return assertUnreachable(kind)
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
