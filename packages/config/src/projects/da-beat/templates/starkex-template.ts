import type { Layer2 } from '../../layer2s'
import type { Layer3 } from '../../layer3s'
import {
  DaCommitteeSecurityRisk,
  DaEconomicSecurityRisk,
  DaFraudDetectionRisk,
  DaUpgradeabilityRisk,
  type DacBridge,
  type DacDaLayer,
} from '../types'
import type { DaLinks } from '../types/DaLinks'
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
    | 'chain'
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
export function StarkexDAC(template: TemplateVars): DacDaLayer {
  // Common
  const name = `${template.project.display.name} DAC`
  const usedIn = toUsedInProject([template.project])

  // "Bridge" backfill for DAC
  const bridgeDescription =
    template.bridge?.description ??
    `${template.project.display.name} DAC on Ethereum.`

  const bridgeTechnology =
    template.bridge.technology?.description ??
    (template.bridge.chain === 1
      ? `
    ## DA Bridge Architecture
    ![starkex bridge architecture](/images/da-bridge-technology/starkex/architectureL2.png#center)
      The DA commitments are posted to the L1 chain, using the Committee Verifier contract as a DA bridge.
      The DA commitment consists of a data hash of the transaction batch the Committee has signed off on and a concatenation of ec-signatures by signatories.
      The Committee Verifier contract verifies the signatures and the data hash and if the required threshold of Committee members has signed off on the data, the hash is stored as a registeredFact in the StarkEx contract.
      In a separate transaction, the operator calls the updateState() function on the StarkEx contract to update the state.
      Before the state update is accepted, the StarkEx contract verifies the transaction public inputs by calling the isValid() function, which verifies the hash derived from state update inputs matches the hash stored by the Committee Verifier contract.
    `
      : `
    ## DA Bridge Architecture
    ![starkex bridge architecture](/images/da-bridge-technology/starkex/architectureL3.png#center)

    The DA commitments are posted to the L2 chain, using the Committee Verifier contract as a DA bridge.
    The DA commitment consists of a data hash of the transaction batch the Committee has signed off on and a concatenation of ec-signatures by signatories.
    The Committee Verifier contract verifies the signatures and the data hash and if the required threshold of Committee members has signed off on the data, the hash is stored as a registeredFact in the StarkEx contract.
    In a separate transaction, the operator calls the updateState() function on the StarkEx contract to update the state.
    Before the state update is accepted, the StarkEx contract verifies the transaction public inputs by calling the isValid() function, which verifies the hash derived from state update inputs matches the hash stored by the Committee Verifier contract.
    `)
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
      ],
    },
    risks: {
      committeeSecurity:
        template.risks?.committeeSecurity ?? DaCommitteeSecurityRisk.Auto(),
      // TODO: make it required and remove the default
      upgradeability:
        template.risks?.upgradeability ??
        DaUpgradeabilityRisk.ImmutableNoSecurity,
      relayerFailure:
        template.risks?.relayerFailure ?? DaRelayerFailureRisk.SelfPropose,
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
    ![starkex architecture](/images/da-layer-technology/starkex/architecture${template.bridge.membersCount}.png#center)

    The Starkware application utilizes a data availability solution that relies on a Committee Service to ensure data persistence. This architecture comprises the following components:

    - **Availability Gateway**: The primary interface provided by the operator for committee members to access new batch information and submit signed availability claims.
    - **Data Availability Committee (DAC)**: A group of nodes responsible for storing state data associated with each Merkle root and attesting to data availability by signing claims.
    - **Data Batches**: Collections of transactions processed in batches that update the state of accounts, resulting in a new Merkle root representing the updated state.
    
    Committee members run services that interact with the Availability Gateway to obtain information about new batches and submit their signed availability claims. Each batch includes a unique batch_id, a reference to a previous batch, and a list of account updates. 
    Committee members combine this information with data from the reference batch to compute the new state and verify the Merkle root.
    
    When the operator produces a new batch, it must be signed by a minimum number of committee members—as defined by the application's configuration—for it to be accepted onchain. 
    This includes all members designated as mandatory signers. If the operator attempts to submit a batch without the required signatures, it will be rejected, thereby ensuring that data remains available and consistent.
    
    Committee members are expected to maintain a database that stores the data associated with each batch, making use of storage solutions with a replication factor of at least 2.
  
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
    // https://github.com/starkware-libs/starkex-data-availability-committee?tab=readme-ov-file#publishing-committee-members-data
    challengeMechanism: template.challengeMechanism,
    display: layerDisplay,
    technology: {
      description: layerTechnology,
      risks: template.layer?.technology?.risks,
      references: [
        {
          text: 'StarkEx Committee Service - Source Code',
          href: 'https://github.com/starkware-libs/starkex-data-availability-committee',
        },
      ],
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
