import {
  type DaBridge,
  type DaBridgeRisks,
  type DaLayer,
  type DaLayerRisks,
} from '@l2beat/config'

export function getDaRiskView(
  layer: DaLayer,
  bridge: DaBridge,
): DaBridgeRisks & DaLayerRisks {
  return {
    economicSecurity: getEconomicSecurity(layer),
    fraudDetection: layer.risks.fraudDetection,
    attestations: bridge.risks.attestations,
    exitWindow: bridge.risks.exitWindow,
    accessibility: bridge.risks.accessibility,
  }
}

export function getEconomicSecurity(
  layer: DaLayer /*, totalValueSecured: bigint, slashableFunds: bigint */,
) {
  // Add checks against TVS and SA here later on once we have tha metrics
  return layer.risks.economicSecurity
}
