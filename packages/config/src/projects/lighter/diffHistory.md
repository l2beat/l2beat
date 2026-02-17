Generated with discovered.json: 0x4d2c039a81c63a5ed6b730f9a9208aac914925b2

# Diff at Fri, 13 Feb 2026 09:55:35 GMT:

- author: Sergey Shemyakov (<sergey.shemyakov@l2beat.com>)
- comparing to: main@76c91db634aafdce14aca08d74e9d04bb256d971 block: 1769695256
- current timestamp: 1770975901

## Description

Upgraded zk circuits and the verifier, probably to allow unified collateral for spot and perps: https://x.com/Lighter_xyz/status/2022098082419085536. Main rollup contract has only 1 line diff in init params commitment: 
https://disco.l2beat.com/diff/eth:0x8bdccd961Ae8b8B99dBA5FbAd0e5AA92bE8c59Fb/eth:0x803bd6a0577c083c1EDe82Da455C8e69e697c878. Also added AZTEC token for spot and perps.

## Watched changes

```diff
    contract Lighter (eth:0x3B4D794a66304F130a4Db8F2551B0070dfCf5ca7) {
    +++ description: The main rollup contract. It processes L2 batches, manages token deposits and withdrawals, allows users to submit censorship-resistant L2 transactions and controls desert mode (escape hatch). Logic is split between two contracts because of code-size limits, many operations are delegated to AdditionalZKLighter.
      sourceHashes.1:
-        "0x6811045a7db4a2039e15ce02aad40f93a195abf3b68a900d217df71c7ab37294"
+        "0x4a50bcb82038f6198f88207da255045d7547680f7a48c66d23055539b0481a94"
      values.$implementation.0:
-        "eth:0x8bdccd961Ae8b8B99dBA5FbAd0e5AA92bE8c59Fb"
+        "eth:0x803bd6a0577c083c1EDe82Da455C8e69e697c878"
      values.getTarget:
-        "eth:0x8bdccd961Ae8b8B99dBA5FbAd0e5AA92bE8c59Fb"
+        "eth:0x803bd6a0577c083c1EDe82Da455C8e69e697c878"
      values.l2AssetRegistrations.6:
+        "0x415a544543000000000000000000000000000000000000000000000000000000"
      values.registeredAssets.8:
+        {"assetIndex":10,"tokenAddress":"eth:0xA27EC0006e59f245217Ff08CD52A7E8b169E62D2"}
      implementationNames.eth:0x8bdccd961Ae8b8B99dBA5FbAd0e5AA92bE8c59Fb:
-        "ZkLighter"
      implementationNames.eth:0x803bd6a0577c083c1EDe82Da455C8e69e697c878:
+        "ZkLighter"
    }
```

```diff
    contract UpgradeGatekeeper (eth:0x94da8A995D0D82Ef0fE7E509C6D76c22603B6f67) {
    +++ description: Governance contract functioning like an upgrade timelock for downstream contracts. The current delay is 21d and can be entirely skipped by eth:0x92b12c9d85BF7bd2EF5d2F53F4cd4Ce0BE432045.
      values.versionId:
-        40
+        41
    }
```

```diff
    contract ZkLighterVerifier (eth:0xac3Ce44B6ff4E402858C99D5699ff63131572BaA) {
    +++ description: The main ZK verifier of Lighter, settles the proofs of correct L2 state transition in the case of normal rollup operation.
      sourceHashes.1:
-        "0x57ba399070a3a90c1102fb18ab80843663d4f8d89d04de81a4269c20f966b8db"
+        "0x416b91076dec996ebb7ab201896a76509106ed06864f1e84a468a897241040c8"
      values.$implementation:
-        "eth:0x6d456bCAAc437EAa3f8603E06C5850d88D3A48F7"
+        "eth:0xC5d17b2ae295F81209410B00a791720660efc706"
      values.getTarget:
-        "eth:0x6d456bCAAc437EAa3f8603E06C5850d88D3A48F7"
+        "eth:0xC5d17b2ae295F81209410B00a791720660efc706"
      implementationNames.eth:0x6d456bCAAc437EAa3f8603E06C5850d88D3A48F7:
-        "ZkLighterVerifier"
      implementationNames.eth:0xC5d17b2ae295F81209410B00a791720660efc706:
+        "ZkLighterVerifier"
    }
```

## Source code changes

```diff
.../lighter/{.flat@1769695256 => .flat}/Lighter/ZkLighter.1.sol   | 2 +-
 .../ZkLighterVerifier/ZkLighterVerifier.sol                       | 8 ++++----
 2 files changed, 5 insertions(+), 5 deletions(-)
```

Generated with discovered.json: 0x2e8428eaf25b87d841928a52b6994c53cfc58aae

# Diff at Thu, 29 Jan 2026 14:05:01 GMT:

- author: Sergey Shemyakov (<sergey.shemyakov@l2beat.com>)
- comparing to: main@8ab8b3539ad858470e2faf1383cbd783a9c5cdc5 block: 1768992487
- current timestamp: 1769695256

## Description

Diff for Lighter implementation: https://disco.l2beat.com/diff/eth:0xe5FB592Ef1b620909000Af0D5fb55a3593026142/eth:0x8bdccd961Ae8b8B99dBA5FbAd0e5AA92bE8c59Fb, diff for additional lighter implementation: https://disco.l2beat.com/diff/eth:0x9307350AF47B0C0e7f8cA5ED2D57993aF3a6df1d/eth:0xF7627A2ab5cD6a5Cdbb84ffa96afE21A136B05d9. 

Refactored some events, added only governance function `setSystemConfig` to set liquidityPoolCooldownPeriod and / or stakingPoolLockupPeriod.

Updated circuits and upgraded the verifier.

## Watched changes

