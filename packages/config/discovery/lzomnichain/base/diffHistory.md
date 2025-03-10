Generated with discovered.json: 0x0ceafb406a58e0c10acde18a687d967ddf910382

# Diff at Fri, 07 Mar 2025 13:45:40 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@c5dbe2ef6b8273c834507deba40dda8a1affce55 block: 25643771
- current block number: 27282893

## Description

DVN / Verifier for ZKsync Era added.

## Watched changes

```diff
+   Status: CREATED
    contract  (0x31F748a368a893Bdb5aBB67ec95F232507601A73)
    +++ description: None
```

```diff
+   Status: CREATED
    contract DVN (0xcd37CA043f8479064e10635020c65FfC005d36f6)
    +++ description: None
```

## Source code changes

```diff
.../lzomnichain/base/.flat/DVN.sol                 | 2116 ++++++++++++++++++++
 1 file changed, 2116 insertions(+)
```

Generated with discovered.json: 0x0a8e4d8c27e5b806cce6917199a4deba1c8de107

# Diff at Tue, 04 Mar 2025 10:40:35 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@98d260b45fe0d2195ce5e629bd7b200c8706e8ba block: 25643771
- current block number: 25643771

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 25643771 (main branch discovery), not current.

```diff
    contract LayerZero Multisig (0x28937ca4873f7289Ebea0708c4E42b24835eCfF0) {
    +++ description: None
      sinceBlock:
+        1284563
    }
```

```diff
    contract MPTValidator01 (0x2D61DCDD36F10b22176E0433B86F74567d529aAa) {
    +++ description: None
      sinceBlock:
+        1255835
    }
```

```diff
    contract UltraLightNodeV2 (0x38dE71124f7a447a01D67945a51eDcE9FF491251) {
    +++ description: None
      sinceBlock:
+        1255868
    }
```

```diff
    contract NonceContract (0x66A71Dcef29A0fFBDBE3c6a460a3B5BC225Cd675) {
    +++ description: None
      sinceBlock:
+        1255865
    }
```

```diff
    contract TreasuryV2 (0x980205D352F198748B626f6f7C38A8a5663Ec981) {
    +++ description: None
      sinceBlock:
+        1255871
    }
```

```diff
    contract  (0xAaB5A48CFC03Efa9cC34A2C1aAcCCB84b4b770e4) {
    +++ description: None
      sinceBlock:
+        1256363
    }
```

```diff
    contract Endpoint (0xb6319cC6c8c27A8F5dAF0dD3DF91EA35C4720dd7) {
    +++ description: None
      sinceBlock:
+        1255804
    }
```

```diff
    contract FPValidator (0xC1b15d3B262bEeC0e3565C11C9e0F6134BdaCB36) {
    +++ description: None
      sinceBlock:
+        1255822
    }
```

```diff
    contract  (0xcb566e3B6934Fa77258d68ea18E931fa75e1aaAa) {
    +++ description: None
      sinceBlock:
+        1256201
    }
```

```diff
    contract VerifierNetwork (0xD56e4eAb23cb81f43168F9F45211Eb027b9aC7cc) {
    +++ description: None
      sinceBlock:
+        3714858
    }
```

```diff
    contract VerifierFeeLib (0xdeA04ef31C4B4FDf31CB58923F37869739280d49) {
    +++ description: None
      sinceBlock:
+        3714861
    }
```

```diff
    contract  (0xFe7C30860D01e28371D40434806F4A8fcDD3A098) {
    +++ description: None
      sinceBlock:
+        1255922
    }
```

Generated with discovered.json: 0xe3af66f6b0ffa280ddab9cadf211ae0e8f685af4

# Diff at Tue, 28 Jan 2025 15:08:20 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@b60bc0e936cb7b213e24f14ed69abaff22493651 block: 21444261
- current block number: 25643771

## Description

LayerZero MS update: members swapped and new member added (now 3/5).

## Watched changes

```diff
    contract LayerZero Multisig (0x28937ca4873f7289Ebea0708c4E42b24835eCfF0) {
    +++ description: None
      values.$members.4:
+        "0x73E9c017Ad37e2113e709D8070Cc9E1b28180e1e"
      values.$members.3:
-        "0x67FC8c432448f9a8d541C17579EF7a142378d5aD"
+        "0x9F403140Bc0574D7d36eA472b82DAa1Bbd4eF327"
      values.$members.2:
-        "0x73E9c017Ad37e2113e709D8070Cc9E1b28180e1e"
+        "0x112c737AeEbD2E52DEb9ff5c9c19497F1A1777b0"
      values.$members.1:
-        "0xBb6633cc267951E938F9B6421E4F54aa5b2c1936"
+        "0x771dcAcB96024d1e55Fd21Fe8a8187AA7EC9e77e"
      values.$members.0:
-        "0x9F403140Bc0574D7d36eA472b82DAa1Bbd4eF327"
+        "0xB981a2664f5f547291Df5F8dCD4505f7015912CF"
      values.$threshold:
-        2
+        3
      values.multisigThreshold:
-        "2 of 4 (50%)"
+        "3 of 5 (60%)"
    }
```

Generated with discovered.json: 0xc8493a591f26e978faf22a85038fa99a88d49133

# Diff at Mon, 20 Jan 2025 11:10:39 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@2c8b4f3d9910bb6371be9b4df87b70856e7d8c64 block: 21444261
- current block number: 21444261

## Description

Rerun on the same block number. Applies fixes to permissions and via field. Renames permission's target to to/from.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21444261 (main branch discovery), not current.

```diff
    contract  (0xcb566e3B6934Fa77258d68ea18E931fa75e1aaAa) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xFe7C30860D01e28371D40434806F4A8fcDD3A098"
      issuedPermissions.0.to:
+        "0xFe7C30860D01e28371D40434806F4A8fcDD3A098"
    }
```

```diff
    contract  (0xFe7C30860D01e28371D40434806F4A8fcDD3A098) {
    +++ description: None
      receivedPermissions.0.target:
-        "0xcb566e3B6934Fa77258d68ea18E931fa75e1aaAa"
      receivedPermissions.0.from:
+        "0xcb566e3B6934Fa77258d68ea18E931fa75e1aaAa"
    }
```

Generated with discovered.json: 0x9a6798a6ad931953e2a61de5f41ba4f07b5e1adf

# Diff at Wed, 23 Oct 2024 10:04:45 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@2734bfe28641dfdb3277a5800faf0a057c08a58f block: 16700316
- current block number: 21444261

## Description

LayerZero Multisig: One signer removed.

## Watched changes

```diff
    contract LayerZero Multisig (0x28937ca4873f7289Ebea0708c4E42b24835eCfF0) {
    +++ description: None
      values.$members.4:
-        "0x67FC8c432448f9a8d541C17579EF7a142378d5aD"
      values.$members.3:
-        "0x73E9c017Ad37e2113e709D8070Cc9E1b28180e1e"
+        "0x67FC8c432448f9a8d541C17579EF7a142378d5aD"
      values.$members.2:
-        "0xBb6633cc267951E938F9B6421E4F54aa5b2c1936"
+        "0x73E9c017Ad37e2113e709D8070Cc9E1b28180e1e"
      values.$members.1:
-        "0xe095F2590eF1Ab39601445025847Ed8E4B40D687"
+        "0xBb6633cc267951E938F9B6421E4F54aa5b2c1936"
      values.multisigThreshold:
-        "2 of 5 (40%)"
+        "2 of 4 (50%)"
    }
```

Generated with discovered.json: 0x84bfc7107555c80b538444f0d51f3b670e0315fb

