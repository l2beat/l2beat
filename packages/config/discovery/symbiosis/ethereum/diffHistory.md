Generated with discovered.json: 0x838ebf410eb324710dbd9191233b58113f4beef9

# Diff at Tue, 11 Mar 2025 09:21:13 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@0b012a6e8cdfbbeee0ff5077be6231e8c6bed55f block: 21141679
- current block number: 22022451

## Description

Ignore mpc relatives.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21141679 (main branch discovery), not current.

```diff
-   Status: DELETED
    contract undefined (0xaF4A61f99306Be8dFE69a1e369e5f8480Ea3687A)
    +++ description: None
```

```diff
-   Status: DELETED
    contract undefined (0xeAc9340AE80c2d62E4e9b1A137eFb23Fa53a9A03)
    +++ description: None
```

Generated with discovered.json: 0x3c6fb80e779e201739672b78f2bf2133abf24dc6

# Diff at Tue, 04 Mar 2025 10:40:06 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@98d260b45fe0d2195ce5e629bd7b200c8706e8ba block: 21141679
- current block number: 21141679

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21141679 (main branch discovery), not current.

```diff
    contract ProxyAdminBridgeV2 (0x1Da522B35363c1eda4833bc121c8F3c67B2caa75) {
    +++ description: None
      sinceBlock:
+        15966435
    }
```

```diff
    contract ProxyAdminBridge (0x3901611dfDA3Aed75C37Ba59f2c76E8309dc98FA) {
    +++ description: None
      sinceBlock:
+        14138782
    }
```

```diff
    contract Multisig (0x5112EbA9bc2468Bb5134CBfbEAb9334EdaE7106a) {
    +++ description: None
      sinceBlock:
+        15966902
    }
```

```diff
    contract BridgeV2 (0x5523985926Aa12BA58DC5Ad00DDca99678D7227E) {
    +++ description: None
      sinceBlock:
+        15966436
    }
```

```diff
    contract Portal (0xb8f275fBf7A959F4BCE59999A2EF122A099e81A8) {
    +++ description: None
      sinceBlock:
+        15966438
    }
```

```diff
    contract Bridge (0xd5F0f8dB993D26F5df89E70a83d32b369DcCdaa0) {
    +++ description: None
      sinceBlock:
+        14138783
    }
```

```diff
    contract MetaRouter (0xf621Fb08BBE51aF70e7E0F4EA63496894166Ff7F) {
    +++ description: None
      sinceBlock:
+        18818464
    }
```

```diff
    contract MetaRouterGateway (0xfCEF2Fe72413b65d3F393d278A714caD87512bcd) {
    +++ description: None
      sinceBlock:
+        18818464
    }
```

Generated with discovered.json: 0xb98051aa6dfb09d41128460a4693d5dff53ad7cc

# Diff at Mon, 20 Jan 2025 11:10:15 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@2c8b4f3d9910bb6371be9b4df87b70856e7d8c64 block: 21141679
- current block number: 21141679

## Description

Rerun on the same block number. Applies fixes to permissions and via field. Renames permission's target to to/from.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21141679 (main branch discovery), not current.

```diff
    contract ProxyAdminBridgeV2 (0x1Da522B35363c1eda4833bc121c8F3c67B2caa75) {
    +++ description: None
      receivedPermissions.1.target:
-        "0xb8f275fBf7A959F4BCE59999A2EF122A099e81A8"
      receivedPermissions.1.from:
+        "0xb8f275fBf7A959F4BCE59999A2EF122A099e81A8"
      receivedPermissions.0.target:
-        "0x5523985926Aa12BA58DC5Ad00DDca99678D7227E"
      receivedPermissions.0.from:
+        "0x5523985926Aa12BA58DC5Ad00DDca99678D7227E"
    }
```

```diff
    contract ProxyAdminBridge (0x3901611dfDA3Aed75C37Ba59f2c76E8309dc98FA) {
    +++ description: None
      receivedPermissions.0.target:
-        "0xd5F0f8dB993D26F5df89E70a83d32b369DcCdaa0"
      receivedPermissions.0.from:
+        "0xd5F0f8dB993D26F5df89E70a83d32b369DcCdaa0"
    }
```

