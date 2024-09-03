Generated with discovered.json: 0x3f448a1004da8a7e85c2c937082324d3b3d48b0c

# Diff at Fri, 30 Aug 2024 07:54:16 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@6c1bd1f41fadf5f2cb1c1805b5a2c6138a3ed35a block: 20427351
- current block number: 20427351

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20427351 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x161aF05fA6BdA1c6E7Ee12839d470931bA796948) {
    +++ description: It can upgrade the bridge implementation potentially gaining access to all funds, and change any system component.
      receivedPermissions.7.via:
-        []
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
    contract Optopia Multisig (0x2C73A1610EE822a8C2C21eddd455e725A3334c8C) {
    +++ description: It can act on behalf of 0x161aF05fA6BdA1c6E7Ee12839d470931bA796948, inheriting its permissions.
      receivedPermissions.0.via:
-        []
    }
```

Generated with discovered.json: 0x6f69afbe929e4922a1daebdd08d10f96692d349f

# Diff at Fri, 23 Aug 2024 09:53:53 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@67597c7d6c810bc726594446890178150240711e block: 20427351
- current block number: 20427351

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20427351 (main branch discovery), not current.

```diff
    contract L1StandardBridge (0x1adE86B9cc8a50Db747b7aaC32E8527d42c71fC1) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token.
      values.$upgradeCount:
+        0
    }
```

```diff
    contract OptimismPortal (0x39A90926306E11497EC5FE1C459910258B620edD) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      values.$upgradeCount:
+        5
    }
```

```diff
    contract SuperchainConfig (0x5e8d351FD046Aa0b3DDA24096751996C0c397C61) {
    +++ description: Used to manage global configuration values for multiple OP Chains within a single Superchain network. The SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the Superchain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      values.$upgradeCount:
+        1
    }
```

```diff
    contract SystemConfig (0x94118F86eE37Fa4Fdb266CDab1e55B8F0D6959D9) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      values.$upgradeCount:
+        1
    }
```

```diff
    contract L1ERC721Bridge (0xAFc9946b25e3e93208b7E2D477680C5B6e2952be) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      values.$upgradeCount:
+        1
    }
```

```diff
    contract  (0xB77d3ea899ef38c464e19F5A6CBc5a37187DC43c) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract L2OutputOracle (0xdd80E05004f40815EaEf12ffeE69c2a8A5112aA5) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      values.$upgradeCount:
+        1
    }
```

Generated with discovered.json: 0xc841c07a00b94e5eeb64d917f521e11a54d87d69

# Diff at Wed, 21 Aug 2024 10:04:42 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@2f6dde3357bf5d79196b6e94f79d853a6c4ec72b block: 20427351
- current block number: 20427351

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20427351 (main branch discovery), not current.

```diff
    contract AddressManager (0x039A3B4AF85A91626f428b8B881603b6DD1f6C4C) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"configure","target":"0x161aF05fA6BdA1c6E7Ee12839d470931bA796948","via":[]}]
    }
```

```diff
    contract ProxyAdmin (0x161aF05fA6BdA1c6E7Ee12839d470931bA796948) {
    +++ description: It can upgrade the bridge implementation potentially gaining access to all funds, and change any system component.
      assignedPermissions:
-        {"upgrade":["0x1adE86B9cc8a50Db747b7aaC32E8527d42c71fC1","0x39A90926306E11497EC5FE1C459910258B620edD","0x5e8d351FD046Aa0b3DDA24096751996C0c397C61","0x94118F86eE37Fa4Fdb266CDab1e55B8F0D6959D9","0xAFc9946b25e3e93208b7E2D477680C5B6e2952be","0xB77d3ea899ef38c464e19F5A6CBc5a37187DC43c","0xdd80E05004f40815EaEf12ffeE69c2a8A5112aA5"],"configure":["0x039A3B4AF85A91626f428b8B881603b6DD1f6C4C"]}
      issuedPermissions:
+        [{"permission":"configure","target":"0x2C73A1610EE822a8C2C21eddd455e725A3334c8C","via":[]}]
      receivedPermissions:
+        [{"permission":"configure","target":"0x039A3B4AF85A91626f428b8B881603b6DD1f6C4C","via":[]},{"permission":"upgrade","target":"0x1adE86B9cc8a50Db747b7aaC32E8527d42c71fC1","via":[]},{"permission":"upgrade","target":"0x39A90926306E11497EC5FE1C459910258B620edD","via":[]},{"permission":"upgrade","target":"0x5e8d351FD046Aa0b3DDA24096751996C0c397C61","via":[]},{"permission":"upgrade","target":"0x94118F86eE37Fa4Fdb266CDab1e55B8F0D6959D9","via":[]},{"permission":"upgrade","target":"0xAFc9946b25e3e93208b7E2D477680C5B6e2952be","via":[]},{"permission":"upgrade","target":"0xB77d3ea899ef38c464e19F5A6CBc5a37187DC43c","via":[]},{"permission":"upgrade","target":"0xdd80E05004f40815EaEf12ffeE69c2a8A5112aA5","via":[]}]
    }
