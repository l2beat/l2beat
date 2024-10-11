Generated with discovered.json: 0x39d3beda0e8d031372a85a31e1afca44d475b434

# Diff at Wed, 09 Oct 2024 13:09:43 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@37683e2b3d0587372f886eef49e921277810c8bf block: 20920202
- current block number: 20920202

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20920202 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x35d5D43271548c984662d4879FBc8e041Bc1Ff93) {
    +++ description: None
      directlyReceivedPermissions.0.description:
+        "set and change address mappings."
    }
```

```diff
    contract ConduitMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      receivedPermissions.1.description:
+        "set and change address mappings."
    }
```

```diff
    contract AddressManager (0xC845F9C4004EB35a8bde8ad89C4760a9c0e65CAB) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      issuedPermissions.0.via.0.description:
+        "set and change address mappings."
      descriptions:
+        ["Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts."]
    }
```

Generated with discovered.json: 0x182b6509349018221a7f288bfd6e35ad2819a770

# Diff at Tue, 08 Oct 2024 16:26:07 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@bca55174129419533cd4173605c170ea99ac6f98 block: 20775910
- current block number: 20920202

## Description

Move to discovery driven data.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20775910 (main branch discovery), not current.

```diff
    contract LyraMultisig (0x91F4be0C264FAFA1fEd75c4440910Cba2cAd98e8) {
    +++ description: None
      name:
-        "ChallengerMultisig"
+        "LyraMultisig"
    }
```

Generated with discovered.json: 0x5a6b28eb95f5a78bd06baa8065b6a8a7233fe30c

# Diff at Tue, 01 Oct 2024 10:52:21 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bd754dc73c66120164006054f8d25c5fae9cd910 block: 20775910
- current block number: 20775910

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20775910 (main branch discovery), not current.

```diff
    contract OptimismMintableERC20Factory (0x08Dea366F26C25a08C8D1C3568ad07d1e587136d) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      values.$pastUpgrades:
+        [["2023-11-15T04:14:35.000Z",["0x81C2645D347a67c089169a4Da074aF7788650955"]]]
    }
```

```diff
    contract SystemConfig (0x0e4C4CDd01ceCB01070E9Fdfe7600871e4ae996e) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      values.$pastUpgrades:
+        [["2023-11-15T04:14:35.000Z",["0x81CCFC10CB55B58449A3FEE870D63C4D61941DaC"]]]
    }
```

```diff
    contract L2OutputOracle (0x1145E7848c8B64c6cab86Fd6D378733385c5C3Ba) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      values.$pastUpgrades:
+        [["2023-11-15T04:14:35.000Z",["0xad206309916Fe08A27221133dde05a8F30f75e29"]]]
    }
```

```diff
    contract L1CrossDomainMessenger (0x5456f02c08e9A018E42C39b351328E5AA864174A) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      values.$pastUpgrades:
+        [["2023-11-15T04:14:35.000Z",["0x5456f02c08e9A018E42C39b351328E5AA864174A"]],["2023-11-15T04:14:35.000Z",["0x93f5d9CD5BE592F1DC602E0CF4A38148b880cd13"]]]
      values.$upgradeCount:
+        2
    }
```

```diff
    contract L1StandardBridge (0x61E44dC0dae6888B5a301887732217d5725B0bFf) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token.
      values.$pastUpgrades:
+        []
    }
```

```diff
    contract L1ERC721Bridge (0x6CC3268794c5d3E3d9d52adEfC748B59d536cb22) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      values.$pastUpgrades:
+        [["2023-11-15T04:14:35.000Z",["0x4f993d43f697Cb4c63D719Bb8Dc762dcbbB11476"]]]
    }
```

```diff
    contract OptimismPortal (0x85eA9c11cf3D4786027F7FD08F4406b15777e5f8) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      values.$pastUpgrades:
+        [["2023-11-15T04:14:35.000Z",["0x4Ec5C80Fa12d04DB3A208DD0Fa5C01178FF5a16e"]]]
    }
```

Generated with discovered.json: 0x043b3de45c6f2ef3da3fce6a7eae5c24c963b180

# Diff at Wed, 18 Sep 2024 11:33:33 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@eb09774f0f9d9322f2117dfdfda7d4bb095f6c52 block: 20331900
- current block number: 20775910

## Description

Shape related.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20331900 (main branch discovery), not current.

```diff
    contract OptimismMintableERC20Factory (0x08Dea366F26C25a08C8D1C3568ad07d1e587136d) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      template:
+        "opstack/OptimismMintableERC20Factory"
      descriptions:
+        ["A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa."]
    }
```

```diff
    contract SystemConfig (0x0e4C4CDd01ceCB01070E9Fdfe7600871e4ae996e) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      issuedPermissions.1:
+        {"permission":"upgrade","target":"0x4a4962275DF8C60a80d3a25faEc5AA7De116A746","via":[{"address":"0x35d5D43271548c984662d4879FBc8e041Bc1Ff93","delay":0}]}
      issuedPermissions.0.permission:
