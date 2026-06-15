Generated with discovered.json: 0x6b1193cd40192d42f0c8c272ed83b221486f2213

# Diff at Mon, 15 Jun 2026 08:08:46 GMT:

- author: vincfurc (<vincfurc@users.noreply.github.com>)
- comparing to: main@91b2eba1ff9c1c8341d0eaf6594dac4179405ef6 block: 1780925503
- current timestamp: 1781510846

## Description

Conduit Multisig 2 dropped one signer.

## Watched changes

```diff
    contract Conduit Multisig 2 (arb1:0x79C2abE3eBA9dc119318FdAaA48118e1CDB53F56) [GnosisSafe] {
    +++ description: None
      values.$members.4:
-        "arb1:0x65D1d44B8B2fE15d45A03708E0835C7E98a56007"
      values.multisigThreshold:
-        "4 of 11 (36%)"
+        "4 of 10 (40%)"
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1780925503 (main branch discovery), not current.

```diff
    EOA  (ethereal:0x98046Bd286715D3B0BC227Dd7a956b83D8978603) {
    +++ description: None
      controlsMajorityOfUpgradePermissions:
-        true
    }
```

```diff
    contract PythLazer (ethereal:0xACeA761c27A909d4D3895128EBe6370FDE2dF481) [ethereal/PythLazer] {
    +++ description: Used to verify offchain signed oracle data.
      category:
+        {"name":"Non-Critical","priority":0}
    }
```

Generated with discovered.json: 0xc7d4dd2e6c54d4e47f1c28e742912f58b7752db9

# Diff at Tue, 09 Jun 2026 12:43:33 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@ae67a38d37457ad735e5d55080d2e5479d5df7dc block: 1780925503
- current timestamp: 1780925503

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1780925503 (main branch discovery), not current.

```diff
    EOA  (arb1:0x12473dC3cBefb64337B6c7A772F25f4d2d9b45c3) {
    +++ description: None
      receivedPermissions.0.permission:
-        "sequence"
+        "interact"
    }
```

```diff
    EOA  (arb1:0x80e046764185e776100A4f59079C2B00327f279A) {
    +++ description: None
      receivedPermissions.0.permission:
-        "validate"
+        "interact"
    }
```

Generated with discovered.json: 0x7cccd5be719e64dbcaeacfb376df705ef75c7d5a

# Diff at Mon, 08 Jun 2026 13:33:31 GMT:

- author: vincfurc (<vincfurc@users.noreply.github.com>)
- comparing to: main@7b249a098f7367cb0ead3d881bbc57b408521134 block: 1780398295
- current timestamp: 1780925503

## Description

Ethereal SafeL2 (on ethereal chain) rotated one signer.

## Watched changes

```diff
    contract SafeL2 (ethereal:0x3F93bCc6201558aE2d7528a85575cF07679Bb50e) [GnosisSafe] {
    +++ description: None
      values.$members.0:
+        "ethereal:0x66096e581863EC2682e4E317Da41B80510a274F6"
      values.$members.1:
-        "ethereal:0xFBE49A82CB2BFF6Fa4C2B1F0d165A5E1175Aac83"
    }
```

Generated with discovered.json: 0xcb6d73c472180733e09d5b894f0c1b793852608b

# Diff at Tue, 02 Jun 2026 11:08:46 GMT:

- author: vincfurc (<vincfurc@users.noreply.github.com>)
- comparing to: main@8ad83b88dd9180e282e419267cebe10e93daf01d block: 1778232940
- current timestamp: 1780398295

## Description

Conduit Multisig 2 rotated one signer (operator key `0x3840…fd5f` → `0xcdC9…4853`); same rotation propagated across Conduit Multisigs 1/2/3 on eth/arb1/base.

## Watched changes

```diff
    contract Conduit Multisig 2 (arb1:0x79C2abE3eBA9dc119318FdAaA48118e1CDB53F56) [GnosisSafe] {
    +++ description: None
      values.$members.0:
+        "arb1:0xcdC931935768c0562AfE989A366a3Dc4d52F4853"
      values.$members.8:
-        "arb1:0x3840f487A17A41100DD1Bf0946c34f132a57Fd5f"
    }
```

Generated with discovered.json: 0x6517da95ca07737119b50ca2e3f673556c11bd78

# Diff at Fri, 22 May 2026 15:43:25 GMT:

- author: vincfurc (<vincfurc@users.noreply.github.com>)
- comparing to: main@1b7024bc804124af9b25421eca5fac952454cb09 block: 1778232940
- current timestamp: 1778232940

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1778232940 (main branch discovery), not current.

```diff
    contract RollupProxy (arb1:0x75c070fe237817Bd027d402327069e9cd07De078) [orbitstack/RollupProxyBoLD] {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new assertions (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both called Validators).
      usedTypes.0.arg.0xc2c02df561d4afaf9a1d6785f70098ec3874765c638e3cb6dbe8d3c83333e14c:
+        "ArbOS v51.1 wasmModuleRoot"
    }
```

Generated with discovered.json: 0x63cf88c36b008352fdf16cd77c0aa4987745ef7c

# Diff at Fri, 15 May 2026 12:35:53 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@a5152b9ba7ad7f85f2af3d814f74630fcaa7c917 block: 1778232940
- current timestamp: 1778232940

## Description

Shape hashes update after flattener improvements

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1778232940 (main branch discovery), not current.

```diff
    contract OneStepProverHostIo (arb1:0x18Cc27B3a95a6FdEf9EAA391eff28F48F42fFe3F) [orbitstack/OneStepProverHostIo] {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      sourceHashes.0:
-        "0x77205826da8d9f9fc88c16ff5e5d19f15f0dc037b43c41a051418acf0a8bbc3a"
+        "0x130f30b3e9318970d22dad0a549e532b9a19290ebaaad3a0ce20352ff33cc104"
    }
```

```diff
    contract OneStepProverMemory (arb1:0x583F8BA007580c83EFB4B02C66694096cD5c56d1) [orbitstack/OneStepProverMemory] {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      sourceHashes.0:
-        "0xd6db03371959751fe7d2023d543e1842bb9200ff391a235ea6f7a6eba3b5ace6"
+        "0xa7a92329b6a7a74a22b00e80ded5f76b2d46cddfc3fef149bd93c941f577388b"
    }
```

```diff
    contract OneStepProofEntry (arb1:0x61006c8566fac9a3315F646dA4624C00BbCF15E4) [orbitstack/OneStepProofEntry] {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      sourceHashes.0:
-        "0xd5ebe4d74cb7850108973c618f80d9f0c18624f45c9e8cfc3ffa07197ca1423d"
+        "0x8342918a09a9fc42d1b623e96c5f3ba476a095f6fb99d619383113945b1aee41"
    }
```

```diff
    contract OneStepProver0 (arb1:0x78B101eC9736c4Ab06b0833f01Fd4c011f7CA612) [orbitstack/OneStepProver0] {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      sourceHashes.0:
-        "0xb54274c3341eb7cf840d05f3da649b35db6e4f7cd4e76f3e4a8f2f6d171dcd66"
+        "0x165bc2eea08646ff24d665db74c1cd2deedc703052ceccac716f25eea2c23d80"
    }
```

```diff
    contract EdgeChallengeManager (arb1:0xA4444d9536595d35967206b86067a90aD053e1EF) [orbitstack/EdgeChallengeManager] {
    +++ description: Contract that implements the main challenge protocol logic of the fraud proof system.
      sourceHashes.1:
-        "0x38a98fd3246d8aa8d3efab5b6fe60b4369399691b395325bcea9f939a52fddc5"
+        "0xe3bfba89667a59af2f558ead22d7fe0c142232b464bdae0f9e4b03555c7699f2"
    }
```

Generated with discovered.json: 0xff5545e9036046fe801d925b528e16015b7d3793

# Diff at Fri, 08 May 2026 09:36:55 GMT:

- author: vincfurc (<vincfurc@users.noreply.github.com>)
- comparing to: main@870293220bb235daca193a6127d1bc5cc991c38c block: 1777994290
- current timestamp: 1778232940

## Description

ExchangeGateway-owning SafeL2 (`ethereal:0x14Fb412e...`, the one ethereal moved to on 2026-05-05) added 2 signers (`0xcE7a6c96`, `0x9D217887`). Threshold 2 → 3, total 3 → 5 (2-of-3 → 3-of-5).

## Watched changes

```diff
    contract SafeL2 (ethereal:0x14Fb412e1B692Cfc8C56ec285169e8bF27A7a351) [GnosisSafe] {
    +++ description: None
      values.$members.0:
+        "ethereal:0xcE7a6c96B0a351081a6053e6C95FA616555f3fb9"
      values.$members.1:
+        "ethereal:0x9D2178879e0387B1820168463670c43889536042"
      values.$threshold:
-        2
+        3
      values.multisigThreshold:
-        "2 of 3 (67%)"
+        "3 of 5 (60%)"
    }
```

Generated with discovered.json: 0x26528f28a22d7d91a12cb02d6586e18e6082fba0

# Diff at Fri, 08 May 2026 07:51:18 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@488d190650457a1fba9b18a83f14a17ab8b2c84c block: 1777994290
- current timestamp: 1777994290

## Description

Use the new flattener implementation

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1777994290 (main branch discovery), not current.

```diff
    contract SequencerInbox (arb1:0x0E2480384E3703FDf84c7A0448658E8C7543b3a8) [orbitstack/SequencerInbox] {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      sourceHashes.1:
-        "0xb57f3e67e08492b235337cda4f3ea0117e3e043cceaf8e9a7a51b57611ba99de"
+        "0xd9d7945b3c909d8777cc1798e1b56051640a57595cc65064235a913104f4e9e9"
      deployerAddress:
+        "arb1:0xd095aB623CFe1aBA384FAE82d9053FE5009DcaCD"
    }
