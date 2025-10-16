Generated with discovered.json: 0xb95a06273fc51099acdd50c5de02a447faedb8fc

# Diff at Fri, 10 Oct 2025 09:25:56 GMT:

- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@a91384a270a047b2514885e053feff1edc24f495 block: 1759481464
- current timestamp: 1760088290

## Description

Member added to multisig.

## Watched changes

```diff
    contract Caldera Multisig 1 (arb1:0x6FD149B3d41fd860B9Da1A6fE54e902eF41F68BF) {
    +++ description: None
      values.$members.0:
+        "arb1:0xe5219fe14E2FD520Ff80be036790913053d1575d"
      values.$members.1:
+        "arb1:0x62ea938a30826c8794C8B8BbA775B91cAE3B849A"
      values.$members.1:
-        "arb1:0x2F2d46D3dD36c8d1ae2Cb81c0cD2c05C68DBA675"
      values.multisigThreshold:
-        "3 of 8 (38%)"
+        "3 of 9 (33%)"
    }
```

Generated with discovered.json: 0x0adb124d9c18435bcd56d19f8ea41c67c6b45469

# Diff at Fri, 03 Oct 2025 08:52:14 GMT:

- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@e647409961cd173771dcfcaeb808991c99e73911 block: 1753200912
- current timestamp: 1759481464

## Description

Member added to multisig.

## Watched changes

```diff
    contract Caldera Multisig 1 (arb1:0x6FD149B3d41fd860B9Da1A6fE54e902eF41F68BF) {
    +++ description: None
      values.$members.0:
+        "arb1:0x9e14B1baFCEB80B67934aBE4fB00a7291aCfBcD0"
      values.multisigThreshold:
-        "3 of 7 (43%)"
+        "3 of 8 (38%)"
    }
```

Generated with discovered.json: 0x46166d0c6b10e310503dcd6d9435ebb193ddcd67

# Diff at Fri, 26 Sep 2025 12:45:02 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@ec4b16fd723bf2a8625a616c4b3a1119ce79fb29 block: 1753200912
- current timestamp: 1753200912

## Description

add new celestia nitro wasmmoduleroot

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1753200912 (main branch discovery), not current.

```diff
    contract RollupProxy (arb1:0xF9327276c0E0d255543C095AC6D243B555e645D9) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      usedTypes.0.arg.0x597de35fc2ee60e5b2840157370d037542d6a4bc587af7f88202636c54e6bd8d:
+        "Celestia Nitro ArbOS v40 wasmModuleRoot"
    }
```

Generated with discovered.json: 0x6ed9cad857f6539d07f1007386bd31b780660318

# Diff at Mon, 01 Sep 2025 10:01:10 GMT:

Merge mark

Generated with discovered.json: 0x1df7d8b234d86283fce93c4af4b00dc46faa9538

# Diff at Tue, 22 Jul 2025 16:15:51 GMT:

- chain: arbitrum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@83bf55f537ce86d3d1dac9f1a98f31f9169b801f block: 353119830
- current block number: 360431939

## Description

Caldera MS signers added.

## Watched changes

```diff
    contract Caldera Multisig 1 (0x6FD149B3d41fd860B9Da1A6fE54e902eF41F68BF) {
    +++ description: None
      values.$members.0:
+        "arb1:0x2F2d46D3dD36c8d1ae2Cb81c0cD2c05C68DBA675"
      values.$members.1:
+        "arb1:0xc4548687682246e5B6ee8f914635c9f47836eDFe"
      values.$members.2:
+        "arb1:0xe62a4A1e6D237d6fc40d88F819D5cE580a996A6b"
      values.multisigThreshold:
-        "3 of 4 (75%)"
+        "3 of 7 (43%)"
    }
```

Generated with discovered.json: 0x3458ba94a71b69531c08d782d4e00debfd0e2335

# Diff at Mon, 14 Jul 2025 13:11:48 GMT:

- chain: arbitrum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@9f4300dad2f3d080cd56fa311d4a848556c74e72 block: 353119830
- current block number: 353119830

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 353119830 (main branch discovery), not current.

```diff
    contract Blessnet Multisig 2 (0x089E12e795b3292BcC16f29817bE124C720615b0) {
    +++ description: None
      address:
-        "0x089E12e795b3292BcC16f29817bE124C720615b0"
+        "arb1:0x089E12e795b3292BcC16f29817bE124C720615b0"
      values.$implementation:
-        "0x3E5c63644E683549055b9Be8653de26E0B4CD36E"
+        "arb1:0x3E5c63644E683549055b9Be8653de26E0B4CD36E"
      values.$members.0:
-        "0x82Bc29d2a230d99261CFF7Dab9dAB27649784Fd9"
+        "arb1:0x82Bc29d2a230d99261CFF7Dab9dAB27649784Fd9"
      values.$members.1:
-        "0x27752e6B947e777E894c1b7E574Ca7593d6F2C49"
+        "arb1:0x27752e6B947e777E894c1b7E574Ca7593d6F2C49"
      values.$members.2:
-        "0x3D5cFeB6C99343793a8E112dF7D6c331F48e22De"
+        "arb1:0x3D5cFeB6C99343793a8E112dF7D6c331F48e22De"
      implementationNames.0x089E12e795b3292BcC16f29817bE124C720615b0:
-        "GnosisSafeProxy"
      implementationNames.0x3E5c63644E683549055b9Be8653de26E0B4CD36E:
-        "GnosisSafeL2"
      implementationNames.arb1:0x089E12e795b3292BcC16f29817bE124C720615b0:
+        "GnosisSafeProxy"
      implementationNames.arb1:0x3E5c63644E683549055b9Be8653de26E0B4CD36E:
+        "GnosisSafeL2"
    }
```

```diff
    contract OneStepProofEntry (0x0BEfa8F5F1e3bf8e02d874375A43EA75AeD9CD39) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      address:
-        "0x0BEfa8F5F1e3bf8e02d874375A43EA75AeD9CD39"
+        "arb1:0x0BEfa8F5F1e3bf8e02d874375A43EA75AeD9CD39"
      values.prover0:
-        "0x0Ecfe9f90a06F74935f751077E24C2057B7C9a2f"
+        "arb1:0x0Ecfe9f90a06F74935f751077E24C2057B7C9a2f"
      values.proverHostIo:
-        "0x3537Ab400c0275c93569d2c505ADb72804985393"
+        "arb1:0x3537Ab400c0275c93569d2c505ADb72804985393"
      values.proverMath:
-        "0xbBe221554441F1d2d5A963A67789ce5893dCf451"
+        "arb1:0xbBe221554441F1d2d5A963A67789ce5893dCf451"
      values.proverMem:
-        "0x8711CA24591aEF3bEEC3A9cB9CE41939822366f3"
+        "arb1:0x8711CA24591aEF3bEEC3A9cB9CE41939822366f3"
      implementationNames.0x0BEfa8F5F1e3bf8e02d874375A43EA75AeD9CD39:
-        "OneStepProofEntry"
      implementationNames.arb1:0x0BEfa8F5F1e3bf8e02d874375A43EA75AeD9CD39:
+        "OneStepProofEntry"
    }
```

```diff
    contract OneStepProver0 (0x0Ecfe9f90a06F74935f751077E24C2057B7C9a2f) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      address:
-        "0x0Ecfe9f90a06F74935f751077E24C2057B7C9a2f"
+        "arb1:0x0Ecfe9f90a06F74935f751077E24C2057B7C9a2f"
      implementationNames.0x0Ecfe9f90a06F74935f751077E24C2057B7C9a2f:
-        "OneStepProver0"
      implementationNames.arb1:0x0Ecfe9f90a06F74935f751077E24C2057B7C9a2f:
+        "OneStepProver0"
    }
```

```diff
    contract Outbox (0x12c0163237819Eb81c469F71Ea0672e3e8dbF6dB) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
      address:
-        "0x12c0163237819Eb81c469F71Ea0672e3e8dbF6dB"
+        "arb1:0x12c0163237819Eb81c469F71Ea0672e3e8dbF6dB"
      values.$admin:
-        "0xf201805BD417f9E0d229A0C379c3e5B91bf18A8b"
+        "arb1:0xf201805BD417f9E0d229A0C379c3e5B91bf18A8b"
      values.$implementation:
-        "0x923C930e50dA9C97cc151D072681C30D423c9dfC"
+        "arb1:0x923C930e50dA9C97cc151D072681C30D423c9dfC"
      values.$pastUpgrades.0.2.0:
-        "0x923C930e50dA9C97cc151D072681C30D423c9dfC"
+        "arb1:0x923C930e50dA9C97cc151D072681C30D423c9dfC"
      values.bridge:
-        "0xC1bf6E0Ac80e92A331c4D448652C4824D4195459"
+        "arb1:0xC1bf6E0Ac80e92A331c4D448652C4824D4195459"
      values.l2ToL1Sender:
-        "0x0000000000000000000000000000000000000000"
+        "arb1:0x0000000000000000000000000000000000000000"
      values.rollup:
-        "0xF9327276c0E0d255543C095AC6D243B555e645D9"
+        "arb1:0xF9327276c0E0d255543C095AC6D243B555e645D9"
      implementationNames.0x12c0163237819Eb81c469F71Ea0672e3e8dbF6dB:
-        "TransparentUpgradeableProxy"
      implementationNames.0x923C930e50dA9C97cc151D072681C30D423c9dfC:
-        "ERC20Outbox"
      implementationNames.arb1:0x12c0163237819Eb81c469F71Ea0672e3e8dbF6dB:
+        "TransparentUpgradeableProxy"
      implementationNames.arb1:0x923C930e50dA9C97cc151D072681C30D423c9dfC:
+        "ERC20Outbox"
    }
```

```diff
    EOA  (0x12ee26aD74d50a1f6BDD90811387d1e0f3e7C76A) {
    +++ description: None
      address:
-        "0x12ee26aD74d50a1f6BDD90811387d1e0f3e7C76A"
+        "arb1:0x12ee26aD74d50a1f6BDD90811387d1e0f3e7C76A"
    }
```

```diff
    contract SequencerInbox (0x1e751242C9CE10E165969EeD91E5D98587904aad) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      address:
-        "0x1e751242C9CE10E165969EeD91E5D98587904aad"
+        "arb1:0x1e751242C9CE10E165969EeD91E5D98587904aad"
      values.$admin:
-        "0xf201805BD417f9E0d229A0C379c3e5B91bf18A8b"
+        "arb1:0xf201805BD417f9E0d229A0C379c3e5B91bf18A8b"
      values.$implementation:
-        "0xAb468d23BaBD01E57eCc776bEE246938E6a6e9E2"
+        "arb1:0xAb468d23BaBD01E57eCc776bEE246938E6a6e9E2"
      values.$pastUpgrades.0.2.0:
-        "0xB8bAb420bf84B9706d8fCbfd3b3755A929A387FD"
+        "arb1:0xB8bAb420bf84B9706d8fCbfd3b3755A929A387FD"
      values.$pastUpgrades.1.2.0:
-        "0xAb468d23BaBD01E57eCc776bEE246938E6a6e9E2"
+        "arb1:0xAb468d23BaBD01E57eCc776bEE246938E6a6e9E2"
      values.batchPosterManager:
-        "0xED64BaA244A1Ba3e91bBA2712004b1732078EC4D"
+        "arb1:0xED64BaA244A1Ba3e91bBA2712004b1732078EC4D"
      values.batchPosters.0:
-        "0xa0899d20D9665EB0FfE311A395FCd481bF38A5Ff"
+        "arb1:0xa0899d20D9665EB0FfE311A395FCd481bF38A5Ff"
      values.bridge:
-        "0xC1bf6E0Ac80e92A331c4D448652C4824D4195459"
+        "arb1:0xC1bf6E0Ac80e92A331c4D448652C4824D4195459"
      values.reader4844:
-        "0x0000000000000000000000000000000000000000"
+        "arb1:0x0000000000000000000000000000000000000000"
      values.rollup:
-        "0xF9327276c0E0d255543C095AC6D243B555e645D9"
+        "arb1:0xF9327276c0E0d255543C095AC6D243B555e645D9"
      implementationNames.0x1e751242C9CE10E165969EeD91E5D98587904aad:
-        "TransparentUpgradeableProxy"
      implementationNames.0xAb468d23BaBD01E57eCc776bEE246938E6a6e9E2:
-        "SequencerInbox"
      implementationNames.arb1:0x1e751242C9CE10E165969EeD91E5D98587904aad:
+        "TransparentUpgradeableProxy"
      implementationNames.arb1:0xAb468d23BaBD01E57eCc776bEE246938E6a6e9E2:
+        "SequencerInbox"
    }
```

```diff
    EOA  (0x27752e6B947e777E894c1b7E574Ca7593d6F2C49) {
    +++ description: None
      address:
-        "0x27752e6B947e777E894c1b7E574Ca7593d6F2C49"
+        "arb1:0x27752e6B947e777E894c1b7E574Ca7593d6F2C49"
    }
```

```diff
    contract OneStepProverHostIo (0x3537Ab400c0275c93569d2c505ADb72804985393) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      address:
-        "0x3537Ab400c0275c93569d2c505ADb72804985393"
+        "arb1:0x3537Ab400c0275c93569d2c505ADb72804985393"
      implementationNames.0x3537Ab400c0275c93569d2c505ADb72804985393:
-        "OneStepProverHostIo"
      implementationNames.arb1:0x3537Ab400c0275c93569d2c505ADb72804985393:
+        "OneStepProverHostIo"
    }
```

```diff
    EOA Caldera (0x356000Cec4fC967f8FC372381D983426760A0391) {
    +++ description: None
      address:
-        "0x356000Cec4fC967f8FC372381D983426760A0391"
+        "arb1:0x356000Cec4fC967f8FC372381D983426760A0391"
    }
```

```diff
    EOA  (0x3D5cFeB6C99343793a8E112dF7D6c331F48e22De) {
    +++ description: None
      address:
-        "0x3D5cFeB6C99343793a8E112dF7D6c331F48e22De"
+        "arb1:0x3D5cFeB6C99343793a8E112dF7D6c331F48e22De"
    }
```

```diff
    contract Inbox (0x46B6462301182B393ac5f014779687d3B6d4FB57) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      address:
-        "0x46B6462301182B393ac5f014779687d3B6d4FB57"
+        "arb1:0x46B6462301182B393ac5f014779687d3B6d4FB57"
      values.$admin:
-        "0xf201805BD417f9E0d229A0C379c3e5B91bf18A8b"
+        "arb1:0xf201805BD417f9E0d229A0C379c3e5B91bf18A8b"
      values.$implementation:
-        "0xBA5eFa428c1b281FF4A40e81479bdcBB83119A63"
+        "arb1:0xBA5eFa428c1b281FF4A40e81479bdcBB83119A63"
      values.$pastUpgrades.0.2.0:
-        "0x7fbC83A3e374E4D334A32029ffE4641c8045be1D"
+        "arb1:0x7fbC83A3e374E4D334A32029ffE4641c8045be1D"
      values.$pastUpgrades.1.2.0:
-        "0xBA5eFa428c1b281FF4A40e81479bdcBB83119A63"
+        "arb1:0xBA5eFa428c1b281FF4A40e81479bdcBB83119A63"
      values.bridge:
-        "0xC1bf6E0Ac80e92A331c4D448652C4824D4195459"
+        "arb1:0xC1bf6E0Ac80e92A331c4D448652C4824D4195459"
      values.getProxyAdmin:
-        "0xf201805BD417f9E0d229A0C379c3e5B91bf18A8b"
+        "arb1:0xf201805BD417f9E0d229A0C379c3e5B91bf18A8b"
      values.sequencerInbox:
-        "0x1e751242C9CE10E165969EeD91E5D98587904aad"
+        "arb1:0x1e751242C9CE10E165969EeD91E5D98587904aad"
      implementationNames.0x46B6462301182B393ac5f014779687d3B6d4FB57:
-        "TransparentUpgradeableProxy"
      implementationNames.0xBA5eFa428c1b281FF4A40e81479bdcBB83119A63:
-        "ERC20Inbox"
      implementationNames.arb1:0x46B6462301182B393ac5f014779687d3B6d4FB57:
+        "TransparentUpgradeableProxy"
      implementationNames.arb1:0xBA5eFa428c1b281FF4A40e81479bdcBB83119A63:
+        "ERC20Inbox"
    }
```

