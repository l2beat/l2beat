Generated with discovered.json: 0x40ee005b1b236066f02ef1c4a0f5dfd9252b45d3

# Diff at Thu, 11 Apr 2024 06:24:39 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@379d5924e19a3a6dfc1858baca3e1ce1c43bfe6f block: 19532058
- current block number: 19630573

## Description

### New deploys

OneStepProofEntry, OneStepProverHostIo, OneStepProverMath, OneStepProver0, OneStepProverMemory are redeployed and Reader4844 is added to to be compatible with EIP-4844.

- OneStepProverHostIo: Compatibility with EIP-4844, most updates are KZG-related in funtion `executeReadPreImage()`; new function `modExp256()`
- Reader4844.sol: New unverified contract with the functions `getBlobBaseFee()`, `getDataHashes()` for reading blob data (hashes) (info from its interface)

### SequencerInbox

In general most updates are EIP-4844 related, also the new role `batchPosterManager` is added and there are new checks regarding native tokens.

- Batch data flag-based decoding refined for blobs: `DATA_AUTHENTICATED_FLAG`, `BROTLI_MESSAGE_HEADER_FLAG`, `DAS_MESSAGE_HEADER_FLAG`, `DATA_BLOB_HEADER_FLAG`, `TREE_DAS_MESSAGE_HEADER_FLAG`, `ZERO_HEAVY_MESSAGE_HEADER_FLAG`
- new `batchPosterManager` functions and role: Can change the Sequencer addresses. (allows key rotation of batch posters)
- new `addSequencerL2BatchFromOrigin()` (with added `prevMessageCount, newMessageCount` in sig, old signature without them is now deprecated), `addSequencerL2BatchFromBlobs()`
- Gas refunds fetch blob price from Reader4844
- Rollup owner can update rollup address
- SequencerInbox contructor reverts if host chain is Arbitrum because blobs are not supported there
  - Checks for fee token usage and reverts if the native token is not ETH
- `forceInclusion()` now does not change the sequencer message count
- IBridge interface is introduced to use the vars TimeBounds and BatchDataLocation
- Hashing functions for blobs vs. calldata
- Time variation boundaries for batch posting vs. force inclusion -> format change

### Changed wasmModuleRoot

