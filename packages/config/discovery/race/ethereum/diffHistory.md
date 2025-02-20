Generated with discovered.json: 0xd8b41eb2530aefdc54d23409cc9bfa0b095ce6e4

# Diff at Mon, 10 Feb 2025 19:04:29 GMT:

- author: Michał Podsiadły (<michal.podsiadly@l2beat.com>)
- comparing to: main@3756adff7c1ac86d8af3374a90a75c1999aae2b3 block: 21242938
- current block number: 21242938

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21242938 (main branch discovery), not current.

```diff
    contract SystemConfig (0xCf6A32dB8b3313b3d439CE6909511c2c3415fa32) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      values.opStackDA.isUsingEigenDA:
+        false
    }
```

Generated with discovered.json: 0x015e77aca1803c88183066cb70cce4c93ed97314

# Diff at Tue, 04 Feb 2025 12:31:54 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@145553eed7ba44636411ecb25e4099728acd02f9 block: 21242938
- current block number: 21242938

## Description

Rename 'configure' permission to 'interact'

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21242938 (main branch discovery), not current.

```diff
    contract AddressManager (0x3d2BdE87466Cae97011702D2C305fd40EEBbbF0a) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      issuedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract RaceMultisig1 (0x5A669B2193718F189b0576c0cdcedfEd6f40F9Ea) {
    +++ description: None
      receivedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract ProxyAdmin (0x9B3C6D1d33F1fd82Ebb8dFbE38dA162B329De191) {
    +++ description: None
      directlyReceivedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract RaceMultisig3 (0xBac1ad52745162c0aA3711fe88Df1Cc67034a3B9) {
    +++ description: None
      receivedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract SystemConfig (0xCf6A32dB8b3313b3d439CE6909511c2c3415fa32) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      issuedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

Generated with discovered.json: 0x0db533b96bb22c3abd7e82e5c099d17845bcfa4b

# Diff at Mon, 20 Jan 2025 11:09:57 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@2c8b4f3d9910bb6371be9b4df87b70856e7d8c64 block: 21242938
- current block number: 21242938

## Description

Rerun on the same block number. Applies fixes to permissions and via field. Renames permission's target to to/from.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21242938 (main branch discovery), not current.

```diff
    contract OptimismPortal (0x0485Ca8A73682B3D3f5ae98cdca1E5b512E728e9) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      issuedPermissions.1.target:
-        "0x5A669B2193718F189b0576c0cdcedfEd6f40F9Ea"
      issuedPermissions.1.via.0.delay:
-        0
      issuedPermissions.1.to:
+        "0x5A669B2193718F189b0576c0cdcedfEd6f40F9Ea"
      issuedPermissions.0.target:
-        "0x2E7B9465B25C081c07274A31DbD05C6146f67961"
      issuedPermissions.0.to:
+        "0x2E7B9465B25C081c07274A31DbD05C6146f67961"
    }
```

```diff
    contract L1ERC721Bridge (0x0f33D824d74180598311b3025095727BeA61f219) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      issuedPermissions.0.target:
-        "0x5A669B2193718F189b0576c0cdcedfEd6f40F9Ea"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x5A669B2193718F189b0576c0cdcedfEd6f40F9Ea"
    }
```

```diff
    contract OptimismMintableERC20Factory (0x1d1c4C89AD5FF486c3C67E3DD84A22CF05420711) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      issuedPermissions.0.target:
-        "0x5A669B2193718F189b0576c0cdcedfEd6f40F9Ea"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x5A669B2193718F189b0576c0cdcedfEd6f40F9Ea"
    }
```

```diff
    contract RaceMultisig2 (0x2E7B9465B25C081c07274A31DbD05C6146f67961) {
    +++ description: None
      receivedPermissions.2.target:
-        "0xCB73B7348705a9F925643150Eb00350719380FF8"
      receivedPermissions.2.from:
+        "0xCB73B7348705a9F925643150Eb00350719380FF8"
      receivedPermissions.1.target:
-        "0x0485Ca8A73682B3D3f5ae98cdca1E5b512E728e9"
      receivedPermissions.1.from:
+        "0x0485Ca8A73682B3D3f5ae98cdca1E5b512E728e9"
      receivedPermissions.0.target:
-        "0x8bF8442d49d52377d735a90F19657a29f29aA83c"
      receivedPermissions.0.from:
+        "0x8bF8442d49d52377d735a90F19657a29f29aA83c"
    }
