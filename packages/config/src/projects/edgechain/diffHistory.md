Generated with discovered.json: 0x772e279c4fd5af0cda2b523b83fcfb4bb2fb7980

# Diff at Thu, 11 Jun 2026 11:24:25 GMT:

- author: vincfurc (<vincfurc@users.noreply.github.com>)
- comparing to: main@91b2eba1ff9c1c8341d0eaf6594dac4179405ef6 block: 1780398259
- current timestamp: 1781176973

## Description

RollupProxy `wasmModuleRoot` updated to ArbOS v51.1.

## Watched changes

```diff
    contract RollupProxy (arb1:0x14FdC47483e79d5A76599a74A2D622DA1cf97BBF) [orbitstack/RollupProxy_fastConfirm] {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
+++ description: ArbOS version derived from known wasmModuleRoots.
      values.arbOsFromWmRoot:
-        "ArbOS v40 wasmModuleRoot"
+        "ArbOS v51.1 wasmModuleRoot"
+++ description: Root hash of the WASM module used for execution, like a fingerprint of the L2 logic. Can be associated with ArbOS versions.
      values.wasmModuleRoot:
-        "0xdb698a2576298f25448bc092e52cf13b1e24141c997135d70f217d674bbeb69a"
+        "0xc2c02df561d4afaf9a1d6785f70098ec3874765c638e3cb6dbe8d3c83333e14c"
    }
```

Generated with discovered.json: 0xc20a98d52ec760bca1b9aa10d6b38fe82e79198c

# Diff at Tue, 09 Jun 2026 12:43:33 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@ae67a38d37457ad735e5d55080d2e5479d5df7dc block: 1780398259
- current timestamp: 1780398259

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1780398259 (main branch discovery), not current.

```diff
    EOA  (arb1:0x3f90c4913621e6758eB8767EA934FCa59ae5Dee8) {
    +++ description: None
      receivedPermissions.0.permission:
-        "fastconfirm"
+        "interact"
      receivedPermissions.1.permission:
-        "validate"
+        "interact"
      receivedPermissions.2.permission:
-        "validate"
+        "interact"
      receivedPermissions.3.permission:
-        "validate"
+        "interact"
    }
```

```diff
    contract GnosisSafeL2 (arb1:0x42124A2E725E6458701b8Ef46B78Db55827fA836) [GnosisSafe] {
    +++ description: None
      directlyReceivedPermissions.0.permission:
-        "fastconfirm"
+        "interact"
      directlyReceivedPermissions.1.permission:
-        "validate"
+        "interact"
    }
```

```diff
    EOA  (arb1:0x9f787F6e07469BBA84f0BE488c42eDC4c766cC83) {
    +++ description: None
      receivedPermissions.0.permission:
-        "sequence"
+        "interact"
    }
```

```diff
    contract GnosisSafeL2 (arb1:0xDbB10Cdb2F0611C311E7D7057794a690E7872005) [GnosisSafe] {
    +++ description: None
      directlyReceivedPermissions.0.permission:
-        "validate"
+        "interact"
    }
```

Generated with discovered.json: 0x4c9d53d834194bbc9004513c884d4ecb0e052b6b

# Diff at Tue, 02 Jun 2026 11:05:54 GMT:

- author: vincfurc (<vincfurc@users.noreply.github.com>)
- comparing to: main@8ad83b88dd9180e282e419267cebe10e93daf01d block: 1779198854
- current timestamp: 1780398259

## Description

SequencerInbox DAC keyset grew 3 → 5 members; threshold unchanged at 2, so committee shifted 2-of-3 → 2-of-5.

## Watched changes

