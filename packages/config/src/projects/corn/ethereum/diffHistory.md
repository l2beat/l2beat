Generated with discovered.json: 0x976331b32640ffd3d6f053b6aa008c35cb02e856

# Diff at Tue, 22 Jul 2025 16:09:55 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@83bf55f537ce86d3d1dac9f1a98f31f9169b801f block: 22923889
- current block number: 22975813

## Description

Operator changes.

## Watched changes

```diff
    contract SequencerInbox (0x4ad144ea249A98F77e0b78104D3B6eB6cd3a76DA) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      values.batchPosters.0:
-        "eth:0x9298413c781c241aF6F6733b7df00De5D4A42D93"
      values.setIsBatchPosterCount:
-        2
+        3
    }
```

```diff
    contract RollupProxy (0x828C71bc1D7A34F32FfA624240633b6B7272C3D6) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
+++ description: Increments on each Validator change.
      values.setValidatorCount:
-        2
+        3
      values.validators.1:
-        "eth:0xe9D1e89A73D7608a45F3cDb5a898dFd9E3A3Ba42"
    }
```

Generated with discovered.json: 0xc0a5d001bb007e567c0cc1e05b677c3e3f856f6f

# Diff at Tue, 15 Jul 2025 10:10:40 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@fe7c3b2343ca7836e6a947e456ab91a6f0f6f592 block: 22865583
- current block number: 22923889

## Description

-1 staker (validators unchanged).

## Watched changes

```diff
    contract RollupProxy (0x828C71bc1D7A34F32FfA624240633b6B7272C3D6) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      values.stakerCount:
-        2
+        1
    }
```

Generated with discovered.json: 0x0baad720dd9cbf19343fdafd8e297f8d35a4a56b

# Diff at Mon, 14 Jul 2025 12:44:56 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@9f4300dad2f3d080cd56fa311d4a848556c74e72 block: 22865583
- current block number: 22865583

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22865583 (main branch discovery), not current.

```diff
    contract wBTC Escrow (0x00943b11764176C3a8323aEFCBd6fE70CFb6272d) {
    +++ description: None
      address:
-        "0x00943b11764176C3a8323aEFCBd6fE70CFb6272d"
+        "eth:0x00943b11764176C3a8323aEFCBd6fE70CFb6272d"
      values.$admin:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.$implementation:
-        "0xbE28926dAaD466B27C5Dea3A92797F0823e3737C"
+        "eth:0xbE28926dAaD466B27C5Dea3A92797F0823e3737C"
      values.$pastUpgrades.0.2.0:
-        "0xbE28926dAaD466B27C5Dea3A92797F0823e3737C"
+        "eth:0xbE28926dAaD466B27C5Dea3A92797F0823e3737C"
      values.authority:
-        "0x515C7d8Fcb950f8b030ac08C994b37b4b8F3F7B5"
+        "eth:0x515C7d8Fcb950f8b030ac08C994b37b4b8F3F7B5"
      implementationNames.0x00943b11764176C3a8323aEFCBd6fE70CFb6272d:
-        "ERC1967Proxy"
      implementationNames.0xbE28926dAaD466B27C5Dea3A92797F0823e3737C:
-        "Vault"
      implementationNames.eth:0x00943b11764176C3a8323aEFCBd6fE70CFb6272d:
+        "ERC1967Proxy"
      implementationNames.eth:0xbE28926dAaD466B27C5Dea3A92797F0823e3737C:
+        "Vault"
    }
```

```diff
    EOA  (0x02Fd8F217BeDa435dc043A2E351321FFFd6a4AAC) {
    +++ description: None
      address:
-        "0x02Fd8F217BeDa435dc043A2E351321FFFd6a4AAC"
+        "eth:0x02Fd8F217BeDa435dc043A2E351321FFFd6a4AAC"
    }
```

```diff
    contract OneStepProverMath (0x036147913eEb42E97790F9a693246c8444290AB6) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      address:
-        "0x036147913eEb42E97790F9a693246c8444290AB6"
+        "eth:0x036147913eEb42E97790F9a693246c8444290AB6"
      implementationNames.0x036147913eEb42E97790F9a693246c8444290AB6:
-        "OneStepProverMath"
      implementationNames.eth:0x036147913eEb42E97790F9a693246c8444290AB6:
+        "OneStepProverMath"
    }
```

```diff
    contract OneStepProverMemory (0x21c6F81b1063f09A6c26EDc74fBb9beb349A5E96) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      address:
-        "0x21c6F81b1063f09A6c26EDc74fBb9beb349A5E96"
+        "eth:0x21c6F81b1063f09A6c26EDc74fBb9beb349A5E96"
      implementationNames.0x21c6F81b1063f09A6c26EDc74fBb9beb349A5E96:
-        "OneStepProverMemory"
      implementationNames.eth:0x21c6F81b1063f09A6c26EDc74fBb9beb349A5E96:
+        "OneStepProverMemory"
    }
```

```diff
    contract OneStepProverHostIo (0x231173CC90cB8486A7dbD1733B5105254316D50A) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      address:
-        "0x231173CC90cB8486A7dbD1733B5105254316D50A"
+        "eth:0x231173CC90cB8486A7dbD1733B5105254316D50A"
      implementationNames.0x231173CC90cB8486A7dbD1733B5105254316D50A:
-        "OneStepProverHostIo"
      implementationNames.eth:0x231173CC90cB8486A7dbD1733B5105254316D50A:
+        "OneStepProverHostIo"
    }
```

```diff
    contract Outbox (0x2a3C554f212E3e0c78eaF0808f5313A10542dA2d) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
      address:
-        "0x2a3C554f212E3e0c78eaF0808f5313A10542dA2d"
+        "eth:0x2a3C554f212E3e0c78eaF0808f5313A10542dA2d"
      values.$admin:
-        "0xEE9924C5fd94601C80fF8010f577C9f7f3C20B84"
+        "eth:0xEE9924C5fd94601C80fF8010f577C9f7f3C20B84"
      values.$implementation:
-        "0x1f24EDD5161f82588007f33B72b0b28e46cCE878"
+        "eth:0x1f24EDD5161f82588007f33B72b0b28e46cCE878"
      values.$pastUpgrades.0.2.0:
-        "0x1f24EDD5161f82588007f33B72b0b28e46cCE878"
+        "eth:0x1f24EDD5161f82588007f33B72b0b28e46cCE878"
      values.bridge:
-        "0x7E31f112d340a4D0cB0e4bD82f2853089d1bF10C"
+        "eth:0x7E31f112d340a4D0cB0e4bD82f2853089d1bF10C"
      values.l2ToL1Sender:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.rollup:
-        "0x828C71bc1D7A34F32FfA624240633b6B7272C3D6"
+        "eth:0x828C71bc1D7A34F32FfA624240633b6B7272C3D6"
      implementationNames.0x2a3C554f212E3e0c78eaF0808f5313A10542dA2d:
-        "TransparentUpgradeableProxy"
      implementationNames.0x1f24EDD5161f82588007f33B72b0b28e46cCE878:
-        "ERC20Outbox"
      implementationNames.eth:0x2a3C554f212E3e0c78eaF0808f5313A10542dA2d:
+        "TransparentUpgradeableProxy"
      implementationNames.eth:0x1f24EDD5161f82588007f33B72b0b28e46cCE878:
+        "ERC20Outbox"
    }
```

```diff
    contract Inbox (0x37693F11f3D724E55D0B03D5F328D8202C913243) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      address:
-        "0x37693F11f3D724E55D0B03D5F328D8202C913243"
+        "eth:0x37693F11f3D724E55D0B03D5F328D8202C913243"
      values.$admin:
-        "0xEE9924C5fd94601C80fF8010f577C9f7f3C20B84"
+        "eth:0xEE9924C5fd94601C80fF8010f577C9f7f3C20B84"
      values.$implementation:
-        "0x6C051397fee2d79ccf92d1f3c5c6547fEBD838F4"
+        "eth:0x6C051397fee2d79ccf92d1f3c5c6547fEBD838F4"
      values.$pastUpgrades.0.2.0:
-        "0x85a77E293a81d4C35F304951e41378E5e43d1f53"
+        "eth:0x85a77E293a81d4C35F304951e41378E5e43d1f53"
      values.$pastUpgrades.1.2.0:
-        "0x6C051397fee2d79ccf92d1f3c5c6547fEBD838F4"
+        "eth:0x6C051397fee2d79ccf92d1f3c5c6547fEBD838F4"
      values.bridge:
-        "0x7E31f112d340a4D0cB0e4bD82f2853089d1bF10C"
+        "eth:0x7E31f112d340a4D0cB0e4bD82f2853089d1bF10C"
      values.getProxyAdmin:
-        "0xEE9924C5fd94601C80fF8010f577C9f7f3C20B84"
+        "eth:0xEE9924C5fd94601C80fF8010f577C9f7f3C20B84"
      values.sequencerInbox:
-        "0x4ad144ea249A98F77e0b78104D3B6eB6cd3a76DA"
+        "eth:0x4ad144ea249A98F77e0b78104D3B6eB6cd3a76DA"
      implementationNames.0x37693F11f3D724E55D0B03D5F328D8202C913243:
-        "TransparentUpgradeableProxy"
      implementationNames.0x6C051397fee2d79ccf92d1f3c5c6547fEBD838F4:
-        "ERC20Inbox"
      implementationNames.eth:0x37693F11f3D724E55D0B03D5F328D8202C913243:
+        "TransparentUpgradeableProxy"
      implementationNames.eth:0x6C051397fee2d79ccf92d1f3c5c6547fEBD838F4:
+        "ERC20Inbox"
    }
```

```diff
    contract SequencerInbox (0x4ad144ea249A98F77e0b78104D3B6eB6cd3a76DA) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      address:
-        "0x4ad144ea249A98F77e0b78104D3B6eB6cd3a76DA"
+        "eth:0x4ad144ea249A98F77e0b78104D3B6eB6cd3a76DA"
      values.$admin:
-        "0xEE9924C5fd94601C80fF8010f577C9f7f3C20B84"
+        "eth:0xEE9924C5fd94601C80fF8010f577C9f7f3C20B84"
      values.$implementation:
-        "0xaEd84B70Be8117112a5aa0d93a7fBff463A03b18"
+        "eth:0xaEd84B70Be8117112a5aa0d93a7fBff463A03b18"
      values.$pastUpgrades.0.2.0:
-        "0x46FaF6838Bbf770986f073348D41881D5e54Fb0F"
+        "eth:0x46FaF6838Bbf770986f073348D41881D5e54Fb0F"
      values.$pastUpgrades.1.2.0:
-        "0xaEd84B70Be8117112a5aa0d93a7fBff463A03b18"
+        "eth:0xaEd84B70Be8117112a5aa0d93a7fBff463A03b18"
      values.batchPosterManager:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.batchPosters.0:
-        "0x9298413c781c241aF6F6733b7df00De5D4A42D93"
+        "eth:0x9298413c781c241aF6F6733b7df00De5D4A42D93"
      values.batchPosters.1:
-        "0xfFb9B41320a47FDE7c2939BA0c1f1d58E80648FB"
+        "eth:0xfFb9B41320a47FDE7c2939BA0c1f1d58E80648FB"
      values.bridge:
-        "0x7E31f112d340a4D0cB0e4bD82f2853089d1bF10C"
+        "eth:0x7E31f112d340a4D0cB0e4bD82f2853089d1bF10C"
      values.reader4844:
-        "0x6c5c9E6c080a6C25f49DfFE85cfA71aaEAAfdE74"
+        "eth:0x6c5c9E6c080a6C25f49DfFE85cfA71aaEAAfdE74"
      values.rollup:
-        "0x828C71bc1D7A34F32FfA624240633b6B7272C3D6"
+        "eth:0x828C71bc1D7A34F32FfA624240633b6B7272C3D6"
      implementationNames.0x4ad144ea249A98F77e0b78104D3B6eB6cd3a76DA:
-        "TransparentUpgradeableProxy"
      implementationNames.0xaEd84B70Be8117112a5aa0d93a7fBff463A03b18:
-        "SequencerInbox"
      implementationNames.eth:0x4ad144ea249A98F77e0b78104D3B6eB6cd3a76DA:
+        "TransparentUpgradeableProxy"
      implementationNames.eth:0xaEd84B70Be8117112a5aa0d93a7fBff463A03b18:
+        "SequencerInbox"
    }
```

