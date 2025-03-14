Generated with discovered.json: 0x26f35c12ddff7246674a8d11f3ba8f78f3187c25

# Diff at Tue, 11 Mar 2025 08:13:19 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@6186a4f8e3a9e415d081d4e3e85c2deceaa5530c block: 314283899
- current block number: 314504547

## Description

proxyadmin template match.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 314283899 (main branch discovery), not current.

```diff
    contract ArbitrumProxyAdmin (0x48698A17D193bFc882395AC06a1DEdbb222F2917) {
    +++ description: None
      receivedPermissions:
-        [{"permission":"upgrade","from":"0xfB0Ad0B3C2605A7CA33d6badd0C685E11b8F5585"}]
      template:
+        "global/ProxyAdmin"
      displayName:
+        "ProxyAdmin"
      directlyReceivedPermissions:
+        [{"permission":"upgrade","from":"0xfB0Ad0B3C2605A7CA33d6badd0C685E11b8F5585"}]
    }
```

```diff
    contract ArbitrumOwner (0xa29fFe244898CBec19DFEaAfB5cE671389FfF60F) {
    +++ description: None
      receivedPermissions.2:
+        {"permission":"upgrade","from":"0xFF73a1a1d27951A005eb23276dc99CB7F8d5420A"}
      receivedPermissions.1.from:
-        "0xFF73a1a1d27951A005eb23276dc99CB7F8d5420A"
+        "0xfB0Ad0B3C2605A7CA33d6badd0C685E11b8F5585"
      receivedPermissions.1.via:
+        [{"address":"0x48698A17D193bFc882395AC06a1DEdbb222F2917"}]
      directlyReceivedPermissions:
+        [{"permission":"act","from":"0x48698A17D193bFc882395AC06a1DEdbb222F2917"}]
    }
```

```diff
    contract L1ERC20Bridge (0xfB0Ad0B3C2605A7CA33d6badd0C685E11b8F5585) {
    +++ description: None
      issuedPermissions.0.to:
-        "0x48698A17D193bFc882395AC06a1DEdbb222F2917"
+        "0xa29fFe244898CBec19DFEaAfB5cE671389FfF60F"
      issuedPermissions.0.via.0:
+        {"address":"0x48698A17D193bFc882395AC06a1DEdbb222F2917"}
    }
```

Generated with discovered.json: 0xea30fd5179c42efcde5f0a910309d802f09fae17

# Diff at Mon, 10 Mar 2025 16:52:03 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@ef4d1036423fe7d398c41e6cf238a209cc1ff8f3 block: 249925893
- current block number: 314283899

## Description

zklink core contract paused. this only prevents deposits/ on the affected chains.

## Watched changes

```diff
    contract zkLink (0xFF73a1a1d27951A005eb23276dc99CB7F8d5420A) {
    +++ description: None
      values.paused:
-        false
+        true
    }
```

Generated with discovered.json: 0x14134b88a53978cb7bebab48977da43192beab78

# Diff at Tue, 04 Mar 2025 10:40:30 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@98d260b45fe0d2195ce5e629bd7b200c8706e8ba block: 249925893
- current block number: 249925893

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 249925893 (main branch discovery), not current.

```diff
    contract ArbitrumProxyAdmin (0x48698A17D193bFc882395AC06a1DEdbb222F2917) {
    +++ description: None
      sinceBlock:
+        186015816
    }
```

```diff
    contract ArbitrumL2Gateway (0x7bd79DEd935B542fb22c74305a4d2A293C18483a) {
    +++ description: None
      sinceBlock:
+        185950532
    }
```

```diff
    contract ArbitrumOwner (0xa29fFe244898CBec19DFEaAfB5cE671389FfF60F) {
    +++ description: None
      sinceBlock:
+        123482330
    }
```

```diff
    contract L1ERC20Bridge (0xfB0Ad0B3C2605A7CA33d6badd0C685E11b8F5585) {
    +++ description: None
      sinceBlock:
+        186015816
    }
```

```diff
    contract zkLink (0xFF73a1a1d27951A005eb23276dc99CB7F8d5420A) {
    +++ description: None
      sinceBlock:
+        185950340
    }
```

