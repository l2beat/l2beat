import {
  type DaBridge,
  type DaBridgeRisks,
  type DaLayer,
  type DaLayerRisks,
} from '@l2beat/config'

export function getDaRisks(
  daLayer: DaLayer,
  daBridge: DaBridge,
): DaBridgeRisks & DaLayerRisks {
  return {
    economicSecurity: getEconomicSecurity(daLayer),
    fraudDetection: daLayer.risks.fraudDetection,
    attestations: daBridge.risks.attestations,
    exitWindow: daBridge.risks.exitWindow,
    accessibility: daBridge.risks.accessibility,
  }
}

export function getEconomicSecurity(
  daLayer: DaLayer /*, totalValueSecured: bigint, slashableFunds: bigint */,
) {
  // Add checks against TVS and SA here later on once we have tha metrics
  return daLayer.risks.economicSecurity
}