# Diff at Mon, 21 Oct 2024 11:14:04 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@8895d33866f5665c4c710f4ddaa32bfa63cc3c78 block: 16700316
- current block number: 16700316

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 16700316 (main branch discovery), not current.

```diff
    contract  (0xcb566e3B6934Fa77258d68ea18E931fa75e1aaAa) {
    +++ description: None
      values.$pastUpgrades.2.2:
+        ["0x6BD792911F4B3714E88FbDf32B351632e7d22c70"]
      values.$pastUpgrades.2.1:
-        ["0x6BD792911F4B3714E88FbDf32B351632e7d22c70"]
+        "0x30101034a49133ff3fbb1a01928e4faebbcceb302bc1e33e506e6941cbd8a0f5"
      values.$pastUpgrades.1.2:
+        ["0x61Ab01Ce58D1dFf3562bb25870020d555e39D849"]
      values.$pastUpgrades.1.1:
-        ["0x61Ab01Ce58D1dFf3562bb25870020d555e39D849"]
+        "0x42b93957fda87319708cc08440a555a7dcd705261b58c9d1526694d4935c0bfd"
      values.$pastUpgrades.0.2:
+        ["0x6F475642a6e85809B1c36Fa62763669b1b48DD5B"]
      values.$pastUpgrades.0.1:
-        ["0x6F475642a6e85809B1c36Fa62763669b1b48DD5B"]
+        "0xa4b66a9ecb5c65c5c482493988bdb959dc70308762a62a97a6a568c843f32197"
    }
```

Generated with discovered.json: 0xd12a17fe5a10c606a4b95147f70507276b5ba8a3

# Diff at Mon, 14 Oct 2024 10:59:43 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1afc77ff111ceb0970e7d09efcc7b2f376b0c281 block: 16700316
- current block number: 16700316

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 16700316 (main branch discovery), not current.

```diff
    contract LayerZero Multisig (0x28937ca4873f7289Ebea0708c4E42b24835eCfF0) {
    +++ description: None
      sourceHashes:
+        ["0x81a7349eebb98ac33b0bc6842e3cb258034a8f2a4ba004570bb8e2e25947f9ff","0x59fe14e95a8aa7f52213f18bae5c9329cf583a7ba31194698b15eddb97d5e825"]
    }
```

```diff
    contract MPTValidator01 (0x2D61DCDD36F10b22176E0433B86F74567d529aAa) {
    +++ description: None
      sourceHashes:
+        ["0x965651ae50a316c3ab842d2c8c9242c34d6e40eefa61f7c731bba9a1faf2ccea"]
    }
```

```diff
    contract UltraLightNodeV2 (0x38dE71124f7a447a01D67945a51eDcE9FF491251) {
    +++ description: None
      sourceHashes:
+        ["0x38c85ab54f670eaa1fc2b351aee39913bc12e2b26c460ee31cf89d3f1f7d59b9"]
    }
```

```diff
    contract NonceContract (0x66A71Dcef29A0fFBDBE3c6a460a3B5BC225Cd675) {
    +++ description: None
      sourceHashes:
+        ["0x895867397d61409de8476975bae4d871fec1c289e52fe97b31872726808dae38"]
    }
```

```diff
    contract TreasuryV2 (0x980205D352F198748B626f6f7C38A8a5663Ec981) {
    +++ description: None
      sourceHashes:
+        ["0x9a8a40656962f8df570994ee72e4262dc5beb926ffc7686740df457bade87efb"]
    }
```

```diff
    contract Endpoint (0xb6319cC6c8c27A8F5dAF0dD3DF91EA35C4720dd7) {
    +++ description: None
      sourceHashes:
+        ["0x945c3299d0cf62b9ea7a77d6328295d54327299d6a153e1e7b48d85fa9b77215"]
    }
```

```diff
    contract FPValidator (0xC1b15d3B262bEeC0e3565C11C9e0F6134BdaCB36) {
    +++ description: None
      sourceHashes:
+        ["0x0d505ac1b08cd930c4b902daa632eaa029531d5c1aa50c45169b63c310b2da62"]
    }
```

```diff
    contract VerifierNetwork (0xD56e4eAb23cb81f43168F9F45211Eb027b9aC7cc) {
    +++ description: None
      sourceHashes:
+        ["0x1be31a02ca7158d467a49eeb964f0f8aa1d1e74019df854c1881d89d51260701"]
    }
```

```diff
    contract VerifierFeeLib (0xdeA04ef31C4B4FDf31CB58923F37869739280d49) {
    +++ description: None
      sourceHashes:
+        ["0x37e1cee9d0a4ad6ebb439d27dbbf23925fcd9f9c0d5b43a33a6335e62b54d18c"]
    }
```

Generated with discovered.json: 0x0e0194278b971130e4b94fb3e17dcbd8340ead3c

# Diff at Tue, 01 Oct 2024 11:13:23 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bd754dc73c66120164006054f8d25c5fae9cd910 block: 16700316
- current block number: 16700316

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 16700316 (main branch discovery), not current.

```diff
    contract  (0xcb566e3B6934Fa77258d68ea18E931fa75e1aaAa) {
    +++ description: None
      values.$pastUpgrades:
+        [["2023-07-14T02:29:09.000Z",["0x6F475642a6e85809B1c36Fa62763669b1b48DD5B"]],["2023-09-20T19:39:09.000Z",["0x61Ab01Ce58D1dFf3562bb25870020d555e39D849"]],["2023-09-22T14:19:09.000Z",["0x6BD792911F4B3714E88FbDf32B351632e7d22c70"]]]
    }
```

Generated with discovered.json: 0x77a3766878a2bd3b0471dcf132fb17f2dda4cf24

# Diff at Fri, 30 Aug 2024 08:17:22 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@6c1bd1f41fadf5f2cb1c1805b5a2c6138a3ed35a block: 16700316
- current block number: 16700316

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 16700316 (main branch discovery), not current.

```diff
    contract  (0xFe7C30860D01e28371D40434806F4A8fcDD3A098) {
    +++ description: None
      receivedPermissions.0.via:
-        []
    }
```

Generated with discovered.json: 0x4f2b5740e4c2a3c431b85600297d3f7fac6bbed7

# Diff at Fri, 23 Aug 2024 09:57:40 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@67597c7d6c810bc726594446890178150240711e block: 16700316
- current block number: 16700316

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 16700316 (main branch discovery), not current.

```diff
    contract  (0xcb566e3B6934Fa77258d68ea18E931fa75e1aaAa) {
    +++ description: None
      values.$upgradeCount:
+        3
    }
```

Generated with discovered.json: 0x1ad4edae4b76c77b90a90e5b51c3a9f62e9b7b4a

# Diff at Wed, 21 Aug 2024 10:08:00 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@2f6dde3357bf5d79196b6e94f79d853a6c4ec72b block: 16700316
- current block number: 16700316

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 16700316 (main branch discovery), not current.

```diff
    contract  (0xcb566e3B6934Fa77258d68ea18E931fa75e1aaAa) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xFe7C30860D01e28371D40434806F4A8fcDD3A098","via":[]}]
    }
```

```diff
    contract  (0xFe7C30860D01e28371D40434806F4A8fcDD3A098) {
    +++ description: None
      assignedPermissions:
-        {"upgrade":["0xcb566e3B6934Fa77258d68ea18E931fa75e1aaAa"]}
      receivedPermissions:
+        [{"permission":"upgrade","target":"0xcb566e3B6934Fa77258d68ea18E931fa75e1aaAa","via":[]}]
    }
```

Generated with discovered.json: 0xd0e3d34e68a76e4c1df61e4cb0465941cdd66bd6

