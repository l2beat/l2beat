Generated with discovered.json: 0x338012dac1e483902682f7612829278609ab1313

# Diff at Tue, 01 Oct 2024 11:11:16 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bd754dc73c66120164006054f8d25c5fae9cd910 block: 19876012
- current block number: 19876012

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19876012 (main branch discovery), not current.

```diff
    contract SynapseBridge (0x2796317b0fF8538F253012862c06787Adfb8cEb6) {
    +++ description: None
      values.$pastUpgrades:
+        [["2021-08-20T14:42:12.000Z",["0x1622B32113bd2dFE1d92B30dA7FB68b7E5FA81b2"]],["2021-08-24T02:26:46.000Z",["0x346B928D29827a02bC06A4A66D7FF37D250bcEE8"]],["2021-08-24T03:58:48.000Z",["0x36829ba54e6A0f11fB6e5A45aC5aD2742ec86a0B"]],["2021-08-27T07:21:29.000Z",["0xEfD2F730c9D92E53d0B402ACA05FE597F1A47001"]],["2021-08-27T07:50:15.000Z",["0x7D971Ffc482d70831075fCf07c50EDED782aA9Fd"]],["2021-08-27T08:12:40.000Z",["0xFb4a5F07427C4de0051c5FCe5b6f9E8cBf8A544C"]],["2021-09-01T20:52:07.000Z",["0x64f80a3B1ac0d394d652DF0beCfBeA9DB2320782"]],["2021-09-15T02:17:08.000Z",["0x9007A80247D23Cc5C213A6DAcB385c632c4e19F2"]],["2021-09-28T05:07:48.000Z",["0x4cF1471B56D18c7D5a16D48ff5B761BdAEBd2f0b"]],["2021-11-07T08:18:09.000Z",["0x472822517a019e1eEd4533De2d800719057716F1"]],["2022-02-17T18:32:45.000Z",["0x31fe393815822edacBd81C2262467402199EFD0D"]]]
    }
```

Generated with discovered.json: 0xeae97c384e719b131ce027f1cc7c46e8fc9cc8fe

# Diff at Fri, 30 Aug 2024 08:01:24 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@6c1bd1f41fadf5f2cb1c1805b5a2c6138a3ed35a block: 19876012
- current block number: 19876012

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19876012 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x7B3C1f09088Bdc9f136178E170aC668C8Ed095f2) {
    +++ description: None
      receivedPermissions.0.via:
-        []
    }
```

Generated with discovered.json: 0x786c3fbd6ae6e807ef96b96d57c1846961f94701

# Diff at Fri, 23 Aug 2024 09:56:06 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@67597c7d6c810bc726594446890178150240711e block: 19876012
- current block number: 19876012

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19876012 (main branch discovery), not current.

```diff
    contract SynapseBridge (0x2796317b0fF8538F253012862c06787Adfb8cEb6) {
    +++ description: None
      values.$upgradeCount:
+        11
    }
```

Generated with discovered.json: 0x58ed652b1e13572ac463ca791dbcd2520f17f327

# Diff at Wed, 21 Aug 2024 10:06:20 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@2f6dde3357bf5d79196b6e94f79d853a6c4ec72b block: 19876012
- current block number: 19876012

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19876012 (main branch discovery), not current.

```diff
    contract SynapseBridge (0x2796317b0fF8538F253012862c06787Adfb8cEb6) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x7B3C1f09088Bdc9f136178E170aC668C8Ed095f2","via":[]}]
    }
```

```diff
    contract ProxyAdmin (0x7B3C1f09088Bdc9f136178E170aC668C8Ed095f2) {
    +++ description: None
      assignedPermissions:
-        {"upgrade":["0x2796317b0fF8538F253012862c06787Adfb8cEb6"]}
      receivedPermissions:
+        [{"permission":"upgrade","target":"0x2796317b0fF8538F253012862c06787Adfb8cEb6","via":[]}]
    }
```

Generated with discovered.json: 0x0cfebeadc550651c4cae37095801b5f7c8845ad5

# Diff at Fri, 09 Aug 2024 10:12:44 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f0da1d0aab7bc6b3b5e54e7e93480bd98e57035 block: 19876012
- current block number: 19876012

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19876012 (main branch discovery), not current.

```diff
    contract Bridge Multisig (0x67F60b0891EBD842Ebe55E4CCcA1098d7Aac1A55) {
    +++ description: None
      values.$multisigThreshold:
-        "2 of 3 (67%)"
      values.getOwners:
-        ["0xb3DAD3C24A861b84fDF380B212662620627D4e15","0x9Ce9dc8B12E264F00e80F35326040C75201C38f3","0x0d745Ad687F2b1E1941569f09f612F60ad4aD5BC"]
      values.getThreshold:
-        2
      values.$members:
+        ["0xb3DAD3C24A861b84fDF380B212662620627D4e15","0x9Ce9dc8B12E264F00e80F35326040C75201C38f3","0x0d745Ad687F2b1E1941569f09f612F60ad4aD5BC"]
      values.$threshold:
+        2
      values.multisigThreshold:
+        "2 of 3 (67%)"
    }
```

```diff
    contract ProxyAdmin (0x7B3C1f09088Bdc9f136178E170aC668C8Ed095f2) {
    +++ description: None
      assignedPermissions.admin:
-        ["0x2796317b0fF8538F253012862c06787Adfb8cEb6"]
      assignedPermissions.upgrade:
+        ["0x2796317b0fF8538F253012862c06787Adfb8cEb6"]
    }
```

Generated with discovered.json: 0x7947ea018276414e07b692ea1a4426d45a6c5ab2

# Diff at Thu, 28 Mar 2024 11:26:01 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@21187e63b9b90823a55c461c331868a470ce17eb block: 19467277
- current block number: 19532299

## Description

Update discovery to include the multisig threshold.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19467277 (main branch discovery), not current.

```diff
    contract Bridge Multisig (0x67F60b0891EBD842Ebe55E4CCcA1098d7Aac1A55) {
    +++ description: None
      upgradeability.threshold:
+        "2 of 3 (67%)"
    }
```

Generated with discovered.json: 0x318ed27da4a4ee3c26b9a1b4767fea204abb68fe

# Diff at Tue, 19 Mar 2024 07:21:48 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@87a9df6317bf41ef2d063033dfc77d54521b9991 block: 17620009
- current block number: 19467277

## Description

New EOA is given the GOVERNANCE_ROLE in the bridge contract.
Roles: GOVERNANCE_ROLE can set fees, pause and unpause; NODEGROUP_ROLE can call bridging funtions; ADMIN_ROLE can setWethAddress()

## Watched changes

```diff
    contract SynapseBridge (0x2796317b0fF8538F253012862c06787Adfb8cEb6) {
    +++ description: accessControl roles described in meta.json
      values.accessControl.GOVERNANCE_ROLE.members.1:
+        "0xa31C04BFD3545E6d00A80573a0B009F7557D958D"
    }
```

Generated with discovered.json: 0x6432e46d2098f11efc4f4531cca556844f364128
