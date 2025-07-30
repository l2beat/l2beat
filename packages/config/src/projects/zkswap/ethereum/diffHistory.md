Generated with discovered.json: 0x4cca6263e63b5866ae0113adba8047025d178399

# Diff at Mon, 14 Jul 2025 12:46:50 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@9f4300dad2f3d080cd56fa311d4a848556c74e72 block: 22865800
- current block number: 22865800

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22865800 (main branch discovery), not current.

```diff
    contract Governance (0x02ecef526f806f06357659fFD14834fe82Ef4B04) {
    +++ description: None
      address:
-        "0x02ecef526f806f06357659fFD14834fe82Ef4B04"
+        "eth:0x02ecef526f806f06357659fFD14834fe82Ef4B04"
      values.$admin:
-        "0x714B2D10210f2A3a7AA614F949259C87613689aB"
+        "eth:0x714B2D10210f2A3a7AA614F949259C87613689aB"
      values.$implementation:
-        "0x9d3fdf9b4782753d12f6262bf22B6322608962b8"
+        "eth:0x9d3fdf9b4782753d12f6262bf22B6322608962b8"
      values.getMaster:
-        "0x714B2D10210f2A3a7AA614F949259C87613689aB"
+        "eth:0x714B2D10210f2A3a7AA614F949259C87613689aB"
      values.getTarget:
-        "0x9d3fdf9b4782753d12f6262bf22B6322608962b8"
+        "eth:0x9d3fdf9b4782753d12f6262bf22B6322608962b8"
      values.networkGovernor:
-        "0x7D1a14eeD7af8e26f24bf08BA6eD7A339AbcF037"
+        "eth:0x7D1a14eeD7af8e26f24bf08BA6eD7A339AbcF037"
      values.validators.0:
-        "0x042147Bd43d3f59B3133eE08322B67E4e9f2fDb3"
+        "eth:0x042147Bd43d3f59B3133eE08322B67E4e9f2fDb3"
      implementationNames.0x02ecef526f806f06357659fFD14834fe82Ef4B04:
-        "Proxy"
      implementationNames.0x9d3fdf9b4782753d12f6262bf22B6322608962b8:
-        "Governance"
      implementationNames.eth:0x02ecef526f806f06357659fFD14834fe82Ef4B04:
+        "Proxy"
      implementationNames.eth:0x9d3fdf9b4782753d12f6262bf22B6322608962b8:
+        "Governance"
    }
```

```diff
    EOA  (0x042147Bd43d3f59B3133eE08322B67E4e9f2fDb3) {
    +++ description: None
      address:
-        "0x042147Bd43d3f59B3133eE08322B67E4e9f2fDb3"
+        "eth:0x042147Bd43d3f59B3133eE08322B67E4e9f2fDb3"
    }
```

```diff
    contract Verifier (0x27C229937745d697d28FC7853d1bFEA7331Edf56) {
    +++ description: None
      address:
-        "0x27C229937745d697d28FC7853d1bFEA7331Edf56"
+        "eth:0x27C229937745d697d28FC7853d1bFEA7331Edf56"
      values.$admin:
-        "0x714B2D10210f2A3a7AA614F949259C87613689aB"
+        "eth:0x714B2D10210f2A3a7AA614F949259C87613689aB"
      values.$implementation:
-        "0x165dFA76DFD3F6ad6Ad614aE4566C2E9262E532F"
+        "eth:0x165dFA76DFD3F6ad6Ad614aE4566C2E9262E532F"
      values.getMaster:
-        "0x714B2D10210f2A3a7AA614F949259C87613689aB"
+        "eth:0x714B2D10210f2A3a7AA614F949259C87613689aB"
      values.getTarget:
-        "0x165dFA76DFD3F6ad6Ad614aE4566C2E9262E532F"
+        "eth:0x165dFA76DFD3F6ad6Ad614aE4566C2E9262E532F"
      implementationNames.0x27C229937745d697d28FC7853d1bFEA7331Edf56:
-        "Proxy"
      implementationNames.0x165dFA76DFD3F6ad6Ad614aE4566C2E9262E532F:
-        ""
      implementationNames.eth:0x27C229937745d697d28FC7853d1bFEA7331Edf56:
+        "Proxy"
      implementationNames.eth:0x165dFA76DFD3F6ad6Ad614aE4566C2E9262E532F:
+        ""
    }
```