# Diff at Fri, 09 Aug 2024 10:14:07 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f0da1d0aab7bc6b3b5e54e7e93480bd98e57035 block: 16700316
- current block number: 16700316

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 16700316 (main branch discovery), not current.

```diff
    contract LayerZero Multisig (0x28937ca4873f7289Ebea0708c4E42b24835eCfF0) {
    +++ description: None
      values.$multisigThreshold:
-        "2 of 5 (40%)"
      values.getOwners:
-        ["0x9F403140Bc0574D7d36eA472b82DAa1Bbd4eF327","0xe095F2590eF1Ab39601445025847Ed8E4B40D687","0xBb6633cc267951E938F9B6421E4F54aa5b2c1936","0x73E9c017Ad37e2113e709D8070Cc9E1b28180e1e","0x67FC8c432448f9a8d541C17579EF7a142378d5aD"]
      values.getThreshold:
-        2
      values.$members:
+        ["0x9F403140Bc0574D7d36eA472b82DAa1Bbd4eF327","0xe095F2590eF1Ab39601445025847Ed8E4B40D687","0xBb6633cc267951E938F9B6421E4F54aa5b2c1936","0x73E9c017Ad37e2113e709D8070Cc9E1b28180e1e","0x67FC8c432448f9a8d541C17579EF7a142378d5aD"]
      values.$threshold:
+        2
      values.multisigThreshold:
+        "2 of 5 (40%)"
    }
```

```diff
    contract  (0xFe7C30860D01e28371D40434806F4A8fcDD3A098) {
    +++ description: None
      assignedPermissions.admin:
-        ["0xcb566e3B6934Fa77258d68ea18E931fa75e1aaAa"]
      assignedPermissions.upgrade:
+        ["0xcb566e3B6934Fa77258d68ea18E931fa75e1aaAa"]
    }
```

Generated with discovered.json: 0xf6b577478b3a8ec28dc846ed5e92d0a3c9ff5077

# Diff at Fri, 05 Jul 2024 14:33:17 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@111fee0655d72e75c60324b920975e421fd852f7 block: 12418351
- current block number: 16700316

## Description

Config related.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 12418351 (main branch discovery), not current.

```diff
-   Status: DELETED
    contract  (0x3c2269811836af69497E5F486A85D7316753cf62)
    +++ description: None
```

```diff
-   Status: DELETED
    contract  (0x9740FF91F1985D8d2B71494aE1A2f723bb3Ed9E4)
    +++ description: None
```

Generated with discovered.json: 0xc81c717a924de01e0776321a4030dbc4c771232f

# Diff at Thu, 28 Mar 2024 11:45:06 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@21187e63b9b90823a55c461c331868a470ce17eb block: 11816496
- current block number: 12418351

## Description

Update discovery to include the multisig threshold.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 11816496 (main branch discovery), not current.

```diff
    contract LayerZero Multisig (0x28937ca4873f7289Ebea0708c4E42b24835eCfF0) {
    +++ description: None
      upgradeability.threshold:
+        "2 of 5 (40%)"
    }
```

Generated with discovered.json: 0x39d8c0dc799668e68e81e9878fa9d96d9ebabcb2

# Diff at Thu, 14 Mar 2024 13:19:35 GMT

- author: Michał Podsiadły (<michal.podsiadly@l2beat.com>)
- comparing to: main@3ffa91064379f34a2916a1ad4e93791b752e7e9e block: 11465045
- current block number: 11816496

## Description

New PriceFeed Oracle implementation has been deployed. Nothing that would affect protocol security has been changed.

## Watched changes

```diff
    contract  (0x3c2269811836af69497E5F486A85D7316753cf62) {
    +++ description: None
      upgradeability.implementation:
-        "0x4EE2F9B7cf3A68966c370F3eb2C16613d3235245"
+        "0xde54D17cCf5Bdb2FADA00e15D863EC395aB9b9D4"
      implementations.0:
-        "0x4EE2F9B7cf3A68966c370F3eb2C16613d3235245"
+        "0xde54D17cCf5Bdb2FADA00e15D863EC395aB9b9D4"
    }
```

## Source code changes

```diff
.../-0x3c2269811836af69497E5F486A85D7316753cf62/implementation/meta.txt | 2 +-
 1 file changed, 1 insertion(+), 1 deletion(-)
```

Generated with discovered.json: 0x3d97aa6355af0176a152bfab3ff224b9139e6fdd

# Diff at Wed, 06 Mar 2024 10:04:16 GMT

- author: Michał Sobieraj-Jakubiec (<michalsidzej@gmail.com>)
- comparing to: main@1a2512004b35590384683b93c95d8ec95426d2a6 block: 9577249
- current block number: 11465045

## Description

Added v2 contracts to libraryLookup

## Watched changes

```diff
    contract Endpoint (0xb6319cC6c8c27A8F5dAF0dD3DF91EA35C4720dd7) {
    +++ description: None
      values.latestVersion:
-        1
+        3
      values.libraryLookup[2]:
+        "0x58D53a2d6a08B72a15137F3381d21b90638bd753"
      values.libraryLookup[1]:
+        "0x9DB3714048B5499Ec65F807787897D3b3Aa70072"
    }
```

```diff
    contract VerifierNetwork (0xD56e4eAb23cb81f43168F9F45211Eb027b9aC7cc) {
    +++ description: None
      values.defaultMultiplierBps:
-        12000
+        12100
    }
```

Generated with discovered.json: 0xde203ee297f219fbe60029e3a1b67ff9511ee0d6

# Diff at Mon, 22 Jan 2024 17:18:02 GMT

- author: Michał Podsiadły (<michal.podsiadly@l2beat.com>)
- comparing to: main@f58cc44bf923844f52038487bcd5a563329f4b43 block: 9014644
- current block number: 9577249

## Description

Default lib switched to FPValidator.
New path-ways added.

## Watched changes

```diff
    contract UltraLightNodeV2 (0x38dE71124f7a447a01D67945a51eDcE9FF491251) {
      values.chainAddressSizeMap.150:
+        20
      values.chainAddressSizeMap.159:
+        20
      values.chainAddressSizeMap.234:
+        20
      values.defaultAdapterParams.150:
+        {"proofType":2,"adapterParams":"0x00010000000000000000000000000000000000000000000000000000000000030d40"}
      values.defaultAdapterParams.159:
+        {"proofType":2,"adapterParams":"0x00010000000000000000000000000000000000000000000000000000000000030d40"}
      values.defaultAdapterParams.234:
+        {"proofType":2,"adapterParams":"0x00010000000000000000000000000000000000000000000000000000000000030d40"}
      values.defaultAppConfig.150:
+        {"inboundProofLib":2,"inboundBlockConfirm":5,"outboundProofType":2,"outboundBlockConfirm":10,"oracle":"0xAaB5A48CFC03Efa9cC34A2C1aAcCCB84b4b770e4","relayer":"0xcb566e3B6934Fa77258d68ea18E931fa75e1aaAa"}
      values.defaultAppConfig.159:
+        {"inboundProofLib":2,"inboundBlockConfirm":2,"outboundProofType":2,"outboundBlockConfirm":10,"oracle":"0xAaB5A48CFC03Efa9cC34A2C1aAcCCB84b4b770e4","relayer":"0xcb566e3B6934Fa77258d68ea18E931fa75e1aaAa"}
      values.defaultAppConfig.234:
+        {"inboundProofLib":2,"inboundBlockConfirm":5,"outboundProofType":2,"outboundBlockConfirm":10,"oracle":"0xAaB5A48CFC03Efa9cC34A2C1aAcCCB84b4b770e4","relayer":"0xcb566e3B6934Fa77258d68ea18E931fa75e1aaAa"}
      values.inboundProofLibrary.150:
+        ["0x2D61DCDD36F10b22176E0433B86F74567d529aAa","0xC1b15d3B262bEeC0e3565C11C9e0F6134BdaCB36"]
      values.inboundProofLibrary.159:
+        ["0x2D61DCDD36F10b22176E0433B86F74567d529aAa","0xC1b15d3B262bEeC0e3565C11C9e0F6134BdaCB36"]
      values.inboundProofLibrary.234:
+        ["0x2D61DCDD36F10b22176E0433B86F74567d529aAa","0xC1b15d3B262bEeC0e3565C11C9e0F6134BdaCB36"]
      values.supportedOutboundProof.150:
+        2
      values.supportedOutboundProof.159:
+        2
      values.supportedOutboundProof.234:
+        2
      values.ulnLookup.150:
+        "0x00000000000000000000000038de71124f7a447a01d67945a51edce9ff491251"
      values.ulnLookup.159:
+        "0x000000000000000000000000c1b15d3b262beec0e3565c11c9e0f6134bdacb36"
      values.ulnLookup.234:
+        "0x000000000000000000000000980205d352f198748b626f6f7c38a8a5663ec981"
    }
```

