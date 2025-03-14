Generated with discovered.json: 0x2a00d3d103bf2086d2f2c58a97989c30b2b58cfc

# Diff at Tue, 11 Mar 2025 08:13:40 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@6186a4f8e3a9e415d081d4e3e85c2deceaa5530c block: 16407862
- current block number: 16435499

## Description

proxyadmin template match.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 16407862 (main branch discovery), not current.

```diff
    contract BlastOwner (0x730200f698cc8Ff16C00F4E8520Fd780B916D50E) {
    +++ description: None
      receivedPermissions.2:
+        {"permission":"upgrade","from":"0x8Df0c2bA3916bF4789c50dEc5A79b2fc719F500b","via":[{"address":"0xB5111Bda1E59b220d0Cf8D519CEDac46cb3B4c19"}]}
      directlyReceivedPermissions:
+        [{"permission":"act","from":"0xB5111Bda1E59b220d0Cf8D519CEDac46cb3B4c19"}]
    }
```

```diff
    contract L1ERC20Bridge (0x8Df0c2bA3916bF4789c50dEc5A79b2fc719F500b) {
    +++ description: None
      issuedPermissions.0.to:
-        "0xB5111Bda1E59b220d0Cf8D519CEDac46cb3B4c19"
+        "0x730200f698cc8Ff16C00F4E8520Fd780B916D50E"
      issuedPermissions.0.via.0:
+        {"address":"0xB5111Bda1E59b220d0Cf8D519CEDac46cb3B4c19"}
    }
```

```diff
    contract BlastProxyAdmin (0xB5111Bda1E59b220d0Cf8D519CEDac46cb3B4c19) {
    +++ description: None
      receivedPermissions:
-        [{"permission":"upgrade","from":"0x8Df0c2bA3916bF4789c50dEc5A79b2fc719F500b"}]
      template:
+        "global/ProxyAdmin"
      displayName:
+        "ProxyAdmin"
      directlyReceivedPermissions:
+        [{"permission":"upgrade","from":"0x8Df0c2bA3916bF4789c50dEc5A79b2fc719F500b"}]
    }
```

Generated with discovered.json: 0x31a6a65a64f8db0c780818aa1b28b6e519cc755e

# Diff at Tue, 04 Mar 2025 10:42:45 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@98d260b45fe0d2195ce5e629bd7b200c8706e8ba block: 8312690
- current block number: 8312690

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 8312690 (main branch discovery), not current.

```diff
    contract zkLink (0x29BA92Fe724beD5c5EBfd0099F2F64a6DC5078FD) {
    +++ description: None
      sinceBlock:
+        803957
    }
```

```diff
    contract BlastL2Gateway (0x3f64e2e09732969813904a8473074CFADeE66AF1) {
    +++ description: None
      sinceBlock:
+        804285
    }
```

```diff
    contract BlastOwner (0x730200f698cc8Ff16C00F4E8520Fd780B916D50E) {
    +++ description: None
      sinceBlock:
+        838126
    }
```

```diff
    contract L1ERC20Bridge (0x8Df0c2bA3916bF4789c50dEc5A79b2fc719F500b) {
    +++ description: None
      sinceBlock:
+        808599
    }
```

```diff
    contract BlastProxyAdmin (0xB5111Bda1E59b220d0Cf8D519CEDac46cb3B4c19) {
    +++ description: None
      sinceBlock:
+        808599
    }
```

Generated with discovered.json: 0x03032aa452fc8e872cc93b7452288ee80e919b51

# Diff at Mon, 20 Jan 2025 11:10:49 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@2c8b4f3d9910bb6371be9b4df87b70856e7d8c64 block: 8312690
- current block number: 8312690

## Description

Rerun on the same block number. Applies fixes to permissions and via field. Renames permission's target to to/from.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 8312690 (main branch discovery), not current.

```diff
    contract zkLink (0x29BA92Fe724beD5c5EBfd0099F2F64a6DC5078FD) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x730200f698cc8Ff16C00F4E8520Fd780B916D50E"
      issuedPermissions.0.to:
+        "0x730200f698cc8Ff16C00F4E8520Fd780B916D50E"
    }
```