```

```diff
    contract OneStepProverHostIo (arb1:0x18Cc27B3a95a6FdEf9EAA391eff28F48F42fFe3F) [orbitstack/OneStepProverHostIo] {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      sourceHashes.0:
-        "0x95e26ae3077f12aa3b383e87c553884e67eaf30c17ca083768d76822d0916cb8"
+        "0x77205826da8d9f9fc88c16ff5e5d19f15f0dc037b43c41a051418acf0a8bbc3a"
      deployerAddress:
+        "arb1:0xa4b1cd457E5635b64eBc8c5be3a1cA7543F7984D"
    }
```

```diff
    contract Ethereal Multisig (arb1:0x33Fbf4E75d54bBec0e432B6dc27bDEa0ca5DEdf9) [GnosisSafe] {
    +++ description: None
      sourceHashes.1:
-        "0x618c83d2fbbe19fd6f2d6ee6ee79a60e6206e48bf361eaf4812e1c1fc14b4527"
+        "0x076f4dffc7979344d7d248e876b1a947d75ebdf18b5746e3e2305d62eab1ab05"
      deployerAddress:
+        "arb1:0x620d7E459cfFcdC56a874536dC19147De801a4A1"
    }
```

```diff
    contract ERC20MigrationOutbox (arb1:0x3515ad5D3D904Cb2731A7d6E5DB9f35D6CAFEB14) [orbitstack/ERC20MigrationOutbox] {
    +++ description: Simple contract that, if set as allowedOutbox in the arb1:0xd86f5ad3fa5becbB07e565DbD4b70DBd817A43A8, allows to sweep all native tokens from the escrow to arb1:0x33Fbf4E75d54bBec0e432B6dc27bDEa0ca5DEdf9.
      deployerAddress:
+        "arb1:0xe74b5a7369847e0263a8de9F144f66622aD8E99F"
    }
```

```diff
    contract Inbox (arb1:0x574b121c469583c3a46cd88bBCC9Ac5c8C907d06) [orbitstack/Inbox] {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      sourceHashes.1:
-        "0x82dad78abdf27e168de1ae177b8055db4167106d71273d9a3264e9898a6055e4"
+        "0x03939c3cbd6c108ea9a077f61bb7ec6c3254fe21911bf5dfdb3c0efcb636e796"
      deployerAddress:
+        "arb1:0xd095aB623CFe1aBA384FAE82d9053FE5009DcaCD"
    }
```

```diff
    contract OneStepProverMemory (arb1:0x583F8BA007580c83EFB4B02C66694096cD5c56d1) [orbitstack/OneStepProverMemory] {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      sourceHashes.0:
-        "0x9da1c11f886667abb57a92659891b066372dde4fe1a3eebce72c722ecf872874"
+        "0xd6db03371959751fe7d2023d543e1842bb9200ff391a235ea6f7a6eba3b5ace6"
      deployerAddress:
+        "arb1:0xa4b1cd457E5635b64eBc8c5be3a1cA7543F7984D"
    }
```

```diff
    contract RollupEventInbox (arb1:0x5D6bec85F093Eb49bD6913aCe7e9A081c41aed8F) [orbitstack/RollupEventInbox] {
    +++ description: Helper contract sending configuration data over the bridge during the systems initialization.
      sourceHashes.1:
-        "0x089ac3cec821c0f014f284ec4ec1039ef6bc50b6ad3ee47c82e20af65cc30c33"
+        "0x30d86d66b2eba9a29c67fd3a446f636d4d7835b6d679dab61a2cfc6e10b97b23"
      deployerAddress:
+        "arb1:0xd095aB623CFe1aBA384FAE82d9053FE5009DcaCD"
    }
```

```diff
    contract OneStepProofEntry (arb1:0x61006c8566fac9a3315F646dA4624C00BbCF15E4) [orbitstack/OneStepProofEntry] {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      sourceHashes.0:
-        "0xfdda77bfcb4ee6e1d88939c755d6eda90f3250c8053b15b511ad9148cce8a787"
+        "0xd5ebe4d74cb7850108973c618f80d9f0c18624f45c9e8cfc3ffa07197ca1423d"
      deployerAddress:
+        "arb1:0xa4b1cd457E5635b64eBc8c5be3a1cA7543F7984D"
    }
```

```diff
    contract RollupProxy (arb1:0x75c070fe237817Bd027d402327069e9cd07De078) [orbitstack/RollupProxyBoLD] {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new assertions (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both called Validators).
      sourceHashes.0:
-        "0x951637f3a8787d8273dbd619921f256bd87a38b9d955e65c2e520772c2e0a642"
+        "0xc66527a2dd7fcfbb954018194b0db35218725aa1072451f6ec2470d103b4a0a2"
      sourceHashes.1:
-        "0x7b0429a0a98808dee6774a44d8d1ed15305ecc4b6fee4670db2d49f9caf65e51"
+        "0x865eda6aeccd46252ab6f23f58421b95f106676e38c62d4aaa768a6d5f2c26e9"
      deployerAddress:
+        "arb1:0x81175155D85377C337d92f1FA52Da166C3A4E7Ac"
    }
```

```diff
    contract OneStepProver0 (arb1:0x78B101eC9736c4Ab06b0833f01Fd4c011f7CA612) [orbitstack/OneStepProver0] {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      sourceHashes.0:
-        "0x549b7c350bf6e1da7e8aa5fda9440889a76d5611ed7c6e37411d364ee36f8d5b"
+        "0xb54274c3341eb7cf840d05f3da649b35db6e4f7cd4e76f3e4a8f2f6d171dcd66"
      deployerAddress:
+        "arb1:0xa4b1cd457E5635b64eBc8c5be3a1cA7543F7984D"
    }
```

```diff
    contract Conduit Multisig 2 (arb1:0x79C2abE3eBA9dc119318FdAaA48118e1CDB53F56) [GnosisSafe] {
    +++ description: None
      sourceHashes.1:
-        "0x59fe14e95a8aa7f52213f18bae5c9329cf583a7ba31194698b15eddb97d5e825"
+        "0xf88f29d444411e68fef376c8e035ef1f39314143a7b6aff952709203095663bd"
      deployerAddress:
+        "arb1:0x5553a23a71Bc7985c8E58Ca08072D2Fa9D1D1F4c"
    }
```

```diff
    contract Outbox (arb1:0xA2A5DCA414e3AaBD48B9CA97426f7e3Fba967492) [orbitstack/Outbox] {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
      sourceHashes.1:
-        "0xfc1c087eedce3e4be0593d2e01fcd357b4980c69e03399574b4606e4f3b9ee04"
+        "0xb9f7bc73978fab23b0df754fac230d706fee0d774d97b8533b62b3014d5561a8"
      deployerAddress:
+        "arb1:0xd095aB623CFe1aBA384FAE82d9053FE5009DcaCD"
    }
```

```diff
    contract EdgeChallengeManager (arb1:0xA4444d9536595d35967206b86067a90aD053e1EF) [orbitstack/EdgeChallengeManager] {
    +++ description: Contract that implements the main challenge protocol logic of the fraud proof system.
      sourceHashes.1:
-        "0x6c09a44175196122c17b285af0789d13088361d0f4244fbe65f00f40d3036cb8"
+        "0x38a98fd3246d8aa8d3efab5b6fe60b4369399691b395325bcea9f939a52fddc5"
      deployerAddress:
+        "arb1:0x81175155D85377C337d92f1FA52Da166C3A4E7Ac"
    }
```

```diff
    contract OneStepProverMath (arb1:0xB08Ca18499389ABfDF7b14b09BD2Bd4d56D7fbbb) [orbitstack/OneStepProverMath] {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      sourceHashes.0:
-        "0xeb0b77a8bbbb65eabcb1e26f29f9eac4db26d0b5974e37d9cc57ffc03b7be0e1"
+        "0x5bd5c472d09dfca8febfe8da2a09b7c0a1a11653ed9a4908ce4719abc68caf2b"
      deployerAddress:
+        "arb1:0xa4b1cd457E5635b64eBc8c5be3a1cA7543F7984D"
    }
```

```diff
    contract ProxyAdmin (arb1:0xc1136ea5F91f82cb468Fc7650579A95605D9f5C2) [global/ProxyAdmin] {
    +++ description: None
      deployerAddress:
+        "arb1:0xd095aB623CFe1aBA384FAE82d9053FE5009DcaCD"
    }
```

```diff
    contract Bridge (arb1:0xd86f5ad3fa5becbB07e565DbD4b70DBd817A43A8) [orbitstack/Bridge] {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      sourceHashes.1:
-        "0x7f62b9bd4a0aac711ca355a523b1d934ab93ae14c5fae5a860c0ded42ee5a3c3"
+        "0xcf23a1556783b1256851289ed1e962cbab0633dca95bc20654f016b52c1d4fae"
      deployerAddress:
+        "arb1:0xd095aB623CFe1aBA384FAE82d9053FE5009DcaCD"
    }
```

```diff
    contract UpgradeExecutor (arb1:0xDde7f92D0f2225f5951564D387e158b9b57f95F3) [orbitstack/UpgradeExecutor] {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      sourceHashes.1:
-        "0xa7ff878cfd433a428d567d3b90fe1df400a048a1af5298f22cd4cd4fc25bdecd"
+        "0x11607080f3c3b6b77778e75183e140bfe8604333e71de324adebee0f02b9dbcc"
      deployerAddress:
+        "arb1:0xd095aB623CFe1aBA384FAE82d9053FE5009DcaCD"
    }
```

```diff
    contract SafeL2 (ethereal:0x14Fb412e1B692Cfc8C56ec285169e8bF27A7a351) [GnosisSafe] {
    +++ description: None
      sourceHashes.1:
-        "0x618c83d2fbbe19fd6f2d6ee6ee79a60e6206e48bf361eaf4812e1c1fc14b4527"
+        "0x076f4dffc7979344d7d248e876b1a947d75ebdf18b5746e3e2305d62eab1ab05"
      deployerAddress:
+        "ethereal:0x4320A9290720462F0cd5dfB0F0B9bD4D4A74A8D3"
    }
