import { UnixTime } from '@l2beat/shared-pure'
import { NO_BRIDGE } from '../../templates/no-bridge-template'
import { DaEconomicSecurityRisk } from '../../types/DaEconomicSecurityRisk'
import { DaFraudDetectionRisk } from '../../types/DaFraudDetectionRisk'
import { DaLayer } from '../../types/DaLayer'
import { DasErasureCodingProof } from '../../types/DasErasureCodingProof'
import { DasErasureCodingScheme } from '../../types/DasErasureCodingScheme'

export const espressoDA: DaLayer = {
  id: 'espressoDA',
  type: 'DaLayer',
  kind: 'PublicBlockchain',
  systemCategory: 'public',
  display: {
    name: 'EspressoDA',
    slug: 'espressoDA',
    description:
      'Espresso DA (Tiramisu) is a three-layer data availability (DA) solution based on the HotShot consensus.',
    links: {
      websites: ['https://espressosys.com/'],
      documentation: ['https://docs.espressosys.com/'],
      repositories: ['https://github.com/espressosystems/'],
      apps: [],
      explorers: ['https://explorer.main.net.espresso.network/'],
      socialMedia: [
        'https://x.com/EspressoSys',
        'https://discord.com/invite/YHZPk5dbcq',
        'https://medium.com/@espressosys',
      ],
    },
  },
  technology: {
    description: `
    ## Architecture
    ![EspressoDA architecture](/images/da-layer-technology/espressoDA/architecture.png#center)

    ## Consensus

    EspressoDA uses the HotShot consensus. HotShot is a communication-efficient proof-of-stake consensus protocol that is permissioned and Byzantine Fault Tolerant (BFT). 
    Built on HotStuff-2, it achieves linear communication complexity using a pacemaker module to synchronize views. 
    The protocol ensures safety and liveness as long as over two-thirds of the stake is controlled by honest nodes.

    HotShot operates in a view-by-view manner, with each view assigning a leader and an external builder. 
    During a view, the consensus proposer (or delegate) finalizes a block with a certificate of availability. 

    ## L2s Data Availability
    Using Tiramisu for data availability, the proposer performs three concurrent actions for the block payload: 
    
    - Compute the payload commitment 
    - Disperse to all nodes (Savoiardi).
    - Upload to a small DA committee (Mascarpone).
    - Upload to a content delivery network (Cocoa).

    To retrieve data, users can query any of the three sources, with the Savoiardi layer being the slowest due to the need to reconstruct the data from the erasure-coded shares.
    L2s will be able to call a verifyInclusion function on a L1 light client smart contract to verify that a blob is included in the EspressoDA HotShot chain.
    `,
    references: [],
    risks: [],
  },
  bridges: [
    NO_BRIDGE({
      createdAt: new UnixTime(1721138888), // 2024-07-16T14:08:08Z
      layer: 'EspressoDA',
      description: `The risk profile in this page refers to L2s that do not integrate with a data availability bridge.
        Projects not integrating with a functional DA bridge rely only on the data availability attestation of the sequencer.`,
      technology: {
        description: `No DA bridge is selected. Without a DA bridge, Ethereum has no proof of data availability for this project.\n`,
      },
    }),
  ],
  consensusAlgorithm: {
    name: 'HotShot',
    description: ``,
    blockTime: 8, // average block time
    consensusFinality: 1,
    unbondingPeriod: UnixTime.DAY * 21,
  },
  dataAvailabilitySampling: {
    erasureCodingScheme: DasErasureCodingScheme.TwoDReedSolomon,
    erasureCodingProof: DasErasureCodingProof.ValidityProofs,
  },
  pruningWindow: 0, // does not prune
  risks: {
    economicSecurity: DaEconomicSecurityRisk.OffChainVerifiable,
    fraudDetection: DaFraudDetectionRisk.NoFraudDetection,
  },
}