```diff
    contract ZkSyncCommitBlock (0x2c543eBd91DAB7Be40eDB671D48CeDF35A75e157) {
    +++ description: None
      address:
-        "0x2c543eBd91DAB7Be40eDB671D48CeDF35A75e157"
+        "eth:0x2c543eBd91DAB7Be40eDB671D48CeDF35A75e157"
      values.zkSyncCommitBlockAddress:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.zkSyncExitAddress:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      implementationNames.0x2c543eBd91DAB7Be40eDB671D48CeDF35A75e157:
-        "ZkSyncCommitBlock"
      implementationNames.eth:0x2c543eBd91DAB7Be40eDB671D48CeDF35A75e157:
+        "ZkSyncCommitBlock"
    }
```

```diff
    contract PairManager (0x661121AE41edE3f6FECDed922c59acC19A3ea9B3) {
    +++ description: None
      address:
-        "0x661121AE41edE3f6FECDed922c59acC19A3ea9B3"
+        "eth:0x661121AE41edE3f6FECDed922c59acC19A3ea9B3"
      values.$admin:
-        "0x714B2D10210f2A3a7AA614F949259C87613689aB"
+        "eth:0x714B2D10210f2A3a7AA614F949259C87613689aB"
      values.$implementation:
-        "0x65Fab217f1948af2D7A8eEB11fF111B0993C5Df8"
+        "eth:0x65Fab217f1948af2D7A8eEB11fF111B0993C5Df8"
      values.getMaster:
-        "0x714B2D10210f2A3a7AA614F949259C87613689aB"
+        "eth:0x714B2D10210f2A3a7AA614F949259C87613689aB"
      values.getTarget:
-        "0x65Fab217f1948af2D7A8eEB11fF111B0993C5Df8"
+        "eth:0x65Fab217f1948af2D7A8eEB11fF111B0993C5Df8"
      implementationNames.0x661121AE41edE3f6FECDed922c59acC19A3ea9B3:
-        "Proxy"
      implementationNames.0x65Fab217f1948af2D7A8eEB11fF111B0993C5Df8:
-        ""
      implementationNames.eth:0x661121AE41edE3f6FECDed922c59acC19A3ea9B3:
+        "Proxy"
      implementationNames.eth:0x65Fab217f1948af2D7A8eEB11fF111B0993C5Df8:
+        ""
    }
```

```diff
    contract UpgradeGatekeeper (0x714B2D10210f2A3a7AA614F949259C87613689aB) {
    +++ description: None
      address:
-        "0x714B2D10210f2A3a7AA614F949259C87613689aB"
+        "eth:0x714B2D10210f2A3a7AA614F949259C87613689aB"
      values.getMaster:
-        "0x7D1a14eeD7af8e26f24bf08BA6eD7A339AbcF037"
+        "eth:0x7D1a14eeD7af8e26f24bf08BA6eD7A339AbcF037"
      values.mainContract:
-        "0x8ECa806Aecc86CE90Da803b080Ca4E3A9b8097ad"
+        "eth:0x8ECa806Aecc86CE90Da803b080Ca4E3A9b8097ad"
      values.managedContracts.0:
-        "0x02ecef526f806f06357659fFD14834fe82Ef4B04"
+        "eth:0x02ecef526f806f06357659fFD14834fe82Ef4B04"
      values.managedContracts.1:
-        "0x661121AE41edE3f6FECDed922c59acC19A3ea9B3"
+        "eth:0x661121AE41edE3f6FECDed922c59acC19A3ea9B3"
      values.managedContracts.2:
-        "0x27C229937745d697d28FC7853d1bFEA7331Edf56"
+        "eth:0x27C229937745d697d28FC7853d1bFEA7331Edf56"
      values.managedContracts.3:
-        "0x961369d347EF7A6896BDD39cBE2B89e3911f521f"
+        "eth:0x961369d347EF7A6896BDD39cBE2B89e3911f521f"
      values.managedContracts.4:
-        "0x8ECa806Aecc86CE90Da803b080Ca4E3A9b8097ad"
+        "eth:0x8ECa806Aecc86CE90Da803b080Ca4E3A9b8097ad"
      implementationNames.0x714B2D10210f2A3a7AA614F949259C87613689aB:
-        "UpgradeGatekeeper"
      implementationNames.eth:0x714B2D10210f2A3a7AA614F949259C87613689aB:
+        "UpgradeGatekeeper"
    }
```

