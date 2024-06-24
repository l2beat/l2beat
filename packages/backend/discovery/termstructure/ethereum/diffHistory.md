Generated with discovered.json: 0xfc94d852cc757aaa8eb07e729a8cc8373af1756d

# Diff at Fri, 21 Jun 2024 06:55:16 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@1ba6434de248c46d9e6b140264866a3072082af4 block: 20019330
- current block number: 20138435

## Description

Config related!

## Watched changes

```diff
    contract GnosisSafeProxy (0x23bCad9BFB1378cd45b32525B835F037b673f529) {
    +++ description: None
      name:
-        "GnosisSafeProxy"
+        "GnosisSafe"
      upgradeability.type:
-        "immutable"
+        "gnosis safe"
      upgradeability.masterCopy:
+        "0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
      upgradeability.modules:
+        []
      upgradeability.threshold:
+        "1 of 2 (50%)"
      implementations:
+        ["0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"]
      values:
+        {"domainSeparator":"0xcbdbe6506e1cb79232f4c965204bb95931a2e6dbfe5aaf5dd3b10f93d06d404a","getChainId":1,"getOwners":["0x871679A28adDdaB762a8C6Ff010d2D9Ffa38d348","0xa7197E776F2abFCDe1Fa662aBa5A4B86a02f0F93"],"getThreshold":1,"nonce":0,"VERSION":"1.3.0"}
    }
```

```diff
    contract GnosisSafeProxy (0x2df3e912aeDe36ea5EaB06232ca3b239a40A8165) {
    +++ description: None
      name:
-        "GnosisSafeProxy"
+        "GnosisSafe"
      upgradeability.type:
-        "immutable"
+        "gnosis safe"
      upgradeability.masterCopy:
+        "0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
      upgradeability.modules:
+        []
      upgradeability.threshold:
+        "1 of 2 (50%)"
      implementations:
+        ["0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"]
      values:
+        {"domainSeparator":"0xa8d496ef58694c5b643be9bfdef2a52066c56fe63e93ee7b0d35bfd3c7385cd5","getChainId":1,"getOwners":["0x871679A28adDdaB762a8C6Ff010d2D9Ffa38d348","0xa7197E776F2abFCDe1Fa662aBa5A4B86a02f0F93"],"getThreshold":1,"nonce":0,"VERSION":"1.3.0"}
    }
```

```diff
    contract GnosisSafeProxy (0xB7ef7117FfCa1956249B666D9fdBe182cFbbF5ca) {
    +++ description: None
      name:
-        "GnosisSafeProxy"
+        "GnosisSafe"
      upgradeability.type:
-        "immutable"
+        "gnosis safe"
      upgradeability.masterCopy:
+        "0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
      upgradeability.modules:
+        []
      upgradeability.threshold:
+        "1 of 2 (50%)"
      implementations:
+        ["0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"]
      values:
+        {"domainSeparator":"0x06a4de0d5b7b1171090ba38e2dc6ef3c5e2c8219915ef5a272fad0d29f2a9c06","getChainId":1,"getOwners":["0x871679A28adDdaB762a8C6Ff010d2D9Ffa38d348","0xa7197E776F2abFCDe1Fa662aBa5A4B86a02f0F93"],"getThreshold":1,"nonce":0,"VERSION":"1.3.0"}
    }
```

## Source code changes

```diff
.../GnosisSafe.sol                                 | 952 +++++++++++++++++++++
 .../GnosisSafeProxy.p.sol}                         |   0
 .../GnosisSafe.sol                                 | 952 +++++++++++++++++++++
 .../GnosisSafeProxy.p.sol}                         |   0
 .../GnosisSafe.sol                                 | 952 +++++++++++++++++++++
 .../GnosisSafeProxy.p.sol}                         |   0
 6 files changed, 2856 insertions(+)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20019330 (main branch discovery), not current.

```diff
    contract GnosisSafe (0x23bCad9BFB1378cd45b32525B835F037b673f529) {
    +++ description: None
      name:
-        "GnosisSafe"
+        "GnosisSafeProxy"
      upgradeability.type:
-        "gnosis safe"
+        "immutable"
      upgradeability.masterCopy:
-        "0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
      upgradeability.modules:
-        []
      upgradeability.threshold:
-        "1 of 2 (50%)"
      implementations:
-        ["0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"]
      values:
-        {"domainSeparator":"0xcbdbe6506e1cb79232f4c965204bb95931a2e6dbfe5aaf5dd3b10f93d06d404a","getChainId":1,"getOwners":["0x871679A28adDdaB762a8C6Ff010d2D9Ffa38d348","0xa7197E776F2abFCDe1Fa662aBa5A4B86a02f0F93"],"getThreshold":1,"nonce":0,"VERSION":"1.3.0"}
    }
