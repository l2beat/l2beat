Generated with discovered.json: 0xd01d2f69be09a6db99f51f61cadefc18672b04a7

# Diff at Tue, 04 Mar 2025 10:39:13 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@98d260b45fe0d2195ce5e629bd7b200c8706e8ba block: 21744154
- current block number: 21744154

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21744154 (main branch discovery), not current.

```diff
    contract Verifier (0x0775e11309d75aA6b0967917fB0213C5673eDf81) {
    +++ description: Verifies ZK proofs for state roots of this Layer 2 via the PolygonRollupManager.
      sinceBlock:
+        19505052
    }
```

```diff
    contract PolygonDataCommittee (0x75E26A2996DEAbA20386B6f3c1C957eFadb3f6E8) {
    +++ description: Manages the members of the data availability committee (DAC) and the threshold for accepting commitments from them (Currently 2/1).
      sinceBlock:
+        20125601
    }
```

```diff
    contract ProxyAdmin (0xada59D145126A746976F0F56477aafFEB3acc8e3) {
    +++ description: None
      sinceBlock:
+        20125600
    }
```

```diff
    contract Validium (0xC4E903D3Af4c3d2e437492d602adcC9d9b536858) {
    +++ description: The main system contract defining the gpt-mainnet Layer 2 logic. Entry point for sequencing batches.
      sinceBlock:
+        19960801
    }
```

Generated with discovered.json: 0x98f1ced001a0241dd3f7d57041d34d159a3b18ee

# Diff at Thu, 27 Feb 2025 11:45:44 GMT:

- author: Michał Podsiadły (<michal.podsiadly@l2beat.com>)
- comparing to: main@a4b50e45bb44f8ceeea29f9236088d26a843c885 block: 21744154
- current block number: 21744154

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21744154 (main branch discovery), not current.

```diff
    contract Verifier (0x0775e11309d75aA6b0967917fB0213C5673eDf81) {
    +++ description: Verifies ZK proofs for state roots of this Layer 2 via the PolygonRollupManager.
      name:
-        "FflonkVerifier"
+        "Verifier"
      displayName:
-        "Verifier"
    }
```

Generated with discovered.json: 0x7819947ddaec0744fb2bdc9116b251053fa37543

# Diff at Wed, 26 Feb 2025 10:32:49 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@18513668f913fbe57a197f43655b19111df0e627 block: 21744154
- current block number: 21744154

## Description

config related: added categories for all opstack, op stack and polygoncdk stack templates.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21744154 (main branch discovery), not current.