```diff
    contract Blessnet Multisig 1 (0x571D6CA61B979A967E055696c822CF8C928d3556) {
    +++ description: None
      address:
-        "0x571D6CA61B979A967E055696c822CF8C928d3556"
+        "arb1:0x571D6CA61B979A967E055696c822CF8C928d3556"
      values.$implementation:
-        "0x3E5c63644E683549055b9Be8653de26E0B4CD36E"
+        "arb1:0x3E5c63644E683549055b9Be8653de26E0B4CD36E"
      values.$members.0:
-        "0x82Bc29d2a230d99261CFF7Dab9dAB27649784Fd9"
+        "arb1:0x82Bc29d2a230d99261CFF7Dab9dAB27649784Fd9"
      values.$members.1:
-        "0x27752e6B947e777E894c1b7E574Ca7593d6F2C49"
+        "arb1:0x27752e6B947e777E894c1b7E574Ca7593d6F2C49"
      values.$members.2:
-        "0x3D5cFeB6C99343793a8E112dF7D6c331F48e22De"
+        "arb1:0x3D5cFeB6C99343793a8E112dF7D6c331F48e22De"
      implementationNames.0x571D6CA61B979A967E055696c822CF8C928d3556:
-        "GnosisSafeProxy"
      implementationNames.0x3E5c63644E683549055b9Be8653de26E0B4CD36E:
-        "GnosisSafeL2"
      implementationNames.arb1:0x571D6CA61B979A967E055696c822CF8C928d3556:
+        "GnosisSafeProxy"
      implementationNames.arb1:0x3E5c63644E683549055b9Be8653de26E0B4CD36E:
+        "GnosisSafeL2"
    }
```

```diff
    contract RollupEventInbox (0x67B01721383baedF4b27B745bf533F6F7bDc4AE4) {
    +++ description: Helper contract sending configuration data over the bridge during the systems initialization.
      address:
-        "0x67B01721383baedF4b27B745bf533F6F7bDc4AE4"
+        "arb1:0x67B01721383baedF4b27B745bf533F6F7bDc4AE4"
      values.$admin:
-        "0xf201805BD417f9E0d229A0C379c3e5B91bf18A8b"
+        "arb1:0xf201805BD417f9E0d229A0C379c3e5B91bf18A8b"
      values.$implementation:
-        "0x98844862956849E19503878A302F46838bD77b85"
+        "arb1:0x98844862956849E19503878A302F46838bD77b85"
      values.$pastUpgrades.0.2.0:
-        "0x98844862956849E19503878A302F46838bD77b85"
+        "arb1:0x98844862956849E19503878A302F46838bD77b85"
      values.bridge:
-        "0xC1bf6E0Ac80e92A331c4D448652C4824D4195459"
+        "arb1:0xC1bf6E0Ac80e92A331c4D448652C4824D4195459"
      values.rollup:
-        "0xF9327276c0E0d255543C095AC6D243B555e645D9"
+        "arb1:0xF9327276c0E0d255543C095AC6D243B555e645D9"
      implementationNames.0x67B01721383baedF4b27B745bf533F6F7bDc4AE4:
-        "TransparentUpgradeableProxy"
      implementationNames.0x98844862956849E19503878A302F46838bD77b85:
-        "ERC20RollupEventInbox"
      implementationNames.arb1:0x67B01721383baedF4b27B745bf533F6F7bDc4AE4:
+        "TransparentUpgradeableProxy"
      implementationNames.arb1:0x98844862956849E19503878A302F46838bD77b85:
+        "ERC20RollupEventInbox"
    }
```

```diff
    contract ChallengeManager (0x6f857Cfcb32951cE5A6fAD7B809af8Bcbc3d551A) {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      address:
-        "0x6f857Cfcb32951cE5A6fAD7B809af8Bcbc3d551A"
+        "arb1:0x6f857Cfcb32951cE5A6fAD7B809af8Bcbc3d551A"
      values.$admin:
-        "0xf201805BD417f9E0d229A0C379c3e5B91bf18A8b"
+        "arb1:0xf201805BD417f9E0d229A0C379c3e5B91bf18A8b"
      values.$implementation:
-        "0xEaBEc0E67eED258238789437fa253B898DF52327"
+        "arb1:0xEaBEc0E67eED258238789437fa253B898DF52327"
      values.$pastUpgrades.0.2.0:
-        "0x907b1D0f721ac9736Aa2f02540C5ca68E43BB018"
+        "arb1:0x907b1D0f721ac9736Aa2f02540C5ca68E43BB018"
      values.$pastUpgrades.1.2.0:
-        "0xEaBEc0E67eED258238789437fa253B898DF52327"
+        "arb1:0xEaBEc0E67eED258238789437fa253B898DF52327"
      values.bridge:
-        "0xC1bf6E0Ac80e92A331c4D448652C4824D4195459"
+        "arb1:0xC1bf6E0Ac80e92A331c4D448652C4824D4195459"
      values.osp:
-        "0x0BEfa8F5F1e3bf8e02d874375A43EA75AeD9CD39"
+        "arb1:0x0BEfa8F5F1e3bf8e02d874375A43EA75AeD9CD39"
      values.resultReceiver:
-        "0xF9327276c0E0d255543C095AC6D243B555e645D9"
+        "arb1:0xF9327276c0E0d255543C095AC6D243B555e645D9"
      values.sequencerInbox:
-        "0x1e751242C9CE10E165969EeD91E5D98587904aad"
+        "arb1:0x1e751242C9CE10E165969EeD91E5D98587904aad"
      implementationNames.0x6f857Cfcb32951cE5A6fAD7B809af8Bcbc3d551A:
-        "TransparentUpgradeableProxy"
      implementationNames.0xEaBEc0E67eED258238789437fa253B898DF52327:
-        "ChallengeManager"
      implementationNames.arb1:0x6f857Cfcb32951cE5A6fAD7B809af8Bcbc3d551A:
+        "TransparentUpgradeableProxy"
      implementationNames.arb1:0xEaBEc0E67eED258238789437fa253B898DF52327:
+        "ChallengeManager"
    }
```

```diff
    contract Caldera Multisig 1 (0x6FD149B3d41fd860B9Da1A6fE54e902eF41F68BF) {
    +++ description: None
      address:
-        "0x6FD149B3d41fd860B9Da1A6fE54e902eF41F68BF"
+        "arb1:0x6FD149B3d41fd860B9Da1A6fE54e902eF41F68BF"
      values.$implementation:
-        "0x3E5c63644E683549055b9Be8653de26E0B4CD36E"
+        "arb1:0x3E5c63644E683549055b9Be8653de26E0B4CD36E"
      values.$members.0:
-        "0xEC114946E7213d113c9B9481028271B5E9e09371"
+        "arb1:0xEC114946E7213d113c9B9481028271B5E9e09371"
      values.$members.1:
-        "0xbf853295743511e8DC5F03809d209C33fC136d24"
+        "arb1:0xbf853295743511e8DC5F03809d209C33fC136d24"
      values.$members.2:
-        "0x12ee26aD74d50a1f6BDD90811387d1e0f3e7C76A"
+        "arb1:0x12ee26aD74d50a1f6BDD90811387d1e0f3e7C76A"
      values.$members.3:
-        "0x356000Cec4fC967f8FC372381D983426760A0391"
+        "arb1:0x356000Cec4fC967f8FC372381D983426760A0391"
      implementationNames.0x6FD149B3d41fd860B9Da1A6fE54e902eF41F68BF:
-        "GnosisSafeProxy"
      implementationNames.0x3E5c63644E683549055b9Be8653de26E0B4CD36E:
-        "GnosisSafeL2"
      implementationNames.arb1:0x6FD149B3d41fd860B9Da1A6fE54e902eF41F68BF:
+        "GnosisSafeProxy"
      implementationNames.arb1:0x3E5c63644E683549055b9Be8653de26E0B4CD36E:
+        "GnosisSafeL2"
    }
```

```diff
    EOA  (0x82Bc29d2a230d99261CFF7Dab9dAB27649784Fd9) {
    +++ description: None
      address:
-        "0x82Bc29d2a230d99261CFF7Dab9dAB27649784Fd9"
+        "arb1:0x82Bc29d2a230d99261CFF7Dab9dAB27649784Fd9"
    }
```

```diff
    contract OneStepProverMemory (0x8711CA24591aEF3bEEC3A9cB9CE41939822366f3) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      address:
-        "0x8711CA24591aEF3bEEC3A9cB9CE41939822366f3"
+        "arb1:0x8711CA24591aEF3bEEC3A9cB9CE41939822366f3"
      implementationNames.0x8711CA24591aEF3bEEC3A9cB9CE41939822366f3:
-        "OneStepProverMemory"
      implementationNames.arb1:0x8711CA24591aEF3bEEC3A9cB9CE41939822366f3:
+        "OneStepProverMemory"
    }
```

```diff
    contract ValidatorUtils (0x9A3464863213C218D7cb7BaA6e69C0461E0Cbc08) {
    +++ description: This contract implements view only utilities for validators.
      address:
-        "0x9A3464863213C218D7cb7BaA6e69C0461E0Cbc08"
+        "arb1:0x9A3464863213C218D7cb7BaA6e69C0461E0Cbc08"
      implementationNames.0x9A3464863213C218D7cb7BaA6e69C0461E0Cbc08:
-        "ValidatorUtils"
      implementationNames.arb1:0x9A3464863213C218D7cb7BaA6e69C0461E0Cbc08:
+        "ValidatorUtils"
    }
```

```diff
    EOA  (0xa0899d20D9665EB0FfE311A395FCd481bF38A5Ff) {
    +++ description: None
      address:
-        "0xa0899d20D9665EB0FfE311A395FCd481bF38A5Ff"
+        "arb1:0xa0899d20D9665EB0FfE311A395FCd481bF38A5Ff"
    }
```

```diff
    contract UpgradeExecutor (0xa5e62aAC82Af6dA4Fd23ca5219132a7D941B4fe3) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      address:
-        "0xa5e62aAC82Af6dA4Fd23ca5219132a7D941B4fe3"
+        "arb1:0xa5e62aAC82Af6dA4Fd23ca5219132a7D941B4fe3"
      values.$admin:
-        "0xf201805BD417f9E0d229A0C379c3e5B91bf18A8b"
+        "arb1:0xf201805BD417f9E0d229A0C379c3e5B91bf18A8b"
      values.$implementation:
-        "0x359471b7e8dde088eE938D470a1B7092Af4F2302"
+        "arb1:0x359471b7e8dde088eE938D470a1B7092Af4F2302"
      values.$pastUpgrades.0.2.0:
-        "0x359471b7e8dde088eE938D470a1B7092Af4F2302"
+        "arb1:0x359471b7e8dde088eE938D470a1B7092Af4F2302"
      values.accessControl.ADMIN_ROLE.members.0:
-        "0xa5e62aAC82Af6dA4Fd23ca5219132a7D941B4fe3"
+        "arb1:0xa5e62aAC82Af6dA4Fd23ca5219132a7D941B4fe3"
      values.accessControl.EXECUTOR_ROLE.members.0:
-        "0x6FD149B3d41fd860B9Da1A6fE54e902eF41F68BF"
+        "arb1:0x6FD149B3d41fd860B9Da1A6fE54e902eF41F68BF"
      values.executors.0:
-        "0x6FD149B3d41fd860B9Da1A6fE54e902eF41F68BF"
+        "arb1:0x6FD149B3d41fd860B9Da1A6fE54e902eF41F68BF"
      implementationNames.0xa5e62aAC82Af6dA4Fd23ca5219132a7D941B4fe3:
-        "TransparentUpgradeableProxy"
      implementationNames.0x359471b7e8dde088eE938D470a1B7092Af4F2302:
-        "UpgradeExecutor"
      implementationNames.arb1:0xa5e62aAC82Af6dA4Fd23ca5219132a7D941B4fe3:
+        "TransparentUpgradeableProxy"
      implementationNames.arb1:0x359471b7e8dde088eE938D470a1B7092Af4F2302:
+        "UpgradeExecutor"
    }
```

```diff
    contract OneStepProverMath (0xbBe221554441F1d2d5A963A67789ce5893dCf451) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      address:
-        "0xbBe221554441F1d2d5A963A67789ce5893dCf451"
+        "arb1:0xbBe221554441F1d2d5A963A67789ce5893dCf451"
      implementationNames.0xbBe221554441F1d2d5A963A67789ce5893dCf451:
-        "OneStepProverMath"
      implementationNames.arb1:0xbBe221554441F1d2d5A963A67789ce5893dCf451:
+        "OneStepProverMath"
    }
```

```diff
    EOA  (0xbf853295743511e8DC5F03809d209C33fC136d24) {
    +++ description: None
      address:
-        "0xbf853295743511e8DC5F03809d209C33fC136d24"
+        "arb1:0xbf853295743511e8DC5F03809d209C33fC136d24"
    }
```

```diff
    contract Bridge (0xC1bf6E0Ac80e92A331c4D448652C4824D4195459) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      address:
-        "0xC1bf6E0Ac80e92A331c4D448652C4824D4195459"
+        "arb1:0xC1bf6E0Ac80e92A331c4D448652C4824D4195459"
      values.$admin:
-        "0xf201805BD417f9E0d229A0C379c3e5B91bf18A8b"
+        "arb1:0xf201805BD417f9E0d229A0C379c3e5B91bf18A8b"
      values.$implementation:
-        "0xeF960375235AbFab045c4A7324295612739569EB"
+        "arb1:0xeF960375235AbFab045c4A7324295612739569EB"
      values.$pastUpgrades.0.2.0:
-        "0xF0bb18D200D4CB7b36853Eaa0D902F729B4602AB"
+        "arb1:0xF0bb18D200D4CB7b36853Eaa0D902F729B4602AB"
      values.$pastUpgrades.1.2.0:
-        "0xeF960375235AbFab045c4A7324295612739569EB"
+        "arb1:0xeF960375235AbFab045c4A7324295612739569EB"
      values.activeOutbox:
-        "0x0000000000000000000000000000000000000000"
+        "arb1:0x0000000000000000000000000000000000000000"
+++ description: Allowed to mint the gastoken on L2 and call `enqueueDelayedMessage()` on the bridge.
+++ severity: HIGH
      values.allowedDelayedInboxList.0:
-        "0x46B6462301182B393ac5f014779687d3B6d4FB57"
+        "arb1:0x46B6462301182B393ac5f014779687d3B6d4FB57"
+++ description: Allowed to mint the gastoken on L2 and call `enqueueDelayedMessage()` on the bridge.
+++ severity: HIGH
      values.allowedDelayedInboxList.1:
-        "0x67B01721383baedF4b27B745bf533F6F7bDc4AE4"
+        "arb1:0x67B01721383baedF4b27B745bf533F6F7bDc4AE4"
+++ description: Can make calls as the bridge, steal all funds.
+++ severity: HIGH
      values.allowedOutboxList.0:
-        "0x12c0163237819Eb81c469F71Ea0672e3e8dbF6dB"
+        "arb1:0x12c0163237819Eb81c469F71Ea0672e3e8dbF6dB"
+++ description: All Inboxes that were ever set as allowed in the bridge.
+++ severity: HIGH
      values.inboxHistory.0:
-        "0x46B6462301182B393ac5f014779687d3B6d4FB57"
+        "arb1:0x46B6462301182B393ac5f014779687d3B6d4FB57"
+++ description: All Inboxes that were ever set as allowed in the bridge.
+++ severity: HIGH
      values.inboxHistory.1:
-        "0x67B01721383baedF4b27B745bf533F6F7bDc4AE4"
+        "arb1:0x67B01721383baedF4b27B745bf533F6F7bDc4AE4"
      values.nativeToken:
-        "0x000000000000CCA70B6e0997a94681a3114EdDD7"
+        "arb1:0x000000000000CCA70B6e0997a94681a3114EdDD7"
+++ description: All Outboxes that were ever set as allowed in the bridge.
+++ severity: HIGH
      values.outboxHistory.0:
-        "0x12c0163237819Eb81c469F71Ea0672e3e8dbF6dB"
+        "arb1:0x12c0163237819Eb81c469F71Ea0672e3e8dbF6dB"
      values.rollup:
-        "0xF9327276c0E0d255543C095AC6D243B555e645D9"
+        "arb1:0xF9327276c0E0d255543C095AC6D243B555e645D9"
      values.sequencerInbox:
-        "0x1e751242C9CE10E165969EeD91E5D98587904aad"
+        "arb1:0x1e751242C9CE10E165969EeD91E5D98587904aad"
      implementationNames.0xC1bf6E0Ac80e92A331c4D448652C4824D4195459:
-        "TransparentUpgradeableProxy"
      implementationNames.0xeF960375235AbFab045c4A7324295612739569EB:
-        "ERC20Bridge"
      implementationNames.arb1:0xC1bf6E0Ac80e92A331c4D448652C4824D4195459:
+        "TransparentUpgradeableProxy"
      implementationNames.arb1:0xeF960375235AbFab045c4A7324295612739569EB:
+        "ERC20Bridge"
    }
```

