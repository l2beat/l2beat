Generated with discovered.json: 0xf8fd33dc19f3d548ab5707d20cf8c15a9ec38370

# Diff at Wed, 11 Feb 2026 15:34:28 GMT:

- author: vincfurc (<vincfurc@users.noreply.github.com>)
- comparing to: main@2e859859d90363aa5bf619da50a94cddbc1e3894 block: 1769514148
- current timestamp: 1770823999

## Description

Upgrade to BoLD dispute protocol and ArbOS v51 "Dia" (nitro-contracts v3.1.0+).

RollupProxy replaced with a new BoLD-enabled contract (`isPostBoLD: true`). Assertion-based state management replaces the old node-based system. Validators stake 0.1 ETH (WETH), validator whitelist remains enabled.

ChallengeManager replaced with EdgeChallengeManager implementing the BoLD multi-level bisection protocol: block-level edges (height 67M), 1 big-step level (height 524K), small-step edges (height 8.4M), with 0.1 ETH stake for big-step and small-step edges.

All core contracts upgraded: Bridge, Inbox, Outbox, RollupEventInbox, SequencerInbox. SequencerInbox gains delay buffer support (`isDelayBufferable: true`, currently set to max/disabled) and `feeTokenPricer` field. `delayBlocks` increased from 5760 to 7200.

All four OneStepProvers and OneStepProofEntry replaced with new versions. ValidatorUtils removed (no longer needed in BoLD).

ArbOS updated to v51 "Dia" (wasmModuleRoot `0x8a7513bf...`), adding Ethereum Fusaka support (secp256r1, BLS12-381, CLZ opcode), improved gas pricing, and native token mint/burn support.

## Watched changes

```diff
-   Status: DELETED
    contract OneStepProverHostIo (arb1:0x0446E34D1cC4eBA5F336627BaAe82332c8607043)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
-   Status: DELETED
    contract ChallengeManager (arb1:0x04f8FF8aC0Bf00a70D5780F9Ee0c3bD01296ba0E)
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
```

```diff
-   Status: DELETED
    contract ValidatorUtils (arb1:0x08Ca9925b88c54100568c8d41eFAF8Fecc695d3a)
    +++ description: This contract implements view only utilities for validators.
```

```diff
    contract SequencerInbox (arb1:0x0E2480384E3703FDf84c7A0448658E8C7543b3a8) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      sourceHashes.1:
-        "0x6bb86ac4bd0d31e049f543fcf0a8f94c952252222f115246ef9d5b8104d803cc"
+        "0xb57f3e67e08492b235337cda4f3ea0117e3e043cceaf8e9a7a51b57611ba99de"
      values.$implementation:
-        "arb1:0x289b8F787Ab752b039C477B98016869f6b8AE772"
+        "arb1:0xC08A4543b011fd4f1EfC9e26521F4e157433b3b1"
      values.$pastUpgrades.1:
+        ["2026-02-09T10:03:26.000Z","0xdb6ad9c2efe65f5130149cc9cce9f3ab4cb89bcfbd7156028f5c8399babf62bf",["arb1:0xC08A4543b011fd4f1EfC9e26521F4e157433b3b1"]]
      values.$upgradeCount:
-        1
+        2
      values.maxTimeVariation.delayBlocks:
-        5760
+        7200
      values.rollup:
-        "arb1:0x63a751E0564eAb8B225F1922888b4F08d7d33561"
+        "arb1:0x75c070fe237817Bd027d402327069e9cd07De078"
      values.feeTokenPricer:
+        "arb1:0x0000000000000000000000000000000000000000"
      values.isDelayBufferable:
+        true
      implementationNames.arb1:0x289b8F787Ab752b039C477B98016869f6b8AE772:
-        "SequencerInbox"
      implementationNames.arb1:0xC08A4543b011fd4f1EfC9e26521F4e157433b3b1:
+        "SequencerInbox"
    }
```

