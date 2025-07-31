Generated with discovered.json: 0xd780b5f05b29a05416506866b488f57a28e69078

# Diff at Mon, 14 Jul 2025 12:44:27 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@9f4300dad2f3d080cd56fa311d4a848556c74e72 block: 31729275
- current block number: 31729275

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 31729275 (main branch discovery), not current.

```diff
    EOA  (0x001271c57AeC639952B5201D052767c316755512) {
    +++ description: None
      address:
-        "0x001271c57AeC639952B5201D052767c316755512"
+        "base:0x001271c57AeC639952B5201D052767c316755512"
    }
```

```diff
    contract OneStepProofEntry (0x15D2a9A14de6Ea03AADE944641eAb497a3A4c9DF) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      address:
-        "0x15D2a9A14de6Ea03AADE944641eAb497a3A4c9DF"
+        "base:0x15D2a9A14de6Ea03AADE944641eAb497a3A4c9DF"
      values.prover0:
-        "0x97ba9522f2e5D67e96FeA6B612e794dc96637AAc"
+        "base:0x97ba9522f2e5D67e96FeA6B612e794dc96637AAc"
      values.proverHostIo:
-        "0x320e29bc3f34bc6B8834bBD2B6b013ef6620E69F"
+        "base:0x320e29bc3f34bc6B8834bBD2B6b013ef6620E69F"
      values.proverMath:
-        "0xDf6C4562e853C4F775285710B467e2EE4Ca8D22c"
+        "base:0xDf6C4562e853C4F775285710B467e2EE4Ca8D22c"
      values.proverMem:
-        "0x173FCB92df1854c3B78dC8696C23B1c88437b892"
+        "base:0x173FCB92df1854c3B78dC8696C23B1c88437b892"
      implementationNames.0x15D2a9A14de6Ea03AADE944641eAb497a3A4c9DF:
-        "OneStepProofEntry"
      implementationNames.base:0x15D2a9A14de6Ea03AADE944641eAb497a3A4c9DF:
+        "OneStepProofEntry"
    }
```

```diff
    contract OneStepProverMemory (0x173FCB92df1854c3B78dC8696C23B1c88437b892) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      address:
-        "0x173FCB92df1854c3B78dC8696C23B1c88437b892"
+        "base:0x173FCB92df1854c3B78dC8696C23B1c88437b892"
      implementationNames.0x173FCB92df1854c3B78dC8696C23B1c88437b892:
-        "OneStepProverMemory"
      implementationNames.base:0x173FCB92df1854c3B78dC8696C23B1c88437b892:
+        "OneStepProverMemory"
    }
```

```diff
    contract Inbox (0x21A1e2BFC61F30F2E81E0b08cd37c1FC7ef776E7) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      address:
-        "0x21A1e2BFC61F30F2E81E0b08cd37c1FC7ef776E7"
+        "base:0x21A1e2BFC61F30F2E81E0b08cd37c1FC7ef776E7"
      values.$admin:
-        "0xFB48D385Fa3da33762B350e1d705b9E46054E677"
+        "base:0xFB48D385Fa3da33762B350e1d705b9E46054E677"
      values.$implementation:
-        "0xa9Fa7dFC5885E83af241c31c865d5f59eD4669d5"
+        "base:0xa9Fa7dFC5885E83af241c31c865d5f59eD4669d5"
      values.$pastUpgrades.0.2.0:
-        "0xcA00Db0289131B71A6624f62666bd54305697BB2"
+        "base:0xcA00Db0289131B71A6624f62666bd54305697BB2"
      values.$pastUpgrades.1.2.0:
-        "0xa9Fa7dFC5885E83af241c31c865d5f59eD4669d5"
+        "base:0xa9Fa7dFC5885E83af241c31c865d5f59eD4669d5"
      values.bridge:
-        "0xEfEf4558802bF373Ce3307189C79a9cAb0a4Cb9C"
+        "base:0xEfEf4558802bF373Ce3307189C79a9cAb0a4Cb9C"
      values.getProxyAdmin:
-        "0xFB48D385Fa3da33762B350e1d705b9E46054E677"
+        "base:0xFB48D385Fa3da33762B350e1d705b9E46054E677"
      values.sequencerInbox:
-        "0x6216dD1EE27C5aCEC7427052d3eCDc98E2bc2221"
+        "base:0x6216dD1EE27C5aCEC7427052d3eCDc98E2bc2221"
      implementationNames.0x21A1e2BFC61F30F2E81E0b08cd37c1FC7ef776E7:
-        "TransparentUpgradeableProxy"
      implementationNames.0xa9Fa7dFC5885E83af241c31c865d5f59eD4669d5:
-        "ERC20Inbox"
      implementationNames.base:0x21A1e2BFC61F30F2E81E0b08cd37c1FC7ef776E7:
+        "TransparentUpgradeableProxy"
      implementationNames.base:0xa9Fa7dFC5885E83af241c31c865d5f59eD4669d5:
+        "ERC20Inbox"
    }
```

```diff
    contract ValidatorUtils (0x23b0348788b96ee1cE4e7DdED4AC2A99de516F51) {
    +++ description: This contract implements view only utilities for validators.
      address:
-        "0x23b0348788b96ee1cE4e7DdED4AC2A99de516F51"
+        "base:0x23b0348788b96ee1cE4e7DdED4AC2A99de516F51"
      implementationNames.0x23b0348788b96ee1cE4e7DdED4AC2A99de516F51:
-        "ValidatorUtils"
      implementationNames.base:0x23b0348788b96ee1cE4e7DdED4AC2A99de516F51:
+        "ValidatorUtils"
    }
```

```diff
    contract OneStepProverHostIo (0x320e29bc3f34bc6B8834bBD2B6b013ef6620E69F) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      address:
-        "0x320e29bc3f34bc6B8834bBD2B6b013ef6620E69F"
+        "base:0x320e29bc3f34bc6B8834bBD2B6b013ef6620E69F"
      implementationNames.0x320e29bc3f34bc6B8834bBD2B6b013ef6620E69F:
-        "OneStepProverHostIo"
      implementationNames.base:0x320e29bc3f34bc6B8834bBD2B6b013ef6620E69F:
+        "OneStepProverHostIo"
    }
```

```diff
    EOA  (0x35A2079110aa30d1De381cf75aCd1836b6dEE1d7) {
    +++ description: None
      address:
-        "0x35A2079110aa30d1De381cf75aCd1836b6dEE1d7"
+        "base:0x35A2079110aa30d1De381cf75aCd1836b6dEE1d7"
    }
```

```diff
    EOA OftAdapterEOA (0x3C12B77aE8B7DD1FEB63D1D6a2A819AcdA0a41d2) {
    +++ description: None
      address:
-        "0x3C12B77aE8B7DD1FEB63D1D6a2A819AcdA0a41d2"
+        "base:0x3C12B77aE8B7DD1FEB63D1D6a2A819AcdA0a41d2"
    }
```

```diff
    EOA  (0x3cAF7ceF6B2aECA72102E8835325B26BF99FE9E0) {
    +++ description: None
      address:
-        "0x3cAF7ceF6B2aECA72102E8835325B26BF99FE9E0"
+        "base:0x3cAF7ceF6B2aECA72102E8835325B26BF99FE9E0"
    }
```

```diff
    contract UTBDecent (0x43019F8BE1F192587883b67dEA2994999f5a2de2) {
    +++ description: The UTB contract serves as an L2<->L3 gateway by integrating with Decent (LayerZero app) to allow bridging and swapping in- and out of Degen L3. This is achieved using external modules (smart contracts) like swappers and bridgers that can be registered in the UTB contract.
      address:
-        "0x43019F8BE1F192587883b67dEA2994999f5a2de2"
+        "base:0x43019F8BE1F192587883b67dEA2994999f5a2de2"
      values.accessControl.DEFAULT_ADMIN_ROLE.members.0:
-        "0x690f4e2f19717A06E1C146B2dCE68c2d23e36f4c"
+        "base:0x690f4e2f19717A06E1C146B2dCE68c2d23e36f4c"
      implementationNames.0x43019F8BE1F192587883b67dEA2994999f5a2de2:
-        "UTB"
      implementationNames.base:0x43019F8BE1F192587883b67dEA2994999f5a2de2:
+        "UTB"
    }
```

```diff
    contract SequencerInbox (0x6216dD1EE27C5aCEC7427052d3eCDc98E2bc2221) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      address:
-        "0x6216dD1EE27C5aCEC7427052d3eCDc98E2bc2221"
+        "base:0x6216dD1EE27C5aCEC7427052d3eCDc98E2bc2221"
      values.$admin:
-        "0xFB48D385Fa3da33762B350e1d705b9E46054E677"
+        "base:0xFB48D385Fa3da33762B350e1d705b9E46054E677"
      values.$implementation:
-        "0x40Cd7D713D7ae463f95cE5d342Ea6E7F5cF7C999"
+        "base:0x40Cd7D713D7ae463f95cE5d342Ea6E7F5cF7C999"
      values.$pastUpgrades.0.2.0:
-        "0x5ad3e9141D0EAd2132afFF0CD74487964cE9135A"
+        "base:0x5ad3e9141D0EAd2132afFF0CD74487964cE9135A"
      values.$pastUpgrades.1.2.0:
-        "0x98DB769A9E15D66EA04665da0dF616596c296BA8"
+        "base:0x98DB769A9E15D66EA04665da0dF616596c296BA8"
      values.$pastUpgrades.2.2.0:
-        "0x40Cd7D713D7ae463f95cE5d342Ea6E7F5cF7C999"
+        "base:0x40Cd7D713D7ae463f95cE5d342Ea6E7F5cF7C999"
      values.batchPosterManager:
-        "0x0000000000000000000000000000000000000000"
+        "base:0x0000000000000000000000000000000000000000"
      values.batchPosters.0:
-        "0xc98A32DdD1b30B3788670C9992f3B18EF83Da491"
+        "base:0xc98A32DdD1b30B3788670C9992f3B18EF83Da491"
      values.bridge:
-        "0xEfEf4558802bF373Ce3307189C79a9cAb0a4Cb9C"
+        "base:0xEfEf4558802bF373Ce3307189C79a9cAb0a4Cb9C"
      values.reader4844:
-        "0x849E360a247132F961c9CBE95Ba39106c72e1268"
+        "base:0x849E360a247132F961c9CBE95Ba39106c72e1268"
      values.rollup:
-        "0xD34F3a11F10DB069173b32d84F02eDA578709143"
+        "base:0xD34F3a11F10DB069173b32d84F02eDA578709143"
      implementationNames.0x6216dD1EE27C5aCEC7427052d3eCDc98E2bc2221:
-        "TransparentUpgradeableProxy"
      implementationNames.0x40Cd7D713D7ae463f95cE5d342Ea6E7F5cF7C999:
-        "SequencerInbox"
      implementationNames.base:0x6216dD1EE27C5aCEC7427052d3eCDc98E2bc2221:
+        "TransparentUpgradeableProxy"
      implementationNames.base:0x40Cd7D713D7ae463f95cE5d342Ea6E7F5cF7C999:
+        "SequencerInbox"
    }
```

```diff
    contract ChallengeManager (0x67812161Bbb6aCF891aA6028BC614a660961ceD8) {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      address:
-        "0x67812161Bbb6aCF891aA6028BC614a660961ceD8"
+        "base:0x67812161Bbb6aCF891aA6028BC614a660961ceD8"
      values.$admin:
-        "0xFB48D385Fa3da33762B350e1d705b9E46054E677"
+        "base:0xFB48D385Fa3da33762B350e1d705b9E46054E677"
      values.$implementation:
-        "0x5C2950Bd136716540e1F5CF442f2AB0aD2F413A7"
+        "base:0x5C2950Bd136716540e1F5CF442f2AB0aD2F413A7"
      values.$pastUpgrades.0.2.0:
-        "0x9Db0bB898C500DD84C7c7bd7fFFFE914569a6677"
+        "base:0x9Db0bB898C500DD84C7c7bd7fFFFE914569a6677"
      values.$pastUpgrades.1.2.0:
-        "0x377A5b786E94cAcdcB2B309451C373c8F2166A79"
+        "base:0x377A5b786E94cAcdcB2B309451C373c8F2166A79"
      values.$pastUpgrades.2.2.0:
-        "0x5C2950Bd136716540e1F5CF442f2AB0aD2F413A7"
+        "base:0x5C2950Bd136716540e1F5CF442f2AB0aD2F413A7"
      values.bridge:
-        "0xEfEf4558802bF373Ce3307189C79a9cAb0a4Cb9C"
+        "base:0xEfEf4558802bF373Ce3307189C79a9cAb0a4Cb9C"
      values.osp:
-        "0x15D2a9A14de6Ea03AADE944641eAb497a3A4c9DF"
+        "base:0x15D2a9A14de6Ea03AADE944641eAb497a3A4c9DF"
      values.resultReceiver:
-        "0xD34F3a11F10DB069173b32d84F02eDA578709143"
+        "base:0xD34F3a11F10DB069173b32d84F02eDA578709143"
      values.sequencerInbox:
-        "0x6216dD1EE27C5aCEC7427052d3eCDc98E2bc2221"
+        "base:0x6216dD1EE27C5aCEC7427052d3eCDc98E2bc2221"
      implementationNames.0x67812161Bbb6aCF891aA6028BC614a660961ceD8:
-        "TransparentUpgradeableProxy"
      implementationNames.0x5C2950Bd136716540e1F5CF442f2AB0aD2F413A7:
-        "ChallengeManager"
      implementationNames.base:0x67812161Bbb6aCF891aA6028BC614a660961ceD8:
+        "TransparentUpgradeableProxy"
      implementationNames.base:0x5C2950Bd136716540e1F5CF442f2AB0aD2F413A7:
+        "ChallengeManager"
    }
```

```diff
    EOA  (0x690f4e2f19717A06E1C146B2dCE68c2d23e36f4c) {
    +++ description: None
      address:
-        "0x690f4e2f19717A06E1C146B2dCE68c2d23e36f4c"
+        "base:0x690f4e2f19717A06E1C146B2dCE68c2d23e36f4c"
    }
```

```diff
    contract RollupEventInbox (0x766DD3A13d17C6D175975C89225bde89F052dBc4) {
    +++ description: Helper contract sending configuration data over the bridge during the systems initialization.
      address:
-        "0x766DD3A13d17C6D175975C89225bde89F052dBc4"
+        "base:0x766DD3A13d17C6D175975C89225bde89F052dBc4"
      values.$admin:
-        "0xFB48D385Fa3da33762B350e1d705b9E46054E677"
+        "base:0xFB48D385Fa3da33762B350e1d705b9E46054E677"
      values.$implementation:
-        "0x4326B3755539d35b0A8846bF9b33982A8eA42c93"
+        "base:0x4326B3755539d35b0A8846bF9b33982A8eA42c93"
      values.$pastUpgrades.0.2.0:
-        "0x4326B3755539d35b0A8846bF9b33982A8eA42c93"
+        "base:0x4326B3755539d35b0A8846bF9b33982A8eA42c93"
      values.bridge:
-        "0xEfEf4558802bF373Ce3307189C79a9cAb0a4Cb9C"
+        "base:0xEfEf4558802bF373Ce3307189C79a9cAb0a4Cb9C"
      values.rollup:
-        "0xD34F3a11F10DB069173b32d84F02eDA578709143"
+        "base:0xD34F3a11F10DB069173b32d84F02eDA578709143"
      implementationNames.0x766DD3A13d17C6D175975C89225bde89F052dBc4:
-        "TransparentUpgradeableProxy"
      implementationNames.0x4326B3755539d35b0A8846bF9b33982A8eA42c93:
-        "ERC20RollupEventInbox"
      implementationNames.base:0x766DD3A13d17C6D175975C89225bde89F052dBc4:
+        "TransparentUpgradeableProxy"
      implementationNames.base:0x4326B3755539d35b0A8846bF9b33982A8eA42c93:
+        "ERC20RollupEventInbox"
    }
```

```diff
    contract AlchemyMultisig2 (0x871e290d5447b958131F6d44f915F10032436ee6) {
    +++ description: None
      address:
-        "0x871e290d5447b958131F6d44f915F10032436ee6"
+        "base:0x871e290d5447b958131F6d44f915F10032436ee6"
      values.$implementation:
-        "0x29fcB43b46531BcA003ddC8FCB67FFE91900C762"
+        "base:0x29fcB43b46531BcA003ddC8FCB67FFE91900C762"
      values.$members.0:
-        "0xB2aa0C2C4fD6BFCBF699d4c787CD6Cc0dC461a9d"
+        "base:0xB2aa0C2C4fD6BFCBF699d4c787CD6Cc0dC461a9d"
      values.$members.1:
-        "0xCA730AFfb87935E70E5889418C731eb196237476"
+        "base:0xCA730AFfb87935E70E5889418C731eb196237476"
      values.$members.2:
-        "0xFB00073F931A817b244bF211aA2E5DCBfff8B1ca"
+        "base:0xFB00073F931A817b244bF211aA2E5DCBfff8B1ca"
      values.$members.3:
-        "0x35A2079110aa30d1De381cf75aCd1836b6dEE1d7"
+        "base:0x35A2079110aa30d1De381cf75aCd1836b6dEE1d7"
      values.$members.4:
-        "0x001271c57AeC639952B5201D052767c316755512"
+        "base:0x001271c57AeC639952B5201D052767c316755512"
      values.$members.5:
-        "0xA351A874b48dCEdf1883dD4F4049bE3d9923700a"
+        "base:0xA351A874b48dCEdf1883dD4F4049bE3d9923700a"
      values.$members.6:
-        "0xd1447Dd15D9e24ddFF99f0fE3C88Bf64d23D1670"
+        "base:0xd1447Dd15D9e24ddFF99f0fE3C88Bf64d23D1670"
      values.$members.7:
-        "0xeD9919D57162D518014C391a687AA8fb9DB55654"
+        "base:0xeD9919D57162D518014C391a687AA8fb9DB55654"
      implementationNames.0x871e290d5447b958131F6d44f915F10032436ee6:
-        "SafeProxy"
      implementationNames.0x29fcB43b46531BcA003ddC8FCB67FFE91900C762:
-        "SafeL2"
      implementationNames.base:0x871e290d5447b958131F6d44f915F10032436ee6:
+        "SafeProxy"
      implementationNames.base:0x29fcB43b46531BcA003ddC8FCB67FFE91900C762:
+        "SafeL2"
    }
```

```diff
    contract OneStepProver0 (0x97ba9522f2e5D67e96FeA6B612e794dc96637AAc) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      address:
-        "0x97ba9522f2e5D67e96FeA6B612e794dc96637AAc"
+        "base:0x97ba9522f2e5D67e96FeA6B612e794dc96637AAc"
      implementationNames.0x97ba9522f2e5D67e96FeA6B612e794dc96637AAc:
-        "OneStepProver0"
      implementationNames.base:0x97ba9522f2e5D67e96FeA6B612e794dc96637AAc:
+        "OneStepProver0"
    }
```

```diff
    EOA  (0xA351A874b48dCEdf1883dD4F4049bE3d9923700a) {
    +++ description: None
      address:
-        "0xA351A874b48dCEdf1883dD4F4049bE3d9923700a"
+        "base:0xA351A874b48dCEdf1883dD4F4049bE3d9923700a"
    }
```

```diff
    contract UpgradeExecutor (0xaA3A7A2ec2477A61082E1C41a2c6710587917028) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      address:
-        "0xaA3A7A2ec2477A61082E1C41a2c6710587917028"
+        "base:0xaA3A7A2ec2477A61082E1C41a2c6710587917028"
      values.$admin:
-        "0xFB48D385Fa3da33762B350e1d705b9E46054E677"
+        "base:0xFB48D385Fa3da33762B350e1d705b9E46054E677"
      values.$implementation:
-        "0x3C4DF76De31816443C207E49F9fE48737C8F2746"
+        "base:0x3C4DF76De31816443C207E49F9fE48737C8F2746"
      values.$pastUpgrades.0.2.0:
-        "0x3C4DF76De31816443C207E49F9fE48737C8F2746"
+        "base:0x3C4DF76De31816443C207E49F9fE48737C8F2746"
      values.accessControl.ADMIN_ROLE.members.0:
-        "0xaA3A7A2ec2477A61082E1C41a2c6710587917028"
+        "base:0xaA3A7A2ec2477A61082E1C41a2c6710587917028"
      values.accessControl.EXECUTOR_ROLE.members.0:
-        "0x871e290d5447b958131F6d44f915F10032436ee6"
+        "base:0x871e290d5447b958131F6d44f915F10032436ee6"
      values.executors.0:
-        "0x871e290d5447b958131F6d44f915F10032436ee6"
+        "base:0x871e290d5447b958131F6d44f915F10032436ee6"
      implementationNames.0xaA3A7A2ec2477A61082E1C41a2c6710587917028:
-        "TransparentUpgradeableProxy"
      implementationNames.0x3C4DF76De31816443C207E49F9fE48737C8F2746:
-        "UpgradeExecutor"
      implementationNames.base:0xaA3A7A2ec2477A61082E1C41a2c6710587917028:
+        "TransparentUpgradeableProxy"
      implementationNames.base:0x3C4DF76De31816443C207E49F9fE48737C8F2746:
+        "UpgradeExecutor"
    }
```

```diff
    EOA  (0xB2aa0C2C4fD6BFCBF699d4c787CD6Cc0dC461a9d) {
    +++ description: None
      address:
-        "0xB2aa0C2C4fD6BFCBF699d4c787CD6Cc0dC461a9d"
+        "base:0xB2aa0C2C4fD6BFCBF699d4c787CD6Cc0dC461a9d"
    }
```

```diff
    contract DegenFastConfirmerMultisig (0xc207cbC35DD3CD172059730380A45aE14eb0e403) {
    +++ description: None
      address:
-        "0xc207cbC35DD3CD172059730380A45aE14eb0e403"
+        "base:0xc207cbC35DD3CD172059730380A45aE14eb0e403"
      values.$implementation:
-        "0xfb1bffC9d739B8D520DaF37dF666da4C687191EA"
+        "base:0xfb1bffC9d739B8D520DaF37dF666da4C687191EA"
      values.$members.0:
-        "0x3cAF7ceF6B2aECA72102E8835325B26BF99FE9E0"
+        "base:0x3cAF7ceF6B2aECA72102E8835325B26BF99FE9E0"
      implementationNames.0xc207cbC35DD3CD172059730380A45aE14eb0e403:
-        "GnosisSafeProxy"
      implementationNames.0xfb1bffC9d739B8D520DaF37dF666da4C687191EA:
-        "GnosisSafeL2"
      implementationNames.base:0xc207cbC35DD3CD172059730380A45aE14eb0e403:
+        "GnosisSafeProxy"
      implementationNames.base:0xfb1bffC9d739B8D520DaF37dF666da4C687191EA:
+        "GnosisSafeL2"
    }
```

```diff
    EOA  (0xc98A32DdD1b30B3788670C9992f3B18EF83Da491) {
    +++ description: None
      address:
-        "0xc98A32DdD1b30B3788670C9992f3B18EF83Da491"
+        "base:0xc98A32DdD1b30B3788670C9992f3B18EF83Da491"
    }
```

```diff
    EOA  (0xCA730AFfb87935E70E5889418C731eb196237476) {
    +++ description: None
      address:
-        "0xCA730AFfb87935E70E5889418C731eb196237476"
+        "base:0xCA730AFfb87935E70E5889418C731eb196237476"
    }
```

```diff
    EOA  (0xd1447Dd15D9e24ddFF99f0fE3C88Bf64d23D1670) {
    +++ description: None
      address:
-        "0xd1447Dd15D9e24ddFF99f0fE3C88Bf64d23D1670"
+        "base:0xd1447Dd15D9e24ddFF99f0fE3C88Bf64d23D1670"
    }
```