# Diff at Tue, 09 Jan 2024 16:44:11 GMT

- author: Michał Sobieraj-Jakubiec (<michalsidzej@gmail.com>)
- comparing to: main@0b578574e6a64020b5157f700c09de14e6b3eed3 block: 2177243
- current block number: 9014644

## Description

Unified configurations across L2s. Few new remote chains configurations added.

## Watched changes

```diff
    contract UltraLightNodeV2 (0x38dE71124f7a447a01D67945a51eDcE9FF491251) {
      values.chainAddressSizeMap.108:
+        32
      values.chainAddressSizeMap.126:
+        20
      values.chainAddressSizeMap.145:
+        20
      values.chainAddressSizeMap.165:
+        20
      values.chainAddressSizeMap.175:
+        20
      values.chainAddressSizeMap.182:
+        20
      values.chainAddressSizeMap.195:
+        20
      values.chainAddressSizeMap.199:
+        20
      values.chainAddressSizeMap.202:
+        20
      values.chainAddressSizeMap.210:
+        20
      values.chainAddressSizeMap.212:
+        20
      values.chainAddressSizeMap.214:
+        20
      values.chainAddressSizeMap.230:
+        20
      values.defaultAdapterParams.108:
+        {"proofType":2,"adapterParams":"0x000100000000000000000000000000000000000000000000000000000000000009c4"}
      values.defaultAdapterParams.126:
+        {"proofType":2,"adapterParams":"0x00010000000000000000000000000000000000000000000000000000000000030d40"}
      values.defaultAdapterParams.145:
+        {"proofType":2,"adapterParams":"0x00010000000000000000000000000000000000000000000000000000000000030d40"}
      values.defaultAdapterParams.165:
+        {"proofType":2,"adapterParams":"0x000100000000000000000000000000000000000000000000000000000000003d0900"}
      values.defaultAdapterParams.175:
+        {"proofType":2,"adapterParams":"0x00010000000000000000000000000000000000000000000000000000000000030d40"}
      values.defaultAdapterParams.182:
+        {"proofType":2,"adapterParams":"0x00010000000000000000000000000000000000000000000000000000000000030d40"}
      values.defaultAdapterParams.195:
+        {"proofType":2,"adapterParams":"0x00010000000000000000000000000000000000000000000000000000000000030d40"}
      values.defaultAdapterParams.199:
+        {"proofType":2,"adapterParams":"0x00010000000000000000000000000000000000000000000000000000000000030d40"}
      values.defaultAdapterParams.202:
+        {"proofType":2,"adapterParams":"0x00010000000000000000000000000000000000000000000000000000000000030d40"}
      values.defaultAdapterParams.210:
+        {"proofType":2,"adapterParams":"0x00010000000000000000000000000000000000000000000000000000000000030d40"}
      values.defaultAdapterParams.212:
+        {"proofType":2,"adapterParams":"0x00010000000000000000000000000000000000000000000000000000000000030d40"}
      values.defaultAdapterParams.214:
+        {"proofType":2,"adapterParams":"0x00010000000000000000000000000000000000000000000000000000000000030d40"}
      values.defaultAdapterParams.230:
+        {"proofType":2,"adapterParams":"0x00010000000000000000000000000000000000000000000000000000000000030d40"}
      values.defaultAppConfig.101.oracle:
-        "0xAaB5A48CFC03Efa9cC34A2C1aAcCCB84b4b770e4"
+        "0xD56e4eAb23cb81f43168F9F45211Eb027b9aC7cc"
      values.defaultAppConfig.102.oracle:
-        "0xAaB5A48CFC03Efa9cC34A2C1aAcCCB84b4b770e4"
+        "0xD56e4eAb23cb81f43168F9F45211Eb027b9aC7cc"
      values.defaultAppConfig.106.oracle:
-        "0xAaB5A48CFC03Efa9cC34A2C1aAcCCB84b4b770e4"
+        "0xD56e4eAb23cb81f43168F9F45211Eb027b9aC7cc"
      values.defaultAppConfig.109.oracle:
-        "0xAaB5A48CFC03Efa9cC34A2C1aAcCCB84b4b770e4"
+        "0xD56e4eAb23cb81f43168F9F45211Eb027b9aC7cc"
      values.defaultAppConfig.110.oracle:
-        "0xAaB5A48CFC03Efa9cC34A2C1aAcCCB84b4b770e4"
+        "0xD56e4eAb23cb81f43168F9F45211Eb027b9aC7cc"
      values.defaultAppConfig.111.oracle:
-        "0xAaB5A48CFC03Efa9cC34A2C1aAcCCB84b4b770e4"
+        "0xD56e4eAb23cb81f43168F9F45211Eb027b9aC7cc"
      values.defaultAppConfig.112.oracle:
-        "0xAaB5A48CFC03Efa9cC34A2C1aAcCCB84b4b770e4"
+        "0xD56e4eAb23cb81f43168F9F45211Eb027b9aC7cc"
      values.defaultAppConfig.183.oracle:
-        "0xAaB5A48CFC03Efa9cC34A2C1aAcCCB84b4b770e4"
+        "0xD56e4eAb23cb81f43168F9F45211Eb027b9aC7cc"
      values.defaultAppConfig.184.oracle:
-        "0xAaB5A48CFC03Efa9cC34A2C1aAcCCB84b4b770e4"
+        "0xD56e4eAb23cb81f43168F9F45211Eb027b9aC7cc"
      values.defaultAppConfig.108:
+        {"inboundProofLib":1,"inboundBlockConfirm":260,"outboundProofType":2,"outboundBlockConfirm":10,"oracle":"0xAaB5A48CFC03Efa9cC34A2C1aAcCCB84b4b770e4","relayer":"0xcb566e3B6934Fa77258d68ea18E931fa75e1aaAa"}
      values.defaultAppConfig.126:
+        {"inboundProofLib":2,"inboundBlockConfirm":10,"outboundProofType":2,"outboundBlockConfirm":10,"oracle":"0xD56e4eAb23cb81f43168F9F45211Eb027b9aC7cc","relayer":"0xcb566e3B6934Fa77258d68ea18E931fa75e1aaAa"}
      values.defaultAppConfig.145:
+        {"inboundProofLib":2,"inboundBlockConfirm":5,"outboundProofType":2,"outboundBlockConfirm":10,"oracle":"0xD56e4eAb23cb81f43168F9F45211Eb027b9aC7cc","relayer":"0xcb566e3B6934Fa77258d68ea18E931fa75e1aaAa"}
      values.defaultAppConfig.165:
+        {"inboundProofLib":1,"inboundBlockConfirm":20,"outboundProofType":2,"outboundBlockConfirm":10,"oracle":"0xAaB5A48CFC03Efa9cC34A2C1aAcCCB84b4b770e4","relayer":"0xcb566e3B6934Fa77258d68ea18E931fa75e1aaAa"}
      values.defaultAppConfig.175:
+        {"inboundProofLib":2,"inboundBlockConfirm":20,"outboundProofType":2,"outboundBlockConfirm":10,"oracle":"0xD56e4eAb23cb81f43168F9F45211Eb027b9aC7cc","relayer":"0xcb566e3B6934Fa77258d68ea18E931fa75e1aaAa"}
      values.defaultAppConfig.182:
+        {"inboundProofLib":2,"inboundBlockConfirm":2,"outboundProofType":2,"outboundBlockConfirm":10,"oracle":"0xAaB5A48CFC03Efa9cC34A2C1aAcCCB84b4b770e4","relayer":"0xcb566e3B6934Fa77258d68ea18E931fa75e1aaAa"}
      values.defaultAppConfig.195:
+        {"inboundProofLib":2,"inboundBlockConfirm":5,"outboundProofType":2,"outboundBlockConfirm":10,"oracle":"0xAaB5A48CFC03Efa9cC34A2C1aAcCCB84b4b770e4","relayer":"0xcb566e3B6934Fa77258d68ea18E931fa75e1aaAa"}
      values.defaultAppConfig.199:
+        {"inboundProofLib":2,"inboundBlockConfirm":5,"outboundProofType":2,"outboundBlockConfirm":10,"oracle":"0xAaB5A48CFC03Efa9cC34A2C1aAcCCB84b4b770e4","relayer":"0xcb566e3B6934Fa77258d68ea18E931fa75e1aaAa"}
      values.defaultAppConfig.202:
+        {"inboundProofLib":2,"inboundBlockConfirm":5,"outboundProofType":2,"outboundBlockConfirm":10,"oracle":"0xAaB5A48CFC03Efa9cC34A2C1aAcCCB84b4b770e4","relayer":"0xcb566e3B6934Fa77258d68ea18E931fa75e1aaAa"}
      values.defaultAppConfig.210:
+        {"inboundProofLib":2,"inboundBlockConfirm":5,"outboundProofType":2,"outboundBlockConfirm":10,"oracle":"0xAaB5A48CFC03Efa9cC34A2C1aAcCCB84b4b770e4","relayer":"0xcb566e3B6934Fa77258d68ea18E931fa75e1aaAa"}
      values.defaultAppConfig.212:
+        {"inboundProofLib":2,"inboundBlockConfirm":5,"outboundProofType":2,"outboundBlockConfirm":10,"oracle":"0xAaB5A48CFC03Efa9cC34A2C1aAcCCB84b4b770e4","relayer":"0xcb566e3B6934Fa77258d68ea18E931fa75e1aaAa"}
      values.defaultAppConfig.214:
+        {"inboundProofLib":2,"inboundBlockConfirm":5,"outboundProofType":2,"outboundBlockConfirm":10,"oracle":"0xAaB5A48CFC03Efa9cC34A2C1aAcCCB84b4b770e4","relayer":"0xcb566e3B6934Fa77258d68ea18E931fa75e1aaAa"}
      values.defaultAppConfig.230:
+        {"inboundProofLib":2,"inboundBlockConfirm":5,"outboundProofType":2,"outboundBlockConfirm":10,"oracle":"0xAaB5A48CFC03Efa9cC34A2C1aAcCCB84b4b770e4","relayer":"0xcb566e3B6934Fa77258d68ea18E931fa75e1aaAa"}
      values.inboundProofLibrary.108:
+        "0xC1b15d3B262bEeC0e3565C11C9e0F6134BdaCB36"
      values.inboundProofLibrary.126:
+        ["0x2D61DCDD36F10b22176E0433B86F74567d529aAa","0xC1b15d3B262bEeC0e3565C11C9e0F6134BdaCB36"]
      values.inboundProofLibrary.145:
+        ["0x2D61DCDD36F10b22176E0433B86F74567d529aAa","0xC1b15d3B262bEeC0e3565C11C9e0F6134BdaCB36"]
      values.inboundProofLibrary.165:
+        "0xC1b15d3B262bEeC0e3565C11C9e0F6134BdaCB36"
      values.inboundProofLibrary.175:
+        ["0x2D61DCDD36F10b22176E0433B86F74567d529aAa","0xC1b15d3B262bEeC0e3565C11C9e0F6134BdaCB36"]
      values.inboundProofLibrary.182:
+        ["0x2D61DCDD36F10b22176E0433B86F74567d529aAa","0xC1b15d3B262bEeC0e3565C11C9e0F6134BdaCB36"]
      values.inboundProofLibrary.195:
+        ["0x2D61DCDD36F10b22176E0433B86F74567d529aAa","0xC1b15d3B262bEeC0e3565C11C9e0F6134BdaCB36"]
      values.inboundProofLibrary.199:
+        ["0x2D61DCDD36F10b22176E0433B86F74567d529aAa","0xC1b15d3B262bEeC0e3565C11C9e0F6134BdaCB36"]
      values.inboundProofLibrary.202:
+        ["0x2D61DCDD36F10b22176E0433B86F74567d529aAa","0xC1b15d3B262bEeC0e3565C11C9e0F6134BdaCB36"]
      values.inboundProofLibrary.210:
+        ["0x2D61DCDD36F10b22176E0433B86F74567d529aAa","0xC1b15d3B262bEeC0e3565C11C9e0F6134BdaCB36"]
      values.inboundProofLibrary.212:
+        ["0x2D61DCDD36F10b22176E0433B86F74567d529aAa","0xC1b15d3B262bEeC0e3565C11C9e0F6134BdaCB36"]
      values.inboundProofLibrary.214:
+        ["0x2D61DCDD36F10b22176E0433B86F74567d529aAa","0xC1b15d3B262bEeC0e3565C11C9e0F6134BdaCB36"]
      values.inboundProofLibrary.230:
+        ["0x2D61DCDD36F10b22176E0433B86F74567d529aAa","0xC1b15d3B262bEeC0e3565C11C9e0F6134BdaCB36"]
      values.owner:
-        "0x9F403140Bc0574D7d36eA472b82DAa1Bbd4eF327"
+        "0x28937ca4873f7289Ebea0708c4E42b24835eCfF0"
      values.supportedOutboundProof.108:
+        2
      values.supportedOutboundProof.126:
+        2
      values.supportedOutboundProof.145:
+        2
      values.supportedOutboundProof.165:
+        2
      values.supportedOutboundProof.175:
+        2
      values.supportedOutboundProof.182:
+        2
      values.supportedOutboundProof.195:
+        2
      values.supportedOutboundProof.199:
+        2
      values.supportedOutboundProof.202:
+        2
      values.supportedOutboundProof.210:
+        2
      values.supportedOutboundProof.212:
+        2
      values.supportedOutboundProof.214:
+        2
      values.supportedOutboundProof.230:
+        2
      values.ulnLookup.108:
+        "0x54ad3d30af77b60d939ae356e6606de9a4da67583f02b962d2d3f2e481484e90"
      values.ulnLookup.126:
+        "0x0000000000000000000000004d73adb72bc3dd368966edd0f0b2148401a178e2"
      values.ulnLookup.145:
+        "0x00000000000000000000000038de71124f7a447a01d67945a51edce9ff491251"
      values.ulnLookup.165:
+        "0x000000000000000000000000042b8289c97896529ec2fe49ba1a8b9c956a86cc"
      values.ulnLookup.175:
+        "0x0000000000000000000000002d61dcdd36f10b22176e0433b86f74567d529aaa"
      values.ulnLookup.182:
+        "0x00000000000000000000000038de71124f7a447a01d67945a51edce9ff491251"
      values.ulnLookup.195:
+        "0x00000000000000000000000038de71124f7a447a01d67945a51edce9ff491251"
      values.ulnLookup.199:
+        "0x0000000000000000000000005b19bd330a84c049b62d5b0fc2ba120217a18c1c"
      values.ulnLookup.202:
+        "0x00000000000000000000000038de71124f7a447a01d67945a51edce9ff491251"
      values.ulnLookup.210:
+        "0x00000000000000000000000038de71124f7a447a01d67945a51edce9ff491251"
      values.ulnLookup.212:
+        "0x00000000000000000000000038de71124f7a447a01d67945a51edce9ff491251"
      values.ulnLookup.214:
+        "0x00000000000000000000000038de71124f7a447a01d67945a51edce9ff491251"
      values.ulnLookup.230:
+        "0x000000000000000000000000980205d352f198748b626f6f7c38a8a5663ec981"
    }
```

