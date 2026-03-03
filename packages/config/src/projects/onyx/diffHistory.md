Generated with discovered.json: 0x81760eaffac29e631ecb4aef13b4da336270aedd

# Diff at Wed, 11 Feb 2026 15:34:49 GMT:

- author: vincfurc (<vincfurc@users.noreply.github.com>)
- comparing to: main@2e859859d90363aa5bf619da50a94cddbc1e3894 block: 1769514392
- current timestamp: 1770824014

## Description

Upgrade to BoLD dispute protocol and ArbOS v51 "Dia" (nitro-contracts v3.1.0+). Deployed on Base (2-second blocks), so confirmation and challenge parameters are scaled 6x relative to Ethereum-hosted chains.

RollupProxy replaced with a new BoLD-enabled contract (`isPostBoLD: true`). Assertion-based state management replaces the old node-based system. `confirmPeriodBlocks` set to 241920 (~5.6 days at 2s blocks). Validators stake 0.1 ETH (WETH), validator whitelist remains enabled. `anyTrustFastConfirmer` is set.

ChallengeManager replaced with EdgeChallengeManager implementing the BoLD multi-level bisection protocol: block-level edges (height 67M), 1 big-step level (height 524K), small-step edges (height 8.4M), with 0.1 ETH stake for big-step and small-step edges.

All core contracts upgraded: Bridge, Inbox, Outbox, RollupEventInbox, SequencerInbox. SequencerInbox gains delay buffer support (`isDelayBufferable: true`, currently set to max/disabled) and `feeTokenPricer` field.

All four OneStepProvers and OneStepProofEntry replaced with new versions. ValidatorUtils removed (no longer needed in BoLD).

ArbOS updated to v51 "Dia" (wasmModuleRoot `0x8a7513bf...`), adding Ethereum Fusaka support (secp256r1, BLS12-381, CLZ opcode), improved gas pricing, and native token mint/burn support.

## Watched changes

```diff
    contract RollupEventInbox (base:0x0961428Ce999C15f5E2624d0bEbd9729387e8185) {
    +++ description: Helper contract sending configuration data over the bridge during the systems initialization.
      sourceHashes.1:
-        "0x35bd9f6436158f2147578ce95b85de68f435e81f1f3ed3858f7523a8c4825a1a"
+        "0x089ac3cec821c0f014f284ec4ec1039ef6bc50b6ad3ee47c82e20af65cc30c33"
      values.$implementation:
-        "base:0xD2ed924DC094abBE7ea47D872C2a8625A803c2c8"
+        "base:0x7ed9C3A779BE8b742AbFC17a2F15353ecBcE3e00"
      values.$pastUpgrades.1:
+        ["2026-02-09T10:00:31.000Z","0x7ef5d95a6f6a9a27265087a3a94275a7bcb2c84ed12018b7215e51276b1b9282",["base:0x7ed9C3A779BE8b742AbFC17a2F15353ecBcE3e00"]]
      values.$upgradeCount:
-        1
+        2
      values.rollup:
-        "base:0x50752f7988d0195d4d5fb09a1A22B8354b5A8c0b"
+        "base:0xCaE93d52fAd1Ed496b888eA5794b99Cd1999fFDC"
      implementationNames.base:0xD2ed924DC094abBE7ea47D872C2a8625A803c2c8:
-        "ERC20RollupEventInbox"
      implementationNames.base:0x7ed9C3A779BE8b742AbFC17a2F15353ecBcE3e00:
+        "ERC20RollupEventInbox"
    }
```

