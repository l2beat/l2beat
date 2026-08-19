Generated with discovered.json: 0xf76fcf8d2aefa08c6f330fde215c2768518ce8d2

# Diff at Wed, 19 Aug 2026 12:10:28 GMT:

- author: Sergey Shemyakov (<sergey.shemyakov@l2beat.com>)
- comparing to: main@a370e767776b076bdee7fe699dbe0b6597849e65 block: 1786615810
- current timestamp: 1787136754

## Description

Verified all contracts and removed spam.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1786615810 (main branch discovery), not current.

```diff
    contract Lighter (robinhood:0x94bAB9693Ba2f6358507eFfcbd372b0660AFfF9d) [N/A] {
    +++ description: None
      unverified:
-        true
      implementationNames.robinhood:0x1be72833f96e47366610CCFb9Bec081FE69EECf5:
-        ""
+        "AdditionalZkLighter"
      sourceHashes:
+        ["0x317a8c60bf36af0b293fad7aaf9ae5d178a0c2ea316b493b5c8b962d4daea6f6","0x7ce2f744c6d607ee57b68b69025659533ae352619bab2cea5c26e5cc9175d95d"]
    }
```

Generated with discovered.json: 0x762eefd9aa9099dd9504c8370f54e277a4717442

# Diff at Thu, 13 Aug 2026 10:41:42 GMT:

- author: Sergey Shemyakov (<sergey.shemyakov@l2beat.com>)
- comparing to: main@6d00177786a5d027e88302fc923a55fb5e236536 block: 1785767480
- current timestamp: 1786615810

## Description

Network governor and upgrade master changed from an EOA to a 3/5 ms (old EOA is one of the members).

Also, many lighter contract fields got discovered, probably due to one of the contracts becoming verified.

## Watched changes

```diff
    EOA Lighter Governor (robinhood:0x42cDb51c23D03c69c05Fa691c3B5517Ace876213) {
    +++ description: None
      receivedPermissions:
-        [{"permission":"interact","from":"robinhood:0xf6F6Bd6eEA2b9A2041328732CcAe4c5e1DD278B7","description":"manage validators, update the address that manages the insurance fund, update the treasury address that collects fees from markets, add and update markets and assets.","role":".networkGovernor"},{"permission":"upgrade","from":"robinhood:0x94bAB9693Ba2f6358507eFfcbd372b0660AFfF9d","role":"admin","via":[{"address":"robinhood:0x43CfF77CD060A155dCe5deb12B93b875f69F2716","delay":1814400}]},{"permission":"upgrade","from":"robinhood:0xe1aFBE2D670eFF0e7C8A41F080792C011916ac31","role":"admin","via":[{"address":"robinhood:0x43CfF77CD060A155dCe5deb12B93b875f69F2716","delay":1814400}]},{"permission":"upgrade","from":"robinhood:0xf6F6Bd6eEA2b9A2041328732CcAe4c5e1DD278B7","role":"admin","via":[{"address":"robinhood:0x43CfF77CD060A155dCe5deb12B93b875f69F2716","delay":1814400}]}]
      directlyReceivedPermissions:
-        [{"permission":"act","from":"robinhood:0x43CfF77CD060A155dCe5deb12B93b875f69F2716","delay":1814400,"role":".getMaster"}]
      eoaWithUpgradePermissions:
-        true
    }
```

```diff
    contract UpgradeGatekeeper (robinhood:0x43CfF77CD060A155dCe5deb12B93b875f69F2716) [lighter/UpgradeGatekeeper] {
    +++ description: Governance contract functioning like an upgrade timelock for downstream contracts. The current delay is 21d and can be entirely skipped by robinhood:0x4972E0CaCb2AC45644BA054838e96fF4f6f7eFDb.
+++ severity: HIGH
      values.getMaster:
-        "robinhood:0x42cDb51c23D03c69c05Fa691c3B5517Ace876213"
+        "robinhood:0x8Caf9FF9392F39E87cBC65A130c026caaCD321ef"
    }
```

