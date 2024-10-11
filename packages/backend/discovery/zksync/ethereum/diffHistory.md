Generated with discovered.json: 0x21c05225811617af316de0e7f0c20f796292fb75

# Diff at Tue, 01 Oct 2024 11:12:18 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bd754dc73c66120164006054f8d25c5fae9cd910 block: 20532597
- current block number: 20532597

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20532597 (main branch discovery), not current.

```diff
    contract Governance (0x34460C0EB5074C29A9F6FE13b8e7E23A0D08aF01) {
    +++ description: None
      values.$pastUpgrades:
+        []
    }
```

```diff
    contract Verifier (0x5290E9582B4FB706EaDf87BB1c129e897e04d06D) {
    +++ description: None
      values.$pastUpgrades:
+        []
    }
```

Generated with discovered.json: 0x046fa96d96fd51cd8746e0df73ecd05381419119

# Diff at Fri, 30 Aug 2024 08:01:53 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@6c1bd1f41fadf5f2cb1c1805b5a2c6138a3ed35a block: 20532597
- current block number: 20532597

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20532597 (main branch discovery), not current.

```diff
    contract UpgradeGatekeeper (0x38A43F4330f24fe920F943409709fc9A6084C939) {
    +++ description: None
      receivedPermissions.2.via:
-        []
      receivedPermissions.1.via:
-        []
      receivedPermissions.0.via:
-        []
    }
```

Generated with discovered.json: 0xd2de767f061bd11047842dfb113f66896a9893bb

# Diff at Fri, 23 Aug 2024 09:56:47 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@67597c7d6c810bc726594446890178150240711e block: 20532597
- current block number: 20532597

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20532597 (main branch discovery), not current.

```diff
    contract Governance (0x34460C0EB5074C29A9F6FE13b8e7E23A0D08aF01) {
    +++ description: None
      values.$upgradeCount:
+        0
    }
```

```diff
    contract Verifier (0x5290E9582B4FB706EaDf87BB1c129e897e04d06D) {
    +++ description: None
      values.$upgradeCount:
+        0
    }
```

Generated with discovered.json: 0xf08beb04559d5a4661c8efb1809292301a9910c4

# Diff at Wed, 21 Aug 2024 10:07:15 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@2f6dde3357bf5d79196b6e94f79d853a6c4ec72b block: 20532597
- current block number: 20532597

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20532597 (main branch discovery), not current.

```diff
    contract Governance (0x34460C0EB5074C29A9F6FE13b8e7E23A0D08aF01) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x38A43F4330f24fe920F943409709fc9A6084C939","via":[]}]
    }
```

```diff
    contract UpgradeGatekeeper (0x38A43F4330f24fe920F943409709fc9A6084C939) {
    +++ description: None
      assignedPermissions:
-        {"upgrade":["0x34460C0EB5074C29A9F6FE13b8e7E23A0D08aF01","0x5290E9582B4FB706EaDf87BB1c129e897e04d06D","0xaBEA9132b05A70803a4E85094fD0e1800777fBEF"]}
      receivedPermissions:
+        [{"permission":"upgrade","target":"0x34460C0EB5074C29A9F6FE13b8e7E23A0D08aF01","via":[]},{"permission":"upgrade","target":"0x5290E9582B4FB706EaDf87BB1c129e897e04d06D","via":[]},{"permission":"upgrade","target":"0xaBEA9132b05A70803a4E85094fD0e1800777fBEF","via":[]}]
    }
```

```diff
    contract Verifier (0x5290E9582B4FB706EaDf87BB1c129e897e04d06D) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x38A43F4330f24fe920F943409709fc9A6084C939","via":[]}]
    }
```

```diff
    contract ZkSync (0xaBEA9132b05A70803a4E85094fD0e1800777fBEF) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x38A43F4330f24fe920F943409709fc9A6084C939","via":[]}]
    }
```

Generated with discovered.json: 0x13dea30776c0b6c15c1c470dd6f5806ecdd4005c

# Diff at Thu, 15 Aug 2024 07:40:27 GMT:

- author: Radina Talanova (<nt.radina@gmail.com>)
- comparing to: main@9a07aead4b3726cc622f66fe9a15e06e63af7acd block: 20525384
- current block number: 20532597

## Description

Two members of the ZkSync Multisig were replaced.

## Watched changes

```diff
    contract ZkSync Multisig (0xE24f4870Ab85DE8E356C5fC56138587206c70d99) {
    +++ description: None
      values.$members.5:
-        "0x9dF8bc0918F357c766A5697E031fF5237c05747A"
+        "0xD613b3a3924D0dE9B4a352ca0669e743cBC3C4AA"
      values.$members.3:
-        "0x84298D79ad2CD4eC0d9Ca1959F9d9f40Bc07152f"
+        "0xfB42eb487835B01cbF266f66750a7a89a7247F06"
    }
```

