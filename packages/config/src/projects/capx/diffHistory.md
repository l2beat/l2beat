Generated with discovered.json: 0xd70c53f2c07b44c4c1822b11164729997dcd58e6

# Diff at Fri, 15 May 2026 12:35:45 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@a5152b9ba7ad7f85f2af3d814f74630fcaa7c917 block: 1771857554
- current timestamp: 1771857554

## Description

Shape hashes update after flattener improvements

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1771857554 (main branch discovery), not current.

```diff
    contract RollupProxy (eth:0x4967284E726eC01b26cc33c09486C0C2C0C35Efa) [orbitstack/RollupProxy_fastConfirm] {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      sourceHashes.1:
-        "0x689a6510e734cb5e6032f5fca6ce6cb72b6e3af01d74b228d9d2cfd926a25b66"
+        "0x6639f412df425cd0592b0ca4cf5e4ad9d39436f0e7255e83726bb7ac6a9e37b4"
    }
```

```diff
    contract OneStepProver0 (eth:0x5dcD904cea14Aa19f09A8279C9c39a447970005a) [orbitstack/OneStepProver0] {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      sourceHashes.0:
-        "0xdec29538ea8b9a7f83edc119a9fbd3761ab24c5e0b512ecfdecc46dcdefccdc1"
+        "0x063a1b3c4451e69f827acd833c42e986c2c617bfaabb13884fb438185b192407"
    }
```

```diff
    contract OneStepProofEntry (eth:0x7811670b42d6e6C7E430F5d4B2097D6832E0B153) [orbitstack/OneStepProofEntry] {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      sourceHashes.0:
-        "0xb926f057e4fad7ff5b169aeec58691133fd46de25932d8356d3dc28e4e793d3a"
+        "0x294155e99018f1d390be420f29ef940f9843f3ce54ed4e515d998653e2ce4293"
    }
```

```diff
    contract OneStepProverMemory (eth:0x81fc46411C903d8c82216d2702b8F5a17B658da3) [orbitstack/OneStepProverMemory] {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      sourceHashes.0:
-        "0xa163417851e926098130f55736a5b43084164e0070f9647198131e57b45a947d"
+        "0x9e22e05e7953684e6f00507684bb902908d6d4383b2e82ecdce789027bebc33a"
    }
```

```diff
    contract OneStepProverHostIo (eth:0x8c65B044283d6423E9a4359AD79d711f9930f948) [orbitstack/OneStepProverHostIo] {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      sourceHashes.0:
-        "0xd64745a0edbb2ada69b81d849f2737d7c082d18ca14a715c23c4165e4eecc637"
+        "0x081875b93df655e91ec23245390ad21db0990c12125dad497f1cbf118501ccc2"
    }
```

```diff
    contract ChallengeManager (eth:0xe34ab1e33cfc114ede16212CaB41D64a379d6619) [orbitstack/ChallengeManager] {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      sourceHashes.1:
-        "0x8a2753d8b3f1ce86250bd4a4e7e502d04dd36a5a670b519b7510af6b33618693"
+        "0x1eba00857f5477dbcd075b48ce8af9c74d5cb4f93a5e714dd27b3df498737e54"
    }
```

Generated with discovered.json: 0xee4bf13ed9158ff012862db2a8120794f7af26eb

# Diff at Fri, 08 May 2026 07:51:10 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@488d190650457a1fba9b18a83f14a17ab8b2c84c block: 1771857554
- current timestamp: 1771857554

## Description

Use the new flattener implementation

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1771857554 (main branch discovery), not current.

```diff
    contract Caldera Multisig 3 (eth:0x2bf43034b9559643e986A2fE3cE015a18247b904) [GnosisSafe] {
    +++ description: None
      sourceHashes.1:
-        "0xd42bbf9f7dcd3720a7fc6bdc6edfdfae8800a37d6dd4decfa0ef6ca4a2e88940"
+        "0x22c7fb8365a538c05d34b77dd9c1967d1ddb7427eda69f84989d4c56603312b7"
    }
```