```

```diff
    contract SafeL2 (ethereal:0x3F93bCc6201558aE2d7528a85575cF07679Bb50e) [GnosisSafe] {
    +++ description: None
      sourceHashes.1:
-        "0x618c83d2fbbe19fd6f2d6ee6ee79a60e6206e48bf361eaf4812e1c1fc14b4527"
+        "0x076f4dffc7979344d7d248e876b1a947d75ebdf18b5746e3e2305d62eab1ab05"
      deployerAddress:
+        "ethereal:0xb93C042c688F1Cf038bab03C4F832F2630Bb7d8F"
    }
```

```diff
    contract SafeL2 (ethereal:0x58a16791037dF85CCbc3A65DE5a8401Fd04C8aC8) [GnosisSafe] {
    +++ description: None
      sourceHashes.1:
-        "0x618c83d2fbbe19fd6f2d6ee6ee79a60e6206e48bf361eaf4812e1c1fc14b4527"
+        "0x076f4dffc7979344d7d248e876b1a947d75ebdf18b5746e3e2305d62eab1ab05"
      deployerAddress:
+        "ethereal:0x0B9E74f490d731690Da1D0C70F7DB9433C9B4658"
    }
```

```diff
    contract Liquidation (ethereal:0x636DE0449C4175C8AA66989ab34fab5373e044f1) [ethereal/ExchangeGatewayRegistryContracts] {
    +++ description: Auxiliary contract of the ExchangeGateway.
      sourceHashes.0:
-        "0x6aac002e19307973aae2c7f4e38a5804b35dff1da8b348242101dc26b8f6b5b3"
+        "0x9cee872c7e0a49b46aa8f9658d16530e50e5989aa34cecea6e4fd75968589123"
      deployerAddress:
+        "ethereal:0xae703b505f9284cf0eC2E9A907637238EF5d9b11"
    }
```

```diff
    contract CollateralManager (ethereal:0x638D6DaC0550f30f37aC5784260309Ac89302faA) [ethereal/ExchangeGatewayRegistryContracts] {
    +++ description: Auxiliary contract of the ExchangeGateway.
      sourceHashes.0:
-        "0x09b192ba7fe0c948d056b981a202a7c6bf2f7535255539908256c1914b716764"
+        "0x7e9156bdbe2b0f1e2fca8925f034693bdf5abaae1b868270c2a4f44956e1ea6a"
      deployerAddress:
+        "ethereal:0xae703b505f9284cf0eC2E9A907637238EF5d9b11"
    }
```

```diff
    contract ActionHandler (ethereal:0x70702e58005f3b91f9c8dFBe3A170051Ee61cf96) [ethereal/ExchangeGatewayRegistryContracts] {
    +++ description: Auxiliary contract of the ExchangeGateway.
      sourceHashes.0:
-        "0xad7e7fd7b43fd83e9a1b0fb841090fe2c1a4244dbc6b2a9a64780714e1cdf93a"
+        "0x92593ae99a9bb91cca005c4db1025ad553c96de856d66c0ee21e2ad15daf1634"
      deployerAddress:
+        "ethereal:0xae703b505f9284cf0eC2E9A907637238EF5d9b11"
    }
```

```diff
    contract OrbitNativeOFTAdapter (ethereal:0x80F981abC18A48CfdbDe5556F9B72e6a726F0FF3) [layerzero/OrbitNativeOFTAdapter] {
    +++ description: An OApp in the LayerZero protocol. It allows to mint the native token using the arbNativeTokenManager precompile on ArbOs. This means that the native token inherits all trust assumptions of the LayerZero security stack configured for this OApp and its crosschein peers, including minting and burning.
      sourceHashes.0:
-        "0x06bfc09649a2d808ed13a12f95572720fa8ccd81e6d2c2206f879d4495257925"
+        "0xdc7fa9200a150735467f7b832663c27d5df9487fe7a30b8b8abc3d3e833081ff"
      deployerAddress:
+        "ethereal:0x31a9FFd7bCea9fC810D96D85DB701dC3f04710Dd"
    }
```

```diff
    contract PythLazer (ethereal:0xACeA761c27A909d4D3895128EBe6370FDE2dF481) [ethereal/PythLazer] {
    +++ description: Used to verify offchain signed oracle data.
      sourceHashes.0:
-        "0x29faf4889af43049c742ca34aeff493c079c023986c7f794a3dbfe3b1c642d09"
+        "0xf66f390c3291bc5b8725bf8fa36d64494b91e8cfb2b717b52e85adcc68dcdd50"
      sourceHashes.1:
-        "0xb75ff3068e1db24addb7f90f7c75fccf57377621aa5e5c513fb73d164c28455c"
+        "0x8116841183f2287b1cd74715261b90dd53e082d3f96ca03d900945950329fccc"
      deployerAddress:
+        "ethereal:0x78357316239040e19fC823372cC179ca75e64b81"
    }
```

```diff
    contract ExchangeGateway (ethereal:0xB3cDC82035C495c484C9fF11eD5f3Ff6d342e3cc) [ethereal/ExchangeGateway] {
    +++ description: Main contract of the Ethereal DEX. Entrypoint for users to deposit and withdraw funds and for operators submit user actions.
      sourceHashes.1:
-        "0x86b45155220c874371724e1491434de1633d3c9ec81f0e45455e5621da661872"
+        "0xb5045a4ff694fdc0973c7f5b6a61bc6178a601b89c90fc21faff429e9867bbfd"
      deployerAddress:
+        "ethereal:0xae703b505f9284cf0eC2E9A907637238EF5d9b11"
    }
```

```diff
    contract ExchangeConfig (ethereal:0xC199cC890F61B847bec9cec4212C35b759A9fD38) [ethereal/ExchangeGatewayRegistryContracts] {
    +++ description: Auxiliary contract of the ExchangeGateway.
      sourceHashes.0:
-        "0x9ffa8cb4f60c8030f1786fd22cc1e6f9903e82114fb4ae3f713c47f60178c0de"
+        "0x2eb254b441530c0a6a36c063566a20b1b99f95ee5d7100456468373d3d97e905"
      deployerAddress:
+        "ethereal:0xae703b505f9284cf0eC2E9A907637238EF5d9b11"
    }
```

```diff
    contract PerpEngine (ethereal:0xCc0385301a10191b7ac633A64742a34F2e4cFB37) [ethereal/ExchangeGatewayRegistryContracts] {
    +++ description: Auxiliary contract of the ExchangeGateway.
      sourceHashes.0:
-        "0x1f2d6ea306a2ce3c1e94fee76d9184cd06fa8a76178bc2a973d42d495f56d3cf"
+        "0x56d246b21257a122c9a36355cbe338200a35274157d5e06d354df138145365f5"
      deployerAddress:
+        "ethereal:0xae703b505f9284cf0eC2E9A907637238EF5d9b11"
    }
```

```diff
    contract Deleverage (ethereal:0xF0597CF73cBdB97484c439533bdDBF733BfDf84B) [ethereal/ExchangeGatewayRegistryContracts] {
    +++ description: Auxiliary contract of the ExchangeGateway.
      sourceHashes.0:
-        "0xcf06ecba5335035199e65edcc6e047920089cd2ef278275008a53a8c4af61045"
+        "0x8c1e8d72f479be706a4a4e2347f8720df282d156fe80278400864c17c67e2490"
      deployerAddress:
+        "ethereal:0xae703b505f9284cf0eC2E9A907637238EF5d9b11"
    }
```

Generated with discovered.json: 0xef0b5269eb16ec1906e952ef2e31bc69dc222e50

# Diff at Tue, 05 May 2026 15:19:30 GMT:

- author: vincfurc (<vincfurc@users.noreply.github.com>)
- comparing to: main@c30884758a8f4ef4178d2eb572fb25911670bcff block: 1777390976
- current timestamp: 1777994290

## Description

ExchangeGateway admin/owner moved from old SafeL2 (`0xae703b50...`) to a newly-deployed SafeL2 (`0x14Fb412e...`). The old SafeL2 also had member `0x690d1E0f` removed (5-of-11 → 5-of-10). Net effect: governance over the DEX entrypoint shifted to a new multisig contract.

## Watched changes

```diff
    contract SafeL2 (ethereal:0x3F93bCc6201558aE2d7528a85575cF07679Bb50e) {
    +++ description: None
      values.$members.10:
-        "ethereal:0x690d1E0fac0599874b849EE88AeA27F7b348e1f2"
      values.multisigThreshold:
-        "5 of 11 (45%)"
+        "5 of 10 (50%)"
    }
```

```diff
    contract ExchangeGateway (ethereal:0xB3cDC82035C495c484C9fF11eD5f3Ff6d342e3cc) {
    +++ description: Main contract of the Ethereal DEX. Entrypoint for users to deposit and withdraw funds and for operators submit user actions.
      values.$admin:
-        "ethereal:0xae703b505f9284cf0eC2E9A907637238EF5d9b11"
+        "ethereal:0x14Fb412e1B692Cfc8C56ec285169e8bF27A7a351"
      values.owner:
-        "ethereal:0xae703b505f9284cf0eC2E9A907637238EF5d9b11"
+        "ethereal:0x14Fb412e1B692Cfc8C56ec285169e8bF27A7a351"
    }
```

```diff
+   Status: CREATED
    contract SafeL2 (ethereal:0x14Fb412e1B692Cfc8C56ec285169e8bF27A7a351)
    +++ description: None
```

## Source code changes

```diff
.../SafeL2.sol                                     | 1286 ++++++++++++++++++++
 .../SafeProxy.p.sol                                |   42 +
 2 files changed, 1328 insertions(+)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1777390976 (main branch discovery), not current.

```diff
    contract SequencerInbox (arb1:0x0E2480384E3703FDf84c7A0448658E8C7543b3a8) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      deployerAddress:
-        "arb1:0xd095aB623CFe1aBA384FAE82d9053FE5009DcaCD"
    }
```

```diff
    contract OneStepProverHostIo (arb1:0x18Cc27B3a95a6FdEf9EAA391eff28F48F42fFe3F) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      deployerAddress:
-        "arb1:0xa4b1cd457E5635b64eBc8c5be3a1cA7543F7984D"
    }
```

