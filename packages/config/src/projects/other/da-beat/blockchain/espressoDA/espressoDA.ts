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

    EspressoDA uses the HotShot consensus protocol, a communication-efficient, permissioned proof-of-stake system that is Byzantine Fault Tolerant (BFT). 
    Built on HotStuff-2, it achieves linear communication complexity using a pacemaker module to synchronize views and ensures safety and liveness as long as over two-thirds of the stake is controlled by honest nodes.

    HotShot operates in a view-by-view manner, where each view designates a leader and an external builder. 
    During a view, the consensus proposer (or delegate) finalizes a block with a certificate of availability by utilizing Tiramisu for data availability.

    ## Data Availability Certificate

    Once the proposer sends data to HotShot node operators, they initiate Tiramisu's three layers of data availability:
    
    - **Savoiardi**: Disperses the data to all nodes.
    - **Mascarpone**: Uploads the data and commitment to a small DA committee.
    - **Cocoa**: Uploads the data and commitment to a content delivery network (CDN). 


    A DA certificate consists of two components: the retrievability certificate and the optimistic DAC certificate:

    - **Retrievability Certificate**: Formed when the DA leader collects 1/3 + 1  strong votes either from committee nodes or regular nodes, or 1/3 + m normal votes, where ( m ) is the number of VID shares into which the block was split.
    - **Optimistic DAC Certificate**: Formed when the DA leader gathers 2*(S - T) + 1 strong votes from the DA committee, where S represents the committee size and T the threshold for the committee. 

    Once the DAC is formed, the DA leader stops broadcasting data to the nodes.

    ## L2s Data Availability
  
    The life cycle of L2 rollup transactions begins with users submitting transactions to the Tiramisu DA mempool through an RPC endpoint, including a namespace ID to indicate the target L2 rollup. 
    A DA leader collects and disperses these transactions across Tiramisu's layers to form a DA certificate. Simultaneously, a leader in the HotShot Consensus layer broadcasts a proposal with a vector commitment for the transactions. 
    The finalization of the block commitment in HotShot establishes data availability for the corresponding transactions.
    After block finalization in HotShot, the Espresso Sequencer propagates the commitment and quorum certificates to the L1 sequencer contract, which verifies the certificate ZK-proof. 

    ![EspressoDA architecture with L2s](/images/da-layer-technology/espressoDA/architectureL2.png#center)

    Users can retrieve data by querying any of Tiramisu's layers, though the Savoiardi layer is slower due to the reconstruction of erasure-coded shares. L2s can also use a verifyInclusion function on an L1 light client smart contract to confirm a blob's inclusion in the EspressoDA HotShot chain.
    
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
