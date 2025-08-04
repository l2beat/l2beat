Generated with discovered.json: 0xb1d59129408c450c93e3ace3a3c797537cb84e32

# Diff at Thu, 24 Jul 2025 07:59:53 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@e68e856ed444c9f5c0e702b0c18473a575f2e74a block: 342007871
- current block number: 360996679

## Description

Upgrade to permissioned BoLD with a single validator on standard contracts (except SequencerInbox, see below).

SequencerInbox: add feeTokenPricer role who can set the conversion rate from arb gas to L3 gas token, which is irrelevant for muster as it uses ETH ([diff to arbitrum one]](https://disco.l2beat.com/diff/eth:0x98a58ADAb0f8A66A1BF4544d804bc0475dff32c7/arb1:0xfEB2537afD8519d16d0CcEa741A70f97f3D4288B))

## Watched changes

```diff
    contract UpgradeExecutor (0x10083F68A4aEC72c567661616bd6036D3a6d1B36) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      directlyReceivedPermissions.1.description:
-        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
+        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
      directlyReceivedPermissions.1.from:
-        "arb1:0x73CA76d9B04661604fF950fB8DBc9f18F1B853f1"
+        "arb1:0xE383D432F039f4377CC9AA003FfaE4c814936864"
      directlyReceivedPermissions.2.from:
-        "arb1:0x73CA76d9B04661604fF950fB8DBc9f18F1B853f1"
+        "arb1:0xE383D432F039f4377CC9AA003FfaE4c814936864"
    }
```

```diff
    contract Inbox (0x18BB8310E3a3DF4EFcCb6B3E9AeCB8bE6d4af07f) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      sourceHashes.1:
-        "0x84cd273689e720a0b7c657b57d9fb127684f3abb87fc4b337a2f0decd9464120"
+        "0x421aa98d340c2ad3e475ce29bb1e72660c213f0997591e567c0fd3d3ae2365a8"
      values.$implementation:
-        "arb1:0x6C6cf18f13C3e9b969e3acE6b8F21DfF95d4D447"
+        "arb1:0xDD262dfDf2FCe29696f54eC5bB82C6994Ec2F639"
      values.$pastUpgrades.2:
+        ["2025-07-17T02:43:49.000Z","0x3f73498578e6ec5c6869f292790ee4500dabf3b6ae1f6a60dd84f297dc7a5886",["arb1:0xDD262dfDf2FCe29696f54eC5bB82C6994Ec2F639"]]
      values.$upgradeCount:
-        2
+        3
      implementationNames.arb1:0x6C6cf18f13C3e9b969e3acE6b8F21DfF95d4D447:
-        "Inbox"
      implementationNames.arb1:0xDD262dfDf2FCe29696f54eC5bB82C6994Ec2F639:
+        "Inbox"
    }
```

```diff
    EOA  (0x26C9cC5681Dc8CfA7d0CD2F52769479b54612298) {
    +++ description: None
      receivedPermissions.0.role:
-        ".validators"
+        ".getValidators"
      receivedPermissions.0.from:
-        "arb1:0x73CA76d9B04661604fF950fB8DBc9f18F1B853f1"
+        "arb1:0xE383D432F039f4377CC9AA003FfaE4c814936864"
    }
```

```diff
-   Status: DELETED
    contract OneStepProverHostIo (0x33c1514Bf90e202d242C299b37C60f908aa206D4)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
    contract ProxyAdmin (0x37119EAcFBc1c83DDAf80F6705b6B19630C101C4) {
    +++ description: None
      directlyReceivedPermissions.2:
+        {"permission":"upgrade","from":"arb1:0x37D07D97673c79afe3b92548175Af47488E28694","role":"admin"}
      directlyReceivedPermissions.5:
-        {"permission":"upgrade","from":"arb1:0xE8c7770db364e57b2A4f5344d51b7f490aE9163A","role":"admin"}
    }
```

```diff
-   Status: DELETED
    contract OneStepProver0 (0x54E0923782b701044444De5d8c3A45aC890b0881)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
-   Status: DELETED
    contract ValidatorUtils (0x6c21303F5986180B1394d2C89f3e883890E2867b)
    +++ description: This contract implements view only utilities for validators.
```

```diff
-   Status: DELETED
    contract RollupProxy (0x73CA76d9B04661604fF950fB8DBc9f18F1B853f1)
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
```

```diff
    contract RollupEventInbox (0x8987777757a91Ed09912D7A5B8430bbAC2cf153C) {
    +++ description: Helper contract sending configuration data over the bridge during the systems initialization.
      sourceHashes.1:
-        "0xcd37abd5bdcc8c37cbf37dcfa4889d5b238388344d913b3a48914f659e0d627b"
+        "0x6ce471861570d55dc6e9a09337d990c13efb0c7abb47f36a5de48a9a7086f6e8"
      values.$implementation:
-        "arb1:0xF40C24bA346aA459ED28e196D4A46Cf17174bD6C"
+        "arb1:0xf4d69939895E5f1d1ddCa96E5f93A878c80368c3"
      values.$pastUpgrades.1:
+        ["2025-07-17T02:43:49.000Z","0x3f73498578e6ec5c6869f292790ee4500dabf3b6ae1f6a60dd84f297dc7a5886",["arb1:0xf4d69939895E5f1d1ddCa96E5f93A878c80368c3"]]
      values.$upgradeCount:
-        1
+        2
      values.rollup:
-        "arb1:0x73CA76d9B04661604fF950fB8DBc9f18F1B853f1"
+        "arb1:0xE383D432F039f4377CC9AA003FfaE4c814936864"
      implementationNames.arb1:0xF40C24bA346aA459ED28e196D4A46Cf17174bD6C:
-        "RollupEventInbox"
      implementationNames.arb1:0xf4d69939895E5f1d1ddCa96E5f93A878c80368c3:
+        "RollupEventInbox"
    }
```

```diff
    contract Bridge (0xB0EC3C1368AF7d9C2CAE6B7f8E022Cc14d59D2b1) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      sourceHashes.1:
-        "0xb920455f1e366c7a89719abdd8d8174e4e7d353f2d4b7dea11b0571bf9526eae"
+        "0xbce819ea96dfba398ca731b4457e9b9a01621df028c459eb74b15b6a687130b1"
      values.$implementation:
-        "arb1:0xB23214f241bdEb275f7dCBfbb1EA79349101d4B0"
+        "arb1:0x81F6f682cA9bB29D759ce12d7067E1c6EF533096"
      values.$pastUpgrades.1:
+        ["2025-07-17T02:43:49.000Z","0x3f73498578e6ec5c6869f292790ee4500dabf3b6ae1f6a60dd84f297dc7a5886",["arb1:0x81F6f682cA9bB29D759ce12d7067E1c6EF533096"]]
      values.$upgradeCount:
-        1
+        2
      values.rollup:
-        "arb1:0x73CA76d9B04661604fF950fB8DBc9f18F1B853f1"
+        "arb1:0xE383D432F039f4377CC9AA003FfaE4c814936864"
      implementationNames.arb1:0xB23214f241bdEb275f7dCBfbb1EA79349101d4B0:
-        "Bridge"
      implementationNames.arb1:0x81F6f682cA9bB29D759ce12d7067E1c6EF533096:
+        "Bridge"
    }
```

```diff
    EOA  (0xCa9c24bf165D375A62E62b9fb8F138E19A957Aa9) {
    +++ description: None
      receivedPermissions.0.description:
-        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
+        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
      receivedPermissions.0.from:
-        "arb1:0x73CA76d9B04661604fF950fB8DBc9f18F1B853f1"
+        "arb1:0xE383D432F039f4377CC9AA003FfaE4c814936864"
      receivedPermissions.3.via.0:
+        {"address":"arb1:0x37119EAcFBc1c83DDAf80F6705b6B19630C101C4"}
      receivedPermissions.3.from:
-        "arb1:0x73CA76d9B04661604fF950fB8DBc9f18F1B853f1"
+        "arb1:0x37D07D97673c79afe3b92548175Af47488E28694"
      receivedPermissions.7.via.0:
-        {"address":"arb1:0x37119EAcFBc1c83DDAf80F6705b6B19630C101C4"}
      receivedPermissions.7.from:
-        "arb1:0xE8c7770db364e57b2A4f5344d51b7f490aE9163A"
+        "arb1:0xE383D432F039f4377CC9AA003FfaE4c814936864"
    }
```

```diff
    contract Outbox (0xD17550876106645988051ffDd31dFc3cDaA29F9c) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
      sourceHashes.1:
-        "0x28eec040eca7563195b19e22e11429d0f977820bfb60ac52e567ffde3c92cf77"
+        "0x9e054d18af00f58f7fa36e7a0fd5b04b9dacfb8c411d84c3591e57aa72faff9d"
      values.$implementation:
-        "arb1:0x13BE515E44Eefaf3eBEFAD684F1FBB574Ac0A494"
+        "arb1:0x4ca08847418DE7860a6da0De2e5536F1Cd78458A"
      values.$pastUpgrades.1:
+        ["2025-07-17T02:43:49.000Z","0x3f73498578e6ec5c6869f292790ee4500dabf3b6ae1f6a60dd84f297dc7a5886",["arb1:0x4ca08847418DE7860a6da0De2e5536F1Cd78458A"]]
      values.$upgradeCount:
-        1
+        2
      values.rollup:
-        "arb1:0x73CA76d9B04661604fF950fB8DBc9f18F1B853f1"
+        "arb1:0xE383D432F039f4377CC9AA003FfaE4c814936864"
      implementationNames.arb1:0x13BE515E44Eefaf3eBEFAD684F1FBB574Ac0A494:
-        "Outbox"
      implementationNames.arb1:0x4ca08847418DE7860a6da0De2e5536F1Cd78458A:
+        "Outbox"
    }
```

```diff
-   Status: DELETED
    contract OneStepProofEntry (0xD89d54007079071cBA859127318b9F34eeB78049)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
-   Status: DELETED
    contract OneStepProverMath (0xE58a2dEb5718F9aAF2C1DdD0E366ED076D204cc4)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
-   Status: DELETED
    contract ChallengeManager (0xE8c7770db364e57b2A4f5344d51b7f490aE9163A)
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
```

```diff
-   Status: DELETED
    contract OneStepProverMemory (0xf8E5e5562c2c12d8690786f5C9FA65F20F6bD881)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
    contract SequencerInbox (0xfb27e42E964F3364630F76D62EB295ae792BD4FA) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      sourceHashes.1:
-        "0x6bb86ac4bd0d31e049f543fcf0a8f94c952252222f115246ef9d5b8104d803cc"
+        "0xb57f3e67e08492b235337cda4f3ea0117e3e043cceaf8e9a7a51b57611ba99de"
      values.$implementation:
-        "arb1:0x066a4D939302470Bd83F1868A1Ae2485Fe75ccF2"
+        "arb1:0xfEB2537afD8519d16d0CcEa741A70f97f3D4288B"
      values.$pastUpgrades.3:
+        ["2025-07-17T02:43:49.000Z","0x3f73498578e6ec5c6869f292790ee4500dabf3b6ae1f6a60dd84f297dc7a5886",["arb1:0xfEB2537afD8519d16d0CcEa741A70f97f3D4288B"]]
      values.$upgradeCount:
-        3
+        4
      values.maxTimeVariation.delayBlocks:
-        5760
+        7200
      values.rollup:
-        "arb1:0x73CA76d9B04661604fF950fB8DBc9f18F1B853f1"
+        "arb1:0xE383D432F039f4377CC9AA003FfaE4c814936864"
      values.feeTokenPricer:
+        "arb1:0x0000000000000000000000000000000000000000"
      values.isDelayBufferable:
+        true
      implementationNames.arb1:0x066a4D939302470Bd83F1868A1Ae2485Fe75ccF2:
-        "SequencerInbox"
      implementationNames.arb1:0xfEB2537afD8519d16d0CcEa741A70f97f3D4288B:
+        "SequencerInbox"
    }
```

```diff
+   Status: CREATED
    contract OneStepProverHostIo (0x18Cc27B3a95a6FdEf9EAA391eff28F48F42fFe3F)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract EdgeChallengeManager (0x37D07D97673c79afe3b92548175Af47488E28694)
    +++ description: Contract that implements the main challenge protocol logic of the fraud proof system.
```

```diff
+   Status: CREATED
    contract OneStepProverMemory (0x583F8BA007580c83EFB4B02C66694096cD5c56d1)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract OneStepProofEntry (0x61006c8566fac9a3315F646dA4624C00BbCF15E4)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract OneStepProver0 (0x78B101eC9736c4Ab06b0833f01Fd4c011f7CA612)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract OneStepProverMath (0xB08Ca18499389ABfDF7b14b09BD2Bd4d56D7fbbb)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract RollupProxy (0xE383D432F039f4377CC9AA003FfaE4c814936864)
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new assertions (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both called Validators).
```

## Source code changes

```diff
.../{.flat@342007871 => .flat}/Bridge/Bridge.sol   |  305 +-
 .../ChallengeManager.sol => /dev/null              |  994 -----
 .../EdgeChallengeManager/EdgeChallengeManager.sol  | 3193 +++++++++++++
 .../TransparentUpgradeableProxy.p.sol              |   18 +-
 .../{.flat@342007871 => .flat}/Inbox/Inbox.sol     |  581 +--
 .../OneStepProofEntry.sol                          |  656 +--
 .../{.flat@342007871 => .flat}/OneStepProver0.sol  |  502 ++-
 .../OneStepProverHostIo.sol                        |  643 +--
 .../OneStepProverMath.sol                          |  101 +-
 .../OneStepProverMemory.sol                        |  421 +-
 .../{.flat@342007871 => .flat}/Outbox/Outbox.sol   |  114 +-
 .../RollupEventInbox/RollupEventInbox.sol          |   79 +-
 .../RollupProxy/RollupAdminLogic.1.sol             | 2809 ++++++------
 .../RollupProxy/RollupProxy.p.sol                  |   91 +-
 .../RollupProxy/RollupUserLogic.2.sol              | 4700 ++++++++++----------
 .../SequencerInbox/SequencerInbox.sol              | 1030 +++--
 .../ValidatorUtils.sol => /dev/null                |  323 --
 17 files changed, 9530 insertions(+), 7030 deletions(-)
```

Generated with discovered.json: 0x90101620d440b9c15729be073f134b4b8e5355d5

# Diff at Mon, 14 Jul 2025 12:44:18 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@9f4300dad2f3d080cd56fa311d4a848556c74e72 block: 342007871
- current block number: 342007871

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 342007871 (main branch discovery), not current.

```diff
    contract UpgradeExecutor (0x10083F68A4aEC72c567661616bd6036D3a6d1B36) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      address:
-        "0x10083F68A4aEC72c567661616bd6036D3a6d1B36"
+        "arb1:0x10083F68A4aEC72c567661616bd6036D3a6d1B36"
      values.$admin:
-        "0x37119EAcFBc1c83DDAf80F6705b6B19630C101C4"
+        "arb1:0x37119EAcFBc1c83DDAf80F6705b6B19630C101C4"
      values.$implementation:
-        "0x660ea1675F7323dC3Ba0c8dDFB593225Eb01E3C1"
+        "arb1:0x660ea1675F7323dC3Ba0c8dDFB593225Eb01E3C1"
      values.$pastUpgrades.0.2.0:
-        "0x660ea1675F7323dC3Ba0c8dDFB593225Eb01E3C1"
+        "arb1:0x660ea1675F7323dC3Ba0c8dDFB593225Eb01E3C1"
      values.accessControl.ADMIN_ROLE.members.0:
-        "0x10083F68A4aEC72c567661616bd6036D3a6d1B36"
+        "arb1:0x10083F68A4aEC72c567661616bd6036D3a6d1B36"
      values.accessControl.EXECUTOR_ROLE.members.0:
-        "0xCa9c24bf165D375A62E62b9fb8F138E19A957Aa9"
+        "arb1:0xCa9c24bf165D375A62E62b9fb8F138E19A957Aa9"
      values.executors.0:
-        "0xCa9c24bf165D375A62E62b9fb8F138E19A957Aa9"
+        "arb1:0xCa9c24bf165D375A62E62b9fb8F138E19A957Aa9"
      implementationNames.0x10083F68A4aEC72c567661616bd6036D3a6d1B36:
-        "TransparentUpgradeableProxy"
      implementationNames.0x660ea1675F7323dC3Ba0c8dDFB593225Eb01E3C1:
-        "UpgradeExecutor"
      implementationNames.arb1:0x10083F68A4aEC72c567661616bd6036D3a6d1B36:
+        "TransparentUpgradeableProxy"
      implementationNames.arb1:0x660ea1675F7323dC3Ba0c8dDFB593225Eb01E3C1:
+        "UpgradeExecutor"
    }
```

```diff
    contract Inbox (0x18BB8310E3a3DF4EFcCb6B3E9AeCB8bE6d4af07f) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      address:
-        "0x18BB8310E3a3DF4EFcCb6B3E9AeCB8bE6d4af07f"
+        "arb1:0x18BB8310E3a3DF4EFcCb6B3E9AeCB8bE6d4af07f"
      values.$admin:
-        "0x37119EAcFBc1c83DDAf80F6705b6B19630C101C4"
+        "arb1:0x37119EAcFBc1c83DDAf80F6705b6B19630C101C4"
      values.$implementation:
-        "0x6C6cf18f13C3e9b969e3acE6b8F21DfF95d4D447"
+        "arb1:0x6C6cf18f13C3e9b969e3acE6b8F21DfF95d4D447"
      values.$pastUpgrades.0.2.0:
-        "0x8f6406781cC955398C45a48DcEfeEBDb2c8e2CaA"
+        "arb1:0x8f6406781cC955398C45a48DcEfeEBDb2c8e2CaA"
      values.$pastUpgrades.1.2.0:
-        "0x6C6cf18f13C3e9b969e3acE6b8F21DfF95d4D447"
+        "arb1:0x6C6cf18f13C3e9b969e3acE6b8F21DfF95d4D447"
      values.bridge:
-        "0xB0EC3C1368AF7d9C2CAE6B7f8E022Cc14d59D2b1"
+        "arb1:0xB0EC3C1368AF7d9C2CAE6B7f8E022Cc14d59D2b1"
      values.getProxyAdmin:
-        "0x37119EAcFBc1c83DDAf80F6705b6B19630C101C4"
+        "arb1:0x37119EAcFBc1c83DDAf80F6705b6B19630C101C4"
      values.sequencerInbox:
-        "0xfb27e42E964F3364630F76D62EB295ae792BD4FA"
+        "arb1:0xfb27e42E964F3364630F76D62EB295ae792BD4FA"
      implementationNames.0x18BB8310E3a3DF4EFcCb6B3E9AeCB8bE6d4af07f:
-        "TransparentUpgradeableProxy"
      implementationNames.0x6C6cf18f13C3e9b969e3acE6b8F21DfF95d4D447:
-        "Inbox"
      implementationNames.arb1:0x18BB8310E3a3DF4EFcCb6B3E9AeCB8bE6d4af07f:
+        "TransparentUpgradeableProxy"
      implementationNames.arb1:0x6C6cf18f13C3e9b969e3acE6b8F21DfF95d4D447:
+        "Inbox"
    }
```

```diff
    EOA  (0x26C9cC5681Dc8CfA7d0CD2F52769479b54612298) {
    +++ description: None
      address:
-        "0x26C9cC5681Dc8CfA7d0CD2F52769479b54612298"
+        "arb1:0x26C9cC5681Dc8CfA7d0CD2F52769479b54612298"
    }
```

```diff
    contract OneStepProverHostIo (0x33c1514Bf90e202d242C299b37C60f908aa206D4) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      address:
-        "0x33c1514Bf90e202d242C299b37C60f908aa206D4"
+        "arb1:0x33c1514Bf90e202d242C299b37C60f908aa206D4"
      implementationNames.0x33c1514Bf90e202d242C299b37C60f908aa206D4:
-        "OneStepProverHostIo"
      implementationNames.arb1:0x33c1514Bf90e202d242C299b37C60f908aa206D4:
+        "OneStepProverHostIo"
    }
```

```diff
    contract ProxyAdmin (0x37119EAcFBc1c83DDAf80F6705b6B19630C101C4) {
    +++ description: None
      address:
-        "0x37119EAcFBc1c83DDAf80F6705b6B19630C101C4"
+        "arb1:0x37119EAcFBc1c83DDAf80F6705b6B19630C101C4"
      values.owner:
-        "0x10083F68A4aEC72c567661616bd6036D3a6d1B36"
+        "arb1:0x10083F68A4aEC72c567661616bd6036D3a6d1B36"
      implementationNames.0x37119EAcFBc1c83DDAf80F6705b6B19630C101C4:
-        "ProxyAdmin"
      implementationNames.arb1:0x37119EAcFBc1c83DDAf80F6705b6B19630C101C4:
+        "ProxyAdmin"
    }
```

```diff
    contract OneStepProver0 (0x54E0923782b701044444De5d8c3A45aC890b0881) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      address:
-        "0x54E0923782b701044444De5d8c3A45aC890b0881"
+        "arb1:0x54E0923782b701044444De5d8c3A45aC890b0881"
      implementationNames.0x54E0923782b701044444De5d8c3A45aC890b0881:
-        "OneStepProver0"
      implementationNames.arb1:0x54E0923782b701044444De5d8c3A45aC890b0881:
+        "OneStepProver0"
    }
```

```diff
    contract ValidatorUtils (0x6c21303F5986180B1394d2C89f3e883890E2867b) {
    +++ description: This contract implements view only utilities for validators.
      address:
-        "0x6c21303F5986180B1394d2C89f3e883890E2867b"
+        "arb1:0x6c21303F5986180B1394d2C89f3e883890E2867b"
      implementationNames.0x6c21303F5986180B1394d2C89f3e883890E2867b:
-        "ValidatorUtils"
      implementationNames.arb1:0x6c21303F5986180B1394d2C89f3e883890E2867b:
+        "ValidatorUtils"
    }
```

```diff
    contract RollupProxy (0x73CA76d9B04661604fF950fB8DBc9f18F1B853f1) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      address:
-        "0x73CA76d9B04661604fF950fB8DBc9f18F1B853f1"
+        "arb1:0x73CA76d9B04661604fF950fB8DBc9f18F1B853f1"
      values.$admin:
-        "0x10083F68A4aEC72c567661616bd6036D3a6d1B36"
+        "arb1:0x10083F68A4aEC72c567661616bd6036D3a6d1B36"
      values.$implementation.0:
-        "0xdD91f6e88576fEc4A38A518DA39C92e13CBB6446"
+        "arb1:0xdD91f6e88576fEc4A38A518DA39C92e13CBB6446"
      values.$implementation.1:
-        "0x1BeD37FeDFE8B2721a69A559313D2b58d16Ecd77"
+        "arb1:0x1BeD37FeDFE8B2721a69A559313D2b58d16Ecd77"
      values.$pastUpgrades.0.2.0:
-        "0xEe9E5546A11Cb5b4A86e92DA05f2ef75C26E4754"
+        "arb1:0xEe9E5546A11Cb5b4A86e92DA05f2ef75C26E4754"
      values.$pastUpgrades.0.2.1:
-        "0x0aE4dD666748bF0F6dB5c149Eab1D8aD27820A6A"
+        "arb1:0x0aE4dD666748bF0F6dB5c149Eab1D8aD27820A6A"
      values.$pastUpgrades.1.2.0:
-        "0xdD91f6e88576fEc4A38A518DA39C92e13CBB6446"
+        "arb1:0xdD91f6e88576fEc4A38A518DA39C92e13CBB6446"
      values.$pastUpgrades.1.2.1:
-        "0x1BeD37FeDFE8B2721a69A559313D2b58d16Ecd77"
+        "arb1:0x1BeD37FeDFE8B2721a69A559313D2b58d16Ecd77"
      values.anyTrustFastConfirmer:
-        "0x0000000000000000000000000000000000000000"
+        "arb1:0x0000000000000000000000000000000000000000"
      values.bridge:
-        "0xB0EC3C1368AF7d9C2CAE6B7f8E022Cc14d59D2b1"
+        "arb1:0xB0EC3C1368AF7d9C2CAE6B7f8E022Cc14d59D2b1"
      values.challengeManager:
-        "0xE8c7770db364e57b2A4f5344d51b7f490aE9163A"
+        "arb1:0xE8c7770db364e57b2A4f5344d51b7f490aE9163A"
      values.inbox:
-        "0x18BB8310E3a3DF4EFcCb6B3E9AeCB8bE6d4af07f"
+        "arb1:0x18BB8310E3a3DF4EFcCb6B3E9AeCB8bE6d4af07f"
      values.loserStakeEscrow:
-        "0x0000000000000000000000000000000000000000"
+        "arb1:0x0000000000000000000000000000000000000000"
      values.outbox:
-        "0xD17550876106645988051ffDd31dFc3cDaA29F9c"
+        "arb1:0xD17550876106645988051ffDd31dFc3cDaA29F9c"
      values.owner:
-        "0x10083F68A4aEC72c567661616bd6036D3a6d1B36"
+        "arb1:0x10083F68A4aEC72c567661616bd6036D3a6d1B36"
      values.rollupEventInbox:
-        "0x8987777757a91Ed09912D7A5B8430bbAC2cf153C"
+        "arb1:0x8987777757a91Ed09912D7A5B8430bbAC2cf153C"
      values.sequencerInbox:
-        "0xfb27e42E964F3364630F76D62EB295ae792BD4FA"
+        "arb1:0xfb27e42E964F3364630F76D62EB295ae792BD4FA"
      values.stakeToken:
-        "0x0000000000000000000000000000000000000000"
+        "arb1:0x0000000000000000000000000000000000000000"
      values.validators.0:
-        "0x26C9cC5681Dc8CfA7d0CD2F52769479b54612298"
+        "arb1:0x26C9cC5681Dc8CfA7d0CD2F52769479b54612298"
      values.validatorUtils:
-        "0x6c21303F5986180B1394d2C89f3e883890E2867b"
+        "arb1:0x6c21303F5986180B1394d2C89f3e883890E2867b"
      values.validatorWalletCreator:
-        "0x2b0E04Dc90e3fA58165CB41E2834B44A56E766aF"
+        "arb1:0x2b0E04Dc90e3fA58165CB41E2834B44A56E766aF"
      implementationNames.0x73CA76d9B04661604fF950fB8DBc9f18F1B853f1:
-        "RollupProxy"
      implementationNames.0xdD91f6e88576fEc4A38A518DA39C92e13CBB6446:
-        "RollupAdminLogic"
      implementationNames.0x1BeD37FeDFE8B2721a69A559313D2b58d16Ecd77:
-        "RollupUserLogic"
      implementationNames.arb1:0x73CA76d9B04661604fF950fB8DBc9f18F1B853f1:
+        "RollupProxy"
      implementationNames.arb1:0xdD91f6e88576fEc4A38A518DA39C92e13CBB6446:
+        "RollupAdminLogic"
      implementationNames.arb1:0x1BeD37FeDFE8B2721a69A559313D2b58d16Ecd77:
+        "RollupUserLogic"
    }
```

```diff
    contract RollupEventInbox (0x8987777757a91Ed09912D7A5B8430bbAC2cf153C) {
    +++ description: Helper contract sending configuration data over the bridge during the systems initialization.
      address:
-        "0x8987777757a91Ed09912D7A5B8430bbAC2cf153C"
+        "arb1:0x8987777757a91Ed09912D7A5B8430bbAC2cf153C"
      values.$admin:
-        "0x37119EAcFBc1c83DDAf80F6705b6B19630C101C4"
+        "arb1:0x37119EAcFBc1c83DDAf80F6705b6B19630C101C4"
      values.$implementation:
-        "0xF40C24bA346aA459ED28e196D4A46Cf17174bD6C"
+        "arb1:0xF40C24bA346aA459ED28e196D4A46Cf17174bD6C"
      values.$pastUpgrades.0.2.0:
-        "0xF40C24bA346aA459ED28e196D4A46Cf17174bD6C"
+        "arb1:0xF40C24bA346aA459ED28e196D4A46Cf17174bD6C"
      values.bridge:
-        "0xB0EC3C1368AF7d9C2CAE6B7f8E022Cc14d59D2b1"
+        "arb1:0xB0EC3C1368AF7d9C2CAE6B7f8E022Cc14d59D2b1"
      values.rollup:
-        "0x73CA76d9B04661604fF950fB8DBc9f18F1B853f1"
+        "arb1:0x73CA76d9B04661604fF950fB8DBc9f18F1B853f1"
      implementationNames.0x8987777757a91Ed09912D7A5B8430bbAC2cf153C:
-        "TransparentUpgradeableProxy"
      implementationNames.0xF40C24bA346aA459ED28e196D4A46Cf17174bD6C:
-        "RollupEventInbox"
      implementationNames.arb1:0x8987777757a91Ed09912D7A5B8430bbAC2cf153C:
+        "TransparentUpgradeableProxy"
      implementationNames.arb1:0xF40C24bA346aA459ED28e196D4A46Cf17174bD6C:
+        "RollupEventInbox"
    }
```

```diff
    EOA  (0x922bc2d9dd1c4fd0a08460DD8d3E29BfD5b99117) {
    +++ description: None
      address:
-        "0x922bc2d9dd1c4fd0a08460DD8d3E29BfD5b99117"
+        "arb1:0x922bc2d9dd1c4fd0a08460DD8d3E29BfD5b99117"
    }
```

```diff
    contract Bridge (0xB0EC3C1368AF7d9C2CAE6B7f8E022Cc14d59D2b1) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      address:
-        "0xB0EC3C1368AF7d9C2CAE6B7f8E022Cc14d59D2b1"
+        "arb1:0xB0EC3C1368AF7d9C2CAE6B7f8E022Cc14d59D2b1"
      values.$admin:
-        "0x37119EAcFBc1c83DDAf80F6705b6B19630C101C4"
+        "arb1:0x37119EAcFBc1c83DDAf80F6705b6B19630C101C4"
      values.$implementation:
-        "0xB23214f241bdEb275f7dCBfbb1EA79349101d4B0"
+        "arb1:0xB23214f241bdEb275f7dCBfbb1EA79349101d4B0"
      values.$pastUpgrades.0.2.0:
-        "0xB23214f241bdEb275f7dCBfbb1EA79349101d4B0"
+        "arb1:0xB23214f241bdEb275f7dCBfbb1EA79349101d4B0"
      values.activeOutbox:
-        "0x0000000000000000000000000000000000000000"
+        "arb1:0x0000000000000000000000000000000000000000"
+++ description: Allowed to mint the gastoken on L2 and call `enqueueDelayedMessage()` on the bridge.
+++ severity: HIGH
      values.allowedDelayedInboxList.0:
-        "0x18BB8310E3a3DF4EFcCb6B3E9AeCB8bE6d4af07f"
+        "arb1:0x18BB8310E3a3DF4EFcCb6B3E9AeCB8bE6d4af07f"
+++ description: Allowed to mint the gastoken on L2 and call `enqueueDelayedMessage()` on the bridge.
+++ severity: HIGH
      values.allowedDelayedInboxList.1:
-        "0x8987777757a91Ed09912D7A5B8430bbAC2cf153C"
+        "arb1:0x8987777757a91Ed09912D7A5B8430bbAC2cf153C"
+++ description: Can make calls as the bridge, steal all funds.
+++ severity: HIGH
      values.allowedOutboxList.0:
-        "0xD17550876106645988051ffDd31dFc3cDaA29F9c"
+        "arb1:0xD17550876106645988051ffDd31dFc3cDaA29F9c"
+++ description: All Inboxes that were ever set as allowed in the bridge.
+++ severity: HIGH
      values.inboxHistory.0:
-        "0x18BB8310E3a3DF4EFcCb6B3E9AeCB8bE6d4af07f"
+        "arb1:0x18BB8310E3a3DF4EFcCb6B3E9AeCB8bE6d4af07f"
+++ description: All Inboxes that were ever set as allowed in the bridge.
+++ severity: HIGH
      values.inboxHistory.1:
-        "0x8987777757a91Ed09912D7A5B8430bbAC2cf153C"
+        "arb1:0x8987777757a91Ed09912D7A5B8430bbAC2cf153C"
+++ description: All Outboxes that were ever set as allowed in the bridge.
+++ severity: HIGH
      values.outboxHistory.0:
-        "0xD17550876106645988051ffDd31dFc3cDaA29F9c"
+        "arb1:0xD17550876106645988051ffDd31dFc3cDaA29F9c"
      values.rollup:
-        "0x73CA76d9B04661604fF950fB8DBc9f18F1B853f1"
+        "arb1:0x73CA76d9B04661604fF950fB8DBc9f18F1B853f1"
      values.sequencerInbox:
-        "0xfb27e42E964F3364630F76D62EB295ae792BD4FA"
+        "arb1:0xfb27e42E964F3364630F76D62EB295ae792BD4FA"
      implementationNames.0xB0EC3C1368AF7d9C2CAE6B7f8E022Cc14d59D2b1:
-        "TransparentUpgradeableProxy"
      implementationNames.0xB23214f241bdEb275f7dCBfbb1EA79349101d4B0:
-        "Bridge"
      implementationNames.arb1:0xB0EC3C1368AF7d9C2CAE6B7f8E022Cc14d59D2b1:
+        "TransparentUpgradeableProxy"
      implementationNames.arb1:0xB23214f241bdEb275f7dCBfbb1EA79349101d4B0:
+        "Bridge"
    }
```

```diff
    EOA  (0xCa9c24bf165D375A62E62b9fb8F138E19A957Aa9) {
    +++ description: None
      address:
-        "0xCa9c24bf165D375A62E62b9fb8F138E19A957Aa9"
+        "arb1:0xCa9c24bf165D375A62E62b9fb8F138E19A957Aa9"
    }
```

```diff
    contract Outbox (0xD17550876106645988051ffDd31dFc3cDaA29F9c) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
      address:
-        "0xD17550876106645988051ffDd31dFc3cDaA29F9c"
+        "arb1:0xD17550876106645988051ffDd31dFc3cDaA29F9c"
      values.$admin:
-        "0x37119EAcFBc1c83DDAf80F6705b6B19630C101C4"
+        "arb1:0x37119EAcFBc1c83DDAf80F6705b6B19630C101C4"
      values.$implementation:
-        "0x13BE515E44Eefaf3eBEFAD684F1FBB574Ac0A494"
+        "arb1:0x13BE515E44Eefaf3eBEFAD684F1FBB574Ac0A494"
      values.$pastUpgrades.0.2.0:
-        "0x13BE515E44Eefaf3eBEFAD684F1FBB574Ac0A494"
+        "arb1:0x13BE515E44Eefaf3eBEFAD684F1FBB574Ac0A494"
      values.bridge:
-        "0xB0EC3C1368AF7d9C2CAE6B7f8E022Cc14d59D2b1"
+        "arb1:0xB0EC3C1368AF7d9C2CAE6B7f8E022Cc14d59D2b1"
      values.l2ToL1Sender:
-        "0x0000000000000000000000000000000000000000"
+        "arb1:0x0000000000000000000000000000000000000000"
      values.rollup:
-        "0x73CA76d9B04661604fF950fB8DBc9f18F1B853f1"
+        "arb1:0x73CA76d9B04661604fF950fB8DBc9f18F1B853f1"
      implementationNames.0xD17550876106645988051ffDd31dFc3cDaA29F9c:
-        "TransparentUpgradeableProxy"
      implementationNames.0x13BE515E44Eefaf3eBEFAD684F1FBB574Ac0A494:
-        "Outbox"
      implementationNames.arb1:0xD17550876106645988051ffDd31dFc3cDaA29F9c:
+        "TransparentUpgradeableProxy"
      implementationNames.arb1:0x13BE515E44Eefaf3eBEFAD684F1FBB574Ac0A494:
+        "Outbox"
    }
```

```diff
    contract OneStepProofEntry (0xD89d54007079071cBA859127318b9F34eeB78049) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      address:
-        "0xD89d54007079071cBA859127318b9F34eeB78049"
+        "arb1:0xD89d54007079071cBA859127318b9F34eeB78049"
      values.prover0:
-        "0x54E0923782b701044444De5d8c3A45aC890b0881"
+        "arb1:0x54E0923782b701044444De5d8c3A45aC890b0881"
      values.proverHostIo:
-        "0x33c1514Bf90e202d242C299b37C60f908aa206D4"
+        "arb1:0x33c1514Bf90e202d242C299b37C60f908aa206D4"
      values.proverMath:
-        "0xE58a2dEb5718F9aAF2C1DdD0E366ED076D204cc4"
+        "arb1:0xE58a2dEb5718F9aAF2C1DdD0E366ED076D204cc4"
      values.proverMem:
-        "0xf8E5e5562c2c12d8690786f5C9FA65F20F6bD881"
+        "arb1:0xf8E5e5562c2c12d8690786f5C9FA65F20F6bD881"
      implementationNames.0xD89d54007079071cBA859127318b9F34eeB78049:
-        "OneStepProofEntry"
      implementationNames.arb1:0xD89d54007079071cBA859127318b9F34eeB78049:
+        "OneStepProofEntry"
    }
```

```diff
    contract OneStepProverMath (0xE58a2dEb5718F9aAF2C1DdD0E366ED076D204cc4) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      address:
-        "0xE58a2dEb5718F9aAF2C1DdD0E366ED076D204cc4"
+        "arb1:0xE58a2dEb5718F9aAF2C1DdD0E366ED076D204cc4"
      implementationNames.0xE58a2dEb5718F9aAF2C1DdD0E366ED076D204cc4:
-        "OneStepProverMath"
      implementationNames.arb1:0xE58a2dEb5718F9aAF2C1DdD0E366ED076D204cc4:
+        "OneStepProverMath"
    }
```

```diff
    contract ChallengeManager (0xE8c7770db364e57b2A4f5344d51b7f490aE9163A) {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      address:
-        "0xE8c7770db364e57b2A4f5344d51b7f490aE9163A"
+        "arb1:0xE8c7770db364e57b2A4f5344d51b7f490aE9163A"
      values.$admin:
-        "0x37119EAcFBc1c83DDAf80F6705b6B19630C101C4"
+        "arb1:0x37119EAcFBc1c83DDAf80F6705b6B19630C101C4"
      values.$implementation:
-        "0x5AA806015FEC88669bF7DAd746BB4ADC1E79BcED"
+        "arb1:0x5AA806015FEC88669bF7DAd746BB4ADC1E79BcED"
      values.$pastUpgrades.0.2.0:
-        "0x09824fe72BFF474d16D9c2774432E381BBD60662"
+        "arb1:0x09824fe72BFF474d16D9c2774432E381BBD60662"
      values.$pastUpgrades.1.2.0:
-        "0x5cA988F213EfbCB86ED7e2AACB0C15c91e648f8d"
+        "arb1:0x5cA988F213EfbCB86ED7e2AACB0C15c91e648f8d"
      values.$pastUpgrades.2.2.0:
-        "0x5AA806015FEC88669bF7DAd746BB4ADC1E79BcED"
+        "arb1:0x5AA806015FEC88669bF7DAd746BB4ADC1E79BcED"
      values.bridge:
-        "0xB0EC3C1368AF7d9C2CAE6B7f8E022Cc14d59D2b1"
+        "arb1:0xB0EC3C1368AF7d9C2CAE6B7f8E022Cc14d59D2b1"
      values.osp:
-        "0xD89d54007079071cBA859127318b9F34eeB78049"
+        "arb1:0xD89d54007079071cBA859127318b9F34eeB78049"
      values.resultReceiver:
-        "0x73CA76d9B04661604fF950fB8DBc9f18F1B853f1"
+        "arb1:0x73CA76d9B04661604fF950fB8DBc9f18F1B853f1"
      values.sequencerInbox:
-        "0xfb27e42E964F3364630F76D62EB295ae792BD4FA"
+        "arb1:0xfb27e42E964F3364630F76D62EB295ae792BD4FA"
      implementationNames.0xE8c7770db364e57b2A4f5344d51b7f490aE9163A:
-        "TransparentUpgradeableProxy"
      implementationNames.0x5AA806015FEC88669bF7DAd746BB4ADC1E79BcED:
-        "ChallengeManager"
      implementationNames.arb1:0xE8c7770db364e57b2A4f5344d51b7f490aE9163A:
+        "TransparentUpgradeableProxy"
      implementationNames.arb1:0x5AA806015FEC88669bF7DAd746BB4ADC1E79BcED:
+        "ChallengeManager"
    }
```

```diff
    contract OneStepProverMemory (0xf8E5e5562c2c12d8690786f5C9FA65F20F6bD881) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      address:
-        "0xf8E5e5562c2c12d8690786f5C9FA65F20F6bD881"
+        "arb1:0xf8E5e5562c2c12d8690786f5C9FA65F20F6bD881"
      implementationNames.0xf8E5e5562c2c12d8690786f5C9FA65F20F6bD881:
-        "OneStepProverMemory"
      implementationNames.arb1:0xf8E5e5562c2c12d8690786f5C9FA65F20F6bD881:
+        "OneStepProverMemory"
    }
```

```diff
    contract SequencerInbox (0xfb27e42E964F3364630F76D62EB295ae792BD4FA) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      address:
-        "0xfb27e42E964F3364630F76D62EB295ae792BD4FA"
+        "arb1:0xfb27e42E964F3364630F76D62EB295ae792BD4FA"
      values.$admin:
-        "0x37119EAcFBc1c83DDAf80F6705b6B19630C101C4"
+        "arb1:0x37119EAcFBc1c83DDAf80F6705b6B19630C101C4"
      values.$implementation:
-        "0x066a4D939302470Bd83F1868A1Ae2485Fe75ccF2"
+        "arb1:0x066a4D939302470Bd83F1868A1Ae2485Fe75ccF2"
      values.$pastUpgrades.0.2.0:
-        "0x1c6ACCd9d66f3B993928E7439c9A2d67b94a445F"
+        "arb1:0x1c6ACCd9d66f3B993928E7439c9A2d67b94a445F"
      values.$pastUpgrades.1.2.0:
-        "0x18ed2d5bF7c5943bFd20a2995b9879E30c9E8dDa"
+        "arb1:0x18ed2d5bF7c5943bFd20a2995b9879E30c9E8dDa"
      values.$pastUpgrades.2.2.0:
-        "0x066a4D939302470Bd83F1868A1Ae2485Fe75ccF2"
+        "arb1:0x066a4D939302470Bd83F1868A1Ae2485Fe75ccF2"
      values.batchPosterManager:
-        "0x922bc2d9dd1c4fd0a08460DD8d3E29BfD5b99117"
+        "arb1:0x922bc2d9dd1c4fd0a08460DD8d3E29BfD5b99117"
      values.batchPosters.0:
-        "0x922bc2d9dd1c4fd0a08460DD8d3E29BfD5b99117"
+        "arb1:0x922bc2d9dd1c4fd0a08460DD8d3E29BfD5b99117"
      values.bridge:
-        "0xB0EC3C1368AF7d9C2CAE6B7f8E022Cc14d59D2b1"
+        "arb1:0xB0EC3C1368AF7d9C2CAE6B7f8E022Cc14d59D2b1"
      values.reader4844:
-        "0x0000000000000000000000000000000000000000"
+        "arb1:0x0000000000000000000000000000000000000000"
      values.rollup:
-        "0x73CA76d9B04661604fF950fB8DBc9f18F1B853f1"
+        "arb1:0x73CA76d9B04661604fF950fB8DBc9f18F1B853f1"
      implementationNames.0xfb27e42E964F3364630F76D62EB295ae792BD4FA:
-        "TransparentUpgradeableProxy"
      implementationNames.0x066a4D939302470Bd83F1868A1Ae2485Fe75ccF2:
-        "SequencerInbox"
      implementationNames.arb1:0xfb27e42E964F3364630F76D62EB295ae792BD4FA:
+        "TransparentUpgradeableProxy"
      implementationNames.arb1:0x066a4D939302470Bd83F1868A1Ae2485Fe75ccF2:
+        "SequencerInbox"
    }
```

```diff
+   Status: CREATED
    contract UpgradeExecutor (0x10083F68A4aEC72c567661616bd6036D3a6d1B36)
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
```

```diff
+   Status: CREATED
    contract Inbox (0x18BB8310E3a3DF4EFcCb6B3E9AeCB8bE6d4af07f)
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
```

```diff
+   Status: CREATED
    contract OneStepProverHostIo (0x33c1514Bf90e202d242C299b37C60f908aa206D4)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x37119EAcFBc1c83DDAf80F6705b6B19630C101C4)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProver0 (0x54E0923782b701044444De5d8c3A45aC890b0881)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract ValidatorUtils (0x6c21303F5986180B1394d2C89f3e883890E2867b)
    +++ description: This contract implements view only utilities for validators.
```

```diff
+   Status: CREATED
    contract RollupProxy (0x73CA76d9B04661604fF950fB8DBc9f18F1B853f1)
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
```

```diff
+   Status: CREATED
    contract RollupEventInbox (0x8987777757a91Ed09912D7A5B8430bbAC2cf153C)
    +++ description: Helper contract sending configuration data over the bridge during the systems initialization.
```

```diff
+   Status: CREATED
    contract Bridge (0xB0EC3C1368AF7d9C2CAE6B7f8E022Cc14d59D2b1)
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
```

```diff
+   Status: CREATED
    contract Outbox (0xD17550876106645988051ffDd31dFc3cDaA29F9c)
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
```

```diff
+   Status: CREATED
    contract OneStepProofEntry (0xD89d54007079071cBA859127318b9F34eeB78049)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract OneStepProverMath (0xE58a2dEb5718F9aAF2C1DdD0E366ED076D204cc4)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract ChallengeManager (0xE8c7770db364e57b2A4f5344d51b7f490aE9163A)
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
```

```diff
+   Status: CREATED
    contract OneStepProverMemory (0xf8E5e5562c2c12d8690786f5C9FA65F20F6bD881)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract SequencerInbox (0xfb27e42E964F3364630F76D62EB295ae792BD4FA)
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
```

Generated with discovered.json: 0x6dd6ea7f1cfd3999a3d0b8550796793f5913bde8

# Diff at Fri, 04 Jul 2025 12:19:10 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f56dc47fe915564d4555300304da4d3bcbc087f block: 342007871
- current block number: 342007871

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 342007871 (main branch discovery), not current.

```diff
    contract UpgradeExecutor (0x10083F68A4aEC72c567661616bd6036D3a6d1B36) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      directlyReceivedPermissions.0.from:
-        "arbitrum:0x37119EAcFBc1c83DDAf80F6705b6B19630C101C4"
+        "arb1:0x37119EAcFBc1c83DDAf80F6705b6B19630C101C4"
      directlyReceivedPermissions.1.from:
-        "arbitrum:0x73CA76d9B04661604fF950fB8DBc9f18F1B853f1"
+        "arb1:0x73CA76d9B04661604fF950fB8DBc9f18F1B853f1"
      directlyReceivedPermissions.2.from:
-        "arbitrum:0x73CA76d9B04661604fF950fB8DBc9f18F1B853f1"
+        "arb1:0x73CA76d9B04661604fF950fB8DBc9f18F1B853f1"
    }
```

```diff
    EOA  (0x26C9cC5681Dc8CfA7d0CD2F52769479b54612298) {
    +++ description: None
      receivedPermissions.0.from:
-        "arbitrum:0x73CA76d9B04661604fF950fB8DBc9f18F1B853f1"
+        "arb1:0x73CA76d9B04661604fF950fB8DBc9f18F1B853f1"
    }
```

```diff
    contract ProxyAdmin (0x37119EAcFBc1c83DDAf80F6705b6B19630C101C4) {
    +++ description: None
      directlyReceivedPermissions.0.from:
-        "arbitrum:0x10083F68A4aEC72c567661616bd6036D3a6d1B36"
+        "arb1:0x10083F68A4aEC72c567661616bd6036D3a6d1B36"
      directlyReceivedPermissions.1.from:
-        "arbitrum:0x18BB8310E3a3DF4EFcCb6B3E9AeCB8bE6d4af07f"
+        "arb1:0x18BB8310E3a3DF4EFcCb6B3E9AeCB8bE6d4af07f"
      directlyReceivedPermissions.2.from:
-        "arbitrum:0x8987777757a91Ed09912D7A5B8430bbAC2cf153C"
+        "arb1:0x8987777757a91Ed09912D7A5B8430bbAC2cf153C"
      directlyReceivedPermissions.3.from:
-        "arbitrum:0xB0EC3C1368AF7d9C2CAE6B7f8E022Cc14d59D2b1"
+        "arb1:0xB0EC3C1368AF7d9C2CAE6B7f8E022Cc14d59D2b1"
      directlyReceivedPermissions.4.from:
-        "arbitrum:0xD17550876106645988051ffDd31dFc3cDaA29F9c"
+        "arb1:0xD17550876106645988051ffDd31dFc3cDaA29F9c"
      directlyReceivedPermissions.5.from:
-        "arbitrum:0xE8c7770db364e57b2A4f5344d51b7f490aE9163A"
+        "arb1:0xE8c7770db364e57b2A4f5344d51b7f490aE9163A"
      directlyReceivedPermissions.6.from:
-        "arbitrum:0xfb27e42E964F3364630F76D62EB295ae792BD4FA"
+        "arb1:0xfb27e42E964F3364630F76D62EB295ae792BD4FA"
    }
```

```diff
    EOA  (0x922bc2d9dd1c4fd0a08460DD8d3E29BfD5b99117) {
    +++ description: None
      receivedPermissions.0.from:
-        "arbitrum:0xfb27e42E964F3364630F76D62EB295ae792BD4FA"
+        "arb1:0xfb27e42E964F3364630F76D62EB295ae792BD4FA"
      receivedPermissions.1.from:
-        "arbitrum:0xfb27e42E964F3364630F76D62EB295ae792BD4FA"
+        "arb1:0xfb27e42E964F3364630F76D62EB295ae792BD4FA"
    }
```

```diff
    EOA  (0xCa9c24bf165D375A62E62b9fb8F138E19A957Aa9) {
    +++ description: None
      receivedPermissions.0.via.0.address:
-        "arbitrum:0x10083F68A4aEC72c567661616bd6036D3a6d1B36"
+        "arb1:0x10083F68A4aEC72c567661616bd6036D3a6d1B36"
      receivedPermissions.0.from:
-        "arbitrum:0x73CA76d9B04661604fF950fB8DBc9f18F1B853f1"
+        "arb1:0x73CA76d9B04661604fF950fB8DBc9f18F1B853f1"
      receivedPermissions.1.via.1.address:
-        "arbitrum:0x10083F68A4aEC72c567661616bd6036D3a6d1B36"
+        "arb1:0x10083F68A4aEC72c567661616bd6036D3a6d1B36"
      receivedPermissions.1.via.0.address:
-        "arbitrum:0x37119EAcFBc1c83DDAf80F6705b6B19630C101C4"
+        "arb1:0x37119EAcFBc1c83DDAf80F6705b6B19630C101C4"
      receivedPermissions.1.from:
-        "arbitrum:0x10083F68A4aEC72c567661616bd6036D3a6d1B36"
+        "arb1:0x10083F68A4aEC72c567661616bd6036D3a6d1B36"
      receivedPermissions.2.via.1.address:
-        "arbitrum:0x10083F68A4aEC72c567661616bd6036D3a6d1B36"
+        "arb1:0x10083F68A4aEC72c567661616bd6036D3a6d1B36"
      receivedPermissions.2.via.0.address:
-        "arbitrum:0x37119EAcFBc1c83DDAf80F6705b6B19630C101C4"
+        "arb1:0x37119EAcFBc1c83DDAf80F6705b6B19630C101C4"
      receivedPermissions.2.from:
-        "arbitrum:0x18BB8310E3a3DF4EFcCb6B3E9AeCB8bE6d4af07f"
+        "arb1:0x18BB8310E3a3DF4EFcCb6B3E9AeCB8bE6d4af07f"
      receivedPermissions.3.via.0.address:
-        "arbitrum:0x10083F68A4aEC72c567661616bd6036D3a6d1B36"
+        "arb1:0x10083F68A4aEC72c567661616bd6036D3a6d1B36"
      receivedPermissions.3.from:
-        "arbitrum:0x73CA76d9B04661604fF950fB8DBc9f18F1B853f1"
+        "arb1:0x73CA76d9B04661604fF950fB8DBc9f18F1B853f1"
      receivedPermissions.4.via.1.address:
-        "arbitrum:0x10083F68A4aEC72c567661616bd6036D3a6d1B36"
+        "arb1:0x10083F68A4aEC72c567661616bd6036D3a6d1B36"
      receivedPermissions.4.via.0.address:
-        "arbitrum:0x37119EAcFBc1c83DDAf80F6705b6B19630C101C4"
+        "arb1:0x37119EAcFBc1c83DDAf80F6705b6B19630C101C4"
      receivedPermissions.4.from:
-        "arbitrum:0x8987777757a91Ed09912D7A5B8430bbAC2cf153C"
+        "arb1:0x8987777757a91Ed09912D7A5B8430bbAC2cf153C"
      receivedPermissions.5.via.1.address:
-        "arbitrum:0x10083F68A4aEC72c567661616bd6036D3a6d1B36"
+        "arb1:0x10083F68A4aEC72c567661616bd6036D3a6d1B36"
      receivedPermissions.5.via.0.address:
-        "arbitrum:0x37119EAcFBc1c83DDAf80F6705b6B19630C101C4"
+        "arb1:0x37119EAcFBc1c83DDAf80F6705b6B19630C101C4"
      receivedPermissions.5.from:
-        "arbitrum:0xB0EC3C1368AF7d9C2CAE6B7f8E022Cc14d59D2b1"
+        "arb1:0xB0EC3C1368AF7d9C2CAE6B7f8E022Cc14d59D2b1"
      receivedPermissions.6.via.1.address:
-        "arbitrum:0x10083F68A4aEC72c567661616bd6036D3a6d1B36"
+        "arb1:0x10083F68A4aEC72c567661616bd6036D3a6d1B36"
      receivedPermissions.6.via.0.address:
-        "arbitrum:0x37119EAcFBc1c83DDAf80F6705b6B19630C101C4"
+        "arb1:0x37119EAcFBc1c83DDAf80F6705b6B19630C101C4"
      receivedPermissions.6.from:
-        "arbitrum:0xD17550876106645988051ffDd31dFc3cDaA29F9c"
+        "arb1:0xD17550876106645988051ffDd31dFc3cDaA29F9c"
      receivedPermissions.7.via.1.address:
-        "arbitrum:0x10083F68A4aEC72c567661616bd6036D3a6d1B36"
+        "arb1:0x10083F68A4aEC72c567661616bd6036D3a6d1B36"
      receivedPermissions.7.via.0.address:
-        "arbitrum:0x37119EAcFBc1c83DDAf80F6705b6B19630C101C4"
+        "arb1:0x37119EAcFBc1c83DDAf80F6705b6B19630C101C4"
      receivedPermissions.7.from:
-        "arbitrum:0xE8c7770db364e57b2A4f5344d51b7f490aE9163A"
+        "arb1:0xE8c7770db364e57b2A4f5344d51b7f490aE9163A"
      receivedPermissions.8.via.1.address:
-        "arbitrum:0x10083F68A4aEC72c567661616bd6036D3a6d1B36"
+        "arb1:0x10083F68A4aEC72c567661616bd6036D3a6d1B36"
      receivedPermissions.8.via.0.address:
-        "arbitrum:0x37119EAcFBc1c83DDAf80F6705b6B19630C101C4"
+        "arb1:0x37119EAcFBc1c83DDAf80F6705b6B19630C101C4"
      receivedPermissions.8.from:
-        "arbitrum:0xfb27e42E964F3364630F76D62EB295ae792BD4FA"
+        "arb1:0xfb27e42E964F3364630F76D62EB295ae792BD4FA"
      directlyReceivedPermissions.0.from:
-        "arbitrum:0x10083F68A4aEC72c567661616bd6036D3a6d1B36"
+        "arb1:0x10083F68A4aEC72c567661616bd6036D3a6d1B36"
    }
```

Generated with discovered.json: 0xb2ef2644beaac01f74c9c1cceaed684d97d74f11

# Diff at Wed, 18 Jun 2025 12:22:03 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@a8e4f22a1441bd5040898cc3d3d62b3582942b65 block: 342007871
- current block number: 342007871

## Description

config: wasmmoduleroot map updated.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 342007871 (main branch discovery), not current.

```diff
    contract RollupProxy (0x73CA76d9B04661604fF950fB8DBc9f18F1B853f1) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      usedTypes.0.arg.0xdb698a2576298f25448bc092e52cf13b1e24141c997135d70f217d674bbeb69a:
+        "ArbOS v40 wasmModuleRoot"
    }
```

Generated with discovered.json: 0xc538bdfc95d1ec5878fcc820e4d000133fe61b51

# Diff at Fri, 30 May 2025 06:08:49 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@a4d8c436027d17df0f9b76843cd6deb1888fa381 block: 324576418
- current block number: 342007871

## Description

dac 1 -> 2 members.

## Watched changes

```diff
    contract SequencerInbox (0xfb27e42E964F3364630F76D62EB295ae792BD4FA) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      values.dacKeyset.blsSignatures.0:
-        "YBGtv/cSOrjaYb4sgmbUZtClzsM63PDWhe3uEDaPBolgse9IHjyuxotHgD9Lk6xy9Afu1nDrBZ2Bs8hxNwLloekcRSykEwhWC+1z3WvDeVATzaoG1Tz0qQUkYxNoJLxyrBhvcfCSmDqCPlOL7PW3rwN98KJwG6HX1dJF0dM2BXVe7AZgO9JYNxQ16GqywnVMbQwkRkzwtFgBcWLR4wdZlZJDaU5Te7h4SgIURKTZ8g5AC1fIr6dEemMisLdCtyuK0BIUWjPbLJwYJRogplS7rHCvbRoMpMCTbJBfUDA84du3/h2PADv7TxTJ0y6PVhAqJwTbaXHMIvlq2WTNgf3F1gn6JkGnn9p/nim0rxYtbYcOzqIwv4bmd2DvmUyXCCWnbA=="
+        "YAvPkaef4hf3zNeyzlRuxt0SkWz8qbJuOHEi9I8eMxUrQ7mhMmz7wi7BgpHpsPB9tBEOz/mKpGHi1aQeHcxG0QWODhT8oWHlcUvMvgpO2dhXSK6cRjDlOZy4mBXrjMJVBBOgjAkpi4UetNc2w6tyNcOa9lRekf8obnO+HHUjxiczyon2S5KCxkvtDbsEZZHeiweLET02229SZ0KZ2WksOgXQX48WeA3C4lU93vqCQQKtK9G+PEqi8ZzYfdeIi7LRUQFwcK5OoazKObLJprc1b5WkE8q9k/hiAXvhNTXJB92LSevLu/QXGYwarYzjlWkKiQBsjoKmITWIclydZCQl7dP9ooCHB3pafue9Ude9ZoXsolpU8J8Hs+aUSwqJ7uhPYg=="
      values.keySetUpdates:
-        1
+        2
    }
```

Generated with discovered.json: 0x1a2ae68aff2998ec21eb36aba3c222f0782ece66

# Diff at Tue, 27 May 2025 08:31:07 GMT:

- author: Michał Podsiadły (<michal.podsiadly@l2beat.com>)
- comparing to: main@fd658a9ed4bbd45fc5705d23b1906ca057d0d8b0 block: 324576418
- current block number: 324576418

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 324576418 (main branch discovery), not current.

```diff
    contract RollupProxy (0x73CA76d9B04661604fF950fB8DBc9f18F1B853f1) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      sourceHashes.2:
-        "0xb8da0b3748daac768860783e8555198fd2d1bbdffb775b81557a7124890c7eca"
      sourceHashes.1:
-        "0x9349e73cbc2d2b818c1d79711574ba210b56249d8d3845bc78c776caf8f8ff42"
+        "0xb8da0b3748daac768860783e8555198fd2d1bbdffb775b81557a7124890c7eca"
      sourceHashes.0:
-        "0x7ee21b18b2e18c636bfafc08ff72692cc43302b2599ba75f0abad67282866dd5"
+        "0x86c7032e0f4b5468f1eb92c79b73ab4c7f053fc7bdfc88fdd360e2fe7baa1072"
    }
```

Generated with discovered.json: 0x20d621aae1e0d0681c0cc43dff28e189d682f69b

# Diff at Fri, 23 May 2025 09:41:12 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@69cd181abbc3c830a6caf2f4429b37cae72ffdb8 block: 324576418
- current block number: 324576418

## Description

Introduced .role field on each permission, defaulting to field name on which it was defined (with '.' prefix)

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 324576418 (main branch discovery), not current.

```diff
    contract UpgradeExecutor (0x10083F68A4aEC72c567661616bd6036D3a6d1B36) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      directlyReceivedPermissions.2.role:
+        "admin"
      directlyReceivedPermissions.1.role:
+        ".owner"
      directlyReceivedPermissions.0.role:
+        ".owner"
    }
```

```diff
    EOA  (0x26C9cC5681Dc8CfA7d0CD2F52769479b54612298) {
    +++ description: None
      receivedPermissions.0.role:
+        ".validators"
    }
```

```diff
    contract ProxyAdmin (0x37119EAcFBc1c83DDAf80F6705b6B19630C101C4) {
    +++ description: None
      directlyReceivedPermissions.6.role:
+        "admin"
      directlyReceivedPermissions.5.role:
+        "admin"
      directlyReceivedPermissions.4.role:
+        "admin"
      directlyReceivedPermissions.3.role:
+        "admin"
      directlyReceivedPermissions.2.role:
+        "admin"
      directlyReceivedPermissions.1.role:
+        "admin"
      directlyReceivedPermissions.0.role:
+        "admin"
    }
```

```diff
    EOA  (0x922bc2d9dd1c4fd0a08460DD8d3E29BfD5b99117) {
    +++ description: None
      receivedPermissions.1.role:
+        ".batchPosterManager"
      receivedPermissions.0.role:
+        ".batchPosters"
    }
```

```diff
    EOA  (0xCa9c24bf165D375A62E62b9fb8F138E19A957Aa9) {
    +++ description: None
      receivedPermissions.8.role:
+        "admin"
      receivedPermissions.7.role:
+        "admin"
      receivedPermissions.6.permission:
-        "interact"
+        "upgrade"
      receivedPermissions.6.from:
-        "0x73CA76d9B04661604fF950fB8DBc9f18F1B853f1"
+        "0xD17550876106645988051ffDd31dFc3cDaA29F9c"
      receivedPermissions.6.description:
-        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
      receivedPermissions.6.via.1:
+        {"address":"0x37119EAcFBc1c83DDAf80F6705b6B19630C101C4"}
      receivedPermissions.6.role:
+        "admin"
      receivedPermissions.5.from:
-        "0xD17550876106645988051ffDd31dFc3cDaA29F9c"
+        "0xB0EC3C1368AF7d9C2CAE6B7f8E022Cc14d59D2b1"
      receivedPermissions.5.role:
+        "admin"
      receivedPermissions.4.from:
-        "0xB0EC3C1368AF7d9C2CAE6B7f8E022Cc14d59D2b1"
+        "0x8987777757a91Ed09912D7A5B8430bbAC2cf153C"
      receivedPermissions.4.role:
+        "admin"
      receivedPermissions.3.from:
-        "0x8987777757a91Ed09912D7A5B8430bbAC2cf153C"
+        "0xE8c7770db364e57b2A4f5344d51b7f490aE9163A"
      receivedPermissions.3.role:
+        "admin"
      receivedPermissions.2.from:
-        "0xE8c7770db364e57b2A4f5344d51b7f490aE9163A"
+        "0x18BB8310E3a3DF4EFcCb6B3E9AeCB8bE6d4af07f"
      receivedPermissions.2.role:
+        "admin"
      receivedPermissions.1.from:
-        "0x18BB8310E3a3DF4EFcCb6B3E9AeCB8bE6d4af07f"
+        "0xfb27e42E964F3364630F76D62EB295ae792BD4FA"
      receivedPermissions.1.role:
+        "admin"
      receivedPermissions.0.permission:
-        "upgrade"
+        "interact"
      receivedPermissions.0.from:
-        "0xfb27e42E964F3364630F76D62EB295ae792BD4FA"
+        "0x73CA76d9B04661604fF950fB8DBc9f18F1B853f1"
      receivedPermissions.0.via.1:
-        {"address":"0x37119EAcFBc1c83DDAf80F6705b6B19630C101C4"}
      receivedPermissions.0.description:
+        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
      receivedPermissions.0.role:
+        ".owner"
      directlyReceivedPermissions.0.role:
+        ".executors"
    }
```

Generated with discovered.json: 0xdc450229ea4170bfa08ddc432031472115cfda96

# Diff at Tue, 06 May 2025 10:57:03 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@3a394513711f46aa66871603365b6afb40a79057 block: 324576418
- current block number: 324576418

## Description

Marking EOAs if they control the highest number of upgrade permissions in the project.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 324576418 (main branch discovery), not current.

```diff
    EOA  (0xCa9c24bf165D375A62E62b9fb8F138E19A957Aa9) {
    +++ description: None
      controlsMajorityOfUpgradePermissions:
+        true
    }
```

Generated with discovered.json: 0x9739b18229454129fc712c2cea156b062b2bf5a2

# Diff at Fri, 02 May 2025 17:25:20 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@c598e33a0c469175b7abbd6c2a13b47b63d6b6a4 block: 324576418
- current block number: 324576418

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 324576418 (main branch discovery), not current.

```diff
    contract RollupProxy (0x73CA76d9B04661604fF950fB8DBc9f18F1B853f1) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      usedTypes.0.arg.0xaf1dbdfceb871c00bfbb1675983133df04f0ed04e89647812513c091e3a982b3:
+        "Celestia Nitro 3.3.2 wasmModuleRoot"
    }
```

Generated with discovered.json: 0x6af9b3582314ddb30a5d8a39c83627584d5d6b80

# Diff at Tue, 29 Apr 2025 08:19:20 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@ef7477af00fe0b57a2f7cacf7e958c12494af662 block: 324576418
- current block number: 324576418

## Description

Field .issuedPermissions is removed from the output as no longer needed. Added 'permissionsConfigHash' due to refactoring of the modelling process (into a separate command).

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 324576418 (main branch discovery), not current.

```diff
    contract UpgradeExecutor (0x10083F68A4aEC72c567661616bd6036D3a6d1B36) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0xCa9c24bf165D375A62E62b9fb8F138E19A957Aa9","via":[{"address":"0x10083F68A4aEC72c567661616bd6036D3a6d1B36"},{"address":"0x37119EAcFBc1c83DDAf80F6705b6B19630C101C4"}]}]
    }
```

```diff
    contract Inbox (0x18BB8310E3a3DF4EFcCb6B3E9AeCB8bE6d4af07f) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0xCa9c24bf165D375A62E62b9fb8F138E19A957Aa9","via":[{"address":"0x10083F68A4aEC72c567661616bd6036D3a6d1B36"},{"address":"0x37119EAcFBc1c83DDAf80F6705b6B19630C101C4"}]}]
    }
```

```diff
    contract RollupProxy (0x73CA76d9B04661604fF950fB8DBc9f18F1B853f1) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      issuedPermissions:
-        [{"permission":"interact","to":"0xCa9c24bf165D375A62E62b9fb8F138E19A957Aa9","description":"Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes.","via":[{"address":"0x10083F68A4aEC72c567661616bd6036D3a6d1B36"}]},{"permission":"upgrade","to":"0xCa9c24bf165D375A62E62b9fb8F138E19A957Aa9","via":[{"address":"0x10083F68A4aEC72c567661616bd6036D3a6d1B36"}]},{"permission":"validate","to":"0x26C9cC5681Dc8CfA7d0CD2F52769479b54612298","description":"Can propose new state roots (called nodes) and challenge state roots on the host chain.","via":[]}]
    }
```

```diff
    contract RollupEventInbox (0x8987777757a91Ed09912D7A5B8430bbAC2cf153C) {
    +++ description: Helper contract sending configuration data over the bridge during the systems initialization.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0xCa9c24bf165D375A62E62b9fb8F138E19A957Aa9","via":[{"address":"0x10083F68A4aEC72c567661616bd6036D3a6d1B36"},{"address":"0x37119EAcFBc1c83DDAf80F6705b6B19630C101C4"}]}]
    }
```

```diff
    contract Bridge (0xB0EC3C1368AF7d9C2CAE6B7f8E022Cc14d59D2b1) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0xCa9c24bf165D375A62E62b9fb8F138E19A957Aa9","via":[{"address":"0x10083F68A4aEC72c567661616bd6036D3a6d1B36"},{"address":"0x37119EAcFBc1c83DDAf80F6705b6B19630C101C4"}]}]
    }
```

```diff
    contract Outbox (0xD17550876106645988051ffDd31dFc3cDaA29F9c) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0xCa9c24bf165D375A62E62b9fb8F138E19A957Aa9","via":[{"address":"0x10083F68A4aEC72c567661616bd6036D3a6d1B36"},{"address":"0x37119EAcFBc1c83DDAf80F6705b6B19630C101C4"}]}]
    }
```

```diff
    contract ChallengeManager (0xE8c7770db364e57b2A4f5344d51b7f490aE9163A) {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0xCa9c24bf165D375A62E62b9fb8F138E19A957Aa9","via":[{"address":"0x10083F68A4aEC72c567661616bd6036D3a6d1B36"},{"address":"0x37119EAcFBc1c83DDAf80F6705b6B19630C101C4"}]}]
    }
```

```diff
    contract SequencerInbox (0xfb27e42E964F3364630F76D62EB295ae792BD4FA) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      issuedPermissions:
-        [{"permission":"interact","to":"0x922bc2d9dd1c4fd0a08460DD8d3E29BfD5b99117","description":"Add/remove batchPosters (Sequencers).","via":[]},{"permission":"sequence","to":"0x922bc2d9dd1c4fd0a08460DD8d3E29BfD5b99117","description":"Can submit transaction batches or commitments to the SequencerInbox contract on the host chain.","via":[]},{"permission":"upgrade","to":"0xCa9c24bf165D375A62E62b9fb8F138E19A957Aa9","via":[{"address":"0x10083F68A4aEC72c567661616bd6036D3a6d1B36"},{"address":"0x37119EAcFBc1c83DDAf80F6705b6B19630C101C4"}]}]
    }
```

Generated with discovered.json: 0x51bb16658c1004e8d82e25c659ca3ec59c4c0650

# Diff at Wed, 09 Apr 2025 13:42:32 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@45b707d5b88f76d72dd5f8252dbef76321c2f829 block: 323453444
- current block number: 324576418

## Description

Add and remove a staker to call forceRefundStaker in the meantime:
1) https://app.blocksec.com/explorer/tx/arbitrum/0x97c9635d50f195c8436470235f2cd2cff763957e7dead93a7b37102611dd9881
2) https://app.blocksec.com/explorer/tx/arbitrum/0x40f73d3fed810719174d95929bc997e0d4ab616a3b8a6d997fa19ef15d1cf503
3) https://app.blocksec.com/explorer/tx/arbitrum/0xe7519bdb47cdd3c541a8ad00f66eaa0f594dba07e4a9dac2a4b9a368bc1205de
4) https://app.blocksec.com/explorer/tx/arbitrum/0x6dd01c6e9dba54dc9d6588afedca7ecb782beb0a5f130553ecd5aa036c225bab
5) https://app.blocksec.com/explorer/tx/arbitrum/0xb8f3289bf52ec4879e501862935da01642b1b02b62ec697e414c0c3052d9bb08

