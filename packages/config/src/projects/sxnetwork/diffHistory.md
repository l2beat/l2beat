Generated with discovered.json: 0xd10451721a338ad3be84699d4f98ec9562ec9950

# Diff at Fri, 26 Sep 2025 14:15:27 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@ec4b16fd723bf2a8625a616c4b3a1119ce79fb29 block: 1756118197
- current timestamp: 1756118197

## Description

add new celestia nitro wasmmoduleroot

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1756118197 (main branch discovery), not current.

```diff
    contract RollupProxy (eth:0x36c6C69A6186D4475fc5c21181CD980Bd6E5e11F) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      usedTypes.0.arg.0x597de35fc2ee60e5b2840157370d037542d6a4bc587af7f88202636c54e6bd8d:
+        "Celestia Nitro ArbOS v40 wasmModuleRoot"
    }
```

Generated with discovered.json: 0x34128156fa0516b90b0cb1475041a439cf714454

# Diff at Mon, 01 Sep 2025 10:01:10 GMT:

Merge mark

Generated with discovered.json: 0xa3c2c2d0017c7e24c7494b522e0374a444d06753

# Diff at Mon, 25 Aug 2025 14:10:53 GMT:

- chain: ethereum
- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@ad220cb66b2845d84a69889aeb34f71bc5a0a6b0 block: 1752570635
- current timestamp: 1756118197

## Description

Upgrade to ArbOS v40 wasmModuleRoot.

## Watched changes

```diff
    contract RollupProxy (0x36c6C69A6186D4475fc5c21181CD980Bd6E5e11F) {
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

Generated with discovered.json: 0xb2809b304e8054c9a3a316a5aa5b837a7e99bdea

# Diff at Tue, 15 Jul 2025 09:11:06 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@fe7c3b2343ca7836e6a947e456ab91a6f0f6f592 block: 22122792
- current block number: 22923598

## Description

Gelato MS: one signer removed, one changed.

## Watched changes

```diff
    contract Gelato Multisig (0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb) {
    +++ description: None
      values.$members.2:
-        "eth:0xB0C2CBFfCd4C31AFFEe14993b6d48f99D285f621"
+        "eth:0x58edE8C66A15f23c61b8EadD1191FdaD904f7a87"
      values.$members.8:
-        "eth:0xf83bC4688979b13Da02CB94c76cEB169540760b5"
      values.multisigThreshold:
-        "4 of 10 (40%)"
+        "4 of 9 (44%)"
    }
```

Generated with discovered.json: 0xa226b276fa6a39828d394d65fc42801bc404351e

# Diff at Mon, 14 Jul 2025 12:46:33 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@9f4300dad2f3d080cd56fa311d4a848556c74e72 block: 22122792
- current block number: 22122792

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22122792 (main branch discovery), not current.

```diff
    contract OneStepProverHostIo (0x0003A96B27ce73505b43ea1b71a5aB06bec568C4) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      address:
-        "0x0003A96B27ce73505b43ea1b71a5aB06bec568C4"
+        "eth:0x0003A96B27ce73505b43ea1b71a5aB06bec568C4"
      implementationNames.0x0003A96B27ce73505b43ea1b71a5aB06bec568C4:
-        "OneStepProverHostIo"
      implementationNames.eth:0x0003A96B27ce73505b43ea1b71a5aB06bec568C4:
+        "OneStepProverHostIo"
    }
```

```diff
    EOA  (0x0181F0f0260Ac4149CA7Abf6c53d3E8053f95715) {
    +++ description: None
      address:
-        "0x0181F0f0260Ac4149CA7Abf6c53d3E8053f95715"
+        "eth:0x0181F0f0260Ac4149CA7Abf6c53d3E8053f95715"
    }
```

```diff
    EOA  (0x01a0A7BaAAca31AFB5b770FeFD69CE4917D9c32e) {
    +++ description: None
      address:
-        "0x01a0A7BaAAca31AFB5b770FeFD69CE4917D9c32e"
+        "eth:0x01a0A7BaAAca31AFB5b770FeFD69CE4917D9c32e"
    }
```

```diff
    contract OneStepProverMemory (0x1cD76B9C33b2e3b04D7B181399d492B3e49AD7fB) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      address:
-        "0x1cD76B9C33b2e3b04D7B181399d492B3e49AD7fB"
+        "eth:0x1cD76B9C33b2e3b04D7B181399d492B3e49AD7fB"
      implementationNames.0x1cD76B9C33b2e3b04D7B181399d492B3e49AD7fB:
-        "OneStepProverMemory"
      implementationNames.eth:0x1cD76B9C33b2e3b04D7B181399d492B3e49AD7fB:
+        "OneStepProverMemory"
    }
```

```diff
    EOA  (0x1Ed7Cf284DfA5a1C3F04d0D610a48B54407A0114) {
    +++ description: None
      address:
-        "0x1Ed7Cf284DfA5a1C3F04d0D610a48B54407A0114"
+        "eth:0x1Ed7Cf284DfA5a1C3F04d0D610a48B54407A0114"
    }
```

```diff
    EOA  (0x214474E5399cc4C003A990E28a4379A1f1b64eE7) {
    +++ description: None
      address:
-        "0x214474E5399cc4C003A990E28a4379A1f1b64eE7"
+        "eth:0x214474E5399cc4C003A990E28a4379A1f1b64eE7"
    }
```

```diff
    EOA  (0x262711cA4DA6409Da795D8af9E18DDaF47397f80) {
    +++ description: None
      address:
-        "0x262711cA4DA6409Da795D8af9E18DDaF47397f80"
+        "eth:0x262711cA4DA6409Da795D8af9E18DDaF47397f80"
    }
```

```diff
    EOA  (0x28bB9385A588EF4747264D19B9A9F1603591680c) {
    +++ description: None
      address:
-        "0x28bB9385A588EF4747264D19B9A9F1603591680c"
+        "eth:0x28bB9385A588EF4747264D19B9A9F1603591680c"
    }
```

```diff
    contract ValidatorUtils (0x2b0E04Dc90e3fA58165CB41E2834B44A56E766aF) {
    +++ description: This contract implements view only utilities for validators.
      address:
-        "0x2b0E04Dc90e3fA58165CB41E2834B44A56E766aF"
+        "eth:0x2b0E04Dc90e3fA58165CB41E2834B44A56E766aF"
      implementationNames.0x2b0E04Dc90e3fA58165CB41E2834B44A56E766aF:
-        "ValidatorUtils"
      implementationNames.eth:0x2b0E04Dc90e3fA58165CB41E2834B44A56E766aF:
+        "ValidatorUtils"
    }
```

```diff
    contract OneStepProver0 (0x2dCCAbE89cF76132619a9B18e9F9e48E837222b5) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      address:
-        "0x2dCCAbE89cF76132619a9B18e9F9e48E837222b5"
+        "eth:0x2dCCAbE89cF76132619a9B18e9F9e48E837222b5"
      implementationNames.0x2dCCAbE89cF76132619a9B18e9F9e48E837222b5:
-        "OneStepProver0"
      implementationNames.eth:0x2dCCAbE89cF76132619a9B18e9F9e48E837222b5:
+        "OneStepProver0"
    }
```

```diff
    EOA  (0x349f3839012DB2271e1BeC68F1668471D175Adb9) {
    +++ description: None
      address:
-        "0x349f3839012DB2271e1BeC68F1668471D175Adb9"
+        "eth:0x349f3839012DB2271e1BeC68F1668471D175Adb9"
    }
```

```diff
    EOA  (0x3648e2c562F00DeEA11B0b335Cf55C5EB2Df3A5F) {
    +++ description: None
      address:
-        "0x3648e2c562F00DeEA11B0b335Cf55C5EB2Df3A5F"
+        "eth:0x3648e2c562F00DeEA11B0b335Cf55C5EB2Df3A5F"
    }
```

```diff
    contract RollupProxy (0x36c6C69A6186D4475fc5c21181CD980Bd6E5e11F) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      address:
-        "0x36c6C69A6186D4475fc5c21181CD980Bd6E5e11F"
+        "eth:0x36c6C69A6186D4475fc5c21181CD980Bd6E5e11F"
      values.$admin:
-        "0x44Ec40D86b4643Bd5110ED07BE188F8473Ad2d3a"
+        "eth:0x44Ec40D86b4643Bd5110ED07BE188F8473Ad2d3a"
      values.$implementation.0:
-        "0x9B56A789fEDD5df27dBaB53b085F7157397cA17D"
+        "eth:0x9B56A789fEDD5df27dBaB53b085F7157397cA17D"
      values.$implementation.1:
-        "0x5607Ea4b5F6e3F610bD346B36D3143FFf46d1C34"
+        "eth:0x5607Ea4b5F6e3F610bD346B36D3143FFf46d1C34"
      values.$pastUpgrades.0.2.0:
-        "0x0aE4dD666748bF0F6dB5c149Eab1D8aD27820A6A"
+        "eth:0x0aE4dD666748bF0F6dB5c149Eab1D8aD27820A6A"
      values.$pastUpgrades.0.2.1:
-        "0x660ea1675F7323dC3Ba0c8dDFB593225Eb01E3C1"
+        "eth:0x660ea1675F7323dC3Ba0c8dDFB593225Eb01E3C1"
      values.$pastUpgrades.1.2.0:
-        "0x9B56A789fEDD5df27dBaB53b085F7157397cA17D"
+        "eth:0x9B56A789fEDD5df27dBaB53b085F7157397cA17D"
      values.$pastUpgrades.1.2.1:
-        "0x5607Ea4b5F6e3F610bD346B36D3143FFf46d1C34"
+        "eth:0x5607Ea4b5F6e3F610bD346B36D3143FFf46d1C34"
      values.anyTrustFastConfirmer:
-        "0xddb901e4E9A2e659aa1d6476d5D7A2833E7c3dFa"
+        "eth:0xddb901e4E9A2e659aa1d6476d5D7A2833E7c3dFa"
      values.bridge:
-        "0xa104C0426e95a5538e89131DbB4163d230C35f86"
+        "eth:0xa104C0426e95a5538e89131DbB4163d230C35f86"
      values.challengeManager:
-        "0x73cfa0F6ae141212115657ad91Ad918E5d34d882"
+        "eth:0x73cfa0F6ae141212115657ad91Ad918E5d34d882"
      values.inbox:
-        "0xEa83E8907C89Bc0D9517632f0ba081972E328631"
+        "eth:0xEa83E8907C89Bc0D9517632f0ba081972E328631"
      values.loserStakeEscrow:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.outbox:
-        "0xB360b2f57c645E847148d7C479b7468AbF6F707d"
+        "eth:0xB360b2f57c645E847148d7C479b7468AbF6F707d"
      values.owner:
-        "0x44Ec40D86b4643Bd5110ED07BE188F8473Ad2d3a"
+        "eth:0x44Ec40D86b4643Bd5110ED07BE188F8473Ad2d3a"
      values.rollupEventInbox:
-        "0x9f1045201f8b9D0b12f6d1e40e8B8e6c047A81E3"
+        "eth:0x9f1045201f8b9D0b12f6d1e40e8B8e6c047A81E3"
      values.sequencerInbox:
-        "0xD80a805c86C14c879420eC6acb366D04D318fC0C"
+        "eth:0xD80a805c86C14c879420eC6acb366D04D318fC0C"
      values.stakeToken:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.validators.0:
-        "0x262711cA4DA6409Da795D8af9E18DDaF47397f80"
+        "eth:0x262711cA4DA6409Da795D8af9E18DDaF47397f80"
      values.validators.1:
-        "0x3648e2c562F00DeEA11B0b335Cf55C5EB2Df3A5F"
+        "eth:0x3648e2c562F00DeEA11B0b335Cf55C5EB2Df3A5F"
      values.validators.2:
-        "0x75feC8Bb2d99076D776A5D46D1E3d42686520eF1"
+        "eth:0x75feC8Bb2d99076D776A5D46D1E3d42686520eF1"
      values.validators.3:
-        "0xD19ee3f6Bf22A3A23eCd25B5ED0C655a2a56F65E"
+        "eth:0xD19ee3f6Bf22A3A23eCd25B5ED0C655a2a56F65E"
      values.validators.4:
-        "0xddb901e4E9A2e659aa1d6476d5D7A2833E7c3dFa"
+        "eth:0xddb901e4E9A2e659aa1d6476d5D7A2833E7c3dFa"
      values.validators.5:
-        "0xe778F5Bf5dDB8614a1ab6321Cc557EDbC90e615f"
+        "eth:0xe778F5Bf5dDB8614a1ab6321Cc557EDbC90e615f"
      values.validatorUtils:
-        "0x2b0E04Dc90e3fA58165CB41E2834B44A56E766aF"
+        "eth:0x2b0E04Dc90e3fA58165CB41E2834B44A56E766aF"
      values.validatorWalletCreator:
-        "0x9CAd81628aB7D8e239F1A5B497313341578c5F71"
+        "eth:0x9CAd81628aB7D8e239F1A5B497313341578c5F71"
      implementationNames.0x36c6C69A6186D4475fc5c21181CD980Bd6E5e11F:
-        "RollupProxy"
      implementationNames.0x9B56A789fEDD5df27dBaB53b085F7157397cA17D:
-        "RollupAdminLogic"
      implementationNames.0x5607Ea4b5F6e3F610bD346B36D3143FFf46d1C34:
-        "RollupUserLogic"
      implementationNames.eth:0x36c6C69A6186D4475fc5c21181CD980Bd6E5e11F:
+        "RollupProxy"
      implementationNames.eth:0x9B56A789fEDD5df27dBaB53b085F7157397cA17D:
+        "RollupAdminLogic"
      implementationNames.eth:0x5607Ea4b5F6e3F610bD346B36D3143FFf46d1C34:
+        "RollupUserLogic"
    }
```

```diff
    contract UpgradeExecutor (0x44Ec40D86b4643Bd5110ED07BE188F8473Ad2d3a) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      address:
-        "0x44Ec40D86b4643Bd5110ED07BE188F8473Ad2d3a"
+        "eth:0x44Ec40D86b4643Bd5110ED07BE188F8473Ad2d3a"
      values.$admin:
-        "0xe8606A55d105EF857F187C32Ae0E9a168aF8F497"
+        "eth:0xe8606A55d105EF857F187C32Ae0E9a168aF8F497"
      values.$implementation:
-        "0x6c21303F5986180B1394d2C89f3e883890E2867b"
+        "eth:0x6c21303F5986180B1394d2C89f3e883890E2867b"
      values.$pastUpgrades.0.2.0:
-        "0x6c21303F5986180B1394d2C89f3e883890E2867b"
+        "eth:0x6c21303F5986180B1394d2C89f3e883890E2867b"
      values.accessControl.ADMIN_ROLE.members.0:
-        "0x44Ec40D86b4643Bd5110ED07BE188F8473Ad2d3a"
+        "eth:0x44Ec40D86b4643Bd5110ED07BE188F8473Ad2d3a"
      values.accessControl.EXECUTOR_ROLE.members.0:
-        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
+        "eth:0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
      values.executors.0:
-        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
+        "eth:0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
      implementationNames.0x44Ec40D86b4643Bd5110ED07BE188F8473Ad2d3a:
-        "TransparentUpgradeableProxy"
      implementationNames.0x6c21303F5986180B1394d2C89f3e883890E2867b:
-        "UpgradeExecutor"
      implementationNames.eth:0x44Ec40D86b4643Bd5110ED07BE188F8473Ad2d3a:
+        "TransparentUpgradeableProxy"
      implementationNames.eth:0x6c21303F5986180B1394d2C89f3e883890E2867b:
+        "UpgradeExecutor"
    }
```

```diff
    EOA  (0x547D0F472309e4239b296D01e03bEDc101241a26) {
    +++ description: None
      address:
-        "0x547D0F472309e4239b296D01e03bEDc101241a26"
+        "eth:0x547D0F472309e4239b296D01e03bEDc101241a26"
    }
```

```diff
    EOA  (0x5bE3E96Cdc3A97628bD7308d3588B9a474F4A54d) {
    +++ description: None
      address:
-        "0x5bE3E96Cdc3A97628bD7308d3588B9a474F4A54d"
+        "eth:0x5bE3E96Cdc3A97628bD7308d3588B9a474F4A54d"
    }
```

```diff
    contract GatewayRouter (0x5F00446D785421d65B50c192D7129e3C3906438A) {
    +++ description: This routing contract maps tokens to the correct escrow (gateway) to be then bridged with canonical messaging.
      address:
-        "0x5F00446D785421d65B50c192D7129e3C3906438A"
+        "eth:0x5F00446D785421d65B50c192D7129e3C3906438A"
      values.$admin:
-        "0xe8606A55d105EF857F187C32Ae0E9a168aF8F497"
+        "eth:0xe8606A55d105EF857F187C32Ae0E9a168aF8F497"
      values.$implementation:
-        "0x5Ff3feD7aad041ACe66E4ecDd7AfbCC43b6446b0"
+        "eth:0x5Ff3feD7aad041ACe66E4ecDd7AfbCC43b6446b0"
      values.$pastUpgrades.0.2.0:
-        "0x5Ff3feD7aad041ACe66E4ecDd7AfbCC43b6446b0"
+        "eth:0x5Ff3feD7aad041ACe66E4ecDd7AfbCC43b6446b0"
      values.counterpartGateway:
-        "0xb77b85Bc59f7C48C21Aa32c6230CD4262Fa79f5b"
+        "eth:0xb77b85Bc59f7C48C21Aa32c6230CD4262Fa79f5b"
      values.defaultGateway:
-        "0xB4968C66BECc8fb4f73b50354301c1aDb2Abaa91"
+        "eth:0xB4968C66BECc8fb4f73b50354301c1aDb2Abaa91"
      values.inbox:
-        "0xEa83E8907C89Bc0D9517632f0ba081972E328631"
+        "eth:0xEa83E8907C89Bc0D9517632f0ba081972E328631"
      values.owner:
-        "0x44Ec40D86b4643Bd5110ED07BE188F8473Ad2d3a"
+        "eth:0x44Ec40D86b4643Bd5110ED07BE188F8473Ad2d3a"
      values.router:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.whitelist:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      implementationNames.0x5F00446D785421d65B50c192D7129e3C3906438A:
-        "TransparentUpgradeableProxy"
      implementationNames.0x5Ff3feD7aad041ACe66E4ecDd7AfbCC43b6446b0:
-        "L1OrbitGatewayRouter"
      implementationNames.eth:0x5F00446D785421d65B50c192D7129e3C3906438A:
+        "TransparentUpgradeableProxy"
      implementationNames.eth:0x5Ff3feD7aad041ACe66E4ecDd7AfbCC43b6446b0:
+        "L1OrbitGatewayRouter"
    }
```

```diff
    EOA  (0x691C2EF68e25E620fa6cAdE2728f6aE34F37aAD2) {
    +++ description: None
      address:
-        "0x691C2EF68e25E620fa6cAdE2728f6aE34F37aAD2"
+        "eth:0x691C2EF68e25E620fa6cAdE2728f6aE34F37aAD2"
    }
```

```diff
    contract ChallengeManager (0x73cfa0F6ae141212115657ad91Ad918E5d34d882) {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      address:
-        "0x73cfa0F6ae141212115657ad91Ad918E5d34d882"
+        "eth:0x73cfa0F6ae141212115657ad91Ad918E5d34d882"
      values.$admin:
-        "0xe8606A55d105EF857F187C32Ae0E9a168aF8F497"
+        "eth:0xe8606A55d105EF857F187C32Ae0E9a168aF8F497"
      values.$implementation:
-        "0x02E05A9245C5853f895daDcc3A8216C953C8736B"
+        "eth:0x02E05A9245C5853f895daDcc3A8216C953C8736B"
      values.$pastUpgrades.0.2.0:
-        "0x1D901DD7A5eFE421C3C437B147040E5AF22E6A43"
+        "eth:0x1D901DD7A5eFE421C3C437B147040E5AF22E6A43"
      values.$pastUpgrades.1.2.0:
-        "0x02E05A9245C5853f895daDcc3A8216C953C8736B"
+        "eth:0x02E05A9245C5853f895daDcc3A8216C953C8736B"
      values.bridge:
-        "0xa104C0426e95a5538e89131DbB4163d230C35f86"
+        "eth:0xa104C0426e95a5538e89131DbB4163d230C35f86"
      values.osp:
-        "0x8Faa21891B0b928afEbd5314D1D313f8f7B34DaC"
+        "eth:0x8Faa21891B0b928afEbd5314D1D313f8f7B34DaC"
      values.resultReceiver:
-        "0x36c6C69A6186D4475fc5c21181CD980Bd6E5e11F"
+        "eth:0x36c6C69A6186D4475fc5c21181CD980Bd6E5e11F"
      values.sequencerInbox:
-        "0xD80a805c86C14c879420eC6acb366D04D318fC0C"
+        "eth:0xD80a805c86C14c879420eC6acb366D04D318fC0C"
      implementationNames.0x73cfa0F6ae141212115657ad91Ad918E5d34d882:
-        "TransparentUpgradeableProxy"
      implementationNames.0x02E05A9245C5853f895daDcc3A8216C953C8736B:
-        "ChallengeManager"
      implementationNames.eth:0x73cfa0F6ae141212115657ad91Ad918E5d34d882:
+        "TransparentUpgradeableProxy"
      implementationNames.eth:0x02E05A9245C5853f895daDcc3A8216C953C8736B:
+        "ChallengeManager"
    }
```

```diff
    EOA  (0x75feC8Bb2d99076D776A5D46D1E3d42686520eF1) {
    +++ description: None
      address:
-        "0x75feC8Bb2d99076D776A5D46D1E3d42686520eF1"
+        "eth:0x75feC8Bb2d99076D776A5D46D1E3d42686520eF1"
    }
```

```diff
    EOA  (0x7D9A25f61865D5A211a8be80a4Ef6bd201112717) {
    +++ description: None
      address:
-        "0x7D9A25f61865D5A211a8be80a4Ef6bd201112717"
+        "eth:0x7D9A25f61865D5A211a8be80a4Ef6bd201112717"
    }
```

```diff
    EOA  (0x88De44422E1b1c30bc530c35aEdb9f5aD0e6fD52) {
    +++ description: None
      address:
-        "0x88De44422E1b1c30bc530c35aEdb9f5aD0e6fD52"
+        "eth:0x88De44422E1b1c30bc530c35aEdb9f5aD0e6fD52"
    }
```

```diff
    contract OneStepProofEntry (0x8Faa21891B0b928afEbd5314D1D313f8f7B34DaC) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      address:
-        "0x8Faa21891B0b928afEbd5314D1D313f8f7B34DaC"
+        "eth:0x8Faa21891B0b928afEbd5314D1D313f8f7B34DaC"
      values.prover0:
-        "0x2dCCAbE89cF76132619a9B18e9F9e48E837222b5"
+        "eth:0x2dCCAbE89cF76132619a9B18e9F9e48E837222b5"
      values.proverHostIo:
-        "0x0003A96B27ce73505b43ea1b71a5aB06bec568C4"
+        "eth:0x0003A96B27ce73505b43ea1b71a5aB06bec568C4"
      values.proverMath:
-        "0xCf4b98cFF2976E4eb579B9498f398b5bd279A6eD"
+        "eth:0xCf4b98cFF2976E4eb579B9498f398b5bd279A6eD"
      values.proverMem:
-        "0x1cD76B9C33b2e3b04D7B181399d492B3e49AD7fB"
+        "eth:0x1cD76B9C33b2e3b04D7B181399d492B3e49AD7fB"
      implementationNames.0x8Faa21891B0b928afEbd5314D1D313f8f7B34DaC:
-        "OneStepProofEntry"
      implementationNames.eth:0x8Faa21891B0b928afEbd5314D1D313f8f7B34DaC:
+        "OneStepProofEntry"
    }
```

```diff
    contract RollupEventInbox (0x9f1045201f8b9D0b12f6d1e40e8B8e6c047A81E3) {
    +++ description: Helper contract sending configuration data over the bridge during the systems initialization.
      address:
-        "0x9f1045201f8b9D0b12f6d1e40e8B8e6c047A81E3"
+        "eth:0x9f1045201f8b9D0b12f6d1e40e8B8e6c047A81E3"
      values.$admin:
-        "0xe8606A55d105EF857F187C32Ae0E9a168aF8F497"
+        "eth:0xe8606A55d105EF857F187C32Ae0E9a168aF8F497"
      values.$implementation:
-        "0x302275067251F5FcdB9359Bda735fD8f7A4A54c0"
+        "eth:0x302275067251F5FcdB9359Bda735fD8f7A4A54c0"
      values.$pastUpgrades.0.2.0:
-        "0x302275067251F5FcdB9359Bda735fD8f7A4A54c0"
+        "eth:0x302275067251F5FcdB9359Bda735fD8f7A4A54c0"
      values.bridge:
-        "0xa104C0426e95a5538e89131DbB4163d230C35f86"
+        "eth:0xa104C0426e95a5538e89131DbB4163d230C35f86"
      values.rollup:
-        "0x36c6C69A6186D4475fc5c21181CD980Bd6E5e11F"
+        "eth:0x36c6C69A6186D4475fc5c21181CD980Bd6E5e11F"
      implementationNames.0x9f1045201f8b9D0b12f6d1e40e8B8e6c047A81E3:
-        "TransparentUpgradeableProxy"
      implementationNames.0x302275067251F5FcdB9359Bda735fD8f7A4A54c0:
-        "ERC20RollupEventInbox"
      implementationNames.eth:0x9f1045201f8b9D0b12f6d1e40e8B8e6c047A81E3:
+        "TransparentUpgradeableProxy"
      implementationNames.eth:0x302275067251F5FcdB9359Bda735fD8f7A4A54c0:
+        "ERC20RollupEventInbox"
    }
```

```diff
    contract Bridge (0xa104C0426e95a5538e89131DbB4163d230C35f86) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      address:
