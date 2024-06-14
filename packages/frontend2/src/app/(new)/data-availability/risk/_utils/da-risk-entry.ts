import { type DaLayer } from '@l2beat/config'
import { toDaBridge } from '../../_utils/get-da-bridge'
import { getDaRisks } from '../../_utils/get-da-risks'
import { type DaRiskEntry } from '../_components/table/columns'

export function toDaRiskEntry(daLayer: DaLayer): DaRiskEntry[] {
  return daLayer.bridges.map((bridge) => ({
    slug: daLayer.display.slug,
    daLayer: daLayer.display.name,
    daBridge: toDaBridge(bridge),
    risks: getDaRisks(daLayer, bridge),
  }))
}