```diff
    contract BridgeV2 (0x5523985926Aa12BA58DC5Ad00DDca99678D7227E) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x1Da522B35363c1eda4833bc121c8F3c67B2caa75"
      issuedPermissions.0.to:
+        "0x1Da522B35363c1eda4833bc121c8F3c67B2caa75"
    }
```

```diff
    contract Portal (0xb8f275fBf7A959F4BCE59999A2EF122A099e81A8) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x1Da522B35363c1eda4833bc121c8F3c67B2caa75"
      issuedPermissions.0.to:
+        "0x1Da522B35363c1eda4833bc121c8F3c67B2caa75"
    }
```

```diff
    contract Bridge (0xd5F0f8dB993D26F5df89E70a83d32b369DcCdaa0) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x3901611dfDA3Aed75C37Ba59f2c76E8309dc98FA"
      issuedPermissions.0.to:
+        "0x3901611dfDA3Aed75C37Ba59f2c76E8309dc98FA"
    }
```

Generated with discovered.json: 0x34ca46c540a999679bd18ed01781f63385889021

# Diff at Fri, 08 Nov 2024 08:19:03 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@53988239f42edde0275ed92d8f3ada4279354f7d block: 19532236
- current block number: 21141679

## Description

Minor Portal upgrade allowing to change the WETH contract reference and removing two sToken functions for the local chain.

## Watched changes

```diff
    contract Portal (0xb8f275fBf7A959F4BCE59999A2EF122A099e81A8) {
    +++ description: None
      sourceHashes.1:
-        "0x4754c4887d8e1782eeead45b2652e3639e4887315d18aaac0050cbcdbdf3a0fa"
+        "0x8c47d485b7d202eb666ef592012502f811cc91f1337393dbfd3411b67dea3580"
      values.$implementation:
-        "0x326adbE46D7E6C1B3927e9309B96DF478bda6D16"
+        "0x755a967298c96d50216C6ED8D68869747B4f6878"
      values.$pastUpgrades.6:
+        ["2024-11-06T18:25:35.000Z","0x4ba8c9e82d442fff19bc936ad0a26c1b91025d3d9f321847b9a1b22dab3bc86b",["0x755a967298c96d50216C6ED8D68869747B4f6878"]]
      values.$upgradeCount:
-        6
+        7
    }
```

## Source code changes

```diff
.../{.flat@19532236 => .flat}/Portal/Portal.sol    | 112 ++++-----------------
 1 file changed, 20 insertions(+), 92 deletions(-)
```

Generated with discovered.json: 0x1700256035eb0ccf0c956b8518dec2eba25ff38d

# Diff at Mon, 21 Oct 2024 11:11:14 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@8895d33866f5665c4c710f4ddaa32bfa63cc3c78 block: 19532236
- current block number: 19532236

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19532236 (main branch discovery), not current.

```diff
    contract BridgeV2 (0x5523985926Aa12BA58DC5Ad00DDca99678D7227E) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0x7057aB3fB2BeE9c18e0cDe4240DE4ff7f159E365"]
      values.$pastUpgrades.0.1:
-        ["0x7057aB3fB2BeE9c18e0cDe4240DE4ff7f159E365"]
+        "0x8d70a079e68bae0596cd599d2b50aa56dede90682baecc815c437d8ca845922c"
    }
```

