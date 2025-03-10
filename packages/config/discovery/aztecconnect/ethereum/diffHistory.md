Generated with discovered.json: 0xfa26bdca43414e1aca2cb632b2c4ebfc5f0a89d3

# Diff at Tue, 04 Mar 2025 10:38:58 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@98d260b45fe0d2195ce5e629bd7b200c8706e8ba block: 21041827
- current block number: 21041827

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21041827 (main branch discovery), not current.

```diff
    contract AztecFeeDistributor (0x4cf32670a53657596E641DFCC6d40f01e4d64927) {
    +++ description: None
      sinceBlock:
+        14923083
    }
```

```diff
    contract DefiBridgeProxy (0xA1BBa894a6D39D79C0D1ef9c68a2139c84B81487) {
    +++ description: None
      sinceBlock:
+        14923076
    }
```

```diff
    contract Verifier28x32 (0xb7baA1420f88b7758E341c93463426A2b7651CFB) {
    +++ description: None
      sinceBlock:
+        19609952
    }
```

```diff
    contract ProxyAdmin (0xC5b735d05c26579B701Be9bED253Bb588503B26B) {
    +++ description: None
      sinceBlock:
+        14923077
    }
```

```diff
    contract Aztec Multisig (0xE298a76986336686CC3566469e3520d23D1a8aaD) {
    +++ description: None
      sinceBlock:
+        11647532
    }
```

```diff
    contract RollupProcessorV3 (0xFF1F2B4ADb9dF6FC8eAFecDcbF96A2B351680455) {
    +++ description: None
      sinceBlock:
+        14923081
    }
```

Generated with discovered.json: 0xc0abb212722da4f4e4ae682e6901f217245c8ee2

# Diff at Mon, 20 Jan 2025 11:09:18 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@2c8b4f3d9910bb6371be9b4df87b70856e7d8c64 block: 21041827
- current block number: 21041827

## Description

Rerun on the same block number. Applies fixes to permissions and via field. Renames permission's target to to/from.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21041827 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0xC5b735d05c26579B701Be9bED253Bb588503B26B) {
    +++ description: None
      receivedPermissions.0.target:
-        "0xFF1F2B4ADb9dF6FC8eAFecDcbF96A2B351680455"
      receivedPermissions.0.from:
+        "0xFF1F2B4ADb9dF6FC8eAFecDcbF96A2B351680455"
    }
```

```diff
    contract RollupProcessorV3 (0xFF1F2B4ADb9dF6FC8eAFecDcbF96A2B351680455) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xC5b735d05c26579B701Be9bED253Bb588503B26B"
      issuedPermissions.0.to:
+        "0xC5b735d05c26579B701Be9bED253Bb588503B26B"
    }
```

Generated with discovered.json: 0x76e236f9cfe6da09cec92f53897e57d028a1bcc8

# Diff at Tue, 10 Dec 2024 10:37:00 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@9ed5a41ddcad978cfdf826bc7a4827bf4a91c814 block: 21041827
- current block number: 21041827

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21041827 (main branch discovery), not current.

```diff
+   Status: CREATED
    contract AztecFeeDistributor (0x4cf32670a53657596E641DFCC6d40f01e4d64927)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Aztec Multisig (0xE298a76986336686CC3566469e3520d23D1a8aaD)
    +++ description: None
```

Generated with discovered.json: 0xa1ec9af4eeae57032afb3dfc89bf2faf162aad87

# Diff at Thu, 28 Nov 2024 11:02:01 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@4e0645053ebfcfcef2e7fd8c8410bad53373a3c4 block: 21041827
- current block number: 21041827

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21041827 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0xC5b735d05c26579B701Be9bED253Bb588503B26B) {
    +++ description: None
      directlyReceivedPermissions:
-        [{"permission":"upgrade","target":"0xFF1F2B4ADb9dF6FC8eAFecDcbF96A2B351680455"}]
      receivedPermissions:
+        [{"permission":"upgrade","target":"0xFF1F2B4ADb9dF6FC8eAFecDcbF96A2B351680455"}]
    }
```

