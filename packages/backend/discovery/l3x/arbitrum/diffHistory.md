Generated with discovered.json: 0xba91a412005ebf738eda016315a3b0604b888459

# Diff at Wed, 23 Oct 2024 14:36:44 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@9cc37d16a5f0b172bb41f98d8a970963e5ca4afb block: 258882110
- current block number: 258882110

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 258882110 (main branch discovery), not current.

```diff
    contract ChallengeManager (0x211C9893653Aea2088E34765e7039617E95fD8fD) {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      template:
+        "orbitstack/ChallengeManager"
      description:
+        "Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor."
    }
```

```diff
-   Status: DELETED
    contract ValidatorWalletCreator (0x2b0E04Dc90e3fA58165CB41E2834B44A56E766aF)
    +++ description: None
```

```diff
    contract UpgradeExecutor (0x4D0D8724ff2303A1679689a9Cc8e2A62f821e0E3) {
    +++ description: Central contract defining the access control for upgrading the system contract implementations.
      template:
+        "orbitstack/UpgradeExecutor"
      description:
+        "Central contract defining the access control for upgrading the system contract implementations."
    }
```

```diff
    contract OneStepProverMemory (0x526a6E634aD36bB0007c4422586c135F1F9B525a) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      template:
+        "orbitstack/OneStepProverMemory"
      description:
+        "One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine."
    }
```

```diff
    contract OneStepProver0 (0x800dA62bE6626127F71B34E795286C34C04D6712) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      template:
+        "orbitstack/OneStepProver0"
      description:
+        "One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine."
    }
```

```diff
-   Status: DELETED
    contract  (0x82709E8564ce17707a7C8420c9e48e9a8A88bfc1)
    +++ description: None
```

```diff
    contract OneStepProofEntry (0xb20107bfB36D3B5AcA534aCAfbd8857b10b402a8) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      template:
+        "orbitstack/OneStepProofEntry"
      description:
+        "One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine."
    }
```

```diff
    contract RollupProxy (0xb75A0a5812303cBB198d4f0BcA7CA38f17b8783e) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      description:
-        "Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs."
+        "Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators)."
      issuedPermissions.2:
+        {"permission":"upgrade","target":"0x4D0D8724ff2303A1679689a9Cc8e2A62f821e0E3","via":[]}
      issuedPermissions.1.permission:
-        "validate"
+        "propose"
      issuedPermissions.0.permission:
-        "upgrade"
+        "challenge"
      issuedPermissions.0.target:
-        "0x4D0D8724ff2303A1679689a9Cc8e2A62f821e0E3"
+        "0xfc48f0786b3fA7353F63Acc40973857554A51cA2"
+++ description: Root hash of the WASM module used for execution, like a fingerprint of the L2 logic. Can be associated with ArbOS versions.
      values.wasmModuleRoot:
-        "ArbOS v20 wasmModuleRoot"
+        "0x8b104a2e80ac6165dc58b9048de12f301d70b02a0ab51396c22b4b4b802a16a4"
+++ description: ArbOS version derived from known wasmModuleRoots.
      values.arbOsFromWmRoot:
+        "ArbOS v20 wasmModuleRoot"
      fieldMeta.arbOsFromWmRoot:
+        {"description":"ArbOS version derived from known wasmModuleRoots."}
      fieldMeta.setValidatorCount:
+        {"description":"Increments on each Validator change."}
      fieldMeta.challenges:
+        {"description":"Emitted on createChallenge() in RollupUserLogic."}
    }
```

```diff
    contract SequencerInbox (0xB9450b512Fd3454e9C1a2593C5DF9E71344b5653) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      description:
-        "State batches / commitments get posted here."
+        "A sequencer (registered in this contract) can submit transaction batches or commitments here."
    }
```

```diff
    contract OneStepProverHostIo (0xc555b2F1D559Fbb854569b33640990D178F94747) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      template:
+        "orbitstack/OneStepProverHostIo"
      description:
+        "One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine."
    }
```

```diff
    contract OneStepProverMath (0xe8709022B9C9D7347856c75910fe07e10C904446) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      template:
+        "orbitstack/OneStepProverMath"
      description:
+        "One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine."
    }
```

Generated with discovered.json: 0xe845c2949d97f3ae2a2cc261e694144bbb6d518f

# Diff at Mon, 21 Oct 2024 12:51:19 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@e660599f23a07618fe949a07be1f516ce44f1914 block: 258882110
- current block number: 258882110

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 258882110 (main branch discovery), not current.

```diff
    contract RollupProxy (0xb75A0a5812303cBB198d4f0BcA7CA38f17b8783e) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
      descriptions:
-        ["Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs."]
      description:
+        "Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs."
    }
```

```diff
    contract SequencerInbox (0xB9450b512Fd3454e9C1a2593C5DF9E71344b5653) {
    +++ description: State batches / commitments get posted here.
      descriptions:
-        ["State batches / commitments get posted here."]
      description:
+        "State batches / commitments get posted here."
    }
```

Generated with discovered.json: 0x60875b2ed0902a71d76c620d794ec305ea0c0994

# Diff at Mon, 21 Oct 2024 11:13:09 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@8895d33866f5665c4c710f4ddaa32bfa63cc3c78 block: 258882110
- current block number: 258882110

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 258882110 (main branch discovery), not current.

```diff
    contract Outbox (0x1526DAacDAf3EE81E5ae087E0DA8677E8c677CE5) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0x13BE515E44Eefaf3eBEFAD684F1FBB574Ac0A494"]
      values.$pastUpgrades.0.1:
-        ["0x13BE515E44Eefaf3eBEFAD684F1FBB574Ac0A494"]
+        "0xf00fc951c098a8288fe0ee80973a1391153e3c6b1c9a61b9a7e2a1b5cd31cfdb"
    }
```

