Generated with discovered.json: 0x0edcbdd175b97519c9b69c1bab42b214245cd663

# Diff at Fri, 08 May 2026 07:51:15 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@488d190650457a1fba9b18a83f14a17ab8b2c84c block: 1772656885
- current timestamp: 1772656885

## Description

Use the new flattener implementation

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1772656885 (main branch discovery), not current.

```diff
    contract OneStepProverMemory (arb1:0x09fDA6447fA7758EA9245ac78Ca3c9ba68CBfd3d) [orbitstack/OneStepProverMemory] {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      sourceHashes.0:
-        "0x3955092d1dbd80f0910d7782a25da1e3da45533c7890928a1c6c63cbf5def5bf"
+        "0xa163417851e926098130f55736a5b43084164e0070f9647198131e57b45a947d"
    }
```

```diff
    contract ChallengeManager (arb1:0x3131627362AD79b3D831559E0AfC986BF60A6870) [orbitstack/ChallengeManager] {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      sourceHashes.1:
-        "0x1a095768302d7d1c3d02375eaa3341833b4f1aaac707e1c608bce478c87cbf27"
+        "0x8a2753d8b3f1ce86250bd4a4e7e502d04dd36a5a670b519b7510af6b33618693"
    }
```

```diff
    contract SequencerInbox (arb1:0x38d41Ac2fbc3f13FcA7838F6638D8FbDb189e807) [orbitstack/SequencerInbox] {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      sourceHashes.1:
-        "0x6bb86ac4bd0d31e049f543fcf0a8f94c952252222f115246ef9d5b8104d803cc"
+        "0x38fab1c44903c11839e1113e339b7268b07f99808721133182f57fdd891be63a"
    }
```

```diff
    contract OneStepProverHostIo (arb1:0x3930AD9a21dA38E63d52B43b0c530CB0AACcB389) [orbitstack/OneStepProverHostIo] {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      sourceHashes.0:
-        "0x2e969e0e83aea53307795f6826413e39bb416a64bc6da18f3a339ffeef444d32"
+        "0xd64745a0edbb2ada69b81d849f2737d7c082d18ca14a715c23c4165e4eecc637"
    }
```

```diff
    contract Outbox (arb1:0x39919941b42DAb335d9924Ef56dF7b9813b2D6d9) [orbitstack/Outbox] {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
      sourceHashes.1:
-        "0xfc1c087eedce3e4be0593d2e01fcd357b4980c69e03399574b4606e4f3b9ee04"
+        "0xb9f7bc73978fab23b0df754fac230d706fee0d774d97b8533b62b3014d5561a8"
    }
```

```diff
    contract Inbox (arb1:0x446626827f14F89B38D5bA1ab152B484cd7912fD) [orbitstack/Inbox] {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      sourceHashes.1:
-        "0x25984fdfffb8141859c99299fb29e7a7460732d77111e5fe23792baa99f336a3"
+        "0xb33f29d585cf178f81b64440ee9a3c598cd398ad18d2b3c6dc6c711eaf63d5e4"
    }
```

```diff
    contract SafeL2 (arb1:0x871e290d5447b958131F6d44f915F10032436ee6) [GnosisSafe] {
    +++ description: None
      sourceHashes.1:
-        "0x618c83d2fbbe19fd6f2d6ee6ee79a60e6206e48bf361eaf4812e1c1fc14b4527"
+        "0x076f4dffc7979344d7d248e876b1a947d75ebdf18b5746e3e2305d62eab1ab05"
    }
```

```diff
    contract ValidatorUtils (arb1:0xa0d6E6b1B950aCC748B45F3419FeAd4b52f7389A) [orbitstack/ValidatorUtils] {
    +++ description: This contract implements view only utilities for validators.
      sourceHashes.0:
-        "0xd9b36ec321be937cc727b5bdb0afa0e1a0a28448ef1a202d4f181a01ce57bdc8"
+        "0xebcd95194086ae9c3b9095578172a3192d9d209e5b159956f1d266910d248334"
    }
```