```diff
    contract FflonkVerifier (0x0775e11309d75aA6b0967917fB0213C5673eDf81) {
    +++ description: Verifies ZK proofs for state roots of this Layer 2 via the PolygonRollupManager.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract PolygonDataCommittee (0x75E26A2996DEAbA20386B6f3c1C957eFadb3f6E8) {
    +++ description: Manages the members of the data availability committee (DAC) and the threshold for accepting commitments from them (Currently 2/1).
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract Validium (0xC4E903D3Af4c3d2e437492d602adcC9d9b536858) {
    +++ description: The main system contract defining the gpt-mainnet Layer 2 logic. Entry point for sequencing batches.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

Generated with discovered.json: 0x0974f0953d39381a030d46ef8655abde90a7ac3c

# Diff at Tue, 04 Feb 2025 12:31:29 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@145553eed7ba44636411ecb25e4099728acd02f9 block: 21744154
- current block number: 21744154

## Description

Rename 'configure' permission to 'interact'

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21744154 (main branch discovery), not current.

```diff
    contract PolygonDataCommittee (0x75E26A2996DEAbA20386B6f3c1C957eFadb3f6E8) {
    +++ description: Manages the members of the data availability committee (DAC) and the threshold for accepting commitments from them (Currently 2/1).
      issuedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract Validium (0xC4E903D3Af4c3d2e437492d602adcC9d9b536858) {
    +++ description: The main system contract defining the gpt-mainnet Layer 2 logic. Entry point for sequencing batches.
      issuedPermissions.1.permission:
-        "configure"
+        "interact"
      issuedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

Generated with discovered.json: 0x45609a98af3614dacd940df0d10bc4a6d0148962

# Diff at Mon, 03 Feb 2025 09:18:01 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@a86862ef704cb8a38295607226918095f937c05b block: 21744154
- current block number: 21744154

## Description

discodrive polygoncdk chains!

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21744154 (main branch discovery), not current.

```diff
    contract FflonkVerifier (0x0775e11309d75aA6b0967917fB0213C5673eDf81) {
    +++ description: Verifies ZK proofs for state roots of this Layer 2 via the PolygonRollupManager.
      name:
-        "Verifier"
+        "FflonkVerifier"
      template:
+        "polygon-cdk/Verifier"
      displayName:
+        "Verifier"
      description:
+        "Verifies ZK proofs for state roots of this Layer 2 via the PolygonRollupManager."
    }
```

```diff
    contract PolygonDataCommittee (0x75E26A2996DEAbA20386B6f3c1C957eFadb3f6E8) {
    +++ description: Manages the members of the data availability committee (DAC) and the threshold for accepting commitments from them (Currently 2/1).
      name:
-        "GptProtocolDAC"
+        "PolygonDataCommittee"
      issuedPermissions.1:
+        {"permission":"upgrade","to":"0xb8605297399baEb6628C9E8F5D3E52A056492cfe","via":[{"address":"0xada59D145126A746976F0F56477aafFEB3acc8e3"}]}
      issuedPermissions.0.permission:
-        "upgrade"
+        "configure"
      issuedPermissions.0.to:
-        "0xb8605297399baEb6628C9E8F5D3E52A056492cfe"
+        "0x5B8C9f36c8F84E49EC89Ae2881D920Ceb36D7F40"
      issuedPermissions.0.via.0:
-        {"address":"0xada59D145126A746976F0F56477aafFEB3acc8e3"}
      issuedPermissions.0.description:
+        "manage the members of the data availability committee and the threshold for valid commitments."
      template:
+        "polygon-cdk/PolygonDataCommittee"
      description:
+        "Manages the members of the data availability committee (DAC) and the threshold for accepting commitments from them (Currently 2/1)."
    }
```

```diff
    contract ProxyAdmin (0xada59D145126A746976F0F56477aafFEB3acc8e3) {
    +++ description: None
      name:
-        "DACProxyAdmin"
+        "ProxyAdmin"
      displayName:
-        "ProxyAdmin"
    }
```

```diff
    contract Validium (0xC4E903D3Af4c3d2e437492d602adcC9d9b536858) {
    +++ description: The main system contract defining the gpt-mainnet Layer 2 logic. Entry point for sequencing batches.
      name:
-        "GptProtocolValidium"
+        "Validium"
      template:
+        "polygon-cdk/PolygonZkEVM"
      displayName:
+        "PolygonZkEVM"
      description:
+        "The main system contract defining the gpt-mainnet Layer 2 logic. Entry point for sequencing batches."
      issuedPermissions:
+        [{"permission":"configure","to":"0x5B8C9f36c8F84E49EC89Ae2881D920Ceb36D7F40","description":"set core system parameters like the trusted sequencer and manage forced transactions/batches.","via":[]},{"permission":"configure","to":"0x5B8C9f36c8F84E49EC89Ae2881D920Ceb36D7F40","description":"sole address that can force batches.","via":[]},{"permission":"sequence","to":"0x3451F208447c4D81346c10239eF92A1eB98b65C3","via":[]}]
      fieldMeta:
+        {"forceBatchAddress":{"severity":"HIGH","description":"If this changes to the ZERO address, an update to the risk rosette is probably needed, since forcing batches is open to everyone."}}
    }
```

Generated with discovered.json: 0x88c43e6dad7121eee5424175b01f0a26d848b77a

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