```diff
    contract Lighter (eth:0x3B4D794a66304F130a4Db8F2551B0070dfCf5ca7) {
    +++ description: The main rollup contract. It processes L2 batches, manages token deposits and withdrawals, allows users to submit censorship-resistant L2 transactions and controls desert mode (escape hatch). Logic is split between two contracts because of code-size limits, many operations are delegated to AdditionalZKLighter.
      sourceHashes.1:
-        "0x016ec5f80bfe1e98a099c8e237105be90b1da112de262adc17dcec715a4ee173"
+        "0x6811045a7db4a2039e15ce02aad40f93a195abf3b68a900d217df71c7ab37294"
      values.$implementation.0:
-        "eth:0xe5FB592Ef1b620909000Af0D5fb55a3593026142"
+        "eth:0x8bdccd961Ae8b8B99dBA5FbAd0e5AA92bE8c59Fb"
      values.$implementation.1:
-        "eth:0x9307350AF47B0C0e7f8cA5ED2D57993aF3a6df1d"
+        "eth:0xF7627A2ab5cD6a5Cdbb84ffa96afE21A136B05d9"
      values.additionalZkLighter:
-        "eth:0x9307350AF47B0C0e7f8cA5ED2D57993aF3a6df1d"
+        "eth:0xF7627A2ab5cD6a5Cdbb84ffa96afE21A136B05d9"
      values.getTarget:
-        "eth:0xe5FB592Ef1b620909000Af0D5fb55a3593026142"
+        "eth:0x8bdccd961Ae8b8B99dBA5FbAd0e5AA92bE8c59Fb"
      values.MAX_STAKING_SHARES_TO_MINT_OR_BURN:
+        "1152921504606846975"
      values.MIN_STAKING_SHARES_TO_MINT_OR_BURN:
+        1
      implementationNames.eth:0xe5FB592Ef1b620909000Af0D5fb55a3593026142:
-        "ZkLighter"
      implementationNames.eth:0x9307350AF47B0C0e7f8cA5ED2D57993aF3a6df1d:
-        "AdditionalZkLighter"
      implementationNames.eth:0x8bdccd961Ae8b8B99dBA5FbAd0e5AA92bE8c59Fb:
+        "ZkLighter"
      implementationNames.eth:0xF7627A2ab5cD6a5Cdbb84ffa96afE21A136B05d9:
+        "AdditionalZkLighter"
    }
```

```diff
    contract UpgradeGatekeeper (eth:0x94da8A995D0D82Ef0fE7E509C6D76c22603B6f67) {
    +++ description: Governance contract functioning like an upgrade timelock for downstream contracts. The current delay is 21d and can be entirely skipped by eth:0x92b12c9d85BF7bd2EF5d2F53F4cd4Ce0BE432045.
      values.versionId:
-        39
+        40
    }
```

```diff
    contract ZkLighterVerifier (eth:0xac3Ce44B6ff4E402858C99D5699ff63131572BaA) {
    +++ description: The main ZK verifier of Lighter, settles the proofs of correct L2 state transition in the case of normal rollup operation.
      sourceHashes.1:
-        "0x79079aeaad31dee0624b3c5ccc8c7486d4ec771dcf6ca6a7f0b178c94357be9b"
+        "0x57ba399070a3a90c1102fb18ab80843663d4f8d89d04de81a4269c20f966b8db"
      values.$implementation:
-        "eth:0x023B02ad3b8f9045595Ac7139FdBA643b562cfe3"
+        "eth:0x6d456bCAAc437EAa3f8603E06C5850d88D3A48F7"
      values.getTarget:
-        "eth:0x023B02ad3b8f9045595Ac7139FdBA643b562cfe3"
+        "eth:0x6d456bCAAc437EAa3f8603E06C5850d88D3A48F7"
      implementationNames.eth:0x023B02ad3b8f9045595Ac7139FdBA643b562cfe3:
-        "ZkLighterVerifier"
      implementationNames.eth:0x6d456bCAAc437EAa3f8603E06C5850d88D3A48F7:
+        "ZkLighterVerifier"
    }
```

## Source code changes

```diff
.../Lighter/AdditionalZkLighter.2.sol              | 142 ++++---
 .../Lighter/ZkLighter.1.sol                        |  56 ++-
 .../ZkLighterVerifier/ZkLighterVerifier.sol        | 471 ++++++++++-----------
 3 files changed, 346 insertions(+), 323 deletions(-)
```

Generated with discovered.json: 0x9dc5ff5f01c5e998004b1e8923dad813e1113b37

# Diff at Wed, 21 Jan 2026 10:50:19 GMT:

- author: Sergey Shemyakov (<sergey.shemyakov@l2beat.com>)
- comparing to: main@244fb212545a72797e49afed711b24371c1ca962 block: 1768216772
- current timestamp: 1768992487

## Description

Upgraded Lighter verifier.

## Watched changes

```diff
    contract UpgradeGatekeeper (eth:0x94da8A995D0D82Ef0fE7E509C6D76c22603B6f67) {
    +++ description: Governance contract functioning like an upgrade timelock for downstream contracts. The current delay is 21d and can be entirely skipped by eth:0x92b12c9d85BF7bd2EF5d2F53F4cd4Ce0BE432045.
      values.versionId:
-        38
+        39
    }
```

```diff
    contract ZkLighterVerifier (eth:0xac3Ce44B6ff4E402858C99D5699ff63131572BaA) {
    +++ description: The main ZK verifier of Lighter, settles the proofs of correct L2 state transition in the case of normal rollup operation.
      sourceHashes.1:
-        "0xcd42bf75a7fe0596b2df88cb9118f3e431864309a1a3c8987ea5e4c50acd0e09"
+        "0x79079aeaad31dee0624b3c5ccc8c7486d4ec771dcf6ca6a7f0b178c94357be9b"
      values.$implementation:
-        "eth:0xd42b2D9eFD409c2a3074AE4f874F3f42389DB931"
+        "eth:0x023B02ad3b8f9045595Ac7139FdBA643b562cfe3"
      values.getTarget:
-        "eth:0xd42b2D9eFD409c2a3074AE4f874F3f42389DB931"
+        "eth:0x023B02ad3b8f9045595Ac7139FdBA643b562cfe3"
      implementationNames.eth:0xd42b2D9eFD409c2a3074AE4f874F3f42389DB931:
-        "ZkLighterVerifier"
      implementationNames.eth:0x023B02ad3b8f9045595Ac7139FdBA643b562cfe3:
+        "ZkLighterVerifier"
    }
```

## Source code changes

```diff
.../ZkLighterVerifier/ZkLighterVerifier.sol                       | 8 ++++----
 1 file changed, 4 insertions(+), 4 deletions(-)
```

Generated with discovered.json: 0xfb2f9ffa84ff99b36f4fe49452a08831bb500d6e

# Diff at Mon, 12 Jan 2026 11:46:24 GMT:

- author: Sergey Shemyakov (<sergey.shemyakov@l2beat.com>)
- comparing to: main@c2812ac033718c9db96c3996581a53eda6b78cb0 block: 1767970274
- current timestamp: 1768216772

## Description

ZkLighterVerifier implementation upgraded. Sources have not been published yet.

## Watched changes

