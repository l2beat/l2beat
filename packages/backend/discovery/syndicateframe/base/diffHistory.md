Generated with discovered.json: 0x4c4a351cc99bdbd3869c4d7a597a94c9006d7d89

# Diff at Fri, 09 Aug 2024 12:04:14 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bf40aa32f030fd312056ca0ef198c8550467d1d7 block: 15661223
- current block number: 15661223

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 15661223 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0xF5BD775557F3b8817C34Fc784971A0AF1a36DD8E) {
    +++ description: None
      assignedPermissions.upgrade.2:
-        "0x520D972B4A7C1CE4d5e01bCd4349a93a8AeaEAC5"
+        "0xF7Cb313CB6D146dAbB8c5E31798BDCeFc67B831b"
      assignedPermissions.upgrade.0:
-        "0xF7Cb313CB6D146dAbB8c5E31798BDCeFc67B831b"
+        "0x520D972B4A7C1CE4d5e01bCd4349a93a8AeaEAC5"
    }
```

Generated with discovered.json: 0x06d91178325ba2b708f22d5584ed8369946ae510

# Diff at Fri, 09 Aug 2024 10:14:13 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f0da1d0aab7bc6b3b5e54e7e93480bd98e57035 block: 15661223
- current block number: 15661223

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 15661223 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0xF5BD775557F3b8817C34Fc784971A0AF1a36DD8E) {
    +++ description: None
      assignedPermissions.admin:
-        ["0x520D972B4A7C1CE4d5e01bCd4349a93a8AeaEAC5","0x52fA397D799f1CE416a2089B964Aa293c347994F","0xF7Cb313CB6D146dAbB8c5E31798BDCeFc67B831b","0xc2dA6Afd69F0ce69313F01c73f77E6471f06b4E4"]
      assignedPermissions.owner:
-        ["0x9Bf9cd5aD745076b5bFb7Cc2d3b871532973C2c0"]
      assignedPermissions.upgrade:
+        ["0xF7Cb313CB6D146dAbB8c5E31798BDCeFc67B831b","0x52fA397D799f1CE416a2089B964Aa293c347994F","0x520D972B4A7C1CE4d5e01bCd4349a93a8AeaEAC5","0xc2dA6Afd69F0ce69313F01c73f77E6471f06b4E4"]
      assignedPermissions.configure:
+        ["0x9Bf9cd5aD745076b5bFb7Cc2d3b871532973C2c0"]
    }
```

Generated with discovered.json: 0x58150dfac00f75ad2c9b331523a03d2d5a33c8d9

# Diff at Tue, 11 Jun 2024 13:16:59 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@4b482f34b787e8546115b599d38d66643fc47a24 block: 13275713
- current block number: 15661223

## Description

Provide description of changes. This section will be preserved.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 13275713 (main branch discovery), not current.

```diff
    contract SystemConfig (0xc2dA6Afd69F0ce69313F01c73f77E6471f06b4E4) {
    +++ description: None
      values.resourceConfig:
-        [20000000,10,8,1000000000,1000000,"340282366920938463463374607431768211455"]
+        {"maxResourceLimit":20000000,"elasticityMultiplier":10,"baseFeeMaxChangeDenominator":8,"minimumBaseFee":1000000000,"systemTxMaxGas":1000000,"maximumBaseFee":"340282366920938463463374607431768211455"}
    }
```

Generated with discovered.json: 0x147fd279bec58614540f9e2feb015f36787829b5

# Diff at Wed, 17 Apr 2024 07:59:38 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- current block number: 13275713

## Description

Standard OP stack chain with no significant changes.

## Initial discovery

```diff
+   Status: CREATED
    contract L1CrossDomainMessenger (0x0ED44be59Ea62a9960CB97f8aC54088304D05791)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L2OutputOracle (0x520D972B4A7C1CE4d5e01bCd4349a93a8AeaEAC5)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OptimismPortal (0x52fA397D799f1CE416a2089B964Aa293c347994F)
    +++ description: None
```

```diff
+   Status: CREATED
    contract AddressManager (0x9Bf9cd5aD745076b5bFb7Cc2d3b871532973C2c0)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SystemConfig (0xc2dA6Afd69F0ce69313F01c73f77E6471f06b4E4)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0xF5BD775557F3b8817C34Fc784971A0AF1a36DD8E)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1StandardBridge (0xF7Cb313CB6D146dAbB8c5E31798BDCeFc67B831b)
    +++ description: None
```