```diff
    EOA  (0xEC114946E7213d113c9B9481028271B5E9e09371) {
    +++ description: None
      address:
-        "0xEC114946E7213d113c9B9481028271B5E9e09371"
+        "arb1:0xEC114946E7213d113c9B9481028271B5E9e09371"
    }
```

```diff
    EOA  (0xED64BaA244A1Ba3e91bBA2712004b1732078EC4D) {
    +++ description: None
      address:
-        "0xED64BaA244A1Ba3e91bBA2712004b1732078EC4D"
+        "arb1:0xED64BaA244A1Ba3e91bBA2712004b1732078EC4D"
    }
```

```diff
    contract ProxyAdmin (0xf201805BD417f9E0d229A0C379c3e5B91bf18A8b) {
    +++ description: None
      address:
-        "0xf201805BD417f9E0d229A0C379c3e5B91bf18A8b"
+        "arb1:0xf201805BD417f9E0d229A0C379c3e5B91bf18A8b"
      values.owner:
-        "0xa5e62aAC82Af6dA4Fd23ca5219132a7D941B4fe3"
+        "arb1:0xa5e62aAC82Af6dA4Fd23ca5219132a7D941B4fe3"
      implementationNames.0xf201805BD417f9E0d229A0C379c3e5B91bf18A8b:
-        "ProxyAdmin"
      implementationNames.arb1:0xf201805BD417f9E0d229A0C379c3e5B91bf18A8b:
+        "ProxyAdmin"
    }
```

```diff
    contract RollupProxy (0xF9327276c0E0d255543C095AC6D243B555e645D9) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      address:
-        "0xF9327276c0E0d255543C095AC6D243B555e645D9"
+        "arb1:0xF9327276c0E0d255543C095AC6D243B555e645D9"
      values.$admin:
-        "0xa5e62aAC82Af6dA4Fd23ca5219132a7D941B4fe3"
+        "arb1:0xa5e62aAC82Af6dA4Fd23ca5219132a7D941B4fe3"
      values.$implementation.0:
-        "0x55dA4671C398854a78ACea4fD5102c59AF8b7a77"
+        "arb1:0x55dA4671C398854a78ACea4fD5102c59AF8b7a77"
      values.$implementation.1:
-        "0xBB0F18D6968b44dd2CEE3d3EF728DbA80aDe4AC0"
+        "arb1:0xBB0F18D6968b44dd2CEE3d3EF728DbA80aDe4AC0"
      values.$pastUpgrades.0.2.0:
-        "0x6E1430d75564ff2115B0c7f9cD19fEF1dd4DB667"
+        "arb1:0x6E1430d75564ff2115B0c7f9cD19fEF1dd4DB667"
      values.$pastUpgrades.0.2.1:
-        "0x5cd07e89899121537bb390C1b257bAeC2D83A5e1"
+        "arb1:0x5cd07e89899121537bb390C1b257bAeC2D83A5e1"
      values.$pastUpgrades.1.2.0:
-        "0x55dA4671C398854a78ACea4fD5102c59AF8b7a77"
+        "arb1:0x55dA4671C398854a78ACea4fD5102c59AF8b7a77"
      values.$pastUpgrades.1.2.1:
-        "0xBB0F18D6968b44dd2CEE3d3EF728DbA80aDe4AC0"
+        "arb1:0xBB0F18D6968b44dd2CEE3d3EF728DbA80aDe4AC0"
      values.anyTrustFastConfirmer:
-        "0x089E12e795b3292BcC16f29817bE124C720615b0"
+        "arb1:0x089E12e795b3292BcC16f29817bE124C720615b0"
      values.bridge:
-        "0xC1bf6E0Ac80e92A331c4D448652C4824D4195459"
+        "arb1:0xC1bf6E0Ac80e92A331c4D448652C4824D4195459"
      values.challengeManager:
-        "0x6f857Cfcb32951cE5A6fAD7B809af8Bcbc3d551A"
+        "arb1:0x6f857Cfcb32951cE5A6fAD7B809af8Bcbc3d551A"
      values.inbox:
-        "0x46B6462301182B393ac5f014779687d3B6d4FB57"
+        "arb1:0x46B6462301182B393ac5f014779687d3B6d4FB57"
      values.loserStakeEscrow:
-        "0xED64BaA244A1Ba3e91bBA2712004b1732078EC4D"
+        "arb1:0xED64BaA244A1Ba3e91bBA2712004b1732078EC4D"
      values.outbox:
-        "0x12c0163237819Eb81c469F71Ea0672e3e8dbF6dB"
+        "arb1:0x12c0163237819Eb81c469F71Ea0672e3e8dbF6dB"
      values.owner:
-        "0xa5e62aAC82Af6dA4Fd23ca5219132a7D941B4fe3"
+        "arb1:0xa5e62aAC82Af6dA4Fd23ca5219132a7D941B4fe3"
      values.rollupEventInbox:
-        "0x67B01721383baedF4b27B745bf533F6F7bDc4AE4"
+        "arb1:0x67B01721383baedF4b27B745bf533F6F7bDc4AE4"
      values.sequencerInbox:
-        "0x1e751242C9CE10E165969EeD91E5D98587904aad"
+        "arb1:0x1e751242C9CE10E165969EeD91E5D98587904aad"
      values.stakeToken:
-        "0x0000000000000000000000000000000000000000"
+        "arb1:0x0000000000000000000000000000000000000000"
      values.validators.0:
-        "0x089E12e795b3292BcC16f29817bE124C720615b0"
+        "arb1:0x089E12e795b3292BcC16f29817bE124C720615b0"
      values.validators.1:
-        "0x27752e6B947e777E894c1b7E574Ca7593d6F2C49"
+        "arb1:0x27752e6B947e777E894c1b7E574Ca7593d6F2C49"
      values.validators.2:
-        "0x3D5cFeB6C99343793a8E112dF7D6c331F48e22De"
+        "arb1:0x3D5cFeB6C99343793a8E112dF7D6c331F48e22De"
      values.validators.3:
-        "0x571D6CA61B979A967E055696c822CF8C928d3556"
+        "arb1:0x571D6CA61B979A967E055696c822CF8C928d3556"
      values.validators.4:
-        "0x82Bc29d2a230d99261CFF7Dab9dAB27649784Fd9"
+        "arb1:0x82Bc29d2a230d99261CFF7Dab9dAB27649784Fd9"
      values.validatorUtils:
-        "0x9A3464863213C218D7cb7BaA6e69C0461E0Cbc08"
+        "arb1:0x9A3464863213C218D7cb7BaA6e69C0461E0Cbc08"
      values.validatorWalletCreator:
-        "0x1A0c6A30e67293354c0F36537E190e2e7EBC70BB"
+        "arb1:0x1A0c6A30e67293354c0F36537E190e2e7EBC70BB"
      implementationNames.0xF9327276c0E0d255543C095AC6D243B555e645D9:
-        "RollupProxy"
      implementationNames.0x55dA4671C398854a78ACea4fD5102c59AF8b7a77:
-        "RollupAdminLogic"
      implementationNames.0xBB0F18D6968b44dd2CEE3d3EF728DbA80aDe4AC0:
-        "RollupUserLogic"
      implementationNames.arb1:0xF9327276c0E0d255543C095AC6D243B555e645D9:
+        "RollupProxy"
      implementationNames.arb1:0x55dA4671C398854a78ACea4fD5102c59AF8b7a77:
+        "RollupAdminLogic"
      implementationNames.arb1:0xBB0F18D6968b44dd2CEE3d3EF728DbA80aDe4AC0:
+        "RollupUserLogic"
    }
```

```diff
+   Status: CREATED
    contract Blessnet Multisig 2 (0x089E12e795b3292BcC16f29817bE124C720615b0)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProofEntry (0x0BEfa8F5F1e3bf8e02d874375A43EA75AeD9CD39)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract OneStepProver0 (0x0Ecfe9f90a06F74935f751077E24C2057B7C9a2f)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract Outbox (0x12c0163237819Eb81c469F71Ea0672e3e8dbF6dB)
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
```

```diff
+   Status: CREATED
    contract SequencerInbox (0x1e751242C9CE10E165969EeD91E5D98587904aad)
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
```

```diff
+   Status: CREATED
    contract OneStepProverHostIo (0x3537Ab400c0275c93569d2c505ADb72804985393)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract Inbox (0x46B6462301182B393ac5f014779687d3B6d4FB57)
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
```

```diff
+   Status: CREATED
    contract Blessnet Multisig 1 (0x571D6CA61B979A967E055696c822CF8C928d3556)
    +++ description: None
```

```diff
+   Status: CREATED
    contract RollupEventInbox (0x67B01721383baedF4b27B745bf533F6F7bDc4AE4)
    +++ description: Helper contract sending configuration data over the bridge during the systems initialization.
```

```diff
+   Status: CREATED
    contract ChallengeManager (0x6f857Cfcb32951cE5A6fAD7B809af8Bcbc3d551A)
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
```

```diff
+   Status: CREATED
    contract Caldera Multisig 1 (0x6FD149B3d41fd860B9Da1A6fE54e902eF41F68BF)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProverMemory (0x8711CA24591aEF3bEEC3A9cB9CE41939822366f3)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract ValidatorUtils (0x9A3464863213C218D7cb7BaA6e69C0461E0Cbc08)
    +++ description: This contract implements view only utilities for validators.
```

```diff
+   Status: CREATED
    contract UpgradeExecutor (0xa5e62aAC82Af6dA4Fd23ca5219132a7D941B4fe3)
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
```

```diff
+   Status: CREATED
    contract OneStepProverMath (0xbBe221554441F1d2d5A963A67789ce5893dCf451)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract Bridge (0xC1bf6E0Ac80e92A331c4D448652C4824D4195459)
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0xf201805BD417f9E0d229A0C379c3e5B91bf18A8b)
    +++ description: None
```

```diff
+   Status: CREATED
    contract RollupProxy (0xF9327276c0E0d255543C095AC6D243B555e645D9)
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
```

Generated with discovered.json: 0x8358e46b7cb2d0bf308b99c88aee5d3d52fb4b39

# Diff at Fri, 04 Jul 2025 12:18:54 GMT:

- chain: arbitrum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f56dc47fe915564d4555300304da4d3bcbc087f block: 353119830
- current block number: 353119830

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 353119830 (main branch discovery), not current.

```diff
    contract Blessnet Multisig 2 (0x089E12e795b3292BcC16f29817bE124C720615b0) {
    +++ description: None
      receivedPermissions.0.from:
-        "arbitrum:0xF9327276c0E0d255543C095AC6D243B555e645D9"
+        "arb1:0xF9327276c0E0d255543C095AC6D243B555e645D9"
      receivedPermissions.1.from:
-        "arbitrum:0xF9327276c0E0d255543C095AC6D243B555e645D9"
+        "arb1:0xF9327276c0E0d255543C095AC6D243B555e645D9"
    }
```

```diff
    EOA  (0x27752e6B947e777E894c1b7E574Ca7593d6F2C49) {
    +++ description: None
      receivedPermissions.0.from:
-        "arbitrum:0xF9327276c0E0d255543C095AC6D243B555e645D9"
+        "arb1:0xF9327276c0E0d255543C095AC6D243B555e645D9"
    }
```

```diff
    EOA  (0x3D5cFeB6C99343793a8E112dF7D6c331F48e22De) {
    +++ description: None
      receivedPermissions.0.from:
-        "arbitrum:0xF9327276c0E0d255543C095AC6D243B555e645D9"
+        "arb1:0xF9327276c0E0d255543C095AC6D243B555e645D9"
    }
```

```diff
    contract Blessnet Multisig 1 (0x571D6CA61B979A967E055696c822CF8C928d3556) {
    +++ description: None
      receivedPermissions.0.from:
-        "arbitrum:0xF9327276c0E0d255543C095AC6D243B555e645D9"
+        "arb1:0xF9327276c0E0d255543C095AC6D243B555e645D9"
    }
```

