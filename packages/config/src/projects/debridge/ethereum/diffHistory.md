Generated with discovered.json: 0x754f25c56327a10501902c9d3563901decbe9915

# Diff at Mon, 21 Jul 2025 10:11:14 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@c89d5207a278197d1d4bfd60ac8e37852accba7c block: 19531527
- current block number: 22966882

## Description

SimpleFeeProxy [upgraded](https://disco.l2beat.com/diff/eth:0x37a52ddb753c924f8C914de65ef00b5210Caa83C/eth:0xa1cc7E623423169e1C10e6e5CC8Ae6f1d11042DE):
- flashloans removed
- AMB function added (sends only message, no tokens)
- treasury deprecated, fees can now be removed by a permissioned actor

## Watched changes

```diff
-   Status: DELETED
    contract GnosisSafe (0xa0D6062Be29710c666aE850395Ac1A2AeCd14885)
    +++ description: None
```

```diff
    contract SimpleFeeProxy (0xC2bAC0DB5B18B0c3225581Ba14BD0B448c623636) {
    +++ description: None
      sourceHashes.1:
-        "0xc18d3818f9e809ced3dcce60fbe4287220ce2fced4f6c66711de5e704738bb9a"
+        "0x90a1adff0012e17a22d9eb35cecd932a71923919b443758b02b2c43ad666a352"
      values.$implementation:
-        "eth:0x37a52ddb753c924f8C914de65ef00b5210Caa83C"
+        "eth:0xa1cc7E623423169e1C10e6e5CC8Ae6f1d11042DE"
      values.$pastUpgrades.2:
+        ["2025-07-16T10:55:35.000Z","0x2891ca2643f9cb857b006952744b633088f22b57a8a04495abec7b79a500f1e3",["eth:0xa1cc7E623423169e1C10e6e5CC8Ae6f1d11042DE"]]
      values.$upgradeCount:
-        2
+        3
      values.getChainId:
-        1
      values.treasury:
-        "eth:0xa0D6062Be29710c666aE850395Ac1A2AeCd14885"
      values.version:
-        400
+        410
      values.FEE_COLLECTOR_ROLE:
+        "0x2dca0f5ce7e75a4b43fe2b0d6f5d0b7a2bf92ecf89f8f0aa17b8308b67038821"
      implementationNames.eth:0x37a52ddb753c924f8C914de65ef00b5210Caa83C:
-        "SimpleFeeProxy"
      implementationNames.eth:0xa1cc7E623423169e1C10e6e5CC8Ae6f1d11042DE:
+        "SimpleFeeProxy"
    }
```

## Source code changes

```diff
.../GnosisSafe/GnosisSafe.sol => /dev/null         | 953 ---------------------
 .../GnosisSafe/GnosisSafeProxy.p.sol => /dev/null  |  35 -
 .../SimpleFeeProxy/SimpleFeeProxy.sol              |  98 ++-
 3 files changed, 56 insertions(+), 1030 deletions(-)
```

Generated with discovered.json: 0xe7e0aa86404a86ca4b592bedd640b11d1f0fe52a

# Diff at Mon, 14 Jul 2025 12:44:57 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@9f4300dad2f3d080cd56fa311d4a848556c74e72 block: 19531527
- current block number: 19531527

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19531527 (main branch discovery), not current.

```diff
    EOA  (0x1c0720B124e7251e881a0fbCfe259d085C59f205) {
    +++ description: None
      address:
-        "0x1c0720B124e7251e881a0fbCfe259d085C59f205"
+        "eth:0x1c0720B124e7251e881a0fbCfe259d085C59f205"
    }
```

```diff
    EOA  (0x24C0E1C19c8eC997b781dF4B4A0f812aE9667c96) {
    +++ description: None
      address:
-        "0x24C0E1C19c8eC997b781dF4B4A0f812aE9667c96"
+        "eth:0x24C0E1C19c8eC997b781dF4B4A0f812aE9667c96"
    }
```

```diff
    EOA  (0x360f6cF86D3ed3c77E79dA6cE374aff842DfB0A0) {
    +++ description: None
      address:
-        "0x360f6cF86D3ed3c77E79dA6cE374aff842DfB0A0"
+        "eth:0x360f6cF86D3ed3c77E79dA6cE374aff842DfB0A0"
    }
```

```diff
    contract DeBridgeGate (0x43dE2d77BF8027e25dBD179B491e8d64f38398aA) {
    +++ description: None
      address:
-        "0x43dE2d77BF8027e25dBD179B491e8d64f38398aA"
+        "eth:0x43dE2d77BF8027e25dBD179B491e8d64f38398aA"
      values.$admin:
-        "0xE4427af3555CD9303D728C491364FAdFDD7494Fe"
+        "eth:0xE4427af3555CD9303D728C491364FAdFDD7494Fe"
      values.$implementation:
-        "0x797161BCC625155D2302251404ccB93c2632658e"
+        "eth:0x797161BCC625155D2302251404ccB93c2632658e"
      values.$pastUpgrades.0.2.0:
-        "0xB1A20D1c885fd775df97396397d6f8F07Abdd20D"
+        "eth:0xB1A20D1c885fd775df97396397d6f8F07Abdd20D"
      values.$pastUpgrades.1.2.0:
-        "0xFCe0502293dCacbFc2d663f7814b2771dEcfd576"
+        "eth:0xFCe0502293dCacbFc2d663f7814b2771dEcfd576"
      values.$pastUpgrades.2.2.0:
-        "0x51bFD427D06B2a5FC3588f9d023994A9f70e0Ce0"
+        "eth:0x51bFD427D06B2a5FC3588f9d023994A9f70e0Ce0"
      values.$pastUpgrades.3.2.0:
-        "0xc8550d85759BAbE6851235212563Fa2Ff04961BF"
+        "eth:0xc8550d85759BAbE6851235212563Fa2Ff04961BF"
      values.$pastUpgrades.4.2.0:
-        "0x24455aa55DED7728783c9474bE8eA2f5C935f8EB"
+        "eth:0x24455aa55DED7728783c9474bE8eA2f5C935f8EB"
      values.$pastUpgrades.5.2.0:
-        "0x797161BCC625155D2302251404ccB93c2632658e"
+        "eth:0x797161BCC625155D2302251404ccB93c2632658e"
      values.callProxy:
-        "0x8a0C79F5532f3b2a16AD1E4282A5DAF81928a824"
+        "eth:0x8a0C79F5532f3b2a16AD1E4282A5DAF81928a824"
      values.deBridgeTokenDeployer:
-        "0x8244d6Ffe0695B30b2bAD424683Ee3bc534Ea464"
+        "eth:0x8244d6Ffe0695B30b2bAD424683Ee3bc534Ea464"
      values.feeContractUpdater:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.feeProxy:
-        "0xC2bAC0DB5B18B0c3225581Ba14BD0B448c623636"
+        "eth:0xC2bAC0DB5B18B0c3225581Ba14BD0B448c623636"
      values.gap1:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.signatureVerifier:
-        "0x949b3B3c098348b879C9e4F15cecc8046d9C8A8c"
+        "eth:0x949b3B3c098348b879C9e4F15cecc8046d9C8A8c"
      values.weth:
-        "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
+        "eth:0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
      values.wethGate:
-        "0xFCf83648b8cDeF62e5d03319a6f1FCE16e4D6A59"
+        "eth:0xFCf83648b8cDeF62e5d03319a6f1FCE16e4D6A59"
      implementationNames.0x43dE2d77BF8027e25dBD179B491e8d64f38398aA:
-        "TransparentUpgradeableProxy"
      implementationNames.0x797161BCC625155D2302251404ccB93c2632658e:
-        "DeBridgeGate"
      implementationNames.eth:0x43dE2d77BF8027e25dBD179B491e8d64f38398aA:
+        "TransparentUpgradeableProxy"
      implementationNames.eth:0x797161BCC625155D2302251404ccB93c2632658e:
+        "DeBridgeGate"
    }
```

```diff
    EOA  (0x4bC16662A2cE381E7bb54Dc577c05619C5E67526) {
    +++ description: None
      address:
-        "0x4bC16662A2cE381E7bb54Dc577c05619C5E67526"
+        "eth:0x4bC16662A2cE381E7bb54Dc577c05619C5E67526"
    }
```

```diff
    EOA  (0x4CA2191cDE585d65EB6AFC09D23D60b8A0AB677D) {
    +++ description: None
      address:
-        "0x4CA2191cDE585d65EB6AFC09D23D60b8A0AB677D"
+        "eth:0x4CA2191cDE585d65EB6AFC09D23D60b8A0AB677D"
    }
```

```diff
    EOA  (0x573F5E2940789B378BA09cf7d3fD010C422a9ff5) {
    +++ description: None
      address:
-        "0x573F5E2940789B378BA09cf7d3fD010C422a9ff5"
+        "eth:0x573F5E2940789B378BA09cf7d3fD010C422a9ff5"
    }
```

```diff
    EOA  (0x59CE95b8955F0E7Be128d5Af77161B36f6084214) {
    +++ description: None
      address:
-        "0x59CE95b8955F0E7Be128d5Af77161B36f6084214"
+        "eth:0x59CE95b8955F0E7Be128d5Af77161B36f6084214"
    }
```

```diff
    EOA  (0x6436BBcA322b8cD0c56d8b9aD7837b13960dA426) {
    +++ description: None
      address:
-        "0x6436BBcA322b8cD0c56d8b9aD7837b13960dA426"
+        "eth:0x6436BBcA322b8cD0c56d8b9aD7837b13960dA426"
    }
```

```diff
    contract Admin Multisig (0x6bec1faF33183e1Bc316984202eCc09d46AC92D5) {
    +++ description: None
      address:
-        "0x6bec1faF33183e1Bc316984202eCc09d46AC92D5"
+        "eth:0x6bec1faF33183e1Bc316984202eCc09d46AC92D5"
      values.$implementation:
-        "0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
+        "eth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
      values.$members.0:
-        "0xbA7cE717928A6C51ab530aD9AdB69bA6E76D09B5"
+        "eth:0xbA7cE717928A6C51ab530aD9AdB69bA6E76D09B5"
      values.$members.1:
-        "0xC351f905d810Cb33c54fE771e1bE4ec5A5048c2D"
+        "eth:0xC351f905d810Cb33c54fE771e1bE4ec5A5048c2D"
      values.$members.2:
-        "0xD4Aa80C7a35B2C996Ef3F83baf91D5721c86dA2C"
+        "eth:0xD4Aa80C7a35B2C996Ef3F83baf91D5721c86dA2C"
      values.$members.3:
-        "0x874B1d14bF4FE455C9eCAcDf66b629e10664c6E1"
+        "eth:0x874B1d14bF4FE455C9eCAcDf66b629e10664c6E1"
      values.$members.4:
-        "0xE9666D80e5617bA1470E2cA09F2D9B0C8CCd56B7"
+        "eth:0xE9666D80e5617bA1470E2cA09F2D9B0C8CCd56B7"
      values.$members.5:
-        "0x6f572a24c5C009fC8C844Fab5352edf79F132FBD"
+        "eth:0x6f572a24c5C009fC8C844Fab5352edf79F132FBD"
      values.$members.6:
-        "0xd725E456D5beD8275E297C4Dd11135e3C5cDe544"
+        "eth:0xd725E456D5beD8275E297C4Dd11135e3C5cDe544"
      values.$members.7:
-        "0x24C0E1C19c8eC997b781dF4B4A0f812aE9667c96"
+        "eth:0x24C0E1C19c8eC997b781dF4B4A0f812aE9667c96"
      implementationNames.0x6bec1faF33183e1Bc316984202eCc09d46AC92D5:
-        "GnosisSafeProxy"
      implementationNames.0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
-        "GnosisSafe"
      implementationNames.eth:0x6bec1faF33183e1Bc316984202eCc09d46AC92D5:
+        "GnosisSafeProxy"
      implementationNames.eth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
+        "GnosisSafe"
    }
```

```diff
    EOA  (0x6f572a24c5C009fC8C844Fab5352edf79F132FBD) {
    +++ description: None
      address:
-        "0x6f572a24c5C009fC8C844Fab5352edf79F132FBD"
+        "eth:0x6f572a24c5C009fC8C844Fab5352edf79F132FBD"
    }
```

```diff
    contract DeBridgeTokenDeployer (0x8244d6Ffe0695B30b2bAD424683Ee3bc534Ea464) {
    +++ description: None
      address:
-        "0x8244d6Ffe0695B30b2bAD424683Ee3bc534Ea464"
+        "eth:0x8244d6Ffe0695B30b2bAD424683Ee3bc534Ea464"
      values.$admin:
-        "0xE4427af3555CD9303D728C491364FAdFDD7494Fe"
+        "eth:0xE4427af3555CD9303D728C491364FAdFDD7494Fe"
      values.$implementation:
-        "0x4c7CA8fcFFE77281A8B81D4580CFf8257d785491"
+        "eth:0x4c7CA8fcFFE77281A8B81D4580CFf8257d785491"
      values.$pastUpgrades.0.2.0:
-        "0x4c7CA8fcFFE77281A8B81D4580CFf8257d785491"
+        "eth:0x4c7CA8fcFFE77281A8B81D4580CFf8257d785491"
      values.debridgeAddress:
-        "0x43dE2d77BF8027e25dBD179B491e8d64f38398aA"
+        "eth:0x43dE2d77BF8027e25dBD179B491e8d64f38398aA"
      values.deBridgeTokenAdmin:
-        "0x6bec1faF33183e1Bc316984202eCc09d46AC92D5"
+        "eth:0x6bec1faF33183e1Bc316984202eCc09d46AC92D5"
      values.implementation:
-        "0xCAceBE8c354b70Fa6E3107f3F6F699e4Fbb3A98B"
+        "eth:0xCAceBE8c354b70Fa6E3107f3F6F699e4Fbb3A98B"
      values.tokenImplementation:
-        "0xCAceBE8c354b70Fa6E3107f3F6F699e4Fbb3A98B"
+        "eth:0xCAceBE8c354b70Fa6E3107f3F6F699e4Fbb3A98B"
      implementationNames.0x8244d6Ffe0695B30b2bAD424683Ee3bc534Ea464:
-        "TransparentUpgradeableProxy"
      implementationNames.0x4c7CA8fcFFE77281A8B81D4580CFf8257d785491:
-        "DeBridgeTokenDeployer"
      implementationNames.eth:0x8244d6Ffe0695B30b2bAD424683Ee3bc534Ea464:
+        "TransparentUpgradeableProxy"
      implementationNames.eth:0x4c7CA8fcFFE77281A8B81D4580CFf8257d785491:
+        "DeBridgeTokenDeployer"
    }
```

```diff
    EOA  (0x83f81E7f9E284AAFFEDED797008663595f7342bF) {
    +++ description: None
      address:
-        "0x83f81E7f9E284AAFFEDED797008663595f7342bF"
+        "eth:0x83f81E7f9E284AAFFEDED797008663595f7342bF"
    }
```

```diff
    EOA  (0x874B1d14bF4FE455C9eCAcDf66b629e10664c6E1) {
    +++ description: None
      address:
-        "0x874B1d14bF4FE455C9eCAcDf66b629e10664c6E1"
+        "eth:0x874B1d14bF4FE455C9eCAcDf66b629e10664c6E1"
    }
```

```diff
    EOA  (0x874f46124C1DAaD4749B94f82eD142754826240E) {
    +++ description: None
      address:
-        "0x874f46124C1DAaD4749B94f82eD142754826240E"
+        "eth:0x874f46124C1DAaD4749B94f82eD142754826240E"
    }
```

```diff
    contract CallProxy (0x8a0C79F5532f3b2a16AD1E4282A5DAF81928a824) {
    +++ description: None
      address:
-        "0x8a0C79F5532f3b2a16AD1E4282A5DAF81928a824"
+        "eth:0x8a0C79F5532f3b2a16AD1E4282A5DAF81928a824"
      values.$admin:
-        "0xE4427af3555CD9303D728C491364FAdFDD7494Fe"
+        "eth:0xE4427af3555CD9303D728C491364FAdFDD7494Fe"
      values.$implementation:
-        "0xBd3d657AE87671eC6f8D6272A9f431a7c4a9B6f8"
+        "eth:0xBd3d657AE87671eC6f8D6272A9f431a7c4a9B6f8"
      values.$pastUpgrades.0.2.0:
-        "0x4e446b6Cf4d127827c83Ca0c848Db0B43841c391"
+        "eth:0x4e446b6Cf4d127827c83Ca0c848Db0B43841c391"
      values.$pastUpgrades.1.2.0:
-        "0xd5317E82BFEFf70b4773f0fcab5e2ABFA3c7D63b"
+        "eth:0xd5317E82BFEFf70b4773f0fcab5e2ABFA3c7D63b"
      values.$pastUpgrades.2.2.0:
-        "0x752A9e96e8683400ae238270C97c1D0160861fEF"
+        "eth:0x752A9e96e8683400ae238270C97c1D0160861fEF"
      values.$pastUpgrades.3.2.0:
-        "0x0C4B79205F6Cc20c0E0201b61b99e77F3CE3B67A"
+        "eth:0x0C4B79205F6Cc20c0E0201b61b99e77F3CE3B67A"
      values.$pastUpgrades.4.2.0:
-        "0xe5a04b307B31Af07F4DfCaA840952Ff7d3845c7e"
+        "eth:0xe5a04b307B31Af07F4DfCaA840952Ff7d3845c7e"
      values.$pastUpgrades.5.2.0:
-        "0xBd3d657AE87671eC6f8D6272A9f431a7c4a9B6f8"
+        "eth:0xBd3d657AE87671eC6f8D6272A9f431a7c4a9B6f8"
      implementationNames.0x8a0C79F5532f3b2a16AD1E4282A5DAF81928a824:
-        "TransparentUpgradeableProxy"
      implementationNames.0xBd3d657AE87671eC6f8D6272A9f431a7c4a9B6f8:
-        "CallProxy"
      implementationNames.eth:0x8a0C79F5532f3b2a16AD1E4282A5DAF81928a824:
+        "TransparentUpgradeableProxy"
      implementationNames.eth:0xBd3d657AE87671eC6f8D6272A9f431a7c4a9B6f8:
+        "CallProxy"
    }
```

```diff
    contract SignatureVerifier (0x949b3B3c098348b879C9e4F15cecc8046d9C8A8c) {
    +++ description: None
      address:
-        "0x949b3B3c098348b879C9e4F15cecc8046d9C8A8c"
+        "eth:0x949b3B3c098348b879C9e4F15cecc8046d9C8A8c"
      values.$admin:
-        "0xE4427af3555CD9303D728C491364FAdFDD7494Fe"
+        "eth:0xE4427af3555CD9303D728C491364FAdFDD7494Fe"
      values.$implementation:
-        "0xfE7De3c1e1BD252C67667B56347cABFC6df08dF4"
+        "eth:0xfE7De3c1e1BD252C67667B56347cABFC6df08dF4"
      values.$pastUpgrades.0.2.0:
-        "0x2a3e72eD893b5958690e16c3BBe1BD92137b6250"
+        "eth:0x2a3e72eD893b5958690e16c3BBe1BD92137b6250"
      values.$pastUpgrades.1.2.0:
-        "0xfE7De3c1e1BD252C67667B56347cABFC6df08dF4"
+        "eth:0xfE7De3c1e1BD252C67667B56347cABFC6df08dF4"
      values.debridgeAddress:
-        "0x43dE2d77BF8027e25dBD179B491e8d64f38398aA"
+        "eth:0x43dE2d77BF8027e25dBD179B491e8d64f38398aA"
      values.oracles.0:
-        "0x4bC16662A2cE381E7bb54Dc577c05619C5E67526"
+        "eth:0x4bC16662A2cE381E7bb54Dc577c05619C5E67526"
      values.oracles.1:
-        "0x1c0720B124e7251e881a0fbCfe259d085C59f205"
+        "eth:0x1c0720B124e7251e881a0fbCfe259d085C59f205"
      values.oracles.2:
-        "0x573F5E2940789B378BA09cf7d3fD010C422a9ff5"
+        "eth:0x573F5E2940789B378BA09cf7d3fD010C422a9ff5"
      values.oracles.3:
-        "0x59CE95b8955F0E7Be128d5Af77161B36f6084214"
+        "eth:0x59CE95b8955F0E7Be128d5Af77161B36f6084214"
      values.oracles.4:
-        "0xbCF516826eD7F3b0E487C7ca6A87b3b4EccDD4DC"
+        "eth:0xbCF516826eD7F3b0E487C7ca6A87b3b4EccDD4DC"
      values.oracles.5:
-        "0xf27Af436A6F2d9C64B4CA40a483eC46acDc33fe8"
+        "eth:0xf27Af436A6F2d9C64B4CA40a483eC46acDc33fe8"
      values.oracles.6:
-        "0x6436BBcA322b8cD0c56d8b9aD7837b13960dA426"
+        "eth:0x6436BBcA322b8cD0c56d8b9aD7837b13960dA426"
      values.oracles.7:
-        "0x874f46124C1DAaD4749B94f82eD142754826240E"
+        "eth:0x874f46124C1DAaD4749B94f82eD142754826240E"
      values.oracles.8:
-        "0xDD523FD4DebcF0dB6f0B2c2D30D075CaaeE023e0"
+        "eth:0xDD523FD4DebcF0dB6f0B2c2D30D075CaaeE023e0"
      values.oracles.9:
-        "0x83f81E7f9E284AAFFEDED797008663595f7342bF"
+        "eth:0x83f81E7f9E284AAFFEDED797008663595f7342bF"
      values.oracles.10:
-        "0x4CA2191cDE585d65EB6AFC09D23D60b8A0AB677D"
+        "eth:0x4CA2191cDE585d65EB6AFC09D23D60b8A0AB677D"
      values.oracles.11:
-        "0xebec9bc53f9C65f69DB8591B9f240BbCDb563c54"
+        "eth:0xebec9bc53f9C65f69DB8591B9f240BbCDb563c54"
      implementationNames.0x949b3B3c098348b879C9e4F15cecc8046d9C8A8c:
-        "TransparentUpgradeableProxy"
      implementationNames.0xfE7De3c1e1BD252C67667B56347cABFC6df08dF4:
-        "SignatureVerifier"
      implementationNames.eth:0x949b3B3c098348b879C9e4F15cecc8046d9C8A8c:
+        "TransparentUpgradeableProxy"
      implementationNames.eth:0xfE7De3c1e1BD252C67667B56347cABFC6df08dF4:
+        "SignatureVerifier"
    }
```

```diff
    contract GnosisSafe (0xa0D6062Be29710c666aE850395Ac1A2AeCd14885) {
    +++ description: None
      address:
-        "0xa0D6062Be29710c666aE850395Ac1A2AeCd14885"
+        "eth:0xa0D6062Be29710c666aE850395Ac1A2AeCd14885"
      values.$implementation:
-        "0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
+        "eth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
      values.$members.0:
-        "0x360f6cF86D3ed3c77E79dA6cE374aff842DfB0A0"
+        "eth:0x360f6cF86D3ed3c77E79dA6cE374aff842DfB0A0"
      values.$members.1:
-        "0xd725E456D5beD8275E297C4Dd11135e3C5cDe544"
+        "eth:0xd725E456D5beD8275E297C4Dd11135e3C5cDe544"
      values.$members.2:
-        "0x24C0E1C19c8eC997b781dF4B4A0f812aE9667c96"
+        "eth:0x24C0E1C19c8eC997b781dF4B4A0f812aE9667c96"
      implementationNames.0xa0D6062Be29710c666aE850395Ac1A2AeCd14885:
-        "GnosisSafeProxy"
      implementationNames.0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
-        "GnosisSafe"
      implementationNames.eth:0xa0D6062Be29710c666aE850395Ac1A2AeCd14885:
+        "GnosisSafeProxy"
      implementationNames.eth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
+        "GnosisSafe"
    }
```

```diff
    EOA  (0xbA7cE717928A6C51ab530aD9AdB69bA6E76D09B5) {
    +++ description: None
      address:
-        "0xbA7cE717928A6C51ab530aD9AdB69bA6E76D09B5"
+        "eth:0xbA7cE717928A6C51ab530aD9AdB69bA6E76D09B5"
    }
```

```diff
    EOA  (0xbCF516826eD7F3b0E487C7ca6A87b3b4EccDD4DC) {
    +++ description: None
      address:
-        "0xbCF516826eD7F3b0E487C7ca6A87b3b4EccDD4DC"
+        "eth:0xbCF516826eD7F3b0E487C7ca6A87b3b4EccDD4DC"
    }
```

```diff
    contract SimpleFeeProxy (0xC2bAC0DB5B18B0c3225581Ba14BD0B448c623636) {
    +++ description: None
      address:
-        "0xC2bAC0DB5B18B0c3225581Ba14BD0B448c623636"
+        "eth:0xC2bAC0DB5B18B0c3225581Ba14BD0B448c623636"
      values.$admin:
-        "0xE4427af3555CD9303D728C491364FAdFDD7494Fe"
+        "eth:0xE4427af3555CD9303D728C491364FAdFDD7494Fe"
      values.$implementation:
-        "0x37a52ddb753c924f8C914de65ef00b5210Caa83C"
+        "eth:0x37a52ddb753c924f8C914de65ef00b5210Caa83C"
      values.$pastUpgrades.0.2.0:
-        "0x27406EbF0b76923d93b4C6c6224bCaB7fFf11f87"
+        "eth:0x27406EbF0b76923d93b4C6c6224bCaB7fFf11f87"
      values.$pastUpgrades.1.2.0:
-        "0x37a52ddb753c924f8C914de65ef00b5210Caa83C"
+        "eth:0x37a52ddb753c924f8C914de65ef00b5210Caa83C"
      values.debridgeGate:
-        "0x43dE2d77BF8027e25dBD179B491e8d64f38398aA"
+        "eth:0x43dE2d77BF8027e25dBD179B491e8d64f38398aA"
      values.treasury:
-        "0xa0D6062Be29710c666aE850395Ac1A2AeCd14885"
+        "eth:0xa0D6062Be29710c666aE850395Ac1A2AeCd14885"
      implementationNames.0xC2bAC0DB5B18B0c3225581Ba14BD0B448c623636:
-        "TransparentUpgradeableProxy"
      implementationNames.0x37a52ddb753c924f8C914de65ef00b5210Caa83C:
-        "SimpleFeeProxy"
      implementationNames.eth:0xC2bAC0DB5B18B0c3225581Ba14BD0B448c623636:
+        "TransparentUpgradeableProxy"
      implementationNames.eth:0x37a52ddb753c924f8C914de65ef00b5210Caa83C:
+        "SimpleFeeProxy"
    }
```

```diff
    EOA  (0xC351f905d810Cb33c54fE771e1bE4ec5A5048c2D) {
    +++ description: None
      address:
-        "0xC351f905d810Cb33c54fE771e1bE4ec5A5048c2D"
+        "eth:0xC351f905d810Cb33c54fE771e1bE4ec5A5048c2D"
    }
```

```diff
    contract DeBridgeToken (0xCAceBE8c354b70Fa6E3107f3F6F699e4Fbb3A98B) {
    +++ description: None
      address:
-        "0xCAceBE8c354b70Fa6E3107f3F6F699e4Fbb3A98B"
+        "eth:0xCAceBE8c354b70Fa6E3107f3F6F699e4Fbb3A98B"
      implementationNames.0xCAceBE8c354b70Fa6E3107f3F6F699e4Fbb3A98B:
-        "DeBridgeToken"
      implementationNames.eth:0xCAceBE8c354b70Fa6E3107f3F6F699e4Fbb3A98B:
+        "DeBridgeToken"
    }
```

```diff
    EOA  (0xD4Aa80C7a35B2C996Ef3F83baf91D5721c86dA2C) {
    +++ description: None
      address:
-        "0xD4Aa80C7a35B2C996Ef3F83baf91D5721c86dA2C"
+        "eth:0xD4Aa80C7a35B2C996Ef3F83baf91D5721c86dA2C"
    }
```

```diff
    EOA  (0xd725E456D5beD8275E297C4Dd11135e3C5cDe544) {
    +++ description: None
      address:
-        "0xd725E456D5beD8275E297C4Dd11135e3C5cDe544"
+        "eth:0xd725E456D5beD8275E297C4Dd11135e3C5cDe544"
    }
```

```diff
    EOA  (0xDD523FD4DebcF0dB6f0B2c2D30D075CaaeE023e0) {
    +++ description: None
      address:
-        "0xDD523FD4DebcF0dB6f0B2c2D30D075CaaeE023e0"
+        "eth:0xDD523FD4DebcF0dB6f0B2c2D30D075CaaeE023e0"
    }
```

```diff
    contract ProxyAdmin (0xE4427af3555CD9303D728C491364FAdFDD7494Fe) {
    +++ description: None
      address:
-        "0xE4427af3555CD9303D728C491364FAdFDD7494Fe"
+        "eth:0xE4427af3555CD9303D728C491364FAdFDD7494Fe"
      values.owner:
-        "0x6bec1faF33183e1Bc316984202eCc09d46AC92D5"
+        "eth:0x6bec1faF33183e1Bc316984202eCc09d46AC92D5"
      implementationNames.0xE4427af3555CD9303D728C491364FAdFDD7494Fe:
-        "ProxyAdmin"
      implementationNames.eth:0xE4427af3555CD9303D728C491364FAdFDD7494Fe:
+        "ProxyAdmin"
    }
```

```diff
    EOA  (0xE9666D80e5617bA1470E2cA09F2D9B0C8CCd56B7) {
    +++ description: None
      address:
-        "0xE9666D80e5617bA1470E2cA09F2D9B0C8CCd56B7"
+        "eth:0xE9666D80e5617bA1470E2cA09F2D9B0C8CCd56B7"
    }
```

```diff
    EOA  (0xebec9bc53f9C65f69DB8591B9f240BbCDb563c54) {
    +++ description: None
      address:
-        "0xebec9bc53f9C65f69DB8591B9f240BbCDb563c54"
+        "eth:0xebec9bc53f9C65f69DB8591B9f240BbCDb563c54"
    }
```

```diff
    EOA  (0xf27Af436A6F2d9C64B4CA40a483eC46acDc33fe8) {
    +++ description: None
      address:
-        "0xf27Af436A6F2d9C64B4CA40a483eC46acDc33fe8"
+        "eth:0xf27Af436A6F2d9C64B4CA40a483eC46acDc33fe8"
    }
```

```diff
+   Status: CREATED
    contract DeBridgeGate (0x43dE2d77BF8027e25dBD179B491e8d64f38398aA)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Admin Multisig (0x6bec1faF33183e1Bc316984202eCc09d46AC92D5)
    +++ description: None
```

```diff
+   Status: CREATED
    contract DeBridgeTokenDeployer (0x8244d6Ffe0695B30b2bAD424683Ee3bc534Ea464)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CallProxy (0x8a0C79F5532f3b2a16AD1E4282A5DAF81928a824)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SignatureVerifier (0x949b3B3c098348b879C9e4F15cecc8046d9C8A8c)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafe (0xa0D6062Be29710c666aE850395Ac1A2AeCd14885)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SimpleFeeProxy (0xC2bAC0DB5B18B0c3225581Ba14BD0B448c623636)
    +++ description: None
```

```diff
+   Status: CREATED
    contract DeBridgeToken (0xCAceBE8c354b70Fa6E3107f3F6F699e4Fbb3A98B)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0xE4427af3555CD9303D728C491364FAdFDD7494Fe)
    +++ description: None
```

Generated with discovered.json: 0x2aec27aa64c5336f9f1e1f2957396d766dc2b892

# Diff at Fri, 04 Jul 2025 12:18:57 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f56dc47fe915564d4555300304da4d3bcbc087f block: 19531527
- current block number: 19531527

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19531527 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0xE4427af3555CD9303D728C491364FAdFDD7494Fe) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0x43dE2d77BF8027e25dBD179B491e8d64f38398aA"
+        "eth:0x43dE2d77BF8027e25dBD179B491e8d64f38398aA"
      receivedPermissions.1.from:
-        "ethereum:0x8244d6Ffe0695B30b2bAD424683Ee3bc534Ea464"
+        "eth:0x8244d6Ffe0695B30b2bAD424683Ee3bc534Ea464"
      receivedPermissions.2.from:
-        "ethereum:0x8a0C79F5532f3b2a16AD1E4282A5DAF81928a824"
+        "eth:0x8a0C79F5532f3b2a16AD1E4282A5DAF81928a824"
      receivedPermissions.3.from:
-        "ethereum:0x949b3B3c098348b879C9e4F15cecc8046d9C8A8c"
+        "eth:0x949b3B3c098348b879C9e4F15cecc8046d9C8A8c"
      receivedPermissions.4.from:
-        "ethereum:0xC2bAC0DB5B18B0c3225581Ba14BD0B448c623636"
+        "eth:0xC2bAC0DB5B18B0c3225581Ba14BD0B448c623636"
    }
```

Generated with discovered.json: 0x62c48ba0316e0f94063edffc7ccee8713777df56

# Diff at Fri, 23 May 2025 09:40:55 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@69cd181abbc3c830a6caf2f4429b37cae72ffdb8 block: 19531527
- current block number: 19531527

## Description

Introduced .role field on each permission, defaulting to field name on which it was defined (with '.' prefix)

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19531527 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0xE4427af3555CD9303D728C491364FAdFDD7494Fe) {
    +++ description: None
      receivedPermissions.4.role:
+        "admin"
      receivedPermissions.3.role:
+        "admin"
      receivedPermissions.2.role:
+        "admin"
      receivedPermissions.1.role:
+        "admin"
      receivedPermissions.0.role:
+        "admin"
    }
```

