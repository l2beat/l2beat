Generated with discovered.json: 0x1f078d7f75bb60f3a1a63817c855587a3d0af3ba

# Diff at Wed, 21 Aug 2024 10:02:17 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@2f6dde3357bf5d79196b6e94f79d853a6c4ec72b block: 20016201
- current block number: 20016201

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20016201 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x0d9f416260598313Be6FDf6B010f2FbC34957Cd0) {
    +++ description: None
      assignedPermissions:
-        {"upgrade":["0x3F6cE1b36e5120BBc59D0cFe8A5aC8b6464ac1f7","0x8AdeE124447435fE03e3CD24dF3f4cAE32E65a3E","0xACB886b75D76d1c8d9248cFdDfA09b70C71c5393","0xdDa53E23f8a32640b04D7256e651C1db98dB11C1"],"configure":["0xF2dc77c697e892542cC53336178a78Bb313DFDC7"]}
      issuedPermissions:
+        [{"permission":"configure","target":"0xC91482A96e9c2A104d9298D1980eCCf8C4dc764E","via":[]}]
      receivedPermissions:
+        [{"permission":"configure","target":"0xF2dc77c697e892542cC53336178a78Bb313DFDC7","via":[]},{"permission":"upgrade","target":"0x3F6cE1b36e5120BBc59D0cFe8A5aC8b6464ac1f7","via":[]},{"permission":"upgrade","target":"0x8AdeE124447435fE03e3CD24dF3f4cAE32E65a3E","via":[]},{"permission":"upgrade","target":"0xACB886b75D76d1c8d9248cFdDfA09b70C71c5393","via":[]},{"permission":"upgrade","target":"0xdDa53E23f8a32640b04D7256e651C1db98dB11C1","via":[]}]
    }
```

```diff
    contract L1StandardBridge (0x3F6cE1b36e5120BBc59D0cFe8A5aC8b6464ac1f7) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x0d9f416260598313Be6FDf6B010f2FbC34957Cd0","via":[]}]
    }
```

```diff
    contract L1UsdcBridge (0x450D55a4B4136805B0e5A6BB59377c71FC4FaCBb) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xC73b6E6ec346f9f1A07D2e7A4380858D7BEa0194","via":[]}]
    }
```

```diff
    contract OptimismPortal (0x8AdeE124447435fE03e3CD24dF3f4cAE32E65a3E) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x0d9f416260598313Be6FDf6B010f2FbC34957Cd0","via":[]}]
    }
```

```diff
    contract SystemConfig (0xACB886b75D76d1c8d9248cFdDfA09b70C71c5393) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x0d9f416260598313Be6FDf6B010f2FbC34957Cd0","via":[]}]
    }
```

```diff
    contract UsdcBridgeOwnerMultisig (0xC73b6E6ec346f9f1A07D2e7A4380858D7BEa0194) {
    +++ description: None
      assignedPermissions:
-        {"upgrade":["0x450D55a4B4136805B0e5A6BB59377c71FC4FaCBb"]}
      receivedPermissions:
+        [{"permission":"upgrade","target":"0x450D55a4B4136805B0e5A6BB59377c71FC4FaCBb","via":[]}]
    }
```

```diff
    contract RollupOwnerMultisig (0xC91482A96e9c2A104d9298D1980eCCf8C4dc764E) {
    +++ description: It can act on behalf of 0x0d9f416260598313Be6FDf6B010f2FbC34957Cd0, inheriting its permissions.
      assignedPermissions:
-        {"configure":["0x0d9f416260598313Be6FDf6B010f2FbC34957Cd0"]}
      receivedPermissions:
+        [{"permission":"configure","target":"0x0d9f416260598313Be6FDf6B010f2FbC34957Cd0","via":[]}]
    }
```

```diff
    contract L2OutputOracle (0xdDa53E23f8a32640b04D7256e651C1db98dB11C1) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x0d9f416260598313Be6FDf6B010f2FbC34957Cd0","via":[]}]
    }
```

```diff
    contract AddressManager (0xF2dc77c697e892542cC53336178a78Bb313DFDC7) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"configure","target":"0x0d9f416260598313Be6FDf6B010f2FbC34957Cd0","via":[]}]
    }
```

Generated with discovered.json: 0x8e0d0817f40d0d6a38239d1a617fd478b33111c9

# Diff at Fri, 09 Aug 2024 11:58:49 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bf40aa32f030fd312056ca0ef198c8550467d1d7 block: 20016201
- current block number: 20016201

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20016201 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x0d9f416260598313Be6FDf6B010f2FbC34957Cd0) {
    +++ description: None
      assignedPermissions.upgrade.3:
-        "0xACB886b75D76d1c8d9248cFdDfA09b70C71c5393"
+        "0xdDa53E23f8a32640b04D7256e651C1db98dB11C1"
      assignedPermissions.upgrade.2:
-        "0xdDa53E23f8a32640b04D7256e651C1db98dB11C1"
+        "0xACB886b75D76d1c8d9248cFdDfA09b70C71c5393"
    }
```