```

```diff
    contract GnosisSafe (0x2df3e912aeDe36ea5EaB06232ca3b239a40A8165) {
    +++ description: None
      name:
-        "GnosisSafe"
+        "GnosisSafeProxy"
      upgradeability.type:
-        "gnosis safe"
+        "immutable"
      upgradeability.masterCopy:
-        "0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
      upgradeability.modules:
-        []
      upgradeability.threshold:
-        "1 of 2 (50%)"
      implementations:
-        ["0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"]
      values:
-        {"domainSeparator":"0xa8d496ef58694c5b643be9bfdef2a52066c56fe63e93ee7b0d35bfd3c7385cd5","getChainId":1,"getOwners":["0x871679A28adDdaB762a8C6Ff010d2D9Ffa38d348","0xa7197E776F2abFCDe1Fa662aBa5A4B86a02f0F93"],"getThreshold":1,"nonce":0,"VERSION":"1.3.0"}
    }
```

```diff
    contract GnosisSafe (0xB7ef7117FfCa1956249B666D9fdBe182cFbbF5ca) {
    +++ description: None
      name:
-        "GnosisSafe"
+        "GnosisSafeProxy"
      upgradeability.type:
-        "gnosis safe"
+        "immutable"
      upgradeability.masterCopy:
-        "0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
      upgradeability.modules:
-        []
      upgradeability.threshold:
-        "1 of 2 (50%)"
      implementations:
-        ["0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"]
      values:
-        {"domainSeparator":"0x06a4de0d5b7b1171090ba38e2dc6ef3c5e2c8219915ef5a272fad0d29f2a9c06","getChainId":1,"getOwners":["0x871679A28adDdaB762a8C6Ff010d2D9Ffa38d348","0xa7197E776F2abFCDe1Fa662aBa5A4B86a02f0F93"],"getThreshold":1,"nonce":0,"VERSION":"1.3.0"}
    }
```

Generated with discovered.json: 0xdd7e6ae1259e987219a32f2ccd683afc95e2e8be

# Diff at Tue, 04 Jun 2024 15:23:37 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@ff4734badb34915faebacc7140d595936b262e64 block: 20018580
- current block number: 20019330

## Description

Config changes to the discovery, no relevant onchain changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20018580 (main branch discovery), not current.

```diff
    contract ZkTrueUp (0x09E01425780094a9754B2bd8A3298f73ce837CF9) {
    +++ description: None
      values.getAaveV3Pool:
+        "0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2"
      values.getPoseidonUnit2:
+        "0x3B1D7E06a1bFfD89ECd8026CF287C11F6Ec34f0D"
    }
```

```diff
-   Status: DELETED
    contract WETH9 (0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2)
    +++ description: None
```

```diff
+   Status: CREATED
    contract  (0x3B1D7E06a1bFfD89ECd8026CF287C11F6Ec34f0D)
    +++ description: None
```

Generated with discovered.json: 0x7385a1d70af503a9ff4d64a713c79e405f0c3b3a

# Diff at Tue, 04 Jun 2024 12:52:59 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- current block number: 20018580

## Description

Initial discovery: zksync lite fork with considerable modifications.

## Initial discovery

```diff
+   Status: CREATED
    contract ZkTrueUp (0x09E01425780094a9754B2bd8A3298f73ce837CF9)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Verifier (0x23369A60E5A8f422E38d799eD55e7AD8Ed4A86cE)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafe (0x23bCad9BFB1378cd45b32525B835F037b673f529)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafe (0x2df3e912aeDe36ea5EaB06232ca3b239a40A8165)
    +++ description: None
```

```diff
+   Status: CREATED
    contract EvacuationFacet (0x882aBFb2F6A67d36350499991638044e8Bd83a72)
    +++ description: None
```

```diff
+   Status: CREATED
    contract AccountFacet (0x8D0fc76595E42f38c771ecEE627DA5654Ca2E75A)
    +++ description: None
```

```diff
+   Status: CREATED
    contract RollupFacet (0x955cdD2E56Ca2776a101a552A318d28fe311398D)
    +++ description: None
```

```diff
+   Status: CREATED
    contract EvacuVerifier (0x9c7Df3981A89eD04588907843fe2a6c1BcCc4467)
    +++ description: None
```

```diff
+   Status: CREATED
    contract TermStructureMultisig (0xa00d50A40B1635D293c87BA36503bD2504b5D818)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafe (0xB7ef7117FfCa1956249B666D9fdBe182cFbbF5ca)
    +++ description: None
```

```diff
+   Status: CREATED
    contract WETH9 (0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2)
    +++ description: None
```
