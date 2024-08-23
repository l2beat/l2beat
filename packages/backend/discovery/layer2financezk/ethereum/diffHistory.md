Generated with discovered.json: 0xd3eaabbb4763320932e56146ee3fb36564e26929

# Diff at Wed, 21 Aug 2024 10:03:35 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@2f6dde3357bf5d79196b6e94f79d853a6c4ec72b block: 19825376
- current block number: 19825376

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19825376 (main branch discovery), not current.

```diff
    contract Proxy (0x82123571C8a5e0910280C066bc634c4945FFcbC8) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x1E153596BceB29c6EAE88DDB290eBeCC3FE9735e","via":[]}]
    }
```

Generated with discovered.json: 0xbb775aaa070df2e5dc9f52e355e6512e11324786

# Diff at Wed, 08 May 2024 12:35:38 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@7eb116053a3dfe1dcff4cde0b8b45a07198fbab8 block: 19624862
- current block number: 19825376

## Description

Provide description of changes. This section will be preserved.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19624862 (main branch discovery), not current.

```diff
    contract Proxy (0x82123571C8a5e0910280C066bc634c4945FFcbC8) {
    +++ description: None
      values.getRegisteredAvailabilityVerifiers:
-        "0xF000A3B10e1920aDC6e7D829828e3357Fc5128A9"
+        ["0xF000A3B10e1920aDC6e7D829828e3357Fc5128A9"]
      values.getRegisteredVerifiers:
-        "0x6e3AbCE72A3CD5edc05E59283c733Fd4bF8B3baE"
+        ["0x6e3AbCE72A3CD5edc05E59283c733Fd4bF8B3baE"]
    }
```

Generated with discovered.json: 0x8870dd93175a25008b5b4d8cdbdd6c0f52c7daf0

# Diff at Wed, 10 Apr 2024 11:14:53 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@ee07d1cb2dc09651ee4b52c49bb3ad20765aa9f3 block: 19377139
- current block number: 19624862

## Description

Provide description of changes. This section will be preserved.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19377139 (main branch discovery), not current.

```diff
    contract Proxy (0x82123571C8a5e0910280C066bc634c4945FFcbC8) {
    +++ description: None
      values.getRegisteredAvailabilityVerifiers:
-        ["0xF000A3B10e1920aDC6e7D829828e3357Fc5128A9"]
+        "0xF000A3B10e1920aDC6e7D829828e3357Fc5128A9"
      values.getRegisteredVerifiers:
-        ["0x6e3AbCE72A3CD5edc05E59283c733Fd4bF8B3baE"]
+        "0x6e3AbCE72A3CD5edc05E59283c733Fd4bF8B3baE"
    }
```

Generated with discovered.json: 0xd7108783da2a0cec47eff8ee73ebc035214c4b83

# Diff at Wed, 06 Mar 2024 15:51:04 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@cea88c5f3ff85fed5d72dadc72ae50315d0808d6 block: 19063883
- current block number: 19377139

## Description

Added the SHARP shared module.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19063883 (main branch discovery), not current.

```diff
-   Status: DELETED
    contract GnosisSafe (0x21F9eC47b19d95b5C2DDFB6Ae5D4F92fAdacAEc4)
    +++ description: None
```

```diff
-   Status: DELETED
    contract CallProxy (0x47312450B3Ac8b5b8e247a6bB6d523e7605bDb60)
    +++ description: None
```

```diff
-   Status: DELETED
    contract GpsStatementVerifier (0x6cB3EE90C50a38A0e4662bB7e7E6e40B91361BF6)
    +++ description: None
```

Generated with discovered.json: 0x75fe583cc3f5511ef36eaeced90122de19527810
