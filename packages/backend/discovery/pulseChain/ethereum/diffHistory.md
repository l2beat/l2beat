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

