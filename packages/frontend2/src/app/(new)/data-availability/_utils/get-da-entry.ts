import { type DaLayer, layer2s } from '@l2beat/config'
import { notUndefined } from '@l2beat/shared-pure'
import { type DataAvailabilityProvider } from '../summary/_components/table/columns'
import { toDaBridge } from './get-da-bridge'
import { getDaRisks } from './get-da-risks'

export function getDaLayerEntry(daLayer: DaLayer): DataAvailabilityProvider[] {
  return daLayer.bridges.map((bridge) => ({
    slug: daLayer.display.slug,
    daLayer: daLayer.display.name,
    daBridge: toDaBridge(bridge),
    risks: getDaRisks(daLayer, bridge),
    tvs: Math.random() * 1_000_000_000,
    economicSecurity: Math.random() * 1_000_000_000,
    layerType: daLayer.kind.display,
    // TODO: maybe we can specify names in the config instead of projectIds
    usedBy: bridge.usedIn
      .map(
        (projectId) => layer2s.find((l2) => l2.id === projectId)?.display.name,
      )
      .filter(notUndefined),
  }))
}