Upgrade L2 system to [ArbOS Version 20 "Atlas"](https://forum.arbitrum.foundation/t/aip-arbos-version-20-atlas/20957)

## Watched changes

```diff
-   Status: DELETED
    contract OneStepProofEntry (0x09824fe72BFF474d16D9c2774432E381BBD60662)
    +++ description: None
```

```diff
    contract ChallengeManager (0x28c32059d7e6147cf5257DFC127f7258beA1cdf4) {
    +++ description: None
      upgradeability.implementation:
-        "0xEe9E5546A11Cb5b4A86e92DA05f2ef75C26E4754"
+        "0x1D901DD7A5eFE421C3C437B147040E5AF22E6A43"
      implementations.0:
-        "0xEe9E5546A11Cb5b4A86e92DA05f2ef75C26E4754"
+        "0x1D901DD7A5eFE421C3C437B147040E5AF22E6A43"
      values.osp:
-        "0x09824fe72BFF474d16D9c2774432E381BBD60662"
+        "0x57EA090Ac0554d174AE0e2855B460e84A1A7C221"
    }
```

```diff
-   Status: DELETED
    contract OneStepProverMemory (0x4811500e0d376Fa8d2EA3CCb7c61E0afB4F5A7f1)
    +++ description: None
```

```diff
    contract RollupProxy (0x6594085ca55a2B3a5fAD1C57A270D060eEa99877) {
    +++ description: None
      values.wasmModuleRoot:
-        "0x0754e09320c381566cc0449904c377a52bd34a6b9404432e80afd573b67f7b17"
+        "0x8b104a2e80ac6165dc58b9048de12f301d70b02a0ab51396c22b4b4b802a16a4"
    }
```

```diff
-   Status: DELETED
    contract OneStepProverMath (0x89AF7C4C2198c426cFe6E86de0680A0850503e06)
    +++ description: None
```

```diff
-   Status: DELETED
    contract OneStepProverHostIo (0x99a2A31300816C1FA3f40818AC9280fe7271F878)
    +++ description: None
```

```diff
    contract SequencerInbox (0xb4795A0edae98d7820C37F06f6b858e7acb51DF8) {
    +++ description: None
      upgradeability.implementation:
-        "0x873484Ba63353C8b71210ce123B465512d408B27"
+        "0x383f16fB2809a56fC639c1eE2c93Ad2aa7Ee130A"
      implementations.0:
-        "0x873484Ba63353C8b71210ce123B465512d408B27"
+        "0x383f16fB2809a56fC639c1eE2c93Ad2aa7Ee130A"
      values.batchPosterManager:
+        "0x0000000000000000000000000000000000000000"
      values.BROTLI_MESSAGE_HEADER_FLAG:
+        "0x00"
      values.DAS_MESSAGE_HEADER_FLAG:
+        "0x80"
      values.DATA_BLOB_HEADER_FLAG:
+        "0x50"
      values.isUsingFeeToken:
+        true
      values.reader4844:
+        "0x7Deda2425eC2d4EA0DF689A78de2fBF002075576"
      values.TREE_DAS_MESSAGE_HEADER_FLAG:
+        "0x08"
      values.ZERO_HEAVY_MESSAGE_HEADER_FLAG:
+        "0x20"
    }
```

```diff
-   Status: DELETED
    contract OneStepProver0 (0xDf94F0474F205D086dbc2e66D69a856FCf520622)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProverHostIo (0x17e7F68ce50A77e55C7834ddF31AEf86403B8010)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProofEntry (0x57EA090Ac0554d174AE0e2855B460e84A1A7C221)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProver0 (0x72B166070781a552D7b95a907eF59ca05d3D5a62)
    +++ description: None
```

```diff
+   Status: CREATED
    contract  (0x7Deda2425eC2d4EA0DF689A78de2fBF002075576)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProverMemory (0x8b73Ef238ADaB31EBC7c05423d243c345241a22f)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProverMath (0x90eC62De2EB7C7512a22bD2D55926AD6bA609F38)
    +++ description: None
```

## Source code changes

```diff
.../meta.txt                                       |   0
 .../meta.txt                                       |   2 +
 .../ChallengeManager/implementation/meta.txt       |   2 +-
 .../implementation/src/bridge/IBridge.sol          |  22 +
 .../implementation/src/bridge/ISequencerInbox.sol  |  91 +++-
 .../src/challenge/ChallengeManager.sol             |   6 +
 .../implementation/src/libraries/Error.sol         |  27 +-
 .../implementation/src/libraries/IGasRefunder.sol  |  25 -
 .../OneStepProofEntry/meta.txt                     |   2 +-
 .../OneStepProofEntry/src/bridge/IBridge.sol       |  22 +
 .../src/bridge/ISequencerInbox.sol                 |  91 +++-
 .../src/libraries/IGasRefunder.sol                 |  25 -
 .../OneStepProver0/meta.txt                        |   2 +-
 .../OneStepProver0/src/bridge/IBridge.sol          |  22 +
 .../OneStepProver0/src/bridge/ISequencerInbox.sol  |  91 +++-
 .../OneStepProver0/src/libraries/IGasRefunder.sol  |  25 -
 .../OneStepProverHostIo/meta.txt                   |   2 +-
 .../OneStepProverHostIo/src/bridge/IBridge.sol     |  22 +
 .../src/bridge/ISequencerInbox.sol                 |  91 +++-
 .../src/libraries/IGasRefunder.sol                 |  25 -
 .../src/osp/OneStepProverHostIo.sol                | 107 +++-
 .../OneStepProverMath/meta.txt                     |   2 +-
 .../OneStepProverMath/src/bridge/IBridge.sol       |  22 +
 .../src/bridge/ISequencerInbox.sol                 |  91 +++-
 .../src/libraries/IGasRefunder.sol                 |  25 -
 .../OneStepProverMemory/meta.txt                   |   2 +-
 .../OneStepProverMemory/src/bridge/IBridge.sol     |  22 +
 .../src/bridge/ISequencerInbox.sol                 |  91 +++-
 .../src/libraries/IGasRefunder.sol                 |  25 -
 .../SequencerInbox/implementation/meta.txt         |   2 +-
 .../implementation/src/bridge/IBridge.sol          |  22 +
 .../implementation/src/bridge/IERC20Bridge.sol     |  37 ++
 .../implementation/src/bridge/ISequencerInbox.sol  |  91 +++-
 .../implementation/src/bridge/SequencerInbox.sol   | 578 ++++++++++++++++-----
 .../implementation/src/libraries/Error.sol         |  27 +-
 .../src/libraries/GasRefundEnabled.sol             |  52 ++
 .../implementation/src/libraries/IGasRefunder.sol  |  25 -
 .../implementation/src/libraries/IReader4844.sol   |  13 +
 .../implementation/src/precompiles/ArbGasInfo.sol  |  20 +
 39 files changed, 1358 insertions(+), 491 deletions(-)
```

Generated with discovered.json: 0x3234178d91d403e54fbe5caf0f912f14a404a51e

# Diff at Thu, 28 Mar 2024 10:37:17 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@dd32bb06b292cc8459fb09925454ee3a90f5c27e block: 19125146
- current block number: 19532058

## Description

Update discovery to include the multisig threshold.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19125146 (main branch discovery), not current.

```diff
    contract OwnerMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      upgradeability.threshold:
+        "3 of 5 (60%)"
    }
```

Generated with discovered.json: 0x01fbed9cb33e2f0bf40c3c67a6a73b1e5c4000da

# Diff at Wed, 31 Jan 2024 08:01:53 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@367f818d32ce6c1ab18696a1cbeb7a6f368b6d78 block: 19119505
- current block number: 19125146

## Description

Start tracking the keySetUpdates.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19119505 (main branch discovery), not current.

```diff
    contract SequencerInbox (0xb4795A0edae98d7820C37F06f6b858e7acb51DF8) {
      values.keySetUpdates:
+        0
    }
```

Generated with discovered.json: 0x5cf12304ad462ca8b57812f5d60a6a7fbd19058d

# Diff at Tue, 30 Jan 2024 13:05:10 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@ceb6abb9c987b0d53dd547a79c3ebbf3480a024b block: 19075194
- current block number: 19119505

## Description

Add the SequencerInboxVersion handler.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19075194 (main branch discovery), not current.

```diff
    contract SequencerInbox (0xb4795A0edae98d7820C37F06f6b858e7acb51DF8) {
      values.sequencerVersion:
+        "0x00"
    }
```

Generated with discovered.json: 0x616619b46862d7649368c11858319d5e420f5791

# Diff at Wed, 24 Jan 2024 08:06:10 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@bef03f2ccf4bccd5d53aa62da5612827a762973f block: 19069632
- current block number: 19075194

## Description

Contracts have been verified.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19069632 (main branch discovery), not current.

```diff
    contract OneStepProverMemory (0x4811500e0d376Fa8d2EA3CCb7c61E0afB4F5A7f1) {
      unverified:
-        true
      derivedName:
-        ""
+        "OneStepProverMemory"
    }
```

```diff
    contract OneStepProverMath (0x89AF7C4C2198c426cFe6E86de0680A0850503e06) {
      unverified:
-        true
      derivedName:
-        ""
+        "OneStepProverMath"
    }
```

```diff
    contract OneStepProverHostIo (0x99a2A31300816C1FA3f40818AC9280fe7271F878) {
      unverified:
-        true
      derivedName:
-        ""
+        "OneStepProverHostIo"
    }
```

```diff
    contract OneStepProver0 (0xDf94F0474F205D086dbc2e66D69a856FCf520622) {
      unverified:
-        true
      derivedName:
-        ""
+        "OneStepProver0"
    }
```

# Diff at Tue, 23 Jan 2024 13:21:17 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@74040c3a8f43c630b3d31cc8376e84f5f9acda5c block: 19032900
- current block number: 19069632

## Description

Added discovery of rollup validators.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19032900 (main branch discovery), not current.

```diff
    contract  (0x4811500e0d376Fa8d2EA3CCb7c61E0afB4F5A7f1) {
      name:
-        ""
+        "OneStepProverMemory"
      derivedName:
+        ""
    }
```

```diff
    contract RollupProxy (0x6594085ca55a2B3a5fAD1C57A270D060eEa99877) {
      values.validators:
+        ["0x56D33424edb428744597Ec02571f14B50a33b7de"]
    }
```

```diff
    contract ProxyAdmin (0x6d4bE7c1a618D43bE4a1Bd7F8eC8E079Ff52Fb4d) {
      derivedName:
+        "ProxyAdmin"
    }
```

```diff
    contract  (0x89AF7C4C2198c426cFe6E86de0680A0850503e06) {
      name:
-        ""
+        "OneStepProverMath"
      derivedName:
+        ""
    }
```

```diff
    contract  (0x99a2A31300816C1FA3f40818AC9280fe7271F878) {
      name:
-        ""
+        "OneStepProverHostIo"
      derivedName:
+        ""
    }
```

```diff
    contract SequencerInbox (0xb4795A0edae98d7820C37F06f6b858e7acb51DF8) {
      values.batchPosters:
+        ["0x5eAD389b57d533A94a0eacd570Dc1CC59C25F2D4"]
    }
```

```diff
    contract  (0xDf94F0474F205D086dbc2e66D69a856FCf520622) {
      name:
-        ""
+        "OneStepProver0"
      derivedName:
+        ""
    }
```

# Diff at Thu, 18 Jan 2024 09:37:21 GMT:

- author: Michał Podsiadły (<michal.podsiadly@l2beat.com>)
- comparing to: main@0cb1eb82b45ad89a272a3c1b8f8f24ae020627cc block: 18962479
- current block number: 19032900

## Description

Ignore nonce of GnosisSafe multisig

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 18962479 (main branch discovery), not current.

```diff
    contract GnosisSafe (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
      name:
-        "GnosisSafe"
+        "OwnerMultisig"
      values.nonce:
-        9
      derivedName:
+        "GnosisSafe"
    }
```

# Diff at Mon, 08 Jan 2024 13:05:46 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- current block number: 18962479

## Description

Update discovery to include the multisig threshold.

## Initial discovery

```diff
+   Status: CREATED
    contract OneStepProofEntry (0x09824fe72BFF474d16D9c2774432E381BBD60662) {
    }
```

```diff
+   Status: CREATED
    contract Inbox (0x12485B9d469c1D51d05b5C39e009D50eF0170cF7) {
    }
```

```diff
+   Status: CREATED
    contract L1WETHGateway (0x150286BdbE7C8Cd23D41a8e1e64438e0dc04dc3d) {
    }
```

```diff
+   Status: CREATED
    contract  (0x27C7Bfd2cC11429e9b80c443b42FDBe4754F6c91) {
    }
```

```diff
+   Status: CREATED
    contract ChallengeManager (0x28c32059d7e6147cf5257DFC127f7258beA1cdf4) {
    }
```

```diff
+   Status: CREATED
    contract ValidatorUtils (0x2b0E04Dc90e3fA58165CB41E2834B44A56E766aF) {
    }
```

```diff
+   Status: CREATED
    contract RollupEventInbox (0x36E5DE57f862cf5bA28624845faB8c2fF6Aa41d2) {
    }
```

```diff
+   Status: CREATED
    contract  (0x4811500e0d376Fa8d2EA3CCb7c61E0afB4F5A7f1) {
    }
```

```diff
+   Status: CREATED
    contract GnosisSafe (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    }
```

```diff
+   Status: CREATED
    contract Bridge (0x5a961c7D162195a9Dc5a357Cc168b0694283382E) {
    }
```

```diff
+   Status: CREATED
    contract L1GatewayRouter (0x5D657b905275F36AD62C3d5C36966975613aFB96) {
    }
```

```diff
+   Status: CREATED
    contract RollupProxy (0x6594085ca55a2B3a5fAD1C57A270D060eEa99877) {
    }
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x6d4bE7c1a618D43bE4a1Bd7F8eC8E079Ff52Fb4d) {
    }
```

```diff
+   Status: CREATED
    contract L1ERC20Gateway (0x6Eb9240d4add111D5Fc81b10Ff12eECabcf9752d) {
    }
```

```diff
+   Status: CREATED
    contract  (0x89AF7C4C2198c426cFe6E86de0680A0850503e06) {
    }
```

```diff
+   Status: CREATED
    contract  (0x99a2A31300816C1FA3f40818AC9280fe7271F878) {
    }
```

```diff
+   Status: CREATED
    contract ValidatorWalletCreator (0x9CAd81628aB7D8e239F1A5B497313341578c5F71) {
    }
```

```diff
+   Status: CREATED
    contract L1CustomGateway (0xa1c86E2362dba0525075622af6d5f739B1304D45) {
    }
```

```diff
+   Status: CREATED
    contract SequencerInbox (0xb4795A0edae98d7820C37F06f6b858e7acb51DF8) {
    }
```

```diff
+   Status: CREATED
    contract Outbox (0xB6e0586616ebE79b2F86dDB32048c500D23b3AC3) {
    }
```

```diff
+   Status: CREATED
    contract UpgradeExecutor (0xD368b8dC5cB6fA26A53b7588db9A87E509A72d89) {
    }
```

```diff
+   Status: CREATED
    contract  (0xDf94F0474F205D086dbc2e66D69a856FCf520622) {
    }
```
