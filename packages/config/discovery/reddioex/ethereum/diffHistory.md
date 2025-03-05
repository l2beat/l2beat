Generated with discovered.json: 0x60d5ffa31fcd2b330f870f60b0949c7c4bafa0b2

# Diff at Wed, 05 Mar 2025 13:37:04 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@2e85261cbf7cfc5afeac755b44f9df82c8a3c4ba block: 19825385
- current block number: 19825385

## Description

discodrive sn stack and starkex chains.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19825385 (main branch discovery), not current.

```diff
    contract Committee (0x4b2Bf1Cb06CB636e8A14540F76c477E61d8B6669) {
    +++ description: Data Availability Committee (DAC) contract verifying and storing data availability claims from DAC Members (via a multisignature check). The threshold of valid signatures is 3.
      template:
+        "starkex/Committee"
      displayName:
+        "DACommittee"
      description:
+        "Data Availability Committee (DAC) contract verifying and storing data availability claims from DAC Members (via a multisignature check). The threshold of valid signatures is 3."
      fieldMeta:
+        {"constructorArgs":{"description":"Includes DAC members and threshold."}}
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract GpsFactRegistryAdapter (0x5339AB7557b3152b91A57D10B0Caf5da88Db5143) {
    +++ description: Adapter between the core contract and the 0x47312450B3Ac8b5b8e247a6bB6d523e7605bDb60. Stores the Cairo programHash (`16830627573509542901909952446321116535677491650708854009406762893086223513`).
      values.programHashMapped:
+        "16830627573509542901909952446321116535677491650708854009406762893086223513"
      template:
+        "starkex/GpsFactRegistryAdapter"
      description:
+        "Adapter between the core contract and the 0x47312450B3Ac8b5b8e247a6bB6d523e7605bDb60. Stores the Cairo programHash (`16830627573509542901909952446321116535677491650708854009406762893086223513`)."
    }
```

```diff
    contract OrderRegistry (0x806d435a82B0381bD884540c2235147c13B97fe6) {
    +++ description: Helper contract for registering limit orders from L1.
      template:
+        "starkex/OrderRegistry"
      description:
+        "Helper contract for registering limit orders from L1."
    }
```

```diff
    contract StarkExchange (0xB62BcD40A24985f560b5a9745d478791d8F1945C) {
    +++ description: Central Validium contract. Receives (verified) state roots from the Operator, allows users to consume L2 -> L1 messages and send L1 -> L2 messages. Critical configuration values for the L2's logic are defined here by various governance roles.
      issuedPermissions.6:
+        {"permission":"upgrade","to":"0x6b7763b749073e892c83E674c1EC4799D6f339Ef","via":[]}
      issuedPermissions.5:
+        {"permission":"operateStarknet","to":"0x5751a83170BeA11fE7CdA5D599B04153C021f21A","via":[]}
      issuedPermissions.4:
+        {"permission":"operateStarknet","to":"0x2e1c08E457F0E0F462Ef99eC9271dc5BfAd88b2a","via":[]}
      issuedPermissions.3:
+        {"permission":"interact","to":"0xd19c12443977a58694Eb89E867Cd84C18c3B89F7","description":"Can regsiter new tokens for deposits and withdrawals.","via":[]}
      issuedPermissions.2:
+        {"permission":"interact","to":"0x6cE93f7A0F211A704Ed93C5500165b70D2F46Ef7","description":"Can regsiter new tokens for deposits and withdrawals.","via":[]}
      issuedPermissions.1:
+        {"permission":"interact","to":"0x6b7763b749073e892c83E674c1EC4799D6f339Ef","description":"manage the token admin role.","via":[]}
      issuedPermissions.0.permission:
-        "upgrade"
+        "governStarknet"
      values.operators:
+        ["0x5751a83170BeA11fE7CdA5D599B04153C021f21A","0x2e1c08E457F0E0F462Ef99eC9271dc5BfAd88b2a"]
      values.tokenAdmins:
+        ["0x6cE93f7A0F211A704Ed93C5500165b70D2F46Ef7","0xd19c12443977a58694Eb89E867Cd84C18c3B89F7"]
      template:
+        "starkex/StarkExchange"
      description:
+        "Central Validium contract. Receives (verified) state roots from the Operator, allows users to consume L2 -> L1 messages and send L1 -> L2 messages. Critical configuration values for the L2's logic are defined here by various governance roles."
      fieldMeta:
+        {"$admin":{"severity":"HIGH","description":"Permissioned to upgrade the proxy implementations and access all `onlyGovernance` restricted functions in the various implementation contracts."},"isFinalized":{"severity":"HIGH","description":"Finalizes most of the configuration of the contract, which cannot be changed afterwards (only thorugh an upgrade)."},"DEPOSIT_CANCEL_DELAY":{"description":"The time delay required before canceled deposits to the L2 can be reclaimed."}}
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
+   Status: CREATED
    contract ReddioDeployHelper (0x12d5C7b205c707B5643F041Bd3F1Bc4420Bdf408)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x48AC0E8F0b61462e4763ECF9d615914B989ACa11)
    +++ description: None
```