Generated with discovered.json: 0xdaf524ce7fda886280e598f0339747312506acdd

# Diff at Mon, 20 Jan 2025 11:10:36 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@2c8b4f3d9910bb6371be9b4df87b70856e7d8c64 block: 249925893
- current block number: 249925893

## Description

Rerun on the same block number. Applies fixes to permissions and via field. Renames permission's target to to/from.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 249925893 (main branch discovery), not current.

```diff
    contract ArbitrumProxyAdmin (0x48698A17D193bFc882395AC06a1DEdbb222F2917) {
    +++ description: None
      receivedPermissions.0.target:
-        "0xfB0Ad0B3C2605A7CA33d6badd0C685E11b8F5585"
      receivedPermissions.0.from:
+        "0xfB0Ad0B3C2605A7CA33d6badd0C685E11b8F5585"
    }
```

```diff
    contract ArbitrumL2Gateway (0x7bd79DEd935B542fb22c74305a4d2A293C18483a) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xa29fFe244898CBec19DFEaAfB5cE671389FfF60F"
      issuedPermissions.0.to:
+        "0xa29fFe244898CBec19DFEaAfB5cE671389FfF60F"
    }
```

```diff
    contract ArbitrumOwner (0xa29fFe244898CBec19DFEaAfB5cE671389FfF60F) {
    +++ description: None
      receivedPermissions.1.target:
-        "0xFF73a1a1d27951A005eb23276dc99CB7F8d5420A"
      receivedPermissions.1.from:
+        "0xFF73a1a1d27951A005eb23276dc99CB7F8d5420A"
      receivedPermissions.0.target:
-        "0x7bd79DEd935B542fb22c74305a4d2A293C18483a"
      receivedPermissions.0.from:
+        "0x7bd79DEd935B542fb22c74305a4d2A293C18483a"
    }
```

```diff
    contract L1ERC20Bridge (0xfB0Ad0B3C2605A7CA33d6badd0C685E11b8F5585) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x48698A17D193bFc882395AC06a1DEdbb222F2917"
      issuedPermissions.0.to:
+        "0x48698A17D193bFc882395AC06a1DEdbb222F2917"
    }
```

```diff
    contract zkLink (0xFF73a1a1d27951A005eb23276dc99CB7F8d5420A) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xa29fFe244898CBec19DFEaAfB5cE671389FfF60F"
      issuedPermissions.0.to:
+        "0xa29fFe244898CBec19DFEaAfB5cE671389FfF60F"
    }
```

Generated with discovered.json: 0x302f7d1f2ac1e98727f03ff56a6d720433f25d6d

# Diff at Mon, 21 Oct 2024 11:13:49 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@8895d33866f5665c4c710f4ddaa32bfa63cc3c78 block: 249925893
- current block number: 249925893

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 249925893 (main branch discovery), not current.

```diff
    contract ArbitrumL2Gateway (0x7bd79DEd935B542fb22c74305a4d2A293C18483a) {
    +++ description: None
      values.$pastUpgrades.1.2:
+        ["0x413552461b0b2c13f117d885b52AaA2f23374B1D"]
      values.$pastUpgrades.1.1:
-        ["0x413552461b0b2c13f117d885b52AaA2f23374B1D"]
+        "0x2bc75a8c67da17b0d0c4543bfc3bbc51248fba5b4430ecf3f8836fe83d7b065a"
      values.$pastUpgrades.0.2:
+        ["0xA194FB4EaB262EC9886A119609bbB2800bdD3a2E"]
      values.$pastUpgrades.0.1:
-        ["0xA194FB4EaB262EC9886A119609bbB2800bdD3a2E"]
+        "0xaa8e1f332b3da71bb09cffdf5b797cdf7bc285cfad780a78d294c02619dba31e"
    }
```

