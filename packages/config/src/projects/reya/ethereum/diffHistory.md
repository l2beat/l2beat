Generated with discovered.json: 0xd273cf810cdaac028212c00364427123f8336ed6

# Diff at Tue, 15 Jul 2025 09:10:25 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@fe7c3b2343ca7836e6a947e456ab91a6f0f6f592 block: 22122787
- current block number: 22923595

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

Generated with discovered.json: 0xa4444e50dd70285af3fc8608f4445d8fad11f721

# Diff at Mon, 14 Jul 2025 12:46:01 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@9f4300dad2f3d080cd56fa311d4a848556c74e72 block: 22122787
- current block number: 22122787

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22122787 (main branch discovery), not current.

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
    EOA  (0x01a0A7BaAAca31AFB5b770FeFD69CE4917D9c32e) {
    +++ description: None
      address:
-        "0x01a0A7BaAAca31AFB5b770FeFD69CE4917D9c32e"
+        "eth:0x01a0A7BaAAca31AFB5b770FeFD69CE4917D9c32e"
    }
```

```diff
    contract UpgradeExecutor (0x07390626b8Bc2C04b1D93c7D246A0629198D7868) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      address:
-        "0x07390626b8Bc2C04b1D93c7D246A0629198D7868"
+        "eth:0x07390626b8Bc2C04b1D93c7D246A0629198D7868"
      values.$admin:
-        "0x74627dd54FA6E94c87F12DBAdAEc275758f51dF9"
+        "eth:0x74627dd54FA6E94c87F12DBAdAEc275758f51dF9"
      values.$implementation:
-        "0x6c21303F5986180B1394d2C89f3e883890E2867b"
+        "eth:0x6c21303F5986180B1394d2C89f3e883890E2867b"
      values.$pastUpgrades.0.2.0:
-        "0x6c21303F5986180B1394d2C89f3e883890E2867b"
+        "eth:0x6c21303F5986180B1394d2C89f3e883890E2867b"
      values.accessControl.ADMIN_ROLE.members.0:
-        "0x07390626b8Bc2C04b1D93c7D246A0629198D7868"
+        "eth:0x07390626b8Bc2C04b1D93c7D246A0629198D7868"
      values.accessControl.EXECUTOR_ROLE.members.0:
-        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
+        "eth:0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
      values.executors.0:
-        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
+        "eth:0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
      implementationNames.0x07390626b8Bc2C04b1D93c7D246A0629198D7868:
-        "TransparentUpgradeableProxy"
      implementationNames.0x6c21303F5986180B1394d2C89f3e883890E2867b:
-        "UpgradeExecutor"
      implementationNames.eth:0x07390626b8Bc2C04b1D93c7D246A0629198D7868:
+        "TransparentUpgradeableProxy"
      implementationNames.eth:0x6c21303F5986180B1394d2C89f3e883890E2867b:
+        "UpgradeExecutor"
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
    EOA  (0x28bB9385A588EF4747264D19B9A9F1603591680c) {
    +++ description: None
      address:
-        "0x28bB9385A588EF4747264D19B9A9F1603591680c"
+        "eth:0x28bB9385A588EF4747264D19B9A9F1603591680c"
    }
```

```diff
    EOA  (0x29156F8dFfE8979F49E3a085dbb10477373a6051) {
    +++ description: None
      address:
-        "0x29156F8dFfE8979F49E3a085dbb10477373a6051"
+        "eth:0x29156F8dFfE8979F49E3a085dbb10477373a6051"
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
    contract Bridge (0x383c03c4EfF819E73409DbC690755a9992393814) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      address:
-        "0x383c03c4EfF819E73409DbC690755a9992393814"
+        "eth:0x383c03c4EfF819E73409DbC690755a9992393814"
      values.$admin:
-        "0x74627dd54FA6E94c87F12DBAdAEc275758f51dF9"
+        "eth:0x74627dd54FA6E94c87F12DBAdAEc275758f51dF9"
      values.$implementation:
-        "0x1c6ACCd9d66f3B993928E7439c9A2d67b94a445F"
+        "eth:0x1c6ACCd9d66f3B993928E7439c9A2d67b94a445F"
      values.$pastUpgrades.0.2.0:
-        "0x1c6ACCd9d66f3B993928E7439c9A2d67b94a445F"
+        "eth:0x1c6ACCd9d66f3B993928E7439c9A2d67b94a445F"
      values.activeOutbox:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
+++ description: Allowed to mint the gastoken on L2 and call `enqueueDelayedMessage()` on the bridge.
+++ severity: HIGH
      values.allowedDelayedInboxList.0:
-        "0x672109752635177ebcb17F2C7e04575A709014BD"
+        "eth:0x672109752635177ebcb17F2C7e04575A709014BD"
+++ description: Allowed to mint the gastoken on L2 and call `enqueueDelayedMessage()` on the bridge.
+++ severity: HIGH
      values.allowedDelayedInboxList.1:
-        "0xFd9f59554351122b231F832a0e0A1aBb0604D7fd"
+        "eth:0xFd9f59554351122b231F832a0e0A1aBb0604D7fd"
+++ description: Can make calls as the bridge, steal all funds.
+++ severity: HIGH
      values.allowedOutboxList.0:
-        "0x3f373b0A7DcEe7b7bCfC16DF85CfAE18388542c9"
+        "eth:0x3f373b0A7DcEe7b7bCfC16DF85CfAE18388542c9"
+++ description: All Inboxes that were ever set as allowed in the bridge.
+++ severity: HIGH
      values.inboxHistory.0:
-        "0x672109752635177ebcb17F2C7e04575A709014BD"
+        "eth:0x672109752635177ebcb17F2C7e04575A709014BD"
+++ description: All Inboxes that were ever set as allowed in the bridge.
+++ severity: HIGH
      values.inboxHistory.1:
-        "0xFd9f59554351122b231F832a0e0A1aBb0604D7fd"
+        "eth:0xFd9f59554351122b231F832a0e0A1aBb0604D7fd"
+++ description: All Outboxes that were ever set as allowed in the bridge.
+++ severity: HIGH
      values.outboxHistory.0:
-        "0x3f373b0A7DcEe7b7bCfC16DF85CfAE18388542c9"
+        "eth:0x3f373b0A7DcEe7b7bCfC16DF85CfAE18388542c9"
      values.rollup:
-        "0x448Bbd134dE1B23976073aB4F2915849b2dcD73A"
+        "eth:0x448Bbd134dE1B23976073aB4F2915849b2dcD73A"
      values.sequencerInbox:
-        "0x6CA2A628fb690Bd431F4aA608655ce37c66aff9d"
+        "eth:0x6CA2A628fb690Bd431F4aA608655ce37c66aff9d"
      implementationNames.0x383c03c4EfF819E73409DbC690755a9992393814:
-        "TransparentUpgradeableProxy"
      implementationNames.0x1c6ACCd9d66f3B993928E7439c9A2d67b94a445F:
-        "Bridge"
      implementationNames.eth:0x383c03c4EfF819E73409DbC690755a9992393814:
+        "TransparentUpgradeableProxy"
      implementationNames.eth:0x1c6ACCd9d66f3B993928E7439c9A2d67b94a445F:
+        "Bridge"
    }
```

```diff
    contract Outbox (0x3f373b0A7DcEe7b7bCfC16DF85CfAE18388542c9) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
      address:
-        "0x3f373b0A7DcEe7b7bCfC16DF85CfAE18388542c9"
+        "eth:0x3f373b0A7DcEe7b7bCfC16DF85CfAE18388542c9"
      values.$admin:
-        "0x74627dd54FA6E94c87F12DBAdAEc275758f51dF9"
+        "eth:0x74627dd54FA6E94c87F12DBAdAEc275758f51dF9"
      values.$implementation:
-        "0x2a6DD4433ffa96dc1755814FC0d9cc83A5F68DeC"
+        "eth:0x2a6DD4433ffa96dc1755814FC0d9cc83A5F68DeC"
      values.$pastUpgrades.0.2.0:
-        "0x2a6DD4433ffa96dc1755814FC0d9cc83A5F68DeC"
+        "eth:0x2a6DD4433ffa96dc1755814FC0d9cc83A5F68DeC"
      values.bridge:
-        "0x383c03c4EfF819E73409DbC690755a9992393814"
+        "eth:0x383c03c4EfF819E73409DbC690755a9992393814"
      values.l2ToL1Sender:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.rollup:
-        "0x448Bbd134dE1B23976073aB4F2915849b2dcD73A"
+        "eth:0x448Bbd134dE1B23976073aB4F2915849b2dcD73A"
      implementationNames.0x3f373b0A7DcEe7b7bCfC16DF85CfAE18388542c9:
-        "TransparentUpgradeableProxy"
      implementationNames.0x2a6DD4433ffa96dc1755814FC0d9cc83A5F68DeC:
-        "Outbox"
      implementationNames.eth:0x3f373b0A7DcEe7b7bCfC16DF85CfAE18388542c9:
+        "TransparentUpgradeableProxy"
      implementationNames.eth:0x2a6DD4433ffa96dc1755814FC0d9cc83A5F68DeC:
+        "Outbox"
    }
```

```diff
    contract RollupProxy (0x448Bbd134dE1B23976073aB4F2915849b2dcD73A) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      address:
-        "0x448Bbd134dE1B23976073aB4F2915849b2dcD73A"
+        "eth:0x448Bbd134dE1B23976073aB4F2915849b2dcD73A"
      values.$admin:
-        "0x07390626b8Bc2C04b1D93c7D246A0629198D7868"
+        "eth:0x07390626b8Bc2C04b1D93c7D246A0629198D7868"
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
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.bridge:
-        "0x383c03c4EfF819E73409DbC690755a9992393814"
+        "eth:0x383c03c4EfF819E73409DbC690755a9992393814"
      values.challengeManager:
-        "0x728B406A4809118533D96bB3b5C50712C99d8Fa5"
+        "eth:0x728B406A4809118533D96bB3b5C50712C99d8Fa5"
      values.inbox:
-        "0x672109752635177ebcb17F2C7e04575A709014BD"
+        "eth:0x672109752635177ebcb17F2C7e04575A709014BD"
      values.loserStakeEscrow:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.outbox:
-        "0x3f373b0A7DcEe7b7bCfC16DF85CfAE18388542c9"
+        "eth:0x3f373b0A7DcEe7b7bCfC16DF85CfAE18388542c9"
      values.owner:
-        "0x07390626b8Bc2C04b1D93c7D246A0629198D7868"
+        "eth:0x07390626b8Bc2C04b1D93c7D246A0629198D7868"
      values.rollupEventInbox:
-        "0xFd9f59554351122b231F832a0e0A1aBb0604D7fd"
+        "eth:0xFd9f59554351122b231F832a0e0A1aBb0604D7fd"
      values.sequencerInbox:
-        "0x6CA2A628fb690Bd431F4aA608655ce37c66aff9d"
+        "eth:0x6CA2A628fb690Bd431F4aA608655ce37c66aff9d"
      values.stakeToken:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.validators.0:
-        "0xC3D92d18c9CcD418A5547C28a5c3be60E694EA3c"
+        "eth:0xC3D92d18c9CcD418A5547C28a5c3be60E694EA3c"
      values.validatorUtils:
-        "0x2b0E04Dc90e3fA58165CB41E2834B44A56E766aF"
+        "eth:0x2b0E04Dc90e3fA58165CB41E2834B44A56E766aF"
      values.validatorWalletCreator:
-        "0x9CAd81628aB7D8e239F1A5B497313341578c5F71"
+        "eth:0x9CAd81628aB7D8e239F1A5B497313341578c5F71"
      implementationNames.0x448Bbd134dE1B23976073aB4F2915849b2dcD73A:
-        "RollupProxy"
      implementationNames.0x9B56A789fEDD5df27dBaB53b085F7157397cA17D:
-        "RollupAdminLogic"
      implementationNames.0x5607Ea4b5F6e3F610bD346B36D3143FFf46d1C34:
-        "RollupUserLogic"
      implementationNames.eth:0x448Bbd134dE1B23976073aB4F2915849b2dcD73A:
+        "RollupProxy"
      implementationNames.eth:0x9B56A789fEDD5df27dBaB53b085F7157397cA17D:
+        "RollupAdminLogic"
      implementationNames.eth:0x5607Ea4b5F6e3F610bD346B36D3143FFf46d1C34:
+        "RollupUserLogic"
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
    contract Inbox (0x672109752635177ebcb17F2C7e04575A709014BD) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      address:
-        "0x672109752635177ebcb17F2C7e04575A709014BD"
+        "eth:0x672109752635177ebcb17F2C7e04575A709014BD"
      values.$admin:
-        "0x74627dd54FA6E94c87F12DBAdAEc275758f51dF9"
+        "eth:0x74627dd54FA6E94c87F12DBAdAEc275758f51dF9"
      values.$implementation:
-        "0xf3830309BdfADcC7eEEF99C2EeA879D5fA6C756C"
+        "eth:0xf3830309BdfADcC7eEEF99C2EeA879D5fA6C756C"
      values.$pastUpgrades.0.2.0:
-        "0x1162084C3C6575121146582Db5BE43189e8CEe6b"
+        "eth:0x1162084C3C6575121146582Db5BE43189e8CEe6b"
      values.$pastUpgrades.1.2.0:
-        "0xf3830309BdfADcC7eEEF99C2EeA879D5fA6C756C"
+        "eth:0xf3830309BdfADcC7eEEF99C2EeA879D5fA6C756C"
      values.bridge:
-        "0x383c03c4EfF819E73409DbC690755a9992393814"
+        "eth:0x383c03c4EfF819E73409DbC690755a9992393814"
      values.getProxyAdmin:
-        "0x74627dd54FA6E94c87F12DBAdAEc275758f51dF9"
+        "eth:0x74627dd54FA6E94c87F12DBAdAEc275758f51dF9"
      values.sequencerInbox:
-        "0x6CA2A628fb690Bd431F4aA608655ce37c66aff9d"
+        "eth:0x6CA2A628fb690Bd431F4aA608655ce37c66aff9d"
      implementationNames.0x672109752635177ebcb17F2C7e04575A709014BD:
-        "TransparentUpgradeableProxy"
      implementationNames.0xf3830309BdfADcC7eEEF99C2EeA879D5fA6C756C:
-        "Inbox"
      implementationNames.eth:0x672109752635177ebcb17F2C7e04575A709014BD:
+        "TransparentUpgradeableProxy"
      implementationNames.eth:0xf3830309BdfADcC7eEEF99C2EeA879D5fA6C756C:
+        "Inbox"
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
    contract SequencerInbox (0x6CA2A628fb690Bd431F4aA608655ce37c66aff9d) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      address:
-        "0x6CA2A628fb690Bd431F4aA608655ce37c66aff9d"
+        "eth:0x6CA2A628fb690Bd431F4aA608655ce37c66aff9d"
      values.$admin:
-        "0x74627dd54FA6E94c87F12DBAdAEc275758f51dF9"
+        "eth:0x74627dd54FA6E94c87F12DBAdAEc275758f51dF9"
      values.$implementation:
-        "0x734B78823c4d979045EC23F38B54A070df7769FF"
+        "eth:0x734B78823c4d979045EC23F38B54A070df7769FF"
      values.$pastUpgrades.0.2.0:
-        "0x873484Ba63353C8b71210ce123B465512d408B27"
+        "eth:0x873484Ba63353C8b71210ce123B465512d408B27"
      values.$pastUpgrades.1.2.0:
-        "0x958985cf2c54f99ba4a599221A8090C1F9Cee9A5"
+        "eth:0x958985cf2c54f99ba4a599221A8090C1F9Cee9A5"
      values.$pastUpgrades.2.2.0:
-        "0x734B78823c4d979045EC23F38B54A070df7769FF"
+        "eth:0x734B78823c4d979045EC23F38B54A070df7769FF"
      values.batchPosterManager:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.batchPosters.0:
-        "0x29156F8dFfE8979F49E3a085dbb10477373a6051"
+        "eth:0x29156F8dFfE8979F49E3a085dbb10477373a6051"
      values.bridge:
-        "0x383c03c4EfF819E73409DbC690755a9992393814"
+        "eth:0x383c03c4EfF819E73409DbC690755a9992393814"
      values.reader4844:
-        "0x6c5c9E6c080a6C25f49DfFE85cfA71aaEAAfdE74"
+        "eth:0x6c5c9E6c080a6C25f49DfFE85cfA71aaEAAfdE74"
      values.rollup:
-        "0x448Bbd134dE1B23976073aB4F2915849b2dcD73A"
+        "eth:0x448Bbd134dE1B23976073aB4F2915849b2dcD73A"
      implementationNames.0x6CA2A628fb690Bd431F4aA608655ce37c66aff9d:
-        "TransparentUpgradeableProxy"
      implementationNames.0x734B78823c4d979045EC23F38B54A070df7769FF:
-        "SequencerInbox"
      implementationNames.eth:0x6CA2A628fb690Bd431F4aA608655ce37c66aff9d:
+        "TransparentUpgradeableProxy"
      implementationNames.eth:0x734B78823c4d979045EC23F38B54A070df7769FF:
+        "SequencerInbox"
    }
```

```diff
    contract ChallengeManager (0x728B406A4809118533D96bB3b5C50712C99d8Fa5) {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      address:
-        "0x728B406A4809118533D96bB3b5C50712C99d8Fa5"
+        "eth:0x728B406A4809118533D96bB3b5C50712C99d8Fa5"
      values.$admin:
-        "0x74627dd54FA6E94c87F12DBAdAEc275758f51dF9"
+        "eth:0x74627dd54FA6E94c87F12DBAdAEc275758f51dF9"
      values.$implementation:
-        "0x02E05A9245C5853f895daDcc3A8216C953C8736B"
+        "eth:0x02E05A9245C5853f895daDcc3A8216C953C8736B"
      values.$pastUpgrades.0.2.0:
-        "0xEe9E5546A11Cb5b4A86e92DA05f2ef75C26E4754"
+        "eth:0xEe9E5546A11Cb5b4A86e92DA05f2ef75C26E4754"
      values.$pastUpgrades.1.2.0:
-        "0x1D901DD7A5eFE421C3C437B147040E5AF22E6A43"
+        "eth:0x1D901DD7A5eFE421C3C437B147040E5AF22E6A43"
      values.$pastUpgrades.2.2.0:
-        "0x02E05A9245C5853f895daDcc3A8216C953C8736B"
+        "eth:0x02E05A9245C5853f895daDcc3A8216C953C8736B"
      values.bridge:
-        "0x383c03c4EfF819E73409DbC690755a9992393814"
+        "eth:0x383c03c4EfF819E73409DbC690755a9992393814"
      values.osp:
-        "0x8Faa21891B0b928afEbd5314D1D313f8f7B34DaC"
+        "eth:0x8Faa21891B0b928afEbd5314D1D313f8f7B34DaC"
      values.resultReceiver:
-        "0x448Bbd134dE1B23976073aB4F2915849b2dcD73A"
+        "eth:0x448Bbd134dE1B23976073aB4F2915849b2dcD73A"
      values.sequencerInbox:
-        "0x6CA2A628fb690Bd431F4aA608655ce37c66aff9d"
+        "eth:0x6CA2A628fb690Bd431F4aA608655ce37c66aff9d"
      implementationNames.0x728B406A4809118533D96bB3b5C50712C99d8Fa5:
-        "TransparentUpgradeableProxy"
      implementationNames.0x02E05A9245C5853f895daDcc3A8216C953C8736B:
-        "ChallengeManager"
      implementationNames.eth:0x728B406A4809118533D96bB3b5C50712C99d8Fa5:
+        "TransparentUpgradeableProxy"
      implementationNames.eth:0x02E05A9245C5853f895daDcc3A8216C953C8736B:
+        "ChallengeManager"
    }
