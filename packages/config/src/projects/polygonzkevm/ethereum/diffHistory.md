Generated with discovered.json: 0x285d00f9c76827cf1b363e698e11b8cb802a1066

# Diff at Tue, 04 Mar 2025 10:39:38 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@98d260b45fe0d2195ce5e629bd7b200c8706e8ba block: 21744722
- current block number: 21744722

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21744722 (main branch discovery), not current.

```diff
    contract daiBridge (0x4A27aC91c5cD3768F140ECabDe3FC2B2d92eDb98) {
    +++ description: Custom Bridge escrow for DAI bridged to PolygonZkEVM allowing for a custom L2 tokens contract.
      sinceBlock:
+        18175991
    }
```

```diff
    contract PolygonZkEVM (0x519E42c24163192Dca44CD3fBDCEBF6be9130987) {
    +++ description: The main system contract defining the polygon zkEVM Layer 2 logic. Entry point for sequencing batches.
      sinceBlock:
+        19098451
    }
```

```diff
    contract usdcBridge (0x70E70e58ed7B1Cec0D8ef7464072ED8A52d755eB) {
    +++ description: Custom Bridge escrow for USDC bridged to PolygonZkEVM allowing for a custom L2 tokens contract.
      sinceBlock:
+        18583475
    }
```

```diff
    contract Verifier (0xc521580cd8586Cc688A7430F9DcE0f6A803F2883) {
    +++ description: Verifies ZK proofs for state roots of this Layer 2 via the PolygonRollupManager.
      sinceBlock:
+        20790618
    }
```

```diff
    contract wstETHBridge (0xf0CDE1E7F0FAD79771cd526b1Eb0A12F69582C01) {
    +++ description: Custom Bridge escrow for wstETH bridged to PolygonZkEVM allowing for a custom L2 tokens contract.
      sinceBlock:
+        18898811
    }
```

```diff
    contract PolygonZkEvmEscrowsMultisig (0xf694C9e3a34f5Fa48b6f3a0Ff186C1c6c4FcE904) {
    +++ description: None
      sinceBlock:
+        18142537
    }
```

Generated with discovered.json: 0x673a1132499eaeb36571e351224906dc9b4ff984

# Diff at Thu, 27 Feb 2025 11:46:20 GMT:

- author: Michał Podsiadły (<michal.podsiadly@l2beat.com>)
- comparing to: main@a4b50e45bb44f8ceeea29f9236088d26a843c885 block: 21744722
- current block number: 21744722

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21744722 (main branch discovery), not current.

```diff
    contract PolygonZkEVM (0x519E42c24163192Dca44CD3fBDCEBF6be9130987) {
    +++ description: The main system contract defining the polygon zkEVM Layer 2 logic. Entry point for sequencing batches.
      name:
-        "PolygonZkEVMEtrog"
+        "PolygonZkEVM"
      displayName:
-        "PolygonZkEVM"
    }
```

```diff
    contract Verifier (0xc521580cd8586Cc688A7430F9DcE0f6A803F2883) {
    +++ description: Verifies ZK proofs for state roots of this Layer 2 via the PolygonRollupManager.
      name:
-        "FflonkVerifier_11"
+        "Verifier"
      displayName:
-        "Verifier"
    }
```

Generated with discovered.json: 0xa802adbfc210dd392e41644df7670037a0af1835

# Diff at Wed, 26 Feb 2025 10:32:58 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@18513668f913fbe57a197f43655b19111df0e627 block: 21744722
- current block number: 21744722

## Description

config related: added categories for all opstack, op stack and polygoncdk stack templates.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21744722 (main branch discovery), not current.

```diff
    contract PolygonZkEVMEtrog (0x519E42c24163192Dca44CD3fBDCEBF6be9130987) {
    +++ description: The main system contract defining the polygon zkEVM Layer 2 logic. Entry point for sequencing batches.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract FflonkVerifier_11 (0xc521580cd8586Cc688A7430F9DcE0f6A803F2883) {
    +++ description: Verifies ZK proofs for state roots of this Layer 2 via the PolygonRollupManager.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

Generated with discovered.json: 0x88752e661203fd086c8212b6e90afa67b7677b4e

# Diff at Mon, 03 Feb 2025 05:30:02 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@9637849b063da030577f396e3f0368d2e5dcec02 block: 21630127
- current block number: 21744722

## Description

polygon cdk discodrive!

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21630127 (main branch discovery), not current.

```diff
    contract daiBridge (0x4A27aC91c5cD3768F140ECabDe3FC2B2d92eDb98) {
    +++ description: Custom Bridge escrow for DAI bridged to PolygonZkEVM allowing for a custom L2 tokens contract.
      description:
+        "Custom Bridge escrow for DAI bridged to PolygonZkEVM allowing for a custom L2 tokens contract."
    }
```

```diff
    contract PolygonZkEVMEtrog (0x519E42c24163192Dca44CD3fBDCEBF6be9130987) {
    +++ description: The main system contract defining the polygon zkEVM Layer 2 logic. Entry point for sequencing batches.
      template:
+        "polygon-cdk/PolygonZkEVM"
      displayName:
+        "PolygonZkEVM"
      description:
+        "The main system contract defining the polygon zkEVM Layer 2 logic. Entry point for sequencing batches."
      issuedPermissions:
+        [{"permission":"sequence","to":"0x148Ee7dAF16574cD020aFa34CC658f8F3fbd2800","via":[]}]
      fieldMeta:
+        {"forceBatchAddress":{"severity":"HIGH","description":"If this changes to the ZERO address, an update to the risk rosette is probably needed, since forcing batches is open to everyone."}}
    }
```

```diff
    contract usdcBridge (0x70E70e58ed7B1Cec0D8ef7464072ED8A52d755eB) {
    +++ description: Custom Bridge escrow for USDC bridged to PolygonZkEVM allowing for a custom L2 tokens contract.
      description:
+        "Custom Bridge escrow for USDC bridged to PolygonZkEVM allowing for a custom L2 tokens contract."
    }
```

```diff
    contract FflonkVerifier_11 (0xc521580cd8586Cc688A7430F9DcE0f6A803F2883) {
    +++ description: Verifies ZK proofs for state roots of this Layer 2 via the PolygonRollupManager.
      name:
-        "PolygonzkEVMVerifier"
+        "FflonkVerifier_11"
      template:
+        "polygon-cdk/Verifier"
      displayName:
+        "Verifier"
      description:
+        "Verifies ZK proofs for state roots of this Layer 2 via the PolygonRollupManager."
    }
```

```diff
    contract wstETHBridge (0xf0CDE1E7F0FAD79771cd526b1Eb0A12F69582C01) {
    +++ description: Custom Bridge escrow for wstETH bridged to PolygonZkEVM allowing for a custom L2 tokens contract.
      description:
+        "Custom Bridge escrow for wstETH bridged to PolygonZkEVM allowing for a custom L2 tokens contract."
    }
```

```diff
-   Status: DELETED
    contract  (0xF29Ff96aaEa6C9A1fBa851f74737f3c069d4f1a9)
    +++ description: None
```

```diff
    contract PolygonZkEvmEscrowsMultisig (0xf694C9e3a34f5Fa48b6f3a0Ff186C1c6c4FcE904) {
    +++ description: None
      name:
-        "EscrowsAdmin"
+        "PolygonZkEvmEscrowsMultisig"
    }
```

Generated with discovered.json: 0xd117f582c16d556027b84958f1a8cf9957584ac0

# Diff at Mon, 20 Jan 2025 11:09:55 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@2c8b4f3d9910bb6371be9b4df87b70856e7d8c64 block: 21630127
- current block number: 21630127

## Description

Rerun on the same block number. Applies fixes to permissions and via field. Renames permission's target to to/from.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21630127 (main branch discovery), not current.

```diff
    contract daiBridge (0x4A27aC91c5cD3768F140ECabDe3FC2B2d92eDb98) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xf694C9e3a34f5Fa48b6f3a0Ff186C1c6c4FcE904"
      issuedPermissions.0.to:
+        "0xf694C9e3a34f5Fa48b6f3a0Ff186C1c6c4FcE904"
    }
```

```diff
    contract usdcBridge (0x70E70e58ed7B1Cec0D8ef7464072ED8A52d755eB) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xf694C9e3a34f5Fa48b6f3a0Ff186C1c6c4FcE904"
      issuedPermissions.0.to:
+        "0xf694C9e3a34f5Fa48b6f3a0Ff186C1c6c4FcE904"
    }
```

```diff
    contract wstETHBridge (0xf0CDE1E7F0FAD79771cd526b1Eb0A12F69582C01) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xf694C9e3a34f5Fa48b6f3a0Ff186C1c6c4FcE904"
      issuedPermissions.0.to:
+        "0xf694C9e3a34f5Fa48b6f3a0Ff186C1c6c4FcE904"
    }
```

```diff
    contract EscrowsAdmin (0xf694C9e3a34f5Fa48b6f3a0Ff186C1c6c4FcE904) {
    +++ description: None
      receivedPermissions.2.target:
-        "0xf0CDE1E7F0FAD79771cd526b1Eb0A12F69582C01"
      receivedPermissions.2.from:
+        "0xf0CDE1E7F0FAD79771cd526b1Eb0A12F69582C01"
      receivedPermissions.1.target:
-        "0x70E70e58ed7B1Cec0D8ef7464072ED8A52d755eB"
      receivedPermissions.1.from:
+        "0x70E70e58ed7B1Cec0D8ef7464072ED8A52d755eB"
      receivedPermissions.0.target:
-        "0x4A27aC91c5cD3768F140ECabDe3FC2B2d92eDb98"
      receivedPermissions.0.from:
+        "0x4A27aC91c5cD3768F140ECabDe3FC2B2d92eDb98"
    }
```

Generated with discovered.json: 0xbaa26c2dbd2246ca46f0f0eefc8a0af6574f1b24

# Diff at Wed, 15 Jan 2025 13:18:34 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@3ea176aee1470e5ec80e65adfc81a954f84584d8 block: 20878349
- current block number: 21630127

## Description

Polygon zkEVM upgraded to rollupTypeID 6 (prev 5), this is called [the servicing update](https://polygon.technology/blog/polygon-zkevm-servicing-update-coming-to-mainnet-beta), and was deployed onchain in oct 2024. It adds minor changes like `rollbackBatches()` for batches that are not yet verified and allows local chain admins to upgrade to already-deployed new versions for their chain.

## Watched changes

```diff
    contract PolygonZkEVMEtrog (0x519E42c24163192Dca44CD3fBDCEBF6be9130987) {
    +++ description: None
      sourceHashes.1:
-        "0xf303702e52579ed796873f92868d2ebedd55360bf53043519e6061b19df3eb4b"
+        "0x5912938b92e53d8eb670cbaff45effa91dca7caafcb389b57bf161cdd7585fa3"
      values.$implementation:
-        "0x2650a9a4fC64f63F573EF0F405064EF54BC46f71"
+        "0x7253F329302b1b5E774Ac641EA3743E9E3244f2E"
      values.$pastUpgrades.4:
+        ["2025-01-15T12:16:11.000Z","0x9328cfd3d2833dca2d0ea16fbb34f8fc096c26ca8334476c5bf7107f32436029",["0x7253F329302b1b5E774Ac641EA3743E9E3244f2E"]]
      values.$upgradeCount:
-        4
+        5
    }
```

## Source code changes

```diff
.../PolygonZkEVMEtrog/PolygonZkEVMEtrog.sol        | 111 +++++++++++++++------
 1 file changed, 81 insertions(+), 30 deletions(-)
```

Generated with discovered.json: 0x211f698e7103ca1f1041c810857bdada90077456

# Diff at Mon, 21 Oct 2024 11:09:04 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@8895d33866f5665c4c710f4ddaa32bfa63cc3c78 block: 20878349
- current block number: 20878349

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20878349 (main branch discovery), not current.

```diff
    contract daiBridge (0x4A27aC91c5cD3768F140ECabDe3FC2B2d92eDb98) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0xF684f2CB299cCDaAB483ffc1573B82f40C6b775b"]
      values.$pastUpgrades.0.1:
-        ["0xF684f2CB299cCDaAB483ffc1573B82f40C6b775b"]
+        "0x2c7c12aeaf738701352017fc49f5268db9632b84bdc6f76474e6776371f53b7e"
    }
```

```diff
    contract PolygonZkEVMEtrog (0x519E42c24163192Dca44CD3fBDCEBF6be9130987) {
    +++ description: None
      values.$pastUpgrades.3.2:
+        ["0x2650a9a4fC64f63F573EF0F405064EF54BC46f71"]
      values.$pastUpgrades.3.1:
-        ["0x2650a9a4fC64f63F573EF0F405064EF54BC46f71"]
+        "0x069690e412d29d96bc94d6bf5c816e43bb401cbf948f3e3cad261e073e2d2afe"
      values.$pastUpgrades.2.2:
+        ["0x2650a9a4fC64f63F573EF0F405064EF54BC46f71"]
      values.$pastUpgrades.2.1:
-        ["0x2650a9a4fC64f63F573EF0F405064EF54BC46f71"]
+        "0x67e892c44b9d14709693e74dd5e17fb40d98c8c2cc1c5330265e758e8958a01b"
      values.$pastUpgrades.1.2:
+        ["0x2650a9a4fC64f63F573EF0F405064EF54BC46f71"]
      values.$pastUpgrades.1.1:
-        ["0x2650a9a4fC64f63F573EF0F405064EF54BC46f71"]
+        "0xeba0bc3b2674c961c5a998f22f789ea610a7c3e57e622a4dd951cca2702b8be3"
      values.$pastUpgrades.0.2:
+        ["0x79BCB82B35A335cD8A8Ec433b304a0c91f67CDE0"]
      values.$pastUpgrades.0.1:
-        ["0x79BCB82B35A335cD8A8Ec433b304a0c91f67CDE0"]
+        "0x4e3fc80071c2d0852584cb59bfcd784519bfb3582aa3334098a4b32b5f6aaef4"
    }
```

```diff
    contract usdcBridge (0x70E70e58ed7B1Cec0D8ef7464072ED8A52d755eB) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0xA4e6762eAAf259DA74696F46fAAF79bA9DdE14E6"]
      values.$pastUpgrades.0.1:
-        ["0xA4e6762eAAf259DA74696F46fAAF79bA9DdE14E6"]
+        "0x6402dc60bb9c4f704f126f4b11e40b33c287b4ac7f73ea60c50d7452d52ce735"
    }
```

```diff
    contract wstETHBridge (0xf0CDE1E7F0FAD79771cd526b1Eb0A12F69582C01) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0x18FED1E19dC564DC917D203be9d40790472D22e9"]
      values.$pastUpgrades.0.1:
-        ["0x18FED1E19dC564DC917D203be9d40790472D22e9"]
+        "0x12c54f4243dc8e3b41be87984b78248eecbf98b92e30ff10b487be2599d7e3a1"
    }
```

Generated with discovered.json: 0xa52a6e95e97f6f81ea4e73f44b254a0cf5482586

# Diff at Mon, 14 Oct 2024 10:54:24 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1afc77ff111ceb0970e7d09efcc7b2f376b0c281 block: 20878349
- current block number: 20878349

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20878349 (main branch discovery), not current.

```diff
    contract daiBridge (0x4A27aC91c5cD3768F140ECabDe3FC2B2d92eDb98) {
    +++ description: None
      sourceHashes:
+        ["0x612fcbfe67b3a142750d4b383ec80c3df15e053a88579b6d54660253f4c19baa","0x608730e7656b64bd18a9a04f2b0024b9dc95d2145d3e6cde1f5d590f31f4fff4"]
    }
```

```diff
    contract PolygonZkEVMEtrog (0x519E42c24163192Dca44CD3fBDCEBF6be9130987) {
    +++ description: None
      sourceHashes:
+        ["0xa25e4c87882527d75fa2198c374939dd0c3b3fd509be89ee51c9b206bc62bdc4","0xf303702e52579ed796873f92868d2ebedd55360bf53043519e6061b19df3eb4b"]
    }
```

```diff
    contract usdcBridge (0x70E70e58ed7B1Cec0D8ef7464072ED8A52d755eB) {
    +++ description: None
      sourceHashes:
+        ["0x74f36c1c292d2992d00c72ffd2ff8a4b8648a1c9058e63210c2742186a9daf50","0xefc52c461b0de070fb85381ef77033d1a68b13e59d2ca477477b766802ab1164"]
    }
```

```diff
    contract PolygonzkEVMVerifier (0xc521580cd8586Cc688A7430F9DcE0f6A803F2883) {
    +++ description: None
      sourceHashes:
+        ["0x1b9299553467d8c5557640b4aa02efa58c4fd2cec8e008db1a70ce0a1c5a131b"]
    }
```

```diff
    contract wstETHBridge (0xf0CDE1E7F0FAD79771cd526b1Eb0A12F69582C01) {
    +++ description: None
      sourceHashes:
+        ["0x612fcbfe67b3a142750d4b383ec80c3df15e053a88579b6d54660253f4c19baa","0x768cec78a852b6918281dca4675713010a4e764f5eb658f4f98c8ae258523e62"]
    }
