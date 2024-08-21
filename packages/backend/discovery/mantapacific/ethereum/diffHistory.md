Generated with discovered.json: 0x97a1675162ec41cabf82b5f9462bdb065d32ce7c

# Diff at Wed, 21 Aug 2024 10:03:59 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@2f6dde3357bf5d79196b6e94f79d853a6c4ec72b block: 19531966
- current block number: 19531966

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19531966 (main branch discovery), not current.

```diff
    contract L2OutputOracle (0x30c789674ad3B458886BBC9abf42EEe19EA05C1D) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xa2DCa85BB892De55D8B262d1806114733106e8D1","via":[]}]
    }
```

```diff
    contract AddressManager (0x3Ad319BB4872F8cB75a26Ac30CC4bD2d56b67b05) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"configure","target":"0xa2DCa85BB892De55D8B262d1806114733106e8D1","via":[]}]
    }
```

```diff
    contract L1StandardBridge (0x3B95bC951EE0f553ba487327278cAc44f29715E5) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xa2DCa85BB892De55D8B262d1806114733106e8D1","via":[]}]
    }
```

```diff
    contract AdminMultisig (0x3c46C05c2eba8eDd0B0f0C8B1D2fBf9fc53ea01E) {
    +++ description: It can act on behalf of 0xa2DCa85BB892De55D8B262d1806114733106e8D1, inheriting its permissions.
      assignedPermissions:
-        {"configure":["0xa2DCa85BB892De55D8B262d1806114733106e8D1"]}
      receivedPermissions:
+        [{"permission":"configure","target":"0xa2DCa85BB892De55D8B262d1806114733106e8D1","via":[]}]
    }
```

```diff
    contract SystemConfig (0x895E00269A05848F3c9889EfA677D02fF7351a5D) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xa2DCa85BB892De55D8B262d1806114733106e8D1","via":[]}]
    }
```

```diff
    contract OptimismPortal (0x9168765EE952de7C6f8fC6FaD5Ec209B960b7622) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xa2DCa85BB892De55D8B262d1806114733106e8D1","via":[]}]
    }
```

```diff
    contract ProxyAdmin (0xa2DCa85BB892De55D8B262d1806114733106e8D1) {
    +++ description: None
      assignedPermissions:
-        {"upgrade":["0x30c789674ad3B458886BBC9abf42EEe19EA05C1D","0x3B95bC951EE0f553ba487327278cAc44f29715E5","0x895E00269A05848F3c9889EfA677D02fF7351a5D","0x9168765EE952de7C6f8fC6FaD5Ec209B960b7622"],"configure":["0x3Ad319BB4872F8cB75a26Ac30CC4bD2d56b67b05"]}
      issuedPermissions:
+        [{"permission":"configure","target":"0x3c46C05c2eba8eDd0B0f0C8B1D2fBf9fc53ea01E","via":[]}]
      receivedPermissions:
+        [{"permission":"configure","target":"0x3Ad319BB4872F8cB75a26Ac30CC4bD2d56b67b05","via":[]},{"permission":"upgrade","target":"0x30c789674ad3B458886BBC9abf42EEe19EA05C1D","via":[]},{"permission":"upgrade","target":"0x3B95bC951EE0f553ba487327278cAc44f29715E5","via":[]},{"permission":"upgrade","target":"0x895E00269A05848F3c9889EfA677D02fF7351a5D","via":[]},{"permission":"upgrade","target":"0x9168765EE952de7C6f8fC6FaD5Ec209B960b7622","via":[]}]
    }
```

Generated with discovered.json: 0xeb52acb3dbf030c27907bcb03edebb606ca2bdee

# Diff at Fri, 09 Aug 2024 12:00:21 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bf40aa32f030fd312056ca0ef198c8550467d1d7 block: 19531966
- current block number: 19531966

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19531966 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0xa2DCa85BB892De55D8B262d1806114733106e8D1) {
    +++ description: None
      assignedPermissions.upgrade.3:
-        "0x895E00269A05848F3c9889EfA677D02fF7351a5D"
+        "0x9168765EE952de7C6f8fC6FaD5Ec209B960b7622"
      assignedPermissions.upgrade.2:
-        "0x30c789674ad3B458886BBC9abf42EEe19EA05C1D"
+        "0x895E00269A05848F3c9889EfA677D02fF7351a5D"
      assignedPermissions.upgrade.1:
-        "0x9168765EE952de7C6f8fC6FaD5Ec209B960b7622"
+        "0x3B95bC951EE0f553ba487327278cAc44f29715E5"
      assignedPermissions.upgrade.0:
-        "0x3B95bC951EE0f553ba487327278cAc44f29715E5"
+        "0x30c789674ad3B458886BBC9abf42EEe19EA05C1D"
    }
