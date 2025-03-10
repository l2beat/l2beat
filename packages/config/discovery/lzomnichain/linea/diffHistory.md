Generated with discovered.json: 0x75fe2e98e567fef73b60dbe29591a7d8a3a81d01

# Diff at Tue, 04 Mar 2025 10:41:19 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@98d260b45fe0d2195ce5e629bd7b200c8706e8ba block: 15810626
- current block number: 15810626

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 15810626 (main branch discovery), not current.

```diff
    contract MPTValidator01 (0x2D61DCDD36F10b22176E0433B86F74567d529aAa) {
    +++ description: None
      sinceBlock:
+        649
    }
```

```diff
    contract UltraLightNodeV2 (0x38dE71124f7a447a01D67945a51eDcE9FF491251) {
    +++ description: None
      sinceBlock:
+        651
    }
```

```diff
    contract LayerZero Multisig (0x5e306343ecf32B605d88c1e44f3879699ab5144D) {
    +++ description: None
      sinceBlock:
+        186388
    }
```

```diff
    contract NonceContract (0x66A71Dcef29A0fFBDBE3c6a460a3B5BC225Cd675) {
    +++ description: None
      sinceBlock:
+        650
    }
```

```diff
    contract TreasuryV2 (0x980205D352F198748B626f6f7C38A8a5663Ec981) {
    +++ description: None
      sinceBlock:
+        652
    }
```

```diff
    contract  (0xA658742d33ebd2ce2F0bdFf73515Aa797Fd161D9) {
    +++ description: None
      sinceBlock:
+        655
    }
```

```diff
    contract Endpoint (0xb6319cC6c8c27A8F5dAF0dD3DF91EA35C4720dd7) {
    +++ description: None
      sinceBlock:
+        647
    }
```

```diff
    contract FPValidator (0xC1b15d3B262bEeC0e3565C11C9e0F6134BdaCB36) {
    +++ description: None
      sinceBlock:
+        648
    }
```

```diff
    contract  (0xcb566e3B6934Fa77258d68ea18E931fa75e1aaAa) {
    +++ description: None
      sinceBlock:
+        657
    }
```

```diff
    contract VerifierNetwork (0xD56e4eAb23cb81f43168F9F45211Eb027b9aC7cc) {
    +++ description: None
      sinceBlock:
+        378338
    }
```

```diff
    contract VerifierFeeLib (0xdeA04ef31C4B4FDf31CB58923F37869739280d49) {
    +++ description: None
      sinceBlock:
+        378339
    }
```

```diff
    contract  (0xFe7C30860D01e28371D40434806F4A8fcDD3A098) {
    +++ description: None
      sinceBlock:
+        653
    }
```

Generated with discovered.json: 0x517a2caf7de2949a973039e73c67c38d53b17059

# Diff at Fri, 14 Feb 2025 10:20:20 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@166dc249bfa78df836dc8592e4a420bb82432150 block: 11108774
- current block number: 15810626

## Description

MS signer changes.

## Watched changes

```diff
    contract LayerZero Multisig (0x5e306343ecf32B605d88c1e44f3879699ab5144D) {
    +++ description: None
      values.$members.3:
-        "0xf1f5E3777a3ADBe6f3289AD6b21eae6427dfb553"
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
-        "2 of 5 (40%)"
+        "3 of 5 (60%)"
    }
```

Generated with discovered.json: 0xdd0871e2c87b3ac130f38f42eebcaed2e9e72665

# Diff at Mon, 20 Jan 2025 11:10:44 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@2c8b4f3d9910bb6371be9b4df87b70856e7d8c64 block: 11108774
- current block number: 11108774

## Description

Rerun on the same block number. Applies fixes to permissions and via field. Renames permission's target to to/from.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 11108774 (main branch discovery), not current.

```diff
    contract  (0xA658742d33ebd2ce2F0bdFf73515Aa797Fd161D9) {
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
-        "0xA658742d33ebd2ce2F0bdFf73515Aa797Fd161D9"
      receivedPermissions.0.from:
+        "0xA658742d33ebd2ce2F0bdFf73515Aa797Fd161D9"
    }
```

Generated with discovered.json: 0x331072c8c1f6fb903adc195deb21b864f8222312

# Diff at Mon, 21 Oct 2024 11:14:44 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@8895d33866f5665c4c710f4ddaa32bfa63cc3c78 block: 6393468
- current block number: 6393468

## Description

Config related.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 6393468 (main branch discovery), not current.

```diff
    contract  (0xA658742d33ebd2ce2F0bdFf73515Aa797Fd161D9) {
    +++ description: None
      values.$pastUpgrades.2.2:
+        ["0xC614E9C511a5149f1969F2CB0199d508bBB5b915"]
      values.$pastUpgrades.2.1:
-        ["0xC614E9C511a5149f1969F2CB0199d508bBB5b915"]
+        "0x32899d9143a2ea03680cd23ab7a3d62eaa47132232a71b7ac80d1ed6acc72a58"
      values.$pastUpgrades.1.2:
+        ["0xd27B2Fe1d0a60E06A0ec7e64501d2f15e6c65Bd9"]
      values.$pastUpgrades.1.1:
-        ["0xd27B2Fe1d0a60E06A0ec7e64501d2f15e6c65Bd9"]
+        "0xff74215370891d87c949c0f7a05a6514ade104ffc5addfc704680fc644688cea"
      values.$pastUpgrades.0.2:
+        ["0x5B19bd330A84c049b62D5B0FC2bA120217a18C1C"]
      values.$pastUpgrades.0.1:
-        ["0x5B19bd330A84c049b62D5B0FC2bA120217a18C1C"]
+        "0x89a4db6091313816b1a56948608303fe905eabf9626fb01fef4b0a33fad93be7"
    }
```