```diff
    contract RollupProxy (0xD34F3a11F10DB069173b32d84F02eDA578709143) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      address:
-        "0xD34F3a11F10DB069173b32d84F02eDA578709143"
+        "base:0xD34F3a11F10DB069173b32d84F02eDA578709143"
      values.$admin:
-        "0xaA3A7A2ec2477A61082E1C41a2c6710587917028"
+        "base:0xaA3A7A2ec2477A61082E1C41a2c6710587917028"
      values.$implementation.0:
-        "0xb760B98D6256F8D135cEB738Eb9A9E44Af9B3b41"
+        "base:0xb760B98D6256F8D135cEB738Eb9A9E44Af9B3b41"
      values.$implementation.1:
-        "0x747D88df773721558575BA29fEf11FE28ED25266"
+        "base:0x747D88df773721558575BA29fEf11FE28ED25266"
      values.$pastUpgrades.0.2.0:
-        "0x3A59b13eB3F661DE35a1e203Bd12b3B4123976cf"
+        "base:0x3A59b13eB3F661DE35a1e203Bd12b3B4123976cf"
      values.$pastUpgrades.0.2.1:
-        "0xB7202d306936B79Ba29907b391faA87D3BEec33A"
+        "base:0xB7202d306936B79Ba29907b391faA87D3BEec33A"
      values.$pastUpgrades.1.2.0:
-        "0xb760B98D6256F8D135cEB738Eb9A9E44Af9B3b41"
+        "base:0xb760B98D6256F8D135cEB738Eb9A9E44Af9B3b41"
      values.$pastUpgrades.1.2.1:
-        "0x747D88df773721558575BA29fEf11FE28ED25266"
+        "base:0x747D88df773721558575BA29fEf11FE28ED25266"
      values.anyTrustFastConfirmer:
-        "0xc207cbC35DD3CD172059730380A45aE14eb0e403"
+        "base:0xc207cbC35DD3CD172059730380A45aE14eb0e403"
      values.bridge:
-        "0xEfEf4558802bF373Ce3307189C79a9cAb0a4Cb9C"
+        "base:0xEfEf4558802bF373Ce3307189C79a9cAb0a4Cb9C"
      values.challengeManager:
-        "0x67812161Bbb6aCF891aA6028BC614a660961ceD8"
+        "base:0x67812161Bbb6aCF891aA6028BC614a660961ceD8"
      values.inbox:
-        "0x21A1e2BFC61F30F2E81E0b08cd37c1FC7ef776E7"
+        "base:0x21A1e2BFC61F30F2E81E0b08cd37c1FC7ef776E7"
      values.loserStakeEscrow:
-        "0x0000000000000000000000000000000000000000"
+        "base:0x0000000000000000000000000000000000000000"
      values.outbox:
-        "0xe63ddb12FBb6211a73F12a4367b10dA0834B82da"
+        "base:0xe63ddb12FBb6211a73F12a4367b10dA0834B82da"
      values.owner:
-        "0xaA3A7A2ec2477A61082E1C41a2c6710587917028"
+        "base:0xaA3A7A2ec2477A61082E1C41a2c6710587917028"
      values.rollupEventInbox:
-        "0x766DD3A13d17C6D175975C89225bde89F052dBc4"
+        "base:0x766DD3A13d17C6D175975C89225bde89F052dBc4"
      values.sequencerInbox:
-        "0x6216dD1EE27C5aCEC7427052d3eCDc98E2bc2221"
+        "base:0x6216dD1EE27C5aCEC7427052d3eCDc98E2bc2221"
      values.stakeToken:
-        "0x0000000000000000000000000000000000000000"
+        "base:0x0000000000000000000000000000000000000000"
      values.validators.0:
-        "0x3cAF7ceF6B2aECA72102E8835325B26BF99FE9E0"
+        "base:0x3cAF7ceF6B2aECA72102E8835325B26BF99FE9E0"
      values.validators.1:
-        "0xc207cbC35DD3CD172059730380A45aE14eb0e403"
+        "base:0xc207cbC35DD3CD172059730380A45aE14eb0e403"
      values.validatorUtils:
-        "0x23b0348788b96ee1cE4e7DdED4AC2A99de516F51"
+        "base:0x23b0348788b96ee1cE4e7DdED4AC2A99de516F51"
      values.validatorWalletCreator:
-        "0xB546310EA2De84220811a03BCD5CeE96D251fA7D"
+        "base:0xB546310EA2De84220811a03BCD5CeE96D251fA7D"
      implementationNames.0xD34F3a11F10DB069173b32d84F02eDA578709143:
-        "RollupProxy"
      implementationNames.0xb760B98D6256F8D135cEB738Eb9A9E44Af9B3b41:
-        "RollupAdminLogic"
      implementationNames.0x747D88df773721558575BA29fEf11FE28ED25266:
-        "RollupUserLogic"
      implementationNames.base:0xD34F3a11F10DB069173b32d84F02eDA578709143:
+        "RollupProxy"
      implementationNames.base:0xb760B98D6256F8D135cEB738Eb9A9E44Af9B3b41:
+        "RollupAdminLogic"
      implementationNames.base:0x747D88df773721558575BA29fEf11FE28ED25266:
+        "RollupUserLogic"
    }
```

```diff
    contract OrbitERC20OFTAdapter (0xDb8E759859058952c34953c8469f464109826e52) {
    +++ description: As a designated allowed outbox, this contract can access all funds of the canonical bridge escrow. It also interfaces with the LayerZero AMB, giving this external bridge access to the Degen L3 canonical bridge and making canonical bridge security dependent on LayerZero security.
      address:
-        "0xDb8E759859058952c34953c8469f464109826e52"
+        "base:0xDb8E759859058952c34953c8469f464109826e52"
      values.composeMsgSender:
-        "0xDb8E759859058952c34953c8469f464109826e52"
+        "base:0xDb8E759859058952c34953c8469f464109826e52"
      values.endpoint:
-        "0x1a44076050125825900e736c501f859c50fE728c"
+        "base:0x1a44076050125825900e736c501f859c50fE728c"
      values.msgInspector:
-        "0x0000000000000000000000000000000000000000"
+        "base:0x0000000000000000000000000000000000000000"
      values.oApp:
-        "0xDb8E759859058952c34953c8469f464109826e52"
+        "base:0xDb8E759859058952c34953c8469f464109826e52"
      values.owner:
-        "0x3C12B77aE8B7DD1FEB63D1D6a2A819AcdA0a41d2"
+        "base:0x3C12B77aE8B7DD1FEB63D1D6a2A819AcdA0a41d2"
      values.preCrime:
-        "0x0000000000000000000000000000000000000000"
+        "base:0x0000000000000000000000000000000000000000"
      values.token:
-        "0x4ed4E862860beD51a9570b96d89aF5E1B0Efefed"
+        "base:0x4ed4E862860beD51a9570b96d89aF5E1B0Efefed"
      implementationNames.0xDb8E759859058952c34953c8469f464109826e52:
-        "OrbitERC20OFTAdapter"
      implementationNames.base:0xDb8E759859058952c34953c8469f464109826e52:
+        "OrbitERC20OFTAdapter"
    }
```

```diff
    contract OneStepProverMath (0xDf6C4562e853C4F775285710B467e2EE4Ca8D22c) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      address:
-        "0xDf6C4562e853C4F775285710B467e2EE4Ca8D22c"
+        "base:0xDf6C4562e853C4F775285710B467e2EE4Ca8D22c"
      implementationNames.0xDf6C4562e853C4F775285710B467e2EE4Ca8D22c:
-        "OneStepProverMath"
      implementationNames.base:0xDf6C4562e853C4F775285710B467e2EE4Ca8D22c:
+        "OneStepProverMath"
    }
```

```diff
    contract Outbox (0xe63ddb12FBb6211a73F12a4367b10dA0834B82da) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
      address:
-        "0xe63ddb12FBb6211a73F12a4367b10dA0834B82da"
+        "base:0xe63ddb12FBb6211a73F12a4367b10dA0834B82da"
      values.$admin:
-        "0xFB48D385Fa3da33762B350e1d705b9E46054E677"
+        "base:0xFB48D385Fa3da33762B350e1d705b9E46054E677"
      values.$implementation:
-        "0x20fA6358f89Ed16d48F6588a8f500887354Ff56c"
+        "base:0x20fA6358f89Ed16d48F6588a8f500887354Ff56c"
      values.$pastUpgrades.0.2.0:
-        "0x20fA6358f89Ed16d48F6588a8f500887354Ff56c"
+        "base:0x20fA6358f89Ed16d48F6588a8f500887354Ff56c"
      values.bridge:
-        "0xEfEf4558802bF373Ce3307189C79a9cAb0a4Cb9C"
+        "base:0xEfEf4558802bF373Ce3307189C79a9cAb0a4Cb9C"
      values.l2ToL1Sender:
-        "0x0000000000000000000000000000000000000000"
+        "base:0x0000000000000000000000000000000000000000"
      values.rollup:
-        "0xD34F3a11F10DB069173b32d84F02eDA578709143"
+        "base:0xD34F3a11F10DB069173b32d84F02eDA578709143"
      implementationNames.0xe63ddb12FBb6211a73F12a4367b10dA0834B82da:
-        "TransparentUpgradeableProxy"
      implementationNames.0x20fA6358f89Ed16d48F6588a8f500887354Ff56c:
-        "ERC20Outbox"
      implementationNames.base:0xe63ddb12FBb6211a73F12a4367b10dA0834B82da:
+        "TransparentUpgradeableProxy"
      implementationNames.base:0x20fA6358f89Ed16d48F6588a8f500887354Ff56c:
+        "ERC20Outbox"
    }
```

```diff
    EOA  (0xeD9919D57162D518014C391a687AA8fb9DB55654) {
    +++ description: None
      address:
-        "0xeD9919D57162D518014C391a687AA8fb9DB55654"
+        "base:0xeD9919D57162D518014C391a687AA8fb9DB55654"
    }
```

```diff
    contract Bridge (0xEfEf4558802bF373Ce3307189C79a9cAb0a4Cb9C) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      address:
-        "0xEfEf4558802bF373Ce3307189C79a9cAb0a4Cb9C"
+        "base:0xEfEf4558802bF373Ce3307189C79a9cAb0a4Cb9C"
      values.$admin:
-        "0xFB48D385Fa3da33762B350e1d705b9E46054E677"
+        "base:0xFB48D385Fa3da33762B350e1d705b9E46054E677"
      values.$implementation:
-        "0xf48cBc0e2Bd8d9ED8d76A54A3672bbb6e07Cf6D0"
+        "base:0xf48cBc0e2Bd8d9ED8d76A54A3672bbb6e07Cf6D0"
      values.$pastUpgrades.0.2.0:
-        "0xc00336Cdf86AE7AD58D8773B0114082C190D28D5"
+        "base:0xc00336Cdf86AE7AD58D8773B0114082C190D28D5"
      values.$pastUpgrades.1.2.0:
-        "0xf48cBc0e2Bd8d9ED8d76A54A3672bbb6e07Cf6D0"
+        "base:0xf48cBc0e2Bd8d9ED8d76A54A3672bbb6e07Cf6D0"
      values.activeOutbox:
-        "0x0000000000000000000000000000000000000000"
+        "base:0x0000000000000000000000000000000000000000"
+++ description: Allowed to mint the gastoken on L2 and call `enqueueDelayedMessage()` on the bridge.
+++ severity: HIGH
      values.allowedDelayedInboxList.0:
-        "0x21A1e2BFC61F30F2E81E0b08cd37c1FC7ef776E7"
+        "base:0x21A1e2BFC61F30F2E81E0b08cd37c1FC7ef776E7"
+++ description: Allowed to mint the gastoken on L2 and call `enqueueDelayedMessage()` on the bridge.
+++ severity: HIGH
      values.allowedDelayedInboxList.1:
-        "0x766DD3A13d17C6D175975C89225bde89F052dBc4"
+        "base:0x766DD3A13d17C6D175975C89225bde89F052dBc4"
+++ description: Can make calls as the bridge, steal all funds.
+++ severity: HIGH
      values.allowedOutboxList.0:
-        "0xe63ddb12FBb6211a73F12a4367b10dA0834B82da"
+        "base:0xe63ddb12FBb6211a73F12a4367b10dA0834B82da"
+++ description: Can make calls as the bridge, steal all funds.
+++ severity: HIGH
      values.allowedOutboxList.1:
-        "0xDb8E759859058952c34953c8469f464109826e52"
+        "base:0xDb8E759859058952c34953c8469f464109826e52"
+++ description: All Inboxes that were ever set as allowed in the bridge.
+++ severity: HIGH
      values.inboxHistory.0:
-        "0x21A1e2BFC61F30F2E81E0b08cd37c1FC7ef776E7"
+        "base:0x21A1e2BFC61F30F2E81E0b08cd37c1FC7ef776E7"
+++ description: All Inboxes that were ever set as allowed in the bridge.
+++ severity: HIGH
      values.inboxHistory.1:
-        "0x766DD3A13d17C6D175975C89225bde89F052dBc4"
+        "base:0x766DD3A13d17C6D175975C89225bde89F052dBc4"
+++ description: All Inboxes that were ever set as allowed in the bridge.
+++ severity: HIGH
      values.inboxHistory.2:
-        "0x311556934459Cc8037E203Dc8ee5bd2cEcAD38F4"
+        "base:0x311556934459Cc8037E203Dc8ee5bd2cEcAD38F4"
      values.nativeToken:
-        "0x4ed4E862860beD51a9570b96d89aF5E1B0Efefed"
+        "base:0x4ed4E862860beD51a9570b96d89aF5E1B0Efefed"
+++ description: All Outboxes that were ever set as allowed in the bridge.
+++ severity: HIGH
      values.outboxHistory.0:
-        "0xe63ddb12FBb6211a73F12a4367b10dA0834B82da"
+        "base:0xe63ddb12FBb6211a73F12a4367b10dA0834B82da"
+++ description: All Outboxes that were ever set as allowed in the bridge.
+++ severity: HIGH
      values.outboxHistory.1:
-        "0xDb8E759859058952c34953c8469f464109826e52"
+        "base:0xDb8E759859058952c34953c8469f464109826e52"
      values.rollup:
-        "0xD34F3a11F10DB069173b32d84F02eDA578709143"
+        "base:0xD34F3a11F10DB069173b32d84F02eDA578709143"
      values.sequencerInbox:
-        "0x6216dD1EE27C5aCEC7427052d3eCDc98E2bc2221"
+        "base:0x6216dD1EE27C5aCEC7427052d3eCDc98E2bc2221"
      implementationNames.0xEfEf4558802bF373Ce3307189C79a9cAb0a4Cb9C:
-        "TransparentUpgradeableProxy"
      implementationNames.0xf48cBc0e2Bd8d9ED8d76A54A3672bbb6e07Cf6D0:
-        "ERC20Bridge"
      implementationNames.base:0xEfEf4558802bF373Ce3307189C79a9cAb0a4Cb9C:
+        "TransparentUpgradeableProxy"
      implementationNames.base:0xf48cBc0e2Bd8d9ED8d76A54A3672bbb6e07Cf6D0:
+        "ERC20Bridge"
    }
```

```diff
    EOA Relay Bridge (0xf70da97812CB96acDF810712Aa562db8dfA3dbEF) {
    +++ description: None
      address:
-        "0xf70da97812CB96acDF810712Aa562db8dfA3dbEF"
+        "base:0xf70da97812CB96acDF810712Aa562db8dfA3dbEF"
    }
```

```diff
    EOA  (0xFB00073F931A817b244bF211aA2E5DCBfff8B1ca) {
    +++ description: None
      address:
-        "0xFB00073F931A817b244bF211aA2E5DCBfff8B1ca"
+        "base:0xFB00073F931A817b244bF211aA2E5DCBfff8B1ca"
    }
```

```diff
    contract ProxyAdmin (0xFB48D385Fa3da33762B350e1d705b9E46054E677) {
    +++ description: None
      address:
-        "0xFB48D385Fa3da33762B350e1d705b9E46054E677"
+        "base:0xFB48D385Fa3da33762B350e1d705b9E46054E677"
      values.owner:
-        "0xaA3A7A2ec2477A61082E1C41a2c6710587917028"
+        "base:0xaA3A7A2ec2477A61082E1C41a2c6710587917028"
      implementationNames.0xFB48D385Fa3da33762B350e1d705b9E46054E677:
-        "ProxyAdmin"
      implementationNames.base:0xFB48D385Fa3da33762B350e1d705b9E46054E677:
+        "ProxyAdmin"
    }
```

```diff
+   Status: CREATED
    contract OneStepProofEntry (0x15D2a9A14de6Ea03AADE944641eAb497a3A4c9DF)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract OneStepProverMemory (0x173FCB92df1854c3B78dC8696C23B1c88437b892)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract Inbox (0x21A1e2BFC61F30F2E81E0b08cd37c1FC7ef776E7)
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
```

```diff
+   Status: CREATED
    contract ValidatorUtils (0x23b0348788b96ee1cE4e7DdED4AC2A99de516F51)
    +++ description: This contract implements view only utilities for validators.
```

```diff
+   Status: CREATED
    contract OneStepProverHostIo (0x320e29bc3f34bc6B8834bBD2B6b013ef6620E69F)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract UTBDecent (0x43019F8BE1F192587883b67dEA2994999f5a2de2)
    +++ description: The UTB contract serves as an L2<->L3 gateway by integrating with Decent (LayerZero app) to allow bridging and swapping in- and out of Degen L3. This is achieved using external modules (smart contracts) like swappers and bridgers that can be registered in the UTB contract.
```

```diff
+   Status: CREATED
    contract SequencerInbox (0x6216dD1EE27C5aCEC7427052d3eCDc98E2bc2221)
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
```

```diff
+   Status: CREATED
    contract ChallengeManager (0x67812161Bbb6aCF891aA6028BC614a660961ceD8)
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
```

```diff
+   Status: CREATED
    contract RollupEventInbox (0x766DD3A13d17C6D175975C89225bde89F052dBc4)
    +++ description: Helper contract sending configuration data over the bridge during the systems initialization.
```

```diff
+   Status: CREATED
    contract AlchemyMultisig2 (0x871e290d5447b958131F6d44f915F10032436ee6)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProver0 (0x97ba9522f2e5D67e96FeA6B612e794dc96637AAc)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract UpgradeExecutor (0xaA3A7A2ec2477A61082E1C41a2c6710587917028)
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
```

```diff
+   Status: CREATED
    contract DegenFastConfirmerMultisig (0xc207cbC35DD3CD172059730380A45aE14eb0e403)
    +++ description: None
```

```diff
+   Status: CREATED
    contract RollupProxy (0xD34F3a11F10DB069173b32d84F02eDA578709143)
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
```

```diff
+   Status: CREATED
    contract OrbitERC20OFTAdapter (0xDb8E759859058952c34953c8469f464109826e52)
    +++ description: As a designated allowed outbox, this contract can access all funds of the canonical bridge escrow. It also interfaces with the LayerZero AMB, giving this external bridge access to the Degen L3 canonical bridge and making canonical bridge security dependent on LayerZero security.
```

```diff
+   Status: CREATED
    contract OneStepProverMath (0xDf6C4562e853C4F775285710B467e2EE4Ca8D22c)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract Outbox (0xe63ddb12FBb6211a73F12a4367b10dA0834B82da)
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
```

```diff
+   Status: CREATED
    contract Bridge (0xEfEf4558802bF373Ce3307189C79a9cAb0a4Cb9C)
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0xFB48D385Fa3da33762B350e1d705b9E46054E677)
    +++ description: None
```

Generated with discovered.json: 0xdbfa2a9be0bd1e37cd53d8e943b231d64d905529

# Diff at Wed, 18 Jun 2025 11:58:52 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@a8e4f22a1441bd5040898cc3d3d62b3582942b65 block: 29954256
- current block number: 31729275

## Description

alchemy MS signer change.

## Watched changes

```diff
    contract AlchemyMultisig2 (0x871e290d5447b958131F6d44f915F10032436ee6) {
    +++ description: None
      values.$members.4:
-        "0x0a214444613E3970049BD74a8d72d5bF9EF0094c"
+        "0xCA730AFfb87935E70E5889418C731eb196237476"
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 29954256 (main branch discovery), not current.

```diff
    contract RollupProxy (0xD34F3a11F10DB069173b32d84F02eDA578709143) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      usedTypes.0.arg.0xdb698a2576298f25448bc092e52cf13b1e24141c997135d70f217d674bbeb69a:
+        "ArbOS v40 wasmModuleRoot"
    }
```

Generated with discovered.json: 0x75be7d88885530993bb37bb4793aa6a2405973c9

# Diff at Tue, 27 May 2025 08:31:18 GMT:

- author: Michał Podsiadły (<michal.podsiadly@l2beat.com>)
- comparing to: main@fd658a9ed4bbd45fc5705d23b1906ca057d0d8b0 block: 29954256
- current block number: 29954256

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 29954256 (main branch discovery), not current.

```diff
    contract RollupProxy (0xD34F3a11F10DB069173b32d84F02eDA578709143) {
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

Generated with discovered.json: 0xa88f6efd56c87fbcdcbfd435deb5da2390cb9dc0

# Diff at Fri, 23 May 2025 09:41:14 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@69cd181abbc3c830a6caf2f4429b37cae72ffdb8 block: 29954256
- current block number: 29954256

## Description

Introduced .role field on each permission, defaulting to field name on which it was defined (with '.' prefix)

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 29954256 (main branch discovery), not current.

```diff
    EOA OftAdapterEOA (0x3C12B77aE8B7DD1FEB63D1D6a2A819AcdA0a41d2) {
    +++ description: None
      receivedPermissions.0.role:
+        ".owner"
    }
```

```diff
    EOA  (0x3cAF7ceF6B2aECA72102E8835325B26BF99FE9E0) {
    +++ description: None
      receivedPermissions.2.permission:
-        "validate"
+        "fastconfirm"
      receivedPermissions.2.description:
-        "Can propose new state roots (called nodes) and challenge state roots on the host chain."
+        "Can finalize a state root before the challenge period has passed. This allows withdrawing from the bridge based on the state root."
      receivedPermissions.2.role:
+        ".anyTrustFastConfirmer"
      receivedPermissions.2.via:
+        [{"address":"0xc207cbC35DD3CD172059730380A45aE14eb0e403"}]
      receivedPermissions.1.via:
-        [{"address":"0xc207cbC35DD3CD172059730380A45aE14eb0e403"}]
      receivedPermissions.1.role:
+        ".validators"
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
    EOA  (0x690f4e2f19717A06E1C146B2dCE68c2d23e36f4c) {
    +++ description: None
      receivedPermissions.0.role:
+        ".accessControl"
    }
```

```diff
    contract AlchemyMultisig2 (0x871e290d5447b958131F6d44f915F10032436ee6) {
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
    contract UpgradeExecutor (0xaA3A7A2ec2477A61082E1C41a2c6710587917028) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      directlyReceivedPermissions.2.permission:
-        "act"
+        "upgrade"
      directlyReceivedPermissions.2.from:
-        "0xFB48D385Fa3da33762B350e1d705b9E46054E677"
+        "0xD34F3a11F10DB069173b32d84F02eDA578709143"
      directlyReceivedPermissions.2.role:
+        "admin"
      directlyReceivedPermissions.1.permission:
-        "upgrade"
+        "act"
      directlyReceivedPermissions.1.from:
-        "0xD34F3a11F10DB069173b32d84F02eDA578709143"
+        "0xFB48D385Fa3da33762B350e1d705b9E46054E677"
      directlyReceivedPermissions.1.role:
+        ".owner"
      directlyReceivedPermissions.0.role:
+        ".owner"
    }
```

```diff
    contract DegenFastConfirmerMultisig (0xc207cbC35DD3CD172059730380A45aE14eb0e403) {
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
    EOA  (0xc98A32DdD1b30B3788670C9992f3B18EF83Da491) {
    +++ description: None
      receivedPermissions.0.role:
+        ".batchPosters"
    }
```

```diff
    contract ProxyAdmin (0xFB48D385Fa3da33762B350e1d705b9E46054E677) {
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

Generated with discovered.json: 0xb2393c52854e8860c80f7439b258dc0ab39d7349

# Diff at Thu, 08 May 2025 09:51:12 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@8e1926142ab0c57cc131de4d8da307e13d9af54d block: 28317484
- current block number: 29954256

## Description

Standard orbit upgrade.

## Watched changes

```diff
    contract Inbox (0x21A1e2BFC61F30F2E81E0b08cd37c1FC7ef776E7) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      sourceHashes.0:
-        "0xcb390b491549387c8fcc09fb22fbea7adf54cc74b7247a0c738369ddd7049b92"
+        "0x25984fdfffb8141859c99299fb29e7a7460732d77111e5fe23792baa99f336a3"
      values.$implementation:
-        "0xcA00Db0289131B71A6624f62666bd54305697BB2"
+        "0xa9Fa7dFC5885E83af241c31c865d5f59eD4669d5"
      values.$pastUpgrades.1:
+        ["2024-03-10T16:17:21.000Z","0x85708428ba3eb696c32b3e634fed7ac46016b61d6c0df46959a494d6ecc2bdec",["0xcA00Db0289131B71A6624f62666bd54305697BB2"]]
      values.$pastUpgrades.0.2.0:
-        "0xcA00Db0289131B71A6624f62666bd54305697BB2"
+        "0xa9Fa7dFC5885E83af241c31c865d5f59eD4669d5"
      values.$pastUpgrades.0.1:
-        "2024-03-10T16:17:21.000Z"
+        "0xcae4abe1fb86f2d6e7db916c62b946b605a8ae100571f7db7ccccab07b2b1f3b"
      values.$pastUpgrades.0.0:
-        "0x85708428ba3eb696c32b3e634fed7ac46016b61d6c0df46959a494d6ecc2bdec"
+        "2025-05-07T20:41:01.000Z"
      values.$upgradeCount:
-        1
+        2
      implementationNames.0xcA00Db0289131B71A6624f62666bd54305697BB2:
-        "ERC20Inbox"
      implementationNames.0xa9Fa7dFC5885E83af241c31c865d5f59eD4669d5:
+        "ERC20Inbox"
    }
```

```diff
    contract SequencerInbox (0x6216dD1EE27C5aCEC7427052d3eCDc98E2bc2221) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      sourceHashes.0:
-        "0x50cf57b01499408fa99da27cf0fee96ec30f0d40667d1aa090c442bc80f0636b"
+        "0x6bb86ac4bd0d31e049f543fcf0a8f94c952252222f115246ef9d5b8104d803cc"
      values.$implementation:
-        "0x98DB769A9E15D66EA04665da0dF616596c296BA8"
+        "0x40Cd7D713D7ae463f95cE5d342Ea6E7F5cF7C999"
      values.$pastUpgrades.2:
+        ["2024-03-10T16:17:21.000Z","0x85708428ba3eb696c32b3e634fed7ac46016b61d6c0df46959a494d6ecc2bdec",["0x5ad3e9141D0EAd2132afFF0CD74487964cE9135A"]]
      values.$pastUpgrades.1.2:
-        "2024-03-10T16:17:21.000Z"
+        "0xc313d7714edf75e41115f458d8704acc2174d14247b8944202d64dd32d678fa7"
      values.$pastUpgrades.1.1.0:
-        "0x5ad3e9141D0EAd2132afFF0CD74487964cE9135A"
+        "0x98DB769A9E15D66EA04665da0dF616596c296BA8"
      values.$pastUpgrades.1.0:
-        "0x85708428ba3eb696c32b3e634fed7ac46016b61d6c0df46959a494d6ecc2bdec"
+        "2024-07-02T00:12:17.000Z"
      values.$pastUpgrades.0.2:
-        "0xc313d7714edf75e41115f458d8704acc2174d14247b8944202d64dd32d678fa7"
+        ["0x40Cd7D713D7ae463f95cE5d342Ea6E7F5cF7C999"]
      values.$pastUpgrades.0.1:
-        ["0x98DB769A9E15D66EA04665da0dF616596c296BA8"]
+        "0xcae4abe1fb86f2d6e7db916c62b946b605a8ae100571f7db7ccccab07b2b1f3b"
      values.$pastUpgrades.0.0:
-        "2024-07-02T00:12:17.000Z"
+        "2025-05-07T20:41:01.000Z"
      values.$upgradeCount:
-        2
+        3
      values.reader4844:
-        "0xB48E4A4B8EC04c9F1819302FD370f5B3797c638C"
+        "0x849E360a247132F961c9CBE95Ba39106c72e1268"
      implementationNames.0x98DB769A9E15D66EA04665da0dF616596c296BA8:
-        "SequencerInbox"
      implementationNames.0x40Cd7D713D7ae463f95cE5d342Ea6E7F5cF7C999:
+        "SequencerInbox"
    }
```

```diff
    contract Bridge (0xEfEf4558802bF373Ce3307189C79a9cAb0a4Cb9C) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      sourceHashes.1:
-        "0x057de68a7007d55f4394ba6eafb2c802efcaf13583ff9342ea4d0ee3924d9be1"
+        "0xa7e3f6c355703ed46fcb2156862c4f01792b87beb10a87a81ce3bd5beee79b67"
      sourceHashes.0:
-        "0xa7e3f6c355703ed46fcb2156862c4f01792b87beb10a87a81ce3bd5beee79b67"
+        "0x32c73666d391a33c17183e4ab20bcb0f2b925d8a99da436d2ff99c13f403e289"
      values.$implementation:
-        "0xc00336Cdf86AE7AD58D8773B0114082C190D28D5"
+        "0xf48cBc0e2Bd8d9ED8d76A54A3672bbb6e07Cf6D0"
      values.$pastUpgrades.1:
+        ["2025-05-06T22:36:19.000Z","0xb5cacac7e409b6c786dc0e6e3d171a2f6ea8758fda7637fa88c333aa5817d35d",["0xf48cBc0e2Bd8d9ED8d76A54A3672bbb6e07Cf6D0"]]
      values.$upgradeCount:
-        1
+        2
      values.nativeTokenDecimals:
+        18
      implementationNames.0xc00336Cdf86AE7AD58D8773B0114082C190D28D5:
-        "ERC20Bridge"
      implementationNames.0xf48cBc0e2Bd8d9ED8d76A54A3672bbb6e07Cf6D0:
+        "ERC20Bridge"
    }
```

## Source code changes

```diff
.../Bridge/ERC20Bridge.sol                         | 54 +++++++++++++
 .../{.flat@28317484 => .flat}/Inbox/ERC20Inbox.sol | 92 +++++++++++++++++++---
 .../SequencerInbox/SequencerInbox.sol              | 24 ++++--
 3 files changed, 152 insertions(+), 18 deletions(-)
```

Generated with discovered.json: 0x2ee2175e6d4b9740b88e08d5a67421eed4388db3

# Diff at Fri, 02 May 2025 17:25:25 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@c598e33a0c469175b7abbd6c2a13b47b63d6b6a4 block: 28317484
- current block number: 28317484

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 28317484 (main branch discovery), not current.

```diff
    contract RollupProxy (0xD34F3a11F10DB069173b32d84F02eDA578709143) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      usedTypes.0.arg.0xaf1dbdfceb871c00bfbb1675983133df04f0ed04e89647812513c091e3a982b3:
+        "Celestia Nitro 3.3.2 wasmModuleRoot"
    }
```

Generated with discovered.json: 0x760c89fde64125206c86a1ef7a5f5cb1eb89056c

# Diff at Tue, 29 Apr 2025 08:19:22 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@ef7477af00fe0b57a2f7cacf7e958c12494af662 block: 28317484
- current block number: 28317484

## Description

Field .issuedPermissions is removed from the output as no longer needed. Added 'permissionsConfigHash' due to refactoring of the modelling process (into a separate command).

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 28317484 (main branch discovery), not current.

```diff
    contract Inbox (0x21A1e2BFC61F30F2E81E0b08cd37c1FC7ef776E7) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x871e290d5447b958131F6d44f915F10032436ee6","via":[{"address":"0xaA3A7A2ec2477A61082E1C41a2c6710587917028"},{"address":"0xFB48D385Fa3da33762B350e1d705b9E46054E677"}]}]
    }
```

```diff
    contract UTBDecent (0x43019F8BE1F192587883b67dEA2994999f5a2de2) {
    +++ description: The UTB contract serves as an L2<->L3 gateway by integrating with Decent (LayerZero app) to allow bridging and swapping in- and out of Degen L3. This is achieved using external modules (smart contracts) like swappers and bridgers that can be registered in the UTB contract.
      issuedPermissions:
-        [{"permission":"interact","to":"0x690f4e2f19717A06E1C146B2dCE68c2d23e36f4c","description":"directly controls the UTB contract's critical functions like updating all roles and modules.","via":[]}]
    }
```

```diff
    contract SequencerInbox (0x6216dD1EE27C5aCEC7427052d3eCDc98E2bc2221) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      issuedPermissions:
-        [{"permission":"sequence","to":"0xc98A32DdD1b30B3788670C9992f3B18EF83Da491","description":"Can submit transaction batches or commitments to the SequencerInbox contract on the host chain.","via":[]},{"permission":"upgrade","to":"0x871e290d5447b958131F6d44f915F10032436ee6","via":[{"address":"0xaA3A7A2ec2477A61082E1C41a2c6710587917028"},{"address":"0xFB48D385Fa3da33762B350e1d705b9E46054E677"}]}]
    }
```

```diff
    contract ChallengeManager (0x67812161Bbb6aCF891aA6028BC614a660961ceD8) {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x871e290d5447b958131F6d44f915F10032436ee6","via":[{"address":"0xaA3A7A2ec2477A61082E1C41a2c6710587917028"},{"address":"0xFB48D385Fa3da33762B350e1d705b9E46054E677"}]}]
    }
```

```diff
    contract RollupEventInbox (0x766DD3A13d17C6D175975C89225bde89F052dBc4) {
    +++ description: Helper contract sending configuration data over the bridge during the systems initialization.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x871e290d5447b958131F6d44f915F10032436ee6","via":[{"address":"0xaA3A7A2ec2477A61082E1C41a2c6710587917028"},{"address":"0xFB48D385Fa3da33762B350e1d705b9E46054E677"}]}]
    }
```

```diff
    contract UpgradeExecutor (0xaA3A7A2ec2477A61082E1C41a2c6710587917028) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x871e290d5447b958131F6d44f915F10032436ee6","via":[{"address":"0xaA3A7A2ec2477A61082E1C41a2c6710587917028"},{"address":"0xFB48D385Fa3da33762B350e1d705b9E46054E677"}]}]
    }
```

```diff
    contract RollupProxy (0xD34F3a11F10DB069173b32d84F02eDA578709143) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      issuedPermissions:
-        [{"permission":"fastconfirm","to":"0x3cAF7ceF6B2aECA72102E8835325B26BF99FE9E0","description":"Can finalize a state root before the challenge period has passed. This allows withdrawing from the bridge based on the state root.","via":[{"address":"0xc207cbC35DD3CD172059730380A45aE14eb0e403"}]},{"permission":"interact","to":"0x871e290d5447b958131F6d44f915F10032436ee6","description":"Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes.","via":[{"address":"0xaA3A7A2ec2477A61082E1C41a2c6710587917028"}]},{"permission":"upgrade","to":"0x871e290d5447b958131F6d44f915F10032436ee6","via":[{"address":"0xaA3A7A2ec2477A61082E1C41a2c6710587917028"}]},{"permission":"validate","to":"0x3cAF7ceF6B2aECA72102E8835325B26BF99FE9E0","description":"Can propose new state roots (called nodes) and challenge state roots on the host chain.","via":[]},{"permission":"validate","to":"0x3cAF7ceF6B2aECA72102E8835325B26BF99FE9E0","description":"Can propose new state roots (called nodes) and challenge state roots on the host chain.","via":[{"address":"0xc207cbC35DD3CD172059730380A45aE14eb0e403"}]}]
    }
```

```diff
    contract OrbitERC20OFTAdapter (0xDb8E759859058952c34953c8469f464109826e52) {
    +++ description: As a designated allowed outbox, this contract can access all funds of the canonical bridge escrow. It also interfaces with the LayerZero AMB, giving this external bridge access to the Degen L3 canonical bridge and making canonical bridge security dependent on LayerZero security.
      issuedPermissions:
-        [{"permission":"interact","to":"0x3C12B77aE8B7DD1FEB63D1D6a2A819AcdA0a41d2","description":"Can control the LayerZero OrbitERC20OFTAdapter contract for the DEGEN token and thus potentially steal all funds from the canonical bridge.","via":[]}]
    }
```

```diff
    contract Outbox (0xe63ddb12FBb6211a73F12a4367b10dA0834B82da) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x871e290d5447b958131F6d44f915F10032436ee6","via":[{"address":"0xaA3A7A2ec2477A61082E1C41a2c6710587917028"},{"address":"0xFB48D385Fa3da33762B350e1d705b9E46054E677"}]}]
    }
```

```diff
    contract Bridge (0xEfEf4558802bF373Ce3307189C79a9cAb0a4Cb9C) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x871e290d5447b958131F6d44f915F10032436ee6","via":[{"address":"0xaA3A7A2ec2477A61082E1C41a2c6710587917028"},{"address":"0xFB48D385Fa3da33762B350e1d705b9E46054E677"}]}]
    }
```

Generated with discovered.json: 0xeb362a109a36ffd67ea4c3383856e47d5e8b3a05

# Diff at Mon, 31 Mar 2025 12:32:08 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@71ffebe835be10b6d5d09ef65aa19b910de8a2ec block: 25722659
- current block number: 28317484

## Description

Alchemy MS signer change.

## Watched changes

```diff
    contract AlchemyMultisig2 (0x871e290d5447b958131F6d44f915F10032436ee6) {
    +++ description: None
      values.$members.7:
+        "0x001271c57AeC639952B5201D052767c316755512"
      values.$members.6:
+        "0xB2aa0C2C4fD6BFCBF699d4c787CD6Cc0dC461a9d"
      values.$members.5:
+        "0xFB00073F931A817b244bF211aA2E5DCBfff8B1ca"
      values.$members.4:
-        "0x5EABE7f6673311EdD1Ad17A76ce148c2Bb56aF01"
+        "0x0a214444613E3970049BD74a8d72d5bF9EF0094c"
      values.$members.3:
-        "0x39CF304731099e756204219BF0a8cCc4738dE9dD"
+        "0xA351A874b48dCEdf1883dD4F4049bE3d9923700a"
      values.$members.2:
-        "0xaCEF7482b54a57F50b1CD8c99d1dC1964202A063"
+        "0xeD9919D57162D518014C391a687AA8fb9DB55654"
      values.$members.1:
-        "0x3f0030b9Ca695Abd41b2B619F3298e172e4FCAD6"
+        "0x35A2079110aa30d1De381cf75aCd1836b6dEE1d7"
      values.$members.0:
-        "0x2e42cEfC761e64Bf4442694220d31C2464a6EE21"
+        "0xd1447Dd15D9e24ddFF99f0fE3C88Bf64d23D1670"
      values.$threshold:
-        3
+        5
      values.multisigThreshold:
-        "3 of 5 (60%)"
+        "5 of 8 (63%)"
    }
```

Generated with discovered.json: 0xb4a6466b6e19006f7c054df4c97bfb69a21a784f

# Diff at Thu, 06 Mar 2025 14:26:26 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@454ef41fea41bcea030780b23fd1f11519ff78d2 block: 25722659
- current block number: 25722659

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 25722659 (main branch discovery), not current.

```diff
    contract RollupProxy (0xD34F3a11F10DB069173b32d84F02eDA578709143) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      values.isPostBoLD:
+        false
    }
```

Generated with discovered.json: 0x4703ddf24947ed4db2b86e0a987e73b2018f6f2b

# Diff at Thu, 06 Mar 2025 09:39:17 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@7119c715545bc86a4194761f42815f811ac6307a block: 25722659
- current block number: 25722659

## Description

Config related: set severity for arbitrum inbox/outbox changes to high and add historical In- and Outboxes via events.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 25722659 (main branch discovery), not current.

```diff
    contract Bridge (0xEfEf4558802bF373Ce3307189C79a9cAb0a4Cb9C) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
+++ description: All Inboxes that were ever set as allowed in the bridge.
+++ severity: HIGH
      values.inboxHistory:
+        ["0x21A1e2BFC61F30F2E81E0b08cd37c1FC7ef776E7","0x766DD3A13d17C6D175975C89225bde89F052dBc4","0x311556934459Cc8037E203Dc8ee5bd2cEcAD38F4"]
+++ description: All Outboxes that were ever set as allowed in the bridge.
+++ severity: HIGH
      values.outboxHistory:
+        ["0xe63ddb12FBb6211a73F12a4367b10dA0834B82da","0xDb8E759859058952c34953c8469f464109826e52"]
      fieldMeta:
+        {"allowedOutboxList":{"severity":"HIGH","description":"Can make calls as the bridge, steal all funds."},"outboxHistory":{"severity":"HIGH","description":"All Outboxes that were ever set as allowed in the bridge."},"allowedDelayedInboxList":{"severity":"HIGH","description":"Allowed to mint the gastoken on L2 and call `enqueueDelayedMessage()` on the bridge."},"inboxHistory":{"severity":"HIGH","description":"All Inboxes that were ever set as allowed in the bridge."}}
    }
```

Generated with discovered.json: 0x420fe08c92d35954e89a0c7462c92780040bed8f

# Diff at Tue, 04 Mar 2025 10:40:31 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@98d260b45fe0d2195ce5e629bd7b200c8706e8ba block: 25722659
- current block number: 25722659

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 25722659 (main branch discovery), not current.

```diff
    contract OneStepProofEntry (0x15D2a9A14de6Ea03AADE944641eAb497a3A4c9DF) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      sinceBlock:
+        18679696
    }
```

```diff
    contract OneStepProverMemory (0x173FCB92df1854c3B78dC8696C23B1c88437b892) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      sinceBlock:
+        18679684
    }
```

```diff
    contract Inbox (0x21A1e2BFC61F30F2E81E0b08cd37c1FC7ef776E7) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      sinceBlock:
+        11649047
    }
```

```diff
    contract ValidatorUtils (0x23b0348788b96ee1cE4e7DdED4AC2A99de516F51) {
    +++ description: This contract implements view only utilities for validators.
      sinceBlock:
+        11265649
    }
```

```diff
    contract OneStepProverHostIo (0x320e29bc3f34bc6B8834bBD2B6b013ef6620E69F) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      sinceBlock:
+        18679692
    }
```

```diff
    contract UTBDecent (0x43019F8BE1F192587883b67dEA2994999f5a2de2) {
    +++ description: The UTB contract serves as an L2<->L3 gateway by integrating with Decent (LayerZero app) to allow bridging and swapping in- and out of Degen L3. This is achieved using external modules (smart contracts) like swappers and bridgers that can be registered in the UTB contract.
      sinceBlock:
+        11132311
    }
```

```diff
    contract SequencerInbox (0x6216dD1EE27C5aCEC7427052d3eCDc98E2bc2221) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      sinceBlock:
+        11649047
    }
```

```diff
    contract ChallengeManager (0x67812161Bbb6aCF891aA6028BC614a660961ceD8) {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      sinceBlock:
+        11649047
    }
```

```diff
    contract RollupEventInbox (0x766DD3A13d17C6D175975C89225bde89F052dBc4) {
    +++ description: Helper contract sending configuration data over the bridge during the systems initialization.
      sinceBlock:
+        11649047
    }
```

```diff
    contract AlchemyMultisig2 (0x871e290d5447b958131F6d44f915F10032436ee6) {
    +++ description: None
      sinceBlock:
+        21811174
    }
```

```diff
    contract OneStepProver0 (0x97ba9522f2e5D67e96FeA6B612e794dc96637AAc) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      sinceBlock:
+        18679680
    }
```

```diff
    contract UpgradeExecutor (0xaA3A7A2ec2477A61082E1C41a2c6710587917028) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      sinceBlock:
+        11649047
    }
```

```diff
    contract DegenFastConfirmerMultisig (0xc207cbC35DD3CD172059730380A45aE14eb0e403) {
    +++ description: None
      sinceBlock:
+        25358955
    }
```

```diff
    contract RollupProxy (0xD34F3a11F10DB069173b32d84F02eDA578709143) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      sinceBlock:
+        11649047
    }
```

```diff
    contract OrbitERC20OFTAdapter (0xDb8E759859058952c34953c8469f464109826e52) {
    +++ description: As a designated allowed outbox, this contract can access all funds of the canonical bridge escrow. It also interfaces with the LayerZero AMB, giving this external bridge access to the Degen L3 canonical bridge and making canonical bridge security dependent on LayerZero security.
      sinceBlock:
+        21137082
    }
```

```diff
    contract OneStepProverMath (0xDf6C4562e853C4F775285710B467e2EE4Ca8D22c) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      sinceBlock:
+        18679689
    }
```

```diff
    contract Outbox (0xe63ddb12FBb6211a73F12a4367b10dA0834B82da) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
      sinceBlock:
+        11649047
    }
```

```diff
    contract Bridge (0xEfEf4558802bF373Ce3307189C79a9cAb0a4Cb9C) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      sinceBlock:
+        11649047
    }
```

```diff
    contract ProxyAdmin (0xFB48D385Fa3da33762B350e1d705b9E46054E677) {
    +++ description: None
      sinceBlock:
+        11649047
    }
```

Generated with discovered.json: 0xb7d1787ec9d2111ac5bd852aa308b4187d1bd43d

# Diff at Thu, 27 Feb 2025 11:47:41 GMT:

- author: Michał Podsiadły (<michal.podsiadly@l2beat.com>)
- comparing to: main@a4b50e45bb44f8ceeea29f9236088d26a843c885 block: 25722659
- current block number: 25722659

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 25722659 (main branch discovery), not current.

```diff
    contract Inbox (0x21A1e2BFC61F30F2E81E0b08cd37c1FC7ef776E7) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      name:
-        "ERC20Inbox"
+        "Inbox"
      displayName:
-        "Inbox"
    }
```

```diff
    contract RollupEventInbox (0x766DD3A13d17C6D175975C89225bde89F052dBc4) {
    +++ description: Helper contract sending configuration data over the bridge during the systems initialization.
      name:
-        "ERC20RollupEventInbox"
+        "RollupEventInbox"
      displayName:
-        "RollupEventInbox"
    }
```

```diff
    contract Outbox (0xe63ddb12FBb6211a73F12a4367b10dA0834B82da) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
      name:
-        "ERC20Outbox"
+        "Outbox"
      displayName:
-        "Outbox"
    }
```

```diff
    contract Bridge (0xEfEf4558802bF373Ce3307189C79a9cAb0a4Cb9C) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      name:
-        "ERC20Bridge"
+        "Bridge"
      displayName:
-        "Bridge"
    }
```

Generated with discovered.json: 0x78ddb23aa941595a6176d887cac255eae0a0c438

# Diff at Fri, 21 Feb 2025 14:13:00 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@d219f271711b2cf7a164e3443bead5e4957d13a8 block: 25722659
- current block number: 25722659

## Description

Config related: Change some severities and add templates.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 25722659 (main branch discovery), not current.

```diff
    contract ERC20Inbox (0x21A1e2BFC61F30F2E81E0b08cd37c1FC7ef776E7) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      category:
+        {"name":"Canonical Bridges","priority":2}
    }
```

```diff
    contract SequencerInbox (0x6216dD1EE27C5aCEC7427052d3eCDc98E2bc2221) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract ChallengeManager (0x67812161Bbb6aCF891aA6028BC614a660961ceD8) {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract UpgradeExecutor (0xaA3A7A2ec2477A61082E1C41a2c6710587917028) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      category:
+        {"name":"Governance","priority":3}
    }
```

```diff
    contract RollupProxy (0xD34F3a11F10DB069173b32d84F02eDA578709143) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract ERC20Outbox (0xe63ddb12FBb6211a73F12a4367b10dA0834B82da) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
      category:
+        {"name":"Canonical Bridges","priority":2}
    }
```

```diff
    contract ERC20Bridge (0xEfEf4558802bF373Ce3307189C79a9cAb0a4Cb9C) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

Generated with discovered.json: 0x023dea2ee21e36ab4d34e81cfa801ed8bdd9a31f

# Diff at Tue, 04 Feb 2025 12:34:00 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@145553eed7ba44636411ecb25e4099728acd02f9 block: 25722659
- current block number: 25722659

## Description

Rename 'configure' permission to 'interact'

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 25722659 (main branch discovery), not current.

```diff
    contract UTBDecent (0x43019F8BE1F192587883b67dEA2994999f5a2de2) {
    +++ description: The UTB contract serves as an L2<->L3 gateway by integrating with Decent (LayerZero app) to allow bridging and swapping in- and out of Degen L3. This is achieved using external modules (smart contracts) like swappers and bridgers that can be registered in the UTB contract.
      issuedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract AlchemyMultisig2 (0x871e290d5447b958131F6d44f915F10032436ee6) {
    +++ description: None
      receivedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract UpgradeExecutor (0xaA3A7A2ec2477A61082E1C41a2c6710587917028) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      directlyReceivedPermissions.1.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract RollupProxy (0xD34F3a11F10DB069173b32d84F02eDA578709143) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      issuedPermissions.1.permission:
-        "fastconfirm"
+        "interact"
      issuedPermissions.1.to:
-        "0x3cAF7ceF6B2aECA72102E8835325B26BF99FE9E0"
+        "0x871e290d5447b958131F6d44f915F10032436ee6"
      issuedPermissions.1.description:
-        "Can finalize a state root before the challenge period has passed. This allows withdrawing from the bridge based on the state root."
+        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
      issuedPermissions.1.via.0.address:
-        "0xc207cbC35DD3CD172059730380A45aE14eb0e403"
+        "0xaA3A7A2ec2477A61082E1C41a2c6710587917028"
      issuedPermissions.0.permission:
-        "configure"
+        "fastconfirm"
      issuedPermissions.0.to:
-        "0x871e290d5447b958131F6d44f915F10032436ee6"
+        "0x3cAF7ceF6B2aECA72102E8835325B26BF99FE9E0"
      issuedPermissions.0.description:
-        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
+        "Can finalize a state root before the challenge period has passed. This allows withdrawing from the bridge based on the state root."
      issuedPermissions.0.via.0.address:
-        "0xaA3A7A2ec2477A61082E1C41a2c6710587917028"
+        "0xc207cbC35DD3CD172059730380A45aE14eb0e403"
    }
```

```diff
    contract OrbitERC20OFTAdapter (0xDb8E759859058952c34953c8469f464109826e52) {
    +++ description: As a designated allowed outbox, this contract can access all funds of the canonical bridge escrow. It also interfaces with the LayerZero AMB, giving this external bridge access to the Degen L3 canonical bridge and making canonical bridge security dependent on LayerZero security.
      issuedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

Generated with discovered.json: 0x0c344801c24d8ddad064ab70959560d2d70bd81d

# Diff at Thu, 30 Jan 2025 10:58:41 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@2da0612158e4fa23c41926c49e88a7b955a8c5dc block: 25417259
- current block number: 25722659

## Description

Add 1/1 fastConfirmer.

## Watched changes

```diff
    contract RollupProxy (0xD34F3a11F10DB069173b32d84F02eDA578709143) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      issuedPermissions.4:
+        {"permission":"validate","to":"0x3cAF7ceF6B2aECA72102E8835325B26BF99FE9E0","description":"Can propose new state roots (called nodes) and challenge state roots on the host chain.","via":[{"address":"0xc207cbC35DD3CD172059730380A45aE14eb0e403"}]}
      issuedPermissions.3:
+        {"permission":"validate","to":"0x3cAF7ceF6B2aECA72102E8835325B26BF99FE9E0","description":"Can propose new state roots (called nodes) and challenge state roots on the host chain.","via":[]}
      issuedPermissions.2.permission:
-        "validate"
+        "upgrade"
      issuedPermissions.2.to:
-        "0x3cAF7ceF6B2aECA72102E8835325B26BF99FE9E0"
+        "0x871e290d5447b958131F6d44f915F10032436ee6"
      issuedPermissions.2.description:
-        "Can propose new state roots (called nodes) and challenge state roots on the host chain."
      issuedPermissions.2.via.0:
+        {"address":"0xaA3A7A2ec2477A61082E1C41a2c6710587917028"}
      issuedPermissions.1.permission:
-        "upgrade"
+        "fastconfirm"
      issuedPermissions.1.to:
-        "0x871e290d5447b958131F6d44f915F10032436ee6"
+        "0x3cAF7ceF6B2aECA72102E8835325B26BF99FE9E0"
      issuedPermissions.1.via.0.address:
-        "0xaA3A7A2ec2477A61082E1C41a2c6710587917028"
+        "0xc207cbC35DD3CD172059730380A45aE14eb0e403"
      issuedPermissions.1.description:
+        "Can finalize a state root before the challenge period has passed. This allows withdrawing from the bridge based on the state root."
      values.anyTrustFastConfirmer:
-        "0x0000000000000000000000000000000000000000"
+        "0xc207cbC35DD3CD172059730380A45aE14eb0e403"
+++ description: Increments on each Validator change.
      values.setValidatorCount:
-        3
+        4
      values.validators.1:
+        "0xc207cbC35DD3CD172059730380A45aE14eb0e403"
    }
```

```diff
+   Status: CREATED
    contract DegenFastConfirmerMultisig (0xc207cbC35DD3CD172059730380A45aE14eb0e403)
    +++ description: None
```

## Source code changes

```diff
.../DegenFastConfirmerMultisig/GnosisSafeL2.sol    | 1032 ++++++++++++++++++++
 .../GnosisSafeProxy.p.sol                          |   35 +
 2 files changed, 1067 insertions(+)
```

Generated with discovered.json: 0x6c53dc37c04560e441e33841b7872f63689aa38e

# Diff at Fri, 24 Jan 2025 10:54:05 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@fff69b1db37918a5360f1e3b59d2f37be25d166f block: 25417259
- current block number: 25417259

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 25417259 (main branch discovery), not current.

```diff
    contract AlchemyMultisig2 (0x871e290d5447b958131F6d44f915F10032436ee6) {
    +++ description: None
      name:
-        "DegenMultisig"
+        "AlchemyMultisig2"
    }
```

Generated with discovered.json: 0xf846322d66b8718cb0f1d3744ec1a34214dbe36b

# Diff at Mon, 20 Jan 2025 11:10:37 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@2c8b4f3d9910bb6371be9b4df87b70856e7d8c64 block: 25080463
- current block number: 25080463

## Description

Rerun on the same block number. Applies fixes to permissions and via field. Renames permission's target to to/from.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 25080463 (main branch discovery), not current.

```diff
    contract ERC20Inbox (0x21A1e2BFC61F30F2E81E0b08cd37c1FC7ef776E7) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      issuedPermissions.0.target:
-        "0x871e290d5447b958131F6d44f915F10032436ee6"
      issuedPermissions.0.via.1.delay:
-        0
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x871e290d5447b958131F6d44f915F10032436ee6"
    }
```

```diff
    contract UTBDecent (0x43019F8BE1F192587883b67dEA2994999f5a2de2) {
    +++ description: The UTB contract serves as an L2<->L3 gateway by integrating with Decent (LayerZero app) to allow bridging and swapping in- and out of Degen L3. This is achieved using external modules (smart contracts) like swappers and bridgers that can be registered in the UTB contract.
      issuedPermissions.0.target:
-        "0x690f4e2f19717A06E1C146B2dCE68c2d23e36f4c"
      issuedPermissions.0.to:
+        "0x690f4e2f19717A06E1C146B2dCE68c2d23e36f4c"
      issuedPermissions.0.description:
+        "directly controls the UTB contract's critical functions like updating all roles and modules."
    }
```

```diff
    contract SequencerInbox (0x6216dD1EE27C5aCEC7427052d3eCDc98E2bc2221) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      issuedPermissions.1.target:
-        "0x871e290d5447b958131F6d44f915F10032436ee6"
      issuedPermissions.1.via.1.delay:
-        0
      issuedPermissions.1.via.0.delay:
-        0
      issuedPermissions.1.to:
+        "0x871e290d5447b958131F6d44f915F10032436ee6"
      issuedPermissions.0.target:
-        "0xc98A32DdD1b30B3788670C9992f3B18EF83Da491"
      issuedPermissions.0.to:
+        "0xc98A32DdD1b30B3788670C9992f3B18EF83Da491"
      issuedPermissions.0.description:
+        "Can submit transaction batches or commitments to the SequencerInbox contract on the host chain."
    }
```

```diff
    contract ChallengeManager (0x67812161Bbb6aCF891aA6028BC614a660961ceD8) {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      issuedPermissions.0.target:
-        "0x871e290d5447b958131F6d44f915F10032436ee6"
      issuedPermissions.0.via.1.delay:
-        0
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x871e290d5447b958131F6d44f915F10032436ee6"
    }
```

```diff
    contract ERC20RollupEventInbox (0x766DD3A13d17C6D175975C89225bde89F052dBc4) {
    +++ description: Helper contract sending configuration data over the bridge during the systems initialization.
      issuedPermissions.0.target:
-        "0x871e290d5447b958131F6d44f915F10032436ee6"
      issuedPermissions.0.via.1.delay:
-        0
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x871e290d5447b958131F6d44f915F10032436ee6"
    }
```

```diff
    contract DegenMultisig (0x871e290d5447b958131F6d44f915F10032436ee6) {
    +++ description: None
      receivedPermissions.8.target:
-        "0xEfEf4558802bF373Ce3307189C79a9cAb0a4Cb9C"
      receivedPermissions.8.from:
+        "0xEfEf4558802bF373Ce3307189C79a9cAb0a4Cb9C"
      receivedPermissions.7.target:
-        "0xe63ddb12FBb6211a73F12a4367b10dA0834B82da"
      receivedPermissions.7.from:
+        "0xe63ddb12FBb6211a73F12a4367b10dA0834B82da"
      receivedPermissions.6.target:
-        "0xD34F3a11F10DB069173b32d84F02eDA578709143"
      receivedPermissions.6.from:
+        "0xD34F3a11F10DB069173b32d84F02eDA578709143"
      receivedPermissions.5.target:
-        "0xaA3A7A2ec2477A61082E1C41a2c6710587917028"
      receivedPermissions.5.from:
+        "0xaA3A7A2ec2477A61082E1C41a2c6710587917028"
      receivedPermissions.4.target:
-        "0x766DD3A13d17C6D175975C89225bde89F052dBc4"
      receivedPermissions.4.from:
+        "0x766DD3A13d17C6D175975C89225bde89F052dBc4"
      receivedPermissions.3.target:
-        "0x67812161Bbb6aCF891aA6028BC614a660961ceD8"
      receivedPermissions.3.from:
+        "0x67812161Bbb6aCF891aA6028BC614a660961ceD8"
      receivedPermissions.2.target:
-        "0x6216dD1EE27C5aCEC7427052d3eCDc98E2bc2221"
      receivedPermissions.2.from:
+        "0x6216dD1EE27C5aCEC7427052d3eCDc98E2bc2221"
      receivedPermissions.1.target:
-        "0x21A1e2BFC61F30F2E81E0b08cd37c1FC7ef776E7"
      receivedPermissions.1.from:
+        "0x21A1e2BFC61F30F2E81E0b08cd37c1FC7ef776E7"
      receivedPermissions.0.target:
-        "0xD34F3a11F10DB069173b32d84F02eDA578709143"
      receivedPermissions.0.from:
+        "0xD34F3a11F10DB069173b32d84F02eDA578709143"
      directlyReceivedPermissions.0.target:
-        "0xaA3A7A2ec2477A61082E1C41a2c6710587917028"
      directlyReceivedPermissions.0.from:
+        "0xaA3A7A2ec2477A61082E1C41a2c6710587917028"
    }
```

```diff
    contract UpgradeExecutor (0xaA3A7A2ec2477A61082E1C41a2c6710587917028) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      issuedPermissions.0.target:
-        "0x871e290d5447b958131F6d44f915F10032436ee6"
      issuedPermissions.0.via.1.delay:
-        0
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x871e290d5447b958131F6d44f915F10032436ee6"
      directlyReceivedPermissions.2.target:
-        "0xD34F3a11F10DB069173b32d84F02eDA578709143"
      directlyReceivedPermissions.2.from:
+        "0xD34F3a11F10DB069173b32d84F02eDA578709143"
      directlyReceivedPermissions.1.target:
-        "0xD34F3a11F10DB069173b32d84F02eDA578709143"
      directlyReceivedPermissions.1.from:
+        "0xD34F3a11F10DB069173b32d84F02eDA578709143"
      directlyReceivedPermissions.0.target:
-        "0xFB48D385Fa3da33762B350e1d705b9E46054E677"
      directlyReceivedPermissions.0.from:
+        "0xFB48D385Fa3da33762B350e1d705b9E46054E677"
    }
```

```diff
    contract RollupProxy (0xD34F3a11F10DB069173b32d84F02eDA578709143) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      issuedPermissions.2.target:
-        "0x3cAF7ceF6B2aECA72102E8835325B26BF99FE9E0"
      issuedPermissions.2.to:
+        "0x3cAF7ceF6B2aECA72102E8835325B26BF99FE9E0"
      issuedPermissions.2.description:
+        "Can propose new state roots (called nodes) and challenge state roots on the host chain."
      issuedPermissions.1.target:
-        "0x871e290d5447b958131F6d44f915F10032436ee6"
      issuedPermissions.1.via.0.delay:
-        0
      issuedPermissions.1.to:
+        "0x871e290d5447b958131F6d44f915F10032436ee6"
      issuedPermissions.0.target:
-        "0x871e290d5447b958131F6d44f915F10032436ee6"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.via.0.description:
-        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
      issuedPermissions.0.to:
+        "0x871e290d5447b958131F6d44f915F10032436ee6"
      issuedPermissions.0.description:
+        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
    }
```

```diff
    contract OrbitERC20OFTAdapter (0xDb8E759859058952c34953c8469f464109826e52) {
    +++ description: As a designated allowed outbox, this contract can access all funds of the canonical bridge escrow. It also interfaces with the LayerZero AMB, giving this external bridge access to the Degen L3 canonical bridge and making canonical bridge security dependent on LayerZero security.
      issuedPermissions.0.target:
-        "0x3C12B77aE8B7DD1FEB63D1D6a2A819AcdA0a41d2"
      issuedPermissions.0.to:
+        "0x3C12B77aE8B7DD1FEB63D1D6a2A819AcdA0a41d2"
      issuedPermissions.0.description:
+        "Can control the LayerZero OrbitERC20OFTAdapter contract for the DEGEN token and thus potentially steal all funds from the canonical bridge."
    }
```

```diff
    contract ERC20Outbox (0xe63ddb12FBb6211a73F12a4367b10dA0834B82da) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
      issuedPermissions.0.target:
-        "0x871e290d5447b958131F6d44f915F10032436ee6"
      issuedPermissions.0.via.1.delay:
-        0
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x871e290d5447b958131F6d44f915F10032436ee6"
    }
```

```diff
    contract ERC20Bridge (0xEfEf4558802bF373Ce3307189C79a9cAb0a4Cb9C) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      issuedPermissions.0.target:
-        "0x871e290d5447b958131F6d44f915F10032436ee6"
      issuedPermissions.0.via.1.delay:
-        0
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x871e290d5447b958131F6d44f915F10032436ee6"
    }
```

```diff
    contract ProxyAdmin (0xFB48D385Fa3da33762B350e1d705b9E46054E677) {
    +++ description: None
      directlyReceivedPermissions.6.target:
-        "0xEfEf4558802bF373Ce3307189C79a9cAb0a4Cb9C"
      directlyReceivedPermissions.6.from:
+        "0xEfEf4558802bF373Ce3307189C79a9cAb0a4Cb9C"
      directlyReceivedPermissions.5.target:
-        "0xe63ddb12FBb6211a73F12a4367b10dA0834B82da"
      directlyReceivedPermissions.5.from:
+        "0xe63ddb12FBb6211a73F12a4367b10dA0834B82da"
      directlyReceivedPermissions.4.target:
-        "0xaA3A7A2ec2477A61082E1C41a2c6710587917028"
      directlyReceivedPermissions.4.from:
+        "0xaA3A7A2ec2477A61082E1C41a2c6710587917028"
      directlyReceivedPermissions.3.target:
-        "0x766DD3A13d17C6D175975C89225bde89F052dBc4"
      directlyReceivedPermissions.3.from:
+        "0x766DD3A13d17C6D175975C89225bde89F052dBc4"
      directlyReceivedPermissions.2.target:
-        "0x67812161Bbb6aCF891aA6028BC614a660961ceD8"
      directlyReceivedPermissions.2.from:
+        "0x67812161Bbb6aCF891aA6028BC614a660961ceD8"
      directlyReceivedPermissions.1.target:
-        "0x6216dD1EE27C5aCEC7427052d3eCDc98E2bc2221"
      directlyReceivedPermissions.1.from:
+        "0x6216dD1EE27C5aCEC7427052d3eCDc98E2bc2221"
      directlyReceivedPermissions.0.target:
-        "0x21A1e2BFC61F30F2E81E0b08cd37c1FC7ef776E7"
      directlyReceivedPermissions.0.from:
+        "0x21A1e2BFC61F30F2E81E0b08cd37c1FC7ef776E7"
    }
```

Generated with discovered.json: 0xc9c9cac09a158660e9a408b7a296892663672417

# Diff at Wed, 15 Jan 2025 14:12:07 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@3ea176aee1470e5ec80e65adfc81a954f84584d8 block: 24084728
- current block number: 25080463

## Description

ArbOS v32 upgrade to known shapes and maxTimeVariation reset.

## Watched changes

```diff
-   Status: DELETED
    contract OneStepProverMemory (0x2Bb71AE6f5Bb52de5F535efD804e156ed2a35a8f)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
    contract SequencerInbox (0x6216dD1EE27C5aCEC7427052d3eCDc98E2bc2221) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      values.maxTimeVariation.delayBlocks:
-        3456000
+        172800
      values.maxTimeVariation.futureBlocks:
-        48
+        1800
      values.maxTimeVariation.delaySeconds:
-        86400000
+        345600
    }
```

```diff
    contract ChallengeManager (0x67812161Bbb6aCF891aA6028BC614a660961ceD8) {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      sourceHashes.1:
-        "0x58a6261c83c2766f749641902ad6fdb695ea189d2747f073b57a8f35b9a547e5"
+        "0x1a095768302d7d1c3d02375eaa3341833b4f1aaac707e1c608bce478c87cbf27"
      values.$implementation:
-        "0x377A5b786E94cAcdcB2B309451C373c8F2166A79"
+        "0x5C2950Bd136716540e1F5CF442f2AB0aD2F413A7"
      values.$pastUpgrades.2:
+        ["2025-01-13T19:31:15.000Z","0xd67a1ccd5e97907f82409a506ecc0d1ae8b8963ab6ced7f837b9643375be4f26",["0x5C2950Bd136716540e1F5CF442f2AB0aD2F413A7"]]
      values.$upgradeCount:
-        2
+        3
      values.osp:
-        "0xC17A41629Cd100c74B1Bed7b49D2E0517EfDeaeb"
+        "0x15D2a9A14de6Ea03AADE944641eAb497a3A4c9DF"
    }
```

```diff
-   Status: DELETED
    contract OneStepProverMath (0x764cDAAc715ef3e29B3c8D28A1261AD9B7eD206D)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
    contract DegenMultisig (0x871e290d5447b958131F6d44f915F10032436ee6) {
    +++ description: None
      receivedPermissions.0.description:
-        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
+        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
    }
```

```diff
    contract UpgradeExecutor (0xaA3A7A2ec2477A61082E1C41a2c6710587917028) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      directlyReceivedPermissions.1.description:
-        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
+        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
    }
```

```diff
-   Status: DELETED
    contract OneStepProver0 (0xBa04bD4aDa714b0cb3B87784dc9F20620aF37428)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