```diff
    contract Portal (0xb8f275fBf7A959F4BCE59999A2EF122A099e81A8) {
    +++ description: None
      values.$pastUpgrades.5.2:
+        ["0x326adbE46D7E6C1B3927e9309B96DF478bda6D16"]
      values.$pastUpgrades.5.1:
-        ["0x326adbE46D7E6C1B3927e9309B96DF478bda6D16"]
+        "0x39b772a5e9ebcd7384b27fa529f91ecf5fc67e6c81740c3540b5bb580287844b"
      values.$pastUpgrades.4.2:
+        ["0x086488E659253FF26D0C743325C059FB57Ca7934"]
      values.$pastUpgrades.4.1:
-        ["0x086488E659253FF26D0C743325C059FB57Ca7934"]
+        "0x99966ad9c454210af91fbcf16132efe59875356423913fc577d3294d01cec23d"
      values.$pastUpgrades.3.2:
+        ["0x8a7F930003BedD63A1ebD99C5917FD6aE7E3dedf"]
      values.$pastUpgrades.3.1:
-        ["0x8a7F930003BedD63A1ebD99C5917FD6aE7E3dedf"]
+        "0xa516cd7be1b5e791cc2841c6bde1983bc0e7cc1d77de772a0cf085ea84146595"
      values.$pastUpgrades.2.2:
+        ["0x1a039cE63AE35a67Bf0E9F6DbFaE969639D59eC8"]
      values.$pastUpgrades.2.1:
-        ["0x1a039cE63AE35a67Bf0E9F6DbFaE969639D59eC8"]
+        "0x5a0e52f0ad8f1b772f6ddfb273f0305b8aa1cb2799a514e5a000f2b478181cca"
      values.$pastUpgrades.1.2:
+        ["0x81aB74A9f9d7457fF47dfD102e78A340cF72EC39"]
      values.$pastUpgrades.1.1:
-        ["0x81aB74A9f9d7457fF47dfD102e78A340cF72EC39"]
+        "0xa27c1953da399d8a96d6bdb83764afce79bb5f39dee68c4097e472e934b184ec"
      values.$pastUpgrades.0.2:
+        ["0xda8057acB94905eb6025120cB2c38415Fd81BfEB"]
      values.$pastUpgrades.0.1:
-        ["0xda8057acB94905eb6025120cB2c38415Fd81BfEB"]
+        "0xa6b0f1f0ceb73f04ad16e77c6e34ae45d66ebfb47bd79bbfb3a6ce3e5225d3ab"
    }
```

```diff
    contract Bridge (0xd5F0f8dB993D26F5df89E70a83d32b369DcCdaa0) {
    +++ description: None
      values.$pastUpgrades.4.2:
+        ["0x61608F9520C311052D88Bc7d0c2c4Cba1c964662"]
      values.$pastUpgrades.4.1:
-        ["0x61608F9520C311052D88Bc7d0c2c4Cba1c964662"]
+        "0x86759bd1988e1fb0afd3d804b79293a471c95b61e5c9d7f4d8c89cbd0a3227aa"
      values.$pastUpgrades.3.2:
+        ["0xa3E661b51e9F6D8577968065D5d0f286553452c6"]
      values.$pastUpgrades.3.1:
-        ["0xa3E661b51e9F6D8577968065D5d0f286553452c6"]
+        "0x5ed6a3a9f80ba301d1b3279efa35695abf0f8a7cf184a9d572f8cb9749ddb149"
      values.$pastUpgrades.2.2:
+        ["0xFC875FbdBaFeCD99FF0D2Cdf3DEF93FfcEc73949"]
      values.$pastUpgrades.2.1:
-        ["0xFC875FbdBaFeCD99FF0D2Cdf3DEF93FfcEc73949"]
+        "0x6120072e1c29fcbef36b984dd51064bffe9fbfb95a40835e8ebd92500f992309"
      values.$pastUpgrades.1.2:
+        ["0x9c13159c5D5903dd07F52f46308Dbd7A6Ea68DB9"]
      values.$pastUpgrades.1.1:
-        ["0x9c13159c5D5903dd07F52f46308Dbd7A6Ea68DB9"]
+        "0x5ca5ffbf5b95c1292438467c25dc4757774cb38b841db82b153c933c1681fc64"
      values.$pastUpgrades.0.2:
+        ["0xFb8aBa430cE64DC038a3078CDcB01A838d7f64b7"]
      values.$pastUpgrades.0.1:
-        ["0xFb8aBa430cE64DC038a3078CDcB01A838d7f64b7"]
+        "0x77271c4c7ee4d81365e45f17f7ef56f136c34267b1f87c8abbe5688e17b7b81f"
    }
```

Generated with discovered.json: 0x5d3639ceb4cb3195913566dc04cf0cfd34ef7bef

# Diff at Mon, 14 Oct 2024 10:56:42 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1afc77ff111ceb0970e7d09efcc7b2f376b0c281 block: 19532236
- current block number: 19532236

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19532236 (main branch discovery), not current.

```diff
    contract ProxyAdminBridgeV2 (0x1Da522B35363c1eda4833bc121c8F3c67B2caa75) {
    +++ description: None
      sourceHashes:
+        ["0x31b987ba8db4fc147856ec1375d9df4f40d58c4dc97e16be5b38ee2e3c3cc6f9"]
    }
```

