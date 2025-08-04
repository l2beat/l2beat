Generated with discovered.json: 0x256e022712121ea0fee87c8885ab1f395c679735

# Diff at Sat, 02 Aug 2025 07:32:34 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@3d59e2b466fd3c111ff4d5621a7f80de65b0b3d5 block: 1753972594
- current timestamp: 1754118945

## Description

Emergency upgrade to [protocol version v28.1](https://app.blocksec.com/explorer/tx/eth/0x3c27a371dbd4f6b0d97a87f950065eb48db3c51ae4e962d1b6b4d4e32d2fbdb1), which only affects the verifiers and is only activated for zksync era and gateway so far.

diff fflonk: https://disco.l2beat.com/diff/eth:0xD5dBE903F5382B052317D326FA1a7B63710C6a5b/eth:0x1AC4F629Fdc77A7700B68d03bF8D1A53f2210911
diff plonk: https://disco.l2beat.com/diff/eth:0x5BAfEF6729228add8775aF4Cecd2E68a51424Ee1/eth:0x2db2ffdecb7446aaab01FAc3f4D55863db3C5bd6

## Watched changes

```diff
    contract MessageRoot (0x0000000000000000000000000000000000010005) {
    +++ description: Aggregates remote bridge message roots from all ZK stack chains. To be used with the Gateway when deployed.
      values.getAggregatedRoot:
-        "0x1efdc979c76a9e2208d0c0e633ddc43a7a675bbf6051a0e20fbc58aa8a716444"
+        "0x65bc8ad8b41eccd5def25a01cde8e9bb99f19519cdcb3872f67da5cfba44b87b"
    }
```

```diff
    EOA  (0x30066439887C0a509Cb38E45c9262E6924a29BbD) {
    +++ description: None
      receivedPermissions.1:
+        {"permission":"validateZkStack","from":"gateway:0xb83fdD24F40cb2AA5CC9c2A2A0c06E50fA9B4CEa","role":".validatorsVTL"}
    }
```

```diff
-   Status: DELETED
    contract L1VerifierFflonk (0x63825fc80a4B8d96EE99d37E958a3A5B01b995D9)
    +++ description: Verifies a zk-SNARK proof using an implementation of the fflonk proof system.
```

```diff
    contract ChainTypeManager (0x912B84EEEEBeca74d307b9a2b09c68332aa5426C) {
    +++ description: Defines L2 diamond contract versions, creation and upgrade data and the proof system for all ZK stack chains connected to it. ZK chains are children of this central contract and can only upgrade to versions that were previously registered here. The current protocol version is 0,28,1.
      description:
-        "Defines L2 diamond contract versions, creation and upgrade data and the proof system for all ZK stack chains connected to it. ZK chains are children of this central contract and can only upgrade to versions that were previously registered here. The current protocol version is 0,28,0."
+        "Defines L2 diamond contract versions, creation and upgrade data and the proof system for all ZK stack chains connected to it. ZK chains are children of this central contract and can only upgrade to versions that were previously registered here. The current protocol version is 0,28,1."
      values.getSemverProtocolVersion.2:
-        0
+        1
      values.initialCutHash:
-        "0x1d2a4ca6403b6266f7ba6b838d98e1e98f8eb4ae81e496b888d71011fb89870e"
+        "0xd3891c3aee249d0a86bba7198ac35ffc02c7e54e8db6fdd3bd5ae43ea8cd5d06"
      values.protocolVersion:
-        120259084288
+        120259084289
    }
```

```diff
-   Status: DELETED
    contract DualVerifier (0xA7F2EDAcDcc54a9c711639eEe9d0b27C96F0F3B6)
    +++ description: A router contract for verifiers. Routes verification requests to gateway:0x63825fc80a4B8d96EE99d37E958a3A5B01b995D9 or gateway:0xb742F4d52F6A5e98F11EAc60A7f75Acee534B831 depending on the supplied proof type.
```

```diff
-   Status: DELETED
    contract L1VerifierPlonk (0xb742F4d52F6A5e98F11EAc60A7f75Acee534B831)
    +++ description: Verifies a zk-SNARK proof using an implementation of the PlonK proof system.
```

```diff
    contract ZKsyncValidatorTimelock (0xb83fdD24F40cb2AA5CC9c2A2A0c06E50fA9B4CEa) {
    +++ description: Intermediary contract between the *Validators* and the central diamond contract that delays block execution (ie withdrawals and other L2 --> L1 messages) by 0s.
      values.validatorsVTL.1:
+        "gateway:0x30066439887C0a509Cb38E45c9262E6924a29BbD"
    }
```

```diff
    contract DiamondProxy (0xCE7CBd23193d029410b40e0fD8a79a5121f9250C) {
    +++ description: The main contract defining the Layer 2. Operator actions like commiting blocks, providing ZK proofs and executing batches ultimately target this contract which then processes transactions. During batch execution it processes L1 --> L2 and L2 --> L1 transactions. isPermanentRollup was set to true in this contract which prevents changing the DA mode to Validium in the future.
      values.$pastUpgrades.1:
+        ["2025-08-01T23:57:13.000Z","0x317f561c5cc2944ec00a48e69c538f79bb6f519f8cbdea88005f484cfdd8daa0",["gateway:0xa365401Dc76d077c702965ECc39CfbfE436A6167","gateway:0xEE7f08400FDa3A46D32Ae78eBEC2D3841CeC53b7","gateway:0x7f124F72fB4f978798ffdedAD3332b0ce750F399","gateway:0x4659780be9E0863eFB2BAE5DD77E31e371f2d3C8"]]
      values.$upgradeCount:
-        1
+        2
+++ description: Protocol version, increments with each protocol upgrade.
+++ severity: HIGH
      values.getProtocolVersion:
-        120259084288
+        120259084289
      values.getSemverProtocolVersion.2:
-        0
+        1
      values.getVerifier:
-        "gateway:0xA7F2EDAcDcc54a9c711639eEe9d0b27C96F0F3B6"
+        "gateway:0xE841B98E524D827bBA664d19CB736C817707E730"
    }
```

```diff
+   Status: CREATED
    contract L1VerifierFflonk (0x3CFB3a80Af42cBE4d82C14301690A62D53e870a5)
    +++ description: Verifies a zk-SNARK proof using an implementation of the fflonk proof system.
```

```diff
+   Status: CREATED
    contract L1VerifierPlonk (0x92A9Fd0E84354213D9c3d33128eDd6Ea55ee0717)
    +++ description: Verifies a zk-SNARK proof using an implementation of the PlonK proof system.
```

```diff
+   Status: CREATED
    contract DualVerifier (0xE841B98E524D827bBA664d19CB736C817707E730)
    +++ description: A router contract for verifiers. Routes verification requests to gateway:0x3CFB3a80Af42cBE4d82C14301690A62D53e870a5 or gateway:0x92A9Fd0E84354213D9c3d33128eDd6Ea55ee0717 depending on the supplied proof type.
```

## Source code changes

```diff
.../gateway/{.flat@1753972594 => .flat}/L1VerifierFflonk.sol      | 4 ++--
 .../gateway/{.flat@1753972594 => .flat}/L1VerifierPlonk.sol       | 8 ++++----
 2 files changed, 6 insertions(+), 6 deletions(-)
```

Generated with discovered.json: 0x6b890ebd6ed7fa60ad7ccf3e269418c4c7fb2cf6

# Diff at Thu, 31 Jul 2025 15:03:02 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- current timestamp: 1753972594

## Description

initial discovery after the migration to gateway. the only change wrt L1 are the DA validator contract and the partial validator timelock.

## Initial discovery

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
    contract ZKsyncValidatorTimelock (0xb83fdD24F40cb2AA5CC9c2A2A0c06E50fA9B4CEa)
    +++ description: Intermediary contract between the *Validators* and the central diamond contract that delays block execution (ie withdrawals and other L2 --> L1 messages) by 0s.
```

```diff
+   Status: CREATED
    contract PartialValidatorTimelock (0xcA027Fa98cdce4515E76ECf8dfb4189B16eE72A2)
    +++ description: If registrered as a validator in the gateway:0xb83fdD24F40cb2AA5CC9c2A2A0c06E50fA9B4CEa, forwards calls to it, but restricted to `commit`- and `revertBatchesSharedBridge()`.
```

```diff
+   Status: CREATED
    contract DiamondProxy (0xCE7CBd23193d029410b40e0fD8a79a5121f9250C)
    +++ description: The main contract defining the Layer 2. Operator actions like commiting blocks, providing ZK proofs and executing batches ultimately target this contract which then processes transactions. During batch execution it processes L1 --> L2 and L2 --> L1 transactions. isPermanentRollup was set to true in this contract which prevents changing the DA mode to Validium in the future.
```
