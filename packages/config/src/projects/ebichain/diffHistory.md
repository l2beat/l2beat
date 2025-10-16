Generated with discovered.json: 0xcae912ca437e79c4d638da429e4f0d1fe5dba871

# Diff at Fri, 03 Oct 2025 08:41:30 GMT:

- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@e647409961cd173771dcfcaeb808991c99e73911 block: 1756214657
- current timestamp: 1759480805

## Description

Member removed from multisig.

## Watched changes

```diff
    contract Conduit Multisig 1 (eth:0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      values.$members.2:
-        "eth:0x50930d652266EF4127FA3A1906B7Cb9951076628"
      values.multisigThreshold:
-        "4 of 11 (36%)"
+        "4 of 10 (40%)"
    }
```

Generated with discovered.json: 0xddcb396b847c7dd8a45132736845209f1bd18e68

# Diff at Fri, 26 Sep 2025 12:45:17 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@ec4b16fd723bf2a8625a616c4b3a1119ce79fb29 block: 1756214657
- current timestamp: 1756214657

## Description

add new celestia nitro wasmmoduleroot

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1756214657 (main branch discovery), not current.

```diff
    contract RollupProxy (eth:0xaA9904D4d4261dc0f927306f3f5c74439eBa0b90) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      usedTypes.0.arg.0x597de35fc2ee60e5b2840157370d037542d6a4bc587af7f88202636c54e6bd8d:
+        "Celestia Nitro ArbOS v40 wasmModuleRoot"
    }
```

Generated with discovered.json: 0xaa58561290d2875e66a3c2720d9859b07e34a81a

# Diff at Mon, 01 Sep 2025 10:01:10 GMT:

Merge mark

Generated with discovered.json: 0x1ab8f079a6693f8136a409a71560afc4dc7d6b6e

# Diff at Tue, 26 Aug 2025 13:27:11 GMT:

- chain: ethereum
- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@e10932be0db538f3a760bbc29232375f08915af7 block: 1755009465
- current timestamp: 1756214657

## Description

Conduit msig: removed one address

## Watched changes

```diff
    contract Conduit Multisig 1 (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      values.$members.2:
-        "eth:0x860e06Fe384D1A3340111e7D142E02642178c053"
      values.multisigThreshold:
-        "4 of 12 (33%)"
+        "4 of 11 (36%)"
    }
```

Generated with discovered.json: 0x614c1666b7d1a6a7d8abda68daf9a949fc5456db

# Diff at Tue, 12 Aug 2025 14:38:57 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@e94498235c6c8b45d3e4bfb77316081ba540850a block: 1752236867
- current timestamp: 1755009465

## Description

Conduit Multisig 1 signer added.

## Watched changes

```diff
    contract Conduit Multisig 1 (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      values.$members.0:
+        "eth:0xFe0ab87ebE03DD0bF52DaF34Dfda6639c335e2d4"
      values.multisigThreshold:
-        "4 of 11 (36%)"
+        "4 of 12 (33%)"
    }
```

Generated with discovered.json: 0x335586a0125b6c49d80fba35282171965a96c425

# Diff at Mon, 14 Jul 2025 12:44:59 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@9f4300dad2f3d080cd56fa311d4a848556c74e72 block: 22895934
- current block number: 22895934

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22895934 (main branch discovery), not current.

```diff
    contract SequencerInbox (0x0D51c6664A773873971336850C51A5caE8e63e89) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      address:
-        "0x0D51c6664A773873971336850C51A5caE8e63e89"
+        "eth:0x0D51c6664A773873971336850C51A5caE8e63e89"
      values.$admin:
-        "0x3b7F26ED562e21277c86ea0Ce40BC914653a3555"
+        "eth:0x3b7F26ED562e21277c86ea0Ce40BC914653a3555"
      values.$implementation:
-        "0x958985cf2c54f99ba4a599221A8090C1F9Cee9A5"
+        "eth:0x958985cf2c54f99ba4a599221A8090C1F9Cee9A5"
      values.$pastUpgrades.0.2.0:
-        "0x958985cf2c54f99ba4a599221A8090C1F9Cee9A5"
+        "eth:0x958985cf2c54f99ba4a599221A8090C1F9Cee9A5"
      values.batchPosterManager:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.batchPosters.0:
-        "0x11AaeeDd19D4daf99925231b982CA0A35F77d812"
+        "eth:0x11AaeeDd19D4daf99925231b982CA0A35F77d812"
      values.bridge:
-        "0x73CF739b0233027cd516998e177d473D0a45E037"
+        "eth:0x73CF739b0233027cd516998e177d473D0a45E037"
      values.reader4844:
-        "0x7Deda2425eC2d4EA0DF689A78de2fBF002075576"
+        "eth:0x7Deda2425eC2d4EA0DF689A78de2fBF002075576"
      values.rollup:
-        "0xaA9904D4d4261dc0f927306f3f5c74439eBa0b90"
+        "eth:0xaA9904D4d4261dc0f927306f3f5c74439eBa0b90"
      implementationNames.0x0D51c6664A773873971336850C51A5caE8e63e89:
-        "TransparentUpgradeableProxy"
      implementationNames.0x958985cf2c54f99ba4a599221A8090C1F9Cee9A5:
-        "SequencerInbox"
      implementationNames.eth:0x0D51c6664A773873971336850C51A5caE8e63e89:
+        "TransparentUpgradeableProxy"
      implementationNames.eth:0x958985cf2c54f99ba4a599221A8090C1F9Cee9A5:
+        "SequencerInbox"
    }
```

```diff
    EOA  (0x101d02006885979D2F32284c5847dF8616C24436) {
    +++ description: None
      address:
-        "0x101d02006885979D2F32284c5847dF8616C24436"
+        "eth:0x101d02006885979D2F32284c5847dF8616C24436"
    }
```

```diff
    EOA  (0x11AaeeDd19D4daf99925231b982CA0A35F77d812) {
    +++ description: None
      address:
-        "0x11AaeeDd19D4daf99925231b982CA0A35F77d812"
+        "eth:0x11AaeeDd19D4daf99925231b982CA0A35F77d812"
    }
```

```diff
    contract OneStepProverHostIo (0x17e7F68ce50A77e55C7834ddF31AEf86403B8010) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      address:
-        "0x17e7F68ce50A77e55C7834ddF31AEf86403B8010"
+        "eth:0x17e7F68ce50A77e55C7834ddF31AEf86403B8010"
      implementationNames.0x17e7F68ce50A77e55C7834ddF31AEf86403B8010:
-        "OneStepProverHostIo"
      implementationNames.eth:0x17e7F68ce50A77e55C7834ddF31AEf86403B8010:
+        "OneStepProverHostIo"
    }
```

```diff
    contract RollupEventInbox (0x191738BDecD7f73a79F64D689cf91ef873fb4172) {
    +++ description: Helper contract sending configuration data over the bridge during the systems initialization.
      address:
-        "0x191738BDecD7f73a79F64D689cf91ef873fb4172"
+        "eth:0x191738BDecD7f73a79F64D689cf91ef873fb4172"
      values.$admin:
-        "0x3b7F26ED562e21277c86ea0Ce40BC914653a3555"
+        "eth:0x3b7F26ED562e21277c86ea0Ce40BC914653a3555"
      values.$implementation:
-        "0x13BE515E44Eefaf3eBEFAD684F1FBB574Ac0A494"
+        "eth:0x13BE515E44Eefaf3eBEFAD684F1FBB574Ac0A494"
      values.$pastUpgrades.0.2.0:
-        "0x13BE515E44Eefaf3eBEFAD684F1FBB574Ac0A494"
+        "eth:0x13BE515E44Eefaf3eBEFAD684F1FBB574Ac0A494"
      values.bridge:
-        "0x73CF739b0233027cd516998e177d473D0a45E037"
+        "eth:0x73CF739b0233027cd516998e177d473D0a45E037"
      values.rollup:
-        "0xaA9904D4d4261dc0f927306f3f5c74439eBa0b90"
+        "eth:0xaA9904D4d4261dc0f927306f3f5c74439eBa0b90"
      implementationNames.0x191738BDecD7f73a79F64D689cf91ef873fb4172:
-        "TransparentUpgradeableProxy"
      implementationNames.0x13BE515E44Eefaf3eBEFAD684F1FBB574Ac0A494:
-        "RollupEventInbox"
      implementationNames.eth:0x191738BDecD7f73a79F64D689cf91ef873fb4172:
+        "TransparentUpgradeableProxy"
      implementationNames.eth:0x13BE515E44Eefaf3eBEFAD684F1FBB574Ac0A494:
+        "RollupEventInbox"
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
    EOA  (0x3840f487A17A41100DD1Bf0946c34f132a57Fd5f) {
    +++ description: None
      address:
-        "0x3840f487A17A41100DD1Bf0946c34f132a57Fd5f"
+        "eth:0x3840f487A17A41100DD1Bf0946c34f132a57Fd5f"
    }
```

```diff
    contract ProxyAdmin (0x3b7F26ED562e21277c86ea0Ce40BC914653a3555) {
    +++ description: None
      address:
-        "0x3b7F26ED562e21277c86ea0Ce40BC914653a3555"
+        "eth:0x3b7F26ED562e21277c86ea0Ce40BC914653a3555"
      values.owner:
-        "0xe3826907ed4f0A4F3D05d6CF5B0B8dCde91d6e0C"
+        "eth:0xe3826907ed4f0A4F3D05d6CF5B0B8dCde91d6e0C"
      implementationNames.0x3b7F26ED562e21277c86ea0Ce40BC914653a3555:
-        "ProxyAdmin"
      implementationNames.eth:0x3b7F26ED562e21277c86ea0Ce40BC914653a3555:
+        "ProxyAdmin"
    }
```