```diff
    contract Governor (0x515C7d8Fcb950f8b030ac08C994b37b4b8F3F7B5) {
    +++ description: None
      address:
-        "0x515C7d8Fcb950f8b030ac08C994b37b4b8F3F7B5"
+        "eth:0x515C7d8Fcb950f8b030ac08C994b37b4b8F3F7B5"
      values.authority:
-        "0x515C7d8Fcb950f8b030ac08C994b37b4b8F3F7B5"
+        "eth:0x515C7d8Fcb950f8b030ac08C994b37b4b8F3F7B5"
      values.owner:
-        "0xCff1ad9f09b32252171207e8525c90B18D4E2C7D"
+        "eth:0xCff1ad9f09b32252171207e8525c90B18D4E2C7D"
      implementationNames.0x515C7d8Fcb950f8b030ac08C994b37b4b8F3F7B5:
-        "Governor"
      implementationNames.eth:0x515C7d8Fcb950f8b030ac08C994b37b4b8F3F7B5:
+        "Governor"
    }
```

```diff
    EOA  (0x5D2af120aED72585fd24E4176dbB4B484B84e0bE) {
    +++ description: None
      address:
-        "0x5D2af120aED72585fd24E4176dbB4B484B84e0bE"
+        "eth:0x5D2af120aED72585fd24E4176dbB4B484B84e0bE"
    }
```

```diff
    contract RollupEventInbox (0x6282197777e7c318C7209bd7059110886aa429C6) {
    +++ description: Helper contract sending configuration data over the bridge during the systems initialization.
      address:
-        "0x6282197777e7c318C7209bd7059110886aa429C6"
+        "eth:0x6282197777e7c318C7209bd7059110886aa429C6"
      values.$admin:
-        "0xEE9924C5fd94601C80fF8010f577C9f7f3C20B84"
+        "eth:0xEE9924C5fd94601C80fF8010f577C9f7f3C20B84"
      values.$implementation:
-        "0xb0f031Cd10598c6b4C33FcE1675F26CF937091da"
+        "eth:0xb0f031Cd10598c6b4C33FcE1675F26CF937091da"
      values.$pastUpgrades.0.2.0:
-        "0xb0f031Cd10598c6b4C33FcE1675F26CF937091da"
+        "eth:0xb0f031Cd10598c6b4C33FcE1675F26CF937091da"
      values.bridge:
-        "0x7E31f112d340a4D0cB0e4bD82f2853089d1bF10C"
+        "eth:0x7E31f112d340a4D0cB0e4bD82f2853089d1bF10C"
      values.rollup:
-        "0x828C71bc1D7A34F32FfA624240633b6B7272C3D6"
+        "eth:0x828C71bc1D7A34F32FfA624240633b6B7272C3D6"
      implementationNames.0x6282197777e7c318C7209bd7059110886aa429C6:
-        "TransparentUpgradeableProxy"
      implementationNames.0xb0f031Cd10598c6b4C33FcE1675F26CF937091da:
-        "ERC20RollupEventInbox"
      implementationNames.eth:0x6282197777e7c318C7209bd7059110886aa429C6:
+        "TransparentUpgradeableProxy"
      implementationNames.eth:0xb0f031Cd10598c6b4C33FcE1675F26CF937091da:
+        "ERC20RollupEventInbox"
    }
```

```diff
    EOA  (0x629eAAe0627d2138Aa324A5155BaE29F99Da07df) {
    +++ description: None
      address:
-        "0x629eAAe0627d2138Aa324A5155BaE29F99Da07df"
+        "eth:0x629eAAe0627d2138Aa324A5155BaE29F99Da07df"
    }
```

```diff
    contract OneStepProver0 (0x72b55c2C38EadE57C10047746632A369A060A46E) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      address:
-        "0x72b55c2C38EadE57C10047746632A369A060A46E"
+        "eth:0x72b55c2C38EadE57C10047746632A369A060A46E"
      implementationNames.0x72b55c2C38EadE57C10047746632A369A060A46E:
-        "OneStepProver0"
      implementationNames.eth:0x72b55c2C38EadE57C10047746632A369A060A46E:
+        "OneStepProver0"
    }
```

```diff
    contract Bridge (0x7E31f112d340a4D0cB0e4bD82f2853089d1bF10C) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      address:
-        "0x7E31f112d340a4D0cB0e4bD82f2853089d1bF10C"
+        "eth:0x7E31f112d340a4D0cB0e4bD82f2853089d1bF10C"
      values.$admin:
-        "0xEE9924C5fd94601C80fF8010f577C9f7f3C20B84"
+        "eth:0xEE9924C5fd94601C80fF8010f577C9f7f3C20B84"
      values.$implementation:
-        "0xd7FD189F1652378f32dA3db7926e51a7b0344797"
+        "eth:0xd7FD189F1652378f32dA3db7926e51a7b0344797"
      values.$pastUpgrades.0.2.0:
-        "0xd7FD189F1652378f32dA3db7926e51a7b0344797"
+        "eth:0xd7FD189F1652378f32dA3db7926e51a7b0344797"
      values.activeOutbox:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
+++ description: Allowed to mint the gastoken on L2 and call `enqueueDelayedMessage()` on the bridge.
+++ severity: HIGH
      values.allowedDelayedInboxList.0:
-        "0x37693F11f3D724E55D0B03D5F328D8202C913243"
+        "eth:0x37693F11f3D724E55D0B03D5F328D8202C913243"
+++ description: Allowed to mint the gastoken on L2 and call `enqueueDelayedMessage()` on the bridge.
+++ severity: HIGH
      values.allowedDelayedInboxList.1:
-        "0x6282197777e7c318C7209bd7059110886aa429C6"
+        "eth:0x6282197777e7c318C7209bd7059110886aa429C6"
+++ description: Can make calls as the bridge, steal all funds.
+++ severity: HIGH
      values.allowedOutboxList.0:
-        "0x2a3C554f212E3e0c78eaF0808f5313A10542dA2d"
+        "eth:0x2a3C554f212E3e0c78eaF0808f5313A10542dA2d"
+++ description: All Inboxes that were ever set as allowed in the bridge.
+++ severity: HIGH
      values.inboxHistory.0:
-        "0x37693F11f3D724E55D0B03D5F328D8202C913243"
+        "eth:0x37693F11f3D724E55D0B03D5F328D8202C913243"
+++ description: All Inboxes that were ever set as allowed in the bridge.
+++ severity: HIGH
      values.inboxHistory.1:
-        "0x6282197777e7c318C7209bd7059110886aa429C6"
+        "eth:0x6282197777e7c318C7209bd7059110886aa429C6"
+++ description: All Inboxes that were ever set as allowed in the bridge.
+++ severity: HIGH
      values.inboxHistory.2:
-        "0xde43165ED9d31CcF94747227aA1F3B98B3adf6d2"
+        "eth:0xde43165ED9d31CcF94747227aA1F3B98B3adf6d2"
      values.nativeToken:
-        "0x386E7A3a0c0919c9d53c3b04FF67E73Ff9e45Fb6"
+        "eth:0x386E7A3a0c0919c9d53c3b04FF67E73Ff9e45Fb6"
+++ description: All Outboxes that were ever set as allowed in the bridge.
+++ severity: HIGH
      values.outboxHistory.0:
-        "0x2a3C554f212E3e0c78eaF0808f5313A10542dA2d"
+        "eth:0x2a3C554f212E3e0c78eaF0808f5313A10542dA2d"
      values.rollup:
-        "0x828C71bc1D7A34F32FfA624240633b6B7272C3D6"
+        "eth:0x828C71bc1D7A34F32FfA624240633b6B7272C3D6"
      values.sequencerInbox:
-        "0x4ad144ea249A98F77e0b78104D3B6eB6cd3a76DA"
+        "eth:0x4ad144ea249A98F77e0b78104D3B6eB6cd3a76DA"
      implementationNames.0x7E31f112d340a4D0cB0e4bD82f2853089d1bF10C:
-        "TransparentUpgradeableProxy"
      implementationNames.0xd7FD189F1652378f32dA3db7926e51a7b0344797:
-        "ERC20Bridge"
      implementationNames.eth:0x7E31f112d340a4D0cB0e4bD82f2853089d1bF10C:
+        "TransparentUpgradeableProxy"
      implementationNames.eth:0xd7FD189F1652378f32dA3db7926e51a7b0344797:
+        "ERC20Bridge"
    }
```