Generated with discovered.json: 0xc3b46a32a85e8df6b8fe449fb0867b49e637d65e

# Diff at Fri, 09 Aug 2024 10:08:55 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f0da1d0aab7bc6b3b5e54e7e93480bd98e57035 block: 20016201
- current block number: 20016201

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20016201 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x0d9f416260598313Be6FDf6B010f2FbC34957Cd0) {
    +++ description: None
      assignedPermissions.admin:
-        ["0x3F6cE1b36e5120BBc59D0cFe8A5aC8b6464ac1f7","0x8AdeE124447435fE03e3CD24dF3f4cAE32E65a3E","0xACB886b75D76d1c8d9248cFdDfA09b70C71c5393","0xdDa53E23f8a32640b04D7256e651C1db98dB11C1"]
      assignedPermissions.owner:
-        ["0xF2dc77c697e892542cC53336178a78Bb313DFDC7"]
      assignedPermissions.upgrade:
+        ["0x3F6cE1b36e5120BBc59D0cFe8A5aC8b6464ac1f7","0x8AdeE124447435fE03e3CD24dF3f4cAE32E65a3E","0xdDa53E23f8a32640b04D7256e651C1db98dB11C1","0xACB886b75D76d1c8d9248cFdDfA09b70C71c5393"]
      assignedPermissions.configure:
+        ["0xF2dc77c697e892542cC53336178a78Bb313DFDC7"]
    }
```

```diff
    contract GnosisSafe (0x778870B55576Bdb2B5368A3CB225fBcED2B8D0Ff) {
    +++ description: None
      values.$multisigThreshold:
-        "1 of 1 (100%)"
      values.getOwners:
-        ["0x32B8325b7f12ADB06763D6D04c951AC94e36C3D7"]
      values.getThreshold:
-        1
      values.$members:
+        ["0x32B8325b7f12ADB06763D6D04c951AC94e36C3D7"]
      values.$threshold:
+        1
      values.multisigThreshold:
+        "1 of 1 (100%)"
    }
```

```diff
    contract UsdcBridgeOwnerMultisig (0xC73b6E6ec346f9f1A07D2e7A4380858D7BEa0194) {
    +++ description: None
      assignedPermissions.admin:
-        ["0x450D55a4B4136805B0e5A6BB59377c71FC4FaCBb"]
      assignedPermissions.upgrade:
+        ["0x450D55a4B4136805B0e5A6BB59377c71FC4FaCBb"]
      values.$multisigThreshold:
-        "3 of 6 (50%)"
      values.getOwners:
-        ["0xfB7Cf35d123BcE8bc91DC7bEccDC8ab81853007c","0x45894CeBad0a1298D44aF2B528490693E58B322E","0xefCf0c8faFB425997870f845e26fC6cA6EE6dD5C","0xCa1B0866CCcfcFf6dbb7B8a0eD57EA663070c50c","0x778870B55576Bdb2B5368A3CB225fBcED2B8D0Ff","0xa23366C4bDD05d6Ac5ae66503fb5AC2827eD5051"]
      values.getThreshold:
-        3
      values.$members:
+        ["0xfB7Cf35d123BcE8bc91DC7bEccDC8ab81853007c","0x45894CeBad0a1298D44aF2B528490693E58B322E","0xefCf0c8faFB425997870f845e26fC6cA6EE6dD5C","0xCa1B0866CCcfcFf6dbb7B8a0eD57EA663070c50c","0x778870B55576Bdb2B5368A3CB225fBcED2B8D0Ff","0xa23366C4bDD05d6Ac5ae66503fb5AC2827eD5051"]
      values.$threshold:
+        3
      values.multisigThreshold:
+        "3 of 6 (50%)"
    }
