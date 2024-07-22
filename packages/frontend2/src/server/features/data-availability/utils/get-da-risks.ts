import {
  type DaBridge,
  type DaBridgeRisks,
  type DaEconomicSecurityRisk,
  type DaLayer,
  type DaLayerRisks,
} from '@l2beat/config'
import { type EconomicSecurityData } from './get-da-project-economic-security'

export function getDaRisks(
  daLayer: DaLayer,
  daBridge: DaBridge,
  totalValueSecured: number,
  economicSecurity?: EconomicSecurityData,
): DaBridgeRisks & DaLayerRisks {
  return {
    economicSecurity: getEconomicSecurity(
      daLayer,
      totalValueSecured,
      economicSecurity,
    ),
    fraudDetection: daLayer.risks.fraudDetection,
    attestations: daBridge.risks.attestations,
    exitWindow: daBridge.risks.exitWindow,
    accessibility: daBridge.risks.accessibility,
  }
}

export function getEconomicSecurity(
  daLayer: DaLayer,
  totalValueSecured: number,
  economicSecurity?: EconomicSecurityData,
) {
  const shouldCalculate =
    daLayer.risks.economicSecurity.type === 'OnChainQuantifiable'
  const hasData = economicSecurity?.status === 'Synced' && totalValueSecured > 0

  if (!shouldCalculate || !hasData) {
    return daLayer.risks.economicSecurity
  }

  const sentiment = adjustSentiment(
    totalValueSecured,
    economicSecurity.economicSecurity,
  )

  return {
    ...daLayer.risks.economicSecurity,
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
