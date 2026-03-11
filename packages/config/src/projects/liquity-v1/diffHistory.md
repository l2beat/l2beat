Generated with discovered.json: 0xfce5aa699409dacd9ec2334380ba782bc2ef8b9a

# Diff at Tue, 10 Mar 2026 11:12:58 GMT:

- author: unknown (<unknown>)
- comparing to: main@833e2507bdbb241b638e22adfc9f5d63f2415f1e block: 1772453602
- current timestamp: 1772453602

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1772453602 (main branch discovery), not current.

```diff
-   Status: DELETED
    contract GnosisSafe (eth:0x21f73D42Eb58Ba49dDB685dc29D3bF5c0f0373CA)
    +++ description: None
```

```diff
    contract BorrowerOperations (eth:0x24179CD81c9e782A4096035f7eC97fB8B783e007) {
    +++ description: None
      values.getCompositeDebt:
-        ["200000000000000000000","200000000000000000001","200000000000000000002","200000000000000000003","200000000000000000004"]
      errors:
-        {"getCompositeDebt":"Processing error occurred."}
      template:
+        "liquity-v2/BorrowerOperations"
    }
```

```diff
-   Status: DELETED
    contract Chainlink LUSD/USD Price Feed (eth:0x3D7aE7E594f2f2091Ad8798313450130d0Aba3a0)
    +++ description: None
```

```diff
    contract Chainlink ETH/USD Price Feed (eth:0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419) {
    +++ description: None
      values.getAnswer:
-        [0,0,0,0,0]
      values.getTimestamp:
-        [0,0,0,0,0]
      values.latestAnswer:
-        195381863000
      values.latestRound:
-        "129127208515966887569"
      values.latestRoundData:
-        {"roundId":"129127208515966887569","answer":195381863000,"startedAt":1772451999,"updatedAt":1772452019,"answeredInRound":"129127208515966887569"}
      values.latestTimestamp:
-        1772452019
      errors:
-        {"getAnswer":"Processing error occurred.","getTimestamp":"Processing error occurred.","proposedLatestRoundData":"Processing error occurred."}
    }
```

```diff
-   Status: DELETED
    contract Tellor Tributes Token (eth:0x88dF592F8eb5D7Bd38bFeF7dEb0fBc02cf3778a0)
    +++ description: None
```

```diff
    contract SortedTroves (eth:0x8FdD3fbFEb32b28fb73555518f8b361bCeA741A6) {
    +++ description: None
      values.data:
-        {"head":"eth:0x2291F52bddc937b5B840d15E551e1DA8C80c2B3c","tail":"eth:0xD98C3b7f0297f2eD1861893cFD80C4CfA24Fb687","maxSize":"115792089237316195423570985008687907853269984665640564039457584007913129639935","size":105}
      template:
+        "liquity-v2/SortedTroves_all"
    }
```

```diff
    contract TroveManager (eth:0xA39739EF8b0231DbFA0DcdA07d7e29faAbCf4bb2) {
    +++ description: None
      values.checkRecoveryMode:
-        [true,true,true,true,true]
      values.getBorrowingFee:
-        [0,0,0,0,0]
      values.getBorrowingFeeWithDecay:
-        [0,0,0,0,0]
      values.getRedemptionFeeWithDecay:
-        [0,0,0,0]
      values.getTCR:
-        [0,0,0,0,0]
      errors:
-        {"checkRecoveryMode":"Processing error occurred.","getBorrowingFee":"Processing error occurred.","getBorrowingFeeWithDecay":"Processing error occurred.","getTCR":"Processing error occurred."}
      template:
+        "liquity-v2/TroveManager_all"
    }
```

Generated with discovered.json: 0x87500f66305d2d80bbeb1724c36300b596ae963c

# Diff at Mon, 02 Mar 2026 12:27:03 GMT:

- author: unknown (<unknown>)
- current timestamp: 1772453602

## Description

Discovery rerun on the same block number with only config-related changes.

## Initial discovery

```diff
+   Status: CREATED
    contract GnosisSafe (eth:0x21f73D42Eb58Ba49dDB685dc29D3bF5c0f0373CA)
    +++ description: None
```

```diff
+   Status: CREATED
    contract BorrowerOperations (eth:0x24179CD81c9e782A4096035f7eC97fB8B783e007)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CollSurplusPool (eth:0x3D32e8b97Ed5881324241Cf03b2DA5E2EBcE5521)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Chainlink LUSD/USD Price Feed (eth:0x3D7aE7E594f2f2091Ad8798313450130d0Aba3a0)
    +++ description: None
```

```diff
+   Status: CREATED
    contract PriceFeed (eth:0x4c517D4e2C851CA76d7eC94B805269Df0f2201De)
    +++ description: None
```

```diff
+   Status: CREATED
    contract LQTYStaking (eth:0x4f9Fbb3f1E99B56e0Fe2892e623Ed36A76Fc605d)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Chainlink ETH/USD Price Feed (eth:0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419)
    +++ description: None
```

```diff
+   Status: CREATED
    contract LUSD Stablecoin Token (eth:0x5f98805A4E8be255a32880FDeC7F6728C6568bA0)
    +++ description: None
```

```diff
+   Status: CREATED
    contract StabilityPool (eth:0x66017D22b0f8556afDd19FC67041899Eb65a21bb)
    +++ description: None
```

```diff
+   Status: CREATED
    contract LQTY Token (eth:0x6DEA81C8171D0bA574754EF6F8b412F2Ed88c54D)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Tellor Tributes Token (eth:0x88dF592F8eb5D7Bd38bFeF7dEb0fBc02cf3778a0)
    +++ description: None
```

```diff
+   Status: CREATED
    contract DefaultPool (eth:0x896a3F03176f05CFbb4f006BfCd8723F2B0D741C)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SortedTroves (eth:0x8FdD3fbFEb32b28fb73555518f8b361bCeA741A6)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GasPool (eth:0x9555b042F969E561855e5F28cB1230819149A8d9)
    +++ description: None
```

```diff
+   Status: CREATED
    contract TroveManager (eth:0xA39739EF8b0231DbFA0DcdA07d7e29faAbCf4bb2)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Tellor Price Feed (eth:0xAd430500ECDa11E38C9bCB08a702274b94641112)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafe (eth:0xb8a9faDA75c6d891fB77a7988Ff9BaD9e485Ca1C)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CommunityIssuance (eth:0xD8c9D9071123a059C6E0A945cF0e0c82b508d816)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ActivePool (eth:0xDf9Eb223bAFBE5c5271415C75aeCD68C21fE3D7F)
    +++ description: None
```

```diff
+   Status: CREATED
    contract HintHelpers (eth:0xE84251b93D9524E0d2e621Ba7dc7cb3579F997C0)
    +++ description: None
```

```diff
+   Status: CREATED
    contract MultiTroveGetter (eth:0xFc92d0E9Fa35df17E3A6d9F40716ca2cE749922B)
    +++ description: None
```
