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