## Watched changes

```diff
    contract RollupProxy (0x73CA76d9B04661604fF950fB8DBc9f18F1B853f1) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
+++ description: Increments on each Validator change.
      values.setValidatorCount:
-        3
+        5
      values.stakerCount:
-        2
+        1
    }
```

Generated with discovered.json: 0xc858637d978412f3489052ed888978a1c8dbf748

# Diff at Sun, 06 Apr 2025 07:31:03 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@02dea11f7707601873600e275c4e2b7792c1a190 block: 311763335
- current block number: 323453444

## Description

Operators change, no change to implementations.

## Watched changes

```diff
    contract RollupProxy (0x73CA76d9B04661604fF950fB8DBc9f18F1B853f1) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      issuedPermissions.0.to:
-        "0xa213e1A202C49C4AC17C43Fc57aA469ebd897F40"
+        "0x26C9cC5681Dc8CfA7d0CD2F52769479b54612298"
+++ description: Increments on each Validator change.
      values.setValidatorCount:
-        1
+        3
      values.stakerCount:
-        1
+        2
      values.validators.0:
-        "0xa213e1A202C49C4AC17C43Fc57aA469ebd897F40"
+        "0x26C9cC5681Dc8CfA7d0CD2F52769479b54612298"
    }
```

```diff
    contract SequencerInbox (0xfb27e42E964F3364630F76D62EB295ae792BD4FA) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      issuedPermissions.2:
+        {"permission":"upgrade","to":"0xCa9c24bf165D375A62E62b9fb8F138E19A957Aa9","via":[{"address":"0x10083F68A4aEC72c567661616bd6036D3a6d1B36"},{"address":"0x37119EAcFBc1c83DDAf80F6705b6B19630C101C4"}]}
      issuedPermissions.1.permission:
-        "upgrade"
+        "interact"
      issuedPermissions.1.to:
-        "0xCa9c24bf165D375A62E62b9fb8F138E19A957Aa9"
+        "0x922bc2d9dd1c4fd0a08460DD8d3E29BfD5b99117"
      issuedPermissions.1.via.1:
-        {"address":"0x37119EAcFBc1c83DDAf80F6705b6B19630C101C4"}
      issuedPermissions.1.via.0:
-        {"address":"0x10083F68A4aEC72c567661616bd6036D3a6d1B36"}
      issuedPermissions.1.description:
+        "Add/remove batchPosters (Sequencers)."
      issuedPermissions.0.to:
-        "0xa91279538ADfcD8E47ec74e50Cd02d9498cD039a"
+        "0x922bc2d9dd1c4fd0a08460DD8d3E29BfD5b99117"
      values.batchPosterManager:
-        "0x0000000000000000000000000000000000000000"
+        "0x922bc2d9dd1c4fd0a08460DD8d3E29BfD5b99117"
      values.batchPosters.0:
-        "0xa91279538ADfcD8E47ec74e50Cd02d9498cD039a"
+        "0x922bc2d9dd1c4fd0a08460DD8d3E29BfD5b99117"
      values.setIsBatchPosterCount:
-        1
+        3
    }
```