```diff
    contract Lighter (robinhood:0x94bAB9693Ba2f6358507eFfcbd372b0660AFfF9d) [N/A] {
    +++ description: None
      values.lastVerifiedStateRoot:
-        "0x7bb3507766d0a6cf31a2fcc1e3185206f797ce0fac1126dc276e1be5de9a8135"
+        "0x0baaad506ee8ac901c9464f0aa869df325e25c5720ebaf12fe0088652a908c88"
      values.lastVerifiedValidiumRoot:
-        "0x479fc285e15020f8af391a5de57116592c83633d7a7384a93df0261bee1042d7"
+        "0x941b1cc85a411f5ce91565555a0778cdd701e5299f2abda7e1dc31353f8dbfc9"
      values.stateRoot:
-        "0x7bb3507766d0a6cf31a2fcc1e3185206f797ce0fac1126dc276e1be5de9a8135"
+        "0x0baaad506ee8ac901c9464f0aa869df325e25c5720ebaf12fe0088652a908c88"
      values.validiumRoot:
-        "0x479fc285e15020f8af391a5de57116592c83633d7a7384a93df0261bee1042d7"
+        "0x941b1cc85a411f5ce91565555a0778cdd701e5299f2abda7e1dc31353f8dbfc9"
    }
```

```diff
    contract Governance (robinhood:0xf6F6Bd6eEA2b9A2041328732CcAe4c5e1DD278B7) [lighter/Governance] {
    +++ description: Manages the list of validators and the network governor.
+++ severity: HIGH
      values.networkGovernor:
-        "robinhood:0x42cDb51c23D03c69c05Fa691c3B5517Ace876213"
+        "robinhood:0x8Caf9FF9392F39E87cBC65A130c026caaCD321ef"
    }
```

```diff
+   Status: CREATED
    contract SafeL2 (robinhood:0x8Caf9FF9392F39E87cBC65A130c026caaCD321ef) [GnosisSafe]
    +++ description: None
```

## Source code changes

```diff
.../lighter-robinhood/.flat/SafeL2/SafeL2.sol      | 1286 ++++++++++++++++++++
 .../lighter-robinhood/.flat/SafeL2/SafeProxy.p.sol |   42 +
 2 files changed, 1328 insertions(+)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1785767480 (main branch discovery), not current.

```diff
    contract Lighter (robinhood:0x94bAB9693Ba2f6358507eFfcbd372b0660AFfF9d) [N/A] {
    +++ description: None
+++ severity: HIGH
      values.desertMode:
+        false
      values.insuranceFundOperator:
+        "robinhood:0x6cCdD1f3f599C69fA74eeDc3dab28559fe99aB0A"
      values.lastVerifiedStateRoot:
+        "0x7bb3507766d0a6cf31a2fcc1e3185206f797ce0fac1126dc276e1be5de9a8135"
      values.lastVerifiedValidiumRoot:
+        "0x479fc285e15020f8af391a5de57116592c83633d7a7384a93df0261bee1042d7"
      values.MAX_ACCOUNT_INDEX:
+        281474976710654
      values.MAX_API_KEY_INDEX:
+        254
      values.MAX_ASSET_INDEX:
+        62
      values.MAX_BATCH_DEPOSIT_LENGTH:
+        1000
      values.MAX_DEPOSIT_CAP_TICKS:
+        "1152921504606846975"
      values.MAX_MASTER_ACCOUNT_INDEX:
+        140737488355327
      values.MAX_ORDER_BASE_AMOUNT:
+        281474976710655
      values.MAX_ORDER_PRICE:
+        4294967295
      values.MAX_ORDER_QUOTE_AMOUNT:
+        281474976710655
      values.MAX_PERPS_MARKET_INDEX:
+        254
      values.MAX_POOL_SHARES_TO_MINT_OR_BURN:
+        "1152921504606846975"
      values.MAX_SPOT_MARKET_INDEX:
+        4094
      values.MAX_STAKING_SHARES_TO_MINT_OR_BURN:
+        "1152921504606846975"
      values.MAX_TICK_SIZE:
+        "340282366920938463463374607431768211455"
      values.MIN_ASSET_INDEX:
+        1
      values.MIN_ORDER_PRICE:
+        1
      values.MIN_POOL_SHARES_TO_MINT_OR_BURN:
+        1
      values.MIN_SPOT_MARKET_INDEX:
+        2048
      values.MIN_STAKING_SHARES_TO_MINT_OR_BURN:
+        1
      values.NATIVE_ASSET_INDEX:
+        1
      values.NIL_ACCOUNT_INDEX:
+        281474976710655
      values.QUOTE_ASSET_INDEX:
+        3
      values.stateRoot:
+        "0x7bb3507766d0a6cf31a2fcc1e3185206f797ce0fac1126dc276e1be5de9a8135"
      values.treasury:
+        "robinhood:0xAc71eC137c892d02d531e48cEb1D060f9C9AC357"
      values.validiumRoot:
+        "0x479fc285e15020f8af391a5de57116592c83633d7a7384a93df0261bee1042d7"
      fieldMeta.desertMode:
+        {"severity":"HIGH"}
      implementationNames.robinhood:0xE470e41Cacc197EA07f879577765A8c81234ED7B:
-        ""
+        "ZkLighter"
    }
