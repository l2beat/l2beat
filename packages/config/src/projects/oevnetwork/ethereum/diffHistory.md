Generated with discovered.json: 0xc5c1d499ceca1fc6f43db8d9b58a07788e6d5bac

# Diff at Fri, 02 May 2025 17:24:03 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@c598e33a0c469175b7abbd6c2a13b47b63d6b6a4 block: 22231616
- current block number: 22231616

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22231616 (main branch discovery), not current.

```diff
    contract RollupProxy (0x3AAfe635FCfA0E5C19C9368ab5eb384277836006) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      usedTypes.0.arg.0xaf1dbdfceb871c00bfbb1675983133df04f0ed04e89647812513c091e3a982b3:
+        "Celestia Nitro 3.3.2 wasmModuleRoot"
    }
```

Generated with discovered.json: 0x6b384403bf668cbbcdfcade6ecaecd56def1dabc

# Diff at Tue, 29 Apr 2025 08:19:07 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@ef7477af00fe0b57a2f7cacf7e958c12494af662 block: 22231616
- current block number: 22231616

## Description

Field .issuedPermissions is removed from the output as no longer needed. Added 'permissionsConfigHash' due to refactoring of the modelling process (into a separate command).

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22231616 (main branch discovery), not current.

```diff
    contract Bridge (0x2403Dd9dFa12255Be8f42bc1e644733c9b2d10Dd) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x2bf43034b9559643e986A2fE3cE015a18247b904","via":[{"address":"0x566e4dA579fd344DF9fbC2Cbf4014faD41DCA0eA"},{"address":"0xb6fbC59CF12d77C35d58B82Deee76cfc934F1235"}]}]
    }
```

```diff
    contract RollupEventInbox (0x3401eafd7Ceb84265B2cC4252155e12B446E7c57) {
    +++ description: Helper contract sending configuration data over the bridge during the systems initialization.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x2bf43034b9559643e986A2fE3cE015a18247b904","via":[{"address":"0x566e4dA579fd344DF9fbC2Cbf4014faD41DCA0eA"},{"address":"0xb6fbC59CF12d77C35d58B82Deee76cfc934F1235"}]}]
    }
```

```diff
    contract RollupProxy (0x3AAfe635FCfA0E5C19C9368ab5eb384277836006) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      issuedPermissions:
-        [{"permission":"interact","to":"0x2bf43034b9559643e986A2fE3cE015a18247b904","description":"Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes.","via":[{"address":"0x566e4dA579fd344DF9fbC2Cbf4014faD41DCA0eA"}]},{"permission":"upgrade","to":"0x2bf43034b9559643e986A2fE3cE015a18247b904","via":[{"address":"0x566e4dA579fd344DF9fbC2Cbf4014faD41DCA0eA"}]},{"permission":"validate","to":"0xd4D2F3cB313e59A34089F6635c5c1c6145298640","description":"Can propose new state roots (called nodes) and challenge state roots on the host chain.","via":[]}]
    }
```

```diff
    contract UpgradeExecutor (0x566e4dA579fd344DF9fbC2Cbf4014faD41DCA0eA) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x2bf43034b9559643e986A2fE3cE015a18247b904","via":[{"address":"0x566e4dA579fd344DF9fbC2Cbf4014faD41DCA0eA"},{"address":"0xb6fbC59CF12d77C35d58B82Deee76cfc934F1235"}]}]
    }
```

```diff
    contract ChallengeManager (0x59F75d2730a6a505c3C12b797cE2e7Bdb0C11757) {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x2bf43034b9559643e986A2fE3cE015a18247b904","via":[{"address":"0x566e4dA579fd344DF9fbC2Cbf4014faD41DCA0eA"},{"address":"0xb6fbC59CF12d77C35d58B82Deee76cfc934F1235"}]}]
    }
```

```diff
    contract Inbox (0x7EF9d2fe20307165599101e93Ea05b04d46Af159) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x2bf43034b9559643e986A2fE3cE015a18247b904","via":[{"address":"0x566e4dA579fd344DF9fbC2Cbf4014faD41DCA0eA"},{"address":"0xb6fbC59CF12d77C35d58B82Deee76cfc934F1235"}]}]
    }
```

```diff
    contract SequencerInbox (0xD5dD6114a5DC6d1352C0EE47Cbed6a1807F079c7) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      issuedPermissions:
-        [{"permission":"sequence","to":"0x23b6bFACe63BFa288783b8344574c75b78FaEd59","description":"Can submit transaction batches or commitments to the SequencerInbox contract on the host chain.","via":[]},{"permission":"upgrade","to":"0x2bf43034b9559643e986A2fE3cE015a18247b904","via":[{"address":"0x566e4dA579fd344DF9fbC2Cbf4014faD41DCA0eA"},{"address":"0xb6fbC59CF12d77C35d58B82Deee76cfc934F1235"}]}]
    }
```

```diff
    contract Outbox (0xe4F99a0734C87C298d73C161F54874225E416997) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x2bf43034b9559643e986A2fE3cE015a18247b904","via":[{"address":"0x566e4dA579fd344DF9fbC2Cbf4014faD41DCA0eA"},{"address":"0xb6fbC59CF12d77C35d58B82Deee76cfc934F1235"}]}]
    }
```

Generated with discovered.json: 0xcc2537f7daba62f767d964e418c3a0c88fcf69ab

# Diff at Wed, 09 Apr 2025 13:22:30 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@45b707d5b88f76d72dd5f8252dbef76321c2f829 block: 21917027
- current block number: 22231616

## Description

Upgrade to ArbOS v32.

## Watched changes

```diff
-   Status: DELETED
    contract OneStepProverHostIo (0x17e7F68ce50A77e55C7834ddF31AEf86403B8010)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
    contract Caldera Multisig 3 (0x2bf43034b9559643e986A2fE3cE015a18247b904) {
    +++ description: None
      receivedPermissions.0.description:
-        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
+        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
    }
```

