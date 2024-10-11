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
