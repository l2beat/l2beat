Generated with discovered.json: 0x0bcc3684cc768af8d5070fff05e5f19f0538f221

# Diff at Mon, 20 Jan 2025 11:09:40 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@2c8b4f3d9910bb6371be9b4df87b70856e7d8c64 block: 19825376
- current block number: 19825376

## Description

Rerun on the same block number. Applies fixes to permissions and via field. Renames permission's target to to/from.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19825376 (main branch discovery), not current.

```diff
    contract Proxy (0x82123571C8a5e0910280C066bc634c4945FFcbC8) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x1E153596BceB29c6EAE88DDB290eBeCC3FE9735e"
      issuedPermissions.0.to:
+        "0x1E153596BceB29c6EAE88DDB290eBeCC3FE9735e"
    }
```

Generated with discovered.json: 0xb56ed70b923c0a2ed22dc5d1b0f34083c193a01a

# Diff at Wed, 04 Dec 2024 14:14:24 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@5ce1f4558272638b4ce9e4501463a3fa3ee115cb block: 19825376
- current block number: 19825376

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19825376 (main branch discovery), not current.

```diff
    contract Committee (0xF000A3B10e1920aDC6e7D829828e3357Fc5128A9) {
    +++ description: None
      name:
-        ""
+        "Committee"
    }
```

```diff
+   Status: CREATED
    contract StrategyCompound (0x5b000954F70B0410685193B0afd3074B744B5C97)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Comp (0xc00e94Cb662C3520282E6f5717214004A7f26888)
    +++ description: None
```

Generated with discovered.json: 0x97311829fba2addaf36879b5132f3914016d29a4

# Diff at Mon, 21 Oct 2024 11:07:00 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@8895d33866f5665c4c710f4ddaa32bfa63cc3c78 block: 19825376
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
      values.$pastUpgrades.1.2:
+        ["0x4EDD62189732e9fF476ABa880b48c29432A7AC9B","0x62BCA4DB742A99c834e2c24b609656A70EA25379","0x8536850750956c2FEebeCAB786d82271a5467687","0x1c3A4EfF75a287Fe6249CAb49606FA25659929A2","0x3799ad2a4Eb4E882219B02C036656d4ECbD437A1","0x1688abB0B5c72F34B7f78e857Aa317deD5B5D339","0xB3788a88F063B217227E27ae16Ba550db3132bE6"]
      values.$pastUpgrades.1.1:
-        ["0x4EDD62189732e9fF476ABa880b48c29432A7AC9B","0x62BCA4DB742A99c834e2c24b609656A70EA25379","0x8536850750956c2FEebeCAB786d82271a5467687","0x1c3A4EfF75a287Fe6249CAb49606FA25659929A2","0x3799ad2a4Eb4E882219B02C036656d4ECbD437A1","0x1688abB0B5c72F34B7f78e857Aa317deD5B5D339","0xB3788a88F063B217227E27ae16Ba550db3132bE6"]
+        "0x880c2620a1b1c1bc539b81f1533ca188c76cc94cfc5288bd1f19af042ea51805"
      values.$pastUpgrades.0.2:
+        ["0x4EDD62189732e9fF476ABa880b48c29432A7AC9B","0x62BCA4DB742A99c834e2c24b609656A70EA25379","0x8536850750956c2FEebeCAB786d82271a5467687","0x1c3A4EfF75a287Fe6249CAb49606FA25659929A2","0x3799ad2a4Eb4E882219B02C036656d4ECbD437A1","0x1688abB0B5c72F34B7f78e857Aa317deD5B5D339","0xB3788a88F063B217227E27ae16Ba550db3132bE6"]
      values.$pastUpgrades.0.1:
-        ["0x4EDD62189732e9fF476ABa880b48c29432A7AC9B","0x62BCA4DB742A99c834e2c24b609656A70EA25379","0x8536850750956c2FEebeCAB786d82271a5467687","0x1c3A4EfF75a287Fe6249CAb49606FA25659929A2","0x3799ad2a4Eb4E882219B02C036656d4ECbD437A1","0x1688abB0B5c72F34B7f78e857Aa317deD5B5D339","0xB3788a88F063B217227E27ae16Ba550db3132bE6"]
+        "0xc1986fcfa9adba1076e31573ea760b1b64e5dca5954623c3306f7f90f76fd3f9"
    }
