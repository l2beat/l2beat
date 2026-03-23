Generated with discovered.json: 0x6dcc1831691b155d7d398e7e3ff9b613ea2dc823

# Diff at Mon, 23 Mar 2026 10:56:56 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@79c8d09002c573459ff3a2b1b9f07ec4cc530fa9 block: 1772444704
- current timestamp: 1772444704

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1772444704 (main branch discovery), not current.

```diff
    contract AxelarGasService (eth:0x2d5d7d31F671F86C782533cc367F14109a082712) {
    +++ description: None
      category:
+        {"name":"Non-Critical","priority":0}
    }
```

```diff
    EOA  (eth:0x6f24A47Fc8AE5441Eb47EFfC3665e70e69Ac3F05) {
    +++ description: None
      controlsMajorityOfUpgradePermissions:
-        true
    }
```

Generated with discovered.json: 0xf5d06d94cfa8c3f6da273e9c8aa7e55c4241d7d4

# Diff at Mon, 02 Mar 2026 09:46:12 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- current timestamp: 1772444704

## Description

move to baseproj.

## Initial discovery

```diff
+   Status: CREATED
    contract AxelarGasService (eth:0x2d5d7d31F671F86C782533cc367F14109a082712)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Gateway (eth:0x4F4495243837681061C4743b74B3eEdf548D56A5)
    +++ description: None
```

```diff
+   Status: CREATED
    contract AxelarGasServiceOperators (eth:0x7DdB2d76b80B0AA19bDEa48EB1301182F4CeefbC)
    +++ description: None
```

```diff
+   Status: CREATED
    contract TokenDeployer (eth:0xb28478319B64f8D47e19A120209A211D902F8b8f)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Multisig (eth:0xCC940AE49C78F20E3F13F3cF37e996b98Ac3EC68)
    +++ description: None
```

```diff
+   Status: CREATED
    contract AxelarAuthWeighted (eth:0xE3B83f79Fbf01B25659f8A814945aB82186A8AD0)
    +++ description: None
```

```diff
+   Status: CREATED
    contract InterchainGovernance (eth:0xfDF36A30070ea0241d69052ea85ff44Ad0476a66)
    +++ description: None
```
