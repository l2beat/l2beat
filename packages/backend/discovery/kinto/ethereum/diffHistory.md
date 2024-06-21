Generated with discovered.json: 0x8ab0d2106a1286e919f74644647a18bfdb886090

# Diff at Wed, 29 May 2024 14:51:45 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@d0877009edde2713b2b4f20a593b40156f5de045 block: 19929993
- current block number: 19976230

## Description

Config related: Owner is upgrade admin.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19929993 (main branch discovery), not current.

```diff
    contract Bridger (0x0f1b7bd7762662B23486320AA91F30312184f70C) {
    +++ description: None
      upgradeability.admin:
-        "0x0000000000000000000000000000000000000000"
+        "0xf152Abda9E4ce8b134eF22Dc3C6aCe19C4895D82"
    }
```

Generated with discovered.json: 0x5bb6fb6f0a3145d9c836665d91d5d854ec30ae16

# Diff at Wed, 22 May 2024 15:45:03 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@d8b1d401a7eb2fd4dbc2edda92ae733061915c30 block: 19919191
- current block number: 19926394

## Description

The Bridger is upgraded to a new implementation. Currently there are no funds in it as the prelaunch-farm (Engen) has concluded and assets were [bridged](https://etherscan.io/tx/0xbbdbbf2f7ddd1ac994d9a96b2da163e72339866dee3dbac7004fe4a64ee26f92) via socket to the Kinto L2.

### Bridger.sol

The logic of the Bridger is still a Gateway contract to the Kinto L2. As the prelaunch phase has concluded, ERC-20 tokens can now be deposited to the Bridger and are bridged directly to the L2, so the Bridger will not escrow assets anymore. It also now uses a 0x exchange proxy to swap into 'final assets' before depositing. Final assets for Kinto can be defined by the depositer and can also be the inputAsset, in which case no swap is performed and the asset is bridged directly. The bridge address is supplied with the call to `depositERC20()`.

## Watched changes

```diff
    contract Bridger (0x0f1b7bd7762662B23486320AA91F30312184f70C) {
    +++ description: None
      upgradeability.implementation:
-        "0x3636617973f25a512676cb06876f0C885568664a"
+        "0x270f25127D7C48c956459e113aa81615CC30AeE2"
      implementations.0:
-        "0x3636617973f25a512676cb06876f0C885568664a"
+        "0x270f25127D7C48c956459e113aa81615CC30AeE2"
      values.exchangeProxy:
-        "0xDef1C0ded9bec7F1a1670819833240f027b25EfF"
      values.sDAI:
-        "0x83F20F44975D03b1b09e64809B757c47f942BEeA"
      values.swapsEnabled:
-        true
      values.weETH:
-        "0xCd5fE23C85820F7B72D0926FC9b05b43E359b7ee"
      values.swapRouter:
+        "0xDef1C0ded9bec7F1a1670819833240f027b25EfF"
    }
```

```diff
-   Status: DELETED
    contract ZeroEx (0xDef1C0ded9bec7F1a1670819833240f027b25EfF)
    +++ description: None
```

## Source code changes

```diff
.../{.flat@19919191 => .flat}/Bridger/Bridger.sol  | 1090 ++++++++++----------
 .../.flat@19919191/ZeroEx.sol => /dev/null         |  729 -------------
 2 files changed, 532 insertions(+), 1287 deletions(-)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19919191 (main branch discovery), not current.

```diff
+   Status: CREATED
    contract ZeroEx (0xDef1C0ded9bec7F1a1670819833240f027b25EfF)
    +++ description: None
```

Generated with discovered.json: 0x1db08e3c132170b88ae88bdd175985aafd322d25

# Diff at Tue, 21 May 2024 15:32:00 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@d10db8000986dcc20fb2efb94c0e0636ac38fa21 block: 19888796
- current block number: 19919191

## Description

The Bridger contract (pre-launch escrow for Kinto) is upgraded: The hardcoded orbitstack-native bridges are removed and the bridgeDeposits() function is modified to allow bridging via arbitrary bridges. Kinto will use socket as an external bridge for their L2 and the assets currently locked in the Bridger contract.

## Watched changes

```diff
    contract Bridger (0x0f1b7bd7762662B23486320AA91F30312184f70C) {
    +++ description: None
      upgradeability.implementation:
-        "0x989b9f407687DA3050C957CfeF5E6c18BeE7cb9F"
+        "0x3636617973f25a512676cb06876f0C885568664a"
      implementations.0:
-        "0x989b9f407687DA3050C957CfeF5E6c18BeE7cb9F"
+        "0x3636617973f25a512676cb06876f0C885568664a"
      values.L1GatewayRouter:
-        "0xD9041DeCaDcBA88844b373e7053B4AC7A3390D60"
      values.standardGateway:
-        "0x7870D5398DB488c669B406fBE57b8d05b6A35e42"
      derivedName:
-        "BridgerV4"
+        "Bridger"
    }
```

## Source code changes

```diff
.../BridgerV4.sol => .flat/Bridger/Bridger.sol}    | 5518 ++++++++++----------
 1 file changed, 2757 insertions(+), 2761 deletions(-)
