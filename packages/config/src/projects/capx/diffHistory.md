Generated with discovered.json: 0xc7644f9c3895ad52d8d11ef67017d1e1a1d3147f

# Diff at Fri, 19 Dec 2025 11:14:43 GMT:

- author: vincfurc (<vincfurc@users.noreply.github.com>)
- current timestamp: 1766142818

## Description

Discovery rerun on the same block number with only config-related changes.

## Initial discovery

```diff
+   Status: CREATED
    contract Caldera Multisig 3 (eth:0x2bf43034b9559643e986A2fE3cE015a18247b904)
    +++ description: None
```

```diff
+   Status: CREATED
    contract RollupProxy (eth:0x4967284E726eC01b26cc33c09486C0C2C0C35Efa)
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
```

```diff
+   Status: CREATED
    contract ValidatorUtils (eth:0x59E12ED1f3944A6f7aabA9Bd60b51ca5A082D10d)
    +++ description: This contract implements view only utilities for validators.
```

```diff
+   Status: CREATED
    contract OneStepProver0 (eth:0x5dcD904cea14Aa19f09A8279C9c39a447970005a)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract RollupEventInbox (eth:0x69Af72D5dc7D59DF2164E07dEBba95e6f720f69f)
    +++ description: Helper contract sending configuration data over the bridge during the systems initialization.
```

```diff
+   Status: CREATED
    contract OneStepProofEntry (eth:0x7811670b42d6e6C7E430F5d4B2097D6832E0B153)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract UpgradeExecutor (eth:0x7EA78566fD17a324460d02A74d0054186A0D8966)
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
```

```diff
+   Status: CREATED
    contract OneStepProverMemory (eth:0x81fc46411C903d8c82216d2702b8F5a17B658da3)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract Inbox (eth:0x89AB6919680c66C60968B9c5f0614fC09Aab7EE1)
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
```

```diff
+   Status: CREATED
    contract OneStepProverHostIo (eth:0x8c65B044283d6423E9a4359AD79d711f9930f948)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract Bridge (eth:0xAAAA894f556D0eE585773190114CED3d491C0F72)
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
```

```diff
+   Status: CREATED
    contract ProxyAdmin (eth:0xCEe383Aa9287D349aa965DF9Ed6e0B582970B2c3)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProverMath (eth:0xD3483861e9217E20eC766E3171B58b5202859aDF)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract SequencerInbox (eth:0xdF41d94e28AA0bB35471225121BDBA710DdaF068)
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
```

```diff
+   Status: CREATED
    contract ChallengeManager (eth:0xe34ab1e33cfc114ede16212CaB41D64a379d6619)
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
```

```diff
+   Status: CREATED
    contract Outbox (eth:0xEf06DEbcD295ACc3E65de85a741FA192565C3df2)
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
```