```

Generated with discovered.json: 0x35f0856968b5f4f51e2907a834580fee7fb666c4

# Diff at Mon, 03 Aug 2026 14:32:34 GMT:

- author: Sergey Shemyakov (<sergey.shemyakov@l2beat.com>)
- comparing to: main@44e2212a46e585fd2ddb21d6755695cf74e1f876 block: 1785249432
- current timestamp: 1785767480

## Description

Verified the source code of desert verifier. It is equivalent to the one in Lighter deployment on Ethereum.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1785249432 (main branch discovery), not current.

```diff
    contract DesertVerifier (robinhood:0x56aeED6920DBB9E198C2C0072147A45684A06E10) [N/A] {
    +++ description: None
      unverified:
-        true
      implementationNames.robinhood:0x56aeED6920DBB9E198C2C0072147A45684A06E10:
-        ""
+        "DesertVerifier"
      sourceHashes:
+        ["0xcedbddf6ef097d451ba200328780c0cc492b65383f8dc44e760ec70eee4f8850"]
    }
```

```diff
    contract Governance (robinhood:0xf6F6Bd6eEA2b9A2041328732CcAe4c5e1DD278B7) [lighter/Governance] {
    +++ description: Manages the list of validators and the network governor.
      deployerAddress:
+        "robinhood:0x42cDb51c23D03c69c05Fa691c3B5517Ace876213"
      sinceTimestamp:
+        1782477747
      sinceBlock:
+        229410
    }
```

Generated with discovered.json: 0xf704c3228f6a40b431bfe9843954067403a4382d

# Diff at Tue, 28 Jul 2026 14:38:19 GMT:

- author: vincfurc (<vincfurc@users.noreply.github.com>)
- comparing to: main@fb0b50e4a7f7900d17e186f908b2b3ca3e977527 block: 1784882184
- current timestamp: 1785249432

## Description

Deployer address, timestamp and block resolved for UpgradeGatekeeper, DesertVerifier and Lighter.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1784882184 (main branch discovery), not current.

```diff
    contract UpgradeGatekeeper (robinhood:0x43CfF77CD060A155dCe5deb12B93b875f69F2716) [lighter/UpgradeGatekeeper] {
    +++ description: Governance contract functioning like an upgrade timelock for downstream contracts. The current delay is 21d and can be entirely skipped by robinhood:0x4972E0CaCb2AC45644BA054838e96fF4f6f7eFDb.
      deployerAddress:
+        "robinhood:0x42cDb51c23D03c69c05Fa691c3B5517Ace876213"
      sinceTimestamp:
+        1782477747
      sinceBlock:
+        229410
    }
```

```diff
    contract DesertVerifier (robinhood:0x56aeED6920DBB9E198C2C0072147A45684A06E10) [N/A] {
    +++ description: None
      deployerAddress:
+        "robinhood:0x42cDb51c23D03c69c05Fa691c3B5517Ace876213"
      sinceTimestamp:
+        1784265403
      sinceBlock:
+        11861471
    }
