import {
  type DaBridgeRisks,
  type DaLayer,
  type DaLayerRisks,
  layer2s,
} from '@l2beat/config'
import { notUndefined } from '@l2beat/shared-pure'
import {
  type DaSummaryEntryBridge,
  toDaBridge,
} from '../../_utils/get-da-bridge'
import { getDaRisks } from '../../_utils/get-da-risks'

export type DaSummaryEntry = {
  slug: string
  daLayer: string
  daBridge: DaSummaryEntryBridge | null
  risks: DaBridgeRisks & DaLayerRisks
  layerType: string
  tvs: number
  economicSecurity: number
  usedBy: string[]
}

export function toDaSummaryEntry(daLayer: DaLayer): DaSummaryEntry[] {
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
