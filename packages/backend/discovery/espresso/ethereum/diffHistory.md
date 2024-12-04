Generated with discovered.json: 0x0d3e2d9e1aa8f00d8488599beab0373eff3ee1d3

# Diff at Wed, 04 Dec 2024 11:56:02 GMT:

- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@7dc480bf5499525d0b44afce03521538ecc8ec73 block: 21273402
- current block number: 21328973

## Description

Provide description of changes. This section will be preserved.

## Watched changes

```diff
    contract HotShotLightClient (0x95Ca91Cea73239b15E5D2e5A74d02d6b5E0ae458) {
    +++ description: None
      values.finalizedState.viewNum:
-        330741
+        408590
      values.finalizedState.blockHeight:
-        326498
+        402316
      values.finalizedState.blockCommRoot:
-        "7626052650991835924151320295231216860698065595252883438564397842518299967014"
+        "7768766347258306299729052154827268224670850405230232894938751927139331481640"
      values.getStateHistoryCount:
-        246
+        261
      values.stateHistoryFirstIndex:
-        17
+        32
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21273402 (main branch discovery), not current.

```diff
    contract HotShotLightClient (0x95Ca91Cea73239b15E5D2e5A74d02d6b5E0ae458) {
    +++ description: None
      unverified:
-        true
      values.finalizedState:
+        {"viewNum":330741,"blockHeight":326498,"blockCommRoot":"7626052650991835924151320295231216860698065595252883438564397842518299967014"}
      values.genesisStakeTableState:
+        {"threshold":34,"blsKeyComm":"1561632536195555148145050274009949812309785157828896392838981322602622136791","schnorrKeyComm":"20147560324529416943341534119711171689827441694011856532375917186049770295574","amountComm":"349594070000690608819508126396071528924936277306125447047023081215269308099"}
      values.genesisState:
+        {"viewNum":0,"blockHeight":0,"blockCommRoot":0}
      values.getStateHistoryCount:
+        246
      values.getVersion:
+        {"majorVersion":1,"minorVersion":0,"patchVersion":0}
      values.isPermissionedProverEnabled:
+        true
      values.owner:
+        "0x34F5af5158171Ffd2475d21dB5fc3B311F221982"
      values.permissionedProver:
+        "0x4fD0Ac6922Da5C96b6f94202EcE60E8fE3bF3947"
      values.stateHistoryFirstIndex:
+        17
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