```diff
    contract Ethereal Multisig (arb1:0x33Fbf4E75d54bBec0e432B6dc27bDEa0ca5DEdf9) {
    +++ description: None
      deployerAddress:
-        "arb1:0x620d7E459cfFcdC56a874536dC19147De801a4A1"
    }
```

```diff
    contract ERC20MigrationOutbox (arb1:0x3515ad5D3D904Cb2731A7d6E5DB9f35D6CAFEB14) {
    +++ description: Simple contract that, if set as allowedOutbox in the arb1:0xd86f5ad3fa5becbB07e565DbD4b70DBd817A43A8, allows to sweep all native tokens from the escrow to arb1:0x33Fbf4E75d54bBec0e432B6dc27bDEa0ca5DEdf9.
      deployerAddress:
-        "arb1:0xe74b5a7369847e0263a8de9F144f66622aD8E99F"
    }
```

```diff
    contract Inbox (arb1:0x574b121c469583c3a46cd88bBCC9Ac5c8C907d06) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      deployerAddress:
-        "arb1:0xd095aB623CFe1aBA384FAE82d9053FE5009DcaCD"
    }
```

```diff
    contract OneStepProverMemory (arb1:0x583F8BA007580c83EFB4B02C66694096cD5c56d1) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      deployerAddress:
-        "arb1:0xa4b1cd457E5635b64eBc8c5be3a1cA7543F7984D"
    }
```

```diff
    contract RollupEventInbox (arb1:0x5D6bec85F093Eb49bD6913aCe7e9A081c41aed8F) {
    +++ description: Helper contract sending configuration data over the bridge during the systems initialization.
      deployerAddress:
-        "arb1:0xd095aB623CFe1aBA384FAE82d9053FE5009DcaCD"
    }
```

```diff
    contract OneStepProofEntry (arb1:0x61006c8566fac9a3315F646dA4624C00BbCF15E4) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      deployerAddress:
-        "arb1:0xa4b1cd457E5635b64eBc8c5be3a1cA7543F7984D"
    }
```

```diff
    contract RollupProxy (arb1:0x75c070fe237817Bd027d402327069e9cd07De078) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new assertions (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both called Validators).
      deployerAddress:
-        "arb1:0x81175155D85377C337d92f1FA52Da166C3A4E7Ac"
    }
```

```diff
    contract OneStepProver0 (arb1:0x78B101eC9736c4Ab06b0833f01Fd4c011f7CA612) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      deployerAddress:
-        "arb1:0xa4b1cd457E5635b64eBc8c5be3a1cA7543F7984D"
    }
```

```diff
    contract Conduit Multisig 2 (arb1:0x79C2abE3eBA9dc119318FdAaA48118e1CDB53F56) {
    +++ description: None
      deployerAddress:
-        "arb1:0x5553a23a71Bc7985c8E58Ca08072D2Fa9D1D1F4c"
    }
```

```diff
    contract Outbox (arb1:0xA2A5DCA414e3AaBD48B9CA97426f7e3Fba967492) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
      deployerAddress:
-        "arb1:0xd095aB623CFe1aBA384FAE82d9053FE5009DcaCD"
    }
```

```diff
    contract EdgeChallengeManager (arb1:0xA4444d9536595d35967206b86067a90aD053e1EF) {
    +++ description: Contract that implements the main challenge protocol logic of the fraud proof system.
      deployerAddress:
-        "arb1:0x81175155D85377C337d92f1FA52Da166C3A4E7Ac"
    }
```

```diff
    contract OneStepProverMath (arb1:0xB08Ca18499389ABfDF7b14b09BD2Bd4d56D7fbbb) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      deployerAddress:
-        "arb1:0xa4b1cd457E5635b64eBc8c5be3a1cA7543F7984D"
    }
```

```diff
    contract ProxyAdmin (arb1:0xc1136ea5F91f82cb468Fc7650579A95605D9f5C2) {
    +++ description: None
      deployerAddress:
-        "arb1:0xd095aB623CFe1aBA384FAE82d9053FE5009DcaCD"
    }
```

```diff
    contract Bridge (arb1:0xd86f5ad3fa5becbB07e565DbD4b70DBd817A43A8) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      deployerAddress:
-        "arb1:0xd095aB623CFe1aBA384FAE82d9053FE5009DcaCD"
    }
```

```diff
    contract UpgradeExecutor (arb1:0xDde7f92D0f2225f5951564D387e158b9b57f95F3) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      deployerAddress:
-        "arb1:0xd095aB623CFe1aBA384FAE82d9053FE5009DcaCD"
    }
```

```diff
    contract SafeL2 (ethereal:0x3F93bCc6201558aE2d7528a85575cF07679Bb50e) {
    +++ description: None
      deployerAddress:
-        "ethereal:0xb93C042c688F1Cf038bab03C4F832F2630Bb7d8F"
    }
```

```diff
    contract SafeL2 (ethereal:0x58a16791037dF85CCbc3A65DE5a8401Fd04C8aC8) {
    +++ description: None
      deployerAddress:
-        "ethereal:0x0B9E74f490d731690Da1D0C70F7DB9433C9B4658"
    }
```

```diff
    contract Liquidation (ethereal:0x636DE0449C4175C8AA66989ab34fab5373e044f1) {
    +++ description: Auxiliary contract of the ExchangeGateway.
      deployerAddress:
-        "ethereal:0xae703b505f9284cf0eC2E9A907637238EF5d9b11"
    }
```

```diff
    contract CollateralManager (ethereal:0x638D6DaC0550f30f37aC5784260309Ac89302faA) {
    +++ description: Auxiliary contract of the ExchangeGateway.
      deployerAddress:
-        "ethereal:0xae703b505f9284cf0eC2E9A907637238EF5d9b11"
    }
```

```diff
    contract ActionHandler (ethereal:0x70702e58005f3b91f9c8dFBe3A170051Ee61cf96) {
    +++ description: Auxiliary contract of the ExchangeGateway.
      deployerAddress:
-        "ethereal:0xae703b505f9284cf0eC2E9A907637238EF5d9b11"
    }
```

```diff
    contract OrbitNativeOFTAdapter (ethereal:0x80F981abC18A48CfdbDe5556F9B72e6a726F0FF3) {
    +++ description: An OApp in the LayerZero protocol. It allows to mint the native token using the arbNativeTokenManager precompile on ArbOs. This means that the native token inherits all trust assumptions of the LayerZero security stack configured for this OApp and its crosschein peers, including minting and burning.
      deployerAddress:
-        "ethereal:0x31a9FFd7bCea9fC810D96D85DB701dC3f04710Dd"
    }
```

```diff
    contract PythLazer (ethereal:0xACeA761c27A909d4D3895128EBe6370FDE2dF481) {
    +++ description: Used to verify offchain signed oracle data.
      deployerAddress:
-        "ethereal:0x78357316239040e19fC823372cC179ca75e64b81"
    }
```

```diff
    contract ExchangeGateway (ethereal:0xB3cDC82035C495c484C9fF11eD5f3Ff6d342e3cc) {
    +++ description: Main contract of the Ethereal DEX. Entrypoint for users to deposit and withdraw funds and for operators submit user actions.
      deployerAddress:
-        "ethereal:0xae703b505f9284cf0eC2E9A907637238EF5d9b11"
    }
```

```diff
    contract ExchangeConfig (ethereal:0xC199cC890F61B847bec9cec4212C35b759A9fD38) {
    +++ description: Auxiliary contract of the ExchangeGateway.
      deployerAddress:
-        "ethereal:0xae703b505f9284cf0eC2E9A907637238EF5d9b11"
    }
```

```diff
    contract PerpEngine (ethereal:0xCc0385301a10191b7ac633A64742a34F2e4cFB37) {
    +++ description: Auxiliary contract of the ExchangeGateway.
      deployerAddress:
-        "ethereal:0xae703b505f9284cf0eC2E9A907637238EF5d9b11"
    }
```

```diff
    contract Deleverage (ethereal:0xF0597CF73cBdB97484c439533bdDBF733BfDf84B) {
    +++ description: Auxiliary contract of the ExchangeGateway.
      deployerAddress:
-        "ethereal:0xae703b505f9284cf0eC2E9A907637238EF5d9b11"
    }
```

Generated with discovered.json: 0x2104e76e7047367b3d338b01bd8d599cf211cfe7

# Diff at Tue, 05 May 2026 10:22:09 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@b6437082b3ea8fb0d97f4474b1c3452a1ce271b0 block: 1777390976
- current timestamp: 1777390976

## Description

Include deployer address

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1777390976 (main branch discovery), not current.

```diff
    contract SequencerInbox (arb1:0x0E2480384E3703FDf84c7A0448658E8C7543b3a8) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      deployerAddress:
+        "arb1:0xd095aB623CFe1aBA384FAE82d9053FE5009DcaCD"
    }
```

```diff
    contract OneStepProverHostIo (arb1:0x18Cc27B3a95a6FdEf9EAA391eff28F48F42fFe3F) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      deployerAddress:
+        "arb1:0xa4b1cd457E5635b64eBc8c5be3a1cA7543F7984D"
    }
```

```diff
    contract Ethereal Multisig (arb1:0x33Fbf4E75d54bBec0e432B6dc27bDEa0ca5DEdf9) {
    +++ description: None
      deployerAddress:
+        "arb1:0x620d7E459cfFcdC56a874536dC19147De801a4A1"
    }
```

```diff
    contract ERC20MigrationOutbox (arb1:0x3515ad5D3D904Cb2731A7d6E5DB9f35D6CAFEB14) {
    +++ description: Simple contract that, if set as allowedOutbox in the arb1:0xd86f5ad3fa5becbB07e565DbD4b70DBd817A43A8, allows to sweep all native tokens from the escrow to arb1:0x33Fbf4E75d54bBec0e432B6dc27bDEa0ca5DEdf9.
      deployerAddress:
+        "arb1:0xe74b5a7369847e0263a8de9F144f66622aD8E99F"
    }
```