```diff
    contract ChallengeManager (0x211C9893653Aea2088E34765e7039617E95fD8fD) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0x5cA988F213EfbCB86ED7e2AACB0C15c91e648f8d"]
      values.$pastUpgrades.0.1:
-        ["0x5cA988F213EfbCB86ED7e2AACB0C15c91e648f8d"]
+        "0xf00fc951c098a8288fe0ee80973a1391153e3c6b1c9a61b9a7e2a1b5cd31cfdb"
    }
```

```diff
    contract UpgradeExecutor (0x4D0D8724ff2303A1679689a9Cc8e2A62f821e0E3) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0x660ea1675F7323dC3Ba0c8dDFB593225Eb01E3C1"]
      values.$pastUpgrades.0.1:
-        ["0x660ea1675F7323dC3Ba0c8dDFB593225Eb01E3C1"]
+        "0xf00fc951c098a8288fe0ee80973a1391153e3c6b1c9a61b9a7e2a1b5cd31cfdb"
    }
```

```diff
    contract L1ERC20Gateway (0x4fF3E70f30f0394Ad62428751Fe3858740595908) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0x1d720642e63cB0f50be637e16E0f78B2D1b93f16"]
      values.$pastUpgrades.0.1:
-        ["0x1d720642e63cB0f50be637e16E0f78B2D1b93f16"]
+        "0x325e5d768bde71c89bb5e9ef015901fc78ba3302cabfbb21296bc6cf26b96b6e"
    }
```

```diff
    contract Bridge (0x59E088d827CB7983Cd0CC64312E472D7cc8a4F44) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0xB23214f241bdEb275f7dCBfbb1EA79349101d4B0"]
      values.$pastUpgrades.0.1:
-        ["0xB23214f241bdEb275f7dCBfbb1EA79349101d4B0"]
+        "0xf00fc951c098a8288fe0ee80973a1391153e3c6b1c9a61b9a7e2a1b5cd31cfdb"
    }
```

```diff
    contract Inbox (0x80de5c4ccDfb7b6a250A9588C2d80F62a2B7d13F) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0x8f6406781cC955398C45a48DcEfeEBDb2c8e2CaA"]
      values.$pastUpgrades.0.1:
-        ["0x8f6406781cC955398C45a48DcEfeEBDb2c8e2CaA"]
+        "0xf00fc951c098a8288fe0ee80973a1391153e3c6b1c9a61b9a7e2a1b5cd31cfdb"
    }
```

```diff
    contract L1GatewayRouter (0x817C8Da480bC6b42a5FA88A26e9eD8c0c03968Cf) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0x9c84a387930853D963892D299153B0d5840dc1F5"]
      values.$pastUpgrades.0.1:
-        ["0x9c84a387930853D963892D299153B0d5840dc1F5"]
+        "0x325e5d768bde71c89bb5e9ef015901fc78ba3302cabfbb21296bc6cf26b96b6e"
    }
```

```diff
    contract RollupProxy (0xb75A0a5812303cBB198d4f0BcA7CA38f17b8783e) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
      values.$pastUpgrades.0.2:
+        ["0xEe9E5546A11Cb5b4A86e92DA05f2ef75C26E4754","0x0aE4dD666748bF0F6dB5c149Eab1D8aD27820A6A"]
      values.$pastUpgrades.0.1:
-        ["0xEe9E5546A11Cb5b4A86e92DA05f2ef75C26E4754","0x0aE4dD666748bF0F6dB5c149Eab1D8aD27820A6A"]
+        "0xf00fc951c098a8288fe0ee80973a1391153e3c6b1c9a61b9a7e2a1b5cd31cfdb"
    }
```

```diff
    contract SequencerInbox (0xB9450b512Fd3454e9C1a2593C5DF9E71344b5653) {
    +++ description: State batches / commitments get posted here.
      values.$pastUpgrades.0.2:
+        ["0x18ed2d5bF7c5943bFd20a2995b9879E30c9E8dDa"]
      values.$pastUpgrades.0.1:
-        ["0x18ed2d5bF7c5943bFd20a2995b9879E30c9E8dDa"]
+        "0xf00fc951c098a8288fe0ee80973a1391153e3c6b1c9a61b9a7e2a1b5cd31cfdb"
    }
```

```diff
    contract RollupEventInbox (0xc40e1DdDDc4837e63Bfb21EF34d3Ca4A6c78fD15) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0xF40C24bA346aA459ED28e196D4A46Cf17174bD6C"]
      values.$pastUpgrades.0.1:
-        ["0xF40C24bA346aA459ED28e196D4A46Cf17174bD6C"]
+        "0xf00fc951c098a8288fe0ee80973a1391153e3c6b1c9a61b9a7e2a1b5cd31cfdb"
    }
```

Generated with discovered.json: 0xc103b184e1e91b033286f3e915ad79251b003621

# Diff at Wed, 16 Oct 2024 11:44:01 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@a3d139b799cc0b28e5e912febb17464d4e5aef5d block: 258882110
- current block number: 258882110

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 258882110 (main branch discovery), not current.

```diff
    contract RollupProxy (0xb75A0a5812303cBB198d4f0BcA7CA38f17b8783e) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
      issuedPermissions.1:
+        {"permission":"validate","target":"0xfc48f0786b3fA7353F63Acc40973857554A51cA2","via":[]}
    }
```