Generated with discovered.json: 0x5772fd09bd8af1263c7960d0da910a71bcca5f78

# Diff at Wed, 14 Aug 2024 07:30:30 GMT:

- author: Radina Talanova (<nt.radina@gmail.com>)
- comparing to: main@e32dcc268a9af9f45ad205490c9d650c487e04f1 block: 20432768
- current block number: 20525384

## Description

One ZKsync Multisig member address is replaced with another.

## Watched changes

```diff
    contract ZkSync Multisig (0xE24f4870Ab85DE8E356C5fC56138587206c70d99) {
    +++ description: None
      values.$members.1:
-        "0x1567AC0764142e91aB0A9C65C568f0DbE9E168BF"
+        "0x37A71E0C1A5808343D893Db40e12A74e0A387908"
    }
```

Generated with discovered.json: 0xf835b3fbe50281f5386c981c6991da4be2560615

# Diff at Fri, 09 Aug 2024 12:03:21 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bf40aa32f030fd312056ca0ef198c8550467d1d7 block: 20432768
- current block number: 20432768

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20432768 (main branch discovery), not current.

```diff
    contract UpgradeGatekeeper (0x38A43F4330f24fe920F943409709fc9A6084C939) {
    +++ description: None
      assignedPermissions.upgrade.2:
-        "0x34460C0EB5074C29A9F6FE13b8e7E23A0D08aF01"
+        "0xaBEA9132b05A70803a4E85094fD0e1800777fBEF"
      assignedPermissions.upgrade.0:
-        "0xaBEA9132b05A70803a4E85094fD0e1800777fBEF"
+        "0x34460C0EB5074C29A9F6FE13b8e7E23A0D08aF01"
    }
```

Generated with discovered.json: 0xf569dd45f28789ef24a7f28c9cc03542a20f82b8

# Diff at Fri, 09 Aug 2024 10:13:20 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f0da1d0aab7bc6b3b5e54e7e93480bd98e57035 block: 20432768
- current block number: 20432768

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20432768 (main branch discovery), not current.

```diff
    contract Multisig 1 (0x002A5dc50bbB8d5808e418Aeeb9F060a2Ca17346) {
    +++ description: None
      values.$multisigThreshold:
-        "2 of 4 (50%)"
      values.getOwners:
-        ["0x4326E446013908fBEEE4ce7b6935219c01854B21","0x4F0eB7DBcF5410C7bA0Ad8D131956f0194Ea803B","0x117Ab3A5D9eaF4F7105e30a757F150504733C3d8","0xA0171d83E3C5F215491FcE4C0884E91674B3C8A3"]
      values.getThreshold:
-        2
      values.$members:
+        ["0x4326E446013908fBEEE4ce7b6935219c01854B21","0x4F0eB7DBcF5410C7bA0Ad8D131956f0194Ea803B","0x117Ab3A5D9eaF4F7105e30a757F150504733C3d8","0xA0171d83E3C5F215491FcE4C0884E91674B3C8A3"]
      values.$threshold:
+        2
      values.multisigThreshold:
+        "2 of 4 (50%)"
    }
```

```diff
    contract Multisig 2 (0x19eD6cc20D44e5cF4Bb4894F50162F72402d8567) {
    +++ description: None
      values.$multisigThreshold:
-        "2 of 6 (33%)"
      values.getOwners:
-        ["0x1cAe37780Ad92801641d05BA5Bb7E978c99Fc5Da","0xD804aB3355a634aEBd45e1252d6208807defD554","0xB0c9C5B5211dE3a75b61BB798887b76AcCD64193","0x106fc088aBA908130fBC343F2F6d212Ff36150D1","0xE7A4F2b1772603170111BC633cbCF1AcEbD60BCe","0xf6dcD4d7141E06B916987C3C46220f6241278a30"]
      values.getThreshold:
-        2
      values.$members:
+        ["0x1cAe37780Ad92801641d05BA5Bb7E978c99Fc5Da","0xD804aB3355a634aEBd45e1252d6208807defD554","0xB0c9C5B5211dE3a75b61BB798887b76AcCD64193","0x106fc088aBA908130fBC343F2F6d212Ff36150D1","0xE7A4F2b1772603170111BC633cbCF1AcEbD60BCe","0xf6dcD4d7141E06B916987C3C46220f6241278a30"]
      values.$threshold:
+        2
      values.multisigThreshold:
+        "2 of 6 (33%)"
    }
```