```diff
    EOA  (0x7D1a14eeD7af8e26f24bf08BA6eD7A339AbcF037) {
    +++ description: None
      address:
-        "0x7D1a14eeD7af8e26f24bf08BA6eD7A339AbcF037"
+        "eth:0x7D1a14eeD7af8e26f24bf08BA6eD7A339AbcF037"
    }
```

```diff
    contract ZkSyncExit (0x8A1DBf1C32A4f5AfBD70D778F25FBEed7Cc881e5) {
    +++ description: None
      address:
-        "0x8A1DBf1C32A4f5AfBD70D778F25FBEed7Cc881e5"
+        "eth:0x8A1DBf1C32A4f5AfBD70D778F25FBEed7Cc881e5"
      implementationNames.0x8A1DBf1C32A4f5AfBD70D778F25FBEed7Cc881e5:
-        ""
      implementationNames.eth:0x8A1DBf1C32A4f5AfBD70D778F25FBEed7Cc881e5:
+        ""
    }
```

```diff
    contract ZkSync (0x8ECa806Aecc86CE90Da803b080Ca4E3A9b8097ad) {
    +++ description: None
      address:
-        "0x8ECa806Aecc86CE90Da803b080Ca4E3A9b8097ad"
+        "eth:0x8ECa806Aecc86CE90Da803b080Ca4E3A9b8097ad"
      values.$admin:
-        "0x714B2D10210f2A3a7AA614F949259C87613689aB"
+        "eth:0x714B2D10210f2A3a7AA614F949259C87613689aB"
      values.$implementation:
-        "0x2F70F6D864F8F597a0ef57aDDf24323DFAb5797f"
+        "eth:0x2F70F6D864F8F597a0ef57aDDf24323DFAb5797f"
      values.getMaster:
-        "0x714B2D10210f2A3a7AA614F949259C87613689aB"
+        "eth:0x714B2D10210f2A3a7AA614F949259C87613689aB"
      values.getTarget:
-        "0x2F70F6D864F8F597a0ef57aDDf24323DFAb5797f"
+        "eth:0x2F70F6D864F8F597a0ef57aDDf24323DFAb5797f"
      values.governance:
-        "0x02ecef526f806f06357659fFD14834fe82Ef4B04"
+        "eth:0x02ecef526f806f06357659fFD14834fe82Ef4B04"
      values.pairManager:
-        "0x661121AE41edE3f6FECDed922c59acC19A3ea9B3"
+        "eth:0x661121AE41edE3f6FECDed922c59acC19A3ea9B3"
      values.verifier:
-        "0x27C229937745d697d28FC7853d1bFEA7331Edf56"
+        "eth:0x27C229937745d697d28FC7853d1bFEA7331Edf56"
      values.verifierExit:
-        "0x961369d347EF7A6896BDD39cBE2B89e3911f521f"
+        "eth:0x961369d347EF7A6896BDD39cBE2B89e3911f521f"
      values.zkSyncCommitBlockAddress:
-        "0x2c543eBd91DAB7Be40eDB671D48CeDF35A75e157"
+        "eth:0x2c543eBd91DAB7Be40eDB671D48CeDF35A75e157"
      values.zkSyncExitAddress:
-        "0x8A1DBf1C32A4f5AfBD70D778F25FBEed7Cc881e5"
+        "eth:0x8A1DBf1C32A4f5AfBD70D778F25FBEed7Cc881e5"
      implementationNames.0x8ECa806Aecc86CE90Da803b080Ca4E3A9b8097ad:
-        "Proxy"
      implementationNames.0x2F70F6D864F8F597a0ef57aDDf24323DFAb5797f:
-        "ZkSync"
      implementationNames.eth:0x8ECa806Aecc86CE90Da803b080Ca4E3A9b8097ad:
+        "Proxy"
      implementationNames.eth:0x2F70F6D864F8F597a0ef57aDDf24323DFAb5797f:
+        "ZkSync"
    }
```

