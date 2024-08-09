Generated with discovered.json: 0xdc9c4c2c96a94f4a6f2125e019aaef2d394a928d

# Diff at Fri, 09 Aug 2024 10:14:52 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f0da1d0aab7bc6b3b5e54e7e93480bd98e57035 block: 74469390
- current block number: 74469390

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 74469390 (main branch discovery), not current.

```diff
    contract UpgradeExecutor (0x0611b78A42903a537BE7a2f9a8783BE39AC63cD9) {
    +++ description: None
      assignedPermissions.admin:
-        ["0x04ea347cC6A258A7F65D67aFb60B1d487062A1d0"]
      assignedPermissions.upgrade:
+        ["0x04ea347cC6A258A7F65D67aFb60B1d487062A1d0"]
    }
```

```diff
    contract ProxyAdmin (0x27C7Bfd2cC11429e9b80c443b42FDBe4754F6c91) {
    +++ description: None
      assignedPermissions.admin:
-        ["0x0611b78A42903a537BE7a2f9a8783BE39AC63cD9","0x0fF7A97caAb356c5507e5355b6819CB8b93d5591","0x383eFE8D410285c5CbE1B4F296022640759aA834","0xA597e0212971e65f53f288Ff1fFd26A6C8201f83","0xD4FE46D2533E7d03382ac6cACF0547F336e59DC0","0xFF55fB76F5671dD9eB6c62EffF8D693Bb161a3ad","0xe347C1223381b9Dcd6c0F61cf81c90175A7Bae77"]
      assignedPermissions.upgrade:
+        ["0xD4FE46D2533E7d03382ac6cACF0547F336e59DC0","0xA597e0212971e65f53f288Ff1fFd26A6C8201f83","0xFF55fB76F5671dD9eB6c62EffF8D693Bb161a3ad","0x0fF7A97caAb356c5507e5355b6819CB8b93d5591","0xe347C1223381b9Dcd6c0F61cf81c90175A7Bae77","0x383eFE8D410285c5CbE1B4F296022640759aA834","0x0611b78A42903a537BE7a2f9a8783BE39AC63cD9"]
    }
```

Generated with discovered.json: 0x821f94cff7e5ef847e878545c232714e518f85ed

# Diff at Tue, 30 Jul 2024 11:18:25 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@b2b6471ff62871f4956541f42ec025c356c08f7e block: 74469390
- current block number: 74469390

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 74469390 (main branch discovery), not current.

```diff
    contract RollupProxy (0x04ea347cC6A258A7F65D67aFb60B1d487062A1d0) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
      fieldMeta:
+        {"confirmPeriodBlocks":{"description":"Challenge period. (Number of blocks until a node is confirmed)."},"wasmModuleRoot":{"description":"Root hash of the WASM module used for execution, like a fingerprint of the L2 logic. Can be associated with ArbOS versions."}}
    }
```

```diff
    contract SequencerInbox (0xe347C1223381b9Dcd6c0F61cf81c90175A7Bae77) {
    +++ description: State batches / commitments get posted here.
      fieldMeta:
+        {"maxTimeVariation":{"description":"Struct: delayBlocks, futureBlocks, delaySeconds, futureSeconds. onlyRollupOwner settable. Transactions can only be force-included after `delayBlocks` window (Sequencer-only) has passed."}}
    }
```

Generated with discovered.json: 0xb202839bf951a0726b981784616a7c5858e89925

# Diff at Mon, 22 Jul 2024 12:29:10 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- current block number: 74469390

## Description

Initial discovery: First L3 Optimium with an Optimium as host chain (nova). Admin EOA, unverified contracts, native token not on coingecko (TVL will be zero). Otherwise standard Orbit stack with custom native token.

## Initial discovery

```diff
+   Status: CREATED
    contract RollupProxy (0x04ea347cC6A258A7F65D67aFb60B1d487062A1d0)
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
```

```diff
+   Status: CREATED
    contract UpgradeExecutor (0x0611b78A42903a537BE7a2f9a8783BE39AC63cD9)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ERC20RollupEventInbox (0x0fF7A97caAb356c5507e5355b6819CB8b93d5591)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProver0 (0x1135265fE014D3FA32B3507E325642B92aFFeAEb)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x27C7Bfd2cC11429e9b80c443b42FDBe4754F6c91)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ValidatorWalletCreator (0x2b0E04Dc90e3fA58165CB41E2834B44A56E766aF)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ChallengeManager (0x383eFE8D410285c5CbE1B4F296022640759aA834)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProverMath (0x4811500e0d376Fa8d2EA3CCb7c61E0afB4F5A7f1)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ValidatorUtils (0x6c21303F5986180B1394d2C89f3e883890E2867b)
    +++ description: None
```

```diff
+   Status: CREATED
    contract  (0x82709E8564ce17707a7C8420c9e48e9a8A88bfc1)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProverHostIo (0x89AF7C4C2198c426cFe6E86de0680A0850503e06)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProofEntry (0x99a2A31300816C1FA3f40818AC9280fe7271F878)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Outbox (0xA597e0212971e65f53f288Ff1fFd26A6C8201f83)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Bridge (0xD4FE46D2533E7d03382ac6cACF0547F336e59DC0)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProverMemory (0xDf94F0474F205D086dbc2e66D69a856FCf520622)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SequencerInbox (0xe347C1223381b9Dcd6c0F61cf81c90175A7Bae77)
    +++ description: State batches / commitments get posted here.
```

```diff
+   Status: CREATED
    contract Inbox (0xFF55fB76F5671dD9eB6c62EffF8D693Bb161a3ad)
    +++ description: None
```