```diff
    contract Multisig 3 (0x225d3822De44E58eE935440E0c0B829C4232086e) {
    +++ description: None
      values.$multisigThreshold:
-        "2 of 3 (67%)"
      values.getOwners:
-        ["0xB1A308e7F02798377b7acF685E997E3D774c5863","0x0d4E989c7620C8749c9417d2BF218896C767B606","0x18B7ff0370456dB6b7710714D9DCC25a0A3b3016"]
      values.getThreshold:
-        2
      values.$members:
+        ["0xB1A308e7F02798377b7acF685E997E3D774c5863","0x0d4E989c7620C8749c9417d2BF218896C767B606","0x18B7ff0370456dB6b7710714D9DCC25a0A3b3016"]
      values.$threshold:
+        2
      values.multisigThreshold:
+        "2 of 3 (67%)"
    }
```

```diff
    contract UpgradeGatekeeper (0x38A43F4330f24fe920F943409709fc9A6084C939) {
    +++ description: None
      assignedPermissions.admin:
-        ["0x34460C0EB5074C29A9F6FE13b8e7E23A0D08aF01","0x5290E9582B4FB706EaDf87BB1c129e897e04d06D","0xaBEA9132b05A70803a4E85094fD0e1800777fBEF"]
      assignedPermissions.upgrade:
+        ["0xaBEA9132b05A70803a4E85094fD0e1800777fBEF","0x5290E9582B4FB706EaDf87BB1c129e897e04d06D","0x34460C0EB5074C29A9F6FE13b8e7E23A0D08aF01"]
    }
```

```diff
    contract ZkSync Multisig (0xE24f4870Ab85DE8E356C5fC56138587206c70d99) {
    +++ description: None
      values.$multisigThreshold:
-        "4 of 7 (57%)"
      values.getOwners:
-        ["0x050b37a12451F188c7bA53D48b8A1adE6D138E71","0x1567AC0764142e91aB0A9C65C568f0DbE9E168BF","0x733F602bB867c643542cc807a3D32AD1A86cacc1","0x84298D79ad2CD4eC0d9Ca1959F9d9f40Bc07152f","0x702caCafA54B88e9c54449563Fb2e496e85c78b7","0x9dF8bc0918F357c766A5697E031fF5237c05747A","0x3068415e0F857A5eEd03302A1F7E44f67468d2Bc"]
      values.getThreshold:
-        4
      values.$members:
+        ["0x050b37a12451F188c7bA53D48b8A1adE6D138E71","0x1567AC0764142e91aB0A9C65C568f0DbE9E168BF","0x733F602bB867c643542cc807a3D32AD1A86cacc1","0x84298D79ad2CD4eC0d9Ca1959F9d9f40Bc07152f","0x702caCafA54B88e9c54449563Fb2e496e85c78b7","0x9dF8bc0918F357c766A5697E031fF5237c05747A","0x3068415e0F857A5eEd03302A1F7E44f67468d2Bc"]
      values.$threshold:
+        4
      values.multisigThreshold:
+        "4 of 7 (57%)"
    }
```

Generated with discovered.json: 0x16fdd1682d12a2412ec3cff5e2417644d8a33d5e

# Diff at Thu, 01 Aug 2024 09:21:37 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@621480ddcec5eb0839779913d874274122eaf08f block: 19532310
- current block number: 20432768

## Description

ZKsync lite add one signer (`0xD804aB3355a634aEBd45e1252d6208807defD554`) to their MS2, who is itself just one signer of the SC.

## Watched changes

```diff
    contract Multisig 2 (0x19eD6cc20D44e5cF4Bb4894F50162F72402d8567) {
    +++ description: None
      values.$multisigThreshold:
-        "2 of 5 (40%)"
+        "2 of 6 (33%)"
      values.getOwners.5:
+        "0xf6dcD4d7141E06B916987C3C46220f6241278a30"
      values.getOwners.4:
-        "0xf6dcD4d7141E06B916987C3C46220f6241278a30"
+        "0xE7A4F2b1772603170111BC633cbCF1AcEbD60BCe"
      values.getOwners.3:
-        "0xE7A4F2b1772603170111BC633cbCF1AcEbD60BCe"
+        "0x106fc088aBA908130fBC343F2F6d212Ff36150D1"
      values.getOwners.2:
-        "0xCE990b1f86e954746AD3a57F5Aa6CFa9CC0c3348"
+        "0xB0c9C5B5211dE3a75b61BB798887b76AcCD64193"
      values.getOwners.1:
-        "0x106fc088aBA908130fBC343F2F6d212Ff36150D1"
+        "0xD804aB3355a634aEBd45e1252d6208807defD554"
      values.getOwners.0:
-        "0xB0c9C5B5211dE3a75b61BB798887b76AcCD64193"
+        "0x1cAe37780Ad92801641d05BA5Bb7E978c99Fc5Da"
    }
```