```diff
    contract SequencerInbox (arb1:0xe44B83D8a3A86994043C809E29B723a44FAEE479) [orbitstack/SequencerInbox] {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      values.dacKeyset.membersCount:
-        3
+        5
      values.dacKeyset.blsSignatures.3:
+        "YA8PdhR9G6EFhblLWymAJ931fvjjb4tOk4a377DXogOfYChxbQETJT3GBYtAvIMmlRUujXEY4uCXjmv5toOcVoDkU4w1wYSvoK3r441hwJw7pG+R+aeGUINtROsxI9sqwhiafKADPPdxLy80mUTK5oIaPztF7RG2WhKMFNK7Ebjsrn4si90qAKRIt7sfneEO4wdeuC5erBen3tLJ7lE32uCi13sEJZYU7UKfr2cwoDQSZyvYePb2KX9U3bHhTpXBbwGKg2pIUGZ5g5GiOuV42wdbfqMjrsOZiLuMbgyYfVl3OOUpDUPGZyupZdGvkzk0rhGY/O/dF1Pv+BCcuX9qUCldfrFYiAvWqYcny+5xKXSQLSlU9cBdTePXy/dotyR7vA=="
      values.dacKeyset.blsSignatures.4:
+        "YBP6/hdXzakIwPZ68/ORUMDJcuhMwQr/C9anzOd5pbWBokbORN1nrEGAOJMmRfLLtRdcABs+DNEopeD4JnwdzbB5e3pHjqqhJvFJzPQ+Rvvo3uPhbECR/Ptf0Umd35mD+AQPB0rLQbAngxs8tNUnS6IllQIW/FeEGm3LwjZ32m+D08Vh5rgqMKWOpGk/Op4sIhGP3Ishpq6yC/kd+GVSDj+vc30oOuNzVtsuAGMTTy8SmlNR47eVX9eMW9bEWIk65QCAaO4T5EqH5IWNKmWZI0Q0yGSHgvslmUZHApw2vIXn0rrzc5DwyUcgn3XZz2H5vhUXvV95qFARTQ9V7SDIXr134ixoaAmhEHqeav9vhlVZE13e9ghd5iNr6BZQn7SrpQ=="
      values.keySetUpdates:
-        1
+        2
    }
```

Generated with discovered.json: 0x486adf499f2bef2ac4caadaece48b8cab420a301

# Diff at Fri, 22 May 2026 15:41:47 GMT:

- author: vincfurc (<vincfurc@users.noreply.github.com>)
- comparing to: main@1b7024bc804124af9b25421eca5fac952454cb09 block: 1779198854
- current timestamp: 1779198854

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1779198854 (main branch discovery), not current.

```diff
    contract RollupProxy (arb1:0x14FdC47483e79d5A76599a74A2D622DA1cf97BBF) [orbitstack/RollupProxy_fastConfirm] {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      usedTypes.0.arg.0xc2c02df561d4afaf9a1d6785f70098ec3874765c638e3cb6dbe8d3c83333e14c:
+        "ArbOS v51.1 wasmModuleRoot"
    }
```

Generated with discovered.json: 0xdebe3f1eeae26f719735b4e402d4eecdca41445e

# Diff at Tue, 19 May 2026 13:55:18 GMT:

- author: vincfurc (<vincfurc@users.noreply.github.com>)
- comparing to: main@307f5c3dfdab6a4f88448861a0bb75f0043b762b block: 1773325467
- current timestamp: 1779198854

## Description

UpgradeExecutor: one of two `EXECUTOR_ROLE` members removed. `arb1:0x871e290d5447b958131F6d44f915F10032436ee6` remains as the sole executor.

## Watched changes

```diff
    contract UpgradeExecutor (arb1:0xabf2650D259213d6b3E1bC46Fc1eDb7405d48Fdf) [orbitstack/UpgradeExecutor] {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      values.accessControl.EXECUTOR_ROLE.members.0:
-        "arb1:0xc2507E8d43AE685fd1e98805bc96C6d31bBB5c28"
      values.executors.0:
-        "arb1:0xc2507E8d43AE685fd1e98805bc96C6d31bBB5c28"
    }
```

Generated with discovered.json: 0x44ba260c9085210d27ab4d1157ae9ed9db316391

# Diff at Fri, 15 May 2026 12:35:50 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@a5152b9ba7ad7f85f2af3d814f74630fcaa7c917 block: 1773325467
- current timestamp: 1773325467

## Description

Shape hashes update after flattener improvements

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1773325467 (main branch discovery), not current.