```

```diff
    contract AddressManager (0x3d2BdE87466Cae97011702D2C305fd40EEBbbF0a) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      issuedPermissions.0.target:
-        "0x5A669B2193718F189b0576c0cdcedfEd6f40F9Ea"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.via.0.description:
-        "set and change address mappings."
      issuedPermissions.0.to:
+        "0x5A669B2193718F189b0576c0cdcedfEd6f40F9Ea"
      issuedPermissions.0.description:
+        "set and change address mappings."
    }
```

```diff
    contract RaceMultisig1 (0x5A669B2193718F189b0576c0cdcedfEd6f40F9Ea) {
    +++ description: None
      receivedPermissions.7.target:
-        "0xCf6A32dB8b3313b3d439CE6909511c2c3415fa32"
      receivedPermissions.7.from:
+        "0xCf6A32dB8b3313b3d439CE6909511c2c3415fa32"
      receivedPermissions.6.target:
-        "0xCB73B7348705a9F925643150Eb00350719380FF8"
      receivedPermissions.6.from:
+        "0xCB73B7348705a9F925643150Eb00350719380FF8"
      receivedPermissions.5.target:
-        "0x8bF8442d49d52377d735a90F19657a29f29aA83c"
      receivedPermissions.5.from:
+        "0x8bF8442d49d52377d735a90F19657a29f29aA83c"
      receivedPermissions.4.target:
-        "0x680969A6c58183987c8126ca4DE6b59C6540Cd2a"
      receivedPermissions.4.from:
+        "0x680969A6c58183987c8126ca4DE6b59C6540Cd2a"
      receivedPermissions.3.target:
-        "0x1d1c4C89AD5FF486c3C67E3DD84A22CF05420711"
      receivedPermissions.3.from:
+        "0x1d1c4C89AD5FF486c3C67E3DD84A22CF05420711"
      receivedPermissions.2.target:
-        "0x0f33D824d74180598311b3025095727BeA61f219"
      receivedPermissions.2.from:
+        "0x0f33D824d74180598311b3025095727BeA61f219"
      receivedPermissions.1.target:
-        "0x0485Ca8A73682B3D3f5ae98cdca1E5b512E728e9"
      receivedPermissions.1.from:
+        "0x0485Ca8A73682B3D3f5ae98cdca1E5b512E728e9"
      receivedPermissions.0.target:
-        "0x3d2BdE87466Cae97011702D2C305fd40EEBbbF0a"
      receivedPermissions.0.from:
+        "0x3d2BdE87466Cae97011702D2C305fd40EEBbbF0a"
      directlyReceivedPermissions.0.target:
-        "0x9B3C6D1d33F1fd82Ebb8dFbE38dA162B329De191"
      directlyReceivedPermissions.0.from:
+        "0x9B3C6D1d33F1fd82Ebb8dFbE38dA162B329De191"
    }
```

```diff
    contract L1StandardBridge (0x680969A6c58183987c8126ca4DE6b59C6540Cd2a) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      issuedPermissions.0.target:
-        "0x5A669B2193718F189b0576c0cdcedfEd6f40F9Ea"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.via.0.description:
-        "upgrading the bridge implementation can give access to all funds escrowed therein."
      issuedPermissions.0.to:
+        "0x5A669B2193718F189b0576c0cdcedfEd6f40F9Ea"
      issuedPermissions.0.description:
+        "upgrading the bridge implementation can give access to all funds escrowed therein."
    }
```

```diff
    contract L2OutputOracle (0x8bF8442d49d52377d735a90F19657a29f29aA83c) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      issuedPermissions.2.target:
-        "0x5A669B2193718F189b0576c0cdcedfEd6f40F9Ea"
      issuedPermissions.2.via.0.delay:
-        0
      issuedPermissions.2.to:
+        "0x5A669B2193718F189b0576c0cdcedfEd6f40F9Ea"
      issuedPermissions.1.target:
-        "0x88D58BFbCD70c25409b67117fC1CDfeFDA113a78"
      issuedPermissions.1.to:
+        "0x88D58BFbCD70c25409b67117fC1CDfeFDA113a78"
      issuedPermissions.0.target:
-        "0x2E7B9465B25C081c07274A31DbD05C6146f67961"
      issuedPermissions.0.to:
+        "0x2E7B9465B25C081c07274A31DbD05C6146f67961"
    }
