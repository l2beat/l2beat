Generated with discovered.json: 0xca1b31debe5b8046f0d8f888c5c972953d019932

# Diff at Tue, 04 Mar 2025 10:42:16 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@98d260b45fe0d2195ce5e629bd7b200c8706e8ba block: 19948557
- current block number: 19948557

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19948557 (main branch discovery), not current.

```diff
    contract  (0x2D61DCDD36F10b22176E0433B86F74567d529aAa) {
    +++ description: None
      sinceBlock:
+        5878
    }
```

```diff
    contract  (0x38dE71124f7a447a01D67945a51eDcE9FF491251) {
    +++ description: None
      sinceBlock:
+        5880
    }
```

```diff
    contract ProxyAdmin (0x3c2269811836af69497E5F486A85D7316753cf62) {
    +++ description: None
      sinceBlock:
+        5875
    }
```

```diff
    contract  (0x66A71Dcef29A0fFBDBE3c6a460a3B5BC225Cd675) {
    +++ description: None
      sinceBlock:
+        5879
    }
```

```diff
    contract  (0x6F475642a6e85809B1c36Fa62763669b1b48DD5B) {
    +++ description: None
      sinceBlock:
+        5886
    }
```

```diff
    contract LayerZeroMultisig_pzkevm (0x8df01A9F8bE5776F4280B7056e13A0Fc0E007827) {
    +++ description: None
      sinceBlock:
+        11336913
    }
```

```diff
    contract ProxyAdmin (0x967bAf657ec4d4b1cb00b06f7Cc6E8BA604e3AC8) {
    +++ description: None
      sinceBlock:
+        6150
    }
```

```diff
    contract Endpoint (0x9740FF91F1985D8d2B71494aE1A2f723bb3Ed9E4) {
    +++ description: None
      sinceBlock:
+        5873
    }
```

```diff
    contract  (0xA658742d33ebd2ce2F0bdFf73515Aa797Fd161D9) {
    +++ description: None
      sinceBlock:
+        5885
    }
```

```diff
    contract  (0xA6Bf2bE6c60175601BF88217c75dD4b14ABB5FBb) {
    +++ description: None
      sinceBlock:
+        6153
    }
```

```diff
    contract UltraLightNodeV2 (0xFe7C30860D01e28371D40434806F4A8fcDD3A098) {
    +++ description: None
      sinceBlock:
+        5882
    }
```

Generated with discovered.json: 0xcc556d28c52d1f2f5ceecfbedd716445ee421c78

# Diff at Fri, 14 Feb 2025 10:21:43 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@166dc249bfa78df836dc8592e4a420bb82432150 block: 19516552
- current block number: 19948557

## Description

MS signer changes.

## Watched changes

```diff
    contract LayerZeroMultisig_pzkevm (0x8df01A9F8bE5776F4280B7056e13A0Fc0E007827) {
    +++ description: None
      values.$members.4:
+        "0x9F403140Bc0574D7d36eA472b82DAa1Bbd4eF327"
      values.$members.3:
-        "0x9F403140Bc0574D7d36eA472b82DAa1Bbd4eF327"
+        "0x73E9c017Ad37e2113e709D8070Cc9E1b28180e1e"
      values.$members.2:
-        "0x67FC8c432448f9a8d541C17579EF7a142378d5aD"
+        "0x112c737AeEbD2E52DEb9ff5c9c19497F1A1777b0"
      values.$members.1:
-        "0x73E9c017Ad37e2113e709D8070Cc9E1b28180e1e"
+        "0x771dcAcB96024d1e55Fd21Fe8a8187AA7EC9e77e"
      values.$members.0:
-        "0xBb6633cc267951E938F9B6421E4F54aa5b2c1936"
+        "0xB981a2664f5f547291Df5F8dCD4505f7015912CF"
      values.$threshold:
-        2
+        3
      values.multisigThreshold:
-        "2 of 4 (50%)"
+        "3 of 5 (60%)"
    }
```

Generated with discovered.json: 0x5a5689d85c86b10fe11d5e2bb0929a785f8ecaa6

# Diff at Mon, 20 Jan 2025 11:10:45 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@2c8b4f3d9910bb6371be9b4df87b70856e7d8c64 block: 14728552
- current block number: 14728552

## Description

Rerun on the same block number. Applies fixes to permissions and via field. Renames permission's target to to/from.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 14728552 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x3c2269811836af69497E5F486A85D7316753cf62) {
    +++ description: None
      receivedPermissions.0.target:
-        "0xA658742d33ebd2ce2F0bdFf73515Aa797Fd161D9"
      receivedPermissions.0.from:
+        "0xA658742d33ebd2ce2F0bdFf73515Aa797Fd161D9"
    }
```

```diff
    contract ProxyAdmin (0x967bAf657ec4d4b1cb00b06f7Cc6E8BA604e3AC8) {
    +++ description: None
      receivedPermissions.0.target:
-        "0xA6Bf2bE6c60175601BF88217c75dD4b14ABB5FBb"
      receivedPermissions.0.from:
+        "0xA6Bf2bE6c60175601BF88217c75dD4b14ABB5FBb"
    }
