Generated with discovered.json: 0xe898469cb74cf4a30e82db13b54cdb104f475d20

# Diff at Fri, 02 May 2025 17:25:18 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@c598e33a0c469175b7abbd6c2a13b47b63d6b6a4 block: 331093646
- current block number: 331093646

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 331093646 (main branch discovery), not current.

```diff
    contract RollupProxy (0x60DAdF13101C66F14C958E9141498b0C0eaE0773) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      usedTypes.0.arg.0xaf1dbdfceb871c00bfbb1675983133df04f0ed04e89647812513c091e3a982b3:
+        "Celestia Nitro 3.3.2 wasmModuleRoot"
    }
```

Generated with discovered.json: 0x744d7b474e3fad3714db8ec3e3666afbd4275fd8

# Diff at Tue, 29 Apr 2025 08:19:20 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@ef7477af00fe0b57a2f7cacf7e958c12494af662 block: 331093646
- current block number: 331093646

## Description

Field .issuedPermissions is removed from the output as no longer needed. Added 'permissionsConfigHash' due to refactoring of the modelling process (into a separate command).

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 331093646 (main branch discovery), not current.

```diff
    contract Bridge (0x20aD3d835e152F25Bf8c7B6fbC31adD32393559e) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x79C2abE3eBA9dc119318FdAaA48118e1CDB53F56","via":[{"address":"0x8b2600BA65E7908D38Af906fbcafB2f62D395765"},{"address":"0xd12478d6edD1db996313E2F4350F2FD99c118B6E"}]}]
    }
```

```diff
    contract L1OrbitUSDCGateway (0x404922a9B29b4a5205a6074AbA31A7392BD28944) {
    +++ description: Orbit stack specific escrow (gateway) for Circle USDC that uses the canonical bridge for messaging but is governed externally.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0xD8B4a1Ab4c079C267f8bb4239cE5AE2627D07176","via":[{"address":"0x401eCb1D350407f13ba348573E5630B83638E30D"}]}]
    }
```

```diff
    contract RollupEventInbox (0x4066F7e44B76Cd4b745C7c8913F21A19a32044a1) {
    +++ description: Helper contract sending configuration data over the bridge during the systems initialization.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x79C2abE3eBA9dc119318FdAaA48118e1CDB53F56","via":[{"address":"0x8b2600BA65E7908D38Af906fbcafB2f62D395765"},{"address":"0xd12478d6edD1db996313E2F4350F2FD99c118B6E"}]}]
    }
```

```diff
    contract SequencerInbox (0x4cFe930c5B2F03Cf81B44D2e62297beb79222B68) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      issuedPermissions:
-        [{"permission":"sequence","to":"0xe5cf545d399B2a47Ef1f9b7619FB92e270220F8A","description":"Can submit transaction batches or commitments to the SequencerInbox contract on the host chain.","via":[]},{"permission":"upgrade","to":"0x79C2abE3eBA9dc119318FdAaA48118e1CDB53F56","via":[{"address":"0x8b2600BA65E7908D38Af906fbcafB2f62D395765"},{"address":"0xd12478d6edD1db996313E2F4350F2FD99c118B6E"}]}]
    }
```

```diff
    contract RollupProxy (0x60DAdF13101C66F14C958E9141498b0C0eaE0773) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      issuedPermissions:
-        [{"permission":"fastconfirm","to":"0x99f4EFAee70C9576f82c542E0Fe8B563e184Efb0","description":"Can finalize a state root before the challenge period has passed. This allows withdrawing from the bridge based on the state root.","via":[{"address":"0x1a8902780F37e0526788198Dee30b8375A0B24Bc"}]},{"permission":"interact","to":"0x79C2abE3eBA9dc119318FdAaA48118e1CDB53F56","description":"Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes.","via":[{"address":"0x8b2600BA65E7908D38Af906fbcafB2f62D395765"}]},{"permission":"upgrade","to":"0x79C2abE3eBA9dc119318FdAaA48118e1CDB53F56","via":[{"address":"0x8b2600BA65E7908D38Af906fbcafB2f62D395765"}]},{"permission":"validate","to":"0x99f4EFAee70C9576f82c542E0Fe8B563e184Efb0","description":"Can propose new state roots (called nodes) and challenge state roots on the host chain.","via":[]},{"permission":"validate","to":"0x99f4EFAee70C9576f82c542E0Fe8B563e184Efb0","description":"Can propose new state roots (called nodes) and challenge state roots on the host chain.","via":[{"address":"0x1a8902780F37e0526788198Dee30b8375A0B24Bc"}]}]
    }
```

