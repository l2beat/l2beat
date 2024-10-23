Generated with discovered.json: 0xd4113d571b1a0e32afce93eb2c3b5a9386f31636

# Diff at Wed, 23 Oct 2024 13:27:08 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@9cc37d16a5f0b172bb41f98d8a970963e5ca4afb block: 20942700
- current block number: 20942700

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20942700 (main branch discovery), not current.

```diff
    contract RollupProxy (0x1CA12290D954CFe022323b6A6Df92113ed6b1C98) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      description:
-        "Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs."
+        "Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators)."
      issuedPermissions.2:
+        {"permission":"upgrade","target":"0x830D41c5624EE982cddEd92Ba01DAB3a4856116f","via":[]}
      issuedPermissions.1.permission:
-        "validate"
+        "propose"
      issuedPermissions.0.permission:
-        "upgrade"
+        "challenge"
      issuedPermissions.0.target:
-        "0x830D41c5624EE982cddEd92Ba01DAB3a4856116f"
+        "0x2b2566944f8ff8a256b39C6A36900991EC1fF3c6"
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
    contract Bridge (0x41Ec9456AB918f2aBA81F38c03Eb0B93b78E84d9) {
    +++ description: Escrow contract for the project's gas token (Can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for bridge messaging.
      template:
+        "orbitstack/Bridge"
      description:
+        "Escrow contract for the project's gas token (Can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for bridge messaging."
    }
```

```diff
    contract Inbox (0x56D8EC76a421063e1907503aDd3794c395256AEb) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      template:
+        "orbitstack/Inbox"
      description:
+        "Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds."
    }
```

```diff
    contract Outbox (0x73bb50c32a3BD6A1032aa5cFeA048fBDA3D6aF6e) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) which eventually resolve in execution on L1.
      template:
+        "orbitstack/Outbox"
      description:
+        "Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) which eventually resolve in execution on L1."
    }
```

```diff
-   Status: DELETED
    contract  (0x7Deda2425eC2d4EA0DF689A78de2fBF002075576)
    +++ description: None
```

```diff
    contract UpgradeExecutor (0x830D41c5624EE982cddEd92Ba01DAB3a4856116f) {
    +++ description: Central contract defining the access control for upgrading the system contract implementations.
      template:
+        "orbitstack/UpgradeExecutor"
      description:
+        "Central contract defining the access control for upgrading the system contract implementations."
    }
```

```diff
    contract ChallengeManager (0xb9e6987d1E0936b93f512bC89632E15DcA706d87) {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      template:
+        "orbitstack/ChallengeManager"
      description:
+        "Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor."
    }
```

```diff
    contract SequencerInbox (0xF75206c49c1694594E3e69252E519434f1579876) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      description:
-        "State batches / commitments get posted here."
+        "A sequencer (registered in this contract) can submit transaction batches or commitments here."
    }
```

Generated with discovered.json: 0x875b985df115942d15bd053cf8b52d292750c4b9

# Diff at Mon, 21 Oct 2024 12:42:14 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@e660599f23a07618fe949a07be1f516ce44f1914 block: 20942700
- current block number: 20942700

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20942700 (main branch discovery), not current.

```diff
    contract RollupProxy (0x1CA12290D954CFe022323b6A6Df92113ed6b1C98) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
      descriptions:
-        ["Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs."]
      description:
+        "Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs."
    }
```

```diff
    contract SequencerInbox (0xF75206c49c1694594E3e69252E519434f1579876) {
    +++ description: State batches / commitments get posted here.
      descriptions:
-        ["State batches / commitments get posted here."]
      description:
+        "State batches / commitments get posted here."
    }
```

Generated with discovered.json: 0x017d4afe5d013550036b173df420e83d37cc7409

# Diff at Mon, 21 Oct 2024 11:03:50 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@8895d33866f5665c4c710f4ddaa32bfa63cc3c78 block: 20942700
- current block number: 20942700

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20942700 (main branch discovery), not current.

