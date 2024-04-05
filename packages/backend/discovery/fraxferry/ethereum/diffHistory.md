Generated with discovered.json: 0x95793452e0e25388b71fd773a13a74e44eb49312

# Diff at Fri, 05 Apr 2024 11:11:12 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@5f9d1d2356b8701a8e895aff2949c43c7a22883f block: 19517283
- current block number: 19589154

## Description

One signer of the FPI Multisig (owner of the FPI and FPIS frax ferry bridges) is changed.

## Watched changes

```diff
    contract FPI Multisig (0x6A7efa964Cf6D9Ab3BC3c47eBdDB853A8853C502) {
    +++ description: None
      values.getOwners.3:
-        "0x05FB8eC3C41da95b26fCb85503DaF8B89B89A935"
+        "0xc8dE9f45601DA8C76158b8CAF3E56E8A037F2228"
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19517283 (main branch discovery), not current.

```diff
-   Status: DELETED
    contract DepositContract (0x00000000219ab540356cBB839Cbe05303d7705Fa)
    +++ description: None
```

```diff
-   Status: DELETED
    contract FeeToSetter (0x18e433c7Bf8A2E1d0197CE5d8f9AFAda1A771360)
    +++ description: None
```

```diff
-   Status: DELETED
    contract Timelock (0x1a9C8182C09F50C8318d769245beA52c32BE35BC)
    +++ description: None
```

```diff
-   Status: DELETED
    contract FRAXOracleWrapper (0x2A6ddD9401B14d0443d0738B8a78fd5B99829A80)
    +++ description: None
```

```diff
-   Status: DELETED
    contract FRAXShares (0x3432B6A60D23Ca0dFCa7761B7ab56459D9C964D0)
    +++ description: None
```

```diff
-   Status: DELETED
    contract UniswapPairOracle_USDT_WETH (0x3B11DA52030420c663d263Ad4415a8A02E5f8cf8)
    +++ description: None
```

```diff
-   Status: DELETED
    contract UniswapV2Factory (0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f)
    +++ description: None
```

```diff
-   Status: DELETED
    contract FPI (0x5Ca135cB8527d76e932f34B5145575F9d8cbE08E)
    +++ description: None
```

```diff
-   Status: DELETED
    contract frxETH (0x5E8422345238F34275888049021821E8E08CAa1f)
    +++ description: None
```

```diff
    contract GnosisSafe (0x6A7efa964Cf6D9Ab3BC3c47eBdDB853A8853C502) {
    +++ description: None
      name:
-        "GnosisSafe"
+        "FPI Multisig"
      upgradeability.threshold:
+        "3 of 5 (60%)"
      values.nonce:
-        487
    }
```

```diff
-   Status: DELETED
    contract frxETHMultisig (0x8306300ffd616049FD7e4b0354a64Da835c1A81C)
    +++ description: None
```

```diff
-   Status: DELETED
    contract GnosisSafe (0x831822660572bd54ebaa065C2acef662a6277D40)
    +++ description: None
```

```diff
-   Status: DELETED
    contract Timelock (0x8412ebf45bAC1B340BbE8F318b928C466c4E39CA)
    +++ description: None
```

```diff
-   Status: DELETED
    contract FRAXStablecoin (0x853d955aCEf822Db058eb8505911ED77F175b99e)
    +++ description: None
```

```diff
-   Status: DELETED
    contract StakedFrax (0xA663B02CF0a4b149d2aD41910CB81e23e1c41c32)
    +++ description: None
```

```diff
-   Status: DELETED
    contract sfrxETH (0xac3E018457B222d93114458476f3E3416Abbe38F)
    +++ description: None
```

```diff
    contract TimelockMultisig (0xB1748C79709f4Ba2Dd82834B8c82D4a505003f27) {
    +++ description: None
      upgradeability.threshold:
+        "3 of 5 (60%)"
    }
```

```diff
-   Status: DELETED
    contract frxETHMinter (0xbAFA44EFE7901E04E39Dad13167D089C559c1138)
    +++ description: None
```

```diff
-   Status: DELETED
    contract FPIS (0xc2544A32872A91F4A553b404C6950e89De901fdb)
    +++ description: None
```

```diff
-   Status: DELETED
    contract FeeTo (0xDAF819c2437a82f9e01f6586207ebF961a7f0970)
    +++ description: None
```

```diff
-   Status: DELETED
    contract UniswapV2Pair (0xecBa967D84fCF0405F6b32Bc45F4d36BfDBB2E81)
    +++ description: None