```diff
-   Status: DELETED
    contract OneStepProofEntry (arb1:0x23264394923E4aEB990234180c37Bf757667C6f7)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
-   Status: DELETED
    contract OneStepProverMemory (arb1:0x4012CF2dce28079c8F7f92CecB2E494F4AcB9351)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
-   Status: DELETED
    contract OneStepProverMath (arb1:0x461bDAfaaba542C6eCcEa882BdF85542Ed7158C5)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
    contract Inbox (arb1:0x574b121c469583c3a46cd88bBCC9Ac5c8C907d06) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      sourceHashes.1:
-        "0x25984fdfffb8141859c99299fb29e7a7460732d77111e5fe23792baa99f336a3"
+        "0x82dad78abdf27e168de1ae177b8055db4167106d71273d9a3264e9898a6055e4"
      values.$implementation:
-        "arb1:0xb0de8855D29C00ad0710BC7a9975f0534deFc227"
+        "arb1:0x08b1395a2Ee51073d6B9ebF9E97FBeb09dcAcAf1"
      values.$pastUpgrades.1:
+        ["2026-02-09T10:03:26.000Z","0xdb6ad9c2efe65f5130149cc9cce9f3ab4cb89bcfbd7156028f5c8399babf62bf",["arb1:0x08b1395a2Ee51073d6B9ebF9E97FBeb09dcAcAf1"]]
      values.$upgradeCount:
-        1
+        2
      implementationNames.arb1:0xb0de8855D29C00ad0710BC7a9975f0534deFc227:
-        "ERC20Inbox"
      implementationNames.arb1:0x08b1395a2Ee51073d6B9ebF9E97FBeb09dcAcAf1:
+        "ERC20Inbox"
    }
```

```diff
    contract RollupEventInbox (arb1:0x5D6bec85F093Eb49bD6913aCe7e9A081c41aed8F) {
    +++ description: Helper contract sending configuration data over the bridge during the systems initialization.
      sourceHashes.1:
-        "0x35bd9f6436158f2147578ce95b85de68f435e81f1f3ed3858f7523a8c4825a1a"
+        "0x089ac3cec821c0f014f284ec4ec1039ef6bc50b6ad3ee47c82e20af65cc30c33"
      values.$implementation:
-        "arb1:0x4b4fdb082b44490c9AEEd91C932c3E33AAbfF653"
+        "arb1:0x9fD20D42Cf52B1A0dEf8e95AD8d2E92B58ECa51B"
      values.$pastUpgrades.1:
+        ["2026-02-09T10:03:26.000Z","0xdb6ad9c2efe65f5130149cc9cce9f3ab4cb89bcfbd7156028f5c8399babf62bf",["arb1:0x9fD20D42Cf52B1A0dEf8e95AD8d2E92B58ECa51B"]]
      values.$upgradeCount:
-        1
+        2
      values.rollup:
-        "arb1:0x63a751E0564eAb8B225F1922888b4F08d7d33561"
+        "arb1:0x75c070fe237817Bd027d402327069e9cd07De078"
      implementationNames.arb1:0x4b4fdb082b44490c9AEEd91C932c3E33AAbfF653:
-        "ERC20RollupEventInbox"
      implementationNames.arb1:0x9fD20D42Cf52B1A0dEf8e95AD8d2E92B58ECa51B:
+        "ERC20RollupEventInbox"
    }
```

```diff
-   Status: DELETED
    contract RollupProxy (arb1:0x63a751E0564eAb8B225F1922888b4F08d7d33561)
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
```

```diff
    contract Conduit Multisig 2 (arb1:0x79C2abE3eBA9dc119318FdAaA48118e1CDB53F56) {
    +++ description: None
      receivedPermissions.0:
-        {"permission":"interact","from":"arb1:0x63a751E0564eAb8B225F1922888b4F08d7d33561","description":"Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes.","role":".owner","via":[{"address":"arb1:0xDde7f92D0f2225f5951564D387e158b9b57f95F3"}]}
      receivedPermissions.1.description:
+        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
      receivedPermissions.1.via.0:
-        {"address":"arb1:0xc1136ea5F91f82cb468Fc7650579A95605D9f5C2"}
      receivedPermissions.1.role:
-        "admin"
+        ".owner"
      receivedPermissions.1.from:
-        "arb1:0x04f8FF8aC0Bf00a70D5780F9Ee0c3bD01296ba0E"
+        "arb1:0x75c070fe237817Bd027d402327069e9cd07De078"
      receivedPermissions.1.permission:
-        "upgrade"
+        "interact"
      receivedPermissions.5.from:
-        "arb1:0x63a751E0564eAb8B225F1922888b4F08d7d33561"
+        "arb1:0x75c070fe237817Bd027d402327069e9cd07De078"
      receivedPermissions.6:
+        {"permission":"upgrade","from":"arb1:0xA4444d9536595d35967206b86067a90aD053e1EF","role":"admin","via":[{"address":"arb1:0xc1136ea5F91f82cb468Fc7650579A95605D9f5C2"},{"address":"arb1:0xDde7f92D0f2225f5951564D387e158b9b57f95F3"}]}
    }
```