```diff
    contract RollupProxy (0x3AAfe635FCfA0E5C19C9368ab5eb384277836006) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      template:
-        "orbitstack/RollupProxy"
+        "orbitstack/RollupProxy_fastConfirm"
      sourceHashes.1:
-        "0xef94a66bd5339efd18fb9ca1f8031482e7ef7bbe6c5a0a10fae254ab83712406"
+        "0x9349e73cbc2d2b818c1d79711574ba210b56249d8d3845bc78c776caf8f8ff42"
      sourceHashes.0:
-        "0x8b48118fe606012c0dcac2ccc1821785935aec89fab8f219f47b32c482b0017e"
+        "0x7ee21b18b2e18c636bfafc08ff72692cc43302b2599ba75f0abad67282866dd5"
      issuedPermissions.0.description:
-        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
+        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
      values.$implementation.1:
-        "0x0aE4dD666748bF0F6dB5c149Eab1D8aD27820A6A"
+        "0x4fd44C320f28e9cdB7CF0f5490434494Fbd4c7B4"
      values.$implementation.0:
-        "0x660ea1675F7323dC3Ba0c8dDFB593225Eb01E3C1"
+        "0x107CbCe233467652E8a69E8555E58DA7AeF0bFa5"
      values.$pastUpgrades.1:
+        ["2024-05-16T04:46:47.000Z","0xfbd9b814ebadbe634d86f5d37bf0a54e6c7fcae5a7e2824e99dcf4d7caea1b10",["0x0aE4dD666748bF0F6dB5c149Eab1D8aD27820A6A","0x660ea1675F7323dC3Ba0c8dDFB593225Eb01E3C1"]]
      values.$pastUpgrades.0.2:
-        "2024-05-16T04:46:47.000Z"
+        "2025-04-07T19:36:59.000Z"
      values.$pastUpgrades.0.1:
-        "0xfbd9b814ebadbe634d86f5d37bf0a54e6c7fcae5a7e2824e99dcf4d7caea1b10"
+        "0xc2be8923b1e282245bf9396df6ce3d92ae3a1ff495d21847090c31165ef57c1c"
      values.$pastUpgrades.0.0.1:
-        "0x0aE4dD666748bF0F6dB5c149Eab1D8aD27820A6A"
+        "0x4fd44C320f28e9cdB7CF0f5490434494Fbd4c7B4"
      values.$pastUpgrades.0.0.0:
-        "0x660ea1675F7323dC3Ba0c8dDFB593225Eb01E3C1"
+        "0x107CbCe233467652E8a69E8555E58DA7AeF0bFa5"
      values.$upgradeCount:
-        1
+        2
+++ description: ArbOS version derived from known wasmModuleRoots.
      values.arbOsFromWmRoot:
-        "ArbOS v20 wasmModuleRoot"
+        "ArbOS v32 wasmModuleRoot"
+++ description: Root hash of the WASM module used for execution, like a fingerprint of the L2 logic. Can be associated with ArbOS versions.
      values.wasmModuleRoot:
-        "0x8b104a2e80ac6165dc58b9048de12f301d70b02a0ab51396c22b4b4b802a16a4"
+        "0x184884e1eb9fefdc158f6c8ac912bb183bf3cf83f0090317e0bc4ac5860baa39"
      values.anyTrustFastConfirmer:
+        "0x0000000000000000000000000000000000000000"
    }
```

```diff
    contract UpgradeExecutor (0x566e4dA579fd344DF9fbC2Cbf4014faD41DCA0eA) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      directlyReceivedPermissions.1.description:
-        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
+        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
    }
```

```diff
-   Status: DELETED
    contract OneStepProofEntry (0x57EA090Ac0554d174AE0e2855B460e84A1A7C221)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
    contract ChallengeManager (0x59F75d2730a6a505c3C12b797cE2e7Bdb0C11757) {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      sourceHashes.0:
-        "0x58a6261c83c2766f749641902ad6fdb695ea189d2747f073b57a8f35b9a547e5"
+        "0x1a095768302d7d1c3d02375eaa3341833b4f1aaac707e1c608bce478c87cbf27"
      values.$implementation:
-        "0x1D901DD7A5eFE421C3C437B147040E5AF22E6A43"
+        "0x745fdabB168b7bdEe3801a37093C3A3c3230c50b"
      values.$pastUpgrades.1:
+        ["2024-05-16T04:46:47.000Z","0xfbd9b814ebadbe634d86f5d37bf0a54e6c7fcae5a7e2824e99dcf4d7caea1b10",["0x1D901DD7A5eFE421C3C437B147040E5AF22E6A43"]]
      values.$pastUpgrades.0.2:
-        "2024-05-16T04:46:47.000Z"
+        "2025-04-07T19:36:59.000Z"
      values.$pastUpgrades.0.1:
-        "0xfbd9b814ebadbe634d86f5d37bf0a54e6c7fcae5a7e2824e99dcf4d7caea1b10"
+        "0xc2be8923b1e282245bf9396df6ce3d92ae3a1ff495d21847090c31165ef57c1c"
      values.$pastUpgrades.0.0.0:
-        "0x1D901DD7A5eFE421C3C437B147040E5AF22E6A43"
+        "0x745fdabB168b7bdEe3801a37093C3A3c3230c50b"
      values.$upgradeCount:
-        1
+        2
      values.osp:
-        "0x57EA090Ac0554d174AE0e2855B460e84A1A7C221"
+        "0xd8D0422128f4dEf4D057507f30Fc3e7Bd1A6c349"
    }
```

```diff
-   Status: DELETED
    contract OneStepProver0 (0x72B166070781a552D7b95a907eF59ca05d3D5a62)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
    contract Inbox (0x7EF9d2fe20307165599101e93Ea05b04d46Af159) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      sourceHashes.1:
-        "0x99872d99b7163c705118e0a168f99728c3c7089581779077707271cdaad30be3"
+        "0xa7e3f6c355703ed46fcb2156862c4f01792b87beb10a87a81ce3bd5beee79b67"
      sourceHashes.0:
-        "0xa7e3f6c355703ed46fcb2156862c4f01792b87beb10a87a81ce3bd5beee79b67"
+        "0x84cd273689e720a0b7c657b57d9fb127684f3abb87fc4b337a2f0decd9464120"
      values.$implementation:
-        "0x1162084C3C6575121146582Db5BE43189e8CEe6b"
+        "0x580b0Bf8bf47C338105166857cd9921EbF928B12"
      values.$pastUpgrades.1:
+        ["2024-05-16T04:46:47.000Z","0xfbd9b814ebadbe634d86f5d37bf0a54e6c7fcae5a7e2824e99dcf4d7caea1b10",["0x1162084C3C6575121146582Db5BE43189e8CEe6b"]]
      values.$pastUpgrades.0.2:
-        "2024-05-16T04:46:47.000Z"
+        "0x5703e61666c0026973520711926fa609a6a3f6223a2f38340ba241cb527649d5"
      values.$pastUpgrades.0.1:
-        "0xfbd9b814ebadbe634d86f5d37bf0a54e6c7fcae5a7e2824e99dcf4d7caea1b10"
+        "2025-04-07T20:17:35.000Z"
      values.$pastUpgrades.0.0.0:
-        "0x1162084C3C6575121146582Db5BE43189e8CEe6b"
+        "0x580b0Bf8bf47C338105166857cd9921EbF928B12"
      values.$upgradeCount:
-        1
+        2
    }
```