-        "upgrade"
+        "configure"
      issuedPermissions.0.via.0:
-        {"address":"0x35d5D43271548c984662d4879FBc8e041Bc1Ff93","delay":0}
      template:
+        "opstack/SystemConfig"
      descriptions:
+        ["Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address."]
      fieldMeta:
+        {"gasLimit":{"severity":"LOW","description":"Gas limit for blocks on L2."}}
    }
```

```diff
    contract L2OutputOracle (0x1145E7848c8B64c6cab86Fd6D378733385c5C3Ba) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      template:
+        "opstack/L2OutputOracle"
      descriptions:
+        ["Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots."]
    }
```

```diff
    contract ProxyAdmin (0x35d5D43271548c984662d4879FBc8e041Bc1Ff93) {
    +++ description: None
      directlyReceivedPermissions.4.description:
+        "upgrading bridge implementation allows to access all funds and change every system component."
    }
```

```diff
    contract ConduitMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      receivedPermissions.7:
+        {"permission":"upgrade","target":"0x85eA9c11cf3D4786027F7FD08F4406b15777e5f8","via":[{"address":"0x35d5D43271548c984662d4879FBc8e041Bc1Ff93"}]}
      receivedPermissions.6.target:
-        "0x85eA9c11cf3D4786027F7FD08F4406b15777e5f8"
+        "0x6CC3268794c5d3E3d9d52adEfC748B59d536cb22"
      receivedPermissions.5.target:
-        "0x6CC3268794c5d3E3d9d52adEfC748B59d536cb22"
+        "0x61E44dC0dae6888B5a301887732217d5725B0bFf"
      receivedPermissions.5.description:
+        "upgrading bridge implementation allows to access all funds and change every system component."
      receivedPermissions.4.target:
-        "0x61E44dC0dae6888B5a301887732217d5725B0bFf"
+        "0x1145E7848c8B64c6cab86Fd6D378733385c5C3Ba"
      receivedPermissions.3.target:
-        "0x1145E7848c8B64c6cab86Fd6D378733385c5C3Ba"
+        "0x0e4C4CDd01ceCB01070E9Fdfe7600871e4ae996e"
      receivedPermissions.2.target:
-        "0x0e4C4CDd01ceCB01070E9Fdfe7600871e4ae996e"
+        "0x08Dea366F26C25a08C8D1C3568ad07d1e587136d"
      receivedPermissions.1.permission:
-        "upgrade"
+        "configure"
      receivedPermissions.1.target:
-        "0x08Dea366F26C25a08C8D1C3568ad07d1e587136d"
+        "0xC845F9C4004EB35a8bde8ad89C4760a9c0e65CAB"
      receivedPermissions.0.target:
-        "0xC845F9C4004EB35a8bde8ad89C4760a9c0e65CAB"
+        "0x0e4C4CDd01ceCB01070E9Fdfe7600871e4ae996e"
      receivedPermissions.0.via:
-        [{"address":"0x35d5D43271548c984662d4879FBc8e041Bc1Ff93"}]
      receivedPermissions.0.description:
+        "it can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system."
    }
```

```diff
    contract L1CrossDomainMessenger (0x5456f02c08e9A018E42C39b351328E5AA864174A) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      template:
+        "opstack/L1CrossDomainMessenger"
      descriptions:
+        ["Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function."]
      categories:
+        ["Core"]
    }
```

```diff
    contract L1StandardBridge (0x61E44dC0dae6888B5a301887732217d5725B0bFf) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token.
      issuedPermissions.0.via.0.description:
+        "upgrading bridge implementation allows to access all funds and change every system component."
      template:
+        "opstack/L1StandardBridge"
      descriptions:
+        ["The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token."]
    }
```

```diff
    contract L1ERC721Bridge (0x6CC3268794c5d3E3d9d52adEfC748B59d536cb22) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      template:
+        "opstack/L1ERC721Bridge"
      descriptions:
+        ["Used to bridge ERC-721 tokens from host chain to this chain."]
    }
```

```diff
    contract OptimismPortal (0x85eA9c11cf3D4786027F7FD08F4406b15777e5f8) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      template:
+        "opstack/OptimismPortal"
      descriptions:
+        ["The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals."]
    }
```

```diff
    contract ChallengerMultisig (0x91F4be0C264FAFA1fEd75c4440910Cba2cAd98e8) {
    +++ description: None
      roles:
+        ["Challenger","Guardian"]
    }
```

Generated with discovered.json: 0xc968684a22b006d35a4830f8209c2feef1e839f8

# Diff at Sun, 08 Sep 2024 17:18:23 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@fd881462cca0d7ef4519f907f3c6cfd5fe1cde8f block: 20331900
- current block number: 20331900

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20331900 (main branch discovery), not current.

```diff
    contract OptimismMintableERC20Factory (0x08Dea366F26C25a08C8D1C3568ad07d1e587136d) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x35d5D43271548c984662d4879FBc8e041Bc1Ff93"