```

Generated with discovered.json: 0x76f1e50a00a33e6f1eb3cc4ddf6d1768e457194b

# Diff at Fri, 17 May 2024 09:28:07 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@cf6498d339a075296e717008e17a69561c236726 block: 19883606
- current block number: 19888796

## Description

The wasmModuleRoot changes to a new value (which is not known in our ArbOS history). Looking at the Kinto Github repo, this is the [Hardfork #4 upgrade](https://github.com/ConstellationCrypto/kinto-go-ethereum/pull/4).
Changes are mainly related to the integration of the Socket bridge contracts in preparation for the May 22nd 'full mainnet launch'.

## Watched changes

```diff
    contract RollupProxy (0x5073dA9cA4810f3E0aA01c20c7d9d02C3f522e11) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
+++ description: Root hash of the WASM module used for execution, like a fingerprint of the L2 logic. Can be associated with ArbOS versions.
      values.wasmModuleRoot:
-        "0xf456393bd4b205d2f7b147d355c42ba852ff31527380884720bb4059ae731169"
+        "0x6948185c62070f9523a93664e8d064627f65830fd308af5e82f21292a2060fb8"
    }
```

Generated with discovered.json: 0xd5b099929f8b81f2ec7e02982922564807216015

# Diff at Thu, 16 May 2024 06:39:47 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@814c482c2be2428b2782bc85afecccac8c999b5e block: 19830808
- current block number: 19880804

## Description

New signer added to the ExecutorMultisig (Rollup owner): `0x08E674c4538caE03B6c05405881dDCd95DcaF5a8`

## Watched changes

```diff
    contract ExecutorMultisig (0x17Eb10e12a78f986C78F973Fc70eD88072B33B7d) {
    +++ description: None
      upgradeability.threshold:
-        "3 of 4 (75%)"
+        "3 of 5 (60%)"
      values.getOwners.4:
+        "0x94561e98DD5E55271f91A103e4979aa6C493745E"
      values.getOwners.3:
-        "0x94561e98DD5E55271f91A103e4979aa6C493745E"
+        "0x356000Cec4fC967f8FC372381D983426760A0391"
      values.getOwners.2:
-        "0x356000Cec4fC967f8FC372381D983426760A0391"
+        "0x12ee26aD74d50a1f6BDD90811387d1e0f3e7C76A"
      values.getOwners.1:
-        "0x12ee26aD74d50a1f6BDD90811387d1e0f3e7C76A"
+        "0xc1f4D15C16A1f3555E0a5F7AeFD1e17AD4aaf40B"
      values.getOwners.0:
-        "0xc1f4D15C16A1f3555E0a5F7AeFD1e17AD4aaf40B"
+        "0x08E674c4538caE03B6c05405881dDCd95DcaF5a8"
    }