```diff
    contract Inbox (arb1:0x574b121c469583c3a46cd88bBCC9Ac5c8C907d06) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      deployerAddress:
+        "arb1:0xd095aB623CFe1aBA384FAE82d9053FE5009DcaCD"
    }
```

```diff
    contract OneStepProverMemory (arb1:0x583F8BA007580c83EFB4B02C66694096cD5c56d1) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      deployerAddress:
+        "arb1:0xa4b1cd457E5635b64eBc8c5be3a1cA7543F7984D"
    }
```

```diff
    contract RollupEventInbox (arb1:0x5D6bec85F093Eb49bD6913aCe7e9A081c41aed8F) {
    +++ description: Helper contract sending configuration data over the bridge during the systems initialization.
      deployerAddress:
+        "arb1:0xd095aB623CFe1aBA384FAE82d9053FE5009DcaCD"
    }
```

```diff
    contract OneStepProofEntry (arb1:0x61006c8566fac9a3315F646dA4624C00BbCF15E4) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      deployerAddress:
+        "arb1:0xa4b1cd457E5635b64eBc8c5be3a1cA7543F7984D"
    }
```

```diff
    contract RollupProxy (arb1:0x75c070fe237817Bd027d402327069e9cd07De078) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new assertions (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both called Validators).
      deployerAddress:
+        "arb1:0x81175155D85377C337d92f1FA52Da166C3A4E7Ac"
    }
```

```diff
    contract OneStepProver0 (arb1:0x78B101eC9736c4Ab06b0833f01Fd4c011f7CA612) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      deployerAddress:
+        "arb1:0xa4b1cd457E5635b64eBc8c5be3a1cA7543F7984D"
    }
```

```diff
    contract Conduit Multisig 2 (arb1:0x79C2abE3eBA9dc119318FdAaA48118e1CDB53F56) {
    +++ description: None
      deployerAddress:
+        "arb1:0x5553a23a71Bc7985c8E58Ca08072D2Fa9D1D1F4c"
    }
```

```diff
    contract Outbox (arb1:0xA2A5DCA414e3AaBD48B9CA97426f7e3Fba967492) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
      deployerAddress:
+        "arb1:0xd095aB623CFe1aBA384FAE82d9053FE5009DcaCD"
    }
```

```diff
    contract EdgeChallengeManager (arb1:0xA4444d9536595d35967206b86067a90aD053e1EF) {
    +++ description: Contract that implements the main challenge protocol logic of the fraud proof system.
      deployerAddress:
+        "arb1:0x81175155D85377C337d92f1FA52Da166C3A4E7Ac"
    }
```

```diff
    contract OneStepProverMath (arb1:0xB08Ca18499389ABfDF7b14b09BD2Bd4d56D7fbbb) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      deployerAddress:
+        "arb1:0xa4b1cd457E5635b64eBc8c5be3a1cA7543F7984D"
    }
```

```diff
    contract ProxyAdmin (arb1:0xc1136ea5F91f82cb468Fc7650579A95605D9f5C2) {
    +++ description: None
      deployerAddress:
+        "arb1:0xd095aB623CFe1aBA384FAE82d9053FE5009DcaCD"
    }
```

```diff
    contract Bridge (arb1:0xd86f5ad3fa5becbB07e565DbD4b70DBd817A43A8) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      deployerAddress:
+        "arb1:0xd095aB623CFe1aBA384FAE82d9053FE5009DcaCD"
    }
```

```diff
    contract UpgradeExecutor (arb1:0xDde7f92D0f2225f5951564D387e158b9b57f95F3) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      deployerAddress:
+        "arb1:0xd095aB623CFe1aBA384FAE82d9053FE5009DcaCD"
    }
```

```diff
    contract SafeL2 (ethereal:0x3F93bCc6201558aE2d7528a85575cF07679Bb50e) {
    +++ description: None
      deployerAddress:
+        "ethereal:0xb93C042c688F1Cf038bab03C4F832F2630Bb7d8F"
    }
```

```diff
    contract SafeL2 (ethereal:0x58a16791037dF85CCbc3A65DE5a8401Fd04C8aC8) {
    +++ description: None
      deployerAddress:
+        "ethereal:0x0B9E74f490d731690Da1D0C70F7DB9433C9B4658"
    }
```

```diff
    contract Liquidation (ethereal:0x636DE0449C4175C8AA66989ab34fab5373e044f1) {
    +++ description: Auxiliary contract of the ExchangeGateway.
      deployerAddress:
+        "ethereal:0xae703b505f9284cf0eC2E9A907637238EF5d9b11"
    }
```

```diff
    contract CollateralManager (ethereal:0x638D6DaC0550f30f37aC5784260309Ac89302faA) {
    +++ description: Auxiliary contract of the ExchangeGateway.
      deployerAddress:
+        "ethereal:0xae703b505f9284cf0eC2E9A907637238EF5d9b11"
    }
```

```diff
    contract ActionHandler (ethereal:0x70702e58005f3b91f9c8dFBe3A170051Ee61cf96) {
    +++ description: Auxiliary contract of the ExchangeGateway.
      deployerAddress:
+        "ethereal:0xae703b505f9284cf0eC2E9A907637238EF5d9b11"
    }
```

```diff
    contract OrbitNativeOFTAdapter (ethereal:0x80F981abC18A48CfdbDe5556F9B72e6a726F0FF3) {
    +++ description: An OApp in the LayerZero protocol. It allows to mint the native token using the arbNativeTokenManager precompile on ArbOs. This means that the native token inherits all trust assumptions of the LayerZero security stack configured for this OApp and its crosschein peers, including minting and burning.
      deployerAddress:
+        "ethereal:0x31a9FFd7bCea9fC810D96D85DB701dC3f04710Dd"
    }
```

```diff
    contract PythLazer (ethereal:0xACeA761c27A909d4D3895128EBe6370FDE2dF481) {
    +++ description: Used to verify offchain signed oracle data.
      deployerAddress:
+        "ethereal:0x78357316239040e19fC823372cC179ca75e64b81"
    }
```

```diff
    contract ExchangeGateway (ethereal:0xB3cDC82035C495c484C9fF11eD5f3Ff6d342e3cc) {
    +++ description: Main contract of the Ethereal DEX. Entrypoint for users to deposit and withdraw funds and for operators submit user actions.
      deployerAddress:
+        "ethereal:0xae703b505f9284cf0eC2E9A907637238EF5d9b11"
    }
```

```diff
    contract ExchangeConfig (ethereal:0xC199cC890F61B847bec9cec4212C35b759A9fD38) {
    +++ description: Auxiliary contract of the ExchangeGateway.
      deployerAddress:
+        "ethereal:0xae703b505f9284cf0eC2E9A907637238EF5d9b11"
    }
```

```diff
    contract PerpEngine (ethereal:0xCc0385301a10191b7ac633A64742a34F2e4cFB37) {
    +++ description: Auxiliary contract of the ExchangeGateway.
      deployerAddress:
+        "ethereal:0xae703b505f9284cf0eC2E9A907637238EF5d9b11"
    }
```

```diff
    contract Deleverage (ethereal:0xF0597CF73cBdB97484c439533bdDBF733BfDf84B) {
    +++ description: Auxiliary contract of the ExchangeGateway.
      deployerAddress:
+        "ethereal:0xae703b505f9284cf0eC2E9A907637238EF5d9b11"
    }
```

Generated with discovered.json: 0xbe6dfe7412d54023b942402afee12a00726d6e44

# Diff at Tue, 28 Apr 2026 15:45:53 GMT:

- author: vincfurc (<vincfurc@users.noreply.github.com>)
- comparing to: main@0695512a70f7175257fb7756eb2008702d3f0dc5 block: 1776375286
- current timestamp: 1777390976

## Description

Conduit Multisig 2 (`arb1:0x79C2abE3...`) — signer `0x381624F7` removed. Threshold unchanged at 4; total signers 12 → 11 (33% → 36%). Same shared multisig change observed on `superposition`.

## Watched changes

```diff
    contract Conduit Multisig 2 (arb1:0x79C2abE3eBA9dc119318FdAaA48118e1CDB53F56) {
    +++ description: None
      values.$members.1:
-        "arb1:0x381624F7912BddD83dc67c6C53Ef6FE61B87Cf07"
      values.multisigThreshold:
-        "4 of 12 (33%)"
+        "4 of 11 (36%)"
    }
```

Generated with discovered.json: 0x6871f8f9707aab87c4342335adbb72027b6cc7df

# Diff at Thu, 16 Apr 2026 21:36:02 GMT:

- author: vincfurc (<vincfurc@users.noreply.github.com>)
- comparing to: main@dbe59fab54b844bd6d80a91ca8129ddbc1292028 block: 1770823999
- current timestamp: 1776375286

## Description

ExchangeGateway upgraded (still delegatecalls auxiliary modules via the registry). ActionHandler and Liquidation redeployed at new addresses; a new Deleverage module was added to the registry. Old ActionHandler (0xA23081) and Liquidation (0xF925Bf) deleted from discovery. CollateralManager, ExchangeConfig, and PerpEngine unchanged.

Shapes added: ExchangeGateway v2 (0x86b4515...), and new auxiliary shapes for ActionHandler_v2, Liquidation_v2, Deleverage in ethereal/ExchangeGatewayRegistryContracts template.