```diff
    contract TreasuryV2 (0x980205D352F198748B626f6f7C38A8a5663Ec981) {
      values.owner:
-        "0x9F403140Bc0574D7d36eA472b82DAa1Bbd4eF327"
+        "0x28937ca4873f7289Ebea0708c4E42b24835eCfF0"
    }
```

```diff
    contract Endpoint (0xb6319cC6c8c27A8F5dAF0dD3DF91EA35C4720dd7) {
      values.owner:
-        "0x9F403140Bc0574D7d36eA472b82DAa1Bbd4eF327"
+        "0x28937ca4873f7289Ebea0708c4E42b24835eCfF0"
    }
```

```diff
    contract  (0xcb566e3B6934Fa77258d68ea18E931fa75e1aaAa) {
      upgradeability.implementation:
-        "0x6F475642a6e85809B1c36Fa62763669b1b48DD5B"
+        "0x6BD792911F4B3714E88FbDf32B351632e7d22c70"
      implementations.0:
-        "0x6F475642a6e85809B1c36Fa62763669b1b48DD5B"
+        "0x6BD792911F4B3714E88FbDf32B351632e7d22c70"
    }
```

```diff
+   Status: CREATED
    contract LayerZero Multisig (0x28937ca4873f7289Ebea0708c4E42b24835eCfF0) {
    }
```

