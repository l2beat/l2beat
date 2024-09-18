Generated with discovered.json: 0x7b529538fe6fe3ac17e184b0ee43c258f87a8f9a

# Diff at Wed, 18 Sep 2024 07:17:22 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@14c205b8c5ed432f46bca9d694386b839078e6ea block: 20389626
- current block number: 20775932

## Description

Shape related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20389626 (main branch discovery), not current.

```diff
    contract ConduitMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      receivedPermissions.6:
+        {"permission":"upgrade","target":"0xe07eA0436100918F157DF35D01dCE5c11b16D1F1","description":"upgrading bridge implementation allows to access all funds and change every system component.","via":[{"address":"0xb570F4aD27e7De879A2E4F2F3DE27dBaBc20E9B9"}]}
      receivedPermissions.5.target:
-        "0xe07eA0436100918F157DF35D01dCE5c11b16D1F1"
+        "0x934Ab59Ef14b638653b1C0FEf7aB9a72186393DC"
      receivedPermissions.4.target:
-        "0x934Ab59Ef14b638653b1C0FEf7aB9a72186393DC"
+        "0x91493a61ab83b62943E6dCAa5475Dd330704Cc84"
      receivedPermissions.3.target:
-        "0x91493a61ab83b62943E6dCAa5475Dd330704Cc84"
+        "0x886B187C3D293B1449A3A0F23Ca9e2269E0f2664"
      receivedPermissions.2.target:
-        "0x886B187C3D293B1449A3A0F23Ca9e2269E0f2664"
+        "0x5e76821C3c1AbB9fD6E310224804556C61D860e0"
      receivedPermissions.1.permission:
-        "upgrade"
+        "configure"
      receivedPermissions.1.target:
-        "0x5e76821C3c1AbB9fD6E310224804556C61D860e0"
+        "0x886B187C3D293B1449A3A0F23Ca9e2269E0f2664"
      receivedPermissions.1.via:
-        [{"address":"0xb570F4aD27e7De879A2E4F2F3DE27dBaBc20E9B9"}]
      receivedPermissions.1.description:
+        "it can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system."
    }
```

```diff
    contract L2OutputOracle (0x5e76821C3c1AbB9fD6E310224804556C61D860e0) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      template:
+        "opstack/L2OutputOracle"
      descriptions:
+        ["Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots."]
    }
```

```diff
    contract SystemConfig (0x886B187C3D293B1449A3A0F23Ca9e2269E0f2664) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      issuedPermissions.1:
+        {"permission":"upgrade","target":"0x4a4962275DF8C60a80d3a25faEc5AA7De116A746","via":[{"address":"0xb570F4aD27e7De879A2E4F2F3DE27dBaBc20E9B9","delay":0}]}
      issuedPermissions.0.permission:
-        "upgrade"
+        "configure"
      issuedPermissions.0.via.0:
-        {"address":"0xb570F4aD27e7De879A2E4F2F3DE27dBaBc20E9B9","delay":0}
      fieldMeta.gasLimit:
+        {"severity":"LOW","description":"Gas limit for blocks on L2."}
      template:
+        "opstack/SystemConfig"
      descriptions:
+        ["Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address."]
    }
```

```diff
    contract OptimismPortal (0x91493a61ab83b62943E6dCAa5475Dd330704Cc84) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      template:
+        "opstack/OptimismPortal"
      descriptions:
+        ["The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals."]
    }
```

```diff
    contract L1ERC721Bridge (0x934Ab59Ef14b638653b1C0FEf7aB9a72186393DC) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      template:
+        "opstack/L1ERC721Bridge"
      descriptions:
+        ["Used to bridge ERC-721 tokens from host chain to this chain."]
    }
```

```diff
    contract ProxyAdmin (0xb570F4aD27e7De879A2E4F2F3DE27dBaBc20E9B9) {
    +++ description: None
      directlyReceivedPermissions.5.description:
+        "upgrading bridge implementation allows to access all funds and change every system component."
    }
```

```diff
    contract L1CrossDomainMessenger (0xc76543A64666d9a073FaEF4e75F651c88e7DBC08) {
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
    contract ChallengerMultisig (0xcE10372313Ca39Fbf75A09e7f4c0E57F070259f4) {
    +++ description: None
      roles:
+        ["Challenger","Guardian"]
    }
```