+        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      issuedPermissions.0.via.0:
+        {"address":"0x35d5D43271548c984662d4879FBc8e041Bc1Ff93","delay":0}
    }
```

```diff
    contract SystemConfig (0x0e4C4CDd01ceCB01070E9Fdfe7600871e4ae996e) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x35d5D43271548c984662d4879FBc8e041Bc1Ff93"
+        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      issuedPermissions.0.via.0:
+        {"address":"0x35d5D43271548c984662d4879FBc8e041Bc1Ff93","delay":0}
    }
```

```diff
    contract L2OutputOracle (0x1145E7848c8B64c6cab86Fd6D378733385c5C3Ba) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x35d5D43271548c984662d4879FBc8e041Bc1Ff93"
+        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      issuedPermissions.0.via.0:
+        {"address":"0x35d5D43271548c984662d4879FBc8e041Bc1Ff93","delay":0}
    }
```

```diff
    contract ProxyAdmin (0x35d5D43271548c984662d4879FBc8e041Bc1Ff93) {
    +++ description: None
      issuedPermissions:
-        [{"permission":"configure","target":"0x4a4962275DF8C60a80d3a25faEc5AA7De116A746","via":[]}]
      receivedPermissions:
-        [{"permission":"configure","target":"0xC845F9C4004EB35a8bde8ad89C4760a9c0e65CAB"},{"permission":"upgrade","target":"0x08Dea366F26C25a08C8D1C3568ad07d1e587136d"},{"permission":"upgrade","target":"0x0e4C4CDd01ceCB01070E9Fdfe7600871e4ae996e"},{"permission":"upgrade","target":"0x1145E7848c8B64c6cab86Fd6D378733385c5C3Ba"},{"permission":"upgrade","target":"0x61E44dC0dae6888B5a301887732217d5725B0bFf"},{"permission":"upgrade","target":"0x6CC3268794c5d3E3d9d52adEfC748B59d536cb22"},{"permission":"upgrade","target":"0x85eA9c11cf3D4786027F7FD08F4406b15777e5f8"}]
      directlyReceivedPermissions:
+        [{"permission":"configure","target":"0xC845F9C4004EB35a8bde8ad89C4760a9c0e65CAB"},{"permission":"upgrade","target":"0x08Dea366F26C25a08C8D1C3568ad07d1e587136d"},{"permission":"upgrade","target":"0x0e4C4CDd01ceCB01070E9Fdfe7600871e4ae996e"},{"permission":"upgrade","target":"0x1145E7848c8B64c6cab86Fd6D378733385c5C3Ba"},{"permission":"upgrade","target":"0x61E44dC0dae6888B5a301887732217d5725B0bFf"},{"permission":"upgrade","target":"0x6CC3268794c5d3E3d9d52adEfC748B59d536cb22"},{"permission":"upgrade","target":"0x85eA9c11cf3D4786027F7FD08F4406b15777e5f8"}]
    }
```

```diff
    contract ConduitMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      descriptions:
-        ["It can act on behalf of 0x35d5D43271548c984662d4879FBc8e041Bc1Ff93, inheriting its permissions."]
      receivedPermissions.6:
+        {"permission":"upgrade","target":"0x85eA9c11cf3D4786027F7FD08F4406b15777e5f8","via":[{"address":"0x35d5D43271548c984662d4879FBc8e041Bc1Ff93"}]}
      receivedPermissions.5:
+        {"permission":"upgrade","target":"0x6CC3268794c5d3E3d9d52adEfC748B59d536cb22","via":[{"address":"0x35d5D43271548c984662d4879FBc8e041Bc1Ff93"}]}
      receivedPermissions.4:
+        {"permission":"upgrade","target":"0x61E44dC0dae6888B5a301887732217d5725B0bFf","via":[{"address":"0x35d5D43271548c984662d4879FBc8e041Bc1Ff93"}]}
      receivedPermissions.3:
+        {"permission":"upgrade","target":"0x1145E7848c8B64c6cab86Fd6D378733385c5C3Ba","via":[{"address":"0x35d5D43271548c984662d4879FBc8e041Bc1Ff93"}]}
      receivedPermissions.2:
+        {"permission":"upgrade","target":"0x0e4C4CDd01ceCB01070E9Fdfe7600871e4ae996e","via":[{"address":"0x35d5D43271548c984662d4879FBc8e041Bc1Ff93"}]}
      receivedPermissions.1:
+        {"permission":"upgrade","target":"0x08Dea366F26C25a08C8D1C3568ad07d1e587136d","via":[{"address":"0x35d5D43271548c984662d4879FBc8e041Bc1Ff93"}]}
      receivedPermissions.0.target:
-        "0x35d5D43271548c984662d4879FBc8e041Bc1Ff93"
+        "0xC845F9C4004EB35a8bde8ad89C4760a9c0e65CAB"
      receivedPermissions.0.via:
+        [{"address":"0x35d5D43271548c984662d4879FBc8e041Bc1Ff93"}]
      directlyReceivedPermissions:
+        [{"permission":"act","target":"0x35d5D43271548c984662d4879FBc8e041Bc1Ff93"}]
    }
```

```diff
    contract L1StandardBridge (0x61E44dC0dae6888B5a301887732217d5725B0bFf) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x35d5D43271548c984662d4879FBc8e041Bc1Ff93"
+        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      issuedPermissions.0.via.0:
+        {"address":"0x35d5D43271548c984662d4879FBc8e041Bc1Ff93","delay":0}
    }
```

```diff
    contract L1ERC721Bridge (0x6CC3268794c5d3E3d9d52adEfC748B59d536cb22) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x35d5D43271548c984662d4879FBc8e041Bc1Ff93"
+        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      issuedPermissions.0.via.0:
+        {"address":"0x35d5D43271548c984662d4879FBc8e041Bc1Ff93","delay":0}
    }
```

```diff
    contract OptimismPortal (0x85eA9c11cf3D4786027F7FD08F4406b15777e5f8) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x35d5D43271548c984662d4879FBc8e041Bc1Ff93"
+        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      issuedPermissions.0.via.0:
+        {"address":"0x35d5D43271548c984662d4879FBc8e041Bc1Ff93","delay":0}
    }
```

```diff
    contract AddressManager (0xC845F9C4004EB35a8bde8ad89C4760a9c0e65CAB) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x35d5D43271548c984662d4879FBc8e041Bc1Ff93"
+        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      issuedPermissions.0.via.0:
+        {"address":"0x35d5D43271548c984662d4879FBc8e041Bc1Ff93","delay":0}
    }
```

Generated with discovered.json: 0x81a42d1e238b9f2a813beeeda213a44faa4e468f

# Diff at Fri, 30 Aug 2024 07:53:32 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@6c1bd1f41fadf5f2cb1c1805b5a2c6138a3ed35a block: 20331900
- current block number: 20331900

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20331900 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x35d5D43271548c984662d4879FBc8e041Bc1Ff93) {
    +++ description: None
      receivedPermissions.6.via:
-        []
      receivedPermissions.5.via:
-        []
      receivedPermissions.4.via:
-        []
      receivedPermissions.3.via:
-        []
      receivedPermissions.2.via:
-        []
      receivedPermissions.1.via:
-        []
      receivedPermissions.0.via:
-        []
    }
```

```diff
    contract ConduitMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: It can act on behalf of 0x35d5D43271548c984662d4879FBc8e041Bc1Ff93, inheriting its permissions.
      receivedPermissions.0.via:
-        []
    }
```

Generated with discovered.json: 0x749870376f0225f1b5484c547380dcda87e11ce6

# Diff at Fri, 23 Aug 2024 09:53:07 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@67597c7d6c810bc726594446890178150240711e block: 20331900
- current block number: 20331900

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20331900 (main branch discovery), not current.

```diff
    contract OptimismMintableERC20Factory (0x08Dea366F26C25a08C8D1C3568ad07d1e587136d) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract SystemConfig (0x0e4C4CDd01ceCB01070E9Fdfe7600871e4ae996e) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract L2OutputOracle (0x1145E7848c8B64c6cab86Fd6D378733385c5C3Ba) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract L1StandardBridge (0x61E44dC0dae6888B5a301887732217d5725B0bFf) {
    +++ description: None
      values.$upgradeCount:
+        0
    }
```

```diff
    contract L1ERC721Bridge (0x6CC3268794c5d3E3d9d52adEfC748B59d536cb22) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract OptimismPortal (0x85eA9c11cf3D4786027F7FD08F4406b15777e5f8) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

Generated with discovered.json: 0x9fd448ab838efb3dd0784aa9eda6406d195424a6

# Diff at Wed, 21 Aug 2024 10:03:52 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@2f6dde3357bf5d79196b6e94f79d853a6c4ec72b block: 20331900
- current block number: 20331900

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20331900 (main branch discovery), not current.

```diff
    contract OptimismMintableERC20Factory (0x08Dea366F26C25a08C8D1C3568ad07d1e587136d) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x35d5D43271548c984662d4879FBc8e041Bc1Ff93","via":[]}]
    }
```

```diff
    contract SystemConfig (0x0e4C4CDd01ceCB01070E9Fdfe7600871e4ae996e) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x35d5D43271548c984662d4879FBc8e041Bc1Ff93","via":[]}]
    }
```

```diff
    contract L2OutputOracle (0x1145E7848c8B64c6cab86Fd6D378733385c5C3Ba) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x35d5D43271548c984662d4879FBc8e041Bc1Ff93","via":[]}]
    }
