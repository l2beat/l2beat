Generated with discovered.json: 0xcf9cec7dd3044473c2a2b09a5cd5bc957f7b83e3

# Diff at Fri, 24 Jan 2025 10:54:43 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- current block number: 25463362

## Description

Initial discovery: standard v32 AnyTrust (with fastconfirmer) orbit stack with custom gasToken GHST.

## Initial discovery

```diff
+   Status: CREATED
    contract OneStepProver0 (0x109b5d31a5D431B856Ae30E121A1e04302bA9872)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract GnosisSafeL2 (0x327b96a94763c50D5EC56D79a0324f5eb9527306)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ERC20Inbox (0x32AB85A3F0C702EbE74f73C5934b7Fb8452B492f)
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
```

```diff
+   Status: CREATED
    contract SequencerInbox (0x400f7c5DaC37aAEe3cE007e43Db54424414743f5)
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
```

```diff
+   Status: CREATED
    contract OneStepProverHostIo (0x55c6253DB419EDaE4A3d86e44064a4A5f1422751)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract RollupProxy (0x58E3fe88b1E8a7e2D578000aCD9C6d5989FE9e09)
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
```

```diff
+   Status: CREATED
    contract OneStepProverMemory (0x696FC111c7a3E31951426660a0B1da9396056a29)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract ERC20RollupEventInbox (0x6D67FD4af128eAb051EE8976e6aa65664A4806EE)
    +++ description: Helper contract sending configuration data over the bridge during the systems initialization.
```

```diff
+   Status: CREATED
    contract ERC20Outbox (0x7cF0a5D0211AC30365bA8C1cB8CFD4caF64b2D60)
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
```

```diff
+   Status: CREATED
    contract AlchemyMultisig2 (0x871e290d5447b958131F6d44f915F10032436ee6)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ChallengeManager (0x92BD2232110BEd46f1d65f1FA0916f52443DFCa3)
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
```

```diff
+   Status: CREATED
    contract OneStepProofEntry (0x9464dC1403b83432e573f4ff20ba4aF58De59226)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract UpgradeExecutor (0x95E613a501a0AaB5a1C5Cbe682B29d4d300EAc3B)
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
```

```diff
+   Status: CREATED
    contract ERC20Bridge (0x9F904Fea0efF79708B37B99960e05900fE310A8E)
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
```

```diff
+   Status: CREATED
    contract ValidatorUtils (0xa51F58cdE1955754329E071626C7e74d860C0406)
    +++ description: This contract implements view only utilities for validators.
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0xaDD83738fd8a1cdCccab49e761F36ED1C93805FD)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProverMath (0xbB13eB1C56cf1408f657c6f3d56eFf188665B896)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```