```

```diff
    contract EscrowsAdmin (0xf694C9e3a34f5Fa48b6f3a0Ff186C1c6c4FcE904) {
    +++ description: None
      sourceHashes:
+        ["0x81a7349eebb98ac33b0bc6842e3cb258034a8f2a4ba004570bb8e2e25947f9ff","0xd42bbf9f7dcd3720a7fc6bdc6edfdfae8800a37d6dd4decfa0ef6ca4a2e88940"]
    }
```

Generated with discovered.json: 0x917901b9460d0dd2a0523a068882d3b1aa9a7536

# Diff at Wed, 02 Oct 2024 14:16:59 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@d101c705b5f4fd0b3af2e251678b85e1005b31d8 block: 20871583
- current block number: 20878349

## Description

Config related.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20871583 (main branch discovery), not current.

```diff
    contract daiBridge (0x4A27aC91c5cD3768F140ECabDe3FC2B2d92eDb98) {
    +++ description: None
      values.$pastUpgrades:
+        [["2023-09-20T08:44:59.000Z",["0xF684f2CB299cCDaAB483ffc1573B82f40C6b775b"]]]
    }
```

```diff
    contract PolygonZkEVMEtrog (0x519E42c24163192Dca44CD3fBDCEBF6be9130987) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-01-27T14:16:11.000Z",["0x79BCB82B35A335cD8A8Ec433b304a0c91f67CDE0"]],["2024-03-14T12:25:35.000Z",["0x2650a9a4fC64f63F573EF0F405064EF54BC46f71"]],["2024-03-24T23:36:47.000Z",["0x2650a9a4fC64f63F573EF0F405064EF54BC46f71"]],["2024-10-01T14:22:59.000Z",["0x2650a9a4fC64f63F573EF0F405064EF54BC46f71"]]]
    }
```

```diff
    contract usdcBridge (0x70E70e58ed7B1Cec0D8ef7464072ED8A52d755eB) {
    +++ description: None
      values.$pastUpgrades:
+        [["2023-11-16T09:12:59.000Z",["0xA4e6762eAAf259DA74696F46fAAF79bA9DdE14E6"]]]
    }
```

```diff
    contract wstETHBridge (0xf0CDE1E7F0FAD79771cd526b1Eb0A12F69582C01) {
    +++ description: None
      values.$pastUpgrades:
+        [["2023-12-30T14:05:35.000Z",["0x18FED1E19dC564DC917D203be9d40790472D22e9"]]]
    }
```

Generated with discovered.json: 0x469f25ff62470643e6bf703e44cf4a67fc26b66f

# Diff at Tue, 01 Oct 2024 15:37:34 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@974999225bba0722b5e81edd4c1b80928d80ef33 block: 19976289
- current block number: 20871583

## Description

PolygonZkEVMEtrog upgrades to RollupType 5. The consensus implementation is identical but the verifier was upgraded for the [Eggfruit upgrade](https://polygon.technology/blog/eggfruit-upgrade-incoming-polygon-zkevm-mainnet-beta-will-see-the-cdk-erigon-sequencer-go-live). TLDR: New Sequencer algo, double zkCounters for proofs. New verifier added to ZKCatalog

## Watched changes

```diff
    contract PolygonZkEVMEtrog (0x519E42c24163192Dca44CD3fBDCEBF6be9130987) {
    +++ description: None
      values.$upgradeCount:
-        3
+        4
    }
```

```diff
+   Status: CREATED
    contract PolygonzkEVMVerifier (0xc521580cd8586Cc688A7430F9DcE0f6A803F2883)
    +++ description: None
```

## Source code changes

```diff
.../ethereum/.flat/PolygonzkEVMVerifier.sol        | 1225 ++++++++++++++++++++
 1 file changed, 1225 insertions(+)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19976289 (main branch discovery), not current.

```diff
-   Status: DELETED
    contract PolygonzkEVMVerifier (0x0775e11309d75aA6b0967917fB0213C5673eDf81)
    +++ description: None
```

Generated with discovered.json: 0x1dcae3247ace42c350c893c2e841c55da2fea9e5

# Diff at Fri, 30 Aug 2024 07:54:46 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@6c1bd1f41fadf5f2cb1c1805b5a2c6138a3ed35a block: 19976289
- current block number: 19976289

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19976289 (main branch discovery), not current.

```diff
    contract EscrowsAdmin (0xf694C9e3a34f5Fa48b6f3a0Ff186C1c6c4FcE904) {
    +++ description: None
      receivedPermissions.2.via:
-        []
      receivedPermissions.1.via:
-        []
      receivedPermissions.0.via:
-        []
    }
```

Generated with discovered.json: 0xb8ebb36c10a462b3828a207f6ce26e0f4764f292

# Diff at Fri, 23 Aug 2024 09:54:18 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@67597c7d6c810bc726594446890178150240711e block: 19976289
- current block number: 19976289

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19976289 (main branch discovery), not current.

```diff
    contract daiBridge (0x4A27aC91c5cD3768F140ECabDe3FC2B2d92eDb98) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract PolygonZkEVMEtrog (0x519E42c24163192Dca44CD3fBDCEBF6be9130987) {
    +++ description: None
      values.$upgradeCount:
+        3
    }
```

```diff
    contract usdcBridge (0x70E70e58ed7B1Cec0D8ef7464072ED8A52d755eB) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract wstETHBridge (0xf0CDE1E7F0FAD79771cd526b1Eb0A12F69582C01) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

Generated with discovered.json: 0xb79a429b56b8f47389871952082996dfa58b20b8

# Diff at Wed, 21 Aug 2024 10:05:07 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@2f6dde3357bf5d79196b6e94f79d853a6c4ec72b block: 19976289
- current block number: 19976289

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19976289 (main branch discovery), not current.

```diff
    contract daiBridge (0x4A27aC91c5cD3768F140ECabDe3FC2B2d92eDb98) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xf694C9e3a34f5Fa48b6f3a0Ff186C1c6c4FcE904","via":[]}]
    }
```

```diff
    contract usdcBridge (0x70E70e58ed7B1Cec0D8ef7464072ED8A52d755eB) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xf694C9e3a34f5Fa48b6f3a0Ff186C1c6c4FcE904","via":[]}]
    }
```

```diff
    contract wstETHBridge (0xf0CDE1E7F0FAD79771cd526b1Eb0A12F69582C01) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xf694C9e3a34f5Fa48b6f3a0Ff186C1c6c4FcE904","via":[]}]
    }
```

```diff
    contract EscrowsAdmin (0xf694C9e3a34f5Fa48b6f3a0Ff186C1c6c4FcE904) {
    +++ description: None
      assignedPermissions:
-        {"upgrade":["0x4A27aC91c5cD3768F140ECabDe3FC2B2d92eDb98","0x70E70e58ed7B1Cec0D8ef7464072ED8A52d755eB","0xf0CDE1E7F0FAD79771cd526b1Eb0A12F69582C01"]}
      receivedPermissions:
+        [{"permission":"upgrade","target":"0x4A27aC91c5cD3768F140ECabDe3FC2B2d92eDb98","via":[]},{"permission":"upgrade","target":"0x70E70e58ed7B1Cec0D8ef7464072ED8A52d755eB","via":[]},{"permission":"upgrade","target":"0xf0CDE1E7F0FAD79771cd526b1Eb0A12F69582C01","via":[]}]
    }
```

Generated with discovered.json: 0x901d413d0e95ba5a32961d0cd486c42bc5283372

# Diff at Fri, 09 Aug 2024 12:01:29 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bf40aa32f030fd312056ca0ef198c8550467d1d7 block: 19976289
- current block number: 19976289

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19976289 (main branch discovery), not current.

```diff
    contract EscrowsAdmin (0xf694C9e3a34f5Fa48b6f3a0Ff186C1c6c4FcE904) {
    +++ description: None
      assignedPermissions.upgrade.2:
-        "0x4A27aC91c5cD3768F140ECabDe3FC2B2d92eDb98"
+        "0xf0CDE1E7F0FAD79771cd526b1Eb0A12F69582C01"
      assignedPermissions.upgrade.1:
-        "0xf0CDE1E7F0FAD79771cd526b1Eb0A12F69582C01"
+        "0x70E70e58ed7B1Cec0D8ef7464072ED8A52d755eB"
      assignedPermissions.upgrade.0:
-        "0x70E70e58ed7B1Cec0D8ef7464072ED8A52d755eB"
+        "0x4A27aC91c5cD3768F140ECabDe3FC2B2d92eDb98"
    }
```

Generated with discovered.json: 0x9f68fdc6fb4ac14493a880e395842dc1abdf55d3

# Diff at Fri, 09 Aug 2024 10:11:30 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f0da1d0aab7bc6b3b5e54e7e93480bd98e57035 block: 19976289
- current block number: 19976289

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19976289 (main branch discovery), not current.

```diff
    contract EscrowsAdmin (0xf694C9e3a34f5Fa48b6f3a0Ff186C1c6c4FcE904) {
    +++ description: None
      assignedPermissions.admin:
-        ["0x4A27aC91c5cD3768F140ECabDe3FC2B2d92eDb98","0x70E70e58ed7B1Cec0D8ef7464072ED8A52d755eB","0xf0CDE1E7F0FAD79771cd526b1Eb0A12F69582C01"]
      assignedPermissions.upgrade:
+        ["0x70E70e58ed7B1Cec0D8ef7464072ED8A52d755eB","0xf0CDE1E7F0FAD79771cd526b1Eb0A12F69582C01","0x4A27aC91c5cD3768F140ECabDe3FC2B2d92eDb98"]
      values.$multisigThreshold:
-        "5 of 10 (50%)"
      values.getOwners:
-        ["0x099198353446A9E3a20672eDC1Bd461E978842c3","0xb771380f912E4b5F6beDdf81314C383c13F16ab5","0xD09971D8ed6C6a5e57581e90d593ee5B94e348D4","0xc4591c41e01a7a654B5427f39Bbd1dEe5bD45D1D","0xE6Ee0F8D81170160d50ed77b9C91E6219473d43a","0xd1B856ee12Bd00922cae8DD86ab068f8c0F95224","0xF53D1fB2EeD22Cf1E8f7E90Da7f1CAe88344065F","0xf56AE6520776934127AB68438d1b4652BCe07F8f","0x4DE44Aa0Ef9DB64DF3eB3465d35D73d0409d44ed","0x4E83124eD15b13265240B61EC9627797CCE1032E"]
      values.getThreshold:
-        5
      values.$members:
+        ["0x099198353446A9E3a20672eDC1Bd461E978842c3","0xb771380f912E4b5F6beDdf81314C383c13F16ab5","0xD09971D8ed6C6a5e57581e90d593ee5B94e348D4","0xc4591c41e01a7a654B5427f39Bbd1dEe5bD45D1D","0xE6Ee0F8D81170160d50ed77b9C91E6219473d43a","0xd1B856ee12Bd00922cae8DD86ab068f8c0F95224","0xF53D1fB2EeD22Cf1E8f7E90Da7f1CAe88344065F","0xf56AE6520776934127AB68438d1b4652BCe07F8f","0x4DE44Aa0Ef9DB64DF3eB3465d35D73d0409d44ed","0x4E83124eD15b13265240B61EC9627797CCE1032E"]
      values.$threshold:
+        5
      values.multisigThreshold:
+        "5 of 10 (50%)"
    }
```

Generated with discovered.json: 0xdc92728d1ede1255c3c1eda9b00f3d1e5bf76f6f

# Diff at Wed, 29 May 2024 15:03:42 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@d0877009edde2713b2b4f20a593b40156f5de045 block: 19882098
- current block number: 19976289

## Description

Config related: Owner is upgrade admin.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19882098 (main branch discovery), not current.

```diff
    contract daiBridge (0x4A27aC91c5cD3768F140ECabDe3FC2B2d92eDb98) {
    +++ description: None
      upgradeability.admin:
-        "0x0000000000000000000000000000000000000000"
+        "0xf694C9e3a34f5Fa48b6f3a0Ff186C1c6c4FcE904"
    }
```

```diff
    contract wstETHBridge (0xf0CDE1E7F0FAD79771cd526b1Eb0A12F69582C01) {
    +++ description: None
      upgradeability.admin:
-        "0x0000000000000000000000000000000000000000"
+        "0xf694C9e3a34f5Fa48b6f3a0Ff186C1c6c4FcE904"
    }
```

Generated with discovered.json: 0x4515b3bf0a04d364ba904bb95dfb9f63eb817b41

# Diff at Thu, 16 May 2024 11:00:12 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@59d36171ee3aaf27d6db0c75fdfba523d2dad686 block: 19718019
- current block number: 19882098

## Description

Changes related to merging with shared-polygon-cdk module.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19718019 (main branch discovery), not current.

```diff
-   Status: DELETED
    contract Permit2 (0x000000000022D473030F116dDEE9F6B43aC78BA3)
    +++ description: None
```

```diff
-   Status: DELETED
    contract ProxyAdmin (0x0F99738B2Fc14D77308337f3e2596b63aE7BCC4A)
    +++ description: None
```

```diff
-   Status: DELETED
    contract ProxyAdminOwner (0x242daE44F5d8fb54B198D03a94dA45B5a4413e21)
    +++ description: None
```

```diff
-   Status: DELETED
    contract PolygonEcosystemToken (0x455e53CBB86018Ac2B8092FdCd39d8444aFFC3F6)
    +++ description: None
```

```diff
-   Status: DELETED
    contract PolygonRollupManager (0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2)
    +++ description: None
```

```diff
-   Status: DELETED
    contract PolygonZkEVMTimelock (0xEf1462451C30Ea7aD8555386226059Fe837CA4EF)
    +++ description: None
```

Generated with discovered.json: 0xefb4ab49d34c980ed2331351d16f29395fabf092

# Diff at Tue, 23 Apr 2024 12:13:17 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@490974f5b59ffaa2fc80e604d18674505076a157 block: 19610743
- current block number: 19718019

## Description

Unified naming across CDK chains. Before, there were two ProxyAdmin with the same name, now the shared one is called SharedProxyAdmin. Also, the owner of the project specific one is not necessarily a multisig, hence the name change.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19610743 (main branch discovery), not current.

```diff
    contract AdminMultisig (0x242daE44F5d8fb54B198D03a94dA45B5a4413e21) {
    +++ description: None
      name:
-        "AdminMultisig"
+        "ProxyAdminOwner"
    }
```

Generated with discovered.json: 0x52ccc712d84f6a377b14c04b6db779a53ac555f5

# Diff at Mon, 08 Apr 2024 11:46:45 GMT:

- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@786d5557d38c508087b24a36535c329c2bdbb5ab block: 19567779
- current block number: 19610743

## Description

Provide description of changes. This section will be preserved.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19567779 (main branch discovery), not current.

```diff
-   Status: DELETED
    contract PolygonDataCommittee (0x05652Ec92366F3C2255991a265c499E01Ba58e6a)
    +++ description: None
```

```diff
-   Status: DELETED
    contract AstarVerifier (0x1C3A3da552b8662CD69538356b1E7c2E9CC1EBD8)
    +++ description: None
```

```diff
-   Status: DELETED
    contract ProxyAdmin (0x1e37EA18e9515db29b3E94A00eD31484A3130204)
    +++ description: None
```

```diff
-   Status: DELETED
    contract PolygonValidiumStorageMigration (0x2B0ee28D4D51bC9aDde5E58E295873F61F4a0507)
    +++ description: None
```

```diff
    contract PolygonRollupManager (0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2) {
    +++ description: None
      values.rollupsData:
-        [["0x519E42c24163192Dca44CD3fBDCEBF6be9130987","0x0775e11309d75aA6b0967917fB0213C5673eDf81"],["0x1E163594e13030244DCAf4cDfC2cd0ba3206DA80","0x1C3A3da552b8662CD69538356b1E7c2E9CC1EBD8"],["0x2B0ee28D4D51bC9aDde5E58E295873F61F4a0507","0x0775e11309d75aA6b0967917fB0213C5673eDf81"]]
      values.rollupTypes:
-        [["0x9cf80f7eB1C76ec5AE7A88b417e373449b73ac30","0x1C3A3da552b8662CD69538356b1E7c2E9CC1EBD8"],["0x2650a9a4fC64f63F573EF0F405064EF54BC46f71","0x4AaBBA26EA9E7A7fbD052d17a167e6aE3F8eC7Be"],["0x2650a9a4fC64f63F573EF0F405064EF54BC46f71","0x0775e11309d75aA6b0967917fB0213C5673eDf81"],["0x10D296e8aDd0535be71639E5D1d1c30ae1C6bD4C","0x0775e11309d75aA6b0967917fB0213C5673eDf81"]]
+++ description: Contains important info such as the etrog and verifier address, the rollup type and chain id
+++ type: CODE_CHANGE
+++ severity: HIGH
      values.rollupData:
+        ["0x519E42c24163192Dca44CD3fBDCEBF6be9130987",1101,"0x0775e11309d75aA6b0967917fB0213C5673eDf81",9,3,0]
    }