```

```diff
    contract  (0xA658742d33ebd2ce2F0bdFf73515Aa797Fd161D9) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x3c2269811836af69497E5F486A85D7316753cf62"
      issuedPermissions.0.to:
+        "0x3c2269811836af69497E5F486A85D7316753cf62"
    }
```

```diff
    contract  (0xA6Bf2bE6c60175601BF88217c75dD4b14ABB5FBb) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x967bAf657ec4d4b1cb00b06f7Cc6E8BA604e3AC8"
      issuedPermissions.0.to:
+        "0x967bAf657ec4d4b1cb00b06f7Cc6E8BA604e3AC8"
    }
```

Generated with discovered.json: 0xdf57fce5d6f49a86f9144662a7ba3a82ea76ce95

# Diff at Mon, 21 Oct 2024 11:15:19 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@8895d33866f5665c4c710f4ddaa32bfa63cc3c78 block: 14728552
- current block number: 14728552

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 14728552 (main branch discovery), not current.

```diff
    contract  (0xA658742d33ebd2ce2F0bdFf73515Aa797Fd161D9) {
    +++ description: None
      values.$pastUpgrades.1.2:
+        ["0xF622DFb40bf7340DBCf1e5147D6CFD95d7c5cF1F"]
      values.$pastUpgrades.1.1:
-        ["0xF622DFb40bf7340DBCf1e5147D6CFD95d7c5cF1F"]
+        "0xa4689e5bc9adcabcd6ae41acea1de59dda7e03f386829c1ac180a60008981650"
      values.$pastUpgrades.0.2:
+        ["0xC5fd9570ac1A5dAb9edA7839bD33229252B0C05d"]
      values.$pastUpgrades.0.1:
-        ["0xC5fd9570ac1A5dAb9edA7839bD33229252B0C05d"]
+        "0x0bffba3e49b5ef798fb426ca159552d8719c8c32365c8a37de18ca6cc64b5af2"
    }
```

```diff
    contract  (0xA6Bf2bE6c60175601BF88217c75dD4b14ABB5FBb) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0x0cA22b3dB505E13a9F40e6AB6DAf33B37D98Cf2f"]
      values.$pastUpgrades.0.1:
-        ["0x0cA22b3dB505E13a9F40e6AB6DAf33B37D98Cf2f"]
+        "0x684e89a37563bccdae1d451436093e0b3dffb06e0b690f949bb5598f1caf20fd"
    }
```

Generated with discovered.json: 0xcaac5291e2e69cc78639014dacf0ede4517b829a

# Diff at Mon, 14 Oct 2024 11:00:35 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1afc77ff111ceb0970e7d09efcc7b2f376b0c281 block: 14728552
- current block number: 14728552

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 14728552 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x3c2269811836af69497E5F486A85D7316753cf62) {
    +++ description: None
      sourceHashes:
+        ["0xeb95d39e1b35f76b6331da863f87bf2e148dd21abf5666590443b65f6a125630"]
    }
```

```diff
    contract LayerZeroMultisig_pzkevm (0x8df01A9F8bE5776F4280B7056e13A0Fc0E007827) {
    +++ description: None
      sourceHashes:
+        ["0x81a7349eebb98ac33b0bc6842e3cb258034a8f2a4ba004570bb8e2e25947f9ff","0x59fe14e95a8aa7f52213f18bae5c9329cf583a7ba31194698b15eddb97d5e825"]
    }
```

```diff
    contract ProxyAdmin (0x967bAf657ec4d4b1cb00b06f7Cc6E8BA604e3AC8) {
    +++ description: None
      sourceHashes:
+        ["0xeb95d39e1b35f76b6331da863f87bf2e148dd21abf5666590443b65f6a125630"]
    }
```

```diff
    contract Endpoint (0x9740FF91F1985D8d2B71494aE1A2f723bb3Ed9E4) {
    +++ description: None
      sourceHashes:
+        ["0x945c3299d0cf62b9ea7a77d6328295d54327299d6a153e1e7b48d85fa9b77215"]
    }
```

```diff
    contract UltraLightNodeV2 (0xFe7C30860D01e28371D40434806F4A8fcDD3A098) {
    +++ description: None
      sourceHashes:
+        ["0x38c85ab54f670eaa1fc2b351aee39913bc12e2b26c460ee31cf89d3f1f7d59b9"]
    }
```

Generated with discovered.json: 0x16225718d9d07a3022b8a5d1c00e28f1c30a0027

# Diff at Tue, 01 Oct 2024 11:14:06 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bd754dc73c66120164006054f8d25c5fae9cd910 block: 14728552
- current block number: 14728552

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 14728552 (main branch discovery), not current.

