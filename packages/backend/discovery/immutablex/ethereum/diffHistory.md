Generated with discovered.json: 0x7e2b16f28a98ef801db7980deb7a3a2b67443f77

# Diff at Wed, 10 Apr 2024 11:13:38 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@ee07d1cb2dc09651ee4b52c49bb3ad20765aa9f3 block: 19531600
- current block number: 19624857

## Description

Provide description of changes. This section will be preserved.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19531600 (main branch discovery), not current.

```diff
    contract StarkExchange (0x5FDCCA53617f4d2b9134B29090C87D01058e27e9) {
    +++ description: None
      values.getRegisteredAvailabilityVerifiers:
-        ["0x16BA0f221664A5189cf2C1a7AF0d3AbFc70aA295"]
+        "0x16BA0f221664A5189cf2C1a7AF0d3AbFc70aA295"
      values.getRegisteredVerifiers:
-        ["0x6e3AbCE72A3CD5edc05E59283c733Fd4bF8B3baE"]
+        "0x6e3AbCE72A3CD5edc05E59283c733Fd4bF8B3baE"
    }
```

Generated with discovered.json: 0x53e73e587add20d50b8d83a526d3972896bd2f2e

# Diff at Thu, 28 Mar 2024 09:04:54 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@867de6120241d47b66bf76f83c490408eb3595b0 block: 18263193
- current block number: 19531600

## Description

Update discovery to include the multisig threshold.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 18263193 (main branch discovery), not current.

```diff
    contract ProxyGovernanceMultisig (0x9C41deab42Bae7c0ec4DB3cECc0faD86F4D6EC91) {
    +++ description: None
      upgradeability.threshold:
+        "2 of 3 (67%)"
    }
```

Generated with discovered.json: 0xc73beedc2abdbc04f79f75ef808ea7a26804e89f

# Diff at Mon, 02 Oct 2023 13:37:55 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@10dbc30af490bd7af5cfca51b827ce3f10182f4d

## Watched changes

```diff
    contract GnosisSafe (0x9C41deab42Bae7c0ec4DB3cECc0faD86F4D6EC91) {
      name:
-        "GnosisSafe"
+        "ProxyGovernanceMultisig"
      derivedName:
+        "GnosisSafe"
    }
```
