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