```

```diff
    contract ProxyAdmin (0x74627dd54FA6E94c87F12DBAdAEc275758f51dF9) {
    +++ description: None
      address:
-        "0x74627dd54FA6E94c87F12DBAdAEc275758f51dF9"
+        "eth:0x74627dd54FA6E94c87F12DBAdAEc275758f51dF9"
      values.owner:
-        "0x07390626b8Bc2C04b1D93c7D246A0629198D7868"
+        "eth:0x07390626b8Bc2C04b1D93c7D246A0629198D7868"
      implementationNames.0x74627dd54FA6E94c87F12DBAdAEc275758f51dF9:
-        "ProxyAdmin"
      implementationNames.eth:0x74627dd54FA6E94c87F12DBAdAEc275758f51dF9:
+        "ProxyAdmin"
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
    EOA  (0xB0BBff6311B7F245761A7846d3Ce7B1b100C1836) {
    +++ description: None
      address:
-        "0xB0BBff6311B7F245761A7846d3Ce7B1b100C1836"
+        "eth:0xB0BBff6311B7F245761A7846d3Ce7B1b100C1836"
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
    EOA  (0xB65540bBA534E88EB4a5062D0E6519C07063b259) {
    +++ description: None
      address:
-        "0xB65540bBA534E88EB4a5062D0E6519C07063b259"
+        "eth:0xB65540bBA534E88EB4a5062D0E6519C07063b259"
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
    EOA  (0xC3D92d18c9CcD418A5547C28a5c3be60E694EA3c) {
    +++ description: None
      address:
-        "0xC3D92d18c9CcD418A5547C28a5c3be60E694EA3c"
+        "eth:0xC3D92d18c9CcD418A5547C28a5c3be60E694EA3c"
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
    contract SocketVault_Reya (0xdFf78A949E47c1e90f3Dd6dd7Fe2Fa72B42a75f7) {
    +++ description: None
      address:
-        "0xdFf78A949E47c1e90f3Dd6dd7Fe2Fa72B42a75f7"
+        "eth:0xdFf78A949E47c1e90f3Dd6dd7Fe2Fa72B42a75f7"
      values.nominee:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.owner:
-        "0xB0BBff6311B7F245761A7846d3Ce7B1b100C1836"
+        "eth:0xB0BBff6311B7F245761A7846d3Ce7B1b100C1836"
      implementationNames.0xdFf78A949E47c1e90f3Dd6dd7Fe2Fa72B42a75f7:
-        "Vault"
      implementationNames.eth:0xdFf78A949E47c1e90f3Dd6dd7Fe2Fa72B42a75f7:
+        "Vault"
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
    contract RollupEventInbox (0xFd9f59554351122b231F832a0e0A1aBb0604D7fd) {
    +++ description: Helper contract sending configuration data over the bridge during the systems initialization.
      address:
-        "0xFd9f59554351122b231F832a0e0A1aBb0604D7fd"
+        "eth:0xFd9f59554351122b231F832a0e0A1aBb0604D7fd"
      values.$admin:
-        "0x74627dd54FA6E94c87F12DBAdAEc275758f51dF9"
+        "eth:0x74627dd54FA6E94c87F12DBAdAEc275758f51dF9"
      values.$implementation:
-        "0x13BE515E44Eefaf3eBEFAD684F1FBB574Ac0A494"
+        "eth:0x13BE515E44Eefaf3eBEFAD684F1FBB574Ac0A494"
      values.$pastUpgrades.0.2.0:
-        "0x13BE515E44Eefaf3eBEFAD684F1FBB574Ac0A494"
+        "eth:0x13BE515E44Eefaf3eBEFAD684F1FBB574Ac0A494"
      values.bridge:
-        "0x383c03c4EfF819E73409DbC690755a9992393814"
+        "eth:0x383c03c4EfF819E73409DbC690755a9992393814"
      values.rollup:
-        "0x448Bbd134dE1B23976073aB4F2915849b2dcD73A"
+        "eth:0x448Bbd134dE1B23976073aB4F2915849b2dcD73A"
      implementationNames.0xFd9f59554351122b231F832a0e0A1aBb0604D7fd:
-        "TransparentUpgradeableProxy"
      implementationNames.0x13BE515E44Eefaf3eBEFAD684F1FBB574Ac0A494:
-        "RollupEventInbox"
      implementationNames.eth:0xFd9f59554351122b231F832a0e0A1aBb0604D7fd:
+        "TransparentUpgradeableProxy"
      implementationNames.eth:0x13BE515E44Eefaf3eBEFAD684F1FBB574Ac0A494:
+        "RollupEventInbox"
    }
```

```diff
+   Status: CREATED
    contract OneStepProverHostIo (0x0003A96B27ce73505b43ea1b71a5aB06bec568C4)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract UpgradeExecutor (0x07390626b8Bc2C04b1D93c7D246A0629198D7868)
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
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
    contract Bridge (0x383c03c4EfF819E73409DbC690755a9992393814)
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
```

```diff
+   Status: CREATED
    contract Outbox (0x3f373b0A7DcEe7b7bCfC16DF85CfAE18388542c9)
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
```

```diff
+   Status: CREATED
    contract RollupProxy (0x448Bbd134dE1B23976073aB4F2915849b2dcD73A)
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
```

```diff
+   Status: CREATED
    contract Inbox (0x672109752635177ebcb17F2C7e04575A709014BD)
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
```

```diff
+   Status: CREATED
    contract SequencerInbox (0x6CA2A628fb690Bd431F4aA608655ce37c66aff9d)
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
```

```diff
+   Status: CREATED
    contract ChallengeManager (0x728B406A4809118533D96bB3b5C50712C99d8Fa5)
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x74627dd54FA6E94c87F12DBAdAEc275758f51dF9)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProofEntry (0x8Faa21891B0b928afEbd5314D1D313f8f7B34DaC)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
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
    contract SocketVault_Reya (0xdFf78A949E47c1e90f3Dd6dd7Fe2Fa72B42a75f7)
    +++ description: None
```

```diff
+   Status: CREATED
    contract RollupEventInbox (0xFd9f59554351122b231F832a0e0A1aBb0604D7fd)
    +++ description: Helper contract sending configuration data over the bridge during the systems initialization.
```

Generated with discovered.json: 0x3631c538a30e0cc16f789e5ba5872e5bc0972122

# Diff at Fri, 04 Jul 2025 12:19:17 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f56dc47fe915564d4555300304da4d3bcbc087f block: 22122787
- current block number: 22122787

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22122787 (main branch discovery), not current.

```diff
    contract UpgradeExecutor (0x07390626b8Bc2C04b1D93c7D246A0629198D7868) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      directlyReceivedPermissions.0.from:
-        "ethereum:0x74627dd54FA6E94c87F12DBAdAEc275758f51dF9"
+        "eth:0x74627dd54FA6E94c87F12DBAdAEc275758f51dF9"
      directlyReceivedPermissions.1.from:
-        "ethereum:0x448Bbd134dE1B23976073aB4F2915849b2dcD73A"
+        "eth:0x448Bbd134dE1B23976073aB4F2915849b2dcD73A"
      directlyReceivedPermissions.2.from:
-        "ethereum:0x448Bbd134dE1B23976073aB4F2915849b2dcD73A"
+        "eth:0x448Bbd134dE1B23976073aB4F2915849b2dcD73A"
    }
```

```diff
    EOA  (0x29156F8dFfE8979F49E3a085dbb10477373a6051) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0x6CA2A628fb690Bd431F4aA608655ce37c66aff9d"
+        "eth:0x6CA2A628fb690Bd431F4aA608655ce37c66aff9d"
    }
```

```diff
    contract ProxyAdmin (0x74627dd54FA6E94c87F12DBAdAEc275758f51dF9) {
    +++ description: None
      directlyReceivedPermissions.0.from:
-        "ethereum:0x07390626b8Bc2C04b1D93c7D246A0629198D7868"
+        "eth:0x07390626b8Bc2C04b1D93c7D246A0629198D7868"
      directlyReceivedPermissions.1.from:
-        "ethereum:0x383c03c4EfF819E73409DbC690755a9992393814"
+        "eth:0x383c03c4EfF819E73409DbC690755a9992393814"
      directlyReceivedPermissions.2.from:
-        "ethereum:0x3f373b0A7DcEe7b7bCfC16DF85CfAE18388542c9"
+        "eth:0x3f373b0A7DcEe7b7bCfC16DF85CfAE18388542c9"
      directlyReceivedPermissions.3.from:
-        "ethereum:0x672109752635177ebcb17F2C7e04575A709014BD"
+        "eth:0x672109752635177ebcb17F2C7e04575A709014BD"
      directlyReceivedPermissions.4.from:
-        "ethereum:0x6CA2A628fb690Bd431F4aA608655ce37c66aff9d"
+        "eth:0x6CA2A628fb690Bd431F4aA608655ce37c66aff9d"
      directlyReceivedPermissions.5.from:
-        "ethereum:0x728B406A4809118533D96bB3b5C50712C99d8Fa5"
+        "eth:0x728B406A4809118533D96bB3b5C50712C99d8Fa5"
      directlyReceivedPermissions.6.from:
-        "ethereum:0xFd9f59554351122b231F832a0e0A1aBb0604D7fd"
+        "eth:0xFd9f59554351122b231F832a0e0A1aBb0604D7fd"
    }
```

```diff
    contract Gelato Multisig (0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb) {
    +++ description: None
      receivedPermissions.0.via.0.address:
-        "ethereum:0x07390626b8Bc2C04b1D93c7D246A0629198D7868"
+        "eth:0x07390626b8Bc2C04b1D93c7D246A0629198D7868"
      receivedPermissions.0.from:
-        "ethereum:0x448Bbd134dE1B23976073aB4F2915849b2dcD73A"
+        "eth:0x448Bbd134dE1B23976073aB4F2915849b2dcD73A"
      receivedPermissions.1.via.1.address:
-        "ethereum:0x07390626b8Bc2C04b1D93c7D246A0629198D7868"
+        "eth:0x07390626b8Bc2C04b1D93c7D246A0629198D7868"
      receivedPermissions.1.via.0.address:
-        "ethereum:0x74627dd54FA6E94c87F12DBAdAEc275758f51dF9"
+        "eth:0x74627dd54FA6E94c87F12DBAdAEc275758f51dF9"
      receivedPermissions.1.from:
-        "ethereum:0x07390626b8Bc2C04b1D93c7D246A0629198D7868"
+        "eth:0x07390626b8Bc2C04b1D93c7D246A0629198D7868"
      receivedPermissions.2.via.1.address:
-        "ethereum:0x07390626b8Bc2C04b1D93c7D246A0629198D7868"
+        "eth:0x07390626b8Bc2C04b1D93c7D246A0629198D7868"
      receivedPermissions.2.via.0.address:
-        "ethereum:0x74627dd54FA6E94c87F12DBAdAEc275758f51dF9"
+        "eth:0x74627dd54FA6E94c87F12DBAdAEc275758f51dF9"
      receivedPermissions.2.from:
-        "ethereum:0x383c03c4EfF819E73409DbC690755a9992393814"
+        "eth:0x383c03c4EfF819E73409DbC690755a9992393814"
      receivedPermissions.3.via.1.address:
-        "ethereum:0x07390626b8Bc2C04b1D93c7D246A0629198D7868"
+        "eth:0x07390626b8Bc2C04b1D93c7D246A0629198D7868"
      receivedPermissions.3.via.0.address:
-        "ethereum:0x74627dd54FA6E94c87F12DBAdAEc275758f51dF9"
+        "eth:0x74627dd54FA6E94c87F12DBAdAEc275758f51dF9"
      receivedPermissions.3.from:
-        "ethereum:0x3f373b0A7DcEe7b7bCfC16DF85CfAE18388542c9"
+        "eth:0x3f373b0A7DcEe7b7bCfC16DF85CfAE18388542c9"
      receivedPermissions.4.via.0.address:
-        "ethereum:0x07390626b8Bc2C04b1D93c7D246A0629198D7868"
+        "eth:0x07390626b8Bc2C04b1D93c7D246A0629198D7868"
      receivedPermissions.4.from:
-        "ethereum:0x448Bbd134dE1B23976073aB4F2915849b2dcD73A"
+        "eth:0x448Bbd134dE1B23976073aB4F2915849b2dcD73A"
      receivedPermissions.5.via.1.address:
-        "ethereum:0x07390626b8Bc2C04b1D93c7D246A0629198D7868"
+        "eth:0x07390626b8Bc2C04b1D93c7D246A0629198D7868"
      receivedPermissions.5.via.0.address:
-        "ethereum:0x74627dd54FA6E94c87F12DBAdAEc275758f51dF9"
+        "eth:0x74627dd54FA6E94c87F12DBAdAEc275758f51dF9"
      receivedPermissions.5.from:
-        "ethereum:0x672109752635177ebcb17F2C7e04575A709014BD"
+        "eth:0x672109752635177ebcb17F2C7e04575A709014BD"
      receivedPermissions.6.via.1.address:
-        "ethereum:0x07390626b8Bc2C04b1D93c7D246A0629198D7868"
+        "eth:0x07390626b8Bc2C04b1D93c7D246A0629198D7868"
      receivedPermissions.6.via.0.address:
-        "ethereum:0x74627dd54FA6E94c87F12DBAdAEc275758f51dF9"
+        "eth:0x74627dd54FA6E94c87F12DBAdAEc275758f51dF9"
      receivedPermissions.6.from:
-        "ethereum:0x6CA2A628fb690Bd431F4aA608655ce37c66aff9d"
+        "eth:0x6CA2A628fb690Bd431F4aA608655ce37c66aff9d"
      receivedPermissions.7.via.1.address:
-        "ethereum:0x07390626b8Bc2C04b1D93c7D246A0629198D7868"
+        "eth:0x07390626b8Bc2C04b1D93c7D246A0629198D7868"
      receivedPermissions.7.via.0.address:
-        "ethereum:0x74627dd54FA6E94c87F12DBAdAEc275758f51dF9"
+        "eth:0x74627dd54FA6E94c87F12DBAdAEc275758f51dF9"
      receivedPermissions.7.from:
-        "ethereum:0x728B406A4809118533D96bB3b5C50712C99d8Fa5"
+        "eth:0x728B406A4809118533D96bB3b5C50712C99d8Fa5"
      receivedPermissions.8.via.1.address:
-        "ethereum:0x07390626b8Bc2C04b1D93c7D246A0629198D7868"
+        "eth:0x07390626b8Bc2C04b1D93c7D246A0629198D7868"
      receivedPermissions.8.via.0.address:
-        "ethereum:0x74627dd54FA6E94c87F12DBAdAEc275758f51dF9"
+        "eth:0x74627dd54FA6E94c87F12DBAdAEc275758f51dF9"
      receivedPermissions.8.from:
-        "ethereum:0xFd9f59554351122b231F832a0e0A1aBb0604D7fd"
+        "eth:0xFd9f59554351122b231F832a0e0A1aBb0604D7fd"
      directlyReceivedPermissions.0.from:
-        "ethereum:0x07390626b8Bc2C04b1D93c7D246A0629198D7868"
+        "eth:0x07390626b8Bc2C04b1D93c7D246A0629198D7868"
    }
```

```diff
    EOA  (0xC3D92d18c9CcD418A5547C28a5c3be60E694EA3c) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0x448Bbd134dE1B23976073aB4F2915849b2dcD73A"
+        "eth:0x448Bbd134dE1B23976073aB4F2915849b2dcD73A"
    }
```

Generated with discovered.json: 0x87af50fa35c67f712514e227ff52f135c94a800f

# Diff at Wed, 18 Jun 2025 12:23:47 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@a8e4f22a1441bd5040898cc3d3d62b3582942b65 block: 22122787
- current block number: 22122787

## Description

config: wasmmoduleroot map updated.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22122787 (main branch discovery), not current.

```diff
    contract RollupProxy (0x448Bbd134dE1B23976073aB4F2915849b2dcD73A) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      usedTypes.0.arg.0xdb698a2576298f25448bc092e52cf13b1e24141c997135d70f217d674bbeb69a:
+        "ArbOS v40 wasmModuleRoot"
    }