```

```diff
    contract Lighter (robinhood:0x94bAB9693Ba2f6358507eFfcbd372b0660AFfF9d) [N/A] {
    +++ description: None
      deployerAddress:
+        "robinhood:0x42cDb51c23D03c69c05Fa691c3B5517Ace876213"
      sinceTimestamp:
+        1782477747
      sinceBlock:
+        229410
    }
```

```diff
    contract ZkLighterVerifier (robinhood:0xe1aFBE2D670eFF0e7C8A41F080792C011916ac31) [lighter/ZkLighterVerifier] {
    +++ description: The main ZK verifier of Lighter, settles the proofs of correct L2 state transition in the case of normal rollup operation.
      deployerAddress:
+        "robinhood:0x42cDb51c23D03c69c05Fa691c3B5517Ace876213"
      sinceTimestamp:
+        1782477747
      sinceBlock:
+        229410
    }
```

Generated with discovered.json: 0xa63ba73bc31c2571c9d38b3c1ebca4200477a281

# Diff at Mon, 20 Jul 2026 11:15:48 GMT:

- author: vincfurc (<vincfurc@users.noreply.github.com>)
- comparing to: main@b461afee5f10587a00295a471b2542eba2686ebb block: 1783954937
- current timestamp: 1784545986

## Description

Lighter Robinhood upgraded ZkLighter and AdditionalZkLighter contracts and
replaced the desert-mode verifier. The new implementations are not verified on
Blockscout, so their source cannot be fetched.

## Watched changes

```diff
    contract UpgradeGatekeeper (robinhood:0x43CfF77CD060A155dCe5deb12B93b875f69F2716) [lighter/UpgradeGatekeeper] {
    +++ description: Governance contract functioning like an upgrade timelock for downstream contracts. The current delay is 21d and can be entirely skipped by robinhood:0x4972E0CaCb2AC45644BA054838e96fF4f6f7eFDb.
      values.versionId:
-        3
+        4
    }
```

```diff
-   Status: DELETED
    contract DesertVerifierAlwaysTrueOld (robinhood:0x443Cc0c7f773D0955E3Bd8DA393b708152cFA5Bc) [lighter/DesertVerifierAlwaysTrue]
    +++ description: The verifier used for desert-mode withdrawals. It does not validate proofs or public inputs.
