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