```diff
    contract SequencerInbox (0xB9450b512Fd3454e9C1a2593C5DF9E71344b5653) {
    +++ description: State batches / commitments get posted here.
      issuedPermissions.1:
+        {"permission":"upgrade","target":"0x29994207C5AeDc83F27c5dc16E468f328832d42d","via":[]}
      issuedPermissions.0.permission:
-        "upgrade"
+        "sequence"
      issuedPermissions.0.target:
-        "0x29994207C5AeDc83F27c5dc16E468f328832d42d"
+        "0xd987004738Ae33732ecf68613b1b7aFd1df7C11c"
    }
```

Generated with discovered.json: 0x1867dded0ef7cf37a42f10ef455f3fd9069f7754

# Diff at Mon, 14 Oct 2024 10:58:42 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1afc77ff111ceb0970e7d09efcc7b2f376b0c281 block: 258882110
- current block number: 258882110

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 258882110 (main branch discovery), not current.

```diff
    contract Outbox (0x1526DAacDAf3EE81E5ae087E0DA8677E8c677CE5) {
    +++ description: None
      sourceHashes:
+        ["0xa7e3f6c355703ed46fcb2156862c4f01792b87beb10a87a81ce3bd5beee79b67","0x28eec040eca7563195b19e22e11429d0f977820bfb60ac52e567ffde3c92cf77"]
    }
```

```diff
    contract ChallengeManager (0x211C9893653Aea2088E34765e7039617E95fD8fD) {
    +++ description: None
      sourceHashes:
+        ["0xa7e3f6c355703ed46fcb2156862c4f01792b87beb10a87a81ce3bd5beee79b67","0x58a6261c83c2766f749641902ad6fdb695ea189d2747f073b57a8f35b9a547e5"]
    }
```

```diff
    contract ProxyAdmin (0x29994207C5AeDc83F27c5dc16E468f328832d42d) {
    +++ description: None
      sourceHashes:
+        ["0xf944f88083f41ff959fefbdcd6fc3ae633692b072b8497fb14cbdd843eded490"]
    }
```

```diff
    contract ValidatorWalletCreator (0x2b0E04Dc90e3fA58165CB41E2834B44A56E766aF) {
    +++ description: None
      sourceHashes:
+        ["0x4ef3473c840bed3b4c6258271a494794c1545f0d0f13c6a386d1e39e6180d67c"]
    }
```

```diff
    contract UpgradeExecutor (0x4D0D8724ff2303A1679689a9Cc8e2A62f821e0E3) {
    +++ description: None
      sourceHashes:
+        ["0xa7e3f6c355703ed46fcb2156862c4f01792b87beb10a87a81ce3bd5beee79b67","0xa7ff878cfd433a428d567d3b90fe1df400a048a1af5298f22cd4cd4fc25bdecd"]
    }
```

```diff
    contract L1ERC20Gateway (0x4fF3E70f30f0394Ad62428751Fe3858740595908) {
    +++ description: None
      sourceHashes:
+        ["0x36a2777510f3b20063560bdcb7f657da283bcfdc484a19b0a0f77d18f6a8b5e1","0x12b277cae4866b3d1f1772fcb7f861dc23247452179f0736c9dbe7012f6c14f6"]
    }
```

```diff
    contract OneStepProverMemory (0x526a6E634aD36bB0007c4422586c135F1F9B525a) {
    +++ description: None
      sourceHashes:
+        ["0x731b4466319a83c95ce227d1a6c85aa03864f5d2bed03bda186843033a8b8d61"]
    }
```

```diff
    contract Bridge (0x59E088d827CB7983Cd0CC64312E472D7cc8a4F44) {
    +++ description: None
      sourceHashes:
+        ["0xa7e3f6c355703ed46fcb2156862c4f01792b87beb10a87a81ce3bd5beee79b67","0xb920455f1e366c7a89719abdd8d8174e4e7d353f2d4b7dea11b0571bf9526eae"]
    }
```

```diff
    contract ValidatorUtils (0x6c21303F5986180B1394d2C89f3e883890E2867b) {
    +++ description: None
      sourceHashes:
+        ["0xd9b36ec321be937cc727b5bdb0afa0e1a0a28448ef1a202d4f181a01ce57bdc8"]
    }
```

```diff
    contract OneStepProver0 (0x800dA62bE6626127F71B34E795286C34C04D6712) {
    +++ description: None
      sourceHashes:
+        ["0x20330713abbbcf0219ef7d1c0aa3a6ede1b421f14c9d21b25c973e54fb75f5df"]
    }
```

```diff
    contract Inbox (0x80de5c4ccDfb7b6a250A9588C2d80F62a2B7d13F) {
    +++ description: None
      sourceHashes:
+        ["0xa7e3f6c355703ed46fcb2156862c4f01792b87beb10a87a81ce3bd5beee79b67","0x99872d99b7163c705118e0a168f99728c3c7089581779077707271cdaad30be3"]
    }
```

```diff
    contract L1GatewayRouter (0x817C8Da480bC6b42a5FA88A26e9eD8c0c03968Cf) {
    +++ description: None
      sourceHashes:
+        ["0x36a2777510f3b20063560bdcb7f657da283bcfdc484a19b0a0f77d18f6a8b5e1","0x61cc407871b0c56af41887c99354633d150e4586f0a6d237c6efd10966b17bd7"]
    }
```

```diff
    contract OneStepProofEntry (0xb20107bfB36D3B5AcA534aCAfbd8857b10b402a8) {
    +++ description: None
      sourceHashes:
+        ["0xf3479c667d20b1c17ea2573dc7fe09e4315a3e20bc09d31bc92603520cc962cc"]
    }
```