```diff
    contract UpgradeGatekeeper (eth:0x94da8A995D0D82Ef0fE7E509C6D76c22603B6f67) {
    +++ description: Governance contract functioning like an upgrade timelock for downstream contracts. The current delay is 21d and can be entirely skipped by eth:0x92b12c9d85BF7bd2EF5d2F53F4cd4Ce0BE432045.
      values.versionId:
-        37
+        38
    }
```

```diff
    contract ZkLighterVerifier (eth:0xac3Ce44B6ff4E402858C99D5699ff63131572BaA) {
    +++ description: The main ZK verifier of Lighter, settles the proofs of correct L2 state transition in the case of normal rollup operation.
      sourceHashes.1:
-        "0x9fb19e3d933b1d83369c32b6e1ec0333c42f0f814ee9e9ec8e5e1efea520d374"
+        "0xcd42bf75a7fe0596b2df88cb9118f3e431864309a1a3c8987ea5e4c50acd0e09"
      values.$implementation:
-        "eth:0x05F8176860955D94F974dB0CE8BB4F160AE425a2"
+        "eth:0xd42b2D9eFD409c2a3074AE4f874F3f42389DB931"
      values.getTarget:
-        "eth:0x05F8176860955D94F974dB0CE8BB4F160AE425a2"
+        "eth:0xd42b2D9eFD409c2a3074AE4f874F3f42389DB931"
      implementationNames.eth:0x05F8176860955D94F974dB0CE8BB4F160AE425a2:
-        "ZkLighterVerifier"
      implementationNames.eth:0xd42b2D9eFD409c2a3074AE4f874F3f42389DB931:
+        "ZkLighterVerifier"
    }
```

## Source code changes

```diff
.../ZkLighterVerifier/ZkLighterVerifier.sol                       | 8 ++++----
 1 file changed, 4 insertions(+), 4 deletions(-)
```

Generated with discovered.json: 0x10ec99a3b2ed549870085e478f20f57c93d6fc07

# Diff at Thu, 08 Jan 2026 09:32:46 GMT:

- author: Sergey Shemyakov (<sergey.shemyakov@l2beat.com>)
- comparing to: main@f947128dbe4bb63e2c3d88369b2e928bfd40e541 block: 1767691305
- current timestamp: 1767864703

## Description

Added two new EOAs to the network governor multisig (2/3 -> 3/5). Also registered LINK, UNI, AAVE, SKY, LDO l2 assets.

## Watched changes

```diff
    contract Lighter (eth:0x3B4D794a66304F130a4Db8F2551B0070dfCf5ca7) {
    +++ description: The main rollup contract. It processes L2 batches, manages token deposits and withdrawals, allows users to submit censorship-resistant L2 transactions and controls desert mode (escape hatch). Logic is split between two contracts because of code-size limits, many operations are delegated to AdditionalZKLighter.
      values.l2AssetRegistrations.1:
+        "0x4c494e4b00000000000000000000000000000000000000000000000000000000"
      values.l2AssetRegistrations.2:
+        "0x554e490000000000000000000000000000000000000000000000000000000000"
      values.l2AssetRegistrations.3:
+        "0x4141564500000000000000000000000000000000000000000000000000000000"
      values.l2AssetRegistrations.4:
+        "0x534b590000000000000000000000000000000000000000000000000000000000"
      values.l2AssetRegistrations.5:
+        "0x4c444f0000000000000000000000000000000000000000000000000000000000"
      values.registeredAssets.3:
+        {"assetIndex":5,"tokenAddress":"eth:0x514910771AF9Ca656af840dff83E8264EcF986CA"}
      values.registeredAssets.4:
+        {"assetIndex":6,"tokenAddress":"eth:0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984"}
      values.registeredAssets.5:
+        {"assetIndex":7,"tokenAddress":"eth:0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9"}
      values.registeredAssets.6:
+        {"assetIndex":8,"tokenAddress":"eth:0x56072C95FAA701256059aa122697B133aDEd9279"}
      values.registeredAssets.7:
+        {"assetIndex":9,"tokenAddress":"eth:0x5A98FcBEA516Cf06857215779Fd812CA3beF1B32"}
    }
```

```diff
    contract Lighter Multisig 2 (eth:0x97A90Ec950B6BCd9B190b566525B2Bb92A2C03a2) {
    +++ description: None
      values.$members.0:
+        "eth:0x67d6c2569AB98A1F535E36b3BaB1FBD825fa536E"
      values.$members.1:
+        "eth:0x89f550Fce5c191b34AF95671c28bCF6CCDF1203a"
      values.$threshold:
-        2
+        3
      values.multisigThreshold:
-        "2 of 3 (67%)"
+        "3 of 5 (60%)"
    }
```

Generated with discovered.json: 0x9df496e06a2ee70a50f8e449931c3d11fc6636c4

# Diff at Tue, 06 Jan 2026 10:14:13 GMT:

- author: Sergey Shemyakov (<sergey.shemyakov@l2beat.com>)
- comparing to: main@7a19fc9ed1e6fbc9472440b7a71d9e111ff56cee block: 1766409107
- current timestamp: 1767691305

## Description

Added Lighter token market. Changed insurance fund operator to a 3/5 multisig. Updated verifier, probably this PR: https://github.com/elliottech/lighter-prover/pull/2.

## Watched changes

```diff
    contract Lighter (eth:0x3B4D794a66304F130a4Db8F2551B0070dfCf5ca7) {
    +++ description: The main rollup contract. It processes L2 batches, manages token deposits and withdrawals, allows users to submit censorship-resistant L2 transactions and controls desert mode (escape hatch). Logic is split between two contracts because of code-size limits, many operations are delegated to AdditionalZKLighter.
      values.insuranceFundOperator:
-        "eth:0x47104B9f952ff19DB43DAeB7689aE51A0eD4890c"
+        "eth:0x9ccE444F8c60BD570986cd7D0ED7aEc29f127310"
      values.l2AssetConfigUpdates.0:
+        [2,1,100000000,0]
      values.l2AssetRegistrations.0:
+        "0x4c49540000000000000000000000000000000000000000000000000000000000"
      values.registeredAssets.2:
+        {"assetIndex":2,"tokenAddress":"eth:0x232CE3bd40fCd6f80f3d55A522d03f25Df784Ee2"}
    }
```

```diff
    contract Lighter Multisig (eth:0x92b12c9d85BF7bd2EF5d2F53F4cd4Ce0BE432045) {
    +++ description: None
      values.$members.0:
+        "eth:0xEc589ee2DF6dd2E7e0873F229d18e024B97d0FA6"
      values.multisigThreshold:
-        "3 of 5 (60%)"
+        "3 of 6 (50%)"
    }
```

