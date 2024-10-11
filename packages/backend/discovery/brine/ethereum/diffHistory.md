Generated with discovered.json: 0x441862f1677fe5a1358fc0a21c1e038d22ae088b

# Diff at Tue, 01 Oct 2024 10:50:18 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bd754dc73c66120164006054f8d25c5fae9cd910 block: 19825361
- current block number: 19825361

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19825361 (main branch discovery), not current.

```diff
    contract StarkExchange (0x1390f521A79BaBE99b69B37154D63D431da27A07) {
    +++ description: None
      values.$pastUpgrades:
+        [["2022-07-10T11:43:26.000Z",["0xe6785C3AfF4292C9d7c6b039f649672C45CAfFee","0xfbea22FeB369DB10C0d3a2aAa8F4939E76815f12","0x2Dbc18A3ac126abE1fF90A83Bbc3947ff7912Afb","0x4b9b30e6E135d5e39345a03F381D9c704b2Af010","0x07228f73AA048f67893F4b966D1D09783EdD8764","0xb2ED005D0278179001a49a9969BB22BA8e98f31F","0xB5353268d8d4D711a92cb838F8fEDFC2A66E50Db"]],["2022-09-01T15:17:55.000Z",["0xdF2f24751F7e84ccDCD39e7b49904FAB0Fb0f583","0xfbea22FeB369DB10C0d3a2aAa8F4939E76815f12","0x2Dbc18A3ac126abE1fF90A83Bbc3947ff7912Afb","0x67e198743BC19fa4757720eDd0e769f8291e1F1D","0x613ee54C54D5548627064B4D648942bF3648f376","0xb2ED005D0278179001a49a9969BB22BA8e98f31F","0xB5353268d8d4D711a92cb838F8fEDFC2A66E50Db"]]]
      values.$upgradeCount:
+        2
    }
```

Generated with discovered.json: 0xba8ebbc521de98ddec0177eb0e97b0f968d4f095

# Diff at Wed, 21 Aug 2024 10:02:21 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@2f6dde3357bf5d79196b6e94f79d853a6c4ec72b block: 19825361
- current block number: 19825361

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19825361 (main branch discovery), not current.

```diff
    contract StarkExchange (0x1390f521A79BaBE99b69B37154D63D431da27A07) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x303775491494a08b07365938787274F742a81F63","via":[]}]
    }
```

Generated with discovered.json: 0xfc7f9a53cff53777cd8c3d6de98e1616a725c704

# Diff at Wed, 08 May 2024 12:32:37 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@7eb116053a3dfe1dcff4cde0b8b45a07198fbab8 block: 19624845
- current block number: 19825361

## Description

Provide description of changes. This section will be preserved.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19624845 (main branch discovery), not current.

```diff
    contract StarkExchange (0x1390f521A79BaBE99b69B37154D63D431da27A07) {
    +++ description: None
      values.getRegisteredAvailabilityVerifiers:
-        "0x4F8B2dd49D958b6ac3e5f4705Bf1a9aDA5Bc4446"
+        ["0x4F8B2dd49D958b6ac3e5f4705Bf1a9aDA5Bc4446"]
      values.getRegisteredVerifiers:
-        "0x5339AB7557b3152b91A57D10B0Caf5da88Db5143"
+        ["0x5339AB7557b3152b91A57D10B0Caf5da88Db5143"]
    }
```

Generated with discovered.json: 0xbad77bab912db96aa0e8e1ba2bd66b2579a0d2af

# Diff at Wed, 10 Apr 2024 11:11:20 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@ee07d1cb2dc09651ee4b52c49bb3ad20765aa9f3 block: 19531506
- current block number: 19624845

## Description

Provide description of changes. This section will be preserved.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19531506 (main branch discovery), not current.

```diff
    contract StarkExchange (0x1390f521A79BaBE99b69B37154D63D431da27A07) {
    +++ description: None
      values.getRegisteredAvailabilityVerifiers:
-        ["0x4F8B2dd49D958b6ac3e5f4705Bf1a9aDA5Bc4446"]
+        "0x4F8B2dd49D958b6ac3e5f4705Bf1a9aDA5Bc4446"
      values.getRegisteredVerifiers:
-        ["0x5339AB7557b3152b91A57D10B0Caf5da88Db5143"]
+        "0x5339AB7557b3152b91A57D10B0Caf5da88Db5143"
    }
```

Generated with discovered.json: 0xb5850ddd61b2f05649c4fc15cdc1a99a42517d3d

# Diff at Wed, 06 Mar 2024 14:41:28 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@cea88c5f3ff85fed5d72dadc72ae50315d0808d6 block: 18983727
- current block number: 19376792

## Description

Added the SHARP shared module.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 18983727 (main branch discovery), not current.

```diff
-   Status: DELETED
    contract SHARPVerifierGovernorMultisig (0x21F9eC47b19d95b5C2DDFB6Ae5D4F92fAdacAEc4)
    +++ description: None
```

```diff
-   Status: DELETED
    contract SHARPVerifierProxy (0x47312450B3Ac8b5b8e247a6bB6d523e7605bDb60)
    +++ description: None
```

```diff
-   Status: DELETED
    contract SHARPVerifier (0x6cB3EE90C50a38A0e4662bB7e7E6e40B91361BF6)
    +++ description: None
```

Generated with discovered.json: 0x0cd8c4cfa2d1f43c4656c004415ecaf6cdd32409

# Diff at Thu, 11 Jan 2024 12:36:15 GMT:

- author: torztomasz (<tomasz.torz@l2beat.com>)
- current block number: 18983651

## Description

Update discovery to include the multisig threshold.

## Initial discovery

```diff
+   Status: CREATED
    contract StarkExchange (0x1390f521A79BaBE99b69B37154D63D431da27A07) {
    }
```

```diff
+   Status: CREATED
    contract SHARPVerifierGovernorMultisig (0x21F9eC47b19d95b5C2DDFB6Ae5D4F92fAdacAEc4) {
    }
```

```diff
+   Status: CREATED
    contract SHARPVerifierProxy (0x47312450B3Ac8b5b8e247a6bB6d523e7605bDb60) {
    }
```

```diff
+   Status: CREATED
    contract Committee (0x4F8B2dd49D958b6ac3e5f4705Bf1a9aDA5Bc4446) {
    }
```

```diff
+   Status: CREATED
    contract GpsFactRegistryAdapter (0x5339AB7557b3152b91A57D10B0Caf5da88Db5143) {
    }
```

```diff
+   Status: CREATED
    contract SHARPVerifier (0x6cB3EE90C50a38A0e4662bB7e7E6e40B91361BF6) {
    }
```

```diff
+   Status: CREATED
    contract OrderRegistry (0x806d435a82B0381bD884540c2235147c13B97fe6) {
    }
```
