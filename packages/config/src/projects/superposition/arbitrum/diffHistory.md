Generated with discovered.json: 0x960ca484a32f5caf429d6c164657b4de13869740

# Diff at Mon, 28 Apr 2025 12:05:10 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@640aad31846aa48203969768d234f58dfd9896e5 block: 322777194
- current block number: 322777194

## Description

Field .issuedPermissions is removed from the output as no longer needed. Added 'permissionsConfigHash' due to refactoring of the modelling process (into a separate command).

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 322777194 (main branch discovery), not current.

```diff
    contract Inbox (0x2EAf07A964c6601c4fAefd6D8969DF0B84f65e55) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x79C2abE3eBA9dc119318FdAaA48118e1CDB53F56","via":[{"address":"0x458B2e28fb08258ef5Fdc11a4De5289A04A5eCf8"},{"address":"0x83a4d6f7aEcBb9eABd3733b610b58403dc29910E"}]}]
    }
```

```diff
    contract RollupEventInbox (0x31F535A566FE1Ef994858cf4D97b1207fC7388A8) {
    +++ description: Helper contract sending configuration data over the bridge during the systems initialization.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x79C2abE3eBA9dc119318FdAaA48118e1CDB53F56","via":[{"address":"0x458B2e28fb08258ef5Fdc11a4De5289A04A5eCf8"},{"address":"0x83a4d6f7aEcBb9eABd3733b610b58403dc29910E"}]}]
    }
```

```diff
    contract RollupProxy (0x325Dd0279Ba31bC346BA80F3D00628deFa2EacD4) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      issuedPermissions:
-        [{"permission":"fastconfirm","to":"0x8eA8BaebDC5B88d9977aa8232a41667C8A72C33B","description":"Can finalize a state root before the challenge period has passed. This allows withdrawing from the bridge based on the state root.","via":[{"address":"0x1B2B1Eb3e4b24903BeEbcAEDdCee5A953f79Fa43"}]},{"permission":"interact","to":"0x79C2abE3eBA9dc119318FdAaA48118e1CDB53F56","description":"Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes.","via":[{"address":"0x458B2e28fb08258ef5Fdc11a4De5289A04A5eCf8"}]},{"permission":"upgrade","to":"0x79C2abE3eBA9dc119318FdAaA48118e1CDB53F56","via":[{"address":"0x458B2e28fb08258ef5Fdc11a4De5289A04A5eCf8"}]},{"permission":"validate","to":"0x8eA8BaebDC5B88d9977aa8232a41667C8A72C33B","description":"Can propose new state roots (called nodes) and challenge state roots on the host chain.","via":[]},{"permission":"validate","to":"0x8eA8BaebDC5B88d9977aa8232a41667C8A72C33B","description":"Can propose new state roots (called nodes) and challenge state roots on the host chain.","via":[{"address":"0x1B2B1Eb3e4b24903BeEbcAEDdCee5A953f79Fa43"}]}]
    }
```

```diff
    contract UpgradeExecutor (0x458B2e28fb08258ef5Fdc11a4De5289A04A5eCf8) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x79C2abE3eBA9dc119318FdAaA48118e1CDB53F56","via":[{"address":"0x458B2e28fb08258ef5Fdc11a4De5289A04A5eCf8"},{"address":"0x83a4d6f7aEcBb9eABd3733b610b58403dc29910E"}]}]
    }
```

```diff
    contract ERC20Gateway (0x62bEd4b862254789825Cd6F2352aa2b76B16145e) {
    +++ description: Escrows deposited ERC-20 assets for the canonical Bridge. Upon depositing, a generic token representation will be minted at the destination. Withdrawals are initiated by the Outbox contract.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x79C2abE3eBA9dc119318FdAaA48118e1CDB53F56","via":[{"address":"0x458B2e28fb08258ef5Fdc11a4De5289A04A5eCf8"},{"address":"0x83a4d6f7aEcBb9eABd3733b610b58403dc29910E"}]}]
    }
```

```diff
    contract ChallengeManager (0x665ADB1fF9D9C7535cf6A72d58c3Bc25F32D841d) {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x79C2abE3eBA9dc119318FdAaA48118e1CDB53F56","via":[{"address":"0x458B2e28fb08258ef5Fdc11a4De5289A04A5eCf8"},{"address":"0x83a4d6f7aEcBb9eABd3733b610b58403dc29910E"}]}]
    }
```

```diff
    contract GatewayRouter (0x9FE42A08751E8566A0918807bF2870594bf22806) {
    +++ description: This routing contract maps tokens to the correct escrow (gateway) to be then bridged with canonical messaging.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x79C2abE3eBA9dc119318FdAaA48118e1CDB53F56","via":[{"address":"0x458B2e28fb08258ef5Fdc11a4De5289A04A5eCf8"},{"address":"0x83a4d6f7aEcBb9eABd3733b610b58403dc29910E"}]}]
    }
```