Generated with discovered.json: 0xbd4699a8b52a6b73b41273be603f65b645c4926e

# Diff at Thu, 28 Mar 2024 11:28:26 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@21187e63b9b90823a55c461c331868a470ce17eb block: 18621109
- current block number: 19532310

## Description

Update discovery to include the multisig threshold.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 18621109 (main branch discovery), not current.

```diff
    contract Multisig 1 (0x002A5dc50bbB8d5808e418Aeeb9F060a2Ca17346) {
    +++ description: None
      upgradeability.threshold:
+        "2 of 4 (50%)"
    }
```

```diff
    contract Multisig 2 (0x19eD6cc20D44e5cF4Bb4894F50162F72402d8567) {
    +++ description: None
      upgradeability.threshold:
+        "2 of 5 (40%)"
    }
```

```diff
    contract Multisig 3 (0x225d3822De44E58eE935440E0c0B829C4232086e) {
    +++ description: None
      upgradeability.threshold:
+        "2 of 3 (67%)"
    }
```

```diff
    contract ZkSync Multisig (0xE24f4870Ab85DE8E356C5fC56138587206c70d99) {
    +++ description: None
      upgradeability.threshold:
+        "4 of 7 (57%)"
    }
```

Generated with discovered.json: 0x458592c7ff46f3e95422b638c0a5a7e9033c8c53

# Diff at Tue, 21 Nov 2023 15:45:04 GMT:

- author: Radina Talanova (<nt.radina@gmail.com>)
- comparing to: main@c91f8874e3c01dd4c477491e11cff7b3c664ef34

## Description

Change in the zkSync Era Multisig owners - one address is removed, which makes it a 4/7 Multisig.

## Watched changes

```diff
    contract ZkSync Multisig (0xE24f4870Ab85DE8E356C5fC56138587206c70d99) {
      values.getOwners[7]:
-        "0xa265146cA40F52cfC439888D0b4291b5440e6769"
    }
```

# Diff at Fri, 13 Oct 2023 12:28:20 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@94e530cf4d7e9cfd400a51f99572fc352ba85712

## Description

Updated verification keys. There are also some other changes in Config.sol, but they are an artefact of Etherscan verification and they are not used in practice.

## Watched changes

```diff
    contract UpgradeGatekeeper (0x38A43F4330f24fe920F943409709fc9A6084C939) {
      values.versionId:
-        10
+        11
    }
```

```diff
    contract Verifier (0x5290E9582B4FB706EaDf87BB1c129e897e04d06D) {
      upgradeability.implementation:
-        "0xf7Bd436a05678B647D74a88ffcf4445Efc43BDfC"
+        "0x6e95812C432F293b8045811F4B1758285EBDB206"
    }
```

## Source code changes

```diff
.../Verifier/implementation/Config.sol                   | 16 +++++++++++++---
 .../Verifier/implementation/KeysWithPlonkVerifier.sol    |  2 +-
 .../Verifier/implementation/Verifier.sol                 |  2 +-
 .../Verifier/implementation/meta.txt                     |  2 +-
 4 files changed, 16 insertions(+), 6 deletions(-)
```

# Diff at Mon, 02 Oct 2023 13:57:17 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@10dbc30af490bd7af5cfca51b827ce3f10182f4d

## Watched changes

```diff
    contract ZkSync Multisig (0xE24f4870Ab85DE8E356C5fC56138587206c70d99) {
      values.getOwners.2:
-        "0xd7aF418d98C0F8EDbaa407fc30ad10382286F36F"
+        "0x733F602bB867c643542cc807a3D32AD1A86cacc1"
    }
```

# Diff at Tue, 26 Sep 2023 13:05:32 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@cfd4e281f2af40c7c69302b16c1308c0c5651be0

## Watched changes

```diff
    contract ZkSync (0xaBEA9132b05A70803a4E85094fD0e1800777fBEF) {
      values.revertedBlocks:
+        [{"totalBlocksCommitted":141,"totalBlocksVerified":141},{"totalBlocksCommitted":859,"totalBlocksVerified":859},{"totalBlocksCommitted":1341,"totalBlocksVerified":1341},{"totalBlocksCommitted":2387,"totalBlocksVerified":2387},{"totalBlocksCommitted":13054,"totalBlocksVerified":13042},{"totalBlocksCommitted":13047,"totalBlocksVerified":13042},{"totalBlocksCommitted":19646,"totalBlocksVerified":19646},{"totalBlocksCommitted":34518,"totalBlocksVerified":34504}]
    }
```
