Generated with discovered.json: 0x8b09795050fccf5fd62e00475ea6b19d4c5fbd03

# Diff at Wed, 08 Jan 2025 09:05:37 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@deefa974378c2cd6b74f061e1f5a494bbbe1d63a block: 21242938
- current block number: 21242938

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21242938 (main branch discovery), not current.

```diff
    contract L1StandardBridge (0x680969A6c58183987c8126ca4DE6b59C6540Cd2a) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      description:
-        "The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token."
+        "The main entry point to deposit ERC20 tokens from host chain to this chain."
    }
```

Generated with discovered.json: 0x29a31ce32867ad4248aa13a2a6be0a785221611b

# Diff at Fri, 22 Nov 2024 11:21:25 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- current block number: 21242938

## Description

Standard opstack rollup with 3 weird multisigs and fake superchain.

## Initial discovery

```diff
+   Status: CREATED
    contract OptimismPortal (0x0485Ca8A73682B3D3f5ae98cdca1E5b512E728e9)
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
```

```diff
+   Status: CREATED
    contract L1ERC721Bridge (0x0f33D824d74180598311b3025095727BeA61f219)
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
```

```diff
+   Status: CREATED
    contract OptimismMintableERC20Factory (0x1d1c4C89AD5FF486c3C67E3DD84A22CF05420711)
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
```

```diff
+   Status: CREATED
    contract RaceMultisig2 (0x2E7B9465B25C081c07274A31DbD05C6146f67961)
    +++ description: None
```

```diff
+   Status: CREATED
    contract AddressManager (0x3d2BdE87466Cae97011702D2C305fd40EEBbbF0a)
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
```

```diff
+   Status: CREATED
    contract RaceMultisig1 (0x5A669B2193718F189b0576c0cdcedfEd6f40F9Ea)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1StandardBridge (0x680969A6c58183987c8126ca4DE6b59C6540Cd2a)
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token.
```

```diff
+   Status: CREATED
    contract L2OutputOracle (0x8bF8442d49d52377d735a90F19657a29f29aA83c)
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x9B3C6D1d33F1fd82Ebb8dFbE38dA162B329De191)
    +++ description: None
```

```diff
+   Status: CREATED
    contract RaceMultisig3 (0xBac1ad52745162c0aA3711fe88Df1Cc67034a3B9)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SuperchainConfig (0xCB73B7348705a9F925643150Eb00350719380FF8)
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
```

```diff
+   Status: CREATED
    contract SystemConfig (0xCf6A32dB8b3313b3d439CE6909511c2c3415fa32)
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
```

```diff
+   Status: CREATED
    contract L1CrossDomainMessenger (0xf54B2BAEF894cfF5511A5722Acaac0409F2F2d89)
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
```