```diff
-   Status: DELETED
    contract OneStepProverMemory (0x8b73Ef238ADaB31EBC7c05423d243c345241a22f)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
-   Status: DELETED
    contract OneStepProverMath (0x90eC62De2EB7C7512a22bD2D55926AD6bA609F38)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
    contract SequencerInbox (0xD5dD6114a5DC6d1352C0EE47Cbed6a1807F079c7) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      sourceHashes.0:
-        "0x50cf57b01499408fa99da27cf0fee96ec30f0d40667d1aa090c442bc80f0636b"
+        "0x6bb86ac4bd0d31e049f543fcf0a8f94c952252222f115246ef9d5b8104d803cc"
      values.$implementation:
-        "0x958985cf2c54f99ba4a599221A8090C1F9Cee9A5"
+        "0x6B292d1d4D38653b4F1D6De41c6be198371C5af1"
      values.$pastUpgrades.1:
+        ["2025-04-07T20:17:35.000Z","0x5703e61666c0026973520711926fa609a6a3f6223a2f38340ba241cb527649d5",["0x6B292d1d4D38653b4F1D6De41c6be198371C5af1"]]
      values.$upgradeCount:
-        1
+        2
      values.reader4844:
-        "0x7Deda2425eC2d4EA0DF689A78de2fBF002075576"
+        "0x1fc9dBd52D420a5C4c6A2de4B1D1B380D1De4D53"
    }
```

```diff
+   Status: CREATED
    contract OneStepProverMath (0x171c845f3229D6625bcdBcfB39BF53Fe15D2E4de)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract OneStepProverHostIo (0x1E0fAE2d6Ca225903B81b742813E98CDBaD20037)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract OneStepProverMemory (0x8C07c8F36764962C43eb9A6D50426C652185c51D)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract OneStepProver0 (0xa27dAF09D3a1d36e40316e38078FAF8bbBf3a12f)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract OneStepProofEntry (0xd8D0422128f4dEf4D057507f30Fc3e7Bd1A6c349)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

## Source code changes

```diff
.../ChallengeManager/ChallengeManager.sol          | 404 ++++++----
 .../{.flat@21917027 => .flat}/Inbox/Inbox.sol      |  52 +-
 .../OneStepProofEntry.sol                          | 485 +++++++++--
 .../{.flat@21917027 => .flat}/OneStepProver0.sol   | 765 +++++++++++++-----
 .../OneStepProverHostIo.sol                        | 892 +++++++++++++++++----
 .../OneStepProverMath.sol                          |  65 +-
 .../OneStepProverMemory.sol                        | 315 ++++++--
 .../RollupProxy/RollupAdminLogic.1.sol             | 370 ++++++---
 .../RollupProxy/RollupUserLogic.2.sol              | 415 ++++++----
 .../SequencerInbox/SequencerInbox.sol              |  24 +-
 10 files changed, 2825 insertions(+), 962 deletions(-)
```

Generated with discovered.json: 0xf24dd5d8251128aad867298ba98a2f704c342a41

# Diff at Thu, 06 Mar 2025 09:39:04 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@7119c715545bc86a4194761f42815f811ac6307a block: 21917027
- current block number: 21917027

## Description

Config related: set severity for arbitrum inbox/outbox changes to high and add historical In- and Outboxes via events.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21917027 (main branch discovery), not current.

```diff
    contract Bridge (0x2403Dd9dFa12255Be8f42bc1e644733c9b2d10Dd) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
+++ description: All Inboxes that were ever set as allowed in the bridge.
+++ severity: HIGH
      values.inboxHistory:
+        ["0x7EF9d2fe20307165599101e93Ea05b04d46Af159","0x3401eafd7Ceb84265B2cC4252155e12B446E7c57"]
+++ description: All Outboxes that were ever set as allowed in the bridge.
+++ severity: HIGH
      values.outboxHistory:
+        ["0xe4F99a0734C87C298d73C161F54874225E416997"]
      fieldMeta:
+        {"allowedOutboxList":{"severity":"HIGH","description":"Can make calls as the bridge, steal all funds."},"outboxHistory":{"severity":"HIGH","description":"All Outboxes that were ever set as allowed in the bridge."},"allowedDelayedInboxList":{"severity":"HIGH","description":"Allowed to mint the gastoken on L2 and call `enqueueDelayedMessage()` on the bridge."},"inboxHistory":{"severity":"HIGH","description":"All Inboxes that were ever set as allowed in the bridge."}}
    }
```

Generated with discovered.json: 0xc3644c1c0984a75fbd51f039fe5de497ad0f6e7c

# Diff at Tue, 04 Mar 2025 10:39:29 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@98d260b45fe0d2195ce5e629bd7b200c8706e8ba block: 21917027
- current block number: 21917027

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21917027 (main branch discovery), not current.

```diff
    contract OneStepProverHostIo (0x17e7F68ce50A77e55C7834ddF31AEf86403B8010) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      sinceBlock:
+        19432744
    }
```

```diff
    contract Bridge (0x2403Dd9dFa12255Be8f42bc1e644733c9b2d10Dd) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      sinceBlock:
+        19880244
    }
```

```diff
    contract ValidatorUtils (0x2b0E04Dc90e3fA58165CB41E2834B44A56E766aF) {
    +++ description: This contract implements view only utilities for validators.
      sinceBlock:
+        18736154
    }