```diff
    contract OneStepProofEntry (arb1:0xA6D1cE7210353E431CE79f41BcFA9Ea3Ae507b98) [orbitstack/OneStepProofEntry] {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      sourceHashes.0:
-        "0x96f85480073b58d0e985cd6c68956f4a52f5ed8b2ce751b18868e2e830be3678"
+        "0xb926f057e4fad7ff5b169aeec58691133fd46de25932d8356d3dc28e4e793d3a"
    }
```

```diff
    contract Bridge (arb1:0xA9F4ee72439afC704db48dc049CbFb7E914aD300) [orbitstack/Bridge] {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      sourceHashes.1:
-        "0x73087d4667e81f676a10708feb2774bab3a9a558a1987b8ac4f112cc464bba96"
+        "0x4c274427254eb8042a8e9148268a82f423f009b03cb95a03301576bd2019277d"
    }
```

```diff
    contract RollupProxy (arb1:0xc930fd48846e956b308f28524dA2d5E14c832e33) [orbitstack/RollupProxy_fastConfirm] {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      sourceHashes.0:
-        "0xb8da0b3748daac768860783e8555198fd2d1bbdffb775b81557a7124890c7eca"
+        "0xb739f8156f36efd1dca81c7048413241da1e5bf4a5f98001523a474136b8defd"
      sourceHashes.1:
-        "0x86c7032e0f4b5468f1eb92c79b73ab4c7f053fc7bdfc88fdd360e2fe7baa1072"
+        "0x689a6510e734cb5e6032f5fca6ce6cb72b6e3af01d74b228d9d2cfd926a25b66"
    }
```

```diff
    contract UpgradeExecutor (arb1:0xcD3D1CFE5e0cDa77D0a2D1ac1c0268C77115f89D) [orbitstack/UpgradeExecutor] {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      sourceHashes.1:
-        "0xa7ff878cfd433a428d567d3b90fe1df400a048a1af5298f22cd4cd4fc25bdecd"
+        "0x11607080f3c3b6b77778e75183e140bfe8604333e71de324adebee0f02b9dbcc"
    }
```

```diff
    contract OneStepProverMath (arb1:0xD3dE403eADdf791104918E9C9336B434AE7DDA01) [orbitstack/OneStepProverMath] {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      sourceHashes.0:
-        "0x3de1ddc210fe283d7298c5f06879df577c6a475329a206b1928c74d10db656d5"
+        "0xd38b92884347e76d4ce463bc343cbf508eefb150146ed51cb80c2aee8c565122"
    }
```

```diff
    contract OneStepProver0 (arb1:0xF5f5bc097ca8f4bE96D8CdE86c96Bd2d81fd2585) [orbitstack/OneStepProver0] {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      sourceHashes.0:
-        "0x642d283934aef1189cf62e1bcd34a5081762b33fdd3ec8e823f304f874e48748"
+        "0xdec29538ea8b9a7f83edc119a9fbd3761ab24c5e0b512ecfdecc46dcdefccdc1"
    }
```

Generated with discovered.json: 0xb37134c681410eb6ab7be0d90dff0f9d3846a7c2

# Diff at Tue, 05 May 2026 10:22:06 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@b6437082b3ea8fb0d97f4474b1c3452a1ce271b0 block: 1772656885
- current timestamp: 1772656885

## Description

Include deployer address

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1772656885 (main branch discovery), not current.

```diff
    contract OneStepProverMemory (arb1:0x09fDA6447fA7758EA9245ac78Ca3c9ba68CBfd3d) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      deployerAddress:
+        "arb1:0xa4b1cd457E5635b64eBc8c5be3a1cA7543F7984D"
    }
```