```diff
+   Status: CREATED
    contract  (0x3c2269811836af69497E5F486A85D7316753cf62) {
    }
```

```diff
+   Status: CREATED
    contract  (0x9740FF91F1985D8d2B71494aE1A2f723bb3Ed9E4) {
    }
```

```diff
+   Status: CREATED
    contract VerifierNetwork (0xD56e4eAb23cb81f43168F9F45211Eb027b9aC7cc) {
    }
```

```diff
+   Status: CREATED
    contract VerifierFeeLib (0xdeA04ef31C4B4FDf31CB58923F37869739280d49) {
    }
```

## Source code changes

```diff
.../@openzeppelin/contracts/math/SafeMath.sol      | 214 +++++++++
 .../@openzeppelin/contracts/token/ERC20/ERC20.sol  | 306 +++++++++++++
 .../@openzeppelin/contracts/token/ERC20/IERC20.sol |  77 ++++
 .../@openzeppelin/contracts/utils/Context.sol      |  24 +
 .../implementation/contracts/GnosisSafe.sol        | 422 +++++++++++++++++
 .../implementation/contracts/GnosisSafeL2.sol      |  86 ++++
 .../contracts/accessors/SimulateTxAccessor.sol     |  52 +++
 .../implementation/contracts/base/Executor.sol     |  27 ++
 .../contracts/base/FallbackManager.sol             |  53 +++
 .../implementation/contracts/base/GuardManager.sol |  50 ++
 .../contracts/base/ModuleManager.sol               | 133 ++++++
 .../implementation/contracts/base/OwnerManager.sol | 149 ++++++
 .../implementation/contracts/common/Enum.sol       |   8 +
 .../contracts/common/EtherPaymentFallback.sol      |  13 +
 .../contracts/common/SecuredTokenTransfer.sol      |  35 ++
 .../contracts/common/SelfAuthorized.sol            |  16 +
 .../contracts/common/SignatureDecoder.sol          |  36 ++
 .../implementation/contracts/common/Singleton.sol  |  11 +
 .../contracts/common/StorageAccessible.sol         |  47 ++
 .../examples/guards/DebugTransactionGuard.sol      |  65 +++
 .../guards/DelegateCallTransactionGuard.sol        |  39 ++
 .../examples/guards/ReentrancyTransactionGuard.sol |  51 +++
 .../examples/libraries/Migrate_1_3_0_to_1_2_0.sol  |  31 ++
 .../contracts/external/GnosisSafeMath.sol          |  54 +++
 .../handler/CompatibilityFallbackHandler.sol       | 144 ++++++
 .../contracts/handler/DefaultCallbackHandler.sol   |  61 +++
 .../contracts/handler/HandlerContext.sol           |  23 +
 .../contracts/interfaces/ERC1155TokenReceiver.sol  |  49 ++
 .../contracts/interfaces/ERC721TokenReceiver.sol   |  24 +
 .../contracts/interfaces/ERC777TokensRecipient.sol |  13 +
 .../contracts/interfaces/IERC165.sol               |  15 +
 .../contracts/interfaces/ISignatureValidator.sol   |  20 +
 .../contracts/libraries/CreateCall.sol             |  30 ++
 .../contracts/libraries/GnosisSafeStorage.sol      |  21 +
 .../contracts/libraries/MultiSend.sol              |  66 +++
 .../contracts/libraries/MultiSendCallOnly.sol      |  61 +++
 .../contracts/libraries/SignMessageLib.sol         |  34 ++
 .../contracts/proxies/GnosisSafeProxy.sol          |  44 ++
 .../contracts/proxies/GnosisSafeProxyFactory.sol   | 107 +++++
 .../contracts/proxies/IProxyCreationCallback.sol   |  12 +
 .../implementation/contracts/test/ERC1155Token.sol | 105 +++++
 .../implementation/contracts/test/ERC20Token.sol   |  10 +
 .../implementation/contracts/test/TestHandler.sol  |  10 +
 .../LayerZero Multisig/implementation/meta.txt     |   2 +
 .../LayerZero Multisig/proxy/GnosisSafeProxy.sol   | 159 +++++++
 .../base/.code/LayerZero Multisig/proxy/meta.txt   |   2 +
 .../contracts/libs/CalldataBytesLib.sol            |  58 +++
 .../lz-evm-protocol-v2/contracts/libs/Errors.sol   |  56 +++
 .../contracts/messagelib/libs/BitMaps.sol          |  24 +
 .../contracts/utils/introspection/ERC165.sol       |  29 ++
 .../contracts/utils/introspection/IERC165.sol      |  25 +
 .../contracts/interfaces/ILayerZeroPriceFeed.sol   |  57 +++
 .../contracts/interfaces/IWorker.sol               |  20 +
 .../contracts/uln/VerifierFeeLib.sol               | 137 ++++++
 .../uln/interfaces/ILayerZeroVerifier.sol          |  34 ++
 .../contracts/uln/interfaces/IVerifier.sol         |  25 +
 .../contracts/uln/interfaces/IVerifierFeeLib.sol   |  28 ++
 .../contracts/uln/libs/VerifierOptions.sol         | 177 +++++++
 .../lzomnichain/base/.code/VerifierFeeLib/meta.txt |   2 +
 .../solidity-bytes-utils/contracts/BytesLib.sol    | 510 +++++++++++++++++++++
 .../contracts/MessagingStructs.sol                 |  25 +
 .../contracts/interfaces/ILayerZeroEndpointV2.sol  |  80 ++++
 .../contracts/interfaces/IMessageLib.sol           |  46 ++
 .../contracts/interfaces/IMessageLibManager.sol    |  73 +++
 .../contracts/interfaces/IMessagingChannel.sol     |  33 ++
 .../contracts/interfaces/IMessagingComposer.sol    |  19 +
 .../contracts/interfaces/IMessagingContext.sol     |   9 +
 .../lz-evm-protocol-v2/contracts/libs/Errors.sol   |  56 +++
 .../interfaces/ILayerZeroUltraLightNodeV2.sol      |  83 ++++
 .../contracts/access/AccessControl.sol             | 248 ++++++++++
 .../contracts/access/IAccessControl.sol            |  88 ++++
 .../@openzeppelin/contracts/access/Ownable.sol     |  83 ++++
 .../@openzeppelin/contracts/security/Pausable.sol  | 105 +++++
 .../@openzeppelin/contracts/utils/Context.sol      |  24 +
 .../@openzeppelin/contracts/utils/Strings.sol      |  85 ++++
 .../contracts/utils/cryptography/ECDSA.sol         | 217 +++++++++
 .../contracts/utils/introspection/ERC165.sol       |  29 ++
 .../contracts/utils/introspection/IERC165.sol      |  25 +
 .../@openzeppelin/contracts/utils/math/Math.sol    | 339 ++++++++++++++
 .../contracts/utils/math/SignedMath.sol            |  43 ++
 .../VerifierNetwork/contracts/MessageLibBase.sol   | 170 +++++++
 .../.code/VerifierNetwork/contracts/Worker.sol     | 142 ++++++
 .../contracts/interfaces/ILayerZeroExecutor.sol    |  29 ++
 .../contracts/interfaces/ILayerZeroTreasury.sol    |   7 +
 .../contracts/interfaces/IWorker.sol               |  20 +
 .../VerifierNetwork/contracts/uln/MultiSig.sol     |  78 ++++
 .../contracts/uln/VerifierNetwork.sol              | 346 ++++++++++++++
 .../uln/interfaces/ILayerZeroVerifier.sol          |  34 ++
 .../contracts/uln/interfaces/IUltraLightNode.sol   |  13 +
 .../contracts/uln/interfaces/IVerifier.sol         |  25 +
 .../contracts/uln/interfaces/IVerifierFeeLib.sol   |  28 ++
 .../base/.code/VerifierNetwork/meta.txt            |   2 +
 .../implementation/meta.txt                        |   2 +-
 .../base/{.code@2177243 => .code}/meta.txt         |   2 +-
 .../base/{.code@2177243 => .code}/proxy/meta.txt   |   2 +-
 95 files changed, 6800 insertions(+), 3 deletions(-)
```

