import {
  type BlockchainDaLayer,
  type DaBridgeRisks,
  DaCommitteeSecurityRisk,
  type DaLayerRisks,
  type DaRisk,
  type DaServiceDaLayer,
  type DacDaLayer,
  type IntegratedDacBridge,
  type NoDaBridge,
  type NoDacBridge,
  type OnChainDaBridge,
  type StandaloneDacBridge,
} from '@l2beat/config'

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
  economicSecurity?: number,
): DaBridgeRisks & DaLayerRisks {
  return {
    ...getDaLayerRisks(daLayer, totalValueSecured, economicSecurity),
    ...getDaBridgeRisks(daBridge),
  }
}

export function getDaLayerRisks(
  daLayer: Layer,
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

export function getDaBridgeRisks(daBridge: Bridge) {
  const committeeSecurity = getCommitteeSecurity(daBridge)

  return {
    isNoBridge: daBridge.type === 'NoBridge' || daBridge.type === 'NoDacBridge',
    relayerFailure: daBridge.risks.relayerFailure,
    upgradeability: daBridge.risks.upgradeability,
    committeeSecurity,
  }
}

function getEconomicSecurity(
  daLayer: Layer,
  totalValueSecured: number,
  economicSecurity?: number,
) {
  const shouldCalculate =
    daLayer.risks.economicSecurity.type === 'OnChainQuantifiable'
  const hasData = economicSecurity !== undefined && totalValueSecured > 0

  if (!shouldCalculate || !hasData) {
    return daLayer.risks.economicSecurity
  }

  const sentiment = adjustSentiment(totalValueSecured, economicSecurity)

  return {
    ...daLayer.risks.economicSecurity,
    sentiment,
  } as DaRisk
}

function adjustSentiment(totalValueSecured: number, slashableFunds: number) {
  // If economic security > total value secured -> we score green
  if (slashableFunds > totalValueSecured) return 'good'
  // If economic security > 1/3 of total value secured -> we score yellow
  if (slashableFunds > totalValueSecured / 3) return 'warning'
  // If economic security < 1/3 of total value secured -> we score red
  return 'bad'
}

// Should be a parte of the config
function getCommitteeSecurity(bridge: Bridge): DaRisk {
  if (
    bridge.type !== 'IntegratedDacBridge' ||
    bridge.risks.committeeSecurity.type !== 'Auto'
  ) {
    return bridge.risks.committeeSecurity
  }

  const adjustedSentiment = getDacSentiment(bridge)

  return DaCommitteeSecurityRisk.Auto({
    resolved: {
      value: `${bridge.requiredMembers}/${bridge.membersCount}`,
      sentiment: adjustedSentiment,
    },
  })
}

function getDacSentiment(config?: {
  membersCount: number
  knownMembers?: IntegratedDacBridge['knownMembers']
  requiredMembers: number
}) {
  if (!config?.knownMembers) return 'bad'

  const assumedHonestMembers = config.membersCount - config.requiredMembers + 1

  // If less than 6 members or more than 1/3 of members need to be honest, the sentiment is bad
  if (
    config.knownMembers.length < 6 ||
    assumedHonestMembers / config.knownMembers.length > 1 / 3
  ) {
    return 'bad'
  }

  // If less than 5 members are external, the sentiment is bad
  if (config.knownMembers.filter((member) => member.external).length < 5) {
    return 'bad'
  }

  return 'warning'
}