```diff
    contract Conduit Multisig 1 (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      address:
-        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
+        "eth:0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      values.$implementation:
-        "0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
+        "eth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
      values.$members.0:
-        "0x81175155D85377C337d92f1FA52Da166C3A4E7Ac"
+        "eth:0x81175155D85377C337d92f1FA52Da166C3A4E7Ac"
      values.$members.1:
-        "0x860e06Fe384D1A3340111e7D142E02642178c053"
+        "eth:0x860e06Fe384D1A3340111e7D142E02642178c053"
      values.$members.2:
-        "0x50930d652266EF4127FA3A1906B7Cb9951076628"
+        "eth:0x50930d652266EF4127FA3A1906B7Cb9951076628"
      values.$members.3:
-        "0xA0737fea60F0601A192E3d2c98865A883ab0bda2"
+        "eth:0xA0737fea60F0601A192E3d2c98865A883ab0bda2"
      values.$members.4:
-        "0xF3313C48BD8E17b823d5498D62F37019dFEA647D"
+        "eth:0xF3313C48BD8E17b823d5498D62F37019dFEA647D"
      values.$members.5:
-        "0xF0B77EaE7F2dabCC2571c7418406A0dCA3afA4f0"
+        "eth:0xF0B77EaE7F2dabCC2571c7418406A0dCA3afA4f0"
      values.$members.6:
-        "0xa4000bDD2bB92ce6750b31F1eeda47Bd1cB8e6e4"
+        "eth:0xa4000bDD2bB92ce6750b31F1eeda47Bd1cB8e6e4"
      values.$members.7:
-        "0x3840f487A17A41100DD1Bf0946c34f132a57Fd5f"
+        "eth:0x3840f487A17A41100DD1Bf0946c34f132a57Fd5f"
      values.$members.8:
-        "0xa0C600a6e85bf225958FFAcC70B5FDDF9A059038"
+        "eth:0xa0C600a6e85bf225958FFAcC70B5FDDF9A059038"
      values.$members.9:
-        "0xefCf0c8faFB425997870f845e26fC6cA6EE6dD5C"
+        "eth:0xefCf0c8faFB425997870f845e26fC6cA6EE6dD5C"
      values.$members.10:
-        "0x4D8007a0E9f293e62E2b0F43C6Cf4C4B9e135BAe"
+        "eth:0x4D8007a0E9f293e62E2b0F43C6Cf4C4B9e135BAe"
      implementationNames.0x4a4962275DF8C60a80d3a25faEc5AA7De116A746:
-        "GnosisSafeProxy"
      implementationNames.0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
-        "GnosisSafe"
      implementationNames.eth:0x4a4962275DF8C60a80d3a25faEc5AA7De116A746:
+        "GnosisSafeProxy"
      implementationNames.eth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
+        "GnosisSafe"
    }
```

```diff
    EOA  (0x4D8007a0E9f293e62E2b0F43C6Cf4C4B9e135BAe) {
    +++ description: None
      address:
-        "0x4D8007a0E9f293e62E2b0F43C6Cf4C4B9e135BAe"
+        "eth:0x4D8007a0E9f293e62E2b0F43C6Cf4C4B9e135BAe"
    }
```

```diff
    EOA  (0x50930d652266EF4127FA3A1906B7Cb9951076628) {
    +++ description: None
      address:
-        "0x50930d652266EF4127FA3A1906B7Cb9951076628"
+        "eth:0x50930d652266EF4127FA3A1906B7Cb9951076628"
    }
```

```diff
    contract OneStepProofEntry (0x57EA090Ac0554d174AE0e2855B460e84A1A7C221) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      address:
-        "0x57EA090Ac0554d174AE0e2855B460e84A1A7C221"
+        "eth:0x57EA090Ac0554d174AE0e2855B460e84A1A7C221"
      values.prover0:
-        "0x72B166070781a552D7b95a907eF59ca05d3D5a62"
+        "eth:0x72B166070781a552D7b95a907eF59ca05d3D5a62"
      values.proverHostIo:
-        "0x17e7F68ce50A77e55C7834ddF31AEf86403B8010"
+        "eth:0x17e7F68ce50A77e55C7834ddF31AEf86403B8010"
      values.proverMath:
-        "0x90eC62De2EB7C7512a22bD2D55926AD6bA609F38"
+        "eth:0x90eC62De2EB7C7512a22bD2D55926AD6bA609F38"
      values.proverMem:
-        "0x8b73Ef238ADaB31EBC7c05423d243c345241a22f"
+        "eth:0x8b73Ef238ADaB31EBC7c05423d243c345241a22f"
      implementationNames.0x57EA090Ac0554d174AE0e2855B460e84A1A7C221:
-        "OneStepProofEntry"
      implementationNames.eth:0x57EA090Ac0554d174AE0e2855B460e84A1A7C221:
+        "OneStepProofEntry"
    }
```

```diff
    contract OneStepProver0 (0x72B166070781a552D7b95a907eF59ca05d3D5a62) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      address:
-        "0x72B166070781a552D7b95a907eF59ca05d3D5a62"
+        "eth:0x72B166070781a552D7b95a907eF59ca05d3D5a62"
      implementationNames.0x72B166070781a552D7b95a907eF59ca05d3D5a62:
-        "OneStepProver0"
      implementationNames.eth:0x72B166070781a552D7b95a907eF59ca05d3D5a62:
+        "OneStepProver0"
    }
```

```diff
    contract Bridge (0x73CF739b0233027cd516998e177d473D0a45E037) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      address:
-        "0x73CF739b0233027cd516998e177d473D0a45E037"
+        "eth:0x73CF739b0233027cd516998e177d473D0a45E037"
      values.$admin:
-        "0x3b7F26ED562e21277c86ea0Ce40BC914653a3555"
+        "eth:0x3b7F26ED562e21277c86ea0Ce40BC914653a3555"
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
-        "0xeb8307Fc8c1bEe7DfDCedf7e8c85778a81CB150f"
+        "eth:0xeb8307Fc8c1bEe7DfDCedf7e8c85778a81CB150f"
+++ description: Allowed to mint the gastoken on L2 and call `enqueueDelayedMessage()` on the bridge.
+++ severity: HIGH
      values.allowedDelayedInboxList.1:
-        "0x191738BDecD7f73a79F64D689cf91ef873fb4172"
+        "eth:0x191738BDecD7f73a79F64D689cf91ef873fb4172"
+++ description: Can make calls as the bridge, steal all funds.
+++ severity: HIGH
      values.allowedOutboxList.0:
-        "0xf2dC65BdDb21c5DCC070067434D34a342907b5aE"
+        "eth:0xf2dC65BdDb21c5DCC070067434D34a342907b5aE"
+++ description: All Inboxes that were ever set as allowed in the bridge.
+++ severity: HIGH
      values.inboxHistory.0:
-        "0xeb8307Fc8c1bEe7DfDCedf7e8c85778a81CB150f"
+        "eth:0xeb8307Fc8c1bEe7DfDCedf7e8c85778a81CB150f"
+++ description: All Inboxes that were ever set as allowed in the bridge.
+++ severity: HIGH
      values.inboxHistory.1:
-        "0x191738BDecD7f73a79F64D689cf91ef873fb4172"
+        "eth:0x191738BDecD7f73a79F64D689cf91ef873fb4172"
+++ description: All Outboxes that were ever set as allowed in the bridge.
+++ severity: HIGH
      values.outboxHistory.0:
-        "0xf2dC65BdDb21c5DCC070067434D34a342907b5aE"
+        "eth:0xf2dC65BdDb21c5DCC070067434D34a342907b5aE"
      values.rollup:
-        "0xaA9904D4d4261dc0f927306f3f5c74439eBa0b90"
+        "eth:0xaA9904D4d4261dc0f927306f3f5c74439eBa0b90"
      values.sequencerInbox:
-        "0x0D51c6664A773873971336850C51A5caE8e63e89"
+        "eth:0x0D51c6664A773873971336850C51A5caE8e63e89"
      implementationNames.0x73CF739b0233027cd516998e177d473D0a45E037:
-        "TransparentUpgradeableProxy"
      implementationNames.0x1c6ACCd9d66f3B993928E7439c9A2d67b94a445F:
-        "Bridge"
      implementationNames.eth:0x73CF739b0233027cd516998e177d473D0a45E037:
+        "TransparentUpgradeableProxy"
      implementationNames.eth:0x1c6ACCd9d66f3B993928E7439c9A2d67b94a445F:
+        "Bridge"
    }
```

```diff
    EOA  (0x81175155D85377C337d92f1FA52Da166C3A4E7Ac) {
    +++ description: None
      address:
-        "0x81175155D85377C337d92f1FA52Da166C3A4E7Ac"
+        "eth:0x81175155D85377C337d92f1FA52Da166C3A4E7Ac"
    }
```

```diff
    EOA  (0x860e06Fe384D1A3340111e7D142E02642178c053) {
    +++ description: None
      address:
-        "0x860e06Fe384D1A3340111e7D142E02642178c053"
+        "eth:0x860e06Fe384D1A3340111e7D142E02642178c053"
    }
```

```diff
    contract OneStepProverMemory (0x8b73Ef238ADaB31EBC7c05423d243c345241a22f) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      address:
-        "0x8b73Ef238ADaB31EBC7c05423d243c345241a22f"
+        "eth:0x8b73Ef238ADaB31EBC7c05423d243c345241a22f"
      implementationNames.0x8b73Ef238ADaB31EBC7c05423d243c345241a22f:
-        "OneStepProverMemory"
      implementationNames.eth:0x8b73Ef238ADaB31EBC7c05423d243c345241a22f:
+        "OneStepProverMemory"
    }
```

```diff
    contract OneStepProverMath (0x90eC62De2EB7C7512a22bD2D55926AD6bA609F38) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      address:
-        "0x90eC62De2EB7C7512a22bD2D55926AD6bA609F38"
+        "eth:0x90eC62De2EB7C7512a22bD2D55926AD6bA609F38"
      implementationNames.0x90eC62De2EB7C7512a22bD2D55926AD6bA609F38:
-        "OneStepProverMath"
      implementationNames.eth:0x90eC62De2EB7C7512a22bD2D55926AD6bA609F38:
+        "OneStepProverMath"
    }
```

```diff
    EOA  (0xA0737fea60F0601A192E3d2c98865A883ab0bda2) {
    +++ description: None
      address:
-        "0xA0737fea60F0601A192E3d2c98865A883ab0bda2"
+        "eth:0xA0737fea60F0601A192E3d2c98865A883ab0bda2"
    }
```

