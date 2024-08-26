import { UnixTime } from '@l2beat/shared-pure'
import { NO_BRIDGE } from '../../templates/no-bridge-template'
import { DaEconomicSecurityRisk } from '../../types/DaEconomicSecurityRisk'
import { DaFraudDetectionRisk } from '../../types/DaFraudDetectionRisk'
import { DaLayer } from '../../types/DaLayer'
import { DasErasureCodingProof } from '../../types/DasErasureCodingProof'
import { DasErasureCodingScheme } from '../../types/DasErasureCodingScheme'
import { linkByDA } from '../../utils/link-by-da'

export const celestia: DaLayer = {
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
    Data can be submitted to the Avail blockchain in the form of blobs. 

    ## Data Availability Sampling (DAS)

    ## Erasure Coding Proof
 
    ## L2s Data Availability

    `,
  bridges: [
    NO_BRIDGE({
      layer: 'Avail',
      description:
        'The risk profile in this page refers to scaling solutions that do not integrate with a data availability bridge.',
      technology: `No DA bridge is selected. Without a DA bridge, Ethereum has no proof of data availability for this project.\n`,
    }),
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
    fraudDetection: DaFraudDetectionRisk.DasWithBlobsReconstruction(false),
  },
  economicSecurity: {
    type: 'Avail',
  },
}