```diff
    contract Outbox (base:0x10e9F660ed21e662e7f3fB4a49B0Bd9B219bEf95) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
      values.$implementation:
-        "base:0x5596878012fD140Bc2Cdadb07E1543E51279C3E3"
+        "base:0x964177232be7C9e530054B3274b8B9D332b24Df5"
      values.$pastUpgrades.1:
+        ["2026-02-09T10:00:31.000Z","0x7ef5d95a6f6a9a27265087a3a94275a7bcb2c84ed12018b7215e51276b1b9282",["base:0x964177232be7C9e530054B3274b8B9D332b24Df5"]]
      values.$upgradeCount:
-        1
+        2
      values.rollup:
-        "base:0x50752f7988d0195d4d5fb09a1A22B8354b5A8c0b"
+        "base:0xCaE93d52fAd1Ed496b888eA5794b99Cd1999fFDC"
      implementationNames.base:0x5596878012fD140Bc2Cdadb07E1543E51279C3E3:
-        "ERC20Outbox"
      implementationNames.base:0x964177232be7C9e530054B3274b8B9D332b24Df5:
+        "ERC20Outbox"
    }
```

```diff
    contract GnosisSafeL2 (base:0x133f066C470d044dB3889359fC5B542d016B5B92) {
    +++ description: None
      directlyReceivedPermissions:
-        [{"permission":"fastconfirm","from":"base:0x50752f7988d0195d4d5fb09a1A22B8354b5A8c0b","description":"Can finalize a state root before the challenge period has passed. This allows withdrawing from the bridge based on the state root.","role":".anyTrustFastConfirmer"},{"permission":"validate","from":"base:0x50752f7988d0195d4d5fb09a1A22B8354b5A8c0b","description":"Can propose new state roots (called nodes) and challenge state roots on the host chain.","role":".validators"}]
    }
```

```diff
-   Status: DELETED
    contract ValidatorUtils (base:0x23264394923E4aEB990234180c37Bf757667C6f7)
    +++ description: This contract implements view only utilities for validators.
```

```diff
-   Status: DELETED
    contract OneStepProverHostIo (base:0x4b4fdb082b44490c9AEEd91C932c3E33AAbfF653)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
-   Status: DELETED
    contract RollupProxy (base:0x50752f7988d0195d4d5fb09a1A22B8354b5A8c0b)
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
```

```diff
    contract ProxyAdmin (base:0x615b81747e819e0dB25c13570D5DA45Ef9bc81B3) {
    +++ description: None
      directlyReceivedPermissions.6.from:
-        "base:0xD513422F3eE18A6BeC8087A55da59BAd9807A2ED"
+        "base:0xd935fb2fA935Ba3D60cc001D757B0E45f540C6f1"
    }
```

```diff
    contract Conduit Multisig 3 (base:0x7dCe2FEE5e30EFf298cD3d9B92649f00EBDfc104) {
    +++ description: None
      receivedPermissions.0.description:
-        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
+        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
      receivedPermissions.0.from:
-        "base:0x50752f7988d0195d4d5fb09a1A22B8354b5A8c0b"
+        "base:0xCaE93d52fAd1Ed496b888eA5794b99Cd1999fFDC"
      receivedPermissions.5:
-        {"permission":"upgrade","from":"base:0x50752f7988d0195d4d5fb09a1A22B8354b5A8c0b","role":"admin","via":[{"address":"base:0xfdFBECa29FFf84A5e1e31F8572509E2C36fF4B81"}]}
      receivedPermissions.6:
+        {"permission":"upgrade","from":"base:0xCaE93d52fAd1Ed496b888eA5794b99Cd1999fFDC","role":"admin","via":[{"address":"base:0xfdFBECa29FFf84A5e1e31F8572509E2C36fF4B81"}]}
      receivedPermissions.8.from:
-        "base:0xD513422F3eE18A6BeC8087A55da59BAd9807A2ED"
+        "base:0xd935fb2fA935Ba3D60cc001D757B0E45f540C6f1"
    }
```

