Generated with discovered.json: 0x559fb671bc7d281ff267dd97b4968edd6835ec80

# Diff at Fri, 08 Nov 2024 11:02:40 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- current block number: 272297655

## Description

Initial discovery of a standard Orbit stack Optimium with 3/3 DAC and 3/3 fastconfirmer MS.

## Initial discovery

```diff
+   Status: CREATED
    contract OneStepProofEntry (0x0BEfa8F5F1e3bf8e02d874375A43EA75AeD9CD39)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract OneStepProver0 (0x0Ecfe9f90a06F74935f751077E24C2057B7C9a2f)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract ERC20Outbox (0x12c0163237819Eb81c469F71Ea0672e3e8dbF6dB)
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
```

```diff
+   Status: CREATED
    contract SequencerInbox (0x1e751242C9CE10E165969EeD91E5D98587904aad)
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
```

```diff
+   Status: CREATED
    contract OneStepProverHostIo (0x3537Ab400c0275c93569d2c505ADb72804985393)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract ERC20Inbox (0x46B6462301182B393ac5f014779687d3B6d4FB57)
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
```

```diff
+   Status: CREATED
    contract BlessnetFastconfirmerMultisig (0x571D6CA61B979A967E055696c822CF8C928d3556)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ERC20RollupEventInbox (0x67B01721383baedF4b27B745bf533F6F7bDc4AE4)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ChallengeManager (0x6f857Cfcb32951cE5A6fAD7B809af8Bcbc3d551A)
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
```

```diff
+   Status: CREATED
    contract Caldera Multisig (0x6FD149B3d41fd860B9Da1A6fE54e902eF41F68BF)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProverMemory (0x8711CA24591aEF3bEEC3A9cB9CE41939822366f3)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract ValidatorUtils (0x9A3464863213C218D7cb7BaA6e69C0461E0Cbc08)
    +++ description: None
```

```diff
+   Status: CREATED
    contract UpgradeExecutor (0xa5e62aAC82Af6dA4Fd23ca5219132a7D941B4fe3)
    +++ description: Central contract defining the access control for upgrading the system contract implementations.
```

```diff
+   Status: CREATED
    contract OneStepProverMath (0xbBe221554441F1d2d5A963A67789ce5893dCf451)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract ERC20Bridge (0xC1bf6E0Ac80e92A331c4D448652C4824D4195459)
    +++ description: Escrow contract for the project's gas token (Can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0xf201805BD417f9E0d229A0C379c3e5B91bf18A8b)
    +++ description: None
```

```diff
+   Status: CREATED
    contract RollupProxy (0xF9327276c0E0d255543C095AC6D243B555e645D9)
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
```
