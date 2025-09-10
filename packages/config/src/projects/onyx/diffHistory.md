Generated with discovered.json: 0x62fc30863a8a2cff36b7baa63cd32deb8d89396e

# Diff at Wed, 10 Sep 2025 13:27:44 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- current timestamp: 1757509668

## Description

Discovery rerun on the same block number with only config-related changes.

## Initial discovery

```diff
+   Status: CREATED
    contract RollupEventInbox (base:0x0961428Ce999C15f5E2624d0bEbd9729387e8185)
    +++ description: Helper contract sending configuration data over the bridge during the systems initialization.
```

```diff
+   Status: CREATED
    contract Outbox (base:0x10e9F660ed21e662e7f3fB4a49B0Bd9B219bEf95)
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
```

```diff
+   Status: CREATED
    contract GnosisSafeL2 (base:0x133f066C470d044dB3889359fC5B542d016B5B92)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ERC20Gateway (base:0x167D43d1D60DE2320B5E143F9c6a058092A913C2)
    +++ description: Escrows deposited ERC-20 assets for the canonical Bridge. Upon depositing, a generic token representation will be minted at the destination. Withdrawals are initiated by the Outbox contract.
```

```diff
+   Status: CREATED
    contract ValidatorUtils (base:0x23264394923E4aEB990234180c37Bf757667C6f7)
    +++ description: This contract implements view only utilities for validators.
```

```diff
+   Status: CREATED
    contract GatewayRouter (base:0x3CaA4581e7bA1aF2607e0198aF4E4C208f09c98b)
    +++ description: This routing contract maps tokens to the correct escrow (gateway) to be then bridged with canonical messaging.
```

```diff
+   Status: CREATED
    contract OneStepProverHostIo (base:0x4b4fdb082b44490c9AEEd91C932c3E33AAbfF653)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract RollupProxy (base:0x50752f7988d0195d4d5fb09a1A22B8354b5A8c0b)
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
```

```diff
+   Status: CREATED
    contract ProxyAdmin (base:0x615b81747e819e0dB25c13570D5DA45Ef9bc81B3)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Conduit Multisig 3 (base:0x7dCe2FEE5e30EFf298cD3d9B92649f00EBDfc104)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Inbox (base:0x8635f49481A90DeD18E8D0eB374028C4b39E700F)
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
```

```diff
+   Status: CREATED
    contract OneStepProver0 (base:0x92329713Dc1a897D67a1C7f2a40eeeA83F5362CE)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract OneStepProverMemory (base:0xb7F0b49F09177cF8ab3aD8Cff68260DaFB079aCC)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract Bridge (base:0xcdf10130c75D42a3880Ae521734EaA8631aC2905)
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
```

```diff
+   Status: CREATED
    contract OneStepProofEntry (base:0xd2e4Cc9Ec636eC9cFE840A2cF6ca32B690fD921A)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract OneStepProverMath (base:0xD2f1C58Da62BCfaD4BeF7802B2F6363C2cbe7082)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract ChallengeManager (base:0xD513422F3eE18A6BeC8087A55da59BAd9807A2ED)
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
```

```diff
+   Status: CREATED
    contract SequencerInbox (base:0xdA2445f1cA60bC2C739A96298746aDBB6706f011)
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
```

```diff
+   Status: CREATED
    contract UpgradeExecutor (base:0xfdFBECa29FFf84A5e1e31F8572509E2C36fF4B81)
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
```