```diff
    contract RollupProcessorV3 (0xFF1F2B4ADb9dF6FC8eAFecDcbF96A2B351680455) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x0000000000000000000000000000000000000000"
+        "0xC5b735d05c26579B701Be9bED253Bb588503B26B"
      issuedPermissions.0.via.0:
-        {"address":"0xC5b735d05c26579B701Be9bED253Bb588503B26B","delay":0}
    }
```

Generated with discovered.json: 0x71c0d46ab3fbd5ceace5752319b78c495b1f74a2

# Diff at Fri, 25 Oct 2024 09:47:25 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@e7501f424c0cea9b5438386ee76e509448999836 block: 19816414
- current block number: 21041827

## Description

Config related.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19816414 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0xC5b735d05c26579B701Be9bED253Bb588503B26B) {
    +++ description: None
      receivedPermissions:
-        [{"permission":"upgrade","target":"0xFF1F2B4ADb9dF6FC8eAFecDcbF96A2B351680455"}]
      template:
+        "global/ProxyAdmin"
      directlyReceivedPermissions:
+        [{"permission":"upgrade","target":"0xFF1F2B4ADb9dF6FC8eAFecDcbF96A2B351680455"}]
    }
```

```diff
    contract RollupProcessorV3 (0xFF1F2B4ADb9dF6FC8eAFecDcbF96A2B351680455) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xC5b735d05c26579B701Be9bED253Bb588503B26B"
+        "0x0000000000000000000000000000000000000000"
      issuedPermissions.0.via.0:
+        {"address":"0xC5b735d05c26579B701Be9bED253Bb588503B26B","delay":0}
    }
```

Generated with discovered.json: 0xe8e10e2752a9b321eb8eac5388cdd3ace2fcb5c5

# Diff at Mon, 21 Oct 2024 11:04:31 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@8895d33866f5665c4c710f4ddaa32bfa63cc3c78 block: 19816414
- current block number: 19816414

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19816414 (main branch discovery), not current.

```diff
    contract RollupProcessorV3 (0xFF1F2B4ADb9dF6FC8eAFecDcbF96A2B351680455) {
    +++ description: None
      values.$pastUpgrades.2.2:
+        ["0x7d657Ddcf7e2A5fD118dC8A6dDc3dC308AdC2728"]
      values.$pastUpgrades.2.1:
-        ["0x7d657Ddcf7e2A5fD118dC8A6dDc3dC308AdC2728"]
+        "0x540d7db72d3a04eef10b2c57b05382653c1bfb89a4a5bec24873747fa981c68c"
      values.$pastUpgrades.1.2:
+        ["0x8430Be7B8fd28Cc58EA70A25C9c7A624F26f5D09"]
      values.$pastUpgrades.1.1:
-        ["0x8430Be7B8fd28Cc58EA70A25C9c7A624F26f5D09"]
+        "0xe5e9eb537607a7998e112f673812580f7bb0c588a659df1d1a52a7aebc43af7f"
      values.$pastUpgrades.0.2:
+        ["0x3f972e325CecD99a6be267fd36ceB46DCa7C3F28"]
      values.$pastUpgrades.0.1:
-        ["0x3f972e325CecD99a6be267fd36ceB46DCa7C3F28"]
+        "0x837765f53d9ae32bf1b507fec696052d3ee2a245515dccebc13b3717bc987921"
    }
```

Generated with discovered.json: 0x8d9a0a95d3aa11dcfa7af73f65dccf0b530d8b0e

# Diff at Mon, 14 Oct 2024 10:49:34 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1afc77ff111ceb0970e7d09efcc7b2f376b0c281 block: 19816414
- current block number: 19816414

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19816414 (main branch discovery), not current.

```diff
    contract DefiBridgeProxy (0xA1BBa894a6D39D79C0D1ef9c68a2139c84B81487) {
    +++ description: None
      sourceHashes:
+        ["0x4c3447f738f38931105bfe030716b1bdc26c6e9ca0bbed38fff31afccabc90fb"]
    }
