Generated with discovered.json: 0xab9a036a6cd39f92fa50a2898a15a0a44759afd8

# Diff at Mon, 10 Mar 2025 14:56:56 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@5f0894cc624e3206ceca83cdf36ddd08f1e90538 block: 26689586
- current block number: 30784081

## Description

Provide description of changes. This section will be preserved.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 26689586 (main branch discovery), not current.

```diff
+   Status: CREATED
    contract OpticsV2Governor (0x070c2843402Aa0637ae0F2E2edf601aAB5E72509)
    +++ description: None
```

```diff
+   Status: CREATED
    contract UpgradeBeacon (0x45D35F60Ccf8F7031FB5A09954Cd923A9E84F89d)
    +++ description: None
```

```diff
+   Status: CREATED
    contract undefined (0x63c079444e07D82d33399DE7D56d6E48740494c7)
    +++ description: None
```

```diff
+   Status: CREATED
    contract undefined (0x7519Db53B63d72721470319A5F4462D587Bb3008)
    +++ description: None
```

```diff
+   Status: CREATED
    contract undefined (0x7d7cd2ED526F99D05A05a93CCf42C1ADdBe78552)
    +++ description: None
```

```diff
+   Status: CREATED
    contract UpgradeBeaconProxy (0x913EE05036f3cbc94Ee4afDea87ceb430524648a)
    +++ description: None
```

```diff
+   Status: CREATED
    contract undefined (0xa725898D6F73C512f803B564A89DFbd96cF298EC)
    +++ description: None
```

```diff
+   Status: CREATED
    contract XAppConnectionManager (0xaa099aF87ACE9E437b9B410a687F263eeaeC4321)
    +++ description: None
```

```diff
+   Status: CREATED
    contract BeaconProxy (0xd13aC1024d266B73180cA7445Ca0E78b3Acfe8CE)
    +++ description: None
```

```diff
+   Status: CREATED
    contract undefined (0xd85DC9A21378EF738A248236E970c2e0be89C9c2)
    +++ description: None
```

```diff
+   Status: CREATED
    contract UpgradeBeaconController (0xDB2E83bA806C637086Be7174e3636bd7aCE3ae0e)
    +++ description: None
```

```diff
+   Status: CREATED
    contract undefined (0xeE2b1e23e71052860C14f69E84AAF78478606D63)
    +++ description: None
```

```diff
+   Status: CREATED
    contract undefined (0xFCcD3516d6BB62b009088aDae1E349430dDF6e77)
    +++ description: None
```

Generated with discovered.json: 0x8c8ec2092b76355e66b19ad5eca12231a09f63ae

# Diff at Thu, 27 Feb 2025 11:12:13 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@dd67aa263dbf676cd3ff7e986b95cc7a52f3991b block: 26689586
- current block number: 26689586

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 26689586 (main branch discovery), not current.

```diff
-   Status: DELETED
    contract UpgradeBeacon (0x4a594E07D5295E4e4cd1fF728e85a317A20A5010)
    +++ description: None
```

```diff
-   Status: DELETED
    contract UpgradeBeaconController (0x5A4E9B127183130b1814858F6ca5d1B1c6d799Ee)
    +++ description: None
```

```diff
-   Status: DELETED
    contract UpgradeBeaconProxy (0x5EE2BA07742D9276b2F51Ee4AD949016b7F164c1)
    +++ description: None
```