```

Generated with discovered.json: 0x9a1978557b399beb454a9919d0e6c67e1c09cf85

# Diff at Tue, 27 May 2025 08:28:36 GMT:

- author: Michał Podsiadły (<michal.podsiadly@l2beat.com>)
- comparing to: main@fd658a9ed4bbd45fc5705d23b1906ca057d0d8b0 block: 22122787
- current block number: 22122787

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22122787 (main branch discovery), not current.

```diff
    contract RollupProxy (0x448Bbd134dE1B23976073aB4F2915849b2dcD73A) {
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

Generated with discovered.json: 0xeba77b89aa7b31eeba50fc98c708f47159dc0669

# Diff at Fri, 23 May 2025 09:41:02 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@69cd181abbc3c830a6caf2f4429b37cae72ffdb8 block: 22122787
- current block number: 22122787

## Description

Introduced .role field on each permission, defaulting to field name on which it was defined (with '.' prefix)

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22122787 (main branch discovery), not current.

```diff
    contract UpgradeExecutor (0x07390626b8Bc2C04b1D93c7D246A0629198D7868) {
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
    EOA  (0x29156F8dFfE8979F49E3a085dbb10477373a6051) {
    +++ description: None
      receivedPermissions.0.role:
+        ".batchPosters"
    }
```

```diff
    contract ProxyAdmin (0x74627dd54FA6E94c87F12DBAdAEc275758f51dF9) {
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
    contract Gelato Multisig (0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb) {
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
    EOA  (0xC3D92d18c9CcD418A5547C28a5c3be60E694EA3c) {
    +++ description: None
      receivedPermissions.0.role:
+        ".validators"
    }
```

Generated with discovered.json: 0x772cb19244f1f541d66009ef57f96729da776a64

# Diff at Fri, 02 May 2025 17:24:16 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@c598e33a0c469175b7abbd6c2a13b47b63d6b6a4 block: 22122787
- current block number: 22122787

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22122787 (main branch discovery), not current.

```diff
    contract RollupProxy (0x448Bbd134dE1B23976073aB4F2915849b2dcD73A) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      usedTypes.0.arg.0xaf1dbdfceb871c00bfbb1675983133df04f0ed04e89647812513c091e3a982b3:
+        "Celestia Nitro 3.3.2 wasmModuleRoot"
    }
```

Generated with discovered.json: 0x3b83e0b578b3a4fef52065cb5b8addcffa4d740b

# Diff at Tue, 29 Apr 2025 08:19:10 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@ef7477af00fe0b57a2f7cacf7e958c12494af662 block: 22122787
- current block number: 22122787

## Description

Field .issuedPermissions is removed from the output as no longer needed. Added 'permissionsConfigHash' due to refactoring of the modelling process (into a separate command).

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22122787 (main branch discovery), not current.

```diff
    contract UpgradeExecutor (0x07390626b8Bc2C04b1D93c7D246A0629198D7868) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb","via":[{"address":"0x07390626b8Bc2C04b1D93c7D246A0629198D7868"},{"address":"0x74627dd54FA6E94c87F12DBAdAEc275758f51dF9"}]}]
    }
```

```diff
    contract Bridge (0x383c03c4EfF819E73409DbC690755a9992393814) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb","via":[{"address":"0x07390626b8Bc2C04b1D93c7D246A0629198D7868"},{"address":"0x74627dd54FA6E94c87F12DBAdAEc275758f51dF9"}]}]
    }
```

```diff
    contract Outbox (0x3f373b0A7DcEe7b7bCfC16DF85CfAE18388542c9) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb","via":[{"address":"0x07390626b8Bc2C04b1D93c7D246A0629198D7868"},{"address":"0x74627dd54FA6E94c87F12DBAdAEc275758f51dF9"}]}]
    }
```

```diff
    contract RollupProxy (0x448Bbd134dE1B23976073aB4F2915849b2dcD73A) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      issuedPermissions:
-        [{"permission":"interact","to":"0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb","description":"Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes.","via":[{"address":"0x07390626b8Bc2C04b1D93c7D246A0629198D7868"}]},{"permission":"upgrade","to":"0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb","via":[{"address":"0x07390626b8Bc2C04b1D93c7D246A0629198D7868"}]},{"permission":"validate","to":"0xC3D92d18c9CcD418A5547C28a5c3be60E694EA3c","description":"Can propose new state roots (called nodes) and challenge state roots on the host chain.","via":[]}]
    }
```

```diff
    contract Inbox (0x672109752635177ebcb17F2C7e04575A709014BD) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb","via":[{"address":"0x07390626b8Bc2C04b1D93c7D246A0629198D7868"},{"address":"0x74627dd54FA6E94c87F12DBAdAEc275758f51dF9"}]}]
    }
```

```diff
    contract SequencerInbox (0x6CA2A628fb690Bd431F4aA608655ce37c66aff9d) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      issuedPermissions:
-        [{"permission":"sequence","to":"0x29156F8dFfE8979F49E3a085dbb10477373a6051","description":"Can submit transaction batches or commitments to the SequencerInbox contract on the host chain.","via":[]},{"permission":"upgrade","to":"0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb","via":[{"address":"0x07390626b8Bc2C04b1D93c7D246A0629198D7868"},{"address":"0x74627dd54FA6E94c87F12DBAdAEc275758f51dF9"}]}]
    }
```

```diff
    contract ChallengeManager (0x728B406A4809118533D96bB3b5C50712C99d8Fa5) {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb","via":[{"address":"0x07390626b8Bc2C04b1D93c7D246A0629198D7868"},{"address":"0x74627dd54FA6E94c87F12DBAdAEc275758f51dF9"}]}]
    }
```

```diff
    contract RollupEventInbox (0xFd9f59554351122b231F832a0e0A1aBb0604D7fd) {
    +++ description: Helper contract sending configuration data over the bridge during the systems initialization.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb","via":[{"address":"0x07390626b8Bc2C04b1D93c7D246A0629198D7868"},{"address":"0x74627dd54FA6E94c87F12DBAdAEc275758f51dF9"}]}]
    }
```

Generated with discovered.json: 0x7d2260b1655fc24dcd3ed891d2562eebec649e16

# Diff at Tue, 25 Mar 2025 08:40:37 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@b4a04714c0219993c2a83e7714e82e32f8a106ba block: 21994045
- current block number: 22122787

## Description

Minor upgrade of Bridge, Inbox and SequencerInbox:
- logic for tokens with custom decimals
- 7702 adjustments
- SequencerInbox upgraded to known implementation

## Watched changes

```diff
    contract Inbox (0x672109752635177ebcb17F2C7e04575A709014BD) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      sourceHashes.1:
-        "0x99872d99b7163c705118e0a168f99728c3c7089581779077707271cdaad30be3"
+        "0xa7e3f6c355703ed46fcb2156862c4f01792b87beb10a87a81ce3bd5beee79b67"
      sourceHashes.0:
-        "0xa7e3f6c355703ed46fcb2156862c4f01792b87beb10a87a81ce3bd5beee79b67"
+        "0x84cd273689e720a0b7c657b57d9fb127684f3abb87fc4b337a2f0decd9464120"
      values.$implementation:
-        "0x1162084C3C6575121146582Db5BE43189e8CEe6b"
+        "0xf3830309BdfADcC7eEEF99C2EeA879D5fA6C756C"
      values.$pastUpgrades.1:
+        ["2025-03-24T16:55:11.000Z","0x2ecdabc185a5e5350c23c45cfbf746bd874b272e363729adcf975533d38790b8",["0xf3830309BdfADcC7eEEF99C2EeA879D5fA6C756C"]]
      values.$upgradeCount:
-        1
+        2
    }
```

```diff
    contract SequencerInbox (0x6CA2A628fb690Bd431F4aA608655ce37c66aff9d) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      sourceHashes.0:
-        "0x50cf57b01499408fa99da27cf0fee96ec30f0d40667d1aa090c442bc80f0636b"
+        "0x6bb86ac4bd0d31e049f543fcf0a8f94c952252222f115246ef9d5b8104d803cc"
      values.$implementation:
-        "0x958985cf2c54f99ba4a599221A8090C1F9Cee9A5"
+        "0x734B78823c4d979045EC23F38B54A070df7769FF"
      values.$pastUpgrades.2:
+        ["2024-03-02T11:56:47.000Z","0x63267f7748e36c730d68d06c10ca1a4c32b3177069f6e13fe1a7466486577c09",["0x873484Ba63353C8b71210ce123B465512d408B27"]]
      values.$pastUpgrades.1.2.0:
-        "0x873484Ba63353C8b71210ce123B465512d408B27"
+        "0x958985cf2c54f99ba4a599221A8090C1F9Cee9A5"
      values.$pastUpgrades.1.1:
-        "0x63267f7748e36c730d68d06c10ca1a4c32b3177069f6e13fe1a7466486577c09"
+        "0xaf5b759f18a6b1150b87e3c0e93270201a165763e4f2d42d75bec75ab7f258bf"
      values.$pastUpgrades.1.0:
-        "2024-03-02T11:56:47.000Z"
+        "2024-10-30T09:43:11.000Z"
      values.$pastUpgrades.0.2.0:
-        "0x958985cf2c54f99ba4a599221A8090C1F9Cee9A5"
+        "0x734B78823c4d979045EC23F38B54A070df7769FF"
      values.$pastUpgrades.0.1:
-        "0xaf5b759f18a6b1150b87e3c0e93270201a165763e4f2d42d75bec75ab7f258bf"
+        "2025-03-24T16:55:11.000Z"
      values.$pastUpgrades.0.0:
-        "2024-10-30T09:43:11.000Z"
+        "0x2ecdabc185a5e5350c23c45cfbf746bd874b272e363729adcf975533d38790b8"
      values.$upgradeCount:
-        2
+        3
      values.reader4844:
-        "0x7Deda2425eC2d4EA0DF689A78de2fBF002075576"
+        "0x6c5c9E6c080a6C25f49DfFE85cfA71aaEAAfdE74"
    }
```

## Source code changes

```diff
.../{.flat@21994045 => .flat}/Inbox/Inbox.sol      | 52 +++++++++++++++++-----
 .../SequencerInbox/SequencerInbox.sol              | 24 +++++++---
 2 files changed, 59 insertions(+), 17 deletions(-)
```

Generated with discovered.json: 0xaa1c8668888ac07e901a7e78a33098a57820e9ba

# Diff at Tue, 18 Mar 2025 08:13:41 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@4ef7a8dbcec1cd9fec77aae2b73d81347a4ffb13 block: 21994045
- current block number: 21994045

## Description

Config: change Multisig names.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21994045 (main branch discovery), not current.

```diff
    contract Gelato Multisig (0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb) {
    +++ description: None
      name:
-        "GelatoMultisig"
+        "Gelato Multisig"
    }
```

Generated with discovered.json: 0xef947d67530b610a5eac81c116611e4c7eaef49c

# Diff at Fri, 07 Mar 2025 09:16:08 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@454ef41fea41bcea030780b23fd1f11519ff78d2 block: 21915807
- current block number: 21994045

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21915807 (main branch discovery), not current.

```diff
    contract RollupProxy (0x448Bbd134dE1B23976073aB4F2915849b2dcD73A) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      values.isPostBoLD:
+        false
    }
```

Generated with discovered.json: 0xee68647e742588cdd086f28cb658642873e89f72

# Diff at Thu, 06 Mar 2025 09:39:06 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@7119c715545bc86a4194761f42815f811ac6307a block: 21915807
- current block number: 21915807

## Description

Config related: set severity for arbitrum inbox/outbox changes to high and add historical In- and Outboxes via events.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21915807 (main branch discovery), not current.

```diff
    contract Bridge (0x383c03c4EfF819E73409DbC690755a9992393814) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
+++ description: All Inboxes that were ever set as allowed in the bridge.
+++ severity: HIGH
      values.inboxHistory:
+        ["0x672109752635177ebcb17F2C7e04575A709014BD","0xFd9f59554351122b231F832a0e0A1aBb0604D7fd"]
+++ description: All Outboxes that were ever set as allowed in the bridge.
+++ severity: HIGH
      values.outboxHistory:
+        ["0x3f373b0A7DcEe7b7bCfC16DF85CfAE18388542c9"]
      fieldMeta:
+        {"allowedOutboxList":{"severity":"HIGH","description":"Can make calls as the bridge, steal all funds."},"outboxHistory":{"severity":"HIGH","description":"All Outboxes that were ever set as allowed in the bridge."},"allowedDelayedInboxList":{"severity":"HIGH","description":"Allowed to mint the gastoken on L2 and call `enqueueDelayedMessage()` on the bridge."},"inboxHistory":{"severity":"HIGH","description":"All Inboxes that were ever set as allowed in the bridge."}}
    }
```

Generated with discovered.json: 0xa31d724e7f8fe500c0d0530675083444a389832f

# Diff at Tue, 04 Mar 2025 10:39:41 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@98d260b45fe0d2195ce5e629bd7b200c8706e8ba block: 21915807
- current block number: 21915807

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21915807 (main branch discovery), not current.

```diff
    contract OneStepProverHostIo (0x0003A96B27ce73505b43ea1b71a5aB06bec568C4) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      sinceBlock:
+        20569170
    }
```

```diff
    contract UpgradeExecutor (0x07390626b8Bc2C04b1D93c7D246A0629198D7868) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      sinceBlock:
+        19347324
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
    contract Bridge (0x383c03c4EfF819E73409DbC690755a9992393814) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      sinceBlock:
+        19347324
    }
```

```diff
    contract Outbox (0x3f373b0A7DcEe7b7bCfC16DF85CfAE18388542c9) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
      sinceBlock:
+        19347324
    }
```

```diff
    contract RollupProxy (0x448Bbd134dE1B23976073aB4F2915849b2dcD73A) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      sinceBlock:
+        19347324
    }
```

```diff
    contract Inbox (0x672109752635177ebcb17F2C7e04575A709014BD) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      sinceBlock:
+        19347324
    }
```

```diff
    contract SequencerInbox (0x6CA2A628fb690Bd431F4aA608655ce37c66aff9d) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      sinceBlock:
+        19347324
    }
```

```diff
    contract ChallengeManager (0x728B406A4809118533D96bB3b5C50712C99d8Fa5) {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      sinceBlock:
+        19347324
    }
```

```diff
    contract ProxyAdmin (0x74627dd54FA6E94c87F12DBAdAEc275758f51dF9) {
    +++ description: None
      sinceBlock:
+        19347324
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
    contract SocketVault_Reya (0xdFf78A949E47c1e90f3Dd6dd7Fe2Fa72B42a75f7) {
    +++ description: None
      sinceBlock:
+        19590078
    }
```

```diff
    contract RollupEventInbox (0xFd9f59554351122b231F832a0e0A1aBb0604D7fd) {
    +++ description: Helper contract sending configuration data over the bridge during the systems initialization.
      sinceBlock:
+        19347324
    }
```

Generated with discovered.json: 0x44b83796bfcd3b79b9ce409fa258c5f45f65f69a

# Diff at Mon, 24 Feb 2025 15:37:50 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@cfe18eb30997850b8abc4c6e718cd2a363aa4309 block: 21895157
- current block number: 21915807

## Description

Config: added a single caldera multisig name.

## Watched changes

```diff
    contract RollupProxy (0x448Bbd134dE1B23976073aB4F2915849b2dcD73A) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      issuedPermissions.3:
-        {"permission":"validate","to":"0xC3D92d18c9CcD418A5547C28a5c3be60E694EA3c","description":"Can propose new state roots (called nodes) and challenge state roots on the host chain.","via":[]}
      issuedPermissions.2.to:
-        "0x6106B6480DE82E3eC2680d7c61A9D18d71Bf9122"
+        "0xC3D92d18c9CcD418A5547C28a5c3be60E694EA3c"
+++ description: Increments on each Validator change.
      values.setValidatorCount:
-        2
+        3
      values.validators.1:
-        "0xC3D92d18c9CcD418A5547C28a5c3be60E694EA3c"
      values.validators.0:
-        "0x6106B6480DE82E3eC2680d7c61A9D18d71Bf9122"
+        "0xC3D92d18c9CcD418A5547C28a5c3be60E694EA3c"
    }
```

```diff
    contract SequencerInbox (0x6CA2A628fb690Bd431F4aA608655ce37c66aff9d) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      issuedPermissions.2:
-        {"permission":"upgrade","to":"0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb","via":[{"address":"0x07390626b8Bc2C04b1D93c7D246A0629198D7868"},{"address":"0x74627dd54FA6E94c87F12DBAdAEc275758f51dF9"}]}
      issuedPermissions.1.permission:
-        "sequence"
+        "upgrade"
      issuedPermissions.1.to:
-        "0xf5636Df6f86f31668aeAe9bB8a1C4F0ED147926a"
+        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
      issuedPermissions.1.description:
-        "Can submit transaction batches or commitments to the SequencerInbox contract on the host chain."
      issuedPermissions.1.via.1:
+        {"address":"0x74627dd54FA6E94c87F12DBAdAEc275758f51dF9"}
      issuedPermissions.1.via.0:
+        {"address":"0x07390626b8Bc2C04b1D93c7D246A0629198D7868"}
      values.batchPosters.1:
-        "0xf5636Df6f86f31668aeAe9bB8a1C4F0ED147926a"
      values.setIsBatchPosterCount:
-        2
+        3
    }
```

Generated with discovered.json: 0x145661ca18c1238c9dfd611fe18e1a6967e80761

# Diff at Fri, 21 Feb 2025 13:57:28 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@d219f271711b2cf7a164e3443bead5e4957d13a8 block: 21628402
- current block number: 21895157

## Description

Add operator addresses.
Config related: Set orbit stack contract categories.

## Watched changes

```diff
    contract RollupProxy (0x448Bbd134dE1B23976073aB4F2915849b2dcD73A) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      issuedPermissions.3:
+        {"permission":"validate","to":"0xC3D92d18c9CcD418A5547C28a5c3be60E694EA3c","description":"Can propose new state roots (called nodes) and challenge state roots on the host chain.","via":[]}
+++ description: Increments on each Validator change.
      values.setValidatorCount:
-        1
+        2
      values.stakerCount:
-        1
+        2
      values.validators.1:
+        "0xC3D92d18c9CcD418A5547C28a5c3be60E694EA3c"
    }
```

```diff
    contract SequencerInbox (0x6CA2A628fb690Bd431F4aA608655ce37c66aff9d) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      issuedPermissions.2:
+        {"permission":"upgrade","to":"0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb","via":[{"address":"0x07390626b8Bc2C04b1D93c7D246A0629198D7868"},{"address":"0x74627dd54FA6E94c87F12DBAdAEc275758f51dF9"}]}
      issuedPermissions.1.permission:
-        "upgrade"
+        "sequence"
      issuedPermissions.1.to:
-        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
+        "0xf5636Df6f86f31668aeAe9bB8a1C4F0ED147926a"
      issuedPermissions.1.via.1:
-        {"address":"0x74627dd54FA6E94c87F12DBAdAEc275758f51dF9"}
      issuedPermissions.1.via.0:
-        {"address":"0x07390626b8Bc2C04b1D93c7D246A0629198D7868"}
      issuedPermissions.1.description:
+        "Can submit transaction batches or commitments to the SequencerInbox contract on the host chain."
      issuedPermissions.0.to:
-        "0xf5636Df6f86f31668aeAe9bB8a1C4F0ED147926a"
+        "0x29156F8dFfE8979F49E3a085dbb10477373a6051"
      values.batchPosters.1:
+        "0xf5636Df6f86f31668aeAe9bB8a1C4F0ED147926a"
      values.batchPosters.0:
-        "0xf5636Df6f86f31668aeAe9bB8a1C4F0ED147926a"
+        "0x29156F8dFfE8979F49E3a085dbb10477373a6051"
      values.setIsBatchPosterCount:
-        1
+        2
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21628402 (main branch discovery), not current.

```diff
    contract UpgradeExecutor (0x07390626b8Bc2C04b1D93c7D246A0629198D7868) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      category:
+        {"name":"Governance","priority":3}
    }
```

```diff
    contract Bridge (0x383c03c4EfF819E73409DbC690755a9992393814) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract Outbox (0x3f373b0A7DcEe7b7bCfC16DF85CfAE18388542c9) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
      category:
+        {"name":"Canonical Bridges","priority":2}
    }
```

```diff
    contract RollupProxy (0x448Bbd134dE1B23976073aB4F2915849b2dcD73A) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract Inbox (0x672109752635177ebcb17F2C7e04575A709014BD) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      category:
+        {"name":"Canonical Bridges","priority":2}
    }