```diff
    contract L1StandardBridge (0xe07eA0436100918F157DF35D01dCE5c11b16D1F1) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token.
      issuedPermissions.0.via.0.description:
+        "upgrading bridge implementation allows to access all funds and change every system component."
      template:
+        "opstack/L1StandardBridge"
      descriptions:
+        ["The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token."]
    }
```

Generated with discovered.json: 0x3e7c965c6264d54c688e01f8ba4dd0f5e60c8c14

# Diff at Sun, 08 Sep 2024 17:19:25 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@fd881462cca0d7ef4519f907f3c6cfd5fe1cde8f block: 20389626
- current block number: 20389626

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20389626 (main branch discovery), not current.

```diff
    contract ConduitMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      descriptions:
-        ["It can act on behalf of 0xb570F4aD27e7De879A2E4F2F3DE27dBaBc20E9B9, inheriting its permissions."]
      receivedPermissions.5:
+        {"permission":"upgrade","target":"0xe07eA0436100918F157DF35D01dCE5c11b16D1F1","via":[{"address":"0xb570F4aD27e7De879A2E4F2F3DE27dBaBc20E9B9"}]}
      receivedPermissions.4:
+        {"permission":"upgrade","target":"0x934Ab59Ef14b638653b1C0FEf7aB9a72186393DC","via":[{"address":"0xb570F4aD27e7De879A2E4F2F3DE27dBaBc20E9B9"}]}
      receivedPermissions.3:
+        {"permission":"upgrade","target":"0x91493a61ab83b62943E6dCAa5475Dd330704Cc84","via":[{"address":"0xb570F4aD27e7De879A2E4F2F3DE27dBaBc20E9B9"}]}
      receivedPermissions.2:
+        {"permission":"upgrade","target":"0x886B187C3D293B1449A3A0F23Ca9e2269E0f2664","via":[{"address":"0xb570F4aD27e7De879A2E4F2F3DE27dBaBc20E9B9"}]}
      receivedPermissions.1:
+        {"permission":"upgrade","target":"0x5e76821C3c1AbB9fD6E310224804556C61D860e0","via":[{"address":"0xb570F4aD27e7De879A2E4F2F3DE27dBaBc20E9B9"}]}
      receivedPermissions.0.target:
-        "0xb570F4aD27e7De879A2E4F2F3DE27dBaBc20E9B9"
+        "0x87630a802a3789463eC4b00f89b27b1e9f6b92e9"
      receivedPermissions.0.via:
+        [{"address":"0xb570F4aD27e7De879A2E4F2F3DE27dBaBc20E9B9"}]
      directlyReceivedPermissions:
+        [{"permission":"act","target":"0xb570F4aD27e7De879A2E4F2F3DE27dBaBc20E9B9"}]
    }
```

```diff
    contract L2OutputOracle (0x5e76821C3c1AbB9fD6E310224804556C61D860e0) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xb570F4aD27e7De879A2E4F2F3DE27dBaBc20E9B9"
+        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      issuedPermissions.0.via.0:
+        {"address":"0xb570F4aD27e7De879A2E4F2F3DE27dBaBc20E9B9","delay":0}
    }
```

```diff
    contract AddressManager (0x87630a802a3789463eC4b00f89b27b1e9f6b92e9) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xb570F4aD27e7De879A2E4F2F3DE27dBaBc20E9B9"
+        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      issuedPermissions.0.via.0:
+        {"address":"0xb570F4aD27e7De879A2E4F2F3DE27dBaBc20E9B9","delay":0}
    }
```

```diff
    contract SystemConfig (0x886B187C3D293B1449A3A0F23Ca9e2269E0f2664) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xb570F4aD27e7De879A2E4F2F3DE27dBaBc20E9B9"
+        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      issuedPermissions.0.via.0:
+        {"address":"0xb570F4aD27e7De879A2E4F2F3DE27dBaBc20E9B9","delay":0}
    }
```

```diff
    contract OptimismPortal (0x91493a61ab83b62943E6dCAa5475Dd330704Cc84) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xb570F4aD27e7De879A2E4F2F3DE27dBaBc20E9B9"
+        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      issuedPermissions.0.via.0:
+        {"address":"0xb570F4aD27e7De879A2E4F2F3DE27dBaBc20E9B9","delay":0}
    }
```

