import { layer2s, layer3s, type DaBridge, type DaLayer } from '@l2beat/config'
import { getDaEconomicSecurity } from './utils/get-da-economic-security'
import { getDaProjectTvl } from './utils/get-da-project-tvl'
import { assert, assertUnreachable } from '@l2beat/shared-pure'
import { getProjectLinks } from '~/utils/project/get-project-links'

export async function getDaProjectEntry(daLayer: DaLayer, bridge: DaBridge) {
  const economicSecurity = await getDaEconomicSecurity()
  const tvs = await getDaProjectTvl(bridge.usedIn)

  return {
    slug: daLayer.display.slug,
    bridgeSlug: bridge.display.slug,
    type: kindToType(daLayer.kind),
    links: getProjectLinks(daLayer.display.links),
    tvs,
    // TODO: economic security for single project
    economicSecurity: economicSecurity[daLayer.id],
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