```diff
    contract RollupProxy (0x828C71bc1D7A34F32FfA624240633b6B7272C3D6) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      address:
-        "0x828C71bc1D7A34F32FfA624240633b6B7272C3D6"
+        "eth:0x828C71bc1D7A34F32FfA624240633b6B7272C3D6"
      values.$admin:
-        "0x8672705351C81f40B55b1ac2A1998de66166d0eA"
+        "eth:0x8672705351C81f40B55b1ac2A1998de66166d0eA"
      values.$implementation.0:
-        "0x431cEb4EC80752304E7f19E72eb599074Cf5A202"
+        "eth:0x431cEb4EC80752304E7f19E72eb599074Cf5A202"
      values.$implementation.1:
-        "0x973Eb5A5993717A6b1C28Aa6D7b1dBF97a538e54"
+        "eth:0x973Eb5A5993717A6b1C28Aa6D7b1dBF97a538e54"
      values.$pastUpgrades.0.2.0:
-        "0x431cEb4EC80752304E7f19E72eb599074Cf5A202"
+        "eth:0x431cEb4EC80752304E7f19E72eb599074Cf5A202"
      values.$pastUpgrades.0.2.1:
-        "0x973Eb5A5993717A6b1C28Aa6D7b1dBF97a538e54"
+        "eth:0x973Eb5A5993717A6b1C28Aa6D7b1dBF97a538e54"
      values.anyTrustFastConfirmer:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.bridge:
-        "0x7E31f112d340a4D0cB0e4bD82f2853089d1bF10C"
+        "eth:0x7E31f112d340a4D0cB0e4bD82f2853089d1bF10C"
      values.challengeManager:
-        "0xBb309FFFC24F77927d7C4eb86BaA67D8f9dC0EB8"
+        "eth:0xBb309FFFC24F77927d7C4eb86BaA67D8f9dC0EB8"
      values.inbox:
-        "0x37693F11f3D724E55D0B03D5F328D8202C913243"
+        "eth:0x37693F11f3D724E55D0B03D5F328D8202C913243"
      values.loserStakeEscrow:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.outbox:
-        "0x2a3C554f212E3e0c78eaF0808f5313A10542dA2d"
+        "eth:0x2a3C554f212E3e0c78eaF0808f5313A10542dA2d"
      values.owner:
-        "0x8672705351C81f40B55b1ac2A1998de66166d0eA"
+        "eth:0x8672705351C81f40B55b1ac2A1998de66166d0eA"
      values.rollupEventInbox:
-        "0x6282197777e7c318C7209bd7059110886aa429C6"
+        "eth:0x6282197777e7c318C7209bd7059110886aa429C6"
      values.sequencerInbox:
-        "0x4ad144ea249A98F77e0b78104D3B6eB6cd3a76DA"
+        "eth:0x4ad144ea249A98F77e0b78104D3B6eB6cd3a76DA"
      values.stakeToken:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.validators.0:
-        "0xe2F1D1E0ACc476455044a9D053B5d667C0a2D61c"
+        "eth:0xe2F1D1E0ACc476455044a9D053B5d667C0a2D61c"
      values.validators.1:
-        "0xe9D1e89A73D7608a45F3cDb5a898dFd9E3A3Ba42"
+        "eth:0xe9D1e89A73D7608a45F3cDb5a898dFd9E3A3Ba42"
      values.validatorUtils:
-        "0x84eA2523b271029FFAeB58fc6E6F1435a280db44"
+        "eth:0x84eA2523b271029FFAeB58fc6E6F1435a280db44"
      values.validatorWalletCreator:
-        "0x0A5eC2286bB15893d5b8f320aAbc823B2186BA09"
+        "eth:0x0A5eC2286bB15893d5b8f320aAbc823B2186BA09"
      implementationNames.0x828C71bc1D7A34F32FfA624240633b6B7272C3D6:
-        "RollupProxy"
      implementationNames.0x431cEb4EC80752304E7f19E72eb599074Cf5A202:
-        "RollupAdminLogic"
      implementationNames.0x973Eb5A5993717A6b1C28Aa6D7b1dBF97a538e54:
-        "RollupUserLogic"
      implementationNames.eth:0x828C71bc1D7A34F32FfA624240633b6B7272C3D6:
+        "RollupProxy"
      implementationNames.eth:0x431cEb4EC80752304E7f19E72eb599074Cf5A202:
+        "RollupAdminLogic"
      implementationNames.eth:0x973Eb5A5993717A6b1C28Aa6D7b1dBF97a538e54:
+        "RollupUserLogic"
    }
```

```diff
    contract ValidatorUtils (0x84eA2523b271029FFAeB58fc6E6F1435a280db44) {
    +++ description: This contract implements view only utilities for validators.
      address:
-        "0x84eA2523b271029FFAeB58fc6E6F1435a280db44"
+        "eth:0x84eA2523b271029FFAeB58fc6E6F1435a280db44"
      implementationNames.0x84eA2523b271029FFAeB58fc6E6F1435a280db44:
-        "ValidatorUtils"
      implementationNames.eth:0x84eA2523b271029FFAeB58fc6E6F1435a280db44:
+        "ValidatorUtils"
    }
```

```diff
    contract UpgradeExecutor (0x8672705351C81f40B55b1ac2A1998de66166d0eA) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      address:
-        "0x8672705351C81f40B55b1ac2A1998de66166d0eA"
+        "eth:0x8672705351C81f40B55b1ac2A1998de66166d0eA"
      values.$admin:
-        "0xEE9924C5fd94601C80fF8010f577C9f7f3C20B84"
+        "eth:0xEE9924C5fd94601C80fF8010f577C9f7f3C20B84"
      values.$implementation:
-        "0x011d8F10fbC20C14B453768253CdFF7EB5B96917"
+        "eth:0x011d8F10fbC20C14B453768253CdFF7EB5B96917"
      values.$pastUpgrades.0.2.0:
-        "0x011d8F10fbC20C14B453768253CdFF7EB5B96917"
+        "eth:0x011d8F10fbC20C14B453768253CdFF7EB5B96917"
      values.accessControl.ADMIN_ROLE.members.0:
-        "0x8672705351C81f40B55b1ac2A1998de66166d0eA"
+        "eth:0x8672705351C81f40B55b1ac2A1998de66166d0eA"
      values.accessControl.EXECUTOR_ROLE.members.0:
-        "0xCff1ad9f09b32252171207e8525c90B18D4E2C7D"
+        "eth:0xCff1ad9f09b32252171207e8525c90B18D4E2C7D"
      values.executors.0:
-        "0xCff1ad9f09b32252171207e8525c90B18D4E2C7D"
+        "eth:0xCff1ad9f09b32252171207e8525c90B18D4E2C7D"
      implementationNames.0x8672705351C81f40B55b1ac2A1998de66166d0eA:
-        "TransparentUpgradeableProxy"
      implementationNames.0x011d8F10fbC20C14B453768253CdFF7EB5B96917:
-        "UpgradeExecutor"
      implementationNames.eth:0x8672705351C81f40B55b1ac2A1998de66166d0eA:
+        "TransparentUpgradeableProxy"
      implementationNames.eth:0x011d8F10fbC20C14B453768253CdFF7EB5B96917:
+        "UpgradeExecutor"
    }
```

```diff
    EOA  (0x9298413c781c241aF6F6733b7df00De5D4A42D93) {
    +++ description: None
      address:
-        "0x9298413c781c241aF6F6733b7df00De5D4A42D93"
+        "eth:0x9298413c781c241aF6F6733b7df00De5D4A42D93"
    }
```

```diff
    contract cbBTC Escrow (0x957C9DC25DE6B8E46a7Fa0D081bA749DD005B54f) {
    +++ description: None
      address:
-        "0x957C9DC25DE6B8E46a7Fa0D081bA749DD005B54f"
+        "eth:0x957C9DC25DE6B8E46a7Fa0D081bA749DD005B54f"
      values.$admin:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.$implementation:
-        "0xbE28926dAaD466B27C5Dea3A92797F0823e3737C"
+        "eth:0xbE28926dAaD466B27C5Dea3A92797F0823e3737C"
      values.$pastUpgrades.0.2.0:
-        "0xbE28926dAaD466B27C5Dea3A92797F0823e3737C"
+        "eth:0xbE28926dAaD466B27C5Dea3A92797F0823e3737C"
      values.authority:
-        "0x515C7d8Fcb950f8b030ac08C994b37b4b8F3F7B5"
+        "eth:0x515C7d8Fcb950f8b030ac08C994b37b4b8F3F7B5"
      implementationNames.0x957C9DC25DE6B8E46a7Fa0D081bA749DD005B54f:
-        "ERC1967Proxy"
      implementationNames.0xbE28926dAaD466B27C5Dea3A92797F0823e3737C:
-        "Vault"
      implementationNames.eth:0x957C9DC25DE6B8E46a7Fa0D081bA749DD005B54f:
+        "ERC1967Proxy"
      implementationNames.eth:0xbE28926dAaD466B27C5Dea3A92797F0823e3737C:
+        "Vault"
    }
```

```diff
    contract OneStepProofEntry (0x9f403f2054736884518E6D3f510C02f5959BDCC6) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      address:
-        "0x9f403f2054736884518E6D3f510C02f5959BDCC6"
+        "eth:0x9f403f2054736884518E6D3f510C02f5959BDCC6"
      values.prover0:
-        "0x72b55c2C38EadE57C10047746632A369A060A46E"
+        "eth:0x72b55c2C38EadE57C10047746632A369A060A46E"
      values.proverHostIo:
-        "0x231173CC90cB8486A7dbD1733B5105254316D50A"
+        "eth:0x231173CC90cB8486A7dbD1733B5105254316D50A"
      values.proverMath:
-        "0x036147913eEb42E97790F9a693246c8444290AB6"
+        "eth:0x036147913eEb42E97790F9a693246c8444290AB6"
      values.proverMem:
-        "0x21c6F81b1063f09A6c26EDc74fBb9beb349A5E96"
+        "eth:0x21c6F81b1063f09A6c26EDc74fBb9beb349A5E96"
      implementationNames.0x9f403f2054736884518E6D3f510C02f5959BDCC6:
-        "OneStepProofEntry"
      implementationNames.eth:0x9f403f2054736884518E6D3f510C02f5959BDCC6:
+        "OneStepProofEntry"
    }
```

```diff
    contract ChallengeManager (0xBb309FFFC24F77927d7C4eb86BaA67D8f9dC0EB8) {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      address:
-        "0xBb309FFFC24F77927d7C4eb86BaA67D8f9dC0EB8"
+        "eth:0xBb309FFFC24F77927d7C4eb86BaA67D8f9dC0EB8"
      values.$admin:
-        "0xEE9924C5fd94601C80fF8010f577C9f7f3C20B84"
+        "eth:0xEE9924C5fd94601C80fF8010f577C9f7f3C20B84"
      values.$implementation:
-        "0xDD9Dd7505a48c96D5De169Bec9573A5cc8e11A38"
+        "eth:0xDD9Dd7505a48c96D5De169Bec9573A5cc8e11A38"
      values.$pastUpgrades.0.2.0:
-        "0xDD9Dd7505a48c96D5De169Bec9573A5cc8e11A38"
+        "eth:0xDD9Dd7505a48c96D5De169Bec9573A5cc8e11A38"
      values.bridge:
-        "0x7E31f112d340a4D0cB0e4bD82f2853089d1bF10C"
+        "eth:0x7E31f112d340a4D0cB0e4bD82f2853089d1bF10C"
      values.osp:
-        "0x9f403f2054736884518E6D3f510C02f5959BDCC6"
+        "eth:0x9f403f2054736884518E6D3f510C02f5959BDCC6"
      values.resultReceiver:
-        "0x828C71bc1D7A34F32FfA624240633b6B7272C3D6"
+        "eth:0x828C71bc1D7A34F32FfA624240633b6B7272C3D6"
      values.sequencerInbox:
-        "0x4ad144ea249A98F77e0b78104D3B6eB6cd3a76DA"
+        "eth:0x4ad144ea249A98F77e0b78104D3B6eB6cd3a76DA"
      implementationNames.0xBb309FFFC24F77927d7C4eb86BaA67D8f9dC0EB8:
-        "TransparentUpgradeableProxy"
      implementationNames.0xDD9Dd7505a48c96D5De169Bec9573A5cc8e11A38:
-        "ChallengeManager"
      implementationNames.eth:0xBb309FFFC24F77927d7C4eb86BaA67D8f9dC0EB8:
+        "TransparentUpgradeableProxy"
      implementationNames.eth:0xDD9Dd7505a48c96D5De169Bec9573A5cc8e11A38:
+        "ChallengeManager"
    }
```

```diff
    EOA  (0xc827B8bd8082E46eA66897E486C4B14A22BE24Db) {
    +++ description: None
      address:
-        "0xc827B8bd8082E46eA66897E486C4B14A22BE24Db"
+        "eth:0xc827B8bd8082E46eA66897E486C4B14A22BE24Db"
    }
```

