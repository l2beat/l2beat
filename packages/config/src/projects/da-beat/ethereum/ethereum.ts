import type { EthereumDaLayer } from '../../../types'
import { EthereumDaLayerRisks } from '../common'
import { enshrinedBridge } from './enshrinedBridge'

export const ethereum = {
  id: 'ethereum',
  type: 'DaLayer',
  kind: 'EthereumDaLayer',
  systemCategory: 'public',
  display: {
    // name: 'Ethereum (EIP-4844)',
    name: 'Ethereum',
    slug: 'ethereum',
    description: `Ethereum is a Proof of Stake (PoS) network that enables the creation and execution of smart contracts and decentralized applications (dApps) using its native cryptocurrency, Ether (ETH).
      EIP-4844 allows for blob-carrying transactions containing large amounts of data on the consensus layer, and whose commitment can be accessed by the EVM on the execution layer.`,
    links: {
      websites: ['https://ethereum.org/en/'],
      documentation: ['https://ethereum.org/en/developers/docs/'],
      repositories: [
        'https://ethereum.org/en/developers/docs/nodes-and-clients/#execution-clients',
        'https://ethereum.org/en/developers/docs/nodes-and-clients/#consensus-clients',
      ],
      explorers: [
        'https://etherscan.io/',
        'https://eth.blockscout.com/',
        'https://beaconcha.in/',
      ],
      socialMedia: ['https://x.com/ethereum'],
    },
  },
  technology: {
    description: `
    ## Consensus
    Ethereum's consensus protocol combines two separate consensus protocols, LMD GHOST and Casper FFG.
    LMD GHOST is a fork choice rule that ensures the liveness of the chain by selecting the Greedy Heaviest-Observed Sub-Tree (GHOST), and considering only the validators most recent vote (Latest Message Driven, LMD). 
    The weight of a branch is calculated by summing the votes for its root block and those for all child branches, acknowledging that a vote for a block inherently supports all its ancestors. 
    
    ![GHOST fork choice](/images/da-layer-technology/ethereum/ghost.png#center)\n
    
    This mechanism ensures that the branch with the greatest validator support is favored when making fork choices.
    
    On the other hand, Casper FFG provides finality to the chain by modifying the fork choice rule. It ensures that once certain blocks are finalized, they are protected from being reverted, effectively pruning branches from the block tree. 
    This finality mechanism prevents deep chain reorganizations.

    The Ethereum consensus protocol is organized around two key time intervals: the slot and the epoch. 
    A slot lasts 12 seconds, and an epoch comprises 32 slots, totaling 6.4 minutes. 

    Validators provide attestations once per epoch. Attesters are divided into 32 committees, and each one of them votes on one slot during an epoch.
    Each attestation contains votes for the head of the chain, which LMD GHOST uses, and votes for checkpoints, which are utilized by Casper FFG. 
    The weight of a vote corresponds to the validator's effective balance which contributes to the overall weight of a branch in the chain.
    Moreover, in each slot one validator is chosen to propose a block which includes updates to the beacon state, attestations, and the execution payload containing Ethereum user transactions. 

    ### Finality
    To ensure consistency among validators voting at different times within an epoch, they are required to vote for a common checkpoint, specifically the first slot of the epoch.
    Casper FFG achieves finality through a two-round process. In the first round, each validator proposes what they believe is the best checkpoint and collects attestation from the network about other validators' views. 
    If 2/3 of the validators agree on the same checkpoint, it becomes justified. In the second round, validators share the justified checkpoint from the first round. If again 2/3 of the validators agree, the checkpoint is finalized.

    ![Casper finality](/images/da-layer-technology/ethereum/casper.png#center)\n

    Finalization is achieved when confirmation is received from over 2/3 of the validators, indicating that they have observed commitments from more than 2/3 of the validators agreeing not to revert the checkpoint. 
    A finalized checkpoint becomes irreversible unless at least 1/3 of the validators change their stance, which would lead to their stake being slashed. 

    Equivocating (expressing two conflicting views) over blocks or attestations by a validator results in their stake being slashed.

    ## Blobs (EIP-4844)
    [EIP-4844](https://eips.ethereum.org/EIPS/eip-4844) introduces "blob-carrying transactions," a new transaction type under [EIP-2718](https://eips.ethereum.org/EIPS/eip-2718) that allows for the inclusion of large data payloads, or blobs, within transactions. 
    EIP-4844 introduces "blob-carrying transactions," a new transaction type under EIP-2718 that allows for the inclusion of large data payloads, or blobs, within transactions. 
    These blobs are not directly accessible during EVM execution but can be verified through commitments. 
    The EIP sets a target of 3 blobs of 128kb each, with a maximum of 6 blobs per block, equating to ~0.375 MB to ~0.75 MB of data. 
    On the consensus layer, blobs are referenced in the beacon block and propagated separately as "sidecars," enabling forward compatibility with future data scaling methods like data-availability sampling (DAS). 
    EIP-4844 also creates a new blob gas market, which operates similarly to [EIP-1559](https://eips.ethereum.org/EIPS/eip-1559)'s fee mechanism. 
    EIP-4844 also creates a new blob gas market, which operates similarly to EIP-1559's fee mechanism.  
    The blob base fee adjusts dynamically based on the number of blobs included in each block relative to the target. 
    If a block contains more blobs than the target (3 blobs), the blob base fee increases, discouraging additional blob usage in subsequent blocks. Conversely, if a block contains fewer blobs than the target, the blob base fee decreases, encouraging more blob usage. If the number of blobs in a block matches the target, the blob base fee remains unchanged.
    
    ## L2s Data Availability

    L2s can post data a Ethereum by submitting a type-3 transaction, which includes the standard transaction fields along with commitments (versioned hashes) to one or more blobs. Any unused space within a blob still incurs full costs, as gas is charged per blob.
    To retrieve blobs, users have a limited window of 4096 epochs (~18 days) during which they can access them directly from the consensus client using the getBlobSidecars() API call. This API retrieves blobs associated with a specific block rather than a specific transaction. If blobs older than the pruning window need to be accessed, they can be retrieved from an indexer or archiver via API. 
    For transaction-specific blob retrieval, users must fetch all sidecar blobs from a block and identify the one corresponding to the desired versioned hash. <br />
    
    Optimistic rollups use blob data primarily during the process of submitting fraud proofs. 
    When a dispute arises, the rollup must provide the underlying data from a blob as part of the calldata. 
    The blob verification precompile is used to verify that the provided blob data corresponds to the versioned hash that was initially committed in the transaction. 
    This ensures that the data being used for fraud-proof verification is accurate and consistent with what was originally submitted.<br />

    ZK rollups, on the other hand, use the point evaluation precompile to verify that specific points in the polynomial (represented by the blob) match the expected values. 
    This method allows ZK rollups to prove that the data used in their validity proof is consistent with the blob data committed to Ethereum.
    `,
    references: [
      {
        title: 'EIP-4844',
        url: 'https://eips.ethereum.org/EIPS/eip-4844',
      },
      {
        title: 'Ethereum Technical Handbook',
        url: 'https://eth2book.info/latest/',
      },
    ],
  },
  bridges: [enshrinedBridge] as const,
  consensusAlgorithm: {
    name: 'Gasper',
    description: `Ethereum's consensus protocol combines two separate consensus protocols, LMD GHOST and Casper FFG.
    LMD GHOST is a fork choice rule that essentially provides liveness to the chain. On the other hand, Casper FFG provides finality to the chain, protecting it from deep reversions.
    LMD GHOST provides the core of the chain fork choice rule, by selecting the Greedy Heaviest-Observed Sub-Tree (GHOST) and considering only the validators
    most recent vote (Latest Message Driven, LMD). Casper FFG is a finality gadget, it modifies the fork choice by making some of the chain branches inaccessible.
    Together they are known as "Gasper".`,
    blockTime: 12, // seconds per slot
    consensusFinality: 768, // seconds, two epochs of 32 slots each
    unbondingPeriod: 777600, // current value from validatorqueue.com. Technically it is the sum of 1) Exit Queue (variable) 2) fixed waiting time (27.3 hours), 3) Validator Sweep (variable).
  },
  throughput: {
    size: 750, // 0.75 MB
    frequency: 12, // 12 seconds
  },
  pruningWindow: 86400 * 18, // 18 days in seconds
  risks: EthereumDaLayerRisks.SelfVerify,
  economicSecurity: {
    name: 'Ethereum',
    token: {
      symbol: 'ETH',
      decimals: 18,
      coingeckoId: 'ethereum',
    },
  },
} satisfies EthereumDaLayer
