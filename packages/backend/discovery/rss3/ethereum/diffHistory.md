Generated with discovered.json: 0x2df3d0243a85d5ee807aaadb8416bb012401fafd

# Diff at Fri, 09 Aug 2024 10:11:54 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f0da1d0aab7bc6b3b5e54e7e93480bd98e57035 block: 19918622
- current block number: 19918622

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19918622 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x1075B29e5F7a911128C77F3989702E150C988904) {
    +++ description: None
      assignedPermissions.admin:
-        ["0x1D89222C28C3ba471be822203998f27Df4727C0b","0x3e5FaB39eD4eFB4fc29A5201059AE819f2f0418A","0x4cbab69108Aa72151EDa5A3c164eA86845f18438","0x6A12432491bbbE8d3babf75F759766774C778Db4","0x80e73D6BfC73c567032304C3891a06c2d9954d09","0x938D0Bb4B584d4F6f793fCB7808cA2Eea15B69A8","0xE6f24d2C32B3109B18ed33cF08eFb490b1e09C10"]
      assignedPermissions.owner:
-        ["0x75D340E5BF2eAbC39A04AF4229Ce7875B4A73B03"]
      assignedPermissions.upgrade:
+        ["0x1D89222C28C3ba471be822203998f27Df4727C0b","0x4cbab69108Aa72151EDa5A3c164eA86845f18438","0x938D0Bb4B584d4F6f793fCB7808cA2Eea15B69A8","0x3e5FaB39eD4eFB4fc29A5201059AE819f2f0418A","0x6A12432491bbbE8d3babf75F759766774C778Db4","0xE6f24d2C32B3109B18ed33cF08eFb490b1e09C10","0x80e73D6BfC73c567032304C3891a06c2d9954d09"]
      assignedPermissions.configure:
+        ["0x75D340E5BF2eAbC39A04AF4229Ce7875B4A73B03"]
    }
```

```diff
    contract RSS3Multisig (0x8AC80fa0993D95C9d6B8Cb494E561E6731038941) {
    +++ description: It can act on behalf of 0x1075B29e5F7a911128C77F3989702E150C988904, inheriting its permissions.
      assignedPermissions.owner:
-        ["0x1075B29e5F7a911128C77F3989702E150C988904"]
      assignedPermissions.configure:
+        ["0x1075B29e5F7a911128C77F3989702E150C988904"]
      values.$multisigThreshold:
-        "3 of 5 (60%)"
      values.getOwners:
-        ["0xc06d32F7C20f100C7b8657dE2b24f201A46BC3DD","0xEE52b76e6A9F6eA669F8A99bb63b113819cDCbEF","0x70f8b7f14eA00209A70a926134B86E5eb9f4317f","0xf877475092Dc23AD9d367B27D48645d56564D310","0xF209b7Bbadf8d9518a822aEaa7119B38b17377A7"]
      values.getThreshold:
-        3
      values.$members:
+        ["0xc06d32F7C20f100C7b8657dE2b24f201A46BC3DD","0xEE52b76e6A9F6eA669F8A99bb63b113819cDCbEF","0x70f8b7f14eA00209A70a926134B86E5eb9f4317f","0xf877475092Dc23AD9d367B27D48645d56564D310","0xF209b7Bbadf8d9518a822aEaa7119B38b17377A7"]
      values.$threshold:
+        3
      values.multisigThreshold:
+        "3 of 5 (60%)"
    }
```

Generated with discovered.json: 0xee4f6be5b2d5f05f7142e38e8024cc140d32c88f

# Diff at Thu, 18 Jul 2024 10:33:03 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@d89fe52cb65d643cef712d1d7910564a7acf2dce block: 19918622
- current block number: 19918622

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19918622 (main branch discovery), not current.

```diff
    contract RSS3Multisig (0x8AC80fa0993D95C9d6B8Cb494E561E6731038941) {
    +++ description: None
      descriptions:
+        ["It can act on behalf of 0x1075B29e5F7a911128C77F3989702E150C988904, inheriting its permissions."]
    }
```

Generated with discovered.json: 0x9963e2a9b04d67dd01372b53ad8c847f8a21bd3e

# Diff at Wed, 03 Apr 2024 08:59:57 GMT:

- author: maciekop (<maciej.opala@l2beat.com>)
- comparing to: main@34d9eb99e785ccac44323b84405d78f9783b5cc2 block: 19538724
- current block number: 19574205

## Description

Rediscovery with new field added (upgradeability.threshold)

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19538724 (main branch discovery), not current.

```diff
    contract RSS3Multisig (0x8AC80fa0993D95C9d6B8Cb494E561E6731038941) {
    +++ description: None
      upgradeability.threshold:
+        "3 of 5 (60%)"
    }
```

Generated with discovered.json: 0x44381074df3e7dfeb3cd439c907c54ebb8ccef93

# Diff at Thu, 28 Mar 2024 10:04:08 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- current block number: 19531894

## Description

Provide description of changes. This section will be preserved.

## Initial discovery

```diff
+   Status: CREATED
    contract ProxyAdmin (0x1075B29e5F7a911128C77F3989702E150C988904)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OptimismMintableERC20Factory (0x1D89222C28C3ba471be822203998f27Df4727C0b)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SuperchainConfig (0x3e5FaB39eD4eFB4fc29A5201059AE819f2f0418A)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1StandardBridge (0x4cbab69108Aa72151EDa5A3c164eA86845f18438)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OptimismPortal (0x6A12432491bbbE8d3babf75F759766774C778Db4)
    +++ description: None
```

```diff
+   Status: CREATED
    contract AddressManager (0x75D340E5BF2eAbC39A04AF4229Ce7875B4A73B03)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SystemConfig (0x80e73D6BfC73c567032304C3891a06c2d9954d09)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1CrossDomainMessenger (0x892CAa506c86C5101f5eC11C6f09589c9dC8A85C)
    +++ description: None
```

```diff
+   Status: CREATED
    contract RSS3Multisig (0x8AC80fa0993D95C9d6B8Cb494E561E6731038941)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1ERC721Bridge (0x938D0Bb4B584d4F6f793fCB7808cA2Eea15B69A8)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L2OutputOracle (0xE6f24d2C32B3109B18ed33cF08eFb490b1e09C10)
    +++ description: None
```
