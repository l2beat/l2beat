Generated with discovered.json: 0x513b91514b5b487138163d383324f96a4e690ab5

# Diff at Mon, 01 Sep 2025 10:01:10 GMT:

Merge mark

Generated with discovered.json: 0xb950b6a8a05d7a0255d345b06c7d226dfe91050d

# Diff at Mon, 14 Jul 2025 12:45:01 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@9f4300dad2f3d080cd56fa311d4a848556c74e72 block: 22397507
- current block number: 22397507

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22397507 (main branch discovery), not current.

```diff
    contract EspressoMultisig (0x34F5af5158171Ffd2475d21dB5fc3B311F221982) {
    +++ description: None
      address:
-        "0x34F5af5158171Ffd2475d21dB5fc3B311F221982"
+        "eth:0x34F5af5158171Ffd2475d21dB5fc3B311F221982"
      values.$implementation:
-        "0x41675C099F32341bf84BFc5382aF534df5C7461a"
+        "eth:0x41675C099F32341bf84BFc5382aF534df5C7461a"
      values.$members.0:
-        "0x389b5c80A1dbE24f96BEb50002cB5fbe2536e1Cc"
+        "eth:0x389b5c80A1dbE24f96BEb50002cB5fbe2536e1Cc"
      values.$members.1:
-        "0xf4b7676d9EC86D2011aB87855424219a97DEB40c"
+        "eth:0xf4b7676d9EC86D2011aB87855424219a97DEB40c"
      values.$members.2:
-        "0x84ef523696eeE7BC7Fe102Eccc8508895Cd2c37E"
+        "eth:0x84ef523696eeE7BC7Fe102Eccc8508895Cd2c37E"
      implementationNames.0x34F5af5158171Ffd2475d21dB5fc3B311F221982:
-        "SafeProxy"
      implementationNames.0x41675C099F32341bf84BFc5382aF534df5C7461a:
-        "Safe"
      implementationNames.eth:0x34F5af5158171Ffd2475d21dB5fc3B311F221982:
+        "SafeProxy"
      implementationNames.eth:0x41675C099F32341bf84BFc5382aF534df5C7461a:
+        "Safe"
    }
```

```diff
    EOA  (0x389b5c80A1dbE24f96BEb50002cB5fbe2536e1Cc) {
    +++ description: None
      address:
-        "0x389b5c80A1dbE24f96BEb50002cB5fbe2536e1Cc"
+        "eth:0x389b5c80A1dbE24f96BEb50002cB5fbe2536e1Cc"
    }
```

```diff
    EOA  (0x4fD0Ac6922Da5C96b6f94202EcE60E8fE3bF3947) {
    +++ description: None
      address:
-        "0x4fD0Ac6922Da5C96b6f94202EcE60E8fE3bF3947"
+        "eth:0x4fD0Ac6922Da5C96b6f94202EcE60E8fE3bF3947"
    }
```

```diff
    EOA  (0x84ef523696eeE7BC7Fe102Eccc8508895Cd2c37E) {
    +++ description: None
      address:
-        "0x84ef523696eeE7BC7Fe102Eccc8508895Cd2c37E"
+        "eth:0x84ef523696eeE7BC7Fe102Eccc8508895Cd2c37E"
    }
```