```diff
    contract UpgradeGatekeeper (eth:0x94da8A995D0D82Ef0fE7E509C6D76c22603B6f67) {
    +++ description: Governance contract functioning like an upgrade timelock for downstream contracts. The current delay is 21d and can be entirely skipped by eth:0x92b12c9d85BF7bd2EF5d2F53F4cd4Ce0BE432045.
      values.versionId:
-        35
+        37
    }
```

```diff
    contract Lighter Multisig 2 (eth:0x97A90Ec950B6BCd9B190b566525B2Bb92A2C03a2) {
    +++ description: None
      values.$members.0:
+        "eth:0x6d340Dd53b89b1f0bD94b473227612427125Bc8D"
      values.$members.1:
-        "eth:0xfDb36C132fA19f7774d72fA39c89272D1B954A41"
    }
```

```diff
    contract ZkLighterVerifier (eth:0xac3Ce44B6ff4E402858C99D5699ff63131572BaA) {
    +++ description: The main ZK verifier of Lighter, settles the proofs of correct L2 state transition in the case of normal rollup operation.
      sourceHashes.1:
-        "0x24b1700e66c7f9f26c170bb95a058d86a9579ecb84f8c3159cb71a1c46e7e008"
+        "0x9fb19e3d933b1d83369c32b6e1ec0333c42f0f814ee9e9ec8e5e1efea520d374"
      values.$implementation:
-        "eth:0x7ddAD28962571F77fE5E9cB2fE74A896300EEed4"
+        "eth:0x05F8176860955D94F974dB0CE8BB4F160AE425a2"
      values.getTarget:
-        "eth:0x7ddAD28962571F77fE5E9cB2fE74A896300EEed4"
+        "eth:0x05F8176860955D94F974dB0CE8BB4F160AE425a2"
      implementationNames.eth:0x7ddAD28962571F77fE5E9cB2fE74A896300EEed4:
-        "ZkLighterVerifier"
      implementationNames.eth:0x05F8176860955D94F974dB0CE8BB4F160AE425a2:
+        "ZkLighterVerifier"
    }
```

```diff
+   Status: CREATED
    contract Safe (eth:0x9ccE444F8c60BD570986cd7D0ED7aEc29f127310)
    +++ description: None
```

## Source code changes

```diff
.../Safe.sol                                       |    0
 .../SafeProxy.p.sol                                |    0
 .../Safe.sol                                       | 1088 ++++++++++++++++++++
 .../SafeProxy.p.sol                                |   37 +
 .../ZkLighterVerifier/ZkLighterVerifier.sol        |  237 ++++-
 5 files changed, 1337 insertions(+), 25 deletions(-)
```

Generated with discovered.json: 0x73884c5a1b398c3a049c875247bd3ff286b1b503

# Diff at Mon, 22 Dec 2025 13:14:46 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@ec298bd11932360ded4da7b1d8484fb988e7cc02 block: 1765380548
- current timestamp: 1766409107

## Description

permissioned actors change (EOA to 2/3 Multisig).

## Watched changes

```diff
    contract Lighter (eth:0x3B4D794a66304F130a4Db8F2551B0070dfCf5ca7) {
    +++ description: The main rollup contract. It processes L2 batches, manages token deposits and withdrawals, allows users to submit censorship-resistant L2 transactions and controls desert mode (escape hatch). Logic is split between two contracts because of code-size limits, many operations are delegated to AdditionalZKLighter.
      values.insuranceFundOperator:
-        "eth:0x3629C998Fe1045A86c423AcaacCB9cBF7c792011"
+        "eth:0x47104B9f952ff19DB43DAeB7689aE51A0eD4890c"
      values.treasury:
-        "eth:0x44A5F41Fb364e52878193A8Ba375A1B17906D8E4"
+        "eth:0x3dD7c834EAa70c98e1C224808a3c62163b344daE"
    }
```

```diff
    contract UpgradeGatekeeper (eth:0x94da8A995D0D82Ef0fE7E509C6D76c22603B6f67) {
    +++ description: Governance contract functioning like an upgrade timelock for downstream contracts. The current delay is 21d and can be entirely skipped by eth:0x92b12c9d85BF7bd2EF5d2F53F4cd4Ce0BE432045.
+++ severity: HIGH
      values.getMaster:
-        "eth:0xfDb36C132fA19f7774d72fA39c89272D1B954A41"
+        "eth:0x97A90Ec950B6BCd9B190b566525B2Bb92A2C03a2"
    }
```

```diff
    contract Lighter Multisig 2 (eth:0x97A90Ec950B6BCd9B190b566525B2Bb92A2C03a2) {
    +++ description: None
      receivedPermissions.1:
+        {"permission":"upgrade","from":"eth:0x3B4D794a66304F130a4Db8F2551B0070dfCf5ca7","role":"admin","via":[{"address":"eth:0x94da8A995D0D82Ef0fE7E509C6D76c22603B6f67","delay":1814400}]}
      receivedPermissions.2:
+        {"permission":"upgrade","from":"eth:0xa464DA0B43f80EE3FfC4795cbbFC78472b5c81A1","role":"admin","via":[{"address":"eth:0x94da8A995D0D82Ef0fE7E509C6D76c22603B6f67","delay":1814400}]}
      receivedPermissions.3:
+        {"permission":"upgrade","from":"eth:0xac3Ce44B6ff4E402858C99D5699ff63131572BaA","role":"admin","via":[{"address":"eth:0x94da8A995D0D82Ef0fE7E509C6D76c22603B6f67","delay":1814400}]}
      directlyReceivedPermissions:
+        [{"permission":"act","from":"eth:0x94da8A995D0D82Ef0fE7E509C6D76c22603B6f67","delay":1814400,"role":".getMaster"}]
    }
```

```diff
    contract Governance (eth:0xa464DA0B43f80EE3FfC4795cbbFC78472b5c81A1) {
    +++ description: Manages the list of validators and the network governor.
      values.validators.0:
-        "eth:0xfDb36C132fA19f7774d72fA39c89272D1B954A41"
      values.validators.1:
-        "eth:0xFBC0dcd6c3518cB529bC1B585dB992A7d40005fa"
+        "eth:0x191fF0EC830F83916A427d169a234c33e48aA79f"
      values.validators.2:
-        "eth:0xfcB73F6405F6B9be91013d9477d81833a69C9c0D"
+        "eth:0x750bdb90AC72A78308d21eAC78999bBAE31cd63d"
      values.validators.3:
-        "eth:0x1c0F4f6daf0E0f32C5482672fa5342784915df21"
+        "eth:0xC0D2853e06F1E145177D5ef08Ab065a76e14354C"
    }
```

