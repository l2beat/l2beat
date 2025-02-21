Generated with discovered.json: 0x3431285b449398855757234339ac8c18482c04ea

# Diff at Mon, 20 Jan 2025 11:09:21 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@2c8b4f3d9910bb6371be9b4df87b70856e7d8c64 block: 19825363
- current block number: 19825363

## Description

Rerun on the same block number. Applies fixes to permissions and via field. Renames permission's target to to/from.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19825363 (main branch discovery), not current.

```diff
    contract StarkExchange (0x7A7f9c8fe871cd50f6Ce935d7c7caD2e89987f9d) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xc7C731AF62Cd43eB158ad3Ac0fC5d2dd32648C7A"
      issuedPermissions.0.to:
+        "0xc7C731AF62Cd43eB158ad3Ac0fC5d2dd32648C7A"
    }
```

Generated with discovered.json: 0xd3dd9f00138e8eb4fce73fc631d94bc530e94ae5

# Diff at Mon, 21 Oct 2024 11:04:59 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@8895d33866f5665c4c710f4ddaa32bfa63cc3c78 block: 19825363
- current block number: 19825363

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19825363 (main branch discovery), not current.

```diff
    contract StarkExchange (0x7A7f9c8fe871cd50f6Ce935d7c7caD2e89987f9d) {
    +++ description: None
      values.$pastUpgrades.1.2:
+        ["0xdF2f24751F7e84ccDCD39e7b49904FAB0Fb0f583","0xfbea22FeB369DB10C0d3a2aAa8F4939E76815f12","0x2Dbc18A3ac126abE1fF90A83Bbc3947ff7912Afb","0x67e198743BC19fa4757720eDd0e769f8291e1F1D","0x613ee54C54D5548627064B4D648942bF3648f376","0xb2ED005D0278179001a49a9969BB22BA8e98f31F","0xB5353268d8d4D711a92cb838F8fEDFC2A66E50Db"]
      values.$pastUpgrades.1.1:
-        ["0xdF2f24751F7e84ccDCD39e7b49904FAB0Fb0f583","0xfbea22FeB369DB10C0d3a2aAa8F4939E76815f12","0x2Dbc18A3ac126abE1fF90A83Bbc3947ff7912Afb","0x67e198743BC19fa4757720eDd0e769f8291e1F1D","0x613ee54C54D5548627064B4D648942bF3648f376","0xb2ED005D0278179001a49a9969BB22BA8e98f31F","0xB5353268d8d4D711a92cb838F8fEDFC2A66E50Db"]
+        "0x97c6a3aca2ac585348ccbbe10dd7c4730a3853106a0a9b3d8d1d8e405981ed09"
      values.$pastUpgrades.0.2:
+        ["0xdF2f24751F7e84ccDCD39e7b49904FAB0Fb0f583","0xfbea22FeB369DB10C0d3a2aAa8F4939E76815f12","0x2Dbc18A3ac126abE1fF90A83Bbc3947ff7912Afb","0x67e198743BC19fa4757720eDd0e769f8291e1F1D","0x613ee54C54D5548627064B4D648942bF3648f376","0xb2ED005D0278179001a49a9969BB22BA8e98f31F","0xB5353268d8d4D711a92cb838F8fEDFC2A66E50Db"]
      values.$pastUpgrades.0.1:
-        ["0xdF2f24751F7e84ccDCD39e7b49904FAB0Fb0f583","0xfbea22FeB369DB10C0d3a2aAa8F4939E76815f12","0x2Dbc18A3ac126abE1fF90A83Bbc3947ff7912Afb","0x67e198743BC19fa4757720eDd0e769f8291e1F1D","0x613ee54C54D5548627064B4D648942bF3648f376","0xb2ED005D0278179001a49a9969BB22BA8e98f31F","0xB5353268d8d4D711a92cb838F8fEDFC2A66E50Db"]
+        "0x50e5c3432c70df7f715110a4d3799242adbbb0d2826611ba744579c34e257cc1"
    }
```

Generated with discovered.json: 0x1560de61ca33caff8b0ec3bc99f0a815a8bf6b82

# Diff at Mon, 14 Oct 2024 10:50:03 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1afc77ff111ceb0970e7d09efcc7b2f376b0c281 block: 19825363
- current block number: 19825363

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19825363 (main branch discovery), not current.

```diff
    contract GpsFactRegistryAdapter (0x5339AB7557b3152b91A57D10B0Caf5da88Db5143) {
    +++ description: None
      sourceHashes:
+        ["0x3c0fff412189244728e9be021e2c7a1084326cc80e71f930221094909caafec0"]
    }
```

