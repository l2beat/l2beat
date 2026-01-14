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