-   Status: DELETED
    contract OneStepProofEntry (0xC17A41629Cd100c74B1Bed7b49D2E0517EfDeaeb)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
    contract RollupProxy (0xD34F3a11F10DB069173b32d84F02eDA578709143) {
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
-        "0xB7202d306936B79Ba29907b391faA87D3BEec33A"
+        "0x747D88df773721558575BA29fEf11FE28ED25266"
      values.$implementation.0:
-        "0x3A59b13eB3F661DE35a1e203Bd12b3B4123976cf"
+        "0xb760B98D6256F8D135cEB738Eb9A9E44Af9B3b41"
      values.$pastUpgrades.1:
+        ["2025-01-13T19:31:15.000Z","0xd67a1ccd5e97907f82409a506ecc0d1ae8b8963ab6ced7f837b9643375be4f26",["0xb760B98D6256F8D135cEB738Eb9A9E44Af9B3b41","0x747D88df773721558575BA29fEf11FE28ED25266"]]
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
    contract OneStepProverHostIo (0xF4AA217a96c205df7B0D081DC95385B701eFE9b0)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract OneStepProofEntry (0x15D2a9A14de6Ea03AADE944641eAb497a3A4c9DF)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract OneStepProverMemory (0x173FCB92df1854c3B78dC8696C23B1c88437b892)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract OneStepProverHostIo (0x320e29bc3f34bc6B8834bBD2B6b013ef6620E69F)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract OneStepProver0 (0x97ba9522f2e5D67e96FeA6B612e794dc96637AAc)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract OneStepProverMath (0xDf6C4562e853C4F775285710B467e2EE4Ca8D22c)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

## Source code changes

```diff
.../ChallengeManager/ChallengeManager.sol          | 404 ++++++----
 .../OneStepProofEntry.sol                          | 485 +++++++++--
 .../{.flat@24084728 => .flat}/OneStepProver0.sol   | 765 +++++++++++++-----
 .../OneStepProverHostIo.sol                        | 892 +++++++++++++++++----
 .../OneStepProverMath.sol                          |  65 +-
 .../OneStepProverMemory.sol                        | 315 ++++++--
 .../RollupProxy/RollupAdminLogic.1.sol             | 370 ++++++---
 .../RollupProxy/RollupUserLogic.2.sol              | 415 ++++++----
 8 files changed, 2766 insertions(+), 945 deletions(-)
```

Generated with discovered.json: 0xa55873b556a01a947011db0026deb4153b6085fb

# Diff at Wed, 08 Jan 2025 10:45:03 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@20bf0eaa1dce373e2c004314fef59d2d1bdf5502 block: 24084728
- current block number: 24084728

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 24084728 (main branch discovery), not current.

```diff
    contract ERC20Bridge (0xEfEf4558802bF373Ce3307189C79a9cAb0a4Cb9C) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      description:
-        "Escrow contract for the project's gas token (Can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging."
+        "Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging."
    }
```

Generated with discovered.json: 0x4839b434e15e0bbe7094153fd41217680a726f24

# Diff at Mon, 23 Dec 2024 13:00:37 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@18325a975c44684702f30ee366361589e4c2ed8c block: 23507453
- current block number: 24084728

## Description

Config related: Celestia-Nitro wmroot added.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 23507453 (main branch discovery), not current.

```diff
    contract RollupProxy (0xD34F3a11F10DB069173b32d84F02eDA578709143) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      usedTypes.0.arg.0xe81f986823a85105c5fd91bb53b4493d38c0c26652d23f76a7405ac889908287:
+        "Celestia Nitro 3.2.1 wasmModuleRoot"
    }
```

Generated with discovered.json: 0xaf6bdfb3d3ee2057467bb569f0c20357b81582d3

# Diff at Tue, 10 Dec 2024 04:17:42 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@ab81f2e521ef5f4c0b34bbc68d4e5c4c91c9c391 block: 23489719
- current block number: 23507453

## Description

EOA upgrader removed, move to 1 validator and back to 2/3 anytrust.

## Watched changes

```diff
    contract ERC20Inbox (0x21A1e2BFC61F30F2E81E0b08cd37c1FC7ef776E7) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      issuedPermissions.1:
-        {"permission":"upgrade","target":"0xD6e5317512350b5b6CCE7A0D1d139844adB55919","via":[{"address":"0xaA3A7A2ec2477A61082E1C41a2c6710587917028","delay":0},{"address":"0xFB48D385Fa3da33762B350e1d705b9E46054E677","delay":0}]}
    }
```

```diff
    contract SequencerInbox (0x6216dD1EE27C5aCEC7427052d3eCDc98E2bc2221) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      issuedPermissions.2:
-        {"permission":"upgrade","target":"0xD6e5317512350b5b6CCE7A0D1d139844adB55919","via":[{"address":"0xaA3A7A2ec2477A61082E1C41a2c6710587917028","delay":0},{"address":"0xFB48D385Fa3da33762B350e1d705b9E46054E677","delay":0}]}
    }
```

```diff
    contract ChallengeManager (0x67812161Bbb6aCF891aA6028BC614a660961ceD8) {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      issuedPermissions.1:
-        {"permission":"upgrade","target":"0xD6e5317512350b5b6CCE7A0D1d139844adB55919","via":[{"address":"0xaA3A7A2ec2477A61082E1C41a2c6710587917028","delay":0},{"address":"0xFB48D385Fa3da33762B350e1d705b9E46054E677","delay":0}]}
    }
```

```diff
    contract ERC20RollupEventInbox (0x766DD3A13d17C6D175975C89225bde89F052dBc4) {
    +++ description: Helper contract sending configuration data over the bridge during the systems initialization.
      issuedPermissions.1:
-        {"permission":"upgrade","target":"0xD6e5317512350b5b6CCE7A0D1d139844adB55919","via":[{"address":"0xaA3A7A2ec2477A61082E1C41a2c6710587917028","delay":0},{"address":"0xFB48D385Fa3da33762B350e1d705b9E46054E677","delay":0}]}
    }
```

```diff
    contract UpgradeExecutor (0xaA3A7A2ec2477A61082E1C41a2c6710587917028) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      issuedPermissions.1:
-        {"permission":"upgrade","target":"0xD6e5317512350b5b6CCE7A0D1d139844adB55919","via":[{"address":"0xaA3A7A2ec2477A61082E1C41a2c6710587917028","delay":0},{"address":"0xFB48D385Fa3da33762B350e1d705b9E46054E677","delay":0}]}
      values.accessControl.EXECUTOR_ROLE.members.1:
-        "0xD6e5317512350b5b6CCE7A0D1d139844adB55919"
      values.executors.1:
-        "0xD6e5317512350b5b6CCE7A0D1d139844adB55919"
    }
```

```diff
    contract RollupProxy (0xD34F3a11F10DB069173b32d84F02eDA578709143) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      issuedPermissions.4:
-        {"permission":"validate","target":"0x3cAF7ceF6B2aECA72102E8835325B26BF99FE9E0","via":[]}
      issuedPermissions.3:
-        {"permission":"upgrade","target":"0xD6e5317512350b5b6CCE7A0D1d139844adB55919","via":[{"address":"0xaA3A7A2ec2477A61082E1C41a2c6710587917028","delay":0}]}
      issuedPermissions.2.permission:
-        "upgrade"
+        "validate"
      issuedPermissions.2.target:
-        "0x871e290d5447b958131F6d44f915F10032436ee6"
+        "0x3cAF7ceF6B2aECA72102E8835325B26BF99FE9E0"
      issuedPermissions.2.via.0:
-        {"address":"0xaA3A7A2ec2477A61082E1C41a2c6710587917028","delay":0}
      issuedPermissions.1.permission:
-        "configure"
+        "upgrade"
      issuedPermissions.1.target:
-        "0xD6e5317512350b5b6CCE7A0D1d139844adB55919"
+        "0x871e290d5447b958131F6d44f915F10032436ee6"
      issuedPermissions.1.via.0.description:
-        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
      values.lastStakeBlock:
-        12468814
+        23492774
      values.stakerCount:
-        1
+        2
    }
```

```diff
    contract ERC20Outbox (0xe63ddb12FBb6211a73F12a4367b10dA0834B82da) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
      issuedPermissions.1:
-        {"permission":"upgrade","target":"0xD6e5317512350b5b6CCE7A0D1d139844adB55919","via":[{"address":"0xaA3A7A2ec2477A61082E1C41a2c6710587917028","delay":0},{"address":"0xFB48D385Fa3da33762B350e1d705b9E46054E677","delay":0}]}
    }
```

```diff
    contract ERC20Bridge (0xEfEf4558802bF373Ce3307189C79a9cAb0a4Cb9C) {
    +++ description: Escrow contract for the project's gas token (Can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      issuedPermissions.1:
-        {"permission":"upgrade","target":"0xD6e5317512350b5b6CCE7A0D1d139844adB55919","via":[{"address":"0xaA3A7A2ec2477A61082E1C41a2c6710587917028","delay":0},{"address":"0xFB48D385Fa3da33762B350e1d705b9E46054E677","delay":0}]}
    }
```

Generated with discovered.json: 0x04c12d4f6a4aa17b8ae403571a340051083dae0d

# Diff at Mon, 09 Dec 2024 18:27:10 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@02974be0caac873bba9178e618086aa67aaf0b90 block: 22921651
- current block number: 23489719

## Description

EOA executor added (redwarn with link to twitter announcement).

## Watched changes

```diff
    contract ERC20Inbox (0x21A1e2BFC61F30F2E81E0b08cd37c1FC7ef776E7) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      issuedPermissions.1:
+        {"permission":"upgrade","target":"0xD6e5317512350b5b6CCE7A0D1d139844adB55919","via":[{"address":"0xaA3A7A2ec2477A61082E1C41a2c6710587917028","delay":0},{"address":"0xFB48D385Fa3da33762B350e1d705b9E46054E677","delay":0}]}
    }
```

```diff
    contract SequencerInbox (0x6216dD1EE27C5aCEC7427052d3eCDc98E2bc2221) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      issuedPermissions.2:
+        {"permission":"upgrade","target":"0xD6e5317512350b5b6CCE7A0D1d139844adB55919","via":[{"address":"0xaA3A7A2ec2477A61082E1C41a2c6710587917028","delay":0},{"address":"0xFB48D385Fa3da33762B350e1d705b9E46054E677","delay":0}]}
      issuedPermissions.0.target:
-        "0xa3582189403F67a9CDB1CE0Ac066c954FFd3f205"
+        "0xc98A32DdD1b30B3788670C9992f3B18EF83Da491"
      values.batchPosters.0:
-        "0xa3582189403F67a9CDB1CE0Ac066c954FFd3f205"
+        "0xc98A32DdD1b30B3788670C9992f3B18EF83Da491"
      values.dacKeyset.requiredSignatures:
-        1
+        2
      values.dacKeyset.membersCount:
-        1
+        3
      values.dacKeyset.blsSignatures.2:
+        "YBM2CNbXUrBB22GzuCkaTIzOQrfSwdwCTl2ej9tBf6Wmo/ZO+s39ZLew/mAvAV60KQ7yS/8Re4eD9DRUUqlhyxxlRONtpTpSBw8JMbmz250J7XZoIOKcAKV8eoMDy108ORknqn+FXSGJt8+Y6cj4ChEZWs4ja0N0UqMhpaZp1qifxc9lRiOH510UzaNGSHbWbxFTGdtfyDUcnfhxgL+Wbk2z7uZomTsp3XrWQRkVnYXjjNFHiHXKo48KWtyShjAlFwgH+tfN5ToQLoJ2ZX3HCgB6Hs7JzxyX3++eJmc1kDWTkFPUOPTQad6kVL+C7c3cOwY51GvcDfpb9p21Lwfp45tRG2u/gT+9fEktwZjf9eZ2z956eWeSbdAu048VVbCT2A=="
      values.dacKeyset.blsSignatures.1:
+        "YBTAiDkCUKzMkFUQZNd+3sgcAYrrcgC0ei94oLj6K2KtAXVJtHGh0efU2CZAgY6DMw1aAw2gHcEUKuWVVhMjlH5Qo6DRgrTAiOrPoteh/fujys8ho80oDEIPxcjARa4HJhkKkz05V38lveZdr99H4N5Fw0+YdO6zWpxRIVp75/CrtoL0Dmddm1btmp1mfQBAgQ0YgtjtA8fFdIVSmgEmo/IGUwSLUSzssZtXJ05wLlql1JQ4wDKnWDT0SY2zdfVzSwte53eCel8yPweITdKA2Dyg8OIXDLIQhhk1vH2cPgJJzChO42ST+Ht0+/ljQFfAWQxIFUhXYZYvpLXxCkTCC5bbjxDipn9pXAzLL/LRi86a/S4MspeNCYo6ZcfzpWU0mQ=="
      values.dacKeyset.blsSignatures.0:
-        "YBhPN6Tq6nXoJS041bPwKYcDeU1Y84s1URBM4MJHKup49TzNB/23scWwhETSvpAl1RnMwh0S/Z+LZ8UGFWlLYmquyJi5weYTsMF6rChTnuZnqY4I1zQZPemy5hK0sIJDlQaqb/llv/8ujT5q3p4DhBLXZ3eIUMcXs4j7F+QMNZyO87mbTnrulLiPfZbAno1SKg8k2Q76fbNPQs76GK4aseCPeA5hPguvjijDIqDVK5Ffz/PhQ6nap8K6UlApBm+CMBIOmAP9IdMyAVs+wirhgMvR88+JVhoMW9kU3F90bWks78tHYqASrw/lXBFI8TgiGhlvvsmUJAC3dyzjccjMyO0M05JjmM1i8bkAdYuCWRF0KV63rABVXUAFGtKAzrLPpw=="
+        "YAtxuF6Orp5B0ZedhRtm/thSIRu9sIPQaFSWZwHu/LlBE6PN+LZzXXxrEgTydfM3YQ86Ba9XZSaUByCANDPVHG67wZgB5AizpRGyygS/O7fbvEwL3S5iDg0tcUx4vlqUqxny/6bWoEeYX6UJ8WisnBP0RKnHUixIpn3ONQflNju2HMWH2yXaUhAS/wRNPIMaXBDSN1zPF1+rYv805ByZFgt6u0mBi1UCYa/+Zn1bsEB9SnLV0EjQSgLWBZYTmNoEzgJSMcerU8X4sgUvfYaLCUHxul3GXKtWtVARcjisCWUBmarmb+i1B53E4t1Q51QU7wyU1udkwDx67kp44CDJVVA/OoVKHcrRfKfPdPXlW5/ZlbysB8DHTWsNikieagB74A=="
      values.keySetUpdates:
-        1
+        2
      values.setIsBatchPosterCount:
-        1
+        3
    }
```

```diff
    contract ChallengeManager (0x67812161Bbb6aCF891aA6028BC614a660961ceD8) {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      issuedPermissions.1:
+        {"permission":"upgrade","target":"0xD6e5317512350b5b6CCE7A0D1d139844adB55919","via":[{"address":"0xaA3A7A2ec2477A61082E1C41a2c6710587917028","delay":0},{"address":"0xFB48D385Fa3da33762B350e1d705b9E46054E677","delay":0}]}
    }
```

```diff
    contract ERC20RollupEventInbox (0x766DD3A13d17C6D175975C89225bde89F052dBc4) {
    +++ description: Helper contract sending configuration data over the bridge during the systems initialization.
      issuedPermissions.1:
+        {"permission":"upgrade","target":"0xD6e5317512350b5b6CCE7A0D1d139844adB55919","via":[{"address":"0xaA3A7A2ec2477A61082E1C41a2c6710587917028","delay":0},{"address":"0xFB48D385Fa3da33762B350e1d705b9E46054E677","delay":0}]}
    }
```

```diff
    contract UpgradeExecutor (0xaA3A7A2ec2477A61082E1C41a2c6710587917028) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      issuedPermissions.1:
+        {"permission":"upgrade","target":"0xD6e5317512350b5b6CCE7A0D1d139844adB55919","via":[{"address":"0xaA3A7A2ec2477A61082E1C41a2c6710587917028","delay":0},{"address":"0xFB48D385Fa3da33762B350e1d705b9E46054E677","delay":0}]}
      values.accessControl.EXECUTOR_ROLE.members.1:
+        "0xD6e5317512350b5b6CCE7A0D1d139844adB55919"
      values.executors.1:
+        "0xD6e5317512350b5b6CCE7A0D1d139844adB55919"
    }
```

```diff
    contract RollupProxy (0xD34F3a11F10DB069173b32d84F02eDA578709143) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      issuedPermissions.4:
+        {"permission":"validate","target":"0x3cAF7ceF6B2aECA72102E8835325B26BF99FE9E0","via":[]}
      issuedPermissions.3:
+        {"permission":"upgrade","target":"0xD6e5317512350b5b6CCE7A0D1d139844adB55919","via":[{"address":"0xaA3A7A2ec2477A61082E1C41a2c6710587917028","delay":0}]}
      issuedPermissions.2.permission:
-        "validate"
+        "upgrade"
      issuedPermissions.2.target:
-        "0x1BCdC0eCc1e4A31E5dB0542f81895d8319A757Ca"
+        "0x871e290d5447b958131F6d44f915F10032436ee6"
      issuedPermissions.2.via.0:
+        {"address":"0xaA3A7A2ec2477A61082E1C41a2c6710587917028","delay":0}
      issuedPermissions.1.permission:
-        "upgrade"
+        "configure"
      issuedPermissions.1.target:
-        "0x871e290d5447b958131F6d44f915F10032436ee6"
+        "0xD6e5317512350b5b6CCE7A0D1d139844adB55919"
      issuedPermissions.1.via.0.description:
+        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
+++ description: Increments on each Validator change.
      values.setValidatorCount:
-        1
+        3
      values.validators.0:
-        "0x1BCdC0eCc1e4A31E5dB0542f81895d8319A757Ca"
+        "0x3cAF7ceF6B2aECA72102E8835325B26BF99FE9E0"
    }
```

```diff
    contract ERC20Outbox (0xe63ddb12FBb6211a73F12a4367b10dA0834B82da) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
      issuedPermissions.1:
+        {"permission":"upgrade","target":"0xD6e5317512350b5b6CCE7A0D1d139844adB55919","via":[{"address":"0xaA3A7A2ec2477A61082E1C41a2c6710587917028","delay":0},{"address":"0xFB48D385Fa3da33762B350e1d705b9E46054E677","delay":0}]}
    }
```

```diff
    contract ERC20Bridge (0xEfEf4558802bF373Ce3307189C79a9cAb0a4Cb9C) {
    +++ description: Escrow contract for the project's gas token (Can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      issuedPermissions.1:
+        {"permission":"upgrade","target":"0xD6e5317512350b5b6CCE7A0D1d139844adB55919","via":[{"address":"0xaA3A7A2ec2477A61082E1C41a2c6710587917028","delay":0},{"address":"0xFB48D385Fa3da33762B350e1d705b9E46054E677","delay":0}]}
    }
```

Generated with discovered.json: 0x61228a43322a3902933f5424a240793a4336f6c1

# Diff at Fri, 06 Dec 2024 08:12:47 GMT:

- author: Piotr Szlachciak (<szlachciak.piotr@gmail.com>)
- comparing to: main@f9ded76f7930b0c86788e4c4595d553b165b87d1 block: 22921651
- current block number: 22921651

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22921651 (main branch discovery), not current.

```diff
    contract ValidatorUtils (0x23b0348788b96ee1cE4e7DdED4AC2A99de516F51) {
    +++ description: This contract implements view only utilities for validators.
      template:
+        "orbitstack/ValidatorUtils"
      description:
+        "This contract implements view only utilities for validators."
    }
```

Generated with discovered.json: 0xafcbe3bd46457fa0b146c4330f30e32f874f09df

# Diff at Fri, 29 Nov 2024 11:28:53 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@9776abb8b1f960f6f1ec6ec27558b5eff7eb5b87 block: 22921651
- current block number: 22921651

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22921651 (main branch discovery), not current.

```diff
    contract DegenMultisig (0x871e290d5447b958131F6d44f915F10032436ee6) {
    +++ description: None
      receivedPermissions.0.description:
-        "can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
+        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
    }
```

```diff
    contract UpgradeExecutor (0xaA3A7A2ec2477A61082E1C41a2c6710587917028) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      directlyReceivedPermissions.1.description:
-        "can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
+        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
    }
```

```diff
    contract RollupProxy (0xD34F3a11F10DB069173b32d84F02eDA578709143) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      issuedPermissions.0.via.0.description:
-        "can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
+        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
      fieldMeta.minimumAssertionPeriod:
+        {"description":"Minimum time delta between newly created nodes (stateUpdates). This is checked on `stakeOnNewNode()`. Format is number of ETHEREUM blocks, even for L3s. "}
    }
```

Generated with discovered.json: 0x8d5ead9c8c45b54da433c780dd575aa9201e32a7

# Diff at Wed, 27 Nov 2024 13:46:31 GMT:

- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@3b9391cfe483e60a1853eeae6e47b4de475aac4e block: 22580502
- current block number: 22921651

## Description

Move to discoverydriven data.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22580502 (main branch discovery), not current.

```diff
    contract ERC20Inbox (0x21A1e2BFC61F30F2E81E0b08cd37c1FC7ef776E7) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      name:
-        "Inbox"
+        "ERC20Inbox"
      displayName:
+        "Inbox"
    }
```

```diff
    contract UTBDecent (0x43019F8BE1F192587883b67dEA2994999f5a2de2) {
    +++ description: The UTB contract serves as an L2<->L3 gateway by integrating with Decent (LayerZero app) to allow bridging and swapping in- and out of Degen L3. This is achieved using external modules (smart contracts) like swappers and bridgers that can be registered in the UTB contract.
      description:
+        "The UTB contract serves as an L2<->L3 gateway by integrating with Decent (LayerZero app) to allow bridging and swapping in- and out of Degen L3. This is achieved using external modules (smart contracts) like swappers and bridgers that can be registered in the UTB contract."
      issuedPermissions:
+        [{"permission":"configure","target":"0x690f4e2f19717A06E1C146B2dCE68c2d23e36f4c","via":[]}]
    }
```

```diff
    contract SequencerInbox (0x6216dD1EE27C5aCEC7427052d3eCDc98E2bc2221) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      description:
-        "State batches / commitments get posted here."
+        "A sequencer (registered in this contract) can submit transaction batches or commitments here."
    }
```

```diff
    contract OrbitERC20OFTAdapter (0xDb8E759859058952c34953c8469f464109826e52) {
    +++ description: As a designated allowed outbox, this contract can access all funds of the canonical bridge escrow. It also interfaces with the LayerZero AMB, giving this external bridge access to the Degen L3 canonical bridge and making canonical bridge security dependent on LayerZero security.
      description:
+        "As a designated allowed outbox, this contract can access all funds of the canonical bridge escrow. It also interfaces with the LayerZero AMB, giving this external bridge access to the Degen L3 canonical bridge and making canonical bridge security dependent on LayerZero security."
      issuedPermissions:
+        [{"permission":"configure","target":"0x3C12B77aE8B7DD1FEB63D1D6a2A819AcdA0a41d2","via":[]}]
    }
```

```diff
    contract ERC20Outbox (0xe63ddb12FBb6211a73F12a4367b10dA0834B82da) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
      name:
-        "Outbox"
+        "ERC20Outbox"
      displayName:
+        "Outbox"
    }
```

```diff
    contract ERC20Bridge (0xEfEf4558802bF373Ce3307189C79a9cAb0a4Cb9C) {
    +++ description: Escrow contract for the project's gas token (Can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      name:
-        "Bridge"
+        "ERC20Bridge"
      displayName:
+        "Bridge"
    }
```

Generated with discovered.json: 0x4dc1e62f8d759083d693975e0570bbb5e477dc3a

# Diff at Mon, 18 Nov 2024 17:19:32 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@b54f69b0d6666908da980a31e5f52da87009f1ab block: 22134218
- current block number: 22580502

## Description

A new OFT adapter contract (for the DEGEN token) is added as allowed Outbox to the main bridge. This gives the OFT adapter the permission to make any calls as the bridge (including sending all tokens from the bridge). See the Sanko L3 on Arbitrum for a similar construction. The LayerZero AMB now has access to the canonically escrowed funds and the bridge escrow serves doubly as a canonical escrow and OFT adapter lockbox.

## Watched changes

```diff
    contract Bridge (0xEfEf4558802bF373Ce3307189C79a9cAb0a4Cb9C) {
    +++ description: Escrow contract for the project's gas token (Can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      values.allowedOutboxList.1:
+        "0xDb8E759859058952c34953c8469f464109826e52"
    }
```

```diff
+   Status: CREATED
    contract OrbitERC20OFTAdapter (0xDb8E759859058952c34953c8469f464109826e52)
    +++ description: None
```

## Source code changes

```diff
.../degen/base/.flat/OrbitERC20OFTAdapter.sol      | 1905 ++++++++++++++++++++
 1 file changed, 1905 insertions(+)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22134218 (main branch discovery), not current.

```diff
    contract DegenMultisig (0x871e290d5447b958131F6d44f915F10032436ee6) {
    +++ description: None
      values.getOwners:
-        ["0x39CF304731099e756204219BF0a8cCc4738dE9dD","0x3f0030b9Ca695Abd41b2B619F3298e172e4FCAD6","0x2e42cEfC761e64Bf4442694220d31C2464a6EE21","0x5EABE7f6673311EdD1Ad17A76ce148c2Bb56aF01","0xaCEF7482b54a57F50b1CD8c99d1dC1964202A063"]
      values.getThreshold:
-        3
      template:
+        "GnosisSafe"
    }
```

Generated with discovered.json: 0x39fbf742b897feff54977dd9ad15ea242c78c85a

# Diff at Fri, 15 Nov 2024 08:18:21 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@a00c2a67d12a174a45864b549412045028598606 block: 22134218
- current block number: 22134218

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22134218 (main branch discovery), not current.

```diff
    contract SequencerInbox (0x6216dD1EE27C5aCEC7427052d3eCDc98E2bc2221) {
    +++ description: State batches / commitments get posted here.
      fieldMeta.maxTimeVariation.description:
-        "Settable by the Rollup Owner. Transactions can only be force-included after `delayBlocks` window (Sequencer-only) has passed."
+        "Settable by the Rollup Owner. Transactions can only be force-included after the `delayBlocks` window (Sequencer-only) has passed."
    }
```

```diff
    contract UpgradeExecutor (0xaA3A7A2ec2477A61082E1C41a2c6710587917028) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      description:
-        "Central contract defining the access control for upgrading the system contract implementations."
+        "Central contract defining the access control permissions for upgrading the system contract implementations."
    }
```

```diff
    contract RollupProxy (0xD34F3a11F10DB069173b32d84F02eDA578709143) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      issuedPermissions.3:
-        {"permission":"upgrade","target":"0x871e290d5447b958131F6d44f915F10032436ee6","via":[{"address":"0xaA3A7A2ec2477A61082E1C41a2c6710587917028","delay":0}]}
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
-        "0x1BCdC0eCc1e4A31E5dB0542f81895d8319A757Ca"
+        "0x871e290d5447b958131F6d44f915F10032436ee6"
      issuedPermissions.0.via.0:
+        {"address":"0xaA3A7A2ec2477A61082E1C41a2c6710587917028","delay":0,"description":"can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."}
    }
```

Generated with discovered.json: 0xa7afd5da9d3fbc5f8413a6da688eae16f5fdc056

# Diff at Fri, 08 Nov 2024 09:23:22 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@53988239f42edde0275ed92d8f3ada4279354f7d block: 22016603
- current block number: 22134218

## Description

Governance moved to DegenMultisig.

## Watched changes

```diff
    contract Inbox (0x21A1e2BFC61F30F2E81E0b08cd37c1FC7ef776E7) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      issuedPermissions.0.target:
-        "0x7dCe2FEE5e30EFf298cD3d9B92649f00EBDfc104"
+        "0x871e290d5447b958131F6d44f915F10032436ee6"
    }
```

```diff
    contract SequencerInbox (0x6216dD1EE27C5aCEC7427052d3eCDc98E2bc2221) {
    +++ description: State batches / commitments get posted here.
      issuedPermissions.1.target:
-        "0x7dCe2FEE5e30EFf298cD3d9B92649f00EBDfc104"
+        "0x871e290d5447b958131F6d44f915F10032436ee6"
    }
```

```diff
    contract ChallengeManager (0x67812161Bbb6aCF891aA6028BC614a660961ceD8) {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      issuedPermissions.0.target:
-        "0x7dCe2FEE5e30EFf298cD3d9B92649f00EBDfc104"
+        "0x871e290d5447b958131F6d44f915F10032436ee6"
    }
```

```diff
    contract ERC20RollupEventInbox (0x766DD3A13d17C6D175975C89225bde89F052dBc4) {
    +++ description: Helper contract sending configuration data over the bridge during the systems initialization.
      issuedPermissions.0.target:
-        "0x7dCe2FEE5e30EFf298cD3d9B92649f00EBDfc104"
+        "0x871e290d5447b958131F6d44f915F10032436ee6"
    }
```

```diff
-   Status: DELETED
    contract ConduitMultisig3 (0x7dCe2FEE5e30EFf298cD3d9B92649f00EBDfc104)
    +++ description: None
```

```diff
    contract UpgradeExecutor (0xaA3A7A2ec2477A61082E1C41a2c6710587917028) {
    +++ description: Central contract defining the access control for upgrading the system contract implementations.
      issuedPermissions.0.target:
-        "0x7dCe2FEE5e30EFf298cD3d9B92649f00EBDfc104"
+        "0x871e290d5447b958131F6d44f915F10032436ee6"
      values.accessControl.EXECUTOR_ROLE.members.0:
-        "0x7dCe2FEE5e30EFf298cD3d9B92649f00EBDfc104"
+        "0x871e290d5447b958131F6d44f915F10032436ee6"
      values.executors.0:
-        "0x7dCe2FEE5e30EFf298cD3d9B92649f00EBDfc104"
+        "0x871e290d5447b958131F6d44f915F10032436ee6"
    }
```

```diff
    contract RollupProxy (0xD34F3a11F10DB069173b32d84F02eDA578709143) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      issuedPermissions.3.target:
-        "0x7dCe2FEE5e30EFf298cD3d9B92649f00EBDfc104"
+        "0x871e290d5447b958131F6d44f915F10032436ee6"
      issuedPermissions.1.target:
-        "0x7dCe2FEE5e30EFf298cD3d9B92649f00EBDfc104"
+        "0x871e290d5447b958131F6d44f915F10032436ee6"
    }
```

```diff
    contract Outbox (0xe63ddb12FBb6211a73F12a4367b10dA0834B82da) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
      issuedPermissions.0.target:
-        "0x7dCe2FEE5e30EFf298cD3d9B92649f00EBDfc104"
+        "0x871e290d5447b958131F6d44f915F10032436ee6"
    }
```

```diff
    contract Bridge (0xEfEf4558802bF373Ce3307189C79a9cAb0a4Cb9C) {
    +++ description: Escrow contract for the project's gas token (Can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      issuedPermissions.0.target:
-        "0x7dCe2FEE5e30EFf298cD3d9B92649f00EBDfc104"
+        "0x871e290d5447b958131F6d44f915F10032436ee6"
    }
```

```diff
+   Status: CREATED
    contract DegenMultisig (0x871e290d5447b958131F6d44f915F10032436ee6)
    +++ description: None
```

## Source code changes

```diff
.../DegenMultisig/SafeL2.sol}                      | 708 ++++++++++++---------
 .../DegenMultisig/SafeProxy.p.sol}                 |  10 +-
 2 files changed, 420 insertions(+), 298 deletions(-)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22016603 (main branch discovery), not current.

```diff
    contract ERC20RollupEventInbox (0x766DD3A13d17C6D175975C89225bde89F052dBc4) {
    +++ description: Helper contract sending configuration data over the bridge during the systems initialization.
      template:
+        "orbitstack/RollupEventInbox"
      displayName:
+        "RollupEventInbox"
      description:
+        "Helper contract sending configuration data over the bridge during the systems initialization."
    }
```

Generated with discovered.json: 0x9999c42a4fc957a8715e91a613aa9bdfcbbb80ea

# Diff at Tue, 05 Nov 2024 16:03:28 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@5e6ce51851b57187ccdd52c4944a82e2a8ab1e88 block: 21842198
- current block number: 22016603

## Description

Single signer added to ConduitMultisig3 (3/7).

## Watched changes

```diff
    contract ConduitMultisig3 (0x7dCe2FEE5e30EFf298cD3d9B92649f00EBDfc104) {
    +++ description: None
      values.$members.6:
+        "0xa4000bDD2bB92ce6750b31F1eeda47Bd1cB8e6e4"
      values.$members.5:
-        "0xa4000bDD2bB92ce6750b31F1eeda47Bd1cB8e6e4"
+        "0xefCf0c8faFB425997870f845e26fC6cA6EE6dD5C"
      values.$members.4:
-        "0xefCf0c8faFB425997870f845e26fC6cA6EE6dD5C"
+        "0xa0C600a6e85bf225958FFAcC70B5FDDF9A059038"
      values.$members.3:
-        "0xa0C600a6e85bf225958FFAcC70B5FDDF9A059038"
+        "0x3840f487A17A41100DD1Bf0946c34f132a57Fd5f"
      values.$members.2:
-        "0x3840f487A17A41100DD1Bf0946c34f132a57Fd5f"
+        "0x4D8007a0E9f293e62E2b0F43C6Cf4C4B9e135BAe"
      values.$members.1:
-        "0x4D8007a0E9f293e62E2b0F43C6Cf4C4B9e135BAe"
+        "0xA0737fea60F0601A192E3d2c98865A883ab0bda2"
      values.$members.0:
-        "0xA0737fea60F0601A192E3d2c98865A883ab0bda2"
+        "0xF3313C48BD8E17b823d5498D62F37019dFEA647D"
      values.multisigThreshold:
-        "3 of 6 (50%)"
+        "3 of 7 (43%)"
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21842198 (main branch discovery), not current.

```diff
    contract SequencerInbox (0x6216dD1EE27C5aCEC7427052d3eCDc98E2bc2221) {
    +++ description: State batches / commitments get posted here.
      values.postsBlobs:
+        false
      fieldMeta.maxTimeVariation.description:
-        "Struct: delayBlocks, futureBlocks, delaySeconds, futureSeconds. onlyRollupOwner settable. Transactions can only be force-included after `delayBlocks` window (Sequencer-only) has passed."
+        "Settable by the Rollup Owner. Transactions can only be force-included after `delayBlocks` window (Sequencer-only) has passed."
    }
