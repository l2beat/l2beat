Generated with discovered.json: 0x4e40a2a60e9490930c99e5d32e36ed46599751f6

# Diff at Tue, 01 Oct 2024 11:11:08 GMT:

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