```diff
    contract VerifierExit (0x961369d347EF7A6896BDD39cBE2B89e3911f521f) {
    +++ description: None
      address:
-        "0x961369d347EF7A6896BDD39cBE2B89e3911f521f"
+        "eth:0x961369d347EF7A6896BDD39cBE2B89e3911f521f"
      values.$admin:
-        "0x714B2D10210f2A3a7AA614F949259C87613689aB"
+        "eth:0x714B2D10210f2A3a7AA614F949259C87613689aB"
      values.$implementation:
-        "0xd12F4D8329584F36aEd67f807F42D9a02bEb9534"
+        "eth:0xd12F4D8329584F36aEd67f807F42D9a02bEb9534"
      values.getMaster:
-        "0x714B2D10210f2A3a7AA614F949259C87613689aB"
+        "eth:0x714B2D10210f2A3a7AA614F949259C87613689aB"
      values.getTarget:
-        "0xd12F4D8329584F36aEd67f807F42D9a02bEb9534"
+        "eth:0xd12F4D8329584F36aEd67f807F42D9a02bEb9534"
      implementationNames.0x961369d347EF7A6896BDD39cBE2B89e3911f521f:
-        "Proxy"
      implementationNames.0xd12F4D8329584F36aEd67f807F42D9a02bEb9534:
-        ""
      implementationNames.eth:0x961369d347EF7A6896BDD39cBE2B89e3911f521f:
+        "Proxy"
      implementationNames.eth:0xd12F4D8329584F36aEd67f807F42D9a02bEb9534:
+        ""
    }
```

```diff
+   Status: CREATED
    contract Governance (0x02ecef526f806f06357659fFD14834fe82Ef4B04)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Verifier (0x27C229937745d697d28FC7853d1bFEA7331Edf56)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ZkSyncCommitBlock (0x2c543eBd91DAB7Be40eDB671D48CeDF35A75e157)
    +++ description: None
```

```diff
+   Status: CREATED
    contract PairManager (0x661121AE41edE3f6FECDed922c59acC19A3ea9B3)
    +++ description: None
```

```diff
+   Status: CREATED
    contract UpgradeGatekeeper (0x714B2D10210f2A3a7AA614F949259C87613689aB)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ZkSyncExit (0x8A1DBf1C32A4f5AfBD70D778F25FBEed7Cc881e5)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ZkSync (0x8ECa806Aecc86CE90Da803b080Ca4E3A9b8097ad)
    +++ description: None
```

```diff
+   Status: CREATED
    contract VerifierExit (0x961369d347EF7A6896BDD39cBE2B89e3911f521f)
    +++ description: None
```

Generated with discovered.json: 0x657b878b2dbac6e33f1572c417925568efe723b0

# Diff at Mon, 07 Jul 2025 07:27:29 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@1a6f89d35120c5c65bf077ab92a9ca72da48080d block: 20311131
- current block number: 22865800

## Description