```

```diff
    contract ConduitMultisig3 (0x7dCe2FEE5e30EFf298cD3d9B92649f00EBDfc104) {
    +++ description: None
      receivedPermissions.8:
+        {"permission":"upgrade","target":"0xEfEf4558802bF373Ce3307189C79a9cAb0a4Cb9C","via":[{"address":"0xFB48D385Fa3da33762B350e1d705b9E46054E677"},{"address":"0xaA3A7A2ec2477A61082E1C41a2c6710587917028"}]}
      receivedPermissions.7.target:
-        "0xEfEf4558802bF373Ce3307189C79a9cAb0a4Cb9C"
+        "0xe63ddb12FBb6211a73F12a4367b10dA0834B82da"
      receivedPermissions.6.target:
-        "0xe63ddb12FBb6211a73F12a4367b10dA0834B82da"
+        "0xD34F3a11F10DB069173b32d84F02eDA578709143"
      receivedPermissions.6.via.1:
-        {"address":"0xaA3A7A2ec2477A61082E1C41a2c6710587917028"}
      receivedPermissions.6.via.0.address:
-        "0xFB48D385Fa3da33762B350e1d705b9E46054E677"
+        "0xaA3A7A2ec2477A61082E1C41a2c6710587917028"
      receivedPermissions.5.target:
-        "0xD34F3a11F10DB069173b32d84F02eDA578709143"
+        "0xaA3A7A2ec2477A61082E1C41a2c6710587917028"
      receivedPermissions.5.via.1:
+        {"address":"0xaA3A7A2ec2477A61082E1C41a2c6710587917028"}
      receivedPermissions.5.via.0.address:
-        "0xaA3A7A2ec2477A61082E1C41a2c6710587917028"
+        "0xFB48D385Fa3da33762B350e1d705b9E46054E677"
      receivedPermissions.4.target:
-        "0xaA3A7A2ec2477A61082E1C41a2c6710587917028"
+        "0x766DD3A13d17C6D175975C89225bde89F052dBc4"
      receivedPermissions.3.target:
-        "0x766DD3A13d17C6D175975C89225bde89F052dBc4"
+        "0x67812161Bbb6aCF891aA6028BC614a660961ceD8"
      receivedPermissions.2.target:
-        "0x67812161Bbb6aCF891aA6028BC614a660961ceD8"
+        "0x6216dD1EE27C5aCEC7427052d3eCDc98E2bc2221"
      receivedPermissions.1.target:
-        "0x6216dD1EE27C5aCEC7427052d3eCDc98E2bc2221"
+        "0x21A1e2BFC61F30F2E81E0b08cd37c1FC7ef776E7"
      receivedPermissions.0.permission:
-        "upgrade"
+        "configure"
      receivedPermissions.0.target:
-        "0x21A1e2BFC61F30F2E81E0b08cd37c1FC7ef776E7"
+        "0xD34F3a11F10DB069173b32d84F02eDA578709143"
      receivedPermissions.0.via.1:
-        {"address":"0xaA3A7A2ec2477A61082E1C41a2c6710587917028"}
      receivedPermissions.0.via.0.address:
-        "0xFB48D385Fa3da33762B350e1d705b9E46054E677"
+        "0xaA3A7A2ec2477A61082E1C41a2c6710587917028"
      receivedPermissions.0.description:
+        "can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
    }
```

```diff
    contract UpgradeExecutor (0xaA3A7A2ec2477A61082E1C41a2c6710587917028) {
    +++ description: Central contract defining the access control for upgrading the system contract implementations.
      directlyReceivedPermissions.2:
+        {"permission":"upgrade","target":"0xD34F3a11F10DB069173b32d84F02eDA578709143"}
      directlyReceivedPermissions.1.permission:
-        "upgrade"
+        "configure"
      directlyReceivedPermissions.1.description:
+        "can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
    }
```

```diff
    contract RollupProxy (0xD34F3a11F10DB069173b32d84F02eDA578709143) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      issuedPermissions.3:
+        {"permission":"upgrade","target":"0x7dCe2FEE5e30EFf298cD3d9B92649f00EBDfc104","via":[{"address":"0xaA3A7A2ec2477A61082E1C41a2c6710587917028","delay":0}]}
      issuedPermissions.2.permission:
-        "upgrade"
+        "propose"
      issuedPermissions.2.target:
-        "0x7dCe2FEE5e30EFf298cD3d9B92649f00EBDfc104"
+        "0x1BCdC0eCc1e4A31E5dB0542f81895d8319A757Ca"
      issuedPermissions.2.via.0:
-        {"address":"0xaA3A7A2ec2477A61082E1C41a2c6710587917028","delay":0}
      issuedPermissions.1.permission:
-        "propose"
+        "configure"
      issuedPermissions.1.target:
-        "0x1BCdC0eCc1e4A31E5dB0542f81895d8319A757Ca"
+        "0x7dCe2FEE5e30EFf298cD3d9B92649f00EBDfc104"
      issuedPermissions.1.via.0:
+        {"address":"0xaA3A7A2ec2477A61082E1C41a2c6710587917028","delay":0,"description":"can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."}
    }
```

Generated with discovered.json: 0x124f2385a608dd0e8880924c429847ee14ab79cc

# Diff at Fri, 01 Nov 2024 15:09:45 GMT:

- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@cd1f0e71bb08ce16b2084a11b768538e8aa6ba8c block: 21530732
- current block number: 21842198

## Description

ConduitMultisig3 added member and kept threshold, now 3/6.

## Watched changes

```diff
    contract ConduitMultisig3 (0x7dCe2FEE5e30EFf298cD3d9B92649f00EBDfc104) {
    +++ description: None
      values.$members.5:
+        "0xa4000bDD2bB92ce6750b31F1eeda47Bd1cB8e6e4"
      values.$members.4:
-        "0xa4000bDD2bB92ce6750b31F1eeda47Bd1cB8e6e4"
+        "0xefCf0c8faFB425997870f845e26fC6cA6EE6dD5C"
      values.$members.3:
-        "0xefCf0c8faFB425997870f845e26fC6cA6EE6dD5C"
+        "0xa0C600a6e85bf225958FFAcC70B5FDDF9A059038"
      values.$members.2:
-        "0xa0C600a6e85bf225958FFAcC70B5FDDF9A059038"
+        "0x3840f487A17A41100DD1Bf0946c34f132a57Fd5f"
      values.$members.1:
-        "0x3840f487A17A41100DD1Bf0946c34f132a57Fd5f"
+        "0x4D8007a0E9f293e62E2b0F43C6Cf4C4B9e135BAe"
      values.$members.0:
-        "0x4D8007a0E9f293e62E2b0F43C6Cf4C4B9e135BAe"
+        "0xA0737fea60F0601A192E3d2c98865A883ab0bda2"
      values.multisigThreshold:
-        "3 of 5 (60%)"
+        "3 of 6 (50%)"
    }
```

Generated with discovered.json: 0x3559c0c70bb9e8a9924d95a4512a39a2918000f9

# Diff at Tue, 29 Oct 2024 13:22:49 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@7b3fc9dc9074e1d423b48522c3f0273c86aab54a block: 21530732
- current block number: 21530732

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21530732 (main branch discovery), not current.

```diff
    contract RollupProxy (0xD34F3a11F10DB069173b32d84F02eDA578709143) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      fieldMeta.confirmPeriodBlocks.description:
-        "Challenge period. (Number of blocks until a node is confirmed)."
+        "Challenge period. (Number of ETHEREUM blocks until a node is confirmed, even for L3s)."
    }
```

```diff
    contract Outbox (0xe63ddb12FBb6211a73F12a4367b10dA0834B82da) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
      description:
-        "Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) which eventually resolve in execution on L1."
+        "Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1."
    }
```

```diff
    contract Bridge (0xEfEf4558802bF373Ce3307189C79a9cAb0a4Cb9C) {
    +++ description: Escrow contract for the project's gas token (Can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      description:
-        "Escrow contract for the project's gas token (Can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for bridge messaging."
+        "Escrow contract for the project's gas token (Can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging."
    }
```

Generated with discovered.json: 0xd228425e32287c5b2cc6cdf139743af99f345e69

# Diff at Tue, 29 Oct 2024 08:55:18 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@dd2750779d294ea31d352eac7a7f2e0e655f6440 block: 21530732
- current block number: 21530732

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21530732 (main branch discovery), not current.

```diff
    contract Inbox (0x21A1e2BFC61F30F2E81E0b08cd37c1FC7ef776E7) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      issuedPermissions.0.target:
-        "0xaA3A7A2ec2477A61082E1C41a2c6710587917028"
+        "0x7dCe2FEE5e30EFf298cD3d9B92649f00EBDfc104"
      issuedPermissions.0.via.1:
+        {"address":"0xFB48D385Fa3da33762B350e1d705b9E46054E677","delay":0}
      issuedPermissions.0.via.0.address:
-        "0xFB48D385Fa3da33762B350e1d705b9E46054E677"
+        "0xaA3A7A2ec2477A61082E1C41a2c6710587917028"
    }
```

```diff
    contract SequencerInbox (0x6216dD1EE27C5aCEC7427052d3eCDc98E2bc2221) {
    +++ description: State batches / commitments get posted here.
      issuedPermissions.1.target:
-        "0xaA3A7A2ec2477A61082E1C41a2c6710587917028"
+        "0x7dCe2FEE5e30EFf298cD3d9B92649f00EBDfc104"
      issuedPermissions.1.via.1:
+        {"address":"0xFB48D385Fa3da33762B350e1d705b9E46054E677","delay":0}
      issuedPermissions.1.via.0.address:
-        "0xFB48D385Fa3da33762B350e1d705b9E46054E677"
+        "0xaA3A7A2ec2477A61082E1C41a2c6710587917028"
    }
```

```diff
    contract ChallengeManager (0x67812161Bbb6aCF891aA6028BC614a660961ceD8) {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      issuedPermissions.0.target:
-        "0xaA3A7A2ec2477A61082E1C41a2c6710587917028"
+        "0x7dCe2FEE5e30EFf298cD3d9B92649f00EBDfc104"
      issuedPermissions.0.via.1:
+        {"address":"0xFB48D385Fa3da33762B350e1d705b9E46054E677","delay":0}
      issuedPermissions.0.via.0.address:
-        "0xFB48D385Fa3da33762B350e1d705b9E46054E677"
+        "0xaA3A7A2ec2477A61082E1C41a2c6710587917028"
    }
```

```diff
    contract ERC20RollupEventInbox (0x766DD3A13d17C6D175975C89225bde89F052dBc4) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xaA3A7A2ec2477A61082E1C41a2c6710587917028"
+        "0x7dCe2FEE5e30EFf298cD3d9B92649f00EBDfc104"
      issuedPermissions.0.via.1:
+        {"address":"0xFB48D385Fa3da33762B350e1d705b9E46054E677","delay":0}
      issuedPermissions.0.via.0.address:
-        "0xFB48D385Fa3da33762B350e1d705b9E46054E677"
+        "0xaA3A7A2ec2477A61082E1C41a2c6710587917028"
    }
```

```diff
    contract ConduitMultisig3 (0x7dCe2FEE5e30EFf298cD3d9B92649f00EBDfc104) {
    +++ description: None
      receivedPermissions:
+        [{"permission":"upgrade","target":"0x21A1e2BFC61F30F2E81E0b08cd37c1FC7ef776E7","via":[{"address":"0xFB48D385Fa3da33762B350e1d705b9E46054E677"},{"address":"0xaA3A7A2ec2477A61082E1C41a2c6710587917028"}]},{"permission":"upgrade","target":"0x6216dD1EE27C5aCEC7427052d3eCDc98E2bc2221","via":[{"address":"0xFB48D385Fa3da33762B350e1d705b9E46054E677"},{"address":"0xaA3A7A2ec2477A61082E1C41a2c6710587917028"}]},{"permission":"upgrade","target":"0x67812161Bbb6aCF891aA6028BC614a660961ceD8","via":[{"address":"0xFB48D385Fa3da33762B350e1d705b9E46054E677"},{"address":"0xaA3A7A2ec2477A61082E1C41a2c6710587917028"}]},{"permission":"upgrade","target":"0x766DD3A13d17C6D175975C89225bde89F052dBc4","via":[{"address":"0xFB48D385Fa3da33762B350e1d705b9E46054E677"},{"address":"0xaA3A7A2ec2477A61082E1C41a2c6710587917028"}]},{"permission":"upgrade","target":"0xaA3A7A2ec2477A61082E1C41a2c6710587917028","via":[{"address":"0xFB48D385Fa3da33762B350e1d705b9E46054E677"},{"address":"0xaA3A7A2ec2477A61082E1C41a2c6710587917028"}]},{"permission":"upgrade","target":"0xD34F3a11F10DB069173b32d84F02eDA578709143","via":[{"address":"0xaA3A7A2ec2477A61082E1C41a2c6710587917028"}]},{"permission":"upgrade","target":"0xe63ddb12FBb6211a73F12a4367b10dA0834B82da","via":[{"address":"0xFB48D385Fa3da33762B350e1d705b9E46054E677"},{"address":"0xaA3A7A2ec2477A61082E1C41a2c6710587917028"}]},{"permission":"upgrade","target":"0xEfEf4558802bF373Ce3307189C79a9cAb0a4Cb9C","via":[{"address":"0xFB48D385Fa3da33762B350e1d705b9E46054E677"},{"address":"0xaA3A7A2ec2477A61082E1C41a2c6710587917028"}]}]
      directlyReceivedPermissions:
+        [{"permission":"act","target":"0xaA3A7A2ec2477A61082E1C41a2c6710587917028"}]
    }
```

```diff
    contract UpgradeExecutor (0xaA3A7A2ec2477A61082E1C41a2c6710587917028) {
    +++ description: Central contract defining the access control for upgrading the system contract implementations.
      issuedPermissions.0.target:
-        "0xaA3A7A2ec2477A61082E1C41a2c6710587917028"
+        "0x7dCe2FEE5e30EFf298cD3d9B92649f00EBDfc104"
      issuedPermissions.0.via.1:
+        {"address":"0xFB48D385Fa3da33762B350e1d705b9E46054E677","delay":0}
      issuedPermissions.0.via.0.address:
-        "0xFB48D385Fa3da33762B350e1d705b9E46054E677"
+        "0xaA3A7A2ec2477A61082E1C41a2c6710587917028"
      receivedPermissions:
-        [{"permission":"upgrade","target":"0x21A1e2BFC61F30F2E81E0b08cd37c1FC7ef776E7","via":[{"address":"0xFB48D385Fa3da33762B350e1d705b9E46054E677"}]},{"permission":"upgrade","target":"0x6216dD1EE27C5aCEC7427052d3eCDc98E2bc2221","via":[{"address":"0xFB48D385Fa3da33762B350e1d705b9E46054E677"}]},{"permission":"upgrade","target":"0x67812161Bbb6aCF891aA6028BC614a660961ceD8","via":[{"address":"0xFB48D385Fa3da33762B350e1d705b9E46054E677"}]},{"permission":"upgrade","target":"0x766DD3A13d17C6D175975C89225bde89F052dBc4","via":[{"address":"0xFB48D385Fa3da33762B350e1d705b9E46054E677"}]},{"permission":"upgrade","target":"0xaA3A7A2ec2477A61082E1C41a2c6710587917028","via":[{"address":"0xFB48D385Fa3da33762B350e1d705b9E46054E677"}]},{"permission":"upgrade","target":"0xD34F3a11F10DB069173b32d84F02eDA578709143"},{"permission":"upgrade","target":"0xe63ddb12FBb6211a73F12a4367b10dA0834B82da","via":[{"address":"0xFB48D385Fa3da33762B350e1d705b9E46054E677"}]},{"permission":"upgrade","target":"0xEfEf4558802bF373Ce3307189C79a9cAb0a4Cb9C","via":[{"address":"0xFB48D385Fa3da33762B350e1d705b9E46054E677"}]}]
      directlyReceivedPermissions.1:
+        {"permission":"upgrade","target":"0xD34F3a11F10DB069173b32d84F02eDA578709143"}
    }
```

```diff
    contract RollupProxy (0xD34F3a11F10DB069173b32d84F02eDA578709143) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      issuedPermissions.2.target:
-        "0xaA3A7A2ec2477A61082E1C41a2c6710587917028"
+        "0x7dCe2FEE5e30EFf298cD3d9B92649f00EBDfc104"
      issuedPermissions.2.via.0:
+        {"address":"0xaA3A7A2ec2477A61082E1C41a2c6710587917028","delay":0}
    }
```

```diff
    contract Outbox (0xe63ddb12FBb6211a73F12a4367b10dA0834B82da) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) which eventually resolve in execution on L1.
      issuedPermissions.0.target:
-        "0xaA3A7A2ec2477A61082E1C41a2c6710587917028"
+        "0x7dCe2FEE5e30EFf298cD3d9B92649f00EBDfc104"
      issuedPermissions.0.via.1:
+        {"address":"0xFB48D385Fa3da33762B350e1d705b9E46054E677","delay":0}
      issuedPermissions.0.via.0.address:
-        "0xFB48D385Fa3da33762B350e1d705b9E46054E677"
+        "0xaA3A7A2ec2477A61082E1C41a2c6710587917028"
    }
```

```diff
    contract Bridge (0xEfEf4558802bF373Ce3307189C79a9cAb0a4Cb9C) {
    +++ description: Escrow contract for the project's gas token (Can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for bridge messaging.
      issuedPermissions.0.target:
-        "0xaA3A7A2ec2477A61082E1C41a2c6710587917028"
+        "0x7dCe2FEE5e30EFf298cD3d9B92649f00EBDfc104"
      issuedPermissions.0.via.1:
+        {"address":"0xFB48D385Fa3da33762B350e1d705b9E46054E677","delay":0}
      issuedPermissions.0.via.0.address:
-        "0xFB48D385Fa3da33762B350e1d705b9E46054E677"
+        "0xaA3A7A2ec2477A61082E1C41a2c6710587917028"
    }
```

Generated with discovered.json: 0x084996f036e111dc9dca64e5b3ef45235b8ea3f5

# Diff at Mon, 28 Oct 2024 14:09:44 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@846d03afee15838cf7b18315c02ebdb6a2071f6c block: 21530732
- current block number: 21530732

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21530732 (main branch discovery), not current.

```diff
    contract UpgradeExecutor (0xaA3A7A2ec2477A61082E1C41a2c6710587917028) {
    +++ description: Central contract defining the access control for upgrading the system contract implementations.
      values.executors:
+        ["0x7dCe2FEE5e30EFf298cD3d9B92649f00EBDfc104"]
    }
```

Generated with discovered.json: 0xaff29395a09569d77b5b0e2dde680f4c515bd85b

# Diff at Fri, 25 Oct 2024 10:07:14 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@e7501f424c0cea9b5438386ee76e509448999836 block: 20331015
- current block number: 21530732

## Description

Renamed rollup owner to ConduitMultisig3.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20331015 (main branch discovery), not current.

```diff
    contract Inbox (0x21A1e2BFC61F30F2E81E0b08cd37c1FC7ef776E7) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      issuedPermissions.0.target:
-        "0xFB48D385Fa3da33762B350e1d705b9E46054E677"
+        "0xaA3A7A2ec2477A61082E1C41a2c6710587917028"
      issuedPermissions.0.via.0:
+        {"address":"0xFB48D385Fa3da33762B350e1d705b9E46054E677","delay":0}
    }
```

```diff
    contract SequencerInbox (0x6216dD1EE27C5aCEC7427052d3eCDc98E2bc2221) {
    +++ description: State batches / commitments get posted here.
      issuedPermissions.1.target:
-        "0xFB48D385Fa3da33762B350e1d705b9E46054E677"
+        "0xaA3A7A2ec2477A61082E1C41a2c6710587917028"
      issuedPermissions.1.via.0:
+        {"address":"0xFB48D385Fa3da33762B350e1d705b9E46054E677","delay":0}
    }
```

```diff
    contract ChallengeManager (0x67812161Bbb6aCF891aA6028BC614a660961ceD8) {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      issuedPermissions.0.target:
-        "0xFB48D385Fa3da33762B350e1d705b9E46054E677"
+        "0xaA3A7A2ec2477A61082E1C41a2c6710587917028"
      issuedPermissions.0.via.0:
+        {"address":"0xFB48D385Fa3da33762B350e1d705b9E46054E677","delay":0}
    }
```

```diff
    contract ERC20RollupEventInbox (0x766DD3A13d17C6D175975C89225bde89F052dBc4) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xFB48D385Fa3da33762B350e1d705b9E46054E677"
+        "0xaA3A7A2ec2477A61082E1C41a2c6710587917028"
      issuedPermissions.0.via.0:
+        {"address":"0xFB48D385Fa3da33762B350e1d705b9E46054E677","delay":0}
    }
```

```diff
    contract ConduitMultisig3 (0x7dCe2FEE5e30EFf298cD3d9B92649f00EBDfc104) {
    +++ description: None
      name:
-        "RollupOwnerMultisig"
+        "ConduitMultisig3"
    }
```

```diff
    contract UpgradeExecutor (0xaA3A7A2ec2477A61082E1C41a2c6710587917028) {
    +++ description: Central contract defining the access control for upgrading the system contract implementations.
      issuedPermissions.0.target:
-        "0xFB48D385Fa3da33762B350e1d705b9E46054E677"
+        "0xaA3A7A2ec2477A61082E1C41a2c6710587917028"
      issuedPermissions.0.via.0:
+        {"address":"0xFB48D385Fa3da33762B350e1d705b9E46054E677","delay":0}
      receivedPermissions.7:
+        {"permission":"upgrade","target":"0xEfEf4558802bF373Ce3307189C79a9cAb0a4Cb9C","via":[{"address":"0xFB48D385Fa3da33762B350e1d705b9E46054E677"}]}
      receivedPermissions.6:
+        {"permission":"upgrade","target":"0xe63ddb12FBb6211a73F12a4367b10dA0834B82da","via":[{"address":"0xFB48D385Fa3da33762B350e1d705b9E46054E677"}]}
      receivedPermissions.5:
+        {"permission":"upgrade","target":"0xD34F3a11F10DB069173b32d84F02eDA578709143"}
      receivedPermissions.4:
+        {"permission":"upgrade","target":"0xaA3A7A2ec2477A61082E1C41a2c6710587917028","via":[{"address":"0xFB48D385Fa3da33762B350e1d705b9E46054E677"}]}
      receivedPermissions.3:
+        {"permission":"upgrade","target":"0x766DD3A13d17C6D175975C89225bde89F052dBc4","via":[{"address":"0xFB48D385Fa3da33762B350e1d705b9E46054E677"}]}
      receivedPermissions.2:
+        {"permission":"upgrade","target":"0x67812161Bbb6aCF891aA6028BC614a660961ceD8","via":[{"address":"0xFB48D385Fa3da33762B350e1d705b9E46054E677"}]}
      receivedPermissions.1:
+        {"permission":"upgrade","target":"0x6216dD1EE27C5aCEC7427052d3eCDc98E2bc2221","via":[{"address":"0xFB48D385Fa3da33762B350e1d705b9E46054E677"}]}
      receivedPermissions.0.target:
-        "0xD34F3a11F10DB069173b32d84F02eDA578709143"
+        "0x21A1e2BFC61F30F2E81E0b08cd37c1FC7ef776E7"
      receivedPermissions.0.via:
+        [{"address":"0xFB48D385Fa3da33762B350e1d705b9E46054E677"}]
      directlyReceivedPermissions:
+        [{"permission":"act","target":"0xFB48D385Fa3da33762B350e1d705b9E46054E677"}]
    }
```

```diff
    contract Outbox (0xe63ddb12FBb6211a73F12a4367b10dA0834B82da) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) which eventually resolve in execution on L1.
      issuedPermissions.0.target:
-        "0xFB48D385Fa3da33762B350e1d705b9E46054E677"
+        "0xaA3A7A2ec2477A61082E1C41a2c6710587917028"
      issuedPermissions.0.via.0:
+        {"address":"0xFB48D385Fa3da33762B350e1d705b9E46054E677","delay":0}
    }
```

```diff
    contract Bridge (0xEfEf4558802bF373Ce3307189C79a9cAb0a4Cb9C) {
    +++ description: Escrow contract for the project's gas token (Can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for bridge messaging.
      issuedPermissions.0.target:
-        "0xFB48D385Fa3da33762B350e1d705b9E46054E677"
+        "0xaA3A7A2ec2477A61082E1C41a2c6710587917028"
      issuedPermissions.0.via.0:
+        {"address":"0xFB48D385Fa3da33762B350e1d705b9E46054E677","delay":0}
    }
