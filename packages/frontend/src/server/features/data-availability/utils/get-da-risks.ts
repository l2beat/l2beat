import type {
  DaBridge,
  DaBridgeRisks,
  DaLayer,
  DaLayerRisks,
  TableReadyValue,
} from '@l2beat/config'

export function getDaRisks(
  daLayer: DaLayer,
  daBridge: DaBridge,
  totalValueSecured: number,
  economicSecurity?: number,
): DaBridgeRisks & DaLayerRisks {
  return {
    ...getDaLayerRisks(daLayer, totalValueSecured, economicSecurity),
    ...getDaBridgeRisks(daBridge),
  }
}

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

export function getDaBridgeRisks(daBridge: DaBridge) {
  return {
    isNoBridge: daBridge.type === 'NoBridge' || daBridge.type === 'NoDacBridge',
    relayerFailure: daBridge.risks.relayerFailure,
    upgradeability: daBridge.risks.upgradeability,
    committeeSecurity: daBridge.risks.committeeSecurity,
  }
}

function getEconomicSecurity(
  daLayer: DaLayer,
  totalValueSecured: number,
  economicSecurity?: number,
): TableReadyValue {
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