```diff
    contract RollupProxy (0xb75A0a5812303cBB198d4f0BcA7CA38f17b8783e) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
      sourceHashes:
+        ["0xb8da0b3748daac768860783e8555198fd2d1bbdffb775b81557a7124890c7eca","0x8b48118fe606012c0dcac2ccc1821785935aec89fab8f219f47b32c482b0017e","0xef94a66bd5339efd18fb9ca1f8031482e7ef7bbe6c5a0a10fae254ab83712406"]
    }
```

```diff
    contract SequencerInbox (0xB9450b512Fd3454e9C1a2593C5DF9E71344b5653) {
    +++ description: State batches / commitments get posted here.
      sourceHashes:
+        ["0xa7e3f6c355703ed46fcb2156862c4f01792b87beb10a87a81ce3bd5beee79b67","0x50cf57b01499408fa99da27cf0fee96ec30f0d40667d1aa090c442bc80f0636b"]
    }
```

```diff
    contract RollupEventInbox (0xc40e1DdDDc4837e63Bfb21EF34d3Ca4A6c78fD15) {
    +++ description: None
      sourceHashes:
+        ["0xa7e3f6c355703ed46fcb2156862c4f01792b87beb10a87a81ce3bd5beee79b67","0xcd37abd5bdcc8c37cbf37dcfa4889d5b238388344d913b3a48914f659e0d627b"]
    }
```

```diff
    contract OneStepProverHostIo (0xc555b2F1D559Fbb854569b33640990D178F94747) {
    +++ description: None
      sourceHashes:
+        ["0x5b0a5e16100b7e163dcf39dc6a9034f12a7bad7a475cdffc73054b937be0683d"]
    }
```

```diff
    contract OneStepProverMath (0xe8709022B9C9D7347856c75910fe07e10C904446) {
    +++ description: None
      sourceHashes:
+        ["0xb2555ede3dfe7d6df28bd96d12a0113b658c213c7ce4e34fa539df7497bc51a1"]
    }
```

Generated with discovered.json: 0xf2ca8f5596762fdd77e7997e2c32ff059facb59b

# Diff at Tue, 01 Oct 2024 11:12:39 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bd754dc73c66120164006054f8d25c5fae9cd910 block: 258882110
- current block number: 258882110

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 258882110 (main branch discovery), not current.

```diff
    contract Outbox (0x1526DAacDAf3EE81E5ae087E0DA8677E8c677CE5) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-05-02T03:01:47.000Z",["0x13BE515E44Eefaf3eBEFAD684F1FBB574Ac0A494"]]]
    }
```

```diff
    contract ChallengeManager (0x211C9893653Aea2088E34765e7039617E95fD8fD) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-05-02T03:01:47.000Z",["0x5cA988F213EfbCB86ED7e2AACB0C15c91e648f8d"]]]
    }
```

```diff
    contract UpgradeExecutor (0x4D0D8724ff2303A1679689a9Cc8e2A62f821e0E3) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-05-02T03:01:47.000Z",["0x660ea1675F7323dC3Ba0c8dDFB593225Eb01E3C1"]]]
    }
```

```diff
    contract L1ERC20Gateway (0x4fF3E70f30f0394Ad62428751Fe3858740595908) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-05-02T03:34:15.000Z",["0x1d720642e63cB0f50be637e16E0f78B2D1b93f16"]]]
    }
```

```diff
    contract Bridge (0x59E088d827CB7983Cd0CC64312E472D7cc8a4F44) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-05-02T03:01:47.000Z",["0xB23214f241bdEb275f7dCBfbb1EA79349101d4B0"]]]
    }
```

```diff
    contract Inbox (0x80de5c4ccDfb7b6a250A9588C2d80F62a2B7d13F) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-05-02T03:01:47.000Z",["0x8f6406781cC955398C45a48DcEfeEBDb2c8e2CaA"]]]
    }
```

```diff
    contract L1GatewayRouter (0x817C8Da480bC6b42a5FA88A26e9eD8c0c03968Cf) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-05-02T03:34:15.000Z",["0x9c84a387930853D963892D299153B0d5840dc1F5"]]]
    }
```

```diff
    contract RollupProxy (0xb75A0a5812303cBB198d4f0BcA7CA38f17b8783e) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
      values.$pastUpgrades:
+        [["2024-05-02T03:01:47.000Z",["0xEe9E5546A11Cb5b4A86e92DA05f2ef75C26E4754","0x0aE4dD666748bF0F6dB5c149Eab1D8aD27820A6A"]]]
      values.$upgradeCount:
+        1
    }
```

```diff
    contract SequencerInbox (0xB9450b512Fd3454e9C1a2593C5DF9E71344b5653) {
    +++ description: State batches / commitments get posted here.
      values.$pastUpgrades:
+        [["2024-05-02T03:01:47.000Z",["0x18ed2d5bF7c5943bFd20a2995b9879E30c9E8dDa"]]]
    }
```

```diff
    contract RollupEventInbox (0xc40e1DdDDc4837e63Bfb21EF34d3Ca4A6c78fD15) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-05-02T03:01:47.000Z",["0xF40C24bA346aA459ED28e196D4A46Cf17174bD6C"]]]
    }
```

Generated with discovered.json: 0x9bf243d521935f7f6817aaef16cf2059d4e2d90c

# Diff at Mon, 30 Sep 2024 09:52:27 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@eec6993b988ab9a9f325d04da2e9717ed24ad0b9 block: 245519490
- current block number: 258882110