-        "0xa104C0426e95a5538e89131DbB4163d230C35f86"
+        "eth:0xa104C0426e95a5538e89131DbB4163d230C35f86"
      values.$admin:
-        "0xe8606A55d105EF857F187C32Ae0E9a168aF8F497"
+        "eth:0xe8606A55d105EF857F187C32Ae0E9a168aF8F497"
      values.$implementation:
-        "0xEfA1De858293593732a09c9dAA238BEC49595751"
+        "eth:0xEfA1De858293593732a09c9dAA238BEC49595751"
      values.$pastUpgrades.0.2.0:
-        "0x7EfcB76D0e2E776A298aAa603d433336e5F8b6ab"
+        "eth:0x7EfcB76D0e2E776A298aAa603d433336e5F8b6ab"
      values.$pastUpgrades.1.2.0:
-        "0xEfA1De858293593732a09c9dAA238BEC49595751"
+        "eth:0xEfA1De858293593732a09c9dAA238BEC49595751"
      values.activeOutbox:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
+++ description: Allowed to mint the gastoken on L2 and call `enqueueDelayedMessage()` on the bridge.
+++ severity: HIGH
      values.allowedDelayedInboxList.0:
-        "0xEa83E8907C89Bc0D9517632f0ba081972E328631"
+        "eth:0xEa83E8907C89Bc0D9517632f0ba081972E328631"
+++ description: Allowed to mint the gastoken on L2 and call `enqueueDelayedMessage()` on the bridge.
+++ severity: HIGH
      values.allowedDelayedInboxList.1:
-        "0x9f1045201f8b9D0b12f6d1e40e8B8e6c047A81E3"
+        "eth:0x9f1045201f8b9D0b12f6d1e40e8B8e6c047A81E3"
+++ description: Can make calls as the bridge, steal all funds.
+++ severity: HIGH
      values.allowedOutboxList.0:
-        "0xB360b2f57c645E847148d7C479b7468AbF6F707d"
+        "eth:0xB360b2f57c645E847148d7C479b7468AbF6F707d"
+++ description: All Inboxes that were ever set as allowed in the bridge.
+++ severity: HIGH
      values.inboxHistory.0:
-        "0xEa83E8907C89Bc0D9517632f0ba081972E328631"
+        "eth:0xEa83E8907C89Bc0D9517632f0ba081972E328631"
+++ description: All Inboxes that were ever set as allowed in the bridge.
+++ severity: HIGH
      values.inboxHistory.1:
-        "0x9f1045201f8b9D0b12f6d1e40e8B8e6c047A81E3"
+        "eth:0x9f1045201f8b9D0b12f6d1e40e8B8e6c047A81E3"
      values.nativeToken:
-        "0xbe9F61555F50DD6167f2772e9CF7519790d96624"
+        "eth:0xbe9F61555F50DD6167f2772e9CF7519790d96624"
+++ description: All Outboxes that were ever set as allowed in the bridge.
+++ severity: HIGH
      values.outboxHistory.0:
-        "0xB360b2f57c645E847148d7C479b7468AbF6F707d"
+        "eth:0xB360b2f57c645E847148d7C479b7468AbF6F707d"
      values.rollup:
-        "0x36c6C69A6186D4475fc5c21181CD980Bd6E5e11F"
+        "eth:0x36c6C69A6186D4475fc5c21181CD980Bd6E5e11F"
      values.sequencerInbox:
-        "0xD80a805c86C14c879420eC6acb366D04D318fC0C"
+        "eth:0xD80a805c86C14c879420eC6acb366D04D318fC0C"
      implementationNames.0xa104C0426e95a5538e89131DbB4163d230C35f86:
-        "TransparentUpgradeableProxy"
      implementationNames.0xEfA1De858293593732a09c9dAA238BEC49595751:
-        "ERC20Bridge"
      implementationNames.eth:0xa104C0426e95a5538e89131DbB4163d230C35f86:
+        "TransparentUpgradeableProxy"
      implementationNames.eth:0xEfA1De858293593732a09c9dAA238BEC49595751:
+        "ERC20Bridge"
    }
```

```diff
    EOA  (0xB0C2CBFfCd4C31AFFEe14993b6d48f99D285f621) {
    +++ description: None
      address:
-        "0xB0C2CBFfCd4C31AFFEe14993b6d48f99D285f621"
+        "eth:0xB0C2CBFfCd4C31AFFEe14993b6d48f99D285f621"
    }
```

```diff
    contract Outbox (0xB360b2f57c645E847148d7C479b7468AbF6F707d) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
      address:
-        "0xB360b2f57c645E847148d7C479b7468AbF6F707d"
+        "eth:0xB360b2f57c645E847148d7C479b7468AbF6F707d"
      values.$admin:
-        "0xe8606A55d105EF857F187C32Ae0E9a168aF8F497"
+        "eth:0xe8606A55d105EF857F187C32Ae0E9a168aF8F497"
      values.$implementation:
-        "0x19431dc37098877486532250FB3158140717C00C"
+        "eth:0x19431dc37098877486532250FB3158140717C00C"
      values.$pastUpgrades.0.2.0:
-        "0x19431dc37098877486532250FB3158140717C00C"
+        "eth:0x19431dc37098877486532250FB3158140717C00C"
      values.bridge:
-        "0xa104C0426e95a5538e89131DbB4163d230C35f86"
+        "eth:0xa104C0426e95a5538e89131DbB4163d230C35f86"
      values.l2ToL1Sender:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.rollup:
-        "0x36c6C69A6186D4475fc5c21181CD980Bd6E5e11F"
+        "eth:0x36c6C69A6186D4475fc5c21181CD980Bd6E5e11F"
      implementationNames.0xB360b2f57c645E847148d7C479b7468AbF6F707d:
-        "TransparentUpgradeableProxy"
      implementationNames.0x19431dc37098877486532250FB3158140717C00C:
-        "ERC20Outbox"
      implementationNames.eth:0xB360b2f57c645E847148d7C479b7468AbF6F707d:
+        "TransparentUpgradeableProxy"
      implementationNames.eth:0x19431dc37098877486532250FB3158140717C00C:
+        "ERC20Outbox"
    }
```

```diff
    contract ERC20Gateway (0xB4968C66BECc8fb4f73b50354301c1aDb2Abaa91) {
    +++ description: Escrows deposited ERC-20 assets for the canonical Bridge. Upon depositing, a generic token representation will be minted at the destination. Withdrawals are initiated by the Outbox contract.
      address:
-        "0xB4968C66BECc8fb4f73b50354301c1aDb2Abaa91"
+        "eth:0xB4968C66BECc8fb4f73b50354301c1aDb2Abaa91"
      values.$admin:
-        "0xe8606A55d105EF857F187C32Ae0E9a168aF8F497"
+        "eth:0xe8606A55d105EF857F187C32Ae0E9a168aF8F497"
      values.$implementation:
-        "0xe80b4E0ed5e92d865F4708eeE0E1564287a7D848"
+        "eth:0xe80b4E0ed5e92d865F4708eeE0E1564287a7D848"
      values.$pastUpgrades.0.2.0:
-        "0xe80b4E0ed5e92d865F4708eeE0E1564287a7D848"
+        "eth:0xe80b4E0ed5e92d865F4708eeE0E1564287a7D848"
      values.counterpartGateway:
-        "0x214474E5399cc4C003A990E28a4379A1f1b64eE7"
+        "eth:0x214474E5399cc4C003A990E28a4379A1f1b64eE7"
      values.inbox:
-        "0xEa83E8907C89Bc0D9517632f0ba081972E328631"
+        "eth:0xEa83E8907C89Bc0D9517632f0ba081972E328631"
      values.l2BeaconProxyFactory:
-        "0x1Ed7Cf284DfA5a1C3F04d0D610a48B54407A0114"
+        "eth:0x1Ed7Cf284DfA5a1C3F04d0D610a48B54407A0114"
      values.router:
-        "0x5F00446D785421d65B50c192D7129e3C3906438A"
+        "eth:0x5F00446D785421d65B50c192D7129e3C3906438A"
      values.whitelist:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      implementationNames.0xB4968C66BECc8fb4f73b50354301c1aDb2Abaa91:
-        "TransparentUpgradeableProxy"
      implementationNames.0xe80b4E0ed5e92d865F4708eeE0E1564287a7D848:
-        "L1OrbitERC20Gateway"
      implementationNames.eth:0xB4968C66BECc8fb4f73b50354301c1aDb2Abaa91:
+        "TransparentUpgradeableProxy"
      implementationNames.eth:0xe80b4E0ed5e92d865F4708eeE0E1564287a7D848:
+        "L1OrbitERC20Gateway"
    }
```

```diff
    EOA  (0xB65540bBA534E88EB4a5062D0E6519C07063b259) {
    +++ description: None
      address:
-        "0xB65540bBA534E88EB4a5062D0E6519C07063b259"
+        "eth:0xB65540bBA534E88EB4a5062D0E6519C07063b259"
    }
```

```diff
    EOA  (0xb77b85Bc59f7C48C21Aa32c6230CD4262Fa79f5b) {
    +++ description: None
      address:
-        "0xb77b85Bc59f7C48C21Aa32c6230CD4262Fa79f5b"
+        "eth:0xb77b85Bc59f7C48C21Aa32c6230CD4262Fa79f5b"
    }
```

```diff
    contract Gelato Multisig (0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb) {
    +++ description: None
      address:
-        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
+        "eth:0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
      values.$implementation:
-        "0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
+        "eth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
      values.$members.0:
-        "0x349f3839012DB2271e1BeC68F1668471D175Adb9"
+        "eth:0x349f3839012DB2271e1BeC68F1668471D175Adb9"
      values.$members.1:
-        "0xB65540bBA534E88EB4a5062D0E6519C07063b259"
+        "eth:0xB65540bBA534E88EB4a5062D0E6519C07063b259"
      values.$members.2:
-        "0xB0C2CBFfCd4C31AFFEe14993b6d48f99D285f621"
+        "eth:0xB0C2CBFfCd4C31AFFEe14993b6d48f99D285f621"
      values.$members.3:
-        "0x28bB9385A588EF4747264D19B9A9F1603591680c"
+        "eth:0x28bB9385A588EF4747264D19B9A9F1603591680c"
      values.$members.4:
-        "0x691C2EF68e25E620fa6cAdE2728f6aE34F37aAD2"
+        "eth:0x691C2EF68e25E620fa6cAdE2728f6aE34F37aAD2"
      values.$members.5:
-        "0x5bE3E96Cdc3A97628bD7308d3588B9a474F4A54d"
+        "eth:0x5bE3E96Cdc3A97628bD7308d3588B9a474F4A54d"
      values.$members.6:
-        "0x88De44422E1b1c30bc530c35aEdb9f5aD0e6fD52"
+        "eth:0x88De44422E1b1c30bc530c35aEdb9f5aD0e6fD52"
      values.$members.7:
-        "0x01a0A7BaAAca31AFB5b770FeFD69CE4917D9c32e"
+        "eth:0x01a0A7BaAAca31AFB5b770FeFD69CE4917D9c32e"
      values.$members.8:
-        "0xf83bC4688979b13Da02CB94c76cEB169540760b5"
+        "eth:0xf83bC4688979b13Da02CB94c76cEB169540760b5"
      values.$members.9:
-        "0x547D0F472309e4239b296D01e03bEDc101241a26"
+        "eth:0x547D0F472309e4239b296D01e03bEDc101241a26"
      implementationNames.0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb:
-        "GnosisSafeProxy"
      implementationNames.0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
-        "GnosisSafe"
      implementationNames.eth:0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb:
+        "GnosisSafeProxy"
      implementationNames.eth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
+        "GnosisSafe"
    }
```

```diff
    EOA  (0xC410B8657FBB2CdbF0c5c5d5128576974467ba5e) {
    +++ description: None
      address:
-        "0xC410B8657FBB2CdbF0c5c5d5128576974467ba5e"
+        "eth:0xC410B8657FBB2CdbF0c5c5d5128576974467ba5e"
    }
```

```diff
    EOA  (0xCD795E6003Da105f4a1E11F73fb64b58B5C0f325) {
    +++ description: None
      address:
-        "0xCD795E6003Da105f4a1E11F73fb64b58B5C0f325"
+        "eth:0xCD795E6003Da105f4a1E11F73fb64b58B5C0f325"
    }
```

```diff
    contract OneStepProverMath (0xCf4b98cFF2976E4eb579B9498f398b5bd279A6eD) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      address:
-        "0xCf4b98cFF2976E4eb579B9498f398b5bd279A6eD"
+        "eth:0xCf4b98cFF2976E4eb579B9498f398b5bd279A6eD"
      implementationNames.0xCf4b98cFF2976E4eb579B9498f398b5bd279A6eD:
-        "OneStepProverMath"
      implementationNames.eth:0xCf4b98cFF2976E4eb579B9498f398b5bd279A6eD:
+        "OneStepProverMath"
    }
```

```diff
    EOA  (0xD19ee3f6Bf22A3A23eCd25B5ED0C655a2a56F65E) {
    +++ description: None
      address:
-        "0xD19ee3f6Bf22A3A23eCd25B5ED0C655a2a56F65E"
+        "eth:0xD19ee3f6Bf22A3A23eCd25B5ED0C655a2a56F65E"
    }
```

```diff
    contract SequencerInbox (0xD80a805c86C14c879420eC6acb366D04D318fC0C) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      address:
-        "0xD80a805c86C14c879420eC6acb366D04D318fC0C"
+        "eth:0xD80a805c86C14c879420eC6acb366D04D318fC0C"
      values.$admin:
-        "0xe8606A55d105EF857F187C32Ae0E9a168aF8F497"
+        "eth:0xe8606A55d105EF857F187C32Ae0E9a168aF8F497"
      values.$implementation:
-        "0xaEd84B70Be8117112a5aa0d93a7fBff463A03b18"
+        "eth:0xaEd84B70Be8117112a5aa0d93a7fBff463A03b18"
      values.$pastUpgrades.0.2.0:
-        "0x383f16fB2809a56fC639c1eE2c93Ad2aa7Ee130A"
+        "eth:0x383f16fB2809a56fC639c1eE2c93Ad2aa7Ee130A"
      values.$pastUpgrades.1.2.0:
-        "0xaEd84B70Be8117112a5aa0d93a7fBff463A03b18"
+        "eth:0xaEd84B70Be8117112a5aa0d93a7fBff463A03b18"
      values.batchPosterManager:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.batchPosters.0:
-        "0x0181F0f0260Ac4149CA7Abf6c53d3E8053f95715"
+        "eth:0x0181F0f0260Ac4149CA7Abf6c53d3E8053f95715"
      values.batchPosters.1:
-        "0x7D9A25f61865D5A211a8be80a4Ef6bd201112717"
+        "eth:0x7D9A25f61865D5A211a8be80a4Ef6bd201112717"
      values.batchPosters.2:
-        "0xC410B8657FBB2CdbF0c5c5d5128576974467ba5e"
+        "eth:0xC410B8657FBB2CdbF0c5c5d5128576974467ba5e"
      values.batchPosters.3:
-        "0xCD795E6003Da105f4a1E11F73fb64b58B5C0f325"
+        "eth:0xCD795E6003Da105f4a1E11F73fb64b58B5C0f325"
      values.batchPosters.4:
-        "0xf244224843657bb59A6456754992Ea973655D918"
+        "eth:0xf244224843657bb59A6456754992Ea973655D918"
      values.bridge:
-        "0xa104C0426e95a5538e89131DbB4163d230C35f86"
+        "eth:0xa104C0426e95a5538e89131DbB4163d230C35f86"
      values.reader4844:
-        "0x6c5c9E6c080a6C25f49DfFE85cfA71aaEAAfdE74"
+        "eth:0x6c5c9E6c080a6C25f49DfFE85cfA71aaEAAfdE74"
      values.rollup:
-        "0x36c6C69A6186D4475fc5c21181CD980Bd6E5e11F"
+        "eth:0x36c6C69A6186D4475fc5c21181CD980Bd6E5e11F"
      implementationNames.0xD80a805c86C14c879420eC6acb366D04D318fC0C:
-        "TransparentUpgradeableProxy"
      implementationNames.0xaEd84B70Be8117112a5aa0d93a7fBff463A03b18:
-        "SequencerInbox"
      implementationNames.eth:0xD80a805c86C14c879420eC6acb366D04D318fC0C:
+        "TransparentUpgradeableProxy"
      implementationNames.eth:0xaEd84B70Be8117112a5aa0d93a7fBff463A03b18:
+        "SequencerInbox"
    }
```

```diff
    contract SxNetworkMultisig (0xddb901e4E9A2e659aa1d6476d5D7A2833E7c3dFa) {
    +++ description: None
      address:
-        "0xddb901e4E9A2e659aa1d6476d5D7A2833E7c3dFa"
+        "eth:0xddb901e4E9A2e659aa1d6476d5D7A2833E7c3dFa"
      values.$implementation:
-        "0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
+        "eth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
      values.$members.0:
-        "0x262711cA4DA6409Da795D8af9E18DDaF47397f80"
+        "eth:0x262711cA4DA6409Da795D8af9E18DDaF47397f80"
      implementationNames.0xddb901e4E9A2e659aa1d6476d5D7A2833E7c3dFa:
-        "GnosisSafeProxy"
      implementationNames.0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
-        "GnosisSafe"
      implementationNames.eth:0xddb901e4E9A2e659aa1d6476d5D7A2833E7c3dFa:
+        "GnosisSafeProxy"
      implementationNames.eth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
+        "GnosisSafe"
    }
```

```diff
    EOA  (0xe778F5Bf5dDB8614a1ab6321Cc557EDbC90e615f) {
    +++ description: None
      address:
-        "0xe778F5Bf5dDB8614a1ab6321Cc557EDbC90e615f"
+        "eth:0xe778F5Bf5dDB8614a1ab6321Cc557EDbC90e615f"
    }
```

```diff
    contract ProxyAdmin (0xe8606A55d105EF857F187C32Ae0E9a168aF8F497) {
    +++ description: None
      address:
-        "0xe8606A55d105EF857F187C32Ae0E9a168aF8F497"
+        "eth:0xe8606A55d105EF857F187C32Ae0E9a168aF8F497"
      values.owner:
-        "0x44Ec40D86b4643Bd5110ED07BE188F8473Ad2d3a"
+        "eth:0x44Ec40D86b4643Bd5110ED07BE188F8473Ad2d3a"
      implementationNames.0xe8606A55d105EF857F187C32Ae0E9a168aF8F497:
-        "ProxyAdmin"
      implementationNames.eth:0xe8606A55d105EF857F187C32Ae0E9a168aF8F497:
+        "ProxyAdmin"
    }
```

```diff
    contract Inbox (0xEa83E8907C89Bc0D9517632f0ba081972E328631) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      address:
-        "0xEa83E8907C89Bc0D9517632f0ba081972E328631"
+        "eth:0xEa83E8907C89Bc0D9517632f0ba081972E328631"
      values.$admin:
-        "0xe8606A55d105EF857F187C32Ae0E9a168aF8F497"
+        "eth:0xe8606A55d105EF857F187C32Ae0E9a168aF8F497"
      values.$implementation:
-        "0x6C051397fee2d79ccf92d1f3c5c6547fEBD838F4"
+        "eth:0x6C051397fee2d79ccf92d1f3c5c6547fEBD838F4"
      values.$pastUpgrades.0.2.0:
-        "0x31fAAAB44e74eB408d1FC69A14806B4b9cA09da2"
+        "eth:0x31fAAAB44e74eB408d1FC69A14806B4b9cA09da2"
      values.$pastUpgrades.1.2.0:
-        "0x6C051397fee2d79ccf92d1f3c5c6547fEBD838F4"
+        "eth:0x6C051397fee2d79ccf92d1f3c5c6547fEBD838F4"
      values.bridge:
-        "0xa104C0426e95a5538e89131DbB4163d230C35f86"
+        "eth:0xa104C0426e95a5538e89131DbB4163d230C35f86"
      values.getProxyAdmin:
-        "0xe8606A55d105EF857F187C32Ae0E9a168aF8F497"
+        "eth:0xe8606A55d105EF857F187C32Ae0E9a168aF8F497"
      values.sequencerInbox:
-        "0xD80a805c86C14c879420eC6acb366D04D318fC0C"
+        "eth:0xD80a805c86C14c879420eC6acb366D04D318fC0C"
      implementationNames.0xEa83E8907C89Bc0D9517632f0ba081972E328631:
-        "TransparentUpgradeableProxy"
      implementationNames.0x6C051397fee2d79ccf92d1f3c5c6547fEBD838F4:
-        "ERC20Inbox"
      implementationNames.eth:0xEa83E8907C89Bc0D9517632f0ba081972E328631:
+        "TransparentUpgradeableProxy"
      implementationNames.eth:0x6C051397fee2d79ccf92d1f3c5c6547fEBD838F4:
+        "ERC20Inbox"
    }
```

```diff
    EOA  (0xf244224843657bb59A6456754992Ea973655D918) {
    +++ description: None
      address:
-        "0xf244224843657bb59A6456754992Ea973655D918"
+        "eth:0xf244224843657bb59A6456754992Ea973655D918"
    }
```

```diff
    EOA  (0xf83bC4688979b13Da02CB94c76cEB169540760b5) {
    +++ description: None
      address:
-        "0xf83bC4688979b13Da02CB94c76cEB169540760b5"
+        "eth:0xf83bC4688979b13Da02CB94c76cEB169540760b5"
    }
```

```diff
+   Status: CREATED
    contract OneStepProverHostIo (0x0003A96B27ce73505b43ea1b71a5aB06bec568C4)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract OneStepProverMemory (0x1cD76B9C33b2e3b04D7B181399d492B3e49AD7fB)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract ValidatorUtils (0x2b0E04Dc90e3fA58165CB41E2834B44A56E766aF)
    +++ description: This contract implements view only utilities for validators.
```

```diff
+   Status: CREATED
    contract OneStepProver0 (0x2dCCAbE89cF76132619a9B18e9F9e48E837222b5)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract RollupProxy (0x36c6C69A6186D4475fc5c21181CD980Bd6E5e11F)
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
```

```diff
+   Status: CREATED
    contract UpgradeExecutor (0x44Ec40D86b4643Bd5110ED07BE188F8473Ad2d3a)
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
```

```diff
+   Status: CREATED
    contract GatewayRouter (0x5F00446D785421d65B50c192D7129e3C3906438A)
    +++ description: This routing contract maps tokens to the correct escrow (gateway) to be then bridged with canonical messaging.
```

```diff
+   Status: CREATED
    contract ChallengeManager (0x73cfa0F6ae141212115657ad91Ad918E5d34d882)
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
```

```diff
+   Status: CREATED
    contract OneStepProofEntry (0x8Faa21891B0b928afEbd5314D1D313f8f7B34DaC)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract RollupEventInbox (0x9f1045201f8b9D0b12f6d1e40e8B8e6c047A81E3)
    +++ description: Helper contract sending configuration data over the bridge during the systems initialization.
```

```diff
+   Status: CREATED
    contract Bridge (0xa104C0426e95a5538e89131DbB4163d230C35f86)
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
```

```diff
+   Status: CREATED
    contract Outbox (0xB360b2f57c645E847148d7C479b7468AbF6F707d)
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
```

```diff
+   Status: CREATED
    contract ERC20Gateway (0xB4968C66BECc8fb4f73b50354301c1aDb2Abaa91)
    +++ description: Escrows deposited ERC-20 assets for the canonical Bridge. Upon depositing, a generic token representation will be minted at the destination. Withdrawals are initiated by the Outbox contract.
```

```diff
+   Status: CREATED
    contract Gelato Multisig (0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProverMath (0xCf4b98cFF2976E4eb579B9498f398b5bd279A6eD)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract SequencerInbox (0xD80a805c86C14c879420eC6acb366D04D318fC0C)
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
```

```diff
+   Status: CREATED
    contract SxNetworkMultisig (0xddb901e4E9A2e659aa1d6476d5D7A2833E7c3dFa)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0xe8606A55d105EF857F187C32Ae0E9a168aF8F497)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Inbox (0xEa83E8907C89Bc0D9517632f0ba081972E328631)
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
```

Generated with discovered.json: 0x815242e54bed39071832b11e3c708da698b52586

# Diff at Fri, 04 Jul 2025 12:19:24 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f56dc47fe915564d4555300304da4d3bcbc087f block: 22122792
- current block number: 22122792

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22122792 (main branch discovery), not current.

```diff
    EOA  (0x0181F0f0260Ac4149CA7Abf6c53d3E8053f95715) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0xD80a805c86C14c879420eC6acb366D04D318fC0C"
+        "eth:0xD80a805c86C14c879420eC6acb366D04D318fC0C"
    }
```

```diff
    EOA  (0x262711cA4DA6409Da795D8af9E18DDaF47397f80) {
    +++ description: None
      receivedPermissions.0.via.0.address:
-        "ethereum:0xddb901e4E9A2e659aa1d6476d5D7A2833E7c3dFa"
+        "eth:0xddb901e4E9A2e659aa1d6476d5D7A2833E7c3dFa"
      receivedPermissions.0.from:
-        "ethereum:0x36c6C69A6186D4475fc5c21181CD980Bd6E5e11F"
+        "eth:0x36c6C69A6186D4475fc5c21181CD980Bd6E5e11F"
      receivedPermissions.1.via.0.address:
-        "ethereum:0xddb901e4E9A2e659aa1d6476d5D7A2833E7c3dFa"
+        "eth:0xddb901e4E9A2e659aa1d6476d5D7A2833E7c3dFa"
      receivedPermissions.1.from:
-        "ethereum:0x36c6C69A6186D4475fc5c21181CD980Bd6E5e11F"
+        "eth:0x36c6C69A6186D4475fc5c21181CD980Bd6E5e11F"
      receivedPermissions.2.from:
-        "ethereum:0x36c6C69A6186D4475fc5c21181CD980Bd6E5e11F"
+        "eth:0x36c6C69A6186D4475fc5c21181CD980Bd6E5e11F"
    }