```diff
    contract Inbox (base:0x8635f49481A90DeD18E8D0eB374028C4b39E700F) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      sourceHashes.1:
-        "0x25984fdfffb8141859c99299fb29e7a7460732d77111e5fe23792baa99f336a3"
+        "0x82dad78abdf27e168de1ae177b8055db4167106d71273d9a3264e9898a6055e4"
      values.$implementation:
-        "base:0xa9Fa7dFC5885E83af241c31c865d5f59eD4669d5"
+        "base:0xb040b105A4a0C7a9CC290164AcCBC32855368322"
      values.$pastUpgrades.2:
+        ["2026-02-09T10:00:31.000Z","0x7ef5d95a6f6a9a27265087a3a94275a7bcb2c84ed12018b7215e51276b1b9282",["base:0xb040b105A4a0C7a9CC290164AcCBC32855368322"]]
      values.$upgradeCount:
-        2
+        3
      implementationNames.base:0xa9Fa7dFC5885E83af241c31c865d5f59eD4669d5:
-        "ERC20Inbox"
      implementationNames.base:0xb040b105A4a0C7a9CC290164AcCBC32855368322:
+        "ERC20Inbox"
    }
```

```diff
-   Status: DELETED
    contract OneStepProver0 (base:0x92329713Dc1a897D67a1C7f2a40eeeA83F5362CE)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
-   Status: DELETED
    contract OneStepProverMemory (base:0xb7F0b49F09177cF8ab3aD8Cff68260DaFB079aCC)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
    contract Bridge (base:0xcdf10130c75D42a3880Ae521734EaA8631aC2905) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      sourceHashes.1:
-        "0x73087d4667e81f676a10708feb2774bab3a9a558a1987b8ac4f112cc464bba96"
+        "0x7f62b9bd4a0aac711ca355a523b1d934ab93ae14c5fae5a860c0ded42ee5a3c3"
      values.$implementation:
-        "base:0xb6298031A9536600EBB8B59f3DD24b0e33d86008"
+        "base:0xD2d9A5662B03518f32bFd0a7f4D958e3F33D2125"
      values.$pastUpgrades.1:
+        ["2026-02-09T10:00:31.000Z","0x7ef5d95a6f6a9a27265087a3a94275a7bcb2c84ed12018b7215e51276b1b9282",["base:0xD2d9A5662B03518f32bFd0a7f4D958e3F33D2125"]]
      values.$upgradeCount:
-        1
+        2
      values.rollup:
-        "base:0x50752f7988d0195d4d5fb09a1A22B8354b5A8c0b"
+        "base:0xCaE93d52fAd1Ed496b888eA5794b99Cd1999fFDC"
      implementationNames.base:0xb6298031A9536600EBB8B59f3DD24b0e33d86008:
-        "ERC20Bridge"
      implementationNames.base:0xD2d9A5662B03518f32bFd0a7f4D958e3F33D2125:
+        "ERC20Bridge"
    }
```

```diff
-   Status: DELETED
    contract OneStepProofEntry (base:0xd2e4Cc9Ec636eC9cFE840A2cF6ca32B690fD921A)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
-   Status: DELETED
    contract OneStepProverMath (base:0xD2f1C58Da62BCfaD4BeF7802B2F6363C2cbe7082)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
-   Status: DELETED
    contract ChallengeManager (base:0xD513422F3eE18A6BeC8087A55da59BAd9807A2ED)
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
```