```diff
    EOA  (arb1:0x80e046764185e776100A4f59079C2B00327f279A) {
    +++ description: None
      receivedPermissions.0.role:
-        ".validators"
+        ".getValidators"
      receivedPermissions.0.from:
-        "arb1:0x63a751E0564eAb8B225F1922888b4F08d7d33561"
+        "arb1:0x75c070fe237817Bd027d402327069e9cd07De078"
    }
```

```diff
-   Status: DELETED
    contract OneStepProver0 (arb1:0x91F12800C6b5b4e7d88fE785558213F8EF3F4586)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
    contract Outbox (arb1:0xA2A5DCA414e3AaBD48B9CA97426f7e3Fba967492) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
      values.$implementation:
-        "arb1:0xd2e4Cc9Ec636eC9cFE840A2cF6ca32B690fD921A"
+        "arb1:0x99761fAc22FcE23498F8004ac4025F822fEdce95"
      values.$pastUpgrades.1:
+        ["2026-02-09T10:03:26.000Z","0xdb6ad9c2efe65f5130149cc9cce9f3ab4cb89bcfbd7156028f5c8399babf62bf",["arb1:0x99761fAc22FcE23498F8004ac4025F822fEdce95"]]
      values.$upgradeCount:
-        1
+        2
      values.rollup:
-        "arb1:0x63a751E0564eAb8B225F1922888b4F08d7d33561"
+        "arb1:0x75c070fe237817Bd027d402327069e9cd07De078"
      implementationNames.arb1:0xd2e4Cc9Ec636eC9cFE840A2cF6ca32B690fD921A:
-        "ERC20Outbox"
      implementationNames.arb1:0x99761fAc22FcE23498F8004ac4025F822fEdce95:
+        "ERC20Outbox"
    }
```

```diff
    contract ProxyAdmin (arb1:0xc1136ea5F91f82cb468Fc7650579A95605D9f5C2) {
    +++ description: None
      directlyReceivedPermissions.0:
-        {"permission":"upgrade","from":"arb1:0x04f8FF8aC0Bf00a70D5780F9Ee0c3bD01296ba0E","role":"admin"}
      directlyReceivedPermissions.4:
+        {"permission":"upgrade","from":"arb1:0xA4444d9536595d35967206b86067a90aD053e1EF","role":"admin"}
    }
```

```diff
    contract Bridge (arb1:0xd86f5ad3fa5becbB07e565DbD4b70DBd817A43A8) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      sourceHashes.1:
-        "0x73087d4667e81f676a10708feb2774bab3a9a558a1987b8ac4f112cc464bba96"
+        "0x7f62b9bd4a0aac711ca355a523b1d934ab93ae14c5fae5a860c0ded42ee5a3c3"
      values.$implementation:
-        "arb1:0x92329713Dc1a897D67a1C7f2a40eeeA83F5362CE"
+        "arb1:0x31127A9c0308d8E3F6db5158a14aD674f22946d7"
      values.$pastUpgrades.1:
+        ["2026-02-09T10:03:26.000Z","0xdb6ad9c2efe65f5130149cc9cce9f3ab4cb89bcfbd7156028f5c8399babf62bf",["arb1:0x31127A9c0308d8E3F6db5158a14aD674f22946d7"]]
      values.$upgradeCount:
-        1
+        2
      values.rollup:
-        "arb1:0x63a751E0564eAb8B225F1922888b4F08d7d33561"
+        "arb1:0x75c070fe237817Bd027d402327069e9cd07De078"
      implementationNames.arb1:0x92329713Dc1a897D67a1C7f2a40eeeA83F5362CE:
-        "ERC20Bridge"
      implementationNames.arb1:0x31127A9c0308d8E3F6db5158a14aD674f22946d7:
+        "ERC20Bridge"
    }
```