```diff
    EOA  (eth:0xfDb36C132fA19f7774d72fA39c89272D1B954A41) {
    +++ description: None
      receivedPermissions:
-        [{"permission":"interact","from":"eth:0xa464DA0B43f80EE3FfC4795cbbFC78472b5c81A1","description":"can commit, verify, execute batches, and revert committed but not yet executed batches.","role":".validators"},{"permission":"upgrade","from":"eth:0x3B4D794a66304F130a4Db8F2551B0070dfCf5ca7","role":"admin","via":[{"address":"eth:0x94da8A995D0D82Ef0fE7E509C6D76c22603B6f67","delay":1814400}]},{"permission":"upgrade","from":"eth:0xa464DA0B43f80EE3FfC4795cbbFC78472b5c81A1","role":"admin","via":[{"address":"eth:0x94da8A995D0D82Ef0fE7E509C6D76c22603B6f67","delay":1814400}]},{"permission":"upgrade","from":"eth:0xac3Ce44B6ff4E402858C99D5699ff63131572BaA","role":"admin","via":[{"address":"eth:0x94da8A995D0D82Ef0fE7E509C6D76c22603B6f67","delay":1814400}]}]
      controlsMajorityOfUpgradePermissions:
-        true
      directlyReceivedPermissions:
-        [{"permission":"act","from":"eth:0x94da8A995D0D82Ef0fE7E509C6D76c22603B6f67","delay":1814400,"role":".getMaster"}]
    }
```

```diff
+   Status: CREATED
    contract Safe (eth:0x3dD7c834EAa70c98e1C224808a3c62163b344daE)
    +++ description: None
```

## Source code changes

```diff
.../src/projects/lighter/.flat/Safe/Safe.sol       | 1088 ++++++++++++++++++++
 .../projects/lighter/.flat/Safe/SafeProxy.p.sol    |   37 +
 2 files changed, 1125 insertions(+)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1765380548 (main branch discovery), not current.

```diff
    contract Lighter Multisig 2 (eth:0x97A90Ec950B6BCd9B190b566525B2Bb92A2C03a2) {
    +++ description: None
      name:
-        "Safe"
+        "Lighter Multisig 2"
    }
```

Generated with discovered.json: 0x6d2780a260e6de90a129661efbbf94e3a7f9946e

# Diff at Wed, 10 Dec 2025 15:30:12 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@87479478fee0d2fb1eb3c2a36f88a2ceeb4087df block: 1764602180
- current timestamp: 1765380548

## Description

Added spot markets, and to do this, the ability to deposit other assets other than USDC. Many functions have been modified to support depositing and withdrawing multiple tokens. There are token specific configs that control various aspects of the flow, such as whether withdrawals are enabled. For some reason the token config is actually split between a part that is saved on L1 and one that is updated by sending a message on L2.
- [ZKLighter diff](https://disco.l2beat.com/diff/eth:0x59e71dc90E662F17c4eB156A8cA1BCCD106aCfA0/eth:0xe5FB592Ef1b620909000Af0D5fb55a3593026142)
- [AdditionalZKLighter diff](https://disco.l2beat.com/diff/eth:0xf255FC8738a5c6Ee6E869A5b182a9Cd4F99a2ED6/eth:0x9307350AF47B0C0e7f8cA5ED2D57993aF3a6df1d)
Verifiers have also been updated.

## Watched changes

```diff
    contract Lighter (eth:0x3B4D794a66304F130a4Db8F2551B0070dfCf5ca7) {
    +++ description: The main rollup contract. It processes L2 batches, manages token deposits and withdrawals, allows users to submit censorship-resistant L2 transactions and controls desert mode (escape hatch). Logic is split between two contracts because of code-size limits, many operations are delegated to AdditionalZKLighter.
      template:
-        "lighter/ZkLighter"
+        "lighter/ZkLighterWithSpot"
      sourceHashes.1:
-        "0x655cbba8ed9e8bc798be3624c7ded712b4e2abf1c743d46361b14e173e92e58a"
+        "0x016ec5f80bfe1e98a099c8e237105be90b1da112de262adc17dcec715a4ee173"
      description:
-        "The main rollup contract. It processes L2 batches, manages USDC deposits and withdrawals, allows users to submit censorship-resistant L2 transactions and controls desert mode (escape hatch). Logic is split between two contracts because of code-size limits, many operations are delegated to AdditionalZKLighter."
+        "The main rollup contract. It processes L2 batches, manages token deposits and withdrawals, allows users to submit censorship-resistant L2 transactions and controls desert mode (escape hatch). Logic is split between two contracts because of code-size limits, many operations are delegated to AdditionalZKLighter."
      values.$implementation.0:
-        "eth:0x59e71dc90E662F17c4eB156A8cA1BCCD106aCfA0"
+        "eth:0xe5FB592Ef1b620909000Af0D5fb55a3593026142"
      values.$implementation.1:
-        "eth:0xf255FC8738a5c6Ee6E869A5b182a9Cd4F99a2ED6"
+        "eth:0x9307350AF47B0C0e7f8cA5ED2D57993aF3a6df1d"
      values.additionalZkLighter:
-        "eth:0xf255FC8738a5c6Ee6E869A5b182a9Cd4F99a2ED6"
+        "eth:0x9307350AF47B0C0e7f8cA5ED2D57993aF3a6df1d"
+++ severity: HIGH
      values.desertVerifier:
-        "eth:0x9BC70c62823BabFed57698d458833da55D0c88A4"
+        "eth:0xd4460475F00307845082d3a146f36661354FBc67"
      values.getTarget:
-        "eth:0x59e71dc90E662F17c4eB156A8cA1BCCD106aCfA0"
+        "eth:0xe5FB592Ef1b620909000Af0D5fb55a3593026142"
      values.MAX_DEPOSIT_AMOUNT:
-        1000000000000000
      values.MAX_EXCHANGE_USDC_AMOUNT:
-        "1152921504606846975"
      values.MAX_MARKET_INDEX:
-        254
      values.assetConfigETH:
+        {"tokenAddress":"eth:0x0000000000000000000000000000000000000000","withdrawalsEnabled":1,"extensionMultiplier":100,"tickSize":10000000000,"depositCapTicks":"1152921504606846975","minDepositTicks":100000}
      values.assetConfigUSDC:
+        {"tokenAddress":"eth:0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48","withdrawalsEnabled":1,"extensionMultiplier":1000000,"tickSize":1,"depositCapTicks":"1152921504606846975","minDepositTicks":1000000}
      values.l2AssetConfigUpdates:
+        []
      values.l2AssetRegistrations:
+        []
      values.MAX_ASSET_INDEX:
+        62
      values.MAX_DEPOSIT_CAP_TICKS:
+        "1152921504606846975"
      values.MAX_PERPS_MARKET_INDEX:
+        254
      values.MAX_SPOT_MARKET_INDEX:
+        4094
      values.MAX_TICK_SIZE:
+        "340282366920938463463374607431768211455"
      values.MIN_ASSET_INDEX:
+        1
      values.MIN_SPOT_MARKET_INDEX:
+        2048
      values.NATIVE_ASSET_INDEX:
+        1
      values.registeredAssets:
+        [{"assetIndex":1,"tokenAddress":"eth:0x0000000000000000000000000000000000000000"},{"assetIndex":3,"tokenAddress":"eth:0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"}]
      values.USDC_ASSET_INDEX:
+        3
      implementationNames.eth:0x59e71dc90E662F17c4eB156A8cA1BCCD106aCfA0:
-        "ZkLighter"
      implementationNames.eth:0xf255FC8738a5c6Ee6E869A5b182a9Cd4F99a2ED6:
-        "AdditionalZkLighter"
      implementationNames.eth:0xe5FB592Ef1b620909000Af0D5fb55a3593026142:
+        "ZkLighter"
      implementationNames.eth:0x9307350AF47B0C0e7f8cA5ED2D57993aF3a6df1d:
+        "AdditionalZkLighter"
    }