```diff
    contract L1ERC721Bridge (0x934Ab59Ef14b638653b1C0FEf7aB9a72186393DC) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xb570F4aD27e7De879A2E4F2F3DE27dBaBc20E9B9"
+        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      issuedPermissions.0.via.0:
+        {"address":"0xb570F4aD27e7De879A2E4F2F3DE27dBaBc20E9B9","delay":0}
    }
```

```diff
    contract ProxyAdmin (0xb570F4aD27e7De879A2E4F2F3DE27dBaBc20E9B9) {
    +++ description: None
      issuedPermissions:
-        [{"permission":"configure","target":"0x4a4962275DF8C60a80d3a25faEc5AA7De116A746","via":[]}]
      receivedPermissions:
-        [{"permission":"configure","target":"0x87630a802a3789463eC4b00f89b27b1e9f6b92e9"},{"permission":"upgrade","target":"0x5e76821C3c1AbB9fD6E310224804556C61D860e0"},{"permission":"upgrade","target":"0x886B187C3D293B1449A3A0F23Ca9e2269E0f2664"},{"permission":"upgrade","target":"0x91493a61ab83b62943E6dCAa5475Dd330704Cc84"},{"permission":"upgrade","target":"0x934Ab59Ef14b638653b1C0FEf7aB9a72186393DC"},{"permission":"upgrade","target":"0xe07eA0436100918F157DF35D01dCE5c11b16D1F1"}]
      directlyReceivedPermissions:
+        [{"permission":"configure","target":"0x87630a802a3789463eC4b00f89b27b1e9f6b92e9"},{"permission":"upgrade","target":"0x5e76821C3c1AbB9fD6E310224804556C61D860e0"},{"permission":"upgrade","target":"0x886B187C3D293B1449A3A0F23Ca9e2269E0f2664"},{"permission":"upgrade","target":"0x91493a61ab83b62943E6dCAa5475Dd330704Cc84"},{"permission":"upgrade","target":"0x934Ab59Ef14b638653b1C0FEf7aB9a72186393DC"},{"permission":"upgrade","target":"0xe07eA0436100918F157DF35D01dCE5c11b16D1F1"}]
    }
```

```diff
    contract L1StandardBridge (0xe07eA0436100918F157DF35D01dCE5c11b16D1F1) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xb570F4aD27e7De879A2E4F2F3DE27dBaBc20E9B9"
+        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      issuedPermissions.0.via.0:
+        {"address":"0xb570F4aD27e7De879A2E4F2F3DE27dBaBc20E9B9","delay":0}
    }
```

Generated with discovered.json: 0x9c75831703a3694cfa0e697fd0de4ebff7994eb6

# Diff at Fri, 30 Aug 2024 07:54:22 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@6c1bd1f41fadf5f2cb1c1805b5a2c6138a3ed35a block: 20389626
- current block number: 20389626

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20389626 (main branch discovery), not current.

```diff
    contract ConduitMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: It can act on behalf of 0xb570F4aD27e7De879A2E4F2F3DE27dBaBc20E9B9, inheriting its permissions.
      receivedPermissions.0.via:
-        []
    }
```

```diff
    contract ProxyAdmin (0xb570F4aD27e7De879A2E4F2F3DE27dBaBc20E9B9) {
    +++ description: None
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

Generated with discovered.json: 0xa40daeb4cf7eab339511b0315a54944a5e707d87

# Diff at Fri, 23 Aug 2024 09:54:00 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@67597c7d6c810bc726594446890178150240711e block: 20389626
- current block number: 20389626

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20389626 (main branch discovery), not current.

```diff
    contract L2OutputOracle (0x5e76821C3c1AbB9fD6E310224804556C61D860e0) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract SystemConfig (0x886B187C3D293B1449A3A0F23Ca9e2269E0f2664) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract OptimismPortal (0x91493a61ab83b62943E6dCAa5475Dd330704Cc84) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract L1ERC721Bridge (0x934Ab59Ef14b638653b1C0FEf7aB9a72186393DC) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract L1StandardBridge (0xe07eA0436100918F157DF35D01dCE5c11b16D1F1) {
    +++ description: None
      values.$upgradeCount:
+        0
    }