```diff
    contract UpgradeExecutor (arb1:0xDde7f92D0f2225f5951564D387e158b9b57f95F3) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      directlyReceivedPermissions.1.description:
-        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
+        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
      directlyReceivedPermissions.1.from:
-        "arb1:0x63a751E0564eAb8B225F1922888b4F08d7d33561"
+        "arb1:0x75c070fe237817Bd027d402327069e9cd07De078"
      directlyReceivedPermissions.2.from:
-        "arb1:0x63a751E0564eAb8B225F1922888b4F08d7d33561"
+        "arb1:0x75c070fe237817Bd027d402327069e9cd07De078"
    }
```

```diff
+   Status: CREATED
    contract OneStepProverHostIo (arb1:0x18Cc27B3a95a6FdEf9EAA391eff28F48F42fFe3F)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract OneStepProverMemory (arb1:0x583F8BA007580c83EFB4B02C66694096cD5c56d1)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract OneStepProofEntry (arb1:0x61006c8566fac9a3315F646dA4624C00BbCF15E4)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract RollupProxy (arb1:0x75c070fe237817Bd027d402327069e9cd07De078)
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new assertions (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both called Validators).
```

```diff
+   Status: CREATED
    contract OneStepProver0 (arb1:0x78B101eC9736c4Ab06b0833f01Fd4c011f7CA612)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract EdgeChallengeManager (arb1:0xA4444d9536595d35967206b86067a90aD053e1EF)
    +++ description: Contract that implements the main challenge protocol logic of the fraud proof system.
```

```diff
+   Status: CREATED
    contract OneStepProverMath (arb1:0xB08Ca18499389ABfDF7b14b09BD2Bd4d56D7fbbb)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

## Source code changes

```diff
.../Bridge/ERC20Bridge.sol                         |  306 +-
 .../ChallengeManager.sol => /dev/null              |  994 -----
 .../EdgeChallengeManager/EdgeChallengeManager.sol  | 3193 +++++++++++++
 .../TransparentUpgradeableProxy.p.sol              |   18 +-
 .../Inbox/ERC20Inbox.sol                           |  430 +-
 .../OneStepProofEntry.sol                          |  656 +--
 .../{.flat@1769514148 => .flat}/OneStepProver0.sol |  502 ++-
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

Generated with discovered.json: 0x357fb4a83f3ae605d5e5a123120cbb63e2e888f2

# Diff at Tue, 27 Jan 2026 11:43:38 GMT:

- author: vincfurc (<vincfurc@users.noreply.github.com>)
- comparing to: main@01c924f177b66fde012756076e94adb03520b757 block: 1768984621
- current timestamp: 1769514148

## Description

New member added to Conduit Multisig 2, increasing from 4 of 11 to 4 of 12 threshold.

## Watched changes

```diff
    contract Conduit Multisig 2 (arb1:0x79C2abE3eBA9dc119318FdAaA48118e1CDB53F56) {
    +++ description: None
      values.$members.0:
+        "arb1:0xA9FCCc53F1c9095DA867Bd648683F8bdCcc78d09"
      values.multisigThreshold:
-        "4 of 11 (36%)"
+        "4 of 12 (33%)"
    }
```

Generated with discovered.json: 0x71f52274ae7c5e3c30d9906be9b14e896993348d

# Diff at Wed, 21 Jan 2026 08:38:12 GMT:

- author: vincfurc (<vincfurc@users.noreply.github.com>)
- comparing to: main@a72aa7d50f1dddc0c7a6eae7f60679fc94e4eabf block: 1768566203
- current timestamp: 1768984621

## Description

New member conduit msig2.

## Watched changes

```diff
    contract Conduit Multisig 2 (arb1:0x79C2abE3eBA9dc119318FdAaA48118e1CDB53F56) {
    +++ description: None
      values.$members.0:
+        "arb1:0x381624F7912BddD83dc67c6C53Ef6FE61B87Cf07"
      values.multisigThreshold:
-        "4 of 10 (40%)"
+        "4 of 11 (36%)"
    }
```

Generated with discovered.json: 0x05610d011c42ab2f8f3eae2d0161f508fa3cc79f

# Diff at Fri, 16 Jan 2026 12:24:34 GMT:

- author: vincfurc (<vincfurc@users.noreply.github.com>)
- comparing to: main@5858fbf220b5dda1ab2a19f029fdd9eb700ca7fa block: 1768394405
- current timestamp: 1768566203

## Description

Conduit Multisig 2 added a new signer, increasing members from 9 to 10 (threshold remains 4).

## Watched changes

```diff
    contract Conduit Multisig 2 (arb1:0x79C2abE3eBA9dc119318FdAaA48118e1CDB53F56) {
    +++ description: None
      values.$members.0:
+        "arb1:0x6BB4249858Ee19b6ABC071AD26bEe690baa783A6"
      values.multisigThreshold:
-        "4 of 9 (44%)"
+        "4 of 10 (40%)"
    }
```

Generated with discovered.json: 0x9e9ce9688636b72ad7cd2830907df565194e83fd

# Diff at Wed, 14 Jan 2026 12:41:17 GMT:

- author: vincfurc (<vincfurc@users.noreply.github.com>)
- comparing to: main@e7f517859f6f313e4c82beba4300d1738b863a5d block: 1767629465
- current timestamp: 1768394405

## Description

Conduit Multisig 2 lost one member, reducing from 4 of 10 to 4 of 9 threshold.

## Watched changes

```diff
    contract Conduit Multisig 2 (arb1:0x79C2abE3eBA9dc119318FdAaA48118e1CDB53F56) {
    +++ description: None
      values.$members.5:
-        "arb1:0xa4000bDD2bB92ce6750b31F1eeda47Bd1cB8e6e4"
      values.multisigThreshold:
-        "4 of 10 (40%)"
+        "4 of 9 (44%)"
    }
```

Generated with discovered.json: 0x12387dfcfb9ad7ef2bc20eb6be57d936d1bc0e20

# Diff at Mon, 05 Jan 2026 17:44:16 GMT:

- author: vincfurc (<vincfurc@users.noreply.github.com>)
- comparing to: main@c679543996c33dd4145a38ea0d7fccd3b24d8951 block: 1766406768
- current timestamp: 1767629465

## Description

Refresh discovery.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1766406768 (main branch discovery), not current.

```diff
    contract RollupProxy (arb1:0x63a751E0564eAb8B225F1922888b4F08d7d33561) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      usedTypes.0.arg.0x8a7513bf7bb3e3db04b0d982d0e973bcf57bf8b88aef7c6d03dba3a81a56a499:
+        "ArbOS v51 wasmModuleRoot"
    }
```

Generated with discovered.json: 0xd5cb05378f867813bf7b6309a9765f00b7648fd0

# Diff at Wed, 10 Dec 2025 12:08:34 GMT:

- author: vincfurc (<vincfurc@users.noreply.github.com>)
- comparing to: main@87479478fee0d2fb1eb3c2a36f88a2ceeb4087df block: 1761222332
- current timestamp: 1765368374

## Description

Conduit multisig added member.

## Watched changes

```diff
    contract Conduit Multisig 2 (arb1:0x79C2abE3eBA9dc119318FdAaA48118e1CDB53F56) {
    +++ description: None
      values.$members.0:
+        "arb1:0x2103c69696CB2D3779f5445393808239034E911c"
      values.$members.0:
-        "arb1:0xFe0ab87ebE03DD0bF52DaF34Dfda6639c335e2d4"
+        "arb1:0x65D1d44B8B2fE15d45A03708E0835C7E98a56007"
      values.$members.3:
-        "arb1:0xF0B77EaE7F2dabCC2571c7418406A0dCA3afA4f0"
    }
```

Generated with discovered.json: 0xb64578924648dc2093bf307f6fc2ec1029124322

# Diff at Tue, 04 Nov 2025 11:32:38 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@9ff7b62a511791b99f61b604fb6b56e4ea223bb0 block: 1761222332
- current timestamp: 1761222332

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1761222332 (main branch discovery), not current.

```diff
    contract CollateralManager (ethereal:0x638D6DaC0550f30f37aC5784260309Ac89302faA) {
    +++ description: Auxiliary contract of the ExchangeGateway.
      sourceHashes.0:
-        "0x9258c947756b825974889f3070e5a8764e1f1338f91f0955facc2537640ddee0"
+        "0x09b192ba7fe0c948d056b981a202a7c6bf2f7535255539908256c1914b716764"
    }
```

