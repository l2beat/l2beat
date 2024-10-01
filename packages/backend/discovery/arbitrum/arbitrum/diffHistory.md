Generated with discovered.json: 0x05d95882cf858d5d7268d1c3f342a3c9caa5f530

# Diff at Mon, 23 Sep 2024 16:30:22 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@d3382cfb14234950671011f2a61630973cab3e07 block: 247630663
- current block number: 256572673

## Description

Minor totalSupply decrease. (burn tx: https://app.blocksec.com/explorer/tx/arbitrum/0xd2d26f3463e636c2aff495aaebb86ca44d6f27a38bafbf5e105eb22c4a940b18?line=43)

## Watched changes

```diff
    contract L2ArbitrumToken (0x912CE59144191C1204E64559FE8253a0e49E6548) {
    +++ description: None
      values.totalSupply:
-        "9999999998999999999999999996"
+        "9999998977630224104158908096"
    }
```

Generated with discovered.json: 0xad35b43ba5ab6554cb7c6f83235c64a99450a340

# Diff at Fri, 30 Aug 2024 08:06:04 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@6c1bd1f41fadf5f2cb1c1805b5a2c6138a3ed35a block: 247630663
- current block number: 247630663

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 247630663 (main branch discovery), not current.

```diff
    contract L2GatewaysProxyAdmin (0xd570aCE65C43af47101fC6250FD6fC63D1c22a86) {
    +++ description: None
      receivedPermissions.2.via:
-        []
      receivedPermissions.1.via:
-        []
      receivedPermissions.0.via:
-        []
    }
```

```diff
    contract L2ProxyAdmin (0xdb216562328215E010F819B5aBe947bad4ca961e) {
    +++ description: None
      receivedPermissions.7.via:
-        []
      receivedPermissions.6.via:
-        []
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

Generated with discovered.json: 0xe0961daf072f569383382d19ac00c9b63b917e29

# Diff at Wed, 28 Aug 2024 15:10:56 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@0fa673a678e6e769a295956285789968836b97a6 block: 237006565
- current block number: 247630663

## Description

Added fee recipient discovery.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 237006565 (main branch discovery), not current.

```diff
    contract L2SurplusFee (0x32e7AF5A8151934F3787d0cD59EB6EDd0a736b1d) {
    +++ description: None
+++ description: Lists recipients and weights using events, while the latest represents the current state.
      values.recipientsData:
+        [{"recipients":["0xbFc1FECa8B09A5c5D3EFfE7429eBE24b9c09EF58"],"weights":[10000]}]
      fieldMeta:
+        {"recipientsData":{"description":"Lists recipients and weights using events, while the latest represents the current state."}}
    }
```

```diff
    contract L2BaseFee (0xbF5041Fc07E1c866D15c749156657B8eEd0fb649) {
    +++ description: None
+++ description: Lists recipients and weights using events, while the latest represents the current state.
      values.recipientsData:
+        [{"recipients":["0xbFc1FECa8B09A5c5D3EFfE7429eBE24b9c09EF58"],"weights":[10000]}]
      fieldMeta:
+        {"recipientsData":{"description":"Lists recipients and weights using events, while the latest represents the current state."}}
    }
```

Generated with discovered.json: 0x2593dc87344416c0224f9e4f83098789f8a60514

# Diff at Fri, 23 Aug 2024 09:56:56 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@67597c7d6c810bc726594446890178150240711e block: 237006565
- current block number: 237006565

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 237006565 (main branch discovery), not current.

```diff
    contract L2ERC20Gateway (0x09e9222E96E7B4AE2a407B98d48e330053351EEe) {
    +++ description: None
      values.$upgradeCount:
+        4
    }
```

```diff
    contract L2Timelock (0x34d45e99f7D8c45ed05B5cA72D54bbD1fb3F98f0) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract L2GatewayRouter (0x5288c571Fd7aD117beA99bF60FE0846C4E84F933) {
    +++ description: None
      values.$upgradeCount:
+        3
    }
```

```diff
    contract L2WethGateway (0x6c411aD3E74De3E7Bd422b94A27770f5B86C623B) {
    +++ description: None
      values.$upgradeCount:
+        5
    }
```

```diff
    contract TreasuryGovernor (0x789fC99093B09aD01C34DC7251D0C89ce743e5a4) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract L2ArbitrumToken (0x912CE59144191C1204E64559FE8253a0e49E6548) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract TreasuryTimelock (0xbFc1FECa8B09A5c5D3EFfE7429eBE24b9c09EF58) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract L2ARBGateway (0xCaD7828a19b363A2B44717AFB1786B5196974D8E) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract L2UpgradeExecutor (0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract SecurityCouncilManager (0xD509E5f5aEe2A205F554f36E8a7d56094494eDFC) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract CoreGovernor (0xf07DeD9dC292157749B6Fd268E37DF6EA38395B9) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

Generated with discovered.json: 0x7694a0d33ccd1f671fb640ab79a9862c94f81c34

# Diff at Wed, 21 Aug 2024 10:07:22 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@2f6dde3357bf5d79196b6e94f79d853a6c4ec72b block: 237006565
- current block number: 237006565

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 237006565 (main branch discovery), not current.

```diff
    contract L2ERC20Gateway (0x09e9222E96E7B4AE2a407B98d48e330053351EEe) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xd570aCE65C43af47101fC6250FD6fC63D1c22a86","via":[]}]
    }
```

```diff
    contract L2Timelock (0x34d45e99f7D8c45ed05B5cA72D54bbD1fb3F98f0) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xdb216562328215E010F819B5aBe947bad4ca961e","via":[]}]
    }
```

```diff
    contract L2GatewayRouter (0x5288c571Fd7aD117beA99bF60FE0846C4E84F933) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xd570aCE65C43af47101fC6250FD6fC63D1c22a86","via":[]}]
    }
```

```diff
    contract L2WethGateway (0x6c411aD3E74De3E7Bd422b94A27770f5B86C623B) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xd570aCE65C43af47101fC6250FD6fC63D1c22a86","via":[]}]
    }
```

```diff
    contract TreasuryGovernor (0x789fC99093B09aD01C34DC7251D0C89ce743e5a4) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xdb216562328215E010F819B5aBe947bad4ca961e","via":[]}]
    }
```

```diff
    contract L2ArbitrumToken (0x912CE59144191C1204E64559FE8253a0e49E6548) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xdb216562328215E010F819B5aBe947bad4ca961e","via":[]}]
    }
```

```diff
    contract TreasuryTimelock (0xbFc1FECa8B09A5c5D3EFfE7429eBE24b9c09EF58) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xdb216562328215E010F819B5aBe947bad4ca961e","via":[]}]
    }
```

```diff
    contract L2ARBGateway (0xCaD7828a19b363A2B44717AFB1786B5196974D8E) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xdb216562328215E010F819B5aBe947bad4ca961e","via":[]}]
    }
```

```diff
    contract L2UpgradeExecutor (0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xdb216562328215E010F819B5aBe947bad4ca961e","via":[]}]
    }
```

```diff
    contract SecurityCouncilManager (0xD509E5f5aEe2A205F554f36E8a7d56094494eDFC) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xdb216562328215E010F819B5aBe947bad4ca961e","via":[]}]
    }
```

```diff
    contract L2GatewaysProxyAdmin (0xd570aCE65C43af47101fC6250FD6fC63D1c22a86) {
    +++ description: None
      assignedPermissions:
-        {"upgrade":["0x09e9222E96E7B4AE2a407B98d48e330053351EEe","0x5288c571Fd7aD117beA99bF60FE0846C4E84F933","0x6c411aD3E74De3E7Bd422b94A27770f5B86C623B"]}
      receivedPermissions:
+        [{"permission":"upgrade","target":"0x09e9222E96E7B4AE2a407B98d48e330053351EEe","via":[]},{"permission":"upgrade","target":"0x5288c571Fd7aD117beA99bF60FE0846C4E84F933","via":[]},{"permission":"upgrade","target":"0x6c411aD3E74De3E7Bd422b94A27770f5B86C623B","via":[]}]
    }
```

```diff
    contract L2ProxyAdmin (0xdb216562328215E010F819B5aBe947bad4ca961e) {
    +++ description: None
      assignedPermissions:
-        {"upgrade":["0x34d45e99f7D8c45ed05B5cA72D54bbD1fb3F98f0","0x789fC99093B09aD01C34DC7251D0C89ce743e5a4","0x912CE59144191C1204E64559FE8253a0e49E6548","0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827","0xCaD7828a19b363A2B44717AFB1786B5196974D8E","0xD509E5f5aEe2A205F554f36E8a7d56094494eDFC","0xbFc1FECa8B09A5c5D3EFfE7429eBE24b9c09EF58","0xf07DeD9dC292157749B6Fd268E37DF6EA38395B9"]}
      receivedPermissions:
+        [{"permission":"upgrade","target":"0x34d45e99f7D8c45ed05B5cA72D54bbD1fb3F98f0","via":[]},{"permission":"upgrade","target":"0x789fC99093B09aD01C34DC7251D0C89ce743e5a4","via":[]},{"permission":"upgrade","target":"0x912CE59144191C1204E64559FE8253a0e49E6548","via":[]},{"permission":"upgrade","target":"0xbFc1FECa8B09A5c5D3EFfE7429eBE24b9c09EF58","via":[]},{"permission":"upgrade","target":"0xCaD7828a19b363A2B44717AFB1786B5196974D8E","via":[]},{"permission":"upgrade","target":"0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827","via":[]},{"permission":"upgrade","target":"0xD509E5f5aEe2A205F554f36E8a7d56094494eDFC","via":[]},{"permission":"upgrade","target":"0xf07DeD9dC292157749B6Fd268E37DF6EA38395B9","via":[]}]
    }
```

```diff
    contract CoreGovernor (0xf07DeD9dC292157749B6Fd268E37DF6EA38395B9) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xdb216562328215E010F819B5aBe947bad4ca961e","via":[]}]
    }
```

Generated with discovered.json: 0xb7357e80451bbfab38288cf126db77fec786c401

# Diff at Fri, 09 Aug 2024 12:03:28 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bf40aa32f030fd312056ca0ef198c8550467d1d7 block: 237006565
- current block number: 237006565

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 237006565 (main branch discovery), not current.

```diff
    contract L2GatewaysProxyAdmin (0xd570aCE65C43af47101fC6250FD6fC63D1c22a86) {
    +++ description: None
      assignedPermissions.upgrade.2:
-        "0x09e9222E96E7B4AE2a407B98d48e330053351EEe"
+        "0x6c411aD3E74De3E7Bd422b94A27770f5B86C623B"
      assignedPermissions.upgrade.1:
-        "0x6c411aD3E74De3E7Bd422b94A27770f5B86C623B"
+        "0x5288c571Fd7aD117beA99bF60FE0846C4E84F933"
      assignedPermissions.upgrade.0:
-        "0x5288c571Fd7aD117beA99bF60FE0846C4E84F933"
+        "0x09e9222E96E7B4AE2a407B98d48e330053351EEe"
    }
```

```diff
    contract L2ProxyAdmin (0xdb216562328215E010F819B5aBe947bad4ca961e) {
    +++ description: None
      assignedPermissions.upgrade.7:
-        "0xD509E5f5aEe2A205F554f36E8a7d56094494eDFC"
+        "0xf07DeD9dC292157749B6Fd268E37DF6EA38395B9"
      assignedPermissions.upgrade.6:
-        "0x34d45e99f7D8c45ed05B5cA72D54bbD1fb3F98f0"
+        "0xbFc1FECa8B09A5c5D3EFfE7429eBE24b9c09EF58"
      assignedPermissions.upgrade.5:
-        "0xbFc1FECa8B09A5c5D3EFfE7429eBE24b9c09EF58"
+        "0xD509E5f5aEe2A205F554f36E8a7d56094494eDFC"
      assignedPermissions.upgrade.4:
-        "0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827"
+        "0xCaD7828a19b363A2B44717AFB1786B5196974D8E"
      assignedPermissions.upgrade.3:
-        "0x912CE59144191C1204E64559FE8253a0e49E6548"
+        "0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827"
      assignedPermissions.upgrade.2:
-        "0x789fC99093B09aD01C34DC7251D0C89ce743e5a4"
+        "0x912CE59144191C1204E64559FE8253a0e49E6548"
      assignedPermissions.upgrade.1:
-        "0xf07DeD9dC292157749B6Fd268E37DF6EA38395B9"
+        "0x789fC99093B09aD01C34DC7251D0C89ce743e5a4"
      assignedPermissions.upgrade.0:
-        "0xCaD7828a19b363A2B44717AFB1786B5196974D8E"
+        "0x34d45e99f7D8c45ed05B5cA72D54bbD1fb3F98f0"
    }
```

Generated with discovered.json: 0x8ecbf1b2d9964197c9a5576742acfe0ad01f8b5e

# Diff at Fri, 09 Aug 2024 10:13:28 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f0da1d0aab7bc6b3b5e54e7e93480bd98e57035 block: 237006565
- current block number: 237006565

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 237006565 (main branch discovery), not current.

```diff
    contract L2SecurityCouncilEmergency (0x423552c0F05baCCac5Bfa91C6dCF1dc53a0A1641) {
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
    contract L2SecurityCouncilPropose (0xADd68bCb0f66878aB9D37a447C7b9067C5dfa941) {
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
    contract L2GatewaysProxyAdmin (0xd570aCE65C43af47101fC6250FD6fC63D1c22a86) {
    +++ description: None
      assignedPermissions.admin:
-        ["0x09e9222E96E7B4AE2a407B98d48e330053351EEe","0x5288c571Fd7aD117beA99bF60FE0846C4E84F933","0x6c411aD3E74De3E7Bd422b94A27770f5B86C623B"]
      assignedPermissions.upgrade:
+        ["0x5288c571Fd7aD117beA99bF60FE0846C4E84F933","0x6c411aD3E74De3E7Bd422b94A27770f5B86C623B","0x09e9222E96E7B4AE2a407B98d48e330053351EEe"]
    }
```

```diff
    contract L2ProxyAdmin (0xdb216562328215E010F819B5aBe947bad4ca961e) {
    +++ description: None
      assignedPermissions.admin:
-        ["0x34d45e99f7D8c45ed05B5cA72D54bbD1fb3F98f0","0x789fC99093B09aD01C34DC7251D0C89ce743e5a4","0x912CE59144191C1204E64559FE8253a0e49E6548","0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827","0xCaD7828a19b363A2B44717AFB1786B5196974D8E","0xD509E5f5aEe2A205F554f36E8a7d56094494eDFC","0xbFc1FECa8B09A5c5D3EFfE7429eBE24b9c09EF58","0xf07DeD9dC292157749B6Fd268E37DF6EA38395B9"]
      assignedPermissions.upgrade:
+        ["0xCaD7828a19b363A2B44717AFB1786B5196974D8E","0xf07DeD9dC292157749B6Fd268E37DF6EA38395B9","0x789fC99093B09aD01C34DC7251D0C89ce743e5a4","0x912CE59144191C1204E64559FE8253a0e49E6548","0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827","0xbFc1FECa8B09A5c5D3EFfE7429eBE24b9c09EF58","0x34d45e99f7D8c45ed05B5cA72D54bbD1fb3F98f0","0xD509E5f5aEe2A205F554f36E8a7d56094494eDFC"]
    }
```

Generated with discovered.json: 0x1da008086226212b4461f46ca255667ebc909b04

# Diff at Tue, 30 Jul 2024 11:17:03 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@b2b6471ff62871f4956541f42ec025c356c08f7e block: 237006565
- current block number: 237006565

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 237006565 (main branch discovery), not current.

```diff
    contract SecurityCouncilManager (0xD509E5f5aEe2A205F554f36E8a7d56094494eDFC) {
    +++ description: None
      fieldMeta:
+        {"getBothCohorts":{"severity":"MEDIUM","description":"All 12 addresses of the 2 cohorts of the SecurityCouncil (2x6)"}}
    }
```

Generated with discovered.json: 0xc72cf5f2281dbc063920bfc56809ba4a2c51b665

# Diff at Sun, 28 Jul 2024 17:31:45 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@04dc4c7d175d5f4d1388774094bdb962fe7b7423 block: 235552250
- current block number: 237006565

## Description

1) SecurityCouncil signer rotation completed
2) Changed timelock name in conf to be consistent with the new diagram