```diff
    contract  (0xA658742d33ebd2ce2F0bdFf73515Aa797Fd161D9) {
    +++ description: None
      values.$pastUpgrades:
+        [["2023-04-23T03:26:01.000Z",["0xC5fd9570ac1A5dAb9edA7839bD33229252B0C05d"]],["2023-06-26T22:49:44.000Z",["0xF622DFb40bf7340DBCf1e5147D6CFD95d7c5cF1F"]]]
    }
```

```diff
    contract  (0xA6Bf2bE6c60175601BF88217c75dD4b14ABB5FBb) {
    +++ description: None
      values.$pastUpgrades:
+        [["2023-04-27T02:17:19.000Z",["0x0cA22b3dB505E13a9F40e6AB6DAf33B37D98Cf2f"]]]
    }
```

Generated with discovered.json: 0xcc074ed67134cb14c3426313a0644338d20d8a60

# Diff at Fri, 30 Aug 2024 08:17:39 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@6c1bd1f41fadf5f2cb1c1805b5a2c6138a3ed35a block: 14728552
- current block number: 14728552

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 14728552 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x3c2269811836af69497E5F486A85D7316753cf62) {
    +++ description: None
      receivedPermissions.0.via:
-        []
    }
```

```diff
    contract ProxyAdmin (0x967bAf657ec4d4b1cb00b06f7Cc6E8BA604e3AC8) {
    +++ description: None
      receivedPermissions.0.via:
-        []
    }
```

Generated with discovered.json: 0xea3b1a3daf0c1bbe612fb67b2207c16fcedc3e1f

# Diff at Fri, 23 Aug 2024 09:58:44 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@67597c7d6c810bc726594446890178150240711e block: 14728552
- current block number: 14728552

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 14728552 (main branch discovery), not current.

```diff
    contract  (0xA658742d33ebd2ce2F0bdFf73515Aa797Fd161D9) {
    +++ description: None
      values.$upgradeCount:
+        2
    }
```

```diff
    contract  (0xA6Bf2bE6c60175601BF88217c75dD4b14ABB5FBb) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

Generated with discovered.json: 0xed9f51a6e624dd96674a25c5ace7033896fbb18e

# Diff at Wed, 21 Aug 2024 10:08:40 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@2f6dde3357bf5d79196b6e94f79d853a6c4ec72b block: 14728552
- current block number: 14728552

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 14728552 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x3c2269811836af69497E5F486A85D7316753cf62) {
    +++ description: None
      assignedPermissions:
-        {"upgrade":["0xA658742d33ebd2ce2F0bdFf73515Aa797Fd161D9"]}
      receivedPermissions:
+        [{"permission":"upgrade","target":"0xA658742d33ebd2ce2F0bdFf73515Aa797Fd161D9","via":[]}]
    }
```

```diff
    contract ProxyAdmin (0x967bAf657ec4d4b1cb00b06f7Cc6E8BA604e3AC8) {
    +++ description: None
      assignedPermissions:
-        {"upgrade":["0xA6Bf2bE6c60175601BF88217c75dD4b14ABB5FBb"]}
      receivedPermissions:
+        [{"permission":"upgrade","target":"0xA6Bf2bE6c60175601BF88217c75dD4b14ABB5FBb","via":[]}]
    }
```

```diff
    contract  (0xA658742d33ebd2ce2F0bdFf73515Aa797Fd161D9) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x3c2269811836af69497E5F486A85D7316753cf62","via":[]}]
    }
```

```diff
    contract  (0xA6Bf2bE6c60175601BF88217c75dD4b14ABB5FBb) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x967bAf657ec4d4b1cb00b06f7Cc6E8BA604e3AC8","via":[]}]
    }
```

Generated with discovered.json: 0x21f9acb0dcfac045f6cc451f7a7b1559cf5bb4b3

# Diff at Fri, 09 Aug 2024 10:14:46 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f0da1d0aab7bc6b3b5e54e7e93480bd98e57035 block: 14728552
- current block number: 14728552

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 14728552 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x3c2269811836af69497E5F486A85D7316753cf62) {
    +++ description: None
      assignedPermissions.admin:
-        ["0xA658742d33ebd2ce2F0bdFf73515Aa797Fd161D9"]
      assignedPermissions.upgrade:
+        ["0xA658742d33ebd2ce2F0bdFf73515Aa797Fd161D9"]
    }
```

```diff
    contract LayerZeroMultisig_pzkevm (0x8df01A9F8bE5776F4280B7056e13A0Fc0E007827) {
    +++ description: None
      values.$multisigThreshold:
-        "2 of 4 (50%)"
      values.getOwners:
-        ["0xBb6633cc267951E938F9B6421E4F54aa5b2c1936","0x73E9c017Ad37e2113e709D8070Cc9E1b28180e1e","0x67FC8c432448f9a8d541C17579EF7a142378d5aD","0x9F403140Bc0574D7d36eA472b82DAa1Bbd4eF327"]
      values.getThreshold:
-        2
      values.$members:
+        ["0xBb6633cc267951E938F9B6421E4F54aa5b2c1936","0x73E9c017Ad37e2113e709D8070Cc9E1b28180e1e","0x67FC8c432448f9a8d541C17579EF7a142378d5aD","0x9F403140Bc0574D7d36eA472b82DAa1Bbd4eF327"]
      values.$threshold:
+        2
      values.multisigThreshold:
+        "2 of 4 (50%)"
    }
```