```

```diff
-   Status: DELETED
    contract PolygonZkEVMGlobalExitRootV2 (0x580bda1e7A0CFAe92Fa7F6c20A3794F169CE3CFb)
    +++ description: None
```

```diff
-   Status: DELETED
    contract OKBImplementation (0x75231F58b43240C9718Dd58B4967c5114342a86c)
    +++ description: None
```

Generated with discovered.json: 0x7df5f71d1ed0f07745e549570e9739ff2364c904

# Diff at Tue, 02 Apr 2024 11:20:19 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@a9206f2bf2edf120bcda65c615e62ea076a00070 block: 19532872
- current block number: 19567779

## Description

Provide description of changes. This section will be preserved.

## Watched changes

```diff
    contract PolygonRollupManager (0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2) {
    +++ description: None
+++ description: The number of rollups that the manager can use.
+++ type: CODE_CHANGE
+++ severity: LOW
      values.rollupCount:
-        2
+        3
+++ description: Mapping of a rollup type to rollup verifier. Different types may use the same verifier. First entry is a type, second a verifier.
+++ type: CODE_CHANGE
+++ severity: MEDIUM
      values.rollupsData.2:
+        ["0x2B0ee28D4D51bC9aDde5E58E295873F61F4a0507","0x0775e11309d75aA6b0967917fB0213C5673eDf81"]
+++ description: The number of unique rollup types that the manager can use.
+++ type: CODE_CHANGE
+++ severity: MEDIUM
      values.rollupTypeCount:
-        3
+        4
      values.rollupTypes.3:
+        ["0x10D296e8aDd0535be71639E5D1d1c30ae1C6bD4C","0x0775e11309d75aA6b0967917fB0213C5673eDf81"]
    }
```

```diff
    contract PolygonZkEVMGlobalExitRootV2 (0x580bda1e7A0CFAe92Fa7F6c20A3794F169CE3CFb) {
    +++ description: None
      values.depositCount:
-        5945
+        6983
      values.getLastGlobalExitRoot:
-        "0xee5c8f1eb72c1915898e2914abf28aa11bfe10ca6e393db30c6b531406f2f6cf"
+        "0xc095e5994a0b9fd52ea40b40a773ef3501d71b6714aaa9f317da893d00a4a232"
      values.getRoot:
-        "0x42559113116e8552ddedf5c4552865fc4d53903950bc34bc89d5cf4a0bbbe27e"
+        "0xfa45b3fc78774ebaab9c348497cd3179c1b985b3d5acd9f7943ef5249df28026"
      values.lastMainnetExitRoot:
-        "0x1aa4e48476c7ebb872566736708747cb59e441468ea08e19ad6046061352daa9"
+        "0xb660abe75b32c4549f002831954229d9bca2088cbba3e11ed323d658d3405195"
      values.lastRollupExitRoot:
-        "0xc730e9d9cb04245242f2616137241456683e0393915305b7f76542e4e1deb344"
+        "0xbe9fd8ca76197d4a5e1a89029ce2a23b17702c9c061ac9e1d5653d6de3cdd87e"
    }
```

```diff
+   Status: CREATED
    contract PolygonDataCommittee (0x05652Ec92366F3C2255991a265c499E01Ba58e6a)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x1e37EA18e9515db29b3E94A00eD31484A3130204)
    +++ description: None
```

```diff
+   Status: CREATED
    contract PolygonValidiumStorageMigration (0x2B0ee28D4D51bC9aDde5E58E295873F61F4a0507)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OKBImplementation (0x75231F58b43240C9718Dd58B4967c5114342a86c)
    +++ description: None
```

## Source code changes

```diff
.../.code/OKBImplementation/implementation/OKb.sol |  408 +++++
 .../OKBImplementation/implementation/SafeMath.sol  |   28 +
 .../OKBImplementation/implementation/meta.txt      |    2 +
 .../.code/OKBImplementation/proxy/Address.sol      |   23 +
 .../proxy/OwnedUpgradeabilityProxy.sol             |   86 +
 .../.code/OKBImplementation/proxy/Proxy.sol        |   34 +
 .../proxy/UpgradeabilityProxy.sol                  |   59 +
 .../.code/OKBImplementation/proxy/meta.txt         |    2 +
 .../@openzeppelin/contracts/utils/Strings.sol      |   70 +
 .../contracts/utils/cryptography/ECDSA.sol         |  213 +++
 .../@openzeppelin/contracts/utils/math/Math.sol    |  345 ++++
 .../access/OwnableUpgradeable.sol                  |   95 +
 .../proxy/utils/Initializable.sol                  |  165 ++
 .../utils/AddressUpgradeable.sol                   |  219 +++
 .../utils/ContextUpgradeable.sol                   |   37 +
 .../v2/consensus/validium/PolygonDataCommittee.sol |  197 ++
 .../v2/interfaces/IDataAvailabilityProtocol.sol    |   12 +
 .../v2/interfaces/IPolygonDataCommitteeErrors.sol  |   40 +
 .../PolygonDataCommittee/implementation/meta.txt   |    2 +
 .../@openzeppelin/contracts/access/Ownable.sol     |   83 +
 .../contracts/interfaces/IERC1967.sol              |   26 +
 .../contracts/interfaces/draft-IERC1822.sol        |   20 +
 .../contracts/proxy/ERC1967/ERC1967Proxy.sol       |   32 +
 .../contracts/proxy/ERC1967/ERC1967Upgrade.sol     |  171 ++
 .../proxy/@openzeppelin/contracts/proxy/Proxy.sol  |   86 +
 .../contracts/proxy/beacon/BeaconProxy.sol         |   61 +
 .../contracts/proxy/beacon/IBeacon.sol             |   16 +
 .../contracts/proxy/beacon/UpgradeableBeacon.sol   |   65 +
 .../contracts/proxy/transparent/ProxyAdmin.sol     |   81 +
 .../transparent/TransparentUpgradeableProxy.sol    |  193 ++
 .../@openzeppelin/contracts/utils/Address.sol      |  244 +++
 .../@openzeppelin/contracts/utils/Context.sol      |   24 +
 .../@openzeppelin/contracts/utils/StorageSlot.sol  |   88 +
 .../.code/PolygonDataCommittee/proxy/meta.txt      |    2 +
 .../access/IAccessControlUpgradeable.sol           |   88 +
 .../proxy/utils/Initializable.sol                  |  165 ++
 .../token/ERC20/IERC20Upgradeable.sol              |   82 +
 .../ERC20/extensions/IERC20MetadataUpgradeable.sol |   28 +
 .../extensions/draft-IERC20PermitUpgradeable.sol   |   60 +
 .../token/ERC20/utils/SafeERC20Upgradeable.sol     |  116 ++
 .../utils/AddressUpgradeable.sol                   |  219 +++
 .../utils/ContextUpgradeable.sol                   |   37 +
 .../utils/StringsUpgradeable.sol                   |   70 +
 .../utils/introspection/ERC165Upgradeable.sol      |   42 +
 .../utils/introspection/IERC165Upgradeable.sol     |   25 +
 .../utils/math/MathUpgradeable.sol                 |  345 ++++
 .../@openzeppelin/contracts5/access/Ownable.sol    |  100 +
 .../contracts5/interfaces/IERC1967.sol             |   24 +
 .../contracts5/proxy/ERC1967/ERC1967Proxy.sol      |   40 +
 .../contracts5/proxy/ERC1967/ERC1967Utils.sol      |  193 ++
 .../@openzeppelin/contracts5/proxy/Proxy.sol       |   69 +
 .../contracts5/proxy/beacon/IBeacon.sol            |   16 +
 .../contracts5/proxy/transparent/ProxyAdmin.sol    |   45 +
 .../transparent/TransparentUpgradeableProxy.sol    |  116 ++
 .../@openzeppelin/contracts5/utils/Address.sol     |  159 ++
 .../@openzeppelin/contracts5/utils/Context.sol     |   24 +
 .../@openzeppelin/contracts5/utils/StorageSlot.sol |  135 ++
 .../interfaces/IBasePolygonZkEVMGlobalExitRoot.sol |   16 +
 .../contracts/interfaces/IPolygonZkEVMBridge.sol   |  118 ++
 .../contracts/interfaces/IPolygonZkEVMErrors.sol   |  211 +++
 .../contracts/interfaces/IVerifierRollup.sol       |   13 +
 .../contracts/lib/EmergencyManager.sol             |   73 +
 .../contracts/v2/PolygonRollupManager.sol          | 1911 ++++++++++++++++++++
 .../migration/PolygonRollupBaseEtrogNoGap.sol      |  945 ++++++++++
 .../migration/PolygonValidiumStorageMigration.sol  |  347 ++++
 .../consensus/zkEVM/PolygonZkEVMExistentEtrog.sol  |  134 ++
 .../v2/interfaces/IDataAvailabilityProtocol.sol    |   12 +
 .../contracts/v2/interfaces/IPolygonRollupBase.sol |   20 +
 .../v2/interfaces/IPolygonRollupManager.sol        |  170 ++
 .../contracts/v2/interfaces/IPolygonValidium.sol   |   15 +
 .../v2/interfaces/IPolygonZkEVMBridgeV2.sol        |  166 ++
 .../interfaces/IPolygonZkEVMGlobalExitRootV2.sol   |   10 +
 .../v2/interfaces/IPolygonZkEVMVEtrogErrors.sol    |   56 +
 .../contracts/v2/lib/LegacyZKEVMStateVariables.sol |  153 ++
 .../v2/lib/PolygonAccessControlUpgradeable.sol     |  245 +++
 .../contracts/v2/lib/PolygonConstantsBase.sol      |   14 +
 .../contracts/v2/lib/PolygonRollupBaseEtrog.sol    |  951 ++++++++++
 .../contracts/v2/lib/PolygonTransparentProxy.sol   |   79 +
 .../implementation/meta.txt                        |    2 +
 .../PolygonValidiumStorageMigration/proxy/meta.txt |    2 +
 .../ProxyAdmin.sol                                 |    0
 .../meta.txt                                       |    0
 .../@openzeppelin/contracts/access/Ownable.sol     |   83 +
 .../contracts/interfaces/IERC1967.sol              |   26 +
 .../contracts/interfaces/draft-IERC1822.sol        |   20 +
 .../contracts/proxy/ERC1967/ERC1967Proxy.sol       |   32 +
 .../contracts/proxy/ERC1967/ERC1967Upgrade.sol     |  171 ++
 .../@openzeppelin/contracts/proxy/Proxy.sol        |   86 +
 .../contracts/proxy/beacon/BeaconProxy.sol         |   61 +
 .../contracts/proxy/beacon/IBeacon.sol             |   16 +
 .../contracts/proxy/beacon/UpgradeableBeacon.sol   |   65 +
 .../contracts/proxy/transparent/ProxyAdmin.sol     |   81 +
 .../transparent/TransparentUpgradeableProxy.sol    |  193 ++
 .../@openzeppelin/contracts/utils/Address.sol      |  244 +++
 .../@openzeppelin/contracts/utils/Context.sol      |   24 +
 .../@openzeppelin/contracts/utils/StorageSlot.sol  |   88 +
 .../meta.txt                                       |    2 +
 97 files changed, 12282 insertions(+)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19532872 (main branch discovery), not current.

```diff
-   Status: DELETED
    contract AstarValidiumAdmin (0x1963D7b78e75A5eDfF9e5376E7A07A935Fb3d50d)
    +++ description: None
```

```diff
-   Status: DELETED
    contract AstarValidiumEtrog (0x1E163594e13030244DCAf4cDfC2cd0ba3206DA80)
    +++ description: None
```

```diff
-   Status: DELETED
    contract Bridge (0x2a3DD3EB832aF982ec71669E178424b10Dca2EDe)
    +++ description: None
```

```diff
-   Status: DELETED
    contract SecurityCouncil (0x37c58Dfa7BF0A165C5AAEdDf3e2EdB475ac6Dcb6)
    +++ description: None
```

```diff
    contract PolygonRollupManager (0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2) {
    +++ description: None
      values._HALT_AGGREGATION_TIMEOUT:
-        604800
      values.accessControl:
-        {"DEFAULT_ADMIN_ROLE":{"adminRole":"DEFAULT_ADMIN_ROLE","members":["0xEf1462451C30Ea7aD8555386226059Fe837CA4EF"]},"TRUSTED_AGGREGATOR":{"adminRole":"TRUSTED_AGGREGATOR_ADMIN","members":["0x6329Fe417621925C81c16F9F9a18c203C21Af7ab","0x20A53dCb196cD2bcc14Ece01F358f1C849aA51dE"]},"ADD_ROLLUP_TYPE":{"adminRole":"DEFAULT_ADMIN_ROLE","members":["0xEf1462451C30Ea7aD8555386226059Fe837CA4EF"]},"ADD_EXISTING_ROLLUP":{"adminRole":"DEFAULT_ADMIN_ROLE","members":["0xEf1462451C30Ea7aD8555386226059Fe837CA4EF"]},"UPDATE_ROLLUP":{"adminRole":"DEFAULT_ADMIN_ROLE","members":["0xEf1462451C30Ea7aD8555386226059Fe837CA4EF","0x242daE44F5d8fb54B198D03a94dA45B5a4413e21"]},"OBSOLETE_ROLLUP_TYPE":{"adminRole":"DEFAULT_ADMIN_ROLE","members":["0x242daE44F5d8fb54B198D03a94dA45B5a4413e21"]},"CREATE_ROLLUP":{"adminRole":"DEFAULT_ADMIN_ROLE","members":["0x242daE44F5d8fb54B198D03a94dA45B5a4413e21"]},"STOP_EMERGENCY":{"adminRole":"DEFAULT_ADMIN_ROLE","members":["0x242daE44F5d8fb54B198D03a94dA45B5a4413e21"]},"TWEAK_PARAMETERS":{"adminRole":"DEFAULT_ADMIN_ROLE","members":["0x242daE44F5d8fb54B198D03a94dA45B5a4413e21"]},"TRUSTED_AGGREGATOR_ADMIN":{"adminRole":"DEFAULT_ADMIN_ROLE","members":["0x242daE44F5d8fb54B198D03a94dA45B5a4413e21"]},"SET_FEE":{"adminRole":"DEFAULT_ADMIN_ROLE","members":["0x242daE44F5d8fb54B198D03a94dA45B5a4413e21"]},"EMERGENCY_COUNCIL":{"adminRole":"EMERGENCY_COUNCIL_ADMIN","members":["0x37c58Dfa7BF0A165C5AAEdDf3e2EdB475ac6Dcb6"]},"EMERGENCY_COUNCIL_ADMIN":{"adminRole":"DEFAULT_ADMIN_ROLE","members":["0x37c58Dfa7BF0A165C5AAEdDf3e2EdB475ac6Dcb6"]}}
      values.emergencyStateCount:
-        1
      values.getRollupExitRoot:
-        "0xc730e9d9cb04245242f2616137241456683e0393915305b7f76542e4e1deb344"
      values.lastAggregationTimestamp:
-        1711631879
      values.nondeterministicPendingState:
-        []
      values.totalSequencedBatches:
-        27933
      values.totalVerifiedBatches:
-        27902
    }
```

```diff
    contract GlobalExitRootV2 (0x580bda1e7A0CFAe92Fa7F6c20A3794F169CE3CFb) {
    +++ description: None
      name:
-        "GlobalExitRootV2"
+        "PolygonZkEVMGlobalExitRootV2"
      values.getLastGlobalExitRoot:
+        "0xee5c8f1eb72c1915898e2914abf28aa11bfe10ca6e393db30c6b531406f2f6cf"
      values.lastMainnetExitRoot:
+        "0x1aa4e48476c7ebb872566736708747cb59e441468ea08e19ad6046061352daa9"
      values.lastRollupExitRoot:
+        "0xc730e9d9cb04245242f2616137241456683e0393915305b7f76542e4e1deb344"
    }
```

```diff
-   Status: DELETED
    contract GnosisSafe (0x6c4876Ecb5de33f76700f44d547C593065806dAC)
    +++ description: None
```

```diff
-   Status: DELETED
    contract AstarValidiumDAC (0x9CCD205052c732Ac1Df2cf7bf8aACC0E371eE0B0)
    +++ description: None
```

