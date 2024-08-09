Generated with discovered.json: 0xd31d855c922f921d764b8f36251763b2f255f896

# Diff at Fri, 09 Aug 2024 10:11:00 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f0da1d0aab7bc6b3b5e54e7e93480bd98e57035 block: 20311133
- current block number: 20311133

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20311133 (main branch discovery), not current.

```diff
    contract RecoveryManager (0x2bB2a5A724170357cb691841F40d26A950d8C33D) {
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
    contract UpgradeBeaconController (0x4F50a7081792063693F46A6402390b9647562457) {
    +++ description: None
      assignedPermissions.admin:
-        ["0x27658c5556A9a57f96E69Bbf6d3B8016f001a785","0x4fc16De11deAc71E8b2Db539d82d93BE4b486892","0xa73a3a74C7044B5411bD61E1990618A1400DA379","0xcbcF180dbd02460dCFCdD282A0985DdC049a4c94"]
      assignedPermissions.upgrade:
+        ["0x27658c5556A9a57f96E69Bbf6d3B8016f001a785","0x4fc16De11deAc71E8b2Db539d82d93BE4b486892","0xcbcF180dbd02460dCFCdD282A0985DdC049a4c94","0xa73a3a74C7044B5411bD61E1990618A1400DA379"]
    }
```

Generated with discovered.json: 0xe8a5954f2f6314cdde947a285a82dc54525aad41

# Diff at Thu, 28 Mar 2024 10:31:37 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@dd32bb06b292cc8459fb09925454ee3a90f5c27e block: 19218300
- current block number: 19532028

## Description

Update discovery to include the multisig threshold.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19218300 (main branch discovery), not current.

```diff
    contract RecoveryManager (0x2bB2a5A724170357cb691841F40d26A950d8C33D) {
    +++ description: None
      upgradeability.threshold:
+        "4 of 7 (57%)"
    }
```

Generated with discovered.json: 0x49181e4503e9468845b1d08bde6efff7f7601e23

# Diff at Fri, 13 Oct 2023 07:04:29 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@28e18077472448efd6132e6ee714b582cc1ee80b

## Description

Newly created contracts are the result of rediscovering the `upgradeBeacon` address.

## Watched changes

```diff
+   Status: CREATED
    contract HomeUpgradeBeacon (0x101a39eA1143cb252fc8093847399046fc35Db89) {
    }
```

```diff
+   Status: CREATED
    contract GovernanceUpgradeBeacon (0x4d89F34dB307015F8002F97c1d100d84e3AFb76c) {
    }
```

```diff
+   Status: CREATED
    contract ReplicaUpgradeBeacon (0xA734EDE8229970776e1B68085D579b6b6E97dAd4) {
    }
```

```diff
+   Status: CREATED
    contract BridgeUpgradeBeacon (0xB6bB41B1fb8c381b002C405B8abB5D1De0C0abFE) {
    }
```

# Diff at Mon, 09 Oct 2023 13:00:07 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@

## Description

Added config.

## Watched changes

```diff
+   Status: CREATED
    contract ReplicaBeaconProxy (0x27658c5556A9a57f96E69Bbf6d3B8016f001a785) {
    }
```

```diff
+   Status: CREATED
    contract RecoveryManager (0x2bB2a5A724170357cb691841F40d26A950d8C33D) {
    }
```

```diff
+   Status: CREATED
    contract UpgradeBeaconController (0x4F50a7081792063693F46A6402390b9647562457) {
    }
```

```diff
+   Status: CREATED
    contract BridgeRouterBeaconProxy (0x4fc16De11deAc71E8b2Db539d82d93BE4b486892) {
    }
```

```diff
+   Status: CREATED
    contract UpdaterManager (0x81B97dfBB743c343983e9bE7B863dB636DbD7373) {
    }
```

```diff
+   Status: CREATED
    contract XAppConnectionManager (0x8A926cE79f83A5A4C234BeE93feAFCC85b1E40cD) {
    }
```

```diff
+   Status: CREATED
    contract HomeBeaconProxy (0xa73a3a74C7044B5411bD61E1990618A1400DA379) {
    }
```

```diff
+   Status: CREATED
    contract GovernanceRouterBeaconProxy (0xcbcF180dbd02460dCFCdD282A0985DdC049a4c94) {
    }
```