```diff
    contract ChallengeManager (arb1:0x3131627362AD79b3D831559E0AfC986BF60A6870) {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      deployerAddress:
+        "arb1:0xe5e3eEC4c5F443B04C5c883384674FD9e3eA93D9"
    }
```

```diff
    contract SequencerInbox (arb1:0x38d41Ac2fbc3f13FcA7838F6638D8FbDb189e807) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      deployerAddress:
+        "arb1:0xe5e3eEC4c5F443B04C5c883384674FD9e3eA93D9"
    }
```

```diff
    contract OneStepProverHostIo (arb1:0x3930AD9a21dA38E63d52B43b0c530CB0AACcB389) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      deployerAddress:
+        "arb1:0xa4b1cd457E5635b64eBc8c5be3a1cA7543F7984D"
    }
```

```diff
    contract Outbox (arb1:0x39919941b42DAb335d9924Ef56dF7b9813b2D6d9) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
      deployerAddress:
+        "arb1:0xe5e3eEC4c5F443B04C5c883384674FD9e3eA93D9"
    }
```

```diff
    contract Inbox (arb1:0x446626827f14F89B38D5bA1ab152B484cd7912fD) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      deployerAddress:
+        "arb1:0xe5e3eEC4c5F443B04C5c883384674FD9e3eA93D9"
    }
```

```diff
    contract SafeL2 (arb1:0x871e290d5447b958131F6d44f915F10032436ee6) {
    +++ description: None
      deployerAddress:
+        "arb1:0xB3aA47edBc9A1178B56bB55D1a9E3821845870e8"
    }
```

```diff
    contract ProxyAdmin (arb1:0x8D9e5bB33Da252739780e3df5F9E686fd11E0536) {
    +++ description: None
      deployerAddress:
+        "arb1:0xe5e3eEC4c5F443B04C5c883384674FD9e3eA93D9"
    }
```

```diff
    contract ValidatorUtils (arb1:0xa0d6E6b1B950aCC748B45F3419FeAd4b52f7389A) {
    +++ description: This contract implements view only utilities for validators.
      deployerAddress:
+        "arb1:0xa4b1cd457E5635b64eBc8c5be3a1cA7543F7984D"
    }
```

```diff
    contract OneStepProofEntry (arb1:0xA6D1cE7210353E431CE79f41BcFA9Ea3Ae507b98) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      deployerAddress:
+        "arb1:0xa4b1cd457E5635b64eBc8c5be3a1cA7543F7984D"
    }
```

```diff
    contract Bridge (arb1:0xA9F4ee72439afC704db48dc049CbFb7E914aD300) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      deployerAddress:
+        "arb1:0xe5e3eEC4c5F443B04C5c883384674FD9e3eA93D9"
    }
```

```diff
    contract RollupEventInbox (arb1:0xAc9348017885a132F1A0614B508F632A56B90ec4) {
    +++ description: Helper contract sending configuration data over the bridge during the systems initialization.
      deployerAddress:
+        "arb1:0xe5e3eEC4c5F443B04C5c883384674FD9e3eA93D9"
    }
```

```diff
    contract RollupProxy (arb1:0xc930fd48846e956b308f28524dA2d5E14c832e33) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      deployerAddress:
+        "arb1:0xe5e3eEC4c5F443B04C5c883384674FD9e3eA93D9"
    }
```

```diff
    contract UpgradeExecutor (arb1:0xcD3D1CFE5e0cDa77D0a2D1ac1c0268C77115f89D) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      deployerAddress:
+        "arb1:0xe5e3eEC4c5F443B04C5c883384674FD9e3eA93D9"
    }
```

```diff
    contract OneStepProverMath (arb1:0xD3dE403eADdf791104918E9C9336B434AE7DDA01) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      deployerAddress:
+        "arb1:0xa4b1cd457E5635b64eBc8c5be3a1cA7543F7984D"
    }
```