```diff
    contract ProxyAdmin (0x967bAf657ec4d4b1cb00b06f7Cc6E8BA604e3AC8) {
    +++ description: None
      assignedPermissions.admin:
-        ["0xA6Bf2bE6c60175601BF88217c75dD4b14ABB5FBb"]
      assignedPermissions.upgrade:
+        ["0xA6Bf2bE6c60175601BF88217c75dD4b14ABB5FBb"]
    }
```

Generated with discovered.json: 0xd91796983ecd0735f26ad2122f3a9ab94878b2ef

# Diff at Mon, 27 May 2024 13:20:40 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@bd6b9ab7ea90501ef9c16ad40295a3c38f7dd0cb block: 11870389
- current block number: 12848751

## Description

Hide the nonce of the L2 Multisig from the discovery updates as it is too noisy.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 11870389 (main branch discovery), not current.

```diff
    contract GnosisSafeL2 (0x8df01A9F8bE5776F4280B7056e13A0Fc0E007827) {
    +++ description: None
      name:
-        "GnosisSafeL2"
+        "LayerZeroMultisig_pzkevm"
      values.nonce:
-        26
    }
```

Generated with discovered.json: 0xae1093daefd3ed5c33eb23de15d5e6e6410db6dd

# Diff at Tue, 23 Apr 2024 13:25:12 GMT:

- author: sekuba (<sekuba@users.noreply.githum.com>)
- comparing to: main@c9af11bd773e0770f181b9628ed0e91c093b8bd0 block: 11123143
- current block number: 11870389

## Description

The Endpoint- and UltraLightNodeV2 owners now point to a Multisig. (Was EOA before)

## Watched changes

```diff
    contract Endpoint (0x9740FF91F1985D8d2B71494aE1A2f723bb3Ed9E4) {
    +++ description: None
      values.owner:
-        "0x9F403140Bc0574D7d36eA472b82DAa1Bbd4eF327"
+        "0x8df01A9F8bE5776F4280B7056e13A0Fc0E007827"
    }
```

```diff
    contract UltraLightNodeV2 (0xFe7C30860D01e28371D40434806F4A8fcDD3A098) {
    +++ description: None
      values.owner:
-        "0x9F403140Bc0574D7d36eA472b82DAa1Bbd4eF327"
+        "0x8df01A9F8bE5776F4280B7056e13A0Fc0E007827"
    }
```

```diff
+   Status: CREATED
    contract GnosisSafeL2 (0x8df01A9F8bE5776F4280B7056e13A0Fc0E007827)
    +++ description: None
```

## Source code changes

```diff
.../implementation/contracts/GnosisSafe.sol        | 422 +++++++++++++++++++++
 .../implementation/contracts/GnosisSafeL2.sol      |  86 +++++
 .../implementation/contracts/base/Executor.sol     |  27 ++
 .../contracts/base/FallbackManager.sol             |  53 +++
 .../implementation/contracts/base/GuardManager.sol |  50 +++
 .../contracts/base/ModuleManager.sol               | 133 +++++++
 .../implementation/contracts/base/OwnerManager.sol | 149 ++++++++
 .../implementation/contracts/common/Enum.sol       |   8 +
 .../contracts/common/EtherPaymentFallback.sol      |  13 +
 .../contracts/common/SecuredTokenTransfer.sol      |  35 ++
 .../contracts/common/SelfAuthorized.sol            |  16 +
 .../contracts/common/SignatureDecoder.sol          |  36 ++
 .../implementation/contracts/common/Singleton.sol  |  11 +
 .../contracts/common/StorageAccessible.sol         |  47 +++
 .../contracts/external/GnosisSafeMath.sol          |  54 +++
 .../contracts/interfaces/ISignatureValidator.sol   |  20 +
 .../.code/GnosisSafeL2/implementation/meta.txt     |   2 +
 .../proxy/contracts/proxies/GnosisSafeProxy.sol    |  44 +++
 .../polygonzkevm/.code/GnosisSafeL2/proxy/meta.txt |   2 +
 19 files changed, 1208 insertions(+)
```

Generated with discovered.json: 0x14c2c1953c2c6c06361ba149c9b0fd65b42d4395

# Diff at Wed, 06 Mar 2024 11:41:58 GMT:

- author: Michał Sobieraj-Jakubiec (<michalsidzej@gmail.com>)
- comparing to: main@1a2512004b35590384683b93c95d8ec95426d2a6 block: 9115900
- current block number: 10513424

## Description

Added v2 contracts to libraryLookup

## Watched changes

