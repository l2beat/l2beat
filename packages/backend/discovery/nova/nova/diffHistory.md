Generated with discovered.json: 0xfd114aea5cefc6d78beca95054cdbf1d08805327

# Diff at Tue, 01 Oct 2024 11:14:09 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bd754dc73c66120164006054f8d25c5fae9cd910 block: 75517853
- current block number: 75517853

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 75517853 (main branch discovery), not current.

```diff
    contract L2GatewayRouter (0x21903d3F8176b1a0c17E953Cd896610Be9fFDFa8) {
    +++ description: None
      values.$pastUpgrades:
+        [["2022-06-27T06:57:53.000Z",["0x09854610F48462a7029fF192FA0AfB7F00133F54"]],["2022-08-08T17:57:32.000Z",["0x8f377770289863DF73Fe665B74460579F82321fb"]]]
    }
```

```diff
    contract L2WethGateway (0x7626841cB6113412F9c88D3ADC720C9FAC88D9eD) {
    +++ description: None
      values.$pastUpgrades:
+        [["2022-06-27T07:27:43.000Z",["0x3525f734fcE1a26a6CEffFca43538290DC239771"]],["2022-08-08T17:59:07.000Z",["0x190C993Db842097df8b8d71c910f1802df0724C3"]],["2023-02-10T03:19:59.000Z",["0x190C993Db842097df8b8d71c910f1802df0724C3"]],["2023-02-10T18:07:59.000Z",["0xbe04Ab2728c924D678f9FC833E379688c6eFA317"]]]
    }
```

```diff
    contract L2UpgradeExecutor (0x86a02dD71363c440b21F4c0E5B2Ad01Ffe1A7482) {
    +++ description: None
      values.$pastUpgrades:
+        [["2023-03-16T12:08:03.000Z",["0x3096EAEdcb3A3B665552660F4d921E565D0073cB"]]]
    }
```

```diff
    contract L2ARBGateway (0xbf544970E6BD77b21C6492C281AB60d0770451F4) {
    +++ description: None
      values.$pastUpgrades:
+        [["2022-06-27T06:58:04.000Z",["0xb1d943d67b793D61F08b5F536AC591a057306fe5"]],["2022-08-08T17:58:06.000Z",["0x6e04b9dd87CF2cD3b7D81C50D2DF72d24BC0Cc4C"]],["2022-12-06T01:54:51.000Z",["0x554e12DBAa0fBeB8A35583a6Fd9D04BaA4ff597f"]]]
    }
```

```diff
    contract L2ERC20Gateway (0xcF9bAb7e53DDe48A6DC4f286CB14e05298799257) {
    +++ description: None
      values.$pastUpgrades:
+        [["2022-06-27T06:57:59.000Z",["0xEa2562667c98Bfe329995616454BeA9ea3290D1C"]],["2022-08-08T17:57:48.000Z",["0x466155FD6d8BbF1c0d5ca32818814cB28b6884d8"]]]
    }
```

```diff
    contract L2ArbitrumToken (0xf823C3cD3CeBE0a1fA952ba88Dc9EEf8e0Bf46AD) {
    +++ description: None
      values.$pastUpgrades:
+        [["2023-03-16T12:08:15.000Z",["0x099bC495EA4Fd828FEe7C636F0Ab84d0f501B96d"]]]
    }
```

Generated with discovered.json: 0x725318d87ea1063fd83db489d27cea82908e4362

# Diff at Mon, 02 Sep 2024 08:41:14 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@8fcb30f6c613b5454aa9ecdec05a118442e9dc7b block: 75424833
- current block number: 75517853

## Description

Config related.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 75424833 (main branch discovery), not current.

```diff
    contract L2GatewaysProxyAdmin (0xada790b026097BfB36a5ed696859b97a96CEd92C) {
    +++ description: None
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

```diff
    contract L2ProxyAdmin (0xf58eA15B20983116c21b05c876cc8e6CDAe5C2b9) {
    +++ description: None
      receivedPermissions.1.via:
-        []
      receivedPermissions.0.via:
-        []
    }