```

Generated with discovered.json: 0x7b73332ba44977745e2bfdaabbe0a1aaf9f426ed

# Diff at Thu, 09 May 2024 06:51:41 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@d3bba0812727b9105a3f44fe55a68572c804b992 block: 19809397
- current block number: 19830808

## Description

The Inbox contract is upgraded with a minor change:

The l2AllowList that gets checked by the `whenRefundAddressAllowed` modifier is now settable by the owner or rollup contract whereas it was hardcoded before.

## Watched changes

```diff
    contract Inbox (0xBFfaA85c1756472fFC37e6D172A7eC0538C14474) {
    +++ description: None
      upgradeability.implementation:
-        "0x518465d9f81bDE1e573f9bD2a6761F8ADaAFe73e"
+        "0xc235c5194f2404234fc7C99b4dd15289BB735Cf5"
      implementations.0:
-        "0x518465d9f81bDE1e573f9bD2a6761F8ADaAFe73e"
+        "0xc235c5194f2404234fc7C99b4dd15289BB735Cf5"
    }
```

## Source code changes

```diff
.../Inbox/implementation/meta.txt                       |  2 +-
 .../src/nitro-contracts/bridge/AbsInbox.sol             | 17 +++++++++--------
 .../implementation/src/nitro-contracts/bridge/Inbox.sol |  1 -
 3 files changed, 10 insertions(+), 10 deletions(-)
```

Generated with discovered.json: 0x94bafe549ae45883fd41860a1577ce9a7ed8a42c

# Diff at Mon, 06 May 2024 06:56:42 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@91ddfe46c9a8cff7aff522924d50fd166a15932b block: 19776768
- current block number: 19809397

## Description

The Inbox implementation is upgraded with very minor changes:
- Modifier `whenRefundAddressAllowed` added (ensures that both `excessFeeRefundAddress` and `callValueRefundAddress` match the msg.sender unless they are whitelisted in `isAllowed`)
- `whenRefundAddressAllowed` is used by `createRetryableTicket()` and `createUnsafeRetryableTicket()`
- Formatting and import folder structure

## Watched changes

```diff
    contract Inbox (0xBFfaA85c1756472fFC37e6D172A7eC0538C14474) {
    +++ description: None
      upgradeability.implementation:
-        "0x1162084C3C6575121146582Db5BE43189e8CEe6b"
+        "0x518465d9f81bDE1e573f9bD2a6761F8ADaAFe73e"
      implementations.0:
-        "0x1162084C3C6575121146582Db5BE43189e8CEe6b"
+        "0x518465d9f81bDE1e573f9bD2a6761F8ADaAFe73e"
    }
```

## Source code changes

```diff
.../proxy/utils/Initializable.sol => /dev/null     |  80 ------
 .../lib/nitro-contracts}/src/bridge/IBridge.sol    |  22 ++
 .../src/bridge/IDelayedMessageProvider.sol         |   0
 .../lib/nitro-contracts}/src/bridge/IEthBridge.sol |   0
 .../lib/nitro-contracts}/src/bridge/IInbox.sol     |   0
 .../lib/nitro-contracts}/src/bridge/IInboxBase.sol |   0
 .../lib/nitro-contracts}/src/bridge/IOwnable.sol   |   0
 .../src/bridge/ISequencerInbox.sol                 |  91 +++++--
 .../src/libraries/AddressAliasHelper.sol           |   0
 .../src/libraries/DelegateCallAware.sol            |   0
 .../lib/nitro-contracts}/src/libraries/Error.sol   |  27 +-
 .../nitro-contracts/src/libraries/IGasRefunder.sol |  14 +
 .../src/libraries/MessageTypes.sol                 |   0
 .../nitro-contracts}/src/precompiles/ArbSys.sol    |   0
 .../contracts/proxy/utils/Initializable.sol        | 166 ++++++++++++
 .../contracts}/security/PausableUpgradeable.sol    |  34 ++-
 .../contracts}/utils/AddressUpgradeable.sol        |  74 ++++--
 .../contracts}/utils/ContextUpgradeable.sol        |   0
 .../contracts}/utils/StorageSlotUpgradeable.sol    |  60 ++++-
 .../Inbox/implementation/meta.txt                  |   2 +-
 .../src/libraries/IGasRefunder.sol => /dev/null    |  39 ---
 .../src/nitro-contracts}/bridge/AbsInbox.sol       | 199 +++++++--------
 .../src/nitro-contracts}/bridge/Inbox.sol          | 281 ++++++++++-----------
 23 files changed, 651 insertions(+), 438 deletions(-)
