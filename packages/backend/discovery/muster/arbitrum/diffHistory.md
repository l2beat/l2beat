Generated with discovered.json: 0x3045a66e02138f41fe484915d98e2223fb801650

# Diff at Mon, 02 Dec 2024 15:21:12 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- current block number: 280604955

## Description

Initial discovery of a standard orbit stack L3 with EOA admin.

## Initial discovery

```diff
+   Status: CREATED
    contract UpgradeExecutor (0x10083F68A4aEC72c567661616bd6036D3a6d1B36)
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
```

```diff
+   Status: CREATED
    contract OneStepProver0 (0x1135265fE014D3FA32B3507E325642B92aFFeAEb)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract Inbox (0x18BB8310E3a3DF4EFcCb6B3E9AeCB8bE6d4af07f)
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x37119EAcFBc1c83DDAf80F6705b6B19630C101C4)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProverMath (0x4811500e0d376Fa8d2EA3CCb7c61E0afB4F5A7f1)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract ValidatorUtils (0x6c21303F5986180B1394d2C89f3e883890E2867b)
    +++ description: None
```

```diff
+   Status: CREATED
    contract RollupProxy (0x73CA76d9B04661604fF950fB8DBc9f18F1B853f1)
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
```

```diff
+   Status: CREATED
    contract RollupEventInbox (0x8987777757a91Ed09912D7A5B8430bbAC2cf153C)
    +++ description: Helper contract sending configuration data over the bridge during the systems initialization.
```

```diff
+   Status: CREATED
    contract OneStepProverHostIo (0x89AF7C4C2198c426cFe6E86de0680A0850503e06)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract OneStepProofEntry (0x99a2A31300816C1FA3f40818AC9280fe7271F878)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract Bridge (0xB0EC3C1368AF7d9C2CAE6B7f8E022Cc14d59D2b1)
    +++ description: Escrow contract for the project's gas token (Can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
```

```diff
+   Status: CREATED
    contract Outbox (0xD17550876106645988051ffDd31dFc3cDaA29F9c)
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
```

```diff
+   Status: CREATED
    contract OneStepProverMemory (0xDf94F0474F205D086dbc2e66D69a856FCf520622)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract ChallengeManager (0xE8c7770db364e57b2A4f5344d51b7f490aE9163A)
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
```

```diff
+   Status: CREATED
    contract SequencerInbox (0xfb27e42E964F3364630F76D62EB295ae792BD4FA)
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
```