```

```diff
    contract Verifier28x32 (0xb7baA1420f88b7758E341c93463426A2b7651CFB) {
    +++ description: None
      sourceHashes:
+        ["0x55fc1304c184842e528edeff31d00322f57295e9f369b6e457f0c9944bc77de9"]
    }
```

```diff
    contract ProxyAdmin (0xC5b735d05c26579B701Be9bED253Bb588503B26B) {
    +++ description: None
      sourceHashes:
+        ["0xf944f88083f41ff959fefbdcd6fc3ae633692b072b8497fb14cbdd843eded490"]
    }
```

```diff
    contract RollupProcessorV3 (0xFF1F2B4ADb9dF6FC8eAFecDcbF96A2B351680455) {
    +++ description: None
      sourceHashes:
+        ["0xa7e3f6c355703ed46fcb2156862c4f01792b87beb10a87a81ce3bd5beee79b67","0xca3afcf92a9c12ce307d9de265b57fe02f7022f6a5f0eab38511eccafbfff478"]
    }
```

Generated with discovered.json: 0x3c5215d997e8351ca277c5a3aa3274c3d2a6f161

# Diff at Tue, 01 Oct 2024 10:49:57 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bd754dc73c66120164006054f8d25c5fae9cd910 block: 19816414
- current block number: 19816414

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19816414 (main branch discovery), not current.

```diff
    contract RollupProcessorV3 (0xFF1F2B4ADb9dF6FC8eAFecDcbF96A2B351680455) {
    +++ description: None
      values.$pastUpgrades:
+        [["2022-06-07T21:43:14.000Z",["0x3f972e325CecD99a6be267fd36ceB46DCa7C3F28"]],["2022-12-08T17:38:23.000Z",["0x8430Be7B8fd28Cc58EA70A25C9c7A624F26f5D09"]],["2024-04-09T18:42:35.000Z",["0x7d657Ddcf7e2A5fD118dC8A6dDc3dC308AdC2728"]]]
    }
```

Generated with discovered.json: 0x3c53c44d40c9bad7c5226fca36e29f5940b27f82

# Diff at Fri, 30 Aug 2024 07:51:26 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@6c1bd1f41fadf5f2cb1c1805b5a2c6138a3ed35a block: 19816414
- current block number: 19816414

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19816414 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0xC5b735d05c26579B701Be9bED253Bb588503B26B) {
    +++ description: None
      receivedPermissions.0.via:
-        []
    }
```

Generated with discovered.json: 0x087d03a086d807b24d6bd37993400755412c4ae6

# Diff at Fri, 23 Aug 2024 09:51:19 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@67597c7d6c810bc726594446890178150240711e block: 19816414
- current block number: 19816414

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19816414 (main branch discovery), not current.

```diff
    contract RollupProcessorV3 (0xFF1F2B4ADb9dF6FC8eAFecDcbF96A2B351680455) {
    +++ description: None
      values.$upgradeCount:
+        3
    }
```

Generated with discovered.json: 0x747b28f962c7a6fd65af13b35c07447a4d76707e

# Diff at Wed, 21 Aug 2024 10:02:05 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@2f6dde3357bf5d79196b6e94f79d853a6c4ec72b block: 19816414
- current block number: 19816414

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19816414 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0xC5b735d05c26579B701Be9bED253Bb588503B26B) {
    +++ description: None
      assignedPermissions:
-        {"upgrade":["0xFF1F2B4ADb9dF6FC8eAFecDcbF96A2B351680455"]}
      receivedPermissions:
+        [{"permission":"upgrade","target":"0xFF1F2B4ADb9dF6FC8eAFecDcbF96A2B351680455","via":[]}]
    }
```

```diff
    contract RollupProcessorV3 (0xFF1F2B4ADb9dF6FC8eAFecDcbF96A2B351680455) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xC5b735d05c26579B701Be9bED253Bb588503B26B","via":[]}]
    }
