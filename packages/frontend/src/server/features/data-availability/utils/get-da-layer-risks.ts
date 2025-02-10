import type { DaLayer, TableReadyValue } from '@l2beat/config'

export function getDaLayerRisks(
  daLayer: DaLayer,
  totalValueSecured: number,
  economicSecurity?: number,
) {
  return {
    economicSecurity: getEconomicSecurity(
      daLayer,
      totalValueSecured,
      economicSecurity,
    ),
    fraudDetection: daLayer.risks.fraudDetection,
  }
}

function getEconomicSecurity(
  daLayer: DaLayer,
  totalValueSecured: number,
  economicSecurity?: number,
): TableReadyValue | undefined {
  if (!daLayer.risks.economicSecurity) {
    return
  }
  // TODO: This feels wrong!
  const shouldCalculate =
    daLayer.risks.economicSecurity.value === 'Staked assets'
  const hasData = economicSecurity !== undefined && totalValueSecured > 0

  if (!shouldCalculate || !hasData) {
    return daLayer.risks.economicSecurity
  }

  const sentiment = adjustSentiment(totalValueSecured, economicSecurity)

  return {
    ...daLayer.risks.economicSecurity,
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