```diff
    contract RollupProxy (eth:0x4967284E726eC01b26cc33c09486C0C2C0C35Efa) [orbitstack/RollupProxy_fastConfirm] {
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
    contract ValidatorUtils (eth:0x59E12ED1f3944A6f7aabA9Bd60b51ca5A082D10d) [orbitstack/ValidatorUtils] {
    +++ description: This contract implements view only utilities for validators.
      sourceHashes.0:
-        "0xd9b36ec321be937cc727b5bdb0afa0e1a0a28448ef1a202d4f181a01ce57bdc8"
+        "0xebcd95194086ae9c3b9095578172a3192d9d209e5b159956f1d266910d248334"
    }
```

```diff
    contract OneStepProver0 (eth:0x5dcD904cea14Aa19f09A8279C9c39a447970005a) [orbitstack/OneStepProver0] {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      sourceHashes.0:
-        "0x642d283934aef1189cf62e1bcd34a5081762b33fdd3ec8e823f304f874e48748"
+        "0xdec29538ea8b9a7f83edc119a9fbd3761ab24c5e0b512ecfdecc46dcdefccdc1"
    }
```

```diff
    contract OneStepProofEntry (eth:0x7811670b42d6e6C7E430F5d4B2097D6832E0B153) [orbitstack/OneStepProofEntry] {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      sourceHashes.0:
-        "0x96f85480073b58d0e985cd6c68956f4a52f5ed8b2ce751b18868e2e830be3678"
+        "0xb926f057e4fad7ff5b169aeec58691133fd46de25932d8356d3dc28e4e793d3a"
    }
```

```diff
    contract UpgradeExecutor (eth:0x7EA78566fD17a324460d02A74d0054186A0D8966) [orbitstack/UpgradeExecutor] {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      sourceHashes.1:
-        "0xa7ff878cfd433a428d567d3b90fe1df400a048a1af5298f22cd4cd4fc25bdecd"
+        "0x11607080f3c3b6b77778e75183e140bfe8604333e71de324adebee0f02b9dbcc"
    }
```

```diff
    contract OneStepProverMemory (eth:0x81fc46411C903d8c82216d2702b8F5a17B658da3) [orbitstack/OneStepProverMemory] {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      sourceHashes.0:
-        "0x3955092d1dbd80f0910d7782a25da1e3da45533c7890928a1c6c63cbf5def5bf"
+        "0xa163417851e926098130f55736a5b43084164e0070f9647198131e57b45a947d"
    }
```

```diff
    contract Inbox (eth:0x89AB6919680c66C60968B9c5f0614fC09Aab7EE1) [orbitstack/Inbox] {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      sourceHashes.1:
-        "0x25984fdfffb8141859c99299fb29e7a7460732d77111e5fe23792baa99f336a3"
+        "0xb33f29d585cf178f81b64440ee9a3c598cd398ad18d2b3c6dc6c711eaf63d5e4"
    }
```

```diff
    contract OneStepProverHostIo (eth:0x8c65B044283d6423E9a4359AD79d711f9930f948) [orbitstack/OneStepProverHostIo] {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      sourceHashes.0:
-        "0x2e969e0e83aea53307795f6826413e39bb416a64bc6da18f3a339ffeef444d32"
+        "0xd64745a0edbb2ada69b81d849f2737d7c082d18ca14a715c23c4165e4eecc637"
    }
```

```diff
    contract Bridge (eth:0xAAAA894f556D0eE585773190114CED3d491C0F72) [orbitstack/Bridge] {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      sourceHashes.1:
-        "0x99a0bf7e4c36015dcd932a0a10be16fca8b04d1f882eb51bdf729154110b65c0"
+        "0x0901fac4ec33edd9cf9b02020eec57bad8a2f522d4d96c872f63e4af970b0fab"
    }
```