```diff
    contract Caldera Multisig 1 (0x6FD149B3d41fd860B9Da1A6fE54e902eF41F68BF) {
    +++ description: None
      receivedPermissions.0.via.0.address:
-        "arbitrum:0xa5e62aAC82Af6dA4Fd23ca5219132a7D941B4fe3"
+        "arb1:0xa5e62aAC82Af6dA4Fd23ca5219132a7D941B4fe3"
      receivedPermissions.0.from:
-        "arbitrum:0xF9327276c0E0d255543C095AC6D243B555e645D9"
+        "arb1:0xF9327276c0E0d255543C095AC6D243B555e645D9"
      receivedPermissions.1.via.1.address:
-        "arbitrum:0xa5e62aAC82Af6dA4Fd23ca5219132a7D941B4fe3"
+        "arb1:0xa5e62aAC82Af6dA4Fd23ca5219132a7D941B4fe3"
      receivedPermissions.1.via.0.address:
-        "arbitrum:0xf201805BD417f9E0d229A0C379c3e5B91bf18A8b"
+        "arb1:0xf201805BD417f9E0d229A0C379c3e5B91bf18A8b"
      receivedPermissions.1.from:
-        "arbitrum:0x12c0163237819Eb81c469F71Ea0672e3e8dbF6dB"
+        "arb1:0x12c0163237819Eb81c469F71Ea0672e3e8dbF6dB"
      receivedPermissions.2.via.1.address:
-        "arbitrum:0xa5e62aAC82Af6dA4Fd23ca5219132a7D941B4fe3"
+        "arb1:0xa5e62aAC82Af6dA4Fd23ca5219132a7D941B4fe3"
      receivedPermissions.2.via.0.address:
-        "arbitrum:0xf201805BD417f9E0d229A0C379c3e5B91bf18A8b"
+        "arb1:0xf201805BD417f9E0d229A0C379c3e5B91bf18A8b"
      receivedPermissions.2.from:
-        "arbitrum:0x1e751242C9CE10E165969EeD91E5D98587904aad"
+        "arb1:0x1e751242C9CE10E165969EeD91E5D98587904aad"
      receivedPermissions.3.via.1.address:
-        "arbitrum:0xa5e62aAC82Af6dA4Fd23ca5219132a7D941B4fe3"
+        "arb1:0xa5e62aAC82Af6dA4Fd23ca5219132a7D941B4fe3"
      receivedPermissions.3.via.0.address:
-        "arbitrum:0xf201805BD417f9E0d229A0C379c3e5B91bf18A8b"
+        "arb1:0xf201805BD417f9E0d229A0C379c3e5B91bf18A8b"
      receivedPermissions.3.from:
-        "arbitrum:0x46B6462301182B393ac5f014779687d3B6d4FB57"
+        "arb1:0x46B6462301182B393ac5f014779687d3B6d4FB57"
      receivedPermissions.4.via.1.address:
-        "arbitrum:0xa5e62aAC82Af6dA4Fd23ca5219132a7D941B4fe3"
+        "arb1:0xa5e62aAC82Af6dA4Fd23ca5219132a7D941B4fe3"
      receivedPermissions.4.via.0.address:
-        "arbitrum:0xf201805BD417f9E0d229A0C379c3e5B91bf18A8b"
+        "arb1:0xf201805BD417f9E0d229A0C379c3e5B91bf18A8b"
      receivedPermissions.4.from:
-        "arbitrum:0x67B01721383baedF4b27B745bf533F6F7bDc4AE4"
+        "arb1:0x67B01721383baedF4b27B745bf533F6F7bDc4AE4"
      receivedPermissions.5.via.1.address:
-        "arbitrum:0xa5e62aAC82Af6dA4Fd23ca5219132a7D941B4fe3"
+        "arb1:0xa5e62aAC82Af6dA4Fd23ca5219132a7D941B4fe3"
      receivedPermissions.5.via.0.address:
-        "arbitrum:0xf201805BD417f9E0d229A0C379c3e5B91bf18A8b"
+        "arb1:0xf201805BD417f9E0d229A0C379c3e5B91bf18A8b"
      receivedPermissions.5.from:
-        "arbitrum:0x6f857Cfcb32951cE5A6fAD7B809af8Bcbc3d551A"
+        "arb1:0x6f857Cfcb32951cE5A6fAD7B809af8Bcbc3d551A"
      receivedPermissions.6.via.1.address:
-        "arbitrum:0xa5e62aAC82Af6dA4Fd23ca5219132a7D941B4fe3"
+        "arb1:0xa5e62aAC82Af6dA4Fd23ca5219132a7D941B4fe3"
      receivedPermissions.6.via.0.address:
-        "arbitrum:0xf201805BD417f9E0d229A0C379c3e5B91bf18A8b"
+        "arb1:0xf201805BD417f9E0d229A0C379c3e5B91bf18A8b"
      receivedPermissions.6.from:
-        "arbitrum:0xa5e62aAC82Af6dA4Fd23ca5219132a7D941B4fe3"
+        "arb1:0xa5e62aAC82Af6dA4Fd23ca5219132a7D941B4fe3"
      receivedPermissions.7.via.1.address:
-        "arbitrum:0xa5e62aAC82Af6dA4Fd23ca5219132a7D941B4fe3"
+        "arb1:0xa5e62aAC82Af6dA4Fd23ca5219132a7D941B4fe3"
      receivedPermissions.7.via.0.address:
-        "arbitrum:0xf201805BD417f9E0d229A0C379c3e5B91bf18A8b"
+        "arb1:0xf201805BD417f9E0d229A0C379c3e5B91bf18A8b"
      receivedPermissions.7.from:
-        "arbitrum:0xC1bf6E0Ac80e92A331c4D448652C4824D4195459"
+        "arb1:0xC1bf6E0Ac80e92A331c4D448652C4824D4195459"
      receivedPermissions.8.via.0.address:
-        "arbitrum:0xa5e62aAC82Af6dA4Fd23ca5219132a7D941B4fe3"
+        "arb1:0xa5e62aAC82Af6dA4Fd23ca5219132a7D941B4fe3"
      receivedPermissions.8.from:
-        "arbitrum:0xF9327276c0E0d255543C095AC6D243B555e645D9"
+        "arb1:0xF9327276c0E0d255543C095AC6D243B555e645D9"
      directlyReceivedPermissions.0.from:
-        "arbitrum:0xa5e62aAC82Af6dA4Fd23ca5219132a7D941B4fe3"
+        "arb1:0xa5e62aAC82Af6dA4Fd23ca5219132a7D941B4fe3"
    }
```

```diff
    EOA  (0x82Bc29d2a230d99261CFF7Dab9dAB27649784Fd9) {
    +++ description: None
      receivedPermissions.0.from:
-        "arbitrum:0xF9327276c0E0d255543C095AC6D243B555e645D9"
+        "arb1:0xF9327276c0E0d255543C095AC6D243B555e645D9"
    }
```

```diff
    EOA  (0xa0899d20D9665EB0FfE311A395FCd481bF38A5Ff) {
    +++ description: None
      receivedPermissions.0.from:
-        "arbitrum:0x1e751242C9CE10E165969EeD91E5D98587904aad"
+        "arb1:0x1e751242C9CE10E165969EeD91E5D98587904aad"
    }
```

```diff
    contract UpgradeExecutor (0xa5e62aAC82Af6dA4Fd23ca5219132a7D941B4fe3) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      directlyReceivedPermissions.0.from:
-        "arbitrum:0xf201805BD417f9E0d229A0C379c3e5B91bf18A8b"
+        "arb1:0xf201805BD417f9E0d229A0C379c3e5B91bf18A8b"
      directlyReceivedPermissions.1.from:
-        "arbitrum:0xF9327276c0E0d255543C095AC6D243B555e645D9"
+        "arb1:0xF9327276c0E0d255543C095AC6D243B555e645D9"
      directlyReceivedPermissions.2.from:
-        "arbitrum:0xF9327276c0E0d255543C095AC6D243B555e645D9"
+        "arb1:0xF9327276c0E0d255543C095AC6D243B555e645D9"
    }
```

```diff
    EOA  (0xED64BaA244A1Ba3e91bBA2712004b1732078EC4D) {
    +++ description: None
      receivedPermissions.0.from:
-        "arbitrum:0x1e751242C9CE10E165969EeD91E5D98587904aad"
+        "arb1:0x1e751242C9CE10E165969EeD91E5D98587904aad"
    }
```

```diff
    contract ProxyAdmin (0xf201805BD417f9E0d229A0C379c3e5B91bf18A8b) {
    +++ description: None
      directlyReceivedPermissions.0.from:
-        "arbitrum:0x12c0163237819Eb81c469F71Ea0672e3e8dbF6dB"
+        "arb1:0x12c0163237819Eb81c469F71Ea0672e3e8dbF6dB"
      directlyReceivedPermissions.1.from:
-        "arbitrum:0x1e751242C9CE10E165969EeD91E5D98587904aad"
+        "arb1:0x1e751242C9CE10E165969EeD91E5D98587904aad"
      directlyReceivedPermissions.2.from:
-        "arbitrum:0x46B6462301182B393ac5f014779687d3B6d4FB57"
+        "arb1:0x46B6462301182B393ac5f014779687d3B6d4FB57"
      directlyReceivedPermissions.3.from:
-        "arbitrum:0x67B01721383baedF4b27B745bf533F6F7bDc4AE4"
+        "arb1:0x67B01721383baedF4b27B745bf533F6F7bDc4AE4"
      directlyReceivedPermissions.4.from:
-        "arbitrum:0x6f857Cfcb32951cE5A6fAD7B809af8Bcbc3d551A"
+        "arb1:0x6f857Cfcb32951cE5A6fAD7B809af8Bcbc3d551A"
      directlyReceivedPermissions.5.from:
-        "arbitrum:0xa5e62aAC82Af6dA4Fd23ca5219132a7D941B4fe3"
+        "arb1:0xa5e62aAC82Af6dA4Fd23ca5219132a7D941B4fe3"
      directlyReceivedPermissions.6.from:
-        "arbitrum:0xC1bf6E0Ac80e92A331c4D448652C4824D4195459"
+        "arb1:0xC1bf6E0Ac80e92A331c4D448652C4824D4195459"
    }
```

Generated with discovered.json: 0x9a894f4a664ec3e523762f84cde11e55ea9e50fd

# Diff at Tue, 01 Jul 2025 12:12:28 GMT:

- chain: arbitrum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@835b5bf291c209782da0924189d08305334497d4 block: 336620777
- current block number: 353119830

## Description

caldera MS signer change.

## Watched changes

```diff
    contract Caldera Multisig 1 (0x6FD149B3d41fd860B9Da1A6fE54e902eF41F68BF) {
    +++ description: None
      values.$members.0:
-        "0xD61640d06dC7A61C46d9515680b4DDd2AC51E9A9"
+        "0xEC114946E7213d113c9B9481028271B5E9e09371"
    }
```

Generated with discovered.json: 0x9b964e133574fa43abf1fc0d918d97e74dab2fe3

# Diff at Wed, 18 Jun 2025 12:22:00 GMT:

- chain: arbitrum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@a8e4f22a1441bd5040898cc3d3d62b3582942b65 block: 336620777
- current block number: 336620777

## Description

config: wasmmoduleroot map updated.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 336620777 (main branch discovery), not current.

```diff
    contract RollupProxy (0xF9327276c0E0d255543C095AC6D243B555e645D9) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      usedTypes.0.arg.0xdb698a2576298f25448bc092e52cf13b1e24141c997135d70f217d674bbeb69a:
+        "ArbOS v40 wasmModuleRoot"
    }
```

Generated with discovered.json: 0xb96157028f777ee722284419d5f79c9293cf65a8

# Diff at Tue, 27 May 2025 08:31:03 GMT:

- chain: arbitrum
- author: Michał Podsiadły (<michal.podsiadly@l2beat.com>)
- comparing to: main@fd658a9ed4bbd45fc5705d23b1906ca057d0d8b0 block: 336620777
- current block number: 336620777

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 336620777 (main branch discovery), not current.

```diff
    contract RollupProxy (0xF9327276c0E0d255543C095AC6D243B555e645D9) {
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

Generated with discovered.json: 0x5b1d07468a0ef246935c8a0c613cbe7c2e79bc55

# Diff at Fri, 23 May 2025 09:41:11 GMT:

- chain: arbitrum
- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@69cd181abbc3c830a6caf2f4429b37cae72ffdb8 block: 336620777
- current block number: 336620777

## Description

Introduced .role field on each permission, defaulting to field name on which it was defined (with '.' prefix)

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 336620777 (main branch discovery), not current.

```diff
    contract Blessnet Multisig 2 (0x089E12e795b3292BcC16f29817bE124C720615b0) {
    +++ description: None
      receivedPermissions.1.permission:
-        "validate"
+        "fastconfirm"
      receivedPermissions.1.description:
-        "Can propose new state roots (called nodes) and challenge state roots on the host chain."
+        "Can finalize a state root before the challenge period has passed. This allows withdrawing from the bridge based on the state root."
      receivedPermissions.1.role:
+        ".anyTrustFastConfirmer"
      receivedPermissions.0.permission:
-        "fastconfirm"
+        "validate"
      receivedPermissions.0.description:
-        "Can finalize a state root before the challenge period has passed. This allows withdrawing from the bridge based on the state root."
+        "Can propose new state roots (called nodes) and challenge state roots on the host chain."
      receivedPermissions.0.role:
+        ".validators"
    }
```

```diff
    EOA  (0x27752e6B947e777E894c1b7E574Ca7593d6F2C49) {
    +++ description: None
      receivedPermissions.0.role:
+        ".validators"
    }
```

```diff
    EOA  (0x3D5cFeB6C99343793a8E112dF7D6c331F48e22De) {
    +++ description: None
      receivedPermissions.0.role:
+        ".validators"
    }
```

```diff
    contract Blessnet Multisig 1 (0x571D6CA61B979A967E055696c822CF8C928d3556) {
    +++ description: None
      receivedPermissions.0.role:
+        ".validators"
    }
```

```diff
    contract Caldera Multisig 1 (0x6FD149B3d41fd860B9Da1A6fE54e902eF41F68BF) {
    +++ description: None
      receivedPermissions.8.role:
+        "admin"
      receivedPermissions.7.role:
+        "admin"
      receivedPermissions.6.role:
+        "admin"
      receivedPermissions.5.role:
+        "admin"
      receivedPermissions.4.role:
+        "admin"
      receivedPermissions.3.role:
+        "admin"
      receivedPermissions.2.role:
+        "admin"
      receivedPermissions.1.role:
+        "admin"
      receivedPermissions.0.role:
+        ".owner"
      directlyReceivedPermissions.0.role:
+        ".executors"
    }
```

```diff
    EOA  (0x82Bc29d2a230d99261CFF7Dab9dAB27649784Fd9) {
    +++ description: None
      receivedPermissions.0.role:
+        ".validators"
    }
```

```diff
    EOA  (0xa0899d20D9665EB0FfE311A395FCd481bF38A5Ff) {
    +++ description: None
      receivedPermissions.0.role:
+        ".batchPosters"
    }