```

Generated with discovered.json: 0xfd77969411227d59e52c9c8902751ee479e47aad

# Diff at Wed, 28 Aug 2024 15:10:30 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@0fa673a678e6e769a295956285789968836b97a6 block: 74799516
- current block number: 75424833

## Description

As discussed [in the AIP](https://forum.arbitrum.foundation/t/aip-nova-fee-router-proposal-arbos-30/23310), this upgrade routes the L2Base and L2Surplus fees via L1 to the Arbitrum treasury on Arbitrum One.

Added discovery for the fee recipients.

## Watched changes

```diff
    contract L2SurplusFee (0x509386DbF5C0BE6fd68Df97A05fdB375136c32De) {
    +++ description: None
      values.currentRecipientGroup:
-        "0xa4d6665ee2121503a4513275116c9cda5eaac3a8b759ff4c41fb4cc089f0b338"
+        "0xf282fbf81236cb85617464bf2345689bad849c6122d8725eeef1a4cf78e8d9a3"
+++ description: Lists recipients and weights using events, while the latest represents the current state.
      values.recipientsData.1:
+        {"recipients":["0x36D0170D92F66e8949eB276C3AC4FEA64f83704d"],"weights":[10000]}
    }
```

```diff
    contract L2BaseFee (0x9fCB6F75D99029f28F6F4a1d277bae49c5CAC79f) {
    +++ description: None
      values.currentRecipientGroup:
-        "0x2c40b8c2309d10d43a712b6df564ebd140153dcfe8428552d24aa294a8b34107"
+        "0xc21cdeb0278022eeb6305048d7d033ce165b518e371bc91c58b76175e4f7fc2b"
+++ description: Lists recipients and weights using events, while the latest represents the current state.
      values.recipientsData.1:
+        {"recipients":["0x36D0170D92F66e8949eB276C3AC4FEA64f83704d","0xD0749b3e537Ed52DE4e6a3Ae1eB6fc26059d0895","0x41C327d5fc9e29680CcD45e5E52446E0DB3DAdFd","0x02C2599aa929e2509741b44F3a13029745aB1AB2","0xA221f29236996BDEfA5C585acdD407Ec84D78447","0x0fB1f1a31429F1A90a19Ab5486a6DFb384179641","0xb814441ed86e98e8B83d31eEC095e4a5A36Fc3c2"],"weights":[8000,375,373,373,373,373,133]}
    }
```

```diff
+   Status: CREATED
    contract ArbChildToParentRewardRouter (0x36D0170D92F66e8949eB276C3AC4FEA64f83704d)
    +++ description: None
```

## Source code changes

```diff
.../nova/.flat/ArbChildToParentRewardRouter.sol    | 476 +++++++++++++++++++++
 1 file changed, 476 insertions(+)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 74799516 (main branch discovery), not current.

```diff
    contract L2SurplusFee (0x509386DbF5C0BE6fd68Df97A05fdB375136c32De) {
    +++ description: None
+++ description: Lists recipients and weights using events, while the latest represents the current state.
      values.recipientsData:
+        [{"recipients":["0xf7951D92B0C345144506576eC13Ecf5103aC905a"],"weights":[10000]}]
      fieldMeta:
+        {"recipientsData":{"description":"Lists recipients and weights using events, while the latest represents the current state."}}
    }
```

```diff
    contract L2BaseFee (0x9fCB6F75D99029f28F6F4a1d277bae49c5CAC79f) {
    +++ description: None
+++ description: Lists recipients and weights using events, while the latest represents the current state.
      values.recipientsData:
+        [{"recipients":["0xf7951D92B0C345144506576eC13Ecf5103aC905a","0xD0749b3e537Ed52DE4e6a3Ae1eB6fc26059d0895","0x41C327d5fc9e29680CcD45e5E52446E0DB3DAdFd","0x02C2599aa929e2509741b44F3a13029745aB1AB2","0xA221f29236996BDEfA5C585acdD407Ec84D78447","0x0fB1f1a31429F1A90a19Ab5486a6DFb384179641","0xb814441ed86e98e8B83d31eEC095e4a5A36Fc3c2"],"weights":[8000,375,373,373,373,373,133]}]
      fieldMeta:
+        {"recipientsData":{"description":"Lists recipients and weights using events, while the latest represents the current state."}}
    }
```

```diff
+   Status: CREATED
    contract GnosisSafeL2 (0x41C327d5fc9e29680CcD45e5E52446E0DB3DAdFd)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafeL2 (0xD0749b3e537Ed52DE4e6a3Ae1eB6fc26059d0895)
    +++ description: None
```