```diff
    EOA  (0xa0C600a6e85bf225958FFAcC70B5FDDF9A059038) {
    +++ description: None
      address:
-        "0xa0C600a6e85bf225958FFAcC70B5FDDF9A059038"
+        "eth:0xa0C600a6e85bf225958FFAcC70B5FDDF9A059038"
    }
```

```diff
    EOA  (0xa4000bDD2bB92ce6750b31F1eeda47Bd1cB8e6e4) {
    +++ description: None
      address:
-        "0xa4000bDD2bB92ce6750b31F1eeda47Bd1cB8e6e4"
+        "eth:0xa4000bDD2bB92ce6750b31F1eeda47Bd1cB8e6e4"
    }
```

```diff
    contract RollupProxy (0xaA9904D4d4261dc0f927306f3f5c74439eBa0b90) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      address:
-        "0xaA9904D4d4261dc0f927306f3f5c74439eBa0b90"
+        "eth:0xaA9904D4d4261dc0f927306f3f5c74439eBa0b90"
      values.$admin:
-        "0xe3826907ed4f0A4F3D05d6CF5B0B8dCde91d6e0C"
+        "eth:0xe3826907ed4f0A4F3D05d6CF5B0B8dCde91d6e0C"
      values.$implementation.0:
-        "0x0aE4dD666748bF0F6dB5c149Eab1D8aD27820A6A"
+        "eth:0x0aE4dD666748bF0F6dB5c149Eab1D8aD27820A6A"
      values.$implementation.1:
-        "0x660ea1675F7323dC3Ba0c8dDFB593225Eb01E3C1"
+        "eth:0x660ea1675F7323dC3Ba0c8dDFB593225Eb01E3C1"
      values.$pastUpgrades.0.2.0:
-        "0x0aE4dD666748bF0F6dB5c149Eab1D8aD27820A6A"
+        "eth:0x0aE4dD666748bF0F6dB5c149Eab1D8aD27820A6A"
      values.$pastUpgrades.0.2.1:
-        "0x660ea1675F7323dC3Ba0c8dDFB593225Eb01E3C1"
+        "eth:0x660ea1675F7323dC3Ba0c8dDFB593225Eb01E3C1"
      values.bridge:
-        "0x73CF739b0233027cd516998e177d473D0a45E037"
+        "eth:0x73CF739b0233027cd516998e177d473D0a45E037"
      values.challengeManager:
-        "0xf39A1d1Bf489bA959ca6A0e6Fa4A1887Fe526c81"
+        "eth:0xf39A1d1Bf489bA959ca6A0e6Fa4A1887Fe526c81"
      values.inbox:
-        "0xeb8307Fc8c1bEe7DfDCedf7e8c85778a81CB150f"
+        "eth:0xeb8307Fc8c1bEe7DfDCedf7e8c85778a81CB150f"
      values.loserStakeEscrow:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.outbox:
-        "0xf2dC65BdDb21c5DCC070067434D34a342907b5aE"
+        "eth:0xf2dC65BdDb21c5DCC070067434D34a342907b5aE"
      values.owner:
-        "0xe3826907ed4f0A4F3D05d6CF5B0B8dCde91d6e0C"
+        "eth:0xe3826907ed4f0A4F3D05d6CF5B0B8dCde91d6e0C"
      values.rollupEventInbox:
-        "0x191738BDecD7f73a79F64D689cf91ef873fb4172"
+        "eth:0x191738BDecD7f73a79F64D689cf91ef873fb4172"
      values.sequencerInbox:
-        "0x0D51c6664A773873971336850C51A5caE8e63e89"
+        "eth:0x0D51c6664A773873971336850C51A5caE8e63e89"
      values.stakeToken:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.validators.0:
-        "0x101d02006885979D2F32284c5847dF8616C24436"
+        "eth:0x101d02006885979D2F32284c5847dF8616C24436"
      values.validatorUtils:
-        "0x2b0E04Dc90e3fA58165CB41E2834B44A56E766aF"
+        "eth:0x2b0E04Dc90e3fA58165CB41E2834B44A56E766aF"
      values.validatorWalletCreator:
-        "0x9CAd81628aB7D8e239F1A5B497313341578c5F71"
+        "eth:0x9CAd81628aB7D8e239F1A5B497313341578c5F71"
      implementationNames.0xaA9904D4d4261dc0f927306f3f5c74439eBa0b90:
-        "RollupProxy"
      implementationNames.0x0aE4dD666748bF0F6dB5c149Eab1D8aD27820A6A:
-        "RollupAdminLogic"
      implementationNames.0x660ea1675F7323dC3Ba0c8dDFB593225Eb01E3C1:
-        "RollupUserLogic"
      implementationNames.eth:0xaA9904D4d4261dc0f927306f3f5c74439eBa0b90:
+        "RollupProxy"
      implementationNames.eth:0x0aE4dD666748bF0F6dB5c149Eab1D8aD27820A6A:
+        "RollupAdminLogic"
      implementationNames.eth:0x660ea1675F7323dC3Ba0c8dDFB593225Eb01E3C1:
+        "RollupUserLogic"
    }
```

```diff
    contract UpgradeExecutor (0xe3826907ed4f0A4F3D05d6CF5B0B8dCde91d6e0C) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      address:
-        "0xe3826907ed4f0A4F3D05d6CF5B0B8dCde91d6e0C"
+        "eth:0xe3826907ed4f0A4F3D05d6CF5B0B8dCde91d6e0C"
      values.$admin:
-        "0x3b7F26ED562e21277c86ea0Ce40BC914653a3555"
+        "eth:0x3b7F26ED562e21277c86ea0Ce40BC914653a3555"
      values.$implementation:
-        "0x6c21303F5986180B1394d2C89f3e883890E2867b"
+        "eth:0x6c21303F5986180B1394d2C89f3e883890E2867b"
      values.$pastUpgrades.0.2.0:
-        "0x6c21303F5986180B1394d2C89f3e883890E2867b"
+        "eth:0x6c21303F5986180B1394d2C89f3e883890E2867b"
      values.accessControl.ADMIN_ROLE.members.0:
-        "0xe3826907ed4f0A4F3D05d6CF5B0B8dCde91d6e0C"
+        "eth:0xe3826907ed4f0A4F3D05d6CF5B0B8dCde91d6e0C"
      values.accessControl.EXECUTOR_ROLE.members.0:
-        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
+        "eth:0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      values.executors.0:
-        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
+        "eth:0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      implementationNames.0xe3826907ed4f0A4F3D05d6CF5B0B8dCde91d6e0C:
-        "TransparentUpgradeableProxy"
      implementationNames.0x6c21303F5986180B1394d2C89f3e883890E2867b:
-        "UpgradeExecutor"
      implementationNames.eth:0xe3826907ed4f0A4F3D05d6CF5B0B8dCde91d6e0C:
+        "TransparentUpgradeableProxy"
      implementationNames.eth:0x6c21303F5986180B1394d2C89f3e883890E2867b:
+        "UpgradeExecutor"
    }
```

```diff
    contract Inbox (0xeb8307Fc8c1bEe7DfDCedf7e8c85778a81CB150f) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      address:
-        "0xeb8307Fc8c1bEe7DfDCedf7e8c85778a81CB150f"
+        "eth:0xeb8307Fc8c1bEe7DfDCedf7e8c85778a81CB150f"
      values.$admin:
-        "0x3b7F26ED562e21277c86ea0Ce40BC914653a3555"
+        "eth:0x3b7F26ED562e21277c86ea0Ce40BC914653a3555"
      values.$implementation:
-        "0x1162084C3C6575121146582Db5BE43189e8CEe6b"
+        "eth:0x1162084C3C6575121146582Db5BE43189e8CEe6b"
      values.$pastUpgrades.0.2.0:
-        "0x1162084C3C6575121146582Db5BE43189e8CEe6b"
+        "eth:0x1162084C3C6575121146582Db5BE43189e8CEe6b"
      values.bridge:
-        "0x73CF739b0233027cd516998e177d473D0a45E037"
+        "eth:0x73CF739b0233027cd516998e177d473D0a45E037"
      values.getProxyAdmin:
-        "0x3b7F26ED562e21277c86ea0Ce40BC914653a3555"
+        "eth:0x3b7F26ED562e21277c86ea0Ce40BC914653a3555"
      values.sequencerInbox:
-        "0x0D51c6664A773873971336850C51A5caE8e63e89"
+        "eth:0x0D51c6664A773873971336850C51A5caE8e63e89"
      implementationNames.0xeb8307Fc8c1bEe7DfDCedf7e8c85778a81CB150f:
-        "TransparentUpgradeableProxy"
      implementationNames.0x1162084C3C6575121146582Db5BE43189e8CEe6b:
-        "Inbox"
      implementationNames.eth:0xeb8307Fc8c1bEe7DfDCedf7e8c85778a81CB150f:
+        "TransparentUpgradeableProxy"
      implementationNames.eth:0x1162084C3C6575121146582Db5BE43189e8CEe6b:
+        "Inbox"
    }
```

```diff
    EOA  (0xefCf0c8faFB425997870f845e26fC6cA6EE6dD5C) {
    +++ description: None
      address:
-        "0xefCf0c8faFB425997870f845e26fC6cA6EE6dD5C"
+        "eth:0xefCf0c8faFB425997870f845e26fC6cA6EE6dD5C"
    }
```

```diff
    EOA  (0xF0B77EaE7F2dabCC2571c7418406A0dCA3afA4f0) {
    +++ description: None
      address:
-        "0xF0B77EaE7F2dabCC2571c7418406A0dCA3afA4f0"
+        "eth:0xF0B77EaE7F2dabCC2571c7418406A0dCA3afA4f0"
    }
```