```diff
    contract SequencerInbox (base:0xdA2445f1cA60bC2C739A96298746aDBB6706f011) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      sourceHashes.1:
-        "0x6bb86ac4bd0d31e049f543fcf0a8f94c952252222f115246ef9d5b8104d803cc"
+        "0xb57f3e67e08492b235337cda4f3ea0117e3e043cceaf8e9a7a51b57611ba99de"
      values.$implementation:
-        "base:0x40Cd7D713D7ae463f95cE5d342Ea6E7F5cF7C999"
+        "base:0x51dEDBD2f190E0696AFbEE5E60bFdE96d86464ec"
      values.$pastUpgrades.2:
+        ["2026-02-09T10:00:31.000Z","0x7ef5d95a6f6a9a27265087a3a94275a7bcb2c84ed12018b7215e51276b1b9282",["base:0x51dEDBD2f190E0696AFbEE5E60bFdE96d86464ec"]]
      values.$upgradeCount:
-        2
+        3
      values.reader4844:
-        "base:0x849E360a247132F961c9CBE95Ba39106c72e1268"
+        "base:0xe6F640e138C10C35306faF9D68efB4e003300232"
      values.rollup:
-        "base:0x50752f7988d0195d4d5fb09a1A22B8354b5A8c0b"
+        "base:0xCaE93d52fAd1Ed496b888eA5794b99Cd1999fFDC"
      values.feeTokenPricer:
+        "base:0x0000000000000000000000000000000000000000"
      values.isDelayBufferable:
+        true
      implementationNames.base:0x40Cd7D713D7ae463f95cE5d342Ea6E7F5cF7C999:
-        "SequencerInbox"
      implementationNames.base:0x51dEDBD2f190E0696AFbEE5E60bFdE96d86464ec:
+        "SequencerInbox"
    }
```

```diff
    EOA  (base:0xe2fbeb5dBc2E08Ce410C3164924E3643F620B325) {
    +++ description: None
      receivedPermissions.0:
-        {"permission":"fastconfirm","from":"base:0x50752f7988d0195d4d5fb09a1A22B8354b5A8c0b","description":"Can finalize a state root before the challenge period has passed. This allows withdrawing from the bridge based on the state root.","role":".anyTrustFastConfirmer","via":[{"address":"base:0x133f066C470d044dB3889359fC5B542d016B5B92"}]}
      receivedPermissions.1:
-        {"permission":"validate","from":"base:0x50752f7988d0195d4d5fb09a1A22B8354b5A8c0b","description":"Can propose new state roots (called nodes) and challenge state roots on the host chain.","role":".validators","via":[{"address":"base:0x133f066C470d044dB3889359fC5B542d016B5B92"}]}
      receivedPermissions.2.role:
-        ".validators"
+        ".getValidators"
      receivedPermissions.2.from:
-        "base:0x50752f7988d0195d4d5fb09a1A22B8354b5A8c0b"
+        "base:0xCaE93d52fAd1Ed496b888eA5794b99Cd1999fFDC"
    }
```

```diff
    contract UpgradeExecutor (base:0xfdFBECa29FFf84A5e1e31F8572509E2C36fF4B81) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      directlyReceivedPermissions.1.description:
-        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
+        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
      directlyReceivedPermissions.1.from:
-        "base:0x50752f7988d0195d4d5fb09a1A22B8354b5A8c0b"
+        "base:0xCaE93d52fAd1Ed496b888eA5794b99Cd1999fFDC"
      directlyReceivedPermissions.2.from:
-        "base:0x50752f7988d0195d4d5fb09a1A22B8354b5A8c0b"
+        "base:0xCaE93d52fAd1Ed496b888eA5794b99Cd1999fFDC"
    }
```

```diff
+   Status: CREATED
    contract OneStepProverMemory (base:0x760C1B5Fe95B2C66D67662Ec544975BDbb129645)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract OneStepProofEntry (base:0x76600101E42Dd9355D29741288407923268C06ed)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract OneStepProverHostIo (base:0x841A6E8230CA0f563a841Eb6BF8dfe129672Bdc5)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract OneStepProver0 (base:0x86c239F206A0878FB07243ABb4aFa932e6Ace911)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract OneStepProverMath (base:0x9F5F2dA42BE9833654C1D702e2E8cfFfC7a0A6A5)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract RollupProxy (base:0xCaE93d52fAd1Ed496b888eA5794b99Cd1999fFDC)
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new assertions (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both called Validators).
```

```diff
+   Status: CREATED
    contract EdgeChallengeManager (base:0xd935fb2fA935Ba3D60cc001D757B0E45f540C6f1)
    +++ description: Contract that implements the main challenge protocol logic of the fraud proof system.
```

## Source code changes