Generated with discovered.json: 0x812be40299b3f77da694a3f4e7362f9e110cb4da

# Diff at Thu, 06 Mar 2025 14:23:44 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@454ef41fea41bcea030780b23fd1f11519ff78d2 block: 311763335
- current block number: 311763335

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 311763335 (main branch discovery), not current.

```diff
    contract RollupProxy (0x73CA76d9B04661604fF950fB8DBc9f18F1B853f1) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      values.isPostBoLD:
+        false
    }
```

Generated with discovered.json: 0x588536590ab8f4b8686048a4a37fab4be1acea17

# Diff at Thu, 06 Mar 2025 09:39:13 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@7119c715545bc86a4194761f42815f811ac6307a block: 311763335
- current block number: 311763335

## Description

Config related: set severity for arbitrum inbox/outbox changes to high and add historical In- and Outboxes via events.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 311763335 (main branch discovery), not current.

```diff
    contract Bridge (0xB0EC3C1368AF7d9C2CAE6B7f8E022Cc14d59D2b1) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
+++ description: All Inboxes that were ever set as allowed in the bridge.
+++ severity: HIGH
      values.inboxHistory:
+        ["0x18BB8310E3a3DF4EFcCb6B3E9AeCB8bE6d4af07f","0x8987777757a91Ed09912D7A5B8430bbAC2cf153C"]
+++ description: All Outboxes that were ever set as allowed in the bridge.
+++ severity: HIGH
      values.outboxHistory:
+        ["0xD17550876106645988051ffDd31dFc3cDaA29F9c"]
      fieldMeta:
+        {"allowedOutboxList":{"severity":"HIGH","description":"Can make calls as the bridge, steal all funds."},"outboxHistory":{"severity":"HIGH","description":"All Outboxes that were ever set as allowed in the bridge."},"allowedDelayedInboxList":{"severity":"HIGH","description":"Allowed to mint the gastoken on L2 and call `enqueueDelayedMessage()` on the bridge."},"inboxHistory":{"severity":"HIGH","description":"All Inboxes that were ever set as allowed in the bridge."}}
    }
```