```

```diff
    contract Lighter (robinhood:0x94bAB9693Ba2f6358507eFfcbd372b0660AFfF9d) [N/A] {
    +++ description: None
      template:
-        "lighter/ZkLighterWithSpotQuoteAsset"
      sourceHashes:
-        ["0x317a8c60bf36af0b293fad7aaf9ae5d178a0c2ea316b493b5c8b962d4daea6f6","0x86f638acded19238eadee62f3969d0beb270e3406a22bb47e816b5a3b0acdd42"]
      description:
-        "The main rollup contract. It processes L2 batches, manages token deposits and withdrawals, allows users to submit priority requests and controls desert mode (escape hatch). This variant uses a configurable quote asset and commits state differences through host-chain calldata instead of EIP-4844 blob hashes. Logic is split between two contracts because of code-size limits, with many operations delegated to AdditionalZkLighter."
      values.$implementation.0:
-        "robinhood:0x6C23703ba62a845893758ea35E5eD854639ef8BA"
+        "robinhood:0xE470e41Cacc197EA07f879577765A8c81234ED7B"
      values.$implementation.1:
-        "robinhood:0x57af7CA7F40Ee33ac974c4eE864932241671c7D4"
+        "robinhood:0x1be72833f96e47366610CCFb9Bec081FE69EECf5"
      values.additionalZkLighter:
-        "robinhood:0x57af7CA7F40Ee33ac974c4eE864932241671c7D4"
+        "robinhood:0x1be72833f96e47366610CCFb9Bec081FE69EECf5"
      values.assetConfigNative:
-        {"tokenAddress":"robinhood:0x0000000000000000000000000000000000000000","withdrawalsEnabled":1,"extensionMultiplier":100,"tickSize":10000000000,"depositCapTicks":"1152921504606846975","minDepositTicks":100000}
      values.assetConfigQuote:
-        {"tokenAddress":"robinhood:0x5fc5360D0400a0Fd4f2af552ADD042D716F1d168","withdrawalsEnabled":1,"extensionMultiplier":1000000,"tickSize":1,"depositCapTicks":"1152921504606846975","minDepositTicks":1000000}
      values.committedBatchesCount:
-        17940
      values.committedPriorityRequestCount:
-        1213
      values.createdMarkets:
-        ["ETH","BTC","HYPE","SOL","ZEC","LIT","XRP","NEAR","VVV","SUI","AAPL","AMZN","GOOGL","META","MSFT","NVDA","TSLA","ORCL","SPCX","BABA","BE","USAR","USO","COIN","CRCL","QQQ","SPY","SGOV","SLV","AMD","INTC","MU","SNDK","CRWV","PLTR","AAPL/USDG","AMZN/USDG","GOOGL/USDG","META/USDG","MSFT/USDG","NVDA/USDG","TSLA/USDG","ORCL/USDG","SPCX/USDG","BABA/USDG","BE/USDG","USAR/USDG","USO/USDG","COIN/USDG","CRCL/USDG","QQQ/USDG","SPY/USDG","SGOV/USDG","SLV/USDG","AMD/USDG","INTC/USDG","MU/USDG","SNDK/USDG","CRWV/USDG","PLTR/USDG","ETH/USDG","SOXL","CASHCAT"]
      values.desertMode:
-        false
+++ severity: HIGH
      values.desertVerifier:
-        "robinhood:0x443Cc0c7f773D0955E3Bd8DA393b708152cFA5Bc"
+        "robinhood:0x56aeED6920DBB9E198C2C0072147A45684A06E10"
      values.executedBatchesCount:
-        17874
      values.executedOnChainBatchesCount:
-        323
      values.executedPriorityRequestCount:
-        1210
      values.getTarget:
-        "robinhood:0x6C23703ba62a845893758ea35E5eD854639ef8BA"
+        "robinhood:0xE470e41Cacc197EA07f879577765A8c81234ED7B"
      values.insuranceFundOperator:
-        "robinhood:0x6cCdD1f3f599C69fA74eeDc3dab28559fe99aB0A"
      values.lastAccountIndex:
-        534
      values.lastVerifiedEndBlockNumber:
-        2882902
      values.lastVerifiedStateRoot:
-        "0xd34c146306c2222cccb52d484adb883b4ae4c823ec6d8830406124275070af05"
      values.lastVerifiedValidiumRoot:
-        "0x30f7666dda3b578e15770e3dd89523474811e9c75b2d861a7194e96ca6cb1108"
      values.MAX_ACCOUNT_INDEX:
-        281474976710654
      values.MAX_API_KEY_INDEX:
-        254
      values.MAX_ASSET_INDEX:
-        62
      values.MAX_BATCH_DEPOSIT_LENGTH:
-        1000
      values.MAX_DEPOSIT_CAP_TICKS:
-        "1152921504606846975"
      values.MAX_MASTER_ACCOUNT_INDEX:
-        140737488355327
      values.MAX_ORDER_BASE_AMOUNT:
-        281474976710655
      values.MAX_ORDER_PRICE:
-        4294967295
      values.MAX_ORDER_QUOTE_AMOUNT:
-        281474976710655
      values.MAX_PERPS_MARKET_INDEX:
-        254
      values.MAX_POOL_SHARES_TO_MINT_OR_BURN:
-        "1152921504606846975"
      values.MAX_SPOT_MARKET_INDEX:
-        4094
      values.MAX_STAKING_SHARES_TO_MINT_OR_BURN:
-        "1152921504606846975"
      values.MAX_TICK_SIZE:
-        "340282366920938463463374607431768211455"
      values.MIN_ASSET_INDEX:
-        1
      values.MIN_ORDER_PRICE:
-        1
      values.MIN_POOL_SHARES_TO_MINT_OR_BURN:
-        1
      values.MIN_SPOT_MARKET_INDEX:
-        2048
      values.MIN_STAKING_SHARES_TO_MINT_OR_BURN:
-        1
      values.NATIVE_ASSET_INDEX:
-        1
      values.NIL_ACCOUNT_INDEX:
-        281474976710655
      values.openPriorityRequestCount:
-        3
      values.pendingOnChainBatchesCount:
-        0
      values.QUOTE_ASSET_INDEX:
-        3
      values.registeredAssets:
-        [{"assetIndex":1,"tokenAddress":"robinhood:0x0000000000000000000000000000000000000000"},{"assetIndex":3,"tokenAddress":"robinhood:0x5fc5360D0400a0Fd4f2af552ADD042D716F1d168"},{"assetIndex":4,"tokenAddress":"robinhood:0xaF3D76f1834A1d425780943C99Ea8A608f8a93f9"},{"assetIndex":5,"tokenAddress":"robinhood:0x12f190a9F9d7D37a250758b26824B97CE941bF54"},{"assetIndex":6,"tokenAddress":"robinhood:0x2e0847E8910a9732eB3fb1bb4b70a580ADAD4FE3"},{"assetIndex":7,"tokenAddress":"robinhood:0xc0D6457C16Cc70d6790Dd43521C899C87ce02f35"},{"assetIndex":8,"tokenAddress":"robinhood:0xe93237C50D904957Cf27E7B1133b510C669c2e74"},{"assetIndex":9,"tokenAddress":"robinhood:0xd0601CE157Db5bdC3162BbaC2a2C8aF5320D9EEC"},{"assetIndex":10,"tokenAddress":"robinhood:0x322F0929c4625eD5bAd873c95208D54E1c003b2d"},{"assetIndex":11,"tokenAddress":"robinhood:0xb0992820E760d836549ba69BC7598b4af75dEE03"},{"assetIndex":12,"tokenAddress":"robinhood:0x4a0E65A3EcceC6dBe60AE065F2e7bb85Fae35eEa"},{"assetIndex":13,"tokenAddress":"robinhood:0xad25Ac6C84D497db898fa1E8387bf6Af3532a1c4"},{"assetIndex":14,"tokenAddress":"robinhood:0x822CC93fFD030293E9842c30BBD678F530701867"},{"assetIndex":15,"tokenAddress":"robinhood:0xd917B029C761D264c6A312BBbcDA868658eF86a6"},{"assetIndex":16,"tokenAddress":"robinhood:0xa30FA36Db767ad9eD3f7a60fC79526fB4d56D344"},{"assetIndex":17,"tokenAddress":"robinhood:0x6330D8C3178a418788dF01a47479c0ce7CCF450b"},{"assetIndex":18,"tokenAddress":"robinhood:0xdF0992E440dD0be65BD8439b609d6D4366bf1CB5"},{"assetIndex":19,"tokenAddress":"robinhood:0xD5f3879160bc7c32ebb4dC785F8a4F505888de68"},{"assetIndex":20,"tokenAddress":"robinhood:0x117cc2133c37B721F49dE2A7a74833232B3B4C0C"},{"assetIndex":21,"tokenAddress":"robinhood:0x92FD66527192E3e61d4DDd13322Aa222DE86F9B5"},{"assetIndex":22,"tokenAddress":"robinhood:0x411eFb0E7f985935DAec3D4C3ebaEa0d0AD7D89f"},{"assetIndex":23,"tokenAddress":"robinhood:0x86923f96303D656E4aa86D9d42D1e57ad2023fdC"},{"assetIndex":24,"tokenAddress":"robinhood:0xc72b96e0E48ecd4DC75E1e45396e26300BC39681"},{"assetIndex":25,"tokenAddress":"robinhood:0xfF080c8ce2E5feadaCa0Da81314Ae59D232d4afD"},{"assetIndex":26,"tokenAddress":"robinhood:0xB90A19fF0Af67f7779afF50A882A9CfF42446400"},{"assetIndex":27,"tokenAddress":"robinhood:0x5f10A1C971B69e47e059e1dC91901B59b3fB49C3"},{"assetIndex":28,"tokenAddress":"robinhood:0x894E1EC2D74FFE5AEF8Dc8A9e84686acCB964F2A"}]
      values.stateRoot:
-        "0xd34c146306c2222cccb52d484adb883b4ae4c823ec6d8830406124275070af05"
      values.stateRootUpgradeVerifier:
-        "robinhood:0x0000000000000000000000000000000000000000"
      values.treasury:
-        "robinhood:0xAc71eC137c892d02d531e48cEb1D060f9C9AC357"
      values.validiumRoot:
-        "0x30f7666dda3b578e15770e3dd89523474811e9c75b2d861a7194e96ca6cb1108"
      values.verifiedBatchesCount:
-        17874
      values.verifiedPriorityRequestCount:
-        1210
      fieldMeta.desertMode:
-        {"severity":"HIGH"}
      implementationNames.robinhood:0x6C23703ba62a845893758ea35E5eD854639ef8BA:
-        "ZkLighter"
      implementationNames.robinhood:0x57af7CA7F40Ee33ac974c4eE864932241671c7D4:
-        "AdditionalZkLighter"
      implementationNames.robinhood:0xE470e41Cacc197EA07f879577765A8c81234ED7B:
+        ""
      implementationNames.robinhood:0x1be72833f96e47366610CCFb9Bec081FE69EECf5:
+        ""
      unverified:
+        true
    }