```diff
    contract ActionHandler (ethereal:0xA2308112941f9bc2843C41a971F56B3Ac6E2167a) {
    +++ description: Auxiliary contract of the ExchangeGateway.
      sourceHashes.0:
-        "0xc614b9dee3c41cf413bf0676ec92b8506b7cde4ddf0fcaa64ba535cd4db50653"
+        "0x14594f4ec76a9468af01b5bd9b65a895ce8eeaec7e303d2c2953abbb6eb37fe2"
    }
```

```diff
    contract ExchangeGateway (ethereal:0xB3cDC82035C495c484C9fF11eD5f3Ff6d342e3cc) {
    +++ description: Main contract of the Ethereal DEX. Entrypoint for users to deposit and withdraw funds and for operators submit user actions.
      sourceHashes.1:
-        "0xb6c692aef340a10d30bcd0a9edff8392fe5adf829a55d81be3c755b10d84868c"
+        "0x4e74883670a055318a8d4bdb7d266c2d62a87f06d7ebac1e09659053810ddd70"
    }
```

```diff
    contract PerpEngine (ethereal:0xCc0385301a10191b7ac633A64742a34F2e4cFB37) {
    +++ description: Auxiliary contract of the ExchangeGateway.
      sourceHashes.0:
-        "0xe74cf338ff299bbb081c4e688e1667a8480c8255cbed038eaeedddb3c5eb19af"
+        "0x1f2d6ea306a2ce3c1e94fee76d9184cd06fa8a76178bc2a973d42d495f56d3cf"
    }
```

```diff
    contract Liquidation (ethereal:0xF925Bf7d50abe2Abb21E832c81a6454D791Ad5c0) {
    +++ description: Auxiliary contract of the ExchangeGateway.
      sourceHashes.0:
-        "0x76ac18478de588227556d0042ac2ded1e13a53717454987046bd11e5fd1dac79"
+        "0x9882e7baf79921bbc376de21ba5de774ccd2b47186ed8ba389a8ca85f3e94316"
    }
```

Generated with discovered.json: 0x2502db7e651b56a054870633e3dc8f71a8c1cf43

# Diff at Thu, 23 Oct 2025 15:11:46 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@59bab562d9522734bed50b73c362d354ad81ecd1 block: 1761144638
- current timestamp: 1761222332

## Description

add ethereal on ethereal disco incl the exchange contract. heavily EOA and layerzero-governed.

this is the first orbit stack that uses the native OFT integration (uses a precompile to allow gas token mints on the L2).

for TVS we are counting the wrapped USDe for now (covers >90% since the exchange only supports this token). in the future we will need a custom tvs adapter for such chains.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1761144638 (main branch discovery), not current.

```diff
+   Status: CREATED
    contract SafeL2 (ethereal:0x3F93bCc6201558aE2d7528a85575cF07679Bb50e)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SafeL2 (ethereal:0x58a16791037dF85CCbc3A65DE5a8401Fd04C8aC8)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CollateralManager (ethereal:0x638D6DaC0550f30f37aC5784260309Ac89302faA)
    +++ description: Auxiliary contract of the ExchangeGateway.
```

```diff
+   Status: CREATED
    contract OrbitNativeOFTAdapter (ethereal:0x80F981abC18A48CfdbDe5556F9B72e6a726F0FF3)
    +++ description: An OApp in the LayerZero protocol. It allows to mint the native token using the arbNativeTokenManager precompile on ArbOs. This means that the native token inherits all trust assumptions of the LayerZero security stack configured for this OApp and its crosschein peers, including minting and burning.
```

```diff
+   Status: CREATED
    contract ActionHandler (ethereal:0xA2308112941f9bc2843C41a971F56B3Ac6E2167a)
    +++ description: Auxiliary contract of the ExchangeGateway.
```

```diff
+   Status: CREATED
    contract PythLazer (ethereal:0xACeA761c27A909d4D3895128EBe6370FDE2dF481)
    +++ description: Used to verify offchain signed oracle data.
```