```diff
    contract Timelock (0xEf1462451C30Ea7aD8555386226059Fe837CA4EF) {
    +++ description: None
      name:
-        "Timelock"
+        "PolygonZkEVMTimelock"
      values.accessControl:
-        {"DEFAULT_ADMIN_ROLE":{"adminRole":"DEFAULT_ADMIN_ROLE","members":[]},"TIMELOCK_ADMIN_ROLE":{"adminRole":"TIMELOCK_ADMIN_ROLE","members":["0xEf1462451C30Ea7aD8555386226059Fe837CA4EF","0x242daE44F5d8fb54B198D03a94dA45B5a4413e21"]},"PROPOSER_ROLE":{"adminRole":"TIMELOCK_ADMIN_ROLE","members":["0x242daE44F5d8fb54B198D03a94dA45B5a4413e21"]},"EXECUTOR_ROLE":{"adminRole":"TIMELOCK_ADMIN_ROLE","members":["0x242daE44F5d8fb54B198D03a94dA45B5a4413e21"]},"CANCELLER_ROLE":{"adminRole":"TIMELOCK_ADMIN_ROLE","members":["0x242daE44F5d8fb54B198D03a94dA45B5a4413e21"]}}
      values.scheduledTransactions:
-        [{"id":"0xb50bcda49f13b2aa0ddc72fa32eec2b6ea4cd8af5a9823762150c7d94a210476","target":"0x0F99738B2Fc14D77308337f3e2596b63aE7BCC4A","value":0,"data":"0x9623609d0000000000000000000000005132a183e9f3cb7c848b0aac5ae0c4f0491b7ab2000000000000000000000000301442aa888701c8b86727d42f3c55fb0dd9ef7f000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000647240f9af0000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000001176322e302e302d5243312d666f726b2e3500000000000000000000000000000000000000000000000000000000000000000000000000000000000000","delay":864000},{"id":"0x99979392a952eef62666ac91808b1c6b3b35a34092712ab965dbb85ac0b0a702","target":"0x0F99738B2Fc14D77308337f3e2596b63aE7BCC4A","value":0,"data":"0x9623609d0000000000000000000000005132a183e9f3cb7c848b0aac5ae0c4f0491b7ab2000000000000000000000000b1585916487acedd99952086f2950763d253b923000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000647240f9af0000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000001076332e302e302d696e636162657272790000000000000000000000000000000000000000000000000000000000000000000000000000000000000000","delay":864000},{"id":"0xff337aa79b453bd0ae64d7668a9ac83cdf4666bde0977afdf04462c4e14978c8","target":"0x0F99738B2Fc14D77308337f3e2596b63aE7BCC4A","value":0,"data":"0x99a88ec4000000000000000000000000580bda1e7a0cfae92fa7f6c20a3794f169ce3cfb0000000000000000000000002e38cd55163137483e30580cb468c2dff1d85077","delay":864000},{"id":"0xff337aa79b453bd0ae64d7668a9ac83cdf4666bde0977afdf04462c4e14978c8","target":"0x0F99738B2Fc14D77308337f3e2596b63aE7BCC4A","value":0,"data":"0x99a88ec40000000000000000000000002a3dd3eb832af982ec71669e178424b10dca2ede0000000000000000000000000feb850b183c57534b56b7d56520133c8f9bdb65","delay":864000},{"id":"0xff337aa79b453bd0ae64d7668a9ac83cdf4666bde0977afdf04462c4e14978c8","target":"0x0F99738B2Fc14D77308337f3e2596b63aE7BCC4A","value":0,"data":"0x9623609d0000000000000000000000005132a183e9f3cb7c848b0aac5ae0c4f0491b7ab20000000000000000000000003b82da772c825283d85d5d6717a77c6ff582053b000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000001440645af090000000000000000000000006329fe417621925c81c16f9f9a18c203c21af7ab00000000000000000000000000000000000000000000000000000000000697800000000000000000000000000000000000000000000000000000000000069780000000000000000000000000242dae44f5d8fb54b198d03a94da45b5a4413e21000000000000000000000000ef1462451c30ea7ad8555386226059fe837ca4ef00000000000000000000000037c58dfa7bf0a165c5aaeddf3e2edb475ac6dcb6000000000000000000000000519e42c24163192dca44cd3fbdcebf6be91309870000000000000000000000001c3a3da552b8662cd69538356b1e7c2e9cc1ebd80000000000000000000000000000000000000000000000000000000000000007000000000000000000000000000000000000000000000000000000000000044d00000000000000000000000000000000000000000000000000000000","delay":864000},{"id":"0x84be1445c72b5d8056fe3f1a482e08a6ef1a74fdc78f85dbb16f1d5980f4f16a","target":"0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2","value":0,"data":"0xf34eb8eb0000000000000000000000009cf80f7eb1c76ec5ae7a88b417e373449b73ac300000000000000000000000001c3a3da552b8662cd69538356b1e7c2e9cc1ebd800000000000000000000000000000000000000000000000000000000000000070000000000000000000000000000000000000000000000000000000000000000e3a7d8bae497945ba8ddc51c69564f60ad4c1a990b9c7bdbd27f7929bfa8f27200000000000000000000000000000000000000000000000000000000000000c0000000000000000000000000000000000000000000000000000000000000005d547970653a2056616c696469756d2c2056657273696f6e3a206574726f672c2067656e657369733a202f697066732f516d55586e526f5062556d5a75455a43477969486a45736f4e6346567533684c74537668706e664253326d415955000000","delay":864000},{"id":"0x8bae5e2a8aaf4501e263b917591e7fcf9b1d28c85962a8847a845aff916b50ad","target":"0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2","value":0,"data":"0xf34eb8eb0000000000000000000000002650a9a4fc64f63f573ef0f405064ef54bc46f710000000000000000000000004aabba26ea9e7a7fbd052d17a167e6ae3f8ec7be00000000000000000000000000000000000000000000000000000000000000080000000000000000000000000000000000000000000000000000000000000000e3a7d8bae497945ba8ddc51c69564f60ad4c1a990b9c7bdbd27f7929bfa8f27200000000000000000000000000000000000000000000000000000000000000c0000000000000000000000000000000000000000000000000000000000000005e547970653a207a6b45564d2c2056657273696f6e3a20696e636162657272792c2067656e657369733a202f697066732f516d55586e526f5062556d5a75455a43477969486a45736f4e6346567533684c74537668706e664253326d4159550000","delay":864000},{"id":"0xb492d5648af7003fa67cd99f58c95eaec5a32e0768bb99268bee18b19e8cf869","target":"0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2","value":0,"data":"0xc4c928c2000000000000000000000000519e42c24163192dca44cd3fbdcebf6be9130987000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000000","delay":864000},{"id":"0xd43e98454a4d7bef73956a5239de00d4858589ccf39f1d26a8c5bd9d1e5f671b","target":"0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2","value":0,"data":"0xf34eb8eb00000000000000000000000010d296e8add0535be71639e5d1d1c30ae1c6bd4c0000000000000000000000004aabba26ea9e7a7fbd052d17a167e6ae3f8ec7be00000000000000000000000000000000000000000000000000000000000000080000000000000000000000000000000000000000000000000000000000000000e3a7d8bae497945ba8ddc51c69564f60ad4c1a990b9c7bdbd27f7929bfa8f27200000000000000000000000000000000000000000000000000000000000000c00000000000000000000000000000000000000000000000000000000000000061547970653a2056616c696469756d2c2056657273696f6e3a20696e636162657272792c2067656e657369733a202f697066732f516d55586e526f5062556d5a75455a43477969486a45736f4e6346567533684c74537668706e664253326d41595500000000000000000000000000000000000000000000000000000000000000","delay":864000},{"id":"0xd67d30e173069baf06cd69ce4df5951d855ab47e107cbaf1ac07f0fa42fb6af9","target":"0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2","value":0,"data":"0xc4c928c20000000000000000000000001e163594e13030244dcaf4cdfc2cd0ba3206da800000000000000000000000000000000000000000000000000000000000000003000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000041c8b937000000000000000000000000000000000000000000000000000000000","delay":864000},{"id":"0xdf877691807571a83db47daab96ce9c103ea6459d7a56b57f040f8039186cd31","target":"0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2","value":0,"data":"0xf34eb8eb0000000000000000000000002650a9a4fc64f63f573ef0f405064ef54bc46f710000000000000000000000000775e11309d75aa6b0967917fb0213c5673edf8100000000000000000000000000000000000000000000000000000000000000090000000000000000000000000000000000000000000000000000000000000000e3a7d8bae497945ba8ddc51c69564f60ad4c1a990b9c7bdbd27f7929bfa8f27200000000000000000000000000000000000000000000000000000000000000c00000000000000000000000000000000000000000000000000000000000000060547970653a207a6b45564d2c2056657273696f6e3a20656c64656c6265727279322c2067656e657369733a202f697066732f516d55586e526f5062556d5a75455a43477969486a45736f4e6346567533684c74537668706e664253326d415955","delay":0},{"id":"0xdd9feb4dbad03c98d76f1bc8d746e99e1ee05ecac1b4233e1388d6c6532e02f6","target":"0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2","value":0,"data":"0x2f2ff15d66156603fe29d13f97c6f3e3dff4ef71919f9aa61c555be0182d954e94221aac000000000000000000000000242dae44f5d8fb54b198d03a94da45b5a4413e21","delay":0},{"id":"0xdecad137d29f44776cbe1de5721dd879cbc65f189fa8f4f93451c6621fa31363","target":"0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2","value":0,"data":"0xf34eb8eb00000000000000000000000010d296e8add0535be71639e5d1d1c30ae1c6bd4c0000000000000000000000000775e11309d75aa6b0967917fb0213c5673edf8100000000000000000000000000000000000000000000000000000000000000090000000000000000000000000000000000000000000000000000000000000000e3a7d8bae497945ba8ddc51c69564f60ad4c1a990b9c7bdbd27f7929bfa8f27200000000000000000000000000000000000000000000000000000000000000c00000000000000000000000000000000000000000000000000000000000000063547970653a2056616c696469756d2c2056657273696f6e3a20656c64656c6265727279322c2067656e657369733a202f697066732f516d55586e526f5062556d5a75455a43477969486a45736f4e6346567533684c74537668706e664253326d4159550000000000000000000000000000000000000000000000000000000000","delay":0}]
      values.CANCELLER_ROLE:
+        "0xfd643c72710c63c0180259aba6b2d05451e3591a24e58b62239378085726f783"
      values.DEFAULT_ADMIN_ROLE:
+        "0x0000000000000000000000000000000000000000000000000000000000000000"
      values.EXECUTOR_ROLE:
+        "0xd8aa0f3194971a2a116679f7c2090f6939c8d4e01a2a8d7e41d55e5351469e63"
      values.PROPOSER_ROLE:
+        "0xb09aa5aeb3702cfd50b6b62bc4532604938f21248a27a1d5ca736082b6819cc1"
      values.TIMELOCK_ADMIN_ROLE:
+        "0x5f58e3a2316349923ce3780f8d587db2d72378aed66a8261c916544fa6846ca5"
    }
```

```diff
-   Status: DELETED
    contract AstarValidiumMultisig (0xf98ee8c46baEa2B11e4f0450AD9D01861265F76E)
    +++ description: None
```

Generated with discovered.json: 0xd3e73fddb8acc8a7591d34699a86184f8f54330d

# Diff at Thu, 28 Mar 2024 13:22:10 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@d6dd20a306b268b851f83df5487b048c1253bb51 block: 19525935
- current block number: 19532872

## Description

Update discovery to include the multisig threshold.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19525935 (main branch discovery), not current.

```diff
    contract AdminMultisig (0x242daE44F5d8fb54B198D03a94dA45B5a4413e21) {
    +++ description: None
      upgradeability.threshold:
+        "2 of 3 (67%)"
    }
```

```diff
    contract SecurityCouncil (0x37c58Dfa7BF0A165C5AAEdDf3e2EdB475ac6Dcb6) {
    +++ description: None
      upgradeability.threshold:
+        "6 of 8 (75%)"
    }
```

```diff
    contract GnosisSafe (0x6c4876Ecb5de33f76700f44d547C593065806dAC) {
    +++ description: None
      upgradeability.threshold:
+        "1 of 3 (33%)"
    }
```

```diff
    contract EscrowsAdmin (0xf694C9e3a34f5Fa48b6f3a0Ff186C1c6c4FcE904) {
    +++ description: None
      upgradeability.threshold:
+        "5 of 10 (50%)"
    }
```

```diff
    contract AstarValidiumMultisig (0xf98ee8c46baEa2B11e4f0450AD9D01861265F76E) {
    +++ description: None
      upgradeability.threshold:
+        "3 of 6 (50%)"
    }
```

Generated with discovered.json: 0xf529407fa5a83721b1e452946ad1c73f810e6979

# Diff at Tue, 26 Mar 2024 11:08:48 GMT:

- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@b787afc6089da9eb3ee495639a48cf4838b84df9 block: 19510549
- current block number: 19518217

## Description

Added fetch of scheduled transactions.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19510549 (main branch discovery), not current.

```diff
    contract Timelock (0xEf1462451C30Ea7aD8555386226059Fe837CA4EF) {
    +++ description: None
      values.scheduledTransactions:
+        [{"id":"0xb50bcda49f13b2aa0ddc72fa32eec2b6ea4cd8af5a9823762150c7d94a210476","target":"0x0F99738B2Fc14D77308337f3e2596b63aE7BCC4A","value":0,"data":"0x9623609d0000000000000000000000005132a183e9f3cb7c848b0aac5ae0c4f0491b7ab2000000000000000000000000301442aa888701c8b86727d42f3c55fb0dd9ef7f000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000647240f9af0000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000001176322e302e302d5243312d666f726b2e3500000000000000000000000000000000000000000000000000000000000000000000000000000000000000","delay":864000},{"id":"0x99979392a952eef62666ac91808b1c6b3b35a34092712ab965dbb85ac0b0a702","target":"0x0F99738B2Fc14D77308337f3e2596b63aE7BCC4A","value":0,"data":"0x9623609d0000000000000000000000005132a183e9f3cb7c848b0aac5ae0c4f0491b7ab2000000000000000000000000b1585916487acedd99952086f2950763d253b923000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000647240f9af0000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000001076332e302e302d696e636162657272790000000000000000000000000000000000000000000000000000000000000000000000000000000000000000","delay":864000},{"id":"0xff337aa79b453bd0ae64d7668a9ac83cdf4666bde0977afdf04462c4e14978c8","target":"0x0F99738B2Fc14D77308337f3e2596b63aE7BCC4A","value":0,"data":"0x99a88ec4000000000000000000000000580bda1e7a0cfae92fa7f6c20a3794f169ce3cfb0000000000000000000000002e38cd55163137483e30580cb468c2dff1d85077","delay":864000},{"id":"0xff337aa79b453bd0ae64d7668a9ac83cdf4666bde0977afdf04462c4e14978c8","target":"0x0F99738B2Fc14D77308337f3e2596b63aE7BCC4A","value":0,"data":"0x99a88ec40000000000000000000000002a3dd3eb832af982ec71669e178424b10dca2ede0000000000000000000000000feb850b183c57534b56b7d56520133c8f9bdb65","delay":864000},{"id":"0xff337aa79b453bd0ae64d7668a9ac83cdf4666bde0977afdf04462c4e14978c8","target":"0x0F99738B2Fc14D77308337f3e2596b63aE7BCC4A","value":0,"data":"0x9623609d0000000000000000000000005132a183e9f3cb7c848b0aac5ae0c4f0491b7ab20000000000000000000000003b82da772c825283d85d5d6717a77c6ff582053b000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000001440645af090000000000000000000000006329fe417621925c81c16f9f9a18c203c21af7ab00000000000000000000000000000000000000000000000000000000000697800000000000000000000000000000000000000000000000000000000000069780000000000000000000000000242dae44f5d8fb54b198d03a94da45b5a4413e21000000000000000000000000ef1462451c30ea7ad8555386226059fe837ca4ef00000000000000000000000037c58dfa7bf0a165c5aaeddf3e2edb475ac6dcb6000000000000000000000000519e42c24163192dca44cd3fbdcebf6be91309870000000000000000000000001c3a3da552b8662cd69538356b1e7c2e9cc1ebd80000000000000000000000000000000000000000000000000000000000000007000000000000000000000000000000000000000000000000000000000000044d00000000000000000000000000000000000000000000000000000000","delay":864000},{"id":"0x84be1445c72b5d8056fe3f1a482e08a6ef1a74fdc78f85dbb16f1d5980f4f16a","target":"0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2","value":0,"data":"0xf34eb8eb0000000000000000000000009cf80f7eb1c76ec5ae7a88b417e373449b73ac300000000000000000000000001c3a3da552b8662cd69538356b1e7c2e9cc1ebd800000000000000000000000000000000000000000000000000000000000000070000000000000000000000000000000000000000000000000000000000000000e3a7d8bae497945ba8ddc51c69564f60ad4c1a990b9c7bdbd27f7929bfa8f27200000000000000000000000000000000000000000000000000000000000000c0000000000000000000000000000000000000000000000000000000000000005d547970653a2056616c696469756d2c2056657273696f6e3a206574726f672c2067656e657369733a202f697066732f516d55586e526f5062556d5a75455a43477969486a45736f4e6346567533684c74537668706e664253326d415955000000","delay":864000},{"id":"0x8bae5e2a8aaf4501e263b917591e7fcf9b1d28c85962a8847a845aff916b50ad","target":"0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2","value":0,"data":"0xf34eb8eb0000000000000000000000002650a9a4fc64f63f573ef0f405064ef54bc46f710000000000000000000000004aabba26ea9e7a7fbd052d17a167e6ae3f8ec7be00000000000000000000000000000000000000000000000000000000000000080000000000000000000000000000000000000000000000000000000000000000e3a7d8bae497945ba8ddc51c69564f60ad4c1a990b9c7bdbd27f7929bfa8f27200000000000000000000000000000000000000000000000000000000000000c0000000000000000000000000000000000000000000000000000000000000005e547970653a207a6b45564d2c2056657273696f6e3a20696e636162657272792c2067656e657369733a202f697066732f516d55586e526f5062556d5a75455a43477969486a45736f4e6346567533684c74537668706e664253326d4159550000","delay":864000},{"id":"0xb492d5648af7003fa67cd99f58c95eaec5a32e0768bb99268bee18b19e8cf869","target":"0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2","value":0,"data":"0xc4c928c2000000000000000000000000519e42c24163192dca44cd3fbdcebf6be9130987000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000000","delay":864000},{"id":"0xd43e98454a4d7bef73956a5239de00d4858589ccf39f1d26a8c5bd9d1e5f671b","target":"0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2","value":0,"data":"0xf34eb8eb00000000000000000000000010d296e8add0535be71639e5d1d1c30ae1c6bd4c0000000000000000000000004aabba26ea9e7a7fbd052d17a167e6ae3f8ec7be00000000000000000000000000000000000000000000000000000000000000080000000000000000000000000000000000000000000000000000000000000000e3a7d8bae497945ba8ddc51c69564f60ad4c1a990b9c7bdbd27f7929bfa8f27200000000000000000000000000000000000000000000000000000000000000c00000000000000000000000000000000000000000000000000000000000000061547970653a2056616c696469756d2c2056657273696f6e3a20696e636162657272792c2067656e657369733a202f697066732f516d55586e526f5062556d5a75455a43477969486a45736f4e6346567533684c74537668706e664253326d41595500000000000000000000000000000000000000000000000000000000000000","delay":864000},{"id":"0xd67d30e173069baf06cd69ce4df5951d855ab47e107cbaf1ac07f0fa42fb6af9","target":"0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2","value":0,"data":"0xc4c928c20000000000000000000000001e163594e13030244dcaf4cdfc2cd0ba3206da800000000000000000000000000000000000000000000000000000000000000003000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000041c8b937000000000000000000000000000000000000000000000000000000000","delay":864000},{"id":"0xdf877691807571a83db47daab96ce9c103ea6459d7a56b57f040f8039186cd31","target":"0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2","value":0,"data":"0xf34eb8eb0000000000000000000000002650a9a4fc64f63f573ef0f405064ef54bc46f710000000000000000000000000775e11309d75aa6b0967917fb0213c5673edf8100000000000000000000000000000000000000000000000000000000000000090000000000000000000000000000000000000000000000000000000000000000e3a7d8bae497945ba8ddc51c69564f60ad4c1a990b9c7bdbd27f7929bfa8f27200000000000000000000000000000000000000000000000000000000000000c00000000000000000000000000000000000000000000000000000000000000060547970653a207a6b45564d2c2056657273696f6e3a20656c64656c6265727279322c2067656e657369733a202f697066732f516d55586e526f5062556d5a75455a43477969486a45736f4e6346567533684c74537668706e664253326d415955","delay":0},{"id":"0xdd9feb4dbad03c98d76f1bc8d746e99e1ee05ecac1b4233e1388d6c6532e02f6","target":"0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2","value":0,"data":"0x2f2ff15d66156603fe29d13f97c6f3e3dff4ef71919f9aa61c555be0182d954e94221aac000000000000000000000000242dae44f5d8fb54b198d03a94da45b5a4413e21","delay":0},{"id":"0xdecad137d29f44776cbe1de5721dd879cbc65f189fa8f4f93451c6621fa31363","target":"0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2","value":0,"data":"0xf34eb8eb00000000000000000000000010d296e8add0535be71639e5d1d1c30ae1c6bd4c0000000000000000000000000775e11309d75aa6b0967917fb0213c5673edf8100000000000000000000000000000000000000000000000000000000000000090000000000000000000000000000000000000000000000000000000000000000e3a7d8bae497945ba8ddc51c69564f60ad4c1a990b9c7bdbd27f7929bfa8f27200000000000000000000000000000000000000000000000000000000000000c00000000000000000000000000000000000000000000000000000000000000063547970653a2056616c696469756d2c2056657273696f6e3a20656c64656c6265727279322c2067656e657369733a202f697066732f516d55586e526f5062556d5a75455a43477969486a45736f4e6346567533684c74537668706e664253326d4159550000000000000000000000000000000000000000000000000000000000","delay":0}]
    }
```