```

```diff
    contract UpgradeGatekeeper (eth:0x94da8A995D0D82Ef0fE7E509C6D76c22603B6f67) {
    +++ description: Governance contract functioning like an upgrade timelock for downstream contracts. The current delay is 21d and can be entirely skipped by eth:0x92b12c9d85BF7bd2EF5d2F53F4cd4Ce0BE432045.
      values.versionId:
-        33
+        35
    }
```

```diff
-   Status: DELETED
    contract DesertVerifier (eth:0x9BC70c62823BabFed57698d458833da55D0c88A4)
    +++ description: ZK verifier used to verify forced exits during desert mode.
```

```diff
    contract Governance (eth:0xa464DA0B43f80EE3FfC4795cbbFC78472b5c81A1) {
    +++ description: Manages the list of validators and the network governor.
+++ severity: HIGH
      values.networkGovernor:
-        "eth:0xfDb36C132fA19f7774d72fA39c89272D1B954A41"
+        "eth:0x97A90Ec950B6BCd9B190b566525B2Bb92A2C03a2"
    }
```

```diff
    contract ZkLighterVerifier (eth:0xac3Ce44B6ff4E402858C99D5699ff63131572BaA) {
    +++ description: The main ZK verifier of Lighter, settles the proofs of correct L2 state transition in the case of normal rollup operation.
      sourceHashes.1:
-        "0x5191196a6fb417df695e41cac070ffb36ce01a4c49b7d89ad809fea72e6e18c4"
+        "0x24b1700e66c7f9f26c170bb95a058d86a9579ecb84f8c3159cb71a1c46e7e008"
      values.$implementation:
-        "eth:0x9a3Cc15b31Aec100d0C49B16cC401eaEf5A0A500"
+        "eth:0x7ddAD28962571F77fE5E9cB2fE74A896300EEed4"
      values.getTarget:
-        "eth:0x9a3Cc15b31Aec100d0C49B16cC401eaEf5A0A500"
+        "eth:0x7ddAD28962571F77fE5E9cB2fE74A896300EEed4"
      implementationNames.eth:0x9a3Cc15b31Aec100d0C49B16cC401eaEf5A0A500:
-        "ZkLighterVerifier"
      implementationNames.eth:0x7ddAD28962571F77fE5E9cB2fE74A896300EEed4:
+        "ZkLighterVerifier"
    }
```

```diff
    EOA  (eth:0xfDb36C132fA19f7774d72fA39c89272D1B954A41) {
    +++ description: None
      receivedPermissions.1:
-        {"permission":"interact","from":"eth:0xa464DA0B43f80EE3FfC4795cbbFC78472b5c81A1","description":"manage validators, update the address that manages the insurance fund, update the treasury address that collects fees from markets, add and update markets and assets.","role":".networkGovernor"}
    }
```

```diff
+   Status: CREATED
    contract Safe (eth:0x97A90Ec950B6BCd9B190b566525B2Bb92A2C03a2)
    +++ description: None
```

```diff
+   Status: CREATED
    contract DesertVerifier (eth:0xd4460475F00307845082d3a146f36661354FBc67)
    +++ description: ZK verifier used to verify forced exits during desert mode.
```

## Source code changes

```diff
.../{.flat@1764602180 => .flat}/DesertVerifier.sol |   17 +-
 .../Lighter/AdditionalZkLighter.2.sol              | 1105 ++++++++++++-------
 .../Lighter/ZkLighter.1.sol                        | 1106 ++++++++++++++++----
 .../src/projects/lighter/.flat/Safe/Safe.sol       | 1088 +++++++++++++++++++
 .../projects/lighter/.flat/Safe/SafeProxy.p.sol    |   37 +
 .../ZkLighterVerifier/ZkLighterVerifier.sol        |   48 +-
 6 files changed, 2781 insertions(+), 620 deletions(-)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1764602180 (main branch discovery), not current.

```diff
    EOA  (eth:0xfDb36C132fA19f7774d72fA39c89272D1B954A41) {
    +++ description: None
      receivedPermissions.1.description:
-        "manage validators, update the address that manages the insurance fund, and update the treasury address that collects fees from markets."
+        "manage validators, update the address that manages the insurance fund, update the treasury address that collects fees from markets, add and update markets and assets."
    }
```

Generated with discovered.json: 0xe20a587a5277eb2d551595acad41bcaed81f1724

# Diff at Wed, 26 Nov 2025 13:56:19 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@dd7c1c00cfe8eb7b4034082d8812fb8962098918 block: 1763984268
- current timestamp: 1764165313

## Description

new markets.

## Watched changes

```diff
    contract Lighter (eth:0x3B4D794a66304F130a4Db8F2551B0070dfCf5ca7) {
    +++ description: The main rollup contract. It processes L2 batches, manages USDC deposits and withdrawals, allows users to submit censorship-resistant L2 transactions and controls desert mode (escape hatch). Logic is split between two contracts because of code-size limits, many operations are delegated to AdditionalZKLighter.
      values.createdMarkets.42:
+        "HOOD"
      values.createdMarkets.43:
+        "COIN"
    }
```

