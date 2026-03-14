Generated with discovered.json: 0xc9e0f5476cf07c3634e48bdedbe86e65ce495b0e

# Diff at Thu, 12 Mar 2026 14:25:33 GMT:

- author: vincfurc (<vincfurc@users.noreply.github.com>)
- current timestamp: 1773325467

## Description

Initial discovery of Edge Chain, an Arbitrum Orbit L3 (AnyTrust) by EdgeX.

## Initial discovery

```diff
+   Status: CREATED
    contract OneStepProverMemory (arb1:0x09fDA6447fA7758EA9245ac78Ca3c9ba68CBfd3d)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract ERC20Gateway (arb1:0x107695630130919cb040B095b9b20511D6e211bB)
    +++ description: Escrows deposited ERC-20 assets for the canonical Bridge. Upon depositing, a generic token representation will be minted at the destination. Withdrawals are initiated by the Outbox contract.
```

```diff
+   Status: CREATED
    contract RollupProxy (arb1:0x14FdC47483e79d5A76599a74A2D622DA1cf97BBF)
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
```

```diff
+   Status: CREATED
    contract GatewayRouter (arb1:0x3616995dF5D07B28f2B186F1386cace9EB9Bbd20)
    +++ description: This routing contract maps tokens to the correct escrow (gateway) to be then bridged with canonical messaging.
```

```diff
+   Status: CREATED
    contract OneStepProverHostIo (arb1:0x3930AD9a21dA38E63d52B43b0c530CB0AACcB389)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract GnosisSafeL2 (arb1:0x42124A2E725E6458701b8Ef46B78Db55827fA836)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Bridge (arb1:0x6F4836aFD5e21EDcee9b838C5a4125829EC198d0)
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
```

```diff
+   Status: CREATED
    contract ProxyAdmin (arb1:0x8420251362dA42f5Be2285B2DEa2f20D16332fE6)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SafeL2 (arb1:0x871e290d5447b958131F6d44f915F10032436ee6)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Outbox (arb1:0x9f427c80C4DF962726808d4c876fc2c55474a764)
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
```

```diff
+   Status: CREATED
    contract ValidatorUtils (arb1:0xa0d6E6b1B950aCC748B45F3419FeAd4b52f7389A)
    +++ description: This contract implements view only utilities for validators.
```

```diff
+   Status: CREATED
    contract OneStepProofEntry (arb1:0xA6D1cE7210353E431CE79f41BcFA9Ea3Ae507b98)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract UpgradeExecutor (arb1:0xabf2650D259213d6b3E1bC46Fc1eDb7405d48Fdf)
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
```

```diff
+   Status: CREATED
    contract ChallengeManager (arb1:0xACAec98D879E39d83a30F914A36bf4877424D04f)
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
```

```diff
+   Status: CREATED
    contract OneStepProverMath (arb1:0xD3dE403eADdf791104918E9C9336B434AE7DDA01)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract RollupEventInbox (arb1:0xdA3102d2f80CaD9571a9Eb3656e808e973620dBD)
    +++ description: Helper contract sending configuration data over the bridge during the systems initialization.
```

```diff
+   Status: CREATED
    contract GnosisSafeL2 (arb1:0xDbB10Cdb2F0611C311E7D7057794a690E7872005)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SequencerInbox (arb1:0xe44B83D8a3A86994043C809E29B723a44FAEE479)
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
```

```diff
+   Status: CREATED
    contract Inbox (arb1:0xeB88b89e085D6B747Dd6b9CEaf2716bdd89F1E7c)
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
```

```diff
+   Status: CREATED
    contract OneStepProver0 (arb1:0xF5f5bc097ca8f4bE96D8CdE86c96Bd2d81fd2585)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```