```diff
    contract CornMultisig (0xCff1ad9f09b32252171207e8525c90B18D4E2C7D) {
    +++ description: None
      address:
-        "0xCff1ad9f09b32252171207e8525c90B18D4E2C7D"
+        "eth:0xCff1ad9f09b32252171207e8525c90B18D4E2C7D"
      values.$implementation:
-        "0x41675C099F32341bf84BFc5382aF534df5C7461a"
+        "eth:0x41675C099F32341bf84BFc5382aF534df5C7461a"
      values.$members.0:
-        "0x5D2af120aED72585fd24E4176dbB4B484B84e0bE"
+        "eth:0x5D2af120aED72585fd24E4176dbB4B484B84e0bE"
      values.$members.1:
-        "0xc827B8bd8082E46eA66897E486C4B14A22BE24Db"
+        "eth:0xc827B8bd8082E46eA66897E486C4B14A22BE24Db"
      values.$members.2:
-        "0x629eAAe0627d2138Aa324A5155BaE29F99Da07df"
+        "eth:0x629eAAe0627d2138Aa324A5155BaE29F99Da07df"
      values.$members.3:
-        "0x02Fd8F217BeDa435dc043A2E351321FFFd6a4AAC"
+        "eth:0x02Fd8F217BeDa435dc043A2E351321FFFd6a4AAC"
      implementationNames.0xCff1ad9f09b32252171207e8525c90B18D4E2C7D:
-        "SafeProxy"
      implementationNames.0x41675C099F32341bf84BFc5382aF534df5C7461a:
-        "Safe"
      implementationNames.eth:0xCff1ad9f09b32252171207e8525c90B18D4E2C7D:
+        "SafeProxy"
      implementationNames.eth:0x41675C099F32341bf84BFc5382aF534df5C7461a:
+        "Safe"
    }
```

```diff
    EOA  (0xe2F1D1E0ACc476455044a9D053B5d667C0a2D61c) {
    +++ description: None
      address:
-        "0xe2F1D1E0ACc476455044a9D053B5d667C0a2D61c"
+        "eth:0xe2F1D1E0ACc476455044a9D053B5d667C0a2D61c"
    }
```

```diff
    EOA  (0xe9D1e89A73D7608a45F3cDb5a898dFd9E3A3Ba42) {
    +++ description: None
      address:
-        "0xe9D1e89A73D7608a45F3cDb5a898dFd9E3A3Ba42"
+        "eth:0xe9D1e89A73D7608a45F3cDb5a898dFd9E3A3Ba42"
    }
```

```diff
    contract ProxyAdmin (0xEE9924C5fd94601C80fF8010f577C9f7f3C20B84) {
    +++ description: None
      address:
-        "0xEE9924C5fd94601C80fF8010f577C9f7f3C20B84"
+        "eth:0xEE9924C5fd94601C80fF8010f577C9f7f3C20B84"
      values.owner:
-        "0x8672705351C81f40B55b1ac2A1998de66166d0eA"
+        "eth:0x8672705351C81f40B55b1ac2A1998de66166d0eA"
      implementationNames.0xEE9924C5fd94601C80fF8010f577C9f7f3C20B84:
-        "ProxyAdmin"
      implementationNames.eth:0xEE9924C5fd94601C80fF8010f577C9f7f3C20B84:
+        "ProxyAdmin"
    }
```

```diff
    EOA  (0xfFb9B41320a47FDE7c2939BA0c1f1d58E80648FB) {
    +++ description: None
      address:
-        "0xfFb9B41320a47FDE7c2939BA0c1f1d58E80648FB"
+        "eth:0xfFb9B41320a47FDE7c2939BA0c1f1d58E80648FB"
    }
```

```diff
+   Status: CREATED
    contract wBTC Escrow (0x00943b11764176C3a8323aEFCBd6fE70CFb6272d)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProverMath (0x036147913eEb42E97790F9a693246c8444290AB6)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract OneStepProverMemory (0x21c6F81b1063f09A6c26EDc74fBb9beb349A5E96)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract OneStepProverHostIo (0x231173CC90cB8486A7dbD1733B5105254316D50A)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract Outbox (0x2a3C554f212E3e0c78eaF0808f5313A10542dA2d)
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
```

```diff
+   Status: CREATED
    contract Inbox (0x37693F11f3D724E55D0B03D5F328D8202C913243)
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
```

```diff
+   Status: CREATED
    contract SequencerInbox (0x4ad144ea249A98F77e0b78104D3B6eB6cd3a76DA)
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
```

```diff
+   Status: CREATED
    contract Governor (0x515C7d8Fcb950f8b030ac08C994b37b4b8F3F7B5)
    +++ description: None
```

```diff
+   Status: CREATED
    contract RollupEventInbox (0x6282197777e7c318C7209bd7059110886aa429C6)
    +++ description: Helper contract sending configuration data over the bridge during the systems initialization.
```

```diff
+   Status: CREATED
    contract OneStepProver0 (0x72b55c2C38EadE57C10047746632A369A060A46E)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract Bridge (0x7E31f112d340a4D0cB0e4bD82f2853089d1bF10C)
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
```

```diff
+   Status: CREATED
    contract RollupProxy (0x828C71bc1D7A34F32FfA624240633b6B7272C3D6)
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
```

```diff
+   Status: CREATED
    contract ValidatorUtils (0x84eA2523b271029FFAeB58fc6E6F1435a280db44)
    +++ description: This contract implements view only utilities for validators.
```

```diff
+   Status: CREATED
    contract UpgradeExecutor (0x8672705351C81f40B55b1ac2A1998de66166d0eA)
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
```

```diff
+   Status: CREATED
    contract cbBTC Escrow (0x957C9DC25DE6B8E46a7Fa0D081bA749DD005B54f)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProofEntry (0x9f403f2054736884518E6D3f510C02f5959BDCC6)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract ChallengeManager (0xBb309FFFC24F77927d7C4eb86BaA67D8f9dC0EB8)
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
```

```diff
+   Status: CREATED
    contract CornMultisig (0xCff1ad9f09b32252171207e8525c90B18D4E2C7D)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0xEE9924C5fd94601C80fF8010f577C9f7f3C20B84)
    +++ description: None
```

Generated with discovered.json: 0xd2ff187fbb75bcf1a1da9fc3b5d35bb13d4e5fda

# Diff at Mon, 07 Jul 2025 06:39:18 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@1a6f89d35120c5c65bf077ab92a9ca72da48080d block: 22796170
- current block number: 22865583

## Description

+1 staker (staking validator).

## Watched changes

```diff
    contract RollupProxy (0x828C71bc1D7A34F32FfA624240633b6B7272C3D6) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      values.stakerCount:
-        1
+        2
    }
```

Generated with discovered.json: 0x396267ee1710ec5abd8865e1ae43d0d9f8255c29

# Diff at Fri, 04 Jul 2025 12:18:56 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f56dc47fe915564d4555300304da4d3bcbc087f block: 22796170
- current block number: 22796170

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22796170 (main branch discovery), not current.

```diff
    contract UpgradeExecutor (0x8672705351C81f40B55b1ac2A1998de66166d0eA) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      directlyReceivedPermissions.0.from:
-        "ethereum:0xEE9924C5fd94601C80fF8010f577C9f7f3C20B84"
+        "eth:0xEE9924C5fd94601C80fF8010f577C9f7f3C20B84"
      directlyReceivedPermissions.1.from:
-        "ethereum:0x828C71bc1D7A34F32FfA624240633b6B7272C3D6"
+        "eth:0x828C71bc1D7A34F32FfA624240633b6B7272C3D6"
      directlyReceivedPermissions.2.from:
-        "ethereum:0x828C71bc1D7A34F32FfA624240633b6B7272C3D6"
+        "eth:0x828C71bc1D7A34F32FfA624240633b6B7272C3D6"
    }
```

```diff
    EOA  (0x9298413c781c241aF6F6733b7df00De5D4A42D93) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0x4ad144ea249A98F77e0b78104D3B6eB6cd3a76DA"
+        "eth:0x4ad144ea249A98F77e0b78104D3B6eB6cd3a76DA"
    }
```

```diff
    contract CornMultisig (0xCff1ad9f09b32252171207e8525c90B18D4E2C7D) {
    +++ description: None
      receivedPermissions.0.via.0.address:
-        "ethereum:0x8672705351C81f40B55b1ac2A1998de66166d0eA"
+        "eth:0x8672705351C81f40B55b1ac2A1998de66166d0eA"
      receivedPermissions.0.from:
-        "ethereum:0x828C71bc1D7A34F32FfA624240633b6B7272C3D6"
+        "eth:0x828C71bc1D7A34F32FfA624240633b6B7272C3D6"
      receivedPermissions.1.via.1.address:
-        "ethereum:0x8672705351C81f40B55b1ac2A1998de66166d0eA"
+        "eth:0x8672705351C81f40B55b1ac2A1998de66166d0eA"
      receivedPermissions.1.via.0.address:
-        "ethereum:0xEE9924C5fd94601C80fF8010f577C9f7f3C20B84"
+        "eth:0xEE9924C5fd94601C80fF8010f577C9f7f3C20B84"
      receivedPermissions.1.from:
-        "ethereum:0x2a3C554f212E3e0c78eaF0808f5313A10542dA2d"
+        "eth:0x2a3C554f212E3e0c78eaF0808f5313A10542dA2d"
      receivedPermissions.2.via.1.address:
-        "ethereum:0x8672705351C81f40B55b1ac2A1998de66166d0eA"
+        "eth:0x8672705351C81f40B55b1ac2A1998de66166d0eA"
      receivedPermissions.2.via.0.address:
-        "ethereum:0xEE9924C5fd94601C80fF8010f577C9f7f3C20B84"
+        "eth:0xEE9924C5fd94601C80fF8010f577C9f7f3C20B84"
      receivedPermissions.2.from:
-        "ethereum:0x37693F11f3D724E55D0B03D5F328D8202C913243"
+        "eth:0x37693F11f3D724E55D0B03D5F328D8202C913243"
      receivedPermissions.3.via.1.address:
-        "ethereum:0x8672705351C81f40B55b1ac2A1998de66166d0eA"
+        "eth:0x8672705351C81f40B55b1ac2A1998de66166d0eA"
      receivedPermissions.3.via.0.address:
-        "ethereum:0xEE9924C5fd94601C80fF8010f577C9f7f3C20B84"
+        "eth:0xEE9924C5fd94601C80fF8010f577C9f7f3C20B84"
      receivedPermissions.3.from:
-        "ethereum:0x4ad144ea249A98F77e0b78104D3B6eB6cd3a76DA"
+        "eth:0x4ad144ea249A98F77e0b78104D3B6eB6cd3a76DA"
      receivedPermissions.4.via.1.address:
-        "ethereum:0x8672705351C81f40B55b1ac2A1998de66166d0eA"
+        "eth:0x8672705351C81f40B55b1ac2A1998de66166d0eA"
      receivedPermissions.4.via.0.address:
-        "ethereum:0xEE9924C5fd94601C80fF8010f577C9f7f3C20B84"
+        "eth:0xEE9924C5fd94601C80fF8010f577C9f7f3C20B84"
      receivedPermissions.4.from:
-        "ethereum:0x6282197777e7c318C7209bd7059110886aa429C6"
+        "eth:0x6282197777e7c318C7209bd7059110886aa429C6"
      receivedPermissions.5.via.1.address:
-        "ethereum:0x8672705351C81f40B55b1ac2A1998de66166d0eA"
+        "eth:0x8672705351C81f40B55b1ac2A1998de66166d0eA"
      receivedPermissions.5.via.0.address:
-        "ethereum:0xEE9924C5fd94601C80fF8010f577C9f7f3C20B84"
+        "eth:0xEE9924C5fd94601C80fF8010f577C9f7f3C20B84"
      receivedPermissions.5.from:
-        "ethereum:0x7E31f112d340a4D0cB0e4bD82f2853089d1bF10C"
+        "eth:0x7E31f112d340a4D0cB0e4bD82f2853089d1bF10C"
      receivedPermissions.6.via.0.address:
-        "ethereum:0x8672705351C81f40B55b1ac2A1998de66166d0eA"
+        "eth:0x8672705351C81f40B55b1ac2A1998de66166d0eA"
      receivedPermissions.6.from:
-        "ethereum:0x828C71bc1D7A34F32FfA624240633b6B7272C3D6"
+        "eth:0x828C71bc1D7A34F32FfA624240633b6B7272C3D6"
      receivedPermissions.7.via.1.address:
-        "ethereum:0x8672705351C81f40B55b1ac2A1998de66166d0eA"
+        "eth:0x8672705351C81f40B55b1ac2A1998de66166d0eA"
      receivedPermissions.7.via.0.address:
-        "ethereum:0xEE9924C5fd94601C80fF8010f577C9f7f3C20B84"
+        "eth:0xEE9924C5fd94601C80fF8010f577C9f7f3C20B84"
      receivedPermissions.7.from:
-        "ethereum:0x8672705351C81f40B55b1ac2A1998de66166d0eA"
+        "eth:0x8672705351C81f40B55b1ac2A1998de66166d0eA"
      receivedPermissions.8.via.1.address:
-        "ethereum:0x8672705351C81f40B55b1ac2A1998de66166d0eA"
+        "eth:0x8672705351C81f40B55b1ac2A1998de66166d0eA"
      receivedPermissions.8.via.0.address:
-        "ethereum:0xEE9924C5fd94601C80fF8010f577C9f7f3C20B84"
+        "eth:0xEE9924C5fd94601C80fF8010f577C9f7f3C20B84"
      receivedPermissions.8.from:
-        "ethereum:0xBb309FFFC24F77927d7C4eb86BaA67D8f9dC0EB8"
+        "eth:0xBb309FFFC24F77927d7C4eb86BaA67D8f9dC0EB8"
      directlyReceivedPermissions.0.from:
-        "ethereum:0x8672705351C81f40B55b1ac2A1998de66166d0eA"
+        "eth:0x8672705351C81f40B55b1ac2A1998de66166d0eA"
    }
```