Generated with discovered.json: 0x697928d9c5346ad0ae7baf2c8caa8cc4f0638fb3

# Diff at Mon, 14 Oct 2024 11:00:20 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1afc77ff111ceb0970e7d09efcc7b2f376b0c281 block: 6393468
- current block number: 6393468

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 6393468 (main branch discovery), not current.

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
    contract LayerZero Multisig (0x5e306343ecf32B605d88c1e44f3879699ab5144D) {
    +++ description: None
      sourceHashes:
+        ["0x81a7349eebb98ac33b0bc6842e3cb258034a8f2a4ba004570bb8e2e25947f9ff","0xd42bbf9f7dcd3720a7fc6bdc6edfdfae8800a37d6dd4decfa0ef6ca4a2e88940"]
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

Generated with discovered.json: 0xa3ac8655e19857519361df9ccc63071a16f1d02b

# Diff at Tue, 01 Oct 2024 11:13:53 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bd754dc73c66120164006054f8d25c5fae9cd910 block: 6393468
- current block number: 6393468

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 6393468 (main branch discovery), not current.

```diff
    contract  (0xA658742d33ebd2ce2F0bdFf73515Aa797Fd161D9) {
    +++ description: None
      values.$pastUpgrades:
+        [["2023-07-14T16:23:48.000Z",["0x5B19bd330A84c049b62D5B0FC2bA120217a18C1C"]],["2023-09-20T19:41:08.000Z",["0xd27B2Fe1d0a60E06A0ec7e64501d2f15e6c65Bd9"]],["2023-09-22T14:20:47.000Z",["0xC614E9C511a5149f1969F2CB0199d508bBB5b915"]]]
    }
```

Generated with discovered.json: 0x604610eb14192595266efc8cff1c64135781e109

# Diff at Fri, 30 Aug 2024 08:17:29 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@6c1bd1f41fadf5f2cb1c1805b5a2c6138a3ed35a block: 6393468
- current block number: 6393468

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 6393468 (main branch discovery), not current.

```diff
    contract  (0xFe7C30860D01e28371D40434806F4A8fcDD3A098) {
    +++ description: None
      receivedPermissions.0.via:
-        []
    }
```

Generated with discovered.json: 0x14a0a28049c7fb5ae616e65a38d145a8b76b6822

# Diff at Fri, 23 Aug 2024 09:57:52 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@67597c7d6c810bc726594446890178150240711e block: 6393468
- current block number: 6393468

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 6393468 (main branch discovery), not current.

```diff
    contract  (0xA658742d33ebd2ce2F0bdFf73515Aa797Fd161D9) {
    +++ description: None
      values.$upgradeCount:
+        3
    }
```

Generated with discovered.json: 0x47e95690c38d24c6fb5342f699be8f43adb55e92

# Diff at Wed, 21 Aug 2024 10:08:15 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@2f6dde3357bf5d79196b6e94f79d853a6c4ec72b block: 6393468
- current block number: 6393468

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 6393468 (main branch discovery), not current.

```diff
    contract  (0xA658742d33ebd2ce2F0bdFf73515Aa797Fd161D9) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xFe7C30860D01e28371D40434806F4A8fcDD3A098","via":[]}]
    }
```

```diff
    contract  (0xFe7C30860D01e28371D40434806F4A8fcDD3A098) {
    +++ description: None
      assignedPermissions:
-        {"upgrade":["0xA658742d33ebd2ce2F0bdFf73515Aa797Fd161D9"]}
      receivedPermissions:
+        [{"permission":"upgrade","target":"0xA658742d33ebd2ce2F0bdFf73515Aa797Fd161D9","via":[]}]
    }
```

Generated with discovered.json: 0x6a4f7822cedaff44c544402377597c2345331cd9

# Diff at Fri, 09 Aug 2024 10:14:22 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f0da1d0aab7bc6b3b5e54e7e93480bd98e57035 block: 6393468
- current block number: 6393468

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 6393468 (main branch discovery), not current.

```diff
    contract LayerZero Multisig (0x5e306343ecf32B605d88c1e44f3879699ab5144D) {
    +++ description: None
      values.$multisigThreshold:
-        "2 of 5 (40%)"
      values.getOwners:
-        ["0xBb6633cc267951E938F9B6421E4F54aa5b2c1936","0x73E9c017Ad37e2113e709D8070Cc9E1b28180e1e","0x67FC8c432448f9a8d541C17579EF7a142378d5aD","0xf1f5E3777a3ADBe6f3289AD6b21eae6427dfb553","0x9F403140Bc0574D7d36eA472b82DAa1Bbd4eF327"]
      values.getThreshold:
-        2
      values.$members:
+        ["0xBb6633cc267951E938F9B6421E4F54aa5b2c1936","0x73E9c017Ad37e2113e709D8070Cc9E1b28180e1e","0x67FC8c432448f9a8d541C17579EF7a142378d5aD","0xf1f5E3777a3ADBe6f3289AD6b21eae6427dfb553","0x9F403140Bc0574D7d36eA472b82DAa1Bbd4eF327"]
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
-        ["0xA658742d33ebd2ce2F0bdFf73515Aa797Fd161D9"]
      assignedPermissions.upgrade:
+        ["0xA658742d33ebd2ce2F0bdFf73515Aa797Fd161D9"]
    }
```

Generated with discovered.json: 0xe0adae1e536411edad6663a7b3e219ec35a65883

# Diff at Fri, 05 Jul 2024 14:34:03 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@111fee0655d72e75c60324b920975e421fd852f7 block: 3199002
- current block number: 6393468

## Description

Config related.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 3199002 (main branch discovery), not current.

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

Generated with discovered.json: 0x4a21c6767c3d1a83ce5d8d08fef1680af4324194

# Diff at Thu, 28 Mar 2024 11:38:52 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@21187e63b9b90823a55c461c331868a470ce17eb block: 2891838
- current block number: 3199002

## Description

Update discovery to include the multisig threshold.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 2891838 (main branch discovery), not current.

```diff
    contract LayerZero Multisig (0x5e306343ecf32B605d88c1e44f3879699ab5144D) {
    +++ description: None
      upgradeability.threshold:
+        "2 of 5 (40%)"
    }
```

Generated with discovered.json: 0x0fbfbc6349ab32d430a883652e0ec7fc17f996ec

# Diff at Thu, 14 Mar 2024 14:08:40 GMT

- author: Michał Podsiadły (<michal.podsiadly@l2beat.com>)
- comparing to: main@3ffa91064379f34a2916a1ad4e93791b752e7e9e block: 2716939
- current block number: 2891838

## Description

New PriceFeed Oracle implementation has been deployed. Nothing that would affect protocol security has been changed.

## Watched changes

```diff
    contract  (0x3c2269811836af69497E5F486A85D7316753cf62) {
    +++ description: None
      upgradeability.implementation:
-        "0x4EE2F9B7cf3A68966c370F3eb2C16613d3235245"
+        "0x14751De27b194305C8f0e672921E0dd334bBe924"
      implementations.0:
-        "0x4EE2F9B7cf3A68966c370F3eb2C16613d3235245"
+        "0x14751De27b194305C8f0e672921E0dd334bBe924"
    }
```

## Source code changes

```diff
.../-0x3c2269811836af69497E5F486A85D7316753cf62/implementation/meta.txt | 2 +-
 1 file changed, 1 insertion(+), 1 deletion(-)
```

Generated with discovered.json: 0x2166dab4a25daf748938b343649919a73793ec5e

# Diff at Wed, 06 Mar 2024 11:48:26 GMT

- author: Michał Sobieraj-Jakubiec (<michalsidzej@gmail.com>)
- comparing to: main@1a2512004b35590384683b93c95d8ec95426d2a6 block: 1773788
- current block number: 2716939

## Description

Added v2 contracts to libraryLookup. Contracts are now owned by a gnosis safe multisig.

## Watched changes

```diff
    contract UltraLightNodeV2 (0x38dE71124f7a447a01D67945a51eDcE9FF491251) {
    +++ description: None
      values.owner:
-        "0x9F403140Bc0574D7d36eA472b82DAa1Bbd4eF327"
+        "0x5e306343ecf32B605d88c1e44f3879699ab5144D"
    }
```

```diff
    contract TreasuryV2 (0x980205D352F198748B626f6f7C38A8a5663Ec981) {
    +++ description: None
      values.owner:
-        "0x9F403140Bc0574D7d36eA472b82DAa1Bbd4eF327"
+        "0x5e306343ecf32B605d88c1e44f3879699ab5144D"
    }
```

```diff
    contract Endpoint (0xb6319cC6c8c27A8F5dAF0dD3DF91EA35C4720dd7) {
    +++ description: None
      values.latestVersion:
-        1
+        3
      values.libraryLookup[2]:
+        "0x443CAa8CD23D8CC1e04B3Ce897822AEa6ad3EbDA"
      values.libraryLookup[1]:
+        "0x119C04C4E60158fa69eCf4cdDF629D09719a7572"
      values.owner:
-        "0x9F403140Bc0574D7d36eA472b82DAa1Bbd4eF327"
+        "0x5e306343ecf32B605d88c1e44f3879699ab5144D"
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

```diff
+   Status: CREATED
    contract LayerZero Multisig (0x5e306343ecf32B605d88c1e44f3879699ab5144D)
    +++ description: None
```

## Source code changes

```diff
.../implementation/contracts/GnosisSafe.sol        | 422 +++++++++++++++++++++
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
 .../LayerZero Multisig/implementation/meta.txt     |   2 +
 .../LayerZero Multisig/proxy/GnosisSafeProxy.sol   |  44 +++
 .../linea/.code/LayerZero Multisig/proxy/meta.txt  |   2 +
 18 files changed, 1122 insertions(+)
```

Generated with discovered.json: 0x8386e26452a714c1542e91e656dceae34cc3511e

# Diff at Mon, 22 Jan 2024 17:09:10 GMT

- author: Michał Podsiadły (<michal.podsiadly@l2beat.com>)
- comparing to: main@f58cc44bf923844f52038487bcd5a563329f4b43 block: 1584748
- current block number: 1773788

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
      values.defaultAdapterParams.150:
+        {"proofType":2,"adapterParams":"0x00010000000000000000000000000000000000000000000000000000000000030d40"}
      values.defaultAdapterParams.159:
+        {"proofType":2,"adapterParams":"0x00010000000000000000000000000000000000000000000000000000000000030d40"}
      values.defaultAppConfig.150:
+        {"inboundProofLib":2,"inboundBlockConfirm":5,"outboundProofType":2,"outboundBlockConfirm":10,"oracle":"0xcb566e3B6934Fa77258d68ea18E931fa75e1aaAa","relayer":"0xA658742d33ebd2ce2F0bdFf73515Aa797Fd161D9"}
      values.defaultAppConfig.159:
+        {"inboundProofLib":2,"inboundBlockConfirm":2,"outboundProofType":2,"outboundBlockConfirm":10,"oracle":"0xcb566e3B6934Fa77258d68ea18E931fa75e1aaAa","relayer":"0xA658742d33ebd2ce2F0bdFf73515Aa797Fd161D9"}
      values.inboundProofLibrary.150:
+        ["0x2D61DCDD36F10b22176E0433B86F74567d529aAa","0xC1b15d3B262bEeC0e3565C11C9e0F6134BdaCB36"]
      values.inboundProofLibrary.159:
+        ["0x2D61DCDD36F10b22176E0433B86F74567d529aAa","0xC1b15d3B262bEeC0e3565C11C9e0F6134BdaCB36"]
      values.supportedOutboundProof.150:
+        2
      values.supportedOutboundProof.159:
+        2
      values.ulnLookup.150:
+        "0x00000000000000000000000038de71124f7a447a01d67945a51edce9ff491251"
      values.ulnLookup.159:
+        "0x000000000000000000000000c1b15d3b262beec0e3565c11c9e0f6134bdacb36"
    }
```

# Diff at Tue, 09 Jan 2024 16:44:29 GMT

- author: Michał Sobieraj-Jakubiec (<michalsidzej@gmail.com>)
- comparing to: main@0b578574e6a64020b5157f700c09de14e6b3eed3 block: 117054
- current block number: 1584748

## Description

Unified configurations across L2s. Few new remote chains configurations added. Relayer implementation changed

## Watched changes

```diff
    contract UltraLightNodeV2 (0x38dE71124f7a447a01D67945a51eDcE9FF491251) {
      values.chainAddressSizeMap.116:
+        20
      values.chainAddressSizeMap.125:
+        20
      values.chainAddressSizeMap.126:
+        20
      values.chainAddressSizeMap.145:
+        20
      values.chainAddressSizeMap.165:
+        20
      values.chainAddressSizeMap.167:
+        20
      values.chainAddressSizeMap.175:
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
      values.defaultAdapterParams.116:
+        {"proofType":2,"adapterParams":"0x00010000000000000000000000000000000000000000000000000000000000030d40"}
      values.defaultAdapterParams.125:
+        {"proofType":2,"adapterParams":"0x00010000000000000000000000000000000000000000000000000000000000030d40"}
      values.defaultAdapterParams.126:
+        {"proofType":2,"adapterParams":"0x00010000000000000000000000000000000000000000000000000000000000030d40"}
      values.defaultAdapterParams.145:
+        {"proofType":2,"adapterParams":"0x00010000000000000000000000000000000000000000000000000000000000030d40"}
      values.defaultAdapterParams.165:
+        {"proofType":2,"adapterParams":"0x000100000000000000000000000000000000000000000000000000000000003d0900"}
      values.defaultAdapterParams.167:
+        {"proofType":2,"adapterParams":"0x00010000000000000000000000000000000000000000000000000000000000030d40"}
      values.defaultAdapterParams.175:
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
      values.defaultAppConfig.101.oracle:
-        "0xcb566e3B6934Fa77258d68ea18E931fa75e1aaAa"
+        "0xD56e4eAb23cb81f43168F9F45211Eb027b9aC7cc"
      values.defaultAppConfig.102.oracle:
-        "0xcb566e3B6934Fa77258d68ea18E931fa75e1aaAa"
+        "0xD56e4eAb23cb81f43168F9F45211Eb027b9aC7cc"
      values.defaultAppConfig.106.oracle:
-        "0xcb566e3B6934Fa77258d68ea18E931fa75e1aaAa"
+        "0xD56e4eAb23cb81f43168F9F45211Eb027b9aC7cc"
      values.defaultAppConfig.109.oracle:
-        "0xcb566e3B6934Fa77258d68ea18E931fa75e1aaAa"
+        "0xD56e4eAb23cb81f43168F9F45211Eb027b9aC7cc"
      values.defaultAppConfig.110.oracle:
-        "0xcb566e3B6934Fa77258d68ea18E931fa75e1aaAa"
+        "0xD56e4eAb23cb81f43168F9F45211Eb027b9aC7cc"
      values.defaultAppConfig.111.oracle:
-        "0xcb566e3B6934Fa77258d68ea18E931fa75e1aaAa"
+        "0xD56e4eAb23cb81f43168F9F45211Eb027b9aC7cc"
      values.defaultAppConfig.112.oracle:
-        "0xcb566e3B6934Fa77258d68ea18E931fa75e1aaAa"
+        "0xD56e4eAb23cb81f43168F9F45211Eb027b9aC7cc"
      values.defaultAppConfig.183.oracle:
-        "0xcb566e3B6934Fa77258d68ea18E931fa75e1aaAa"
+        "0xD56e4eAb23cb81f43168F9F45211Eb027b9aC7cc"
      values.defaultAppConfig.184.oracle:
-        "0xcb566e3B6934Fa77258d68ea18E931fa75e1aaAa"
+        "0xD56e4eAb23cb81f43168F9F45211Eb027b9aC7cc"
      values.defaultAppConfig.116:
+        {"inboundProofLib":2,"inboundBlockConfirm":5,"outboundProofType":2,"outboundBlockConfirm":10,"oracle":"0xD56e4eAb23cb81f43168F9F45211Eb027b9aC7cc","relayer":"0xA658742d33ebd2ce2F0bdFf73515Aa797Fd161D9"}
      values.defaultAppConfig.125:
+        {"inboundProofLib":2,"inboundBlockConfirm":5,"outboundProofType":2,"outboundBlockConfirm":10,"oracle":"0xD56e4eAb23cb81f43168F9F45211Eb027b9aC7cc","relayer":"0xA658742d33ebd2ce2F0bdFf73515Aa797Fd161D9"}
      values.defaultAppConfig.126:
+        {"inboundProofLib":2,"inboundBlockConfirm":10,"outboundProofType":2,"outboundBlockConfirm":10,"oracle":"0xD56e4eAb23cb81f43168F9F45211Eb027b9aC7cc","relayer":"0xA658742d33ebd2ce2F0bdFf73515Aa797Fd161D9"}
      values.defaultAppConfig.145:
+        {"inboundProofLib":2,"inboundBlockConfirm":5,"outboundProofType":2,"outboundBlockConfirm":10,"oracle":"0xD56e4eAb23cb81f43168F9F45211Eb027b9aC7cc","relayer":"0xA658742d33ebd2ce2F0bdFf73515Aa797Fd161D9"}
      values.defaultAppConfig.165:
+        {"inboundProofLib":1,"inboundBlockConfirm":20,"outboundProofType":2,"outboundBlockConfirm":10,"oracle":"0xcb566e3B6934Fa77258d68ea18E931fa75e1aaAa","relayer":"0xA658742d33ebd2ce2F0bdFf73515Aa797Fd161D9"}
      values.defaultAppConfig.167:
+        {"inboundProofLib":2,"inboundBlockConfirm":10,"outboundProofType":2,"outboundBlockConfirm":10,"oracle":"0xcb566e3B6934Fa77258d68ea18E931fa75e1aaAa","relayer":"0xA658742d33ebd2ce2F0bdFf73515Aa797Fd161D9"}
      values.defaultAppConfig.175:
+        {"inboundProofLib":2,"inboundBlockConfirm":20,"outboundProofType":2,"outboundBlockConfirm":10,"oracle":"0xD56e4eAb23cb81f43168F9F45211Eb027b9aC7cc","relayer":"0xA658742d33ebd2ce2F0bdFf73515Aa797Fd161D9"}
      values.defaultAppConfig.195:
+        {"inboundProofLib":2,"inboundBlockConfirm":5,"outboundProofType":2,"outboundBlockConfirm":10,"oracle":"0xcb566e3B6934Fa77258d68ea18E931fa75e1aaAa","relayer":"0xA658742d33ebd2ce2F0bdFf73515Aa797Fd161D9"}
      values.defaultAppConfig.199:
+        {"inboundProofLib":2,"inboundBlockConfirm":5,"outboundProofType":2,"outboundBlockConfirm":10,"oracle":"0xcb566e3B6934Fa77258d68ea18E931fa75e1aaAa","relayer":"0xA658742d33ebd2ce2F0bdFf73515Aa797Fd161D9"}
      values.defaultAppConfig.202:
+        {"inboundProofLib":2,"inboundBlockConfirm":5,"outboundProofType":2,"outboundBlockConfirm":10,"oracle":"0xcb566e3B6934Fa77258d68ea18E931fa75e1aaAa","relayer":"0xA658742d33ebd2ce2F0bdFf73515Aa797Fd161D9"}
      values.defaultAppConfig.210:
+        {"inboundProofLib":2,"inboundBlockConfirm":5,"outboundProofType":2,"outboundBlockConfirm":10,"oracle":"0xcb566e3B6934Fa77258d68ea18E931fa75e1aaAa","relayer":"0xA658742d33ebd2ce2F0bdFf73515Aa797Fd161D9"}
      values.defaultAppConfig.212:
+        {"inboundProofLib":2,"inboundBlockConfirm":5,"outboundProofType":2,"outboundBlockConfirm":10,"oracle":"0xcb566e3B6934Fa77258d68ea18E931fa75e1aaAa","relayer":"0xA658742d33ebd2ce2F0bdFf73515Aa797Fd161D9"}
      values.defaultAppConfig.214:
+        {"inboundProofLib":2,"inboundBlockConfirm":5,"outboundProofType":2,"outboundBlockConfirm":10,"oracle":"0xcb566e3B6934Fa77258d68ea18E931fa75e1aaAa","relayer":"0xA658742d33ebd2ce2F0bdFf73515Aa797Fd161D9"}
      values.inboundProofLibrary.116:
+        ["0x2D61DCDD36F10b22176E0433B86F74567d529aAa","0xC1b15d3B262bEeC0e3565C11C9e0F6134BdaCB36"]
      values.inboundProofLibrary.125:
+        ["0x2D61DCDD36F10b22176E0433B86F74567d529aAa","0xC1b15d3B262bEeC0e3565C11C9e0F6134BdaCB36"]
      values.inboundProofLibrary.126:
+        ["0x2D61DCDD36F10b22176E0433B86F74567d529aAa","0xC1b15d3B262bEeC0e3565C11C9e0F6134BdaCB36"]
      values.inboundProofLibrary.145:
+        ["0x2D61DCDD36F10b22176E0433B86F74567d529aAa","0xC1b15d3B262bEeC0e3565C11C9e0F6134BdaCB36"]
      values.inboundProofLibrary.165:
+        "0xC1b15d3B262bEeC0e3565C11C9e0F6134BdaCB36"
      values.inboundProofLibrary.167:
+        ["0x2D61DCDD36F10b22176E0433B86F74567d529aAa","0xC1b15d3B262bEeC0e3565C11C9e0F6134BdaCB36"]
      values.inboundProofLibrary.175:
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
      values.supportedOutboundProof.116:
+        2
      values.supportedOutboundProof.125:
+        2
      values.supportedOutboundProof.126:
+        2
      values.supportedOutboundProof.145:
+        2
      values.supportedOutboundProof.165:
+        2
      values.supportedOutboundProof.167:
+        2
      values.supportedOutboundProof.175:
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
      values.ulnLookup.116:
+        "0x0000000000000000000000004d73adb72bc3dd368966edd0f0b2148401a178e2"
      values.ulnLookup.125:
+        "0x000000000000000000000000377530cda84dfb2673bf4d145dcf0c4d7fdcb5b6"
      values.ulnLookup.126:
+        "0x0000000000000000000000004d73adb72bc3dd368966edd0f0b2148401a178e2"
      values.ulnLookup.145:
+        "0x00000000000000000000000038de71124f7a447a01d67945a51edce9ff491251"
      values.ulnLookup.165:
+        "0x000000000000000000000000042b8289c97896529ec2fe49ba1a8b9c956a86cc"
      values.ulnLookup.167:
+        "0x000000000000000000000000e9ba4c1e76d874a43942718dafc96009ec9d9917"
      values.ulnLookup.175:
+        "0x0000000000000000000000002d61dcdd36f10b22176e0433b86f74567d529aaa"
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
    }
```

```diff
    contract  (0xA658742d33ebd2ce2F0bdFf73515Aa797Fd161D9) {
      upgradeability.implementation:
-        "0x5B19bd330A84c049b62D5B0FC2bA120217a18C1C"
+        "0xC614E9C511a5149f1969F2CB0199d508bBB5b915"
      implementations.0:
-        "0x5B19bd330A84c049b62D5B0FC2bA120217a18C1C"
+        "0xC614E9C511a5149f1969F2CB0199d508bBB5b915"
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
 .../linea/.code/VerifierFeeLib/meta.txt            |   2 +
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
 .../linea/.code/VerifierNetwork/meta.txt           |   2 +
 .../implementation/meta.txt                        |   2 +-
 .../linea/{.code@117054 => .code}/meta.txt         |   2 +-
 .../linea/{.code@117054 => .code}/proxy/meta.txt   |   2 +-
 49 files changed, 3789 insertions(+), 3 deletions(-)
```

## Config related changes

Following changes come from updates made to the config file,
not from differences found during discovery. Values are
for block 117054 (main branch discovery), not current.

```diff
    contract UltraLightNodeV2 (0x38dE71124f7a447a01D67945a51eDcE9FF491251) {
      values.chainAddressSizeMap:
+        {"101":20,"102":20,"106":20,"109":20,"110":20,"111":20,"112":20,"151":20,"158":20,"177":20,"181":20,"183":20,"184":20}
      values.defaultAdapterParams:
+        {"101":{"proofType":2,"adapterParams":"0x00010000000000000000000000000000000000000000000000000000000000030d40"},"102":{"proofType":2,"adapterParams":"0x00010000000000000000000000000000000000000000000000000000000000030d40"},"106":{"proofType":2,"adapterParams":"0x00010000000000000000000000000000000000000000000000000000000000030d40"},"109":{"proofType":2,"adapterParams":"0x00010000000000000000000000000000000000000000000000000000000000030d40"},"110":{"proofType":2,"adapterParams":"0x00010000000000000000000000000000000000000000000000000000000000030d40"},"111":{"proofType":2,"adapterParams":"0x00010000000000000000000000000000000000000000000000000000000000030d40"},"112":{"proofType":2,"adapterParams":"0x00010000000000000000000000000000000000000000000000000000000000030d40"},"151":{"proofType":2,"adapterParams":"0x00010000000000000000000000000000000000000000000000000000000000030d40"},"158":{"proofType":2,"adapterParams":"0x00010000000000000000000000000000000000000000000000000000000000030d40"},"177":{"proofType":2,"adapterParams":"0x00010000000000000000000000000000000000000000000000000000000000030d40"},"181":{"proofType":2,"adapterParams":"0x00010000000000000000000000000000000000000000000000000000000000030d40"},"183":{"proofType":2,"adapterParams":"0x00010000000000000000000000000000000000000000000000000000000000030d40"},"184":{"proofType":2,"adapterParams":"0x00010000000000000000000000000000000000000000000000000000000000030d40"}}
      values.defaultAppConfig:
+        {"101":{"inboundProofLib":2,"inboundBlockConfirm":15,"outboundProofType":2,"outboundBlockConfirm":10,"oracle":"0xcb566e3B6934Fa77258d68ea18E931fa75e1aaAa","relayer":"0xA658742d33ebd2ce2F0bdFf73515Aa797Fd161D9"},"102":{"inboundProofLib":2,"inboundBlockConfirm":20,"outboundProofType":2,"outboundBlockConfirm":10,"oracle":"0xcb566e3B6934Fa77258d68ea18E931fa75e1aaAa","relayer":"0xA658742d33ebd2ce2F0bdFf73515Aa797Fd161D9"},"106":{"inboundProofLib":2,"inboundBlockConfirm":12,"outboundProofType":2,"outboundBlockConfirm":10,"oracle":"0xcb566e3B6934Fa77258d68ea18E931fa75e1aaAa","relayer":"0xA658742d33ebd2ce2F0bdFf73515Aa797Fd161D9"},"109":{"inboundProofLib":2,"inboundBlockConfirm":512,"outboundProofType":2,"outboundBlockConfirm":10,"oracle":"0xcb566e3B6934Fa77258d68ea18E931fa75e1aaAa","relayer":"0xA658742d33ebd2ce2F0bdFf73515Aa797Fd161D9"},"110":{"inboundProofLib":2,"inboundBlockConfirm":20,"outboundProofType":2,"outboundBlockConfirm":10,"oracle":"0xcb566e3B6934Fa77258d68ea18E931fa75e1aaAa","relayer":"0xA658742d33ebd2ce2F0bdFf73515Aa797Fd161D9"},"111":{"inboundProofLib":2,"inboundBlockConfirm":20,"outboundProofType":2,"outboundBlockConfirm":10,"oracle":"0xcb566e3B6934Fa77258d68ea18E931fa75e1aaAa","relayer":"0xA658742d33ebd2ce2F0bdFf73515Aa797Fd161D9"},"112":{"inboundProofLib":2,"inboundBlockConfirm":5,"outboundProofType":2,"outboundBlockConfirm":10,"oracle":"0xcb566e3B6934Fa77258d68ea18E931fa75e1aaAa","relayer":"0xA658742d33ebd2ce2F0bdFf73515Aa797Fd161D9"},"151":{"inboundProofLib":2,"inboundBlockConfirm":5,"outboundProofType":2,"outboundBlockConfirm":10,"oracle":"0xcb566e3B6934Fa77258d68ea18E931fa75e1aaAa","relayer":"0xA658742d33ebd2ce2F0bdFf73515Aa797Fd161D9"},"158":{"inboundProofLib":2,"inboundBlockConfirm":20,"outboundProofType":2,"outboundBlockConfirm":10,"oracle":"0xcb566e3B6934Fa77258d68ea18E931fa75e1aaAa","relayer":"0xA658742d33ebd2ce2F0bdFf73515Aa797Fd161D9"},"177":{"inboundProofLib":2,"inboundBlockConfirm":2,"outboundProofType":2,"outboundBlockConfirm":10,"oracle":"0xcb566e3B6934Fa77258d68ea18E931fa75e1aaAa","relayer":"0xA658742d33ebd2ce2F0bdFf73515Aa797Fd161D9"},"181":{"inboundProofLib":2,"inboundBlockConfirm":2,"outboundProofType":2,"outboundBlockConfirm":10,"oracle":"0xcb566e3B6934Fa77258d68ea18E931fa75e1aaAa","relayer":"0xA658742d33ebd2ce2F0bdFf73515Aa797Fd161D9"},"183":{"inboundProofLib":2,"inboundBlockConfirm":10,"outboundProofType":2,"outboundBlockConfirm":10,"oracle":"0xcb566e3B6934Fa77258d68ea18E931fa75e1aaAa","relayer":"0xA658742d33ebd2ce2F0bdFf73515Aa797Fd161D9"},"184":{"inboundProofLib":2,"inboundBlockConfirm":10,"outboundProofType":2,"outboundBlockConfirm":10,"oracle":"0xcb566e3B6934Fa77258d68ea18E931fa75e1aaAa","relayer":"0xA658742d33ebd2ce2F0bdFf73515Aa797Fd161D9"}}
      values.inboundProofLibrary:
+        {"101":["0x2D61DCDD36F10b22176E0433B86F74567d529aAa","0xC1b15d3B262bEeC0e3565C11C9e0F6134BdaCB36"],"102":["0x2D61DCDD36F10b22176E0433B86F74567d529aAa","0xC1b15d3B262bEeC0e3565C11C9e0F6134BdaCB36"],"106":["0x2D61DCDD36F10b22176E0433B86F74567d529aAa","0xC1b15d3B262bEeC0e3565C11C9e0F6134BdaCB36"],"109":["0x2D61DCDD36F10b22176E0433B86F74567d529aAa","0xC1b15d3B262bEeC0e3565C11C9e0F6134BdaCB36"],"110":["0x2D61DCDD36F10b22176E0433B86F74567d529aAa","0xC1b15d3B262bEeC0e3565C11C9e0F6134BdaCB36"],"111":["0x2D61DCDD36F10b22176E0433B86F74567d529aAa","0xC1b15d3B262bEeC0e3565C11C9e0F6134BdaCB36"],"112":["0x2D61DCDD36F10b22176E0433B86F74567d529aAa","0xC1b15d3B262bEeC0e3565C11C9e0F6134BdaCB36"],"151":["0x2D61DCDD36F10b22176E0433B86F74567d529aAa","0xC1b15d3B262bEeC0e3565C11C9e0F6134BdaCB36"],"158":["0x2D61DCDD36F10b22176E0433B86F74567d529aAa","0xC1b15d3B262bEeC0e3565C11C9e0F6134BdaCB36"],"177":["0x2D61DCDD36F10b22176E0433B86F74567d529aAa","0xC1b15d3B262bEeC0e3565C11C9e0F6134BdaCB36"],"181":["0x2D61DCDD36F10b22176E0433B86F74567d529aAa","0xC1b15d3B262bEeC0e3565C11C9e0F6134BdaCB36"],"183":["0x2D61DCDD36F10b22176E0433B86F74567d529aAa","0xC1b15d3B262bEeC0e3565C11C9e0F6134BdaCB36"],"184":["0x2D61DCDD36F10b22176E0433B86F74567d529aAa","0xC1b15d3B262bEeC0e3565C11C9e0F6134BdaCB36"]}
      values.supportedOutboundProof:
+        {"101":2,"102":2,"106":2,"109":2,"110":2,"111":2,"112":2,"151":2,"158":2,"177":2,"181":2,"183":2,"184":2}
      values.ulnLookup:
+        {"101":"0x0000000000000000000000004d73adb72bc3dd368966edd0f0b2148401a178e2","102":"0x0000000000000000000000004d73adb72bc3dd368966edd0f0b2148401a178e2","106":"0x0000000000000000000000004d73adb72bc3dd368966edd0f0b2148401a178e2","109":"0x0000000000000000000000004d73adb72bc3dd368966edd0f0b2148401a178e2","110":"0x0000000000000000000000004d73adb72bc3dd368966edd0f0b2148401a178e2","111":"0x0000000000000000000000004d73adb72bc3dd368966edd0f0b2148401a178e2","112":"0x0000000000000000000000004d73adb72bc3dd368966edd0f0b2148401a178e2","151":"0x00000000000000000000000038de71124f7a447a01d67945a51edce9ff491251","158":"0x000000000000000000000000fe7c30860d01e28371d40434806f4a8fcdd3a098","177":"0x00000000000000000000000038de71124f7a447a01d67945a51edce9ff491251","181":"0x00000000000000000000000038de71124f7a447a01d67945a51edce9ff491251","183":"0x00000000000000000000000038de71124f7a447a01d67945a51edce9ff491251","184":"0x00000000000000000000000038de71124f7a447a01d67945a51edce9ff491251"}
      sinceTimestamp:
+        1689350920
    }
```

```diff
    contract NonceContract (0x66A71Dcef29A0fFBDBE3c6a460a3B5BC225Cd675) {
      sinceTimestamp:
+        1689350908
    }
```

```diff
    contract TreasuryV2 (0x980205D352F198748B626f6f7C38A8a5663Ec981) {
      sinceTimestamp:
+        1689350932
    }
```

```diff
    contract Endpoint (0xb6319cC6c8c27A8F5dAF0dD3DF91EA35C4720dd7) {
      values.libraryLookup:
+        ["0x38dE71124f7a447a01D67945a51eDcE9FF491251"]
      sinceTimestamp:
+        1689350872
    }
```

```diff
+   Status: CREATED
    contract MPTValidator01 (0x2D61DCDD36F10b22176E0433B86F74567d529aAa) {
    }
```

```diff
+   Status: CREATED
    contract  (0xA658742d33ebd2ce2F0bdFf73515Aa797Fd161D9) {
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