Generated with discovered.json: 0x026698efaae49a4d42eda5d1a5a694297eed99b6

# Diff at Fri, 23 Aug 2024 09:58:46 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@67597c7d6c810bc726594446890178150240711e block: 74799516
- current block number: 74799516

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 74799516 (main branch discovery), not current.

```diff
    contract L2GatewayRouter (0x21903d3F8176b1a0c17E953Cd896610Be9fFDFa8) {
    +++ description: None
      values.$upgradeCount:
+        2
    }
```

```diff
    contract L2WethGateway (0x7626841cB6113412F9c88D3ADC720C9FAC88D9eD) {
    +++ description: None
      values.$upgradeCount:
+        4
    }
```

```diff
    contract L2UpgradeExecutor (0x86a02dD71363c440b21F4c0E5B2Ad01Ffe1A7482) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract L2ARBGateway (0xbf544970E6BD77b21C6492C281AB60d0770451F4) {
    +++ description: None
      values.$upgradeCount:
+        3
    }
```

```diff
    contract L2ERC20Gateway (0xcF9bAb7e53DDe48A6DC4f286CB14e05298799257) {
    +++ description: None
      values.$upgradeCount:
+        2
    }
```

```diff
    contract L2ArbitrumToken (0xf823C3cD3CeBE0a1fA952ba88Dc9EEf8e0Bf46AD) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

Generated with discovered.json: 0x1e865b081ae568f6f660461d15aa8f7e8934245a

# Diff at Wed, 21 Aug 2024 10:08:42 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@2f6dde3357bf5d79196b6e94f79d853a6c4ec72b block: 74799516
- current block number: 74799516

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 74799516 (main branch discovery), not current.

```diff
    contract L2GatewayRouter (0x21903d3F8176b1a0c17E953Cd896610Be9fFDFa8) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xada790b026097BfB36a5ed696859b97a96CEd92C","via":[]}]
    }
```

```diff
    contract L2WethGateway (0x7626841cB6113412F9c88D3ADC720C9FAC88D9eD) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xada790b026097BfB36a5ed696859b97a96CEd92C","via":[]}]
    }
```

```diff
    contract L2UpgradeExecutor (0x86a02dD71363c440b21F4c0E5B2Ad01Ffe1A7482) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xf58eA15B20983116c21b05c876cc8e6CDAe5C2b9","via":[]}]
    }
```

```diff
    contract L2GatewaysProxyAdmin (0xada790b026097BfB36a5ed696859b97a96CEd92C) {
    +++ description: None
      assignedPermissions:
-        {"upgrade":["0x21903d3F8176b1a0c17E953Cd896610Be9fFDFa8","0x7626841cB6113412F9c88D3ADC720C9FAC88D9eD","0xbf544970E6BD77b21C6492C281AB60d0770451F4","0xcF9bAb7e53DDe48A6DC4f286CB14e05298799257"]}
      receivedPermissions:
+        [{"permission":"upgrade","target":"0x21903d3F8176b1a0c17E953Cd896610Be9fFDFa8","via":[]},{"permission":"upgrade","target":"0x7626841cB6113412F9c88D3ADC720C9FAC88D9eD","via":[]},{"permission":"upgrade","target":"0xbf544970E6BD77b21C6492C281AB60d0770451F4","via":[]},{"permission":"upgrade","target":"0xcF9bAb7e53DDe48A6DC4f286CB14e05298799257","via":[]}]
    }
```

```diff
    contract L2ARBGateway (0xbf544970E6BD77b21C6492C281AB60d0770451F4) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xada790b026097BfB36a5ed696859b97a96CEd92C","via":[]}]
    }
```

```diff
    contract L2ERC20Gateway (0xcF9bAb7e53DDe48A6DC4f286CB14e05298799257) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xada790b026097BfB36a5ed696859b97a96CEd92C","via":[]}]
    }