```diff
    contract OneStepProverMath (eth:0xD3483861e9217E20eC766E3171B58b5202859aDF) [orbitstack/OneStepProverMath] {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      sourceHashes.0:
-        "0x3de1ddc210fe283d7298c5f06879df577c6a475329a206b1928c74d10db656d5"
+        "0xd38b92884347e76d4ce463bc343cbf508eefb150146ed51cb80c2aee8c565122"
    }
```

```diff
    contract SequencerInbox (eth:0xdF41d94e28AA0bB35471225121BDBA710DdaF068) [orbitstack/SequencerInbox] {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      sourceHashes.1:
-        "0x6bb86ac4bd0d31e049f543fcf0a8f94c952252222f115246ef9d5b8104d803cc"
+        "0x38fab1c44903c11839e1113e339b7268b07f99808721133182f57fdd891be63a"
    }
```

```diff
    contract ChallengeManager (eth:0xe34ab1e33cfc114ede16212CaB41D64a379d6619) [orbitstack/ChallengeManager] {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      sourceHashes.1:
-        "0x1a095768302d7d1c3d02375eaa3341833b4f1aaac707e1c608bce478c87cbf27"
+        "0x8a2753d8b3f1ce86250bd4a4e7e502d04dd36a5a670b519b7510af6b33618693"
    }
```

```diff
    contract Outbox (eth:0xEf06DEbcD295ACc3E65de85a741FA192565C3df2) [orbitstack/Outbox] {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
      sourceHashes.1:
-        "0xfc1c087eedce3e4be0593d2e01fcd357b4980c69e03399574b4606e4f3b9ee04"
+        "0xb9f7bc73978fab23b0df754fac230d706fee0d774d97b8533b62b3014d5561a8"
    }
```

Generated with discovered.json: 0xf09fe18521fc80038d1060ff6136938ac8b0deb6

# Diff at Tue, 05 May 2026 10:22:02 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@b6437082b3ea8fb0d97f4474b1c3452a1ce271b0 block: 1771857554
- current timestamp: 1771857554

## Description

Include deployer address

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1771857554 (main branch discovery), not current.

```diff
    contract Caldera Multisig 3 (eth:0x2bf43034b9559643e986A2fE3cE015a18247b904) {
    +++ description: None
      deployerAddress:
+        "eth:0x12ee26aD74d50a1f6BDD90811387d1e0f3e7C76A"
    }
```

```diff
    contract RollupProxy (eth:0x4967284E726eC01b26cc33c09486C0C2C0C35Efa) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      deployerAddress:
+        "eth:0x39F46b3d2e0F4f8697d475e1b2980B3C5ef829a6"
    }
```

```diff
    contract ValidatorUtils (eth:0x59E12ED1f3944A6f7aabA9Bd60b51ca5A082D10d) {
    +++ description: This contract implements view only utilities for validators.
      deployerAddress:
+        "eth:0x02867114B27d686f3565E2060424e985a1E565f5"
    }
```

```diff
    contract OneStepProver0 (eth:0x5dcD904cea14Aa19f09A8279C9c39a447970005a) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      deployerAddress:
+        "eth:0x02867114B27d686f3565E2060424e985a1E565f5"
    }
```

```diff
    contract RollupEventInbox (eth:0x69Af72D5dc7D59DF2164E07dEBba95e6f720f69f) {
    +++ description: Helper contract sending configuration data over the bridge during the systems initialization.
      deployerAddress:
+        "eth:0x39F46b3d2e0F4f8697d475e1b2980B3C5ef829a6"
    }
```

```diff
    contract OneStepProofEntry (eth:0x7811670b42d6e6C7E430F5d4B2097D6832E0B153) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      deployerAddress:
+        "eth:0x02867114B27d686f3565E2060424e985a1E565f5"
    }
```

```diff
    contract UpgradeExecutor (eth:0x7EA78566fD17a324460d02A74d0054186A0D8966) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      deployerAddress:
+        "eth:0x39F46b3d2e0F4f8697d475e1b2980B3C5ef829a6"
    }
```

