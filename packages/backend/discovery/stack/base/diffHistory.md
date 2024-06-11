Generated with discovered.json: 0x2428397998ce4d9b218cb2122c8b2515ff938cf8

# Diff at Tue, 11 Jun 2024 13:17:38 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@4b482f34b787e8546115b599d38d66643fc47a24 block: 12893975
- current block number: 15661242

## Description

Provide description of changes. This section will be preserved.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 12893975 (main branch discovery), not current.

```diff
    contract SystemConfig (0x52c901666Cfc8AeE9b46A3b7C101688351529B37) {
    +++ description: None
      values.resourceConfig:
-        [20000000,10,8,1000000000,1000000,"340282366920938463463374607431768211455"]
+        {"maxResourceLimit":20000000,"elasticityMultiplier":10,"baseFeeMaxChangeDenominator":8,"minimumBaseFee":1000000000,"systemTxMaxGas":1000000,"maximumBaseFee":"340282366920938463463374607431768211455"}
    }
```

Generated with discovered.json: 0x25698f6aa8b455f39fab9dd5b810ec5ebe52c1ec

# Diff at Fri, 05 Apr 2024 09:13:03 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- current block number: 12759508

## Description

Standard OP Stack with no significant diff.

## Initial discovery

```diff
+   Status: CREATED
    contract ProxyAdmin (0x25aBB510386A658c622280f488844BD3b485DC32)
    +++ description: None
```

```diff
+   Status: CREATED
    contract AddressManager (0x31f09c4a4151EeBB1c0Ac10003bF3b06f4Aa5668)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SystemConfig (0x52c901666Cfc8AeE9b46A3b7C101688351529B37)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1CrossDomainMessenger (0x727a91e8251A262A4ad5F2D5811c6cD862961759)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OptimismPortal (0x752BE2A1c6DBe40884D7851CDC58c9cA54DCBD3E)
    +++ description: None
```

```diff
+   Status: CREATED
    contract StackMultisig (0x7dCe2FEE5e30EFf298cD3d9B92649f00EBDfc104)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1StandardBridge (0xbA256039AEdaD407692D8Deb366308BE6Bb2515C)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L2OutputOracle (0xCC61c26901E719B73273C1484e337cBAB84369EF)
    +++ description: None
```
