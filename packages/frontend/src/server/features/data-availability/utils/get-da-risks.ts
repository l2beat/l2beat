import type {
  BlockchainDaLayer,
  DaBridgeRisks,
  DaLayerRisks,
  DaServiceDaLayer,
  DacDaLayer,
  IntegratedDacBridge,
  NoDaBridge,
  NoDacBridge,
  OnChainDaBridge,
  StandaloneDacBridge,
  TableReadyValue,
} from '@l2beat/config'
import type { EconomicSecurityData } from '../project/utils/get-da-project-economic-security'

type Layer = BlockchainDaLayer | DacDaLayer | DaServiceDaLayer
type Bridge =
  | NoDaBridge
  | OnChainDaBridge
  | StandaloneDacBridge
  | IntegratedDacBridge
  | NoDacBridge

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
    isNoBridge: daBridge.type === 'NoBridge' || daBridge.type === 'NoDacBridge',
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
  // TODO: This feels wrong!
  const shouldCalculate =
    daLayer.risks.economicSecurity.value === 'Staked assets'
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
  } as TableReadyValue
}

function adjustSentiment(totalValueSecured: number, slashableFunds: number) {
  // If economic security > total value secured -> we score green
  if (slashableFunds > totalValueSecured) return 'good'
  // If economic security > 1/3 of total value secured -> we score yellow
  if (slashableFunds > totalValueSecured / 3) return 'warning'
  // If economic security < 1/3 of total value secured -> we score red
  return 'bad'
}