```diff
    contract OneStepProverMemory (eth:0x81fc46411C903d8c82216d2702b8F5a17B658da3) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      deployerAddress:
+        "eth:0x02867114B27d686f3565E2060424e985a1E565f5"
    }
```

```diff
    contract Inbox (eth:0x89AB6919680c66C60968B9c5f0614fC09Aab7EE1) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      deployerAddress:
+        "eth:0x39F46b3d2e0F4f8697d475e1b2980B3C5ef829a6"
    }
```

```diff
    contract OneStepProverHostIo (eth:0x8c65B044283d6423E9a4359AD79d711f9930f948) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      deployerAddress:
+        "eth:0x02867114B27d686f3565E2060424e985a1E565f5"
    }
```

```diff
    contract Bridge (eth:0xAAAA894f556D0eE585773190114CED3d491C0F72) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      deployerAddress:
+        "eth:0x39F46b3d2e0F4f8697d475e1b2980B3C5ef829a6"
    }
```

```diff
    contract ProxyAdmin (eth:0xCEe383Aa9287D349aa965DF9Ed6e0B582970B2c3) {
    +++ description: None
      deployerAddress:
+        "eth:0x39F46b3d2e0F4f8697d475e1b2980B3C5ef829a6"
    }
```

```diff
    contract OneStepProverMath (eth:0xD3483861e9217E20eC766E3171B58b5202859aDF) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      deployerAddress:
+        "eth:0x02867114B27d686f3565E2060424e985a1E565f5"
    }
```

```diff
    contract SequencerInbox (eth:0xdF41d94e28AA0bB35471225121BDBA710DdaF068) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      deployerAddress:
+        "eth:0x39F46b3d2e0F4f8697d475e1b2980B3C5ef829a6"
    }
```

```diff
    contract ChallengeManager (eth:0xe34ab1e33cfc114ede16212CaB41D64a379d6619) {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      deployerAddress:
+        "eth:0x39F46b3d2e0F4f8697d475e1b2980B3C5ef829a6"
    }
```

```diff
    contract Outbox (eth:0xEf06DEbcD295ACc3E65de85a741FA192565C3df2) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
      deployerAddress:
+        "eth:0x39F46b3d2e0F4f8697d475e1b2980B3C5ef829a6"
    }
```

Generated with discovered.json: 0x54022d35bea3d5a34d6c9f13577268752cb5e6f3

# Diff at Mon, 23 Feb 2026 14:40:22 GMT:

- author: vincfurc (<vincfurc@users.noreply.github.com>)
- comparing to: main@223ad9100b05447b13e88b350a283f0fcdd967a4 block: 1769773244
- current timestamp: 1771857554

## Description

Caldera signer rotation: one member removed from Caldera Multisig 3 (same shared multisig as appchain), threshold unchanged at 4 but now "4 of 7 (57%)" instead of "4 of 8 (50%)".

## Watched changes

```diff
    contract Caldera Multisig 3 (eth:0x2bf43034b9559643e986A2fE3cE015a18247b904) {
    +++ description: None
      values.$members.5:
-        "eth:0xc4548687682246e5B6ee8f914635c9f47836eDFe"
      values.multisigThreshold:
-        "4 of 8 (50%)"
+        "4 of 7 (57%)"
    }
```

Generated with discovered.json: 0x7b1e2dc07ee4997005a3b4e232e2dafea7f610a0

# Diff at Fri, 30 Jan 2026 11:41:49 GMT:

- author: vincfurc (<vincfurc@users.noreply.github.com>)
- comparing to: main@179241847ec22c24aeac96158d21e3a19cd42138 block: 1766142818
- current timestamp: 1769773244

## Description

Caldera Multisig 3 added a new signer, increasing from 4 of 7 (57%) to 4 of 8 (50%) threshold.

## Watched changes