```

```diff
    contract Caldera Multisig 3 (0x2bf43034b9559643e986A2fE3cE015a18247b904) {
    +++ description: None
      sinceBlock:
+        20367195
    }
```

```diff
    contract RollupEventInbox (0x3401eafd7Ceb84265B2cC4252155e12B446E7c57) {
    +++ description: Helper contract sending configuration data over the bridge during the systems initialization.
      sinceBlock:
+        19880244
    }
```

```diff
    contract RollupProxy (0x3AAfe635FCfA0E5C19C9368ab5eb384277836006) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      sinceBlock:
+        19880244
    }
```

```diff
    contract UpgradeExecutor (0x566e4dA579fd344DF9fbC2Cbf4014faD41DCA0eA) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      sinceBlock:
+        19880244
    }
```

```diff
    contract OneStepProofEntry (0x57EA090Ac0554d174AE0e2855B460e84A1A7C221) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      sinceBlock:
+        19432745
    }
```

```diff
    contract ChallengeManager (0x59F75d2730a6a505c3C12b797cE2e7Bdb0C11757) {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      sinceBlock:
+        19880244
    }
```

```diff
    contract OneStepProver0 (0x72B166070781a552D7b95a907eF59ca05d3D5a62) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      sinceBlock:
+        19432741
    }
```

```diff
    contract Inbox (0x7EF9d2fe20307165599101e93Ea05b04d46Af159) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      sinceBlock:
+        19880244
    }
```

```diff
    contract OneStepProverMemory (0x8b73Ef238ADaB31EBC7c05423d243c345241a22f) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      sinceBlock:
+        19432742
    }
```

```diff
    contract OneStepProverMath (0x90eC62De2EB7C7512a22bD2D55926AD6bA609F38) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      sinceBlock:
+        19432743
    }
```

```diff
    contract ProxyAdmin (0xb6fbC59CF12d77C35d58B82Deee76cfc934F1235) {
    +++ description: None
      sinceBlock:
+        19880244
    }
```

```diff
    contract SequencerInbox (0xD5dD6114a5DC6d1352C0EE47Cbed6a1807F079c7) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      sinceBlock:
+        19880244
    }
```

```diff
    contract Outbox (0xe4F99a0734C87C298d73C161F54874225E416997) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
      sinceBlock:
+        19880244
    }
```

Generated with discovered.json: 0xbd6d68723431410a08bddcd2525d5a5601ecc450

# Diff at Mon, 24 Feb 2025 15:18:28 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@cfe18eb30997850b8abc4c6e718cd2a363aa4309 block: 21465199
- current block number: 21917027

## Description

renamed MS (shared with form network).

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21465199 (main branch discovery), not current.

```diff
    contract Caldera Multisig 3 (0x2bf43034b9559643e986A2fE3cE015a18247b904) {
    +++ description: None
      name:
-        "OevNetworkMultisig"
+        "Caldera Multisig 3"
    }
```

Generated with discovered.json: 0xd6c69a3365cd3663635a5b16282b262477eed477

# Diff at Fri, 21 Feb 2025 14:09:24 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@d219f271711b2cf7a164e3443bead5e4957d13a8 block: 21465199
- current block number: 21465199

## Description

Config related: Change some severities and add templates.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21465199 (main branch discovery), not current.

```diff
    contract Bridge (0x2403Dd9dFa12255Be8f42bc1e644733c9b2d10Dd) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract RollupProxy (0x3AAfe635FCfA0E5C19C9368ab5eb384277836006) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract UpgradeExecutor (0x566e4dA579fd344DF9fbC2Cbf4014faD41DCA0eA) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      category:
+        {"name":"Governance","priority":3}
    }
```

```diff
    contract ChallengeManager (0x59F75d2730a6a505c3C12b797cE2e7Bdb0C11757) {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract Inbox (0x7EF9d2fe20307165599101e93Ea05b04d46Af159) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      category:
+        {"name":"Canonical Bridges","priority":2}
    }
```

```diff
    contract SequencerInbox (0xD5dD6114a5DC6d1352C0EE47Cbed6a1807F079c7) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract Outbox (0xe4F99a0734C87C298d73C161F54874225E416997) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
      category:
+        {"name":"Canonical Bridges","priority":2}
    }
```

Generated with discovered.json: 0x37267e28d60ea16156b62033be683eb7cdb85564

# Diff at Thu, 20 Feb 2025 12:22:40 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@e2b8072d8f4ddd728fac7a5e6cf8717962af378f block: 21465199
- current block number: 21465199

## Description

Config related: Bold templates added

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21465199 (main branch discovery), not current.

```diff
    contract RollupProxy (0x3AAfe635FCfA0E5C19C9368ab5eb384277836006) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      values.isPostBoLD:
+        false
    }
```

Generated with discovered.json: 0x98e9d5b0705cd2c5813d9ebaf061dcc9d222157c

# Diff at Tue, 04 Feb 2025 12:31:45 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@145553eed7ba44636411ecb25e4099728acd02f9 block: 21465199
- current block number: 21465199

## Description

Rename 'configure' permission to 'interact'

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21465199 (main branch discovery), not current.

```diff
    contract OevNetworkMultisig (0x2bf43034b9559643e986A2fE3cE015a18247b904) {
    +++ description: None
      receivedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract RollupProxy (0x3AAfe635FCfA0E5C19C9368ab5eb384277836006) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      issuedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract UpgradeExecutor (0x566e4dA579fd344DF9fbC2Cbf4014faD41DCA0eA) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      directlyReceivedPermissions.1.permission:
-        "configure"
+        "interact"
    }
```

Generated with discovered.json: 0x648ab6277397e52860bc2efa0ad22ff97ca2f2c9

# Diff at Mon, 20 Jan 2025 11:09:49 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@2c8b4f3d9910bb6371be9b4df87b70856e7d8c64 block: 21465199
- current block number: 21465199

## Description

Rerun on the same block number. Applies fixes to permissions and via field. Renames permission's target to to/from.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21465199 (main branch discovery), not current.

```diff
    contract Bridge (0x2403Dd9dFa12255Be8f42bc1e644733c9b2d10Dd) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      issuedPermissions.0.target:
-        "0x2bf43034b9559643e986A2fE3cE015a18247b904"
      issuedPermissions.0.via.1.delay:
-        0
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x2bf43034b9559643e986A2fE3cE015a18247b904"
    }
```

```diff
    contract OevNetworkMultisig (0x2bf43034b9559643e986A2fE3cE015a18247b904) {
    +++ description: None
      receivedPermissions.8.target:
-        "0xe4F99a0734C87C298d73C161F54874225E416997"
      receivedPermissions.8.from:
+        "0xe4F99a0734C87C298d73C161F54874225E416997"
      receivedPermissions.7.target:
-        "0xD5dD6114a5DC6d1352C0EE47Cbed6a1807F079c7"
      receivedPermissions.7.from:
+        "0xD5dD6114a5DC6d1352C0EE47Cbed6a1807F079c7"
      receivedPermissions.6.target:
-        "0x7EF9d2fe20307165599101e93Ea05b04d46Af159"
      receivedPermissions.6.from:
+        "0x7EF9d2fe20307165599101e93Ea05b04d46Af159"
      receivedPermissions.5.target:
-        "0x59F75d2730a6a505c3C12b797cE2e7Bdb0C11757"
      receivedPermissions.5.from:
+        "0x59F75d2730a6a505c3C12b797cE2e7Bdb0C11757"
      receivedPermissions.4.target:
-        "0x566e4dA579fd344DF9fbC2Cbf4014faD41DCA0eA"
      receivedPermissions.4.from:
+        "0x566e4dA579fd344DF9fbC2Cbf4014faD41DCA0eA"
      receivedPermissions.3.target:
-        "0x3AAfe635FCfA0E5C19C9368ab5eb384277836006"
      receivedPermissions.3.from:
+        "0x3AAfe635FCfA0E5C19C9368ab5eb384277836006"
      receivedPermissions.2.target:
-        "0x3401eafd7Ceb84265B2cC4252155e12B446E7c57"
      receivedPermissions.2.from:
+        "0x3401eafd7Ceb84265B2cC4252155e12B446E7c57"
      receivedPermissions.1.target:
-        "0x2403Dd9dFa12255Be8f42bc1e644733c9b2d10Dd"
      receivedPermissions.1.from:
+        "0x2403Dd9dFa12255Be8f42bc1e644733c9b2d10Dd"
      receivedPermissions.0.target:
-        "0x3AAfe635FCfA0E5C19C9368ab5eb384277836006"
      receivedPermissions.0.from:
+        "0x3AAfe635FCfA0E5C19C9368ab5eb384277836006"
      directlyReceivedPermissions.0.target:
-        "0x566e4dA579fd344DF9fbC2Cbf4014faD41DCA0eA"
      directlyReceivedPermissions.0.from:
+        "0x566e4dA579fd344DF9fbC2Cbf4014faD41DCA0eA"
    }
```

```diff
    contract RollupEventInbox (0x3401eafd7Ceb84265B2cC4252155e12B446E7c57) {
    +++ description: Helper contract sending configuration data over the bridge during the systems initialization.
      issuedPermissions.0.target:
-        "0x2bf43034b9559643e986A2fE3cE015a18247b904"
      issuedPermissions.0.via.1.delay:
-        0
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x2bf43034b9559643e986A2fE3cE015a18247b904"
    }
```

```diff
    contract RollupProxy (0x3AAfe635FCfA0E5C19C9368ab5eb384277836006) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      issuedPermissions.2.target:
-        "0xd4D2F3cB313e59A34089F6635c5c1c6145298640"
      issuedPermissions.2.to:
+        "0xd4D2F3cB313e59A34089F6635c5c1c6145298640"
      issuedPermissions.2.description:
+        "Can propose new state roots (called nodes) and challenge state roots on the host chain."
      issuedPermissions.1.target:
-        "0x2bf43034b9559643e986A2fE3cE015a18247b904"
      issuedPermissions.1.via.0.delay:
-        0
      issuedPermissions.1.to:
+        "0x2bf43034b9559643e986A2fE3cE015a18247b904"
      issuedPermissions.0.target:
-        "0x2bf43034b9559643e986A2fE3cE015a18247b904"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.via.0.description:
-        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
      issuedPermissions.0.to:
+        "0x2bf43034b9559643e986A2fE3cE015a18247b904"
      issuedPermissions.0.description:
+        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
    }
```

```diff
    contract UpgradeExecutor (0x566e4dA579fd344DF9fbC2Cbf4014faD41DCA0eA) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      issuedPermissions.0.target:
-        "0x2bf43034b9559643e986A2fE3cE015a18247b904"
      issuedPermissions.0.via.1.delay:
-        0
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x2bf43034b9559643e986A2fE3cE015a18247b904"
      directlyReceivedPermissions.2.target:
-        "0x3AAfe635FCfA0E5C19C9368ab5eb384277836006"
      directlyReceivedPermissions.2.from:
+        "0x3AAfe635FCfA0E5C19C9368ab5eb384277836006"
      directlyReceivedPermissions.1.target:
-        "0x3AAfe635FCfA0E5C19C9368ab5eb384277836006"
      directlyReceivedPermissions.1.from:
+        "0x3AAfe635FCfA0E5C19C9368ab5eb384277836006"
      directlyReceivedPermissions.0.target:
-        "0xb6fbC59CF12d77C35d58B82Deee76cfc934F1235"
      directlyReceivedPermissions.0.from:
+        "0xb6fbC59CF12d77C35d58B82Deee76cfc934F1235"
    }
```

```diff
    contract ChallengeManager (0x59F75d2730a6a505c3C12b797cE2e7Bdb0C11757) {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      issuedPermissions.0.target:
-        "0x2bf43034b9559643e986A2fE3cE015a18247b904"
      issuedPermissions.0.via.1.delay:
-        0
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x2bf43034b9559643e986A2fE3cE015a18247b904"
    }
```

```diff
    contract Inbox (0x7EF9d2fe20307165599101e93Ea05b04d46Af159) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      issuedPermissions.0.target:
-        "0x2bf43034b9559643e986A2fE3cE015a18247b904"
      issuedPermissions.0.via.1.delay:
-        0
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x2bf43034b9559643e986A2fE3cE015a18247b904"
    }