Generated with discovered.json: 0x65c228f8ed1ab55cbd9a6e85bc1f2f348606c976

# Diff at Mon, 25 Mar 2024 09:16:42 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@9bc44b13c53d42ef5e81d478df7a78975e8d4088 block: 19440911
- current block number: 19510549

## Description

A bug stalled the chain for 13 hours and the emergency state was activated in response. A new rollup type was added to update the Polygon zkEVM verifier. The emergency state was then deactivated. We are waiting for the post-mortem.

## Watched changes

```diff
-   Status: DELETED
    contract FflonkVerifier (0x4AaBBA26EA9E7A7fbD052d17a167e6aE3F8eC7Be)
    +++ description: None
```

```diff
    contract PolygonRollupManager (0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2) {
    +++ description: None
      values.accessControl.UPDATE_ROLLUP.members.1:
+        "0x242daE44F5d8fb54B198D03a94dA45B5a4413e21"
+++ description: The emergency state has been activated, meaning that the upgrade delay is now zero.
+++ type: RISK_PARAMETER
+++ severity: HIGH
      values.emergencyStateCount:
-        0
+        1
      values.lastDeactivatedEmergencyStateTimestamp:
-        0
+        1711323791
+++ description: Mapping of a rollup type to rollup verifier. Different types may use the same verifier. First entry is a type, second a verifier.
+++ type: CODE_CHANGE
+++ severity: MEDIUM
      values.rollupsData.0.1:
-        "0x4AaBBA26EA9E7A7fbD052d17a167e6aE3F8eC7Be"
+        "0x0775e11309d75aA6b0967917fB0213C5673eDf81"
+++ description: The number of unique rollup types that the manager can use.
+++ type: CODE_CHANGE
+++ severity: MEDIUM
      values.rollupTypeCount:
-        2
+        3
      values.rollupTypes.2:
+        ["0x2650a9a4fC64f63F573EF0F405064EF54BC46f71","0x0775e11309d75aA6b0967917fB0213C5673eDf81"]
    }
```

```diff
+   Status: CREATED
    contract PolygonzkEVMVerifier (0x0775e11309d75aA6b0967917fB0213C5673eDf81)
    +++ description: None
```

## Source code changes

```diff
.../ethereum/.code@19440911/FflonkVerifier/meta.txt => /dev/null      | 2 --
 .../PolygonzkEVMVerifier}/contracts/verifiers/FflonkVerifier.sol      | 4 ++--
 .../polygonzkevm/ethereum/.code/PolygonzkEVMVerifier/meta.txt         | 2 ++
 3 files changed, 4 insertions(+), 4 deletions(-)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19440911 (main branch discovery), not current.

```diff
    contract PolygonzkEVMVerifier (0x4AaBBA26EA9E7A7fbD052d17a167e6aE3F8eC7Be) {
    +++ description: None
      name:
-        "PolygonzkEVMVerifier"
+        "FflonkVerifier"
    }
```

```diff
    contract PolygonRollupManager (0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2) {
    +++ description: None
      values.nondeterminsiticPendingState:
-        []
+++ description: The emergency state has been activated, meaning that the upgrade delay is now zero.
+++ type: RISK_PARAMETER
+++ severity: HIGH
      values.emergencyStateCount:
+        0
      values.nondeterministicPendingState:
+        []
      values.rollupTypes:
+        [["0x9cf80f7eB1C76ec5AE7A88b417e373449b73ac30","0x1C3A3da552b8662CD69538356b1E7c2E9CC1EBD8"],["0x2650a9a4fC64f63F573EF0F405064EF54BC46f71","0x4AaBBA26EA9E7A7fbD052d17a167e6aE3F8eC7Be"]]
    }
```

Generated with discovered.json: 0x9b4d7769cda4996d3d0134957a58e639e4b6f2dc

# Diff at Fri, 15 Mar 2024 14:22:39 GMT:

- author: Bartek Kiepuszewski (<bkiepuszewski@gmail.com>)
- comparing to: main@955bf46d3045f69b7cc7dac86edbb5dae6945bc4 block: 19433041
- current block number: 19440911

## Description

- Relatively small changes to `PolygonZkEVMExistentEtrog` which now is called `PolygonZkEVMEtrog`
- New FFlonkVerifier (`0x4AaBBA26EA9E7A7fbD052d17a167e6aE3F8eC7Be`) for PolygonzkEVM. The previous FFlonkVerifier is still used by Astar Validium. Because of the change there are now two RollupTypes.

### PolygonZkEVMExistentEtrog

Contract name has changed to `PolygonZkEVMEtrog`. The method `seqenceBatches` now takes to additional parameters: `maxSequenceTimestamp` and `initSequencedBatch`. It is an additional safety measure, the `maxSequenceTimestamp` must be inside a safety range (actual + 36 seconds). This timestamp should be equal or higher of the last block inside the sequence, otherwise this batch will be invalidated by circuit.

## Watched changes

```diff
    contract PolygonRollupManager (0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2) {
    +++ description: None
+++ description: Mapping of a rollup type to rollup verifier. Different types may use the same verifier. First entry is a type, second a verifier.
+++ type: CODE_CHANGE
+++ severity: MEDIUM
      values.rollupsData.0.1:
-        "0x1C3A3da552b8662CD69538356b1E7c2E9CC1EBD8"
+        "0x4AaBBA26EA9E7A7fbD052d17a167e6aE3F8eC7Be"
+++ description: The number of unique rollup types that the manager can use.
+++ type: CODE_CHANGE
+++ severity: MEDIUM
      values.rollupTypeCount:
-        1
+        2
    }
```

```diff
    contract PolygonZkEVMEtrog (0x519E42c24163192Dca44CD3fBDCEBF6be9130987) {
    +++ description: None
      upgradeability.implementation:
-        "0x79BCB82B35A335cD8A8Ec433b304a0c91f67CDE0"
+        "0x2650a9a4fC64f63F573EF0F405064EF54BC46f71"
      implementations.0:
-        "0x79BCB82B35A335cD8A8Ec433b304a0c91f67CDE0"
+        "0x2650a9a4fC64f63F573EF0F405064EF54BC46f71"
      values.SET_UP_ETROG_TX:
-        "0xdf2a8080944d5cf5032b2a844602278b01199ed191a86c93ff8080821092808000000000000000000000000000000000000000000000000000000005ca1ab1e000000000000000000000000000000000000000000000000000000005ca1ab1e01bff"
      values.TIMESTAMP_RANGE:
+        36
      derivedName:
-        "PolygonZkEVMExistentEtrog"
+        "PolygonZkEVMEtrog"
    }
```

```diff
+   Status: CREATED
    contract PolygonzkEVMVerifier (0x4AaBBA26EA9E7A7fbD052d17a167e6aE3F8eC7Be)
    +++ description: None
```

## Source code changes

```diff
.../v2/consensus/zkEVM/PolygonZkEVMEtrog.sol       |   34 +
 .../v2/interfaces/IPolygonZkEVMVEtrogErrors.sol    |   10 +
 .../contracts/v2/lib/PolygonRollupBaseEtrog.sol    |   36 +-
 .../PolygonZkEVMEtrog/implementation/meta.txt      |    4 +-
 .../contracts/verifiers/FflonkVerifier.sol         | 1244 ++++++++++++++++++++
 .../ethereum/.code/PolygonzkEVMVerifier/meta.txt   |    2 +
 6 files changed, 1324 insertions(+), 6 deletions(-)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19433041 (main branch discovery), not current.

```diff
    contract FflonkVerifier (0x1C3A3da552b8662CD69538356b1E7c2E9CC1EBD8) {
    +++ description: None
      name:
-        "FflonkVerifier"
+        "AstarVerifier"
    }
```

```diff
    contract PolygonZkEVMExistentEtrog (0x519E42c24163192Dca44CD3fBDCEBF6be9130987) {
    +++ description: None
      name:
-        "PolygonZkEVMExistentEtrog"
+        "PolygonZkEVMEtrog"
    }
```

Generated with discovered.json: 0xf5c29c1b6e921c17297af2fa6650362ebbbffcb5

# Diff at Thu, 14 Mar 2024 11:46:46 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@24c5721630392f8b6f59093376472db03d18b2c2 block: 19282832
- current block number: 19433041

## Description

Added a Validium - AstarZKEVM.
The validium is owned by AstarValidiumAdmin that itself is owned by AstarValidiumMultisig.