Generated with discovered.json: 0xd4144abf0430598839817975f1204a8679bc4b20

# Diff at Mon, 24 Nov 2025 11:39:03 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@a7f22580fca8d48e9cc5f7f28da38d6b8725e891 block: 1762196400
- current timestamp: 1763984268

## Description

new markets!

## Watched changes

```diff
    contract Lighter (eth:0x3B4D794a66304F130a4Db8F2551B0070dfCf5ca7) {
    +++ description: The main rollup contract. It processes L2 batches, manages USDC deposits and withdrawals, allows users to submit censorship-resistant L2 transactions and controls desert mode (escape hatch). Logic is split between two contracts because of code-size limits, many operations are delegated to AdditionalZKLighter.
      values.createdMarkets.36:
+        "ICP"
      values.createdMarkets.37:
+        "FIL"
      values.createdMarkets.38:
+        "STRK"
      values.createdMarkets.39:
+        "USDKRW"
      values.createdMarkets.40:
+        "AUDUSD"
      values.createdMarkets.41:
+        "NZDUSD"
    }
```

Generated with discovered.json: 0x9ea25ff0e5d1f126bf239b1421683406de91af83

# Diff at Mon, 03 Nov 2025 19:01:11 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@6b72018cd9706ce7cba8ec489b67d7193f34dc20 block: 1761590191
- current timestamp: 1762196400

## Description

As per tg, added a "quote multiplier" to the state through the state upgrade verifier.

## Watched changes

```diff
    contract Lighter (eth:0x3B4D794a66304F130a4Db8F2551B0070dfCf5ca7) {
    +++ description: The main rollup contract. It processes L2 batches, manages USDC deposits and withdrawals, allows users to submit censorship-resistant L2 transactions and controls desert mode (escape hatch). Logic is split between two contracts because of code-size limits, many operations are delegated to AdditionalZKLighter.
      sourceHashes.1:
-        "0x63c0aabbd18f145acd677da4d5c3feac9c12a174abbd89c23b9038cbe4e6415a"
+        "0x655cbba8ed9e8bc798be3624c7ded712b4e2abf1c743d46361b14e173e92e58a"
      values.$implementation.0:
-        "eth:0x4FF23C6cA650166A95D854935a8b012B53ac59Bc"
+        "eth:0x59e71dc90E662F17c4eB156A8cA1BCCD106aCfA0"
      values.createdMarkets.30:
+        "EURUSD"
      values.createdMarkets.31:
+        "GBPUSD"
      values.createdMarkets.32:
+        "USDJPY"
      values.createdMarkets.33:
+        "USDCHF"
      values.createdMarkets.34:
+        "USDCAD"
      values.createdMarkets.35:
+        "CC"
      values.getTarget:
-        "eth:0x4FF23C6cA650166A95D854935a8b012B53ac59Bc"
+        "eth:0x59e71dc90E662F17c4eB156A8cA1BCCD106aCfA0"
      implementationNames.eth:0x4FF23C6cA650166A95D854935a8b012B53ac59Bc:
-        "ZkLighter"
      implementationNames.eth:0x59e71dc90E662F17c4eB156A8cA1BCCD106aCfA0:
+        "ZkLighter"
    }
```

```diff
    contract UpgradeGatekeeper (eth:0x94da8A995D0D82Ef0fE7E509C6D76c22603B6f67) {
    +++ description: Governance contract functioning like an upgrade timelock for downstream contracts. The current delay is 21d and can be entirely skipped by eth:0x92b12c9d85BF7bd2EF5d2F53F4cd4Ce0BE432045.
      values.versionId:
-        32
+        33
    }
```

## Source code changes

```diff
.../lighter/{.flat@1761590191 => .flat}/Lighter/ZkLighter.1.sol         | 2 +-
 1 file changed, 1 insertion(+), 1 deletion(-)
```

Generated with discovered.json: 0x762cf03db2ea3b73b581c32cbd87d476cf732a9d

# Diff at Mon, 27 Oct 2025 18:37:41 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@e90d561a3c749c64b7c47b2495a9f71414e93dd2 block: 1761223728
- current timestamp: 1761590191

## Description

