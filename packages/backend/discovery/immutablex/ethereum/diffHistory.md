Generated with discovered.json: 0x66e296fcba60207fe34e533ae394f0880475e2f6

# Diff at Mon, 20 May 2024 09:34:20 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@7e20051208df39f6d4f6d35a22cb1356bd1b211c block: 19825366
- current block number: 19910271

## Description

Starkex diamond contracts are upgraded to [version 4.0.1](https://github.com/starkware-libs/starkex-contracts/releases).

- Removed the need to register users (Registration is now only required for deposit cancellation and escape flows.)
- Slight change to the way the hash message for on-chain registration is calculated.

### AllVerifiers.2.sol

- formatting
- uncheckedTokenContractCall() removed

### TokensAndRamping.3.sol

Change to the way the hash message for on-chain registration is calculated. (ownerKey vs ethKey)

- formatting
- withdrawTo(), withdrawNftTo(), is now withdraw(), withdrawNft()
- EllipticCurve lib added
- registerUser() is now registerAdddress() and using `ECDSA.verify`
- starkKey is now ownerKey

### Other diamond facets

- formatting and minor changes

### DepositCancelDelay

- Reduced from 3 days to 2 days.

## Watched changes

```diff
    contract StarkExchange (0x5FDCCA53617f4d2b9134B29090C87D01058e27e9) {
    +++ description: None
      upgradeability.implementation:
-        "0xB8563AD5aF1F79dd04937BE8B572318c8e6f43AC"
+        "0x4EDD62189732e9fF476ABa880b48c29432A7AC9B"
      upgradeability.facets.StarkWare_AllVerifiers_2020_1:
-        "0xF65C115efd24102315Af53f84aD65aD240bc9D57"
+        "0x62BCA4DB742A99c834e2c24b609656A70EA25379"
      upgradeability.facets.StarkWare_TokensAndRamping_2020_1:
-        "0x97AA9658cfE27D6382b71FF9E72d773615Bd529E"
+        "0x8536850750956c2FEebeCAB786d82271a5467687"
      upgradeability.facets.StarkWare_StarkExState_2021_1:
-        "0x86d8f977C9cEC503ad4E6805802cEf62Cde13773"
+        "0x1c3A4EfF75a287Fe6249CAb49606FA25659929A2"
      upgradeability.facets.StarkWare_ForcedActions_2020_1:
-        "0x0D7c8d7A16c7832869d8FeEf02730238CdFe083A"
+        "0x3799ad2a4Eb4E882219B02C036656d4ECbD437A1"
      upgradeability.facets.StarkWare_OnchainVaults_2021_1:
-        "0x2D542881E93491e765E5110c1e373FC2968E720A"
+        "0x1688abB0B5c72F34B7f78e857Aa317deD5B5D339"
      upgradeability.facets.StarkWare_ProxyUtils_2021_1:
-        "0x970d1Fa79c64b256ef68bBFEab34137786811C7F"
+        "0xB3788a88F063B217227E27ae16Ba550db3132bE6"
      implementations.6:
-        "0x970d1Fa79c64b256ef68bBFEab34137786811C7F"
+        "0xB3788a88F063B217227E27ae16Ba550db3132bE6"
      implementations.5:
-        "0x2D542881E93491e765E5110c1e373FC2968E720A"
+        "0x1688abB0B5c72F34B7f78e857Aa317deD5B5D339"
      implementations.4:
-        "0x0D7c8d7A16c7832869d8FeEf02730238CdFe083A"
+        "0x3799ad2a4Eb4E882219B02C036656d4ECbD437A1"
      implementations.3:
-        "0x86d8f977C9cEC503ad4E6805802cEf62Cde13773"
+        "0x1c3A4EfF75a287Fe6249CAb49606FA25659929A2"
      implementations.2:
-        "0x97AA9658cfE27D6382b71FF9E72d773615Bd529E"
+        "0x8536850750956c2FEebeCAB786d82271a5467687"
      implementations.1:
-        "0xF65C115efd24102315Af53f84aD65aD240bc9D57"
+        "0x62BCA4DB742A99c834e2c24b609656A70EA25379"
      implementations.0:
-        "0xB8563AD5aF1F79dd04937BE8B572318c8e6f43AC"
+        "0x4EDD62189732e9fF476ABa880b48c29432A7AC9B"
+++ description: The time delay required before canceled deposits to the L2 can be reclaimed.
      values.DEPOSIT_CANCEL_DELAY:
-        259200
+        172800
      values.implementation:
-        "0xB8563AD5aF1F79dd04937BE8B572318c8e6f43AC"
+        "0x4EDD62189732e9fF476ABa880b48c29432A7AC9B"
      values.VERSION:
-        "3.0.3"
+        "4.0.1"
    }
```

## Source code changes

```diff
.../StarkExchange/AllVerifiers.2.sol               |  301 ++---
 .../StarkExchange/ForcedActions.5.sol              |  291 ++---
 .../StarkExchange/OnchainVaults.6.sol              |  349 +++---
 .../StarkExchange/ProxyUtils.7.sol                 |  124 +-
 .../StarkExchange/StarkExState.4.sol               |  631 ++++------
 .../StarkExchange/StarkExchange.1.sol              |  272 ++---
 .../StarkExchange/TokensAndRamping.3.sol           | 1245 ++++++++++++--------
 7 files changed, 1565 insertions(+), 1648 deletions(-)
```

Generated with discovered.json: 0x8a763974559283af9b7c5b24360ce3bc57897fa7

# Diff at Wed, 08 May 2024 12:33:48 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@7eb116053a3dfe1dcff4cde0b8b45a07198fbab8 block: 19624857
- current block number: 19825366

## Description

Provide description of changes. This section will be preserved.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19624857 (main branch discovery), not current.

```diff
    contract StarkExchange (0x5FDCCA53617f4d2b9134B29090C87D01058e27e9) {
    +++ description: None
      values.getRegisteredAvailabilityVerifiers:
-        "0x16BA0f221664A5189cf2C1a7AF0d3AbFc70aA295"
+        ["0x16BA0f221664A5189cf2C1a7AF0d3AbFc70aA295"]
      values.getRegisteredVerifiers:
-        "0x6e3AbCE72A3CD5edc05E59283c733Fd4bF8B3baE"
+        ["0x6e3AbCE72A3CD5edc05E59283c733Fd4bF8B3baE"]
    }
```

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
