import type { ProjectDaLayer, TableReadyValue } from '@l2beat/config'

export interface AdjustedDaLayerRisks {
  economicSecurity?: TableReadyValue
  daLayer?: TableReadyValue
  fraudDetection?: TableReadyValue
}

export function getDaLayerRisks(
  daLayer: ProjectDaLayer,
  totalValueSecured: number,
  economicSecurity: number | undefined,
): AdjustedDaLayerRisks {
  return {
    ...daLayer.risks,
    economicSecurity: getEconomicSecurity(
      daLayer,
      totalValueSecured,
      economicSecurity,
    ),
  }
}

function getEconomicSecurity(
  daLayer: ProjectDaLayer,
  totalValueSecured: number,
  economicSecurity?: number,
): TableReadyValue | undefined {
  if (!daLayer.risks.economicSecurity) {
    return
  }
  const shouldCalculate = !!daLayer.risks.economicSecurity.adjustSecurityRisk

  const hasData = economicSecurity !== undefined && totalValueSecured > 0

  if (!shouldCalculate || !hasData) {
    return daLayer.risks.economicSecurity.value
  }

  const sentiment = adjustSentiment(totalValueSecured, economicSecurity)

  return {
    ...daLayer.risks.economicSecurity.value,
    sentiment,
  }
}

function adjustSentiment(totalValueSecured: number, slashableFunds: number) {
  // If economic security > total value secured -> we score green
  if (slashableFunds > totalValueSecured) return 'good'
  // If economic security > 1/3 of total value secured -> we score yellow
  if (slashableFunds > totalValueSecured / 3) return 'warning'
  // If economic security < 1/3 of total value secured -> we score red
  return 'bad'
}