## Watched changes

```diff
    contract L2SecurityCouncilEmergency (0x423552c0F05baCCac5Bfa91C6dCF1dc53a0A1641) {
    +++ description: None
      values.getOwners.3:
-        "0xe40D80Bd58CEE55DCC2598724d7F1e03E206581D"
+        "0x5DD2205C3aac13E592F0a3D85188c948D1781df1"
      values.getOwners.2:
-        "0xB3b60932E598fe946169EC209A197184Bad760B7"
+        "0x5a09A94eE8198D3c474d723337aa58023810022C"
      values.getOwners.1:
-        "0xee7Fb91D5b776C326a728dc70e917F82d6809E3C"
+        "0xA821c8c245d1F3A257e3B0DEC99268cA05144422"
      values.getOwners.0:
-        "0xa0683d725420e2F75415806352Cd9c3fE10Fa960"
+        "0x70C006fC86A392c16D7E085cefc0Ad1FF7de6C75"
    }
```

```diff
    contract L2SecurityCouncilPropose (0xADd68bCb0f66878aB9D37a447C7b9067C5dfa941) {
    +++ description: None
      values.getOwners.3:
-        "0xe40D80Bd58CEE55DCC2598724d7F1e03E206581D"
+        "0x5DD2205C3aac13E592F0a3D85188c948D1781df1"
      values.getOwners.2:
-        "0xB3b60932E598fe946169EC209A197184Bad760B7"
+        "0x5a09A94eE8198D3c474d723337aa58023810022C"
      values.getOwners.1:
-        "0xee7Fb91D5b776C326a728dc70e917F82d6809E3C"
+        "0xA821c8c245d1F3A257e3B0DEC99268cA05144422"
      values.getOwners.0:
-        "0xa0683d725420e2F75415806352Cd9c3fE10Fa960"
+        "0x70C006fC86A392c16D7E085cefc0Ad1FF7de6C75"
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 235552250 (main branch discovery), not current.

```diff
    contract L2CoreTimelock (0x34d45e99f7D8c45ed05B5cA72D54bbD1fb3F98f0) {
    +++ description: None
      name:
-        "L2CoreTimelock"
+        "L2Timelock"
    }