```diff
.../Bridge/ERC20Bridge.sol                         |  306 +-
 .../ChallengeManager.sol => /dev/null              |  994 -----
 .../EdgeChallengeManager/EdgeChallengeManager.sol  | 3193 +++++++++++++
 .../TransparentUpgradeableProxy.p.sol              |   18 +-
 .../Inbox/ERC20Inbox.sol                           |  430 +-
 .../OneStepProofEntry.sol                          |  656 +--
 .../{.flat@1769514392 => .flat}/OneStepProver0.sol |  502 ++-
 .../OneStepProverHostIo.sol                        |  643 +--
 .../OneStepProverMath.sol                          |  101 +-
 .../OneStepProverMemory.sol                        |  421 +-
 .../Outbox/ERC20Outbox.sol                         |  104 +-
 .../RollupEventInbox/ERC20RollupEventInbox.sol     |   73 +-
 .../RollupProxy/RollupAdminLogic.1.sol             | 2809 ++++++------
 .../RollupProxy/RollupProxy.p.sol                  |   91 +-
 .../RollupProxy/RollupUserLogic.2.sol              | 4700 ++++++++++----------
 .../SequencerInbox/SequencerInbox.sol              | 1030 +++--
 .../ValidatorUtils.sol => /dev/null                |  323 --
 17 files changed, 9455 insertions(+), 6939 deletions(-)
```

Generated with discovered.json: 0x3704f8939bfbd9c19592cc0023c29c7ddcc6b625

# Diff at Tue, 27 Jan 2026 11:48:14 GMT:

- author: vincfurc (<vincfurc@users.noreply.github.com>)
- comparing to: main@01c924f177b66fde012756076e94adb03520b757 block: 1769272461
- current timestamp: 1769514392

## Description

New member added to Conduit Multisig 3, increasing from 4 of 12 to 4 of 13 threshold.

## Watched changes

```diff
    contract Conduit Multisig 3 (base:0x7dCe2FEE5e30EFf298cD3d9B92649f00EBDfc104) {
    +++ description: None
      values.$members.0:
+        "base:0xA9FCCc53F1c9095DA867Bd648683F8bdCcc78d09"
      values.multisigThreshold:
-        "4 of 12 (33%)"
+        "4 of 13 (31%)"
    }
```

Generated with discovered.json: 0x039e4032870f6dabb50c5eb95157e51e60db50aa

# Diff at Sat, 24 Jan 2026 16:35:46 GMT:

- author: vincfurc (<vincfurc@users.noreply.github.com>)
- comparing to: main@ac37c78dd7a10d019f852f76f0bb7435768a0edc block: 1768566203
- current timestamp: 1769272461

## Description

Conduit Multisig 3 added a new signer, increasing members from 11 to 12 (threshold remains 4).

## Watched changes

```diff
    contract Conduit Multisig 3 (base:0x7dCe2FEE5e30EFf298cD3d9B92649f00EBDfc104) {
    +++ description: None
      values.$members.0:
+        "base:0x381624F7912BddD83dc67c6C53Ef6FE61B87Cf07"
      values.multisigThreshold:
-        "4 of 11 (36%)"
+        "4 of 12 (33%)"
    }
```

Generated with discovered.json: 0x6c0a66994027ff828c25f379f69c9839888104a4

# Diff at Fri, 16 Jan 2026 12:24:47 GMT:

- author: vincfurc (<vincfurc@users.noreply.github.com>)
- comparing to: main@5858fbf220b5dda1ab2a19f029fdd9eb700ca7fa block: 1765381186
- current timestamp: 1768566203

## Description

Conduit Multisig 3 added a new signer, increasing members from 10 to 11 (threshold remains 4).

## Watched changes

```diff
    contract Conduit Multisig 3 (base:0x7dCe2FEE5e30EFf298cD3d9B92649f00EBDfc104) {
    +++ description: None
      values.$members.0:
+        "base:0x6BB4249858Ee19b6ABC071AD26bEe690baa783A6"
      values.multisigThreshold:
-        "4 of 10 (40%)"
+        "4 of 11 (36%)"
    }
```