- [Lighter](https://disco.l2beat.com/diff/eth:0x1D2624A65F8aaD1c4Bc406b4D2418ba577D218cb/eth:0x4FF23C6cA650166A95D854935a8b012B53ac59Bc): forced txs delay reduced from 18 days to 14 days.
- [AdditionalZKLighter](https://disco.l2beat.com/diff/eth:0x4194D3847a0239d59a87bC82C1870CBE1FA99db1/eth:0xf255FC8738a5c6Ee6E869A5b182a9Cd4F99a2ED6): same as above + small gas optimization.

Moreover the desert verifier is now verified on etherscan.

## Watched changes

```diff
    contract Lighter (eth:0x3B4D794a66304F130a4Db8F2551B0070dfCf5ca7) {
    +++ description: The main rollup contract. It processes L2 batches, manages USDC deposits and withdrawals, allows users to submit censorship-resistant L2 transactions and controls desert mode (escape hatch). Logic is split between two contracts because of code-size limits, many operations are delegated to AdditionalZKLighter.
      sourceHashes.1:
-        "0xa9200f827141ae9be2188327085a679c20ed563bf9bb6e5e2fc895b99b2bd5b0"
+        "0x63c0aabbd18f145acd677da4d5c3feac9c12a174abbd89c23b9038cbe4e6415a"
      values.$implementation.0:
-        "eth:0x1D2624A65F8aaD1c4Bc406b4D2418ba577D218cb"
+        "eth:0x4FF23C6cA650166A95D854935a8b012B53ac59Bc"
      values.$implementation.1:
-        "eth:0x4194D3847a0239d59a87bC82C1870CBE1FA99db1"
+        "eth:0xf255FC8738a5c6Ee6E869A5b182a9Cd4F99a2ED6"
      values.additionalZkLighter:
-        "eth:0x4194D3847a0239d59a87bC82C1870CBE1FA99db1"
+        "eth:0xf255FC8738a5c6Ee6E869A5b182a9Cd4F99a2ED6"
      values.createdMarkets.29:
+        "MET"
+++ severity: HIGH
      values.desertVerifier:
-        "eth:0x59406a5DcE71a4f631F9cd5D41996a19D6fDF184"
+        "eth:0x9BC70c62823BabFed57698d458833da55D0c88A4"
      values.getTarget:
-        "eth:0x1D2624A65F8aaD1c4Bc406b4D2418ba577D218cb"
+        "eth:0x4FF23C6cA650166A95D854935a8b012B53ac59Bc"
      values.PRIORITY_EXPIRATION:
-        1555200
+        1209600
      implementationNames.eth:0x1D2624A65F8aaD1c4Bc406b4D2418ba577D218cb:
-        "ZkLighter"
      implementationNames.eth:0x4194D3847a0239d59a87bC82C1870CBE1FA99db1:
-        "AdditionalZkLighter"
      implementationNames.eth:0x4FF23C6cA650166A95D854935a8b012B53ac59Bc:
+        "ZkLighter"
      implementationNames.eth:0xf255FC8738a5c6Ee6E869A5b182a9Cd4F99a2ED6:
+        "AdditionalZkLighter"
    }
```

```diff
-   Status: DELETED
    contract DesertVerifier (eth:0x59406a5DcE71a4f631F9cd5D41996a19D6fDF184)
    +++ description: None
```

```diff
    contract UpgradeGatekeeper (eth:0x94da8A995D0D82Ef0fE7E509C6D76c22603B6f67) {
    +++ description: Governance contract functioning like an upgrade timelock for downstream contracts. The current delay is 21d and can be entirely skipped by eth:0x92b12c9d85BF7bd2EF5d2F53F4cd4Ce0BE432045.
      values.versionId:
-        31
+        32
    }
```

```diff
+   Status: CREATED
    contract DesertVerifier (eth:0x9BC70c62823BabFed57698d458833da55D0c88A4)
    +++ description: ZK verifier used to verify forced exits during desert mode.
```

## Source code changes

```diff
.../src/projects/lighter/.flat/DesertVerifier.sol  | 1289 ++++++++++++++++++++
 .../Lighter/AdditionalZkLighter.2.sol              |    5 +-
 .../Lighter/ZkLighter.1.sol                        |    4 +-
 3 files changed, 1293 insertions(+), 5 deletions(-)
```

Generated with discovered.json: 0xf5429d0702d776d0b9671cac5d7c63a05ad28ecd

# Diff at Thu, 23 Oct 2025 12:50:06 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@57d3f180a9197fcc582bfc2d2856eea99da824cc block: 1760002018
- current timestamp: 1761223728

## Description

new markets.

## Watched changes

```diff
    contract Lighter (eth:0x3B4D794a66304F130a4Db8F2551B0070dfCf5ca7) {
    +++ description: The main rollup contract. It processes L2 batches, manages USDC deposits and withdrawals, allows users to submit censorship-resistant L2 transactions and controls desert mode (escape hatch). Logic is split between two contracts because of code-size limits, many operations are delegated to AdditionalZKLighter.
      values.createdMarkets.26:
+        "XAU"
      values.createdMarkets.27:
+        "XAG"
      values.createdMarkets.28:
+        "MEGA"
    }
```

Generated with discovered.json: 0x6570333e6bb1aaa60eb91cc05ef1c55a0959caf2

# Diff at Thu, 09 Oct 2025 09:28:00 GMT:

- author: Sergey Shemyakov (<sergey.shemyakov@l2beat.com>)
- comparing to: main@9abe3cb42f9d3939f748088a3ea4493deedf5239 block: 1759933041
- current timestamp: 1760002018

## Description

Updated config: added ignore in watch mode and high severity.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1759933041 (main branch discovery), not current.

```diff
    contract Lighter (eth:0x3B4D794a66304F130a4Db8F2551B0070dfCf5ca7) {
    +++ description: The main rollup contract. It processes L2 batches, manages USDC deposits and withdrawals, allows users to submit censorship-resistant L2 transactions and controls desert mode (escape hatch). Logic is split between two contracts because of code-size limits, many operations are delegated to AdditionalZKLighter.
      fieldMeta:
+        {"verifier":{"severity":"HIGH"},"desertVerifier":{"severity":"HIGH"},"desertMode":{"severity":"HIGH"}}
    }
```

```diff
    contract UpgradeGatekeeper (eth:0x94da8A995D0D82Ef0fE7E509C6D76c22603B6f67) {
    +++ description: Governance contract functioning like an upgrade timelock for downstream contracts. The current delay is 21d and can be entirely skipped by eth:0x92b12c9d85BF7bd2EF5d2F53F4cd4Ce0BE432045.
      fieldMeta.getMaster:
+        {"severity":"HIGH"}
    }
```

```diff
    contract Governance (eth:0xa464DA0B43f80EE3FfC4795cbbFC78472b5c81A1) {
    +++ description: Manages the list of validators and the network governor.
      fieldMeta:
+        {"networkGovernor":{"severity":"HIGH"}}
    }
```

Generated with discovered.json: 0x598eaf5f3b133c1e44be4b23ebcdc2442d69ad57

# Diff at Wed, 08 Oct 2025 14:18:25 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- current timestamp: 1759933041

## Description

Discovery rerun on the same block number with only config-related changes.

## Initial discovery

```diff
+   Status: CREATED
    contract Lighter (eth:0x3B4D794a66304F130a4Db8F2551B0070dfCf5ca7)
    +++ description: The main rollup contract. It processes L2 batches, manages USDC deposits and withdrawals, allows users to submit censorship-resistant L2 transactions and controls desert mode (escape hatch). Logic is split between two contracts because of code-size limits, many operations are delegated to AdditionalZKLighter.
```

```diff
+   Status: CREATED
    contract DesertVerifier (eth:0x59406a5DcE71a4f631F9cd5D41996a19D6fDF184)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Lighter Multisig (eth:0x92b12c9d85BF7bd2EF5d2F53F4cd4Ce0BE432045)
    +++ description: None
```

```diff
+   Status: CREATED
    contract UpgradeGatekeeper (eth:0x94da8A995D0D82Ef0fE7E509C6D76c22603B6f67)
    +++ description: Governance contract functioning like an upgrade timelock for downstream contracts. The current delay is 21d and can be entirely skipped by eth:0x92b12c9d85BF7bd2EF5d2F53F4cd4Ce0BE432045.
```

```diff
+   Status: CREATED
    contract Governance (eth:0xa464DA0B43f80EE3FfC4795cbbFC78472b5c81A1)
    +++ description: Manages the list of validators and the network governor.
```

```diff
+   Status: CREATED
    contract ZkLighterVerifier (eth:0xac3Ce44B6ff4E402858C99D5699ff63131572BaA)
    +++ description: The main ZK verifier of Lighter, settles the proofs of correct L2 state transition in the case of normal rollup operation.
```