```

```diff
    contract L2TreasuryTimelock (0xbFc1FECa8B09A5c5D3EFfE7429eBE24b9c09EF58) {
    +++ description: None
      name:
-        "L2TreasuryTimelock"
+        "TreasuryTimelock"
    }
```

Generated with discovered.json: 0xefe337070da8927bb9e6b78750ba44724e7ebcf8

# Diff at Wed, 24 Jul 2024 12:09:21 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@f8d5c0ccc8d74a077f85a8dca4038e175812c389 block: 233533906
- current block number: 235552250

## Description

Add L2 contracts to discovery config.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 233533906 (main branch discovery), not current.

```diff
-   Status: DELETED
    contract L2CustomGateway (0x096760F208390250649E3e8763348E783AEF5562)
    +++ description: None
```

```diff
    contract SC9 (0x423552c0F05baCCac5Bfa91C6dCF1dc53a0A1641) {
    +++ description: None
      name:
-        "SC9"
+        "L2SecurityCouncilEmergency"
    }
```

```diff
    contract SC7 (0xADd68bCb0f66878aB9D37a447C7b9067C5dfa941) {
    +++ description: None
      name:
-        "SC7"
+        "L2SecurityCouncilPropose"
    }
```

```diff
    contract L2ReverseCustomGateway (0xCaD7828a19b363A2B44717AFB1786B5196974D8E) {
    +++ description: None
      name:
-        "L2ReverseCustomGateway"
+        "L2ARBGateway"
    }