```diff
+   Status: CREATED
    contract RegisterProxy (0xd19c12443977a58694Eb89E867Cd84C18c3B89F7)
    +++ description: None
```

Generated with discovered.json: 0xfe60e86270c90c40252503f58bdfe23e3cbf51c2

# Diff at Tue, 04 Mar 2025 10:39:41 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@98d260b45fe0d2195ce5e629bd7b200c8706e8ba block: 19825385
- current block number: 19825385

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19825385 (main branch discovery), not current.

```diff
    contract Committee (0x4b2Bf1Cb06CB636e8A14540F76c477E61d8B6669) {
    +++ description: None
      sinceBlock:
+        15559994
    }
```

```diff
    contract GpsFactRegistryAdapter (0x5339AB7557b3152b91A57D10B0Caf5da88Db5143) {
    +++ description: None
      sinceBlock:
+        15114702
    }
```

```diff
    contract OrderRegistry (0x806d435a82B0381bD884540c2235147c13B97fe6) {
    +++ description: None
      sinceBlock:
+        15114702
    }
```

```diff
    contract StarkExchange (0xB62BcD40A24985f560b5a9745d478791d8F1945C) {
    +++ description: None
      sinceBlock:
+        15559994
    }
```

Generated with discovered.json: 0x94e92c5a40431a6d9e5da069e51a874992f3f116

# Diff at Mon, 20 Jan 2025 11:09:58 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@2c8b4f3d9910bb6371be9b4df87b70856e7d8c64 block: 19825385
- current block number: 19825385

## Description

Rerun on the same block number. Applies fixes to permissions and via field. Renames permission's target to to/from.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19825385 (main branch discovery), not current.

```diff
    contract StarkExchange (0xB62BcD40A24985f560b5a9745d478791d8F1945C) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x6b7763b749073e892c83E674c1EC4799D6f339Ef"
      issuedPermissions.0.to:
+        "0x6b7763b749073e892c83E674c1EC4799D6f339Ef"
    }
```

Generated with discovered.json: 0x8db347e0627aceae41e98c63e6916951684cae7b

# Diff at Mon, 21 Oct 2024 11:09:28 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@8895d33866f5665c4c710f4ddaa32bfa63cc3c78 block: 19825385
- current block number: 19825385

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19825385 (main branch discovery), not current.