```diff
    contract GatewayRouter (0x8098247EE48ee54ADD4Feda2F93b3bA0d014d4c7) {
    +++ description: This routing contract maps tokens to the correct escrow (gateway) to be then bridged with canonical messaging.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x79C2abE3eBA9dc119318FdAaA48118e1CDB53F56","via":[{"address":"0x8b2600BA65E7908D38Af906fbcafB2f62D395765"},{"address":"0xd12478d6edD1db996313E2F4350F2FD99c118B6E"}]}]
    }
```

```diff
    contract ChallengeManager (0x832CF28be3042b6F60D7225E393E924D7f0936F6) {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x79C2abE3eBA9dc119318FdAaA48118e1CDB53F56","via":[{"address":"0x8b2600BA65E7908D38Af906fbcafB2f62D395765"},{"address":"0xd12478d6edD1db996313E2F4350F2FD99c118B6E"}]}]
    }
```

```diff
    contract UpgradeExecutor (0x8b2600BA65E7908D38Af906fbcafB2f62D395765) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x79C2abE3eBA9dc119318FdAaA48118e1CDB53F56","via":[{"address":"0x8b2600BA65E7908D38Af906fbcafB2f62D395765"},{"address":"0xd12478d6edD1db996313E2F4350F2FD99c118B6E"}]}]
    }
```

```diff
    contract Inbox (0xB1146A7eb098ECF46e8AAf695f4A960A963948d6) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x79C2abE3eBA9dc119318FdAaA48118e1CDB53F56","via":[{"address":"0x8b2600BA65E7908D38Af906fbcafB2f62D395765"},{"address":"0xd12478d6edD1db996313E2F4350F2FD99c118B6E"}]}]
    }
```

```diff
    contract ERC20Gateway (0xe41363751bd1C305384375F428585C20e3dF516A) {
    +++ description: Escrows deposited ERC-20 assets for the canonical Bridge. Upon depositing, a generic token representation will be minted at the destination. Withdrawals are initiated by the Outbox contract.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x79C2abE3eBA9dc119318FdAaA48118e1CDB53F56","via":[{"address":"0x8b2600BA65E7908D38Af906fbcafB2f62D395765"},{"address":"0xd12478d6edD1db996313E2F4350F2FD99c118B6E"}]}]
    }
```

```diff
    contract Outbox (0xfbe537816d181888fAbE52338a5D921eE131E9Db) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x79C2abE3eBA9dc119318FdAaA48118e1CDB53F56","via":[{"address":"0x8b2600BA65E7908D38Af906fbcafB2f62D395765"},{"address":"0xd12478d6edD1db996313E2F4350F2FD99c118B6E"}]}]
    }
```

Generated with discovered.json: 0xb2b394853a1be0b6ba3f763d134813f3bb8410d7

# Diff at Mon, 28 Apr 2025 12:22:50 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@640aad31846aa48203969768d234f58dfd9896e5 block: 315644612
- current block number: 331093646

## Description