```diff
    contract BeaconProxy (0xd13aC1024d266B73180cA7445Ca0E78b3Acfe8CE) {
    +++ description: None
      issuedPermissions.0.to:
-        "0x5A4E9B127183130b1814858F6ca5d1B1c6d799Ee"
+        "0xDB2E83bA806C637086Be7174e3636bd7aCE3ae0e"
      values.$admin:
-        "0x5A4E9B127183130b1814858F6ca5d1B1c6d799Ee"
+        "0xDB2E83bA806C637086Be7174e3636bd7aCE3ae0e"
      values.$implementation:
-        "0x8Dbce625664E61Bd3902Ec84DE5E22d2B12c3fb6"
+        "0xd37d1f682Ff556C5B6C4Eb58075a93747379A3d7"
      values.$pastUpgrades.0.2.0:
-        "0x8Dbce625664E61Bd3902Ec84DE5E22d2B12c3fb6"
+        "0xd37d1f682Ff556C5B6C4Eb58075a93747379A3d7"
      values.$pastUpgrades.0.1:
-        "0xde8dc7be51fd7efb7940f1c079ad9c47107e15911a3388264cd14a660af92fe5"
+        "0xa360ab72c136ac975030f7fab25f2f51bd9c8ed76a98d1e028c2c2767096bbdf"
      values.$pastUpgrades.0.0:
-        "2022-07-12T10:32:51.000Z"
+        "2021-11-26T21:02:52.000Z"
      values.OpticsBeacon_beacon:
-        "0x4a594E07D5295E4e4cd1fF728e85a317A20A5010"
+        "0x45D35F60Ccf8F7031FB5A09954Cd923A9E84F89d"
    }
```

```diff
+   Status: CREATED
    contract UpgradeBeacon (0x45D35F60Ccf8F7031FB5A09954Cd923A9E84F89d)
    +++ description: None
```

```diff
+   Status: CREATED
    contract UpgradeBeaconController (0xDB2E83bA806C637086Be7174e3636bd7aCE3ae0e)
    +++ description: None
```

Generated with discovered.json: 0xcb4d9b8d6731b5fb65c0e30ab76c7b7647c45010

# Diff at Mon, 20 Jan 2025 11:10:46 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@2c8b4f3d9910bb6371be9b4df87b70856e7d8c64 block: 26689586
- current block number: 26689586

## Description

Rerun on the same block number. Applies fixes to permissions and via field. Renames permission's target to to/from.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 26689586 (main branch discovery), not current.

```diff
    contract UpgradeBeaconController (0x5A4E9B127183130b1814858F6ca5d1B1c6d799Ee) {
    +++ description: None
      receivedPermissions.0.target:
-        "0xd13aC1024d266B73180cA7445Ca0E78b3Acfe8CE"
      receivedPermissions.0.from:
+        "0xd13aC1024d266B73180cA7445Ca0E78b3Acfe8CE"
    }
```

```diff
    contract BeaconProxy (0xd13aC1024d266B73180cA7445Ca0E78b3Acfe8CE) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x5A4E9B127183130b1814858F6ca5d1B1c6d799Ee"
      issuedPermissions.0.to:
+        "0x5A4E9B127183130b1814858F6ca5d1B1c6d799Ee"
    }
```

Generated with discovered.json: 0x8585505f4a64dc31385cafa3b2c783061d21bb75

# Diff at Mon, 21 Oct 2024 11:15:30 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@8895d33866f5665c4c710f4ddaa32bfa63cc3c78 block: 26689586
- current block number: 26689586

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 26689586 (main branch discovery), not current.

```diff
    contract BeaconProxy (0xd13aC1024d266B73180cA7445Ca0E78b3Acfe8CE) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0x8Dbce625664E61Bd3902Ec84DE5E22d2B12c3fb6"]
      values.$pastUpgrades.0.1:
-        ["0x8Dbce625664E61Bd3902Ec84DE5E22d2B12c3fb6"]
+        "0xde8dc7be51fd7efb7940f1c079ad9c47107e15911a3388264cd14a660af92fe5"
    }
```

Generated with discovered.json: 0xdf13dea7fbbb7baea3086f7c4a3333fb137e72a6

# Diff at Mon, 14 Oct 2024 11:00:45 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1afc77ff111ceb0970e7d09efcc7b2f376b0c281 block: 26689586
- current block number: 26689586

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 26689586 (main branch discovery), not current.

```diff
    contract OpticsV2Governor (0x070c2843402Aa0637ae0F2E2edf601aAB5E72509) {
    +++ description: None
      sourceHashes:
+        ["0x81a7349eebb98ac33b0bc6842e3cb258034a8f2a4ba004570bb8e2e25947f9ff","0xd42bbf9f7dcd3720a7fc6bdc6edfdfae8800a37d6dd4decfa0ef6ca4a2e88940"]
    }
```