```

```diff
    contract ProxyAdmin (0x35d5D43271548c984662d4879FBc8e041Bc1Ff93) {
    +++ description: None
      assignedPermissions:
-        {"upgrade":["0x08Dea366F26C25a08C8D1C3568ad07d1e587136d","0x0e4C4CDd01ceCB01070E9Fdfe7600871e4ae996e","0x1145E7848c8B64c6cab86Fd6D378733385c5C3Ba","0x61E44dC0dae6888B5a301887732217d5725B0bFf","0x6CC3268794c5d3E3d9d52adEfC748B59d536cb22","0x85eA9c11cf3D4786027F7FD08F4406b15777e5f8"],"configure":["0xC845F9C4004EB35a8bde8ad89C4760a9c0e65CAB"]}
      issuedPermissions:
+        [{"permission":"configure","target":"0x4a4962275DF8C60a80d3a25faEc5AA7De116A746","via":[]}]
      receivedPermissions:
+        [{"permission":"configure","target":"0xC845F9C4004EB35a8bde8ad89C4760a9c0e65CAB","via":[]},{"permission":"upgrade","target":"0x08Dea366F26C25a08C8D1C3568ad07d1e587136d","via":[]},{"permission":"upgrade","target":"0x0e4C4CDd01ceCB01070E9Fdfe7600871e4ae996e","via":[]},{"permission":"upgrade","target":"0x1145E7848c8B64c6cab86Fd6D378733385c5C3Ba","via":[]},{"permission":"upgrade","target":"0x61E44dC0dae6888B5a301887732217d5725B0bFf","via":[]},{"permission":"upgrade","target":"0x6CC3268794c5d3E3d9d52adEfC748B59d536cb22","via":[]},{"permission":"upgrade","target":"0x85eA9c11cf3D4786027F7FD08F4406b15777e5f8","via":[]}]
    }
```

```diff
    contract ConduitMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: It can act on behalf of 0x35d5D43271548c984662d4879FBc8e041Bc1Ff93, inheriting its permissions.
      assignedPermissions:
-        {"configure":["0x35d5D43271548c984662d4879FBc8e041Bc1Ff93"]}
      receivedPermissions:
+        [{"permission":"configure","target":"0x35d5D43271548c984662d4879FBc8e041Bc1Ff93","via":[]}]
    }
```

```diff
    contract L1StandardBridge (0x61E44dC0dae6888B5a301887732217d5725B0bFf) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x35d5D43271548c984662d4879FBc8e041Bc1Ff93","via":[]}]
    }
```

```diff
    contract L1ERC721Bridge (0x6CC3268794c5d3E3d9d52adEfC748B59d536cb22) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x35d5D43271548c984662d4879FBc8e041Bc1Ff93","via":[]}]
    }
```

```diff
    contract OptimismPortal (0x85eA9c11cf3D4786027F7FD08F4406b15777e5f8) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x35d5D43271548c984662d4879FBc8e041Bc1Ff93","via":[]}]
    }
```

```diff
    contract AddressManager (0xC845F9C4004EB35a8bde8ad89C4760a9c0e65CAB) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"configure","target":"0x35d5D43271548c984662d4879FBc8e041Bc1Ff93","via":[]}]
    }
```

Generated with discovered.json: 0xdfbedb7f8eb83676ac0e4df91ee3e68c94175b64

# Diff at Fri, 09 Aug 2024 12:00:15 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bf40aa32f030fd312056ca0ef198c8550467d1d7 block: 20331900
- current block number: 20331900

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20331900 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x35d5D43271548c984662d4879FBc8e041Bc1Ff93) {
    +++ description: None
      assignedPermissions.upgrade.5:
-        "0x0e4C4CDd01ceCB01070E9Fdfe7600871e4ae996e"
+        "0x85eA9c11cf3D4786027F7FD08F4406b15777e5f8"
      assignedPermissions.upgrade.4:
-        "0x1145E7848c8B64c6cab86Fd6D378733385c5C3Ba"
+        "0x6CC3268794c5d3E3d9d52adEfC748B59d536cb22"
      assignedPermissions.upgrade.3:
-        "0x85eA9c11cf3D4786027F7FD08F4406b15777e5f8"
+        "0x61E44dC0dae6888B5a301887732217d5725B0bFf"
      assignedPermissions.upgrade.2:
-        "0x61E44dC0dae6888B5a301887732217d5725B0bFf"
+        "0x1145E7848c8B64c6cab86Fd6D378733385c5C3Ba"
      assignedPermissions.upgrade.1:
-        "0x6CC3268794c5d3E3d9d52adEfC748B59d536cb22"
+        "0x0e4C4CDd01ceCB01070E9Fdfe7600871e4ae996e"
    }
```

Generated with discovered.json: 0xf222c3f8e360f3af5a7ea224dbe7155df463f756