```diff
    contract Outbox (0xf2dC65BdDb21c5DCC070067434D34a342907b5aE) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
      address:
-        "0xf2dC65BdDb21c5DCC070067434D34a342907b5aE"
+        "eth:0xf2dC65BdDb21c5DCC070067434D34a342907b5aE"
      values.$admin:
-        "0x3b7F26ED562e21277c86ea0Ce40BC914653a3555"
+        "eth:0x3b7F26ED562e21277c86ea0Ce40BC914653a3555"
      values.$implementation:
-        "0x2a6DD4433ffa96dc1755814FC0d9cc83A5F68DeC"
+        "eth:0x2a6DD4433ffa96dc1755814FC0d9cc83A5F68DeC"
      values.$pastUpgrades.0.2.0:
-        "0x2a6DD4433ffa96dc1755814FC0d9cc83A5F68DeC"
+        "eth:0x2a6DD4433ffa96dc1755814FC0d9cc83A5F68DeC"
      values.bridge:
-        "0x73CF739b0233027cd516998e177d473D0a45E037"
+        "eth:0x73CF739b0233027cd516998e177d473D0a45E037"
      values.l2ToL1Sender:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.rollup:
-        "0xaA9904D4d4261dc0f927306f3f5c74439eBa0b90"
+        "eth:0xaA9904D4d4261dc0f927306f3f5c74439eBa0b90"
      implementationNames.0xf2dC65BdDb21c5DCC070067434D34a342907b5aE:
-        "TransparentUpgradeableProxy"
      implementationNames.0x2a6DD4433ffa96dc1755814FC0d9cc83A5F68DeC:
-        "Outbox"
      implementationNames.eth:0xf2dC65BdDb21c5DCC070067434D34a342907b5aE:
+        "TransparentUpgradeableProxy"
      implementationNames.eth:0x2a6DD4433ffa96dc1755814FC0d9cc83A5F68DeC:
+        "Outbox"
    }
```

```diff
    EOA  (0xF3313C48BD8E17b823d5498D62F37019dFEA647D) {
    +++ description: None
      address:
-        "0xF3313C48BD8E17b823d5498D62F37019dFEA647D"
+        "eth:0xF3313C48BD8E17b823d5498D62F37019dFEA647D"
    }
```

```diff
    contract ChallengeManager (0xf39A1d1Bf489bA959ca6A0e6Fa4A1887Fe526c81) {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      address:
-        "0xf39A1d1Bf489bA959ca6A0e6Fa4A1887Fe526c81"
+        "eth:0xf39A1d1Bf489bA959ca6A0e6Fa4A1887Fe526c81"
      values.$admin:
-        "0x3b7F26ED562e21277c86ea0Ce40BC914653a3555"
+        "eth:0x3b7F26ED562e21277c86ea0Ce40BC914653a3555"
      values.$implementation:
-        "0x1D901DD7A5eFE421C3C437B147040E5AF22E6A43"
+        "eth:0x1D901DD7A5eFE421C3C437B147040E5AF22E6A43"
      values.$pastUpgrades.0.2.0:
-        "0x1D901DD7A5eFE421C3C437B147040E5AF22E6A43"
+        "eth:0x1D901DD7A5eFE421C3C437B147040E5AF22E6A43"
      values.bridge:
-        "0x73CF739b0233027cd516998e177d473D0a45E037"
+        "eth:0x73CF739b0233027cd516998e177d473D0a45E037"
      values.osp:
-        "0x57EA090Ac0554d174AE0e2855B460e84A1A7C221"
+        "eth:0x57EA090Ac0554d174AE0e2855B460e84A1A7C221"
      values.resultReceiver:
-        "0xaA9904D4d4261dc0f927306f3f5c74439eBa0b90"
+        "eth:0xaA9904D4d4261dc0f927306f3f5c74439eBa0b90"
      values.sequencerInbox:
-        "0x0D51c6664A773873971336850C51A5caE8e63e89"
+        "eth:0x0D51c6664A773873971336850C51A5caE8e63e89"
      implementationNames.0xf39A1d1Bf489bA959ca6A0e6Fa4A1887Fe526c81:
-        "TransparentUpgradeableProxy"
      implementationNames.0x1D901DD7A5eFE421C3C437B147040E5AF22E6A43:
-        "ChallengeManager"
      implementationNames.eth:0xf39A1d1Bf489bA959ca6A0e6Fa4A1887Fe526c81:
+        "TransparentUpgradeableProxy"
      implementationNames.eth:0x1D901DD7A5eFE421C3C437B147040E5AF22E6A43:
+        "ChallengeManager"
    }
```

```diff
+   Status: CREATED
    contract SequencerInbox (0x0D51c6664A773873971336850C51A5caE8e63e89)
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
```

```diff
+   Status: CREATED
    contract OneStepProverHostIo (0x17e7F68ce50A77e55C7834ddF31AEf86403B8010)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract RollupEventInbox (0x191738BDecD7f73a79F64D689cf91ef873fb4172)
    +++ description: Helper contract sending configuration data over the bridge during the systems initialization.
```

```diff
+   Status: CREATED
    contract ValidatorUtils (0x2b0E04Dc90e3fA58165CB41E2834B44A56E766aF)
    +++ description: This contract implements view only utilities for validators.
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x3b7F26ED562e21277c86ea0Ce40BC914653a3555)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Conduit Multisig 1 (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746)
    +++ description: None
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
    contract Bridge (0x73CF739b0233027cd516998e177d473D0a45E037)
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
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

```diff
+   Status: CREATED
    contract RollupProxy (0xaA9904D4d4261dc0f927306f3f5c74439eBa0b90)
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
```

```diff
+   Status: CREATED
    contract UpgradeExecutor (0xe3826907ed4f0A4F3D05d6CF5B0B8dCde91d6e0C)
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
```

```diff
+   Status: CREATED
    contract Inbox (0xeb8307Fc8c1bEe7DfDCedf7e8c85778a81CB150f)
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
```

```diff
+   Status: CREATED
    contract Outbox (0xf2dC65BdDb21c5DCC070067434D34a342907b5aE)
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
```

```diff
+   Status: CREATED
    contract ChallengeManager (0xf39A1d1Bf489bA959ca6A0e6Fa4A1887Fe526c81)
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
```

Generated with discovered.json: 0xf79aaf25c796f5ff399fcac043980ca7fd3fd93e

# Diff at Fri, 04 Jul 2025 12:18:58 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f56dc47fe915564d4555300304da4d3bcbc087f block: 22615664
- current block number: 22615664

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22615664 (main branch discovery), not current.

```diff
    EOA  (0x101d02006885979D2F32284c5847dF8616C24436) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0xaA9904D4d4261dc0f927306f3f5c74439eBa0b90"
+        "eth:0xaA9904D4d4261dc0f927306f3f5c74439eBa0b90"
    }
```

```diff
    EOA  (0x11AaeeDd19D4daf99925231b982CA0A35F77d812) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0x0D51c6664A773873971336850C51A5caE8e63e89"
+        "eth:0x0D51c6664A773873971336850C51A5caE8e63e89"
    }
```

```diff
    contract ProxyAdmin (0x3b7F26ED562e21277c86ea0Ce40BC914653a3555) {
    +++ description: None
      directlyReceivedPermissions.0.from:
-        "ethereum:0x0D51c6664A773873971336850C51A5caE8e63e89"
+        "eth:0x0D51c6664A773873971336850C51A5caE8e63e89"
      directlyReceivedPermissions.1.from:
-        "ethereum:0x191738BDecD7f73a79F64D689cf91ef873fb4172"
+        "eth:0x191738BDecD7f73a79F64D689cf91ef873fb4172"
      directlyReceivedPermissions.2.from:
-        "ethereum:0x73CF739b0233027cd516998e177d473D0a45E037"
+        "eth:0x73CF739b0233027cd516998e177d473D0a45E037"
      directlyReceivedPermissions.3.from:
-        "ethereum:0xe3826907ed4f0A4F3D05d6CF5B0B8dCde91d6e0C"
+        "eth:0xe3826907ed4f0A4F3D05d6CF5B0B8dCde91d6e0C"
      directlyReceivedPermissions.4.from:
-        "ethereum:0xeb8307Fc8c1bEe7DfDCedf7e8c85778a81CB150f"
+        "eth:0xeb8307Fc8c1bEe7DfDCedf7e8c85778a81CB150f"
      directlyReceivedPermissions.5.from:
-        "ethereum:0xf2dC65BdDb21c5DCC070067434D34a342907b5aE"
+        "eth:0xf2dC65BdDb21c5DCC070067434D34a342907b5aE"
      directlyReceivedPermissions.6.from:
-        "ethereum:0xf39A1d1Bf489bA959ca6A0e6Fa4A1887Fe526c81"
+        "eth:0xf39A1d1Bf489bA959ca6A0e6Fa4A1887Fe526c81"
    }