```

Generated with discovered.json: 0x39fc71387a47587540725472d60544e040a382ac

# Diff at Fri, 09 Aug 2024 10:08:43 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f0da1d0aab7bc6b3b5e54e7e93480bd98e57035 block: 19816414
- current block number: 19816414

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19816414 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0xC5b735d05c26579B701Be9bED253Bb588503B26B) {
    +++ description: None
      assignedPermissions.admin:
-        ["0xFF1F2B4ADb9dF6FC8eAFecDcbF96A2B351680455"]
      assignedPermissions.upgrade:
+        ["0xFF1F2B4ADb9dF6FC8eAFecDcbF96A2B351680455"]
    }
```

Generated with discovered.json: 0x671317ae0ac7f934dcaf37d70b48fc7c3411b9bb

# Diff at Tue, 07 May 2024 06:31:48 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@20cad040a80da0f4072f1c6f9778026143a458db block: 19773867
- current block number: 19816414

## Description

Renamed RollupProcessor to match the onchain reality.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19773867 (main branch discovery), not current.

```diff
    contract RollupProcessorV2 (0xFF1F2B4ADb9dF6FC8eAFecDcbF96A2B351680455) {
    +++ description: None
      name:
-        "RollupProcessorV2"
+        "RollupProcessorV3"
    }
```

Generated with discovered.json: 0x0cdec08688e0bf04ae55526247b3daa31458700c

# Diff at Wed, 01 May 2024 07:44:40 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@acc36455c1f5f929e0ed99a6e280e868e5ad4c09 block: 19624947
- current block number: 19773867

## Description