```

```diff
    EOA  (0x3648e2c562F00DeEA11B0b335Cf55C5EB2Df3A5F) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0x36c6C69A6186D4475fc5c21181CD980Bd6E5e11F"
+        "eth:0x36c6C69A6186D4475fc5c21181CD980Bd6E5e11F"
    }
```

```diff
    contract UpgradeExecutor (0x44Ec40D86b4643Bd5110ED07BE188F8473Ad2d3a) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      directlyReceivedPermissions.0.from:
-        "ethereum:0xe8606A55d105EF857F187C32Ae0E9a168aF8F497"
+        "eth:0xe8606A55d105EF857F187C32Ae0E9a168aF8F497"
      directlyReceivedPermissions.1.from:
-        "ethereum:0x36c6C69A6186D4475fc5c21181CD980Bd6E5e11F"
+        "eth:0x36c6C69A6186D4475fc5c21181CD980Bd6E5e11F"
      directlyReceivedPermissions.2.from:
-        "ethereum:0x36c6C69A6186D4475fc5c21181CD980Bd6E5e11F"
+        "eth:0x36c6C69A6186D4475fc5c21181CD980Bd6E5e11F"
    }
```

```diff
    EOA  (0x75feC8Bb2d99076D776A5D46D1E3d42686520eF1) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0x36c6C69A6186D4475fc5c21181CD980Bd6E5e11F"
+        "eth:0x36c6C69A6186D4475fc5c21181CD980Bd6E5e11F"
    }
```

```diff
    EOA  (0x7D9A25f61865D5A211a8be80a4Ef6bd201112717) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0xD80a805c86C14c879420eC6acb366D04D318fC0C"
+        "eth:0xD80a805c86C14c879420eC6acb366D04D318fC0C"
    }
```

```diff
    contract Gelato Multisig (0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb) {
    +++ description: None
      receivedPermissions.0.via.0.address:
-        "ethereum:0x44Ec40D86b4643Bd5110ED07BE188F8473Ad2d3a"
+        "eth:0x44Ec40D86b4643Bd5110ED07BE188F8473Ad2d3a"
      receivedPermissions.0.from:
-        "ethereum:0x36c6C69A6186D4475fc5c21181CD980Bd6E5e11F"
+        "eth:0x36c6C69A6186D4475fc5c21181CD980Bd6E5e11F"
      receivedPermissions.1.via.0.address:
-        "ethereum:0x44Ec40D86b4643Bd5110ED07BE188F8473Ad2d3a"
+        "eth:0x44Ec40D86b4643Bd5110ED07BE188F8473Ad2d3a"
      receivedPermissions.1.from:
-        "ethereum:0x36c6C69A6186D4475fc5c21181CD980Bd6E5e11F"
+        "eth:0x36c6C69A6186D4475fc5c21181CD980Bd6E5e11F"
      receivedPermissions.2.via.1.address:
-        "ethereum:0x44Ec40D86b4643Bd5110ED07BE188F8473Ad2d3a"
+        "eth:0x44Ec40D86b4643Bd5110ED07BE188F8473Ad2d3a"
      receivedPermissions.2.via.0.address:
-        "ethereum:0xe8606A55d105EF857F187C32Ae0E9a168aF8F497"
+        "eth:0xe8606A55d105EF857F187C32Ae0E9a168aF8F497"
      receivedPermissions.2.from:
-        "ethereum:0x44Ec40D86b4643Bd5110ED07BE188F8473Ad2d3a"
+        "eth:0x44Ec40D86b4643Bd5110ED07BE188F8473Ad2d3a"
      receivedPermissions.3.via.1.address:
-        "ethereum:0x44Ec40D86b4643Bd5110ED07BE188F8473Ad2d3a"
+        "eth:0x44Ec40D86b4643Bd5110ED07BE188F8473Ad2d3a"
      receivedPermissions.3.via.0.address:
-        "ethereum:0xe8606A55d105EF857F187C32Ae0E9a168aF8F497"
+        "eth:0xe8606A55d105EF857F187C32Ae0E9a168aF8F497"
      receivedPermissions.3.from:
-        "ethereum:0x5F00446D785421d65B50c192D7129e3C3906438A"
+        "eth:0x5F00446D785421d65B50c192D7129e3C3906438A"
      receivedPermissions.4.via.1.address:
-        "ethereum:0x44Ec40D86b4643Bd5110ED07BE188F8473Ad2d3a"
+        "eth:0x44Ec40D86b4643Bd5110ED07BE188F8473Ad2d3a"
      receivedPermissions.4.via.0.address:
-        "ethereum:0xe8606A55d105EF857F187C32Ae0E9a168aF8F497"
+        "eth:0xe8606A55d105EF857F187C32Ae0E9a168aF8F497"
      receivedPermissions.4.from:
-        "ethereum:0x73cfa0F6ae141212115657ad91Ad918E5d34d882"
+        "eth:0x73cfa0F6ae141212115657ad91Ad918E5d34d882"
      receivedPermissions.5.via.1.address:
-        "ethereum:0x44Ec40D86b4643Bd5110ED07BE188F8473Ad2d3a"
+        "eth:0x44Ec40D86b4643Bd5110ED07BE188F8473Ad2d3a"
      receivedPermissions.5.via.0.address:
-        "ethereum:0xe8606A55d105EF857F187C32Ae0E9a168aF8F497"
+        "eth:0xe8606A55d105EF857F187C32Ae0E9a168aF8F497"
      receivedPermissions.5.from:
-        "ethereum:0x9f1045201f8b9D0b12f6d1e40e8B8e6c047A81E3"
+        "eth:0x9f1045201f8b9D0b12f6d1e40e8B8e6c047A81E3"
      receivedPermissions.6.via.1.address:
-        "ethereum:0x44Ec40D86b4643Bd5110ED07BE188F8473Ad2d3a"
+        "eth:0x44Ec40D86b4643Bd5110ED07BE188F8473Ad2d3a"
      receivedPermissions.6.via.0.address:
-        "ethereum:0xe8606A55d105EF857F187C32Ae0E9a168aF8F497"
+        "eth:0xe8606A55d105EF857F187C32Ae0E9a168aF8F497"
      receivedPermissions.6.from:
-        "ethereum:0xa104C0426e95a5538e89131DbB4163d230C35f86"
+        "eth:0xa104C0426e95a5538e89131DbB4163d230C35f86"
      receivedPermissions.7.via.1.address:
-        "ethereum:0x44Ec40D86b4643Bd5110ED07BE188F8473Ad2d3a"
+        "eth:0x44Ec40D86b4643Bd5110ED07BE188F8473Ad2d3a"
      receivedPermissions.7.via.0.address:
-        "ethereum:0xe8606A55d105EF857F187C32Ae0E9a168aF8F497"
+        "eth:0xe8606A55d105EF857F187C32Ae0E9a168aF8F497"
      receivedPermissions.7.from:
-        "ethereum:0xB360b2f57c645E847148d7C479b7468AbF6F707d"
+        "eth:0xB360b2f57c645E847148d7C479b7468AbF6F707d"
      receivedPermissions.8.via.1.address:
-        "ethereum:0x44Ec40D86b4643Bd5110ED07BE188F8473Ad2d3a"
+        "eth:0x44Ec40D86b4643Bd5110ED07BE188F8473Ad2d3a"
      receivedPermissions.8.via.0.address:
-        "ethereum:0xe8606A55d105EF857F187C32Ae0E9a168aF8F497"
+        "eth:0xe8606A55d105EF857F187C32Ae0E9a168aF8F497"
      receivedPermissions.8.from:
-        "ethereum:0xB4968C66BECc8fb4f73b50354301c1aDb2Abaa91"
+        "eth:0xB4968C66BECc8fb4f73b50354301c1aDb2Abaa91"
      receivedPermissions.9.via.1.address:
-        "ethereum:0x44Ec40D86b4643Bd5110ED07BE188F8473Ad2d3a"
+        "eth:0x44Ec40D86b4643Bd5110ED07BE188F8473Ad2d3a"
      receivedPermissions.9.via.0.address:
-        "ethereum:0xe8606A55d105EF857F187C32Ae0E9a168aF8F497"
+        "eth:0xe8606A55d105EF857F187C32Ae0E9a168aF8F497"
      receivedPermissions.9.from:
-        "ethereum:0xD80a805c86C14c879420eC6acb366D04D318fC0C"
+        "eth:0xD80a805c86C14c879420eC6acb366D04D318fC0C"
      receivedPermissions.10.via.1.address:
-        "ethereum:0x44Ec40D86b4643Bd5110ED07BE188F8473Ad2d3a"
+        "eth:0x44Ec40D86b4643Bd5110ED07BE188F8473Ad2d3a"
      receivedPermissions.10.via.0.address:
-        "ethereum:0xe8606A55d105EF857F187C32Ae0E9a168aF8F497"
+        "eth:0xe8606A55d105EF857F187C32Ae0E9a168aF8F497"
      receivedPermissions.10.from:
-        "ethereum:0xEa83E8907C89Bc0D9517632f0ba081972E328631"
+        "eth:0xEa83E8907C89Bc0D9517632f0ba081972E328631"
      directlyReceivedPermissions.0.from:
-        "ethereum:0x44Ec40D86b4643Bd5110ED07BE188F8473Ad2d3a"
+        "eth:0x44Ec40D86b4643Bd5110ED07BE188F8473Ad2d3a"
    }
```

```diff
    EOA  (0xC410B8657FBB2CdbF0c5c5d5128576974467ba5e) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0xD80a805c86C14c879420eC6acb366D04D318fC0C"
+        "eth:0xD80a805c86C14c879420eC6acb366D04D318fC0C"
    }
```

```diff
    EOA  (0xCD795E6003Da105f4a1E11F73fb64b58B5C0f325) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0xD80a805c86C14c879420eC6acb366D04D318fC0C"
+        "eth:0xD80a805c86C14c879420eC6acb366D04D318fC0C"
    }
```

```diff
    EOA  (0xD19ee3f6Bf22A3A23eCd25B5ED0C655a2a56F65E) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0x36c6C69A6186D4475fc5c21181CD980Bd6E5e11F"
+        "eth:0x36c6C69A6186D4475fc5c21181CD980Bd6E5e11F"
    }
```

```diff
    contract SxNetworkMultisig (0xddb901e4E9A2e659aa1d6476d5D7A2833E7c3dFa) {
    +++ description: None
      directlyReceivedPermissions.0.from:
-        "ethereum:0x36c6C69A6186D4475fc5c21181CD980Bd6E5e11F"
+        "eth:0x36c6C69A6186D4475fc5c21181CD980Bd6E5e11F"
      directlyReceivedPermissions.1.from:
-        "ethereum:0x36c6C69A6186D4475fc5c21181CD980Bd6E5e11F"
+        "eth:0x36c6C69A6186D4475fc5c21181CD980Bd6E5e11F"
    }
```

```diff
    EOA  (0xe778F5Bf5dDB8614a1ab6321Cc557EDbC90e615f) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0x36c6C69A6186D4475fc5c21181CD980Bd6E5e11F"
+        "eth:0x36c6C69A6186D4475fc5c21181CD980Bd6E5e11F"
    }
```

```diff
    contract ProxyAdmin (0xe8606A55d105EF857F187C32Ae0E9a168aF8F497) {
    +++ description: None
      directlyReceivedPermissions.0.from:
-        "ethereum:0x44Ec40D86b4643Bd5110ED07BE188F8473Ad2d3a"
+        "eth:0x44Ec40D86b4643Bd5110ED07BE188F8473Ad2d3a"
      directlyReceivedPermissions.1.from:
-        "ethereum:0x5F00446D785421d65B50c192D7129e3C3906438A"
+        "eth:0x5F00446D785421d65B50c192D7129e3C3906438A"
      directlyReceivedPermissions.2.from:
-        "ethereum:0x73cfa0F6ae141212115657ad91Ad918E5d34d882"
+        "eth:0x73cfa0F6ae141212115657ad91Ad918E5d34d882"
      directlyReceivedPermissions.3.from:
-        "ethereum:0x9f1045201f8b9D0b12f6d1e40e8B8e6c047A81E3"
+        "eth:0x9f1045201f8b9D0b12f6d1e40e8B8e6c047A81E3"
      directlyReceivedPermissions.4.from:
-        "ethereum:0xa104C0426e95a5538e89131DbB4163d230C35f86"
+        "eth:0xa104C0426e95a5538e89131DbB4163d230C35f86"
      directlyReceivedPermissions.5.from:
-        "ethereum:0xB360b2f57c645E847148d7C479b7468AbF6F707d"
+        "eth:0xB360b2f57c645E847148d7C479b7468AbF6F707d"
      directlyReceivedPermissions.6.from:
-        "ethereum:0xB4968C66BECc8fb4f73b50354301c1aDb2Abaa91"
+        "eth:0xB4968C66BECc8fb4f73b50354301c1aDb2Abaa91"
      directlyReceivedPermissions.7.from:
-        "ethereum:0xD80a805c86C14c879420eC6acb366D04D318fC0C"
+        "eth:0xD80a805c86C14c879420eC6acb366D04D318fC0C"
      directlyReceivedPermissions.8.from:
-        "ethereum:0xEa83E8907C89Bc0D9517632f0ba081972E328631"
+        "eth:0xEa83E8907C89Bc0D9517632f0ba081972E328631"
    }
```

```diff
    EOA  (0xf244224843657bb59A6456754992Ea973655D918) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0xD80a805c86C14c879420eC6acb366D04D318fC0C"
+        "eth:0xD80a805c86C14c879420eC6acb366D04D318fC0C"
    }
```

Generated with discovered.json: 0x01a720f1cfea4af01d8e076945a23512528e3cf4

# Diff at Wed, 18 Jun 2025 12:24:15 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@a8e4f22a1441bd5040898cc3d3d62b3582942b65 block: 22122792
- current block number: 22122792

## Description

config: wasmmoduleroot map updated.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22122792 (main branch discovery), not current.

```diff
    contract RollupProxy (0x36c6C69A6186D4475fc5c21181CD980Bd6E5e11F) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      usedTypes.0.arg.0xdb698a2576298f25448bc092e52cf13b1e24141c997135d70f217d674bbeb69a:
+        "ArbOS v40 wasmModuleRoot"
    }