```diff
    contract OneStepProverMemory (arb1:0x09fDA6447fA7758EA9245ac78Ca3c9ba68CBfd3d) [orbitstack/OneStepProverMemory] {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      sourceHashes.0:
-        "0xa163417851e926098130f55736a5b43084164e0070f9647198131e57b45a947d"
+        "0x9e22e05e7953684e6f00507684bb902908d6d4383b2e82ecdce789027bebc33a"
    }
```

```diff
    contract RollupProxy (arb1:0x14FdC47483e79d5A76599a74A2D622DA1cf97BBF) [orbitstack/RollupProxy_fastConfirm] {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      sourceHashes.1:
-        "0x689a6510e734cb5e6032f5fca6ce6cb72b6e3af01d74b228d9d2cfd926a25b66"
+        "0x6639f412df425cd0592b0ca4cf5e4ad9d39436f0e7255e83726bb7ac6a9e37b4"
    }
```

```diff
    contract OneStepProverHostIo (arb1:0x3930AD9a21dA38E63d52B43b0c530CB0AACcB389) [orbitstack/OneStepProverHostIo] {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      sourceHashes.0:
-        "0xd64745a0edbb2ada69b81d849f2737d7c082d18ca14a715c23c4165e4eecc637"
+        "0x081875b93df655e91ec23245390ad21db0990c12125dad497f1cbf118501ccc2"
    }
```

```diff
    contract OneStepProofEntry (arb1:0xA6D1cE7210353E431CE79f41BcFA9Ea3Ae507b98) [orbitstack/OneStepProofEntry] {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      sourceHashes.0:
-        "0xb926f057e4fad7ff5b169aeec58691133fd46de25932d8356d3dc28e4e793d3a"
+        "0x294155e99018f1d390be420f29ef940f9843f3ce54ed4e515d998653e2ce4293"
    }
```

```diff
    contract ChallengeManager (arb1:0xACAec98D879E39d83a30F914A36bf4877424D04f) [orbitstack/ChallengeManager] {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      sourceHashes.1:
-        "0x8a2753d8b3f1ce86250bd4a4e7e502d04dd36a5a670b519b7510af6b33618693"
+        "0x1eba00857f5477dbcd075b48ce8af9c74d5cb4f93a5e714dd27b3df498737e54"
    }
```

```diff
    contract OneStepProver0 (arb1:0xF5f5bc097ca8f4bE96D8CdE86c96Bd2d81fd2585) [orbitstack/OneStepProver0] {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      sourceHashes.0:
-        "0xdec29538ea8b9a7f83edc119a9fbd3761ab24c5e0b512ecfdecc46dcdefccdc1"
+        "0x063a1b3c4451e69f827acd833c42e986c2c617bfaabb13884fb438185b192407"
    }
```

Generated with discovered.json: 0x301903fd0790a03feae2108a92a473dac9809118

# Diff at Fri, 08 May 2026 07:51:16 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@488d190650457a1fba9b18a83f14a17ab8b2c84c block: 1773325467
- current timestamp: 1773325467

## Description

Use the new flattener implementation

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1773325467 (main branch discovery), not current.

```diff
    contract OneStepProverMemory (arb1:0x09fDA6447fA7758EA9245ac78Ca3c9ba68CBfd3d) [orbitstack/OneStepProverMemory] {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      sourceHashes.0:
-        "0x3955092d1dbd80f0910d7782a25da1e3da45533c7890928a1c6c63cbf5def5bf"
+        "0xa163417851e926098130f55736a5b43084164e0070f9647198131e57b45a947d"
    }
```

```diff
    contract ERC20Gateway (arb1:0x107695630130919cb040B095b9b20511D6e211bB) [orbitstack/ERC20Gateway] {
    +++ description: Escrows deposited ERC-20 assets for the canonical Bridge. Upon depositing, a generic token representation will be minted at the destination. Withdrawals are initiated by the Outbox contract.
      sourceHashes.1:
-        "0x12b277cae4866b3d1f1772fcb7f861dc23247452179f0736c9dbe7012f6c14f6"
+        "0xbcc7c87f75509deb2df1f6e2f6388514c4bdb5807f953974c9687b19d36b2475"
    }
```