```diff
    contract BlastL2Gateway (0x3f64e2e09732969813904a8473074CFADeE66AF1) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x730200f698cc8Ff16C00F4E8520Fd780B916D50E"
      issuedPermissions.0.to:
+        "0x730200f698cc8Ff16C00F4E8520Fd780B916D50E"
    }
```

```diff
    contract BlastOwner (0x730200f698cc8Ff16C00F4E8520Fd780B916D50E) {
    +++ description: None
      receivedPermissions.1.target:
-        "0x3f64e2e09732969813904a8473074CFADeE66AF1"
      receivedPermissions.1.from:
+        "0x3f64e2e09732969813904a8473074CFADeE66AF1"
      receivedPermissions.0.target:
-        "0x29BA92Fe724beD5c5EBfd0099F2F64a6DC5078FD"
      receivedPermissions.0.from:
+        "0x29BA92Fe724beD5c5EBfd0099F2F64a6DC5078FD"
    }
```

```diff
    contract L1ERC20Bridge (0x8Df0c2bA3916bF4789c50dEc5A79b2fc719F500b) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xB5111Bda1E59b220d0Cf8D519CEDac46cb3B4c19"
      issuedPermissions.0.to:
+        "0xB5111Bda1E59b220d0Cf8D519CEDac46cb3B4c19"
    }
```

```diff
    contract BlastProxyAdmin (0xB5111Bda1E59b220d0Cf8D519CEDac46cb3B4c19) {
    +++ description: None
      receivedPermissions.0.target:
-        "0x8Df0c2bA3916bF4789c50dEc5A79b2fc719F500b"
      receivedPermissions.0.from:
+        "0x8Df0c2bA3916bF4789c50dEc5A79b2fc719F500b"
    }
```

Generated with discovered.json: 0xa227a1c88fe0005e848803e254ee84d9bbb7607a

# Diff at Mon, 21 Oct 2024 11:15:50 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@8895d33866f5665c4c710f4ddaa32bfa63cc3c78 block: 8312690
- current block number: 8312690

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 8312690 (main branch discovery), not current.

```diff
    contract zkLink (0x29BA92Fe724beD5c5EBfd0099F2F64a6DC5078FD) {
    +++ description: None
      values.$pastUpgrades.1.2:
+        ["0xDe4Be50Bfe9503180231357Eab19d709F8F73C66"]
      values.$pastUpgrades.1.1:
-        ["0xDe4Be50Bfe9503180231357Eab19d709F8F73C66"]
+        "0xb0fd8cd86cd093af8f866f6fd599067fc5d202d36fd1f4967bda245c41ee16aa"
      values.$pastUpgrades.0.2:
+        ["0x35E808DB3A37eec12ecF6A22Cc951C9F867f1D64"]
      values.$pastUpgrades.0.1:
-        ["0x35E808DB3A37eec12ecF6A22Cc951C9F867f1D64"]
+        "0xd2b32d00ff07d1bb06d1fb01f3aedb6163ee3bf6fbe547310c4674f592d4d7f5"
    }
```

```diff
    contract BlastL2Gateway (0x3f64e2e09732969813904a8473074CFADeE66AF1) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0xd1dCd063A4e650DCECd8BD211fe6D18a934ecCaD"]
      values.$pastUpgrades.0.1:
-        ["0xd1dCd063A4e650DCECd8BD211fe6D18a934ecCaD"]
+        "0x05e9bceb1c88e60beabf453da2cfc31525989a529e5d600fbe170dfdb1325c88"
    }
```

