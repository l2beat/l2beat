Generated with discovered.json: 0xded96925c0a10fb23c21ae35f059d471a282788c

# Diff at Fri, 25 Oct 2024 14:40:50 GMT:

- author: Radina Talanova (<nt.radina@gmail.com>)
- current block number: 21043289

## Description

Provide description of changes. This section will be preserved.

## Initial discovery

```diff
+   Status: CREATED
    contract L1CrossDomainMessenger (0x22B0cd077c937b9912772B38519b6d2d91541c1A)
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
```

```diff
+   Status: CREATED
    contract GnosisSafe (0x2876c43B17A5750CBea5E2A3C42718374E21D5a2)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L2OutputOracle (0x29E7177837652ca00f05fbD2e8aA867d207B2EF8)
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
```

```diff
+   Status: CREATED
    contract L1StandardBridge (0x2d51D580Cae0a644a5328E665c768C2A4c0E4a03)
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token.
```

```diff
+   Status: CREATED
    contract L1ERC721Bridge (0x42AABA8A896ca6C987068Ac9a9112c2e4dcA4c96)
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x566c7DB023111D897F16b602B2B57f0F12f7bF44)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OptimismPortal (0x9fDEEa19836A413C04e9672d3d09f482278e863c)
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
```

```diff
+   Status: CREATED
    contract AddressManager (0xA80349b0D79bf3154ae54066410d20eb7B8697Ac)
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
```

```diff
+   Status: CREATED
    contract OptimismMintableERC20Factory (0xB5984cCf496a8FC2d921A5a425Bd5F7a740BE89C)
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
```

```diff
+   Status: CREATED
    contract SuperchainConfig (0xb6aFBB2A7299e968c9f98f8b518bD89e670a420A)
    +++ description: Used to manage global configuration values for multiple OP Chains within a single Superchain network. The SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the Superchain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
```

```diff
+   Status: CREATED
    contract SystemConfig (0xf565303B5326C8653E78e5f73a2984f6F778C9E8)
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
```