```diff
    EOA  (0xe2F1D1E0ACc476455044a9D053B5d667C0a2D61c) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0x828C71bc1D7A34F32FfA624240633b6B7272C3D6"
+        "eth:0x828C71bc1D7A34F32FfA624240633b6B7272C3D6"
    }
```

```diff
    EOA  (0xe9D1e89A73D7608a45F3cDb5a898dFd9E3A3Ba42) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0x828C71bc1D7A34F32FfA624240633b6B7272C3D6"
+        "eth:0x828C71bc1D7A34F32FfA624240633b6B7272C3D6"
    }
```

```diff
    contract ProxyAdmin (0xEE9924C5fd94601C80fF8010f577C9f7f3C20B84) {
    +++ description: None
      directlyReceivedPermissions.0.from:
-        "ethereum:0x2a3C554f212E3e0c78eaF0808f5313A10542dA2d"
+        "eth:0x2a3C554f212E3e0c78eaF0808f5313A10542dA2d"
      directlyReceivedPermissions.1.from:
-        "ethereum:0x37693F11f3D724E55D0B03D5F328D8202C913243"
+        "eth:0x37693F11f3D724E55D0B03D5F328D8202C913243"
      directlyReceivedPermissions.2.from:
-        "ethereum:0x4ad144ea249A98F77e0b78104D3B6eB6cd3a76DA"
+        "eth:0x4ad144ea249A98F77e0b78104D3B6eB6cd3a76DA"
      directlyReceivedPermissions.3.from:
-        "ethereum:0x6282197777e7c318C7209bd7059110886aa429C6"
+        "eth:0x6282197777e7c318C7209bd7059110886aa429C6"
      directlyReceivedPermissions.4.from:
-        "ethereum:0x7E31f112d340a4D0cB0e4bD82f2853089d1bF10C"
+        "eth:0x7E31f112d340a4D0cB0e4bD82f2853089d1bF10C"
      directlyReceivedPermissions.5.from:
-        "ethereum:0x8672705351C81f40B55b1ac2A1998de66166d0eA"
+        "eth:0x8672705351C81f40B55b1ac2A1998de66166d0eA"
      directlyReceivedPermissions.6.from:
-        "ethereum:0xBb309FFFC24F77927d7C4eb86BaA67D8f9dC0EB8"
+        "eth:0xBb309FFFC24F77927d7C4eb86BaA67D8f9dC0EB8"
    }
```

```diff
    EOA  (0xfFb9B41320a47FDE7c2939BA0c1f1d58E80648FB) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0x4ad144ea249A98F77e0b78104D3B6eB6cd3a76DA"
+        "eth:0x4ad144ea249A98F77e0b78104D3B6eB6cd3a76DA"
    }
```

Generated with discovered.json: 0x24eaa6dd7ae660ad694e26bffc2ecc83622af093

# Diff at Fri, 27 Jun 2025 13:47:48 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@0486f9e4c91d499528f32792e73e81ff4cc57d2c block: 22437609
- current block number: 22796170

## Description

add new vali + sequencer.

## Watched changes

```diff
    contract SequencerInbox (0x4ad144ea249A98F77e0b78104D3B6eB6cd3a76DA) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      values.batchPosters.1:
+        "0xfFb9B41320a47FDE7c2939BA0c1f1d58E80648FB"
      values.setIsBatchPosterCount:
-        1
+        2
    }
```

```diff
    contract RollupProxy (0x828C71bc1D7A34F32FfA624240633b6B7272C3D6) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
+++ description: Increments on each Validator change.
      values.setValidatorCount:
-        1
+        2
      values.validators.0:
+        "0xe2F1D1E0ACc476455044a9D053B5d667C0a2D61c"
    }
```

Generated with discovered.json: 0xbf7c3b3fa0edc72dde928819104ff30b88b17d85

# Diff at Wed, 18 Jun 2025 12:22:40 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@a8e4f22a1441bd5040898cc3d3d62b3582942b65 block: 22437609
- current block number: 22437609

## Description

config: wasmmoduleroot map updated.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22437609 (main branch discovery), not current.

```diff
    contract RollupProxy (0x828C71bc1D7A34F32FfA624240633b6B7272C3D6) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      usedTypes.0.arg.0xdb698a2576298f25448bc092e52cf13b1e24141c997135d70f217d674bbeb69a:
+        "ArbOS v40 wasmModuleRoot"
    }
```

Generated with discovered.json: 0x7e76443499cd8d0a16f6a5be3b428d6eb0b485b2

# Diff at Tue, 27 May 2025 08:26:42 GMT:

- author: Michał Podsiadły (<michal.podsiadly@l2beat.com>)
- comparing to: main@fd658a9ed4bbd45fc5705d23b1906ca057d0d8b0 block: 22437609
- current block number: 22437609

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22437609 (main branch discovery), not current.

```diff
    contract RollupProxy (0x828C71bc1D7A34F32FfA624240633b6B7272C3D6) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      sourceHashes.2:
-        "0xb8da0b3748daac768860783e8555198fd2d1bbdffb775b81557a7124890c7eca"
      sourceHashes.1:
-        "0x9349e73cbc2d2b818c1d79711574ba210b56249d8d3845bc78c776caf8f8ff42"
+        "0xb8da0b3748daac768860783e8555198fd2d1bbdffb775b81557a7124890c7eca"
      sourceHashes.0:
-        "0x7ee21b18b2e18c636bfafc08ff72692cc43302b2599ba75f0abad67282866dd5"
+        "0x86c7032e0f4b5468f1eb92c79b73ab4c7f053fc7bdfc88fdd360e2fe7baa1072"
    }
```

Generated with discovered.json: 0x4ad1c04584f7e9e8e6b26d112b305d95d8e39c74

# Diff at Fri, 23 May 2025 09:40:54 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@69cd181abbc3c830a6caf2f4429b37cae72ffdb8 block: 22437609
- current block number: 22437609

## Description

Introduced .role field on each permission, defaulting to field name on which it was defined (with '.' prefix)

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22437609 (main branch discovery), not current.

```diff
    contract UpgradeExecutor (0x8672705351C81f40B55b1ac2A1998de66166d0eA) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      directlyReceivedPermissions.2.role:
+        "admin"
      directlyReceivedPermissions.1.role:
+        ".owner"
      directlyReceivedPermissions.0.role:
+        ".owner"
    }
```

```diff
    EOA  (0x9298413c781c241aF6F6733b7df00De5D4A42D93) {
    +++ description: None
      receivedPermissions.0.role:
+        ".batchPosters"
    }
```

```diff
    contract CornMultisig (0xCff1ad9f09b32252171207e8525c90B18D4E2C7D) {
    +++ description: None
      receivedPermissions.8.role:
+        "admin"
      receivedPermissions.7.role:
+        "admin"
      receivedPermissions.6.role:
+        "admin"
      receivedPermissions.5.role:
+        "admin"
      receivedPermissions.4.role:
+        "admin"
      receivedPermissions.3.role:
+        "admin"
      receivedPermissions.2.role:
+        "admin"
      receivedPermissions.1.role:
+        "admin"
      receivedPermissions.0.role:
+        ".owner"
      directlyReceivedPermissions.0.role:
+        ".executors"
    }
```

```diff
    EOA  (0xe9D1e89A73D7608a45F3cDb5a898dFd9E3A3Ba42) {
    +++ description: None
      receivedPermissions.0.role:
+        ".validators"
    }
```

```diff
    contract ProxyAdmin (0xEE9924C5fd94601C80fF8010f577C9f7f3C20B84) {
    +++ description: None
      directlyReceivedPermissions.6.role:
+        "admin"
      directlyReceivedPermissions.5.role:
+        "admin"
      directlyReceivedPermissions.4.role:
+        "admin"
      directlyReceivedPermissions.3.role:
+        "admin"
      directlyReceivedPermissions.2.role:
+        "admin"
      directlyReceivedPermissions.1.role:
+        "admin"
      directlyReceivedPermissions.0.role:
+        "admin"
    }
```

Generated with discovered.json: 0xc9a51e9fcbc7205b757edbf58a52de73406d9f4f

# Diff at Thu, 08 May 2025 08:23:06 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@8e1926142ab0c57cc131de4d8da307e13d9af54d block: 21993984
- current block number: 22437609

## Description

Standard Orbit upgrade with minor changes.

## Watched changes

```diff
    contract Inbox (0x37693F11f3D724E55D0B03D5F328D8202C913243) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      sourceHashes.0:
-        "0xb2c117c2e00734a82fe4ab27d5fe91a6e152c06bbcdbf83db021ad32b6be3e60"
+        "0x25984fdfffb8141859c99299fb29e7a7460732d77111e5fe23792baa99f336a3"
      values.$implementation:
-        "0x85a77E293a81d4C35F304951e41378E5e43d1f53"
+        "0x6C051397fee2d79ccf92d1f3c5c6547fEBD838F4"
      values.$pastUpgrades.1:
+        ["2025-05-06T17:15:47.000Z","0xaa90fa8f865acd5f13e46ab7aa76d3eee29a749c04601905433d8229ef00cd6e",["0x6C051397fee2d79ccf92d1f3c5c6547fEBD838F4"]]
      values.$upgradeCount:
-        1
+        2
      implementationNames.0x85a77E293a81d4C35F304951e41378E5e43d1f53:
-        "ERC20Inbox"
      implementationNames.0x6C051397fee2d79ccf92d1f3c5c6547fEBD838F4:
+        "ERC20Inbox"
    }
```

