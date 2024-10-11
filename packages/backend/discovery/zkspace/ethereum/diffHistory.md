Generated with discovered.json: 0x041d7a092df07a886f8438bf8cc2dc987d9b949a

# Diff at Tue, 01 Oct 2024 11:12:04 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bd754dc73c66120164006054f8d25c5fae9cd910 block: 20432700
- current block number: 20432700

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20432700 (main branch discovery), not current.

```diff
    contract VerifierExit (0x1d8d584F1aef51ad5E2f436F057E43e0d788Be81) {
    +++ description: None
      values.$pastUpgrades:
+        []
    }
```

```diff
    contract Governance (0x83Cb1531Ec8447366501aE440478da245EcffB89) {
    +++ description: None
      values.$pastUpgrades:
+        []
    }
```

```diff
    contract Verifier (0xB7A4f3eFBe8e2B2FC973FfDb1b1D7F19F012A7af) {
    +++ description: None
      values.$pastUpgrades:
+        []
    }
```

```diff
    contract UniswapV2Factory (0xc07f850b60E0EEd49a09E455b01a869C25963735) {
    +++ description: None
      values.$pastUpgrades:
+        []
    }
```

```diff
    contract ZkSeaNFT (0xc632347cc96A4400653E3514eA148630455295b5) {
    +++ description: None
      values.$pastUpgrades:
+        []
    }
```

Generated with discovered.json: 0x44efff2cc9524f5be116c90c0fc0466325c6aa38

# Diff at Fri, 30 Aug 2024 08:01:46 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@6c1bd1f41fadf5f2cb1c1805b5a2c6138a3ed35a block: 20432700
- current block number: 20432700

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20432700 (main branch discovery), not current.

```diff
    contract UpgradeGatekeeper (0xB0C7E781f70C0B8E3e62F1766a4Be6e435431390) {
    +++ description: None
      receivedPermissions.5.via:
-        []
      receivedPermissions.4.via:
-        []
      receivedPermissions.3.via:
-        []
      receivedPermissions.2.via:
-        []
      receivedPermissions.1.via:
-        []
      receivedPermissions.0.via:
-        []
    }
```

Generated with discovered.json: 0x62764b82256f5462e2863fc1c49d4a5e0c82ff44

# Diff at Fri, 23 Aug 2024 09:56:37 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@67597c7d6c810bc726594446890178150240711e block: 20432700
- current block number: 20432700

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20432700 (main branch discovery), not current.

```diff
    contract VerifierExit (0x1d8d584F1aef51ad5E2f436F057E43e0d788Be81) {
    +++ description: None
      values.$upgradeCount:
+        0
    }
```

```diff
    contract Governance (0x83Cb1531Ec8447366501aE440478da245EcffB89) {
    +++ description: None
      values.$upgradeCount:
+        0
    }
```

```diff
    contract Verifier (0xB7A4f3eFBe8e2B2FC973FfDb1b1D7F19F012A7af) {
    +++ description: None
      values.$upgradeCount:
+        0
    }
```

```diff
    contract UniswapV2Factory (0xc07f850b60E0EEd49a09E455b01a869C25963735) {
    +++ description: None
      values.$upgradeCount:
+        0
    }
```

```diff
    contract ZkSeaNFT (0xc632347cc96A4400653E3514eA148630455295b5) {
    +++ description: None
      values.$upgradeCount:
+        0
    }
```

Generated with discovered.json: 0xc28f08d411615cb59d491c644eaf66871e4a34da

# Diff at Wed, 21 Aug 2024 10:06:46 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@2f6dde3357bf5d79196b6e94f79d853a6c4ec72b block: 20432700
- current block number: 20432700

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20432700 (main branch discovery), not current.

```diff
    contract VerifierExit (0x1d8d584F1aef51ad5E2f436F057E43e0d788Be81) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xB0C7E781f70C0B8E3e62F1766a4Be6e435431390","via":[]}]
    }
```

```diff
    contract ZkSync (0x5CDAF83E077DBaC2692b5864CA18b61d67453Be8) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xB0C7E781f70C0B8E3e62F1766a4Be6e435431390","via":[]}]
    }
```

```diff
    contract Governance (0x83Cb1531Ec8447366501aE440478da245EcffB89) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xB0C7E781f70C0B8E3e62F1766a4Be6e435431390","via":[]}]
    }
```

```diff
    contract UpgradeGatekeeper (0xB0C7E781f70C0B8E3e62F1766a4Be6e435431390) {
    +++ description: None
      assignedPermissions:
-        {"upgrade":["0x1d8d584F1aef51ad5E2f436F057E43e0d788Be81","0x5CDAF83E077DBaC2692b5864CA18b61d67453Be8","0x83Cb1531Ec8447366501aE440478da245EcffB89","0xB7A4f3eFBe8e2B2FC973FfDb1b1D7F19F012A7af","0xc07f850b60E0EEd49a09E455b01a869C25963735","0xc632347cc96A4400653E3514eA148630455295b5"]}
      receivedPermissions:
+        [{"permission":"upgrade","target":"0x1d8d584F1aef51ad5E2f436F057E43e0d788Be81","via":[]},{"permission":"upgrade","target":"0x5CDAF83E077DBaC2692b5864CA18b61d67453Be8","via":[]},{"permission":"upgrade","target":"0x83Cb1531Ec8447366501aE440478da245EcffB89","via":[]},{"permission":"upgrade","target":"0xB7A4f3eFBe8e2B2FC973FfDb1b1D7F19F012A7af","via":[]},{"permission":"upgrade","target":"0xc07f850b60E0EEd49a09E455b01a869C25963735","via":[]},{"permission":"upgrade","target":"0xc632347cc96A4400653E3514eA148630455295b5","via":[]}]
    }
```