```

```diff
    contract RollupOwnerMultisig (0xC91482A96e9c2A104d9298D1980eCCf8C4dc764E) {
    +++ description: It can act on behalf of 0x0d9f416260598313Be6FDf6B010f2FbC34957Cd0, inheriting its permissions.
      assignedPermissions.owner:
-        ["0x0d9f416260598313Be6FDf6B010f2FbC34957Cd0"]
      assignedPermissions.configure:
+        ["0x0d9f416260598313Be6FDf6B010f2FbC34957Cd0"]
      values.$multisigThreshold:
-        "4 of 6 (67%)"
      values.getOwners:
-        ["0x56b73FA51e09D0BBFA3A5346aaB7576Edc9d0436","0xC9D2c719d6C8Ba2876FC9B443c7d2690072F04ad","0xFB771f2640Dfd37B18332a84817B2a6e994f5BF6","0xefCf0c8faFB425997870f845e26fC6cA6EE6dD5C","0x3840f487A17A41100DD1Bf0946c34f132a57Fd5f","0xa0C600a6e85bf225958FFAcC70B5FDDF9A059038"]
      values.getThreshold:
-        4
      values.$members:
+        ["0x56b73FA51e09D0BBFA3A5346aaB7576Edc9d0436","0xC9D2c719d6C8Ba2876FC9B443c7d2690072F04ad","0xFB771f2640Dfd37B18332a84817B2a6e994f5BF6","0xefCf0c8faFB425997870f845e26fC6cA6EE6dD5C","0x3840f487A17A41100DD1Bf0946c34f132a57Fd5f","0xa0C600a6e85bf225958FFAcC70B5FDDF9A059038"]
      values.$threshold:
+        4
      values.multisigThreshold:
+        "4 of 6 (67%)"
    }
```

Generated with discovered.json: 0x9dd3533431ed12255a2204f7e920a5f2b32640dd

# Diff at Thu, 18 Jul 2024 10:30:09 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@d89fe52cb65d643cef712d1d7910564a7acf2dce block: 20016201
- current block number: 20016201

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20016201 (main branch discovery), not current.

```diff
    contract RollupOwnerMultisig (0xC91482A96e9c2A104d9298D1980eCCf8C4dc764E) {
    +++ description: None
      descriptions:
+        ["It can act on behalf of 0x0d9f416260598313Be6FDf6B010f2FbC34957Cd0, inheriting its permissions."]
    }
```

Generated with discovered.json: 0x8966bc0f2b786fa51b15aa2d9982fd1d05f792ec

# Diff at Wed, 22 May 2024 16:40:05 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@7eae7b47a410c2b8cc7e6a7d7a0bc841a31c6e83 block: 19825954
- current block number: 19926669

## Description

Fee change for the L2 fee calculation. The new scalar value is [encoded](https://specs.optimism.io/protocol/exec-engine.html#ecotone-l1-cost-fee-changes-eip-4844-da).

## Watched changes

```diff
    contract SystemConfig (0xACB886b75D76d1c8d9248cFdDfA09b70C71c5393) {
    +++ description: None
      values.overhead:
-        188
+        0
      values.scalar:
-        684000
+        "452312848583266388373324160190187140051835877600158453279131273430256651056"
    }
```

```diff
    contract RollupOwnerMultisig (0xC91482A96e9c2A104d9298D1980eCCf8C4dc764E) {
    +++ description: None
      values.nonce:
-        2
+        3
    }
```

Generated with discovered.json: 0x5cc273f3a6946a11fc5da2bff31e3aedf40a9af9

# Diff at Wed, 08 May 2024 14:32:16 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- current block number: 19825954

## Description

Initial discovery: BOB (build on bitcoin) is a general-purpose OP stack rollup (.97 similarity with base excluding USDC bridge).
They are early in their roadmap but aim to offer BTC defi options, a Bitcoin light client and security inheritance from Bitcoin PoW.

## Initial discovery

```diff
+   Status: CREATED
    contract L1ERC20TokenBridge (0x091dF5E1284E49fA682407096aD34cfD42B95B72)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x0d9f416260598313Be6FDf6B010f2FbC34957Cd0)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1StandardBridge (0x3F6cE1b36e5120BBc59D0cFe8A5aC8b6464ac1f7)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1UsdcBridge (0x450D55a4B4136805B0e5A6BB59377c71FC4FaCBb)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafe (0x778870B55576Bdb2B5368A3CB225fBcED2B8D0Ff)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OptimismPortal (0x8AdeE124447435fE03e3CD24dF3f4cAE32E65a3E)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SystemConfig (0xACB886b75D76d1c8d9248cFdDfA09b70C71c5393)
    +++ description: None
```

```diff
+   Status: CREATED
    contract UsdcBridgeOwnerMultisig (0xC73b6E6ec346f9f1A07D2e7A4380858D7BEa0194)
    +++ description: None
```

```diff
+   Status: CREATED
    contract RollupOwnerMultisig (0xC91482A96e9c2A104d9298D1980eCCf8C4dc764E)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L2OutputOracle (0xdDa53E23f8a32640b04D7256e651C1db98dB11C1)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1CrossDomainMessenger (0xE3d981643b806FB8030CDB677D6E60892E547EdA)
    +++ description: None
```

```diff
+   Status: CREATED
    contract AddressManager (0xF2dc77c697e892542cC53336178a78Bb313DFDC7)
    +++ description: None
```
