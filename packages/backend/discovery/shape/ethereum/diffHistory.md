Generated with discovered.json: 0x143938927bbc184d6464dbca74c7e249daf86e8d

# Diff at Fri, 24 Jan 2025 10:54:04 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@fff69b1db37918a5360f1e3b59d2f37be25d166f block: 21080599
- current block number: 21080599

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21080599 (main branch discovery), not current.

```diff
    contract AlchemyMultisig1 (0xA4fB12D15Eb85dc9284a7df0AdBC8B696EdbbF1d) {
    +++ description: None
      name:
-        "ShapeMultisig"
+        "AlchemyMultisig1"
    }
```

Generated with discovered.json: 0x30ffb1d3f623302f755781864733fa26f4bd3507

# Diff at Mon, 20 Jan 2025 11:10:01 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@2c8b4f3d9910bb6371be9b4df87b70856e7d8c64 block: 21080599
- current block number: 21080599

## Description

Rerun on the same block number. Applies fixes to permissions and via field. Renames permission's target to to/from.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21080599 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x11B190Ae661c6d6884dFEE48E215691E0DdB842e) {
    +++ description: None
      directlyReceivedPermissions.7.target:
-        "0xfF11e41D5C4F522E423Ff6C064Ff8D55AF8f7355"
      directlyReceivedPermissions.7.from:
+        "0xfF11e41D5C4F522E423Ff6C064Ff8D55AF8f7355"
      directlyReceivedPermissions.6.target:
-        "0xEB06fFa16011B5628BaB98E29776361c83741dd3"
      directlyReceivedPermissions.6.from:
+        "0xEB06fFa16011B5628BaB98E29776361c83741dd3"
      directlyReceivedPermissions.5.target:
-        "0xe9d3E49b0636016c5fE9eaA2347948D0bA9f15Af"
      directlyReceivedPermissions.5.from:
+        "0xe9d3E49b0636016c5fE9eaA2347948D0bA9f15Af"
      directlyReceivedPermissions.4.target:
-        "0x6Ef8c69CfE4635d866e3E02732068022c06e724D"
      directlyReceivedPermissions.4.from:
+        "0x6Ef8c69CfE4635d866e3E02732068022c06e724D"
      directlyReceivedPermissions.3.target:
-        "0x62Edd5f4930Ea92dCa3fB81689bDD9b9d076b57B"
      directlyReceivedPermissions.3.from:
+        "0x62Edd5f4930Ea92dCa3fB81689bDD9b9d076b57B"
      directlyReceivedPermissions.2.target:
-        "0x319322906beAdf69dF5d4607169c63D692B1aDC1"
      directlyReceivedPermissions.2.from:
+        "0x319322906beAdf69dF5d4607169c63D692B1aDC1"
      directlyReceivedPermissions.1.target:
-        "0x125664BEf08177ca43f6f301E63118b1e4cCDe09"
      directlyReceivedPermissions.1.from:
+        "0x125664BEf08177ca43f6f301E63118b1e4cCDe09"
      directlyReceivedPermissions.0.target:
-        "0xcee78437aE9e15cee9c78E63757E0153c0FD7479"
      directlyReceivedPermissions.0.from:
+        "0xcee78437aE9e15cee9c78E63757E0153c0FD7479"
    }
```

```diff
    contract SuperchainConfig (0x125664BEf08177ca43f6f301E63118b1e4cCDe09) {
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      issuedPermissions.1.target:
-        "0xA4fB12D15Eb85dc9284a7df0AdBC8B696EdbbF1d"
      issuedPermissions.1.via.0.delay:
-        0
      issuedPermissions.1.to:
+        "0xA4fB12D15Eb85dc9284a7df0AdBC8B696EdbbF1d"
      issuedPermissions.0.target:
-        "0xee1Af3f99AF8C5b93512FbE2A3f0dD5568CE087f"
      issuedPermissions.0.to:
+        "0xee1Af3f99AF8C5b93512FbE2A3f0dD5568CE087f"
    }