```

```diff
    contract UpgradeExecutor (0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827) {
    +++ description: None
      name:
-        "UpgradeExecutor"
+        "L2UpgradeExecutor"
    }
```

```diff
    contract ProxyAdmin (0xd570aCE65C43af47101fC6250FD6fC63D1c22a86) {
    +++ description: None
      name:
-        "ProxyAdmin"
+        "L2GatewaysProxyAdmin"
      assignedPermissions.admin.2:
-        "0x5288c571Fd7aD117beA99bF60FE0846C4E84F933"
+        "0x6c411aD3E74De3E7Bd422b94A27770f5B86C623B"
      assignedPermissions.admin.1:
-        "0x09e9222E96E7B4AE2a407B98d48e330053351EEe"
+        "0x5288c571Fd7aD117beA99bF60FE0846C4E84F933"
      assignedPermissions.admin.0:
-        "0x096760F208390250649E3e8763348E783AEF5562"
+        "0x09e9222E96E7B4AE2a407B98d48e330053351EEe"
    }
```

```diff
    contract ProxyAdmin (0xdb216562328215E010F819B5aBe947bad4ca961e) {
    +++ description: None
      name:
-        "ProxyAdmin"
+        "L2ProxyAdmin"
      assignedPermissions.admin.8:
-        "0xf07DeD9dC292157749B6Fd268E37DF6EA38395B9"
      assignedPermissions.admin.7:
-        "0xbFc1FECa8B09A5c5D3EFfE7429eBE24b9c09EF58"
+        "0xf07DeD9dC292157749B6Fd268E37DF6EA38395B9"
      assignedPermissions.admin.6:
-        "0xF3FC178157fb3c87548bAA86F9d24BA38E649B58"
+        "0xbFc1FECa8B09A5c5D3EFfE7429eBE24b9c09EF58"
    }
```

```diff
-   Status: DELETED
    contract FixedDelegateErc20Wallet (0xF3FC178157fb3c87548bAA86F9d24BA38E649B58)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ConstitutionHash (0x1D62fFeB72e4c360CcBbacf7c965153b00260417)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L2SurplusFee (0x32e7AF5A8151934F3787d0cD59EB6EDd0a736b1d)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L2DAIGateway (0x467194771dAe2967Aef3ECbEDD3Bf9a310C76C65)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L2WethGateway (0x6c411aD3E74De3E7Bd422b94A27770f5B86C623B)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L2LPTGateway (0x6D2457a4ad276000A615295f7A80F79E48CcD318)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L2BaseFee (0xbF5041Fc07E1c866D15c749156657B8eEd0fb649)
    +++ description: None
