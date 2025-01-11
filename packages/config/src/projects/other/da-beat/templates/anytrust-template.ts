import { DA_LAYERS } from '../../../../common'
import {
  DaCommitteeSecurityRisk,
  DaEconomicSecurityRisk,
  DaFraudDetectionRisk,
  DaUpgradeabilityRisk,
  DacDaLayer,
  IntegratedDacBridge,
} from '../types'
import { DaLinks } from '../types/DaLinks'
import { DaRelayerFailureRisk } from '../types/DaRelayerFailureRisk'

type TemplateSpecific = {
  /** Project DAC is associated with */
  project: string
}

type Optionals = {
  /** Overwrite some of the risks, check defaults below */
  risks?: Partial<DacDaLayer['risks'] & IntegratedDacBridge['risks']>
  /** Links for given DAC, defaults to Project's main links */
  links?: Partial<DaLinks>
  /** Optional layer description and technology, defaults to generic ones. Other considerations will be passed through. */
  layer?: {
    technology?: DacDaLayer['technology']
    otherConsiderations?: DacDaLayer['otherConsiderations']
  }
  /**
   * Optional layer description and technology, defaults to generic ones
   */
  bridge: {
    technology?: IntegratedDacBridge['technology']
  } & Pick<
    IntegratedDacBridge,
    | 'createdAt'
    | 'membersCount'
    | 'knownMembers'
    | 'requiredMembers'
    | 'transactionDataType'
    | 'isUnderReview'
    | 'otherConsiderations'
  >
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
export function AnytrustDAC(template: TemplateVars): DacDaLayer {
  // Common
  const name = `${template.project} DAC`

  // "Bridge" backfill for DAC

  const bridgeTechnology =
    template.bridge.technology?.description ??
    `
    ## DA Bridge Architecture
    ![Anytrust bridge architecture](/images/da-bridge-technology/anytrust/architectureL2.png#center)


    The DA commitments are posted to the destination chain through the sequencer inbox, using the inbox as a DA bridge.
    The DA commitment consists of Data Availability Certificate (DACert), including a hash of the data block, an expiration time, and a proof that the required threshold of Committee members have signed off on the data.
    The sequencer distributes the data and collects signatures from Committee members offchain. Only the DACert is posted by the sequencer to the destination chain inbox (the DA bridge), achieving destination chain transaction ordering finality in a single onchain transaction.
    `

  const dacBridge: IntegratedDacBridge = {
    type: 'IntegratedDacBridge',
    ...template.bridge,
    technology: {
      description: bridgeTechnology,
      risks: [
        {
          category: 'Funds can be lost if',
          text: `a malicious committee attests to an invalid data availability certificate.`,
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
        template.risks?.upgradeability ?? DaUpgradeabilityRisk.LowOrNoDelay(),
      relayerFailure:
        template.risks?.relayerFailure ?? DaRelayerFailureRisk.NoMechanism,
    },
    otherConsiderations: template.bridge.otherConsiderations,
  }

  // DAC "DA-Layer"

  const layerTechnology =
    template.layer?.technology?.description ??
    `
    ## Architecture
    ![Anytrust architecture](/images/da-layer-technology/anytrust/architecture${template.bridge.membersCount}.png#center)

    The DAC uses a data availability solution built on the AnyTrust protocol. It is composed of the following components:
    - **Sequencer Inbox**: Main entry point for the Sequencer submitting transaction batches.
    - **Data Availability Committee (DAC)**: A group of members responsible for storing and providing data on demand.
    - **Data Availability Certificate (DACert)**: A commitment ensuring that data blobs are available without needing full data posting on the L1 chain. 

    
    Committee members run servers that support APIs for storing and retrieving data blobs. 
    The Sequencer API allows the rollup Sequencer to submit data blobs for storage, while the REST API enables anyone to fetch data by hash. 
    When the Sequencer produces a data batch, it sends the batch along with an expiration time to Committee members, who store it and sign it. 
    Once enough signatures are collected, the Sequencer aggregates them into a valid DACert and posts it to the L1 chain inbox. 
    If the Sequencer fails to collect enough signatures, it falls back to posting the full data to the L1 chain. \n

    A DACert includes a hash of the data block, an expiration time, and proof that the required threshold of Committee members have signed off on the data. 
    The proof consists of a hash of the Keyset used in signing, a bitmap indicating which members signed, and a BLS aggregated signature. 
    L2 nodes reading from the sequencer inbox verify the certificate’s validity by checking the number of signers, the aggregated signature, and that the expiration time is at least two weeks ahead of the L2 timestamp. 
    If the DACert is valid, it provides a proof that the corresponding data is available from honest committee members.
    `

  const dacLayer: DacDaLayer = {
    name: name,
    kind: 'DAC',
    type: 'DaLayer',
    systemCategory: 'custom',
    fallback: template.fallback ?? DA_LAYERS.ETH_BLOBS,
    challengeMechanism: template.challengeMechanism,
    technology: {
      description: layerTechnology,
      references: [
        {
          text: 'Inside AnyTrust - Arbitrum Docs',
          href: 'https://docs.arbitrum.io/how-arbitrum-works/inside-anytrust',
        },
      ],
      risks: template.layer?.technology?.risks,
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