```

```diff
    contract ProxyAdmin (0xb6fbC59CF12d77C35d58B82Deee76cfc934F1235) {
    +++ description: None
      directlyReceivedPermissions.6.target:
-        "0xe4F99a0734C87C298d73C161F54874225E416997"
      directlyReceivedPermissions.6.from:
+        "0xe4F99a0734C87C298d73C161F54874225E416997"
      directlyReceivedPermissions.5.target:
-        "0xD5dD6114a5DC6d1352C0EE47Cbed6a1807F079c7"
      directlyReceivedPermissions.5.from:
+        "0xD5dD6114a5DC6d1352C0EE47Cbed6a1807F079c7"
      directlyReceivedPermissions.4.target:
-        "0x7EF9d2fe20307165599101e93Ea05b04d46Af159"
      directlyReceivedPermissions.4.from:
+        "0x7EF9d2fe20307165599101e93Ea05b04d46Af159"
      directlyReceivedPermissions.3.target:
-        "0x59F75d2730a6a505c3C12b797cE2e7Bdb0C11757"
      directlyReceivedPermissions.3.from:
+        "0x59F75d2730a6a505c3C12b797cE2e7Bdb0C11757"
      directlyReceivedPermissions.2.target:
-        "0x566e4dA579fd344DF9fbC2Cbf4014faD41DCA0eA"
      directlyReceivedPermissions.2.from:
+        "0x566e4dA579fd344DF9fbC2Cbf4014faD41DCA0eA"
      directlyReceivedPermissions.1.target:
-        "0x3401eafd7Ceb84265B2cC4252155e12B446E7c57"
      directlyReceivedPermissions.1.from:
+        "0x3401eafd7Ceb84265B2cC4252155e12B446E7c57"
      directlyReceivedPermissions.0.target:
-        "0x2403Dd9dFa12255Be8f42bc1e644733c9b2d10Dd"
      directlyReceivedPermissions.0.from:
+        "0x2403Dd9dFa12255Be8f42bc1e644733c9b2d10Dd"
    }
```

```diff
    contract SequencerInbox (0xD5dD6114a5DC6d1352C0EE47Cbed6a1807F079c7) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      issuedPermissions.1.target:
-        "0x2bf43034b9559643e986A2fE3cE015a18247b904"
      issuedPermissions.1.via.1.delay:
-        0
      issuedPermissions.1.via.0.delay:
-        0
      issuedPermissions.1.to:
+        "0x2bf43034b9559643e986A2fE3cE015a18247b904"
      issuedPermissions.0.target:
-        "0x23b6bFACe63BFa288783b8344574c75b78FaEd59"
      issuedPermissions.0.to:
+        "0x23b6bFACe63BFa288783b8344574c75b78FaEd59"
      issuedPermissions.0.description:
+        "Can submit transaction batches or commitments to the SequencerInbox contract on the host chain."
    }
```

```diff
    contract Outbox (0xe4F99a0734C87C298d73C161F54874225E416997) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
      issuedPermissions.0.target:
-        "0x2bf43034b9559643e986A2fE3cE015a18247b904"
      issuedPermissions.0.via.1.delay:
-        0
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x2bf43034b9559643e986A2fE3cE015a18247b904"
    }
```

Generated with discovered.json: 0xfed2d74e40b4bff64279012db52073c5841b8996

# Diff at Wed, 08 Jan 2025 10:44:53 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@20bf0eaa1dce373e2c004314fef59d2d1bdf5502 block: 21465199
- current block number: 21465199

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21465199 (main branch discovery), not current.

```diff
    contract Bridge (0x2403Dd9dFa12255Be8f42bc1e644733c9b2d10Dd) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      description:
-        "Escrow contract for the project's gas token (Can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging."
+        "Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging."
    }
```

Generated with discovered.json: 0x9e8a3b4eded4d77378c5f3038445c1e36dadde19

# Diff at Mon, 23 Dec 2024 12:31:30 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@18325a975c44684702f30ee366361589e4c2ed8c block: 21313475
- current block number: 21465199

## Description

Config related: Celestia-Nitro wmroot added.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21313475 (main branch discovery), not current.

```diff
    contract RollupProxy (0x3AAfe635FCfA0E5C19C9368ab5eb384277836006) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      usedTypes.0.arg.0xe81f986823a85105c5fd91bb53b4493d38c0c26652d23f76a7405ac889908287:
+        "Celestia Nitro 3.2.1 wasmModuleRoot"
    }
```

Generated with discovered.json: 0xee1b60ed8d7d1a850b28afb307fc8586f8d71fa2

# Diff at Fri, 06 Dec 2024 08:09:47 GMT:

- author: Piotr Szlachciak (<szlachciak.piotr@gmail.com>)
- comparing to: main@f9ded76f7930b0c86788e4c4595d553b165b87d1 block: 21313475
- current block number: 21313475

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21313475 (main branch discovery), not current.

```diff
    contract ValidatorUtils (0x2b0E04Dc90e3fA58165CB41E2834B44A56E766aF) {
    +++ description: This contract implements view only utilities for validators.
      template:
+        "orbitstack/ValidatorUtils"
      description:
+        "This contract implements view only utilities for validators."
    }
```

Generated with discovered.json: 0x59718eeed34401dc97056fdc6f4647e14d993ae4

# Diff at Mon, 02 Dec 2024 07:57:35 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@0cac24376573663e0a362b2f340a124e5238a2bc block: 21084619
- current block number: 21313475

## Description

Remove one MS signer.

## Watched changes

```diff
    contract OevNetworkMultisig (0x2bf43034b9559643e986A2fE3cE015a18247b904) {
    +++ description: None
      values.$members.6:
-        "0x15D5fF2dEc328a1cF3D64413caaBdcE29bff050A"
      values.$members.5:
-        "0xb004d94314a34627C09E4b8f83D9E7420d99BbFC"
+        "0x15D5fF2dEc328a1cF3D64413caaBdcE29bff050A"
      values.$members.4:
-        "0x4919167EA334BE84B1604Cbc82A26A7746D5943e"
+        "0xb004d94314a34627C09E4b8f83D9E7420d99BbFC"
      values.multisigThreshold:
-        "4 of 7 (57%)"
+        "4 of 6 (67%)"
    }