```diff
    contract ProxyAdminBridge (0x3901611dfDA3Aed75C37Ba59f2c76E8309dc98FA) {
    +++ description: None
      sourceHashes:
+        ["0x31b987ba8db4fc147856ec1375d9df4f40d58c4dc97e16be5b38ee2e3c3cc6f9"]
    }
```

```diff
    contract Multisig (0x5112EbA9bc2468Bb5134CBfbEAb9334EdaE7106a) {
    +++ description: None
      sourceHashes:
+        ["0x81a7349eebb98ac33b0bc6842e3cb258034a8f2a4ba004570bb8e2e25947f9ff","0xd42bbf9f7dcd3720a7fc6bdc6edfdfae8800a37d6dd4decfa0ef6ca4a2e88940"]
    }
```

```diff
    contract BridgeV2 (0x5523985926Aa12BA58DC5Ad00DDca99678D7227E) {
    +++ description: None
      sourceHashes:
+        ["0x6d1bbfb1ed7d88848e594dc11366fbed3d53c5a507022c04dbeea72ef549cd6a","0xbd76088c97afed7c4594c70e7bca2da6186fb16ab28e0f1f3f2521d3a62e67b8"]
    }
```

```diff
    contract Portal (0xb8f275fBf7A959F4BCE59999A2EF122A099e81A8) {
    +++ description: None
      sourceHashes:
+        ["0x6d1bbfb1ed7d88848e594dc11366fbed3d53c5a507022c04dbeea72ef549cd6a","0x4754c4887d8e1782eeead45b2652e3639e4887315d18aaac0050cbcdbdf3a0fa"]
    }
```

```diff
    contract MetaRouter (0xf621Fb08BBE51aF70e7E0F4EA63496894166Ff7F) {
    +++ description: None
      sourceHashes:
+        ["0xfdf630e9703ba4569d93c7c67f39804b269eb0215618561b27da33c2dce9fc86"]
    }
```

```diff
    contract MetaRouterGateway (0xfCEF2Fe72413b65d3F393d278A714caD87512bcd) {
    +++ description: None
      sourceHashes:
+        ["0xf78ec1ebb9770d063d83b96f47dbc97738175104c0ca567882812245a5939087"]
    }
```

Generated with discovered.json: 0x4d0b99984e7072fc89a7f31cb00357403aabb432

# Diff at Tue, 01 Oct 2024 11:11:14 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bd754dc73c66120164006054f8d25c5fae9cd910 block: 19532236
- current block number: 19532236

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19532236 (main branch discovery), not current.

```diff
    contract BridgeV2 (0x5523985926Aa12BA58DC5Ad00DDca99678D7227E) {
    +++ description: None
      values.$pastUpgrades:
+        [["2022-11-14T06:18:47.000Z",["0x7057aB3fB2BeE9c18e0cDe4240DE4ff7f159E365"]]]
    }
```

```diff
    contract Portal (0xb8f275fBf7A959F4BCE59999A2EF122A099e81A8) {
    +++ description: None
      values.$pastUpgrades:
+        [["2022-11-14T06:19:11.000Z",["0xda8057acB94905eb6025120cB2c38415Fd81BfEB"]],["2022-12-13T13:24:47.000Z",["0x81aB74A9f9d7457fF47dfD102e78A340cF72EC39"]],["2022-12-16T05:47:35.000Z",["0x1a039cE63AE35a67Bf0E9F6DbFaE969639D59eC8"]],["2023-02-08T06:36:35.000Z",["0x8a7F930003BedD63A1ebD99C5917FD6aE7E3dedf"]],["2023-09-19T05:08:35.000Z",["0x086488E659253FF26D0C743325C059FB57Ca7934"]],["2023-12-19T10:42:59.000Z",["0x326adbE46D7E6C1B3927e9309B96DF478bda6D16"]]]
    }
```