[This address](https://etherscan.io/address/0x728001a80a3657e886810daab9e796fefd66b6c7) is doing weird ['withdrawals'](https://app.blocksec.com/explorer/tx/eth/0x3755c1e01271133b4549d2c341a24acfd36baaabe0787fa02a5e9865d810abcb) (mints) of an iliquid token. zkswap diso now archived.

## Watched changes

```diff
    contract ZkSync (0x8ECa806Aecc86CE90Da803b080Ca4E3A9b8097ad) {
    +++ description: None
      values.totalOpenPriorityRequests:
-        0
+        2
    }
```

Generated with discovered.json: 0xdb436c23ac272aa2c82e9087174835a9d8be64ea

# Diff at Fri, 04 Jul 2025 12:19:31 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f56dc47fe915564d4555300304da4d3bcbc087f block: 20311131
- current block number: 20311131

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20311131 (main branch discovery), not current.

```diff
    contract UpgradeGatekeeper (0x714B2D10210f2A3a7AA614F949259C87613689aB) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0x02ecef526f806f06357659fFD14834fe82Ef4B04"
+        "eth:0x02ecef526f806f06357659fFD14834fe82Ef4B04"
      receivedPermissions.1.from:
-        "ethereum:0x27C229937745d697d28FC7853d1bFEA7331Edf56"
+        "eth:0x27C229937745d697d28FC7853d1bFEA7331Edf56"
      receivedPermissions.2.from:
-        "ethereum:0x661121AE41edE3f6FECDed922c59acC19A3ea9B3"
+        "eth:0x661121AE41edE3f6FECDed922c59acC19A3ea9B3"
      receivedPermissions.3.from:
-        "ethereum:0x8ECa806Aecc86CE90Da803b080Ca4E3A9b8097ad"
+        "eth:0x8ECa806Aecc86CE90Da803b080Ca4E3A9b8097ad"
      receivedPermissions.4.from:
-        "ethereum:0x961369d347EF7A6896BDD39cBE2B89e3911f521f"
+        "eth:0x961369d347EF7A6896BDD39cBE2B89e3911f521f"
    }
```

Generated with discovered.json: 0x73fade3481b9c74bc38ce3f48b2d8eb1aae18a75

# Diff at Fri, 23 May 2025 09:41:09 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@69cd181abbc3c830a6caf2f4429b37cae72ffdb8 block: 20311131
- current block number: 20311131

## Description

Introduced .role field on each permission, defaulting to field name on which it was defined (with '.' prefix)

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20311131 (main branch discovery), not current.

```diff
    contract UpgradeGatekeeper (0x714B2D10210f2A3a7AA614F949259C87613689aB) {
    +++ description: None
      receivedPermissions.4.role:
+        "admin"
      receivedPermissions.3.role:
+        "admin"
      receivedPermissions.2.role:
+        "admin"
      receivedPermissions.1.role:
+        "admin"
      receivedPermissions.0.role:
+        "admin"
    }
```

Generated with discovered.json: 0x61e519e24c37415c2db75b249b16ec2c78e13c71

# Diff at Tue, 29 Apr 2025 08:19:17 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@ef7477af00fe0b57a2f7cacf7e958c12494af662 block: 20311131
- current block number: 20311131

## Description

Field .issuedPermissions is removed from the output as no longer needed. Added 'permissionsConfigHash' due to refactoring of the modelling process (into a separate command).

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20311131 (main branch discovery), not current.

```diff
    contract Governance (0x02ecef526f806f06357659fFD14834fe82Ef4B04) {
    +++ description: None
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x714B2D10210f2A3a7AA614F949259C87613689aB","via":[]}]
    }
```

```diff
    contract Verifier (0x27C229937745d697d28FC7853d1bFEA7331Edf56) {
    +++ description: None
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x714B2D10210f2A3a7AA614F949259C87613689aB","via":[]}]
    }
```

```diff
    contract PairManager (0x661121AE41edE3f6FECDed922c59acC19A3ea9B3) {
    +++ description: None
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x714B2D10210f2A3a7AA614F949259C87613689aB","via":[]}]
    }
```

```diff
    contract ZkSync (0x8ECa806Aecc86CE90Da803b080Ca4E3A9b8097ad) {
    +++ description: None
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x714B2D10210f2A3a7AA614F949259C87613689aB","via":[]}]
    }
```

```diff
    contract VerifierExit (0x961369d347EF7A6896BDD39cBE2B89e3911f521f) {
    +++ description: None
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x714B2D10210f2A3a7AA614F949259C87613689aB","via":[]}]
    }
```

Generated with discovered.json: 0x590a5dc338d20e789bb5e0ad3ba98f28aa8bf3ed

# Diff at Tue, 04 Mar 2025 10:40:17 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@98d260b45fe0d2195ce5e629bd7b200c8706e8ba block: 20311131
- current block number: 20311131

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20311131 (main branch discovery), not current.

```diff
    contract Governance (0x02ecef526f806f06357659fFD14834fe82Ef4B04) {
    +++ description: None
      sinceBlock:
+        11841962
    }
```

```diff
    contract Verifier (0x27C229937745d697d28FC7853d1bFEA7331Edf56) {
    +++ description: None
      sinceBlock:
+        11841962
    }
```

```diff
    contract ZkSyncCommitBlock (0x2c543eBd91DAB7Be40eDB671D48CeDF35A75e157) {
    +++ description: None
      sinceBlock:
+        11841959
    }
```

```diff
    contract PairManager (0x661121AE41edE3f6FECDed922c59acC19A3ea9B3) {
    +++ description: None
      sinceBlock:
+        11841962
    }
```

```diff
    contract UpgradeGatekeeper (0x714B2D10210f2A3a7AA614F949259C87613689aB) {
    +++ description: None
      sinceBlock:
+        11841962
    }
```

```diff
    contract ZkSyncExit (0x8A1DBf1C32A4f5AfBD70D778F25FBEed7Cc881e5) {
    +++ description: None
      sinceBlock:
+        11841961
    }
```

```diff
    contract ZkSync (0x8ECa806Aecc86CE90Da803b080Ca4E3A9b8097ad) {
    +++ description: None
      sinceBlock:
+        11841962
    }
```

```diff
    contract VerifierExit (0x961369d347EF7A6896BDD39cBE2B89e3911f521f) {
    +++ description: None
      sinceBlock:
+        11841962
    }
```

Generated with discovered.json: 0x314a5a5990f8f8d4800eeb6bbf318a1eb48c1b4c

# Diff at Mon, 20 Jan 2025 11:10:25 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@2c8b4f3d9910bb6371be9b4df87b70856e7d8c64 block: 20311131
- current block number: 20311131

## Description

Rerun on the same block number. Applies fixes to permissions and via field. Renames permission's target to to/from.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20311131 (main branch discovery), not current.

```diff
    contract Governance (0x02ecef526f806f06357659fFD14834fe82Ef4B04) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x714B2D10210f2A3a7AA614F949259C87613689aB"
      issuedPermissions.0.to:
+        "0x714B2D10210f2A3a7AA614F949259C87613689aB"
    }
```

```diff
    contract Verifier (0x27C229937745d697d28FC7853d1bFEA7331Edf56) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x714B2D10210f2A3a7AA614F949259C87613689aB"
      issuedPermissions.0.to:
+        "0x714B2D10210f2A3a7AA614F949259C87613689aB"
    }
```

```diff
    contract PairManager (0x661121AE41edE3f6FECDed922c59acC19A3ea9B3) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x714B2D10210f2A3a7AA614F949259C87613689aB"
      issuedPermissions.0.to:
+        "0x714B2D10210f2A3a7AA614F949259C87613689aB"
    }
```

```diff
    contract UpgradeGatekeeper (0x714B2D10210f2A3a7AA614F949259C87613689aB) {
    +++ description: None
      receivedPermissions.4.target:
-        "0x961369d347EF7A6896BDD39cBE2B89e3911f521f"
      receivedPermissions.4.from:
+        "0x961369d347EF7A6896BDD39cBE2B89e3911f521f"
      receivedPermissions.3.target:
-        "0x8ECa806Aecc86CE90Da803b080Ca4E3A9b8097ad"
      receivedPermissions.3.from:
+        "0x8ECa806Aecc86CE90Da803b080Ca4E3A9b8097ad"
      receivedPermissions.2.target:
-        "0x661121AE41edE3f6FECDed922c59acC19A3ea9B3"
      receivedPermissions.2.from:
+        "0x661121AE41edE3f6FECDed922c59acC19A3ea9B3"
      receivedPermissions.1.target:
-        "0x27C229937745d697d28FC7853d1bFEA7331Edf56"
      receivedPermissions.1.from:
+        "0x27C229937745d697d28FC7853d1bFEA7331Edf56"
      receivedPermissions.0.target:
-        "0x02ecef526f806f06357659fFD14834fe82Ef4B04"
      receivedPermissions.0.from:
+        "0x02ecef526f806f06357659fFD14834fe82Ef4B04"
    }
```

```diff
    contract ZkSync (0x8ECa806Aecc86CE90Da803b080Ca4E3A9b8097ad) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x714B2D10210f2A3a7AA614F949259C87613689aB"
      issuedPermissions.0.to:
+        "0x714B2D10210f2A3a7AA614F949259C87613689aB"
    }
```

```diff
    contract VerifierExit (0x961369d347EF7A6896BDD39cBE2B89e3911f521f) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x714B2D10210f2A3a7AA614F949259C87613689aB"
      issuedPermissions.0.to:
+        "0x714B2D10210f2A3a7AA614F949259C87613689aB"
    }
```

Generated with discovered.json: 0x058a15acf81e695fd70095ddcb4cd99b7adc56bd

# Diff at Mon, 14 Oct 2024 10:58:14 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1afc77ff111ceb0970e7d09efcc7b2f376b0c281 block: 20311131
- current block number: 20311131

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20311131 (main branch discovery), not current.

```diff
    contract Governance (0x02ecef526f806f06357659fFD14834fe82Ef4B04) {
    +++ description: None
      sourceHashes:
+        ["0xa4356b8fe23f3499a5494bac2e9e1588ba6976f987fff80e2261aa7ebaa20ce6","0xdefeaa4f5c4b5e82fe2f743a1c06665f15c301ff4d76a526669ac3fb869d5869"]
    }
```

```diff
    contract ZkSyncCommitBlock (0x2c543eBd91DAB7Be40eDB671D48CeDF35A75e157) {
    +++ description: None
      sourceHashes:
+        ["0x423fde4a6b6351d8f7f10a2e073dedc2c2250adb57d53e7cb226a30202e62863"]
    }
```

```diff
    contract UpgradeGatekeeper (0x714B2D10210f2A3a7AA614F949259C87613689aB) {
    +++ description: None
      sourceHashes:
+        ["0x1359a771e28c9c71730920ab6bee9509009c60908022ff865419a483f74f702b"]
    }
```

```diff
    contract ZkSync (0x8ECa806Aecc86CE90Da803b080Ca4E3A9b8097ad) {
    +++ description: None
      sourceHashes:
+        ["0xa4356b8fe23f3499a5494bac2e9e1588ba6976f987fff80e2261aa7ebaa20ce6","0x86daad8532338dd22b2ad525c7955746dab5c88fca7bbd2e1a7fc07f47b2c5e3"]
    }
```

Generated with discovered.json: 0xa6acd0a48cb14d2675d11fff53d19842f0b19bf2

# Diff at Tue, 01 Oct 2024 11:12:09 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bd754dc73c66120164006054f8d25c5fae9cd910 block: 20311131
- current block number: 20311131

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20311131 (main branch discovery), not current.

```diff
    contract Governance (0x02ecef526f806f06357659fFD14834fe82Ef4B04) {
    +++ description: None
      values.$pastUpgrades:
+        []
    }
```

```diff
    contract Verifier (0x27C229937745d697d28FC7853d1bFEA7331Edf56) {
    +++ description: None
      values.$pastUpgrades:
+        []
    }
```

```diff
    contract PairManager (0x661121AE41edE3f6FECDed922c59acC19A3ea9B3) {
    +++ description: None
      values.$pastUpgrades:
+        []
    }
```

```diff
    contract ZkSync (0x8ECa806Aecc86CE90Da803b080Ca4E3A9b8097ad) {
    +++ description: None
      values.$pastUpgrades:
+        []
    }
```

```diff
    contract VerifierExit (0x961369d347EF7A6896BDD39cBE2B89e3911f521f) {
    +++ description: None
      values.$pastUpgrades:
+        []
    }
```

Generated with discovered.json: 0x76a9a2242f64c827abfaf6f2abd9f1c64031b4ec

# Diff at Fri, 30 Aug 2024 08:01:49 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@6c1bd1f41fadf5f2cb1c1805b5a2c6138a3ed35a block: 20311131
- current block number: 20311131

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20311131 (main branch discovery), not current.

```diff
    contract UpgradeGatekeeper (0x714B2D10210f2A3a7AA614F949259C87613689aB) {
    +++ description: None
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

Generated with discovered.json: 0xe74ba57deee6e3f77678c790ebf779a239d8bd32

# Diff at Fri, 23 Aug 2024 09:56:41 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@67597c7d6c810bc726594446890178150240711e block: 20311131
- current block number: 20311131

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20311131 (main branch discovery), not current.

```diff
    contract Governance (0x02ecef526f806f06357659fFD14834fe82Ef4B04) {
    +++ description: None
      values.$upgradeCount:
+        0
    }
```

```diff
    contract Verifier (0x27C229937745d697d28FC7853d1bFEA7331Edf56) {
    +++ description: None
      values.$upgradeCount:
+        0
    }
```

```diff
    contract PairManager (0x661121AE41edE3f6FECDed922c59acC19A3ea9B3) {
    +++ description: None
      values.$upgradeCount:
+        0
    }
```

```diff
    contract ZkSync (0x8ECa806Aecc86CE90Da803b080Ca4E3A9b8097ad) {
    +++ description: None
      values.$upgradeCount:
+        0
    }
```

```diff
    contract VerifierExit (0x961369d347EF7A6896BDD39cBE2B89e3911f521f) {
    +++ description: None
      values.$upgradeCount:
+        0
    }
```

Generated with discovered.json: 0x8fa4e1346136bd222c7037e70a14118ed8ccd319

# Diff at Wed, 21 Aug 2024 10:07:05 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@2f6dde3357bf5d79196b6e94f79d853a6c4ec72b block: 20311131
- current block number: 20311131

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20311131 (main branch discovery), not current.

```diff
    contract Governance (0x02ecef526f806f06357659fFD14834fe82Ef4B04) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x714B2D10210f2A3a7AA614F949259C87613689aB","via":[]}]
    }