```

```diff
    contract L1StandardBridge (0x1adE86B9cc8a50Db747b7aaC32E8527d42c71fC1) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token.
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x161aF05fA6BdA1c6E7Ee12839d470931bA796948","via":[]}]
    }
```

```diff
    contract Optopia Multisig (0x2C73A1610EE822a8C2C21eddd455e725A3334c8C) {
    +++ description: It can act on behalf of 0x161aF05fA6BdA1c6E7Ee12839d470931bA796948, inheriting its permissions.
      assignedPermissions:
-        {"configure":["0x161aF05fA6BdA1c6E7Ee12839d470931bA796948"]}
      receivedPermissions:
+        [{"permission":"configure","target":"0x161aF05fA6BdA1c6E7Ee12839d470931bA796948","via":[]}]
    }
```

```diff
    contract OptimismPortal (0x39A90926306E11497EC5FE1C459910258B620edD) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x161aF05fA6BdA1c6E7Ee12839d470931bA796948","via":[]}]
    }
```

```diff
    contract SuperchainConfig (0x5e8d351FD046Aa0b3DDA24096751996C0c397C61) {
    +++ description: Used to manage global configuration values for multiple OP Chains within a single Superchain network. The SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the Superchain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x161aF05fA6BdA1c6E7Ee12839d470931bA796948","via":[]}]
    }
```

```diff
    contract SystemConfig (0x94118F86eE37Fa4Fdb266CDab1e55B8F0D6959D9) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      issuedPermissions:
+        [{"permission":"configure","target":"0xd01De08Cc118Cc1a1b39c54c8b4ff02A8ADE63eE","via":[]},{"permission":"upgrade","target":"0x161aF05fA6BdA1c6E7Ee12839d470931bA796948","via":[]}]
    }
```

```diff
    contract L1ERC721Bridge (0xAFc9946b25e3e93208b7E2D477680C5B6e2952be) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x161aF05fA6BdA1c6E7Ee12839d470931bA796948","via":[]}]
    }
```

```diff
    contract  (0xB77d3ea899ef38c464e19F5A6CBc5a37187DC43c) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x161aF05fA6BdA1c6E7Ee12839d470931bA796948","via":[]}]
    }
```

```diff
    contract L2OutputOracle (0xdd80E05004f40815EaEf12ffeE69c2a8A5112aA5) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x161aF05fA6BdA1c6E7Ee12839d470931bA796948","via":[]}]
    }
```

Generated with discovered.json: 0x13c87f5e742ef7b13b3fd84548ba0e227dea1bc0

# Diff at Fri, 09 Aug 2024 12:01:02 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bf40aa32f030fd312056ca0ef198c8550467d1d7 block: 20427351
- current block number: 20427351

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20427351 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x161aF05fA6BdA1c6E7Ee12839d470931bA796948) {
    +++ description: It can upgrade the bridge implementation potentially gaining access to all funds, and change any system component.
      assignedPermissions.upgrade.6:
-        "0xB77d3ea899ef38c464e19F5A6CBc5a37187DC43c"
+        "0xdd80E05004f40815EaEf12ffeE69c2a8A5112aA5"
      assignedPermissions.upgrade.5:
-        "0xAFc9946b25e3e93208b7E2D477680C5B6e2952be"
+        "0xB77d3ea899ef38c464e19F5A6CBc5a37187DC43c"
      assignedPermissions.upgrade.4:
-        "0x94118F86eE37Fa4Fdb266CDab1e55B8F0D6959D9"
+        "0xAFc9946b25e3e93208b7E2D477680C5B6e2952be"
      assignedPermissions.upgrade.3:
-        "0xdd80E05004f40815EaEf12ffeE69c2a8A5112aA5"
+        "0x94118F86eE37Fa4Fdb266CDab1e55B8F0D6959D9"
      assignedPermissions.upgrade.2:
-        "0x39A90926306E11497EC5FE1C459910258B620edD"
+        "0x5e8d351FD046Aa0b3DDA24096751996C0c397C61"
      assignedPermissions.upgrade.1:
-        "0x5e8d351FD046Aa0b3DDA24096751996C0c397C61"
+        "0x39A90926306E11497EC5FE1C459910258B620edD"
    }
```

Generated with discovered.json: 0xf5a0937c9179cbd4a83ed83ac1fe9eae6e56a737