Generated with discovered.json: 0xd97a06af3c8440752b7b963c7ade7b37850ea172

# Diff at Tue, 04 Mar 2025 10:40:27 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@98d260b45fe0d2195ce5e629bd7b200c8706e8ba block: 311763335
- current block number: 311763335

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 311763335 (main branch discovery), not current.

```diff
    contract UpgradeExecutor (0x10083F68A4aEC72c567661616bd6036D3a6d1B36) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      sinceBlock:
+        159001296
    }
```

```diff
    contract Inbox (0x18BB8310E3a3DF4EFcCb6B3E9AeCB8bE6d4af07f) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      sinceBlock:
+        159001296
    }
```

```diff
    contract OneStepProverHostIo (0x33c1514Bf90e202d242C299b37C60f908aa206D4) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      sinceBlock:
+        244802957
    }
```

```diff
    contract ProxyAdmin (0x37119EAcFBc1c83DDAf80F6705b6B19630C101C4) {
    +++ description: None
      sinceBlock:
+        159001296
    }
```

```diff
    contract OneStepProver0 (0x54E0923782b701044444De5d8c3A45aC890b0881) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      sinceBlock:
+        244802857
    }
```

```diff
    contract ValidatorUtils (0x6c21303F5986180B1394d2C89f3e883890E2867b) {
    +++ description: This contract implements view only utilities for validators.
      sinceBlock:
+        150599283
    }
```