Minor Arbitrum upgrade [3.1.0](https://github.com/OffchainLabs/nitro-contracts/releases/tag/v3.1.0) that everyone is doing atm.

## Watched changes

```diff
    contract SequencerInbox (0x4cFe930c5B2F03Cf81B44D2e62297beb79222B68) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      sourceHashes.0:
-        "0x50cf57b01499408fa99da27cf0fee96ec30f0d40667d1aa090c442bc80f0636b"
+        "0x6bb86ac4bd0d31e049f543fcf0a8f94c952252222f115246ef9d5b8104d803cc"
      values.$implementation:
-        "0xb7F0b49F09177cF8ab3aD8Cff68260DaFB079aCC"
+        "0x7be08B013de2b23a6329De51C4994f841dcE1a10"
      values.$pastUpgrades.1:
+        ["2024-10-10T10:37:46.000Z","0xb59c601b49b2bdd75a4ea43ea249eefba807c0f98211ce3cb2389ade74607955",["0xb7F0b49F09177cF8ab3aD8Cff68260DaFB079aCC"]]
      values.$pastUpgrades.0.2:
-        "0xb59c601b49b2bdd75a4ea43ea249eefba807c0f98211ce3cb2389ade74607955"
+        ["0x7be08B013de2b23a6329De51C4994f841dcE1a10"]
      values.$pastUpgrades.0.1:
-        ["0xb7F0b49F09177cF8ab3aD8Cff68260DaFB079aCC"]
+        "0xb219997f52a5ffaeb50fb6de4b69cefdd4f1844879a102820ce0878df63bc80b"
      values.$pastUpgrades.0.0:
-        "2024-10-10T10:37:46.000Z"
+        "2025-04-25T21:55:46.000Z"
      values.$upgradeCount:
-        1
+        2
    }
```

```diff
    contract Inbox (0xB1146A7eb098ECF46e8AAf695f4A960A963948d6) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      sourceHashes.0:
-        "0xb2c117c2e00734a82fe4ab27d5fe91a6e152c06bbcdbf83db021ad32b6be3e60"
+        "0x25984fdfffb8141859c99299fb29e7a7460732d77111e5fe23792baa99f336a3"
      values.$implementation:
-        "0xD2f1C58Da62BCfaD4BeF7802B2F6363C2cbe7082"
+        "0xD87f160f8c414d834cBDd9477c3D8c3ad1802255"
      values.$pastUpgrades.1:
+        ["2024-10-10T10:37:46.000Z","0xb59c601b49b2bdd75a4ea43ea249eefba807c0f98211ce3cb2389ade74607955",["0xD2f1C58Da62BCfaD4BeF7802B2F6363C2cbe7082"]]
      values.$pastUpgrades.0.2:
-        "0xb59c601b49b2bdd75a4ea43ea249eefba807c0f98211ce3cb2389ade74607955"
+        "0xb219997f52a5ffaeb50fb6de4b69cefdd4f1844879a102820ce0878df63bc80b"
      values.$pastUpgrades.0.1:
-        "2024-10-10T10:37:46.000Z"
+        ["0xD87f160f8c414d834cBDd9477c3D8c3ad1802255"]
      values.$pastUpgrades.0.0:
-        ["0xD2f1C58Da62BCfaD4BeF7802B2F6363C2cbe7082"]
+        "2025-04-25T21:55:46.000Z"
      values.$upgradeCount:
-        1
+        2
    }
```

## Source code changes

```diff
.../Inbox/ERC20Inbox.sol                           | 16 +++++++++++++--
 .../SequencerInbox/SequencerInbox.sol              | 24 +++++++++++++++-------
 2 files changed, 31 insertions(+), 9 deletions(-)
```

Generated with discovered.json: 0xbc6c39ea769a858dcff698275f6a735259cdf19f

# Diff at Tue, 18 Mar 2025 08:14:53 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@4ef7a8dbcec1cd9fec77aae2b73d81347a4ffb13 block: 315644612
- current block number: 315644612

## Description

Config: change Multisig names.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 315644612 (main branch discovery), not current.

```diff
    contract Conduit Multisig 2 (0x79C2abE3eBA9dc119318FdAaA48118e1CDB53F56) {
    +++ description: None
      name:
-        "ConduitMultisig2"
+        "Conduit Multisig 2"
    }
```

Generated with discovered.json: 0xbc54239fd21b3591ac38e25c2056236f85cd9dfc

# Diff at Fri, 14 Mar 2025 15:36:59 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@002bac09dea3b1154ecc36736323fb7552478ce4 block: 307386152
- current block number: 315644612

## Description

Conduit MS changes.

## Watched changes

```diff
    contract ConduitMultisig2 (0x79C2abE3eBA9dc119318FdAaA48118e1CDB53F56) {
    +++ description: None
      values.$members.9:
+        "0xefCf0c8faFB425997870f845e26fC6cA6EE6dD5C"
      values.$members.8:
-        "0xefCf0c8faFB425997870f845e26fC6cA6EE6dD5C"
+        "0xa0C600a6e85bf225958FFAcC70B5FDDF9A059038"
      values.$members.7:
-        "0xa0C600a6e85bf225958FFAcC70B5FDDF9A059038"
+        "0x3840f487A17A41100DD1Bf0946c34f132a57Fd5f"
      values.$members.6:
-        "0x3840f487A17A41100DD1Bf0946c34f132a57Fd5f"
+        "0x4D8007a0E9f293e62E2b0F43C6Cf4C4B9e135BAe"
      values.$members.5:
-        "0x4D8007a0E9f293e62E2b0F43C6Cf4C4B9e135BAe"
+        "0xa4000bDD2bB92ce6750b31F1eeda47Bd1cB8e6e4"
      values.$members.4:
-        "0xa4000bDD2bB92ce6750b31F1eeda47Bd1cB8e6e4"
+        "0xF3313C48BD8E17b823d5498D62F37019dFEA647D"
      values.$members.3:
-        "0xF3313C48BD8E17b823d5498D62F37019dFEA647D"
+        "0xF0B77EaE7F2dabCC2571c7418406A0dCA3afA4f0"
      values.$members.2:
-        "0xF0B77EaE7F2dabCC2571c7418406A0dCA3afA4f0"
+        "0xA0737fea60F0601A192E3d2c98865A883ab0bda2"
      values.$members.1:
-        "0xA0737fea60F0601A192E3d2c98865A883ab0bda2"
+        "0x50930d652266EF4127FA3A1906B7Cb9951076628"
      values.$members.0:
-        "0x50930d652266EF4127FA3A1906B7Cb9951076628"
+        "0x860e06Fe384D1A3340111e7D142E02642178c053"
      values.$threshold:
-        3
+        4
      values.multisigThreshold:
-        "3 of 9 (33%)"
+        "4 of 10 (40%)"
    }
```

Generated with discovered.json: 0x849e6589b622c80752ae0e310f6c2724f624b6a4

# Diff at Thu, 06 Mar 2025 14:22:32 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@454ef41fea41bcea030780b23fd1f11519ff78d2 block: 307386152
- current block number: 307386152

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 307386152 (main branch discovery), not current.

```diff
    contract RollupProxy (0x60DAdF13101C66F14C958E9141498b0C0eaE0773) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      values.isPostBoLD:
+        false
    }
```

Generated with discovered.json: 0xb225e744764d4a62f3095cc78892678e27d748eb

# Diff at Thu, 06 Mar 2025 09:39:11 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@7119c715545bc86a4194761f42815f811ac6307a block: 307386152
- current block number: 307386152

## Description

Config related: set severity for arbitrum inbox/outbox changes to high and add historical In- and Outboxes via events.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 307386152 (main branch discovery), not current.

```diff
    contract Bridge (0x20aD3d835e152F25Bf8c7B6fbC31adD32393559e) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
+++ description: All Inboxes that were ever set as allowed in the bridge.
+++ severity: HIGH
      values.inboxHistory:
+        ["0xB1146A7eb098ECF46e8AAf695f4A960A963948d6","0x4066F7e44B76Cd4b745C7c8913F21A19a32044a1"]
+++ description: All Outboxes that were ever set as allowed in the bridge.
+++ severity: HIGH
      values.outboxHistory:
+        ["0xfbe537816d181888fAbE52338a5D921eE131E9Db"]
      fieldMeta:
+        {"allowedOutboxList":{"severity":"HIGH","description":"Can make calls as the bridge, steal all funds."},"outboxHistory":{"severity":"HIGH","description":"All Outboxes that were ever set as allowed in the bridge."},"allowedDelayedInboxList":{"severity":"HIGH","description":"Allowed to mint the gastoken on L2 and call `enqueueDelayedMessage()` on the bridge."},"inboxHistory":{"severity":"HIGH","description":"All Inboxes that were ever set as allowed in the bridge."}}
    }
```

Generated with discovered.json: 0x53a6794224ed9fd45d590803c8458821850a457e

# Diff at Tue, 04 Mar 2025 10:40:25 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@98d260b45fe0d2195ce5e629bd7b200c8706e8ba block: 307386152
- current block number: 307386152

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 307386152 (main branch discovery), not current.

```diff
    contract OneStepProverHostIo (0x0446E34D1cC4eBA5F336627BaAe82332c8607043) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      sinceBlock:
+        248391505
    }
```

```diff
    contract ValidatorUtils (0x08Ca9925b88c54100568c8d41eFAF8Fecc695d3a) {
    +++ description: This contract implements view only utilities for validators.
      sinceBlock:
+        248391713
    }
```

```diff
    contract GnosisSafeL2 (0x1a8902780F37e0526788198Dee30b8375A0B24Bc) {
    +++ description: None
      sinceBlock:
+        305565943
    }
```

```diff
    contract Bridge (0x20aD3d835e152F25Bf8c7B6fbC31adD32393559e) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      sinceBlock:
+        262322617
    }
```

```diff
    contract OneStepProofEntry (0x23264394923E4aEB990234180c37Bf757667C6f7) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      sinceBlock:
+        248391542
    }
```

```diff
    contract OneStepProverMemory (0x4012CF2dce28079c8F7f92CecB2E494F4AcB9351) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      sinceBlock:
+        248391437
    }
```

```diff
    contract ProxyAdmin (0x401eCb1D350407f13ba348573E5630B83638E30D) {
    +++ description: None
      sinceBlock:
+        269256275
    }
```

```diff
    contract L1OrbitUSDCGateway (0x404922a9B29b4a5205a6074AbA31A7392BD28944) {
    +++ description: Orbit stack specific escrow (gateway) for Circle USDC that uses the canonical bridge for messaging but is governed externally.
      sinceBlock:
+        269256316
    }
```

```diff
    contract RollupEventInbox (0x4066F7e44B76Cd4b745C7c8913F21A19a32044a1) {
    +++ description: Helper contract sending configuration data over the bridge during the systems initialization.
      sinceBlock:
+        262322617
    }
```

```diff
    contract OneStepProverMath (0x461bDAfaaba542C6eCcEa882BdF85542Ed7158C5) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      sinceBlock:
+        248391475
    }
```

```diff
    contract SequencerInbox (0x4cFe930c5B2F03Cf81B44D2e62297beb79222B68) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      sinceBlock:
+        262322617
    }
```

```diff
    contract RollupProxy (0x60DAdF13101C66F14C958E9141498b0C0eaE0773) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      sinceBlock:
+        262322617
    }
```

```diff
    contract ConduitMultisig2 (0x79C2abE3eBA9dc119318FdAaA48118e1CDB53F56) {
    +++ description: None
      sinceBlock:
+        155965667
    }
```

```diff
    contract GatewayRouter (0x8098247EE48ee54ADD4Feda2F93b3bA0d014d4c7) {
    +++ description: This routing contract maps tokens to the correct escrow (gateway) to be then bridged with canonical messaging.
      sinceBlock:
+        262324820
    }
```

```diff
    contract ChallengeManager (0x832CF28be3042b6F60D7225E393E924D7f0936F6) {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      sinceBlock:
+        262322617
    }
```

```diff
    contract UpgradeExecutor (0x8b2600BA65E7908D38Af906fbcafB2f62D395765) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      sinceBlock:
+        262322617
    }
```

```diff
    contract OneStepProver0 (0x91F12800C6b5b4e7d88fE785558213F8EF3F4586) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      sinceBlock:
+        248391392
    }
```

```diff
    contract Inbox (0xB1146A7eb098ECF46e8AAf695f4A960A963948d6) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      sinceBlock:
+        262322617
    }
```

```diff
    contract ProxyAdmin (0xd12478d6edD1db996313E2F4350F2FD99c118B6E) {
    +++ description: None
      sinceBlock:
+        262322617
    }
```

```diff
    contract ERC20Gateway (0xe41363751bd1C305384375F428585C20e3dF516A) {
    +++ description: Escrows deposited ERC-20 assets for the canonical Bridge. Upon depositing, a generic token representation will be minted at the destination. Withdrawals are initiated by the Outbox contract.
      sinceBlock:
+        262324820
    }
```

```diff
    contract Outbox (0xfbe537816d181888fAbE52338a5D921eE131E9Db) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
      sinceBlock:
+        262322617
    }
```

Generated with discovered.json: 0xce8124c25eb368f755faf234ee65b8697b49ddf5

# Diff at Thu, 27 Feb 2025 11:47:25 GMT:

- author: Michał Podsiadły (<michal.podsiadly@l2beat.com>)
- comparing to: main@a4b50e45bb44f8ceeea29f9236088d26a843c885 block: 307386152
- current block number: 307386152

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 307386152 (main branch discovery), not current.

```diff
    contract Bridge (0x20aD3d835e152F25Bf8c7B6fbC31adD32393559e) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      name:
-        "ERC20Bridge"
+        "Bridge"
      displayName:
-        "Bridge"
    }
```

```diff
    contract RollupEventInbox (0x4066F7e44B76Cd4b745C7c8913F21A19a32044a1) {
    +++ description: Helper contract sending configuration data over the bridge during the systems initialization.
      name:
-        "ERC20RollupEventInbox"
+        "RollupEventInbox"
      displayName:
-        "RollupEventInbox"
    }
```

```diff
    contract GatewayRouter (0x8098247EE48ee54ADD4Feda2F93b3bA0d014d4c7) {
    +++ description: This routing contract maps tokens to the correct escrow (gateway) to be then bridged with canonical messaging.
      name:
-        "L1OrbitGatewayRouter"
+        "GatewayRouter"
      displayName:
-        "GatewayRouter"
    }
```

```diff
    contract Inbox (0xB1146A7eb098ECF46e8AAf695f4A960A963948d6) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      name:
-        "ERC20Inbox"
+        "Inbox"
      displayName:
-        "Inbox"
    }
```

```diff
    contract ERC20Gateway (0xe41363751bd1C305384375F428585C20e3dF516A) {
    +++ description: Escrows deposited ERC-20 assets for the canonical Bridge. Upon depositing, a generic token representation will be minted at the destination. Withdrawals are initiated by the Outbox contract.
      name:
-        "L1OrbitERC20Gateway"
+        "ERC20Gateway"
      displayName:
-        "ERC20Gateway"
    }
```

```diff
    contract Outbox (0xfbe537816d181888fAbE52338a5D921eE131E9Db) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
      name:
-        "ERC20Outbox"
+        "Outbox"
      displayName:
-        "Outbox"
    }
```

Generated with discovered.json: 0x0e14bad2f617d975b759e90138fd2de8ff23e3f6

# Diff at Fri, 21 Feb 2025 14:12:26 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@d219f271711b2cf7a164e3443bead5e4957d13a8 block: 307386152
- current block number: 307386152

## Description

Config related: Change some severities and add templates.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 307386152 (main branch discovery), not current.

```diff
    contract ERC20Bridge (0x20aD3d835e152F25Bf8c7B6fbC31adD32393559e) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract SequencerInbox (0x4cFe930c5B2F03Cf81B44D2e62297beb79222B68) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract RollupProxy (0x60DAdF13101C66F14C958E9141498b0C0eaE0773) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract L1OrbitGatewayRouter (0x8098247EE48ee54ADD4Feda2F93b3bA0d014d4c7) {
    +++ description: This routing contract maps tokens to the correct escrow (gateway) to be then bridged with canonical messaging.
      category:
+        {"name":"External Bridges","priority":1}
    }
```

```diff
    contract ChallengeManager (0x832CF28be3042b6F60D7225E393E924D7f0936F6) {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract UpgradeExecutor (0x8b2600BA65E7908D38Af906fbcafB2f62D395765) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      category:
+        {"name":"Governance","priority":3}
    }
```

```diff
    contract ERC20Inbox (0xB1146A7eb098ECF46e8AAf695f4A960A963948d6) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      category:
+        {"name":"Canonical Bridges","priority":2}
    }
```

```diff
    contract L1OrbitERC20Gateway (0xe41363751bd1C305384375F428585C20e3dF516A) {
    +++ description: Escrows deposited ERC-20 assets for the canonical Bridge. Upon depositing, a generic token representation will be minted at the destination. Withdrawals are initiated by the Outbox contract.
      category:
+        {"name":"Canonical Bridges","priority":2}
    }
```

```diff
    contract ERC20Outbox (0xfbe537816d181888fAbE52338a5D921eE131E9Db) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
      category:
+        {"name":"Canonical Bridges","priority":2}
    }
```

Generated with discovered.json: 0xb99aec1b27b1ac91d3871cbcc6810ff5198baca5

# Diff at Tue, 18 Feb 2025 15:31:19 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- current block number: 307386152

## Description

Game7 full discovery.

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
    contract GnosisSafeL2 (0x1a8902780F37e0526788198Dee30b8375A0B24Bc)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ERC20Bridge (0x20aD3d835e152F25Bf8c7B6fbC31adD32393559e)
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
```

```diff
+   Status: CREATED
    contract OneStepProofEntry (0x23264394923E4aEB990234180c37Bf757667C6f7)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract OneStepProverMemory (0x4012CF2dce28079c8F7f92CecB2E494F4AcB9351)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x401eCb1D350407f13ba348573E5630B83638E30D)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1OrbitUSDCGateway (0x404922a9B29b4a5205a6074AbA31A7392BD28944)
    +++ description: Orbit stack specific escrow (gateway) for Circle USDC that uses the canonical bridge for messaging but is governed externally.
