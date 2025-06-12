Generated with discovered.json: 0x967b0598fe09473e223b4a474529acf780a8ebe4

# Diff at Thu, 12 Jun 2025 07:48:43 GMT:

- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- current block number: 22687092

## Description

Initial discovery.

## Initial discovery

```diff
+   Status: CREATED
    contract OneStepProofEntry (0x0537c93dA3b1f8A525204165d1d93De0534c262f)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract Bridge (0x35381f63091926750F43b2A7401B083263aDEF83)
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
```

```diff
+   Status: CREATED
    contract RollupProxy (0x35c60Cc77b0A8bf6F938B11bd3E9D319a876c2aC)
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
```

```diff
+   Status: CREATED
    contract Conduit Multisig 1 (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProver0 (0x6982e35C878cD2b5aF8Dcf06f33c4EfB01D6f482)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract Outbox (0x7e4627bC114Fcd12ba912103279FD2858E644E71)
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
```

```diff
+   Status: CREATED
    contract ValidatorUtils (0x84eA2523b271029FFAeB58fc6E6F1435a280db44)
    +++ description: This contract implements view only utilities for validators.
```

```diff
+   Status: CREATED
    contract OneStepProverHostIo (0x856EA788977Bc771E8Ca87471baeC507A0f54771)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine. This version uses the Blobstream DA bridge (0x7Cf3876F681Dbb6EdA8f6FfC45D66B996Df08fAe) as source of truth for the DA referenced by the fault proof.
```

```diff
+   Status: CREATED
    contract SequencerInbox (0x85eC1b9138a8b9659A51e2b51bb0861901040b59)
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
```

```diff
+   Status: CREATED
    contract ChallengeManager (0x8c66A25752e70D6BD6b4090D2E31ca37cf77caE6)
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
```

```diff
+   Status: CREATED
    contract Inbox (0x943fc691242291B74B105e8D19bd9E5DC2fcBa1D)
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
```

```diff
+   Status: CREATED
    contract OneStepProverMath (0x9c40D14A2FC3f0A2f5fe804436f8e312224472C5)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0xb90fe445014e74eA5aA7681291212bfEa37031CC)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProverMemory (0xcaBf38d8eADdE0BC6C91655242AFB4Da92a63FCe)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract UpgradeExecutor (0xd688dabDBb14D673898689135a23a174560c8C04)
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
```

```diff
+   Status: CREATED
    contract RollupEventInbox (0xf576102530749344D2f4C04D15C2B8609c7897ea)
    +++ description: Helper contract sending configuration data over the bridge during the systems initialization.
```