```

Generated with discovered.json: 0x067a99a0bd128bff0d80dda275e0022660b6453e

# Diff at Fri, 09 Aug 2024 10:10:28 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f0da1d0aab7bc6b3b5e54e7e93480bd98e57035 block: 19531966
- current block number: 19531966

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19531966 (main branch discovery), not current.

```diff
    contract AdminMultisig (0x3c46C05c2eba8eDd0B0f0C8B1D2fBf9fc53ea01E) {
    +++ description: It can act on behalf of 0xa2DCa85BB892De55D8B262d1806114733106e8D1, inheriting its permissions.
      assignedPermissions.owner:
-        ["0xa2DCa85BB892De55D8B262d1806114733106e8D1"]
      assignedPermissions.configure:
+        ["0xa2DCa85BB892De55D8B262d1806114733106e8D1"]
      values.$multisigThreshold:
-        "5 of 7 (71%)"
      values.getOwners:
-        ["0x12ee26aD74d50a1f6BDD90811387d1e0f3e7C76A","0x4b1A788B20bb85eb19f8e9B69B8a584e7fA29fe5","0x356000Cec4fC967f8FC372381D983426760A0391","0xB44948Ff3E8a4d3Ac32A376B4b3209AdC7620770","0xDC80503b718Ff3B2e43db42460A718c119e75cdd","0x92124ee0e7238992E5E7F34f9FBBCD71931ABC6D","0x35Aee2b2aa6ACB13C3a38a58AEb069C163734FaD"]
      values.getThreshold:
-        5
      values.$members:
+        ["0x12ee26aD74d50a1f6BDD90811387d1e0f3e7C76A","0x4b1A788B20bb85eb19f8e9B69B8a584e7fA29fe5","0x356000Cec4fC967f8FC372381D983426760A0391","0xB44948Ff3E8a4d3Ac32A376B4b3209AdC7620770","0xDC80503b718Ff3B2e43db42460A718c119e75cdd","0x92124ee0e7238992E5E7F34f9FBBCD71931ABC6D","0x35Aee2b2aa6ACB13C3a38a58AEb069C163734FaD"]
      values.$threshold:
+        5
      values.multisigThreshold:
+        "5 of 7 (71%)"
    }
```

```diff
    contract ProxyAdmin (0xa2DCa85BB892De55D8B262d1806114733106e8D1) {
    +++ description: None
      assignedPermissions.admin:
-        ["0x30c789674ad3B458886BBC9abf42EEe19EA05C1D","0x3B95bC951EE0f553ba487327278cAc44f29715E5","0x895E00269A05848F3c9889EfA677D02fF7351a5D","0x9168765EE952de7C6f8fC6FaD5Ec209B960b7622"]
      assignedPermissions.owner:
-        ["0x3Ad319BB4872F8cB75a26Ac30CC4bD2d56b67b05"]
      assignedPermissions.upgrade:
+        ["0x3B95bC951EE0f553ba487327278cAc44f29715E5","0x9168765EE952de7C6f8fC6FaD5Ec209B960b7622","0x30c789674ad3B458886BBC9abf42EEe19EA05C1D","0x895E00269A05848F3c9889EfA677D02fF7351a5D"]
      assignedPermissions.configure:
+        ["0x3Ad319BB4872F8cB75a26Ac30CC4bD2d56b67b05"]
    }
```

Generated with discovered.json: 0xbe289f502c3021829ee2cab7c512a572d7912d24

# Diff at Tue, 30 Jul 2024 11:12:40 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@b2b6471ff62871f4956541f42ec025c356c08f7e block: 19531966
- current block number: 19531966

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19531966 (main branch discovery), not current.

```diff
    contract SystemConfig (0x895E00269A05848F3c9889EfA677D02fF7351a5D) {
    +++ description: None
      fieldMeta:
+        {"overhead":{"severity":"LOW","description":"Fixed L2 gas overhead. Used as part of the L2 fee calculation."},"scalar":{"severity":"LOW","description":"Dynamic L2 gas overhead. Used as part of the L2 fee calculation."}}
    }
```

Generated with discovered.json: 0x0a45e5c92f859c0519f98dc3bc80e43aa365fa72

# Diff at Thu, 18 Jul 2024 10:31:49 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@d89fe52cb65d643cef712d1d7910564a7acf2dce block: 19531966
- current block number: 19531966

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19531966 (main branch discovery), not current.

```diff
    contract AdminMultisig (0x3c46C05c2eba8eDd0B0f0C8B1D2fBf9fc53ea01E) {
    +++ description: None
      descriptions:
+        ["It can act on behalf of 0xa2DCa85BB892De55D8B262d1806114733106e8D1, inheriting its permissions."]
    }