```

```diff
+   Status: CREATED
    contract ERC20RollupEventInbox (0x4066F7e44B76Cd4b745C7c8913F21A19a32044a1)
    +++ description: Helper contract sending configuration data over the bridge during the systems initialization.
```

```diff
+   Status: CREATED
    contract OneStepProverMath (0x461bDAfaaba542C6eCcEa882BdF85542Ed7158C5)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract SequencerInbox (0x4cFe930c5B2F03Cf81B44D2e62297beb79222B68)
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
```

```diff
+   Status: CREATED
    contract RollupProxy (0x60DAdF13101C66F14C958E9141498b0C0eaE0773)
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
```

```diff
+   Status: CREATED
    contract ConduitMultisig2 (0x79C2abE3eBA9dc119318FdAaA48118e1CDB53F56)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1OrbitGatewayRouter (0x8098247EE48ee54ADD4Feda2F93b3bA0d014d4c7)
    +++ description: This routing contract maps tokens to the correct escrow (gateway) to be then bridged with canonical messaging.
```

```diff
+   Status: CREATED
    contract ChallengeManager (0x832CF28be3042b6F60D7225E393E924D7f0936F6)
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
```

```diff
+   Status: CREATED
    contract UpgradeExecutor (0x8b2600BA65E7908D38Af906fbcafB2f62D395765)
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
```

```diff
+   Status: CREATED
    contract OneStepProver0 (0x91F12800C6b5b4e7d88fE785558213F8EF3F4586)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract ERC20Inbox (0xB1146A7eb098ECF46e8AAf695f4A960A963948d6)
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0xd12478d6edD1db996313E2F4350F2FD99c118B6E)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1OrbitERC20Gateway (0xe41363751bd1C305384375F428585C20e3dF516A)
    +++ description: Escrows deposited ERC-20 assets for the canonical Bridge. Upon depositing, a generic token representation will be minted at the destination. Withdrawals are initiated by the Outbox contract.
```

```diff
+   Status: CREATED
    contract ERC20Outbox (0xfbe537816d181888fAbE52338a5D921eE131E9Db)
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
```
