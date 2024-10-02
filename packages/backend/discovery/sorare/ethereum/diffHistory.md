Generated with discovered.json: 0x5f848ce72b18cb1da3565c6fc481af80ceab9655

# Diff at Tue, 01 Oct 2024 10:55:30 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bd754dc73c66120164006054f8d25c5fae9cd910 block: 19825381
- current block number: 19825381

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19825381 (main branch discovery), not current.

```diff
    contract StarkExchange (0xF5C9F957705bea56a7e806943f98F7777B995826) {
    +++ description: None
      values.$pastUpgrades:
+        [["2021-07-15T12:35:27.000Z",["0xB8563AD5aF1F79dd04937BE8B572318c8e6f43AC","0xF65C115efd24102315Af53f84aD65aD240bc9D57","0x97AA9658cfE27D6382b71FF9E72d773615Bd529E","0x86d8f977C9cEC503ad4E6805802cEf62Cde13773","0x0D7c8d7A16c7832869d8FeEf02730238CdFe083A","0x2D542881E93491e765E5110c1e373FC2968E720A","0x970d1Fa79c64b256ef68bBFEab34137786811C7F"]],["2021-09-05T10:29:04.000Z",["0xB8563AD5aF1F79dd04937BE8B572318c8e6f43AC","0xF65C115efd24102315Af53f84aD65aD240bc9D57","0x97AA9658cfE27D6382b71FF9E72d773615Bd529E","0x86d8f977C9cEC503ad4E6805802cEf62Cde13773","0x0D7c8d7A16c7832869d8FeEf02730238CdFe083A","0x2D542881E93491e765E5110c1e373FC2968E720A","0x970d1Fa79c64b256ef68bBFEab34137786811C7F"]],["2021-09-05T21:56:06.000Z",["0xB8563AD5aF1F79dd04937BE8B572318c8e6f43AC","0xF65C115efd24102315Af53f84aD65aD240bc9D57","0x97AA9658cfE27D6382b71FF9E72d773615Bd529E","0x86d8f977C9cEC503ad4E6805802cEf62Cde13773","0x0D7c8d7A16c7832869d8FeEf02730238CdFe083A","0x2D542881E93491e765E5110c1e373FC2968E720A","0x970d1Fa79c64b256ef68bBFEab34137786811C7F"]],["2021-12-06T14:14:16.000Z",["0x4EDD62189732e9fF476ABa880b48c29432A7AC9B","0x62BCA4DB742A99c834e2c24b609656A70EA25379","0x8536850750956c2FEebeCAB786d82271a5467687","0x1c3A4EfF75a287Fe6249CAb49606FA25659929A2","0x3799ad2a4Eb4E882219B02C036656d4ECbD437A1","0x1688abB0B5c72F34B7f78e857Aa317deD5B5D339","0xB3788a88F063B217227E27ae16Ba550db3132bE6"]],["2021-12-19T09:58:01.000Z",["0x4EDD62189732e9fF476ABa880b48c29432A7AC9B","0x62BCA4DB742A99c834e2c24b609656A70EA25379","0x8536850750956c2FEebeCAB786d82271a5467687","0x1c3A4EfF75a287Fe6249CAb49606FA25659929A2","0x3799ad2a4Eb4E882219B02C036656d4ECbD437A1","0x1688abB0B5c72F34B7f78e857Aa317deD5B5D339","0xB3788a88F063B217227E27ae16Ba550db3132bE6"]],["2022-01-05T20:34:03.000Z",["0x4EDD62189732e9fF476ABa880b48c29432A7AC9B","0x62BCA4DB742A99c834e2c24b609656A70EA25379","0x8536850750956c2FEebeCAB786d82271a5467687","0x1c3A4EfF75a287Fe6249CAb49606FA25659929A2","0x3799ad2a4Eb4E882219B02C036656d4ECbD437A1","0x1688abB0B5c72F34B7f78e857Aa317deD5B5D339","0xB3788a88F063B217227E27ae16Ba550db3132bE6"]],["2022-09-08T22:38:37.000Z",["0x4EDD62189732e9fF476ABa880b48c29432A7AC9B","0x62BCA4DB742A99c834e2c24b609656A70EA25379","0x8536850750956c2FEebeCAB786d82271a5467687","0x1c3A4EfF75a287Fe6249CAb49606FA25659929A2","0x3799ad2a4Eb4E882219B02C036656d4ECbD437A1","0x1688abB0B5c72F34B7f78e857Aa317deD5B5D339","0xB3788a88F063B217227E27ae16Ba550db3132bE6"]],["2023-03-13T09:40:23.000Z",["0x4EDD62189732e9fF476ABa880b48c29432A7AC9B","0x62BCA4DB742A99c834e2c24b609656A70EA25379","0x8536850750956c2FEebeCAB786d82271a5467687","0x1c3A4EfF75a287Fe6249CAb49606FA25659929A2","0x3799ad2a4Eb4E882219B02C036656d4ECbD437A1","0x1688abB0B5c72F34B7f78e857Aa317deD5B5D339","0xB3788a88F063B217227E27ae16Ba550db3132bE6"]],["2023-03-13T11:06:35.000Z",["0xdF2f24751F7e84ccDCD39e7b49904FAB0Fb0f583","0xfbea22FeB369DB10C0d3a2aAa8F4939E76815f12","0x2Dbc18A3ac126abE1fF90A83Bbc3947ff7912Afb","0x67e198743BC19fa4757720eDd0e769f8291e1F1D","0x613ee54C54D5548627064B4D648942bF3648f376","0xb2ED005D0278179001a49a9969BB22BA8e98f31F","0xB5353268d8d4D711a92cb838F8fEDFC2A66E50Db"]],["2023-03-15T11:55:47.000Z",["0xdF2f24751F7e84ccDCD39e7b49904FAB0Fb0f583","0xfbea22FeB369DB10C0d3a2aAa8F4939E76815f12","0x2Dbc18A3ac126abE1fF90A83Bbc3947ff7912Afb","0x67e198743BC19fa4757720eDd0e769f8291e1F1D","0x613ee54C54D5548627064B4D648942bF3648f376","0xb2ED005D0278179001a49a9969BB22BA8e98f31F","0xB5353268d8d4D711a92cb838F8fEDFC2A66E50Db"]],["2023-04-09T08:13:35.000Z",["0xdF2f24751F7e84ccDCD39e7b49904FAB0Fb0f583","0xfbea22FeB369DB10C0d3a2aAa8F4939E76815f12","0x2Dbc18A3ac126abE1fF90A83Bbc3947ff7912Afb","0x67e198743BC19fa4757720eDd0e769f8291e1F1D","0x613ee54C54D5548627064B4D648942bF3648f376","0xb2ED005D0278179001a49a9969BB22BA8e98f31F","0xB5353268d8d4D711a92cb838F8fEDFC2A66E50Db"]]]
      values.$upgradeCount:
+        11
    }
```