```

```diff
    contract OptimismMintableERC20Factory (0x319322906beAdf69dF5d4607169c63D692B1aDC1) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      issuedPermissions.0.target:
-        "0xA4fB12D15Eb85dc9284a7df0AdBC8B696EdbbF1d"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0xA4fB12D15Eb85dc9284a7df0AdBC8B696EdbbF1d"
    }
```

```diff
    contract L1StandardBridge (0x62Edd5f4930Ea92dCa3fB81689bDD9b9d076b57B) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      issuedPermissions.0.target:
-        "0xA4fB12D15Eb85dc9284a7df0AdBC8B696EdbbF1d"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.via.0.description:
-        "upgrading the bridge implementation can give access to all funds escrowed therein."
      issuedPermissions.0.to:
+        "0xA4fB12D15Eb85dc9284a7df0AdBC8B696EdbbF1d"
      issuedPermissions.0.description:
+        "upgrading the bridge implementation can give access to all funds escrowed therein."
    }
```

```diff
    contract L2OutputOracle (0x6Ef8c69CfE4635d866e3E02732068022c06e724D) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      issuedPermissions.2.target:
-        "0xA4fB12D15Eb85dc9284a7df0AdBC8B696EdbbF1d"
      issuedPermissions.2.via.0.delay:
-        0
      issuedPermissions.2.to:
+        "0xA4fB12D15Eb85dc9284a7df0AdBC8B696EdbbF1d"
      issuedPermissions.1.target:
-        "0x0D8a607F3d2de86adD04Df00f06794cB339A40de"
      issuedPermissions.1.to:
+        "0x0D8a607F3d2de86adD04Df00f06794cB339A40de"
      issuedPermissions.0.target:
-        "0xee1Af3f99AF8C5b93512FbE2A3f0dD5568CE087f"
      issuedPermissions.0.to:
+        "0xee1Af3f99AF8C5b93512FbE2A3f0dD5568CE087f"
    }
```

```diff
    contract ShapeMultisig (0xA4fB12D15Eb85dc9284a7df0AdBC8B696EdbbF1d) {
    +++ description: None
      receivedPermissions.7.target:
-        "0xfF11e41D5C4F522E423Ff6C064Ff8D55AF8f7355"
      receivedPermissions.7.from:
+        "0xfF11e41D5C4F522E423Ff6C064Ff8D55AF8f7355"
      receivedPermissions.6.target:
-        "0xEB06fFa16011B5628BaB98E29776361c83741dd3"
      receivedPermissions.6.from:
+        "0xEB06fFa16011B5628BaB98E29776361c83741dd3"
      receivedPermissions.5.target:
-        "0xe9d3E49b0636016c5fE9eaA2347948D0bA9f15Af"
      receivedPermissions.5.from:
+        "0xe9d3E49b0636016c5fE9eaA2347948D0bA9f15Af"
      receivedPermissions.4.target:
-        "0x6Ef8c69CfE4635d866e3E02732068022c06e724D"
      receivedPermissions.4.from:
+        "0x6Ef8c69CfE4635d866e3E02732068022c06e724D"
      receivedPermissions.3.target:
-        "0x62Edd5f4930Ea92dCa3fB81689bDD9b9d076b57B"
      receivedPermissions.3.from:
+        "0x62Edd5f4930Ea92dCa3fB81689bDD9b9d076b57B"
      receivedPermissions.2.target:
-        "0x319322906beAdf69dF5d4607169c63D692B1aDC1"
      receivedPermissions.2.from:
+        "0x319322906beAdf69dF5d4607169c63D692B1aDC1"
      receivedPermissions.1.target:
-        "0x125664BEf08177ca43f6f301E63118b1e4cCDe09"
      receivedPermissions.1.from:
+        "0x125664BEf08177ca43f6f301E63118b1e4cCDe09"
      receivedPermissions.0.target:
-        "0xcee78437aE9e15cee9c78E63757E0153c0FD7479"
      receivedPermissions.0.from:
+        "0xcee78437aE9e15cee9c78E63757E0153c0FD7479"
      directlyReceivedPermissions.0.target:
-        "0x11B190Ae661c6d6884dFEE48E215691E0DdB842e"
      directlyReceivedPermissions.0.from:
+        "0x11B190Ae661c6d6884dFEE48E215691E0DdB842e"
    }