```diff
    contract OneStepProver0 (arb1:0xF5f5bc097ca8f4bE96D8CdE86c96Bd2d81fd2585) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      deployerAddress:
+        "arb1:0xa4b1cd457E5635b64eBc8c5be3a1cA7543F7984D"
    }
```

Generated with discovered.json: 0xbbf3beb4e0d5a8ac6fbed920b8f7565305d3f41e

# Diff at Wed, 04 Mar 2026 20:42:56 GMT:

- author: vincfurc (<vincfurc@users.noreply.github.com>)
- comparing to: main@1f42a041d14cb36a5f8712dbec0c3046cea37573 block: 1767802188
- current timestamp: 1772656885

## Description

One member of SafeL2 (AlchemyMultisig2) was rotated: 0xA351...700a replaced by 0x04a2...7Bd.

## Watched changes

```diff
    contract SafeL2 (arb1:0x871e290d5447b958131F6d44f915F10032436ee6) {
    +++ description: None
      values.$members.5:
-        "arb1:0xA351A874b48dCEdf1883dD4F4049bE3d9923700a"
+        "arb1:0x04a25F65200E56EAd142652b7E5eF372E169F2Bd"
    }
```

Generated with discovered.json: 0x95afca38de1bef98fa2e27b1c756532ffbda25cc

# Diff at Wed, 07 Jan 2026 16:10:53 GMT:

- author: vincfurc (<vincfurc@users.noreply.github.com>)
- comparing to: main@b319218f320edec871f10dbd490519684995e58e block: 1761914121
- current timestamp: 1767802188

## Description

Inbox and SequencerInbox upgrade:
- 7702 adjustments

## Watched changes

```diff
    contract SequencerInbox (arb1:0x38d41Ac2fbc3f13FcA7838F6638D8FbDb189e807) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      sourceHashes.1:
-        "0x50cf57b01499408fa99da27cf0fee96ec30f0d40667d1aa090c442bc80f0636b"
+        "0x6bb86ac4bd0d31e049f543fcf0a8f94c952252222f115246ef9d5b8104d803cc"
      values.$implementation:
-        "arb1:0x3De02cf69192f4805edE47d7fA5efa614c5A6593"
+        "arb1:0x7be08B013de2b23a6329De51C4994f841dcE1a10"
      values.$pastUpgrades.1:
+        ["2026-01-06T14:31:59.000Z","0x6ba75dc2936bc08617505e2a1abc4d117e98fc03707dbce6a598331ae6e21e7c",["arb1:0x7be08B013de2b23a6329De51C4994f841dcE1a10"]]
      values.$upgradeCount:
-        1
+        2
      implementationNames.arb1:0x3De02cf69192f4805edE47d7fA5efa614c5A6593:
-        "SequencerInbox"
      implementationNames.arb1:0x7be08B013de2b23a6329De51C4994f841dcE1a10:
+        "SequencerInbox"
    }
```

```diff
    contract Inbox (arb1:0x446626827f14F89B38D5bA1ab152B484cd7912fD) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      sourceHashes.1:
-        "0xb2c117c2e00734a82fe4ab27d5fe91a6e152c06bbcdbf83db021ad32b6be3e60"
+        "0x25984fdfffb8141859c99299fb29e7a7460732d77111e5fe23792baa99f336a3"
      values.$implementation:
-        "arb1:0x0f728dd0217E26120A304B3Fa554C3Ba2b2aF535"
+        "arb1:0xD87f160f8c414d834cBDd9477c3D8c3ad1802255"
      values.$pastUpgrades.1:
+        ["2026-01-06T14:31:59.000Z","0x6ba75dc2936bc08617505e2a1abc4d117e98fc03707dbce6a598331ae6e21e7c",["arb1:0xD87f160f8c414d834cBDd9477c3D8c3ad1802255"]]
      values.$upgradeCount:
-        1
+        2
      implementationNames.arb1:0x0f728dd0217E26120A304B3Fa554C3Ba2b2aF535:
-        "ERC20Inbox"
      implementationNames.arb1:0xD87f160f8c414d834cBDd9477c3D8c3ad1802255:
+        "ERC20Inbox"
    }
```

