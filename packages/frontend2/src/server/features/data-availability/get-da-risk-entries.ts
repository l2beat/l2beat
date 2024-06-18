import { daLayers } from '@l2beat/config'
import { toDaBridge } from './utils/get-da-bridge'
import { getDaRisks } from './utils/get-da-risks'

export async function getDaRiskEntries() {
  return daLayers.flatMap((daLayer) =>
    daLayer.bridges.map((bridge) => ({
      slug: daLayer.display.slug,
      daLayer: daLayer.display.name,
      daBridge: toDaBridge(bridge),
      risks: getDaRisks(daLayer, bridge),
    })),
  )
}

export type DaRiskEntry = Awaited<ReturnType<typeof getDaRiskEntries>>[number]