## Description

Config related.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 245519490 (main branch discovery), not current.

```diff
    contract RollupProxy (0xb75A0a5812303cBB198d4f0BcA7CA38f17b8783e) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
      usedTypes.0.arg.0x184884e1eb9fefdc158f6c8ac912bb183bf3cf83f0090317e0bc4ac5860baa39:
+        "ArbOS v32 wasmModuleRoot"
    }
```

Generated with discovered.json: 0x03ed7b5df9a9b2e31845d34b89ea7a984c465ac9

# Diff at Sun, 01 Sep 2024 08:46:57 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@bee35b6cff7c52634ae8667cbb331e18ad4ec17a block: 245519490
- current block number: 245519490

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 245519490 (main branch discovery), not current.

```diff
    contract RollupProxy (0xb75A0a5812303cBB198d4f0BcA7CA38f17b8783e) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
+++ description: Root hash of the WASM module used for execution, like a fingerprint of the L2 logic. Can be associated with ArbOS versions.
      values.wasmModuleRoot:
-        "0x8b104a2e80ac6165dc58b9048de12f301d70b02a0ab51396c22b4b4b802a16a4"
+        "ArbOS v20 wasmModuleRoot"
      usedTypes:
+        [{"typeCaster":"Mapping","arg":{"0xbb9d58e9527566138b682f3a207c0976d5359837f6e330f4017434cca983ff41":"ArbOS v1-rc1 wasmModuleRoot","0x9d68e40c47e3b87a8a7e6368cc52915720a6484bb2f47ceabad7e573e3a11232":"ArbOS v2.1 wasmModuleRoot","0x53c288a0ca7100c0f2db8ab19508763a51c7fd1be125d376d940a65378acaee7":"ArbOS v3 wasmModuleRoot","0x588762be2f364be15d323df2aa60ffff60f2b14103b34823b6f7319acd1ae7a3":"ArbOS v3.1 wasmModuleRoot","0xcfba6a883c50a1b4475ab909600fa88fc9cceed9e3ff6f43dccd2d27f6bd57cf":"ArbOS v3.2 wasmModuleRoot","0xa24ccdb052d92c5847e8ea3ce722442358db4b00985a9ee737c4e601b6ed9876":"ArbOS v4 wasmModuleRoot","0x1e09e6d9e35b93f33ed22b2bc8dc10bbcf63fdde5e8a1fb8cc1bcd1a52f14bd0":"ArbOS v5 wasmModuleRoot","0x3848eff5e0356faf1fc9cafecb789584c5e7f4f8f817694d842ada96613d8bab":"ArbOS v6 wasmModuleRoot","0x53dd4b9a3d807a8cbb4d58fbfc6a0857c3846d46956848cae0a1cc7eca2bb5a8":"ArbOS v7 wasmModuleRoot","0x2b20e1490d1b06299b222f3239b0ae07e750d8f3b4dedd19f500a815c1548bbc":"ArbOS v7.1 wasmModuleRoot","0xd1842bfbe047322b3f3b3635b5fe62eb611557784d17ac1d2b1ce9c170af6544":"ArbOS v9 wasmModuleRoot","0x6b94a7fc388fd8ef3def759297828dc311761e88d8179c7ee8d3887dc554f3c3":"ArbOS v10 wasmModuleRoot","0xda4e3ad5e7feacb817c21c8d0220da7650fe9051ece68a3f0b1c5d38bbb27b21":"ArbOS v10.1 wasmModuleRoot","0x0754e09320c381566cc0449904c377a52bd34a6b9404432e80afd573b67f7b17":"ArbOS v10.2 wasmModuleRoot","0xf559b6d4fa869472dabce70fe1c15221bdda837533dfd891916836975b434dec":"ArbOS v10.3 wasmModuleRoot","0xf4389b835497a910d7ba3ebfb77aa93da985634f3c052de1290360635be40c4a":"ArbOS v11 wasmModuleRoot","0x68e4fe5023f792d4ef584796c84d710303a5e12ea02d6e37e2b5e9c4332507c4":"ArbOS v11.1 wasmModuleRoot","0x8b104a2e80ac6165dc58b9048de12f301d70b02a0ab51396c22b4b4b802a16a4":"ArbOS v20 wasmModuleRoot","0xb0de9cb89e4d944ae6023a3b62276e54804c242fd8c4c2d8e6cc4450f5fa8b1b":"ArbOS v30 wasmModuleRoot","0x260f5fa5c3176a856893642e149cf128b5a8de9f828afec8d11184415dd8dc69":"ArbOS v31 wasmModuleRoot"}}]
    }
```

Generated with discovered.json: 0x1f47a686405f9b2443a4f243d60a963aa5c0b9ce

# Diff at Fri, 30 Aug 2024 08:06:09 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@6c1bd1f41fadf5f2cb1c1805b5a2c6138a3ed35a block: 245519490
- current block number: 245519490

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 245519490 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x29994207C5AeDc83F27c5dc16E468f328832d42d) {
    +++ description: None
      receivedPermissions.8.via:
-        []
      receivedPermissions.7.via:
-        []
      receivedPermissions.6.via:
-        []
      receivedPermissions.5.via:
-        []
      receivedPermissions.4.via:
-        []
      receivedPermissions.3.via:
-        []
      receivedPermissions.2.via:
-        []
      receivedPermissions.1.via:
-        []
      receivedPermissions.0.via:
-        []
    }