# Diff at Fri, 09 Aug 2024 10:10:22 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f0da1d0aab7bc6b3b5e54e7e93480bd98e57035 block: 20331900
- current block number: 20331900

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20331900 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x35d5D43271548c984662d4879FBc8e041Bc1Ff93) {
    +++ description: None
      assignedPermissions.admin:
-        ["0x08Dea366F26C25a08C8D1C3568ad07d1e587136d","0x0e4C4CDd01ceCB01070E9Fdfe7600871e4ae996e","0x1145E7848c8B64c6cab86Fd6D378733385c5C3Ba","0x61E44dC0dae6888B5a301887732217d5725B0bFf","0x6CC3268794c5d3E3d9d52adEfC748B59d536cb22","0x85eA9c11cf3D4786027F7FD08F4406b15777e5f8"]
      assignedPermissions.owner:
-        ["0xC845F9C4004EB35a8bde8ad89C4760a9c0e65CAB"]
      assignedPermissions.upgrade:
+        ["0x08Dea366F26C25a08C8D1C3568ad07d1e587136d","0x6CC3268794c5d3E3d9d52adEfC748B59d536cb22","0x61E44dC0dae6888B5a301887732217d5725B0bFf","0x85eA9c11cf3D4786027F7FD08F4406b15777e5f8","0x1145E7848c8B64c6cab86Fd6D378733385c5C3Ba","0x0e4C4CDd01ceCB01070E9Fdfe7600871e4ae996e"]
      assignedPermissions.configure:
+        ["0xC845F9C4004EB35a8bde8ad89C4760a9c0e65CAB"]
    }
```

```diff
    contract ConduitMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: It can act on behalf of 0x35d5D43271548c984662d4879FBc8e041Bc1Ff93, inheriting its permissions.
      assignedPermissions.owner:
-        ["0x35d5D43271548c984662d4879FBc8e041Bc1Ff93"]
      assignedPermissions.configure:
+        ["0x35d5D43271548c984662d4879FBc8e041Bc1Ff93"]
      values.$multisigThreshold:
-        "4 of 7 (57%)"
      values.getOwners:
-        ["0xF3313C48BD8E17b823d5498D62F37019dFEA647D","0xF0B77EaE7F2dabCC2571c7418406A0dCA3afA4f0","0xa4000bDD2bB92ce6750b31F1eeda47Bd1cB8e6e4","0x3840f487A17A41100DD1Bf0946c34f132a57Fd5f","0xa0C600a6e85bf225958FFAcC70B5FDDF9A059038","0xefCf0c8faFB425997870f845e26fC6cA6EE6dD5C","0x4D8007a0E9f293e62E2b0F43C6Cf4C4B9e135BAe"]
      values.getThreshold:
-        4
      values.$members:
+        ["0xF3313C48BD8E17b823d5498D62F37019dFEA647D","0xF0B77EaE7F2dabCC2571c7418406A0dCA3afA4f0","0xa4000bDD2bB92ce6750b31F1eeda47Bd1cB8e6e4","0x3840f487A17A41100DD1Bf0946c34f132a57Fd5f","0xa0C600a6e85bf225958FFAcC70B5FDDF9A059038","0xefCf0c8faFB425997870f845e26fC6cA6EE6dD5C","0x4D8007a0E9f293e62E2b0F43C6Cf4C4B9e135BAe"]
      values.$threshold:
+        4
      values.multisigThreshold:
+        "4 of 7 (57%)"
    }
```

```diff
    contract ChallengerMultisig (0x91F4be0C264FAFA1fEd75c4440910Cba2cAd98e8) {
    +++ description: None
      values.$multisigThreshold:
-        "4 of 6 (67%)"
      values.getOwners:
-        ["0xdb5CF90A8f97C372d5AEC650a5668d4E4bECFC10","0x824CACbBeA0377801f72d736CFd5C869dd89b931","0x52E84149daE06CB5C4E92029140Da4faD86CE968","0x3840f487A17A41100DD1Bf0946c34f132a57Fd5f","0xa0C600a6e85bf225958FFAcC70B5FDDF9A059038","0xefCf0c8faFB425997870f845e26fC6cA6EE6dD5C"]
      values.getThreshold:
-        4
      values.$members:
+        ["0xdb5CF90A8f97C372d5AEC650a5668d4E4bECFC10","0x824CACbBeA0377801f72d736CFd5C869dd89b931","0x52E84149daE06CB5C4E92029140Da4faD86CE968","0x3840f487A17A41100DD1Bf0946c34f132a57Fd5f","0xa0C600a6e85bf225958FFAcC70B5FDDF9A059038","0xefCf0c8faFB425997870f845e26fC6cA6EE6dD5C"]
      values.$threshold:
+        4
      values.multisigThreshold:
+        "4 of 6 (67%)"
    }
```

Generated with discovered.json: 0x823df2d38ee05218e577638bf8aebb0cfc3be7c8

# Diff at Thu, 18 Jul 2024 10:31:44 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@d89fe52cb65d643cef712d1d7910564a7acf2dce block: 20331900
- current block number: 20331900

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20331900 (main branch discovery), not current.

```diff
    contract ConduitMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      descriptions:
+        ["It can act on behalf of 0x35d5D43271548c984662d4879FBc8e041Bc1Ff93, inheriting its permissions."]
    }