```diff
    contract Bridge (0xd5F0f8dB993D26F5df89E70a83d32b369DcCdaa0) {
    +++ description: None
      values.$pastUpgrades:
+        [["2022-02-04T09:48:01.000Z",["0xFb8aBa430cE64DC038a3078CDcB01A838d7f64b7"]],["2022-02-23T07:23:54.000Z",["0x9c13159c5D5903dd07F52f46308Dbd7A6Ea68DB9"]],["2022-05-11T06:52:49.000Z",["0xFC875FbdBaFeCD99FF0D2Cdf3DEF93FfcEc73949"]],["2022-06-21T08:42:53.000Z",["0xa3E661b51e9F6D8577968065D5d0f286553452c6"]],["2022-06-23T08:11:24.000Z",["0x61608F9520C311052D88Bc7d0c2c4Cba1c964662"]]]
    }
```

Generated with discovered.json: 0x44ceb017a95cfc2987eeca59ad136a0d6e91956e

# Diff at Fri, 30 Aug 2024 08:01:22 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@6c1bd1f41fadf5f2cb1c1805b5a2c6138a3ed35a block: 19532236
- current block number: 19532236

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19532236 (main branch discovery), not current.

```diff
    contract ProxyAdminBridgeV2 (0x1Da522B35363c1eda4833bc121c8F3c67B2caa75) {
    +++ description: None
      receivedPermissions.1.via:
-        []
      receivedPermissions.0.via:
-        []
    }
```

```diff
    contract ProxyAdminBridge (0x3901611dfDA3Aed75C37Ba59f2c76E8309dc98FA) {
    +++ description: None
      receivedPermissions.0.via:
-        []
    }
```

Generated with discovered.json: 0xac0a00acc1f4219e771e497a0b7d5f99ac2ee38a

# Diff at Fri, 23 Aug 2024 09:56:04 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@67597c7d6c810bc726594446890178150240711e block: 19532236
- current block number: 19532236

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19532236 (main branch discovery), not current.

```diff
    contract BridgeV2 (0x5523985926Aa12BA58DC5Ad00DDca99678D7227E) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract Portal (0xb8f275fBf7A959F4BCE59999A2EF122A099e81A8) {
    +++ description: None
      values.$upgradeCount:
+        6
    }
```

```diff
    contract Bridge (0xd5F0f8dB993D26F5df89E70a83d32b369DcCdaa0) {
    +++ description: None
      values.$upgradeCount:
+        5
    }
```

Generated with discovered.json: 0x3af51d8edb4635087182fcd8bccb9cd71783fdf9

# Diff at Wed, 21 Aug 2024 10:06:18 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@2f6dde3357bf5d79196b6e94f79d853a6c4ec72b block: 19532236
- current block number: 19532236

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19532236 (main branch discovery), not current.

```diff
    contract ProxyAdminBridgeV2 (0x1Da522B35363c1eda4833bc121c8F3c67B2caa75) {
    +++ description: None
      assignedPermissions:
-        {"upgrade":["0x5523985926Aa12BA58DC5Ad00DDca99678D7227E","0xb8f275fBf7A959F4BCE59999A2EF122A099e81A8"]}
      receivedPermissions:
+        [{"permission":"upgrade","target":"0x5523985926Aa12BA58DC5Ad00DDca99678D7227E","via":[]},{"permission":"upgrade","target":"0xb8f275fBf7A959F4BCE59999A2EF122A099e81A8","via":[]}]
    }
```

```diff
    contract ProxyAdminBridge (0x3901611dfDA3Aed75C37Ba59f2c76E8309dc98FA) {
    +++ description: None
      assignedPermissions:
-        {"upgrade":["0xd5F0f8dB993D26F5df89E70a83d32b369DcCdaa0"]}
      receivedPermissions:
+        [{"permission":"upgrade","target":"0xd5F0f8dB993D26F5df89E70a83d32b369DcCdaa0","via":[]}]
    }
```

```diff
    contract BridgeV2 (0x5523985926Aa12BA58DC5Ad00DDca99678D7227E) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x1Da522B35363c1eda4833bc121c8F3c67B2caa75","via":[]}]
    }
```

```diff
    contract Portal (0xb8f275fBf7A959F4BCE59999A2EF122A099e81A8) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x1Da522B35363c1eda4833bc121c8F3c67B2caa75","via":[]}]
    }
```

```diff
    contract Bridge (0xd5F0f8dB993D26F5df89E70a83d32b369DcCdaa0) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x3901611dfDA3Aed75C37Ba59f2c76E8309dc98FA","via":[]}]
    }
```

Generated with discovered.json: 0x8e5a63378b19d07ed8ed7fd9094244cca53e6be2