```diff
    contract L1ERC20Bridge (0xfB0Ad0B3C2605A7CA33d6badd0C685E11b8F5585) {
    +++ description: None
      values.$pastUpgrades.1.2:
+        ["0x1202e0557A23531D09015C802e993d6423685FfB"]
      values.$pastUpgrades.1.1:
-        ["0x1202e0557A23531D09015C802e993d6423685FfB"]
+        "0x99c592973087e232fa0685460c1e5992ef3a5cd0d80e8c6739d738b08787bece"
      values.$pastUpgrades.0.2:
+        ["0x5f58BcCE409CDaFBbD705e720743b1EfF9fef28c"]
      values.$pastUpgrades.0.1:
-        ["0x5f58BcCE409CDaFBbD705e720743b1EfF9fef28c"]
+        "0x4879e7a6e35cdd40863e69eec2b64cafa514ca68ea8b4b9942c9624a18bfa2bf"
    }
```

```diff
    contract zkLink (0xFF73a1a1d27951A005eb23276dc99CB7F8d5420A) {
    +++ description: None
      values.$pastUpgrades.2.2:
+        ["0xe2cd603BFAe63EEFBDf0C51485f835D8B419A305"]
      values.$pastUpgrades.2.1:
-        ["0xe2cd603BFAe63EEFBDf0C51485f835D8B419A305"]
+        "0x22f2009bf7f9c0cec80080ccd77d22c1bcf8e318cc2d2a442cae078746f19a6e"
      values.$pastUpgrades.1.2:
+        ["0x04C6a52f3bf9F73618cD70F234AdB95a73325D1e"]
      values.$pastUpgrades.1.1:
-        ["0x04C6a52f3bf9F73618cD70F234AdB95a73325D1e"]
+        "0x2d6ab13f653c95e66eb8f995ecec5218aaa69dc457d8c314d5c0df3383b0a7eb"
      values.$pastUpgrades.0.2:
+        ["0x50efC7f1290479cb879473512D89fDC80B726211"]
      values.$pastUpgrades.0.1:
-        ["0x50efC7f1290479cb879473512D89fDC80B726211"]
+        "0x188f9617f4266ba6c55c01e49a2b918860f60ab012dd921f7a6bbf2478380b4b"
    }
```

Generated with discovered.json: 0x06b5a54a504199511ec699812d604f2215b87cba

# Diff at Mon, 14 Oct 2024 10:59:30 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1afc77ff111ceb0970e7d09efcc7b2f376b0c281 block: 249925893
- current block number: 249925893

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 249925893 (main branch discovery), not current.

```diff
    contract ArbitrumProxyAdmin (0x48698A17D193bFc882395AC06a1DEdbb222F2917) {
    +++ description: None
      sourceHashes:
+        ["0x8fd8f837bb320bd2a7463c103bea2ff207b0969b5795f320a6c868858aa92074"]
    }
```

```diff
    contract ArbitrumL2Gateway (0x7bd79DEd935B542fb22c74305a4d2A293C18483a) {
    +++ description: None
      sourceHashes:
+        ["0xbbe53a68c0042f4050bdf21e8d16eee4688dd35d24e49740915f0a0cf994f0d6","0x92d18063ee33accb564a80045a642ccab59919fc97ffb5f4a4849874239d7bc0"]
    }
```

```diff
    contract ArbitrumOwner (0xa29fFe244898CBec19DFEaAfB5cE671389FfF60F) {
    +++ description: None
      sourceHashes:
+        ["0x81a7349eebb98ac33b0bc6842e3cb258034a8f2a4ba004570bb8e2e25947f9ff","0x59fe14e95a8aa7f52213f18bae5c9329cf583a7ba31194698b15eddb97d5e825"]
    }
```

```diff
    contract L1ERC20Bridge (0xfB0Ad0B3C2605A7CA33d6badd0C685E11b8F5585) {
    +++ description: None
      sourceHashes:
+        ["0x8c407edc4ac1fa1cea2c45903e2cf0158906a2ff39fc2eb92aca3ca9f0d43ed8","0xcabc91ee17e9a771bb999a95f4705966cf206325fc82ac15d440c8b6086f9679"]
    }
```

```diff
    contract zkLink (0xFF73a1a1d27951A005eb23276dc99CB7F8d5420A) {
    +++ description: None
      sourceHashes:
+        ["0xbbe53a68c0042f4050bdf21e8d16eee4688dd35d24e49740915f0a0cf994f0d6","0x9d3b6cf7c8756dc6cce424dc754ed146f84d3201e5223d47b0a4fcd994a76a7f"]
    }
```