```

Generated with discovered.json: 0x4c11e99e03b2ae08fd367a9e6d1d673f2cfe3fff

# Diff at Wed, 01 May 2024 17:27:29 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@7dc564dd4cc2215657e1e7bd8648e6b99a23a992 block: 19624549
- current block number: 19776768

## Description

One signer of the BridgerOwnerMultisig is replaced.

## Watched changes

```diff
    contract BridgerOwnerMultisig (0xf152Abda9E4ce8b134eF22Dc3C6aCe19C4895D82) {
    +++ description: None
      values.getOwners.2:
-        "0xA20684BE1d0f5Ef96F8771A747fe5861D3F0FA07"
+        "0x08E674c4538caE03B6c05405881dDCd95DcaF5a8"
    }
```

Generated with discovered.json: 0x68af6aeb80b2dc820bf7190868730a2f8750fb79

# Diff at Wed, 03 Apr 2024 14:05:05 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@66b605e31075e304396e566f31130e883d656762 block: 19531637
- current block number: 19575719

## Description

Provide description of changes. This section will be preserved.

## Watched changes

```diff
    contract RollupProxy (0x5073dA9cA4810f3E0aA01c20c7d9d02C3f522e11) {
    +++ description: None
      values.wasmModuleRoot:
-        "0xd2d42f1e7b5ea262991c3fd1fc7ed3dde4b21c28d3a7edec49f7c4fb51c03f73"
+        "0xf456393bd4b205d2f7b147d355c42ba852ff31527380884720bb4059ae731169"
    }
