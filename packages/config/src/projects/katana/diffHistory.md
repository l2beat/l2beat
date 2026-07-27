Generated with discovered.json: 0x1beb2c970cc77fdac5d38a42d9d71e74be9337c6

# Diff at Thu, 23 Jul 2026 13:53:56 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@efd03446560a8d585747f124c71622cbfa33fca4 block: 1784623318
- current timestamp: 1784814637

## Description

One Polygon Labs Engineering/Security Multisig signer was rotated and another removed, changing it from 2-of-8 to 2-of-7.

## Watched changes

```diff
    contract Polygon Labs Engineering/Security Multisig (eth:0x9d851f8b8751c5FbC09b9E74E6e68E9950949052) [GnosisSafe] {
    +++ description: None
      values.$members.1:
-        "eth:0xe0e8e6bBDef7bbcf8dF1F5Ac0ab9906BFe991d8B"
+        "eth:0xFB2a738AE435610354b132c4a4ee647558f663eb"
      values.$members.6:
-        "eth:0xED7cC82235A7757702475c8f77c7830c095FB5a2"
      values.multisigThreshold:
-        "2 of 8 (25%)"
+        "2 of 7 (29%)"
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1784623318 (main branch discovery), not current.

```diff
    EOA  (eth:0xED7cC82235A7757702475c8f77c7830c095FB5a2) {
    +++ description: None
      type:
-        "Reference"
+        "EOA"
      targetType:
-        "EOA"
      targetProject:
-        "shared-polygon-cdk"
      proxyType:
+        "EOA"
    }
```

```diff
    reference  (eth:0xf02BE0dA37dB50BEFA5a525158aa94b50F81D4B2) {
    +++ description: None
      type:
-        "EOA"
+        "Reference"
      proxyType:
-        "EOA"
      targetType:
+        "EOA"
      targetProject:
+        "shared-polygon-cdk"
    }
```

Generated with discovered.json: 0x3764918832c27dab005c4d053470bd707a605edd

# Diff at Tue, 21 Jul 2026 08:43:22 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@f20722ea086c21a6e3dedded355fc3e24528daf0 block: 1784270104
- current timestamp: 1784623318

## Description

4 multisig signers added.

## Watched changes

```diff
    contract Safe (eth:0xFA58659F64a393A6E1A548ABc70Ad2CfE1e8f9Cb) [GnosisSafe] {
    +++ description: None
      values.$members.0:
+        "eth:0x9f02595fBFD199C4cBC02878fc9B2b2E07b0840C"
      values.$members.1:
+        "eth:0x1319279d6d54dB0883F7bAF822191c7184Db0c3d"
      values.$members.2:
+        "eth:0x6Ab87a62E250A5EB09a53Fca832B9Bda480c3890"
      values.$members.3:
+        "eth:0x573D7a729cfcF20B81D70732d625Ae31549B8b91"
      values.multisigThreshold:
-        "2 of 6 (33%)"
+        "2 of 10 (20%)"
    }
```

Generated with discovered.json: 0x895a031da67f7bef95be8dd5a12869edd4b7c915

# Diff at Fri, 17 Jul 2026 07:35:16 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@5a5b552776f13efe49c744667945e52e0a8f9718 block: 1783509417
- current timestamp: 1784270104

## Description

New op-succinct programHashes - reproduced from v3.10.0  . Add rollup config preimg and instructions to repro.

## Watched changes

```diff
    contract AggchainFEP (eth:0x100d3ca4f97776A40A7D93dB4AbF0FEA34230666) [katana/AggchainFEP_post035] {
    +++ description: The main system contract defining the katana Aggchain logic. This contract, based on the OP-Succinct L2OutputOracle, supports validity proofs and OP stack outputRoots (L2 state roots) are saved here.
      values.selectedOpSuccinctConfig.aggregationVkey:
-        "0x0000000000000000000000000000000000000000000000000000000000000000"
+        "0x0034587dfb1de8163284d39f3043f5fadfa92f9e03fb3e0315eb469c550fde40"
      values.selectedOpSuccinctConfig.rangeVkeyCommitment:
-        "0x0000000000000000000000000000000000000000000000000000000000000000"
+        "0x1b04822373ca65680026b5610c1edf424798421b032ef9117b2c264661de246f"
      values.selectedOpSuccinctConfig.rollupConfigHash:
-        "0x0000000000000000000000000000000000000000000000000000000000000000"
+        "Katana OP Succinct v3.10.0 rollup config (Kona v1.6.0)"
+++ description: currently enforced OpSuccinctConfig. update the call handler for the full config if this changes.
+++ severity: HIGH
      values.selectedOpSuccinctConfigName:
-        "0x3cb66b8472d88440173415d4d4a316b9df81ac208e63e02829f823fccbe3f547"
+        "0xe3fbe1170998c9f380d29247864dd07f2f17367a23ae5e0fa409ebd371d97d6f"
    }
```

```diff
    contract Katana Steakhouse Financial / Morpho Multisig (eth:0x827e86072B06674a077f592A531dcE4590aDeCdB) [GnosisSafe] {
    +++ description: None
      values.$members.0:
+        "eth:0xfc615395336aADe67fd853a0157001a215Ea1279"
      values.multisigThreshold:
-        "2 of 6 (33%)"
+        "2 of 7 (29%)"
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1783509417 (main branch discovery), not current.

```diff
    contract AggchainFEP (eth:0x100d3ca4f97776A40A7D93dB4AbF0FEA34230666) [katana/AggchainFEP_post035] {
    +++ description: The main system contract defining the katana Aggchain logic. This contract, based on the OP-Succinct L2OutputOracle, supports validity proofs and OP stack outputRoots (L2 state roots) are saved here.
      values.selectedOpSuccinctConfig.aggregationVkey:
-        "0x0095c1f31a6e1003e1e3083ca45bf69b95c9a1468708df1029c9cf4bceb8a852"
+        "0x0000000000000000000000000000000000000000000000000000000000000000"
      values.selectedOpSuccinctConfig.rangeVkeyCommitment:
-        "0x3813362d038935ad6cb1e2566278975f08be38a92bfe7137505ef0c14a9d1972"
+        "0x0000000000000000000000000000000000000000000000000000000000000000"
      values.selectedOpSuccinctConfig.rollupConfigHash:
-        "0x352a9738897d236014fd5bd11986bf008b3b623b037405900ab338f93cdf5272"
+        "0x0000000000000000000000000000000000000000000000000000000000000000"
      usedTypes:
+        [{"typeCaster":"Mapping","arg":{"0xecdbb340ded82ca2e5baf5e40c90a3b0c1227c27f9be2962df93d2e061e9a5d4":"Katana OP Succinct v3.10.0 rollup config (Kona v1.6.0)"}}]
    }
```

Generated with discovered.json: 0x322087878ba7a5cc2c2714d3c3a4225ba79da053

# Diff at Wed, 08 Jul 2026 11:18:11 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@41e54e24b48ee5dc5e63086324d02428320c1565 block: 1782219118
- current timestamp: 1783509417

## Description

One multisig signer removed.

## Watched changes

```diff
    contract Katana yieldRecipient Mulsitig (eth:0x67C912fF560951526BffDff66dFbD4DF8AE23756) [GnosisSafe] {
    +++ description: None
      values.$members.0:
-        "eth:0x34d23C4fb6542B467cA8724bAD30AC811399b184"
      values.multisigThreshold:
-        "2 of 7 (29%)"
+        "2 of 6 (33%)"
    }
```

```diff
    contract Safe (eth:0xFA58659F64a393A6E1A548ABc70Ad2CfE1e8f9Cb) [GnosisSafe] {
    +++ description: None
      values.$members.5:
-        "eth:0x59cE4e1709c7E462F3b72Ca3e1256dFa7358FC29"
      values.multisigThreshold:
-        "2 of 7 (29%)"
+        "2 of 6 (33%)"
    }
```

Generated with discovered.json: 0x0f1180d79e9cbad47e063dfff7561f97f02c6269

# Diff at Tue, 23 Jun 2026 12:57:22 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@9c9e4ff7c3dc0c9daec01df0643074c3c50df6f0 block: 1781600787
- current timestamp: 1782219118

## Description

Update op-succinct programs to v6.1.0.

## Watched changes

```diff
    contract AggchainFEP (eth:0x100d3ca4f97776A40A7D93dB4AbF0FEA34230666) [katana/AggchainFEP_post035] {
    +++ description: The main system contract defining the katana Aggchain logic. This contract, based on the OP-Succinct L2OutputOracle, supports validity proofs and OP stack outputRoots (L2 state roots) are saved here.
      values.selectedOpSuccinctConfig.aggregationVkey:
-        "0x0000000000000000000000000000000000000000000000000000000000000000"
+        "0x0095c1f31a6e1003e1e3083ca45bf69b95c9a1468708df1029c9cf4bceb8a852"
      values.selectedOpSuccinctConfig.rangeVkeyCommitment:
-        "0x0000000000000000000000000000000000000000000000000000000000000000"
+        "0x3813362d038935ad6cb1e2566278975f08be38a92bfe7137505ef0c14a9d1972"
      values.selectedOpSuccinctConfig.rollupConfigHash:
-        "0x0000000000000000000000000000000000000000000000000000000000000000"
+        "0x352a9738897d236014fd5bd11986bf008b3b623b037405900ab338f93cdf5272"
+++ description: currently enforced OpSuccinctConfig. update the call handler for the full config if this changes.
+++ severity: HIGH
      values.selectedOpSuccinctConfigName:
-        "0xe719c402037f76346e69e021164101e16954889c052f75f16a29758815723dde"
+        "0x3cb66b8472d88440173415d4d4a316b9df81ac208e63e02829f823fccbe3f547"
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1781600787 (main branch discovery), not current.

```diff
    contract AggchainFEP (eth:0x100d3ca4f97776A40A7D93dB4AbF0FEA34230666) [katana/AggchainFEP_post035] {
    +++ description: The main system contract defining the katana Aggchain logic. This contract, based on the OP-Succinct L2OutputOracle, supports validity proofs and OP stack outputRoots (L2 state roots) are saved here.
      values.selectedOpSuccinctConfig.aggregationVkey:
-        "0x0065e407807b2b3610cc9ff6637ea16e815552bc34b48c206529d3cfcd9d1152"
+        "0x0000000000000000000000000000000000000000000000000000000000000000"
      values.selectedOpSuccinctConfig.rangeVkeyCommitment:
-        "0x5c7c05114bc5dd360fdb52ec2b4977a45f7e22806bc949a72759ea1172202229"
+        "0x0000000000000000000000000000000000000000000000000000000000000000"
      values.selectedOpSuccinctConfig.rollupConfigHash:
-        "0x352a9738897d236014fd5bd11986bf008b3b623b037405900ab338f93cdf5272"
+        "0x0000000000000000000000000000000000000000000000000000000000000000"
    }
```

```diff
    reference  (eth:0x21618593F7147235aC8D511d68A547C935F9d417) {
    +++ description: None
      type:
-        "EOA"
+        "Reference"
      proxyType:
-        "EOA"
      targetType:
+        "EOA"
      targetProject:
+        "shared-polygon-cdk"
    }
```

Generated with discovered.json: 0x2cd3ad8f95b2d9cab8b8ef4b2055ed6d2dd2331e

# Diff at Tue, 16 Jun 2026 09:07:56 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@e3be4116cfc279e5c4415ba34f338c2f1d453616 block: 1781102006
- current timestamp: 1781600787

## Description

Add multisig signer.

## Watched changes

```diff
    contract SafeL2 (katana:0x7990513f4d64d57524a0B2519759f53B0cB1aEbd) [GnosisSafe] {
    +++ description: None
      values.$members.0:
+        "katana:0xb3dA4c1Ba8De9E04f22B1554a070189F518FDCac"
      values.multisigThreshold:
-        "3 of 5 (60%)"
+        "3 of 6 (50%)"
    }
```

Generated with discovered.json: 0x571012f08b4d382395f4140f82a9dc7d7db5ba3e

# Diff at Fri, 12 Jun 2026 10:18:52 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@6a183e6009109d4e62087499f44eca4aceea9086 block: 1781102006
- current timestamp: 1781102006

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1781102006 (main branch discovery), not current.

```diff
    contract SequencerFeeVault (katana:0x4200000000000000000000000000000000000011) [opstack/Layer2/SequencerFeeVault] {
    +++ description: Collects the sequencer fees.
      category:
+        {"name":"Non-Critical","priority":0}
    }
```

```diff
    contract BaseFeeVault (katana:0x4200000000000000000000000000000000000019) [opstack/Layer2/BaseFeeVault] {
    +++ description: Collects EIP-1559 base fees
      category:
+        {"name":"Non-Critical","priority":0}
    }
```

```diff
    contract L1FeeVault (katana:0x420000000000000000000000000000000000001A) [opstack/Layer2/L1FeeVault] {
    +++ description: Collects the L1 portion of the L2 transaction fees.
      category:
+        {"name":"Non-Critical","priority":0}
    }
```

```diff
    contract OperatorFeeVault (katana:0x420000000000000000000000000000000000001b) [opstack/Layer2/OperatorFeeVault] {
    +++ description: Holds the 'operator fees' for the L2 network, which are part of the L2 fees that users pay.
      category:
+        {"name":"Non-Critical","priority":0}
    }
```

Generated with discovered.json: 0x92270f0b72061a01cfdfcbcab46015b628df80e2

# Diff at Wed, 10 Jun 2026 14:34:54 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@9b1a27959a14343aae7c71ebbc397f62f0aab99c block: 1780404229
- current timestamp: 1781102006

## Description

Two conduit ms members removed.

## Watched changes

```diff
    contract Conduit Multisig 1 (eth:0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) [GnosisSafe] {
    +++ description: None
      values.$members.4:
-        "eth:0x65D1d44B8B2fE15d45A03708E0835C7E98a56007"
      values.$members.8:
-        "eth:0xa4000bDD2bB92ce6750b31F1eeda47Bd1cB8e6e4"
      values.multisigThreshold:
-        "4 of 12 (33%)"
+        "4 of 10 (40%)"
    }
```

Generated with discovered.json: 0xfff1bddfab4dadb902e76d1be2aff47085690aa6

# Diff at Tue, 09 Jun 2026 12:43:35 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@ae67a38d37457ad735e5d55080d2e5479d5df7dc block: 1780404229
- current timestamp: 1780404229

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1780404229 (main branch discovery), not current.

```diff
    EOA  (eth:0x1FFDA89C755f6D4Af069897D77CcAbb580Fd412a) {
    +++ description: None
      receivedPermissions.0.description:
+        "Allowed to commit transactions from the current layer to the host chain."
      receivedPermissions.0.permission:
-        "sequence"
+        "interact"
    }
```

Generated with discovered.json: 0x0251a2794590405eaf15a11c0b27a318d30fa327

# Diff at Tue, 02 Jun 2026 13:01:35 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@1539447d4bb0403294997ea5e5110946d04275ef block: 1780060245
- current timestamp: 1780404229

## Description

Config ignores and conduit ms changes.

## Watched changes

```diff
    contract Conduit Multisig 1 (eth:0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) [GnosisSafe] {
    +++ description: None
      values.$members.0:
+        "eth:0xcdC931935768c0562AfE989A366a3Dc4d52F4853"
      values.$members.8:
-        "eth:0x3840f487A17A41100DD1Bf0946c34f132a57Fd5f"
    }
```

```diff
    contract Polygon Labs Engineering/Security Multisig (eth:0x9d851f8b8751c5FbC09b9E74E6e68E9950949052) [GnosisSafe] {
    +++ description: None
      values.$members.0:
+        "eth:0xf02BE0dA37dB50BEFA5a525158aa94b50F81D4B2"
      values.$members.1:
+        "eth:0xe0e8e6bBDef7bbcf8dF1F5Ac0ab9906BFe991d8B"
      values.$members.2:
+        "eth:0x6Ab87a62E250A5EB09a53Fca832B9Bda480c3890"
      values.multisigThreshold:
-        "2 of 5 (40%)"
+        "2 of 8 (25%)"
    }
```

Generated with discovered.json: 0xe824b1443430c192ebe87217a567053c8b28e80e

# Diff at Fri, 29 May 2026 13:34:21 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@443bb13c9fd1bf4ce2a2df0f1b00bfcf0933f006 block: 1779956198
- current timestamp: 1780060245

## Description

Standard L2 contract sources have been verified.

## Watched changes

```diff
    contract AgglayerBridgeL2 (katana:0x2a3DD3EB832aF982ec71669E178424b10Dca2EDe) [katana/AgglayerBridgeL2] {
    +++ description: Agglayer bridge contract. Supports interop with Ethereum and blockchains connected to Agglayer. Escrows all preminted ETH because it cannot mint on the L2. The globalExitRootManager is used as an oracle to validate bridge messages against.
      values.claimedGlobalIndexHashChain:
-        "0x5fede20963bde12c20e3076c4426550f570914a8a035c1381bc98f8bed306a46"
+        "0xdef05ec6820a531b383dc3f9dbbc1aac9846e2eab7a821929b5a07cc51659e4c"
      values.getRoot:
-        "0x1d743ae7262c7410af3fb680660e6c1f336b2f49609f709a69a9fd8b9ad21bb2"
+        "0x5ed5cfaf86b2b848194a0a9ebfa969a88ddee6b8f6f007a0ef658482f2665402"
    }
```

```diff
    contract GlobalExitRootManagerL2SovereignChain (katana:0xa40D5f56745a118D0906a34E69aeC8C0Db1cB8fA) [katana/GlobalExitRootManagerL2SovereignChain] {
    +++ description: Manages Layer 2 and global merkle roots (exit roots). It stores exit roots written during bridge deposits, accepts imported global exit roots from a permissioned address, and manages historical roots.
      values.insertedGERHashChain:
-        "0xaae24c57922b6453c1812383dba7b31cf9788b57cfc281e208b4e2911e5feee7"
+        "0x59bc3b88b56a09b106e04e1ffe3fd6dc754bf81029ef9cfe2723275b8f5b347c"
      values.lastRollupExitRoot:
-        "0x1d743ae7262c7410af3fb680660e6c1f336b2f49609f709a69a9fd8b9ad21bb2"
+        "0x5ed5cfaf86b2b848194a0a9ebfa969a88ddee6b8f6f007a0ef658482f2665402"
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1779956198 (main branch discovery), not current.

```diff
    contract ProxyAdmin (katana:0x0F99738B2Fc14D77308337f3e2596b63aE7BCC4A) [global/ProxyAdmin] {
    +++ description: None
      name:
-        "upgradeProxy"
+        "ProxyAdmin"
      unverified:
-        true
      receivedPermissions:
-        [{"permission":"upgrade","from":"katana:0x2a3DD3EB832aF982ec71669E178424b10Dca2EDe","role":"admin"},{"permission":"upgrade","from":"katana:0xa40D5f56745a118D0906a34E69aeC8C0Db1cB8fA","role":"admin"}]
      values.owner:
+        "katana:0xBBa0935Fa93Eb23de7990b47F0D96a8f75766d13"
      implementationNames.katana:0x0F99738B2Fc14D77308337f3e2596b63aE7BCC4A:
-        ""
+        "ProxyAdmin"
      template:
+        "global/ProxyAdmin"
      sourceHashes:
+        ["0xae641c7d7a83bba7fa913b9544f946dc23ca0527c2f4abb9c6a3496f49375218"]
      directlyReceivedPermissions:
+        [{"permission":"upgrade","from":"katana:0x2a3DD3EB832aF982ec71669E178424b10Dca2EDe","role":"admin"},{"permission":"upgrade","from":"katana:0xa40D5f56745a118D0906a34E69aeC8C0Db1cB8fA","role":"admin"}]
    }
```

```diff
    contract GasPriceOracle (katana:0x420000000000000000000000000000000000000F) [opstack/Layer2/GasPriceOracle] {
    +++ description: Provides the current gas price for L2 transactions.
      unverified:
-        true
      values.baseFee:
+        0
      values.baseFeeScalar:
+        1368
      values.decimals:
+        6
      values.DECIMALS:
+        6
      values.gasPrice:
+        0
      values.isEcotone:
+        true
      values.isFjord:
+        true
      values.isIsthmus:
+        true
      values.isJovian:
+        true
      values.version:
+        "1.6.0"
      implementationNames.katana:0x4f1db3c6AbD250ba86E0928471A8F7DB3AFd88F1:
-        ""
+        "GasPriceOracle"
      template:
+        "opstack/Layer2/GasPriceOracle"
      sourceHashes:
+        ["0xdb44b7e73254e0314f233ca790b4d44a2f9e3cebc019945c0ef84b9e3579c77a","0x2a3c7909036a30543d4aaa8e9501caab6f998a671d40cc3822f89c6239e6b8ab"]
      description:
+        "Provides the current gas price for L2 transactions."
    }
```

```diff
    contract L1Block (katana:0x4200000000000000000000000000000000000015) [opstack/Layer2/L1Block] {
    +++ description: Simple contract that returns information about the latest L1 block, which is derived permissionlessly from the L1 chain.
      unverified:
-        true
      values.baseFeeScalar:
+        1368
      values.batcherHash:
+        "0x0000000000000000000000001ffda89c755f6d4af069897d77ccabb580fd412a"
      values.daFootprintGasScalar:
+        400
      values.DEPOSITOR_ACCOUNT:
+        "katana:0xDeaDDEaDDeAdDeAdDEAdDEaddeAddEAdDEAd0001"
      values.gasPayingToken:
+        {"addr_":"katana:0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE","decimals_":18}
      values.gasPayingTokenName:
+        "Ether"
      values.gasPayingTokenSymbol:
+        "ETH"
      values.isCustomGasToken:
+        false
      values.l1FeeOverhead:
+        0
      values.l1FeeScalar:
+        0
      values.version:
+        "1.7.0"
      implementationNames.katana:0x3Ba4007f5C922FBb33C454B41ea7a1f11E83df2C:
-        ""
+        "L1Block"
      template:
+        "opstack/Layer2/L1Block"
      sourceHashes:
+        ["0xdb44b7e73254e0314f233ca790b4d44a2f9e3cebc019945c0ef84b9e3579c77a","0x399e57fff478211b47d61c5acb60592a4df8ffa5716959a1a6ee2ccabc44915e"]
      description:
+        "Simple contract that returns information about the latest L1 block, which is derived permissionlessly from the L1 chain."
    }
```

```diff
    contract GnosisSafeL2 (katana:0x4e981bAe8E3cd06Ca911ffFE5504B2653ac1C38a) [GnosisSafe] {
    +++ description: None
      receivedPermissions.6:
+        {"permission":"interact","from":"katana:0xBBa0935Fa93Eb23de7990b47F0D96a8f75766d13","delay":43200,"description":"propose, cancel and execute transactions in the timelock, manage all access control roles and change the minimum delay.","role":".timelockAdminAC","condition":"(no delay if in emergency state)"}
      receivedPermissions.7:
+        {"permission":"upgrade","from":"katana:0x2a3DD3EB832aF982ec71669E178424b10Dca2EDe","role":"admin","via":[{"address":"katana:0x0F99738B2Fc14D77308337f3e2596b63aE7BCC4A"},{"address":"katana:0xBBa0935Fa93Eb23de7990b47F0D96a8f75766d13","delay":43200,"condition":"(no delay if in emergency state)"}]}
      receivedPermissions.8:
+        {"permission":"upgrade","from":"katana:0xa40D5f56745a118D0906a34E69aeC8C0Db1cB8fA","role":"admin","via":[{"address":"katana:0x0F99738B2Fc14D77308337f3e2596b63aE7BCC4A"},{"address":"katana:0xBBa0935Fa93Eb23de7990b47F0D96a8f75766d13","delay":43200,"condition":"(no delay if in emergency state)"}]}
      directlyReceivedPermissions:
+        [{"permission":"act","from":"katana:0xBBa0935Fa93Eb23de7990b47F0D96a8f75766d13","delay":43200,"role":".timelockAdminAC","condition":"(no delay if in emergency state)"}]
    }
```

```diff
    contract SafeL2 (katana:0xd0673F989bc3BA9314d0AAF28BfC84e99B7898CC) [GnosisSafe] {
    +++ description: None
      receivedPermissions.0:
+        {"permission":"interact","from":"katana:0xBBa0935Fa93Eb23de7990b47F0D96a8f75766d13","delay":43200,"description":"propose, cancel and execute transactions in the timelock, manage all access control roles and change the minimum delay.","role":".timelockAdminAC","condition":"(no delay if in emergency state)"}
      receivedPermissions.1:
+        {"permission":"upgrade","from":"katana:0x2a3DD3EB832aF982ec71669E178424b10Dca2EDe","role":"admin","via":[{"address":"katana:0x0F99738B2Fc14D77308337f3e2596b63aE7BCC4A"},{"address":"katana:0xBBa0935Fa93Eb23de7990b47F0D96a8f75766d13","delay":43200,"condition":"(no delay if in emergency state)"}]}
      receivedPermissions.19:
+        {"permission":"upgrade","from":"katana:0xa40D5f56745a118D0906a34E69aeC8C0Db1cB8fA","role":"admin","via":[{"address":"katana:0x0F99738B2Fc14D77308337f3e2596b63aE7BCC4A"},{"address":"katana:0xBBa0935Fa93Eb23de7990b47F0D96a8f75766d13","delay":43200,"condition":"(no delay if in emergency state)"}]}
      directlyReceivedPermissions.1:
+        {"permission":"act","from":"katana:0xBBa0935Fa93Eb23de7990b47F0D96a8f75766d13","delay":43200,"role":".timelockAdminAC","condition":"(no delay if in emergency state)"}
    }
```

```diff
+   Status: CREATED
    contract L2Timelock (katana:0xBBa0935Fa93Eb23de7990b47F0D96a8f75766d13) [polygon-cdk/L2Timelock]
    +++ description: A timelock with access control. The current minimum delay is 12h.
```

Generated with discovered.json: 0xff12c061a5c326f80ec4e60917a1c65d9a03f1ce

# Diff at Thu, 28 May 2026 12:57:31 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@66dc249f7108a6fbf8b6581aed0b7625deeebb2a block: 1778675724
- current timestamp: 1779956198

## Description

minimal diff upgrade to the OptiPortal that adds deposited transactions! https://flat.l2beat.com/diff/ink:0xC0D3C0d3C0d3c0d3C0d3C0D3c0D3c0d3c0D30016/katana:0xFBF44D0341C03098A1D9C0336e3d5C34E8BFdf1A

users can now force transactions that do not relate to bridging (they still cannot force ETH- or token deposits). the force tx delay in op stack (or op-succinct) depends on the node config/programHash and both are unverified for katana. as soon as we have a source, we should look for `sequencerWindowSize` (OP stack standard is 3600). we will assume standard and show the delay as 12h but say that this is unverified.

proposals are also still permissioned, meaning that, assuming sequencer and proposer/prover are the same entity, the system changed from 'sequencer can cherry-pick/censor' to 'proposer must blanket-censor, no cherry-pick'.

the agglayer bridge is separate from the OP stack proof system and bridge and has its own proof system and l2 smart contract. this includes the gas token (ETH) bridge. the oracle on L2 that allows to update the agglayer bridge state roots is permissioned to an EOA atm.

## Watched changes

```diff
    contract Yearn Strategist Multisig (eth:0x16388463d60FFE0661Cf7F1f31a7D658aC790ff7) [GnosisSafe] {
    +++ description: None
      values.$members.0:
+        "eth:0x5E5D6f849Fa86c058f148E9D3f643C8F4c43f20b"
      values.$members.1:
+        "eth:0x5250077c42627cBd112988f32D482acC9ff40bDB"
      values.$members.2:
+        "eth:0xC357eE8a8DdE88Dd5a3Ea54847Adef6846A28c51"
      values.$members.3:
+        "eth:0xFcc3796370e1538F8cC60bec19A8be5457f2C74F"
      values.$members.4:
+        "eth:0xFafFb75e14faFf9f11315E44a2E54A22872c7a34"
      values.$members.2:
-        "eth:0xBD5f1429Ab467E69BEeba51E547C00A21F2a2092"
      values.$members.3:
-        "eth:0x787aba336583f4A1D4f8cBBFDFFD49f3a38De665"
      values.$members.4:
-        "eth:0x2C2dc95F8C8060a7e3B354c1B9540881AEa1613C"
      values.$members.5:
-        "eth:0xd0002c648CCa8DeE2f2b8D70D542Ccde8ad6EC03"
      values.$members.6:
-        "eth:0x1b5f15DCb82d25f91c65b53CEe151E8b9fBdD271"
    }
```

```diff
    contract OptimismPortal2 (eth:0x250D30c523104bf0a06825e7eAdE4Dc46EdfE40E) [katana/OptimismPortal2] {
    +++ description: Stores the configuration of the OP stack components and proof system. Specifies which game type is used for state validation, which currently is the PermissionedDisputeGame. This contract is modified to disable asset bridging, but it allows forced transactions.
      name:
-        "OptimismPortal2_neutered"
+        "OptimismPortal2"
      template:
-        "opstack/OptimismPortal2_noForce"
+        "katana/OptimismPortal2"
      sourceHashes.1:
-        "0x4cc0e4525ed77b81565c05c0e673e043a93d9878924197f772581f72c11c91c5"
+        "0xfcecb325a86c39482f8e9d29272f25089eec0b5fbefe21444fd1ea690c911f0c"
      description:
-        "The OptimismPortal contract usually is the main entry point to deposit funds from L1 to L2 or for finalizing withdrawals. It specifies which game type can be used for withdrawals, which currently is the PermissionedDisputeGame. This specific fork of the standard contract **disables the depositTransaction() function**, which prevents users from sending or forcing any transactions from L1 to L2, including token deposits. It is instead used for configuration and administration of the system."
+        "Stores the configuration of the OP stack components and proof system. Specifies which game type is used for state validation, which currently is the PermissionedDisputeGame. This contract is modified to disable asset bridging, but it allows forced transactions."
      values.$implementation:
-        "eth:0x3e6753e6c0162061cfa7eEc88d8fdaE651160Bf4"
+        "eth:0x5dEcbEEEFeCc5353355CD79A8fECC4c03F61ce8a"
      values.$pastUpgrades.8:
+        ["2026-05-22T16:31:35.000Z","0x46d8e0a3a5383c133292ef51e4d7eef96fddc443b892d38e62c39b1186055691",["eth:0x5dEcbEEEFeCc5353355CD79A8fECC4c03F61ce8a"]]
      values.$upgradeCount:
-        8
+        9
      values.version:
-        "5.1.1"
+        "agg3.15.0"
      fieldMeta.respectedGameType:
+        {"severity":"HIGH"}
      implementationNames.eth:0x3e6753e6c0162061cfa7eEc88d8fdaE651160Bf4:
-        "OptimismPortal2"
      implementationNames.eth:0x5dEcbEEEFeCc5353355CD79A8fECC4c03F61ce8a:
+        "OptimismPortal2"
      usedTypes.0.arg.1337:
+        "KailuaGame"
    }
```

```diff
    contract AgglayerBridgeL2 (katana:0x2a3DD3EB832aF982ec71669E178424b10Dca2EDe) [katana/AgglayerBridgeL2] {
    +++ description: Agglayer bridge contract. Supports interop with Ethereum and blockchains connected to Agglayer. Escrows all preminted ETH because it cannot mint on the L2. The globalExitRootManager is used as an oracle to validate bridge messages against.
      values.claimedGlobalIndexHashChain:
-        "0xfcb94fe6eae1dd3db9426645c49bdd5a55f574591df36333e3822c2e28a6aa5d"
+        "0x5fede20963bde12c20e3076c4426550f570914a8a035c1381bc98f8bed306a46"
      values.getRoot:
-        "0x77b2c19aaa8daa89496903e91a84dfdf09cbc2821671eb351e953ed0c646be5b"
+        "0x1d743ae7262c7410af3fb680660e6c1f336b2f49609f709a69a9fd8b9ad21bb2"
    }
```

```diff
    contract GlobalExitRootManagerL2SovereignChain (katana:0xa40D5f56745a118D0906a34E69aeC8C0Db1cB8fA) [katana/GlobalExitRootManagerL2SovereignChain] {
    +++ description: Manages Layer 2 and global merkle roots (exit roots). It stores exit roots written during bridge deposits, accepts imported global exit roots from a permissioned address, and manages historical roots.
      values.insertedGERHashChain:
-        "0x64bc5ca77fa29cfc3cd117f2314df1d7c1c5f3d01f31f2c58bd277f3e75b1016"
+        "0xaae24c57922b6453c1812383dba7b31cf9788b57cfc281e208b4e2911e5feee7"
      values.lastRollupExitRoot:
-        "0x77b2c19aaa8daa89496903e91a84dfdf09cbc2821671eb351e953ed0c646be5b"
+        "0x1d743ae7262c7410af3fb680660e6c1f336b2f49609f709a69a9fd8b9ad21bb2"
    }
```

## Source code changes

```diff
.../OptimismPortal2}/OptimismPortal2.sol           | 25 +++++++++++++++-------
 .../OptimismPortal2}/Proxy.p.sol                   |  0
 2 files changed, 17 insertions(+), 8 deletions(-)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1778675724 (main branch discovery), not current.

```diff
+   Status: CREATED
    contract upgradeProxy (katana:0x0F99738B2Fc14D77308337f3e2596b63aE7BCC4A) [N/A]
    +++ description: None
```

```diff
+   Status: CREATED
    contract AgglayerBridgeL2 (katana:0x2a3DD3EB832aF982ec71669E178424b10Dca2EDe) [katana/AgglayerBridgeL2]
    +++ description: Agglayer bridge contract. Supports interop with Ethereum and blockchains connected to Agglayer. Escrows all preminted ETH because it cannot mint on the L2. The globalExitRootManager is used as an oracle to validate bridge messages against.
```

```diff
+   Status: CREATED
    contract DeployerWhitelist (katana:0x4200000000000000000000000000000000000002) [N/A]
    +++ description: None
```

```diff
+   Status: CREATED
    contract L2CrossDomainMessenger (katana:0x4200000000000000000000000000000000000007) [opstack/Layer2/L2CrossDomainMessenger]
    +++ description: The L2CrossDomainMessenger (L2xDM) contract sends messages from L2 to L1, and relays messages from L1 onto L2 with a system tx. In the event that a message sent from L2 to L1 is rejected for exceeding the L1 gas limit, it can be resubmitted via this contract’s replay function.
```

```diff
+   Status: CREATED
    contract GasPriceOracle (katana:0x420000000000000000000000000000000000000F) [N/A]
    +++ description: None
```

```diff
+   Status: CREATED
    contract L2StandardBridge (katana:0x4200000000000000000000000000000000000010) [opstack/Layer2/L2StandardBridge]
    +++ description: The L2StandardBridge contract is the main entry point to deposit or withdraw ERC20 tokens from L2 to L1. This contract can store any token.
```

```diff
+   Status: CREATED
    contract SequencerFeeVault (katana:0x4200000000000000000000000000000000000011) [opstack/Layer2/SequencerFeeVault]
    +++ description: Collects the sequencer fees.
```

```diff
+   Status: CREATED
    contract OptimismMintableERC20Factory (katana:0x4200000000000000000000000000000000000012) [opstack/Layer2/OptimismMintableERC20Factory]
    +++ description: Factory contract to create bridge compliant ERC20 IOU token representations of bridged L1 ERC20 tokens.
```

```diff
+   Status: CREATED
    contract L1BlockNumber (katana:0x4200000000000000000000000000000000000013) [opstack/Layer2/L1BlockNumber]
    +++ description: Simple contract that returns the latest L1 block number.
```

```diff
+   Status: CREATED
    contract L2ERC721Bridge (katana:0x4200000000000000000000000000000000000014) [opstack/Layer2/L2ERC721Bridge]
    +++ description: The L2ERC721Bridge contract is the main entry point to deposit or withdraw ERC721 tokens from L2 to L1. This contract can store any token.
```

```diff
+   Status: CREATED
    contract L1Block (katana:0x4200000000000000000000000000000000000015) [N/A]
    +++ description: None
```

```diff
+   Status: CREATED
    contract L2ToL1MessagePasser (katana:0x4200000000000000000000000000000000000016) [katana/L2ToL1MessagePasser]
    +++ description: Contract used internally by the L2CrossDomainMessenger to send messages to L1. It can also be used directly as a low-level interface.
```

```diff
+   Status: CREATED
    contract OptimismMintableERC721Factory (katana:0x4200000000000000000000000000000000000017) [opstack/Layer2/OptimismMintableERC721Factory]
    +++ description: Factory contract to create bridge compliant ERC721 IOU token representations of bridged L1 ERC721 tokens.
```

```diff
+   Status: CREATED
    contract ProxyAdmin (katana:0x4200000000000000000000000000000000000018) [global/ProxyAdmin]
    +++ description: None
```

```diff
+   Status: CREATED
    contract BaseFeeVault (katana:0x4200000000000000000000000000000000000019) [opstack/Layer2/BaseFeeVault]
    +++ description: Collects EIP-1559 base fees
```

```diff
+   Status: CREATED
    contract L1FeeVault (katana:0x420000000000000000000000000000000000001A) [opstack/Layer2/L1FeeVault]
    +++ description: Collects the L1 portion of the L2 transaction fees.
```

```diff
+   Status: CREATED
    contract OperatorFeeVault (katana:0x420000000000000000000000000000000000001b) [opstack/Layer2/OperatorFeeVault]
    +++ description: Holds the 'operator fees' for the L2 network, which are part of the L2 fees that users pay.
```

```diff
+   Status: CREATED
    contract SchemaRegistry (katana:0x4200000000000000000000000000000000000020) [opstack/Layer2/SchemaRegistry]
    +++ description: Contracts to register schemas for the Ethereum Attestation Service (EAS).
```

```diff
+   Status: CREATED
    contract EAS (katana:0x4200000000000000000000000000000000000021) [opstack/Layer2/EAS]
    +++ description: Contract containing the main logic for the Ethereum Attestation Service (EAS).
```

```diff
+   Status: CREATED
    contract GnosisSafeL2 (katana:0x4e981bAe8E3cd06Ca911ffFE5504B2653ac1C38a) [GnosisSafe]
    +++ description: None
```

```diff
+   Status: CREATED
    contract SafeL2 (katana:0x7990513f4d64d57524a0B2519759f53B0cB1aEbd) [GnosisSafe]
    +++ description: None
```

```diff
+   Status: CREATED
    contract GlobalExitRootManagerL2SovereignChain (katana:0xa40D5f56745a118D0906a34E69aeC8C0Db1cB8fA) [katana/GlobalExitRootManagerL2SovereignChain]
    +++ description: Manages Layer 2 and global merkle roots (exit roots). It stores exit roots written during bridge deposits, accepts imported global exit roots from a permissioned address, and manages historical roots.
```

```diff
+   Status: CREATED
    contract BridgeLib (katana:0xb30C032b183525de7427f04e79F45Cd19866E124) [katana/BridgeLib]
    +++ description: Utility library contract for the AgglayerBridgeL2.
```

```diff
+   Status: CREATED
    contract SafeL2 (katana:0xd0673F989bc3BA9314d0AAF28BfC84e99B7898CC) [GnosisSafe]
    +++ description: None
```

```diff
+   Status: CREATED
    contract TokenWrappedBridgeUpgradeable (katana:0xF0777a825470092b3Debc9af291634460b8E1a2c) [katana/TokenWrappedBridgeUpgradeable]
    +++ description: An ERC-20 implementation designed for cross-chain assets on the L2. It restricts token minting or burning strictly to the primary bridge contract.
```

Generated with discovered.json: 0xa9cc009f3c137deb4732a8e3a64b9059552d4b55

# Diff at Fri, 15 May 2026 12:36:04 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@a5152b9ba7ad7f85f2af3d814f74630fcaa7c917 block: 1778675724
- current timestamp: 1778675724

## Description

Shape hashes update after flattener improvements

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1778675724 (main branch discovery), not current.

```diff
    EOA  (eth:0x227D9Ea843910Edd305c42e7bB9Ce6D9f369238c) {
    +++ description: None
      sourceHashes.0:
-        "0x6fcf212849ffbf34d907a048df4d05a6c97f876a620c7386a770735262604c54"
+        "0x1f44812af62d28f019e30e8eb2af596fb36c7db9d34576972c0405e110a6ef45"
    }
```

Generated with discovered.json: 0x4d8fadab31298992bbc352ba7910c7320f30e8ae

# Diff at Wed, 13 May 2026 12:37:16 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@dd13366f13be78635363f6f5a496347735f4ea4e block: 1777451715
- current timestamp: 1778675724

## Description

ms member change.

## Watched changes

```diff
    contract Safe (eth:0xFA58659F64a393A6E1A548ABc70Ad2CfE1e8f9Cb) [GnosisSafe] {
    +++ description: None
      values.$members.4:
-        "eth:0x6c20ea7778EA9F3Afd74Ce4538bc4D9d61E6ABb1"
+        "eth:0xFAc88BB6229F47A31A78F0Ba91E5a541Cb1866a3"
    }
```

Generated with discovered.json: 0x3e2fbb7e627e10c95bbd7a3491e0e2a9cb62d6a4

# Diff at Fri, 08 May 2026 07:51:30 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@488d190650457a1fba9b18a83f14a17ab8b2c84c block: 1777451715
- current timestamp: 1777451715

## Description

Use the new flattener implementation

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1777451715 (main branch discovery), not current.

```diff
    contract L1ERC721Bridge (eth:0x15a32FCeA89617Ff450F094cDE102CCa46598B7F) [opstack/L1ERC721Bridge] {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      sourceHashes.1:
-        "0x75cd470a9d1c1afc343b599b1c14731f55bb36fe8a4e844ddb88a0b791918795"
+        "0x1f65fda230b6d0df44e466b06418b2e12a401ef82c07521ad18d2f4ae6c70fb2"
    }
```

```diff
    contract Yearn Strategist Multisig (eth:0x16388463d60FFE0661Cf7F1f31a7D658aC790ff7) [GnosisSafe] {
    +++ description: None
      sourceHashes.1:
-        "0xd42bbf9f7dcd3720a7fc6bdc6edfdfae8800a37d6dd4decfa0ef6ca4a2e88940"
+        "0x22c7fb8365a538c05d34b77dd9c1967d1ddb7427eda69f84989d4c56603312b7"
    }
```

```diff
    contract PreimageOracle (eth:0x1fb8cdFc6831fc866Ed9C51aF8817Da5c287aDD3) [opstack/PreimageOracle] {
    +++ description: The PreimageOracle contract is used to load the required data from L1 for a dispute game.
      sourceHashes.0:
-        "0xd9838f1f137bd5397f583f33c414ec9c0fc3dc69401213fae0f09c36d4ac8e47"
+        "0x16701fcaa0e04e5481701a81736e7c8ee2c8aa32da272bf74e0589e6a90c3615"
    }
```

```diff
    contract L1CrossDomainMessenger (eth:0x2008A6Ba8CAF85AaFAe7880664Dfe681D533ac2E) [opstack/L1CrossDomainMessenger] {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      sourceHashes.1:
-        "0xfa9c986019a03bd66efb7584a7064e708f6fb71956643a9d4daa2c0972a29c03"
+        "0x1f2c13ad1144ce6548e578b834c33b0d65b1564aeb0d5c708ed4e7fb50535cc6"
    }
```

```diff
    EOA  (eth:0x227D9Ea843910Edd305c42e7bB9Ce6D9f369238c) {
    +++ description: None
      sourceHashes.0:
-        "0x41c6ce964a4ef3e910f9ddf78152734dae8d1b1094ffc8334c50249a3b112bbf"
+        "0x6fcf212849ffbf34d907a048df4d05a6c97f876a620c7386a770735262604c54"
    }
```

```diff
    contract OptimismPortal2_neutered (eth:0x250D30c523104bf0a06825e7eAdE4Dc46EdfE40E) [opstack/OptimismPortal2_noForce] {
    +++ description: The OptimismPortal contract usually is the main entry point to deposit funds from L1 to L2 or for finalizing withdrawals. It specifies which game type can be used for withdrawals, which currently is the PermissionedDisputeGame. This specific fork of the standard contract **disables the depositTransaction() function**, which prevents users from sending or forcing any transactions from L1 to L2, including token deposits. It is instead used for configuration and administration of the system.
      sourceHashes.1:
-        "0x9b5cb94efaca7f6a941c6e29cd8f71079ec5ea2360e3f4948e59560dd107d7f9"
+        "0x4cc0e4525ed77b81565c05c0e673e043a93d9878924197f772581f72c11c91c5"
    }
```

```diff
    contract Safe (eth:0x261a25ec6c396389B75B6b22BD4A8227070E3B50) [GnosisSafe] {
    +++ description: None
      sourceHashes.1:
-        "0x7d388119a66f3eae147d748f86136f073d907d6b36f7e87e9363c4c7a2899a8a"
+        "0xe23c519b7324d6dc9132c8567ac55ae72bdf168c914d22825c7614d822364b0f"
    }
```

```diff
    contract vbWBTC (eth:0x2C24B57e2CCd1f273045Af6A5f632504C432374F) [polygon-cdk/GenericVaultBridgeToken] {
    +++ description: This token contract uses a standard 'vault bridge token' implementation created by Agglayer CDK. It keeps deposited assets in a vault and issues an IOU token (Vault Bridge WBTC) which can be deposited to Agglayer. The underlying asset is generating yield, which does not accrue to the vbWBTC-IOU but is sent to eth:0x261a25ec6c396389B75B6b22BD4A8227070E3B50.
      sourceHashes.0:
-        "0x525b22d02f8b39d3432dfaf0061e3d91caa10d282e86ec7abeb4ca11790f6762"
+        "0xbda0929be0223e0b4c8c6cdb89dbe1fd3ef62e3aee028519d4c97c5dbab66e7f"
      sourceHashes.1:
-        "0xbae5ca8308e7ebc2f3f89d306b5fa59219afbb56103cc06937985534329887e5"
+        "0x4d93504fbe4f7e569851aa1ad2bf15b62fe0e98e6d460705aa239938e1cde799"
    }
```

```diff
    contract vbETH (eth:0x2DC70fb75b88d2eB4715bc06E1595E6D97c34DFF) [polygon-cdk/GenericVaultBridgeToken] {
    +++ description: This token contract uses a standard 'vault bridge token' implementation created by Agglayer CDK. It keeps deposited assets in a vault and issues an IOU token (Vault Bridge ETH) which can be deposited to Agglayer. The underlying asset is generating yield, which does not accrue to the vbETH-IOU but is sent to eth:0x261a25ec6c396389B75B6b22BD4A8227070E3B50.
      sourceHashes.0:
-        "0x525b22d02f8b39d3432dfaf0061e3d91caa10d282e86ec7abeb4ca11790f6762"
+        "0xbda0929be0223e0b4c8c6cdb89dbe1fd3ef62e3aee028519d4c97c5dbab66e7f"
      sourceHashes.1:
-        "0x4988be5ea9a1e587b7ad36189901d0e442b1905a12fcfb0f0896de5d089234cd"
+        "0x319536f70acef24a56b3d5a84702a68097dc967c05df69d22fcb616bdd39a50a"
    }
```

```diff
    contract Katana vaultBridge Multisig 1 (eth:0x2De242e27386e224E5fbF110EA8406d5B70740ec) [GnosisSafe] {
    +++ description: None
      sourceHashes.1:
-        "0x7d388119a66f3eae147d748f86136f073d907d6b36f7e87e9363c4c7a2899a8a"
+        "0xe23c519b7324d6dc9132c8567ac55ae72bdf168c914d22825c7614d822364b0f"
    }
```

```diff
    contract SuperchainConfig (eth:0x2F439B95fa789C5d3a5C99cc70EB3ee83D08a811) [opstack/SuperchainConfigNoGuard] {
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system. Since the OptimismPortal is not used for state root management in this setup, the guardian role and pausing may be inconsequential.
      sourceHashes.1:
-        "0x53a6b3db7f270298025bbfef7f6c77b420a9808341212fa9cf54a5e157a18567"
+        "0x5fb525d1572fb90d060d122143b915059cbff39e0298b345857fd4267d7f6b28"
    }
```

```diff
    contract vbUSDS (eth:0x3DD459dE96F9C28e3a343b831cbDC2B93c8C4855) [polygon-cdk/GenericVaultBridgeToken] {
    +++ description: This token contract uses a standard 'vault bridge token' implementation created by Agglayer CDK. It keeps deposited assets in a vault and issues an IOU token (Vault Bridge USDS) which can be deposited to Agglayer. The underlying asset is generating yield, which does not accrue to the vbUSDS-IOU but is sent to eth:0x261a25ec6c396389B75B6b22BD4A8227070E3B50.
      sourceHashes.0:
-        "0x525b22d02f8b39d3432dfaf0061e3d91caa10d282e86ec7abeb4ca11790f6762"
+        "0xbda0929be0223e0b4c8c6cdb89dbe1fd3ef62e3aee028519d4c97c5dbab66e7f"
      sourceHashes.1:
-        "0xbae5ca8308e7ebc2f3f89d306b5fa59219afbb56103cc06937985534329887e5"
+        "0x4d93504fbe4f7e569851aa1ad2bf15b62fe0e98e6d460705aa239938e1cde799"
    }
```

```diff
    contract Safe (eth:0x3e86A8bcAF0A96DD16Ec8160532DA13b2C0f6e21) [GnosisSafe] {
    +++ description: None
      sourceHashes.1:
-        "0x7d388119a66f3eae147d748f86136f073d907d6b36f7e87e9363c4c7a2899a8a"
+        "0xe23c519b7324d6dc9132c8567ac55ae72bdf168c914d22825c7614d822364b0f"
    }
```

```diff
    contract MigrationManager (eth:0x417d01B64Ea30C4E163873f3a1f77b727c689e02) [polygon-cdk/MigrationManager] {
    +++ description: Helper contract for the vaultBridge tokens on Layer 2. If any vbTokens are minted 'natively' on Layer 2, this contract can receive the underlying assets and lock them in the Layer 1 vaults.
      sourceHashes.0:
-        "0x525b22d02f8b39d3432dfaf0061e3d91caa10d282e86ec7abeb4ca11790f6762"
+        "0xbda0929be0223e0b4c8c6cdb89dbe1fd3ef62e3aee028519d4c97c5dbab66e7f"
      sourceHashes.1:
-        "0x9b0e45306537c9239f8f5b642a4beaafd206728e42a557b88f1eeccee5647066"
+        "0x0492945ad94df8f6644e545e7fb05a7a5caa0c34e24d6aa529a5a04458f78ed2"
    }
```

```diff
    contract Conduit Multisig 1 (eth:0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) [GnosisSafe] {
    +++ description: None
      sourceHashes.1:
-        "0xd42bbf9f7dcd3720a7fc6bdc6edfdfae8800a37d6dd4decfa0ef6ca4a2e88940"
+        "0x22c7fb8365a538c05d34b77dd9c1967d1ddb7427eda69f84989d4c56603312b7"
    }
```

```diff
    contract Katana Foundation Engineering/Security Multisig (eth:0x4e981bAe8E3cd06Ca911ffFE5504B2653ac1C38a) [GnosisSafe] {
    +++ description: None
      sourceHashes.1:
-        "0x59fe14e95a8aa7f52213f18bae5c9329cf583a7ba31194698b15eddb97d5e825"
+        "0xf88f29d444411e68fef376c8e035ef1f39314143a7b6aff952709203095663bd"
    }
```

```diff
    contract vbUSDC (eth:0x53E82ABbb12638F09d9e624578ccB666217a765e) [polygon-cdk/GenericVaultBridgeToken] {
    +++ description: This token contract uses a standard 'vault bridge token' implementation created by Agglayer CDK. It keeps deposited assets in a vault and issues an IOU token (Vault Bridge USDC) which can be deposited to Agglayer. The underlying asset is generating yield, which does not accrue to the vbUSDC-IOU but is sent to eth:0x261a25ec6c396389B75B6b22BD4A8227070E3B50.
      sourceHashes.0:
-        "0x525b22d02f8b39d3432dfaf0061e3d91caa10d282e86ec7abeb4ca11790f6762"
+        "0xbda0929be0223e0b4c8c6cdb89dbe1fd3ef62e3aee028519d4c97c5dbab66e7f"
      sourceHashes.1:
-        "0xbae5ca8308e7ebc2f3f89d306b5fa59219afbb56103cc06937985534329887e5"
+        "0x4d93504fbe4f7e569851aa1ad2bf15b62fe0e98e6d460705aa239938e1cde799"
    }
```

```diff
    contract MIPS (eth:0x6463dEE3828677F6270d83d45408044fc5eDB908) [opstack/MIPS] {
    +++ description: The MIPS contract is used to execute the final step of the dispute game which objectively determines the winner of the dispute.
      sourceHashes.0:
-        "0xff203abbbb6edba7fff3caefb2752c4e7b786992b19c4f0f8ab568bc0a5fbf04"
+        "0x4a578c18a0b50fb7778c6a6b805dcb18427478d4002c8f7f28c2146dcfbf3a33"
    }
```

```diff
    contract Katana yieldRecipient Mulsitig (eth:0x67C912fF560951526BffDff66dFbD4DF8AE23756) [GnosisSafe] {
    +++ description: None
      sourceHashes.1:
-        "0x7d388119a66f3eae147d748f86136f073d907d6b36f7e87e9363c4c7a2899a8a"
+        "0xe23c519b7324d6dc9132c8567ac55ae72bdf168c914d22825c7614d822364b0f"
    }
```

```diff
    contract vbUSDT (eth:0x6d4f9f9f8f0155509ecd6Ac6c544fF27999845CC) [polygon-cdk/GenericVaultBridgeToken] {
    +++ description: This token contract uses a standard 'vault bridge token' implementation created by Agglayer CDK. It keeps deposited assets in a vault and issues an IOU token (Vault Bridge USDT) which can be deposited to Agglayer. The underlying asset is generating yield, which does not accrue to the vbUSDT-IOU but is sent to eth:0x261a25ec6c396389B75B6b22BD4A8227070E3B50.
      sourceHashes.0:
-        "0x525b22d02f8b39d3432dfaf0061e3d91caa10d282e86ec7abeb4ca11790f6762"
+        "0xbda0929be0223e0b4c8c6cdb89dbe1fd3ef62e3aee028519d4c97c5dbab66e7f"
      sourceHashes.1:
-        "0xbae5ca8308e7ebc2f3f89d306b5fa59219afbb56103cc06937985534329887e5"
+        "0x4d93504fbe4f7e569851aa1ad2bf15b62fe0e98e6d460705aa239938e1cde799"
    }
```

```diff
    contract Katana Steakhouse Financial / Morpho Multisig (eth:0x827e86072B06674a077f592A531dcE4590aDeCdB) [GnosisSafe] {
    +++ description: None
      sourceHashes.1:
-        "0x7d388119a66f3eae147d748f86136f073d907d6b36f7e87e9363c4c7a2899a8a"
+        "0xe23c519b7324d6dc9132c8567ac55ae72bdf168c914d22825c7614d822364b0f"
    }
```

```diff
    contract L1StandardBridge (eth:0x98906C3f90A06B5484DD67bf32938815d2993dBC) [opstack/L1StandardBridge] {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      sourceHashes.1:
-        "0x0114d3af66179d6404d14360203dc6bcf404f23e2db4ee1b5848e923e131bc00"
+        "0xcacd38e7b52353ad3463da40b7e7a29b028f95500a82590d2b8f8ffd26b83f6d"
    }
```

```diff
    contract Polygon Labs Engineering/Security Multisig (eth:0x9d851f8b8751c5FbC09b9E74E6e68E9950949052) [GnosisSafe] {
    +++ description: None
      sourceHashes.1:
-        "0x7d388119a66f3eae147d748f86136f073d907d6b36f7e87e9363c4c7a2899a8a"
+        "0xe23c519b7324d6dc9132c8567ac55ae72bdf168c914d22825c7614d822364b0f"
    }
```

```diff
    contract PermissionedDisputeGame (eth:0xA7A26BbA1191a064637d7B0b23896589F4e4d22D) [opstack/PermissionedDisputeGame] {
    +++ description: Same as FaultDisputeGame, but only two permissioned addresses are designated as proposer and challenger.
      sourceHashes.0:
-        "0x284eddae8c2726c3558d3ce1656fcd222947612b13d4d440519d6a82fc68acec"
+        "0x23375b62bc80656613e6e37217856dbef4aa805d14edc5827ca5e26e87cf4af4"
    }
```

```diff
    contract OptimismMintableERC20Factory (eth:0xA84C37cD0b9bA1B43276C11976DBE9d1344C7f4E) [opstack/OptimismMintableERC20Factory] {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintableERC20 as this chain's representation of a token on the host chain, or vice-versa.
      sourceHashes.1:
-        "0x25bad2bdb7df4347412a48e271dea1489299460192b43b8ca52ed191b4940992"
+        "0x307d4cb83e682629880fe9bb874a188805e3b93cb11a2cbf80095975f1e5b04e"
    }
```

```diff
    contract Katana vaultBridge Multisig 2 (eth:0xA8C31B2edd84c654d06d626383f4154D1E40C5Ff) [GnosisSafe] {
    +++ description: None
      sourceHashes.1:
-        "0x7d388119a66f3eae147d748f86136f073d907d6b36f7e87e9363c4c7a2899a8a"
+        "0xe23c519b7324d6dc9132c8567ac55ae72bdf168c914d22825c7614d822364b0f"
    }
```

```diff
    contract AnchorStateRegistry (eth:0xaA8a62563CFe4E36118ED479B5486F503b438376) [opstack/AnchorStateRegistry_post13] {
    +++ description: Contains the latest confirmed state root that can be used as a starting point in a dispute game. It specifies which game type can be used for withdrawals, which currently is the PermissionedDisputeGame.
      sourceHashes.1:
-        "0x1601463fd2e47d8994c28a90b556c6933f38e8685214f702dc41a5ae08d9787c"
+        "0xf808a203af41f7932eb8e39985e56a7c75c940a260fb17d76d1003a3793281b5"
    }
```

```diff
    contract DelayedWETH (eth:0xb41151Bf2B989d3771caBd5BCb5C435949543322) [opstack/DelayedWETH] {
    +++ description: Contract designed to hold the bonded ETH for each game. It is designed as a wrapper around WETH to allow an owner to function as a backstop if a game would incorrectly distribute funds.
      sourceHashes.1:
-        "0x6ad951c662b7a889a64dd91252b0b8bc9694fd4df15a08bdec6693673a44dda1"
+        "0xee6bf3279fe5b849ed7e945391e2f05982b56336bdd0c0764e365d9efe3a70b9"
    }
```

```diff
    contract SystemConfig (eth:0xb6e1f8B589A14B79DDD3aD7F0589AB548c70C174) [opstack/SystemConfig] {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      sourceHashes.1:
-        "0x09e12b8c0307a4da75a8b84ed7c88ced81e386ec09025ec5b36873b4f69614d0"
+        "0xaa1b3bedab4e63198240e9dea4503f0e615e4d18a545961c9f11b72143279fbc"
    }
```

```diff
    contract Polygon Multisig 2 (eth:0xd0673F989bc3BA9314d0AAF28BfC84e99B7898CC) [GnosisSafe] {
    +++ description: None
      sourceHashes.1:
-        "0x7d388119a66f3eae147d748f86136f073d907d6b36f7e87e9363c4c7a2899a8a"
+        "0xe23c519b7324d6dc9132c8567ac55ae72bdf168c914d22825c7614d822364b0f"
    }
```

```diff
    contract DisputeGameFactory (eth:0xe06278351d120288eDfCB963F934113Ca3C21AFe) [opstack/DisputeGameFactory] {
    +++ description: The dispute game factory allows the creation of dispute games, used to propose state roots and eventually challenge them.
      sourceHashes.1:
-        "0x19f3f7c7ee3977705261bfb86f826d5f97b885796f2246be7cc3e815c3e95dca"
+        "0x7daf6049672fd2ab7dc8dd3b6287e1d0a40958346c5e2857c4616a73dcac4da6"
    }
```

```diff
    contract Katana vaultBridge Multisig 3 (eth:0xf4F2f5F6bAdBE05433C4604320ecC56BbECBC04E) [GnosisSafe] {
    +++ description: None
      sourceHashes.1:
-        "0x7d388119a66f3eae147d748f86136f073d907d6b36f7e87e9363c4c7a2899a8a"
+        "0xe23c519b7324d6dc9132c8567ac55ae72bdf168c914d22825c7614d822364b0f"
    }
```

```diff
    contract Safe (eth:0xFA58659F64a393A6E1A548ABc70Ad2CfE1e8f9Cb) [GnosisSafe] {
    +++ description: None
      sourceHashes.1:
-        "0x7d388119a66f3eae147d748f86136f073d907d6b36f7e87e9363c4c7a2899a8a"
+        "0xe23c519b7324d6dc9132c8567ac55ae72bdf168c914d22825c7614d822364b0f"
    }
```

Generated with discovered.json: 0xb46265823c9828953238730cac67a9ef8dbfaef7

# Diff at Tue, 05 May 2026 10:22:20 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@b6437082b3ea8fb0d97f4474b1c3452a1ce271b0 block: 1777451715
- current timestamp: 1777451715

## Description

Include deployer address

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1777451715 (main branch discovery), not current.

```diff
    contract AggchainFEP (eth:0x100d3ca4f97776A40A7D93dB4AbF0FEA34230666) {
    +++ description: The main system contract defining the katana Aggchain logic. This contract, based on the OP-Succinct L2OutputOracle, supports validity proofs and OP stack outputRoots (L2 state roots) are saved here.
      deployerAddress:
+        "eth:0xD9478f759a13Bfa1d9dAB3cDF5ff0C099d5EfCFC"
    }
```

```diff
    contract ProxyAdmin (eth:0x14Be6579A41342ca6B402ec85E7be538e6Ade951) {
    +++ description: None
      deployerAddress:
+        "eth:0x32bdc6A4e8C654dF65503CBb0eDc82B4Ce9158e6"
    }
```

```diff
    contract L1ERC721Bridge (eth:0x15a32FCeA89617Ff450F094cDE102CCa46598B7F) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      deployerAddress:
+        "eth:0xa63182aB4dED10f5007b7B78698851cE39b72F49"
    }
```

```diff
    contract Yearn Strategist Multisig (eth:0x16388463d60FFE0661Cf7F1f31a7D658aC790ff7) {
    +++ description: None
      deployerAddress:
+        "eth:0x73f2f3A4fF97B6A6d7afc03C449f0e9a0c0d90aB"
    }
```

```diff
    contract ProxyAdmin (eth:0x19DbD16f0a8e706D817B7e3b7bcF72917Ebb8832) {
    +++ description: None
      deployerAddress:
+        "eth:0xa63182aB4dED10f5007b7B78698851cE39b72F49"
    }
```

```diff
    contract PreimageOracle (eth:0x1fb8cdFc6831fc866Ed9C51aF8817Da5c287aDD3) {
    +++ description: The PreimageOracle contract is used to load the required data from L1 for a dispute game.
      deployerAddress:
+        "eth:0x1D0519EeD308BcD49e4ebc149284F83ebC275284"
    }
```

```diff
    contract L1CrossDomainMessenger (eth:0x2008A6Ba8CAF85AaFAe7880664Dfe681D533ac2E) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      deployerAddress:
+        "eth:0xa63182aB4dED10f5007b7B78698851cE39b72F49"
    }
```

```diff
    contract OptimismPortal2_neutered (eth:0x250D30c523104bf0a06825e7eAdE4Dc46EdfE40E) {
    +++ description: The OptimismPortal contract usually is the main entry point to deposit funds from L1 to L2 or for finalizing withdrawals. It specifies which game type can be used for withdrawals, which currently is the PermissionedDisputeGame. This specific fork of the standard contract **disables the depositTransaction() function**, which prevents users from sending or forcing any transactions from L1 to L2, including token deposits. It is instead used for configuration and administration of the system.
      deployerAddress:
+        "eth:0xa63182aB4dED10f5007b7B78698851cE39b72F49"
    }
```

```diff
    contract Safe (eth:0x261a25ec6c396389B75B6b22BD4A8227070E3B50) {
    +++ description: None
      deployerAddress:
+        "eth:0x227D9Ea843910Edd305c42e7bB9Ce6D9f369238c"
    }
```

```diff
    contract ProxyAdmin (eth:0x263b251D67BB154DD6b8352539466ACE7948ED56) {
    +++ description: None
      deployerAddress:
+        "eth:0x32bdc6A4e8C654dF65503CBb0eDc82B4Ce9158e6"
    }
```

```diff
    contract vbWBTC (eth:0x2C24B57e2CCd1f273045Af6A5f632504C432374F) {
    +++ description: This token contract uses a standard 'vault bridge token' implementation created by Agglayer CDK. It keeps deposited assets in a vault and issues an IOU token (Vault Bridge WBTC) which can be deposited to Agglayer. The underlying asset is generating yield, which does not accrue to the vbWBTC-IOU but is sent to eth:0x261a25ec6c396389B75B6b22BD4A8227070E3B50.
      deployerAddress:
+        "eth:0x32bdc6A4e8C654dF65503CBb0eDc82B4Ce9158e6"
    }
```

```diff
    contract vbETH (eth:0x2DC70fb75b88d2eB4715bc06E1595E6D97c34DFF) {
    +++ description: This token contract uses a standard 'vault bridge token' implementation created by Agglayer CDK. It keeps deposited assets in a vault and issues an IOU token (Vault Bridge ETH) which can be deposited to Agglayer. The underlying asset is generating yield, which does not accrue to the vbETH-IOU but is sent to eth:0x261a25ec6c396389B75B6b22BD4A8227070E3B50.
      deployerAddress:
+        "eth:0x32bdc6A4e8C654dF65503CBb0eDc82B4Ce9158e6"
    }
```

```diff
    contract Katana vaultBridge Multisig 1 (eth:0x2De242e27386e224E5fbF110EA8406d5B70740ec) {
    +++ description: None
      deployerAddress:
+        "eth:0xeD44D1CFfB91e163CB7126bdEeA83959f175dB37"
    }
```

```diff
    contract SuperchainConfig (eth:0x2F439B95fa789C5d3a5C99cc70EB3ee83D08a811) {
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system. Since the OptimismPortal is not used for state root management in this setup, the guardian role and pausing may be inconsequential.
      deployerAddress:
+        "eth:0xa63182aB4dED10f5007b7B78698851cE39b72F49"
    }
```

```diff
    contract ProxyAdmin (eth:0x377a9e5df2882DC1DF8A0bD162cbc640eA634010) {
    +++ description: None
      deployerAddress:
+        "eth:0x32bdc6A4e8C654dF65503CBb0eDc82B4Ce9158e6"
    }
```

```diff
    contract vbUSDS (eth:0x3DD459dE96F9C28e3a343b831cbDC2B93c8C4855) {
    +++ description: This token contract uses a standard 'vault bridge token' implementation created by Agglayer CDK. It keeps deposited assets in a vault and issues an IOU token (Vault Bridge USDS) which can be deposited to Agglayer. The underlying asset is generating yield, which does not accrue to the vbUSDS-IOU but is sent to eth:0x261a25ec6c396389B75B6b22BD4A8227070E3B50.
      deployerAddress:
+        "eth:0x32bdc6A4e8C654dF65503CBb0eDc82B4Ce9158e6"
    }
```

```diff
    contract Safe (eth:0x3e86A8bcAF0A96DD16Ec8160532DA13b2C0f6e21) {
    +++ description: None
      deployerAddress:
+        "eth:0x23CDc4Bc7713A1a8cb2adBbb5BdfCd135F74Bd50"
    }
```

```diff
    contract MigrationManager (eth:0x417d01B64Ea30C4E163873f3a1f77b727c689e02) {
    +++ description: Helper contract for the vaultBridge tokens on Layer 2. If any vbTokens are minted 'natively' on Layer 2, this contract can receive the underlying assets and lock them in the Layer 1 vaults.
      deployerAddress:
+        "eth:0x32bdc6A4e8C654dF65503CBb0eDc82B4Ce9158e6"
    }
```

```diff
    contract ProxyAdmin (eth:0x420693B32113a0e00Eb9f3315D5D5ec3b32C2d69) {
    +++ description: None
      deployerAddress:
+        "eth:0x32bdc6A4e8C654dF65503CBb0eDc82B4Ce9158e6"
    }
```

```diff
    contract Conduit Multisig 1 (eth:0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      deployerAddress:
+        "eth:0x0954eC5B731501abf85766B5c6f5DE4C2B60BC44"
    }
```

```diff
    contract Katana Foundation Engineering/Security Multisig (eth:0x4e981bAe8E3cd06Ca911ffFE5504B2653ac1C38a) {
    +++ description: None
      deployerAddress:
+        "eth:0xeD44D1CFfB91e163CB7126bdEeA83959f175dB37"
    }
```

```diff
    contract vbUSDC (eth:0x53E82ABbb12638F09d9e624578ccB666217a765e) {
    +++ description: This token contract uses a standard 'vault bridge token' implementation created by Agglayer CDK. It keeps deposited assets in a vault and issues an IOU token (Vault Bridge USDC) which can be deposited to Agglayer. The underlying asset is generating yield, which does not accrue to the vbUSDC-IOU but is sent to eth:0x261a25ec6c396389B75B6b22BD4A8227070E3B50.
      deployerAddress:
+        "eth:0x32bdc6A4e8C654dF65503CBb0eDc82B4Ce9158e6"
    }
```

```diff
    contract MIPS (eth:0x6463dEE3828677F6270d83d45408044fc5eDB908) {
    +++ description: The MIPS contract is used to execute the final step of the dispute game which objectively determines the winner of the dispute.
      deployerAddress:
+        "eth:0x1D0519EeD308BcD49e4ebc149284F83ebC275284"
    }
```

```diff
    contract Katana yieldRecipient Mulsitig (eth:0x67C912fF560951526BffDff66dFbD4DF8AE23756) {
    +++ description: None
      deployerAddress:
+        "eth:0x52EAF3F04cbac0a4B9878A75AB2523722325D4D4"
    }
```

```diff
    contract ProxyAdmin (eth:0x6d0ff67fb427422AfF35EEa8596949B374b09a52) {
    +++ description: None
      deployerAddress:
+        "eth:0xa63182aB4dED10f5007b7B78698851cE39b72F49"
    }
```

```diff
    contract vbUSDT (eth:0x6d4f9f9f8f0155509ecd6Ac6c544fF27999845CC) {
    +++ description: This token contract uses a standard 'vault bridge token' implementation created by Agglayer CDK. It keeps deposited assets in a vault and issues an IOU token (Vault Bridge USDT) which can be deposited to Agglayer. The underlying asset is generating yield, which does not accrue to the vbUSDT-IOU but is sent to eth:0x261a25ec6c396389B75B6b22BD4A8227070E3B50.
      deployerAddress:
+        "eth:0x32bdc6A4e8C654dF65503CBb0eDc82B4Ce9158e6"
    }
```

```diff
    contract Katana Steakhouse Financial / Morpho Multisig (eth:0x827e86072B06674a077f592A531dcE4590aDeCdB) {
    +++ description: None
      deployerAddress:
+        "eth:0x0D61C8b6CA9669A36F351De3AE335e9689dd9C5b"
    }
```

```diff
    contract ProxyAdmin (eth:0x8970650CF3f1E57cA804C65B4DBcFf698789FE30) {
    +++ description: None
      deployerAddress:
+        "eth:0x32bdc6A4e8C654dF65503CBb0eDc82B4Ce9158e6"
    }
```

```diff
    contract L1StandardBridge (eth:0x98906C3f90A06B5484DD67bf32938815d2993dBC) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      deployerAddress:
+        "eth:0xa63182aB4dED10f5007b7B78698851cE39b72F49"
    }
```

```diff
    contract Polygon Labs Engineering/Security Multisig (eth:0x9d851f8b8751c5FbC09b9E74E6e68E9950949052) {
    +++ description: None
      deployerAddress:
+        "eth:0xeD44D1CFfB91e163CB7126bdEeA83959f175dB37"
    }
```

```diff
    contract PermissionedDisputeGame (eth:0xA7A26BbA1191a064637d7B0b23896589F4e4d22D) {
    +++ description: Same as FaultDisputeGame, but only two permissioned addresses are designated as proposer and challenger.
      deployerAddress:
+        "eth:0x0a1C5E42e423fab63746d375B84d3Fe4cAf9b513"
    }
```

```diff
    contract OptimismMintableERC20Factory (eth:0xA84C37cD0b9bA1B43276C11976DBE9d1344C7f4E) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintableERC20 as this chain's representation of a token on the host chain, or vice-versa.
      deployerAddress:
+        "eth:0xa63182aB4dED10f5007b7B78698851cE39b72F49"
    }
```

```diff
    contract Katana vaultBridge Multisig 2 (eth:0xA8C31B2edd84c654d06d626383f4154D1E40C5Ff) {
    +++ description: None
      deployerAddress:
+        "eth:0xeD44D1CFfB91e163CB7126bdEeA83959f175dB37"
    }
```

```diff
    contract AnchorStateRegistry (eth:0xaA8a62563CFe4E36118ED479B5486F503b438376) {
    +++ description: Contains the latest confirmed state root that can be used as a starting point in a dispute game. It specifies which game type can be used for withdrawals, which currently is the PermissionedDisputeGame.
      deployerAddress:
+        "eth:0x0a1C5E42e423fab63746d375B84d3Fe4cAf9b513"
    }
```

```diff
    contract DelayedWETH (eth:0xb41151Bf2B989d3771caBd5BCb5C435949543322) {
    +++ description: Contract designed to hold the bonded ETH for each game. It is designed as a wrapper around WETH to allow an owner to function as a backstop if a game would incorrectly distribute funds.
      deployerAddress:
+        "eth:0x0a1C5E42e423fab63746d375B84d3Fe4cAf9b513"
    }
```

```diff
    contract SystemConfig (eth:0xb6e1f8B589A14B79DDD3aD7F0589AB548c70C174) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      deployerAddress:
+        "eth:0xa63182aB4dED10f5007b7B78698851cE39b72F49"
    }
```

```diff
    contract Polygon Multisig 2 (eth:0xd0673F989bc3BA9314d0AAF28BfC84e99B7898CC) {
    +++ description: None
      deployerAddress:
+        "eth:0xeD44D1CFfB91e163CB7126bdEeA83959f175dB37"
    }
```

```diff
    contract ProxyAdmin (eth:0xD1e389c046FB734D2a0c7C390312210c408ba832) {
    +++ description: None
      deployerAddress:
+        "eth:0x32bdc6A4e8C654dF65503CBb0eDc82B4Ce9158e6"
    }
```

```diff
    contract DisputeGameFactory (eth:0xe06278351d120288eDfCB963F934113Ca3C21AFe) {
    +++ description: The dispute game factory allows the creation of dispute games, used to propose state roots and eventually challenge them.
      deployerAddress:
+        "eth:0xa63182aB4dED10f5007b7B78698851cE39b72F49"
    }
```

```diff
    contract AddressManager (eth:0xEaB94275eD336D80d4F46EA8Ea0427e351f11D65) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      deployerAddress:
+        "eth:0xa63182aB4dED10f5007b7B78698851cE39b72F49"
    }
```

```diff
    contract Katana vaultBridge Multisig 3 (eth:0xf4F2f5F6bAdBE05433C4604320ecC56BbECBC04E) {
    +++ description: None
      deployerAddress:
+        "eth:0xeD44D1CFfB91e163CB7126bdEeA83959f175dB37"
    }
```

```diff
    contract Safe (eth:0xFA58659F64a393A6E1A548ABc70Ad2CfE1e8f9Cb) {
    +++ description: None
      deployerAddress:
+        "eth:0x0A4857fD89ABfB7536a6D0Bd4400EF769E84Ec8b"
    }
```

Generated with discovered.json: 0x803e30e063e2afd6d194e087d3d9e822847241e0

# Diff at Wed, 29 Apr 2026 08:37:50 GMT:

- author: vincfurc (<vincfurc@users.noreply.github.com>)
- comparing to: main@0695512a70f7175257fb7756eb2008702d3f0dc5 block: 1777024331
- current timestamp: 1777451715

## Description

Two unrelated changes:

1. **EOA `0x227D9Ea8...` set up an EIP-7702 delegation.** This EOA is a signer on two katana multisigs. It now delegates to `0x63c0c19a...` (MetaMask's `EIP7702StatelessDeleGator` v1.3.0) with `delegationManager = 0xdb9B1e94...` and `entryPoint = 0x00000000...da032` (ERC-4337 EntryPoint v0.7). No protocol change for katana — just the signer's own EOA upgrading to a smart-account setup that runs through ERC-4337.

2. **Conduit Multisig 1 (`eth:0x4a496227...`)** — signer `0x381624F7` removed. Threshold unchanged at 4; total signers 13 → 12 (31% → 33%). Same shared multisig change observed on `forknet`.

## Watched changes

```diff
    EOA  (eth:0x227D9Ea843910Edd305c42e7bB9Ce6D9f369238c) {
    +++ description: None
      proxyType:
-        "EOA"
+        "EIP7702 EOA"
      sourceHashes:
+        ["0x41c6ce964a4ef3e910f9ddf78152734dae8d1b1094ffc8334c50249a3b112bbf"]
      values:
+        {"$implementation":"eth:0x63c0c19a282a1B52b07dD5a65b58948A07DAE32B","delegationManager":"eth:0xdb9B1e94B5b69Df7e401DDbedE43491141047dB3","DOMAIN_VERSION":"1","eip712Domain":{"fields":"0x0f","name":"EIP7702StatelessDeleGator","version":"1","chainId":1,"verifyingContract":"eth:0x227D9Ea843910Edd305c42e7bB9Ce6D9f369238c","salt":"0x0000000000000000000000000000000000000000000000000000000000000000","extensions":[]},"entryPoint":"eth:0x0000000071727De22E5E9d8BAf0edAc6f37da032","getDeposit":0,"getDomainHash":"0x876a24e12d1595ba43f838917743b4ea108e3957c4df5ec812cf3348b156d941","getNonce":0,"NAME":"EIP7702StatelessDeleGator","PACKED_USER_OP_TYPEHASH":"0xbc37962d8bd1d319c95199bdfda6d3f92baa8903a61b32d5f4ec1f4b36a3bc18","VERSION":"1.3.0"}
    }
```

```diff
    contract Conduit Multisig 1 (eth:0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      values.$members.1:
-        "eth:0x381624F7912BddD83dc67c6C53Ef6FE61B87Cf07"
      values.multisigThreshold:
-        "4 of 13 (31%)"
+        "4 of 12 (33%)"
    }
```

Generated with discovered.json: 0x3c1d650d30e35bc107663c7573d3b22015fd3be6

# Diff at Fri, 24 Apr 2026 10:10:16 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@ffb976d00306d4043b30ea28fd12565a6eb5d7ab block: 1776863221
- current timestamp: 1777024331

## Description

New opsuccinct config.

## Watched changes

```diff
    contract AggchainFEP (eth:0x100d3ca4f97776A40A7D93dB4AbF0FEA34230666) {
    +++ description: The main system contract defining the katana Aggchain logic. This contract, based on the OP-Succinct L2OutputOracle, supports validity proofs and OP stack outputRoots (L2 state roots) are saved here.
      values.selectedOpSuccinctConfig.aggregationVkey:
-        "0x0000000000000000000000000000000000000000000000000000000000000000"
+        "0x0065e407807b2b3610cc9ff6637ea16e815552bc34b48c206529d3cfcd9d1152"
      values.selectedOpSuccinctConfig.rangeVkeyCommitment:
-        "0x0000000000000000000000000000000000000000000000000000000000000000"
+        "0x5c7c05114bc5dd360fdb52ec2b4977a45f7e22806bc949a72759ea1172202229"
      values.selectedOpSuccinctConfig.rollupConfigHash:
-        "0x0000000000000000000000000000000000000000000000000000000000000000"
+        "0x352a9738897d236014fd5bd11986bf008b3b623b037405900ab338f93cdf5272"
+++ description: currently enforced OpSuccinctConfig. update the call handler for the full config if this changes.
+++ severity: HIGH
      values.selectedOpSuccinctConfigName:
-        "0x36e852219a68060b42e38154cd2c3e2b36ae97ea0445b1b9a034232cda5b3c00"
+        "0xe719c402037f76346e69e021164101e16954889c052f75f16a29758815723dde"
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1776863221 (main branch discovery), not current.

```diff
    contract AggchainFEP (eth:0x100d3ca4f97776A40A7D93dB4AbF0FEA34230666) {
    +++ description: The main system contract defining the katana Aggchain logic. This contract, based on the OP-Succinct L2OutputOracle, supports validity proofs and OP stack outputRoots (L2 state roots) are saved here.
      values.selectedOpSuccinctConfig.aggregationVkey:
-        "0x00987c64e3710bc9ab5f3a93f3f1249be821b1a6eedb14dbc1ae2d6fc4fd9337"
+        "0x0000000000000000000000000000000000000000000000000000000000000000"
      values.selectedOpSuccinctConfig.rangeVkeyCommitment:
-        "0x05f486d43f4066c24b8652cd52e122df59f0ea4c33c0df8155dc58de37f93330"
+        "0x0000000000000000000000000000000000000000000000000000000000000000"
      values.selectedOpSuccinctConfig.rollupConfigHash:
-        "0x352a9738897d236014fd5bd11986bf008b3b623b037405900ab338f93cdf5272"
+        "0x0000000000000000000000000000000000000000000000000000000000000000"
    }
```

Generated with discovered.json: 0x3dabedc1e0d35c0eb02aead7964f84dd156ecb50

# Diff at Wed, 22 Apr 2026 13:08:46 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@2164a3ed7ae404dbff0f676d052e9bf58c88f761 block: 1775809429
- current timestamp: 1776863221

## Description

fee and multisig changes.

## Watched changes

```diff
    contract Katana Steakhouse Financial / Morpho Multisig (eth:0x827e86072B06674a077f592A531dcE4590aDeCdB) {
    +++ description: None
      values.$members.0:
+        "eth:0xf83dB716A1Ff12F9005F98f678D8BE97B8Bc81d6"
      values.multisigThreshold:
-        "2 of 5 (40%)"
+        "2 of 6 (33%)"
    }
```

```diff
    contract SystemConfig (eth:0xb6e1f8B589A14B79DDD3aD7F0589AB548c70C174) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      values.minBaseFee:
-        0
+        1000000
      values.operatorFeeConstant:
-        1351351351351
+        0
      values.operatorFeeScalar:
-        0
+        100000
    }
```

```diff
    contract Polygon Multisig 2 (eth:0xd0673F989bc3BA9314d0AAF28BfC84e99B7898CC) {
    +++ description: None
      values.$members.0:
+        "eth:0x6f8CC67A7F6c61E4047aC4870583899CC1fBD08a"
      values.multisigThreshold:
-        "3 of 4 (75%)"
+        "3 of 5 (60%)"
    }
```

Generated with discovered.json: 0xd5330447b7517fadfe067dcefe4d35ee9fe67c54

# Diff at Fri, 10 Apr 2026 08:24:59 GMT:

- author: Sergey Shemyakov (<sergey.shemyakov@l2beat.com>)
- comparing to: main@cab23b784a70bbaea251f1f4559cea26a4d51f77 block: 1775561575
- current timestamp: 1775809429

## Description

Rotated one member, removed two members from Polygon admin ms.

## Watched changes

```diff
    contract Polygon Multisig 2 (eth:0xd0673F989bc3BA9314d0AAF28BfC84e99B7898CC) {
    +++ description: None
      values.$members.0:
-        "eth:0x1B054e6c9F424879d8ad829EE254F88B4D3ac304"
+        "eth:0x4A658D678804DD0a4Ad0A2c26AD4F4EB2517154b"
      values.$members.3:
-        "eth:0x34d23C4fb6542B467cA8724bAD30AC811399b184"
      values.$members.4:
-        "eth:0x1DD6473a6bb5fF9041D945C7d15AC8fBc2Ee1164"
      values.multisigThreshold:
-        "3 of 6 (50%)"
+        "3 of 4 (75%)"
    }
```

Generated with discovered.json: 0xd89f2ed9ba53595826282026a670b0527d96f786

# Diff at Tue, 07 Apr 2026 11:34:04 GMT:

- author: Sergey Shemyakov (<sergey.shemyakov@l2beat.com>)
- comparing to: main@6939c1061ac26e2572f4c6c6aafc9329a8ef2113 block: 1773665394
- current timestamp: 1775561575

## Description

Rotated MS member.

## Watched changes

```diff
    contract Katana yieldRecipient Mulsitig (eth:0x67C912fF560951526BffDff66dFbD4DF8AE23756) {
    +++ description: None
      values.$members.2:
-        "eth:0x6c20ea7778EA9F3Afd74Ce4538bc4D9d61E6ABb1"
+        "eth:0xf2dc90d4645579f261cA36E81181986dB576BbEe"
    }
```

Generated with discovered.json: 0xca5b85eab7c1e405516bbd8f5c2a12a5e0d48b7b

# Diff at Mon, 16 Mar 2026 12:53:36 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@edb0fff695048631d1d966c5e28186da0c4751ee block: 1772786542
- current timestamp: 1773665394

## Description

progHashes changed, cannot find on githubs.

## Watched changes

```diff
    contract AggchainFEP (eth:0x100d3ca4f97776A40A7D93dB4AbF0FEA34230666) {
    +++ description: The main system contract defining the katana Aggchain logic. This contract, based on the OP-Succinct L2OutputOracle, supports validity proofs and OP stack outputRoots (L2 state roots) are saved here.
      values.selectedOpSuccinctConfig.aggregationVkey:
-        "0x0000000000000000000000000000000000000000000000000000000000000000"
+        "0x00987c64e3710bc9ab5f3a93f3f1249be821b1a6eedb14dbc1ae2d6fc4fd9337"
      values.selectedOpSuccinctConfig.rangeVkeyCommitment:
-        "0x0000000000000000000000000000000000000000000000000000000000000000"
+        "0x05f486d43f4066c24b8652cd52e122df59f0ea4c33c0df8155dc58de37f93330"
      values.selectedOpSuccinctConfig.rollupConfigHash:
-        "0x0000000000000000000000000000000000000000000000000000000000000000"
+        "0x352a9738897d236014fd5bd11986bf008b3b623b037405900ab338f93cdf5272"
+++ description: currently enforced OpSuccinctConfig. update the call handler for the full config if this changes.
+++ severity: HIGH
      values.selectedOpSuccinctConfigName:
-        "0xf7803dc0ac1322b6bff3d4f9a48ffd57102e4076d8e40333dd72084f0cf9cc68"
+        "0x36e852219a68060b42e38154cd2c3e2b36ae97ea0445b1b9a034232cda5b3c00"
    }
```

```diff
    contract Polygon Multisig 2 (eth:0xd0673F989bc3BA9314d0AAF28BfC84e99B7898CC) {
    +++ description: None
      values.$members.0:
+        "eth:0x1B054e6c9F424879d8ad829EE254F88B4D3ac304"
      values.$members.0:
-        "eth:0x2483A0d6a3Bd89D5C17aA80B3f8f6102ac053361"
+        "eth:0xA697656ac37ee1f59A8a5318F61601B4C208960D"
      values.multisigThreshold:
-        "3 of 5 (60%)"
+        "3 of 6 (50%)"
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1772786542 (main branch discovery), not current.

```diff
    contract AggchainFEP (eth:0x100d3ca4f97776A40A7D93dB4AbF0FEA34230666) {
    +++ description: The main system contract defining the katana Aggchain logic. This contract, based on the OP-Succinct L2OutputOracle, supports validity proofs and OP stack outputRoots (L2 state roots) are saved here.
      values.selectedOpSuccinctConfig.aggregationVkey:
-        "0x0077f45ec2258cc98fa879d13a2773190bffb9cafb9f428ce3c5718dc768f03e"
+        "0x0000000000000000000000000000000000000000000000000000000000000000"
      values.selectedOpSuccinctConfig.rangeVkeyCommitment:
-        "0x0e5158b64c46007c04e5972727a2a26832337fbe765162294b0ce1ed0db36f9d"
+        "0x0000000000000000000000000000000000000000000000000000000000000000"
      values.selectedOpSuccinctConfig.rollupConfigHash:
-        "0x352a9738897d236014fd5bd11986bf008b3b623b037405900ab338f93cdf5272"
+        "0x0000000000000000000000000000000000000000000000000000000000000000"
    }
```

Generated with discovered.json: 0xf0bb58023a98fd39109645752020ba3478d9e196

# Diff at Fri, 06 Mar 2026 08:59:26 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@464f5fa94dac665b855f973e6cbee143f2fbb4bd block: 1772612116
- current timestamp: 1772786542

## Description

progHash changed to op succinct 3.5.0.

## Watched changes

```diff
    contract AggchainFEP (eth:0x100d3ca4f97776A40A7D93dB4AbF0FEA34230666) {
    +++ description: The main system contract defining the katana Aggchain logic. This contract, based on the OP-Succinct L2OutputOracle, supports validity proofs and OP stack outputRoots (L2 state roots) are saved here.
      values.selectedOpSuccinctConfig.aggregationVkey:
-        "0x0000000000000000000000000000000000000000000000000000000000000000"
+        "0x0077f45ec2258cc98fa879d13a2773190bffb9cafb9f428ce3c5718dc768f03e"
      values.selectedOpSuccinctConfig.rangeVkeyCommitment:
-        "0x0000000000000000000000000000000000000000000000000000000000000000"
+        "0x0e5158b64c46007c04e5972727a2a26832337fbe765162294b0ce1ed0db36f9d"
      values.selectedOpSuccinctConfig.rollupConfigHash:
-        "0x0000000000000000000000000000000000000000000000000000000000000000"
+        "0x352a9738897d236014fd5bd11986bf008b3b623b037405900ab338f93cdf5272"
+++ description: currently enforced OpSuccinctConfig. update the call handler for the full config if this changes.
+++ severity: HIGH
      values.selectedOpSuccinctConfigName:
-        "0xfda6f1430e8363d3850cb5ff3f026f6ce01ad0fad017cb06a1dcbeb72c00304d"
+        "0xf7803dc0ac1322b6bff3d4f9a48ffd57102e4076d8e40333dd72084f0cf9cc68"
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1772612116 (main branch discovery), not current.

```diff
    contract AggchainFEP (eth:0x100d3ca4f97776A40A7D93dB4AbF0FEA34230666) {
    +++ description: The main system contract defining the katana Aggchain logic. This contract, based on the OP-Succinct L2OutputOracle, supports validity proofs and OP stack outputRoots (L2 state roots) are saved here.
      values.selectedOpSuccinctConfig.aggregationVkey:
-        "0x007efdd073c9845bbc446e0e62018af999bde96ecec416725391efa4a3f0a44d"
+        "0x0000000000000000000000000000000000000000000000000000000000000000"
      values.selectedOpSuccinctConfig.rangeVkeyCommitment:
-        "0x64c8517c14f10577381d8961139a4420420e90e528d02be96e2b0961671db248"
+        "0x0000000000000000000000000000000000000000000000000000000000000000"
      values.selectedOpSuccinctConfig.rollupConfigHash:
-        "0x7179e8c558e26751a56fc2fe9ce0a84ce248cfc98cb5b7a5178655b0c5c42ea5"
+        "0x0000000000000000000000000000000000000000000000000000000000000000"
    }
```

Generated with discovered.json: 0x81b7e8b613d61a7ab9904009a1ded2823915648a

# Diff at Wed, 04 Mar 2026 08:43:04 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@6a30ad0d296eab5cfae7df5ce6dbeea89f168dc4 block: 1772458371
- current timestamp: 1772612116

## Description

Upgrade to known op-contracts version.

Optimism portal is neutered, diff to standard: https://disco.l2beat.com/diff/eth:0x7Cf803296662e8C72A6C1d6450572209aCF7f202/eth:0x3e6753e6c0162061cfa7eEc88d8fdaE651160Bf4

rest of the contracts are standard.

## Watched changes

```diff
    contract L1ERC721Bridge (eth:0x15a32FCeA89617Ff450F094cDE102CCa46598B7F) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      sourceHashes.1:
-        "0x28669b49da3effd51f0f9424ca9cdd455c5b9327c09a40c65fc06f114a6eb837"
+        "0x75cd470a9d1c1afc343b599b1c14731f55bb36fe8a4e844ddb88a0b791918795"
      values.$implementation:
-        "eth:0x7aE1d3BD877a4C5CA257404ce26BE93A02C98013"
+        "eth:0x74f1aC50EB0BE98853805D381C884f5f9abDEcf9"
      values.$pastUpgrades.3:
+        ["2026-03-03T15:49:23.000Z","0xa814ff1c6a02fa4a717875ed09e96cbd61874d85c896f3ddd8df290c73f34961",["eth:0x7f1d12fB2911EB095278085f721e644C1f675696"]]
      values.$pastUpgrades.4:
+        ["2026-03-03T15:49:23.000Z","0xa814ff1c6a02fa4a717875ed09e96cbd61874d85c896f3ddd8df290c73f34961",["eth:0x74f1aC50EB0BE98853805D381C884f5f9abDEcf9"]]
      values.$upgradeCount:
-        3
+        5
      values.version:
-        "2.4.0"
+        "2.9.0"
      values.initVersion:
+        3
      values.proxyAdmin:
+        "eth:0x19DbD16f0a8e706D817B7e3b7bcF72917Ebb8832"
      values.proxyAdminOwner:
+        "eth:0xd0673F989bc3BA9314d0AAF28BfC84e99B7898CC"
      values.systemConfig:
+        "eth:0xb6e1f8B589A14B79DDD3aD7F0589AB548c70C174"
      implementationNames.eth:0x7aE1d3BD877a4C5CA257404ce26BE93A02C98013:
-        "L1ERC721Bridge"
      implementationNames.eth:0x74f1aC50EB0BE98853805D381C884f5f9abDEcf9:
+        "L1ERC721Bridge"
    }
```

```diff
    contract ProxyAdmin (eth:0x19DbD16f0a8e706D817B7e3b7bcF72917Ebb8832) {
    +++ description: None
      directlyReceivedPermissions.2:
-        {"permission":"upgrade","from":"eth:0x1AaA08d577cbC3da3b955DC1B7a281D7b8fE3372","role":"admin"}
      directlyReceivedPermissions.5:
-        {"permission":"upgrade","from":"eth:0x74034597d29613CC8C0BDc8780e1d292A553Bd32","role":"admin"}
      directlyReceivedPermissions.6:
+        {"permission":"upgrade","from":"eth:0xaA8a62563CFe4E36118ED479B5486F503b438376","role":"admin"}
      directlyReceivedPermissions.7:
+        {"permission":"upgrade","from":"eth:0xb41151Bf2B989d3771caBd5BCb5C435949543322","role":"admin"}
    }
```

```diff
-   Status: DELETED
    contract AnchorStateRegistry (eth:0x1AaA08d577cbC3da3b955DC1B7a281D7b8fE3372)
    +++ description: Contains the latest confirmed state root that can be used as a starting point in a dispute game.
```

```diff
    contract L1CrossDomainMessenger (eth:0x2008A6Ba8CAF85AaFAe7880664Dfe681D533ac2E) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      sourceHashes.1:
-        "0x03bcdc719cb7bd0a1377c01bb50b30a6122b308f673b7d7b15a3bb8628e6bd8c"
+        "0xfa9c986019a03bd66efb7584a7064e708f6fb71956643a9d4daa2c0972a29c03"
      values.$implementation:
-        "eth:0x5D5a095665886119693F0B41d8DFeE78da033e8B"
+        "eth:0xb686F13AfF1e427a1f993F29ab0F2E7383729FE0"
      values.$pastUpgrades.3:
+        ["2026-03-03T15:49:23.000Z","0xa814ff1c6a02fa4a717875ed09e96cbd61874d85c896f3ddd8df290c73f34961",["eth:0x22D12E0FAebD62d429514A65EBAe32dd316c12D6"]]
      values.$pastUpgrades.4:
+        ["2026-03-03T15:49:23.000Z","0xa814ff1c6a02fa4a717875ed09e96cbd61874d85c896f3ddd8df290c73f34961",["eth:0xb686F13AfF1e427a1f993F29ab0F2E7383729FE0"]]
      values.$upgradeCount:
-        3
+        5
      values.version:
-        "2.6.0"
+        "2.11.0"
      values.initVersion:
+        3
      values.proxyAdmin:
+        "eth:0x19DbD16f0a8e706D817B7e3b7bcF72917Ebb8832"
      values.proxyAdminOwner:
+        "eth:0xd0673F989bc3BA9314d0AAF28BfC84e99B7898CC"
      values.systemConfig:
+        "eth:0xb6e1f8B589A14B79DDD3aD7F0589AB548c70C174"
      implementationNames.eth:0x5D5a095665886119693F0B41d8DFeE78da033e8B:
-        "L1CrossDomainMessenger"
      implementationNames.eth:0xb686F13AfF1e427a1f993F29ab0F2E7383729FE0:
+        "L1CrossDomainMessenger"
    }
```

```diff
    contract OptimismPortal2_neutered (eth:0x250D30c523104bf0a06825e7eAdE4Dc46EdfE40E) {
    +++ description: The OptimismPortal contract usually is the main entry point to deposit funds from L1 to L2 or for finalizing withdrawals. It specifies which game type can be used for withdrawals, which currently is the PermissionedDisputeGame. This specific fork of the standard contract **disables the depositTransaction() function**, which prevents users from sending or forcing any transactions from L1 to L2, including token deposits. It is instead used for configuration and administration of the system.
      sourceHashes.1:
-        "0x9cf3cb8a68c82a3a8328495d5f019daa51e9098a69b69ee8e349e3058b789338"
+        "0x9b5cb94efaca7f6a941c6e29cd8f71079ec5ea2360e3f4948e59560dd107d7f9"
      values.$implementation:
-        "eth:0x51c852eC17062FB229A117Cb8abCBc7Eb171D5Bc"
+        "eth:0x3e6753e6c0162061cfa7eEc88d8fdaE651160Bf4"
      values.$pastUpgrades.5:
+        ["2026-03-03T15:49:23.000Z","0xa814ff1c6a02fa4a717875ed09e96cbd61874d85c896f3ddd8df290c73f34961",["eth:0x381E729FF983FA4BCEd820e7b922d79bF653B999"]]
      values.$pastUpgrades.6:
+        ["2026-03-03T15:49:23.000Z","0xa814ff1c6a02fa4a717875ed09e96cbd61874d85c896f3ddd8df290c73f34961",["eth:0x7Cf803296662e8C72A6C1d6450572209aCF7f202"]]
      values.$pastUpgrades.7:
+        ["2026-03-03T15:49:23.000Z","0xa814ff1c6a02fa4a717875ed09e96cbd61874d85c896f3ddd8df290c73f34961",["eth:0x3e6753e6c0162061cfa7eEc88d8fdaE651160Bf4"]]
      values.$upgradeCount:
-        5
+        8
      values.respectedGameTypeUpdatedAt:
-        1746742811
+        1772552963
      values.version:
-        "3.14.0"
+        "5.1.1"
      values.anchorStateRegistry:
+        "eth:0xaA8a62563CFe4E36118ED479B5486F503b438376"
      values.ethLockbox:
+        "eth:0x0000000000000000000000000000000000000000"
      values.initVersion:
+        3
      values.proxyAdmin:
+        "eth:0x19DbD16f0a8e706D817B7e3b7bcF72917Ebb8832"
      values.proxyAdminOwner:
+        "eth:0xd0673F989bc3BA9314d0AAF28BfC84e99B7898CC"
      implementationNames.eth:0x51c852eC17062FB229A117Cb8abCBc7Eb171D5Bc:
-        "OptimismPortal2"
      implementationNames.eth:0x3e6753e6c0162061cfa7eEc88d8fdaE651160Bf4:
+        "OptimismPortal2"
    }
```

```diff
    contract SuperchainConfig (eth:0x2F439B95fa789C5d3a5C99cc70EB3ee83D08a811) {
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system. Since the OptimismPortal is not used for state root management in this setup, the guardian role and pausing may be inconsequential.
      sourceHashes.1:
-        "0x03dba37173051b02bc81487e181c791bcf1aef664c249e5d035f11f488bdd686"
+        "0x53a6b3db7f270298025bbfef7f6c77b420a9808341212fa9cf54a5e157a18567"
      values.$implementation:
-        "eth:0x4da82a327773965b8d4D85Fa3dB8249b387458E7"
+        "eth:0xb08Cc720F511062537ca78BdB0AE691F04F5a957"
      values.$pastUpgrades.4:
+        ["2026-03-03T15:49:23.000Z","0xa814ff1c6a02fa4a717875ed09e96cbd61874d85c896f3ddd8df290c73f34961",["eth:0xCe28685EB204186b557133766eCA00334EB441E4"]]
      values.$pastUpgrades.5:
+        ["2026-03-03T15:49:23.000Z","0xa814ff1c6a02fa4a717875ed09e96cbd61874d85c896f3ddd8df290c73f34961",["eth:0xb08Cc720F511062537ca78BdB0AE691F04F5a957"]]
      values.$upgradeCount:
-        4
+        6
      values.GUARDIAN_SLOT:
-        "0xd30e835d3f35624761057ff5b27d558f97bd5be034621e62240e5c0b784abe68"
      values.PAUSED_SLOT:
-        "0x54176ff9944c4784e5857ec4e5ef560a462c483bf534eda43f91bb01a470b1b6"
      values.version:
-        "1.2.0"
+        "2.4.0"
      values.initVersion:
+        2
      values.pauseExpiry:
+        7884000
      values.proxyAdmin:
+        "eth:0x6d0ff67fb427422AfF35EEa8596949B374b09a52"
      values.proxyAdminOwner:
+        "eth:0xd0673F989bc3BA9314d0AAF28BfC84e99B7898CC"
      implementationNames.eth:0x4da82a327773965b8d4D85Fa3dB8249b387458E7:
-        "SuperchainConfig"
      implementationNames.eth:0xb08Cc720F511062537ca78BdB0AE691F04F5a957:
+        "SuperchainConfig"
    }
```

```diff
-   Status: DELETED
    contract PermissionedDisputeGame (eth:0x667b7DA73DA7B2A75286378FF45637eEaE9B4793)
    +++ description: Same as FaultDisputeGame, but only two permissioned addresses are designated as proposer and challenger. In the context of this permissioned aggkit deployment, there are no state proposals made here and the op stack fault proof system is not used.
```

```diff
-   Status: DELETED
    contract DelayedWETH (eth:0x74034597d29613CC8C0BDc8780e1d292A553Bd32)
    +++ description: Contract designed to hold the bonded ETH for each game. It is designed as a wrapper around WETH to allow an owner to function as a backstop if a game would incorrectly distribute funds.
```

```diff
    contract L1StandardBridge (eth:0x98906C3f90A06B5484DD67bf32938815d2993dBC) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      sourceHashes.1:
-        "0x4e15d99844dc5a4304c2396a66c95ec41218ea311c8e524b118fad7beed0bb53"
+        "0x0114d3af66179d6404d14360203dc6bcf404f23e2db4ee1b5848e923e131bc00"
      values.$implementation:
-        "eth:0x0b09ba359A106C9ea3b181CBc5F394570c7d2a7A"
+        "eth:0x61525EaaCDdB97D9184aFc205827E6A4fd0Bf62A"
      values.version:
-        "2.3.0"
+        "2.8.0"
      values.initVersion:
+        3
      values.proxyAdmin:
+        "eth:0x19DbD16f0a8e706D817B7e3b7bcF72917Ebb8832"
      values.proxyAdminOwner:
+        "eth:0xd0673F989bc3BA9314d0AAF28BfC84e99B7898CC"
      values.systemConfig:
+        "eth:0xb6e1f8B589A14B79DDD3aD7F0589AB548c70C174"
      implementationNames.eth:0x0b09ba359A106C9ea3b181CBc5F394570c7d2a7A:
-        "L1StandardBridge"
      implementationNames.eth:0x61525EaaCDdB97D9184aFc205827E6A4fd0Bf62A:
+        "L1StandardBridge"
    }
```

```diff
    contract OptimismMintableERC20Factory (eth:0xA84C37cD0b9bA1B43276C11976DBE9d1344C7f4E) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintableERC20 as this chain's representation of a token on the host chain, or vice-versa.
      sourceHashes.1:
-        "0x9650b4bba6299e410f01a369a95a2c57e1c3ca35f0d80c13f4f59fc468f370e5"
+        "0x25bad2bdb7df4347412a48e271dea1489299460192b43b8ca52ed191b4940992"
      values.$implementation:
-        "eth:0x5493f4677A186f64805fe7317D6993ba4863988F"
+        "eth:0x8ee6fB13c6c9a7e401531168E196Fbf8b05cEabB"
      values.$pastUpgrades.2:
+        ["2026-03-03T15:49:23.000Z","0xa814ff1c6a02fa4a717875ed09e96cbd61874d85c896f3ddd8df290c73f34961",["eth:0x8ee6fB13c6c9a7e401531168E196Fbf8b05cEabB"]]
      values.$upgradeCount:
-        2
+        3
      values.version:
-        "1.10.1"
+        "1.10.2"
      implementationNames.eth:0x5493f4677A186f64805fe7317D6993ba4863988F:
-        "OptimismMintableERC20Factory"
      implementationNames.eth:0x8ee6fB13c6c9a7e401531168E196Fbf8b05cEabB:
+        "OptimismMintableERC20Factory"
    }
```

```diff
    contract SystemConfig (eth:0xb6e1f8B589A14B79DDD3aD7F0589AB548c70C174) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      sourceHashes.1:
-        "0x921de6fc906d159fdcef862d2b9559063f5e7b9b7588fa5f33153360ddf296e7"
+        "0x09e12b8c0307a4da75a8b84ed7c88ced81e386ec09025ec5b36873b4f69614d0"
      values.$implementation:
-        "eth:0x340f923E5c7cbB2171146f64169EC9d5a9FfE647"
+        "eth:0x2fA28989fc559836E9d66dFf3010C7F7f41c65ED"
      values.$pastUpgrades.4:
+        ["2026-03-03T15:49:23.000Z","0xa814ff1c6a02fa4a717875ed09e96cbd61874d85c896f3ddd8df290c73f34961",["eth:0x2bFE4A5Bd5A41e9d848d843ebCDFa15954e9A557"]]
      values.$pastUpgrades.5:
+        ["2026-03-03T15:49:23.000Z","0xa814ff1c6a02fa4a717875ed09e96cbd61874d85c896f3ddd8df290c73f34961",["eth:0x2fA28989fc559836E9d66dFf3010C7F7f41c65ED"]]
      values.$upgradeCount:
-        4
+        6
      values.DISPUTE_GAME_FACTORY_SLOT:
-        "0x52322a25d9f59ea17656545543306b7aef62bc0cc53a0e65ccfa0c75b97aa906"
      values.getAddresses.disputeGameFactory:
-        "eth:0xe06278351d120288eDfCB963F934113Ca3C21AFe"
      values.maximumGasLimit:
-        200000000
+        500000000
      values.version:
-        "2.5.0"
+        "3.11.0"
      values.daFootprintGasScalar:
+        0
      values.guardian:
+        "eth:0x4e981bAe8E3cd06Ca911ffFE5504B2653ac1C38a"
      values.initVersion:
+        3
      values.l2ChainId:
+        747474
      values.minBaseFee:
+        0
      values.paused:
+        false
      values.proxyAdmin:
+        "eth:0x19DbD16f0a8e706D817B7e3b7bcF72917Ebb8832"
      values.proxyAdminOwner:
+        "eth:0xd0673F989bc3BA9314d0AAF28BfC84e99B7898CC"
      values.superchainConfig:
+        "eth:0x2F439B95fa789C5d3a5C99cc70EB3ee83D08a811"
      implementationNames.eth:0x340f923E5c7cbB2171146f64169EC9d5a9FfE647:
-        "SystemConfig"
      implementationNames.eth:0x2fA28989fc559836E9d66dFf3010C7F7f41c65ED:
+        "SystemConfig"
    }
```

```diff
    contract Polygon Multisig 2 (eth:0xd0673F989bc3BA9314d0AAF28BfC84e99B7898CC) {
    +++ description: None
      receivedPermissions.2:
-        {"permission":"interact","from":"eth:0x74034597d29613CC8C0BDc8780e1d292A553Bd32","description":"can pull funds from the contract in case of emergency.","role":".owner"}
      receivedPermissions.6:
-        {"permission":"upgrade","from":"eth:0x1AaA08d577cbC3da3b955DC1B7a281D7b8fE3372","role":"admin","via":[{"address":"eth:0x19DbD16f0a8e706D817B7e3b7bcF72917Ebb8832"}]}
      receivedPermissions.10:
-        {"permission":"upgrade","from":"eth:0x74034597d29613CC8C0BDc8780e1d292A553Bd32","role":"admin","via":[{"address":"eth:0x19DbD16f0a8e706D817B7e3b7bcF72917Ebb8832"}]}
      receivedPermissions.10:
+        {"permission":"upgrade","from":"eth:0xaA8a62563CFe4E36118ED479B5486F503b438376","role":"admin","via":[{"address":"eth:0x19DbD16f0a8e706D817B7e3b7bcF72917Ebb8832"}]}
      receivedPermissions.11:
+        {"permission":"upgrade","from":"eth:0xb41151Bf2B989d3771caBd5BCb5C435949543322","role":"admin","via":[{"address":"eth:0x19DbD16f0a8e706D817B7e3b7bcF72917Ebb8832"}]}
    }
```

```diff
    contract DisputeGameFactory (eth:0xe06278351d120288eDfCB963F934113Ca3C21AFe) {
    +++ description: The dispute game factory allows the creation of dispute games, used to propose state roots and eventually challenge them.
      sourceHashes.1:
-        "0x85ca17941ef36ac6b28a4f8f89803d0d41ef419c47586dcd3acdb47ee9617285"
+        "0x19f3f7c7ee3977705261bfb86f826d5f97b885796f2246be7cc3e815c3e95dca"
      values.$implementation:
-        "eth:0x4bbA758F006Ef09402eF31724203F316ab74e4a0"
+        "eth:0x74Fac1D45B98bae058F8F566201c9A81B85C7D50"
      values.$pastUpgrades.2:
+        ["2026-03-03T15:49:23.000Z","0xa814ff1c6a02fa4a717875ed09e96cbd61874d85c896f3ddd8df290c73f34961",["eth:0x33D1e8571a85a538ed3D5A4d88f46C112383439D"]]
      values.$pastUpgrades.3:
+        ["2026-03-03T15:49:23.000Z","0xa814ff1c6a02fa4a717875ed09e96cbd61874d85c896f3ddd8df290c73f34961",["eth:0x74Fac1D45B98bae058F8F566201c9A81B85C7D50"]]
      values.$upgradeCount:
-        2
+        4
+++ severity: HIGH
      values.gameImpls.1:
-        "eth:0x667b7DA73DA7B2A75286378FF45637eEaE9B4793"
+        "eth:0xA7A26BbA1191a064637d7B0b23896589F4e4d22D"
      values.version:
-        "1.0.1"
+        "1.3.0"
      values.initVersion:
+        1
      values.proxyAdmin:
+        "eth:0x19DbD16f0a8e706D817B7e3b7bcF72917Ebb8832"
      values.proxyAdminOwner:
+        "eth:0xd0673F989bc3BA9314d0AAF28BfC84e99B7898CC"
      implementationNames.eth:0x4bbA758F006Ef09402eF31724203F316ab74e4a0:
-        "DisputeGameFactory"
      implementationNames.eth:0x74Fac1D45B98bae058F8F566201c9A81B85C7D50:
+        "DisputeGameFactory"
    }
```

```diff
-   Status: DELETED
    contract MIPS (eth:0xF027F4A985560fb13324e943edf55ad6F1d15Dc1)
    +++ description: The MIPS contract is used to execute the final step of the dispute game which objectively determines the winner of the dispute.
```

```diff
+   Status: CREATED
    contract MIPS (eth:0x6463dEE3828677F6270d83d45408044fc5eDB908)
    +++ description: The MIPS contract is used to execute the final step of the dispute game which objectively determines the winner of the dispute.
```

```diff
+   Status: CREATED
    contract PermissionedDisputeGame (eth:0xA7A26BbA1191a064637d7B0b23896589F4e4d22D)
    +++ description: Same as FaultDisputeGame, but only two permissioned addresses are designated as proposer and challenger.
```

```diff
+   Status: CREATED
    contract AnchorStateRegistry (eth:0xaA8a62563CFe4E36118ED479B5486F503b438376)
    +++ description: Contains the latest confirmed state root that can be used as a starting point in a dispute game. It specifies which game type can be used for withdrawals, which currently is the PermissionedDisputeGame.
```

```diff
+   Status: CREATED
    contract DelayedWETH (eth:0xb41151Bf2B989d3771caBd5BCb5C435949543322)
    +++ description: Contract designed to hold the bonded ETH for each game. It is designed as a wrapper around WETH to allow an owner to function as a backstop if a game would incorrectly distribute funds.
```

## Source code changes

```diff
.../AnchorStateRegistry/AnchorStateRegistry.sol    | 418 ++++++++-
 .../DelayedWETH/DelayedWETH.sol                    | 406 ++++++---
 .../DisputeGameFactory/DisputeGameFactory.sol      | 297 ++++++-
 .../L1CrossDomainMessenger.sol                     | 377 +++++++-
 .../L1ERC721Bridge/L1ERC721Bridge.sol              | 313 ++++++-
 .../L1StandardBridge/L1StandardBridge.sol          | 313 ++++++-
 .../katana/{.flat@1772458371 => .flat}/MIPS.sol    | 622 +++++++------
 .../OptimismMintableERC20Factory.sol               |   4 +-
 .../OptimismPortal2_neutered/OptimismPortal2.sol   | 966 +++++++++++++--------
 .../PermissionedDisputeGame.sol                    | 142 ++-
 .../SuperchainConfig/SuperchainConfig.sol          | 465 +++++++---
 .../SystemConfig/SystemConfig.sol                  | 495 ++++++++---
 12 files changed, 3692 insertions(+), 1126 deletions(-)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1772458371 (main branch discovery), not current.

```diff
    contract SuperchainConfig (eth:0x2F439B95fa789C5d3a5C99cc70EB3ee83D08a811) {
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system. Since the OptimismPortal is not used for state root management in this setup, the guardian role and pausing may be inconsequential.
      description:
-        "This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system."
+        "This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system. Since the OptimismPortal is not used for state root management in this setup, the guardian role and pausing may be inconsequential."
    }
```

```diff
    reference  (eth:0x8B9F18bcDD5838bB1bd4B3d6410e45DF813b782B) {
    +++ description: None
      type:
-        "EOA"
+        "Reference"
      proxyType:
-        "EOA"
      targetType:
+        "EOA"
      targetProject:
+        "shared-polygon-cdk"
    }
```

```diff
    reference  (eth:0xEB5EeE1F1650b821E0d3a87C1341d85b3a16EA72) {
    +++ description: None
      type:
-        "EOA"
+        "Reference"
      proxyType:
-        "EOA"
      targetType:
+        "EOA"
      targetProject:
+        "shared-polygon-cdk"
    }
```

Generated with discovered.json: 0xffb9f87a63daf9b5d9a9c78ffc8c7c1cc57e91af

# Diff at Mon, 02 Mar 2026 13:34:20 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@5ab64a0fd4565502c09ba45d0cdeaafd479dc9b8 block: 1771490328
- current timestamp: 1772458371

## Description

gas config change + ms member changes.

## Watched changes

```diff
    contract Katana Foundation Engineering/Security Multisig (eth:0x4e981bAe8E3cd06Ca911ffFE5504B2653ac1C38a) {
    +++ description: None
      values.$members.1:
-        "eth:0xEad77b01ea770839F7f576Cd1516Ff6A298d9dB2"
+        "eth:0xEB5EeE1F1650b821E0d3a87C1341d85b3a16EA72"
      values.$members.2:
-        "eth:0xAb76AE6926371B82Af3652cCBABefBBA56270adC"
+        "eth:0x8B9F18bcDD5838bB1bd4B3d6410e45DF813b782B"
      values.$members.3:
-        "eth:0xAb3506507449bF1880f3337825efd19ac89E235E"
+        "eth:0xD9478f759a13Bfa1d9dAB3cDF5ff0C099d5EfCFC"
      values.$members.4:
-        "eth:0xcAB31b6A7b4d2eCd562A09e2BfA46535a18862f9"
+        "eth:0x3038B4DBf022E80169b2A068290d4a3A8b87D3b5"
      values.$threshold:
-        3
+        2
      values.multisigThreshold:
-        "3 of 5 (60%)"
+        "2 of 5 (40%)"
    }
```

```diff
-   Status: DELETED
    reference  (eth:0xAb3506507449bF1880f3337825efd19ac89E235E)
    +++ description: None
```

```diff
    contract SystemConfig (eth:0xb6e1f8B589A14B79DDD3aD7F0589AB548c70C174) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
+++ description: volatility param: lower denominator -> quicker fee changes on L2
      values.eip1559Denominator:
-        250
+        50
      values.eip1559Elasticity:
-        60
+        6
+++ description: Gas limit for blocks on L2.
+++ severity: LOW
      values.gasLimit:
-        60000000
+        120000000
    }
```

```diff
-   Status: DELETED
    reference  (eth:0xcAB31b6A7b4d2eCd562A09e2BfA46535a18862f9)
    +++ description: None
```

```diff
-   Status: DELETED
    reference  (eth:0xEad77b01ea770839F7f576Cd1516Ff6A298d9dB2)
    +++ description: None
```

```diff
+   Status: CREATED
    reference  (eth:0x3038B4DBf022E80169b2A068290d4a3A8b87D3b5)
    +++ description: None
```

```diff
+   Status: CREATED
    reference  (eth:0xD9478f759a13Bfa1d9dAB3cDF5ff0C099d5EfCFC)
    +++ description: None
```

Generated with discovered.json: 0x0a59c7c34ba43637747a7bccbbfe306351db3f61

# Diff at Thu, 19 Feb 2026 08:41:37 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@31cbacb6d899b700558dd36eccfd1161fc0b3b74 block: 1771250113
- current timestamp: 1771490328

## Description

optimistic mode manager moved to Polygon Multisig 2.

## Watched changes

```diff
    contract AggchainFEP (eth:0x100d3ca4f97776A40A7D93dB4AbF0FEA34230666) {
    +++ description: The main system contract defining the katana Aggchain logic. This contract, based on the OP-Succinct L2OutputOracle, supports validity proofs and OP stack outputRoots (L2 state roots) are saved here.
      values.optimisticModeManager:
-        "eth:0x4e981bAe8E3cd06Ca911ffFE5504B2653ac1C38a"
+        "eth:0xd0673F989bc3BA9314d0AAF28BfC84e99B7898CC"
      values.pendingOptimisticModeManager:
-        "eth:0xd0673F989bc3BA9314d0AAF28BfC84e99B7898CC"
+        "eth:0x0000000000000000000000000000000000000000"
    }
```

```diff
    contract Katana Foundation Engineering/Security Multisig (eth:0x4e981bAe8E3cd06Ca911ffFE5504B2653ac1C38a) {
    +++ description: None
      receivedPermissions:
-        [{"permission":"interact","from":"eth:0x100d3ca4f97776A40A7D93dB4AbF0FEA34230666","description":"toggle the 'optimisticMode'.","role":".optimisticModeManager"}]
    }
```

```diff
    contract Polygon Multisig 2 (eth:0xd0673F989bc3BA9314d0AAF28BfC84e99B7898CC) {
    +++ description: None
      receivedPermissions.1:
+        {"permission":"interact","from":"eth:0x100d3ca4f97776A40A7D93dB4AbF0FEA34230666","description":"toggle the 'optimisticMode'.","role":".optimisticModeManager"}
    }
```

Generated with discovered.json: 0xb9de6662a6efa643fddd22c05c4f5d3999eb97f5

# Diff at Mon, 16 Feb 2026 13:57:07 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@bb0201789c97cc74af8432f172609bc8ef3357f0 block: 1770814418
- current timestamp: 1771250113

## Description

Move aggchain and op mode manager to Polygon Multisig 2.

## Watched changes

```diff
    contract AggchainFEP (eth:0x100d3ca4f97776A40A7D93dB4AbF0FEA34230666) {
    +++ description: The main system contract defining the katana Aggchain logic. This contract, based on the OP-Succinct L2OutputOracle, supports validity proofs and OP stack outputRoots (L2 state roots) are saved here.
      values.aggchainManager:
-        "eth:0x4e981bAe8E3cd06Ca911ffFE5504B2653ac1C38a"
+        "eth:0xd0673F989bc3BA9314d0AAF28BfC84e99B7898CC"
      values.pendingOptimisticModeManager:
-        "eth:0x0000000000000000000000000000000000000000"
+        "eth:0xd0673F989bc3BA9314d0AAF28BfC84e99B7898CC"
    }
```

```diff
    contract Katana Foundation Engineering/Security Multisig (eth:0x4e981bAe8E3cd06Ca911ffFE5504B2653ac1C38a) {
    +++ description: None
      receivedPermissions.0:
-        {"permission":"interact","from":"eth:0x100d3ca4f97776A40A7D93dB4AbF0FEA34230666","description":"change verification keys (aggregationVkey, rangeVkeyCommitment, aggchainVkey) and the rollupConfigHash, manage multisig signers for permissioned state transitions and change critical configs for state validation.","role":".aggchainManager"}
    }
```

```diff
    contract Polygon Multisig 2 (eth:0xd0673F989bc3BA9314d0AAF28BfC84e99B7898CC) {
    +++ description: None
      receivedPermissions.0:
+        {"permission":"interact","from":"eth:0x100d3ca4f97776A40A7D93dB4AbF0FEA34230666","description":"change verification keys (aggregationVkey, rangeVkeyCommitment, aggchainVkey) and the rollupConfigHash, manage multisig signers for permissioned state transitions and change critical configs for state validation.","role":".aggchainManager"}
    }
```

Generated with discovered.json: 0x2955b4c9e21cd6ff6befe49504249fa0dcc8d47a

# Diff at Fri, 13 Feb 2026 11:33:13 GMT:

- author: vincfurc (<vincfurc@users.noreply.github.com>)
- comparing to: main@55ab80636f1e0c000e757a7a146f11035a19e9c0 block: 1770814418
- current timestamp: 1770814418

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1770814418 (main branch discovery), not current.

```diff
    contract DisputeGameFactory (eth:0xe06278351d120288eDfCB963F934113Ca3C21AFe) {
    +++ description: The dispute game factory allows the creation of dispute games, used to propose state roots and eventually challenge them.
      values.challengerFromDGF:
+        "UNRESOLVED"
      values.proposerFromDGF:
+        "UNRESOLVED"
      values.wethFromDGF:
+        "UNRESOLVED"
      usedTypes:
+        [{"typeCaster":"SliceAddress","arg":{"offset":124}},{"typeCaster":"SliceAddress","arg":{"offset":144}},{"typeCaster":"SliceAddress","arg":{"offset":72}}]
    }
```

Generated with discovered.json: 0x2932591d2ba8f1adcffa09bccb7deaaf8a723dd6

# Diff at Wed, 11 Feb 2026 12:54:49 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@141974a80471f8dbed910bc3deae728f2ae1bec7 block: 1770035635
- current timestamp: 1770814418

## Description

Owner changes (Polygon Multisig 2 claiming more permissions).

## Watched changes

```diff
    contract Katana Foundation Engineering/Security Multisig (eth:0x4e981bAe8E3cd06Ca911ffFE5504B2653ac1C38a) {
    +++ description: None
      receivedPermissions.2:
-        {"permission":"interact","from":"eth:0x74034597d29613CC8C0BDc8780e1d292A553Bd32","description":"can pull funds from the contract in case of emergency.","role":".owner"}
      receivedPermissions.3:
-        {"permission":"interact","from":"eth:0xb6e1f8B589A14B79DDD3aD7F0589AB548c70C174","description":"it can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system.","role":".owner"}
    }
```

```diff
    contract DelayedWETH (eth:0x74034597d29613CC8C0BDc8780e1d292A553Bd32) {
    +++ description: Contract designed to hold the bonded ETH for each game. It is designed as a wrapper around WETH to allow an owner to function as a backstop if a game would incorrectly distribute funds.
      values.owner:
-        "eth:0x4e981bAe8E3cd06Ca911ffFE5504B2653ac1C38a"
+        "eth:0xd0673F989bc3BA9314d0AAF28BfC84e99B7898CC"
    }
```

```diff
    contract SystemConfig (eth:0xb6e1f8B589A14B79DDD3aD7F0589AB548c70C174) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      values.owner:
-        "eth:0x4e981bAe8E3cd06Ca911ffFE5504B2653ac1C38a"
+        "eth:0xd0673F989bc3BA9314d0AAF28BfC84e99B7898CC"
    }
```

```diff
    contract Polygon Multisig 2 (eth:0xd0673F989bc3BA9314d0AAF28BfC84e99B7898CC) {
    +++ description: None
      receivedPermissions.0:
+        {"permission":"interact","from":"eth:0x74034597d29613CC8C0BDc8780e1d292A553Bd32","description":"can pull funds from the contract in case of emergency.","role":".owner"}
      receivedPermissions.1:
+        {"permission":"interact","from":"eth:0xb6e1f8B589A14B79DDD3aD7F0589AB548c70C174","description":"it can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system.","role":".owner"}
    }
```

```diff
    contract DisputeGameFactory (eth:0xe06278351d120288eDfCB963F934113Ca3C21AFe) {
    +++ description: The dispute game factory allows the creation of dispute games, used to propose state roots and eventually challenge them.
      values.owner:
-        "eth:0x4e981bAe8E3cd06Ca911ffFE5504B2653ac1C38a"
+        "eth:0xd0673F989bc3BA9314d0AAF28BfC84e99B7898CC"
    }
```

Generated with discovered.json: 0xcc5abe7a160f6cc4630420978f3c205c212ae816

# Diff at Mon, 02 Feb 2026 14:49:25 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@0848453811f47d862414d125666784260c12d17b block: 1769516922
- current timestamp: 1770035635

## Description

upgrade admin change.

## Watched changes

```diff
    contract ProxyAdmin (eth:0x19DbD16f0a8e706D817B7e3b7bcF72917Ebb8832) {
    +++ description: None
      values.owner:
-        "eth:0x4e981bAe8E3cd06Ca911ffFE5504B2653ac1C38a"
+        "eth:0xd0673F989bc3BA9314d0AAF28BfC84e99B7898CC"
    }
```

```diff
    contract Katana Foundation Engineering/Security Multisig (eth:0x4e981bAe8E3cd06Ca911ffFE5504B2653ac1C38a) {
    +++ description: None
      receivedPermissions.4:
-        {"permission":"interact","from":"eth:0xEaB94275eD336D80d4F46EA8Ea0427e351f11D65","description":"set and change address mappings.","role":".owner","via":[{"address":"eth:0x19DbD16f0a8e706D817B7e3b7bcF72917Ebb8832"}]}
      receivedPermissions.5:
-        {"permission":"upgrade","from":"eth:0x15a32FCeA89617Ff450F094cDE102CCa46598B7F","role":"admin","via":[{"address":"eth:0x19DbD16f0a8e706D817B7e3b7bcF72917Ebb8832"}]}
      receivedPermissions.6:
-        {"permission":"upgrade","from":"eth:0x1AaA08d577cbC3da3b955DC1B7a281D7b8fE3372","role":"admin","via":[{"address":"eth:0x19DbD16f0a8e706D817B7e3b7bcF72917Ebb8832"}]}
      receivedPermissions.7:
-        {"permission":"upgrade","from":"eth:0x2008A6Ba8CAF85AaFAe7880664Dfe681D533ac2E","role":"admin","via":[{"address":"eth:0x19DbD16f0a8e706D817B7e3b7bcF72917Ebb8832"}]}
      receivedPermissions.8:
-        {"permission":"upgrade","from":"eth:0x250D30c523104bf0a06825e7eAdE4Dc46EdfE40E","role":"admin","via":[{"address":"eth:0x19DbD16f0a8e706D817B7e3b7bcF72917Ebb8832"}]}
      receivedPermissions.9:
-        {"permission":"upgrade","from":"eth:0x2F439B95fa789C5d3a5C99cc70EB3ee83D08a811","role":"admin","via":[{"address":"eth:0x6d0ff67fb427422AfF35EEa8596949B374b09a52"}]}
      receivedPermissions.10:
-        {"permission":"upgrade","from":"eth:0x74034597d29613CC8C0BDc8780e1d292A553Bd32","role":"admin","via":[{"address":"eth:0x19DbD16f0a8e706D817B7e3b7bcF72917Ebb8832"}]}
      receivedPermissions.11:
-        {"permission":"upgrade","from":"eth:0x98906C3f90A06B5484DD67bf32938815d2993dBC","description":"upgrading the bridge implementation can give access to all funds escrowed therein.","role":".$admin","via":[{"address":"eth:0x19DbD16f0a8e706D817B7e3b7bcF72917Ebb8832"}]}
      receivedPermissions.12:
-        {"permission":"upgrade","from":"eth:0xA84C37cD0b9bA1B43276C11976DBE9d1344C7f4E","role":"admin","via":[{"address":"eth:0x19DbD16f0a8e706D817B7e3b7bcF72917Ebb8832"}]}
      receivedPermissions.13:
-        {"permission":"upgrade","from":"eth:0xb6e1f8B589A14B79DDD3aD7F0589AB548c70C174","role":"admin","via":[{"address":"eth:0x19DbD16f0a8e706D817B7e3b7bcF72917Ebb8832"}]}
      receivedPermissions.14:
-        {"permission":"upgrade","from":"eth:0xe06278351d120288eDfCB963F934113Ca3C21AFe","role":"admin","via":[{"address":"eth:0x19DbD16f0a8e706D817B7e3b7bcF72917Ebb8832"}]}
      directlyReceivedPermissions:
-        [{"permission":"act","from":"eth:0x19DbD16f0a8e706D817B7e3b7bcF72917Ebb8832","role":".owner"},{"permission":"act","from":"eth:0x6d0ff67fb427422AfF35EEa8596949B374b09a52","role":".owner"}]
    }
```

```diff
    contract ProxyAdmin (eth:0x6d0ff67fb427422AfF35EEa8596949B374b09a52) {
    +++ description: None
      values.owner:
-        "eth:0x4e981bAe8E3cd06Ca911ffFE5504B2653ac1C38a"
+        "eth:0xd0673F989bc3BA9314d0AAF28BfC84e99B7898CC"
    }
```

```diff
    contract Polygon Multisig 2 (eth:0xd0673F989bc3BA9314d0AAF28BfC84e99B7898CC) {
    +++ description: None
      receivedPermissions:
+        [{"permission":"interact","from":"eth:0xEaB94275eD336D80d4F46EA8Ea0427e351f11D65","description":"set and change address mappings.","role":".owner","via":[{"address":"eth:0x19DbD16f0a8e706D817B7e3b7bcF72917Ebb8832"}]},{"permission":"upgrade","from":"eth:0x15a32FCeA89617Ff450F094cDE102CCa46598B7F","role":"admin","via":[{"address":"eth:0x19DbD16f0a8e706D817B7e3b7bcF72917Ebb8832"}]},{"permission":"upgrade","from":"eth:0x1AaA08d577cbC3da3b955DC1B7a281D7b8fE3372","role":"admin","via":[{"address":"eth:0x19DbD16f0a8e706D817B7e3b7bcF72917Ebb8832"}]},{"permission":"upgrade","from":"eth:0x2008A6Ba8CAF85AaFAe7880664Dfe681D533ac2E","role":"admin","via":[{"address":"eth:0x19DbD16f0a8e706D817B7e3b7bcF72917Ebb8832"}]},{"permission":"upgrade","from":"eth:0x250D30c523104bf0a06825e7eAdE4Dc46EdfE40E","role":"admin","via":[{"address":"eth:0x19DbD16f0a8e706D817B7e3b7bcF72917Ebb8832"}]},{"permission":"upgrade","from":"eth:0x2F439B95fa789C5d3a5C99cc70EB3ee83D08a811","role":"admin","via":[{"address":"eth:0x6d0ff67fb427422AfF35EEa8596949B374b09a52"}]},{"permission":"upgrade","from":"eth:0x74034597d29613CC8C0BDc8780e1d292A553Bd32","role":"admin","via":[{"address":"eth:0x19DbD16f0a8e706D817B7e3b7bcF72917Ebb8832"}]},{"permission":"upgrade","from":"eth:0x98906C3f90A06B5484DD67bf32938815d2993dBC","description":"upgrading the bridge implementation can give access to all funds escrowed therein.","role":".$admin","via":[{"address":"eth:0x19DbD16f0a8e706D817B7e3b7bcF72917Ebb8832"}]},{"permission":"upgrade","from":"eth:0xA84C37cD0b9bA1B43276C11976DBE9d1344C7f4E","role":"admin","via":[{"address":"eth:0x19DbD16f0a8e706D817B7e3b7bcF72917Ebb8832"}]},{"permission":"upgrade","from":"eth:0xb6e1f8B589A14B79DDD3aD7F0589AB548c70C174","role":"admin","via":[{"address":"eth:0x19DbD16f0a8e706D817B7e3b7bcF72917Ebb8832"}]},{"permission":"upgrade","from":"eth:0xe06278351d120288eDfCB963F934113Ca3C21AFe","role":"admin","via":[{"address":"eth:0x19DbD16f0a8e706D817B7e3b7bcF72917Ebb8832"}]}]
      directlyReceivedPermissions:
+        [{"permission":"act","from":"eth:0x19DbD16f0a8e706D817B7e3b7bcF72917Ebb8832","role":".owner"},{"permission":"act","from":"eth:0x6d0ff67fb427422AfF35EEa8596949B374b09a52","role":".owner"}]
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1769516922 (main branch discovery), not current.

```diff
    EOA  (eth:0xa43901c63f7702C407378E55E0d0EB4064a2AE31) {
    +++ description: None
      type:
-        "Reference"
+        "EOA"
      targetType:
-        "EOA"
      targetProject:
-        "shared-polygon-cdk"
      proxyType:
+        "EOA"
    }
```

Generated with discovered.json: 0x44fa3718720375e57085f34a83bba8db4f0772e7

# Diff at Tue, 27 Jan 2026 12:37:20 GMT:

- author: vincfurc (<vincfurc@users.noreply.github.com>)
- comparing to: main@01c924f177b66fde012756076e94adb03520b757 block: 1768998796
- current timestamp: 1769516922

## Description

New member added to Conduit Multisig 1, increasing from 4 of 12 to 4 of 13 threshold.

## Watched changes

```diff
    contract Conduit Multisig 1 (eth:0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      values.$members.0:
+        "eth:0xA9FCCc53F1c9095DA867Bd648683F8bdCcc78d09"
      values.multisigThreshold:
-        "4 of 12 (33%)"
+        "4 of 13 (31%)"
    }
```

Generated with discovered.json: 0xa5c83ac44e30555c8dfe15b131dfd20f73aa13cd

# Diff at Wed, 21 Jan 2026 12:34:25 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@244fb212545a72797e49afed711b24371c1ca962 block: 1768816385
- current timestamp: 1768998796

## Description

conduit ms change.

## Watched changes

```diff
    contract Conduit Multisig 1 (eth:0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      values.$members.0:
+        "eth:0x381624F7912BddD83dc67c6C53Ef6FE61B87Cf07"
      values.multisigThreshold:
-        "4 of 11 (36%)"
+        "4 of 12 (33%)"
    }
```

Generated with discovered.json: 0x923d64d3f30337aa0193c25fe961c0701df0596e

# Diff at Mon, 19 Jan 2026 09:54:14 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@fedbf0b580d39c802d10691add7e94f6a4b53464 block: 1768370407
- current timestamp: 1768816385

## Description

admin change and multisig member change.

## Watched changes

```diff
    contract AggchainFEP (eth:0x100d3ca4f97776A40A7D93dB4AbF0FEA34230666) {
    +++ description: The main system contract defining the katana Aggchain logic. This contract, based on the OP-Succinct L2OutputOracle, supports validity proofs and OP stack outputRoots (L2 state roots) are saved here.
      values.admin:
-        "eth:0xa4000bDD2bB92ce6750b31F1eeda47Bd1cB8e6e4"
+        "eth:0xd0673F989bc3BA9314d0AAF28BfC84e99B7898CC"
    }
```

```diff
    contract Conduit Multisig 1 (eth:0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      values.$members.0:
+        "eth:0x6BB4249858Ee19b6ABC071AD26bEe690baa783A6"
      values.multisigThreshold:
-        "4 of 10 (40%)"
+        "4 of 11 (36%)"
    }
```

```diff
    contract Safe (eth:0xFA58659F64a393A6E1A548ABc70Ad2CfE1e8f9Cb) {
    +++ description: None
      values.$members.6:
-        "eth:0xfd5E854b73a239c9052d89C53D1313f5AfB860ac"
+        "eth:0xdEb97974dfCC73178672205A1eadDc2BDeAc1Bd4"
      values.$threshold:
-        3
+        2
      values.multisigThreshold:
-        "3 of 7 (43%)"
+        "2 of 7 (29%)"
    }
```

Generated with discovered.json: 0x2c159060471dd399b94fb0f1689a62947638fbd4

# Diff at Wed, 14 Jan 2026 06:06:21 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@109a5d8ec861590e65983ea0257074c65c29ed21 block: 1765882505
- current timestamp: 1768370407

## Description

new pending admin: the admin can change the trusted sequencer address, which in turn can finalize state by signature, but only in optimistic mode, managed by the optimistic mode manager address.

## Watched changes

```diff
    contract AggchainFEP (eth:0x100d3ca4f97776A40A7D93dB4AbF0FEA34230666) {
    +++ description: The main system contract defining the katana Aggchain logic. This contract, based on the OP-Succinct L2OutputOracle, supports validity proofs and OP stack outputRoots (L2 state roots) are saved here.
      values.pendingAdmin:
-        "eth:0x0000000000000000000000000000000000000000"
+        "eth:0xd0673F989bc3BA9314d0AAF28BfC84e99B7898CC"
    }
```

Generated with discovered.json: 0x4cd55c8821f56a57026261abfcffcaa5452f3984

# Diff at Wed, 17 Dec 2025 10:37:21 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@8e3e624ee8b25c3a6106ebb6a5295b78f99241f8 block: 1765882505
- current timestamp: 1765882505

## Description

config: rename noforce portal.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1765882505 (main branch discovery), not current.

```diff
    contract OptimismPortal2_neutered (eth:0x250D30c523104bf0a06825e7eAdE4Dc46EdfE40E) {
    +++ description: The OptimismPortal contract usually is the main entry point to deposit funds from L1 to L2 or for finalizing withdrawals. It specifies which game type can be used for withdrawals, which currently is the PermissionedDisputeGame. This specific fork of the standard contract **disables the depositTransaction() function**, which prevents users from sending or forcing any transactions from L1 to L2, including token deposits. It is instead used for configuration and administration of the system.
      name:
-        "OptimismPortal2"
+        "OptimismPortal2_neutered"
    }
```

Generated with discovered.json: 0x15e7681c66e08464d55220041d8529b908b24045

# Diff at Tue, 16 Dec 2025 10:56:14 GMT:

- author: vincfurc (<vincfurc@users.noreply.github.com>)
- comparing to: main@c617e27cd7f65519be3bc9bb0e27c564ec208785 block: 1765783036
- current timestamp: 1765882505

## Description

Added game 2000 to template.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1765783036 (main branch discovery), not current.

```diff
    contract DisputeGameFactory (eth:0xe06278351d120288eDfCB963F934113Ca3C21AFe) {
    +++ description: The dispute game factory allows the creation of dispute games, used to propose state roots and eventually challenge them.
+++ severity: HIGH
      values.game2000:
+        "eth:0x0000000000000000000000000000000000000000"
      fieldMeta.game2000:
+        {"severity":"HIGH"}
    }
```

Generated with discovered.json: 0x4d1073ab88e531b0659c98506290320f2349e094

# Diff at Mon, 15 Dec 2025 07:24:43 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@01bd5cf49d2c730434200bf3da519a23d7ab0c66 block: 1765280900
- current timestamp: 1765783036

## Description

new opsuccinct vkeys:

aggregationVkey
- unchanged: 0x007efdd073c9845bbc446e0e62018af999bde96ecec416725391efa4a3f0a44d

rangeVkeyCommitment
- old: 0x4b8234c47685b3361b22399702416a8010783b1b701b279073b4f0831e55da63
- new: 0x64c8517c14f10577381d8961139a4420420e90e528d02be96e2b0961671db248

on gh this corresponds to [this pr](https://github.com/agglayer/provers/pull/316/changes)
- update sp1 to 5.2.2
- update alloy to 1.0
- update agglayer to 0.12.0

## Watched changes

```diff
    contract AggchainFEP (eth:0x100d3ca4f97776A40A7D93dB4AbF0FEA34230666) {
    +++ description: The main system contract defining the katana Aggchain logic. This contract, based on the OP-Succinct L2OutputOracle, supports validity proofs and OP stack outputRoots (L2 state roots) are saved here.
      values.selectedOpSuccinctConfig.aggregationVkey:
-        "0x0000000000000000000000000000000000000000000000000000000000000000"
+        "0x007efdd073c9845bbc446e0e62018af999bde96ecec416725391efa4a3f0a44d"
      values.selectedOpSuccinctConfig.rangeVkeyCommitment:
-        "0x0000000000000000000000000000000000000000000000000000000000000000"
+        "0x64c8517c14f10577381d8961139a4420420e90e528d02be96e2b0961671db248"
      values.selectedOpSuccinctConfig.rollupConfigHash:
-        "0x0000000000000000000000000000000000000000000000000000000000000000"
+        "0x7179e8c558e26751a56fc2fe9ce0a84ce248cfc98cb5b7a5178655b0c5c42ea5"
+++ description: currently enforced OpSuccinctConfig. update the call handler for the full config if this changes.
+++ severity: HIGH
      values.selectedOpSuccinctConfigName:
-        "0x4a6e8c6abb9ec46b76062d422b6d87bb4b7e0304b4b06d554037828ce3006650"
+        "0xfda6f1430e8363d3850cb5ff3f026f6ce01ad0fad017cb06a1dcbeb72c00304d"
    }
```

```diff
    contract Katana Foundation Engineering/Security Multisig (eth:0x4e981bAe8E3cd06Ca911ffFE5504B2653ac1C38a) {
    +++ description: None
      values.$members.2:
-        "eth:0x54c401eD03D086fE13221E5422165f3b024265d9"
+        "eth:0xAb76AE6926371B82Af3652cCBABefBBA56270adC"
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1765280900 (main branch discovery), not current.

```diff
    contract AggchainFEP (eth:0x100d3ca4f97776A40A7D93dB4AbF0FEA34230666) {
    +++ description: The main system contract defining the katana Aggchain logic. This contract, based on the OP-Succinct L2OutputOracle, supports validity proofs and OP stack outputRoots (L2 state roots) are saved here.
      values.selectedOpSuccinctConfig.aggregationVkey:
-        "0x007efdd073c9845bbc446e0e62018af999bde96ecec416725391efa4a3f0a44d"
+        "0x0000000000000000000000000000000000000000000000000000000000000000"
      values.selectedOpSuccinctConfig.rangeVkeyCommitment:
-        "0x4b8234c47685b3361b22399702416a8010783b1b701b279073b4f0831e55da63"
+        "0x0000000000000000000000000000000000000000000000000000000000000000"
      values.selectedOpSuccinctConfig.rollupConfigHash:
-        "0x7179e8c558e26751a56fc2fe9ce0a84ce248cfc98cb5b7a5178655b0c5c42ea5"
+        "0x0000000000000000000000000000000000000000000000000000000000000000"
    }
```

Generated with discovered.json: 0x670ea57f72adba87a0f30e15352bcd858aa53b01

# Diff at Thu, 11 Dec 2025 16:27:03 GMT:

- author: vincfurc (<vincfurc@users.noreply.github.com>)
- comparing to: main@9f3170e1f8a0370f46b282d3c5cfa506e634cc38 block: 1765280900
- current timestamp: 1765280900

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1765280900 (main branch discovery), not current.

```diff
    contract DisputeGameFactory (eth:0xe06278351d120288eDfCB963F934113Ca3C21AFe) {
    +++ description: The dispute game factory allows the creation of dispute games, used to propose state roots and eventually challenge them.
+++ severity: HIGH
      values.game42:
+        "eth:0x0000000000000000000000000000000000000000"
      values.initBondGame42:
+        0
      fieldMeta.game42:
+        {"severity":"HIGH"}
    }
```

Generated with discovered.json: 0xfd75ece268791f13bd59dd6ea4ebc744ed3f4935

# Diff at Tue, 09 Dec 2025 11:49:28 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@ed25b2aa28d6ab9faa5f06bc943948919be9627d block: 1764933676
- current timestamp: 1765280900

## Description

config related: ms changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1764933676 (main branch discovery), not current.

```diff
    EOA  (eth:0x21618593F7147235aC8D511d68A547C935F9d417) {
    +++ description: None
      type:
-        "Reference"
+        "EOA"
      targetType:
-        "EOA"
      targetProject:
-        "shared-polygon-cdk"
      proxyType:
+        "EOA"
    }
```

```diff
    EOA  (eth:0x54c401eD03D086fE13221E5422165f3b024265d9) {
    +++ description: None
      type:
-        "Reference"
+        "EOA"
      targetType:
-        "EOA"
      targetProject:
-        "shared-polygon-cdk"
      proxyType:
+        "EOA"
    }
```

Generated with discovered.json: 0x86d41f984d20411bcb93f49f9e03cbe5b0d76c22

# Diff at Mon, 08 Dec 2025 09:51:00 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@a978f5e96d0457fb785933034bd3e35d3fd4f054 block: 1764933676
- current timestamp: 1764933676

## Description

config: add aggchain type comment.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1764933676 (main branch discovery), not current.

```diff
    contract AggchainFEP (eth:0x100d3ca4f97776A40A7D93dB4AbF0FEA34230666) {
    +++ description: The main system contract defining the katana Aggchain logic. This contract, based on the OP-Succinct L2OutputOracle, supports validity proofs and OP stack outputRoots (L2 state roots) are saved here.
      fieldMeta.AGGCHAIN_TYPE:
+        {"severity":"HIGH","description":"0: ECDSA sig verification, 1: limited to vkeys in Gateway with 1 as second byte"}
    }
```

Generated with discovered.json: 0x425a049cb63a66e79e41591b04cdde93d7d0f9ed

# Diff at Fri, 05 Dec 2025 11:22:21 GMT:

- author: vincfurc (<vincfurc@users.noreply.github.com>)
- comparing to: main@1edf3e71cea32596658a3ea017cea9df6408b77c block: 1764164180
- current timestamp: 1764933676

## Description

Conduit multisig key rotation.

## Watched changes

```diff
    contract Conduit Multisig 1 (eth:0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      values.$members.0:
+        "eth:0x2103c69696CB2D3779f5445393808239034E911c"
      values.$members.0:
-        "eth:0xFe0ab87ebE03DD0bF52DaF34Dfda6639c335e2d4"
+        "eth:0x65D1d44B8B2fE15d45A03708E0835C7E98a56007"
      values.$members.4:
-        "eth:0xF0B77EaE7F2dabCC2571c7418406A0dCA3afA4f0"
    }
```

Generated with discovered.json: 0x28320ae7c3b9a14e46648127246d3e5a9577106b

# Diff at Wed, 26 Nov 2025 13:37:44 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@5f66ce888d7143602a6ce8aceef3c861c5276726 block: 1764059644
- current timestamp: 1764164180

## Description

ms change in yearn.

## Watched changes

```diff
    contract Yearn Strategist Multisig (eth:0x16388463d60FFE0661Cf7F1f31a7D658aC790ff7) {
    +++ description: None
      values.$members.0:
+        "eth:0x80a3887BA60F76acAb48EE4aEAd0a71A0774A8B2"
      values.$members.6:
-        "eth:0x254f44F45ac892730e511f143DEd3Cd920b075aF"
+        "eth:0x0Dca0FDC170baA4CA9c1dCd37Ffe01f97bCfD504"
      values.multisigThreshold:
-        "3 of 7 (43%)"
+        "3 of 8 (38%)"
    }
```

Generated with discovered.json: 0xeac92d4fcee26234c11735246dd89b72e6b70df1

# Diff at Tue, 25 Nov 2025 08:37:28 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@9d494505416f16cb69e5d5ecc74d3b29fe31d596 block: 1763378838
- current timestamp: 1764059644

## Description

New opsuccinct vkeys.

## Watched changes

```diff
    contract AggchainFEP (eth:0x100d3ca4f97776A40A7D93dB4AbF0FEA34230666) {
    +++ description: The main system contract defining the katana Aggchain logic. This contract, based on the OP-Succinct L2OutputOracle, supports validity proofs and OP stack outputRoots (L2 state roots) are saved here.
      values.selectedOpSuccinctConfig.aggregationVkey:
-        "0x0000000000000000000000000000000000000000000000000000000000000000"
+        "0x007efdd073c9845bbc446e0e62018af999bde96ecec416725391efa4a3f0a44d"
      values.selectedOpSuccinctConfig.rangeVkeyCommitment:
-        "0x0000000000000000000000000000000000000000000000000000000000000000"
+        "0x4b8234c47685b3361b22399702416a8010783b1b701b279073b4f0831e55da63"
      values.selectedOpSuccinctConfig.rollupConfigHash:
-        "0x0000000000000000000000000000000000000000000000000000000000000000"
+        "0x7179e8c558e26751a56fc2fe9ce0a84ce248cfc98cb5b7a5178655b0c5c42ea5"
+++ description: currently enforced OpSuccinctConfig. update the call handler for the full config if this changes.
+++ severity: HIGH
      values.selectedOpSuccinctConfigName:
-        "0x622142ba8035695383551428b698950d3d4a6a53629c90a86d7192cfb221ae4e"
+        "0x4a6e8c6abb9ec46b76062d422b6d87bb4b7e0304b4b06d554037828ce3006650"
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1763378838 (main branch discovery), not current.

```diff
    contract AggchainFEP (eth:0x100d3ca4f97776A40A7D93dB4AbF0FEA34230666) {
    +++ description: The main system contract defining the katana Aggchain logic. This contract, based on the OP-Succinct L2OutputOracle, supports validity proofs and OP stack outputRoots (L2 state roots) are saved here.
      values.selectedOpSuccinctConfig.aggregationVkey:
-        "0x00afb45d8064ae10aa6a1793b8f39a24c27268efae2917b5c02950b2377fbf00"
+        "0x0000000000000000000000000000000000000000000000000000000000000000"
      values.selectedOpSuccinctConfig.rangeVkeyCommitment:
-        "0x416d710344b6b6fa2a0b1a1445f3d6ba4fdd5ab43f0e863b1c522db20f28ad9b"
+        "0x0000000000000000000000000000000000000000000000000000000000000000"
      values.selectedOpSuccinctConfig.rollupConfigHash:
-        "0x6cd1b72f40b6ddf464897d8d1b084241f38ae5fda17175ff45afb3307b2523e9"
+        "0x0000000000000000000000000000000000000000000000000000000000000000"
    }
```

Generated with discovered.json: 0xd9252e729a8e91e0eb85f53a15d280a32e488214

# Diff at Mon, 17 Nov 2025 11:29:07 GMT:

- author: vincfurc (<vincfurc@users.noreply.github.com>)
- comparing to: main@1ced7b6309befc68bef18813184f322d7f7507fd block: 1762264436
- current timestamp: 1763378838

## Description

New multisig member.

## Watched changes

```diff
    contract Safe (eth:0xFA58659F64a393A6E1A548ABc70Ad2CfE1e8f9Cb) {
    +++ description: None
      values.$members.0:
+        "eth:0xF045025C845E786E343Df30cC6f67ec6BB822b34"
      values.multisigThreshold:
-        "3 of 6 (50%)"
+        "3 of 7 (43%)"
    }
```

Generated with discovered.json: 0x2841529776b042045de62632501c9feaf74f7368

# Diff at Tue, 04 Nov 2025 13:55:22 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@f12d06bbf120eab9f5356a235918d4d6b2484290 block: 1761895573
- current timestamp: 1762264436

## Description

ms signer added.

## Watched changes

```diff
    contract Katana Steakhouse Financial / Morpho Multisig (eth:0x827e86072B06674a077f592A531dcE4590aDeCdB) {
    +++ description: None
      values.$members.0:
+        "eth:0x8AE8EE5ad6EaE89836B0070Ebc47AF06E3D7422b"
      values.multisigThreshold:
-        "2 of 4 (50%)"
+        "2 of 5 (40%)"
    }
```

Generated with discovered.json: 0xe88f397606c7e20474b3e8f173408bfa1c4b0a9d

# Diff at Tue, 04 Nov 2025 12:50:09 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@6b9a294e84c4d5ca84a7b377bd638098bb461624 block: 1761895573
- current timestamp: 1761895573

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1761895573 (main branch discovery), not current.

```diff
    contract PermissionedDisputeGame (eth:0x667b7DA73DA7B2A75286378FF45637eEaE9B4793) {
    +++ description: Same as FaultDisputeGame, but only two permissioned addresses are designated as proposer and challenger. In the context of this permissioned aggkit deployment, there are no state proposals made here and the op stack fault proof system is not used.
      sourceHashes.0:
-        "0x7129ee348039f13e017c18c90ffcb319f67a8fdd3b4a5a28c39aabc8bf0c57f6"
+        "0x0a442058af95748cc6199d889a46c775f9f6f4d29a61df5124ceb93ff631074d"
    }
```

```diff
    contract MIPS (eth:0xF027F4A985560fb13324e943edf55ad6F1d15Dc1) {
    +++ description: The MIPS contract is used to execute the final step of the dispute game which objectively determines the winner of the dispute.
      sourceHashes.0:
-        "0x115725ab57eeed11f754138c0ec5f9bfba41e494b2336c2cd4745778eb26f776"
+        "0xd693f0cc376e99425037555be4a61adb70c597ad1485e838c475743c79a41fa0"
    }
```

Generated with discovered.json: 0xd711d26e0acafacaf8e87ddc2745943abf94b387

# Diff at Tue, 04 Nov 2025 09:10:24 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@c52d5c1cf2092208997feb6320a35c565d7e0b0b block: 1761895573
- current timestamp: 1761895573

## Description

config: hide proposer/challenger perms with custom criteria template for the dispute game contract.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1761895573 (main branch discovery), not current.

```diff
    contract Conduit Multisig 1 (eth:0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      receivedPermissions:
-        [{"permission":"challenge","from":"eth:0x667b7DA73DA7B2A75286378FF45637eEaE9B4793","role":".challenger"}]
    }
```

```diff
    EOA  (eth:0x4A6f5889409Bf4Bf3Bff0Fef585D7A29FdA64258) {
    +++ description: None
      receivedPermissions:
-        [{"permission":"propose","from":"eth:0x667b7DA73DA7B2A75286378FF45637eEaE9B4793","role":".proposer"}]
    }
```

```diff
    contract PermissionedDisputeGame (eth:0x667b7DA73DA7B2A75286378FF45637eEaE9B4793) {
    +++ description: Same as FaultDisputeGame, but only two permissioned addresses are designated as proposer and challenger. In the context of this permissioned aggkit deployment, there are no state proposals made here and the op stack fault proof system is not used.
      template:
-        "opstack/PermissionedDisputeGame"
+        "polygon-cdk/PermissionedDisputeGameUnused"
      description:
-        "Same as FaultDisputeGame, but only two permissioned addresses are designated as proposer and challenger."
+        "Same as FaultDisputeGame, but only two permissioned addresses are designated as proposer and challenger. In the context of this permissioned aggkit deployment, there are no state proposals made here and the op stack fault proof system is not used."
    }
```

Generated with discovered.json: 0xa954e75854d6138c7e6f20c3e2b7e2d0ca8a3896

# Diff at Mon, 03 Nov 2025 17:47:30 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@6b72018cd9706ce7cba8ec489b67d7193f34dc20 block: 1761895573
- current timestamp: 1761895573

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1761895573 (main branch discovery), not current.

```diff
    contract Conduit Multisig 1 (eth:0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      receivedPermissions:
+        [{"permission":"challenge","from":"eth:0x667b7DA73DA7B2A75286378FF45637eEaE9B4793","role":".challenger"}]
    }
```

```diff
    EOA  (eth:0x4A6f5889409Bf4Bf3Bff0Fef585D7A29FdA64258) {
    +++ description: None
      receivedPermissions:
+        [{"permission":"propose","from":"eth:0x667b7DA73DA7B2A75286378FF45637eEaE9B4793","role":".proposer"}]
    }
```

Generated with discovered.json: 0x7f972cfc07a9051463a8b73abd6ad4365e0b992d

# Diff at Fri, 31 Oct 2025 13:46:31 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@68eb98b0468d176aa44713dcaed98f67b2a200a0 block: 1759480843
- current timestamp: 1761895573

## Description

Agglayer 0.3.5 upgrade:

AggchainFEP - https://disco.l2beat.com/diff/eth:0xe7FE45579D784DC83B0feD844A65f4cEEFDe5682/eth:0x9532A2F35fc9B18BD4FE8315D9C5B1C1Cf6Ac660
- aggchainManager added
- vkey manager removed, new aggchainManager has inherited their permissions
- oppsuccinctConfig is now a single struct with range, agg vkeys and the confighash (all keys changed)
- aggchainVkey changed, still defined in the AgglayerGateway and not in this contract

## Watched changes

```diff
    contract AggchainFEP (eth:0x100d3ca4f97776A40A7D93dB4AbF0FEA34230666) {
    +++ description: The main system contract defining the katana Aggchain logic. This contract, based on the OP-Succinct L2OutputOracle, supports validity proofs and OP stack outputRoots (L2 state roots) are saved here.
      template:
-        "polygon-cdk/AggchainFEP"
+        "katana/AggchainFEP_post035"
      sourceHashes.1:
-        "0xe893ad152fe92e36431300818c1be2ef9c1d514a53c4ea4beba3dc0f4f9b8e4f"
+        "0xd4a4d01788e8425e9dc0f2cd6f1954d521d3d0b021487bb0daeec6d8e26091c9"
      description:
-        "The main system contract defining the katana Layer 2 logic. As this contract is based on the OP-Succinct L2OutputOracle, OP stack outputRoots (L2 state roots) are saved here."
+        "The main system contract defining the katana Aggchain logic. This contract, based on the OP-Succinct L2OutputOracle, supports validity proofs and OP stack outputRoots (L2 state roots) are saved here."
      values.$implementation:
-        "eth:0xe7FE45579D784DC83B0feD844A65f4cEEFDe5682"
+        "eth:0x9532A2F35fc9B18BD4FE8315D9C5B1C1Cf6Ac660"
      values.$pastUpgrades.3:
+        ["2025-10-29T14:11:11.000Z","0x7be3301b763f904f5076e22914b0ea13e101ed3cff6480b23a7757e7b9875939",["eth:0x9532A2F35fc9B18BD4FE8315D9C5B1C1Cf6Ac660"]]
      values.$upgradeCount:
-        3
+        4
      values.pendingVKeyManager:
-        "eth:0x0000000000000000000000000000000000000000"
      values.useDefaultGateway:
-        true
      values.version:
-        "v2.0.0"
+        "v3.0.0"
      values.vKeyManager:
-        "eth:0x4e981bAe8E3cd06Ca911ffFE5504B2653ac1C38a"
      values._legacypendingVKeyManager:
+        "eth:0x0000000000000000000000000000000000000000"
      values._legacyvKeyManager:
+        "eth:0x4e981bAe8E3cd06Ca911ffFE5504B2653ac1C38a"
      values.AGGCHAIN_FEP_VERSION:
+        "v3.0.0"
      values.aggchainMetadataManager:
+        "eth:0x0000000000000000000000000000000000000000"
+++ severity: HIGH
      values.aggchainMultisigHash:
+        "0xa57d26181a2caeea2b3fd5057d852d665445bd502aac8281622f922335bcc7d7"
      values.aggchainSigners:
+        ["eth:0xC1E65a0cEbF95f56Cd8729f7e37CB33eD94d6439"]
      values.GENESIS_CONFIG_NAME:
+        "0xae8304f40f7123e0c87b97f8a600e94ff3a3a25be588fc66b8a3717c8959ce77"
      values.getAggchainMultisigHash:
+        "0xa57d26181a2caeea2b3fd5057d852d665445bd502aac8281622f922335bcc7d7"
      values.getAggchainSignerInfos:
+        [{"addr":"eth:0xC1E65a0cEbF95f56Cd8729f7e37CB33eD94d6439","url":"https://rpc.katanarpc.com"}]
      values.getAggchainSigners:
+        ["eth:0xC1E65a0cEbF95f56Cd8729f7e37CB33eD94d6439"]
      values.getAggchainSignersCount:
+        1
      values.getThreshold:
+        1
      values.MAX_AGGCHAIN_SIGNERS:
+        255
      values.selectedOpSuccinctConfig:
+        {"aggregationVkey":"0x00afb45d8064ae10aa6a1793b8f39a24c27268efae2917b5c02950b2377fbf00","rangeVkeyCommitment":"0x416d710344b6b6fa2a0b1a1445f3d6ba4fdd5ab43f0e863b1c522db20f28ad9b","rollupConfigHash":"0x6cd1b72f40b6ddf464897d8d1b084241f38ae5fda17175ff45afb3307b2523e9"}
+++ description: currently enforced OpSuccinctConfig. update the call handler for the full config if this changes.
+++ severity: HIGH
      values.selectedOpSuccinctConfigName:
+        "0x622142ba8035695383551428b698950d3d4a6a53629c90a86d7192cfb221ae4e"
      values.threshold:
+        1
+++ severity: HIGH
      values.useDefaultSigners:
+        false
+++ severity: HIGH
      values.useDefaultVkeys:
+        true
      fieldMeta.optimisticMode.description:
-        "degrades the system into a permissioned finalization mode without validity proofs. the state root in the aggchain proof in optimistic mode does not need an op succinct validity proof, but only a signature of the trustedSequencer."
+        "degrades the system into a permissioned finalization mode without validity proofs. The state root in the aggchain proof in optimistic mode does not need an op succinct validity proof, but only a signature of the trustedSequencer."
      fieldMeta.aggregationVkey.severity:
-        "HIGH"
+        "LOW"
      fieldMeta.aggregationVkey.description:
-        "Verification key for the aggregation step which aggregates multiple range proofs into a single proof. The aggregation proof ensures that all range proofs in a given block range are linked and use the `rangeVkeyCommitment` as the verification key. This proof is in turn wrapped by the aggchainVkey."
+        "DEPRECATED - Verification key for the aggregation step which aggregates multiple range proofs into a single proof. The aggregation proof ensures that all range proofs in a given block range are linked and use the `rangeVkeyCommitment` as the verification key. This proof is in turn wrapped by the aggchainVkey."
      fieldMeta.rangeVkeyCommitment.severity:
-        "HIGH"
+        "LOW"
      fieldMeta.rangeVkeyCommitment.description:
-        "Verification key for the OP Stack derivation + STF proof for a range of blocks. This proof is the bottom level proof, wrapped by the aggregationVkey."
+        "DEPRECATED - Verification key for the OP Stack derivation + STF proof for a range of blocks. This proof is the bottom level proof, wrapped by the aggregationVkey."
      fieldMeta.useDefaultGateway:
-        {"severity":"HIGH","description":"If set to false then aggchainVKey will be loaded from this contract and not from AggLayerGateway. In this case you can uncomment two handlers in this template to track ownedAggchainVKeys."}
      fieldMeta.aggchainMultisigHash:
+        {"severity":"HIGH"}
      fieldMeta.selectedOpSuccinctConfigName:
+        {"severity":"HIGH","description":"currently enforced OpSuccinctConfig. update the call handler for the full config if this changes."}
      fieldMeta.useDefaultSigners:
+        {"severity":"HIGH"}
      fieldMeta.useDefaultVkeys:
+        {"severity":"HIGH"}
      implementationNames.eth:0xe7FE45579D784DC83B0feD844A65f4cEEFDe5682:
-        "AggchainFEP"
      implementationNames.eth:0x9532A2F35fc9B18BD4FE8315D9C5B1C1Cf6Ac660:
+        "AggchainFEP"
    }
```

```diff
    contract Katana Foundation Engineering/Security Multisig (eth:0x4e981bAe8E3cd06Ca911ffFE5504B2653ac1C38a) {
    +++ description: None
      receivedPermissions.0.description:
-        "change the op-succinct related verification keys (aggregationVkey, rangeVkeyCommitment) and the rollupConfigHash."
+        "change verification keys (aggregationVkey, rangeVkeyCommitment, aggchainVkey) and the rollupConfigHash, manage multisig signers for permissioned state transitions and change critical configs for state validation."
    }
```

```diff
    EOA  (eth:0xC1E65a0cEbF95f56Cd8729f7e37CB33eD94d6439) {
    +++ description: None
      receivedPermissions.0.role:
-        ".trustedSequencer"
+        ".aggchainSigners"
      receivedPermissions.0.description:
-        "finalize any state root with only their signature."
+        "sign state transitions (replaces state validation for this aggchain)."
    }
```

## Source code changes

```diff
.../AggchainFEP/AggchainFEP.sol                    | 1448 +++++++++++++++-----
 1 file changed, 1136 insertions(+), 312 deletions(-)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1759480843 (main branch discovery), not current.

```diff
    reference AgglayerGateway (eth:0x046Bb8bb98Db4ceCbB2929542686B74b516274b3) {
    +++ description: None
      name:
-        "AggLayerGateway"
+        "AgglayerGateway"
    }
```

```diff
    reference AgglayerBridge (eth:0x2a3DD3EB832aF982ec71669E178424b10Dca2EDe) {
    +++ description: None
      name:
-        "PolygonSharedBridge"
+        "AgglayerBridge"
    }
```

```diff
    reference AgglayerManager (eth:0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2) {
    +++ description: None
      name:
-        "PolygonRollupManager"
+        "AgglayerManager"
    }
```

```diff
    reference AgglayerGER (eth:0x580bda1e7A0CFAe92Fa7F6c20A3794F169CE3CFb) {
    +++ description: None
      name:
-        "PolygonGlobalExitRootV2"
+        "AgglayerGER"
    }
```

Generated with discovered.json: 0xd9c2099b68f8527d6a640777732122bfe2d0affd

# Diff at Fri, 03 Oct 2025 08:42:02 GMT:

- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@e647409961cd173771dcfcaeb808991c99e73911 block: 1759236440
- current timestamp: 1759480843

## Description

Member removed from multisig.

## Watched changes

```diff
    contract Conduit Multisig 1 (eth:0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      values.$members.2:
-        "eth:0x50930d652266EF4127FA3A1906B7Cb9951076628"
      values.multisigThreshold:
-        "4 of 11 (36%)"
+        "4 of 10 (40%)"
    }
```

Generated with discovered.json: 0x4a792804785baba4ef9ecb5337e818170bbeee79

# Diff at Tue, 30 Sep 2025 14:26:33 GMT:

- author: Sergey Shemyakov (<sergey.shemyakov@l2beat.com>)
- comparing to: main@8b1e8b6b8628030e60b22b7773a337689b280854 block: 1756453226
- current timestamp: 1759236440

## Description

Config-related changes: added desciption for non-default aggchainVKey derivation.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1756453226 (main branch discovery), not current.

```diff
    contract AggchainFEP (eth:0x100d3ca4f97776A40A7D93dB4AbF0FEA34230666) {
    +++ description: The main system contract defining the katana Layer 2 logic. As this contract is based on the OP-Succinct L2OutputOracle, OP stack outputRoots (L2 state roots) are saved here.
      fieldMeta.useDefaultGateway:
+        {"severity":"HIGH","description":"If set to false then aggchainVKey will be loaded from this contract and not from AggLayerGateway. In this case you can uncomment two handlers in this template to track ownedAggchainVKeys."}
    }
```

Generated with discovered.json: 0x74ddcd025d71b7a6ec07c9512c409eb94913e195

# Diff at Mon, 15 Sep 2025 09:50:24 GMT:

- author: Sergey Shemyakov (<sergey.shemyakov@l2beat.com>)
- comparing to: main@37882e40cb6029f3a2ae2bb177048e3e846b833d block: 1756453226
- current timestamp: 1756453226

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1756453226 (main branch discovery), not current.

```diff
    contract DisputeGameFactory (eth:0xe06278351d120288eDfCB963F934113Ca3C21AFe) {
    +++ description: The dispute game factory allows the creation of dispute games, used to propose state roots and eventually challenge them.
+++ severity: HIGH
      values.gameImpls.2:
+        "eth:0x0000000000000000000000000000000000000000"
+++ severity: HIGH
      values.gameImpls.3:
+        "eth:0x0000000000000000000000000000000000000000"
    }
```

Generated with discovered.json: 0x728a8c117da26e3d310eca1fb5a8f356acd4f3b0

# Diff at Wed, 03 Sep 2025 15:52:24 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@fbfe8da4086c70042fea30347d68132d3f574015 block: 1756453226
- current timestamp: 1756453226

## Description

Rerun to add References to entrypoints of shared modules

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1756453226 (main branch discovery), not current.

```diff
+   Status: CREATED
    reference AggLayerGateway (eth:0x046Bb8bb98Db4ceCbB2929542686B74b516274b3)
    +++ description: None
```

```diff
+   Status: CREATED
    reference  (eth:0x21618593F7147235aC8D511d68A547C935F9d417)
    +++ description: None
```

```diff
+   Status: CREATED
    reference PolygonSharedBridge (eth:0x2a3DD3EB832aF982ec71669E178424b10Dca2EDe)
    +++ description: None
```

```diff
+   Status: CREATED
    reference PolygonRollupManager (eth:0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2)
    +++ description: None
```

```diff
+   Status: CREATED
    reference  (eth:0x516eEcfb38aA308c5f1878497108c7d054fd46B7)
    +++ description: None
```

```diff
+   Status: CREATED
    reference  (eth:0x54c401eD03D086fE13221E5422165f3b024265d9)
    +++ description: None
```

```diff
+   Status: CREATED
    reference PolygonGlobalExitRootV2 (eth:0x580bda1e7A0CFAe92Fa7F6c20A3794F169CE3CFb)
    +++ description: None
```

```diff
+   Status: CREATED
    reference  (eth:0xa43901c63f7702C407378E55E0d0EB4064a2AE31)
    +++ description: None
```

```diff
+   Status: CREATED
    reference  (eth:0xAb3506507449bF1880f3337825efd19ac89E235E)
    +++ description: None
```

```diff
+   Status: CREATED
    reference  (eth:0xcAB31b6A7b4d2eCd562A09e2BfA46535a18862f9)
    +++ description: None
```

```diff
+   Status: CREATED
    reference  (eth:0xdFEd8373695a7b3DaF268CF91e71f6a7024A56Da)
    +++ description: None
```

```diff
+   Status: CREATED
    reference  (eth:0xEad77b01ea770839F7f576Cd1516Ff6A298d9dB2)
    +++ description: None
```

```diff
+   Status: CREATED
    reference  (eth:0xeD44D1CFfB91e163CB7126bdEeA83959f175dB37)
    +++ description: None
```

```diff
+   Status: CREATED
    reference  (eth:0xED7cC82235A7757702475c8f77c7830c095FB5a2)
    +++ description: None
```

```diff
+   Status: CREATED
    reference  (eth:0xffbfc0c8331C5fc912DDA3C6D4A86eEB80203238)
    +++ description: None
```

Generated with discovered.json: 0x8f6225423b3d1e869aa706fdeed1388a853e4058

# Diff at Mon, 01 Sep 2025 10:01:10 GMT:

Merge mark

Generated with discovered.json: 0x77f05fe88102228c2fd94b74d24e0415b0a50638

# Diff at Fri, 29 Aug 2025 07:41:35 GMT:

- chain: ethereum
- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@e68cba094085f7ab7e642304a942701f260f19fb block: 1756214657
- current timestamp: 1756453226

## Description

Msig changes.

## Watched changes

```diff
    contract Katana yieldRecipient Mulsitig (0x67C912fF560951526BffDff66dFbD4DF8AE23756) {
    +++ description: None
      values.$members.2:
-        "eth:0x0A4857fD89ABfB7536a6D0Bd4400EF769E84Ec8b"
+        "eth:0x6c20ea7778EA9F3Afd74Ce4538bc4D9d61E6ABb1"
    }
```

```diff
    contract Safe (0xFA58659F64a393A6E1A548ABc70Ad2CfE1e8f9Cb) {
    +++ description: None
      values.$members.1:
-        "eth:0x0A4857fD89ABfB7536a6D0Bd4400EF769E84Ec8b"
+        "eth:0x6624307a4f672ec5C289fBA196952902BB518dc0"
    }
```

Generated with discovered.json: 0x08ccc0d7f5082952e7141e310d4d66ad31a3bad4

# Diff at Tue, 26 Aug 2025 13:28:38 GMT:

- chain: ethereum
- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@e10932be0db538f3a760bbc29232375f08915af7 block: 1755686907
- current timestamp: 1756214657

## Description

Conduit msig: removed one address

## Watched changes

```diff
    contract Conduit Multisig 1 (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      values.$members.2:
-        "eth:0x860e06Fe384D1A3340111e7D142E02642178c053"
      values.multisigThreshold:
-        "4 of 12 (33%)"
+        "4 of 11 (36%)"
    }
```

Generated with discovered.json: 0xc4e3340ae4fbf7e2103819c69b7c461ef62b6cdd

# Diff at Wed, 20 Aug 2025 10:48:46 GMT:

- chain: ethereum
- author: Sergey Shemyakov (<sergey.shemyakov@l2beat.com>)
- comparing to: main@262b00e32d0a4e462cf5011a16f1fcaa9ed6d5a8 block: 1755156807
- current timestamp: 1755686907

## Description

Updated the range program for proving L2 STF. I was not able to check the vkey commitment.

## Watched changes

```diff
    contract AggchainFEP (0x100d3ca4f97776A40A7D93dB4AbF0FEA34230666) {
    +++ description: The main system contract defining the katana Layer 2 logic. As this contract is based on the OP-Succinct L2OutputOracle, OP stack outputRoots (L2 state roots) are saved here.
+++ description: Verification key for the OP Stack derivation + STF proof for a range of blocks. This proof is the bottom level proof, wrapped by the aggregationVkey.
+++ severity: HIGH
      values.rangeVkeyCommitment:
-        "0x2ebb1e0d5380158f22adf3750cc6056100a133d274fd7c5b457148ff29dfe173"
+        "0x490685ea27adbbb83301073734f40a5656c984fe352359d54dd637e828e66872"
    }
```

Generated with discovered.json: 0xaa81c969a22f2d5fc8e7b7045f01ffdb18ad02ae

# Diff at Thu, 14 Aug 2025 07:33:34 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@200c2747a4a049cdea3746f37927303721bc165b block: 1755009465
- current timestamp: 1755156807

## Description

signer change.

## Watched changes

```diff
    contract Safe (0x261a25ec6c396389B75B6b22BD4A8227070E3B50) {
    +++ description: None
      values.$members.0:
+        "eth:0x3e86A8bcAF0A96DD16Ec8160532DA13b2C0f6e21"
      values.multisigThreshold:
-        "1 of 3 (33%)"
+        "1 of 4 (25%)"
    }
```

```diff
+   Status: CREATED
    contract Safe (0x3e86A8bcAF0A96DD16Ec8160532DA13b2C0f6e21)
    +++ description: None
```

## Source code changes

```diff
.../Safe.sol                                       | 1088 ++++++++++++++++++++
 .../SafeProxy.p.sol                                |   37 +
 2 files changed, 1125 insertions(+)
```

Generated with discovered.json: 0xe75ccf8ecc3587a3f653de33137e903bd5440ea5

# Diff at Tue, 12 Aug 2025 14:40:13 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@e94498235c6c8b45d3e4bfb77316081ba540850a block: 1754909593
- current timestamp: 1755009465

## Description

Conduit Multisig 1 signer added.

## Watched changes

```diff
    contract Conduit Multisig 1 (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      values.$members.0:
+        "eth:0xFe0ab87ebE03DD0bF52DaF34Dfda6639c335e2d4"
      values.multisigThreshold:
-        "4 of 11 (36%)"
+        "4 of 12 (33%)"
    }
```

Generated with discovered.json: 0xfb1b07e5a70f01bdcf7b811a556c09b25e6091a3

# Diff at Mon, 11 Aug 2025 10:53:22 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@32817e35c9fe0ba1a1c24a734c37d91068b1565d block: 1754486452
- current timestamp: 1754909593

## Description

yield recipient changed.

## Watched changes

```diff
    contract vbWBTC (0x2C24B57e2CCd1f273045Af6A5f632504C432374F) {
    +++ description: This token contract uses a standard 'vault bridge token' implementation created by Agglayer CDK. It keeps deposited assets in a vault and issues an IOU token (Vault Bridge WBTC) which can be deposited to Agglayer. The underlying asset is generating yield, which does not accrue to the vbWBTC-IOU but is sent to eth:0x261a25ec6c396389B75B6b22BD4A8227070E3B50.
      description:
-        "This token contract uses a standard 'vault bridge token' implementation created by Agglayer CDK. It keeps deposited assets in a vault and issues an IOU token (Vault Bridge WBTC) which can be deposited to Agglayer. The underlying asset is generating yield, which does not accrue to the vbWBTC-IOU but is sent to eth:0x67C912fF560951526BffDff66dFbD4DF8AE23756."
+        "This token contract uses a standard 'vault bridge token' implementation created by Agglayer CDK. It keeps deposited assets in a vault and issues an IOU token (Vault Bridge WBTC) which can be deposited to Agglayer. The underlying asset is generating yield, which does not accrue to the vbWBTC-IOU but is sent to eth:0x261a25ec6c396389B75B6b22BD4A8227070E3B50."
    }
```

```diff
    contract vbETH (0x2DC70fb75b88d2eB4715bc06E1595E6D97c34DFF) {
    +++ description: This token contract uses a standard 'vault bridge token' implementation created by Agglayer CDK. It keeps deposited assets in a vault and issues an IOU token (Vault Bridge ETH) which can be deposited to Agglayer. The underlying asset is generating yield, which does not accrue to the vbETH-IOU but is sent to eth:0x261a25ec6c396389B75B6b22BD4A8227070E3B50.
      description:
-        "This token contract uses a standard 'vault bridge token' implementation created by Agglayer CDK. It keeps deposited assets in a vault and issues an IOU token (Vault Bridge ETH) which can be deposited to Agglayer. The underlying asset is generating yield, which does not accrue to the vbETH-IOU but is sent to eth:0x67C912fF560951526BffDff66dFbD4DF8AE23756."
+        "This token contract uses a standard 'vault bridge token' implementation created by Agglayer CDK. It keeps deposited assets in a vault and issues an IOU token (Vault Bridge ETH) which can be deposited to Agglayer. The underlying asset is generating yield, which does not accrue to the vbETH-IOU but is sent to eth:0x261a25ec6c396389B75B6b22BD4A8227070E3B50."
    }
```

```diff
    contract vbUSDS (0x3DD459dE96F9C28e3a343b831cbDC2B93c8C4855) {
    +++ description: This token contract uses a standard 'vault bridge token' implementation created by Agglayer CDK. It keeps deposited assets in a vault and issues an IOU token (Vault Bridge USDS) which can be deposited to Agglayer. The underlying asset is generating yield, which does not accrue to the vbUSDS-IOU but is sent to eth:0x261a25ec6c396389B75B6b22BD4A8227070E3B50.
      description:
-        "This token contract uses a standard 'vault bridge token' implementation created by Agglayer CDK. It keeps deposited assets in a vault and issues an IOU token (Vault Bridge USDS) which can be deposited to Agglayer. The underlying asset is generating yield, which does not accrue to the vbUSDS-IOU but is sent to eth:0x67C912fF560951526BffDff66dFbD4DF8AE23756."
+        "This token contract uses a standard 'vault bridge token' implementation created by Agglayer CDK. It keeps deposited assets in a vault and issues an IOU token (Vault Bridge USDS) which can be deposited to Agglayer. The underlying asset is generating yield, which does not accrue to the vbUSDS-IOU but is sent to eth:0x261a25ec6c396389B75B6b22BD4A8227070E3B50."
    }
```

```diff
    contract vbUSDC (0x53E82ABbb12638F09d9e624578ccB666217a765e) {
    +++ description: This token contract uses a standard 'vault bridge token' implementation created by Agglayer CDK. It keeps deposited assets in a vault and issues an IOU token (Vault Bridge USDC) which can be deposited to Agglayer. The underlying asset is generating yield, which does not accrue to the vbUSDC-IOU but is sent to eth:0x261a25ec6c396389B75B6b22BD4A8227070E3B50.
      description:
-        "This token contract uses a standard 'vault bridge token' implementation created by Agglayer CDK. It keeps deposited assets in a vault and issues an IOU token (Vault Bridge USDC) which can be deposited to Agglayer. The underlying asset is generating yield, which does not accrue to the vbUSDC-IOU but is sent to eth:0x67C912fF560951526BffDff66dFbD4DF8AE23756."
+        "This token contract uses a standard 'vault bridge token' implementation created by Agglayer CDK. It keeps deposited assets in a vault and issues an IOU token (Vault Bridge USDC) which can be deposited to Agglayer. The underlying asset is generating yield, which does not accrue to the vbUSDC-IOU but is sent to eth:0x261a25ec6c396389B75B6b22BD4A8227070E3B50."
    }
```

```diff
    contract vbUSDT (0x6d4f9f9f8f0155509ecd6Ac6c544fF27999845CC) {
    +++ description: This token contract uses a standard 'vault bridge token' implementation created by Agglayer CDK. It keeps deposited assets in a vault and issues an IOU token (Vault Bridge USDT) which can be deposited to Agglayer. The underlying asset is generating yield, which does not accrue to the vbUSDT-IOU but is sent to eth:0x261a25ec6c396389B75B6b22BD4A8227070E3B50.
      description:
-        "This token contract uses a standard 'vault bridge token' implementation created by Agglayer CDK. It keeps deposited assets in a vault and issues an IOU token (Vault Bridge USDT) which can be deposited to Agglayer. The underlying asset is generating yield, which does not accrue to the vbUSDT-IOU but is sent to eth:0x67C912fF560951526BffDff66dFbD4DF8AE23756."
+        "This token contract uses a standard 'vault bridge token' implementation created by Agglayer CDK. It keeps deposited assets in a vault and issues an IOU token (Vault Bridge USDT) which can be deposited to Agglayer. The underlying asset is generating yield, which does not accrue to the vbUSDT-IOU but is sent to eth:0x261a25ec6c396389B75B6b22BD4A8227070E3B50."
    }
```

```diff
+   Status: CREATED
    contract Safe (0x261a25ec6c396389B75B6b22BD4A8227070E3B50)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Safe (0xFA58659F64a393A6E1A548ABc70Ad2CfE1e8f9Cb)
    +++ description: None
```

## Source code changes

```diff
.../Safe.sol                                       | 1088 ++++++++++++++++++++
 .../SafeProxy.p.sol                                |   37 +
 .../Safe.sol                                       | 1088 ++++++++++++++++++++
 .../SafeProxy.p.sol                                |   37 +
 4 files changed, 2250 insertions(+)
```

Generated with discovered.json: 0x67d63c0bc913306634e8c5e959df23eb147cb90e

# Diff at Wed, 06 Aug 2025 13:35:55 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@1702d91eebfba5d614c3470bbe1babe10fbe4c2b block: 1754054572
- current timestamp: 1754486452

## Description

config: add description

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1754054572 (main branch discovery), not current.

```diff
    contract AggchainFEP (0x100d3ca4f97776A40A7D93dB4AbF0FEA34230666) {
    +++ description: The main system contract defining the katana Layer 2 logic. As this contract is based on the OP-Succinct L2OutputOracle, OP stack outputRoots (L2 state roots) are saved here.
      fieldMeta.CONSENSUS_TYPE:
+        {"description":"0 - ECDSA sig verification, 1 - aggchainVkey verification (read by the pessimistic program)"}
    }
```

Generated with discovered.json: 0x931b50b0738f7df8ea39eca00aeebcf7afbb33f6

# Diff at Fri, 01 Aug 2025 13:23:05 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@802242fc2209399893865092b1048d583aafc2bb block: 1753356947
- current timestamp: 1754054572

## Description

op  stack operator fee constant set.

three members added to multisig, threshold increased.

## Watched changes

```diff
    contract SystemConfig (0xb6e1f8B589A14B79DDD3aD7F0589AB548c70C174) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      values.operatorFeeConstant:
-        0
+        1351351351351
    }
```

```diff
    contract Polygon Multisig 2 (0xd0673F989bc3BA9314d0AAF28BfC84e99B7898CC) {
    +++ description: None
      values.$members.0:
+        "eth:0x2483A0d6a3Bd89D5C17aA80B3f8f6102ac053361"
      values.$members.1:
+        "eth:0x73D8846324B30477EA3Ac055589e40F39DE497F8"
      values.$members.2:
+        "eth:0x34d23C4fb6542B467cA8724bAD30AC811399b184"
      values.$threshold:
-        1
+        3
      values.multisigThreshold:
-        "1 of 2 (50%)"
+        "3 of 5 (60%)"
    }
```

Generated with discovered.json: 0xa91c32ac9e9a7e5b109b7094b0b8cb6daec8e3d3

# Diff at Thu, 24 Jul 2025 16:55:25 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@a3f740c0fd51a5745c45d8f349ab01f4f33f7770 block: 22988752
- current block number: 22988752

## Description

config: set dispute game impl changes to high severity.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22988752 (main branch discovery), not current.

```diff
    contract DisputeGameFactory (0xe06278351d120288eDfCB963F934113Ca3C21AFe) {
    +++ description: The dispute game factory allows the creation of dispute games, used to propose state roots and eventually challenge them.
      fieldMeta:
+        {"gameImpls":{"severity":"HIGH"},"game1337":{"severity":"HIGH"}}
    }
```

Generated with discovered.json: 0xb4ffe8a242a8b05c153c4f7d3aeab0d2f3bf1d2c

# Diff at Thu, 24 Jul 2025 11:38:32 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@daf9b4c0c3e0cc879ae7e4d12a2a3cc6a78da2a5 block: 22966867
- current block number: 22988752

## Description

Upgrade op stack contracts to known versions. The only aberrant contract is the new OptiPortal2, which, like the old one, [disallows deposited transactions](https://disco.l2beat.com/diff/eth:0xB443Da3e07052204A02d630a8933dAc05a0d6fB4/eth:0x51c852eC17062FB229A117Cb8abCBc7Eb171D5Bc).

Config: Kailua added to OptimismPortal2 and DisputeGameFactory.

## Watched changes

```diff
    contract L1ERC721Bridge (0x15a32FCeA89617Ff450F094cDE102CCa46598B7F) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      sourceHashes.1:
-        "0x482ec6e91304ac39a3fb4505634427bddfddee23b8e93a4f7f995ca5083ae3c3"
+        "0x28669b49da3effd51f0f9424ca9cdd455c5b9327c09a40c65fc06f114a6eb837"
      values.$implementation:
-        "eth:0xAE2AF01232a6c4a4d3012C5eC5b1b35059caF10d"
+        "eth:0x7aE1d3BD877a4C5CA257404ce26BE93A02C98013"
      values.$pastUpgrades.1:
+        ["2025-07-23T17:04:59.000Z","0xc60a3166aa296b584f143a129ac53f156ee9946373ff5fb97b3785cc5fc092a2",["eth:0x276d3730f219f7ec22274f7263180b8452B46d47"]]
      values.$pastUpgrades.2:
+        ["2025-07-23T17:04:59.000Z","0xc60a3166aa296b584f143a129ac53f156ee9946373ff5fb97b3785cc5fc092a2",["eth:0x7aE1d3BD877a4C5CA257404ce26BE93A02C98013"]]
      values.$upgradeCount:
-        1
+        3
      values.version:
-        "2.1.0"
+        "2.4.0"
      implementationNames.eth:0xAE2AF01232a6c4a4d3012C5eC5b1b35059caF10d:
-        "L1ERC721Bridge"
      implementationNames.eth:0x7aE1d3BD877a4C5CA257404ce26BE93A02C98013:
+        "L1ERC721Bridge"
    }
```

```diff
    contract ProxyAdmin (0x19DbD16f0a8e706D817B7e3b7bcF72917Ebb8832) {
    +++ description: None
      directlyReceivedPermissions.2:
+        {"permission":"upgrade","from":"eth:0x1AaA08d577cbC3da3b955DC1B7a281D7b8fE3372","role":"admin"}
      directlyReceivedPermissions.5:
-        {"permission":"upgrade","from":"eth:0x79ecD8d8040496014bcD3bA16AdF3914b23f8Fd5","role":"admin"}
    }
```

```diff
    contract L1CrossDomainMessenger (0x2008A6Ba8CAF85AaFAe7880664Dfe681D533ac2E) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      sourceHashes.1:
-        "0x1cc8a3b7de3d2c54c4706bb3f3015714d3b56647fc9fbfd6f8b068f5f63c1c25"
+        "0x03bcdc719cb7bd0a1377c01bb50b30a6122b308f673b7d7b15a3bb8628e6bd8c"
      values.$implementation:
-        "eth:0xD3494713A5cfaD3F5359379DfA074E2Ac8C6Fd65"
+        "eth:0x5D5a095665886119693F0B41d8DFeE78da033e8B"
      values.$pastUpgrades.1:
+        ["2025-07-23T17:04:59.000Z","0xc60a3166aa296b584f143a129ac53f156ee9946373ff5fb97b3785cc5fc092a2",["eth:0x3eA6084748ED1b2A9B5D4426181F1ad8C93F6231"]]
      values.$pastUpgrades.2:
+        ["2025-07-23T17:04:59.000Z","0xc60a3166aa296b584f143a129ac53f156ee9946373ff5fb97b3785cc5fc092a2",["eth:0x5D5a095665886119693F0B41d8DFeE78da033e8B"]]
      values.$upgradeCount:
-        1
+        3
      values.version:
-        "2.3.0"
+        "2.6.0"
      values.ENCODING_OVERHEAD:
+        260
      values.FLOOR_CALLDATA_OVERHEAD:
+        40
      values.TX_BASE_GAS:
+        21000
      implementationNames.eth:0xD3494713A5cfaD3F5359379DfA074E2Ac8C6Fd65:
-        "L1CrossDomainMessenger"
      implementationNames.eth:0x5D5a095665886119693F0B41d8DFeE78da033e8B:
+        "L1CrossDomainMessenger"
    }
```

```diff
    contract OptimismPortal2 (0x250D30c523104bf0a06825e7eAdE4Dc46EdfE40E) {
    +++ description: The OptimismPortal contract usually is the main entry point to deposit funds from L1 to L2 or for finalizing withdrawals. It specifies which game type can be used for withdrawals, which currently is the PermissionedDisputeGame. This specific fork of the standard contract **disables the depositTransaction() function**, which prevents users from sending or forcing any transactions from L1 to L2, including token deposits. It is instead used for configuration and administration of the system.
      sourceHashes.1:
-        "0x1e6e48895b45b98acfe8b9c9f4568d3662e2932d82019f4ea721e2f7b57a58fc"
+        "0x9cf3cb8a68c82a3a8328495d5f019daa51e9098a69b69ee8e349e3058b789338"
      values.$implementation:
-        "eth:0x9a6C2Dcc7e523f87716e17Ba36D10CCfFA0A60bb"
+        "eth:0x51c852eC17062FB229A117Cb8abCBc7Eb171D5Bc"
      values.$pastUpgrades.2:
+        ["2025-07-23T17:04:59.000Z","0xc60a3166aa296b584f143a129ac53f156ee9946373ff5fb97b3785cc5fc092a2",["eth:0x2D7e764a0D9919e16983a46595CfA81fc34fa7Cd"]]
      values.$pastUpgrades.3:
+        ["2025-07-23T17:04:59.000Z","0xc60a3166aa296b584f143a129ac53f156ee9946373ff5fb97b3785cc5fc092a2",["eth:0xB443Da3e07052204A02d630a8933dAc05a0d6fB4"]]
      values.$pastUpgrades.4:
+        ["2025-07-23T17:04:59.000Z","0xc60a3166aa296b584f143a129ac53f156ee9946373ff5fb97b3785cc5fc092a2",["eth:0x51c852eC17062FB229A117Cb8abCBc7Eb171D5Bc"]]
      values.$upgradeCount:
-        2
+        5
      values.version:
-        "3.11.0-beta.6"
+        "3.14.0"
      implementationNames.eth:0x9a6C2Dcc7e523f87716e17Ba36D10CCfFA0A60bb:
-        "OptimismPortal2"
      implementationNames.eth:0x51c852eC17062FB229A117Cb8abCBc7Eb171D5Bc:
+        "OptimismPortal2"
    }
```

```diff
-   Status: DELETED
    contract PermissionedDisputeGame (0x2d4B822F8B74AdE7fcD5F740967f4dFcD2fef5e4)
    +++ description: Same as FaultDisputeGame, but only two permissioned addresses are designated as proposer and challenger.
```

```diff
    contract SuperchainConfig (0x2F439B95fa789C5d3a5C99cc70EB3ee83D08a811) {
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      sourceHashes.1:
-        "0x3f0bcc82f3184c1cb2e9aa6d3ecdd7c863186eea851dda56dd7e100d9174b840"
+        "0x03dba37173051b02bc81487e181c791bcf1aef664c249e5d035f11f488bdd686"
      values.$implementation:
-        "eth:0x838897A86Cb4F130D0eFC1203d7dA6D0db4bEd1A"
+        "eth:0x4da82a327773965b8d4D85Fa3dB8249b387458E7"
      values.$pastUpgrades.3:
+        ["2025-07-23T17:04:59.000Z","0xc60a3166aa296b584f143a129ac53f156ee9946373ff5fb97b3785cc5fc092a2",["eth:0x4da82a327773965b8d4D85Fa3dB8249b387458E7"]]
      values.$upgradeCount:
-        3
+        4
      values.version:
-        "1.1.1-beta.1"
+        "1.2.0"
      implementationNames.eth:0x838897A86Cb4F130D0eFC1203d7dA6D0db4bEd1A:
-        "SuperchainConfig"
      implementationNames.eth:0x4da82a327773965b8d4D85Fa3dB8249b387458E7:
+        "SuperchainConfig"
    }
```

```diff
    contract Katana Foundation Engineering/Security Multisig (0x4e981bAe8E3cd06Ca911ffFE5504B2653ac1C38a) {
    +++ description: None
      receivedPermissions.6:
+        {"permission":"upgrade","from":"eth:0x1AaA08d577cbC3da3b955DC1B7a281D7b8fE3372","role":"admin","via":[{"address":"eth:0x19DbD16f0a8e706D817B7e3b7bcF72917Ebb8832"}]}
      receivedPermissions.10:
-        {"permission":"upgrade","from":"eth:0x79ecD8d8040496014bcD3bA16AdF3914b23f8Fd5","role":"admin","via":[{"address":"eth:0x19DbD16f0a8e706D817B7e3b7bcF72917Ebb8832"}]}
    }
```

```diff
-   Status: DELETED
    contract MIPS (0x5fE03a12C1236F9C22Cb6479778DDAa4bce6299C)
    +++ description: The MIPS contract is used to execute the final step of the dispute game which objectively determines the winner of the dispute.
```

```diff
    contract DelayedWETH (0x74034597d29613CC8C0BDc8780e1d292A553Bd32) {
    +++ description: Contract designed to hold the bonded ETH for each game. It is designed as a wrapper around WETH to allow an owner to function as a backstop if a game would incorrectly distribute funds.
      sourceHashes.1:
-        "0xfff6f4cca21febd4323222e2ca87ec8b78edfdeeca942468fbf331e537815484"
+        "0x1c7d0fda5ed6d8fc7f5b5f7df5e307f0fcfd173fa5833ea9fce8875d5d44d86a"
      values.$implementation:
-        "eth:0x71e966Ae981d1ce531a7b6d23DC0f27B38409087"
+        "eth:0x5e40B9231B86984b5150507046e354dbFbeD3d9e"
      values.$pastUpgrades.1:
+        ["2025-07-23T17:04:59.000Z","0xc60a3166aa296b584f143a129ac53f156ee9946373ff5fb97b3785cc5fc092a2",["eth:0x5e40B9231B86984b5150507046e354dbFbeD3d9e"]]
      values.$upgradeCount:
-        1
+        2
      values.delay:
-        604800
+        302400
      values.version:
-        "1.1.0"
+        "1.3.0"
      implementationNames.eth:0x71e966Ae981d1ce531a7b6d23DC0f27B38409087:
-        "DelayedWETH"
      implementationNames.eth:0x5e40B9231B86984b5150507046e354dbFbeD3d9e:
+        "DelayedWETH"
    }
```

```diff
-   Status: DELETED
    contract AnchorStateRegistry (0x79ecD8d8040496014bcD3bA16AdF3914b23f8Fd5)
    +++ description: Contains the latest confirmed state root that can be used as a starting point in a dispute game.
```

```diff
    contract L1StandardBridge (0x98906C3f90A06B5484DD67bf32938815d2993dBC) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      sourceHashes.1:
-        "0x1010ff7f40ab4d53e6d9996aefa04423dabe9d0e22fac2d02b330ed3aa2c5740"
+        "0x4e15d99844dc5a4304c2396a66c95ec41218ea311c8e524b118fad7beed0bb53"
      values.$implementation:
-        "eth:0x64B5a5Ed26DCb17370Ff4d33a8D503f0fbD06CfF"
+        "eth:0x0b09ba359A106C9ea3b181CBc5F394570c7d2a7A"
      values.version:
-        "2.1.0"
+        "2.3.0"
      implementationNames.eth:0x64B5a5Ed26DCb17370Ff4d33a8D503f0fbD06CfF:
-        "L1StandardBridge"
      implementationNames.eth:0x0b09ba359A106C9ea3b181CBc5F394570c7d2a7A:
+        "L1StandardBridge"
    }
```

```diff
-   Status: DELETED
    contract PreimageOracle (0x9c065e11870B891D214Bc2Da7EF1f9DDFA1BE277)
    +++ description: The PreimageOracle contract is used to load the required data from L1 for a dispute game.
```

```diff
    contract OptimismMintableERC20Factory (0xA84C37cD0b9bA1B43276C11976DBE9d1344C7f4E) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintableERC20 as this chain's representation of a token on the host chain, or vice-versa.
      sourceHashes.1:
-        "0x4c5ac4e53576924cabbd2a471f368a541bc3f4b1f53fa41a389692fcc62f6176"
+        "0x9650b4bba6299e410f01a369a95a2c57e1c3ca35f0d80c13f4f59fc468f370e5"
      values.$implementation:
-        "eth:0xE01efbeb1089D1d1dB9c6c8b135C934C0734c846"
+        "eth:0x5493f4677A186f64805fe7317D6993ba4863988F"
      values.$pastUpgrades.1:
+        ["2025-07-23T17:04:59.000Z","0xc60a3166aa296b584f143a129ac53f156ee9946373ff5fb97b3785cc5fc092a2",["eth:0x5493f4677A186f64805fe7317D6993ba4863988F"]]
      values.$upgradeCount:
-        1
+        2
      values.version:
-        "1.9.0"
+        "1.10.1"
      implementationNames.eth:0xE01efbeb1089D1d1dB9c6c8b135C934C0734c846:
-        "OptimismMintableERC20Factory"
      implementationNames.eth:0x5493f4677A186f64805fe7317D6993ba4863988F:
+        "OptimismMintableERC20Factory"
    }
```

```diff
    contract SystemConfig (0xb6e1f8B589A14B79DDD3aD7F0589AB548c70C174) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      sourceHashes.1:
-        "0xc7135dbd2a53312d36df3f3ee91ce0a5a459ab8fc7725880a3a9c55a5fa0ed6c"
+        "0x921de6fc906d159fdcef862d2b9559063f5e7b9b7588fa5f33153360ddf296e7"
      values.$implementation:
-        "eth:0xAB9d6cB7A427c0765163A7f45BB91cAfe5f2D375"
+        "eth:0x340f923E5c7cbB2171146f64169EC9d5a9FfE647"
      values.$pastUpgrades.2:
+        ["2025-07-23T17:04:59.000Z","0xc60a3166aa296b584f143a129ac53f156ee9946373ff5fb97b3785cc5fc092a2",["eth:0x760C48C62A85045A6B69f07F4a9f22868659CbCc"]]
      values.$pastUpgrades.3:
+        ["2025-07-23T17:04:59.000Z","0xc60a3166aa296b584f143a129ac53f156ee9946373ff5fb97b3785cc5fc092a2",["eth:0x340f923E5c7cbB2171146f64169EC9d5a9FfE647"]]
      values.$upgradeCount:
-        2
+        4
      values.gasPayingToken:
-        {"addr_":"eth:0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE","decimals_":18}
      values.gasPayingTokenName:
-        "Ether"
      values.gasPayingTokenSymbol:
-        "ETH"
      values.isCustomGasToken:
-        false
      values.version:
-        "2.3.0"
+        "2.5.0"
      values.getAddresses:
+        {"l1CrossDomainMessenger":"eth:0x2008A6Ba8CAF85AaFAe7880664Dfe681D533ac2E","l1ERC721Bridge":"eth:0x15a32FCeA89617Ff450F094cDE102CCa46598B7F","l1StandardBridge":"eth:0x98906C3f90A06B5484DD67bf32938815d2993dBC","disputeGameFactory":"eth:0xe06278351d120288eDfCB963F934113Ca3C21AFe","optimismPortal":"eth:0x250D30c523104bf0a06825e7eAdE4Dc46EdfE40E","optimismMintableERC20Factory":"eth:0xA84C37cD0b9bA1B43276C11976DBE9d1344C7f4E"}
      values.operatorFeeConstant:
+        0
      values.operatorFeeScalar:
+        0
      implementationNames.eth:0xAB9d6cB7A427c0765163A7f45BB91cAfe5f2D375:
-        "SystemConfig"
      implementationNames.eth:0x340f923E5c7cbB2171146f64169EC9d5a9FfE647:
+        "SystemConfig"
    }
```

```diff
    contract DisputeGameFactory (0xe06278351d120288eDfCB963F934113Ca3C21AFe) {
    +++ description: The dispute game factory allows the creation of dispute games, used to propose state roots and eventually challenge them.
      sourceHashes.1:
-        "0x7f307d6191215a72b6c24c01b3c2fc87c84f7fb346790132e58736caa2d1dd14"
+        "0x85ca17941ef36ac6b28a4f8f89803d0d41ef419c47586dcd3acdb47ee9617285"
      values.$implementation:
-        "eth:0xc641A33cab81C559F2bd4b21EA34C290E2440C2B"
+        "eth:0x4bbA758F006Ef09402eF31724203F316ab74e4a0"
      values.$pastUpgrades.1:
+        ["2025-07-23T17:04:59.000Z","0xc60a3166aa296b584f143a129ac53f156ee9946373ff5fb97b3785cc5fc092a2",["eth:0x4bbA758F006Ef09402eF31724203F316ab74e4a0"]]
      values.$upgradeCount:
-        1
+        2
      values.gameImpls.1:
-        "eth:0x2d4B822F8B74AdE7fcD5F740967f4dFcD2fef5e4"
+        "eth:0x667b7DA73DA7B2A75286378FF45637eEaE9B4793"
      values.version:
-        "1.0.0"
+        "1.0.1"
      implementationNames.eth:0xc641A33cab81C559F2bd4b21EA34C290E2440C2B:
-        "DisputeGameFactory"
      implementationNames.eth:0x4bbA758F006Ef09402eF31724203F316ab74e4a0:
+        "DisputeGameFactory"
    }
```

```diff
+   Status: CREATED
    contract AnchorStateRegistry (0x1AaA08d577cbC3da3b955DC1B7a281D7b8fE3372)
    +++ description: Contains the latest confirmed state root that can be used as a starting point in a dispute game.
```

```diff
+   Status: CREATED
    contract PreimageOracle (0x1fb8cdFc6831fc866Ed9C51aF8817Da5c287aDD3)
    +++ description: The PreimageOracle contract is used to load the required data from L1 for a dispute game.
```

```diff
+   Status: CREATED
    contract PermissionedDisputeGame (0x667b7DA73DA7B2A75286378FF45637eEaE9B4793)
    +++ description: Same as FaultDisputeGame, but only two permissioned addresses are designated as proposer and challenger.
```

```diff
+   Status: CREATED
    contract MIPS (0xF027F4A985560fb13324e943edf55ad6F1d15Dc1)
    +++ description: The MIPS contract is used to execute the final step of the dispute game which objectively determines the winner of the dispute.
```

## Source code changes

```diff
.../AnchorStateRegistry/AnchorStateRegistry.sol    |  270 ++-
 .../DelayedWETH/DelayedWETH.sol                    |  231 +--
 .../DisputeGameFactory/DisputeGameFactory.sol      |  240 +--
 .../L1CrossDomainMessenger.sol                     |  736 ++++++--
 .../L1ERC721Bridge/L1ERC721Bridge.sol              |  418 +++--
 .../L1StandardBridge/L1StandardBridge.sol          |  508 ++++--
 .../ethereum/{.flat@22966867 => .flat}/MIPS.sol    | 1922 ++++++++++++++------
 .../OptimismMintableERC20Factory.sol               |   30 +-
 .../OptimismPortal2/OptimismPortal2.sol            |  529 ++----
 .../PermissionedDisputeGame.sol                    |  267 ++-
 .../{.flat@22966867 => .flat}/PreimageOracle.sol   |  216 +--
 .../SuperchainConfig/SuperchainConfig.sol          |    8 +-
 .../SystemConfig/SystemConfig.sol                  | 1439 +--------------
 13 files changed, 3410 insertions(+), 3404 deletions(-)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22966867 (main branch discovery), not current.

```diff
    contract DisputeGameFactory (0xe06278351d120288eDfCB963F934113Ca3C21AFe) {
    +++ description: The dispute game factory allows the creation of dispute games, used to propose state roots and eventually challenge them.
      values.game1337:
+        "eth:0x0000000000000000000000000000000000000000"
    }
```

Generated with discovered.json: 0xcc3793504351cb584ce330874f8995ff7b6bac5e

# Diff at Mon, 21 Jul 2025 10:08:59 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@c89d5207a278197d1d4bfd60ac8e37852accba7c block: 22895938
- current block number: 22966867

## Description

MS two members added.

## Watched changes

```diff
    contract Katana yieldRecipient Mulsitig (0x67C912fF560951526BffDff66dFbD4DF8AE23756) {
    +++ description: None
      values.$members.0:
+        "eth:0x34d23C4fb6542B467cA8724bAD30AC811399b184"
      values.$members.1:
+        "eth:0x09f5F2592791208219A1F51e3855Be9419fF6bE4"
      values.multisigThreshold:
-        "2 of 5 (40%)"
+        "2 of 7 (29%)"
    }
```

Generated with discovered.json: 0xdd6f8c72b7d5f1d1507f9d3bf9b72685cface25c

# Diff at Mon, 14 Jul 2025 12:45:14 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@9f4300dad2f3d080cd56fa311d4a848556c74e72 block: 22895938
- current block number: 22895938

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22895938 (main branch discovery), not current.

```diff
    EOA  (0x000000000000000000000000000000000000dEaD) {
    +++ description: None
      address:
-        "0x000000000000000000000000000000000000dEaD"
+        "eth:0x000000000000000000000000000000000000dEaD"
    }
```

```diff
    EOA  (0x000d4411cdeb152378626B5C5E33fd5D6808939a) {
    +++ description: None
      address:
-        "0x000d4411cdeb152378626B5C5E33fd5D6808939a"
+        "eth:0x000d4411cdeb152378626B5C5E33fd5D6808939a"
    }
```

```diff
    EOA  (0x0A4857fD89ABfB7536a6D0Bd4400EF769E84Ec8b) {
    +++ description: None
      address:
-        "0x0A4857fD89ABfB7536a6D0Bd4400EF769E84Ec8b"
+        "eth:0x0A4857fD89ABfB7536a6D0Bd4400EF769E84Ec8b"
    }
```

```diff
    EOA  (0x0D61C8b6CA9669A36F351De3AE335e9689dd9C5b) {
    +++ description: None
      address:
-        "0x0D61C8b6CA9669A36F351De3AE335e9689dd9C5b"
+        "eth:0x0D61C8b6CA9669A36F351De3AE335e9689dd9C5b"
    }
```

```diff
    contract AggchainFEP (0x100d3ca4f97776A40A7D93dB4AbF0FEA34230666) {
    +++ description: The main system contract defining the katana Layer 2 logic. As this contract is based on the OP-Succinct L2OutputOracle, OP stack outputRoots (L2 state roots) are saved here.
      address:
-        "0x100d3ca4f97776A40A7D93dB4AbF0FEA34230666"
+        "eth:0x100d3ca4f97776A40A7D93dB4AbF0FEA34230666"
      values.$admin:
-        "0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2"
+        "eth:0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2"
      values.$implementation:
-        "0xe7FE45579D784DC83B0feD844A65f4cEEFDe5682"
+        "eth:0xe7FE45579D784DC83B0feD844A65f4cEEFDe5682"
      values.$pastUpgrades.0.2.0:
-        "0x18C45DD422f6587357a6d3b23307E75D42b2bc5B"
+        "eth:0x18C45DD422f6587357a6d3b23307E75D42b2bc5B"
      values.$pastUpgrades.1.2.0:
-        "0x18C45DD422f6587357a6d3b23307E75D42b2bc5B"
+        "eth:0x18C45DD422f6587357a6d3b23307E75D42b2bc5B"
      values.$pastUpgrades.2.2.0:
-        "0xe7FE45579D784DC83B0feD844A65f4cEEFDe5682"
+        "eth:0xe7FE45579D784DC83B0feD844A65f4cEEFDe5682"
      values.admin:
-        "0xa4000bDD2bB92ce6750b31F1eeda47Bd1cB8e6e4"
+        "eth:0xa4000bDD2bB92ce6750b31F1eeda47Bd1cB8e6e4"
      values.aggchainManager:
-        "0x4e981bAe8E3cd06Ca911ffFE5504B2653ac1C38a"
+        "eth:0x4e981bAe8E3cd06Ca911ffFE5504B2653ac1C38a"
      values.aggLayerGateway:
-        "0x046Bb8bb98Db4ceCbB2929542686B74b516274b3"
+        "eth:0x046Bb8bb98Db4ceCbB2929542686B74b516274b3"
      values.bridgeAddress:
-        "0x2a3DD3EB832aF982ec71669E178424b10Dca2EDe"
+        "eth:0x2a3DD3EB832aF982ec71669E178424b10Dca2EDe"
      values.forceBatchAddress:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.gasTokenAddress:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.globalExitRootManager:
-        "0x580bda1e7A0CFAe92Fa7F6c20A3794F169CE3CFb"
+        "eth:0x580bda1e7A0CFAe92Fa7F6c20A3794F169CE3CFb"
      values.optimisticModeManager:
-        "0x4e981bAe8E3cd06Ca911ffFE5504B2653ac1C38a"
+        "eth:0x4e981bAe8E3cd06Ca911ffFE5504B2653ac1C38a"
      values.pendingAdmin:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.pendingAggchainManager:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.pendingOptimisticModeManager:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.pendingVKeyManager:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.pol:
-        "0x455e53CBB86018Ac2B8092FdCd39d8444aFFC3F6"
+        "eth:0x455e53CBB86018Ac2B8092FdCd39d8444aFFC3F6"
      values.rollupManager:
-        "0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2"
+        "eth:0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2"
      values.trustedSequencer:
-        "0xC1E65a0cEbF95f56Cd8729f7e37CB33eD94d6439"
+        "eth:0xC1E65a0cEbF95f56Cd8729f7e37CB33eD94d6439"
      values.vKeyManager:
-        "0x4e981bAe8E3cd06Ca911ffFE5504B2653ac1C38a"
+        "eth:0x4e981bAe8E3cd06Ca911ffFE5504B2653ac1C38a"
      implementationNames.0x100d3ca4f97776A40A7D93dB4AbF0FEA34230666:
-        "PolygonTransparentProxy"
      implementationNames.0xe7FE45579D784DC83B0feD844A65f4cEEFDe5682:
-        "AggchainFEP"
      implementationNames.eth:0x100d3ca4f97776A40A7D93dB4AbF0FEA34230666:
+        "PolygonTransparentProxy"
      implementationNames.eth:0xe7FE45579D784DC83B0feD844A65f4cEEFDe5682:
+        "AggchainFEP"
    }
```

```diff
    contract ProxyAdmin (0x14Be6579A41342ca6B402ec85E7be538e6Ade951) {
    +++ description: None
      address:
-        "0x14Be6579A41342ca6B402ec85E7be538e6Ade951"
+        "eth:0x14Be6579A41342ca6B402ec85E7be538e6Ade951"
      values.owner:
-        "0x2De242e27386e224E5fbF110EA8406d5B70740ec"
+        "eth:0x2De242e27386e224E5fbF110EA8406d5B70740ec"
      implementationNames.0x14Be6579A41342ca6B402ec85E7be538e6Ade951:
-        "ProxyAdmin"
      implementationNames.eth:0x14Be6579A41342ca6B402ec85E7be538e6Ade951:
+        "ProxyAdmin"
    }
```

```diff
    contract L1ERC721Bridge (0x15a32FCeA89617Ff450F094cDE102CCa46598B7F) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      address:
-        "0x15a32FCeA89617Ff450F094cDE102CCa46598B7F"
+        "eth:0x15a32FCeA89617Ff450F094cDE102CCa46598B7F"
      values.$admin:
-        "0x19DbD16f0a8e706D817B7e3b7bcF72917Ebb8832"
+        "eth:0x19DbD16f0a8e706D817B7e3b7bcF72917Ebb8832"
      values.$implementation:
-        "0xAE2AF01232a6c4a4d3012C5eC5b1b35059caF10d"
+        "eth:0xAE2AF01232a6c4a4d3012C5eC5b1b35059caF10d"
      values.$pastUpgrades.0.2.0:
-        "0xAE2AF01232a6c4a4d3012C5eC5b1b35059caF10d"
+        "eth:0xAE2AF01232a6c4a4d3012C5eC5b1b35059caF10d"
      values.messenger:
-        "0x2008A6Ba8CAF85AaFAe7880664Dfe681D533ac2E"
+        "eth:0x2008A6Ba8CAF85AaFAe7880664Dfe681D533ac2E"
      values.MESSENGER:
-        "0x2008A6Ba8CAF85AaFAe7880664Dfe681D533ac2E"
+        "eth:0x2008A6Ba8CAF85AaFAe7880664Dfe681D533ac2E"
      values.OTHER_BRIDGE:
-        "0x4200000000000000000000000000000000000014"
+        "eth:0x4200000000000000000000000000000000000014"
      values.otherBridge:
-        "0x4200000000000000000000000000000000000014"
+        "eth:0x4200000000000000000000000000000000000014"
      values.superchainConfig:
-        "0x2F439B95fa789C5d3a5C99cc70EB3ee83D08a811"
+        "eth:0x2F439B95fa789C5d3a5C99cc70EB3ee83D08a811"
      implementationNames.0x15a32FCeA89617Ff450F094cDE102CCa46598B7F:
-        "Proxy"
      implementationNames.0xAE2AF01232a6c4a4d3012C5eC5b1b35059caF10d:
-        "L1ERC721Bridge"
      implementationNames.eth:0x15a32FCeA89617Ff450F094cDE102CCa46598B7F:
+        "Proxy"
      implementationNames.eth:0xAE2AF01232a6c4a4d3012C5eC5b1b35059caF10d:
+        "L1ERC721Bridge"
    }
```

```diff
    contract Yearn Strategist Multisig (0x16388463d60FFE0661Cf7F1f31a7D658aC790ff7) {
    +++ description: None
      address:
-        "0x16388463d60FFE0661Cf7F1f31a7D658aC790ff7"
+        "eth:0x16388463d60FFE0661Cf7F1f31a7D658aC790ff7"
      values.$implementation:
-        "0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
+        "eth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
      values.$members.0:
-        "0xB13C8f58a233607569D2F8411B912148aeC4aEe2"
+        "eth:0xB13C8f58a233607569D2F8411B912148aeC4aEe2"
      values.$members.1:
-        "0xBD5f1429Ab467E69BEeba51E547C00A21F2a2092"
+        "eth:0xBD5f1429Ab467E69BEeba51E547C00A21F2a2092"
      values.$members.2:
-        "0x787aba336583f4A1D4f8cBBFDFFD49f3a38De665"
+        "eth:0x787aba336583f4A1D4f8cBBFDFFD49f3a38De665"
      values.$members.3:
-        "0x2C2dc95F8C8060a7e3B354c1B9540881AEa1613C"
+        "eth:0x2C2dc95F8C8060a7e3B354c1B9540881AEa1613C"
      values.$members.4:
-        "0xd0002c648CCa8DeE2f2b8D70D542Ccde8ad6EC03"
+        "eth:0xd0002c648CCa8DeE2f2b8D70D542Ccde8ad6EC03"
      values.$members.5:
-        "0x1b5f15DCb82d25f91c65b53CEe151E8b9fBdD271"
+        "eth:0x1b5f15DCb82d25f91c65b53CEe151E8b9fBdD271"
      values.$members.6:
-        "0x254f44F45ac892730e511f143DEd3Cd920b075aF"
+        "eth:0x254f44F45ac892730e511f143DEd3Cd920b075aF"
      implementationNames.0x16388463d60FFE0661Cf7F1f31a7D658aC790ff7:
-        "Proxy"
      implementationNames.0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
-        "GnosisSafe"
      implementationNames.eth:0x16388463d60FFE0661Cf7F1f31a7D658aC790ff7:
+        "Proxy"
      implementationNames.eth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
+        "GnosisSafe"
    }
```

```diff
    contract ProxyAdmin (0x19DbD16f0a8e706D817B7e3b7bcF72917Ebb8832) {
    +++ description: None
      address:
-        "0x19DbD16f0a8e706D817B7e3b7bcF72917Ebb8832"
+        "eth:0x19DbD16f0a8e706D817B7e3b7bcF72917Ebb8832"
      values.addressManager:
-        "0xEaB94275eD336D80d4F46EA8Ea0427e351f11D65"
+        "eth:0xEaB94275eD336D80d4F46EA8Ea0427e351f11D65"
      values.owner:
-        "0x4e981bAe8E3cd06Ca911ffFE5504B2653ac1C38a"
+        "eth:0x4e981bAe8E3cd06Ca911ffFE5504B2653ac1C38a"
      implementationNames.0x19DbD16f0a8e706D817B7e3b7bcF72917Ebb8832:
-        "ProxyAdmin"
      implementationNames.eth:0x19DbD16f0a8e706D817B7e3b7bcF72917Ebb8832:
+        "ProxyAdmin"
    }
```

```diff
    EOA  (0x1b5f15DCb82d25f91c65b53CEe151E8b9fBdD271) {
    +++ description: None
      address:
-        "0x1b5f15DCb82d25f91c65b53CEe151E8b9fBdD271"
+        "eth:0x1b5f15DCb82d25f91c65b53CEe151E8b9fBdD271"
    }
```

```diff
    EOA  (0x1DD6473a6bb5fF9041D945C7d15AC8fBc2Ee1164) {
    +++ description: None
      address:
-        "0x1DD6473a6bb5fF9041D945C7d15AC8fBc2Ee1164"
+        "eth:0x1DD6473a6bb5fF9041D945C7d15AC8fBc2Ee1164"
    }
```

```diff
    EOA  (0x1FFDA89C755f6D4Af069897D77CcAbb580Fd412a) {
    +++ description: None
      address:
-        "0x1FFDA89C755f6D4Af069897D77CcAbb580Fd412a"
+        "eth:0x1FFDA89C755f6D4Af069897D77CcAbb580Fd412a"
    }
```

```diff
    contract L1CrossDomainMessenger (0x2008A6Ba8CAF85AaFAe7880664Dfe681D533ac2E) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      address:
-        "0x2008A6Ba8CAF85AaFAe7880664Dfe681D533ac2E"
+        "eth:0x2008A6Ba8CAF85AaFAe7880664Dfe681D533ac2E"
      values.$admin:
-        "0x19DbD16f0a8e706D817B7e3b7bcF72917Ebb8832"
+        "eth:0x19DbD16f0a8e706D817B7e3b7bcF72917Ebb8832"
      values.$implementation:
-        "0xD3494713A5cfaD3F5359379DfA074E2Ac8C6Fd65"
+        "eth:0xD3494713A5cfaD3F5359379DfA074E2Ac8C6Fd65"
      values.$pastUpgrades.0.2.0:
-        "0xD3494713A5cfaD3F5359379DfA074E2Ac8C6Fd65"
+        "eth:0xD3494713A5cfaD3F5359379DfA074E2Ac8C6Fd65"
      values.OTHER_MESSENGER:
-        "0x4200000000000000000000000000000000000007"
+        "eth:0x4200000000000000000000000000000000000007"
      values.otherMessenger:
-        "0x4200000000000000000000000000000000000007"
+        "eth:0x4200000000000000000000000000000000000007"
      values.portal:
-        "0x250D30c523104bf0a06825e7eAdE4Dc46EdfE40E"
+        "eth:0x250D30c523104bf0a06825e7eAdE4Dc46EdfE40E"
      values.PORTAL:
-        "0x250D30c523104bf0a06825e7eAdE4Dc46EdfE40E"
+        "eth:0x250D30c523104bf0a06825e7eAdE4Dc46EdfE40E"
      values.ResolvedDelegateProxy_addressManager:
-        "0xEaB94275eD336D80d4F46EA8Ea0427e351f11D65"
+        "eth:0xEaB94275eD336D80d4F46EA8Ea0427e351f11D65"
      values.superchainConfig:
-        "0x2F439B95fa789C5d3a5C99cc70EB3ee83D08a811"
+        "eth:0x2F439B95fa789C5d3a5C99cc70EB3ee83D08a811"
      implementationNames.0x2008A6Ba8CAF85AaFAe7880664Dfe681D533ac2E:
-        "ResolvedDelegateProxy"
      implementationNames.0xD3494713A5cfaD3F5359379DfA074E2Ac8C6Fd65:
-        "L1CrossDomainMessenger"
      implementationNames.eth:0x2008A6Ba8CAF85AaFAe7880664Dfe681D533ac2E:
+        "ResolvedDelegateProxy"
      implementationNames.eth:0xD3494713A5cfaD3F5359379DfA074E2Ac8C6Fd65:
+        "L1CrossDomainMessenger"
    }
```

```diff
    EOA  (0x227D9Ea843910Edd305c42e7bB9Ce6D9f369238c) {
    +++ description: None
      address:
-        "0x227D9Ea843910Edd305c42e7bB9Ce6D9f369238c"
+        "eth:0x227D9Ea843910Edd305c42e7bB9Ce6D9f369238c"
    }
```

```diff
    contract OptimismPortal2 (0x250D30c523104bf0a06825e7eAdE4Dc46EdfE40E) {
    +++ description: The OptimismPortal contract usually is the main entry point to deposit funds from L1 to L2 or for finalizing withdrawals. It specifies which game type can be used for withdrawals, which currently is the PermissionedDisputeGame. This specific fork of the standard contract **disables the depositTransaction() function**, which prevents users from sending or forcing any transactions from L1 to L2, including token deposits. It is instead used for configuration and administration of the system.
      address:
-        "0x250D30c523104bf0a06825e7eAdE4Dc46EdfE40E"
+        "eth:0x250D30c523104bf0a06825e7eAdE4Dc46EdfE40E"
      values.$admin:
-        "0x19DbD16f0a8e706D817B7e3b7bcF72917Ebb8832"
+        "eth:0x19DbD16f0a8e706D817B7e3b7bcF72917Ebb8832"
      values.$implementation:
-        "0x9a6C2Dcc7e523f87716e17Ba36D10CCfFA0A60bb"
+        "eth:0x9a6C2Dcc7e523f87716e17Ba36D10CCfFA0A60bb"
      values.$pastUpgrades.0.2.0:
-        "0xe2F826324b2faf99E513D16D266c3F80aE87832B"
+        "eth:0xe2F826324b2faf99E513D16D266c3F80aE87832B"
      values.$pastUpgrades.1.2.0:
-        "0x9a6C2Dcc7e523f87716e17Ba36D10CCfFA0A60bb"
+        "eth:0x9a6C2Dcc7e523f87716e17Ba36D10CCfFA0A60bb"
      values.disputeGameFactory:
-        "0xe06278351d120288eDfCB963F934113Ca3C21AFe"
+        "eth:0xe06278351d120288eDfCB963F934113Ca3C21AFe"
      values.guardian:
-        "0x4e981bAe8E3cd06Ca911ffFE5504B2653ac1C38a"
+        "eth:0x4e981bAe8E3cd06Ca911ffFE5504B2653ac1C38a"
      values.l2Sender:
-        "0x000000000000000000000000000000000000dEaD"
+        "eth:0x000000000000000000000000000000000000dEaD"
      values.superchainConfig:
-        "0x2F439B95fa789C5d3a5C99cc70EB3ee83D08a811"
+        "eth:0x2F439B95fa789C5d3a5C99cc70EB3ee83D08a811"
      values.systemConfig:
-        "0xb6e1f8B589A14B79DDD3aD7F0589AB548c70C174"
+        "eth:0xb6e1f8B589A14B79DDD3aD7F0589AB548c70C174"
      implementationNames.0x250D30c523104bf0a06825e7eAdE4Dc46EdfE40E:
-        "Proxy"
      implementationNames.0x9a6C2Dcc7e523f87716e17Ba36D10CCfFA0A60bb:
-        "OptimismPortal2"
      implementationNames.eth:0x250D30c523104bf0a06825e7eAdE4Dc46EdfE40E:
+        "Proxy"
      implementationNames.eth:0x9a6C2Dcc7e523f87716e17Ba36D10CCfFA0A60bb:
+        "OptimismPortal2"
    }
```

```diff
    EOA  (0x254f44F45ac892730e511f143DEd3Cd920b075aF) {
    +++ description: None
      address:
-        "0x254f44F45ac892730e511f143DEd3Cd920b075aF"
+        "eth:0x254f44F45ac892730e511f143DEd3Cd920b075aF"
    }
```

```diff
    contract ProxyAdmin (0x263b251D67BB154DD6b8352539466ACE7948ED56) {
    +++ description: None
      address:
-        "0x263b251D67BB154DD6b8352539466ACE7948ED56"
+        "eth:0x263b251D67BB154DD6b8352539466ACE7948ED56"
      values.owner:
-        "0x9d851f8b8751c5FbC09b9E74E6e68E9950949052"
+        "eth:0x9d851f8b8751c5FbC09b9E74E6e68E9950949052"
      implementationNames.0x263b251D67BB154DD6b8352539466ACE7948ED56:
-        "ProxyAdmin"
      implementationNames.eth:0x263b251D67BB154DD6b8352539466ACE7948ED56:
+        "ProxyAdmin"
    }
```

```diff
    contract vbWBTC (0x2C24B57e2CCd1f273045Af6A5f632504C432374F) {
    +++ description: This token contract uses a standard 'vault bridge token' implementation created by Agglayer CDK. It keeps deposited assets in a vault and issues an IOU token (Vault Bridge WBTC) which can be deposited to Agglayer. The underlying asset is generating yield, which does not accrue to the vbWBTC-IOU but is sent to eth:0x67C912fF560951526BffDff66dFbD4DF8AE23756.
      address:
-        "0x2C24B57e2CCd1f273045Af6A5f632504C432374F"
+        "eth:0x2C24B57e2CCd1f273045Af6A5f632504C432374F"
      description:
-        "This token contract uses a standard 'vault bridge token' implementation created by Agglayer CDK. It keeps deposited assets in a vault and issues an IOU token (Vault Bridge WBTC) which can be deposited to Agglayer. The underlying asset is generating yield, which does not accrue to the vbWBTC-IOU but is sent to 0x67C912fF560951526BffDff66dFbD4DF8AE23756."
+        "This token contract uses a standard 'vault bridge token' implementation created by Agglayer CDK. It keeps deposited assets in a vault and issues an IOU token (Vault Bridge WBTC) which can be deposited to Agglayer. The underlying asset is generating yield, which does not accrue to the vbWBTC-IOU but is sent to eth:0x67C912fF560951526BffDff66dFbD4DF8AE23756."
      values.$admin:
-        "0x420693B32113a0e00Eb9f3315D5D5ec3b32C2d69"
+        "eth:0x420693B32113a0e00Eb9f3315D5D5ec3b32C2d69"
      values.$implementation:
-        "0xcC865B0324121b43728176024f58bdbB3afd6f29"
+        "eth:0xcC865B0324121b43728176024f58bdbB3afd6f29"
      values.$pastUpgrades.0.2.0:
-        "0xcC865B0324121b43728176024f58bdbB3afd6f29"
+        "eth:0xcC865B0324121b43728176024f58bdbB3afd6f29"
      values.accessControl.DEFAULT_ADMIN_ROLE.members.0:
-        "0x2De242e27386e224E5fbF110EA8406d5B70740ec"
+        "eth:0x2De242e27386e224E5fbF110EA8406d5B70740ec"
      values.accessControl.REBALANCER_ROLE.members.0:
-        "0x2De242e27386e224E5fbF110EA8406d5B70740ec"
+        "eth:0x2De242e27386e224E5fbF110EA8406d5B70740ec"
      values.accessControl.YIELD_COLLECTOR_ROLE.members.0:
-        "0x2De242e27386e224E5fbF110EA8406d5B70740ec"
+        "eth:0x2De242e27386e224E5fbF110EA8406d5B70740ec"
      values.accessControl.YIELD_COLLECTOR_ROLE.members.1:
-        "0xcB1e45481461aeF38E6B0a34F1444E9C5D647645"
+        "eth:0xcB1e45481461aeF38E6B0a34F1444E9C5D647645"
      values.accessControl.PAUSER_ROLE.members.0:
-        "0x2De242e27386e224E5fbF110EA8406d5B70740ec"
+        "eth:0x2De242e27386e224E5fbF110EA8406d5B70740ec"
      values.asset:
-        "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599"
+        "eth:0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599"
      values.eip712Domain.verifyingContract:
-        "0x2C24B57e2CCd1f273045Af6A5f632504C432374F"
+        "eth:0x2C24B57e2CCd1f273045Af6A5f632504C432374F"
      values.lxlyBridge:
-        "0x2a3DD3EB832aF982ec71669E178424b10Dca2EDe"
+        "eth:0x2a3DD3EB832aF982ec71669E178424b10Dca2EDe"
      values.migrationManager:
-        "0x417d01B64Ea30C4E163873f3a1f77b727c689e02"
+        "eth:0x417d01B64Ea30C4E163873f3a1f77b727c689e02"
      values.underlyingToken:
-        "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599"
+        "eth:0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599"
      implementationNames.0x2C24B57e2CCd1f273045Af6A5f632504C432374F:
-        "TransparentUpgradeableProxy"
      implementationNames.0xcC865B0324121b43728176024f58bdbB3afd6f29:
-        "GenericVaultBridgeToken"
      implementationNames.eth:0x2C24B57e2CCd1f273045Af6A5f632504C432374F:
+        "TransparentUpgradeableProxy"
      implementationNames.eth:0xcC865B0324121b43728176024f58bdbB3afd6f29:
+        "GenericVaultBridgeToken"
    }
```

```diff
    EOA  (0x2C2dc95F8C8060a7e3B354c1B9540881AEa1613C) {
    +++ description: None
      address:
-        "0x2C2dc95F8C8060a7e3B354c1B9540881AEa1613C"
+        "eth:0x2C2dc95F8C8060a7e3B354c1B9540881AEa1613C"
    }
```

```diff
    contract PermissionedDisputeGame (0x2d4B822F8B74AdE7fcD5F740967f4dFcD2fef5e4) {
    +++ description: Same as FaultDisputeGame, but only two permissioned addresses are designated as proposer and challenger.
      address:
-        "0x2d4B822F8B74AdE7fcD5F740967f4dFcD2fef5e4"
+        "eth:0x2d4B822F8B74AdE7fcD5F740967f4dFcD2fef5e4"
      values.anchorStateRegistry:
-        "0x79ecD8d8040496014bcD3bA16AdF3914b23f8Fd5"
+        "eth:0x79ecD8d8040496014bcD3bA16AdF3914b23f8Fd5"
      values.challenger:
-        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
+        "eth:0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      values.gameCreator:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.l2BlockNumberChallenger:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.proposer:
-        "0x4A6f5889409Bf4Bf3Bff0Fef585D7A29FdA64258"
+        "eth:0x4A6f5889409Bf4Bf3Bff0Fef585D7A29FdA64258"
      values.vm:
-        "0x5fE03a12C1236F9C22Cb6479778DDAa4bce6299C"
+        "eth:0x5fE03a12C1236F9C22Cb6479778DDAa4bce6299C"
      values.weth:
-        "0x74034597d29613CC8C0BDc8780e1d292A553Bd32"
+        "eth:0x74034597d29613CC8C0BDc8780e1d292A553Bd32"
      implementationNames.0x2d4B822F8B74AdE7fcD5F740967f4dFcD2fef5e4:
-        "PermissionedDisputeGame"
      implementationNames.eth:0x2d4B822F8B74AdE7fcD5F740967f4dFcD2fef5e4:
+        "PermissionedDisputeGame"
    }
```

```diff
    contract vbETH (0x2DC70fb75b88d2eB4715bc06E1595E6D97c34DFF) {
    +++ description: This token contract uses a standard 'vault bridge token' implementation created by Agglayer CDK. It keeps deposited assets in a vault and issues an IOU token (Vault Bridge ETH) which can be deposited to Agglayer. The underlying asset is generating yield, which does not accrue to the vbETH-IOU but is sent to eth:0x67C912fF560951526BffDff66dFbD4DF8AE23756.
      address:
-        "0x2DC70fb75b88d2eB4715bc06E1595E6D97c34DFF"
+        "eth:0x2DC70fb75b88d2eB4715bc06E1595E6D97c34DFF"
      description:
-        "This token contract uses a standard 'vault bridge token' implementation created by Agglayer CDK. It keeps deposited assets in a vault and issues an IOU token (Vault Bridge ETH) which can be deposited to Agglayer. The underlying asset is generating yield, which does not accrue to the vbETH-IOU but is sent to 0x67C912fF560951526BffDff66dFbD4DF8AE23756."
+        "This token contract uses a standard 'vault bridge token' implementation created by Agglayer CDK. It keeps deposited assets in a vault and issues an IOU token (Vault Bridge ETH) which can be deposited to Agglayer. The underlying asset is generating yield, which does not accrue to the vbETH-IOU but is sent to eth:0x67C912fF560951526BffDff66dFbD4DF8AE23756."
      values.$admin:
-        "0x14Be6579A41342ca6B402ec85E7be538e6Ade951"
+        "eth:0x14Be6579A41342ca6B402ec85E7be538e6Ade951"
      values.$implementation:
-        "0x81c16F89222C32806Daf01f5129937dFE19D525e"
+        "eth:0x81c16F89222C32806Daf01f5129937dFE19D525e"
      values.$pastUpgrades.0.2.0:
-        "0x81c16F89222C32806Daf01f5129937dFE19D525e"
+        "eth:0x81c16F89222C32806Daf01f5129937dFE19D525e"
      values.accessControl.DEFAULT_ADMIN_ROLE.members.0:
-        "0x2De242e27386e224E5fbF110EA8406d5B70740ec"
+        "eth:0x2De242e27386e224E5fbF110EA8406d5B70740ec"
      values.accessControl.REBALANCER_ROLE.members.0:
-        "0x2De242e27386e224E5fbF110EA8406d5B70740ec"
+        "eth:0x2De242e27386e224E5fbF110EA8406d5B70740ec"
      values.accessControl.YIELD_COLLECTOR_ROLE.members.0:
-        "0x2De242e27386e224E5fbF110EA8406d5B70740ec"
+        "eth:0x2De242e27386e224E5fbF110EA8406d5B70740ec"
      values.accessControl.YIELD_COLLECTOR_ROLE.members.1:
-        "0xcB1e45481461aeF38E6B0a34F1444E9C5D647645"
+        "eth:0xcB1e45481461aeF38E6B0a34F1444E9C5D647645"
      values.accessControl.PAUSER_ROLE.members.0:
-        "0x2De242e27386e224E5fbF110EA8406d5B70740ec"
+        "eth:0x2De242e27386e224E5fbF110EA8406d5B70740ec"
      values.asset:
-        "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
+        "eth:0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
      values.eip712Domain.verifyingContract:
-        "0x2DC70fb75b88d2eB4715bc06E1595E6D97c34DFF"
+        "eth:0x2DC70fb75b88d2eB4715bc06E1595E6D97c34DFF"
      values.lxlyBridge:
-        "0x2a3DD3EB832aF982ec71669E178424b10Dca2EDe"
+        "eth:0x2a3DD3EB832aF982ec71669E178424b10Dca2EDe"
      values.migrationManager:
-        "0x417d01B64Ea30C4E163873f3a1f77b727c689e02"
+        "eth:0x417d01B64Ea30C4E163873f3a1f77b727c689e02"
      values.underlyingToken:
-        "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
+        "eth:0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
      implementationNames.0x2DC70fb75b88d2eB4715bc06E1595E6D97c34DFF:
-        "TransparentUpgradeableProxy"
      implementationNames.0x81c16F89222C32806Daf01f5129937dFE19D525e:
-        "VbETH"
      implementationNames.eth:0x2DC70fb75b88d2eB4715bc06E1595E6D97c34DFF:
+        "TransparentUpgradeableProxy"
      implementationNames.eth:0x81c16F89222C32806Daf01f5129937dFE19D525e:
+        "VbETH"
    }
```

```diff
    contract Katana vaultBridge Multisig 1 (0x2De242e27386e224E5fbF110EA8406d5B70740ec) {
    +++ description: None
      address:
-        "0x2De242e27386e224E5fbF110EA8406d5B70740ec"
+        "eth:0x2De242e27386e224E5fbF110EA8406d5B70740ec"
      values.$implementation:
-        "0x41675C099F32341bf84BFc5382aF534df5C7461a"
+        "eth:0x41675C099F32341bf84BFc5382aF534df5C7461a"
      values.$members.0:
-        "0x4082A1D91A353b16e112FbE36b55d222bF417919"
+        "eth:0x4082A1D91A353b16e112FbE36b55d222bF417919"
      values.$members.1:
-        "0x9d851f8b8751c5FbC09b9E74E6e68E9950949052"
+        "eth:0x9d851f8b8751c5FbC09b9E74E6e68E9950949052"
      values.$members.2:
-        "0xd0673F989bc3BA9314d0AAF28BfC84e99B7898CC"
+        "eth:0xd0673F989bc3BA9314d0AAF28BfC84e99B7898CC"
      implementationNames.0x2De242e27386e224E5fbF110EA8406d5B70740ec:
-        "SafeProxy"
      implementationNames.0x41675C099F32341bf84BFc5382aF534df5C7461a:
-        "Safe"
      implementationNames.eth:0x2De242e27386e224E5fbF110EA8406d5B70740ec:
+        "SafeProxy"
      implementationNames.eth:0x41675C099F32341bf84BFc5382aF534df5C7461a:
+        "Safe"
    }
```

```diff
    contract SuperchainConfig (0x2F439B95fa789C5d3a5C99cc70EB3ee83D08a811) {
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      address:
-        "0x2F439B95fa789C5d3a5C99cc70EB3ee83D08a811"
+        "eth:0x2F439B95fa789C5d3a5C99cc70EB3ee83D08a811"
      values.$admin:
-        "0x6d0ff67fb427422AfF35EEa8596949B374b09a52"
+        "eth:0x6d0ff67fb427422AfF35EEa8596949B374b09a52"
      values.$implementation:
-        "0x838897A86Cb4F130D0eFC1203d7dA6D0db4bEd1A"
+        "eth:0x838897A86Cb4F130D0eFC1203d7dA6D0db4bEd1A"
      values.$pastUpgrades.0.2.0:
-        "0x838897A86Cb4F130D0eFC1203d7dA6D0db4bEd1A"
+        "eth:0x838897A86Cb4F130D0eFC1203d7dA6D0db4bEd1A"
      values.$pastUpgrades.1.2.0:
-        "0xd81f43eDBCAcb4c29a9bA38a13Ee5d79278270cC"
+        "eth:0xd81f43eDBCAcb4c29a9bA38a13Ee5d79278270cC"
      values.$pastUpgrades.2.2.0:
-        "0x838897A86Cb4F130D0eFC1203d7dA6D0db4bEd1A"
+        "eth:0x838897A86Cb4F130D0eFC1203d7dA6D0db4bEd1A"
      values.guardian:
-        "0x4e981bAe8E3cd06Ca911ffFE5504B2653ac1C38a"
+        "eth:0x4e981bAe8E3cd06Ca911ffFE5504B2653ac1C38a"
      implementationNames.0x2F439B95fa789C5d3a5C99cc70EB3ee83D08a811:
-        "Proxy"
      implementationNames.0x838897A86Cb4F130D0eFC1203d7dA6D0db4bEd1A:
-        "SuperchainConfig"
      implementationNames.eth:0x2F439B95fa789C5d3a5C99cc70EB3ee83D08a811:
+        "Proxy"
      implementationNames.eth:0x838897A86Cb4F130D0eFC1203d7dA6D0db4bEd1A:
+        "SuperchainConfig"
    }
```

```diff
    contract ProxyAdmin (0x377a9e5df2882DC1DF8A0bD162cbc640eA634010) {
    +++ description: None
      address:
-        "0x377a9e5df2882DC1DF8A0bD162cbc640eA634010"
+        "eth:0x377a9e5df2882DC1DF8A0bD162cbc640eA634010"
      values.owner:
-        "0x2De242e27386e224E5fbF110EA8406d5B70740ec"
+        "eth:0x2De242e27386e224E5fbF110EA8406d5B70740ec"
      implementationNames.0x377a9e5df2882DC1DF8A0bD162cbc640eA634010:
-        "ProxyAdmin"
      implementationNames.eth:0x377a9e5df2882DC1DF8A0bD162cbc640eA634010:
+        "ProxyAdmin"
    }
```

```diff
    EOA  (0x3840f487A17A41100DD1Bf0946c34f132a57Fd5f) {
    +++ description: None
      address:
-        "0x3840f487A17A41100DD1Bf0946c34f132a57Fd5f"
+        "eth:0x3840f487A17A41100DD1Bf0946c34f132a57Fd5f"
    }
```

```diff
    EOA  (0x387Cde8598E1CBb297FDc5bAEbA5E5c5c2735344) {
    +++ description: None
      address:
-        "0x387Cde8598E1CBb297FDc5bAEbA5E5c5c2735344"
+        "eth:0x387Cde8598E1CBb297FDc5bAEbA5E5c5c2735344"
    }
```

```diff
    contract vbUSDS (0x3DD459dE96F9C28e3a343b831cbDC2B93c8C4855) {
    +++ description: This token contract uses a standard 'vault bridge token' implementation created by Agglayer CDK. It keeps deposited assets in a vault and issues an IOU token (Vault Bridge USDS) which can be deposited to Agglayer. The underlying asset is generating yield, which does not accrue to the vbUSDS-IOU but is sent to eth:0x67C912fF560951526BffDff66dFbD4DF8AE23756.
      address:
-        "0x3DD459dE96F9C28e3a343b831cbDC2B93c8C4855"
+        "eth:0x3DD459dE96F9C28e3a343b831cbDC2B93c8C4855"
      description:
-        "This token contract uses a standard 'vault bridge token' implementation created by Agglayer CDK. It keeps deposited assets in a vault and issues an IOU token (Vault Bridge USDS) which can be deposited to Agglayer. The underlying asset is generating yield, which does not accrue to the vbUSDS-IOU but is sent to 0x67C912fF560951526BffDff66dFbD4DF8AE23756."
+        "This token contract uses a standard 'vault bridge token' implementation created by Agglayer CDK. It keeps deposited assets in a vault and issues an IOU token (Vault Bridge USDS) which can be deposited to Agglayer. The underlying asset is generating yield, which does not accrue to the vbUSDS-IOU but is sent to eth:0x67C912fF560951526BffDff66dFbD4DF8AE23756."
      values.$admin:
-        "0xD1e389c046FB734D2a0c7C390312210c408ba832"
+        "eth:0xD1e389c046FB734D2a0c7C390312210c408ba832"
      values.$implementation:
-        "0xcC865B0324121b43728176024f58bdbB3afd6f29"
+        "eth:0xcC865B0324121b43728176024f58bdbB3afd6f29"
      values.$pastUpgrades.0.2.0:
-        "0xcC865B0324121b43728176024f58bdbB3afd6f29"
+        "eth:0xcC865B0324121b43728176024f58bdbB3afd6f29"
      values.accessControl.DEFAULT_ADMIN_ROLE.members.0:
-        "0xA8C31B2edd84c654d06d626383f4154D1E40C5Ff"
+        "eth:0xA8C31B2edd84c654d06d626383f4154D1E40C5Ff"
      values.accessControl.REBALANCER_ROLE.members.0:
-        "0xA8C31B2edd84c654d06d626383f4154D1E40C5Ff"
+        "eth:0xA8C31B2edd84c654d06d626383f4154D1E40C5Ff"
      values.accessControl.YIELD_COLLECTOR_ROLE.members.0:
-        "0xA8C31B2edd84c654d06d626383f4154D1E40C5Ff"
+        "eth:0xA8C31B2edd84c654d06d626383f4154D1E40C5Ff"
      values.accessControl.YIELD_COLLECTOR_ROLE.members.1:
-        "0xcB1e45481461aeF38E6B0a34F1444E9C5D647645"
+        "eth:0xcB1e45481461aeF38E6B0a34F1444E9C5D647645"
      values.accessControl.PAUSER_ROLE.members.0:
-        "0xA8C31B2edd84c654d06d626383f4154D1E40C5Ff"
+        "eth:0xA8C31B2edd84c654d06d626383f4154D1E40C5Ff"
      values.asset:
-        "0xdC035D45d973E3EC169d2276DDab16f1e407384F"
+        "eth:0xdC035D45d973E3EC169d2276DDab16f1e407384F"
      values.eip712Domain.verifyingContract:
-        "0x3DD459dE96F9C28e3a343b831cbDC2B93c8C4855"
+        "eth:0x3DD459dE96F9C28e3a343b831cbDC2B93c8C4855"
      values.lxlyBridge:
-        "0x2a3DD3EB832aF982ec71669E178424b10Dca2EDe"
+        "eth:0x2a3DD3EB832aF982ec71669E178424b10Dca2EDe"
      values.migrationManager:
-        "0x417d01B64Ea30C4E163873f3a1f77b727c689e02"
+        "eth:0x417d01B64Ea30C4E163873f3a1f77b727c689e02"
      values.underlyingToken:
-        "0xdC035D45d973E3EC169d2276DDab16f1e407384F"
+        "eth:0xdC035D45d973E3EC169d2276DDab16f1e407384F"
      implementationNames.0x3DD459dE96F9C28e3a343b831cbDC2B93c8C4855:
-        "TransparentUpgradeableProxy"
      implementationNames.0xcC865B0324121b43728176024f58bdbB3afd6f29:
-        "GenericVaultBridgeToken"
      implementationNames.eth:0x3DD459dE96F9C28e3a343b831cbDC2B93c8C4855:
+        "TransparentUpgradeableProxy"
      implementationNames.eth:0xcC865B0324121b43728176024f58bdbB3afd6f29:
+        "GenericVaultBridgeToken"
    }
```

```diff
    EOA  (0x4082A1D91A353b16e112FbE36b55d222bF417919) {
    +++ description: None
      address:
-        "0x4082A1D91A353b16e112FbE36b55d222bF417919"
+        "eth:0x4082A1D91A353b16e112FbE36b55d222bF417919"
    }
```

```diff
    contract MigrationManager (0x417d01B64Ea30C4E163873f3a1f77b727c689e02) {
    +++ description: Helper contract for the vaultBridge tokens on Layer 2. If any vbTokens are minted 'natively' on Layer 2, this contract can receive the underlying assets and lock them in the Layer 1 vaults.
      address:
-        "0x417d01B64Ea30C4E163873f3a1f77b727c689e02"
+        "eth:0x417d01B64Ea30C4E163873f3a1f77b727c689e02"
      values.$admin:
-        "0x263b251D67BB154DD6b8352539466ACE7948ED56"
+        "eth:0x263b251D67BB154DD6b8352539466ACE7948ED56"
      values.$implementation:
-        "0xC6dD6399eAE419A0a33A8dc307f4c1dB26D30e45"
+        "eth:0xC6dD6399eAE419A0a33A8dc307f4c1dB26D30e45"
      values.$pastUpgrades.0.2.0:
-        "0xC6dD6399eAE419A0a33A8dc307f4c1dB26D30e45"
+        "eth:0xC6dD6399eAE419A0a33A8dc307f4c1dB26D30e45"
      values.accessControl.DEFAULT_ADMIN_ROLE.members.0:
-        "0x9d851f8b8751c5FbC09b9E74E6e68E9950949052"
+        "eth:0x9d851f8b8751c5FbC09b9E74E6e68E9950949052"
      values.accessControl.PAUSER_ROLE.members.0:
-        "0x9d851f8b8751c5FbC09b9E74E6e68E9950949052"
+        "eth:0x9d851f8b8751c5FbC09b9E74E6e68E9950949052"
      values.lxlyBridge:
-        "0x2a3DD3EB832aF982ec71669E178424b10Dca2EDe"
+        "eth:0x2a3DD3EB832aF982ec71669E178424b10Dca2EDe"
      implementationNames.0x417d01B64Ea30C4E163873f3a1f77b727c689e02:
-        "TransparentUpgradeableProxy"
      implementationNames.0xC6dD6399eAE419A0a33A8dc307f4c1dB26D30e45:
-        "MigrationManager"
      implementationNames.eth:0x417d01B64Ea30C4E163873f3a1f77b727c689e02:
+        "TransparentUpgradeableProxy"
      implementationNames.eth:0xC6dD6399eAE419A0a33A8dc307f4c1dB26D30e45:
+        "MigrationManager"
    }
```

```diff
    contract ProxyAdmin (0x420693B32113a0e00Eb9f3315D5D5ec3b32C2d69) {
    +++ description: None
      address:
-        "0x420693B32113a0e00Eb9f3315D5D5ec3b32C2d69"
+        "eth:0x420693B32113a0e00Eb9f3315D5D5ec3b32C2d69"
      values.owner:
-        "0x2De242e27386e224E5fbF110EA8406d5B70740ec"
+        "eth:0x2De242e27386e224E5fbF110EA8406d5B70740ec"
      implementationNames.0x420693B32113a0e00Eb9f3315D5D5ec3b32C2d69:
-        "ProxyAdmin"
      implementationNames.eth:0x420693B32113a0e00Eb9f3315D5D5ec3b32C2d69:
+        "ProxyAdmin"
    }
```

```diff
    EOA  (0x450A3A6AE85904cb4Aa0809Fb41E53B687a28397) {
    +++ description: None
      address:
-        "0x450A3A6AE85904cb4Aa0809Fb41E53B687a28397"
+        "eth:0x450A3A6AE85904cb4Aa0809Fb41E53B687a28397"
    }
```

```diff
    contract Conduit Multisig 1 (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      address:
-        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
+        "eth:0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      values.$implementation:
-        "0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
+        "eth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
      values.$members.0:
-        "0x81175155D85377C337d92f1FA52Da166C3A4E7Ac"
+        "eth:0x81175155D85377C337d92f1FA52Da166C3A4E7Ac"
      values.$members.1:
-        "0x860e06Fe384D1A3340111e7D142E02642178c053"
+        "eth:0x860e06Fe384D1A3340111e7D142E02642178c053"
      values.$members.2:
-        "0x50930d652266EF4127FA3A1906B7Cb9951076628"
+        "eth:0x50930d652266EF4127FA3A1906B7Cb9951076628"
      values.$members.3:
-        "0xA0737fea60F0601A192E3d2c98865A883ab0bda2"
+        "eth:0xA0737fea60F0601A192E3d2c98865A883ab0bda2"
      values.$members.4:
-        "0xF3313C48BD8E17b823d5498D62F37019dFEA647D"
+        "eth:0xF3313C48BD8E17b823d5498D62F37019dFEA647D"
      values.$members.5:
-        "0xF0B77EaE7F2dabCC2571c7418406A0dCA3afA4f0"
+        "eth:0xF0B77EaE7F2dabCC2571c7418406A0dCA3afA4f0"
      values.$members.6:
-        "0xa4000bDD2bB92ce6750b31F1eeda47Bd1cB8e6e4"
+        "eth:0xa4000bDD2bB92ce6750b31F1eeda47Bd1cB8e6e4"
      values.$members.7:
-        "0x3840f487A17A41100DD1Bf0946c34f132a57Fd5f"
+        "eth:0x3840f487A17A41100DD1Bf0946c34f132a57Fd5f"
      values.$members.8:
-        "0xa0C600a6e85bf225958FFAcC70B5FDDF9A059038"
+        "eth:0xa0C600a6e85bf225958FFAcC70B5FDDF9A059038"
      values.$members.9:
-        "0xefCf0c8faFB425997870f845e26fC6cA6EE6dD5C"
+        "eth:0xefCf0c8faFB425997870f845e26fC6cA6EE6dD5C"
      values.$members.10:
-        "0x4D8007a0E9f293e62E2b0F43C6Cf4C4B9e135BAe"
+        "eth:0x4D8007a0E9f293e62E2b0F43C6Cf4C4B9e135BAe"
      implementationNames.0x4a4962275DF8C60a80d3a25faEc5AA7De116A746:
-        "GnosisSafeProxy"
      implementationNames.0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
-        "GnosisSafe"
      implementationNames.eth:0x4a4962275DF8C60a80d3a25faEc5AA7De116A746:
+        "GnosisSafeProxy"
      implementationNames.eth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
+        "GnosisSafe"
    }
```

```diff
    EOA  (0x4A6f5889409Bf4Bf3Bff0Fef585D7A29FdA64258) {
    +++ description: None
      address:
-        "0x4A6f5889409Bf4Bf3Bff0Fef585D7A29FdA64258"
+        "eth:0x4A6f5889409Bf4Bf3Bff0Fef585D7A29FdA64258"
    }
```

```diff
    EOA  (0x4D8007a0E9f293e62E2b0F43C6Cf4C4B9e135BAe) {
    +++ description: None
      address:
-        "0x4D8007a0E9f293e62E2b0F43C6Cf4C4B9e135BAe"
+        "eth:0x4D8007a0E9f293e62E2b0F43C6Cf4C4B9e135BAe"
    }
```

```diff
    contract Katana Foundation Engineering/Security Multisig (0x4e981bAe8E3cd06Ca911ffFE5504B2653ac1C38a) {
    +++ description: None
      address:
-        "0x4e981bAe8E3cd06Ca911ffFE5504B2653ac1C38a"
+        "eth:0x4e981bAe8E3cd06Ca911ffFE5504B2653ac1C38a"
      values.$implementation:
-        "0x3E5c63644E683549055b9Be8653de26E0B4CD36E"
+        "eth:0x3E5c63644E683549055b9Be8653de26E0B4CD36E"
      values.$members.0:
-        "0x516eEcfb38aA308c5f1878497108c7d054fd46B7"
+        "eth:0x516eEcfb38aA308c5f1878497108c7d054fd46B7"
      values.$members.1:
-        "0xEad77b01ea770839F7f576Cd1516Ff6A298d9dB2"
+        "eth:0xEad77b01ea770839F7f576Cd1516Ff6A298d9dB2"
      values.$members.2:
-        "0x54c401eD03D086fE13221E5422165f3b024265d9"
+        "eth:0x54c401eD03D086fE13221E5422165f3b024265d9"
      values.$members.3:
-        "0xAb3506507449bF1880f3337825efd19ac89E235E"
+        "eth:0xAb3506507449bF1880f3337825efd19ac89E235E"
      values.$members.4:
-        "0xcAB31b6A7b4d2eCd562A09e2BfA46535a18862f9"
+        "eth:0xcAB31b6A7b4d2eCd562A09e2BfA46535a18862f9"
      implementationNames.0x4e981bAe8E3cd06Ca911ffFE5504B2653ac1C38a:
-        "GnosisSafeProxy"
      implementationNames.0x3E5c63644E683549055b9Be8653de26E0B4CD36E:
-        "GnosisSafeL2"
      implementationNames.eth:0x4e981bAe8E3cd06Ca911ffFE5504B2653ac1C38a:
+        "GnosisSafeProxy"
      implementationNames.eth:0x3E5c63644E683549055b9Be8653de26E0B4CD36E:
+        "GnosisSafeL2"
    }
```

```diff
    EOA  (0x50930d652266EF4127FA3A1906B7Cb9951076628) {
    +++ description: None
      address:
-        "0x50930d652266EF4127FA3A1906B7Cb9951076628"
+        "eth:0x50930d652266EF4127FA3A1906B7Cb9951076628"
    }
```

```diff
    contract vbUSDC (0x53E82ABbb12638F09d9e624578ccB666217a765e) {
    +++ description: This token contract uses a standard 'vault bridge token' implementation created by Agglayer CDK. It keeps deposited assets in a vault and issues an IOU token (Vault Bridge USDC) which can be deposited to Agglayer. The underlying asset is generating yield, which does not accrue to the vbUSDC-IOU but is sent to eth:0x67C912fF560951526BffDff66dFbD4DF8AE23756.
      address:
-        "0x53E82ABbb12638F09d9e624578ccB666217a765e"
+        "eth:0x53E82ABbb12638F09d9e624578ccB666217a765e"
      description:
-        "This token contract uses a standard 'vault bridge token' implementation created by Agglayer CDK. It keeps deposited assets in a vault and issues an IOU token (Vault Bridge USDC) which can be deposited to Agglayer. The underlying asset is generating yield, which does not accrue to the vbUSDC-IOU but is sent to 0x67C912fF560951526BffDff66dFbD4DF8AE23756."
+        "This token contract uses a standard 'vault bridge token' implementation created by Agglayer CDK. It keeps deposited assets in a vault and issues an IOU token (Vault Bridge USDC) which can be deposited to Agglayer. The underlying asset is generating yield, which does not accrue to the vbUSDC-IOU but is sent to eth:0x67C912fF560951526BffDff66dFbD4DF8AE23756."
      values.$admin:
-        "0x8970650CF3f1E57cA804C65B4DBcFf698789FE30"
+        "eth:0x8970650CF3f1E57cA804C65B4DBcFf698789FE30"
      values.$implementation:
-        "0xcC865B0324121b43728176024f58bdbB3afd6f29"
+        "eth:0xcC865B0324121b43728176024f58bdbB3afd6f29"
      values.$pastUpgrades.0.2.0:
-        "0xcC865B0324121b43728176024f58bdbB3afd6f29"
+        "eth:0xcC865B0324121b43728176024f58bdbB3afd6f29"
      values.accessControl.DEFAULT_ADMIN_ROLE.members.0:
-        "0xf4F2f5F6bAdBE05433C4604320ecC56BbECBC04E"
+        "eth:0xf4F2f5F6bAdBE05433C4604320ecC56BbECBC04E"
      values.accessControl.REBALANCER_ROLE.members.0:
-        "0xf4F2f5F6bAdBE05433C4604320ecC56BbECBC04E"
+        "eth:0xf4F2f5F6bAdBE05433C4604320ecC56BbECBC04E"
      values.accessControl.YIELD_COLLECTOR_ROLE.members.0:
-        "0xf4F2f5F6bAdBE05433C4604320ecC56BbECBC04E"
+        "eth:0xf4F2f5F6bAdBE05433C4604320ecC56BbECBC04E"
      values.accessControl.YIELD_COLLECTOR_ROLE.members.1:
-        "0xcB1e45481461aeF38E6B0a34F1444E9C5D647645"
+        "eth:0xcB1e45481461aeF38E6B0a34F1444E9C5D647645"
      values.accessControl.PAUSER_ROLE.members.0:
-        "0xf4F2f5F6bAdBE05433C4604320ecC56BbECBC04E"
+        "eth:0xf4F2f5F6bAdBE05433C4604320ecC56BbECBC04E"
      values.asset:
-        "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"
+        "eth:0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"
      values.eip712Domain.verifyingContract:
-        "0x53E82ABbb12638F09d9e624578ccB666217a765e"
+        "eth:0x53E82ABbb12638F09d9e624578ccB666217a765e"
      values.lxlyBridge:
-        "0x2a3DD3EB832aF982ec71669E178424b10Dca2EDe"
+        "eth:0x2a3DD3EB832aF982ec71669E178424b10Dca2EDe"
      values.migrationManager:
-        "0x417d01B64Ea30C4E163873f3a1f77b727c689e02"
+        "eth:0x417d01B64Ea30C4E163873f3a1f77b727c689e02"
      values.underlyingToken:
-        "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"
+        "eth:0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"
      implementationNames.0x53E82ABbb12638F09d9e624578ccB666217a765e:
-        "TransparentUpgradeableProxy"
      implementationNames.0xcC865B0324121b43728176024f58bdbB3afd6f29:
-        "GenericVaultBridgeToken"
      implementationNames.eth:0x53E82ABbb12638F09d9e624578ccB666217a765e:
+        "TransparentUpgradeableProxy"
      implementationNames.eth:0xcC865B0324121b43728176024f58bdbB3afd6f29:
+        "GenericVaultBridgeToken"
    }
```

```diff
    EOA  (0x54DFA4B635E7eB98515fEBA81d360A3871739277) {
    +++ description: None
      address:
-        "0x54DFA4B635E7eB98515fEBA81d360A3871739277"
+        "eth:0x54DFA4B635E7eB98515fEBA81d360A3871739277"
    }
```

```diff
    contract MIPS (0x5fE03a12C1236F9C22Cb6479778DDAa4bce6299C) {
    +++ description: The MIPS contract is used to execute the final step of the dispute game which objectively determines the winner of the dispute.
      address:
-        "0x5fE03a12C1236F9C22Cb6479778DDAa4bce6299C"
+        "eth:0x5fE03a12C1236F9C22Cb6479778DDAa4bce6299C"
      values.oracle:
-        "0x9c065e11870B891D214Bc2Da7EF1f9DDFA1BE277"
+        "eth:0x9c065e11870B891D214Bc2Da7EF1f9DDFA1BE277"
      implementationNames.0x5fE03a12C1236F9C22Cb6479778DDAa4bce6299C:
-        "MIPS"
      implementationNames.eth:0x5fE03a12C1236F9C22Cb6479778DDAa4bce6299C:
+        "MIPS"
    }
```

```diff
    contract Katana yieldRecipient Mulsitig (0x67C912fF560951526BffDff66dFbD4DF8AE23756) {
    +++ description: None
      address:
-        "0x67C912fF560951526BffDff66dFbD4DF8AE23756"
+        "eth:0x67C912fF560951526BffDff66dFbD4DF8AE23756"
      values.$implementation:
-        "0x41675C099F32341bf84BFc5382aF534df5C7461a"
+        "eth:0x41675C099F32341bf84BFc5382aF534df5C7461a"
      values.$members.0:
-        "0x0A4857fD89ABfB7536a6D0Bd4400EF769E84Ec8b"
+        "eth:0x0A4857fD89ABfB7536a6D0Bd4400EF769E84Ec8b"
      values.$members.1:
-        "0x54DFA4B635E7eB98515fEBA81d360A3871739277"
+        "eth:0x54DFA4B635E7eB98515fEBA81d360A3871739277"
      values.$members.2:
-        "0xb3dA4c1Ba8De9E04f22B1554a070189F518FDCac"
+        "eth:0xb3dA4c1Ba8De9E04f22B1554a070189F518FDCac"
      values.$members.3:
-        "0xa1a4C71024a0CAD6a1cEf85561f1B9a34E00ff62"
+        "eth:0xa1a4C71024a0CAD6a1cEf85561f1B9a34E00ff62"
      values.$members.4:
-        "0x227D9Ea843910Edd305c42e7bB9Ce6D9f369238c"
+        "eth:0x227D9Ea843910Edd305c42e7bB9Ce6D9f369238c"
      implementationNames.0x67C912fF560951526BffDff66dFbD4DF8AE23756:
-        "SafeProxy"
      implementationNames.0x41675C099F32341bf84BFc5382aF534df5C7461a:
-        "Safe"
      implementationNames.eth:0x67C912fF560951526BffDff66dFbD4DF8AE23756:
+        "SafeProxy"
      implementationNames.eth:0x41675C099F32341bf84BFc5382aF534df5C7461a:
+        "Safe"
    }
```

```diff
    contract ProxyAdmin (0x6d0ff67fb427422AfF35EEa8596949B374b09a52) {
    +++ description: None
      address:
-        "0x6d0ff67fb427422AfF35EEa8596949B374b09a52"
+        "eth:0x6d0ff67fb427422AfF35EEa8596949B374b09a52"
      values.addressManager:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.owner:
-        "0x4e981bAe8E3cd06Ca911ffFE5504B2653ac1C38a"
+        "eth:0x4e981bAe8E3cd06Ca911ffFE5504B2653ac1C38a"
      implementationNames.0x6d0ff67fb427422AfF35EEa8596949B374b09a52:
-        "ProxyAdmin"
      implementationNames.eth:0x6d0ff67fb427422AfF35EEa8596949B374b09a52:
+        "ProxyAdmin"
    }
```

```diff
    contract vbUSDT (0x6d4f9f9f8f0155509ecd6Ac6c544fF27999845CC) {
    +++ description: This token contract uses a standard 'vault bridge token' implementation created by Agglayer CDK. It keeps deposited assets in a vault and issues an IOU token (Vault Bridge USDT) which can be deposited to Agglayer. The underlying asset is generating yield, which does not accrue to the vbUSDT-IOU but is sent to eth:0x67C912fF560951526BffDff66dFbD4DF8AE23756.
      address:
-        "0x6d4f9f9f8f0155509ecd6Ac6c544fF27999845CC"
+        "eth:0x6d4f9f9f8f0155509ecd6Ac6c544fF27999845CC"
      description:
-        "This token contract uses a standard 'vault bridge token' implementation created by Agglayer CDK. It keeps deposited assets in a vault and issues an IOU token (Vault Bridge USDT) which can be deposited to Agglayer. The underlying asset is generating yield, which does not accrue to the vbUSDT-IOU but is sent to 0x67C912fF560951526BffDff66dFbD4DF8AE23756."
+        "This token contract uses a standard 'vault bridge token' implementation created by Agglayer CDK. It keeps deposited assets in a vault and issues an IOU token (Vault Bridge USDT) which can be deposited to Agglayer. The underlying asset is generating yield, which does not accrue to the vbUSDT-IOU but is sent to eth:0x67C912fF560951526BffDff66dFbD4DF8AE23756."
      values.$admin:
-        "0x377a9e5df2882DC1DF8A0bD162cbc640eA634010"
+        "eth:0x377a9e5df2882DC1DF8A0bD162cbc640eA634010"
      values.$implementation:
-        "0xcC865B0324121b43728176024f58bdbB3afd6f29"
+        "eth:0xcC865B0324121b43728176024f58bdbB3afd6f29"
      values.$pastUpgrades.0.2.0:
-        "0xcC865B0324121b43728176024f58bdbB3afd6f29"
+        "eth:0xcC865B0324121b43728176024f58bdbB3afd6f29"
      values.accessControl.DEFAULT_ADMIN_ROLE.members.0:
-        "0x2De242e27386e224E5fbF110EA8406d5B70740ec"
+        "eth:0x2De242e27386e224E5fbF110EA8406d5B70740ec"
      values.accessControl.REBALANCER_ROLE.members.0:
-        "0x2De242e27386e224E5fbF110EA8406d5B70740ec"
+        "eth:0x2De242e27386e224E5fbF110EA8406d5B70740ec"
      values.accessControl.YIELD_COLLECTOR_ROLE.members.0:
-        "0x2De242e27386e224E5fbF110EA8406d5B70740ec"
+        "eth:0x2De242e27386e224E5fbF110EA8406d5B70740ec"
      values.accessControl.YIELD_COLLECTOR_ROLE.members.1:
-        "0xcB1e45481461aeF38E6B0a34F1444E9C5D647645"
+        "eth:0xcB1e45481461aeF38E6B0a34F1444E9C5D647645"
      values.accessControl.PAUSER_ROLE.members.0:
-        "0x2De242e27386e224E5fbF110EA8406d5B70740ec"
+        "eth:0x2De242e27386e224E5fbF110EA8406d5B70740ec"
      values.asset:
-        "0xdAC17F958D2ee523a2206206994597C13D831ec7"
+        "eth:0xdAC17F958D2ee523a2206206994597C13D831ec7"
      values.eip712Domain.verifyingContract:
-        "0x6d4f9f9f8f0155509ecd6Ac6c544fF27999845CC"
+        "eth:0x6d4f9f9f8f0155509ecd6Ac6c544fF27999845CC"
      values.lxlyBridge:
-        "0x2a3DD3EB832aF982ec71669E178424b10Dca2EDe"
+        "eth:0x2a3DD3EB832aF982ec71669E178424b10Dca2EDe"
      values.migrationManager:
-        "0x417d01B64Ea30C4E163873f3a1f77b727c689e02"
+        "eth:0x417d01B64Ea30C4E163873f3a1f77b727c689e02"
      values.underlyingToken:
-        "0xdAC17F958D2ee523a2206206994597C13D831ec7"
+        "eth:0xdAC17F958D2ee523a2206206994597C13D831ec7"
      implementationNames.0x6d4f9f9f8f0155509ecd6Ac6c544fF27999845CC:
-        "TransparentUpgradeableProxy"
      implementationNames.0xcC865B0324121b43728176024f58bdbB3afd6f29:
-        "GenericVaultBridgeToken"
      implementationNames.eth:0x6d4f9f9f8f0155509ecd6Ac6c544fF27999845CC:
+        "TransparentUpgradeableProxy"
      implementationNames.eth:0xcC865B0324121b43728176024f58bdbB3afd6f29:
+        "GenericVaultBridgeToken"
    }
```

```diff
    contract DelayedWETH (0x74034597d29613CC8C0BDc8780e1d292A553Bd32) {
    +++ description: Contract designed to hold the bonded ETH for each game. It is designed as a wrapper around WETH to allow an owner to function as a backstop if a game would incorrectly distribute funds.
      address:
-        "0x74034597d29613CC8C0BDc8780e1d292A553Bd32"
+        "eth:0x74034597d29613CC8C0BDc8780e1d292A553Bd32"
      values.$admin:
-        "0x19DbD16f0a8e706D817B7e3b7bcF72917Ebb8832"
+        "eth:0x19DbD16f0a8e706D817B7e3b7bcF72917Ebb8832"
      values.$implementation:
-        "0x71e966Ae981d1ce531a7b6d23DC0f27B38409087"
+        "eth:0x71e966Ae981d1ce531a7b6d23DC0f27B38409087"
      values.$pastUpgrades.0.2.0:
-        "0x71e966Ae981d1ce531a7b6d23DC0f27B38409087"
+        "eth:0x71e966Ae981d1ce531a7b6d23DC0f27B38409087"
      values.config:
-        "0x2F439B95fa789C5d3a5C99cc70EB3ee83D08a811"
+        "eth:0x2F439B95fa789C5d3a5C99cc70EB3ee83D08a811"
      values.owner:
-        "0x4e981bAe8E3cd06Ca911ffFE5504B2653ac1C38a"
+        "eth:0x4e981bAe8E3cd06Ca911ffFE5504B2653ac1C38a"
      implementationNames.0x74034597d29613CC8C0BDc8780e1d292A553Bd32:
-        "Proxy"
      implementationNames.0x71e966Ae981d1ce531a7b6d23DC0f27B38409087:
-        "DelayedWETH"
      implementationNames.eth:0x74034597d29613CC8C0BDc8780e1d292A553Bd32:
+        "Proxy"
      implementationNames.eth:0x71e966Ae981d1ce531a7b6d23DC0f27B38409087:
+        "DelayedWETH"
    }
```

```diff
    EOA  (0x787aba336583f4A1D4f8cBBFDFFD49f3a38De665) {
    +++ description: None
      address:
-        "0x787aba336583f4A1D4f8cBBFDFFD49f3a38De665"
+        "eth:0x787aba336583f4A1D4f8cBBFDFFD49f3a38De665"
    }
```

```diff
    contract AnchorStateRegistry (0x79ecD8d8040496014bcD3bA16AdF3914b23f8Fd5) {
    +++ description: Contains the latest confirmed state root that can be used as a starting point in a dispute game.
      address:
-        "0x79ecD8d8040496014bcD3bA16AdF3914b23f8Fd5"
+        "eth:0x79ecD8d8040496014bcD3bA16AdF3914b23f8Fd5"
      values.$admin:
-        "0x19DbD16f0a8e706D817B7e3b7bcF72917Ebb8832"
+        "eth:0x19DbD16f0a8e706D817B7e3b7bcF72917Ebb8832"
      values.$implementation:
-        "0x393d0b46A30226Fa60AB3BD7D20e9C7890344A79"
+        "eth:0x393d0b46A30226Fa60AB3BD7D20e9C7890344A79"
      values.$pastUpgrades.0.2.0:
-        "0x393d0b46A30226Fa60AB3BD7D20e9C7890344A79"
+        "eth:0x393d0b46A30226Fa60AB3BD7D20e9C7890344A79"
      values.disputeGameFactory:
-        "0xe06278351d120288eDfCB963F934113Ca3C21AFe"
+        "eth:0xe06278351d120288eDfCB963F934113Ca3C21AFe"
      values.superchainConfig:
-        "0x2F439B95fa789C5d3a5C99cc70EB3ee83D08a811"
+        "eth:0x2F439B95fa789C5d3a5C99cc70EB3ee83D08a811"
      implementationNames.0x79ecD8d8040496014bcD3bA16AdF3914b23f8Fd5:
-        "Proxy"
      implementationNames.0x393d0b46A30226Fa60AB3BD7D20e9C7890344A79:
-        "AnchorStateRegistry"
      implementationNames.eth:0x79ecD8d8040496014bcD3bA16AdF3914b23f8Fd5:
+        "Proxy"
      implementationNames.eth:0x393d0b46A30226Fa60AB3BD7D20e9C7890344A79:
+        "AnchorStateRegistry"
    }
```

```diff
    EOA  (0x81175155D85377C337d92f1FA52Da166C3A4E7Ac) {
    +++ description: None
      address:
-        "0x81175155D85377C337d92f1FA52Da166C3A4E7Ac"
+        "eth:0x81175155D85377C337d92f1FA52Da166C3A4E7Ac"
    }
```

```diff
    contract Katana Steakhouse Financial / Morpho Multisig (0x827e86072B06674a077f592A531dcE4590aDeCdB) {
    +++ description: None
      address:
-        "0x827e86072B06674a077f592A531dcE4590aDeCdB"
+        "eth:0x827e86072B06674a077f592A531dcE4590aDeCdB"
      values.$implementation:
-        "0x41675C099F32341bf84BFc5382aF534df5C7461a"
+        "eth:0x41675C099F32341bf84BFc5382aF534df5C7461a"
      values.$members.0:
-        "0x0D61C8b6CA9669A36F351De3AE335e9689dd9C5b"
+        "eth:0x0D61C8b6CA9669A36F351De3AE335e9689dd9C5b"
      values.$members.1:
-        "0xcC771952fdE840E30C6802734e5ad20479c2959f"
+        "eth:0xcC771952fdE840E30C6802734e5ad20479c2959f"
      values.$members.2:
-        "0x387Cde8598E1CBb297FDc5bAEbA5E5c5c2735344"
+        "eth:0x387Cde8598E1CBb297FDc5bAEbA5E5c5c2735344"
      values.$members.3:
-        "0xE3fCEE6B6cd564E073346f71394f60eC9aDf5120"
+        "eth:0xE3fCEE6B6cd564E073346f71394f60eC9aDf5120"
      implementationNames.0x827e86072B06674a077f592A531dcE4590aDeCdB:
-        "SafeProxy"
      implementationNames.0x41675C099F32341bf84BFc5382aF534df5C7461a:
-        "Safe"
      implementationNames.eth:0x827e86072B06674a077f592A531dcE4590aDeCdB:
+        "SafeProxy"
      implementationNames.eth:0x41675C099F32341bf84BFc5382aF534df5C7461a:
+        "Safe"
    }
```

```diff
    EOA  (0x860e06Fe384D1A3340111e7D142E02642178c053) {
    +++ description: None
      address:
-        "0x860e06Fe384D1A3340111e7D142E02642178c053"
+        "eth:0x860e06Fe384D1A3340111e7D142E02642178c053"
    }
```

```diff
    contract ProxyAdmin (0x8970650CF3f1E57cA804C65B4DBcFf698789FE30) {
    +++ description: None
      address:
-        "0x8970650CF3f1E57cA804C65B4DBcFf698789FE30"
+        "eth:0x8970650CF3f1E57cA804C65B4DBcFf698789FE30"
      values.owner:
-        "0xf4F2f5F6bAdBE05433C4604320ecC56BbECBC04E"
+        "eth:0xf4F2f5F6bAdBE05433C4604320ecC56BbECBC04E"
      implementationNames.0x8970650CF3f1E57cA804C65B4DBcFf698789FE30:
-        "ProxyAdmin"
      implementationNames.eth:0x8970650CF3f1E57cA804C65B4DBcFf698789FE30:
+        "ProxyAdmin"
    }
```

```diff
    contract L1StandardBridge (0x98906C3f90A06B5484DD67bf32938815d2993dBC) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      address:
-        "0x98906C3f90A06B5484DD67bf32938815d2993dBC"
+        "eth:0x98906C3f90A06B5484DD67bf32938815d2993dBC"
      values.$admin:
-        "0x19DbD16f0a8e706D817B7e3b7bcF72917Ebb8832"
+        "eth:0x19DbD16f0a8e706D817B7e3b7bcF72917Ebb8832"
      values.$implementation:
-        "0x64B5a5Ed26DCb17370Ff4d33a8D503f0fbD06CfF"
+        "eth:0x64B5a5Ed26DCb17370Ff4d33a8D503f0fbD06CfF"
      values.l2TokenBridge:
-        "0x4200000000000000000000000000000000000010"
+        "eth:0x4200000000000000000000000000000000000010"
      values.messenger:
-        "0x2008A6Ba8CAF85AaFAe7880664Dfe681D533ac2E"
+        "eth:0x2008A6Ba8CAF85AaFAe7880664Dfe681D533ac2E"
      values.MESSENGER:
-        "0x2008A6Ba8CAF85AaFAe7880664Dfe681D533ac2E"
+        "eth:0x2008A6Ba8CAF85AaFAe7880664Dfe681D533ac2E"
      values.OTHER_BRIDGE:
-        "0x4200000000000000000000000000000000000010"
+        "eth:0x4200000000000000000000000000000000000010"
      values.otherBridge:
-        "0x4200000000000000000000000000000000000010"
+        "eth:0x4200000000000000000000000000000000000010"
      values.superchainConfig:
-        "0x2F439B95fa789C5d3a5C99cc70EB3ee83D08a811"
+        "eth:0x2F439B95fa789C5d3a5C99cc70EB3ee83D08a811"
      implementationNames.0x98906C3f90A06B5484DD67bf32938815d2993dBC:
-        "L1ChugSplashProxy"
      implementationNames.0x64B5a5Ed26DCb17370Ff4d33a8D503f0fbD06CfF:
-        "L1StandardBridge"
      implementationNames.eth:0x98906C3f90A06B5484DD67bf32938815d2993dBC:
+        "L1ChugSplashProxy"
      implementationNames.eth:0x64B5a5Ed26DCb17370Ff4d33a8D503f0fbD06CfF:
+        "L1StandardBridge"
    }
```

```diff
    contract PreimageOracle (0x9c065e11870B891D214Bc2Da7EF1f9DDFA1BE277) {
    +++ description: The PreimageOracle contract is used to load the required data from L1 for a dispute game.
      address:
-        "0x9c065e11870B891D214Bc2Da7EF1f9DDFA1BE277"
+        "eth:0x9c065e11870B891D214Bc2Da7EF1f9DDFA1BE277"
      implementationNames.0x9c065e11870B891D214Bc2Da7EF1f9DDFA1BE277:
-        "PreimageOracle"
      implementationNames.eth:0x9c065e11870B891D214Bc2Da7EF1f9DDFA1BE277:
+        "PreimageOracle"
    }
```

```diff
    contract Polygon Labs Engineering/Security Multisig (0x9d851f8b8751c5FbC09b9E74E6e68E9950949052) {
    +++ description: None
      address:
-        "0x9d851f8b8751c5FbC09b9E74E6e68E9950949052"
+        "eth:0x9d851f8b8751c5FbC09b9E74E6e68E9950949052"
      values.$implementation:
-        "0x41675C099F32341bf84BFc5382aF534df5C7461a"
+        "eth:0x41675C099F32341bf84BFc5382aF534df5C7461a"
      values.$members.0:
-        "0xeD44D1CFfB91e163CB7126bdEeA83959f175dB37"
+        "eth:0xeD44D1CFfB91e163CB7126bdEeA83959f175dB37"
      values.$members.1:
-        "0xffbfc0c8331C5fc912DDA3C6D4A86eEB80203238"
+        "eth:0xffbfc0c8331C5fc912DDA3C6D4A86eEB80203238"
      values.$members.2:
-        "0xdFEd8373695a7b3DaF268CF91e71f6a7024A56Da"
+        "eth:0xdFEd8373695a7b3DaF268CF91e71f6a7024A56Da"
      values.$members.3:
-        "0xED7cC82235A7757702475c8f77c7830c095FB5a2"
+        "eth:0xED7cC82235A7757702475c8f77c7830c095FB5a2"
      values.$members.4:
-        "0x21618593F7147235aC8D511d68A547C935F9d417"
+        "eth:0x21618593F7147235aC8D511d68A547C935F9d417"
      implementationNames.0x9d851f8b8751c5FbC09b9E74E6e68E9950949052:
-        "SafeProxy"
      implementationNames.0x41675C099F32341bf84BFc5382aF534df5C7461a:
-        "Safe"
      implementationNames.eth:0x9d851f8b8751c5FbC09b9E74E6e68E9950949052:
+        "SafeProxy"
      implementationNames.eth:0x41675C099F32341bf84BFc5382aF534df5C7461a:
+        "Safe"
    }
```

```diff
    EOA  (0xA0737fea60F0601A192E3d2c98865A883ab0bda2) {
    +++ description: None
      address:
-        "0xA0737fea60F0601A192E3d2c98865A883ab0bda2"
+        "eth:0xA0737fea60F0601A192E3d2c98865A883ab0bda2"
    }
```

```diff
    EOA  (0xa0C600a6e85bf225958FFAcC70B5FDDF9A059038) {
    +++ description: None
      address:
-        "0xa0C600a6e85bf225958FFAcC70B5FDDF9A059038"
+        "eth:0xa0C600a6e85bf225958FFAcC70B5FDDF9A059038"
    }
```

```diff
    EOA  (0xa1a4C71024a0CAD6a1cEf85561f1B9a34E00ff62) {
    +++ description: None
      address:
-        "0xa1a4C71024a0CAD6a1cEf85561f1B9a34E00ff62"
+        "eth:0xa1a4C71024a0CAD6a1cEf85561f1B9a34E00ff62"
    }
```

```diff
    EOA  (0xa4000bDD2bB92ce6750b31F1eeda47Bd1cB8e6e4) {
    +++ description: None
      address:
-        "0xa4000bDD2bB92ce6750b31F1eeda47Bd1cB8e6e4"
+        "eth:0xa4000bDD2bB92ce6750b31F1eeda47Bd1cB8e6e4"
    }
```

```diff
    contract OptimismMintableERC20Factory (0xA84C37cD0b9bA1B43276C11976DBE9d1344C7f4E) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintableERC20 as this chain's representation of a token on the host chain, or vice-versa.
      address:
-        "0xA84C37cD0b9bA1B43276C11976DBE9d1344C7f4E"
+        "eth:0xA84C37cD0b9bA1B43276C11976DBE9d1344C7f4E"
      values.$admin:
-        "0x19DbD16f0a8e706D817B7e3b7bcF72917Ebb8832"
+        "eth:0x19DbD16f0a8e706D817B7e3b7bcF72917Ebb8832"
      values.$implementation:
-        "0xE01efbeb1089D1d1dB9c6c8b135C934C0734c846"
+        "eth:0xE01efbeb1089D1d1dB9c6c8b135C934C0734c846"
      values.$pastUpgrades.0.2.0:
-        "0xE01efbeb1089D1d1dB9c6c8b135C934C0734c846"
+        "eth:0xE01efbeb1089D1d1dB9c6c8b135C934C0734c846"
      values.bridge:
-        "0x98906C3f90A06B5484DD67bf32938815d2993dBC"
+        "eth:0x98906C3f90A06B5484DD67bf32938815d2993dBC"
      values.BRIDGE:
-        "0x98906C3f90A06B5484DD67bf32938815d2993dBC"
+        "eth:0x98906C3f90A06B5484DD67bf32938815d2993dBC"
      implementationNames.0xA84C37cD0b9bA1B43276C11976DBE9d1344C7f4E:
-        "Proxy"
      implementationNames.0xE01efbeb1089D1d1dB9c6c8b135C934C0734c846:
-        "OptimismMintableERC20Factory"
      implementationNames.eth:0xA84C37cD0b9bA1B43276C11976DBE9d1344C7f4E:
+        "Proxy"
      implementationNames.eth:0xE01efbeb1089D1d1dB9c6c8b135C934C0734c846:
+        "OptimismMintableERC20Factory"
    }
```

```diff
    contract Katana vaultBridge Multisig 2 (0xA8C31B2edd84c654d06d626383f4154D1E40C5Ff) {
    +++ description: None
      address:
-        "0xA8C31B2edd84c654d06d626383f4154D1E40C5Ff"
+        "eth:0xA8C31B2edd84c654d06d626383f4154D1E40C5Ff"
      values.$implementation:
-        "0x41675C099F32341bf84BFc5382aF534df5C7461a"
+        "eth:0x41675C099F32341bf84BFc5382aF534df5C7461a"
      values.$members.0:
-        "0x16388463d60FFE0661Cf7F1f31a7D658aC790ff7"
+        "eth:0x16388463d60FFE0661Cf7F1f31a7D658aC790ff7"
      values.$members.1:
-        "0x9d851f8b8751c5FbC09b9E74E6e68E9950949052"
+        "eth:0x9d851f8b8751c5FbC09b9E74E6e68E9950949052"
      values.$members.2:
-        "0xd0673F989bc3BA9314d0AAF28BfC84e99B7898CC"
+        "eth:0xd0673F989bc3BA9314d0AAF28BfC84e99B7898CC"
      implementationNames.0xA8C31B2edd84c654d06d626383f4154D1E40C5Ff:
-        "SafeProxy"
      implementationNames.0x41675C099F32341bf84BFc5382aF534df5C7461a:
-        "Safe"
      implementationNames.eth:0xA8C31B2edd84c654d06d626383f4154D1E40C5Ff:
+        "SafeProxy"
      implementationNames.eth:0x41675C099F32341bf84BFc5382aF534df5C7461a:
+        "Safe"
    }
```

```diff
    EOA  (0xB13C8f58a233607569D2F8411B912148aeC4aEe2) {
    +++ description: None
      address:
-        "0xB13C8f58a233607569D2F8411B912148aeC4aEe2"
+        "eth:0xB13C8f58a233607569D2F8411B912148aeC4aEe2"
    }
```

```diff
    EOA  (0xb3dA4c1Ba8De9E04f22B1554a070189F518FDCac) {
    +++ description: None
      address:
-        "0xb3dA4c1Ba8De9E04f22B1554a070189F518FDCac"
+        "eth:0xb3dA4c1Ba8De9E04f22B1554a070189F518FDCac"
    }
```

```diff
    contract SystemConfig (0xb6e1f8B589A14B79DDD3aD7F0589AB548c70C174) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      address:
-        "0xb6e1f8B589A14B79DDD3aD7F0589AB548c70C174"
+        "eth:0xb6e1f8B589A14B79DDD3aD7F0589AB548c70C174"
      values.$admin:
-        "0x19DbD16f0a8e706D817B7e3b7bcF72917Ebb8832"
+        "eth:0x19DbD16f0a8e706D817B7e3b7bcF72917Ebb8832"
      values.$implementation:
-        "0xAB9d6cB7A427c0765163A7f45BB91cAfe5f2D375"
+        "eth:0xAB9d6cB7A427c0765163A7f45BB91cAfe5f2D375"
      values.$pastUpgrades.0.2.0:
-        "0xAB9d6cB7A427c0765163A7f45BB91cAfe5f2D375"
+        "eth:0xAB9d6cB7A427c0765163A7f45BB91cAfe5f2D375"
      values.$pastUpgrades.1.2.0:
-        "0xAB9d6cB7A427c0765163A7f45BB91cAfe5f2D375"
+        "eth:0xAB9d6cB7A427c0765163A7f45BB91cAfe5f2D375"
      values.batcherHash:
-        "0x1FFDA89C755f6D4Af069897D77CcAbb580Fd412a"
+        "eth:0x1FFDA89C755f6D4Af069897D77CcAbb580Fd412a"
      values.batchInbox:
-        "0x000d4411cdeb152378626B5C5E33fd5D6808939a"
+        "eth:0x000d4411cdeb152378626B5C5E33fd5D6808939a"
      values.disputeGameFactory:
-        "0xe06278351d120288eDfCB963F934113Ca3C21AFe"
+        "eth:0xe06278351d120288eDfCB963F934113Ca3C21AFe"
      values.gasPayingToken.addr_:
-        "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE"
+        "eth:0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE"
      values.l1CrossDomainMessenger:
-        "0x2008A6Ba8CAF85AaFAe7880664Dfe681D533ac2E"
+        "eth:0x2008A6Ba8CAF85AaFAe7880664Dfe681D533ac2E"
      values.l1ERC721Bridge:
-        "0x15a32FCeA89617Ff450F094cDE102CCa46598B7F"
+        "eth:0x15a32FCeA89617Ff450F094cDE102CCa46598B7F"
      values.l1StandardBridge:
-        "0x98906C3f90A06B5484DD67bf32938815d2993dBC"
+        "eth:0x98906C3f90A06B5484DD67bf32938815d2993dBC"
      values.optimismMintableERC20Factory:
-        "0xA84C37cD0b9bA1B43276C11976DBE9d1344C7f4E"
+        "eth:0xA84C37cD0b9bA1B43276C11976DBE9d1344C7f4E"
      values.optimismPortal:
-        "0x250D30c523104bf0a06825e7eAdE4Dc46EdfE40E"
+        "eth:0x250D30c523104bf0a06825e7eAdE4Dc46EdfE40E"
      values.owner:
-        "0x4e981bAe8E3cd06Ca911ffFE5504B2653ac1C38a"
+        "eth:0x4e981bAe8E3cd06Ca911ffFE5504B2653ac1C38a"
      values.sequencerInbox:
-        "0x000d4411cdeb152378626B5C5E33fd5D6808939a"
+        "eth:0x000d4411cdeb152378626B5C5E33fd5D6808939a"
      values.unsafeBlockSigner:
-        "0x450A3A6AE85904cb4Aa0809Fb41E53B687a28397"
+        "eth:0x450A3A6AE85904cb4Aa0809Fb41E53B687a28397"
      implementationNames.0xb6e1f8B589A14B79DDD3aD7F0589AB548c70C174:
-        "Proxy"
      implementationNames.0xAB9d6cB7A427c0765163A7f45BB91cAfe5f2D375:
-        "SystemConfig"
      implementationNames.eth:0xb6e1f8B589A14B79DDD3aD7F0589AB548c70C174:
+        "Proxy"
      implementationNames.eth:0xAB9d6cB7A427c0765163A7f45BB91cAfe5f2D375:
+        "SystemConfig"
    }
```

```diff
    EOA  (0xBD5f1429Ab467E69BEeba51E547C00A21F2a2092) {
    +++ description: None
      address:
-        "0xBD5f1429Ab467E69BEeba51E547C00A21F2a2092"
+        "eth:0xBD5f1429Ab467E69BEeba51E547C00A21F2a2092"
    }
```

```diff
    EOA  (0xC1E65a0cEbF95f56Cd8729f7e37CB33eD94d6439) {
    +++ description: None
      address:
-        "0xC1E65a0cEbF95f56Cd8729f7e37CB33eD94d6439"
+        "eth:0xC1E65a0cEbF95f56Cd8729f7e37CB33eD94d6439"
    }
```

```diff
    EOA  (0xcB1e45481461aeF38E6B0a34F1444E9C5D647645) {
    +++ description: None
      address:
-        "0xcB1e45481461aeF38E6B0a34F1444E9C5D647645"
+        "eth:0xcB1e45481461aeF38E6B0a34F1444E9C5D647645"
    }
```

```diff
    EOA  (0xcC771952fdE840E30C6802734e5ad20479c2959f) {
    +++ description: None
      address:
-        "0xcC771952fdE840E30C6802734e5ad20479c2959f"
+        "eth:0xcC771952fdE840E30C6802734e5ad20479c2959f"
    }
```

```diff
    EOA  (0xd0002c648CCa8DeE2f2b8D70D542Ccde8ad6EC03) {
    +++ description: None
      address:
-        "0xd0002c648CCa8DeE2f2b8D70D542Ccde8ad6EC03"
+        "eth:0xd0002c648CCa8DeE2f2b8D70D542Ccde8ad6EC03"
    }
```

```diff
    contract Polygon Multisig 2 (0xd0673F989bc3BA9314d0AAF28BfC84e99B7898CC) {
    +++ description: None
      address:
-        "0xd0673F989bc3BA9314d0AAF28BfC84e99B7898CC"
+        "eth:0xd0673F989bc3BA9314d0AAF28BfC84e99B7898CC"
      values.$implementation:
-        "0x41675C099F32341bf84BFc5382aF534df5C7461a"
+        "eth:0x41675C099F32341bf84BFc5382aF534df5C7461a"
      values.$members.0:
-        "0x1DD6473a6bb5fF9041D945C7d15AC8fBc2Ee1164"
+        "eth:0x1DD6473a6bb5fF9041D945C7d15AC8fBc2Ee1164"
      values.$members.1:
-        "0xa43901c63f7702C407378E55E0d0EB4064a2AE31"
+        "eth:0xa43901c63f7702C407378E55E0d0EB4064a2AE31"
      implementationNames.0xd0673F989bc3BA9314d0AAF28BfC84e99B7898CC:
-        "SafeProxy"
      implementationNames.0x41675C099F32341bf84BFc5382aF534df5C7461a:
-        "Safe"
      implementationNames.eth:0xd0673F989bc3BA9314d0AAF28BfC84e99B7898CC:
+        "SafeProxy"
      implementationNames.eth:0x41675C099F32341bf84BFc5382aF534df5C7461a:
+        "Safe"
    }
```

```diff
    contract ProxyAdmin (0xD1e389c046FB734D2a0c7C390312210c408ba832) {
    +++ description: None
      address:
-        "0xD1e389c046FB734D2a0c7C390312210c408ba832"
+        "eth:0xD1e389c046FB734D2a0c7C390312210c408ba832"
      values.owner:
-        "0xA8C31B2edd84c654d06d626383f4154D1E40C5Ff"
+        "eth:0xA8C31B2edd84c654d06d626383f4154D1E40C5Ff"
      implementationNames.0xD1e389c046FB734D2a0c7C390312210c408ba832:
-        "ProxyAdmin"
      implementationNames.eth:0xD1e389c046FB734D2a0c7C390312210c408ba832:
+        "ProxyAdmin"
    }
```

```diff
    contract DisputeGameFactory (0xe06278351d120288eDfCB963F934113Ca3C21AFe) {
    +++ description: The dispute game factory allows the creation of dispute games, used to propose state roots and eventually challenge them.
      address:
-        "0xe06278351d120288eDfCB963F934113Ca3C21AFe"
+        "eth:0xe06278351d120288eDfCB963F934113Ca3C21AFe"
      values.$admin:
-        "0x19DbD16f0a8e706D817B7e3b7bcF72917Ebb8832"
+        "eth:0x19DbD16f0a8e706D817B7e3b7bcF72917Ebb8832"
      values.$implementation:
-        "0xc641A33cab81C559F2bd4b21EA34C290E2440C2B"
+        "eth:0xc641A33cab81C559F2bd4b21EA34C290E2440C2B"
      values.$pastUpgrades.0.2.0:
-        "0xc641A33cab81C559F2bd4b21EA34C290E2440C2B"
+        "eth:0xc641A33cab81C559F2bd4b21EA34C290E2440C2B"
      values.gameImpls.0:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.gameImpls.1:
-        "0x2d4B822F8B74AdE7fcD5F740967f4dFcD2fef5e4"
+        "eth:0x2d4B822F8B74AdE7fcD5F740967f4dFcD2fef5e4"
      values.gameImpls.2:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.gameImpls.3:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.gameImpls.4:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.owner:
-        "0x4e981bAe8E3cd06Ca911ffFE5504B2653ac1C38a"
+        "eth:0x4e981bAe8E3cd06Ca911ffFE5504B2653ac1C38a"
      implementationNames.0xe06278351d120288eDfCB963F934113Ca3C21AFe:
-        "Proxy"
      implementationNames.0xc641A33cab81C559F2bd4b21EA34C290E2440C2B:
-        "DisputeGameFactory"
      implementationNames.eth:0xe06278351d120288eDfCB963F934113Ca3C21AFe:
+        "Proxy"
      implementationNames.eth:0xc641A33cab81C559F2bd4b21EA34C290E2440C2B:
+        "DisputeGameFactory"
    }
```

```diff
    EOA  (0xE3fCEE6B6cd564E073346f71394f60eC9aDf5120) {
    +++ description: None
      address:
-        "0xE3fCEE6B6cd564E073346f71394f60eC9aDf5120"
+        "eth:0xE3fCEE6B6cd564E073346f71394f60eC9aDf5120"
    }
```

```diff
    contract AddressManager (0xEaB94275eD336D80d4F46EA8Ea0427e351f11D65) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      address:
-        "0xEaB94275eD336D80d4F46EA8Ea0427e351f11D65"
+        "eth:0xEaB94275eD336D80d4F46EA8Ea0427e351f11D65"
      values.owner:
-        "0x19DbD16f0a8e706D817B7e3b7bcF72917Ebb8832"
+        "eth:0x19DbD16f0a8e706D817B7e3b7bcF72917Ebb8832"
      implementationNames.0xEaB94275eD336D80d4F46EA8Ea0427e351f11D65:
-        "AddressManager"
      implementationNames.eth:0xEaB94275eD336D80d4F46EA8Ea0427e351f11D65:
+        "AddressManager"
    }
```

```diff
    EOA  (0xefCf0c8faFB425997870f845e26fC6cA6EE6dD5C) {
    +++ description: None
      address:
-        "0xefCf0c8faFB425997870f845e26fC6cA6EE6dD5C"
+        "eth:0xefCf0c8faFB425997870f845e26fC6cA6EE6dD5C"
    }
```

```diff
    EOA  (0xF0B77EaE7F2dabCC2571c7418406A0dCA3afA4f0) {
    +++ description: None
      address:
-        "0xF0B77EaE7F2dabCC2571c7418406A0dCA3afA4f0"
+        "eth:0xF0B77EaE7F2dabCC2571c7418406A0dCA3afA4f0"
    }
```

```diff
    EOA  (0xF3313C48BD8E17b823d5498D62F37019dFEA647D) {
    +++ description: None
      address:
-        "0xF3313C48BD8E17b823d5498D62F37019dFEA647D"
+        "eth:0xF3313C48BD8E17b823d5498D62F37019dFEA647D"
    }
```

```diff
    contract Katana vaultBridge Multisig 3 (0xf4F2f5F6bAdBE05433C4604320ecC56BbECBC04E) {
    +++ description: None
      address:
-        "0xf4F2f5F6bAdBE05433C4604320ecC56BbECBC04E"
+        "eth:0xf4F2f5F6bAdBE05433C4604320ecC56BbECBC04E"
      values.$implementation:
-        "0x41675C099F32341bf84BFc5382aF534df5C7461a"
+        "eth:0x41675C099F32341bf84BFc5382aF534df5C7461a"
      values.$members.0:
-        "0x9d851f8b8751c5FbC09b9E74E6e68E9950949052"
+        "eth:0x9d851f8b8751c5FbC09b9E74E6e68E9950949052"
      values.$members.1:
-        "0xd0673F989bc3BA9314d0AAF28BfC84e99B7898CC"
+        "eth:0xd0673F989bc3BA9314d0AAF28BfC84e99B7898CC"
      values.$members.2:
-        "0x827e86072B06674a077f592A531dcE4590aDeCdB"
+        "eth:0x827e86072B06674a077f592A531dcE4590aDeCdB"
      implementationNames.0xf4F2f5F6bAdBE05433C4604320ecC56BbECBC04E:
-        "SafeProxy"
      implementationNames.0x41675C099F32341bf84BFc5382aF534df5C7461a:
-        "Safe"
      implementationNames.eth:0xf4F2f5F6bAdBE05433C4604320ecC56BbECBC04E:
+        "SafeProxy"
      implementationNames.eth:0x41675C099F32341bf84BFc5382aF534df5C7461a:
+        "Safe"
    }
```

```diff
+   Status: CREATED
    contract AggchainFEP (0x100d3ca4f97776A40A7D93dB4AbF0FEA34230666)
    +++ description: The main system contract defining the katana Layer 2 logic. As this contract is based on the OP-Succinct L2OutputOracle, OP stack outputRoots (L2 state roots) are saved here.
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x14Be6579A41342ca6B402ec85E7be538e6Ade951)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1ERC721Bridge (0x15a32FCeA89617Ff450F094cDE102CCa46598B7F)
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
```

```diff
+   Status: CREATED
    contract Yearn Strategist Multisig (0x16388463d60FFE0661Cf7F1f31a7D658aC790ff7)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x19DbD16f0a8e706D817B7e3b7bcF72917Ebb8832)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1CrossDomainMessenger (0x2008A6Ba8CAF85AaFAe7880664Dfe681D533ac2E)
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
```

```diff
+   Status: CREATED
    contract OptimismPortal2 (0x250D30c523104bf0a06825e7eAdE4Dc46EdfE40E)
    +++ description: The OptimismPortal contract usually is the main entry point to deposit funds from L1 to L2 or for finalizing withdrawals. It specifies which game type can be used for withdrawals, which currently is the PermissionedDisputeGame. This specific fork of the standard contract **disables the depositTransaction() function**, which prevents users from sending or forcing any transactions from L1 to L2, including token deposits. It is instead used for configuration and administration of the system.
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x263b251D67BB154DD6b8352539466ACE7948ED56)
    +++ description: None
```

```diff
+   Status: CREATED
    contract vbWBTC (0x2C24B57e2CCd1f273045Af6A5f632504C432374F)
    +++ description: This token contract uses a standard 'vault bridge token' implementation created by Agglayer CDK. It keeps deposited assets in a vault and issues an IOU token (Vault Bridge WBTC) which can be deposited to Agglayer. The underlying asset is generating yield, which does not accrue to the vbWBTC-IOU but is sent to eth:0x67C912fF560951526BffDff66dFbD4DF8AE23756.
```

```diff
+   Status: CREATED
    contract PermissionedDisputeGame (0x2d4B822F8B74AdE7fcD5F740967f4dFcD2fef5e4)
    +++ description: Same as FaultDisputeGame, but only two permissioned addresses are designated as proposer and challenger.
```

```diff
+   Status: CREATED
    contract vbETH (0x2DC70fb75b88d2eB4715bc06E1595E6D97c34DFF)
    +++ description: This token contract uses a standard 'vault bridge token' implementation created by Agglayer CDK. It keeps deposited assets in a vault and issues an IOU token (Vault Bridge ETH) which can be deposited to Agglayer. The underlying asset is generating yield, which does not accrue to the vbETH-IOU but is sent to eth:0x67C912fF560951526BffDff66dFbD4DF8AE23756.
```

```diff
+   Status: CREATED
    contract Katana vaultBridge Multisig 1 (0x2De242e27386e224E5fbF110EA8406d5B70740ec)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SuperchainConfig (0x2F439B95fa789C5d3a5C99cc70EB3ee83D08a811)
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x377a9e5df2882DC1DF8A0bD162cbc640eA634010)
    +++ description: None
```

```diff
+   Status: CREATED
    contract vbUSDS (0x3DD459dE96F9C28e3a343b831cbDC2B93c8C4855)
    +++ description: This token contract uses a standard 'vault bridge token' implementation created by Agglayer CDK. It keeps deposited assets in a vault and issues an IOU token (Vault Bridge USDS) which can be deposited to Agglayer. The underlying asset is generating yield, which does not accrue to the vbUSDS-IOU but is sent to eth:0x67C912fF560951526BffDff66dFbD4DF8AE23756.
```

```diff
+   Status: CREATED
    contract MigrationManager (0x417d01B64Ea30C4E163873f3a1f77b727c689e02)
    +++ description: Helper contract for the vaultBridge tokens on Layer 2. If any vbTokens are minted 'natively' on Layer 2, this contract can receive the underlying assets and lock them in the Layer 1 vaults.
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x420693B32113a0e00Eb9f3315D5D5ec3b32C2d69)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Conduit Multisig 1 (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Katana Foundation Engineering/Security Multisig (0x4e981bAe8E3cd06Ca911ffFE5504B2653ac1C38a)
    +++ description: None
```

```diff
+   Status: CREATED
    contract vbUSDC (0x53E82ABbb12638F09d9e624578ccB666217a765e)
    +++ description: This token contract uses a standard 'vault bridge token' implementation created by Agglayer CDK. It keeps deposited assets in a vault and issues an IOU token (Vault Bridge USDC) which can be deposited to Agglayer. The underlying asset is generating yield, which does not accrue to the vbUSDC-IOU but is sent to eth:0x67C912fF560951526BffDff66dFbD4DF8AE23756.
```

```diff
+   Status: CREATED
    contract MIPS (0x5fE03a12C1236F9C22Cb6479778DDAa4bce6299C)
    +++ description: The MIPS contract is used to execute the final step of the dispute game which objectively determines the winner of the dispute.
```

```diff
+   Status: CREATED
    contract Katana yieldRecipient Mulsitig (0x67C912fF560951526BffDff66dFbD4DF8AE23756)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x6d0ff67fb427422AfF35EEa8596949B374b09a52)
    +++ description: None
```

```diff
+   Status: CREATED
    contract vbUSDT (0x6d4f9f9f8f0155509ecd6Ac6c544fF27999845CC)
    +++ description: This token contract uses a standard 'vault bridge token' implementation created by Agglayer CDK. It keeps deposited assets in a vault and issues an IOU token (Vault Bridge USDT) which can be deposited to Agglayer. The underlying asset is generating yield, which does not accrue to the vbUSDT-IOU but is sent to eth:0x67C912fF560951526BffDff66dFbD4DF8AE23756.
```

```diff
+   Status: CREATED
    contract DelayedWETH (0x74034597d29613CC8C0BDc8780e1d292A553Bd32)
    +++ description: Contract designed to hold the bonded ETH for each game. It is designed as a wrapper around WETH to allow an owner to function as a backstop if a game would incorrectly distribute funds.
```

```diff
+   Status: CREATED
    contract AnchorStateRegistry (0x79ecD8d8040496014bcD3bA16AdF3914b23f8Fd5)
    +++ description: Contains the latest confirmed state root that can be used as a starting point in a dispute game.
```

```diff
+   Status: CREATED
    contract Katana Steakhouse Financial / Morpho Multisig (0x827e86072B06674a077f592A531dcE4590aDeCdB)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x8970650CF3f1E57cA804C65B4DBcFf698789FE30)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1StandardBridge (0x98906C3f90A06B5484DD67bf32938815d2993dBC)
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
```

```diff
+   Status: CREATED
    contract PreimageOracle (0x9c065e11870B891D214Bc2Da7EF1f9DDFA1BE277)
    +++ description: The PreimageOracle contract is used to load the required data from L1 for a dispute game.
```

```diff
+   Status: CREATED
    contract Polygon Labs Engineering/Security Multisig (0x9d851f8b8751c5FbC09b9E74E6e68E9950949052)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OptimismMintableERC20Factory (0xA84C37cD0b9bA1B43276C11976DBE9d1344C7f4E)
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintableERC20 as this chain's representation of a token on the host chain, or vice-versa.
```

```diff
+   Status: CREATED
    contract Katana vaultBridge Multisig 2 (0xA8C31B2edd84c654d06d626383f4154D1E40C5Ff)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SystemConfig (0xb6e1f8B589A14B79DDD3aD7F0589AB548c70C174)
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
```

```diff
+   Status: CREATED
    contract Polygon Multisig 2 (0xd0673F989bc3BA9314d0AAF28BfC84e99B7898CC)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0xD1e389c046FB734D2a0c7C390312210c408ba832)
    +++ description: None
```

```diff
+   Status: CREATED
    contract DisputeGameFactory (0xe06278351d120288eDfCB963F934113Ca3C21AFe)
    +++ description: The dispute game factory allows the creation of dispute games, used to propose state roots and eventually challenge them.
```

```diff
+   Status: CREATED
    contract AddressManager (0xEaB94275eD336D80d4F46EA8Ea0427e351f11D65)
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
```

```diff
+   Status: CREATED
    contract Katana vaultBridge Multisig 3 (0xf4F2f5F6bAdBE05433C4604320ecC56BbECBC04E)
    +++ description: None
```

Generated with discovered.json: 0x4de9b7e488759b6a86bc33ee8a000f43196bb151

# Diff at Mon, 14 Jul 2025 08:02:45 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@0dc82cd5064c9c6dc9fb20e2291a8bb6b2048e27 block: 22895938
- current block number: 22895938

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22895938 (main branch discovery), not current.

```diff
    contract OptimismMintableERC20Factory (0xA84C37cD0b9bA1B43276C11976DBE9d1344C7f4E) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintableERC20 as this chain's representation of a token on the host chain, or vice-versa.
      description:
-        "A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa."
+        "A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintableERC20 as this chain's representation of a token on the host chain, or vice-versa."
    }
```

Generated with discovered.json: 0xcd8b1f519e36434eaf3e03c79a3ba0d0d39c873a

# Diff at Fri, 11 Jul 2025 12:28:54 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@6f02976fdd9466dab085b947bf3c4d28ccef1010 block: 22837267
- current block number: 22895938

## Description

2 member added, 1 member switch.

## Watched changes

```diff
    contract Katana Foundation Engineering/Security Multisig (0x4e981bAe8E3cd06Ca911ffFE5504B2653ac1C38a) {
    +++ description: None
      values.$members.4:
-        "0xeD44D1CFfB91e163CB7126bdEeA83959f175dB37"
+        "0xcAB31b6A7b4d2eCd562A09e2BfA46535a18862f9"
    }
```

```diff
    contract Katana yieldRecipient Mulsitig (0x67C912fF560951526BffDff66dFbD4DF8AE23756) {
    +++ description: None
      values.$members.0:
+        "0x0A4857fD89ABfB7536a6D0Bd4400EF769E84Ec8b"
      values.$members.1:
+        "0x54DFA4B635E7eB98515fEBA81d360A3871739277"
      values.multisigThreshold:
-        "2 of 3 (67%)"
+        "2 of 5 (40%)"
    }
```

Generated with discovered.json: 0x5c6d5eccb8c520e2a2c0a17648a1e0b5be8117a5

# Diff at Fri, 04 Jul 2025 12:19:05 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f56dc47fe915564d4555300304da4d3bcbc087f block: 22837267
- current block number: 22837267

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22837267 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x14Be6579A41342ca6B402ec85E7be538e6Ade951) {
    +++ description: None
      directlyReceivedPermissions.0.from:
-        "ethereum:0x2DC70fb75b88d2eB4715bc06E1595E6D97c34DFF"
+        "eth:0x2DC70fb75b88d2eB4715bc06E1595E6D97c34DFF"
    }
```

```diff
    contract ProxyAdmin (0x19DbD16f0a8e706D817B7e3b7bcF72917Ebb8832) {
    +++ description: None
      directlyReceivedPermissions.0.from:
-        "ethereum:0xEaB94275eD336D80d4F46EA8Ea0427e351f11D65"
+        "eth:0xEaB94275eD336D80d4F46EA8Ea0427e351f11D65"
      directlyReceivedPermissions.1.from:
-        "ethereum:0x15a32FCeA89617Ff450F094cDE102CCa46598B7F"
+        "eth:0x15a32FCeA89617Ff450F094cDE102CCa46598B7F"
      directlyReceivedPermissions.2.from:
-        "ethereum:0x2008A6Ba8CAF85AaFAe7880664Dfe681D533ac2E"
+        "eth:0x2008A6Ba8CAF85AaFAe7880664Dfe681D533ac2E"
      directlyReceivedPermissions.3.from:
-        "ethereum:0x250D30c523104bf0a06825e7eAdE4Dc46EdfE40E"
+        "eth:0x250D30c523104bf0a06825e7eAdE4Dc46EdfE40E"
      directlyReceivedPermissions.4.from:
-        "ethereum:0x74034597d29613CC8C0BDc8780e1d292A553Bd32"
+        "eth:0x74034597d29613CC8C0BDc8780e1d292A553Bd32"
      directlyReceivedPermissions.5.from:
-        "ethereum:0x79ecD8d8040496014bcD3bA16AdF3914b23f8Fd5"
+        "eth:0x79ecD8d8040496014bcD3bA16AdF3914b23f8Fd5"
      directlyReceivedPermissions.6.from:
-        "ethereum:0x98906C3f90A06B5484DD67bf32938815d2993dBC"
+        "eth:0x98906C3f90A06B5484DD67bf32938815d2993dBC"
      directlyReceivedPermissions.7.from:
-        "ethereum:0xA84C37cD0b9bA1B43276C11976DBE9d1344C7f4E"
+        "eth:0xA84C37cD0b9bA1B43276C11976DBE9d1344C7f4E"
      directlyReceivedPermissions.8.from:
-        "ethereum:0xb6e1f8B589A14B79DDD3aD7F0589AB548c70C174"
+        "eth:0xb6e1f8B589A14B79DDD3aD7F0589AB548c70C174"
      directlyReceivedPermissions.9.from:
-        "ethereum:0xe06278351d120288eDfCB963F934113Ca3C21AFe"
+        "eth:0xe06278351d120288eDfCB963F934113Ca3C21AFe"
    }
```

```diff
    EOA  (0x1FFDA89C755f6D4Af069897D77CcAbb580Fd412a) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0xb6e1f8B589A14B79DDD3aD7F0589AB548c70C174"
+        "eth:0xb6e1f8B589A14B79DDD3aD7F0589AB548c70C174"
    }
```

```diff
    contract ProxyAdmin (0x263b251D67BB154DD6b8352539466ACE7948ED56) {
    +++ description: None
      directlyReceivedPermissions.0.from:
-        "ethereum:0x417d01B64Ea30C4E163873f3a1f77b727c689e02"
+        "eth:0x417d01B64Ea30C4E163873f3a1f77b727c689e02"
    }
```

```diff
    contract Katana vaultBridge Multisig 1 (0x2De242e27386e224E5fbF110EA8406d5B70740ec) {
    +++ description: None
      receivedPermissions.0.via.0.address:
-        "ethereum:0x420693B32113a0e00Eb9f3315D5D5ec3b32C2d69"
+        "eth:0x420693B32113a0e00Eb9f3315D5D5ec3b32C2d69"
      receivedPermissions.0.from:
-        "ethereum:0x2C24B57e2CCd1f273045Af6A5f632504C432374F"
+        "eth:0x2C24B57e2CCd1f273045Af6A5f632504C432374F"
      receivedPermissions.1.via.0.address:
-        "ethereum:0x14Be6579A41342ca6B402ec85E7be538e6Ade951"
+        "eth:0x14Be6579A41342ca6B402ec85E7be538e6Ade951"
      receivedPermissions.1.from:
-        "ethereum:0x2DC70fb75b88d2eB4715bc06E1595E6D97c34DFF"
+        "eth:0x2DC70fb75b88d2eB4715bc06E1595E6D97c34DFF"
      receivedPermissions.2.via.0.address:
-        "ethereum:0x377a9e5df2882DC1DF8A0bD162cbc640eA634010"
+        "eth:0x377a9e5df2882DC1DF8A0bD162cbc640eA634010"
      receivedPermissions.2.from:
-        "ethereum:0x6d4f9f9f8f0155509ecd6Ac6c544fF27999845CC"
+        "eth:0x6d4f9f9f8f0155509ecd6Ac6c544fF27999845CC"
      directlyReceivedPermissions.0.from:
-        "ethereum:0x14Be6579A41342ca6B402ec85E7be538e6Ade951"
+        "eth:0x14Be6579A41342ca6B402ec85E7be538e6Ade951"
      directlyReceivedPermissions.1.from:
-        "ethereum:0x377a9e5df2882DC1DF8A0bD162cbc640eA634010"
+        "eth:0x377a9e5df2882DC1DF8A0bD162cbc640eA634010"
      directlyReceivedPermissions.2.from:
-        "ethereum:0x420693B32113a0e00Eb9f3315D5D5ec3b32C2d69"
+        "eth:0x420693B32113a0e00Eb9f3315D5D5ec3b32C2d69"
    }
```

```diff
    contract ProxyAdmin (0x377a9e5df2882DC1DF8A0bD162cbc640eA634010) {
    +++ description: None
      directlyReceivedPermissions.0.from:
-        "ethereum:0x6d4f9f9f8f0155509ecd6Ac6c544fF27999845CC"
+        "eth:0x6d4f9f9f8f0155509ecd6Ac6c544fF27999845CC"
    }
```

```diff
    contract ProxyAdmin (0x420693B32113a0e00Eb9f3315D5D5ec3b32C2d69) {
    +++ description: None
      directlyReceivedPermissions.0.from:
-        "ethereum:0x2C24B57e2CCd1f273045Af6A5f632504C432374F"
+        "eth:0x2C24B57e2CCd1f273045Af6A5f632504C432374F"
    }
```

```diff
    contract Katana Foundation Engineering/Security Multisig (0x4e981bAe8E3cd06Ca911ffFE5504B2653ac1C38a) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0x100d3ca4f97776A40A7D93dB4AbF0FEA34230666"
+        "eth:0x100d3ca4f97776A40A7D93dB4AbF0FEA34230666"
      receivedPermissions.1.from:
-        "ethereum:0x100d3ca4f97776A40A7D93dB4AbF0FEA34230666"
+        "eth:0x100d3ca4f97776A40A7D93dB4AbF0FEA34230666"
      receivedPermissions.2.from:
-        "ethereum:0x74034597d29613CC8C0BDc8780e1d292A553Bd32"
+        "eth:0x74034597d29613CC8C0BDc8780e1d292A553Bd32"
      receivedPermissions.3.from:
-        "ethereum:0xb6e1f8B589A14B79DDD3aD7F0589AB548c70C174"
+        "eth:0xb6e1f8B589A14B79DDD3aD7F0589AB548c70C174"
      receivedPermissions.4.via.0.address:
-        "ethereum:0x19DbD16f0a8e706D817B7e3b7bcF72917Ebb8832"
+        "eth:0x19DbD16f0a8e706D817B7e3b7bcF72917Ebb8832"
      receivedPermissions.4.from:
-        "ethereum:0xEaB94275eD336D80d4F46EA8Ea0427e351f11D65"
+        "eth:0xEaB94275eD336D80d4F46EA8Ea0427e351f11D65"
      receivedPermissions.5.via.0.address:
-        "ethereum:0x19DbD16f0a8e706D817B7e3b7bcF72917Ebb8832"
+        "eth:0x19DbD16f0a8e706D817B7e3b7bcF72917Ebb8832"
      receivedPermissions.5.from:
-        "ethereum:0x15a32FCeA89617Ff450F094cDE102CCa46598B7F"
+        "eth:0x15a32FCeA89617Ff450F094cDE102CCa46598B7F"
      receivedPermissions.6.via.0.address:
-        "ethereum:0x19DbD16f0a8e706D817B7e3b7bcF72917Ebb8832"
+        "eth:0x19DbD16f0a8e706D817B7e3b7bcF72917Ebb8832"
      receivedPermissions.6.from:
-        "ethereum:0x2008A6Ba8CAF85AaFAe7880664Dfe681D533ac2E"
+        "eth:0x2008A6Ba8CAF85AaFAe7880664Dfe681D533ac2E"
      receivedPermissions.7.via.0.address:
-        "ethereum:0x19DbD16f0a8e706D817B7e3b7bcF72917Ebb8832"
+        "eth:0x19DbD16f0a8e706D817B7e3b7bcF72917Ebb8832"
      receivedPermissions.7.from:
-        "ethereum:0x250D30c523104bf0a06825e7eAdE4Dc46EdfE40E"
+        "eth:0x250D30c523104bf0a06825e7eAdE4Dc46EdfE40E"
      receivedPermissions.8.via.0.address:
-        "ethereum:0x6d0ff67fb427422AfF35EEa8596949B374b09a52"
+        "eth:0x6d0ff67fb427422AfF35EEa8596949B374b09a52"
      receivedPermissions.8.from:
-        "ethereum:0x2F439B95fa789C5d3a5C99cc70EB3ee83D08a811"
+        "eth:0x2F439B95fa789C5d3a5C99cc70EB3ee83D08a811"
      receivedPermissions.9.via.0.address:
-        "ethereum:0x19DbD16f0a8e706D817B7e3b7bcF72917Ebb8832"
+        "eth:0x19DbD16f0a8e706D817B7e3b7bcF72917Ebb8832"
      receivedPermissions.9.from:
-        "ethereum:0x74034597d29613CC8C0BDc8780e1d292A553Bd32"
+        "eth:0x74034597d29613CC8C0BDc8780e1d292A553Bd32"
      receivedPermissions.10.via.0.address:
-        "ethereum:0x19DbD16f0a8e706D817B7e3b7bcF72917Ebb8832"
+        "eth:0x19DbD16f0a8e706D817B7e3b7bcF72917Ebb8832"
      receivedPermissions.10.from:
-        "ethereum:0x79ecD8d8040496014bcD3bA16AdF3914b23f8Fd5"
+        "eth:0x79ecD8d8040496014bcD3bA16AdF3914b23f8Fd5"
      receivedPermissions.11.via.0.address:
-        "ethereum:0x19DbD16f0a8e706D817B7e3b7bcF72917Ebb8832"
+        "eth:0x19DbD16f0a8e706D817B7e3b7bcF72917Ebb8832"
      receivedPermissions.11.from:
-        "ethereum:0x98906C3f90A06B5484DD67bf32938815d2993dBC"
+        "eth:0x98906C3f90A06B5484DD67bf32938815d2993dBC"
      receivedPermissions.12.via.0.address:
-        "ethereum:0x19DbD16f0a8e706D817B7e3b7bcF72917Ebb8832"
+        "eth:0x19DbD16f0a8e706D817B7e3b7bcF72917Ebb8832"
      receivedPermissions.12.from:
-        "ethereum:0xA84C37cD0b9bA1B43276C11976DBE9d1344C7f4E"
+        "eth:0xA84C37cD0b9bA1B43276C11976DBE9d1344C7f4E"
      receivedPermissions.13.via.0.address:
-        "ethereum:0x19DbD16f0a8e706D817B7e3b7bcF72917Ebb8832"
+        "eth:0x19DbD16f0a8e706D817B7e3b7bcF72917Ebb8832"
      receivedPermissions.13.from:
-        "ethereum:0xb6e1f8B589A14B79DDD3aD7F0589AB548c70C174"
+        "eth:0xb6e1f8B589A14B79DDD3aD7F0589AB548c70C174"
      receivedPermissions.14.via.0.address:
-        "ethereum:0x19DbD16f0a8e706D817B7e3b7bcF72917Ebb8832"
+        "eth:0x19DbD16f0a8e706D817B7e3b7bcF72917Ebb8832"
      receivedPermissions.14.from:
-        "ethereum:0xe06278351d120288eDfCB963F934113Ca3C21AFe"
+        "eth:0xe06278351d120288eDfCB963F934113Ca3C21AFe"
      directlyReceivedPermissions.0.from:
-        "ethereum:0x19DbD16f0a8e706D817B7e3b7bcF72917Ebb8832"
+        "eth:0x19DbD16f0a8e706D817B7e3b7bcF72917Ebb8832"
      directlyReceivedPermissions.1.from:
-        "ethereum:0x6d0ff67fb427422AfF35EEa8596949B374b09a52"
+        "eth:0x6d0ff67fb427422AfF35EEa8596949B374b09a52"
    }
```

```diff
    contract ProxyAdmin (0x6d0ff67fb427422AfF35EEa8596949B374b09a52) {
    +++ description: None
      directlyReceivedPermissions.0.from:
-        "ethereum:0x2F439B95fa789C5d3a5C99cc70EB3ee83D08a811"
+        "eth:0x2F439B95fa789C5d3a5C99cc70EB3ee83D08a811"
    }
```

```diff
    contract ProxyAdmin (0x8970650CF3f1E57cA804C65B4DBcFf698789FE30) {
    +++ description: None
      directlyReceivedPermissions.0.from:
-        "ethereum:0x53E82ABbb12638F09d9e624578ccB666217a765e"
+        "eth:0x53E82ABbb12638F09d9e624578ccB666217a765e"
    }
```

```diff
    contract Polygon Labs Engineering/Security Multisig (0x9d851f8b8751c5FbC09b9E74E6e68E9950949052) {
    +++ description: None
      receivedPermissions.0.via.0.address:
-        "ethereum:0x263b251D67BB154DD6b8352539466ACE7948ED56"
+        "eth:0x263b251D67BB154DD6b8352539466ACE7948ED56"
      receivedPermissions.0.from:
-        "ethereum:0x417d01B64Ea30C4E163873f3a1f77b727c689e02"
+        "eth:0x417d01B64Ea30C4E163873f3a1f77b727c689e02"
      directlyReceivedPermissions.0.from:
-        "ethereum:0x263b251D67BB154DD6b8352539466ACE7948ED56"
+        "eth:0x263b251D67BB154DD6b8352539466ACE7948ED56"
    }
```

```diff
    contract Katana vaultBridge Multisig 2 (0xA8C31B2edd84c654d06d626383f4154D1E40C5Ff) {
    +++ description: None
      receivedPermissions.0.via.0.address:
-        "ethereum:0xD1e389c046FB734D2a0c7C390312210c408ba832"
+        "eth:0xD1e389c046FB734D2a0c7C390312210c408ba832"
      receivedPermissions.0.from:
-        "ethereum:0x3DD459dE96F9C28e3a343b831cbDC2B93c8C4855"
+        "eth:0x3DD459dE96F9C28e3a343b831cbDC2B93c8C4855"
      directlyReceivedPermissions.0.from:
-        "ethereum:0xD1e389c046FB734D2a0c7C390312210c408ba832"
+        "eth:0xD1e389c046FB734D2a0c7C390312210c408ba832"
    }
```

```diff
    EOA  (0xC1E65a0cEbF95f56Cd8729f7e37CB33eD94d6439) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0x100d3ca4f97776A40A7D93dB4AbF0FEA34230666"
+        "eth:0x100d3ca4f97776A40A7D93dB4AbF0FEA34230666"
    }
```

```diff
    contract ProxyAdmin (0xD1e389c046FB734D2a0c7C390312210c408ba832) {
    +++ description: None
      directlyReceivedPermissions.0.from:
-        "ethereum:0x3DD459dE96F9C28e3a343b831cbDC2B93c8C4855"
+        "eth:0x3DD459dE96F9C28e3a343b831cbDC2B93c8C4855"
    }
```

```diff
    contract Katana vaultBridge Multisig 3 (0xf4F2f5F6bAdBE05433C4604320ecC56BbECBC04E) {
    +++ description: None
      receivedPermissions.0.via.0.address:
-        "ethereum:0x8970650CF3f1E57cA804C65B4DBcFf698789FE30"
+        "eth:0x8970650CF3f1E57cA804C65B4DBcFf698789FE30"
      receivedPermissions.0.from:
-        "ethereum:0x53E82ABbb12638F09d9e624578ccB666217a765e"
+        "eth:0x53E82ABbb12638F09d9e624578ccB666217a765e"
      directlyReceivedPermissions.0.from:
-        "ethereum:0x8970650CF3f1E57cA804C65B4DBcFf698789FE30"
+        "eth:0x8970650CF3f1E57cA804C65B4DBcFf698789FE30"
    }
```

Generated with discovered.json: 0x5aa7e41e27277da1df64f06a0985e2f48af69bf3

# Diff at Thu, 03 Jul 2025 10:57:02 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@fa3b82adfb9dedeb2acea8fde7b79e65d59fb2b6 block: 22837267
- current block number: 22837267

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22837267 (main branch discovery), not current.

```diff
    contract L1ERC721Bridge (0x15a32FCeA89617Ff450F094cDE102CCa46598B7F) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      category.name:
-        "Canonical Bridges"
+        "Spam"
      category.priority:
-        2
+        -1
    }
```

```diff
    contract L1CrossDomainMessenger (0x2008A6Ba8CAF85AaFAe7880664Dfe681D533ac2E) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      category.name:
-        "Canonical Bridges"
+        "Spam"
      category.priority:
-        2
+        -1
    }
```

```diff
    contract L1StandardBridge (0x98906C3f90A06B5484DD67bf32938815d2993dBC) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      category.name:
-        "Canonical Bridges"
+        "Spam"
      category.priority:
-        2
+        -1
    }
```

```diff
    contract DisputeGameFactory (0xe06278351d120288eDfCB963F934113Ca3C21AFe) {
    +++ description: The dispute game factory allows the creation of dispute games, used to propose state roots and eventually challenge them.
      category.name:
-        "Local Infrastructure"
+        "Spam"
      category.priority:
-        5
+        -1
    }
```

Generated with discovered.json: 0xfb8af94a9da8bc0661f4417e752fcc542343186b

# Diff at Thu, 03 Jul 2025 09:54:26 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@717eea3a0fc625b39e556e700bc9e657bb32fa71 block: 22825494
- current block number: 22837267

## Description

add op stack gasconfig parameters.

config: refine descriptions and permissions.

## Watched changes

```diff
    contract SystemConfig (0xb6e1f8B589A14B79DDD3aD7F0589AB548c70C174) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
+++ description: volatility param: lower denominator -> quicker fee changes on L2
      values.eip1559Denominator:
-        0
+        250
      values.eip1559Elasticity:
-        0
+        60
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22825494 (main branch discovery), not current.

```diff
    contract AggchainFEP (0x100d3ca4f97776A40A7D93dB4AbF0FEA34230666) {
    +++ description: The main system contract defining the katana Layer 2 logic. As this contract is based on the OP-Succinct L2OutputOracle, OP stack outputRoots (L2 state roots) are saved here.
      fieldMeta.aggregationVkey.description:
-        "Verification key for the aggregation step which aggregates multiple range proofs into a single proof. The aggregation proof ensures that all range proofs in a given block range are linked and use the `rangeVkeyCommitment` as the verification key."
+        "Verification key for the aggregation step which aggregates multiple range proofs into a single proof. The aggregation proof ensures that all range proofs in a given block range are linked and use the `rangeVkeyCommitment` as the verification key. This proof is in turn wrapped by the aggchainVkey."
      fieldMeta.aggregationVkey.severity:
+        "HIGH"
      fieldMeta.rangeVkeyCommitment.description:
-        "Verification key for the OP Stack derivation + STF proof for a range of blocks."
+        "Verification key for the OP Stack derivation + STF proof for a range of blocks. This proof is the bottom level proof, wrapped by the aggregationVkey."
      fieldMeta.rangeVkeyCommitment.severity:
+        "HIGH"
      fieldMeta.optimisticMode:
+        {"severity":"HIGH","description":"degrades the system into a permissioned finalization mode without validity proofs. the state root in the aggchain proof in optimistic mode does not need an op succinct validity proof, but only a signature of the trustedSequencer."}
    }
```

```diff
    contract OptimismPortal2 (0x250D30c523104bf0a06825e7eAdE4Dc46EdfE40E) {
    +++ description: The OptimismPortal contract usually is the main entry point to deposit funds from L1 to L2 or for finalizing withdrawals. It specifies which game type can be used for withdrawals, which currently is the PermissionedDisputeGame. This specific fork of the standard contract **disables the depositTransaction() function**, which prevents users from sending or forcing any transactions from L1 to L2, including token deposits. It is instead used for configuration and administration of the system.
      description:
-        "[PAUSED] The OptimismPortal contract is the main entry point to deposit funds from L1 to L2. It also allows to prove and finalize withdrawals. It specifies which game type can be used for withdrawals, which currently is the PermissionedDisputeGame. This specific fork of the standard contract **disables the depositTransaction() function**, which prevents users from sending or forcing any transactions from L1 to L2, including token deposits."
+        "The OptimismPortal contract usually is the main entry point to deposit funds from L1 to L2 or for finalizing withdrawals. It specifies which game type can be used for withdrawals, which currently is the PermissionedDisputeGame. This specific fork of the standard contract **disables the depositTransaction() function**, which prevents users from sending or forcing any transactions from L1 to L2, including token deposits. It is instead used for configuration and administration of the system."
    }
```

```diff
    contract vbWBTC (0x2C24B57e2CCd1f273045Af6A5f632504C432374F) {
    +++ description: This token contract uses a standard 'vault bridge token' implementation created by Agglayer CDK. It keeps deposited assets in a vault and issues an IOU token (Vault Bridge WBTC) which can be deposited to Agglayer. The underlying asset is generating yield, which does not accrue to the vbWBTC-IOU but is sent to 0x67C912fF560951526BffDff66dFbD4DF8AE23756.
      name:
-        "GenericVaultBridgeToken"
+        "vbWBTC"
      description:
+        "This token contract uses a standard 'vault bridge token' implementation created by Agglayer CDK. It keeps deposited assets in a vault and issues an IOU token (Vault Bridge WBTC) which can be deposited to Agglayer. The underlying asset is generating yield, which does not accrue to the vbWBTC-IOU but is sent to 0x67C912fF560951526BffDff66dFbD4DF8AE23756."
      category:
+        {"name":"External Bridges","priority":1}
    }
```

```diff
    contract vbETH (0x2DC70fb75b88d2eB4715bc06E1595E6D97c34DFF) {
    +++ description: This token contract uses a standard 'vault bridge token' implementation created by Agglayer CDK. It keeps deposited assets in a vault and issues an IOU token (Vault Bridge ETH) which can be deposited to Agglayer. The underlying asset is generating yield, which does not accrue to the vbETH-IOU but is sent to 0x67C912fF560951526BffDff66dFbD4DF8AE23756.
      name:
-        "VbETH"
+        "vbETH"
      description:
+        "This token contract uses a standard 'vault bridge token' implementation created by Agglayer CDK. It keeps deposited assets in a vault and issues an IOU token (Vault Bridge ETH) which can be deposited to Agglayer. The underlying asset is generating yield, which does not accrue to the vbETH-IOU but is sent to 0x67C912fF560951526BffDff66dFbD4DF8AE23756."
      category:
+        {"name":"External Bridges","priority":1}
    }
```

```diff
    contract Katana vaultBridge Multisig 1 (0x2De242e27386e224E5fbF110EA8406d5B70740ec) {
    +++ description: None
      name:
-        "Safe"
+        "Katana vaultBridge Multisig 1"
    }
```

```diff
    contract SuperchainConfig (0x2F439B95fa789C5d3a5C99cc70EB3ee83D08a811) {
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      template:
-        "opstack/SuperchainConfigFake"
+        "opstack/SuperchainConfigNoGuard"
      category.name:
-        "Governance"
+        "Spam"
      category.priority:
-        3
+        -1
    }
```

```diff
    contract vbUSDS (0x3DD459dE96F9C28e3a343b831cbDC2B93c8C4855) {
    +++ description: This token contract uses a standard 'vault bridge token' implementation created by Agglayer CDK. It keeps deposited assets in a vault and issues an IOU token (Vault Bridge USDS) which can be deposited to Agglayer. The underlying asset is generating yield, which does not accrue to the vbUSDS-IOU but is sent to 0x67C912fF560951526BffDff66dFbD4DF8AE23756.
      name:
-        "GenericVaultBridgeToken"
+        "vbUSDS"
      description:
+        "This token contract uses a standard 'vault bridge token' implementation created by Agglayer CDK. It keeps deposited assets in a vault and issues an IOU token (Vault Bridge USDS) which can be deposited to Agglayer. The underlying asset is generating yield, which does not accrue to the vbUSDS-IOU but is sent to 0x67C912fF560951526BffDff66dFbD4DF8AE23756."
      category:
+        {"name":"External Bridges","priority":1}
    }
```

```diff
-   Status: DELETED
    contract Accountant (0x40a87104AEb279C061Af6b7C48F7E08c4A6e388D)
    +++ description: None
```

```diff
    contract MigrationManager (0x417d01B64Ea30C4E163873f3a1f77b727c689e02) {
    +++ description: Helper contract for the vaultBridge tokens on Layer 2. If any vbTokens are minted 'natively' on Layer 2, this contract can receive the underlying assets and lock them in the Layer 1 vaults.
      description:
+        "Helper contract for the vaultBridge tokens on Layer 2. If any vbTokens are minted 'natively' on Layer 2, this contract can receive the underlying assets and lock them in the Layer 1 vaults."
      category:
+        {"name":"External Bridges","priority":1}
    }
```

```diff
-   Status: DELETED
    contract Katana Pre-Deposit USDT Token (0x48c03B6FfD0008460F8657Db1037C7e09dEedfcb)
    +++ description: None
```

```diff
    contract Katana Foundation Engineering/Security Multisig (0x4e981bAe8E3cd06Ca911ffFE5504B2653ac1C38a) {
    +++ description: None
      name:
-        "Katana Multisig 2"
+        "Katana Foundation Engineering/Security Multisig"
      receivedPermissions.0:
+        {"permission":"interact","from":"ethereum:0x100d3ca4f97776A40A7D93dB4AbF0FEA34230666","description":"change the op-succinct related verification keys (aggregationVkey, rangeVkeyCommitment) and the rollupConfigHash.","role":".aggchainManager"}
      receivedPermissions.0.description:
+        "toggle the 'optimisticMode'."
      receivedPermissions.0.role:
-        ".guardian"
+        ".optimisticModeManager"
      receivedPermissions.0.from:
-        "ethereum:0x2F439B95fa789C5d3a5C99cc70EB3ee83D08a811"
+        "ethereum:0x100d3ca4f97776A40A7D93dB4AbF0FEA34230666"
      receivedPermissions.0.permission:
-        "guard"
+        "interact"
    }
```

```diff
    contract vbUSDC (0x53E82ABbb12638F09d9e624578ccB666217a765e) {
    +++ description: This token contract uses a standard 'vault bridge token' implementation created by Agglayer CDK. It keeps deposited assets in a vault and issues an IOU token (Vault Bridge USDC) which can be deposited to Agglayer. The underlying asset is generating yield, which does not accrue to the vbUSDC-IOU but is sent to 0x67C912fF560951526BffDff66dFbD4DF8AE23756.
      name:
-        "GenericVaultBridgeToken"
+        "vbUSDC"
      description:
+        "This token contract uses a standard 'vault bridge token' implementation created by Agglayer CDK. It keeps deposited assets in a vault and issues an IOU token (Vault Bridge USDC) which can be deposited to Agglayer. The underlying asset is generating yield, which does not accrue to the vbUSDC-IOU but is sent to 0x67C912fF560951526BffDff66dFbD4DF8AE23756."
      category:
+        {"name":"External Bridges","priority":1}
    }
```

```diff
    contract MIPS (0x5fE03a12C1236F9C22Cb6479778DDAa4bce6299C) {
    +++ description: The MIPS contract is used to execute the final step of the dispute game which objectively determines the winner of the dispute.
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract Katana yieldRecipient Mulsitig (0x67C912fF560951526BffDff66dFbD4DF8AE23756) {
    +++ description: None
      name:
-        "Safe"
+        "Katana yieldRecipient Mulsitig"
    }
```

```diff
    contract vbUSDT (0x6d4f9f9f8f0155509ecd6Ac6c544fF27999845CC) {
    +++ description: This token contract uses a standard 'vault bridge token' implementation created by Agglayer CDK. It keeps deposited assets in a vault and issues an IOU token (Vault Bridge USDT) which can be deposited to Agglayer. The underlying asset is generating yield, which does not accrue to the vbUSDT-IOU but is sent to 0x67C912fF560951526BffDff66dFbD4DF8AE23756.
      name:
-        "GenericVaultBridgeToken"
+        "vbUSDT"
      description:
+        "This token contract uses a standard 'vault bridge token' implementation created by Agglayer CDK. It keeps deposited assets in a vault and issues an IOU token (Vault Bridge USDT) which can be deposited to Agglayer. The underlying asset is generating yield, which does not accrue to the vbUSDT-IOU but is sent to 0x67C912fF560951526BffDff66dFbD4DF8AE23756."
      category:
+        {"name":"External Bridges","priority":1}
    }
```

```diff
    contract DelayedWETH (0x74034597d29613CC8C0BDc8780e1d292A553Bd32) {
    +++ description: Contract designed to hold the bonded ETH for each game. It is designed as a wrapper around WETH to allow an owner to function as a backstop if a game would incorrectly distribute funds.
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
-   Status: DELETED
    contract Katana Pre-Deposit USDC Token (0x7B5A0182E400b241b317e781a4e9dEdFc1429822)
    +++ description: None
```

```diff
    contract Katana Steakhouse Financial / Morpho Multisig (0x827e86072B06674a077f592A531dcE4590aDeCdB) {
    +++ description: None
      name:
-        "Safe"
+        "Katana Steakhouse Financial / Morpho Multisig"
    }
```

```diff
-   Status: DELETED
    contract ShareReceiver (0x836304B832687f3811a0dF935934C724B40578eB)
    +++ description: None
```

```diff
-   Status: DELETED
    contract Katana Pre-Deposit WBTC Token (0x92C82f5F771F6A44CfA09357DD0575B81BF5F728)
    +++ description: None
```

```diff
    contract PreimageOracle (0x9c065e11870B891D214Bc2Da7EF1f9DDFA1BE277) {
    +++ description: The PreimageOracle contract is used to load the required data from L1 for a dispute game.
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract Polygon Labs Engineering/Security Multisig (0x9d851f8b8751c5FbC09b9E74E6e68E9950949052) {
    +++ description: None
      name:
-        "Polygon Multisig 2"
+        "Polygon Labs Engineering/Security Multisig"
    }
```

```diff
    contract OptimismMintableERC20Factory (0xA84C37cD0b9bA1B43276C11976DBE9d1344C7f4E) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract Katana vaultBridge Multisig 2 (0xA8C31B2edd84c654d06d626383f4154D1E40C5Ff) {
    +++ description: None
      name:
-        "Safe"
+        "Katana vaultBridge Multisig 2"
    }
```

```diff
-   Status: DELETED
    contract DepositRelayer (0xB01dADEC98308528ee57A17b24A473213c1704bb)
    +++ description: None
```

```diff
    EOA  (0xC1E65a0cEbF95f56Cd8729f7e37CB33eD94d6439) {
    +++ description: None
      receivedPermissions:
+        [{"permission":"interact","from":"ethereum:0x100d3ca4f97776A40A7D93dB4AbF0FEA34230666","description":"finalize any state root with only their signature.","role":".trustedSequencer","condition":"optimisticMode is enabled by the optimisticModeManager."}]
    }
```

```diff
-   Status: DELETED
    contract Katana Pre-Deposit WETH Token (0xcc6a16Be713f6a714f68b0E1f4914fD3db15fBeF)
    +++ description: None
```

```diff
-   Status: DELETED
    contract AllowanceModule (0xCFbFaC74C26F8647cBDb8c5caf80BB5b32E43134)
    +++ description: None
```

```diff
    contract Polygon Multisig 2 (0xd0673F989bc3BA9314d0AAF28BfC84e99B7898CC) {
    +++ description: None
      name:
-        "Safe"
+        "Polygon Multisig 2"
    }
```

```diff
-   Status: DELETED
    contract ERC20Router (0xeeeeee9eC4769A09a76A83C7bC42b185872860eE)
    +++ description: None
```

```diff
    contract Katana vaultBridge Multisig 3 (0xf4F2f5F6bAdBE05433C4604320ecC56BbECBC04E) {
    +++ description: None
      name:
-        "Katana Multisig"
+        "Katana vaultBridge Multisig 3"
    }
```

```diff
-   Status: DELETED
    contract Yearn Treasury Multisig (0xFEB4acf3df3cDEA7399794D0869ef76A6EfAff52)
    +++ description: None
```

Generated with discovered.json: 0x947fb3788d01d2f19ea5e0f4af048ad614ea9e24

# Diff at Tue, 01 Jul 2025 16:11:11 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@f7cc75f3e93efbba70ffb8d54f4aeceb76299220 block: 22816814
- current block number: 22825494

## Description

Predeposits ended (limit 0), chain is live.

add the AggchainFEP core contract of Katana.

move TVS to L2 configs.

## Watched changes

```diff
    contract Katana Pre-Deposit USDT Token (0x48c03B6FfD0008460F8657Db1037C7e09dEedfcb) {
    +++ description: None
      values.deposit_limit:
-        "115792089237316195423570985008687907853269984665640564039457584007913129639935"
+        0
      values.deposit_limit_module:
-        "0x793D85F585145c050487c7AfBF0e9B97143fF1CB"
+        "0x0000000000000000000000000000000000000000"
    }
```

```diff
-   Status: DELETED
    contract DepositModule (0x793D85F585145c050487c7AfBF0e9B97143fF1CB)
    +++ description: None
```

```diff
    contract Katana Pre-Deposit USDC Token (0x7B5A0182E400b241b317e781a4e9dEdFc1429822) {
    +++ description: None
      values.deposit_limit:
-        "115792089237316195423570985008687907853269984665640564039457584007913129639935"
+        0
      values.deposit_limit_module:
-        "0x793D85F585145c050487c7AfBF0e9B97143fF1CB"
+        "0x0000000000000000000000000000000000000000"
    }
```

```diff
    contract Katana Pre-Deposit WBTC Token (0x92C82f5F771F6A44CfA09357DD0575B81BF5F728) {
    +++ description: None
      values.deposit_limit:
-        "115792089237316195423570985008687907853269984665640564039457584007913129639935"
+        0
      values.deposit_limit_module:
-        "0x793D85F585145c050487c7AfBF0e9B97143fF1CB"
+        "0x0000000000000000000000000000000000000000"
    }
```

```diff
    contract Katana Pre-Deposit WETH Token (0xcc6a16Be713f6a714f68b0E1f4914fD3db15fBeF) {
    +++ description: None
      values.deposit_limit:
-        "115792089237316195423570985008687907853269984665640564039457584007913129639935"
+        0
      values.deposit_limit_module:
-        "0x793D85F585145c050487c7AfBF0e9B97143fF1CB"
+        "0x0000000000000000000000000000000000000000"
    }
```

```diff
+   Status: CREATED
    contract Safe (0x67C912fF560951526BffDff66dFbD4DF8AE23756)
    +++ description: None
```

## Source code changes

```diff
.../.flat@22816814/DepositModule.sol => /dev/null  |   76 --
 .../Safe.sol                                       | 1088 ++++++++++++++++++++
 .../SafeProxy.p.sol                                |   37 +
 3 files changed, 1125 insertions(+), 76 deletions(-)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22816814 (main branch discovery), not current.

```diff
+   Status: CREATED
    contract AggchainFEP (0x100d3ca4f97776A40A7D93dB4AbF0FEA34230666)
    +++ description: The main system contract defining the katana Layer 2 logic. As this contract is based on the OP-Succinct L2OutputOracle, OP stack outputRoots (L2 state roots) are saved here.
```

Generated with discovered.json: 0xb8798013ac6ee9c416ee1272bb9e516c63475f37

# Diff at Mon, 30 Jun 2025 11:04:12 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@8f38be1dac1da945211896720e26a33675aff71a block: 22794595
- current block number: 22816814

## Description

New owner / admin for the opstack contracts: tagged it katana multisig 2.

move project under review with activity, TVS.

## Watched changes

```diff
    contract ProxyAdmin (0x19DbD16f0a8e706D817B7e3b7bcF72917Ebb8832) {
    +++ description: None
      values.owner:
-        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
+        "0x4e981bAe8E3cd06Ca911ffFE5504B2653ac1C38a"
    }
```

```diff
    contract OptimismPortal2 (0x250D30c523104bf0a06825e7eAdE4Dc46EdfE40E) {
    +++ description: [PAUSED] The OptimismPortal contract is the main entry point to deposit funds from L1 to L2. It also allows to prove and finalize withdrawals. It specifies which game type can be used for withdrawals, which currently is the PermissionedDisputeGame. This specific fork of the standard contract **disables the depositTransaction() function**, which prevents users from sending or forcing any transactions from L1 to L2, including token deposits.
      values.guardian:
-        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
+        "0x4e981bAe8E3cd06Ca911ffFE5504B2653ac1C38a"
    }
```

```diff
    contract GenericVaultBridgeToken (0x2C24B57e2CCd1f273045Af6A5f632504C432374F) {
    +++ description: None
      values.accessControl.YIELD_COLLECTOR_ROLE.members.1:
+        "0xcB1e45481461aeF38E6B0a34F1444E9C5D647645"
    }
```

```diff
    contract VbETH (0x2DC70fb75b88d2eB4715bc06E1595E6D97c34DFF) {
    +++ description: None
      values.accessControl.YIELD_COLLECTOR_ROLE.members.1:
+        "0xcB1e45481461aeF38E6B0a34F1444E9C5D647645"
    }
```

```diff
    contract SuperchainConfig (0x2F439B95fa789C5d3a5C99cc70EB3ee83D08a811) {
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      values.$pastUpgrades.1:
+        ["2025-06-30T10:33:47.000Z","0x56f6765801bec01f9aa2a5c9750daada809b1f7a3f5343800c0b76c6308b4558",["0xd81f43eDBCAcb4c29a9bA38a13Ee5d79278270cC"]]
      values.$pastUpgrades.2:
+        ["2025-06-30T10:33:47.000Z","0x56f6765801bec01f9aa2a5c9750daada809b1f7a3f5343800c0b76c6308b4558",["0x838897A86Cb4F130D0eFC1203d7dA6D0db4bEd1A"]]
      values.$upgradeCount:
-        1
+        3
      values.guardian:
-        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
+        "0x4e981bAe8E3cd06Ca911ffFE5504B2653ac1C38a"
    }
```

```diff
    contract GenericVaultBridgeToken (0x3DD459dE96F9C28e3a343b831cbDC2B93c8C4855) {
    +++ description: None
      values.accessControl.YIELD_COLLECTOR_ROLE.members.1:
+        "0xcB1e45481461aeF38E6B0a34F1444E9C5D647645"
    }
```

```diff
    contract Conduit Multisig 1 (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      receivedPermissions:
-        [{"permission":"guard","from":"ethereum:0x2F439B95fa789C5d3a5C99cc70EB3ee83D08a811","role":".guardian"},{"permission":"interact","from":"ethereum:0x74034597d29613CC8C0BDc8780e1d292A553Bd32","description":"can pull funds from the contract in case of emergency.","role":".owner"},{"permission":"interact","from":"ethereum:0xb6e1f8B589A14B79DDD3aD7F0589AB548c70C174","description":"it can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system.","role":".owner"},{"permission":"interact","from":"ethereum:0xEaB94275eD336D80d4F46EA8Ea0427e351f11D65","description":"set and change address mappings.","role":".owner","via":[{"address":"ethereum:0x19DbD16f0a8e706D817B7e3b7bcF72917Ebb8832"}]},{"permission":"upgrade","from":"ethereum:0x15a32FCeA89617Ff450F094cDE102CCa46598B7F","role":"admin","via":[{"address":"ethereum:0x19DbD16f0a8e706D817B7e3b7bcF72917Ebb8832"}]},{"permission":"upgrade","from":"ethereum:0x2008A6Ba8CAF85AaFAe7880664Dfe681D533ac2E","role":"admin","via":[{"address":"ethereum:0x19DbD16f0a8e706D817B7e3b7bcF72917Ebb8832"}]},{"permission":"upgrade","from":"ethereum:0x250D30c523104bf0a06825e7eAdE4Dc46EdfE40E","role":"admin","via":[{"address":"ethereum:0x19DbD16f0a8e706D817B7e3b7bcF72917Ebb8832"}]},{"permission":"upgrade","from":"ethereum:0x2F439B95fa789C5d3a5C99cc70EB3ee83D08a811","role":"admin","via":[{"address":"ethereum:0x6d0ff67fb427422AfF35EEa8596949B374b09a52"}]},{"permission":"upgrade","from":"ethereum:0x74034597d29613CC8C0BDc8780e1d292A553Bd32","role":"admin","via":[{"address":"ethereum:0x19DbD16f0a8e706D817B7e3b7bcF72917Ebb8832"}]},{"permission":"upgrade","from":"ethereum:0x79ecD8d8040496014bcD3bA16AdF3914b23f8Fd5","role":"admin","via":[{"address":"ethereum:0x19DbD16f0a8e706D817B7e3b7bcF72917Ebb8832"}]},{"permission":"upgrade","from":"ethereum:0x98906C3f90A06B5484DD67bf32938815d2993dBC","description":"upgrading the bridge implementation can give access to all funds escrowed therein.","role":".$admin","via":[{"address":"ethereum:0x19DbD16f0a8e706D817B7e3b7bcF72917Ebb8832"}]},{"permission":"upgrade","from":"ethereum:0xA84C37cD0b9bA1B43276C11976DBE9d1344C7f4E","role":"admin","via":[{"address":"ethereum:0x19DbD16f0a8e706D817B7e3b7bcF72917Ebb8832"}]},{"permission":"upgrade","from":"ethereum:0xb6e1f8B589A14B79DDD3aD7F0589AB548c70C174","role":"admin","via":[{"address":"ethereum:0x19DbD16f0a8e706D817B7e3b7bcF72917Ebb8832"}]},{"permission":"upgrade","from":"ethereum:0xe06278351d120288eDfCB963F934113Ca3C21AFe","role":"admin","via":[{"address":"ethereum:0x19DbD16f0a8e706D817B7e3b7bcF72917Ebb8832"}]}]
      directlyReceivedPermissions:
-        [{"permission":"act","from":"ethereum:0x19DbD16f0a8e706D817B7e3b7bcF72917Ebb8832","role":".owner"},{"permission":"act","from":"ethereum:0x6d0ff67fb427422AfF35EEa8596949B374b09a52","role":".owner"}]
    }
```

```diff
    contract GenericVaultBridgeToken (0x53E82ABbb12638F09d9e624578ccB666217a765e) {
    +++ description: None
      values.accessControl.YIELD_COLLECTOR_ROLE.members.1:
+        "0xcB1e45481461aeF38E6B0a34F1444E9C5D647645"
    }
```

```diff
    contract ProxyAdmin (0x6d0ff67fb427422AfF35EEa8596949B374b09a52) {
    +++ description: None
      values.owner:
-        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
+        "0x4e981bAe8E3cd06Ca911ffFE5504B2653ac1C38a"
    }
```

```diff
    contract GenericVaultBridgeToken (0x6d4f9f9f8f0155509ecd6Ac6c544fF27999845CC) {
    +++ description: None
      values.accessControl.YIELD_COLLECTOR_ROLE.members.1:
+        "0xcB1e45481461aeF38E6B0a34F1444E9C5D647645"
    }
```

```diff
    contract DelayedWETH (0x74034597d29613CC8C0BDc8780e1d292A553Bd32) {
    +++ description: Contract designed to hold the bonded ETH for each game. It is designed as a wrapper around WETH to allow an owner to function as a backstop if a game would incorrectly distribute funds.
      values.owner:
-        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
+        "0x4e981bAe8E3cd06Ca911ffFE5504B2653ac1C38a"
    }
```

```diff
    contract Polygon Multisig 2 (0x9d851f8b8751c5FbC09b9E74E6e68E9950949052) {
    +++ description: None
      values.$threshold:
-        3
+        2
      values.multisigThreshold:
-        "3 of 5 (60%)"
+        "2 of 5 (40%)"
    }
```

```diff
    contract SystemConfig (0xb6e1f8B589A14B79DDD3aD7F0589AB548c70C174) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      values.owner:
-        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
+        "0x4e981bAe8E3cd06Ca911ffFE5504B2653ac1C38a"
    }
```

```diff
    contract DisputeGameFactory (0xe06278351d120288eDfCB963F934113Ca3C21AFe) {
    +++ description: The dispute game factory allows the creation of dispute games, used to propose state roots and eventually challenge them.
      values.owner:
-        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
+        "0x4e981bAe8E3cd06Ca911ffFE5504B2653ac1C38a"
    }
```

```diff
+   Status: CREATED
    contract Katana Multisig 2 (0x4e981bAe8E3cd06Ca911ffFE5504B2653ac1C38a)
    +++ description: None
```

## Source code changes

```diff
.../.flat/Katana Multisig 2/GnosisSafeL2.sol       | 1032 ++++++++++++++++++++
 .../.flat/Katana Multisig 2/GnosisSafeProxy.p.sol  |   35 +
 2 files changed, 1067 insertions(+)
```

Generated with discovered.json: 0x5d44d99b24dc098733acb03285b80b369e9280f8

# Diff at Fri, 27 Jun 2025 10:25:59 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@1aa90ee63be143107fba7087a30ac92d463e70f3 block: 22780105
- current block number: 22794595

## Description

found the opstack part of katana and some middleware between yearn, morpho and agglayer.

katana is using an OptiPortal2 that [denies all L1->L2 messages.](https://disco.l2beat.com/diff/eth:0x3Da872782f9fB696fD72Af2ec9313a56bDA6f06d/eth:0x9a6C2Dcc7e523f87716e17Ba36D10CCfFA0A60bb) It also does not have any state updates yet. The rest of the system is 'standard' opstack **with** custom gas token support (ETH is set atm, could only be changed with a major upgrade) and standard PermissionedDisputeGame without any games created. Notably this deployment also does not use the latest 7702 protections that the superchain does use.

behind its yearn vaults, katana seems to use a system of smart contracts written by polygon called vaultBridge. For each yielding asset, a vaultBridge contract (erc20 and vault standards) exists and a MigrationManager allows to migrate these derivative vbTokens to the lxly bridge (agglayer shared bridge), which has not happened yet. All user yields are currently accruing to three different Multisigs that have signers from Katana, Agglayer and Yearn (not sure abt morpho).

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22780105 (main branch discovery), not current.

```diff
    contract Yearn Treasury Multisig (0xFEB4acf3df3cDEA7399794D0869ef76A6EfAff52) {
    +++ description: None
      name:
-        "GnosisSafe"
+        "Yearn Treasury Multisig"
    }
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x14Be6579A41342ca6B402ec85E7be538e6Ade951)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1ERC721Bridge (0x15a32FCeA89617Ff450F094cDE102CCa46598B7F)
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
```

```diff
+   Status: CREATED
    contract Yearn Strategist Multisig (0x16388463d60FFE0661Cf7F1f31a7D658aC790ff7)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x19DbD16f0a8e706D817B7e3b7bcF72917Ebb8832)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1CrossDomainMessenger (0x2008A6Ba8CAF85AaFAe7880664Dfe681D533ac2E)
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
```

```diff
+   Status: CREATED
    contract OptimismPortal2 (0x250D30c523104bf0a06825e7eAdE4Dc46EdfE40E)
    +++ description: [PAUSED] The OptimismPortal contract is the main entry point to deposit funds from L1 to L2. It also allows to prove and finalize withdrawals. It specifies which game type can be used for withdrawals, which currently is the PermissionedDisputeGame. This specific fork of the standard contract **disables the depositTransaction() function**, which prevents users from sending or forcing any transactions from L1 to L2, including token deposits.
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x263b251D67BB154DD6b8352539466ACE7948ED56)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GenericVaultBridgeToken (0x2C24B57e2CCd1f273045Af6A5f632504C432374F)
    +++ description: None
```

```diff
+   Status: CREATED
    contract PermissionedDisputeGame (0x2d4B822F8B74AdE7fcD5F740967f4dFcD2fef5e4)
    +++ description: Same as FaultDisputeGame, but only two permissioned addresses are designated as proposer and challenger.
```

```diff
+   Status: CREATED
    contract VbETH (0x2DC70fb75b88d2eB4715bc06E1595E6D97c34DFF)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Safe (0x2De242e27386e224E5fbF110EA8406d5B70740ec)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SuperchainConfig (0x2F439B95fa789C5d3a5C99cc70EB3ee83D08a811)
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x377a9e5df2882DC1DF8A0bD162cbc640eA634010)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GenericVaultBridgeToken (0x3DD459dE96F9C28e3a343b831cbDC2B93c8C4855)
    +++ description: None
```

```diff
+   Status: CREATED
    contract MigrationManager (0x417d01B64Ea30C4E163873f3a1f77b727c689e02)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x420693B32113a0e00Eb9f3315D5D5ec3b32C2d69)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Conduit Multisig 1 (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GenericVaultBridgeToken (0x53E82ABbb12638F09d9e624578ccB666217a765e)
    +++ description: None
```

```diff
+   Status: CREATED
    contract MIPS (0x5fE03a12C1236F9C22Cb6479778DDAa4bce6299C)
    +++ description: The MIPS contract is used to execute the final step of the dispute game which objectively determines the winner of the dispute.
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x6d0ff67fb427422AfF35EEa8596949B374b09a52)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GenericVaultBridgeToken (0x6d4f9f9f8f0155509ecd6Ac6c544fF27999845CC)
    +++ description: None
```

```diff
+   Status: CREATED
    contract DelayedWETH (0x74034597d29613CC8C0BDc8780e1d292A553Bd32)
    +++ description: Contract designed to hold the bonded ETH for each game. It is designed as a wrapper around WETH to allow an owner to function as a backstop if a game would incorrectly distribute funds.
```

```diff
+   Status: CREATED
    contract AnchorStateRegistry (0x79ecD8d8040496014bcD3bA16AdF3914b23f8Fd5)
    +++ description: Contains the latest confirmed state root that can be used as a starting point in a dispute game.
```

```diff
+   Status: CREATED
    contract Safe (0x827e86072B06674a077f592A531dcE4590aDeCdB)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x8970650CF3f1E57cA804C65B4DBcFf698789FE30)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1StandardBridge (0x98906C3f90A06B5484DD67bf32938815d2993dBC)
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
```

```diff
+   Status: CREATED
    contract PreimageOracle (0x9c065e11870B891D214Bc2Da7EF1f9DDFA1BE277)
    +++ description: The PreimageOracle contract is used to load the required data from L1 for a dispute game.
```

```diff
+   Status: CREATED
    contract Polygon Multisig 2 (0x9d851f8b8751c5FbC09b9E74E6e68E9950949052)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OptimismMintableERC20Factory (0xA84C37cD0b9bA1B43276C11976DBE9d1344C7f4E)
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
```

```diff
+   Status: CREATED
    contract Safe (0xA8C31B2edd84c654d06d626383f4154D1E40C5Ff)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SystemConfig (0xb6e1f8B589A14B79DDD3aD7F0589AB548c70C174)
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
```

```diff
+   Status: CREATED
    contract Safe (0xd0673F989bc3BA9314d0AAF28BfC84e99B7898CC)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0xD1e389c046FB734D2a0c7C390312210c408ba832)
    +++ description: None
```

```diff
+   Status: CREATED
    contract DisputeGameFactory (0xe06278351d120288eDfCB963F934113Ca3C21AFe)
    +++ description: The dispute game factory allows the creation of dispute games, used to propose state roots and eventually challenge them.
```

```diff
+   Status: CREATED
    contract AddressManager (0xEaB94275eD336D80d4F46EA8Ea0427e351f11D65)
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
```

```diff
+   Status: CREATED
    contract Katana Multisig (0xf4F2f5F6bAdBE05433C4604320ecC56BbECBC04E)
    +++ description: None
```

Generated with discovered.json: 0xc999da8bc9ac1cc76b4b9adf54debc12d16c2c58

# Diff at Wed, 25 Jun 2025 07:57:08 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@4bade41aedf0f9269688f2c05f04d2992bb2ca38 block: 22637654
- current block number: 22780105

## Description

deposit limit removed for a deposit module governed by yearn strategist MS.

## Watched changes

```diff
    contract Katana Pre-Deposit USDT Token (0x48c03B6FfD0008460F8657Db1037C7e09dEedfcb) {
    +++ description: None
      values.deposit_limit:
-        250000000000000
+        "115792089237316195423570985008687907853269984665640564039457584007913129639935"
      values.deposit_limit_module:
-        "0x0000000000000000000000000000000000000000"
+        "0x793D85F585145c050487c7AfBF0e9B97143fF1CB"
    }
```

```diff
    contract Katana Pre-Deposit USDC Token (0x7B5A0182E400b241b317e781a4e9dEdFc1429822) {
    +++ description: None
      values.deposit_limit:
-        300000000000000
+        "115792089237316195423570985008687907853269984665640564039457584007913129639935"
      values.deposit_limit_module:
-        "0x0000000000000000000000000000000000000000"
+        "0x793D85F585145c050487c7AfBF0e9B97143fF1CB"
    }
```

```diff
    contract Katana Pre-Deposit WBTC Token (0x92C82f5F771F6A44CfA09357DD0575B81BF5F728) {
    +++ description: None
      values.deposit_limit:
-        250000000000
+        "115792089237316195423570985008687907853269984665640564039457584007913129639935"
      values.deposit_limit_module:
-        "0x0000000000000000000000000000000000000000"
+        "0x793D85F585145c050487c7AfBF0e9B97143fF1CB"
    }
```

```diff
    contract Katana Pre-Deposit WETH Token (0xcc6a16Be713f6a714f68b0E1f4914fD3db15fBeF) {
    +++ description: None
      values.deposit_limit:
-        "140000000000000000000000"
+        "115792089237316195423570985008687907853269984665640564039457584007913129639935"
      values.deposit_limit_module:
-        "0x0000000000000000000000000000000000000000"
+        "0x793D85F585145c050487c7AfBF0e9B97143fF1CB"
    }
```

```diff
+   Status: CREATED
    contract DepositModule (0x793D85F585145c050487c7AfBF0e9B97143fF1CB)
    +++ description: None
```

## Source code changes

```diff
.../katana/ethereum/.flat/DepositModule.sol        | 76 ++++++++++++++++++++++
 1 file changed, 76 insertions(+)
```

Generated with discovered.json: 0x26d0d44f72ced7546e79f24db5c69d9d2994af46

# Diff at Wed, 11 Jun 2025 10:34:59 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@9d1575fea6364921032f9ded0a049bdf9fc57604 block: 22637654
- current block number: 22637654

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22637654 (main branch discovery), not current.

```diff
    contract Katana Pre-Deposit USDT Token (0x48c03B6FfD0008460F8657Db1037C7e09dEedfcb) {
    +++ description: None
      sourceHashes.1:
+        "0x5d40986c3a1dd9125adfec96b4aec8a7336eb319d3c4cdde3e55bb1096c11461"
      proxyType:
-        "immutable"
+        "EIP1167 proxy"
      values.$immutable:
-        true
      values.$implementation:
+        "0xd8063123BBA3B480569244AE66BFE72B6c84b00d"
      implementationNames.0xd8063123BBA3B480569244AE66BFE72B6c84b00d:
+        "Yearn V3 Vault"
    }
```

```diff
    contract Katana Pre-Deposit USDC Token (0x7B5A0182E400b241b317e781a4e9dEdFc1429822) {
    +++ description: None
      sourceHashes.1:
+        "0x5d40986c3a1dd9125adfec96b4aec8a7336eb319d3c4cdde3e55bb1096c11461"
      proxyType:
-        "immutable"
+        "EIP1167 proxy"
      values.$immutable:
-        true
      values.$implementation:
+        "0xd8063123BBA3B480569244AE66BFE72B6c84b00d"
      implementationNames.0xd8063123BBA3B480569244AE66BFE72B6c84b00d:
+        "Yearn V3 Vault"
    }
```

```diff
    contract Katana Pre-Deposit WBTC Token (0x92C82f5F771F6A44CfA09357DD0575B81BF5F728) {
    +++ description: None
      sourceHashes.1:
+        "0x5d40986c3a1dd9125adfec96b4aec8a7336eb319d3c4cdde3e55bb1096c11461"
      proxyType:
-        "immutable"
+        "EIP1167 proxy"
      values.$immutable:
-        true
      values.$implementation:
+        "0xd8063123BBA3B480569244AE66BFE72B6c84b00d"
      implementationNames.0xd8063123BBA3B480569244AE66BFE72B6c84b00d:
+        "Yearn V3 Vault"
    }
```

```diff
    contract Katana Pre-Deposit WETH Token (0xcc6a16Be713f6a714f68b0E1f4914fD3db15fBeF) {
    +++ description: None
      sourceHashes.1:
+        "0x5d40986c3a1dd9125adfec96b4aec8a7336eb319d3c4cdde3e55bb1096c11461"
      proxyType:
-        "immutable"
+        "EIP1167 proxy"
      values.$immutable:
-        true
      values.$implementation:
+        "0xd8063123BBA3B480569244AE66BFE72B6c84b00d"
      implementationNames.0xd8063123BBA3B480569244AE66BFE72B6c84b00d:
+        "Yearn V3 Vault"
    }
```

Generated with discovered.json: 0x2f3417effe108cedcb2b9ccc6814066112393c08

# Diff at Thu, 05 Jun 2025 12:10:05 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- current block number: 22637654

## Description

initial katana predeposit disco.

## Initial discovery

```diff
+   Status: CREATED
    contract Accountant (0x40a87104AEb279C061Af6b7C48F7E08c4A6e388D)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Katana Pre-Deposit USDT Token (0x48c03B6FfD0008460F8657Db1037C7e09dEedfcb)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Katana Pre-Deposit USDC Token (0x7B5A0182E400b241b317e781a4e9dEdFc1429822)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ShareReceiver (0x836304B832687f3811a0dF935934C724B40578eB)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Katana Pre-Deposit WBTC Token (0x92C82f5F771F6A44CfA09357DD0575B81BF5F728)
    +++ description: None
```

```diff
+   Status: CREATED
    contract DepositRelayer (0xB01dADEC98308528ee57A17b24A473213c1704bb)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Katana Pre-Deposit WETH Token (0xcc6a16Be713f6a714f68b0E1f4914fD3db15fBeF)
    +++ description: None
```

```diff
+   Status: CREATED
    contract AllowanceModule (0xCFbFaC74C26F8647cBDb8c5caf80BB5b32E43134)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ERC20Router (0xeeeeee9eC4769A09a76A83C7bC42b185872860eE)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafe (0xFEB4acf3df3cDEA7399794D0869ef76A6EfAff52)
    +++ description: None
```