```

```diff
    contract Conduit Multisig 1 (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      receivedPermissions.0.via.0.address:
-        "ethereum:0xe3826907ed4f0A4F3D05d6CF5B0B8dCde91d6e0C"
+        "eth:0xe3826907ed4f0A4F3D05d6CF5B0B8dCde91d6e0C"
      receivedPermissions.0.from:
-        "ethereum:0xaA9904D4d4261dc0f927306f3f5c74439eBa0b90"
+        "eth:0xaA9904D4d4261dc0f927306f3f5c74439eBa0b90"
      receivedPermissions.1.via.1.address:
-        "ethereum:0xe3826907ed4f0A4F3D05d6CF5B0B8dCde91d6e0C"
+        "eth:0xe3826907ed4f0A4F3D05d6CF5B0B8dCde91d6e0C"
      receivedPermissions.1.via.0.address:
-        "ethereum:0x3b7F26ED562e21277c86ea0Ce40BC914653a3555"
+        "eth:0x3b7F26ED562e21277c86ea0Ce40BC914653a3555"
      receivedPermissions.1.from:
-        "ethereum:0x0D51c6664A773873971336850C51A5caE8e63e89"
+        "eth:0x0D51c6664A773873971336850C51A5caE8e63e89"
      receivedPermissions.2.via.1.address:
-        "ethereum:0xe3826907ed4f0A4F3D05d6CF5B0B8dCde91d6e0C"
+        "eth:0xe3826907ed4f0A4F3D05d6CF5B0B8dCde91d6e0C"
      receivedPermissions.2.via.0.address:
-        "ethereum:0x3b7F26ED562e21277c86ea0Ce40BC914653a3555"
+        "eth:0x3b7F26ED562e21277c86ea0Ce40BC914653a3555"
      receivedPermissions.2.from:
-        "ethereum:0x191738BDecD7f73a79F64D689cf91ef873fb4172"
+        "eth:0x191738BDecD7f73a79F64D689cf91ef873fb4172"
      receivedPermissions.3.via.1.address:
-        "ethereum:0xe3826907ed4f0A4F3D05d6CF5B0B8dCde91d6e0C"
+        "eth:0xe3826907ed4f0A4F3D05d6CF5B0B8dCde91d6e0C"
      receivedPermissions.3.via.0.address:
-        "ethereum:0x3b7F26ED562e21277c86ea0Ce40BC914653a3555"
+        "eth:0x3b7F26ED562e21277c86ea0Ce40BC914653a3555"
      receivedPermissions.3.from:
-        "ethereum:0x73CF739b0233027cd516998e177d473D0a45E037"
+        "eth:0x73CF739b0233027cd516998e177d473D0a45E037"
      receivedPermissions.4.via.0.address:
-        "ethereum:0xe3826907ed4f0A4F3D05d6CF5B0B8dCde91d6e0C"
+        "eth:0xe3826907ed4f0A4F3D05d6CF5B0B8dCde91d6e0C"
      receivedPermissions.4.from:
-        "ethereum:0xaA9904D4d4261dc0f927306f3f5c74439eBa0b90"
+        "eth:0xaA9904D4d4261dc0f927306f3f5c74439eBa0b90"
      receivedPermissions.5.via.1.address:
-        "ethereum:0xe3826907ed4f0A4F3D05d6CF5B0B8dCde91d6e0C"
+        "eth:0xe3826907ed4f0A4F3D05d6CF5B0B8dCde91d6e0C"
      receivedPermissions.5.via.0.address:
-        "ethereum:0x3b7F26ED562e21277c86ea0Ce40BC914653a3555"
+        "eth:0x3b7F26ED562e21277c86ea0Ce40BC914653a3555"
      receivedPermissions.5.from:
-        "ethereum:0xe3826907ed4f0A4F3D05d6CF5B0B8dCde91d6e0C"
+        "eth:0xe3826907ed4f0A4F3D05d6CF5B0B8dCde91d6e0C"
      receivedPermissions.6.via.1.address:
-        "ethereum:0xe3826907ed4f0A4F3D05d6CF5B0B8dCde91d6e0C"
+        "eth:0xe3826907ed4f0A4F3D05d6CF5B0B8dCde91d6e0C"
      receivedPermissions.6.via.0.address:
-        "ethereum:0x3b7F26ED562e21277c86ea0Ce40BC914653a3555"
+        "eth:0x3b7F26ED562e21277c86ea0Ce40BC914653a3555"
      receivedPermissions.6.from:
-        "ethereum:0xeb8307Fc8c1bEe7DfDCedf7e8c85778a81CB150f"
+        "eth:0xeb8307Fc8c1bEe7DfDCedf7e8c85778a81CB150f"
      receivedPermissions.7.via.1.address:
-        "ethereum:0xe3826907ed4f0A4F3D05d6CF5B0B8dCde91d6e0C"
+        "eth:0xe3826907ed4f0A4F3D05d6CF5B0B8dCde91d6e0C"
      receivedPermissions.7.via.0.address:
-        "ethereum:0x3b7F26ED562e21277c86ea0Ce40BC914653a3555"
+        "eth:0x3b7F26ED562e21277c86ea0Ce40BC914653a3555"
      receivedPermissions.7.from:
-        "ethereum:0xf2dC65BdDb21c5DCC070067434D34a342907b5aE"
+        "eth:0xf2dC65BdDb21c5DCC070067434D34a342907b5aE"
      receivedPermissions.8.via.1.address:
-        "ethereum:0xe3826907ed4f0A4F3D05d6CF5B0B8dCde91d6e0C"
+        "eth:0xe3826907ed4f0A4F3D05d6CF5B0B8dCde91d6e0C"
      receivedPermissions.8.via.0.address:
-        "ethereum:0x3b7F26ED562e21277c86ea0Ce40BC914653a3555"
+        "eth:0x3b7F26ED562e21277c86ea0Ce40BC914653a3555"
      receivedPermissions.8.from:
-        "ethereum:0xf39A1d1Bf489bA959ca6A0e6Fa4A1887Fe526c81"
+        "eth:0xf39A1d1Bf489bA959ca6A0e6Fa4A1887Fe526c81"
      directlyReceivedPermissions.0.from:
-        "ethereum:0xe3826907ed4f0A4F3D05d6CF5B0B8dCde91d6e0C"
+        "eth:0xe3826907ed4f0A4F3D05d6CF5B0B8dCde91d6e0C"
    }
```

```diff
    contract UpgradeExecutor (0xe3826907ed4f0A4F3D05d6CF5B0B8dCde91d6e0C) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      directlyReceivedPermissions.0.from:
-        "ethereum:0x3b7F26ED562e21277c86ea0Ce40BC914653a3555"
+        "eth:0x3b7F26ED562e21277c86ea0Ce40BC914653a3555"
      directlyReceivedPermissions.1.from:
-        "ethereum:0xaA9904D4d4261dc0f927306f3f5c74439eBa0b90"
+        "eth:0xaA9904D4d4261dc0f927306f3f5c74439eBa0b90"
      directlyReceivedPermissions.2.from:
-        "ethereum:0xaA9904D4d4261dc0f927306f3f5c74439eBa0b90"
+        "eth:0xaA9904D4d4261dc0f927306f3f5c74439eBa0b90"
    }
```

Generated with discovered.json: 0x4976ab1b0a9c1cf747175dbdaa53d11262e515d1

# Diff at Wed, 18 Jun 2025 12:22:43 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@a8e4f22a1441bd5040898cc3d3d62b3582942b65 block: 22615664
- current block number: 22615664

## Description

config: wasmmoduleroot map updated.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22615664 (main branch discovery), not current.

```diff
    contract RollupProxy (0xaA9904D4d4261dc0f927306f3f5c74439eBa0b90) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      usedTypes.0.arg.0xdb698a2576298f25448bc092e52cf13b1e24141c997135d70f217d674bbeb69a:
+        "ArbOS v40 wasmModuleRoot"
    }
```

Generated with discovered.json: 0x5b5f124e6f2fbe98cf58c4767eff8154b81550d1

# Diff at Mon, 02 Jun 2025 07:59:58 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@2fee84b782a329885c84742cf9cf43143842a2d5 block: 22046061
- current block number: 22615664

## Description

conduit ms signer change.

## Watched changes

```diff
    contract Conduit Multisig 1 (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      values.$members.10:
+        "0xA0737fea60F0601A192E3d2c98865A883ab0bda2"
      values.$members.9:
-        "0xA0737fea60F0601A192E3d2c98865A883ab0bda2"
+        "0xa0C600a6e85bf225958FFAcC70B5FDDF9A059038"
      values.$members.8:
-        "0xa0C600a6e85bf225958FFAcC70B5FDDF9A059038"
+        "0xF3313C48BD8E17b823d5498D62F37019dFEA647D"
      values.$members.7:
-        "0xF3313C48BD8E17b823d5498D62F37019dFEA647D"
+        "0xefCf0c8faFB425997870f845e26fC6cA6EE6dD5C"
      values.$members.6:
-        "0xefCf0c8faFB425997870f845e26fC6cA6EE6dD5C"
+        "0x81175155D85377C337d92f1FA52Da166C3A4E7Ac"
      values.multisigThreshold:
-        "4 of 10 (40%)"
+        "4 of 11 (36%)"
    }
```

Generated with discovered.json: 0x113cfc8486d2f77fcbf9076763a17588caaf2e58

# Diff at Tue, 27 May 2025 08:26:47 GMT:

- chain: ethereum
- author: Michał Podsiadły (<michal.podsiadly@l2beat.com>)
- comparing to: main@fd658a9ed4bbd45fc5705d23b1906ca057d0d8b0 block: 22046061
- current block number: 22046061

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22046061 (main branch discovery), not current.

```diff
    contract RollupProxy (0xaA9904D4d4261dc0f927306f3f5c74439eBa0b90) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      sourceHashes.2:
-        "0xb8da0b3748daac768860783e8555198fd2d1bbdffb775b81557a7124890c7eca"
      sourceHashes.1:
-        "0xef94a66bd5339efd18fb9ca1f8031482e7ef7bbe6c5a0a10fae254ab83712406"
+        "0xb8da0b3748daac768860783e8555198fd2d1bbdffb775b81557a7124890c7eca"
      sourceHashes.0:
-        "0x8b48118fe606012c0dcac2ccc1821785935aec89fab8f219f47b32c482b0017e"
+        "0xfbf01ed91f0ada67ada9da90349955390605db30f011c04fc849ea93d40d9587"
    }
```

Generated with discovered.json: 0x703c9ce8918ef7c93a8128a22084341521843841

# Diff at Fri, 23 May 2025 09:40:55 GMT:

- chain: ethereum
- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@69cd181abbc3c830a6caf2f4429b37cae72ffdb8 block: 22046061
- current block number: 22046061

## Description

Introduced .role field on each permission, defaulting to field name on which it was defined (with '.' prefix)

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22046061 (main branch discovery), not current.

```diff
    EOA  (0x101d02006885979D2F32284c5847dF8616C24436) {
    +++ description: None
      receivedPermissions.0.role:
+        ".validators"
    }
```

```diff
    EOA  (0x11AaeeDd19D4daf99925231b982CA0A35F77d812) {
    +++ description: None
      receivedPermissions.0.role:
+        ".batchPosters"
    }