```diff
    contract Endpoint (0x9740FF91F1985D8d2B71494aE1A2f723bb3Ed9E4) {
    +++ description: None
      values.latestVersion:
-        1
+        3
      values.libraryLookup[2]:
+        "0x23ec43e2b8f9aE21D895eEa5a1a9c444fe301044"
      values.libraryLookup[1]:
+        "0x8161B3B224Cd6ce37cC20BE61607C3E19eC2A8A6"
    }
```

Generated with discovered.json: 0x1cbb4540e92edc35852de9bde14c986343fdd000

# Diff at Tue, 09 Jan 2024 16:43:38 GMT:

- author: Michał Sobieraj-Jakubiec (<michalsidzej@gmail.com>)
- comparing to: main@0b578574e6a64020b5157f700c09de14e6b3eed3 block: 3763915
- current block number: 9115900

## Description

Unified configurations across L2s. Few new remote chains configurations added.

## Watched changes

```diff
    contract UltraLightNodeV2 (0xFe7C30860D01e28371D40434806F4A8fcDD3A098) {
      values.chainAddressSizeMap.126:
+        20
      values.chainAddressSizeMap.202:
+        20
      values.chainAddressSizeMap.210:
+        20
      values.chainAddressSizeMap.214:
+        20
      values.defaultAdapterParams.126:
+        {"proofType":2,"adapterParams":"0x00010000000000000000000000000000000000000000000000000000000000030d40"}
      values.defaultAdapterParams.202:
+        {"proofType":2,"adapterParams":"0x00010000000000000000000000000000000000000000000000000000000000030d40"}
      values.defaultAdapterParams.210:
+        {"proofType":2,"adapterParams":"0x00010000000000000000000000000000000000000000000000000000000000030d40"}
      values.defaultAdapterParams.214:
+        {"proofType":2,"adapterParams":"0x00010000000000000000000000000000000000000000000000000000000000030d40"}
      values.defaultAppConfig.108.inboundBlockConfirm:
-        500000
+        260
      values.defaultAppConfig.126:
+        {"inboundProofLib":2,"inboundBlockConfirm":10,"outboundProofType":2,"outboundBlockConfirm":20,"oracle":"0xA6Bf2bE6c60175601BF88217c75dD4b14ABB5FBb","relayer":"0xA658742d33ebd2ce2F0bdFf73515Aa797Fd161D9"}
      values.defaultAppConfig.202:
+        {"inboundProofLib":2,"inboundBlockConfirm":5,"outboundProofType":2,"outboundBlockConfirm":20,"oracle":"0xA6Bf2bE6c60175601BF88217c75dD4b14ABB5FBb","relayer":"0xA658742d33ebd2ce2F0bdFf73515Aa797Fd161D9"}
      values.defaultAppConfig.210:
+        {"inboundProofLib":2,"inboundBlockConfirm":5,"outboundProofType":2,"outboundBlockConfirm":20,"oracle":"0xA6Bf2bE6c60175601BF88217c75dD4b14ABB5FBb","relayer":"0xA658742d33ebd2ce2F0bdFf73515Aa797Fd161D9"}
      values.defaultAppConfig.214:
+        {"inboundProofLib":2,"inboundBlockConfirm":5,"outboundProofType":2,"outboundBlockConfirm":20,"oracle":"0xA6Bf2bE6c60175601BF88217c75dD4b14ABB5FBb","relayer":"0xA658742d33ebd2ce2F0bdFf73515Aa797Fd161D9"}
      values.inboundProofLibrary.126:
+        ["0x38dE71124f7a447a01D67945a51eDcE9FF491251","0x66A71Dcef29A0fFBDBE3c6a460a3B5BC225Cd675"]
      values.inboundProofLibrary.202:
+        ["0x38dE71124f7a447a01D67945a51eDcE9FF491251","0x66A71Dcef29A0fFBDBE3c6a460a3B5BC225Cd675"]
      values.inboundProofLibrary.210:
+        ["0x38dE71124f7a447a01D67945a51eDcE9FF491251","0x66A71Dcef29A0fFBDBE3c6a460a3B5BC225Cd675"]
      values.inboundProofLibrary.214:
+        ["0x38dE71124f7a447a01D67945a51eDcE9FF491251","0x66A71Dcef29A0fFBDBE3c6a460a3B5BC225Cd675"]
      values.supportedOutboundProof.126:
+        2
      values.supportedOutboundProof.202:
+        2
      values.supportedOutboundProof.210:
+        2
      values.supportedOutboundProof.214:
+        2
      values.ulnLookup.126:
+        "0x0000000000000000000000004d73adb72bc3dd368966edd0f0b2148401a178e2"
      values.ulnLookup.202:
+        "0x00000000000000000000000038de71124f7a447a01d67945a51edce9ff491251"
      values.ulnLookup.210:
+        "0x00000000000000000000000038de71124f7a447a01d67945a51edce9ff491251"
      values.ulnLookup.214:
+        "0x00000000000000000000000038de71124f7a447a01d67945a51edce9ff491251"
    }
```