```diff
    contract UpgradeBeacon (0x4a594E07D5295E4e4cd1fF728e85a317A20A5010) {
    +++ description: None
      sourceHashes:
+        ["0x22841c972728a5327e28da1a887ae68b6db4dc5f1d658e516abcba1a265b21d8"]
    }
```

```diff
    contract UpgradeBeaconController (0x5A4E9B127183130b1814858F6ca5d1B1c6d799Ee) {
    +++ description: None
      sourceHashes:
+        ["0x12e387edec9bf90c8c2ee351a4b607488ae3e01f861eb7dabbf3e4fdd078ad48"]
    }
```

```diff
    contract UpgradeBeaconProxy (0x5EE2BA07742D9276b2F51Ee4AD949016b7F164c1) {
    +++ description: None
      sourceHashes:
+        ["0xbe5d364ff65b55d089681036cc772258083d96100d71309b7cd76d6f69ced388"]
    }
```

```diff
    contract UpgradeBeaconProxy (0x913EE05036f3cbc94Ee4afDea87ceb430524648a) {
    +++ description: None
      sourceHashes:
+        ["0xbe5d364ff65b55d089681036cc772258083d96100d71309b7cd76d6f69ced388"]
    }
```

```diff
    contract XAppConnectionManager (0xaa099aF87ACE9E437b9B410a687F263eeaeC4321) {
    +++ description: None
      sourceHashes:
+        ["0xb64e5af8c508ce86c29728805a64c3b45bf37a0a28c4ea602902a3e23de80dfd"]
    }
```

```diff
    contract BeaconProxy (0xd13aC1024d266B73180cA7445Ca0E78b3Acfe8CE) {
    +++ description: None
      sourceHashes:
+        ["0xbe5d364ff65b55d089681036cc772258083d96100d71309b7cd76d6f69ced388","0xfe51330f918cf664ca579984982dbeeab54d9a2461dcd1938ff2d46b9c77b306"]
    }
```

Generated with discovered.json: 0x5f7f3a34564634f4b6bb89fb0bd70a3154322e6f

# Diff at Tue, 01 Oct 2024 11:14:17 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bd754dc73c66120164006054f8d25c5fae9cd910 block: 26689586
- current block number: 26689586

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 26689586 (main branch discovery), not current.

```diff
    contract BeaconProxy (0xd13aC1024d266B73180cA7445Ca0E78b3Acfe8CE) {
    +++ description: None
      values.$pastUpgrades:
+        [["2022-07-12T10:32:51.000Z",["0x8Dbce625664E61Bd3902Ec84DE5E22d2B12c3fb6"]]]
      values.$upgradeCount:
+        1
    }
```

Generated with discovered.json: 0xe1a5fd42d4d3a356b8500da014c3aa9aedfe3a3f

# Diff at Fri, 30 Aug 2024 08:17:40 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@6c1bd1f41fadf5f2cb1c1805b5a2c6138a3ed35a block: 26689586
- current block number: 26689586

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 26689586 (main branch discovery), not current.

```diff
    contract UpgradeBeaconController (0x5A4E9B127183130b1814858F6ca5d1B1c6d799Ee) {
    +++ description: None
      receivedPermissions.0.via:
-        []
    }
```

Generated with discovered.json: 0xd0e434256713cff52bdad5cc57a21425d3262042

# Diff at Wed, 21 Aug 2024 10:08:47 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@2f6dde3357bf5d79196b6e94f79d853a6c4ec72b block: 26689586
- current block number: 26689586

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 26689586 (main branch discovery), not current.

```diff
    contract UpgradeBeaconController (0x5A4E9B127183130b1814858F6ca5d1B1c6d799Ee) {
    +++ description: None
      assignedPermissions:
-        {"upgrade":["0xd13aC1024d266B73180cA7445Ca0E78b3Acfe8CE"]}
      receivedPermissions:
+        [{"permission":"upgrade","target":"0xd13aC1024d266B73180cA7445Ca0E78b3Acfe8CE","via":[]}]
    }
```

```diff
    contract BeaconProxy (0xd13aC1024d266B73180cA7445Ca0E78b3Acfe8CE) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x5A4E9B127183130b1814858F6ca5d1B1c6d799Ee","via":[]}]
    }
```