```

Generated with discovered.json: 0x258219b501d363843138ef55364ea46a8d2e8675

# Diff at Thu, 28 Mar 2024 10:18:22 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@dd32bb06b292cc8459fb09925454ee3a90f5c27e block: 19439793
- current block number: 19531966

## Description

Update discovery to include the multisig threshold.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19439793 (main branch discovery), not current.

```diff
    contract AdminMultisig (0x3c46C05c2eba8eDd0B0f0C8B1D2fBf9fc53ea01E) {
    +++ description: None
      upgradeability.threshold:
+        "5 of 7 (71%)"
    }
```

Generated with discovered.json: 0x7453a7a9b4472a9d917f35faf1d6d48047385e55

# Diff at Thu, 14 Mar 2024 07:47:54 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@ad2a1d42c830fe0716608a8fb29e527b676ac443 block: 19425422
- current block number: 19431859

## Description

The scalar value has been decreased, which decreases the result of the L2 fee calculation.

## Watched changes

```diff
    contract SystemConfig (0x895E00269A05848F3c9889EfA677D02fF7351a5D) {
    +++ description: None
+++ description: Dynamic L2 gas overhead. Used as part of the L2 fee calculation.
+++ severity: LOW
      values.scalar:
-        66666
+        6666
    }
```

Generated with discovered.json: 0xc5df0df9a23f2a2bf491ad8e88b775ebdcfe35f5

# Diff at Wed, 13 Mar 2024 10:01:47 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@b09f0a6b1067bd3da915ef7afd86147789cc65d3 block: 19411962
- current block number: 19425422

## Description

The scalar value has been decreased, which reduces the result of the L2 fee calculation.

## Watched changes

```diff
    contract SystemConfig (0x895E00269A05848F3c9889EfA677D02fF7351a5D) {
    +++ description: None
+++ description: Dynamic L2 gas overhead. Used as part of the L2 fee calculation.
+++ severity: LOW
      values.scalar:
-        333333
+        66666
    }
```

Generated with discovered.json: 0x419752b52aa56fed69f8b88c8ca8cfa92d3010df

# Diff at Mon, 11 Mar 2024 12:51:29 GMT:

- author: Michał Sobieraj-Jakubiec (<michalsidzej@gmail.com>)
- comparing to: main@64454506aee2b4b4e15b121f096369e92ec4cf20 block: 19176785
- current block number: 19411962

## Description

Update OP stack DA handler

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19176785 (main branch discovery), not current.

```diff
    contract SystemConfig (0x895E00269A05848F3c9889EfA677D02fF7351a5D) {
    +++ description: None
      values.opStackDA.isSequencerSendingBlobTx:
+        false
    }
```

Generated with discovered.json: 0x857965f6efe7d718d517b2d9c6a3a26eca86b044

# Diff at Wed, 07 Feb 2024 14:03:49 GMT:

- author: Michał Sobieraj-Jakubiec (<michalsidzej@gmail.com>)
- comparing to: main@2e35800e01005d93332a552032058dcd67f3631d block: 19175192
- current block number: 19176785

## Description

Added opStackSequencerInbox handler

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19175192 (main branch discovery), not current.

```diff
    contract SystemConfig (0x895E00269A05848F3c9889EfA677D02fF7351a5D) {
      values.sequencerInbox:
+        "0xAEbA8e2307A22B6824a9a7a39f8b016C357Cd1Fe"
    }
```

Generated with discovered.json: 0xf41b9412e1ab67a48ee15d2c459e9b166a47846e

# Diff at Wed, 07 Feb 2024 08:42:00 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@64f1e0f27f831d3ef860a1c2faad8c77e04e6c29 block: 19090321
- current block number: 19175192

## Description

Updated with the new OpDAHandler to remove the field.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19090321 (main branch discovery), not current.

```diff
    contract SystemConfig (0x895E00269A05848F3c9889EfA677D02fF7351a5D) {
      values.opStackDA.isAllTxsLengthEqualToCelestiaDAExample:
-        true
    }
```

Generated with discovered.json: 0x3302e4ba6cac61c151ac35627e4c8bdfe701eebe

# Diff at Fri, 26 Jan 2024 10:56:26 GMT:

- author: Michał Sobieraj-Jakubiec (<michalsidzej@gmail.com>)
- comparing to: main@bb037f7100968a00265a4787338e51ca81aafe9b block: 19061375
- current block number: 19090321

## Description

Added opStackDa handler

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19061375 (main branch discovery), not current.

```diff
    contract SystemConfig (0x895E00269A05848F3c9889EfA677D02fF7351a5D) {
      values.opStackDA:
+        {"isAllTxsLengthEqualToCelestiaDAExample":true,"isSomeTxsLengthEqualToCelestiaDAExample":true}
    }