```diff
    contract RollupProxy (0x73CA76d9B04661604fF950fB8DBc9f18F1B853f1) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      sinceBlock:
+        159001296
    }
```

```diff
    contract RollupEventInbox (0x8987777757a91Ed09912D7A5B8430bbAC2cf153C) {
    +++ description: Helper contract sending configuration data over the bridge during the systems initialization.
      sinceBlock:
+        159001296
    }
```

```diff
    contract Bridge (0xB0EC3C1368AF7d9C2CAE6B7f8E022Cc14d59D2b1) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      sinceBlock:
+        159001296
    }
```

```diff
    contract Outbox (0xD17550876106645988051ffDd31dFc3cDaA29F9c) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
      sinceBlock:
+        159001296
    }
```

```diff
    contract OneStepProofEntry (0xD89d54007079071cBA859127318b9F34eeB78049) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      sinceBlock:
+        244802990
    }
```

```diff
    contract OneStepProverMath (0xE58a2dEb5718F9aAF2C1DdD0E366ED076D204cc4) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      sinceBlock:
+        244802923
    }
```

```diff
    contract ChallengeManager (0xE8c7770db364e57b2A4f5344d51b7f490aE9163A) {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      sinceBlock:
+        159001296
    }
```

```diff
    contract OneStepProverMemory (0xf8E5e5562c2c12d8690786f5C9FA65F20F6bD881) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      sinceBlock:
+        244802890
    }
```