```

```diff
    contract AddressManager (0xcee78437aE9e15cee9c78E63757E0153c0FD7479) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      issuedPermissions.0.target:
-        "0xA4fB12D15Eb85dc9284a7df0AdBC8B696EdbbF1d"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.via.0.description:
-        "set and change address mappings."
      issuedPermissions.0.to:
+        "0xA4fB12D15Eb85dc9284a7df0AdBC8B696EdbbF1d"
      issuedPermissions.0.description:
+        "set and change address mappings."
    }
```

```diff
    contract L1ERC721Bridge (0xe9d3E49b0636016c5fE9eaA2347948D0bA9f15Af) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      issuedPermissions.0.target:
-        "0xA4fB12D15Eb85dc9284a7df0AdBC8B696EdbbF1d"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0xA4fB12D15Eb85dc9284a7df0AdBC8B696EdbbF1d"
    }
```

```diff
    contract OptimismPortal (0xEB06fFa16011B5628BaB98E29776361c83741dd3) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      issuedPermissions.1.target:
-        "0xA4fB12D15Eb85dc9284a7df0AdBC8B696EdbbF1d"
      issuedPermissions.1.via.0.delay:
-        0
      issuedPermissions.1.to:
+        "0xA4fB12D15Eb85dc9284a7df0AdBC8B696EdbbF1d"
      issuedPermissions.0.target:
-        "0xee1Af3f99AF8C5b93512FbE2A3f0dD5568CE087f"
      issuedPermissions.0.to:
+        "0xee1Af3f99AF8C5b93512FbE2A3f0dD5568CE087f"
    }
```

```diff
    contract SystemConfig (0xfF11e41D5C4F522E423Ff6C064Ff8D55AF8f7355) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      issuedPermissions.2.target:
-        "0xA4fB12D15Eb85dc9284a7df0AdBC8B696EdbbF1d"
      issuedPermissions.2.via.0.delay:
-        0
      issuedPermissions.2.to:
+        "0xA4fB12D15Eb85dc9284a7df0AdBC8B696EdbbF1d"
      issuedPermissions.1.target:
-        "0xF7ca543d652E38692fD12f989eb55b5327eC9A20"
      issuedPermissions.1.to:
+        "0xF7ca543d652E38692fD12f989eb55b5327eC9A20"
      issuedPermissions.0.target:
-        "0xee1Af3f99AF8C5b93512FbE2A3f0dD5568CE087f"
      issuedPermissions.0.to:
+        "0xee1Af3f99AF8C5b93512FbE2A3f0dD5568CE087f"
      issuedPermissions.0.description:
+        "it can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system."
    }
```

Generated with discovered.json: 0x2cd9f040f9ea2a25b4b2d26405262f84c225623e

# Diff at Wed, 08 Jan 2025 09:06:59 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@deefa974378c2cd6b74f061e1f5a494bbbe1d63a block: 21080599
- current block number: 21080599

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21080599 (main branch discovery), not current.

```diff
    contract L1StandardBridge (0x62Edd5f4930Ea92dCa3fB81689bDD9b9d076b57B) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      description:
-        "The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token."
+        "The main entry point to deposit ERC20 tokens from host chain to this chain."
    }