```diff
    contract StarkExchange (0xB62BcD40A24985f560b5a9745d478791d8F1945C) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0xdF2f24751F7e84ccDCD39e7b49904FAB0Fb0f583","0xfbea22FeB369DB10C0d3a2aAa8F4939E76815f12","0x2Dbc18A3ac126abE1fF90A83Bbc3947ff7912Afb","0x67e198743BC19fa4757720eDd0e769f8291e1F1D","0x613ee54C54D5548627064B4D648942bF3648f376","0xb2ED005D0278179001a49a9969BB22BA8e98f31F","0xB5353268d8d4D711a92cb838F8fEDFC2A66E50Db"]
      values.$pastUpgrades.0.1:
-        ["0xdF2f24751F7e84ccDCD39e7b49904FAB0Fb0f583","0xfbea22FeB369DB10C0d3a2aAa8F4939E76815f12","0x2Dbc18A3ac126abE1fF90A83Bbc3947ff7912Afb","0x67e198743BC19fa4757720eDd0e769f8291e1F1D","0x613ee54C54D5548627064B4D648942bF3648f376","0xb2ED005D0278179001a49a9969BB22BA8e98f31F","0xB5353268d8d4D711a92cb838F8fEDFC2A66E50Db"]
+        "0x22e1b7422ea0e56a847c04010c02b75744d47b29cdc7138c9b7ac6f8ab30be4e"
    }
```

Generated with discovered.json: 0x8badc9d3c3eca74f26861e0208310cdc80a97ced

# Diff at Mon, 14 Oct 2024 10:54:48 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1afc77ff111ceb0970e7d09efcc7b2f376b0c281 block: 19825385
- current block number: 19825385

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19825385 (main branch discovery), not current.

```diff
    contract Committee (0x4b2Bf1Cb06CB636e8A14540F76c477E61d8B6669) {
    +++ description: None
      sourceHashes:
+        ["0x220ee35d4e83e9cca7e8fa42dcab4d9571ce3078b50bacbdb2fc75afa7f0290e"]
    }
```

```diff
    contract GpsFactRegistryAdapter (0x5339AB7557b3152b91A57D10B0Caf5da88Db5143) {
    +++ description: None
      sourceHashes:
+        ["0x3c0fff412189244728e9be021e2c7a1084326cc80e71f930221094909caafec0"]
    }
```

```diff
    contract OrderRegistry (0x806d435a82B0381bD884540c2235147c13B97fe6) {
    +++ description: None
      sourceHashes:
+        ["0x1e28fda3c245bc1fc13d0ddc7b108be510d1e0220fc67552921c87724bb45a4c"]
    }
```

```diff
    contract StarkExchange (0xB62BcD40A24985f560b5a9745d478791d8F1945C) {
    +++ description: None
      sourceHashes:
+        ["0x2c95972415c771f5ef6d71449bae168597b6c35245fbe8769425e5c9c753e918","0xadae235d029868dddc287e823167705942660a99a9154a4e487f5dfb4ddd01c9","0x70e4767336d4a44ecedb78b7cef6dc2810f5d8bc87a46c360083e65af451cb97","0x75d386d73767f57d5f11c11f7bf837a48cd417754eea559931fc98a96ef34152","0x0e101cfdb791ca1a86402273377c7da5e67225cf5799ac2f51d9a940227ee6be","0x7d557870276c694154e12790f8c0c09930c8c75320f470c47b67968bffd536a6","0x2a703c051ff2524868f044282fc50b01913736a92f794b64b31bd31363cd3fca","0xd5b06286e3bf5dccd0bb360c8cc876aec0a2ce288120d9f83dec45fa47c1aabc"]
    }
```

Generated with discovered.json: 0xc6a37a48bffd693b7dc7d8e37c536e896f3f9b45

# Diff at Tue, 01 Oct 2024 10:54:34 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bd754dc73c66120164006054f8d25c5fae9cd910 block: 19825385
- current block number: 19825385

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19825385 (main branch discovery), not current.