```

```diff
    contract SequencerInbox (0x6CA2A628fb690Bd431F4aA608655ce37c66aff9d) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract ChallengeManager (0x728B406A4809118533D96bB3b5C50712C99d8Fa5) {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

Generated with discovered.json: 0xdaf281b3561cfcec994272606aec56db3731d9e0

# Diff at Tue, 04 Feb 2025 12:31:56 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@145553eed7ba44636411ecb25e4099728acd02f9 block: 21628402
- current block number: 21628402

## Description

Rename 'configure' permission to 'interact'

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21628402 (main branch discovery), not current.

```diff
    contract UpgradeExecutor (0x07390626b8Bc2C04b1D93c7D246A0629198D7868) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      directlyReceivedPermissions.1.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract RollupProxy (0x448Bbd134dE1B23976073aB4F2915849b2dcD73A) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      issuedPermissions.0.permission:
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

Generated with discovered.json: 0x7310db765a719305f0e4c61efd0b3f68d6d20fa3

# Diff at Mon, 20 Jan 2025 11:09:59 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@2c8b4f3d9910bb6371be9b4df87b70856e7d8c64 block: 21628402
- current block number: 21628402

## Description

Rerun on the same block number. Applies fixes to permissions and via field. Renames permission's target to to/from.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21628402 (main branch discovery), not current.

```diff
    contract UpgradeExecutor (0x07390626b8Bc2C04b1D93c7D246A0629198D7868) {
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
-        "0x448Bbd134dE1B23976073aB4F2915849b2dcD73A"
      directlyReceivedPermissions.2.from:
+        "0x448Bbd134dE1B23976073aB4F2915849b2dcD73A"
      directlyReceivedPermissions.1.target:
-        "0x448Bbd134dE1B23976073aB4F2915849b2dcD73A"
      directlyReceivedPermissions.1.from:
+        "0x448Bbd134dE1B23976073aB4F2915849b2dcD73A"
      directlyReceivedPermissions.0.target:
-        "0x74627dd54FA6E94c87F12DBAdAEc275758f51dF9"
      directlyReceivedPermissions.0.from:
+        "0x74627dd54FA6E94c87F12DBAdAEc275758f51dF9"
    }
```

```diff
    contract Bridge (0x383c03c4EfF819E73409DbC690755a9992393814) {
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
    contract Outbox (0x3f373b0A7DcEe7b7bCfC16DF85CfAE18388542c9) {
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
    contract RollupProxy (0x448Bbd134dE1B23976073aB4F2915849b2dcD73A) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      issuedPermissions.2.target:
-        "0x6106B6480DE82E3eC2680d7c61A9D18d71Bf9122"
      issuedPermissions.2.to:
+        "0x6106B6480DE82E3eC2680d7c61A9D18d71Bf9122"
      issuedPermissions.2.description:
+        "Can propose new state roots (called nodes) and challenge state roots on the host chain."
      issuedPermissions.1.target:
-        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
      issuedPermissions.1.via.0.delay:
-        0
      issuedPermissions.1.to:
+        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
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
    contract Inbox (0x672109752635177ebcb17F2C7e04575A709014BD) {
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

```diff
    contract SequencerInbox (0x6CA2A628fb690Bd431F4aA608655ce37c66aff9d) {
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
-        "0xf5636Df6f86f31668aeAe9bB8a1C4F0ED147926a"
      issuedPermissions.0.to:
+        "0xf5636Df6f86f31668aeAe9bB8a1C4F0ED147926a"
      issuedPermissions.0.description:
+        "Can submit transaction batches or commitments to the SequencerInbox contract on the host chain."
    }
```

```diff
    contract ChallengeManager (0x728B406A4809118533D96bB3b5C50712C99d8Fa5) {
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
    contract ProxyAdmin (0x74627dd54FA6E94c87F12DBAdAEc275758f51dF9) {
    +++ description: None
      directlyReceivedPermissions.6.target:
-        "0xFd9f59554351122b231F832a0e0A1aBb0604D7fd"
      directlyReceivedPermissions.6.from:
+        "0xFd9f59554351122b231F832a0e0A1aBb0604D7fd"
      directlyReceivedPermissions.5.target:
-        "0x728B406A4809118533D96bB3b5C50712C99d8Fa5"
      directlyReceivedPermissions.5.from:
+        "0x728B406A4809118533D96bB3b5C50712C99d8Fa5"
      directlyReceivedPermissions.4.target:
-        "0x6CA2A628fb690Bd431F4aA608655ce37c66aff9d"
      directlyReceivedPermissions.4.from:
+        "0x6CA2A628fb690Bd431F4aA608655ce37c66aff9d"
      directlyReceivedPermissions.3.target:
-        "0x672109752635177ebcb17F2C7e04575A709014BD"
      directlyReceivedPermissions.3.from:
+        "0x672109752635177ebcb17F2C7e04575A709014BD"
      directlyReceivedPermissions.2.target:
-        "0x3f373b0A7DcEe7b7bCfC16DF85CfAE18388542c9"
      directlyReceivedPermissions.2.from:
+        "0x3f373b0A7DcEe7b7bCfC16DF85CfAE18388542c9"
      directlyReceivedPermissions.1.target:
-        "0x383c03c4EfF819E73409DbC690755a9992393814"
      directlyReceivedPermissions.1.from:
+        "0x383c03c4EfF819E73409DbC690755a9992393814"
      directlyReceivedPermissions.0.target:
-        "0x07390626b8Bc2C04b1D93c7D246A0629198D7868"
      directlyReceivedPermissions.0.from:
+        "0x07390626b8Bc2C04b1D93c7D246A0629198D7868"
    }
```

```diff
    contract GelatoMultisig (0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb) {
    +++ description: None
      receivedPermissions.8.target:
-        "0xFd9f59554351122b231F832a0e0A1aBb0604D7fd"
      receivedPermissions.8.from:
+        "0xFd9f59554351122b231F832a0e0A1aBb0604D7fd"
      receivedPermissions.7.target:
-        "0x728B406A4809118533D96bB3b5C50712C99d8Fa5"
      receivedPermissions.7.from:
+        "0x728B406A4809118533D96bB3b5C50712C99d8Fa5"
      receivedPermissions.6.target:
-        "0x6CA2A628fb690Bd431F4aA608655ce37c66aff9d"
      receivedPermissions.6.from:
+        "0x6CA2A628fb690Bd431F4aA608655ce37c66aff9d"
      receivedPermissions.5.target:
-        "0x672109752635177ebcb17F2C7e04575A709014BD"
      receivedPermissions.5.from:
+        "0x672109752635177ebcb17F2C7e04575A709014BD"
      receivedPermissions.4.target:
-        "0x448Bbd134dE1B23976073aB4F2915849b2dcD73A"
      receivedPermissions.4.from:
+        "0x448Bbd134dE1B23976073aB4F2915849b2dcD73A"
      receivedPermissions.3.target:
-        "0x3f373b0A7DcEe7b7bCfC16DF85CfAE18388542c9"
      receivedPermissions.3.from:
+        "0x3f373b0A7DcEe7b7bCfC16DF85CfAE18388542c9"
      receivedPermissions.2.target:
-        "0x383c03c4EfF819E73409DbC690755a9992393814"
      receivedPermissions.2.from:
+        "0x383c03c4EfF819E73409DbC690755a9992393814"
      receivedPermissions.1.target:
-        "0x07390626b8Bc2C04b1D93c7D246A0629198D7868"
      receivedPermissions.1.from:
+        "0x07390626b8Bc2C04b1D93c7D246A0629198D7868"
      receivedPermissions.0.target:
-        "0x448Bbd134dE1B23976073aB4F2915849b2dcD73A"
      receivedPermissions.0.from:
+        "0x448Bbd134dE1B23976073aB4F2915849b2dcD73A"
      directlyReceivedPermissions.0.target:
-        "0x07390626b8Bc2C04b1D93c7D246A0629198D7868"
      directlyReceivedPermissions.0.from:
+        "0x07390626b8Bc2C04b1D93c7D246A0629198D7868"
    }
```

```diff
    contract RollupEventInbox (0xFd9f59554351122b231F832a0e0A1aBb0604D7fd) {
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

Generated with discovered.json: 0xeb388a79df544ffcc8efb99237802ca8065a3f6b

# Diff at Wed, 15 Jan 2025 07:31:04 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@3ea176aee1470e5ec80e65adfc81a954f84584d8 block: 21465236
- current block number: 21628402

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

Generated with discovered.json: 0x7b954c6e4c525b52b994ec03578e000dfcbdeec5

# Diff at Wed, 08 Jan 2025 10:44:55 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@20bf0eaa1dce373e2c004314fef59d2d1bdf5502 block: 21465236
- current block number: 21465236

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21465236 (main branch discovery), not current.

```diff
    contract Bridge (0x383c03c4EfF819E73409DbC690755a9992393814) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      description:
-        "Escrow contract for the project's gas token (Can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging."
+        "Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging."
    }
```

Generated with discovered.json: 0xa59f09725194cc1921cb9ba6d313792567e420db

# Diff at Mon, 23 Dec 2024 12:38:58 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@18325a975c44684702f30ee366361589e4c2ed8c block: 21428935
- current block number: 21465236

## Description

Config related: Celestia-Nitro wmroot added.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21428935 (main branch discovery), not current.

```diff
    contract RollupProxy (0x448Bbd134dE1B23976073aB4F2915849b2dcD73A) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      usedTypes.0.arg.0xe81f986823a85105c5fd91bb53b4493d38c0c26652d23f76a7405ac889908287:
+        "Celestia Nitro 3.2.1 wasmModuleRoot"
    }
```

Generated with discovered.json: 0x6c2987f2fd2f0d30409924f65b1807ff9fddb32b

# Diff at Wed, 18 Dec 2024 10:51:47 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@a44ef6747febdd9930ef05420e60556c20899f13 block: 21292526
- current block number: 21428935

## Description

Reya socket vault admin transferred to a new EOA (previous was socketadmin.eth, current one is funded by it).

## Watched changes

```diff
    contract SocketVault_Reya (0xdFf78A949E47c1e90f3Dd6dd7Fe2Fa72B42a75f7) {
    +++ description: None
      values.owner:
-        "0x5fD7D0d6b91CC4787Bcb86ca47e0Bd4ea0346d34"
+        "0xB0BBff6311B7F245761A7846d3Ce7B1b100C1836"
    }
```

Generated with discovered.json: 0x3f145b2993136469b9ddeb0b2659975ed948d77d

# Diff at Thu, 05 Dec 2024 11:52:10 GMT:

- author: Piotr Szlachciak (<szlachciak.piotr@gmail.com>)
- comparing to: main@f9ded76f7930b0c86788e4c4595d553b165b87d1 block: 21292526
- current block number: 21292526

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21292526 (main branch discovery), not current.

```diff
    contract ValidatorUtils (0x2b0E04Dc90e3fA58165CB41E2834B44A56E766aF) {
    +++ description: This contract implements view only utilities for validators.
      template:
+        "orbitstack/ValidatorUtils"
      description:
+        "This contract implements view only utilities for validators."
    }
```

Generated with discovered.json: 0x78bb0a854f201947c1cbe05a664be3f3c79df374

# Diff at Fri, 29 Nov 2024 11:28:44 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@9776abb8b1f960f6f1ec6ec27558b5eff7eb5b87 block: 21292526
- current block number: 21292526

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21292526 (main branch discovery), not current.

```diff
    contract UpgradeExecutor (0x07390626b8Bc2C04b1D93c7D246A0629198D7868) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      directlyReceivedPermissions.1.description:
-        "can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
+        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
    }
```

```diff
    contract RollupProxy (0x448Bbd134dE1B23976073aB4F2915849b2dcD73A) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      issuedPermissions.0.via.0.description:
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

Generated with discovered.json: 0xfcee539ad2d662a959db57c1d086a3b541a59e6c

# Diff at Fri, 29 Nov 2024 09:42:32 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@c60f4ba86fcd7b86d6876d1634b83081095f33d7 block: 21272482
- current block number: 21292526

## Description

Config related: remove manual template override.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21272482 (main branch discovery), not current.

```diff
    contract UpgradeExecutor (0x07390626b8Bc2C04b1D93c7D246A0629198D7868) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      directlyReceivedPermissions.1.description:
-        "can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
+        "can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
    }
```

```diff
    contract RollupProxy (0x448Bbd134dE1B23976073aB4F2915849b2dcD73A) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      template:
-        "orbitstack/RollupProxy"
+        "orbitstack/RollupProxy_fastConfirm"
      issuedPermissions.0.via.0.description:
-        "can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
+        "can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
      fieldMeta.minimumAssertionPeriod:
+        {"description":"Minimum time delta between newly created nodes (stateUpdates). This is checked on `stakeOnNewNode()`. Format is number of ETHEREUM blocks, even for L3s. "}
    }
```

```diff
    contract GelatoMultisig (0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb) {
    +++ description: None
      receivedPermissions.0.description:
-        "can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
+        "can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
    }
```

Generated with discovered.json: 0xd26a67eb93204103ffb714847bfd06389cd5368b

# Diff at Wed, 27 Nov 2024 13:22:43 GMT:

- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@3b9391cfe483e60a1853eeae6e47b4de475aac4e block: 21093393
- current block number: 21272482

## Description

Move to discodriven data.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21093393 (main branch discovery), not current.

```diff
    contract ValidatorUtils (0x2b0E04Dc90e3fA58165CB41E2834B44A56E766aF) {
    +++ description: None
      values.REYA_STAKERS:
-        [["0x6106B6480DE82E3eC2680d7c61A9D18d71Bf9122"],false]
    }
```

```diff
    contract SequencerInbox (0x6CA2A628fb690Bd431F4aA608655ce37c66aff9d) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      values.IS_HARDCODED_SEQUENCER_BATCH_POSTER:
-        true
    }
```

Generated with discovered.json: 0x46bce8870224c75062ad367340247e04a5e782ac

# Diff at Fri, 15 Nov 2024 08:18:13 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@a00c2a67d12a174a45864b549412045028598606 block: 21093393
- current block number: 21093393

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21093393 (main branch discovery), not current.

```diff
    contract UpgradeExecutor (0x07390626b8Bc2C04b1D93c7D246A0629198D7868) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      description:
-        "Central contract defining the access control for upgrading the system contract implementations."
+        "Central contract defining the access control permissions for upgrading the system contract implementations."
    }
```

```diff
    contract RollupProxy (0x448Bbd134dE1B23976073aB4F2915849b2dcD73A) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      issuedPermissions.3:
-        {"permission":"upgrade","target":"0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb","via":[{"address":"0x07390626b8Bc2C04b1D93c7D246A0629198D7868","delay":0}]}
      issuedPermissions.2.permission:
-        "propose"
+        "validate"
      issuedPermissions.1.permission:
-        "configure"
+        "upgrade"
      issuedPermissions.1.via.0.description:
-        "can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
      issuedPermissions.0.permission:
-        "challenge"
+        "configure"
      issuedPermissions.0.target:
-        "0x6106B6480DE82E3eC2680d7c61A9D18d71Bf9122"
+        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
      issuedPermissions.0.via.0:
+        {"address":"0x07390626b8Bc2C04b1D93c7D246A0629198D7868","delay":0,"description":"can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."}
    }
```

```diff
    contract Inbox (0x672109752635177ebcb17F2C7e04575A709014BD) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      template:
+        "orbitstack/Inbox"
      description:
+        "Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds."
    }
```

```diff
    contract SequencerInbox (0x6CA2A628fb690Bd431F4aA608655ce37c66aff9d) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      fieldMeta.maxTimeVariation.description:
-        "Settable by the Rollup Owner. Transactions can only be force-included after `delayBlocks` window (Sequencer-only) has passed."
+        "Settable by the Rollup Owner. Transactions can only be force-included after the `delayBlocks` window (Sequencer-only) has passed."
    }
```

```diff
    contract RollupEventInbox (0xFd9f59554351122b231F832a0e0A1aBb0604D7fd) {
    +++ description: Helper contract sending configuration data over the bridge during the systems initialization.
      template:
+        "orbitstack/RollupEventInbox"
      description:
+        "Helper contract sending configuration data over the bridge during the systems initialization."
    }
```

Generated with discovered.json: 0x1eaf37f8c9d27a9abfb6faa4a6f2bfe4c509849a

# Diff at Mon, 04 Nov 2024 07:59:54 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@950c85bf556f084c302d2b03100375cf3c7ed376 block: 21093393
- current block number: 21093393

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21093393 (main branch discovery), not current.

```diff
    contract UpgradeExecutor (0x07390626b8Bc2C04b1D93c7D246A0629198D7868) {
    +++ description: Central contract defining the access control for upgrading the system contract implementations.
      directlyReceivedPermissions.2:
+        {"permission":"upgrade","target":"0x448Bbd134dE1B23976073aB4F2915849b2dcD73A"}
      directlyReceivedPermissions.1.permission:
-        "upgrade"
+        "configure"
      directlyReceivedPermissions.1.description:
+        "can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
    }
```

```diff
    contract RollupProxy (0x448Bbd134dE1B23976073aB4F2915849b2dcD73A) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      issuedPermissions.3:
+        {"permission":"upgrade","target":"0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb","via":[{"address":"0x07390626b8Bc2C04b1D93c7D246A0629198D7868","delay":0}]}
      issuedPermissions.2.permission:
-        "upgrade"
+        "propose"
      issuedPermissions.2.target:
-        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
+        "0x6106B6480DE82E3eC2680d7c61A9D18d71Bf9122"
      issuedPermissions.2.via.0:
-        {"address":"0x07390626b8Bc2C04b1D93c7D246A0629198D7868","delay":0}
      issuedPermissions.1.permission:
-        "propose"
+        "configure"
      issuedPermissions.1.target:
-        "0x6106B6480DE82E3eC2680d7c61A9D18d71Bf9122"
+        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
      issuedPermissions.1.via.0:
+        {"address":"0x07390626b8Bc2C04b1D93c7D246A0629198D7868","delay":0,"description":"can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."}
    }
```

```diff
    contract SequencerInbox (0x6CA2A628fb690Bd431F4aA608655ce37c66aff9d) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
+++ description: Settable by the Rollup Owner. Transactions can only be force-included after `delayBlocks` window (Sequencer-only) has passed.
      values.maxTimeVariation:
-        [5760,48,86400,3600]
+        {"delayBlocks":5760,"futureBlocks":48,"delaySeconds":86400,"futureSeconds":3600}
      values.postsBlobs:
+        false
      fieldMeta.maxTimeVariation.description:
-        "Struct: delayBlocks, futureBlocks, delaySeconds, futureSeconds. onlyRollupOwner settable. Transactions can only be force-included after `delayBlocks` window (Sequencer-only) has passed."
+        "Settable by the Rollup Owner. Transactions can only be force-included after `delayBlocks` window (Sequencer-only) has passed."
    }
```

```diff
    contract GelatoMultisig (0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb) {
    +++ description: None
      receivedPermissions.8:
+        {"permission":"upgrade","target":"0xFd9f59554351122b231F832a0e0A1aBb0604D7fd","via":[{"address":"0x74627dd54FA6E94c87F12DBAdAEc275758f51dF9"},{"address":"0x07390626b8Bc2C04b1D93c7D246A0629198D7868"}]}
      receivedPermissions.7.target:
-        "0xFd9f59554351122b231F832a0e0A1aBb0604D7fd"
+        "0x728B406A4809118533D96bB3b5C50712C99d8Fa5"
      receivedPermissions.6.target:
-        "0x728B406A4809118533D96bB3b5C50712C99d8Fa5"
+        "0x6CA2A628fb690Bd431F4aA608655ce37c66aff9d"
      receivedPermissions.5.target:
-        "0x6CA2A628fb690Bd431F4aA608655ce37c66aff9d"
+        "0x672109752635177ebcb17F2C7e04575A709014BD"
      receivedPermissions.4.target:
-        "0x672109752635177ebcb17F2C7e04575A709014BD"
+        "0x448Bbd134dE1B23976073aB4F2915849b2dcD73A"
      receivedPermissions.4.via.1:
-        {"address":"0x07390626b8Bc2C04b1D93c7D246A0629198D7868"}
      receivedPermissions.4.via.0.address:
-        "0x74627dd54FA6E94c87F12DBAdAEc275758f51dF9"
+        "0x07390626b8Bc2C04b1D93c7D246A0629198D7868"
      receivedPermissions.3.target:
-        "0x448Bbd134dE1B23976073aB4F2915849b2dcD73A"
+        "0x3f373b0A7DcEe7b7bCfC16DF85CfAE18388542c9"
      receivedPermissions.3.via.1:
+        {"address":"0x07390626b8Bc2C04b1D93c7D246A0629198D7868"}
      receivedPermissions.3.via.0.address:
-        "0x07390626b8Bc2C04b1D93c7D246A0629198D7868"
+        "0x74627dd54FA6E94c87F12DBAdAEc275758f51dF9"
      receivedPermissions.2.target:
-        "0x3f373b0A7DcEe7b7bCfC16DF85CfAE18388542c9"
+        "0x383c03c4EfF819E73409DbC690755a9992393814"
      receivedPermissions.1.target:
-        "0x383c03c4EfF819E73409DbC690755a9992393814"
+        "0x07390626b8Bc2C04b1D93c7D246A0629198D7868"
      receivedPermissions.0.permission:
-        "upgrade"
+        "configure"
      receivedPermissions.0.target:
-        "0x07390626b8Bc2C04b1D93c7D246A0629198D7868"
+        "0x448Bbd134dE1B23976073aB4F2915849b2dcD73A"
      receivedPermissions.0.via.1:
-        {"address":"0x07390626b8Bc2C04b1D93c7D246A0629198D7868"}
      receivedPermissions.0.via.0.address:
-        "0x74627dd54FA6E94c87F12DBAdAEc275758f51dF9"
+        "0x07390626b8Bc2C04b1D93c7D246A0629198D7868"
      receivedPermissions.0.description:
+        "can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
    }
```

Generated with discovered.json: 0x5c3c0158902a691c86d660bd642d517b54fa6b06

# Diff at Fri, 01 Nov 2024 14:28:56 GMT:

- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@cd1f0e71bb08ce16b2084a11b768538e8aa6ba8c block: 21078427
- current block number: 21093393

## Description

Upgrades to the latest [ArbOS v32](https://docs.arbitrum.io/run-arbitrum-node/arbos-releases/arbos32).

## Watched changes

```diff
-   Status: DELETED
    contract OneStepProverHostIo (0x17e7F68ce50A77e55C7834ddF31AEf86403B8010)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
    contract RollupProxy (0x448Bbd134dE1B23976073aB4F2915849b2dcD73A) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      sourceHashes.2:
-        "0xef94a66bd5339efd18fb9ca1f8031482e7ef7bbe6c5a0a10fae254ab83712406"
+        "0x7ee21b18b2e18c636bfafc08ff72692cc43302b2599ba75f0abad67282866dd5"
      sourceHashes.1:
-        "0x8b48118fe606012c0dcac2ccc1821785935aec89fab8f219f47b32c482b0017e"
+        "0x9349e73cbc2d2b818c1d79711574ba210b56249d8d3845bc78c776caf8f8ff42"
      values.$implementation.1:
-        "0x660ea1675F7323dC3Ba0c8dDFB593225Eb01E3C1"
+        "0x5607Ea4b5F6e3F610bD346B36D3143FFf46d1C34"
      values.$implementation.0:
-        "0x0aE4dD666748bF0F6dB5c149Eab1D8aD27820A6A"
+        "0x9B56A789fEDD5df27dBaB53b085F7157397cA17D"
      values.$pastUpgrades.1:
+        ["2024-10-30T18:24:35.000Z","0xf18555dd5a5c4707f15cd5aa6dedd147bc01eb9212ff4d0e2751fc8ee97f8761",["0x9B56A789fEDD5df27dBaB53b085F7157397cA17D","0x5607Ea4b5F6e3F610bD346B36D3143FFf46d1C34"]]
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
    contract OneStepProofEntry (0x57EA090Ac0554d174AE0e2855B460e84A1A7C221)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
    contract ChallengeManager (0x728B406A4809118533D96bB3b5C50712C99d8Fa5) {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      sourceHashes.1:
-        "0x58a6261c83c2766f749641902ad6fdb695ea189d2747f073b57a8f35b9a547e5"
+        "0x1a095768302d7d1c3d02375eaa3341833b4f1aaac707e1c608bce478c87cbf27"
      values.$implementation:
-        "0x1D901DD7A5eFE421C3C437B147040E5AF22E6A43"
+        "0x02E05A9245C5853f895daDcc3A8216C953C8736B"
      values.$pastUpgrades.2:
+        ["2024-10-30T18:24:35.000Z","0xf18555dd5a5c4707f15cd5aa6dedd147bc01eb9212ff4d0e2751fc8ee97f8761",["0x02E05A9245C5853f895daDcc3A8216C953C8736B"]]
      values.$upgradeCount:
-        2
+        3
      values.osp:
-        "0x57EA090Ac0554d174AE0e2855B460e84A1A7C221"
+        "0x8Faa21891B0b928afEbd5314D1D313f8f7B34DaC"
    }
```

```diff
-   Status: DELETED
    contract OneStepProver0 (0x72B166070781a552D7b95a907eF59ca05d3D5a62)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
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

## Source code changes

```diff
.../ChallengeManager/ChallengeManager.sol          | 404 ++++++----
 .../OneStepProofEntry.sol                          | 485 +++++++++--
 .../{.flat@21078427 => .flat}/OneStepProver0.sol   | 765 +++++++++++++-----
 .../OneStepProverHostIo.sol                        | 892 +++++++++++++++++----
 .../OneStepProverMath.sol                          |  65 +-
 .../OneStepProverMemory.sol                        | 315 ++++++--
 .../RollupProxy/RollupAdminLogic.1.sol             | 370 ++++++---
 .../RollupProxy/RollupUserLogic.2.sol              | 415 ++++++----
 8 files changed, 2766 insertions(+), 945 deletions(-)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21078427 (main branch discovery), not current.

```diff
    contract Bridge (0x383c03c4EfF819E73409DbC690755a9992393814) {
    +++ description: Escrow contract for the project's gas token (Can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      template:
+        "orbitstack/Bridge"
      description:
+        "Escrow contract for the project's gas token (Can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging."
    }
```

```diff
    contract Outbox (0x3f373b0A7DcEe7b7bCfC16DF85CfAE18388542c9) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
      template:
+        "orbitstack/Outbox"
      description:
+        "Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1."
    }
```

Generated with discovered.json: 0x91b0498fe30527bd75d10dfad5f2ae13f377f146

# Diff at Wed, 30 Oct 2024 12:22:51 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@0a8a53530022c6c5edd257c3682a3e7f80d0c550 block: 21041865
- current block number: 21078427

## Description

Upgrade to ArbOS v20 on known L1 contracts and GelatoMultisig changes.

## Watched changes

```diff
-   Status: DELETED
    contract OneStepProofEntry (0x09824fe72BFF474d16D9c2774432E381BBD60662)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
    contract RollupProxy (0x448Bbd134dE1B23976073aB4F2915849b2dcD73A) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
+++ description: ArbOS version derived from known wasmModuleRoots.
      values.arbOsFromWmRoot:
-        "ArbOS v11 wasmModuleRoot"
+        "ArbOS v20 wasmModuleRoot"
+++ description: Root hash of the WASM module used for execution, like a fingerprint of the L2 logic. Can be associated with ArbOS versions.
      values.wasmModuleRoot:
-        "0xf4389b835497a910d7ba3ebfb77aa93da985634f3c052de1290360635be40c4a"
+        "0x8b104a2e80ac6165dc58b9048de12f301d70b02a0ab51396c22b4b4b802a16a4"
    }
```

```diff
-   Status: DELETED
    contract OneStepProverMemory (0x4811500e0d376Fa8d2EA3CCb7c61E0afB4F5A7f1)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
    contract SequencerInbox (0x6CA2A628fb690Bd431F4aA608655ce37c66aff9d) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      sourceHashes.1:
-        "0x08792f333db7e8a060c38033f92e3fc10c30e2648c56fc49c7460ee1c94343a0"
+        "0x50cf57b01499408fa99da27cf0fee96ec30f0d40667d1aa090c442bc80f0636b"
      values.$implementation:
-        "0x873484Ba63353C8b71210ce123B465512d408B27"
+        "0x958985cf2c54f99ba4a599221A8090C1F9Cee9A5"
      values.$pastUpgrades.1:
+        ["2024-10-30T09:43:11.000Z","0xaf5b759f18a6b1150b87e3c0e93270201a165763e4f2d42d75bec75ab7f258bf",["0x958985cf2c54f99ba4a599221A8090C1F9Cee9A5"]]
      values.$upgradeCount:
-        1
+        2
+++ description: Struct: delayBlocks, futureBlocks, delaySeconds, futureSeconds. onlyRollupOwner settable. Transactions can only be force-included after `delayBlocks` window (Sequencer-only) has passed.
      values.maxTimeVariation:
-        {"delayBlocks":5760,"futureBlocks":48,"delaySeconds":86400,"futureSeconds":3600}
+        [5760,48,86400,3600]
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
+        "0x7Deda2425eC2d4EA0DF689A78de2fBF002075576"
      values.TREE_DAS_MESSAGE_HEADER_FLAG:
+        "0x08"
      values.ZERO_HEAVY_MESSAGE_HEADER_FLAG:
+        "0x20"
      template:
+        "orbitstack/SequencerInbox"
      description:
+        "A sequencer (registered in this contract) can submit transaction batches or commitments here."
      fieldMeta:
+        {"maxTimeVariation":{"description":"Struct: delayBlocks, futureBlocks, delaySeconds, futureSeconds. onlyRollupOwner settable. Transactions can only be force-included after `delayBlocks` window (Sequencer-only) has passed."}}
    }
```

```diff
    contract ChallengeManager (0x728B406A4809118533D96bB3b5C50712C99d8Fa5) {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      sourceHashes.1:
-        "0x7e1cd1e10119e118ffaa576ddbe1c0f9810a0859a4bf2f65a4ff596c0ed4183d"
+        "0x58a6261c83c2766f749641902ad6fdb695ea189d2747f073b57a8f35b9a547e5"
      values.$implementation:
-        "0xEe9E5546A11Cb5b4A86e92DA05f2ef75C26E4754"
+        "0x1D901DD7A5eFE421C3C437B147040E5AF22E6A43"
      values.$pastUpgrades.1:
+        ["2024-10-30T09:43:11.000Z","0xaf5b759f18a6b1150b87e3c0e93270201a165763e4f2d42d75bec75ab7f258bf",["0x1D901DD7A5eFE421C3C437B147040E5AF22E6A43"]]
      values.$upgradeCount:
-        1
+        2
      values.osp:
-        "0x09824fe72BFF474d16D9c2774432E381BBD60662"
+        "0x57EA090Ac0554d174AE0e2855B460e84A1A7C221"
      template:
+        "orbitstack/ChallengeManager"
      description:
+        "Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor."
    }
```

```diff
-   Status: DELETED
    contract OneStepProverMath (0x89AF7C4C2198c426cFe6E86de0680A0850503e06)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
-   Status: DELETED
    contract OneStepProverHostIo (0x99a2A31300816C1FA3f40818AC9280fe7271F878)
    +++ description: None
```

```diff
    contract GelatoMultisig (0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb) {
    +++ description: None
      values.$members.8:
-        "0x547D0F472309e4239b296D01e03bEDc101241a26"
      values.$members.7:
-        "0xf83bC4688979b13Da02CB94c76cEB169540760b5"
+        "0x547D0F472309e4239b296D01e03bEDc101241a26"
      values.$members.6:
-        "0x01a0A7BaAAca31AFB5b770FeFD69CE4917D9c32e"
+        "0xf83bC4688979b13Da02CB94c76cEB169540760b5"
      values.$members.5:
-        "0xc85aC6d2fdC376F335455D4cCA30c45ED1080849"
+        "0x01a0A7BaAAca31AFB5b770FeFD69CE4917D9c32e"
      values.$threshold:
-        6
+        4
      values.multisigThreshold:
-        "6 of 9 (67%)"
+        "4 of 8 (50%)"
    }
```

```diff
-   Status: DELETED
    contract OneStepProver0 (0xDf94F0474F205D086dbc2e66D69a856FCf520622)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract OneStepProverHostIo (0x17e7F68ce50A77e55C7834ddF31AEf86403B8010)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract OneStepProofEntry (0x57EA090Ac0554d174AE0e2855B460e84A1A7C221)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract OneStepProver0 (0x72B166070781a552D7b95a907eF59ca05d3D5a62)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract OneStepProverMemory (0x8b73Ef238ADaB31EBC7c05423d243c345241a22f)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract OneStepProverMath (0x90eC62De2EB7C7512a22bD2D55926AD6bA609F38)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

## Source code changes

```diff
.../ChallengeManager/ChallengeManager.sol          |   6 +
 .../OneStepProverHostIo.sol                        | 107 +++-
 .../SequencerInbox/SequencerInbox.sol              | 662 ++++++++++++++++-----
 3 files changed, 611 insertions(+), 164 deletions(-)
```

Generated with discovered.json: 0x90e69e2f8f2a2d81d93c580110ff644beff9f7ac

# Diff at Tue, 29 Oct 2024 13:17:10 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@7b3fc9dc9074e1d423b48522c3f0273c86aab54a block: 21041865
- current block number: 21041865

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21041865 (main branch discovery), not current.

```diff
    contract RollupProxy (0x448Bbd134dE1B23976073aB4F2915849b2dcD73A) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      fieldMeta.confirmPeriodBlocks.description:
-        "Challenge period. (Number of blocks until a node is confirmed)."
+        "Challenge period. (Number of ETHEREUM blocks until a node is confirmed, even for L3s)."
    }
```

Generated with discovered.json: 0xb09324f69274ac7984a81ea7a43c65482f420e75

# Diff at Tue, 29 Oct 2024 08:06:01 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@dd2750779d294ea31d352eac7a7f2e0e655f6440 block: 21041865
- current block number: 21041865

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21041865 (main branch discovery), not current.

```diff
    contract UpgradeExecutor (0x07390626b8Bc2C04b1D93c7D246A0629198D7868) {
    +++ description: Central contract defining the access control for upgrading the system contract implementations.
      issuedPermissions.0.target:
-        "0x07390626b8Bc2C04b1D93c7D246A0629198D7868"
+        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
      issuedPermissions.0.via.1:
+        {"address":"0x74627dd54FA6E94c87F12DBAdAEc275758f51dF9","delay":0}
      issuedPermissions.0.via.0.address:
-        "0x74627dd54FA6E94c87F12DBAdAEc275758f51dF9"
+        "0x07390626b8Bc2C04b1D93c7D246A0629198D7868"
      receivedPermissions:
-        [{"permission":"upgrade","target":"0x07390626b8Bc2C04b1D93c7D246A0629198D7868","via":[{"address":"0x74627dd54FA6E94c87F12DBAdAEc275758f51dF9"}]},{"permission":"upgrade","target":"0x383c03c4EfF819E73409DbC690755a9992393814","via":[{"address":"0x74627dd54FA6E94c87F12DBAdAEc275758f51dF9"}]},{"permission":"upgrade","target":"0x3f373b0A7DcEe7b7bCfC16DF85CfAE18388542c9","via":[{"address":"0x74627dd54FA6E94c87F12DBAdAEc275758f51dF9"}]},{"permission":"upgrade","target":"0x448Bbd134dE1B23976073aB4F2915849b2dcD73A"},{"permission":"upgrade","target":"0x672109752635177ebcb17F2C7e04575A709014BD","via":[{"address":"0x74627dd54FA6E94c87F12DBAdAEc275758f51dF9"}]},{"permission":"upgrade","target":"0x6CA2A628fb690Bd431F4aA608655ce37c66aff9d","via":[{"address":"0x74627dd54FA6E94c87F12DBAdAEc275758f51dF9"}]},{"permission":"upgrade","target":"0x728B406A4809118533D96bB3b5C50712C99d8Fa5","via":[{"address":"0x74627dd54FA6E94c87F12DBAdAEc275758f51dF9"}]},{"permission":"upgrade","target":"0xFd9f59554351122b231F832a0e0A1aBb0604D7fd","via":[{"address":"0x74627dd54FA6E94c87F12DBAdAEc275758f51dF9"}]}]
      directlyReceivedPermissions.1:
+        {"permission":"upgrade","target":"0x448Bbd134dE1B23976073aB4F2915849b2dcD73A"}
    }
```

```diff
    contract Bridge (0x383c03c4EfF819E73409DbC690755a9992393814) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x07390626b8Bc2C04b1D93c7D246A0629198D7868"
+        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
      issuedPermissions.0.via.1:
+        {"address":"0x74627dd54FA6E94c87F12DBAdAEc275758f51dF9","delay":0}
      issuedPermissions.0.via.0.address:
-        "0x74627dd54FA6E94c87F12DBAdAEc275758f51dF9"
+        "0x07390626b8Bc2C04b1D93c7D246A0629198D7868"
    }