```

Generated with discovered.json: 0x3ca55cefdcfe9adffcca7bfa15ab94ed5fead558

# Diff at Wed, 21 Aug 2024 10:04:49 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@2f6dde3357bf5d79196b6e94f79d853a6c4ec72b block: 20389626
- current block number: 20389626

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20389626 (main branch discovery), not current.

```diff
    contract ConduitMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: It can act on behalf of 0xb570F4aD27e7De879A2E4F2F3DE27dBaBc20E9B9, inheriting its permissions.
      assignedPermissions:
-        {"configure":["0xb570F4aD27e7De879A2E4F2F3DE27dBaBc20E9B9"]}
      receivedPermissions:
+        [{"permission":"configure","target":"0xb570F4aD27e7De879A2E4F2F3DE27dBaBc20E9B9","via":[]}]
    }
```

```diff
    contract L2OutputOracle (0x5e76821C3c1AbB9fD6E310224804556C61D860e0) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xb570F4aD27e7De879A2E4F2F3DE27dBaBc20E9B9","via":[]}]
    }
```

```diff
    contract AddressManager (0x87630a802a3789463eC4b00f89b27b1e9f6b92e9) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"configure","target":"0xb570F4aD27e7De879A2E4F2F3DE27dBaBc20E9B9","via":[]}]
    }
```

```diff
    contract SystemConfig (0x886B187C3D293B1449A3A0F23Ca9e2269E0f2664) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xb570F4aD27e7De879A2E4F2F3DE27dBaBc20E9B9","via":[]}]
    }
```

```diff
    contract OptimismPortal (0x91493a61ab83b62943E6dCAa5475Dd330704Cc84) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xb570F4aD27e7De879A2E4F2F3DE27dBaBc20E9B9","via":[]}]
    }
```

```diff
    contract L1ERC721Bridge (0x934Ab59Ef14b638653b1C0FEf7aB9a72186393DC) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xb570F4aD27e7De879A2E4F2F3DE27dBaBc20E9B9","via":[]}]
    }
```

```diff
    contract ProxyAdmin (0xb570F4aD27e7De879A2E4F2F3DE27dBaBc20E9B9) {
    +++ description: None
      assignedPermissions:
-        {"upgrade":["0x5e76821C3c1AbB9fD6E310224804556C61D860e0","0x886B187C3D293B1449A3A0F23Ca9e2269E0f2664","0x91493a61ab83b62943E6dCAa5475Dd330704Cc84","0x934Ab59Ef14b638653b1C0FEf7aB9a72186393DC","0xe07eA0436100918F157DF35D01dCE5c11b16D1F1"],"configure":["0x87630a802a3789463eC4b00f89b27b1e9f6b92e9"]}
      issuedPermissions:
+        [{"permission":"configure","target":"0x4a4962275DF8C60a80d3a25faEc5AA7De116A746","via":[]}]
      receivedPermissions:
+        [{"permission":"configure","target":"0x87630a802a3789463eC4b00f89b27b1e9f6b92e9","via":[]},{"permission":"upgrade","target":"0x5e76821C3c1AbB9fD6E310224804556C61D860e0","via":[]},{"permission":"upgrade","target":"0x886B187C3D293B1449A3A0F23Ca9e2269E0f2664","via":[]},{"permission":"upgrade","target":"0x91493a61ab83b62943E6dCAa5475Dd330704Cc84","via":[]},{"permission":"upgrade","target":"0x934Ab59Ef14b638653b1C0FEf7aB9a72186393DC","via":[]},{"permission":"upgrade","target":"0xe07eA0436100918F157DF35D01dCE5c11b16D1F1","via":[]}]
    }
```

```diff
    contract L1StandardBridge (0xe07eA0436100918F157DF35D01dCE5c11b16D1F1) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xb570F4aD27e7De879A2E4F2F3DE27dBaBc20E9B9","via":[]}]
    }
```

Generated with discovered.json: 0x2caca61eaccc3a2c034c3dfe5527b5a76959d731

# Diff at Fri, 09 Aug 2024 12:01:10 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bf40aa32f030fd312056ca0ef198c8550467d1d7 block: 20389626
- current block number: 20389626

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20389626 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0xb570F4aD27e7De879A2E4F2F3DE27dBaBc20E9B9) {
    +++ description: None
      assignedPermissions.upgrade.4:
-        "0x886B187C3D293B1449A3A0F23Ca9e2269E0f2664"
+        "0xe07eA0436100918F157DF35D01dCE5c11b16D1F1"
      assignedPermissions.upgrade.3:
-        "0x5e76821C3c1AbB9fD6E310224804556C61D860e0"
+        "0x934Ab59Ef14b638653b1C0FEf7aB9a72186393DC"
      assignedPermissions.upgrade.1:
-        "0xe07eA0436100918F157DF35D01dCE5c11b16D1F1"
+        "0x886B187C3D293B1449A3A0F23Ca9e2269E0f2664"
      assignedPermissions.upgrade.0:
-        "0x934Ab59Ef14b638653b1C0FEf7aB9a72186393DC"
+        "0x5e76821C3c1AbB9fD6E310224804556C61D860e0"
    }
```

