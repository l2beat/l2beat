import {
  type DaBridge,
  type DaBridgeRisks,
  type DaLayer,
  type DaLayerRisks,
} from '@l2beat/config'
import { type RosetteValue } from '~/app/_components/rosette/types'

export function getDaRisks(
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

export function mapRisksToRosetteValues(
  risks: DaBridgeRisks & DaLayerRisks,
): RosetteValue[] {
  const values: RosetteValue[] = [
    {
      name: 'Economic security',
      value: risks.economicSecurity.value,
      sentiment: risks.economicSecurity.sentiment,
    },
    {
      name: 'Fraud detection',
      value: risks.fraudDetection.value,
      sentiment: risks.fraudDetection.sentiment,
    },
    {
      name: 'Attestations',
      value: risks.attestations.value,
      sentiment: risks.attestations.sentiment,
    },
    {
      name: 'Exit window',
      value: risks.exitWindow.value,
      sentiment: risks.exitWindow.sentiment,
    },
    {
      name: 'Accessibility',
      value: risks.accessibility.value,
      sentiment: risks.accessibility.sentiment,
    },
  ]

  return values
}
