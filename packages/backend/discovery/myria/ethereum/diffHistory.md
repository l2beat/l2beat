Generated with discovered.json: 0x98b225faa862ab7c62bd62ae5e06e603939e3043

# Diff at Wed, 21 Aug 2024 10:04:15 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@2f6dde3357bf5d79196b6e94f79d853a6c4ec72b block: 19825378
- current block number: 19825378

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19825378 (main branch discovery), not current.

```diff
    contract StarkExchange (0x3071BE11F9e92A9eb28F305e1Fa033cD102714e7) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xc49Ec6Bb817E17a9Ca5B738ca330db403cc74245","via":[]}]
    }
```

Generated with discovered.json: 0x2b8036c2369ffbe8483ab62cdf43daf6efee87fb

# Diff at Wed, 08 May 2024 12:36:05 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@7eb116053a3dfe1dcff4cde0b8b45a07198fbab8 block: 19624868
- current block number: 19825378

## Description

Provide description of changes. This section will be preserved.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19624868 (main branch discovery), not current.

```diff
    contract StarkExchange (0x3071BE11F9e92A9eb28F305e1Fa033cD102714e7) {
    +++ description: None
      values.getRegisteredAvailabilityVerifiers:
-        "0x1e601435E181423e7A8430813d7500012a6169cB"
+        ["0x1e601435E181423e7A8430813d7500012a6169cB"]
      values.getRegisteredVerifiers:
-        "0x5339AB7557b3152b91A57D10B0Caf5da88Db5143"
+        ["0x5339AB7557b3152b91A57D10B0Caf5da88Db5143"]
    }
```

Generated with discovered.json: 0xfb8d7562beb0fe5517082d3cc03af394f25f544e

# Diff at Wed, 10 Apr 2024 11:15:51 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@ee07d1cb2dc09651ee4b52c49bb3ad20765aa9f3 block: 17039298
- current block number: 19624868

## Description

Provide description of changes. This section will be preserved.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 17039298 (main branch discovery), not current.

```diff
    contract StarkExchange (0x3071BE11F9e92A9eb28F305e1Fa033cD102714e7) {
    +++ description: None
      values.getRegisteredAvailabilityVerifiers:
-        ["0x1e601435E181423e7A8430813d7500012a6169cB"]
+        "0x1e601435E181423e7A8430813d7500012a6169cB"
      values.getRegisteredVerifiers:
-        ["0x5339AB7557b3152b91A57D10B0Caf5da88Db5143"]
+        "0x5339AB7557b3152b91A57D10B0Caf5da88Db5143"
    }
```

Generated with discovered.json: 0x640439e81ad77a8134dbc8fd6a153a004af2bb5a
