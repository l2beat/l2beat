Generated with discovered.json: 0x16eb291919904e3566773a7272c25e8097bdd2ae

# Diff at Fri, 19 Dec 2025 12:06:56 GMT:

- author: Sergey Shemyakov (<sergey.shemyakov@l2beat.com>)
- current timestamp: 1766054776

## Description

Initial disco for ADI chain. Diff from zksync2:

- BridgeHub: no serious changes (https://disco.l2beat.com/diff/eth:0xc89423b4909080fB8F8A43dF5E1C27001e55C24B/eth:0xcf1c73439c85f7eB9d4439dAf398Fd6392d176E6)
- L1MessageRoot: no serious changes (https://disco.l2beat.com/diff/eth:0x669ed5BB1377C917333e7d4223ce3419EE4099fD/eth:0x5BaC331B75f3bF88148bfb0be2a76be4FBb05417)
- L1ChainAssetHandler: no serious changes (https://disco.l2beat.com/diff/eth:0xaa180C70126f751C164465638770B865965A744B/eth:0x0C06695f21B118a9A10101D303f00575A566D1A0)
- L1NativeTokenVault: no serious changes (https://disco.l2beat.com/diff/eth:0x8E1C5A8c5d8C33ed0eC756d6f4006f2D875bA083/eth:0x2FC2a2dB562046C732d3aB0f4e1c1F62C3eE8e3E)
- L1AssetRouter: no serious changes (https://disco.l2beat.com/diff/eth:0x2386Bc2E26f39b72f0D4FDE0c07D68e4eEFfC725/eth:0x47eec6F57c7E84391Ba6C9Ac976537d0DB0bb257)
- L1GenesisUpgrade: minor changes due to adding zksync OS (https://disco.l2beat.com/diff/eth:0x390bc10e854e137d2625573272b3fEe2C615eBA4/eth:0x5C9B360aB320a23692c9E81006ddB15de991ab65)
- ServerNotifier: added tracking of scheduled protocol upgrade timestamps (https://disco.l2beat.com/diff/eth:0x555D040F4A089D1dF14B372a87C5aF8FA37BDB7A/eth:0xDc64B98F394A8bf980F777631352029C9114e2e6)
- ValidatorTimelock: cosmetic diff (https://disco.l2beat.com/diff/eth:0x6086051f93412F550C0820e76f0fbE85F64C7ef8/eth:0x406f329645E323B1bd1C020a219e30E6DAf4f899)
- ChainTypeManager: removed one minor genesis state check (https://disco.l2beat.com/diff/eth:0x4aB7204e4205c96C32E23ADa9191720976dC084f/eth:0x191D1D51a9CBe988E69ad3D27eFab60663e5ed61)
- Diamond proxy: cleaned up errors (https://disco.l2beat.com/diff/eth:0x32400084C286CF3E17e7B677ea9583e60a000324/eth:0x0583Ef2B6416cb7B287406438B940E4d99680C5B)
- Admin, Getters facets: added zksync OS flag and two new tx types: priority and upgrade (https://disco.l2beat.com/diff/eth:0x37CefD5b44c131FEf27e9Bc542e5B77A177A7253/eth:0x8C653b99f18Eb3bAb927519990bfC281500b0De6, https://disco.l2beat.com/diff/eth:0x1666124221622eb6154306Ea9BA87043e8be88B2/eth:0x1807f10E686E5Cd6A655cF7343f093a7372cAf34)
- Mailbox facet: modified minimal trx gas computation for zksyncOS (https://disco.l2beat.com/diff/eth:0x1e34aB39a9682149165ddeCc0583d238A5448B45/eth:0x3Be4B380F277Cb02dF56712667f7F8FA1Ca1536d)
- Executor facet: added logic to commit batches with zksyncOS (https://disco.l2beat.com/diff/eth:0x0597CaA8A823A699d7CD9E62B5E5d4153FF82691/eth:0x6fB87A1dd4DE3bDbB96f2FA9ac7FCb74b7d4C792)
- DualVerifier: added owner to add and remove plonk and fflonk verifiers with different versions (https://disco.l2beat.com/diff/eth:0x4d335C5C08FEc91a39965351AbB6E315ad2e9ff3/eth:0x28E31e2B74bc38c6cd58CF282807fCBa8C00C529)

Has Governance contract that is set as owner for many contracts, allows transparent and shadow proposals.

## Initial discovery

```diff
+   Status: CREATED
    contract Diamond (eth:0x0583Ef2B6416cb7B287406438B940E4d99680C5B)
    +++ description: The main contract defining the Layer 2. Operator actions like commiting blocks, providing ZK proofs and executing batches ultimately target this contract which then processes transactions. During batch execution it processes L1 --> L2 and L2 --> L1 transactions.
```

```diff
+   Status: CREATED
    contract ChainTypeManager (eth:0x08A1D2962fC29AA46e869A1E7561112cc1026EfA)
    +++ description: Defines L2 diamond contract versions, creation and upgrade data and the proof system for all ZK stack chains connected to it. ZK chains are children of this central contract and can only upgrade to versions that were previously registered here. The current protocol version is 0,29,0.
```

```diff
+   Status: CREATED
    contract L1NativeTokenVault (eth:0x0A0F8912162Ff83A036883dbaDA42efF647a3065)
    +++ description: Canonical central asset escrow for all ZK stack chains.
```

```diff
+   Status: CREATED
    contract ChainAdminOwnable (eth:0x0a8a2473cc5731575a94f58F470851Bc6695B5B8)
    +++ description: A governance proxy that lets eth:0xF50293Ac52f987122DcD67Eda0cFb34E9d7a0Cf9 act through it.
```

```diff
+   Status: CREATED
    contract DualVerifier (eth:0x28E31e2B74bc38c6cd58CF282807fCBa8C00C529)
    +++ description: A router contract for verifiers. Routes verification requests to the corresponding fflonk or plonk verifiers depending on the supplied proof type and version.
```

```diff
+   Status: CREATED
    contract ChainAdminOwnable (eth:0x2d6E82F1f8fba89a67cc8d742B12633db4732Ca7)
    +++ description: A governance proxy that lets eth:0xB272B188855128c10a933Edb62CC64c22B1f3754 act through it.
```

```diff
+   Status: CREATED
    contract ProxyAdmin (eth:0x34f56Ba641aC59E897c6179ffeCAe9769fbfC90C)
    +++ description: None
```

```diff
+   Status: CREATED
    contract RollupL1DAValidator (eth:0x45D594304087A359dC60a502f5c35d62DfeCDDA7)
    +++ description: Contract that verifies the data availability of ethereum calldata and blobs. Can be used by ZK stack rollups as the L1 part of a DAValidator pair.
```

```diff
+   Status: CREATED
    contract L1GenesisUpgrade (eth:0x5C9B360aB320a23692c9E81006ddB15de991ab65)
    +++ description: Diamond implementation code to initialize new ZK chains. Used to set their chainID.
```

```diff
+   Status: CREATED
    contract L1Nullifier (eth:0x5E5a72077dFB354Dfe61200b8f31fa491F9B9Cea)
    +++ description: Contract responsible for bookkeeping L1 bridging transactions. Used to finalize withdrawals and reclaim failed deposits. Does not escrow funds.
```

```diff
+   Status: CREATED
    contract L1VerifierFflonk (eth:0x60aDfa0b7dEd57e0f1e251417769B6dbd1056208)
    +++ description: Verifies a zk-SNARK proof using an implementation of the fflonk proof system.
```

```diff
+   Status: CREATED
    contract L1MessageRoot (eth:0x783e8Cb57366888F84d815fd53c3aeE99b2d6d37)
    +++ description: Aggregates remote bridge message roots from all ZK stack chains. To be used with the Gateway when deployed.
```

```diff
+   Status: CREATED
    contract BridgeHub (eth:0x7a38c18a229Ef8a0AE7104Ba272A46280f2d59Cb)
    +++ description: The main registry (hub) for all the contracts in the ZK stack cluster and central entrypoint for bridge transactions. Stores important mappings like from chainId to diamond address, from chainId to parent CTM, from chainId to base token etc. A clone of Bridgehub is also deployed on each L2 chain, but this clone is only used on settlement layers.
```

```diff
+   Status: CREATED
    contract ProxyAdmin (eth:0x8140aBB60c9AfB5241D90af948Cfa7644b2D3217)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Governance (eth:0x8253F33026c49A430963FE3991441c02175bda95)
    +++ description: Allows scheduling transparent and shadow proposals, has security council with instant execution.
```

```diff
+   Status: CREATED
    contract L1VerifierPlonk (eth:0x8F870CF6621AEaF6026dFfc77f484FdAb370c4Ba)
    +++ description: Verifies a zk-SNARK proof using an implementation of the PlonK proof system.
```

```diff
+   Status: CREATED
    contract L1ChainAssetHandler (eth:0x924E0145347243a94C5C69e372Ca52c77f8e6CF1)
    +++ description: Specialized contract for managing chain assets, i.e. chain migrations.
```

```diff
+   Status: CREATED
    contract RollupDAManager (eth:0x96A4B3Dd2F3cd3717b7D0c9d1aF8e110CAaD787e)
    +++ description: Simple registry for allowed DA address pairs for the 'rollup' data availability mode (can be permanently enforced with isPermanentRollup=true). Rollup DA address pairs (especially the L1 part) usually point to contracts that validate if data was made available on Ethereum.
```

```diff
+   Status: CREATED
    contract CTMDeploymentTracker (eth:0xaCD4a320f8a45abE71756B85DF519201d041EA5f)
    +++ description: Asset deployment tracker where the 'asset' is a ChainTypeManager. The registering of asset IDs for ChainTypeManagers is necessary to be able to migrate them to a given settlement layer, for example the Gateway.
```

```diff
+   Status: CREATED
    contract Safe (eth:0xB272B188855128c10a933Edb62CC64c22B1f3754)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ServerNotifier (eth:0xd477bd7f14F9A26ebd51827EFB1d40a41f71b70C)
    +++ description: A simple contract that can be called by the ChainAdmin to emit notifications about chain migrations.
```

```diff
+   Status: CREATED
    contract ValidatorTimelock (eth:0xE28cAc160C2a79dFA1fbd2169AC5fa5d061cf186)
    +++ description: Intermediary contract between the *Validators* and the central diamond contract that delays block execution (ie withdrawals and other L2 --> L1 messages) by 0s.
```

```diff
+   Status: CREATED
    contract L1AssetRouter (eth:0xf25227EFAD2046d19777A4CA540b5C016Df7fe7A)
    +++ description: Part of the v26 upgrade: Canonical central asset router for all ZK stack chains (not escrowing funds).
```

```diff
+   Status: CREATED
    contract Safe (eth:0xF50293Ac52f987122DcD67Eda0cFb34E9d7a0Cf9)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1ERC20Bridge (eth:0xfA8B5EA9b8d36a72Eb0ba66Cc7aBc83d9deeC3B8)
    +++ description: Legacy bridge for depositing ERC20 tokens to ADI Chain.
```