```

```diff
    contract ProxyAdmin (0x3b7F26ED562e21277c86ea0Ce40BC914653a3555) {
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
    contract Conduit Multisig 1 (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
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
      receivedPermissions.1.permission:
-        "interact"
+        "upgrade"
      receivedPermissions.1.from:
-        "0xaA9904D4d4261dc0f927306f3f5c74439eBa0b90"
+        "0x0D51c6664A773873971336850C51A5caE8e63e89"
      receivedPermissions.1.description:
-        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
      receivedPermissions.1.via.1:
+        {"address":"0xe3826907ed4f0A4F3D05d6CF5B0B8dCde91d6e0C"}
      receivedPermissions.1.via.0.address:
-        "0xe3826907ed4f0A4F3D05d6CF5B0B8dCde91d6e0C"
+        "0x3b7F26ED562e21277c86ea0Ce40BC914653a3555"
      receivedPermissions.1.role:
+        "admin"
      receivedPermissions.0.permission:
-        "upgrade"
+        "interact"
      receivedPermissions.0.from:
-        "0x0D51c6664A773873971336850C51A5caE8e63e89"
+        "0xaA9904D4d4261dc0f927306f3f5c74439eBa0b90"
      receivedPermissions.0.via.1:
-        {"address":"0xe3826907ed4f0A4F3D05d6CF5B0B8dCde91d6e0C"}
      receivedPermissions.0.via.0.address:
-        "0x3b7F26ED562e21277c86ea0Ce40BC914653a3555"
+        "0xe3826907ed4f0A4F3D05d6CF5B0B8dCde91d6e0C"
      receivedPermissions.0.description:
+        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
      receivedPermissions.0.role:
+        ".owner"
      directlyReceivedPermissions.0.role:
+        ".executors"
    }
```

```diff
    contract UpgradeExecutor (0xe3826907ed4f0A4F3D05d6CF5B0B8dCde91d6e0C) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      directlyReceivedPermissions.2.role:
+        "admin"
      directlyReceivedPermissions.1.role:
+        ".owner"
      directlyReceivedPermissions.0.role:
+        ".owner"
    }
```

Generated with discovered.json: 0xd8139d937442feab390690e6d47b087bf14d4046

# Diff at Fri, 02 May 2025 17:23:32 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@c598e33a0c469175b7abbd6c2a13b47b63d6b6a4 block: 22046061
- current block number: 22046061

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22046061 (main branch discovery), not current.

```diff
    contract RollupProxy (0xaA9904D4d4261dc0f927306f3f5c74439eBa0b90) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      usedTypes.0.arg.0xaf1dbdfceb871c00bfbb1675983133df04f0ed04e89647812513c091e3a982b3:
+        "Celestia Nitro 3.3.2 wasmModuleRoot"
    }
```

Generated with discovered.json: 0x45a8cce2cb64147eddd7ad5376c9218743754aa1

# Diff at Tue, 29 Apr 2025 08:19:02 GMT:

- chain: ethereum
- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@ef7477af00fe0b57a2f7cacf7e958c12494af662 block: 22046061
- current block number: 22046061

## Description

Field .issuedPermissions is removed from the output as no longer needed. Added 'permissionsConfigHash' due to refactoring of the modelling process (into a separate command).

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22046061 (main branch discovery), not current.

```diff
    contract SequencerInbox (0x0D51c6664A773873971336850C51A5caE8e63e89) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      issuedPermissions:
-        [{"permission":"sequence","to":"0x11AaeeDd19D4daf99925231b982CA0A35F77d812","description":"Can submit transaction batches or commitments to the SequencerInbox contract on the host chain.","via":[]},{"permission":"upgrade","to":"0x4a4962275DF8C60a80d3a25faEc5AA7De116A746","via":[{"address":"0xe3826907ed4f0A4F3D05d6CF5B0B8dCde91d6e0C"},{"address":"0x3b7F26ED562e21277c86ea0Ce40BC914653a3555"}]}]
    }
```

```diff
    contract RollupEventInbox (0x191738BDecD7f73a79F64D689cf91ef873fb4172) {
    +++ description: Helper contract sending configuration data over the bridge during the systems initialization.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x4a4962275DF8C60a80d3a25faEc5AA7De116A746","via":[{"address":"0xe3826907ed4f0A4F3D05d6CF5B0B8dCde91d6e0C"},{"address":"0x3b7F26ED562e21277c86ea0Ce40BC914653a3555"}]}]
    }
```

```diff
    contract Bridge (0x73CF739b0233027cd516998e177d473D0a45E037) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x4a4962275DF8C60a80d3a25faEc5AA7De116A746","via":[{"address":"0xe3826907ed4f0A4F3D05d6CF5B0B8dCde91d6e0C"},{"address":"0x3b7F26ED562e21277c86ea0Ce40BC914653a3555"}]}]
    }
```

```diff
    contract RollupProxy (0xaA9904D4d4261dc0f927306f3f5c74439eBa0b90) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      issuedPermissions:
-        [{"permission":"interact","to":"0x4a4962275DF8C60a80d3a25faEc5AA7De116A746","description":"Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes.","via":[{"address":"0xe3826907ed4f0A4F3D05d6CF5B0B8dCde91d6e0C"}]},{"permission":"upgrade","to":"0x4a4962275DF8C60a80d3a25faEc5AA7De116A746","via":[{"address":"0xe3826907ed4f0A4F3D05d6CF5B0B8dCde91d6e0C"}]},{"permission":"validate","to":"0x101d02006885979D2F32284c5847dF8616C24436","description":"Can propose new state roots (called nodes) and challenge state roots on the host chain.","via":[]}]
    }
```

```diff
    contract UpgradeExecutor (0xe3826907ed4f0A4F3D05d6CF5B0B8dCde91d6e0C) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x4a4962275DF8C60a80d3a25faEc5AA7De116A746","via":[{"address":"0xe3826907ed4f0A4F3D05d6CF5B0B8dCde91d6e0C"},{"address":"0x3b7F26ED562e21277c86ea0Ce40BC914653a3555"}]}]
    }
```

```diff
    contract Inbox (0xeb8307Fc8c1bEe7DfDCedf7e8c85778a81CB150f) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x4a4962275DF8C60a80d3a25faEc5AA7De116A746","via":[{"address":"0xe3826907ed4f0A4F3D05d6CF5B0B8dCde91d6e0C"},{"address":"0x3b7F26ED562e21277c86ea0Ce40BC914653a3555"}]}]
    }
```

```diff
    contract Outbox (0xf2dC65BdDb21c5DCC070067434D34a342907b5aE) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x4a4962275DF8C60a80d3a25faEc5AA7De116A746","via":[{"address":"0xe3826907ed4f0A4F3D05d6CF5B0B8dCde91d6e0C"},{"address":"0x3b7F26ED562e21277c86ea0Ce40BC914653a3555"}]}]
    }
```

```diff
    contract ChallengeManager (0xf39A1d1Bf489bA959ca6A0e6Fa4A1887Fe526c81) {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x4a4962275DF8C60a80d3a25faEc5AA7De116A746","via":[{"address":"0xe3826907ed4f0A4F3D05d6CF5B0B8dCde91d6e0C"},{"address":"0x3b7F26ED562e21277c86ea0Ce40BC914653a3555"}]}]
    }
```

Generated with discovered.json: 0xa4cc4bdb412012327b3e17f541daf28ca270b0c5

# Diff at Tue, 18 Mar 2025 08:12:38 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@4ef7a8dbcec1cd9fec77aae2b73d81347a4ffb13 block: 22046061
- current block number: 22046061

## Description

Config: change Multisig names.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22046061 (main branch discovery), not current.

```diff
    contract Conduit Multisig 1 (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      name:
-        "ConduitMultisig"
+        "Conduit Multisig 1"
    }
```

Generated with discovered.json: 0xba12b2a0059d2f95f7e61fadf052ae6151b0304f

# Diff at Fri, 14 Mar 2025 15:39:02 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@002bac09dea3b1154ecc36736323fb7552478ce4 block: 21637075
- current block number: 22046061

## Description

Conduit MS changes.

## Watched changes

```diff
    contract ConduitMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      values.$members.9:
+        "0x4D8007a0E9f293e62E2b0F43C6Cf4C4B9e135BAe"
      values.$members.8:
-        "0x4D8007a0E9f293e62E2b0F43C6Cf4C4B9e135BAe"
+        "0xefCf0c8faFB425997870f845e26fC6cA6EE6dD5C"
      values.$members.7:
-        "0xefCf0c8faFB425997870f845e26fC6cA6EE6dD5C"
+        "0xa0C600a6e85bf225958FFAcC70B5FDDF9A059038"
      values.$members.6:
-        "0xa0C600a6e85bf225958FFAcC70B5FDDF9A059038"
+        "0x3840f487A17A41100DD1Bf0946c34f132a57Fd5f"
      values.$members.5:
-        "0x3840f487A17A41100DD1Bf0946c34f132a57Fd5f"
+        "0xa4000bDD2bB92ce6750b31F1eeda47Bd1cB8e6e4"
      values.$members.4:
-        "0xa4000bDD2bB92ce6750b31F1eeda47Bd1cB8e6e4"
+        "0xF0B77EaE7F2dabCC2571c7418406A0dCA3afA4f0"
      values.$members.3:
-        "0xF0B77EaE7F2dabCC2571c7418406A0dCA3afA4f0"
+        "0xF3313C48BD8E17b823d5498D62F37019dFEA647D"
      values.$members.2:
-        "0xF3313C48BD8E17b823d5498D62F37019dFEA647D"
+        "0xA0737fea60F0601A192E3d2c98865A883ab0bda2"
      values.$members.1:
-        "0xA0737fea60F0601A192E3d2c98865A883ab0bda2"
+        "0x50930d652266EF4127FA3A1906B7Cb9951076628"
      values.$members.0:
-        "0x50930d652266EF4127FA3A1906B7Cb9951076628"
+        "0x860e06Fe384D1A3340111e7D142E02642178c053"
      values.multisigThreshold:
-        "4 of 9 (44%)"
+        "4 of 10 (40%)"
    }
```

Generated with discovered.json: 0x4d71f6c286584f9defb4a0b8d447217f379b036d

# Diff at Thu, 06 Mar 2025 09:38:58 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@7119c715545bc86a4194761f42815f811ac6307a block: 21637075
- current block number: 21637075

## Description

Config related: set severity for arbitrum inbox/outbox changes to high and add historical In- and Outboxes via events.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21637075 (main branch discovery), not current.

```diff
    contract Bridge (0x73CF739b0233027cd516998e177d473D0a45E037) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
+++ description: All Inboxes that were ever set as allowed in the bridge.
+++ severity: HIGH
      values.inboxHistory:
+        ["0xeb8307Fc8c1bEe7DfDCedf7e8c85778a81CB150f","0x191738BDecD7f73a79F64D689cf91ef873fb4172"]
+++ description: All Outboxes that were ever set as allowed in the bridge.
+++ severity: HIGH
      values.outboxHistory:
+        ["0xf2dC65BdDb21c5DCC070067434D34a342907b5aE"]
      fieldMeta:
+        {"allowedOutboxList":{"severity":"HIGH","description":"Can make calls as the bridge, steal all funds."},"outboxHistory":{"severity":"HIGH","description":"All Outboxes that were ever set as allowed in the bridge."},"allowedDelayedInboxList":{"severity":"HIGH","description":"Allowed to mint the gastoken on L2 and call `enqueueDelayedMessage()` on the bridge."},"inboxHistory":{"severity":"HIGH","description":"All Inboxes that were ever set as allowed in the bridge."}}
    }
```

Generated with discovered.json: 0x487a8f7e7487d62013a513e9e362828b8259147b

# Diff at Tue, 04 Mar 2025 10:39:06 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@98d260b45fe0d2195ce5e629bd7b200c8706e8ba block: 21637075
- current block number: 21637075

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21637075 (main branch discovery), not current.

```diff
    contract SequencerInbox (0x0D51c6664A773873971336850C51A5caE8e63e89) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      sinceBlock:
+        19683918
    }
```

```diff
    contract OneStepProverHostIo (0x17e7F68ce50A77e55C7834ddF31AEf86403B8010) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      sinceBlock:
+        19432744
    }
```

```diff
    contract RollupEventInbox (0x191738BDecD7f73a79F64D689cf91ef873fb4172) {
    +++ description: Helper contract sending configuration data over the bridge during the systems initialization.
      sinceBlock:
+        19683918
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
    contract ProxyAdmin (0x3b7F26ED562e21277c86ea0Ce40BC914653a3555) {
    +++ description: None
      sinceBlock:
+        19683918
    }
```

```diff
    contract ConduitMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      sinceBlock:
+        16990669
    }
```

```diff
    contract OneStepProofEntry (0x57EA090Ac0554d174AE0e2855B460e84A1A7C221) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      sinceBlock:
+        19432745
    }
```

```diff
    contract OneStepProver0 (0x72B166070781a552D7b95a907eF59ca05d3D5a62) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      sinceBlock:
+        19432741
    }
```

```diff
    contract Bridge (0x73CF739b0233027cd516998e177d473D0a45E037) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      sinceBlock:
+        19683918
    }
```

```diff
    contract OneStepProverMemory (0x8b73Ef238ADaB31EBC7c05423d243c345241a22f) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      sinceBlock:
+        19432742
    }
```

```diff
    contract OneStepProverMath (0x90eC62De2EB7C7512a22bD2D55926AD6bA609F38) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      sinceBlock:
+        19432743
    }
```

```diff
    contract RollupProxy (0xaA9904D4d4261dc0f927306f3f5c74439eBa0b90) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      sinceBlock:
+        19683918
    }
```

```diff
    contract UpgradeExecutor (0xe3826907ed4f0A4F3D05d6CF5B0B8dCde91d6e0C) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      sinceBlock:
+        19683918
    }
```

```diff
    contract Inbox (0xeb8307Fc8c1bEe7DfDCedf7e8c85778a81CB150f) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      sinceBlock:
+        19683918
    }
```

```diff
    contract Outbox (0xf2dC65BdDb21c5DCC070067434D34a342907b5aE) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
      sinceBlock:
+        19683918
    }
```

```diff
    contract ChallengeManager (0xf39A1d1Bf489bA959ca6A0e6Fa4A1887Fe526c81) {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      sinceBlock:
+        19683918
    }
```

Generated with discovered.json: 0x8d22a9c7ca948e89fef095c62950c3748e74e287

# Diff at Fri, 21 Feb 2025 14:06:19 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@d219f271711b2cf7a164e3443bead5e4957d13a8 block: 21637075
- current block number: 21637075

## Description

Config related: Change some severities and add templates.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21637075 (main branch discovery), not current.

```diff
    contract SequencerInbox (0x0D51c6664A773873971336850C51A5caE8e63e89) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract Bridge (0x73CF739b0233027cd516998e177d473D0a45E037) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract RollupProxy (0xaA9904D4d4261dc0f927306f3f5c74439eBa0b90) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract UpgradeExecutor (0xe3826907ed4f0A4F3D05d6CF5B0B8dCde91d6e0C) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      category:
+        {"name":"Governance","priority":3}
    }
```

```diff
    contract Inbox (0xeb8307Fc8c1bEe7DfDCedf7e8c85778a81CB150f) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      category:
+        {"name":"Canonical Bridges","priority":2}
    }
```

```diff
    contract Outbox (0xf2dC65BdDb21c5DCC070067434D34a342907b5aE) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
      category:
+        {"name":"Canonical Bridges","priority":2}
    }