```

Generated with discovered.json: 0xaa006de0251bb868d6a21e7c4b9968c755083eee

# Diff at Mon, 14 Oct 2024 10:52:15 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1afc77ff111ceb0970e7d09efcc7b2f376b0c281 block: 19825376
- current block number: 19825376

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19825376 (main branch discovery), not current.

```diff
    contract OrderRegistry (0x518c4A79a1102eEDc987005CA8cE6B87Ca14dDf8) {
    +++ description: None
      sourceHashes:
+        ["0x1e28fda3c245bc1fc13d0ddc7b108be510d1e0220fc67552921c87724bb45a4c"]
    }
```

```diff
    contract GpsFactRegistryAdapter (0x6e3AbCE72A3CD5edc05E59283c733Fd4bF8B3baE) {
    +++ description: None
      sourceHashes:
+        ["0x3c0fff412189244728e9be021e2c7a1084326cc80e71f930221094909caafec0"]
    }
```

```diff
    contract Proxy (0x82123571C8a5e0910280C066bc634c4945FFcbC8) {
    +++ description: None
      sourceHashes:
+        ["0x87045c081a3bd84c271153c36a9a503f84bc3035077d34144332c329d3fcb92d","0x54407214d4211e41ecb742c3df7564e352844c1f5da38ef2e206b0465bd5345b","0x497eebe95d8d7611823ffcb6cc098a9c3c71e91941026f2b4c4989d6f9fa944d","0x452c4b92e2f090f2979fe1dec4ee28bf8b9c431b96b67966a3c2279f9e332684","0xf615d0291aa23f36d8cb749e3950b549d57d38bfef0c342331d0cedd7d769026","0x7e358cdedbf8af25ae12a5fe965db091c7751aafa68c2460ab43e81a8eb364b9","0x105353ea24f9e10459c2487f227bc285c4ca2317fac8e12a8b936bc92329aea5","0x93b21bfbef09c4e60d6a17309877245220508c54478159a8f2b9dbfb60576c4b"]
    }
```

```diff
    contract Broker (0xe7c753895d492f8D4B06a2A1B16c1aEF2A7d16E5) {
    +++ description: None
      sourceHashes:
+        ["0xd9040d82f39aa8ff258f35b318bdf0fc513f4d8844c61c34f6c8ce81eee40b55"]
    }
```

Generated with discovered.json: 0x883c47f0499e60a075ba35d86b371a3c01066741

# Diff at Tue, 01 Oct 2024 10:51:59 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bd754dc73c66120164006054f8d25c5fae9cd910 block: 19825376
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
      values.$pastUpgrades:
+        [["2022-02-17T20:46:14.000Z",["0x4EDD62189732e9fF476ABa880b48c29432A7AC9B","0x62BCA4DB742A99c834e2c24b609656A70EA25379","0x8536850750956c2FEebeCAB786d82271a5467687","0x1c3A4EfF75a287Fe6249CAb49606FA25659929A2","0x3799ad2a4Eb4E882219B02C036656d4ECbD437A1","0x1688abB0B5c72F34B7f78e857Aa317deD5B5D339","0xB3788a88F063B217227E27ae16Ba550db3132bE6"]],["2022-04-25T08:12:19.000Z",["0x4EDD62189732e9fF476ABa880b48c29432A7AC9B","0x62BCA4DB742A99c834e2c24b609656A70EA25379","0x8536850750956c2FEebeCAB786d82271a5467687","0x1c3A4EfF75a287Fe6249CAb49606FA25659929A2","0x3799ad2a4Eb4E882219B02C036656d4ECbD437A1","0x1688abB0B5c72F34B7f78e857Aa317deD5B5D339","0xB3788a88F063B217227E27ae16Ba550db3132bE6"]]]
      values.$upgradeCount:
+        2
    }
```

Generated with discovered.json: 0x5b46b0bac040963e6884bb01007ce3b4986aabbc

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