```

Generated with discovered.json: 0x88694b18fb31b6808b8357614cdfb72568db8723

# Diff at Tue, 16 Jul 2024 07:37:04 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@4cebc868d0be9a9868d2842c2670f1974594c48e block: 225188961
- current block number: 232735844

## Description

Four signers from the SC rotated their keys as planned. [ref](https://forum.arbitrum.foundation/t/non-emergency-actions-to-facilitate-key-rotation-of-security-council-june-2024/25140)

## Watched changes

```diff
    contract SecurityCouncilManager (0xD509E5f5aEe2A205F554f36E8a7d56094494eDFC) {
    +++ description: None
+++ description: All 12 addresses of the 2 cohorts of the SecurityCouncil (2x6)
+++ severity: MEDIUM
      values.getBothCohorts.11:
-        "0x0275b3D54a5dDbf8205A75984796eFE8b7357Bae"
+        "0x70C006fC86A392c16D7E085cefc0Ad1FF7de6C75"
+++ description: All 12 addresses of the 2 cohorts of the SecurityCouncil (2x6)
+++ severity: MEDIUM
      values.getBothCohorts.10:
-        "0xa0683d725420e2F75415806352Cd9c3fE10Fa960"
+        "0xA821c8c245d1F3A257e3B0DEC99268cA05144422"
+++ description: All 12 addresses of the 2 cohorts of the SecurityCouncil (2x6)
+++ severity: MEDIUM
      values.getBothCohorts.8:
-        "0xee7Fb91D5b776C326a728dc70e917F82d6809E3C"
+        "0x5a09A94eE8198D3c474d723337aa58023810022C"
+++ description: All 12 addresses of the 2 cohorts of the SecurityCouncil (2x6)
+++ severity: MEDIUM
      values.getBothCohorts.7:
-        "0xB3b60932E598fe946169EC209A197184Bad760B7"
+        "0x5DD2205C3aac13E592F0a3D85188c948D1781df1"
+++ description: All 12 addresses of the 2 cohorts of the SecurityCouncil (2x6)
+++ severity: MEDIUM
      values.getBothCohorts.6:
-        "0xe40D80Bd58CEE55DCC2598724d7F1e03E206581D"
+        "0x0275b3D54a5dDbf8205A75984796eFE8b7357Bae"
      values.getSecondCohort.5:
-        "0x0275b3D54a5dDbf8205A75984796eFE8b7357Bae"
+        "0x70C006fC86A392c16D7E085cefc0Ad1FF7de6C75"
      values.getSecondCohort.4:
-        "0xa0683d725420e2F75415806352Cd9c3fE10Fa960"
+        "0xA821c8c245d1F3A257e3B0DEC99268cA05144422"
      values.getSecondCohort.2:
-        "0xee7Fb91D5b776C326a728dc70e917F82d6809E3C"
+        "0x5a09A94eE8198D3c474d723337aa58023810022C"
      values.getSecondCohort.1:
-        "0xB3b60932E598fe946169EC209A197184Bad760B7"
+        "0x5DD2205C3aac13E592F0a3D85188c948D1781df1"
      values.getSecondCohort.0:
-        "0xe40D80Bd58CEE55DCC2598724d7F1e03E206581D"
+        "0x0275b3D54a5dDbf8205A75984796eFE8b7357Bae"
      values.updateNonce:
-        2
+        6
    }
```

Generated with discovered.json: 0x58ed1c3ec6e1eff2baa268268be3987fd746e7dc

# Diff at Mon, 24 Jun 2024 10:18:00 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@b54e27671cccd831f2f6414fffe3bd374840c6b7 block: 213445891
- current block number: 225188961

## Description

Scheduled SC threshold increase is executed.

## Watched changes

```diff
    contract SC7 (0xADd68bCb0f66878aB9D37a447C7b9067C5dfa941) {
    +++ description: None
      upgradeability.threshold:
-        "7 of 12 (58%)"
+        "9 of 12 (75%)"
      values.getThreshold:
-        7
+        9
    }
```

Generated with discovered.json: 0xedcb031a30b4bdc43edf5e8acb9624b656a40898

# Diff at Tue, 21 May 2024 06:31:07 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@fb4c64221d00d53ed6ec1609ef10dc99f1842087 block: 208388457
- current block number: 213445891

## Description

Execution of the biannual security council elections referenced in the last update.

## Watched changes

```diff
    contract SC9 (0x423552c0F05baCCac5Bfa91C6dCF1dc53a0A1641) {
    +++ description: None
      values.getOwners.10:
-        "0xf6B6F07862A02C85628B3A9688beae07fEA9C863"
+        "0x0275b3D54a5dDbf8205A75984796eFE8b7357Bae"
      values.getOwners.9:
-        "0x5A1FD562271aAC2Dadb51BAAb7760b949D9D81dF"
+        "0xf8e1492255d9428c2Fc20A98A1DeB1215C8ffEfd"
      values.getOwners.8:
-        "0x0275b3D54a5dDbf8205A75984796eFE8b7357Bae"
+        "0x3Bd8e2AC65ad6f0F094BA6766cBd9484AB49eF23"
      values.getOwners.7:
-        "0x5280406912EB8Ec677Df66C326BE48f938DC2e44"
+        "0xb07dc9103328A51128bC6Cc1049d1137035f5E28"
      values.getOwners.6:
-        "0x566a07C3c932aE6AF74d77c29e5c30D8B1853710"
+        "0x3E286452b1C66abB08Eb5494c3894F40aB5a59AF"
      values.getOwners.5:
-        "0xf8e1492255d9428c2Fc20A98A1DeB1215C8ffEfd"
+        "0xb71ca4FFbB7b58d75Ba29891ab45e9Dc12B444Ed"
      values.getOwners.4:
-        "0x3Bd8e2AC65ad6f0F094BA6766cBd9484AB49eF23"
+        "0x8F10e3413586c4a8DCfcE19D009872b19e9cd8E3"
      values.getOwners.3:
-        "0xb07dc9103328A51128bC6Cc1049d1137035f5E28"
+        "0xe40D80Bd58CEE55DCC2598724d7F1e03E206581D"
      values.getOwners.2:
-        "0x3E286452b1C66abB08Eb5494c3894F40aB5a59AF"
+        "0xB3b60932E598fe946169EC209A197184Bad760B7"
      values.getOwners.1:
-        "0xb71ca4FFbB7b58d75Ba29891ab45e9Dc12B444Ed"
+        "0xee7Fb91D5b776C326a728dc70e917F82d6809E3C"
      values.getOwners.0:
-        "0x8F10e3413586c4a8DCfcE19D009872b19e9cd8E3"
+        "0xa0683d725420e2F75415806352Cd9c3fE10Fa960"
    }