```diff
    contract RollupProxy (arb1:0x14FdC47483e79d5A76599a74A2D622DA1cf97BBF) [orbitstack/RollupProxy_fastConfirm] {
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
    contract GatewayRouter (arb1:0x3616995dF5D07B28f2B186F1386cace9EB9Bbd20) [orbitstack/GatewayRouter] {
    +++ description: This routing contract maps tokens to the correct escrow (gateway) to be then bridged with canonical messaging.
      sourceHashes.1:
-        "0x61cc407871b0c56af41887c99354633d150e4586f0a6d237c6efd10966b17bd7"
+        "0x4600f997060ae2ef832240d3416d7837131270d347c85a9227f193804349f0d1"
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
    contract GnosisSafeL2 (arb1:0x42124A2E725E6458701b8Ef46B78Db55827fA836) [GnosisSafe] {
    +++ description: None
      sourceHashes.1:
-        "0x59fe14e95a8aa7f52213f18bae5c9329cf583a7ba31194698b15eddb97d5e825"
+        "0xf88f29d444411e68fef376c8e035ef1f39314143a7b6aff952709203095663bd"
    }
```

```diff
    contract Bridge (arb1:0x6F4836aFD5e21EDcee9b838C5a4125829EC198d0) [orbitstack/Bridge] {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      sourceHashes.1:
-        "0x55f3048e868b865115b52aeb3d84b856d34786d8c32f79ae01314c2d0ea8b6aa"
+        "0x119b09babba836df00fa9ed5177d4471f6c8fe8c09d7d1cdf8a96bce9b5d6533"
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
    contract UpgradeExecutor (arb1:0xabf2650D259213d6b3E1bC46Fc1eDb7405d48Fdf) [orbitstack/UpgradeExecutor] {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      sourceHashes.1:
-        "0xa7ff878cfd433a428d567d3b90fe1df400a048a1af5298f22cd4cd4fc25bdecd"
+        "0x11607080f3c3b6b77778e75183e140bfe8604333e71de324adebee0f02b9dbcc"
    }
```

```diff
    contract ChallengeManager (arb1:0xACAec98D879E39d83a30F914A36bf4877424D04f) [orbitstack/ChallengeManager] {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      sourceHashes.1:
-        "0x1a095768302d7d1c3d02375eaa3341833b4f1aaac707e1c608bce478c87cbf27"
+        "0x8a2753d8b3f1ce86250bd4a4e7e502d04dd36a5a670b519b7510af6b33618693"
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
    contract RollupEventInbox (arb1:0xdA3102d2f80CaD9571a9Eb3656e808e973620dBD) [orbitstack/RollupEventInbox] {
    +++ description: Helper contract sending configuration data over the bridge during the systems initialization.
      sourceHashes.1:
-        "0x6ce471861570d55dc6e9a09337d990c13efb0c7abb47f36a5de48a9a7086f6e8"
+        "0x6aedbb6059216584b86626e8ce4bc3f123bb7cdf3890b83063e1d3ef2b16be19"
    }
```

```diff
    contract GnosisSafeL2 (arb1:0xDbB10Cdb2F0611C311E7D7057794a690E7872005) [GnosisSafe] {
    +++ description: None
      sourceHashes.1:
-        "0x59fe14e95a8aa7f52213f18bae5c9329cf583a7ba31194698b15eddb97d5e825"
+        "0xf88f29d444411e68fef376c8e035ef1f39314143a7b6aff952709203095663bd"
    }
```

```diff
    contract SequencerInbox (arb1:0xe44B83D8a3A86994043C809E29B723a44FAEE479) [orbitstack/SequencerInbox] {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      sourceHashes.1:
-        "0x6bb86ac4bd0d31e049f543fcf0a8f94c952252222f115246ef9d5b8104d803cc"
+        "0x38fab1c44903c11839e1113e339b7268b07f99808721133182f57fdd891be63a"
    }
```