```diff
    contract SequencerInbox (0xfb27e42E964F3364630F76D62EB295ae792BD4FA) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      sinceBlock:
+        159001296
    }
```

Generated with discovered.json: 0x71a846e87d73fd70a834ebac0584c601b05a41bd

# Diff at Mon, 03 Mar 2025 09:15:50 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@f23dcb100957b0b121d62148a4d586788383af80 block: 287772645
- current block number: 311763335

## Description

Minor upgrade of SequencerInbox and Inbox contracts to new versions with minimal diff to known versions.

## Watched changes

```diff
    contract Inbox (0x18BB8310E3a3DF4EFcCb6B3E9AeCB8bE6d4af07f) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      sourceHashes.1:
-        "0x99872d99b7163c705118e0a168f99728c3c7089581779077707271cdaad30be3"
+        "0x84cd273689e720a0b7c657b57d9fb127684f3abb87fc4b337a2f0decd9464120"
      values.$implementation:
-        "0x8f6406781cC955398C45a48DcEfeEBDb2c8e2CaA"
+        "0x6C6cf18f13C3e9b969e3acE6b8F21DfF95d4D447"
      values.$pastUpgrades.1:
+        ["2025-03-03T05:22:43.000Z","0xbae64b5a7223e9cf01a270c58a776e2fed92644fe0bb85855be7a805d40008b2",["0x6C6cf18f13C3e9b969e3acE6b8F21DfF95d4D447"]]
      values.$upgradeCount:
-        1
+        2
    }
```