# Diff at Fri, 09 Aug 2024 12:02:44 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bf40aa32f030fd312056ca0ef198c8550467d1d7 block: 19532236
- current block number: 19532236

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19532236 (main branch discovery), not current.

```diff
    contract ProxyAdminBridgeV2 (0x1Da522B35363c1eda4833bc121c8F3c67B2caa75) {
    +++ description: None
      assignedPermissions.upgrade.1:
-        "0x5523985926Aa12BA58DC5Ad00DDca99678D7227E"
+        "0xb8f275fBf7A959F4BCE59999A2EF122A099e81A8"
      assignedPermissions.upgrade.0:
-        "0xb8f275fBf7A959F4BCE59999A2EF122A099e81A8"
+        "0x5523985926Aa12BA58DC5Ad00DDca99678D7227E"
    }
```

Generated with discovered.json: 0xf28a7b9bd9aafb30bc0ddd9723108b233ad573c9

# Diff at Fri, 09 Aug 2024 10:12:42 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f0da1d0aab7bc6b3b5e54e7e93480bd98e57035 block: 19532236
- current block number: 19532236

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19532236 (main branch discovery), not current.

```diff
    contract ProxyAdminBridgeV2 (0x1Da522B35363c1eda4833bc121c8F3c67B2caa75) {
    +++ description: None
      assignedPermissions.admin:
-        ["0x5523985926Aa12BA58DC5Ad00DDca99678D7227E","0xb8f275fBf7A959F4BCE59999A2EF122A099e81A8"]
      assignedPermissions.upgrade:
+        ["0xb8f275fBf7A959F4BCE59999A2EF122A099e81A8","0x5523985926Aa12BA58DC5Ad00DDca99678D7227E"]
    }
```

```diff
    contract ProxyAdminBridge (0x3901611dfDA3Aed75C37Ba59f2c76E8309dc98FA) {
    +++ description: None
      assignedPermissions.admin:
-        ["0xd5F0f8dB993D26F5df89E70a83d32b369DcCdaa0"]
      assignedPermissions.upgrade:
+        ["0xd5F0f8dB993D26F5df89E70a83d32b369DcCdaa0"]
    }
```

```diff
    contract Multisig (0x5112EbA9bc2468Bb5134CBfbEAb9334EdaE7106a) {
    +++ description: None
      values.$multisigThreshold:
-        "3 of 5 (60%)"
      values.getOwners:
-        ["0x28e41c41f61cab69aA0b50668eB3c38ee76d0BA9","0xDD335D90dE6e4ECE62C966FF07a000cF26e19C0e","0x74Bcc68B52E3De4C105CEE3eb1814fe496a60ab9","0x32e42EEE9586D685a40A26f8BAc4197cEA967b5F","0x8dFCBe7ABd7426B7441a89B6Db97B28376E46971"]
      values.getThreshold:
-        3
      values.$members:
+        ["0x28e41c41f61cab69aA0b50668eB3c38ee76d0BA9","0xDD335D90dE6e4ECE62C966FF07a000cF26e19C0e","0x74Bcc68B52E3De4C105CEE3eb1814fe496a60ab9","0x32e42EEE9586D685a40A26f8BAc4197cEA967b5F","0x8dFCBe7ABd7426B7441a89B6Db97B28376E46971"]
      values.$threshold:
+        3
      values.multisigThreshold:
+        "3 of 5 (60%)"
    }
```

Generated with discovered.json: 0x7964f710ebb1ba92de909b6efe7db6689b36bf81

# Diff at Thu, 28 Mar 2024 11:13:52 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@21187e63b9b90823a55c461c331868a470ce17eb block: 19063980
- current block number: 19532236

## Description

Update discovery to include the multisig threshold.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19063980 (main branch discovery), not current.

```diff
    contract Multisig (0x5112EbA9bc2468Bb5134CBfbEAb9334EdaE7106a) {
    +++ description: None
      upgradeability.threshold:
+        "3 of 5 (60%)"
    }
```

Generated with discovered.json: 0x6a2fe1d29022ae5e514fab9ee5db06e737226699

# Diff at Mon, 22 Jan 2024 18:16:15 GMT