Generated with discovered.json: 0xd6029f7ef5c3015d7c96cf6969574ecf5b2e19b3

# Diff at Tue, 29 Apr 2025 08:19:01 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@ef7477af00fe0b57a2f7cacf7e958c12494af662 block: 19531527
- current block number: 19531527

## Description

Field .issuedPermissions is removed from the output as no longer needed. Added 'permissionsConfigHash' due to refactoring of the modelling process (into a separate command).

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19531527 (main branch discovery), not current.

```diff
    contract DeBridgeGate (0x43dE2d77BF8027e25dBD179B491e8d64f38398aA) {
    +++ description: None
      issuedPermissions:
-        [{"permission":"upgrade","to":"0xE4427af3555CD9303D728C491364FAdFDD7494Fe","via":[]}]
    }
```

```diff
    contract DeBridgeTokenDeployer (0x8244d6Ffe0695B30b2bAD424683Ee3bc534Ea464) {
    +++ description: None
      issuedPermissions:
-        [{"permission":"upgrade","to":"0xE4427af3555CD9303D728C491364FAdFDD7494Fe","via":[]}]
    }
```

```diff
    contract CallProxy (0x8a0C79F5532f3b2a16AD1E4282A5DAF81928a824) {
    +++ description: None
      issuedPermissions:
-        [{"permission":"upgrade","to":"0xE4427af3555CD9303D728C491364FAdFDD7494Fe","via":[]}]
    }
```