```

Generated with discovered.json: 0x678f29dc48de902c4a772dd221be85fcae8baa1f

# Diff at Fri, 01 Nov 2024 12:24:04 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@cd1f0e71bb08ce16b2084a11b768538e8aa6ba8c block: 21080599
- current block number: 21080599

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21080599 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x11B190Ae661c6d6884dFEE48E215691E0DdB842e) {
    +++ description: None
      directlyReceivedPermissions.3.description:
-        "upgrading bridge implementation allows to access all funds and change every system component."
+        "upgrading the bridge implementation can give access to all funds escrowed therein."
    }
```

```diff
    contract SuperchainConfig (0x125664BEf08177ca43f6f301E63118b1e4cCDe09) {
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      description:
-        "This is NOT the shared SuperchainConfig of the OP stack Superchain. This SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system."
+        "This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system."
    }
```

```diff
    contract L1StandardBridge (0x62Edd5f4930Ea92dCa3fB81689bDD9b9d076b57B) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token.
      issuedPermissions.0.via.0.description:
-        "upgrading bridge implementation allows to access all funds and change every system component."
+        "upgrading the bridge implementation can give access to all funds escrowed therein."
    }
```

```diff
    contract ShapeMultisig (0xA4fB12D15Eb85dc9284a7df0AdBC8B696EdbbF1d) {
    +++ description: None
      receivedPermissions.3.description:
-        "upgrading bridge implementation allows to access all funds and change every system component."
+        "upgrading the bridge implementation can give access to all funds escrowed therein."
    }
```

Generated with discovered.json: 0x39ecb14810ed4c9c8150c10b6d44fef2197d999a

# Diff at Wed, 30 Oct 2024 19:40:16 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@35a03ca692bdeb6d3ac713174a7a196c73e4a9de block: 21065298
- current block number: 21080599

## Description

Shape switches the ProxyAdmin owner to a 3/6 multisig. EOA warning removed.

## Watched changes

```diff
    contract ProxyAdmin (0x11B190Ae661c6d6884dFEE48E215691E0DdB842e) {
    +++ description: None
      values.owner:
-        "0xacAF178b5048CB56712dc59E95fBA72F7990A005"
+        "0xA4fB12D15Eb85dc9284a7df0AdBC8B696EdbbF1d"
    }
```

```diff
    contract SuperchainConfig (0x125664BEf08177ca43f6f301E63118b1e4cCDe09) {
    +++ description: This is NOT the shared SuperchainConfig of the OP stack Superchain. This SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      issuedPermissions.1.target:
-        "0xee1Af3f99AF8C5b93512FbE2A3f0dD5568CE087f"
+        "0xA4fB12D15Eb85dc9284a7df0AdBC8B696EdbbF1d"
      issuedPermissions.1.via.1:
-        {"address":"0x11B190Ae661c6d6884dFEE48E215691E0DdB842e","delay":0}
      issuedPermissions.1.via.0.address:
-        "0xacAF178b5048CB56712dc59E95fBA72F7990A005"
+        "0x11B190Ae661c6d6884dFEE48E215691E0DdB842e"
    }
```

```diff
    contract OptimismMintableERC20Factory (0x319322906beAdf69dF5d4607169c63D692B1aDC1) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      issuedPermissions.0.target:
-        "0xee1Af3f99AF8C5b93512FbE2A3f0dD5568CE087f"
+        "0xA4fB12D15Eb85dc9284a7df0AdBC8B696EdbbF1d"
      issuedPermissions.0.via.1:
-        {"address":"0x11B190Ae661c6d6884dFEE48E215691E0DdB842e","delay":0}
      issuedPermissions.0.via.0.address:
-        "0xacAF178b5048CB56712dc59E95fBA72F7990A005"
+        "0x11B190Ae661c6d6884dFEE48E215691E0DdB842e"
    }
```

