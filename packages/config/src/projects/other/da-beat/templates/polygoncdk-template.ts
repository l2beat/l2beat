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
export function PolygoncdkDAC(template: TemplateVars): DacDaLayer {
  // Common
  const name = `${template.project.display.name} DAC`
  const usedIn = toUsedInProject([template.project])

  // "Bridge" backfill for DAC
  const bridgeDescription =
    template.bridge?.description ??
    `${template.project.display.name} DAC on Ethereum.`

  const bridgeTechnology =
    template.bridge.technology?.description ??
    `
    ## DA Bridge Architecture
    ![polygoncdk bridge architecture](/images/da-bridge-technology/polygoncdk/architectureL2.png#center)
    The DA commitments are posted to the destination chain through the sequencer inbox, using the inbox as a DA bridge.
    The DA commitment consists of a data availability message provided as transaction input, made up of a byte array containing the signatures and all the addresses of the committee in ascending order.
    The sequencer distributes the data and collects signatures from Committee members offchain. Only the DA message is posted by the sequencer to the destination chain inbox (the DA bridge).
    A separate contract, the PolygonCommittee contract, is used to manage the committee members list and verify the signatures before accepting the DA commitment.
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
      risks: [
        {
          category: 'Funds can be lost if',
          text: `a malicious committee signs a data availability attestation for an unavailable transaction batch.`,
        },
        {
          category: 'Funds can be lost if',
          text: `the bridge contract or its dependencies receive a malicious code upgrade. There is no delay on code upgrades.`,
        },
      ],
    },
    risks: {
      committeeSecurity:
        template.risks?.committeeSecurity ?? DaCommitteeSecurityRisk.Auto(),
      // TODO: make it required and remove the default
      upgradeability:
        template.risks?.upgradeability ?? DaUpgradeabilityRisk.LowOrNoDelay(0),
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
    `
    ## Architecture
    ![polygoncdk architecture](/images/da-layer-technology/polygoncdk/architecture${template.bridge.membersCount}.png#center)

    Polygon CDK validiums utilize a data availability solution that relies on a Data Availability Committee (DAC) to ensure data integrity and manage off-chain transaction data. 
    This architecture comprises the following components:
    - **Operator**: A trusted entity that collects transactions, computes hash values for the transaction batch, and then requests and collects signatures from Committee members.
    - **Data Availability Committee (DAC)**: A group of nodes responsible for validating batch data against the hash values provided by the operator (sequencer), ensuring the data accurately represents the transactions.
    - **PolygonCommittee Contract**: Contract responsible for managing the data committee members list.
    Each DAC node independently validates the batch data, ensuring it matches the received hash values. 
    Upon successful validation, DAC members store the hash values locally and generate signatures endorsing the batch's integrity. 
    The sequencer collects these signatures and submits the transactions batch hash together with the aggregated signature on Ethereum.
    The PolygonCommittee contract is used during batch sequencing to verify that the signature posted by the sequencer was signed off by the DAC members stored in the contract.
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
    fallback: template.fallback, // Currently none?
    // https://github.com/0xPolygon/cdk-validium-node/blame/0a1743e0009a3225858c24328459d44ddb44a3ae/docs/diff/diff.md#L101
    challengeMechanism: template.challengeMechanism,
    display: layerDisplay,
    technology: {
      description: layerTechnology,
      risks: template.layer?.technology?.risks,
      references: [
        {
          text: 'Polygon CDK Validium Documentation',
          href: 'https://docs.polygon.technology/cdk/architecture/cdk-validium/#data-availability-committee-dac',
        },
      ],
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