```diff
    contract Caldera Multisig 3 (eth:0x2bf43034b9559643e986A2fE3cE015a18247b904) {
    +++ description: None
      values.$members.0:
+        "eth:0xbCDb12b7a5bDe037e342a6BE7fd5582b9D93C232"
      values.multisigThreshold:
-        "4 of 7 (57%)"
+        "4 of 8 (50%)"
    }
```

Generated with discovered.json: 0x1e83ab4ee554a3a489f158b7449fe10a8563692c

# Diff at Mon, 05 Jan 2026 17:44:08 GMT:

- author: vincfurc (<vincfurc@users.noreply.github.com>)
- comparing to: main@c679543996c33dd4145a38ea0d7fccd3b24d8951 block: 1766142818
- current timestamp: 1766142818

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1766142818 (main branch discovery), not current.

```diff
    contract RollupProxy (eth:0x4967284E726eC01b26cc33c09486C0C2C0C35Efa) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      usedTypes.0.arg.0x8a7513bf7bb3e3db04b0d982d0e973bcf57bf8b88aef7c6d03dba3a81a56a499:
+        "ArbOS v51 wasmModuleRoot"
    }
```

Generated with discovered.json: 0xc7644f9c3895ad52d8d11ef67017d1e1a1d3147f

# Diff at Fri, 19 Dec 2025 11:14:43 GMT:

- author: vincfurc (<vincfurc@users.noreply.github.com>)
- current timestamp: 1766142818

## Description

Initial discovery. Diff with latest templatized bridge:
https://disco.l2beat.com/diff/eth:0x4c62131fFb67348A95B4d2665A8298A1f93A1E65/eth:0x888Ee1F493782E40dF65df6412f811F6bA2E705B

## Initial discovery

```diff
+   Status: CREATED
    contract Caldera Multisig 3 (eth:0x2bf43034b9559643e986A2fE3cE015a18247b904)
    +++ description: None
```

```diff
+   Status: CREATED
    contract RollupProxy (eth:0x4967284E726eC01b26cc33c09486C0C2C0C35Efa)
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
```

```diff
+   Status: CREATED
    contract ValidatorUtils (eth:0x59E12ED1f3944A6f7aabA9Bd60b51ca5A082D10d)
    +++ description: This contract implements view only utilities for validators.
```

```diff
+   Status: CREATED
    contract OneStepProver0 (eth:0x5dcD904cea14Aa19f09A8279C9c39a447970005a)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract RollupEventInbox (eth:0x69Af72D5dc7D59DF2164E07dEBba95e6f720f69f)
    +++ description: Helper contract sending configuration data over the bridge during the systems initialization.
```

```diff
+   Status: CREATED
    contract OneStepProofEntry (eth:0x7811670b42d6e6C7E430F5d4B2097D6832E0B153)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract UpgradeExecutor (eth:0x7EA78566fD17a324460d02A74d0054186A0D8966)
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
```

```diff
+   Status: CREATED
    contract OneStepProverMemory (eth:0x81fc46411C903d8c82216d2702b8F5a17B658da3)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract Inbox (eth:0x89AB6919680c66C60968B9c5f0614fC09Aab7EE1)
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
```

```diff
+   Status: CREATED
    contract OneStepProverHostIo (eth:0x8c65B044283d6423E9a4359AD79d711f9930f948)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract Bridge (eth:0xAAAA894f556D0eE585773190114CED3d491C0F72)
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
```

```diff
+   Status: CREATED
    contract ProxyAdmin (eth:0xCEe383Aa9287D349aa965DF9Ed6e0B582970B2c3)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProverMath (eth:0xD3483861e9217E20eC766E3171B58b5202859aDF)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract SequencerInbox (eth:0xdF41d94e28AA0bB35471225121BDBA710DdaF068)
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
```

```diff
+   Status: CREATED
    contract ChallengeManager (eth:0xe34ab1e33cfc114ede16212CaB41D64a379d6619)
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
```

```diff
+   Status: CREATED
    contract Outbox (eth:0xEf06DEbcD295ACc3E65de85a741FA192565C3df2)
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
```