# Diff at Fri, 09 Aug 2024 10:11:06 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f0da1d0aab7bc6b3b5e54e7e93480bd98e57035 block: 20427351
- current block number: 20427351

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20427351 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x161aF05fA6BdA1c6E7Ee12839d470931bA796948) {
    +++ description: It can upgrade the bridge implementation potentially gaining access to all funds, and change any system component.
      assignedPermissions.admin:
-        ["0x1adE86B9cc8a50Db747b7aaC32E8527d42c71fC1","0x39A90926306E11497EC5FE1C459910258B620edD","0x5e8d351FD046Aa0b3DDA24096751996C0c397C61","0x94118F86eE37Fa4Fdb266CDab1e55B8F0D6959D9","0xAFc9946b25e3e93208b7E2D477680C5B6e2952be","0xB77d3ea899ef38c464e19F5A6CBc5a37187DC43c","0xdd80E05004f40815EaEf12ffeE69c2a8A5112aA5"]
      assignedPermissions.owner:
-        ["0x039A3B4AF85A91626f428b8B881603b6DD1f6C4C"]
      assignedPermissions.upgrade:
+        ["0x1adE86B9cc8a50Db747b7aaC32E8527d42c71fC1","0x5e8d351FD046Aa0b3DDA24096751996C0c397C61","0x39A90926306E11497EC5FE1C459910258B620edD","0xdd80E05004f40815EaEf12ffeE69c2a8A5112aA5","0x94118F86eE37Fa4Fdb266CDab1e55B8F0D6959D9","0xAFc9946b25e3e93208b7E2D477680C5B6e2952be","0xB77d3ea899ef38c464e19F5A6CBc5a37187DC43c"]
      assignedPermissions.configure:
+        ["0x039A3B4AF85A91626f428b8B881603b6DD1f6C4C"]
    }
```

```diff
    contract Optopia Multisig (0x2C73A1610EE822a8C2C21eddd455e725A3334c8C) {
    +++ description: It can act on behalf of 0x161aF05fA6BdA1c6E7Ee12839d470931bA796948, inheriting its permissions.
      assignedPermissions.owner:
-        ["0x161aF05fA6BdA1c6E7Ee12839d470931bA796948"]
      assignedPermissions.configure:
+        ["0x161aF05fA6BdA1c6E7Ee12839d470931bA796948"]
      values.$multisigThreshold:
-        "2 of 3 (67%)"
      values.getOwners:
-        ["0xb6130283Ed292E3f42465617d6d8FFd61F615462","0xe30FD2f41326d500f5071440546643d9A7926e63","0xd01De08Cc118Cc1a1b39c54c8b4ff02A8ADE63eE"]
      values.getThreshold:
-        2
      values.$members:
+        ["0xb6130283Ed292E3f42465617d6d8FFd61F615462","0xe30FD2f41326d500f5071440546643d9A7926e63","0xd01De08Cc118Cc1a1b39c54c8b4ff02A8ADE63eE"]
      values.$threshold:
+        2
      values.multisigThreshold:
+        "2 of 3 (67%)"
    }
```

Generated with discovered.json: 0x207f322d908c7a5b5b1951e19c4120f60fa25e00

# Diff at Wed, 31 Jul 2024 15:12:47 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- current block number: 20427351

## Description

Initial discovery: OP stack rollup with superchain fork.

## Initial discovery

```diff
+   Status: CREATED
    contract AddressManager (0x039A3B4AF85A91626f428b8B881603b6DD1f6C4C)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1CrossDomainMessenger (0x03D5bc58E7b7E13ba785F67AFA2d2fC49cB2BdF3)
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x161aF05fA6BdA1c6E7Ee12839d470931bA796948)
    +++ description: It can upgrade the bridge implementation potentially gaining access to all funds, and change any system component.
```

```diff
+   Status: CREATED
    contract L1StandardBridge (0x1adE86B9cc8a50Db747b7aaC32E8527d42c71fC1)
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token.
```

```diff
+   Status: CREATED
    contract Optopia Multisig (0x2C73A1610EE822a8C2C21eddd455e725A3334c8C)
    +++ description: It can act on behalf of 0x161aF05fA6BdA1c6E7Ee12839d470931bA796948, inheriting its permissions.
```

```diff
+   Status: CREATED
    contract OptimismPortal (0x39A90926306E11497EC5FE1C459910258B620edD)
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
```

```diff
+   Status: CREATED
    contract SuperchainConfig (0x5e8d351FD046Aa0b3DDA24096751996C0c397C61)
    +++ description: Used to manage global configuration values for multiple OP Chains within a single Superchain network. The SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the Superchain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
```

```diff
+   Status: CREATED
    contract SystemConfig (0x94118F86eE37Fa4Fdb266CDab1e55B8F0D6959D9)
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
```

```diff
+   Status: CREATED
    contract L1ERC721Bridge (0xAFc9946b25e3e93208b7E2D477680C5B6e2952be)
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
```

```diff
+   Status: CREATED
    contract  (0xB77d3ea899ef38c464e19F5A6CBc5a37187DC43c)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L2OutputOracle (0xdd80E05004f40815EaEf12ffeE69c2a8A5112aA5)
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
```
