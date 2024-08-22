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