```

```diff
+   Status: CREATED
    contract DesertVerifier (robinhood:0x56aeED6920DBB9E198C2C0072147A45684A06E10) [N/A]
    +++ description: None
```

## Source code changes

```diff
.../DesertVerifierAlwaysTrueOld.sol => /dev/null   |   22 -
 .../Lighter/AdditionalZkLighter.2.sol => /dev/null | 3838 ---------------
 .../Lighter/ZkLighter.1.sol => /dev/null           | 5015 --------------------
 3 files changed, 8875 deletions(-)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1783954937 (main branch discovery), not current.

```diff
    contract DesertVerifierAlwaysTrueOld (robinhood:0x443Cc0c7f773D0955E3Bd8DA393b708152cFA5Bc) [lighter/DesertVerifierAlwaysTrue] {
    +++ description: The verifier used for desert-mode withdrawals. It does not validate proofs or public inputs.
      name:
-        "DesertVerifier"
+        "DesertVerifierAlwaysTrueOld"
    }
```

Generated with discovered.json: 0x47b2c0cd4fa39920b052f421440f6d68ed564c81

# Diff at Mon, 13 Jul 2026 15:03:25 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- current timestamp: 1783954937

## Description

Initial discovery of the USDG-quoted Lighter instance on Robinhood Chain.