```diff
    contract SequencerInbox (0x4ad144ea249A98F77e0b78104D3B6eB6cd3a76DA) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      sourceHashes.0:
-        "0x50cf57b01499408fa99da27cf0fee96ec30f0d40667d1aa090c442bc80f0636b"
+        "0x6bb86ac4bd0d31e049f543fcf0a8f94c952252222f115246ef9d5b8104d803cc"
      values.$implementation:
-        "0x46FaF6838Bbf770986f073348D41881D5e54Fb0F"
+        "0xaEd84B70Be8117112a5aa0d93a7fBff463A03b18"
      values.$pastUpgrades.1:
+        ["2025-05-06T17:15:47.000Z","0xaa90fa8f865acd5f13e46ab7aa76d3eee29a749c04601905433d8229ef00cd6e",["0xaEd84B70Be8117112a5aa0d93a7fBff463A03b18"]]
      values.$upgradeCount:
-        1
+        2
      values.reader4844:
-        "0xf15a3c17FE45415acE1bBb87157487B9a3F50169"
+        "0x6c5c9E6c080a6C25f49DfFE85cfA71aaEAAfdE74"
      implementationNames.0x46FaF6838Bbf770986f073348D41881D5e54Fb0F:
-        "SequencerInbox"
      implementationNames.0xaEd84B70Be8117112a5aa0d93a7fBff463A03b18:
+        "SequencerInbox"
    }
```

## Source code changes

```diff
.../{.flat@21993984 => .flat}/Inbox/ERC20Inbox.sol | 16 +++++++++++++--
 .../SequencerInbox/SequencerInbox.sol              | 24 +++++++++++++++-------
 2 files changed, 31 insertions(+), 9 deletions(-)
```

Generated with discovered.json: 0xcf135926c39513d2dce814b8a9f99029e0a8583f

# Diff at Fri, 02 May 2025 17:23:29 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@c598e33a0c469175b7abbd6c2a13b47b63d6b6a4 block: 21993984
- current block number: 21993984

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21993984 (main branch discovery), not current.

```diff
    contract RollupProxy (0x828C71bc1D7A34F32FfA624240633b6B7272C3D6) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      usedTypes.0.arg.0xaf1dbdfceb871c00bfbb1675983133df04f0ed04e89647812513c091e3a982b3:
+        "Celestia Nitro 3.3.2 wasmModuleRoot"
    }
```

Generated with discovered.json: 0x82bb4cb0bc9d3efca470065ff5c4d9f9fd852b62

# Diff at Tue, 29 Apr 2025 08:19:01 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@ef7477af00fe0b57a2f7cacf7e958c12494af662 block: 21993984
- current block number: 21993984

## Description

Field .issuedPermissions is removed from the output as no longer needed. Added 'permissionsConfigHash' due to refactoring of the modelling process (into a separate command).

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21993984 (main branch discovery), not current.

```diff
    contract Outbox (0x2a3C554f212E3e0c78eaF0808f5313A10542dA2d) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0xCff1ad9f09b32252171207e8525c90B18D4E2C7D","via":[{"address":"0x8672705351C81f40B55b1ac2A1998de66166d0eA"},{"address":"0xEE9924C5fd94601C80fF8010f577C9f7f3C20B84"}]}]
    }
```

```diff
    contract Inbox (0x37693F11f3D724E55D0B03D5F328D8202C913243) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0xCff1ad9f09b32252171207e8525c90B18D4E2C7D","via":[{"address":"0x8672705351C81f40B55b1ac2A1998de66166d0eA"},{"address":"0xEE9924C5fd94601C80fF8010f577C9f7f3C20B84"}]}]
    }
```

```diff
    contract SequencerInbox (0x4ad144ea249A98F77e0b78104D3B6eB6cd3a76DA) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      issuedPermissions:
-        [{"permission":"sequence","to":"0x9298413c781c241aF6F6733b7df00De5D4A42D93","description":"Can submit transaction batches or commitments to the SequencerInbox contract on the host chain.","via":[]},{"permission":"upgrade","to":"0xCff1ad9f09b32252171207e8525c90B18D4E2C7D","via":[{"address":"0x8672705351C81f40B55b1ac2A1998de66166d0eA"},{"address":"0xEE9924C5fd94601C80fF8010f577C9f7f3C20B84"}]}]
    }
```

```diff
    contract RollupEventInbox (0x6282197777e7c318C7209bd7059110886aa429C6) {
    +++ description: Helper contract sending configuration data over the bridge during the systems initialization.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0xCff1ad9f09b32252171207e8525c90B18D4E2C7D","via":[{"address":"0x8672705351C81f40B55b1ac2A1998de66166d0eA"},{"address":"0xEE9924C5fd94601C80fF8010f577C9f7f3C20B84"}]}]
    }
```

```diff
    contract Bridge (0x7E31f112d340a4D0cB0e4bD82f2853089d1bF10C) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0xCff1ad9f09b32252171207e8525c90B18D4E2C7D","via":[{"address":"0x8672705351C81f40B55b1ac2A1998de66166d0eA"},{"address":"0xEE9924C5fd94601C80fF8010f577C9f7f3C20B84"}]}]
    }
```

```diff
    contract RollupProxy (0x828C71bc1D7A34F32FfA624240633b6B7272C3D6) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      issuedPermissions:
-        [{"permission":"interact","to":"0xCff1ad9f09b32252171207e8525c90B18D4E2C7D","description":"Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes.","via":[{"address":"0x8672705351C81f40B55b1ac2A1998de66166d0eA"}]},{"permission":"upgrade","to":"0xCff1ad9f09b32252171207e8525c90B18D4E2C7D","via":[{"address":"0x8672705351C81f40B55b1ac2A1998de66166d0eA"}]},{"permission":"validate","to":"0xe9D1e89A73D7608a45F3cDb5a898dFd9E3A3Ba42","description":"Can propose new state roots (called nodes) and challenge state roots on the host chain.","via":[]}]
    }
```

```diff
    contract UpgradeExecutor (0x8672705351C81f40B55b1ac2A1998de66166d0eA) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0xCff1ad9f09b32252171207e8525c90B18D4E2C7D","via":[{"address":"0x8672705351C81f40B55b1ac2A1998de66166d0eA"},{"address":"0xEE9924C5fd94601C80fF8010f577C9f7f3C20B84"}]}]
    }
```

```diff
    contract ChallengeManager (0xBb309FFFC24F77927d7C4eb86BaA67D8f9dC0EB8) {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0xCff1ad9f09b32252171207e8525c90B18D4E2C7D","via":[{"address":"0x8672705351C81f40B55b1ac2A1998de66166d0eA"},{"address":"0xEE9924C5fd94601C80fF8010f577C9f7f3C20B84"}]}]
    }
```

Generated with discovered.json: 0x065e55fd47dc370d30fbfcac7d1aa4f53804ff5e

# Diff at Fri, 07 Mar 2025 09:06:24 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@454ef41fea41bcea030780b23fd1f11519ff78d2 block: 21642560
- current block number: 21993984

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21642560 (main branch discovery), not current.

```diff
    contract RollupProxy (0x828C71bc1D7A34F32FfA624240633b6B7272C3D6) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      values.isPostBoLD:
+        false
    }
```

Generated with discovered.json: 0xa18be53e91c11cef124bc91cc5e6b4edc9d9c742

# Diff at Thu, 06 Mar 2025 09:38:58 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@7119c715545bc86a4194761f42815f811ac6307a block: 21642560
- current block number: 21642560

## Description

Config related: set severity for arbitrum inbox/outbox changes to high and add historical In- and Outboxes via events.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21642560 (main branch discovery), not current.

```diff
    contract Bridge (0x7E31f112d340a4D0cB0e4bD82f2853089d1bF10C) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
+++ description: All Inboxes that were ever set as allowed in the bridge.
+++ severity: HIGH
      values.inboxHistory:
+        ["0x37693F11f3D724E55D0B03D5F328D8202C913243","0x6282197777e7c318C7209bd7059110886aa429C6","0xde43165ED9d31CcF94747227aA1F3B98B3adf6d2"]
+++ description: All Outboxes that were ever set as allowed in the bridge.
+++ severity: HIGH
      values.outboxHistory:
+        ["0x2a3C554f212E3e0c78eaF0808f5313A10542dA2d"]
      fieldMeta:
+        {"allowedOutboxList":{"severity":"HIGH","description":"Can make calls as the bridge, steal all funds."},"outboxHistory":{"severity":"HIGH","description":"All Outboxes that were ever set as allowed in the bridge."},"allowedDelayedInboxList":{"severity":"HIGH","description":"Allowed to mint the gastoken on L2 and call `enqueueDelayedMessage()` on the bridge."},"inboxHistory":{"severity":"HIGH","description":"All Inboxes that were ever set as allowed in the bridge."}}
    }
```

Generated with discovered.json: 0x28267fb5261f1cf2cb4b6cb78f50528a33246a59

# Diff at Tue, 04 Mar 2025 10:39:02 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@98d260b45fe0d2195ce5e629bd7b200c8706e8ba block: 21642560
- current block number: 21642560

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21642560 (main branch discovery), not current.

```diff
    contract wBTC Escrow (0x00943b11764176C3a8323aEFCBd6fE70CFb6272d) {
    +++ description: None
      sinceBlock:
+        21379583
    }
```

```diff
    contract OneStepProverMath (0x036147913eEb42E97790F9a693246c8444290AB6) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      sinceBlock:
+        20643936
    }
```

```diff
    contract OneStepProverMemory (0x21c6F81b1063f09A6c26EDc74fBb9beb349A5E96) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      sinceBlock:
+        20643935
    }
```

```diff
    contract OneStepProverHostIo (0x231173CC90cB8486A7dbD1733B5105254316D50A) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      sinceBlock:
+        20643937
    }
```

```diff
    contract Outbox (0x2a3C554f212E3e0c78eaF0808f5313A10542dA2d) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
      sinceBlock:
+        21221163
    }
```

```diff
    contract Inbox (0x37693F11f3D724E55D0B03D5F328D8202C913243) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      sinceBlock:
+        21221163
    }
```

```diff
    contract SequencerInbox (0x4ad144ea249A98F77e0b78104D3B6eB6cd3a76DA) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      sinceBlock:
+        21221163
    }
```

```diff
    contract Governor (0x515C7d8Fcb950f8b030ac08C994b37b4b8F3F7B5) {
    +++ description: None
      sinceBlock:
+        21181998
    }
```

```diff
    contract RollupEventInbox (0x6282197777e7c318C7209bd7059110886aa429C6) {
    +++ description: Helper contract sending configuration data over the bridge during the systems initialization.
      sinceBlock:
+        21221163
    }
```

```diff
    contract OneStepProver0 (0x72b55c2C38EadE57C10047746632A369A060A46E) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      sinceBlock:
+        20643934
    }
```

```diff
    contract Bridge (0x7E31f112d340a4D0cB0e4bD82f2853089d1bF10C) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      sinceBlock:
+        21221163
    }
```

```diff
    contract RollupProxy (0x828C71bc1D7A34F32FfA624240633b6B7272C3D6) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      sinceBlock:
+        21221163
    }
```

```diff
    contract ValidatorUtils (0x84eA2523b271029FFAeB58fc6E6F1435a280db44) {
    +++ description: This contract implements view only utilities for validators.
      sinceBlock:
+        20643951
    }
```