```

Generated with discovered.json: 0xea71ccb52a7fbc8dc15a42c895b9a0c73ce801e5

# Diff at Thu, 18 Jul 2024 07:25:30 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@14a8b2e13da16d68d776511f98207e5360accba3 block: 19927699
- current block number: 20331900

## Description

Lyra bumps gas limit by 4x to 120M. This is in the ballpark of what base is also running.

## Watched changes

```diff
    contract SystemConfig (0x0e4C4CDd01ceCB01070E9Fdfe7600871e4ae996e) {
    +++ description: None
      values.gasLimit:
-        30000000
+        120000000
    }
```

Generated with discovered.json: 0x0eea8969d66cf8d703d845a3102f84b758742fa1

# Diff at Wed, 22 May 2024 20:07:21 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@bac4efad06804152ae97853892e122a801bbc509 block: 19918742
- current block number: 19927699

## Description

ConduitMultisig update.

## Watched changes

```diff
    contract ConduitMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      upgradeability.threshold:
-        "3 of 5 (60%)"
+        "4 of 7 (57%)"
      values.getOwners.6:
+        "0x4D8007a0E9f293e62E2b0F43C6Cf4C4B9e135BAe"
      values.getOwners.5:
+        "0xefCf0c8faFB425997870f845e26fC6cA6EE6dD5C"
      values.getOwners.4:
-        "0x4D8007a0E9f293e62E2b0F43C6Cf4C4B9e135BAe"
+        "0xa0C600a6e85bf225958FFAcC70B5FDDF9A059038"
      values.getOwners.3:
-        "0xefCf0c8faFB425997870f845e26fC6cA6EE6dD5C"
+        "0x3840f487A17A41100DD1Bf0946c34f132a57Fd5f"
      values.getOwners.2:
-        "0xa0C600a6e85bf225958FFAcC70B5FDDF9A059038"
+        "0xa4000bDD2bB92ce6750b31F1eeda47Bd1cB8e6e4"
      values.getOwners.1:
-        "0x3840f487A17A41100DD1Bf0946c34f132a57Fd5f"
+        "0xF0B77EaE7F2dabCC2571c7418406A0dCA3afA4f0"
      values.getOwners.0:
-        "0xa4000bDD2bB92ce6750b31F1eeda47Bd1cB8e6e4"
+        "0xF3313C48BD8E17b823d5498D62F37019dFEA647D"
      values.getThreshold:
-        3
+        4
    }
```

Generated with discovered.json: 0xb37e4ebb45bc5eac603646bd455d4891ca8d5069

# Diff at Tue, 21 May 2024 14:01:11 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@c032520e456d0e6bee8b65e420ff7dba9f36bd48 block: 19531962
- current block number: 19918742

## Description

Name change.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19531962 (main branch discovery), not current.

```diff
    contract LyraMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      name:
-        "LyraMultisig"
+        "ConduitMultisig"
    }
```

Generated with discovered.json: 0x07856a84aab1e3a9f52fa26b7cf05e154e094e4d

# Diff at Thu, 28 Mar 2024 10:17:32 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@dd32bb06b292cc8459fb09925454ee3a90f5c27e block: 19488865
- current block number: 19531962

## Description

Update discovery to include the multisig threshold.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19488865 (main branch discovery), not current.

```diff
    contract LyraMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      upgradeability.threshold:
+        "3 of 5 (60%)"
    }
```

```diff
    contract ChallengerMultisig (0x91F4be0C264FAFA1fEd75c4440910Cba2cAd98e8) {
    +++ description: None
      upgradeability.threshold:
+        "4 of 6 (67%)"
    }
```

Generated with discovered.json: 0x483b8b606b6d775399f6b2056e464f7b45b6ef3a

# Diff at Mon, 11 Mar 2024 13:04:46 GMT:

- author: Michał Sobieraj-Jakubiec (<michalsidzej@gmail.com>)
- comparing to: main@64454506aee2b4b4e15b121f096369e92ec4cf20 block: 19176784
- current block number: 19412035

## Description

Update OP stack DA handler

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19176784 (main branch discovery), not current.

```diff
    contract SystemConfig (0x0e4C4CDd01ceCB01070E9Fdfe7600871e4ae996e) {
    +++ description: None
      values.opStackDA.isSequencerSendingBlobTx:
+        false
    }
```

Generated with discovered.json: 0xe094838366e0c9e35830fe03bd7405a15ba56cab

# Diff at Wed, 07 Feb 2024 14:03:33 GMT:

- author: Michał Sobieraj-Jakubiec (<michalsidzej@gmail.com>)
- comparing to: main@2e35800e01005d93332a552032058dcd67f3631d block: 19175190
- current block number: 19176784

## Description

Added opStackSequencerInbox handler

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19175190 (main branch discovery), not current.

```diff
    contract SystemConfig (0x0e4C4CDd01ceCB01070E9Fdfe7600871e4ae996e) {
      values.sequencerInbox:
+        "0x5f7f7f6DB967F0ef10BdA0678964DBA185d16c50"
    }
