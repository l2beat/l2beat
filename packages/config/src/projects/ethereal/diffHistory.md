Generated with discovered.json: 0x444c98f4f764101e0f29e8c13f7612646c3fef4a

# Diff at Wed, 22 Oct 2025 15:25:06 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- current timestamp: 1761144638

## Description

standard v41 (wasmroot) orbit stack with custom outbox that can sweep native tokens from the escrow.

the wasmroot is not yet resolved because that would require global disco refresh.

## Initial discovery

```diff
+   Status: CREATED
    contract OneStepProverHostIo (arb1:0x0446E34D1cC4eBA5F336627BaAe82332c8607043)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract ChallengeManager (arb1:0x04f8FF8aC0Bf00a70D5780F9Ee0c3bD01296ba0E)
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
```

```diff
+   Status: CREATED
    contract ValidatorUtils (arb1:0x08Ca9925b88c54100568c8d41eFAF8Fecc695d3a)
    +++ description: This contract implements view only utilities for validators.
```

```diff
+   Status: CREATED
    contract SequencerInbox (arb1:0x0E2480384E3703FDf84c7A0448658E8C7543b3a8)
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
```

```diff
+   Status: CREATED
    contract OneStepProofEntry (arb1:0x23264394923E4aEB990234180c37Bf757667C6f7)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract SafeL2 (arb1:0x33Fbf4E75d54bBec0e432B6dc27bDEa0ca5DEdf9)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ERC20MigrationOutbox (arb1:0x3515ad5D3D904Cb2731A7d6E5DB9f35D6CAFEB14)
    +++ description: Simple contract that, if set as allowedOutbox in the arb1:0xd86f5ad3fa5becbB07e565DbD4b70DBd817A43A8, allows to sweep all native tokens from the escrow to arb1:0x33Fbf4E75d54bBec0e432B6dc27bDEa0ca5DEdf9.
```

```diff
+   Status: CREATED
    contract OneStepProverMemory (arb1:0x4012CF2dce28079c8F7f92CecB2E494F4AcB9351)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract OneStepProverMath (arb1:0x461bDAfaaba542C6eCcEa882BdF85542Ed7158C5)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract Inbox (arb1:0x574b121c469583c3a46cd88bBCC9Ac5c8C907d06)
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
```

```diff
+   Status: CREATED
    contract RollupEventInbox (arb1:0x5D6bec85F093Eb49bD6913aCe7e9A081c41aed8F)
    +++ description: Helper contract sending configuration data over the bridge during the systems initialization.
```

```diff
+   Status: CREATED
    contract RollupProxy (arb1:0x63a751E0564eAb8B225F1922888b4F08d7d33561)
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
```

```diff
+   Status: CREATED
    contract Conduit Multisig 2 (arb1:0x79C2abE3eBA9dc119318FdAaA48118e1CDB53F56)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProver0 (arb1:0x91F12800C6b5b4e7d88fE785558213F8EF3F4586)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract Outbox (arb1:0xA2A5DCA414e3AaBD48B9CA97426f7e3Fba967492)
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
```

```diff
+   Status: CREATED
    contract ProxyAdmin (arb1:0xc1136ea5F91f82cb468Fc7650579A95605D9f5C2)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Bridge (arb1:0xd86f5ad3fa5becbB07e565DbD4b70DBd817A43A8)
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
```

```diff
+   Status: CREATED
    contract UpgradeExecutor (arb1:0xDde7f92D0f2225f5951564D387e158b9b57f95F3)
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
```