Generated with discovered.json: 0x1841a57a9c7afbf5e3b041512887c9375fe4f8ff

# Diff at Fri, 09 Aug 2024 10:11:13 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f0da1d0aab7bc6b3b5e54e7e93480bd98e57035 block: 20389626
- current block number: 20389626

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20389626 (main branch discovery), not current.

```diff
    contract ConduitMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: It can act on behalf of 0xb570F4aD27e7De879A2E4F2F3DE27dBaBc20E9B9, inheriting its permissions.
      assignedPermissions.owner:
-        ["0xb570F4aD27e7De879A2E4F2F3DE27dBaBc20E9B9"]
      assignedPermissions.configure:
+        ["0xb570F4aD27e7De879A2E4F2F3DE27dBaBc20E9B9"]
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
    contract ProxyAdmin (0xb570F4aD27e7De879A2E4F2F3DE27dBaBc20E9B9) {
    +++ description: None
      assignedPermissions.admin:
-        ["0x5e76821C3c1AbB9fD6E310224804556C61D860e0","0x886B187C3D293B1449A3A0F23Ca9e2269E0f2664","0x91493a61ab83b62943E6dCAa5475Dd330704Cc84","0x934Ab59Ef14b638653b1C0FEf7aB9a72186393DC","0xe07eA0436100918F157DF35D01dCE5c11b16D1F1"]
      assignedPermissions.owner:
-        ["0x87630a802a3789463eC4b00f89b27b1e9f6b92e9"]
      assignedPermissions.upgrade:
+        ["0x934Ab59Ef14b638653b1C0FEf7aB9a72186393DC","0xe07eA0436100918F157DF35D01dCE5c11b16D1F1","0x91493a61ab83b62943E6dCAa5475Dd330704Cc84","0x5e76821C3c1AbB9fD6E310224804556C61D860e0","0x886B187C3D293B1449A3A0F23Ca9e2269E0f2664"]
      assignedPermissions.configure:
+        ["0x87630a802a3789463eC4b00f89b27b1e9f6b92e9"]
    }
```

```diff
    contract ChallengerMultisig (0xcE10372313Ca39Fbf75A09e7f4c0E57F070259f4) {
    +++ description: None
      values.$multisigThreshold:
-        "4 of 6 (67%)"
      values.getOwners:
-        ["0xefCf0c8faFB425997870f845e26fC6cA6EE6dD5C","0x3840f487A17A41100DD1Bf0946c34f132a57Fd5f","0xa0C600a6e85bf225958FFAcC70B5FDDF9A059038","0x71884086Cfacc370cf5EC34363Bf3938C6c6d888","0xC11D658978FF288da8bda4004CB93C6C99D791b1","0x985Fa8958Aa3dcE89a83E519e6FAAeCAa4930b32"]
      values.getThreshold:
-        4
      values.$members:
+        ["0xefCf0c8faFB425997870f845e26fC6cA6EE6dD5C","0x3840f487A17A41100DD1Bf0946c34f132a57Fd5f","0xa0C600a6e85bf225958FFAcC70B5FDDF9A059038","0x71884086Cfacc370cf5EC34363Bf3938C6c6d888","0xC11D658978FF288da8bda4004CB93C6C99D791b1","0x985Fa8958Aa3dcE89a83E519e6FAAeCAa4930b32"]
      values.$threshold:
+        4
      values.multisigThreshold:
+        "4 of 6 (67%)"
    }
```

Generated with discovered.json: 0xc065214323221c00d532c88f2554ff27ad4bceac

# Diff at Tue, 30 Jul 2024 11:13:25 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@b2b6471ff62871f4956541f42ec025c356c08f7e block: 20389626
- current block number: 20389626

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20389626 (main branch discovery), not current.