```diff
    contract HotShotLightClient (0x95Ca91Cea73239b15E5D2e5A74d02d6b5E0ae458) {
    +++ description: The DA bridge contract that stores and verifies HotShot state commitments on Ethereum.
      address:
-        "0x95Ca91Cea73239b15E5D2e5A74d02d6b5E0ae458"
+        "eth:0x95Ca91Cea73239b15E5D2e5A74d02d6b5E0ae458"
      values.$admin:
-        "0x34F5af5158171Ffd2475d21dB5fc3B311F221982"
+        "eth:0x34F5af5158171Ffd2475d21dB5fc3B311F221982"
      values.$implementation:
-        "0xBE0aA3c41A906ABDc48cE21A0960E8311535cA4B"
+        "eth:0xBE0aA3c41A906ABDc48cE21A0960E8311535cA4B"
      values.$pastUpgrades.0.2.0:
-        "0x2E81FD03725158903FD32E41b0357C47941BB2c3"
+        "eth:0x2E81FD03725158903FD32E41b0357C47941BB2c3"
      values.$pastUpgrades.1.2.0:
-        "0xBE0aA3c41A906ABDc48cE21A0960E8311535cA4B"
+        "eth:0xBE0aA3c41A906ABDc48cE21A0960E8311535cA4B"
      values.owner:
-        "0x34F5af5158171Ffd2475d21dB5fc3B311F221982"
+        "eth:0x34F5af5158171Ffd2475d21dB5fc3B311F221982"
      values.permissionedProver:
-        "0x4fD0Ac6922Da5C96b6f94202EcE60E8fE3bF3947"
+        "eth:0x4fD0Ac6922Da5C96b6f94202EcE60E8fE3bF3947"
      implementationNames.0x95Ca91Cea73239b15E5D2e5A74d02d6b5E0ae458:
-        "ERC1967Proxy"
      implementationNames.0xBE0aA3c41A906ABDc48cE21A0960E8311535cA4B:
-        "LightClient"
      implementationNames.eth:0x95Ca91Cea73239b15E5D2e5A74d02d6b5E0ae458:
+        "ERC1967Proxy"
      implementationNames.eth:0xBE0aA3c41A906ABDc48cE21A0960E8311535cA4B:
+        "LightClient"
    }
```

```diff
    EOA  (0xf4b7676d9EC86D2011aB87855424219a97DEB40c) {
    +++ description: None
      address:
-        "0xf4b7676d9EC86D2011aB87855424219a97DEB40c"
+        "eth:0xf4b7676d9EC86D2011aB87855424219a97DEB40c"
    }
```

```diff
+   Status: CREATED
    contract EspressoMultisig (0x34F5af5158171Ffd2475d21dB5fc3B311F221982)
    +++ description: None
```

```diff
+   Status: CREATED
    contract HotShotLightClient (0x95Ca91Cea73239b15E5D2e5A74d02d6b5E0ae458)
    +++ description: The DA bridge contract that stores and verifies HotShot state commitments on Ethereum.
```

Generated with discovered.json: 0x2c7846e1d38db7696eabbf984911bc2f434ce178

# Diff at Fri, 04 Jul 2025 12:18:59 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f56dc47fe915564d4555300304da4d3bcbc087f block: 22397507
- current block number: 22397507

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22397507 (main branch discovery), not current.

```diff
    contract EspressoMultisig (0x34F5af5158171Ffd2475d21dB5fc3B311F221982) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0x95Ca91Cea73239b15E5D2e5A74d02d6b5E0ae458"
+        "eth:0x95Ca91Cea73239b15E5D2e5A74d02d6b5E0ae458"
      receivedPermissions.1.from:
-        "ethereum:0x95Ca91Cea73239b15E5D2e5A74d02d6b5E0ae458"
+        "eth:0x95Ca91Cea73239b15E5D2e5A74d02d6b5E0ae458"
    }
```

```diff
    EOA  (0x4fD0Ac6922Da5C96b6f94202EcE60E8fE3bF3947) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0x95Ca91Cea73239b15E5D2e5A74d02d6b5E0ae458"
+        "eth:0x95Ca91Cea73239b15E5D2e5A74d02d6b5E0ae458"
    }
```

Generated with discovered.json: 0xe6f17bfb1401cba8392e891e4d98471a7a03a2e5

# Diff at Fri, 23 May 2025 09:40:55 GMT:

- chain: ethereum
- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@69cd181abbc3c830a6caf2f4429b37cae72ffdb8 block: 22397507
- current block number: 22397507

## Description

Introduced .role field on each permission, defaulting to field name on which it was defined (with '.' prefix)

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22397507 (main branch discovery), not current.

```diff
    contract EspressoMultisig (0x34F5af5158171Ffd2475d21dB5fc3B311F221982) {
    +++ description: None
      receivedPermissions.1.role:
+        "admin"
      receivedPermissions.0.role:
+        ".owner"
    }
```