```

```diff
    contract L2ProxyAdmin (0xf58eA15B20983116c21b05c876cc8e6CDAe5C2b9) {
    +++ description: None
      assignedPermissions:
-        {"upgrade":["0x86a02dD71363c440b21F4c0E5B2Ad01Ffe1A7482","0xf823C3cD3CeBE0a1fA952ba88Dc9EEf8e0Bf46AD"]}
      receivedPermissions:
+        [{"permission":"upgrade","target":"0x86a02dD71363c440b21F4c0E5B2Ad01Ffe1A7482","via":[]},{"permission":"upgrade","target":"0xf823C3cD3CeBE0a1fA952ba88Dc9EEf8e0Bf46AD","via":[]}]
    }
```

```diff
    contract L2ArbitrumToken (0xf823C3cD3CeBE0a1fA952ba88Dc9EEf8e0Bf46AD) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xf58eA15B20983116c21b05c876cc8e6CDAe5C2b9","via":[]}]
    }
```

Generated with discovered.json: 0x746d02ca9d79f0cecb2b59531037a0e814f67c08

# Diff at Fri, 09 Aug 2024 12:04:50 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bf40aa32f030fd312056ca0ef198c8550467d1d7 block: 74799516
- current block number: 74799516

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 74799516 (main branch discovery), not current.

```diff
    contract L2GatewaysProxyAdmin (0xada790b026097BfB36a5ed696859b97a96CEd92C) {
    +++ description: None
      assignedPermissions.upgrade.1:
-        "0x21903d3F8176b1a0c17E953Cd896610Be9fFDFa8"
+        "0x7626841cB6113412F9c88D3ADC720C9FAC88D9eD"
      assignedPermissions.upgrade.0:
-        "0x7626841cB6113412F9c88D3ADC720C9FAC88D9eD"
+        "0x21903d3F8176b1a0c17E953Cd896610Be9fFDFa8"
    }
```

```diff
    contract L2ProxyAdmin (0xf58eA15B20983116c21b05c876cc8e6CDAe5C2b9) {
    +++ description: None
      assignedPermissions.upgrade.1:
-        "0x86a02dD71363c440b21F4c0E5B2Ad01Ffe1A7482"
+        "0xf823C3cD3CeBE0a1fA952ba88Dc9EEf8e0Bf46AD"
      assignedPermissions.upgrade.0:
-        "0xf823C3cD3CeBE0a1fA952ba88Dc9EEf8e0Bf46AD"
+        "0x86a02dD71363c440b21F4c0E5B2Ad01Ffe1A7482"
    }
```

Generated with discovered.json: 0xa253063ed3e83fcb3ea74d643fb95c0abf6d3ea0

# Diff at Fri, 09 Aug 2024 10:14:49 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f0da1d0aab7bc6b3b5e54e7e93480bd98e57035 block: 74799516
- current block number: 74799516

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 74799516 (main branch discovery), not current.

```diff
    contract L2GatewaysProxyAdmin (0xada790b026097BfB36a5ed696859b97a96CEd92C) {
    +++ description: None
      assignedPermissions.admin:
-        ["0x21903d3F8176b1a0c17E953Cd896610Be9fFDFa8","0x7626841cB6113412F9c88D3ADC720C9FAC88D9eD","0xbf544970E6BD77b21C6492C281AB60d0770451F4","0xcF9bAb7e53DDe48A6DC4f286CB14e05298799257"]
      assignedPermissions.upgrade:
+        ["0x7626841cB6113412F9c88D3ADC720C9FAC88D9eD","0x21903d3F8176b1a0c17E953Cd896610Be9fFDFa8","0xbf544970E6BD77b21C6492C281AB60d0770451F4","0xcF9bAb7e53DDe48A6DC4f286CB14e05298799257"]
    }