```

Generated with discovered.json: 0x72231e3e98342cac858f28244aa32a99deebefac

# Diff at Tue, 27 May 2025 08:30:01 GMT:

- chain: ethereum
- author: Michał Podsiadły (<michal.podsiadly@l2beat.com>)
- comparing to: main@fd658a9ed4bbd45fc5705d23b1906ca057d0d8b0 block: 22122792
- current block number: 22122792

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22122792 (main branch discovery), not current.

```diff
    contract RollupProxy (0x36c6C69A6186D4475fc5c21181CD980Bd6E5e11F) {
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

Generated with discovered.json: 0x01c3a9c8bc40d5e7cfcf424e1c2d84655801fba9

# Diff at Fri, 23 May 2025 09:41:06 GMT:

- chain: ethereum
- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@69cd181abbc3c830a6caf2f4429b37cae72ffdb8 block: 22122792
- current block number: 22122792

## Description

Introduced .role field on each permission, defaulting to field name on which it was defined (with '.' prefix)

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22122792 (main branch discovery), not current.

```diff
    EOA  (0x0181F0f0260Ac4149CA7Abf6c53d3E8053f95715) {
    +++ description: None
      receivedPermissions.0.role:
+        ".batchPosters"
    }
```

```diff
    EOA  (0x262711cA4DA6409Da795D8af9E18DDaF47397f80) {
    +++ description: None
      receivedPermissions.2.permission:
-        "validate"
+        "fastconfirm"
      receivedPermissions.2.description:
-        "Can propose new state roots (called nodes) and challenge state roots on the host chain."
+        "Can finalize a state root before the challenge period has passed. This allows withdrawing from the bridge based on the state root."
      receivedPermissions.2.role:
+        ".anyTrustFastConfirmer"
      receivedPermissions.1.role:
+        ".validators"
      receivedPermissions.1.via:
+        [{"address":"0xddb901e4E9A2e659aa1d6476d5D7A2833E7c3dFa"}]
      receivedPermissions.0.permission:
-        "fastconfirm"
+        "validate"
      receivedPermissions.0.description:
-        "Can finalize a state root before the challenge period has passed. This allows withdrawing from the bridge based on the state root."
+        "Can propose new state roots (called nodes) and challenge state roots on the host chain."
      receivedPermissions.0.via:
-        [{"address":"0xddb901e4E9A2e659aa1d6476d5D7A2833E7c3dFa"}]
      receivedPermissions.0.role:
+        ".validators"
    }
```

```diff
    EOA  (0x3648e2c562F00DeEA11B0b335Cf55C5EB2Df3A5F) {
    +++ description: None
      receivedPermissions.0.role:
+        ".validators"
    }
```

```diff
    contract UpgradeExecutor (0x44Ec40D86b4643Bd5110ED07BE188F8473Ad2d3a) {
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
    EOA  (0x75feC8Bb2d99076D776A5D46D1E3d42686520eF1) {
    +++ description: None
      receivedPermissions.0.role:
+        ".validators"
    }
```

```diff
    EOA  (0x7D9A25f61865D5A211a8be80a4Ef6bd201112717) {
    +++ description: None
      receivedPermissions.0.role:
+        ".batchPosters"
    }
```

```diff
    contract Gelato Multisig (0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb) {
    +++ description: None
      receivedPermissions.10.role:
+        "admin"
      receivedPermissions.9.role:
+        "admin"
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
    EOA  (0xC410B8657FBB2CdbF0c5c5d5128576974467ba5e) {
    +++ description: None
      receivedPermissions.0.role:
+        ".batchPosters"
    }
```

```diff
    EOA  (0xCD795E6003Da105f4a1E11F73fb64b58B5C0f325) {
    +++ description: None
      receivedPermissions.0.role:
+        ".batchPosters"
    }
```

```diff
    EOA  (0xD19ee3f6Bf22A3A23eCd25B5ED0C655a2a56F65E) {
    +++ description: None
      receivedPermissions.0.role:
+        ".validators"
    }
```

```diff
    contract SxNetworkMultisig (0xddb901e4E9A2e659aa1d6476d5D7A2833E7c3dFa) {
    +++ description: None
      directlyReceivedPermissions.1.permission:
-        "validate"
+        "fastconfirm"
      directlyReceivedPermissions.1.description:
-        "Can propose new state roots (called nodes) and challenge state roots on the host chain."
+        "Can finalize a state root before the challenge period has passed. This allows withdrawing from the bridge based on the state root."
      directlyReceivedPermissions.1.role:
+        ".anyTrustFastConfirmer"
      directlyReceivedPermissions.0.permission:
-        "fastconfirm"
+        "validate"
      directlyReceivedPermissions.0.description:
-        "Can finalize a state root before the challenge period has passed. This allows withdrawing from the bridge based on the state root."
+        "Can propose new state roots (called nodes) and challenge state roots on the host chain."
      directlyReceivedPermissions.0.role:
+        ".validators"
    }
```

```diff
    EOA  (0xe778F5Bf5dDB8614a1ab6321Cc557EDbC90e615f) {
    +++ description: None
      receivedPermissions.0.role:
+        ".validators"
    }
```

```diff
    contract ProxyAdmin (0xe8606A55d105EF857F187C32Ae0E9a168aF8F497) {
    +++ description: None
      directlyReceivedPermissions.8.role:
+        "admin"
      directlyReceivedPermissions.7.role:
+        "admin"
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
    EOA  (0xf244224843657bb59A6456754992Ea973655D918) {
    +++ description: None
      receivedPermissions.0.role:
+        ".batchPosters"
    }
```

Generated with discovered.json: 0xa164d34d8b152fae5f0661e616a7825cb7382208

# Diff at Fri, 02 May 2025 17:24:54 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@c598e33a0c469175b7abbd6c2a13b47b63d6b6a4 block: 22122792
- current block number: 22122792

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22122792 (main branch discovery), not current.

```diff
    contract RollupProxy (0x36c6C69A6186D4475fc5c21181CD980Bd6E5e11F) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      usedTypes.0.arg.0xaf1dbdfceb871c00bfbb1675983133df04f0ed04e89647812513c091e3a982b3:
+        "Celestia Nitro 3.3.2 wasmModuleRoot"
    }
```

Generated with discovered.json: 0x91410c9fa5b05ac4a2c894429457a366ab7d34f5

# Diff at Tue, 29 Apr 2025 08:19:13 GMT:

- chain: ethereum
- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@ef7477af00fe0b57a2f7cacf7e958c12494af662 block: 22122792
- current block number: 22122792

## Description

Field .issuedPermissions is removed from the output as no longer needed. Added 'permissionsConfigHash' due to refactoring of the modelling process (into a separate command).

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22122792 (main branch discovery), not current.

```diff
    contract RollupProxy (0x36c6C69A6186D4475fc5c21181CD980Bd6E5e11F) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      issuedPermissions:
-        [{"permission":"fastconfirm","to":"0x262711cA4DA6409Da795D8af9E18DDaF47397f80","description":"Can finalize a state root before the challenge period has passed. This allows withdrawing from the bridge based on the state root.","via":[{"address":"0xddb901e4E9A2e659aa1d6476d5D7A2833E7c3dFa"}]},{"permission":"interact","to":"0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb","description":"Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes.","via":[{"address":"0x44Ec40D86b4643Bd5110ED07BE188F8473Ad2d3a"}]},{"permission":"upgrade","to":"0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb","via":[{"address":"0x44Ec40D86b4643Bd5110ED07BE188F8473Ad2d3a"}]},{"permission":"validate","to":"0x262711cA4DA6409Da795D8af9E18DDaF47397f80","description":"Can propose new state roots (called nodes) and challenge state roots on the host chain.","via":[]},{"permission":"validate","to":"0x262711cA4DA6409Da795D8af9E18DDaF47397f80","description":"Can propose new state roots (called nodes) and challenge state roots on the host chain.","via":[{"address":"0xddb901e4E9A2e659aa1d6476d5D7A2833E7c3dFa"}]},{"permission":"validate","to":"0x3648e2c562F00DeEA11B0b335Cf55C5EB2Df3A5F","description":"Can propose new state roots (called nodes) and challenge state roots on the host chain.","via":[]},{"permission":"validate","to":"0x75feC8Bb2d99076D776A5D46D1E3d42686520eF1","description":"Can propose new state roots (called nodes) and challenge state roots on the host chain.","via":[]},{"permission":"validate","to":"0xD19ee3f6Bf22A3A23eCd25B5ED0C655a2a56F65E","description":"Can propose new state roots (called nodes) and challenge state roots on the host chain.","via":[]},{"permission":"validate","to":"0xe778F5Bf5dDB8614a1ab6321Cc557EDbC90e615f","description":"Can propose new state roots (called nodes) and challenge state roots on the host chain.","via":[]}]
    }
```

```diff
    contract UpgradeExecutor (0x44Ec40D86b4643Bd5110ED07BE188F8473Ad2d3a) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb","via":[{"address":"0x44Ec40D86b4643Bd5110ED07BE188F8473Ad2d3a"},{"address":"0xe8606A55d105EF857F187C32Ae0E9a168aF8F497"}]}]
    }
```

```diff
    contract GatewayRouter (0x5F00446D785421d65B50c192D7129e3C3906438A) {
    +++ description: This routing contract maps tokens to the correct escrow (gateway) to be then bridged with canonical messaging.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb","via":[{"address":"0x44Ec40D86b4643Bd5110ED07BE188F8473Ad2d3a"},{"address":"0xe8606A55d105EF857F187C32Ae0E9a168aF8F497"}]}]
    }
```

```diff
    contract ChallengeManager (0x73cfa0F6ae141212115657ad91Ad918E5d34d882) {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb","via":[{"address":"0x44Ec40D86b4643Bd5110ED07BE188F8473Ad2d3a"},{"address":"0xe8606A55d105EF857F187C32Ae0E9a168aF8F497"}]}]
    }
```

```diff
    contract RollupEventInbox (0x9f1045201f8b9D0b12f6d1e40e8B8e6c047A81E3) {
    +++ description: Helper contract sending configuration data over the bridge during the systems initialization.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb","via":[{"address":"0x44Ec40D86b4643Bd5110ED07BE188F8473Ad2d3a"},{"address":"0xe8606A55d105EF857F187C32Ae0E9a168aF8F497"}]}]
    }
```

```diff
    contract Bridge (0xa104C0426e95a5538e89131DbB4163d230C35f86) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb","via":[{"address":"0x44Ec40D86b4643Bd5110ED07BE188F8473Ad2d3a"},{"address":"0xe8606A55d105EF857F187C32Ae0E9a168aF8F497"}]}]
    }
```

```diff
    contract Outbox (0xB360b2f57c645E847148d7C479b7468AbF6F707d) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb","via":[{"address":"0x44Ec40D86b4643Bd5110ED07BE188F8473Ad2d3a"},{"address":"0xe8606A55d105EF857F187C32Ae0E9a168aF8F497"}]}]
    }
```

```diff
    contract ERC20Gateway (0xB4968C66BECc8fb4f73b50354301c1aDb2Abaa91) {
    +++ description: Escrows deposited ERC-20 assets for the canonical Bridge. Upon depositing, a generic token representation will be minted at the destination. Withdrawals are initiated by the Outbox contract.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb","via":[{"address":"0x44Ec40D86b4643Bd5110ED07BE188F8473Ad2d3a"},{"address":"0xe8606A55d105EF857F187C32Ae0E9a168aF8F497"}]}]
    }
```

```diff
    contract SequencerInbox (0xD80a805c86C14c879420eC6acb366D04D318fC0C) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      issuedPermissions:
-        [{"permission":"sequence","to":"0x0181F0f0260Ac4149CA7Abf6c53d3E8053f95715","description":"Can submit transaction batches or commitments to the SequencerInbox contract on the host chain.","via":[]},{"permission":"sequence","to":"0x7D9A25f61865D5A211a8be80a4Ef6bd201112717","description":"Can submit transaction batches or commitments to the SequencerInbox contract on the host chain.","via":[]},{"permission":"sequence","to":"0xC410B8657FBB2CdbF0c5c5d5128576974467ba5e","description":"Can submit transaction batches or commitments to the SequencerInbox contract on the host chain.","via":[]},{"permission":"sequence","to":"0xCD795E6003Da105f4a1E11F73fb64b58B5C0f325","description":"Can submit transaction batches or commitments to the SequencerInbox contract on the host chain.","via":[]},{"permission":"sequence","to":"0xf244224843657bb59A6456754992Ea973655D918","description":"Can submit transaction batches or commitments to the SequencerInbox contract on the host chain.","via":[]},{"permission":"upgrade","to":"0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb","via":[{"address":"0x44Ec40D86b4643Bd5110ED07BE188F8473Ad2d3a"},{"address":"0xe8606A55d105EF857F187C32Ae0E9a168aF8F497"}]}]
    }
```

```diff
    contract Inbox (0xEa83E8907C89Bc0D9517632f0ba081972E328631) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb","via":[{"address":"0x44Ec40D86b4643Bd5110ED07BE188F8473Ad2d3a"},{"address":"0xe8606A55d105EF857F187C32Ae0E9a168aF8F497"}]}]
    }
```

Generated with discovered.json: 0xb507edfabbaeda3dba42ec958a5aacd65df31d63

# Diff at Tue, 25 Mar 2025 08:41:33 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@b4a04714c0219993c2a83e7714e82e32f8a106ba block: 22065781
- current block number: 22122792

## Description

Minor upgrade of Bridge, Inbox and SequencerInbox:
- logic for tokens with custom decimals
- 7702 adjustments
- SequencerInbox upgraded to known implementation

## Watched changes

```diff
    contract Bridge (0xa104C0426e95a5538e89131DbB4163d230C35f86) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      sourceHashes.1:
-        "0x057de68a7007d55f4394ba6eafb2c802efcaf13583ff9342ea4d0ee3924d9be1"
+        "0xa7e3f6c355703ed46fcb2156862c4f01792b87beb10a87a81ce3bd5beee79b67"
      sourceHashes.0:
-        "0xa7e3f6c355703ed46fcb2156862c4f01792b87beb10a87a81ce3bd5beee79b67"
+        "0x32c73666d391a33c17183e4ab20bcb0f2b925d8a99da436d2ff99c13f403e289"
      values.$implementation:
-        "0x7EfcB76D0e2E776A298aAa603d433336e5F8b6ab"
+        "0xEfA1De858293593732a09c9dAA238BEC49595751"
      values.$pastUpgrades.1:
+        ["2024-07-05T09:57:59.000Z","0xe93b7e232ca2ff32a44ecb683683d9553409ab46eb90efa21a7bcfc111835074",["0x7EfcB76D0e2E776A298aAa603d433336e5F8b6ab"]]
      values.$pastUpgrades.0.2:
-        ["0x7EfcB76D0e2E776A298aAa603d433336e5F8b6ab"]
+        "0x5837fef008eaaa8871086f7e53f38a95b768926562e2e82cae17ddc7ab61b070"
      values.$pastUpgrades.0.1:
-        "0xe93b7e232ca2ff32a44ecb683683d9553409ab46eb90efa21a7bcfc111835074"
+        "2025-03-24T11:51:11.000Z"
      values.$pastUpgrades.0.0:
-        "2024-07-05T09:57:59.000Z"
+        ["0xEfA1De858293593732a09c9dAA238BEC49595751"]
      values.$upgradeCount:
-        1
+        2
      values.nativeTokenDecimals:
+        18
    }
```

```diff
    contract SequencerInbox (0xD80a805c86C14c879420eC6acb366D04D318fC0C) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      sourceHashes.0:
-        "0x50cf57b01499408fa99da27cf0fee96ec30f0d40667d1aa090c442bc80f0636b"
+        "0x6bb86ac4bd0d31e049f543fcf0a8f94c952252222f115246ef9d5b8104d803cc"
      values.$implementation:
-        "0x383f16fB2809a56fC639c1eE2c93Ad2aa7Ee130A"
+        "0xaEd84B70Be8117112a5aa0d93a7fBff463A03b18"
      values.$pastUpgrades.1:
+        ["2024-07-05T09:57:59.000Z","0xe93b7e232ca2ff32a44ecb683683d9553409ab46eb90efa21a7bcfc111835074",["0x383f16fB2809a56fC639c1eE2c93Ad2aa7Ee130A"]]
      values.$pastUpgrades.0.2:
-        "0xe93b7e232ca2ff32a44ecb683683d9553409ab46eb90efa21a7bcfc111835074"
+        ["0xaEd84B70Be8117112a5aa0d93a7fBff463A03b18"]
      values.$pastUpgrades.0.1:
-        ["0x383f16fB2809a56fC639c1eE2c93Ad2aa7Ee130A"]
+        "2025-03-24T16:55:11.000Z"
      values.$pastUpgrades.0.0:
-        "2024-07-05T09:57:59.000Z"
+        "0x2ecdabc185a5e5350c23c45cfbf746bd874b272e363729adcf975533d38790b8"
      values.$upgradeCount:
-        1
+        2
      values.reader4844:
-        "0x7Deda2425eC2d4EA0DF689A78de2fBF002075576"
+        "0x6c5c9E6c080a6C25f49DfFE85cfA71aaEAAfdE74"
    }
```

```diff
    contract Inbox (0xEa83E8907C89Bc0D9517632f0ba081972E328631) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      sourceHashes.0:
-        "0xcb390b491549387c8fcc09fb22fbea7adf54cc74b7247a0c738369ddd7049b92"
+        "0x25984fdfffb8141859c99299fb29e7a7460732d77111e5fe23792baa99f336a3"
      values.$implementation:
-        "0x31fAAAB44e74eB408d1FC69A14806B4b9cA09da2"
+        "0x6C051397fee2d79ccf92d1f3c5c6547fEBD838F4"
      values.$pastUpgrades.1:
+        ["2024-07-05T09:57:59.000Z","0xe93b7e232ca2ff32a44ecb683683d9553409ab46eb90efa21a7bcfc111835074",["0x31fAAAB44e74eB408d1FC69A14806B4b9cA09da2"]]
      values.$pastUpgrades.0.2:
-        "0xe93b7e232ca2ff32a44ecb683683d9553409ab46eb90efa21a7bcfc111835074"
+        ["0x6C051397fee2d79ccf92d1f3c5c6547fEBD838F4"]
      values.$pastUpgrades.0.1:
-        ["0x31fAAAB44e74eB408d1FC69A14806B4b9cA09da2"]
+        "2025-03-24T16:55:11.000Z"
      values.$pastUpgrades.0.0:
-        "2024-07-05T09:57:59.000Z"
+        "0x2ecdabc185a5e5350c23c45cfbf746bd874b272e363729adcf975533d38790b8"
      values.$upgradeCount:
-        1
+        2
    }
```

## Source code changes

```diff
.../Bridge/ERC20Bridge.sol                         | 54 +++++++++++++
 .../{.flat@22065781 => .flat}/Inbox/ERC20Inbox.sol | 92 +++++++++++++++++++---
 .../SequencerInbox/SequencerInbox.sol              | 24 ++++--
 3 files changed, 152 insertions(+), 18 deletions(-)
```

Generated with discovered.json: 0x79bc0877941eb4e884f1ddbde2bd06d30945bd39

# Diff at Tue, 18 Mar 2025 08:14:18 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@4ef7a8dbcec1cd9fec77aae2b73d81347a4ffb13 block: 22065781
- current block number: 22065781

## Description

Config: change Multisig names.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22065781 (main branch discovery), not current.

```diff
    contract Gelato Multisig (0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb) {
    +++ description: None
      name:
-        "GelatoMultisig"
+        "Gelato Multisig"
    }
```

Generated with discovered.json: 0x71d682b85faa2262d9cd7e0da04de00d239cc8ca

# Diff at Mon, 17 Mar 2025 09:43:10 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@90da84321b8376c8ab52bfe726fd12b8e67b7d2e block: 21994047
- current block number: 22065781

## Description

Add erc20 gateway escrow.
## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21994047 (main branch discovery), not current.

```diff
    contract GelatoMultisig (0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb) {
    +++ description: None
      receivedPermissions.10:
+        {"permission":"upgrade","from":"0xEa83E8907C89Bc0D9517632f0ba081972E328631","via":[{"address":"0xe8606A55d105EF857F187C32Ae0E9a168aF8F497"},{"address":"0x44Ec40D86b4643Bd5110ED07BE188F8473Ad2d3a"}]}
      receivedPermissions.9:
+        {"permission":"upgrade","from":"0xD80a805c86C14c879420eC6acb366D04D318fC0C","via":[{"address":"0xe8606A55d105EF857F187C32Ae0E9a168aF8F497"},{"address":"0x44Ec40D86b4643Bd5110ED07BE188F8473Ad2d3a"}]}
      receivedPermissions.8.from:
-        "0xEa83E8907C89Bc0D9517632f0ba081972E328631"
+        "0xB4968C66BECc8fb4f73b50354301c1aDb2Abaa91"
      receivedPermissions.7.from:
-        "0xD80a805c86C14c879420eC6acb366D04D318fC0C"
+        "0xB360b2f57c645E847148d7C479b7468AbF6F707d"
      receivedPermissions.6.from:
-        "0xB360b2f57c645E847148d7C479b7468AbF6F707d"
+        "0xa104C0426e95a5538e89131DbB4163d230C35f86"
      receivedPermissions.5.from:
-        "0xa104C0426e95a5538e89131DbB4163d230C35f86"
+        "0x9f1045201f8b9D0b12f6d1e40e8B8e6c047A81E3"
      receivedPermissions.4.from:
-        "0x9f1045201f8b9D0b12f6d1e40e8B8e6c047A81E3"
+        "0x73cfa0F6ae141212115657ad91Ad918E5d34d882"
      receivedPermissions.3.from:
-        "0x73cfa0F6ae141212115657ad91Ad918E5d34d882"
+        "0x5F00446D785421d65B50c192D7129e3C3906438A"
    }
```

```diff
    contract ProxyAdmin (0xe8606A55d105EF857F187C32Ae0E9a168aF8F497) {
    +++ description: None
      directlyReceivedPermissions.8:
+        {"permission":"upgrade","from":"0xEa83E8907C89Bc0D9517632f0ba081972E328631"}
      directlyReceivedPermissions.7:
+        {"permission":"upgrade","from":"0xD80a805c86C14c879420eC6acb366D04D318fC0C"}
      directlyReceivedPermissions.6.from:
-        "0xEa83E8907C89Bc0D9517632f0ba081972E328631"
+        "0xB4968C66BECc8fb4f73b50354301c1aDb2Abaa91"
      directlyReceivedPermissions.5.from:
-        "0xD80a805c86C14c879420eC6acb366D04D318fC0C"
+        "0xB360b2f57c645E847148d7C479b7468AbF6F707d"
      directlyReceivedPermissions.4.from:
-        "0xB360b2f57c645E847148d7C479b7468AbF6F707d"
+        "0xa104C0426e95a5538e89131DbB4163d230C35f86"
      directlyReceivedPermissions.3.from:
-        "0xa104C0426e95a5538e89131DbB4163d230C35f86"
+        "0x9f1045201f8b9D0b12f6d1e40e8B8e6c047A81E3"
      directlyReceivedPermissions.2.from:
-        "0x9f1045201f8b9D0b12f6d1e40e8B8e6c047A81E3"
+        "0x73cfa0F6ae141212115657ad91Ad918E5d34d882"
      directlyReceivedPermissions.1.from:
-        "0x73cfa0F6ae141212115657ad91Ad918E5d34d882"
+        "0x5F00446D785421d65B50c192D7129e3C3906438A"
    }
```

```diff
+   Status: CREATED
    contract GatewayRouter (0x5F00446D785421d65B50c192D7129e3C3906438A)
    +++ description: This routing contract maps tokens to the correct escrow (gateway) to be then bridged with canonical messaging.
```

```diff
+   Status: CREATED
    contract ERC20Gateway (0xB4968C66BECc8fb4f73b50354301c1aDb2Abaa91)
    +++ description: Escrows deposited ERC-20 assets for the canonical Bridge. Upon depositing, a generic token representation will be minted at the destination. Withdrawals are initiated by the Outbox contract.
```

Generated with discovered.json: 0xe590dafcc3293f1592cab3c459745bece2ffd6b8

# Diff at Fri, 07 Mar 2025 09:16:35 GMT:

- chain: ethereum
- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@454ef41fea41bcea030780b23fd1f11519ff78d2 block: 21915821
- current block number: 21994047

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21915821 (main branch discovery), not current.

```diff
    contract RollupProxy (0x36c6C69A6186D4475fc5c21181CD980Bd6E5e11F) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      values.isPostBoLD:
+        false
    }
```

Generated with discovered.json: 0x616880a585d57f0acb2a0d774ff8d39cdace2da5

# Diff at Thu, 06 Mar 2025 09:39:07 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@7119c715545bc86a4194761f42815f811ac6307a block: 21915821
- current block number: 21915821

## Description

Config related: set severity for arbitrum inbox/outbox changes to high and add historical In- and Outboxes via events.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21915821 (main branch discovery), not current.

```diff
    contract Bridge (0xa104C0426e95a5538e89131DbB4163d230C35f86) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
+++ description: All Inboxes that were ever set as allowed in the bridge.
+++ severity: HIGH
      values.inboxHistory:
+        ["0xEa83E8907C89Bc0D9517632f0ba081972E328631","0x9f1045201f8b9D0b12f6d1e40e8B8e6c047A81E3"]
+++ description: All Outboxes that were ever set as allowed in the bridge.
+++ severity: HIGH
      values.outboxHistory:
+        ["0xB360b2f57c645E847148d7C479b7468AbF6F707d"]
      fieldMeta:
+        {"allowedOutboxList":{"severity":"HIGH","description":"Can make calls as the bridge, steal all funds."},"outboxHistory":{"severity":"HIGH","description":"All Outboxes that were ever set as allowed in the bridge."},"allowedDelayedInboxList":{"severity":"HIGH","description":"Allowed to mint the gastoken on L2 and call `enqueueDelayedMessage()` on the bridge."},"inboxHistory":{"severity":"HIGH","description":"All Inboxes that were ever set as allowed in the bridge."}}
    }
```

Generated with discovered.json: 0x90951de540e57ca3e11bd5bb8c5c6a27d9d88a5d

# Diff at Tue, 04 Mar 2025 10:40:05 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@98d260b45fe0d2195ce5e629bd7b200c8706e8ba block: 21915821
- current block number: 21915821

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21915821 (main branch discovery), not current.

```diff
    contract OneStepProverHostIo (0x0003A96B27ce73505b43ea1b71a5aB06bec568C4) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      sinceBlock:
+        20569170
    }
```

```diff
    contract OneStepProverMemory (0x1cD76B9C33b2e3b04D7B181399d492B3e49AD7fB) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      sinceBlock:
+        20569168
    }
```

```diff
    contract ValidatorUtils (0x2b0E04Dc90e3fA58165CB41E2834B44A56E766aF) {
    +++ description: This contract implements view only utilities for validators.
      sinceBlock:
+        18736154
    }
```

```diff
    contract OneStepProver0 (0x2dCCAbE89cF76132619a9B18e9F9e48E837222b5) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      sinceBlock:
+        20569167
    }
```

```diff
    contract RollupProxy (0x36c6C69A6186D4475fc5c21181CD980Bd6E5e11F) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      sinceBlock:
+        20239556
    }
```

```diff
    contract UpgradeExecutor (0x44Ec40D86b4643Bd5110ED07BE188F8473Ad2d3a) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      sinceBlock:
+        20239556
    }
```

```diff
    contract ChallengeManager (0x73cfa0F6ae141212115657ad91Ad918E5d34d882) {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      sinceBlock:
+        20239556
    }
```

```diff
    contract OneStepProofEntry (0x8Faa21891B0b928afEbd5314D1D313f8f7B34DaC) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      sinceBlock:
+        20569171
    }
```

```diff
    contract RollupEventInbox (0x9f1045201f8b9D0b12f6d1e40e8B8e6c047A81E3) {
    +++ description: Helper contract sending configuration data over the bridge during the systems initialization.
      sinceBlock:
+        20239556
    }
```

```diff
    contract Bridge (0xa104C0426e95a5538e89131DbB4163d230C35f86) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      sinceBlock:
+        20239556
    }
```

```diff
    contract Outbox (0xB360b2f57c645E847148d7C479b7468AbF6F707d) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
      sinceBlock:
+        20239556
    }
```

```diff
    contract GelatoMultisig (0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb) {
    +++ description: None
      sinceBlock:
+        19521321
    }
```

```diff
    contract OneStepProverMath (0xCf4b98cFF2976E4eb579B9498f398b5bd279A6eD) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      sinceBlock:
+        20569169
    }
```

```diff
    contract SequencerInbox (0xD80a805c86C14c879420eC6acb366D04D318fC0C) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      sinceBlock:
+        20239556
    }
```

```diff
    contract SxNetworkMultisig (0xddb901e4E9A2e659aa1d6476d5D7A2833E7c3dFa) {
    +++ description: None
      sinceBlock:
+        21070203
    }
```

```diff
    contract ProxyAdmin (0xe8606A55d105EF857F187C32Ae0E9a168aF8F497) {
    +++ description: None
      sinceBlock:
+        20239556
    }
```

```diff
    contract Inbox (0xEa83E8907C89Bc0D9517632f0ba081972E328631) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      sinceBlock:
+        20239556
    }
```

Generated with discovered.json: 0xf7ddce39f79812b167790e9a1aac363846cc0d2a

# Diff at Thu, 27 Feb 2025 11:46:56 GMT:

- chain: ethereum
- author: Michał Podsiadły (<michal.podsiadly@l2beat.com>)
- comparing to: main@a4b50e45bb44f8ceeea29f9236088d26a843c885 block: 21915821
- current block number: 21915821

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21915821 (main branch discovery), not current.

```diff
    contract RollupEventInbox (0x9f1045201f8b9D0b12f6d1e40e8B8e6c047A81E3) {
    +++ description: Helper contract sending configuration data over the bridge during the systems initialization.
      name:
-        "ERC20RollupEventInbox"
+        "RollupEventInbox"
      displayName:
-        "RollupEventInbox"
    }
```

```diff
    contract Bridge (0xa104C0426e95a5538e89131DbB4163d230C35f86) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      name:
-        "ERC20Bridge"
+        "Bridge"
      displayName:
-        "Bridge"
    }
```

```diff
    contract Outbox (0xB360b2f57c645E847148d7C479b7468AbF6F707d) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
      name:
-        "ERC20Outbox"
+        "Outbox"
      displayName:
-        "Outbox"
    }
```

```diff
    contract Inbox (0xEa83E8907C89Bc0D9517632f0ba081972E328631) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      name:
-        "ERC20Inbox"
+        "Inbox"
      displayName:
-        "Inbox"
    }
```

Generated with discovered.json: 0x64e7802d6f87bf89ef5508c8b380534ea178f0eb

# Diff at Mon, 24 Feb 2025 15:39:17 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@cfe18eb30997850b8abc4c6e718cd2a363aa4309 block: 21895121
- current block number: 21915821

## Description

Config: added a single caldera multisig name.

## Watched changes

```diff
    contract RollupProxy (0x36c6C69A6186D4475fc5c21181CD980Bd6E5e11F) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      values.stakerCount:
-        1
+        2
    }
```

Generated with discovered.json: 0xda03eea4bba55d665b5671c0fbca8556ded421ef

# Diff at Fri, 21 Feb 2025 13:50:12 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@d219f271711b2cf7a164e3443bead5e4957d13a8 block: 21628404
- current block number: 21895121

## Description

Add operator addresses.
Config related: Set orbit stack contract categories.

## Watched changes

```diff
    contract RollupProxy (0x36c6C69A6186D4475fc5c21181CD980Bd6E5e11F) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      issuedPermissions.8:
+        {"permission":"validate","to":"0xe778F5Bf5dDB8614a1ab6321Cc557EDbC90e615f","description":"Can propose new state roots (called nodes) and challenge state roots on the host chain.","via":[]}
      issuedPermissions.7:
+        {"permission":"validate","to":"0xD19ee3f6Bf22A3A23eCd25B5ED0C655a2a56F65E","description":"Can propose new state roots (called nodes) and challenge state roots on the host chain.","via":[]}
      issuedPermissions.6:
+        {"permission":"validate","to":"0x75feC8Bb2d99076D776A5D46D1E3d42686520eF1","description":"Can propose new state roots (called nodes) and challenge state roots on the host chain.","via":[]}
      issuedPermissions.5:
+        {"permission":"validate","to":"0x3648e2c562F00DeEA11B0b335Cf55C5EB2Df3A5F","description":"Can propose new state roots (called nodes) and challenge state roots on the host chain.","via":[]}
      issuedPermissions.4.to:
-        "0x9C56265ef2989138d264b30fBbA2043902daBdf8"
+        "0x262711cA4DA6409Da795D8af9E18DDaF47397f80"
      issuedPermissions.3.to:
-        "0x9C56265ef2989138d264b30fBbA2043902daBdf8"
+        "0x262711cA4DA6409Da795D8af9E18DDaF47397f80"
      issuedPermissions.0.to:
-        "0x9C56265ef2989138d264b30fBbA2043902daBdf8"
+        "0x262711cA4DA6409Da795D8af9E18DDaF47397f80"
+++ description: Increments on each Validator change.
      values.setValidatorCount:
-        2
+        4
      values.validators.5:
+        "0xe778F5Bf5dDB8614a1ab6321Cc557EDbC90e615f"
      values.validators.4:
+        "0xddb901e4E9A2e659aa1d6476d5D7A2833E7c3dFa"
      values.validators.3:
+        "0xD19ee3f6Bf22A3A23eCd25B5ED0C655a2a56F65E"
      values.validators.2:
+        "0x75feC8Bb2d99076D776A5D46D1E3d42686520eF1"
      values.validators.1:
-        "0xddb901e4E9A2e659aa1d6476d5D7A2833E7c3dFa"
+        "0x3648e2c562F00DeEA11B0b335Cf55C5EB2Df3A5F"
      values.validators.0:
-        "0x9C56265ef2989138d264b30fBbA2043902daBdf8"
+        "0x262711cA4DA6409Da795D8af9E18DDaF47397f80"
    }
```

```diff
    contract SequencerInbox (0xD80a805c86C14c879420eC6acb366D04D318fC0C) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      issuedPermissions.5:
+        {"permission":"upgrade","to":"0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb","via":[{"address":"0x44Ec40D86b4643Bd5110ED07BE188F8473Ad2d3a"},{"address":"0xe8606A55d105EF857F187C32Ae0E9a168aF8F497"}]}
      issuedPermissions.4:
+        {"permission":"sequence","to":"0xf244224843657bb59A6456754992Ea973655D918","description":"Can submit transaction batches or commitments to the SequencerInbox contract on the host chain.","via":[]}
      issuedPermissions.3:
+        {"permission":"sequence","to":"0xCD795E6003Da105f4a1E11F73fb64b58B5C0f325","description":"Can submit transaction batches or commitments to the SequencerInbox contract on the host chain.","via":[]}
      issuedPermissions.2:
+        {"permission":"sequence","to":"0xC410B8657FBB2CdbF0c5c5d5128576974467ba5e","description":"Can submit transaction batches or commitments to the SequencerInbox contract on the host chain.","via":[]}
      issuedPermissions.1.permission:
-        "upgrade"
+        "sequence"
      issuedPermissions.1.to:
-        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
+        "0x7D9A25f61865D5A211a8be80a4Ef6bd201112717"
      issuedPermissions.1.via.1:
-        {"address":"0xe8606A55d105EF857F187C32Ae0E9a168aF8F497"}
      issuedPermissions.1.via.0:
-        {"address":"0x44Ec40D86b4643Bd5110ED07BE188F8473Ad2d3a"}
      issuedPermissions.1.description:
+        "Can submit transaction batches or commitments to the SequencerInbox contract on the host chain."
      issuedPermissions.0.to:
-        "0x90906eA9eb38B6afC104bB761F493b2a78c85024"
+        "0x0181F0f0260Ac4149CA7Abf6c53d3E8053f95715"
      values.batchPosters.4:
+        "0xf244224843657bb59A6456754992Ea973655D918"
      values.batchPosters.3:
+        "0xCD795E6003Da105f4a1E11F73fb64b58B5C0f325"
      values.batchPosters.2:
+        "0xC410B8657FBB2CdbF0c5c5d5128576974467ba5e"
      values.batchPosters.1:
+        "0x7D9A25f61865D5A211a8be80a4Ef6bd201112717"
      values.batchPosters.0:
-        "0x90906eA9eb38B6afC104bB761F493b2a78c85024"
+        "0x0181F0f0260Ac4149CA7Abf6c53d3E8053f95715"
      values.setIsBatchPosterCount:
-        1
+        3
    }
```

```diff
    contract SxNetworkMultisig (0xddb901e4E9A2e659aa1d6476d5D7A2833E7c3dFa) {
    +++ description: None
      values.$members.0:
-        "0x9C56265ef2989138d264b30fBbA2043902daBdf8"
+        "0x262711cA4DA6409Da795D8af9E18DDaF47397f80"
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21628404 (main branch discovery), not current.

```diff
    contract RollupProxy (0x36c6C69A6186D4475fc5c21181CD980Bd6E5e11F) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract UpgradeExecutor (0x44Ec40D86b4643Bd5110ED07BE188F8473Ad2d3a) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      category:
+        {"name":"Governance","priority":3}
    }
```

```diff
    contract ChallengeManager (0x73cfa0F6ae141212115657ad91Ad918E5d34d882) {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract ERC20Bridge (0xa104C0426e95a5538e89131DbB4163d230C35f86) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract ERC20Outbox (0xB360b2f57c645E847148d7C479b7468AbF6F707d) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
      category:
+        {"name":"Canonical Bridges","priority":2}
    }