```diff
+   Status: CREATED
    contract ExchangeGateway (ethereal:0xB3cDC82035C495c484C9fF11eD5f3Ff6d342e3cc)
    +++ description: Main contract of the Ethereal DEX. Entrypoint for users to deposit and withdraw funds and for operators submit user actions.
```

```diff
+   Status: CREATED
    contract ExchangeConfig (ethereal:0xC199cC890F61B847bec9cec4212C35b759A9fD38)
    +++ description: Auxiliary contract of the ExchangeGateway.
```

```diff
+   Status: CREATED
    contract PerpEngine (ethereal:0xCc0385301a10191b7ac633A64742a34F2e4cFB37)
    +++ description: Auxiliary contract of the ExchangeGateway.
```

```diff
+   Status: CREATED
    contract Liquidation (ethereal:0xF925Bf7d50abe2Abb21E832c81a6454D791Ad5c0)
    +++ description: Auxiliary contract of the ExchangeGateway.
```

Generated with discovered.json: 0x38981589e68554c66993a2e5ae1eaf5d9cad124c

# Diff at Wed, 22 Oct 2025 16:02:26 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- current timestamp: 1761144638

## Description

standard v41 (wasmroot) orbit stack with custom outbox that can sweep native tokens from the escrow.

the wasmroot is not yet resolved because that would require global disco refresh.

## Initial discovery

```diff
+   Status: CREATED
    contract OneStepProverHostIo (arb1:0x0446E34D1cC4eBA5F336627BaAe82332c8607043)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract ChallengeManager (arb1:0x04f8FF8aC0Bf00a70D5780F9Ee0c3bD01296ba0E)
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
```

```diff
+   Status: CREATED
    contract ValidatorUtils (arb1:0x08Ca9925b88c54100568c8d41eFAF8Fecc695d3a)
    +++ description: This contract implements view only utilities for validators.
```

```diff
+   Status: CREATED
    contract SequencerInbox (arb1:0x0E2480384E3703FDf84c7A0448658E8C7543b3a8)
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
```

```diff
+   Status: CREATED
    contract OneStepProofEntry (arb1:0x23264394923E4aEB990234180c37Bf757667C6f7)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract Ethereal Multisig (arb1:0x33Fbf4E75d54bBec0e432B6dc27bDEa0ca5DEdf9)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ERC20MigrationOutbox (arb1:0x3515ad5D3D904Cb2731A7d6E5DB9f35D6CAFEB14)
    +++ description: Simple contract that, if set as allowedOutbox in the arb1:0xd86f5ad3fa5becbB07e565DbD4b70DBd817A43A8, allows to sweep all native tokens from the escrow to arb1:0x33Fbf4E75d54bBec0e432B6dc27bDEa0ca5DEdf9.
```

```diff
+   Status: CREATED
    contract OneStepProverMemory (arb1:0x4012CF2dce28079c8F7f92CecB2E494F4AcB9351)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract OneStepProverMath (arb1:0x461bDAfaaba542C6eCcEa882BdF85542Ed7158C5)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract Inbox (arb1:0x574b121c469583c3a46cd88bBCC9Ac5c8C907d06)
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
```

```diff
+   Status: CREATED
    contract RollupEventInbox (arb1:0x5D6bec85F093Eb49bD6913aCe7e9A081c41aed8F)
    +++ description: Helper contract sending configuration data over the bridge during the systems initialization.
```

```diff
+   Status: CREATED
    contract RollupProxy (arb1:0x63a751E0564eAb8B225F1922888b4F08d7d33561)
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
```

```diff
+   Status: CREATED
    contract Conduit Multisig 2 (arb1:0x79C2abE3eBA9dc119318FdAaA48118e1CDB53F56)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProver0 (arb1:0x91F12800C6b5b4e7d88fE785558213F8EF3F4586)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract Outbox (arb1:0xA2A5DCA414e3AaBD48B9CA97426f7e3Fba967492)
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
```

```diff
+   Status: CREATED
    contract ProxyAdmin (arb1:0xc1136ea5F91f82cb468Fc7650579A95605D9f5C2)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Bridge (arb1:0xd86f5ad3fa5becbB07e565DbD4b70DBd817A43A8)
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
```

```diff
+   Status: CREATED
    contract UpgradeExecutor (arb1:0xDde7f92D0f2225f5951564D387e158b9b57f95F3)
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
```