```diff
    contract Inbox (arb1:0xeB88b89e085D6B747Dd6b9CEaf2716bdd89F1E7c) [orbitstack/Inbox] {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      sourceHashes.1:
-        "0x84cd273689e720a0b7c657b57d9fb127684f3abb87fc4b337a2f0decd9464120"
+        "0x079413b2ba56c63471a9435a6cbf3759e7d14eb942e6ce789b0b893ec3e6f947"
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

Generated with discovered.json: 0xcbd9ba65aea27895ebe384d77e5d81923912a6a7

# Diff at Tue, 05 May 2026 10:22:07 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@b6437082b3ea8fb0d97f4474b1c3452a1ce271b0 block: 1773325467
- current timestamp: 1773325467

## Description

Include deployer address

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1773325467 (main branch discovery), not current.

```diff
    contract OneStepProverMemory (arb1:0x09fDA6447fA7758EA9245ac78Ca3c9ba68CBfd3d) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      deployerAddress:
+        "arb1:0xa4b1cd457E5635b64eBc8c5be3a1cA7543F7984D"
    }
```

```diff
    contract ERC20Gateway (arb1:0x107695630130919cb040B095b9b20511D6e211bB) {
    +++ description: Escrows deposited ERC-20 assets for the canonical Bridge. Upon depositing, a generic token representation will be minted at the destination. Withdrawals are initiated by the Outbox contract.
      deployerAddress:
+        "arb1:0xc2507E8d43AE685fd1e98805bc96C6d31bBB5c28"
    }
```

```diff
    contract RollupProxy (arb1:0x14FdC47483e79d5A76599a74A2D622DA1cf97BBF) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      deployerAddress:
+        "arb1:0xc2507E8d43AE685fd1e98805bc96C6d31bBB5c28"
    }
```

```diff
    contract GatewayRouter (arb1:0x3616995dF5D07B28f2B186F1386cace9EB9Bbd20) {
    +++ description: This routing contract maps tokens to the correct escrow (gateway) to be then bridged with canonical messaging.
      deployerAddress:
+        "arb1:0xc2507E8d43AE685fd1e98805bc96C6d31bBB5c28"
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
    contract GnosisSafeL2 (arb1:0x42124A2E725E6458701b8Ef46B78Db55827fA836) {
    +++ description: None
      deployerAddress:
+        "arb1:0xc2507E8d43AE685fd1e98805bc96C6d31bBB5c28"
    }
```

```diff
    contract Bridge (arb1:0x6F4836aFD5e21EDcee9b838C5a4125829EC198d0) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      deployerAddress:
+        "arb1:0xc2507E8d43AE685fd1e98805bc96C6d31bBB5c28"
    }
```

```diff
    contract ProxyAdmin (arb1:0x8420251362dA42f5Be2285B2DEa2f20D16332fE6) {
    +++ description: None
      deployerAddress:
+        "arb1:0xc2507E8d43AE685fd1e98805bc96C6d31bBB5c28"
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
    contract Outbox (arb1:0x9f427c80C4DF962726808d4c876fc2c55474a764) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
      deployerAddress:
+        "arb1:0xc2507E8d43AE685fd1e98805bc96C6d31bBB5c28"
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
    contract UpgradeExecutor (arb1:0xabf2650D259213d6b3E1bC46Fc1eDb7405d48Fdf) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      deployerAddress:
+        "arb1:0xc2507E8d43AE685fd1e98805bc96C6d31bBB5c28"
    }
```

```diff
    contract ChallengeManager (arb1:0xACAec98D879E39d83a30F914A36bf4877424D04f) {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      deployerAddress:
+        "arb1:0xc2507E8d43AE685fd1e98805bc96C6d31bBB5c28"
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
    contract RollupEventInbox (arb1:0xdA3102d2f80CaD9571a9Eb3656e808e973620dBD) {
    +++ description: Helper contract sending configuration data over the bridge during the systems initialization.
      deployerAddress:
+        "arb1:0xc2507E8d43AE685fd1e98805bc96C6d31bBB5c28"
    }
```

```diff
    contract GnosisSafeL2 (arb1:0xDbB10Cdb2F0611C311E7D7057794a690E7872005) {
    +++ description: None
      deployerAddress:
+        "arb1:0xc2507E8d43AE685fd1e98805bc96C6d31bBB5c28"
    }
```

```diff
    contract SequencerInbox (arb1:0xe44B83D8a3A86994043C809E29B723a44FAEE479) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      deployerAddress:
+        "arb1:0xc2507E8d43AE685fd1e98805bc96C6d31bBB5c28"
    }