```diff
    EOA  (0x4fD0Ac6922Da5C96b6f94202EcE60E8fE3bF3947) {
    +++ description: None
      receivedPermissions.0.role:
+        ".permissionedProver"
    }
```

Generated with discovered.json: 0xc85388059da46c9566b54b1176f84dd9ae17881a

# Diff at Fri, 02 May 2025 17:23:34 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@c598e33a0c469175b7abbd6c2a13b47b63d6b6a4 block: 21372994
- current block number: 22397507

## Description

Minor upgrade of the HotShotLightClient contract (hardcoded verifier keys for the lightclient verifier are now public methods).

## Watched changes

```diff
    contract HotShotLightClient (0x95Ca91Cea73239b15E5D2e5A74d02d6b5E0ae458) {
    +++ description: The DA bridge contract that stores and verifies HotShot state commitments on Ethereum.
      sourceHashes.1:
-        "0xb39829b8c4f7adee8b3f63d4c34b18a92e40670401393ceb3af7105d95f4b8c4"
+        "0x6c8c2f6bb51ae2ffefb868f088dc9db0c6c7b920bc8fe97de669ee0d91e43090"
      values.$implementation:
-        "0x2E81FD03725158903FD32E41b0357C47941BB2c3"
+        "0xBE0aA3c41A906ABDc48cE21A0960E8311535cA4B"
      values.$pastUpgrades.1:
+        ["2024-11-05T18:20:35.000Z","0x48bc49aef98e23cde6494da9897bac992ea11e7390c162bb86baa5a2c2209c4c",["0x2E81FD03725158903FD32E41b0357C47941BB2c3"]]
      values.$pastUpgrades.0.2:
-        ["0x2E81FD03725158903FD32E41b0357C47941BB2c3"]
+        "0x61a3f76709191c8149c61f1aed15846ac8debd71a50540f71d94f21882323e41"
      values.$pastUpgrades.0.1:
-        "2024-11-05T18:20:35.000Z"
+        "2025-05-01T16:57:23.000Z"
      values.$pastUpgrades.0.0:
-        "0x48bc49aef98e23cde6494da9897bac992ea11e7390c162bb86baa5a2c2209c4c"
+        ["0xBE0aA3c41A906ABDc48cE21A0960E8311535cA4B"]
      values.$upgradeCount:
-        1
+        2
    }
```

## Source code changes

```diff
.../HotShotLightClient/LightClient.sol             | 72 +++++++++++++---------
 1 file changed, 43 insertions(+), 29 deletions(-)
```

Generated with discovered.json: 0x2251de852fcd46ef642fea8c91cac2509784a3c9

# Diff at Tue, 29 Apr 2025 08:19:02 GMT:

- chain: ethereum
- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@ef7477af00fe0b57a2f7cacf7e958c12494af662 block: 21372994
- current block number: 21372994

## Description

Field .issuedPermissions is removed from the output as no longer needed. Added 'permissionsConfigHash' due to refactoring of the modelling process (into a separate command).

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21372994 (main branch discovery), not current.

```diff
    contract HotShotLightClient (0x95Ca91Cea73239b15E5D2e5A74d02d6b5E0ae458) {
    +++ description: The DA bridge contract that stores and verifies HotShot state commitments on Ethereum.
      issuedPermissions:
-        [{"permission":"interact","to":"0x34F5af5158171Ffd2475d21dB5fc3B311F221982","description":"can authorize an upgrade, update the permissioned prover, disable permissioned prover mode and set the state history retention period.","via":[]},{"permission":"interact","to":"0x4fD0Ac6922Da5C96b6f94202EcE60E8fE3bF3947","description":"can call newFinalizedState() to prove the latest HotShot state.","via":[]},{"permission":"upgrade","to":"0x34F5af5158171Ffd2475d21dB5fc3B311F221982","via":[]}]
    }
```

Generated with discovered.json: 0x7aeee60f11b3664455af709e819fc506e0e0df8e

# Diff at Tue, 04 Mar 2025 10:39:07 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@98d260b45fe0d2195ce5e629bd7b200c8706e8ba block: 21372994
- current block number: 21372994

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21372994 (main branch discovery), not current.

