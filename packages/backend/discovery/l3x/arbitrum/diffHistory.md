Generated with discovered.json: 0x855dc40786c6a76e4d08171d3015f37d61f6d806

# Diff at Fri, 09 Aug 2024 10:13:35 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f0da1d0aab7bc6b3b5e54e7e93480bd98e57035 block: 234834723
- current block number: 234834723

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 234834723 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x29994207C5AeDc83F27c5dc16E468f328832d42d) {
    +++ description: None
      assignedPermissions.admin:
-        ["0x1526DAacDAf3EE81E5ae087E0DA8677E8c677CE5","0x211C9893653Aea2088E34765e7039617E95fD8fD","0x4D0D8724ff2303A1679689a9Cc8e2A62f821e0E3","0x4fF3E70f30f0394Ad62428751Fe3858740595908","0x59E088d827CB7983Cd0CC64312E472D7cc8a4F44","0x80de5c4ccDfb7b6a250A9588C2d80F62a2B7d13F","0x817C8Da480bC6b42a5FA88A26e9eD8c0c03968Cf","0xB9450b512Fd3454e9C1a2593C5DF9E71344b5653","0xc40e1DdDDc4837e63Bfb21EF34d3Ca4A6c78fD15"]
      assignedPermissions.upgrade:
+        ["0x4fF3E70f30f0394Ad62428751Fe3858740595908","0x59E088d827CB7983Cd0CC64312E472D7cc8a4F44","0x817C8Da480bC6b42a5FA88A26e9eD8c0c03968Cf","0x80de5c4ccDfb7b6a250A9588C2d80F62a2B7d13F","0x1526DAacDAf3EE81E5ae087E0DA8677E8c677CE5","0xc40e1DdDDc4837e63Bfb21EF34d3Ca4A6c78fD15","0xB9450b512Fd3454e9C1a2593C5DF9E71344b5653","0x211C9893653Aea2088E34765e7039617E95fD8fD","0x4D0D8724ff2303A1679689a9Cc8e2A62f821e0E3"]
    }
```

```diff
    contract UpgradeExecutor (0x4D0D8724ff2303A1679689a9Cc8e2A62f821e0E3) {
    +++ description: None
      assignedPermissions.admin:
-        ["0xb75A0a5812303cBB198d4f0BcA7CA38f17b8783e"]
      assignedPermissions.upgrade:
+        ["0xb75A0a5812303cBB198d4f0BcA7CA38f17b8783e"]
    }
```

Generated with discovered.json: 0x23b1b07480aa71c423e4e6160254c8664bf0c911

# Diff at Tue, 30 Jul 2024 11:17:10 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@b2b6471ff62871f4956541f42ec025c356c08f7e block: 234834723
- current block number: 234834723

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 234834723 (main branch discovery), not current.

```diff
    contract RollupProxy (0xb75A0a5812303cBB198d4f0BcA7CA38f17b8783e) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
      fieldMeta:
+        {"confirmPeriodBlocks":{"description":"Challenge period. (Number of blocks until a node is confirmed)."},"wasmModuleRoot":{"description":"Root hash of the WASM module used for execution, like a fingerprint of the L2 logic. Can be associated with ArbOS versions."}}
    }
```

```diff
    contract SequencerInbox (0xB9450b512Fd3454e9C1a2593C5DF9E71344b5653) {
    +++ description: State batches / commitments get posted here.
      fieldMeta:
+        {"maxTimeVariation":{"description":"Struct: delayBlocks, futureBlocks, delaySeconds, futureSeconds. onlyRollupOwner settable. Transactions can only be force-included after `delayBlocks` window (Sequencer-only) has passed."}}
    }
```

Generated with discovered.json: 0xd37664082f460fc8558e6d56b77f4c2fe7e01081

# Diff at Mon, 22 Jul 2024 10:10:13 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- current block number: 234834723

## Description

Initial discovery: Orbit stack L3 on Arbitrum with 1/1 DAC and EOA Admin. Prelaunch escrows (multichain) added. 

## Initial discovery

```diff
+   Status: CREATED
    contract Outbox (0x1526DAacDAf3EE81E5ae087E0DA8677E8c677CE5)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ChallengeManager (0x211C9893653Aea2088E34765e7039617E95fD8fD)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x29994207C5AeDc83F27c5dc16E468f328832d42d)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ValidatorWalletCreator (0x2b0E04Dc90e3fA58165CB41E2834B44A56E766aF)
    +++ description: None
```

```diff
+   Status: CREATED
    contract UpgradeExecutor (0x4D0D8724ff2303A1679689a9Cc8e2A62f821e0E3)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1ERC20Gateway (0x4fF3E70f30f0394Ad62428751Fe3858740595908)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProverMemory (0x526a6E634aD36bB0007c4422586c135F1F9B525a)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Bridge (0x59E088d827CB7983Cd0CC64312E472D7cc8a4F44)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ValidatorUtils (0x6c21303F5986180B1394d2C89f3e883890E2867b)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProver0 (0x800dA62bE6626127F71B34E795286C34C04D6712)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Inbox (0x80de5c4ccDfb7b6a250A9588C2d80F62a2B7d13F)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1GatewayRouter (0x817C8Da480bC6b42a5FA88A26e9eD8c0c03968Cf)
    +++ description: None
```

```diff
+   Status: CREATED
    contract  (0x82709E8564ce17707a7C8420c9e48e9a8A88bfc1)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProofEntry (0xb20107bfB36D3B5AcA534aCAfbd8857b10b402a8)
    +++ description: None
```

```diff
+   Status: CREATED
    contract RollupProxy (0xb75A0a5812303cBB198d4f0BcA7CA38f17b8783e)
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
```

```diff
+   Status: CREATED
    contract SequencerInbox (0xB9450b512Fd3454e9C1a2593C5DF9E71344b5653)
    +++ description: State batches / commitments get posted here.
```

```diff
+   Status: CREATED
    contract RollupEventInbox (0xc40e1DdDDc4837e63Bfb21EF34d3Ca4A6c78fD15)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProverHostIo (0xc555b2F1D559Fbb854569b33640990D178F94747)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProverMath (0xe8709022B9C9D7347856c75910fe07e10C904446)
    +++ description: None
```