```

```diff
    contract Inbox (arb1:0xeB88b89e085D6B747Dd6b9CEaf2716bdd89F1E7c) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      deployerAddress:
+        "arb1:0xc2507E8d43AE685fd1e98805bc96C6d31bBB5c28"
    }
```

```diff
    contract OneStepProver0 (arb1:0xF5f5bc097ca8f4bE96D8CdE86c96Bd2d81fd2585) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      deployerAddress:
+        "arb1:0xa4b1cd457E5635b64eBc8c5be3a1cA7543F7984D"
    }
```

Generated with discovered.json: 0xc9e0f5476cf07c3634e48bdedbe86e65ce495b0e

# Diff at Thu, 12 Mar 2026 14:25:33 GMT:

- author: vincfurc (<vincfurc@users.noreply.github.com>)
- current timestamp: 1773325467

## Description

Initial discovery of Edge Chain, an Arbitrum Orbit L3 (AnyTrust) by EdgeX.

## Initial discovery

```diff
+   Status: CREATED
    contract OneStepProverMemory (arb1:0x09fDA6447fA7758EA9245ac78Ca3c9ba68CBfd3d)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract ERC20Gateway (arb1:0x107695630130919cb040B095b9b20511D6e211bB)
    +++ description: Escrows deposited ERC-20 assets for the canonical Bridge. Upon depositing, a generic token representation will be minted at the destination. Withdrawals are initiated by the Outbox contract.
```

```diff
+   Status: CREATED
    contract RollupProxy (arb1:0x14FdC47483e79d5A76599a74A2D622DA1cf97BBF)
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
```

```diff
+   Status: CREATED
    contract GatewayRouter (arb1:0x3616995dF5D07B28f2B186F1386cace9EB9Bbd20)
    +++ description: This routing contract maps tokens to the correct escrow (gateway) to be then bridged with canonical messaging.
```

```diff
+   Status: CREATED
    contract OneStepProverHostIo (arb1:0x3930AD9a21dA38E63d52B43b0c530CB0AACcB389)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract GnosisSafeL2 (arb1:0x42124A2E725E6458701b8Ef46B78Db55827fA836)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Bridge (arb1:0x6F4836aFD5e21EDcee9b838C5a4125829EC198d0)
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
```

```diff
+   Status: CREATED
    contract ProxyAdmin (arb1:0x8420251362dA42f5Be2285B2DEa2f20D16332fE6)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SafeL2 (arb1:0x871e290d5447b958131F6d44f915F10032436ee6)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Outbox (arb1:0x9f427c80C4DF962726808d4c876fc2c55474a764)
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
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
    contract UpgradeExecutor (arb1:0xabf2650D259213d6b3E1bC46Fc1eDb7405d48Fdf)
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
```

```diff
+   Status: CREATED
    contract ChallengeManager (arb1:0xACAec98D879E39d83a30F914A36bf4877424D04f)
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
```

```diff
+   Status: CREATED
    contract OneStepProverMath (arb1:0xD3dE403eADdf791104918E9C9336B434AE7DDA01)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract RollupEventInbox (arb1:0xdA3102d2f80CaD9571a9Eb3656e808e973620dBD)
    +++ description: Helper contract sending configuration data over the bridge during the systems initialization.
```

```diff
+   Status: CREATED
    contract GnosisSafeL2 (arb1:0xDbB10Cdb2F0611C311E7D7057794a690E7872005)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SequencerInbox (arb1:0xe44B83D8a3A86994043C809E29B723a44FAEE479)
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
```

```diff
+   Status: CREATED
    contract Inbox (arb1:0xeB88b89e085D6B747Dd6b9CEaf2716bdd89F1E7c)
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
```

```diff
+   Status: CREATED
    contract OneStepProver0 (arb1:0xF5f5bc097ca8f4bE96D8CdE86c96Bd2d81fd2585)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```