Generated with discovered.json: 0x696474d84edc29918adaffbf4da48bc353d65227

# Diff at Tue, 01 Oct 2024 11:13:10 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bd754dc73c66120164006054f8d25c5fae9cd910 block: 249925893
- current block number: 249925893

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 249925893 (main branch discovery), not current.

```diff
    contract ArbitrumL2Gateway (0x7bd79DEd935B542fb22c74305a4d2A293C18483a) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-03-01T08:07:57.000Z",["0xA194FB4EaB262EC9886A119609bbB2800bdD3a2E"]],["2024-03-09T10:55:57.000Z",["0x413552461b0b2c13f117d885b52AaA2f23374B1D"]]]
    }
```

```diff
    contract L1ERC20Bridge (0xfB0Ad0B3C2605A7CA33d6badd0C685E11b8F5585) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-03-01T12:42:53.000Z",["0x5f58BcCE409CDaFBbD705e720743b1EfF9fef28c"]],["2024-04-04T06:25:57.000Z",["0x1202e0557A23531D09015C802e993d6423685FfB"]]]
    }
```

```diff
    contract zkLink (0xFF73a1a1d27951A005eb23276dc99CB7F8d5420A) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-03-01T08:07:08.000Z",["0x50efC7f1290479cb879473512D89fDC80B726211"]],["2024-03-09T10:39:17.000Z",["0x04C6a52f3bf9F73618cD70F234AdB95a73325D1e"]],["2024-04-22T02:29:43.000Z",["0xe2cd603BFAe63EEFBDf0C51485f835D8B419A305"]]]
    }
```

Generated with discovered.json: 0x4bae17fea069f73f6181cb0fe40028bcfe782345

# Diff at Wed, 04 Sep 2024 07:32:20 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@878a951312cec062f5003f6749f781861b0cdba1 block: 236183206
- current block number: 249925893

## Description

Change one signer of the MS.

## Watched changes

```diff
    contract ArbitrumOwner (0xa29fFe244898CBec19DFEaAfB5cE671389FfF60F) {
    +++ description: None
      values.$members.5:
-        "0x824C9364A6CF8f5EB542ad2ca8F5705561C8b1db"
+        "0xC75EFCffEE930706daec5CaCA012551f6a1845D7"
      values.$members.4:
-        "0xC75EFCffEE930706daec5CaCA012551f6a1845D7"
+        "0x24a257B7D975E7ec6219C4cFCbcF6E504253c7A9"
      values.$members.3:
-        "0x24a257B7D975E7ec6219C4cFCbcF6E504253c7A9"
+        "0xF801886AE2e127A269B0F11892edb54F692d02dF"
      values.$members.2:
-        "0xF801886AE2e127A269B0F11892edb54F692d02dF"
+        "0x4D9b22B92Ff9faFAc013f82faCA88BDa8E778cb5"
      values.$members.1:
-        "0x4D9b22B92Ff9faFAc013f82faCA88BDa8E778cb5"
+        "0x7785bccF9110C188Dad39bE49D4Cdf6c6CC03F10"
      values.$members.0:
-        "0x7785bccF9110C188Dad39bE49D4Cdf6c6CC03F10"
+        "0xd30898ECdc21C72250a5fd1dbD37FF7D63237Db5"
    }
```

Generated with discovered.json: 0x0245cb3dd9cb99d92c2dae199ed7505a82ab2878

# Diff at Fri, 30 Aug 2024 08:06:28 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@6c1bd1f41fadf5f2cb1c1805b5a2c6138a3ed35a block: 236183206
- current block number: 236183206

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 236183206 (main branch discovery), not current.

```diff
    contract ArbitrumProxyAdmin (0x48698A17D193bFc882395AC06a1DEdbb222F2917) {
    +++ description: None
      receivedPermissions.0.via:
-        []
    }
```

```diff
    contract ArbitrumOwner (0xa29fFe244898CBec19DFEaAfB5cE671389FfF60F) {
    +++ description: None
      receivedPermissions.1.via:
-        []
      receivedPermissions.0.via:
-        []
    }
```

Generated with discovered.json: 0x4fb288a3d6eccd2f8d0f1933ef73cb56b5a01660