```diff
    contract SignatureVerifier (0x949b3B3c098348b879C9e4F15cecc8046d9C8A8c) {
    +++ description: None
      issuedPermissions:
-        [{"permission":"upgrade","to":"0xE4427af3555CD9303D728C491364FAdFDD7494Fe","via":[]}]
    }
```

```diff
    contract SimpleFeeProxy (0xC2bAC0DB5B18B0c3225581Ba14BD0B448c623636) {
    +++ description: None
      issuedPermissions:
-        [{"permission":"upgrade","to":"0xE4427af3555CD9303D728C491364FAdFDD7494Fe","via":[]}]
    }
```

Generated with discovered.json: 0xc7cb760e359451fedc76481953dc788c525a2df7

# Diff at Tue, 04 Mar 2025 10:39:03 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@98d260b45fe0d2195ce5e629bd7b200c8706e8ba block: 19531527
- current block number: 19531527

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19531527 (main branch discovery), not current.

```diff
    contract DeBridgeGate (0x43dE2d77BF8027e25dBD179B491e8d64f38398aA) {
    +++ description: None
      sinceBlock:
+        13665321
    }
```

```diff
    contract Admin Multisig (0x6bec1faF33183e1Bc316984202eCc09d46AC92D5) {
    +++ description: None
      sinceBlock:
+        13654184
    }
```

