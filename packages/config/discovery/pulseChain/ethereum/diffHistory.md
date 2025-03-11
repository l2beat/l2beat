Generated with discovered.json: 0xd01eb5e94debe166e4d208aa7eb5b10182a50f85

# Diff at Tue, 04 Mar 2025 10:39:40 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@98d260b45fe0d2195ce5e629bd7b200c8706e8ba block: 17968825
- current block number: 17968825

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 17968825 (main branch discovery), not current.

```diff
    contract ForeignOmnibridge (0x1715a3E4A142d8b698131108995174F37aEBA10D) {
    +++ description: None
      sinceBlock:
+        17264177
    }
```

```diff
    contract BridgeValidators (0x2fa878Ab3F87CC1C9737Fc071108F904c0B0C95d) {
    +++ description: None
      sinceBlock:
+        17264119
    }
```

```diff
    contract WETHOmnibridgeRouter (0x8AC4ae65b3656e26dC4e0e69108B392283350f55) {
    +++ description: None
      sinceBlock:
+        17264181
    }
```

```diff
    contract TokenFactory (0x98bf93ebf5c380C0e6Ae8e192A7e2AE08edAcc02) {
    +++ description: None
      sinceBlock:
+        17264180
    }
```

```diff
    contract PermittableToken (0xA1077a294dDE1B09bB078844df40758a5D0f9a27) {
    +++ description: None
      sinceBlock:
+        17264179
    }
```

```diff
    contract ForeignAMB (0xd0764FAe29E0a6a96fF685f71CfC685456D5636c) {
    +++ description: None
      sinceBlock:
+        17264125
    }
```

Generated with discovered.json: 0xde4fc0e1dfafc4585656de553fe80eb2b90d5044

# Diff at Mon, 20 Jan 2025 11:09:56 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@2c8b4f3d9910bb6371be9b4df87b70856e7d8c64 block: 17968825
- current block number: 17968825

## Description

Rerun on the same block number. Applies fixes to permissions and via field. Renames permission's target to to/from.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 17968825 (main branch discovery), not current.

```diff
    contract ForeignOmnibridge (0x1715a3E4A142d8b698131108995174F37aEBA10D) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x13A9594a2696D3c35F9D6E4Be6b332f699C57801"
      issuedPermissions.0.to:
+        "0x13A9594a2696D3c35F9D6E4Be6b332f699C57801"
    }
```

```diff
    contract BridgeValidators (0x2fa878Ab3F87CC1C9737Fc071108F904c0B0C95d) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xDf5d165A7EB95D26355c56d53799B7da1240e585"
      issuedPermissions.0.to:
+        "0xDf5d165A7EB95D26355c56d53799B7da1240e585"
    }
```

```diff
    contract ForeignAMB (0xd0764FAe29E0a6a96fF685f71CfC685456D5636c) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xDf5d165A7EB95D26355c56d53799B7da1240e585"
      issuedPermissions.0.to:
+        "0xDf5d165A7EB95D26355c56d53799B7da1240e585"
    }
```

Generated with discovered.json: 0xf195418290605b2f8608811074bc6b0b502fd6b2

# Diff at Mon, 21 Oct 2024 11:09:20 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@8895d33866f5665c4c710f4ddaa32bfa63cc3c78 block: 17968825
- current block number: 17968825

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 17968825 (main branch discovery), not current.

```diff
    contract ForeignOmnibridge (0x1715a3E4A142d8b698131108995174F37aEBA10D) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0xB7DF1E00ae030e966E635ede273625240546B873"]
      values.$pastUpgrades.0.1:
-        ["0xB7DF1E00ae030e966E635ede273625240546B873"]
+        "0x210fa683ddb0e587885dea0582bc328b80b7a87d700a10cc7a81f6fa1cf9612b"
    }
```

```diff
    contract BridgeValidators (0x2fa878Ab3F87CC1C9737Fc071108F904c0B0C95d) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0x95B303987A60C71504D99Aa1b13B4DA07b0790ab"]
      values.$pastUpgrades.0.1:
-        ["0x95B303987A60C71504D99Aa1b13B4DA07b0790ab"]
+        "0x91a1946de8485c208882fb51238a8771821502849535a638f25651804f3ef0d4"
    }
```

```diff
    contract ForeignAMB (0xd0764FAe29E0a6a96fF685f71CfC685456D5636c) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0xe98699957d3504aCD57ffF861E4b77b57eB02467"]
      values.$pastUpgrades.0.1:
-        ["0xe98699957d3504aCD57ffF861E4b77b57eB02467"]
+        "0x5d1c2bd55b6e6af2311067e52dd8a45a69550547c71593ad890f1d8e63caaf04"
    }
```

Generated with discovered.json: 0xbc4c45ad8463cf6f70308707832accb0aaacde19