```

```diff
    contract Outbox (0x3f373b0A7DcEe7b7bCfC16DF85CfAE18388542c9) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x07390626b8Bc2C04b1D93c7D246A0629198D7868"
+        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
      issuedPermissions.0.via.1:
+        {"address":"0x74627dd54FA6E94c87F12DBAdAEc275758f51dF9","delay":0}
      issuedPermissions.0.via.0.address:
-        "0x74627dd54FA6E94c87F12DBAdAEc275758f51dF9"
+        "0x07390626b8Bc2C04b1D93c7D246A0629198D7868"
    }
```

```diff
    contract RollupProxy (0x448Bbd134dE1B23976073aB4F2915849b2dcD73A) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      issuedPermissions.2.target:
-        "0x07390626b8Bc2C04b1D93c7D246A0629198D7868"
+        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
      issuedPermissions.2.via.0:
+        {"address":"0x07390626b8Bc2C04b1D93c7D246A0629198D7868","delay":0}
    }
```

```diff
    contract Inbox (0x672109752635177ebcb17F2C7e04575A709014BD) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x07390626b8Bc2C04b1D93c7D246A0629198D7868"
+        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
      issuedPermissions.0.via.1:
+        {"address":"0x74627dd54FA6E94c87F12DBAdAEc275758f51dF9","delay":0}
      issuedPermissions.0.via.0.address:
-        "0x74627dd54FA6E94c87F12DBAdAEc275758f51dF9"
+        "0x07390626b8Bc2C04b1D93c7D246A0629198D7868"
    }
```

```diff
    contract SequencerInbox (0x6CA2A628fb690Bd431F4aA608655ce37c66aff9d) {
    +++ description: None
      issuedPermissions.1.target:
-        "0x07390626b8Bc2C04b1D93c7D246A0629198D7868"
+        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
      issuedPermissions.1.via.1:
+        {"address":"0x74627dd54FA6E94c87F12DBAdAEc275758f51dF9","delay":0}
      issuedPermissions.1.via.0.address:
-        "0x74627dd54FA6E94c87F12DBAdAEc275758f51dF9"
+        "0x07390626b8Bc2C04b1D93c7D246A0629198D7868"
    }
```

```diff
    contract ChallengeManager (0x728B406A4809118533D96bB3b5C50712C99d8Fa5) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x07390626b8Bc2C04b1D93c7D246A0629198D7868"
+        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
      issuedPermissions.0.via.1:
+        {"address":"0x74627dd54FA6E94c87F12DBAdAEc275758f51dF9","delay":0}
      issuedPermissions.0.via.0.address:
-        "0x74627dd54FA6E94c87F12DBAdAEc275758f51dF9"
+        "0x07390626b8Bc2C04b1D93c7D246A0629198D7868"
    }
```

```diff
    contract GelatoMultisig (0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb) {
    +++ description: None
      receivedPermissions:
+        [{"permission":"upgrade","target":"0x07390626b8Bc2C04b1D93c7D246A0629198D7868","via":[{"address":"0x74627dd54FA6E94c87F12DBAdAEc275758f51dF9"},{"address":"0x07390626b8Bc2C04b1D93c7D246A0629198D7868"}]},{"permission":"upgrade","target":"0x383c03c4EfF819E73409DbC690755a9992393814","via":[{"address":"0x74627dd54FA6E94c87F12DBAdAEc275758f51dF9"},{"address":"0x07390626b8Bc2C04b1D93c7D246A0629198D7868"}]},{"permission":"upgrade","target":"0x3f373b0A7DcEe7b7bCfC16DF85CfAE18388542c9","via":[{"address":"0x74627dd54FA6E94c87F12DBAdAEc275758f51dF9"},{"address":"0x07390626b8Bc2C04b1D93c7D246A0629198D7868"}]},{"permission":"upgrade","target":"0x448Bbd134dE1B23976073aB4F2915849b2dcD73A","via":[{"address":"0x07390626b8Bc2C04b1D93c7D246A0629198D7868"}]},{"permission":"upgrade","target":"0x672109752635177ebcb17F2C7e04575A709014BD","via":[{"address":"0x74627dd54FA6E94c87F12DBAdAEc275758f51dF9"},{"address":"0x07390626b8Bc2C04b1D93c7D246A0629198D7868"}]},{"permission":"upgrade","target":"0x6CA2A628fb690Bd431F4aA608655ce37c66aff9d","via":[{"address":"0x74627dd54FA6E94c87F12DBAdAEc275758f51dF9"},{"address":"0x07390626b8Bc2C04b1D93c7D246A0629198D7868"}]},{"permission":"upgrade","target":"0x728B406A4809118533D96bB3b5C50712C99d8Fa5","via":[{"address":"0x74627dd54FA6E94c87F12DBAdAEc275758f51dF9"},{"address":"0x07390626b8Bc2C04b1D93c7D246A0629198D7868"}]},{"permission":"upgrade","target":"0xFd9f59554351122b231F832a0e0A1aBb0604D7fd","via":[{"address":"0x74627dd54FA6E94c87F12DBAdAEc275758f51dF9"},{"address":"0x07390626b8Bc2C04b1D93c7D246A0629198D7868"}]}]
      directlyReceivedPermissions:
+        [{"permission":"act","target":"0x07390626b8Bc2C04b1D93c7D246A0629198D7868"}]
    }
```

```diff
    contract RollupEventInbox (0xFd9f59554351122b231F832a0e0A1aBb0604D7fd) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x07390626b8Bc2C04b1D93c7D246A0629198D7868"
+        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
      issuedPermissions.0.via.1:
+        {"address":"0x74627dd54FA6E94c87F12DBAdAEc275758f51dF9","delay":0}
      issuedPermissions.0.via.0.address:
-        "0x74627dd54FA6E94c87F12DBAdAEc275758f51dF9"
+        "0x07390626b8Bc2C04b1D93c7D246A0629198D7868"
    }
```

Generated with discovered.json: 0x9e444735606458be3481c039f4dfeac2d7b79df1

# Diff at Mon, 28 Oct 2024 14:05:44 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@846d03afee15838cf7b18315c02ebdb6a2071f6c block: 21041865
- current block number: 21041865

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21041865 (main branch discovery), not current.

```diff
    contract UpgradeExecutor (0x07390626b8Bc2C04b1D93c7D246A0629198D7868) {
    +++ description: Central contract defining the access control for upgrading the system contract implementations.
      values.executors:
+        ["0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"]
    }
```

Generated with discovered.json: 0xcc957b289044db4b82ce0eeb62d30473f8cf1529

# Diff at Fri, 25 Oct 2024 09:55:08 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@e7501f424c0cea9b5438386ee76e509448999836 block: 20941807
- current block number: 21041865

## Description

Config related.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20941807 (main branch discovery), not current.

```diff
    contract UpgradeExecutor (0x07390626b8Bc2C04b1D93c7D246A0629198D7868) {
    +++ description: Central contract defining the access control for upgrading the system contract implementations.
      issuedPermissions.0.target:
-        "0x74627dd54FA6E94c87F12DBAdAEc275758f51dF9"
+        "0x07390626b8Bc2C04b1D93c7D246A0629198D7868"
      issuedPermissions.0.via.0:
+        {"address":"0x74627dd54FA6E94c87F12DBAdAEc275758f51dF9","delay":0}
      receivedPermissions.7:
+        {"permission":"upgrade","target":"0xFd9f59554351122b231F832a0e0A1aBb0604D7fd","via":[{"address":"0x74627dd54FA6E94c87F12DBAdAEc275758f51dF9"}]}
      receivedPermissions.6:
+        {"permission":"upgrade","target":"0x728B406A4809118533D96bB3b5C50712C99d8Fa5","via":[{"address":"0x74627dd54FA6E94c87F12DBAdAEc275758f51dF9"}]}
      receivedPermissions.5:
+        {"permission":"upgrade","target":"0x6CA2A628fb690Bd431F4aA608655ce37c66aff9d","via":[{"address":"0x74627dd54FA6E94c87F12DBAdAEc275758f51dF9"}]}
      receivedPermissions.4:
+        {"permission":"upgrade","target":"0x672109752635177ebcb17F2C7e04575A709014BD","via":[{"address":"0x74627dd54FA6E94c87F12DBAdAEc275758f51dF9"}]}
      receivedPermissions.3:
+        {"permission":"upgrade","target":"0x448Bbd134dE1B23976073aB4F2915849b2dcD73A"}
      receivedPermissions.2:
+        {"permission":"upgrade","target":"0x3f373b0A7DcEe7b7bCfC16DF85CfAE18388542c9","via":[{"address":"0x74627dd54FA6E94c87F12DBAdAEc275758f51dF9"}]}
      receivedPermissions.1:
+        {"permission":"upgrade","target":"0x383c03c4EfF819E73409DbC690755a9992393814","via":[{"address":"0x74627dd54FA6E94c87F12DBAdAEc275758f51dF9"}]}
      receivedPermissions.0.target:
-        "0x448Bbd134dE1B23976073aB4F2915849b2dcD73A"
+        "0x07390626b8Bc2C04b1D93c7D246A0629198D7868"
      receivedPermissions.0.via:
+        [{"address":"0x74627dd54FA6E94c87F12DBAdAEc275758f51dF9"}]
      directlyReceivedPermissions:
+        [{"permission":"act","target":"0x74627dd54FA6E94c87F12DBAdAEc275758f51dF9"}]
    }
```

```diff
    contract Bridge (0x383c03c4EfF819E73409DbC690755a9992393814) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x74627dd54FA6E94c87F12DBAdAEc275758f51dF9"
+        "0x07390626b8Bc2C04b1D93c7D246A0629198D7868"
      issuedPermissions.0.via.0:
+        {"address":"0x74627dd54FA6E94c87F12DBAdAEc275758f51dF9","delay":0}
    }
```

```diff
    contract Outbox (0x3f373b0A7DcEe7b7bCfC16DF85CfAE18388542c9) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x74627dd54FA6E94c87F12DBAdAEc275758f51dF9"
+        "0x07390626b8Bc2C04b1D93c7D246A0629198D7868"
      issuedPermissions.0.via.0:
+        {"address":"0x74627dd54FA6E94c87F12DBAdAEc275758f51dF9","delay":0}
    }
```

```diff
    contract Inbox (0x672109752635177ebcb17F2C7e04575A709014BD) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x74627dd54FA6E94c87F12DBAdAEc275758f51dF9"
+        "0x07390626b8Bc2C04b1D93c7D246A0629198D7868"
      issuedPermissions.0.via.0:
+        {"address":"0x74627dd54FA6E94c87F12DBAdAEc275758f51dF9","delay":0}
    }
```

```diff
    contract SequencerInbox (0x6CA2A628fb690Bd431F4aA608655ce37c66aff9d) {
    +++ description: None
      issuedPermissions.1.target:
-        "0x74627dd54FA6E94c87F12DBAdAEc275758f51dF9"
+        "0x07390626b8Bc2C04b1D93c7D246A0629198D7868"
      issuedPermissions.1.via.0:
+        {"address":"0x74627dd54FA6E94c87F12DBAdAEc275758f51dF9","delay":0}
    }
```

```diff
    contract ChallengeManager (0x728B406A4809118533D96bB3b5C50712C99d8Fa5) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x74627dd54FA6E94c87F12DBAdAEc275758f51dF9"
+        "0x07390626b8Bc2C04b1D93c7D246A0629198D7868"
      issuedPermissions.0.via.0:
+        {"address":"0x74627dd54FA6E94c87F12DBAdAEc275758f51dF9","delay":0}
    }
```

```diff
    contract ProxyAdmin (0x74627dd54FA6E94c87F12DBAdAEc275758f51dF9) {
    +++ description: None
      receivedPermissions:
-        [{"permission":"upgrade","target":"0x07390626b8Bc2C04b1D93c7D246A0629198D7868"},{"permission":"upgrade","target":"0x383c03c4EfF819E73409DbC690755a9992393814"},{"permission":"upgrade","target":"0x3f373b0A7DcEe7b7bCfC16DF85CfAE18388542c9"},{"permission":"upgrade","target":"0x672109752635177ebcb17F2C7e04575A709014BD"},{"permission":"upgrade","target":"0x6CA2A628fb690Bd431F4aA608655ce37c66aff9d"},{"permission":"upgrade","target":"0x728B406A4809118533D96bB3b5C50712C99d8Fa5"},{"permission":"upgrade","target":"0xFd9f59554351122b231F832a0e0A1aBb0604D7fd"}]
      template:
+        "global/ProxyAdmin"
      directlyReceivedPermissions:
+        [{"permission":"upgrade","target":"0x07390626b8Bc2C04b1D93c7D246A0629198D7868"},{"permission":"upgrade","target":"0x383c03c4EfF819E73409DbC690755a9992393814"},{"permission":"upgrade","target":"0x3f373b0A7DcEe7b7bCfC16DF85CfAE18388542c9"},{"permission":"upgrade","target":"0x672109752635177ebcb17F2C7e04575A709014BD"},{"permission":"upgrade","target":"0x6CA2A628fb690Bd431F4aA608655ce37c66aff9d"},{"permission":"upgrade","target":"0x728B406A4809118533D96bB3b5C50712C99d8Fa5"},{"permission":"upgrade","target":"0xFd9f59554351122b231F832a0e0A1aBb0604D7fd"}]
    }
```

```diff
    contract RollupEventInbox (0xFd9f59554351122b231F832a0e0A1aBb0604D7fd) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x74627dd54FA6E94c87F12DBAdAEc275758f51dF9"
+        "0x07390626b8Bc2C04b1D93c7D246A0629198D7868"
      issuedPermissions.0.via.0:
+        {"address":"0x74627dd54FA6E94c87F12DBAdAEc275758f51dF9","delay":0}
    }
```

Generated with discovered.json: 0x93aa37135119aaf296aabdd28928c08e427c9ce3

# Diff at Wed, 23 Oct 2024 14:36:24 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@9cc37d16a5f0b172bb41f98d8a970963e5ca4afb block: 20941807
- current block number: 20941807

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20941807 (main branch discovery), not current.

```diff
    contract UpgradeExecutor (0x07390626b8Bc2C04b1D93c7D246A0629198D7868) {
    +++ description: Central contract defining the access control for upgrading the system contract implementations.
      template:
+        "orbitstack/UpgradeExecutor"
      description:
+        "Central contract defining the access control for upgrading the system contract implementations."
    }
```

```diff
    contract OneStepProofEntry (0x09824fe72BFF474d16D9c2774432E381BBD60662) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      template:
+        "orbitstack/OneStepProofEntry"
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
    contract RollupProxy (0x448Bbd134dE1B23976073aB4F2915849b2dcD73A) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      description:
-        "Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs."
+        "Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators)."
      issuedPermissions.2:
+        {"permission":"upgrade","target":"0x07390626b8Bc2C04b1D93c7D246A0629198D7868","via":[]}
      issuedPermissions.1.permission:
-        "validate"
+        "propose"
      issuedPermissions.0.permission:
-        "upgrade"
+        "challenge"
      issuedPermissions.0.target:
-        "0x07390626b8Bc2C04b1D93c7D246A0629198D7868"
+        "0x6106B6480DE82E3eC2680d7c61A9D18d71Bf9122"
+++ description: Root hash of the WASM module used for execution, like a fingerprint of the L2 logic. Can be associated with ArbOS versions.
      values.wasmModuleRoot:
-        "ArbOS v11 wasmModuleRoot"
+        "0xf4389b835497a910d7ba3ebfb77aa93da985634f3c052de1290360635be40c4a"
+++ description: ArbOS version derived from known wasmModuleRoots.
      values.arbOsFromWmRoot:
+        "ArbOS v11 wasmModuleRoot"
      fieldMeta.arbOsFromWmRoot:
+        {"description":"ArbOS version derived from known wasmModuleRoots."}
      fieldMeta.setValidatorCount:
+        {"description":"Increments on each Validator change."}
      fieldMeta.challenges:
+        {"description":"Emitted on createChallenge() in RollupUserLogic."}
    }
```

```diff
    contract OneStepProverMemory (0x4811500e0d376Fa8d2EA3CCb7c61E0afB4F5A7f1) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      template:
+        "orbitstack/OneStepProverMemory"
      description:
+        "One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine."
    }
```

```diff
    contract OneStepProverMath (0x89AF7C4C2198c426cFe6E86de0680A0850503e06) {
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
    contract OneStepProver0 (0xDf94F0474F205D086dbc2e66D69a856FCf520622) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      template:
+        "orbitstack/OneStepProver0"
      description:
+        "One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine."
    }
```

Generated with discovered.json: 0xf70fb460521bf43cc10518e69b8861dfb2d0c7c4

# Diff at Mon, 21 Oct 2024 12:47:52 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@e660599f23a07618fe949a07be1f516ce44f1914 block: 20941807
- current block number: 20941807

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20941807 (main branch discovery), not current.

```diff
    contract RollupProxy (0x448Bbd134dE1B23976073aB4F2915849b2dcD73A) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
      descriptions:
-        ["Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs."]
      description:
+        "Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs."
    }
```

Generated with discovered.json: 0x004c4c2467be821f02f42a2195bc1233a12ad654

# Diff at Mon, 21 Oct 2024 11:09:36 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@8895d33866f5665c4c710f4ddaa32bfa63cc3c78 block: 20941807
- current block number: 20941807

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20941807 (main branch discovery), not current.

```diff
    contract UpgradeExecutor (0x07390626b8Bc2C04b1D93c7D246A0629198D7868) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0x6c21303F5986180B1394d2C89f3e883890E2867b"]
      values.$pastUpgrades.0.1:
-        ["0x6c21303F5986180B1394d2C89f3e883890E2867b"]
+        "0x63267f7748e36c730d68d06c10ca1a4c32b3177069f6e13fe1a7466486577c09"
    }
```

```diff
    contract Bridge (0x383c03c4EfF819E73409DbC690755a9992393814) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0x1c6ACCd9d66f3B993928E7439c9A2d67b94a445F"]
      values.$pastUpgrades.0.1:
-        ["0x1c6ACCd9d66f3B993928E7439c9A2d67b94a445F"]
+        "0x63267f7748e36c730d68d06c10ca1a4c32b3177069f6e13fe1a7466486577c09"
    }
```

```diff
    contract Outbox (0x3f373b0A7DcEe7b7bCfC16DF85CfAE18388542c9) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0x2a6DD4433ffa96dc1755814FC0d9cc83A5F68DeC"]
      values.$pastUpgrades.0.1:
-        ["0x2a6DD4433ffa96dc1755814FC0d9cc83A5F68DeC"]
+        "0x63267f7748e36c730d68d06c10ca1a4c32b3177069f6e13fe1a7466486577c09"
    }
```

```diff
    contract RollupProxy (0x448Bbd134dE1B23976073aB4F2915849b2dcD73A) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
      values.$pastUpgrades.0.2:
+        ["0x0aE4dD666748bF0F6dB5c149Eab1D8aD27820A6A","0x660ea1675F7323dC3Ba0c8dDFB593225Eb01E3C1"]
      values.$pastUpgrades.0.1:
-        ["0x0aE4dD666748bF0F6dB5c149Eab1D8aD27820A6A","0x660ea1675F7323dC3Ba0c8dDFB593225Eb01E3C1"]
+        "0x63267f7748e36c730d68d06c10ca1a4c32b3177069f6e13fe1a7466486577c09"
    }
```

```diff
    contract Inbox (0x672109752635177ebcb17F2C7e04575A709014BD) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0x1162084C3C6575121146582Db5BE43189e8CEe6b"]
      values.$pastUpgrades.0.1:
-        ["0x1162084C3C6575121146582Db5BE43189e8CEe6b"]
+        "0x63267f7748e36c730d68d06c10ca1a4c32b3177069f6e13fe1a7466486577c09"
    }
```

```diff
    contract SequencerInbox (0x6CA2A628fb690Bd431F4aA608655ce37c66aff9d) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0x873484Ba63353C8b71210ce123B465512d408B27"]
      values.$pastUpgrades.0.1:
-        ["0x873484Ba63353C8b71210ce123B465512d408B27"]
+        "0x63267f7748e36c730d68d06c10ca1a4c32b3177069f6e13fe1a7466486577c09"
    }
```

```diff
    contract ChallengeManager (0x728B406A4809118533D96bB3b5C50712C99d8Fa5) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0xEe9E5546A11Cb5b4A86e92DA05f2ef75C26E4754"]
      values.$pastUpgrades.0.1:
-        ["0xEe9E5546A11Cb5b4A86e92DA05f2ef75C26E4754"]
+        "0x63267f7748e36c730d68d06c10ca1a4c32b3177069f6e13fe1a7466486577c09"
    }
```

```diff
    contract RollupEventInbox (0xFd9f59554351122b231F832a0e0A1aBb0604D7fd) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0x13BE515E44Eefaf3eBEFAD684F1FBB574Ac0A494"]
      values.$pastUpgrades.0.1:
-        ["0x13BE515E44Eefaf3eBEFAD684F1FBB574Ac0A494"]
+        "0x63267f7748e36c730d68d06c10ca1a4c32b3177069f6e13fe1a7466486577c09"
    }
```

Generated with discovered.json: 0xf2c3cbb35baee92157e78a75e7e82e10b15dfa50

# Diff at Wed, 16 Oct 2024 11:39:42 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@a3d139b799cc0b28e5e912febb17464d4e5aef5d block: 20941807
- current block number: 20941807

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20941807 (main branch discovery), not current.

```diff
    contract RollupProxy (0x448Bbd134dE1B23976073aB4F2915849b2dcD73A) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
      issuedPermissions.1:
+        {"permission":"validate","target":"0x6106B6480DE82E3eC2680d7c61A9D18d71Bf9122","via":[]}
    }