```diff
    contract Outbox (0xa4b3B4D5f7976a8D283864ea83f1Bb3D815b1798) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x79C2abE3eBA9dc119318FdAaA48118e1CDB53F56","via":[{"address":"0x458B2e28fb08258ef5Fdc11a4De5289A04A5eCf8"},{"address":"0x83a4d6f7aEcBb9eABd3733b610b58403dc29910E"}]}]
    }
```

```diff
    contract SequencerInbox (0xe0064A9fb8e45BfD8e5aB1cE7523888814A096E0) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      issuedPermissions:
-        [{"permission":"sequence","to":"0x583e2c664c868611a6e3F1D6dcbc8aA00DE43a7f","description":"Can submit transaction batches or commitments to the SequencerInbox contract on the host chain.","via":[]},{"permission":"upgrade","to":"0x79C2abE3eBA9dc119318FdAaA48118e1CDB53F56","via":[{"address":"0x458B2e28fb08258ef5Fdc11a4De5289A04A5eCf8"},{"address":"0x83a4d6f7aEcBb9eABd3733b610b58403dc29910E"}]}]
    }
```

```diff
    contract Bridge (0xEca0fEB4aA6112a3923823559e7197294Bc49CC7) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x79C2abE3eBA9dc119318FdAaA48118e1CDB53F56","via":[{"address":"0x458B2e28fb08258ef5Fdc11a4De5289A04A5eCf8"},{"address":"0x83a4d6f7aEcBb9eABd3733b610b58403dc29910E"}]}]
    }
```

Generated with discovered.json: 0x462c9c0c8a892133544e4ce2f7dc48b55e1f6019

# Diff at Fri, 04 Apr 2025 08:55:32 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- current block number: 322777194

## Description

Initial discovery of a standard AnyTrust L3 on Arbitrum (Conduit).

## Initial discovery

```diff
+   Status: CREATED
    contract OneStepProverHostIo (0x0446E34D1cC4eBA5F336627BaAe82332c8607043)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract ValidatorUtils (0x08Ca9925b88c54100568c8d41eFAF8Fecc695d3a)
    +++ description: This contract implements view only utilities for validators.
```

```diff
+   Status: CREATED
    contract Superposition Multisig (0x1B2B1Eb3e4b24903BeEbcAEDdCee5A953f79Fa43)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProofEntry (0x23264394923E4aEB990234180c37Bf757667C6f7)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract Inbox (0x2EAf07A964c6601c4fAefd6D8969DF0B84f65e55)
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
```

```diff
+   Status: CREATED
    contract RollupEventInbox (0x31F535A566FE1Ef994858cf4D97b1207fC7388A8)
    +++ description: Helper contract sending configuration data over the bridge during the systems initialization.
```

```diff
+   Status: CREATED
    contract RollupProxy (0x325Dd0279Ba31bC346BA80F3D00628deFa2EacD4)
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
```

```diff
+   Status: CREATED
    contract OneStepProverMemory (0x4012CF2dce28079c8F7f92CecB2E494F4AcB9351)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract UpgradeExecutor (0x458B2e28fb08258ef5Fdc11a4De5289A04A5eCf8)
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
```

```diff
+   Status: CREATED
    contract OneStepProverMath (0x461bDAfaaba542C6eCcEa882BdF85542Ed7158C5)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract ERC20Gateway (0x62bEd4b862254789825Cd6F2352aa2b76B16145e)
    +++ description: Escrows deposited ERC-20 assets for the canonical Bridge. Upon depositing, a generic token representation will be minted at the destination. Withdrawals are initiated by the Outbox contract.
```

```diff
+   Status: CREATED
    contract ChallengeManager (0x665ADB1fF9D9C7535cf6A72d58c3Bc25F32D841d)
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
```

```diff
+   Status: CREATED
    contract Conduit Multisig 2 (0x79C2abE3eBA9dc119318FdAaA48118e1CDB53F56)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x83a4d6f7aEcBb9eABd3733b610b58403dc29910E)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProver0 (0x91F12800C6b5b4e7d88fE785558213F8EF3F4586)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract GatewayRouter (0x9FE42A08751E8566A0918807bF2870594bf22806)
    +++ description: This routing contract maps tokens to the correct escrow (gateway) to be then bridged with canonical messaging.
```

```diff
+   Status: CREATED
    contract Outbox (0xa4b3B4D5f7976a8D283864ea83f1Bb3D815b1798)
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
```

```diff
+   Status: CREATED
    contract SequencerInbox (0xe0064A9fb8e45BfD8e5aB1cE7523888814A096E0)
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
```

```diff
+   Status: CREATED
    contract Bridge (0xEca0fEB4aA6112a3923823559e7197294Bc49CC7)
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
```