# Diff at Mon, 14 Oct 2024 10:54:38 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1afc77ff111ceb0970e7d09efcc7b2f376b0c281 block: 17968825
- current block number: 17968825

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 17968825 (main branch discovery), not current.

```diff
    contract ForeignOmnibridge (0x1715a3E4A142d8b698131108995174F37aEBA10D) {
    +++ description: None
      sourceHashes:
+        ["0x10e99708bf71d6d77c20b34a6e991e6ca7487e63931b612a5224d32ca72b63b5","0x9720f814127b9abe2e0b23ce0cf1e96d96219277e21d382e52407db172c73c76"]
    }
```

```diff
    contract BridgeValidators (0x2fa878Ab3F87CC1C9737Fc071108F904c0B0C95d) {
    +++ description: None
      sourceHashes:
+        ["0xc2d647dd43d1a5c348b27b8b2bd671627d194c85cb69a865e67ae8dbdf38b705","0x5568dae309b68b3870831f43f7a6eb3459ab46bee27f0f282f5b9a0b2f2ed720"]
    }
```

```diff
    contract WETHOmnibridgeRouter (0x8AC4ae65b3656e26dC4e0e69108B392283350f55) {
    +++ description: None
      sourceHashes:
+        ["0x55a672aa33e48959212349f94f7522a8a142bc17931854f79636d4564226b7b3"]
    }
```

```diff
    contract TokenFactory (0x98bf93ebf5c380C0e6Ae8e192A7e2AE08edAcc02) {
    +++ description: None
      sourceHashes:
+        ["0xc3fc18a2178145d16d7d8d6b50d97b6d7a405421b3fae66cdeb31fb52f4e7eed"]
    }
```

```diff
    contract PermittableToken (0xA1077a294dDE1B09bB078844df40758a5D0f9a27) {
    +++ description: None
      sourceHashes:
+        ["0x064c46a3015079f17e93b171ff684cda28a0ecdbd55ecec09c4ddf50e0a5c312"]
    }
```

```diff
    contract ForeignAMB (0xd0764FAe29E0a6a96fF685f71CfC685456D5636c) {
    +++ description: None
      sourceHashes:
+        ["0xc2d647dd43d1a5c348b27b8b2bd671627d194c85cb69a865e67ae8dbdf38b705","0x580afb6cca5222e2dcaa0dcab547ed491b14414cabd97992abf96566d6af0fa0"]
    }
```

Generated with discovered.json: 0xdafcff2418ce79240e6f5112b9e474a45b6f8530

# Diff at Tue, 01 Oct 2024 10:54:27 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bd754dc73c66120164006054f8d25c5fae9cd910 block: 17968825
- current block number: 17968825

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 17968825 (main branch discovery), not current.

```diff
    contract ForeignOmnibridge (0x1715a3E4A142d8b698131108995174F37aEBA10D) {
    +++ description: None
      values.$pastUpgrades:
+        [["2023-05-15T09:06:11.000Z",["0xB7DF1E00ae030e966E635ede273625240546B873"]]]
      values.$upgradeCount:
+        1
    }
```

```diff
    contract BridgeValidators (0x2fa878Ab3F87CC1C9737Fc071108F904c0B0C95d) {
    +++ description: None
      values.$pastUpgrades:
+        [["2023-05-15T08:53:47.000Z",["0x95B303987A60C71504D99Aa1b13B4DA07b0790ab"]]]
      values.$upgradeCount:
+        1
    }
```

```diff
    contract ForeignAMB (0xd0764FAe29E0a6a96fF685f71CfC685456D5636c) {
    +++ description: None
      values.$pastUpgrades:
+        [["2023-05-15T08:54:59.000Z",["0xe98699957d3504aCD57ffF861E4b77b57eB02467"]]]
      values.$upgradeCount:
+        1
    }
```

Generated with discovered.json: 0x0027368754e67eb6f3a8865e8d0107ea1cb073f1

# Diff at Wed, 21 Aug 2024 10:05:15 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@2f6dde3357bf5d79196b6e94f79d853a6c4ec72b block: 17968825
- current block number: 17968825

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 17968825 (main branch discovery), not current.

```diff
    contract ForeignOmnibridge (0x1715a3E4A142d8b698131108995174F37aEBA10D) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x13A9594a2696D3c35F9D6E4Be6b332f699C57801","via":[]}]
    }
```

```diff
    contract BridgeValidators (0x2fa878Ab3F87CC1C9737Fc071108F904c0B0C95d) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xDf5d165A7EB95D26355c56d53799B7da1240e585","via":[]}]
    }
```

```diff
    contract ForeignAMB (0xd0764FAe29E0a6a96fF685f71CfC685456D5636c) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xDf5d165A7EB95D26355c56d53799B7da1240e585","via":[]}]
    }
```

Generated with discovered.json: 0x11fbf7a8ab731d6cd4f4de7209749df77ac4e6d2