```

```diff
    contract Verifier (0x27C229937745d697d28FC7853d1bFEA7331Edf56) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x714B2D10210f2A3a7AA614F949259C87613689aB","via":[]}]
    }
```

```diff
    contract PairManager (0x661121AE41edE3f6FECDed922c59acC19A3ea9B3) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x714B2D10210f2A3a7AA614F949259C87613689aB","via":[]}]
    }
```

```diff
    contract UpgradeGatekeeper (0x714B2D10210f2A3a7AA614F949259C87613689aB) {
    +++ description: None
      assignedPermissions:
-        {"upgrade":["0x02ecef526f806f06357659fFD14834fe82Ef4B04","0x27C229937745d697d28FC7853d1bFEA7331Edf56","0x661121AE41edE3f6FECDed922c59acC19A3ea9B3","0x8ECa806Aecc86CE90Da803b080Ca4E3A9b8097ad","0x961369d347EF7A6896BDD39cBE2B89e3911f521f"]}
      receivedPermissions:
+        [{"permission":"upgrade","target":"0x02ecef526f806f06357659fFD14834fe82Ef4B04","via":[]},{"permission":"upgrade","target":"0x27C229937745d697d28FC7853d1bFEA7331Edf56","via":[]},{"permission":"upgrade","target":"0x661121AE41edE3f6FECDed922c59acC19A3ea9B3","via":[]},{"permission":"upgrade","target":"0x8ECa806Aecc86CE90Da803b080Ca4E3A9b8097ad","via":[]},{"permission":"upgrade","target":"0x961369d347EF7A6896BDD39cBE2B89e3911f521f","via":[]}]
    }
