Generated with discovered.json: 0x71bffce3175d995625470967e40322c81f4d02b7

# Diff at Thu, 31 Jul 2025 06:56:30 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- current timestamp: 1753944812

## Description

Initial gateway L2 disco. Era fully uses L1 governance via l2 aliases.

## Initial discovery

```diff
+   Status: CREATED
    contract L1Messenger (0x0000000000000000000000000000000000008008)
    +++ description: System contract implementing public L2->L1 messaging functionality. Part of the canonical bridge.
```

```diff
+   Status: CREATED
    contract Bridgehub (0x0000000000000000000000000000000000010002)
    +++ description: The main registry (hub) for all the contracts in the ZK stack cluster and central entrypoint for bridge transactions. Stores important mappings like from chainId to diamond address, from chainId to parent CTM, from chainId to base token etc. A clone of Bridgehub is also deployed on each L2 chain, but this clone is only used on settlement layers.
```

```diff
+   Status: CREATED
    contract L2AssetRouter (0x0000000000000000000000000000000000010003)
    +++ description: Bridge routing contract that exists once on every zk stack chain and keeps mappings of assets to their escrows (asset handlers) and deployment trackers.
```

```diff
+   Status: CREATED
    contract MessageRoot (0x0000000000000000000000000000000000010005)
    +++ description: Aggregates remote bridge message roots from all ZK stack chains. To be used with the Gateway when deployed.
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x0A8a176B6F5962122C6E8F8815278f873D74021f)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1GenesisUpgrade (0x540E6ED9FC06dFCbf0a38Dcc7Ed7Ea3F56C551de)
    +++ description: Diamond implementation code to initialize new ZK chains. Used to set their chainID.
```

```diff
+   Status: CREATED
    contract RelayedSLDAValidator (0x595b8C88B9e5f3a4c596C3e81BE6e11D53Bb9200)
    +++ description: Plugs into the DAValidator interface of zk stack Diamond contracts. This 'DA validator' simply checks correct formatting and encoding of data and relays it via the L1Messenger to L1 to guarantee data availability.
```

```diff
+   Status: CREATED
    contract L1VerifierFflonk (0x63825fc80a4B8d96EE99d37E958a3A5B01b995D9)
    +++ description: Verifies a zk-SNARK proof using an implementation of the fflonk proof system.
```

```diff
+   Status: CREATED
    contract ServerNotifier (0x796b7bDba8B8027Aa79BE96a0D5368FB86df560a)
    +++ description: A simple contract that can be called by the ChainAdmin to emit notifications about chain migrations.
```

```diff
+   Status: CREATED
    contract ChainTypeManager (0x912B84EEEEBeca74d307b9a2b09c68332aa5426C)
    +++ description: Defines L2 diamond contract versions, creation and upgrade data and the proof system for all ZK stack chains connected to it. ZK chains are children of this central contract and can only upgrade to versions that were previously registered here. The current protocol version is 0,28,0.
```

```diff
+   Status: CREATED
    contract DualVerifier (0xA7F2EDAcDcc54a9c711639eEe9d0b27C96F0F3B6)
    +++ description: A router contract for verifiers. Routes verification requests to gateway:0x63825fc80a4B8d96EE99d37E958a3A5B01b995D9 or gateway:0xb742F4d52F6A5e98F11EAc60A7f75Acee534B831 depending on the supplied proof type.
```

```diff
+   Status: CREATED
    contract L1VerifierPlonk (0xb742F4d52F6A5e98F11EAc60A7f75Acee534B831)
    +++ description: Verifies a zk-SNARK proof using an implementation of the PlonK proof system.
```

```diff
+   Status: CREATED
    contract ValidatorTimelock (0xb83fdD24F40cb2AA5CC9c2A2A0c06E50fA9B4CEa)
    +++ description: Intermediary contract between the *Validators* and the central diamond contract that delays block execution (ie withdrawals and other L2 --> L1 messages) by 0s.
```

```diff
+   Status: CREATED
    contract DiamondProxy (0xCE7CBd23193d029410b40e0fD8a79a5121f9250C)
    +++ description: The main contract defining the Layer 2. Operator actions like commiting blocks, providing ZK proofs and executing batches ultimately target this contract which then processes transactions. During batch execution it processes L1 --> L2 and L2 --> L1 transactions. isPermanentRollup was set to true in this contract which prevents changing the DA mode to Validium in the future.
```
