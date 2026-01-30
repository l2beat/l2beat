Generated with discovered.json: 0x595fb9d8388837dfd0e8a949e1499adc59c265e2

# Diff at Fri, 30 Jan 2026 15:41:57 GMT:

- author: vincfurc (<vincfurc@users.noreply.github.com>)
- current timestamp: 1769787652

## Description

Discovery rerun on the same block number with only config-related changes.

## Initial discovery

```diff
+   Status: CREATED
    contract SuperchainConfig (eth:0x097f99768A0a4a0A81bAbbCB1ea18193bA9D53cC)
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages pause states for each chain connected to it, as well as a global pause state for all chains. The guardian role can pause either separately, but each pause expires after 3mo 1d if left untouched.
```

```diff
+   Status: CREATED
    contract PreimageOracle (eth:0x1fb8cdFc6831fc866Ed9C51aF8817Da5c287aDD3)
    +++ description: The PreimageOracle contract is used to load the required data from L1 for a dispute game.
```

```diff
+   Status: CREATED
    contract Conduit Multisig 1 (eth:0x4a4962275DF8C60a80d3a25faEc5AA7De116A746)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyAdmin (eth:0x5306B2A086d477eCc7302447519dA688f9176e3D)
    +++ description: None
```

```diff
+   Status: CREATED
    contract DisputeGameFactory (eth:0x5931f05809932a43C2A6c86f3F9BC2788f840b1C)
    +++ description: The dispute game factory allows the creation of dispute games, used to propose state roots and eventually challenge them.
```

```diff
+   Status: CREATED
    contract OptimismMintableERC20Factory (eth:0x6201ED1a86d680B443f44382964ceCf83BEb9c2F)
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintableERC20 as this chain's representation of a token on the host chain, or vice-versa.
```

```diff
+   Status: CREATED
    contract DelayedWETH (eth:0x643207A886613F651A9D4c49138c761c61C5df3B)
    +++ description: Contract designed to hold the bonded ETH for each game. It is designed as a wrapper around WETH to allow an owner to function as a backstop if a game would incorrectly distribute funds.
```

```diff
+   Status: CREATED
    contract MIPS (eth:0x6463dEE3828677F6270d83d45408044fc5eDB908)
    +++ description: The MIPS contract is used to execute the final step of the dispute game which objectively determines the winner of the dispute.
```

```diff
+   Status: CREATED
    contract PermissionedDisputeGame (eth:0x64A42dB261E1a19a56C51E541F45b42139a4488a)
    +++ description: Same as FaultDisputeGame, but only two permissioned addresses are designated as proposer and challenger.
```

```diff
+   Status: CREATED
    contract L1CrossDomainMessenger (eth:0x793c90d3f04ac72Cc7E46Faa8AcaDEA0A10e8D52)
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
```

```diff
+   Status: CREATED
    contract OptimismPortal2 (eth:0x7b96e2c80696D5D2d673f0EA62b67352E18747C0)
    +++ description: The OptimismPortal contract is the main entry point to deposit funds from L1 to L2. It also allows to prove and finalize withdrawals. It specifies which game type can be used for withdrawals, which currently is the PermissionedDisputeGame.
```

```diff
+   Status: CREATED
    contract SystemConfig (eth:0x8a502d8EEa2Ed3e89c4D52DE51364688590cE591)
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
```

```diff
+   Status: CREATED
    contract AnchorStateRegistry (eth:0x92A4334C1B7876d3A6Fba0614ac3CECcF2121568)
    +++ description: Contains the latest confirmed state root that can be used as a starting point in a dispute game. It specifies which game type can be used for withdrawals, which currently is the PermissionedDisputeGame.
```

```diff
+   Status: CREATED
    contract ProxyAdmin (eth:0xb4899FF43Ae727B1E9CB19AC44660e4A43Fad0b5)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1StandardBridge (eth:0xDD72d0bD01Fc7BeCe4Cc0cFdD2be6a29b846B072)
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
```

```diff
+   Status: CREATED
    contract AddressManager (eth:0xe86C1ea70e6ef0D9EBBe303aAFAbc4a7369669Fc)
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
```

```diff
+   Status: CREATED
    contract L1ERC721Bridge (eth:0xeA869DCE9Fd2Fdda1ec61492662dD715755b24E1)
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
```