```diff
    contract RollupProxy (0x1CA12290D954CFe022323b6A6Df92113ed6b1C98) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
      values.$pastUpgrades.0.2:
+        ["0x0aE4dD666748bF0F6dB5c149Eab1D8aD27820A6A","0x660ea1675F7323dC3Ba0c8dDFB593225Eb01E3C1"]
      values.$pastUpgrades.0.1:
-        ["0x0aE4dD666748bF0F6dB5c149Eab1D8aD27820A6A","0x660ea1675F7323dC3Ba0c8dDFB593225Eb01E3C1"]
+        "0x16528bf78b7d2110129529a7a0435a35b5443e3638f89fb2f917a7c92ef587b9"
    }
```

```diff
    contract Bridge (0x41Ec9456AB918f2aBA81F38c03Eb0B93b78E84d9) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0x7EfcB76D0e2E776A298aAa603d433336e5F8b6ab"]
      values.$pastUpgrades.0.1:
-        ["0x7EfcB76D0e2E776A298aAa603d433336e5F8b6ab"]
+        "0x16528bf78b7d2110129529a7a0435a35b5443e3638f89fb2f917a7c92ef587b9"
    }
```

```diff
    contract ERC20RollupEventInbox (0x4e008aEeA79Fcd5708A7b46CA1732dFAf2a25B7d) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0x302275067251F5FcdB9359Bda735fD8f7A4A54c0"]
      values.$pastUpgrades.0.1:
-        ["0x302275067251F5FcdB9359Bda735fD8f7A4A54c0"]
+        "0x16528bf78b7d2110129529a7a0435a35b5443e3638f89fb2f917a7c92ef587b9"
    }
```

```diff
    contract Inbox (0x56D8EC76a421063e1907503aDd3794c395256AEb) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0x31fAAAB44e74eB408d1FC69A14806B4b9cA09da2"]
      values.$pastUpgrades.0.1:
-        ["0x31fAAAB44e74eB408d1FC69A14806B4b9cA09da2"]
+        "0x16528bf78b7d2110129529a7a0435a35b5443e3638f89fb2f917a7c92ef587b9"
    }
```

```diff
    contract Outbox (0x73bb50c32a3BD6A1032aa5cFeA048fBDA3D6aF6e) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0x19431dc37098877486532250FB3158140717C00C"]
      values.$pastUpgrades.0.1:
-        ["0x19431dc37098877486532250FB3158140717C00C"]
+        "0x16528bf78b7d2110129529a7a0435a35b5443e3638f89fb2f917a7c92ef587b9"
    }
```

```diff
    contract UpgradeExecutor (0x830D41c5624EE982cddEd92Ba01DAB3a4856116f) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0x6c21303F5986180B1394d2C89f3e883890E2867b"]
      values.$pastUpgrades.0.1:
-        ["0x6c21303F5986180B1394d2C89f3e883890E2867b"]
+        "0x16528bf78b7d2110129529a7a0435a35b5443e3638f89fb2f917a7c92ef587b9"
    }
```

```diff
    contract ChallengeManager (0xb9e6987d1E0936b93f512bC89632E15DcA706d87) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0x1D901DD7A5eFE421C3C437B147040E5AF22E6A43"]
      values.$pastUpgrades.0.1:
-        ["0x1D901DD7A5eFE421C3C437B147040E5AF22E6A43"]
+        "0x16528bf78b7d2110129529a7a0435a35b5443e3638f89fb2f917a7c92ef587b9"
    }
```

```diff
    contract L1OrbitERC20Gateway (0xccaF21F002EAF230c9Fa810B34837a3739B70F7B) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0xe80b4E0ed5e92d865F4708eeE0E1564287a7D848"]
      values.$pastUpgrades.0.1:
-        ["0xe80b4E0ed5e92d865F4708eeE0E1564287a7D848"]
+        "0x7d95b8115b846835b6da60e35cc04647b957e35301e9cb72b1d148b26acac93a"
    }
```

