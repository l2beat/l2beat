import { UnixTime } from '@l2beat/shared-pure'
import { DaEconomicSecurityRisk } from '../common/DaEconomicSecurityRisk'
import { DaFraudDetectionRisk } from '../common/DaFraudDetectionRisk'
import { NO_BRIDGE } from '../templates/no-bridge-template'
import type { BlockchainDaLayer } from '../types'
import { vector } from './vector'

export const avail: BlockchainDaLayer = {
  id: 'avail',
  type: 'DaLayer',
  kind: 'PublicBlockchain',
  systemCategory: 'public',
  display: {
    name: 'Avail',
    slug: 'avail',
    description:
      'Avail is a public blockchain and data availability network combining erasure coding, KZG polynomial commitments, and data availability sampling.',
    links: {
      websites: ['https://www.availproject.org/'],
      documentation: ['https://docs.availproject.org/'],
      repositories: ['https://github.com/availproject/'],
      apps: ['https://bridge.availproject.org/'],
      explorers: [
        'https://explorer.avail.so/#/explorer',
        'https://avail.subscan.io/',
      ],
      socialMedia: [
        'https://x.com/AvailProject',
        'https://t.me/AvailCommunity',
        'https://discord.com/invite/y6fHnxZQX8',
        'https://www.linkedin.com/company/availproject/',
      ],
    },
  },
  technology: {
    description: `
    ## Architecture

    ![Avail architecture](/images/da-layer-technology/avail/architecture.png#center)


    ## Consensus
    Avail implements a Nominated Proof-of-Stake (NPoS) Sybil resistance mechanism, combined with the BABE/GRANDPA consensus protocol. 
    BABE handles block production by assigning block production slots according to validators' stake and using a Verifiable Random Function (VRF). 
    At the start of each epoch, nodes run the Block-Production-Lottery algorithm to assign block production slots and share the results with other nodes. 
    Slots are randomly assigned, meaning multiple validators might be selected for the same slot (with a 'race' determining who gets to propose the block) and some slots may remain empty. 
    To ensure liveness, secondary block producers are pre-determined and can step in if necessary, preventing any slot from being skipped. 
    Finality is achieved through GRANDPA, a GHOST-based finality gadget that provides finality through consecutive rounds of validators voting.
    
    ## Blobs
    Data submitted to the Avail blockchain through submitData transactions is organized into a data matrix, with each block data divided into equal-sized cells. 
    This matrix is erasure coded using Reed-Solomon (RS) codes and committed using Kate-Zaverucha-Goldberg (KZG) polynomial commitments. 
    Each block header on Avail includes two types of attestations: KZG polynomial commitments of the submitted data and the root of a Merkle tree, where the leaves represent the data blobs. 

    ## Data Availability Sampling (DAS)
    Avail ensures data availability through a data availability sampling (DAS) mechanism, which involves both Light clients and App clients.
    Light clients sample the data matrix by requesting data cells, and for each cell they then check the KZG polynomial openings against the commitments in the block header.
    Light clients first attempt to fetch cells using a Kademlia-based Distributed Hash Table (DHT) within a light clients peer-to-peer (P2P) network.
    If the randomly selected cells are not available via DHT, the light client resorts to RPC calls to the Avail node(s) to obtain the data. Cells retrieved this way are then shared back into the DHT network, enhancing the overall availability of block data.
    After gathering the data, the light client verifies the cells and calculates a confidence level, which is stored locally for reference.

    App clients focus on data specific to a given application ID. They reconstruct entire rows of the data matrix by requesting and assembling any missing cells from the network.

    ## Erasure Coding Proof

    Avail uses Kate-Zaverucha-Goldberg (KZG) polynomial commitments as validity proofs of erasure-coded data. Light clients verify the commitments by checking the KZG polynomial openings against the commitments in the block header.
 
    ## L2s Data Availability

    L2s can post application-specific data blobs to the Avail blockchain through submitData transactions. 
    Each transaction contains an application ID that identifies the L2 and adheres to a size limit based on the Avail blockchain’s block size. 
    App-specific data can be reconstructed by app clients, which request and assemble missing cells from the network to complete the data reconstruction process.

    `,
    references: [
      {
        text: 'Avail Documentation',
        href: 'https://docs.availproject.org/docs/learn-about-avail/consensus/npos',
      },
      {
        text: 'Avail Light Client - Source Code',
        href: 'https://github.com/availproject/avail-light/blob/main/core/src/light_client.rs',
      },
      {
        text: 'Avail App Client - Source Code',
        href: 'https://github.com/availproject/avail-light/blob/a9e1741a6c7579d6ab1988eb409808b33f999180/core/src/app_client.rs',
      },
    ],
    risks: [
      {
        category: 'Funds can be lost if',
        text: `a dishonest supermajority of Avail validators finalizes an unavailable block, and there aren't light nodes on the network verifying data availability, or they fail at social signaling unavailable data.`,
      },
      {
        category: 'Funds can be lost if',
        text: 'a dishonest supermajority of Avail validators finalizes an unavailable block, and the light nodes on the network cannot collectively reconstruct the block.',
      },
    ],
  },
  bridges: [
    NO_BRIDGE({
      createdAt: new UnixTime(1725372159), // 2024-09-03T14:02:39Z
      layer: 'Avail',
      description:
        'The risk profile in this page refers to L2s that do not integrate with a data availability bridge.',
      technology: {
        description: `No DA bridge is selected. Without a DA bridge, Ethereum has no proof of data availability for this project.\n`,
      },
    }),
    vector,
  ],
  /*
    Node params sources:
  */
  consensusAlgorithm: {
    name: 'BABE/GRANDPA',
    description: `Avail uses the BABE/GRANDPA consensus algorithm. BABE is a block production mechanism that is used to create new blocks in the Avail blockchain. GRANDPA is a finality gadget that is used to finalize blocks.`,
    blockTime: 20, // seconds
    consensusFinality: 60, //seconds
    unbondingPeriod: UnixTime.DAY * 21, // staking.UnbondingTime
  },
  throughput: {
    size: 2000, // 2 MB
    frequency: 20, // 20 seconds
  },
  dataAvailabilitySampling: {
    erasureCodingScheme: '2D Reed-Solomon',
    erasureCodingProof: 'Validity proofs',
  },
  pruningWindow: 0, // does not prune
  risks: {
    economicSecurity: DaEconomicSecurityRisk.OnChainQuantifiable,
    fraudDetection: DaFraudDetectionRisk.DasWithNoBlobsReconstruction(true),
  },
  economicSecurity: {
    name: 'Avail',
    token: {
      symbol: 'AVAIL',
      decimals: 18,
      coingeckoId: 'avail',
    },
  },
}