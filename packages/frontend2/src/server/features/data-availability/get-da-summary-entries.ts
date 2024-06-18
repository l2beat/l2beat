import { DaLayerKindDisplay, daLayers, layer2s } from '@l2beat/config'
import { notUndefined } from '@l2beat/shared-pure'
import { toDaBridge } from './utils/get-da-bridge'
import { getDaEconomicSecurity } from './utils/get-da-economic-security'
import { getDaRisks } from './utils/get-da-risks'

export async function getDaSummaryEntries() {
  const economicSecurity = await getDaEconomicSecurity()

  // Mapping
  return daLayers.flatMap((daLayer) =>
    daLayer.bridges.map((bridge) => ({
      slug: daLayer.display.slug,
      daLayer: daLayer.display.name,
      daBridge: toDaBridge(bridge),
      risks: getDaRisks(daLayer, bridge),
      tvs: Math.random() * 1_000_000_000,
      economicSecurity: economicSecurity[daLayer.id],
      layerType: DaLayerKindDisplay[daLayer.kind],
      // TODO: maybe we can specify names in the config instead of projectIds
      usedBy: bridge.usedIn
        .map(
          (projectId) =>
            layer2s.find((l2) => l2.id === projectId)?.display.name,
        )
        .filter(notUndefined),
    })),
  )
}

export type DaSummaryEntry = Awaited<
  ReturnType<typeof getDaSummaryEntries>
>[number]
