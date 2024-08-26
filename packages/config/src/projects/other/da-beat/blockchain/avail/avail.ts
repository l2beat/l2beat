import { UnixTime } from '@l2beat/shared-pure'
import { NO_BRIDGE } from '../../templates/no-bridge-template'
import { DaEconomicSecurityRisk } from '../../types/DaEconomicSecurityRisk'
import { DaFraudDetectionRisk } from '../../types/DaFraudDetectionRisk'
import { DaLayer } from '../../types/DaLayer'
import { DasErasureCodingProof } from '../../types/DasErasureCodingProof'
import { DasErasureCodingScheme } from '../../types/DasErasureCodingScheme'
import { linkByDA } from '../../utils/link-by-da'
import { vectorX } from './bridges/vectorX'

export const avail: DaLayer = {
  id: 'avail',
  type: 'DaLayer',
  kind: 'PublicBlockchain',
  display: {
    name: 'Avail',
    slug: 'avail',
    description:
      'Avail is a data availability network.',
    links: {
      websites: ['https://www.availproject.org/'],
      documentation: ['https://docs.availproject.org/'],
      repositories: ['https://github.com/availproject/'],
      apps: ['https://bridge.availproject.org/'],
      explorers: ['https://explorer.avail.so/#/explorer','https://avail.subscan.io/'],
      socialMedia: [
        'https://x.com/AvailProject',
        "https://t.me/AvailCommunity",
        "https://discord.com/invite/y6fHnxZQX8",
        "https://www.linkedin.com/company/availproject/"
      ],
    },
  },
  technology: `
    ## Consensus
    Avail implements a Nominated Proof-of-Stake (NPoS) consensus mechanism, specifically the BABE/GRANDPA protocol. 
    BABE handles block production by assigning block production slots according to stake and using a Verifiable Random Function (VRF). 
    At the start of each epoch, nodes run the Block-Production-Lottery algorithm to assign block production slots and share the results with other nodes. 
    Slots are randomly assigned, meaning multiple validators might be selected for the same slot (starting a 'race') or some slots may remain empty. 
    To ensure liveness, secondary block producers are pre-determined and can step in if necessary, preventing any slot from being skipped. 
    Finality is achieved through GRANDPA, a GHOST-based finality gadget that provides finality through consecutive rounds of validators voting.
    
    ## Blobs
    Data submitted to the Avail blockchain through submitData transactions is organized into a data matrix, with each block data divided into equal-sized cells. 
    This matrix is erasure coded using Reed-Solomon (RS) codes and committed using Kate-Zaverucha-Goldberg (KZG) polynomial commitments. 

    ## Data Availability Sampling (DAS)
    Avail ensures data availability through a data availability sampling (DAS) mechanism , which involves both Light clients and App clients.
    Light clients sample the data matrix by requesting data cells, and for each cell they then check the KZG polynomial openings against the commitments in the block header.
    Light clients first attempt to fetch cells using a Kademlia-based Distributed Hash Table (DHT) within a peer-to-peer (P2P) network dedicated to light clients.
    If certain cells are not available via DHT, the light client resorts to RPC calls to the Avail node(s) to obtain the data. Cells retrieved this way are then shared back into the DHT network, enhancing the overall availability of block data.
    After gathering the data, the light client verifies the cells and calculates a confidence level, which is stored locally for reference.

    App clients focus on data specific to a given application ID. They reconstruct entire rows of the data matrix by requesting and assembling any missing cells from the network.

    ## Erasure Coding Proof

    Avail uses Kate-Zaverucha-Goldberg (KZG) polynomial commitments to commit to erasure-coded data. Light clients verify the commitments by checking the KZG polynomial openings against the commitments in the block header.
 
    ## L2s Data Availability

    Avail can be used by scaling solutions by posting application specific data to the Avail blockchain.
    Data is posted through a submitData transaction, and each transaction includes an application ID identifying the L2.
    App specific data can be reconstructed by app clients, which will request and assemble missing cells from the network for data reconstruction.

    `,
  bridges: [
    NO_BRIDGE({
      layer: 'Avail',
      description:
        'The risk profile in this page refers to scaling solutions that do not integrate with a data availability bridge.',
      technology: `No DA bridge is selected. Without a DA bridge, Ethereum has no proof of data availability for this project.\n`,
    }),
    vectorX
  ],
  usedIn: linkByDA({
    layer: (layer) => layer === 'Avail',
  }),
  /*
    Node params sources:
  */
  consensusAlgorithm: {
    name: 'BABE/GRANDPA',
    description: `Avail uses the BABE/GRANDPA consensus algorithm. BABE is a block production mechanism that is used to create new blocks in the Avail blockchain. GRANDPA is a finality gadget that is used to finalize blocks.`,
    blockTime: 20, // seconds
    consensusFinality: 60,  //seconds
    unbondingPeriod: UnixTime.DAY * 21, // staking.UnbondingTime
  },
  dataAvailabilitySampling: {
    erasureCodingScheme: DasErasureCodingScheme.TwoDReedSolomon,
    erasureCodingProof: DasErasureCodingProof.ValidityProofs,
  },
  pruningWindow: 0, // unknown
  risks: {
    economicSecurity: DaEconomicSecurityRisk.OnChainQuantifiable,
    fraudDetection: DaFraudDetectionRisk.DasWithNoBlobsReconstruction(true)
  },
  economicSecurity: {
    type: 'Ethereum', // Avail
  },
}