```

```diff
    contract SC7 (0xADd68bCb0f66878aB9D37a447C7b9067C5dfa941) {
    +++ description: None
      values.getOwners.10:
-        "0xf6B6F07862A02C85628B3A9688beae07fEA9C863"
+        "0x0275b3D54a5dDbf8205A75984796eFE8b7357Bae"
      values.getOwners.9:
-        "0x5A1FD562271aAC2Dadb51BAAb7760b949D9D81dF"
+        "0xf8e1492255d9428c2Fc20A98A1DeB1215C8ffEfd"
      values.getOwners.8:
-        "0x0275b3D54a5dDbf8205A75984796eFE8b7357Bae"
+        "0x3Bd8e2AC65ad6f0F094BA6766cBd9484AB49eF23"
      values.getOwners.7:
-        "0x5280406912EB8Ec677Df66C326BE48f938DC2e44"
+        "0xb07dc9103328A51128bC6Cc1049d1137035f5E28"
      values.getOwners.6:
-        "0x566a07C3c932aE6AF74d77c29e5c30D8B1853710"
+        "0x3E286452b1C66abB08Eb5494c3894F40aB5a59AF"
      values.getOwners.5:
-        "0xf8e1492255d9428c2Fc20A98A1DeB1215C8ffEfd"
+        "0xb71ca4FFbB7b58d75Ba29891ab45e9Dc12B444Ed"
      values.getOwners.4:
-        "0x3Bd8e2AC65ad6f0F094BA6766cBd9484AB49eF23"
+        "0x8F10e3413586c4a8DCfcE19D009872b19e9cd8E3"
      values.getOwners.3:
-        "0xb07dc9103328A51128bC6Cc1049d1137035f5E28"
+        "0xe40D80Bd58CEE55DCC2598724d7F1e03E206581D"
      values.getOwners.2:
-        "0x3E286452b1C66abB08Eb5494c3894F40aB5a59AF"
+        "0xB3b60932E598fe946169EC209A197184Bad760B7"
      values.getOwners.1:
-        "0xb71ca4FFbB7b58d75Ba29891ab45e9Dc12B444Ed"
+        "0xee7Fb91D5b776C326a728dc70e917F82d6809E3C"
      values.getOwners.0:
-        "0x8F10e3413586c4a8DCfcE19D009872b19e9cd8E3"
+        "0xa0683d725420e2F75415806352Cd9c3fE10Fa960"
    }
```

Generated with discovered.json: 0xe5a979cc7f1e23c4acc6a3510dc4a992f0ff176a

# Diff at Mon, 06 May 2024 09:22:15 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@22b41765601210ab9db53f4371a852edbfa067ea block: 195078255
- current block number: 208388457

## Description

The biannual security council elections are executed with a familiar figure (`0x0275b3D54a5dDbf8205A75984796eFE8b7357Bae`) having been re-elected.

## Watched changes

```diff
    contract SecurityCouncilManager (0xD509E5f5aEe2A205F554f36E8a7d56094494eDFC) {
    +++ description: None
+++ description: All 12 addresses of the 2 cohorts of the SecurityCouncil (2x6)
+++ severity: MEDIUM
      values.getBothCohorts.11:
-        "0x475816ca2a31D601B4e336f5c2418A67978aBf09"
+        "0x0275b3D54a5dDbf8205A75984796eFE8b7357Bae"
+++ description: All 12 addresses of the 2 cohorts of the SecurityCouncil (2x6)
+++ severity: MEDIUM
      values.getBothCohorts.10:
-        "0xf6B6F07862A02C85628B3A9688beae07fEA9C863"
+        "0xa0683d725420e2F75415806352Cd9c3fE10Fa960"
+++ description: All 12 addresses of the 2 cohorts of the SecurityCouncil (2x6)
+++ severity: MEDIUM
      values.getBothCohorts.9:
-        "0x5A1FD562271aAC2Dadb51BAAb7760b949D9D81dF"
+        "0x475816ca2a31D601B4e336f5c2418A67978aBf09"
+++ description: All 12 addresses of the 2 cohorts of the SecurityCouncil (2x6)
+++ severity: MEDIUM
      values.getBothCohorts.8:
-        "0x0275b3D54a5dDbf8205A75984796eFE8b7357Bae"
+        "0xee7Fb91D5b776C326a728dc70e917F82d6809E3C"
+++ description: All 12 addresses of the 2 cohorts of the SecurityCouncil (2x6)
+++ severity: MEDIUM
      values.getBothCohorts.7:
-        "0x5280406912EB8Ec677Df66C326BE48f938DC2e44"
+        "0xB3b60932E598fe946169EC209A197184Bad760B7"
+++ description: All 12 addresses of the 2 cohorts of the SecurityCouncil (2x6)
+++ severity: MEDIUM
      values.getBothCohorts.6:
-        "0x566a07C3c932aE6AF74d77c29e5c30D8B1853710"
+        "0xe40D80Bd58CEE55DCC2598724d7F1e03E206581D"
      values.getSecondCohort.5:
-        "0x475816ca2a31D601B4e336f5c2418A67978aBf09"
+        "0x0275b3D54a5dDbf8205A75984796eFE8b7357Bae"
      values.getSecondCohort.4:
-        "0xf6B6F07862A02C85628B3A9688beae07fEA9C863"
+        "0xa0683d725420e2F75415806352Cd9c3fE10Fa960"
      values.getSecondCohort.3:
-        "0x5A1FD562271aAC2Dadb51BAAb7760b949D9D81dF"
+        "0x475816ca2a31D601B4e336f5c2418A67978aBf09"
      values.getSecondCohort.2:
-        "0x0275b3D54a5dDbf8205A75984796eFE8b7357Bae"
+        "0xee7Fb91D5b776C326a728dc70e917F82d6809E3C"
      values.getSecondCohort.1:
-        "0x5280406912EB8Ec677Df66C326BE48f938DC2e44"
+        "0xB3b60932E598fe946169EC209A197184Bad760B7"
      values.getSecondCohort.0:
-        "0x566a07C3c932aE6AF74d77c29e5c30D8B1853710"
+        "0xe40D80Bd58CEE55DCC2598724d7F1e03E206581D"
      values.updateNonce:
-        1
+        2
    }