## Source code changes

```diff
.../polygon-zkevm/{.code@3763915 => .code}/ProxyAdmin/meta.txt          | 2 +-
 discovery/lzomnichain/polygon-zkevm/{.code@3763915 => .code}/meta.txt   | 2 +-
 2 files changed, 2 insertions(+), 2 deletions(-)
```

## Config related changes

Following changes come from updates made to the config file,
not from differences found during discovery. Values are
for block 3763915 (main branch discovery), not current.

```diff
    contract  (0x2D61DCDD36F10b22176E0433B86F74567d529aAa) {
      sinceTimestamp:
+        1679974014
    }
```

```diff
    contract  (0x6F475642a6e85809B1c36Fa62763669b1b48DD5B) {
      sinceTimestamp:
+        1679974072
    }
```

```diff
    contract Endpoint (0x9740FF91F1985D8d2B71494aE1A2f723bb3Ed9E4) {
      values.libraryLookup:
+        ["0xFe7C30860D01e28371D40434806F4A8fcDD3A098"]
      sinceTimestamp:
+        1679974014
    }
```

```diff
    contract UltraLightNodeV2 (0xFe7C30860D01e28371D40434806F4A8fcDD3A098) {
      values.chainAddressSizeMap:
+        {"101":20,"102":20,"106":20,"108":32,"109":20,"110":20,"111":20,"112":20,"125":20,"145":20,"151":20,"158":20,"165":20,"177":20,"181":20,"183":20,"184":20}
      values.defaultAdapterParams:
+        {"101":{"proofType":2,"adapterParams":"0x00010000000000000000000000000000000000000000000000000000000000030d40"},"102":{"proofType":2,"adapterParams":"0x00010000000000000000000000000000000000000000000000000000000000030d40"},"106":{"proofType":2,"adapterParams":"0x00010000000000000000000000000000000000000000000000000000000000030d40"},"108":{"proofType":2,"adapterParams":"0x000100000000000000000000000000000000000000000000000000000000000009c4"},"109":{"proofType":2,"adapterParams":"0x00010000000000000000000000000000000000000000000000000000000000030d40"},"110":{"proofType":2,"adapterParams":"0x00010000000000000000000000000000000000000000000000000000000000030d40"},"111":{"proofType":2,"adapterParams":"0x00010000000000000000000000000000000000000000000000000000000000030d40"},"112":{"proofType":2,"adapterParams":"0x00010000000000000000000000000000000000000000000000000000000000030d40"},"125":{"proofType":2,"adapterParams":"0x00010000000000000000000000000000000000000000000000000000000000030d40"},"145":{"proofType":2,"adapterParams":"0x00010000000000000000000000000000000000000000000000000000000000030d40"},"151":{"proofType":2,"adapterParams":"0x00010000000000000000000000000000000000000000000000000000000000030d40"},"158":{"proofType":2,"adapterParams":"0x00010000000000000000000000000000000000000000000000000000000000030d40"},"165":{"proofType":2,"adapterParams":"0x000100000000000000000000000000000000000000000000000000000000003d0900"},"177":{"proofType":2,"adapterParams":"0x00010000000000000000000000000000000000000000000000000000000000030d40"},"181":{"proofType":2,"adapterParams":"0x00010000000000000000000000000000000000000000000000000000000000030d40"},"183":{"proofType":2,"adapterParams":"0x00010000000000000000000000000000000000000000000000000000000000030d40"},"184":{"proofType":2,"adapterParams":"0x00010000000000000000000000000000000000000000000000000000000000030d40"}}
      values.defaultAppConfig:
+        {"101":{"inboundProofLib":2,"inboundBlockConfirm":15,"outboundProofType":2,"outboundBlockConfirm":20,"oracle":"0xA6Bf2bE6c60175601BF88217c75dD4b14ABB5FBb","relayer":"0xA658742d33ebd2ce2F0bdFf73515Aa797Fd161D9"},"102":{"inboundProofLib":2,"inboundBlockConfirm":20,"outboundProofType":2,"outboundBlockConfirm":20,"oracle":"0xA6Bf2bE6c60175601BF88217c75dD4b14ABB5FBb","relayer":"0xA658742d33ebd2ce2F0bdFf73515Aa797Fd161D9"},"106":{"inboundProofLib":2,"inboundBlockConfirm":12,"outboundProofType":2,"outboundBlockConfirm":20,"oracle":"0xA6Bf2bE6c60175601BF88217c75dD4b14ABB5FBb","relayer":"0xA658742d33ebd2ce2F0bdFf73515Aa797Fd161D9"},"108":{"inboundProofLib":1,"inboundBlockConfirm":500000,"outboundProofType":2,"outboundBlockConfirm":20,"oracle":"0xA6Bf2bE6c60175601BF88217c75dD4b14ABB5FBb","relayer":"0xA658742d33ebd2ce2F0bdFf73515Aa797Fd161D9"},"109":{"inboundProofLib":2,"inboundBlockConfirm":512,"outboundProofType":2,"outboundBlockConfirm":20,"oracle":"0xA6Bf2bE6c60175601BF88217c75dD4b14ABB5FBb","relayer":"0xA658742d33ebd2ce2F0bdFf73515Aa797Fd161D9"},"110":{"inboundProofLib":2,"inboundBlockConfirm":20,"outboundProofType":2,"outboundBlockConfirm":20,"oracle":"0xA6Bf2bE6c60175601BF88217c75dD4b14ABB5FBb","relayer":"0xA658742d33ebd2ce2F0bdFf73515Aa797Fd161D9"},"111":{"inboundProofLib":2,"inboundBlockConfirm":20,"outboundProofType":2,"outboundBlockConfirm":20,"oracle":"0xA6Bf2bE6c60175601BF88217c75dD4b14ABB5FBb","relayer":"0xA658742d33ebd2ce2F0bdFf73515Aa797Fd161D9"},"112":{"inboundProofLib":2,"inboundBlockConfirm":5,"outboundProofType":2,"outboundBlockConfirm":20,"oracle":"0xA6Bf2bE6c60175601BF88217c75dD4b14ABB5FBb","relayer":"0xA658742d33ebd2ce2F0bdFf73515Aa797Fd161D9"},"125":{"inboundProofLib":2,"inboundBlockConfirm":5,"outboundProofType":2,"outboundBlockConfirm":20,"oracle":"0xA6Bf2bE6c60175601BF88217c75dD4b14ABB5FBb","relayer":"0xA658742d33ebd2ce2F0bdFf73515Aa797Fd161D9"},"145":{"inboundProofLib":2,"inboundBlockConfirm":5,"outboundProofType":2,"outboundBlockConfirm":20,"oracle":"0xA6Bf2bE6c60175601BF88217c75dD4b14ABB5FBb","relayer":"0xA658742d33ebd2ce2F0bdFf73515Aa797Fd161D9"},"151":{"inboundProofLib":2,"inboundBlockConfirm":5,"outboundProofType":2,"outboundBlockConfirm":20,"oracle":"0xA6Bf2bE6c60175601BF88217c75dD4b14ABB5FBb","relayer":"0xA658742d33ebd2ce2F0bdFf73515Aa797Fd161D9"},"158":{"inboundProofLib":2,"inboundBlockConfirm":20,"outboundProofType":2,"outboundBlockConfirm":20,"oracle":"0xA6Bf2bE6c60175601BF88217c75dD4b14ABB5FBb","relayer":"0xA658742d33ebd2ce2F0bdFf73515Aa797Fd161D9"},"165":{"inboundProofLib":1,"inboundBlockConfirm":20,"outboundProofType":2,"outboundBlockConfirm":20,"oracle":"0xA6Bf2bE6c60175601BF88217c75dD4b14ABB5FBb","relayer":"0xA658742d33ebd2ce2F0bdFf73515Aa797Fd161D9"},"177":{"inboundProofLib":2,"inboundBlockConfirm":2,"outboundProofType":2,"outboundBlockConfirm":20,"oracle":"0xA6Bf2bE6c60175601BF88217c75dD4b14ABB5FBb","relayer":"0xA658742d33ebd2ce2F0bdFf73515Aa797Fd161D9"},"181":{"inboundProofLib":2,"inboundBlockConfirm":2,"outboundProofType":2,"outboundBlockConfirm":20,"oracle":"0xA6Bf2bE6c60175601BF88217c75dD4b14ABB5FBb","relayer":"0xA658742d33ebd2ce2F0bdFf73515Aa797Fd161D9"},"183":{"inboundProofLib":2,"inboundBlockConfirm":10,"outboundProofType":2,"outboundBlockConfirm":20,"oracle":"0xA6Bf2bE6c60175601BF88217c75dD4b14ABB5FBb","relayer":"0xA658742d33ebd2ce2F0bdFf73515Aa797Fd161D9"},"184":{"inboundProofLib":2,"inboundBlockConfirm":10,"outboundProofType":2,"outboundBlockConfirm":20,"oracle":"0xA6Bf2bE6c60175601BF88217c75dD4b14ABB5FBb","relayer":"0xA658742d33ebd2ce2F0bdFf73515Aa797Fd161D9"}}
      values.inboundProofLibrary:
+        {"101":["0x38dE71124f7a447a01D67945a51eDcE9FF491251","0x66A71Dcef29A0fFBDBE3c6a460a3B5BC225Cd675"],"102":["0x38dE71124f7a447a01D67945a51eDcE9FF491251","0x66A71Dcef29A0fFBDBE3c6a460a3B5BC225Cd675"],"106":["0x38dE71124f7a447a01D67945a51eDcE9FF491251","0x66A71Dcef29A0fFBDBE3c6a460a3B5BC225Cd675"],"108":"0x66A71Dcef29A0fFBDBE3c6a460a3B5BC225Cd675","109":["0x38dE71124f7a447a01D67945a51eDcE9FF491251","0x66A71Dcef29A0fFBDBE3c6a460a3B5BC225Cd675"],"110":["0x38dE71124f7a447a01D67945a51eDcE9FF491251","0x66A71Dcef29A0fFBDBE3c6a460a3B5BC225Cd675"],"111":["0x38dE71124f7a447a01D67945a51eDcE9FF491251","0x66A71Dcef29A0fFBDBE3c6a460a3B5BC225Cd675"],"112":["0x38dE71124f7a447a01D67945a51eDcE9FF491251","0x66A71Dcef29A0fFBDBE3c6a460a3B5BC225Cd675"],"125":["0x38dE71124f7a447a01D67945a51eDcE9FF491251","0x66A71Dcef29A0fFBDBE3c6a460a3B5BC225Cd675"],"145":["0x38dE71124f7a447a01D67945a51eDcE9FF491251","0x66A71Dcef29A0fFBDBE3c6a460a3B5BC225Cd675"],"151":["0x38dE71124f7a447a01D67945a51eDcE9FF491251","0x66A71Dcef29A0fFBDBE3c6a460a3B5BC225Cd675"],"158":["0x38dE71124f7a447a01D67945a51eDcE9FF491251","0x66A71Dcef29A0fFBDBE3c6a460a3B5BC225Cd675"],"165":"0x66A71Dcef29A0fFBDBE3c6a460a3B5BC225Cd675","177":["0x38dE71124f7a447a01D67945a51eDcE9FF491251","0x66A71Dcef29A0fFBDBE3c6a460a3B5BC225Cd675"],"181":["0x38dE71124f7a447a01D67945a51eDcE9FF491251","0x66A71Dcef29A0fFBDBE3c6a460a3B5BC225Cd675"],"183":["0x38dE71124f7a447a01D67945a51eDcE9FF491251","0x66A71Dcef29A0fFBDBE3c6a460a3B5BC225Cd675"],"184":["0x38dE71124f7a447a01D67945a51eDcE9FF491251","0x66A71Dcef29A0fFBDBE3c6a460a3B5BC225Cd675"]}
      values.supportedOutboundProof:
+        {"101":2,"102":2,"106":2,"108":2,"109":2,"110":2,"111":2,"112":2,"125":2,"145":2,"151":2,"158":2,"165":2,"177":2,"181":2,"183":2,"184":2}
      values.ulnLookup:
+        {"101":"0x0000000000000000000000004d73adb72bc3dd368966edd0f0b2148401a178e2","102":"0x0000000000000000000000004d73adb72bc3dd368966edd0f0b2148401a178e2","106":"0x0000000000000000000000004d73adb72bc3dd368966edd0f0b2148401a178e2","108":"0x54ad3d30af77b60d939ae356e6606de9a4da67583f02b962d2d3f2e481484e90","109":"0x0000000000000000000000004d73adb72bc3dd368966edd0f0b2148401a178e2","110":"0x0000000000000000000000004d73adb72bc3dd368966edd0f0b2148401a178e2","111":"0x0000000000000000000000004d73adb72bc3dd368966edd0f0b2148401a178e2","112":"0x0000000000000000000000004d73adb72bc3dd368966edd0f0b2148401a178e2","125":"0x000000000000000000000000377530cda84dfb2673bf4d145dcf0c4d7fdcb5b6","145":"0x00000000000000000000000038de71124f7a447a01d67945a51edce9ff491251","151":"0x00000000000000000000000038de71124f7a447a01d67945a51edce9ff491251","158":"0x000000000000000000000000fe7c30860d01e28371d40434806f4a8fcdd3a098","165":"0x000000000000000000000000042b8289c97896529ec2fe49ba1a8b9c956a86cc","177":"0x00000000000000000000000038de71124f7a447a01d67945a51edce9ff491251","181":"0x00000000000000000000000038de71124f7a447a01d67945a51edce9ff491251","183":"0x00000000000000000000000038de71124f7a447a01d67945a51edce9ff491251","184":"0x00000000000000000000000038de71124f7a447a01d67945a51edce9ff491251"}
      sinceTimestamp:
+        1679974014
    }
```

```diff
+   Status: CREATED
    contract  (0x38dE71124f7a447a01D67945a51eDcE9FF491251) {
    }
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x3c2269811836af69497E5F486A85D7316753cf62) {
    }
```

```diff
+   Status: CREATED
    contract  (0x66A71Dcef29A0fFBDBE3c6a460a3B5BC225Cd675) {
    }
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x967bAf657ec4d4b1cb00b06f7Cc6E8BA604e3AC8) {
    }
```

```diff
+   Status: CREATED
    contract  (0xA658742d33ebd2ce2F0bdFf73515Aa797Fd161D9) {
    }
```

```diff
+   Status: CREATED
    contract  (0xA6Bf2bE6c60175601BF88217c75dD4b14ABB5FBb) {
    }
```