```diff
    contract DeBridgeTokenDeployer (0x8244d6Ffe0695B30b2bAD424683Ee3bc534Ea464) {
    +++ description: None
      sinceBlock:
+        13666681
    }
```

```diff
    contract CallProxy (0x8a0C79F5532f3b2a16AD1E4282A5DAF81928a824) {
    +++ description: None
      sinceBlock:
+        13667557
    }
```

```diff
    contract SignatureVerifier (0x949b3B3c098348b879C9e4F15cecc8046d9C8A8c) {
    +++ description: None
      sinceBlock:
+        13667289
    }
```

```diff
    contract GnosisSafe (0xa0D6062Be29710c666aE850395Ac1A2AeCd14885) {
    +++ description: None
      sinceBlock:
+        13653314
    }
```

```diff
    contract SimpleFeeProxy (0xC2bAC0DB5B18B0c3225581Ba14BD0B448c623636) {
    +++ description: None
      sinceBlock:
+        13669463
    }
```

```diff
    contract DeBridgeToken (0xCAceBE8c354b70Fa6E3107f3F6F699e4Fbb3A98B) {
    +++ description: None
      sinceBlock:
+        18025232
    }
```

```diff
    contract ProxyAdmin (0xE4427af3555CD9303D728C491364FAdFDD7494Fe) {
    +++ description: None
      sinceBlock:
+        13665292
    }
```

Generated with discovered.json: 0x71cdeaa76c797a37d111425eb50b0b8acf584260

# Diff at Mon, 20 Jan 2025 11:09:24 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@2c8b4f3d9910bb6371be9b4df87b70856e7d8c64 block: 19531527
- current block number: 19531527

## Description

Rerun on the same block number. Applies fixes to permissions and via field. Renames permission's target to to/from.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19531527 (main branch discovery), not current.

```diff
    contract DeBridgeGate (0x43dE2d77BF8027e25dBD179B491e8d64f38398aA) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xE4427af3555CD9303D728C491364FAdFDD7494Fe"
      issuedPermissions.0.to:
+        "0xE4427af3555CD9303D728C491364FAdFDD7494Fe"
    }
```

```diff
    contract DeBridgeTokenDeployer (0x8244d6Ffe0695B30b2bAD424683Ee3bc534Ea464) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xE4427af3555CD9303D728C491364FAdFDD7494Fe"
      issuedPermissions.0.to:
+        "0xE4427af3555CD9303D728C491364FAdFDD7494Fe"
    }
```

```diff
    contract CallProxy (0x8a0C79F5532f3b2a16AD1E4282A5DAF81928a824) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xE4427af3555CD9303D728C491364FAdFDD7494Fe"
      issuedPermissions.0.to:
+        "0xE4427af3555CD9303D728C491364FAdFDD7494Fe"
    }
```

```diff
    contract SignatureVerifier (0x949b3B3c098348b879C9e4F15cecc8046d9C8A8c) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xE4427af3555CD9303D728C491364FAdFDD7494Fe"
      issuedPermissions.0.to:
+        "0xE4427af3555CD9303D728C491364FAdFDD7494Fe"
    }
```

```diff
    contract SimpleFeeProxy (0xC2bAC0DB5B18B0c3225581Ba14BD0B448c623636) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xE4427af3555CD9303D728C491364FAdFDD7494Fe"
      issuedPermissions.0.to:
+        "0xE4427af3555CD9303D728C491364FAdFDD7494Fe"
    }
```

```diff
    contract ProxyAdmin (0xE4427af3555CD9303D728C491364FAdFDD7494Fe) {
    +++ description: None
      receivedPermissions.4.target:
-        "0xC2bAC0DB5B18B0c3225581Ba14BD0B448c623636"
      receivedPermissions.4.from:
+        "0xC2bAC0DB5B18B0c3225581Ba14BD0B448c623636"
      receivedPermissions.3.target:
-        "0x949b3B3c098348b879C9e4F15cecc8046d9C8A8c"
      receivedPermissions.3.from:
+        "0x949b3B3c098348b879C9e4F15cecc8046d9C8A8c"
      receivedPermissions.2.target:
-        "0x8a0C79F5532f3b2a16AD1E4282A5DAF81928a824"
      receivedPermissions.2.from:
+        "0x8a0C79F5532f3b2a16AD1E4282A5DAF81928a824"
      receivedPermissions.1.target:
-        "0x8244d6Ffe0695B30b2bAD424683Ee3bc534Ea464"
      receivedPermissions.1.from:
+        "0x8244d6Ffe0695B30b2bAD424683Ee3bc534Ea464"
      receivedPermissions.0.target:
-        "0x43dE2d77BF8027e25dBD179B491e8d64f38398aA"
      receivedPermissions.0.from:
+        "0x43dE2d77BF8027e25dBD179B491e8d64f38398aA"
    }
```

Generated with discovered.json: 0x15ec9b6408709ac2627b2bf9c4d3ad3f60b39c89

# Diff at Mon, 21 Oct 2024 11:05:22 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@8895d33866f5665c4c710f4ddaa32bfa63cc3c78 block: 19531527
- current block number: 19531527

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19531527 (main branch discovery), not current.

