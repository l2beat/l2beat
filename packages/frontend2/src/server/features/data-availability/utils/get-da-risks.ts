import {
  type DaBridge,
  type DaBridgeRisks,
  type DaEconomicSecurityRisk,
  type DaLayer,
  type DaLayerRisks,
} from '@l2beat/config'
import { type EconomicSecurityData } from './get-da-economic-security'

export function getDaRisks(
  layer: DaLayer,
  bridge: DaBridge,
  totalValueSecured: number,
  economicSecurity?: EconomicSecurityData,
): DaBridgeRisks & DaLayerRisks {
  return {
    economicSecurity: getEconomicSecurity(
      layer,
      totalValueSecured,
      economicSecurity,
    ),
    fraudDetection: layer.risks.fraudDetection,
    attestations: bridge.risks.attestations,
    exitWindow: bridge.risks.exitWindow,
    accessibility: bridge.risks.accessibility,
  }
}

export function getEconomicSecurity(
  layer: DaLayer,
  totalValueSecured: number,
  economicSecurity?: EconomicSecurityData,
) {
  const shouldCalculate =
    layer.risks.economicSecurity.type === 'OnChainQuantifiable'
  const hasData = economicSecurity?.status === 'Synced' && totalValueSecured > 0

  if (!shouldCalculate || !hasData) {
    return layer.risks.economicSecurity
  }

  const sentiment = adjustSentiment(
    totalValueSecured,
    economicSecurity.economicSecurity,
  )

  return {
    ...layer.risks.economicSecurity,
    sentiment,
  } as DaEconomicSecurityRisk
}

function adjustSentiment(totalValueSecured: number, slashableFunds: number) {
  const RATIO_THRESHOLD = 0.25

  const tvsAtThreshold = totalValueSecured * RATIO_THRESHOLD

  if (slashableFunds < tvsAtThreshold) {
    return 'bad'
  }

  if (slashableFunds >= tvsAtThreshold && slashableFunds <= totalValueSecured) {
    return 'warning'
  }

  // slashableFunds >= tvsAtThreshold
  return 'good'
}