ExchangeGateway: [diff](https://disco.l2beat.com/diff/ethereal:0x922Eb912285225c25428bC4Aaf4C31Eb73C07f6d/ethereal:0x6F4888af4c37D9Da8545b4766646e2891e47b1db)

## Watched changes

```diff
-   Status: DELETED
    contract ActionHandler (ethereal:0xA2308112941f9bc2843C41a971F56B3Ac6E2167a)
    +++ description: Auxiliary contract of the ExchangeGateway.
```

```diff
    contract ExchangeGateway (ethereal:0xB3cDC82035C495c484C9fF11eD5f3Ff6d342e3cc) {
    +++ description: Main contract of the Ethereal DEX. Entrypoint for users to deposit and withdraw funds and for operators submit user actions.
      sourceHashes.1:
-        "0x4e74883670a055318a8d4bdb7d266c2d62a87f06d7ebac1e09659053810ddd70"
+        "0x86b45155220c874371724e1491434de1633d3c9ec81f0e45455e5621da661872"
      values.$implementation:
-        "ethereal:0x922Eb912285225c25428bC4Aaf4C31Eb73C07f6d"
+        "ethereal:0x6F4888af4c37D9Da8545b4766646e2891e47b1db"
      values.$pastUpgrades.1:
+        ["2026-04-16T07:56:41.000Z","0x5af5474916ab2d51c82b367a4de90b08e07eb9dd8bc452788c9856ff70cabad2",["ethereal:0x6F4888af4c37D9Da8545b4766646e2891e47b1db"]]
      values.$upgradeCount:
-        1
+        2
      values.registry.0x414354494f4e5f48414e444c4552000000000000000000000000000000000000:
-        "ethereal:0xA2308112941f9bc2843C41a971F56B3Ac6E2167a"
+        "ethereal:0x70702e58005f3b91f9c8dFBe3A170051Ee61cf96"
      values.registry.0x4c49515549444154494f4e000000000000000000000000000000000000000000:
-        "ethereal:0xF925Bf7d50abe2Abb21E832c81a6454D791Ad5c0"
+        "ethereal:0x636DE0449C4175C8AA66989ab34fab5373e044f1"
      values.registry.0x44454c4556455241474500000000000000000000000000000000000000000000:
+        "ethereal:0xF0597CF73cBdB97484c439533bdDBF733BfDf84B"
      implementationNames.ethereal:0x922Eb912285225c25428bC4Aaf4C31Eb73C07f6d:
-        "ExchangeGateway"
      implementationNames.ethereal:0x6F4888af4c37D9Da8545b4766646e2891e47b1db:
+        "ExchangeGateway"
    }
```

```diff
-   Status: DELETED
    contract Liquidation (ethereal:0xF925Bf7d50abe2Abb21E832c81a6454D791Ad5c0)
    +++ description: Auxiliary contract of the ExchangeGateway.
```

```diff
+   Status: CREATED
    contract Liquidation (ethereal:0x636DE0449C4175C8AA66989ab34fab5373e044f1)
    +++ description: Auxiliary contract of the ExchangeGateway.
```

```diff
+   Status: CREATED
    contract ActionHandler (ethereal:0x70702e58005f3b91f9c8dFBe3A170051Ee61cf96)
    +++ description: Auxiliary contract of the ExchangeGateway.
```

```diff
+   Status: CREATED
    contract Deleverage (ethereal:0xF0597CF73cBdB97484c439533bdDBF733BfDf84B)
    +++ description: Auxiliary contract of the ExchangeGateway.
```

## Source code changes

```diff
.../{.flat@1770823999 => .flat}/ActionHandler.sol  |  118 +-
 .../src/projects/ethereal/.flat/Deleverage.sol     | 4047 ++++++++++++++++++++
 .../ExchangeGateway/ExchangeGateway.sol            |   41 +-
 .../{.flat@1770823999 => .flat}/Liquidation.sol    |  776 ++--
 4 files changed, 4641 insertions(+), 341 deletions(-)
```

Generated with discovered.json: 0xf8fd33dc19f3d548ab5707d20cf8c15a9ec38370

# Diff at Wed, 11 Feb 2026 15:34:28 GMT:

- author: vincfurc (<vincfurc@users.noreply.github.com>)
- comparing to: main@2e859859d90363aa5bf619da50a94cddbc1e3894 block: 1769514148
- current timestamp: 1770823999

## Description

Upgrade to BoLD dispute protocol and ArbOS v51 "Dia" (nitro-contracts v3.1.0+).

RollupProxy replaced with a new BoLD-enabled contract (`isPostBoLD: true`). Assertion-based state management replaces the old node-based system. Validators stake 0.1 ETH (WETH), validator whitelist remains enabled.

ChallengeManager replaced with EdgeChallengeManager implementing the BoLD multi-level bisection protocol: block-level edges (height 67M), 1 big-step level (height 524K), small-step edges (height 8.4M), with 0.1 ETH stake for big-step and small-step edges.

All core contracts upgraded: Bridge, Inbox, Outbox, RollupEventInbox, SequencerInbox. SequencerInbox gains delay buffer support (`isDelayBufferable: true`, currently set to max/disabled) and `feeTokenPricer` field. `delayBlocks` increased from 5760 to 7200.

All four OneStepProvers and OneStepProofEntry replaced with new versions. ValidatorUtils removed (no longer needed in BoLD).

ArbOS updated to v51 "Dia" (wasmModuleRoot `0x8a7513bf...`), adding Ethereum Fusaka support (secp256r1, BLS12-381, CLZ opcode), improved gas pricing, and native token mint/burn support.

## Watched changes

```diff
-   Status: DELETED
    contract OneStepProverHostIo (arb1:0x0446E34D1cC4eBA5F336627BaAe82332c8607043)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
-   Status: DELETED
    contract ChallengeManager (arb1:0x04f8FF8aC0Bf00a70D5780F9Ee0c3bD01296ba0E)
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
```

```diff
-   Status: DELETED
    contract ValidatorUtils (arb1:0x08Ca9925b88c54100568c8d41eFAF8Fecc695d3a)
    +++ description: This contract implements view only utilities for validators.
```

```diff
    contract SequencerInbox (arb1:0x0E2480384E3703FDf84c7A0448658E8C7543b3a8) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      sourceHashes.1:
-        "0x6bb86ac4bd0d31e049f543fcf0a8f94c952252222f115246ef9d5b8104d803cc"
+        "0xb57f3e67e08492b235337cda4f3ea0117e3e043cceaf8e9a7a51b57611ba99de"
      values.$implementation:
-        "arb1:0x289b8F787Ab752b039C477B98016869f6b8AE772"
+        "arb1:0xC08A4543b011fd4f1EfC9e26521F4e157433b3b1"
      values.$pastUpgrades.1:
+        ["2026-02-09T10:03:26.000Z","0xdb6ad9c2efe65f5130149cc9cce9f3ab4cb89bcfbd7156028f5c8399babf62bf",["arb1:0xC08A4543b011fd4f1EfC9e26521F4e157433b3b1"]]
      values.$upgradeCount:
-        1
+        2
      values.maxTimeVariation.delayBlocks:
-        5760
+        7200
      values.rollup:
-        "arb1:0x63a751E0564eAb8B225F1922888b4F08d7d33561"
+        "arb1:0x75c070fe237817Bd027d402327069e9cd07De078"
      values.feeTokenPricer:
+        "arb1:0x0000000000000000000000000000000000000000"
      values.isDelayBufferable:
+        true
      implementationNames.arb1:0x289b8F787Ab752b039C477B98016869f6b8AE772:
-        "SequencerInbox"
      implementationNames.arb1:0xC08A4543b011fd4f1EfC9e26521F4e157433b3b1:
+        "SequencerInbox"
    }
```

```diff
-   Status: DELETED
    contract OneStepProofEntry (arb1:0x23264394923E4aEB990234180c37Bf757667C6f7)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
-   Status: DELETED
    contract OneStepProverMemory (arb1:0x4012CF2dce28079c8F7f92CecB2E494F4AcB9351)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
-   Status: DELETED
    contract OneStepProverMath (arb1:0x461bDAfaaba542C6eCcEa882BdF85542Ed7158C5)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
    contract Inbox (arb1:0x574b121c469583c3a46cd88bBCC9Ac5c8C907d06) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      sourceHashes.1:
-        "0x25984fdfffb8141859c99299fb29e7a7460732d77111e5fe23792baa99f336a3"
+        "0x82dad78abdf27e168de1ae177b8055db4167106d71273d9a3264e9898a6055e4"
      values.$implementation:
-        "arb1:0xb0de8855D29C00ad0710BC7a9975f0534deFc227"
+        "arb1:0x08b1395a2Ee51073d6B9ebF9E97FBeb09dcAcAf1"
      values.$pastUpgrades.1:
+        ["2026-02-09T10:03:26.000Z","0xdb6ad9c2efe65f5130149cc9cce9f3ab4cb89bcfbd7156028f5c8399babf62bf",["arb1:0x08b1395a2Ee51073d6B9ebF9E97FBeb09dcAcAf1"]]
      values.$upgradeCount:
-        1
+        2
      implementationNames.arb1:0xb0de8855D29C00ad0710BC7a9975f0534deFc227:
-        "ERC20Inbox"
      implementationNames.arb1:0x08b1395a2Ee51073d6B9ebF9E97FBeb09dcAcAf1:
+        "ERC20Inbox"
    }
```

```diff
    contract RollupEventInbox (arb1:0x5D6bec85F093Eb49bD6913aCe7e9A081c41aed8F) {
    +++ description: Helper contract sending configuration data over the bridge during the systems initialization.
      sourceHashes.1:
-        "0x35bd9f6436158f2147578ce95b85de68f435e81f1f3ed3858f7523a8c4825a1a"
+        "0x089ac3cec821c0f014f284ec4ec1039ef6bc50b6ad3ee47c82e20af65cc30c33"
      values.$implementation:
-        "arb1:0x4b4fdb082b44490c9AEEd91C932c3E33AAbfF653"
+        "arb1:0x9fD20D42Cf52B1A0dEf8e95AD8d2E92B58ECa51B"
      values.$pastUpgrades.1:
+        ["2026-02-09T10:03:26.000Z","0xdb6ad9c2efe65f5130149cc9cce9f3ab4cb89bcfbd7156028f5c8399babf62bf",["arb1:0x9fD20D42Cf52B1A0dEf8e95AD8d2E92B58ECa51B"]]
      values.$upgradeCount:
-        1
+        2
      values.rollup:
-        "arb1:0x63a751E0564eAb8B225F1922888b4F08d7d33561"
+        "arb1:0x75c070fe237817Bd027d402327069e9cd07De078"
      implementationNames.arb1:0x4b4fdb082b44490c9AEEd91C932c3E33AAbfF653:
-        "ERC20RollupEventInbox"
      implementationNames.arb1:0x9fD20D42Cf52B1A0dEf8e95AD8d2E92B58ECa51B:
+        "ERC20RollupEventInbox"
    }
```

```diff
-   Status: DELETED
    contract RollupProxy (arb1:0x63a751E0564eAb8B225F1922888b4F08d7d33561)
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
```

```diff
    contract Conduit Multisig 2 (arb1:0x79C2abE3eBA9dc119318FdAaA48118e1CDB53F56) {
    +++ description: None
      receivedPermissions.0:
-        {"permission":"interact","from":"arb1:0x63a751E0564eAb8B225F1922888b4F08d7d33561","description":"Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes.","role":".owner","via":[{"address":"arb1:0xDde7f92D0f2225f5951564D387e158b9b57f95F3"}]}
      receivedPermissions.1.description:
+        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
      receivedPermissions.1.via.0:
-        {"address":"arb1:0xc1136ea5F91f82cb468Fc7650579A95605D9f5C2"}
      receivedPermissions.1.role:
-        "admin"
+        ".owner"
      receivedPermissions.1.from:
-        "arb1:0x04f8FF8aC0Bf00a70D5780F9Ee0c3bD01296ba0E"
+        "arb1:0x75c070fe237817Bd027d402327069e9cd07De078"
      receivedPermissions.1.permission:
-        "upgrade"
+        "interact"
      receivedPermissions.5.from:
-        "arb1:0x63a751E0564eAb8B225F1922888b4F08d7d33561"
+        "arb1:0x75c070fe237817Bd027d402327069e9cd07De078"
      receivedPermissions.6:
+        {"permission":"upgrade","from":"arb1:0xA4444d9536595d35967206b86067a90aD053e1EF","role":"admin","via":[{"address":"arb1:0xc1136ea5F91f82cb468Fc7650579A95605D9f5C2"},{"address":"arb1:0xDde7f92D0f2225f5951564D387e158b9b57f95F3"}]}
    }
```

```diff
    EOA  (arb1:0x80e046764185e776100A4f59079C2B00327f279A) {
    +++ description: None
      receivedPermissions.0.role:
-        ".validators"
+        ".getValidators"
      receivedPermissions.0.from:
-        "arb1:0x63a751E0564eAb8B225F1922888b4F08d7d33561"
+        "arb1:0x75c070fe237817Bd027d402327069e9cd07De078"
    }
```

```diff
-   Status: DELETED
    contract OneStepProver0 (arb1:0x91F12800C6b5b4e7d88fE785558213F8EF3F4586)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
    contract Outbox (arb1:0xA2A5DCA414e3AaBD48B9CA97426f7e3Fba967492) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
      values.$implementation:
-        "arb1:0xd2e4Cc9Ec636eC9cFE840A2cF6ca32B690fD921A"
+        "arb1:0x99761fAc22FcE23498F8004ac4025F822fEdce95"
      values.$pastUpgrades.1:
+        ["2026-02-09T10:03:26.000Z","0xdb6ad9c2efe65f5130149cc9cce9f3ab4cb89bcfbd7156028f5c8399babf62bf",["arb1:0x99761fAc22FcE23498F8004ac4025F822fEdce95"]]
      values.$upgradeCount:
-        1
+        2
      values.rollup:
-        "arb1:0x63a751E0564eAb8B225F1922888b4F08d7d33561"
+        "arb1:0x75c070fe237817Bd027d402327069e9cd07De078"
      implementationNames.arb1:0xd2e4Cc9Ec636eC9cFE840A2cF6ca32B690fD921A:
-        "ERC20Outbox"
      implementationNames.arb1:0x99761fAc22FcE23498F8004ac4025F822fEdce95:
+        "ERC20Outbox"
    }
```

```diff
    contract ProxyAdmin (arb1:0xc1136ea5F91f82cb468Fc7650579A95605D9f5C2) {
    +++ description: None
      directlyReceivedPermissions.0:
-        {"permission":"upgrade","from":"arb1:0x04f8FF8aC0Bf00a70D5780F9Ee0c3bD01296ba0E","role":"admin"}
      directlyReceivedPermissions.4:
+        {"permission":"upgrade","from":"arb1:0xA4444d9536595d35967206b86067a90aD053e1EF","role":"admin"}
    }
```

```diff
    contract Bridge (arb1:0xd86f5ad3fa5becbB07e565DbD4b70DBd817A43A8) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      sourceHashes.1:
-        "0x73087d4667e81f676a10708feb2774bab3a9a558a1987b8ac4f112cc464bba96"
+        "0x7f62b9bd4a0aac711ca355a523b1d934ab93ae14c5fae5a860c0ded42ee5a3c3"
      values.$implementation:
-        "arb1:0x92329713Dc1a897D67a1C7f2a40eeeA83F5362CE"
+        "arb1:0x31127A9c0308d8E3F6db5158a14aD674f22946d7"
      values.$pastUpgrades.1:
+        ["2026-02-09T10:03:26.000Z","0xdb6ad9c2efe65f5130149cc9cce9f3ab4cb89bcfbd7156028f5c8399babf62bf",["arb1:0x31127A9c0308d8E3F6db5158a14aD674f22946d7"]]
      values.$upgradeCount:
-        1
+        2
      values.rollup:
-        "arb1:0x63a751E0564eAb8B225F1922888b4F08d7d33561"
+        "arb1:0x75c070fe237817Bd027d402327069e9cd07De078"
      implementationNames.arb1:0x92329713Dc1a897D67a1C7f2a40eeeA83F5362CE:
-        "ERC20Bridge"
      implementationNames.arb1:0x31127A9c0308d8E3F6db5158a14aD674f22946d7:
+        "ERC20Bridge"
    }
```

```diff
    contract UpgradeExecutor (arb1:0xDde7f92D0f2225f5951564D387e158b9b57f95F3) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      directlyReceivedPermissions.1.description:
-        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
+        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
      directlyReceivedPermissions.1.from:
-        "arb1:0x63a751E0564eAb8B225F1922888b4F08d7d33561"
+        "arb1:0x75c070fe237817Bd027d402327069e9cd07De078"
      directlyReceivedPermissions.2.from:
-        "arb1:0x63a751E0564eAb8B225F1922888b4F08d7d33561"
+        "arb1:0x75c070fe237817Bd027d402327069e9cd07De078"
    }
```

```diff
+   Status: CREATED
    contract OneStepProverHostIo (arb1:0x18Cc27B3a95a6FdEf9EAA391eff28F48F42fFe3F)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract OneStepProverMemory (arb1:0x583F8BA007580c83EFB4B02C66694096cD5c56d1)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract OneStepProofEntry (arb1:0x61006c8566fac9a3315F646dA4624C00BbCF15E4)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract RollupProxy (arb1:0x75c070fe237817Bd027d402327069e9cd07De078)
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new assertions (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both called Validators).
```

```diff
+   Status: CREATED
    contract OneStepProver0 (arb1:0x78B101eC9736c4Ab06b0833f01Fd4c011f7CA612)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract EdgeChallengeManager (arb1:0xA4444d9536595d35967206b86067a90aD053e1EF)
    +++ description: Contract that implements the main challenge protocol logic of the fraud proof system.
```

```diff
+   Status: CREATED
    contract OneStepProverMath (arb1:0xB08Ca18499389ABfDF7b14b09BD2Bd4d56D7fbbb)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

## Source code changes

```diff
.../Bridge/ERC20Bridge.sol                         |  306 +-
 .../ChallengeManager.sol => /dev/null              |  994 -----
 .../EdgeChallengeManager/EdgeChallengeManager.sol  | 3193 +++++++++++++
 .../TransparentUpgradeableProxy.p.sol              |   18 +-
 .../Inbox/ERC20Inbox.sol                           |  430 +-
 .../OneStepProofEntry.sol                          |  656 +--
 .../{.flat@1769514148 => .flat}/OneStepProver0.sol |  502 ++-
 .../OneStepProverHostIo.sol                        |  643 +--
 .../OneStepProverMath.sol                          |  101 +-
 .../OneStepProverMemory.sol                        |  421 +-
 .../Outbox/ERC20Outbox.sol                         |  104 +-
 .../RollupEventInbox/ERC20RollupEventInbox.sol     |   73 +-
 .../RollupProxy/RollupAdminLogic.1.sol             | 2809 ++++++------
 .../RollupProxy/RollupProxy.p.sol                  |   91 +-
 .../RollupProxy/RollupUserLogic.2.sol              | 4700 ++++++++++----------
 .../SequencerInbox/SequencerInbox.sol              | 1030 +++--
 .../ValidatorUtils.sol => /dev/null                |  323 --
 17 files changed, 9455 insertions(+), 6939 deletions(-)
```

Generated with discovered.json: 0x357fb4a83f3ae605d5e5a123120cbb63e2e888f2

# Diff at Tue, 27 Jan 2026 11:43:38 GMT:

- author: vincfurc (<vincfurc@users.noreply.github.com>)
- comparing to: main@01c924f177b66fde012756076e94adb03520b757 block: 1768984621
- current timestamp: 1769514148

## Description

New member added to Conduit Multisig 2, increasing from 4 of 11 to 4 of 12 threshold.

## Watched changes

```diff
    contract Conduit Multisig 2 (arb1:0x79C2abE3eBA9dc119318FdAaA48118e1CDB53F56) {
    +++ description: None
      values.$members.0:
+        "arb1:0xA9FCCc53F1c9095DA867Bd648683F8bdCcc78d09"
      values.multisigThreshold:
-        "4 of 11 (36%)"
+        "4 of 12 (33%)"
    }
```

Generated with discovered.json: 0x71f52274ae7c5e3c30d9906be9b14e896993348d

# Diff at Wed, 21 Jan 2026 08:38:12 GMT:

- author: vincfurc (<vincfurc@users.noreply.github.com>)
- comparing to: main@a72aa7d50f1dddc0c7a6eae7f60679fc94e4eabf block: 1768566203
- current timestamp: 1768984621

## Description

New member conduit msig2.

## Watched changes

```diff
    contract Conduit Multisig 2 (arb1:0x79C2abE3eBA9dc119318FdAaA48118e1CDB53F56) {
    +++ description: None
      values.$members.0:
+        "arb1:0x381624F7912BddD83dc67c6C53Ef6FE61B87Cf07"
      values.multisigThreshold:
-        "4 of 10 (40%)"
+        "4 of 11 (36%)"
    }
```

Generated with discovered.json: 0x05610d011c42ab2f8f3eae2d0161f508fa3cc79f

# Diff at Fri, 16 Jan 2026 12:24:34 GMT:

- author: vincfurc (<vincfurc@users.noreply.github.com>)
- comparing to: main@5858fbf220b5dda1ab2a19f029fdd9eb700ca7fa block: 1768394405
- current timestamp: 1768566203

## Description

Conduit Multisig 2 added a new signer, increasing members from 9 to 10 (threshold remains 4).

## Watched changes

```diff
    contract Conduit Multisig 2 (arb1:0x79C2abE3eBA9dc119318FdAaA48118e1CDB53F56) {
    +++ description: None
      values.$members.0:
+        "arb1:0x6BB4249858Ee19b6ABC071AD26bEe690baa783A6"
      values.multisigThreshold:
-        "4 of 9 (44%)"
+        "4 of 10 (40%)"
    }
```

Generated with discovered.json: 0x9e9ce9688636b72ad7cd2830907df565194e83fd

# Diff at Wed, 14 Jan 2026 12:41:17 GMT:

- author: vincfurc (<vincfurc@users.noreply.github.com>)
- comparing to: main@e7f517859f6f313e4c82beba4300d1738b863a5d block: 1767629465
- current timestamp: 1768394405

## Description

Conduit Multisig 2 lost one member, reducing from 4 of 10 to 4 of 9 threshold.

## Watched changes

```diff
    contract Conduit Multisig 2 (arb1:0x79C2abE3eBA9dc119318FdAaA48118e1CDB53F56) {
    +++ description: None
      values.$members.5:
-        "arb1:0xa4000bDD2bB92ce6750b31F1eeda47Bd1cB8e6e4"
      values.multisigThreshold:
-        "4 of 10 (40%)"
+        "4 of 9 (44%)"
    }
```

Generated with discovered.json: 0x12387dfcfb9ad7ef2bc20eb6be57d936d1bc0e20

# Diff at Mon, 05 Jan 2026 17:44:16 GMT:

- author: vincfurc (<vincfurc@users.noreply.github.com>)
- comparing to: main@c679543996c33dd4145a38ea0d7fccd3b24d8951 block: 1766406768
- current timestamp: 1767629465

## Description

Refresh discovery.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1766406768 (main branch discovery), not current.

```diff
    contract RollupProxy (arb1:0x63a751E0564eAb8B225F1922888b4F08d7d33561) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      usedTypes.0.arg.0x8a7513bf7bb3e3db04b0d982d0e973bcf57bf8b88aef7c6d03dba3a81a56a499:
+        "ArbOS v51 wasmModuleRoot"
    }