Generated with discovered.json: 0x3176c16108faf976af48414d7ea20a898ca14509

# Diff at Fri, 30 Aug 2024 08:01:06 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@6c1bd1f41fadf5f2cb1c1805b5a2c6138a3ed35a block: 19825381
- current block number: 19825381

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19825381 (main branch discovery), not current.

```diff
    contract GnosisSafe (0xCc928977e4a75d25099e7DA7B6Fd79Dac2f9fD2B) {
    +++ description: None
      receivedPermissions.0.via:
-        []
    }
```

Generated with discovered.json: 0xe2c0ead4c004895b10243ab9c395650acc346721

# Diff at Wed, 21 Aug 2024 10:05:59 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@2f6dde3357bf5d79196b6e94f79d853a6c4ec72b block: 19825381
- current block number: 19825381

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19825381 (main branch discovery), not current.

```diff
    contract GnosisSafe (0xCc928977e4a75d25099e7DA7B6Fd79Dac2f9fD2B) {
    +++ description: None
      assignedPermissions:
-        {"upgrade":["0xF5C9F957705bea56a7e806943f98F7777B995826"]}
      receivedPermissions:
+        [{"permission":"upgrade","target":"0xF5C9F957705bea56a7e806943f98F7777B995826","via":[]}]
    }
```

```diff
    contract StarkExchange (0xF5C9F957705bea56a7e806943f98F7777B995826) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x5918481F777dBe437De249492B90AffB4e655de4","via":[]},{"permission":"upgrade","target":"0xCc928977e4a75d25099e7DA7B6Fd79Dac2f9fD2B","via":[]}]
    }
```

Generated with discovered.json: 0xe5ece2e9f5ffb282153154a14ce8ec8b44dfdc3c

# Diff at Fri, 09 Aug 2024 10:12:23 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f0da1d0aab7bc6b3b5e54e7e93480bd98e57035 block: 19825381
- current block number: 19825381

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19825381 (main branch discovery), not current.