```diff
    contract UpgradeExecutor (0x8672705351C81f40B55b1ac2A1998de66166d0eA) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      sinceBlock:
+        21221163
    }
```

```diff
    contract cbBTC Escrow (0x957C9DC25DE6B8E46a7Fa0D081bA749DD005B54f) {
    +++ description: None
      sinceBlock:
+        21379628
    }
```

```diff
    contract OneStepProofEntry (0x9f403f2054736884518E6D3f510C02f5959BDCC6) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      sinceBlock:
+        20643940
    }
```

```diff
    contract ChallengeManager (0xBb309FFFC24F77927d7C4eb86BaA67D8f9dC0EB8) {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      sinceBlock:
+        21221163
    }
```

```diff
    contract CornMultisig (0xCff1ad9f09b32252171207e8525c90B18D4E2C7D) {
    +++ description: None
      sinceBlock:
+        21279265
    }
```

```diff
    contract ProxyAdmin (0xEE9924C5fd94601C80fF8010f577C9f7f3C20B84) {
    +++ description: None
      sinceBlock:
+        21221163
    }
```

Generated with discovered.json: 0x825d3bcfe48ba33283bfcae2434c7fccfbb0abb7

# Diff at Thu, 27 Feb 2025 11:45:30 GMT:

- author: Michał Podsiadły (<michal.podsiadly@l2beat.com>)
- comparing to: main@a4b50e45bb44f8ceeea29f9236088d26a843c885 block: 21642560
- current block number: 21642560

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21642560 (main branch discovery), not current.

```diff
    contract Outbox (0x2a3C554f212E3e0c78eaF0808f5313A10542dA2d) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
      name:
-        "ERC20Outbox"
+        "Outbox"
      displayName:
-        "Outbox"
    }
```

```diff
    contract Inbox (0x37693F11f3D724E55D0B03D5F328D8202C913243) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      name:
-        "ERC20Inbox"
+        "Inbox"
      displayName:
-        "Inbox"
    }
```

```diff
    contract RollupEventInbox (0x6282197777e7c318C7209bd7059110886aa429C6) {
    +++ description: Helper contract sending configuration data over the bridge during the systems initialization.
      name:
-        "ERC20RollupEventInbox"
+        "RollupEventInbox"
      displayName:
-        "RollupEventInbox"
    }
```

```diff
    contract Bridge (0x7E31f112d340a4D0cB0e4bD82f2853089d1bF10C) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      name:
-        "ERC20Bridge"
+        "Bridge"
      displayName:
-        "Bridge"
    }
```

Generated with discovered.json: 0xc8a98993923ec1439f24823bbabca70aba8b90fb

# Diff at Fri, 21 Feb 2025 14:05:49 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@d219f271711b2cf7a164e3443bead5e4957d13a8 block: 21642560
- current block number: 21642560

## Description

Config related: Change some severities and add templates.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21642560 (main branch discovery), not current.

```diff
    contract ERC20Outbox (0x2a3C554f212E3e0c78eaF0808f5313A10542dA2d) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
      category:
+        {"name":"Canonical Bridges","priority":2}
    }
```

```diff
    contract ERC20Inbox (0x37693F11f3D724E55D0B03D5F328D8202C913243) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      category:
+        {"name":"Canonical Bridges","priority":2}
    }
```

```diff
    contract SequencerInbox (0x4ad144ea249A98F77e0b78104D3B6eB6cd3a76DA) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract ERC20Bridge (0x7E31f112d340a4D0cB0e4bD82f2853089d1bF10C) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract RollupProxy (0x828C71bc1D7A34F32FfA624240633b6B7272C3D6) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract UpgradeExecutor (0x8672705351C81f40B55b1ac2A1998de66166d0eA) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      category:
+        {"name":"Governance","priority":3}
    }
```