```

```diff
    contract SequencerInbox (0x6CA2A628fb690Bd431F4aA608655ce37c66aff9d) {
    +++ description: None
      issuedPermissions.1:
+        {"permission":"upgrade","target":"0x74627dd54FA6E94c87F12DBAdAEc275758f51dF9","via":[]}
      issuedPermissions.0.permission:
-        "upgrade"
+        "sequence"
      issuedPermissions.0.target:
-        "0x74627dd54FA6E94c87F12DBAdAEc275758f51dF9"
+        "0xf5636Df6f86f31668aeAe9bB8a1C4F0ED147926a"
    }
```

Generated with discovered.json: 0x4d1b1eed9e02b910952c8f55b6522c74010f4f13

# Diff at Mon, 14 Oct 2024 10:55:06 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1afc77ff111ceb0970e7d09efcc7b2f376b0c281 block: 20941807
- current block number: 20941807

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20941807 (main branch discovery), not current.

```diff
    contract UpgradeExecutor (0x07390626b8Bc2C04b1D93c7D246A0629198D7868) {
    +++ description: None
      sourceHashes:
+        ["0xa7e3f6c355703ed46fcb2156862c4f01792b87beb10a87a81ce3bd5beee79b67","0xa7ff878cfd433a428d567d3b90fe1df400a048a1af5298f22cd4cd4fc25bdecd"]
    }
```

```diff
    contract OneStepProofEntry (0x09824fe72BFF474d16D9c2774432E381BBD60662) {
    +++ description: None
      sourceHashes:
+        ["0xf3479c667d20b1c17ea2573dc7fe09e4315a3e20bc09d31bc92603520cc962cc"]
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
    contract Bridge (0x383c03c4EfF819E73409DbC690755a9992393814) {
    +++ description: None
      sourceHashes:
+        ["0xa7e3f6c355703ed46fcb2156862c4f01792b87beb10a87a81ce3bd5beee79b67","0xb920455f1e366c7a89719abdd8d8174e4e7d353f2d4b7dea11b0571bf9526eae"]
    }
```

```diff
    contract Outbox (0x3f373b0A7DcEe7b7bCfC16DF85CfAE18388542c9) {
    +++ description: None
      sourceHashes:
+        ["0xa7e3f6c355703ed46fcb2156862c4f01792b87beb10a87a81ce3bd5beee79b67","0x28eec040eca7563195b19e22e11429d0f977820bfb60ac52e567ffde3c92cf77"]
    }
```

```diff
    contract RollupProxy (0x448Bbd134dE1B23976073aB4F2915849b2dcD73A) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
      sourceHashes:
+        ["0xb8da0b3748daac768860783e8555198fd2d1bbdffb775b81557a7124890c7eca","0x8b48118fe606012c0dcac2ccc1821785935aec89fab8f219f47b32c482b0017e","0xef94a66bd5339efd18fb9ca1f8031482e7ef7bbe6c5a0a10fae254ab83712406"]
    }
```

```diff
    contract OneStepProverMemory (0x4811500e0d376Fa8d2EA3CCb7c61E0afB4F5A7f1) {
    +++ description: None
      sourceHashes:
+        ["0x731b4466319a83c95ce227d1a6c85aa03864f5d2bed03bda186843033a8b8d61"]
    }
```

```diff
    contract Inbox (0x672109752635177ebcb17F2C7e04575A709014BD) {
    +++ description: None
      sourceHashes:
+        ["0xa7e3f6c355703ed46fcb2156862c4f01792b87beb10a87a81ce3bd5beee79b67","0x99872d99b7163c705118e0a168f99728c3c7089581779077707271cdaad30be3"]
    }
```

```diff
    contract SequencerInbox (0x6CA2A628fb690Bd431F4aA608655ce37c66aff9d) {
    +++ description: None
      sourceHashes:
+        ["0xa7e3f6c355703ed46fcb2156862c4f01792b87beb10a87a81ce3bd5beee79b67","0x08792f333db7e8a060c38033f92e3fc10c30e2648c56fc49c7460ee1c94343a0"]
    }
```

```diff
    contract ChallengeManager (0x728B406A4809118533D96bB3b5C50712C99d8Fa5) {
    +++ description: None
      sourceHashes:
+        ["0xa7e3f6c355703ed46fcb2156862c4f01792b87beb10a87a81ce3bd5beee79b67","0x7e1cd1e10119e118ffaa576ddbe1c0f9810a0859a4bf2f65a4ff596c0ed4183d"]
    }
```

```diff
    contract ProxyAdmin (0x74627dd54FA6E94c87F12DBAdAEc275758f51dF9) {
    +++ description: None
      sourceHashes:
+        ["0xf944f88083f41ff959fefbdcd6fc3ae633692b072b8497fb14cbdd843eded490"]
    }
```

```diff
    contract OneStepProverMath (0x89AF7C4C2198c426cFe6E86de0680A0850503e06) {
    +++ description: None
      sourceHashes:
+        ["0xb2555ede3dfe7d6df28bd96d12a0113b658c213c7ce4e34fa539df7497bc51a1"]
    }
```

```diff
    contract OneStepProverHostIo (0x99a2A31300816C1FA3f40818AC9280fe7271F878) {
    +++ description: None
      sourceHashes:
+        ["0x0a8f8db8198082757cc8145891c633c20ed4313dab05beab40618258e534a1e8"]
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
    contract GelatoMultisig (0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb) {
    +++ description: None
      sourceHashes:
+        ["0x81a7349eebb98ac33b0bc6842e3cb258034a8f2a4ba004570bb8e2e25947f9ff","0xd42bbf9f7dcd3720a7fc6bdc6edfdfae8800a37d6dd4decfa0ef6ca4a2e88940"]
    }
```

```diff
    contract OneStepProver0 (0xDf94F0474F205D086dbc2e66D69a856FCf520622) {
    +++ description: None
      sourceHashes:
+        ["0x20330713abbbcf0219ef7d1c0aa3a6ede1b421f14c9d21b25c973e54fb75f5df"]
    }
```

```diff
    contract SocketVault_Reya (0xdFf78A949E47c1e90f3Dd6dd7Fe2Fa72B42a75f7) {
    +++ description: None
      sourceHashes:
+        ["0x5a961d4cd1fe9b96535b53aaf638b45677b06e22d26037a62ccf6adc9c29f79d"]
    }
```

```diff
    contract RollupEventInbox (0xFd9f59554351122b231F832a0e0A1aBb0604D7fd) {
    +++ description: None
      sourceHashes:
+        ["0xa7e3f6c355703ed46fcb2156862c4f01792b87beb10a87a81ce3bd5beee79b67","0xcd37abd5bdcc8c37cbf37dcfa4889d5b238388344d913b3a48914f659e0d627b"]
    }
```

Generated with discovered.json: 0xc8e2e47c01857e9b59af509ec2b08f5aadb2651c

# Diff at Fri, 11 Oct 2024 10:33:43 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@8f7c5fd25193054458be38552e62a708c480b2c8 block: 20842808
- current block number: 20941807

## Description

Gelato MS signer removed, one DAC member added, one changed.

## Watched changes

```diff
    contract SequencerInbox (0x6CA2A628fb690Bd431F4aA608655ce37c66aff9d) {
    +++ description: None
      values.dacKeyset.membersCount:
-        1
+        2
      values.dacKeyset.blsSignatures.1:
+        "YAbEnnI/RpbGv0lwkp7I0JhTwGaPz8lEVjkr8SE9LlTrPiEeRegjYymNY2doPnin1hOQfpQuGBRjgxaw3h8lIoBxn31tIMbc3I2pjRBuZhF14klu+I1bkluXRJO9ZYmC9BACIIohozMTWRXI/ej0MFQytyvZsXN2PWKKky0Yy+RzUP7Y7982vn4X81IwuZ4FdhIbogTvc6RSDzgPhiH2ejRB6XPlRT/f76KeNWZogD299lBrYySIceH/aA98cp3ixA7/ryLG6sD2VddYDdfsoSQbTbWuUQrO5/DK3SlMtbMv+vKqMNgCjstJ2DJXPKhiOhQ5nsnOZg9cSalU6LbPPFDdSO/0h09HXno290Iw0yxS20SGmx51lO6q/vEgX0OVvw=="
      values.dacKeyset.blsSignatures.0:
-        "YAiqbxEldcCCF4w3w4rdcfKobllBTGfReIRDwPzEQlUlhq7UFfj70vGcsqwwgzVnNwfqObDvYQ8k5tB5MNDBqJawE4yLZrjazXPba/DQAQ1uXDhXE0OzvZQJxgFrsmkijRBd/Oj24eTJLFV3UrOPE+g9S5wrfTmWwtbVsfYxYSr+KgAKrOy1BsB/MQU8UTtS7g5QNaIGGpwVnDp5RgtpEo1KHrcio4YmEi7HZHsgkpiuTev93ju4EMtrIYN29H8YDhV2UNYA0ZsoQF2B0rbNNp0bWQi6SlnTd9jd4Xffqnol1fmwL6qNWtln4DbfvpK3ZxSNtNvO5GsfPCcbwDPv+kR9ywNQHcDCsJluydK1jMzJLlXUFxuNy3uWUHV+9sBo6g=="
+        "YAfz7xTJCh4W2eYRm14dHI9/MzmE4XpACAD8kSdGPQR9hYj0KVfOfn84xCnXxPRLoBOUCU4l4rzz0HSU3joV5kuBxKQh46L3yZ0h0oP4MXFOG8cbV5oIs2WFjP6s4sPZpRVYhGBPsMSEuD/52l2fMMZTaAQ2p9Vb8VDlSCad3tigl9luWtLItup5DuAS6ixUVBDajyKu9RIGApJwPgtr5dtorAuQ01M6DUhcLM5EPOafuzwvqMywUVmv5YEBJZ96JweOpBJHh7Vs3FKnaR/aDewkrnJBUAlOmW/O09NsbrAGovEQboyn/j17TLfkJVOriQllp0SQJtD/L6somLazwnkbGpN1e0pFod/jqIPI/fetEu6KvteYLX37lzjJQ4l8pA=="
      values.keySetUpdates:
-        1
+        2
    }
```

```diff
    contract GelatoMultisig (0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb) {
    +++ description: None
      values.$members.9:
-        "0x547D0F472309e4239b296D01e03bEDc101241a26"
      values.$members.8:
-        "0xf83bC4688979b13Da02CB94c76cEB169540760b5"
+        "0x547D0F472309e4239b296D01e03bEDc101241a26"
      values.$members.7:
-        "0x01a0A7BaAAca31AFB5b770FeFD69CE4917D9c32e"
+        "0xf83bC4688979b13Da02CB94c76cEB169540760b5"
      values.$members.6:
-        "0x27b1682E9C5Cb0E58Ff474F3a13EeCC36E708ad3"
+        "0x01a0A7BaAAca31AFB5b770FeFD69CE4917D9c32e"
      values.multisigThreshold:
-        "6 of 10 (60%)"
+        "6 of 9 (67%)"
    }
```

Generated with discovered.json: 0x8db582682a13cb82fe1ee0cd851b48305e7e34aa

# Diff at Tue, 01 Oct 2024 10:54:41 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bd754dc73c66120164006054f8d25c5fae9cd910 block: 20842808
- current block number: 20842808

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20842808 (main branch discovery), not current.

```diff
    contract UpgradeExecutor (0x07390626b8Bc2C04b1D93c7D246A0629198D7868) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-03-02T11:56:47.000Z",["0x6c21303F5986180B1394d2C89f3e883890E2867b"]]]
    }
```

```diff
    contract Bridge (0x383c03c4EfF819E73409DbC690755a9992393814) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-03-02T11:56:47.000Z",["0x1c6ACCd9d66f3B993928E7439c9A2d67b94a445F"]]]
    }
```

```diff
    contract Outbox (0x3f373b0A7DcEe7b7bCfC16DF85CfAE18388542c9) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-03-02T11:56:47.000Z",["0x2a6DD4433ffa96dc1755814FC0d9cc83A5F68DeC"]]]
    }
```

```diff
    contract RollupProxy (0x448Bbd134dE1B23976073aB4F2915849b2dcD73A) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
      values.$pastUpgrades:
+        [["2024-03-02T11:56:47.000Z",["0x0aE4dD666748bF0F6dB5c149Eab1D8aD27820A6A","0x660ea1675F7323dC3Ba0c8dDFB593225Eb01E3C1"]]]
      values.$upgradeCount:
+        1
    }
```

```diff
    contract Inbox (0x672109752635177ebcb17F2C7e04575A709014BD) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-03-02T11:56:47.000Z",["0x1162084C3C6575121146582Db5BE43189e8CEe6b"]]]
    }
```

```diff
    contract SequencerInbox (0x6CA2A628fb690Bd431F4aA608655ce37c66aff9d) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-03-02T11:56:47.000Z",["0x873484Ba63353C8b71210ce123B465512d408B27"]]]
    }
```

```diff
    contract ChallengeManager (0x728B406A4809118533D96bB3b5C50712C99d8Fa5) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-03-02T11:56:47.000Z",["0xEe9E5546A11Cb5b4A86e92DA05f2ef75C26E4754"]]]
    }
```

```diff
    contract RollupEventInbox (0xFd9f59554351122b231F832a0e0A1aBb0604D7fd) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-03-02T11:56:47.000Z",["0x13BE515E44Eefaf3eBEFAD684F1FBB574Ac0A494"]]]
    }
```

Generated with discovered.json: 0x39a2fbca1f1dfc9b8a5f466410691057fb02fb99

# Diff at Fri, 27 Sep 2024 15:19:41 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@4cb14cc1bdc343d171a7988f9f91f11edbf568a8 block: 20177364
- current block number: 20842808

## Description

Config.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20177364 (main branch discovery), not current.

```diff
    contract RollupProxy (0x448Bbd134dE1B23976073aB4F2915849b2dcD73A) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
      usedTypes.0.arg.0x184884e1eb9fefdc158f6c8ac912bb183bf3cf83f0090317e0bc4ac5860baa39:
+        "ArbOS v32 wasmModuleRoot"
    }
```

Generated with discovered.json: 0xc7f1fcfb5ea20feba39c88cc0aac80e33dbbf4a5

# Diff at Sun, 01 Sep 2024 08:45:33 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@bee35b6cff7c52634ae8667cbb331e18ad4ec17a block: 20177364
- current block number: 20177364

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20177364 (main branch discovery), not current.

```diff
    contract RollupProxy (0x448Bbd134dE1B23976073aB4F2915849b2dcD73A) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
+++ description: Root hash of the WASM module used for execution, like a fingerprint of the L2 logic. Can be associated with ArbOS versions.
      values.wasmModuleRoot:
-        "0xf4389b835497a910d7ba3ebfb77aa93da985634f3c052de1290360635be40c4a"
+        "ArbOS v11 wasmModuleRoot"
      usedTypes:
+        [{"typeCaster":"Mapping","arg":{"0xbb9d58e9527566138b682f3a207c0976d5359837f6e330f4017434cca983ff41":"ArbOS v1-rc1 wasmModuleRoot","0x9d68e40c47e3b87a8a7e6368cc52915720a6484bb2f47ceabad7e573e3a11232":"ArbOS v2.1 wasmModuleRoot","0x53c288a0ca7100c0f2db8ab19508763a51c7fd1be125d376d940a65378acaee7":"ArbOS v3 wasmModuleRoot","0x588762be2f364be15d323df2aa60ffff60f2b14103b34823b6f7319acd1ae7a3":"ArbOS v3.1 wasmModuleRoot","0xcfba6a883c50a1b4475ab909600fa88fc9cceed9e3ff6f43dccd2d27f6bd57cf":"ArbOS v3.2 wasmModuleRoot","0xa24ccdb052d92c5847e8ea3ce722442358db4b00985a9ee737c4e601b6ed9876":"ArbOS v4 wasmModuleRoot","0x1e09e6d9e35b93f33ed22b2bc8dc10bbcf63fdde5e8a1fb8cc1bcd1a52f14bd0":"ArbOS v5 wasmModuleRoot","0x3848eff5e0356faf1fc9cafecb789584c5e7f4f8f817694d842ada96613d8bab":"ArbOS v6 wasmModuleRoot","0x53dd4b9a3d807a8cbb4d58fbfc6a0857c3846d46956848cae0a1cc7eca2bb5a8":"ArbOS v7 wasmModuleRoot","0x2b20e1490d1b06299b222f3239b0ae07e750d8f3b4dedd19f500a815c1548bbc":"ArbOS v7.1 wasmModuleRoot","0xd1842bfbe047322b3f3b3635b5fe62eb611557784d17ac1d2b1ce9c170af6544":"ArbOS v9 wasmModuleRoot","0x6b94a7fc388fd8ef3def759297828dc311761e88d8179c7ee8d3887dc554f3c3":"ArbOS v10 wasmModuleRoot","0xda4e3ad5e7feacb817c21c8d0220da7650fe9051ece68a3f0b1c5d38bbb27b21":"ArbOS v10.1 wasmModuleRoot","0x0754e09320c381566cc0449904c377a52bd34a6b9404432e80afd573b67f7b17":"ArbOS v10.2 wasmModuleRoot","0xf559b6d4fa869472dabce70fe1c15221bdda837533dfd891916836975b434dec":"ArbOS v10.3 wasmModuleRoot","0xf4389b835497a910d7ba3ebfb77aa93da985634f3c052de1290360635be40c4a":"ArbOS v11 wasmModuleRoot","0x68e4fe5023f792d4ef584796c84d710303a5e12ea02d6e37e2b5e9c4332507c4":"ArbOS v11.1 wasmModuleRoot","0x8b104a2e80ac6165dc58b9048de12f301d70b02a0ab51396c22b4b4b802a16a4":"ArbOS v20 wasmModuleRoot","0xb0de9cb89e4d944ae6023a3b62276e54804c242fd8c4c2d8e6cc4450f5fa8b1b":"ArbOS v30 wasmModuleRoot","0x260f5fa5c3176a856893642e149cf128b5a8de9f828afec8d11184415dd8dc69":"ArbOS v31 wasmModuleRoot"}}]
    }
```

Generated with discovered.json: 0x988beb59ab791d19186f3f656afc35d7176e3300

# Diff at Fri, 30 Aug 2024 07:56:28 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@6c1bd1f41fadf5f2cb1c1805b5a2c6138a3ed35a block: 20177364
- current block number: 20177364

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20177364 (main branch discovery), not current.

```diff
    contract UpgradeExecutor (0x07390626b8Bc2C04b1D93c7D246A0629198D7868) {
    +++ description: None
      receivedPermissions.0.via:
-        []
    }