## Config related changes

Following changes come from updates made to the config file,
not from differences found during discovery. Values are
for block 2177243 (main branch discovery), not current.

```diff
    contract UltraLightNodeV2 (0x38dE71124f7a447a01D67945a51eDcE9FF491251) {
      values.chainAddressSizeMap:
+        {"101":20,"102":20,"106":20,"109":20,"110":20,"111":20,"112":20,"151":20,"158":20,"167":20,"177":20,"181":20,"183":20,"184":20}
      values.defaultAdapterParams:
+        {"101":{"proofType":2,"adapterParams":"0x00010000000000000000000000000000000000000000000000000000000000030d40"},"102":{"proofType":2,"adapterParams":"0x00010000000000000000000000000000000000000000000000000000000000030d40"},"106":{"proofType":2,"adapterParams":"0x00010000000000000000000000000000000000000000000000000000000000030d40"},"109":{"proofType":2,"adapterParams":"0x00010000000000000000000000000000000000000000000000000000000000030d40"},"110":{"proofType":2,"adapterParams":"0x00010000000000000000000000000000000000000000000000000000000000030d40"},"111":{"proofType":2,"adapterParams":"0x00010000000000000000000000000000000000000000000000000000000000030d40"},"112":{"proofType":2,"adapterParams":"0x00010000000000000000000000000000000000000000000000000000000000030d40"},"151":{"proofType":2,"adapterParams":"0x00010000000000000000000000000000000000000000000000000000000000030d40"},"158":{"proofType":2,"adapterParams":"0x00010000000000000000000000000000000000000000000000000000000000030d40"},"167":{"proofType":2,"adapterParams":"0x00010000000000000000000000000000000000000000000000000000000000030d40"},"177":{"proofType":2,"adapterParams":"0x00010000000000000000000000000000000000000000000000000000000000030d40"},"181":{"proofType":2,"adapterParams":"0x00010000000000000000000000000000000000000000000000000000000000030d40"},"183":{"proofType":2,"adapterParams":"0x00010000000000000000000000000000000000000000000000000000000000030d40"},"184":{"proofType":2,"adapterParams":"0x00010000000000000000000000000000000000000000000000000000000000030d40"}}
      values.defaultAppConfig:
+        {"101":{"inboundProofLib":2,"inboundBlockConfirm":15,"outboundProofType":2,"outboundBlockConfirm":10,"oracle":"0xAaB5A48CFC03Efa9cC34A2C1aAcCCB84b4b770e4","relayer":"0xcb566e3B6934Fa77258d68ea18E931fa75e1aaAa"},"102":{"inboundProofLib":2,"inboundBlockConfirm":20,"outboundProofType":2,"outboundBlockConfirm":10,"oracle":"0xAaB5A48CFC03Efa9cC34A2C1aAcCCB84b4b770e4","relayer":"0xcb566e3B6934Fa77258d68ea18E931fa75e1aaAa"},"106":{"inboundProofLib":2,"inboundBlockConfirm":12,"outboundProofType":2,"outboundBlockConfirm":10,"oracle":"0xAaB5A48CFC03Efa9cC34A2C1aAcCCB84b4b770e4","relayer":"0xcb566e3B6934Fa77258d68ea18E931fa75e1aaAa"},"109":{"inboundProofLib":2,"inboundBlockConfirm":512,"outboundProofType":2,"outboundBlockConfirm":10,"oracle":"0xAaB5A48CFC03Efa9cC34A2C1aAcCCB84b4b770e4","relayer":"0xcb566e3B6934Fa77258d68ea18E931fa75e1aaAa"},"110":{"inboundProofLib":2,"inboundBlockConfirm":20,"outboundProofType":2,"outboundBlockConfirm":10,"oracle":"0xAaB5A48CFC03Efa9cC34A2C1aAcCCB84b4b770e4","relayer":"0xcb566e3B6934Fa77258d68ea18E931fa75e1aaAa"},"111":{"inboundProofLib":2,"inboundBlockConfirm":20,"outboundProofType":2,"outboundBlockConfirm":10,"oracle":"0xAaB5A48CFC03Efa9cC34A2C1aAcCCB84b4b770e4","relayer":"0xcb566e3B6934Fa77258d68ea18E931fa75e1aaAa"},"112":{"inboundProofLib":2,"inboundBlockConfirm":5,"outboundProofType":2,"outboundBlockConfirm":10,"oracle":"0xAaB5A48CFC03Efa9cC34A2C1aAcCCB84b4b770e4","relayer":"0xcb566e3B6934Fa77258d68ea18E931fa75e1aaAa"},"151":{"inboundProofLib":2,"inboundBlockConfirm":5,"outboundProofType":2,"outboundBlockConfirm":10,"oracle":"0xAaB5A48CFC03Efa9cC34A2C1aAcCCB84b4b770e4","relayer":"0xcb566e3B6934Fa77258d68ea18E931fa75e1aaAa"},"158":{"inboundProofLib":2,"inboundBlockConfirm":20,"outboundProofType":2,"outboundBlockConfirm":10,"oracle":"0xAaB5A48CFC03Efa9cC34A2C1aAcCCB84b4b770e4","relayer":"0xcb566e3B6934Fa77258d68ea18E931fa75e1aaAa"},"167":{"inboundProofLib":2,"inboundBlockConfirm":10,"outboundProofType":2,"outboundBlockConfirm":10,"oracle":"0xAaB5A48CFC03Efa9cC34A2C1aAcCCB84b4b770e4","relayer":"0xcb566e3B6934Fa77258d68ea18E931fa75e1aaAa"},"177":{"inboundProofLib":2,"inboundBlockConfirm":2,"outboundProofType":2,"outboundBlockConfirm":10,"oracle":"0xAaB5A48CFC03Efa9cC34A2C1aAcCCB84b4b770e4","relayer":"0xcb566e3B6934Fa77258d68ea18E931fa75e1aaAa"},"181":{"inboundProofLib":2,"inboundBlockConfirm":2,"outboundProofType":2,"outboundBlockConfirm":10,"oracle":"0xAaB5A48CFC03Efa9cC34A2C1aAcCCB84b4b770e4","relayer":"0xcb566e3B6934Fa77258d68ea18E931fa75e1aaAa"},"183":{"inboundProofLib":2,"inboundBlockConfirm":10,"outboundProofType":2,"outboundBlockConfirm":10,"oracle":"0xAaB5A48CFC03Efa9cC34A2C1aAcCCB84b4b770e4","relayer":"0xcb566e3B6934Fa77258d68ea18E931fa75e1aaAa"},"184":{"inboundProofLib":2,"inboundBlockConfirm":10,"outboundProofType":2,"outboundBlockConfirm":10,"oracle":"0xAaB5A48CFC03Efa9cC34A2C1aAcCCB84b4b770e4","relayer":"0xcb566e3B6934Fa77258d68ea18E931fa75e1aaAa"}}
      values.inboundProofLibrary:
+        {"101":["0x2D61DCDD36F10b22176E0433B86F74567d529aAa","0xC1b15d3B262bEeC0e3565C11C9e0F6134BdaCB36"],"102":["0x2D61DCDD36F10b22176E0433B86F74567d529aAa","0xC1b15d3B262bEeC0e3565C11C9e0F6134BdaCB36"],"106":["0x2D61DCDD36F10b22176E0433B86F74567d529aAa","0xC1b15d3B262bEeC0e3565C11C9e0F6134BdaCB36"],"109":["0x2D61DCDD36F10b22176E0433B86F74567d529aAa","0xC1b15d3B262bEeC0e3565C11C9e0F6134BdaCB36"],"110":["0x2D61DCDD36F10b22176E0433B86F74567d529aAa","0xC1b15d3B262bEeC0e3565C11C9e0F6134BdaCB36"],"111":["0x2D61DCDD36F10b22176E0433B86F74567d529aAa","0xC1b15d3B262bEeC0e3565C11C9e0F6134BdaCB36"],"112":["0x2D61DCDD36F10b22176E0433B86F74567d529aAa","0xC1b15d3B262bEeC0e3565C11C9e0F6134BdaCB36"],"151":["0x2D61DCDD36F10b22176E0433B86F74567d529aAa","0xC1b15d3B262bEeC0e3565C11C9e0F6134BdaCB36"],"158":["0x2D61DCDD36F10b22176E0433B86F74567d529aAa","0xC1b15d3B262bEeC0e3565C11C9e0F6134BdaCB36"],"167":["0x2D61DCDD36F10b22176E0433B86F74567d529aAa","0xC1b15d3B262bEeC0e3565C11C9e0F6134BdaCB36"],"177":["0x2D61DCDD36F10b22176E0433B86F74567d529aAa","0xC1b15d3B262bEeC0e3565C11C9e0F6134BdaCB36"],"181":["0x2D61DCDD36F10b22176E0433B86F74567d529aAa","0xC1b15d3B262bEeC0e3565C11C9e0F6134BdaCB36"],"183":["0x2D61DCDD36F10b22176E0433B86F74567d529aAa","0xC1b15d3B262bEeC0e3565C11C9e0F6134BdaCB36"],"184":["0x2D61DCDD36F10b22176E0433B86F74567d529aAa","0xC1b15d3B262bEeC0e3565C11C9e0F6134BdaCB36"]}
      values.supportedOutboundProof:
+        {"101":2,"102":2,"106":2,"109":2,"110":2,"111":2,"112":2,"151":2,"158":2,"167":2,"177":2,"181":2,"183":2,"184":2}
      values.ulnLookup:
+        {"101":"0x0000000000000000000000004d73adb72bc3dd368966edd0f0b2148401a178e2","102":"0x0000000000000000000000004d73adb72bc3dd368966edd0f0b2148401a178e2","106":"0x0000000000000000000000004d73adb72bc3dd368966edd0f0b2148401a178e2","109":"0x0000000000000000000000004d73adb72bc3dd368966edd0f0b2148401a178e2","110":"0x0000000000000000000000004d73adb72bc3dd368966edd0f0b2148401a178e2","111":"0x0000000000000000000000004d73adb72bc3dd368966edd0f0b2148401a178e2","112":"0x0000000000000000000000004d73adb72bc3dd368966edd0f0b2148401a178e2","151":"0x00000000000000000000000038de71124f7a447a01d67945a51edce9ff491251","158":"0x000000000000000000000000fe7c30860d01e28371d40434806f4a8fcdd3a098","167":"0x000000000000000000000000e9ba4c1e76d874a43942718dafc96009ec9d9917","177":"0x00000000000000000000000038de71124f7a447a01d67945a51edce9ff491251","181":"0x00000000000000000000000038de71124f7a447a01d67945a51edce9ff491251","183":"0x00000000000000000000000038de71124f7a447a01d67945a51edce9ff491251","184":"0x00000000000000000000000038de71124f7a447a01d67945a51edce9ff491251"}
      sinceTimestamp:
+        1689301083
    }
```