```diff
    contract EspressoMultisig (0x34F5af5158171Ffd2475d21dB5fc3B311F221982) {
    +++ description: None
      sinceBlock:
+        20883069
    }
```

```diff
    contract HotShotLightClient (0x95Ca91Cea73239b15E5D2e5A74d02d6b5E0ae458) {
    +++ description: The DA bridge contract that stores and verifies HotShot state commitments on Ethereum.
      sinceBlock:
+        21123201
    }
```

Generated with discovered.json: 0x69e9e843273627453fcaf0d110127ab87d88aa8a

# Diff at Tue, 04 Feb 2025 12:31:24 GMT:

- chain: ethereum
- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@145553eed7ba44636411ecb25e4099728acd02f9 block: 21372994
- current block number: 21372994

## Description

Rename 'configure' permission to 'interact'

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21372994 (main branch discovery), not current.

```diff
    contract EspressoMultisig (0x34F5af5158171Ffd2475d21dB5fc3B311F221982) {
    +++ description: None
      receivedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract HotShotLightClient (0x95Ca91Cea73239b15E5D2e5A74d02d6b5E0ae458) {
    +++ description: The DA bridge contract that stores and verifies HotShot state commitments on Ethereum.
      issuedPermissions.1.permission:
-        "configure"
+        "interact"
      issuedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

Generated with discovered.json: 0x1290e65807d50f3902417f526119a0eba52b3764

# Diff at Mon, 20 Jan 2025 11:09:28 GMT:

- chain: ethereum
- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@2c8b4f3d9910bb6371be9b4df87b70856e7d8c64 block: 21372994
- current block number: 21372994

## Description

Rerun on the same block number. Applies fixes to permissions and via field. Renames permission's target to to/from.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21372994 (main branch discovery), not current.

```diff
    contract EspressoMultisig (0x34F5af5158171Ffd2475d21dB5fc3B311F221982) {
    +++ description: None
      receivedPermissions.1.target:
-        "0x95Ca91Cea73239b15E5D2e5A74d02d6b5E0ae458"
      receivedPermissions.1.from:
+        "0x95Ca91Cea73239b15E5D2e5A74d02d6b5E0ae458"
      receivedPermissions.0.target:
-        "0x95Ca91Cea73239b15E5D2e5A74d02d6b5E0ae458"
      receivedPermissions.0.from:
+        "0x95Ca91Cea73239b15E5D2e5A74d02d6b5E0ae458"
    }
```

```diff
    contract HotShotLightClient (0x95Ca91Cea73239b15E5D2e5A74d02d6b5E0ae458) {
    +++ description: The DA bridge contract that stores and verifies HotShot state commitments on Ethereum.
      issuedPermissions.2.target:
-        "0x34F5af5158171Ffd2475d21dB5fc3B311F221982"
      issuedPermissions.2.to:
+        "0x34F5af5158171Ffd2475d21dB5fc3B311F221982"
      issuedPermissions.1.target:
-        "0x4fD0Ac6922Da5C96b6f94202EcE60E8fE3bF3947"
      issuedPermissions.1.to:
+        "0x4fD0Ac6922Da5C96b6f94202EcE60E8fE3bF3947"
      issuedPermissions.1.description:
+        "can call newFinalizedState() to prove the latest HotShot state."
      issuedPermissions.0.target:
-        "0x34F5af5158171Ffd2475d21dB5fc3B311F221982"
      issuedPermissions.0.to:
+        "0x34F5af5158171Ffd2475d21dB5fc3B311F221982"
      issuedPermissions.0.description:
+        "can authorize an upgrade, update the permissioned prover, disable permissioned prover mode and set the state history retention period."
    }