Aztec connect [was sunset on March 31st, 2024](https://medium.com/aztec-protocol/sunsetting-aztec-connect-a786edce5cae) and deposits are disabled (pendingCap = 0, dailyCap = 0). Furthermore, the ownership- and governance roles of the rollup are irrevocably renounced in this update.

Assets can still be manually withdrawn with the [Aztec Connect Ejector](https://github.com/AztecProtocol/aztec-connect-ejector).

## Watched changes

```diff
-   Status: DELETED
    contract Emergency Multisig (0x23f8008159C0427458b948c3DD7795c6DBE8236F)
    +++ description: None
```

```diff
-   Status: DELETED
    contract Resume Multisig (0x62415C92528C7d86Fd3f82D3fc75c2F66Bb9389a)
    +++ description: None
```

```diff
-   Status: DELETED
    contract Lister Multisig (0x68A36Aa8E309d5010ab4F9D6c5F1246b854D0b9e)
    +++ description: None
```

```diff
    contract ProxyAdmin (0xC5b735d05c26579B701Be9bED253Bb588503B26B) {
    +++ description: None
      values.owner:
-        "0xE298a76986336686CC3566469e3520d23D1a8aaD"
+        "0x0000000000000000000000000000000000000000"
    }
```

```diff
-   Status: DELETED
    contract Aztec Multisig (0xE298a76986336686CC3566469e3520d23D1a8aaD)
    +++ description: None
```

```diff
    contract RollupProcessorV2 (0xFF1F2B4ADb9dF6FC8eAFecDcbF96A2B351680455) {
    +++ description: None
      values.accessControl.DEFAULT_ADMIN_ROLE.members.0:
-        "0xE298a76986336686CC3566469e3520d23D1a8aaD"
      values.accessControl.OWNER_ROLE.members.0:
-        "0xE298a76986336686CC3566469e3520d23D1a8aaD"
      values.accessControl.EMERGENCY_ROLE.members.0:
-        "0x23f8008159C0427458b948c3DD7795c6DBE8236F"
      values.accessControl.LISTER_ROLE.members.0:
-        "0x68A36Aa8E309d5010ab4F9D6c5F1246b854D0b9e"
      values.accessControl.RESUME_ROLE.members.0:
-        "0x62415C92528C7d86Fd3f82D3fc75c2F66Bb9389a"
    }
```

## Source code changes

```diff
.../contracts/GnosisSafe.sol => /dev/null          | 422 ---------------------
 .../contracts/base/Executor.sol => /dev/null       |  27 --
 .../base/FallbackManager.sol => /dev/null          |  53 ---
 .../contracts/base/GuardManager.sol => /dev/null   |  50 ---
 .../contracts/base/ModuleManager.sol => /dev/null  | 133 -------
 .../contracts/base/OwnerManager.sol => /dev/null   | 149 --------
 .../contracts/common/Enum.sol => /dev/null         |   8 -
 .../common/EtherPaymentFallback.sol => /dev/null   |  13 -
 .../common/SecuredTokenTransfer.sol => /dev/null   |  35 --
 .../common/SelfAuthorized.sol => /dev/null         |  16 -
 .../common/SignatureDecoder.sol => /dev/null       |  36 --
 .../contracts/common/Singleton.sol => /dev/null    |  11 -
 .../common/StorageAccessible.sol => /dev/null      |  47 ---
 .../external/GnosisSafeMath.sol => /dev/null       |  54 ---
 .../ISignatureValidator.sol => /dev/null           |  20 -
 .../implementation/meta.txt => /dev/null           |   2 -
 .../Aztec Multisig/proxy/Proxy.sol => /dev/null    |  41 --
 .../Aztec Multisig/proxy/meta.txt => /dev/null     |   2 -
 .../contracts/GnosisSafe.sol => /dev/null          | 422 ---------------------
 .../contracts/base/Executor.sol => /dev/null       |  27 --
 .../base/FallbackManager.sol => /dev/null          |  53 ---
 .../contracts/base/GuardManager.sol => /dev/null   |  50 ---
 .../contracts/base/ModuleManager.sol => /dev/null  | 133 -------
 .../contracts/base/OwnerManager.sol => /dev/null   | 149 --------
 .../contracts/common/Enum.sol => /dev/null         |   8 -
 .../common/EtherPaymentFallback.sol => /dev/null   |  13 -
 .../common/SecuredTokenTransfer.sol => /dev/null   |  35 --
 .../common/SelfAuthorized.sol => /dev/null         |  16 -
 .../common/SignatureDecoder.sol => /dev/null       |  36 --
 .../contracts/common/Singleton.sol => /dev/null    |  11 -
 .../common/StorageAccessible.sol => /dev/null      |  47 ---
 .../external/GnosisSafeMath.sol => /dev/null       |  54 ---
 .../ISignatureValidator.sol => /dev/null           |  20 -
 .../implementation/meta.txt => /dev/null           |   2 -
 .../proxy/GnosisSafeProxy.sol => /dev/null         | 155 --------
 .../Emergency Multisig/proxy/meta.txt => /dev/null |   2 -
 .../contracts/GnosisSafe.sol => /dev/null          | 422 ---------------------
 .../contracts/base/Executor.sol => /dev/null       |  27 --
 .../base/FallbackManager.sol => /dev/null          |  53 ---
 .../contracts/base/GuardManager.sol => /dev/null   |  50 ---
 .../contracts/base/ModuleManager.sol => /dev/null  | 133 -------
 .../contracts/base/OwnerManager.sol => /dev/null   | 149 --------
 .../contracts/common/Enum.sol => /dev/null         |   8 -
 .../common/EtherPaymentFallback.sol => /dev/null   |  13 -
 .../common/SecuredTokenTransfer.sol => /dev/null   |  35 --
 .../common/SelfAuthorized.sol => /dev/null         |  16 -
 .../common/SignatureDecoder.sol => /dev/null       |  36 --
 .../contracts/common/Singleton.sol => /dev/null    |  11 -
 .../common/StorageAccessible.sol => /dev/null      |  47 ---
 .../external/GnosisSafeMath.sol => /dev/null       |  54 ---
 .../ISignatureValidator.sol => /dev/null           |  20 -
 .../implementation/meta.txt => /dev/null           |   2 -
 .../proxy/GnosisSafeProxy.sol => /dev/null         | 155 --------
 .../Lister Multisig/proxy/meta.txt => /dev/null    |   2 -
 .../contracts/GnosisSafe.sol => /dev/null          | 422 ---------------------
 .../contracts/base/Executor.sol => /dev/null       |  27 --
 .../base/FallbackManager.sol => /dev/null          |  53 ---
 .../contracts/base/GuardManager.sol => /dev/null   |  50 ---
 .../contracts/base/ModuleManager.sol => /dev/null  | 133 -------
 .../contracts/base/OwnerManager.sol => /dev/null   | 149 --------
 .../contracts/common/Enum.sol => /dev/null         |   8 -
 .../common/EtherPaymentFallback.sol => /dev/null   |  13 -
 .../common/SecuredTokenTransfer.sol => /dev/null   |  35 --
 .../common/SelfAuthorized.sol => /dev/null         |  16 -
 .../common/SignatureDecoder.sol => /dev/null       |  36 --
 .../contracts/common/Singleton.sol => /dev/null    |  11 -
 .../common/StorageAccessible.sol => /dev/null      |  47 ---
 .../external/GnosisSafeMath.sol => /dev/null       |  54 ---
 .../ISignatureValidator.sol => /dev/null           |  20 -
 .../implementation/meta.txt => /dev/null           |   2 -
 .../proxy/GnosisSafeProxy.sol => /dev/null         | 155 --------
 .../Resume Multisig/proxy/meta.txt => /dev/null    |   2 -
 72 files changed, 4818 deletions(-)
```

Generated with discovered.json: 0x41c6e44818140d3abfbd12081543887091fe4c75

# Diff at Wed, 10 Apr 2024 11:32:14 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@b05e9a9401061dc09d3987350e2d33de147386b8 block: 19531440
- current block number: 19624947

## Description

### RollupProcessorV3:

- Make processRollup() public by removing the `rollupProviders[msg.sender]` check from the function
- Remove default asset caps from the initializer (caps are currently set to 0)

This allows external participants to withdraw from the rollup and keeps deposits disabled, in line with their March 30 sunset.

### Verifier28x32:

Change of six constants.

From chatgpt:

- Two of the constants represent the elliptic curve point `Q2`
- The other four describe the elliptic curve point `g2_x`

These points among others are used to compute the verification key.

## Watched changes

```diff
-   Status: DELETED
    contract Verifier28x32 (0x9BDc85491BD589e8390A6AAb6982b82255ae2297)
    +++ description: Verifier contract used by the RollupProcessorV2.
```

```diff
    contract RollupProcessorV2 (0xFF1F2B4ADb9dF6FC8eAFecDcbF96A2B351680455) {
    +++ description: None
      upgradeability.implementation:
-        "0x8430Be7B8fd28Cc58EA70A25C9c7A624F26f5D09"
+        "0x7d657Ddcf7e2A5fD118dC8A6dDc3dC308AdC2728"
      implementations.0:
-        "0x8430Be7B8fd28Cc58EA70A25C9c7A624F26f5D09"
+        "0x7d657Ddcf7e2A5fD118dC8A6dDc3dC308AdC2728"
      values.getImplementationVersion:
-        2
+        3
+++ description: Address of the ZK verifier.
+++ type: PERMISSION
+++ severity: LOW
      values.verifier:
-        "0x9BDc85491BD589e8390A6AAb6982b82255ae2297"
+        "0xb7baA1420f88b7758E341c93463426A2b7651CFB"
      derivedName:
-        "RollupProcessorV2"
+        "RollupProcessorV3"
    }
```

```diff
+   Status: CREATED
    contract Verifier28x32 (0xb7baA1420f88b7758E341c93463426A2b7651CFB)
    +++ description: Verifier contract used by the RollupProcessorV2.
```

## Source code changes

```diff
.../contracts/access/AccessControl.sol             |  2 +-
 .../contracts/utils/Strings.sol                    |  2 +-
 .../contracts/utils/math/Math.sol                  |  4 +-
 .../RollupProcessorV2/implementation/meta.txt      |  4 +-
 .../src/core/processors/RollupProcessorV3.sol}     | 98 ++++++++--------------
 .../Verifier28x32/meta.txt                         |  2 +-
 .../core/verifier/keys/VerificationKey28x32.sol    | 18 ++--
 7 files changed, 49 insertions(+), 81 deletions(-)
```

Generated with discovered.json: 0x9e7064e6e198b24fb116f87b988a7ce0fed986a3

# Diff at Thu, 28 Mar 2024 08:32:53 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@867de6120241d47b66bf76f83c490408eb3595b0 block: 19326151
- current block number: 19531440

## Description

Update discovery to include the multisig threshold.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19326151 (main branch discovery), not current.

```diff
    contract Emergency Multisig (0x23f8008159C0427458b948c3DD7795c6DBE8236F) {
    +++ description: None
      upgradeability.threshold:
+        "2 of 15 (13%)"
    }
```

```diff
    contract Resume Multisig (0x62415C92528C7d86Fd3f82D3fc75c2F66Bb9389a) {
    +++ description: None
      upgradeability.threshold:
+        "10 of 15 (67%)"
    }
```

```diff
    contract Lister Multisig (0x68A36Aa8E309d5010ab4F9D6c5F1246b854D0b9e) {
    +++ description: None
      upgradeability.threshold:
+        "2 of 3 (67%)"
    }
```

```diff
    contract Aztec Multisig (0xE298a76986336686CC3566469e3520d23D1a8aaD) {
    +++ description: None
      upgradeability.threshold:
+        "1 of 2 (50%)"
    }
```

Generated with discovered.json: 0x73d400dd88af30c348a74387ae0bf451c5f428db

# Diff at Wed, 28 Feb 2024 12:54:36 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@65091524debd9f36ca34aa554968373d1b3115a7 block: 18340180
- current block number: 19326151

## Description

On Feb 16, 2024 the verifier has been updated. The difference between the
source code contains only changes to hardcoded values. This update is way
simpler than AztecV1. The update was done in a single step and the Sequencer of
Aztec Connect still posts and processes data without reverts.

## Watched changes

```diff
-   Status: DELETED
    contract Verifier28x32 (0x71c0Ab7dF00F00E4ec2990D4F1C8302c1D178f69) {
    }
```

```diff
    contract RollupProcessorV2 (0xFF1F2B4ADb9dF6FC8eAFecDcbF96A2B351680455) {
      values.verifier:
-        "0x71c0Ab7dF00F00E4ec2990D4F1C8302c1D178f69"
+        "0x9BDc85491BD589e8390A6AAb6982b82255ae2297"
    }
```

```diff
+   Status: CREATED
    contract Verifier28x32 (0x9BDc85491BD589e8390A6AAb6982b82255ae2297) {
    }
```

## Source code changes

```diff
.../Verifier28x32/meta.txt                         |  2 +-
 .../core/verifier/keys/VerificationKey28x32.sol    | 36 +++++++++++-----------
 2 files changed, 19 insertions(+), 19 deletions(-)
```

Generated with discovered.json: 0xd1fc1482dbb037a789f8c83db253e8e30567dad2

# Diff at Fri, 13 Oct 2023 08:09:03 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@ac0c322776a31842f5549b3d357b8b4bc3bfd07f

## Description

Verification keys update.

## Watched changes

```diff
-   Status: DELETED
    contract Verifier28x32 (0xB656f4219f565b93DF57D531B574E17FE0F25939) {
    }
```

```diff
    contract RollupProcessorV2 (0xFF1F2B4ADb9dF6FC8eAFecDcbF96A2B351680455) {
      values.verifier:
-        "0xB656f4219f565b93DF57D531B574E17FE0F25939"
+        "0x71c0Ab7dF00F00E4ec2990D4F1C8302c1D178f69"
    }
```

```diff
+   Status: CREATED
    contract Verifier28x32 (0x71c0Ab7dF00F00E4ec2990D4F1C8302c1D178f69) {
    }
```

## Source code changes

```diff
.../{.code@18163333 => .code}/Verifier28x32/meta.txt   |  2 +-
 .../Verifier28x32/verifier/BaseStandardVerifier.sol    |  4 ++--
 .../Verifier28x32/verifier/instances/Verifier28x32.sol |  2 +-
 .../verifier/keys/VerificationKey28x32.sol             | 18 +++++++++---------
 4 files changed, 13 insertions(+), 13 deletions(-)
```