Generated with discovered.json: 0x690637adf6f01686648f1f71fce254dfd54d85a9

# Diff at Mon, 05 Jan 2026 17:44:47 GMT:

- author: vincfurc (<vincfurc@users.noreply.github.com>)
- comparing to: main@c679543996c33dd4145a38ea0d7fccd3b24d8951 block: 1765381186
- current timestamp: 1765381186

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1765381186 (main branch discovery), not current.

```diff
    contract RollupProxy (base:0x50752f7988d0195d4d5fb09a1A22B8354b5A8c0b) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      usedTypes.0.arg.0x8a7513bf7bb3e3db04b0d982d0e973bcf57bf8b88aef7c6d03dba3a81a56a499:
+        "ArbOS v51 wasmModuleRoot"
    }
```

Generated with discovered.json: 0x0b7faca198f0416d098df651a12f4a17573bf45f

# Diff at Wed, 10 Dec 2025 15:41:25 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@87479478fee0d2fb1eb3c2a36f88a2ceeb4087df block: 1759481388
- current timestamp: 1765381186

## Description

Conduit msig change.

## Watched changes

```diff
    contract Conduit Multisig 3 (base:0x7dCe2FEE5e30EFf298cD3d9B92649f00EBDfc104) {
    +++ description: None
      values.$members.0:
+        "base:0x2103c69696CB2D3779f5445393808239034E911c"
      values.$members.0:
-        "base:0xFe0ab87ebE03DD0bF52DaF34Dfda6639c335e2d4"
+        "base:0x65D1d44B8B2fE15d45A03708E0835C7E98a56007"
      values.multisigThreshold:
-        "4 of 9 (44%)"
+        "4 of 10 (40%)"
    }
```

Generated with discovered.json: 0x45dbdbd2abd20214fad85ab92448f0a54a4027de

# Diff at Fri, 03 Oct 2025 08:51:03 GMT:

- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@e647409961cd173771dcfcaeb808991c99e73911 block: 1758210238
- current timestamp: 1759481388

## Description

Member removed from multisig.

## Watched changes

```diff
    contract Conduit Multisig 3 (base:0x7dCe2FEE5e30EFf298cD3d9B92649f00EBDfc104) {
    +++ description: None
      values.$members.2:
-        "base:0x50930d652266EF4127FA3A1906B7Cb9951076628"
      values.multisigThreshold:
-        "4 of 10 (40%)"
+        "4 of 9 (44%)"
    }
```

Generated with discovered.json: 0xf59a3215532dd2b3afec7a5f6c88b0dc8c4bb6e0

# Diff at Fri, 26 Sep 2025 13:02:09 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@ec4b16fd723bf2a8625a616c4b3a1119ce79fb29 block: 1758210238
- current timestamp: 1758210238

## Description

add new celestia nitro wasmmoduleroot

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1758210238 (main branch discovery), not current.

```diff
    contract RollupProxy (base:0x50752f7988d0195d4d5fb09a1A22B8354b5A8c0b) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      usedTypes.0.arg.0x597de35fc2ee60e5b2840157370d037542d6a4bc587af7f88202636c54e6bd8d:
+        "Celestia Nitro ArbOS v40 wasmModuleRoot"
    }
```

Generated with discovered.json: 0x415ca86bca5e5953b2d03c7d833ad7afdee3b960

# Diff at Thu, 18 Sep 2025 15:45:09 GMT:

- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@0bdfa87489b47d7662c688d0c187b81dffc81e27 block: 1757512909
- current timestamp: 1758210238

## Description

Update to ArbOS v40.

## Watched changes

