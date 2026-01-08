# Finality page

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**

- [How to calculate time to inclusion](#how-to-calculate-time-to-inclusion)
  - [OP Stack](#op-stack)
    - [Why this approach?](#why-this-approach)
    - [Example](#example)
- [How to calculate withdrawal times (L2 -> L1)](#how-to-calculate-withdrawal-times-l2---l1)
  - [OP Stack (with fraud proofs)](#op-stack-with-fraud-proofs)
    - [Why this approach?](#why-this-approach-1)
    - [Example](#example-1)
  - [Scroll](#scroll)
    - [Time to withdrawal calculation](#time-to-withdrawal-calculation)
  - [Orbit Stack](#orbit-stack)
    - [Time to withdrawal calculation](#time-to-withdrawal-calculation-1)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## How to calculate time to inclusion

### OP Stack

The OP Stack RPC directly exposes a method, `optimism_syncStatus`, to fetch the latest `unsafe`, `safe` or `finalized` L2 block number. An `unsafe` block is a preconfirmed block but not yet published on L1, a `safe` block is a block that has been published on L1 but not yet finalized, and a `finalized` block is a block that has been finalized on L1.
The method can be called as follows:

```zsh
cast rpc optimism_syncStatus --rpc-url <rpc-url>
```

Most RPCs do not support such method, but fortunately QuickNode does. An example of the output is as follows:

```json
{
  "current_l1": {
    "hash": "0x2cd7146cf93bae42f59ec1718034ab2f56a5ef2dcddf576e00b0a2538f63a840",
    "number": 22244495,
    "parentHash": "0x217b42bbdb4924495699403d2884373d10b24e63f45d2702c6087dee7024a099",
    "timestamp": 1744359995
  },
  "current_l1_finalized": {
    "hash": "0xbd1ee29567ddd0eda260b9e87e782dbb8253de95ba8f3802a3cbf3a3cac5ee8e",
    "number": 22244412,
    "parentHash": "0x13eb164b6245a7dca628ccac2c8a37780df35cc5b764d6fad345c9afac3ec6ec",
    "timestamp": 1744358999
  },
  "head_l1": {
    "hash": "0x2cd7146cf93bae42f59ec1718034ab2f56a5ef2dcddf576e00b0a2538f63a840",
    "number": 22244495,
    "parentHash": "0x217b42bbdb4924495699403d2884373d10b24e63f45d2702c6087dee7024a099",
    "timestamp": 1744359995
  },
  "safe_l1": {
    "hash": "0x609b0ca4539ff39a6521ff8ac46fa1fee5e717bd4a5931f2efce27f1d3d6ec70",
    "number": 22244444,
    "parentHash": "0xdd12087c45f149036c9ad5ce8f4d1880d42ed0c6029124b0a66882a68335647e",
    "timestamp": 1744359383
  },
  "finalized_l1": {
    "hash": "0xbd1ee29567ddd0eda260b9e87e782dbb8253de95ba8f3802a3cbf3a3cac5ee8e",
    "number": 22244412,
    "parentHash": "0x13eb164b6245a7dca628ccac2c8a37780df35cc5b764d6fad345c9afac3ec6ec",
    "timestamp": 1744358999
  },
  "unsafe_l2": {
    "hash": "0x9c3fba7839fa336e448407f387d8945e64f363afc48a3eed675728a3f4ff941c",
    "number": 134380614,
    "parentHash": "0xcb092179b9158964c02761a0511fd33c72b5e75df44ba2be245653940a28a69d",
    "timestamp": 1744360005,
    "l1origin": {
      "hash": "0xb47909b847438d13914c629a49ca9113dd3828abab1a7c01e146c2817e739ae9",
      "number": 22244484
    },
    "sequenceNumber": 2
  },
  "safe_l2": {
    "hash": "0x778aa29f31e03923e2f8dd85aa2570504d4d956dbb1d6c94b00379c282eea5b5",
    "number": 134380401,
    "parentHash": "0x30977603570f5134cdf98922630095b52d25857bf24a8aa367d8fd01fda8a56b",
    "timestamp": 1744359579,
    "l1origin": {
      "hash": "0x7ff5dde61b11bf0af83c93d8e8a51c519373495fd7cb5b74d74a4894c1e2d9ec",
      "number": 22244448
    },
    "sequenceNumber": 5
  },
  "finalized_l2": {
    "hash": "0x295df0a07e17c35f93422f83c47479f856e9fafde5b9d03c7714381d627035b2",
    "number": 134379981,
    "parentHash": "0xe110aa8531bcfb0c4c5e529f60a99751b9a9842797ef4d293b2cf514e496a4b7",
    "timestamp": 1744358739,
    "l1origin": {
      "hash": "0xf999ff954c1a823b10ecc679c611bb2bc0c7cc7e5ef344c5468a4529204eab33",
      "number": 22244379
    },
    "sequenceNumber": 0
  },
  "pending_safe_l2": {
    "hash": "0x778aa29f31e03923e2f8dd85aa2570504d4d956dbb1d6c94b00379c282eea5b5",
    "number": 134380401,
    "parentHash": "0x30977603570f5134cdf98922630095b52d25857bf24a8aa367d8fd01fda8a56b",
    "timestamp": 1744359579,
    "l1origin": {
      "hash": "0x7ff5dde61b11bf0af83c93d8e8a51c519373495fd7cb5b74d74a4894c1e2d9ec",
      "number": 22244448
    },
    "sequenceNumber": 5
  },
  "cross_unsafe_l2": {
    "hash": "0x9c3fba7839fa336e448407f387d8945e64f363afc48a3eed675728a3f4ff941c",
    "number": 134380614,
    "parentHash": "0xcb092179b9158964c02761a0511fd33c72b5e75df44ba2be245653940a28a69d",
    "timestamp": 1744360005,
    "l1origin": {
      "hash": "0xb47909b847438d13914c629a49ca9113dd3828abab1a7c01e146c2817e739ae9",
      "number": 22244484
    },
    "sequenceNumber": 2
  },
  "local_safe_l2": {
    "hash": "0x778aa29f31e03923e2f8dd85aa2570504d4d956dbb1d6c94b00379c282eea5b5",
    "number": 134380401,
    "parentHash": "0x30977603570f5134cdf98922630095b52d25857bf24a8aa367d8fd01fda8a56b",
    "timestamp": 1744359579,
    "l1origin": {
      "hash": "0x7ff5dde61b11bf0af83c93d8e8a51c519373495fd7cb5b74d74a4894c1e2d9ec",
      "number": 22244448
    },
    "sequenceNumber": 5
  }
}
```

The time to inclusion of L2 blocks can be calculated by polling the method and checking when the `safe_l2` block number gets updated. The `safe_l2` value refers to the latest L2 block that has been published on L1, where the latest L1 block used by the derivation pipeline is the `current_l1` block. Assuming that all blocks in between the previous `safe_l2` value and the current `safe_l2` value are included in the `current_l1` block when the `safe_l2` value is updated, the time to inclusion of each L2 block between the previous `safe_l2+1` and the current `safe_l2` value can be calculated by subtracting the L2 block timestamp from the `current_l1` timestamp. The assumption has been lightly manually tested and seems to hold.


#### Why this approach?

The very first approach to calculate the time to inclusion was to decode L2 batches posted to L1, get the list of transactions, and then calculate the difference between the L2 transactions timestamp and the L2 batch timestamp. This required a lot of maintenance, given that the batch format is generally not stable. There are a few possible approaches, like using the [batch decoder](https://github.com/ethereum-optimism/optimism/tree/a29cb96d30fab6fe4d86aaa5c4e6f0bb5270cb64/op-node/cmd/batch_decoder) provided by Optimism, but it's not guaranteed that OP Stack forks properly maintain the tool and we might not have access to every project's batch decoder in the first place. A different approach involves using an external API to fetch info like shown in this [Blockscout's batches page](https://optimism.blockscout.com/batches), but they don't seem to expose an API for that.

#### Example

Here an output of a [PoC script](https://gist.github.com/lucadonnoh/9bdd5efeb0c2a1397131c36e0b46d7fe) that tracks the time to inclusion of L2 blocks using the `optimism_syncStatus` method:

```
------------------------------------------------------
Fetched SyncStatus:
  Safe L2 Block:
    • Hash      : 0x504edd794afe4994f96825c2892e16e1e3cd8d68c303007b054f6ad790635c6b
    • Number    : 134389152
    • Prod. Time: 1744377081
  Current L1 Block:
    • Hash      : 0x45c4ef3f1d79101ba050f6a8af3073ef74917df89f84fe532ed3e8a2979619ef
    • Number    : 22245928
    • Time      : 1744377239
------------------------------------------------------
Current Safe L2 Block: 134389152 (Produced at: 1744377081)
Current L1 Head (Inclusion Time Candidate): 1744377239
New safe L2 blocks detected: Blocks 134388973 to 134389152
Using current L1 timestamp as inclusion time: 1744377239

------------------------------------------------------
Batch Statistics for New Safe L2 Blocks:
  Minimum Time-to-Inclusion: 2 min 38.00 sec
  Maximum Time-to-Inclusion: 8 min 36.00 sec
  Average Time-to-Inclusion: 5 min 37.00 sec
------------------------------------------------------
```

## How to calculate withdrawal times (L2 -> L1)

To calculate the withdrawal time from L2 to L1, we need to fetch the time when the withdrawal is initiated on L2 and the time when it is ready to be executed on L1 and calculate the interval.

### OP Stack (with fraud proofs)

Withdrawals are initiated by either calling `bridgeETH` or `bridgeETHTo` methods for ETH, or `bridgeERC20` or `bridgeERC20To` methods for ERC20 tokens. Both methods emit a `WithdrawalInitialized` event, which is defined as follows:

```solidity
// 0x73d170910aba9e6d50b102db522b1dbcd796216f5128b445aa2135272886497e
event WithdrawalInitiated(address indexed l1Token, address indexed l2Token, address indexed from, address to, uint256 amount, bytes extraData)
```

To track the time of these events, the L2 block number in which they are emitted can be used.

On L1, the `AnchorStateRegistry` is the contract used to maintain the latest state root that is ready to be used for withdrawals. The anchor root is updated using the `setAnchorState()` function, which is defined as follows:

```solidity
function setAnchorState(IDisputeGame _game) public
```

and emits the following event: 

```solidity
// 0x474f180d74ea8751955ee261c93ff8270411b180408d1014c49f552c92a4d11e
event AnchorUpdated(address indexed game) 
```

Each `game` contract has a function that can be used to retrieve the L2 block number they refer to:

```solidity
function l2BlockNumber() public pure returns (uint256 l2BlockNumber_)
```

The time when the withdrawal is ready to be executed can be calculated by tracking the `AnchorUpdated` event, specifically when its respective L2 block number becomes greater than the L2 block number of the `WithdrawalInitiated` event. If the goal is not to track the withdrawal time of a specific withdrawal but to more generally calculate an average, just tracking the `AnchorStateRegistry` and calculating its corresponding `l2BlockNumber` is good enough.

#### Why this approach?
Withdrawals are not directly executed based on the information in the `AnchorStateRegistry`, but rather based on games whose status is `GameStatus.DEFENDER_WINS`. Since the `AnchorStateRegistry`'s latest anchor root can be updated with the same condition, it is enough to track that to determine when a withdrawal is ready to be executed on L1. This assumes that the `AnchorStateRegistry` is always updated as soon as possible with the latest root that has been confirmed by the proof system. In practice the assumption holds since a game terminates with a `closeGame()` call, which also calls `setAnchorState()` on the `AnchorStateRegistry` to update the root if it is newer than the current saved one.

Another approach consists in tracking finalized withdrawals directly, but this would skew the calculation since not every withdrawal is finalized as soon as they are available to be finalized, and outliers would be introduced in the data set. For completeness, when a withdrawal is finalized, the `WithdrawalFinalized` event is emitted, which is defined as follows:

```solidity
// 0xdb5c7652857aa163daadd670e116628fb42e869d8ac4251ef8971d9e5727df1b
event WithdrawalFinalized(bytes32 indexed withdrawalHash, bool success) 
```

The `withdrawalHash` can be calculated as follows:

```solidity
function hashWithdrawal(Types.WithdrawalTransaction memory _tx) internal pure returns (bytes32) {
    return keccak256(abi.encode(_tx.nonce, _tx.sender, _tx.target, _tx.value, _tx.gasLimit, _tx.data));
}
```

where the nonce must be fetched through the `SentMessage` event emitted by the `L2CrossDomainMessenger` when a withdrawal is initiated. The `SentMessage` event is defined as follows:

```solidity
// 0xcb0f7ffd78f9aee47a248fae8db181db6eee833039123e026dcbff529522e52a
event SentMessage(address indexed target, address sender, bytes message, uint256 messageNonce, uint256 gasLimit) 
```

#### Example

Let's take [this withdrawal](https://optimistic.etherscan.io/tx/0x762b6734f4aaf722b836709ad1d410584bc25d8a1ee22c0f958600ddf47f26df) as an example to show how to calculate the withdrawal time. The transaction emits the `WithdrawalInitiated` event as expected, and the corresponding L2 block number is `134010739`, whose timestamp is `1743620255` (Apr-02-2025 06:57:35 PM +UTC). 

[This script](https://gist.github.com/lucadonnoh/82c6fd45e90040d60b4dde882b6f353f) can be used to find the time in which the `AnchorStateRegistry` was updated with a root past the L2 block number of the withdrawal. This is the output:

```md
╔══════════╤═════════════════════╤═══════════════╤═══════════╤═══════════════╤═══╗
║    Block │ Time                │ Game          │  L2 Block │ Tx            │ ? ║
╟──────────┼─────────────────────┼───────────────┼───────────┼───────────────┼───╢
║ 22232676 │ 2025-04-09 16:55:11 │ 0xf944...d159 │ 134006190 │ 0x77ca...19ba │   ║
╟──────────┼─────────────────────┼───────────────┼───────────┼───────────────┼───╢
║ 22232975 │ 2025-04-09 17:54:59 │ 0x302d...c419 │ 134008034 │ 0x07e7...8bda │   ║
╟──────────┼─────────────────────┼───────────────┼───────────┼───────────────┼───╢
║ 22233284 │ 2025-04-09 18:56:59 │ 0x794B...bf9B │ 134010097 │ 0x147d...357c │   ║
╟──────────┼─────────────────────┼───────────────┼───────────┼───────────────┼───╢
║ 22233578 │ 2025-04-09 19:55:47 │ 0xAB7e...35b1 │ 134011549 │ 0x33eb...3693 │ X ║
╟──────────┼─────────────────────┼───────────────┼───────────┼───────────────┼───╢
║ 22233879 │ 2025-04-09 20:56:23 │ 0xC593...45BF │ 134013468 │ 0xa687...55fd │ X ║
╟──────────┼─────────────────────┼───────────────┼───────────┼───────────────┼───╢
║ 22234179 │ 2025-04-09 21:56:47 │ 0x05fd...9bA3 │ 134015440 │ 0xa941...cee0 │ X ║
╟──────────┼─────────────────────┼───────────────┼───────────┼───────────────┼───╢
║ 22234474 │ 2025-04-09 22:56:11 │ 0x91c9...2e8A │ 134017191 │ 0x1011...e9c7 │ X ║
╟──────────┼─────────────────────┼───────────────┼───────────┼───────────────┼───╢
║ 22234779 │ 2025-04-09 23:57:11 │ 0xd065...A461 │ 134018922 │ 0x28c1...080c │ X ║
╟──────────┼─────────────────────┼───────────────┼───────────┼───────────────┼───╢
║ 22235080 │ 2025-04-10 00:57:35 │ 0x5D8e...d691 │ 134020776 │ 0xb822...1456 │ X ║
╟──────────┼─────────────────────┼───────────────┼───────────┼───────────────┼───╢
║ 22235380 │ 2025-04-10 01:57:35 │ 0x34a2...2aA9 │ 134022724 │ 0x0ba7...db52 │ X ║
╟──────────┼─────────────────────┼───────────────┼───────────┼───────────────┼───╢
║ 22235682 │ 2025-04-10 02:57:59 │ 0x500e...497C │ 134024336 │ 0x8109...cd76 │ X ║
╟──────────┼─────────────────────┼───────────────┼───────────┼───────────────┼───╢
║ 22235987 │ 2025-04-10 03:58:59 │ 0xFF4E...4F10 │ 134026350 │ 0xdaed...def0 │ X ║
╟──────────┼─────────────────────┼───────────────┼───────────┼───────────────┼───╢
║ 22236286 │ 2025-04-10 04:58:47 │ 0xce9E...0F17 │ 134028088 │ 0x2c52...9b7a │ X ║
╟──────────┼─────────────────────┼───────────────┼───────────┼───────────────┼───╢
║ 22236586 │ 2025-04-10 05:58:47 │ 0x764B...6294 │ 134029727 │ 0x1d03...c14e │ X ║
╟──────────┼─────────────────────┼───────────────┼───────────┼───────────────┼───╢
║ 22236891 │ 2025-04-10 06:59:59 │ 0xA066...e3F9 │ 134031693 │ 0x44d0...c506 │ X ║
╟──────────┼─────────────────────┼───────────────┼───────────┼───────────────┼───╢
║ 22237189 │ 2025-04-10 07:59:47 │ 0x1528...120C │ 134033337 │ 0x6da3...9bce │ X ║
╟──────────┼─────────────────────┼───────────────┼───────────┼───────────────┼───╢
║ 22237494 │ 2025-04-10 09:00:59 │ 0xC40b...7C32 │ 134035313 │ 0xed42...2687 │ X ║
╟──────────┼─────────────────────┼───────────────┼───────────┼───────────────┼───╢
║ 22237791 │ 2025-04-10 10:00:35 │ 0xF7BC...29e8 │ 134036917 │ 0x042b...efb5 │ X ║
╟──────────┼─────────────────────┼───────────────┼───────────┼───────────────┼───╢
║ 22238086 │ 2025-04-10 10:59:47 │ 0x4E3B...f55A │ 134038845 │ 0xf622...9348 │ X ║
╟──────────┼─────────────────────┼───────────────┼───────────┼───────────────┼───╢
║ 22238396 │ 2025-04-10 12:01:47 │ 0xf3D4...97B8 │ 134040625 │ 0x4d74...9fcf │ X ║
╟──────────┼─────────────────────┼───────────────┼───────────┼───────────────┼───╢
║ 22238695 │ 2025-04-10 13:01:35 │ 0x1cF1...824F │ 134042382 │ 0xe3ec...523d │ X ║
╚══════════╧═════════════════════╧═══════════════╧═══════════╧═══════════════╧═══╝
```

i.e. 7 days, 58 mins and 12 seconds have passed between the withdrawal being initiated and the time when it was ready to be executed on L1.

### Scroll

Scroll uses a ZK-rollup architecture with an asynchronous message bridge between L2 and L1.  
Withdrawals (and every other L2→L1 message) follow the life-cycle illustrated by
the events below:

```solidity
// Emitted on L2 when a message is queued
event AppendMessage(uint256 index, bytes32 messageHash);
// 0x5300000000000000000000000000000000000000  (Scroll: L2 Message Queue)

// Emitted on L1 when a message is executed
event RelayedMessage(bytes32 indexed messageHash);
// 0x6774bcbd5cECEf1336B5300Fb5186a12DDD8B367  (Scroll: L1 Scroll Messenger Proxy)

// Emitted on L1 when a batch proof is verified and the batch becomes final
event FinalizeBatch(
    uint256 indexed batchIndex,
    bytes32  indexed batchHash,
    bytes32  stateRoot,
    bytes32  withdrawRoot
);
```

#### Time to withdrawal calculation

1. **Track initiation on L2**  
   Listen for the `AppendMessage` on the L2 Message Queue, store `messageHash`
   together with the L2 block timestamp in which the event was emitted.

2. **Track execution on L1**  
   Listen for `RelayedMessage` on the L1 Scroll Messenger.  
   When a matching `messageHash` is found, fetch the transaction data.
   The calldata calls `relayMessageWithProof(...)`; decode it and read the
   `_proof.batchIndex` field.

3. **Find the first-available timestamp**  
   With the extracted `batchIndex`, search the `ScrollChain` contract for the
   corresponding `FinalizeBatch` event.  
   The timestamp of the transaction that emitted this event represents the
   moment the batch became *final* and every withdrawal in it could have been
   executed.

4. **Compute the intervals**

   • **Earliest withdrawal time**  
     `FinalizeBatch.timestamp − AppendMessage.timestamp`  
     (how long users wait until the withdrawal *can* be executed)

   • **Actual withdrawal time** (optional)  
     `RelayedMessage.timestamp − AppendMessage.timestamp`  
     (includes any additional delay introduced by the relayer)

### Orbit Stack


When users initiate a withdrawal on L2 (for example, calling ArbSys.withdrawEth() or an ERC-20 bridge's withdraw function), the sequence of events is:
- The withdrawal triggers an L2-to-L1 message. Internally this is done via ArbSys.sendTxToL1, which emits an L2 event and adds the message to Arbitrum's outgoing message Merkle tree.
- The L2 transaction (and its outgoing message) get included in a rollup assertion that the validator posts to the L1 rollup contract (SequencerInbox/Bridge) in a batch. This marks the inclusion of the withdrawal request on L1. 
- Once the assertion is posted, it enters the dispute window on L1. For Arbitrum One this is roughly 7 days (currently ~6.4 days in seconds). During this period, any validator can challenge the posted state if they detect fraud. In the normal case with no fraud proofs, the assertion simply "ages" for the full challenge period.
- Once the dispute period expires without a successful challenge, at least one honest validator will confirm the rollup assertion on L1. The Arbitrum Rollup contract finalizes the L2 state root and posts the assertion's outgoing message Merkle root to the Outbox contract on L1. At this point the L2 transaction's effects are fully finalized on L1 (equivalent to an L1 transaction's finality, aside from Ethereum's own finalization delay). The withdrawal message is now provably included in the Outbox's Merkle root of pending messages.

#### Time to withdrawal calculation

1. **Track initiation on L2**  
   Listen for the `L2ToL1Tx` event from the `ArbSys` pre-compile  
   (`0x0000000000000000000000000000000000000064`):

   ```solidity
   event L2ToL1Tx(
       address caller,              // sender on L2
       address indexed destination, // receiver on L1
       uint256 indexed hash,       // unique message hash
       uint256 indexed position,   // (level<<192)|leafIndex
       uint256 arbBlockNum,        // L2 block number
       uint256 ethBlockNum,        // 0 at emission
       uint256 timestamp,          // L2 timestamp
       uint256 callvalue,          // ETH value
       bytes   data                // calldata for L1
   );
   ```
   
   Store:
   - `position` - the global message index
   - `hash` - unique identifier (for quick look-ups)
   - `timestamp` - L2 time of initiation

   From `position` you can extract:
   - `level = position >> 192` (always 0 in Nitro)
   - `leafIndex = position & ((1<<192) - 1)`
   - `arbBlockNum` - the L2 block number where the withdrawal was initiated.

2. **Detect when the withdrawal becomes executable**  
   After the ≈7-day fraud-proof window a validator confirms the rollup
   assertion. Assertion confirmation could also incur in a “challenge grace period” delay, which allows the Security Council to intervene at the end of a dispute in case of any severe bugs in the OneStepProver contracts. 
   During assertion confirmation the Rollup contract emits:

   ```solidity
   event AssertionConfirmed(
       bytes32 indexed assertionHash,
       bytes32 indexed blockHash,  // L2 block hash of the assertion's end
       bytes32   sendRoot          // root of the Outbox tree
   );
   ```  

   The confirmation routine calls `Outbox.updateSendRoot(sendRoot, l2ToL1Block)`, which emits:

   ```solidity
   event SendRootUpdated(
       bytes32 indexed outputRoot,  // == sendRoot above
       bytes32 indexed l2BlockHash  // L2 block hash corresponding to this root
   );
   ```  

   This `l2BlockHash` signifies that all L2-to-L1 messages initiated in L2 blocks up to and including the L2 block represented by this `l2BlockHash` are now covered by the `outputRoot` and are executable.

   To check if the specific withdrawal (with `leafIndex` and `arbBlockNum` from Step 1) is executable:
   - Find the `SendRootUpdated` event.
   - Get the L2 block number corresponding to `SendRootUpdated.l2BlockHash`.
   - If `your_withdrawal.arbBlockNum <= L2_block_number_of_SendRootUpdated_event`, then your withdrawal (identified by its `leafIndex`) can be executed.
   The L1 timestamp of this `SendRootUpdated` event is the earliest time your withdrawal becomes executable.

3. **Compute the intervals**  

   - *Earliest withdrawal time*  
     `SendRootUpdated.timestamp − L2ToL1Tx.timestamp` (where SendRootUpdated meets the condition in Step 2)

This [PoC script](https://gist.github.com/vincfurc/7fd3b88e95d6d7105fac3ca2dca075d5) calculates the time to withdrawal for Arbitrum One.
