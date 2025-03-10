Generated with discovered.json: 0x2cf342ad94d4c192f80390ea7f160074ced9dade

# Diff at Tue, 04 Mar 2025 10:40:15 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@98d260b45fe0d2195ce5e629bd7b200c8706e8ba block: 20432700
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
      sinceBlock:
+        13809566
    }
```

```diff
    contract ZkSync (0x5CDAF83E077DBaC2692b5864CA18b61d67453Be8) {
    +++ description: None
      sinceBlock:
+        13809566
    }
```

```diff
    contract Governance (0x83Cb1531Ec8447366501aE440478da245EcffB89) {
    +++ description: None
      sinceBlock:
+        13809566
    }
```

```diff
    contract ZkSwapListing (0x8aA2C56dca9d59F4317c2fad632c192b18127709) {
    +++ description: None
      sinceBlock:
+        13809902
    }
```

```diff
    contract UpgradeGatekeeper (0xB0C7E781f70C0B8E3e62F1766a4Be6e435431390) {
    +++ description: None
      sinceBlock:
+        13809566
    }
```

```diff
    contract Verifier (0xB7A4f3eFBe8e2B2FC973FfDb1b1D7F19F012A7af) {
    +++ description: None
      sinceBlock:
+        13809566
    }
```

```diff
    contract UniswapV2Factory (0xc07f850b60E0EEd49a09E455b01a869C25963735) {
    +++ description: None
      sinceBlock:
+        13809566
    }
```

```diff
    contract ZkSeaNFT (0xc632347cc96A4400653E3514eA148630455295b5) {
    +++ description: None
      sinceBlock:
+        13809566
    }
```

```diff
    contract ZksToken (0xe4815AE53B124e7263F08dcDBBB757d41Ed658c6) {
    +++ description: None
      sinceBlock:
+        11305469
    }
```

Generated with discovered.json: 0xb14b2d7a9335725345f15ad28d11509be6a3dabc

# Diff at Mon, 20 Jan 2025 11:10:25 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@2c8b4f3d9910bb6371be9b4df87b70856e7d8c64 block: 20432700
- current block number: 20432700

## Description

Rerun on the same block number. Applies fixes to permissions and via field. Renames permission's target to to/from.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20432700 (main branch discovery), not current.

```diff
    contract VerifierExit (0x1d8d584F1aef51ad5E2f436F057E43e0d788Be81) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xB0C7E781f70C0B8E3e62F1766a4Be6e435431390"
      issuedPermissions.0.to:
+        "0xB0C7E781f70C0B8E3e62F1766a4Be6e435431390"
    }
```

```diff
    contract ZkSync (0x5CDAF83E077DBaC2692b5864CA18b61d67453Be8) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xB0C7E781f70C0B8E3e62F1766a4Be6e435431390"
      issuedPermissions.0.to:
+        "0xB0C7E781f70C0B8E3e62F1766a4Be6e435431390"
    }
```

```diff
    contract Governance (0x83Cb1531Ec8447366501aE440478da245EcffB89) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xB0C7E781f70C0B8E3e62F1766a4Be6e435431390"
      issuedPermissions.0.to:
+        "0xB0C7E781f70C0B8E3e62F1766a4Be6e435431390"
    }
```

```diff
    contract UpgradeGatekeeper (0xB0C7E781f70C0B8E3e62F1766a4Be6e435431390) {
    +++ description: None
      receivedPermissions.5.target:
-        "0xc632347cc96A4400653E3514eA148630455295b5"
      receivedPermissions.5.from:
+        "0xc632347cc96A4400653E3514eA148630455295b5"
      receivedPermissions.4.target:
-        "0xc07f850b60E0EEd49a09E455b01a869C25963735"
      receivedPermissions.4.from:
+        "0xc07f850b60E0EEd49a09E455b01a869C25963735"
      receivedPermissions.3.target:
-        "0xB7A4f3eFBe8e2B2FC973FfDb1b1D7F19F012A7af"
      receivedPermissions.3.from:
+        "0xB7A4f3eFBe8e2B2FC973FfDb1b1D7F19F012A7af"
      receivedPermissions.2.target:
-        "0x83Cb1531Ec8447366501aE440478da245EcffB89"
      receivedPermissions.2.from:
+        "0x83Cb1531Ec8447366501aE440478da245EcffB89"
      receivedPermissions.1.target:
-        "0x5CDAF83E077DBaC2692b5864CA18b61d67453Be8"
      receivedPermissions.1.from:
+        "0x5CDAF83E077DBaC2692b5864CA18b61d67453Be8"
      receivedPermissions.0.target:
-        "0x1d8d584F1aef51ad5E2f436F057E43e0d788Be81"
      receivedPermissions.0.from:
+        "0x1d8d584F1aef51ad5E2f436F057E43e0d788Be81"
    }