```

Generated with discovered.json: 0x0d84b992f8771a97aab0e3b0217bb0556c350a83

# Diff at Mon, 22 Jan 2024 09:26:23 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@7755f153438c1f16773ba6733cfa3a8c8bc0a394 block: 19040782
- current block number: 19061375

## Description

L2 Block gas limit decreased, but still increased from the previous 30000000.

## Watched changes

```diff
    contract SystemConfig (0x895E00269A05848F3c9889EfA677D02fF7351a5D) {
      values.gasLimit:
-        100000000
+        50000000
    }
```

# Diff at Fri, 19 Jan 2024 12:03:31 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@a25b693cc3754074753705b502d4656fdd29ecbb block: 18927709
- current block number: 19040782

## Description

L2 Block gas limit increased.

## Watched changes

```diff
    contract SystemConfig (0x895E00269A05848F3c9889EfA677D02fF7351a5D) {
      values.gasLimit:
-        30000000
+        100000000
    }
```

# Diff at Wed, 03 Jan 2024 15:26:09 GMT:

- author: Radina Talanova (<nt.radina@gmail.com>)
- comparing to: main@e8eb03b39061a86a8ec01e26d970e40d080ad225

## Description

Scalar - a system configuration parameter used as dynamic L2 gas overhead in the L2 fee calculation, has been increased.

## Watched changes

```diff
    contract SystemConfig (0x895E00269A05848F3c9889EfA677D02fF7351a5D) {
      values.scalar:
-        166667
+        333333
    }
```

# Diff at Tue, 19 Dec 2023 14:23:07 GMT:

- author: Radina Talanova (<nt.radina@gmail.com>)
- comparing to: main@a5f45641c9d10d62e395e1cd088a79446ab63c09

## Description

Scalar - a system configuration parameter used as dynamic L2 gas overhead in the L2 fee calculation, has been decreased.

## Watched changes

```diff
    contract SystemConfig (0x895E00269A05848F3c9889EfA677D02fF7351a5D) {
      values.scalar:
-        700000
+        166667
    }
```

# Diff at Thu, 30 Nov 2023 10:07:56 GMT:

- author: Radina Talanova (<nt.radina@gmail.com>)
- comparing to: main@d4d01e687218065c65077f4e7616188f47938ed3

## Description

Scalar - a system configuration parameter used as dynamic L2 gas overhead in the L2 fee calculation, has been decreased.

## Watched changes

```diff
    contract SystemConfig (0x895E00269A05848F3c9889EfA677D02fF7351a5D) {
      values.scalar:
-        1000000
+        700000
    }
```

# Diff at Fri, 17 Nov 2023 12:11:23 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@8df7aef75226275b8e56ba8d4d76ce64057b0360

## Description

System configuration parameters used for L2 fee calculation have been decreased:

- overhead: 2100 -> 1000
- scalar: 1300000 -> 1000000

## Watched changes

```diff
    contract SystemConfig (0x895E00269A05848F3c9889EfA677D02fF7351a5D) {
      values.overhead:
-        2100
+        1000
      values.scalar:
-        1300000
+        1000000
    }
```

# Diff at Mon, 02 Oct 2023 13:46:59 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@10dbc30af490bd7af5cfca51b827ce3f10182f4d

## Watched changes

```diff
    contract ProxyAdmin (0xa2DCa85BB892De55D8B262d1806114733106e8D1) {
      values.owner:
-        "0x4b1A788B20bb85eb19f8e9B69B8a584e7fA29fe5"
+        "0x3c46C05c2eba8eDd0B0f0C8B1D2fBf9fc53ea01E"
    }
```

```diff
+   Status: CREATED
    contract AdminMultisig (0x3c46C05c2eba8eDd0B0f0C8B1D2fBf9fc53ea01E) {
    }
```

# Diff at Tue, 26 Sep 2023 10:12:59 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@cfd4e281f2af40c7c69302b16c1308c0c5651be0

## Watched changes

```diff
    contract L2OutputOracle (0x30c789674ad3B458886BBC9abf42EEe19EA05C1D) {
      values.deletedOutputs:
+        []
    }
```

# Diff at Wed, 20 Sep 2023 14:08:40 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@baff89f527efcf9b2e09db38bebde3bbd142837c

## Watched changes

```diff
    contract SystemConfig (0x895E00269A05848F3c9889EfA677D02fF7351a5D) {
      values.batcherHash:
-        "0x000000000000000000000000a76e31d8471d569efdd3d95d1b11ce6710f4533f"
+        "0xA76E31D8471D569EfDd3D95d1b11Ce6710f4533F"
      derivedName:
+        "SystemConfig"
    }
```