```

```diff
    contract ZkSync (0x8ECa806Aecc86CE90Da803b080Ca4E3A9b8097ad) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x714B2D10210f2A3a7AA614F949259C87613689aB","via":[]}]
    }
```

```diff
    contract VerifierExit (0x961369d347EF7A6896BDD39cBE2B89e3911f521f) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x714B2D10210f2A3a7AA614F949259C87613689aB","via":[]}]
    }
```

Generated with discovered.json: 0x0a81d4628ddafebcfee55fda9e3fc6dec4821551

# Diff at Fri, 09 Aug 2024 12:03:15 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bf40aa32f030fd312056ca0ef198c8550467d1d7 block: 20311131
- current block number: 20311131

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20311131 (main branch discovery), not current.

```diff
    contract UpgradeGatekeeper (0x714B2D10210f2A3a7AA614F949259C87613689aB) {
    +++ description: None
      assignedPermissions.upgrade.4:
-        "0x27C229937745d697d28FC7853d1bFEA7331Edf56"
+        "0x961369d347EF7A6896BDD39cBE2B89e3911f521f"
      assignedPermissions.upgrade.3:
-        "0x661121AE41edE3f6FECDed922c59acC19A3ea9B3"
+        "0x8ECa806Aecc86CE90Da803b080Ca4E3A9b8097ad"
      assignedPermissions.upgrade.2:
-        "0x961369d347EF7A6896BDD39cBE2B89e3911f521f"
+        "0x661121AE41edE3f6FECDed922c59acC19A3ea9B3"
      assignedPermissions.upgrade.1:
-        "0x8ECa806Aecc86CE90Da803b080Ca4E3A9b8097ad"
+        "0x27C229937745d697d28FC7853d1bFEA7331Edf56"
    }