```diff
    contract L1ERC20Bridge (0x8Df0c2bA3916bF4789c50dEc5A79b2fc719F500b) {
    +++ description: None
      values.$pastUpgrades.1.2:
+        ["0xc24864769346073f5fEf0386A18734F0eF5503F5"]
      values.$pastUpgrades.1.1:
-        ["0xc24864769346073f5fEf0386A18734F0eF5503F5"]
+        "0x319fa19f70ff861bf9b573f1cc6054d236dcb99dec620756e3f85d2c35c0040b"
      values.$pastUpgrades.0.2:
+        ["0x4D7012d5C62c351804CCe49c2d7C09A401fD3deC"]
      values.$pastUpgrades.0.1:
-        ["0x4D7012d5C62c351804CCe49c2d7C09A401fD3deC"]
+        "0x6c75a5c435f7e399d35fa65b31295cfa722742a9cd03208bcf726891f028d0b2"
    }
```

Generated with discovered.json: 0x9fc0d5099d8fc0ff99862da51ba388b4376355ac

# Diff at Mon, 14 Oct 2024 11:01:05 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1afc77ff111ceb0970e7d09efcc7b2f376b0c281 block: 8312690
- current block number: 8312690

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 8312690 (main branch discovery), not current.

```diff
    contract zkLink (0x29BA92Fe724beD5c5EBfd0099F2F64a6DC5078FD) {
    +++ description: None
      sourceHashes:
+        ["0xbbe53a68c0042f4050bdf21e8d16eee4688dd35d24e49740915f0a0cf994f0d6","0x9d3b6cf7c8756dc6cce424dc754ed146f84d3201e5223d47b0a4fcd994a76a7f"]
    }
```

```diff
    contract BlastL2Gateway (0x3f64e2e09732969813904a8473074CFADeE66AF1) {
    +++ description: None
      sourceHashes:
+        ["0xbbe53a68c0042f4050bdf21e8d16eee4688dd35d24e49740915f0a0cf994f0d6","0x54984eed0ba905283811bcd69e63428602cc4c290c8eed30fc28011383549ff2"]
    }
```

```diff
    contract BlastOwner (0x730200f698cc8Ff16C00F4E8520Fd780B916D50E) {
    +++ description: None
      sourceHashes:
+        ["0x81a7349eebb98ac33b0bc6842e3cb258034a8f2a4ba004570bb8e2e25947f9ff","0x59fe14e95a8aa7f52213f18bae5c9329cf583a7ba31194698b15eddb97d5e825"]
    }
```

```diff
    contract L1ERC20Bridge (0x8Df0c2bA3916bF4789c50dEc5A79b2fc719F500b) {
    +++ description: None
      sourceHashes:
+        ["0x8c407edc4ac1fa1cea2c45903e2cf0158906a2ff39fc2eb92aca3ca9f0d43ed8","0xcabc91ee17e9a771bb999a95f4705966cf206325fc82ac15d440c8b6086f9679"]
    }
```

```diff
    contract BlastProxyAdmin (0xB5111Bda1E59b220d0Cf8D519CEDac46cb3B4c19) {
    +++ description: None
      sourceHashes:
+        ["0x8fd8f837bb320bd2a7463c103bea2ff207b0969b5795f320a6c868858aa92074"]
    }
```

Generated with discovered.json: 0xa8f63a3833c49f92aed8dcd694791cc10c8a9fd1

# Diff at Tue, 01 Oct 2024 11:14:53 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bd754dc73c66120164006054f8d25c5fae9cd910 block: 8312690
- current block number: 8312690

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 8312690 (main branch discovery), not current.

```diff
    contract zkLink (0x29BA92Fe724beD5c5EBfd0099F2F64a6DC5078FD) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-03-14T12:02:09.000Z",["0x35E808DB3A37eec12ecF6A22Cc951C9F867f1D64"]],["2024-04-22T02:30:45.000Z",["0xDe4Be50Bfe9503180231357Eab19d709F8F73C66"]]]
    }
```

```diff
    contract BlastL2Gateway (0x3f64e2e09732969813904a8473074CFADeE66AF1) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-03-14T12:13:05.000Z",["0xd1dCd063A4e650DCECd8BD211fe6D18a934ecCaD"]]]
    }
```