```diff
    contract DeBridgeGate (0x43dE2d77BF8027e25dBD179B491e8d64f38398aA) {
    +++ description: None
      values.$pastUpgrades.5.2:
+        ["0x797161BCC625155D2302251404ccB93c2632658e"]
      values.$pastUpgrades.5.1:
-        ["0x797161BCC625155D2302251404ccB93c2632658e"]
+        "0x4c0887fede83ae4bb405125f1f08a3e6604ca712ae7c135de79e4595a9b408dd"
      values.$pastUpgrades.4.2:
+        ["0x24455aa55DED7728783c9474bE8eA2f5C935f8EB"]
      values.$pastUpgrades.4.1:
-        ["0x24455aa55DED7728783c9474bE8eA2f5C935f8EB"]
+        "0xd71afcf98347af3e96dc8ba6a61c4c9cdbb213e82893639945a1b8d4ab51d9e2"
      values.$pastUpgrades.3.2:
+        ["0xc8550d85759BAbE6851235212563Fa2Ff04961BF"]
      values.$pastUpgrades.3.1:
-        ["0xc8550d85759BAbE6851235212563Fa2Ff04961BF"]
+        "0x361b7193ffb8462e6ccb8a6237cbbf67f3367a08a9e8f781ac245f8b72c5783c"
      values.$pastUpgrades.2.2:
+        ["0x51bFD427D06B2a5FC3588f9d023994A9f70e0Ce0"]
      values.$pastUpgrades.2.1:
-        ["0x51bFD427D06B2a5FC3588f9d023994A9f70e0Ce0"]
+        "0x7a4bc7d90aada3516e4fc057714f46e5b25dcaf4c2524e49148f5c317a04b149"
      values.$pastUpgrades.1.2:
+        ["0xFCe0502293dCacbFc2d663f7814b2771dEcfd576"]
      values.$pastUpgrades.1.1:
-        ["0xFCe0502293dCacbFc2d663f7814b2771dEcfd576"]
+        "0x0cd2756ab739a46f966c013e709225d6e5e8a10f30bc0842b207205f6aa32670"
      values.$pastUpgrades.0.2:
+        ["0xB1A20D1c885fd775df97396397d6f8F07Abdd20D"]
      values.$pastUpgrades.0.1:
-        ["0xB1A20D1c885fd775df97396397d6f8F07Abdd20D"]
+        "0x1f191abb3e293e615df529fef0c7f1f0a9c5a9dacd44154c47df269d2a68d8b8"
    }
```

```diff
    contract DeBridgeTokenDeployer (0x8244d6Ffe0695B30b2bAD424683Ee3bc534Ea464) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0x4c7CA8fcFFE77281A8B81D4580CFf8257d785491"]
      values.$pastUpgrades.0.1:
-        ["0x4c7CA8fcFFE77281A8B81D4580CFf8257d785491"]
+        "0x291ee8bccd951b70182aee107393bc15fe0f12aa49d9759b196040f8c7ba219b"
    }
```

```diff
    contract CallProxy (0x8a0C79F5532f3b2a16AD1E4282A5DAF81928a824) {
    +++ description: None
      values.$pastUpgrades.5.2:
+        ["0xBd3d657AE87671eC6f8D6272A9f431a7c4a9B6f8"]
      values.$pastUpgrades.5.1:
-        ["0xBd3d657AE87671eC6f8D6272A9f431a7c4a9B6f8"]
+        "0xd5a418a542f27929f6bbf34f70ce62607626d83b8503bda49bcef3e5e0591ce9"
      values.$pastUpgrades.4.2:
+        ["0xe5a04b307B31Af07F4DfCaA840952Ff7d3845c7e"]
      values.$pastUpgrades.4.1:
-        ["0xe5a04b307B31Af07F4DfCaA840952Ff7d3845c7e"]
+        "0x883ba2edf63b460976d0de98a7089f3ea4d0a26257cfeb94af96d557e8e02f25"
      values.$pastUpgrades.3.2:
+        ["0x0C4B79205F6Cc20c0E0201b61b99e77F3CE3B67A"]
      values.$pastUpgrades.3.1:
-        ["0x0C4B79205F6Cc20c0E0201b61b99e77F3CE3B67A"]
+        "0x6d3f1f876d002a58b8c95bc7ebcbd107bae9d1474e9e92125d83b4bec578a2da"
      values.$pastUpgrades.2.2:
+        ["0x752A9e96e8683400ae238270C97c1D0160861fEF"]
      values.$pastUpgrades.2.1:
-        ["0x752A9e96e8683400ae238270C97c1D0160861fEF"]
+        "0x580899ecfd63515c52fec86f09211a5c68fc6945256cd13ef45f5e4fc8aaba61"
      values.$pastUpgrades.1.2:
+        ["0xd5317E82BFEFf70b4773f0fcab5e2ABFA3c7D63b"]
      values.$pastUpgrades.1.1:
-        ["0xd5317E82BFEFf70b4773f0fcab5e2ABFA3c7D63b"]
+        "0xc3bf11577e383e1292663bd254b218f4c4f4d9dd682a6d51f2a7149eb0991420"
      values.$pastUpgrades.0.2:
+        ["0x4e446b6Cf4d127827c83Ca0c848Db0B43841c391"]
      values.$pastUpgrades.0.1:
-        ["0x4e446b6Cf4d127827c83Ca0c848Db0B43841c391"]
+        "0x36e5d0f595838f33403445a5570b731087b16f2d7cb133aeb584f1ac1d444e3d"
    }
```

```diff
    contract SignatureVerifier (0x949b3B3c098348b879C9e4F15cecc8046d9C8A8c) {
    +++ description: None
      values.$pastUpgrades.1.2:
+        ["0xfE7De3c1e1BD252C67667B56347cABFC6df08dF4"]
      values.$pastUpgrades.1.1:
-        ["0xfE7De3c1e1BD252C67667B56347cABFC6df08dF4"]
+        "0x190291e3c01fd074908fb41309a0438c8458d7b7f0f659dcfc5d9dbb5ea3807f"
      values.$pastUpgrades.0.2:
+        ["0x2a3e72eD893b5958690e16c3BBe1BD92137b6250"]
      values.$pastUpgrades.0.1:
-        ["0x2a3e72eD893b5958690e16c3BBe1BD92137b6250"]
+        "0xd8f65ce63f16eefd8816d0faa6c975cb1422ef4d6bbb58bd8e7507fb27b2dc5f"
    }
```

```diff
    contract SimpleFeeProxy (0xC2bAC0DB5B18B0c3225581Ba14BD0B448c623636) {
    +++ description: None
      values.$pastUpgrades.1.2:
+        ["0x37a52ddb753c924f8C914de65ef00b5210Caa83C"]
      values.$pastUpgrades.1.1:
-        ["0x37a52ddb753c924f8C914de65ef00b5210Caa83C"]
+        "0x67612f4676f3c141f8360be940caf971519f9bf1265465f94a6c13ed1e64adca"
      values.$pastUpgrades.0.2:
+        ["0x27406EbF0b76923d93b4C6c6224bCaB7fFf11f87"]
      values.$pastUpgrades.0.1:
-        ["0x27406EbF0b76923d93b4C6c6224bCaB7fFf11f87"]
+        "0xd83a1e2513ffd001193b5d56264f9a3acce5eb31ccd7f122256afa5505c3213d"
    }
```

Generated with discovered.json: 0x56312b08d1c137713e20f36913e328b2e18c72f8

# Diff at Mon, 14 Oct 2024 10:50:22 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1afc77ff111ceb0970e7d09efcc7b2f376b0c281 block: 19531527
- current block number: 19531527

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19531527 (main branch discovery), not current.

```diff
    contract DeBridgeGate (0x43dE2d77BF8027e25dBD179B491e8d64f38398aA) {
    +++ description: None
      sourceHashes:
+        ["0x6d1bbfb1ed7d88848e594dc11366fbed3d53c5a507022c04dbeea72ef549cd6a","0xcd8bce7612cc46b4eb6dae7d913880fdd47ee8fcd03d90bd5d99fe145638685c"]
    }
```

```diff
    contract Admin Multisig (0x6bec1faF33183e1Bc316984202eCc09d46AC92D5) {
    +++ description: None
      sourceHashes:
+        ["0x81a7349eebb98ac33b0bc6842e3cb258034a8f2a4ba004570bb8e2e25947f9ff","0xd42bbf9f7dcd3720a7fc6bdc6edfdfae8800a37d6dd4decfa0ef6ca4a2e88940"]
    }
```