```

```diff
    contract Verifier (0xB7A4f3eFBe8e2B2FC973FfDb1b1D7F19F012A7af) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xB0C7E781f70C0B8E3e62F1766a4Be6e435431390"
      issuedPermissions.0.to:
+        "0xB0C7E781f70C0B8E3e62F1766a4Be6e435431390"
    }
```

```diff
    contract UniswapV2Factory (0xc07f850b60E0EEd49a09E455b01a869C25963735) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xB0C7E781f70C0B8E3e62F1766a4Be6e435431390"
      issuedPermissions.0.to:
+        "0xB0C7E781f70C0B8E3e62F1766a4Be6e435431390"
    }
```

```diff
    contract ZkSeaNFT (0xc632347cc96A4400653E3514eA148630455295b5) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xB0C7E781f70C0B8E3e62F1766a4Be6e435431390"
      issuedPermissions.0.to:
+        "0xB0C7E781f70C0B8E3e62F1766a4Be6e435431390"
    }
```

Generated with discovered.json: 0x50fc71a5e2f32dfe52e2b340d4db6080686d0e8d

# Diff at Mon, 14 Oct 2024 10:58:09 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1afc77ff111ceb0970e7d09efcc7b2f376b0c281 block: 20432700
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
      sourceHashes:
+        ["0xa4356b8fe23f3499a5494bac2e9e1588ba6976f987fff80e2261aa7ebaa20ce6","0xfdcc7775fea6ed53c90da50c4e8dfc0660ab84c65f6075ede59ccf78ae8dd45d"]
    }
```

```diff
    contract ZkSync (0x5CDAF83E077DBaC2692b5864CA18b61d67453Be8) {
    +++ description: None
      sourceHashes:
+        ["0xa4356b8fe23f3499a5494bac2e9e1588ba6976f987fff80e2261aa7ebaa20ce6","0x04c2a817fae899931571f8d2f3655b50f10a544cc9281094bf0e5fd5b2c7a173","0xd8f53791fc9bb0df1c3d903f577e3d06a232910af94919846aa5ede33e425de5","0x96364e118ebcb69d8bbaa8ce71f6639d303a031f47258821d77892edd89bb476","0x6578bc6e4cf4cc0ec7d845733d5337fcc6896e629499a4af73d602cac922868d"]
    }
```

```diff
    contract Governance (0x83Cb1531Ec8447366501aE440478da245EcffB89) {
    +++ description: None
      sourceHashes:
+        ["0xa4356b8fe23f3499a5494bac2e9e1588ba6976f987fff80e2261aa7ebaa20ce6","0x0ed1646d0bc938555ef2ea51e53f8a3440effc46825b7a79ee787ee9decb8cd3"]
    }
```

```diff
    contract ZkSwapListing (0x8aA2C56dca9d59F4317c2fad632c192b18127709) {
    +++ description: None
      sourceHashes:
+        ["0xce4af2ec88a2ba33052ea9fe2da9580a88710e57fb6946fb00d5740600e11ee2"]
    }
```

```diff
    contract UpgradeGatekeeper (0xB0C7E781f70C0B8E3e62F1766a4Be6e435431390) {
    +++ description: None
      sourceHashes:
+        ["0x1359a771e28c9c71730920ab6bee9509009c60908022ff865419a483f74f702b"]
    }
```

```diff
    contract Verifier (0xB7A4f3eFBe8e2B2FC973FfDb1b1D7F19F012A7af) {
    +++ description: None
      sourceHashes:
+        ["0xa4356b8fe23f3499a5494bac2e9e1588ba6976f987fff80e2261aa7ebaa20ce6","0xcd9df57c71f79c48ecc98c2cbcbd634ca80c87f8e1fcde7d3a5082750f2ab1db"]
    }
```

```diff
    contract UniswapV2Factory (0xc07f850b60E0EEd49a09E455b01a869C25963735) {
    +++ description: None
      sourceHashes:
+        ["0xa4356b8fe23f3499a5494bac2e9e1588ba6976f987fff80e2261aa7ebaa20ce6","0x86e6238a6b2cd0e01b10a66c120be7cfb092bbeb23c0b83e457b160062477b45"]
    }
```

```diff
    contract ZkSeaNFT (0xc632347cc96A4400653E3514eA148630455295b5) {
    +++ description: None
      sourceHashes:
+        ["0xa4356b8fe23f3499a5494bac2e9e1588ba6976f987fff80e2261aa7ebaa20ce6","0xb46d8e739a276f260a8ac84136cd5b77d6b72025b08d7f524318665af69fa116"]
    }
```

```diff
    contract ZksToken (0xe4815AE53B124e7263F08dcDBBB757d41Ed658c6) {
    +++ description: None
      sourceHashes:
+        ["0xa7344a41ac050b7f10b2dd12807615cd0dbfd63e480cacec2c8a30dd7845522e"]
    }
```

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