```

```diff
    contract ChallengeManager (0xf39A1d1Bf489bA959ca6A0e6Fa4A1887Fe526c81) {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

Generated with discovered.json: 0x3129847104d40cd156778118c54f2956aa6a488f

# Diff at Thu, 20 Feb 2025 12:20:58 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@e2b8072d8f4ddd728fac7a5e6cf8717962af378f block: 21637075
- current block number: 21637075

## Description

Config related: Bold templates added

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21637075 (main branch discovery), not current.

```diff
    contract RollupProxy (0xaA9904D4d4261dc0f927306f3f5c74439eBa0b90) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      values.isPostBoLD:
+        false
    }
```

Generated with discovered.json: 0x9e8b243e2b7b2b7cf996ce5d4dbec3082d769845

# Diff at Tue, 04 Feb 2025 12:30:58 GMT:

- chain: ethereum
- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@145553eed7ba44636411ecb25e4099728acd02f9 block: 21637075
- current block number: 21637075

## Description

Rename 'configure' permission to 'interact'

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21637075 (main branch discovery), not current.

```diff
    contract ConduitMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      receivedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract RollupProxy (0xaA9904D4d4261dc0f927306f3f5c74439eBa0b90) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      issuedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract UpgradeExecutor (0xe3826907ed4f0A4F3D05d6CF5B0B8dCde91d6e0C) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      directlyReceivedPermissions.1.permission:
-        "configure"
+        "interact"
    }
```

Generated with discovered.json: 0xfe1395ab4950b62d46064a847af3dde4e7d707c7

# Diff at Mon, 20 Jan 2025 11:09:26 GMT:

- chain: ethereum
- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@2c8b4f3d9910bb6371be9b4df87b70856e7d8c64 block: 21637075
- current block number: 21637075

## Description

Rerun on the same block number. Applies fixes to permissions and via field. Renames permission's target to to/from.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21637075 (main branch discovery), not current.

```diff
    contract SequencerInbox (0x0D51c6664A773873971336850C51A5caE8e63e89) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      issuedPermissions.1.target:
-        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      issuedPermissions.1.via.1.delay:
-        0
      issuedPermissions.1.via.0.delay:
-        0
      issuedPermissions.1.to:
+        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      issuedPermissions.0.target:
-        "0x11AaeeDd19D4daf99925231b982CA0A35F77d812"
      issuedPermissions.0.to:
+        "0x11AaeeDd19D4daf99925231b982CA0A35F77d812"
      issuedPermissions.0.description:
+        "Can submit transaction batches or commitments to the SequencerInbox contract on the host chain."
    }
```

```diff
    contract RollupEventInbox (0x191738BDecD7f73a79F64D689cf91ef873fb4172) {
    +++ description: Helper contract sending configuration data over the bridge during the systems initialization.
      issuedPermissions.0.target:
-        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      issuedPermissions.0.via.1.delay:
-        0
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
    }
```

```diff
    contract ProxyAdmin (0x3b7F26ED562e21277c86ea0Ce40BC914653a3555) {
    +++ description: None
      directlyReceivedPermissions.6.target:
-        "0xf39A1d1Bf489bA959ca6A0e6Fa4A1887Fe526c81"
      directlyReceivedPermissions.6.from:
+        "0xf39A1d1Bf489bA959ca6A0e6Fa4A1887Fe526c81"
      directlyReceivedPermissions.5.target:
-        "0xf2dC65BdDb21c5DCC070067434D34a342907b5aE"
      directlyReceivedPermissions.5.from:
+        "0xf2dC65BdDb21c5DCC070067434D34a342907b5aE"
      directlyReceivedPermissions.4.target:
-        "0xeb8307Fc8c1bEe7DfDCedf7e8c85778a81CB150f"
      directlyReceivedPermissions.4.from:
+        "0xeb8307Fc8c1bEe7DfDCedf7e8c85778a81CB150f"
      directlyReceivedPermissions.3.target:
-        "0xe3826907ed4f0A4F3D05d6CF5B0B8dCde91d6e0C"
      directlyReceivedPermissions.3.from:
+        "0xe3826907ed4f0A4F3D05d6CF5B0B8dCde91d6e0C"
      directlyReceivedPermissions.2.target:
-        "0x73CF739b0233027cd516998e177d473D0a45E037"
      directlyReceivedPermissions.2.from:
+        "0x73CF739b0233027cd516998e177d473D0a45E037"
      directlyReceivedPermissions.1.target:
-        "0x191738BDecD7f73a79F64D689cf91ef873fb4172"
      directlyReceivedPermissions.1.from:
+        "0x191738BDecD7f73a79F64D689cf91ef873fb4172"
      directlyReceivedPermissions.0.target:
-        "0x0D51c6664A773873971336850C51A5caE8e63e89"
      directlyReceivedPermissions.0.from:
+        "0x0D51c6664A773873971336850C51A5caE8e63e89"
    }
```

```diff
    contract ConduitMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      receivedPermissions.8.target:
-        "0xf39A1d1Bf489bA959ca6A0e6Fa4A1887Fe526c81"
      receivedPermissions.8.from:
+        "0xf39A1d1Bf489bA959ca6A0e6Fa4A1887Fe526c81"
      receivedPermissions.7.target:
-        "0xf2dC65BdDb21c5DCC070067434D34a342907b5aE"
      receivedPermissions.7.from:
+        "0xf2dC65BdDb21c5DCC070067434D34a342907b5aE"
      receivedPermissions.6.target:
-        "0xeb8307Fc8c1bEe7DfDCedf7e8c85778a81CB150f"
      receivedPermissions.6.from:
+        "0xeb8307Fc8c1bEe7DfDCedf7e8c85778a81CB150f"
      receivedPermissions.5.target:
-        "0xe3826907ed4f0A4F3D05d6CF5B0B8dCde91d6e0C"
      receivedPermissions.5.from:
+        "0xe3826907ed4f0A4F3D05d6CF5B0B8dCde91d6e0C"
      receivedPermissions.4.target:
-        "0xaA9904D4d4261dc0f927306f3f5c74439eBa0b90"
      receivedPermissions.4.from:
+        "0xaA9904D4d4261dc0f927306f3f5c74439eBa0b90"
      receivedPermissions.3.target:
-        "0x73CF739b0233027cd516998e177d473D0a45E037"
      receivedPermissions.3.from:
+        "0x73CF739b0233027cd516998e177d473D0a45E037"
      receivedPermissions.2.target:
-        "0x191738BDecD7f73a79F64D689cf91ef873fb4172"
      receivedPermissions.2.from:
+        "0x191738BDecD7f73a79F64D689cf91ef873fb4172"
      receivedPermissions.1.target:
-        "0x0D51c6664A773873971336850C51A5caE8e63e89"
      receivedPermissions.1.from:
+        "0x0D51c6664A773873971336850C51A5caE8e63e89"
      receivedPermissions.0.target:
-        "0xaA9904D4d4261dc0f927306f3f5c74439eBa0b90"
      receivedPermissions.0.from:
+        "0xaA9904D4d4261dc0f927306f3f5c74439eBa0b90"
      directlyReceivedPermissions.0.target:
-        "0xe3826907ed4f0A4F3D05d6CF5B0B8dCde91d6e0C"
      directlyReceivedPermissions.0.from:
+        "0xe3826907ed4f0A4F3D05d6CF5B0B8dCde91d6e0C"
    }
```

```diff
    contract Bridge (0x73CF739b0233027cd516998e177d473D0a45E037) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      issuedPermissions.0.target:
-        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      issuedPermissions.0.via.1.delay:
-        0
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
    }
```

```diff
    contract RollupProxy (0xaA9904D4d4261dc0f927306f3f5c74439eBa0b90) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      issuedPermissions.2.target:
-        "0x101d02006885979D2F32284c5847dF8616C24436"
      issuedPermissions.2.to:
+        "0x101d02006885979D2F32284c5847dF8616C24436"
      issuedPermissions.2.description:
+        "Can propose new state roots (called nodes) and challenge state roots on the host chain."
      issuedPermissions.1.target:
-        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      issuedPermissions.1.via.0.delay:
-        0
      issuedPermissions.1.to:
+        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      issuedPermissions.0.target:
-        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.via.0.description:
-        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
      issuedPermissions.0.to:
+        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      issuedPermissions.0.description:
+        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
    }
```

```diff
    contract UpgradeExecutor (0xe3826907ed4f0A4F3D05d6CF5B0B8dCde91d6e0C) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      issuedPermissions.0.target:
-        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      issuedPermissions.0.via.1.delay:
-        0
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      directlyReceivedPermissions.2.target:
-        "0xaA9904D4d4261dc0f927306f3f5c74439eBa0b90"
      directlyReceivedPermissions.2.from:
+        "0xaA9904D4d4261dc0f927306f3f5c74439eBa0b90"
      directlyReceivedPermissions.1.target:
-        "0xaA9904D4d4261dc0f927306f3f5c74439eBa0b90"
      directlyReceivedPermissions.1.from:
+        "0xaA9904D4d4261dc0f927306f3f5c74439eBa0b90"
      directlyReceivedPermissions.0.target:
-        "0x3b7F26ED562e21277c86ea0Ce40BC914653a3555"
      directlyReceivedPermissions.0.from:
+        "0x3b7F26ED562e21277c86ea0Ce40BC914653a3555"
    }
```

```diff
    contract Inbox (0xeb8307Fc8c1bEe7DfDCedf7e8c85778a81CB150f) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      issuedPermissions.0.target:
-        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      issuedPermissions.0.via.1.delay:
-        0
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
    }
```

```diff
    contract Outbox (0xf2dC65BdDb21c5DCC070067434D34a342907b5aE) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
      issuedPermissions.0.target:
-        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      issuedPermissions.0.via.1.delay:
-        0
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
    }
```

```diff
    contract ChallengeManager (0xf39A1d1Bf489bA959ca6A0e6Fa4A1887Fe526c81) {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      issuedPermissions.0.target:
-        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      issuedPermissions.0.via.1.delay:
-        0
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
    }
```

Generated with discovered.json: 0xbdd7b780393272d48ae7ccdc1669ebf6f3e3a75a

# Diff at Thu, 16 Jan 2025 12:34:47 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@b471de2d691e0c6d99ad89859efde79edd3d4dfb block: 21465150
- current block number: 21637075

## Description

ConduitMultisig signer changes.

## Watched changes

```diff
    contract ConduitMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      values.$members.8:
+        "0x4D8007a0E9f293e62E2b0F43C6Cf4C4B9e135BAe"
      values.$members.7:
-        "0x4D8007a0E9f293e62E2b0F43C6Cf4C4B9e135BAe"
+        "0xefCf0c8faFB425997870f845e26fC6cA6EE6dD5C"
      values.$members.6:
-        "0xefCf0c8faFB425997870f845e26fC6cA6EE6dD5C"
+        "0xa0C600a6e85bf225958FFAcC70B5FDDF9A059038"
      values.$members.5:
-        "0xa0C600a6e85bf225958FFAcC70B5FDDF9A059038"
+        "0x3840f487A17A41100DD1Bf0946c34f132a57Fd5f"
      values.$members.4:
-        "0x3840f487A17A41100DD1Bf0946c34f132a57Fd5f"
+        "0xa4000bDD2bB92ce6750b31F1eeda47Bd1cB8e6e4"
      values.$members.3:
-        "0xa4000bDD2bB92ce6750b31F1eeda47Bd1cB8e6e4"
+        "0xF0B77EaE7F2dabCC2571c7418406A0dCA3afA4f0"
      values.$members.2:
-        "0xF0B77EaE7F2dabCC2571c7418406A0dCA3afA4f0"
+        "0xF3313C48BD8E17b823d5498D62F37019dFEA647D"
      values.$members.1:
-        "0xF3313C48BD8E17b823d5498D62F37019dFEA647D"
+        "0xA0737fea60F0601A192E3d2c98865A883ab0bda2"
      values.$members.0:
-        "0xA0737fea60F0601A192E3d2c98865A883ab0bda2"
+        "0x50930d652266EF4127FA3A1906B7Cb9951076628"
      values.multisigThreshold:
-        "4 of 8 (50%)"
+        "4 of 9 (44%)"
    }
```

Generated with discovered.json: 0x9f379face9012161867791d7119cb664b0fec1e9

# Diff at Wed, 08 Jan 2025 10:44:48 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@20bf0eaa1dce373e2c004314fef59d2d1bdf5502 block: 21465150
- current block number: 21465150

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21465150 (main branch discovery), not current.

```diff
    contract Bridge (0x73CF739b0233027cd516998e177d473D0a45E037) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      description:
-        "Escrow contract for the project's gas token (Can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging."
+        "Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging."
    }
```

Generated with discovered.json: 0x8c7d1779cfd9a671fb707d7b91d5aba79b61e164

# Diff at Mon, 23 Dec 2024 12:22:08 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@18325a975c44684702f30ee366361589e4c2ed8c block: 21335967
- current block number: 21465150

## Description

Config related: Celestia-Nitro wmroot added.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21335967 (main branch discovery), not current.

```diff
    contract RollupProxy (0xaA9904D4d4261dc0f927306f3f5c74439eBa0b90) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      usedTypes.0.arg.0xe81f986823a85105c5fd91bb53b4493d38c0c26652d23f76a7405ac889908287:
+        "Celestia Nitro 3.2.1 wasmModuleRoot"
    }
```

Generated with discovered.json: 0x89adeb7ae8ea1d5645a2889bcc63f6c0170cec74

# Diff at Fri, 06 Dec 2024 08:09:41 GMT:

- chain: ethereum
- author: Piotr Szlachciak (<szlachciak.piotr@gmail.com>)
- current block number: 21335967

## Description

Initial discovery of a standard orbit stack Optimium.

## Initial discovery

```diff
+   Status: CREATED
    contract SequencerInbox (0x0D51c6664A773873971336850C51A5caE8e63e89)
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
```

```diff
+   Status: CREATED
    contract OneStepProverHostIo (0x17e7F68ce50A77e55C7834ddF31AEf86403B8010)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract RollupEventInbox (0x191738BDecD7f73a79F64D689cf91ef873fb4172)
    +++ description: Helper contract sending configuration data over the bridge during the systems initialization.
```

```diff
+   Status: CREATED
    contract ValidatorUtils (0x2b0E04Dc90e3fA58165CB41E2834B44A56E766aF)
    +++ description: This contract implements view only utilities for validators.
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x3b7F26ED562e21277c86ea0Ce40BC914653a3555)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ConduitMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746)
    +++ description: None
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
    contract Bridge (0x73CF739b0233027cd516998e177d473D0a45E037)
    +++ description: Escrow contract for the project's gas token (Can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
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

```diff
+   Status: CREATED
    contract RollupProxy (0xaA9904D4d4261dc0f927306f3f5c74439eBa0b90)
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
```

```diff
+   Status: CREATED
    contract UpgradeExecutor (0xe3826907ed4f0A4F3D05d6CF5B0B8dCde91d6e0C)
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
```

```diff
+   Status: CREATED
    contract Inbox (0xeb8307Fc8c1bEe7DfDCedf7e8c85778a81CB150f)
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
```

```diff
+   Status: CREATED
    contract Outbox (0xf2dC65BdDb21c5DCC070067434D34a342907b5aE)
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
```

```diff
+   Status: CREATED
    contract ChallengeManager (0xf39A1d1Bf489bA959ca6A0e6Fa4A1887Fe526c81)
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
```

