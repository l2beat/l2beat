Generated with discovered.json: 0x0e7a0e42366d2712769a876f369c4c4fc67a1702

# Diff at Tue, 11 Jun 2024 10:11:02 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@6a747b8f93a46c87e2494c6adb06df4640d08444 block: 121202053
- current block number: 121250937

## Description

The ProxyAdmin owner is now the same as L1 (but aliased).

## Watched changes

```diff
-   Status: DELETED
    contract InternalProxyAdminOwnerMultisig1 (0x28B1eE885034ccD2d5Fa228a9A3157390D27177C)
    +++ description: None
```

```diff
    contract L2ProxyAdmin (0x4200000000000000000000000000000000000018) {
    +++ description: None
      values.owner:
-        "0x7871d1187A97cbbE40710aC119AA3d412944e4Fe"
+        "0x6B1BAE59D09fCcbdDB6C6cceb07B7279367C4E3b"
    }
```

```diff
-   Status: DELETED
    contract L2ProxyAdminOwner (0x7871d1187A97cbbE40710aC119AA3d412944e4Fe)
    +++ description: None
```

## Source code changes

```diff
.../GnosisSafeL2.sol => /dev/null                  | 1031 --------------------
 .../GnosisSafeProxy.p.sol => /dev/null             |   34 -
 .../GnosisSafeL2.sol => /dev/null                  | 1031 --------------------
 .../GnosisSafeProxy.p.sol => /dev/null             |   34 -
 4 files changed, 2130 deletions(-)
```

Generated with discovered.json: 0xf3841b075c5c5f1392147ee9bf27462c6692ba7e

# Diff at Mon, 10 Jun 2024 07:01:37 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@023db9216bab49e9b3ffde0e43664e3e63c60fcf block: 120992980
- current block number: 121202053

## Description

Ignored.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 120992980 (main branch discovery), not current.

```diff
    contract SequencerFeeVault (0x4200000000000000000000000000000000000011) {
    +++ description: None
      values.totalProcessed:
-        "3495563082937265797169"
    }
```

Generated with discovered.json: 0xa1d57f190fbdfb73f7171e0322ccf7bddd4a21c9

# Diff at Wed, 05 Jun 2024 10:52:26 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- current block number: 120992980

## Description

Provide description of changes. This section will be preserved.

## Initial discovery

```diff
+   Status: CREATED
    contract InternalProxyAdminOwnerMultisig1 (0x28B1eE885034ccD2d5Fa228a9A3157390D27177C)
    +++ description: None
```

```diff
+   Status: CREATED
    contract MintManagerOwner (0x2A82Ae142b2e62Cb7D10b55E323ACB1Cab663a26)
    +++ description: None
```

```diff
+   Status: CREATED
    contract DeployerWhitelist (0x4200000000000000000000000000000000000002)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L2CrossDomainMessenger (0x4200000000000000000000000000000000000007)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GasPriceOracle (0x420000000000000000000000000000000000000F)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L2StandardBridge (0x4200000000000000000000000000000000000010)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SequencerFeeVault (0x4200000000000000000000000000000000000011)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OptimismMintableERC20Factory (0x4200000000000000000000000000000000000012)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1BlockNumber (0x4200000000000000000000000000000000000013)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L2ERC721Bridge (0x4200000000000000000000000000000000000014)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1Block (0x4200000000000000000000000000000000000015)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L2ToL1MessagePasser (0x4200000000000000000000000000000000000016)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OptimismMintableERC721Factory (0x4200000000000000000000000000000000000017)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L2ProxyAdmin (0x4200000000000000000000000000000000000018)
    +++ description: None
```

```diff
+   Status: CREATED
    contract BaseFeeVault (0x4200000000000000000000000000000000000019)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1FeeVault (0x420000000000000000000000000000000000001A)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SchemaRegistry (0x4200000000000000000000000000000000000020)
    +++ description: None
```

```diff
+   Status: CREATED
    contract EAS (0x4200000000000000000000000000000000000021)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OPToken (0x4200000000000000000000000000000000000042)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OldQuixoticNFTBridge (0x5a7749f83b81B301cAb5f48EB8516B986DAef23D)
    +++ description: None
```

```diff
+   Status: CREATED
    contract MintManager (0x5C4e7Ba1E219E47948e6e3F55019A647bA501005)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L2ProxyAdminOwner (0x7871d1187A97cbbE40710aC119AA3d412944e4Fe)
    +++ description: None
```