```diff
    contract DeBridgeTokenDeployer (0x8244d6Ffe0695B30b2bAD424683Ee3bc534Ea464) {
    +++ description: None
      sourceHashes:
+        ["0x6d1bbfb1ed7d88848e594dc11366fbed3d53c5a507022c04dbeea72ef549cd6a","0x90a8fe0eeb8f61a691fd579cb10499f4fd9167497e9aeab3b1ce4f6427fabc96"]
    }
```

```diff
    contract CallProxy (0x8a0C79F5532f3b2a16AD1E4282A5DAF81928a824) {
    +++ description: None
      sourceHashes:
+        ["0x6d1bbfb1ed7d88848e594dc11366fbed3d53c5a507022c04dbeea72ef549cd6a","0xd67e23441d8b22dcf363c048ad14a86a4de64b242cb242fd7ef0fa11da2cb6ff"]
    }
```

```diff
    contract SignatureVerifier (0x949b3B3c098348b879C9e4F15cecc8046d9C8A8c) {
    +++ description: None
      sourceHashes:
+        ["0x6d1bbfb1ed7d88848e594dc11366fbed3d53c5a507022c04dbeea72ef549cd6a","0xbda27aaf69ce4f365f73f0436a7e06bffede3a693579569ec42ae41718b94c75"]
    }
```

```diff
    contract GnosisSafe (0xa0D6062Be29710c666aE850395Ac1A2AeCd14885) {
    +++ description: None
      sourceHashes:
+        ["0x81a7349eebb98ac33b0bc6842e3cb258034a8f2a4ba004570bb8e2e25947f9ff","0xd42bbf9f7dcd3720a7fc6bdc6edfdfae8800a37d6dd4decfa0ef6ca4a2e88940"]
    }
```

```diff
    contract SimpleFeeProxy (0xC2bAC0DB5B18B0c3225581Ba14BD0B448c623636) {
    +++ description: None
      sourceHashes:
+        ["0x6d1bbfb1ed7d88848e594dc11366fbed3d53c5a507022c04dbeea72ef549cd6a","0xc18d3818f9e809ced3dcce60fbe4287220ce2fced4f6c66711de5e704738bb9a"]
    }
```

```diff
    contract DeBridgeToken (0xCAceBE8c354b70Fa6E3107f3F6F699e4Fbb3A98B) {
    +++ description: None
      sourceHashes:
+        ["0x13def2c5fc95163873f1d15d260b9e03ac811bd830b6ed282e527268e3ca7759"]
    }
```

```diff
    contract ProxyAdmin (0xE4427af3555CD9303D728C491364FAdFDD7494Fe) {
    +++ description: None
      sourceHashes:
+        ["0x31b987ba8db4fc147856ec1375d9df4f40d58c4dc97e16be5b38ee2e3c3cc6f9"]
    }
```

Generated with discovered.json: 0xcc37d0b5927f57a7bfcca5b67187d28a067d781f

# Diff at Tue, 01 Oct 2024 10:50:38 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bd754dc73c66120164006054f8d25c5fae9cd910 block: 19531527
- current block number: 19531527

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19531527 (main branch discovery), not current.

```diff
    contract DeBridgeGate (0x43dE2d77BF8027e25dBD179B491e8d64f38398aA) {
    +++ description: None
      values.$pastUpgrades:
+        [["2021-11-22T15:36:30.000Z",["0xB1A20D1c885fd775df97396397d6f8F07Abdd20D"]],["2021-12-16T14:53:55.000Z",["0xFCe0502293dCacbFc2d663f7814b2771dEcfd576"]],["2022-01-18T09:29:57.000Z",["0x51bFD427D06B2a5FC3588f9d023994A9f70e0Ce0"]],["2022-02-16T13:27:21.000Z",["0xc8550d85759BAbE6851235212563Fa2Ff04961BF"]],["2022-03-15T12:17:48.000Z",["0x24455aa55DED7728783c9474bE8eA2f5C935f8EB"]],["2022-12-15T10:58:59.000Z",["0x797161BCC625155D2302251404ccB93c2632658e"]]]
    }
```

```diff
    contract DeBridgeTokenDeployer (0x8244d6Ffe0695B30b2bAD424683Ee3bc534Ea464) {
    +++ description: None
      values.$pastUpgrades:
+        [["2021-11-22T20:43:22.000Z",["0x4c7CA8fcFFE77281A8B81D4580CFf8257d785491"]]]
    }
```

```diff
    contract CallProxy (0x8a0C79F5532f3b2a16AD1E4282A5DAF81928a824) {
    +++ description: None
      values.$pastUpgrades:
+        [["2021-11-22T23:54:37.000Z",["0x4e446b6Cf4d127827c83Ca0c848Db0B43841c391"]],["2022-01-18T09:32:02.000Z",["0xd5317E82BFEFf70b4773f0fcab5e2ABFA3c7D63b"]],["2022-02-16T12:55:04.000Z",["0x752A9e96e8683400ae238270C97c1D0160861fEF"]],["2022-05-02T14:08:42.000Z",["0x0C4B79205F6Cc20c0E0201b61b99e77F3CE3B67A"]],["2022-05-19T13:24:39.000Z",["0xe5a04b307B31Af07F4DfCaA840952Ff7d3845c7e"]],["2022-05-28T12:04:47.000Z",["0xBd3d657AE87671eC6f8D6272A9f431a7c4a9B6f8"]]]
    }
```

```diff
    contract SignatureVerifier (0x949b3B3c098348b879C9e4F15cecc8046d9C8A8c) {
    +++ description: None
      values.$pastUpgrades:
+        [["2021-11-22T22:58:34.000Z",["0x2a3e72eD893b5958690e16c3BBe1BD92137b6250"]],["2021-12-17T11:09:26.000Z",["0xfE7De3c1e1BD252C67667B56347cABFC6df08dF4"]]]
    }
```

```diff
    contract SimpleFeeProxy (0xC2bAC0DB5B18B0c3225581Ba14BD0B448c623636) {
    +++ description: None
      values.$pastUpgrades:
+        [["2021-11-23T07:17:24.000Z",["0x27406EbF0b76923d93b4C6c6224bCaB7fFf11f87"]],["2022-02-16T12:53:26.000Z",["0x37a52ddb753c924f8C914de65ef00b5210Caa83C"]]]
    }
```

Generated with discovered.json: 0x7d79e2d69c93c74c05856e4aaf1e5fa49701aa6e

# Diff at Fri, 30 Aug 2024 07:51:51 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@6c1bd1f41fadf5f2cb1c1805b5a2c6138a3ed35a block: 19531527
- current block number: 19531527

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19531527 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0xE4427af3555CD9303D728C491364FAdFDD7494Fe) {
    +++ description: None
      receivedPermissions.4.via:
-        []
      receivedPermissions.3.via:
-        []
      receivedPermissions.2.via:
-        []
      receivedPermissions.1.via:
-        []
      receivedPermissions.0.via:
-        []
    }
```

Generated with discovered.json: 0xde56002fbef5f5aaa8156ca51c09c6a39036544e

# Diff at Fri, 23 Aug 2024 09:51:52 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@67597c7d6c810bc726594446890178150240711e block: 19531527
- current block number: 19531527

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19531527 (main branch discovery), not current.

```diff
    contract DeBridgeGate (0x43dE2d77BF8027e25dBD179B491e8d64f38398aA) {
    +++ description: None
      values.$upgradeCount:
+        6
    }
```

```diff
    contract DeBridgeTokenDeployer (0x8244d6Ffe0695B30b2bAD424683Ee3bc534Ea464) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract CallProxy (0x8a0C79F5532f3b2a16AD1E4282A5DAF81928a824) {
    +++ description: None
      values.$upgradeCount:
+        6
    }
```

```diff
    contract SignatureVerifier (0x949b3B3c098348b879C9e4F15cecc8046d9C8A8c) {
    +++ description: None
      values.$upgradeCount:
+        2
    }
```

```diff
    contract SimpleFeeProxy (0xC2bAC0DB5B18B0c3225581Ba14BD0B448c623636) {
    +++ description: None
      values.$upgradeCount:
+        2
    }
```

Generated with discovered.json: 0x4ddc94444b30e4de717b40d2aa458862856ca290

# Diff at Wed, 21 Aug 2024 10:02:37 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@2f6dde3357bf5d79196b6e94f79d853a6c4ec72b block: 19531527
- current block number: 19531527

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19531527 (main branch discovery), not current.

```diff
    contract DeBridgeGate (0x43dE2d77BF8027e25dBD179B491e8d64f38398aA) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xE4427af3555CD9303D728C491364FAdFDD7494Fe","via":[]}]
    }