```

```diff
    contract UpgradeExecutor (0xa5e62aAC82Af6dA4Fd23ca5219132a7D941B4fe3) {
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
    EOA  (0xED64BaA244A1Ba3e91bBA2712004b1732078EC4D) {
    +++ description: None
      receivedPermissions.0.role:
+        ".batchPosterManager"
    }
```

```diff
    contract ProxyAdmin (0xf201805BD417f9E0d229A0C379c3e5B91bf18A8b) {
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

Generated with discovered.json: 0xe5c0aa0874ee47c2615c1371182e3cdf1fd28acd

# Diff at Tue, 06 May 2025 12:55:21 GMT:

- chain: arbitrum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@797a9ec756b28fc8b608c3143fbee4e577108cbc block: 330085907
- current block number: 333851321

## Description

Upgrade to known contract (project archived).

## Watched changes

```diff
    contract SequencerInbox (0x1e751242C9CE10E165969EeD91E5D98587904aad) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      sourceHashes.0:
-        "0x50cf57b01499408fa99da27cf0fee96ec30f0d40667d1aa090c442bc80f0636b"
+        "0x6bb86ac4bd0d31e049f543fcf0a8f94c952252222f115246ef9d5b8104d803cc"
      values.$implementation:
-        "0xB8bAb420bf84B9706d8fCbfd3b3755A929A387FD"
+        "0xAb468d23BaBD01E57eCc776bEE246938E6a6e9E2"
      values.$pastUpgrades.1:
+        ["2024-08-09T00:09:45.000Z","0x74a7d47d00c5aaffa51d86eb0d5ac1273332a17730ccbd9ee303253521f03a15",["0xB8bAb420bf84B9706d8fCbfd3b3755A929A387FD"]]
      values.$pastUpgrades.0.2:
-        "2024-08-09T00:09:45.000Z"
+        "0xc482ea9dc5e8e9c3c826ff993b9febcaa1dd0e7d941121964024a2cbd837ba6d"
      values.$pastUpgrades.0.1:
-        "0x74a7d47d00c5aaffa51d86eb0d5ac1273332a17730ccbd9ee303253521f03a15"
+        ["0xAb468d23BaBD01E57eCc776bEE246938E6a6e9E2"]
      values.$pastUpgrades.0.0:
-        ["0xB8bAb420bf84B9706d8fCbfd3b3755A929A387FD"]
+        "2025-05-05T13:44:26.000Z"
      values.$upgradeCount:
-        1
+        2
    }
```

```diff
    contract Inbox (0x46B6462301182B393ac5f014779687d3B6d4FB57) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      sourceHashes.0:
-        "0xcb390b491549387c8fcc09fb22fbea7adf54cc74b7247a0c738369ddd7049b92"
+        "0x25984fdfffb8141859c99299fb29e7a7460732d77111e5fe23792baa99f336a3"
      values.$implementation:
-        "0x7fbC83A3e374E4D334A32029ffE4641c8045be1D"
+        "0xBA5eFa428c1b281FF4A40e81479bdcBB83119A63"
      values.$pastUpgrades.1:
+        ["2024-08-09T00:09:45.000Z","0x74a7d47d00c5aaffa51d86eb0d5ac1273332a17730ccbd9ee303253521f03a15",["0x7fbC83A3e374E4D334A32029ffE4641c8045be1D"]]
      values.$pastUpgrades.0.2.0:
-        "0x7fbC83A3e374E4D334A32029ffE4641c8045be1D"
+        "0xBA5eFa428c1b281FF4A40e81479bdcBB83119A63"
      values.$pastUpgrades.0.1:
-        "2024-08-09T00:09:45.000Z"
+        "0xc482ea9dc5e8e9c3c826ff993b9febcaa1dd0e7d941121964024a2cbd837ba6d"
      values.$pastUpgrades.0.0:
-        "0x74a7d47d00c5aaffa51d86eb0d5ac1273332a17730ccbd9ee303253521f03a15"
+        "2025-05-05T13:44:26.000Z"
      values.$upgradeCount:
-        1
+        2
    }
```

## Source code changes

```diff
.../Inbox/ERC20Inbox.sol                           | 92 +++++++++++++++++++---
 .../SequencerInbox/SequencerInbox.sol              | 24 ++++--
 2 files changed, 98 insertions(+), 18 deletions(-)
```

Generated with discovered.json: 0x250923467ab3160257f2d288a16b7af411e842b5

# Diff at Fri, 02 May 2025 17:25:16 GMT:

- chain: arbitrum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@c598e33a0c469175b7abbd6c2a13b47b63d6b6a4 block: 330085907
- current block number: 330085907

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 330085907 (main branch discovery), not current.

```diff
    contract RollupProxy (0xF9327276c0E0d255543C095AC6D243B555e645D9) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      usedTypes.0.arg.0xaf1dbdfceb871c00bfbb1675983133df04f0ed04e89647812513c091e3a982b3:
+        "Celestia Nitro 3.3.2 wasmModuleRoot"
    }
```

Generated with discovered.json: 0x019a872f51728a1d74b4afa48d62aab2ca60448f

# Diff at Tue, 29 Apr 2025 08:19:19 GMT:

- chain: arbitrum
- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@ef7477af00fe0b57a2f7cacf7e958c12494af662 block: 330085907
- current block number: 330085907

## Description

Field .issuedPermissions is removed from the output as no longer needed. Added 'permissionsConfigHash' due to refactoring of the modelling process (into a separate command).

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 330085907 (main branch discovery), not current.

```diff
    contract Outbox (0x12c0163237819Eb81c469F71Ea0672e3e8dbF6dB) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x6FD149B3d41fd860B9Da1A6fE54e902eF41F68BF","via":[{"address":"0xa5e62aAC82Af6dA4Fd23ca5219132a7D941B4fe3"},{"address":"0xf201805BD417f9E0d229A0C379c3e5B91bf18A8b"}]}]
    }
```

```diff
    contract SequencerInbox (0x1e751242C9CE10E165969EeD91E5D98587904aad) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      issuedPermissions:
-        [{"permission":"interact","to":"0xED64BaA244A1Ba3e91bBA2712004b1732078EC4D","description":"Add/remove batchPosters (Sequencers).","via":[]},{"permission":"sequence","to":"0xa0899d20D9665EB0FfE311A395FCd481bF38A5Ff","description":"Can submit transaction batches or commitments to the SequencerInbox contract on the host chain.","via":[]},{"permission":"upgrade","to":"0x6FD149B3d41fd860B9Da1A6fE54e902eF41F68BF","via":[{"address":"0xa5e62aAC82Af6dA4Fd23ca5219132a7D941B4fe3"},{"address":"0xf201805BD417f9E0d229A0C379c3e5B91bf18A8b"}]}]
    }
```

```diff
    contract Inbox (0x46B6462301182B393ac5f014779687d3B6d4FB57) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x6FD149B3d41fd860B9Da1A6fE54e902eF41F68BF","via":[{"address":"0xa5e62aAC82Af6dA4Fd23ca5219132a7D941B4fe3"},{"address":"0xf201805BD417f9E0d229A0C379c3e5B91bf18A8b"}]}]
    }
```

```diff
    contract RollupEventInbox (0x67B01721383baedF4b27B745bf533F6F7bDc4AE4) {
    +++ description: Helper contract sending configuration data over the bridge during the systems initialization.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x6FD149B3d41fd860B9Da1A6fE54e902eF41F68BF","via":[{"address":"0xa5e62aAC82Af6dA4Fd23ca5219132a7D941B4fe3"},{"address":"0xf201805BD417f9E0d229A0C379c3e5B91bf18A8b"}]}]
    }
```

```diff
    contract ChallengeManager (0x6f857Cfcb32951cE5A6fAD7B809af8Bcbc3d551A) {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x6FD149B3d41fd860B9Da1A6fE54e902eF41F68BF","via":[{"address":"0xa5e62aAC82Af6dA4Fd23ca5219132a7D941B4fe3"},{"address":"0xf201805BD417f9E0d229A0C379c3e5B91bf18A8b"}]}]
    }
```

```diff
    contract UpgradeExecutor (0xa5e62aAC82Af6dA4Fd23ca5219132a7D941B4fe3) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x6FD149B3d41fd860B9Da1A6fE54e902eF41F68BF","via":[{"address":"0xa5e62aAC82Af6dA4Fd23ca5219132a7D941B4fe3"},{"address":"0xf201805BD417f9E0d229A0C379c3e5B91bf18A8b"}]}]
    }
```

```diff
    contract Bridge (0xC1bf6E0Ac80e92A331c4D448652C4824D4195459) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x6FD149B3d41fd860B9Da1A6fE54e902eF41F68BF","via":[{"address":"0xa5e62aAC82Af6dA4Fd23ca5219132a7D941B4fe3"},{"address":"0xf201805BD417f9E0d229A0C379c3e5B91bf18A8b"}]}]
    }
```

```diff
    contract RollupProxy (0xF9327276c0E0d255543C095AC6D243B555e645D9) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      issuedPermissions:
-        [{"permission":"fastconfirm","to":"0x089E12e795b3292BcC16f29817bE124C720615b0","description":"Can finalize a state root before the challenge period has passed. This allows withdrawing from the bridge based on the state root.","via":[]},{"permission":"interact","to":"0x6FD149B3d41fd860B9Da1A6fE54e902eF41F68BF","description":"Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes.","via":[{"address":"0xa5e62aAC82Af6dA4Fd23ca5219132a7D941B4fe3"}]},{"permission":"upgrade","to":"0x6FD149B3d41fd860B9Da1A6fE54e902eF41F68BF","via":[{"address":"0xa5e62aAC82Af6dA4Fd23ca5219132a7D941B4fe3"}]},{"permission":"validate","to":"0x089E12e795b3292BcC16f29817bE124C720615b0","description":"Can propose new state roots (called nodes) and challenge state roots on the host chain.","via":[]},{"permission":"validate","to":"0x27752e6B947e777E894c1b7E574Ca7593d6F2C49","description":"Can propose new state roots (called nodes) and challenge state roots on the host chain.","via":[]},{"permission":"validate","to":"0x3D5cFeB6C99343793a8E112dF7D6c331F48e22De","description":"Can propose new state roots (called nodes) and challenge state roots on the host chain.","via":[]},{"permission":"validate","to":"0x571D6CA61B979A967E055696c822CF8C928d3556","description":"Can propose new state roots (called nodes) and challenge state roots on the host chain.","via":[]},{"permission":"validate","to":"0x82Bc29d2a230d99261CFF7Dab9dAB27649784Fd9","description":"Can propose new state roots (called nodes) and challenge state roots on the host chain.","via":[]}]
    }
```

Generated with discovered.json: 0x2e7724ce92b3fad5685fa54c301cc7c3f691f775

# Diff at Fri, 25 Apr 2025 13:56:54 GMT:

- chain: arbitrum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@c29f37e6f9358f91b847d140615c705e0d4deb52 block: 322452556
- current block number: 330085907

## Description

Upgrade to known bridge implementation with minimal changes.

## Watched changes

```diff
    contract Bridge (0xC1bf6E0Ac80e92A331c4D448652C4824D4195459) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      sourceHashes.0:
-        "0x6cdca102c8d3b82c196bf1961cd07e35b44717396edbfdd3241adc89ab895438"
+        "0x32c73666d391a33c17183e4ab20bcb0f2b925d8a99da436d2ff99c13f403e289"
      values.$implementation:
-        "0xF0bb18D200D4CB7b36853Eaa0D902F729B4602AB"
+        "0xeF960375235AbFab045c4A7324295612739569EB"
      values.$pastUpgrades.1:
+        ["2024-08-09T00:09:45.000Z","0x74a7d47d00c5aaffa51d86eb0d5ac1273332a17730ccbd9ee303253521f03a15",["0xF0bb18D200D4CB7b36853Eaa0D902F729B4602AB"]]
      values.$pastUpgrades.0.2.0:
-        "0xF0bb18D200D4CB7b36853Eaa0D902F729B4602AB"
+        "0xeF960375235AbFab045c4A7324295612739569EB"
      values.$pastUpgrades.0.1:
-        "2024-08-09T00:09:45.000Z"
+        "0x1886d4d0e9c54cd3e04d16cad30e1f4041ae2a109c2341587f8c5736e4ad6ca0"
      values.$pastUpgrades.0.0:
-        "0x74a7d47d00c5aaffa51d86eb0d5ac1273332a17730ccbd9ee303253521f03a15"
+        "2025-04-24T21:39:59.000Z"
      values.$upgradeCount:
-        1
+        2
      values.nativeTokenDecimals:
+        18
    }
```

## Source code changes

```diff
.../Bridge/ERC20Bridge.sol                         | 37 +++++++++++++++++++---
 1 file changed, 32 insertions(+), 5 deletions(-)
```

Generated with discovered.json: 0xdd14a69beb24e5cb61e9808820318c156c3f8589

# Diff at Mon, 31 Mar 2025 12:44:02 GMT:

- chain: arbitrum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@71ffebe835be10b6d5d09ef65aa19b910de8a2ec block: 308389533
- current block number: 321461043

## Description

back from the dead. the operator had stopped posting batches but is now active again (headerwarn removed, incident added).

## Watched changes

```diff
    contract Blessnet Multisig 2 (0x089E12e795b3292BcC16f29817bE124C720615b0) {
    +++ description: None
      receivedPermissions.1:
+        {"permission":"validate","from":"0xF9327276c0E0d255543C095AC6D243B555e645D9","description":"Can propose new state roots (called nodes) and challenge state roots on the host chain."}
      receivedPermissions.0.permission:
-        "validate"
+        "fastconfirm"
      receivedPermissions.0.description:
-        "Can propose new state roots (called nodes) and challenge state roots on the host chain."
+        "Can finalize a state root before the challenge period has passed. This allows withdrawing from the bridge based on the state root."
    }
```

```diff
    contract Blessnet Multisig 1 (0x571D6CA61B979A967E055696c822CF8C928d3556) {
    +++ description: None
      receivedPermissions.1:
-        {"permission":"validate","from":"0xF9327276c0E0d255543C095AC6D243B555e645D9","description":"Can propose new state roots (called nodes) and challenge state roots on the host chain."}
      receivedPermissions.0.permission:
-        "fastconfirm"
+        "validate"
      receivedPermissions.0.description:
-        "Can finalize a state root before the challenge period has passed. This allows withdrawing from the bridge based on the state root."
+        "Can propose new state roots (called nodes) and challenge state roots on the host chain."
    }
```

```diff
    contract RollupProxy (0xF9327276c0E0d255543C095AC6D243B555e645D9) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      issuedPermissions.4.permission:
-        "validate"
+        "fastconfirm"
      issuedPermissions.4.to:
-        "0x3D5cFeB6C99343793a8E112dF7D6c331F48e22De"
+        "0x089E12e795b3292BcC16f29817bE124C720615b0"
      issuedPermissions.4.description:
-        "Can propose new state roots (called nodes) and challenge state roots on the host chain."
+        "Can finalize a state root before the challenge period has passed. This allows withdrawing from the bridge based on the state root."
      issuedPermissions.3.to:
-        "0x571D6CA61B979A967E055696c822CF8C928d3556"
+        "0x3D5cFeB6C99343793a8E112dF7D6c331F48e22De"
      issuedPermissions.2.to:
-        "0x27752e6B947e777E894c1b7E574Ca7593d6F2C49"
+        "0x571D6CA61B979A967E055696c822CF8C928d3556"
      issuedPermissions.1.permission:
-        "interact"
+        "validate"
      issuedPermissions.1.to:
-        "0x6FD149B3d41fd860B9Da1A6fE54e902eF41F68BF"
+        "0x27752e6B947e777E894c1b7E574Ca7593d6F2C49"
      issuedPermissions.1.description:
-        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
+        "Can propose new state roots (called nodes) and challenge state roots on the host chain."
      issuedPermissions.1.via.0:
-        {"address":"0xa5e62aAC82Af6dA4Fd23ca5219132a7D941B4fe3"}
      issuedPermissions.0.permission:
-        "fastconfirm"
+        "interact"
      issuedPermissions.0.to:
-        "0x571D6CA61B979A967E055696c822CF8C928d3556"
+        "0x6FD149B3d41fd860B9Da1A6fE54e902eF41F68BF"
      issuedPermissions.0.description:
-        "Can finalize a state root before the challenge period has passed. This allows withdrawing from the bridge based on the state root."
+        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
      issuedPermissions.0.via.0:
+        {"address":"0xa5e62aAC82Af6dA4Fd23ca5219132a7D941B4fe3"}
      values.anyTrustFastConfirmer:
-        "0x571D6CA61B979A967E055696c822CF8C928d3556"
+        "0x089E12e795b3292BcC16f29817bE124C720615b0"
      values.latestConfirmed:
-        43200
+        46896
+++ description: Minimum time delta between newly created nodes (stateUpdates). This is checked on `stakeOnNewNode()`. Format is number of ETHEREUM blocks, even for L3s. 
      values.minimumAssertionPeriod:
-        2
+        75
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 308389533 (main branch discovery), not current.

```diff
    contract Blessnet Multisig 2 (0x089E12e795b3292BcC16f29817bE124C720615b0) {
    +++ description: None
      name:
-        "GnosisSafeL2"
+        "Blessnet Multisig 2"
    }
```

```diff
    contract Blessnet Multisig 1 (0x571D6CA61B979A967E055696c822CF8C928d3556) {
    +++ description: None
      name:
-        "BlessnetFastconfirmerMultisig"
+        "Blessnet Multisig 1"
    }
```

```diff
    contract RollupProxy (0xF9327276c0E0d255543C095AC6D243B555e645D9) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      fieldMeta.latestConfirmed:
-        {"severity":"HIGH","description":"Was dead, now alive? Remove headerWarn if yes."}
    }
```

Generated with discovered.json: 0x2019da9e85fd856dde049330e7848c9983811df2

# Diff at Tue, 18 Mar 2025 08:14:49 GMT:

- chain: arbitrum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@4ef7a8dbcec1cd9fec77aae2b73d81347a4ffb13 block: 308389533
- current block number: 308389533

## Description

Config: change Multisig names.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 308389533 (main branch discovery), not current.

```diff
    contract Caldera Multisig 1 (0x6FD149B3d41fd860B9Da1A6fE54e902eF41F68BF) {
    +++ description: None
      name:
-        "Caldera Multisig"
+        "Caldera Multisig 1"
    }
```

Generated with discovered.json: 0x828617f1690d350173f7280fa1b1b4a9433d854b

# Diff at Thu, 06 Mar 2025 14:21:28 GMT:

- chain: arbitrum
- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@454ef41fea41bcea030780b23fd1f11519ff78d2 block: 308389533
- current block number: 308389533

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 308389533 (main branch discovery), not current.

```diff
    contract RollupProxy (0xF9327276c0E0d255543C095AC6D243B555e645D9) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      values.isPostBoLD:
+        false
    }