```diff
    contract L1OrbitGatewayRouter (0xeBb17f398ed30d02F2e8733e7c1e5cf566e17812) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0x5Ff3feD7aad041ACe66E4ecDd7AfbCC43b6446b0"]
      values.$pastUpgrades.0.1:
-        ["0x5Ff3feD7aad041ACe66E4ecDd7AfbCC43b6446b0"]
+        "0x7d95b8115b846835b6da60e35cc04647b957e35301e9cb72b1d148b26acac93a"
    }
```

```diff
    contract SequencerInbox (0xF75206c49c1694594E3e69252E519434f1579876) {
    +++ description: State batches / commitments get posted here.
      values.$pastUpgrades.0.2:
+        ["0x383f16fB2809a56fC639c1eE2c93Ad2aa7Ee130A"]
      values.$pastUpgrades.0.1:
-        ["0x383f16fB2809a56fC639c1eE2c93Ad2aa7Ee130A"]
+        "0x16528bf78b7d2110129529a7a0435a35b5443e3638f89fb2f917a7c92ef587b9"
    }
```

Generated with discovered.json: 0x80bf54d7a3a1527ae5c1ddaca77fa7451578a154

# Diff at Wed, 16 Oct 2024 11:34:28 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@a3d139b799cc0b28e5e912febb17464d4e5aef5d block: 20942700
- current block number: 20942700

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20942700 (main branch discovery), not current.

```diff
    contract RollupProxy (0x1CA12290D954CFe022323b6A6Df92113ed6b1C98) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
      issuedPermissions.1:
+        {"permission":"validate","target":"0x2b2566944f8ff8a256b39C6A36900991EC1fF3c6","via":[]}
    }
```

```diff
    contract SequencerInbox (0xF75206c49c1694594E3e69252E519434f1579876) {
    +++ description: State batches / commitments get posted here.
      issuedPermissions.1:
+        {"permission":"upgrade","target":"0x80622fe04c5e1c3fbb3A9c62996dB27B53E9F77b","via":[]}
      issuedPermissions.0.permission:
-        "upgrade"
+        "sequence"
      issuedPermissions.0.target:
-        "0x80622fe04c5e1c3fbb3A9c62996dB27B53E9F77b"
+        "0xbc35c3fBd56318Bf360086f50576233Dc93AFF20"
    }
```

Generated with discovered.json: 0xf04be7855c62a3e6fdba3c76f89aa37616419125

# Diff at Mon, 14 Oct 2024 10:49:02 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1afc77ff111ceb0970e7d09efcc7b2f376b0c281 block: 20942700
- current block number: 20942700

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20942700 (main branch discovery), not current.

```diff
    contract OneStepProverHostIo (0x17e7F68ce50A77e55C7834ddF31AEf86403B8010) {
    +++ description: None
      sourceHashes:
+        ["0x5b0a5e16100b7e163dcf39dc6a9034f12a7bad7a475cdffc73054b937be0683d"]
    }
```

```diff
    contract RollupProxy (0x1CA12290D954CFe022323b6A6Df92113ed6b1C98) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
      sourceHashes:
+        ["0xb8da0b3748daac768860783e8555198fd2d1bbdffb775b81557a7124890c7eca","0x8b48118fe606012c0dcac2ccc1821785935aec89fab8f219f47b32c482b0017e","0xef94a66bd5339efd18fb9ca1f8031482e7ef7bbe6c5a0a10fae254ab83712406"]
    }
```

```diff
    contract ValidatorUtils (0x2b0E04Dc90e3fA58165CB41E2834B44A56E766aF) {
    +++ description: None
      sourceHashes:
+        ["0xd9b36ec321be937cc727b5bdb0afa0e1a0a28448ef1a202d4f181a01ce57bdc8"]
    }
```

```diff
    contract Bridge (0x41Ec9456AB918f2aBA81F38c03Eb0B93b78E84d9) {
    +++ description: None
      sourceHashes:
+        ["0xa7e3f6c355703ed46fcb2156862c4f01792b87beb10a87a81ce3bd5beee79b67","0x057de68a7007d55f4394ba6eafb2c802efcaf13583ff9342ea4d0ee3924d9be1"]
    }
```