```

Generated with discovered.json: 0xc63d92dea2764c18b13e58ecca29f80fa58fb025

# Diff at Fri, 29 Nov 2024 11:28:43 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@9776abb8b1f960f6f1ec6ec27558b5eff7eb5b87 block: 21084619
- current block number: 21084619

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21084619 (main branch discovery), not current.

```diff
    contract OevNetworkMultisig (0x2bf43034b9559643e986A2fE3cE015a18247b904) {
    +++ description: None
      receivedPermissions.0.description:
-        "can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
+        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
    }
```

```diff
    contract RollupProxy (0x3AAfe635FCfA0E5C19C9368ab5eb384277836006) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      issuedPermissions.0.via.0.description:
-        "can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
+        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
      fieldMeta.minimumAssertionPeriod:
+        {"description":"Minimum time delta between newly created nodes (stateUpdates). This is checked on `stakeOnNewNode()`. Format is number of ETHEREUM blocks, even for L3s. "}
    }
```

```diff
    contract UpgradeExecutor (0x566e4dA579fd344DF9fbC2Cbf4014faD41DCA0eA) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      directlyReceivedPermissions.1.description:
-        "can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
+        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
    }
```

Generated with discovered.json: 0xdbdcaab6357f615a9b80deb5f15bb6dce478bb7b

# Diff at Fri, 15 Nov 2024 08:18:12 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@a00c2a67d12a174a45864b549412045028598606 block: 21084619
- current block number: 21084619

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21084619 (main branch discovery), not current.

```diff
    contract RollupEventInbox (0x3401eafd7Ceb84265B2cC4252155e12B446E7c57) {
    +++ description: Helper contract sending configuration data over the bridge during the systems initialization.
      template:
+        "orbitstack/RollupEventInbox"
      description:
+        "Helper contract sending configuration data over the bridge during the systems initialization."
    }
```

```diff
    contract RollupProxy (0x3AAfe635FCfA0E5C19C9368ab5eb384277836006) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      issuedPermissions.3:
-        {"permission":"upgrade","target":"0x2bf43034b9559643e986A2fE3cE015a18247b904","via":[{"address":"0x566e4dA579fd344DF9fbC2Cbf4014faD41DCA0eA","delay":0}]}
      issuedPermissions.2.permission:
-        "propose"
+        "validate"
      issuedPermissions.1.permission:
-        "configure"
+        "upgrade"
      issuedPermissions.1.via.0.description:
-        "can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
      issuedPermissions.0.permission:
-        "challenge"
+        "configure"
      issuedPermissions.0.target:
-        "0xd4D2F3cB313e59A34089F6635c5c1c6145298640"
+        "0x2bf43034b9559643e986A2fE3cE015a18247b904"
      issuedPermissions.0.via.0:
+        {"address":"0x566e4dA579fd344DF9fbC2Cbf4014faD41DCA0eA","delay":0,"description":"can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."}
    }
```

```diff
    contract UpgradeExecutor (0x566e4dA579fd344DF9fbC2Cbf4014faD41DCA0eA) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      description:
-        "Central contract defining the access control for upgrading the system contract implementations."
+        "Central contract defining the access control permissions for upgrading the system contract implementations."
    }
```

```diff
    contract Inbox (0x7EF9d2fe20307165599101e93Ea05b04d46Af159) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      template:
+        "orbitstack/Inbox"
      description:
+        "Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds."
    }
```

```diff
    contract SequencerInbox (0xD5dD6114a5DC6d1352C0EE47Cbed6a1807F079c7) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      fieldMeta.maxTimeVariation.description:
-        "Settable by the Rollup Owner. Transactions can only be force-included after `delayBlocks` window (Sequencer-only) has passed."
+        "Settable by the Rollup Owner. Transactions can only be force-included after the `delayBlocks` window (Sequencer-only) has passed."
    }
```

Generated with discovered.json: 0x09a596b323acf8d9759963ac35076444a3585e63

# Diff at Mon, 04 Nov 2024 07:57:52 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@950c85bf556f084c302d2b03100375cf3c7ed376 block: 21084619
- current block number: 21084619

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21084619 (main branch discovery), not current.

```diff
    contract OevNetworkMultisig (0x2bf43034b9559643e986A2fE3cE015a18247b904) {
    +++ description: None
      receivedPermissions.8:
+        {"permission":"upgrade","target":"0xe4F99a0734C87C298d73C161F54874225E416997","via":[{"address":"0xb6fbC59CF12d77C35d58B82Deee76cfc934F1235"},{"address":"0x566e4dA579fd344DF9fbC2Cbf4014faD41DCA0eA"}]}
      receivedPermissions.7.target:
-        "0xe4F99a0734C87C298d73C161F54874225E416997"
+        "0xD5dD6114a5DC6d1352C0EE47Cbed6a1807F079c7"
      receivedPermissions.6.target:
-        "0xD5dD6114a5DC6d1352C0EE47Cbed6a1807F079c7"
+        "0x7EF9d2fe20307165599101e93Ea05b04d46Af159"
      receivedPermissions.5.target:
-        "0x7EF9d2fe20307165599101e93Ea05b04d46Af159"
+        "0x59F75d2730a6a505c3C12b797cE2e7Bdb0C11757"
      receivedPermissions.4.target:
-        "0x59F75d2730a6a505c3C12b797cE2e7Bdb0C11757"
+        "0x566e4dA579fd344DF9fbC2Cbf4014faD41DCA0eA"
      receivedPermissions.3.target:
-        "0x566e4dA579fd344DF9fbC2Cbf4014faD41DCA0eA"
+        "0x3AAfe635FCfA0E5C19C9368ab5eb384277836006"
      receivedPermissions.3.via.1:
-        {"address":"0x566e4dA579fd344DF9fbC2Cbf4014faD41DCA0eA"}
      receivedPermissions.3.via.0.address:
-        "0xb6fbC59CF12d77C35d58B82Deee76cfc934F1235"
+        "0x566e4dA579fd344DF9fbC2Cbf4014faD41DCA0eA"
      receivedPermissions.2.target:
-        "0x3AAfe635FCfA0E5C19C9368ab5eb384277836006"
+        "0x3401eafd7Ceb84265B2cC4252155e12B446E7c57"
      receivedPermissions.2.via.1:
+        {"address":"0x566e4dA579fd344DF9fbC2Cbf4014faD41DCA0eA"}
      receivedPermissions.2.via.0.address:
-        "0x566e4dA579fd344DF9fbC2Cbf4014faD41DCA0eA"
+        "0xb6fbC59CF12d77C35d58B82Deee76cfc934F1235"
      receivedPermissions.1.target:
-        "0x3401eafd7Ceb84265B2cC4252155e12B446E7c57"
+        "0x2403Dd9dFa12255Be8f42bc1e644733c9b2d10Dd"
      receivedPermissions.0.permission:
-        "upgrade"
+        "configure"
      receivedPermissions.0.target:
-        "0x2403Dd9dFa12255Be8f42bc1e644733c9b2d10Dd"
+        "0x3AAfe635FCfA0E5C19C9368ab5eb384277836006"
      receivedPermissions.0.via.1:
-        {"address":"0x566e4dA579fd344DF9fbC2Cbf4014faD41DCA0eA"}
      receivedPermissions.0.via.0.address:
-        "0xb6fbC59CF12d77C35d58B82Deee76cfc934F1235"
+        "0x566e4dA579fd344DF9fbC2Cbf4014faD41DCA0eA"
      receivedPermissions.0.description:
+        "can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
    }
