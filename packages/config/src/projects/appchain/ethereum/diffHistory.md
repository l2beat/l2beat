Generated with discovered.json: 0x2a128735869962a79d9bce23469f6bf1f5b0f7dc

# Diff at Tue, 03 Jun 2025 07:13:50 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- current block number: 22622481

## Description

intial discovery of an orbit stack chain with espresso sequencing and anytrust DA.

## Initial discovery

```diff
+   Status: CREATED
    contract Inbox (0x010aDE5d8F9DC340531140802438798C189c36E0)
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
```

```diff
+   Status: CREATED
    contract Outbox (0x190C720892d0786BF75B77B4acD21c726ea8FDEd)
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
```

```diff
+   Status: CREATED
    contract Bridge (0x19df42E085e2c3fC4497172E412057F54D9f013E)
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
```

```diff
+   Status: CREATED
    contract RollupEventInbox (0x269F6f6FC8177a5A8c475AE0e2487508634EC8Ed)
    +++ description: Helper contract sending configuration data over the bridge during the systems initialization.
```

```diff
+   Status: CREATED
    contract RollupProxy (0x28293c7855797B0441000EF144119727f3cBCA9B)
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
```

```diff
+   Status: CREATED
    contract Caldera Multisig 3 (0x2bf43034b9559643e986A2fE3cE015a18247b904)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProofEntry (0x5F8FE936F629AF71e7af6C7844692f98019d6163)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract EspressoTEEVerifier (0x64189bd57B1b281C9EC3f5295B75797ddcB1572c)
    +++ description: The Espresso TEE verifier is used by the SequencerInbox contract to verify the batch attestations signed by the TEE.
```

```diff
+   Status: CREATED
    contract UpgradeExecutor (0x7c4e8195FB560D1557C52f051dCdA4724a2894b3)
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
```

```diff
+   Status: CREATED
    contract SequencerInbox (0x8045B2aa6b823CbA8f99ef3D3404F711619d3473)
    +++ description: The Espresso TEE sequencer (registered in this contract) can submit transaction batches or commitments here.
```

```diff
+   Status: CREATED
    contract ValidatorUtils (0xA79305c7D5Ad6F8AF0292c863957a2488F13f0d1)
    +++ description: This contract implements view only utilities for validators.
```

```diff
+   Status: CREATED
    contract ChallengeManager (0xB9B007aE55B81dd1498Bc500a54ad9Ae53234c9C)
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
```

```diff
+   Status: CREATED
    contract OneStepProverHostIo (0xd79fd59b73c814D9607aB93C4A1aDCea06F91692)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0xF025D25aE360D0D33a275dF74863CCc6600E6f8E)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProverMemory (0xf6a307A5868eB9c4a00F5efbD1EF8462AC63783f)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract OneStepProverMath (0xFe53F58bAd7B83B01C47CC86471507911263ac91)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract OneStepProver0 (0xFe95b1f7cf7D7D14E9e38dEE0EFE1c9D3AaA3e69)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```
