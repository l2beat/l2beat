<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**

- [Sequencing](#sequencing)
  - [Forced transactions](#forced-transactions)
    - [High-level flow](#high-level-flow)
  - [`EnforcedTxGateway`: the `sendTransaction` function](#enforcedtxgateway-the-sendtransaction-function)
  - [`L1MessageQueueV2`: the `appendEnforcedTransaction` function](#l1messagequeuev2-the-appendenforcedtransaction-function)
  - [`ScrollChain`: the `commitAndFinalizeBatch` function](#scrollchain-the-commitandfinalizebatch-function)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# Sequencing

Scroll L2 operates a centralized sequencer that accepts transactions and generates new L2 blocks.
The Sequencer exposes a JSON-RPC interface for accepting L2 transactions, and is built on a fork of Geth.

Until the Euclid upgrade (April, 2025), Scroll L2 nodes maintained Clique, a Proof-of-Authority consensus with the L2 Sequencer set as authorized signer for block production. Since then, the L2 nodes read the authorized unsafe block signer from the new SystemConfig contract on L1.

The block time is set at 3 seconds and maintained on a best-effort basis, not enforced by the protocol.

## Forced transactions

Messages appended to the message queue (`L1MessageQueueV2`) are expected to be included into a bundle by the centralized operator. Messages in the queue cannot be skipped or dropped, but the sequencer can choose to finalize a bundle without processing any queued messages. Should a permissioned sequencer not process any queued messages within the `SystemConfig.maxDelayMessageQueue`, anyone can include queue messages as committing and finalizing bundles becomes permissionless.


### High-level flow
To force transactions on Scroll through L1, the following steps are taken:
1. The EOA sends a message to the L2 through the `sendTransaction` function on the `EnforcedTxGateway` contract.
2. The `sendTransaction` function calls the `appendEnforcedTransaction` function on the `L1MessageQueue` contract, which pushes the message to the queue through the `messageRollingHashes` (uint256 => bytes32, messageIndex => timestamp-rollingHash) mapping.
3. At each finalization (`finalizeBundlePostEuclidV2`) the number of messages processed in the bundle (`totalL1MessagesPoppedOverall`) is passed as input
4. In the internal `_finalizeBundlePostEuclidV2` function, the `messageQueueHash` is computed up to the `totalL1MessagesPoppedOverall - 1` queue index
5. The `messageQueueHash` is passed a public input to the verifier.

Should messages not be processed by the permissioned sequencer, the EOA waits for either:
   - `SystemConfig.maxDelayEnterEnforcedMode` to pass since the last batch finalization, or
   - `SystemConfig.maxDelayMessageQueue` to pass since the first unfinalized message enqueue time.
Then the EOA can finally submit a batch via `commitAndFinalizeBatch` and at the same time activate the permissionless sequencing mode (`UpdateEnforcedBatchMode`).


## `EnforcedTxGateway`: the `sendTransaction` function
This function acts as the entry point to send L1 to L2 messages from an EOA. There are two variants:

```solidity
function sendTransaction(
    address _target,
    uint256 _value,
    uint256 _gasLimit,
    bytes calldata _data
)

function sendTransaction(
    address _sender,
    address _target,
    uint256 _value,
    uint256 _gasLimit,
    bytes calldata _data,
    uint256 _deadline,
    bytes memory _signature,
    address _refundAddress
)
```

The first variant is for direct calls, while the second allows for signed messages. Both functions validate that the caller is not paused and charge a fee based on the gas limit. For contract callers, L1-to-L2 address aliasing is applied. For EOAs and EIP-7702 delegated EOAs, the original address is used. The functions ultimately call `appendEnforcedTransaction` on the `L1MessageQueueV2` contract.

## `L1MessageQueueV2`: the `appendEnforcedTransaction` function
The `appendEnforcedTransaction` function can only be called by the authorized `EnforcedTxGateway` contract.

```solidity
function appendEnforcedTransaction(
    address _sender,
    address _target,
    uint256 _value,
    uint256 _gasLimit,
    bytes calldata _data
) external
```

The function first validates that the gas limit is within the configured bounds in `SystemConfig`. It then computes a transaction hash and stores it in the `messageRollingHashes` mapping along with the current timestamp. The mapping uses a special encoding where the lower 32 bits store the timestamp and the upper 224 bits store a rolling hash of all messages.

## `ScrollChain`: the `commitAndFinalizeBatch` function
This function allows forcing inclusion of transactions when the enforced batch mode conditions are met.

```solidity
function commitAndFinalizeBatch(
    uint8 version,
    bytes32 parentBatchHash,
    FinalizeStruct calldata finalizeStruct
) external
```

where `FinalizeStruct` is defined as:

```solidity
    /// @notice The struct for permissionless batch finalization.
    /// @param batchHeader The header of this batch.
    /// @param totalL1MessagesPoppedOverall The number of messages processed after this bundle.
    /// @param postStateRoot The state root after this batch.
    /// @param withdrawRoot The withdraw trie root after this batch.
    /// @param zkProof The bundle proof for this batch (single-batch bundle).
    /// @dev See `BatchHeaderV7Codec` for the batch header encoding.
    struct FinalizeStruct {
        bytes batchHeader;
        uint256 totalL1MessagesPoppedOverall;
        bytes32 postStateRoot;
        bytes32 withdrawRoot;
        bytes zkProof;
    }
```

The function first checks if either delay condition is met:
- No batch has been finalized for `maxDelayEnterEnforcedMode` seconds
- No message has been included for `maxDelayMessageQueue` seconds

If either condition is met, it enables enforced batch mode by:
1. Reverting any unfinalized batches
2. Setting the enforced mode flag
3. Allowing the batch to be committed and finalized with a ZK proof

Once in enforced mode, only batches with proofs can be submitted until the owner (Scroll Security Council) explicitly disables enforced mode. Moreover, the designated Sequencer can't commit or finalize batches anymore due to the `whenEnforcedBatchNotEnabled` check.