```

```diff
    contract ProxyAdmin (0x74627dd54FA6E94c87F12DBAdAEc275758f51dF9) {
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

Generated with discovered.json: 0x9b09c3c492382ffc81fca3c0b194f79a769fd93c

# Diff at Fri, 23 Aug 2024 09:54:53 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@67597c7d6c810bc726594446890178150240711e block: 20177364
- current block number: 20177364

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20177364 (main branch discovery), not current.

```diff
    contract UpgradeExecutor (0x07390626b8Bc2C04b1D93c7D246A0629198D7868) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract Bridge (0x383c03c4EfF819E73409DbC690755a9992393814) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract Outbox (0x3f373b0A7DcEe7b7bCfC16DF85CfAE18388542c9) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract Inbox (0x672109752635177ebcb17F2C7e04575A709014BD) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract SequencerInbox (0x6CA2A628fb690Bd431F4aA608655ce37c66aff9d) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract ChallengeManager (0x728B406A4809118533D96bB3b5C50712C99d8Fa5) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract RollupEventInbox (0xFd9f59554351122b231F832a0e0A1aBb0604D7fd) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

Generated with discovered.json: 0x2b5f1d0fa7d7bbc653a4a5926b65252f2c8bc87d

# Diff at Wed, 21 Aug 2024 13:25:47 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@63cb0bd5d55a6dfae0e2e22590983dd8344be4a3 block: 20177364
- current block number: 20177364

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20177364 (main branch discovery), not current.

```diff
    contract SequencerInbox (0x6CA2A628fb690Bd431F4aA608655ce37c66aff9d) {
    +++ description: None
      values.dacKeyset.blsSignatures:
+        ["YAiqbxEldcCCF4w3w4rdcfKobllBTGfReIRDwPzEQlUlhq7UFfj70vGcsqwwgzVnNwfqObDvYQ8k5tB5MNDBqJawE4yLZrjazXPba/DQAQ1uXDhXE0OzvZQJxgFrsmkijRBd/Oj24eTJLFV3UrOPE+g9S5wrfTmWwtbVsfYxYSr+KgAKrOy1BsB/MQU8UTtS7g5QNaIGGpwVnDp5RgtpEo1KHrcio4YmEi7HZHsgkpiuTev93ju4EMtrIYN29H8YDhV2UNYA0ZsoQF2B0rbNNp0bWQi6SlnTd9jd4Xffqnol1fmwL6qNWtln4DbfvpK3ZxSNtNvO5GsfPCcbwDPv+kR9ywNQHcDCsJluydK1jMzJLlXUFxuNy3uWUHV+9sBo6g=="]
    }
```

Generated with discovered.json: 0xd9a12fbd5cde2748bd18f10c73750f4e337fd081

# Diff at Wed, 21 Aug 2024 10:05:26 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@2f6dde3357bf5d79196b6e94f79d853a6c4ec72b block: 20177364
- current block number: 20177364

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20177364 (main branch discovery), not current.

```diff
    contract UpgradeExecutor (0x07390626b8Bc2C04b1D93c7D246A0629198D7868) {
    +++ description: None
      assignedPermissions:
-        {"upgrade":["0x448Bbd134dE1B23976073aB4F2915849b2dcD73A"]}
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x74627dd54FA6E94c87F12DBAdAEc275758f51dF9","via":[]}]
      receivedPermissions:
+        [{"permission":"upgrade","target":"0x448Bbd134dE1B23976073aB4F2915849b2dcD73A","via":[]}]
    }
```

```diff
    contract Bridge (0x383c03c4EfF819E73409DbC690755a9992393814) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x74627dd54FA6E94c87F12DBAdAEc275758f51dF9","via":[]}]
    }
```

```diff
    contract Outbox (0x3f373b0A7DcEe7b7bCfC16DF85CfAE18388542c9) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x74627dd54FA6E94c87F12DBAdAEc275758f51dF9","via":[]}]
    }
```

```diff
    contract RollupProxy (0x448Bbd134dE1B23976073aB4F2915849b2dcD73A) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x07390626b8Bc2C04b1D93c7D246A0629198D7868","via":[]}]
    }
```

```diff
    contract Inbox (0x672109752635177ebcb17F2C7e04575A709014BD) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x74627dd54FA6E94c87F12DBAdAEc275758f51dF9","via":[]}]
    }
```

```diff
    contract SequencerInbox (0x6CA2A628fb690Bd431F4aA608655ce37c66aff9d) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x74627dd54FA6E94c87F12DBAdAEc275758f51dF9","via":[]}]
    }
```

```diff
    contract ChallengeManager (0x728B406A4809118533D96bB3b5C50712C99d8Fa5) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x74627dd54FA6E94c87F12DBAdAEc275758f51dF9","via":[]}]
    }
```

```diff
    contract ProxyAdmin (0x74627dd54FA6E94c87F12DBAdAEc275758f51dF9) {
    +++ description: None
      assignedPermissions:
-        {"upgrade":["0x07390626b8Bc2C04b1D93c7D246A0629198D7868","0x383c03c4EfF819E73409DbC690755a9992393814","0x3f373b0A7DcEe7b7bCfC16DF85CfAE18388542c9","0x672109752635177ebcb17F2C7e04575A709014BD","0x6CA2A628fb690Bd431F4aA608655ce37c66aff9d","0x728B406A4809118533D96bB3b5C50712C99d8Fa5","0xFd9f59554351122b231F832a0e0A1aBb0604D7fd"]}
      receivedPermissions:
+        [{"permission":"upgrade","target":"0x07390626b8Bc2C04b1D93c7D246A0629198D7868","via":[]},{"permission":"upgrade","target":"0x383c03c4EfF819E73409DbC690755a9992393814","via":[]},{"permission":"upgrade","target":"0x3f373b0A7DcEe7b7bCfC16DF85CfAE18388542c9","via":[]},{"permission":"upgrade","target":"0x672109752635177ebcb17F2C7e04575A709014BD","via":[]},{"permission":"upgrade","target":"0x6CA2A628fb690Bd431F4aA608655ce37c66aff9d","via":[]},{"permission":"upgrade","target":"0x728B406A4809118533D96bB3b5C50712C99d8Fa5","via":[]},{"permission":"upgrade","target":"0xFd9f59554351122b231F832a0e0A1aBb0604D7fd","via":[]}]
    }
```

```diff
    contract RollupEventInbox (0xFd9f59554351122b231F832a0e0A1aBb0604D7fd) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x74627dd54FA6E94c87F12DBAdAEc275758f51dF9","via":[]}]
    }
```

Generated with discovered.json: 0xd390f5045290a8c860d9973e09b79bb24bfbaba8

# Diff at Fri, 09 Aug 2024 12:01:51 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bf40aa32f030fd312056ca0ef198c8550467d1d7 block: 20177364
- current block number: 20177364

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20177364 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x74627dd54FA6E94c87F12DBAdAEc275758f51dF9) {
    +++ description: None
      assignedPermissions.upgrade.6:
-        "0x728B406A4809118533D96bB3b5C50712C99d8Fa5"
+        "0xFd9f59554351122b231F832a0e0A1aBb0604D7fd"
      assignedPermissions.upgrade.5:
-        "0x3f373b0A7DcEe7b7bCfC16DF85CfAE18388542c9"
+        "0x728B406A4809118533D96bB3b5C50712C99d8Fa5"
      assignedPermissions.upgrade.4:
-        "0xFd9f59554351122b231F832a0e0A1aBb0604D7fd"
+        "0x6CA2A628fb690Bd431F4aA608655ce37c66aff9d"
      assignedPermissions.upgrade.3:
-        "0x07390626b8Bc2C04b1D93c7D246A0629198D7868"
+        "0x672109752635177ebcb17F2C7e04575A709014BD"
      assignedPermissions.upgrade.2:
-        "0x6CA2A628fb690Bd431F4aA608655ce37c66aff9d"
+        "0x3f373b0A7DcEe7b7bCfC16DF85CfAE18388542c9"
      assignedPermissions.upgrade.0:
-        "0x672109752635177ebcb17F2C7e04575A709014BD"
+        "0x07390626b8Bc2C04b1D93c7D246A0629198D7868"
    }
```

Generated with discovered.json: 0x3c4821d41420fdbdd4e995dffb0bed68e0e30f3a

# Diff at Fri, 09 Aug 2024 10:11:50 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f0da1d0aab7bc6b3b5e54e7e93480bd98e57035 block: 20177364
- current block number: 20177364

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20177364 (main branch discovery), not current.

```diff
    contract UpgradeExecutor (0x07390626b8Bc2C04b1D93c7D246A0629198D7868) {
    +++ description: None
      assignedPermissions.admin:
-        ["0x448Bbd134dE1B23976073aB4F2915849b2dcD73A"]
      assignedPermissions.upgrade:
+        ["0x448Bbd134dE1B23976073aB4F2915849b2dcD73A"]
    }
```

```diff
    contract ProxyAdmin (0x74627dd54FA6E94c87F12DBAdAEc275758f51dF9) {
    +++ description: None
      assignedPermissions.admin:
-        ["0x07390626b8Bc2C04b1D93c7D246A0629198D7868","0x383c03c4EfF819E73409DbC690755a9992393814","0x3f373b0A7DcEe7b7bCfC16DF85CfAE18388542c9","0x672109752635177ebcb17F2C7e04575A709014BD","0x6CA2A628fb690Bd431F4aA608655ce37c66aff9d","0x728B406A4809118533D96bB3b5C50712C99d8Fa5","0xFd9f59554351122b231F832a0e0A1aBb0604D7fd"]
      assignedPermissions.upgrade:
+        ["0x672109752635177ebcb17F2C7e04575A709014BD","0x383c03c4EfF819E73409DbC690755a9992393814","0x6CA2A628fb690Bd431F4aA608655ce37c66aff9d","0x07390626b8Bc2C04b1D93c7D246A0629198D7868","0xFd9f59554351122b231F832a0e0A1aBb0604D7fd","0x3f373b0A7DcEe7b7bCfC16DF85CfAE18388542c9","0x728B406A4809118533D96bB3b5C50712C99d8Fa5"]
    }
```

```diff
    contract GelatoMultisig (0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb) {
    +++ description: None
      values.$multisigThreshold:
-        "6 of 10 (60%)"
      values.getOwners:
-        ["0xB0C2CBFfCd4C31AFFEe14993b6d48f99D285f621","0x28bB9385A588EF4747264D19B9A9F1603591680c","0x691C2EF68e25E620fa6cAdE2728f6aE34F37aAD2","0x5bE3E96Cdc3A97628bD7308d3588B9a474F4A54d","0xBc0ca6865d6883a83D4aDDD6b862aE042d855E0d","0xc85aC6d2fdC376F335455D4cCA30c45ED1080849","0x27b1682E9C5Cb0E58Ff474F3a13EeCC36E708ad3","0x01a0A7BaAAca31AFB5b770FeFD69CE4917D9c32e","0xf83bC4688979b13Da02CB94c76cEB169540760b5","0x547D0F472309e4239b296D01e03bEDc101241a26"]
      values.getThreshold:
-        6
      values.$members:
+        ["0xB0C2CBFfCd4C31AFFEe14993b6d48f99D285f621","0x28bB9385A588EF4747264D19B9A9F1603591680c","0x691C2EF68e25E620fa6cAdE2728f6aE34F37aAD2","0x5bE3E96Cdc3A97628bD7308d3588B9a474F4A54d","0xBc0ca6865d6883a83D4aDDD6b862aE042d855E0d","0xc85aC6d2fdC376F335455D4cCA30c45ED1080849","0x27b1682E9C5Cb0E58Ff474F3a13EeCC36E708ad3","0x01a0A7BaAAca31AFB5b770FeFD69CE4917D9c32e","0xf83bC4688979b13Da02CB94c76cEB169540760b5","0x547D0F472309e4239b296D01e03bEDc101241a26"]
      values.$threshold:
+        6
      values.multisigThreshold:
+        "6 of 10 (60%)"
    }
```

Generated with discovered.json: 0xd206dd3f29a9b75aa36f6be5a5e3aa295ba9c145

# Diff at Tue, 30 Jul 2024 11:14:00 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@b2b6471ff62871f4956541f42ec025c356c08f7e block: 20177364
- current block number: 20177364

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20177364 (main branch discovery), not current.

```diff
    contract RollupProxy (0x448Bbd134dE1B23976073aB4F2915849b2dcD73A) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
      fieldMeta:
+        {"confirmPeriodBlocks":{"description":"Challenge period. (Number of blocks until a node is confirmed)."},"wasmModuleRoot":{"description":"Root hash of the WASM module used for execution, like a fingerprint of the L2 logic. Can be associated with ArbOS versions."}}
    }
```

Generated with discovered.json: 0xc4f473c42277bdd183e49089b1b3413cc298b04b

# Diff at Wed, 05 Jun 2024 08:43:07 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@3a08c61f892fdbd930567c41f50f427b83391859 block: 19973435
- current block number: 20024504

## Description

Same Multisig as in new re.al L2, deployed by gelato deployer.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19973435 (main branch discovery), not current.

```diff
    contract ReyaMultisig (0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb) {
    +++ description: None
      name:
-        "ReyaMultisig"
+        "GelatoMultisig"
    }
```

Generated with discovered.json: 0x365b8f59f73971268b17211f32b838a2f592af96

# Diff at Wed, 29 May 2024 05:29:13 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@bca8b8ea4d1ba80d5f20f68bede9336b90b01434 block: 19926951
- current block number: 19973435

## Description

The EOA is removed from EXECUTOR_ROLE.members. The rollup can now be upgraded by the 6/10 Reya Multisig only.

## Watched changes

```diff
    contract UpgradeExecutor (0x07390626b8Bc2C04b1D93c7D246A0629198D7868) {
    +++ description: None
      values.accessControl.EXECUTOR_ROLE.members.1:
-        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
      values.accessControl.EXECUTOR_ROLE.members.0:
-        "0x91Ef6E02740bDcc9dB248F995c7f394D7617d7a1"
+        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
    }
```

```diff
    contract ReyaMultisig (0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb) {
    +++ description: None
      upgradeability.threshold:
-        "5 of 9 (56%)"
+        "6 of 10 (60%)"
      values.getOwners.9:
+        "0x547D0F472309e4239b296D01e03bEDc101241a26"
      values.getOwners.8:
-        "0xebD4919C075417a86F19713dADe101852867A04F"
+        "0xf83bC4688979b13Da02CB94c76cEB169540760b5"
      values.getOwners.7:
-        "0xf83bC4688979b13Da02CB94c76cEB169540760b5"
+        "0x01a0A7BaAAca31AFB5b770FeFD69CE4917D9c32e"
      values.getOwners.6:
-        "0x01a0A7BaAAca31AFB5b770FeFD69CE4917D9c32e"
+        "0x27b1682E9C5Cb0E58Ff474F3a13EeCC36E708ad3"
      values.getOwners.5:
-        "0x27b1682E9C5Cb0E58Ff474F3a13EeCC36E708ad3"
+        "0xc85aC6d2fdC376F335455D4cCA30c45ED1080849"
      values.getOwners.4:
-        "0xc85aC6d2fdC376F335455D4cCA30c45ED1080849"
+        "0xBc0ca6865d6883a83D4aDDD6b862aE042d855E0d"
      values.getOwners.3:
-        "0xBc0ca6865d6883a83D4aDDD6b862aE042d855E0d"
+        "0x5bE3E96Cdc3A97628bD7308d3588B9a474F4A54d"
      values.getOwners.2:
-        "0x5bE3E96Cdc3A97628bD7308d3588B9a474F4A54d"
+        "0x691C2EF68e25E620fa6cAdE2728f6aE34F37aAD2"
      values.getOwners.1:
-        "0x691C2EF68e25E620fa6cAdE2728f6aE34F37aAD2"
+        "0x28bB9385A588EF4747264D19B9A9F1603591680c"
      values.getOwners.0:
-        "0x28bB9385A588EF4747264D19B9A9F1603591680c"
+        "0xB0C2CBFfCd4C31AFFEe14993b6d48f99D285f621"
      values.getThreshold:
-        5
+        6
      values.nonce:
-        0
+        4
    }
```

Generated with discovered.json: 0x940faef00f64ffdef8e782429009677653fbae56

# Diff at Wed, 22 May 2024 17:36:40 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@7eae7b47a410c2b8cc7e6a7d7a0bc841a31c6e83 block: 19883593
- current block number: 19926951

## Description

A new Executor is added (a multisig) but the old EOA admin is still not removed.

## Watched changes

```diff
    contract UpgradeExecutor (0x07390626b8Bc2C04b1D93c7D246A0629198D7868) {
    +++ description: None
      values.accessControl.EXECUTOR_ROLE.members.1:
+        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
    }
```

```diff
+   Status: CREATED
    contract ReyaMultisig (0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb)
    +++ description: None
```

## Source code changes

```diff
.../ethereum/.flat/ReyaMultisig/GnosisSafe.sol     | 952 +++++++++++++++++++++
 .../.flat/ReyaMultisig/GnosisSafeProxy.p.sol       |  34 +
 2 files changed, 986 insertions(+)
```

Generated with discovered.json: 0x5664902f67add10c7d67f86c907fb3ea7ec5ecd3

# Diff at Tue, 14 May 2024 09:35:12 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@c3f1e2e18f153bc7ee23c0dd431182773076cc43 block: 19789584
- current block number: 19867390

## Description

The challenge period (`confirmPeriodBlocks`) is increased from 30m and now matches the self-propose (`VALIDATOR_AFK_BLOCKS`) delay of 6d 8h.

## Watched changes

```diff
    contract RollupProxy (0x448Bbd134dE1B23976073aB4F2915849b2dcD73A) {
    +++ description: None
      values.confirmPeriodBlocks:
-        150
+        45818
    }
```

Generated with discovered.json: 0x5b3d003cfab482308ba681b8eecea5562a2b9df5

# Diff at Fri, 03 May 2024 12:27:40 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- current block number: 19789584

## Description

Initial discovery for Reya network (Orbit stack L2). 1.0 code similarity (identical) to popapex L3 when excluding the socket vault and Mulltisig.

## Initial discovery

```diff
+   Status: CREATED
    contract UpgradeExecutor (0x07390626b8Bc2C04b1D93c7D246A0629198D7868)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProofEntry (0x09824fe72BFF474d16D9c2774432E381BBD60662)
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
    contract Bridge (0x383c03c4EfF819E73409DbC690755a9992393814)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Outbox (0x3f373b0A7DcEe7b7bCfC16DF85CfAE18388542c9)
    +++ description: None
```

```diff
+   Status: CREATED
    contract RollupProxy (0x448Bbd134dE1B23976073aB4F2915849b2dcD73A)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProverMemory (0x4811500e0d376Fa8d2EA3CCb7c61E0afB4F5A7f1)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Inbox (0x672109752635177ebcb17F2C7e04575A709014BD)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SequencerInbox (0x6CA2A628fb690Bd431F4aA608655ce37c66aff9d)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ChallengeManager (0x728B406A4809118533D96bB3b5C50712C99d8Fa5)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x74627dd54FA6E94c87F12DBAdAEc275758f51dF9)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProverMath (0x89AF7C4C2198c426cFe6E86de0680A0850503e06)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProverHostIo (0x99a2A31300816C1FA3f40818AC9280fe7271F878)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ValidatorWalletCreator (0x9CAd81628aB7D8e239F1A5B497313341578c5F71)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProver0 (0xDf94F0474F205D086dbc2e66D69a856FCf520622)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SocketVault_Reya (0xdFf78A949E47c1e90f3Dd6dd7Fe2Fa72B42a75f7)
    +++ description: None
```

```diff
+   Status: CREATED
    contract RollupEventInbox (0xFd9f59554351122b231F832a0e0A1aBb0604D7fd)
    +++ description: None
```
