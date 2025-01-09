import { Layer2 } from '../../../layer2s'
import { Layer3 } from '../../../layer3s'
import {
  DaCommitteeSecurityRisk,
  DaEconomicSecurityRisk,
  DaFraudDetectionRisk,
  DaUpgradeabilityRisk,
  DacBridge,
  DacDaLayer,
} from '../types'
import { DaLinks } from '../types/DaLinks'
import { DaRelayerFailureRisk } from '../types/DaRelayerFailureRisk'
import { toUsedInProject } from '../utils/to-used-in-project'

type TemplateSpecific = {
  /** Project DAC is associated with */
  project: Layer2 | Layer3
}

type Optionals = {
  /** Overwrite some of the risks, check defaults below */
  risks?: Partial<DacDaLayer['risks'] & DacBridge['risks']>
  /** Links for given DAC, defaults to Project's main links */
  links?: Partial<DaLinks>
  /** Optional layer description and technology, defaults to generic ones. Other considerations will be passed through. */
  layer?: {
    technology?: DacDaLayer['technology']
    description?: DacDaLayer['display']['description']
    otherConsiderations?: DacDaLayer['otherConsiderations']
    numberOfOperators?: DacDaLayer['numberOfOperators']
  }
  /**
   * Optional layer description and technology, defaults to generic ones
   */
  bridge: {
    technology?: DacBridge['technology']
    description?: DacBridge['display']['description']
  } & Pick<
    DacBridge,
    | 'createdAt'
    | 'membersCount'
    | 'knownMembers'
    | 'requiredMembers'
    | 'hideMembers'
    | 'permissions'
    | 'contracts'
    | 'transactionDataType'
    | 'isUnderReview'
    | 'otherConsiderations'
  >
  /** Optional warning, defaults to undefined */
  warning?: DacBridge['display']['warning']
  /** Optional red warning, defaults to undefined */
  redWarning?: DacBridge['display']['redWarning']
  /** Optional challenge mechanism, defaults to undefined */
  challengeMechanism?: DacDaLayer['challengeMechanism']
  /** Optional fallback, defaults to undefined */
  fallback?: DacDaLayer['fallback']
}

type TemplateVars = Optionals & TemplateSpecific

/**
 * Template function for DA-BEAT DACs.
 * Coverts basic information into expected by DA-BEAT shape
 * creating DA-LAYER and DA-BRIDGE without the need to manually
 * duplicate code and files.
 */
export function DAC(template: TemplateVars): DacDaLayer {
  // Common
  const name = `${template.project.display.name} DAC`
  const usedIn = toUsedInProject([template.project])

  // "Bridge" backfill for DAC
  const bridgeDescription =
    template.bridge?.description ??
    `${template.project.display.name} DAC on Ethereum.`

  const bridgeTechnology =
    template.bridge.technology?.description ??
    `## Simple DA Bridge
    The DA bridge is a smart contract verifying a data availability claim from DAC Members via signature verification.
    The bridge requires a ${template.bridge.requiredMembers}/${template.bridge.membersCount} threshold of signatures to be met before the data commitment is accepted.
  `

  const bridgeDisplay: DacBridge['display'] = {
    name: 'DA Bridge',
    slug: 'dac',
    description: bridgeDescription,
    warning: template.warning,
    redWarning: template.redWarning,
    links: {
      apps: template.links?.apps ?? [],
      documentation: template.links?.documentation ?? [],
      explorers: template.links?.explorers ?? [],
      repositories: template.links?.repositories ?? [],
      socialMedia: template.links?.socialMedia ?? [],
      websites: template.links?.websites ?? [],
    },
  }

  const dacBridge: DacBridge = {
    id: `${template.project.display.slug}-dac-bridge`,
    type: 'DAC',
    usedIn,
    ...template.bridge,
    display: bridgeDisplay,
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
  const layerDescription =
    template.layer?.description ??
    'Set of parties responsible for signing and attesting to the availability of data.'

  const layerTechnology =
    template.layer?.technology?.description ??
    `## Simple Committee
  The Data Availability Committee (DAC) is a set of trusted parties responsible for storing data off-chain and serving it upon demand. 
  The security guarantees of DACs depend on the specific setup and can vary significantly based on the criteria for selecting committee members, 
  their operational transparency, and the mechanisms in place to handle disputes and failures.
  `

  const layerDisplay: DacDaLayer['display'] = {
    name,
    slug: template.project.display.slug,
    description: layerDescription,
    links: template.project.display.links,
  }

  const dacLayer: DacDaLayer = {
    id: `${template.project.display.slug}-dac-layer`,
    kind: 'DAC',
    type: 'DaLayer',
    systemCategory: 'custom',
    fallback: template.fallback,
    challengeMechanism: template.challengeMechanism,
    numberOfOperators: template.layer?.numberOfOperators,
    display: layerDisplay,
    technology: {
      description: layerTechnology,
      risks: template.layer?.technology?.risks,
    },
    bridges: [dacBridge],
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