```diff
    contract SystemConfig (0x886B187C3D293B1449A3A0F23Ca9e2269E0f2664) {
    +++ description: None
      fieldMeta:
+        {"scalar":{"severity":"LOW","description":"A system configuration parameter used as dynamic L2 gas overhead in the L2 fee calculation."}}
    }
```

Generated with discovered.json: 0x19f4d93eec683b08cf420083a293d12ebb2fd2f9

# Diff at Fri, 26 Jul 2024 08:48:02 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@f98f9bf0ba32e20ec33942af664ae6ed27e8172d block: 20110288
- current block number: 20389626

## Description

Gas limit raise to 180M, the highest current limit on OP stack chains. With a block time of 2s and elasticity of 10x, this currently puts Orderly at 9 GGas/s on average. This is ~ 7x Ethereum Mainnet's 1,25 GGas/s and has a much higher surge scaling buffer. (elasticity)

Note: While orderly has ~ 80% higher Gas/s than base, base more regularly hits its target Gas/s, producing more high-usage data.

## Watched changes

```diff
    contract SystemConfig (0x886B187C3D293B1449A3A0F23Ca9e2269E0f2664) {
    +++ description: None
      values.gasLimit:
-        100000000
+        180000000
    }
```

Generated with discovered.json: 0x88f0e627756850be622db543fb18dbd56fb4d43e

# Diff at Thu, 18 Jul 2024 10:32:27 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@d89fe52cb65d643cef712d1d7910564a7acf2dce block: 20110288
- current block number: 20110288

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20110288 (main branch discovery), not current.

```diff
    contract ConduitMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      descriptions:
+        ["It can act on behalf of 0xb570F4aD27e7De879A2E4F2F3DE27dBaBc20E9B9, inheriting its permissions."]
    }
```

Generated with discovered.json: 0xacba6ab4a87f8e5be0f863efe0fa9ae45984e681

# Diff at Mon, 17 Jun 2024 08:23:38 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@f39ec7f15738d4847f0cbde4818140d42e26440f block: 20082412
- current block number: 20110288

## Description

Gas limit raised. Now ~10% higher than base L2.

## Watched changes

```diff
    contract SystemConfig (0x886B187C3D293B1449A3A0F23Ca9e2269E0f2664) {
    +++ description: None
      values.gasLimit:
-        60000000
+        100000000
    }
```

Generated with discovered.json: 0xfbd9c919a36d8ba7131d60ce803c892cd260a714

# Diff at Thu, 13 Jun 2024 10:50:57 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@cd33b23d6b32d4d38eea92d309fd854193b90203 block: 19927716
- current block number: 20082412

## Description

Gas limit raised.

## Watched changes

```diff
    contract SystemConfig (0x886B187C3D293B1449A3A0F23Ca9e2269E0f2664) {
    +++ description: None
      values.gasLimit:
-        40000000
+        60000000
    }
```

Generated with discovered.json: 0x8ea4f813fa7d4b58eb69ad964fafb89cd12576b2

# Diff at Wed, 22 May 2024 20:10:39 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@bac4efad06804152ae97853892e122a801bbc509 block: 19918763
- current block number: 19927716

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

Generated with discovered.json: 0x540ca88f8981b161a151986f136629dc3e13d7c5

# Diff at Tue, 21 May 2024 14:05:34 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@c032520e456d0e6bee8b65e420ff7dba9f36bd48 block: 19859812
- current block number: 19918763

## Description

Name change.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19859812 (main branch discovery), not current.

```diff
    contract OrderlyMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      name:
-        "OrderlyMultisig"
+        "ConduitMultisig"
    }
```

Generated with discovered.json: 0x5edacefb20bc8a6791e626d8341b2641515ce115

# Diff at Mon, 13 May 2024 08:10:33 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@142cacbaef1c026127ab0d88f45c576741b3a345 block: 19830984
- current block number: 19859812

## Description

After doubling the gasLimit, it is now decreased to 40M, still a 1/3 increase from the original 30M.

## Watched changes

```diff
    contract SystemConfig (0x886B187C3D293B1449A3A0F23Ca9e2269E0f2664) {
    +++ description: None
      values.gasLimit:
-        60000000
+        40000000
    }
```

Generated with discovered.json: 0x5d1123ab6324ea7e55ea01032dfc89c12ca212e2