```

```diff
    contract UpgradeExecutor (0x4D0D8724ff2303A1679689a9Cc8e2A62f821e0E3) {
    +++ description: None
      receivedPermissions.0.via:
-        []
    }
```

Generated with discovered.json: 0xad72bf714c0b2b3add04509d7b5c65ba7789d1aa

# Diff at Fri, 23 Aug 2024 09:57:05 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@67597c7d6c810bc726594446890178150240711e block: 245519490
- current block number: 245519490

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 245519490 (main branch discovery), not current.

```diff
    contract Outbox (0x1526DAacDAf3EE81E5ae087E0DA8677E8c677CE5) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract ChallengeManager (0x211C9893653Aea2088E34765e7039617E95fD8fD) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract UpgradeExecutor (0x4D0D8724ff2303A1679689a9Cc8e2A62f821e0E3) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract L1ERC20Gateway (0x4fF3E70f30f0394Ad62428751Fe3858740595908) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract Bridge (0x59E088d827CB7983Cd0CC64312E472D7cc8a4F44) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract Inbox (0x80de5c4ccDfb7b6a250A9588C2d80F62a2B7d13F) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract L1GatewayRouter (0x817C8Da480bC6b42a5FA88A26e9eD8c0c03968Cf) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract SequencerInbox (0xB9450b512Fd3454e9C1a2593C5DF9E71344b5653) {
    +++ description: State batches / commitments get posted here.
      values.$upgradeCount:
+        1
    }
```

```diff
    contract RollupEventInbox (0xc40e1DdDDc4837e63Bfb21EF34d3Ca4A6c78fD15) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

Generated with discovered.json: 0x230ecf8abe39719c70117f127faf066d3d6ed4ee

# Diff at Thu, 22 Aug 2024 11:59:56 GMT:

- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@bf2d0ebf21a279d76dfafc24de12b751244afaf6 block: 234834723
- current block number: 245519490

## Description

New handler now fetching BLS signature keys of DAC members.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 234834723 (main branch discovery), not current.

```diff
    contract SequencerInbox (0xB9450b512Fd3454e9C1a2593C5DF9E71344b5653) {
    +++ description: State batches / commitments get posted here.
      values.dacKeyset.blsSignatures:
+        ["YBT6gR4Iev6/xEpkYjRd1d1okX4QpeqeJ10i9A0Zx85cw7vwmH+brEvz+kyByjz53A7AdTBJjlmBSlRgABQmhsF+e+gT7j2ZIGfnIKLC7TKOYBJRYmS1PXOMp41GT/DgnBB5JBXemsSjuPknRlhLqHpc3MsBppwxejZtGlAB9EWVU3egk5DyLii7Jki9z9j5ZgSLIG3VR4MOQqySxwMKp/5lFe2K4v7zK8DgX9o/scX3EhDURW796SIFzuzi6w9kSQrCJtLRV0DFkzKZap2GzZqDvxHOVMeB7tXEuCasEqEvg1HAfS36G8i/hqoRI2HByRKaa5l+kekO7irjv8faA5nrU1zfp9Yo4CPISBSXt58vkji96OTDxGzCfvm4M3BMvw=="]
    }
```

Generated with discovered.json: 0xbcf3740f7c36eaf130707ac4ddd54a123bcf9b5d

# Diff at Wed, 21 Aug 2024 10:07:29 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@2f6dde3357bf5d79196b6e94f79d853a6c4ec72b block: 234834723
- current block number: 234834723

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 234834723 (main branch discovery), not current.

```diff
    contract Outbox (0x1526DAacDAf3EE81E5ae087E0DA8677E8c677CE5) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x29994207C5AeDc83F27c5dc16E468f328832d42d","via":[]}]
    }
```

```diff
    contract ChallengeManager (0x211C9893653Aea2088E34765e7039617E95fD8fD) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x29994207C5AeDc83F27c5dc16E468f328832d42d","via":[]}]
    }
```

```diff
    contract ProxyAdmin (0x29994207C5AeDc83F27c5dc16E468f328832d42d) {
    +++ description: None
      assignedPermissions:
-        {"upgrade":["0x1526DAacDAf3EE81E5ae087E0DA8677E8c677CE5","0x211C9893653Aea2088E34765e7039617E95fD8fD","0x4D0D8724ff2303A1679689a9Cc8e2A62f821e0E3","0x4fF3E70f30f0394Ad62428751Fe3858740595908","0x59E088d827CB7983Cd0CC64312E472D7cc8a4F44","0x80de5c4ccDfb7b6a250A9588C2d80F62a2B7d13F","0x817C8Da480bC6b42a5FA88A26e9eD8c0c03968Cf","0xB9450b512Fd3454e9C1a2593C5DF9E71344b5653","0xc40e1DdDDc4837e63Bfb21EF34d3Ca4A6c78fD15"]}
      receivedPermissions:
+        [{"permission":"upgrade","target":"0x1526DAacDAf3EE81E5ae087E0DA8677E8c677CE5","via":[]},{"permission":"upgrade","target":"0x211C9893653Aea2088E34765e7039617E95fD8fD","via":[]},{"permission":"upgrade","target":"0x4D0D8724ff2303A1679689a9Cc8e2A62f821e0E3","via":[]},{"permission":"upgrade","target":"0x4fF3E70f30f0394Ad62428751Fe3858740595908","via":[]},{"permission":"upgrade","target":"0x59E088d827CB7983Cd0CC64312E472D7cc8a4F44","via":[]},{"permission":"upgrade","target":"0x80de5c4ccDfb7b6a250A9588C2d80F62a2B7d13F","via":[]},{"permission":"upgrade","target":"0x817C8Da480bC6b42a5FA88A26e9eD8c0c03968Cf","via":[]},{"permission":"upgrade","target":"0xB9450b512Fd3454e9C1a2593C5DF9E71344b5653","via":[]},{"permission":"upgrade","target":"0xc40e1DdDDc4837e63Bfb21EF34d3Ca4A6c78fD15","via":[]}]
    }
```