```diff
    contract SequencerInbox (0xfb27e42E964F3364630F76D62EB295ae792BD4FA) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      sourceHashes.1:
-        "0x50cf57b01499408fa99da27cf0fee96ec30f0d40667d1aa090c442bc80f0636b"
+        "0x6bb86ac4bd0d31e049f543fcf0a8f94c952252222f115246ef9d5b8104d803cc"
      values.$implementation:
-        "0x18ed2d5bF7c5943bFd20a2995b9879E30c9E8dDa"
+        "0x066a4D939302470Bd83F1868A1Ae2485Fe75ccF2"
      values.$pastUpgrades.2:
+        ["2025-03-03T05:22:43.000Z","0xbae64b5a7223e9cf01a270c58a776e2fed92644fe0bb85855be7a805d40008b2",["0x066a4D939302470Bd83F1868A1Ae2485Fe75ccF2"]]
      values.$upgradeCount:
-        2
+        3
    }
```

## Source code changes

```diff
.../{.flat@287772645 => .flat}/Inbox/Inbox.sol     | 52 +++++++++++++++++-----
 .../SequencerInbox/SequencerInbox.sol              | 24 +++++++---
 2 files changed, 59 insertions(+), 17 deletions(-)
```

Generated with discovered.json: 0xefe3f9bd28bef2209986d82e75019d6fe9589d2e

# Diff at Fri, 21 Feb 2025 14:12:32 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@d219f271711b2cf7a164e3443bead5e4957d13a8 block: 287772645
- current block number: 287772645

## Description

Config related: Change some severities and add templates.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 287772645 (main branch discovery), not current.

```diff
    contract UpgradeExecutor (0x10083F68A4aEC72c567661616bd6036D3a6d1B36) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      category:
+        {"name":"Governance","priority":3}
    }
```

```diff
    contract Inbox (0x18BB8310E3a3DF4EFcCb6B3E9AeCB8bE6d4af07f) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      category:
+        {"name":"Canonical Bridges","priority":2}
    }
```

```diff
    contract RollupProxy (0x73CA76d9B04661604fF950fB8DBc9f18F1B853f1) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract Bridge (0xB0EC3C1368AF7d9C2CAE6B7f8E022Cc14d59D2b1) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract Outbox (0xD17550876106645988051ffDd31dFc3cDaA29F9c) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
      category:
+        {"name":"Canonical Bridges","priority":2}
    }
```

```diff
    contract ChallengeManager (0xE8c7770db364e57b2A4f5344d51b7f490aE9163A) {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract SequencerInbox (0xfb27e42E964F3364630F76D62EB295ae792BD4FA) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

Generated with discovered.json: 0x38920c3172a22779e3add3c3466e04b32d50659f

# Diff at Tue, 04 Feb 2025 12:33:56 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@145553eed7ba44636411ecb25e4099728acd02f9 block: 287772645
- current block number: 287772645

## Description

Rename 'configure' permission to 'interact'

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 287772645 (main branch discovery), not current.

```diff
    contract UpgradeExecutor (0x10083F68A4aEC72c567661616bd6036D3a6d1B36) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      directlyReceivedPermissions.1.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract RollupProxy (0x73CA76d9B04661604fF950fB8DBc9f18F1B853f1) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      issuedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

Generated with discovered.json: 0x7d78ced168233df643cecfe0af09dc59b87871d7

# Diff at Mon, 20 Jan 2025 11:10:32 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@2c8b4f3d9910bb6371be9b4df87b70856e7d8c64 block: 287772645
- current block number: 287772645

## Description

Rerun on the same block number. Applies fixes to permissions and via field. Renames permission's target to to/from.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 287772645 (main branch discovery), not current.

```diff
    contract UpgradeExecutor (0x10083F68A4aEC72c567661616bd6036D3a6d1B36) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      issuedPermissions.0.target:
-        "0xCa9c24bf165D375A62E62b9fb8F138E19A957Aa9"
      issuedPermissions.0.via.1.delay:
-        0
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0xCa9c24bf165D375A62E62b9fb8F138E19A957Aa9"
      directlyReceivedPermissions.2.target:
-        "0x73CA76d9B04661604fF950fB8DBc9f18F1B853f1"
      directlyReceivedPermissions.2.from:
+        "0x73CA76d9B04661604fF950fB8DBc9f18F1B853f1"
      directlyReceivedPermissions.1.target:
-        "0x73CA76d9B04661604fF950fB8DBc9f18F1B853f1"
      directlyReceivedPermissions.1.from:
+        "0x73CA76d9B04661604fF950fB8DBc9f18F1B853f1"
      directlyReceivedPermissions.0.target:
-        "0x37119EAcFBc1c83DDAf80F6705b6B19630C101C4"
      directlyReceivedPermissions.0.from:
+        "0x37119EAcFBc1c83DDAf80F6705b6B19630C101C4"
    }
```

```diff
    contract Inbox (0x18BB8310E3a3DF4EFcCb6B3E9AeCB8bE6d4af07f) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      issuedPermissions.0.target:
-        "0xCa9c24bf165D375A62E62b9fb8F138E19A957Aa9"
      issuedPermissions.0.via.1.delay:
-        0
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0xCa9c24bf165D375A62E62b9fb8F138E19A957Aa9"
    }
```

```diff
    contract ProxyAdmin (0x37119EAcFBc1c83DDAf80F6705b6B19630C101C4) {
    +++ description: None
      directlyReceivedPermissions.6.target:
-        "0xfb27e42E964F3364630F76D62EB295ae792BD4FA"
      directlyReceivedPermissions.6.from:
+        "0xfb27e42E964F3364630F76D62EB295ae792BD4FA"
      directlyReceivedPermissions.5.target:
-        "0xE8c7770db364e57b2A4f5344d51b7f490aE9163A"
      directlyReceivedPermissions.5.from:
+        "0xE8c7770db364e57b2A4f5344d51b7f490aE9163A"
      directlyReceivedPermissions.4.target:
-        "0xD17550876106645988051ffDd31dFc3cDaA29F9c"
      directlyReceivedPermissions.4.from:
+        "0xD17550876106645988051ffDd31dFc3cDaA29F9c"
      directlyReceivedPermissions.3.target:
-        "0xB0EC3C1368AF7d9C2CAE6B7f8E022Cc14d59D2b1"
      directlyReceivedPermissions.3.from:
+        "0xB0EC3C1368AF7d9C2CAE6B7f8E022Cc14d59D2b1"
      directlyReceivedPermissions.2.target:
-        "0x8987777757a91Ed09912D7A5B8430bbAC2cf153C"
      directlyReceivedPermissions.2.from:
+        "0x8987777757a91Ed09912D7A5B8430bbAC2cf153C"
      directlyReceivedPermissions.1.target:
-        "0x18BB8310E3a3DF4EFcCb6B3E9AeCB8bE6d4af07f"
      directlyReceivedPermissions.1.from:
+        "0x18BB8310E3a3DF4EFcCb6B3E9AeCB8bE6d4af07f"
      directlyReceivedPermissions.0.target:
-        "0x10083F68A4aEC72c567661616bd6036D3a6d1B36"
      directlyReceivedPermissions.0.from:
+        "0x10083F68A4aEC72c567661616bd6036D3a6d1B36"
    }
```

```diff
    contract RollupProxy (0x73CA76d9B04661604fF950fB8DBc9f18F1B853f1) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      issuedPermissions.2.target:
-        "0xa213e1A202C49C4AC17C43Fc57aA469ebd897F40"
      issuedPermissions.2.to:
+        "0xa213e1A202C49C4AC17C43Fc57aA469ebd897F40"
      issuedPermissions.2.description:
+        "Can propose new state roots (called nodes) and challenge state roots on the host chain."
      issuedPermissions.1.target:
-        "0xCa9c24bf165D375A62E62b9fb8F138E19A957Aa9"
      issuedPermissions.1.via.0.delay:
-        0
      issuedPermissions.1.to:
+        "0xCa9c24bf165D375A62E62b9fb8F138E19A957Aa9"
      issuedPermissions.0.target:
-        "0xCa9c24bf165D375A62E62b9fb8F138E19A957Aa9"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.via.0.description:
-        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
      issuedPermissions.0.to:
+        "0xCa9c24bf165D375A62E62b9fb8F138E19A957Aa9"
      issuedPermissions.0.description:
+        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
    }
```

```diff
    contract RollupEventInbox (0x8987777757a91Ed09912D7A5B8430bbAC2cf153C) {
    +++ description: Helper contract sending configuration data over the bridge during the systems initialization.
      issuedPermissions.0.target:
-        "0xCa9c24bf165D375A62E62b9fb8F138E19A957Aa9"
      issuedPermissions.0.via.1.delay:
-        0
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0xCa9c24bf165D375A62E62b9fb8F138E19A957Aa9"
    }
```

```diff
    contract Bridge (0xB0EC3C1368AF7d9C2CAE6B7f8E022Cc14d59D2b1) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      issuedPermissions.0.target:
-        "0xCa9c24bf165D375A62E62b9fb8F138E19A957Aa9"
      issuedPermissions.0.via.1.delay:
-        0
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0xCa9c24bf165D375A62E62b9fb8F138E19A957Aa9"
    }
```

```diff
    contract Outbox (0xD17550876106645988051ffDd31dFc3cDaA29F9c) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
      issuedPermissions.0.target:
-        "0xCa9c24bf165D375A62E62b9fb8F138E19A957Aa9"
      issuedPermissions.0.via.1.delay:
-        0
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0xCa9c24bf165D375A62E62b9fb8F138E19A957Aa9"
    }
```

```diff
    contract ChallengeManager (0xE8c7770db364e57b2A4f5344d51b7f490aE9163A) {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      issuedPermissions.0.target:
-        "0xCa9c24bf165D375A62E62b9fb8F138E19A957Aa9"
      issuedPermissions.0.via.1.delay:
-        0
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0xCa9c24bf165D375A62E62b9fb8F138E19A957Aa9"
    }
```