```diff
    contract L1StandardBridge (0x62Edd5f4930Ea92dCa3fB81689bDD9b9d076b57B) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token.
      issuedPermissions.0.target:
-        "0xee1Af3f99AF8C5b93512FbE2A3f0dD5568CE087f"
+        "0xA4fB12D15Eb85dc9284a7df0AdBC8B696EdbbF1d"
      issuedPermissions.0.via.1:
-        {"address":"0x11B190Ae661c6d6884dFEE48E215691E0DdB842e","delay":0,"description":"upgrading bridge implementation allows to access all funds and change every system component."}
      issuedPermissions.0.via.0.address:
-        "0xacAF178b5048CB56712dc59E95fBA72F7990A005"
+        "0x11B190Ae661c6d6884dFEE48E215691E0DdB842e"
      issuedPermissions.0.via.0.description:
+        "upgrading bridge implementation allows to access all funds and change every system component."
    }
```

```diff
    contract L2OutputOracle (0x6Ef8c69CfE4635d866e3E02732068022c06e724D) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      issuedPermissions.2.target:
-        "0xee1Af3f99AF8C5b93512FbE2A3f0dD5568CE087f"
+        "0xA4fB12D15Eb85dc9284a7df0AdBC8B696EdbbF1d"
      issuedPermissions.2.via.1:
-        {"address":"0x11B190Ae661c6d6884dFEE48E215691E0DdB842e","delay":0}
      issuedPermissions.2.via.0.address:
-        "0xacAF178b5048CB56712dc59E95fBA72F7990A005"
+        "0x11B190Ae661c6d6884dFEE48E215691E0DdB842e"
    }
```

```diff
-   Status: DELETED
    contract GnosisSafe (0xacAF178b5048CB56712dc59E95fBA72F7990A005)
    +++ description: None
```

```diff
    contract AddressManager (0xcee78437aE9e15cee9c78E63757E0153c0FD7479) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      issuedPermissions.0.target:
-        "0xee1Af3f99AF8C5b93512FbE2A3f0dD5568CE087f"
+        "0xA4fB12D15Eb85dc9284a7df0AdBC8B696EdbbF1d"
      issuedPermissions.0.via.1:
-        {"address":"0x11B190Ae661c6d6884dFEE48E215691E0DdB842e","delay":0,"description":"set and change address mappings."}
      issuedPermissions.0.via.0.address:
-        "0xacAF178b5048CB56712dc59E95fBA72F7990A005"
+        "0x11B190Ae661c6d6884dFEE48E215691E0DdB842e"
      issuedPermissions.0.via.0.description:
+        "set and change address mappings."
    }
```

```diff
    contract L1ERC721Bridge (0xe9d3E49b0636016c5fE9eaA2347948D0bA9f15Af) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      issuedPermissions.0.target:
-        "0xee1Af3f99AF8C5b93512FbE2A3f0dD5568CE087f"
+        "0xA4fB12D15Eb85dc9284a7df0AdBC8B696EdbbF1d"
      issuedPermissions.0.via.1:
-        {"address":"0x11B190Ae661c6d6884dFEE48E215691E0DdB842e","delay":0}
      issuedPermissions.0.via.0.address:
-        "0xacAF178b5048CB56712dc59E95fBA72F7990A005"
+        "0x11B190Ae661c6d6884dFEE48E215691E0DdB842e"
    }
```

```diff
    contract OptimismPortal (0xEB06fFa16011B5628BaB98E29776361c83741dd3) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      issuedPermissions.1.target:
-        "0xee1Af3f99AF8C5b93512FbE2A3f0dD5568CE087f"
+        "0xA4fB12D15Eb85dc9284a7df0AdBC8B696EdbbF1d"
      issuedPermissions.1.via.1:
-        {"address":"0x11B190Ae661c6d6884dFEE48E215691E0DdB842e","delay":0}
      issuedPermissions.1.via.0.address:
-        "0xacAF178b5048CB56712dc59E95fBA72F7990A005"
+        "0x11B190Ae661c6d6884dFEE48E215691E0DdB842e"
    }
```

