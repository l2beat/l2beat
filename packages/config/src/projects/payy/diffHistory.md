Generated with discovered.json: 0xbc43dbc84b44f5006ddfa10e42be7c8dba22c43e

# Diff at Thu, 03 Sep 2026 14:29:51 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@48e31e2bc53412fcaaefb47c7ce1970ccdb072a8 block: 1787654846
- current timestamp: 1787654846

## Description

reapply branch discovery config after merging main

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1787654846 (main branch discovery), not current.

```diff
    contract PayyMultisig (eth:0x230Dfb03F078B0d5E705F4624fCC915f3126B40f) [GnosisSafe] {
    +++ description: None
      receivedPermissions:
-        [{"permission":"interact","from":"eth:0x367C1eAF14AA06b78ce76bd0243297de79d85270","description":"can manage provers, validators, ZK verifiers, supported tokens and burn substitutors, and can overwrite the current state root via setRoot().","role":".owner"},{"permission":"upgrade","from":"eth:0x367C1eAF14AA06b78ce76bd0243297de79d85270","role":"admin","via":[{"address":"eth:0xfE455baCAF1968F1Ae6a322b8Ffbe56840e2f590"}]}]
      directlyReceivedPermissions:
-        [{"permission":"act","from":"eth:0xfE455baCAF1968F1Ae6a322b8Ffbe56840e2f590","role":".owner"}]
    }
```

```diff
    EOA  (eth:0x41582701CB3117680687Df80bD5a2ca971bDA964) {
    +++ description: None
      receivedPermissions:
-        [{"permission":"interact","from":"eth:0x367C1eAF14AA06b78ce76bd0243297de79d85270","description":"can sign state updates as a validator. Signatures from more than 2/3 of the current validator set are required for each update.","role":".getValidatorSets"}]
    }
```

```diff
    EOA  (eth:0x5343B904Bf837Befb2f5A256B0CD5fbF30503D38) {
    +++ description: None
      receivedPermissions:
-        [{"permission":"interact","from":"eth:0x367C1eAF14AA06b78ce76bd0243297de79d85270","description":"can submit state updates (new state roots) via verifyRollup(), providing an aggregated ZK proof and validator signatures.","role":".initialProver"}]
    }
```

```diff
    contract ProxyAdmin (eth:0xfE455baCAF1968F1Ae6a322b8Ffbe56840e2f590) [global/ProxyAdmin] {
    +++ description: None
      directlyReceivedPermissions:
-        [{"permission":"upgrade","from":"eth:0x367C1eAF14AA06b78ce76bd0243297de79d85270","role":"admin"}]
      fieldMeta:
+        {"owner":{"severity":"HIGH"}}
    }
```

Generated with discovered.json: 0xff32667fc411b4e46575da64ebdcada937183193

# Diff at Tue, 25 Aug 2026 13:41:12 GMT:

- author: Sergey Shemyakov (<sergeyshemyakov@gmx.de>)
- current timestamp: 1787654846

## Description

Discovery rerun on the same block number with only config-related changes.

## Initial discovery

```diff
+   Status: CREATED
    contract HonkVerifier (eth:0x14DACD534ddc676601B27f41Eb541a7951524a2F) [payy/HonkVerifier]
    +++ description: UltraHonk proof verifier generated with Aztec's Barretenberg from Payy's final aggregation Noir circuit. It verifies the aggregated validity proof of each state update submitted to the Rollup contract.
```

```diff
+   Status: CREATED
    contract PayyMultisig (eth:0x230Dfb03F078B0d5E705F4624fCC915f3126B40f) [GnosisSafe]
    +++ description: None
```

```diff
+   Status: CREATED
    contract RollupV1 (eth:0x367C1eAF14AA06b78ce76bd0243297de79d85270) [payy/Rollup]
    +++ description: Main contract of the Payy ZK rollup. It stores the state root, escrows USDC backing the notes on the rollup, processes deposits (mints) and withdrawals (burns), and accepts state updates that must include an aggregated ZK proof and signatures from more than 2/3 of the current validator set.
```

```diff
+   Status: CREATED
    contract ProxyAdmin (eth:0xfE455baCAF1968F1Ae6a322b8Ffbe56840e2f590) [global/ProxyAdmin]
    +++ description: None
```