```diff
    contract SequencerInbox (0xfb27e42E964F3364630F76D62EB295ae792BD4FA) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      issuedPermissions.1.target:
-        "0xCa9c24bf165D375A62E62b9fb8F138E19A957Aa9"
      issuedPermissions.1.via.1.delay:
-        0
      issuedPermissions.1.via.0.delay:
-        0
      issuedPermissions.1.to:
+        "0xCa9c24bf165D375A62E62b9fb8F138E19A957Aa9"
      issuedPermissions.0.target:
-        "0xa91279538ADfcD8E47ec74e50Cd02d9498cD039a"
      issuedPermissions.0.to:
+        "0xa91279538ADfcD8E47ec74e50Cd02d9498cD039a"
      issuedPermissions.0.description:
+        "Can submit transaction batches or commitments to the SequencerInbox contract on the host chain."
    }
```

Generated with discovered.json: 0x9e6a649da14b6bc374a767216c7649533830d309

# Diff at Wed, 08 Jan 2025 10:44:59 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@20bf0eaa1dce373e2c004314fef59d2d1bdf5502 block: 287772645
- current block number: 287772645

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 287772645 (main branch discovery), not current.

```diff
    contract Bridge (0xB0EC3C1368AF7d9C2CAE6B7f8E022Cc14d59D2b1) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      description:
-        "Escrow contract for the project's gas token (Can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging."
+        "Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging."
    }
```

Generated with discovered.json: 0x27bd9a7f1bc751713e3f219e572f72c52f375dbb

# Diff at Mon, 23 Dec 2024 12:51:43 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@18325a975c44684702f30ee366361589e4c2ed8c block: 281500429
- current block number: 287772645

## Description

Config related: Celestia-Nitro wmroot added.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 281500429 (main branch discovery), not current.

```diff
    contract RollupProxy (0x73CA76d9B04661604fF950fB8DBc9f18F1B853f1) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      usedTypes.0.arg.0xe81f986823a85105c5fd91bb53b4493d38c0c26652d23f76a7405ac889908287:
+        "Celestia Nitro 3.2.1 wasmModuleRoot"
    }
```

Generated with discovered.json: 0x9a66bc07a25b43b4c12b94cbc3b159d078b9d47e

# Diff at Thu, 05 Dec 2024 12:00:30 GMT:

- author: Piotr Szlachciak (<szlachciak.piotr@gmail.com>)
- comparing to: main@f9ded76f7930b0c86788e4c4595d553b165b87d1 block: 281500429
- current block number: 281500429

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 281500429 (main branch discovery), not current.

```diff
    contract ValidatorUtils (0x6c21303F5986180B1394d2C89f3e883890E2867b) {
    +++ description: This contract implements view only utilities for validators.
      template:
+        "orbitstack/ValidatorUtils"
      description:
+        "This contract implements view only utilities for validators."
    }
```

Generated with discovered.json: 0x44f4c1b24e8af572b96658927b1f6c9452d50a10

# Diff at Thu, 05 Dec 2024 05:54:42 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@7dc480bf5499525d0b44afce03521538ecc8ec73 block: 280604955
- current block number: 281500429

## Description

ArbOS v32 upgrade to known contracts.

## Watched changes

```diff
    contract UpgradeExecutor (0x10083F68A4aEC72c567661616bd6036D3a6d1B36) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      directlyReceivedPermissions.1.description:
-        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
+        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
    }
```

```diff
-   Status: DELETED
    contract OneStepProver0 (0x1135265fE014D3FA32B3507E325642B92aFFeAEb)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
-   Status: DELETED
    contract OneStepProverMath (0x4811500e0d376Fa8d2EA3CCb7c61E0afB4F5A7f1)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
    contract RollupProxy (0x73CA76d9B04661604fF950fB8DBc9f18F1B853f1) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      template:
-        "orbitstack/RollupProxy"
+        "orbitstack/RollupProxy_fastConfirm"
      sourceHashes.2:
-        "0xef94a66bd5339efd18fb9ca1f8031482e7ef7bbe6c5a0a10fae254ab83712406"
+        "0x7ee21b18b2e18c636bfafc08ff72692cc43302b2599ba75f0abad67282866dd5"
      sourceHashes.1:
-        "0x8b48118fe606012c0dcac2ccc1821785935aec89fab8f219f47b32c482b0017e"
+        "0x9349e73cbc2d2b818c1d79711574ba210b56249d8d3845bc78c776caf8f8ff42"
      issuedPermissions.0.via.0.description:
-        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
+        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
      values.$implementation.1:
-        "0x0aE4dD666748bF0F6dB5c149Eab1D8aD27820A6A"
+        "0x1BeD37FeDFE8B2721a69A559313D2b58d16Ecd77"
      values.$implementation.0:
-        "0xEe9E5546A11Cb5b4A86e92DA05f2ef75C26E4754"
+        "0xdD91f6e88576fEc4A38A518DA39C92e13CBB6446"
      values.$pastUpgrades.1:
+        ["2024-12-05T04:29:03.000Z","0xdaae549a35b2064e654124fc32994920b8bdd00e742f59008a9525b89c73d43d",["0xdD91f6e88576fEc4A38A518DA39C92e13CBB6446","0x1BeD37FeDFE8B2721a69A559313D2b58d16Ecd77"]]
      values.$upgradeCount:
-        1
+        2
+++ description: ArbOS version derived from known wasmModuleRoots.
      values.arbOsFromWmRoot:
-        "ArbOS v20 wasmModuleRoot"
+        "ArbOS v32 wasmModuleRoot"
+++ description: Root hash of the WASM module used for execution, like a fingerprint of the L2 logic. Can be associated with ArbOS versions.
      values.wasmModuleRoot:
-        "0x8b104a2e80ac6165dc58b9048de12f301d70b02a0ab51396c22b4b4b802a16a4"
+        "0x184884e1eb9fefdc158f6c8ac912bb183bf3cf83f0090317e0bc4ac5860baa39"
      values.anyTrustFastConfirmer:
+        "0x0000000000000000000000000000000000000000"
    }
```

```diff
-   Status: DELETED
    contract OneStepProverHostIo (0x89AF7C4C2198c426cFe6E86de0680A0850503e06)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
-   Status: DELETED
    contract OneStepProofEntry (0x99a2A31300816C1FA3f40818AC9280fe7271F878)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
-   Status: DELETED
    contract OneStepProverMemory (0xDf94F0474F205D086dbc2e66D69a856FCf520622)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
    contract ChallengeManager (0xE8c7770db364e57b2A4f5344d51b7f490aE9163A) {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      sourceHashes.1:
-        "0x7e1cd1e10119e118ffaa576ddbe1c0f9810a0859a4bf2f65a4ff596c0ed4183d"
+        "0x1a095768302d7d1c3d02375eaa3341833b4f1aaac707e1c608bce478c87cbf27"
      values.$implementation:
-        "0x09824fe72BFF474d16D9c2774432E381BBD60662"
+        "0x5AA806015FEC88669bF7DAd746BB4ADC1E79BcED"
      values.$pastUpgrades.2:
+        ["2024-12-05T04:29:03.000Z","0xdaae549a35b2064e654124fc32994920b8bdd00e742f59008a9525b89c73d43d",["0x5AA806015FEC88669bF7DAd746BB4ADC1E79BcED"]]
      values.$pastUpgrades.1:
+        ["2024-12-05T02:15:22.000Z","0x8a0aa7e1ead9754bdbb27cba33355e9af40b996a929c359b5d9eefc4ff193649",["0x5cA988F213EfbCB86ED7e2AACB0C15c91e648f8d"]]
      values.$upgradeCount:
-        1
+        3
      values.osp:
-        "0x99a2A31300816C1FA3f40818AC9280fe7271F878"
+        "0xD89d54007079071cBA859127318b9F34eeB78049"
    }
```

```diff
    contract SequencerInbox (0xfb27e42E964F3364630F76D62EB295ae792BD4FA) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      sourceHashes.1:
-        "0x08792f333db7e8a060c38033f92e3fc10c30e2648c56fc49c7460ee1c94343a0"
+        "0x50cf57b01499408fa99da27cf0fee96ec30f0d40667d1aa090c442bc80f0636b"
      values.$implementation:
-        "0x1c6ACCd9d66f3B993928E7439c9A2d67b94a445F"
+        "0x18ed2d5bF7c5943bFd20a2995b9879E30c9E8dDa"
      values.$pastUpgrades.1:
+        ["2024-12-05T02:15:22.000Z","0x8a0aa7e1ead9754bdbb27cba33355e9af40b996a929c359b5d9eefc4ff193649",["0x18ed2d5bF7c5943bFd20a2995b9879E30c9E8dDa"]]
      values.$upgradeCount:
-        1
+        2
      values.batchPosterManager:
+        "0x0000000000000000000000000000000000000000"
      values.BROTLI_MESSAGE_HEADER_FLAG:
+        "0x00"
      values.DAS_MESSAGE_HEADER_FLAG:
+        "0x80"
      values.DATA_BLOB_HEADER_FLAG:
+        "0x50"
      values.isUsingFeeToken:
+        false
      values.reader4844:
+        "0x0000000000000000000000000000000000000000"
      values.TREE_DAS_MESSAGE_HEADER_FLAG:
+        "0x08"
      values.ZERO_HEAVY_MESSAGE_HEADER_FLAG:
+        "0x20"
    }
```

```diff
+   Status: CREATED
    contract OneStepProverHostIo (0x33c1514Bf90e202d242C299b37C60f908aa206D4)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract OneStepProver0 (0x54E0923782b701044444De5d8c3A45aC890b0881)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract OneStepProofEntry (0xD89d54007079071cBA859127318b9F34eeB78049)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract OneStepProverMath (0xE58a2dEb5718F9aAF2C1DdD0E366ED076D204cc4)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract OneStepProverMemory (0xf8E5e5562c2c12d8690786f5C9FA65F20F6bD881)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

## Source code changes

```diff
.../ChallengeManager/ChallengeManager.sol          | 404 ++++++---
 .../OneStepProofEntry.sol                          | 485 ++++++++--
 .../{.flat@280604955 => .flat}/OneStepProver0.sol  | 765 +++++++++++-----
 .../OneStepProverHostIo.sol                        | 999 +++++++++++++++++----
 .../OneStepProverMath.sol                          |  65 +-
 .../OneStepProverMemory.sol                        | 315 +++++--
 .../RollupProxy/RollupAdminLogic.1.sol             | 370 +++++---
 .../RollupProxy/RollupUserLogic.2.sol              | 415 ++++++---
 .../SequencerInbox/SequencerInbox.sol              | 662 ++++++++++----
 9 files changed, 3374 insertions(+), 1106 deletions(-)
```

Generated with discovered.json: 0x3045a66e02138f41fe484915d98e2223fb801650

# Diff at Mon, 02 Dec 2024 15:21:12 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- current block number: 280604955

## Description

Initial discovery of a standard orbit stack L3 with EOA admin.

## Initial discovery

```diff
+   Status: CREATED
    contract UpgradeExecutor (0x10083F68A4aEC72c567661616bd6036D3a6d1B36)
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
```

```diff
+   Status: CREATED
    contract OneStepProver0 (0x1135265fE014D3FA32B3507E325642B92aFFeAEb)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract Inbox (0x18BB8310E3a3DF4EFcCb6B3E9AeCB8bE6d4af07f)
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x37119EAcFBc1c83DDAf80F6705b6B19630C101C4)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProverMath (0x4811500e0d376Fa8d2EA3CCb7c61E0afB4F5A7f1)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract ValidatorUtils (0x6c21303F5986180B1394d2C89f3e883890E2867b)
    +++ description: None
```

```diff
+   Status: CREATED
    contract RollupProxy (0x73CA76d9B04661604fF950fB8DBc9f18F1B853f1)
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
```

```diff
+   Status: CREATED
    contract RollupEventInbox (0x8987777757a91Ed09912D7A5B8430bbAC2cf153C)
    +++ description: Helper contract sending configuration data over the bridge during the systems initialization.
```

```diff
+   Status: CREATED
    contract OneStepProverHostIo (0x89AF7C4C2198c426cFe6E86de0680A0850503e06)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract OneStepProofEntry (0x99a2A31300816C1FA3f40818AC9280fe7271F878)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract Bridge (0xB0EC3C1368AF7d9C2CAE6B7f8E022Cc14d59D2b1)
    +++ description: Escrow contract for the project's gas token (Can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
```

```diff
+   Status: CREATED
    contract Outbox (0xD17550876106645988051ffDd31dFc3cDaA29F9c)
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
```

```diff
+   Status: CREATED
    contract OneStepProverMemory (0xDf94F0474F205D086dbc2e66D69a856FCf520622)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract ChallengeManager (0xE8c7770db364e57b2A4f5344d51b7f490aE9163A)
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
```

```diff
+   Status: CREATED
    contract SequencerInbox (0xfb27e42E964F3364630F76D62EB295ae792BD4FA)
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
```