# Diff at Fri, 23 Aug 2024 09:57:28 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@67597c7d6c810bc726594446890178150240711e block: 236183206
- current block number: 236183206

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 236183206 (main branch discovery), not current.

```diff
    contract ArbitrumL2Gateway (0x7bd79DEd935B542fb22c74305a4d2A293C18483a) {
    +++ description: None
      values.$upgradeCount:
+        2
    }
```

```diff
    contract L1ERC20Bridge (0xfB0Ad0B3C2605A7CA33d6badd0C685E11b8F5585) {
    +++ description: None
      values.$upgradeCount:
+        2
    }
```

```diff
    contract zkLink (0xFF73a1a1d27951A005eb23276dc99CB7F8d5420A) {
    +++ description: None
      values.$upgradeCount:
+        3
    }
```

Generated with discovered.json: 0xf5ed5654a4bf603d5d83fd21c51942d132645e0c

# Diff at Wed, 21 Aug 2024 10:07:50 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@2f6dde3357bf5d79196b6e94f79d853a6c4ec72b block: 236183206
- current block number: 236183206

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 236183206 (main branch discovery), not current.

```diff
    contract ArbitrumProxyAdmin (0x48698A17D193bFc882395AC06a1DEdbb222F2917) {
    +++ description: None
      assignedPermissions:
-        {"upgrade":["0xfB0Ad0B3C2605A7CA33d6badd0C685E11b8F5585"]}
      receivedPermissions:
+        [{"permission":"upgrade","target":"0xfB0Ad0B3C2605A7CA33d6badd0C685E11b8F5585","via":[]}]
    }
```

```diff
    contract ArbitrumL2Gateway (0x7bd79DEd935B542fb22c74305a4d2A293C18483a) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xa29fFe244898CBec19DFEaAfB5cE671389FfF60F","via":[]}]
    }
```

```diff
    contract ArbitrumOwner (0xa29fFe244898CBec19DFEaAfB5cE671389FfF60F) {
    +++ description: None
      assignedPermissions:
-        {"upgrade":["0x7bd79DEd935B542fb22c74305a4d2A293C18483a","0xFF73a1a1d27951A005eb23276dc99CB7F8d5420A"]}
      receivedPermissions:
+        [{"permission":"upgrade","target":"0x7bd79DEd935B542fb22c74305a4d2A293C18483a","via":[]},{"permission":"upgrade","target":"0xFF73a1a1d27951A005eb23276dc99CB7F8d5420A","via":[]}]
    }
```

```diff
    contract L1ERC20Bridge (0xfB0Ad0B3C2605A7CA33d6badd0C685E11b8F5585) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x48698A17D193bFc882395AC06a1DEdbb222F2917","via":[]}]
    }
```

```diff
    contract zkLink (0xFF73a1a1d27951A005eb23276dc99CB7F8d5420A) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xa29fFe244898CBec19DFEaAfB5cE671389FfF60F","via":[]}]
    }
```

Generated with discovered.json: 0xd0c699fa1ecd3ab39127652bf279e28e11fb35e4

# Diff at Fri, 09 Aug 2024 12:03:57 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bf40aa32f030fd312056ca0ef198c8550467d1d7 block: 236183206
- current block number: 236183206

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 236183206 (main branch discovery), not current.

```diff
    contract ArbitrumOwner (0xa29fFe244898CBec19DFEaAfB5cE671389FfF60F) {
    +++ description: None
      assignedPermissions.upgrade.1:
-        "0x7bd79DEd935B542fb22c74305a4d2A293C18483a"
+        "0xFF73a1a1d27951A005eb23276dc99CB7F8d5420A"
      assignedPermissions.upgrade.0:
-        "0xFF73a1a1d27951A005eb23276dc99CB7F8d5420A"
+        "0x7bd79DEd935B542fb22c74305a4d2A293C18483a"
    }
```

Generated with discovered.json: 0x95ee912601a055d0374480a11c0f88d66cf984e0

# Diff at Fri, 09 Aug 2024 10:13:57 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f0da1d0aab7bc6b3b5e54e7e93480bd98e57035 block: 236183206
- current block number: 236183206

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 236183206 (main branch discovery), not current.

