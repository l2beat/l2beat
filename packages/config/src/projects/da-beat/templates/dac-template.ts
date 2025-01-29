import type { ProjectDiscovery } from '../../../discovery/ProjectDiscovery'
import {
  DaCommitteeSecurityRisk,
  DaEconomicSecurityRisk,
  DaFraudDetectionRisk,
  DaUpgradeabilityRisk,
} from '../common'
import { DaRelayerFailureRisk } from '../common/DaRelayerFailureRisk'
import type {
  DaBridgeRisks,
  DaChallengeMechanism,
  DaLayerRisks,
  DacDaLayer,
  DacTransactionDataType,
  IntegratedDacBridge,
} from '../types'
import type { DaLinks } from '../types'

type TemplateSpecific = {
  /** DAC display settings */
  display?: {
    description?: string
  }
}

type Optionals = {
  /** Overwrite some of the risks, check defaults below */
  risks?: Partial<DaLayerRisks & DaBridgeRisks>
  /** Links for given DAC, defaults to Project's main links */
  links?: Partial<DaLinks>
  /** Optional layer description and technology, defaults to generic ones. Other considerations will be passed through. */
  layer?: {
    technology?: DacDaLayer['technology']
    otherConsiderations?: DacDaLayer['otherConsiderations']
  }
  /**
   * Optional bridge technology, defaults to generic ones
   */
  bridge: {
    technology?: IntegratedDacBridge['technology']
  } & Pick<
    IntegratedDacBridge,
    | 'addedAt'
    | 'membersCount'
    | 'knownMembers'
    | 'requiredMembers'
    | 'transactionDataType'
    | 'isUnderReview'
    | 'otherConsiderations'
  >
  /** Optional challenge mechanism, defaults to undefined */
  challengeMechanism?: DaChallengeMechanism
  /** Optional fallback, defaults to undefined */
  fallback?: DacDaLayer['fallback']
}

export type DacTemplateVars = Optionals & TemplateSpecific

export type DacTemplateVarsWithDiscovery = Omit<DacTemplateVars, 'bridge'> & {
  bridge: Pick<
    IntegratedDacBridge,
    'addedAt' | 'isUnderReview' | 'otherConsiderations' | 'knownMembers'
  > & {
    membersCount?: number
    requiredMembers?: number
    transactionDataType?: DacTransactionDataType
  }
  discovery?: ProjectDiscovery
}

/**
 * Template function for DA-BEAT DACs.
 * Coverts basic information into expected by DA-BEAT shape
 * creating DA-LAYER and DA-BRIDGE without the need to manually
 * duplicate code and files.
 */
export function DAC(template: DacTemplateVars): DacDaLayer {
  // "Bridge" backfill for DAC
  const bridgeTechnology =
    template.bridge.technology?.description ??
    `## Simple DA Bridge
    The DA bridge is a smart contract verifying a data availability claim from DAC Members via signature verification.
    The bridge requires a ${template.bridge.requiredMembers}/${template.bridge.membersCount} threshold of signatures to be met before the data commitment is accepted.
  `

  const dacBridge: IntegratedDacBridge = {
    type: 'IntegratedDacBridge',
    ...template.bridge,
    technology: {
      description: bridgeTechnology,
      risks: template.bridge.technology?.risks,
    },
    risks: {
      committeeSecurity:
        template.risks?.committeeSecurity ?? DaCommitteeSecurityRisk.Auto(),
      // TODO: make it required and remove the default
      upgradeability:
        template.risks?.upgradeability ?? DaUpgradeabilityRisk.Immutable,
      relayerFailure:
        template.risks?.relayerFailure ?? DaRelayerFailureRisk.NoMechanism,
    },
    otherConsiderations: template.bridge.otherConsiderations,
  }

  // DAC "DA-Layer"

  const layerTechnology =
    template.layer?.technology?.description ??
    `## Simple Committee
  The Data Availability Committee (DAC) is a set of trusted parties responsible for storing data off-chain and serving it upon demand. 
  The security guarantees of DACs depend on the specific setup and can vary significantly based on the criteria for selecting committee members, 
  their operational transparency, and the mechanisms in place to handle disputes and failures.
  `

  const dacLayer: DacDaLayer = {
    display: {
      description:
        template.display?.description ??
        'Set of parties responsible for signing and attesting to the availability of data.',
    },
    kind: 'DAC',
    type: 'DaLayer',
    systemCategory: 'custom',
    fallback: template.fallback,
    challengeMechanism: template.challengeMechanism ?? 'None',
    technology: {
      ...template.layer?.technology,
      description: layerTechnology,
    },
    bridge: dacBridge,
    risks: {
      economicSecurity:
        template.risks?.economicSecurity ?? DaEconomicSecurityRisk.Unknown,
      fraudDetection:
        template.risks?.fraudDetection ?? DaFraudDetectionRisk.NoFraudDetection,
    },
    otherConsiderations: template.layer?.otherConsiderations,
  }

  return dacLayer
}