A trusted aggregator has been added that is an [EOA](https://etherscan.io/address/0x20A53dCb196cD2bcc14Ece01F358f1C849aA51dE).
On 2024-02-29 [willbutton.eth](https://etherscan.io/tx/0x760fd86f9453477e23df16def04777fb6282dda9f8546e93b2f7b866467b2e49) sent some eth to that address.
A day later it was given 5ETH by a [multisig](https://etherscan.io/address/0xc984295ad7a950fb5031154bcfc0b6267b948706) and 20ETH a week later by the same multisig.
The account has been calling `verifyBatchesTrustedAggregator()` starting from 2024-03-04 and does so around once an hour.
We don't have that multisig in any discovery.
The trusted aggregator can call `verifyBatchesTrustedAggregator()`, `overridePendingState()` as well as `consolidatePendingState()` skipping all timeout restrictions.

## Watched changes

```diff
    contract PolygonRollupManager (0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2) {
    +++ description: None
      values.accessControl.TRUSTED_AGGREGATOR.members.1:
+        "0x20A53dCb196cD2bcc14Ece01F358f1C849aA51dE"
+++ description: The number of rollups that the manager can use.
+++ type: CODE_CHANGE
+++ severity: LOW
      values.rollupCount:
-        1
+        2
+++ description: Addresses of the rollup backend as well as the rollup verifier.
+++ type: CODE_CHANGE
+++ severity: MEDIUM
      values.rollupsData.1:
+        ["0x1E163594e13030244DCAf4cDfC2cd0ba3206DA80","0x1C3A3da552b8662CD69538356b1E7c2E9CC1EBD8"]
+++ description: The number of unique rollup types that the manager can use.
+++ type: CODE_CHANGE
+++ severity: MEDIUM
      values.rollupTypeCount:
-        0
+        1
    }
```

```diff
+   Status: CREATED
    contract AstarValidiumAdmin (0x1963D7b78e75A5eDfF9e5376E7A07A935Fb3d50d)
    +++ description: None
```

```diff
+   Status: CREATED
    contract AstarValidiumEtrog (0x1E163594e13030244DCAf4cDfC2cd0ba3206DA80)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafe (0x6c4876Ecb5de33f76700f44d547C593065806dAC)
    +++ description: None
```

```diff
+   Status: CREATED
    contract AstarValidiumDAC (0x9CCD205052c732Ac1Df2cf7bf8aACC0E371eE0B0)
    +++ description: None
```

```diff
+   Status: CREATED
    contract AstarValidiumMultisig (0xf98ee8c46baEa2B11e4f0450AD9D01861265F76E)
    +++ description: None
```

## Source code changes

```diff
.../@openzeppelin/contracts/access/Ownable.sol     |   83 +
 .../contracts/interfaces/IERC1967.sol              |   26 +
 .../contracts/interfaces/draft-IERC1822.sol        |   20 +
 .../contracts/proxy/ERC1967/ERC1967Proxy.sol       |   32 +
 .../contracts/proxy/ERC1967/ERC1967Upgrade.sol     |  171 ++
 .../@openzeppelin/contracts/proxy/Proxy.sol        |   86 +
 .../contracts/proxy/beacon/BeaconProxy.sol         |   61 +
 .../contracts/proxy/beacon/IBeacon.sol             |   16 +
 .../contracts/proxy/beacon/UpgradeableBeacon.sol   |   65 +
 .../contracts/proxy/transparent/ProxyAdmin.sol     |   81 +
 .../transparent/TransparentUpgradeableProxy.sol    |  193 ++
 .../@openzeppelin/contracts/utils/Address.sol      |  244 +++
 .../@openzeppelin/contracts/utils/Context.sol      |   24 +
 .../@openzeppelin/contracts/utils/StorageSlot.sol  |   88 +
 .../ethereum/.code/AstarValidiumAdmin/meta.txt     |    2 +
 .../@openzeppelin/contracts/utils/Strings.sol      |   70 +
 .../contracts/utils/cryptography/ECDSA.sol         |  213 +++
 .../@openzeppelin/contracts/utils/math/Math.sol    |  345 ++++
 .../access/OwnableUpgradeable.sol                  |   95 +
 .../proxy/utils/Initializable.sol                  |  165 ++
 .../utils/AddressUpgradeable.sol                   |  219 +++
 .../utils/ContextUpgradeable.sol                   |   37 +
 .../v2/consensus/validium/PolygonDataCommittee.sol |  197 ++
 .../v2/interfaces/IDataAvailabilityProtocol.sol    |   12 +
 .../v2/interfaces/IPolygonDataCommitteeErrors.sol  |   40 +
 .../.code/AstarValidiumDAC/implementation/meta.txt |    2 +
 .../@openzeppelin/contracts/access/Ownable.sol     |   83 +
 .../contracts/interfaces/IERC1967.sol              |   26 +
 .../contracts/interfaces/draft-IERC1822.sol        |   20 +
 .../contracts/proxy/ERC1967/ERC1967Proxy.sol       |   32 +
 .../contracts/proxy/ERC1967/ERC1967Upgrade.sol     |  171 ++
 .../proxy/@openzeppelin/contracts/proxy/Proxy.sol  |   86 +
 .../contracts/proxy/beacon/BeaconProxy.sol         |   61 +
 .../contracts/proxy/beacon/IBeacon.sol             |   16 +
 .../contracts/proxy/beacon/UpgradeableBeacon.sol   |   65 +
 .../contracts/proxy/transparent/ProxyAdmin.sol     |   81 +
 .../transparent/TransparentUpgradeableProxy.sol    |  193 ++
 .../@openzeppelin/contracts/utils/Address.sol      |  244 +++
 .../@openzeppelin/contracts/utils/Context.sol      |   24 +
 .../@openzeppelin/contracts/utils/StorageSlot.sol  |   88 +
 .../ethereum/.code/AstarValidiumDAC/proxy/meta.txt |    2 +
 .../access/IAccessControlUpgradeable.sol           |   88 +
 .../proxy/utils/Initializable.sol                  |  165 ++
 .../token/ERC20/IERC20Upgradeable.sol              |   82 +
 .../ERC20/extensions/IERC20MetadataUpgradeable.sol |   28 +
 .../extensions/draft-IERC20PermitUpgradeable.sol   |   60 +
 .../token/ERC20/utils/SafeERC20Upgradeable.sol     |  116 ++
 .../utils/AddressUpgradeable.sol                   |  219 +++
 .../utils/ContextUpgradeable.sol                   |   37 +
 .../utils/StringsUpgradeable.sol                   |   70 +
 .../utils/introspection/ERC165Upgradeable.sol      |   42 +
 .../utils/introspection/IERC165Upgradeable.sol     |   25 +
 .../utils/math/MathUpgradeable.sol                 |  345 ++++
 .../@openzeppelin/contracts5/access/Ownable.sol    |  100 +
 .../contracts5/interfaces/IERC1967.sol             |   24 +
 .../contracts5/proxy/ERC1967/ERC1967Proxy.sol      |   40 +
 .../contracts5/proxy/ERC1967/ERC1967Utils.sol      |  193 ++
 .../@openzeppelin/contracts5/proxy/Proxy.sol       |   69 +
 .../contracts5/proxy/beacon/IBeacon.sol            |   16 +
 .../contracts5/proxy/transparent/ProxyAdmin.sol    |   45 +
 .../transparent/TransparentUpgradeableProxy.sol    |  116 ++
 .../@openzeppelin/contracts5/utils/Address.sol     |  159 ++
 .../@openzeppelin/contracts5/utils/Context.sol     |   24 +
 .../@openzeppelin/contracts5/utils/StorageSlot.sol |  135 ++
 .../interfaces/IBasePolygonZkEVMGlobalExitRoot.sol |   16 +
 .../contracts/interfaces/IPolygonZkEVMBridge.sol   |  118 ++
 .../contracts/interfaces/IPolygonZkEVMErrors.sol   |  211 +++
 .../contracts/interfaces/IVerifierRollup.sol       |   13 +
 .../contracts/lib/EmergencyManager.sol             |   73 +
 .../contracts/v2/PolygonRollupManager.sol          | 1911 ++++++++++++++++++++
 .../v2/consensus/validium/PolygonValidiumEtrog.sol |  279 +++
 .../consensus/zkEVM/PolygonZkEVMExistentEtrog.sol  |  134 ++
 .../v2/interfaces/IDataAvailabilityProtocol.sol    |   12 +
 .../contracts/v2/interfaces/IPolygonRollupBase.sol |   20 +
 .../v2/interfaces/IPolygonRollupManager.sol        |  170 ++
 .../contracts/v2/interfaces/IPolygonValidium.sol   |   15 +
 .../v2/interfaces/IPolygonZkEVMBridgeV2.sol        |  166 ++
 .../interfaces/IPolygonZkEVMGlobalExitRootV2.sol   |   10 +
 .../v2/interfaces/IPolygonZkEVMVEtrogErrors.sol    |   46 +
 .../contracts/v2/lib/LegacyZKEVMStateVariables.sol |  153 ++
 .../v2/lib/PolygonAccessControlUpgradeable.sol     |  245 +++
 .../contracts/v2/lib/PolygonConstantsBase.sol      |   14 +
 .../contracts/v2/lib/PolygonRollupBaseEtrog.sol    |  923 ++++++++++
 .../contracts/v2/lib/PolygonTransparentProxy.sol   |   79 +
 .../AstarValidiumEtrog/implementation/meta.txt     |    2 +
 .../@openzeppelin/contracts5/access/Ownable.sol    |  100 +
 .../contracts5/interfaces/IERC1967.sol             |   24 +
 .../contracts5/proxy/ERC1967/ERC1967Proxy.sol      |   40 +
 .../contracts5/proxy/ERC1967/ERC1967Utils.sol      |  193 ++
 .../proxy/@openzeppelin/contracts5/proxy/Proxy.sol |   69 +
 .../contracts5/proxy/beacon/IBeacon.sol            |   16 +
 .../contracts5/proxy/transparent/ProxyAdmin.sol    |   45 +
 .../transparent/TransparentUpgradeableProxy.sol    |  116 ++
 .../@openzeppelin/contracts5/utils/Address.sol     |  159 ++
 .../@openzeppelin/contracts5/utils/Context.sol     |   24 +
 .../@openzeppelin/contracts5/utils/StorageSlot.sol |  135 ++
 .../contracts/v2/lib/PolygonTransparentProxy.sol   |   79 +
 .../.code/AstarValidiumEtrog/proxy/meta.txt        |    2 +
 .../implementation/contracts/GnosisSafe.sol        |  422 +++++
 .../implementation/contracts/base/Executor.sol     |   27 +
 .../contracts/base/FallbackManager.sol             |   53 +
 .../implementation/contracts/base/GuardManager.sol |   50 +
 .../contracts/base/ModuleManager.sol               |  133 ++
 .../implementation/contracts/base/OwnerManager.sol |  149 ++
 .../implementation/contracts/common/Enum.sol       |    8 +
 .../contracts/common/EtherPaymentFallback.sol      |   13 +
 .../contracts/common/SecuredTokenTransfer.sol      |   35 +
 .../contracts/common/SelfAuthorized.sol            |   16 +
 .../contracts/common/SignatureDecoder.sol          |   36 +
 .../implementation/contracts/common/Singleton.sol  |   11 +
 .../contracts/common/StorageAccessible.sol         |   47 +
 .../contracts/external/GnosisSafeMath.sol          |   54 +
 .../contracts/interfaces/ISignatureValidator.sol   |   20 +
 .../AstarValidiumMultisig/implementation/meta.txt  |    2 +
 .../proxy/GnosisSafeProxy.sol                      |  155 ++
 .../.code/AstarValidiumMultisig/proxy/meta.txt     |    2 +
 .../implementation/contracts/GnosisSafe.sol        |  422 +++++
 .../implementation/contracts/base/Executor.sol     |   27 +
 .../contracts/base/FallbackManager.sol             |   53 +
 .../implementation/contracts/base/GuardManager.sol |   50 +
 .../contracts/base/ModuleManager.sol               |  133 ++
 .../implementation/contracts/base/OwnerManager.sol |  149 ++
 .../implementation/contracts/common/Enum.sol       |    8 +
 .../contracts/common/EtherPaymentFallback.sol      |   13 +
 .../contracts/common/SecuredTokenTransfer.sol      |   35 +
 .../contracts/common/SelfAuthorized.sol            |   16 +
 .../contracts/common/SignatureDecoder.sol          |   36 +
 .../implementation/contracts/common/Singleton.sol  |   11 +
 .../contracts/common/StorageAccessible.sol         |   47 +
 .../contracts/external/GnosisSafeMath.sol          |   54 +
 .../contracts/interfaces/ISignatureValidator.sol   |   20 +
 .../.code/GnosisSafe/implementation/meta.txt       |    2 +
 .../.code/GnosisSafe/proxy/GnosisSafeProxy.sol     |  155 ++
 .../ethereum/.code/GnosisSafe/proxy/meta.txt       |    2 +
 134 files changed, 14055 insertions(+)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19282832 (main branch discovery), not current.

```diff
    contract PolygonRollupManager (0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2) {
    +++ description: None
+++ description: Addresses of the rollup backend as well as the rollup verifier.
+++ type: CODE_CHANGE
+++ severity: MEDIUM
      values.rollupsData.0.11:
-        0
+++ description: Addresses of the rollup backend as well as the rollup verifier.
+++ type: CODE_CHANGE
+++ severity: MEDIUM
      values.rollupsData.0.10:
-        0
+++ description: Addresses of the rollup backend as well as the rollup verifier.
+++ type: CODE_CHANGE
+++ severity: MEDIUM
      values.rollupsData.0.9:
-        1984749
+++ description: Addresses of the rollup backend as well as the rollup verifier.
+++ type: CODE_CHANGE
+++ severity: MEDIUM
      values.rollupsData.0.8:
-        0
+++ description: Addresses of the rollup backend as well as the rollup verifier.
+++ type: CODE_CHANGE
+++ severity: MEDIUM
      values.rollupsData.0.7:
-        0
+++ description: Addresses of the rollup backend as well as the rollup verifier.
+++ type: CODE_CHANGE
+++ severity: MEDIUM
      values.rollupsData.0.6:
-        1991783
+++ description: Addresses of the rollup backend as well as the rollup verifier.
+++ type: CODE_CHANGE
+++ severity: MEDIUM
      values.rollupsData.0.5:
-        1991800
+++ description: Addresses of the rollup backend as well as the rollup verifier.
+++ type: CODE_CHANGE
+++ severity: MEDIUM
      values.rollupsData.0.4:
-        "0x8ad85f1e7b882d12cf6c64cf256cab8d255d6085e8109400741d82850a1d944b"
+++ description: Addresses of the rollup backend as well as the rollup verifier.
+++ type: CODE_CHANGE
+++ severity: MEDIUM
      values.rollupsData.0.3:
-        7
+++ description: Addresses of the rollup backend as well as the rollup verifier.
+++ type: CODE_CHANGE
+++ severity: MEDIUM
      values.rollupsData.0.2:
-        "0x1C3A3da552b8662CD69538356b1E7c2E9CC1EBD8"
+++ description: Addresses of the rollup backend as well as the rollup verifier.
+++ type: CODE_CHANGE
+++ severity: MEDIUM
      values.rollupsData.0.1:
-        1101
+        "0x1C3A3da552b8662CD69538356b1E7c2E9CC1EBD8"
    }
```

Generated with discovered.json: 0xa044c3c3b7dd5811d191b9d7da48b7a243b45f1c

# Diff at Thu, 22 Feb 2024 11:24:11 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@74fbd7f65d394338041f8804041b27ceceea98b1 block: 19263381
- current block number: 19282832

## Description

Added way to discover rollups added to the RollupManager. Currently we do not support ignoring nested values.

## Watched changes

```diff
    contract PolygonRollupManager (0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2) {
      values.rollupsData.0.6:
-        1990615
+        1991783
      values.rollupsData.0.5:
-        1990630
+        1991800
      values.rollupsData.0.4:
-        "0x6116cb825d6526a68480b15d3958bc28af06dc073278d491f6c1c14b435e6694"
+        "0x8ad85f1e7b882d12cf6c64cf256cab8d255d6085e8109400741d82850a1d944b"
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19263381 (main branch discovery), not current.

```diff
    contract PolygonRollupManager (0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2) {
      values.rollupsData:
+        [["0x519E42c24163192Dca44CD3fBDCEBF6be9130987",1101,"0x1C3A3da552b8662CD69538356b1E7c2E9CC1EBD8",7,"0x6116cb825d6526a68480b15d3958bc28af06dc073278d491f6c1c14b435e6694",1990630,1990615,0,0,1984749,0,0]]
    }
```

Generated with discovered.json: 0xea555dc810751b7357d2f5afb96482369ae5b864

# Diff at Wed, 14 Feb 2024 14:38:23 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@8aff82cf19c6cc452dee84fd82eb20a50a8a57e5 block: 19018668
- current block number: 19226841

## Description

It is now possible to attach many rollups to the same system. Polygon zkEVM is the first one of those. The rollup manager manages roots proposal and the single rollups manage tx data sequencing and forced transactions. Most of the params and roles are now shared. The rest is mostly similar.

## Watched changes

```diff
    contract Bridge (0x2a3DD3EB832aF982ec71669E178424b10Dca2EDe) {
      upgradeability.implementation:
-        "0x5ac4182A1dd41AeEf465E40B82fd326BF66AB82C"
+        "0x0FeB850B183C57534b56b7d56520133C8f9BDB65"
      implementations.0:
-        "0x5ac4182A1dd41AeEf465E40B82fd326BF66AB82C"
+        "0x0FeB850B183C57534b56b7d56520133C8f9BDB65"
      values.polygonZkEVMaddress:
-        "0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2"
      values.BASE_INIT_BYTECODE_WRAPPED_TOKEN:
+        "0x6101006040523480156200001257600080fd5b5060405162001b6638038062001b6683398101604081905262000035916200028d565b82826003620000458382620003a1565b506004620000548282620003a1565b50503360c0525060ff811660e052466080819052620000739062000080565b60a052506200046d915050565b60007f8b73c3c69bb8fe3d512ecc4cf759cc79239f7b179b0ffacaa9a75d522b39400f620000ad6200012e565b805160209182012060408051808201825260018152603160f81b90840152805192830193909352918101919091527fc89efdaa54c0f20c7adf612882df0950f5a951637e0307cdcb4c672f298b8bc66060820152608081018390523060a082015260c001604051602081830303815290604052805190602001209050919050565b6060600380546200013f9062000312565b80601f01602080910402602001604051908101604052809291908181526020018280546200016d9062000312565b8015620001be5780601f106200019257610100808354040283529160200191620001be565b820191906000526020600020905b815481529060010190602001808311620001a057829003601f168201915b5050505050905090565b634e487b7160e01b600052604160045260246000fd5b600082601f830112620001f057600080fd5b81516001600160401b03808211156200020d576200020d620001c8565b604051601f8301601f19908116603f01168101908282118183101715620002385762000238620001c8565b816040528381526020925086838588010111156200025557600080fd5b600091505b838210156200027957858201830151818301840152908201906200025a565b600093810190920192909252949350505050565b600080600060608486031215620002a357600080fd5b83516001600160401b0380821115620002bb57600080fd5b620002c987838801620001de565b94506020860151915080821115620002e057600080fd5b50620002ef86828701620001de565b925050604084015160ff811681146200030757600080fd5b809150509250925092565b600181811c908216806200032757607f821691505b6020821081036200034857634e487b7160e01b600052602260045260246000fd5b50919050565b601f8211156200039c57600081815260208120601f850160051c81016020861015620003775750805b601f850160051c820191505b81811015620003985782815560010162000383565b5050505b505050565b81516001600160401b03811115620003bd57620003bd620001c8565b620003d581620003ce845462000312565b846200034e565b602080601f8311600181146200040d5760008415620003f45750858301515b600019600386901b1c1916600185901b17855562000398565b600085815260208120601f198616915b828110156200043e578886015182559484019460019091019084016200041d565b50858210156200045d5787850151600019600388901b60f8161c191681555b5050505050600190811b01905550565b60805160a05160c05160e0516116aa620004bc6000396000610237015260008181610307015281816105c001526106a70152600061053a015260008181610379015261050401526116aa6000f3fe608060405234801561001057600080fd5b50600436106101775760003560e01c806370a08231116100d8578063a457c2d71161008c578063d505accf11610066578063d505accf1461039b578063dd62ed3e146103ae578063ffa1ad74146103f457600080fd5b8063a457c2d71461034e578063a9059cbb14610361578063cd0d00961461037457600080fd5b806395d89b41116100bd57806395d89b41146102e75780639dc29fac146102ef578063a3c573eb1461030257600080fd5b806370a08231146102915780637ecebe00146102c757600080fd5b806330adf81f1161012f5780633644e515116101145780633644e51514610261578063395093511461026957806340c10f191461027c57600080fd5b806330adf81f14610209578063313ce5671461023057600080fd5b806318160ddd1161016057806318160ddd146101bd57806320606b70146101cf57806323b872dd146101f657600080fd5b806306fdde031461017c578063095ea7b31461019a575b600080fd5b610184610430565b60405161019191906113e4565b60405180910390f35b6101ad6101a8366004611479565b6104c2565b6040519015158152602001610191565b6002545b604051908152602001610191565b6101c17f8b73c3c69bb8fe3d512ecc4cf759cc79239f7b179b0ffacaa9a75d522b39400f81565b6101ad6102043660046114a3565b6104dc565b6101c17f6e71edae12b1b97f4d1f60370fef10105fa2faae0126114a169c64845d6126c981565b60405160ff7f0000000000000000000000000000000000000000000000000000000000000000168152602001610191565b6101c1610500565b6101ad610277366004611479565b61055c565b61028f61028a366004611479565b6105a8565b005b6101c161029f3660046114df565b73ffffffffffffffffffffffffffffffffffffffff1660009081526020819052604090205490565b6101c16102d53660046114df565b60056020526000908152604090205481565b610184610680565b61028f6102fd366004611479565b61068f565b6103297f000000000000000000000000000000000000000000000000000000000000000081565b60405173ffffffffffffffffffffffffffffffffffffffff9091168152602001610191565b6101ad61035c366004611479565b61075e565b6101ad61036f366004611479565b61082f565b6101c17f000000000000000000000000000000000000000000000000000000000000000081565b61028f6103a9366004611501565b61083d565b6101c16103bc366004611574565b73ffffffffffffffffffffffffffffffffffffffff918216600090815260016020908152604080832093909416825291909152205490565b6101846040518060400160405280600181526020017f310000000000000000000000000000000000000000000000000000000000000081525081565b60606003805461043f906115a7565b80601f016020809104026020016040519081016040528092919081815260200182805461046b906115a7565b80156104b85780601f1061048d576101008083540402835291602001916104b8565b820191906000526020600020905b81548152906001019060200180831161049b57829003601f168201915b5050505050905090565b6000336104d0818585610b73565b60019150505b92915050565b6000336104ea858285610d27565b6104f5858585610dfe565b506001949350505050565b60007f00000000000000000000000000000000000000000000000000000000000000004614610537576105324661106d565b905090565b507f000000000000000000000000000000000000000000000000000000000000000090565b33600081815260016020908152604080832073ffffffffffffffffffffffffffffffffffffffff871684529091528120549091906104d090829086906105a3908790611629565b610b73565b3373ffffffffffffffffffffffffffffffffffffffff7f00000000000000000000000000000000000000000000000000000000000000001614610672576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152603060248201527f546f6b656e577261707065643a3a6f6e6c794272696467653a204e6f7420506f60448201527f6c79676f6e5a6b45564d4272696467650000000000000000000000000000000060648201526084015b60405180910390fd5b61067c8282611135565b5050565b60606004805461043f906115a7565b3373ffffffffffffffffffffffffffffffffffffffff7f00000000000000000000000000000000000000000000000000000000000000001614610754576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152603060248201527f546f6b656e577261707065643a3a6f6e6c794272696467653a204e6f7420506f60448201527f6c79676f6e5a6b45564d427269646765000000000000000000000000000000006064820152608401610669565b61067c8282611228565b33600081815260016020908152604080832073ffffffffffffffffffffffffffffffffffffffff8716845290915281205490919083811015610822576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602560248201527f45524332303a2064656372656173656420616c6c6f77616e63652062656c6f7760448201527f207a65726f0000000000000000000000000000000000000000000000000000006064820152608401610669565b6104f58286868403610b73565b6000336104d0818585610dfe565b834211156108cc576040517f08c379a0000000000000000000000000000000000000000000000000000000008152602060048201526024808201527f546f6b656e577261707065643a3a7065726d69743a204578706972656420706560448201527f726d6974000000000000000000000000000000000000000000000000000000006064820152608401610669565b73ffffffffffffffffffffffffffffffffffffffff8716600090815260056020526040812080547f6e71edae12b1b97f4d1f60370fef10105fa2faae0126114a169c64845d6126c9918a918a918a9190866109268361163c565b9091555060408051602081019690965273ffffffffffffffffffffffffffffffffffffffff94851690860152929091166060840152608083015260a082015260c0810186905260e0016040516020818303038152906040528051906020012090506000610991610500565b6040517f19010000000000000000000000000000000000000000000000000000000000006020820152602281019190915260428101839052606201604080517fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe08184030181528282528051602091820120600080855291840180845281905260ff89169284019290925260608301879052608083018690529092509060019060a0016020604051602081039080840390855afa158015610a55573d6000803e3d6000fd5b50506040517fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0015191505073ffffffffffffffffffffffffffffffffffffffff811615801590610ad057508973ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff16145b610b5c576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602760248201527f546f6b656e577261707065643a3a7065726d69743a20496e76616c696420736960448201527f676e6174757265000000000000000000000000000000000000000000000000006064820152608401610669565b610b678a8a8a610b73565b50505050505050505050565b73ffffffffffffffffffffffffffffffffffffffff8316610c15576040517f08c379a0000000000000000000000000000000000000000000000000000000008152602060048201526024808201527f45524332303a20617070726f76652066726f6d20746865207a65726f2061646460448201527f72657373000000000000000000000000000000000000000000000000000000006064820152608401610669565b73ffffffffffffffffffffffffffffffffffffffff8216610cb8576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602260248201527f45524332303a20617070726f766520746f20746865207a65726f20616464726560448201527f73730000000000000000000000000000000000000000000000000000000000006064820152608401610669565b73ffffffffffffffffffffffffffffffffffffffff83811660008181526001602090815260408083209487168084529482529182902085905590518481527f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b92591015b60405180910390a3505050565b73ffffffffffffffffffffffffffffffffffffffff8381166000908152600160209081526040808320938616835292905220547fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff8114610df85781811015610deb576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601d60248201527f45524332303a20696e73756666696369656e7420616c6c6f77616e63650000006044820152606401610669565b610df88484848403610b73565b50505050565b73ffffffffffffffffffffffffffffffffffffffff8316610ea1576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602560248201527f45524332303a207472616e736665722066726f6d20746865207a65726f20616460448201527f64726573730000000000000000000000000000000000000000000000000000006064820152608401610669565b73ffffffffffffffffffffffffffffffffffffffff8216610f44576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602360248201527f45524332303a207472616e7366657220746f20746865207a65726f206164647260448201527f65737300000000000000000000000000000000000000000000000000000000006064820152608401610669565b73ffffffffffffffffffffffffffffffffffffffff831660009081526020819052604090205481811015610ffa576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602660248201527f45524332303a207472616e7366657220616d6f756e742065786365656473206260448201527f616c616e636500000000000000000000000000000000000000000000000000006064820152608401610669565b73ffffffffffffffffffffffffffffffffffffffff848116600081815260208181526040808320878703905593871680835291849020805487019055925185815290927fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef910160405180910390a3610df8565b60007f8b73c3c69bb8fe3d512ecc4cf759cc79239f7b179b0ffacaa9a75d522b39400f611098610430565b8051602091820120604080518082018252600181527f310000000000000000000000000000000000000000000000000000000000000090840152805192830193909352918101919091527fc89efdaa54c0f20c7adf612882df0950f5a951637e0307cdcb4c672f298b8bc66060820152608081018390523060a082015260c001604051602081830303815290604052805190602001209050919050565b73ffffffffffffffffffffffffffffffffffffffff82166111b2576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601f60248201527f45524332303a206d696e7420746f20746865207a65726f2061646472657373006044820152606401610669565b80600260008282546111c49190611629565b909155505073ffffffffffffffffffffffffffffffffffffffff8216600081815260208181526040808320805486019055518481527fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef910160405180910390a35050565b73ffffffffffffffffffffffffffffffffffffffff82166112cb576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602160248201527f45524332303a206275726e2066726f6d20746865207a65726f2061646472657360448201527f73000000000000000000000000000000000000000000000000000000000000006064820152608401610669565b73ffffffffffffffffffffffffffffffffffffffff821660009081526020819052604090205481811015611381576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602260248201527f45524332303a206275726e20616d6f756e7420657863656564732062616c616e60448201527f63650000000000000000000000000000000000000000000000000000000000006064820152608401610669565b73ffffffffffffffffffffffffffffffffffffffff83166000818152602081815260408083208686039055600280548790039055518581529192917fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef9101610d1a565b600060208083528351808285015260005b81811015611411578581018301518582016040015282016113f5565b5060006040828601015260407fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0601f8301168501019250505092915050565b803573ffffffffffffffffffffffffffffffffffffffff8116811461147457600080fd5b919050565b6000806040838503121561148c57600080fd5b61149583611450565b946020939093013593505050565b6000806000606084860312156114b857600080fd5b6114c184611450565b92506114cf60208501611450565b9150604084013590509250925092565b6000602082840312156114f157600080fd5b6114fa82611450565b9392505050565b600080600080600080600060e0888a03121561151c57600080fd5b61152588611450565b965061153360208901611450565b95506040880135945060608801359350608088013560ff8116811461155757600080fd5b9699959850939692959460a0840135945060c09093013592915050565b6000806040838503121561158757600080fd5b61159083611450565b915061159e60208401611450565b90509250929050565b600181811c908216806115bb57607f821691505b6020821081036115f4577f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b50919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b808201808211156104d6576104d66115fa565b60007fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff820361166d5761166d6115fa565b506001019056fea26469706673582212208d88fee561cff7120d381c345cfc534cef8229a272dc5809d4bbb685ad67141164736f6c63430008110033"
      values.gasTokenAddress:
+        "0x0000000000000000000000000000000000000000"
      values.gasTokenMetadata:
+        "0x"
      values.gasTokenNetwork:
+        0
      values.getRoot:
+        "0x281e6a3f11f523b6416b8e7e44c9fa4311a1984fa16f16e6789d2a96a9b8a89a"
      values.polygonRollupManager:
+        "0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2"
      values.WETHToken:
+        "0x0000000000000000000000000000000000000000"
      derivedName:
-        "PolygonZkEVMBridge"
+        "PolygonZkEVMBridgeV2"
    }
```

```diff
    contract PolygonRollupManager (0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2) {
      upgradeability.implementation:
-        "0xb1585916487AcEdD99952086f2950763D253b923"
+        "0x3b82Da772c825283d85d5d6717A77C6Ff582053b"
      implementations.0:
-        "0xb1585916487AcEdD99952086f2950763D253b923"
+        "0x3b82Da772c825283d85d5d6717A77C6Ff582053b"
      values.accessControl.DEFAULT_ADMIN_ROLE.members[0]:
+        "0xEf1462451C30Ea7aD8555386226059Fe837CA4EF"
      values.accessControl.TRUSTED_AGGREGATOR:
+        {"adminRole":"TRUSTED_AGGREGATOR_ADMIN","members":["0x6329Fe417621925C81c16F9F9a18c203C21Af7ab"]}
      values.accessControl.ADD_ROLLUP_TYPE:
+        {"adminRole":"DEFAULT_ADMIN_ROLE","members":["0xEf1462451C30Ea7aD8555386226059Fe837CA4EF"]}
      values.accessControl.ADD_EXISTING_ROLLUP:
+        {"adminRole":"DEFAULT_ADMIN_ROLE","members":["0xEf1462451C30Ea7aD8555386226059Fe837CA4EF"]}
      values.accessControl.UPDATE_ROLLUP:
+        {"adminRole":"DEFAULT_ADMIN_ROLE","members":["0xEf1462451C30Ea7aD8555386226059Fe837CA4EF"]}
      values.accessControl.OBSOLETE_ROLLUP_TYPE:
+        {"adminRole":"DEFAULT_ADMIN_ROLE","members":["0x242daE44F5d8fb54B198D03a94dA45B5a4413e21"]}
      values.accessControl.CREATE_ROLLUP:
+        {"adminRole":"DEFAULT_ADMIN_ROLE","members":["0x242daE44F5d8fb54B198D03a94dA45B5a4413e21"]}
      values.accessControl.STOP_EMERGENCY:
+        {"adminRole":"DEFAULT_ADMIN_ROLE","members":["0x242daE44F5d8fb54B198D03a94dA45B5a4413e21"]}
      values.accessControl.TWEAK_PARAMETERS:
+        {"adminRole":"DEFAULT_ADMIN_ROLE","members":["0x242daE44F5d8fb54B198D03a94dA45B5a4413e21"]}
      values.accessControl.TRUSTED_AGGREGATOR_ADMIN:
+        {"adminRole":"DEFAULT_ADMIN_ROLE","members":["0x242daE44F5d8fb54B198D03a94dA45B5a4413e21"]}
      values.accessControl.SET_FEE:
+        {"adminRole":"DEFAULT_ADMIN_ROLE","members":["0x242daE44F5d8fb54B198D03a94dA45B5a4413e21"]}
      values.accessControl.EMERGENCY_COUNCIL:
+        {"adminRole":"EMERGENCY_COUNCIL_ADMIN","members":["0x37c58Dfa7BF0A165C5AAEdDf3e2EdB475ac6Dcb6"]}
      values.accessControl.EMERGENCY_COUNCIL_ADMIN:
+        {"adminRole":"DEFAULT_ADMIN_ROLE","members":["0x37c58Dfa7BF0A165C5AAEdDf3e2EdB475ac6Dcb6"]}
      values.admin:
-        "0x242daE44F5d8fb54B198D03a94dA45B5a4413e21"
      values.chainID:
-        1101
      values.forceBatchTimeout:
-        432000
      values.forkID:
-        6
      values.isForcedBatchDisallowed:
-        true
      values.lastVerifiedBatchBeforeUpgrade:
-        1228916
      values.matic:
-        "0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0"
      values.networkName:
-        "polygon zkEVM"
      values.owner:
-        "0x37c58Dfa7BF0A165C5AAEdDf3e2EdB475ac6Dcb6"
      values.pendingAdmin:
-        "0x0000000000000000000000000000000000000000"
      values.rollupVerifier:
-        "0x5F411584E02964a028E3123C833c352Cd2F5cBD5"
      values.trustedAggregator:
-        "0x6329Fe417621925C81c16F9F9a18c203C21Af7ab"
      values.trustedSequencer:
-        "0x148Ee7dAF16574cD020aFa34CC658f8F3fbd2800"
      values.trustedSequencerURL:
-        "https://zkevm-rpc.com/"
      values.version:
-        2
      values.VERSION_BEFORE_UPGRADE:
-        1
      values.DEFAULT_ADMIN_ROLE:
+        "0x0000000000000000000000000000000000000000000000000000000000000000"
      values.getBatchFee:
+        "100000000000000000"
      values.getRollupExitRoot:
+        "0xdbf6a41b961855c5c76e0fa2264fb104706925d2b73f6f5261ded3ff6cb1798f"
      values.lastAggregationTimestamp:
+        1707920735
      values.lastDeactivatedEmergencyStateTimestamp:
+        0
      values.pol:
+        "0x455e53CBB86018Ac2B8092FdCd39d8444aFFC3F6"
      values.rollupCount:
+        1
      values.rollupTypeCount:
+        0
      values.totalSequencedBatches:
+        634
      values.totalVerifiedBatches:
+        626
      derivedName:
-        "PolygonZkEVMUpgraded"
+        "PolygonRollupManager"
    }
```

```diff
    contract GlobalExitRootV2 (0x580bda1e7A0CFAe92Fa7F6c20A3794F169CE3CFb) {
      upgradeability.implementation:
-        "0xbc1ea504fC54D078514eFCCA1F6860B5219B6BC3"
+        "0x2E38cD55163137483E30580Cb468C2dFf1d85077"
      implementations.0:
-        "0xbc1ea504fC54D078514eFCCA1F6860B5219B6BC3"
+        "0x2E38cD55163137483E30580Cb468C2dFf1d85077"
      values.rollupAddress:
-        "0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2"
      values.depositCount:
+        110
      values.getRoot:
+        "0x7fea3b9f69d928287af3d1cf3a0055d04de717fa31f977467bf2718c8798a40c"
      values.rollupManager:
+        "0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2"
      derivedName:
-        "PolygonZkEVMGlobalExitRoot"
+        "PolygonZkEVMGlobalExitRootV2"
    }
```

```diff
-   Status: DELETED
    contract FflonkVerifier (0x5F411584E02964a028E3123C833c352Cd2F5cBD5) {
    }
```

```diff
+   Status: CREATED
    contract Permit2 (0x000000000022D473030F116dDEE9F6B43aC78BA3) {
    }
```

```diff
+   Status: CREATED
    contract FflonkVerifier (0x1C3A3da552b8662CD69538356b1E7c2E9CC1EBD8) {
    }
```

```diff
+   Status: CREATED
    contract PolygonEcosystemToken (0x455e53CBB86018Ac2B8092FdCd39d8444aFFC3F6) {
    }
```

```diff
+   Status: CREATED
    contract PolygonZkEVMExistentEtrog (0x519E42c24163192Dca44CD3fBDCEBF6be9130987) {
    }
```

## Source code changes

```diff
.../contracts/PolygonZkEVMBridge.sol => /dev/null  |  857 ---------
 .../interfaces/IBasePolygonZkEVMGlobalExitRoot.sol |    2 +-
 .../interfaces/IBridgeMessageReceiver.sol          |    2 +-
 .../contracts/lib/EmergencyManager.sol             |    2 +-
 .../contracts/lib/GlobalExitRootLib.sol            |    2 +-
 .../implementation/contracts/lib/TokenWrapped.sol  |    2 +-
 .../contracts/v2/PolygonZkEVMBridgeV2.sol          | 1160 ++++++++++++
 .../v2/interfaces/IPolygonZkEVMBridgeV2.sol        |  166 ++
 .../contracts/v2/lib/DepositContractBase.sol}      |   65 +-
 .../contracts/v2/lib/DepositContractV2.sol         |   44 +
 .../Bridge/implementation/meta.txt                 |    4 +-
 .../FflonkVerifier/FflonkVerifier.sol              |    4 +-
 .../FflonkVerifier/meta.txt                        |    2 +-
 .../PolygonZkEVMGlobalExitRoot.sol => /dev/null    |   88 -
 .../interfaces/IBasePolygonZkEVMGlobalExitRoot.sol |    2 +-
 .../IPolygonZkEVMGlobalExitRoot.sol => /dev/null   |    8 -
 .../implementation/lib/GlobalExitRootLib.sol       |    2 +-
 .../GlobalExitRootV2/implementation/meta.txt       |    4 +-
 .../v2/PolygonZkEVMGlobalExitRootV2.sol            |  126 ++
 .../interfaces/IPolygonZkEVMGlobalExitRootV2.sol   |   10 +
 .../implementation/v2/lib/DepositContractBase.sol  |  131 ++
 .../lib/PolygonZkEVMGlobalExitRootBaseStorage.sol  |   22 +
 .../.code/Permit2/lib/solmate/src/tokens/ERC20.sol |  206 +++
 .../lib/solmate/src/utils/SafeTransferLib.sol      |  128 ++
 .../polygonzkevm/ethereum/.code/Permit2/meta.txt   |    2 +
 .../.code/Permit2/src/AllowanceTransfer.sol        |  143 ++
 .../ethereum/.code/Permit2/src/EIP712.sol          |   39 +
 .../ethereum/.code/Permit2/src/Permit2.sol         |   11 +
 .../ethereum/.code/Permit2/src/PermitErrors.sol    |   11 +
 .../.code/Permit2/src/SignatureTransfer.sol        |  159 ++
 .../Permit2/src/interfaces/IAllowanceTransfer.sol  |  160 ++
 .../.code/Permit2/src/interfaces/IERC1271.sol      |   10 +
 .../Permit2/src/interfaces/ISignatureTransfer.sol  |  132 ++
 .../.code/Permit2/src/libraries/Allowance.sol      |   48 +
 .../.code/Permit2/src/libraries/PermitHash.sol     |  134 ++
 .../src/libraries/SignatureVerification.sol        |   47 +
 .../contracts/access/AccessControl.sol             |  248 +++
 .../contracts/access/AccessControlEnumerable.sol   |   64 +
 .../contracts/access/IAccessControl.sol            |   88 +
 .../contracts/access/IAccessControlEnumerable.sol  |   31 +
 .../contracts/interfaces/IERC5267.sol              |   28 +
 .../contracts/token/ERC20/ERC20.sol                |  365 ++++
 .../contracts/token/ERC20/IERC20.sol               |   78 +
 .../token/ERC20/extensions/ERC20Permit.sol         |   95 +
 .../token/ERC20/extensions/IERC20Metadata.sol      |   28 +
 .../token/ERC20/extensions/IERC20Permit.sol        |   60 +
 .../contracts/utils/Context.sol                    |   24 +
 .../contracts/utils/Counters.sol                   |   43 +
 .../contracts/utils/ShortStrings.sol               |  122 ++
 .../contracts/utils/StorageSlot.sol                |  138 ++
 .../contracts/utils/Strings.sol                    |   85 +
 .../contracts/utils/cryptography/ECDSA.sol         |  217 +++
 .../contracts/utils/cryptography/EIP712.sol        |  142 ++
 .../contracts/utils/introspection/ERC165.sol       |   29 +
 .../contracts/utils/introspection/IERC165.sol      |   25 +
 .../contracts/utils/math/Math.sol                  |  339 ++++
 .../contracts/utils/math/SignedMath.sol            |   43 +
 .../contracts/utils/structs/EnumerableSet.sol      |  378 ++++
 .../ethereum/.code/PolygonEcosystemToken/meta.txt  |    2 +
 .../src/PolygonEcosystemToken.sol                  |   81 +
 .../src/interfaces/IPolygonEcosystemToken.sol      |   71 +
 .../access/IAccessControlUpgradeable.sol           |   88 +
 .../ERC20/extensions/IERC20MetadataUpgradeable.sol |   28 +
 .../utils/StringsUpgradeable.sol                   |   70 +
 .../utils/introspection/ERC165Upgradeable.sol      |   42 +
 .../utils/introspection/IERC165Upgradeable.sol     |   25 +
 .../utils/math/MathUpgradeable.sol                 |  345 ++++
 .../@openzeppelin/contracts5/access/Ownable.sol}   |   55 +-
 .../contracts5/interfaces/IERC1967.sol             |   24 +
 .../contracts5/proxy/ERC1967/ERC1967Proxy.sol      |   40 +
 .../contracts5/proxy/ERC1967/ERC1967Utils.sol      |  193 ++
 .../@openzeppelin/contracts5/proxy/Proxy.sol       |   69 +
 .../contracts5/proxy/beacon/IBeacon.sol            |   16 +
 .../contracts5/proxy/transparent/ProxyAdmin.sol    |   45 +
 .../transparent/TransparentUpgradeableProxy.sol    |  116 ++
 .../@openzeppelin/contracts5/utils/Address.sol     |  159 ++
 .../@openzeppelin/contracts5/utils/Context.sol     |   24 +
 .../@openzeppelin/contracts5/utils/StorageSlot.sol |  135 ++
 .../contracts/PolygonZkEVM.sol => /dev/null        | 1692 -----------------
 .../IPolygonZkEVMGlobalExitRoot.sol => /dev/null   |    8 -
 .../contracts/interfaces/IVerifierRollup.sol       |    2 +-
 .../PolygonZkEVMUpgraded.sol => /dev/null          |  136 --
 .../contracts/v2/PolygonRollupManager.sol          | 1911 ++++++++++++++++++++
 .../consensus/zkEVM/PolygonZkEVMExistentEtrog.sol  |  134 ++
 .../contracts/v2/interfaces/IPolygonRollupBase.sol |   20 +
 .../v2/interfaces/IPolygonRollupManager.sol        |  170 ++
 .../v2/interfaces/IPolygonZkEVMBridgeV2.sol        |  166 ++
 .../interfaces/IPolygonZkEVMGlobalExitRootV2.sol   |   10 +
 .../v2/interfaces/IPolygonZkEVMVEtrogErrors.sol    |   46 +
 .../contracts/v2/lib/LegacyZKEVMStateVariables.sol |  153 ++
 .../v2/lib/PolygonAccessControlUpgradeable.sol     |  245 +++
 .../contracts/v2/lib/PolygonConstantsBase.sol      |   14 +
 .../contracts/v2/lib/PolygonRollupBaseEtrog.sol    |  923 ++++++++++
 .../contracts/v2/lib/PolygonTransparentProxy.sol   |   79 +
 .../PolygonRollupManager/implementation/meta.txt   |    4 +-
 .../access/IAccessControlUpgradeable.sol           |   88 +
 .../proxy/utils/Initializable.sol                  |  165 ++
 .../token/ERC20/IERC20Upgradeable.sol              |   82 +
 .../ERC20/extensions/IERC20MetadataUpgradeable.sol |   28 +
 .../extensions/draft-IERC20PermitUpgradeable.sol   |   60 +
 .../token/ERC20/utils/SafeERC20Upgradeable.sol     |  116 ++
 .../utils/AddressUpgradeable.sol                   |  219 +++
 .../utils/ContextUpgradeable.sol                   |   37 +
 .../utils/StringsUpgradeable.sol                   |   70 +
 .../utils/introspection/ERC165Upgradeable.sol      |   42 +
 .../utils/introspection/IERC165Upgradeable.sol     |   25 +
 .../utils/math/MathUpgradeable.sol                 |  345 ++++
 .../@openzeppelin/contracts5/access/Ownable.sol    |  100 +
 .../contracts5/interfaces/IERC1967.sol             |   24 +
 .../contracts5/proxy/ERC1967/ERC1967Proxy.sol      |   40 +
 .../contracts5/proxy/ERC1967/ERC1967Utils.sol      |  193 ++
 .../@openzeppelin/contracts5/proxy/Proxy.sol       |   69 +
 .../contracts5/proxy/beacon/IBeacon.sol            |   16 +
 .../contracts5/proxy/transparent/ProxyAdmin.sol    |   45 +
 .../transparent/TransparentUpgradeableProxy.sol    |  116 ++
 .../@openzeppelin/contracts5/utils/Address.sol     |  159 ++
 .../@openzeppelin/contracts5/utils/Context.sol     |   24 +
 .../@openzeppelin/contracts5/utils/StorageSlot.sol |  135 ++
 .../interfaces/IBasePolygonZkEVMGlobalExitRoot.sol |   16 +
 .../contracts/interfaces/IPolygonZkEVMBridge.sol   |    2 +-
 .../contracts/interfaces/IPolygonZkEVMErrors.sol   |  211 +++
 .../contracts/interfaces/IVerifierRollup.sol       |   13 +
 .../contracts/lib/EmergencyManager.sol             |   73 +
 .../contracts/v2/PolygonRollupManager.sol          | 1911 ++++++++++++++++++++
 .../consensus/zkEVM/PolygonZkEVMExistentEtrog.sol  |  134 ++
 .../contracts/v2/interfaces/IPolygonRollupBase.sol |   20 +
 .../v2/interfaces/IPolygonRollupManager.sol        |  170 ++
 .../v2/interfaces/IPolygonZkEVMBridgeV2.sol        |  166 ++
 .../interfaces/IPolygonZkEVMGlobalExitRootV2.sol   |   10 +
 .../v2/interfaces/IPolygonZkEVMVEtrogErrors.sol    |   46 +
 .../contracts/v2/lib/LegacyZKEVMStateVariables.sol |  153 ++
 .../v2/lib/PolygonAccessControlUpgradeable.sol     |  245 +++
 .../contracts/v2/lib/PolygonConstantsBase.sol      |   14 +
 .../contracts/v2/lib/PolygonRollupBaseEtrog.sol    |  923 ++++++++++
 .../contracts/v2/lib/PolygonTransparentProxy.sol   |   79 +
 .../implementation/meta.txt                        |    2 +
 .../@openzeppelin/contracts5/access/Ownable.sol    |  100 +
 .../contracts5/interfaces/IERC1967.sol             |   24 +
 .../contracts5/proxy/ERC1967/ERC1967Proxy.sol      |   40 +
 .../contracts5/proxy/ERC1967/ERC1967Utils.sol      |  193 ++
 .../proxy/@openzeppelin/contracts5/proxy/Proxy.sol |   69 +
 .../contracts5/proxy/beacon/IBeacon.sol            |   16 +
 .../contracts5/proxy/transparent/ProxyAdmin.sol    |   45 +
 .../transparent/TransparentUpgradeableProxy.sol    |  116 ++
 .../@openzeppelin/contracts5/utils/Address.sol     |  159 ++
 .../@openzeppelin/contracts5/utils/Context.sol     |   24 +
 .../@openzeppelin/contracts5/utils/StorageSlot.sol |  135 ++
 .../contracts/v2/lib/PolygonTransparentProxy.sol   |   79 +
 .../.code/PolygonZkEVMExistentEtrog/proxy/meta.txt |    2 +
 149 files changed, 18459 insertions(+), 2875 deletions(-)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19018668 (main branch discovery), not current.

```diff
    contract PolygonZkEvm (0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2) {
      name:
-        "PolygonZkEvm"
+        "PolygonRollupManager"
      values.accessControl:
+        {"DEFAULT_ADMIN_ROLE":{"adminRole":"DEFAULT_ADMIN_ROLE","members":[]}}
    }
```

```diff
    contract GlobalExitRoot (0x580bda1e7A0CFAe92Fa7F6c20A3794F169CE3CFb) {
      name:
-        "GlobalExitRoot"
+        "GlobalExitRootV2"
    }
```

Generated with discovered.json: 0x8241e5999c5993c8094f03fe673e1a35f2b5b13f

# Diff at Thu, 11 Jan 2024 15:48:40 GMT:

- author: Radina Talanova (<nt.radina@gmail.com>)
- comparing to: main@d79128df189c297a74fb89b3a58b7e0d6edd88f4 block: 18968776
- current block number: 18984674

## Description

The EscrowsAdmin multisig threshold is updated - now 5/10. Nonce is ignored.

## Watched changes

```diff
    contract EscrowsAdmin (0xf694C9e3a34f5Fa48b6f3a0Ff186C1c6c4FcE904) {
      values.getThreshold:
-        1
+        5
    }
```

## Config related changes

Following changes come from updates made to the config file,
not from differences found during discovery. Values are
for block 18968776 (main branch discovery), not current.

```diff
    contract EscrowsAdmin (0xf694C9e3a34f5Fa48b6f3a0Ff186C1c6c4FcE904) {
      values.nonce:
-        0
    }
```

# Diff at Fri, 10 Nov 2023 10:41:51 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@8c81bbc286f1a0d260de84887d123cd5eda48a86

## Description

PolygonZkEVM has changed it's implementation because PolygonZkEVMUpgraded - the
contract at the implementation address - needed to be redeployed. This is
because PolygonZkEVMUpgraded has FflonkVerifier hardcoded and because it was
also redeployed to change two circuit parameters (C_0x and C0y) to update to the
new address the whole contract needed to be redeployed. We can't peer into the
actual change that took place because it's around the zk circuit.

## Watched changes

```diff
-   Status: DELETED
    contract FflonkVerifier (0x21f65deadb3b85082BA99766f323bEA90eb5a3D6) {
    }
```

```diff
    contract PolygonZkEvm (0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2) {
      upgradeability.implementation:
-        "0x301442aA888701c8B86727d42F3C55Fb0dd9eF7F"
+        "0xb1585916487AcEdD99952086f2950763D253b923"
      implementations.0:
-        "0x301442aA888701c8B86727d42F3C55Fb0dd9eF7F"
+        "0xb1585916487AcEdD99952086f2950763D253b923"
      values.forkID:
-        5
+        6
      values.lastVerifiedBatchBeforeUpgrade:
-        813266
+        1228916
      values.rollupVerifier:
-        "0x21f65deadb3b85082BA99766f323bEA90eb5a3D6"
+        "0x5F411584E02964a028E3123C833c352Cd2F5cBD5"
      values.version:
-        1
+        2
      values.VERSION_BEFORE_UPGRADE:
-        0
+        1
    }
```

```diff
+   Status: CREATED
    contract FflonkVerifier (0x5F411584E02964a028E3123C833c352Cd2F5cBD5) {
    }
```

## Source code changes

```diff
.../{.code@18263277 => .code}/FflonkVerifier/FflonkVerifier.sol       | 4 ++--
 .../ethereum/{.code@18263277 => .code}/FflonkVerifier/meta.txt        | 2 +-
 .../{.code@18263277 => .code}/PolygonZkEvm/implementation/meta.txt    | 2 +-
 3 files changed, 4 insertions(+), 4 deletions(-)
```

# Diff at Mon, 02 Oct 2023 13:55:19 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@10dbc30af490bd7af5cfca51b827ce3f10182f4d

## Watched changes

```diff
    contract PolygonZkEvm (0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2) {
      values.trustedAggregator:
-        "0xdA87c4a76922598Ac0272F4D9503a35071D686eA"
+        "0x6329Fe417621925C81c16F9F9a18c203C21Af7ab"
    }
```

# Diff at Tue, 26 Sep 2023 13:22:27 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@cfd4e281f2af40c7c69302b16c1308c0c5651be0

## Watched changes

```diff
    contract FflonkVerifier (0x21f65deadb3b85082BA99766f323bEA90eb5a3D6) {
      sinceTimestamp:
+        1693469075
    }
```

```diff
    contract PolygonZkEvm (0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2) {
      values.nondeterminsiticPendingState:
+        []
    }
```

# Diff at Fri, 22 Sep 2023 11:25:03 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@1312187d41931ca505cc65eca063068109ff1771

## Watched changes

```diff
-   Status: DELETED
    contract FflonkVerifier (0x4F9A0e7FD2Bf6067db6994CF12E4495Df938E6e9) {
    }
```

```diff
    contract PolygonZkEvm (0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2) {
      upgradeability.implementation:
-        "0xe262Ea2782e2e8dbFe354048c3B5d6DE9603EfEF"
+        "0x301442aA888701c8B86727d42F3C55Fb0dd9eF7F"
      values.forkID:
-        4
+        5
      values.rollupVerifier:
-        "0x4F9A0e7FD2Bf6067db6994CF12E4495Df938E6e9"
+        "0x21f65deadb3b85082BA99766f323bEA90eb5a3D6"
      values.lastVerifiedBatchBeforeUpgrade:
+        813266
      values.version:
+        1
      values.VERSION_BEFORE_UPGRADE:
+        0
      derivedName:
-        "PolygonZkEVM"
+        "PolygonZkEVMUpgraded"
    }
```

```diff
+   Status: CREATED
    contract FflonkVerifier (0x21f65deadb3b85082BA99766f323bEA90eb5a3D6) {
    }
```
