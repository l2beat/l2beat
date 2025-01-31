import type { UnixTime } from '@l2beat/shared-pure'
import type {
  DaBridge,
  DaBridgeDisplay,
  DaBridgeRisks,
  DaChallengeMechanism,
  DaLayer,
  DaLayerDisplay,
  DaLayerRisks,
  DaTechnology,
  DacInfo,
  TableReadyValue,
} from '../../../types'
import {
  DaCommitteeSecurityRisk,
  DaEconomicSecurityRisk,
  DaFraudDetectionRisk,
  DaUpgradeabilityRisk,
} from '../common'
import { DaRelayerFailureRisk } from '../common/DaRelayerFailureRisk'

export interface DacTemplateVars {
  bridge: {
    id?: string
    addedAt: UnixTime
    technology?: DaTechnology
    dac: DacInfo
    display?: DaBridgeDisplay
    usedIn?: DaBridge['usedIn']
  }
  layer?: {
    technology: DaTechnology
  }
  fallback?: TableReadyValue
  challengeMechanism?: DaChallengeMechanism
  display?: DaLayerDisplay
  risks?: Partial<DaLayerRisks & DaBridgeRisks>
}

/**
 * Template function for DA-BEAT DACs.
 * Coverts basic information into expected by DA-BEAT shape
 * creating DA-LAYER and DA-BRIDGE without the need to manually
 * duplicate code and files.
 */
export function DAC(template: DacTemplateVars): DaLayer {
  // "Bridge" backfill for DAC
  const bridgeTechnology =
    template.bridge.technology?.description ??
    `## Simple DA Bridge
    The DA bridge is a smart contract verifying a data availability claim from DAC Members via signature verification.
    The bridge requires a ${template.bridge.dac.requiredMembers}/${template.bridge.dac.membersCount} threshold of signatures to be met before the data commitment is accepted.
  `

  const dacBridge: DaBridge = {
    ...template.bridge,
    type: 'IntegratedDacBridge',
    technology: {
      description: bridgeTechnology,
      risks: template.bridge.technology?.risks,
    },
    display: {
      name: 'DAC',
      slug: 'dac',
      description: '',
      ...template.bridge.display,
    },
    risks: {
      committeeSecurity:
        template.risks?.committeeSecurity ??
        DaCommitteeSecurityRisk.AutoDAC({
          requiredMembers: template.bridge.dac.requiredMembers,
          membersCount: template.bridge.dac.membersCount,
          knownMembers: template.bridge.dac.knownMembers,
        }),
      // TODO: make it required and remove the default
      upgradeability:
        template.risks?.upgradeability ?? DaUpgradeabilityRisk.Immutable,
      relayerFailure:
        template.risks?.relayerFailure ?? DaRelayerFailureRisk.NoMechanism,
    },
    usedIn: [],
  }

  // DAC "DA-Layer"

  const layerTechnology =
    template.layer?.technology?.description ??
    `## Simple Committee
  The Data Availability Committee (DAC) is a set of trusted parties responsible for storing data off-chain and serving it upon demand. 
  The security guarantees of DACs depend on the specific setup and can vary significantly based on the criteria for selecting committee members, 
  their operational transparency, and the mechanisms in place to handle disputes and failures.
  `

  const dacLayer: DaLayer = {
    description:
      template.display?.description ??
      'Set of parties responsible for signing and attesting to the availability of data.',
    kind: 'DAC',
    systemCategory: 'custom',
    fallback: template.fallback,
    challengeMechanism: template.challengeMechanism ?? 'None',
    technology: {
      ...template.layer?.technology,
      description: layerTechnology,
    },
    bridges: [dacBridge],
    risks: {
      economicSecurity:
        template.risks?.economicSecurity ?? DaEconomicSecurityRisk.Unknown,
      fraudDetection:
        template.risks?.fraudDetection ?? DaFraudDetectionRisk.NoFraudDetection,
    },
  }

  return dacLayer
}
