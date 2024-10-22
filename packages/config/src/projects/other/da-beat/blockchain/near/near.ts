import { NO_BRIDGE } from '../../templates/no-bridge-template'
import { DaEconomicSecurityRisk } from '../../types/DaEconomicSecurityRisk'
import { DaFraudDetectionRisk } from '../../types/DaFraudDetectionRisk'
import { DaLayer } from '../../types/DaLayer'
import { linkByDA } from '../../utils/link-by-da'

export const near: DaLayer = {
  id: 'near',
  type: 'DaLayer',
  kind: 'PublicBlockchain',
  systemCategory: 'public',
  display: {
    name: 'NEAR DA',
    slug: 'near',
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
      apps: [],
      explorers: ['https://nearblocks.io/'],
      socialMedia: [
        'https://x.com/NEARProtocol',
        'https://discord.com/invite/zfhfRpaM4m',
      ],
    },
  },
  consensusAlgorithm: {
    name: 'Nightshade',
    description: `Nightshade is a sharding-based, Proof-of-Stake (PoS) consensus protocol enabling parallel transaction processing.
    Near Nightshade has one single main chain producing blocks. Main chain blocks do not contain actual transactions, but they include one chunk header for each shard, where
    a chunk is the equivalent of a block in a standard, non-shared blockchain. At the beginning of the epoch, both the block and chunk production schedule
    are randomly generated. For each block on the main chain, and for every shard, one of the assigned chunk producers is responsible to produce the part of the main chain block
    related to the shard, and share the chunk header with the network. Finality is determined by the NFG (Nightshade finality gadget), and after 2 consecutive blocks are built on the same fork the t-2 block is considered final.
    Reverting a finalized block will require at least 1/3 of the total stake to be slashed.`, // this is not shown anywhere in the UI, and maybe we don't need it
    blockTime: 1.2, // seconds average
    consensusFinality: 2.4, // NFG (Nightshade finality gadget, after 2 consecutive blocks are built on the same fork we consider the t-2 block final, thus transactions belonging to t-2 are final )
    unbondingPeriod: 86400 * 2, // up to 48 hours
  },
  technology: {
    description: `
  ## Architecture

  ![Near architecture](/images/da-layer-technology/near/architecture.png#center)

  ## Near Nightshade

  ### Consensus
  NEAR's Nightshade consensus operates a Proof-of-Stake (PoS) system that enables parallel processing of transactions through a sharded architecture. As with any PoS system, validators are required to lock a stake to be eligible for block production and attestations.
  The main differentiator of the NEAR blockchain is that its blocks do not contain actual transactions but rather block headers of separate blockchains, known as shards.
  The ***main chain*** can contain many shards, and the current NEAR implementation supports 6 shards.
  

  ![Near Shards](/images/da-layer-technology/near/nearShards.png#center)\n


  Each shard is composed of chunks, which are equivalent to standard blockchain blocks.
  Essentially, the state of the main chain is split into n shards, and only the shards block headers end up being part of the main chain.


  ![Near Chunks](/images/da-layer-technology/near/nearChunks.png#center)\n
  

  Becoming a block producer requires locking (staking) a certain amount of tokens, currently 25,500 NEAR. Staking operates through a threshold PoS mechanism, where a user’s stake must exceed the protocol's seat price—determined by the total NEAR tokens staked by other validators—in order to become a validator. The largest stakers at the beginning of a particular epoch are selected as block producers for that epoch. Each block producer is randomly assigned a certain number of shards to manage.
  Before the epoch starts, the block producer downloads the state of the shard(s) they are assigned to (they have 1 epoch to complete this download). Throughout the epoch, they collect transactions that affect their assigned shard(s) and apply them to the state. NEAR nodes have an automatic 'garbage collection' routine that deletes the state of previous shards after five epochs, freeing up unused storage.
  Within an epoch (12 hours), the main chain block and shard block production schedule is determined by a randomness seed generated at the beginning of the epoch. For each block height, a main chain block producer is assigned.
  Validators participate in several validation rounds within the epoch. For each round, one validator in each shard is chosen to be the chunk producer, and one validator from the entire set is chosen to be the block producer. Validators can serve as both block and chunk producers, but they maintain separate stakes for these roles.
  The shard block producer is responsible for producing the part of the block related to their shard, known as a chunk. The chunk contains the list of transactions for the shard to be included in the block, as well as the Merkle root of the resulting state. Each main chain block contains either one or zero chunks per shard, depending on whether the shard can keep up with the main chain block production speed.
  
  
  ![Near Validators](/images/da-layer-technology/near/nearValidators.png#center)\n
  

  A block on the main chain will only contain a small header of the chunk, composed of the Merkle root of all applied transactions and the Merkle root of the final state. When a block producer generates a chunk, they also produce an associated state witness, which is necessary for executing the chunk.

  Chunk producers maintain the full state of their shard. Validators, on the other hand, do not maintain the state of any shard locally; instead, they download and verify all the block headers. They validate chunks using the state witness created by the chunk producers.
  
  ### Data Availability
  Since only shard chunk producers maintain the shard state (while main chain validators do not), and main chain block producers need to attest to the chunk headers, data availability of the shard data must be ensured.

  After a block producer creates a chunk, they generate an erasure-coded version of it using Reed-Solomon encoding. The extended chunk is then split into multiple parts, which are distributed to all main chain validators.

  ![Near Erasure Coding](/images/da-layer-technology/near/nearErasureCoding.png)\n

  A block producer will not process a main chain block if they do not have the corresponding chunk sample for at least one chunk included in the block, or if they are unable to reconstruct the entire chunk for any shard for which they maintain the state.

  For a particular chunk to be considered available, it is sufficient that [mainChainBlockProducer/nOfShards] + 1 of the block producers possess their respective parts and are able to serve them. As long as the number of malicious actors does not exceed one-third of the validators (block producers), any chain built by more than half of the block producers will have all its chunks available.

  ![Near Erasure Distribution](/images/da-layer-technology/near/nearErasureDistribution.png)\n
  

  ### Finality
  Finality is determined by the Nightshade Finality Gadget (NFG). A block is considered final after two consecutive blocks are built on the same fork, making the block that is two blocks behind (t-2) final. Reverting a finalized block would require slashing at least one-third of the total stake.

  ## L2s Data Availability
  A rollup can utilize a dedicated Data Availability (DA) smart contract on a NEAR shard, known as a Blob Store contract, where it posts data as standard NEAR transactions. All transactions are converted into Receipts, and depending on their actions, some receipts may be processed over two blocks.
  Regarding data retrieval, full nodes prune Receipts after 3 epochs (approximately 36 hours). Once the pruning window expires, the data remains accessible only through archive nodes.
  `,
  },
  bridges: [
    NO_BRIDGE({
      layer: 'NearDA',
    }),
  ],
  usedIn: linkByDA({
    layer: (layer) => layer === 'NearDA',
  }),
  pruningWindow: 43200 * 3, // minimum 3 epochs (12 hours each), claimed in practice around 5 epochs (due to nodes garbage collection)
  risks: {
    economicSecurity: DaEconomicSecurityRisk.OnChainQuantifiable,
    fraudDetection: DaFraudDetectionRisk.NoFraudDetection,
  },
  economicSecurity: {
    type: 'Near',
  },
}