```diff
    contract SystemConfig (0xfF11e41D5C4F522E423Ff6C064Ff8D55AF8f7355) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      issuedPermissions.2.target:
-        "0xee1Af3f99AF8C5b93512FbE2A3f0dD5568CE087f"
+        "0xA4fB12D15Eb85dc9284a7df0AdBC8B696EdbbF1d"
      issuedPermissions.2.via.1:
-        {"address":"0x11B190Ae661c6d6884dFEE48E215691E0DdB842e","delay":0}
      issuedPermissions.2.via.0.address:
-        "0xacAF178b5048CB56712dc59E95fBA72F7990A005"
+        "0x11B190Ae661c6d6884dFEE48E215691E0DdB842e"
    }
```

```diff
+   Status: CREATED
    contract ShapeMultisig (0xA4fB12D15Eb85dc9284a7df0AdBC8B696EdbbF1d)
    +++ description: None
```

## Source code changes

```diff
.../{.flat@21065298/GnosisSafe => .flat/ShapeMultisig}/GnosisSafe.sol     | 0
 .../GnosisSafe => .flat/ShapeMultisig}/GnosisSafeProxy.p.sol              | 0
 2 files changed, 0 insertions(+), 0 deletions(-)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21065298 (main branch discovery), not current.

```diff
    contract GnosisSafe (0xacAF178b5048CB56712dc59E95fBA72F7990A005) {
    +++ description: None
      name:
-        "ShapeMultisig"
+        "GnosisSafe"
    }
```

Generated with discovered.json: 0x2bdd7db42436b16052a7763488380979b6e85e5c

# Diff at Tue, 29 Oct 2024 13:17:47 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@7b3fc9dc9074e1d423b48522c3f0273c86aab54a block: 21065298
- current block number: 21065298

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21065298 (main branch discovery), not current.

```diff
    contract L2OutputOracle (0x6Ef8c69CfE4635d866e3E02732068022c06e724D) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      fieldMeta:
+        {"FINALIZATION_PERIOD_SECONDS":{"description":"Challenge period (Number of seconds until a state root is finalized)."}}
    }
```

Generated with discovered.json: 0x59f5c1563ea358ac473956b2ebb44a8a48245f23

# Diff at Mon, 28 Oct 2024 16:23:35 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- current block number: 21065298

## Description

Initial discovery: Standard OP stack rollup with EOA admin. (alchemy)

## Initial discovery

```diff
+   Status: CREATED
    contract ProxyAdmin (0x11B190Ae661c6d6884dFEE48E215691E0DdB842e)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SuperchainConfig (0x125664BEf08177ca43f6f301E63118b1e4cCDe09)
    +++ description: This is NOT the shared SuperchainConfig of the OP stack Superchain. This SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
```

```diff
+   Status: CREATED
    contract L1CrossDomainMessenger (0x2b18602877181C3cB72C687E2A771E123A3788E3)
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
```

```diff
+   Status: CREATED
    contract OptimismMintableERC20Factory (0x319322906beAdf69dF5d4607169c63D692B1aDC1)
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
```

```diff
+   Status: CREATED
    contract L1StandardBridge (0x62Edd5f4930Ea92dCa3fB81689bDD9b9d076b57B)
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token.
```

```diff
+   Status: CREATED
    contract L2OutputOracle (0x6Ef8c69CfE4635d866e3E02732068022c06e724D)
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
```

```diff
+   Status: CREATED
    contract ShapeMultisig (0xacAF178b5048CB56712dc59E95fBA72F7990A005)
    +++ description: None
```

```diff
+   Status: CREATED
    contract AddressManager (0xcee78437aE9e15cee9c78E63757E0153c0FD7479)
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
```

```diff
+   Status: CREATED
    contract L1ERC721Bridge (0xe9d3E49b0636016c5fE9eaA2347948D0bA9f15Af)
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
```

```diff
+   Status: CREATED
    contract OptimismPortal (0xEB06fFa16011B5628BaB98E29776361c83741dd3)
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
```

```diff
+   Status: CREATED
    contract SystemConfig (0xfF11e41D5C4F522E423Ff6C064Ff8D55AF8f7355)
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
```