```

```diff
    contract ProxyAdmin (0xFB48D385Fa3da33762B350e1d705b9E46054E677) {
    +++ description: None
      receivedPermissions:
-        [{"permission":"upgrade","target":"0x21A1e2BFC61F30F2E81E0b08cd37c1FC7ef776E7"},{"permission":"upgrade","target":"0x6216dD1EE27C5aCEC7427052d3eCDc98E2bc2221"},{"permission":"upgrade","target":"0x67812161Bbb6aCF891aA6028BC614a660961ceD8"},{"permission":"upgrade","target":"0x766DD3A13d17C6D175975C89225bde89F052dBc4"},{"permission":"upgrade","target":"0xaA3A7A2ec2477A61082E1C41a2c6710587917028"},{"permission":"upgrade","target":"0xe63ddb12FBb6211a73F12a4367b10dA0834B82da"},{"permission":"upgrade","target":"0xEfEf4558802bF373Ce3307189C79a9cAb0a4Cb9C"}]
      template:
+        "global/ProxyAdmin"
      directlyReceivedPermissions:
+        [{"permission":"upgrade","target":"0x21A1e2BFC61F30F2E81E0b08cd37c1FC7ef776E7"},{"permission":"upgrade","target":"0x6216dD1EE27C5aCEC7427052d3eCDc98E2bc2221"},{"permission":"upgrade","target":"0x67812161Bbb6aCF891aA6028BC614a660961ceD8"},{"permission":"upgrade","target":"0x766DD3A13d17C6D175975C89225bde89F052dBc4"},{"permission":"upgrade","target":"0xaA3A7A2ec2477A61082E1C41a2c6710587917028"},{"permission":"upgrade","target":"0xe63ddb12FBb6211a73F12a4367b10dA0834B82da"},{"permission":"upgrade","target":"0xEfEf4558802bF373Ce3307189C79a9cAb0a4Cb9C"}]
    }
```

Generated with discovered.json: 0x54b337c00b230ec43c4fe2127373698a0e65251c

# Diff at Wed, 23 Oct 2024 14:37:21 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@9cc37d16a5f0b172bb41f98d8a970963e5ca4afb block: 20331015
- current block number: 20331015

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20331015 (main branch discovery), not current.

```diff
    contract Inbox (0x21A1e2BFC61F30F2E81E0b08cd37c1FC7ef776E7) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      template:
+        "orbitstack/Inbox"
      description:
+        "Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds."
    }
```

```diff
    contract OneStepProverMemory (0x2Bb71AE6f5Bb52de5F535efD804e156ed2a35a8f) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      template:
+        "orbitstack/OneStepProverMemory"
      description:
+        "One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine."
    }
```

```diff
    contract SequencerInbox (0x6216dD1EE27C5aCEC7427052d3eCDc98E2bc2221) {
    +++ description: State batches / commitments get posted here.
      fieldMeta.maxTimeVariation.description:
-        "onlyRollupOwner settable. Transactions can only be force-included after `delayBlocks` window (Sequencer-only) has passed."
+        "Struct: delayBlocks, futureBlocks, delaySeconds, futureSeconds. onlyRollupOwner settable. Transactions can only be force-included after `delayBlocks` window (Sequencer-only) has passed."
      template:
+        "orbitstack/SequencerInbox"
    }
```

```diff
    contract ChallengeManager (0x67812161Bbb6aCF891aA6028BC614a660961ceD8) {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      template:
+        "orbitstack/ChallengeManager"
      description:
+        "Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor."
    }
```

```diff
    contract OneStepProverMath (0x764cDAAc715ef3e29B3c8D28A1261AD9B7eD206D) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      template:
+        "orbitstack/OneStepProverMath"
      description:
+        "One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine."
    }
```

```diff
    contract UpgradeExecutor (0xaA3A7A2ec2477A61082E1C41a2c6710587917028) {
    +++ description: Central contract defining the access control for upgrading the system contract implementations.
      template:
+        "orbitstack/UpgradeExecutor"
      description:
+        "Central contract defining the access control for upgrading the system contract implementations."
    }
```

```diff
-   Status: DELETED
    contract  (0xB48E4A4B8EC04c9F1819302FD370f5B3797c638C)
    +++ description: None
```

```diff
-   Status: DELETED
    contract ValidatorWalletCreator (0xB546310EA2De84220811a03BCD5CeE96D251fA7D)
    +++ description: None
```

```diff
    contract OneStepProver0 (0xBa04bD4aDa714b0cb3B87784dc9F20620aF37428) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      template:
+        "orbitstack/OneStepProver0"
      description:
+        "One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine."
    }
```

```diff
    contract OneStepProofEntry (0xC17A41629Cd100c74B1Bed7b49D2E0517EfDeaeb) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      template:
+        "orbitstack/OneStepProofEntry"
      description:
+        "One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine."
    }
```

```diff
-   Status: DELETED
    contract  (0xd063bb4EB74f813b1A0D9208Da100E3c08D9d4C9)
    +++ description: None
```

```diff
    contract RollupProxy (0xD34F3a11F10DB069173b32d84F02eDA578709143) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      description:
-        "Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs."
+        "Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators)."
      issuedPermissions.2:
+        {"permission":"upgrade","target":"0xaA3A7A2ec2477A61082E1C41a2c6710587917028","via":[]}
      issuedPermissions.1.permission:
-        "validate"
+        "propose"
      issuedPermissions.0.permission:
-        "upgrade"
+        "challenge"
      issuedPermissions.0.target:
-        "0xaA3A7A2ec2477A61082E1C41a2c6710587917028"
+        "0x1BCdC0eCc1e4A31E5dB0542f81895d8319A757Ca"
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
    contract Outbox (0xe63ddb12FBb6211a73F12a4367b10dA0834B82da) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) which eventually resolve in execution on L1.
      template:
+        "orbitstack/Outbox"
      description:
+        "Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) which eventually resolve in execution on L1."
    }
```

```diff
    contract Bridge (0xEfEf4558802bF373Ce3307189C79a9cAb0a4Cb9C) {
    +++ description: Escrow contract for the project's gas token (Can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for bridge messaging.
      template:
+        "orbitstack/Bridge"
      description:
+        "Escrow contract for the project's gas token (Can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for bridge messaging."
    }
```

```diff
    contract OneStepProverHostIo (0xF4AA217a96c205df7B0D081DC95385B701eFE9b0) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      template:
+        "orbitstack/OneStepProverHostIo"
      description:
+        "One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine."
    }
```

Generated with discovered.json: 0x044a52a4ab32c6ee52486f15f3e6da7858e8e805

# Diff at Mon, 21 Oct 2024 12:52:08 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@e660599f23a07618fe949a07be1f516ce44f1914 block: 20331015
- current block number: 20331015

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20331015 (main branch discovery), not current.

```diff
    contract SequencerInbox (0x6216dD1EE27C5aCEC7427052d3eCDc98E2bc2221) {
    +++ description: State batches / commitments get posted here.
      descriptions:
-        ["State batches / commitments get posted here."]
      description:
+        "State batches / commitments get posted here."
    }
```

```diff
    contract RollupProxy (0xD34F3a11F10DB069173b32d84F02eDA578709143) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
      descriptions:
-        ["Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs."]
      description:
+        "Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs."
    }
```

Generated with discovered.json: 0x34668ef1dadf5729d56a7e8041b125ee44088dbd

# Diff at Mon, 21 Oct 2024 11:13:56 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@8895d33866f5665c4c710f4ddaa32bfa63cc3c78 block: 20331015
- current block number: 20331015

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20331015 (main branch discovery), not current.

```diff
    contract Inbox (0x21A1e2BFC61F30F2E81E0b08cd37c1FC7ef776E7) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0xcA00Db0289131B71A6624f62666bd54305697BB2"]
      values.$pastUpgrades.0.1:
-        ["0xcA00Db0289131B71A6624f62666bd54305697BB2"]
+        "0x85708428ba3eb696c32b3e634fed7ac46016b61d6c0df46959a494d6ecc2bdec"
    }
```

```diff
    contract SequencerInbox (0x6216dD1EE27C5aCEC7427052d3eCDc98E2bc2221) {
    +++ description: State batches / commitments get posted here.
      values.$pastUpgrades.1.2:
+        ["0x98DB769A9E15D66EA04665da0dF616596c296BA8"]
      values.$pastUpgrades.1.1:
-        ["0x98DB769A9E15D66EA04665da0dF616596c296BA8"]
+        "0xc313d7714edf75e41115f458d8704acc2174d14247b8944202d64dd32d678fa7"
      values.$pastUpgrades.0.2:
+        ["0x5ad3e9141D0EAd2132afFF0CD74487964cE9135A"]
      values.$pastUpgrades.0.1:
-        ["0x5ad3e9141D0EAd2132afFF0CD74487964cE9135A"]
+        "0x85708428ba3eb696c32b3e634fed7ac46016b61d6c0df46959a494d6ecc2bdec"
    }
```

```diff
    contract ChallengeManager (0x67812161Bbb6aCF891aA6028BC614a660961ceD8) {
    +++ description: None
      values.$pastUpgrades.1.2:
+        ["0x377A5b786E94cAcdcB2B309451C373c8F2166A79"]
      values.$pastUpgrades.1.1:
-        ["0x377A5b786E94cAcdcB2B309451C373c8F2166A79"]
+        "0xc313d7714edf75e41115f458d8704acc2174d14247b8944202d64dd32d678fa7"
      values.$pastUpgrades.0.2:
+        ["0x9Db0bB898C500DD84C7c7bd7fFFFE914569a6677"]
      values.$pastUpgrades.0.1:
-        ["0x9Db0bB898C500DD84C7c7bd7fFFFE914569a6677"]
+        "0x85708428ba3eb696c32b3e634fed7ac46016b61d6c0df46959a494d6ecc2bdec"
    }
```

```diff
    contract ERC20RollupEventInbox (0x766DD3A13d17C6D175975C89225bde89F052dBc4) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0x4326B3755539d35b0A8846bF9b33982A8eA42c93"]
      values.$pastUpgrades.0.1:
-        ["0x4326B3755539d35b0A8846bF9b33982A8eA42c93"]
+        "0x85708428ba3eb696c32b3e634fed7ac46016b61d6c0df46959a494d6ecc2bdec"
    }
```

```diff
    contract UpgradeExecutor (0xaA3A7A2ec2477A61082E1C41a2c6710587917028) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0x3C4DF76De31816443C207E49F9fE48737C8F2746"]
      values.$pastUpgrades.0.1:
-        ["0x3C4DF76De31816443C207E49F9fE48737C8F2746"]
+        "0x85708428ba3eb696c32b3e634fed7ac46016b61d6c0df46959a494d6ecc2bdec"
    }
```

```diff
    contract RollupProxy (0xD34F3a11F10DB069173b32d84F02eDA578709143) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
      values.$pastUpgrades.0.2:
+        ["0x3A59b13eB3F661DE35a1e203Bd12b3B4123976cf","0xB7202d306936B79Ba29907b391faA87D3BEec33A"]
      values.$pastUpgrades.0.1:
-        ["0x3A59b13eB3F661DE35a1e203Bd12b3B4123976cf","0xB7202d306936B79Ba29907b391faA87D3BEec33A"]
+        "0x85708428ba3eb696c32b3e634fed7ac46016b61d6c0df46959a494d6ecc2bdec"
    }
```

```diff
    contract Outbox (0xe63ddb12FBb6211a73F12a4367b10dA0834B82da) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0x20fA6358f89Ed16d48F6588a8f500887354Ff56c"]
      values.$pastUpgrades.0.1:
-        ["0x20fA6358f89Ed16d48F6588a8f500887354Ff56c"]
+        "0x85708428ba3eb696c32b3e634fed7ac46016b61d6c0df46959a494d6ecc2bdec"
    }
```

```diff
    contract Bridge (0xEfEf4558802bF373Ce3307189C79a9cAb0a4Cb9C) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0xc00336Cdf86AE7AD58D8773B0114082C190D28D5"]
      values.$pastUpgrades.0.1:
-        ["0xc00336Cdf86AE7AD58D8773B0114082C190D28D5"]
+        "0x85708428ba3eb696c32b3e634fed7ac46016b61d6c0df46959a494d6ecc2bdec"
    }
```

Generated with discovered.json: 0xddc12255500e0fbe5ca82374453223d4a0fa8aab

# Diff at Wed, 16 Oct 2024 11:45:01 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@a3d139b799cc0b28e5e912febb17464d4e5aef5d block: 20331015
- current block number: 20331015

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20331015 (main branch discovery), not current.

```diff
    contract SequencerInbox (0x6216dD1EE27C5aCEC7427052d3eCDc98E2bc2221) {
    +++ description: State batches / commitments get posted here.
      issuedPermissions.1:
+        {"permission":"upgrade","target":"0xFB48D385Fa3da33762B350e1d705b9E46054E677","via":[]}
      issuedPermissions.0.permission:
-        "upgrade"
+        "sequence"
      issuedPermissions.0.target:
-        "0xFB48D385Fa3da33762B350e1d705b9E46054E677"
+        "0xa3582189403F67a9CDB1CE0Ac066c954FFd3f205"
    }
```

```diff
    contract RollupProxy (0xD34F3a11F10DB069173b32d84F02eDA578709143) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
      issuedPermissions.1:
+        {"permission":"validate","target":"0x1BCdC0eCc1e4A31E5dB0542f81895d8319A757Ca","via":[]}
    }
```

Generated with discovered.json: 0x3bae1d4f8abf395fb7111029f73fc9644f3fa265

# Diff at Mon, 14 Oct 2024 10:59:36 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1afc77ff111ceb0970e7d09efcc7b2f376b0c281 block: 20331015
- current block number: 20331015

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20331015 (main branch discovery), not current.

```diff
    contract Inbox (0x21A1e2BFC61F30F2E81E0b08cd37c1FC7ef776E7) {
    +++ description: None
      sourceHashes:
+        ["0xa7e3f6c355703ed46fcb2156862c4f01792b87beb10a87a81ce3bd5beee79b67","0xcb390b491549387c8fcc09fb22fbea7adf54cc74b7247a0c738369ddd7049b92"]
    }
```

```diff
    contract ValidatorUtils (0x23b0348788b96ee1cE4e7DdED4AC2A99de516F51) {
    +++ description: None
      sourceHashes:
+        ["0xd9b36ec321be937cc727b5bdb0afa0e1a0a28448ef1a202d4f181a01ce57bdc8"]
    }
```

```diff
    contract OneStepProverMemory (0x2Bb71AE6f5Bb52de5F535efD804e156ed2a35a8f) {
    +++ description: None
      sourceHashes:
+        ["0x731b4466319a83c95ce227d1a6c85aa03864f5d2bed03bda186843033a8b8d61"]
    }
```

```diff
    contract UTBDecent (0x43019F8BE1F192587883b67dEA2994999f5a2de2) {
    +++ description: None
      sourceHashes:
+        ["0xdf38c41dfed5147dbd3a1a8d8947ff056a36aa5d6232aa2c5c9dd2b5f4d1ca42"]
    }
```

```diff
    contract SequencerInbox (0x6216dD1EE27C5aCEC7427052d3eCDc98E2bc2221) {
    +++ description: State batches / commitments get posted here.
      sourceHashes:
+        ["0xa7e3f6c355703ed46fcb2156862c4f01792b87beb10a87a81ce3bd5beee79b67","0x50cf57b01499408fa99da27cf0fee96ec30f0d40667d1aa090c442bc80f0636b"]
    }
```

```diff
    contract ChallengeManager (0x67812161Bbb6aCF891aA6028BC614a660961ceD8) {
    +++ description: None
      sourceHashes:
+        ["0xa7e3f6c355703ed46fcb2156862c4f01792b87beb10a87a81ce3bd5beee79b67","0x58a6261c83c2766f749641902ad6fdb695ea189d2747f073b57a8f35b9a547e5"]
    }
```

```diff
    contract OneStepProverMath (0x764cDAAc715ef3e29B3c8D28A1261AD9B7eD206D) {
    +++ description: None
      sourceHashes:
+        ["0xb2555ede3dfe7d6df28bd96d12a0113b658c213c7ce4e34fa539df7497bc51a1"]
    }
```

```diff
    contract ERC20RollupEventInbox (0x766DD3A13d17C6D175975C89225bde89F052dBc4) {
    +++ description: None
      sourceHashes:
+        ["0xa7e3f6c355703ed46fcb2156862c4f01792b87beb10a87a81ce3bd5beee79b67","0x88c3a2fa81cad2f98a156402c78de0fc804b2a1866ea4f449aa90ae92ceabc6c"]
    }
```

```diff
    contract RollupOwnerMultisig (0x7dCe2FEE5e30EFf298cD3d9B92649f00EBDfc104) {
    +++ description: None
      sourceHashes:
+        ["0x81a7349eebb98ac33b0bc6842e3cb258034a8f2a4ba004570bb8e2e25947f9ff","0x59fe14e95a8aa7f52213f18bae5c9329cf583a7ba31194698b15eddb97d5e825"]
    }
```

```diff
    contract UpgradeExecutor (0xaA3A7A2ec2477A61082E1C41a2c6710587917028) {
    +++ description: None
      sourceHashes:
+        ["0xa7e3f6c355703ed46fcb2156862c4f01792b87beb10a87a81ce3bd5beee79b67","0xa7ff878cfd433a428d567d3b90fe1df400a048a1af5298f22cd4cd4fc25bdecd"]
    }
```

```diff
    contract ValidatorWalletCreator (0xB546310EA2De84220811a03BCD5CeE96D251fA7D) {
    +++ description: None
      sourceHashes:
+        ["0x4ef3473c840bed3b4c6258271a494794c1545f0d0f13c6a386d1e39e6180d67c"]
    }
```

```diff
    contract OneStepProver0 (0xBa04bD4aDa714b0cb3B87784dc9F20620aF37428) {
    +++ description: None
      sourceHashes:
+        ["0x20330713abbbcf0219ef7d1c0aa3a6ede1b421f14c9d21b25c973e54fb75f5df"]
    }
```

```diff
    contract OneStepProofEntry (0xC17A41629Cd100c74B1Bed7b49D2E0517EfDeaeb) {
    +++ description: None
      sourceHashes:
+        ["0xf3479c667d20b1c17ea2573dc7fe09e4315a3e20bc09d31bc92603520cc962cc"]
    }
```

```diff
    contract RollupProxy (0xD34F3a11F10DB069173b32d84F02eDA578709143) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
      sourceHashes:
+        ["0xb8da0b3748daac768860783e8555198fd2d1bbdffb775b81557a7124890c7eca","0x8b48118fe606012c0dcac2ccc1821785935aec89fab8f219f47b32c482b0017e","0xef94a66bd5339efd18fb9ca1f8031482e7ef7bbe6c5a0a10fae254ab83712406"]
    }
```

```diff
    contract Outbox (0xe63ddb12FBb6211a73F12a4367b10dA0834B82da) {
    +++ description: None
      sourceHashes:
+        ["0xa7e3f6c355703ed46fcb2156862c4f01792b87beb10a87a81ce3bd5beee79b67","0x3073f29910dee50069a001fb20e58cca3dcc1b3c8da4b91809af2dd356ef0c8c"]
    }
```

```diff
    contract Bridge (0xEfEf4558802bF373Ce3307189C79a9cAb0a4Cb9C) {
    +++ description: None
      sourceHashes:
+        ["0xa7e3f6c355703ed46fcb2156862c4f01792b87beb10a87a81ce3bd5beee79b67","0x057de68a7007d55f4394ba6eafb2c802efcaf13583ff9342ea4d0ee3924d9be1"]
    }
```

```diff
    contract OneStepProverHostIo (0xF4AA217a96c205df7B0D081DC95385B701eFE9b0) {
    +++ description: None
      sourceHashes:
+        ["0x5b0a5e16100b7e163dcf39dc6a9034f12a7bad7a475cdffc73054b937be0683d"]
    }
```

```diff
    contract ProxyAdmin (0xFB48D385Fa3da33762B350e1d705b9E46054E677) {
    +++ description: None
      sourceHashes:
+        ["0xf944f88083f41ff959fefbdcd6fc3ae633692b072b8497fb14cbdd843eded490"]
    }
```

Generated with discovered.json: 0x9305ee48207cf473c0977937e5b32f5025047bfb

# Diff at Tue, 01 Oct 2024 11:13:16 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bd754dc73c66120164006054f8d25c5fae9cd910 block: 20331015
- current block number: 20331015

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20331015 (main branch discovery), not current.

```diff
    contract Inbox (0x21A1e2BFC61F30F2E81E0b08cd37c1FC7ef776E7) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-03-10T16:17:21.000Z",["0xcA00Db0289131B71A6624f62666bd54305697BB2"]]]
    }
```

```diff
    contract SequencerInbox (0x6216dD1EE27C5aCEC7427052d3eCDc98E2bc2221) {
    +++ description: State batches / commitments get posted here.
      values.$pastUpgrades:
+        [["2024-03-10T16:17:21.000Z",["0x5ad3e9141D0EAd2132afFF0CD74487964cE9135A"]],["2024-07-02T00:12:17.000Z",["0x98DB769A9E15D66EA04665da0dF616596c296BA8"]]]
    }
```

```diff
    contract ChallengeManager (0x67812161Bbb6aCF891aA6028BC614a660961ceD8) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-03-10T16:17:21.000Z",["0x9Db0bB898C500DD84C7c7bd7fFFFE914569a6677"]],["2024-07-02T00:12:17.000Z",["0x377A5b786E94cAcdcB2B309451C373c8F2166A79"]]]
    }
```

```diff
    contract ERC20RollupEventInbox (0x766DD3A13d17C6D175975C89225bde89F052dBc4) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-03-10T16:17:21.000Z",["0x4326B3755539d35b0A8846bF9b33982A8eA42c93"]]]
    }
```

```diff
    contract UpgradeExecutor (0xaA3A7A2ec2477A61082E1C41a2c6710587917028) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-03-10T16:17:21.000Z",["0x3C4DF76De31816443C207E49F9fE48737C8F2746"]]]
    }
```

```diff
    contract RollupProxy (0xD34F3a11F10DB069173b32d84F02eDA578709143) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
      values.$pastUpgrades:
+        [["2024-03-10T16:17:21.000Z",["0x3A59b13eB3F661DE35a1e203Bd12b3B4123976cf","0xB7202d306936B79Ba29907b391faA87D3BEec33A"]]]
      values.$upgradeCount:
+        1
    }
```

```diff
    contract Outbox (0xe63ddb12FBb6211a73F12a4367b10dA0834B82da) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-03-10T16:17:21.000Z",["0x20fA6358f89Ed16d48F6588a8f500887354Ff56c"]]]
    }
```

```diff
    contract Bridge (0xEfEf4558802bF373Ce3307189C79a9cAb0a4Cb9C) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-03-10T16:17:21.000Z",["0xc00336Cdf86AE7AD58D8773B0114082C190D28D5"]]]
    }
```

Generated with discovered.json: 0x044d6e7fe4fe9e38553717547bdc6f8635e51bdf

# Diff at Fri, 27 Sep 2024 15:37:03 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@4cb14cc1bdc343d171a7988f9f91f11edbf568a8 block: 16561766
- current block number: 20331015

## Description

Config.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 16561766 (main branch discovery), not current.

```diff
    contract RollupProxy (0xD34F3a11F10DB069173b32d84F02eDA578709143) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
      usedTypes.0.arg.0x184884e1eb9fefdc158f6c8ac912bb183bf3cf83f0090317e0bc4ac5860baa39:
+        "ArbOS v32 wasmModuleRoot"
    }
```

Generated with discovered.json: 0x64af12a25354a086a656231a452f885e6d32d619

# Diff at Sun, 01 Sep 2024 08:47:47 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@bee35b6cff7c52634ae8667cbb331e18ad4ec17a block: 16561766
- current block number: 16561766

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 16561766 (main branch discovery), not current.

```diff
    contract RollupProxy (0xD34F3a11F10DB069173b32d84F02eDA578709143) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
+++ description: Root hash of the WASM module used for execution, like a fingerprint of the L2 logic. Can be associated with ArbOS versions.
      values.wasmModuleRoot:
-        "0x8b104a2e80ac6165dc58b9048de12f301d70b02a0ab51396c22b4b4b802a16a4"
+        "ArbOS v20 wasmModuleRoot"
      usedTypes:
+        [{"typeCaster":"Mapping","arg":{"0xbb9d58e9527566138b682f3a207c0976d5359837f6e330f4017434cca983ff41":"ArbOS v1-rc1 wasmModuleRoot","0x9d68e40c47e3b87a8a7e6368cc52915720a6484bb2f47ceabad7e573e3a11232":"ArbOS v2.1 wasmModuleRoot","0x53c288a0ca7100c0f2db8ab19508763a51c7fd1be125d376d940a65378acaee7":"ArbOS v3 wasmModuleRoot","0x588762be2f364be15d323df2aa60ffff60f2b14103b34823b6f7319acd1ae7a3":"ArbOS v3.1 wasmModuleRoot","0xcfba6a883c50a1b4475ab909600fa88fc9cceed9e3ff6f43dccd2d27f6bd57cf":"ArbOS v3.2 wasmModuleRoot","0xa24ccdb052d92c5847e8ea3ce722442358db4b00985a9ee737c4e601b6ed9876":"ArbOS v4 wasmModuleRoot","0x1e09e6d9e35b93f33ed22b2bc8dc10bbcf63fdde5e8a1fb8cc1bcd1a52f14bd0":"ArbOS v5 wasmModuleRoot","0x3848eff5e0356faf1fc9cafecb789584c5e7f4f8f817694d842ada96613d8bab":"ArbOS v6 wasmModuleRoot","0x53dd4b9a3d807a8cbb4d58fbfc6a0857c3846d46956848cae0a1cc7eca2bb5a8":"ArbOS v7 wasmModuleRoot","0x2b20e1490d1b06299b222f3239b0ae07e750d8f3b4dedd19f500a815c1548bbc":"ArbOS v7.1 wasmModuleRoot","0xd1842bfbe047322b3f3b3635b5fe62eb611557784d17ac1d2b1ce9c170af6544":"ArbOS v9 wasmModuleRoot","0x6b94a7fc388fd8ef3def759297828dc311761e88d8179c7ee8d3887dc554f3c3":"ArbOS v10 wasmModuleRoot","0xda4e3ad5e7feacb817c21c8d0220da7650fe9051ece68a3f0b1c5d38bbb27b21":"ArbOS v10.1 wasmModuleRoot","0x0754e09320c381566cc0449904c377a52bd34a6b9404432e80afd573b67f7b17":"ArbOS v10.2 wasmModuleRoot","0xf559b6d4fa869472dabce70fe1c15221bdda837533dfd891916836975b434dec":"ArbOS v10.3 wasmModuleRoot","0xf4389b835497a910d7ba3ebfb77aa93da985634f3c052de1290360635be40c4a":"ArbOS v11 wasmModuleRoot","0x68e4fe5023f792d4ef584796c84d710303a5e12ea02d6e37e2b5e9c4332507c4":"ArbOS v11.1 wasmModuleRoot","0x8b104a2e80ac6165dc58b9048de12f301d70b02a0ab51396c22b4b4b802a16a4":"ArbOS v20 wasmModuleRoot","0xb0de9cb89e4d944ae6023a3b62276e54804c242fd8c4c2d8e6cc4450f5fa8b1b":"ArbOS v30 wasmModuleRoot","0x260f5fa5c3176a856893642e149cf128b5a8de9f828afec8d11184415dd8dc69":"ArbOS v31 wasmModuleRoot"}}]
    }
```

Generated with discovered.json: 0xe467baf95b5f718e49acff35c18c812a7734b1a1

# Diff at Fri, 30 Aug 2024 08:17:18 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@6c1bd1f41fadf5f2cb1c1805b5a2c6138a3ed35a block: 16561766
- current block number: 16561766

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 16561766 (main branch discovery), not current.

```diff
    contract UpgradeExecutor (0xaA3A7A2ec2477A61082E1C41a2c6710587917028) {
    +++ description: None
      receivedPermissions.0.via:
-        []
    }
```

```diff
    contract ProxyAdmin (0xFB48D385Fa3da33762B350e1d705b9E46054E677) {
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

Generated with discovered.json: 0x86e9eec8f7b534fe319d4db68658bca42263d1da

# Diff at Fri, 23 Aug 2024 09:57:34 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@67597c7d6c810bc726594446890178150240711e block: 16561766
- current block number: 16561766

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 16561766 (main branch discovery), not current.

```diff
    contract Inbox (0x21A1e2BFC61F30F2E81E0b08cd37c1FC7ef776E7) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract SequencerInbox (0x6216dD1EE27C5aCEC7427052d3eCDc98E2bc2221) {
    +++ description: State batches / commitments get posted here.
      values.$upgradeCount:
+        2
    }
```

```diff
    contract ChallengeManager (0x67812161Bbb6aCF891aA6028BC614a660961ceD8) {
    +++ description: None
      values.$upgradeCount:
+        2
    }
```

```diff
    contract ERC20RollupEventInbox (0x766DD3A13d17C6D175975C89225bde89F052dBc4) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract UpgradeExecutor (0xaA3A7A2ec2477A61082E1C41a2c6710587917028) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract Outbox (0xe63ddb12FBb6211a73F12a4367b10dA0834B82da) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract Bridge (0xEfEf4558802bF373Ce3307189C79a9cAb0a4Cb9C) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

Generated with discovered.json: 0x8d6095a9902b66ecc06ccc7e8f8d5407c9ad37ac

# Diff at Wed, 21 Aug 2024 13:25:44 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@63cb0bd5d55a6dfae0e2e22590983dd8344be4a3 block: 16561766
- current block number: 16561766

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 16561766 (main branch discovery), not current.

```diff
    contract SequencerInbox (0x6216dD1EE27C5aCEC7427052d3eCDc98E2bc2221) {
    +++ description: State batches / commitments get posted here.
      values.dacKeyset.blsSignatures:
+        ["YBhPN6Tq6nXoJS041bPwKYcDeU1Y84s1URBM4MJHKup49TzNB/23scWwhETSvpAl1RnMwh0S/Z+LZ8UGFWlLYmquyJi5weYTsMF6rChTnuZnqY4I1zQZPemy5hK0sIJDlQaqb/llv/8ujT5q3p4DhBLXZ3eIUMcXs4j7F+QMNZyO87mbTnrulLiPfZbAno1SKg8k2Q76fbNPQs76GK4aseCPeA5hPguvjijDIqDVK5Ffz/PhQ6nap8K6UlApBm+CMBIOmAP9IdMyAVs+wirhgMvR88+JVhoMW9kU3F90bWks78tHYqASrw/lXBFI8TgiGhlvvsmUJAC3dyzjccjMyO0M05JjmM1i8bkAdYuCWRF0KV63rABVXUAFGtKAzrLPpw=="]
    }
```

Generated with discovered.json: 0x77a061391a6039ae3efe993ae4e1ab8a163f49d3

# Diff at Wed, 21 Aug 2024 10:07:55 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@2f6dde3357bf5d79196b6e94f79d853a6c4ec72b block: 16561766
- current block number: 16561766

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 16561766 (main branch discovery), not current.

```diff
    contract Inbox (0x21A1e2BFC61F30F2E81E0b08cd37c1FC7ef776E7) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xFB48D385Fa3da33762B350e1d705b9E46054E677","via":[]}]
    }
```

```diff
    contract SequencerInbox (0x6216dD1EE27C5aCEC7427052d3eCDc98E2bc2221) {
    +++ description: State batches / commitments get posted here.
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xFB48D385Fa3da33762B350e1d705b9E46054E677","via":[]}]
    }
```

```diff
    contract ChallengeManager (0x67812161Bbb6aCF891aA6028BC614a660961ceD8) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xFB48D385Fa3da33762B350e1d705b9E46054E677","via":[]}]
    }
```

```diff
    contract ERC20RollupEventInbox (0x766DD3A13d17C6D175975C89225bde89F052dBc4) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xFB48D385Fa3da33762B350e1d705b9E46054E677","via":[]}]
    }
```

```diff
    contract UpgradeExecutor (0xaA3A7A2ec2477A61082E1C41a2c6710587917028) {
    +++ description: None
      assignedPermissions:
-        {"upgrade":["0xD34F3a11F10DB069173b32d84F02eDA578709143"]}
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xFB48D385Fa3da33762B350e1d705b9E46054E677","via":[]}]
      receivedPermissions:
+        [{"permission":"upgrade","target":"0xD34F3a11F10DB069173b32d84F02eDA578709143","via":[]}]
    }
```

```diff
    contract RollupProxy (0xD34F3a11F10DB069173b32d84F02eDA578709143) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xaA3A7A2ec2477A61082E1C41a2c6710587917028","via":[]}]
    }
```

```diff
    contract Outbox (0xe63ddb12FBb6211a73F12a4367b10dA0834B82da) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xFB48D385Fa3da33762B350e1d705b9E46054E677","via":[]}]
    }
```

```diff
    contract Bridge (0xEfEf4558802bF373Ce3307189C79a9cAb0a4Cb9C) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xFB48D385Fa3da33762B350e1d705b9E46054E677","via":[]}]
    }
```

```diff
    contract ProxyAdmin (0xFB48D385Fa3da33762B350e1d705b9E46054E677) {
    +++ description: None
      assignedPermissions:
-        {"upgrade":["0x21A1e2BFC61F30F2E81E0b08cd37c1FC7ef776E7","0x6216dD1EE27C5aCEC7427052d3eCDc98E2bc2221","0x67812161Bbb6aCF891aA6028BC614a660961ceD8","0x766DD3A13d17C6D175975C89225bde89F052dBc4","0xEfEf4558802bF373Ce3307189C79a9cAb0a4Cb9C","0xaA3A7A2ec2477A61082E1C41a2c6710587917028","0xe63ddb12FBb6211a73F12a4367b10dA0834B82da"]}
      receivedPermissions:
+        [{"permission":"upgrade","target":"0x21A1e2BFC61F30F2E81E0b08cd37c1FC7ef776E7","via":[]},{"permission":"upgrade","target":"0x6216dD1EE27C5aCEC7427052d3eCDc98E2bc2221","via":[]},{"permission":"upgrade","target":"0x67812161Bbb6aCF891aA6028BC614a660961ceD8","via":[]},{"permission":"upgrade","target":"0x766DD3A13d17C6D175975C89225bde89F052dBc4","via":[]},{"permission":"upgrade","target":"0xaA3A7A2ec2477A61082E1C41a2c6710587917028","via":[]},{"permission":"upgrade","target":"0xe63ddb12FBb6211a73F12a4367b10dA0834B82da","via":[]},{"permission":"upgrade","target":"0xEfEf4558802bF373Ce3307189C79a9cAb0a4Cb9C","via":[]}]
    }
```

Generated with discovered.json: 0x42498c92216e6594ae1bda52616be9869e95612f

# Diff at Fri, 09 Aug 2024 12:04:02 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bf40aa32f030fd312056ca0ef198c8550467d1d7 block: 16561766
- current block number: 16561766

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 16561766 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0xFB48D385Fa3da33762B350e1d705b9E46054E677) {
    +++ description: None
      assignedPermissions.upgrade.6:
-        "0x6216dD1EE27C5aCEC7427052d3eCDc98E2bc2221"
+        "0xe63ddb12FBb6211a73F12a4367b10dA0834B82da"
      assignedPermissions.upgrade.5:
-        "0xEfEf4558802bF373Ce3307189C79a9cAb0a4Cb9C"
+        "0xaA3A7A2ec2477A61082E1C41a2c6710587917028"
      assignedPermissions.upgrade.4:
-        "0xaA3A7A2ec2477A61082E1C41a2c6710587917028"
+        "0xEfEf4558802bF373Ce3307189C79a9cAb0a4Cb9C"
      assignedPermissions.upgrade.3:
-        "0xe63ddb12FBb6211a73F12a4367b10dA0834B82da"
+        "0x766DD3A13d17C6D175975C89225bde89F052dBc4"
      assignedPermissions.upgrade.2:
-        "0x766DD3A13d17C6D175975C89225bde89F052dBc4"
+        "0x67812161Bbb6aCF891aA6028BC614a660961ceD8"
      assignedPermissions.upgrade.1:
-        "0x67812161Bbb6aCF891aA6028BC614a660961ceD8"
+        "0x6216dD1EE27C5aCEC7427052d3eCDc98E2bc2221"
    }
```

Generated with discovered.json: 0x8178c9209560a365645d3c44be2d9ad89087b2b1

# Diff at Fri, 09 Aug 2024 10:14:02 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f0da1d0aab7bc6b3b5e54e7e93480bd98e57035 block: 16561766
- current block number: 16561766

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 16561766 (main branch discovery), not current.

```diff
    contract RollupOwnerMultisig (0x7dCe2FEE5e30EFf298cD3d9B92649f00EBDfc104) {
    +++ description: None
      values.$multisigThreshold:
-        "3 of 5 (60%)"
      values.getOwners:
-        ["0x4D8007a0E9f293e62E2b0F43C6Cf4C4B9e135BAe","0x3840f487A17A41100DD1Bf0946c34f132a57Fd5f","0xa0C600a6e85bf225958FFAcC70B5FDDF9A059038","0xefCf0c8faFB425997870f845e26fC6cA6EE6dD5C","0xa4000bDD2bB92ce6750b31F1eeda47Bd1cB8e6e4"]
      values.getThreshold:
-        3
      values.$members:
+        ["0x4D8007a0E9f293e62E2b0F43C6Cf4C4B9e135BAe","0x3840f487A17A41100DD1Bf0946c34f132a57Fd5f","0xa0C600a6e85bf225958FFAcC70B5FDDF9A059038","0xefCf0c8faFB425997870f845e26fC6cA6EE6dD5C","0xa4000bDD2bB92ce6750b31F1eeda47Bd1cB8e6e4"]
      values.$threshold:
+        3
      values.multisigThreshold:
+        "3 of 5 (60%)"
    }
```

```diff
    contract UpgradeExecutor (0xaA3A7A2ec2477A61082E1C41a2c6710587917028) {
    +++ description: None
      assignedPermissions.admin:
-        ["0xD34F3a11F10DB069173b32d84F02eDA578709143"]
      assignedPermissions.upgrade:
+        ["0xD34F3a11F10DB069173b32d84F02eDA578709143"]
    }
```

```diff
    contract ProxyAdmin (0xFB48D385Fa3da33762B350e1d705b9E46054E677) {
    +++ description: None
      assignedPermissions.admin:
-        ["0x21A1e2BFC61F30F2E81E0b08cd37c1FC7ef776E7","0x6216dD1EE27C5aCEC7427052d3eCDc98E2bc2221","0x67812161Bbb6aCF891aA6028BC614a660961ceD8","0x766DD3A13d17C6D175975C89225bde89F052dBc4","0xEfEf4558802bF373Ce3307189C79a9cAb0a4Cb9C","0xaA3A7A2ec2477A61082E1C41a2c6710587917028","0xe63ddb12FBb6211a73F12a4367b10dA0834B82da"]
      assignedPermissions.upgrade:
+        ["0x21A1e2BFC61F30F2E81E0b08cd37c1FC7ef776E7","0x67812161Bbb6aCF891aA6028BC614a660961ceD8","0x766DD3A13d17C6D175975C89225bde89F052dBc4","0xe63ddb12FBb6211a73F12a4367b10dA0834B82da","0xaA3A7A2ec2477A61082E1C41a2c6710587917028","0xEfEf4558802bF373Ce3307189C79a9cAb0a4Cb9C","0x6216dD1EE27C5aCEC7427052d3eCDc98E2bc2221"]
    }
```

Generated with discovered.json: 0x8cc1d487e65c0f4c0d373d60068076cd3c22e2a4

# Diff at Tue, 30 Jul 2024 11:17:37 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@b2b6471ff62871f4956541f42ec025c356c08f7e block: 16561766
- current block number: 16561766

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 16561766 (main branch discovery), not current.

```diff
    contract SequencerInbox (0x6216dD1EE27C5aCEC7427052d3eCDc98E2bc2221) {
    +++ description: State batches / commitments get posted here.
      fieldMeta:
+        {"maxTimeVariation":{"description":"onlyRollupOwner settable. Transactions can only be force-included after `delayBlocks` window (Sequencer-only) has passed."}}
    }
```

```diff
    contract RollupProxy (0xD34F3a11F10DB069173b32d84F02eDA578709143) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
      fieldMeta:
+        {"confirmPeriodBlocks":{"description":"Challenge period. (Number of blocks until a node is confirmed)."},"wasmModuleRoot":{"description":"Root hash of the WASM module used for execution, like a fingerprint of the L2 logic. Can be associated with ArbOS versions."}}
    }
```

Generated with discovered.json: 0x80ba39fc47a3d18884f115b7ce7c8571d3d07e0e

# Diff at Tue, 02 Jul 2024 09:34:53 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@6e87a8f437fbb4bda4cdabd5107dd1f20f111445 block: 16316538
- current block number: 16561766

## Description

Degen is upgraded to [ArbOS Version 20 "Atlas"](https://forum.arbitrum.foundation/t/aip-arbos-version-20-atlas/20957).
This upgrade comes with blobs support (but Degen is an L3 on Base) and was reviewed thoroughly in `packages/backend/discovery/arbitrum/ethereum/diffHistory.md` at "Diff at Fri, 22 Mar 2024 07:51:09 GMT:".

TLDR of changes:
- SequencerInbox changes are related to blobs support
- Critical values like maxTimeVariation in the SequencerInbox (self sequencing delay) stay the same
- ChallengeManager is the same except for pointing to new OneStepProof contract

## Watched changes

```diff
-   Status: DELETED
    contract OneStepProverMemory (0x23D6786f56eb33313a2F3393012e29631f63C914)
    +++ description: None
```

```diff
-   Status: DELETED
    contract OneStepProofEntry (0x351089AaF039aF15bb601e695A30D515963D29Af)
    +++ description: None
```

```diff
    contract SequencerInbox (0x6216dD1EE27C5aCEC7427052d3eCDc98E2bc2221) {
    +++ description: State batches / commitments get posted here.
      upgradeability.implementation:
-        "0x5ad3e9141D0EAd2132afFF0CD74487964cE9135A"
+        "0x98DB769A9E15D66EA04665da0dF616596c296BA8"
      implementations.0:
-        "0x5ad3e9141D0EAd2132afFF0CD74487964cE9135A"
+        "0x98DB769A9E15D66EA04665da0dF616596c296BA8"
      values.batchPosterManager:
+        "0x0000000000000000000000000000000000000000"
      values.BROTLI_MESSAGE_HEADER_FLAG:
+        "0x00"
      values.DAS_MESSAGE_HEADER_FLAG:
+        "0x80"
      values.DATA_BLOB_HEADER_FLAG:
+        "0x50"
      values.isUsingFeeToken:
+        true
      values.reader4844:
+        "0xB48E4A4B8EC04c9F1819302FD370f5B3797c638C"
      values.TREE_DAS_MESSAGE_HEADER_FLAG:
+        "0x08"
      values.ZERO_HEAVY_MESSAGE_HEADER_FLAG:
+        "0x20"
    }
```

```diff
    contract ChallengeManager (0x67812161Bbb6aCF891aA6028BC614a660961ceD8) {
    +++ description: None
      upgradeability.implementation:
-        "0x9Db0bB898C500DD84C7c7bd7fFFFE914569a6677"
+        "0x377A5b786E94cAcdcB2B309451C373c8F2166A79"
      implementations.0:
-        "0x9Db0bB898C500DD84C7c7bd7fFFFE914569a6677"
+        "0x377A5b786E94cAcdcB2B309451C373c8F2166A79"
      values.osp:
-        "0x351089AaF039aF15bb601e695A30D515963D29Af"
+        "0xC17A41629Cd100c74B1Bed7b49D2E0517EfDeaeb"
    }
```

```diff
-   Status: DELETED
    contract OneStepProverHostIo (0x915322CB7Ef079d9d9B97ffEEB63BbfB5c94c096)
    +++ description: None
```

```diff
-   Status: DELETED
    contract OneStepProverMath (0x961eF021A56EC0A051BaA4B3419A4412caFC8fbF)
    +++ description: None
```

```diff
-   Status: DELETED
    contract OneStepProver0 (0xa7F215B5fC21e19C4e17E4915CA69740CE2916Af)
    +++ description: None
```

```diff
    contract RollupProxy (0xD34F3a11F10DB069173b32d84F02eDA578709143) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
+++ description: Root hash of the WASM module used for execution, like a fingerprint of the L2 logic. Can be associated with ArbOS versions.
      values.wasmModuleRoot:
-        "0x0754e09320c381566cc0449904c377a52bd34a6b9404432e80afd573b67f7b17"
+        "0x8b104a2e80ac6165dc58b9048de12f301d70b02a0ab51396c22b4b4b802a16a4"
    }
```

```diff
+   Status: CREATED
    contract OneStepProverMemory (0x2Bb71AE6f5Bb52de5F535efD804e156ed2a35a8f)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProverMath (0x764cDAAc715ef3e29B3c8D28A1261AD9B7eD206D)
    +++ description: None
```

```diff
+   Status: CREATED
    contract  (0xB48E4A4B8EC04c9F1819302FD370f5B3797c638C)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProver0 (0xBa04bD4aDa714b0cb3B87784dc9F20620aF37428)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProofEntry (0xC17A41629Cd100c74B1Bed7b49D2E0517EfDeaeb)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProverHostIo (0xF4AA217a96c205df7B0D081DC95385B701eFE9b0)
    +++ description: None
```

## Source code changes

```diff
.../ChallengeManager/ChallengeManager.sol          |   6 +
 .../OneStepProverHostIo.sol                        | 107 +++-
 .../SequencerInbox/SequencerInbox.sol              | 662 ++++++++++++++++-----
 3 files changed, 611 insertions(+), 164 deletions(-)
```

Generated with discovered.json: 0x603758207c23fada073f1e40b7c71acf33515b0a

# Diff at Tue, 11 Jun 2024 13:15:04 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@4b482f34b787e8546115b599d38d66643fc47a24 block: 15021326
- current block number: 15661159

## Description

Provide description of changes. This section will be preserved.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 15021326 (main branch discovery), not current.

```diff
    contract SequencerInbox (0x6216dD1EE27C5aCEC7427052d3eCDc98E2bc2221) {
    +++ description: State batches / commitments get posted here.
+++ description: Struct: delayBlocks, futureBlocks, delaySeconds, futureSeconds. onlyRollupOwner settable. Transactions can only be force-included after `delayBlocks` window (Sequencer-only) has passed.
      values.maxTimeVariation:
-        [3456000,48,86400000,3600]
+        {"delayBlocks":3456000,"futureBlocks":48,"delaySeconds":86400000,"futureSeconds":3600}
    }
```

Generated with discovered.json: 0xc30d97b2c62e49cb891cf19047ba38cb3a0d7615

# Diff at Mon, 27 May 2024 17:47:10 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@dbc274621a752b9a0e3943e430166c617d1edd06 block: 14543033
- current block number: 15021326

## Description

Updated the SequencerInbox template, no onchain changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 14543033 (main branch discovery), not current.

```diff
    contract SequencerInbox (0x6216dD1EE27C5aCEC7427052d3eCDc98E2bc2221) {
    +++ description: State batches / commitments get posted here.
      values.IS_HARDCODED_SEQUENCER_BATCH_POSTER:
-        false
    }
```

Generated with discovered.json: 0xaf54a96131f4555110c26941ac4b68c40625933a

# Diff at Tue, 14 May 2024 07:08:06 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@0dcad16d442c9306c666eb55cc246f5202105346 block: 12908240
- current block number: 14440563

## Description

This update extends the sequencer-only window for degen chain by 1000x to 1000d. (MaxTimeVariation.delayBlocks, maxTimeVariation.delaySeconds)
Context: Big chain reorg on the L2, no batches posted for the last ~30h.

## Watched changes

```diff
    contract SequencerInbox (0x6216dD1EE27C5aCEC7427052d3eCDc98E2bc2221) {
    +++ description: None
      values.maxTimeVariation.2:
-        86400
+        86400000
      values.maxTimeVariation.0:
-        5760
+        3456000
    }
```

Generated with discovered.json: 0xb10226147642416599acfd9706b5734973b04a80

# Diff at Mon, 08 Apr 2024 19:50:43 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- current block number: 12908240

## Description

Provide description of changes. This section will be preserved.

## Initial discovery

```diff
+   Status: CREATED
    contract Inbox (0x21A1e2BFC61F30F2E81E0b08cd37c1FC7ef776E7)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ValidatorUtils (0x23b0348788b96ee1cE4e7DdED4AC2A99de516F51)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProverMemory (0x23D6786f56eb33313a2F3393012e29631f63C914)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProofEntry (0x351089AaF039aF15bb601e695A30D515963D29Af)
    +++ description: None
```

```diff
+   Status: CREATED
    contract UTBDecent (0x43019F8BE1F192587883b67dEA2994999f5a2de2)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SequencerInbox (0x6216dD1EE27C5aCEC7427052d3eCDc98E2bc2221)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ChallengeManager (0x67812161Bbb6aCF891aA6028BC614a660961ceD8)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ERC20RollupEventInbox (0x766DD3A13d17C6D175975C89225bde89F052dBc4)
    +++ description: None
```

```diff
+   Status: CREATED
    contract RollupOwnerMultisig (0x7dCe2FEE5e30EFf298cD3d9B92649f00EBDfc104)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProverHostIo (0x915322CB7Ef079d9d9B97ffEEB63BbfB5c94c096)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProverMath (0x961eF021A56EC0A051BaA4B3419A4412caFC8fbF)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProver0 (0xa7F215B5fC21e19C4e17E4915CA69740CE2916Af)
    +++ description: None
```

```diff
+   Status: CREATED
    contract UpgradeExecutor (0xaA3A7A2ec2477A61082E1C41a2c6710587917028)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ValidatorWalletCreator (0xB546310EA2De84220811a03BCD5CeE96D251fA7D)
    +++ description: None
```

```diff
+   Status: CREATED
    contract  (0xd063bb4EB74f813b1A0D9208Da100E3c08D9d4C9)
    +++ description: None
```

```diff
+   Status: CREATED
    contract RollupProxy (0xD34F3a11F10DB069173b32d84F02eDA578709143)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Outbox (0xe63ddb12FBb6211a73F12a4367b10dA0834B82da)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Bridge (0xEfEf4558802bF373Ce3307189C79a9cAb0a4Cb9C)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0xFB48D385Fa3da33762B350e1d705b9E46054E677)
    +++ description: None
```