```

```diff
    contract SequencerInbox (0xD80a805c86C14c879420eC6acb366D04D318fC0C) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract ERC20Inbox (0xEa83E8907C89Bc0D9517632f0ba081972E328631) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      category:
+        {"name":"Canonical Bridges","priority":2}
    }
```

Generated with discovered.json: 0x367bb0fbb62668c56317b151916c1ff121c135cd

# Diff at Tue, 04 Feb 2025 12:33:10 GMT:

- chain: ethereum
- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@145553eed7ba44636411ecb25e4099728acd02f9 block: 21628404
- current block number: 21628404

## Description

Rename 'configure' permission to 'interact'

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21628404 (main branch discovery), not current.

```diff
    contract RollupProxy (0x36c6C69A6186D4475fc5c21181CD980Bd6E5e11F) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      issuedPermissions.1.permission:
-        "fastconfirm"
+        "interact"
      issuedPermissions.1.to:
-        "0x9C56265ef2989138d264b30fBbA2043902daBdf8"
+        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
      issuedPermissions.1.description:
-        "Can finalize a state root before the challenge period has passed. This allows withdrawing from the bridge based on the state root."
+        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
      issuedPermissions.1.via.0.address:
-        "0xddb901e4E9A2e659aa1d6476d5D7A2833E7c3dFa"
+        "0x44Ec40D86b4643Bd5110ED07BE188F8473Ad2d3a"
      issuedPermissions.0.permission:
-        "configure"
+        "fastconfirm"
      issuedPermissions.0.to:
-        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
+        "0x9C56265ef2989138d264b30fBbA2043902daBdf8"
      issuedPermissions.0.description:
-        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
+        "Can finalize a state root before the challenge period has passed. This allows withdrawing from the bridge based on the state root."
      issuedPermissions.0.via.0.address:
-        "0x44Ec40D86b4643Bd5110ED07BE188F8473Ad2d3a"
+        "0xddb901e4E9A2e659aa1d6476d5D7A2833E7c3dFa"
    }