```diff
    contract RollupProxy (base:0x50752f7988d0195d4d5fb09a1A22B8354b5A8c0b) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
+++ description: ArbOS version derived from known wasmModuleRoots.
      values.arbOsFromWmRoot:
-        "ArbOS v32 wasmModuleRoot"
+        "ArbOS v40 wasmModuleRoot"
+++ description: Root hash of the WASM module used for execution, like a fingerprint of the L2 logic. Can be associated with ArbOS versions.
      values.wasmModuleRoot:
-        "0x184884e1eb9fefdc158f6c8ac912bb183bf3cf83f0090317e0bc4ac5860baa39"
+        "0xdb698a2576298f25448bc092e52cf13b1e24141c997135d70f217d674bbeb69a"
    }
```

Generated with discovered.json: 0x7c70acdb9756ee29c80a77b1a9a142c6e7b38bcc

# Diff at Wed, 10 Sep 2025 14:02:57 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- current timestamp: 1757512909

## Description

Initial discovery.

## Initial discovery

```diff
+   Status: CREATED
    contract RollupEventInbox (base:0x0961428Ce999C15f5E2624d0bEbd9729387e8185)
    +++ description: Helper contract sending configuration data over the bridge during the systems initialization.
```

```diff
+   Status: CREATED
    contract Outbox (base:0x10e9F660ed21e662e7f3fB4a49B0Bd9B219bEf95)
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
```

```diff
+   Status: CREATED
    contract GnosisSafeL2 (base:0x133f066C470d044dB3889359fC5B542d016B5B92)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ERC20Gateway (base:0x167D43d1D60DE2320B5E143F9c6a058092A913C2)
    +++ description: Escrows deposited ERC-20 assets for the canonical Bridge. Upon depositing, a generic token representation will be minted at the destination. Withdrawals are initiated by the Outbox contract.
```

```diff
+   Status: CREATED
    contract ValidatorUtils (base:0x23264394923E4aEB990234180c37Bf757667C6f7)
    +++ description: This contract implements view only utilities for validators.
```

```diff
+   Status: CREATED
    contract GatewayRouter (base:0x3CaA4581e7bA1aF2607e0198aF4E4C208f09c98b)
    +++ description: This routing contract maps tokens to the correct escrow (gateway) to be then bridged with canonical messaging.
```

```diff
+   Status: CREATED
    contract OneStepProverHostIo (base:0x4b4fdb082b44490c9AEEd91C932c3E33AAbfF653)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract RollupProxy (base:0x50752f7988d0195d4d5fb09a1A22B8354b5A8c0b)
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
```

```diff
+   Status: CREATED
    contract ProxyAdmin (base:0x615b81747e819e0dB25c13570D5DA45Ef9bc81B3)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Conduit Multisig 3 (base:0x7dCe2FEE5e30EFf298cD3d9B92649f00EBDfc104)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Inbox (base:0x8635f49481A90DeD18E8D0eB374028C4b39E700F)
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
```

```diff
+   Status: CREATED
    contract OneStepProver0 (base:0x92329713Dc1a897D67a1C7f2a40eeeA83F5362CE)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract OneStepProverMemory (base:0xb7F0b49F09177cF8ab3aD8Cff68260DaFB079aCC)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract Bridge (base:0xcdf10130c75D42a3880Ae521734EaA8631aC2905)
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
```

```diff
+   Status: CREATED
    contract OneStepProofEntry (base:0xd2e4Cc9Ec636eC9cFE840A2cF6ca32B690fD921A)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract OneStepProverMath (base:0xD2f1C58Da62BCfaD4BeF7802B2F6363C2cbe7082)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract ChallengeManager (base:0xD513422F3eE18A6BeC8087A55da59BAd9807A2ED)
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
```

```diff
+   Status: CREATED
    contract SequencerInbox (base:0xdA2445f1cA60bC2C739A96298746aDBB6706f011)
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
```

```diff
+   Status: CREATED
    contract UpgradeExecutor (base:0xfdFBECa29FFf84A5e1e31F8572509E2C36fF4B81)
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
```