```

Generated with discovered.json: 0x17dbf8ac6c5be3253cb51ce71ca590a06ddd5fd6

# Diff at Tue, 26 Mar 2024 08:00:03 GMT:

- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- current block number: 19517283

## Description

Provide description of changes. This section will be preserved.

## Initial discovery

```diff
+   Status: CREATED
    contract DepositContract (0x00000000219ab540356cBB839Cbe05303d7705Fa)
    +++ description: None
```

```diff
+   Status: CREATED
    contract FeeToSetter (0x18e433c7Bf8A2E1d0197CE5d8f9AFAda1A771360)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Timelock (0x1a9C8182C09F50C8318d769245beA52c32BE35BC)
    +++ description: None
```

```diff
+   Status: CREATED
    contract FRAXOracleWrapper (0x2A6ddD9401B14d0443d0738B8a78fd5B99829A80)
    +++ description: None
```

```diff
+   Status: CREATED
    contract sfraxFerryBridgeArbitrum (0x2b4864c2F2A2C275C6C66B90a2ae6BE9fA9cbE47)
    +++ description: None
```

```diff
+   Status: CREATED
    contract FRAXShares (0x3432B6A60D23Ca0dFCa7761B7ab56459D9C964D0)
    +++ description: None
```

```diff
+   Status: CREATED
    contract UniswapPairOracle_USDT_WETH (0x3B11DA52030420c663d263Ad4415a8A02E5f8cf8)
    +++ description: None
```

```diff
+   Status: CREATED
    contract fxsFerryBridgeArbitrum (0x4A6d155df9Ec9A1BB3639e6B7B99E46Fb68D42f6)
    +++ description: None
```

```diff
+   Status: CREATED
    contract sfrxFerryBridgeArbitrum (0x5c5f05cF8528FFe925A2264743bFfEdbAB2b0FE3)
    +++ description: None
```

```diff
+   Status: CREATED
    contract UniswapV2Factory (0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f)
    +++ description: None
```

```diff
+   Status: CREATED
    contract FPI (0x5Ca135cB8527d76e932f34B5145575F9d8cbE08E)
    +++ description: None
```

```diff
+   Status: CREATED
    contract fraxFerryBridgeArbitrum (0x5e1D94021484642863Ea8E7Cb4F0188e56B18FEE)
    +++ description: None
```

```diff
+   Status: CREATED
    contract frxETH (0x5E8422345238F34275888049021821E8E08CAa1f)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafe (0x6A7efa964Cf6D9Ab3BC3c47eBdDB853A8853C502)
    +++ description: None
```

```diff
+   Status: CREATED
    contract frxETHMultisig (0x8306300ffd616049FD7e4b0354a64Da835c1A81C)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafe (0x831822660572bd54ebaa065C2acef662a6277D40)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Timelock (0x8412ebf45bAC1B340BbE8F318b928C466c4E39CA)
    +++ description: None
```

```diff
+   Status: CREATED
    contract FRAXStablecoin (0x853d955aCEf822Db058eb8505911ED77F175b99e)
    +++ description: None
```

```diff
+   Status: CREATED
    contract fpisFerryBridgeArbitrum (0x958815f476cD07354c0BC034EE5077B20fD93003)
    +++ description: None
```

```diff
+   Status: CREATED
    contract fpiFerryBridgeArbitrum (0x9A576A3d39c589A861B46864C253288bcA428a6c)
    +++ description: None
```

```diff
+   Status: CREATED
    contract StakedFrax (0xA663B02CF0a4b149d2aD41910CB81e23e1c41c32)
    +++ description: None
```

```diff
+   Status: CREATED
    contract sfrxETH (0xac3E018457B222d93114458476f3E3416Abbe38F)
    +++ description: None
```

```diff
+   Status: CREATED
    contract TimelockMultisig (0xB1748C79709f4Ba2Dd82834B8c82D4a505003f27)
    +++ description: None
```

```diff
+   Status: CREATED
    contract frxETHMinter (0xbAFA44EFE7901E04E39Dad13167D089C559c1138)
    +++ description: None
```

```diff
+   Status: CREATED
    contract FPIS (0xc2544A32872A91F4A553b404C6950e89De901fdb)
    +++ description: None
```

```diff
+   Status: CREATED
    contract FeeTo (0xDAF819c2437a82f9e01f6586207ebF961a7f0970)
    +++ description: None
```

```diff
+   Status: CREATED
    contract UniswapV2Pair (0xecBa967D84fCF0405F6b32Bc45F4d36BfDBB2E81)
    +++ description: None
```