```

Generated with discovered.json: 0x52d77bfb12bfa7d9637ac04870fd38c26829a49b

# Diff at Thu, 06 Mar 2025 09:39:09 GMT:

- chain: arbitrum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@7119c715545bc86a4194761f42815f811ac6307a block: 308389533
- current block number: 308389533

## Description

Config related: set severity for arbitrum inbox/outbox changes to high and add historical In- and Outboxes via events.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 308389533 (main branch discovery), not current.

```diff
    contract Bridge (0xC1bf6E0Ac80e92A331c4D448652C4824D4195459) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
+++ description: All Inboxes that were ever set as allowed in the bridge.
+++ severity: HIGH
      values.inboxHistory:
+        ["0x46B6462301182B393ac5f014779687d3B6d4FB57","0x67B01721383baedF4b27B745bf533F6F7bDc4AE4"]
+++ description: All Outboxes that were ever set as allowed in the bridge.
+++ severity: HIGH
      values.outboxHistory:
+        ["0x12c0163237819Eb81c469F71Ea0672e3e8dbF6dB"]
      fieldMeta:
+        {"allowedOutboxList":{"severity":"HIGH","description":"Can make calls as the bridge, steal all funds."},"outboxHistory":{"severity":"HIGH","description":"All Outboxes that were ever set as allowed in the bridge."},"allowedDelayedInboxList":{"severity":"HIGH","description":"Allowed to mint the gastoken on L2 and call `enqueueDelayedMessage()` on the bridge."},"inboxHistory":{"severity":"HIGH","description":"All Inboxes that were ever set as allowed in the bridge."}}
    }
```

Generated with discovered.json: 0x477b30be05c4f1dc48cb881f319737733325fc5d

# Diff at Tue, 04 Mar 2025 10:40:22 GMT:

- chain: arbitrum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@98d260b45fe0d2195ce5e629bd7b200c8706e8ba block: 308389533
- current block number: 308389533

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 308389533 (main branch discovery), not current.

```diff
    contract GnosisSafeL2 (0x089E12e795b3292BcC16f29817bE124C720615b0) {
    +++ description: None
      sinceBlock:
+        307810635
    }
```

```diff
    contract OneStepProofEntry (0x0BEfa8F5F1e3bf8e02d874375A43EA75AeD9CD39) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      sinceBlock:
+        264456669
    }
```

```diff
    contract OneStepProver0 (0x0Ecfe9f90a06F74935f751077E24C2057B7C9a2f) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      sinceBlock:
+        264456643
    }
```

```diff
    contract Outbox (0x12c0163237819Eb81c469F71Ea0672e3e8dbF6dB) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
      sinceBlock:
+        240884142
    }
```

```diff
    contract SequencerInbox (0x1e751242C9CE10E165969EeD91E5D98587904aad) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      sinceBlock:
+        240884142
    }
```

```diff
    contract OneStepProverHostIo (0x3537Ab400c0275c93569d2c505ADb72804985393) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      sinceBlock:
+        264456662
    }
```

```diff
    contract Inbox (0x46B6462301182B393ac5f014779687d3B6d4FB57) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      sinceBlock:
+        240884142
    }
```

```diff
    contract BlessnetFastconfirmerMultisig (0x571D6CA61B979A967E055696c822CF8C928d3556) {
    +++ description: None
      sinceBlock:
+        268984071
    }
```

```diff
    contract RollupEventInbox (0x67B01721383baedF4b27B745bf533F6F7bDc4AE4) {
    +++ description: Helper contract sending configuration data over the bridge during the systems initialization.
      sinceBlock:
+        240884142
    }
```

```diff
    contract ChallengeManager (0x6f857Cfcb32951cE5A6fAD7B809af8Bcbc3d551A) {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      sinceBlock:
+        240884142
    }
```

```diff
    contract Caldera Multisig (0x6FD149B3d41fd860B9Da1A6fE54e902eF41F68BF) {
    +++ description: None
      sinceBlock:
+        187813903
    }
```

```diff
    contract OneStepProverMemory (0x8711CA24591aEF3bEEC3A9cB9CE41939822366f3) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      sinceBlock:
+        264456649
    }
```

```diff
    contract ValidatorUtils (0x9A3464863213C218D7cb7BaA6e69C0461E0Cbc08) {
    +++ description: This contract implements view only utilities for validators.
      sinceBlock:
+        224300853
    }
```

```diff
    contract UpgradeExecutor (0xa5e62aAC82Af6dA4Fd23ca5219132a7D941B4fe3) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      sinceBlock:
+        240884142
    }
```

```diff
    contract OneStepProverMath (0xbBe221554441F1d2d5A963A67789ce5893dCf451) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      sinceBlock:
+        264456655
    }
```

```diff
    contract Bridge (0xC1bf6E0Ac80e92A331c4D448652C4824D4195459) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      sinceBlock:
+        240884142
    }
```

```diff
    contract ProxyAdmin (0xf201805BD417f9E0d229A0C379c3e5B91bf18A8b) {
    +++ description: None
      sinceBlock:
+        240884142
    }
```

```diff
    contract RollupProxy (0xF9327276c0E0d255543C095AC6D243B555e645D9) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      sinceBlock:
+        240884142
    }
```

Generated with discovered.json: 0x5ca5b98b16cb13c7462efb657c468157b8aff6cb

# Diff at Thu, 27 Feb 2025 11:47:22 GMT:

- chain: arbitrum
- author: Michał Podsiadły (<michal.podsiadly@l2beat.com>)
- comparing to: main@a4b50e45bb44f8ceeea29f9236088d26a843c885 block: 308389533
- current block number: 308389533

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 308389533 (main branch discovery), not current.

```diff
    contract Outbox (0x12c0163237819Eb81c469F71Ea0672e3e8dbF6dB) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
      name:
-        "ERC20Outbox"
+        "Outbox"
      displayName:
-        "Outbox"
    }
```

```diff
    contract Inbox (0x46B6462301182B393ac5f014779687d3B6d4FB57) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      name:
-        "ERC20Inbox"
+        "Inbox"
      displayName:
-        "Inbox"
    }
```

```diff
    contract RollupEventInbox (0x67B01721383baedF4b27B745bf533F6F7bDc4AE4) {
    +++ description: Helper contract sending configuration data over the bridge during the systems initialization.
      name:
-        "ERC20RollupEventInbox"
+        "RollupEventInbox"
      displayName:
-        "RollupEventInbox"
    }
```

```diff
    contract Bridge (0xC1bf6E0Ac80e92A331c4D448652C4824D4195459) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      name:
-        "ERC20Bridge"
+        "Bridge"
      displayName:
-        "Bridge"
    }
```

Generated with discovered.json: 0xf76ceec34efab8b820bf6d548bdadd938f094895

# Diff at Fri, 21 Feb 2025 14:12:23 GMT:

- chain: arbitrum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@d219f271711b2cf7a164e3443bead5e4957d13a8 block: 305262432
- current block number: 308389533

## Description

Config related: Change some severities and add templates.

## Watched changes

```diff
    contract RollupProxy (0xF9327276c0E0d255543C095AC6D243B555e645D9) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      issuedPermissions.7:
+        {"permission":"validate","to":"0x82Bc29d2a230d99261CFF7Dab9dAB27649784Fd9","description":"Can propose new state roots (called nodes) and challenge state roots on the host chain.","via":[]}
      issuedPermissions.6.to:
-        "0x82Bc29d2a230d99261CFF7Dab9dAB27649784Fd9"
+        "0x571D6CA61B979A967E055696c822CF8C928d3556"
      issuedPermissions.5.to:
-        "0x571D6CA61B979A967E055696c822CF8C928d3556"
+        "0x3D5cFeB6C99343793a8E112dF7D6c331F48e22De"
      issuedPermissions.4.to:
-        "0x3D5cFeB6C99343793a8E112dF7D6c331F48e22De"
+        "0x27752e6B947e777E894c1b7E574Ca7593d6F2C49"
      issuedPermissions.3.to:
-        "0x27752e6B947e777E894c1b7E574Ca7593d6F2C49"
+        "0x089E12e795b3292BcC16f29817bE124C720615b0"
+++ description: Increments on each Validator change.
      values.setValidatorCount:
-        3
+        4
      values.validators.4:
+        "0x82Bc29d2a230d99261CFF7Dab9dAB27649784Fd9"
      values.validators.3:
-        "0x82Bc29d2a230d99261CFF7Dab9dAB27649784Fd9"
+        "0x571D6CA61B979A967E055696c822CF8C928d3556"
      values.validators.2:
-        "0x571D6CA61B979A967E055696c822CF8C928d3556"
+        "0x3D5cFeB6C99343793a8E112dF7D6c331F48e22De"
      values.validators.1:
-        "0x3D5cFeB6C99343793a8E112dF7D6c331F48e22De"
+        "0x27752e6B947e777E894c1b7E574Ca7593d6F2C49"
      values.validators.0:
-        "0x27752e6B947e777E894c1b7E574Ca7593d6F2C49"
+        "0x089E12e795b3292BcC16f29817bE124C720615b0"
    }
```

```diff
+   Status: CREATED
    contract GnosisSafeL2 (0x089E12e795b3292BcC16f29817bE124C720615b0)
    +++ description: None
```

## Source code changes

```diff
.../arbitrum/.flat/GnosisSafeL2/GnosisSafeL2.sol   | 1032 ++++++++++++++++++++
 .../.flat/GnosisSafeL2/GnosisSafeProxy.p.sol       |   35 +
 2 files changed, 1067 insertions(+)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 305262432 (main branch discovery), not current.

```diff
    contract ERC20Outbox (0x12c0163237819Eb81c469F71Ea0672e3e8dbF6dB) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
      category:
+        {"name":"Canonical Bridges","priority":2}
    }
```

```diff
    contract SequencerInbox (0x1e751242C9CE10E165969EeD91E5D98587904aad) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract ERC20Inbox (0x46B6462301182B393ac5f014779687d3B6d4FB57) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      category:
+        {"name":"Canonical Bridges","priority":2}
    }
```

```diff
    contract ChallengeManager (0x6f857Cfcb32951cE5A6fAD7B809af8Bcbc3d551A) {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract UpgradeExecutor (0xa5e62aAC82Af6dA4Fd23ca5219132a7D941B4fe3) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      category:
+        {"name":"Governance","priority":3}
    }
```

```diff
    contract ERC20Bridge (0xC1bf6E0Ac80e92A331c4D448652C4824D4195459) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract RollupProxy (0xF9327276c0E0d255543C095AC6D243B555e645D9) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      fieldMeta.latestConfirmed:
+        {"severity":"HIGH","description":"Was dead, now alive? Remove headerWarn if yes."}
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

Generated with discovered.json: 0x87f82d7e0ed70c354beb52e5014a0188de5db681

# Diff at Sun, 09 Feb 2025 08:48:14 GMT:

- chain: arbitrum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@ef01ea79812e0d524af00be3fae1170cef6fd662 block: 302816612
- current block number: 304208966

## Description

Increase stake requirement (for orbit validators).

## Watched changes

```diff
    contract RollupProxy (0xF9327276c0E0d255543C095AC6D243B555e645D9) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      values.currentRequiredStake:
-        "300000000000000000"
+        "500000000000000000"
    }
```

Generated with discovered.json: 0x09e958ab16068dbfc6aefa91ed1dcefd93f10d2e

# Diff at Wed, 05 Feb 2025 07:24:38 GMT:

- chain: arbitrum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@24a3610845e7ae2b3cc2daf90feff25e498e4068 block: 301169405
- current block number: 302816612

## Description

Increase stake requirement (for orbit validators) by 50%.

## Watched changes

```diff
    contract RollupProxy (0xF9327276c0E0d255543C095AC6D243B555e645D9) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      values.currentRequiredStake:
-        "200000000000000000"
+        "300000000000000000"
    }
```

Generated with discovered.json: 0xc02bc721274adb26749f9e07433b8298f8caa435

# Diff at Tue, 04 Feb 2025 12:33:53 GMT:

- chain: arbitrum
- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@145553eed7ba44636411ecb25e4099728acd02f9 block: 301169405
- current block number: 301169405

## Description

Rename 'configure' permission to 'interact'

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 301169405 (main branch discovery), not current.

```diff
    contract SequencerInbox (0x1e751242C9CE10E165969EeD91E5D98587904aad) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      issuedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract Caldera Multisig (0x6FD149B3d41fd860B9Da1A6fE54e902eF41F68BF) {
    +++ description: None
      receivedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract UpgradeExecutor (0xa5e62aAC82Af6dA4Fd23ca5219132a7D941B4fe3) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      directlyReceivedPermissions.1.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract RollupProxy (0xF9327276c0E0d255543C095AC6D243B555e645D9) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      issuedPermissions.1.permission:
-        "fastconfirm"
+        "interact"
      issuedPermissions.1.to:
-        "0x571D6CA61B979A967E055696c822CF8C928d3556"
+        "0x6FD149B3d41fd860B9Da1A6fE54e902eF41F68BF"
      issuedPermissions.1.description:
-        "Can finalize a state root before the challenge period has passed. This allows withdrawing from the bridge based on the state root."
+        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
      issuedPermissions.1.via.0:
+        {"address":"0xa5e62aAC82Af6dA4Fd23ca5219132a7D941B4fe3"}
      issuedPermissions.0.permission:
-        "configure"
+        "fastconfirm"
      issuedPermissions.0.to:
-        "0x6FD149B3d41fd860B9Da1A6fE54e902eF41F68BF"
+        "0x571D6CA61B979A967E055696c822CF8C928d3556"
      issuedPermissions.0.description:
-        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
+        "Can finalize a state root before the challenge period has passed. This allows withdrawing from the bridge based on the state root."
      issuedPermissions.0.via.0:
-        {"address":"0xa5e62aAC82Af6dA4Fd23ca5219132a7D941B4fe3"}
    }
```

Generated with discovered.json: 0x7998bcee94bba4214905ed60316b03ee7c4c0dca

# Diff at Fri, 31 Jan 2025 11:51:34 GMT:

- chain: arbitrum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@84b1296dd423a2ef9361874d922cd6911109ba10 block: 287770706
- current block number: 301169405

## Description

Stake for validators doubled, currently there are 4 on the whitelist.

## Watched changes

```diff
    contract RollupProxy (0xF9327276c0E0d255543C095AC6D243B555e645D9) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      values.currentRequiredStake:
-        "100000000000000000"
+        "200000000000000000"
    }
