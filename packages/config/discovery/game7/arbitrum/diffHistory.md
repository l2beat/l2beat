Generated with discovered.json: 0xae3a035e9bdda66f4c90fd8ef985eaaa18d36f69

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
