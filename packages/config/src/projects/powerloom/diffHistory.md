Generated with discovered.json: 0xeeb74e4c392882cebf0cc7dd21e337215d520dd4

# Diff at Thu, 11 Sep 2025 11:02:30 GMT:

- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@665b233e3787b7a0fd24453d6e587ffdc2c1541d block: 1757506676
- current timestamp: 1757506676

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1757506676 (main branch discovery), not current.

```diff
    contract RollupProxy (eth:0x9f3dC4D1f6c6D9F2273d8b497E460E6E727210e8) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      usedTypes.0.arg.0x597de35fc2ee60e5b2840157370d037542d6a4bc587af7f88202636c54e6bd8d:
+        "Celestia Nitro ArbOS v40 wasmModuleRoot"
    }
```

Generated with discovered.json: 0x1a6c3ea30b47595f4f3bb14009908947e1857645

# Diff at Wed, 10 Sep 2025 12:26:42 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- current timestamp: 1757506676

## Description

Initial discovery.

## Initial discovery

```diff
+   Status: CREATED
    contract RollupEventInbox (eth:0x02f3a60D25abF1844740a39cd9679227309a1Fa6)
    +++ description: Helper contract sending configuration data over the bridge during the systems initialization.
```

```diff
+   Status: CREATED
    contract OneStepProverMath (eth:0x036147913eEb42E97790F9a693246c8444290AB6)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract ChallengeManager (eth:0x0B5BbEedB3E8bc9a2352fFa0aED56b6fad8d3040)
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
```

```diff
+   Status: CREATED
    contract OneStepProverMemory (eth:0x21c6F81b1063f09A6c26EDc74fBb9beb349A5E96)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract OneStepProverHostIo (eth:0x231173CC90cB8486A7dbD1733B5105254316D50A)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract L1OrbitUSDCGateway (eth:0x23593421341152D5322F8869c0638DAAc4aED57C)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyAdmin (eth:0x256bBeDabDBa636a9Cd17890841C941a28e9437e)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyAdmin (eth:0x2A7F4d60fE6dD63c4690Dd9f11C26D0BE53b3110)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Conduit Multisig 1 (eth:0x4a4962275DF8C60a80d3a25faEc5AA7De116A746)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Bridge (eth:0x53b168016aA2E3469B5D76315311aAC4Ce0020DB)
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
```

```diff
+   Status: CREATED
    contract UpgradeExecutor (eth:0x6a23390d8a086c1091188f8Db702E91DCA38805F)
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
```

```diff
+   Status: CREATED
    contract OneStepProver0 (eth:0x72b55c2C38EadE57C10047746632A369A060A46E)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract Inbox (eth:0x7d4509336b154C17Df80D03A19C051ddAcdA2e7f)
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
```

```diff
+   Status: CREATED
    contract ValidatorUtils (eth:0x84eA2523b271029FFAeB58fc6E6F1435a280db44)
    +++ description: This contract implements view only utilities for validators.
```

```diff
+   Status: CREATED
    contract SequencerInbox (eth:0x903Af716AA8C7C27Fd785F453D5a59C20E06bDeC)
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
```

```diff
+   Status: CREATED
    contract RollupProxy (eth:0x9f3dC4D1f6c6D9F2273d8b497E460E6E727210e8)
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
```

```diff
+   Status: CREATED
    contract OneStepProofEntry (eth:0x9f403f2054736884518E6D3f510C02f5959BDCC6)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract GnosisSafeL2 (eth:0xA7A2cc389aFCcDE8A1F47F14dA88e82e7D99b68F)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Outbox (eth:0xc0dd0a059a8a948B7737D00bfC9024475C791259)
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
```