```

Generated with discovered.json: 0xee68fa5ea0013ed1c8d23010fa3e4aab47604ba3

# Diff at Fri, 09 Aug 2024 10:13:14 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f0da1d0aab7bc6b3b5e54e7e93480bd98e57035 block: 20311131
- current block number: 20311131

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20311131 (main branch discovery), not current.

```diff
    contract UpgradeGatekeeper (0x714B2D10210f2A3a7AA614F949259C87613689aB) {
    +++ description: None
      assignedPermissions.admin:
-        ["0x02ecef526f806f06357659fFD14834fe82Ef4B04","0x27C229937745d697d28FC7853d1bFEA7331Edf56","0x661121AE41edE3f6FECDed922c59acC19A3ea9B3","0x8ECa806Aecc86CE90Da803b080Ca4E3A9b8097ad","0x961369d347EF7A6896BDD39cBE2B89e3911f521f"]
      assignedPermissions.upgrade:
+        ["0x02ecef526f806f06357659fFD14834fe82Ef4B04","0x8ECa806Aecc86CE90Da803b080Ca4E3A9b8097ad","0x961369d347EF7A6896BDD39cBE2B89e3911f521f","0x661121AE41edE3f6FECDed922c59acC19A3ea9B3","0x27C229937745d697d28FC7853d1bFEA7331Edf56"]
    }
```

Generated with discovered.json: 0xd2c24cd05e33d7aa72ce69207779cd8fc184fdb9

