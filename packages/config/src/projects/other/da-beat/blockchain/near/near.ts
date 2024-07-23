import { DaEconomicSecurityRisk } from '../../types/DaEconomicSecurityRisk'
import { DaFraudDetectionRisk } from '../../types/DaFraudDetectionRisk'
import { DaLayer } from '../../types/DaLayer'
import { linkByDA } from '../../utils/link-by-da'

export const near: DaLayer = {
  id: 'near',
  type: 'da-layer',
  kind: 'public-blockchain',
  display: {
    name: 'NEAR DA',
    slug: 'near-da',
    description: `NEAR's Data Availability Layer (NEAR DA) leverages the sharded architecture of the NEAR Protocol to provide a modular data availability layer for layer 2 solutions.`,
    links: {
      websites: ['https://near.org/', 'https://nuff.tech/'],
      documentation: [
        'https://docs.near.org/build/chain-abstraction/data-availability',
      ],
      repositories: [
        'https://github.com/near',
        'https://github.com/Nuffle-Labs/data-availability',
      ],
      apps: [''],
      explorers: ['https://nearblocks.io/'],
      socialMedia: [
        'https://x.com/NEARProtocol',
        'https://discord.com/invite/zfhfRpaM4m',
      ],
    },
  },
  technology: '',
  bridges: [],
  usedIn: linkByDA({
    layer: (layer) => layer === 'NearDA',
  }),
  consensusAlgorithm: {
    name: 'Nightshade',
    description: `Nightshade is a sharding-based, Proof-of-Stake (PoS) consensus protocol enabling parallel transaction processing. 
    Near Nightshade has one single main chain producing blocks. Main chain blocks do not contain actual transactions, but they include one chunk header for each shard, where 
    a chunk is the equivalent of a block in a standard, non-shared blockchain. At the beginning of the epoch, both the block and chunk production schedule
    are randomly generated. For each block on the main chain, and for every shard, one of the assigned chunk producers is responsible to produce the part of the main chain block 
    related to the shard, and share the chunk header with the network. Finality is determined by the NFG (Nightshade finality gadget), and after 2 consecutive blocks are built on the same fork the t-2 block is considered final. 
    Reverting a finalized block will require at least 1/3 of the total stake to be slashed.`,
    blockTime: 1.2, // seconds average
    consensusFinality: 2.4, // NFG (Nightshade finality gadget, after 2 consecutive blocks are built on the same fork we consider the t-2 block final, thus transactions belonging to t-2 are final )
    unbondingPeriod: 86400 * 2, // up to 48 hours
  },
  pruningWindow: 43200 * 3, // minimum 3 epochs (12 hours each), claimed in practice around 5 epochs (due to nodes garbage collection)
  risks: {
    economicSecurity: DaEconomicSecurityRisk.OnChainQuantifiable,
    fraudDetection: DaFraudDetectionRisk.NoFraudDetection,
  },
  // Blocked by: NEAR economic security type support
  // economicSecurity: {
  //   type: 'NEAR',  // 2/3 of NEAR validators stake
  // },
}