```diff
    contract ERC20RollupEventInbox (0x4e008aEeA79Fcd5708A7b46CA1732dFAf2a25B7d) {
    +++ description: None
      sourceHashes:
+        ["0xa7e3f6c355703ed46fcb2156862c4f01792b87beb10a87a81ce3bd5beee79b67","0x88c3a2fa81cad2f98a156402c78de0fc804b2a1866ea4f449aa90ae92ceabc6c"]
    }
```

```diff
    contract Inbox (0x56D8EC76a421063e1907503aDd3794c395256AEb) {
    +++ description: None
      sourceHashes:
+        ["0xa7e3f6c355703ed46fcb2156862c4f01792b87beb10a87a81ce3bd5beee79b67","0xcb390b491549387c8fcc09fb22fbea7adf54cc74b7247a0c738369ddd7049b92"]
    }
```

```diff
    contract OneStepProofEntry (0x57EA090Ac0554d174AE0e2855B460e84A1A7C221) {
    +++ description: None
      sourceHashes:
+        ["0xf3479c667d20b1c17ea2573dc7fe09e4315a3e20bc09d31bc92603520cc962cc"]
    }
```

```diff
    contract OneStepProver0 (0x72B166070781a552D7b95a907eF59ca05d3D5a62) {
    +++ description: None
      sourceHashes:
+        ["0x20330713abbbcf0219ef7d1c0aa3a6ede1b421f14c9d21b25c973e54fb75f5df"]
    }
```

```diff
    contract Outbox (0x73bb50c32a3BD6A1032aa5cFeA048fBDA3D6aF6e) {
    +++ description: None
      sourceHashes:
+        ["0xa7e3f6c355703ed46fcb2156862c4f01792b87beb10a87a81ce3bd5beee79b67","0x3073f29910dee50069a001fb20e58cca3dcc1b3c8da4b91809af2dd356ef0c8c"]
    }
```

```diff
    contract ProxyAdmin (0x80622fe04c5e1c3fbb3A9c62996dB27B53E9F77b) {
    +++ description: None
      sourceHashes:
+        ["0xf944f88083f41ff959fefbdcd6fc3ae633692b072b8497fb14cbdd843eded490"]
    }
```

```diff
    contract UpgradeExecutor (0x830D41c5624EE982cddEd92Ba01DAB3a4856116f) {
    +++ description: None
      sourceHashes:
+        ["0xa7e3f6c355703ed46fcb2156862c4f01792b87beb10a87a81ce3bd5beee79b67","0xa7ff878cfd433a428d567d3b90fe1df400a048a1af5298f22cd4cd4fc25bdecd"]
    }
```

```diff
    contract OneStepProverMemory (0x8b73Ef238ADaB31EBC7c05423d243c345241a22f) {
    +++ description: None
      sourceHashes:
+        ["0x731b4466319a83c95ce227d1a6c85aa03864f5d2bed03bda186843033a8b8d61"]
    }
```

```diff
    contract OneStepProverMath (0x90eC62De2EB7C7512a22bD2D55926AD6bA609F38) {
    +++ description: None
      sourceHashes:
+        ["0xb2555ede3dfe7d6df28bd96d12a0113b658c213c7ce4e34fa539df7497bc51a1"]
    }
```

```diff
    contract ValidatorWalletCreator (0x9CAd81628aB7D8e239F1A5B497313341578c5F71) {
    +++ description: None
      sourceHashes:
+        ["0x4ef3473c840bed3b4c6258271a494794c1545f0d0f13c6a386d1e39e6180d67c"]
    }
```

```diff
    contract ChallengeManager (0xb9e6987d1E0936b93f512bC89632E15DcA706d87) {
    +++ description: None
      sourceHashes:
+        ["0xa7e3f6c355703ed46fcb2156862c4f01792b87beb10a87a81ce3bd5beee79b67","0x58a6261c83c2766f749641902ad6fdb695ea189d2747f073b57a8f35b9a547e5"]
    }
```