```diff
    contract NonceContract (0x66A71Dcef29A0fFBDBE3c6a460a3B5BC225Cd675) {
      sinceTimestamp:
+        1689301077
    }
```

```diff
    contract TreasuryV2 (0x980205D352F198748B626f6f7C38A8a5663Ec981) {
      sinceTimestamp:
+        1689301089
    }
```

```diff
    contract Endpoint (0xb6319cC6c8c27A8F5dAF0dD3DF91EA35C4720dd7) {
      values.libraryLookup:
+        ["0x38dE71124f7a447a01D67945a51eDcE9FF491251"]
      sinceTimestamp:
+        1689300955
    }
```

```diff
+   Status: CREATED
    contract MPTValidator01 (0x2D61DCDD36F10b22176E0433B86F74567d529aAa) {
    }
```

```diff
+   Status: CREATED
    contract  (0xAaB5A48CFC03Efa9cC34A2C1aAcCCB84b4b770e4) {
    }
```

```diff
+   Status: CREATED
    contract FPValidator (0xC1b15d3B262bEeC0e3565C11C9e0F6134BdaCB36) {
    }
```

```diff
+   Status: CREATED
    contract  (0xcb566e3B6934Fa77258d68ea18E931fa75e1aaAa) {
    }
```

```diff
+   Status: CREATED
    contract  (0xFe7C30860D01e28371D40434806F4A8fcDD3A098) {
    }
```
