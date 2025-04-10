# Withdrawals

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**

- [How to calculate withdrawal times (L2 -> L1)](#how-to-calculate-withdrawal-times-l2---l1)
- [Why this approach?](#why-this-approach)
- [Example](#example)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## How to calculate withdrawal times (L2 -> L1)

To calculate the withdrawal time from L2 to L1, we need to fetch the time when the withdrawal is initiated on L2 and the time when it is ready to be executed on L1 and calculate the interval.

Withdrawals are initiated by either calling `bridgeETH` or `bridgeETHTo` methods for ETH, or `bridgeERC20` or `bridgeERC20To` methods for ERC20 tokens. Both methods emit a `WithdrawalInitialized` event, which is defined as follows:

```solidity
// 0x73d170910aba9e6d50b102db522b1dbcd796216f5128b445aa2135272886497e
event WithdrawalInitiated(address indexed l1Token, address indexed l2Token, address indexed from, address to, uint256 amount, bytes extraData)
```

To track the time of these events, the L2 block number in which they are emitted can be used.

On L1, the `AnchorStateRegistry` is the contract used to mantain the latest state root that is ready to be used for withdrawals. The anchor root is updated using the `setAnchorState()` function, which is defined as follows:

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

The time when the withdrawal is ready to be executed can be calculated by tracking the `AnchorUpdated` event, specifically when its respective L2 block number becomes greater than the L2 block number of the `WithdrawalInitiated` event.

## Why this approach?
Withdrawals are not directly executed based on the information in the `AnchorStateRegistry`, but rather based on games whose status is `GameStatus.DEFENDER_WINS`. Since the `AnchorStateRegistry`'s latest anchor root can be updated with the same condition, it is enough to track that to determine when a withdrawal is ready to be executed on L1. This assumes that the `AnchorStateRegistry` is always updated as soon as possible with the latest root that has been confirmed by the proof system. In practice the assumption holds since a game terminates with a `closeGame()` call, which also calls `setAnchorState()` on the `AnchorStateRegistry` to update the root if it is newer than the current saved one.

## Example

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