# Diff at Thu, 09 May 2024 07:27:13 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@d3bba0812727b9105a3f44fe55a68572c804b992 block: 19776802
- current block number: 19830984

## Description

The gasLimit for L2 is doubled. Current block time is 2s, elasticity is 10x. This config is now identical to Base L2.

## Watched changes

```diff
    contract SystemConfig (0x886B187C3D293B1449A3A0F23Ca9e2269E0f2664) {
    +++ description: None
      values.gasLimit:
-        30000000
+        60000000
    }
```

Generated with discovered.json: 0x3edeab069898df087a548f652052250c2f97a55a

# Diff at Thu, 28 Mar 2024 10:33:33 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@dd32bb06b292cc8459fb09925454ee3a90f5c27e block: 19412725
- current block number: 19532040

## Description

Update discovery to include the multisig threshold.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19412725 (main branch discovery), not current.

```diff
    contract OrderlyMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      upgradeability.threshold:
+        "3 of 5 (60%)"
    }
```

```diff
    contract ChallengerMultisig (0xcE10372313Ca39Fbf75A09e7f4c0E57F070259f4) {
    +++ description: None
      upgradeability.threshold:
+        "4 of 6 (67%)"
    }
```

Generated with discovered.json: 0x27306da2737a02c26f8c4f41629c815ee18b5695

# Diff at Mon, 11 Mar 2024 15:24:12 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@d2d5fba14a44528004eaad2e4389550987c4f3cd block: 19370130
- current block number: 19412725

## Description

Update OP stack DA handler.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19370130 (main branch discovery), not current.

```diff
    contract SystemConfig (0x886B187C3D293B1449A3A0F23Ca9e2269E0f2664) {
    +++ description: None
      values.opStackDA.isSequencerSendingBlobTx:
+        false
    }
```

Generated with discovered.json: 0x3cbbe86d1549ff16f956680e8ecb073e926f6be1

# Diff at Tue, 05 Mar 2024 16:23:09 GMT:

- author: Radina Talanova (<nt.radina@gmail.com>)
- comparing to: main@529206d4dcd4dd7502f78a4a18a97240a3a0211b block: 19182535
- current block number: 19370130

## Description

Scalar - a system configuration parameter used as dynamic L2 gas overhead in the L2 fee calculation, has been decreased.

## Watched changes

```diff
    contract SystemConfig (0x886B187C3D293B1449A3A0F23Ca9e2269E0f2664) {
    +++ description: None
      values.scalar:
-        68400
+        13680
    }
```

Generated with discovered.json: 0xbe756234887059a7f1f0faab5602440c3db37a6d

# Diff at Thu, 08 Feb 2024 09:25:18 GMT:

- author: Michał Sobieraj-Jakubiec (<michalsidzej@gmail.com>)
- current block number: 19182535

## Description

Update discovery to include the multisig threshold.

## Initial discovery

```diff
+   Status: CREATED
    contract OrderlyMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    }
```

```diff
+   Status: CREATED
    contract L2OutputOracle (0x5e76821C3c1AbB9fD6E310224804556C61D860e0) {
    }
```

```diff
+   Status: CREATED
    contract AddressManager (0x87630a802a3789463eC4b00f89b27b1e9f6b92e9) {
    }
```

```diff
+   Status: CREATED
    contract SystemConfig (0x886B187C3D293B1449A3A0F23Ca9e2269E0f2664) {
    }
```

```diff
+   Status: CREATED
    contract OptimismPortal (0x91493a61ab83b62943E6dCAa5475Dd330704Cc84) {
    }
```

```diff
+   Status: CREATED
    contract L1ERC721Bridge (0x934Ab59Ef14b638653b1C0FEf7aB9a72186393DC) {
    }
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0xb570F4aD27e7De879A2E4F2F3DE27dBaBc20E9B9) {
    }
```

```diff
+   Status: CREATED
    contract L1CrossDomainMessenger (0xc76543A64666d9a073FaEF4e75F651c88e7DBC08) {
    }
```

```diff
+   Status: CREATED
    contract ChallengerMultisig (0xcE10372313Ca39Fbf75A09e7f4c0E57F070259f4) {
    }
```

```diff
+   Status: CREATED
    contract L1StandardBridge (0xe07eA0436100918F157DF35D01dCE5c11b16D1F1) {
    }
```