```diff
    contract L1OrbitERC20Gateway (0xccaF21F002EAF230c9Fa810B34837a3739B70F7B) {
    +++ description: None
      sourceHashes:
+        ["0x36a2777510f3b20063560bdcb7f657da283bcfdc484a19b0a0f77d18f6a8b5e1","0x17c9d8bf5017982cb88ab1d4f22a085c097ab9c7a910fa109fe9e7204840bef8"]
    }
```

```diff
    contract L1OrbitGatewayRouter (0xeBb17f398ed30d02F2e8733e7c1e5cf566e17812) {
    +++ description: None
      sourceHashes:
+        ["0x36a2777510f3b20063560bdcb7f657da283bcfdc484a19b0a0f77d18f6a8b5e1","0x33422e0ac90902db5dad442b006c9df60e262556d8ad286808d133b5429a3eb0"]
    }
```

```diff
    contract SequencerInbox (0xF75206c49c1694594E3e69252E519434f1579876) {
    +++ description: State batches / commitments get posted here.
      sourceHashes:
+        ["0xa7e3f6c355703ed46fcb2156862c4f01792b87beb10a87a81ce3bd5beee79b67","0x50cf57b01499408fa99da27cf0fee96ec30f0d40667d1aa090c442bc80f0636b"]
    }
```

Generated with discovered.json: 0xe534319d537464183f9c8c88ad23b0e7e79abdca

# Diff at Fri, 11 Oct 2024 13:33:22 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- current block number: 20942700

## Description

Standard Orbit stack Optimium with native token AZERO.

## Initial discovery

```diff
+   Status: CREATED
    contract OneStepProverHostIo (0x17e7F68ce50A77e55C7834ddF31AEf86403B8010)
    +++ description: None
```

```diff
+   Status: CREATED
    contract RollupProxy (0x1CA12290D954CFe022323b6A6Df92113ed6b1C98)
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
```

```diff
+   Status: CREATED
    contract  (0x27C7Bfd2cC11429e9b80c443b42FDBe4754F6c91)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ValidatorUtils (0x2b0E04Dc90e3fA58165CB41E2834B44A56E766aF)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Bridge (0x41Ec9456AB918f2aBA81F38c03Eb0B93b78E84d9)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ERC20RollupEventInbox (0x4e008aEeA79Fcd5708A7b46CA1732dFAf2a25B7d)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Inbox (0x56D8EC76a421063e1907503aDd3794c395256AEb)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProofEntry (0x57EA090Ac0554d174AE0e2855B460e84A1A7C221)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProver0 (0x72B166070781a552D7b95a907eF59ca05d3D5a62)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Outbox (0x73bb50c32a3BD6A1032aa5cFeA048fBDA3D6aF6e)
    +++ description: None
```

```diff
+   Status: CREATED
    contract  (0x7Deda2425eC2d4EA0DF689A78de2fBF002075576)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x80622fe04c5e1c3fbb3A9c62996dB27B53E9F77b)
    +++ description: None
```

```diff
+   Status: CREATED
    contract UpgradeExecutor (0x830D41c5624EE982cddEd92Ba01DAB3a4856116f)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProverMemory (0x8b73Ef238ADaB31EBC7c05423d243c345241a22f)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProverMath (0x90eC62De2EB7C7512a22bD2D55926AD6bA609F38)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ValidatorWalletCreator (0x9CAd81628aB7D8e239F1A5B497313341578c5F71)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ChallengeManager (0xb9e6987d1E0936b93f512bC89632E15DcA706d87)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1OrbitERC20Gateway (0xccaF21F002EAF230c9Fa810B34837a3739B70F7B)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1OrbitGatewayRouter (0xeBb17f398ed30d02F2e8733e7c1e5cf566e17812)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SequencerInbox (0xF75206c49c1694594E3e69252E519434f1579876)
    +++ description: State batches / commitments get posted here.
```