```diff
    contract UpgradeExecutor (0x4D0D8724ff2303A1679689a9Cc8e2A62f821e0E3) {
    +++ description: None
      assignedPermissions:
-        {"upgrade":["0xb75A0a5812303cBB198d4f0BcA7CA38f17b8783e"]}
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x29994207C5AeDc83F27c5dc16E468f328832d42d","via":[]}]
      receivedPermissions:
+        [{"permission":"upgrade","target":"0xb75A0a5812303cBB198d4f0BcA7CA38f17b8783e","via":[]}]
    }
```

```diff
    contract L1ERC20Gateway (0x4fF3E70f30f0394Ad62428751Fe3858740595908) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x29994207C5AeDc83F27c5dc16E468f328832d42d","via":[]}]
    }
```

```diff
    contract Bridge (0x59E088d827CB7983Cd0CC64312E472D7cc8a4F44) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x29994207C5AeDc83F27c5dc16E468f328832d42d","via":[]}]
    }
```

```diff
    contract Inbox (0x80de5c4ccDfb7b6a250A9588C2d80F62a2B7d13F) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x29994207C5AeDc83F27c5dc16E468f328832d42d","via":[]}]
    }
```

```diff
    contract L1GatewayRouter (0x817C8Da480bC6b42a5FA88A26e9eD8c0c03968Cf) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x29994207C5AeDc83F27c5dc16E468f328832d42d","via":[]}]
    }
```

```diff
    contract RollupProxy (0xb75A0a5812303cBB198d4f0BcA7CA38f17b8783e) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x4D0D8724ff2303A1679689a9Cc8e2A62f821e0E3","via":[]}]
    }
```

```diff
    contract SequencerInbox (0xB9450b512Fd3454e9C1a2593C5DF9E71344b5653) {
    +++ description: State batches / commitments get posted here.
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x29994207C5AeDc83F27c5dc16E468f328832d42d","via":[]}]
    }
```

```diff
    contract RollupEventInbox (0xc40e1DdDDc4837e63Bfb21EF34d3Ca4A6c78fD15) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x29994207C5AeDc83F27c5dc16E468f328832d42d","via":[]}]
    }
```

Generated with discovered.json: 0xadd225afa97308b1e1513672bbc302d2ad43225b

# Diff at Fri, 09 Aug 2024 12:03:36 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bf40aa32f030fd312056ca0ef198c8550467d1d7 block: 234834723
- current block number: 234834723

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 234834723 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x29994207C5AeDc83F27c5dc16E468f328832d42d) {
    +++ description: None
      assignedPermissions.upgrade.8:
-        "0x4D0D8724ff2303A1679689a9Cc8e2A62f821e0E3"
+        "0xc40e1DdDDc4837e63Bfb21EF34d3Ca4A6c78fD15"
      assignedPermissions.upgrade.7:
-        "0x211C9893653Aea2088E34765e7039617E95fD8fD"
+        "0xB9450b512Fd3454e9C1a2593C5DF9E71344b5653"
      assignedPermissions.upgrade.6:
-        "0xB9450b512Fd3454e9C1a2593C5DF9E71344b5653"
+        "0x817C8Da480bC6b42a5FA88A26e9eD8c0c03968Cf"
      assignedPermissions.upgrade.5:
-        "0xc40e1DdDDc4837e63Bfb21EF34d3Ca4A6c78fD15"
+        "0x80de5c4ccDfb7b6a250A9588C2d80F62a2B7d13F"
      assignedPermissions.upgrade.4:
-        "0x1526DAacDAf3EE81E5ae087E0DA8677E8c677CE5"
+        "0x59E088d827CB7983Cd0CC64312E472D7cc8a4F44"
      assignedPermissions.upgrade.3:
-        "0x80de5c4ccDfb7b6a250A9588C2d80F62a2B7d13F"
+        "0x4fF3E70f30f0394Ad62428751Fe3858740595908"
      assignedPermissions.upgrade.2:
-        "0x817C8Da480bC6b42a5FA88A26e9eD8c0c03968Cf"
+        "0x4D0D8724ff2303A1679689a9Cc8e2A62f821e0E3"
      assignedPermissions.upgrade.1:
-        "0x59E088d827CB7983Cd0CC64312E472D7cc8a4F44"
+        "0x211C9893653Aea2088E34765e7039617E95fD8fD"
      assignedPermissions.upgrade.0:
-        "0x4fF3E70f30f0394Ad62428751Fe3858740595908"
+        "0x1526DAacDAf3EE81E5ae087E0DA8677E8c677CE5"
    }