```diff
    contract ArbitrumProxyAdmin (0x48698A17D193bFc882395AC06a1DEdbb222F2917) {
    +++ description: None
      assignedPermissions.admin:
-        ["0xfB0Ad0B3C2605A7CA33d6badd0C685E11b8F5585"]
      assignedPermissions.upgrade:
+        ["0xfB0Ad0B3C2605A7CA33d6badd0C685E11b8F5585"]
    }
```

```diff
    contract ArbitrumOwner (0xa29fFe244898CBec19DFEaAfB5cE671389FfF60F) {
    +++ description: None
      assignedPermissions.admin:
-        ["0x7bd79DEd935B542fb22c74305a4d2A293C18483a","0xFF73a1a1d27951A005eb23276dc99CB7F8d5420A"]
      assignedPermissions.upgrade:
+        ["0xFF73a1a1d27951A005eb23276dc99CB7F8d5420A","0x7bd79DEd935B542fb22c74305a4d2A293C18483a"]
      values.$multisigThreshold:
-        "5 of 8 (63%)"
      values.getOwners:
-        ["0x7785bccF9110C188Dad39bE49D4Cdf6c6CC03F10","0x4D9b22B92Ff9faFAc013f82faCA88BDa8E778cb5","0xF801886AE2e127A269B0F11892edb54F692d02dF","0x24a257B7D975E7ec6219C4cFCbcF6E504253c7A9","0xC75EFCffEE930706daec5CaCA012551f6a1845D7","0x824C9364A6CF8f5EB542ad2ca8F5705561C8b1db","0xd8F26118505417Ef6468Ac8A2AE1E5117245Db92","0xcC1A2bd1a459be0C7fAd3B7F9Fa9a6CBBFE9BFa5"]
      values.getThreshold:
-        5
      values.$members:
+        ["0x7785bccF9110C188Dad39bE49D4Cdf6c6CC03F10","0x4D9b22B92Ff9faFAc013f82faCA88BDa8E778cb5","0xF801886AE2e127A269B0F11892edb54F692d02dF","0x24a257B7D975E7ec6219C4cFCbcF6E504253c7A9","0xC75EFCffEE930706daec5CaCA012551f6a1845D7","0x824C9364A6CF8f5EB542ad2ca8F5705561C8b1db","0xd8F26118505417Ef6468Ac8A2AE1E5117245Db92","0xcC1A2bd1a459be0C7fAd3B7F9Fa9a6CBBFE9BFa5"]
      values.$threshold:
+        5
      values.multisigThreshold:
+        "5 of 8 (63%)"
    }
```

Generated with discovered.json: 0x597584cf793814ce5a34508814da3c40519a17dd

# Diff at Fri, 26 Jul 2024 08:09:58 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@f98f9bf0ba32e20ec33942af664ae6ed27e8172d block: 231384315
- current block number: 236183206

## Description

The admin / owner MS threshold is lowered to 5/8.

## Watched changes

```diff
    contract ArbitrumOwner (0xa29fFe244898CBec19DFEaAfB5cE671389FfF60F) {
    +++ description: None
      values.$multisigThreshold:
-        "6 of 8 (75%)"
+        "5 of 8 (63%)"
      values.getThreshold:
-        6
+        5
    }
```

Generated with discovered.json: 0x85cbc6a4cd4dcbb2283e6b810b1867b8faaeacc6

# Diff at Thu, 04 Jul 2024 14:08:47 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- current block number: 228694559

## Description

Provide description of changes. This section will be preserved.

## Initial discovery

```diff
+   Status: CREATED
    contract ArbitrumProxyAdmin (0x48698A17D193bFc882395AC06a1DEdbb222F2917)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ArbitrumL2Gateway (0x7bd79DEd935B542fb22c74305a4d2A293C18483a)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ArbitrumOwner (0xa29fFe244898CBec19DFEaAfB5cE671389FfF60F)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1ERC20Bridge (0xfB0Ad0B3C2605A7CA33d6badd0C685E11b8F5585)
    +++ description: None
```

```diff
+   Status: CREATED
    contract zkLink (0xFF73a1a1d27951A005eb23276dc99CB7F8d5420A)
    +++ description: None
```