- author: Michał Podsiadły (<michal.podsiadly@l2beat.com>)
- comparing to: main@f58cc44bf923844f52038487bcd5a563329f4b43 block: 18827571
- current block number: 19063980

## Description

MetaRouter has been verified.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 18827571 (main branch discovery), not current.

```diff
    contract MetaRouter (0xf621Fb08BBE51aF70e7E0F4EA63496894166Ff7F) {
      unverified:
-        true
      derivedName:
-        ""
+        "MetaRouter"
      values:
+        {"metaRouterGateway":"0xfCEF2Fe72413b65d3F393d278A714caD87512bcd"}
    }
```

```diff
+   Status: CREATED
    contract MetaRouterGateway (0xfCEF2Fe72413b65d3F393d278A714caD87512bcd) {
    }
```

# Diff at Wed, 20 Dec 2023 13:59:50 GMT

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@fea77c90d7ee6217f84ee87d58e123b42f0b5273

## Description

Added a `_crossChainID` param. Basically not used anywhere except in events.

## Watched changes

```diff
-   Status: DELETED
    contract MetaRouterGateway (0x0A0B7D1eea99e6189995432fec8172bB2dFFF847) {
    }
```

```diff
-   Status: DELETED
    contract MetaRouter (0x1DCfbC3fA01b2a86bC3a3f43479cCe9E8D438Adc) {
    }
```

```diff
    contract Portal (0xb8f275fBf7A959F4BCE59999A2EF122A099e81A8) {
      upgradeability.implementation:
-        "0x086488E659253FF26D0C743325C059FB57Ca7934"
+        "0x326adbE46D7E6C1B3927e9309B96DF478bda6D16"
      implementations.0:
-        "0x086488E659253FF26D0C743325C059FB57Ca7934"
+        "0x326adbE46D7E6C1B3927e9309B96DF478bda6D16"
      values.metaRouter:
-        "0x1DCfbC3fA01b2a86bC3a3f43479cCe9E8D438Adc"
+        "0xf621Fb08BBE51aF70e7E0F4EA63496894166Ff7F"
    }
```

```diff
+   Status: CREATED
    contract MetaRouter (0xf621Fb08BBE51aF70e7E0F4EA63496894166Ff7F) {
    }
```

## Source code changes

```diff
.../contracts/token/ERC20/IERC20.sol => /dev/null  |  82 -----
 .../contracts/utils/Context.sol => /dev/null       |  24 --
 .../libraries/TransferHelper.sol => /dev/null      |  51 ----
 .../metarouter/MetaRouteStructs.sol => /dev/null   |  83 -----
 .../metarouter/MetaRouter.sol => /dev/null         | 337 ---------------------
 .../metarouter/MetaRouterGateway.sol => /dev/null  |  31 --
 .../utils/RevertMessageParser.sol => /dev/null     |  16 -
 .../{.code@18184280 => .code}/MetaRouter/meta.txt  |   4 +-
 .../libraries/TransferHelper.sol => /dev/null      |  51 ----
 .../metarouter/MetaRouterGateway.sol => /dev/null  |  31 --
 .../MetaRouterGateway/meta.txt => /dev/null        |   2 -
 .../implementation/contracts/synth-core/Portal.sol |  43 +--
 .../synth-core/metarouter/MetaRouteStructs.sol     |   4 +-
 .../Portal/implementation/meta.txt                 |   2 +-
 14 files changed, 30 insertions(+), 731 deletions(-)
```

# Diff at Thu, 21 Sep 2023 12:32:23 GMT

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@36d4050a6ee5a543b2163fe6e44153b540b87c16

## Watched changes

```diff
    contract BridgeV2 (0x5523985926Aa12BA58DC5Ad00DDca99678D7227E) {
      values.mpc:
-        "0x18605bd33eD33Ec5A8cD899bf56a710D6693A3Bc"
+        "0xf56c3D7F385143f4E478ef5993b8266323B72657"
      values.newMPC:
-        "0x18605bd33eD33Ec5A8cD899bf56a710D6693A3Bc"
+        "0xf56c3D7F385143f4E478ef5993b8266323B72657"
      values.oldMPC:
-        "0x0dAb7E5BEb5b6DfC7bc4901e038b53D8b225Ab87"
+        "0xa60344175Ed28BB38e729f58595632EffF02fB33"
    }
```