## Source code changes

```diff
.../Inbox/ERC20Inbox.sol                           | 16 +++++++++++++--
 .../SequencerInbox/SequencerInbox.sol              | 24 +++++++++++++++-------
 2 files changed, 31 insertions(+), 9 deletions(-)
```

Generated with discovered.json: 0xa5fc21cc15e92c13dcd4fb27c46c67ac71f02400

# Diff at Mon, 05 Jan 2026 17:44:13 GMT:

- author: vincfurc (<vincfurc@users.noreply.github.com>)
- comparing to: main@c679543996c33dd4145a38ea0d7fccd3b24d8951 block: 1761914121
- current timestamp: 1761914121

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1761914121 (main branch discovery), not current.

```diff
    contract RollupProxy (arb1:0xc930fd48846e956b308f28524dA2d5E14c832e33) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      usedTypes.0.arg.0x8a7513bf7bb3e3db04b0d982d0e973bcf57bf8b88aef7c6d03dba3a81a56a499:
+        "ArbOS v51 wasmModuleRoot"
    }
```

Generated with discovered.json: 0x51b011ebb00a1871d1aada8630291abf104dfc63

# Diff at Fri, 31 Oct 2025 13:06:21 GMT:

- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- current timestamp: 1761914121

## Description

First discovery.

## Initial discovery

```diff
+   Status: CREATED
    contract OneStepProverMemory (arb1:0x09fDA6447fA7758EA9245ac78Ca3c9ba68CBfd3d)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract ChallengeManager (arb1:0x3131627362AD79b3D831559E0AfC986BF60A6870)
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
```

```diff
+   Status: CREATED
    contract SequencerInbox (arb1:0x38d41Ac2fbc3f13FcA7838F6638D8FbDb189e807)
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
```

```diff
+   Status: CREATED
    contract OneStepProverHostIo (arb1:0x3930AD9a21dA38E63d52B43b0c530CB0AACcB389)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract Outbox (arb1:0x39919941b42DAb335d9924Ef56dF7b9813b2D6d9)
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
```

```diff
+   Status: CREATED
    contract Inbox (arb1:0x446626827f14F89B38D5bA1ab152B484cd7912fD)
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
```

```diff
+   Status: CREATED
    contract SafeL2 (arb1:0x871e290d5447b958131F6d44f915F10032436ee6)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyAdmin (arb1:0x8D9e5bB33Da252739780e3df5F9E686fd11E0536)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ValidatorUtils (arb1:0xa0d6E6b1B950aCC748B45F3419FeAd4b52f7389A)
    +++ description: This contract implements view only utilities for validators.
```

```diff
+   Status: CREATED
    contract OneStepProofEntry (arb1:0xA6D1cE7210353E431CE79f41BcFA9Ea3Ae507b98)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract Bridge (arb1:0xA9F4ee72439afC704db48dc049CbFb7E914aD300)
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
```

```diff
+   Status: CREATED
    contract RollupEventInbox (arb1:0xAc9348017885a132F1A0614B508F632A56B90ec4)
    +++ description: Helper contract sending configuration data over the bridge during the systems initialization.
```

```diff
+   Status: CREATED
    contract RollupProxy (arb1:0xc930fd48846e956b308f28524dA2d5E14c832e33)
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
```

```diff
+   Status: CREATED
    contract UpgradeExecutor (arb1:0xcD3D1CFE5e0cDa77D0a2D1ac1c0268C77115f89D)
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
```

```diff
+   Status: CREATED
    contract OneStepProverMath (arb1:0xD3dE403eADdf791104918E9C9336B434AE7DDA01)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract OneStepProver0 (arb1:0xF5f5bc097ca8f4bE96D8CdE86c96Bd2d81fd2585)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```