```diff
    contract GnosisSafe (0xCc928977e4a75d25099e7DA7B6Fd79Dac2f9fD2B) {
    +++ description: None
      assignedPermissions.admin:
-        ["0xF5C9F957705bea56a7e806943f98F7777B995826"]
      assignedPermissions.upgrade:
+        ["0xF5C9F957705bea56a7e806943f98F7777B995826"]
      values.$multisigThreshold:
-        "2 of 3 (67%)"
      values.getOwners:
-        ["0x0405107a60391Eb51821be373ff978115Ee58488","0xd38831Bcb40bdEE0577Ee064112Fa77a38cAd3F8","0x59232aC80E6d403b6381393e52f4665ECA328558"]
      values.getThreshold:
-        2
      values.$members:
+        ["0x0405107a60391Eb51821be373ff978115Ee58488","0xd38831Bcb40bdEE0577Ee064112Fa77a38cAd3F8","0x59232aC80E6d403b6381393e52f4665ECA328558"]
      values.$threshold:
+        2
      values.multisigThreshold:
+        "2 of 3 (67%)"
    }
```

Generated with discovered.json: 0x5997a7007bc82890b897625d799a049dfc967bbc

# Diff at Thu, 18 Jul 2024 10:33:42 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@d89fe52cb65d643cef712d1d7910564a7acf2dce block: 19825381
- current block number: 19825381

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19825381 (main branch discovery), not current.

```diff
    contract GnosisSafe (0xCc928977e4a75d25099e7DA7B6Fd79Dac2f9fD2B) {
    +++ description: None
      assignedPermissions:
+        {"admin":["0xF5C9F957705bea56a7e806943f98F7777B995826"]}
    }
```

Generated with discovered.json: 0xe1e57471108cba8fef54c3e5b37e123b2f2601ae

# Diff at Wed, 08 May 2024 12:36:41 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@7eb116053a3dfe1dcff4cde0b8b45a07198fbab8 block: 19624875
- current block number: 19825381

## Description

Provide description of changes. This section will be preserved.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19624875 (main branch discovery), not current.

```diff
    contract StarkExchange (0xF5C9F957705bea56a7e806943f98F7777B995826) {
    +++ description: None
      values.getRegisteredAvailabilityVerifiers:
-        "0x879cD57975d596004863D30c59d579ef78BBbe32"
+        ["0x879cD57975d596004863D30c59d579ef78BBbe32"]
      values.getRegisteredVerifiers:
-        "0xbcc17446B99465fF01E6816d9bcb2d8b1D7cEdB1"
+        ["0xbcc17446B99465fF01E6816d9bcb2d8b1D7cEdB1"]
    }
```

Generated with discovered.json: 0x8802eb4ba9b21d4d40b220a280fa7f5d41020b63

# Diff at Wed, 10 Apr 2024 11:17:20 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@ee07d1cb2dc09651ee4b52c49bb3ad20765aa9f3 block: 19532199
- current block number: 19624875

## Description

Provide description of changes. This section will be preserved.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19532199 (main branch discovery), not current.

```diff
    contract StarkExchange (0xF5C9F957705bea56a7e806943f98F7777B995826) {
    +++ description: None
      values.getRegisteredAvailabilityVerifiers:
-        ["0x879cD57975d596004863D30c59d579ef78BBbe32"]
+        "0x879cD57975d596004863D30c59d579ef78BBbe32"
      values.getRegisteredVerifiers:
-        ["0xbcc17446B99465fF01E6816d9bcb2d8b1D7cEdB1"]
+        "0xbcc17446B99465fF01E6816d9bcb2d8b1D7cEdB1"
    }
```

Generated with discovered.json: 0xe8d8e3d4b8d168bfd406a7b9c31e4c9230626381

# Diff at Thu, 28 Mar 2024 11:06:07 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@21187e63b9b90823a55c461c331868a470ce17eb block: 17412704
- current block number: 19532199

## Description

Update discovery to include the multisig threshold.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 17412704 (main branch discovery), not current.

```diff
    contract GnosisSafe (0xCc928977e4a75d25099e7DA7B6Fd79Dac2f9fD2B) {
    +++ description: None
      upgradeability.threshold:
+        "2 of 3 (67%)"
    }
```

Generated with discovered.json: 0x67d53290cfc3cda8c8abe277975b804ba4a48718