```

Generated with discovered.json: 0xd5cb05378f867813bf7b6309a9765f00b7648fd0

# Diff at Wed, 10 Dec 2025 12:08:34 GMT:

- author: vincfurc (<vincfurc@users.noreply.github.com>)
- comparing to: main@87479478fee0d2fb1eb3c2a36f88a2ceeb4087df block: 1761222332
- current timestamp: 1765368374

## Description

Conduit multisig added member.

## Watched changes

```diff
    contract Conduit Multisig 2 (arb1:0x79C2abE3eBA9dc119318FdAaA48118e1CDB53F56) {
    +++ description: None
      values.$members.0:
+        "arb1:0x2103c69696CB2D3779f5445393808239034E911c"
      values.$members.0:
-        "arb1:0xFe0ab87ebE03DD0bF52DaF34Dfda6639c335e2d4"
+        "arb1:0x65D1d44B8B2fE15d45A03708E0835C7E98a56007"
      values.$members.3:
-        "arb1:0xF0B77EaE7F2dabCC2571c7418406A0dCA3afA4f0"
    }
```

Generated with discovered.json: 0xb64578924648dc2093bf307f6fc2ec1029124322

# Diff at Tue, 04 Nov 2025 11:32:38 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@9ff7b62a511791b99f61b604fb6b56e4ea223bb0 block: 1761222332
- current timestamp: 1761222332

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1761222332 (main branch discovery), not current.

```diff
    contract CollateralManager (ethereal:0x638D6DaC0550f30f37aC5784260309Ac89302faA) {
    +++ description: Auxiliary contract of the ExchangeGateway.
      sourceHashes.0:
-        "0x9258c947756b825974889f3070e5a8764e1f1338f91f0955facc2537640ddee0"
+        "0x09b192ba7fe0c948d056b981a202a7c6bf2f7535255539908256c1914b716764"
    }