```diff
    contract StarkExchange (0x7A7f9c8fe871cd50f6Ce935d7c7caD2e89987f9d) {
    +++ description: None
      sourceHashes:
+        ["0x2c95972415c771f5ef6d71449bae168597b6c35245fbe8769425e5c9c753e918","0xadae235d029868dddc287e823167705942660a99a9154a4e487f5dfb4ddd01c9","0x70e4767336d4a44ecedb78b7cef6dc2810f5d8bc87a46c360083e65af451cb97","0x75d386d73767f57d5f11c11f7bf837a48cd417754eea559931fc98a96ef34152","0x0e101cfdb791ca1a86402273377c7da5e67225cf5799ac2f51d9a940227ee6be","0x7d557870276c694154e12790f8c0c09930c8c75320f470c47b67968bffd536a6","0x2a703c051ff2524868f044282fc50b01913736a92f794b64b31bd31363cd3fca","0xd5b06286e3bf5dccd0bb360c8cc876aec0a2ce288120d9f83dec45fa47c1aabc"]
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
    contract Committee (0x8B3A6662809195453645e37C2005d655f57ca818) {
    +++ description: None
      sourceHashes:
+        ["0x220ee35d4e83e9cca7e8fa42dcab4d9571ce3078b50bacbdb2fc75afa7f0290e"]
    }
```

Generated with discovered.json: 0x86ba92cc3e60dd7307f470750b7039f1eb0ccde2

# Diff at Tue, 01 Oct 2024 10:50:20 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bd754dc73c66120164006054f8d25c5fae9cd910 block: 19825363
- current block number: 19825363

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19825363 (main branch discovery), not current.

```diff
    contract StarkExchange (0x7A7f9c8fe871cd50f6Ce935d7c7caD2e89987f9d) {
    +++ description: None
      values.$pastUpgrades:
+        [["2023-01-22T11:58:11.000Z",["0xdF2f24751F7e84ccDCD39e7b49904FAB0Fb0f583","0xfbea22FeB369DB10C0d3a2aAa8F4939E76815f12","0x2Dbc18A3ac126abE1fF90A83Bbc3947ff7912Afb","0x67e198743BC19fa4757720eDd0e769f8291e1F1D","0x613ee54C54D5548627064B4D648942bF3648f376","0xb2ED005D0278179001a49a9969BB22BA8e98f31F","0xB5353268d8d4D711a92cb838F8fEDFC2A66E50Db"]],["2023-01-26T13:22:47.000Z",["0xdF2f24751F7e84ccDCD39e7b49904FAB0Fb0f583","0xfbea22FeB369DB10C0d3a2aAa8F4939E76815f12","0x2Dbc18A3ac126abE1fF90A83Bbc3947ff7912Afb","0x67e198743BC19fa4757720eDd0e769f8291e1F1D","0x613ee54C54D5548627064B4D648942bF3648f376","0xb2ED005D0278179001a49a9969BB22BA8e98f31F","0xB5353268d8d4D711a92cb838F8fEDFC2A66E50Db"]]]
      values.$upgradeCount:
+        2
    }
```

Generated with discovered.json: 0x4f9f8c74305743a7e1f97a6e0d52bbb569ea7da6

# Diff at Wed, 21 Aug 2024 10:02:23 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@2f6dde3357bf5d79196b6e94f79d853a6c4ec72b block: 19825363
- current block number: 19825363

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19825363 (main branch discovery), not current.

```diff
    contract StarkExchange (0x7A7f9c8fe871cd50f6Ce935d7c7caD2e89987f9d) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xc7C731AF62Cd43eB158ad3Ac0fC5d2dd32648C7A","via":[]}]
    }
```

Generated with discovered.json: 0x8cd00994bfd082e08f4532a12160c21501ad1507

# Diff at Wed, 08 May 2024 12:33:05 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@7eb116053a3dfe1dcff4cde0b8b45a07198fbab8 block: 19624848
- current block number: 19825363

## Description

Provide description of changes. This section will be preserved.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19624848 (main branch discovery), not current.

```diff
    contract StarkExchange (0x7A7f9c8fe871cd50f6Ce935d7c7caD2e89987f9d) {
    +++ description: None
      values.getRegisteredAvailabilityVerifiers:
-        "0x8B3A6662809195453645e37C2005d655f57ca818"
+        ["0x8B3A6662809195453645e37C2005d655f57ca818"]
      values.getRegisteredVerifiers:
-        "0x5339AB7557b3152b91A57D10B0Caf5da88Db5143"
+        ["0x5339AB7557b3152b91A57D10B0Caf5da88Db5143"]
    }
```

Generated with discovered.json: 0xd90f4306c3b317a1454fc92338cbad186951fcfb

# Diff at Wed, 10 Apr 2024 11:11:58 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@ee07d1cb2dc09651ee4b52c49bb3ad20765aa9f3 block: 19531509
- current block number: 19624848

## Description

Provide description of changes. This section will be preserved.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19531509 (main branch discovery), not current.

```diff
    contract StarkExchange (0x7A7f9c8fe871cd50f6Ce935d7c7caD2e89987f9d) {
    +++ description: None
      values.getRegisteredAvailabilityVerifiers:
-        ["0x8B3A6662809195453645e37C2005d655f57ca818"]
+        "0x8B3A6662809195453645e37C2005d655f57ca818"
      values.getRegisteredVerifiers:
-        ["0x5339AB7557b3152b91A57D10B0Caf5da88Db5143"]
+        "0x5339AB7557b3152b91A57D10B0Caf5da88Db5143"
    }
```

Generated with discovered.json: 0xfe89066c29ef8632a3c9263693231196272b07b2