```

```diff
    contract BridgerOwnerMultisig (0xf152Abda9E4ce8b134eF22Dc3C6aCe19C4895D82) {
    +++ description: None
      values.nonce:
-        70
+        71
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19531637 (main branch discovery), not current.

```diff
    contract GnosisSafe (0x17Eb10e12a78f986C78F973Fc70eD88072B33B7d) {
    +++ description: None
      name:
-        "GnosisSafe"
+        "ExecutorMultisig"
      values.nonce:
-        3
    }
```

```diff
+   Status: CREATED
    contract Bridger (0x0f1b7bd7762662B23486320AA91F30312184f70C)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1ERC20Gateway (0x7870D5398DB488c669B406fBE57b8d05b6A35e42)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1GatewayRouter (0xD9041DeCaDcBA88844b373e7053B4AC7A3390D60)
    +++ description: None
```

```diff
+   Status: CREATED
    contract BridgerOwnerMultisig (0xf152Abda9E4ce8b134eF22Dc3C6aCe19C4895D82)
    +++ description: None
```

Generated with discovered.json: 0x53029a74a02a35a658c77a12c8fb1aed6b7fee64

# Diff at Thu, 28 Mar 2024 09:12:29 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@867de6120241d47b66bf76f83c490408eb3595b0 block: 19432708
- current block number: 19531637

## Description

Update discovery to include the multisig threshold.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19432708 (main branch discovery), not current.

```diff
    contract GnosisSafe (0x17Eb10e12a78f986C78F973Fc70eD88072B33B7d) {
    +++ description: None
      upgradeability.threshold:
+        "3 of 4 (75%)"
    }
```

Generated with discovered.json: 0x2a8f9804aa4d0e1c2654291b4dc0c829b5c12d40

# Diff at Thu, 14 Mar 2024 10:39:07 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@24c5721630392f8b6f59093376472db03d18b2c2 block: 19339792
- current block number: 19432708

## Description

Upgrade: Changed WASM module root hash of the RollupProxy contract.
Context: Kinto is currently in review.

## Watched changes

```diff
    contract GnosisSafe (0x17Eb10e12a78f986C78F973Fc70eD88072B33B7d) {
    +++ description: None
      values.nonce:
-        2
+        3
    }
```

```diff
    contract RollupProxy (0x5073dA9cA4810f3E0aA01c20c7d9d02C3f522e11) {
    +++ description: None
      values.wasmModuleRoot:
-        "0x1024d5971f781dd930c46b5fb6fb571e6af9f31b5dc191b82e82036c207cc968"
+        "0xd2d42f1e7b5ea262991c3fd1fc7ed3dde4b21c28d3a7edec49f7c4fb51c03f73"
    }
```

Generated with discovered.json: 0x6bf630000a540615c26b6e131a88c1214fde842c

# Diff at Fri, 01 Mar 2024 10:41:16 GMT:

- author: Bartek Kiepuszewski (<bkiepuszewski@gmail.com>)
- current block number: 19339792

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
    contract GnosisSafe (0x17Eb10e12a78f986C78F973Fc70eD88072B33B7d) {
    }
```

```diff
+   Status: CREATED
    contract  (0x27C7Bfd2cC11429e9b80c443b42FDBe4754F6c91) {
    }
```

```diff
+   Status: CREATED
    contract ValidatorUtils (0x2b0E04Dc90e3fA58165CB41E2834B44A56E766aF) {
    }
```

```diff
+   Status: CREATED
    contract OneStepProverMemory (0x4811500e0d376Fa8d2EA3CCb7c61E0afB4F5A7f1) {
    }
```

```diff
+   Status: CREATED
    contract RollupProxy (0x5073dA9cA4810f3E0aA01c20c7d9d02C3f522e11) {
    }
```

```diff
+   Status: CREATED
    contract RollupEventInbox (0x52EcE832AF3DF3125BbfD6423E0425dB3fA99D3F) {
    }
```

```diff
+   Status: CREATED
    contract UpgradeExecutor (0x59B851c8b1643e0735Ec3F2f0e528f3d89c3408a) {
    }
```

```diff
+   Status: CREATED
    contract ChallengeManager (0x6228e2FB8C561f1a5A963039Bc38Eb6D539A1A7F) {
    }
```

```diff
+   Status: CREATED
    contract Outbox (0x655761AD5FC251F414D6993A73184B0669F278c8) {
    }
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x74C717C01425eb475A5fC55d2A4a9045fC9800df) {
    }
```

```diff
+   Status: CREATED
    contract Bridge (0x859a53Fe2C8DA961387030E7CB498D6D20d0B2DB) {
    }
```

```diff
+   Status: CREATED
    contract OneStepProverMath (0x89AF7C4C2198c426cFe6E86de0680A0850503e06) {
    }
```

```diff
+   Status: CREATED
    contract OneStepProverHostIo (0x99a2A31300816C1FA3f40818AC9280fe7271F878) {
    }
```

```diff
+   Status: CREATED
    contract ValidatorWalletCreator (0x9CAd81628aB7D8e239F1A5B497313341578c5F71) {
    }
```

```diff
+   Status: CREATED
    contract Inbox (0xBFfaA85c1756472fFC37e6D172A7eC0538C14474) {
    }
```

```diff
+   Status: CREATED
    contract OneStepProver0 (0xDf94F0474F205D086dbc2e66D69a856FCf520622) {
    }
```

```diff
+   Status: CREATED
    contract SequencerInbox (0xF4Ef823D57819AC7202a081A5B49376BD28E7b3a) {
    }
```