```

```diff
    contract ActionHandler (ethereal:0xA2308112941f9bc2843C41a971F56B3Ac6E2167a) {
    +++ description: Auxiliary contract of the ExchangeGateway.
      sourceHashes.0:
-        "0xc614b9dee3c41cf413bf0676ec92b8506b7cde4ddf0fcaa64ba535cd4db50653"
+        "0x14594f4ec76a9468af01b5bd9b65a895ce8eeaec7e303d2c2953abbb6eb37fe2"
    }
```

```diff
    contract ExchangeGateway (ethereal:0xB3cDC82035C495c484C9fF11eD5f3Ff6d342e3cc) {
    +++ description: Main contract of the Ethereal DEX. Entrypoint for users to deposit and withdraw funds and for operators submit user actions.
      sourceHashes.1:
-        "0xb6c692aef340a10d30bcd0a9edff8392fe5adf829a55d81be3c755b10d84868c"
+        "0x4e74883670a055318a8d4bdb7d266c2d62a87f06d7ebac1e09659053810ddd70"
    }
```

```diff
    contract PerpEngine (ethereal:0xCc0385301a10191b7ac633A64742a34F2e4cFB37) {
    +++ description: Auxiliary contract of the ExchangeGateway.
      sourceHashes.0:
-        "0xe74cf338ff299bbb081c4e688e1667a8480c8255cbed038eaeedddb3c5eb19af"
+        "0x1f2d6ea306a2ce3c1e94fee76d9184cd06fa8a76178bc2a973d42d495f56d3cf"
    }
```

```diff
    contract Liquidation (ethereal:0xF925Bf7d50abe2Abb21E832c81a6454D791Ad5c0) {
    +++ description: Auxiliary contract of the ExchangeGateway.
      sourceHashes.0:
-        "0x76ac18478de588227556d0042ac2ded1e13a53717454987046bd11e5fd1dac79"
+        "0x9882e7baf79921bbc376de21ba5de774ccd2b47186ed8ba389a8ca85f3e94316"
    }
```

Generated with discovered.json: 0x2502db7e651b56a054870633e3dc8f71a8c1cf43

# Diff at Thu, 23 Oct 2025 15:11:46 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@59bab562d9522734bed50b73c362d354ad81ecd1 block: 1761144638
- current timestamp: 1761222332

## Description

add ethereal on ethereal disco incl the exchange contract. heavily EOA and layerzero-governed.

this is the first orbit stack that uses the native OFT integration (uses a precompile to allow gas token mints on the L2).

for TVS we are counting the wrapped USDe for now (covers >90% since the exchange only supports this token). in the future we will need a custom tvs adapter for such chains.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1761144638 (main branch discovery), not current.

```diff
+   Status: CREATED
    contract SafeL2 (ethereal:0x3F93bCc6201558aE2d7528a85575cF07679Bb50e)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SafeL2 (ethereal:0x58a16791037dF85CCbc3A65DE5a8401Fd04C8aC8)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CollateralManager (ethereal:0x638D6DaC0550f30f37aC5784260309Ac89302faA)
    +++ description: Auxiliary contract of the ExchangeGateway.
```

```diff
+   Status: CREATED
    contract OrbitNativeOFTAdapter (ethereal:0x80F981abC18A48CfdbDe5556F9B72e6a726F0FF3)
    +++ description: An OApp in the LayerZero protocol. It allows to mint the native token using the arbNativeTokenManager precompile on ArbOs. This means that the native token inherits all trust assumptions of the LayerZero security stack configured for this OApp and its crosschein peers, including minting and burning.
```

```diff
+   Status: CREATED
    contract ActionHandler (ethereal:0xA2308112941f9bc2843C41a971F56B3Ac6E2167a)
    +++ description: Auxiliary contract of the ExchangeGateway.
```

```diff
+   Status: CREATED
    contract PythLazer (ethereal:0xACeA761c27A909d4D3895128EBe6370FDE2dF481)
    +++ description: Used to verify offchain signed oracle data.
```

```diff
+   Status: CREATED
    contract ExchangeGateway (ethereal:0xB3cDC82035C495c484C9fF11eD5f3Ff6d342e3cc)
    +++ description: Main contract of the Ethereal DEX. Entrypoint for users to deposit and withdraw funds and for operators submit user actions.
```

```diff
+   Status: CREATED
    contract ExchangeConfig (ethereal:0xC199cC890F61B847bec9cec4212C35b759A9fD38)
    +++ description: Auxiliary contract of the ExchangeGateway.
```

```diff
+   Status: CREATED
    contract PerpEngine (ethereal:0xCc0385301a10191b7ac633A64742a34F2e4cFB37)
    +++ description: Auxiliary contract of the ExchangeGateway.
```

```diff
+   Status: CREATED
    contract Liquidation (ethereal:0xF925Bf7d50abe2Abb21E832c81a6454D791Ad5c0)
    +++ description: Auxiliary contract of the ExchangeGateway.
```

Generated with discovered.json: 0x38981589e68554c66993a2e5ae1eaf5d9cad124c

# Diff at Wed, 22 Oct 2025 16:02:26 GMT:

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
    contract Ethereal Multisig (arb1:0x33Fbf4E75d54bBec0e432B6dc27bDEa0ca5DEdf9)
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