```

```diff
    contract UpgradeExecutor (0x44Ec40D86b4643Bd5110ED07BE188F8473Ad2d3a) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      directlyReceivedPermissions.1.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract GelatoMultisig (0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb) {
    +++ description: None
      receivedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

Generated with discovered.json: 0x3048474415fdf79ea31ee23cbca323b5a71e2312

# Diff at Mon, 20 Jan 2025 11:10:14 GMT:

- chain: ethereum
- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@2c8b4f3d9910bb6371be9b4df87b70856e7d8c64 block: 21628404
- current block number: 21628404

## Description

Rerun on the same block number. Applies fixes to permissions and via field. Renames permission's target to to/from.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21628404 (main branch discovery), not current.

```diff
    contract RollupProxy (0x36c6C69A6186D4475fc5c21181CD980Bd6E5e11F) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      issuedPermissions.4.target:
-        "0x9C56265ef2989138d264b30fBbA2043902daBdf8"
      issuedPermissions.4.via.0.delay:
-        0
      issuedPermissions.4.via.0.description:
-        "Can propose new state roots (called nodes) and challenge state roots on the host chain."
      issuedPermissions.4.to:
+        "0x9C56265ef2989138d264b30fBbA2043902daBdf8"
      issuedPermissions.4.description:
+        "Can propose new state roots (called nodes) and challenge state roots on the host chain."
      issuedPermissions.3.target:
-        "0x9C56265ef2989138d264b30fBbA2043902daBdf8"
      issuedPermissions.3.to:
+        "0x9C56265ef2989138d264b30fBbA2043902daBdf8"
      issuedPermissions.3.description:
+        "Can propose new state roots (called nodes) and challenge state roots on the host chain."
      issuedPermissions.2.target:
-        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
      issuedPermissions.2.via.0.delay:
-        0
      issuedPermissions.2.to:
+        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
      issuedPermissions.1.target:
-        "0x9C56265ef2989138d264b30fBbA2043902daBdf8"
      issuedPermissions.1.via.0.delay:
-        0
      issuedPermissions.1.via.0.description:
-        "Can finalize a state root before the challenge period has passed. This allows withdrawing from the bridge based on the state root."
      issuedPermissions.1.to:
+        "0x9C56265ef2989138d264b30fBbA2043902daBdf8"
      issuedPermissions.1.description:
+        "Can finalize a state root before the challenge period has passed. This allows withdrawing from the bridge based on the state root."
      issuedPermissions.0.target:
-        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.via.0.description:
-        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
      issuedPermissions.0.to:
+        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
      issuedPermissions.0.description:
+        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
    }
```

```diff
    contract UpgradeExecutor (0x44Ec40D86b4643Bd5110ED07BE188F8473Ad2d3a) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      issuedPermissions.0.target:
-        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
      issuedPermissions.0.via.1.delay:
-        0
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
      directlyReceivedPermissions.2.target:
-        "0x36c6C69A6186D4475fc5c21181CD980Bd6E5e11F"
      directlyReceivedPermissions.2.from:
+        "0x36c6C69A6186D4475fc5c21181CD980Bd6E5e11F"
      directlyReceivedPermissions.1.target:
-        "0x36c6C69A6186D4475fc5c21181CD980Bd6E5e11F"
      directlyReceivedPermissions.1.from:
+        "0x36c6C69A6186D4475fc5c21181CD980Bd6E5e11F"
      directlyReceivedPermissions.0.target:
-        "0xe8606A55d105EF857F187C32Ae0E9a168aF8F497"
      directlyReceivedPermissions.0.from:
+        "0xe8606A55d105EF857F187C32Ae0E9a168aF8F497"
    }
```

```diff
    contract ChallengeManager (0x73cfa0F6ae141212115657ad91Ad918E5d34d882) {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      issuedPermissions.0.target:
-        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
      issuedPermissions.0.via.1.delay:
-        0
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
    }
```

```diff
    contract ERC20RollupEventInbox (0x9f1045201f8b9D0b12f6d1e40e8B8e6c047A81E3) {
    +++ description: Helper contract sending configuration data over the bridge during the systems initialization.
      issuedPermissions.0.target:
-        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
      issuedPermissions.0.via.1.delay:
-        0
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
    }
```

```diff
    contract ERC20Bridge (0xa104C0426e95a5538e89131DbB4163d230C35f86) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      issuedPermissions.0.target:
-        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
      issuedPermissions.0.via.1.delay:
-        0
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
    }
```

```diff
    contract ERC20Outbox (0xB360b2f57c645E847148d7C479b7468AbF6F707d) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
      issuedPermissions.0.target:
-        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
      issuedPermissions.0.via.1.delay:
-        0
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
    }
```

```diff
    contract GelatoMultisig (0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb) {
    +++ description: None
      receivedPermissions.8.target:
-        "0xEa83E8907C89Bc0D9517632f0ba081972E328631"
      receivedPermissions.8.from:
+        "0xEa83E8907C89Bc0D9517632f0ba081972E328631"
      receivedPermissions.7.target:
-        "0xD80a805c86C14c879420eC6acb366D04D318fC0C"
      receivedPermissions.7.from:
+        "0xD80a805c86C14c879420eC6acb366D04D318fC0C"
      receivedPermissions.6.target:
-        "0xB360b2f57c645E847148d7C479b7468AbF6F707d"
      receivedPermissions.6.from:
+        "0xB360b2f57c645E847148d7C479b7468AbF6F707d"
      receivedPermissions.5.target:
-        "0xa104C0426e95a5538e89131DbB4163d230C35f86"
      receivedPermissions.5.from:
+        "0xa104C0426e95a5538e89131DbB4163d230C35f86"
      receivedPermissions.4.target:
-        "0x9f1045201f8b9D0b12f6d1e40e8B8e6c047A81E3"
      receivedPermissions.4.from:
+        "0x9f1045201f8b9D0b12f6d1e40e8B8e6c047A81E3"
      receivedPermissions.3.target:
-        "0x73cfa0F6ae141212115657ad91Ad918E5d34d882"
      receivedPermissions.3.from:
+        "0x73cfa0F6ae141212115657ad91Ad918E5d34d882"
      receivedPermissions.2.target:
-        "0x44Ec40D86b4643Bd5110ED07BE188F8473Ad2d3a"
      receivedPermissions.2.from:
+        "0x44Ec40D86b4643Bd5110ED07BE188F8473Ad2d3a"
      receivedPermissions.1.target:
-        "0x36c6C69A6186D4475fc5c21181CD980Bd6E5e11F"
      receivedPermissions.1.from:
+        "0x36c6C69A6186D4475fc5c21181CD980Bd6E5e11F"
      receivedPermissions.0.target:
-        "0x36c6C69A6186D4475fc5c21181CD980Bd6E5e11F"
      receivedPermissions.0.from:
+        "0x36c6C69A6186D4475fc5c21181CD980Bd6E5e11F"
      directlyReceivedPermissions.0.target:
-        "0x44Ec40D86b4643Bd5110ED07BE188F8473Ad2d3a"
      directlyReceivedPermissions.0.from:
+        "0x44Ec40D86b4643Bd5110ED07BE188F8473Ad2d3a"
    }
```

```diff
    contract SequencerInbox (0xD80a805c86C14c879420eC6acb366D04D318fC0C) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      issuedPermissions.1.target:
-        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
      issuedPermissions.1.via.1.delay:
-        0
      issuedPermissions.1.via.0.delay:
-        0
      issuedPermissions.1.to:
+        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
      issuedPermissions.0.target:
-        "0x90906eA9eb38B6afC104bB761F493b2a78c85024"
      issuedPermissions.0.to:
+        "0x90906eA9eb38B6afC104bB761F493b2a78c85024"
      issuedPermissions.0.description:
+        "Can submit transaction batches or commitments to the SequencerInbox contract on the host chain."
    }
```

```diff
    contract SxNetworkMultisig (0xddb901e4E9A2e659aa1d6476d5D7A2833E7c3dFa) {
    +++ description: None
      directlyReceivedPermissions.1.target:
-        "0x36c6C69A6186D4475fc5c21181CD980Bd6E5e11F"
      directlyReceivedPermissions.1.from:
+        "0x36c6C69A6186D4475fc5c21181CD980Bd6E5e11F"
      directlyReceivedPermissions.0.target:
-        "0x36c6C69A6186D4475fc5c21181CD980Bd6E5e11F"
      directlyReceivedPermissions.0.from:
+        "0x36c6C69A6186D4475fc5c21181CD980Bd6E5e11F"
    }
```

```diff
    contract ProxyAdmin (0xe8606A55d105EF857F187C32Ae0E9a168aF8F497) {
    +++ description: None
      directlyReceivedPermissions.6.target:
-        "0xEa83E8907C89Bc0D9517632f0ba081972E328631"
      directlyReceivedPermissions.6.from:
+        "0xEa83E8907C89Bc0D9517632f0ba081972E328631"
      directlyReceivedPermissions.5.target:
-        "0xD80a805c86C14c879420eC6acb366D04D318fC0C"
      directlyReceivedPermissions.5.from:
+        "0xD80a805c86C14c879420eC6acb366D04D318fC0C"
      directlyReceivedPermissions.4.target:
-        "0xB360b2f57c645E847148d7C479b7468AbF6F707d"
      directlyReceivedPermissions.4.from:
+        "0xB360b2f57c645E847148d7C479b7468AbF6F707d"
      directlyReceivedPermissions.3.target:
-        "0xa104C0426e95a5538e89131DbB4163d230C35f86"
      directlyReceivedPermissions.3.from:
+        "0xa104C0426e95a5538e89131DbB4163d230C35f86"
      directlyReceivedPermissions.2.target:
-        "0x9f1045201f8b9D0b12f6d1e40e8B8e6c047A81E3"
      directlyReceivedPermissions.2.from:
+        "0x9f1045201f8b9D0b12f6d1e40e8B8e6c047A81E3"
      directlyReceivedPermissions.1.target:
-        "0x73cfa0F6ae141212115657ad91Ad918E5d34d882"
      directlyReceivedPermissions.1.from:
+        "0x73cfa0F6ae141212115657ad91Ad918E5d34d882"
      directlyReceivedPermissions.0.target:
-        "0x44Ec40D86b4643Bd5110ED07BE188F8473Ad2d3a"
      directlyReceivedPermissions.0.from:
+        "0x44Ec40D86b4643Bd5110ED07BE188F8473Ad2d3a"
    }
```

```diff
    contract ERC20Inbox (0xEa83E8907C89Bc0D9517632f0ba081972E328631) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      issuedPermissions.0.target:
-        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
      issuedPermissions.0.via.1.delay:
-        0
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
    }
```

Generated with discovered.json: 0x7b1b25a0aa9fdefa50ef28e1d79401e0d657433d

# Diff at Wed, 15 Jan 2025 07:31:38 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@3ea176aee1470e5ec80e65adfc81a954f84584d8 block: 21465245
- current block number: 21628404

## Description

Two signers added to Gelato MS, now 4/10.

## Watched changes

```diff
    contract GelatoMultisig (0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb) {
    +++ description: None
      values.$members.9:
+        "0x547D0F472309e4239b296D01e03bEDc101241a26"
      values.$members.8:
+        "0xf83bC4688979b13Da02CB94c76cEB169540760b5"
      values.$members.7:
-        "0x547D0F472309e4239b296D01e03bEDc101241a26"
+        "0x01a0A7BaAAca31AFB5b770FeFD69CE4917D9c32e"
      values.$members.6:
-        "0xf83bC4688979b13Da02CB94c76cEB169540760b5"
+        "0x88De44422E1b1c30bc530c35aEdb9f5aD0e6fD52"
      values.$members.5:
-        "0x01a0A7BaAAca31AFB5b770FeFD69CE4917D9c32e"
+        "0x5bE3E96Cdc3A97628bD7308d3588B9a474F4A54d"
      values.$members.4:
-        "0xBc0ca6865d6883a83D4aDDD6b862aE042d855E0d"
+        "0x691C2EF68e25E620fa6cAdE2728f6aE34F37aAD2"
      values.$members.3:
-        "0x5bE3E96Cdc3A97628bD7308d3588B9a474F4A54d"
+        "0x28bB9385A588EF4747264D19B9A9F1603591680c"
      values.$members.2:
-        "0x691C2EF68e25E620fa6cAdE2728f6aE34F37aAD2"
+        "0xB0C2CBFfCd4C31AFFEe14993b6d48f99D285f621"
      values.$members.1:
-        "0x28bB9385A588EF4747264D19B9A9F1603591680c"
+        "0xB65540bBA534E88EB4a5062D0E6519C07063b259"
      values.$members.0:
-        "0xB0C2CBFfCd4C31AFFEe14993b6d48f99D285f621"
+        "0x349f3839012DB2271e1BeC68F1668471D175Adb9"
      values.multisigThreshold:
-        "4 of 8 (50%)"
+        "4 of 10 (40%)"
    }
```

Generated with discovered.json: 0xc23d6aad76ddbfabbbbc158f26e88d9575b3c638

# Diff at Wed, 08 Jan 2025 10:44:55 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@20bf0eaa1dce373e2c004314fef59d2d1bdf5502 block: 21465245
- current block number: 21465245

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21465245 (main branch discovery), not current.

```diff
    contract ERC20Bridge (0xa104C0426e95a5538e89131DbB4163d230C35f86) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      description:
-        "Escrow contract for the project's gas token (Can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging."
+        "Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging."
    }
```

Generated with discovered.json: 0xf1a7ffa950d9d7ed2332e2d1cf0bda05022be80b

# Diff at Mon, 23 Dec 2024 12:40:44 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@18325a975c44684702f30ee366361589e4c2ed8c block: 21365599
- current block number: 21465245

## Description

Config related: Celestia-Nitro wmroot added.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21365599 (main branch discovery), not current.

```diff
    contract RollupProxy (0x36c6C69A6186D4475fc5c21181CD980Bd6E5e11F) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      usedTypes.0.arg.0xe81f986823a85105c5fd91bb53b4493d38c0c26652d23f76a7405ac889908287:
+        "Celestia Nitro 3.2.1 wasmModuleRoot"
    }
```

Generated with discovered.json: 0xa0cbd576d49f5d8fede952bead51c254a76cdaaf

# Diff at Mon, 09 Dec 2024 14:39:43 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@02974be0caac873bba9178e618086aa67aaf0b90 block: 21285828
- current block number: 21365599

## Description

Replace Upgrader EOA with Gelato Multisig.

## Watched changes

```diff
    contract RollupProxy (0x36c6C69A6186D4475fc5c21181CD980Bd6E5e11F) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      issuedPermissions.6:
-        {"permission":"validate","target":"0x9C56265ef2989138d264b30fBbA2043902daBdf8","via":[{"address":"0xddb901e4E9A2e659aa1d6476d5D7A2833E7c3dFa","delay":0,"description":"Can propose new state roots (called nodes) and challenge state roots on the host chain."}]}
      issuedPermissions.5:
-        {"permission":"validate","target":"0x9C56265ef2989138d264b30fBbA2043902daBdf8","via":[]}
      issuedPermissions.4.permission:
-        "upgrade"
+        "validate"
      issuedPermissions.4.target:
-        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
+        "0x9C56265ef2989138d264b30fBbA2043902daBdf8"
      issuedPermissions.4.via.0.address:
-        "0x44Ec40D86b4643Bd5110ED07BE188F8473Ad2d3a"
+        "0xddb901e4E9A2e659aa1d6476d5D7A2833E7c3dFa"
      issuedPermissions.4.via.0.description:
+        "Can propose new state roots (called nodes) and challenge state roots on the host chain."
      issuedPermissions.3.permission:
-        "upgrade"
+        "validate"
      issuedPermissions.3.target:
-        "0xa9d1C9D877F235C21d803e4a0b81F8ca6C4c83AC"
+        "0x9C56265ef2989138d264b30fBbA2043902daBdf8"
      issuedPermissions.3.via.0:
-        {"address":"0x44Ec40D86b4643Bd5110ED07BE188F8473Ad2d3a","delay":0}
      issuedPermissions.2.permission:
-        "fastconfirm"
+        "upgrade"
      issuedPermissions.2.target:
-        "0x9C56265ef2989138d264b30fBbA2043902daBdf8"
+        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
      issuedPermissions.2.via.0.address:
-        "0xddb901e4E9A2e659aa1d6476d5D7A2833E7c3dFa"
+        "0x44Ec40D86b4643Bd5110ED07BE188F8473Ad2d3a"
      issuedPermissions.2.via.0.description:
-        "Can finalize a state root before the challenge period has passed. This allows withdrawing from the bridge based on the state root."
      issuedPermissions.1.permission:
-        "configure"
+        "fastconfirm"
      issuedPermissions.1.target:
-        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
+        "0x9C56265ef2989138d264b30fBbA2043902daBdf8"
      issuedPermissions.1.via.0.address:
-        "0x44Ec40D86b4643Bd5110ED07BE188F8473Ad2d3a"
+        "0xddb901e4E9A2e659aa1d6476d5D7A2833E7c3dFa"
      issuedPermissions.1.via.0.description:
-        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
+        "Can finalize a state root before the challenge period has passed. This allows withdrawing from the bridge based on the state root."
      issuedPermissions.0.target:
-        "0xa9d1C9D877F235C21d803e4a0b81F8ca6C4c83AC"
+        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
    }
```

```diff
    contract UpgradeExecutor (0x44Ec40D86b4643Bd5110ED07BE188F8473Ad2d3a) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      issuedPermissions.1:
-        {"permission":"upgrade","target":"0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb","via":[{"address":"0x44Ec40D86b4643Bd5110ED07BE188F8473Ad2d3a","delay":0},{"address":"0xe8606A55d105EF857F187C32Ae0E9a168aF8F497","delay":0}]}
      issuedPermissions.0.target:
-        "0xa9d1C9D877F235C21d803e4a0b81F8ca6C4c83AC"
+        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
      values.accessControl.EXECUTOR_ROLE.members.1:
-        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
      values.accessControl.EXECUTOR_ROLE.members.0:
-        "0xa9d1C9D877F235C21d803e4a0b81F8ca6C4c83AC"
+        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
      values.executors.1:
-        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
      values.executors.0:
-        "0xa9d1C9D877F235C21d803e4a0b81F8ca6C4c83AC"
+        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
    }
```

```diff
    contract ChallengeManager (0x73cfa0F6ae141212115657ad91Ad918E5d34d882) {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      issuedPermissions.1:
-        {"permission":"upgrade","target":"0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb","via":[{"address":"0x44Ec40D86b4643Bd5110ED07BE188F8473Ad2d3a","delay":0},{"address":"0xe8606A55d105EF857F187C32Ae0E9a168aF8F497","delay":0}]}
      issuedPermissions.0.target:
-        "0xa9d1C9D877F235C21d803e4a0b81F8ca6C4c83AC"
+        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
    }
```

```diff
    contract ERC20RollupEventInbox (0x9f1045201f8b9D0b12f6d1e40e8B8e6c047A81E3) {
    +++ description: Helper contract sending configuration data over the bridge during the systems initialization.
      issuedPermissions.1:
-        {"permission":"upgrade","target":"0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb","via":[{"address":"0x44Ec40D86b4643Bd5110ED07BE188F8473Ad2d3a","delay":0},{"address":"0xe8606A55d105EF857F187C32Ae0E9a168aF8F497","delay":0}]}
      issuedPermissions.0.target:
-        "0xa9d1C9D877F235C21d803e4a0b81F8ca6C4c83AC"
+        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
    }
```

```diff
    contract ERC20Bridge (0xa104C0426e95a5538e89131DbB4163d230C35f86) {
    +++ description: Escrow contract for the project's gas token (Can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      issuedPermissions.1:
-        {"permission":"upgrade","target":"0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb","via":[{"address":"0x44Ec40D86b4643Bd5110ED07BE188F8473Ad2d3a","delay":0},{"address":"0xe8606A55d105EF857F187C32Ae0E9a168aF8F497","delay":0}]}
      issuedPermissions.0.target:
-        "0xa9d1C9D877F235C21d803e4a0b81F8ca6C4c83AC"
+        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
    }
```

```diff
    contract ERC20Outbox (0xB360b2f57c645E847148d7C479b7468AbF6F707d) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
      issuedPermissions.1:
-        {"permission":"upgrade","target":"0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb","via":[{"address":"0x44Ec40D86b4643Bd5110ED07BE188F8473Ad2d3a","delay":0},{"address":"0xe8606A55d105EF857F187C32Ae0E9a168aF8F497","delay":0}]}
      issuedPermissions.0.target:
-        "0xa9d1C9D877F235C21d803e4a0b81F8ca6C4c83AC"
+        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
    }
```

```diff
    contract SequencerInbox (0xD80a805c86C14c879420eC6acb366D04D318fC0C) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      issuedPermissions.2:
-        {"permission":"upgrade","target":"0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb","via":[{"address":"0x44Ec40D86b4643Bd5110ED07BE188F8473Ad2d3a","delay":0},{"address":"0xe8606A55d105EF857F187C32Ae0E9a168aF8F497","delay":0}]}
      issuedPermissions.1.target:
-        "0xa9d1C9D877F235C21d803e4a0b81F8ca6C4c83AC"
+        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
    }
```

```diff
    contract ERC20Inbox (0xEa83E8907C89Bc0D9517632f0ba081972E328631) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      issuedPermissions.1:
-        {"permission":"upgrade","target":"0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb","via":[{"address":"0x44Ec40D86b4643Bd5110ED07BE188F8473Ad2d3a","delay":0},{"address":"0xe8606A55d105EF857F187C32Ae0E9a168aF8F497","delay":0}]}
      issuedPermissions.0.target:
-        "0xa9d1C9D877F235C21d803e4a0b81F8ca6C4c83AC"
+        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
    }
```

Generated with discovered.json: 0xe2b7ebca757717a1a23ddc8e17f38f8d1756dc28

# Diff at Thu, 05 Dec 2024 11:52:28 GMT:

- chain: ethereum
- author: Piotr Szlachciak (<szlachciak.piotr@gmail.com>)
- comparing to: main@f9ded76f7930b0c86788e4c4595d553b165b87d1 block: 21285828
- current block number: 21285828

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21285828 (main branch discovery), not current.

```diff
    contract ValidatorUtils (0x2b0E04Dc90e3fA58165CB41E2834B44A56E766aF) {
    +++ description: This contract implements view only utilities for validators.
      template:
+        "orbitstack/ValidatorUtils"
      description:
+        "This contract implements view only utilities for validators."
    }
```

Generated with discovered.json: 0x2e295f7f85843b48f56f2a551b9fc4112671c250

# Diff at Fri, 29 Nov 2024 11:28:45 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@9776abb8b1f960f6f1ec6ec27558b5eff7eb5b87 block: 21285828
- current block number: 21285828

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21285828 (main branch discovery), not current.

```diff
    contract RollupProxy (0x36c6C69A6186D4475fc5c21181CD980Bd6E5e11F) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      issuedPermissions.2.permission:
-        "configure"
+        "fastconfirm"
      issuedPermissions.2.target:
-        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
+        "0x9C56265ef2989138d264b30fBbA2043902daBdf8"
      issuedPermissions.2.via.0.address:
-        "0x44Ec40D86b4643Bd5110ED07BE188F8473Ad2d3a"
+        "0xddb901e4E9A2e659aa1d6476d5D7A2833E7c3dFa"
      issuedPermissions.2.via.0.description:
-        "can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
+        "Can finalize a state root before the challenge period has passed. This allows withdrawing from the bridge based on the state root."
      issuedPermissions.1.target:
-        "0xa9d1C9D877F235C21d803e4a0b81F8ca6C4c83AC"
+        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
      issuedPermissions.1.via.0.description:
-        "can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
+        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
      issuedPermissions.0.target:
-        "0x9C56265ef2989138d264b30fBbA2043902daBdf8"
+        "0xa9d1C9D877F235C21d803e4a0b81F8ca6C4c83AC"
      issuedPermissions.0.via.0.address:
-        "0xddb901e4E9A2e659aa1d6476d5D7A2833E7c3dFa"
+        "0x44Ec40D86b4643Bd5110ED07BE188F8473Ad2d3a"
      issuedPermissions.0.via.0.description:
-        "a fast-confirmer can finalize a state root before the challenge period has passed. This allows withdrawing from the bridge based on the state root."
+        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
    }
```

```diff
    contract UpgradeExecutor (0x44Ec40D86b4643Bd5110ED07BE188F8473Ad2d3a) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      directlyReceivedPermissions.1.description:
-        "can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
+        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
    }
```

```diff
    contract GelatoMultisig (0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb) {
    +++ description: None
      receivedPermissions.0.description:
-        "can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
+        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
    }
```

```diff
    contract SxNetworkMultisig (0xddb901e4E9A2e659aa1d6476d5D7A2833E7c3dFa) {
    +++ description: None
      directlyReceivedPermissions.0.permission:
-        "configure"
+        "fastconfirm"
      directlyReceivedPermissions.0.description:
-        "a fast-confirmer can finalize a state root before the challenge period has passed. This allows withdrawing from the bridge based on the state root."
+        "Can finalize a state root before the challenge period has passed. This allows withdrawing from the bridge based on the state root."
    }
```

Generated with discovered.json: 0x703740ff4ec8c9831d352549191d6cad308a2b77

# Diff at Fri, 29 Nov 2024 09:31:35 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@c60f4ba86fcd7b86d6876d1634b83081095f33d7 block: 21285828
- current block number: 21285828

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21285828 (main branch discovery), not current.

```diff
    contract RollupProxy (0x36c6C69A6186D4475fc5c21181CD980Bd6E5e11F) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      issuedPermissions.6:
+        {"permission":"validate","target":"0x9C56265ef2989138d264b30fBbA2043902daBdf8","via":[{"address":"0xddb901e4E9A2e659aa1d6476d5D7A2833E7c3dFa","delay":0,"description":"Can propose new state roots (called nodes) and challenge state roots on the host chain."}]}
      issuedPermissions.5:
+        {"permission":"validate","target":"0x9C56265ef2989138d264b30fBbA2043902daBdf8","via":[]}
      issuedPermissions.4.permission:
-        "validate"
+        "upgrade"
      issuedPermissions.4.target:
-        "0x9C56265ef2989138d264b30fBbA2043902daBdf8"
+        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
      issuedPermissions.4.via.0.address:
-        "0xddb901e4E9A2e659aa1d6476d5D7A2833E7c3dFa"
+        "0x44Ec40D86b4643Bd5110ED07BE188F8473Ad2d3a"
      issuedPermissions.4.via.0.description:
-        "Can propose new state roots (called nodes) and challenge state roots on the host chain."
      issuedPermissions.3.permission:
-        "validate"
+        "upgrade"
      issuedPermissions.3.target:
-        "0x9C56265ef2989138d264b30fBbA2043902daBdf8"
+        "0xa9d1C9D877F235C21d803e4a0b81F8ca6C4c83AC"
      issuedPermissions.3.via.0:
+        {"address":"0x44Ec40D86b4643Bd5110ED07BE188F8473Ad2d3a","delay":0}
      issuedPermissions.2.permission:
-        "upgrade"
+        "configure"
      issuedPermissions.2.via.0.description:
+        "can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
      issuedPermissions.1.permission:
-        "upgrade"
+        "configure"
      issuedPermissions.1.via.0.description:
+        "can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
    }
```

```diff
    contract UpgradeExecutor (0x44Ec40D86b4643Bd5110ED07BE188F8473Ad2d3a) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      directlyReceivedPermissions.2:
+        {"permission":"upgrade","target":"0x36c6C69A6186D4475fc5c21181CD980Bd6E5e11F"}
      directlyReceivedPermissions.1.permission:
-        "upgrade"
+        "configure"
      directlyReceivedPermissions.1.description:
+        "can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
    }
```

```diff
    contract GelatoMultisig (0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb) {
    +++ description: None
      receivedPermissions.8:
+        {"permission":"upgrade","target":"0xEa83E8907C89Bc0D9517632f0ba081972E328631","via":[{"address":"0xe8606A55d105EF857F187C32Ae0E9a168aF8F497"},{"address":"0x44Ec40D86b4643Bd5110ED07BE188F8473Ad2d3a"}]}
      receivedPermissions.7.target:
-        "0xEa83E8907C89Bc0D9517632f0ba081972E328631"
+        "0xD80a805c86C14c879420eC6acb366D04D318fC0C"
      receivedPermissions.6.target:
-        "0xD80a805c86C14c879420eC6acb366D04D318fC0C"
+        "0xB360b2f57c645E847148d7C479b7468AbF6F707d"
      receivedPermissions.5.target:
-        "0xB360b2f57c645E847148d7C479b7468AbF6F707d"
+        "0xa104C0426e95a5538e89131DbB4163d230C35f86"
      receivedPermissions.4.target:
-        "0xa104C0426e95a5538e89131DbB4163d230C35f86"
+        "0x9f1045201f8b9D0b12f6d1e40e8B8e6c047A81E3"
      receivedPermissions.3.target:
-        "0x9f1045201f8b9D0b12f6d1e40e8B8e6c047A81E3"
+        "0x73cfa0F6ae141212115657ad91Ad918E5d34d882"
      receivedPermissions.2.target:
-        "0x73cfa0F6ae141212115657ad91Ad918E5d34d882"
+        "0x44Ec40D86b4643Bd5110ED07BE188F8473Ad2d3a"
      receivedPermissions.1.target:
-        "0x44Ec40D86b4643Bd5110ED07BE188F8473Ad2d3a"
+        "0x36c6C69A6186D4475fc5c21181CD980Bd6E5e11F"
      receivedPermissions.1.via.1:
-        {"address":"0x44Ec40D86b4643Bd5110ED07BE188F8473Ad2d3a"}
      receivedPermissions.1.via.0.address:
-        "0xe8606A55d105EF857F187C32Ae0E9a168aF8F497"
+        "0x44Ec40D86b4643Bd5110ED07BE188F8473Ad2d3a"
      receivedPermissions.0.permission:
-        "upgrade"
+        "configure"
      receivedPermissions.0.description:
+        "can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
    }
```

Generated with discovered.json: 0x42d3d8561e2718f548fe7bbfcb5422a4166fde9b

# Diff at Thu, 28 Nov 2024 11:13:45 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@4e0645053ebfcfcef2e7fd8c8410bad53373a3c4 block: 21071398
- current block number: 21285828

## Description

Gelato MS added as second executor.

## Watched changes

```diff
    contract RollupProxy (0x36c6C69A6186D4475fc5c21181CD980Bd6E5e11F) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      issuedPermissions.4:
+        {"permission":"validate","target":"0x9C56265ef2989138d264b30fBbA2043902daBdf8","via":[{"address":"0xddb901e4E9A2e659aa1d6476d5D7A2833E7c3dFa","delay":0,"description":"Can propose new state roots (called nodes) and challenge state roots on the host chain."}]}
      issuedPermissions.3.via.0:
-        {"address":"0xddb901e4E9A2e659aa1d6476d5D7A2833E7c3dFa","delay":0,"description":"Can propose new state roots (called nodes) and challenge state roots on the host chain."}
      issuedPermissions.2.permission:
-        "validate"
+        "upgrade"
      issuedPermissions.2.target:
-        "0x9C56265ef2989138d264b30fBbA2043902daBdf8"
+        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
      issuedPermissions.2.via.0:
+        {"address":"0x44Ec40D86b4643Bd5110ED07BE188F8473Ad2d3a","delay":0}
    }
```

```diff
    contract UpgradeExecutor (0x44Ec40D86b4643Bd5110ED07BE188F8473Ad2d3a) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      issuedPermissions.1:
+        {"permission":"upgrade","target":"0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb","via":[{"address":"0x44Ec40D86b4643Bd5110ED07BE188F8473Ad2d3a","delay":0},{"address":"0xe8606A55d105EF857F187C32Ae0E9a168aF8F497","delay":0}]}
      values.accessControl.EXECUTOR_ROLE.members.1:
+        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
      values.executors.1:
+        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
    }
```

```diff
    contract ChallengeManager (0x73cfa0F6ae141212115657ad91Ad918E5d34d882) {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      issuedPermissions.1:
+        {"permission":"upgrade","target":"0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb","via":[{"address":"0x44Ec40D86b4643Bd5110ED07BE188F8473Ad2d3a","delay":0},{"address":"0xe8606A55d105EF857F187C32Ae0E9a168aF8F497","delay":0}]}
    }
```

```diff
    contract ERC20RollupEventInbox (0x9f1045201f8b9D0b12f6d1e40e8B8e6c047A81E3) {
    +++ description: Helper contract sending configuration data over the bridge during the systems initialization.
      issuedPermissions.1:
+        {"permission":"upgrade","target":"0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb","via":[{"address":"0x44Ec40D86b4643Bd5110ED07BE188F8473Ad2d3a","delay":0},{"address":"0xe8606A55d105EF857F187C32Ae0E9a168aF8F497","delay":0}]}
    }
```

```diff
    contract ERC20Bridge (0xa104C0426e95a5538e89131DbB4163d230C35f86) {
    +++ description: Escrow contract for the project's gas token (Can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      issuedPermissions.1:
+        {"permission":"upgrade","target":"0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb","via":[{"address":"0x44Ec40D86b4643Bd5110ED07BE188F8473Ad2d3a","delay":0},{"address":"0xe8606A55d105EF857F187C32Ae0E9a168aF8F497","delay":0}]}
    }
```

```diff
    contract ERC20Outbox (0xB360b2f57c645E847148d7C479b7468AbF6F707d) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
      issuedPermissions.1:
+        {"permission":"upgrade","target":"0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb","via":[{"address":"0x44Ec40D86b4643Bd5110ED07BE188F8473Ad2d3a","delay":0},{"address":"0xe8606A55d105EF857F187C32Ae0E9a168aF8F497","delay":0}]}
    }
```

```diff
    contract SequencerInbox (0xD80a805c86C14c879420eC6acb366D04D318fC0C) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      issuedPermissions.2:
+        {"permission":"upgrade","target":"0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb","via":[{"address":"0x44Ec40D86b4643Bd5110ED07BE188F8473Ad2d3a","delay":0},{"address":"0xe8606A55d105EF857F187C32Ae0E9a168aF8F497","delay":0}]}
    }
```

```diff
    contract ERC20Inbox (0xEa83E8907C89Bc0D9517632f0ba081972E328631) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      issuedPermissions.1:
+        {"permission":"upgrade","target":"0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb","via":[{"address":"0x44Ec40D86b4643Bd5110ED07BE188F8473Ad2d3a","delay":0},{"address":"0xe8606A55d105EF857F187C32Ae0E9a168aF8F497","delay":0}]}
    }
```

```diff
+   Status: CREATED
    contract GelatoMultisig (0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb)
    +++ description: None
```

## Source code changes

```diff
.../ethereum/.flat/GelatoMultisig/GnosisSafe.sol   | 953 +++++++++++++++++++++
 .../.flat/GelatoMultisig/GnosisSafeProxy.p.sol     |  35 +
 2 files changed, 988 insertions(+)
```

Generated with discovered.json: 0xb19d48e9748bf310d43bde9e258e9d93466fadce

# Diff at Fri, 15 Nov 2024 08:18:14 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@a00c2a67d12a174a45864b549412045028598606 block: 21071398
- current block number: 21071398

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21071398 (main branch discovery), not current.

```diff
    contract RollupProxy (0x36c6C69A6186D4475fc5c21181CD980Bd6E5e11F) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      issuedPermissions.5:
-        {"permission":"upgrade","target":"0xa9d1C9D877F235C21d803e4a0b81F8ca6C4c83AC","via":[{"address":"0x44Ec40D86b4643Bd5110ED07BE188F8473Ad2d3a","delay":0}]}
      issuedPermissions.4:
-        {"permission":"propose","target":"0x9C56265ef2989138d264b30fBbA2043902daBdf8","via":[{"address":"0xddb901e4E9A2e659aa1d6476d5D7A2833E7c3dFa","delay":0,"description":"can submit state roots to the RollupProxy contract on the host chain."}]}
      issuedPermissions.3.permission:
-        "propose"
+        "validate"
      issuedPermissions.3.via.0:
+        {"address":"0xddb901e4E9A2e659aa1d6476d5D7A2833E7c3dFa","delay":0,"description":"Can propose new state roots (called nodes) and challenge state roots on the host chain."}
      issuedPermissions.2.permission:
-        "configure"
+        "validate"
      issuedPermissions.2.via.0:
-        {"address":"0xddb901e4E9A2e659aa1d6476d5D7A2833E7c3dFa","delay":0,"description":"a fast-confirmer can finalize a state root before the challenge period has passed. This allows withdrawing from the bridge based on the state root."}
      issuedPermissions.1.permission:
-        "challenge"
+        "upgrade"
      issuedPermissions.1.target:
-        "0x9C56265ef2989138d264b30fBbA2043902daBdf8"
+        "0xa9d1C9D877F235C21d803e4a0b81F8ca6C4c83AC"
      issuedPermissions.1.via.0.address:
-        "0xddb901e4E9A2e659aa1d6476d5D7A2833E7c3dFa"
+        "0x44Ec40D86b4643Bd5110ED07BE188F8473Ad2d3a"
      issuedPermissions.1.via.0.description:
-        "can challenge state roots on the host chain."
      issuedPermissions.0.permission:
-        "challenge"
+        "configure"
      issuedPermissions.0.via.0:
+        {"address":"0xddb901e4E9A2e659aa1d6476d5D7A2833E7c3dFa","delay":0,"description":"a fast-confirmer can finalize a state root before the challenge period has passed. This allows withdrawing from the bridge based on the state root."}
    }
```

```diff
    contract UpgradeExecutor (0x44Ec40D86b4643Bd5110ED07BE188F8473Ad2d3a) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      description:
-        "Central contract defining the access control for upgrading the system contract implementations."
+        "Central contract defining the access control permissions for upgrading the system contract implementations."
    }
```

```diff
    contract ERC20RollupEventInbox (0x9f1045201f8b9D0b12f6d1e40e8B8e6c047A81E3) {
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
    contract SequencerInbox (0xD80a805c86C14c879420eC6acb366D04D318fC0C) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      fieldMeta.maxTimeVariation.description:
-        "Settable by the Rollup Owner. Transactions can only be force-included after `delayBlocks` window (Sequencer-only) has passed."
+        "Settable by the Rollup Owner. Transactions can only be force-included after the `delayBlocks` window (Sequencer-only) has passed."
    }
```

```diff
    contract SxNetworkMultisig (0xddb901e4E9A2e659aa1d6476d5D7A2833E7c3dFa) {
    +++ description: None
      directlyReceivedPermissions.2:
-        {"permission":"propose","target":"0x36c6C69A6186D4475fc5c21181CD980Bd6E5e11F","description":"can submit state roots to the RollupProxy contract on the host chain."}
      directlyReceivedPermissions.1.permission:
-        "configure"
+        "validate"
      directlyReceivedPermissions.1.description:
-        "a fast-confirmer can finalize a state root before the challenge period has passed. This allows withdrawing from the bridge based on the state root."
+        "Can propose new state roots (called nodes) and challenge state roots on the host chain."
      directlyReceivedPermissions.0.permission:
-        "challenge"
+        "configure"
      directlyReceivedPermissions.0.description:
-        "can challenge state roots on the host chain."
+        "a fast-confirmer can finalize a state root before the challenge period has passed. This allows withdrawing from the bridge based on the state root."
    }
```

Generated with discovered.json: 0x7ecc1402f643d6f6f3aa391195d3d8e2b8f765ce

# Diff at Thu, 07 Nov 2024 11:04:26 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@e983273bf2ca9304e4b729faaddf20acae0f6c19 block: 21071398
- current block number: 21071398

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21071398 (main branch discovery), not current.

```diff
    contract RollupProxy (0x36c6C69A6186D4475fc5c21181CD980Bd6E5e11F) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      issuedPermissions.2.via.0.description:
-        "can finalize a state root before the challenge period has passed. This allows withdrawing from the bridge based on the state root."
+        "a fast-confirmer can finalize a state root before the challenge period has passed. This allows withdrawing from the bridge based on the state root."
    }
```

```diff
    contract SxNetworkMultisig (0xddb901e4E9A2e659aa1d6476d5D7A2833E7c3dFa) {
    +++ description: None
      directlyReceivedPermissions.1.description:
-        "can finalize a state root before the challenge period has passed. This allows withdrawing from the bridge based on the state root."
+        "a fast-confirmer can finalize a state root before the challenge period has passed. This allows withdrawing from the bridge based on the state root."
    }
```

Generated with discovered.json: 0xe82817411d789158534a335af8408a0526897240

# Diff at Mon, 04 Nov 2024 08:00:14 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@950c85bf556f084c302d2b03100375cf3c7ed376 block: 21071398
- current block number: 21071398

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21071398 (main branch discovery), not current.

```diff
    contract SequencerInbox (0xD80a805c86C14c879420eC6acb366D04D318fC0C) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
+++ description: Settable by the Rollup Owner. Transactions can only be force-included after `delayBlocks` window (Sequencer-only) has passed.
      values.maxTimeVariation:
-        [28800,300,345600,3600]
+        {"delayBlocks":28800,"futureBlocks":300,"delaySeconds":345600,"futureSeconds":3600}
      values.postsBlobs:
+        false
      fieldMeta.maxTimeVariation.description:
-        "Struct: delayBlocks, futureBlocks, delaySeconds, futureSeconds. onlyRollupOwner settable. Transactions can only be force-included after `delayBlocks` window (Sequencer-only) has passed."
+        "Settable by the Rollup Owner. Transactions can only be force-included after `delayBlocks` window (Sequencer-only) has passed."
    }
```

Generated with discovered.json: 0xb434601957c662578dde869693af62130fa7b52f

# Diff at Tue, 29 Oct 2024 12:50:21 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@7b3fc9dc9074e1d423b48522c3f0273c86aab54a block: 21041868
- current block number: 21071398

## Description

Upgrade to ArbOS 32, introduce fastWithdrawer (1/1 MS with 15min minimum delta between state roots).

This project now uses discoveryDriven data.

## Watched changes

```diff
-   Status: DELETED
    contract OneStepProverHostIo (0x17e7F68ce50A77e55C7834ddF31AEf86403B8010)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
    contract RollupProxy (0x36c6C69A6186D4475fc5c21181CD980Bd6E5e11F) {
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
      issuedPermissions.5:
+        {"permission":"upgrade","target":"0xa9d1C9D877F235C21d803e4a0b81F8ca6C4c83AC","via":[{"address":"0x44Ec40D86b4643Bd5110ED07BE188F8473Ad2d3a","delay":0}]}
      issuedPermissions.4:
+        {"permission":"propose","target":"0x9C56265ef2989138d264b30fBbA2043902daBdf8","via":[{"address":"0xddb901e4E9A2e659aa1d6476d5D7A2833E7c3dFa","delay":0,"description":"can submit state roots to the RollupProxy contract on the host chain."}]}
      issuedPermissions.3:
+        {"permission":"propose","target":"0x9C56265ef2989138d264b30fBbA2043902daBdf8","via":[]}
      issuedPermissions.2.permission:
-        "upgrade"
+        "configure"
      issuedPermissions.2.target:
-        "0xa9d1C9D877F235C21d803e4a0b81F8ca6C4c83AC"
+        "0x9C56265ef2989138d264b30fBbA2043902daBdf8"
      issuedPermissions.2.via.0.address:
-        "0x44Ec40D86b4643Bd5110ED07BE188F8473Ad2d3a"
+        "0xddb901e4E9A2e659aa1d6476d5D7A2833E7c3dFa"
      issuedPermissions.2.via.0.description:
+        "can finalize a state root before the challenge period has passed. This allows withdrawing from the bridge based on the state root."
      issuedPermissions.1.permission:
-        "propose"
+        "challenge"
      issuedPermissions.1.via.0:
+        {"address":"0xddb901e4E9A2e659aa1d6476d5D7A2833E7c3dFa","delay":0,"description":"can challenge state roots on the host chain."}
      values.$implementation.1:
-        "0x660ea1675F7323dC3Ba0c8dDFB593225Eb01E3C1"
+        "0x5607Ea4b5F6e3F610bD346B36D3143FFf46d1C34"
      values.$implementation.0:
-        "0x0aE4dD666748bF0F6dB5c149Eab1D8aD27820A6A"
+        "0x9B56A789fEDD5df27dBaB53b085F7157397cA17D"
      values.$pastUpgrades.1:
+        ["2024-10-29T07:32:23.000Z","0xaf5a9eeab9e5f6edb2409f9b41142e49d97ce9ca9d8785e8dbff7cc2835699c0",["0x9B56A789fEDD5df27dBaB53b085F7157397cA17D","0x5607Ea4b5F6e3F610bD346B36D3143FFf46d1C34"]]
      values.$upgradeCount:
-        1
+        2
+++ description: ArbOS version derived from known wasmModuleRoots.
      values.arbOsFromWmRoot:
-        "ArbOS v20 wasmModuleRoot"
+        "ArbOS v32 wasmModuleRoot"
+++ description: Increments on each Validator change.
      values.setValidatorCount:
-        1
+        2
      values.validators.1:
+        "0xddb901e4E9A2e659aa1d6476d5D7A2833E7c3dFa"
+++ description: Root hash of the WASM module used for execution, like a fingerprint of the L2 logic. Can be associated with ArbOS versions.
      values.wasmModuleRoot:
-        "0x8b104a2e80ac6165dc58b9048de12f301d70b02a0ab51396c22b4b4b802a16a4"
+        "0x184884e1eb9fefdc158f6c8ac912bb183bf3cf83f0090317e0bc4ac5860baa39"
      values.anyTrustFastConfirmer:
+        "0xddb901e4E9A2e659aa1d6476d5D7A2833E7c3dFa"
      fieldMeta.minimumAssertionPeriod:
+        {"description":"Minimum time delta between newly created nodes (stateUpdates). This is checked on `stakeOnNewNode()`. Format is number of ETHEREUM blocks, even for L3s. "}
    }
```

```diff
-   Status: DELETED
    contract OneStepProofEntry (0x57EA090Ac0554d174AE0e2855B460e84A1A7C221)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
-   Status: DELETED
    contract OneStepProver0 (0x72B166070781a552D7b95a907eF59ca05d3D5a62)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
    contract ChallengeManager (0x73cfa0F6ae141212115657ad91Ad918E5d34d882) {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      sourceHashes.1:
-        "0x58a6261c83c2766f749641902ad6fdb695ea189d2747f073b57a8f35b9a547e5"
+        "0x1a095768302d7d1c3d02375eaa3341833b4f1aaac707e1c608bce478c87cbf27"
      values.$implementation:
-        "0x1D901DD7A5eFE421C3C437B147040E5AF22E6A43"
+        "0x02E05A9245C5853f895daDcc3A8216C953C8736B"
      values.$pastUpgrades.1:
+        ["2024-10-29T07:32:23.000Z","0xaf5a9eeab9e5f6edb2409f9b41142e49d97ce9ca9d8785e8dbff7cc2835699c0",["0x02E05A9245C5853f895daDcc3A8216C953C8736B"]]
      values.$upgradeCount:
-        1
+        2
      values.osp:
-        "0x57EA090Ac0554d174AE0e2855B460e84A1A7C221"
+        "0x8Faa21891B0b928afEbd5314D1D313f8f7B34DaC"
    }
```

```diff
-   Status: DELETED
    contract OneStepProverMemory (0x8b73Ef238ADaB31EBC7c05423d243c345241a22f)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
-   Status: DELETED
    contract OneStepProverMath (0x90eC62De2EB7C7512a22bD2D55926AD6bA609F38)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract OneStepProverHostIo (0x0003A96B27ce73505b43ea1b71a5aB06bec568C4)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract OneStepProverMemory (0x1cD76B9C33b2e3b04D7B181399d492B3e49AD7fB)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract OneStepProver0 (0x2dCCAbE89cF76132619a9B18e9F9e48E837222b5)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract OneStepProofEntry (0x8Faa21891B0b928afEbd5314D1D313f8f7B34DaC)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract OneStepProverMath (0xCf4b98cFF2976E4eb579B9498f398b5bd279A6eD)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract SxNetworkMultisig (0xddb901e4E9A2e659aa1d6476d5D7A2833E7c3dFa)
    +++ description: None
```

## Source code changes

```diff
.../ChallengeManager/ChallengeManager.sol          | 404 ++++++---
 .../OneStepProofEntry.sol                          | 485 +++++++++--
 .../{.flat@21041868 => .flat}/OneStepProver0.sol   | 765 ++++++++++++-----
 .../OneStepProverHostIo.sol                        | 892 +++++++++++++++----
 .../OneStepProverMath.sol                          |  65 +-
 .../OneStepProverMemory.sol                        | 315 +++++--
 .../RollupProxy/RollupAdminLogic.1.sol             | 370 +++++---
 .../RollupProxy/RollupUserLogic.2.sol              | 415 ++++++---
 .../.flat/SxNetworkMultisig/GnosisSafe.sol         | 953 +++++++++++++++++++++
 .../.flat/SxNetworkMultisig/GnosisSafeProxy.p.sol  |  35 +
 10 files changed, 3754 insertions(+), 945 deletions(-)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21041868 (main branch discovery), not current.

```diff
    contract ValidatorUtils (0x2b0E04Dc90e3fA58165CB41E2834B44A56E766aF) {
    +++ description: None
      values.SXNETWORK_STAKERS:
-        [["0x9C56265ef2989138d264b30fBbA2043902daBdf8"],false]
    }
```

```diff
    contract RollupProxy (0x36c6C69A6186D4475fc5c21181CD980Bd6E5e11F) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      fieldMeta.confirmPeriodBlocks.description:
-        "Challenge period. (Number of blocks until a node is confirmed)."
+        "Challenge period. (Number of ETHEREUM blocks until a node is confirmed, even for L3s)."
    }