Generated with discovered.json: 0xad9ad037209a2fe6758cdc1b619b30d3eb928b38

# Diff at Fri, 09 Aug 2024 10:14:54 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f0da1d0aab7bc6b3b5e54e7e93480bd98e57035 block: 26689586
- current block number: 26689586

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 26689586 (main branch discovery), not current.

```diff
    contract OpticsV2Governor (0x070c2843402Aa0637ae0F2E2edf601aAB5E72509) {
    +++ description: None
      values.$multisigThreshold:
-        "4 of 7 (57%)"
      values.getOwners:
-        ["0xFCcD3516d6BB62b009088aDae1E349430dDF6e77","0x63c079444e07D82d33399DE7D56d6E48740494c7","0xa725898D6F73C512f803B564A89DFbd96cF298EC","0xd85DC9A21378EF738A248236E970c2e0be89C9c2","0xeE2b1e23e71052860C14f69E84AAF78478606D63","0x7d7cd2ED526F99D05A05a93CCf42C1ADdBe78552","0x7519Db53B63d72721470319A5F4462D587Bb3008"]
      values.getThreshold:
-        4
      values.$members:
+        ["0xFCcD3516d6BB62b009088aDae1E349430dDF6e77","0x63c079444e07D82d33399DE7D56d6E48740494c7","0xa725898D6F73C512f803B564A89DFbd96cF298EC","0xd85DC9A21378EF738A248236E970c2e0be89C9c2","0xeE2b1e23e71052860C14f69E84AAF78478606D63","0x7d7cd2ED526F99D05A05a93CCf42C1ADdBe78552","0x7519Db53B63d72721470319A5F4462D587Bb3008"]
      values.$threshold:
+        4
      values.multisigThreshold:
+        "4 of 7 (57%)"
    }
```

```diff
    contract UpgradeBeaconController (0x5A4E9B127183130b1814858F6ca5d1B1c6d799Ee) {
    +++ description: None
      assignedPermissions.admin:
-        ["0xd13aC1024d266B73180cA7445Ca0E78b3Acfe8CE"]
      assignedPermissions.upgrade:
+        ["0xd13aC1024d266B73180cA7445Ca0E78b3Acfe8CE"]
    }
```

Generated with discovered.json: 0x7f6afaddf7e2768d1d260166b0e7f230d67a9ba1

# Diff at Thu, 28 Mar 2024 11:34:42 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@21187e63b9b90823a55c461c331868a470ce17eb block: 21838858
- current block number: 24791025

## Description

Update discovery to include the multisig threshold.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21838858 (main branch discovery), not current.

```diff
    contract OpticsV2Governor (0x070c2843402Aa0637ae0F2E2edf601aAB5E72509) {
    +++ description: None
      upgradeability.threshold:
+        "4 of 7 (57%)"
    }
```

Generated with discovered.json: 0xe0eb643589af786ceaa130d75b2bd202d54100f7

# Diff at Mon, 09 Oct 2023 14:48:14 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@

## Description

Multisig that can upgrade Optics V2 contracts across domains.

## Watched changes

```diff
+   Status: CREATED
    contract OpticsV2Governor (0x070c2843402Aa0637ae0F2E2edf601aAB5E72509) {
    }
```

```diff
+   Status: CREATED
    contract UpgradeBeaconController (0x5A4E9B127183130b1814858F6ca5d1B1c6d799Ee) {
    }
```

```diff
+   Status: CREATED
    contract UpgradeBeaconProxy (0x5EE2BA07742D9276b2F51Ee4AD949016b7F164c1) {
    }
```

```diff
+   Status: CREATED
    contract UpgradeBeaconProxy (0x913EE05036f3cbc94Ee4afDea87ceb430524648a) {
    }
```

```diff
+   Status: CREATED
    contract XAppConnectionManager (0xaa099aF87ACE9E437b9B410a687F263eeaeC4321) {
    }
```

```diff
+   Status: CREATED
    contract BeaconProxy (0xd13aC1024d266B73180cA7445Ca0E78b3Acfe8CE) {
    }
```