```diff
    contract Verifier (0xB7A4f3eFBe8e2B2FC973FfDb1b1D7F19F012A7af) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xB0C7E781f70C0B8E3e62F1766a4Be6e435431390","via":[]}]
    }
```

```diff
    contract UniswapV2Factory (0xc07f850b60E0EEd49a09E455b01a869C25963735) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xB0C7E781f70C0B8E3e62F1766a4Be6e435431390","via":[]}]
    }
```

```diff
    contract ZkSeaNFT (0xc632347cc96A4400653E3514eA148630455295b5) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xB0C7E781f70C0B8E3e62F1766a4Be6e435431390","via":[]}]
    }
```

Generated with discovered.json: 0x7a89a61b5eae1b93ecc0a9701bbc4dd4f4e743c1

# Diff at Fri, 09 Aug 2024 12:03:11 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bf40aa32f030fd312056ca0ef198c8550467d1d7 block: 20432700
- current block number: 20432700

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20432700 (main branch discovery), not current.

```diff
    contract UpgradeGatekeeper (0xB0C7E781f70C0B8E3e62F1766a4Be6e435431390) {
    +++ description: None
      assignedPermissions.upgrade.5:
-        "0x5CDAF83E077DBaC2692b5864CA18b61d67453Be8"
+        "0xc632347cc96A4400653E3514eA148630455295b5"
      assignedPermissions.upgrade.4:
-        "0x1d8d584F1aef51ad5E2f436F057E43e0d788Be81"
+        "0xc07f850b60E0EEd49a09E455b01a869C25963735"
      assignedPermissions.upgrade.3:
-        "0x83Cb1531Ec8447366501aE440478da245EcffB89"
+        "0xB7A4f3eFBe8e2B2FC973FfDb1b1D7F19F012A7af"
      assignedPermissions.upgrade.2:
-        "0xB7A4f3eFBe8e2B2FC973FfDb1b1D7F19F012A7af"
+        "0x83Cb1531Ec8447366501aE440478da245EcffB89"
      assignedPermissions.upgrade.1:
-        "0xc07f850b60E0EEd49a09E455b01a869C25963735"
+        "0x5CDAF83E077DBaC2692b5864CA18b61d67453Be8"
      assignedPermissions.upgrade.0:
-        "0xc632347cc96A4400653E3514eA148630455295b5"
+        "0x1d8d584F1aef51ad5E2f436F057E43e0d788Be81"
    }
```

Generated with discovered.json: 0xde560b5d43ada0240d72357de990e733602d85fb

# Diff at Fri, 09 Aug 2024 10:13:09 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f0da1d0aab7bc6b3b5e54e7e93480bd98e57035 block: 20432700
- current block number: 20432700

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20432700 (main branch discovery), not current.

```diff
    contract UpgradeGatekeeper (0xB0C7E781f70C0B8E3e62F1766a4Be6e435431390) {
    +++ description: None
      assignedPermissions.admin:
-        ["0x1d8d584F1aef51ad5E2f436F057E43e0d788Be81","0x5CDAF83E077DBaC2692b5864CA18b61d67453Be8","0x83Cb1531Ec8447366501aE440478da245EcffB89","0xB7A4f3eFBe8e2B2FC973FfDb1b1D7F19F012A7af","0xc07f850b60E0EEd49a09E455b01a869C25963735","0xc632347cc96A4400653E3514eA148630455295b5"]
      assignedPermissions.upgrade:
+        ["0xc632347cc96A4400653E3514eA148630455295b5","0xc07f850b60E0EEd49a09E455b01a869C25963735","0xB7A4f3eFBe8e2B2FC973FfDb1b1D7F19F012A7af","0x83Cb1531Ec8447366501aE440478da245EcffB89","0x1d8d584F1aef51ad5E2f436F057E43e0d788Be81","0x5CDAF83E077DBaC2692b5864CA18b61d67453Be8"]
    }
```

Generated with discovered.json: 0x5d346081462a1243e5452d82503028ed73d57709

# Diff at Tue, 16 Jan 2024 12:44:46 GMT:

- author: Michał Podsiadły (<michal.podsiadly@l2beat.com>)
- comparing to: main@c032360868b807a04d2314b95327fc167e7f7c31 block: 18220342
- current block number: 19019529

## Description

Ignore token-related values.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 18220342 (main branch discovery), not current.

```diff
    contract ZkSync (0x5CDAF83E077DBaC2692b5864CA18b61d67453Be8) {
      values.totalPairTokens:
-        64
    }
```

```diff
    contract Governance (0x83Cb1531Ec8447366501aE440478da245EcffB89) {
      values.totalUserTokens:
-        41
    }
```

```diff
    contract ZkSwapListing (0x8aA2C56dca9d59F4317c2fad632c192b18127709) {
      values.listingCount:
-        64
      derivedName:
+        "ZkSwapListing"
    }
```

```diff
    contract UniswapV2Factory (0xc07f850b60E0EEd49a09E455b01a869C25963735) {
      values.allPairsLength:
-        64
    }
```

# Diff at Tue, 26 Sep 2023 13:47:45 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@cfd4e281f2af40c7c69302b16c1308c0c5651be0

## Watched changes

```diff
    contract ZkSync (0x5CDAF83E077DBaC2692b5864CA18b61d67453Be8) {
      values.revertedBlocks:
+        [{"totalBlocksCommitted":13463,"totalBlocksVerified":13461}]
    }
```
