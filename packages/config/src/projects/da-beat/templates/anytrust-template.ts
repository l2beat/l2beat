import type { ProjectDiscovery } from '../../../discovery/ProjectDiscovery'
import { DaUpgradeabilityRisk } from '../common'
import type { DaBridge, DacDaLayer, IntegratedDacBridge } from '../types'
import type { DaTechnology } from '../types'
import { DAC, type DacTemplateVars } from './dac-template'

type TemplateVars = Omit<DacTemplateVars, 'bridge'> & {
  bridge: {
    technology?: IntegratedDacBridge['technology']
  } & Pick<
    IntegratedDacBridge,
    'addedAt' | 'isUnderReview' | 'otherConsiderations' | 'knownMembers'
  >
  discovery: ProjectDiscovery
}

export function AnytrustDAC(template: TemplateVars): DacDaLayer {
  const dac = template.discovery.getContractValue<{
    membersCount: number
    requiredSignatures: number
  }>('SequencerInbox', 'dacKeyset')
  const { membersCount, requiredSignatures } = dac

  const anytrustBridgeTechnology: DaBridge['technology'] = {
    description: `
    ## DA Bridge Architecture
    ![Anytrust bridge architecture](/images/da-bridge-technology/anytrust/architectureL2.png#center)

    The DA commitments are posted to the destination chain through the sequencer inbox, using the inbox as a DA bridge.
    The DA commitment consists of Data Availability Certificate (DACert), including a hash of the data block, an expiration time, and a proof that the required threshold of Committee members have signed off on the data.
    The sequencer distributes the data and collects signatures from Committee members offchain. Only the DACert is posted by the sequencer to the destination chain inbox (the DA bridge), achieving destination chain transaction ordering finality in a single onchain transaction.
    `,
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
  }

  const layerTechnology: DaTechnology = {
    description: `
    ## Architecture
    ![Anytrust architecture](/images/da-layer-technology/anytrust/architecture${membersCount}.png#center)

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
    `,
    references: [
      {
        text: 'Inside AnyTrust - Arbitrum Docs',
        href: 'https://docs.arbitrum.io/how-arbitrum-works/inside-anytrust',
      },
    ],
  }

  return DAC({
    ...template,
    layer: {
      technology: layerTechnology,
    },
    bridge: {
      ...template.bridge,
      technology: anytrustBridgeTechnology,
      transactionDataType: 'Transaction data (compressed)',
      membersCount,
      requiredMembers: requiredSignatures,
    },
    risks: {
      ...template.risks,
      upgradeability:
        template.risks?.upgradeability ?? DaUpgradeabilityRisk.LowOrNoDelay(),
    },
  })
}