```

```diff
    contract ProxyAdmin (0x9B3C6D1d33F1fd82Ebb8dFbE38dA162B329De191) {
    +++ description: None
      directlyReceivedPermissions.7.target:
-        "0xCf6A32dB8b3313b3d439CE6909511c2c3415fa32"
      directlyReceivedPermissions.7.from:
+        "0xCf6A32dB8b3313b3d439CE6909511c2c3415fa32"
      directlyReceivedPermissions.6.target:
-        "0xCB73B7348705a9F925643150Eb00350719380FF8"
      directlyReceivedPermissions.6.from:
+        "0xCB73B7348705a9F925643150Eb00350719380FF8"
      directlyReceivedPermissions.5.target:
-        "0x8bF8442d49d52377d735a90F19657a29f29aA83c"
      directlyReceivedPermissions.5.from:
+        "0x8bF8442d49d52377d735a90F19657a29f29aA83c"
      directlyReceivedPermissions.4.target:
-        "0x680969A6c58183987c8126ca4DE6b59C6540Cd2a"
      directlyReceivedPermissions.4.from:
+        "0x680969A6c58183987c8126ca4DE6b59C6540Cd2a"
      directlyReceivedPermissions.3.target:
-        "0x1d1c4C89AD5FF486c3C67E3DD84A22CF05420711"
      directlyReceivedPermissions.3.from:
+        "0x1d1c4C89AD5FF486c3C67E3DD84A22CF05420711"
      directlyReceivedPermissions.2.target:
-        "0x0f33D824d74180598311b3025095727BeA61f219"
      directlyReceivedPermissions.2.from:
+        "0x0f33D824d74180598311b3025095727BeA61f219"
      directlyReceivedPermissions.1.target:
-        "0x0485Ca8A73682B3D3f5ae98cdca1E5b512E728e9"
      directlyReceivedPermissions.1.from:
+        "0x0485Ca8A73682B3D3f5ae98cdca1E5b512E728e9"
      directlyReceivedPermissions.0.target:
-        "0x3d2BdE87466Cae97011702D2C305fd40EEBbbF0a"
      directlyReceivedPermissions.0.from:
+        "0x3d2BdE87466Cae97011702D2C305fd40EEBbbF0a"
    }
```

```diff
    contract RaceMultisig3 (0xBac1ad52745162c0aA3711fe88Df1Cc67034a3B9) {
    +++ description: None
      receivedPermissions.0.target:
-        "0xCf6A32dB8b3313b3d439CE6909511c2c3415fa32"
      receivedPermissions.0.from:
+        "0xCf6A32dB8b3313b3d439CE6909511c2c3415fa32"
    }
```

```diff
    contract SuperchainConfig (0xCB73B7348705a9F925643150Eb00350719380FF8) {
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      issuedPermissions.1.target:
-        "0x5A669B2193718F189b0576c0cdcedfEd6f40F9Ea"
      issuedPermissions.1.via.0.delay:
-        0
      issuedPermissions.1.to:
+        "0x5A669B2193718F189b0576c0cdcedfEd6f40F9Ea"
      issuedPermissions.0.target:
-        "0x2E7B9465B25C081c07274A31DbD05C6146f67961"
      issuedPermissions.0.to:
+        "0x2E7B9465B25C081c07274A31DbD05C6146f67961"
    }
```

```diff
    contract SystemConfig (0xCf6A32dB8b3313b3d439CE6909511c2c3415fa32) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      issuedPermissions.2.target:
-        "0x5A669B2193718F189b0576c0cdcedfEd6f40F9Ea"
      issuedPermissions.2.via.0.delay:
-        0
      issuedPermissions.2.to:
+        "0x5A669B2193718F189b0576c0cdcedfEd6f40F9Ea"
      issuedPermissions.1.target:
-        "0x8CDa8351236199AF7532baD53D683Ddd9B275d89"
      issuedPermissions.1.to:
+        "0x8CDa8351236199AF7532baD53D683Ddd9B275d89"
      issuedPermissions.0.target:
-        "0xBac1ad52745162c0aA3711fe88Df1Cc67034a3B9"
      issuedPermissions.0.to:
+        "0xBac1ad52745162c0aA3711fe88Df1Cc67034a3B9"
      issuedPermissions.0.description:
+        "it can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system."
    }
```

Generated with discovered.json: 0xb5f16304518b4d85a7ae821e7541998707a0fe1d

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