```

```diff
    contract DeBridgeTokenDeployer (0x8244d6Ffe0695B30b2bAD424683Ee3bc534Ea464) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xE4427af3555CD9303D728C491364FAdFDD7494Fe","via":[]}]
    }
```

```diff
    contract CallProxy (0x8a0C79F5532f3b2a16AD1E4282A5DAF81928a824) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xE4427af3555CD9303D728C491364FAdFDD7494Fe","via":[]}]
    }
```

```diff
    contract SignatureVerifier (0x949b3B3c098348b879C9e4F15cecc8046d9C8A8c) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xE4427af3555CD9303D728C491364FAdFDD7494Fe","via":[]}]
    }
```

```diff
    contract SimpleFeeProxy (0xC2bAC0DB5B18B0c3225581Ba14BD0B448c623636) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xE4427af3555CD9303D728C491364FAdFDD7494Fe","via":[]}]
    }
```

```diff
    contract ProxyAdmin (0xE4427af3555CD9303D728C491364FAdFDD7494Fe) {
    +++ description: None
      assignedPermissions:
-        {"upgrade":["0x43dE2d77BF8027e25dBD179B491e8d64f38398aA","0x8244d6Ffe0695B30b2bAD424683Ee3bc534Ea464","0x8a0C79F5532f3b2a16AD1E4282A5DAF81928a824","0x949b3B3c098348b879C9e4F15cecc8046d9C8A8c","0xC2bAC0DB5B18B0c3225581Ba14BD0B448c623636"]}
      receivedPermissions:
+        [{"permission":"upgrade","target":"0x43dE2d77BF8027e25dBD179B491e8d64f38398aA","via":[]},{"permission":"upgrade","target":"0x8244d6Ffe0695B30b2bAD424683Ee3bc534Ea464","via":[]},{"permission":"upgrade","target":"0x8a0C79F5532f3b2a16AD1E4282A5DAF81928a824","via":[]},{"permission":"upgrade","target":"0x949b3B3c098348b879C9e4F15cecc8046d9C8A8c","via":[]},{"permission":"upgrade","target":"0xC2bAC0DB5B18B0c3225581Ba14BD0B448c623636","via":[]}]
    }
```

Generated with discovered.json: 0x7a5b0751cc93b478d827595729c278e302cbf4b0

# Diff at Fri, 09 Aug 2024 11:59:07 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bf40aa32f030fd312056ca0ef198c8550467d1d7 block: 19531527
- current block number: 19531527

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19531527 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0xE4427af3555CD9303D728C491364FAdFDD7494Fe) {
    +++ description: None
      assignedPermissions.upgrade.4:
-        "0x949b3B3c098348b879C9e4F15cecc8046d9C8A8c"
+        "0xC2bAC0DB5B18B0c3225581Ba14BD0B448c623636"
      assignedPermissions.upgrade.3:
-        "0xC2bAC0DB5B18B0c3225581Ba14BD0B448c623636"
+        "0x949b3B3c098348b879C9e4F15cecc8046d9C8A8c"
      assignedPermissions.upgrade.2:
-        "0x8244d6Ffe0695B30b2bAD424683Ee3bc534Ea464"
+        "0x8a0C79F5532f3b2a16AD1E4282A5DAF81928a824"
      assignedPermissions.upgrade.1:
-        "0x8a0C79F5532f3b2a16AD1E4282A5DAF81928a824"
+        "0x8244d6Ffe0695B30b2bAD424683Ee3bc534Ea464"
    }
```

Generated with discovered.json: 0xe26b5f1f4100a80a7834bb9a137a63ab5b73bf24

# Diff at Fri, 09 Aug 2024 10:09:14 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f0da1d0aab7bc6b3b5e54e7e93480bd98e57035 block: 19531527
- current block number: 19531527

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19531527 (main branch discovery), not current.

```diff
    contract Admin Multisig (0x6bec1faF33183e1Bc316984202eCc09d46AC92D5) {
    +++ description: None
      values.$multisigThreshold:
-        "5 of 8 (63%)"
      values.getOwners:
-        ["0xbA7cE717928A6C51ab530aD9AdB69bA6E76D09B5","0xC351f905d810Cb33c54fE771e1bE4ec5A5048c2D","0xD4Aa80C7a35B2C996Ef3F83baf91D5721c86dA2C","0x874B1d14bF4FE455C9eCAcDf66b629e10664c6E1","0xE9666D80e5617bA1470E2cA09F2D9B0C8CCd56B7","0x6f572a24c5C009fC8C844Fab5352edf79F132FBD","0xd725E456D5beD8275E297C4Dd11135e3C5cDe544","0x24C0E1C19c8eC997b781dF4B4A0f812aE9667c96"]
      values.getThreshold:
-        5
      values.$members:
+        ["0xbA7cE717928A6C51ab530aD9AdB69bA6E76D09B5","0xC351f905d810Cb33c54fE771e1bE4ec5A5048c2D","0xD4Aa80C7a35B2C996Ef3F83baf91D5721c86dA2C","0x874B1d14bF4FE455C9eCAcDf66b629e10664c6E1","0xE9666D80e5617bA1470E2cA09F2D9B0C8CCd56B7","0x6f572a24c5C009fC8C844Fab5352edf79F132FBD","0xd725E456D5beD8275E297C4Dd11135e3C5cDe544","0x24C0E1C19c8eC997b781dF4B4A0f812aE9667c96"]
      values.$threshold:
+        5
      values.multisigThreshold:
+        "5 of 8 (63%)"
    }
```

```diff
    contract GnosisSafe (0xa0D6062Be29710c666aE850395Ac1A2AeCd14885) {
    +++ description: None
      values.$multisigThreshold:
-        "2 of 3 (67%)"
      values.getOwners:
-        ["0x360f6cF86D3ed3c77E79dA6cE374aff842DfB0A0","0xd725E456D5beD8275E297C4Dd11135e3C5cDe544","0x24C0E1C19c8eC997b781dF4B4A0f812aE9667c96"]
      values.getThreshold:
-        2
      values.$members:
+        ["0x360f6cF86D3ed3c77E79dA6cE374aff842DfB0A0","0xd725E456D5beD8275E297C4Dd11135e3C5cDe544","0x24C0E1C19c8eC997b781dF4B4A0f812aE9667c96"]
      values.$threshold:
+        2
      values.multisigThreshold:
+        "2 of 3 (67%)"
    }
```

```diff
    contract ProxyAdmin (0xE4427af3555CD9303D728C491364FAdFDD7494Fe) {
    +++ description: None
      assignedPermissions.admin:
-        ["0x43dE2d77BF8027e25dBD179B491e8d64f38398aA","0x8244d6Ffe0695B30b2bAD424683Ee3bc534Ea464","0x8a0C79F5532f3b2a16AD1E4282A5DAF81928a824","0x949b3B3c098348b879C9e4F15cecc8046d9C8A8c","0xC2bAC0DB5B18B0c3225581Ba14BD0B448c623636"]
      assignedPermissions.upgrade:
+        ["0x43dE2d77BF8027e25dBD179B491e8d64f38398aA","0x8a0C79F5532f3b2a16AD1E4282A5DAF81928a824","0x8244d6Ffe0695B30b2bAD424683Ee3bc534Ea464","0xC2bAC0DB5B18B0c3225581Ba14BD0B448c623636","0x949b3B3c098348b879C9e4F15cecc8046d9C8A8c"]
    }
```

Generated with discovered.json: 0x34f9ac97eab2ad6732a9a06b5a7ee8bd82790948

# Diff at Thu, 28 Mar 2024 08:50:13 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@867de6120241d47b66bf76f83c490408eb3595b0 block: 18168455
- current block number: 19531527

## Description

Update discovery to include the multisig threshold.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 18168455 (main branch discovery), not current.

```diff
    contract Admin Multisig (0x6bec1faF33183e1Bc316984202eCc09d46AC92D5) {
    +++ description: None
      upgradeability.threshold:
+        "5 of 8 (63%)"
    }
```

```diff
    contract GnosisSafe (0xa0D6062Be29710c666aE850395Ac1A2AeCd14885) {
    +++ description: None
      upgradeability.threshold:
+        "2 of 3 (67%)"
    }
```

Generated with discovered.json: 0xa161a29a73bdb10e32f48033bfc0773a2c051c5b
