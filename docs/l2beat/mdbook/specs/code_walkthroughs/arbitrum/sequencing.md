# Sequencing

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**

- [Forced transactions](#forced-transactions)
  - [High-level flow](#high-level-flow)
  - [`Inbox`: the `sendL2MessageFromOrigin` function](#inbox-the-sendl2messagefromorigin-function)
  - [`Bridge`: the `enqueueDelayedMessage` function](#bridge-the-enqueuedelayedmessage-function)
  - [`SequencerInbox`: the `forceInclusion` function](#sequencerinbox-the-forceinclusion-function)
    - [The `DelayBuffer` library](#the-delaybuffer-library)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Forced transactions

Before the implementation of the censorship buffer, each transaction could have been censored by the permissioned sequencer for up to 24h. This was a problem for Orbit L3s on Arbitrum One as, in case of censorship, there wouldn't be enough time to play the challenge game on the L2 (for the L3) if the challenge period was set to 7d, as around ~60 moves are needed to finish a game, implying the need of at least 60 days.

### High-level flow
To force transactions on Arbitrum through L1, the following steps are taken:
1. The EOA sends a message to the L2 through the `sendL2MessageFromOrigin` function on the `Inbox` contract.
2. The `sendL2MessageFromOrigin` function calls the `enqueueDelayedMessage` function on the `Bridge` contract, which pushes the message to the `delayedInboxAccs` array.
3. The EOA waits for `delayBlocks` to pass.
4. The EOA can finally call the `forceInclusion` function on the `SequencerInbox` contract to force the message to be included in the canonical sequence of messages.

### `Inbox`: the `sendL2MessageFromOrigin` function
This function acts as the entry point to send L1 to L2 messages from a EOA.

```solidity
function sendL2MessageFromOrigin(
    bytes calldata messageData
)
```

It's important to note that the function can be gated if the `allowListEnabled` variable is set to `true`, which then checks if the `tx.origin` returns `true` in the `isAllowed` mapping. The function only allows calls from EOAs[^1] and that the length of the message doesn't exceed the `maxDataSize` variable, which is supposed to be set to ~90% of geth tx size limit[^2]. The `enqueueDelayedMessage` function on the `Bridge` contract is then called by specifying the `L2_MSG` message type, the L1-to-L2 aliased `msg.sender` as the sender, and the `messageDataHash`, which is constructed as the keccak hash of `messageData`. All message types are defined in the `MessageTypes` library:

```solidity
uint8 constant L2_MSG = 3;
uint8 constant L1MessageType_L2FundedByL1 = 7;
uint8 constant L1MessageType_submitRetryableTx = 9;
uint8 constant L1MessageType_ethDeposit = 12;
uint8 constant L2MessageType_unsignedEOATx = 0;
uint8 constant L2MessageType_unsignedContractTx = 1;
uint8 constant ROLLUP_PROTOCOL_EVENT_TYPE = 8;
uint8 constant INITIALIZATION_MSG_TYPE = 11;
```

### `Bridge`: the `enqueueDelayedMessage` function
The `enqueueDelayedMessage` function can only be called by an authorized inbox, as specified in the `allowedDelayedInbox` mapping. 

```solidity
function enqueueDelayedMessage(
    uint8 kind,
    address sender,
    bytes32 messageDataHash
) external payable returns (uint256)
```

A `messageHash` is constructed using the `kind` (set to `L2_MSG` when called through the `sendL2MessageFromOrigin` function), the sender (the L1-to-L2 aliased `msg.sender`), the `messageDataHash`, but also the current block number, block timestamp and base fee. This value is then hashed with the latest message hash and pushed to the `delayedInboxAccs` array. The new message count is returned.

### `SequencerInbox`: the `forceInclusion` function
The purpose of this function is to be able to force include messages that have been queued to the `delayedInboxAccs` array.

```solidity
function forceInclusion(
    uint256 _totalDelayedMessagesRead,
    uint8 kind,
    uint64[2] calldata l1BlockAndTime,
    uint256 baseFeeL1,
    address sender,
    bytes32 messageDataHash
) external
```

The `_totalDelayedMessagesRead` value should represent the new amount of delayed messages read after this one, which should be equal to `totalDelayedMessagesRead + 1`. A function call to `isDelayBufferable()` checks whether the censorship buffer is active. If not, then each transaction can be delayed up to `delayBlocks` blocks, usually set to represent 24h. If the buffer is set to active, then its `update` function is called specifying the block number of the message being forced at the time of its inclusion to the `delayedInboxAccs` array. This function call overrides the `delayBlocks` value if the value returned is lower.

After the message hash is checked against the latest accumulated hash in the `delayedInboxAccs` array, the message is included in the canonical sequence of messages by calling the `addSequencerL2BatchImpl` function, which ultimately calls the `enqueueSequencerMessage` function on the `Bridge` contract.

#### The `DelayBuffer` library
 The function that handles the core buffer update logic is the `calcPendingBuffer` function that given the block number of the last processed message (`start`), the block number of the new message being considered (`end`), the current buffer size in blocks (`bufferBlocks`), the buffer threshold (`threshold`), the  time of the last update (`sequenced`), the max buffer size (`max`) and the replenish rate (`replenishRateInBasis`), calculates the new available buffer size.

The intuition is as follows: the buffer is first replenished by calculating the elapsed time between the last processed message and the one being considered during this call, where the rate is usually set to `500/10000`, or in other words, such that a block is added to the buffer every 20 blocks between two messages. A delay is calculated as the number of blocks between the last update (not to be confused with the block number of the latest processed message) and the block number of the current message being considered. The buffer doesn't consider any delay of 150 blocks (i.e. the `threshold`) or less (≤30 mins, assuming 12s block times) to be "unexpected", and only the delay on top of it is considered. If the buffer contains more blocks than this value, then the buffer is reduced by the appropriate amount. If not, the `threshold` value is returned as the minimum buffer size. The buffer is capped at the `max` value of blocks, usually set to be 14400 blocks, or 2 days assuming 12s block times.[^3]

[^1]: TOCHECK: is this compatible with 7702? A comment says so but it's worth double checking.
[^2]: TOCHECK: why?
[^3]: TODO: calculate and show worst case censorship within 7 days. Relevant to calculate risks on L3s.
