import {
  type BlockchainDaLayer,
  type DaBridgeRisks,
  type DaEconomicSecurityRisk,
  type DaLayerRisks,
  type DaServiceDaLayer,
  type DacDaLayer,
  type NoDaBridge,
  type OnChainDaBridge,
  type StandaloneDacBridge,
} from '@l2beat/config'
import { type EconomicSecurityData } from '../project/utils/get-da-project-economic-security'

type Layer = BlockchainDaLayer | DacDaLayer | DaServiceDaLayer
type Bridge = NoDaBridge | OnChainDaBridge | StandaloneDacBridge

export function getDaRisks(
  daLayer: Layer,
  daBridge: Bridge,
  totalValueSecured: number,
  economicSecurity?: EconomicSecurityData,
): DaBridgeRisks & DaLayerRisks {
  return {
    ...getDaLayerRisks(daLayer, totalValueSecured, economicSecurity),
    ...getDaBridgeRisks(daBridge),
  }
}

export function getDaLayerRisks(
  daLayer: Layer,
  totalValueSecured: number,
  economicSecurity?: EconomicSecurityData,
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

export function getDaBridgeRisks(daBridge: Bridge) {
  return {
    isNoBridge: daBridge.type === 'NoBridge',
    relayerFailure: daBridge.risks.relayerFailure,
    upgradeability: daBridge.risks.upgradeability,
    committeeSecurity: daBridge.risks.committeeSecurity,
  }
}

function getEconomicSecurity(
  daLayer: Layer,
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
  // If economic security > total value secured -> we score green
  if (slashableFunds > totalValueSecured) return 'good'
  // If economic security > 1/3 of total value secured -> we score yellow
  if (slashableFunds > totalValueSecured / 3) return 'warning'
  // If economic security < 1/3 of total value secured -> we score red
  return 'bad'
}