```

Generated with discovered.json: 0x719eea4074a6b7d15e0c5fa005f4a80d040398ef

# Diff at Thu, 28 Mar 2024 11:36:42 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@21187e63b9b90823a55c461c331868a470ce17eb block: 189651036
- current block number: 195078255

## Description

Update discovery to include the multisig threshold.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 189651036 (main branch discovery), not current.

```diff
    contract SC9 (0x423552c0F05baCCac5Bfa91C6dCF1dc53a0A1641) {
    +++ description: None
      upgradeability.threshold:
+        "9 of 12 (75%)"
    }
```

```diff
    contract SC7 (0xADd68bCb0f66878aB9D37a447C7b9067C5dfa941) {
    +++ description: None
      upgradeability.threshold:
+        "7 of 12 (58%)"
    }
```

Generated with discovered.json: 0x6cd94aaadac1762751f4e95ba2a134f51e1b436b

# Diff at Tue, 12 Mar 2024 14:47:07 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@28a94a6f03cba215bffdba08f227fba4f8d9ef95 block: 132779316
- current block number: 189651036

## Description

The security council is swapped for two new cohorts.
Context: First Arbitrum security council elections in september 2023.

## Watched changes

```diff
    contract SC9 (0x423552c0F05baCCac5Bfa91C6dCF1dc53a0A1641) {
    +++ description: None
      values.getOwners.5:
-        "0x8e6247239CBeB3Eaf9d9a691D01A67e2A9Fea3C5"
+        "0xf8e1492255d9428c2Fc20A98A1DeB1215C8ffEfd"
      values.getOwners.4:
-        "0x88910996671162953E89DdcE5C8137f9077da217"
+        "0x3Bd8e2AC65ad6f0F094BA6766cBd9484AB49eF23"
      values.getOwners.3:
-        "0x8688515028955734350067695939423222009623"
+        "0xb07dc9103328A51128bC6Cc1049d1137035f5E28"
      values.getOwners.2:
-        "0x0E5011001cF9c89b0259BC3B050785067495eBf5"
+        "0x3E286452b1C66abB08Eb5494c3894F40aB5a59AF"
      values.getOwners.1:
-        "0xf8e1492255d9428c2Fc20A98A1DeB1215C8ffEfd"
+        "0xb71ca4FFbB7b58d75Ba29891ab45e9Dc12B444Ed"
      values.getOwners.0:
-        "0x526C0DA9970E7331d171f86AeD28FAFB5D8A49EF"
+        "0x8F10e3413586c4a8DCfcE19D009872b19e9cd8E3"
    }
```

```diff
    contract SC7 (0xADd68bCb0f66878aB9D37a447C7b9067C5dfa941) {
    +++ description: None
      values.getOwners.5:
-        "0x8e6247239CBeB3Eaf9d9a691D01A67e2A9Fea3C5"
+        "0xf8e1492255d9428c2Fc20A98A1DeB1215C8ffEfd"
      values.getOwners.4:
-        "0x88910996671162953E89DdcE5C8137f9077da217"
+        "0x3Bd8e2AC65ad6f0F094BA6766cBd9484AB49eF23"
      values.getOwners.3:
-        "0x8688515028955734350067695939423222009623"
+        "0xb07dc9103328A51128bC6Cc1049d1137035f5E28"
      values.getOwners.2:
-        "0x0E5011001cF9c89b0259BC3B050785067495eBf5"
+        "0x3E286452b1C66abB08Eb5494c3894F40aB5a59AF"
      values.getOwners.1:
-        "0xf8e1492255d9428c2Fc20A98A1DeB1215C8ffEfd"
+        "0xb71ca4FFbB7b58d75Ba29891ab45e9Dc12B444Ed"
      values.getOwners.0:
-        "0x526C0DA9970E7331d171f86AeD28FAFB5D8A49EF"
+        "0x8F10e3413586c4a8DCfcE19D009872b19e9cd8E3"
      values.nonce:
-        2
+        4
    }