```diff
    contract StarkExchange (0xB62BcD40A24985f560b5a9745d478791d8F1945C) {
    +++ description: None
      values.$pastUpgrades:
+        [["2022-09-18T10:59:23.000Z",["0xdF2f24751F7e84ccDCD39e7b49904FAB0Fb0f583","0xfbea22FeB369DB10C0d3a2aAa8F4939E76815f12","0x2Dbc18A3ac126abE1fF90A83Bbc3947ff7912Afb","0x67e198743BC19fa4757720eDd0e769f8291e1F1D","0x613ee54C54D5548627064B4D648942bF3648f376","0xb2ED005D0278179001a49a9969BB22BA8e98f31F","0xB5353268d8d4D711a92cb838F8fEDFC2A66E50Db"]]]
      values.$upgradeCount:
+        1
    }
```

Generated with discovered.json: 0x43d7bc5e60e1804491c0e924240b53cb55a254f9

# Diff at Wed, 21 Aug 2024 10:05:21 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@2f6dde3357bf5d79196b6e94f79d853a6c4ec72b block: 19825385
- current block number: 19825385

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19825385 (main branch discovery), not current.

```diff
    contract StarkExchange (0xB62BcD40A24985f560b5a9745d478791d8F1945C) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x6b7763b749073e892c83E674c1EC4799D6f339Ef","via":[]}]
    }
```

Generated with discovered.json: 0xfd5a9074c13d345210aa4ee310a8a59c173b2cd0

# Diff at Wed, 08 May 2024 12:37:19 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@7eb116053a3dfe1dcff4cde0b8b45a07198fbab8 block: 19624872
- current block number: 19825385

## Description

Provide description of changes. This section will be preserved.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19624872 (main branch discovery), not current.

```diff
    contract StarkExchange (0xB62BcD40A24985f560b5a9745d478791d8F1945C) {
    +++ description: None
      values.getRegisteredAvailabilityVerifiers:
-        "0x4b2Bf1Cb06CB636e8A14540F76c477E61d8B6669"
+        ["0x4b2Bf1Cb06CB636e8A14540F76c477E61d8B6669"]
      values.getRegisteredVerifiers:
-        "0x5339AB7557b3152b91A57D10B0Caf5da88Db5143"
+        ["0x5339AB7557b3152b91A57D10B0Caf5da88Db5143"]
    }
```

Generated with discovered.json: 0x5937688b48a3b2c4b4b6097811b1d1138dd318dd

# Diff at Wed, 10 Apr 2024 11:16:33 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@ee07d1cb2dc09651ee4b52c49bb3ad20765aa9f3 block: 18939696
- current block number: 19624872

## Description

Provide description of changes. This section will be preserved.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 18939696 (main branch discovery), not current.

```diff
    contract StarkExchange (0xB62BcD40A24985f560b5a9745d478791d8F1945C) {
    +++ description: None
      values.getRegisteredAvailabilityVerifiers:
-        ["0x4b2Bf1Cb06CB636e8A14540F76c477E61d8B6669"]
+        "0x4b2Bf1Cb06CB636e8A14540F76c477E61d8B6669"
      values.getRegisteredVerifiers:
-        ["0x5339AB7557b3152b91A57D10B0Caf5da88Db5143"]
+        "0x5339AB7557b3152b91A57D10B0Caf5da88Db5143"
    }
```

Generated with discovered.json: 0x98130a67d5a856f24da2c30adf398cbb22109a4b

# Diff at Fri, 05 Jan 2024 07:48:28 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@

## Description

Added initial config.

## Watched changes

```diff
+   Status: CREATED
    contract Committee (0x4b2Bf1Cb06CB636e8A14540F76c477E61d8B6669) {
    }
```

```diff
+   Status: CREATED
    contract GpsFactRegistryAdapter (0x5339AB7557b3152b91A57D10B0Caf5da88Db5143) {
    }
```

```diff
+   Status: CREATED
    contract OrderRegistry (0x806d435a82B0381bD884540c2235147c13B97fe6) {
    }
```

```diff
+   Status: CREATED
    contract StarkExchange (0xB62BcD40A24985f560b5a9745d478791d8F1945C) {
    }
```