```

Generated with discovered.json: 0x0f77399b9256ea1e65b40583d3103421cce8b78e

# Diff at Wed, 07 Feb 2024 08:41:30 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@64f1e0f27f831d3ef860a1c2faad8c77e04e6c29 block: 19090320
- current block number: 19175190

## Description

Updated with the new OpDAHandler to remove the field.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19090320 (main branch discovery), not current.

```diff
    contract SystemConfig (0x0e4C4CDd01ceCB01070E9Fdfe7600871e4ae996e) {
      values.opStackDA.isAllTxsLengthEqualToCelestiaDAExample:
-        true
    }
```

Generated with discovered.json: 0x4503a45a15552e2f0c5fac881fdbb0f026d5f650

# Diff at Fri, 26 Jan 2024 10:56:14 GMT:

- author: Michał Sobieraj-Jakubiec (<michalsidzej@gmail.com>)
- comparing to: main@bb037f7100968a00265a4787338e51ca81aafe9b block: 19032828
- current block number: 19090320

## Description

Added opStackDa handler

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19032828 (main branch discovery), not current.

```diff
    contract SystemConfig (0x0e4C4CDd01ceCB01070E9Fdfe7600871e4ae996e) {
      values.opStackDA:
+        {"isAllTxsLengthEqualToCelestiaDAExample":true,"isSomeTxsLengthEqualToCelestiaDAExample":true}
    }
```

Generated with discovered.json: 0xf25c1536731bdb55d1cbfab87638b709e4c1b961

# Diff at Thu, 18 Jan 2024 09:23:11 GMT:

- author: Michał Podsiadły (<michal.podsiadly@l2beat.com>)
- comparing to: main@0cb1eb82b45ad89a272a3c1b8f8f24ae020627cc block: 18927731
- current block number: 19032828

## Description

Dynamic fee overhead has been changed.

## Watched changes

```diff
    contract SystemConfig (0x0e4C4CDd01ceCB01070E9Fdfe7600871e4ae996e) {
      values.scalar:
-        684000
+        68400
    }
```

# Diff at Wed, 03 Jan 2024 15:30:59 GMT:

- author: Radina Talanova (<nt.radina@gmail.com>)
- comparing to: main@e8eb03b39061a86a8ec01e26d970e40d080ad225

## Description

One owner is removed and another is added to LyraMultisig.

## Watched changes

```diff
    contract LyraMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
      values.getOwners.4:
-        "0x5553a23a71Bc7985c8E58Ca08072D2Fa9D1D1F4c"
+        "0x4D8007a0E9f293e62E2b0F43C6Cf4C4B9e135BAe"
      values.getOwners.3:
-        "0x4D8007a0E9f293e62E2b0F43C6Cf4C4B9e135BAe"
+        "0xefCf0c8faFB425997870f845e26fC6cA6EE6dD5C"
      values.getOwners.2:
-        "0xefCf0c8faFB425997870f845e26fC6cA6EE6dD5C"
+        "0xa0C600a6e85bf225958FFAcC70B5FDDF9A059038"
      values.getOwners.1:
-        "0xa0C600a6e85bf225958FFAcC70B5FDDF9A059038"
+        "0x3840f487A17A41100DD1Bf0946c34f132a57Fd5f"
      values.getOwners.0:
-        "0x3840f487A17A41100DD1Bf0946c34f132a57Fd5f"
+        "0xa4000bDD2bB92ce6750b31F1eeda47Bd1cB8e6e4"
    }
```

# Diff at Tue, 19 Dec 2023 08:25:57 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@

## Description

Add initial config for Lyra.

## Watched changes

```diff
+   Status: CREATED
    contract OptimismMintableERC20Factory (0x08Dea366F26C25a08C8D1C3568ad07d1e587136d) {
    }
```

```diff
+   Status: CREATED
    contract SystemConfig (0x0e4C4CDd01ceCB01070E9Fdfe7600871e4ae996e) {
    }
```

```diff
+   Status: CREATED
    contract L2OutputOracle (0x1145E7848c8B64c6cab86Fd6D378733385c5C3Ba) {
    }
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x35d5D43271548c984662d4879FBc8e041Bc1Ff93) {
    }
```

```diff
+   Status: CREATED
    contract LyraMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    }
```

```diff
+   Status: CREATED
    contract L1CrossDomainMessenger (0x5456f02c08e9A018E42C39b351328E5AA864174A) {
    }
```

```diff
+   Status: CREATED
    contract L1StandardBridge (0x61E44dC0dae6888B5a301887732217d5725B0bFf) {
    }
```

```diff
+   Status: CREATED
    contract L1ERC721Bridge (0x6CC3268794c5d3E3d9d52adEfC748B59d536cb22) {
    }
```

```diff
+   Status: CREATED
    contract OptimismPortal (0x85eA9c11cf3D4786027F7FD08F4406b15777e5f8) {
    }
```

```diff
+   Status: CREATED
    contract ChallengerMultisig (0x91F4be0C264FAFA1fEd75c4440910Cba2cAd98e8) {
    }
```

```diff
+   Status: CREATED
    contract AddressManager (0xC845F9C4004EB35a8bde8ad89C4760a9c0e65CAB) {
    }
```