```

Generated with discovered.json: 0x7d7cd8a406e24ad5c89e87f0a3ecd35e7d023ff5

# Diff at Tue, 10 Dec 2024 15:28:04 GMT:

- chain: ethereum
- author: Michał Podsiadły (<michal.podsiadly@l2beat.com>)
- comparing to: main@9fa33d1fcbebe3872dda2bf08af4ca0484de900b block: 21329314
- current block number: 21372994

## Description

Make Espresso discovery-driven.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21329314 (main branch discovery), not current.

```diff
    contract EspressoMultisig (0x34F5af5158171Ffd2475d21dB5fc3B311F221982) {
    +++ description: None
      receivedPermissions.1:
+        {"permission":"upgrade","target":"0x95Ca91Cea73239b15E5D2e5A74d02d6b5E0ae458"}
      receivedPermissions.0.permission:
-        "upgrade"
+        "configure"
      receivedPermissions.0.description:
+        "can authorize an upgrade, update the permissioned prover, disable permissioned prover mode and set the state history retention period."
    }
```

```diff
    contract HotShotLightClient (0x95Ca91Cea73239b15E5D2e5A74d02d6b5E0ae458) {
    +++ description: The DA bridge contract that stores and verifies HotShot state commitments on Ethereum.
      issuedPermissions.2:
+        {"permission":"upgrade","target":"0x34F5af5158171Ffd2475d21dB5fc3B311F221982","via":[]}
      issuedPermissions.1:
+        {"permission":"configure","target":"0x4fD0Ac6922Da5C96b6f94202EcE60E8fE3bF3947","via":[]}
      issuedPermissions.0.permission:
-        "upgrade"
+        "configure"
      description:
+        "The DA bridge contract that stores and verifies HotShot state commitments on Ethereum."
    }
```

Generated with discovered.json: 0xbef0fc2ec9350fa46048af184960c5f07bb02d84

# Diff at Wed, 04 Dec 2024 14:34:00 GMT:

- chain: ethereum
- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@7dc480bf5499525d0b44afce03521538ecc8ec73 block: 21273402
- current block number: 21329314

## Description

Light Client contract verified.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21273402 (main branch discovery), not current.

```diff
    contract EspressoMultisig (0x34F5af5158171Ffd2475d21dB5fc3B311F221982) {
    +++ description: None
      name:
-        "Safe"
+        "EspressoMultisig"
    }
```

```diff
    contract HotShotLightClient (0x95Ca91Cea73239b15E5D2e5A74d02d6b5E0ae458) {
    +++ description: None
      unverified:
-        true
      values.genesisStakeTableState:
+        {"threshold":34,"blsKeyComm":"1561632536195555148145050274009949812309785157828896392838981322602622136791","schnorrKeyComm":"20147560324529416943341534119711171689827441694011856532375917186049770295574","amountComm":"349594070000690608819508126396071528924936277306125447047023081215269308099"}
      values.genesisState:
+        {"viewNum":0,"blockHeight":0,"blockCommRoot":0}
      values.getVersion:
+        {"majorVersion":1,"minorVersion":0,"patchVersion":0}
      values.isPermissionedProverEnabled:
+        true
      values.owner:
+        "0x34F5af5158171Ffd2475d21dB5fc3B311F221982"
      values.permissionedProver:
+        "0x4fD0Ac6922Da5C96b6f94202EcE60E8fE3bF3947"
      values.stateHistoryRetentionPeriod:
+        864000
      values.UPGRADE_INTERFACE_VERSION:
+        "5.0.0"
      sourceHashes:
+        ["0xbbe53a68c0042f4050bdf21e8d16eee4688dd35d24e49740915f0a0cf994f0d6","0xb39829b8c4f7adee8b3f63d4c34b18a92e40670401393ceb3af7105d95f4b8c4"]
    }
```

Generated with discovered.json: 0x35ac1bf04ae2243209a36eb3a2853daa40ebe020

# Diff at Tue, 26 Nov 2024 17:25:29 GMT:

- chain: ethereum
- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- current block number: 21273402

## Description

First discovery. HotShotLightClient implementation is unverified.

## Initial discovery

```diff
+   Status: CREATED
    contract Safe (0x34F5af5158171Ffd2475d21dB5fc3B311F221982)
    +++ description: None
```

```diff
+   Status: CREATED
    contract HotShotLightClient (0x95Ca91Cea73239b15E5D2e5A74d02d6b5E0ae458)
    +++ description: None
```

