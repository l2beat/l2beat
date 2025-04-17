# Sequencing

## High-level flow

TODO

## The `proposeBlockV2` function

This function is the main entry point to sequence blocks on Taiko Alethia, and it allows to sequence a single block. The function is defined as follows:

```solidity
function proposeBlockV2(
    bytes calldata _params,
    bytes calldata _txList
)
external
whenNotPaused
nonReentrant
emitEventForClient
returns (TaikoData.BlockMetadataV2 memory meta_)
```

The function fetches the current config, which is hardcoded in the contract, and calls the `proposeBlock` function of the `LibProposing` library. Specifically for Taiko Alethia, the config is defined as follows:

```solidity
function getConfig() public pure override returns (TaikoData.Config memory) {
    // All hard-coded configurations:
    // - treasury: the actual TaikoL2 address.
    // - anchorGasLimit: 250_000 (based on internal devnet, its ~220_000
    // after 256 L2 blocks)
    return TaikoData.Config({
        chainId: LibNetwork.TAIKO_MAINNET,
        // Ring buffers are being reused on the mainnet, therefore the following two
        // configuration values must NEVER be changed!!!
        blockMaxProposals: 324_000, // DO NOT CHANGE!!!
        blockRingBufferSize: 360_000, // DO NOT CHANGE!!!
        maxBlocksToVerify: 16,
        blockMaxGasLimit: 240_000_000,
        livenessBond: 125e18, // 125 Taiko token
        stateRootSyncInternal: 16,
        maxAnchorHeightOffset: 64,
        baseFeeConfig: LibSharedData.BaseFeeConfig({
            adjustmentQuotient: 8,
            sharingPctg: 75,
            gasIssuancePerSecond: 5_000_000,
            minGasExcess: 1_340_000_000, // correspond to 0.008847185 gwei basefee
            maxGasIssuancePerBlock: 600_000_000 // two minutes: 5_000_000 * 120
         }),
        ontakeForkHeight: 538_304
    });
}
```

The function makes use of a `Local` structure to get around stack too deep issues. The contract saves the latest state in the `state` variable, which is a `State` structure defined as follows:

```solidity
struct State {
    // Ring buffer for proposed blocks and a some recent verified blocks.
    mapping(uint64 blockId_mod_blockRingBufferSize => BlockV2 blk) blocks;
    // Indexing to transition ids (ring buffer not possible)
    mapping(uint64 blockId => mapping(bytes32 parentHash => uint24 transitionId)) transitionIds;
    // Ring buffer for transitions
    mapping(
        uint64 blockId_mod_blockRingBufferSize
            => mapping(uint24 transitionId => TransitionState ts)
    ) transitions;
    bytes32 __reserve1; // Used as a ring buffer for Ether deposits
    SlotA slotA; // slot 5
    SlotB slotB; // slot 6
    mapping(address account => uint256 bond) bondBalance;
    uint256[43] __gap;
}
```

where `SlotA` and `SlotB` are defined as follows:

```solidity
struct SlotA {
    uint64 genesisHeight;
    uint64 genesisTimestamp;
    uint64 lastSyncedBlockId;
    uint64 lastSynecdAt; // known typo (lastSyncedAt)
}

struct SlotB {
    uint64 numBlocks;
    uint64 lastVerifiedBlockId;
    bool provingPaused;
    uint56 lastProposedIn;
    uint64 lastUnpausedAt;
}
```

and `BlockV2` is defined as follows:

```solidity
struct BlockV2 {
    bytes32 metaHash; // slot 1
    address assignedProver; // DEPRECATED!!!
    uint96 livenessBond; // DEPRECATED!!!
    uint64 blockId; // slot 3
    uint64 proposedAt; // Now represents L2 block's timestamp
    uint64 proposedIn; // Now represents L2 block's anchorBlockId
    uint24 nextTransitionId;
    bool livenessBondReturned;
    // The ID of the transaction that is used to verify this block. However, if this block is
    // not verified as the last block in a batch, verifiedTransitionId will remain zero.
    uint24 verifiedTransitionId;
}
```

and `TransitionState` is defined as follows:

```solidity
struct TransitionState {
    bytes32 key; // slot 1, only written/read for the 1st state transition.
    bytes32 blockHash; // slot 2
    bytes32 stateRoot; // slot 3
    address prover; // slot 4
    uint96 validityBond;
    address contester; // slot 5
    uint96 contestBond;
    uint64 timestamp; // slot 6 (88 bits)
    uint16 tier;
    uint8 __reserved1;
}
```

It is first checked that `numBlocks` is equal or greater than the `ontakeForkHeight` value. The term "Ontake" refers to the [Ontake upgrade](https://taiko.mirror.xyz/OJA4SwCqHjF32Zz0GkNJvnHWlsRYzdJ6hcO9FXVOpLs). It is then checked that the `numBlocks` is less than `lastVerifiedBlockId + blockMaxProposals + 1`, which means that blocks cannot be proposed if sequenced blocks are too much ahead of the last verified block.

If a `preconfTaskManager` address is set, it is checked whether the `msg.sender` equals such value. The `_params` are then decoded into a `BlockParamsV2` structure, which is defined as follows:

```solidity
struct BlockParamsV2 {
    address proposer;
    address coinbase;
    bytes32 parentMetaHash;
    uint64 anchorBlockId; // NEW
    uint64 timestamp; // NEW
    uint32 blobTxListOffset; // NEW
    uint32 blobTxListLength; // NEW
    uint8 blobIndex; // NEW
}
```

Default values for `proposer`, `coinbase`, `anchorBlockId` and `timestamp` are set if not provided, specifically `msg.sender`, `msg.sender`, the block number previous to the current one, and the current block timestamp. Then, a `BlockMetadataV2` structure is created, which is defined as follows:

```solidity
struct BlockMetadataV2 {
    bytes32 anchorBlockHash; // `_l1BlockHash` in TaikoL2's anchor tx.
    bytes32 difficulty;
    bytes32 blobHash;
    bytes32 extraData;
    address coinbase;
    uint64 id;
    uint32 gasLimit;
    uint64 timestamp;
    uint64 anchorBlockId; // `_l1BlockId` in TaikoL2's anchor tx.
    uint16 minTier;
    bool blobUsed;
    bytes32 parentMetaHash;
    address proposer;
    uint96 livenessBond;
    uint64 proposedAt; // Used by node/client post block proposal.
    uint64 proposedIn; // Used by node/client post block proposal.
    uint32 blobTxListOffset;
    uint32 blobTxListLength;
    uint8 blobIndex;
    LibSharedData.BaseFeeConfig baseFeeConfig;
}
```

It is recommended to check the diagram above to understand how it is constructed.