```

```diff
    contract ERC20Bridge (0xa104C0426e95a5538e89131DbB4163d230C35f86) {
    +++ description: Escrow contract for the project's gas token (Can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      name:
-        "Bridge"
+        "ERC20Bridge"
      description:
-        "Escrow contract for the project's gas token (Can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for bridge messaging."
+        "Escrow contract for the project's gas token (Can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging."
      displayName:
+        "Bridge"
    }
```

```diff
    contract ERC20Outbox (0xB360b2f57c645E847148d7C479b7468AbF6F707d) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
      name:
-        "Outbox"
+        "ERC20Outbox"
      description:
-        "Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) which eventually resolve in execution on L1."
+        "Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1."
      displayName:
+        "Outbox"
    }
```

```diff
    contract SequencerInbox (0xD80a805c86C14c879420eC6acb366D04D318fC0C) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      values.IS_HARDCODED_SEQUENCER_BATCH_POSTER:
-        false
    }
```

```diff
    contract ERC20Inbox (0xEa83E8907C89Bc0D9517632f0ba081972E328631) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      name:
-        "Inbox"
+        "ERC20Inbox"
      displayName:
+        "Inbox"
    }
```

Generated with discovered.json: 0x1bfde343afae343868b2517af2ecaf4dd76d58c9

# Diff at Tue, 29 Oct 2024 08:06:32 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@dd2750779d294ea31d352eac7a7f2e0e655f6440 block: 21041868
- current block number: 21041868

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21041868 (main branch discovery), not current.

```diff
    contract RollupProxy (0x36c6C69A6186D4475fc5c21181CD980Bd6E5e11F) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      issuedPermissions.2.target:
-        "0x44Ec40D86b4643Bd5110ED07BE188F8473Ad2d3a"
+        "0xa9d1C9D877F235C21d803e4a0b81F8ca6C4c83AC"
      issuedPermissions.2.via.0:
+        {"address":"0x44Ec40D86b4643Bd5110ED07BE188F8473Ad2d3a","delay":0}
    }
```

```diff
    contract UpgradeExecutor (0x44Ec40D86b4643Bd5110ED07BE188F8473Ad2d3a) {
    +++ description: Central contract defining the access control for upgrading the system contract implementations.
      issuedPermissions.0.target:
-        "0x44Ec40D86b4643Bd5110ED07BE188F8473Ad2d3a"
+        "0xa9d1C9D877F235C21d803e4a0b81F8ca6C4c83AC"
      issuedPermissions.0.via.1:
+        {"address":"0xe8606A55d105EF857F187C32Ae0E9a168aF8F497","delay":0}
      issuedPermissions.0.via.0.address:
-        "0xe8606A55d105EF857F187C32Ae0E9a168aF8F497"
+        "0x44Ec40D86b4643Bd5110ED07BE188F8473Ad2d3a"
      receivedPermissions:
-        [{"permission":"upgrade","target":"0x36c6C69A6186D4475fc5c21181CD980Bd6E5e11F"},{"permission":"upgrade","target":"0x44Ec40D86b4643Bd5110ED07BE188F8473Ad2d3a","via":[{"address":"0xe8606A55d105EF857F187C32Ae0E9a168aF8F497"}]},{"permission":"upgrade","target":"0x73cfa0F6ae141212115657ad91Ad918E5d34d882","via":[{"address":"0xe8606A55d105EF857F187C32Ae0E9a168aF8F497"}]},{"permission":"upgrade","target":"0x9f1045201f8b9D0b12f6d1e40e8B8e6c047A81E3","via":[{"address":"0xe8606A55d105EF857F187C32Ae0E9a168aF8F497"}]},{"permission":"upgrade","target":"0xa104C0426e95a5538e89131DbB4163d230C35f86","via":[{"address":"0xe8606A55d105EF857F187C32Ae0E9a168aF8F497"}]},{"permission":"upgrade","target":"0xB360b2f57c645E847148d7C479b7468AbF6F707d","via":[{"address":"0xe8606A55d105EF857F187C32Ae0E9a168aF8F497"}]},{"permission":"upgrade","target":"0xD80a805c86C14c879420eC6acb366D04D318fC0C","via":[{"address":"0xe8606A55d105EF857F187C32Ae0E9a168aF8F497"}]},{"permission":"upgrade","target":"0xEa83E8907C89Bc0D9517632f0ba081972E328631","via":[{"address":"0xe8606A55d105EF857F187C32Ae0E9a168aF8F497"}]}]
      directlyReceivedPermissions.1:
+        {"permission":"upgrade","target":"0x36c6C69A6186D4475fc5c21181CD980Bd6E5e11F"}
    }
```

```diff
    contract ChallengeManager (0x73cfa0F6ae141212115657ad91Ad918E5d34d882) {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      issuedPermissions.0.target:
-        "0x44Ec40D86b4643Bd5110ED07BE188F8473Ad2d3a"
+        "0xa9d1C9D877F235C21d803e4a0b81F8ca6C4c83AC"
      issuedPermissions.0.via.1:
+        {"address":"0xe8606A55d105EF857F187C32Ae0E9a168aF8F497","delay":0}
      issuedPermissions.0.via.0.address:
-        "0xe8606A55d105EF857F187C32Ae0E9a168aF8F497"
+        "0x44Ec40D86b4643Bd5110ED07BE188F8473Ad2d3a"
    }
```

```diff
    contract ERC20RollupEventInbox (0x9f1045201f8b9D0b12f6d1e40e8B8e6c047A81E3) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x44Ec40D86b4643Bd5110ED07BE188F8473Ad2d3a"
+        "0xa9d1C9D877F235C21d803e4a0b81F8ca6C4c83AC"
      issuedPermissions.0.via.1:
+        {"address":"0xe8606A55d105EF857F187C32Ae0E9a168aF8F497","delay":0}
      issuedPermissions.0.via.0.address:
-        "0xe8606A55d105EF857F187C32Ae0E9a168aF8F497"
+        "0x44Ec40D86b4643Bd5110ED07BE188F8473Ad2d3a"
    }
```

```diff
    contract Bridge (0xa104C0426e95a5538e89131DbB4163d230C35f86) {
    +++ description: Escrow contract for the project's gas token (Can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for bridge messaging.
      issuedPermissions.0.target:
-        "0x44Ec40D86b4643Bd5110ED07BE188F8473Ad2d3a"
+        "0xa9d1C9D877F235C21d803e4a0b81F8ca6C4c83AC"
      issuedPermissions.0.via.1:
+        {"address":"0xe8606A55d105EF857F187C32Ae0E9a168aF8F497","delay":0}
      issuedPermissions.0.via.0.address:
-        "0xe8606A55d105EF857F187C32Ae0E9a168aF8F497"
+        "0x44Ec40D86b4643Bd5110ED07BE188F8473Ad2d3a"
    }
```

```diff
    contract Outbox (0xB360b2f57c645E847148d7C479b7468AbF6F707d) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) which eventually resolve in execution on L1.
      issuedPermissions.0.target:
-        "0x44Ec40D86b4643Bd5110ED07BE188F8473Ad2d3a"
+        "0xa9d1C9D877F235C21d803e4a0b81F8ca6C4c83AC"
      issuedPermissions.0.via.1:
+        {"address":"0xe8606A55d105EF857F187C32Ae0E9a168aF8F497","delay":0}
      issuedPermissions.0.via.0.address:
-        "0xe8606A55d105EF857F187C32Ae0E9a168aF8F497"
+        "0x44Ec40D86b4643Bd5110ED07BE188F8473Ad2d3a"
    }
```

```diff
    contract SequencerInbox (0xD80a805c86C14c879420eC6acb366D04D318fC0C) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      issuedPermissions.1.target:
-        "0x44Ec40D86b4643Bd5110ED07BE188F8473Ad2d3a"
+        "0xa9d1C9D877F235C21d803e4a0b81F8ca6C4c83AC"
      issuedPermissions.1.via.1:
+        {"address":"0xe8606A55d105EF857F187C32Ae0E9a168aF8F497","delay":0}
      issuedPermissions.1.via.0.address:
-        "0xe8606A55d105EF857F187C32Ae0E9a168aF8F497"
+        "0x44Ec40D86b4643Bd5110ED07BE188F8473Ad2d3a"
    }
```

```diff
    contract Inbox (0xEa83E8907C89Bc0D9517632f0ba081972E328631) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      issuedPermissions.0.target:
-        "0x44Ec40D86b4643Bd5110ED07BE188F8473Ad2d3a"
+        "0xa9d1C9D877F235C21d803e4a0b81F8ca6C4c83AC"
      issuedPermissions.0.via.1:
+        {"address":"0xe8606A55d105EF857F187C32Ae0E9a168aF8F497","delay":0}
      issuedPermissions.0.via.0.address:
-        "0xe8606A55d105EF857F187C32Ae0E9a168aF8F497"
+        "0x44Ec40D86b4643Bd5110ED07BE188F8473Ad2d3a"
    }
```

Generated with discovered.json: 0xd36bca748443a75ef966969823a726580782f3a9

# Diff at Mon, 28 Oct 2024 14:06:14 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@846d03afee15838cf7b18315c02ebdb6a2071f6c block: 21041868
- current block number: 21041868

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21041868 (main branch discovery), not current.

```diff
    contract UpgradeExecutor (0x44Ec40D86b4643Bd5110ED07BE188F8473Ad2d3a) {
    +++ description: Central contract defining the access control for upgrading the system contract implementations.
      values.executors:
+        ["0xa9d1C9D877F235C21d803e4a0b81F8ca6C4c83AC"]
    }
```

Generated with discovered.json: 0x6d8c381682ed51de8b9e67596fa4fe1b99e3cb1e

# Diff at Fri, 25 Oct 2024 09:55:32 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@e7501f424c0cea9b5438386ee76e509448999836 block: 20842812
- current block number: 21041868

## Description

Config related.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20842812 (main branch discovery), not current.

```diff
    contract UpgradeExecutor (0x44Ec40D86b4643Bd5110ED07BE188F8473Ad2d3a) {
    +++ description: Central contract defining the access control for upgrading the system contract implementations.
      issuedPermissions.0.target:
-        "0xe8606A55d105EF857F187C32Ae0E9a168aF8F497"
+        "0x44Ec40D86b4643Bd5110ED07BE188F8473Ad2d3a"
      issuedPermissions.0.via.0:
+        {"address":"0xe8606A55d105EF857F187C32Ae0E9a168aF8F497","delay":0}
      receivedPermissions.7:
+        {"permission":"upgrade","target":"0xEa83E8907C89Bc0D9517632f0ba081972E328631","via":[{"address":"0xe8606A55d105EF857F187C32Ae0E9a168aF8F497"}]}
      receivedPermissions.6:
+        {"permission":"upgrade","target":"0xD80a805c86C14c879420eC6acb366D04D318fC0C","via":[{"address":"0xe8606A55d105EF857F187C32Ae0E9a168aF8F497"}]}
      receivedPermissions.5:
+        {"permission":"upgrade","target":"0xB360b2f57c645E847148d7C479b7468AbF6F707d","via":[{"address":"0xe8606A55d105EF857F187C32Ae0E9a168aF8F497"}]}
      receivedPermissions.4:
+        {"permission":"upgrade","target":"0xa104C0426e95a5538e89131DbB4163d230C35f86","via":[{"address":"0xe8606A55d105EF857F187C32Ae0E9a168aF8F497"}]}
      receivedPermissions.3:
+        {"permission":"upgrade","target":"0x9f1045201f8b9D0b12f6d1e40e8B8e6c047A81E3","via":[{"address":"0xe8606A55d105EF857F187C32Ae0E9a168aF8F497"}]}
      receivedPermissions.2:
+        {"permission":"upgrade","target":"0x73cfa0F6ae141212115657ad91Ad918E5d34d882","via":[{"address":"0xe8606A55d105EF857F187C32Ae0E9a168aF8F497"}]}
      receivedPermissions.1:
+        {"permission":"upgrade","target":"0x44Ec40D86b4643Bd5110ED07BE188F8473Ad2d3a","via":[{"address":"0xe8606A55d105EF857F187C32Ae0E9a168aF8F497"}]}
      directlyReceivedPermissions:
+        [{"permission":"act","target":"0xe8606A55d105EF857F187C32Ae0E9a168aF8F497"}]
    }
```

```diff
    contract ChallengeManager (0x73cfa0F6ae141212115657ad91Ad918E5d34d882) {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      issuedPermissions.0.target:
-        "0xe8606A55d105EF857F187C32Ae0E9a168aF8F497"
+        "0x44Ec40D86b4643Bd5110ED07BE188F8473Ad2d3a"
      issuedPermissions.0.via.0:
+        {"address":"0xe8606A55d105EF857F187C32Ae0E9a168aF8F497","delay":0}
    }
```

```diff
    contract ERC20RollupEventInbox (0x9f1045201f8b9D0b12f6d1e40e8B8e6c047A81E3) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xe8606A55d105EF857F187C32Ae0E9a168aF8F497"
+        "0x44Ec40D86b4643Bd5110ED07BE188F8473Ad2d3a"
      issuedPermissions.0.via.0:
+        {"address":"0xe8606A55d105EF857F187C32Ae0E9a168aF8F497","delay":0}
    }
```

```diff
    contract Bridge (0xa104C0426e95a5538e89131DbB4163d230C35f86) {
    +++ description: Escrow contract for the project's gas token (Can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for bridge messaging.
      issuedPermissions.0.target:
-        "0xe8606A55d105EF857F187C32Ae0E9a168aF8F497"
+        "0x44Ec40D86b4643Bd5110ED07BE188F8473Ad2d3a"
      issuedPermissions.0.via.0:
+        {"address":"0xe8606A55d105EF857F187C32Ae0E9a168aF8F497","delay":0}
    }
```

```diff
    contract Outbox (0xB360b2f57c645E847148d7C479b7468AbF6F707d) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) which eventually resolve in execution on L1.
      issuedPermissions.0.target:
-        "0xe8606A55d105EF857F187C32Ae0E9a168aF8F497"
+        "0x44Ec40D86b4643Bd5110ED07BE188F8473Ad2d3a"
      issuedPermissions.0.via.0:
+        {"address":"0xe8606A55d105EF857F187C32Ae0E9a168aF8F497","delay":0}
    }
```

```diff
    contract SequencerInbox (0xD80a805c86C14c879420eC6acb366D04D318fC0C) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      issuedPermissions.1.target:
-        "0xe8606A55d105EF857F187C32Ae0E9a168aF8F497"
+        "0x44Ec40D86b4643Bd5110ED07BE188F8473Ad2d3a"
      issuedPermissions.1.via.0:
+        {"address":"0xe8606A55d105EF857F187C32Ae0E9a168aF8F497","delay":0}
    }
```

```diff
    contract ProxyAdmin (0xe8606A55d105EF857F187C32Ae0E9a168aF8F497) {
    +++ description: None
      receivedPermissions:
-        [{"permission":"upgrade","target":"0x44Ec40D86b4643Bd5110ED07BE188F8473Ad2d3a"},{"permission":"upgrade","target":"0x73cfa0F6ae141212115657ad91Ad918E5d34d882"},{"permission":"upgrade","target":"0x9f1045201f8b9D0b12f6d1e40e8B8e6c047A81E3"},{"permission":"upgrade","target":"0xa104C0426e95a5538e89131DbB4163d230C35f86"},{"permission":"upgrade","target":"0xB360b2f57c645E847148d7C479b7468AbF6F707d"},{"permission":"upgrade","target":"0xD80a805c86C14c879420eC6acb366D04D318fC0C"},{"permission":"upgrade","target":"0xEa83E8907C89Bc0D9517632f0ba081972E328631"}]
      template:
+        "global/ProxyAdmin"
      directlyReceivedPermissions:
+        [{"permission":"upgrade","target":"0x44Ec40D86b4643Bd5110ED07BE188F8473Ad2d3a"},{"permission":"upgrade","target":"0x73cfa0F6ae141212115657ad91Ad918E5d34d882"},{"permission":"upgrade","target":"0x9f1045201f8b9D0b12f6d1e40e8B8e6c047A81E3"},{"permission":"upgrade","target":"0xa104C0426e95a5538e89131DbB4163d230C35f86"},{"permission":"upgrade","target":"0xB360b2f57c645E847148d7C479b7468AbF6F707d"},{"permission":"upgrade","target":"0xD80a805c86C14c879420eC6acb366D04D318fC0C"},{"permission":"upgrade","target":"0xEa83E8907C89Bc0D9517632f0ba081972E328631"}]
    }
```

```diff
    contract Inbox (0xEa83E8907C89Bc0D9517632f0ba081972E328631) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      issuedPermissions.0.target:
-        "0xe8606A55d105EF857F187C32Ae0E9a168aF8F497"
+        "0x44Ec40D86b4643Bd5110ED07BE188F8473Ad2d3a"
      issuedPermissions.0.via.0:
+        {"address":"0xe8606A55d105EF857F187C32Ae0E9a168aF8F497","delay":0}
    }
```

Generated with discovered.json: 0xf499ddc99a385d431ec86d3118d92130a0343fd4

# Diff at Wed, 23 Oct 2024 14:36:28 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@9cc37d16a5f0b172bb41f98d8a970963e5ca4afb block: 20842812
- current block number: 20842812

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20842812 (main branch discovery), not current.

```diff
    contract OneStepProverHostIo (0x17e7F68ce50A77e55C7834ddF31AEf86403B8010) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      template:
+        "orbitstack/OneStepProverHostIo"
      description:
+        "One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine."
    }
```

```diff
-   Status: DELETED
    contract  (0x27C7Bfd2cC11429e9b80c443b42FDBe4754F6c91)
    +++ description: None
```

```diff
    contract RollupProxy (0x36c6C69A6186D4475fc5c21181CD980Bd6E5e11F) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      description:
-        "Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs."
+        "Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators)."
      issuedPermissions.2:
+        {"permission":"upgrade","target":"0x44Ec40D86b4643Bd5110ED07BE188F8473Ad2d3a","via":[]}
      issuedPermissions.1.permission:
-        "validate"
+        "propose"
      issuedPermissions.0.permission:
-        "upgrade"
+        "challenge"
      issuedPermissions.0.target:
-        "0x44Ec40D86b4643Bd5110ED07BE188F8473Ad2d3a"
+        "0x9C56265ef2989138d264b30fBbA2043902daBdf8"
+++ description: Root hash of the WASM module used for execution, like a fingerprint of the L2 logic. Can be associated with ArbOS versions.
      values.wasmModuleRoot:
-        "ArbOS v20 wasmModuleRoot"
+        "0x8b104a2e80ac6165dc58b9048de12f301d70b02a0ab51396c22b4b4b802a16a4"
+++ description: ArbOS version derived from known wasmModuleRoots.
      values.arbOsFromWmRoot:
+        "ArbOS v20 wasmModuleRoot"
      fieldMeta.arbOsFromWmRoot:
+        {"description":"ArbOS version derived from known wasmModuleRoots."}
      fieldMeta.setValidatorCount:
+        {"description":"Increments on each Validator change."}
      fieldMeta.challenges:
+        {"description":"Emitted on createChallenge() in RollupUserLogic."}
    }
```

```diff
    contract UpgradeExecutor (0x44Ec40D86b4643Bd5110ED07BE188F8473Ad2d3a) {
    +++ description: Central contract defining the access control for upgrading the system contract implementations.
      template:
+        "orbitstack/UpgradeExecutor"
      description:
+        "Central contract defining the access control for upgrading the system contract implementations."
    }
```

```diff
    contract OneStepProofEntry (0x57EA090Ac0554d174AE0e2855B460e84A1A7C221) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      template:
+        "orbitstack/OneStepProofEntry"
      description:
+        "One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine."
    }
```

```diff
    contract OneStepProver0 (0x72B166070781a552D7b95a907eF59ca05d3D5a62) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      template:
+        "orbitstack/OneStepProver0"
      description:
+        "One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine."
    }
```

```diff
    contract ChallengeManager (0x73cfa0F6ae141212115657ad91Ad918E5d34d882) {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      template:
+        "orbitstack/ChallengeManager"
      description:
+        "Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor."
    }
```

```diff
-   Status: DELETED
    contract  (0x7Deda2425eC2d4EA0DF689A78de2fBF002075576)
    +++ description: None
```

```diff
    contract OneStepProverMemory (0x8b73Ef238ADaB31EBC7c05423d243c345241a22f) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      template:
+        "orbitstack/OneStepProverMemory"
      description:
+        "One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine."
    }
```

```diff
    contract OneStepProverMath (0x90eC62De2EB7C7512a22bD2D55926AD6bA609F38) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      template:
+        "orbitstack/OneStepProverMath"
      description:
+        "One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine."
    }
```

```diff
-   Status: DELETED
    contract ValidatorWalletCreator (0x9CAd81628aB7D8e239F1A5B497313341578c5F71)
    +++ description: None
```

```diff
    contract Bridge (0xa104C0426e95a5538e89131DbB4163d230C35f86) {
    +++ description: Escrow contract for the project's gas token (Can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for bridge messaging.
      template:
+        "orbitstack/Bridge"
      description:
+        "Escrow contract for the project's gas token (Can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for bridge messaging."
    }
```

```diff
    contract Outbox (0xB360b2f57c645E847148d7C479b7468AbF6F707d) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) which eventually resolve in execution on L1.
      template:
+        "orbitstack/Outbox"
      description:
+        "Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) which eventually resolve in execution on L1."
    }
```

```diff
-   Status: DELETED
    contract SXNetwork (0xbe9F61555F50DD6167f2772e9CF7519790d96624)
    +++ description: None
```

```diff
    contract SequencerInbox (0xD80a805c86C14c879420eC6acb366D04D318fC0C) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      template:
+        "orbitstack/SequencerInbox"
      description:
+        "A sequencer (registered in this contract) can submit transaction batches or commitments here."
      fieldMeta:
+        {"maxTimeVariation":{"description":"Struct: delayBlocks, futureBlocks, delaySeconds, futureSeconds. onlyRollupOwner settable. Transactions can only be force-included after `delayBlocks` window (Sequencer-only) has passed."}}
    }
```

```diff
    contract Inbox (0xEa83E8907C89Bc0D9517632f0ba081972E328631) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      template:
+        "orbitstack/Inbox"
      description:
+        "Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds."
    }
```

Generated with discovered.json: 0x331b211824d0c61be1643cec86b16e2640615a53

# Diff at Mon, 21 Oct 2024 12:49:20 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@e660599f23a07618fe949a07be1f516ce44f1914 block: 20842812
- current block number: 20842812

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20842812 (main branch discovery), not current.

```diff
    contract RollupProxy (0x36c6C69A6186D4475fc5c21181CD980Bd6E5e11F) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
      descriptions:
-        ["Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs."]
      description:
+        "Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs."
    }
```

Generated with discovered.json: 0xb55529676a8458eebf5392f28d643e18d00777e3

# Diff at Mon, 21 Oct 2024 11:11:07 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@8895d33866f5665c4c710f4ddaa32bfa63cc3c78 block: 20842812
- current block number: 20842812

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20842812 (main branch discovery), not current.

```diff
    contract RollupProxy (0x36c6C69A6186D4475fc5c21181CD980Bd6E5e11F) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
      values.$pastUpgrades.0.2:
+        ["0x0aE4dD666748bF0F6dB5c149Eab1D8aD27820A6A","0x660ea1675F7323dC3Ba0c8dDFB593225Eb01E3C1"]
      values.$pastUpgrades.0.1:
-        ["0x0aE4dD666748bF0F6dB5c149Eab1D8aD27820A6A","0x660ea1675F7323dC3Ba0c8dDFB593225Eb01E3C1"]
+        "0xe93b7e232ca2ff32a44ecb683683d9553409ab46eb90efa21a7bcfc111835074"
    }
```

```diff
    contract UpgradeExecutor (0x44Ec40D86b4643Bd5110ED07BE188F8473Ad2d3a) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0x6c21303F5986180B1394d2C89f3e883890E2867b"]
      values.$pastUpgrades.0.1:
-        ["0x6c21303F5986180B1394d2C89f3e883890E2867b"]
+        "0xe93b7e232ca2ff32a44ecb683683d9553409ab46eb90efa21a7bcfc111835074"
    }
```

```diff
    contract ChallengeManager (0x73cfa0F6ae141212115657ad91Ad918E5d34d882) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0x1D901DD7A5eFE421C3C437B147040E5AF22E6A43"]
      values.$pastUpgrades.0.1:
-        ["0x1D901DD7A5eFE421C3C437B147040E5AF22E6A43"]
+        "0xe93b7e232ca2ff32a44ecb683683d9553409ab46eb90efa21a7bcfc111835074"
    }
```

```diff
    contract ERC20RollupEventInbox (0x9f1045201f8b9D0b12f6d1e40e8B8e6c047A81E3) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0x302275067251F5FcdB9359Bda735fD8f7A4A54c0"]
      values.$pastUpgrades.0.1:
-        ["0x302275067251F5FcdB9359Bda735fD8f7A4A54c0"]
+        "0xe93b7e232ca2ff32a44ecb683683d9553409ab46eb90efa21a7bcfc111835074"
    }
```

```diff
    contract Bridge (0xa104C0426e95a5538e89131DbB4163d230C35f86) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0x7EfcB76D0e2E776A298aAa603d433336e5F8b6ab"]
      values.$pastUpgrades.0.1:
-        ["0x7EfcB76D0e2E776A298aAa603d433336e5F8b6ab"]
+        "0xe93b7e232ca2ff32a44ecb683683d9553409ab46eb90efa21a7bcfc111835074"
    }
```

```diff
    contract Outbox (0xB360b2f57c645E847148d7C479b7468AbF6F707d) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0x19431dc37098877486532250FB3158140717C00C"]
      values.$pastUpgrades.0.1:
-        ["0x19431dc37098877486532250FB3158140717C00C"]
+        "0xe93b7e232ca2ff32a44ecb683683d9553409ab46eb90efa21a7bcfc111835074"
    }
```

```diff
    contract SequencerInbox (0xD80a805c86C14c879420eC6acb366D04D318fC0C) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0x383f16fB2809a56fC639c1eE2c93Ad2aa7Ee130A"]
      values.$pastUpgrades.0.1:
-        ["0x383f16fB2809a56fC639c1eE2c93Ad2aa7Ee130A"]
+        "0xe93b7e232ca2ff32a44ecb683683d9553409ab46eb90efa21a7bcfc111835074"
    }
```

```diff
    contract Inbox (0xEa83E8907C89Bc0D9517632f0ba081972E328631) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0x31fAAAB44e74eB408d1FC69A14806B4b9cA09da2"]
      values.$pastUpgrades.0.1:
-        ["0x31fAAAB44e74eB408d1FC69A14806B4b9cA09da2"]
+        "0xe93b7e232ca2ff32a44ecb683683d9553409ab46eb90efa21a7bcfc111835074"
    }
```

Generated with discovered.json: 0xbb284a0db2f303ddc8d8fb9dc8f14f0b7ce7a48e

# Diff at Wed, 16 Oct 2024 11:41:05 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@a3d139b799cc0b28e5e912febb17464d4e5aef5d block: 20842812
- current block number: 20842812

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20842812 (main branch discovery), not current.

```diff
    contract RollupProxy (0x36c6C69A6186D4475fc5c21181CD980Bd6E5e11F) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
      issuedPermissions.1:
+        {"permission":"validate","target":"0x9C56265ef2989138d264b30fBbA2043902daBdf8","via":[]}
    }
```

```diff
    contract SequencerInbox (0xD80a805c86C14c879420eC6acb366D04D318fC0C) {
    +++ description: None
      issuedPermissions.1:
+        {"permission":"upgrade","target":"0xe8606A55d105EF857F187C32Ae0E9a168aF8F497","via":[]}
      issuedPermissions.0.permission:
-        "upgrade"
+        "sequence"
      issuedPermissions.0.target:
-        "0xe8606A55d105EF857F187C32Ae0E9a168aF8F497"
+        "0x90906eA9eb38B6afC104bB761F493b2a78c85024"
    }
```

Generated with discovered.json: 0xdd356c8d2587372ca4de65c4f404bb164336047d

# Diff at Mon, 14 Oct 2024 10:56:35 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1afc77ff111ceb0970e7d09efcc7b2f376b0c281 block: 20842812
- current block number: 20842812

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20842812 (main branch discovery), not current.

```diff
    contract OneStepProverHostIo (0x17e7F68ce50A77e55C7834ddF31AEf86403B8010) {
    +++ description: None
      sourceHashes:
+        ["0x5b0a5e16100b7e163dcf39dc6a9034f12a7bad7a475cdffc73054b937be0683d"]
    }
```

```diff
    contract ValidatorUtils (0x2b0E04Dc90e3fA58165CB41E2834B44A56E766aF) {
    +++ description: None
      sourceHashes:
+        ["0xd9b36ec321be937cc727b5bdb0afa0e1a0a28448ef1a202d4f181a01ce57bdc8"]
    }
```

```diff
    contract RollupProxy (0x36c6C69A6186D4475fc5c21181CD980Bd6E5e11F) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
      sourceHashes:
+        ["0xb8da0b3748daac768860783e8555198fd2d1bbdffb775b81557a7124890c7eca","0x8b48118fe606012c0dcac2ccc1821785935aec89fab8f219f47b32c482b0017e","0xef94a66bd5339efd18fb9ca1f8031482e7ef7bbe6c5a0a10fae254ab83712406"]
    }
```

```diff
    contract UpgradeExecutor (0x44Ec40D86b4643Bd5110ED07BE188F8473Ad2d3a) {
    +++ description: None
      sourceHashes:
+        ["0xa7e3f6c355703ed46fcb2156862c4f01792b87beb10a87a81ce3bd5beee79b67","0xa7ff878cfd433a428d567d3b90fe1df400a048a1af5298f22cd4cd4fc25bdecd"]
    }
```

```diff
    contract OneStepProofEntry (0x57EA090Ac0554d174AE0e2855B460e84A1A7C221) {
    +++ description: None
      sourceHashes:
+        ["0xf3479c667d20b1c17ea2573dc7fe09e4315a3e20bc09d31bc92603520cc962cc"]
    }
```

```diff
    contract OneStepProver0 (0x72B166070781a552D7b95a907eF59ca05d3D5a62) {
    +++ description: None
      sourceHashes:
+        ["0x20330713abbbcf0219ef7d1c0aa3a6ede1b421f14c9d21b25c973e54fb75f5df"]
    }
```

```diff
    contract ChallengeManager (0x73cfa0F6ae141212115657ad91Ad918E5d34d882) {
    +++ description: None
      sourceHashes:
+        ["0xa7e3f6c355703ed46fcb2156862c4f01792b87beb10a87a81ce3bd5beee79b67","0x58a6261c83c2766f749641902ad6fdb695ea189d2747f073b57a8f35b9a547e5"]
    }
```

```diff
    contract OneStepProverMemory (0x8b73Ef238ADaB31EBC7c05423d243c345241a22f) {
    +++ description: None
      sourceHashes:
+        ["0x731b4466319a83c95ce227d1a6c85aa03864f5d2bed03bda186843033a8b8d61"]
    }
```

```diff
    contract OneStepProverMath (0x90eC62De2EB7C7512a22bD2D55926AD6bA609F38) {
    +++ description: None
      sourceHashes:
+        ["0xb2555ede3dfe7d6df28bd96d12a0113b658c213c7ce4e34fa539df7497bc51a1"]
    }
```

```diff
    contract ValidatorWalletCreator (0x9CAd81628aB7D8e239F1A5B497313341578c5F71) {
    +++ description: None
      sourceHashes:
+        ["0x4ef3473c840bed3b4c6258271a494794c1545f0d0f13c6a386d1e39e6180d67c"]
    }
```

```diff
    contract ERC20RollupEventInbox (0x9f1045201f8b9D0b12f6d1e40e8B8e6c047A81E3) {
    +++ description: None
      sourceHashes:
+        ["0xa7e3f6c355703ed46fcb2156862c4f01792b87beb10a87a81ce3bd5beee79b67","0x88c3a2fa81cad2f98a156402c78de0fc804b2a1866ea4f449aa90ae92ceabc6c"]
    }
```

```diff
    contract Bridge (0xa104C0426e95a5538e89131DbB4163d230C35f86) {
    +++ description: None
      sourceHashes:
+        ["0xa7e3f6c355703ed46fcb2156862c4f01792b87beb10a87a81ce3bd5beee79b67","0x057de68a7007d55f4394ba6eafb2c802efcaf13583ff9342ea4d0ee3924d9be1"]
    }
```

```diff
    contract Outbox (0xB360b2f57c645E847148d7C479b7468AbF6F707d) {
    +++ description: None
      sourceHashes:
+        ["0xa7e3f6c355703ed46fcb2156862c4f01792b87beb10a87a81ce3bd5beee79b67","0x3073f29910dee50069a001fb20e58cca3dcc1b3c8da4b91809af2dd356ef0c8c"]
    }
```

```diff
    contract SXNetwork (0xbe9F61555F50DD6167f2772e9CF7519790d96624) {
    +++ description: None
      sourceHashes:
+        ["0xf0c4746faa53f945ab6c15c9630e1b188aa435746b6884440517abe9ee182100"]
    }
```

```diff
    contract SequencerInbox (0xD80a805c86C14c879420eC6acb366D04D318fC0C) {
    +++ description: None
      sourceHashes:
+        ["0xa7e3f6c355703ed46fcb2156862c4f01792b87beb10a87a81ce3bd5beee79b67","0x50cf57b01499408fa99da27cf0fee96ec30f0d40667d1aa090c442bc80f0636b"]
    }
```

```diff
    contract ProxyAdmin (0xe8606A55d105EF857F187C32Ae0E9a168aF8F497) {
    +++ description: None
      sourceHashes:
+        ["0xf944f88083f41ff959fefbdcd6fc3ae633692b072b8497fb14cbdd843eded490"]
    }
```

```diff
    contract Inbox (0xEa83E8907C89Bc0D9517632f0ba081972E328631) {
    +++ description: None
      sourceHashes:
+        ["0xa7e3f6c355703ed46fcb2156862c4f01792b87beb10a87a81ce3bd5beee79b67","0xcb390b491549387c8fcc09fb22fbea7adf54cc74b7247a0c738369ddd7049b92"]
    }
```

Generated with discovered.json: 0x4e40a2a60e9490930c99e5d32e36ed46599751f6

# Diff at Tue, 01 Oct 2024 11:11:08 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bd754dc73c66120164006054f8d25c5fae9cd910 block: 20842812
- current block number: 20842812

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20842812 (main branch discovery), not current.

```diff
    contract RollupProxy (0x36c6C69A6186D4475fc5c21181CD980Bd6E5e11F) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
      values.$pastUpgrades:
+        [["2024-07-05T09:57:59.000Z",["0x0aE4dD666748bF0F6dB5c149Eab1D8aD27820A6A","0x660ea1675F7323dC3Ba0c8dDFB593225Eb01E3C1"]]]
      values.$upgradeCount:
+        1
    }
```

```diff
    contract UpgradeExecutor (0x44Ec40D86b4643Bd5110ED07BE188F8473Ad2d3a) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-07-05T09:57:59.000Z",["0x6c21303F5986180B1394d2C89f3e883890E2867b"]]]
    }
```

```diff
    contract ChallengeManager (0x73cfa0F6ae141212115657ad91Ad918E5d34d882) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-07-05T09:57:59.000Z",["0x1D901DD7A5eFE421C3C437B147040E5AF22E6A43"]]]
    }
```

```diff
    contract ERC20RollupEventInbox (0x9f1045201f8b9D0b12f6d1e40e8B8e6c047A81E3) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-07-05T09:57:59.000Z",["0x302275067251F5FcdB9359Bda735fD8f7A4A54c0"]]]
    }
```

```diff
    contract Bridge (0xa104C0426e95a5538e89131DbB4163d230C35f86) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-07-05T09:57:59.000Z",["0x7EfcB76D0e2E776A298aAa603d433336e5F8b6ab"]]]
    }
```

```diff
    contract Outbox (0xB360b2f57c645E847148d7C479b7468AbF6F707d) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-07-05T09:57:59.000Z",["0x19431dc37098877486532250FB3158140717C00C"]]]
    }
```

```diff
    contract SequencerInbox (0xD80a805c86C14c879420eC6acb366D04D318fC0C) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-07-05T09:57:59.000Z",["0x383f16fB2809a56fC639c1eE2c93Ad2aa7Ee130A"]]]
    }
```

```diff
    contract Inbox (0xEa83E8907C89Bc0D9517632f0ba081972E328631) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-07-05T09:57:59.000Z",["0x31fAAAB44e74eB408d1FC69A14806B4b9cA09da2"]]]
    }
```

Generated with discovered.json: 0xc2dd6de5cfe37af33ba99f0f895d68502447c041

# Diff at Fri, 27 Sep 2024 15:20:22 GMT:

- chain: ethereum
- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@4cb14cc1bdc343d171a7988f9f91f11edbf568a8 block: 20589788
- current block number: 20842812

## Description

Config.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20589788 (main branch discovery), not current.

```diff
    contract RollupProxy (0x36c6C69A6186D4475fc5c21181CD980Bd6E5e11F) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
      usedTypes.0.arg.0x184884e1eb9fefdc158f6c8ac912bb183bf3cf83f0090317e0bc4ac5860baa39:
+        "ArbOS v32 wasmModuleRoot"
    }
```

Generated with discovered.json: 0x48937ec6a744ea1dbe0c7490459669e627dd49db

# Diff at Sun, 01 Sep 2024 08:45:57 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@bee35b6cff7c52634ae8667cbb331e18ad4ec17a block: 20589788
- current block number: 20589788

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20589788 (main branch discovery), not current.

```diff
    contract RollupProxy (0x36c6C69A6186D4475fc5c21181CD980Bd6E5e11F) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
+++ description: Root hash of the WASM module used for execution, like a fingerprint of the L2 logic. Can be associated with ArbOS versions.
      values.wasmModuleRoot:
-        "0x8b104a2e80ac6165dc58b9048de12f301d70b02a0ab51396c22b4b4b802a16a4"
+        "ArbOS v20 wasmModuleRoot"
      usedTypes:
+        [{"typeCaster":"Mapping","arg":{"0xbb9d58e9527566138b682f3a207c0976d5359837f6e330f4017434cca983ff41":"ArbOS v1-rc1 wasmModuleRoot","0x9d68e40c47e3b87a8a7e6368cc52915720a6484bb2f47ceabad7e573e3a11232":"ArbOS v2.1 wasmModuleRoot","0x53c288a0ca7100c0f2db8ab19508763a51c7fd1be125d376d940a65378acaee7":"ArbOS v3 wasmModuleRoot","0x588762be2f364be15d323df2aa60ffff60f2b14103b34823b6f7319acd1ae7a3":"ArbOS v3.1 wasmModuleRoot","0xcfba6a883c50a1b4475ab909600fa88fc9cceed9e3ff6f43dccd2d27f6bd57cf":"ArbOS v3.2 wasmModuleRoot","0xa24ccdb052d92c5847e8ea3ce722442358db4b00985a9ee737c4e601b6ed9876":"ArbOS v4 wasmModuleRoot","0x1e09e6d9e35b93f33ed22b2bc8dc10bbcf63fdde5e8a1fb8cc1bcd1a52f14bd0":"ArbOS v5 wasmModuleRoot","0x3848eff5e0356faf1fc9cafecb789584c5e7f4f8f817694d842ada96613d8bab":"ArbOS v6 wasmModuleRoot","0x53dd4b9a3d807a8cbb4d58fbfc6a0857c3846d46956848cae0a1cc7eca2bb5a8":"ArbOS v7 wasmModuleRoot","0x2b20e1490d1b06299b222f3239b0ae07e750d8f3b4dedd19f500a815c1548bbc":"ArbOS v7.1 wasmModuleRoot","0xd1842bfbe047322b3f3b3635b5fe62eb611557784d17ac1d2b1ce9c170af6544":"ArbOS v9 wasmModuleRoot","0x6b94a7fc388fd8ef3def759297828dc311761e88d8179c7ee8d3887dc554f3c3":"ArbOS v10 wasmModuleRoot","0xda4e3ad5e7feacb817c21c8d0220da7650fe9051ece68a3f0b1c5d38bbb27b21":"ArbOS v10.1 wasmModuleRoot","0x0754e09320c381566cc0449904c377a52bd34a6b9404432e80afd573b67f7b17":"ArbOS v10.2 wasmModuleRoot","0xf559b6d4fa869472dabce70fe1c15221bdda837533dfd891916836975b434dec":"ArbOS v10.3 wasmModuleRoot","0xf4389b835497a910d7ba3ebfb77aa93da985634f3c052de1290360635be40c4a":"ArbOS v11 wasmModuleRoot","0x68e4fe5023f792d4ef584796c84d710303a5e12ea02d6e37e2b5e9c4332507c4":"ArbOS v11.1 wasmModuleRoot","0x8b104a2e80ac6165dc58b9048de12f301d70b02a0ab51396c22b4b4b802a16a4":"ArbOS v20 wasmModuleRoot","0xb0de9cb89e4d944ae6023a3b62276e54804c242fd8c4c2d8e6cc4450f5fa8b1b":"ArbOS v30 wasmModuleRoot","0x260f5fa5c3176a856893642e149cf128b5a8de9f828afec8d11184415dd8dc69":"ArbOS v31 wasmModuleRoot"}}]
    }
```

Generated with discovered.json: 0xfd87c2535d6d8d51f726b9826372167a3c400116

# Diff at Fri, 30 Aug 2024 08:01:19 GMT:

- chain: ethereum
- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@6c1bd1f41fadf5f2cb1c1805b5a2c6138a3ed35a block: 20589788
- current block number: 20589788

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20589788 (main branch discovery), not current.

```diff
    contract UpgradeExecutor (0x44Ec40D86b4643Bd5110ED07BE188F8473Ad2d3a) {
    +++ description: None
      receivedPermissions.0.via:
-        []
    }
```

```diff
    contract ProxyAdmin (0xe8606A55d105EF857F187C32Ae0E9a168aF8F497) {
    +++ description: None
      receivedPermissions.6.via:
-        []
      receivedPermissions.5.via:
-        []
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

Generated with discovered.json: 0x279e6568db2d1a94f26e5b0e0c4347fd2b9b1119

# Diff at Fri, 23 Aug 2024 09:55:59 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@67597c7d6c810bc726594446890178150240711e block: 20589788
- current block number: 20589788

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20589788 (main branch discovery), not current.

```diff
    contract UpgradeExecutor (0x44Ec40D86b4643Bd5110ED07BE188F8473Ad2d3a) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract ChallengeManager (0x73cfa0F6ae141212115657ad91Ad918E5d34d882) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract ERC20RollupEventInbox (0x9f1045201f8b9D0b12f6d1e40e8B8e6c047A81E3) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract Bridge (0xa104C0426e95a5538e89131DbB4163d230C35f86) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract Outbox (0xB360b2f57c645E847148d7C479b7468AbF6F707d) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract SequencerInbox (0xD80a805c86C14c879420eC6acb366D04D318fC0C) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract Inbox (0xEa83E8907C89Bc0D9517632f0ba081972E328631) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

Generated with discovered.json: 0x1f48b58d220b819d850857bc29b7feb58dd71bc2

# Diff at Fri, 23 Aug 2024 07:24:11 GMT:

- chain: ethereum
- author: Radina Talanova (<nt.radina@gmail.com>)
- comparing to: main@08f0832a5dea29e7c493cd50bda4bf1729aa03ae block: 20575837
- current block number: 20589788

## Description

Ignored the token's total supply.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20575837 (main branch discovery), not current.

```diff
    contract SXNetwork (0xbe9F61555F50DD6167f2772e9CF7519790d96624) {
    +++ description: None
      values.totalSupply:
-        "97216642899192381828100000"
    }
```

Generated with discovered.json: 0xda775f3da176d73f47a0378b875b6b8cfedacfbd

# Diff at Wed, 21 Aug 2024 13:25:38 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@63cb0bd5d55a6dfae0e2e22590983dd8344be4a3 block: 20575837
- current block number: 20575837

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20575837 (main branch discovery), not current.

```diff
    contract RollupProxy (0x36c6C69A6186D4475fc5c21181CD980Bd6E5e11F) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x44Ec40D86b4643Bd5110ED07BE188F8473Ad2d3a","via":[]}]
    }
```

```diff
    contract UpgradeExecutor (0x44Ec40D86b4643Bd5110ED07BE188F8473Ad2d3a) {
    +++ description: None
      assignedPermissions:
-        {"upgrade":["0x36c6C69A6186D4475fc5c21181CD980Bd6E5e11F"]}
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xe8606A55d105EF857F187C32Ae0E9a168aF8F497","via":[]}]
      receivedPermissions:
+        [{"permission":"upgrade","target":"0x36c6C69A6186D4475fc5c21181CD980Bd6E5e11F","via":[]}]
    }
```

```diff
    contract ChallengeManager (0x73cfa0F6ae141212115657ad91Ad918E5d34d882) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xe8606A55d105EF857F187C32Ae0E9a168aF8F497","via":[]}]
    }
```

```diff
    contract ERC20RollupEventInbox (0x9f1045201f8b9D0b12f6d1e40e8B8e6c047A81E3) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xe8606A55d105EF857F187C32Ae0E9a168aF8F497","via":[]}]
    }
```

```diff
    contract Bridge (0xa104C0426e95a5538e89131DbB4163d230C35f86) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xe8606A55d105EF857F187C32Ae0E9a168aF8F497","via":[]}]
    }
```

```diff
    contract Outbox (0xB360b2f57c645E847148d7C479b7468AbF6F707d) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xe8606A55d105EF857F187C32Ae0E9a168aF8F497","via":[]}]
    }
```

```diff
    contract SequencerInbox (0xD80a805c86C14c879420eC6acb366D04D318fC0C) {
    +++ description: None
      values.dacKeyset.blsSignatures:
+        ["YAW3zWmUnWa5bjus3lTpb2Nbm7dXxRdf3b+t7oLeR35v4TdZyBBliKCDBGOUb/GX9QiBL1uX01ojtrLB2lOYCkUSMyeL5LTuOfIz3NSnc9WlXrNn5GYXvtHzEEpgXWrqMwj5BsraZQMqDNLmTiTVorTHUPJgCYmmkvf6FAHZj/PSAT6iXOGD0/pIgcCAWo2w5wjZaVQzArukpt8Xpj9USXrf8nKlqkVdo83BOfLFV/vkBhrMUI6EILTJRFjS9ZIrchcs1T2I4DiCiox9erUl2mxJy86TIGCdhXkwWb9AP1JBD7WeQZOSkbOSbCfDO0njvAGJgq/9d5D4Wbud6AVJvAAOH4Gqhz7yEWQIXehiVcVLKf2NfuppDpaS35Xwa0KtSg==","YAaK3sypeExYzlInkMHqVKLuzHqfLT5DQWHB2v9z1tJxBz0xePbTPrQqYeJzq0kxZBZmWIBh0BCHlMQaua0yntYyJ0XURJtvcIo7cYDn7EWEpK2fNq0u2lFy6LbiL7p1Lxn/5GppMGKaL5jaocl7rkLs4kKqBJnm0BgibjjhuqZkl3w72uwqXrZRk6KYWF3+0w4sFM5ohbG8AW43vIB4Fj4jnK+8FkcJ+e9lR7mjBnCptf7hSw2LcakQw8lHR1SpJQqzNsy1y5rW8LIDWRPMe7by7o89GUZlKiWUuCaDUjYRwiILu6ZxaGILcv1N1v0hgQLbL7Zm/5vIcHcHIfxnSqtpRDR3ktJX+bQ6O0BYuDCM7sZTDdAC2PcDN7wIxjICNA=="]
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xe8606A55d105EF857F187C32Ae0E9a168aF8F497","via":[]}]
    }
```

```diff
    contract ProxyAdmin (0xe8606A55d105EF857F187C32Ae0E9a168aF8F497) {
    +++ description: None
      assignedPermissions:
-        {"upgrade":["0x44Ec40D86b4643Bd5110ED07BE188F8473Ad2d3a","0x73cfa0F6ae141212115657ad91Ad918E5d34d882","0x9f1045201f8b9D0b12f6d1e40e8B8e6c047A81E3","0xB360b2f57c645E847148d7C479b7468AbF6F707d","0xD80a805c86C14c879420eC6acb366D04D318fC0C","0xEa83E8907C89Bc0D9517632f0ba081972E328631","0xa104C0426e95a5538e89131DbB4163d230C35f86"]}
      receivedPermissions:
+        [{"permission":"upgrade","target":"0x44Ec40D86b4643Bd5110ED07BE188F8473Ad2d3a","via":[]},{"permission":"upgrade","target":"0x73cfa0F6ae141212115657ad91Ad918E5d34d882","via":[]},{"permission":"upgrade","target":"0x9f1045201f8b9D0b12f6d1e40e8B8e6c047A81E3","via":[]},{"permission":"upgrade","target":"0xa104C0426e95a5538e89131DbB4163d230C35f86","via":[]},{"permission":"upgrade","target":"0xB360b2f57c645E847148d7C479b7468AbF6F707d","via":[]},{"permission":"upgrade","target":"0xD80a805c86C14c879420eC6acb366D04D318fC0C","via":[]},{"permission":"upgrade","target":"0xEa83E8907C89Bc0D9517632f0ba081972E328631","via":[]}]
    }
```

```diff
    contract Inbox (0xEa83E8907C89Bc0D9517632f0ba081972E328631) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xe8606A55d105EF857F187C32Ae0E9a168aF8F497","via":[]}]
    }
```

Generated with discovered.json: 0xed925d7845c445e186ec969c286a8323b4c66ede

# Diff at Wed, 21 Aug 2024 08:35:21 GMT:

- chain: ethereum
- author: Radina Talanova (<nt.radina@gmail.com>)
- current block number: 20575837

## Description

Added initial discovery of the chain.

## Initial discovery

```diff
+   Status: CREATED
    contract OneStepProverHostIo (0x17e7F68ce50A77e55C7834ddF31AEf86403B8010)
    +++ description: None
```

```diff
+   Status: CREATED
    contract  (0x27C7Bfd2cC11429e9b80c443b42FDBe4754F6c91)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ValidatorUtils (0x2b0E04Dc90e3fA58165CB41E2834B44A56E766aF)
    +++ description: None
```

```diff
+   Status: CREATED
    contract RollupProxy (0x36c6C69A6186D4475fc5c21181CD980Bd6E5e11F)
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
```

```diff
+   Status: CREATED
    contract UpgradeExecutor (0x44Ec40D86b4643Bd5110ED07BE188F8473Ad2d3a)
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
    contract ChallengeManager (0x73cfa0F6ae141212115657ad91Ad918E5d34d882)
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

```diff
+   Status: CREATED
    contract ValidatorWalletCreator (0x9CAd81628aB7D8e239F1A5B497313341578c5F71)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ERC20RollupEventInbox (0x9f1045201f8b9D0b12f6d1e40e8B8e6c047A81E3)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Bridge (0xa104C0426e95a5538e89131DbB4163d230C35f86)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Outbox (0xB360b2f57c645E847148d7C479b7468AbF6F707d)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SXNetwork (0xbe9F61555F50DD6167f2772e9CF7519790d96624)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SequencerInbox (0xD80a805c86C14c879420eC6acb366D04D318fC0C)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0xe8606A55d105EF857F187C32Ae0E9a168aF8F497)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Inbox (0xEa83E8907C89Bc0D9517632f0ba081972E328631)
    +++ description: None
```

