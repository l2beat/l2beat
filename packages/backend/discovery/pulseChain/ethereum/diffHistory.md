Generated with discovered.json: 0x4b6e3774027c01347208111d3cbdfbb409210c51

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