```diff
    contract ChallengeManager (0xBb309FFFC24F77927d7C4eb86BaA67D8f9dC0EB8) {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

Generated with discovered.json: 0x059e71adb7c6e745f4047b4ed6381737f91155d8

# Diff at Tue, 04 Feb 2025 12:30:54 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@145553eed7ba44636411ecb25e4099728acd02f9 block: 21642560
- current block number: 21642560

## Description

Rename 'configure' permission to 'interact'

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21642560 (main branch discovery), not current.

```diff
    contract RollupProxy (0x828C71bc1D7A34F32FfA624240633b6B7272C3D6) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      issuedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract UpgradeExecutor (0x8672705351C81f40B55b1ac2A1998de66166d0eA) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      directlyReceivedPermissions.1.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract CornMultisig (0xCff1ad9f09b32252171207e8525c90B18D4E2C7D) {
    +++ description: None
      receivedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

Generated with discovered.json: 0x5da5dc1f20979aadd4859719f78f9c530a2f1341

# Diff at Mon, 20 Jan 2025 11:09:22 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@2c8b4f3d9910bb6371be9b4df87b70856e7d8c64 block: 21642560
- current block number: 21642560

## Description

Rerun on the same block number. Applies fixes to permissions and via field. Renames permission's target to to/from.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21642560 (main branch discovery), not current.

```diff
    contract ERC20Outbox (0x2a3C554f212E3e0c78eaF0808f5313A10542dA2d) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
      issuedPermissions.0.target:
-        "0xCff1ad9f09b32252171207e8525c90B18D4E2C7D"
      issuedPermissions.0.via.1.delay:
-        0
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0xCff1ad9f09b32252171207e8525c90B18D4E2C7D"
    }
```

```diff
    contract ERC20Inbox (0x37693F11f3D724E55D0B03D5F328D8202C913243) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      issuedPermissions.0.target:
-        "0xCff1ad9f09b32252171207e8525c90B18D4E2C7D"
      issuedPermissions.0.via.1.delay:
-        0
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0xCff1ad9f09b32252171207e8525c90B18D4E2C7D"
    }
```

```diff
    contract SequencerInbox (0x4ad144ea249A98F77e0b78104D3B6eB6cd3a76DA) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      issuedPermissions.1.target:
-        "0xCff1ad9f09b32252171207e8525c90B18D4E2C7D"
      issuedPermissions.1.via.1.delay:
-        0
      issuedPermissions.1.via.0.delay:
-        0
      issuedPermissions.1.to:
+        "0xCff1ad9f09b32252171207e8525c90B18D4E2C7D"
      issuedPermissions.0.target:
-        "0x9298413c781c241aF6F6733b7df00De5D4A42D93"
      issuedPermissions.0.to:
+        "0x9298413c781c241aF6F6733b7df00De5D4A42D93"
      issuedPermissions.0.description:
+        "Can submit transaction batches or commitments to the SequencerInbox contract on the host chain."
    }
```

```diff
    contract ERC20RollupEventInbox (0x6282197777e7c318C7209bd7059110886aa429C6) {
    +++ description: Helper contract sending configuration data over the bridge during the systems initialization.
      issuedPermissions.0.target:
-        "0xCff1ad9f09b32252171207e8525c90B18D4E2C7D"
      issuedPermissions.0.via.1.delay:
-        0
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0xCff1ad9f09b32252171207e8525c90B18D4E2C7D"
    }
```

```diff
    contract ERC20Bridge (0x7E31f112d340a4D0cB0e4bD82f2853089d1bF10C) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      issuedPermissions.0.target:
-        "0xCff1ad9f09b32252171207e8525c90B18D4E2C7D"
      issuedPermissions.0.via.1.delay:
-        0
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0xCff1ad9f09b32252171207e8525c90B18D4E2C7D"
    }
```

```diff
    contract RollupProxy (0x828C71bc1D7A34F32FfA624240633b6B7272C3D6) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      issuedPermissions.2.target:
-        "0xe9D1e89A73D7608a45F3cDb5a898dFd9E3A3Ba42"
      issuedPermissions.2.to:
+        "0xe9D1e89A73D7608a45F3cDb5a898dFd9E3A3Ba42"
      issuedPermissions.2.description:
+        "Can propose new state roots (called nodes) and challenge state roots on the host chain."
      issuedPermissions.1.target:
-        "0xCff1ad9f09b32252171207e8525c90B18D4E2C7D"
      issuedPermissions.1.via.0.delay:
-        0
      issuedPermissions.1.to:
+        "0xCff1ad9f09b32252171207e8525c90B18D4E2C7D"
      issuedPermissions.0.target:
-        "0xCff1ad9f09b32252171207e8525c90B18D4E2C7D"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.via.0.description:
-        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
      issuedPermissions.0.to:
+        "0xCff1ad9f09b32252171207e8525c90B18D4E2C7D"
      issuedPermissions.0.description:
+        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
    }
```

```diff
    contract UpgradeExecutor (0x8672705351C81f40B55b1ac2A1998de66166d0eA) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      issuedPermissions.0.target:
-        "0xCff1ad9f09b32252171207e8525c90B18D4E2C7D"
      issuedPermissions.0.via.1.delay:
-        0
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0xCff1ad9f09b32252171207e8525c90B18D4E2C7D"
      directlyReceivedPermissions.2.target:
-        "0x828C71bc1D7A34F32FfA624240633b6B7272C3D6"
      directlyReceivedPermissions.2.from:
+        "0x828C71bc1D7A34F32FfA624240633b6B7272C3D6"
      directlyReceivedPermissions.1.target:
-        "0x828C71bc1D7A34F32FfA624240633b6B7272C3D6"
      directlyReceivedPermissions.1.from:
+        "0x828C71bc1D7A34F32FfA624240633b6B7272C3D6"
      directlyReceivedPermissions.0.target:
-        "0xEE9924C5fd94601C80fF8010f577C9f7f3C20B84"
      directlyReceivedPermissions.0.from:
+        "0xEE9924C5fd94601C80fF8010f577C9f7f3C20B84"
    }
```

```diff
    contract ChallengeManager (0xBb309FFFC24F77927d7C4eb86BaA67D8f9dC0EB8) {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      issuedPermissions.0.target:
-        "0xCff1ad9f09b32252171207e8525c90B18D4E2C7D"
      issuedPermissions.0.via.1.delay:
-        0
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0xCff1ad9f09b32252171207e8525c90B18D4E2C7D"
    }
```

```diff
    contract CornMultisig (0xCff1ad9f09b32252171207e8525c90B18D4E2C7D) {
    +++ description: None
      receivedPermissions.8.target:
-        "0xBb309FFFC24F77927d7C4eb86BaA67D8f9dC0EB8"
      receivedPermissions.8.from:
+        "0xBb309FFFC24F77927d7C4eb86BaA67D8f9dC0EB8"
      receivedPermissions.7.target:
-        "0x8672705351C81f40B55b1ac2A1998de66166d0eA"
      receivedPermissions.7.from:
+        "0x8672705351C81f40B55b1ac2A1998de66166d0eA"
      receivedPermissions.6.target:
-        "0x828C71bc1D7A34F32FfA624240633b6B7272C3D6"
      receivedPermissions.6.from:
+        "0x828C71bc1D7A34F32FfA624240633b6B7272C3D6"
      receivedPermissions.5.target:
-        "0x7E31f112d340a4D0cB0e4bD82f2853089d1bF10C"
      receivedPermissions.5.from:
+        "0x7E31f112d340a4D0cB0e4bD82f2853089d1bF10C"
      receivedPermissions.4.target:
-        "0x6282197777e7c318C7209bd7059110886aa429C6"
      receivedPermissions.4.from:
+        "0x6282197777e7c318C7209bd7059110886aa429C6"
      receivedPermissions.3.target:
-        "0x4ad144ea249A98F77e0b78104D3B6eB6cd3a76DA"
      receivedPermissions.3.from:
+        "0x4ad144ea249A98F77e0b78104D3B6eB6cd3a76DA"
      receivedPermissions.2.target:
-        "0x37693F11f3D724E55D0B03D5F328D8202C913243"
      receivedPermissions.2.from:
+        "0x37693F11f3D724E55D0B03D5F328D8202C913243"
      receivedPermissions.1.target:
-        "0x2a3C554f212E3e0c78eaF0808f5313A10542dA2d"
      receivedPermissions.1.from:
+        "0x2a3C554f212E3e0c78eaF0808f5313A10542dA2d"
      receivedPermissions.0.target:
-        "0x828C71bc1D7A34F32FfA624240633b6B7272C3D6"
      receivedPermissions.0.from:
+        "0x828C71bc1D7A34F32FfA624240633b6B7272C3D6"
      directlyReceivedPermissions.0.target:
-        "0x8672705351C81f40B55b1ac2A1998de66166d0eA"
      directlyReceivedPermissions.0.from:
+        "0x8672705351C81f40B55b1ac2A1998de66166d0eA"
    }
```

```diff
    contract ProxyAdmin (0xEE9924C5fd94601C80fF8010f577C9f7f3C20B84) {
    +++ description: None
      directlyReceivedPermissions.6.target:
-        "0xBb309FFFC24F77927d7C4eb86BaA67D8f9dC0EB8"
      directlyReceivedPermissions.6.from:
+        "0xBb309FFFC24F77927d7C4eb86BaA67D8f9dC0EB8"
      directlyReceivedPermissions.5.target:
-        "0x8672705351C81f40B55b1ac2A1998de66166d0eA"
      directlyReceivedPermissions.5.from:
+        "0x8672705351C81f40B55b1ac2A1998de66166d0eA"
      directlyReceivedPermissions.4.target:
-        "0x7E31f112d340a4D0cB0e4bD82f2853089d1bF10C"
      directlyReceivedPermissions.4.from:
+        "0x7E31f112d340a4D0cB0e4bD82f2853089d1bF10C"
      directlyReceivedPermissions.3.target:
-        "0x6282197777e7c318C7209bd7059110886aa429C6"
      directlyReceivedPermissions.3.from:
+        "0x6282197777e7c318C7209bd7059110886aa429C6"
      directlyReceivedPermissions.2.target:
-        "0x4ad144ea249A98F77e0b78104D3B6eB6cd3a76DA"
      directlyReceivedPermissions.2.from:
+        "0x4ad144ea249A98F77e0b78104D3B6eB6cd3a76DA"
      directlyReceivedPermissions.1.target:
-        "0x37693F11f3D724E55D0B03D5F328D8202C913243"
      directlyReceivedPermissions.1.from:
+        "0x37693F11f3D724E55D0B03D5F328D8202C913243"
      directlyReceivedPermissions.0.target:
-        "0x2a3C554f212E3e0c78eaF0808f5313A10542dA2d"
      directlyReceivedPermissions.0.from:
+        "0x2a3C554f212E3e0c78eaF0808f5313A10542dA2d"
    }
```

Generated with discovered.json: 0x0bf4b7796c85f7f1c9e3aa37d977f8bd319452c5

# Diff at Fri, 17 Jan 2025 06:56:17 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@1d87738af0941aaf4af591699a4b95396cfa786d block: 21629156
- current block number: 21642560

## Description

Initial discovery: standard orbit stack optimium with known shapes except for a slightly modified bridge that supports custom gastokens.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21629156 (main branch discovery), not current.

```diff
-   Status: DELETED
    contract EndpointV2 (0x1a44076050125825900e736c501f859c50fE728c)
    +++ description: None
```

```diff
-   Status: DELETED
    contract  (0x1ccBf0db9C192d969de57E25B3fF09A25bb1D862)
    +++ description: None
```

```diff
-   Status: DELETED
    contract Bitcorn (0x386E7A3a0c0919c9d53c3b04FF67E73Ff9e45Fb6)
    +++ description: None
```

```diff
-   Status: DELETED
    contract Treasury (0x5ebB3f2feaA15271101a927869B3A56837e73056)
    +++ description: None
```

```diff
-   Status: DELETED
    contract ReadLib1002 (0x74F55Bc2a79A27A0bF1D1A35dB5d0Fc36b9FDB9D)
    +++ description: None
```

```diff
-   Status: DELETED
    contract SendUln302 (0xbB2Ea70C9E858123480642Cf96acbcCE1372dCe1)
    +++ description: None
```

```diff
-   Status: DELETED
    contract ReceiveUln302 (0xc02Ab410f0734EFa3F14628780e6e695156024C2)
    +++ description: None
```

```diff
-   Status: DELETED
    contract GnosisSafe (0xCDa8e3ADD00c95E5035617F970096118Ca2F4C92)
    +++ description: None
```

```diff
    contract CornMultisig (0xCff1ad9f09b32252171207e8525c90B18D4E2C7D) {
    +++ description: None
      name:
-        "Safe"
+        "CornMultisig"
      receivedPermissions:
+        [{"permission":"configure","target":"0x828C71bc1D7A34F32FfA624240633b6B7272C3D6","description":"Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes.","via":[{"address":"0x8672705351C81f40B55b1ac2A1998de66166d0eA"}]},{"permission":"upgrade","target":"0x2a3C554f212E3e0c78eaF0808f5313A10542dA2d","via":[{"address":"0xEE9924C5fd94601C80fF8010f577C9f7f3C20B84"},{"address":"0x8672705351C81f40B55b1ac2A1998de66166d0eA"}]},{"permission":"upgrade","target":"0x37693F11f3D724E55D0B03D5F328D8202C913243","via":[{"address":"0xEE9924C5fd94601C80fF8010f577C9f7f3C20B84"},{"address":"0x8672705351C81f40B55b1ac2A1998de66166d0eA"}]},{"permission":"upgrade","target":"0x4ad144ea249A98F77e0b78104D3B6eB6cd3a76DA","via":[{"address":"0xEE9924C5fd94601C80fF8010f577C9f7f3C20B84"},{"address":"0x8672705351C81f40B55b1ac2A1998de66166d0eA"}]},{"permission":"upgrade","target":"0x6282197777e7c318C7209bd7059110886aa429C6","via":[{"address":"0xEE9924C5fd94601C80fF8010f577C9f7f3C20B84"},{"address":"0x8672705351C81f40B55b1ac2A1998de66166d0eA"}]},{"permission":"upgrade","target":"0x7E31f112d340a4D0cB0e4bD82f2853089d1bF10C","via":[{"address":"0xEE9924C5fd94601C80fF8010f577C9f7f3C20B84"},{"address":"0x8672705351C81f40B55b1ac2A1998de66166d0eA"}]},{"permission":"upgrade","target":"0x828C71bc1D7A34F32FfA624240633b6B7272C3D6","via":[{"address":"0x8672705351C81f40B55b1ac2A1998de66166d0eA"}]},{"permission":"upgrade","target":"0x8672705351C81f40B55b1ac2A1998de66166d0eA","via":[{"address":"0xEE9924C5fd94601C80fF8010f577C9f7f3C20B84"},{"address":"0x8672705351C81f40B55b1ac2A1998de66166d0eA"}]},{"permission":"upgrade","target":"0xBb309FFFC24F77927d7C4eb86BaA67D8f9dC0EB8","via":[{"address":"0xEE9924C5fd94601C80fF8010f577C9f7f3C20B84"},{"address":"0x8672705351C81f40B55b1ac2A1998de66166d0eA"}]}]
      directlyReceivedPermissions:
+        [{"permission":"act","target":"0x8672705351C81f40B55b1ac2A1998de66166d0eA"}]
    }
```

```diff
+   Status: CREATED
    contract OneStepProverMath (0x036147913eEb42E97790F9a693246c8444290AB6)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract OneStepProverMemory (0x21c6F81b1063f09A6c26EDc74fBb9beb349A5E96)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract OneStepProverHostIo (0x231173CC90cB8486A7dbD1733B5105254316D50A)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract ERC20Outbox (0x2a3C554f212E3e0c78eaF0808f5313A10542dA2d)
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
```

```diff
+   Status: CREATED
    contract ERC20Inbox (0x37693F11f3D724E55D0B03D5F328D8202C913243)
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
```

```diff
+   Status: CREATED
    contract SequencerInbox (0x4ad144ea249A98F77e0b78104D3B6eB6cd3a76DA)
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
```

```diff
+   Status: CREATED
    contract ERC20RollupEventInbox (0x6282197777e7c318C7209bd7059110886aa429C6)
    +++ description: Helper contract sending configuration data over the bridge during the systems initialization.
```

```diff
+   Status: CREATED
    contract OneStepProver0 (0x72b55c2C38EadE57C10047746632A369A060A46E)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract ERC20Bridge (0x7E31f112d340a4D0cB0e4bD82f2853089d1bF10C)
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
```

```diff
+   Status: CREATED
    contract RollupProxy (0x828C71bc1D7A34F32FfA624240633b6B7272C3D6)
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
```

```diff
+   Status: CREATED
    contract ValidatorUtils (0x84eA2523b271029FFAeB58fc6E6F1435a280db44)
    +++ description: This contract implements view only utilities for validators.
```

```diff
+   Status: CREATED
    contract UpgradeExecutor (0x8672705351C81f40B55b1ac2A1998de66166d0eA)
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
```

```diff
+   Status: CREATED
    contract OneStepProofEntry (0x9f403f2054736884518E6D3f510C02f5959BDCC6)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract ChallengeManager (0xBb309FFFC24F77927d7C4eb86BaA67D8f9dC0EB8)
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0xEE9924C5fd94601C80fF8010f577C9f7f3C20B84)
    +++ description: None
```

Generated with discovered.json: 0x539edf4d8f84184928279511f53706754239dfe1

# Diff at Thu, 09 Jan 2025 10:59:48 GMT:

- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- current block number: 21586482

## Description

Provide description of changes. This section will be preserved.

## Initial discovery

```diff
+   Status: CREATED
    contract wBTC Escrow (0x00943b11764176C3a8323aEFCBd6fE70CFb6272d)
    +++ description: None
```

```diff
+   Status: CREATED
    contract EndpointV2 (0x1a44076050125825900e736c501f859c50fE728c)
    +++ description: None
```

```diff
+   Status: CREATED
    contract  (0x1ccBf0db9C192d969de57E25B3fF09A25bb1D862)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Bitcorn (0x386E7A3a0c0919c9d53c3b04FF67E73Ff9e45Fb6)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Governor (0x515C7d8Fcb950f8b030ac08C994b37b4b8F3F7B5)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Treasury (0x5ebB3f2feaA15271101a927869B3A56837e73056)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ReadLib1002 (0x74F55Bc2a79A27A0bF1D1A35dB5d0Fc36b9FDB9D)
    +++ description: None
```

```diff
+   Status: CREATED
    contract cbBTC Escrow (0x957C9DC25DE6B8E46a7Fa0D081bA749DD005B54f)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SendUln302 (0xbB2Ea70C9E858123480642Cf96acbcCE1372dCe1)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ReceiveUln302 (0xc02Ab410f0734EFa3F14628780e6e695156024C2)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafe (0xCDa8e3ADD00c95E5035617F970096118Ca2F4C92)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Safe (0xCff1ad9f09b32252171207e8525c90B18D4E2C7D)
    +++ description: None
```
