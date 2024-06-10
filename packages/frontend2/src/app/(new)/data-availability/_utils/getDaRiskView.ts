import {
  DaAccessabilityRisk,
  DaAttestationSecurityRisk,
  type DaBridge,
  type DaBridgeRisks,
  DaEconomicSecurityRisk,
  DaExitWindowRisk,
  DaFraudDetectionRisk,
  type DaLayer,
  type DaLayerRisks,
  type DacBridge,
  type OnChainDaBridge,
} from '@l2beat/config'

export function getDaRiskView(
  layer: DaLayer,
  bridge: DaBridge,
): DaBridgeRisks & DaLayerRisks {
  const fraudDetection = getFraudDetection(layer)

  if (bridge.type === 'NoBridge') {
    return {
      economicSecurity: DaEconomicSecurityRisk.UNKNOWN,
      fraudDetection,
      attestations: DaAttestationSecurityRisk.NOT_VERIFIED,
      exitWindow: DaExitWindowRisk.LOW_OR_NO_DELAY(),
      accessability: DaAccessabilityRisk.NOT_ENSHRINED,
    }
  }

  return {
    economicSecurity: getEconomicSecurity(layer),
    fraudDetection,
    attestations: getAttestationSecurity(bridge),
    exitWindow: getExitWindow(bridge),
    accessability: getAccessibility(bridge),
  }
}

export function getEconomicSecurity(
  layer: DaLayer /*, totalValueSecured: bigint, slashableFunds: bigint */,
) {
  if (layer.type === 'DAC') {
    return DaEconomicSecurityRisk.UNKNOWN
  }

  // Add checks against TVS and SA here later on once we have tha metrics
  return layer.risks.economicSecurity
}

export function getFraudDetection(layer: DaLayer) {
  if (layer.type === 'DAC') {
    return DaFraudDetectionRisk.NO_FRAUD_DETECTION
  }

  return layer.risks.fraudDetection
}

// TODO: Include whether commitment frequency has been satisfied
export function getAttestationSecurity(
  bridge: DacBridge | OnChainDaBridge,
): DaBridgeRisks['attestations'] {
  if (bridge.type === 'DAC') {
    return DaAttestationSecurityRisk.NOT_VERIFIED
  }

  if (bridge.risks.accessability.type === 'ENSHRIRNED') {
    return DaAttestationSecurityRisk.ENSHRINED
  }

  return bridge.risks.attestations
}

export function getExitWindow(bridge: DacBridge | OnChainDaBridge) {
  if (bridge.type === 'DAC') {
    return DaExitWindowRisk.LOW_OR_NO_DELAY()
  }

  return bridge.risks.exitWindow
}

function getAccessibility(bridge: DacBridge | OnChainDaBridge) {
  if (bridge.type === 'DAC') {
    return DaAccessabilityRisk.NOT_ENSHRINED
  }

  return bridge.risks.accessability
}