```diff
    contract L1ERC20Bridge (0x8Df0c2bA3916bF4789c50dEc5A79b2fc719F500b) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-03-14T14:36:53.000Z",["0x4D7012d5C62c351804CCe49c2d7C09A401fD3deC"]],["2024-04-04T06:41:11.000Z",["0xc24864769346073f5fEf0386A18734F0eF5503F5"]]]
    }
```

Generated with discovered.json: 0x8fb1a9223f60ee1f8bdaf1e2ae445389d3c8e89d

# Diff at Mon, 02 Sep 2024 08:51:46 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@8fcb30f6c613b5454aa9ecdec05a118442e9dc7b block: 5983401
- current block number: 8228641

## Description

Config related.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 5983401 (main branch discovery), not current.

```diff
    contract BlastOwner (0x730200f698cc8Ff16C00F4E8520Fd780B916D50E) {
    +++ description: None
      receivedPermissions.1.via:
-        []
      receivedPermissions.0.via:
-        []
    }
```

```diff
    contract BlastProxyAdmin (0xB5111Bda1E59b220d0Cf8D519CEDac46cb3B4c19) {
    +++ description: None
      receivedPermissions.0.via:
-        []
    }
```

Generated with discovered.json: 0xa7883e1a4c30e9eafe71b1f49c2387e02272785d

# Diff at Fri, 23 Aug 2024 10:03:53 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@67597c7d6c810bc726594446890178150240711e block: 5983401
- current block number: 5983401

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 5983401 (main branch discovery), not current.

```diff
    contract zkLink (0x29BA92Fe724beD5c5EBfd0099F2F64a6DC5078FD) {
    +++ description: None
      values.$upgradeCount:
+        2
    }
```

```diff
    contract BlastL2Gateway (0x3f64e2e09732969813904a8473074CFADeE66AF1) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract L1ERC20Bridge (0x8Df0c2bA3916bF4789c50dEc5A79b2fc719F500b) {
    +++ description: None
      values.$upgradeCount:
+        2
    }
```

Generated with discovered.json: 0xe19028f424ef4a163e30f8def71e379e29f1a236

# Diff at Wed, 21 Aug 2024 10:08:58 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@2f6dde3357bf5d79196b6e94f79d853a6c4ec72b block: 5983401
- current block number: 5983401

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 5983401 (main branch discovery), not current.

```diff
    contract zkLink (0x29BA92Fe724beD5c5EBfd0099F2F64a6DC5078FD) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x730200f698cc8Ff16C00F4E8520Fd780B916D50E","via":[]}]
    }
```

```diff
    contract BlastL2Gateway (0x3f64e2e09732969813904a8473074CFADeE66AF1) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x730200f698cc8Ff16C00F4E8520Fd780B916D50E","via":[]}]
    }
```

```diff
    contract BlastOwner (0x730200f698cc8Ff16C00F4E8520Fd780B916D50E) {
    +++ description: None
      assignedPermissions:
-        {"upgrade":["0x29BA92Fe724beD5c5EBfd0099F2F64a6DC5078FD","0x3f64e2e09732969813904a8473074CFADeE66AF1"]}
      receivedPermissions:
+        [{"permission":"upgrade","target":"0x29BA92Fe724beD5c5EBfd0099F2F64a6DC5078FD","via":[]},{"permission":"upgrade","target":"0x3f64e2e09732969813904a8473074CFADeE66AF1","via":[]}]
    }
```

```diff
    contract L1ERC20Bridge (0x8Df0c2bA3916bF4789c50dEc5A79b2fc719F500b) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xB5111Bda1E59b220d0Cf8D519CEDac46cb3B4c19","via":[]}]
    }
```

```diff
    contract BlastProxyAdmin (0xB5111Bda1E59b220d0Cf8D519CEDac46cb3B4c19) {
    +++ description: None
      assignedPermissions:
-        {"upgrade":["0x8Df0c2bA3916bF4789c50dEc5A79b2fc719F500b"]}
      receivedPermissions:
+        [{"permission":"upgrade","target":"0x8Df0c2bA3916bF4789c50dEc5A79b2fc719F500b","via":[]}]
    }
```