## Initial discovery

```diff
+   Status: CREATED
    contract UpgradeGatekeeper (robinhood:0x43CfF77CD060A155dCe5deb12B93b875f69F2716) [lighter/UpgradeGatekeeper]
    +++ description: Governance contract functioning like an upgrade timelock for downstream contracts. The current delay is 21d and can be entirely skipped by robinhood:0x4972E0CaCb2AC45644BA054838e96fF4f6f7eFDb.
```

```diff
+   Status: CREATED
    contract DesertVerifier (robinhood:0x443Cc0c7f773D0955E3Bd8DA393b708152cFA5Bc) [lighter/DesertVerifierAlwaysTrue]
    +++ description: The verifier used for desert-mode withdrawals. It does not validate proofs or public inputs.
```

```diff
+   Status: CREATED
    contract Lighter (robinhood:0x94bAB9693Ba2f6358507eFfcbd372b0660AFfF9d) [lighter/ZkLighterWithSpotQuoteAsset]
    +++ description: The main rollup contract. It processes L2 batches, manages token deposits and withdrawals, allows users to submit priority requests and controls desert mode (escape hatch). This variant uses a configurable quote asset and commits state differences through host-chain calldata instead of EIP-4844 blob hashes. Logic is split between two contracts because of code-size limits, with many operations delegated to AdditionalZkLighter.
```

```diff
+   Status: CREATED
    contract ZkLighterVerifier (robinhood:0xe1aFBE2D670eFF0e7C8A41F080792C011916ac31) [lighter/ZkLighterVerifier]
    +++ description: The main ZK verifier of Lighter, settles the proofs of correct L2 state transition in the case of normal rollup operation.
```

```diff
+   Status: CREATED
    contract Governance (robinhood:0xf6F6Bd6eEA2b9A2041328732CcAe4c5e1DD278B7) [lighter/Governance]
    +++ description: Manages the list of validators and the network governor.
```