```

```diff
    contract RollupProxy (0x3AAfe635FCfA0E5C19C9368ab5eb384277836006) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      issuedPermissions.3:
+        {"permission":"upgrade","target":"0x2bf43034b9559643e986A2fE3cE015a18247b904","via":[{"address":"0x566e4dA579fd344DF9fbC2Cbf4014faD41DCA0eA","delay":0}]}
      issuedPermissions.2.permission:
-        "upgrade"
+        "propose"
      issuedPermissions.2.target:
-        "0x2bf43034b9559643e986A2fE3cE015a18247b904"
+        "0xd4D2F3cB313e59A34089F6635c5c1c6145298640"
      issuedPermissions.2.via.0:
-        {"address":"0x566e4dA579fd344DF9fbC2Cbf4014faD41DCA0eA","delay":0}
      issuedPermissions.1.permission:
-        "propose"
+        "configure"
      issuedPermissions.1.target:
-        "0xd4D2F3cB313e59A34089F6635c5c1c6145298640"
+        "0x2bf43034b9559643e986A2fE3cE015a18247b904"
      issuedPermissions.1.via.0:
+        {"address":"0x566e4dA579fd344DF9fbC2Cbf4014faD41DCA0eA","delay":0,"description":"can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."}
    }
```

```diff
    contract UpgradeExecutor (0x566e4dA579fd344DF9fbC2Cbf4014faD41DCA0eA) {
    +++ description: Central contract defining the access control for upgrading the system contract implementations.
      directlyReceivedPermissions.2:
+        {"permission":"upgrade","target":"0x3AAfe635FCfA0E5C19C9368ab5eb384277836006"}
      directlyReceivedPermissions.1.permission:
-        "upgrade"
+        "configure"
      directlyReceivedPermissions.1.description:
+        "can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
    }
```

```diff
    contract SequencerInbox (0xD5dD6114a5DC6d1352C0EE47Cbed6a1807F079c7) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
+++ description: Settable by the Rollup Owner. Transactions can only be force-included after `delayBlocks` window (Sequencer-only) has passed.
      values.maxTimeVariation:
-        [17280,48,86400,3600]
+        {"delayBlocks":17280,"futureBlocks":48,"delaySeconds":86400,"futureSeconds":3600}
      values.postsBlobs:
+        false
      fieldMeta.maxTimeVariation.description:
-        "Struct: delayBlocks, futureBlocks, delaySeconds, futureSeconds. onlyRollupOwner settable. Transactions can only be force-included after `delayBlocks` window (Sequencer-only) has passed."
+        "Settable by the Rollup Owner. Transactions can only be force-included after `delayBlocks` window (Sequencer-only) has passed."
    }
```

Generated with discovered.json: 0x897f4c13409d49ae727c1f15bf64d9ea95dfa1e4

# Diff at Thu, 31 Oct 2024 09:08:45 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- current block number: 21084619

## Description

Initial discovery of a standard orbit stack optimium. (`xchain => oevnetwork @ 1.00`)

## Initial discovery

```diff
+   Status: CREATED
    contract OneStepProverHostIo (0x17e7F68ce50A77e55C7834ddF31AEf86403B8010)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract Bridge (0x2403Dd9dFa12255Be8f42bc1e644733c9b2d10Dd)
    +++ description: Escrow contract for the project's gas token (Can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
```

```diff
+   Status: CREATED
    contract ValidatorUtils (0x2b0E04Dc90e3fA58165CB41E2834B44A56E766aF)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OevNetworkMultisig (0x2bf43034b9559643e986A2fE3cE015a18247b904)
    +++ description: None
```

```diff
+   Status: CREATED
    contract RollupEventInbox (0x3401eafd7Ceb84265B2cC4252155e12B446E7c57)
    +++ description: None
```

```diff
+   Status: CREATED
    contract RollupProxy (0x3AAfe635FCfA0E5C19C9368ab5eb384277836006)
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
```

```diff
+   Status: CREATED
    contract UpgradeExecutor (0x566e4dA579fd344DF9fbC2Cbf4014faD41DCA0eA)
    +++ description: Central contract defining the access control for upgrading the system contract implementations.
```

```diff
+   Status: CREATED
    contract OneStepProofEntry (0x57EA090Ac0554d174AE0e2855B460e84A1A7C221)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract ChallengeManager (0x59F75d2730a6a505c3C12b797cE2e7Bdb0C11757)
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
```

```diff
+   Status: CREATED
    contract OneStepProver0 (0x72B166070781a552D7b95a907eF59ca05d3D5a62)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract Inbox (0x7EF9d2fe20307165599101e93Ea05b04d46Af159)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProverMemory (0x8b73Ef238ADaB31EBC7c05423d243c345241a22f)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract OneStepProverMath (0x90eC62De2EB7C7512a22bD2D55926AD6bA609F38)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0xb6fbC59CF12d77C35d58B82Deee76cfc934F1235)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SequencerInbox (0xD5dD6114a5DC6d1352C0EE47Cbed6a1807F079c7)
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
```

```diff
+   Status: CREATED
    contract Outbox (0xe4F99a0734C87C298d73C161F54874225E416997)
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
```
