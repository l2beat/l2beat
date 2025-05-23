Generated with discovered.json: 0x6f14078ee698bcc6e60077ececdbcdeb6feb691e

# Diff at Fri, 02 May 2025 17:25:22 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@c598e33a0c469175b7abbd6c2a13b47b63d6b6a4 block: 331092539
- current block number: 331092539

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 331092539 (main branch discovery), not current.

```diff
    contract RollupProxy (0x325Dd0279Ba31bC346BA80F3D00628deFa2EacD4) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      usedTypes.0.arg.0xaf1dbdfceb871c00bfbb1675983133df04f0ed04e89647812513c091e3a982b3:
+        "Celestia Nitro 3.3.2 wasmModuleRoot"
    }
```

Generated with discovered.json: 0x7516723f6d5a23b9376580169def7eea1660ca7e

# Diff at Tue, 29 Apr 2025 08:19:21 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@ef7477af00fe0b57a2f7cacf7e958c12494af662 block: 331092539
- current block number: 331092539

## Description

Field .issuedPermissions is removed from the output as no longer needed. Added 'permissionsConfigHash' due to refactoring of the modelling process (into a separate command).

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 331092539 (main branch discovery), not current.

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

Generated with discovered.json: 0xab1dee4a2df5dda02e026acc8d97f0abb7c07227

# Diff at Mon, 28 Apr 2025 12:18:11 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@640aad31846aa48203969768d234f58dfd9896e5 block: 322777194
- current block number: 331092539

## Description

Minor Arbitrum upgrade [3.1.0](https://github.com/OffchainLabs/nitro-contracts/releases/tag/v3.1.0) that everyone is doing atm.

## Watched changes

```diff
    contract Inbox (0x2EAf07A964c6601c4fAefd6D8969DF0B84f65e55) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      sourceHashes.0:
-        "0x086015cafdc216efb33a7f807a00f5a4754faaa6ba74a8f21e0f4601ae8e198b"
+        "0x84cd273689e720a0b7c657b57d9fb127684f3abb87fc4b337a2f0decd9464120"
      values.$implementation:
-        "0xD2ed924DC094abBE7ea47D872C2a8625A803c2c8"
+        "0x6C6cf18f13C3e9b969e3acE6b8F21DfF95d4D447"
      values.$pastUpgrades.1:
+        ["2025-04-25T21:55:46.000Z","0xb219997f52a5ffaeb50fb6de4b69cefdd4f1844879a102820ce0878df63bc80b",["0x6C6cf18f13C3e9b969e3acE6b8F21DfF95d4D447"]]
      values.$upgradeCount:
-        1
+        2
    }
```

```diff
    contract SequencerInbox (0xe0064A9fb8e45BfD8e5aB1cE7523888814A096E0) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      sourceHashes.0:
-        "0x50cf57b01499408fa99da27cf0fee96ec30f0d40667d1aa090c442bc80f0636b"
+        "0x6bb86ac4bd0d31e049f543fcf0a8f94c952252222f115246ef9d5b8104d803cc"
      values.$implementation:
-        "0xb4b1389DaC96eA8681D7e8aC479F3a9E7eD14766"
+        "0x066a4D939302470Bd83F1868A1Ae2485Fe75ccF2"
      values.$pastUpgrades.1:
+        ["2024-09-06T17:37:00.000Z","0xefcb1edf464c3c7aadfa482d49e0f4398846f219229bb62017e6589619a83c99",["0xb4b1389DaC96eA8681D7e8aC479F3a9E7eD14766"]]
      values.$pastUpgrades.0.2:
-        ["0xb4b1389DaC96eA8681D7e8aC479F3a9E7eD14766"]
+        "0xb219997f52a5ffaeb50fb6de4b69cefdd4f1844879a102820ce0878df63bc80b"
      values.$pastUpgrades.0.1:
-        "2024-09-06T17:37:00.000Z"
+        ["0x066a4D939302470Bd83F1868A1Ae2485Fe75ccF2"]
      values.$pastUpgrades.0.0:
-        "0xefcb1edf464c3c7aadfa482d49e0f4398846f219229bb62017e6589619a83c99"
+        "2025-04-25T21:55:46.000Z"
      values.$upgradeCount:
-        1
+        2
    }
```

## Source code changes

```diff
.../{.flat@322777194 => .flat}/Inbox/Inbox.sol     | 19 +++++++++++++++--
 .../SequencerInbox/SequencerInbox.sol              | 24 +++++++++++++++-------
 2 files changed, 34 insertions(+), 9 deletions(-)
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
