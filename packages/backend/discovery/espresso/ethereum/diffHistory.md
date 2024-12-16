Generated with discovered.json: 0x3488c508088a9e61f71889f9042bd10b4a314405

# Diff at Tue, 10 Dec 2024 15:28:04 GMT:

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