```

Generated with discovered.json: 0x7cf62a85adea8167176ea9fddb84e1168b9915ac

# Diff at Mon, 20 Jan 2025 11:10:28 GMT:

- chain: arbitrum
- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@2c8b4f3d9910bb6371be9b4df87b70856e7d8c64 block: 287770706
- current block number: 287770706

## Description

Rerun on the same block number. Applies fixes to permissions and via field. Renames permission's target to to/from.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 287770706 (main branch discovery), not current.

```diff
    contract ERC20Outbox (0x12c0163237819Eb81c469F71Ea0672e3e8dbF6dB) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
      issuedPermissions.0.target:
-        "0x6FD149B3d41fd860B9Da1A6fE54e902eF41F68BF"
      issuedPermissions.0.via.1.delay:
-        0
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x6FD149B3d41fd860B9Da1A6fE54e902eF41F68BF"
    }
```

```diff
    contract SequencerInbox (0x1e751242C9CE10E165969EeD91E5D98587904aad) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      issuedPermissions.2.target:
-        "0x6FD149B3d41fd860B9Da1A6fE54e902eF41F68BF"
      issuedPermissions.2.via.1.delay:
-        0
      issuedPermissions.2.via.0.delay:
-        0
      issuedPermissions.2.to:
+        "0x6FD149B3d41fd860B9Da1A6fE54e902eF41F68BF"
      issuedPermissions.1.target:
-        "0xa0899d20D9665EB0FfE311A395FCd481bF38A5Ff"
      issuedPermissions.1.to:
+        "0xa0899d20D9665EB0FfE311A395FCd481bF38A5Ff"
      issuedPermissions.1.description:
+        "Can submit transaction batches or commitments to the SequencerInbox contract on the host chain."
      issuedPermissions.0.target:
-        "0xED64BaA244A1Ba3e91bBA2712004b1732078EC4D"
      issuedPermissions.0.to:
+        "0xED64BaA244A1Ba3e91bBA2712004b1732078EC4D"
      issuedPermissions.0.description:
+        "Add/remove batchPosters (Sequencers)."
    }
```

```diff
    contract ERC20Inbox (0x46B6462301182B393ac5f014779687d3B6d4FB57) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      issuedPermissions.0.target:
-        "0x6FD149B3d41fd860B9Da1A6fE54e902eF41F68BF"
      issuedPermissions.0.via.1.delay:
-        0
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x6FD149B3d41fd860B9Da1A6fE54e902eF41F68BF"
    }
```

```diff
    contract BlessnetFastconfirmerMultisig (0x571D6CA61B979A967E055696c822CF8C928d3556) {
    +++ description: None
      receivedPermissions.1.target:
-        "0xF9327276c0E0d255543C095AC6D243B555e645D9"
      receivedPermissions.1.from:
+        "0xF9327276c0E0d255543C095AC6D243B555e645D9"
      receivedPermissions.0.target:
-        "0xF9327276c0E0d255543C095AC6D243B555e645D9"
      receivedPermissions.0.from:
+        "0xF9327276c0E0d255543C095AC6D243B555e645D9"
    }
```

```diff
    contract ERC20RollupEventInbox (0x67B01721383baedF4b27B745bf533F6F7bDc4AE4) {
    +++ description: Helper contract sending configuration data over the bridge during the systems initialization.
      issuedPermissions.0.target:
-        "0x6FD149B3d41fd860B9Da1A6fE54e902eF41F68BF"
      issuedPermissions.0.via.1.delay:
-        0
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x6FD149B3d41fd860B9Da1A6fE54e902eF41F68BF"
    }
```

```diff
    contract ChallengeManager (0x6f857Cfcb32951cE5A6fAD7B809af8Bcbc3d551A) {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      issuedPermissions.0.target:
-        "0x6FD149B3d41fd860B9Da1A6fE54e902eF41F68BF"
      issuedPermissions.0.via.1.delay:
-        0
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x6FD149B3d41fd860B9Da1A6fE54e902eF41F68BF"
    }
```

```diff
    contract Caldera Multisig (0x6FD149B3d41fd860B9Da1A6fE54e902eF41F68BF) {
    +++ description: None
      receivedPermissions.8.target:
-        "0xF9327276c0E0d255543C095AC6D243B555e645D9"
      receivedPermissions.8.from:
+        "0xF9327276c0E0d255543C095AC6D243B555e645D9"
      receivedPermissions.7.target:
-        "0xC1bf6E0Ac80e92A331c4D448652C4824D4195459"
      receivedPermissions.7.from:
+        "0xC1bf6E0Ac80e92A331c4D448652C4824D4195459"
      receivedPermissions.6.target:
-        "0xa5e62aAC82Af6dA4Fd23ca5219132a7D941B4fe3"
      receivedPermissions.6.from:
+        "0xa5e62aAC82Af6dA4Fd23ca5219132a7D941B4fe3"
      receivedPermissions.5.target:
-        "0x6f857Cfcb32951cE5A6fAD7B809af8Bcbc3d551A"
      receivedPermissions.5.from:
+        "0x6f857Cfcb32951cE5A6fAD7B809af8Bcbc3d551A"
      receivedPermissions.4.target:
-        "0x67B01721383baedF4b27B745bf533F6F7bDc4AE4"
      receivedPermissions.4.from:
+        "0x67B01721383baedF4b27B745bf533F6F7bDc4AE4"
      receivedPermissions.3.target:
-        "0x46B6462301182B393ac5f014779687d3B6d4FB57"
      receivedPermissions.3.from:
+        "0x46B6462301182B393ac5f014779687d3B6d4FB57"
      receivedPermissions.2.target:
-        "0x1e751242C9CE10E165969EeD91E5D98587904aad"
      receivedPermissions.2.from:
+        "0x1e751242C9CE10E165969EeD91E5D98587904aad"
      receivedPermissions.1.target:
-        "0x12c0163237819Eb81c469F71Ea0672e3e8dbF6dB"
      receivedPermissions.1.from:
+        "0x12c0163237819Eb81c469F71Ea0672e3e8dbF6dB"
      receivedPermissions.0.target:
-        "0xF9327276c0E0d255543C095AC6D243B555e645D9"
      receivedPermissions.0.from:
+        "0xF9327276c0E0d255543C095AC6D243B555e645D9"
      directlyReceivedPermissions.0.target:
-        "0xa5e62aAC82Af6dA4Fd23ca5219132a7D941B4fe3"
      directlyReceivedPermissions.0.from:
+        "0xa5e62aAC82Af6dA4Fd23ca5219132a7D941B4fe3"
    }
```

```diff
    contract UpgradeExecutor (0xa5e62aAC82Af6dA4Fd23ca5219132a7D941B4fe3) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      issuedPermissions.0.target:
-        "0x6FD149B3d41fd860B9Da1A6fE54e902eF41F68BF"
      issuedPermissions.0.via.1.delay:
-        0
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x6FD149B3d41fd860B9Da1A6fE54e902eF41F68BF"
      directlyReceivedPermissions.2.target:
-        "0xF9327276c0E0d255543C095AC6D243B555e645D9"
      directlyReceivedPermissions.2.from:
+        "0xF9327276c0E0d255543C095AC6D243B555e645D9"
      directlyReceivedPermissions.1.target:
-        "0xF9327276c0E0d255543C095AC6D243B555e645D9"
      directlyReceivedPermissions.1.from:
+        "0xF9327276c0E0d255543C095AC6D243B555e645D9"
      directlyReceivedPermissions.0.target:
-        "0xf201805BD417f9E0d229A0C379c3e5B91bf18A8b"
      directlyReceivedPermissions.0.from:
+        "0xf201805BD417f9E0d229A0C379c3e5B91bf18A8b"
    }
```

```diff
    contract ERC20Bridge (0xC1bf6E0Ac80e92A331c4D448652C4824D4195459) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      issuedPermissions.0.target:
-        "0x6FD149B3d41fd860B9Da1A6fE54e902eF41F68BF"
      issuedPermissions.0.via.1.delay:
-        0
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x6FD149B3d41fd860B9Da1A6fE54e902eF41F68BF"
    }
```

```diff
    contract ProxyAdmin (0xf201805BD417f9E0d229A0C379c3e5B91bf18A8b) {
    +++ description: None
      directlyReceivedPermissions.6.target:
-        "0xC1bf6E0Ac80e92A331c4D448652C4824D4195459"
      directlyReceivedPermissions.6.from:
+        "0xC1bf6E0Ac80e92A331c4D448652C4824D4195459"
      directlyReceivedPermissions.5.target:
-        "0xa5e62aAC82Af6dA4Fd23ca5219132a7D941B4fe3"
      directlyReceivedPermissions.5.from:
+        "0xa5e62aAC82Af6dA4Fd23ca5219132a7D941B4fe3"
      directlyReceivedPermissions.4.target:
-        "0x6f857Cfcb32951cE5A6fAD7B809af8Bcbc3d551A"
      directlyReceivedPermissions.4.from:
+        "0x6f857Cfcb32951cE5A6fAD7B809af8Bcbc3d551A"
      directlyReceivedPermissions.3.target:
-        "0x67B01721383baedF4b27B745bf533F6F7bDc4AE4"
      directlyReceivedPermissions.3.from:
+        "0x67B01721383baedF4b27B745bf533F6F7bDc4AE4"
      directlyReceivedPermissions.2.target:
-        "0x46B6462301182B393ac5f014779687d3B6d4FB57"
      directlyReceivedPermissions.2.from:
+        "0x46B6462301182B393ac5f014779687d3B6d4FB57"
      directlyReceivedPermissions.1.target:
-        "0x1e751242C9CE10E165969EeD91E5D98587904aad"
      directlyReceivedPermissions.1.from:
+        "0x1e751242C9CE10E165969EeD91E5D98587904aad"
      directlyReceivedPermissions.0.target:
-        "0x12c0163237819Eb81c469F71Ea0672e3e8dbF6dB"
      directlyReceivedPermissions.0.from:
+        "0x12c0163237819Eb81c469F71Ea0672e3e8dbF6dB"
    }
```

```diff
    contract RollupProxy (0xF9327276c0E0d255543C095AC6D243B555e645D9) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      issuedPermissions.6.target:
-        "0x82Bc29d2a230d99261CFF7Dab9dAB27649784Fd9"
      issuedPermissions.6.to:
+        "0x82Bc29d2a230d99261CFF7Dab9dAB27649784Fd9"
      issuedPermissions.6.description:
+        "Can propose new state roots (called nodes) and challenge state roots on the host chain."
      issuedPermissions.5.target:
-        "0x571D6CA61B979A967E055696c822CF8C928d3556"
      issuedPermissions.5.to:
+        "0x571D6CA61B979A967E055696c822CF8C928d3556"
      issuedPermissions.5.description:
+        "Can propose new state roots (called nodes) and challenge state roots on the host chain."
      issuedPermissions.4.target:
-        "0x3D5cFeB6C99343793a8E112dF7D6c331F48e22De"
      issuedPermissions.4.to:
+        "0x3D5cFeB6C99343793a8E112dF7D6c331F48e22De"
      issuedPermissions.4.description:
+        "Can propose new state roots (called nodes) and challenge state roots on the host chain."
      issuedPermissions.3.target:
-        "0x27752e6B947e777E894c1b7E574Ca7593d6F2C49"
      issuedPermissions.3.to:
+        "0x27752e6B947e777E894c1b7E574Ca7593d6F2C49"
      issuedPermissions.3.description:
+        "Can propose new state roots (called nodes) and challenge state roots on the host chain."
      issuedPermissions.2.target:
-        "0x6FD149B3d41fd860B9Da1A6fE54e902eF41F68BF"
      issuedPermissions.2.via.0.delay:
-        0
      issuedPermissions.2.to:
+        "0x6FD149B3d41fd860B9Da1A6fE54e902eF41F68BF"
      issuedPermissions.1.target:
-        "0x571D6CA61B979A967E055696c822CF8C928d3556"
      issuedPermissions.1.to:
+        "0x571D6CA61B979A967E055696c822CF8C928d3556"
      issuedPermissions.1.description:
+        "Can finalize a state root before the challenge period has passed. This allows withdrawing from the bridge based on the state root."
      issuedPermissions.0.target:
-        "0x6FD149B3d41fd860B9Da1A6fE54e902eF41F68BF"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.via.0.description:
-        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
      issuedPermissions.0.to:
+        "0x6FD149B3d41fd860B9Da1A6fE54e902eF41F68BF"
      issuedPermissions.0.description:
+        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
    }
```

Generated with discovered.json: 0xb827403261fa344892c6584af82352f123740e0c

# Diff at Wed, 08 Jan 2025 10:44:57 GMT:

- chain: arbitrum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@20bf0eaa1dce373e2c004314fef59d2d1bdf5502 block: 287770706
- current block number: 287770706

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 287770706 (main branch discovery), not current.

```diff
    contract ERC20Bridge (0xC1bf6E0Ac80e92A331c4D448652C4824D4195459) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      description:
-        "Escrow contract for the project's gas token (Can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging."
+        "Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging."
    }
```

Generated with discovered.json: 0x455058f7931fabfc43de3dc00adcc7f231bb5506

# Diff at Mon, 23 Dec 2024 12:43:56 GMT:

- chain: arbitrum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@18325a975c44684702f30ee366361589e4c2ed8c block: 275817298
- current block number: 287770706

## Description

Config related: Celestia-Nitro wmroot added.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 275817298 (main branch discovery), not current.

```diff
    contract RollupProxy (0xF9327276c0E0d255543C095AC6D243B555e645D9) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      usedTypes.0.arg.0xe81f986823a85105c5fd91bb53b4493d38c0c26652d23f76a7405ac889908287:
+        "Celestia Nitro 3.2.1 wasmModuleRoot"
    }
```

Generated with discovered.json: 0x1dac45538c7773c1994e133b7fa8a9d7ed9fb199

# Diff at Thu, 05 Dec 2024 11:55:18 GMT:

- chain: arbitrum
- author: Piotr Szlachciak (<szlachciak.piotr@gmail.com>)
- comparing to: main@f9ded76f7930b0c86788e4c4595d553b165b87d1 block: 275817298
- current block number: 275817298

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 275817298 (main branch discovery), not current.

```diff
    contract ValidatorUtils (0x9A3464863213C218D7cb7BaA6e69C0461E0Cbc08) {
    +++ description: This contract implements view only utilities for validators.
      template:
+        "orbitstack/ValidatorUtils"
      description:
+        "This contract implements view only utilities for validators."
    }
```

Generated with discovered.json: 0x70fcf8c7290d5f3b5b69bc20ecada2d67f7a26e0

# Diff at Fri, 29 Nov 2024 11:28:47 GMT:

- chain: arbitrum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@9776abb8b1f960f6f1ec6ec27558b5eff7eb5b87 block: 275817298
- current block number: 275817298

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 275817298 (main branch discovery), not current.

```diff
    contract SequencerInbox (0x1e751242C9CE10E165969EeD91E5D98587904aad) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      issuedPermissions.2:
+        {"permission":"upgrade","target":"0x6FD149B3d41fd860B9Da1A6fE54e902eF41F68BF","via":[{"address":"0xa5e62aAC82Af6dA4Fd23ca5219132a7D941B4fe3","delay":0},{"address":"0xf201805BD417f9E0d229A0C379c3e5B91bf18A8b","delay":0}]}
      issuedPermissions.1.permission:
-        "upgrade"
+        "sequence"
      issuedPermissions.1.target:
-        "0x6FD149B3d41fd860B9Da1A6fE54e902eF41F68BF"
+        "0xa0899d20D9665EB0FfE311A395FCd481bF38A5Ff"
      issuedPermissions.1.via.1:
-        {"address":"0xf201805BD417f9E0d229A0C379c3e5B91bf18A8b","delay":0}
      issuedPermissions.1.via.0:
-        {"address":"0xa5e62aAC82Af6dA4Fd23ca5219132a7D941B4fe3","delay":0}
      issuedPermissions.0.permission:
-        "sequence"
+        "configure"
      issuedPermissions.0.target:
-        "0xa0899d20D9665EB0FfE311A395FCd481bF38A5Ff"
+        "0xED64BaA244A1Ba3e91bBA2712004b1732078EC4D"
    }
```

```diff
    contract BlessnetFastconfirmerMultisig (0x571D6CA61B979A967E055696c822CF8C928d3556) {
    +++ description: None
      receivedPermissions.0.permission:
-        "configure"
+        "fastconfirm"
      receivedPermissions.0.description:
-        "a fast-confirmer can finalize a state root before the challenge period has passed. This allows withdrawing from the bridge based on the state root."
+        "Can finalize a state root before the challenge period has passed. This allows withdrawing from the bridge based on the state root."
    }
```

```diff
    contract Caldera Multisig (0x6FD149B3d41fd860B9Da1A6fE54e902eF41F68BF) {
    +++ description: None
      receivedPermissions.0.description:
-        "can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
+        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
    }
```

```diff
    contract UpgradeExecutor (0xa5e62aAC82Af6dA4Fd23ca5219132a7D941B4fe3) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      directlyReceivedPermissions.1.description:
-        "can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
+        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
    }
```

```diff
    contract RollupProxy (0xF9327276c0E0d255543C095AC6D243B555e645D9) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      issuedPermissions.1.permission:
-        "configure"
+        "fastconfirm"
      issuedPermissions.1.target:
-        "0x6FD149B3d41fd860B9Da1A6fE54e902eF41F68BF"
+        "0x571D6CA61B979A967E055696c822CF8C928d3556"
      issuedPermissions.1.via.0:
-        {"address":"0xa5e62aAC82Af6dA4Fd23ca5219132a7D941B4fe3","delay":0,"description":"can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."}
      issuedPermissions.0.target:
-        "0x571D6CA61B979A967E055696c822CF8C928d3556"
+        "0x6FD149B3d41fd860B9Da1A6fE54e902eF41F68BF"
      issuedPermissions.0.via.0:
+        {"address":"0xa5e62aAC82Af6dA4Fd23ca5219132a7D941B4fe3","delay":0,"description":"Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."}
    }
```

Generated with discovered.json: 0xe21f77939a0f885e34e6c1f072076979f9a711e4

# Diff at Fri, 29 Nov 2024 09:31:37 GMT:

- chain: arbitrum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@c60f4ba86fcd7b86d6876d1634b83081095f33d7 block: 275817298
- current block number: 275817298

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 275817298 (main branch discovery), not current.

```diff
    contract Caldera Multisig (0x6FD149B3d41fd860B9Da1A6fE54e902eF41F68BF) {
    +++ description: None
      receivedPermissions.8:
+        {"permission":"upgrade","target":"0xF9327276c0E0d255543C095AC6D243B555e645D9","via":[{"address":"0xa5e62aAC82Af6dA4Fd23ca5219132a7D941B4fe3"}]}
      receivedPermissions.7.target:
-        "0xF9327276c0E0d255543C095AC6D243B555e645D9"
+        "0xC1bf6E0Ac80e92A331c4D448652C4824D4195459"
      receivedPermissions.7.via.1:
+        {"address":"0xa5e62aAC82Af6dA4Fd23ca5219132a7D941B4fe3"}
      receivedPermissions.7.via.0.address:
-        "0xa5e62aAC82Af6dA4Fd23ca5219132a7D941B4fe3"
+        "0xf201805BD417f9E0d229A0C379c3e5B91bf18A8b"
      receivedPermissions.6.target:
-        "0xC1bf6E0Ac80e92A331c4D448652C4824D4195459"
+        "0xa5e62aAC82Af6dA4Fd23ca5219132a7D941B4fe3"
      receivedPermissions.5.target:
-        "0xa5e62aAC82Af6dA4Fd23ca5219132a7D941B4fe3"
+        "0x6f857Cfcb32951cE5A6fAD7B809af8Bcbc3d551A"
      receivedPermissions.4.target:
-        "0x6f857Cfcb32951cE5A6fAD7B809af8Bcbc3d551A"
+        "0x67B01721383baedF4b27B745bf533F6F7bDc4AE4"
      receivedPermissions.3.target:
-        "0x67B01721383baedF4b27B745bf533F6F7bDc4AE4"
+        "0x46B6462301182B393ac5f014779687d3B6d4FB57"
      receivedPermissions.2.target:
-        "0x46B6462301182B393ac5f014779687d3B6d4FB57"
+        "0x1e751242C9CE10E165969EeD91E5D98587904aad"
      receivedPermissions.1.target:
-        "0x1e751242C9CE10E165969EeD91E5D98587904aad"
+        "0x12c0163237819Eb81c469F71Ea0672e3e8dbF6dB"
      receivedPermissions.0.permission:
-        "upgrade"
+        "configure"
      receivedPermissions.0.target:
-        "0x12c0163237819Eb81c469F71Ea0672e3e8dbF6dB"
+        "0xF9327276c0E0d255543C095AC6D243B555e645D9"
      receivedPermissions.0.via.1:
-        {"address":"0xa5e62aAC82Af6dA4Fd23ca5219132a7D941B4fe3"}
      receivedPermissions.0.via.0.address:
-        "0xf201805BD417f9E0d229A0C379c3e5B91bf18A8b"
+        "0xa5e62aAC82Af6dA4Fd23ca5219132a7D941B4fe3"
      receivedPermissions.0.description:
+        "can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
    }
```

```diff
    contract UpgradeExecutor (0xa5e62aAC82Af6dA4Fd23ca5219132a7D941B4fe3) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      directlyReceivedPermissions.2:
+        {"permission":"upgrade","target":"0xF9327276c0E0d255543C095AC6D243B555e645D9"}
      directlyReceivedPermissions.1.permission:
-        "upgrade"
+        "configure"
      directlyReceivedPermissions.1.description:
+        "can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
    }
```

```diff
    contract RollupProxy (0xF9327276c0E0d255543C095AC6D243B555e645D9) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      issuedPermissions.6:
+        {"permission":"validate","target":"0x82Bc29d2a230d99261CFF7Dab9dAB27649784Fd9","via":[]}
      issuedPermissions.5.target:
-        "0x82Bc29d2a230d99261CFF7Dab9dAB27649784Fd9"
+        "0x571D6CA61B979A967E055696c822CF8C928d3556"
      issuedPermissions.4.target:
-        "0x571D6CA61B979A967E055696c822CF8C928d3556"
+        "0x3D5cFeB6C99343793a8E112dF7D6c331F48e22De"
      issuedPermissions.3.target:
-        "0x3D5cFeB6C99343793a8E112dF7D6c331F48e22De"
+        "0x27752e6B947e777E894c1b7E574Ca7593d6F2C49"
      issuedPermissions.2.permission:
-        "validate"
+        "upgrade"
      issuedPermissions.2.target:
-        "0x27752e6B947e777E894c1b7E574Ca7593d6F2C49"
+        "0x6FD149B3d41fd860B9Da1A6fE54e902eF41F68BF"
      issuedPermissions.2.via.0:
+        {"address":"0xa5e62aAC82Af6dA4Fd23ca5219132a7D941B4fe3","delay":0}
      issuedPermissions.1.permission:
-        "upgrade"
+        "configure"
      issuedPermissions.1.via.0.description:
+        "can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
    }
```

Generated with discovered.json: 0xf51f16b4c673509075e65ad9b16a469486062035

# Diff at Mon, 18 Nov 2024 16:54:05 GMT:

- chain: arbitrum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@b54f69b0d6666908da980a31e5f52da87009f1ab block: 272297655
- current block number: 275817298

## Description

Caldera MS member removed.

## Watched changes

```diff
    contract Caldera Multisig (0x6FD149B3d41fd860B9Da1A6fE54e902eF41F68BF) {
    +++ description: None
      values.$members.4:
-        "0x356000Cec4fC967f8FC372381D983426760A0391"
      values.$members.3:
-        "0x4919167EA334BE84B1604Cbc82A26A7746D5943e"
+        "0x356000Cec4fC967f8FC372381D983426760A0391"
      values.multisigThreshold:
-        "3 of 5 (60%)"
+        "3 of 4 (75%)"
    }
```

Generated with discovered.json: 0xc1c8c787d4349fb65902fc9d8e50fa3b53599d8f

# Diff at Fri, 15 Nov 2024 08:18:15 GMT:

- chain: arbitrum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@a00c2a67d12a174a45864b549412045028598606 block: 272297655
- current block number: 272297655

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 272297655 (main branch discovery), not current.

```diff
    contract SequencerInbox (0x1e751242C9CE10E165969EeD91E5D98587904aad) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      fieldMeta.maxTimeVariation.description:
-        "Settable by the Rollup Owner. Transactions can only be force-included after `delayBlocks` window (Sequencer-only) has passed."
+        "Settable by the Rollup Owner. Transactions can only be force-included after the `delayBlocks` window (Sequencer-only) has passed."
    }
```

```diff
    contract BlessnetFastconfirmerMultisig (0x571D6CA61B979A967E055696c822CF8C928d3556) {
    +++ description: None
      receivedPermissions.2:
-        {"permission":"propose","target":"0xF9327276c0E0d255543C095AC6D243B555e645D9","description":"can submit state roots to the RollupProxy contract on the host chain."}
      receivedPermissions.1.permission:
-        "configure"
+        "validate"
      receivedPermissions.1.description:
-        "a fast-confirmer can finalize a state root before the challenge period has passed. This allows withdrawing from the bridge based on the state root."
+        "Can propose new state roots (called nodes) and challenge state roots on the host chain."
      receivedPermissions.0.permission:
-        "challenge"
+        "configure"
      receivedPermissions.0.description:
-        "can challenge state roots on the host chain."
+        "a fast-confirmer can finalize a state root before the challenge period has passed. This allows withdrawing from the bridge based on the state root."
    }
```

```diff
    contract ERC20RollupEventInbox (0x67B01721383baedF4b27B745bf533F6F7bDc4AE4) {
    +++ description: Helper contract sending configuration data over the bridge during the systems initialization.
      template:
+        "orbitstack/RollupEventInbox"
      displayName:
+        "RollupEventInbox"
      description:
+        "Helper contract sending configuration data over the bridge during the systems initialization."
    }
```

```diff
    contract UpgradeExecutor (0xa5e62aAC82Af6dA4Fd23ca5219132a7D941B4fe3) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      description:
-        "Central contract defining the access control for upgrading the system contract implementations."
+        "Central contract defining the access control permissions for upgrading the system contract implementations."
    }
```

```diff
    contract RollupProxy (0xF9327276c0E0d255543C095AC6D243B555e645D9) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      issuedPermissions.9:
-        {"permission":"upgrade","target":"0x6FD149B3d41fd860B9Da1A6fE54e902eF41F68BF","via":[{"address":"0xa5e62aAC82Af6dA4Fd23ca5219132a7D941B4fe3","delay":0}]}
      issuedPermissions.8:
-        {"permission":"propose","target":"0x82Bc29d2a230d99261CFF7Dab9dAB27649784Fd9","via":[]}
      issuedPermissions.7:
-        {"permission":"propose","target":"0x571D6CA61B979A967E055696c822CF8C928d3556","via":[]}
      issuedPermissions.6:
-        {"permission":"propose","target":"0x3D5cFeB6C99343793a8E112dF7D6c331F48e22De","via":[]}
      issuedPermissions.5.permission:
-        "propose"
+        "validate"
      issuedPermissions.5.target:
-        "0x27752e6B947e777E894c1b7E574Ca7593d6F2C49"
+        "0x82Bc29d2a230d99261CFF7Dab9dAB27649784Fd9"
      issuedPermissions.4.permission:
-        "configure"
+        "validate"
      issuedPermissions.3.permission:
-        "challenge"
+        "validate"
      issuedPermissions.3.target:
-        "0x82Bc29d2a230d99261CFF7Dab9dAB27649784Fd9"
+        "0x3D5cFeB6C99343793a8E112dF7D6c331F48e22De"
      issuedPermissions.2.permission:
-        "challenge"
+        "validate"
      issuedPermissions.2.target:
-        "0x571D6CA61B979A967E055696c822CF8C928d3556"
+        "0x27752e6B947e777E894c1b7E574Ca7593d6F2C49"
      issuedPermissions.1.permission:
-        "challenge"
+        "upgrade"
      issuedPermissions.1.target:
-        "0x3D5cFeB6C99343793a8E112dF7D6c331F48e22De"
+        "0x6FD149B3d41fd860B9Da1A6fE54e902eF41F68BF"
      issuedPermissions.1.via.0:
+        {"address":"0xa5e62aAC82Af6dA4Fd23ca5219132a7D941B4fe3","delay":0}
      issuedPermissions.0.permission:
-        "challenge"
+        "configure"
      issuedPermissions.0.target:
-        "0x27752e6B947e777E894c1b7E574Ca7593d6F2C49"
+        "0x571D6CA61B979A967E055696c822CF8C928d3556"
    }
```

Generated with discovered.json: 0x559fb671bc7d281ff267dd97b4968edd6835ec80

# Diff at Fri, 08 Nov 2024 11:02:40 GMT:

- chain: arbitrum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- current block number: 272297655

## Description

Initial discovery of a standard Orbit stack Optimium with 3/3 DAC and 3/3 fastconfirmer MS.

## Initial discovery

```diff
+   Status: CREATED
    contract OneStepProofEntry (0x0BEfa8F5F1e3bf8e02d874375A43EA75AeD9CD39)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract OneStepProver0 (0x0Ecfe9f90a06F74935f751077E24C2057B7C9a2f)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract ERC20Outbox (0x12c0163237819Eb81c469F71Ea0672e3e8dbF6dB)
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
```

```diff
+   Status: CREATED
    contract SequencerInbox (0x1e751242C9CE10E165969EeD91E5D98587904aad)
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
```

```diff
+   Status: CREATED
    contract OneStepProverHostIo (0x3537Ab400c0275c93569d2c505ADb72804985393)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract ERC20Inbox (0x46B6462301182B393ac5f014779687d3B6d4FB57)
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
```

```diff
+   Status: CREATED
    contract BlessnetFastconfirmerMultisig (0x571D6CA61B979A967E055696c822CF8C928d3556)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ERC20RollupEventInbox (0x67B01721383baedF4b27B745bf533F6F7bDc4AE4)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ChallengeManager (0x6f857Cfcb32951cE5A6fAD7B809af8Bcbc3d551A)
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
```

```diff
+   Status: CREATED
    contract Caldera Multisig (0x6FD149B3d41fd860B9Da1A6fE54e902eF41F68BF)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProverMemory (0x8711CA24591aEF3bEEC3A9cB9CE41939822366f3)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract ValidatorUtils (0x9A3464863213C218D7cb7BaA6e69C0461E0Cbc08)
    +++ description: None
```

```diff
+   Status: CREATED
    contract UpgradeExecutor (0xa5e62aAC82Af6dA4Fd23ca5219132a7D941B4fe3)
    +++ description: Central contract defining the access control for upgrading the system contract implementations.
```

```diff
+   Status: CREATED
    contract OneStepProverMath (0xbBe221554441F1d2d5A963A67789ce5893dCf451)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract ERC20Bridge (0xC1bf6E0Ac80e92A331c4D448652C4824D4195459)
    +++ description: Escrow contract for the project's gas token (Can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0xf201805BD417f9E0d229A0C379c3e5B91bf18A8b)
    +++ description: None
```

```diff
+   Status: CREATED
    contract RollupProxy (0xF9327276c0E0d255543C095AC6D243B555e645D9)
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
```