```

Generated with discovered.json: 0x855dc40786c6a76e4d08171d3015f37d61f6d806

# Diff at Fri, 09 Aug 2024 10:13:35 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f0da1d0aab7bc6b3b5e54e7e93480bd98e57035 block: 234834723
- current block number: 234834723

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 234834723 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x29994207C5AeDc83F27c5dc16E468f328832d42d) {
    +++ description: None
      assignedPermissions.admin:
-        ["0x1526DAacDAf3EE81E5ae087E0DA8677E8c677CE5","0x211C9893653Aea2088E34765e7039617E95fD8fD","0x4D0D8724ff2303A1679689a9Cc8e2A62f821e0E3","0x4fF3E70f30f0394Ad62428751Fe3858740595908","0x59E088d827CB7983Cd0CC64312E472D7cc8a4F44","0x80de5c4ccDfb7b6a250A9588C2d80F62a2B7d13F","0x817C8Da480bC6b42a5FA88A26e9eD8c0c03968Cf","0xB9450b512Fd3454e9C1a2593C5DF9E71344b5653","0xc40e1DdDDc4837e63Bfb21EF34d3Ca4A6c78fD15"]
      assignedPermissions.upgrade:
+        ["0x4fF3E70f30f0394Ad62428751Fe3858740595908","0x59E088d827CB7983Cd0CC64312E472D7cc8a4F44","0x817C8Da480bC6b42a5FA88A26e9eD8c0c03968Cf","0x80de5c4ccDfb7b6a250A9588C2d80F62a2B7d13F","0x1526DAacDAf3EE81E5ae087E0DA8677E8c677CE5","0xc40e1DdDDc4837e63Bfb21EF34d3Ca4A6c78fD15","0xB9450b512Fd3454e9C1a2593C5DF9E71344b5653","0x211C9893653Aea2088E34765e7039617E95fD8fD","0x4D0D8724ff2303A1679689a9Cc8e2A62f821e0E3"]
    }
```

```diff
    contract UpgradeExecutor (0x4D0D8724ff2303A1679689a9Cc8e2A62f821e0E3) {
    +++ description: None
      assignedPermissions.admin:
-        ["0xb75A0a5812303cBB198d4f0BcA7CA38f17b8783e"]
      assignedPermissions.upgrade:
+        ["0xb75A0a5812303cBB198d4f0BcA7CA38f17b8783e"]
    }
```

Generated with discovered.json: 0x23b1b07480aa71c423e4e6160254c8664bf0c911

# Diff at Tue, 30 Jul 2024 11:17:10 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@b2b6471ff62871f4956541f42ec025c356c08f7e block: 234834723
- current block number: 234834723

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 234834723 (main branch discovery), not current.

```diff
    contract RollupProxy (0xb75A0a5812303cBB198d4f0BcA7CA38f17b8783e) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
      fieldMeta:
+        {"confirmPeriodBlocks":{"description":"Challenge period. (Number of blocks until a node is confirmed)."},"wasmModuleRoot":{"description":"Root hash of the WASM module used for execution, like a fingerprint of the L2 logic. Can be associated with ArbOS versions."}}
    }
```

```diff
    contract SequencerInbox (0xB9450b512Fd3454e9C1a2593C5DF9E71344b5653) {
    +++ description: State batches / commitments get posted here.
      fieldMeta:
+        {"maxTimeVariation":{"description":"Struct: delayBlocks, futureBlocks, delaySeconds, futureSeconds. onlyRollupOwner settable. Transactions can only be force-included after `delayBlocks` window (Sequencer-only) has passed."}}
    }
```

Generated with discovered.json: 0xd37664082f460fc8558e6d56b77f4c2fe7e01081

# Diff at Mon, 22 Jul 2024 10:10:13 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- current block number: 234834723

## Description

Initial discovery: Orbit stack L3 on Arbitrum with 1/1 DAC and EOA Admin. Prelaunch escrows (multichain) added. 

## Initial discovery

```diff
+   Status: CREATED
    contract Outbox (0x1526DAacDAf3EE81E5ae087E0DA8677E8c677CE5)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ChallengeManager (0x211C9893653Aea2088E34765e7039617E95fD8fD)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x29994207C5AeDc83F27c5dc16E468f328832d42d)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ValidatorWalletCreator (0x2b0E04Dc90e3fA58165CB41E2834B44A56E766aF)
    +++ description: None
```

```diff
+   Status: CREATED
    contract UpgradeExecutor (0x4D0D8724ff2303A1679689a9Cc8e2A62f821e0E3)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1ERC20Gateway (0x4fF3E70f30f0394Ad62428751Fe3858740595908)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProverMemory (0x526a6E634aD36bB0007c4422586c135F1F9B525a)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Bridge (0x59E088d827CB7983Cd0CC64312E472D7cc8a4F44)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ValidatorUtils (0x6c21303F5986180B1394d2C89f3e883890E2867b)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProver0 (0x800dA62bE6626127F71B34E795286C34C04D6712)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Inbox (0x80de5c4ccDfb7b6a250A9588C2d80F62a2B7d13F)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1GatewayRouter (0x817C8Da480bC6b42a5FA88A26e9eD8c0c03968Cf)
    +++ description: None
```

```diff
+   Status: CREATED
    contract  (0x82709E8564ce17707a7C8420c9e48e9a8A88bfc1)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProofEntry (0xb20107bfB36D3B5AcA534aCAfbd8857b10b402a8)
    +++ description: None
```

```diff
+   Status: CREATED
    contract RollupProxy (0xb75A0a5812303cBB198d4f0BcA7CA38f17b8783e)
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
```

```diff
+   Status: CREATED
    contract SequencerInbox (0xB9450b512Fd3454e9C1a2593C5DF9E71344b5653)
    +++ description: State batches / commitments get posted here.
```

```diff
+   Status: CREATED
    contract RollupEventInbox (0xc40e1DdDDc4837e63Bfb21EF34d3Ca4A6c78fD15)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProverHostIo (0xc555b2F1D559Fbb854569b33640990D178F94747)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProverMath (0xe8709022B9C9D7347856c75910fe07e10C904446)
    +++ description: None
```