```

```diff
    contract SecurityCouncilManager (0xD509E5f5aEe2A205F554f36E8a7d56094494eDFC) {
    +++ description: None
      values.getBothCohorts.5:
-        "0x8e6247239CBeB3Eaf9d9a691D01A67e2A9Fea3C5"
+        "0x8F10e3413586c4a8DCfcE19D009872b19e9cd8E3"
      values.getBothCohorts.4:
-        "0x88910996671162953E89DdcE5C8137f9077da217"
+        "0xb71ca4FFbB7b58d75Ba29891ab45e9Dc12B444Ed"
      values.getBothCohorts.3:
-        "0x8688515028955734350067695939423222009623"
+        "0x3E286452b1C66abB08Eb5494c3894F40aB5a59AF"
      values.getBothCohorts.2:
-        "0x0E5011001cF9c89b0259BC3B050785067495eBf5"
+        "0xb07dc9103328A51128bC6Cc1049d1137035f5E28"
      values.getBothCohorts.0:
-        "0x526C0DA9970E7331d171f86AeD28FAFB5D8A49EF"
+        "0x3Bd8e2AC65ad6f0F094BA6766cBd9484AB49eF23"
      values.getFirstCohort.5:
-        "0x8e6247239CBeB3Eaf9d9a691D01A67e2A9Fea3C5"
+        "0x8F10e3413586c4a8DCfcE19D009872b19e9cd8E3"
      values.getFirstCohort.4:
-        "0x88910996671162953E89DdcE5C8137f9077da217"
+        "0xb71ca4FFbB7b58d75Ba29891ab45e9Dc12B444Ed"
      values.getFirstCohort.3:
-        "0x8688515028955734350067695939423222009623"
+        "0x3E286452b1C66abB08Eb5494c3894F40aB5a59AF"
      values.getFirstCohort.2:
-        "0x0E5011001cF9c89b0259BC3B050785067495eBf5"
+        "0xb07dc9103328A51128bC6Cc1049d1137035f5E28"
      values.getFirstCohort.0:
-        "0x526C0DA9970E7331d171f86AeD28FAFB5D8A49EF"
+        "0x3Bd8e2AC65ad6f0F094BA6766cBd9484AB49eF23"
      values.updateNonce:
-        0
+        1
    }
```

Generated with discovered.json: 0x527a540ef29193002240152e1304597d1758aa55

# Diff at Wed, 20 Sep 2023 09:16:00 GMT:

- author: Bartek Kiepuszewski (<bkiepuszewski@gmail.com>)
- comparing to: main@

## Watched changes

```diff
+   Status: CREATED
    contract L2CustomGateway (0x096760F208390250649E3e8763348E783AEF5562) {
    }
```

```diff
+   Status: CREATED
    contract L2ERC20Gateway (0x09e9222E96E7B4AE2a407B98d48e330053351EEe) {
    }
```

```diff
+   Status: CREATED
    contract L2CoreTimelock (0x34d45e99f7D8c45ed05B5cA72D54bbD1fb3F98f0) {
    }
```

```diff
+   Status: CREATED
    contract StandardArbERC20 (0x3f770Ac673856F105b586bb393d122721265aD46) {
    }
```

```diff
+   Status: CREATED
    contract BeaconProxyFactory (0x3fE38087A94903A9D946fa1915e1772fe611000f) {
    }
```

```diff
+   Status: CREATED
    contract SC9 (0x423552c0F05baCCac5Bfa91C6dCF1dc53a0A1641) {
    }
```

```diff
+   Status: CREATED
    contract L2GatewayRouter (0x5288c571Fd7aD117beA99bF60FE0846C4E84F933) {
    }
```

```diff
+   Status: CREATED
    contract UpgradeExecRouteBuilder (0x7481716f05E315Fc4C4a64E56DcD9bc1D6F24C0a) {
    }
```

```diff
+   Status: CREATED
    contract TreasuryGovernor (0x789fC99093B09aD01C34DC7251D0C89ce743e5a4) {
    }
```

```diff
+   Status: CREATED
    contract L2ArbitrumToken (0x912CE59144191C1204E64559FE8253a0e49E6548) {
    }
```

```diff
+   Status: CREATED
    contract SecurityCouncilMemberSyncAction (0x9BF7b8884Fa381a45f8CB2525905fb36C996297a) {
    }
```

```diff
+   Status: CREATED
    contract SC7 (0xADd68bCb0f66878aB9D37a447C7b9067C5dfa941) {
    }
```

```diff
+   Status: CREATED
    contract L2TreasuryTimelock (0xbFc1FECa8B09A5c5D3EFfE7429eBE24b9c09EF58) {
    }
```

```diff
+   Status: CREATED
    contract L2ReverseCustomGateway (0xCaD7828a19b363A2B44717AFB1786B5196974D8E) {
    }
```

```diff
+   Status: CREATED
    contract UpgradeExecutor (0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827) {
    }
```

```diff
+   Status: CREATED
    contract SecurityCouncilManager (0xD509E5f5aEe2A205F554f36E8a7d56094494eDFC) {
    }
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0xd570aCE65C43af47101fC6250FD6fC63D1c22a86) {
    }
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0xdb216562328215E010F819B5aBe947bad4ca961e) {
    }
```

```diff
+   Status: CREATED
    contract UpgradeableBeacon (0xE72ba9418b5f2Ce0A6a40501Fe77c6839Aa37333) {
    }
```

```diff
+   Status: CREATED
    contract CoreGovernor (0xf07DeD9dC292157749B6Fd268E37DF6EA38395B9) {
    }
```

```diff
+   Status: CREATED
    contract FixedDelegateErc20Wallet (0xF3FC178157fb3c87548bAA86F9d24BA38E649B58) {
    }
```