```

```diff
    contract L2SecurityCouncilEmergency (0xc232ee726E3C51B86778BB4dBe61C52cC07A60F3) {
    +++ description: None
      values.$multisigThreshold:
-        "9 of 12 (75%)"
      values.getOwners:
-        ["0x70C006fC86A392c16D7E085cefc0Ad1FF7de6C75","0xA821c8c245d1F3A257e3B0DEC99268cA05144422","0x5a09A94eE8198D3c474d723337aa58023810022C","0x5DD2205C3aac13E592F0a3D85188c948D1781df1","0x8F10e3413586c4a8DCfcE19D009872b19e9cd8E3","0xb71ca4FFbB7b58d75Ba29891ab45e9Dc12B444Ed","0x3E286452b1C66abB08Eb5494c3894F40aB5a59AF","0xb07dc9103328A51128bC6Cc1049d1137035f5E28","0x3Bd8e2AC65ad6f0F094BA6766cBd9484AB49eF23","0xf8e1492255d9428c2Fc20A98A1DeB1215C8ffEfd","0x0275b3D54a5dDbf8205A75984796eFE8b7357Bae","0x475816ca2a31D601B4e336f5c2418A67978aBf09"]
      values.getThreshold:
-        9
      values.$members:
+        ["0x70C006fC86A392c16D7E085cefc0Ad1FF7de6C75","0xA821c8c245d1F3A257e3B0DEC99268cA05144422","0x5a09A94eE8198D3c474d723337aa58023810022C","0x5DD2205C3aac13E592F0a3D85188c948D1781df1","0x8F10e3413586c4a8DCfcE19D009872b19e9cd8E3","0xb71ca4FFbB7b58d75Ba29891ab45e9Dc12B444Ed","0x3E286452b1C66abB08Eb5494c3894F40aB5a59AF","0xb07dc9103328A51128bC6Cc1049d1137035f5E28","0x3Bd8e2AC65ad6f0F094BA6766cBd9484AB49eF23","0xf8e1492255d9428c2Fc20A98A1DeB1215C8ffEfd","0x0275b3D54a5dDbf8205A75984796eFE8b7357Bae","0x475816ca2a31D601B4e336f5c2418A67978aBf09"]
      values.$threshold:
+        9
      values.multisigThreshold:
+        "9 of 12 (75%)"
    }
```

```diff
    contract L2ProxyAdmin (0xf58eA15B20983116c21b05c876cc8e6CDAe5C2b9) {
    +++ description: None
      assignedPermissions.admin:
-        ["0x86a02dD71363c440b21F4c0E5B2Ad01Ffe1A7482","0xf823C3cD3CeBE0a1fA952ba88Dc9EEf8e0Bf46AD"]
      assignedPermissions.upgrade:
+        ["0xf823C3cD3CeBE0a1fA952ba88Dc9EEf8e0Bf46AD","0x86a02dD71363c440b21F4c0E5B2Ad01Ffe1A7482"]
    }
```

Generated with discovered.json: 0x6ff5a0a43ed688626e4aaceadf8b5a8ce79c14d0

# Diff at Fri, 02 Aug 2024 11:29:54 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- current block number: 74799516

## Description

Initial discovery: Normal Nitro L2 with external governance (aliased L1 Timelock on ethereum) and EmergencySecurityCouncil on Nova L2.

## Initial discovery

```diff
+   Status: CREATED
    contract L2GatewayRouter (0x21903d3F8176b1a0c17E953Cd896610Be9fFDFa8)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L2SurplusFee (0x509386DbF5C0BE6fd68Df97A05fdB375136c32De)
    +++ description: None
```

```diff
+   Status: CREATED
    contract StandardArbERC20 (0x53923A0d1f4805463584c91b2E55d6c600A94E91)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L2WethGateway (0x7626841cB6113412F9c88D3ADC720C9FAC88D9eD)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L2UpgradeExecutor (0x86a02dD71363c440b21F4c0E5B2Ad01Ffe1A7482)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L2BaseFee (0x9fCB6F75D99029f28F6F4a1d277bae49c5CAC79f)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L2GatewaysProxyAdmin (0xada790b026097BfB36a5ed696859b97a96CEd92C)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L2ARBGateway (0xbf544970E6BD77b21C6492C281AB60d0770451F4)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L2SecurityCouncilEmergency (0xc232ee726E3C51B86778BB4dBe61C52cC07A60F3)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L2ERC20Gateway (0xcF9bAb7e53DDe48A6DC4f286CB14e05298799257)
    +++ description: None
```

```diff
+   Status: CREATED
    contract UpgradeableBeacon (0xd31Ed16a8CeCe0A5070AC26024674eB680E3e639)
    +++ description: None
```

```diff
+   Status: CREATED
    contract BeaconProxyFactory (0xD9D66e55227c7558f0dB52adD059057Eb9bd90a3)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L2ProxyAdmin (0xf58eA15B20983116c21b05c876cc8e6CDAe5C2b9)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L2ArbitrumToken (0xf823C3cD3CeBE0a1fA952ba88Dc9EEf8e0Bf46AD)
    +++ description: None
```