Generated with discovered.json: 0x07d235a5bfd9154b2b77e5ce71d976492c259e26

# Diff at Fri, 09 Aug 2024 10:15:05 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f0da1d0aab7bc6b3b5e54e7e93480bd98e57035 block: 5983401
- current block number: 5983401

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 5983401 (main branch discovery), not current.

```diff
    contract BlastOwner (0x730200f698cc8Ff16C00F4E8520Fd780B916D50E) {
    +++ description: None
      assignedPermissions.admin:
-        ["0x29BA92Fe724beD5c5EBfd0099F2F64a6DC5078FD","0x3f64e2e09732969813904a8473074CFADeE66AF1"]
      assignedPermissions.upgrade:
+        ["0x29BA92Fe724beD5c5EBfd0099F2F64a6DC5078FD","0x3f64e2e09732969813904a8473074CFADeE66AF1"]
      values.$multisigThreshold:
-        "6 of 8 (75%)"
      values.getOwners:
-        ["0x7785bccF9110C188Dad39bE49D4Cdf6c6CC03F10","0x4D9b22B92Ff9faFAc013f82faCA88BDa8E778cb5","0xF801886AE2e127A269B0F11892edb54F692d02dF","0xcC1A2bd1a459be0C7fAd3B7F9Fa9a6CBBFE9BFa5","0xC75EFCffEE930706daec5CaCA012551f6a1845D7","0x24a257B7D975E7ec6219C4cFCbcF6E504253c7A9","0x824C9364A6CF8f5EB542ad2ca8F5705561C8b1db","0xd8F26118505417Ef6468Ac8A2AE1E5117245Db92"]
      values.getThreshold:
-        6
      values.$members:
+        ["0x7785bccF9110C188Dad39bE49D4Cdf6c6CC03F10","0x4D9b22B92Ff9faFAc013f82faCA88BDa8E778cb5","0xF801886AE2e127A269B0F11892edb54F692d02dF","0xcC1A2bd1a459be0C7fAd3B7F9Fa9a6CBBFE9BFa5","0xC75EFCffEE930706daec5CaCA012551f6a1845D7","0x24a257B7D975E7ec6219C4cFCbcF6E504253c7A9","0x824C9364A6CF8f5EB542ad2ca8F5705561C8b1db","0xd8F26118505417Ef6468Ac8A2AE1E5117245Db92"]
      values.$threshold:
+        6
      values.multisigThreshold:
+        "6 of 8 (75%)"
    }
```

```diff
    contract BlastProxyAdmin (0xB5111Bda1E59b220d0Cf8D519CEDac46cb3B4c19) {
    +++ description: None
      assignedPermissions.admin:
-        ["0x8Df0c2bA3916bF4789c50dEc5A79b2fc719F500b"]
      assignedPermissions.upgrade:
+        ["0x8Df0c2bA3916bF4789c50dEc5A79b2fc719F500b"]
    }
```

Generated with discovered.json: 0xb86797b97573e6d0defa28430623799a7e5e5952

# Diff at Thu, 04 Jul 2024 14:10:31 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- current block number: 5646203

## Description

Provide description of changes. This section will be preserved.

## Initial discovery

```diff
+   Status: CREATED
    contract zkLink (0x29BA92Fe724beD5c5EBfd0099F2F64a6DC5078FD)
    +++ description: None
```

```diff
+   Status: CREATED
    contract BlastL2Gateway (0x3f64e2e09732969813904a8473074CFADeE66AF1)
    +++ description: None
```

```diff
+   Status: CREATED
    contract BlastOwner (0x730200f698cc8Ff16C00F4E8520Fd780B916D50E)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1ERC20Bridge (0x8Df0c2bA3916bF4789c50dEc5A79b2fc719F500b)
    +++ description: None
```

```diff
+   Status: CREATED
    contract BlastProxyAdmin (0xB5111Bda1E59b220d0Cf8D519CEDac46cb3B4c19)
    +++ description: None
```
