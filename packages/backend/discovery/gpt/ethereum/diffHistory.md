Generated with discovered.json: 0xfefa2eea1f1591cc7d48c4d83ed641816edeba5f

# Diff at Mon, 20 Jan 2025 11:09:33 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@2c8b4f3d9910bb6371be9b4df87b70856e7d8c64 block: 21628462
- current block number: 21628462

## Description

Rerun on the same block number. Applies fixes to permissions and via field. Renames permission's target to to/from.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21628462 (main branch discovery), not current.

```diff
    contract GptProtocolDAC (0x75E26A2996DEAbA20386B6f3c1C957eFadb3f6E8) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xb8605297399baEb6628C9E8F5D3E52A056492cfe"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0xb8605297399baEb6628C9E8F5D3E52A056492cfe"
    }
```

```diff
    contract DACProxyAdmin (0xada59D145126A746976F0F56477aafFEB3acc8e3) {
    +++ description: None
      directlyReceivedPermissions.0.target:
-        "0x75E26A2996DEAbA20386B6f3c1C957eFadb3f6E8"
      directlyReceivedPermissions.0.from:
+        "0x75E26A2996DEAbA20386B6f3c1C957eFadb3f6E8"
    }
```

Generated with discovered.json: 0x995d8baa2ff158e4a0ea6f11adef584786f95b3c

# Diff at Wed, 15 Jan 2025 07:42:55 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@3ea176aee1470e5ec80e65adfc81a954f84584d8 block: 20676773
- current block number: 21628462

## Description

Config related: displayName.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20676773 (main branch discovery), not current.

```diff
    contract DACProxyAdmin (0xada59D145126A746976F0F56477aafFEB3acc8e3) {
    +++ description: None
      displayName:
+        "ProxyAdmin"
    }
```

Generated with discovered.json: 0xc95e2ee9b64a05feae5e290a7c42226c54d55ae2

# Diff at Mon, 21 Oct 2024 11:06:16 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@8895d33866f5665c4c710f4ddaa32bfa63cc3c78 block: 20676773
- current block number: 20676773

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20676773 (main branch discovery), not current.

```diff
    contract GptProtocolDAC (0x75E26A2996DEAbA20386B6f3c1C957eFadb3f6E8) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0xA36aFB6b79A3d164a3d12C141c916BECc6e012D8"]
      values.$pastUpgrades.0.1:
-        ["0xA36aFB6b79A3d164a3d12C141c916BECc6e012D8"]
+        "0x0a7c7231ed11b5452e24014b44c25286a58b4048cb401623b23a77ff1ee67fe7"
    }
```

```diff
    contract GptProtocolValidium (0xC4E903D3Af4c3d2e437492d602adcC9d9b536858) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0x10D296e8aDd0535be71639E5D1d1c30ae1C6bD4C"]
      values.$pastUpgrades.0.1:
-        ["0x10D296e8aDd0535be71639E5D1d1c30ae1C6bD4C"]
+        "0x3dc530423d40c84109b6c3c014ee3182ae576375dc5888187e4a33380930d54a"
    }
```

Generated with discovered.json: 0xd5475b6e2ea44681e3418c1c98714c3b59dee9c5

# Diff at Mon, 14 Oct 2024 10:51:22 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1afc77ff111ceb0970e7d09efcc7b2f376b0c281 block: 20676773
- current block number: 20676773

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20676773 (main branch discovery), not current.

```diff
    contract Verifier (0x0775e11309d75aA6b0967917fB0213C5673eDf81) {
    +++ description: None
      sourceHashes:
+        ["0x0bc67d276b40b2ba13903d94fd6c25ae4d3d5162bc942763c418afdc11bc9b32"]
    }
```

```diff
    contract GptProtocolDAC (0x75E26A2996DEAbA20386B6f3c1C957eFadb3f6E8) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xada59D145126A746976F0F56477aafFEB3acc8e3"
+        "0xb8605297399baEb6628C9E8F5D3E52A056492cfe"
      issuedPermissions.0.via.0:
+        {"address":"0xada59D145126A746976F0F56477aafFEB3acc8e3","delay":0}
      sourceHashes:
+        ["0x36a2777510f3b20063560bdcb7f657da283bcfdc484a19b0a0f77d18f6a8b5e1","0xf7c38d00c4b6000f1840ed38f9ae99d753da8ac69ee1b6ac9ed614f2b60d470f"]
    }
```

```diff
    contract DACProxyAdmin (0xada59D145126A746976F0F56477aafFEB3acc8e3) {
    +++ description: None
      receivedPermissions:
-        [{"permission":"upgrade","target":"0x75E26A2996DEAbA20386B6f3c1C957eFadb3f6E8"}]
      template:
+        "global/ProxyAdmin"
      sourceHashes:
+        ["0x68f689a23d3badd91255602a1eb13d4789baedc16d904c3103244642fc78ca8f"]
      directlyReceivedPermissions:
+        [{"permission":"upgrade","target":"0x75E26A2996DEAbA20386B6f3c1C957eFadb3f6E8"}]
    }
```

```diff
    contract GptProtocolValidium (0xC4E903D3Af4c3d2e437492d602adcC9d9b536858) {
    +++ description: None
      sourceHashes:
+        ["0xa25e4c87882527d75fa2198c374939dd0c3b3fd509be89ee51c9b206bc62bdc4","0x7c56bc9e6cae8422520d318420d3b180551e366e0e265bc846875479cfabdef7"]
    }
```

Generated with discovered.json: 0xb39d956055fabaea2143d896b9e483af6c66d214

# Diff at Tue, 01 Oct 2024 10:51:16 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bd754dc73c66120164006054f8d25c5fae9cd910 block: 20676773
- current block number: 20676773

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20676773 (main branch discovery), not current.

```diff
    contract GptProtocolDAC (0x75E26A2996DEAbA20386B6f3c1C957eFadb3f6E8) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-06-19T11:51:11.000Z",["0xA36aFB6b79A3d164a3d12C141c916BECc6e012D8"]]]
    }
```

```diff
    contract GptProtocolValidium (0xC4E903D3Af4c3d2e437492d602adcC9d9b536858) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-05-27T11:06:11.000Z",["0x10D296e8aDd0535be71639E5D1d1c30ae1C6bD4C"]]]
    }
```

Generated with discovered.json: 0x6f161e5e223889737465ce1e4b0eb818906ad14f

# Diff at Wed, 04 Sep 2024 10:59:06 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- current block number: 20676773

## Description

Initial discovery: type 4 polygonCDK Validium with shared verifier and main contract implementation. Custom gas token (GPT), no TVL tracking yet due to shared bridge.

## Initial discovery

```diff
+   Status: CREATED
    contract Verifier (0x0775e11309d75aA6b0967917fB0213C5673eDf81)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GptProtocolDAC (0x75E26A2996DEAbA20386B6f3c1C957eFadb3f6E8)
    +++ description: None
```

```diff
+   Status: CREATED
    contract DACProxyAdmin (0xada59D145126A746976F0F56477aafFEB3acc8e3)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GptProtocolValidium (0xC4E903D3Af4c3d2e437492d602adcC9d9b536858)
    +++ description: None
```
