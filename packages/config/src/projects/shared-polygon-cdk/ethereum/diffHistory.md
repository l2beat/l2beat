Generated with discovered.json: 0x3f2ea7eefaf6194e2379c38051f6a5395d82bc5f

# Diff at Fri, 01 Aug 2025 14:10:59 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@802242fc2209399893865092b1048d583aafc2bb block: 1753686755
- current timestamp: 1754056580

## Description

Upgrades [PolygonRollupManager](https://disco.l2beat.com/diff/eth:0x9ab2cB2107d3E737f7977B2E5042C58dE98326ab/eth:0x42B9fF0644741e3353162678596e7D6aA6a13240):
- add support for migrating stateTransition chains to PP or ALGateway.

## Watched changes

```diff
    contract PolygonRollupManager (0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2) {
    +++ description: The central shared managing contract for Polygon Agglayer chains. This contract coordinates chain deployments and proof validation. All connected Layer 2s can be globally paused by activating the 'Emergency State'. This can be done by the eth:0x37c58Dfa7BF0A165C5AAEdDf3e2EdB475ac6Dcb6 or by anyone after 1 week of inactive verifiers.
      sourceHashes.1:
-        "0x05a5fd7dbd65634dc3a3eea806b01583e307d843c5fa9c7e6e01ffda1b1acb47"
+        "0xe1a044e355c430aefc18f156be2c4f677baa559d3fb102b60b836bb4e2b91220"
      values.$implementation:
-        "eth:0x9ab2cB2107d3E737f7977B2E5042C58dE98326ab"
+        "eth:0x42B9fF0644741e3353162678596e7D6aA6a13240"
      values.$pastUpgrades.7:
+        ["2025-07-30T13:35:23.000Z","0x289865ea6d92cdf5be21123b6ce61447f500ba14c229f02153113f8419af1695",["eth:0x42B9fF0644741e3353162678596e7D6aA6a13240"]]
      values.$upgradeCount:
-        7
+        8
      values.ROLLUP_MANAGER_VERSION:
-        "al-v0.3.0"
+        "al-v0.3.1"
      implementationNames.eth:0x9ab2cB2107d3E737f7977B2E5042C58dE98326ab:
-        "PolygonRollupManager"
      implementationNames.eth:0x42B9fF0644741e3353162678596e7D6aA6a13240:
+        "PolygonRollupManager"
    }
```

## Source code changes

```diff
.../PolygonRollupManager/PolygonRollupManager.sol  | 139 ++++++++++++++++++---
 1 file changed, 125 insertions(+), 14 deletions(-)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1753686755 (main branch discovery), not current.

```diff
    contract PolygonAdminMultisig (0x242daE44F5d8fb54B198D03a94dA45B5a4413e21) {
    +++ description: None
      receivedPermissions.5.description:
-        "manage all access control roles, add new rollup types (which are implementation contracts that can then be upgraded to by connected projects), update any connected projects to new rollup types and rollback batches, connect existing rollups to the PolygonRollupManager."
+        "manage all access control roles, add new rollup types (which are implementation contracts that can then be upgraded to by connected projects), update any connected projects to new rollup types, migrate to pessimistic proofs and rollback batches, connect existing rollups to the PolygonRollupManager."
    }
```

```diff
    contract Timelock (0xEf1462451C30Ea7aD8555386226059Fe837CA4EF) {
    +++ description: A timelock with access control. In the case of an activated emergency state in the eth:0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2, all transactions through this timelock are immediately executable. The current minimum delay is 3d.
      directlyReceivedPermissions.4.description:
-        "manage all access control roles, add new rollup types (which are implementation contracts that can then be upgraded to by connected projects), update any connected projects to new rollup types and rollback batches, connect existing rollups to the PolygonRollupManager."
+        "manage all access control roles, add new rollup types (which are implementation contracts that can then be upgraded to by connected projects), update any connected projects to new rollup types, migrate to pessimistic proofs and rollback batches, connect existing rollups to the PolygonRollupManager."
    }
```

Generated with discovered.json: 0x78b250e88782006f4f115dbeee6eb5bc13518215

# Diff at Thu, 31 Jul 2025 13:14:36 GMT:

- author: maciekzygmunt (<maciekzygmunt@interia.pl>)
- comparing to: main@07319d194d312aca8103826b7db44d44613cc7fa block: 1753686755
- current timestamp: 1753686755

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1753686755 (main branch discovery), not current.

```diff
    contract PolygonSharedBridge (0x2a3DD3EB832aF982ec71669E178424b10Dca2EDe) {
    +++ description: The shared bridge contract, escrowing user funds sent to Agglayer participants. It is usually mirrored on each chain and can be used to transfer both ERC20 assets and arbitrary messages.
      description:
-        "The shared bridge contract, escrowing user funds sent to AggLayer participants. It is usually mirrored on each chain and can be used to transfer both ERC20 assets and arbitrary messages."
+        "The shared bridge contract, escrowing user funds sent to Agglayer participants. It is usually mirrored on each chain and can be used to transfer both ERC20 assets and arbitrary messages."
    }
```

```diff
    contract PolygonRollupManager (0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2) {
    +++ description: The central shared managing contract for Polygon Agglayer chains. This contract coordinates chain deployments and proof validation. All connected Layer 2s can be globally paused by activating the 'Emergency State'. This can be done by the eth:0x37c58Dfa7BF0A165C5AAEdDf3e2EdB475ac6Dcb6 or by anyone after 1 week of inactive verifiers.
      description:
-        "The central shared managing contract for Polygon AggLayer chains. This contract coordinates chain deployments and proof validation. All connected Layer 2s can be globally paused by activating the 'Emergency State'. This can be done by the eth:0x37c58Dfa7BF0A165C5AAEdDf3e2EdB475ac6Dcb6 or by anyone after 1 week of inactive verifiers."
+        "The central shared managing contract for Polygon Agglayer chains. This contract coordinates chain deployments and proof validation. All connected Layer 2s can be globally paused by activating the 'Emergency State'. This can be done by the eth:0x37c58Dfa7BF0A165C5AAEdDf3e2EdB475ac6Dcb6 or by anyone after 1 week of inactive verifiers."
    }
```

```diff
    contract PolygonGlobalExitRootV2 (0x580bda1e7A0CFAe92Fa7F6c20A3794F169CE3CFb) {
    +++ description: A merkle tree storage contract aggregating state roots of each participating Layer 2, thus creating a single global merkle root representing the global state of the Agglayer, the 'global exit root'. The global exit root is synchronized to all connected Layer 2s to help with their interoperability.
      description:
-        "A merkle tree storage contract aggregating state roots of each participating Layer 2, thus creating a single global merkle root representing the global state of the AggLayer, the 'global exit root'. The global exit root is synchronized to all connected Layer 2s to help with their interoperability."
+        "A merkle tree storage contract aggregating state roots of each participating Layer 2, thus creating a single global merkle root representing the global state of the Agglayer, the 'global exit root'. The global exit root is synchronized to all connected Layer 2s to help with their interoperability."
    }
```

Generated with discovered.json: 0x7dd12142fb878237e9beab50e614b839ae3686af

# Diff at Mon, 28 Jul 2025 07:13:28 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@8e540d8d4e2ea097e63a067c52194d1bf06f9b4a block: 22924125
- current block number: 23016078

## Description

upgrade for the RollupManager scheduled: https://disco.l2beat.com/diff/eth:0x9ab2cB2107d3E737f7977B2E5042C58dE98326ab/eth:0x42B9fF0644741e3353162678596e7D6aA6a13240
- add support for migrating stateTransition chains to PP or ALGateway.

## Watched changes

```diff
    contract Timelock (0xEf1462451C30Ea7aD8555386226059Fe837CA4EF) {
    +++ description: A timelock with access control. In the case of an activated emergency state in the eth:0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2, all transactions through this timelock are immediately executable. The current minimum delay is 3d.
      values.scheduledTransactionsDecoded.34:
+        {"target":"eth:0x0F99738B2Fc14D77308337f3e2596b63aE7BCC4A","value":"0","function":"upgradeAndCall","inputs":{"proxy":"eth:0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2","implementation":"eth:0x42B9fF0644741e3353162678596e7D6aA6a13240","data":{}},"predecessor":"0x0000000000000000000000000000000000000000000000000000000000000000","delay":"259200"}
    }
```

Generated with discovered.json: 0x52d99349bd40d59269f905d1a317477b42afa292

# Diff at Tue, 22 Jul 2025 13:43:05 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@7cd20806e60337bd7514921d95610ad265cb6ec1 block: 22924125
- current block number: 22924125

## Description

Event handler fix

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22924125 (main branch discovery), not current.

```diff
    contract AggLayerGateway (0x046Bb8bb98Db4ceCbB2929542686B74b516274b3) {
    +++ description: A verifier gateway for pessimistic proofs. Manages a map of chains and their verifier keys and is used to route proofs based on the first 4 bytes of proofBytes data in a proof submission. The SP1 verifier is used for all proofs.
      values.aggchainVKeys.0x00040001.0.1:
-        "0x713f8a687452545141b6cd852472c67742a5c61474b97a136d0d107804affa1f"
      values.aggchainVKeys.0x00040001.0.0:
-        "0x00040001"
      values.routes.0x00000004.0.2:
-        "0x00eff0b6998df46ec388bb305618089ae3dc74e513e7676b2e1909694f49cc30"
      values.routes.0x00000004.0.1:
-        "eth:0x0459d576A6223fEeA177Fb3DF53C9c77BF84C459"
      values.routes.0x00000004.0.0:
-        "0x00000004"
    }
```

Generated with discovered.json: 0x1106a4bc16487320b6098c10b595e5e2f8f7d4a9

# Diff at Tue, 15 Jul 2025 10:57:28 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@fe7c3b2343ca7836e6a947e456ab91a6f0f6f592 block: 22829897
- current block number: 22924125

## Description

remove one signer from PolygonCreateRollupMultisig.

## Watched changes

```diff
    contract PolygonCreateRollupMultisig (0xC74eFc7fdb3BeC9c6930E91FFDF761b160dF79dB) {
    +++ description: None
      values.$members.7:
-        "eth:0xC8aaFEF5C3689c29143023Fe53cB3e833e0439e9"
      values.multisigThreshold:
-        "3 of 8 (38%)"
+        "3 of 7 (43%)"
    }
```

Generated with discovered.json: 0x93bdd69413afdd3b0b5dfb291c03ca7a80a3d3c8

# Diff at Mon, 14 Jul 2025 12:46:13 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@9f4300dad2f3d080cd56fa311d4a848556c74e72 block: 22829897
- current block number: 22829897

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22829897 (main branch discovery), not current.

```diff
    EOA  (0x0185fb2F27f2Acda3e2a6B8530b342333e9f22A6) {
    +++ description: None
      address:
-        "0x0185fb2F27f2Acda3e2a6B8530b342333e9f22A6"
+        "eth:0x0185fb2F27f2Acda3e2a6B8530b342333e9f22A6"
    }
```

```diff
    contract SP1Verifier (0x0459d576A6223fEeA177Fb3DF53C9c77BF84C459) {
    +++ description: Verifier contract for SP1 proofs (v5.0.0).
      address:
-        "0x0459d576A6223fEeA177Fb3DF53C9c77BF84C459"
+        "eth:0x0459d576A6223fEeA177Fb3DF53C9c77BF84C459"
      implementationNames.0x0459d576A6223fEeA177Fb3DF53C9c77BF84C459:
-        "SP1Verifier"
      implementationNames.eth:0x0459d576A6223fEeA177Fb3DF53C9c77BF84C459:
+        "SP1Verifier"
    }
```

```diff
    contract AggLayerGateway (0x046Bb8bb98Db4ceCbB2929542686B74b516274b3) {
    +++ description: A verifier gateway for pessimistic proofs. Manages a map of chains and their verifier keys and is used to route proofs based on the first 4 bytes of proofBytes data in a proof submission. The SP1 verifier is used for all proofs.
      address:
-        "0x046Bb8bb98Db4ceCbB2929542686B74b516274b3"
+        "eth:0x046Bb8bb98Db4ceCbB2929542686B74b516274b3"
      values.$admin:
-        "0x0F99738B2Fc14D77308337f3e2596b63aE7BCC4A"
+        "eth:0x0F99738B2Fc14D77308337f3e2596b63aE7BCC4A"
      values.$implementation:
-        "0x7bB0e8f1950722694929dB392abA805AAc6e9346"
+        "eth:0x7bB0e8f1950722694929dB392abA805AAc6e9346"
      values.$pastUpgrades.0.2.0:
-        "0x7bB0e8f1950722694929dB392abA805AAc6e9346"
+        "eth:0x7bB0e8f1950722694929dB392abA805AAc6e9346"
      values.accessControl.DEFAULT_ADMIN_ROLE.members.0:
-        "0xEf1462451C30Ea7aD8555386226059Fe837CA4EF"
+        "eth:0xEf1462451C30Ea7aD8555386226059Fe837CA4EF"
      values.accessControl.AGGCHAIN_DEFAULT_VKEY_ROLE.members.0:
-        "0x242daE44F5d8fb54B198D03a94dA45B5a4413e21"
+        "eth:0x242daE44F5d8fb54B198D03a94dA45B5a4413e21"
      values.accessControl.AL_ADD_PP_ROUTE_ROLE.members.0:
-        "0xEf1462451C30Ea7aD8555386226059Fe837CA4EF"
+        "eth:0xEf1462451C30Ea7aD8555386226059Fe837CA4EF"
      values.accessControl.AL_FREEZE_PP_ROUTE_ROLE.members.0:
-        "0x242daE44F5d8fb54B198D03a94dA45B5a4413e21"
+        "eth:0x242daE44F5d8fb54B198D03a94dA45B5a4413e21"
      values.addPpRouteAC.0:
-        "0xEf1462451C30Ea7aD8555386226059Fe837CA4EF"
+        "eth:0xEf1462451C30Ea7aD8555386226059Fe837CA4EF"
      values.aggchainDefaultVKeyAC.0:
-        "0x242daE44F5d8fb54B198D03a94dA45B5a4413e21"
+        "eth:0x242daE44F5d8fb54B198D03a94dA45B5a4413e21"
      values.freezePpRouteAC.0:
-        "0x242daE44F5d8fb54B198D03a94dA45B5a4413e21"
+        "eth:0x242daE44F5d8fb54B198D03a94dA45B5a4413e21"
      values.routes.0x00000004.0.verifier:
-        "0x0459d576A6223fEeA177Fb3DF53C9c77BF84C459"
+        "eth:0x0459d576A6223fEeA177Fb3DF53C9c77BF84C459"
      values.routes.0x00000004.0.1:
-        "0x0459d576A6223fEeA177Fb3DF53C9c77BF84C459"
+        "eth:0x0459d576A6223fEeA177Fb3DF53C9c77BF84C459"
      implementationNames.0x046Bb8bb98Db4ceCbB2929542686B74b516274b3:
-        "TransparentUpgradeableProxy"
      implementationNames.0x7bB0e8f1950722694929dB392abA805AAc6e9346:
-        "AggLayerGateway"
      implementationNames.eth:0x046Bb8bb98Db4ceCbB2929542686B74b516274b3:
+        "TransparentUpgradeableProxy"
      implementationNames.eth:0x7bB0e8f1950722694929dB392abA805AAc6e9346:
+        "AggLayerGateway"
    }
```

```diff
    EOA  (0x0B84d2e66192448B680BBd06813efF9e5923Ca77) {
    +++ description: None
      address:
-        "0x0B84d2e66192448B680BBd06813efF9e5923Ca77"
+        "eth:0x0B84d2e66192448B680BBd06813efF9e5923Ca77"
    }
```

```diff
    contract SharedProxyAdmin (0x0F99738B2Fc14D77308337f3e2596b63aE7BCC4A) {
    +++ description: None
      address:
-        "0x0F99738B2Fc14D77308337f3e2596b63aE7BCC4A"
+        "eth:0x0F99738B2Fc14D77308337f3e2596b63aE7BCC4A"
      values.owner:
-        "0xEf1462451C30Ea7aD8555386226059Fe837CA4EF"
+        "eth:0xEf1462451C30Ea7aD8555386226059Fe837CA4EF"
      implementationNames.0x0F99738B2Fc14D77308337f3e2596b63aE7BCC4A:
-        "ProxyAdmin"
      implementationNames.eth:0x0F99738B2Fc14D77308337f3e2596b63aE7BCC4A:
+        "ProxyAdmin"
    }
```

```diff
    EOA  (0x20A53dCb196cD2bcc14Ece01F358f1C849aA51dE) {
    +++ description: None
      address:
-        "0x20A53dCb196cD2bcc14Ece01F358f1C849aA51dE"
+        "eth:0x20A53dCb196cD2bcc14Ece01F358f1C849aA51dE"
    }
```

```diff
    EOA  (0x21618593F7147235aC8D511d68A547C935F9d417) {
    +++ description: None
      address:
-        "0x21618593F7147235aC8D511d68A547C935F9d417"
+        "eth:0x21618593F7147235aC8D511d68A547C935F9d417"
    }
```

```diff
    EOA  (0x21887c89368bf918346c62460e0c339113801C28) {
    +++ description: None
      address:
-        "0x21887c89368bf918346c62460e0c339113801C28"
+        "eth:0x21887c89368bf918346c62460e0c339113801C28"
    }
```

```diff
    contract PolygonAdminMultisig (0x242daE44F5d8fb54B198D03a94dA45B5a4413e21) {
    +++ description: None
      address:
-        "0x242daE44F5d8fb54B198D03a94dA45B5a4413e21"
+        "eth:0x242daE44F5d8fb54B198D03a94dA45B5a4413e21"
      values.$implementation:
-        "0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
+        "eth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
      values.$members.0:
-        "0xcAB31b6A7b4d2eCd562A09e2BfA46535a18862f9"
+        "eth:0xcAB31b6A7b4d2eCd562A09e2BfA46535a18862f9"
      values.$members.1:
-        "0xAb3506507449bF1880f3337825efd19ac89E235E"
+        "eth:0xAb3506507449bF1880f3337825efd19ac89E235E"
      values.$members.2:
-        "0x54c401eD03D086fE13221E5422165f3b024265d9"
+        "eth:0x54c401eD03D086fE13221E5422165f3b024265d9"
      values.$members.3:
-        "0x21618593F7147235aC8D511d68A547C935F9d417"
+        "eth:0x21618593F7147235aC8D511d68A547C935F9d417"
      values.$members.4:
-        "0xED7cC82235A7757702475c8f77c7830c095FB5a2"
+        "eth:0xED7cC82235A7757702475c8f77c7830c095FB5a2"
      values.$members.5:
-        "0xdFEd8373695a7b3DaF268CF91e71f6a7024A56Da"
+        "eth:0xdFEd8373695a7b3DaF268CF91e71f6a7024A56Da"
      values.$members.6:
-        "0xffbfc0c8331C5fc912DDA3C6D4A86eEB80203238"
+        "eth:0xffbfc0c8331C5fc912DDA3C6D4A86eEB80203238"
      values.$members.7:
-        "0xeD44D1CFfB91e163CB7126bdEeA83959f175dB37"
+        "eth:0xeD44D1CFfB91e163CB7126bdEeA83959f175dB37"
      values.$members.8:
-        "0x516eEcfb38aA308c5f1878497108c7d054fd46B7"
+        "eth:0x516eEcfb38aA308c5f1878497108c7d054fd46B7"
      values.$members.9:
-        "0x4c1665d6651ecEfa59B9B3041951608468b18891"
+        "eth:0x4c1665d6651ecEfa59B9B3041951608468b18891"
      values.$members.10:
-        "0xA0B02B28920812324f1cC3255bd8840867d3f227"
+        "eth:0xA0B02B28920812324f1cC3255bd8840867d3f227"
      values.$members.11:
-        "0xEad77b01ea770839F7f576Cd1516Ff6A298d9dB2"
+        "eth:0xEad77b01ea770839F7f576Cd1516Ff6A298d9dB2"
      implementationNames.0x242daE44F5d8fb54B198D03a94dA45B5a4413e21:
-        "GnosisSafeProxy"
      implementationNames.0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
-        "GnosisSafe"
      implementationNames.eth:0x242daE44F5d8fb54B198D03a94dA45B5a4413e21:
+        "GnosisSafeProxy"
      implementationNames.eth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
+        "GnosisSafe"
    }
```

```diff
    contract PolygonSharedBridge (0x2a3DD3EB832aF982ec71669E178424b10Dca2EDe) {
    +++ description: The shared bridge contract, escrowing user funds sent to AggLayer participants. It is usually mirrored on each chain and can be used to transfer both ERC20 assets and arbitrary messages.
      address:
-        "0x2a3DD3EB832aF982ec71669E178424b10Dca2EDe"
+        "eth:0x2a3DD3EB832aF982ec71669E178424b10Dca2EDe"
      values.$admin:
-        "0x0F99738B2Fc14D77308337f3e2596b63aE7BCC4A"
+        "eth:0x0F99738B2Fc14D77308337f3e2596b63aE7BCC4A"
      values.$implementation:
-        "0x75D28BfDfF93B3e4f20184b442d2634DC01cA48b"
+        "eth:0x75D28BfDfF93B3e4f20184b442d2634DC01cA48b"
      values.$pastUpgrades.0.2.0:
-        "0x5ac4182A1dd41AeEf465E40B82fd326BF66AB82C"
+        "eth:0x5ac4182A1dd41AeEf465E40B82fd326BF66AB82C"
      values.$pastUpgrades.1.2.0:
-        "0x0FeB850B183C57534b56b7d56520133C8f9BDB65"
+        "eth:0x0FeB850B183C57534b56b7d56520133C8f9BDB65"
      values.$pastUpgrades.2.2.0:
-        "0x75D28BfDfF93B3e4f20184b442d2634DC01cA48b"
+        "eth:0x75D28BfDfF93B3e4f20184b442d2634DC01cA48b"
      values.gasTokenAddress:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.getProxiedTokensManager:
-        "0xEf1462451C30Ea7aD8555386226059Fe837CA4EF"
+        "eth:0xEf1462451C30Ea7aD8555386226059Fe837CA4EF"
      values.getWrappedTokenBridgeImplementation:
-        "0xc5240E74839794D512e77bD9b3702c4B6D5b0F0d"
+        "eth:0xc5240E74839794D512e77bD9b3702c4B6D5b0F0d"
      values.globalExitRootManager:
-        "0x580bda1e7A0CFAe92Fa7F6c20A3794F169CE3CFb"
+        "eth:0x580bda1e7A0CFAe92Fa7F6c20A3794F169CE3CFb"
      values.pendingProxiedTokensManager:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.polygonRollupManager:
-        "0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2"
+        "eth:0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2"
+++ description: is the default proxy admin of all newly deployed wrapped tokens (tokens bridged from other chains to this chain). this permission is enforced by the proxy bytecode in the wrappedTokenBytecodeStorer.
+++ severity: HIGH
      values.proxiedTokensManager:
-        "0xEf1462451C30Ea7aD8555386226059Fe837CA4EF"
+        "eth:0xEf1462451C30Ea7aD8555386226059Fe837CA4EF"
      values.WETHToken:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.wrappedTokenBytecodeStorer:
-        "0x6b0E6Cf8108BbC39A53AF11B65d6C47d06037f80"
+        "eth:0x6b0E6Cf8108BbC39A53AF11B65d6C47d06037f80"
      implementationNames.0x2a3DD3EB832aF982ec71669E178424b10Dca2EDe:
-        "TransparentUpgradeableProxy"
      implementationNames.0x75D28BfDfF93B3e4f20184b442d2634DC01cA48b:
-        "PolygonZkEVMBridgeV2"
      implementationNames.eth:0x2a3DD3EB832aF982ec71669E178424b10Dca2EDe:
+        "TransparentUpgradeableProxy"
      implementationNames.eth:0x75D28BfDfF93B3e4f20184b442d2634DC01cA48b:
+        "PolygonZkEVMBridgeV2"
    }
```

```diff
    EOA  (0x3038B4DBf022E80169b2A068290d4a3A8b87D3b5) {
    +++ description: None
      address:
-        "0x3038B4DBf022E80169b2A068290d4a3A8b87D3b5"
+        "eth:0x3038B4DBf022E80169b2A068290d4a3A8b87D3b5"
    }
```

```diff
    contract PolygonSecurityCouncil (0x37c58Dfa7BF0A165C5AAEdDf3e2EdB475ac6Dcb6) {
    +++ description: None
      address:
-        "0x37c58Dfa7BF0A165C5AAEdDf3e2EdB475ac6Dcb6"
+        "eth:0x37c58Dfa7BF0A165C5AAEdDf3e2EdB475ac6Dcb6"
      values.$implementation:
-        "0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
+        "eth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
      values.$members.0:
-        "0xFe45baf0F18c207152A807c1b05926583CFE2e4b"
+        "eth:0xFe45baf0F18c207152A807c1b05926583CFE2e4b"
      values.$members.1:
-        "0xaF46a0ddf80DFFB49C87656625E65A37499B261D"
+        "eth:0xaF46a0ddf80DFFB49C87656625E65A37499B261D"
      values.$members.2:
-        "0xBDc235cC9d6Baa641c5ae306bc83962475A5FEFf"
+        "eth:0xBDc235cC9d6Baa641c5ae306bc83962475A5FEFf"
      values.$members.3:
-        "0x4c1665d6651ecEfa59B9B3041951608468b18891"
+        "eth:0x4c1665d6651ecEfa59B9B3041951608468b18891"
      values.$members.4:
-        "0x3ab9f4b964eE665F7CDf1d65f1cEEc6196B0D622"
+        "eth:0x3ab9f4b964eE665F7CDf1d65f1cEEc6196B0D622"
      values.$members.5:
-        "0x49c15936864690bCd6af0ecaca8E874adFF30E86"
+        "eth:0x49c15936864690bCd6af0ecaca8E874adFF30E86"
      values.$members.6:
-        "0x9F7dfAb2222A473284205cdDF08a677726d786A0"
+        "eth:0x9F7dfAb2222A473284205cdDF08a677726d786A0"
      values.$members.7:
-        "0x21887c89368bf918346c62460e0c339113801C28"
+        "eth:0x21887c89368bf918346c62460e0c339113801C28"
      implementationNames.0x37c58Dfa7BF0A165C5AAEdDf3e2EdB475ac6Dcb6:
-        "GnosisSafeProxy"
      implementationNames.0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
-        "GnosisSafe"
      implementationNames.eth:0x37c58Dfa7BF0A165C5AAEdDf3e2EdB475ac6Dcb6:
+        "GnosisSafeProxy"
      implementationNames.eth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
+        "GnosisSafe"
    }
```

```diff
    EOA  (0x3ab9f4b964eE665F7CDf1d65f1cEEc6196B0D622) {
    +++ description: None
      address:
-        "0x3ab9f4b964eE665F7CDf1d65f1cEEc6196B0D622"
+        "eth:0x3ab9f4b964eE665F7CDf1d65f1cEEc6196B0D622"
    }
```

```diff
    EOA  (0x49c15936864690bCd6af0ecaca8E874adFF30E86) {
    +++ description: None
      address:
-        "0x49c15936864690bCd6af0ecaca8E874adFF30E86"
+        "eth:0x49c15936864690bCd6af0ecaca8E874adFF30E86"
    }
```

```diff
    EOA  (0x4c1665d6651ecEfa59B9B3041951608468b18891) {
    +++ description: None
      address:
-        "0x4c1665d6651ecEfa59B9B3041951608468b18891"
+        "eth:0x4c1665d6651ecEfa59B9B3041951608468b18891"
    }
```

```diff
    contract PolygonRollupManager (0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2) {
    +++ description: The central shared managing contract for Polygon AggLayer chains. This contract coordinates chain deployments and proof validation. All connected Layer 2s can be globally paused by activating the 'Emergency State'. This can be done by the eth:0x37c58Dfa7BF0A165C5AAEdDf3e2EdB475ac6Dcb6 or by anyone after 1 week of inactive verifiers.
      address:
-        "0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2"
+        "eth:0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2"
      description:
-        "The central shared managing contract for Polygon AggLayer chains. This contract coordinates chain deployments and proof validation. All connected Layer 2s can be globally paused by activating the 'Emergency State'. This can be done by the 0x37c58Dfa7BF0A165C5AAEdDf3e2EdB475ac6Dcb6 or by anyone after 1 week of inactive verifiers."
+        "The central shared managing contract for Polygon AggLayer chains. This contract coordinates chain deployments and proof validation. All connected Layer 2s can be globally paused by activating the 'Emergency State'. This can be done by the eth:0x37c58Dfa7BF0A165C5AAEdDf3e2EdB475ac6Dcb6 or by anyone after 1 week of inactive verifiers."
      values.$admin:
-        "0x0F99738B2Fc14D77308337f3e2596b63aE7BCC4A"
+        "eth:0x0F99738B2Fc14D77308337f3e2596b63aE7BCC4A"
      values.$implementation:
-        "0x9ab2cB2107d3E737f7977B2E5042C58dE98326ab"
+        "eth:0x9ab2cB2107d3E737f7977B2E5042C58dE98326ab"
      values.$pastUpgrades.0.2.0:
-        "0xe262Ea2782e2e8dbFe354048c3B5d6DE9603EfEF"
+        "eth:0xe262Ea2782e2e8dbFe354048c3B5d6DE9603EfEF"
      values.$pastUpgrades.1.2.0:
-        "0x301442aA888701c8B86727d42F3C55Fb0dd9eF7F"
+        "eth:0x301442aA888701c8B86727d42F3C55Fb0dd9eF7F"
      values.$pastUpgrades.2.2.0:
-        "0xb1585916487AcEdD99952086f2950763D253b923"
+        "eth:0xb1585916487AcEdD99952086f2950763D253b923"
      values.$pastUpgrades.3.2.0:
-        "0x3b82Da772c825283d85d5d6717A77C6Ff582053b"
+        "eth:0x3b82Da772c825283d85d5d6717A77C6Ff582053b"
      values.$pastUpgrades.4.2.0:
-        "0x103388f5661d224F4aFb555C7E4a8FB52d0b752d"
+        "eth:0x103388f5661d224F4aFb555C7E4a8FB52d0b752d"
      values.$pastUpgrades.5.2.0:
-        "0xA33619940bceb9be7c9679Dd80FA2918C2476382"
+        "eth:0xA33619940bceb9be7c9679Dd80FA2918C2476382"
      values.$pastUpgrades.6.2.0:
-        "0x9ab2cB2107d3E737f7977B2E5042C58dE98326ab"
+        "eth:0x9ab2cB2107d3E737f7977B2E5042C58dE98326ab"
      values.accessControl.DEFAULT_ADMIN_ROLE.members.0:
-        "0xEf1462451C30Ea7aD8555386226059Fe837CA4EF"
+        "eth:0xEf1462451C30Ea7aD8555386226059Fe837CA4EF"
      values.accessControl.TRUSTED_AGGREGATOR.members.0:
-        "0x6329Fe417621925C81c16F9F9a18c203C21Af7ab"
+        "eth:0x6329Fe417621925C81c16F9F9a18c203C21Af7ab"
      values.accessControl.TRUSTED_AGGREGATOR.members.1:
-        "0x20A53dCb196cD2bcc14Ece01F358f1C849aA51dE"
+        "eth:0x20A53dCb196cD2bcc14Ece01F358f1C849aA51dE"
      values.accessControl.ADD_ROLLUP_TYPE.members.0:
-        "0xEf1462451C30Ea7aD8555386226059Fe837CA4EF"
+        "eth:0xEf1462451C30Ea7aD8555386226059Fe837CA4EF"
      values.accessControl.ADD_EXISTING_ROLLUP.members.0:
-        "0xEf1462451C30Ea7aD8555386226059Fe837CA4EF"
+        "eth:0xEf1462451C30Ea7aD8555386226059Fe837CA4EF"
      values.accessControl.UPDATE_ROLLUP.members.0:
-        "0xEf1462451C30Ea7aD8555386226059Fe837CA4EF"
+        "eth:0xEf1462451C30Ea7aD8555386226059Fe837CA4EF"
      values.accessControl.UPDATE_ROLLUP.members.1:
-        "0x242daE44F5d8fb54B198D03a94dA45B5a4413e21"
+        "eth:0x242daE44F5d8fb54B198D03a94dA45B5a4413e21"
      values.accessControl.OBSOLETE_ROLLUP_TYPE.members.0:
-        "0x242daE44F5d8fb54B198D03a94dA45B5a4413e21"
+        "eth:0x242daE44F5d8fb54B198D03a94dA45B5a4413e21"
      values.accessControl.CREATE_ROLLUP.members.0:
-        "0x242daE44F5d8fb54B198D03a94dA45B5a4413e21"
+        "eth:0x242daE44F5d8fb54B198D03a94dA45B5a4413e21"
      values.accessControl.CREATE_ROLLUP.members.1:
-        "0xC74eFc7fdb3BeC9c6930E91FFDF761b160dF79dB"
+        "eth:0xC74eFc7fdb3BeC9c6930E91FFDF761b160dF79dB"
      values.accessControl.STOP_EMERGENCY.members.0:
-        "0x242daE44F5d8fb54B198D03a94dA45B5a4413e21"
+        "eth:0x242daE44F5d8fb54B198D03a94dA45B5a4413e21"
      values.accessControl.TWEAK_PARAMETERS.members.0:
-        "0x242daE44F5d8fb54B198D03a94dA45B5a4413e21"
+        "eth:0x242daE44F5d8fb54B198D03a94dA45B5a4413e21"
      values.accessControl.TRUSTED_AGGREGATOR_ADMIN.members.0:
-        "0x242daE44F5d8fb54B198D03a94dA45B5a4413e21"
+        "eth:0x242daE44F5d8fb54B198D03a94dA45B5a4413e21"
      values.accessControl.SET_FEE.members.0:
-        "0x242daE44F5d8fb54B198D03a94dA45B5a4413e21"
+        "eth:0x242daE44F5d8fb54B198D03a94dA45B5a4413e21"
      values.accessControl.EMERGENCY_COUNCIL.members.0:
-        "0x37c58Dfa7BF0A165C5AAEdDf3e2EdB475ac6Dcb6"
+        "eth:0x37c58Dfa7BF0A165C5AAEdDf3e2EdB475ac6Dcb6"
      values.accessControl.EMERGENCY_COUNCIL_ADMIN.members.0:
-        "0x37c58Dfa7BF0A165C5AAEdDf3e2EdB475ac6Dcb6"
+        "eth:0x37c58Dfa7BF0A165C5AAEdDf3e2EdB475ac6Dcb6"
      values.aggLayerGateway:
-        "0x046Bb8bb98Db4ceCbB2929542686B74b516274b3"
+        "eth:0x046Bb8bb98Db4ceCbB2929542686B74b516274b3"
      values.bridgeAddress:
-        "0x2a3DD3EB832aF982ec71669E178424b10Dca2EDe"
+        "eth:0x2a3DD3EB832aF982ec71669E178424b10Dca2EDe"
      values.createRollupAC.0:
-        "0x242daE44F5d8fb54B198D03a94dA45B5a4413e21"
+        "eth:0x242daE44F5d8fb54B198D03a94dA45B5a4413e21"
      values.createRollupAC.1:
-        "0xC74eFc7fdb3BeC9c6930E91FFDF761b160dF79dB"
+        "eth:0xC74eFc7fdb3BeC9c6930E91FFDF761b160dF79dB"
      values.defaultAdminAC.0:
-        "0xEf1462451C30Ea7aD8555386226059Fe837CA4EF"
+        "eth:0xEf1462451C30Ea7aD8555386226059Fe837CA4EF"
      values.emergencyCouncilAdminAC.0:
-        "0x37c58Dfa7BF0A165C5AAEdDf3e2EdB475ac6Dcb6"
+        "eth:0x37c58Dfa7BF0A165C5AAEdDf3e2EdB475ac6Dcb6"
      values.globalExitRootManager:
-        "0x580bda1e7A0CFAe92Fa7F6c20A3794F169CE3CFb"
+        "eth:0x580bda1e7A0CFAe92Fa7F6c20A3794F169CE3CFb"
      values.pol:
-        "0x455e53CBB86018Ac2B8092FdCd39d8444aFFC3F6"
+        "eth:0x455e53CBB86018Ac2B8092FdCd39d8444aFFC3F6"
      values.rollupsDataV2.0.verifier:
-        "0x9B9671dB83CfcB4508bF361942488C5cA2b1286D"
+        "eth:0x9B9671dB83CfcB4508bF361942488C5cA2b1286D"
      values.rollupsDataV2.0.rollupContract:
-        "0x519E42c24163192Dca44CD3fBDCEBF6be9130987"
+        "eth:0x519E42c24163192Dca44CD3fBDCEBF6be9130987"
      values.rollupsDataV2.1.verifier:
-        "0x0775e11309d75aA6b0967917fB0213C5673eDf81"
+        "eth:0x0775e11309d75aA6b0967917fB0213C5673eDf81"
      values.rollupsDataV2.1.rollupContract:
-        "0x1E163594e13030244DCAf4cDfC2cd0ba3206DA80"
+        "eth:0x1E163594e13030244DCAf4cDfC2cd0ba3206DA80"
      values.rollupsDataV2.2.verifier:
-        "0x455ac63E96e6a64EA59C6Da0D8F90FCa3F1535aB"
+        "eth:0x455ac63E96e6a64EA59C6Da0D8F90FCa3F1535aB"
      values.rollupsDataV2.2.rollupContract:
-        "0x2B0ee28D4D51bC9aDde5E58E295873F61F4a0507"
+        "eth:0x2B0ee28D4D51bC9aDde5E58E295873F61F4a0507"
      values.rollupsDataV2.3.verifier:
-        "0x0775e11309d75aA6b0967917fB0213C5673eDf81"
+        "eth:0x0775e11309d75aA6b0967917fB0213C5673eDf81"
      values.rollupsDataV2.3.rollupContract:
-        "0x88AaB361f108C3c959F2928Da3cD8e47298016B5"
+        "eth:0x88AaB361f108C3c959F2928Da3cD8e47298016B5"
      values.rollupsDataV2.4.verifier:
-        "0x0775e11309d75aA6b0967917fB0213C5673eDf81"
+        "eth:0x0775e11309d75aA6b0967917fB0213C5673eDf81"
      values.rollupsDataV2.4.rollupContract:
-        "0xC4E903D3Af4c3d2e437492d602adcC9d9b536858"
+        "eth:0xC4E903D3Af4c3d2e437492d602adcC9d9b536858"
      values.rollupsDataV2.5.verifier:
-        "0x0775e11309d75aA6b0967917fB0213C5673eDf81"
+        "eth:0x0775e11309d75aA6b0967917fB0213C5673eDf81"
      values.rollupsDataV2.5.rollupContract:
-        "0x42Ac57F24EC4C3AAC843f6DBAcd9282DAaeE9238"
+        "eth:0x42Ac57F24EC4C3AAC843f6DBAcd9282DAaeE9238"
      values.rollupsDataV2.6.verifier:
-        "0x9B9671dB83CfcB4508bF361942488C5cA2b1286D"
+        "eth:0x9B9671dB83CfcB4508bF361942488C5cA2b1286D"
      values.rollupsDataV2.6.rollupContract:
-        "0x92726F7dE49300DBdb60930066bc1d0803c0740B"
+        "eth:0x92726F7dE49300DBdb60930066bc1d0803c0740B"
      values.rollupsDataV2.7.verifier:
-        "0x0775e11309d75aA6b0967917fB0213C5673eDf81"
+        "eth:0x0775e11309d75aA6b0967917fB0213C5673eDf81"
      values.rollupsDataV2.7.rollupContract:
-        "0x78253E2E6120164bd826668A4C96Db20f78A94c9"
+        "eth:0x78253E2E6120164bd826668A4C96Db20f78A94c9"
      values.rollupsDataV2.8.verifier:
-        "0x0775e11309d75aA6b0967917fB0213C5673eDf81"
+        "eth:0x0775e11309d75aA6b0967917fB0213C5673eDf81"
      values.rollupsDataV2.8.rollupContract:
-        "0xA87df42CD53E998b3A610B8bCe3719871b0bb940"
+        "eth:0xA87df42CD53E998b3A610B8bCe3719871b0bb940"
      values.rollupsDataV2.9.verifier:
-        "0x9B9671dB83CfcB4508bF361942488C5cA2b1286D"
+        "eth:0x9B9671dB83CfcB4508bF361942488C5cA2b1286D"
      values.rollupsDataV2.9.rollupContract:
-        "0x419dcD0f72ebAFd3524b65a97ac96699C7fBebdB"
+        "eth:0x419dcD0f72ebAFd3524b65a97ac96699C7fBebdB"
      values.rollupsDataV2.10.verifier:
-        "0x0775e11309d75aA6b0967917fB0213C5673eDf81"
+        "eth:0x0775e11309d75aA6b0967917fB0213C5673eDf81"
      values.rollupsDataV2.10.rollupContract:
-        "0xB234F18738d9531CAD6ae6d9A587d09fe200272C"
+        "eth:0xB234F18738d9531CAD6ae6d9A587d09fe200272C"
      values.rollupsDataV2.11.verifier:
-        "0x0775e11309d75aA6b0967917fB0213C5673eDf81"
+        "eth:0x0775e11309d75aA6b0967917fB0213C5673eDf81"
      values.rollupsDataV2.11.rollupContract:
-        "0x505ce1246F7e2Fd899dc5d3cfB17A47500Eb58bC"
+        "eth:0x505ce1246F7e2Fd899dc5d3cfB17A47500Eb58bC"
      values.rollupsDataV2.12.verifier:
-        "0x9B9671dB83CfcB4508bF361942488C5cA2b1286D"
+        "eth:0x9B9671dB83CfcB4508bF361942488C5cA2b1286D"
      values.rollupsDataV2.12.rollupContract:
-        "0x7fF0B5fF6Eb8B789456639AC2A02487c338c1789"
+        "eth:0x7fF0B5fF6Eb8B789456639AC2A02487c338c1789"
      values.rollupsDataV2.13.verifier:
-        "0x0459d576A6223fEeA177Fb3DF53C9c77BF84C459"
+        "eth:0x0459d576A6223fEeA177Fb3DF53C9c77BF84C459"
      values.rollupsDataV2.13.rollupContract:
-        "0xFE797cb13f7884FB9f0aE26fEB2a06ed8efccbe7"
+        "eth:0xFE797cb13f7884FB9f0aE26fEB2a06ed8efccbe7"
      values.rollupsDataV2.14.verifier:
-        "0x9B9671dB83CfcB4508bF361942488C5cA2b1286D"
+        "eth:0x9B9671dB83CfcB4508bF361942488C5cA2b1286D"
      values.rollupsDataV2.14.rollupContract:
-        "0xB4cEb70E8778a9928feD6ECBa1b03706a57b0ce8"
+        "eth:0xB4cEb70E8778a9928feD6ECBa1b03706a57b0ce8"
      values.rollupsDataV2.15.verifier:
-        "0x9B9671dB83CfcB4508bF361942488C5cA2b1286D"
+        "eth:0x9B9671dB83CfcB4508bF361942488C5cA2b1286D"
      values.rollupsDataV2.15.rollupContract:
-        "0xb1714954bBc0162A36FB44934F3216aCE81C40d7"
+        "eth:0xb1714954bBc0162A36FB44934F3216aCE81C40d7"
      values.rollupsDataV2.16.verifier:
-        "0x0459d576A6223fEeA177Fb3DF53C9c77BF84C459"
+        "eth:0x0459d576A6223fEeA177Fb3DF53C9c77BF84C459"
      values.rollupsDataV2.16.rollupContract:
-        "0x7449449460b5B732A9754CA3d9A7916122A9190d"
+        "eth:0x7449449460b5B732A9754CA3d9A7916122A9190d"
      values.rollupsDataV2.17.verifier:
-        "0x0459d576A6223fEeA177Fb3DF53C9c77BF84C459"
+        "eth:0x0459d576A6223fEeA177Fb3DF53C9c77BF84C459"
      values.rollupsDataV2.17.rollupContract:
-        "0x88404dD30A96AD25A765d733429Cf83138c7f8f4"
+        "eth:0x88404dD30A96AD25A765d733429Cf83138c7f8f4"
      values.rollupsDataV2.18.verifier:
-        "0x0459d576A6223fEeA177Fb3DF53C9c77BF84C459"
+        "eth:0x0459d576A6223fEeA177Fb3DF53C9c77BF84C459"
      values.rollupsDataV2.18.rollupContract:
-        "0xC427E3Edc8ae4BD2698cbef251E06b83175f9dec"
+        "eth:0xC427E3Edc8ae4BD2698cbef251E06b83175f9dec"
      values.rollupsDataV2.19.verifier:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.rollupsDataV2.19.rollupContract:
-        "0x100d3ca4f97776A40A7D93dB4AbF0FEA34230666"
+        "eth:0x100d3ca4f97776A40A7D93dB4AbF0FEA34230666"
      values.rollupTypes.0.verifier:
-        "0x1C3A3da552b8662CD69538356b1E7c2E9CC1EBD8"
+        "eth:0x1C3A3da552b8662CD69538356b1E7c2E9CC1EBD8"
      values.rollupTypes.0.consensusImplementation:
-        "0x9cf80f7eB1C76ec5AE7A88b417e373449b73ac30"
+        "eth:0x9cf80f7eB1C76ec5AE7A88b417e373449b73ac30"
      values.rollupTypes.1.verifier:
-        "0x4AaBBA26EA9E7A7fbD052d17a167e6aE3F8eC7Be"
+        "eth:0x4AaBBA26EA9E7A7fbD052d17a167e6aE3F8eC7Be"
      values.rollupTypes.1.consensusImplementation:
-        "0x2650a9a4fC64f63F573EF0F405064EF54BC46f71"
+        "eth:0x2650a9a4fC64f63F573EF0F405064EF54BC46f71"
      values.rollupTypes.2.verifier:
-        "0x0775e11309d75aA6b0967917fB0213C5673eDf81"
+        "eth:0x0775e11309d75aA6b0967917fB0213C5673eDf81"
      values.rollupTypes.2.consensusImplementation:
-        "0x2650a9a4fC64f63F573EF0F405064EF54BC46f71"
+        "eth:0x2650a9a4fC64f63F573EF0F405064EF54BC46f71"
      values.rollupTypes.3.verifier:
-        "0x0775e11309d75aA6b0967917fB0213C5673eDf81"
+        "eth:0x0775e11309d75aA6b0967917fB0213C5673eDf81"
      values.rollupTypes.3.consensusImplementation:
-        "0x10D296e8aDd0535be71639E5D1d1c30ae1C6bD4C"
+        "eth:0x10D296e8aDd0535be71639E5D1d1c30ae1C6bD4C"
      values.rollupTypes.4.verifier:
-        "0xc521580cd8586Cc688A7430F9DcE0f6A803F2883"
+        "eth:0xc521580cd8586Cc688A7430F9DcE0f6A803F2883"
      values.rollupTypes.4.consensusImplementation:
-        "0x2650a9a4fC64f63F573EF0F405064EF54BC46f71"
+        "eth:0x2650a9a4fC64f63F573EF0F405064EF54BC46f71"
      values.rollupTypes.5.verifier:
-        "0x9B9671dB83CfcB4508bF361942488C5cA2b1286D"
+        "eth:0x9B9671dB83CfcB4508bF361942488C5cA2b1286D"
      values.rollupTypes.5.consensusImplementation:
-        "0x7253F329302b1b5E774Ac641EA3743E9E3244f2E"
+        "eth:0x7253F329302b1b5E774Ac641EA3743E9E3244f2E"
      values.rollupTypes.6.verifier:
-        "0x9B9671dB83CfcB4508bF361942488C5cA2b1286D"
+        "eth:0x9B9671dB83CfcB4508bF361942488C5cA2b1286D"
      values.rollupTypes.6.consensusImplementation:
-        "0x427113ae6F319BfFb4459bfF96eb8B6BDe1A127F"
+        "eth:0x427113ae6F319BfFb4459bfF96eb8B6BDe1A127F"
      values.rollupTypes.7.verifier:
-        "0x455ac63E96e6a64EA59C6Da0D8F90FCa3F1535aB"
+        "eth:0x455ac63E96e6a64EA59C6Da0D8F90FCa3F1535aB"
      values.rollupTypes.7.consensusImplementation:
-        "0x427113ae6F319BfFb4459bfF96eb8B6BDe1A127F"
+        "eth:0x427113ae6F319BfFb4459bfF96eb8B6BDe1A127F"
      values.rollupTypes.8.verifier:
-        "0xE00a3cBFC45241b33c0A44C78e26168CBc55EC63"
+        "eth:0xE00a3cBFC45241b33c0A44C78e26168CBc55EC63"
      values.rollupTypes.8.consensusImplementation:
-        "0x18C45DD422f6587357a6d3b23307E75D42b2bc5B"
+        "eth:0x18C45DD422f6587357a6d3b23307E75D42b2bc5B"
      values.rollupTypes.9.verifier:
-        "0xE00a3cBFC45241b33c0A44C78e26168CBc55EC63"
+        "eth:0xE00a3cBFC45241b33c0A44C78e26168CBc55EC63"
      values.rollupTypes.9.consensusImplementation:
-        "0x18C45DD422f6587357a6d3b23307E75D42b2bc5B"
+        "eth:0x18C45DD422f6587357a6d3b23307E75D42b2bc5B"
      values.rollupTypes.10.verifier:
-        "0x0459d576A6223fEeA177Fb3DF53C9c77BF84C459"
+        "eth:0x0459d576A6223fEeA177Fb3DF53C9c77BF84C459"
      values.rollupTypes.10.consensusImplementation:
-        "0x18C45DD422f6587357a6d3b23307E75D42b2bc5B"
+        "eth:0x18C45DD422f6587357a6d3b23307E75D42b2bc5B"
      values.rollupTypes.11.verifier:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.rollupTypes.11.consensusImplementation:
-        "0xe7FE45579D784DC83B0feD844A65f4cEEFDe5682"
+        "eth:0xe7FE45579D784DC83B0feD844A65f4cEEFDe5682"
      values.trustedAggregatorAC.0:
-        "0x6329Fe417621925C81c16F9F9a18c203C21Af7ab"
+        "eth:0x6329Fe417621925C81c16F9F9a18c203C21Af7ab"
      values.trustedAggregatorAC.1:
-        "0x20A53dCb196cD2bcc14Ece01F358f1C849aA51dE"
+        "eth:0x20A53dCb196cD2bcc14Ece01F358f1C849aA51dE"
      values.tweakParametersAC.0:
-        "0x242daE44F5d8fb54B198D03a94dA45B5a4413e21"
+        "eth:0x242daE44F5d8fb54B198D03a94dA45B5a4413e21"
      implementationNames.0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2:
-        "TransparentUpgradeableProxy"
      implementationNames.0x9ab2cB2107d3E737f7977B2E5042C58dE98326ab:
-        "PolygonRollupManager"
      implementationNames.eth:0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2:
+        "TransparentUpgradeableProxy"
      implementationNames.eth:0x9ab2cB2107d3E737f7977B2E5042C58dE98326ab:
+        "PolygonRollupManager"
    }
```

```diff
    EOA  (0x516eEcfb38aA308c5f1878497108c7d054fd46B7) {
    +++ description: None
      address:
-        "0x516eEcfb38aA308c5f1878497108c7d054fd46B7"
+        "eth:0x516eEcfb38aA308c5f1878497108c7d054fd46B7"
    }
```

```diff
    EOA  (0x54c401eD03D086fE13221E5422165f3b024265d9) {
    +++ description: None
      address:
-        "0x54c401eD03D086fE13221E5422165f3b024265d9"
+        "eth:0x54c401eD03D086fE13221E5422165f3b024265d9"
    }
```

```diff
    contract PolygonGlobalExitRootV2 (0x580bda1e7A0CFAe92Fa7F6c20A3794F169CE3CFb) {
    +++ description: A merkle tree storage contract aggregating state roots of each participating Layer 2, thus creating a single global merkle root representing the global state of the AggLayer, the 'global exit root'. The global exit root is synchronized to all connected Layer 2s to help with their interoperability.
      address:
-        "0x580bda1e7A0CFAe92Fa7F6c20A3794F169CE3CFb"
+        "eth:0x580bda1e7A0CFAe92Fa7F6c20A3794F169CE3CFb"
      values.$admin:
-        "0x0F99738B2Fc14D77308337f3e2596b63aE7BCC4A"
+        "eth:0x0F99738B2Fc14D77308337f3e2596b63aE7BCC4A"
      values.$implementation:
-        "0xc38C76aE3C8A7dee99d07f1A39246ABe18919a48"
+        "eth:0xc38C76aE3C8A7dee99d07f1A39246ABe18919a48"
      values.$pastUpgrades.0.2.0:
-        "0xbc1ea504fC54D078514eFCCA1F6860B5219B6BC3"
+        "eth:0xbc1ea504fC54D078514eFCCA1F6860B5219B6BC3"
      values.$pastUpgrades.1.2.0:
-        "0x2E38cD55163137483E30580Cb468C2dFf1d85077"
+        "eth:0x2E38cD55163137483E30580Cb468C2dFf1d85077"
      values.$pastUpgrades.2.2.0:
-        "0x9Bdda421219900454E94e01d641fE64c60D8f4C8"
+        "eth:0x9Bdda421219900454E94e01d641fE64c60D8f4C8"
      values.$pastUpgrades.3.2.0:
-        "0xc38C76aE3C8A7dee99d07f1A39246ABe18919a48"
+        "eth:0xc38C76aE3C8A7dee99d07f1A39246ABe18919a48"
      values.bridgeAddress:
-        "0x2a3DD3EB832aF982ec71669E178424b10Dca2EDe"
+        "eth:0x2a3DD3EB832aF982ec71669E178424b10Dca2EDe"
      values.rollupManager:
-        "0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2"
+        "eth:0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2"
      implementationNames.0x580bda1e7A0CFAe92Fa7F6c20A3794F169CE3CFb:
-        "TransparentUpgradeableProxy"
      implementationNames.0xc38C76aE3C8A7dee99d07f1A39246ABe18919a48:
-        "PolygonZkEVMGlobalExitRootV2"
      implementationNames.eth:0x580bda1e7A0CFAe92Fa7F6c20A3794F169CE3CFb:
+        "TransparentUpgradeableProxy"
      implementationNames.eth:0xc38C76aE3C8A7dee99d07f1A39246ABe18919a48:
+        "PolygonZkEVMGlobalExitRootV2"
    }
```

```diff
    EOA  (0x6329Fe417621925C81c16F9F9a18c203C21Af7ab) {
    +++ description: None
      address:
-        "0x6329Fe417621925C81c16F9F9a18c203C21Af7ab"
+        "eth:0x6329Fe417621925C81c16F9F9a18c203C21Af7ab"
    }
```

```diff
    EOA  (0x7316DeD96c4Ff756c74D1D9c4178f6921Aff4496) {
    +++ description: None
      address:
-        "0x7316DeD96c4Ff756c74D1D9c4178f6921Aff4496"
+        "eth:0x7316DeD96c4Ff756c74D1D9c4178f6921Aff4496"
    }
```

```diff
    EOA  (0x9F7dfAb2222A473284205cdDF08a677726d786A0) {
    +++ description: None
      address:
-        "0x9F7dfAb2222A473284205cdDF08a677726d786A0"
+        "eth:0x9F7dfAb2222A473284205cdDF08a677726d786A0"
    }
```

```diff
    EOA  (0xA0B02B28920812324f1cC3255bd8840867d3f227) {
    +++ description: None
      address:
-        "0xA0B02B28920812324f1cC3255bd8840867d3f227"
+        "eth:0xA0B02B28920812324f1cC3255bd8840867d3f227"
    }
```

```diff
    EOA  (0xa43901c63f7702C407378E55E0d0EB4064a2AE31) {
    +++ description: None
      address:
-        "0xa43901c63f7702C407378E55E0d0EB4064a2AE31"
+        "eth:0xa43901c63f7702C407378E55E0d0EB4064a2AE31"
    }
```

```diff
    EOA  (0xAb3506507449bF1880f3337825efd19ac89E235E) {
    +++ description: None
      address:
-        "0xAb3506507449bF1880f3337825efd19ac89E235E"
+        "eth:0xAb3506507449bF1880f3337825efd19ac89E235E"
    }
```

```diff
    EOA  (0xaF46a0ddf80DFFB49C87656625E65A37499B261D) {
    +++ description: None
      address:
-        "0xaF46a0ddf80DFFB49C87656625E65A37499B261D"
+        "eth:0xaF46a0ddf80DFFB49C87656625E65A37499B261D"
    }
```

```diff
    EOA  (0xBDc235cC9d6Baa641c5ae306bc83962475A5FEFf) {
    +++ description: None
      address:
-        "0xBDc235cC9d6Baa641c5ae306bc83962475A5FEFf"
+        "eth:0xBDc235cC9d6Baa641c5ae306bc83962475A5FEFf"
    }
```

```diff
    contract PolygonCreateRollupMultisig (0xC74eFc7fdb3BeC9c6930E91FFDF761b160dF79dB) {
    +++ description: None
      address:
-        "0xC74eFc7fdb3BeC9c6930E91FFDF761b160dF79dB"
+        "eth:0xC74eFc7fdb3BeC9c6930E91FFDF761b160dF79dB"
      values.$implementation:
-        "0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
+        "eth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
      values.$members.0:
-        "0x3038B4DBf022E80169b2A068290d4a3A8b87D3b5"
+        "eth:0x3038B4DBf022E80169b2A068290d4a3A8b87D3b5"
      values.$members.1:
-        "0xa43901c63f7702C407378E55E0d0EB4064a2AE31"
+        "eth:0xa43901c63f7702C407378E55E0d0EB4064a2AE31"
      values.$members.2:
-        "0xD9478f759a13Bfa1d9dAB3cDF5ff0C099d5EfCFC"
+        "eth:0xD9478f759a13Bfa1d9dAB3cDF5ff0C099d5EfCFC"
      values.$members.3:
-        "0xCE27d8BCee45dB3E457EcF8629264Ca7893AAaAc"
+        "eth:0xCE27d8BCee45dB3E457EcF8629264Ca7893AAaAc"
      values.$members.4:
-        "0x0B84d2e66192448B680BBd06813efF9e5923Ca77"
+        "eth:0x0B84d2e66192448B680BBd06813efF9e5923Ca77"
      values.$members.5:
-        "0x0185fb2F27f2Acda3e2a6B8530b342333e9f22A6"
+        "eth:0x0185fb2F27f2Acda3e2a6B8530b342333e9f22A6"
      values.$members.6:
-        "0x7316DeD96c4Ff756c74D1D9c4178f6921Aff4496"
+        "eth:0x7316DeD96c4Ff756c74D1D9c4178f6921Aff4496"
      values.$members.7:
-        "0xC8aaFEF5C3689c29143023Fe53cB3e833e0439e9"
+        "eth:0xC8aaFEF5C3689c29143023Fe53cB3e833e0439e9"
      implementationNames.0xC74eFc7fdb3BeC9c6930E91FFDF761b160dF79dB:
-        "GnosisSafeProxy"
      implementationNames.0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
-        "GnosisSafe"
      implementationNames.eth:0xC74eFc7fdb3BeC9c6930E91FFDF761b160dF79dB:
+        "GnosisSafeProxy"
      implementationNames.eth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
+        "GnosisSafe"
    }
```

```diff
    EOA  (0xC8aaFEF5C3689c29143023Fe53cB3e833e0439e9) {
    +++ description: None
      address:
-        "0xC8aaFEF5C3689c29143023Fe53cB3e833e0439e9"
+        "eth:0xC8aaFEF5C3689c29143023Fe53cB3e833e0439e9"
    }
```

```diff
    EOA  (0xcAB31b6A7b4d2eCd562A09e2BfA46535a18862f9) {
    +++ description: None
      address:
-        "0xcAB31b6A7b4d2eCd562A09e2BfA46535a18862f9"
+        "eth:0xcAB31b6A7b4d2eCd562A09e2BfA46535a18862f9"
    }
```

```diff
    EOA  (0xCE27d8BCee45dB3E457EcF8629264Ca7893AAaAc) {
    +++ description: None
      address:
-        "0xCE27d8BCee45dB3E457EcF8629264Ca7893AAaAc"
+        "eth:0xCE27d8BCee45dB3E457EcF8629264Ca7893AAaAc"
    }
```

```diff
    EOA  (0xD9478f759a13Bfa1d9dAB3cDF5ff0C099d5EfCFC) {
    +++ description: None
      address:
-        "0xD9478f759a13Bfa1d9dAB3cDF5ff0C099d5EfCFC"
+        "eth:0xD9478f759a13Bfa1d9dAB3cDF5ff0C099d5EfCFC"
    }
```

```diff
    EOA  (0xdFEd8373695a7b3DaF268CF91e71f6a7024A56Da) {
    +++ description: None
      address:
-        "0xdFEd8373695a7b3DaF268CF91e71f6a7024A56Da"
+        "eth:0xdFEd8373695a7b3DaF268CF91e71f6a7024A56Da"
    }
```

```diff
    EOA  (0xEad77b01ea770839F7f576Cd1516Ff6A298d9dB2) {
    +++ description: None
      address:
-        "0xEad77b01ea770839F7f576Cd1516Ff6A298d9dB2"
+        "eth:0xEad77b01ea770839F7f576Cd1516Ff6A298d9dB2"
    }
```

```diff
    EOA  (0xeD44D1CFfB91e163CB7126bdEeA83959f175dB37) {
    +++ description: None
      address:
-        "0xeD44D1CFfB91e163CB7126bdEeA83959f175dB37"
+        "eth:0xeD44D1CFfB91e163CB7126bdEeA83959f175dB37"
    }
```

```diff
    EOA  (0xED7cC82235A7757702475c8f77c7830c095FB5a2) {
    +++ description: None
      address:
-        "0xED7cC82235A7757702475c8f77c7830c095FB5a2"
+        "eth:0xED7cC82235A7757702475c8f77c7830c095FB5a2"
    }
```

```diff
    contract Timelock (0xEf1462451C30Ea7aD8555386226059Fe837CA4EF) {
    +++ description: A timelock with access control. In the case of an activated emergency state in the eth:0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2, all transactions through this timelock are immediately executable. The current minimum delay is 3d.
      address:
-        "0xEf1462451C30Ea7aD8555386226059Fe837CA4EF"
+        "eth:0xEf1462451C30Ea7aD8555386226059Fe837CA4EF"
      description:
-        "A timelock with access control. In the case of an activated emergency state in the 0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2, all transactions through this timelock are immediately executable. The current minimum delay is 3d."
+        "A timelock with access control. In the case of an activated emergency state in the eth:0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2, all transactions through this timelock are immediately executable. The current minimum delay is 3d."
      values.accessControl.TIMELOCK_ADMIN_ROLE.members.0:
-        "0xEf1462451C30Ea7aD8555386226059Fe837CA4EF"
+        "eth:0xEf1462451C30Ea7aD8555386226059Fe837CA4EF"
      values.accessControl.TIMELOCK_ADMIN_ROLE.members.1:
-        "0x242daE44F5d8fb54B198D03a94dA45B5a4413e21"
+        "eth:0x242daE44F5d8fb54B198D03a94dA45B5a4413e21"
      values.accessControl.PROPOSER_ROLE.members.0:
-        "0x242daE44F5d8fb54B198D03a94dA45B5a4413e21"
+        "eth:0x242daE44F5d8fb54B198D03a94dA45B5a4413e21"
      values.accessControl.EXECUTOR_ROLE.members.0:
-        "0x242daE44F5d8fb54B198D03a94dA45B5a4413e21"
+        "eth:0x242daE44F5d8fb54B198D03a94dA45B5a4413e21"
      values.accessControl.CANCELLER_ROLE.members.0:
-        "0x242daE44F5d8fb54B198D03a94dA45B5a4413e21"
+        "eth:0x242daE44F5d8fb54B198D03a94dA45B5a4413e21"
      values.polygonZkEVM:
-        "0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2"
+        "eth:0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2"
      values.scheduledTransactionsDecoded.0.inputs.implementation:
-        "0x301442aA888701c8B86727d42F3C55Fb0dd9eF7F"
+        "eth:0x301442aA888701c8B86727d42F3C55Fb0dd9eF7F"
      values.scheduledTransactionsDecoded.0.inputs.proxy:
-        "0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2"
+        "eth:0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2"
      values.scheduledTransactionsDecoded.0.target:
-        "0x0F99738B2Fc14D77308337f3e2596b63aE7BCC4A"
+        "eth:0x0F99738B2Fc14D77308337f3e2596b63aE7BCC4A"
      values.scheduledTransactionsDecoded.1.inputs.implementation:
-        "0xb1585916487AcEdD99952086f2950763D253b923"
+        "eth:0xb1585916487AcEdD99952086f2950763D253b923"
      values.scheduledTransactionsDecoded.1.inputs.proxy:
-        "0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2"
+        "eth:0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2"
      values.scheduledTransactionsDecoded.1.target:
-        "0x0F99738B2Fc14D77308337f3e2596b63aE7BCC4A"
+        "eth:0x0F99738B2Fc14D77308337f3e2596b63aE7BCC4A"
      values.scheduledTransactionsDecoded.2.inputs.implementation:
-        "0x2E38cD55163137483E30580Cb468C2dFf1d85077"
+        "eth:0x2E38cD55163137483E30580Cb468C2dFf1d85077"
      values.scheduledTransactionsDecoded.2.inputs.proxy:
-        "0x580bda1e7A0CFAe92Fa7F6c20A3794F169CE3CFb"
+        "eth:0x580bda1e7A0CFAe92Fa7F6c20A3794F169CE3CFb"
      values.scheduledTransactionsDecoded.2.target:
-        "0x0F99738B2Fc14D77308337f3e2596b63aE7BCC4A"
+        "eth:0x0F99738B2Fc14D77308337f3e2596b63aE7BCC4A"
      values.scheduledTransactionsDecoded.3.inputs.implementation:
-        "0x0FeB850B183C57534b56b7d56520133C8f9BDB65"
+        "eth:0x0FeB850B183C57534b56b7d56520133C8f9BDB65"
      values.scheduledTransactionsDecoded.3.inputs.proxy:
-        "0x2a3DD3EB832aF982ec71669E178424b10Dca2EDe"
+        "eth:0x2a3DD3EB832aF982ec71669E178424b10Dca2EDe"
      values.scheduledTransactionsDecoded.3.target:
-        "0x0F99738B2Fc14D77308337f3e2596b63aE7BCC4A"
+        "eth:0x0F99738B2Fc14D77308337f3e2596b63aE7BCC4A"
      values.scheduledTransactionsDecoded.4.inputs.data.zkEVMVerifier:
-        "0x1C3A3da552b8662CD69538356b1E7c2E9CC1EBD8"
+        "eth:0x1C3A3da552b8662CD69538356b1E7c2E9CC1EBD8"
      values.scheduledTransactionsDecoded.4.inputs.data.polygonZkEVM:
-        "0x519E42c24163192Dca44CD3fBDCEBF6be9130987"
+        "eth:0x519E42c24163192Dca44CD3fBDCEBF6be9130987"
      values.scheduledTransactionsDecoded.4.inputs.data.emergencyCouncil:
-        "0x37c58Dfa7BF0A165C5AAEdDf3e2EdB475ac6Dcb6"
+        "eth:0x37c58Dfa7BF0A165C5AAEdDf3e2EdB475ac6Dcb6"
      values.scheduledTransactionsDecoded.4.inputs.data.timelock:
-        "0xEf1462451C30Ea7aD8555386226059Fe837CA4EF"
+        "eth:0xEf1462451C30Ea7aD8555386226059Fe837CA4EF"
      values.scheduledTransactionsDecoded.4.inputs.data.admin:
-        "0x242daE44F5d8fb54B198D03a94dA45B5a4413e21"
+        "eth:0x242daE44F5d8fb54B198D03a94dA45B5a4413e21"
      values.scheduledTransactionsDecoded.4.inputs.data.trustedAggregator:
-        "0x6329Fe417621925C81c16F9F9a18c203C21Af7ab"
+        "eth:0x6329Fe417621925C81c16F9F9a18c203C21Af7ab"
      values.scheduledTransactionsDecoded.4.inputs.implementation:
-        "0x3b82Da772c825283d85d5d6717A77C6Ff582053b"
+        "eth:0x3b82Da772c825283d85d5d6717A77C6Ff582053b"
      values.scheduledTransactionsDecoded.4.inputs.proxy:
-        "0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2"
+        "eth:0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2"
      values.scheduledTransactionsDecoded.4.target:
-        "0x0F99738B2Fc14D77308337f3e2596b63aE7BCC4A"
+        "eth:0x0F99738B2Fc14D77308337f3e2596b63aE7BCC4A"
      values.scheduledTransactionsDecoded.5.target:
-        "0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2"
+        "eth:0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2"
      values.scheduledTransactionsDecoded.6.inputs.verifier:
-        "0x4AaBBA26EA9E7A7fbD052d17a167e6aE3F8eC7Be"
+        "eth:0x4AaBBA26EA9E7A7fbD052d17a167e6aE3F8eC7Be"
      values.scheduledTransactionsDecoded.6.inputs.consensusImplementation:
-        "0x2650a9a4fC64f63F573EF0F405064EF54BC46f71"
+        "eth:0x2650a9a4fC64f63F573EF0F405064EF54BC46f71"
      values.scheduledTransactionsDecoded.6.target:
-        "0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2"
+        "eth:0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2"
      values.scheduledTransactionsDecoded.7.inputs.rollupContract:
-        "0x519E42c24163192Dca44CD3fBDCEBF6be9130987"
+        "eth:0x519E42c24163192Dca44CD3fBDCEBF6be9130987"
      values.scheduledTransactionsDecoded.7.target:
-        "0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2"
+        "eth:0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2"
      values.scheduledTransactionsDecoded.8.inputs.verifier:
-        "0x4AaBBA26EA9E7A7fbD052d17a167e6aE3F8eC7Be"
+        "eth:0x4AaBBA26EA9E7A7fbD052d17a167e6aE3F8eC7Be"
      values.scheduledTransactionsDecoded.8.inputs.consensusImplementation:
-        "0x10D296e8aDd0535be71639E5D1d1c30ae1C6bD4C"
+        "eth:0x10D296e8aDd0535be71639E5D1d1c30ae1C6bD4C"
      values.scheduledTransactionsDecoded.8.target:
-        "0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2"
+        "eth:0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2"
      values.scheduledTransactionsDecoded.9.inputs.rollupContract:
-        "0x1E163594e13030244DCAf4cDfC2cd0ba3206DA80"
+        "eth:0x1E163594e13030244DCAf4cDfC2cd0ba3206DA80"
      values.scheduledTransactionsDecoded.9.target:
-        "0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2"
+        "eth:0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2"
      values.scheduledTransactionsDecoded.10.inputs.verifier:
-        "0x0775e11309d75aA6b0967917fB0213C5673eDf81"
+        "eth:0x0775e11309d75aA6b0967917fB0213C5673eDf81"
      values.scheduledTransactionsDecoded.10.inputs.consensusImplementation:
-        "0x2650a9a4fC64f63F573EF0F405064EF54BC46f71"
+        "eth:0x2650a9a4fC64f63F573EF0F405064EF54BC46f71"
      values.scheduledTransactionsDecoded.10.target:
-        "0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2"
+        "eth:0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2"
      values.scheduledTransactionsDecoded.11.inputs.account:
-        "0x242daE44F5d8fb54B198D03a94dA45B5a4413e21"
+        "eth:0x242daE44F5d8fb54B198D03a94dA45B5a4413e21"
      values.scheduledTransactionsDecoded.11.target:
-        "0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2"
+        "eth:0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2"
      values.scheduledTransactionsDecoded.12.inputs.verifier:
-        "0x0775e11309d75aA6b0967917fB0213C5673eDf81"
+        "eth:0x0775e11309d75aA6b0967917fB0213C5673eDf81"
      values.scheduledTransactionsDecoded.12.inputs.consensusImplementation:
-        "0x10D296e8aDd0535be71639E5D1d1c30ae1C6bD4C"
+        "eth:0x10D296e8aDd0535be71639E5D1d1c30ae1C6bD4C"
      values.scheduledTransactionsDecoded.12.target:
-        "0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2"
+        "eth:0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2"
      values.scheduledTransactionsDecoded.13.inputs.account:
-        "0xC74eFc7fdb3BeC9c6930E91FFDF761b160dF79dB"
+        "eth:0xC74eFc7fdb3BeC9c6930E91FFDF761b160dF79dB"
      values.scheduledTransactionsDecoded.13.target:
-        "0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2"
+        "eth:0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2"
      values.scheduledTransactionsDecoded.14.inputs.verifier:
-        "0xc521580cd8586Cc688A7430F9DcE0f6A803F2883"
+        "eth:0xc521580cd8586Cc688A7430F9DcE0f6A803F2883"
      values.scheduledTransactionsDecoded.14.inputs.consensusImplementation:
-        "0x2650a9a4fC64f63F573EF0F405064EF54BC46f71"
+        "eth:0x2650a9a4fC64f63F573EF0F405064EF54BC46f71"
      values.scheduledTransactionsDecoded.14.target:
-        "0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2"
+        "eth:0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2"
      values.scheduledTransactionsDecoded.15.inputs.implementation:
-        "0x9Bdda421219900454E94e01d641fE64c60D8f4C8"
+        "eth:0x9Bdda421219900454E94e01d641fE64c60D8f4C8"
      values.scheduledTransactionsDecoded.15.inputs.proxy:
-        "0x580bda1e7A0CFAe92Fa7F6c20A3794F169CE3CFb"
+        "eth:0x580bda1e7A0CFAe92Fa7F6c20A3794F169CE3CFb"
      values.scheduledTransactionsDecoded.15.target:
-        "0x0F99738B2Fc14D77308337f3e2596b63aE7BCC4A"
+        "eth:0x0F99738B2Fc14D77308337f3e2596b63aE7BCC4A"
      values.scheduledTransactionsDecoded.16.inputs.implementation:
-        "0x103388f5661d224F4aFb555C7E4a8FB52d0b752d"
+        "eth:0x103388f5661d224F4aFb555C7E4a8FB52d0b752d"
      values.scheduledTransactionsDecoded.16.inputs.proxy:
-        "0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2"
+        "eth:0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2"
      values.scheduledTransactionsDecoded.16.target:
-        "0x0F99738B2Fc14D77308337f3e2596b63aE7BCC4A"
+        "eth:0x0F99738B2Fc14D77308337f3e2596b63aE7BCC4A"
      values.scheduledTransactionsDecoded.17.inputs.verifier:
-        "0x9B9671dB83CfcB4508bF361942488C5cA2b1286D"
+        "eth:0x9B9671dB83CfcB4508bF361942488C5cA2b1286D"
      values.scheduledTransactionsDecoded.17.inputs.consensusImplementation:
-        "0x7253F329302b1b5E774Ac641EA3743E9E3244f2E"
+        "eth:0x7253F329302b1b5E774Ac641EA3743E9E3244f2E"
      values.scheduledTransactionsDecoded.17.target:
-        "0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2"
+        "eth:0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2"
      values.scheduledTransactionsDecoded.18.inputs.verifier:
-        "0x9B9671dB83CfcB4508bF361942488C5cA2b1286D"
+        "eth:0x9B9671dB83CfcB4508bF361942488C5cA2b1286D"
      values.scheduledTransactionsDecoded.18.inputs.consensusImplementation:
-        "0x427113ae6F319BfFb4459bfF96eb8B6BDe1A127F"
+        "eth:0x427113ae6F319BfFb4459bfF96eb8B6BDe1A127F"
      values.scheduledTransactionsDecoded.18.target:
-        "0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2"
+        "eth:0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2"
      values.scheduledTransactionsDecoded.19.inputs.verifier:
-        "0x455ac63E96e6a64EA59C6Da0D8F90FCa3F1535aB"
+        "eth:0x455ac63E96e6a64EA59C6Da0D8F90FCa3F1535aB"
      values.scheduledTransactionsDecoded.19.inputs.consensusImplementation:
-        "0x427113ae6F319BfFb4459bfF96eb8B6BDe1A127F"
+        "eth:0x427113ae6F319BfFb4459bfF96eb8B6BDe1A127F"
      values.scheduledTransactionsDecoded.19.target:
-        "0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2"
+        "eth:0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2"
      values.scheduledTransactionsDecoded.20.target:
-        "0xEf1462451C30Ea7aD8555386226059Fe837CA4EF"
+        "eth:0xEf1462451C30Ea7aD8555386226059Fe837CA4EF"
      values.scheduledTransactionsDecoded.21.inputs.implementation:
-        "0xA33619940bceb9be7c9679Dd80FA2918C2476382"
+        "eth:0xA33619940bceb9be7c9679Dd80FA2918C2476382"
      values.scheduledTransactionsDecoded.21.inputs.proxy:
-        "0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2"
+        "eth:0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2"
      values.scheduledTransactionsDecoded.21.target:
-        "0x0F99738B2Fc14D77308337f3e2596b63aE7BCC4A"
+        "eth:0x0F99738B2Fc14D77308337f3e2596b63aE7BCC4A"
      values.scheduledTransactionsDecoded.22.target:
-        "0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2"
+        "eth:0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2"
      values.scheduledTransactionsDecoded.23.inputs.verifier:
-        "0xE00a3cBFC45241b33c0A44C78e26168CBc55EC63"
+        "eth:0xE00a3cBFC45241b33c0A44C78e26168CBc55EC63"
      values.scheduledTransactionsDecoded.23.inputs.consensusImplementation:
-        "0x18C45DD422f6587357a6d3b23307E75D42b2bc5B"
+        "eth:0x18C45DD422f6587357a6d3b23307E75D42b2bc5B"
      values.scheduledTransactionsDecoded.23.target:
-        "0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2"
+        "eth:0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2"
      values.scheduledTransactionsDecoded.24.inputs.verifier:
-        "0x0459d576A6223fEeA177Fb3DF53C9c77BF84C459"
+        "eth:0x0459d576A6223fEeA177Fb3DF53C9c77BF84C459"
      values.scheduledTransactionsDecoded.24.inputs.consensusImplementation:
-        "0x18C45DD422f6587357a6d3b23307E75D42b2bc5B"
+        "eth:0x18C45DD422f6587357a6d3b23307E75D42b2bc5B"
      values.scheduledTransactionsDecoded.24.target:
-        "0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2"
+        "eth:0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2"
      values.scheduledTransactionsDecoded.25.inputs.implementation:
-        "0x9ab2cB2107d3E737f7977B2E5042C58dE98326ab"
+        "eth:0x9ab2cB2107d3E737f7977B2E5042C58dE98326ab"
      values.scheduledTransactionsDecoded.25.inputs.proxy:
-        "0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2"
+        "eth:0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2"
      values.scheduledTransactionsDecoded.25.target:
-        "0x0F99738B2Fc14D77308337f3e2596b63aE7BCC4A"
+        "eth:0x0F99738B2Fc14D77308337f3e2596b63aE7BCC4A"
      values.scheduledTransactionsDecoded.26.inputs.implementation:
-        "0x75D28BfDfF93B3e4f20184b442d2634DC01cA48b"
+        "eth:0x75D28BfDfF93B3e4f20184b442d2634DC01cA48b"
      values.scheduledTransactionsDecoded.26.inputs.proxy:
-        "0x2a3DD3EB832aF982ec71669E178424b10Dca2EDe"
+        "eth:0x2a3DD3EB832aF982ec71669E178424b10Dca2EDe"
      values.scheduledTransactionsDecoded.26.target:
-        "0x0F99738B2Fc14D77308337f3e2596b63aE7BCC4A"
+        "eth:0x0F99738B2Fc14D77308337f3e2596b63aE7BCC4A"
      values.scheduledTransactionsDecoded.27.inputs.implementation:
-        "0xc38C76aE3C8A7dee99d07f1A39246ABe18919a48"
+        "eth:0xc38C76aE3C8A7dee99d07f1A39246ABe18919a48"
      values.scheduledTransactionsDecoded.27.inputs.proxy:
-        "0x580bda1e7A0CFAe92Fa7F6c20A3794F169CE3CFb"
+        "eth:0x580bda1e7A0CFAe92Fa7F6c20A3794F169CE3CFb"
      values.scheduledTransactionsDecoded.27.target:
-        "0x0F99738B2Fc14D77308337f3e2596b63aE7BCC4A"
+        "eth:0x0F99738B2Fc14D77308337f3e2596b63aE7BCC4A"
      values.scheduledTransactionsDecoded.28.inputs.rollupContract:
-        "0xFE797cb13f7884FB9f0aE26fEB2a06ed8efccbe7"
+        "eth:0xFE797cb13f7884FB9f0aE26fEB2a06ed8efccbe7"
      values.scheduledTransactionsDecoded.28.target:
-        "0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2"
+        "eth:0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2"
      values.scheduledTransactionsDecoded.29.inputs.rollupContract:
-        "0x7449449460b5B732A9754CA3d9A7916122A9190d"
+        "eth:0x7449449460b5B732A9754CA3d9A7916122A9190d"
      values.scheduledTransactionsDecoded.29.target:
-        "0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2"
+        "eth:0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2"
      values.scheduledTransactionsDecoded.30.inputs.rollupContract:
-        "0x88404dD30A96AD25A765d733429Cf83138c7f8f4"
+        "eth:0x88404dD30A96AD25A765d733429Cf83138c7f8f4"
      values.scheduledTransactionsDecoded.30.target:
-        "0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2"
+        "eth:0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2"
      values.scheduledTransactionsDecoded.31.inputs.rollupContract:
-        "0xC427E3Edc8ae4BD2698cbef251E06b83175f9dec"
+        "eth:0xC427E3Edc8ae4BD2698cbef251E06b83175f9dec"
      values.scheduledTransactionsDecoded.31.target:
-        "0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2"
+        "eth:0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2"
      values.scheduledTransactionsDecoded.32.inputs.rollupContract:
-        "0x100d3ca4f97776A40A7D93dB4AbF0FEA34230666"
+        "eth:0x100d3ca4f97776A40A7D93dB4AbF0FEA34230666"
      values.scheduledTransactionsDecoded.32.target:
-        "0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2"
+        "eth:0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2"
      values.scheduledTransactionsDecoded.33.inputs.verifier:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.scheduledTransactionsDecoded.33.inputs.consensusImplementation:
-        "0xe7FE45579D784DC83B0feD844A65f4cEEFDe5682"
+        "eth:0xe7FE45579D784DC83B0feD844A65f4cEEFDe5682"
      values.scheduledTransactionsDecoded.33.target:
-        "0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2"
+        "eth:0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2"
      values.timelockAdminAC.0:
-        "0xEf1462451C30Ea7aD8555386226059Fe837CA4EF"
+        "eth:0xEf1462451C30Ea7aD8555386226059Fe837CA4EF"
      values.timelockAdminAC.1:
-        "0x242daE44F5d8fb54B198D03a94dA45B5a4413e21"
+        "eth:0x242daE44F5d8fb54B198D03a94dA45B5a4413e21"
      implementationNames.0xEf1462451C30Ea7aD8555386226059Fe837CA4EF:
-        "PolygonZkEVMTimelock"
      implementationNames.eth:0xEf1462451C30Ea7aD8555386226059Fe837CA4EF:
+        "PolygonZkEVMTimelock"
    }
```

```diff
    EOA  (0xFe45baf0F18c207152A807c1b05926583CFE2e4b) {
    +++ description: None
      address:
-        "0xFe45baf0F18c207152A807c1b05926583CFE2e4b"
+        "eth:0xFe45baf0F18c207152A807c1b05926583CFE2e4b"
    }
```

```diff
    EOA  (0xffbfc0c8331C5fc912DDA3C6D4A86eEB80203238) {
    +++ description: None
      address:
-        "0xffbfc0c8331C5fc912DDA3C6D4A86eEB80203238"
+        "eth:0xffbfc0c8331C5fc912DDA3C6D4A86eEB80203238"
    }
```

```diff
+   Status: CREATED
    contract SP1Verifier (0x0459d576A6223fEeA177Fb3DF53C9c77BF84C459)
    +++ description: Verifier contract for SP1 proofs (v5.0.0).
```

```diff
+   Status: CREATED
    contract AggLayerGateway (0x046Bb8bb98Db4ceCbB2929542686B74b516274b3)
    +++ description: A verifier gateway for pessimistic proofs. Manages a map of chains and their verifier keys and is used to route proofs based on the first 4 bytes of proofBytes data in a proof submission. The SP1 verifier is used for all proofs.
```

```diff
+   Status: CREATED
    contract SharedProxyAdmin (0x0F99738B2Fc14D77308337f3e2596b63aE7BCC4A)
    +++ description: None
```

```diff
+   Status: CREATED
    contract PolygonAdminMultisig (0x242daE44F5d8fb54B198D03a94dA45B5a4413e21)
    +++ description: None
```

```diff
+   Status: CREATED
    contract PolygonSharedBridge (0x2a3DD3EB832aF982ec71669E178424b10Dca2EDe)
    +++ description: The shared bridge contract, escrowing user funds sent to AggLayer participants. It is usually mirrored on each chain and can be used to transfer both ERC20 assets and arbitrary messages.
```

```diff
+   Status: CREATED
    contract PolygonSecurityCouncil (0x37c58Dfa7BF0A165C5AAEdDf3e2EdB475ac6Dcb6)
    +++ description: None
```

```diff
+   Status: CREATED
    contract PolygonRollupManager (0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2)
    +++ description: The central shared managing contract for Polygon AggLayer chains. This contract coordinates chain deployments and proof validation. All connected Layer 2s can be globally paused by activating the 'Emergency State'. This can be done by the eth:0x37c58Dfa7BF0A165C5AAEdDf3e2EdB475ac6Dcb6 or by anyone after 1 week of inactive verifiers.
```

```diff
+   Status: CREATED
    contract PolygonGlobalExitRootV2 (0x580bda1e7A0CFAe92Fa7F6c20A3794F169CE3CFb)
    +++ description: A merkle tree storage contract aggregating state roots of each participating Layer 2, thus creating a single global merkle root representing the global state of the AggLayer, the 'global exit root'. The global exit root is synchronized to all connected Layer 2s to help with their interoperability.
```

```diff
+   Status: CREATED
    contract PolygonCreateRollupMultisig (0xC74eFc7fdb3BeC9c6930E91FFDF761b160dF79dB)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Timelock (0xEf1462451C30Ea7aD8555386226059Fe837CA4EF)
    +++ description: A timelock with access control. In the case of an activated emergency state in the eth:0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2, all transactions through this timelock are immediately executable. The current minimum delay is 3d.
```

Generated with discovered.json: 0xb3834fe429266df9ef245873daa1d91c330a3545

# Diff at Fri, 04 Jul 2025 12:19:19 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f56dc47fe915564d4555300304da4d3bcbc087f block: 22829897
- current block number: 22829897

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22829897 (main branch discovery), not current.

```diff
    contract SharedProxyAdmin (0x0F99738B2Fc14D77308337f3e2596b63aE7BCC4A) {
    +++ description: None
      directlyReceivedPermissions.0.from:
-        "ethereum:0x046Bb8bb98Db4ceCbB2929542686B74b516274b3"
+        "eth:0x046Bb8bb98Db4ceCbB2929542686B74b516274b3"
      directlyReceivedPermissions.1.from:
-        "ethereum:0x2a3DD3EB832aF982ec71669E178424b10Dca2EDe"
+        "eth:0x2a3DD3EB832aF982ec71669E178424b10Dca2EDe"
      directlyReceivedPermissions.2.from:
-        "ethereum:0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2"
+        "eth:0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2"
      directlyReceivedPermissions.3.from:
-        "ethereum:0x580bda1e7A0CFAe92Fa7F6c20A3794F169CE3CFb"
+        "eth:0x580bda1e7A0CFAe92Fa7F6c20A3794F169CE3CFb"
    }
```

```diff
    EOA  (0x20A53dCb196cD2bcc14Ece01F358f1C849aA51dE) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2"
+        "eth:0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2"
    }
```

```diff
    contract PolygonAdminMultisig (0x242daE44F5d8fb54B198D03a94dA45B5a4413e21) {
    +++ description: None
      receivedPermissions.0.via.0.address:
-        "ethereum:0xEf1462451C30Ea7aD8555386226059Fe837CA4EF"
+        "eth:0xEf1462451C30Ea7aD8555386226059Fe837CA4EF"
      receivedPermissions.0.from:
-        "ethereum:0x046Bb8bb98Db4ceCbB2929542686B74b516274b3"
+        "eth:0x046Bb8bb98Db4ceCbB2929542686B74b516274b3"
      receivedPermissions.1.from:
-        "ethereum:0x046Bb8bb98Db4ceCbB2929542686B74b516274b3"
+        "eth:0x046Bb8bb98Db4ceCbB2929542686B74b516274b3"
      receivedPermissions.2.from:
-        "ethereum:0x046Bb8bb98Db4ceCbB2929542686B74b516274b3"
+        "eth:0x046Bb8bb98Db4ceCbB2929542686B74b516274b3"
      receivedPermissions.3.via.0.address:
-        "ethereum:0xEf1462451C30Ea7aD8555386226059Fe837CA4EF"
+        "eth:0xEf1462451C30Ea7aD8555386226059Fe837CA4EF"
      receivedPermissions.3.from:
-        "ethereum:0x2a3DD3EB832aF982ec71669E178424b10Dca2EDe"
+        "eth:0x2a3DD3EB832aF982ec71669E178424b10Dca2EDe"
      receivedPermissions.4.from:
-        "ethereum:0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2"
+        "eth:0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2"
      receivedPermissions.5.via.0.address:
-        "ethereum:0xEf1462451C30Ea7aD8555386226059Fe837CA4EF"
+        "eth:0xEf1462451C30Ea7aD8555386226059Fe837CA4EF"
      receivedPermissions.5.from:
-        "ethereum:0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2"
+        "eth:0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2"
      receivedPermissions.6.from:
-        "ethereum:0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2"
+        "eth:0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2"
      receivedPermissions.7.via.0.address:
-        "ethereum:0xEf1462451C30Ea7aD8555386226059Fe837CA4EF"
+        "eth:0xEf1462451C30Ea7aD8555386226059Fe837CA4EF"
      receivedPermissions.7.from:
-        "ethereum:0xEf1462451C30Ea7aD8555386226059Fe837CA4EF"
+        "eth:0xEf1462451C30Ea7aD8555386226059Fe837CA4EF"
      receivedPermissions.8.from:
-        "ethereum:0xEf1462451C30Ea7aD8555386226059Fe837CA4EF"
+        "eth:0xEf1462451C30Ea7aD8555386226059Fe837CA4EF"
      receivedPermissions.9.via.1.address:
-        "ethereum:0xEf1462451C30Ea7aD8555386226059Fe837CA4EF"
+        "eth:0xEf1462451C30Ea7aD8555386226059Fe837CA4EF"
      receivedPermissions.9.via.0.address:
-        "ethereum:0x0F99738B2Fc14D77308337f3e2596b63aE7BCC4A"
+        "eth:0x0F99738B2Fc14D77308337f3e2596b63aE7BCC4A"
      receivedPermissions.9.from:
-        "ethereum:0x046Bb8bb98Db4ceCbB2929542686B74b516274b3"
+        "eth:0x046Bb8bb98Db4ceCbB2929542686B74b516274b3"
      receivedPermissions.10.via.1.address:
-        "ethereum:0xEf1462451C30Ea7aD8555386226059Fe837CA4EF"
+        "eth:0xEf1462451C30Ea7aD8555386226059Fe837CA4EF"
      receivedPermissions.10.via.0.address:
-        "ethereum:0x0F99738B2Fc14D77308337f3e2596b63aE7BCC4A"
+        "eth:0x0F99738B2Fc14D77308337f3e2596b63aE7BCC4A"
      receivedPermissions.10.from:
-        "ethereum:0x2a3DD3EB832aF982ec71669E178424b10Dca2EDe"
+        "eth:0x2a3DD3EB832aF982ec71669E178424b10Dca2EDe"
      receivedPermissions.11.via.1.address:
-        "ethereum:0xEf1462451C30Ea7aD8555386226059Fe837CA4EF"
+        "eth:0xEf1462451C30Ea7aD8555386226059Fe837CA4EF"
      receivedPermissions.11.via.0.address:
-        "ethereum:0x0F99738B2Fc14D77308337f3e2596b63aE7BCC4A"
+        "eth:0x0F99738B2Fc14D77308337f3e2596b63aE7BCC4A"
      receivedPermissions.11.from:
-        "ethereum:0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2"
+        "eth:0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2"
      receivedPermissions.12.via.1.address:
-        "ethereum:0xEf1462451C30Ea7aD8555386226059Fe837CA4EF"
+        "eth:0xEf1462451C30Ea7aD8555386226059Fe837CA4EF"
      receivedPermissions.12.via.0.address:
-        "ethereum:0x0F99738B2Fc14D77308337f3e2596b63aE7BCC4A"
+        "eth:0x0F99738B2Fc14D77308337f3e2596b63aE7BCC4A"
      receivedPermissions.12.from:
-        "ethereum:0x580bda1e7A0CFAe92Fa7F6c20A3794F169CE3CFb"
+        "eth:0x580bda1e7A0CFAe92Fa7F6c20A3794F169CE3CFb"
      directlyReceivedPermissions.0.from:
-        "ethereum:0xEf1462451C30Ea7aD8555386226059Fe837CA4EF"
+        "eth:0xEf1462451C30Ea7aD8555386226059Fe837CA4EF"
    }
```

```diff
    contract PolygonSecurityCouncil (0x37c58Dfa7BF0A165C5AAEdDf3e2EdB475ac6Dcb6) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2"
+        "eth:0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2"
    }
```

```diff
    EOA  (0x6329Fe417621925C81c16F9F9a18c203C21Af7ab) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2"
+        "eth:0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2"
    }
```

```diff
    contract PolygonCreateRollupMultisig (0xC74eFc7fdb3BeC9c6930E91FFDF761b160dF79dB) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2"
+        "eth:0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2"
    }
```

```diff
    contract Timelock (0xEf1462451C30Ea7aD8555386226059Fe837CA4EF) {
    +++ description: A timelock with access control. In the case of an activated emergency state in the 0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2, all transactions through this timelock are immediately executable. The current minimum delay is 3d.
      directlyReceivedPermissions.0.from:
-        "ethereum:0x0F99738B2Fc14D77308337f3e2596b63aE7BCC4A"
+        "eth:0x0F99738B2Fc14D77308337f3e2596b63aE7BCC4A"
      directlyReceivedPermissions.1.from:
-        "ethereum:0xEf1462451C30Ea7aD8555386226059Fe837CA4EF"
+        "eth:0xEf1462451C30Ea7aD8555386226059Fe837CA4EF"
      directlyReceivedPermissions.2.from:
-        "ethereum:0x046Bb8bb98Db4ceCbB2929542686B74b516274b3"
+        "eth:0x046Bb8bb98Db4ceCbB2929542686B74b516274b3"
      directlyReceivedPermissions.3.from:
-        "ethereum:0x2a3DD3EB832aF982ec71669E178424b10Dca2EDe"
+        "eth:0x2a3DD3EB832aF982ec71669E178424b10Dca2EDe"
      directlyReceivedPermissions.4.from:
-        "ethereum:0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2"
+        "eth:0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2"
      directlyReceivedPermissions.5.from:
-        "ethereum:0xEf1462451C30Ea7aD8555386226059Fe837CA4EF"
+        "eth:0xEf1462451C30Ea7aD8555386226059Fe837CA4EF"
    }
```

Generated with discovered.json: 0xaaf4a424a5ceb181a0342a9cf9593fadb1e6362f

# Diff at Wed, 02 Jul 2025 16:35:40 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@f7cc75f3e93efbba70ffb8d54f4aeceb76299220 block: 22816820
- current block number: 22829897

## Description

Config: clarify some descriptions.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22816820 (main branch discovery), not current.

```diff
    contract AggLayerGateway (0x046Bb8bb98Db4ceCbB2929542686B74b516274b3) {
    +++ description: A verifier gateway for pessimistic proofs. Manages a map of chains and their verifier keys and is used to route proofs based on the first 4 bytes of proofBytes data in a proof submission. The SP1 verifier is used for all proofs.
      fieldMeta.aggchainVKeys.description:
-        "First 2 bytes of the 'selector' are the 'verification key identifier', the last 2 bytes are the aggchain type (ex: FEP, ECDSA). This map is not used in verifyPessimisticProof()."
+        "The aggchainVkey is the second level vkey wrapping the op-succinct proofs and being wrapped by the pessimistic proof. It exists to allow a pessimistic cdk chain to define additional proofs on top of the PP. First 2 bytes of the 'selector' are the 'verification key identifier', the last 2 bytes are the aggchain type (ex: FEP, ECDSA). This map is e.g. used by AggchainFEP.getAggchainVKey()."
      fieldMeta.routes.description:
-        "This map is used for routing in verifyPessimisticProof()."
+        "This map is used for routing in verifyPessimisticProof(). The pessimisticVkey is the top level vkey that is used by the onchain verifier. It wraps the aggchainVKey."
      fieldMeta.routes.severity:
+        "HIGH"
      fieldMeta.aggchainVKeysUpdated:
+        {"description":"emitted when an existing aggchainVKey in `aggchainVKeys` is updated."}
    }
```

```diff
    contract PolygonAdminMultisig (0x242daE44F5d8fb54B198D03a94dA45B5a4413e21) {
    +++ description: None
      receivedPermissions.0.description:
-        "add new routes from proof selector to verifier / vKey for pessimistic proofs."
+        "add new routes from proof selector to verifier / pessimisticVkey for pessimistic proofs."
      receivedPermissions.1.description:
-        "add or update default aggchain verification keys."
+        "add or update default aggchain verification keys (aggchainVkey) for any given selectors."
      receivedPermissions.2.description:
-        "freeze routes from proof selector to verifier / vKey for pessimistic proofs."
+        "freeze routes from proof selector to verifier / pessimisticVkey for pessimistic proofs."
    }
```

```diff
    contract Timelock (0xEf1462451C30Ea7aD8555386226059Fe837CA4EF) {
    +++ description: A timelock with access control. In the case of an activated emergency state in the 0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2, all transactions through this timelock are immediately executable. The current minimum delay is 3d.
      directlyReceivedPermissions.2.description:
-        "add new routes from proof selector to verifier / vKey for pessimistic proofs."
+        "add new routes from proof selector to verifier / pessimisticVkey for pessimistic proofs."
    }
```

Generated with discovered.json: 0x07da52b96d7aa63f333391a496012d2c81a25c5c

# Diff at Fri, 27 Jun 2025 15:10:51 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@0486f9e4c91d499528f32792e73e81ff4cc57d2c block: 22774522
- current block number: 22796580

## Description

add new rollupType: AggChainFEP (prly katana).

https://etherscan.io/address/0xe7FE45579D784DC83B0feD844A65f4cEEFDe5682#code

type not used by katana yet.

## Watched changes

```diff
    contract PolygonRollupManager (0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2) {
    +++ description: The central shared managing contract for Polygon AggLayer chains. This contract coordinates chain deployments and proof validation. All connected Layer 2s can be globally paused by activating the 'Emergency State'. This can be done by the 0x37c58Dfa7BF0A165C5AAEdDf3e2EdB475ac6Dcb6 or by anyone after 1 week of inactive verifiers.
      values.rollupsDataV2.19.programVKey:
-        "0x00eff0b6998df46ec388bb305618089ae3dc74e513e7676b2e1909694f49cc30"
+        "0x0000000000000000000000000000000000000000000000000000000000000000"
      values.rollupsDataV2.19.rollupVerifierType:
-        1
+        2
      values.rollupsDataV2.19.rollupTypeID:
-        11
+        12
      values.rollupsDataV2.19.forkID:
-        12
+        0
      values.rollupsDataV2.19.verifier:
-        "0x0459d576A6223fEeA177Fb3DF53C9c77BF84C459"
+        "0x0000000000000000000000000000000000000000"
      values.rollupTypeCount:
-        11
+        12
+++ description: struct consensusImplementation, verifier, forkID, rollupVerifierType, obsolete, programVKey
      values.rollupTypes.11:
+        {"consensusImplementation":"0xe7FE45579D784DC83B0feD844A65f4cEEFDe5682","verifier":"0x0000000000000000000000000000000000000000","forkID":0,"rollupVerifierType":2,"obsolete":false,"programVKey":"0x0000000000000000000000000000000000000000000000000000000000000000"}
    }
```

Generated with discovered.json: 0x999e4a9ce02c16d8178c32b64eb3c72fac9f9e59

# Diff at Tue, 24 Jun 2025 15:18:11 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@165a3574e7a5112b92cf5b6d87a202235001fcdf block: 22744056
- current block number: 22774522

## Description

agglayer v0.3.0 upgrade.
- pessimistic proofs router: 'algateway', manages a selector -> (verifier,vkey) mapping used for `verifyPessimisticProof()` and a yet unused aggchainselector -> vkey mapping
- new 'factory' for wrapped tokens in the bridge: a wrapped token contract gets deployed when `PolygonRollupManager.claimAsset()` is called for an asset that does not exist on this chain. previously these token contracts were not upgradeable, now they are (most likely by the `PolygonZkEVMBridgeV2.proxiedTokensManager()`, pinged polygon team to verify the proxy bytecode).

## Watched changes

```diff
    contract SharedProxyAdmin (0x0F99738B2Fc14D77308337f3e2596b63aE7BCC4A) {
    +++ description: None
      directlyReceivedPermissions.3:
+        {"permission":"upgrade","from":"ethereum:0x2a3DD3EB832aF982ec71669E178424b10Dca2EDe","role":"admin"}
      directlyReceivedPermissions.2.from:
-        "ethereum:0x2a3DD3EB832aF982ec71669E178424b10Dca2EDe"
+        "ethereum:0x046Bb8bb98Db4ceCbB2929542686B74b516274b3"
    }
```

```diff
    contract PolygonAdminMultisig (0x242daE44F5d8fb54B198D03a94dA45B5a4413e21) {
    +++ description: None
      receivedPermissions.12:
+        {"permission":"upgrade","from":"ethereum:0x2a3DD3EB832aF982ec71669E178424b10Dca2EDe","role":"admin","via":[{"address":"ethereum:0x0F99738B2Fc14D77308337f3e2596b63aE7BCC4A"},{"address":"ethereum:0xEf1462451C30Ea7aD8555386226059Fe837CA4EF","delay":259200,"condition":"(no delay if in emergency state)"}]}
      receivedPermissions.11:
+        {"permission":"upgrade","from":"ethereum:0x046Bb8bb98Db4ceCbB2929542686B74b516274b3","role":"admin","via":[{"address":"ethereum:0x0F99738B2Fc14D77308337f3e2596b63aE7BCC4A"},{"address":"ethereum:0xEf1462451C30Ea7aD8555386226059Fe837CA4EF","delay":259200,"condition":"(no delay if in emergency state)"}]}
      receivedPermissions.10:
+        {"permission":"interact","from":"ethereum:0x046Bb8bb98Db4ceCbB2929542686B74b516274b3","description":"add or update default aggchain verification keys.","role":".aggchainDefaultVKeyAC"}
      receivedPermissions.9:
+        {"permission":"upgrade","from":"ethereum:0x580bda1e7A0CFAe92Fa7F6c20A3794F169CE3CFb","role":"admin","via":[{"address":"ethereum:0x0F99738B2Fc14D77308337f3e2596b63aE7BCC4A"},{"address":"ethereum:0xEf1462451C30Ea7aD8555386226059Fe837CA4EF","delay":259200,"condition":"(no delay if in emergency state)"}]}
      receivedPermissions.8:
+        {"permission":"upgrade","from":"ethereum:0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2","role":"admin","via":[{"address":"ethereum:0x0F99738B2Fc14D77308337f3e2596b63aE7BCC4A"},{"address":"ethereum:0xEf1462451C30Ea7aD8555386226059Fe837CA4EF","delay":259200,"condition":"(no delay if in emergency state)"}]}
      receivedPermissions.7.permission:
-        "upgrade"
+        "interact"
      receivedPermissions.7.role:
-        "admin"
+        ".proxiedTokensManager"
      receivedPermissions.7.via.1:
-        {"address":"ethereum:0xEf1462451C30Ea7aD8555386226059Fe837CA4EF","delay":259200,"condition":"(no delay if in emergency state)"}
      receivedPermissions.7.via.0.address:
-        "ethereum:0x0F99738B2Fc14D77308337f3e2596b63aE7BCC4A"
+        "ethereum:0xEf1462451C30Ea7aD8555386226059Fe837CA4EF"
      receivedPermissions.7.via.0.delay:
+        259200
      receivedPermissions.7.via.0.condition:
+        "(no delay if in emergency state)"
      receivedPermissions.7.description:
+        "upgrade the implementation of wrapped tokens deployed by the bridge."
      receivedPermissions.6.permission:
-        "upgrade"
+        "interact"
      receivedPermissions.6.from:
-        "ethereum:0x580bda1e7A0CFAe92Fa7F6c20A3794F169CE3CFb"
+        "ethereum:0xEf1462451C30Ea7aD8555386226059Fe837CA4EF"
      receivedPermissions.6.role:
-        "admin"
+        ".timelockAdminAC"
      receivedPermissions.6.via.1:
-        {"address":"ethereum:0xEf1462451C30Ea7aD8555386226059Fe837CA4EF","delay":259200,"condition":"(no delay if in emergency state)"}
      receivedPermissions.6.via.0.address:
-        "ethereum:0x0F99738B2Fc14D77308337f3e2596b63aE7BCC4A"
+        "ethereum:0xEf1462451C30Ea7aD8555386226059Fe837CA4EF"
      receivedPermissions.6.via.0.delay:
+        259200
      receivedPermissions.6.via.0.condition:
+        "(no delay if in emergency state)"
      receivedPermissions.6.delay:
+        259200
      receivedPermissions.6.description:
+        "propose, cancel and execute transactions in the timelock, manage all access control roles and change the minimum delay."
      receivedPermissions.6.condition:
+        "(no delay if in emergency state)"
      receivedPermissions.5.permission:
-        "upgrade"
+        "interact"
      receivedPermissions.5.from:
-        "ethereum:0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2"
+        "ethereum:0xEf1462451C30Ea7aD8555386226059Fe837CA4EF"
      receivedPermissions.5.role:
-        "admin"
+        ".timelockAdminAC"
      receivedPermissions.5.via:
-        [{"address":"ethereum:0x0F99738B2Fc14D77308337f3e2596b63aE7BCC4A"},{"address":"ethereum:0xEf1462451C30Ea7aD8555386226059Fe837CA4EF","delay":259200,"condition":"(no delay if in emergency state)"}]
      receivedPermissions.5.delay:
+        259200
      receivedPermissions.5.description:
+        "propose, cancel and execute transactions in the timelock, manage all access control roles and change the minimum delay."
      receivedPermissions.5.condition:
+        "(no delay if in emergency state)"
      receivedPermissions.4.from:
-        "ethereum:0xEf1462451C30Ea7aD8555386226059Fe837CA4EF"
+        "ethereum:0x046Bb8bb98Db4ceCbB2929542686B74b516274b3"
      receivedPermissions.4.delay:
-        259200
      receivedPermissions.4.description:
-        "propose, cancel and execute transactions in the timelock, manage all access control roles and change the minimum delay."
+        "freeze routes from proof selector to verifier / vKey for pessimistic proofs."
      receivedPermissions.4.role:
-        ".timelockAdminAC"
+        ".freezePpRouteAC"
      receivedPermissions.4.condition:
-        "(no delay if in emergency state)"
      receivedPermissions.4.via:
-        [{"address":"ethereum:0xEf1462451C30Ea7aD8555386226059Fe837CA4EF","delay":259200,"condition":"(no delay if in emergency state)"}]
      receivedPermissions.3.from:
-        "ethereum:0xEf1462451C30Ea7aD8555386226059Fe837CA4EF"
+        "ethereum:0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2"
      receivedPermissions.3.delay:
-        259200
      receivedPermissions.3.description:
-        "propose, cancel and execute transactions in the timelock, manage all access control roles and change the minimum delay."
+        "manage parameters like fees for all connected projects, set the trusted aggregator, stop the emergency state, update projects and obsolete rollup types."
      receivedPermissions.3.role:
-        ".timelockAdminAC"
+        ".tweakParametersAC"
      receivedPermissions.3.condition:
-        "(no delay if in emergency state)"
      receivedPermissions.2.description:
-        "manage parameters like fees for all connected projects, set the trusted aggregator, stop the emergency state, update projects and obsolete rollup types."
+        "manage all access control roles, add new rollup types (which are implementation contracts that can then be upgraded to by connected projects), update any connected projects to new rollup types and rollback batches, connect existing rollups to the PolygonRollupManager."
      receivedPermissions.2.role:
-        ".tweakParametersAC"
+        ".defaultAdminAC"
      receivedPermissions.2.via:
+        [{"address":"ethereum:0xEf1462451C30Ea7aD8555386226059Fe837CA4EF","delay":259200,"condition":"(no delay if in emergency state)"}]
      receivedPermissions.1.from:
-        "ethereum:0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2"
+        "ethereum:0x046Bb8bb98Db4ceCbB2929542686B74b516274b3"
      receivedPermissions.1.description:
-        "manage all access control roles, add new rollup types (which are implementation contracts that can then be upgraded to by connected projects), update any connected projects to new rollup types and rollback batches, connect existing rollups to the PolygonRollupManager."
+        "add new routes from proof selector to verifier / vKey for pessimistic proofs."
      receivedPermissions.1.role:
-        ".defaultAdminAC"
+        ".addPpRouteAC"
      receivedPermissions.0.description:
-        "deploy new projects that use predefined rollup types (implementations) and connect them to the PolygonRollupManager."
+        "deploy new projects that use predefined rollup types (implementations) and connect them or other Agglayer chains to the PolygonRollupManager."
    }
```

```diff
    contract PolygonSharedBridge (0x2a3DD3EB832aF982ec71669E178424b10Dca2EDe) {
    +++ description: The shared bridge contract, escrowing user funds sent to AggLayer participants. It is usually mirrored on each chain and can be used to transfer both ERC20 assets and arbitrary messages.
      template:
-        "polygon-cdk/PolygonSharedBridge"
+        "polygon-cdk/PolygonSharedBridge_al030"
      sourceHashes.0:
-        "0x058729592838a622eff2eb394278ff5d53065feeca04c216a67e973178ac1ac2"
+        "0xf77e37156ee166ea86bbe304138c8d57dd299347f411e731fa2086e15153a780"
      description:
-        "The shared bridge contract, escrowing user funds sent to Layer 2s perticipating in the AggLayer. It is mirrored on each L2 and can be used to transfer both ERC20 assets and arbitrary messages."
+        "The shared bridge contract, escrowing user funds sent to AggLayer participants. It is usually mirrored on each chain and can be used to transfer both ERC20 assets and arbitrary messages."
      values.$implementation:
-        "0x0FeB850B183C57534b56b7d56520133C8f9BDB65"
+        "0x75D28BfDfF93B3e4f20184b442d2634DC01cA48b"
      values.$pastUpgrades.2:
+        ["2023-03-24T10:18:47.000Z","0x28f93532243dd8a8cc92ce630ef1920f40de15af7db2903efbf42f21fdf8152c",["0x5ac4182A1dd41AeEf465E40B82fd326BF66AB82C"]]
      values.$pastUpgrades.1.2:
-        "0x28f93532243dd8a8cc92ce630ef1920f40de15af7db2903efbf42f21fdf8152c"
+        "0xb83824c7eb1e87bd12222d98cf1cbff317b0853ba1e5beda1e3e3d8a4cfd1b24"
      values.$pastUpgrades.1.1:
-        "2023-03-24T10:18:47.000Z"
+        ["0x0FeB850B183C57534b56b7d56520133C8f9BDB65"]
      values.$pastUpgrades.1.0:
-        ["0x5ac4182A1dd41AeEf465E40B82fd326BF66AB82C"]
+        "2024-02-13T11:00:59.000Z"
      values.$pastUpgrades.0.2:
-        "0xb83824c7eb1e87bd12222d98cf1cbff317b0853ba1e5beda1e3e3d8a4cfd1b24"
+        ["0x75D28BfDfF93B3e4f20184b442d2634DC01cA48b"]
      values.$pastUpgrades.0.1:
-        ["0x0FeB850B183C57534b56b7d56520133C8f9BDB65"]
+        "0xcdd772d0b4764da67b80a72af2da7230f4f70f8c810cb8c4fe3882b8c4506ff3"
      values.$pastUpgrades.0.0:
-        "2024-02-13T11:00:59.000Z"
+        "2025-06-23T14:46:23.000Z"
      values.$upgradeCount:
-        2
+        3
      values.BASE_INIT_BYTECODE_WRAPPED_TOKEN:
-        "0x6101006040523480156200001257600080fd5b5060405162001b6638038062001b6683398101604081905262000035916200028d565b82826003620000458382620003a1565b506004620000548282620003a1565b50503360c0525060ff811660e052466080819052620000739062000080565b60a052506200046d915050565b60007f8b73c3c69bb8fe3d512ecc4cf759cc79239f7b179b0ffacaa9a75d522b39400f620000ad6200012e565b805160209182012060408051808201825260018152603160f81b90840152805192830193909352918101919091527fc89efdaa54c0f20c7adf612882df0950f5a951637e0307cdcb4c672f298b8bc66060820152608081018390523060a082015260c001604051602081830303815290604052805190602001209050919050565b6060600380546200013f9062000312565b80601f01602080910402602001604051908101604052809291908181526020018280546200016d9062000312565b8015620001be5780601f106200019257610100808354040283529160200191620001be565b820191906000526020600020905b815481529060010190602001808311620001a057829003601f168201915b5050505050905090565b634e487b7160e01b600052604160045260246000fd5b600082601f830112620001f057600080fd5b81516001600160401b03808211156200020d576200020d620001c8565b604051601f8301601f19908116603f01168101908282118183101715620002385762000238620001c8565b816040528381526020925086838588010111156200025557600080fd5b600091505b838210156200027957858201830151818301840152908201906200025a565b600093810190920192909252949350505050565b600080600060608486031215620002a357600080fd5b83516001600160401b0380821115620002bb57600080fd5b620002c987838801620001de565b94506020860151915080821115620002e057600080fd5b50620002ef86828701620001de565b925050604084015160ff811681146200030757600080fd5b809150509250925092565b600181811c908216806200032757607f821691505b6020821081036200034857634e487b7160e01b600052602260045260246000fd5b50919050565b601f8211156200039c57600081815260208120601f850160051c81016020861015620003775750805b601f850160051c820191505b81811015620003985782815560010162000383565b5050505b505050565b81516001600160401b03811115620003bd57620003bd620001c8565b620003d581620003ce845462000312565b846200034e565b602080601f8311600181146200040d5760008415620003f45750858301515b600019600386901b1c1916600185901b17855562000398565b600085815260208120601f198616915b828110156200043e578886015182559484019460019091019084016200041d565b50858210156200045d5787850151600019600388901b60f8161c191681555b5050505050600190811b01905550565b60805160a05160c05160e0516116aa620004bc6000396000610237015260008181610307015281816105c001526106a70152600061053a015260008181610379015261050401526116aa6000f3fe608060405234801561001057600080fd5b50600436106101775760003560e01c806370a08231116100d8578063a457c2d71161008c578063d505accf11610066578063d505accf1461039b578063dd62ed3e146103ae578063ffa1ad74146103f457600080fd5b8063a457c2d71461034e578063a9059cbb14610361578063cd0d00961461037457600080fd5b806395d89b41116100bd57806395d89b41146102e75780639dc29fac146102ef578063a3c573eb1461030257600080fd5b806370a08231146102915780637ecebe00146102c757600080fd5b806330adf81f1161012f5780633644e515116101145780633644e51514610261578063395093511461026957806340c10f191461027c57600080fd5b806330adf81f14610209578063313ce5671461023057600080fd5b806318160ddd1161016057806318160ddd146101bd57806320606b70146101cf57806323b872dd146101f657600080fd5b806306fdde031461017c578063095ea7b31461019a575b600080fd5b610184610430565b60405161019191906113e4565b60405180910390f35b6101ad6101a8366004611479565b6104c2565b6040519015158152602001610191565b6002545b604051908152602001610191565b6101c17f8b73c3c69bb8fe3d512ecc4cf759cc79239f7b179b0ffacaa9a75d522b39400f81565b6101ad6102043660046114a3565b6104dc565b6101c17f6e71edae12b1b97f4d1f60370fef10105fa2faae0126114a169c64845d6126c981565b60405160ff7f0000000000000000000000000000000000000000000000000000000000000000168152602001610191565b6101c1610500565b6101ad610277366004611479565b61055c565b61028f61028a366004611479565b6105a8565b005b6101c161029f3660046114df565b73ffffffffffffffffffffffffffffffffffffffff1660009081526020819052604090205490565b6101c16102d53660046114df565b60056020526000908152604090205481565b610184610680565b61028f6102fd366004611479565b61068f565b6103297f000000000000000000000000000000000000000000000000000000000000000081565b60405173ffffffffffffffffffffffffffffffffffffffff9091168152602001610191565b6101ad61035c366004611479565b61075e565b6101ad61036f366004611479565b61082f565b6101c17f000000000000000000000000000000000000000000000000000000000000000081565b61028f6103a9366004611501565b61083d565b6101c16103bc366004611574565b73ffffffffffffffffffffffffffffffffffffffff918216600090815260016020908152604080832093909416825291909152205490565b6101846040518060400160405280600181526020017f310000000000000000000000000000000000000000000000000000000000000081525081565b60606003805461043f906115a7565b80601f016020809104026020016040519081016040528092919081815260200182805461046b906115a7565b80156104b85780601f1061048d576101008083540402835291602001916104b8565b820191906000526020600020905b81548152906001019060200180831161049b57829003601f168201915b5050505050905090565b6000336104d0818585610b73565b60019150505b92915050565b6000336104ea858285610d27565b6104f5858585610dfe565b506001949350505050565b60007f00000000000000000000000000000000000000000000000000000000000000004614610537576105324661106d565b905090565b507f000000000000000000000000000000000000000000000000000000000000000090565b33600081815260016020908152604080832073ffffffffffffffffffffffffffffffffffffffff871684529091528120549091906104d090829086906105a3908790611629565b610b73565b3373ffffffffffffffffffffffffffffffffffffffff7f00000000000000000000000000000000000000000000000000000000000000001614610672576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152603060248201527f546f6b656e577261707065643a3a6f6e6c794272696467653a204e6f7420506f60448201527f6c79676f6e5a6b45564d4272696467650000000000000000000000000000000060648201526084015b60405180910390fd5b61067c8282611135565b5050565b60606004805461043f906115a7565b3373ffffffffffffffffffffffffffffffffffffffff7f00000000000000000000000000000000000000000000000000000000000000001614610754576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152603060248201527f546f6b656e577261707065643a3a6f6e6c794272696467653a204e6f7420506f60448201527f6c79676f6e5a6b45564d427269646765000000000000000000000000000000006064820152608401610669565b61067c8282611228565b33600081815260016020908152604080832073ffffffffffffffffffffffffffffffffffffffff8716845290915281205490919083811015610822576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602560248201527f45524332303a2064656372656173656420616c6c6f77616e63652062656c6f7760448201527f207a65726f0000000000000000000000000000000000000000000000000000006064820152608401610669565b6104f58286868403610b73565b6000336104d0818585610dfe565b834211156108cc576040517f08c379a0000000000000000000000000000000000000000000000000000000008152602060048201526024808201527f546f6b656e577261707065643a3a7065726d69743a204578706972656420706560448201527f726d6974000000000000000000000000000000000000000000000000000000006064820152608401610669565b73ffffffffffffffffffffffffffffffffffffffff8716600090815260056020526040812080547f6e71edae12b1b97f4d1f60370fef10105fa2faae0126114a169c64845d6126c9918a918a918a9190866109268361163c565b9091555060408051602081019690965273ffffffffffffffffffffffffffffffffffffffff94851690860152929091166060840152608083015260a082015260c0810186905260e0016040516020818303038152906040528051906020012090506000610991610500565b6040517f19010000000000000000000000000000000000000000000000000000000000006020820152602281019190915260428101839052606201604080517fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe08184030181528282528051602091820120600080855291840180845281905260ff89169284019290925260608301879052608083018690529092509060019060a0016020604051602081039080840390855afa158015610a55573d6000803e3d6000fd5b50506040517fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0015191505073ffffffffffffffffffffffffffffffffffffffff811615801590610ad057508973ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff16145b610b5c576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602760248201527f546f6b656e577261707065643a3a7065726d69743a20496e76616c696420736960448201527f676e6174757265000000000000000000000000000000000000000000000000006064820152608401610669565b610b678a8a8a610b73565b50505050505050505050565b73ffffffffffffffffffffffffffffffffffffffff8316610c15576040517f08c379a0000000000000000000000000000000000000000000000000000000008152602060048201526024808201527f45524332303a20617070726f76652066726f6d20746865207a65726f2061646460448201527f72657373000000000000000000000000000000000000000000000000000000006064820152608401610669565b73ffffffffffffffffffffffffffffffffffffffff8216610cb8576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602260248201527f45524332303a20617070726f766520746f20746865207a65726f20616464726560448201527f73730000000000000000000000000000000000000000000000000000000000006064820152608401610669565b73ffffffffffffffffffffffffffffffffffffffff83811660008181526001602090815260408083209487168084529482529182902085905590518481527f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b92591015b60405180910390a3505050565b73ffffffffffffffffffffffffffffffffffffffff8381166000908152600160209081526040808320938616835292905220547fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff8114610df85781811015610deb576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601d60248201527f45524332303a20696e73756666696369656e7420616c6c6f77616e63650000006044820152606401610669565b610df88484848403610b73565b50505050565b73ffffffffffffffffffffffffffffffffffffffff8316610ea1576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602560248201527f45524332303a207472616e736665722066726f6d20746865207a65726f20616460448201527f64726573730000000000000000000000000000000000000000000000000000006064820152608401610669565b73ffffffffffffffffffffffffffffffffffffffff8216610f44576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602360248201527f45524332303a207472616e7366657220746f20746865207a65726f206164647260448201527f65737300000000000000000000000000000000000000000000000000000000006064820152608401610669565b73ffffffffffffffffffffffffffffffffffffffff831660009081526020819052604090205481811015610ffa576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602660248201527f45524332303a207472616e7366657220616d6f756e742065786365656473206260448201527f616c616e636500000000000000000000000000000000000000000000000000006064820152608401610669565b73ffffffffffffffffffffffffffffffffffffffff848116600081815260208181526040808320878703905593871680835291849020805487019055925185815290927fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef910160405180910390a3610df8565b60007f8b73c3c69bb8fe3d512ecc4cf759cc79239f7b179b0ffacaa9a75d522b39400f611098610430565b8051602091820120604080518082018252600181527f310000000000000000000000000000000000000000000000000000000000000090840152805192830193909352918101919091527fc89efdaa54c0f20c7adf612882df0950f5a951637e0307cdcb4c672f298b8bc66060820152608081018390523060a082015260c001604051602081830303815290604052805190602001209050919050565b73ffffffffffffffffffffffffffffffffffffffff82166111b2576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601f60248201527f45524332303a206d696e7420746f20746865207a65726f2061646472657373006044820152606401610669565b80600260008282546111c49190611629565b909155505073ffffffffffffffffffffffffffffffffffffffff8216600081815260208181526040808320805486019055518481527fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef910160405180910390a35050565b73ffffffffffffffffffffffffffffffffffffffff82166112cb576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602160248201527f45524332303a206275726e2066726f6d20746865207a65726f2061646472657360448201527f73000000000000000000000000000000000000000000000000000000000000006064820152608401610669565b73ffffffffffffffffffffffffffffffffffffffff821660009081526020819052604090205481811015611381576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602260248201527f45524332303a206275726e20616d6f756e7420657863656564732062616c616e60448201527f63650000000000000000000000000000000000000000000000000000000000006064820152608401610669565b73ffffffffffffffffffffffffffffffffffffffff83166000818152602081815260408083208686039055600280548790039055518581529192917fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef9101610d1a565b600060208083528351808285015260005b81811015611411578581018301518582016040015282016113f5565b5060006040828601015260407fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0601f8301168501019250505092915050565b803573ffffffffffffffffffffffffffffffffffffffff8116811461147457600080fd5b919050565b6000806040838503121561148c57600080fd5b61149583611450565b946020939093013593505050565b6000806000606084860312156114b857600080fd5b6114c184611450565b92506114cf60208501611450565b9150604084013590509250925092565b6000602082840312156114f157600080fd5b6114fa82611450565b9392505050565b600080600080600080600060e0888a03121561151c57600080fd5b61152588611450565b965061153360208901611450565b95506040880135945060608801359350608088013560ff8116811461155757600080fd5b9699959850939692959460a0840135945060c09093013592915050565b6000806040838503121561158757600080fd5b61159083611450565b915061159e60208401611450565b90509250929050565b600181811c908216806115bb57607f821691505b6020821081036115f4577f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b50919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b808201808211156104d6576104d66115fa565b60007fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff820361166d5761166d6115fa565b506001019056fea26469706673582212208d88fee561cff7120d381c345cfc534cef8229a272dc5809d4bbb685ad67141164736f6c63430008110033"
      values.BRIDGE_VERSION:
+        "al-v0.3.0"
      values.getProxiedTokensManager:
+        "0xEf1462451C30Ea7aD8555386226059Fe837CA4EF"
      values.getWrappedTokenBridgeImplementation:
+        "0xc5240E74839794D512e77bD9b3702c4B6D5b0F0d"
      values.pendingProxiedTokensManager:
+        "0x0000000000000000000000000000000000000000"
+++ description: is the default proxy admin of all newly deployed wrapped tokens (tokens bridged from other chains to this chain). this permission is enforced by the proxy bytecode in the wrappedTokenBytecodeStorer.
+++ severity: HIGH
      values.proxiedTokensManager:
+        "0xEf1462451C30Ea7aD8555386226059Fe837CA4EF"
      values.wrappedTokenBytecodeStorer:
+        "0x6b0E6Cf8108BbC39A53AF11B65d6C47d06037f80"
      fieldMeta.proxiedTokensManager:
+        {"severity":"HIGH","description":"is the default proxy admin of all newly deployed wrapped tokens (tokens bridged from other chains to this chain). this permission is enforced by the proxy bytecode in the wrappedTokenBytecodeStorer."}
      implementationNames.0x0FeB850B183C57534b56b7d56520133C8f9BDB65:
-        "PolygonZkEVMBridgeV2"
      implementationNames.0x75D28BfDfF93B3e4f20184b442d2634DC01cA48b:
+        "PolygonZkEVMBridgeV2"
    }
```

```diff
    contract PolygonRollupManager (0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2) {
    +++ description: The central shared managing contract for Polygon AggLayer chains. This contract coordinates chain deployments and proof validation. All connected Layer 2s can be globally paused by activating the 'Emergency State'. This can be done by the 0x37c58Dfa7BF0A165C5AAEdDf3e2EdB475ac6Dcb6 or by anyone after 1 week of inactive verifiers.
      template:
-        "polygon-cdk/PolygonRollupManager_pessimistic"
+        "polygon-cdk/PolygonRollupManager_al030"
      sourceHashes.1:
-        "0x7e3c84e6c7073576082d9a34cfeb47653ec669528708f3a487faa1803a1b25eb"
+        "0x6d1bbfb1ed7d88848e594dc11366fbed3d53c5a507022c04dbeea72ef549cd6a"
      sourceHashes.0:
-        "0x6d1bbfb1ed7d88848e594dc11366fbed3d53c5a507022c04dbeea72ef549cd6a"
+        "0x05a5fd7dbd65634dc3a3eea806b01583e307d843c5fa9c7e6e01ffda1b1acb47"
      description:
-        "The central shared managing contract for Layer 2s on the Polygon AggLayer. This contract receives L2 state roots as well as ZK proofs. All connected Layer 2s can be globally paused by activating the 'Emergency State'. This can be done by the 0x37c58Dfa7BF0A165C5AAEdDf3e2EdB475ac6Dcb6 or by anyone after 1 week of inactive verifiers."
+        "The central shared managing contract for Polygon AggLayer chains. This contract coordinates chain deployments and proof validation. All connected Layer 2s can be globally paused by activating the 'Emergency State'. This can be done by the 0x37c58Dfa7BF0A165C5AAEdDf3e2EdB475ac6Dcb6 or by anyone after 1 week of inactive verifiers."
      values.$implementation:
-        "0xA33619940bceb9be7c9679Dd80FA2918C2476382"
+        "0x9ab2cB2107d3E737f7977B2E5042C58dE98326ab"
      values.$pastUpgrades.6:
+        ["2024-02-13T11:00:59.000Z","0xb83824c7eb1e87bd12222d98cf1cbff317b0853ba1e5beda1e3e3d8a4cfd1b24",["0x3b82Da772c825283d85d5d6717A77C6Ff582053b"]]
      values.$pastUpgrades.5.2:
-        "0xb83824c7eb1e87bd12222d98cf1cbff317b0853ba1e5beda1e3e3d8a4cfd1b24"
+        "2023-03-24T10:19:23.000Z"
      values.$pastUpgrades.5.1:
-        "2024-02-13T11:00:59.000Z"
+        "0xe34243804e1f7257acb09c97d0d6f023663200c39ee85a1e6927b0b391710bbb"
      values.$pastUpgrades.5.0.0:
-        "0x3b82Da772c825283d85d5d6717A77C6Ff582053b"
+        "0xe262Ea2782e2e8dbFe354048c3B5d6DE9603EfEF"
      values.$pastUpgrades.4.2:
-        "2023-03-24T10:19:23.000Z"
+        "2023-11-09T09:22:59.000Z"
      values.$pastUpgrades.4.1:
-        "0xe34243804e1f7257acb09c97d0d6f023663200c39ee85a1e6927b0b391710bbb"
+        "0x1db1400138d6778d303b9a13e816432d11f8dfca00ef6ec6ffcb6698cb447a31"
      values.$pastUpgrades.4.0.0:
-        "0xe262Ea2782e2e8dbFe354048c3B5d6DE9603EfEF"
+        "0xb1585916487AcEdD99952086f2950763D253b923"
      values.$pastUpgrades.3.2:
-        "2023-11-09T09:22:59.000Z"
+        ["0x301442aA888701c8B86727d42F3C55Fb0dd9eF7F"]
      values.$pastUpgrades.3.1:
-        "0x1db1400138d6778d303b9a13e816432d11f8dfca00ef6ec6ffcb6698cb447a31"
+        "0x25c342d7c5b4137b5439c16fd5fa1577c116277859202b2c68fcd9f73b3fc2ac"
      values.$pastUpgrades.3.0:
-        ["0xb1585916487AcEdD99952086f2950763D253b923"]
+        "2023-09-20T08:30:35.000Z"
      values.$pastUpgrades.2.2.0:
-        "0x301442aA888701c8B86727d42F3C55Fb0dd9eF7F"
+        "0x103388f5661d224F4aFb555C7E4a8FB52d0b752d"
      values.$pastUpgrades.2.1:
-        "0x25c342d7c5b4137b5439c16fd5fa1577c116277859202b2c68fcd9f73b3fc2ac"
+        "2024-10-30T11:11:59.000Z"
      values.$pastUpgrades.2.0:
-        "2023-09-20T08:30:35.000Z"
+        "0x8c1be5b5d844d6e04b2c224cd810cda091d70e6d5c2e5e0464993f7df1ab8403"
      values.$pastUpgrades.1.2:
-        ["0x103388f5661d224F4aFb555C7E4a8FB52d0b752d"]
+        "0xb499c5a8f315d72886e44eabcbf6428fb9672f3ea8eb55adcbfda0ae0612233e"
      values.$pastUpgrades.1.1:
-        "2024-10-30T11:11:59.000Z"
+        "2025-02-03T14:55:59.000Z"
      values.$pastUpgrades.1.0:
-        "0x8c1be5b5d844d6e04b2c224cd810cda091d70e6d5c2e5e0464993f7df1ab8403"
+        ["0xA33619940bceb9be7c9679Dd80FA2918C2476382"]
      values.$pastUpgrades.0.2:
-        "0xb499c5a8f315d72886e44eabcbf6428fb9672f3ea8eb55adcbfda0ae0612233e"
+        ["0x9ab2cB2107d3E737f7977B2E5042C58dE98326ab"]
      values.$pastUpgrades.0.1:
-        "2025-02-03T14:55:59.000Z"
+        "0xcdd772d0b4764da67b80a72af2da7230f4f70f8c810cb8c4fe3882b8c4506ff3"
      values.$pastUpgrades.0.0:
-        ["0xA33619940bceb9be7c9679Dd80FA2918C2476382"]
+        "2025-06-23T14:46:23.000Z"
      values.$upgradeCount:
-        6
+        7
      values.ROLLUP_MANAGER_VERSION:
-        "pessimistic"
+        "al-v0.3.0"
      values.rollupsDataV2.14.rollupContract:
-        "0x7449449460b5B732A9754CA3d9A7916122A9190d"
+        "0xB234F18738d9531CAD6ae6d9A587d09fe200272C"
      values.rollupsDataV2.14.chainID:
-        801
+        999
      values.rollupsDataV2.14.verifier:
-        "0xE00a3cBFC45241b33c0A44C78e26168CBc55EC63"
+        "0x0775e11309d75aA6b0967917fB0213C5673eDf81"
      values.rollupsDataV2.14.forkID:
-        12
+        9
      values.rollupsDataV2.14.rollupTypeID:
-        10
+        4
      values.rollupsDataV2.14.rollupVerifierType:
-        1
+        0
      values.rollupsDataV2.14.programVKey:
-        "0x00dc9aac973a839dc15373ccf3aa0b0d503c1142ceb7d99b0c4fcc4a5c3ad09f"
+        "0x0000000000000000000000000000000000000000000000000000000000000000"
      values.rollupsDataV2.13.rollupContract:
-        "0xFE797cb13f7884FB9f0aE26fEB2a06ed8efccbe7"
+        "0xC4E903D3Af4c3d2e437492d602adcC9d9b536858"
      values.rollupsDataV2.13.chainID:
-        9369
+        1511670449
      values.rollupsDataV2.13.verifier:
-        "0xE00a3cBFC45241b33c0A44C78e26168CBc55EC63"
+        "0x0775e11309d75aA6b0967917fB0213C5673eDf81"
      values.rollupsDataV2.13.forkID:
-        12
+        9
      values.rollupsDataV2.13.rollupTypeID:
-        10
+        4
      values.rollupsDataV2.13.rollupVerifierType:
-        1
+        0
      values.rollupsDataV2.13.programVKey:
-        "0x00dc9aac973a839dc15373ccf3aa0b0d503c1142ceb7d99b0c4fcc4a5c3ad09f"
+        "0x0000000000000000000000000000000000000000000000000000000000000000"
      values.rollupsDataV2.12.rollupContract:
-        "0xB234F18738d9531CAD6ae6d9A587d09fe200272C"
+        "0x419dcD0f72ebAFd3524b65a97ac96699C7fBebdB"
      values.rollupsDataV2.12.chainID:
-        999
+        2355
      values.rollupsDataV2.12.verifier:
-        "0x0775e11309d75aA6b0967917fB0213C5673eDf81"
+        "0x9B9671dB83CfcB4508bF361942488C5cA2b1286D"
      values.rollupsDataV2.12.forkID:
-        9
+        12
      values.rollupsDataV2.12.rollupTypeID:
-        4
+        7
      values.rollupsDataV2.11.rollupContract:
-        "0x88404dD30A96AD25A765d733429Cf83138c7f8f4"
+        "0x78253E2E6120164bd826668A4C96Db20f78A94c9"
      values.rollupsDataV2.11.chainID:
-        45056
+        31415
      values.rollupsDataV2.11.verifier:
-        "0xE00a3cBFC45241b33c0A44C78e26168CBc55EC63"
+        "0x0775e11309d75aA6b0967917fB0213C5673eDf81"
      values.rollupsDataV2.11.forkID:
-        12
+        9
      values.rollupsDataV2.11.rollupTypeID:
-        10
+        4
      values.rollupsDataV2.11.rollupVerifierType:
-        1
+        0
      values.rollupsDataV2.11.programVKey:
-        "0x00dc9aac973a839dc15373ccf3aa0b0d503c1142ceb7d99b0c4fcc4a5c3ad09f"
+        "0x0000000000000000000000000000000000000000000000000000000000000000"
      values.rollupsDataV2.10.rollupContract:
-        "0xC4E903D3Af4c3d2e437492d602adcC9d9b536858"
+        "0x2B0ee28D4D51bC9aDde5E58E295873F61F4a0507"
      values.rollupsDataV2.10.chainID:
-        1511670449
+        196
      values.rollupsDataV2.10.verifier:
-        "0x0775e11309d75aA6b0967917fB0213C5673eDf81"
+        "0x455ac63E96e6a64EA59C6Da0D8F90FCa3F1535aB"
      values.rollupsDataV2.10.forkID:
-        9
+        13
      values.rollupsDataV2.10.rollupTypeID:
-        4
+        8
      values.rollupsDataV2.9.rollupContract:
-        "0x419dcD0f72ebAFd3524b65a97ac96699C7fBebdB"
+        "0x519E42c24163192Dca44CD3fBDCEBF6be9130987"
      values.rollupsDataV2.9.chainID:
-        2355
+        1101
      values.rollupsDataV2.9.rollupTypeID:
-        7
+        6
      values.rollupsDataV2.8.rollupContract:
-        "0x78253E2E6120164bd826668A4C96Db20f78A94c9"
+        "0x7449449460b5B732A9754CA3d9A7916122A9190d"
      values.rollupsDataV2.8.chainID:
-        31415
+        801
      values.rollupsDataV2.8.verifier:
-        "0x0775e11309d75aA6b0967917fB0213C5673eDf81"
+        "0x0459d576A6223fEeA177Fb3DF53C9c77BF84C459"
      values.rollupsDataV2.8.forkID:
-        9
+        12
      values.rollupsDataV2.8.rollupTypeID:
-        4
+        11
      values.rollupsDataV2.8.rollupVerifierType:
-        0
+        1
      values.rollupsDataV2.8.programVKey:
-        "0x0000000000000000000000000000000000000000000000000000000000000000"
+        "0x00eff0b6998df46ec388bb305618089ae3dc74e513e7676b2e1909694f49cc30"
      values.rollupsDataV2.7.rollupContract:
-        "0x2B0ee28D4D51bC9aDde5E58E295873F61F4a0507"
+        "0x92726F7dE49300DBdb60930066bc1d0803c0740B"
      values.rollupsDataV2.7.chainID:
-        196
+        994873017
      values.rollupsDataV2.7.verifier:
-        "0x455ac63E96e6a64EA59C6Da0D8F90FCa3F1535aB"
+        "0x9B9671dB83CfcB4508bF361942488C5cA2b1286D"
      values.rollupsDataV2.7.forkID:
-        13
+        12
      values.rollupsDataV2.7.rollupTypeID:
-        8
+        7
      values.rollupsDataV2.6.rollupContract:
-        "0x519E42c24163192Dca44CD3fBDCEBF6be9130987"
+        "0x7fF0B5fF6Eb8B789456639AC2A02487c338c1789"
      values.rollupsDataV2.6.chainID:
-        1101
+        752025
      values.rollupsDataV2.6.rollupTypeID:
-        6
+        7
      values.rollupsDataV2.5.rollupContract:
-        "0x92726F7dE49300DBdb60930066bc1d0803c0740B"
+        "0xFE797cb13f7884FB9f0aE26fEB2a06ed8efccbe7"
      values.rollupsDataV2.5.chainID:
-        994873017
+        9369
      values.rollupsDataV2.5.verifier:
-        "0x9B9671dB83CfcB4508bF361942488C5cA2b1286D"
+        "0x0459d576A6223fEeA177Fb3DF53C9c77BF84C459"
      values.rollupsDataV2.5.rollupTypeID:
-        7
+        11
      values.rollupsDataV2.5.rollupVerifierType:
-        0
+        1
      values.rollupsDataV2.5.programVKey:
-        "0x0000000000000000000000000000000000000000000000000000000000000000"
+        "0x00eff0b6998df46ec388bb305618089ae3dc74e513e7676b2e1909694f49cc30"
      values.rollupsDataV2.4.rollupContract:
-        "0x7fF0B5fF6Eb8B789456639AC2A02487c338c1789"
+        "0xb1714954bBc0162A36FB44934F3216aCE81C40d7"
      values.rollupsDataV2.4.chainID:
-        752025
+        3344
      values.rollupsDataV2.3.rollupContract:
-        "0xb1714954bBc0162A36FB44934F3216aCE81C40d7"
+        "0x88404dD30A96AD25A765d733429Cf83138c7f8f4"
      values.rollupsDataV2.3.chainID:
-        3344
+        45056
      values.rollupsDataV2.3.verifier:
-        "0x9B9671dB83CfcB4508bF361942488C5cA2b1286D"
+        "0x0459d576A6223fEeA177Fb3DF53C9c77BF84C459"
      values.rollupsDataV2.3.rollupTypeID:
-        7
+        11
      values.rollupsDataV2.3.rollupVerifierType:
-        0
+        1
      values.rollupsDataV2.3.programVKey:
-        "0x0000000000000000000000000000000000000000000000000000000000000000"
+        "0x00eff0b6998df46ec388bb305618089ae3dc74e513e7676b2e1909694f49cc30"
      values.rollupsDataV2.1.verifier:
-        "0xE00a3cBFC45241b33c0A44C78e26168CBc55EC63"
+        "0x0459d576A6223fEeA177Fb3DF53C9c77BF84C459"
      values.rollupsDataV2.1.rollupTypeID:
-        10
+        11
      values.rollupsDataV2.1.programVKey:
-        "0x00dc9aac973a839dc15373ccf3aa0b0d503c1142ceb7d99b0c4fcc4a5c3ad09f"
+        "0x00eff0b6998df46ec388bb305618089ae3dc74e513e7676b2e1909694f49cc30"
      values.rollupsDataV2.0.verifier:
-        "0xE00a3cBFC45241b33c0A44C78e26168CBc55EC63"
+        "0x0459d576A6223fEeA177Fb3DF53C9c77BF84C459"
      values.rollupsDataV2.0.rollupTypeID:
-        10
+        11
      values.rollupsDataV2.0.programVKey:
-        "0x00dc9aac973a839dc15373ccf3aa0b0d503c1142ceb7d99b0c4fcc4a5c3ad09f"
+        "0x00eff0b6998df46ec388bb305618089ae3dc74e513e7676b2e1909694f49cc30"
      values.rollupTypeCount:
-        10
+        11
+++ description: struct consensusImplementation, verifier, forkID, rollupVerifierType, obsolete, programVKey
      values.rollupTypes.10:
+        {"consensusImplementation":"0x2650a9a4fC64f63F573EF0F405064EF54BC46f71","verifier":"0x4AaBBA26EA9E7A7fbD052d17a167e6aE3F8eC7Be","forkID":8,"rollupVerifierType":0,"obsolete":false,"programVKey":"0x0000000000000000000000000000000000000000000000000000000000000000"}
      values.rollupTypes.9.verifier:
-        "0x4AaBBA26EA9E7A7fbD052d17a167e6aE3F8eC7Be"
+        "0x0775e11309d75aA6b0967917fB0213C5673eDf81"
      values.rollupTypes.9.forkID:
-        8
+        9
      values.rollupTypes.8.consensusImplementation:
-        "0x2650a9a4fC64f63F573EF0F405064EF54BC46f71"
+        "0x10D296e8aDd0535be71639E5D1d1c30ae1C6bD4C"
      values.rollupTypes.7.consensusImplementation:
-        "0x10D296e8aDd0535be71639E5D1d1c30ae1C6bD4C"
+        "0x2650a9a4fC64f63F573EF0F405064EF54BC46f71"
      values.rollupTypes.7.verifier:
-        "0x0775e11309d75aA6b0967917fB0213C5673eDf81"
+        "0xc521580cd8586Cc688A7430F9DcE0f6A803F2883"
      values.rollupTypes.7.forkID:
-        9
+        11
      values.rollupTypes.6.consensusImplementation:
-        "0x2650a9a4fC64f63F573EF0F405064EF54BC46f71"
+        "0x7253F329302b1b5E774Ac641EA3743E9E3244f2E"
      values.rollupTypes.6.verifier:
-        "0xc521580cd8586Cc688A7430F9DcE0f6A803F2883"
+        "0x9B9671dB83CfcB4508bF361942488C5cA2b1286D"
      values.rollupTypes.6.forkID:
-        11
+        12
      values.rollupTypes.5.consensusImplementation:
-        "0x7253F329302b1b5E774Ac641EA3743E9E3244f2E"
+        "0x18C45DD422f6587357a6d3b23307E75D42b2bc5B"
      values.rollupTypes.5.verifier:
-        "0x9B9671dB83CfcB4508bF361942488C5cA2b1286D"
+        "0xE00a3cBFC45241b33c0A44C78e26168CBc55EC63"
      values.rollupTypes.5.rollupVerifierType:
-        0
+        1
      values.rollupTypes.5.programVKey:
-        "0x0000000000000000000000000000000000000000000000000000000000000000"
+        "0x0062c685702e0582d900f3a19521270c92a58e2588230c4a5cf3b45103f4a512"
      values.rollupTypes.4.consensusImplementation:
-        "0x18C45DD422f6587357a6d3b23307E75D42b2bc5B"
+        "0x9cf80f7eB1C76ec5AE7A88b417e373449b73ac30"
      values.rollupTypes.4.verifier:
-        "0xE00a3cBFC45241b33c0A44C78e26168CBc55EC63"
+        "0x1C3A3da552b8662CD69538356b1E7c2E9CC1EBD8"
      values.rollupTypes.4.forkID:
-        12
+        7
      values.rollupTypes.4.rollupVerifierType:
-        1
+        0
      values.rollupTypes.4.programVKey:
-        "0x0062c685702e0582d900f3a19521270c92a58e2588230c4a5cf3b45103f4a512"
+        "0x0000000000000000000000000000000000000000000000000000000000000000"
      values.rollupTypes.3.consensusImplementation:
-        "0x9cf80f7eB1C76ec5AE7A88b417e373449b73ac30"
+        "0x427113ae6F319BfFb4459bfF96eb8B6BDe1A127F"
      values.rollupTypes.3.verifier:
-        "0x1C3A3da552b8662CD69538356b1E7c2E9CC1EBD8"
+        "0x9B9671dB83CfcB4508bF361942488C5cA2b1286D"
      values.rollupTypes.3.forkID:
-        7
+        12
      values.rollupTypes.2.consensusImplementation:
-        "0x427113ae6F319BfFb4459bfF96eb8B6BDe1A127F"
+        "0x18C45DD422f6587357a6d3b23307E75D42b2bc5B"
      values.rollupTypes.2.verifier:
-        "0x9B9671dB83CfcB4508bF361942488C5cA2b1286D"
+        "0xE00a3cBFC45241b33c0A44C78e26168CBc55EC63"
      values.rollupTypes.2.rollupVerifierType:
-        0
+        1
      values.rollupTypes.2.programVKey:
-        "0x0000000000000000000000000000000000000000000000000000000000000000"
+        "0x00dc9aac973a839dc15373ccf3aa0b0d503c1142ceb7d99b0c4fcc4a5c3ad09f"
      values.rollupTypes.1.consensusImplementation:
-        "0x18C45DD422f6587357a6d3b23307E75D42b2bc5B"
+        "0x427113ae6F319BfFb4459bfF96eb8B6BDe1A127F"
      values.rollupTypes.1.verifier:
-        "0xE00a3cBFC45241b33c0A44C78e26168CBc55EC63"
+        "0x455ac63E96e6a64EA59C6Da0D8F90FCa3F1535aB"
      values.rollupTypes.1.forkID:
-        12
+        13
      values.rollupTypes.1.rollupVerifierType:
-        1
+        0
      values.rollupTypes.1.programVKey:
-        "0x00dc9aac973a839dc15373ccf3aa0b0d503c1142ceb7d99b0c4fcc4a5c3ad09f"
+        "0x0000000000000000000000000000000000000000000000000000000000000000"
      values.rollupTypes.0.consensusImplementation:
-        "0x427113ae6F319BfFb4459bfF96eb8B6BDe1A127F"
+        "0x18C45DD422f6587357a6d3b23307E75D42b2bc5B"
      values.rollupTypes.0.verifier:
-        "0x455ac63E96e6a64EA59C6Da0D8F90FCa3F1535aB"
+        "0x0459d576A6223fEeA177Fb3DF53C9c77BF84C459"
      values.rollupTypes.0.forkID:
-        13
+        12
      values.rollupTypes.0.rollupVerifierType:
-        0
+        1
      values.rollupTypes.0.programVKey:
-        "0x0000000000000000000000000000000000000000000000000000000000000000"
+        "0x00eff0b6998df46ec388bb305618089ae3dc74e513e7676b2e1909694f49cc30"
      values.aggLayerGateway:
+        "0x046Bb8bb98Db4ceCbB2929542686B74b516274b3"
      implementationNames.0xA33619940bceb9be7c9679Dd80FA2918C2476382:
-        "PolygonRollupManager"
      implementationNames.0x9ab2cB2107d3E737f7977B2E5042C58dE98326ab:
+        "PolygonRollupManager"
    }
```

```diff
    contract PolygonGlobalExitRootV2 (0x580bda1e7A0CFAe92Fa7F6c20A3794F169CE3CFb) {
    +++ description: A merkle tree storage contract aggregating state roots of each participating Layer 2, thus creating a single global merkle root representing the global state of the AggLayer, the 'global exit root'. The global exit root is synchronized to all connected Layer 2s to help with their interoperability.
      sourceHashes.1:
-        "0x5cd6999aa568aa00dc997f5d179426b88bf3797f4618bc4cce28b6cf5f8e76d6"
+        "0xee95e594827e19497b882d82113115b70cb33dc53c346f5bf09b38891f560067"
      values.$implementation:
-        "0x9Bdda421219900454E94e01d641fE64c60D8f4C8"
+        "0xc38C76aE3C8A7dee99d07f1A39246ABe18919a48"
      values.$pastUpgrades.3:
+        ["2025-06-23T14:46:23.000Z","0xcdd772d0b4764da67b80a72af2da7230f4f70f8c810cb8c4fe3882b8c4506ff3",["0xc38C76aE3C8A7dee99d07f1A39246ABe18919a48"]]
      values.$upgradeCount:
-        3
+        4
      values.GER_VERSION:
+        "al-v0.3.0"
      implementationNames.0x9Bdda421219900454E94e01d641fE64c60D8f4C8:
-        "PolygonZkEVMGlobalExitRootV2"
      implementationNames.0xc38C76aE3C8A7dee99d07f1A39246ABe18919a48:
+        "PolygonZkEVMGlobalExitRootV2"
    }
```

```diff
    contract PolygonCreateRollupMultisig (0xC74eFc7fdb3BeC9c6930E91FFDF761b160dF79dB) {
    +++ description: None
      receivedPermissions.0.description:
-        "deploy new projects that use predefined rollup types (implementations) and connect them to the PolygonRollupManager."
+        "deploy new projects that use predefined rollup types (implementations) and connect them or other Agglayer chains to the PolygonRollupManager."
    }
```

```diff
    contract Timelock (0xEf1462451C30Ea7aD8555386226059Fe837CA4EF) {
    +++ description: A timelock with access control. In the case of an activated emergency state in the 0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2, all transactions through this timelock are immediately executable. The current minimum delay is 3d.
      directlyReceivedPermissions.5:
+        {"permission":"interact","from":"ethereum:0x2a3DD3EB832aF982ec71669E178424b10Dca2EDe","description":"upgrade the implementation of wrapped tokens deployed by the bridge.","role":".proxiedTokensManager"}
      directlyReceivedPermissions.4:
+        {"permission":"interact","from":"ethereum:0xEf1462451C30Ea7aD8555386226059Fe837CA4EF","delay":259200,"description":"propose, cancel and execute transactions in the timelock, manage all access control roles and change the minimum delay.","role":".timelockAdminAC","condition":"(no delay if in emergency state)"}
      directlyReceivedPermissions.3.permission:
-        "interact"
+        "act"
      directlyReceivedPermissions.3.description:
-        "propose, cancel and execute transactions in the timelock, manage all access control roles and change the minimum delay."
      directlyReceivedPermissions.2.permission:
-        "act"
+        "interact"
      directlyReceivedPermissions.2.from:
-        "ethereum:0xEf1462451C30Ea7aD8555386226059Fe837CA4EF"
+        "ethereum:0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2"
      directlyReceivedPermissions.2.delay:
-        259200
      directlyReceivedPermissions.2.role:
-        ".timelockAdminAC"
+        ".defaultAdminAC"
      directlyReceivedPermissions.2.condition:
-        "(no delay if in emergency state)"
      directlyReceivedPermissions.2.description:
+        "manage all access control roles, add new rollup types (which are implementation contracts that can then be upgraded to by connected projects), update any connected projects to new rollup types and rollback batches, connect existing rollups to the PolygonRollupManager."
      directlyReceivedPermissions.1.from:
-        "ethereum:0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2"
+        "ethereum:0x046Bb8bb98Db4ceCbB2929542686B74b516274b3"
      directlyReceivedPermissions.1.description:
-        "manage all access control roles, add new rollup types (which are implementation contracts that can then be upgraded to by connected projects), update any connected projects to new rollup types and rollback batches, connect existing rollups to the PolygonRollupManager."
+        "add new routes from proof selector to verifier / vKey for pessimistic proofs."
      directlyReceivedPermissions.1.role:
-        ".defaultAdminAC"
+        ".addPpRouteAC"
    }
```

```diff
+   Status: CREATED
    contract SP1Verifier (0x0459d576A6223fEeA177Fb3DF53C9c77BF84C459)
    +++ description: Verifier contract for SP1 proofs (v5.0.0).
```

```diff
+   Status: CREATED
    contract AggLayerGateway (0x046Bb8bb98Db4ceCbB2929542686B74b516274b3)
    +++ description: A verifier gateway for pessimistic proofs. Manages a map of chains and their verifier keys and is used to route proofs based on the first 4 bytes of proofBytes data in a proof submission. The SP1 verifier is used for all proofs.
```

## Source code changes

```diff
.../.flat/AggLayerGateway/AggLayerGateway.sol      |  942 +++++++++++++
 .../TransparentUpgradeableProxy.p.sol              |  695 ++++++++++
 .../PolygonZkEVMGlobalExitRootV2.sol               |   93 +-
 .../PolygonRollupManager/PolygonRollupManager.sol  |  829 ++++++++++--
 .../PolygonSharedBridge/PolygonZkEVMBridgeV2.sol   | 1295 ++++++++++++++----
 .../ethereum/.flat/SP1Verifier.sol                 | 1396 ++++++++++++++++++++
 6 files changed, 4832 insertions(+), 418 deletions(-)
```

Generated with discovered.json: 0xf500f09c9ba1b9f5ac5eb5956794c67797d85d23

# Diff at Fri, 20 Jun 2025 07:00:05 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@70109db050355e01a50f54497c60fdd17bbdbc2d block: 22666256
- current block number: 22744056

## Description

new scheduled txs:
1) add new rollupType (pessimistic - 11): https://app.blocksec.com/explorer/tx/eth/0x30ff069118dfed9022dc41e72794a6cae005cf1417dbcc245208a00628785946
2) upgrade all 5 pessimistic chains to the above new type: https://app.blocksec.com/explorer/tx/eth/0xd89ca61d7a6968ab0838ef03666ac5dfe4f8750ba4afdbc576c535108f8655b3
3) upgrade rollupManager, globalExitRoot and sharedBridge to new implementations: https://app.blocksec.com/explorer/tx/eth/0x231cc96debfd57c50e0c9971b8efcd4cb2b58377e68bbb4523771046860ea835
4) add new rollupType (aggchainFEP - 12): https://app.blocksec.com/explorer/tx/eth/0xd9d5644147ce2c17e4a53c0c9ebfc576d5be6713209354fb8949e010870783c8

interesting consensus impl (op-succinct -> katana?): https://etherscan.io/address/0xe7fe45579d784dc83b0fed844a65f4ceefde5682#code

## Watched changes

```diff
    contract Timelock (0xEf1462451C30Ea7aD8555386226059Fe837CA4EF) {
    +++ description: A timelock with access control. In the case of an activated emergency state in the 0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2, all transactions through this timelock are immediately executable. The current minimum delay is 3d.
      values.scheduledTransactionsDecoded.33:
+        {"target":"0x0F99738B2Fc14D77308337f3e2596b63aE7BCC4A","value":"0","function":"upgrade","inputs":{"proxy":"0x580bda1e7A0CFAe92Fa7F6c20A3794F169CE3CFb","implementation":"0x2E38cD55163137483E30580Cb468C2dFf1d85077"},"predecessor":"0x0000000000000000000000000000000000000000000000000000000000000000","delay":"864000"}
      values.scheduledTransactionsDecoded.32:
+        {"target":"0x0F99738B2Fc14D77308337f3e2596b63aE7BCC4A","value":"0","function":"upgradeAndCall","inputs":{"proxy":"0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2","implementation":"0xA33619940bceb9be7c9679Dd80FA2918C2476382","data":{}},"predecessor":"0x0000000000000000000000000000000000000000000000000000000000000000","delay":"864000"}
      values.scheduledTransactionsDecoded.31:
+        {"target":"0x0F99738B2Fc14D77308337f3e2596b63aE7BCC4A","value":"0","function":"upgrade","inputs":{"proxy":"0x2a3DD3EB832aF982ec71669E178424b10Dca2EDe","implementation":"0x0FeB850B183C57534b56b7d56520133C8f9BDB65"},"predecessor":"0x0000000000000000000000000000000000000000000000000000000000000000","delay":"864000"}
      values.scheduledTransactionsDecoded.30:
+        {"target":"0x0F99738B2Fc14D77308337f3e2596b63aE7BCC4A","value":"0","function":"upgrade","inputs":{"proxy":"0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2","implementation":"0x103388f5661d224F4aFb555C7E4a8FB52d0b752d"},"predecessor":"0x0000000000000000000000000000000000000000000000000000000000000000","delay":"864000"}
      values.scheduledTransactionsDecoded.29:
+        {"target":"0x0F99738B2Fc14D77308337f3e2596b63aE7BCC4A","value":"0","function":"upgradeAndCall","inputs":{"proxy":"0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2","implementation":"0x9ab2cB2107d3E737f7977B2E5042C58dE98326ab","data":{}},"predecessor":"0x0000000000000000000000000000000000000000000000000000000000000000","delay":"259200"}
      values.scheduledTransactionsDecoded.28:
+        {"target":"0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2","value":"0","function":"updateRollup","inputs":{"rollupContract":"0x1E163594e13030244DCAf4cDfC2cd0ba3206DA80","newRollupTypeID":3,"upgradeData":"0x1c8b9370"},"predecessor":"0x0000000000000000000000000000000000000000000000000000000000000000","delay":"864000"}
      values.scheduledTransactionsDecoded.27:
+        {"target":"0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2","value":"0","function":"addNewRollupType","inputs":{"consensusImplementation":"0x7253F329302b1b5E774Ac641EA3743E9E3244f2E","verifier":"0x9B9671dB83CfcB4508bF361942488C5cA2b1286D","forkID":12,"rollupCompatibilityID":0,"genesis":"0xe3a7d8bae497945ba8ddc51c69564f60ad4c1a990b9c7bdbd27f7929bfa8f272","description":"Type: zkEVM, Version: Banana , genesis: /ipfs/QmUXnRoPbUmZuEZCGyiHjEsoNcFVu3hLtSvhpnfBS2mAYU"},"predecessor":"0x0000000000000000000000000000000000000000000000000000000000000000","delay":"864000"}
      values.scheduledTransactionsDecoded.26:
+        {"target":"0x0F99738B2Fc14D77308337f3e2596b63aE7BCC4A","value":"0","function":"upgradeAndCall","inputs":{"proxy":"0x2a3DD3EB832aF982ec71669E178424b10Dca2EDe","implementation":"0x75D28BfDfF93B3e4f20184b442d2634DC01cA48b","data":{}},"predecessor":"0x0000000000000000000000000000000000000000000000000000000000000000","delay":"259200"}
      values.scheduledTransactionsDecoded.25:
+        {"target":"0xEf1462451C30Ea7aD8555386226059Fe837CA4EF","value":"0","function":"updateDelay","inputs":{"newDelay":259200},"predecessor":"0x0000000000000000000000000000000000000000000000000000000000000000","delay":"864000"}
      values.scheduledTransactionsDecoded.24:
+        {"target":"0x0F99738B2Fc14D77308337f3e2596b63aE7BCC4A","value":"0","function":"upgradeAndCall","inputs":{"proxy":"0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2","implementation":"0x301442aA888701c8B86727d42F3C55Fb0dd9eF7F","data":{"_versionString":"v2.0.0-RC1-fork.5"}},"predecessor":"0x0000000000000000000000000000000000000000000000000000000000000000","delay":"864000"}
      values.scheduledTransactionsDecoded.23.function:
-        "upgrade"
+        "upgradeAndCall"
      values.scheduledTransactionsDecoded.23.inputs.implementation:
-        "0x2E38cD55163137483E30580Cb468C2dFf1d85077"
+        "0x9Bdda421219900454E94e01d641fE64c60D8f4C8"
      values.scheduledTransactionsDecoded.23.inputs.data:
+        {}
      values.scheduledTransactionsDecoded.22.target:
-        "0x0F99738B2Fc14D77308337f3e2596b63aE7BCC4A"
+        "0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2"
      values.scheduledTransactionsDecoded.22.function:
-        "upgradeAndCall"
+        "addNewRollupType"
      values.scheduledTransactionsDecoded.22.inputs.proxy:
-        "0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2"
      values.scheduledTransactionsDecoded.22.inputs.implementation:
-        "0xA33619940bceb9be7c9679Dd80FA2918C2476382"
      values.scheduledTransactionsDecoded.22.inputs.data:
-        {}
      values.scheduledTransactionsDecoded.22.inputs.consensusImplementation:
+        "0x10D296e8aDd0535be71639E5D1d1c30ae1C6bD4C"
      values.scheduledTransactionsDecoded.22.inputs.verifier:
+        "0x4AaBBA26EA9E7A7fbD052d17a167e6aE3F8eC7Be"
      values.scheduledTransactionsDecoded.22.inputs.forkID:
+        8
      values.scheduledTransactionsDecoded.22.inputs.rollupCompatibilityID:
+        0
      values.scheduledTransactionsDecoded.22.inputs.genesis:
+        "0xe3a7d8bae497945ba8ddc51c69564f60ad4c1a990b9c7bdbd27f7929bfa8f272"
      values.scheduledTransactionsDecoded.22.inputs.description:
+        "Type: Validium, Version: incaberry, genesis: /ipfs/QmUXnRoPbUmZuEZCGyiHjEsoNcFVu3hLtSvhpnfBS2mAYU"
      values.scheduledTransactionsDecoded.22.predecessor:
-        "0x0000000000000000000000000000000000000000000000000000000000000000"
+        "0x8bae5e2a8aaf4501e263b917591e7fcf9b1d28c85962a8847a845aff916b50ad"
      values.scheduledTransactionsDecoded.21.function:
-        "upgrade"
+        "upgradeAndCall"
      values.scheduledTransactionsDecoded.21.inputs.proxy:
-        "0x2a3DD3EB832aF982ec71669E178424b10Dca2EDe"
+        "0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2"
      values.scheduledTransactionsDecoded.21.inputs.implementation:
-        "0x0FeB850B183C57534b56b7d56520133C8f9BDB65"
+        "0xb1585916487AcEdD99952086f2950763D253b923"
      values.scheduledTransactionsDecoded.21.inputs.data:
+        {"_versionString":"v3.0.0-incaberry"}
      values.scheduledTransactionsDecoded.20.function:
-        "upgrade"
+        "upgradeAndCall"
      values.scheduledTransactionsDecoded.20.inputs.implementation:
-        "0x103388f5661d224F4aFb555C7E4a8FB52d0b752d"
+        "0x3b82Da772c825283d85d5d6717A77C6Ff582053b"
      values.scheduledTransactionsDecoded.20.inputs.data:
+        {"trustedAggregator":"0x6329Fe417621925C81c16F9F9a18c203C21Af7ab","_pendingStateTimeout":432000,"_trustedAggregatorTimeout":432000,"admin":"0x242daE44F5d8fb54B198D03a94dA45B5a4413e21","timelock":"0xEf1462451C30Ea7aD8555386226059Fe837CA4EF","emergencyCouncil":"0x37c58Dfa7BF0A165C5AAEdDf3e2EdB475ac6Dcb6","polygonZkEVM":"0x519E42c24163192Dca44CD3fBDCEBF6be9130987","zkEVMVerifier":"0x1C3A3da552b8662CD69538356b1E7c2E9CC1EBD8","zkEVMForkID":7,"zkEVMChainID":1101}
      values.scheduledTransactionsDecoded.19.function:
-        "updateRollup"
+        "addNewRollupType"
      values.scheduledTransactionsDecoded.19.inputs.rollupContract:
-        "0x1E163594e13030244DCAf4cDfC2cd0ba3206DA80"
      values.scheduledTransactionsDecoded.19.inputs.newRollupTypeID:
-        3
      values.scheduledTransactionsDecoded.19.inputs.upgradeData:
-        "0x1c8b9370"
      values.scheduledTransactionsDecoded.19.inputs.consensusImplementation:
+        "0x427113ae6F319BfFb4459bfF96eb8B6BDe1A127F"
      values.scheduledTransactionsDecoded.19.inputs.verifier:
+        "0x455ac63E96e6a64EA59C6Da0D8F90FCa3F1535aB"
      values.scheduledTransactionsDecoded.19.inputs.forkID:
+        13
      values.scheduledTransactionsDecoded.19.inputs.rollupCompatibilityID:
+        0
      values.scheduledTransactionsDecoded.19.inputs.genesis:
+        "0xe3a7d8bae497945ba8ddc51c69564f60ad4c1a990b9c7bdbd27f7929bfa8f272"
      values.scheduledTransactionsDecoded.19.inputs.description:
+        "Type: Validium, Version: fork.13 , genesis: /ipfs/QmUXnRoPbUmZuEZCGyiHjEsoNcFVu3hLtSvhpnfBS2mAYU"
      values.scheduledTransactionsDecoded.18.function:
-        "addNewRollupType"
+        "0xf34eb8eb"
      values.scheduledTransactionsDecoded.18.inputs.consensusImplementation:
-        "0x7253F329302b1b5E774Ac641EA3743E9E3244f2E"
      values.scheduledTransactionsDecoded.18.inputs.verifier:
-        "0x9B9671dB83CfcB4508bF361942488C5cA2b1286D"
      values.scheduledTransactionsDecoded.18.inputs.forkID:
-        12
      values.scheduledTransactionsDecoded.18.inputs.rollupCompatibilityID:
-        0
      values.scheduledTransactionsDecoded.18.inputs.genesis:
-        "0xe3a7d8bae497945ba8ddc51c69564f60ad4c1a990b9c7bdbd27f7929bfa8f272"
      values.scheduledTransactionsDecoded.18.inputs.description:
-        "Type: zkEVM, Version: Banana , genesis: /ipfs/QmUXnRoPbUmZuEZCGyiHjEsoNcFVu3hLtSvhpnfBS2mAYU"
      values.scheduledTransactionsDecoded.18.inputs.calldata:
+        "0000000000000000000000009cf80f7eb1c76ec5ae7a88b417e373449b73ac300000000000000000000000001c3a3da552b8662cd69538356b1e7c2e9cc1ebd800000000000000000000000000000000000000000000000000000000000000070000000000000000000000000000000000000000000000000000000000000000e3a7d8bae497945ba8ddc51c69564f60ad4c1a990b9c7bdbd27f7929bfa8f27200000000000000000000000000000000000000000000000000000000000000c0000000000000000000000000000000000000000000000000000000000000005d547970653a2056616c696469756d2c2056657273696f6e3a206574726f672c2067656e657369733a202f697066732f516d55586e526f5062556d5a75455a43477969486a45736f4e6346567533684c74537668706e664253326d415955000000"
      values.scheduledTransactionsDecoded.17.target:
-        "0xEf1462451C30Ea7aD8555386226059Fe837CA4EF"
+        "0x0F99738B2Fc14D77308337f3e2596b63aE7BCC4A"
      values.scheduledTransactionsDecoded.17.function:
-        "updateDelay"
+        "upgrade"
      values.scheduledTransactionsDecoded.17.inputs.newDelay:
-        259200
      values.scheduledTransactionsDecoded.17.inputs.proxy:
+        "0x580bda1e7A0CFAe92Fa7F6c20A3794F169CE3CFb"
      values.scheduledTransactionsDecoded.17.inputs.implementation:
+        "0xc38C76aE3C8A7dee99d07f1A39246ABe18919a48"
      values.scheduledTransactionsDecoded.17.delay:
-        "864000"
+        "259200"
      values.scheduledTransactionsDecoded.16.target:
-        "0x0F99738B2Fc14D77308337f3e2596b63aE7BCC4A"
+        "0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2"
      values.scheduledTransactionsDecoded.16.function:
-        "upgradeAndCall"
+        "updateRollup"
      values.scheduledTransactionsDecoded.16.inputs.proxy:
-        "0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2"
      values.scheduledTransactionsDecoded.16.inputs.implementation:
-        "0x301442aA888701c8B86727d42F3C55Fb0dd9eF7F"
      values.scheduledTransactionsDecoded.16.inputs.data:
-        {"_versionString":"v2.0.0-RC1-fork.5"}
      values.scheduledTransactionsDecoded.16.inputs.rollupContract:
+        "0x100d3ca4f97776A40A7D93dB4AbF0FEA34230666"
      values.scheduledTransactionsDecoded.16.inputs.newRollupTypeID:
+        11
      values.scheduledTransactionsDecoded.16.inputs.upgradeData:
+        "0x"
      values.scheduledTransactionsDecoded.16.delay:
-        "864000"
+        "259200"
      values.scheduledTransactionsDecoded.15.target:
-        "0x0F99738B2Fc14D77308337f3e2596b63aE7BCC4A"
+        "0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2"
      values.scheduledTransactionsDecoded.15.function:
-        "upgradeAndCall"
+        "updateRollup"
      values.scheduledTransactionsDecoded.15.inputs.proxy:
-        "0x580bda1e7A0CFAe92Fa7F6c20A3794F169CE3CFb"
      values.scheduledTransactionsDecoded.15.inputs.implementation:
-        "0x9Bdda421219900454E94e01d641fE64c60D8f4C8"
      values.scheduledTransactionsDecoded.15.inputs.data:
-        {}
      values.scheduledTransactionsDecoded.15.inputs.rollupContract:
+        "0xFE797cb13f7884FB9f0aE26fEB2a06ed8efccbe7"
      values.scheduledTransactionsDecoded.15.inputs.newRollupTypeID:
+        11
      values.scheduledTransactionsDecoded.15.inputs.upgradeData:
+        "0x"
      values.scheduledTransactionsDecoded.15.delay:
-        "864000"
+        "259200"
      values.scheduledTransactionsDecoded.14.function:
-        "addNewRollupType"
+        "updateRollup"
      values.scheduledTransactionsDecoded.14.inputs.consensusImplementation:
-        "0x10D296e8aDd0535be71639E5D1d1c30ae1C6bD4C"
      values.scheduledTransactionsDecoded.14.inputs.verifier:
-        "0x4AaBBA26EA9E7A7fbD052d17a167e6aE3F8eC7Be"
      values.scheduledTransactionsDecoded.14.inputs.forkID:
-        8
      values.scheduledTransactionsDecoded.14.inputs.rollupCompatibilityID:
-        0
      values.scheduledTransactionsDecoded.14.inputs.genesis:
-        "0xe3a7d8bae497945ba8ddc51c69564f60ad4c1a990b9c7bdbd27f7929bfa8f272"
      values.scheduledTransactionsDecoded.14.inputs.description:
-        "Type: Validium, Version: incaberry, genesis: /ipfs/QmUXnRoPbUmZuEZCGyiHjEsoNcFVu3hLtSvhpnfBS2mAYU"
      values.scheduledTransactionsDecoded.14.inputs.rollupContract:
+        "0x88404dD30A96AD25A765d733429Cf83138c7f8f4"
      values.scheduledTransactionsDecoded.14.inputs.newRollupTypeID:
+        11
      values.scheduledTransactionsDecoded.14.inputs.upgradeData:
+        "0x"
      values.scheduledTransactionsDecoded.14.predecessor:
-        "0x8bae5e2a8aaf4501e263b917591e7fcf9b1d28c85962a8847a845aff916b50ad"
+        "0x0000000000000000000000000000000000000000000000000000000000000000"
      values.scheduledTransactionsDecoded.14.delay:
-        "864000"
+        "259200"
      values.scheduledTransactionsDecoded.13.target:
-        "0x0F99738B2Fc14D77308337f3e2596b63aE7BCC4A"
+        "0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2"
      values.scheduledTransactionsDecoded.13.function:
-        "upgradeAndCall"
+        "updateRollup"
      values.scheduledTransactionsDecoded.13.inputs.proxy:
-        "0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2"
      values.scheduledTransactionsDecoded.13.inputs.implementation:
-        "0xb1585916487AcEdD99952086f2950763D253b923"
      values.scheduledTransactionsDecoded.13.inputs.data:
-        {"_versionString":"v3.0.0-incaberry"}
      values.scheduledTransactionsDecoded.13.inputs.rollupContract:
+        "0xC427E3Edc8ae4BD2698cbef251E06b83175f9dec"
      values.scheduledTransactionsDecoded.13.inputs.newRollupTypeID:
+        11
      values.scheduledTransactionsDecoded.13.inputs.upgradeData:
+        "0x"
      values.scheduledTransactionsDecoded.13.delay:
-        "864000"
+        "259200"
      values.scheduledTransactionsDecoded.12.target:
-        "0x0F99738B2Fc14D77308337f3e2596b63aE7BCC4A"
+        "0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2"
      values.scheduledTransactionsDecoded.12.function:
-        "upgradeAndCall"
+        "addNewRollupType"
      values.scheduledTransactionsDecoded.12.inputs.proxy:
-        "0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2"
      values.scheduledTransactionsDecoded.12.inputs.implementation:
-        "0x3b82Da772c825283d85d5d6717A77C6Ff582053b"
      values.scheduledTransactionsDecoded.12.inputs.data:
-        {"trustedAggregator":"0x6329Fe417621925C81c16F9F9a18c203C21Af7ab","_pendingStateTimeout":432000,"_trustedAggregatorTimeout":432000,"admin":"0x242daE44F5d8fb54B198D03a94dA45B5a4413e21","timelock":"0xEf1462451C30Ea7aD8555386226059Fe837CA4EF","emergencyCouncil":"0x37c58Dfa7BF0A165C5AAEdDf3e2EdB475ac6Dcb6","polygonZkEVM":"0x519E42c24163192Dca44CD3fBDCEBF6be9130987","zkEVMVerifier":"0x1C3A3da552b8662CD69538356b1E7c2E9CC1EBD8","zkEVMForkID":7,"zkEVMChainID":1101}
      values.scheduledTransactionsDecoded.12.inputs.consensusImplementation:
+        "0xe7FE45579D784DC83B0feD844A65f4cEEFDe5682"
      values.scheduledTransactionsDecoded.12.inputs.verifier:
+        "0x0000000000000000000000000000000000000000"
      values.scheduledTransactionsDecoded.12.inputs.forkID:
+        0
      values.scheduledTransactionsDecoded.12.inputs.rollupVerifierType:
+        2
      values.scheduledTransactionsDecoded.12.inputs.genesis:
+        "0x0000000000000000000000000000000000000000000000000000000000000000"
      values.scheduledTransactionsDecoded.12.inputs.description:
+        "Type: aggchainFEP"
      values.scheduledTransactionsDecoded.12.inputs.programVKey:
+        "0x0000000000000000000000000000000000000000000000000000000000000000"
      values.scheduledTransactionsDecoded.12.delay:
-        "864000"
+        "259200"
      values.scheduledTransactionsDecoded.11.function:
-        "addNewRollupType"
+        "updateRollup"
      values.scheduledTransactionsDecoded.11.inputs.consensusImplementation:
-        "0x427113ae6F319BfFb4459bfF96eb8B6BDe1A127F"
      values.scheduledTransactionsDecoded.11.inputs.verifier:
-        "0x455ac63E96e6a64EA59C6Da0D8F90FCa3F1535aB"
      values.scheduledTransactionsDecoded.11.inputs.forkID:
-        13
      values.scheduledTransactionsDecoded.11.inputs.rollupCompatibilityID:
-        0
      values.scheduledTransactionsDecoded.11.inputs.genesis:
-        "0xe3a7d8bae497945ba8ddc51c69564f60ad4c1a990b9c7bdbd27f7929bfa8f272"
      values.scheduledTransactionsDecoded.11.inputs.description:
-        "Type: Validium, Version: fork.13 , genesis: /ipfs/QmUXnRoPbUmZuEZCGyiHjEsoNcFVu3hLtSvhpnfBS2mAYU"
      values.scheduledTransactionsDecoded.11.inputs.rollupContract:
+        "0x7449449460b5B732A9754CA3d9A7916122A9190d"
      values.scheduledTransactionsDecoded.11.inputs.newRollupTypeID:
+        11
      values.scheduledTransactionsDecoded.11.inputs.upgradeData:
+        "0x"
      values.scheduledTransactionsDecoded.11.delay:
-        "864000"
+        "259200"
      values.scheduledTransactionsDecoded.10.function:
-        "0xf34eb8eb"
+        "addNewRollupType"
      values.scheduledTransactionsDecoded.10.inputs.calldata:
-        "0000000000000000000000009cf80f7eb1c76ec5ae7a88b417e373449b73ac300000000000000000000000001c3a3da552b8662cd69538356b1e7c2e9cc1ebd800000000000000000000000000000000000000000000000000000000000000070000000000000000000000000000000000000000000000000000000000000000e3a7d8bae497945ba8ddc51c69564f60ad4c1a990b9c7bdbd27f7929bfa8f27200000000000000000000000000000000000000000000000000000000000000c0000000000000000000000000000000000000000000000000000000000000005d547970653a2056616c696469756d2c2056657273696f6e3a206574726f672c2067656e657369733a202f697066732f516d55586e526f5062556d5a75455a43477969486a45736f4e6346567533684c74537668706e664253326d415955000000"
      values.scheduledTransactionsDecoded.10.inputs.consensusImplementation:
+        "0x427113ae6F319BfFb4459bfF96eb8B6BDe1A127F"
      values.scheduledTransactionsDecoded.10.inputs.verifier:
+        "0x9B9671dB83CfcB4508bF361942488C5cA2b1286D"
      values.scheduledTransactionsDecoded.10.inputs.forkID:
+        12
      values.scheduledTransactionsDecoded.10.inputs.rollupCompatibilityID:
+        0
      values.scheduledTransactionsDecoded.10.inputs.genesis:
+        "0xe3a7d8bae497945ba8ddc51c69564f60ad4c1a990b9c7bdbd27f7929bfa8f272"
      values.scheduledTransactionsDecoded.10.inputs.description:
+        "Type: Validium, Version: Banana , genesis: /ipfs/QmUXnRoPbUmZuEZCGyiHjEsoNcFVu3hLtSvhpnfBS2mAYU"
      values.scheduledTransactionsDecoded.9.function:
-        "addNewRollupType"
+        "updateRollup"
      values.scheduledTransactionsDecoded.9.inputs.consensusImplementation:
-        "0x427113ae6F319BfFb4459bfF96eb8B6BDe1A127F"
      values.scheduledTransactionsDecoded.9.inputs.verifier:
-        "0x9B9671dB83CfcB4508bF361942488C5cA2b1286D"
      values.scheduledTransactionsDecoded.9.inputs.forkID:
-        12
      values.scheduledTransactionsDecoded.9.inputs.rollupCompatibilityID:
-        0
      values.scheduledTransactionsDecoded.9.inputs.genesis:
-        "0xe3a7d8bae497945ba8ddc51c69564f60ad4c1a990b9c7bdbd27f7929bfa8f272"
      values.scheduledTransactionsDecoded.9.inputs.description:
-        "Type: Validium, Version: Banana , genesis: /ipfs/QmUXnRoPbUmZuEZCGyiHjEsoNcFVu3hLtSvhpnfBS2mAYU"
      values.scheduledTransactionsDecoded.9.inputs.rollupContract:
+        "0x519E42c24163192Dca44CD3fBDCEBF6be9130987"
      values.scheduledTransactionsDecoded.9.inputs.newRollupTypeID:
+        2
      values.scheduledTransactionsDecoded.9.inputs.upgradeData:
+        "0x"
      values.scheduledTransactionsDecoded.8.function:
-        "updateRollup"
+        "addNewRollupType"
      values.scheduledTransactionsDecoded.8.inputs.rollupContract:
-        "0x519E42c24163192Dca44CD3fBDCEBF6be9130987"
      values.scheduledTransactionsDecoded.8.inputs.newRollupTypeID:
-        2
      values.scheduledTransactionsDecoded.8.inputs.upgradeData:
-        "0x"
      values.scheduledTransactionsDecoded.8.inputs.consensusImplementation:
+        "0x2650a9a4fC64f63F573EF0F405064EF54BC46f71"
      values.scheduledTransactionsDecoded.8.inputs.verifier:
+        "0xc521580cd8586Cc688A7430F9DcE0f6A803F2883"
      values.scheduledTransactionsDecoded.8.inputs.forkID:
+        11
      values.scheduledTransactionsDecoded.8.inputs.rollupCompatibilityID:
+        0
      values.scheduledTransactionsDecoded.8.inputs.genesis:
+        "0xe3a7d8bae497945ba8ddc51c69564f60ad4c1a990b9c7bdbd27f7929bfa8f272"
      values.scheduledTransactionsDecoded.8.inputs.description:
+        "Type: zkEVM, Version: eggfruit N=25 , genesis: /ipfs/QmUXnRoPbUmZuEZCGyiHjEsoNcFVu3hLtSvhpnfBS2mAYU"
      values.scheduledTransactionsDecoded.7.inputs.verifier:
-        "0xc521580cd8586Cc688A7430F9DcE0f6A803F2883"
+        "0x4AaBBA26EA9E7A7fbD052d17a167e6aE3F8eC7Be"
      values.scheduledTransactionsDecoded.7.inputs.forkID:
-        11
+        8
      values.scheduledTransactionsDecoded.7.inputs.description:
-        "Type: zkEVM, Version: eggfruit N=25 , genesis: /ipfs/QmUXnRoPbUmZuEZCGyiHjEsoNcFVu3hLtSvhpnfBS2mAYU"
+        "Type: zkEVM, Version: incaberry, genesis: /ipfs/QmUXnRoPbUmZuEZCGyiHjEsoNcFVu3hLtSvhpnfBS2mAYU"
      values.scheduledTransactionsDecoded.6.inputs.consensusImplementation:
-        "0x2650a9a4fC64f63F573EF0F405064EF54BC46f71"
+        "0x18C45DD422f6587357a6d3b23307E75D42b2bc5B"
      values.scheduledTransactionsDecoded.6.inputs.verifier:
-        "0x4AaBBA26EA9E7A7fbD052d17a167e6aE3F8eC7Be"
+        "0x0459d576A6223fEeA177Fb3DF53C9c77BF84C459"
      values.scheduledTransactionsDecoded.6.inputs.forkID:
-        8
+        12
      values.scheduledTransactionsDecoded.6.inputs.rollupCompatibilityID:
-        0
      values.scheduledTransactionsDecoded.6.inputs.genesis:
-        "0xe3a7d8bae497945ba8ddc51c69564f60ad4c1a990b9c7bdbd27f7929bfa8f272"
+        "0x0000000000000000000000000000000000000000000000000000000000000000"
      values.scheduledTransactionsDecoded.6.inputs.description:
-        "Type: zkEVM, Version: incaberry, genesis: /ipfs/QmUXnRoPbUmZuEZCGyiHjEsoNcFVu3hLtSvhpnfBS2mAYU"
+        "Type: Pessimistic, Version: v0.3.3, genesis: /ipfs/QmUXnRoPbUmZuEZCGyiHjEsoNcFVu3hLtSvhpnfBS2mAYU"
      values.scheduledTransactionsDecoded.6.inputs.rollupVerifierType:
+        1
      values.scheduledTransactionsDecoded.6.inputs.programVKey:
+        "0x00eff0b6998df46ec388bb305618089ae3dc74e513e7676b2e1909694f49cc30"
      values.scheduledTransactionsDecoded.6.delay:
-        "864000"
+        "259200"
    }
```

Generated with discovered.json: 0x219a78007d80727ed1ba3e3313b8a254d573274b

# Diff at Mon, 09 Jun 2025 09:55:13 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@7cc006dadcc55e6cce3be3eb03d491835943fb43 block: 22536886
- current block number: 22666256

## Description

PolygonAdminMultisig adds members: 2/3 --> 5/12.

## Watched changes

```diff
    contract PolygonAdminMultisig (0x242daE44F5d8fb54B198D03a94dA45B5a4413e21) {
    +++ description: None
      values.$members.11:
+        "0xdFEd8373695a7b3DaF268CF91e71f6a7024A56Da"
      values.$members.10:
+        "0xEad77b01ea770839F7f576Cd1516Ff6A298d9dB2"
      values.$members.9:
+        "0xA0B02B28920812324f1cC3255bd8840867d3f227"
      values.$members.8:
+        "0xcAB31b6A7b4d2eCd562A09e2BfA46535a18862f9"
      values.$members.7:
+        "0x54c401eD03D086fE13221E5422165f3b024265d9"
      values.$members.6:
+        "0xED7cC82235A7757702475c8f77c7830c095FB5a2"
      values.$members.5:
+        "0xffbfc0c8331C5fc912DDA3C6D4A86eEB80203238"
      values.$members.4:
+        "0x21618593F7147235aC8D511d68A547C935F9d417"
      values.$members.3:
+        "0x4c1665d6651ecEfa59B9B3041951608468b18891"
      values.$members.2:
-        "0xEad77b01ea770839F7f576Cd1516Ff6A298d9dB2"
+        "0xeD44D1CFfB91e163CB7126bdEeA83959f175dB37"
      values.$members.1:
-        "0xA0B02B28920812324f1cC3255bd8840867d3f227"
+        "0x516eEcfb38aA308c5f1878497108c7d054fd46B7"
      values.$members.0:
-        "0x4c1665d6651ecEfa59B9B3041951608468b18891"
+        "0xAb3506507449bF1880f3337825efd19ac89E235E"
      values.$threshold:
-        2
+        5
      values.multisigThreshold:
-        "2 of 3 (67%)"
+        "5 of 12 (42%)"
    }
```

Generated with discovered.json: 0x604bed436391fbb83141f0f1f0f85418469719f7

# Diff at Fri, 23 May 2025 09:41:04 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@69cd181abbc3c830a6caf2f4429b37cae72ffdb8 block: 22536886
- current block number: 22536886

## Description

Introduced .role field on each permission, defaulting to field name on which it was defined (with '.' prefix)

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22536886 (main branch discovery), not current.

```diff
    contract SharedProxyAdmin (0x0F99738B2Fc14D77308337f3e2596b63aE7BCC4A) {
    +++ description: None
      directlyReceivedPermissions.2.role:
+        "admin"
      directlyReceivedPermissions.1.role:
+        "admin"
      directlyReceivedPermissions.0.role:
+        "admin"
    }
```

```diff
    EOA  (0x20A53dCb196cD2bcc14Ece01F358f1C849aA51dE) {
    +++ description: None
      receivedPermissions.0.role:
+        ".trustedAggregatorAC"
    }
```

```diff
    contract PolygonAdminMultisig (0x242daE44F5d8fb54B198D03a94dA45B5a4413e21) {
    +++ description: None
      receivedPermissions.7.role:
+        "admin"
      receivedPermissions.6.role:
+        "admin"
      receivedPermissions.5.permission:
-        "interact"
+        "upgrade"
      receivedPermissions.5.from:
-        "0xEf1462451C30Ea7aD8555386226059Fe837CA4EF"
+        "0x2a3DD3EB832aF982ec71669E178424b10Dca2EDe"
      receivedPermissions.5.delay:
-        259200
      receivedPermissions.5.description:
-        "propose, cancel and execute transactions in the timelock, manage all access control roles and change the minimum delay."
      receivedPermissions.5.condition:
-        "(no delay if in emergency state)"
      receivedPermissions.5.role:
+        "admin"
      receivedPermissions.5.via:
+        [{"address":"0x0F99738B2Fc14D77308337f3e2596b63aE7BCC4A"},{"address":"0xEf1462451C30Ea7aD8555386226059Fe837CA4EF","delay":259200,"condition":"(no delay if in emergency state)"}]
      receivedPermissions.4.role:
+        ".tweakParametersAC"
      receivedPermissions.3.via:
-        [{"address":"0xEf1462451C30Ea7aD8555386226059Fe837CA4EF","delay":259200,"condition":"(no delay if in emergency state)"}]
      receivedPermissions.3.role:
+        ".timelockAdminAC"
      receivedPermissions.2.role:
+        ".defaultAdminAC"
      receivedPermissions.1.permission:
-        "upgrade"
+        "interact"
      receivedPermissions.1.from:
-        "0x2a3DD3EB832aF982ec71669E178424b10Dca2EDe"
+        "0xEf1462451C30Ea7aD8555386226059Fe837CA4EF"
      receivedPermissions.1.via.1:
-        {"address":"0x0F99738B2Fc14D77308337f3e2596b63aE7BCC4A"}
      receivedPermissions.1.delay:
+        259200
      receivedPermissions.1.description:
+        "propose, cancel and execute transactions in the timelock, manage all access control roles and change the minimum delay."
      receivedPermissions.1.role:
+        ".timelockAdminAC"
      receivedPermissions.1.condition:
+        "(no delay if in emergency state)"
      receivedPermissions.0.role:
+        ".createRollupAC"
      directlyReceivedPermissions.0.role:
+        ".timelockAdminAC"
    }
```

```diff
    contract PolygonSecurityCouncil (0x37c58Dfa7BF0A165C5AAEdDf3e2EdB475ac6Dcb6) {
    +++ description: None
      receivedPermissions.0.role:
+        ".emergencyCouncilAdminAC"
    }
```

```diff
    EOA  (0x6329Fe417621925C81c16F9F9a18c203C21Af7ab) {
    +++ description: None
      receivedPermissions.0.role:
+        ".trustedAggregatorAC"
    }
```

```diff
    contract PolygonCreateRollupMultisig (0xC74eFc7fdb3BeC9c6930E91FFDF761b160dF79dB) {
    +++ description: None
      receivedPermissions.0.role:
+        ".createRollupAC"
    }
```

```diff
    contract Timelock (0xEf1462451C30Ea7aD8555386226059Fe837CA4EF) {
    +++ description: A timelock with access control. In the case of an activated emergency state in the 0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2, all transactions through this timelock are immediately executable. The current minimum delay is 3d.
      directlyReceivedPermissions.3.from:
-        "0xEf1462451C30Ea7aD8555386226059Fe837CA4EF"
+        "0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2"
      directlyReceivedPermissions.3.delay:
-        259200
      directlyReceivedPermissions.3.description:
-        "propose, cancel and execute transactions in the timelock, manage all access control roles and change the minimum delay."
+        "manage all access control roles, add new rollup types (which are implementation contracts that can then be upgraded to by connected projects), update any connected projects to new rollup types and rollback batches, connect existing rollups to the PolygonRollupManager."
      directlyReceivedPermissions.3.condition:
-        "(no delay if in emergency state)"
      directlyReceivedPermissions.3.role:
+        ".defaultAdminAC"
      directlyReceivedPermissions.2.from:
-        "0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2"
+        "0xEf1462451C30Ea7aD8555386226059Fe837CA4EF"
      directlyReceivedPermissions.2.description:
-        "manage all access control roles, add new rollup types (which are implementation contracts that can then be upgraded to by connected projects), update any connected projects to new rollup types and rollback batches, connect existing rollups to the PolygonRollupManager."
+        "propose, cancel and execute transactions in the timelock, manage all access control roles and change the minimum delay."
      directlyReceivedPermissions.2.delay:
+        259200
      directlyReceivedPermissions.2.role:
+        ".timelockAdminAC"
      directlyReceivedPermissions.2.condition:
+        "(no delay if in emergency state)"
      directlyReceivedPermissions.1.role:
+        ".timelockAdminAC"
      directlyReceivedPermissions.0.role:
+        ".owner"
    }
```

Generated with discovered.json: 0x8fccdf30acbc06bfb64600db9689892a5715fb63

# Diff at Thu, 22 May 2025 07:22:14 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@28ec750f325ec979450bcc4eaac304d60b8b1276 block: 22437961
- current block number: 22536886

## Description

another pessimistic proof test (see telegram).

## Watched changes

```diff
    contract PolygonRollupManager (0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2) {
    +++ description: The central shared managing contract for Layer 2s on the Polygon AggLayer. This contract receives L2 state roots as well as ZK proofs. All connected Layer 2s can be globally paused by activating the 'Emergency State'. This can be done by the 0x37c58Dfa7BF0A165C5AAEdDf3e2EdB475ac6Dcb6 or by anyone after 1 week of inactive verifiers.
+++ description: Lists any rollupID that sends a pessimistic proof.
      values.pessimisticProofSenders.4:
+        20
    }
```

Generated with discovered.json: 0xf24409b47de5bb61044cd351a996611ad12516e5

# Diff at Mon, 12 May 2025 13:18:50 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@5e25d362b71032c18a3417a2307d6923e1b5a519 block: 22437961
- current block number: 22437961

## Description

replace medium severity everywhere.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22437961 (main branch discovery), not current.

```diff
    contract PolygonRollupManager (0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2) {
    +++ description: The central shared managing contract for Layer 2s on the Polygon AggLayer. This contract receives L2 state roots as well as ZK proofs. All connected Layer 2s can be globally paused by activating the 'Emergency State'. This can be done by the 0x37c58Dfa7BF0A165C5AAEdDf3e2EdB475ac6Dcb6 or by anyone after 1 week of inactive verifiers.
      fieldMeta.rollupsDataV2.severity:
-        "MEDIUM"
+        "LOW"
    }
```

Generated with discovered.json: 0x59fd74e4a4dc51e3c208a3164504437795cf2525

# Diff at Fri, 09 May 2025 10:09:20 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@c3a1d49c07f4092914d62c65181e5fec18a88318 block: 22437961
- current block number: 22437961

## Description

Config related: Move IFs to the editable string for condition configs (yeet IFs from the automatic resolver).

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22437961 (main branch discovery), not current.

```diff
    contract PolygonAdminMultisig (0x242daE44F5d8fb54B198D03a94dA45B5a4413e21) {
    +++ description: None
      receivedPermissions.7.via.1.address:
-        "0xEf1462451C30Ea7aD8555386226059Fe837CA4EF"
+        "0x0F99738B2Fc14D77308337f3e2596b63aE7BCC4A"
      receivedPermissions.7.via.1.delay:
-        259200
      receivedPermissions.7.via.1.condition:
-        "there is no emergency state, in which case there would be no delay"
      receivedPermissions.7.via.0.address:
-        "0x0F99738B2Fc14D77308337f3e2596b63aE7BCC4A"
+        "0xEf1462451C30Ea7aD8555386226059Fe837CA4EF"
      receivedPermissions.7.via.0.delay:
+        259200
      receivedPermissions.7.via.0.condition:
+        "(no delay if in emergency state)"
      receivedPermissions.6.via.1.address:
-        "0xEf1462451C30Ea7aD8555386226059Fe837CA4EF"
+        "0x0F99738B2Fc14D77308337f3e2596b63aE7BCC4A"
      receivedPermissions.6.via.1.delay:
-        259200
      receivedPermissions.6.via.1.condition:
-        "there is no emergency state, in which case there would be no delay"
      receivedPermissions.6.via.0.address:
-        "0x0F99738B2Fc14D77308337f3e2596b63aE7BCC4A"
+        "0xEf1462451C30Ea7aD8555386226059Fe837CA4EF"
      receivedPermissions.6.via.0.delay:
+        259200
      receivedPermissions.6.via.0.condition:
+        "(no delay if in emergency state)"
      receivedPermissions.5.permission:
-        "upgrade"
+        "interact"
      receivedPermissions.5.from:
-        "0x2a3DD3EB832aF982ec71669E178424b10Dca2EDe"
+        "0xEf1462451C30Ea7aD8555386226059Fe837CA4EF"
      receivedPermissions.5.via:
-        [{"address":"0x0F99738B2Fc14D77308337f3e2596b63aE7BCC4A"},{"address":"0xEf1462451C30Ea7aD8555386226059Fe837CA4EF","delay":259200,"condition":"there is no emergency state, in which case there would be no delay"}]
      receivedPermissions.5.delay:
+        259200
      receivedPermissions.5.description:
+        "propose, cancel and execute transactions in the timelock, manage all access control roles and change the minimum delay."
      receivedPermissions.5.condition:
+        "(no delay if in emergency state)"
      receivedPermissions.4.from:
-        "0xEf1462451C30Ea7aD8555386226059Fe837CA4EF"
+        "0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2"
      receivedPermissions.4.delay:
-        259200
      receivedPermissions.4.description:
-        "propose, cancel and execute transactions in the timelock, manage all access control roles and change the minimum delay."
+        "manage parameters like fees for all connected projects, set the trusted aggregator, stop the emergency state, update projects and obsolete rollup types."
      receivedPermissions.4.condition:
-        "there is no emergency state, in which case there would be no delay"
      receivedPermissions.3.from:
-        "0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2"
+        "0xEf1462451C30Ea7aD8555386226059Fe837CA4EF"
      receivedPermissions.3.description:
-        "manage parameters like fees for all connected projects, set the trusted aggregator, stop the emergency state, update projects and obsolete rollup types."
+        "propose, cancel and execute transactions in the timelock, manage all access control roles and change the minimum delay."
      receivedPermissions.3.delay:
+        259200
      receivedPermissions.3.condition:
+        "(no delay if in emergency state)"
      receivedPermissions.3.via:
+        [{"address":"0xEf1462451C30Ea7aD8555386226059Fe837CA4EF","delay":259200,"condition":"(no delay if in emergency state)"}]
      receivedPermissions.2.from:
-        "0xEf1462451C30Ea7aD8555386226059Fe837CA4EF"
+        "0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2"
      receivedPermissions.2.delay:
-        259200
      receivedPermissions.2.description:
-        "propose, cancel and execute transactions in the timelock, manage all access control roles and change the minimum delay."
+        "manage all access control roles, add new rollup types (which are implementation contracts that can then be upgraded to by connected projects), update any connected projects to new rollup types and rollback batches, connect existing rollups to the PolygonRollupManager."
      receivedPermissions.2.condition:
-        "there is no emergency state, in which case there would be no delay"
      receivedPermissions.2.via.0.condition:
-        "there is no emergency state, in which case there would be no delay"
+        "(no delay if in emergency state)"
      receivedPermissions.1.permission:
-        "interact"
+        "upgrade"
      receivedPermissions.1.from:
-        "0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2"
+        "0x2a3DD3EB832aF982ec71669E178424b10Dca2EDe"
      receivedPermissions.1.description:
-        "manage all access control roles, add new rollup types (which are implementation contracts that can then be upgraded to by connected projects), update any connected projects to new rollup types and rollback batches, connect existing rollups to the PolygonRollupManager."
      receivedPermissions.1.via.1:
+        {"address":"0x0F99738B2Fc14D77308337f3e2596b63aE7BCC4A"}
      receivedPermissions.1.via.0.condition:
-        "there is no emergency state, in which case there would be no delay"
+        "(no delay if in emergency state)"
      directlyReceivedPermissions.0.condition:
-        "there is no emergency state, in which case there would be no delay"
+        "(no delay if in emergency state)"
    }
```

```diff
    contract Timelock (0xEf1462451C30Ea7aD8555386226059Fe837CA4EF) {
    +++ description: A timelock with access control. In the case of an activated emergency state in the 0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2, all transactions through this timelock are immediately executable. The current minimum delay is 3d.
      directlyReceivedPermissions.3.condition:
-        "there is no emergency state, in which case there would be no delay"
+        "(no delay if in emergency state)"
      directlyReceivedPermissions.1.condition:
-        "there is no emergency state, in which case there would be no delay"
+        "(no delay if in emergency state)"
    }
```

Generated with discovered.json: 0x3790834c91c575a8c2dfbc1d46dbc77183da6676

# Diff at Thu, 08 May 2025 09:34:56 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@8e1926142ab0c57cc131de4d8da307e13d9af54d block: 22397530
- current block number: 22437961

## Description

New cdk chain deployed: chainid 747474 (pessimistic).

## Watched changes

```diff
    contract PolygonRollupManager (0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2) {
    +++ description: The central shared managing contract for Layer 2s on the Polygon AggLayer. This contract receives L2 state roots as well as ZK proofs. All connected Layer 2s can be globally paused by activating the 'Emergency State'. This can be done by the 0x37c58Dfa7BF0A165C5AAEdDf3e2EdB475ac6Dcb6 or by anyone after 1 week of inactive verifiers.
      values.rollupCount:
-        19
+        20
+++ description: Maps rollup contracts and their verifier. Any change should be picked up also by the specific rollup config, unless it's a new rollup. [rollupContract, chainID, verifier, forkID, rollupVerifierType, programVKey]
+++ severity: MEDIUM
      values.rollupsDataV2.19:
+        {"rollupContract":"0x505ce1246F7e2Fd899dc5d3cfB17A47500Eb58bC","chainID":938,"verifier":"0x0775e11309d75aA6b0967917fB0213C5673eDf81","forkID":9,"rollupTypeID":4,"rollupVerifierType":0,"programVKey":"0x0000000000000000000000000000000000000000000000000000000000000000"}
      values.rollupsDataV2.18.rollupContract:
-        "0x505ce1246F7e2Fd899dc5d3cfB17A47500Eb58bC"
+        "0x88AaB361f108C3c959F2928Da3cD8e47298016B5"
      values.rollupsDataV2.18.chainID:
-        938
+        4913
      values.rollupsDataV2.17.rollupContract:
-        "0x88AaB361f108C3c959F2928Da3cD8e47298016B5"
+        "0x1E163594e13030244DCAf4cDfC2cd0ba3206DA80"
      values.rollupsDataV2.17.chainID:
-        4913
+        3776
      values.rollupsDataV2.16.rollupContract:
-        "0x1E163594e13030244DCAf4cDfC2cd0ba3206DA80"
+        "0xB4cEb70E8778a9928feD6ECBa1b03706a57b0ce8"
      values.rollupsDataV2.16.chainID:
-        3776
+        623
      values.rollupsDataV2.16.verifier:
-        "0x0775e11309d75aA6b0967917fB0213C5673eDf81"
+        "0x9B9671dB83CfcB4508bF361942488C5cA2b1286D"
      values.rollupsDataV2.16.forkID:
-        9
+        12
      values.rollupsDataV2.16.rollupTypeID:
-        4
+        7
      values.rollupsDataV2.15.rollupContract:
-        "0xB4cEb70E8778a9928feD6ECBa1b03706a57b0ce8"
+        "0x42Ac57F24EC4C3AAC843f6DBAcd9282DAaeE9238"
      values.rollupsDataV2.15.chainID:
-        623
+        1702448187
      values.rollupsDataV2.15.verifier:
-        "0x9B9671dB83CfcB4508bF361942488C5cA2b1286D"
+        "0x0775e11309d75aA6b0967917fB0213C5673eDf81"
      values.rollupsDataV2.15.forkID:
-        12
+        9
      values.rollupsDataV2.15.rollupTypeID:
-        7
+        4
      values.rollupsDataV2.14.rollupContract:
-        "0x42Ac57F24EC4C3AAC843f6DBAcd9282DAaeE9238"
+        "0x7449449460b5B732A9754CA3d9A7916122A9190d"
      values.rollupsDataV2.14.chainID:
-        1702448187
+        801
      values.rollupsDataV2.14.verifier:
-        "0x0775e11309d75aA6b0967917fB0213C5673eDf81"
+        "0xE00a3cBFC45241b33c0A44C78e26168CBc55EC63"
      values.rollupsDataV2.14.forkID:
-        9
+        12
      values.rollupsDataV2.14.rollupTypeID:
-        4
+        10
      values.rollupsDataV2.14.rollupVerifierType:
-        0
+        1
      values.rollupsDataV2.14.programVKey:
-        "0x0000000000000000000000000000000000000000000000000000000000000000"
+        "0x00dc9aac973a839dc15373ccf3aa0b0d503c1142ceb7d99b0c4fcc4a5c3ad09f"
      values.rollupsDataV2.13.rollupContract:
-        "0x7449449460b5B732A9754CA3d9A7916122A9190d"
+        "0xFE797cb13f7884FB9f0aE26fEB2a06ed8efccbe7"
      values.rollupsDataV2.13.chainID:
-        801
+        9369
      values.rollupsDataV2.12.rollupContract:
-        "0xFE797cb13f7884FB9f0aE26fEB2a06ed8efccbe7"
+        "0xB234F18738d9531CAD6ae6d9A587d09fe200272C"
      values.rollupsDataV2.12.chainID:
-        9369
+        999
      values.rollupsDataV2.12.verifier:
-        "0xE00a3cBFC45241b33c0A44C78e26168CBc55EC63"
+        "0x0775e11309d75aA6b0967917fB0213C5673eDf81"
      values.rollupsDataV2.12.forkID:
-        12
+        9
      values.rollupsDataV2.12.rollupTypeID:
-        10
+        4
      values.rollupsDataV2.12.rollupVerifierType:
-        1
+        0
      values.rollupsDataV2.12.programVKey:
-        "0x00dc9aac973a839dc15373ccf3aa0b0d503c1142ceb7d99b0c4fcc4a5c3ad09f"
+        "0x0000000000000000000000000000000000000000000000000000000000000000"
      values.rollupsDataV2.11.rollupContract:
-        "0xB234F18738d9531CAD6ae6d9A587d09fe200272C"
+        "0x88404dD30A96AD25A765d733429Cf83138c7f8f4"
      values.rollupsDataV2.11.chainID:
-        999
+        45056
      values.rollupsDataV2.11.verifier:
-        "0x0775e11309d75aA6b0967917fB0213C5673eDf81"
+        "0xE00a3cBFC45241b33c0A44C78e26168CBc55EC63"
      values.rollupsDataV2.11.forkID:
-        9
+        12
      values.rollupsDataV2.11.rollupTypeID:
-        4
+        10
      values.rollupsDataV2.11.rollupVerifierType:
-        0
+        1
      values.rollupsDataV2.11.programVKey:
-        "0x0000000000000000000000000000000000000000000000000000000000000000"
+        "0x00dc9aac973a839dc15373ccf3aa0b0d503c1142ceb7d99b0c4fcc4a5c3ad09f"
      values.rollupsDataV2.10.rollupContract:
-        "0x88404dD30A96AD25A765d733429Cf83138c7f8f4"
+        "0xC4E903D3Af4c3d2e437492d602adcC9d9b536858"
      values.rollupsDataV2.10.chainID:
-        45056
+        1511670449
      values.rollupsDataV2.10.verifier:
-        "0xE00a3cBFC45241b33c0A44C78e26168CBc55EC63"
+        "0x0775e11309d75aA6b0967917fB0213C5673eDf81"
      values.rollupsDataV2.10.forkID:
-        12
+        9
      values.rollupsDataV2.10.rollupTypeID:
-        10
+        4
      values.rollupsDataV2.10.rollupVerifierType:
-        1
+        0
      values.rollupsDataV2.10.programVKey:
-        "0x00dc9aac973a839dc15373ccf3aa0b0d503c1142ceb7d99b0c4fcc4a5c3ad09f"
+        "0x0000000000000000000000000000000000000000000000000000000000000000"
      values.rollupsDataV2.9.rollupContract:
-        "0xC4E903D3Af4c3d2e437492d602adcC9d9b536858"
+        "0x419dcD0f72ebAFd3524b65a97ac96699C7fBebdB"
      values.rollupsDataV2.9.chainID:
-        1511670449
+        2355
      values.rollupsDataV2.9.verifier:
-        "0x0775e11309d75aA6b0967917fB0213C5673eDf81"
+        "0x9B9671dB83CfcB4508bF361942488C5cA2b1286D"
      values.rollupsDataV2.9.forkID:
-        9
+        12
      values.rollupsDataV2.9.rollupTypeID:
-        4
+        7
      values.rollupsDataV2.8.rollupContract:
-        "0x419dcD0f72ebAFd3524b65a97ac96699C7fBebdB"
+        "0x78253E2E6120164bd826668A4C96Db20f78A94c9"
      values.rollupsDataV2.8.chainID:
-        2355
+        31415
      values.rollupsDataV2.8.verifier:
-        "0x9B9671dB83CfcB4508bF361942488C5cA2b1286D"
+        "0x0775e11309d75aA6b0967917fB0213C5673eDf81"
      values.rollupsDataV2.8.forkID:
-        12
+        9
      values.rollupsDataV2.8.rollupTypeID:
-        7
+        4
      values.rollupsDataV2.7.rollupContract:
-        "0x78253E2E6120164bd826668A4C96Db20f78A94c9"
+        "0x2B0ee28D4D51bC9aDde5E58E295873F61F4a0507"
      values.rollupsDataV2.7.chainID:
-        31415
+        196
      values.rollupsDataV2.7.verifier:
-        "0x0775e11309d75aA6b0967917fB0213C5673eDf81"
+        "0x455ac63E96e6a64EA59C6Da0D8F90FCa3F1535aB"
      values.rollupsDataV2.7.forkID:
-        9
+        13
      values.rollupsDataV2.7.rollupTypeID:
-        4
+        8
      values.rollupsDataV2.6.rollupContract:
-        "0x2B0ee28D4D51bC9aDde5E58E295873F61F4a0507"
+        "0x519E42c24163192Dca44CD3fBDCEBF6be9130987"
      values.rollupsDataV2.6.chainID:
-        196
+        1101
      values.rollupsDataV2.6.verifier:
-        "0x455ac63E96e6a64EA59C6Da0D8F90FCa3F1535aB"
+        "0x9B9671dB83CfcB4508bF361942488C5cA2b1286D"
      values.rollupsDataV2.6.forkID:
-        13
+        12
      values.rollupsDataV2.6.rollupTypeID:
-        8
+        6
      values.rollupsDataV2.5.rollupContract:
-        "0x519E42c24163192Dca44CD3fBDCEBF6be9130987"
+        "0x92726F7dE49300DBdb60930066bc1d0803c0740B"
      values.rollupsDataV2.5.chainID:
-        1101
+        994873017
      values.rollupsDataV2.5.rollupTypeID:
-        6
+        7
      values.rollupsDataV2.4.rollupContract:
-        "0x92726F7dE49300DBdb60930066bc1d0803c0740B"
+        "0x7fF0B5fF6Eb8B789456639AC2A02487c338c1789"
      values.rollupsDataV2.4.chainID:
-        994873017
+        752025
      values.rollupsDataV2.3.rollupContract:
-        "0x7fF0B5fF6Eb8B789456639AC2A02487c338c1789"
+        "0xb1714954bBc0162A36FB44934F3216aCE81C40d7"
      values.rollupsDataV2.3.chainID:
-        752025
+        3344
      values.rollupsDataV2.2.rollupContract:
-        "0xb1714954bBc0162A36FB44934F3216aCE81C40d7"
+        "0xA87df42CD53E998b3A610B8bCe3719871b0bb940"
      values.rollupsDataV2.2.chainID:
-        3344
+        511252203
      values.rollupsDataV2.2.verifier:
-        "0x9B9671dB83CfcB4508bF361942488C5cA2b1286D"
+        "0x0775e11309d75aA6b0967917fB0213C5673eDf81"
      values.rollupsDataV2.2.forkID:
-        12
+        9
      values.rollupsDataV2.2.rollupTypeID:
-        7
+        4
      values.rollupsDataV2.1.rollupContract:
-        "0xA87df42CD53E998b3A610B8bCe3719871b0bb940"
+        "0xC427E3Edc8ae4BD2698cbef251E06b83175f9dec"
      values.rollupsDataV2.1.chainID:
-        511252203
+        8088
      values.rollupsDataV2.1.verifier:
-        "0x0775e11309d75aA6b0967917fB0213C5673eDf81"
+        "0xE00a3cBFC45241b33c0A44C78e26168CBc55EC63"
      values.rollupsDataV2.1.forkID:
-        9
+        12
      values.rollupsDataV2.1.rollupTypeID:
-        4
+        10
      values.rollupsDataV2.1.rollupVerifierType:
-        0
+        1
      values.rollupsDataV2.1.programVKey:
-        "0x0000000000000000000000000000000000000000000000000000000000000000"
+        "0x00dc9aac973a839dc15373ccf3aa0b0d503c1142ceb7d99b0c4fcc4a5c3ad09f"
      values.rollupsDataV2.0.rollupContract:
-        "0xC427E3Edc8ae4BD2698cbef251E06b83175f9dec"
+        "0x100d3ca4f97776A40A7D93dB4AbF0FEA34230666"
      values.rollupsDataV2.0.chainID:
-        8088
+        747474
    }
```

Generated with discovered.json: 0xb582647f2aec9bb18827160deda27f8205de3b38

# Diff at Fri, 02 May 2025 17:24:37 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@c598e33a0c469175b7abbd6c2a13b47b63d6b6a4 block: 22367585
- current block number: 22397530

## Description

New pessimistic cdk prover deployed, chainid unknown. out of the 4 pessimistic provers, we have had 7 state updates so far: 4 from ID 14, and one each from ID 17,18,19. looks like testing, not in prod yet.

ref: https://dune.com/queries/4683507

## Watched changes

```diff
    contract PolygonRollupManager (0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2) {
    +++ description: The central shared managing contract for Layer 2s on the Polygon AggLayer. This contract receives L2 state roots as well as ZK proofs. All connected Layer 2s can be globally paused by activating the 'Emergency State'. This can be done by the 0x37c58Dfa7BF0A165C5AAEdDf3e2EdB475ac6Dcb6 or by anyone after 1 week of inactive verifiers.
+++ description: Lists any rollupID that sends a pessimistic proof.
      values.pessimisticProofSenders.3:
+        19
+++ description: Lists any rollupID that sends a pessimistic proof.
      values.pessimisticProofSenders.2:
+        18
      values.rollupCount:
-        18
+        19
+++ description: Maps rollup contracts and their verifier. Any change should be picked up also by the specific rollup config, unless it's a new rollup. [rollupContract, chainID, verifier, forkID, rollupVerifierType, programVKey]
+++ severity: MEDIUM
      values.rollupsDataV2.18:
+        {"rollupContract":"0x505ce1246F7e2Fd899dc5d3cfB17A47500Eb58bC","chainID":938,"verifier":"0x0775e11309d75aA6b0967917fB0213C5673eDf81","forkID":9,"rollupTypeID":4,"rollupVerifierType":0,"programVKey":"0x0000000000000000000000000000000000000000000000000000000000000000"}
      values.rollupsDataV2.17.rollupContract:
-        "0x505ce1246F7e2Fd899dc5d3cfB17A47500Eb58bC"
+        "0x88AaB361f108C3c959F2928Da3cD8e47298016B5"
      values.rollupsDataV2.17.chainID:
-        938
+        4913
      values.rollupsDataV2.16.rollupContract:
-        "0x88AaB361f108C3c959F2928Da3cD8e47298016B5"
+        "0x1E163594e13030244DCAf4cDfC2cd0ba3206DA80"
      values.rollupsDataV2.16.chainID:
-        4913
+        3776
      values.rollupsDataV2.15.rollupContract:
-        "0x1E163594e13030244DCAf4cDfC2cd0ba3206DA80"
+        "0xB4cEb70E8778a9928feD6ECBa1b03706a57b0ce8"
      values.rollupsDataV2.15.chainID:
-        3776
+        623
      values.rollupsDataV2.15.verifier:
-        "0x0775e11309d75aA6b0967917fB0213C5673eDf81"
+        "0x9B9671dB83CfcB4508bF361942488C5cA2b1286D"
      values.rollupsDataV2.15.forkID:
-        9
+        12
      values.rollupsDataV2.15.rollupTypeID:
-        4
+        7
      values.rollupsDataV2.14.rollupContract:
-        "0xB4cEb70E8778a9928feD6ECBa1b03706a57b0ce8"
+        "0x42Ac57F24EC4C3AAC843f6DBAcd9282DAaeE9238"
      values.rollupsDataV2.14.chainID:
-        623
+        1702448187
      values.rollupsDataV2.14.verifier:
-        "0x9B9671dB83CfcB4508bF361942488C5cA2b1286D"
+        "0x0775e11309d75aA6b0967917fB0213C5673eDf81"
      values.rollupsDataV2.14.forkID:
-        12
+        9
      values.rollupsDataV2.14.rollupTypeID:
-        7
+        4
      values.rollupsDataV2.13.rollupContract:
-        "0x42Ac57F24EC4C3AAC843f6DBAcd9282DAaeE9238"
+        "0x7449449460b5B732A9754CA3d9A7916122A9190d"
      values.rollupsDataV2.13.chainID:
-        1702448187
+        801
      values.rollupsDataV2.13.verifier:
-        "0x0775e11309d75aA6b0967917fB0213C5673eDf81"
+        "0xE00a3cBFC45241b33c0A44C78e26168CBc55EC63"
      values.rollupsDataV2.13.forkID:
-        9
+        12
      values.rollupsDataV2.13.rollupTypeID:
-        4
+        10
      values.rollupsDataV2.13.rollupVerifierType:
-        0
+        1
      values.rollupsDataV2.13.programVKey:
-        "0x0000000000000000000000000000000000000000000000000000000000000000"
+        "0x00dc9aac973a839dc15373ccf3aa0b0d503c1142ceb7d99b0c4fcc4a5c3ad09f"
      values.rollupsDataV2.12.rollupContract:
-        "0x7449449460b5B732A9754CA3d9A7916122A9190d"
+        "0xFE797cb13f7884FB9f0aE26fEB2a06ed8efccbe7"
      values.rollupsDataV2.12.chainID:
-        801
+        9369
      values.rollupsDataV2.11.rollupContract:
-        "0x419dcD0f72ebAFd3524b65a97ac96699C7fBebdB"
+        "0xB234F18738d9531CAD6ae6d9A587d09fe200272C"
      values.rollupsDataV2.11.chainID:
-        2355
+        999
      values.rollupsDataV2.10.rollupContract:
-        "0xFE797cb13f7884FB9f0aE26fEB2a06ed8efccbe7"
+        "0x88404dD30A96AD25A765d733429Cf83138c7f8f4"
      values.rollupsDataV2.10.chainID:
-        9369
+        45056
      values.rollupsDataV2.9.rollupContract:
-        "0xB234F18738d9531CAD6ae6d9A587d09fe200272C"
+        "0xC4E903D3Af4c3d2e437492d602adcC9d9b536858"
      values.rollupsDataV2.9.chainID:
-        999
+        1511670449
      values.rollupsDataV2.8.rollupContract:
-        "0x88404dD30A96AD25A765d733429Cf83138c7f8f4"
+        "0x419dcD0f72ebAFd3524b65a97ac96699C7fBebdB"
      values.rollupsDataV2.8.chainID:
-        45056
+        2355
      values.rollupsDataV2.8.verifier:
-        "0xE00a3cBFC45241b33c0A44C78e26168CBc55EC63"
+        "0x9B9671dB83CfcB4508bF361942488C5cA2b1286D"
      values.rollupsDataV2.8.rollupTypeID:
-        10
+        7
      values.rollupsDataV2.8.rollupVerifierType:
-        1
+        0
      values.rollupsDataV2.8.programVKey:
-        "0x00dc9aac973a839dc15373ccf3aa0b0d503c1142ceb7d99b0c4fcc4a5c3ad09f"
+        "0x0000000000000000000000000000000000000000000000000000000000000000"
      values.rollupsDataV2.7.rollupContract:
-        "0xC4E903D3Af4c3d2e437492d602adcC9d9b536858"
+        "0x78253E2E6120164bd826668A4C96Db20f78A94c9"
      values.rollupsDataV2.7.chainID:
-        1511670449
+        31415
      values.rollupsDataV2.6.rollupContract:
-        "0x78253E2E6120164bd826668A4C96Db20f78A94c9"
+        "0x2B0ee28D4D51bC9aDde5E58E295873F61F4a0507"
      values.rollupsDataV2.6.chainID:
-        31415
+        196
      values.rollupsDataV2.6.verifier:
-        "0x0775e11309d75aA6b0967917fB0213C5673eDf81"
+        "0x455ac63E96e6a64EA59C6Da0D8F90FCa3F1535aB"
      values.rollupsDataV2.6.forkID:
-        9
+        13
      values.rollupsDataV2.6.rollupTypeID:
-        4
+        8
      values.rollupsDataV2.5.rollupContract:
-        "0x2B0ee28D4D51bC9aDde5E58E295873F61F4a0507"
+        "0x519E42c24163192Dca44CD3fBDCEBF6be9130987"
      values.rollupsDataV2.5.chainID:
-        196
+        1101
      values.rollupsDataV2.5.verifier:
-        "0x455ac63E96e6a64EA59C6Da0D8F90FCa3F1535aB"
+        "0x9B9671dB83CfcB4508bF361942488C5cA2b1286D"
      values.rollupsDataV2.5.forkID:
-        13
+        12
      values.rollupsDataV2.5.rollupTypeID:
-        8
+        6
      values.rollupsDataV2.4.rollupContract:
-        "0x519E42c24163192Dca44CD3fBDCEBF6be9130987"
+        "0x92726F7dE49300DBdb60930066bc1d0803c0740B"
      values.rollupsDataV2.4.chainID:
-        1101
+        994873017
      values.rollupsDataV2.4.rollupTypeID:
-        6
+        7
      values.rollupsDataV2.3.rollupContract:
-        "0x92726F7dE49300DBdb60930066bc1d0803c0740B"
+        "0x7fF0B5fF6Eb8B789456639AC2A02487c338c1789"
      values.rollupsDataV2.3.chainID:
-        994873017
+        752025
      values.rollupsDataV2.2.rollupContract:
-        "0x7fF0B5fF6Eb8B789456639AC2A02487c338c1789"
+        "0xb1714954bBc0162A36FB44934F3216aCE81C40d7"
      values.rollupsDataV2.2.chainID:
-        752025
+        3344
      values.rollupsDataV2.1.rollupContract:
-        "0xb1714954bBc0162A36FB44934F3216aCE81C40d7"
+        "0xA87df42CD53E998b3A610B8bCe3719871b0bb940"
      values.rollupsDataV2.1.chainID:
-        3344
+        511252203
      values.rollupsDataV2.1.verifier:
-        "0x9B9671dB83CfcB4508bF361942488C5cA2b1286D"
+        "0x0775e11309d75aA6b0967917fB0213C5673eDf81"
      values.rollupsDataV2.1.forkID:
-        12
+        9
      values.rollupsDataV2.1.rollupTypeID:
-        7
+        4
      values.rollupsDataV2.0.rollupContract:
-        "0xA87df42CD53E998b3A610B8bCe3719871b0bb940"
+        "0xC427E3Edc8ae4BD2698cbef251E06b83175f9dec"
      values.rollupsDataV2.0.chainID:
-        511252203
+        8088
      values.rollupsDataV2.0.verifier:
-        "0x0775e11309d75aA6b0967917fB0213C5673eDf81"
+        "0xE00a3cBFC45241b33c0A44C78e26168CBc55EC63"
      values.rollupsDataV2.0.forkID:
-        9
+        12
      values.rollupsDataV2.0.rollupTypeID:
-        4
+        10
      values.rollupsDataV2.0.rollupVerifierType:
-        0
+        1
      values.rollupsDataV2.0.programVKey:
-        "0x0000000000000000000000000000000000000000000000000000000000000000"
+        "0x00dc9aac973a839dc15373ccf3aa0b0d503c1142ceb7d99b0c4fcc4a5c3ad09f"
    }
```

Generated with discovered.json: 0x95779d3ab110e1a1825674f5ddb4c9a2442e3687

# Diff at Tue, 29 Apr 2025 08:19:11 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@ef7477af00fe0b57a2f7cacf7e958c12494af662 block: 22367585
- current block number: 22367585

## Description

Field .issuedPermissions is removed from the output as no longer needed. Added 'permissionsConfigHash' due to refactoring of the modelling process (into a separate command).

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22367585 (main branch discovery), not current.

```diff
    contract PolygonSharedBridge (0x2a3DD3EB832aF982ec71669E178424b10Dca2EDe) {
    +++ description: The shared bridge contract, escrowing user funds sent to Layer 2s perticipating in the AggLayer. It is mirrored on each L2 and can be used to transfer both ERC20 assets and arbitrary messages.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x242daE44F5d8fb54B198D03a94dA45B5a4413e21","via":[{"address":"0xEf1462451C30Ea7aD8555386226059Fe837CA4EF","delay":259200,"condition":"there is no emergency state, in which case there would be no delay"},{"address":"0x0F99738B2Fc14D77308337f3e2596b63aE7BCC4A"}]}]
    }
```

```diff
    contract PolygonRollupManager (0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2) {
    +++ description: The central shared managing contract for Layer 2s on the Polygon AggLayer. This contract receives L2 state roots as well as ZK proofs. All connected Layer 2s can be globally paused by activating the 'Emergency State'. This can be done by the 0x37c58Dfa7BF0A165C5AAEdDf3e2EdB475ac6Dcb6 or by anyone after 1 week of inactive verifiers.
      issuedPermissions:
-        [{"permission":"aggregatePolygon","to":"0x20A53dCb196cD2bcc14Ece01F358f1C849aA51dE","via":[]},{"permission":"aggregatePolygon","to":"0x6329Fe417621925C81c16F9F9a18c203C21Af7ab","via":[]},{"permission":"interact","to":"0x242daE44F5d8fb54B198D03a94dA45B5a4413e21","description":"deploy new projects that use predefined rollup types (implementations) and connect them to the PolygonRollupManager.","via":[]},{"permission":"interact","to":"0x242daE44F5d8fb54B198D03a94dA45B5a4413e21","description":"manage all access control roles, add new rollup types (which are implementation contracts that can then be upgraded to by connected projects), update any connected projects to new rollup types and rollback batches, connect existing rollups to the PolygonRollupManager.","via":[{"address":"0xEf1462451C30Ea7aD8555386226059Fe837CA4EF","delay":259200,"condition":"there is no emergency state, in which case there would be no delay"}]},{"permission":"interact","to":"0x242daE44F5d8fb54B198D03a94dA45B5a4413e21","description":"manage parameters like fees for all connected projects, set the trusted aggregator, stop the emergency state, update projects and obsolete rollup types.","via":[]},{"permission":"interact","to":"0x37c58Dfa7BF0A165C5AAEdDf3e2EdB475ac6Dcb6","description":"activate the emergency state in the PolygonRollupManager and in the shared bridge immediately, effectively pausing all projects connected to them and making system contracts instantly upgradable.","via":[]},{"permission":"interact","to":"0xC74eFc7fdb3BeC9c6930E91FFDF761b160dF79dB","description":"deploy new projects that use predefined rollup types (implementations) and connect them to the PolygonRollupManager.","via":[]},{"permission":"upgrade","to":"0x242daE44F5d8fb54B198D03a94dA45B5a4413e21","via":[{"address":"0xEf1462451C30Ea7aD8555386226059Fe837CA4EF","delay":259200,"condition":"there is no emergency state, in which case there would be no delay"},{"address":"0x0F99738B2Fc14D77308337f3e2596b63aE7BCC4A"}]}]
    }
```

```diff
    contract PolygonGlobalExitRootV2 (0x580bda1e7A0CFAe92Fa7F6c20A3794F169CE3CFb) {
    +++ description: A merkle tree storage contract aggregating state roots of each participating Layer 2, thus creating a single global merkle root representing the global state of the AggLayer, the 'global exit root'. The global exit root is synchronized to all connected Layer 2s to help with their interoperability.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x242daE44F5d8fb54B198D03a94dA45B5a4413e21","via":[{"address":"0xEf1462451C30Ea7aD8555386226059Fe837CA4EF","delay":259200,"condition":"there is no emergency state, in which case there would be no delay"},{"address":"0x0F99738B2Fc14D77308337f3e2596b63aE7BCC4A"}]}]
    }
```

```diff
    contract Timelock (0xEf1462451C30Ea7aD8555386226059Fe837CA4EF) {
    +++ description: A timelock with access control. In the case of an activated emergency state in the 0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2, all transactions through this timelock are immediately executable. The current minimum delay is 3d.
      issuedPermissions:
-        [{"permission":"interact","to":"0x242daE44F5d8fb54B198D03a94dA45B5a4413e21","delay":259200,"description":"propose, cancel and execute transactions in the timelock, manage all access control roles and change the minimum delay.","condition":"there is no emergency state, in which case there would be no delay","via":[]},{"permission":"interact","to":"0x242daE44F5d8fb54B198D03a94dA45B5a4413e21","delay":259200,"description":"propose, cancel and execute transactions in the timelock, manage all access control roles and change the minimum delay.","condition":"there is no emergency state, in which case there would be no delay","via":[{"address":"0xEf1462451C30Ea7aD8555386226059Fe837CA4EF","delay":259200,"condition":"there is no emergency state, in which case there would be no delay"}]}]
    }
```

Generated with discovered.json: 0x0ccec8b3efe039eb17a8c6a692cc04cbe439f74d

# Diff at Mon, 28 Apr 2025 12:34:05 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@640aad31846aa48203969768d234f58dfd9896e5 block: 22244012
- current block number: 22367585

## Description

New unknown pessimistic agglayer chain deployed, not active yet.

## Watched changes

```diff
    contract PolygonRollupManager (0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2) {
    +++ description: The central shared managing contract for Layer 2s on the Polygon AggLayer. This contract receives L2 state roots as well as ZK proofs. All connected Layer 2s can be globally paused by activating the 'Emergency State'. This can be done by the 0x37c58Dfa7BF0A165C5AAEdDf3e2EdB475ac6Dcb6 or by anyone after 1 week of inactive verifiers.
      values.rollupCount:
-        17
+        18
+++ description: Maps rollup contracts and their verifier. Any change should be picked up also by the specific rollup config, unless it's a new rollup. [rollupContract, chainID, verifier, forkID, rollupVerifierType, programVKey]
+++ severity: MEDIUM
      values.rollupsDataV2.17:
+        {"rollupContract":"0x505ce1246F7e2Fd899dc5d3cfB17A47500Eb58bC","chainID":938,"verifier":"0x0775e11309d75aA6b0967917fB0213C5673eDf81","forkID":9,"rollupTypeID":4,"rollupVerifierType":0,"programVKey":"0x0000000000000000000000000000000000000000000000000000000000000000"}
      values.rollupsDataV2.16.rollupContract:
-        "0x505ce1246F7e2Fd899dc5d3cfB17A47500Eb58bC"
+        "0x88AaB361f108C3c959F2928Da3cD8e47298016B5"
      values.rollupsDataV2.16.chainID:
-        938
+        4913
      values.rollupsDataV2.15.rollupContract:
-        "0x88AaB361f108C3c959F2928Da3cD8e47298016B5"
+        "0x1E163594e13030244DCAf4cDfC2cd0ba3206DA80"
      values.rollupsDataV2.15.chainID:
-        4913
+        3776
      values.rollupsDataV2.14.rollupContract:
-        "0x1E163594e13030244DCAf4cDfC2cd0ba3206DA80"
+        "0xB4cEb70E8778a9928feD6ECBa1b03706a57b0ce8"
      values.rollupsDataV2.14.chainID:
-        3776
+        623
      values.rollupsDataV2.14.verifier:
-        "0x0775e11309d75aA6b0967917fB0213C5673eDf81"
+        "0x9B9671dB83CfcB4508bF361942488C5cA2b1286D"
      values.rollupsDataV2.14.forkID:
-        9
+        12
      values.rollupsDataV2.14.rollupTypeID:
-        4
+        7
      values.rollupsDataV2.13.rollupContract:
-        "0xB4cEb70E8778a9928feD6ECBa1b03706a57b0ce8"
+        "0x42Ac57F24EC4C3AAC843f6DBAcd9282DAaeE9238"
      values.rollupsDataV2.13.chainID:
-        623
+        1702448187
      values.rollupsDataV2.13.verifier:
-        "0x9B9671dB83CfcB4508bF361942488C5cA2b1286D"
+        "0x0775e11309d75aA6b0967917fB0213C5673eDf81"
      values.rollupsDataV2.13.forkID:
-        12
+        9
      values.rollupsDataV2.13.rollupTypeID:
-        7
+        4
      values.rollupsDataV2.12.rollupContract:
-        "0x42Ac57F24EC4C3AAC843f6DBAcd9282DAaeE9238"
+        "0x7449449460b5B732A9754CA3d9A7916122A9190d"
      values.rollupsDataV2.12.chainID:
-        1702448187
+        801
      values.rollupsDataV2.12.verifier:
-        "0x0775e11309d75aA6b0967917fB0213C5673eDf81"
+        "0xE00a3cBFC45241b33c0A44C78e26168CBc55EC63"
      values.rollupsDataV2.12.forkID:
-        9
+        12
      values.rollupsDataV2.12.rollupTypeID:
-        4
+        10
      values.rollupsDataV2.12.rollupVerifierType:
-        0
+        1
      values.rollupsDataV2.12.programVKey:
-        "0x0000000000000000000000000000000000000000000000000000000000000000"
+        "0x00dc9aac973a839dc15373ccf3aa0b0d503c1142ceb7d99b0c4fcc4a5c3ad09f"
      values.rollupsDataV2.11.rollupContract:
-        "0x7449449460b5B732A9754CA3d9A7916122A9190d"
+        "0x419dcD0f72ebAFd3524b65a97ac96699C7fBebdB"
      values.rollupsDataV2.11.chainID:
-        801
+        2355
      values.rollupsDataV2.11.verifier:
-        "0xE00a3cBFC45241b33c0A44C78e26168CBc55EC63"
+        "0x0775e11309d75aA6b0967917fB0213C5673eDf81"
      values.rollupsDataV2.11.forkID:
-        12
+        9
      values.rollupsDataV2.11.rollupTypeID:
-        10
+        4
      values.rollupsDataV2.11.rollupVerifierType:
-        1
+        0
      values.rollupsDataV2.11.programVKey:
-        "0x00dc9aac973a839dc15373ccf3aa0b0d503c1142ceb7d99b0c4fcc4a5c3ad09f"
+        "0x0000000000000000000000000000000000000000000000000000000000000000"
      values.rollupsDataV2.10.rollupContract:
-        "0x419dcD0f72ebAFd3524b65a97ac96699C7fBebdB"
+        "0xFE797cb13f7884FB9f0aE26fEB2a06ed8efccbe7"
      values.rollupsDataV2.10.chainID:
-        2355
+        9369
      values.rollupsDataV2.10.verifier:
-        "0x0775e11309d75aA6b0967917fB0213C5673eDf81"
+        "0xE00a3cBFC45241b33c0A44C78e26168CBc55EC63"
      values.rollupsDataV2.10.forkID:
-        9
+        12
      values.rollupsDataV2.10.rollupTypeID:
-        4
+        10
      values.rollupsDataV2.10.rollupVerifierType:
-        0
+        1
      values.rollupsDataV2.10.programVKey:
-        "0x0000000000000000000000000000000000000000000000000000000000000000"
+        "0x00dc9aac973a839dc15373ccf3aa0b0d503c1142ceb7d99b0c4fcc4a5c3ad09f"
      values.rollupsDataV2.9.rollupContract:
-        "0xFE797cb13f7884FB9f0aE26fEB2a06ed8efccbe7"
+        "0xB234F18738d9531CAD6ae6d9A587d09fe200272C"
      values.rollupsDataV2.9.chainID:
-        9369
+        999
      values.rollupsDataV2.9.verifier:
-        "0xE00a3cBFC45241b33c0A44C78e26168CBc55EC63"
+        "0x0775e11309d75aA6b0967917fB0213C5673eDf81"
      values.rollupsDataV2.9.forkID:
-        12
+        9
      values.rollupsDataV2.9.rollupTypeID:
-        10
+        4
      values.rollupsDataV2.9.rollupVerifierType:
-        1
+        0
      values.rollupsDataV2.9.programVKey:
-        "0x00dc9aac973a839dc15373ccf3aa0b0d503c1142ceb7d99b0c4fcc4a5c3ad09f"
+        "0x0000000000000000000000000000000000000000000000000000000000000000"
      values.rollupsDataV2.8.rollupContract:
-        "0xB234F18738d9531CAD6ae6d9A587d09fe200272C"
+        "0x88404dD30A96AD25A765d733429Cf83138c7f8f4"
      values.rollupsDataV2.8.chainID:
-        999
+        45056
      values.rollupsDataV2.8.verifier:
-        "0x0775e11309d75aA6b0967917fB0213C5673eDf81"
+        "0xE00a3cBFC45241b33c0A44C78e26168CBc55EC63"
      values.rollupsDataV2.8.forkID:
-        9
+        12
      values.rollupsDataV2.8.rollupTypeID:
-        4
+        10
      values.rollupsDataV2.8.rollupVerifierType:
-        0
+        1
      values.rollupsDataV2.8.programVKey:
-        "0x0000000000000000000000000000000000000000000000000000000000000000"
+        "0x00dc9aac973a839dc15373ccf3aa0b0d503c1142ceb7d99b0c4fcc4a5c3ad09f"
    }
```

Generated with discovered.json: 0x1702b5d59b68ee6112e17a0a2aa46e5431325cc7

# Diff at Thu, 24 Apr 2025 10:30:52 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@564f772ef796772c9952d7432df8286347a08d9e block: 22244012
- current block number: 22244012

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22244012 (main branch discovery), not current.

```diff
    contract PolygonRollupManager (0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2) {
    +++ description: The central shared managing contract for Layer 2s on the Polygon AggLayer. This contract receives L2 state roots as well as ZK proofs. All connected Layer 2s can be globally paused by activating the 'Emergency State'. This can be done by the 0x37c58Dfa7BF0A165C5AAEdDf3e2EdB475ac6Dcb6 or by anyone after 1 week of inactive verifiers.
      values.isVerifyingBatches:
-        [[true],[true],[true],[false],[true],[true],[true],[true],[true],[true],[true],[true],[true],[false],[false],[true],[false]]
+++ description: Maps rollup contracts and their verifier. Any change should be picked up also by the specific rollup config, unless it's a new rollup. [rollupContract, chainID, verifier, forkID, rollupVerifierType, programVKey]
+++ severity: MEDIUM
      values.rollupsDataV2.16:
-        ["0x505ce1246F7e2Fd899dc5d3cfB17A47500Eb58bC",938,"0x0775e11309d75aA6b0967917fB0213C5673eDf81",9,4,0,"0x0000000000000000000000000000000000000000000000000000000000000000"]
+        {"rollupContract":"0x505ce1246F7e2Fd899dc5d3cfB17A47500Eb58bC","chainID":938,"verifier":"0x0775e11309d75aA6b0967917fB0213C5673eDf81","forkID":9,"rollupTypeID":4,"rollupVerifierType":0,"programVKey":"0x0000000000000000000000000000000000000000000000000000000000000000"}
+++ description: Maps rollup contracts and their verifier. Any change should be picked up also by the specific rollup config, unless it's a new rollup. [rollupContract, chainID, verifier, forkID, rollupVerifierType, programVKey]
+++ severity: MEDIUM
      values.rollupsDataV2.15:
-        ["0xA87df42CD53E998b3A610B8bCe3719871b0bb940",511252203,"0x0775e11309d75aA6b0967917fB0213C5673eDf81",9,4,0,"0x0000000000000000000000000000000000000000000000000000000000000000"]
+        {"rollupContract":"0x88AaB361f108C3c959F2928Da3cD8e47298016B5","chainID":4913,"verifier":"0x0775e11309d75aA6b0967917fB0213C5673eDf81","forkID":9,"rollupTypeID":4,"rollupVerifierType":0,"programVKey":"0x0000000000000000000000000000000000000000000000000000000000000000"}
+++ description: Maps rollup contracts and their verifier. Any change should be picked up also by the specific rollup config, unless it's a new rollup. [rollupContract, chainID, verifier, forkID, rollupVerifierType, programVKey]
+++ severity: MEDIUM
      values.rollupsDataV2.14:
-        ["0xB234F18738d9531CAD6ae6d9A587d09fe200272C",999,"0x0775e11309d75aA6b0967917fB0213C5673eDf81",9,4,0,"0x0000000000000000000000000000000000000000000000000000000000000000"]
+        {"rollupContract":"0x1E163594e13030244DCAf4cDfC2cd0ba3206DA80","chainID":3776,"verifier":"0x0775e11309d75aA6b0967917fB0213C5673eDf81","forkID":9,"rollupTypeID":4,"rollupVerifierType":0,"programVKey":"0x0000000000000000000000000000000000000000000000000000000000000000"}
+++ description: Maps rollup contracts and their verifier. Any change should be picked up also by the specific rollup config, unless it's a new rollup. [rollupContract, chainID, verifier, forkID, rollupVerifierType, programVKey]
+++ severity: MEDIUM
      values.rollupsDataV2.13:
-        ["0x78253E2E6120164bd826668A4C96Db20f78A94c9",31415,"0x0775e11309d75aA6b0967917fB0213C5673eDf81",9,4,0,"0x0000000000000000000000000000000000000000000000000000000000000000"]
+        {"rollupContract":"0xB4cEb70E8778a9928feD6ECBa1b03706a57b0ce8","chainID":623,"verifier":"0x9B9671dB83CfcB4508bF361942488C5cA2b1286D","forkID":12,"rollupTypeID":7,"rollupVerifierType":0,"programVKey":"0x0000000000000000000000000000000000000000000000000000000000000000"}
+++ description: Maps rollup contracts and their verifier. Any change should be picked up also by the specific rollup config, unless it's a new rollup. [rollupContract, chainID, verifier, forkID, rollupVerifierType, programVKey]
+++ severity: MEDIUM
      values.rollupsDataV2.12:
-        ["0xB4cEb70E8778a9928feD6ECBa1b03706a57b0ce8",623,"0x9B9671dB83CfcB4508bF361942488C5cA2b1286D",12,7,0,"0x0000000000000000000000000000000000000000000000000000000000000000"]
+        {"rollupContract":"0x42Ac57F24EC4C3AAC843f6DBAcd9282DAaeE9238","chainID":1702448187,"verifier":"0x0775e11309d75aA6b0967917fB0213C5673eDf81","forkID":9,"rollupTypeID":4,"rollupVerifierType":0,"programVKey":"0x0000000000000000000000000000000000000000000000000000000000000000"}
+++ description: Maps rollup contracts and their verifier. Any change should be picked up also by the specific rollup config, unless it's a new rollup. [rollupContract, chainID, verifier, forkID, rollupVerifierType, programVKey]
+++ severity: MEDIUM
      values.rollupsDataV2.11:
-        ["0x2B0ee28D4D51bC9aDde5E58E295873F61F4a0507",196,"0x455ac63E96e6a64EA59C6Da0D8F90FCa3F1535aB",13,8,0,"0x0000000000000000000000000000000000000000000000000000000000000000"]
+        {"rollupContract":"0x7449449460b5B732A9754CA3d9A7916122A9190d","chainID":801,"verifier":"0xE00a3cBFC45241b33c0A44C78e26168CBc55EC63","forkID":12,"rollupTypeID":10,"rollupVerifierType":1,"programVKey":"0x00dc9aac973a839dc15373ccf3aa0b0d503c1142ceb7d99b0c4fcc4a5c3ad09f"}
+++ description: Maps rollup contracts and their verifier. Any change should be picked up also by the specific rollup config, unless it's a new rollup. [rollupContract, chainID, verifier, forkID, rollupVerifierType, programVKey]
+++ severity: MEDIUM
      values.rollupsDataV2.10:
-        ["0x1E163594e13030244DCAf4cDfC2cd0ba3206DA80",3776,"0x0775e11309d75aA6b0967917fB0213C5673eDf81",9,4,0,"0x0000000000000000000000000000000000000000000000000000000000000000"]
+        {"rollupContract":"0x419dcD0f72ebAFd3524b65a97ac96699C7fBebdB","chainID":2355,"verifier":"0x0775e11309d75aA6b0967917fB0213C5673eDf81","forkID":9,"rollupTypeID":4,"rollupVerifierType":0,"programVKey":"0x0000000000000000000000000000000000000000000000000000000000000000"}
+++ description: Maps rollup contracts and their verifier. Any change should be picked up also by the specific rollup config, unless it's a new rollup. [rollupContract, chainID, verifier, forkID, rollupVerifierType, programVKey]
+++ severity: MEDIUM
      values.rollupsDataV2.9:
-        ["0xC4E903D3Af4c3d2e437492d602adcC9d9b536858",1511670449,"0x0775e11309d75aA6b0967917fB0213C5673eDf81",9,4,0,"0x0000000000000000000000000000000000000000000000000000000000000000"]
+        {"rollupContract":"0xFE797cb13f7884FB9f0aE26fEB2a06ed8efccbe7","chainID":9369,"verifier":"0xE00a3cBFC45241b33c0A44C78e26168CBc55EC63","forkID":12,"rollupTypeID":10,"rollupVerifierType":1,"programVKey":"0x00dc9aac973a839dc15373ccf3aa0b0d503c1142ceb7d99b0c4fcc4a5c3ad09f"}
+++ description: Maps rollup contracts and their verifier. Any change should be picked up also by the specific rollup config, unless it's a new rollup. [rollupContract, chainID, verifier, forkID, rollupVerifierType, programVKey]
+++ severity: MEDIUM
      values.rollupsDataV2.8:
-        ["0x419dcD0f72ebAFd3524b65a97ac96699C7fBebdB",2355,"0x0775e11309d75aA6b0967917fB0213C5673eDf81",9,4,0,"0x0000000000000000000000000000000000000000000000000000000000000000"]
+        {"rollupContract":"0xB234F18738d9531CAD6ae6d9A587d09fe200272C","chainID":999,"verifier":"0x0775e11309d75aA6b0967917fB0213C5673eDf81","forkID":9,"rollupTypeID":4,"rollupVerifierType":0,"programVKey":"0x0000000000000000000000000000000000000000000000000000000000000000"}
+++ description: Maps rollup contracts and their verifier. Any change should be picked up also by the specific rollup config, unless it's a new rollup. [rollupContract, chainID, verifier, forkID, rollupVerifierType, programVKey]
+++ severity: MEDIUM
      values.rollupsDataV2.7:
-        ["0x88AaB361f108C3c959F2928Da3cD8e47298016B5",4913,"0x0775e11309d75aA6b0967917fB0213C5673eDf81",9,4,0,"0x0000000000000000000000000000000000000000000000000000000000000000"]
+        {"rollupContract":"0xC4E903D3Af4c3d2e437492d602adcC9d9b536858","chainID":1511670449,"verifier":"0x0775e11309d75aA6b0967917fB0213C5673eDf81","forkID":9,"rollupTypeID":4,"rollupVerifierType":0,"programVKey":"0x0000000000000000000000000000000000000000000000000000000000000000"}
+++ description: Maps rollup contracts and their verifier. Any change should be picked up also by the specific rollup config, unless it's a new rollup. [rollupContract, chainID, verifier, forkID, rollupVerifierType, programVKey]
+++ severity: MEDIUM
      values.rollupsDataV2.6:
-        ["0x42Ac57F24EC4C3AAC843f6DBAcd9282DAaeE9238",1702448187,"0x0775e11309d75aA6b0967917fB0213C5673eDf81",9,4,0,"0x0000000000000000000000000000000000000000000000000000000000000000"]
+        {"rollupContract":"0x78253E2E6120164bd826668A4C96Db20f78A94c9","chainID":31415,"verifier":"0x0775e11309d75aA6b0967917fB0213C5673eDf81","forkID":9,"rollupTypeID":4,"rollupVerifierType":0,"programVKey":"0x0000000000000000000000000000000000000000000000000000000000000000"}
+++ description: Maps rollup contracts and their verifier. Any change should be picked up also by the specific rollup config, unless it's a new rollup. [rollupContract, chainID, verifier, forkID, rollupVerifierType, programVKey]
+++ severity: MEDIUM
      values.rollupsDataV2.5:
-        ["0x7fF0B5fF6Eb8B789456639AC2A02487c338c1789",752025,"0x9B9671dB83CfcB4508bF361942488C5cA2b1286D",12,7,0,"0x0000000000000000000000000000000000000000000000000000000000000000"]
+        {"rollupContract":"0x2B0ee28D4D51bC9aDde5E58E295873F61F4a0507","chainID":196,"verifier":"0x455ac63E96e6a64EA59C6Da0D8F90FCa3F1535aB","forkID":13,"rollupTypeID":8,"rollupVerifierType":0,"programVKey":"0x0000000000000000000000000000000000000000000000000000000000000000"}
+++ description: Maps rollup contracts and their verifier. Any change should be picked up also by the specific rollup config, unless it's a new rollup. [rollupContract, chainID, verifier, forkID, rollupVerifierType, programVKey]
+++ severity: MEDIUM
      values.rollupsDataV2.4:
-        ["0xb1714954bBc0162A36FB44934F3216aCE81C40d7",3344,"0x9B9671dB83CfcB4508bF361942488C5cA2b1286D",12,7,0,"0x0000000000000000000000000000000000000000000000000000000000000000"]
+        {"rollupContract":"0x519E42c24163192Dca44CD3fBDCEBF6be9130987","chainID":1101,"verifier":"0x9B9671dB83CfcB4508bF361942488C5cA2b1286D","forkID":12,"rollupTypeID":6,"rollupVerifierType":0,"programVKey":"0x0000000000000000000000000000000000000000000000000000000000000000"}
+++ description: Maps rollup contracts and their verifier. Any change should be picked up also by the specific rollup config, unless it's a new rollup. [rollupContract, chainID, verifier, forkID, rollupVerifierType, programVKey]
+++ severity: MEDIUM
      values.rollupsDataV2.3:
-        ["0xFE797cb13f7884FB9f0aE26fEB2a06ed8efccbe7",9369,"0xE00a3cBFC45241b33c0A44C78e26168CBc55EC63",12,10,1,"0x00dc9aac973a839dc15373ccf3aa0b0d503c1142ceb7d99b0c4fcc4a5c3ad09f"]
+        {"rollupContract":"0x92726F7dE49300DBdb60930066bc1d0803c0740B","chainID":994873017,"verifier":"0x9B9671dB83CfcB4508bF361942488C5cA2b1286D","forkID":12,"rollupTypeID":7,"rollupVerifierType":0,"programVKey":"0x0000000000000000000000000000000000000000000000000000000000000000"}
+++ description: Maps rollup contracts and their verifier. Any change should be picked up also by the specific rollup config, unless it's a new rollup. [rollupContract, chainID, verifier, forkID, rollupVerifierType, programVKey]
+++ severity: MEDIUM
      values.rollupsDataV2.2:
-        ["0x92726F7dE49300DBdb60930066bc1d0803c0740B",994873017,"0x9B9671dB83CfcB4508bF361942488C5cA2b1286D",12,7,0,"0x0000000000000000000000000000000000000000000000000000000000000000"]
+        {"rollupContract":"0x7fF0B5fF6Eb8B789456639AC2A02487c338c1789","chainID":752025,"verifier":"0x9B9671dB83CfcB4508bF361942488C5cA2b1286D","forkID":12,"rollupTypeID":7,"rollupVerifierType":0,"programVKey":"0x0000000000000000000000000000000000000000000000000000000000000000"}
+++ description: Maps rollup contracts and their verifier. Any change should be picked up also by the specific rollup config, unless it's a new rollup. [rollupContract, chainID, verifier, forkID, rollupVerifierType, programVKey]
+++ severity: MEDIUM
      values.rollupsDataV2.1:
-        ["0x519E42c24163192Dca44CD3fBDCEBF6be9130987",1101,"0x9B9671dB83CfcB4508bF361942488C5cA2b1286D",12,6,0,"0x0000000000000000000000000000000000000000000000000000000000000000"]
+        {"rollupContract":"0xb1714954bBc0162A36FB44934F3216aCE81C40d7","chainID":3344,"verifier":"0x9B9671dB83CfcB4508bF361942488C5cA2b1286D","forkID":12,"rollupTypeID":7,"rollupVerifierType":0,"programVKey":"0x0000000000000000000000000000000000000000000000000000000000000000"}
+++ description: Maps rollup contracts and their verifier. Any change should be picked up also by the specific rollup config, unless it's a new rollup. [rollupContract, chainID, verifier, forkID, rollupVerifierType, programVKey]
+++ severity: MEDIUM
      values.rollupsDataV2.0:
-        ["0x7449449460b5B732A9754CA3d9A7916122A9190d",801,"0xE00a3cBFC45241b33c0A44C78e26168CBc55EC63",12,10,1,"0x00dc9aac973a839dc15373ccf3aa0b0d503c1142ceb7d99b0c4fcc4a5c3ad09f"]
+        {"rollupContract":"0xA87df42CD53E998b3A610B8bCe3719871b0bb940","chainID":511252203,"verifier":"0x0775e11309d75aA6b0967917fB0213C5673eDf81","forkID":9,"rollupTypeID":4,"rollupVerifierType":0,"programVKey":"0x0000000000000000000000000000000000000000000000000000000000000000"}
+++ description: struct consensusImplementation, verifier, forkID, rollupVerifierType, obsolete, programVKey
      values.rollupTypes.9:
-        ["0x2650a9a4fC64f63F573EF0F405064EF54BC46f71","0x4AaBBA26EA9E7A7fbD052d17a167e6aE3F8eC7Be",8,0,false,"0x0000000000000000000000000000000000000000000000000000000000000000"]
+        {"consensusImplementation":"0x2650a9a4fC64f63F573EF0F405064EF54BC46f71","verifier":"0x4AaBBA26EA9E7A7fbD052d17a167e6aE3F8eC7Be","forkID":8,"rollupVerifierType":0,"obsolete":false,"programVKey":"0x0000000000000000000000000000000000000000000000000000000000000000"}
+++ description: struct consensusImplementation, verifier, forkID, rollupVerifierType, obsolete, programVKey
      values.rollupTypes.8:
-        ["0x9cf80f7eB1C76ec5AE7A88b417e373449b73ac30","0x1C3A3da552b8662CD69538356b1E7c2E9CC1EBD8",7,0,false,"0x0000000000000000000000000000000000000000000000000000000000000000"]
+        {"consensusImplementation":"0x2650a9a4fC64f63F573EF0F405064EF54BC46f71","verifier":"0x0775e11309d75aA6b0967917fB0213C5673eDf81","forkID":9,"rollupVerifierType":0,"obsolete":false,"programVKey":"0x0000000000000000000000000000000000000000000000000000000000000000"}
+++ description: struct consensusImplementation, verifier, forkID, rollupVerifierType, obsolete, programVKey
      values.rollupTypes.7:
-        ["0x2650a9a4fC64f63F573EF0F405064EF54BC46f71","0x0775e11309d75aA6b0967917fB0213C5673eDf81",9,0,false,"0x0000000000000000000000000000000000000000000000000000000000000000"]
+        {"consensusImplementation":"0x10D296e8aDd0535be71639E5D1d1c30ae1C6bD4C","verifier":"0x0775e11309d75aA6b0967917fB0213C5673eDf81","forkID":9,"rollupVerifierType":0,"obsolete":false,"programVKey":"0x0000000000000000000000000000000000000000000000000000000000000000"}
+++ description: struct consensusImplementation, verifier, forkID, rollupVerifierType, obsolete, programVKey
      values.rollupTypes.6:
-        ["0x10D296e8aDd0535be71639E5D1d1c30ae1C6bD4C","0x0775e11309d75aA6b0967917fB0213C5673eDf81",9,0,false,"0x0000000000000000000000000000000000000000000000000000000000000000"]
+        {"consensusImplementation":"0x2650a9a4fC64f63F573EF0F405064EF54BC46f71","verifier":"0xc521580cd8586Cc688A7430F9DcE0f6A803F2883","forkID":11,"rollupVerifierType":0,"obsolete":false,"programVKey":"0x0000000000000000000000000000000000000000000000000000000000000000"}
+++ description: struct consensusImplementation, verifier, forkID, rollupVerifierType, obsolete, programVKey
      values.rollupTypes.5:
-        ["0x18C45DD422f6587357a6d3b23307E75D42b2bc5B","0xE00a3cBFC45241b33c0A44C78e26168CBc55EC63",12,1,false,"0x0062c685702e0582d900f3a19521270c92a58e2588230c4a5cf3b45103f4a512"]
+        {"consensusImplementation":"0x7253F329302b1b5E774Ac641EA3743E9E3244f2E","verifier":"0x9B9671dB83CfcB4508bF361942488C5cA2b1286D","forkID":12,"rollupVerifierType":0,"obsolete":false,"programVKey":"0x0000000000000000000000000000000000000000000000000000000000000000"}
+++ description: struct consensusImplementation, verifier, forkID, rollupVerifierType, obsolete, programVKey
      values.rollupTypes.4:
-        ["0x2650a9a4fC64f63F573EF0F405064EF54BC46f71","0xc521580cd8586Cc688A7430F9DcE0f6A803F2883",11,0,false,"0x0000000000000000000000000000000000000000000000000000000000000000"]
+        {"consensusImplementation":"0x18C45DD422f6587357a6d3b23307E75D42b2bc5B","verifier":"0xE00a3cBFC45241b33c0A44C78e26168CBc55EC63","forkID":12,"rollupVerifierType":1,"obsolete":false,"programVKey":"0x0062c685702e0582d900f3a19521270c92a58e2588230c4a5cf3b45103f4a512"}
+++ description: struct consensusImplementation, verifier, forkID, rollupVerifierType, obsolete, programVKey
      values.rollupTypes.3:
-        ["0x427113ae6F319BfFb4459bfF96eb8B6BDe1A127F","0x455ac63E96e6a64EA59C6Da0D8F90FCa3F1535aB",13,0,false,"0x0000000000000000000000000000000000000000000000000000000000000000"]
+        {"consensusImplementation":"0x9cf80f7eB1C76ec5AE7A88b417e373449b73ac30","verifier":"0x1C3A3da552b8662CD69538356b1E7c2E9CC1EBD8","forkID":7,"rollupVerifierType":0,"obsolete":false,"programVKey":"0x0000000000000000000000000000000000000000000000000000000000000000"}
+++ description: struct consensusImplementation, verifier, forkID, rollupVerifierType, obsolete, programVKey
      values.rollupTypes.2:
-        ["0x18C45DD422f6587357a6d3b23307E75D42b2bc5B","0xE00a3cBFC45241b33c0A44C78e26168CBc55EC63",12,1,false,"0x00dc9aac973a839dc15373ccf3aa0b0d503c1142ceb7d99b0c4fcc4a5c3ad09f"]
+        {"consensusImplementation":"0x427113ae6F319BfFb4459bfF96eb8B6BDe1A127F","verifier":"0x9B9671dB83CfcB4508bF361942488C5cA2b1286D","forkID":12,"rollupVerifierType":0,"obsolete":false,"programVKey":"0x0000000000000000000000000000000000000000000000000000000000000000"}
+++ description: struct consensusImplementation, verifier, forkID, rollupVerifierType, obsolete, programVKey
      values.rollupTypes.1:
-        ["0x7253F329302b1b5E774Ac641EA3743E9E3244f2E","0x9B9671dB83CfcB4508bF361942488C5cA2b1286D",12,0,false,"0x0000000000000000000000000000000000000000000000000000000000000000"]
+        {"consensusImplementation":"0x18C45DD422f6587357a6d3b23307E75D42b2bc5B","verifier":"0xE00a3cBFC45241b33c0A44C78e26168CBc55EC63","forkID":12,"rollupVerifierType":1,"obsolete":false,"programVKey":"0x00dc9aac973a839dc15373ccf3aa0b0d503c1142ceb7d99b0c4fcc4a5c3ad09f"}
+++ description: struct consensusImplementation, verifier, forkID, rollupVerifierType, obsolete, programVKey
      values.rollupTypes.0:
-        ["0x427113ae6F319BfFb4459bfF96eb8B6BDe1A127F","0x9B9671dB83CfcB4508bF361942488C5cA2b1286D",12,0,false,"0x0000000000000000000000000000000000000000000000000000000000000000"]
+        {"consensusImplementation":"0x427113ae6F319BfFb4459bfF96eb8B6BDe1A127F","verifier":"0x455ac63E96e6a64EA59C6Da0D8F90FCa3F1535aB","forkID":13,"rollupVerifierType":0,"obsolete":false,"programVKey":"0x0000000000000000000000000000000000000000000000000000000000000000"}
      fieldMeta.isVerifyingBatches:
-        {"description":"Checks if lastVerifiedBatch for a rollupID is greater than one. Works like a trigger for statetransition projects becoming active after deployment. Mind that index here is rollupID-1."}
      usedTypes:
-        [{"typeCaster":"GreaterThan","arg":{"value":1}}]
    }
```

Generated with discovered.json: 0xd4ebc0afa9d7d855e18a59d05550a109d713a4f0

# Diff at Fri, 11 Apr 2025 06:50:27 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@a946e9842245b891a11dfd66e5a103281bde27da block: 22166600
- current block number: 22244012

## Description

Okto sent first pessimistic proof. 
their version: https://docs.okto.tech/docs/okto-layer/okto-chain#architecture-and-technology

wallet with some test txs interacting with the shared bridge: https://etherscan.io/address/0x3899edd8656cdb21c0ecc06f3b7a2a0bf9d42ec4

## Watched changes

```diff
    contract PolygonRollupManager (0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2) {
    +++ description: The central shared managing contract for Layer 2s on the Polygon AggLayer. This contract receives L2 state roots as well as ZK proofs. All connected Layer 2s can be globally paused by activating the 'Emergency State'. This can be done by the 0x37c58Dfa7BF0A165C5AAEdDf3e2EdB475ac6Dcb6 or by anyone after 1 week of inactive verifiers.
+++ description: Lists any rollupID that sends a pessimistic proof.
      values.pessimisticProofSenders.1:
+        17
    }
```

Generated with discovered.json: 0x6bb793b34d8bd60b4eb430b5973da13db3337741

# Diff at Thu, 10 Apr 2025 14:43:10 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@f38a3c9bf359344e4c4cd3006f58271cb8f78d15 block: 22166600
- current block number: 22166600

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22166600 (main branch discovery), not current.

```diff
    contract SharedProxyAdmin (0x0F99738B2Fc14D77308337f3e2596b63aE7BCC4A) {
    +++ description: None
      displayName:
-        "ProxyAdmin"
    }
```

Generated with discovered.json: 0xd50d516713ea7febaf35ac98a821528e601a4751

# Diff at Mon, 31 Mar 2025 11:28:33 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@71ffebe835be10b6d5d09ef65aa19b910de8a2ec block: 22094624
- current block number: 22166600

## Description

new pessimistic chain: Okto ([possibly related](https://polygon.technology/blog/okto-to-integrate-okto-wallet-with-agglayer-for-seamless-aggregated-chain-experience)).

Rollup Data Summary:
| RollupID |                         Name |    ChainID | ForkID |       RollupTypeID | VerifierType |
|----------|------------------------------|------------|--------|--------------------|--------------|
|        1 |                polygon zkEVM |       1101 |     12 |      6 (zk rollup) |     standard |
|        2 |                        astar |       3776 |      9 |     4 (validiumV1) |     standard |
|        3 |                  OkX X Layer |        196 |     13 |   8 (okx validium) |     standard |
|        4 |           OEV network (dead) |       4913 |      9 |     4 (validiumV1) |     standard |
|        5 |       gptprotocol.org (dead) | 1511670449 |      9 |     4 (validiumV1) |     standard |
|        6 |          witnesschain (dead) | 1702448187 |      9 |     4 (validiumV1) |     standard |
|        7 |                    lumia.org |  994873017 |     12 |     7 (validiumV2) |     standard |
|        8 |          pay network (wirex) |      31415 |      9 |     4 (validiumV1) |     standard |
|        9 |           silicon-zk testnet |  511252203 |      9 |     4 (validiumV1) |     standard |
|       10 |                   silicon-zk |       2355 |      9 |     4 (validiumV1) |     standard |
|       11 |        haust.network testnet |        999 |      9 |     4 (validiumV1) |     standard |
|       12 |                haust.network |        938 |      9 |     4 (validiumV1) |     standard |
|       13 |               ternoa.network |     752025 |     12 |     7 (validiumV2) |     standard |
|       14 | cdk-sov test (z-chain/token) |       9369 |     12 | 10 (pessimistic 2) |  pessimistic |
|       15 |    pentagon.games/pen-chain  |        623 |     12 |     7 (validiumV2) |     standard |
|       16 |      pentagon games testnet? |       3344 |     12 |     7 (validiumV2) |     standard |
|       17 |               Okto (wallet?) |        801 |     12 | 10 (pessimistic 2) |  pessimistic |

## Watched changes

```diff
    contract PolygonRollupManager (0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2) {
    +++ description: The central shared managing contract for Layer 2s on the Polygon AggLayer. This contract receives L2 state roots as well as ZK proofs. All connected Layer 2s can be globally paused by activating the 'Emergency State'. This can be done by the 0x37c58Dfa7BF0A165C5AAEdDf3e2EdB475ac6Dcb6 or by anyone after 1 week of inactive verifiers.
+++ description: Checks if lastVerifiedBatch for a rollupID is greater than one. Works like a trigger for statetransition projects becoming active after deployment. Mind that index here is rollupID-1.
      values.isVerifyingBatches.16:
+        [false]
      values.rollupCount:
-        16
+        17
+++ description: Maps rollup contracts and their verifier. Any change should be picked up also by the specific rollup config, unless it's a new rollup. [rollupContract, chainID, verifier, forkID, rollupVerifierType, programVKey]
+++ severity: MEDIUM
      values.rollupsDataV2.16:
+        ["0x505ce1246F7e2Fd899dc5d3cfB17A47500Eb58bC",938,"0x0775e11309d75aA6b0967917fB0213C5673eDf81",9,4,0,"0x0000000000000000000000000000000000000000000000000000000000000000"]
+++ description: Maps rollup contracts and their verifier. Any change should be picked up also by the specific rollup config, unless it's a new rollup. [rollupContract, chainID, verifier, forkID, rollupVerifierType, programVKey]
+++ severity: MEDIUM
      values.rollupsDataV2.15.6:
-        938
+        "0xA87df42CD53E998b3A610B8bCe3719871b0bb940"
+++ description: Maps rollup contracts and their verifier. Any change should be picked up also by the specific rollup config, unless it's a new rollup. [rollupContract, chainID, verifier, forkID, rollupVerifierType, programVKey]
+++ severity: MEDIUM
      values.rollupsDataV2.15.5:
-        "0x505ce1246F7e2Fd899dc5d3cfB17A47500Eb58bC"
+        9
+++ description: Maps rollup contracts and their verifier. Any change should be picked up also by the specific rollup config, unless it's a new rollup. [rollupContract, chainID, verifier, forkID, rollupVerifierType, programVKey]
+++ severity: MEDIUM
      values.rollupsDataV2.15.4:
-        9
+        4
+++ description: Maps rollup contracts and their verifier. Any change should be picked up also by the specific rollup config, unless it's a new rollup. [rollupContract, chainID, verifier, forkID, rollupVerifierType, programVKey]
+++ severity: MEDIUM
      values.rollupsDataV2.15.3:
-        4
+        0
+++ description: Maps rollup contracts and their verifier. Any change should be picked up also by the specific rollup config, unless it's a new rollup. [rollupContract, chainID, verifier, forkID, rollupVerifierType, programVKey]
+++ severity: MEDIUM
      values.rollupsDataV2.15.2:
-        0
+        "0x0775e11309d75aA6b0967917fB0213C5673eDf81"
+++ description: Maps rollup contracts and their verifier. Any change should be picked up also by the specific rollup config, unless it's a new rollup. [rollupContract, chainID, verifier, forkID, rollupVerifierType, programVKey]
+++ severity: MEDIUM
      values.rollupsDataV2.15.1:
-        "0x0775e11309d75aA6b0967917fB0213C5673eDf81"
+        511252203
+++ description: Maps rollup contracts and their verifier. Any change should be picked up also by the specific rollup config, unless it's a new rollup. [rollupContract, chainID, verifier, forkID, rollupVerifierType, programVKey]
+++ severity: MEDIUM
      values.rollupsDataV2.14.6:
-        "0xA87df42CD53E998b3A610B8bCe3719871b0bb940"
+        999
+++ description: Maps rollup contracts and their verifier. Any change should be picked up also by the specific rollup config, unless it's a new rollup. [rollupContract, chainID, verifier, forkID, rollupVerifierType, programVKey]
+++ severity: MEDIUM
      values.rollupsDataV2.14.5:
-        9
+        "0xB234F18738d9531CAD6ae6d9A587d09fe200272C"
+++ description: Maps rollup contracts and their verifier. Any change should be picked up also by the specific rollup config, unless it's a new rollup. [rollupContract, chainID, verifier, forkID, rollupVerifierType, programVKey]
+++ severity: MEDIUM
      values.rollupsDataV2.14.4:
-        4
+        9
+++ description: Maps rollup contracts and their verifier. Any change should be picked up also by the specific rollup config, unless it's a new rollup. [rollupContract, chainID, verifier, forkID, rollupVerifierType, programVKey]
+++ severity: MEDIUM
      values.rollupsDataV2.14.3:
-        0
+        4
+++ description: Maps rollup contracts and their verifier. Any change should be picked up also by the specific rollup config, unless it's a new rollup. [rollupContract, chainID, verifier, forkID, rollupVerifierType, programVKey]
+++ severity: MEDIUM
      values.rollupsDataV2.14.2:
-        "0x0775e11309d75aA6b0967917fB0213C5673eDf81"
+        0
+++ description: Maps rollup contracts and their verifier. Any change should be picked up also by the specific rollup config, unless it's a new rollup. [rollupContract, chainID, verifier, forkID, rollupVerifierType, programVKey]
+++ severity: MEDIUM
      values.rollupsDataV2.14.1:
-        511252203
+        "0x0775e11309d75aA6b0967917fB0213C5673eDf81"
+++ description: Maps rollup contracts and their verifier. Any change should be picked up also by the specific rollup config, unless it's a new rollup. [rollupContract, chainID, verifier, forkID, rollupVerifierType, programVKey]
+++ severity: MEDIUM
      values.rollupsDataV2.13.6:
-        999
+        "0x78253E2E6120164bd826668A4C96Db20f78A94c9"
+++ description: Maps rollup contracts and their verifier. Any change should be picked up also by the specific rollup config, unless it's a new rollup. [rollupContract, chainID, verifier, forkID, rollupVerifierType, programVKey]
+++ severity: MEDIUM
      values.rollupsDataV2.13.5:
-        "0xB234F18738d9531CAD6ae6d9A587d09fe200272C"
+        9
+++ description: Maps rollup contracts and their verifier. Any change should be picked up also by the specific rollup config, unless it's a new rollup. [rollupContract, chainID, verifier, forkID, rollupVerifierType, programVKey]
+++ severity: MEDIUM
      values.rollupsDataV2.13.4:
-        9
+        4
+++ description: Maps rollup contracts and their verifier. Any change should be picked up also by the specific rollup config, unless it's a new rollup. [rollupContract, chainID, verifier, forkID, rollupVerifierType, programVKey]
+++ severity: MEDIUM
      values.rollupsDataV2.13.3:
-        4
+        0
+++ description: Maps rollup contracts and their verifier. Any change should be picked up also by the specific rollup config, unless it's a new rollup. [rollupContract, chainID, verifier, forkID, rollupVerifierType, programVKey]
+++ severity: MEDIUM
      values.rollupsDataV2.13.2:
-        0
+        "0x0775e11309d75aA6b0967917fB0213C5673eDf81"
+++ description: Maps rollup contracts and their verifier. Any change should be picked up also by the specific rollup config, unless it's a new rollup. [rollupContract, chainID, verifier, forkID, rollupVerifierType, programVKey]
+++ severity: MEDIUM
      values.rollupsDataV2.13.1:
-        "0x0775e11309d75aA6b0967917fB0213C5673eDf81"
+        31415
+++ description: Maps rollup contracts and their verifier. Any change should be picked up also by the specific rollup config, unless it's a new rollup. [rollupContract, chainID, verifier, forkID, rollupVerifierType, programVKey]
+++ severity: MEDIUM
      values.rollupsDataV2.12.6:
-        "0x78253E2E6120164bd826668A4C96Db20f78A94c9"
+        623
+++ description: Maps rollup contracts and their verifier. Any change should be picked up also by the specific rollup config, unless it's a new rollup. [rollupContract, chainID, verifier, forkID, rollupVerifierType, programVKey]
+++ severity: MEDIUM
      values.rollupsDataV2.12.5:
-        9
+        7
+++ description: Maps rollup contracts and their verifier. Any change should be picked up also by the specific rollup config, unless it's a new rollup. [rollupContract, chainID, verifier, forkID, rollupVerifierType, programVKey]
+++ severity: MEDIUM
      values.rollupsDataV2.12.4:
-        4
+        0
+++ description: Maps rollup contracts and their verifier. Any change should be picked up also by the specific rollup config, unless it's a new rollup. [rollupContract, chainID, verifier, forkID, rollupVerifierType, programVKey]
+++ severity: MEDIUM
      values.rollupsDataV2.12.3:
-        0
+        "0xB4cEb70E8778a9928feD6ECBa1b03706a57b0ce8"
+++ description: Maps rollup contracts and their verifier. Any change should be picked up also by the specific rollup config, unless it's a new rollup. [rollupContract, chainID, verifier, forkID, rollupVerifierType, programVKey]
+++ severity: MEDIUM
      values.rollupsDataV2.12.2:
-        "0x0775e11309d75aA6b0967917fB0213C5673eDf81"
+        "0x9B9671dB83CfcB4508bF361942488C5cA2b1286D"
+++ description: Maps rollup contracts and their verifier. Any change should be picked up also by the specific rollup config, unless it's a new rollup. [rollupContract, chainID, verifier, forkID, rollupVerifierType, programVKey]
+++ severity: MEDIUM
      values.rollupsDataV2.12.1:
-        31415
+        "0x0000000000000000000000000000000000000000000000000000000000000000"
+++ description: Maps rollup contracts and their verifier. Any change should be picked up also by the specific rollup config, unless it's a new rollup. [rollupContract, chainID, verifier, forkID, rollupVerifierType, programVKey]
+++ severity: MEDIUM
      values.rollupsDataV2.12.0:
-        "0x0000000000000000000000000000000000000000000000000000000000000000"
+        12
+++ description: Maps rollup contracts and their verifier. Any change should be picked up also by the specific rollup config, unless it's a new rollup. [rollupContract, chainID, verifier, forkID, rollupVerifierType, programVKey]
+++ severity: MEDIUM
      values.rollupsDataV2.11.6:
-        623
+        196
+++ description: Maps rollup contracts and their verifier. Any change should be picked up also by the specific rollup config, unless it's a new rollup. [rollupContract, chainID, verifier, forkID, rollupVerifierType, programVKey]
+++ severity: MEDIUM
      values.rollupsDataV2.11.5:
-        7
+        8
+++ description: Maps rollup contracts and their verifier. Any change should be picked up also by the specific rollup config, unless it's a new rollup. [rollupContract, chainID, verifier, forkID, rollupVerifierType, programVKey]
+++ severity: MEDIUM
      values.rollupsDataV2.11.3:
-        "0xB4cEb70E8778a9928feD6ECBa1b03706a57b0ce8"
+        "0x2B0ee28D4D51bC9aDde5E58E295873F61F4a0507"
+++ description: Maps rollup contracts and their verifier. Any change should be picked up also by the specific rollup config, unless it's a new rollup. [rollupContract, chainID, verifier, forkID, rollupVerifierType, programVKey]
+++ severity: MEDIUM
      values.rollupsDataV2.11.2:
-        "0x9B9671dB83CfcB4508bF361942488C5cA2b1286D"
+        "0x455ac63E96e6a64EA59C6Da0D8F90FCa3F1535aB"
+++ description: Maps rollup contracts and their verifier. Any change should be picked up also by the specific rollup config, unless it's a new rollup. [rollupContract, chainID, verifier, forkID, rollupVerifierType, programVKey]
+++ severity: MEDIUM
      values.rollupsDataV2.11.0:
-        12
+        13
+++ description: Maps rollup contracts and their verifier. Any change should be picked up also by the specific rollup config, unless it's a new rollup. [rollupContract, chainID, verifier, forkID, rollupVerifierType, programVKey]
+++ severity: MEDIUM
      values.rollupsDataV2.10.6:
-        196
+        "0x1E163594e13030244DCAf4cDfC2cd0ba3206DA80"
+++ description: Maps rollup contracts and their verifier. Any change should be picked up also by the specific rollup config, unless it's a new rollup. [rollupContract, chainID, verifier, forkID, rollupVerifierType, programVKey]
+++ severity: MEDIUM
      values.rollupsDataV2.10.5:
-        8
+        9
+++ description: Maps rollup contracts and their verifier. Any change should be picked up also by the specific rollup config, unless it's a new rollup. [rollupContract, chainID, verifier, forkID, rollupVerifierType, programVKey]
+++ severity: MEDIUM
      values.rollupsDataV2.10.4:
-        0
+        4
+++ description: Maps rollup contracts and their verifier. Any change should be picked up also by the specific rollup config, unless it's a new rollup. [rollupContract, chainID, verifier, forkID, rollupVerifierType, programVKey]
+++ severity: MEDIUM
      values.rollupsDataV2.10.3:
-        "0x2B0ee28D4D51bC9aDde5E58E295873F61F4a0507"
+        0
+++ description: Maps rollup contracts and their verifier. Any change should be picked up also by the specific rollup config, unless it's a new rollup. [rollupContract, chainID, verifier, forkID, rollupVerifierType, programVKey]
+++ severity: MEDIUM
      values.rollupsDataV2.10.2:
-        "0x455ac63E96e6a64EA59C6Da0D8F90FCa3F1535aB"
+        3776
+++ description: Maps rollup contracts and their verifier. Any change should be picked up also by the specific rollup config, unless it's a new rollup. [rollupContract, chainID, verifier, forkID, rollupVerifierType, programVKey]
+++ severity: MEDIUM
      values.rollupsDataV2.10.1:
-        "0x0000000000000000000000000000000000000000000000000000000000000000"
+        "0x0775e11309d75aA6b0967917fB0213C5673eDf81"
+++ description: Maps rollup contracts and their verifier. Any change should be picked up also by the specific rollup config, unless it's a new rollup. [rollupContract, chainID, verifier, forkID, rollupVerifierType, programVKey]
+++ severity: MEDIUM
      values.rollupsDataV2.10.0:
-        13
+        "0x0000000000000000000000000000000000000000000000000000000000000000"
+++ description: Maps rollup contracts and their verifier. Any change should be picked up also by the specific rollup config, unless it's a new rollup. [rollupContract, chainID, verifier, forkID, rollupVerifierType, programVKey]
+++ severity: MEDIUM
      values.rollupsDataV2.9.6:
-        "0x1E163594e13030244DCAf4cDfC2cd0ba3206DA80"
+        "0xC4E903D3Af4c3d2e437492d602adcC9d9b536858"
+++ description: Maps rollup contracts and their verifier. Any change should be picked up also by the specific rollup config, unless it's a new rollup. [rollupContract, chainID, verifier, forkID, rollupVerifierType, programVKey]
+++ severity: MEDIUM
      values.rollupsDataV2.9.2:
-        3776
+        1511670449
+++ description: Maps rollup contracts and their verifier. Any change should be picked up also by the specific rollup config, unless it's a new rollup. [rollupContract, chainID, verifier, forkID, rollupVerifierType, programVKey]
+++ severity: MEDIUM
      values.rollupsDataV2.8.6:
-        "0xC4E903D3Af4c3d2e437492d602adcC9d9b536858"
+        9
+++ description: Maps rollup contracts and their verifier. Any change should be picked up also by the specific rollup config, unless it's a new rollup. [rollupContract, chainID, verifier, forkID, rollupVerifierType, programVKey]
+++ severity: MEDIUM
      values.rollupsDataV2.8.5:
-        9
+        4
+++ description: Maps rollup contracts and their verifier. Any change should be picked up also by the specific rollup config, unless it's a new rollup. [rollupContract, chainID, verifier, forkID, rollupVerifierType, programVKey]
+++ severity: MEDIUM
      values.rollupsDataV2.8.4:
-        4
+        0
+++ description: Maps rollup contracts and their verifier. Any change should be picked up also by the specific rollup config, unless it's a new rollup. [rollupContract, chainID, verifier, forkID, rollupVerifierType, programVKey]
+++ severity: MEDIUM
      values.rollupsDataV2.8.3:
-        0
+        "0x419dcD0f72ebAFd3524b65a97ac96699C7fBebdB"
+++ description: Maps rollup contracts and their verifier. Any change should be picked up also by the specific rollup config, unless it's a new rollup. [rollupContract, chainID, verifier, forkID, rollupVerifierType, programVKey]
+++ severity: MEDIUM
      values.rollupsDataV2.8.2:
-        1511670449
+        2355
+++ description: Maps rollup contracts and their verifier. Any change should be picked up also by the specific rollup config, unless it's a new rollup. [rollupContract, chainID, verifier, forkID, rollupVerifierType, programVKey]
+++ severity: MEDIUM
      values.rollupsDataV2.7.3:
-        "0x419dcD0f72ebAFd3524b65a97ac96699C7fBebdB"
+        4913
+++ description: Maps rollup contracts and their verifier. Any change should be picked up also by the specific rollup config, unless it's a new rollup. [rollupContract, chainID, verifier, forkID, rollupVerifierType, programVKey]
+++ severity: MEDIUM
      values.rollupsDataV2.7.2:
-        2355
+        "0x0775e11309d75aA6b0967917fB0213C5673eDf81"
+++ description: Maps rollup contracts and their verifier. Any change should be picked up also by the specific rollup config, unless it's a new rollup. [rollupContract, chainID, verifier, forkID, rollupVerifierType, programVKey]
+++ severity: MEDIUM
      values.rollupsDataV2.7.1:
-        "0x0775e11309d75aA6b0967917fB0213C5673eDf81"
+        "0x88AaB361f108C3c959F2928Da3cD8e47298016B5"
+++ description: Maps rollup contracts and their verifier. Any change should be picked up also by the specific rollup config, unless it's a new rollup. [rollupContract, chainID, verifier, forkID, rollupVerifierType, programVKey]
+++ severity: MEDIUM
      values.rollupsDataV2.6.6:
-        9
+        1702448187
+++ description: Maps rollup contracts and their verifier. Any change should be picked up also by the specific rollup config, unless it's a new rollup. [rollupContract, chainID, verifier, forkID, rollupVerifierType, programVKey]
+++ severity: MEDIUM
      values.rollupsDataV2.6.5:
-        4
+        9
+++ description: Maps rollup contracts and their verifier. Any change should be picked up also by the specific rollup config, unless it's a new rollup. [rollupContract, chainID, verifier, forkID, rollupVerifierType, programVKey]
+++ severity: MEDIUM
      values.rollupsDataV2.6.4:
-        0
+        4
+++ description: Maps rollup contracts and their verifier. Any change should be picked up also by the specific rollup config, unless it's a new rollup. [rollupContract, chainID, verifier, forkID, rollupVerifierType, programVKey]
+++ severity: MEDIUM
      values.rollupsDataV2.6.3:
-        4913
+        0
+++ description: Maps rollup contracts and their verifier. Any change should be picked up also by the specific rollup config, unless it's a new rollup. [rollupContract, chainID, verifier, forkID, rollupVerifierType, programVKey]
+++ severity: MEDIUM
      values.rollupsDataV2.6.1:
-        "0x88AaB361f108C3c959F2928Da3cD8e47298016B5"
+        "0x42Ac57F24EC4C3AAC843f6DBAcd9282DAaeE9238"
+++ description: Maps rollup contracts and their verifier. Any change should be picked up also by the specific rollup config, unless it's a new rollup. [rollupContract, chainID, verifier, forkID, rollupVerifierType, programVKey]
+++ severity: MEDIUM
      values.rollupsDataV2.5.6:
-        1702448187
+        7
+++ description: Maps rollup contracts and their verifier. Any change should be picked up also by the specific rollup config, unless it's a new rollup. [rollupContract, chainID, verifier, forkID, rollupVerifierType, programVKey]
+++ severity: MEDIUM
      values.rollupsDataV2.5.5:
-        9
+        0
+++ description: Maps rollup contracts and their verifier. Any change should be picked up also by the specific rollup config, unless it's a new rollup. [rollupContract, chainID, verifier, forkID, rollupVerifierType, programVKey]
+++ severity: MEDIUM
      values.rollupsDataV2.5.4:
-        4
+        752025
+++ description: Maps rollup contracts and their verifier. Any change should be picked up also by the specific rollup config, unless it's a new rollup. [rollupContract, chainID, verifier, forkID, rollupVerifierType, programVKey]
+++ severity: MEDIUM
      values.rollupsDataV2.5.3:
-        0
+        "0x9B9671dB83CfcB4508bF361942488C5cA2b1286D"
+++ description: Maps rollup contracts and their verifier. Any change should be picked up also by the specific rollup config, unless it's a new rollup. [rollupContract, chainID, verifier, forkID, rollupVerifierType, programVKey]
+++ severity: MEDIUM
      values.rollupsDataV2.5.2:
-        "0x0775e11309d75aA6b0967917fB0213C5673eDf81"
+        "0x7fF0B5fF6Eb8B789456639AC2A02487c338c1789"
+++ description: Maps rollup contracts and their verifier. Any change should be picked up also by the specific rollup config, unless it's a new rollup. [rollupContract, chainID, verifier, forkID, rollupVerifierType, programVKey]
+++ severity: MEDIUM
      values.rollupsDataV2.5.1:
-        "0x42Ac57F24EC4C3AAC843f6DBAcd9282DAaeE9238"
+        "0x0000000000000000000000000000000000000000000000000000000000000000"
+++ description: Maps rollup contracts and their verifier. Any change should be picked up also by the specific rollup config, unless it's a new rollup. [rollupContract, chainID, verifier, forkID, rollupVerifierType, programVKey]
+++ severity: MEDIUM
      values.rollupsDataV2.5.0:
-        "0x0000000000000000000000000000000000000000000000000000000000000000"
+        12
+++ description: Maps rollup contracts and their verifier. Any change should be picked up also by the specific rollup config, unless it's a new rollup. [rollupContract, chainID, verifier, forkID, rollupVerifierType, programVKey]
+++ severity: MEDIUM
      values.rollupsDataV2.4.4:
-        752025
+        "0xb1714954bBc0162A36FB44934F3216aCE81C40d7"
+++ description: Maps rollup contracts and their verifier. Any change should be picked up also by the specific rollup config, unless it's a new rollup. [rollupContract, chainID, verifier, forkID, rollupVerifierType, programVKey]
+++ severity: MEDIUM
      values.rollupsDataV2.4.3:
-        "0x9B9671dB83CfcB4508bF361942488C5cA2b1286D"
+        3344
+++ description: Maps rollup contracts and their verifier. Any change should be picked up also by the specific rollup config, unless it's a new rollup. [rollupContract, chainID, verifier, forkID, rollupVerifierType, programVKey]
+++ severity: MEDIUM
      values.rollupsDataV2.4.2:
-        "0x7fF0B5fF6Eb8B789456639AC2A02487c338c1789"
+        "0x9B9671dB83CfcB4508bF361942488C5cA2b1286D"
+++ description: Maps rollup contracts and their verifier. Any change should be picked up also by the specific rollup config, unless it's a new rollup. [rollupContract, chainID, verifier, forkID, rollupVerifierType, programVKey]
+++ severity: MEDIUM
      values.rollupsDataV2.3.6:
-        7
+        1
+++ description: Maps rollup contracts and their verifier. Any change should be picked up also by the specific rollup config, unless it's a new rollup. [rollupContract, chainID, verifier, forkID, rollupVerifierType, programVKey]
+++ severity: MEDIUM
      values.rollupsDataV2.3.5:
-        0
+        "0xFE797cb13f7884FB9f0aE26fEB2a06ed8efccbe7"
+++ description: Maps rollup contracts and their verifier. Any change should be picked up also by the specific rollup config, unless it's a new rollup. [rollupContract, chainID, verifier, forkID, rollupVerifierType, programVKey]
+++ severity: MEDIUM
      values.rollupsDataV2.3.4:
-        "0xb1714954bBc0162A36FB44934F3216aCE81C40d7"
+        9369
+++ description: Maps rollup contracts and their verifier. Any change should be picked up also by the specific rollup config, unless it's a new rollup. [rollupContract, chainID, verifier, forkID, rollupVerifierType, programVKey]
+++ severity: MEDIUM
      values.rollupsDataV2.3.3:
-        3344
+        "0xE00a3cBFC45241b33c0A44C78e26168CBc55EC63"
+++ description: Maps rollup contracts and their verifier. Any change should be picked up also by the specific rollup config, unless it's a new rollup. [rollupContract, chainID, verifier, forkID, rollupVerifierType, programVKey]
+++ severity: MEDIUM
      values.rollupsDataV2.3.2:
-        "0x9B9671dB83CfcB4508bF361942488C5cA2b1286D"
+        12
+++ description: Maps rollup contracts and their verifier. Any change should be picked up also by the specific rollup config, unless it's a new rollup. [rollupContract, chainID, verifier, forkID, rollupVerifierType, programVKey]
+++ severity: MEDIUM
      values.rollupsDataV2.3.1:
-        "0x0000000000000000000000000000000000000000000000000000000000000000"
+        10
+++ description: Maps rollup contracts and their verifier. Any change should be picked up also by the specific rollup config, unless it's a new rollup. [rollupContract, chainID, verifier, forkID, rollupVerifierType, programVKey]
+++ severity: MEDIUM
      values.rollupsDataV2.3.0:
-        12
+        "0x00dc9aac973a839dc15373ccf3aa0b0d503c1142ceb7d99b0c4fcc4a5c3ad09f"
+++ description: Maps rollup contracts and their verifier. Any change should be picked up also by the specific rollup config, unless it's a new rollup. [rollupContract, chainID, verifier, forkID, rollupVerifierType, programVKey]
+++ severity: MEDIUM
      values.rollupsDataV2.2.6:
-        1
+        7
+++ description: Maps rollup contracts and their verifier. Any change should be picked up also by the specific rollup config, unless it's a new rollup. [rollupContract, chainID, verifier, forkID, rollupVerifierType, programVKey]
+++ severity: MEDIUM
      values.rollupsDataV2.2.5:
-        "0xFE797cb13f7884FB9f0aE26fEB2a06ed8efccbe7"
+        0
+++ description: Maps rollup contracts and their verifier. Any change should be picked up also by the specific rollup config, unless it's a new rollup. [rollupContract, chainID, verifier, forkID, rollupVerifierType, programVKey]
+++ severity: MEDIUM
      values.rollupsDataV2.2.4:
-        9369
+        "0x9B9671dB83CfcB4508bF361942488C5cA2b1286D"
+++ description: Maps rollup contracts and their verifier. Any change should be picked up also by the specific rollup config, unless it's a new rollup. [rollupContract, chainID, verifier, forkID, rollupVerifierType, programVKey]
+++ severity: MEDIUM
      values.rollupsDataV2.2.3:
-        "0xE00a3cBFC45241b33c0A44C78e26168CBc55EC63"
+        "0x0000000000000000000000000000000000000000000000000000000000000000"
+++ description: Maps rollup contracts and their verifier. Any change should be picked up also by the specific rollup config, unless it's a new rollup. [rollupContract, chainID, verifier, forkID, rollupVerifierType, programVKey]
+++ severity: MEDIUM
      values.rollupsDataV2.2.2:
-        12
+        "0x92726F7dE49300DBdb60930066bc1d0803c0740B"
+++ description: Maps rollup contracts and their verifier. Any change should be picked up also by the specific rollup config, unless it's a new rollup. [rollupContract, chainID, verifier, forkID, rollupVerifierType, programVKey]
+++ severity: MEDIUM
      values.rollupsDataV2.2.1:
-        10
+        994873017
+++ description: Maps rollup contracts and their verifier. Any change should be picked up also by the specific rollup config, unless it's a new rollup. [rollupContract, chainID, verifier, forkID, rollupVerifierType, programVKey]
+++ severity: MEDIUM
      values.rollupsDataV2.2.0:
-        "0x00dc9aac973a839dc15373ccf3aa0b0d503c1142ceb7d99b0c4fcc4a5c3ad09f"
+        12
+++ description: Maps rollup contracts and their verifier. Any change should be picked up also by the specific rollup config, unless it's a new rollup. [rollupContract, chainID, verifier, forkID, rollupVerifierType, programVKey]
+++ severity: MEDIUM
      values.rollupsDataV2.1.6:
-        7
+        6
+++ description: Maps rollup contracts and their verifier. Any change should be picked up also by the specific rollup config, unless it's a new rollup. [rollupContract, chainID, verifier, forkID, rollupVerifierType, programVKey]
+++ severity: MEDIUM
      values.rollupsDataV2.1.4:
-        "0x9B9671dB83CfcB4508bF361942488C5cA2b1286D"
+        1101
+++ description: Maps rollup contracts and their verifier. Any change should be picked up also by the specific rollup config, unless it's a new rollup. [rollupContract, chainID, verifier, forkID, rollupVerifierType, programVKey]
+++ severity: MEDIUM
      values.rollupsDataV2.1.3:
-        "0x0000000000000000000000000000000000000000000000000000000000000000"
+        "0x9B9671dB83CfcB4508bF361942488C5cA2b1286D"
+++ description: Maps rollup contracts and their verifier. Any change should be picked up also by the specific rollup config, unless it's a new rollup. [rollupContract, chainID, verifier, forkID, rollupVerifierType, programVKey]
+++ severity: MEDIUM
      values.rollupsDataV2.1.2:
-        "0x92726F7dE49300DBdb60930066bc1d0803c0740B"
+        "0x519E42c24163192Dca44CD3fBDCEBF6be9130987"
+++ description: Maps rollup contracts and their verifier. Any change should be picked up also by the specific rollup config, unless it's a new rollup. [rollupContract, chainID, verifier, forkID, rollupVerifierType, programVKey]
+++ severity: MEDIUM
      values.rollupsDataV2.1.1:
-        994873017
+        "0x0000000000000000000000000000000000000000000000000000000000000000"
+++ description: Maps rollup contracts and their verifier. Any change should be picked up also by the specific rollup config, unless it's a new rollup. [rollupContract, chainID, verifier, forkID, rollupVerifierType, programVKey]
+++ severity: MEDIUM
      values.rollupsDataV2.0.6:
-        6
+        801
+++ description: Maps rollup contracts and their verifier. Any change should be picked up also by the specific rollup config, unless it's a new rollup. [rollupContract, chainID, verifier, forkID, rollupVerifierType, programVKey]
+++ severity: MEDIUM
      values.rollupsDataV2.0.5:
-        0
+        1
+++ description: Maps rollup contracts and their verifier. Any change should be picked up also by the specific rollup config, unless it's a new rollup. [rollupContract, chainID, verifier, forkID, rollupVerifierType, programVKey]
+++ severity: MEDIUM
      values.rollupsDataV2.0.4:
-        1101
+        "0x7449449460b5B732A9754CA3d9A7916122A9190d"
+++ description: Maps rollup contracts and their verifier. Any change should be picked up also by the specific rollup config, unless it's a new rollup. [rollupContract, chainID, verifier, forkID, rollupVerifierType, programVKey]
+++ severity: MEDIUM
      values.rollupsDataV2.0.3:
-        "0x9B9671dB83CfcB4508bF361942488C5cA2b1286D"
+        "0xE00a3cBFC45241b33c0A44C78e26168CBc55EC63"
+++ description: Maps rollup contracts and their verifier. Any change should be picked up also by the specific rollup config, unless it's a new rollup. [rollupContract, chainID, verifier, forkID, rollupVerifierType, programVKey]
+++ severity: MEDIUM
      values.rollupsDataV2.0.2:
-        "0x519E42c24163192Dca44CD3fBDCEBF6be9130987"
+        12
+++ description: Maps rollup contracts and their verifier. Any change should be picked up also by the specific rollup config, unless it's a new rollup. [rollupContract, chainID, verifier, forkID, rollupVerifierType, programVKey]
+++ severity: MEDIUM
      values.rollupsDataV2.0.1:
-        "0x0000000000000000000000000000000000000000000000000000000000000000"
+        10
+++ description: Maps rollup contracts and their verifier. Any change should be picked up also by the specific rollup config, unless it's a new rollup. [rollupContract, chainID, verifier, forkID, rollupVerifierType, programVKey]
+++ severity: MEDIUM
      values.rollupsDataV2.0.0:
-        12
+        "0x00dc9aac973a839dc15373ccf3aa0b0d503c1142ceb7d99b0c4fcc4a5c3ad09f"
    }
```

Generated with discovered.json: 0x9967d0f137cbe05849364a7540a4fd92f9dc9c44

# Diff at Fri, 21 Mar 2025 10:24:27 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@a4eed3e556a58bb9ab448d141c0407f67ca3ce31 block: 22073418
- current block number: 22094624

## Description

ternoa.network becomes active.

## Watched changes

```diff
    contract PolygonRollupManager (0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2) {
    +++ description: The central shared managing contract for Layer 2s on the Polygon AggLayer. This contract receives L2 state roots as well as ZK proofs. All connected Layer 2s can be globally paused by activating the 'Emergency State'. This can be done by the 0x37c58Dfa7BF0A165C5AAEdDf3e2EdB475ac6Dcb6 or by anyone after 1 week of inactive verifiers.
+++ description: Checks if lastVerifiedBatch for a rollupID is greater than one. Works like a trigger for statetransition projects becoming active after deployment. Mind that index here is rollupID-1.
      values.isVerifyingBatches.12.0:
-        false
+        true
    }
```

Generated with discovered.json: 0x152877675a75a063cb211bb927dada9b26d2cf3e

# Diff at Tue, 18 Mar 2025 11:19:41 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@8a389387016e20fe96cd5cb775e4b943b3aaa832 block: 22045960
- current block number: 22073418

## Description

New pessimistic rollup type added (type 10). rollupID 14 is already using (upgraded) the new type, which only changes its programVkey.

The monitoring of pessimistic proofs is up and should alert in case any proofs are submitted.

Current output of `l2b fetchagg`:

Rollup Data Summary:
+----------+------------------------------+------------+--------+------------------+--------------+
| RollupID | Name                         | ChainID    | ForkID | RollupTypeID     | VerifierType |
+==========+==============================+============+========+==================+==============+
| 1        | polygon zkEVM                | 1101       | 12     | 6 (zk rollup)    | standard     |
| 2        | astar                        | 3776       | 9      | 4 (validiumV1)   | standard     |
| 3        | OkX X Layer                  | 196        | 13     | 8 (okx validium) | standard     |
| 4        | OEV network (dead)           | 4913       | 9      | 4 (validiumV1)   | standard     |
| 5        | gptprotocol.org (dead)       | 1511670449 | 9      | 4 (validiumV1)   | standard     |
| 6        | witnesschain (dead)          | 1702448187 | 9      | 4 (validiumV1)   | standard     |
| 7        | lumia.org                    | 994873017  | 12     | 7 (validiumV2)   | standard     |
| 8        | pay network (wirex)          | 31415      | 9      | 4 (validiumV1)   | standard     |
| 9        | silicon-zk testnet           | 511252203  | 9      | 4 (validiumV1)   | standard     |
| 10       | silicon-zk                   | 2355       | 9      | 4 (validiumV1)   | standard     |
| 11       | haust.network testnet        | 999        | 9      | 4 (validiumV1)   | standard     |
| 12       | haust.network                | 938        | 9      | 4 (validiumV1)   | standard     |
| 13       | ternoa.network               | 752025     | 12     | 7 (validiumV2)   | standard     |
| 14       | cdk-sov test (z-chain/token) | 9369       | 12     | 10 (Unknown)     | pessimistic  |
| 15       | pentagon.games/pen-chain     | 623        | 12     | 7 (validiumV2)   | standard     |
| 16       | pentagon games testnet?      | 3344       | 12     | 7 (validiumV2)   | standard     |
+----------+------------------------------+------------+--------+------------------+--------------+

## Watched changes

```diff
    contract PolygonRollupManager (0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2) {
    +++ description: The central shared managing contract for Layer 2s on the Polygon AggLayer. This contract receives L2 state roots as well as ZK proofs. All connected Layer 2s can be globally paused by activating the 'Emergency State'. This can be done by the 0x37c58Dfa7BF0A165C5AAEdDf3e2EdB475ac6Dcb6 or by anyone after 1 week of inactive verifiers.
+++ description: Maps rollup contracts and their verifier. Any change should be picked up also by the specific rollup config, unless it's a new rollup. [rollupContract, chainID, verifier, forkID, rollupVerifierType, programVKey]
+++ severity: MEDIUM
      values.rollupsDataV2.10.6:
-        9
+        196
+++ description: Maps rollup contracts and their verifier. Any change should be picked up also by the specific rollup config, unless it's a new rollup. [rollupContract, chainID, verifier, forkID, rollupVerifierType, programVKey]
+++ severity: MEDIUM
      values.rollupsDataV2.10.5:
-        1
+        8
+++ description: Maps rollup contracts and their verifier. Any change should be picked up also by the specific rollup config, unless it's a new rollup. [rollupContract, chainID, verifier, forkID, rollupVerifierType, programVKey]
+++ severity: MEDIUM
      values.rollupsDataV2.10.4:
-        "0xFE797cb13f7884FB9f0aE26fEB2a06ed8efccbe7"
+        0
+++ description: Maps rollup contracts and their verifier. Any change should be picked up also by the specific rollup config, unless it's a new rollup. [rollupContract, chainID, verifier, forkID, rollupVerifierType, programVKey]
+++ severity: MEDIUM
      values.rollupsDataV2.10.3:
-        9369
+        "0x2B0ee28D4D51bC9aDde5E58E295873F61F4a0507"
+++ description: Maps rollup contracts and their verifier. Any change should be picked up also by the specific rollup config, unless it's a new rollup. [rollupContract, chainID, verifier, forkID, rollupVerifierType, programVKey]
+++ severity: MEDIUM
      values.rollupsDataV2.10.2:
-        "0x0062c685702e0582d900f3a19521270c92a58e2588230c4a5cf3b45103f4a512"
+        "0x455ac63E96e6a64EA59C6Da0D8F90FCa3F1535aB"
+++ description: Maps rollup contracts and their verifier. Any change should be picked up also by the specific rollup config, unless it's a new rollup. [rollupContract, chainID, verifier, forkID, rollupVerifierType, programVKey]
+++ severity: MEDIUM
      values.rollupsDataV2.10.1:
-        "0xE00a3cBFC45241b33c0A44C78e26168CBc55EC63"
+        "0x0000000000000000000000000000000000000000000000000000000000000000"
+++ description: Maps rollup contracts and their verifier. Any change should be picked up also by the specific rollup config, unless it's a new rollup. [rollupContract, chainID, verifier, forkID, rollupVerifierType, programVKey]
+++ severity: MEDIUM
      values.rollupsDataV2.10.0:
-        12
+        13
+++ description: Maps rollup contracts and their verifier. Any change should be picked up also by the specific rollup config, unless it's a new rollup. [rollupContract, chainID, verifier, forkID, rollupVerifierType, programVKey]
+++ severity: MEDIUM
      values.rollupsDataV2.9.6:
-        196
+        "0x1E163594e13030244DCAf4cDfC2cd0ba3206DA80"
+++ description: Maps rollup contracts and their verifier. Any change should be picked up also by the specific rollup config, unless it's a new rollup. [rollupContract, chainID, verifier, forkID, rollupVerifierType, programVKey]
+++ severity: MEDIUM
      values.rollupsDataV2.9.5:
-        8
+        9
+++ description: Maps rollup contracts and their verifier. Any change should be picked up also by the specific rollup config, unless it's a new rollup. [rollupContract, chainID, verifier, forkID, rollupVerifierType, programVKey]
+++ severity: MEDIUM
      values.rollupsDataV2.9.4:
-        0
+        4
+++ description: Maps rollup contracts and their verifier. Any change should be picked up also by the specific rollup config, unless it's a new rollup. [rollupContract, chainID, verifier, forkID, rollupVerifierType, programVKey]
+++ severity: MEDIUM
      values.rollupsDataV2.9.3:
-        "0x2B0ee28D4D51bC9aDde5E58E295873F61F4a0507"
+        0
+++ description: Maps rollup contracts and their verifier. Any change should be picked up also by the specific rollup config, unless it's a new rollup. [rollupContract, chainID, verifier, forkID, rollupVerifierType, programVKey]
+++ severity: MEDIUM
      values.rollupsDataV2.9.2:
-        "0x455ac63E96e6a64EA59C6Da0D8F90FCa3F1535aB"
+        3776
+++ description: Maps rollup contracts and their verifier. Any change should be picked up also by the specific rollup config, unless it's a new rollup. [rollupContract, chainID, verifier, forkID, rollupVerifierType, programVKey]
+++ severity: MEDIUM
      values.rollupsDataV2.9.1:
-        "0x0000000000000000000000000000000000000000000000000000000000000000"
+        "0x0775e11309d75aA6b0967917fB0213C5673eDf81"
+++ description: Maps rollup contracts and their verifier. Any change should be picked up also by the specific rollup config, unless it's a new rollup. [rollupContract, chainID, verifier, forkID, rollupVerifierType, programVKey]
+++ severity: MEDIUM
      values.rollupsDataV2.9.0:
-        13
+        "0x0000000000000000000000000000000000000000000000000000000000000000"
+++ description: Maps rollup contracts and their verifier. Any change should be picked up also by the specific rollup config, unless it's a new rollup. [rollupContract, chainID, verifier, forkID, rollupVerifierType, programVKey]
+++ severity: MEDIUM
      values.rollupsDataV2.8.6:
-        "0x1E163594e13030244DCAf4cDfC2cd0ba3206DA80"
+        "0xC4E903D3Af4c3d2e437492d602adcC9d9b536858"
+++ description: Maps rollup contracts and their verifier. Any change should be picked up also by the specific rollup config, unless it's a new rollup. [rollupContract, chainID, verifier, forkID, rollupVerifierType, programVKey]
+++ severity: MEDIUM
      values.rollupsDataV2.8.2:
-        3776
+        1511670449
+++ description: Maps rollup contracts and their verifier. Any change should be picked up also by the specific rollup config, unless it's a new rollup. [rollupContract, chainID, verifier, forkID, rollupVerifierType, programVKey]
+++ severity: MEDIUM
      values.rollupsDataV2.7.6:
-        "0xC4E903D3Af4c3d2e437492d602adcC9d9b536858"
+        9
+++ description: Maps rollup contracts and their verifier. Any change should be picked up also by the specific rollup config, unless it's a new rollup. [rollupContract, chainID, verifier, forkID, rollupVerifierType, programVKey]
+++ severity: MEDIUM
      values.rollupsDataV2.7.5:
-        9
+        4
+++ description: Maps rollup contracts and their verifier. Any change should be picked up also by the specific rollup config, unless it's a new rollup. [rollupContract, chainID, verifier, forkID, rollupVerifierType, programVKey]
+++ severity: MEDIUM
      values.rollupsDataV2.7.4:
-        4
+        0
+++ description: Maps rollup contracts and their verifier. Any change should be picked up also by the specific rollup config, unless it's a new rollup. [rollupContract, chainID, verifier, forkID, rollupVerifierType, programVKey]
+++ severity: MEDIUM
      values.rollupsDataV2.7.3:
-        0
+        "0x419dcD0f72ebAFd3524b65a97ac96699C7fBebdB"
+++ description: Maps rollup contracts and their verifier. Any change should be picked up also by the specific rollup config, unless it's a new rollup. [rollupContract, chainID, verifier, forkID, rollupVerifierType, programVKey]
+++ severity: MEDIUM
      values.rollupsDataV2.7.2:
-        1511670449
+        2355
+++ description: Maps rollup contracts and their verifier. Any change should be picked up also by the specific rollup config, unless it's a new rollup. [rollupContract, chainID, verifier, forkID, rollupVerifierType, programVKey]
+++ severity: MEDIUM
      values.rollupsDataV2.6.3:
-        "0x419dcD0f72ebAFd3524b65a97ac96699C7fBebdB"
+        4913
+++ description: Maps rollup contracts and their verifier. Any change should be picked up also by the specific rollup config, unless it's a new rollup. [rollupContract, chainID, verifier, forkID, rollupVerifierType, programVKey]
+++ severity: MEDIUM
      values.rollupsDataV2.6.2:
-        2355
+        "0x0775e11309d75aA6b0967917fB0213C5673eDf81"
+++ description: Maps rollup contracts and their verifier. Any change should be picked up also by the specific rollup config, unless it's a new rollup. [rollupContract, chainID, verifier, forkID, rollupVerifierType, programVKey]
+++ severity: MEDIUM
      values.rollupsDataV2.6.1:
-        "0x0775e11309d75aA6b0967917fB0213C5673eDf81"
+        "0x88AaB361f108C3c959F2928Da3cD8e47298016B5"
+++ description: Maps rollup contracts and their verifier. Any change should be picked up also by the specific rollup config, unless it's a new rollup. [rollupContract, chainID, verifier, forkID, rollupVerifierType, programVKey]
+++ severity: MEDIUM
      values.rollupsDataV2.5.6:
-        9
+        1702448187
+++ description: Maps rollup contracts and their verifier. Any change should be picked up also by the specific rollup config, unless it's a new rollup. [rollupContract, chainID, verifier, forkID, rollupVerifierType, programVKey]
+++ severity: MEDIUM
      values.rollupsDataV2.5.5:
-        4
+        9
+++ description: Maps rollup contracts and their verifier. Any change should be picked up also by the specific rollup config, unless it's a new rollup. [rollupContract, chainID, verifier, forkID, rollupVerifierType, programVKey]
+++ severity: MEDIUM
      values.rollupsDataV2.5.4:
-        0
+        4
+++ description: Maps rollup contracts and their verifier. Any change should be picked up also by the specific rollup config, unless it's a new rollup. [rollupContract, chainID, verifier, forkID, rollupVerifierType, programVKey]
+++ severity: MEDIUM
      values.rollupsDataV2.5.3:
-        4913
+        0
+++ description: Maps rollup contracts and their verifier. Any change should be picked up also by the specific rollup config, unless it's a new rollup. [rollupContract, chainID, verifier, forkID, rollupVerifierType, programVKey]
+++ severity: MEDIUM
      values.rollupsDataV2.5.1:
-        "0x88AaB361f108C3c959F2928Da3cD8e47298016B5"
+        "0x42Ac57F24EC4C3AAC843f6DBAcd9282DAaeE9238"
+++ description: Maps rollup contracts and their verifier. Any change should be picked up also by the specific rollup config, unless it's a new rollup. [rollupContract, chainID, verifier, forkID, rollupVerifierType, programVKey]
+++ severity: MEDIUM
      values.rollupsDataV2.4.6:
-        1702448187
+        7
+++ description: Maps rollup contracts and their verifier. Any change should be picked up also by the specific rollup config, unless it's a new rollup. [rollupContract, chainID, verifier, forkID, rollupVerifierType, programVKey]
+++ severity: MEDIUM
      values.rollupsDataV2.4.5:
-        9
+        0
+++ description: Maps rollup contracts and their verifier. Any change should be picked up also by the specific rollup config, unless it's a new rollup. [rollupContract, chainID, verifier, forkID, rollupVerifierType, programVKey]
+++ severity: MEDIUM
      values.rollupsDataV2.4.4:
-        4
+        752025
+++ description: Maps rollup contracts and their verifier. Any change should be picked up also by the specific rollup config, unless it's a new rollup. [rollupContract, chainID, verifier, forkID, rollupVerifierType, programVKey]
+++ severity: MEDIUM
      values.rollupsDataV2.4.3:
-        0
+        "0x9B9671dB83CfcB4508bF361942488C5cA2b1286D"
+++ description: Maps rollup contracts and their verifier. Any change should be picked up also by the specific rollup config, unless it's a new rollup. [rollupContract, chainID, verifier, forkID, rollupVerifierType, programVKey]
+++ severity: MEDIUM
      values.rollupsDataV2.4.2:
-        "0x0775e11309d75aA6b0967917fB0213C5673eDf81"
+        "0x7fF0B5fF6Eb8B789456639AC2A02487c338c1789"
+++ description: Maps rollup contracts and their verifier. Any change should be picked up also by the specific rollup config, unless it's a new rollup. [rollupContract, chainID, verifier, forkID, rollupVerifierType, programVKey]
+++ severity: MEDIUM
      values.rollupsDataV2.4.1:
-        "0x42Ac57F24EC4C3AAC843f6DBAcd9282DAaeE9238"
+        "0x0000000000000000000000000000000000000000000000000000000000000000"
+++ description: Maps rollup contracts and their verifier. Any change should be picked up also by the specific rollup config, unless it's a new rollup. [rollupContract, chainID, verifier, forkID, rollupVerifierType, programVKey]
+++ severity: MEDIUM
      values.rollupsDataV2.4.0:
-        "0x0000000000000000000000000000000000000000000000000000000000000000"
+        12
+++ description: Maps rollup contracts and their verifier. Any change should be picked up also by the specific rollup config, unless it's a new rollup. [rollupContract, chainID, verifier, forkID, rollupVerifierType, programVKey]
+++ severity: MEDIUM
      values.rollupsDataV2.3.4:
-        752025
+        "0xb1714954bBc0162A36FB44934F3216aCE81C40d7"
+++ description: Maps rollup contracts and their verifier. Any change should be picked up also by the specific rollup config, unless it's a new rollup. [rollupContract, chainID, verifier, forkID, rollupVerifierType, programVKey]
+++ severity: MEDIUM
      values.rollupsDataV2.3.3:
-        "0x9B9671dB83CfcB4508bF361942488C5cA2b1286D"
+        3344
+++ description: Maps rollup contracts and their verifier. Any change should be picked up also by the specific rollup config, unless it's a new rollup. [rollupContract, chainID, verifier, forkID, rollupVerifierType, programVKey]
+++ severity: MEDIUM
      values.rollupsDataV2.3.2:
-        "0x7fF0B5fF6Eb8B789456639AC2A02487c338c1789"
+        "0x9B9671dB83CfcB4508bF361942488C5cA2b1286D"
+++ description: Maps rollup contracts and their verifier. Any change should be picked up also by the specific rollup config, unless it's a new rollup. [rollupContract, chainID, verifier, forkID, rollupVerifierType, programVKey]
+++ severity: MEDIUM
      values.rollupsDataV2.2.6:
-        7
+        1
+++ description: Maps rollup contracts and their verifier. Any change should be picked up also by the specific rollup config, unless it's a new rollup. [rollupContract, chainID, verifier, forkID, rollupVerifierType, programVKey]
+++ severity: MEDIUM
      values.rollupsDataV2.2.5:
-        0
+        "0xFE797cb13f7884FB9f0aE26fEB2a06ed8efccbe7"
+++ description: Maps rollup contracts and their verifier. Any change should be picked up also by the specific rollup config, unless it's a new rollup. [rollupContract, chainID, verifier, forkID, rollupVerifierType, programVKey]
+++ severity: MEDIUM
      values.rollupsDataV2.2.4:
-        "0xb1714954bBc0162A36FB44934F3216aCE81C40d7"
+        9369
+++ description: Maps rollup contracts and their verifier. Any change should be picked up also by the specific rollup config, unless it's a new rollup. [rollupContract, chainID, verifier, forkID, rollupVerifierType, programVKey]
+++ severity: MEDIUM
      values.rollupsDataV2.2.3:
-        3344
+        "0xE00a3cBFC45241b33c0A44C78e26168CBc55EC63"
+++ description: Maps rollup contracts and their verifier. Any change should be picked up also by the specific rollup config, unless it's a new rollup. [rollupContract, chainID, verifier, forkID, rollupVerifierType, programVKey]
+++ severity: MEDIUM
      values.rollupsDataV2.2.2:
-        "0x9B9671dB83CfcB4508bF361942488C5cA2b1286D"
+        12
+++ description: Maps rollup contracts and their verifier. Any change should be picked up also by the specific rollup config, unless it's a new rollup. [rollupContract, chainID, verifier, forkID, rollupVerifierType, programVKey]
+++ severity: MEDIUM
      values.rollupsDataV2.2.1:
-        "0x0000000000000000000000000000000000000000000000000000000000000000"
+        10
+++ description: Maps rollup contracts and their verifier. Any change should be picked up also by the specific rollup config, unless it's a new rollup. [rollupContract, chainID, verifier, forkID, rollupVerifierType, programVKey]
+++ severity: MEDIUM
      values.rollupsDataV2.2.0:
-        12
+        "0x00dc9aac973a839dc15373ccf3aa0b0d503c1142ceb7d99b0c4fcc4a5c3ad09f"
      values.rollupTypeCount:
-        9
+        10
+++ description: struct consensusImplementation, verifier, forkID, rollupVerifierType, obsolete, programVKey
      values.rollupTypes.9:
+        ["0x2650a9a4fC64f63F573EF0F405064EF54BC46f71","0x4AaBBA26EA9E7A7fbD052d17a167e6aE3F8eC7Be",8,0,false,"0x0000000000000000000000000000000000000000000000000000000000000000"]
+++ description: struct consensusImplementation, verifier, forkID, rollupVerifierType, obsolete, programVKey
      values.rollupTypes.8.5:
-        "0x4AaBBA26EA9E7A7fbD052d17a167e6aE3F8eC7Be"
+        "0x9cf80f7eB1C76ec5AE7A88b417e373449b73ac30"
+++ description: struct consensusImplementation, verifier, forkID, rollupVerifierType, obsolete, programVKey
      values.rollupTypes.8.3:
-        8
+        7
+++ description: struct consensusImplementation, verifier, forkID, rollupVerifierType, obsolete, programVKey
      values.rollupTypes.8.1:
-        "0x2650a9a4fC64f63F573EF0F405064EF54BC46f71"
+        "0x1C3A3da552b8662CD69538356b1E7c2E9CC1EBD8"
+++ description: struct consensusImplementation, verifier, forkID, rollupVerifierType, obsolete, programVKey
      values.rollupTypes.7.5:
-        "0x9cf80f7eB1C76ec5AE7A88b417e373449b73ac30"
+        false
+++ description: struct consensusImplementation, verifier, forkID, rollupVerifierType, obsolete, programVKey
      values.rollupTypes.7.4:
-        false
+        9
+++ description: struct consensusImplementation, verifier, forkID, rollupVerifierType, obsolete, programVKey
      values.rollupTypes.7.3:
-        7
+        0
+++ description: struct consensusImplementation, verifier, forkID, rollupVerifierType, obsolete, programVKey
      values.rollupTypes.7.2:
-        0
+        "0x2650a9a4fC64f63F573EF0F405064EF54BC46f71"
+++ description: struct consensusImplementation, verifier, forkID, rollupVerifierType, obsolete, programVKey
      values.rollupTypes.7.1:
-        "0x1C3A3da552b8662CD69538356b1E7c2E9CC1EBD8"
+        "0x0775e11309d75aA6b0967917fB0213C5673eDf81"
+++ description: struct consensusImplementation, verifier, forkID, rollupVerifierType, obsolete, programVKey
      values.rollupTypes.6.2:
-        "0x2650a9a4fC64f63F573EF0F405064EF54BC46f71"
+        "0x0775e11309d75aA6b0967917fB0213C5673eDf81"
+++ description: struct consensusImplementation, verifier, forkID, rollupVerifierType, obsolete, programVKey
      values.rollupTypes.6.1:
-        "0x0775e11309d75aA6b0967917fB0213C5673eDf81"
+        "0x10D296e8aDd0535be71639E5D1d1c30ae1C6bD4C"
+++ description: struct consensusImplementation, verifier, forkID, rollupVerifierType, obsolete, programVKey
      values.rollupTypes.5.4:
-        9
+        1
+++ description: struct consensusImplementation, verifier, forkID, rollupVerifierType, obsolete, programVKey
      values.rollupTypes.5.3:
-        0
+        "0x18C45DD422f6587357a6d3b23307E75D42b2bc5B"
+++ description: struct consensusImplementation, verifier, forkID, rollupVerifierType, obsolete, programVKey
      values.rollupTypes.5.2:
-        "0x0775e11309d75aA6b0967917fB0213C5673eDf81"
+        "0x0062c685702e0582d900f3a19521270c92a58e2588230c4a5cf3b45103f4a512"
+++ description: struct consensusImplementation, verifier, forkID, rollupVerifierType, obsolete, programVKey
      values.rollupTypes.5.1:
-        "0x10D296e8aDd0535be71639E5D1d1c30ae1C6bD4C"
+        "0xE00a3cBFC45241b33c0A44C78e26168CBc55EC63"
+++ description: struct consensusImplementation, verifier, forkID, rollupVerifierType, obsolete, programVKey
      values.rollupTypes.5.0:
-        "0x0000000000000000000000000000000000000000000000000000000000000000"
+        12
+++ description: struct consensusImplementation, verifier, forkID, rollupVerifierType, obsolete, programVKey
      values.rollupTypes.4.4:
-        1
+        0
+++ description: struct consensusImplementation, verifier, forkID, rollupVerifierType, obsolete, programVKey
      values.rollupTypes.4.3:
-        "0x18C45DD422f6587357a6d3b23307E75D42b2bc5B"
+        "0xc521580cd8586Cc688A7430F9DcE0f6A803F2883"
+++ description: struct consensusImplementation, verifier, forkID, rollupVerifierType, obsolete, programVKey
      values.rollupTypes.4.2:
-        "0x0062c685702e0582d900f3a19521270c92a58e2588230c4a5cf3b45103f4a512"
+        "0x2650a9a4fC64f63F573EF0F405064EF54BC46f71"
+++ description: struct consensusImplementation, verifier, forkID, rollupVerifierType, obsolete, programVKey
      values.rollupTypes.4.1:
-        "0xE00a3cBFC45241b33c0A44C78e26168CBc55EC63"
+        "0x0000000000000000000000000000000000000000000000000000000000000000"
+++ description: struct consensusImplementation, verifier, forkID, rollupVerifierType, obsolete, programVKey
      values.rollupTypes.4.0:
-        12
+        11
+++ description: struct consensusImplementation, verifier, forkID, rollupVerifierType, obsolete, programVKey
      values.rollupTypes.3.3:
-        "0xc521580cd8586Cc688A7430F9DcE0f6A803F2883"
+        "0x427113ae6F319BfFb4459bfF96eb8B6BDe1A127F"
+++ description: struct consensusImplementation, verifier, forkID, rollupVerifierType, obsolete, programVKey
      values.rollupTypes.3.2:
-        "0x2650a9a4fC64f63F573EF0F405064EF54BC46f71"
+        "0x455ac63E96e6a64EA59C6Da0D8F90FCa3F1535aB"
+++ description: struct consensusImplementation, verifier, forkID, rollupVerifierType, obsolete, programVKey
      values.rollupTypes.3.0:
-        11
+        13
+++ description: struct consensusImplementation, verifier, forkID, rollupVerifierType, obsolete, programVKey
      values.rollupTypes.2.4:
-        0
+        1
+++ description: struct consensusImplementation, verifier, forkID, rollupVerifierType, obsolete, programVKey
      values.rollupTypes.2.3:
-        "0x427113ae6F319BfFb4459bfF96eb8B6BDe1A127F"
+        "0x18C45DD422f6587357a6d3b23307E75D42b2bc5B"
+++ description: struct consensusImplementation, verifier, forkID, rollupVerifierType, obsolete, programVKey
      values.rollupTypes.2.2:
-        "0x455ac63E96e6a64EA59C6Da0D8F90FCa3F1535aB"
+        "0xE00a3cBFC45241b33c0A44C78e26168CBc55EC63"
+++ description: struct consensusImplementation, verifier, forkID, rollupVerifierType, obsolete, programVKey
      values.rollupTypes.2.1:
-        "0x0000000000000000000000000000000000000000000000000000000000000000"
+        12
+++ description: struct consensusImplementation, verifier, forkID, rollupVerifierType, obsolete, programVKey
      values.rollupTypes.2.0:
-        13
+        "0x00dc9aac973a839dc15373ccf3aa0b0d503c1142ceb7d99b0c4fcc4a5c3ad09f"
    }
```

Generated with discovered.json: 0xa8ec986290e4a149c272cd400de0cfeaa16df3cf

# Diff at Fri, 14 Mar 2025 15:19:06 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@002bac09dea3b1154ecc36736323fb7552478ce4 block: 21988681
- current block number: 22045960

## Description

Transaction queued to add a new rollupType. This is the second rollupType with a pessimistic verifier, using the same forkID as polygon zkevm.

added current agglayer chain data from the `l2b fetchagg` script.

## Watched changes

```diff
    contract Timelock (0xEf1462451C30Ea7aD8555386226059Fe837CA4EF) {
    +++ description: A timelock with access control. In the case of an activated emergency state in the 0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2, all transactions through this timelock are immediately executable. The current minimum delay is 3d.
      values.scheduledTransactionsDecoded.23:
+        {"target":"0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2","value":"0","function":"addNewRollupType","inputs":{"consensusImplementation":"0x18C45DD422f6587357a6d3b23307E75D42b2bc5B","verifier":"0xE00a3cBFC45241b33c0A44C78e26168CBc55EC63","forkID":12,"rollupVerifierType":1,"genesis":"0x0000000000000000000000000000000000000000000000000000000000000000","description":"Type: Pessimistic, Version: v0.2.5, genesis: /ipfs/QmUXnRoPbUmZuEZCGyiHjEsoNcFVu3hLtSvhpnfBS2mAYU","programVKey":"0x00dc9aac973a839dc15373ccf3aa0b0d503c1142ceb7d99b0c4fcc4a5c3ad09f"},"predecessor":"0x0000000000000000000000000000000000000000000000000000000000000000","delay":"259200"}
    }
```

Generated with discovered.json: 0x15662af018b78a0f906a35ea6da90ee771892d94

# Diff at Thu, 06 Mar 2025 15:16:23 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@64eed24a033030dd2d128180f3ee3f87c3c39f7c block: 21965308
- current block number: 21988681

## Description

Related to lumia upgrating to latest validium (type 7).

config: change timelock descriptions, add delay.

## Watched changes

```diff
    contract PolygonRollupManager (0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2) {
    +++ description: The central shared managing contract for Layer 2s on the Polygon AggLayer. This contract receives L2 state roots as well as ZK proofs. All connected Layer 2s can be globally paused by activating the 'Emergency State'. This can be done by the 0x37c58Dfa7BF0A165C5AAEdDf3e2EdB475ac6Dcb6 or by anyone after 1 week of inactive verifiers.
+++ description: Maps rollup contracts and their verifier. Any change should be picked up also by the specific rollup config, unless it's a new rollup. [rollupContract, chainID, verifier, forkID, rollupVerifierType, programVKey]
+++ severity: MEDIUM
      values.rollupsDataV2.6.4:
-        4
+        7
+++ description: Maps rollup contracts and their verifier. Any change should be picked up also by the specific rollup config, unless it's a new rollup. [rollupContract, chainID, verifier, forkID, rollupVerifierType, programVKey]
+++ severity: MEDIUM
      values.rollupsDataV2.6.3:
-        9
+        12
+++ description: Maps rollup contracts and their verifier. Any change should be picked up also by the specific rollup config, unless it's a new rollup. [rollupContract, chainID, verifier, forkID, rollupVerifierType, programVKey]
+++ severity: MEDIUM
      values.rollupsDataV2.6.2:
-        "0x0775e11309d75aA6b0967917fB0213C5673eDf81"
+        "0x9B9671dB83CfcB4508bF361942488C5cA2b1286D"
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21965308 (main branch discovery), not current.

```diff
    contract PolygonAdminMultisig (0x242daE44F5d8fb54B198D03a94dA45B5a4413e21) {
    +++ description: None
      receivedPermissions.7.via.1.condition:
-        "there is no emergency state, in which case there is no delay"
+        "there is no emergency state, in which case there would be no delay"
      receivedPermissions.6.via.1.condition:
-        "there is no emergency state, in which case there is no delay"
+        "there is no emergency state, in which case there would be no delay"
      receivedPermissions.5.via.1.condition:
-        "there is no emergency state, in which case there is no delay"
+        "there is no emergency state, in which case there would be no delay"
      receivedPermissions.4.description:
-        "propose, cancel and execute transactions in the timelock, manage all access control roles."
+        "propose, cancel and execute transactions in the timelock, manage all access control roles and change the minimum delay."
      receivedPermissions.4.delay:
+        259200
      receivedPermissions.4.condition:
+        "there is no emergency state, in which case there would be no delay"
      receivedPermissions.3.description:
-        "propose, cancel and execute transactions in the timelock, manage all access control roles."
+        "propose, cancel and execute transactions in the timelock, manage all access control roles and change the minimum delay."
      receivedPermissions.3.via.0.condition:
-        "there is no emergency state, in which case there is no delay"
+        "there is no emergency state, in which case there would be no delay"
      receivedPermissions.3.delay:
+        259200
      receivedPermissions.3.condition:
+        "there is no emergency state, in which case there would be no delay"
      receivedPermissions.1.via.0.condition:
-        "there is no emergency state, in which case there is no delay"
+        "there is no emergency state, in which case there would be no delay"
      directlyReceivedPermissions.0.condition:
-        "there is no emergency state, in which case there is no delay"
+        "there is no emergency state, in which case there would be no delay"
    }
```

```diff
    contract PolygonSharedBridge (0x2a3DD3EB832aF982ec71669E178424b10Dca2EDe) {
    +++ description: The shared bridge contract, escrowing user funds sent to Layer 2s perticipating in the AggLayer. It is mirrored on each L2 and can be used to transfer both ERC20 assets and arbitrary messages.
      issuedPermissions.0.via.0.condition:
-        "there is no emergency state, in which case there is no delay"
+        "there is no emergency state, in which case there would be no delay"
    }
```

```diff
    contract PolygonRollupManager (0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2) {
    +++ description: The central shared managing contract for Layer 2s on the Polygon AggLayer. This contract receives L2 state roots as well as ZK proofs. All connected Layer 2s can be globally paused by activating the 'Emergency State'. This can be done by the 0x37c58Dfa7BF0A165C5AAEdDf3e2EdB475ac6Dcb6 or by anyone after 1 week of inactive verifiers.
      issuedPermissions.7.via.0.condition:
-        "there is no emergency state, in which case there is no delay"
+        "there is no emergency state, in which case there would be no delay"
      issuedPermissions.3.via.0.condition:
-        "there is no emergency state, in which case there is no delay"
+        "there is no emergency state, in which case there would be no delay"
    }
```

```diff
    contract PolygonGlobalExitRootV2 (0x580bda1e7A0CFAe92Fa7F6c20A3794F169CE3CFb) {
    +++ description: A merkle tree storage contract aggregating state roots of each participating Layer 2, thus creating a single global merkle root representing the global state of the AggLayer, the 'global exit root'. The global exit root is synchronized to all connected Layer 2s to help with their interoperability.
      issuedPermissions.0.via.0.condition:
-        "there is no emergency state, in which case there is no delay"
+        "there is no emergency state, in which case there would be no delay"
    }
```

```diff
    contract Timelock (0xEf1462451C30Ea7aD8555386226059Fe837CA4EF) {
    +++ description: A timelock with access control. In the case of an activated emergency state in the 0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2, all transactions through this timelock are immediately executable. The current minimum delay is 3d.
      issuedPermissions.1.description:
-        "propose, cancel and execute transactions in the timelock, manage all access control roles."
+        "propose, cancel and execute transactions in the timelock, manage all access control roles and change the minimum delay."
      issuedPermissions.1.via.0.condition:
-        "there is no emergency state, in which case there is no delay"
+        "there is no emergency state, in which case there would be no delay"
      issuedPermissions.1.delay:
+        259200
      issuedPermissions.1.condition:
+        "there is no emergency state, in which case there would be no delay"
      issuedPermissions.0.description:
-        "propose, cancel and execute transactions in the timelock, manage all access control roles."
+        "propose, cancel and execute transactions in the timelock, manage all access control roles and change the minimum delay."
      issuedPermissions.0.delay:
+        259200
      issuedPermissions.0.condition:
+        "there is no emergency state, in which case there would be no delay"
      directlyReceivedPermissions.3.description:
-        "propose, cancel and execute transactions in the timelock, manage all access control roles."
+        "propose, cancel and execute transactions in the timelock, manage all access control roles and change the minimum delay."
      directlyReceivedPermissions.3.delay:
+        259200
      directlyReceivedPermissions.3.condition:
+        "there is no emergency state, in which case there would be no delay"
      directlyReceivedPermissions.1.condition:
-        "there is no emergency state, in which case there is no delay"
+        "there is no emergency state, in which case there would be no delay"
    }
```

Generated with discovered.json: 0xca48085bb640a1c7b33063a665f4872987b4f21f

# Diff at Tue, 04 Mar 2025 10:39:51 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@98d260b45fe0d2195ce5e629bd7b200c8706e8ba block: 21965308
- current block number: 21965308

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21965308 (main branch discovery), not current.

```diff
    contract SharedProxyAdmin (0x0F99738B2Fc14D77308337f3e2596b63aE7BCC4A) {
    +++ description: None
      sinceBlock:
+        16896716
    }
```

```diff
    contract PolygonAdminMultisig (0x242daE44F5d8fb54B198D03a94dA45B5a4413e21) {
    +++ description: None
      sinceBlock:
+        16839348
    }
```

```diff
    contract PolygonSharedBridge (0x2a3DD3EB832aF982ec71669E178424b10Dca2EDe) {
    +++ description: The shared bridge contract, escrowing user funds sent to Layer 2s perticipating in the AggLayer. It is mirrored on each L2 and can be used to transfer both ERC20 assets and arbitrary messages.
      sinceBlock:
+        16896718
    }
```

```diff
    contract PolygonSecurityCouncil (0x37c58Dfa7BF0A165C5AAEdDf3e2EdB475ac6Dcb6) {
    +++ description: None
      sinceBlock:
+        16795950
    }
```

```diff
    contract PolygonRollupManager (0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2) {
    +++ description: The central shared managing contract for Layer 2s on the Polygon AggLayer. This contract receives L2 state roots as well as ZK proofs. All connected Layer 2s can be globally paused by activating the 'Emergency State'. This can be done by the 0x37c58Dfa7BF0A165C5AAEdDf3e2EdB475ac6Dcb6 or by anyone after 1 week of inactive verifiers.
      sinceBlock:
+        16896721
    }
```

```diff
    contract PolygonGlobalExitRootV2 (0x580bda1e7A0CFAe92Fa7F6c20A3794F169CE3CFb) {
    +++ description: A merkle tree storage contract aggregating state roots of each participating Layer 2, thus creating a single global merkle root representing the global state of the AggLayer, the 'global exit root'. The global exit root is synchronized to all connected Layer 2s to help with their interoperability.
      sinceBlock:
+        16896720
    }
```

```diff
    contract PolygonCreateRollupMultisig (0xC74eFc7fdb3BeC9c6930E91FFDF761b160dF79dB) {
    +++ description: None
      sinceBlock:
+        20435175
    }
```

```diff
    contract Timelock (0xEf1462451C30Ea7aD8555386226059Fe837CA4EF) {
    +++ description: A timelock with access control. In the case of an activated emergency state in the 0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2, all transactions through this timelock are immediately executable. The current minimum delay is 3d.
      sinceBlock:
+        16896723
    }
```

Generated with discovered.json: 0xbb8fd8041aced16a9017c546a34e7b9c5d03190d

# Diff at Mon, 03 Mar 2025 08:57:31 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@f23dcb100957b0b121d62148a4d586788383af80 block: 21802929
- current block number: 21965308

## Description

New chain deployed, looks like a testnet or child chain of previously deployed 623 pen-chain (see below).

## Watched changes

```diff
    contract PolygonRollupManager (0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2) {
    +++ description: The central shared managing contract for Layer 2s on the Polygon AggLayer. This contract receives L2 state roots as well as ZK proofs. All connected Layer 2s can be globally paused by activating the 'Emergency State'. This can be done by the 0x37c58Dfa7BF0A165C5AAEdDf3e2EdB475ac6Dcb6 or by anyone after 1 week of inactive verifiers.
+++ description: Checks if lastVerifiedBatch for a rollupID is greater than one. Works like a trigger for statetransition projects becoming active after deployment. Mind that index here is rollupID-1.
      values.isVerifyingBatches.15:
+        [false]
      values.rollupCount:
-        15
+        16
+++ description: Maps rollup contracts and their verifier. Any change should be picked up also by the specific rollup config, unless it's a new rollup. [rollupContract, chainID, verifier, forkID, rollupVerifierType, programVKey]
+++ severity: MEDIUM
      values.rollupsDataV2.15:
+        ["0xb1714954bBc0162A36FB44934F3216aCE81C40d7",3344,"0x9B9671dB83CfcB4508bF361942488C5cA2b1286D",12,7,0,"0x0000000000000000000000000000000000000000000000000000000000000000"]
    }
```

Generated with discovered.json: 0x10917e985ceae936d9e950fcf60ef01adaa8cb97

# Diff at Thu, 27 Feb 2025 11:46:35 GMT:

- author: Michał Podsiadły (<michal.podsiadly@l2beat.com>)
- comparing to: main@a4b50e45bb44f8ceeea29f9236088d26a843c885 block: 21802929
- current block number: 21802929

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21802929 (main branch discovery), not current.

```diff
    contract PolygonSharedBridge (0x2a3DD3EB832aF982ec71669E178424b10Dca2EDe) {
    +++ description: The shared bridge contract, escrowing user funds sent to Layer 2s perticipating in the AggLayer. It is mirrored on each L2 and can be used to transfer both ERC20 assets and arbitrary messages.
      name:
-        "PolygonZkEVMBridgeV2"
+        "PolygonSharedBridge"
      displayName:
-        "PolygonSharedBridge"
    }
```

```diff
    contract PolygonGlobalExitRootV2 (0x580bda1e7A0CFAe92Fa7F6c20A3794F169CE3CFb) {
    +++ description: A merkle tree storage contract aggregating state roots of each participating Layer 2, thus creating a single global merkle root representing the global state of the AggLayer, the 'global exit root'. The global exit root is synchronized to all connected Layer 2s to help with their interoperability.
      name:
-        "PolygonZkEVMGlobalExitRootV2"
+        "PolygonGlobalExitRootV2"
      displayName:
-        "PolygonGlobalExitRootV2"
    }
```

```diff
    contract Timelock (0xEf1462451C30Ea7aD8555386226059Fe837CA4EF) {
    +++ description: A timelock with access control. In the case of an activated emergency state in the 0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2, all transactions through this timelock are immediately executable. The current minimum delay is 3d.
      name:
-        "PolygonZkEVMTimelock"
+        "Timelock"
      displayName:
-        "Timelock"
    }
```

Generated with discovered.json: 0xd997d4561c3633ed6714606b73c62d3de3fbc674

# Diff at Wed, 26 Feb 2025 10:33:07 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@18513668f913fbe57a197f43655b19111df0e627 block: 21802929
- current block number: 21802929

## Description

config related: added categories for all opstack, op stack and polygoncdk stack templates.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21802929 (main branch discovery), not current.

```diff
    contract PolygonZkEVMBridgeV2 (0x2a3DD3EB832aF982ec71669E178424b10Dca2EDe) {
    +++ description: The shared bridge contract, escrowing user funds sent to Layer 2s perticipating in the AggLayer. It is mirrored on each L2 and can be used to transfer both ERC20 assets and arbitrary messages.
      category:
+        {"name":"Shared Infrastructure","priority":4}
    }
```

```diff
    contract PolygonRollupManager (0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2) {
    +++ description: The central shared managing contract for Layer 2s on the Polygon AggLayer. This contract receives L2 state roots as well as ZK proofs. All connected Layer 2s can be globally paused by activating the 'Emergency State'. This can be done by the 0x37c58Dfa7BF0A165C5AAEdDf3e2EdB475ac6Dcb6 or by anyone after 1 week of inactive verifiers.
      category:
+        {"name":"Shared Infrastructure","priority":4}
    }
```

```diff
    contract PolygonZkEVMGlobalExitRootV2 (0x580bda1e7A0CFAe92Fa7F6c20A3794F169CE3CFb) {
    +++ description: A merkle tree storage contract aggregating state roots of each participating Layer 2, thus creating a single global merkle root representing the global state of the AggLayer, the 'global exit root'. The global exit root is synchronized to all connected Layer 2s to help with their interoperability.
      category:
+        {"name":"Shared Infrastructure","priority":4}
    }
```

```diff
    contract PolygonZkEVMTimelock (0xEf1462451C30Ea7aD8555386226059Fe837CA4EF) {
    +++ description: A timelock with access control. In the case of an activated emergency state in the 0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2, all transactions through this timelock are immediately executable. The current minimum delay is 3d.
      category:
+        {"name":"Governance","priority":3}
    }
```

Generated with discovered.json: 0xd52c8f0128c6a3b9584a77682f43c4ae2f353005

# Diff at Sat, 08 Feb 2025 16:16:44 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@ef01ea79812e0d524af00be3fae1170cef6fd662 block: 21787152
- current block number: 21802929

## Description

[First accounting proof delivered](https://etherscan.io/tx/0x154a56ea5953c367c7b5045496339b0b5d1f62fbd1f15cc37157de31c5313f17) for unknown chain with id 14, chainID 9369.

New chain deployed, type 7 (validium), not active yet.

🚀:active,✔️:reviewed,🚧:testnet,😵:died
rollupIDs:
1: pol zkEVM 1101 (type6) 🚀 ✔️
2: astar 3776 (type4) 🚀 ✔️
3: OkX X Layer 196 (type8) 🚀 ✔️
4: OEV network chainid 4913 (type4) X (pivoted to orbit)😵
5: gptprotocol.org 1511670449 (type4) 🚀 ✔️😵
6: witnesschain 1702448187 (type4) 🚀 ✔️😵
7: lumia.org 994873017 (type4) 🚀✔️
8: pay network (wirex) 31415 (type4) 🚀 ✔️
9: silicon-zk 511252203 (type4) 🚀🚧
10: silicon-zk 2355 (type4) 🚀✔️
11: haust.network 999 (type4) 🚀🚧
12: haust.network 938 (type4) 🚀
13: ternoa.network 752025 (type7) 🚀️✔️
14: unknown cdk sov chain (z-chain, z token) 9369 (type9) 🚀️
15: pentagon.games/pen-chain 623 (type7)

## Watched changes

```diff
    contract PolygonRollupManager (0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2) {
    +++ description: The central shared managing contract for Layer 2s on the Polygon AggLayer. This contract receives L2 state roots as well as ZK proofs. All connected Layer 2s can be globally paused by activating the 'Emergency State'. This can be done by the 0x37c58Dfa7BF0A165C5AAEdDf3e2EdB475ac6Dcb6 or by anyone after 1 week of inactive verifiers.
+++ description: Checks if lastVerifiedBatch for a rollupID is greater than one. Works like a trigger for statetransition projects becoming active after deployment. Mind that index here is rollupID-1.
      values.isVerifyingBatches.14:
+        [false]
+++ description: Lists any rollupID that sends a pessimistic proof.
      values.pessimisticProofSenders.0:
+        14
      values.rollupCount:
-        14
+        15
+++ description: Maps rollup contracts and their verifier. Any change should be picked up also by the specific rollup config, unless it's a new rollup. [rollupContract, chainID, verifier, forkID, rollupVerifierType, programVKey]
+++ severity: MEDIUM
      values.rollupsDataV2.14:
+        ["0xB4cEb70E8778a9928feD6ECBa1b03706a57b0ce8",623,"0x9B9671dB83CfcB4508bF361942488C5cA2b1286D",12,7,0,"0x0000000000000000000000000000000000000000000000000000000000000000"]
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21787152 (main branch discovery), not current.

```diff
    contract PolygonRollupManager (0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2) {
    +++ description: The central shared managing contract for Layer 2s on the Polygon AggLayer. This contract receives L2 state roots as well as ZK proofs. All connected Layer 2s can be globally paused by activating the 'Emergency State'. This can be done by the 0x37c58Dfa7BF0A165C5AAEdDf3e2EdB475ac6Dcb6 or by anyone after 1 week of inactive verifiers.
      fieldMeta.pessimisticProofSenders.severity:
-        "HIGH"
    }
```

Generated with discovered.json: 0xb2db688790975aa488dcb9282c4f2fdd43f4d85b

# Diff at Thu, 06 Feb 2025 11:35:17 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@98889e54375709a199b6bf496cefcc776f3691b4 block: 21772665
- current block number: 21787152

## Description

Add monitoring for accounting proofs.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21772665 (main branch discovery), not current.

```diff
    contract PolygonRollupManager (0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2) {
    +++ description: The central shared managing contract for Layer 2s on the Polygon AggLayer. This contract receives L2 state roots as well as ZK proofs. All connected Layer 2s can be globally paused by activating the 'Emergency State'. This can be done by the 0x37c58Dfa7BF0A165C5AAEdDf3e2EdB475ac6Dcb6 or by anyone after 1 week of inactive verifiers.
+++ description: Lists any rollupID that sends a pessimistic proof.
+++ severity: HIGH
      values.pessimisticProofSenders:
+        []
      fieldMeta.isVerifyingBatches.description:
-        "Checks if lastVerifiedBatch for a rollupID is greater than one. Works like a trigger for projects becoming active after deployment. Mind that index here is rollupID-1."
+        "Checks if lastVerifiedBatch for a rollupID is greater than one. Works like a trigger for statetransition projects becoming active after deployment. Mind that index here is rollupID-1."
      fieldMeta.pessimisticProofSenders:
+        {"severity":"HIGH","description":"Lists any rollupID that sends a pessimistic proof."}
    }
```

Generated with discovered.json: 0x6e0bf9ef2ea555f5959e94c27880677b5ef2a461

# Diff at Tue, 04 Feb 2025 13:45:04 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@142491370256d9fb936a347e610d0ac200e9e51c block: 21745064
- current block number: 21772665

## Description

Upgrade PolygonRollupManager to the version "pessimistic" (yes this is the version string).

Reduce timelock delay from 10d to 3d.

This upgrade introduces an enum `VerifierType` that replaces the old `rollupCompatibilityID`. It can be either `StateTransition` or `Pessimistic`, and currently cannot be changed for a project.
- `StateTransition` Layer 2s (Rollups or Validiums) are using their normal verifier contracts for state validation as before: (`verifyBatchesTrustedAggregator()`)
- `Pessimistic` projects must post accounting proofs to the Rollupmanager with `verifyPessimisticTrustedAggregator()` in order to be able to use the shared bridge. These projects can be ['CDK Sovereign'](https://docs.polygon.technology/agglayer/modes-of-integration/polygon-cdk/#cdk-sovereign), without full state validation or DA on Ethereum.

### PolygonRollupManager

- add `rollupIDToRollupDataV2()` in addition to the old v1 function to accomodate the new members of the RollupData struct:
  - VerifierType rollupVerifierType: a rename of the old rollupCompatibilityID, `StateTransition` or `Pessimistic`
  - bytes32 lastPessimisticRoot
  - bytes32 programVKey: SP1 program vKey 
- remove `verifyBatches()` after timeout of proposer being unlive: leaves only the trusted aggregator version (risk rosette red for prop fail)
- remove pending state (and consolidatePendingState) since there is no permissionless proposer/prover anymore (this also removes the `proveNonDeterministicState` entry into emergency state)
- `verifyPessimisticTrustedAggregator()`: verifies pessimistic proof, equivalent to `verifyBatchesTrustedAggregator()` for the legacy projects

## Watched changes

```diff
    contract PolygonAdminMultisig (0x242daE44F5d8fb54B198D03a94dA45B5a4413e21) {
    +++ description: None
      receivedPermissions.7.via.1.delay:
-        864000
+        259200
      receivedPermissions.6.via.1.delay:
-        864000
+        259200
      receivedPermissions.5.via.1.delay:
-        864000
+        259200
      receivedPermissions.3.via.0.delay:
-        864000
+        259200
      receivedPermissions.2.description:
-        "manage parameters like permissioned timeouts and fees for all connected projects, set the trusted aggregator, stop the emergency state, update projects and obsolete rollup types (implementations)."
+        "manage parameters like fees for all connected projects, set the trusted aggregator, stop the emergency state, update projects and obsolete rollup types."
      receivedPermissions.1.via.0.delay:
-        864000
+        259200
      directlyReceivedPermissions.0.delay:
-        864000
+        259200
    }
```

```diff
    contract PolygonZkEVMBridgeV2 (0x2a3DD3EB832aF982ec71669E178424b10Dca2EDe) {
    +++ description: The shared bridge contract, escrowing user funds sent to Layer 2s perticipating in the AggLayer. It is mirrored on each L2 and can be used to transfer both ERC20 assets and arbitrary messages.
      issuedPermissions.0.via.0.delay:
-        864000
+        259200
    }
```

```diff
    contract PolygonRollupManager (0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2) {
    +++ description: The central shared managing contract for Layer 2s on the Polygon AggLayer. This contract receives L2 state roots as well as ZK proofs. All connected Layer 2s can be globally paused by activating the 'Emergency State'. This can be done by the 0x37c58Dfa7BF0A165C5AAEdDf3e2EdB475ac6Dcb6 or by anyone after 1 week of inactive verifiers.
      template:
-        "polygon-cdk/PolygonRollupManager"
+        "polygon-cdk/PolygonRollupManager_pessimistic"
      sourceHashes.1:
-        "0x970ba596f805bae56173fc8c6865317fd90b24c1871f324ff19f0fc8a8b81069"
+        "0x7e3c84e6c7073576082d9a34cfeb47653ec669528708f3a487faa1803a1b25eb"
      description:
-        "The central shared managing contract for Layer 2s on the Polygon AggLayer. This contract receives L2 state roots as well as ZK proofs. All connected Layer 2s can be globally paused by activating the 'Emergency State'. This can be done by the 0x37c58Dfa7BF0A165C5AAEdDf3e2EdB475ac6Dcb6 or by anyone able to prove a non-deterministic pending state or after 1 week of inactive verifiers."
+        "The central shared managing contract for Layer 2s on the Polygon AggLayer. This contract receives L2 state roots as well as ZK proofs. All connected Layer 2s can be globally paused by activating the 'Emergency State'. This can be done by the 0x37c58Dfa7BF0A165C5AAEdDf3e2EdB475ac6Dcb6 or by anyone after 1 week of inactive verifiers."
      issuedPermissions.7.via.0.delay:
-        864000
+        259200
      issuedPermissions.4.description:
-        "manage parameters like permissioned timeouts and fees for all connected projects, set the trusted aggregator, stop the emergency state, update projects and obsolete rollup types (implementations)."
+        "manage parameters like fees for all connected projects, set the trusted aggregator, stop the emergency state, update projects and obsolete rollup types."
      issuedPermissions.3.via.0.delay:
-        864000
+        259200
      values.$implementation:
-        "0x103388f5661d224F4aFb555C7E4a8FB52d0b752d"
+        "0xA33619940bceb9be7c9679Dd80FA2918C2476382"
      values.$pastUpgrades.5:
+        ["2025-02-03T14:55:59.000Z","0xb499c5a8f315d72886e44eabcbf6428fb9672f3ea8eb55adcbfda0ae0612233e",["0xA33619940bceb9be7c9679Dd80FA2918C2476382"]]
      values.$upgradeCount:
-        5
+        6
+++ description: Checks if lastVerifiedBatch for a rollupID is greater than one. Works like a trigger for projects becoming active after deployment. Mind that index here is rollupID-1.
      values.isVerifyingBatches.13:
+        [false]
      values.nondeterministicPendingState:
-        []
      values.pendingStateTimeout:
-        432000
      values.rollupCount:
-        13
+        14
      values.rollupsData:
-        [["0x519E42c24163192Dca44CD3fBDCEBF6be9130987",1101,"0x9B9671dB83CfcB4508bF361942488C5cA2b1286D",6],["0x1E163594e13030244DCAf4cDfC2cd0ba3206DA80",3776,"0x0775e11309d75aA6b0967917fB0213C5673eDf81",4],["0x2B0ee28D4D51bC9aDde5E58E295873F61F4a0507",196,"0x455ac63E96e6a64EA59C6Da0D8F90FCa3F1535aB",8],["0x88AaB361f108C3c959F2928Da3cD8e47298016B5",4913,"0x0775e11309d75aA6b0967917fB0213C5673eDf81",4],["0xC4E903D3Af4c3d2e437492d602adcC9d9b536858",1511670449,"0x0775e11309d75aA6b0967917fB0213C5673eDf81",4],["0x42Ac57F24EC4C3AAC843f6DBAcd9282DAaeE9238",1702448187,"0x0775e11309d75aA6b0967917fB0213C5673eDf81",4],["0x92726F7dE49300DBdb60930066bc1d0803c0740B",994873017,"0x0775e11309d75aA6b0967917fB0213C5673eDf81",4],["0x78253E2E6120164bd826668A4C96Db20f78A94c9",31415,"0x0775e11309d75aA6b0967917fB0213C5673eDf81",4],["0xA87df42CD53E998b3A610B8bCe3719871b0bb940",511252203,"0x0775e11309d75aA6b0967917fB0213C5673eDf81",4],["0x419dcD0f72ebAFd3524b65a97ac96699C7fBebdB",2355,"0x0775e11309d75aA6b0967917fB0213C5673eDf81",4],["0xB234F18738d9531CAD6ae6d9A587d09fe200272C",999,"0x0775e11309d75aA6b0967917fB0213C5673eDf81",4],["0x505ce1246F7e2Fd899dc5d3cfB17A47500Eb58bC",938,"0x0775e11309d75aA6b0967917fB0213C5673eDf81",4],["0x7fF0B5fF6Eb8B789456639AC2A02487c338c1789",752025,"0x9B9671dB83CfcB4508bF361942488C5cA2b1286D",7]]
      values.rollupTypeCount:
-        8
+        9
+++ description: struct consensusImplementation, verifier, forkID, rollupVerifierType, obsolete, programVKey
      values.rollupTypes.8:
+        ["0x18C45DD422f6587357a6d3b23307E75D42b2bc5B","0xE00a3cBFC45241b33c0A44C78e26168CBc55EC63",12,1,false,"0x0062c685702e0582d900f3a19521270c92a58e2588230c4a5cf3b45103f4a512"]
+++ description: struct consensusImplementation, verifier, forkID, rollupVerifierType, obsolete, programVKey
      values.rollupTypes.7.5:
+        "0x0000000000000000000000000000000000000000000000000000000000000000"
+++ description: struct consensusImplementation, verifier, forkID, rollupVerifierType, obsolete, programVKey
      values.rollupTypes.7.4:
+        false
+++ description: struct consensusImplementation, verifier, forkID, rollupVerifierType, obsolete, programVKey
      values.rollupTypes.7.3:
+        0
+++ description: struct consensusImplementation, verifier, forkID, rollupVerifierType, obsolete, programVKey
      values.rollupTypes.7.2:
+        13
+++ description: struct consensusImplementation, verifier, forkID, rollupVerifierType, obsolete, programVKey
      values.rollupTypes.6.5:
+        "0x0000000000000000000000000000000000000000000000000000000000000000"
+++ description: struct consensusImplementation, verifier, forkID, rollupVerifierType, obsolete, programVKey
      values.rollupTypes.6.4:
+        false
+++ description: struct consensusImplementation, verifier, forkID, rollupVerifierType, obsolete, programVKey
      values.rollupTypes.6.3:
+        0
+++ description: struct consensusImplementation, verifier, forkID, rollupVerifierType, obsolete, programVKey
      values.rollupTypes.6.2:
+        12
+++ description: struct consensusImplementation, verifier, forkID, rollupVerifierType, obsolete, programVKey
      values.rollupTypes.5.5:
+        "0x0000000000000000000000000000000000000000000000000000000000000000"
+++ description: struct consensusImplementation, verifier, forkID, rollupVerifierType, obsolete, programVKey
      values.rollupTypes.5.4:
+        false
+++ description: struct consensusImplementation, verifier, forkID, rollupVerifierType, obsolete, programVKey
      values.rollupTypes.5.3:
+        0
+++ description: struct consensusImplementation, verifier, forkID, rollupVerifierType, obsolete, programVKey
      values.rollupTypes.5.2:
+        12
+++ description: struct consensusImplementation, verifier, forkID, rollupVerifierType, obsolete, programVKey
      values.rollupTypes.4.5:
+        "0x0000000000000000000000000000000000000000000000000000000000000000"
+++ description: struct consensusImplementation, verifier, forkID, rollupVerifierType, obsolete, programVKey
      values.rollupTypes.4.4:
+        false
+++ description: struct consensusImplementation, verifier, forkID, rollupVerifierType, obsolete, programVKey
      values.rollupTypes.4.3:
+        0
+++ description: struct consensusImplementation, verifier, forkID, rollupVerifierType, obsolete, programVKey
      values.rollupTypes.4.2:
+        11
+++ description: struct consensusImplementation, verifier, forkID, rollupVerifierType, obsolete, programVKey
      values.rollupTypes.3.5:
+        "0x0000000000000000000000000000000000000000000000000000000000000000"
+++ description: struct consensusImplementation, verifier, forkID, rollupVerifierType, obsolete, programVKey
      values.rollupTypes.3.4:
+        false
+++ description: struct consensusImplementation, verifier, forkID, rollupVerifierType, obsolete, programVKey
      values.rollupTypes.3.3:
+        0
+++ description: struct consensusImplementation, verifier, forkID, rollupVerifierType, obsolete, programVKey
      values.rollupTypes.3.2:
+        9
+++ description: struct consensusImplementation, verifier, forkID, rollupVerifierType, obsolete, programVKey
      values.rollupTypes.2.5:
+        "0x0000000000000000000000000000000000000000000000000000000000000000"
+++ description: struct consensusImplementation, verifier, forkID, rollupVerifierType, obsolete, programVKey
      values.rollupTypes.2.4:
+        false
+++ description: struct consensusImplementation, verifier, forkID, rollupVerifierType, obsolete, programVKey
      values.rollupTypes.2.3:
+        0
+++ description: struct consensusImplementation, verifier, forkID, rollupVerifierType, obsolete, programVKey
      values.rollupTypes.2.2:
+        9
+++ description: struct consensusImplementation, verifier, forkID, rollupVerifierType, obsolete, programVKey
      values.rollupTypes.1.5:
+        "0x0000000000000000000000000000000000000000000000000000000000000000"
+++ description: struct consensusImplementation, verifier, forkID, rollupVerifierType, obsolete, programVKey
      values.rollupTypes.1.4:
+        false
+++ description: struct consensusImplementation, verifier, forkID, rollupVerifierType, obsolete, programVKey
      values.rollupTypes.1.3:
+        0
+++ description: struct consensusImplementation, verifier, forkID, rollupVerifierType, obsolete, programVKey
      values.rollupTypes.1.2:
+        8
+++ description: struct consensusImplementation, verifier, forkID, rollupVerifierType, obsolete, programVKey
      values.rollupTypes.0.5:
+        "0x0000000000000000000000000000000000000000000000000000000000000000"
+++ description: struct consensusImplementation, verifier, forkID, rollupVerifierType, obsolete, programVKey
      values.rollupTypes.0.4:
+        false
+++ description: struct consensusImplementation, verifier, forkID, rollupVerifierType, obsolete, programVKey
      values.rollupTypes.0.3:
+        0
+++ description: struct consensusImplementation, verifier, forkID, rollupVerifierType, obsolete, programVKey
      values.rollupTypes.0.2:
+        7
      values.trustedAggregatorTimeout:
-        432000
      values.verifyBatchTimeTarget:
-        1800
      values.ROLLUP_MANAGER_VERSION:
+        "pessimistic"
+++ description: Maps rollup contracts and their verifier. Any change should be picked up also by the specific rollup config, unless it's a new rollup. [rollupContract, chainID, verifier, forkID, rollupVerifierType, programVKey]
+++ severity: MEDIUM
      values.rollupsDataV2:
+        [["0x519E42c24163192Dca44CD3fBDCEBF6be9130987",1101,"0x9B9671dB83CfcB4508bF361942488C5cA2b1286D",12,6,0,"0x0000000000000000000000000000000000000000000000000000000000000000"],["0x1E163594e13030244DCAf4cDfC2cd0ba3206DA80",3776,"0x0775e11309d75aA6b0967917fB0213C5673eDf81",9,4,0,"0x0000000000000000000000000000000000000000000000000000000000000000"],["0x2B0ee28D4D51bC9aDde5E58E295873F61F4a0507",196,"0x455ac63E96e6a64EA59C6Da0D8F90FCa3F1535aB",13,8,0,"0x0000000000000000000000000000000000000000000000000000000000000000"],["0x88AaB361f108C3c959F2928Da3cD8e47298016B5",4913,"0x0775e11309d75aA6b0967917fB0213C5673eDf81",9,4,0,"0x0000000000000000000000000000000000000000000000000000000000000000"],["0xC4E903D3Af4c3d2e437492d602adcC9d9b536858",1511670449,"0x0775e11309d75aA6b0967917fB0213C5673eDf81",9,4,0,"0x0000000000000000000000000000000000000000000000000000000000000000"],["0x42Ac57F24EC4C3AAC843f6DBAcd9282DAaeE9238",1702448187,"0x0775e11309d75aA6b0967917fB0213C5673eDf81",9,4,0,"0x0000000000000000000000000000000000000000000000000000000000000000"],["0x92726F7dE49300DBdb60930066bc1d0803c0740B",994873017,"0x0775e11309d75aA6b0967917fB0213C5673eDf81",9,4,0,"0x0000000000000000000000000000000000000000000000000000000000000000"],["0x78253E2E6120164bd826668A4C96Db20f78A94c9",31415,"0x0775e11309d75aA6b0967917fB0213C5673eDf81",9,4,0,"0x0000000000000000000000000000000000000000000000000000000000000000"],["0xA87df42CD53E998b3A610B8bCe3719871b0bb940",511252203,"0x0775e11309d75aA6b0967917fB0213C5673eDf81",9,4,0,"0x0000000000000000000000000000000000000000000000000000000000000000"],["0x419dcD0f72ebAFd3524b65a97ac96699C7fBebdB",2355,"0x0775e11309d75aA6b0967917fB0213C5673eDf81",9,4,0,"0x0000000000000000000000000000000000000000000000000000000000000000"],["0xB234F18738d9531CAD6ae6d9A587d09fe200272C",999,"0x0775e11309d75aA6b0967917fB0213C5673eDf81",9,4,0,"0x0000000000000000000000000000000000000000000000000000000000000000"],["0x505ce1246F7e2Fd899dc5d3cfB17A47500Eb58bC",938,"0x0775e11309d75aA6b0967917fB0213C5673eDf81",9,4,0,"0x0000000000000000000000000000000000000000000000000000000000000000"],["0x7fF0B5fF6Eb8B789456639AC2A02487c338c1789",752025,"0x9B9671dB83CfcB4508bF361942488C5cA2b1286D",12,7,0,"0x0000000000000000000000000000000000000000000000000000000000000000"],["0xFE797cb13f7884FB9f0aE26fEB2a06ed8efccbe7",9369,"0xE00a3cBFC45241b33c0A44C78e26168CBc55EC63",12,9,1,"0x0062c685702e0582d900f3a19521270c92a58e2588230c4a5cf3b45103f4a512"]]
      fieldMeta.nondeterministicPendingState:
-        {"severity":"HIGH"}
      fieldMeta.rollupsData:
-        {"severity":"MEDIUM","description":"Maps rollup contracts and their verifier. Any change should be picked up also by the specific rollup config, unless it's a new rollup. [rollupContract, chainID, verifier, rollupTypeID]"}
      fieldMeta.rollupTypes.description:
-        "struct consensusImplementation, verifier, forkID, rollupCompatibilityID, bool obsolete, genesisBlock"
+        "struct consensusImplementation, verifier, forkID, rollupVerifierType, obsolete, programVKey"
      fieldMeta.rollupsDataV2:
+        {"severity":"MEDIUM","description":"Maps rollup contracts and their verifier. Any change should be picked up also by the specific rollup config, unless it's a new rollup. [rollupContract, chainID, verifier, forkID, rollupVerifierType, programVKey]"}
    }
```

```diff
    contract PolygonZkEVMGlobalExitRootV2 (0x580bda1e7A0CFAe92Fa7F6c20A3794F169CE3CFb) {
    +++ description: A merkle tree storage contract aggregating state roots of each participating Layer 2, thus creating a single global merkle root representing the global state of the AggLayer, the 'global exit root'. The global exit root is synchronized to all connected Layer 2s to help with their interoperability.
      issuedPermissions.0.via.0.delay:
-        864000
+        259200
    }
```

```diff
    contract PolygonZkEVMTimelock (0xEf1462451C30Ea7aD8555386226059Fe837CA4EF) {
    +++ description: A timelock with access control. In the case of an activated emergency state in the 0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2, all transactions through this timelock are immediately executable. The current minimum delay is 3d.
      description:
-        "A timelock with access control. In the case of an activated emergency state in the 0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2, all transactions through this timelock are immediately executable. The current minimum delay is 10d."
+        "A timelock with access control. In the case of an activated emergency state in the 0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2, all transactions through this timelock are immediately executable. The current minimum delay is 3d."
      issuedPermissions.1.via.0.delay:
-        864000
+        259200
      directlyReceivedPermissions.1.delay:
-        864000
+        259200
      values.getMinDelay:
-        864000
+        259200
      values.getMinDelayFormatted:
-        "10d"
+        "3d"
    }
```

## Source code changes

```diff
.../PolygonRollupManager/PolygonRollupManager.sol  | 1305 ++++++++------------
 1 file changed, 515 insertions(+), 790 deletions(-)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21745064 (main branch discovery), not current.

```diff
    contract PolygonAdminMultisig (0x242daE44F5d8fb54B198D03a94dA45B5a4413e21) {
    +++ description: None
      receivedPermissions.4.permission:
-        "configure"
+        "interact"
      receivedPermissions.3.permission:
-        "configure"
+        "interact"
      receivedPermissions.2.permission:
-        "configure"
+        "interact"
      receivedPermissions.1.permission:
-        "configure"
+        "interact"
      receivedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract PolygonSecurityCouncil (0x37c58Dfa7BF0A165C5AAEdDf3e2EdB475ac6Dcb6) {
    +++ description: None
      receivedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract PolygonRollupManager (0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2) {
    +++ description: The central shared managing contract for Layer 2s on the Polygon AggLayer. This contract receives L2 state roots as well as ZK proofs. All connected Layer 2s can be globally paused by activating the 'Emergency State'. This can be done by the 0x37c58Dfa7BF0A165C5AAEdDf3e2EdB475ac6Dcb6 or by anyone able to prove a non-deterministic pending state or after 1 week of inactive verifiers.
      issuedPermissions.6.permission:
-        "configure"
+        "interact"
      issuedPermissions.5.permission:
-        "configure"
+        "interact"
      issuedPermissions.4.permission:
-        "configure"
+        "interact"
      issuedPermissions.3.permission:
-        "configure"
+        "interact"
      issuedPermissions.2.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract PolygonCreateRollupMultisig (0xC74eFc7fdb3BeC9c6930E91FFDF761b160dF79dB) {
    +++ description: None
      receivedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract PolygonZkEVMTimelock (0xEf1462451C30Ea7aD8555386226059Fe837CA4EF) {
    +++ description: A timelock with access control. In the case of an activated emergency state in the 0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2, all transactions through this timelock are immediately executable. The current minimum delay is 10d.
      issuedPermissions.1.permission:
-        "configure"
+        "interact"
      issuedPermissions.0.permission:
-        "configure"
+        "interact"
      directlyReceivedPermissions.3.permission:
-        "configure"
+        "interact"
      directlyReceivedPermissions.2.permission:
-        "configure"
+        "interact"
    }
```

Generated with discovered.json: 0xda60ce55287fb5f595f630ba4fb0ae56915c6943

# Diff at Sun, 02 Feb 2025 16:46:27 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@9637849b063da030577f396e3f0368d2e5dcec02 block: 21686453
- current block number: 21745064

## Description

discodrive polygon cdk chains!

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21686453 (main branch discovery), not current.

```diff
-   Status: DELETED
    contract Permit2 (0x000000000022D473030F116dDEE9F6B43aC78BA3)
    +++ description: None
```

```diff
    contract PolygonAdminMultisig (0x242daE44F5d8fb54B198D03a94dA45B5a4413e21) {
    +++ description: None
      name:
-        "RollupManagerAdminMultisig"
+        "PolygonAdminMultisig"
      receivedPermissions:
+        [{"permission":"configure","from":"0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2","description":"deploy new projects that use predefined rollup types (implementations) and connect them to the PolygonRollupManager."},{"permission":"configure","from":"0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2","description":"manage all access control roles, add new rollup types (which are implementation contracts that can then be upgraded to by connected projects), update any connected projects to new rollup types and rollback batches, connect existing rollups to the PolygonRollupManager.","via":[{"address":"0xEf1462451C30Ea7aD8555386226059Fe837CA4EF","delay":864000,"condition":"there is no emergency state, in which case there is no delay"}]},{"permission":"configure","from":"0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2","description":"manage parameters like permissioned timeouts and fees for all connected projects, set the trusted aggregator, stop the emergency state, update projects and obsolete rollup types (implementations)."},{"permission":"configure","from":"0xEf1462451C30Ea7aD8555386226059Fe837CA4EF","description":"propose, cancel and execute transactions in the timelock, manage all access control roles.","via":[{"address":"0xEf1462451C30Ea7aD8555386226059Fe837CA4EF","delay":864000,"condition":"there is no emergency state, in which case there is no delay"}]},{"permission":"configure","from":"0xEf1462451C30Ea7aD8555386226059Fe837CA4EF","description":"propose, cancel and execute transactions in the timelock, manage all access control roles."},{"permission":"upgrade","from":"0x2a3DD3EB832aF982ec71669E178424b10Dca2EDe","via":[{"address":"0x0F99738B2Fc14D77308337f3e2596b63aE7BCC4A"},{"address":"0xEf1462451C30Ea7aD8555386226059Fe837CA4EF","delay":864000,"condition":"there is no emergency state, in which case there is no delay"}]},{"permission":"upgrade","from":"0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2","via":[{"address":"0x0F99738B2Fc14D77308337f3e2596b63aE7BCC4A"},{"address":"0xEf1462451C30Ea7aD8555386226059Fe837CA4EF","delay":864000,"condition":"there is no emergency state, in which case there is no delay"}]},{"permission":"upgrade","from":"0x580bda1e7A0CFAe92Fa7F6c20A3794F169CE3CFb","via":[{"address":"0x0F99738B2Fc14D77308337f3e2596b63aE7BCC4A"},{"address":"0xEf1462451C30Ea7aD8555386226059Fe837CA4EF","delay":864000,"condition":"there is no emergency state, in which case there is no delay"}]}]
      directlyReceivedPermissions:
+        [{"permission":"act","from":"0xEf1462451C30Ea7aD8555386226059Fe837CA4EF","delay":864000,"condition":"there is no emergency state, in which case there is no delay"}]
    }
```

```diff
    contract PolygonZkEVMBridgeV2 (0x2a3DD3EB832aF982ec71669E178424b10Dca2EDe) {
    +++ description: The shared bridge contract, escrowing user funds sent to Layer 2s perticipating in the AggLayer. It is mirrored on each L2 and can be used to transfer both ERC20 assets and arbitrary messages.
      name:
-        "Bridge"
+        "PolygonZkEVMBridgeV2"
      issuedPermissions.0.to:
-        "0xEf1462451C30Ea7aD8555386226059Fe837CA4EF"
+        "0x242daE44F5d8fb54B198D03a94dA45B5a4413e21"
      issuedPermissions.0.via.1:
+        {"address":"0x0F99738B2Fc14D77308337f3e2596b63aE7BCC4A"}
      issuedPermissions.0.via.0.address:
-        "0x0F99738B2Fc14D77308337f3e2596b63aE7BCC4A"
+        "0xEf1462451C30Ea7aD8555386226059Fe837CA4EF"
      issuedPermissions.0.via.0.delay:
+        864000
      issuedPermissions.0.via.0.condition:
+        "there is no emergency state, in which case there is no delay"
      template:
+        "polygon-cdk/PolygonSharedBridge"
      displayName:
+        "PolygonSharedBridge"
      description:
+        "The shared bridge contract, escrowing user funds sent to Layer 2s perticipating in the AggLayer. It is mirrored on each L2 and can be used to transfer both ERC20 assets and arbitrary messages."
      fieldMeta:
+        {"isEmergencyState":{"severity":"HIGH","description":"pauses the bridge, managed by the PolygonRollupManager."}}
    }
```

```diff
    contract PolygonSecurityCouncil (0x37c58Dfa7BF0A165C5AAEdDf3e2EdB475ac6Dcb6) {
    +++ description: None
      name:
-        "SecurityCouncil"
+        "PolygonSecurityCouncil"
      receivedPermissions:
+        [{"permission":"configure","from":"0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2","description":"activate the emergency state in the PolygonRollupManager and in the shared bridge immediately, effectively pausing all projects connected to them and making system contracts instantly upgradable."}]
    }
```

```diff
-   Status: DELETED
    contract POL (0x455e53CBB86018Ac2B8092FdCd39d8444aFFC3F6)
    +++ description: None
```

```diff
    contract PolygonRollupManager (0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2) {
    +++ description: The central shared managing contract for Layer 2s on the Polygon AggLayer. This contract receives L2 state roots as well as ZK proofs. All connected Layer 2s can be globally paused by activating the 'Emergency State'. This can be done by the 0x37c58Dfa7BF0A165C5AAEdDf3e2EdB475ac6Dcb6 or by anyone able to prove a non-deterministic pending state or after 1 week of inactive verifiers.
      issuedPermissions.7:
+        {"permission":"upgrade","to":"0x242daE44F5d8fb54B198D03a94dA45B5a4413e21","via":[{"address":"0xEf1462451C30Ea7aD8555386226059Fe837CA4EF","delay":864000,"condition":"there is no emergency state, in which case there is no delay"},{"address":"0x0F99738B2Fc14D77308337f3e2596b63aE7BCC4A"}]}
      issuedPermissions.6:
+        {"permission":"configure","to":"0xC74eFc7fdb3BeC9c6930E91FFDF761b160dF79dB","description":"deploy new projects that use predefined rollup types (implementations) and connect them to the PolygonRollupManager.","via":[]}
      issuedPermissions.5:
+        {"permission":"configure","to":"0x37c58Dfa7BF0A165C5AAEdDf3e2EdB475ac6Dcb6","description":"activate the emergency state in the PolygonRollupManager and in the shared bridge immediately, effectively pausing all projects connected to them and making system contracts instantly upgradable.","via":[]}
      issuedPermissions.4:
+        {"permission":"configure","to":"0x242daE44F5d8fb54B198D03a94dA45B5a4413e21","description":"manage parameters like permissioned timeouts and fees for all connected projects, set the trusted aggregator, stop the emergency state, update projects and obsolete rollup types (implementations).","via":[]}
      issuedPermissions.3:
+        {"permission":"configure","to":"0x242daE44F5d8fb54B198D03a94dA45B5a4413e21","description":"manage all access control roles, add new rollup types (which are implementation contracts that can then be upgraded to by connected projects), update any connected projects to new rollup types and rollback batches, connect existing rollups to the PolygonRollupManager.","via":[{"address":"0xEf1462451C30Ea7aD8555386226059Fe837CA4EF","delay":864000,"condition":"there is no emergency state, in which case there is no delay"}]}
      issuedPermissions.2:
+        {"permission":"configure","to":"0x242daE44F5d8fb54B198D03a94dA45B5a4413e21","description":"deploy new projects that use predefined rollup types (implementations) and connect them to the PolygonRollupManager.","via":[]}
      issuedPermissions.1:
+        {"permission":"aggregatePolygon","to":"0x6329Fe417621925C81c16F9F9a18c203C21Af7ab","via":[]}
      issuedPermissions.0.permission:
-        "upgrade"
+        "aggregatePolygon"
      issuedPermissions.0.to:
-        "0xEf1462451C30Ea7aD8555386226059Fe837CA4EF"
+        "0x20A53dCb196cD2bcc14Ece01F358f1C849aA51dE"
      issuedPermissions.0.via.0:
-        {"address":"0x0F99738B2Fc14D77308337f3e2596b63aE7BCC4A"}
      values._HALT_AGGREGATION_TIMEOUT:
-        604800
+        "1 week"
      values.createRollupAC:
+        ["0x242daE44F5d8fb54B198D03a94dA45B5a4413e21","0xC74eFc7fdb3BeC9c6930E91FFDF761b160dF79dB"]
      values.defaultAdminAC:
+        ["0xEf1462451C30Ea7aD8555386226059Fe837CA4EF"]
      values.emergencyCouncilAdminAC:
+        ["0x37c58Dfa7BF0A165C5AAEdDf3e2EdB475ac6Dcb6"]
      values.trustedAggregatorAC:
+        ["0x6329Fe417621925C81c16F9F9a18c203C21Af7ab","0x20A53dCb196cD2bcc14Ece01F358f1C849aA51dE"]
      values.tweakParametersAC:
+        ["0x242daE44F5d8fb54B198D03a94dA45B5a4413e21"]
      fieldMeta.nondeterministicPendingState:
+        {"severity":"HIGH"}
      fieldMeta.isEmergencyState:
+        {"severity":"HIGH","description":"pauses all connected chains and the bridge, allows for immediate upgrades through the timelock."}
      template:
+        "polygon-cdk/PolygonRollupManager"
      description:
+        "The central shared managing contract for Layer 2s on the Polygon AggLayer. This contract receives L2 state roots as well as ZK proofs. All connected Layer 2s can be globally paused by activating the 'Emergency State'. This can be done by the 0x37c58Dfa7BF0A165C5AAEdDf3e2EdB475ac6Dcb6 or by anyone able to prove a non-deterministic pending state or after 1 week of inactive verifiers."
    }
```

```diff
    contract PolygonZkEVMGlobalExitRootV2 (0x580bda1e7A0CFAe92Fa7F6c20A3794F169CE3CFb) {
    +++ description: A merkle tree storage contract aggregating state roots of each participating Layer 2, thus creating a single global merkle root representing the global state of the AggLayer, the 'global exit root'. The global exit root is synchronized to all connected Layer 2s to help with their interoperability.
      name:
-        "GlobalExitRootV2"
+        "PolygonZkEVMGlobalExitRootV2"
      issuedPermissions.0.to:
-        "0xEf1462451C30Ea7aD8555386226059Fe837CA4EF"
+        "0x242daE44F5d8fb54B198D03a94dA45B5a4413e21"
      issuedPermissions.0.via.1:
+        {"address":"0x0F99738B2Fc14D77308337f3e2596b63aE7BCC4A"}
      issuedPermissions.0.via.0.address:
-        "0x0F99738B2Fc14D77308337f3e2596b63aE7BCC4A"
+        "0xEf1462451C30Ea7aD8555386226059Fe837CA4EF"
      issuedPermissions.0.via.0.delay:
+        864000
      issuedPermissions.0.via.0.condition:
+        "there is no emergency state, in which case there is no delay"
      template:
+        "polygon-cdk/PolygonGlobalExitRootV2"
      displayName:
+        "PolygonGlobalExitRootV2"
      description:
+        "A merkle tree storage contract aggregating state roots of each participating Layer 2, thus creating a single global merkle root representing the global state of the AggLayer, the 'global exit root'. The global exit root is synchronized to all connected Layer 2s to help with their interoperability."
    }
```

```diff
    contract PolygonCreateRollupMultisig (0xC74eFc7fdb3BeC9c6930E91FFDF761b160dF79dB) {
    +++ description: None
      name:
-        "CreateRollupMultisig"
+        "PolygonCreateRollupMultisig"
      receivedPermissions:
+        [{"permission":"configure","from":"0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2","description":"deploy new projects that use predefined rollup types (implementations) and connect them to the PolygonRollupManager."}]
    }
```

```diff
    contract PolygonZkEVMTimelock (0xEf1462451C30Ea7aD8555386226059Fe837CA4EF) {
    +++ description: A timelock with access control. In the case of an activated emergency state in the 0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2, all transactions through this timelock are immediately executable. The current minimum delay is 10d.
      name:
-        "Timelock"
+        "PolygonZkEVMTimelock"
      receivedPermissions:
-        [{"permission":"upgrade","from":"0x2a3DD3EB832aF982ec71669E178424b10Dca2EDe","via":[{"address":"0x0F99738B2Fc14D77308337f3e2596b63aE7BCC4A"}]},{"permission":"upgrade","from":"0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2","via":[{"address":"0x0F99738B2Fc14D77308337f3e2596b63aE7BCC4A"}]},{"permission":"upgrade","from":"0x580bda1e7A0CFAe92Fa7F6c20A3794F169CE3CFb","via":[{"address":"0x0F99738B2Fc14D77308337f3e2596b63aE7BCC4A"}]}]
      directlyReceivedPermissions.3:
+        {"permission":"configure","from":"0xEf1462451C30Ea7aD8555386226059Fe837CA4EF","description":"propose, cancel and execute transactions in the timelock, manage all access control roles."}
      directlyReceivedPermissions.2:
+        {"permission":"configure","from":"0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2","description":"manage all access control roles, add new rollup types (which are implementation contracts that can then be upgraded to by connected projects), update any connected projects to new rollup types and rollback batches, connect existing rollups to the PolygonRollupManager."}
      directlyReceivedPermissions.1:
+        {"permission":"act","from":"0xEf1462451C30Ea7aD8555386226059Fe837CA4EF","delay":864000,"condition":"there is no emergency state, in which case there is no delay"}
      values.getMinDelayFormatted:
+        "10d"
      values.timelockAdminAC:
+        ["0xEf1462451C30Ea7aD8555386226059Fe837CA4EF","0x242daE44F5d8fb54B198D03a94dA45B5a4413e21"]
      template:
+        "polygon-cdk/Timelock"
      displayName:
+        "Timelock"
      description:
+        "A timelock with access control. In the case of an activated emergency state in the 0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2, all transactions through this timelock are immediately executable. The current minimum delay is 10d."
      issuedPermissions:
+        [{"permission":"configure","to":"0x242daE44F5d8fb54B198D03a94dA45B5a4413e21","description":"propose, cancel and execute transactions in the timelock, manage all access control roles.","via":[]},{"permission":"configure","to":"0x242daE44F5d8fb54B198D03a94dA45B5a4413e21","description":"propose, cancel and execute transactions in the timelock, manage all access control roles.","via":[{"address":"0xEf1462451C30Ea7aD8555386226059Fe837CA4EF","delay":864000,"condition":"there is no emergency state, in which case there is no delay"}]}]
    }
```

Generated with discovered.json: 0x3e3da684ccdf32711740d539c0ef960d6459bf86

# Diff at Thu, 23 Jan 2025 10:00:14 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@c34926fa70131af78b4ff8ff2873e9c9f24dfc80 block: 21665502
- current block number: 21686453

## Description

Single member change in CreateRollupMultisig.

## Watched changes

```diff
    contract CreateRollupMultisig (0xC74eFc7fdb3BeC9c6930E91FFDF761b160dF79dB) {
    +++ description: None
      values.$members.1:
-        "0x9Ec9E740c5423147FCE0c78E0f3cb12ee3Fa02F6"
+        "0xa43901c63f7702C407378E55E0d0EB4064a2AE31"
      values.$members.0:
-        "0xa43901c63f7702C407378E55E0d0EB4064a2AE31"
+        "0x3038B4DBf022E80169b2A068290d4a3A8b87D3b5"
    }
```

Generated with discovered.json: 0xdf95e681dfbbcae8430943754a096c0d9fb31300

# Diff at Mon, 20 Jan 2025 11:48:06 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@658eb33e9afd98eac45a3037d195357115d19a86 block: 21630065
- current block number: 21665502

## Description

ternoa and haust.network are active, added notes to review them.

Two scheduled transactions (likely related to [Pessimistic Proofs](https://docs.polygon.technology/cdk/concepts/pessimistic-proofs/)):
21) upgrades the PolygonRollupManager
22) adds a new RollupType in the PRM, which has a contract called PolygonPessimisticConsensus (`0x18C45DD422f6587357a6d3b23307E75D42b2bc5B`) as consensus implementation and uses a Verifier called SP1Verifier (`0xE00a3cBFC45241b33c0A44C78e26168CBc55EC63`).

These two transactions do not yet upgrade any chains, but that can be done immediately after the execution (without delay).

## Watched changes

```diff
    contract PolygonRollupManager (0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2) {
    +++ description: None
+++ description: Checks if lastVerifiedBatch for a rollupID is greater than one. Works like a trigger for projects becoming active after deployment. Mind that index here is rollupID-1.
      values.isVerifyingBatches.12.0:
-        false
+        true
    }
```

```diff
    contract Timelock (0xEf1462451C30Ea7aD8555386226059Fe837CA4EF) {
    +++ description: None
      values.scheduledTransactionsDecoded.22:
+        {"target":"0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2","value":"0","function":"0xabcb5198","inputs":{"calldata":"00000000000000000000000018c45dd422f6587357a6d3b23307e75d42b2bc5b000000000000000000000000e00a3cbfc45241b33c0a44c78e26168cbc55ec63000000000000000000000000000000000000000000000000000000000000000c0000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000e00062c685702e0582d900f3a19521270c92a58e2588230c4a5cf3b45103f4a5120000000000000000000000000000000000000000000000000000000000000061547970653a2050657373696d69737469632c2056657273696f6e3a2076302e322e312c2067656e657369733a202f697066732f516d55586e526f5062556d5a75455a43477969486a45736f4e6346567533684c74537668706e664253326d41595500000000000000000000000000000000000000000000000000000000000000"},"predecessor":"0x0000000000000000000000000000000000000000000000000000000000000000","delay":"864000"}
      values.scheduledTransactionsDecoded.21:
+        {"target":"0x0F99738B2Fc14D77308337f3e2596b63aE7BCC4A","value":"0","function":"upgradeAndCall","inputs":{"proxy":"0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2","implementation":"0xA33619940bceb9be7c9679Dd80FA2918C2476382","data":{}},"predecessor":"0x0000000000000000000000000000000000000000000000000000000000000000","delay":"864000"}
    }
```

Generated with discovered.json: 0x95d93485b0295b88fab5a8b17c26c08512ed060e

# Diff at Mon, 20 Jan 2025 11:10:03 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@2c8b4f3d9910bb6371be9b4df87b70856e7d8c64 block: 21630065
- current block number: 21630065

## Description

Rerun on the same block number. Applies fixes to permissions and via field. Renames permission's target to to/from.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21630065 (main branch discovery), not current.

```diff
    contract SharedProxyAdmin (0x0F99738B2Fc14D77308337f3e2596b63aE7BCC4A) {
    +++ description: None
      directlyReceivedPermissions.2.target:
-        "0x580bda1e7A0CFAe92Fa7F6c20A3794F169CE3CFb"
      directlyReceivedPermissions.2.from:
+        "0x580bda1e7A0CFAe92Fa7F6c20A3794F169CE3CFb"
      directlyReceivedPermissions.1.target:
-        "0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2"
      directlyReceivedPermissions.1.from:
+        "0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2"
      directlyReceivedPermissions.0.target:
-        "0x2a3DD3EB832aF982ec71669E178424b10Dca2EDe"
      directlyReceivedPermissions.0.from:
+        "0x2a3DD3EB832aF982ec71669E178424b10Dca2EDe"
    }
```

```diff
    contract Bridge (0x2a3DD3EB832aF982ec71669E178424b10Dca2EDe) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xEf1462451C30Ea7aD8555386226059Fe837CA4EF"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0xEf1462451C30Ea7aD8555386226059Fe837CA4EF"
    }
```

```diff
    contract PolygonRollupManager (0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xEf1462451C30Ea7aD8555386226059Fe837CA4EF"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0xEf1462451C30Ea7aD8555386226059Fe837CA4EF"
    }
```

```diff
    contract GlobalExitRootV2 (0x580bda1e7A0CFAe92Fa7F6c20A3794F169CE3CFb) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xEf1462451C30Ea7aD8555386226059Fe837CA4EF"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0xEf1462451C30Ea7aD8555386226059Fe837CA4EF"
    }
```

```diff
    contract Timelock (0xEf1462451C30Ea7aD8555386226059Fe837CA4EF) {
    +++ description: None
      receivedPermissions.2.target:
-        "0x580bda1e7A0CFAe92Fa7F6c20A3794F169CE3CFb"
      receivedPermissions.2.from:
+        "0x580bda1e7A0CFAe92Fa7F6c20A3794F169CE3CFb"
      receivedPermissions.1.target:
-        "0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2"
      receivedPermissions.1.from:
+        "0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2"
      receivedPermissions.0.target:
-        "0x2a3DD3EB832aF982ec71669E178424b10Dca2EDe"
      receivedPermissions.0.from:
+        "0x2a3DD3EB832aF982ec71669E178424b10Dca2EDe"
      directlyReceivedPermissions.0.target:
-        "0x0F99738B2Fc14D77308337f3e2596b63aE7BCC4A"
      directlyReceivedPermissions.0.from:
+        "0x0F99738B2Fc14D77308337f3e2596b63aE7BCC4A"
    }
```

Generated with discovered.json: 0x1aa428ec03d5ea277b8f7a1b84b6121a4e31a444

# Diff at Wed, 15 Jan 2025 13:05:51 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@3ea176aee1470e5ec80e65adfc81a954f84584d8 block: 21579404
- current block number: 21630065

## Description

Polygon zkEVM upgraded to rollupTypeID 6 (prev 5), this is called the servicing update, and was deployed onchain in oct 2024 (see below).

Timelock tx queued to reduce the timelock delay from 10 to 3 days.

## Watched changes

```diff
    contract PolygonRollupManager (0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2) {
    +++ description: None
+++ description: Maps rollup contracts and their verifier. Any change should be picked up also by the specific rollup config, unless it's a new rollup. [rollupContract, chainID, verifier, rollupTypeID]
+++ severity: MEDIUM
      values.rollupsData.0.3:
-        5
+        6
+++ description: Maps rollup contracts and their verifier. Any change should be picked up also by the specific rollup config, unless it's a new rollup. [rollupContract, chainID, verifier, rollupTypeID]
+++ severity: MEDIUM
      values.rollupsData.0.2:
-        "0xc521580cd8586Cc688A7430F9DcE0f6A803F2883"
+        "0x9B9671dB83CfcB4508bF361942488C5cA2b1286D"
    }
```

```diff
    contract CreateRollupMultisig (0xC74eFc7fdb3BeC9c6930E91FFDF761b160dF79dB) {
    +++ description: None
      values.$members.7:
+        "0xC8aaFEF5C3689c29143023Fe53cB3e833e0439e9"
      values.$members.6:
-        "0xC8aaFEF5C3689c29143023Fe53cB3e833e0439e9"
+        "0x7316DeD96c4Ff756c74D1D9c4178f6921Aff4496"
      values.$members.5:
-        "0x7316DeD96c4Ff756c74D1D9c4178f6921Aff4496"
+        "0x0185fb2F27f2Acda3e2a6B8530b342333e9f22A6"
      values.$members.4:
-        "0x0185fb2F27f2Acda3e2a6B8530b342333e9f22A6"
+        "0x0B84d2e66192448B680BBd06813efF9e5923Ca77"
      values.$members.3:
-        "0x0B84d2e66192448B680BBd06813efF9e5923Ca77"
+        "0xCE27d8BCee45dB3E457EcF8629264Ca7893AAaAc"
      values.$members.2:
-        "0xCE27d8BCee45dB3E457EcF8629264Ca7893AAaAc"
+        "0xD9478f759a13Bfa1d9dAB3cDF5ff0C099d5EfCFC"
      values.$members.1:
-        "0xD9478f759a13Bfa1d9dAB3cDF5ff0C099d5EfCFC"
+        "0x9Ec9E740c5423147FCE0c78E0f3cb12ee3Fa02F6"
      values.$members.0:
-        "0x9Ec9E740c5423147FCE0c78E0f3cb12ee3Fa02F6"
+        "0xa43901c63f7702C407378E55E0d0EB4064a2AE31"
      values.multisigThreshold:
-        "3 of 7 (43%)"
+        "3 of 8 (38%)"
    }
```

```diff
    contract Timelock (0xEf1462451C30Ea7aD8555386226059Fe837CA4EF) {
    +++ description: None
      values.scheduledTransactionsDecoded.20:
+        {"target":"0xEf1462451C30Ea7aD8555386226059Fe837CA4EF","value":"0","function":"updateDelay","inputs":{"newDelay":259200},"predecessor":"0x0000000000000000000000000000000000000000000000000000000000000000","delay":"864000"}
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21579404 (main branch discovery), not current.

```diff
    contract SharedProxyAdmin (0x0F99738B2Fc14D77308337f3e2596b63aE7BCC4A) {
    +++ description: None
      displayName:
+        "ProxyAdmin"
    }
```

Generated with discovered.json: 0x85284e06ab48b8f6616195c93ae7fe0699bb3b2b

# Diff at Wed, 08 Jan 2025 11:18:03 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@3e3597c92f09cb5fc5a7ac01db63929f663c026f block: 21543818
- current block number: 21579404

## Description

xlayer is upgraded to the new type 8 validium, which was freshly added and has minimal diff to the type 7 from the [servicing upgrade](https://polygon.technology/blog/polygon-zkevm-servicing-update-coming-to-mainnet-beta). The Validium implementation is the same while the verifier differs.

## Watched changes

```diff
    contract PolygonRollupManager (0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2) {
    +++ description: None
+++ description: Maps rollup contracts and their verifier. Any change should be picked up also by the specific rollup config, unless it's a new rollup. [rollupContract, chainID, verifier, rollupTypeID]
+++ severity: MEDIUM
      values.rollupsData.2.3:
-        4
+        8
+++ description: Maps rollup contracts and their verifier. Any change should be picked up also by the specific rollup config, unless it's a new rollup. [rollupContract, chainID, verifier, rollupTypeID]
+++ severity: MEDIUM
      values.rollupsData.2.2:
-        "0x0775e11309d75aA6b0967917fB0213C5673eDf81"
+        "0x455ac63E96e6a64EA59C6Da0D8F90FCa3F1535aB"
      values.rollupTypeCount:
-        7
+        8
+++ description: struct consensusImplementation, verifier, forkID, rollupCompatibilityID, bool obsolete, genesisBlock
      values.rollupTypes.7:
+        ["0x427113ae6F319BfFb4459bfF96eb8B6BDe1A127F","0x455ac63E96e6a64EA59C6Da0D8F90FCa3F1535aB"]
    }
```

Generated with discovered.json: 0xb01359e6b262fce04a47953690d9596f2a9a9aff

# Diff at Fri, 03 Jan 2025 12:00:56 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@f2f208ac8a91552305da5e03332108446838b892 block: 21471468
- current block number: 21543818

## Description

New unverified L2 base contract deployed with a new rollupTypeID (7) and chainID 752025.

## Watched changes

```diff
    contract PolygonRollupManager (0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2) {
    +++ description: None
+++ description: Checks if lastVerifiedBatch for a rollupID is greater than one. Works like a trigger for projects becoming active after deployment. Mind that index here is rollupID-1.
      values.isVerifyingBatches.12:
+        [false]
      values.rollupCount:
-        12
+        13
+++ description: Maps rollup contracts and their verifier. Any change should be picked up also by the specific rollup config, unless it's a new rollup. [rollupContract, chainID, verifier, rollupTypeID]
+++ severity: MEDIUM
      values.rollupsData.12:
+        ["0x7fF0B5fF6Eb8B789456639AC2A02487c338c1789",752025,"0x9B9671dB83CfcB4508bF361942488C5cA2b1286D",7]
    }
```

Generated with discovered.json: 0x31ba653ef31f5529d5c2af23836d2d26e8e35fc7

# Diff at Tue, 24 Dec 2024 09:35:10 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@8f52aa11293aef791f10e1b8317bef0d461a04f9 block: 21465473
- current block number: 21471468

## Description

Single new signer `0x9Ec9E740c5423147FCE0c78E0f3cb12ee3Fa02F6` added to CreateRollupMultisig.

## Watched changes

```diff
    contract CreateRollupMultisig (0xC74eFc7fdb3BeC9c6930E91FFDF761b160dF79dB) {
    +++ description: None
      values.$members.6:
+        "0xC8aaFEF5C3689c29143023Fe53cB3e833e0439e9"
      values.$members.5:
-        "0xC8aaFEF5C3689c29143023Fe53cB3e833e0439e9"
+        "0x7316DeD96c4Ff756c74D1D9c4178f6921Aff4496"
      values.$members.4:
-        "0x7316DeD96c4Ff756c74D1D9c4178f6921Aff4496"
+        "0x0185fb2F27f2Acda3e2a6B8530b342333e9f22A6"
      values.$members.3:
-        "0x0185fb2F27f2Acda3e2a6B8530b342333e9f22A6"
+        "0x0B84d2e66192448B680BBd06813efF9e5923Ca77"
      values.$members.2:
-        "0x0B84d2e66192448B680BBd06813efF9e5923Ca77"
+        "0xCE27d8BCee45dB3E457EcF8629264Ca7893AAaAc"
      values.$members.1:
-        "0xCE27d8BCee45dB3E457EcF8629264Ca7893AAaAc"
+        "0xD9478f759a13Bfa1d9dAB3cDF5ff0C099d5EfCFC"
      values.$members.0:
-        "0xD9478f759a13Bfa1d9dAB3cDF5ff0C099d5EfCFC"
+        "0x9Ec9E740c5423147FCE0c78E0f3cb12ee3Fa02F6"
      values.multisigThreshold:
-        "3 of 6 (50%)"
+        "3 of 7 (43%)"
    }
```

Generated with discovered.json: 0xa21d9ef5e1f99bf8b3a155ec283a1b15639d8c6e

# Diff at Mon, 23 Dec 2024 13:26:43 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@18325a975c44684702f30ee366361589e4c2ed8c block: 21078440
- current block number: 21465473

## Description

addNewRollupType() for a new validium version scheduled (validiums can be then upgraded to this version).

## Watched changes

```diff
    contract Timelock (0xEf1462451C30Ea7aD8555386226059Fe837CA4EF) {
    +++ description: None
      values.scheduledTransactionsDecoded.19:
+        {"target":"0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2","value":"0","function":"addNewRollupType","inputs":{"consensusImplementation":"0x427113ae6F319BfFb4459bfF96eb8B6BDe1A127F","verifier":"0x455ac63E96e6a64EA59C6Da0D8F90FCa3F1535aB","forkID":13,"rollupCompatibilityID":0,"genesis":"0xe3a7d8bae497945ba8ddc51c69564f60ad4c1a990b9c7bdbd27f7929bfa8f272","description":"Type: Validium, Version: fork.13 , genesis: /ipfs/QmUXnRoPbUmZuEZCGyiHjEsoNcFVu3hLtSvhpnfBS2mAYU"},"predecessor":"0x0000000000000000000000000000000000000000000000000000000000000000","delay":"864000"}
    }
```

Generated with discovered.json: 0xb4eda61fe08c1533e7db7c7c6b9356c723381097

# Diff at Wed, 30 Oct 2024 12:25:53 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@0a8a53530022c6c5edd257c3682a3e7f80d0c550 block: 21041949
- current block number: 21078440

## Description

Execution of the previously queued Polygon Servicing Upgrade (see also the diff description from the time of queueing for context)

### PolygonRollupManager.sol
- `updateRollupByRollupAdmin()` upgrades the rollup implementation to an existing (higher) RollupType, callable by the chain-specific RollupAdmin (new role). The new RollupType must first be added by Polygon Gov.
- `rollbackBatches()` allows the RollupAdmins and the central _UPDATE_ROLLUP_ROLE to delete batches that are not yet verified. (`if (targetBatch >= lastBatchSequenced || targetBatch < rollup.lastVerifiedBatch) revert;`)

### GlobalExitRootV2.sol
Libraries removed and other minor changes.

## Watched changes

```diff
    contract PolygonRollupManager (0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2) {
    +++ description: None
      sourceHashes.1:
-        "0x0457cd9bbeaa5adb6ffff74ca828707e8797cdd25b13768eb37dcc7a120ce3c6"
+        "0x970ba596f805bae56173fc8c6865317fd90b24c1871f324ff19f0fc8a8b81069"
      values.$implementation:
-        "0x3b82Da772c825283d85d5d6717A77C6Ff582053b"
+        "0x103388f5661d224F4aFb555C7E4a8FB52d0b752d"
      values.$pastUpgrades.4:
+        ["2024-10-30T11:11:59.000Z","0x8c1be5b5d844d6e04b2c224cd810cda091d70e6d5c2e5e0464993f7df1ab8403",["0x103388f5661d224F4aFb555C7E4a8FB52d0b752d"]]
      values.$upgradeCount:
-        4
+        5
      values.rollupTypeCount:
-        5
+        7
+++ description: struct consensusImplementation, verifier, forkID, rollupCompatibilityID, bool obsolete, genesisBlock
      values.rollupTypes.6:
+        ["0x427113ae6F319BfFb4459bfF96eb8B6BDe1A127F","0x9B9671dB83CfcB4508bF361942488C5cA2b1286D"]
+++ description: struct consensusImplementation, verifier, forkID, rollupCompatibilityID, bool obsolete, genesisBlock
      values.rollupTypes.5:
+        ["0x7253F329302b1b5E774Ac641EA3743E9E3244f2E","0x9B9671dB83CfcB4508bF361942488C5cA2b1286D"]
    }
```

```diff
    contract GlobalExitRootV2 (0x580bda1e7A0CFAe92Fa7F6c20A3794F169CE3CFb) {
    +++ description: None
      sourceHashes.1:
-        "0x23dd296130348943833ff04807c22fab6b51e87b4d0d59ba0e35e802e3e1f079"
+        "0x5cd6999aa568aa00dc997f5d179426b88bf3797f4618bc4cce28b6cf5f8e76d6"
      values.$implementation:
-        "0x2E38cD55163137483E30580Cb468C2dFf1d85077"
+        "0x9Bdda421219900454E94e01d641fE64c60D8f4C8"
      values.$pastUpgrades.2:
+        ["2024-10-30T11:11:59.000Z","0x8c1be5b5d844d6e04b2c224cd810cda091d70e6d5c2e5e0464993f7df1ab8403",["0x9Bdda421219900454E94e01d641fE64c60D8f4C8"]]
      values.$upgradeCount:
-        2
+        3
    }
```

## Source code changes

```diff
.../PolygonZkEVMGlobalExitRootV2.sol               | 384 ++++++++++++++++++++-
 .../PolygonRollupManager/PolygonRollupManager.sol  | 377 +++++++++++++-------
 2 files changed, 637 insertions(+), 124 deletions(-)
```

Generated with discovered.json: 0xca1719de677e2f2abafafab996d933d449087f93

# Diff at Fri, 25 Oct 2024 10:11:50 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@e7501f424c0cea9b5438386ee76e509448999836 block: 21027362
- current block number: 21041949

## Description

The haust.network Validium is verifying batches.

## Watched changes

```diff
    contract PolygonRollupManager (0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2) {
    +++ description: None
+++ description: Checks if lastVerifiedBatch for a rollupID is greater than one. Works like a trigger for projects becoming active after deployment. Mind that index here is rollupID-1.
      values.isVerifyingBatches.11.0:
-        false
+        true
    }
```

Generated with discovered.json: 0x870349753c078e6a60f92c893fa50e6e87f85ae8

# Diff at Wed, 23 Oct 2024 09:22:43 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@2734bfe28641dfdb3277a5800faf0a057c08a58f block: 20997898
- current block number: 21027362

## Description

New haust.network associated chain deployed. (mainnet?) Not verifying batches yet.

## Watched changes

```diff
    contract PolygonRollupManager (0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2) {
    +++ description: None
+++ description: Checks if lastVerifiedBatch for a rollupID is greater than one. Works like a trigger for projects becoming active after deployment. Mind that index here is rollupID-1.
      values.isVerifyingBatches.11:
+        [false]
      values.rollupCount:
-        11
+        12
+++ description: Maps rollup contracts and their verifier. Any change should be picked up also by the specific rollup config, unless it's a new rollup. [rollupContract, chainID, verifier, rollupTypeID]
+++ severity: MEDIUM
      values.rollupsData.11:
+        ["0x505ce1246F7e2Fd899dc5d3cfB17A47500Eb58bC",938,"0x0775e11309d75aA6b0967917fB0213C5673eDf81",4]
    }
```

Generated with discovered.json: 0xdcc5c4dfc2847b00f0f100ee9eb97abee8fcf819

# Diff at Mon, 21 Oct 2024 11:10:04 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@8895d33866f5665c4c710f4ddaa32bfa63cc3c78 block: 20997898
- current block number: 20997898

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20997898 (main branch discovery), not current.

```diff
    contract Bridge (0x2a3DD3EB832aF982ec71669E178424b10Dca2EDe) {
    +++ description: None
      values.$pastUpgrades.1.2:
+        ["0x0FeB850B183C57534b56b7d56520133C8f9BDB65"]
      values.$pastUpgrades.1.1:
-        ["0x0FeB850B183C57534b56b7d56520133C8f9BDB65"]
+        "0xb83824c7eb1e87bd12222d98cf1cbff317b0853ba1e5beda1e3e3d8a4cfd1b24"
      values.$pastUpgrades.0.2:
+        ["0x5ac4182A1dd41AeEf465E40B82fd326BF66AB82C"]
      values.$pastUpgrades.0.1:
-        ["0x5ac4182A1dd41AeEf465E40B82fd326BF66AB82C"]
+        "0x28f93532243dd8a8cc92ce630ef1920f40de15af7db2903efbf42f21fdf8152c"
    }
```

```diff
    contract PolygonRollupManager (0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2) {
    +++ description: None
      values.$pastUpgrades.3.2:
+        ["0x3b82Da772c825283d85d5d6717A77C6Ff582053b"]
      values.$pastUpgrades.3.1:
-        ["0x3b82Da772c825283d85d5d6717A77C6Ff582053b"]
+        "0xb83824c7eb1e87bd12222d98cf1cbff317b0853ba1e5beda1e3e3d8a4cfd1b24"
      values.$pastUpgrades.2.2:
+        ["0xb1585916487AcEdD99952086f2950763D253b923"]
      values.$pastUpgrades.2.1:
-        ["0xb1585916487AcEdD99952086f2950763D253b923"]
+        "0x1db1400138d6778d303b9a13e816432d11f8dfca00ef6ec6ffcb6698cb447a31"
      values.$pastUpgrades.1.2:
+        ["0x301442aA888701c8B86727d42F3C55Fb0dd9eF7F"]
      values.$pastUpgrades.1.1:
-        ["0x301442aA888701c8B86727d42F3C55Fb0dd9eF7F"]
+        "0x25c342d7c5b4137b5439c16fd5fa1577c116277859202b2c68fcd9f73b3fc2ac"
      values.$pastUpgrades.0.2:
+        ["0xe262Ea2782e2e8dbFe354048c3B5d6DE9603EfEF"]
      values.$pastUpgrades.0.1:
-        ["0xe262Ea2782e2e8dbFe354048c3B5d6DE9603EfEF"]
+        "0xe34243804e1f7257acb09c97d0d6f023663200c39ee85a1e6927b0b391710bbb"
    }
```

```diff
    contract GlobalExitRootV2 (0x580bda1e7A0CFAe92Fa7F6c20A3794F169CE3CFb) {
    +++ description: None
      values.$pastUpgrades.1.2:
+        ["0x2E38cD55163137483E30580Cb468C2dFf1d85077"]
      values.$pastUpgrades.1.1:
-        ["0x2E38cD55163137483E30580Cb468C2dFf1d85077"]
+        "0xb83824c7eb1e87bd12222d98cf1cbff317b0853ba1e5beda1e3e3d8a4cfd1b24"
      values.$pastUpgrades.0.2:
+        ["0xbc1ea504fC54D078514eFCCA1F6860B5219B6BC3"]
      values.$pastUpgrades.0.1:
-        ["0xbc1ea504fC54D078514eFCCA1F6860B5219B6BC3"]
+        "0x9946be78d6c6d19dd1c6c7134a8fac27e76d32cad36dae2398d28fe6ff838f10"
    }
```

Generated with discovered.json: 0x18eab5e0edbd82da09278ec51331826d7e85fac7

# Diff at Sat, 19 Oct 2024 06:43:36 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@493c96785a6a32c6417182bb9548d3a990297dbe block: 20878362
- current block number: 20997898

## Description

Expected Oct 28.

Queued tx for new rollup types (targeting zkEVM and validiums) implementing the [Polygon zkEVM servicing upgrade](https://polygon.technology/blog/polygon-zkevm-servicing-update-coming-to-mainnet-beta). Also queued are the according upgrades to the PolygonRollupManager and GlobalExitRoot as described in the above post.

TLDR of what this will change:
* add rollback functionality to all managed chains
* new local 'polygoncdkprojectcontract.admin' role for each project that can call `updateRollupByRollupAdmin(existing_rolluptype)` and `rollbackBatches()` for their respective project

## Watched changes

```diff
    contract Timelock (0xEf1462451C30Ea7aD8555386226059Fe837CA4EF) {
    +++ description: None
      values.scheduledTransactionsDecoded.18:
+        {"target":"0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2","value":"0","function":"addNewRollupType","inputs":{"consensusImplementation":"0x427113ae6F319BfFb4459bfF96eb8B6BDe1A127F","verifier":"0x9B9671dB83CfcB4508bF361942488C5cA2b1286D","forkID":12,"rollupCompatibilityID":0,"genesis":"0xe3a7d8bae497945ba8ddc51c69564f60ad4c1a990b9c7bdbd27f7929bfa8f272","description":"Type: Validium, Version: Banana , genesis: /ipfs/QmUXnRoPbUmZuEZCGyiHjEsoNcFVu3hLtSvhpnfBS2mAYU"},"predecessor":"0x0000000000000000000000000000000000000000000000000000000000000000","delay":"864000"}
      values.scheduledTransactionsDecoded.17:
+        {"target":"0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2","value":"0","function":"addNewRollupType","inputs":{"consensusImplementation":"0x7253F329302b1b5E774Ac641EA3743E9E3244f2E","verifier":"0x9B9671dB83CfcB4508bF361942488C5cA2b1286D","forkID":12,"rollupCompatibilityID":0,"genesis":"0xe3a7d8bae497945ba8ddc51c69564f60ad4c1a990b9c7bdbd27f7929bfa8f272","description":"Type: zkEVM, Version: Banana , genesis: /ipfs/QmUXnRoPbUmZuEZCGyiHjEsoNcFVu3hLtSvhpnfBS2mAYU"},"predecessor":"0x0000000000000000000000000000000000000000000000000000000000000000","delay":"864000"}
      values.scheduledTransactionsDecoded.16:
+        {"target":"0x0F99738B2Fc14D77308337f3e2596b63aE7BCC4A","value":"0","function":"upgrade","inputs":{"proxy":"0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2","implementation":"0x103388f5661d224F4aFb555C7E4a8FB52d0b752d"},"predecessor":"0x0000000000000000000000000000000000000000000000000000000000000000","delay":"864000"}
      values.scheduledTransactionsDecoded.15:
+        {"target":"0x0F99738B2Fc14D77308337f3e2596b63aE7BCC4A","value":"0","function":"upgradeAndCall","inputs":{"proxy":"0x580bda1e7A0CFAe92Fa7F6c20A3794F169CE3CFb","implementation":"0x9Bdda421219900454E94e01d641fE64c60D8f4C8","data":{}},"predecessor":"0x0000000000000000000000000000000000000000000000000000000000000000","delay":"864000"}
    }
```

Generated with discovered.json: 0x0803fbee8125f1ef849384fb04386a798a92cf21

# Diff at Mon, 14 Oct 2024 10:55:40 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1afc77ff111ceb0970e7d09efcc7b2f376b0c281 block: 20878362
- current block number: 20878362

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20878362 (main branch discovery), not current.

```diff
    contract Permit2 (0x000000000022D473030F116dDEE9F6B43aC78BA3) {
    +++ description: None
      sourceHashes:
+        ["0x84beffbcb4624fb74fab61c80beeb566023a939418284a8f44357b71cd40b63b"]
    }
```

```diff
    contract SharedProxyAdmin (0x0F99738B2Fc14D77308337f3e2596b63aE7BCC4A) {
    +++ description: None
      receivedPermissions:
-        [{"permission":"upgrade","target":"0x2a3DD3EB832aF982ec71669E178424b10Dca2EDe"},{"permission":"upgrade","target":"0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2"},{"permission":"upgrade","target":"0x580bda1e7A0CFAe92Fa7F6c20A3794F169CE3CFb"}]
      template:
+        "global/ProxyAdmin"
      sourceHashes:
+        ["0xae641c7d7a83bba7fa913b9544f946dc23ca0527c2f4abb9c6a3496f49375218"]
      directlyReceivedPermissions:
+        [{"permission":"upgrade","target":"0x2a3DD3EB832aF982ec71669E178424b10Dca2EDe"},{"permission":"upgrade","target":"0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2"},{"permission":"upgrade","target":"0x580bda1e7A0CFAe92Fa7F6c20A3794F169CE3CFb"}]
    }
```

```diff
    contract RollupManagerAdminMultisig (0x242daE44F5d8fb54B198D03a94dA45B5a4413e21) {
    +++ description: None
      sourceHashes:
+        ["0x81a7349eebb98ac33b0bc6842e3cb258034a8f2a4ba004570bb8e2e25947f9ff","0xd42bbf9f7dcd3720a7fc6bdc6edfdfae8800a37d6dd4decfa0ef6ca4a2e88940"]
    }
```

```diff
    contract Bridge (0x2a3DD3EB832aF982ec71669E178424b10Dca2EDe) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x0F99738B2Fc14D77308337f3e2596b63aE7BCC4A"
+        "0xEf1462451C30Ea7aD8555386226059Fe837CA4EF"
      issuedPermissions.0.via.0:
+        {"address":"0x0F99738B2Fc14D77308337f3e2596b63aE7BCC4A","delay":0}
      sourceHashes:
+        ["0x3f8d1d2461c05779ca5de685fd391f6a4c07e91953373effd46d11f72b025dc3","0x058729592838a622eff2eb394278ff5d53065feeca04c216a67e973178ac1ac2"]
    }
```

```diff
    contract SecurityCouncil (0x37c58Dfa7BF0A165C5AAEdDf3e2EdB475ac6Dcb6) {
    +++ description: None
      sourceHashes:
+        ["0x81a7349eebb98ac33b0bc6842e3cb258034a8f2a4ba004570bb8e2e25947f9ff","0xd42bbf9f7dcd3720a7fc6bdc6edfdfae8800a37d6dd4decfa0ef6ca4a2e88940"]
    }
```

```diff
    contract POL (0x455e53CBB86018Ac2B8092FdCd39d8444aFFC3F6) {
    +++ description: None
      sourceHashes:
+        ["0xb814773e3a4cf3d1dd288afdeed9cbdc361edda62de8fa393290e5be836ffae0"]
    }
```

```diff
    contract PolygonRollupManager (0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x0F99738B2Fc14D77308337f3e2596b63aE7BCC4A"
+        "0xEf1462451C30Ea7aD8555386226059Fe837CA4EF"
      issuedPermissions.0.via.0:
+        {"address":"0x0F99738B2Fc14D77308337f3e2596b63aE7BCC4A","delay":0}
      sourceHashes:
+        ["0x6d1bbfb1ed7d88848e594dc11366fbed3d53c5a507022c04dbeea72ef549cd6a","0x0457cd9bbeaa5adb6ffff74ca828707e8797cdd25b13768eb37dcc7a120ce3c6"]
    }
```

```diff
    contract GlobalExitRootV2 (0x580bda1e7A0CFAe92Fa7F6c20A3794F169CE3CFb) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x0F99738B2Fc14D77308337f3e2596b63aE7BCC4A"
+        "0xEf1462451C30Ea7aD8555386226059Fe837CA4EF"
      issuedPermissions.0.via.0:
+        {"address":"0x0F99738B2Fc14D77308337f3e2596b63aE7BCC4A","delay":0}
      sourceHashes:
+        ["0x6d1bbfb1ed7d88848e594dc11366fbed3d53c5a507022c04dbeea72ef549cd6a","0x23dd296130348943833ff04807c22fab6b51e87b4d0d59ba0e35e802e3e1f079"]
    }
```

```diff
    contract CreateRollupMultisig (0xC74eFc7fdb3BeC9c6930E91FFDF761b160dF79dB) {
    +++ description: None
      sourceHashes:
+        ["0x81a7349eebb98ac33b0bc6842e3cb258034a8f2a4ba004570bb8e2e25947f9ff","0xd42bbf9f7dcd3720a7fc6bdc6edfdfae8800a37d6dd4decfa0ef6ca4a2e88940"]
    }
```

```diff
    contract Timelock (0xEf1462451C30Ea7aD8555386226059Fe837CA4EF) {
    +++ description: None
      sourceHashes:
+        ["0x7de9e4256607fc137552230010585d417c818730e4f56e29065699cdb97f9cf1"]
      receivedPermissions:
+        [{"permission":"upgrade","target":"0x2a3DD3EB832aF982ec71669E178424b10Dca2EDe","via":[{"address":"0x0F99738B2Fc14D77308337f3e2596b63aE7BCC4A"}]},{"permission":"upgrade","target":"0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2","via":[{"address":"0x0F99738B2Fc14D77308337f3e2596b63aE7BCC4A"}]},{"permission":"upgrade","target":"0x580bda1e7A0CFAe92Fa7F6c20A3794F169CE3CFb","via":[{"address":"0x0F99738B2Fc14D77308337f3e2596b63aE7BCC4A"}]}]
      directlyReceivedPermissions:
+        [{"permission":"act","target":"0x0F99738B2Fc14D77308337f3e2596b63aE7BCC4A"}]
    }
```

Generated with discovered.json: 0x3670b5544c223abe3dba83ca8052cf1964c1d922

# Diff at Wed, 02 Oct 2024 14:18:36 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@d101c705b5f4fd0b3af2e251678b85e1005b31d8 block: 20871594
- current block number: 20878362

## Description

Config related.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20871594 (main branch discovery), not current.

```diff
    contract Bridge (0x2a3DD3EB832aF982ec71669E178424b10Dca2EDe) {
    +++ description: None
      values.$pastUpgrades:
+        [["2023-03-24T10:18:47.000Z",["0x5ac4182A1dd41AeEf465E40B82fd326BF66AB82C"]],["2024-02-13T11:00:59.000Z",["0x0FeB850B183C57534b56b7d56520133C8f9BDB65"]]]
    }
```

```diff
    contract PolygonRollupManager (0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2) {
    +++ description: None
      values.$pastUpgrades:
+        [["2023-03-24T10:19:23.000Z",["0xe262Ea2782e2e8dbFe354048c3B5d6DE9603EfEF"]],["2023-09-20T08:30:35.000Z",["0x301442aA888701c8B86727d42F3C55Fb0dd9eF7F"]],["2023-11-09T09:22:59.000Z",["0xb1585916487AcEdD99952086f2950763D253b923"]],["2024-02-13T11:00:59.000Z",["0x3b82Da772c825283d85d5d6717A77C6Ff582053b"]]]
    }
```

```diff
    contract GlobalExitRootV2 (0x580bda1e7A0CFAe92Fa7F6c20A3794F169CE3CFb) {
    +++ description: None
      values.$pastUpgrades:
+        [["2023-03-24T10:19:11.000Z",["0xbc1ea504fC54D078514eFCCA1F6860B5219B6BC3"]],["2024-02-13T11:00:59.000Z",["0x2E38cD55163137483E30580Cb468C2dFf1d85077"]]]
    }
```

Generated with discovered.json: 0xa05eff9760fe0c1b81a11c3826d3a0970b9e9ebf

# Diff at Tue, 01 Oct 2024 15:39:50 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@974999225bba0722b5e81edd4c1b80928d80ef33 block: 20792084
- current block number: 20871594

## Description

New RollupType with FflonkVerifier_11 and a PolygonZkEvm code-identical consensus implementation is added. PolygonZkEvm is upgraded to the new type. See last update for context.

## Watched changes

```diff
    contract PolygonRollupManager (0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2) {
    +++ description: None
+++ description: Maps rollup contracts and their verifier. Any change should be picked up also by the specific rollup config, unless it's a new rollup. [rollupContract, chainID, verifier, rollupTypeID]
+++ severity: MEDIUM
      values.rollupsData.0.3:
-        3
+        5
+++ description: Maps rollup contracts and their verifier. Any change should be picked up also by the specific rollup config, unless it's a new rollup. [rollupContract, chainID, verifier, rollupTypeID]
+++ severity: MEDIUM
      values.rollupsData.0.2:
-        "0x0775e11309d75aA6b0967917fB0213C5673eDf81"
+        "0xc521580cd8586Cc688A7430F9DcE0f6A803F2883"
      values.rollupTypeCount:
-        4
+        5
+++ description: struct consensusImplementation, verifier, forkID, rollupCompatibilityID, bool obsolete, genesisBlock
      values.rollupTypes.4:
+        ["0x2650a9a4fC64f63F573EF0F405064EF54BC46f71","0xc521580cd8586Cc688A7430F9DcE0f6A803F2883"]
    }
```

Generated with discovered.json: 0x6761afe95cc65b2d57facf739411497e0c79d266

# Diff at Fri, 20 Sep 2024 13:25:57 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@c1f8c9b7beabeba1a847fb9e1064a356593cfe16 block: 20756803
- current block number: 20792084

## Description

Queue tx for adding a new rollupType. This is one of two steps to upgrade existing rollups, the second being to call `updateRollup(rollupTypeId,...)` on the RollupManager. The new consensusImplementation is identical to the one used by Polygon zkEVM, the new verifier has a two-constants diff. This rollupType is theoretically compatible with both current type 3 and current type 4 rollups. 
See [this changelog](https://github.com/0xPolygonHermez/zkevm-contracts/releases/tag/v7.0.0-fork.10-fork.11) for an overview of changes.


## Watched changes

```diff
    contract Timelock (0xEf1462451C30Ea7aD8555386226059Fe837CA4EF) {
    +++ description: None
      values.scheduledTransactionsDecoded.14:
+        {"target":"0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2","value":"0","function":"addNewRollupType","inputs":{"consensusImplementation":"0x2650a9a4fC64f63F573EF0F405064EF54BC46f71","verifier":"0xc521580cd8586Cc688A7430F9DcE0f6A803F2883","forkID":11,"rollupCompatibilityID":0,"genesis":"0xe3a7d8bae497945ba8ddc51c69564f60ad4c1a990b9c7bdbd27f7929bfa8f272","description":"Type: zkEVM, Version: eggfruit N=25 , genesis: /ipfs/QmUXnRoPbUmZuEZCGyiHjEsoNcFVu3hLtSvhpnfBS2mAYU"},"predecessor":"0x0000000000000000000000000000000000000000000000000000000000000000","delay":"864000"}
    }
```

Generated with discovered.json: 0xba373ac533983b9f92ed90035a92df2f631da3df

# Diff at Sun, 15 Sep 2024 15:07:29 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@ca08843b12ed576cbcc139ad58ca045f72d96ab5 block: 20726217
- current block number: 20756803

## Description

haust.network is verifying batches. (No launch announcement from them yet)

## Watched changes

```diff
    contract PolygonRollupManager (0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2) {
    +++ description: None
+++ description: Checks if lastVerifiedBatch for a rollupID is greater than one. Works like a trigger for projects becoming active after deployment. Mind that index here is rollupID-1.
      values.isVerifyingBatches.10.0:
-        false
+        true
    }
```

Generated with discovered.json: 0x3c4c51c3c32febb0ab92e52ac6d22d7110040697

# Diff at Wed, 11 Sep 2024 08:36:30 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@407590ebfbad0b4f799badc3ad5fce90a7eaed11 block: 20661845
- current block number: 20726217

## Description

New Validium deployed: https://haust.network/

Not posting batches yet.

Current rollupIDs:
    1: pol zkEVM 1101 (type3) 🚀 ✔️
	2: astar 3776 (type4) 🚀 ✔️
	3: OkX X Layer 196 (type4) 🚀 ✔️
	4: OEV network chainid 4913 (type4) X (pivoted to orbit)
	5: gptprotocol.org 1511670449 (type4) 🚀 ✔️
	6: witnesschain 1702448187 (type4) 🚀 ✔️
	7: prism (by prism bridge?) 994873017 (type4) 🚀
	8: pay network (wirex) 31415 (type4) 🚀 ✔️
	9: silicon-zk 511252203 (type4) 🚀
   10: silicon-zk 2355 (type4) 🚀
   11: haust.network 999 (type4)

## Watched changes

```diff
    contract PolygonRollupManager (0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2) {
    +++ description: None
+++ description: Checks if lastVerifiedBatch for a rollupID is greater than one. Works like a trigger for projects becoming active after deployment. Mind that index here is rollupID-1.
      values.isVerifyingBatches.10:
+        [false]
      values.rollupCount:
-        10
+        11
+++ description: Maps rollup contracts and their verifier. Any change should be picked up also by the specific rollup config, unless it's a new rollup. [rollupContract, chainID, verifier, rollupTypeID]
+++ severity: MEDIUM
      values.rollupsData.10:
+        ["0xB234F18738d9531CAD6ae6d9A587d09fe200272C",999,"0x0775e11309d75aA6b0967917fB0213C5673eDf81",4]
    }
```

Generated with discovered.json: 0x152fbc09283611d598b5ed010ea0fabefbef82d7

# Diff at Mon, 02 Sep 2024 08:59:16 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@8fcb30f6c613b5454aa9ecdec05a118442e9dc7b block: 20585049
- current block number: 20661845

## Description

Scheduled tx is executed giving a yet unknown Multisig the CREATE_ROLLUP role. This role can add new rollups that must use an existing rollup type. So far the role was held only by the RollupManagerAdminMultisig. As this permission does not affect existing chains it is not added to the shared template.

## Watched changes

```diff
    contract PolygonRollupManager (0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2) {
    +++ description: None
      values.accessControl.CREATE_ROLLUP.members.1:
+        "0xC74eFc7fdb3BeC9c6930E91FFDF761b160dF79dB"
    }
```

```diff
+   Status: CREATED
    contract CreateRollupMultisig (0xC74eFc7fdb3BeC9c6930E91FFDF761b160dF79dB)
    +++ description: None
```

## Source code changes

```diff
.../.flat/CreateRollupMultisig/GnosisSafe.sol      | 952 +++++++++++++++++++++
 .../CreateRollupMultisig/GnosisSafeProxy.p.sol     |  34 +
 2 files changed, 986 insertions(+)
```

Generated with discovered.json: 0xd2495f646a0033a5e87873cdc7867242321923e3

# Diff at Fri, 30 Aug 2024 07:59:23 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@6c1bd1f41fadf5f2cb1c1805b5a2c6138a3ed35a block: 20585049
- current block number: 20585049

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20585049 (main branch discovery), not current.

```diff
    contract SharedProxyAdmin (0x0F99738B2Fc14D77308337f3e2596b63aE7BCC4A) {
    +++ description: None
      receivedPermissions.2.via:
-        []
      receivedPermissions.1.via:
-        []
      receivedPermissions.0.via:
-        []
    }
```

Generated with discovered.json: 0x203942c049270f82399f06fe7b509040c8ff746d

# Diff at Fri, 23 Aug 2024 09:55:20 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@67597c7d6c810bc726594446890178150240711e block: 20585049
- current block number: 20585049

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20585049 (main branch discovery), not current.

```diff
    contract Bridge (0x2a3DD3EB832aF982ec71669E178424b10Dca2EDe) {
    +++ description: None
      values.$upgradeCount:
+        2
    }
```

```diff
    contract PolygonRollupManager (0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2) {
    +++ description: None
      values.$upgradeCount:
+        4
    }
```

```diff
    contract GlobalExitRootV2 (0x580bda1e7A0CFAe92Fa7F6c20A3794F169CE3CFb) {
    +++ description: None
      values.$upgradeCount:
+        2
    }
```

Generated with discovered.json: 0x57b2cd522b7dcd76f03ba60f609d7427e0fda2c5

# Diff at Thu, 22 Aug 2024 15:30:17 GMT:

- author: Radina Talanova (<nt.radina@gmail.com>)
- comparing to: main@08f0832a5dea29e7c493cd50bda4bf1729aa03ae block: 20577574
- current block number: 20585049

## Description

Config changes related to trust permissions. A project (Silicon zkEVM, https://x.com/0xSilicon) started verifying batches, no announcement yet.

## Watched changes

```diff
    contract PolygonRollupManager (0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2) {
    +++ description: None
+++ description: Checks if lastVerifiedBatch for a rollupID is greater than one. Works like a trigger for projects becoming active after deployment. Mind that index here is rollupID-1.
      values.isVerifyingBatches.9.0:
-        false
+        true
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20577574 (main branch discovery), not current.

```diff
    contract SharedProxyAdmin (0x0F99738B2Fc14D77308337f3e2596b63aE7BCC4A) {
    +++ description: None
      assignedPermissions:
-        {"upgrade":["0x2a3DD3EB832aF982ec71669E178424b10Dca2EDe","0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2","0x580bda1e7A0CFAe92Fa7F6c20A3794F169CE3CFb"]}
      receivedPermissions:
+        [{"permission":"upgrade","target":"0x2a3DD3EB832aF982ec71669E178424b10Dca2EDe","via":[]},{"permission":"upgrade","target":"0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2","via":[]},{"permission":"upgrade","target":"0x580bda1e7A0CFAe92Fa7F6c20A3794F169CE3CFb","via":[]}]
    }
```

```diff
    contract Bridge (0x2a3DD3EB832aF982ec71669E178424b10Dca2EDe) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x0F99738B2Fc14D77308337f3e2596b63aE7BCC4A","via":[]}]
    }
```

```diff
    contract PolygonRollupManager (0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x0F99738B2Fc14D77308337f3e2596b63aE7BCC4A","via":[]}]
    }
```

```diff
    contract GlobalExitRootV2 (0x580bda1e7A0CFAe92Fa7F6c20A3794F169CE3CFb) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x0F99738B2Fc14D77308337f3e2596b63aE7BCC4A","via":[]}]
    }
```

Generated with discovered.json: 0x71fee6329a04ca0a77fd7c6f70ad59ad5e7df866

# Diff at Wed, 21 Aug 2024 14:24:32 GMT:

- author: Radina Talanova (<nt.radina@gmail.com>)
- comparing to: main@9ff9ee2b2fd37e2cdd4a4bcebdcefcb5e61b1e6c block: 20532454
- current block number: 20577574

## Description

New rollup was added (Silicon zkEVM). Not verifying batches yet.

## Watched changes

```diff
    contract PolygonRollupManager (0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2) {
    +++ description: None
+++ description: Checks if lastVerifiedBatch for a rollupID is greater than one. Works like a trigger for projects becoming active after deployment. Mind that index here is rollupID-1.
      values.isVerifyingBatches.9:
+        [false]
      values.rollupCount:
-        9
+        10
+++ description: Maps rollup contracts and their verifier. Any change should be picked up also by the specific rollup config, unless it's a new rollup. [rollupContract, chainID, verifier, rollupTypeID]
+++ severity: MEDIUM
      values.rollupsData.9:
+        ["0x419dcD0f72ebAFd3524b65a97ac96699C7fBebdB",2355,"0x0775e11309d75aA6b0967917fB0213C5673eDf81",4]
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20532454 (main branch discovery), not current.

```diff
    contract SharedProxyAdmin (0x0F99738B2Fc14D77308337f3e2596b63aE7BCC4A) {
    +++ description: None
      receivedPermissions:
-        [{"permission":"upgrade","target":"0x2a3DD3EB832aF982ec71669E178424b10Dca2EDe","via":[]},{"permission":"upgrade","target":"0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2","via":[]},{"permission":"upgrade","target":"0x580bda1e7A0CFAe92Fa7F6c20A3794F169CE3CFb","via":[]}]
      assignedPermissions:
+        {"upgrade":["0x2a3DD3EB832aF982ec71669E178424b10Dca2EDe","0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2","0x580bda1e7A0CFAe92Fa7F6c20A3794F169CE3CFb"]}
    }
```

```diff
    contract Bridge (0x2a3DD3EB832aF982ec71669E178424b10Dca2EDe) {
    +++ description: None
      issuedPermissions:
-        [{"permission":"upgrade","target":"0x0F99738B2Fc14D77308337f3e2596b63aE7BCC4A","via":[]}]
    }
```

```diff
    contract PolygonRollupManager (0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2) {
    +++ description: None
      issuedPermissions:
-        [{"permission":"upgrade","target":"0x0F99738B2Fc14D77308337f3e2596b63aE7BCC4A","via":[]}]
    }
```

```diff
    contract GlobalExitRootV2 (0x580bda1e7A0CFAe92Fa7F6c20A3794F169CE3CFb) {
    +++ description: None
      issuedPermissions:
-        [{"permission":"upgrade","target":"0x0F99738B2Fc14D77308337f3e2596b63aE7BCC4A","via":[]}]
    }
```

Generated with discovered.json: 0x64b8ffdf55ed2228b4d89471df908c120c09de3a

# Diff at Wed, 21 Aug 2024 10:05:42 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@2f6dde3357bf5d79196b6e94f79d853a6c4ec72b block: 20532454
- current block number: 20532454

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20532454 (main branch discovery), not current.

```diff
    contract SharedProxyAdmin (0x0F99738B2Fc14D77308337f3e2596b63aE7BCC4A) {
    +++ description: None
      assignedPermissions:
-        {"upgrade":["0x2a3DD3EB832aF982ec71669E178424b10Dca2EDe","0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2","0x580bda1e7A0CFAe92Fa7F6c20A3794F169CE3CFb"]}
      receivedPermissions:
+        [{"permission":"upgrade","target":"0x2a3DD3EB832aF982ec71669E178424b10Dca2EDe","via":[]},{"permission":"upgrade","target":"0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2","via":[]},{"permission":"upgrade","target":"0x580bda1e7A0CFAe92Fa7F6c20A3794F169CE3CFb","via":[]}]
    }
```

```diff
    contract Bridge (0x2a3DD3EB832aF982ec71669E178424b10Dca2EDe) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x0F99738B2Fc14D77308337f3e2596b63aE7BCC4A","via":[]}]
    }
```

```diff
    contract PolygonRollupManager (0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x0F99738B2Fc14D77308337f3e2596b63aE7BCC4A","via":[]}]
    }
```

```diff
    contract GlobalExitRootV2 (0x580bda1e7A0CFAe92Fa7F6c20A3794F169CE3CFb) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x0F99738B2Fc14D77308337f3e2596b63aE7BCC4A","via":[]}]
    }
```

Generated with discovered.json: 0xcb4ecd76bd24c85fce589f137c6b5371214bffa7

# Diff at Thu, 15 Aug 2024 07:11:51 GMT:

- author: Radina Talanova (<nt.radina@gmail.com>)
- comparing to: main@9a07aead4b3726cc622f66fe9a15e06e63af7acd block: 20512764
- current block number: 20532454

## Description

The batches for an unknown project are now being verified.

## Watched changes

```diff
    contract PolygonRollupManager (0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2) {
    +++ description: None
+++ description: Checks if lastVerifiedBatch for a rollupID is greater than one. Works like a trigger for projects becoming active after deployment. Mind that index here is rollupID-1.
      values.isVerifyingBatches.8.0:
-        false
+        true
    }
```

Generated with discovered.json: 0xe954f2fce6af87cb2a645e83eb913f58270872ee

# Diff at Mon, 12 Aug 2024 13:15:54 GMT:

- author: Radina Talanova (<nt.radina@gmail.com>)
- comparing to: main@bafa261ae877bba9966845f4d250f5cbb9d4f6d2 block: 20324826
- current block number: 20512764

## Description

New rollup is added, but not active yet (not verifying batches).

Also a new scheduled transaction that will give the role of CREATE_ROLLUP to a new address.

## Watched changes

```diff
    contract PolygonRollupManager (0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2) {
    +++ description: None
+++ description: Checks if lastVerifiedBatch for a rollupID is greater than one. Works like a trigger for projects becoming active after deployment. Mind that index here is rollupID-1.
      values.isVerifyingBatches.8:
+        [false]
      values.rollupCount:
-        8
+        9
+++ description: Maps rollup contracts and their verifier. Any change should be picked up also by the specific rollup config, unless it's a new rollup. [rollupContract, chainID, verifier, rollupTypeID]
+++ severity: MEDIUM
      values.rollupsData.8:
+        ["0xA87df42CD53E998b3A610B8bCe3719871b0bb940",511252203,"0x0775e11309d75aA6b0967917fB0213C5673eDf81",4]
    }
```

```diff
    contract Timelock (0xEf1462451C30Ea7aD8555386226059Fe837CA4EF) {
    +++ description: None
      values.scheduledTransactionsDecoded.13:
+        {"target":"0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2","value":"0","function":"grantRole","inputs":{"role":"0xa0fab074aba36a6fa69f1a83ee86e5abfb8433966eb57efb13dc2fc2f24ddd08","account":"0xC74eFc7fdb3BeC9c6930E91FFDF761b160dF79dB"},"predecessor":"0x0000000000000000000000000000000000000000000000000000000000000000","delay":"864000"}
    }
```

Generated with discovered.json: 0x09a28c6289220b6632a4be28b4f979f629f7ee52

# Diff at Fri, 09 Aug 2024 12:02:08 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bf40aa32f030fd312056ca0ef198c8550467d1d7 block: 20324826
- current block number: 20324826

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20324826 (main branch discovery), not current.

```diff
    contract SharedProxyAdmin (0x0F99738B2Fc14D77308337f3e2596b63aE7BCC4A) {
    +++ description: None
      assignedPermissions.upgrade.2:
-        "0x2a3DD3EB832aF982ec71669E178424b10Dca2EDe"
+        "0x580bda1e7A0CFAe92Fa7F6c20A3794F169CE3CFb"
      assignedPermissions.upgrade.1:
-        "0x580bda1e7A0CFAe92Fa7F6c20A3794F169CE3CFb"
+        "0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2"
      assignedPermissions.upgrade.0:
-        "0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2"
+        "0x2a3DD3EB832aF982ec71669E178424b10Dca2EDe"
    }
```

Generated with discovered.json: 0xd113d4bcf351ac5e28a0810501f10748689bd5ff

# Diff at Fri, 09 Aug 2024 10:12:06 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f0da1d0aab7bc6b3b5e54e7e93480bd98e57035 block: 20324826
- current block number: 20324826

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20324826 (main branch discovery), not current.

```diff
    contract SharedProxyAdmin (0x0F99738B2Fc14D77308337f3e2596b63aE7BCC4A) {
    +++ description: None
      assignedPermissions.admin:
-        ["0x2a3DD3EB832aF982ec71669E178424b10Dca2EDe","0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2","0x580bda1e7A0CFAe92Fa7F6c20A3794F169CE3CFb"]
      assignedPermissions.upgrade:
+        ["0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2","0x580bda1e7A0CFAe92Fa7F6c20A3794F169CE3CFb","0x2a3DD3EB832aF982ec71669E178424b10Dca2EDe"]
    }
```

```diff
    contract RollupManagerAdminMultisig (0x242daE44F5d8fb54B198D03a94dA45B5a4413e21) {
    +++ description: None
      values.$multisigThreshold:
-        "2 of 3 (67%)"
      values.getOwners:
-        ["0x4c1665d6651ecEfa59B9B3041951608468b18891","0xA0B02B28920812324f1cC3255bd8840867d3f227","0xEad77b01ea770839F7f576Cd1516Ff6A298d9dB2"]
      values.getThreshold:
-        2
      values.$members:
+        ["0x4c1665d6651ecEfa59B9B3041951608468b18891","0xA0B02B28920812324f1cC3255bd8840867d3f227","0xEad77b01ea770839F7f576Cd1516Ff6A298d9dB2"]
      values.$threshold:
+        2
      values.multisigThreshold:
+        "2 of 3 (67%)"
    }
```

```diff
    contract SecurityCouncil (0x37c58Dfa7BF0A165C5AAEdDf3e2EdB475ac6Dcb6) {
    +++ description: None
      values.$multisigThreshold:
-        "6 of 8 (75%)"
      values.getOwners:
-        ["0xFe45baf0F18c207152A807c1b05926583CFE2e4b","0xaF46a0ddf80DFFB49C87656625E65A37499B261D","0xBDc235cC9d6Baa641c5ae306bc83962475A5FEFf","0x4c1665d6651ecEfa59B9B3041951608468b18891","0x3ab9f4b964eE665F7CDf1d65f1cEEc6196B0D622","0x49c15936864690bCd6af0ecaca8E874adFF30E86","0x9F7dfAb2222A473284205cdDF08a677726d786A0","0x21887c89368bf918346c62460e0c339113801C28"]
      values.getThreshold:
-        6
      values.$members:
+        ["0xFe45baf0F18c207152A807c1b05926583CFE2e4b","0xaF46a0ddf80DFFB49C87656625E65A37499B261D","0xBDc235cC9d6Baa641c5ae306bc83962475A5FEFf","0x4c1665d6651ecEfa59B9B3041951608468b18891","0x3ab9f4b964eE665F7CDf1d65f1cEEc6196B0D622","0x49c15936864690bCd6af0ecaca8E874adFF30E86","0x9F7dfAb2222A473284205cdDF08a677726d786A0","0x21887c89368bf918346c62460e0c339113801C28"]
      values.$threshold:
+        6
      values.multisigThreshold:
+        "6 of 8 (75%)"
    }
```

Generated with discovered.json: 0x25b3c5723fd7af1867dd9877734aee9f8b274646

# Diff at Tue, 30 Jul 2024 11:14:28 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@b2b6471ff62871f4956541f42ec025c356c08f7e block: 20324826
- current block number: 20324826

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20324826 (main branch discovery), not current.

```diff
    contract PolygonRollupManager (0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2) {
    +++ description: None
      fieldMeta:
+        {"rollupsData":{"severity":"MEDIUM","description":"Maps rollup contracts and their verifier. Any change should be picked up also by the specific rollup config, unless it's a new rollup. [rollupContract, chainID, verifier, rollupTypeID]"},"rollupTypes":{"description":"struct consensusImplementation, verifier, forkID, rollupCompatibilityID, bool obsolete, genesisBlock"},"isVerifyingBatches":{"description":"Checks if lastVerifiedBatch for a rollupID is greater than one. Works like a trigger for projects becoming active after deployment. Mind that index here is rollupID-1."}}
    }
```

Generated with discovered.json: 0x45e85d1936f082cff5ce1c0e9eecb83a443e9505

# Diff at Tue, 23 Jul 2024 14:45:52 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@e5367f5480f561f930143fbbdedbb92263f4a41f block: 20324826
- current block number: 20324826

## Description

Decode scheduled transactions.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20324826 (main branch discovery), not current.

```diff
    contract Timelock (0xEf1462451C30Ea7aD8555386226059Fe837CA4EF) {
    +++ description: None
      values.scheduledTransactions:
-        [{"id":"0xb50bcda49f13b2aa0ddc72fa32eec2b6ea4cd8af5a9823762150c7d94a210476","target":"0x0F99738B2Fc14D77308337f3e2596b63aE7BCC4A","value":0,"data":"0x9623609d0000000000000000000000005132a183e9f3cb7c848b0aac5ae0c4f0491b7ab2000000000000000000000000301442aa888701c8b86727d42f3c55fb0dd9ef7f000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000647240f9af0000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000001176322e302e302d5243312d666f726b2e3500000000000000000000000000000000000000000000000000000000000000000000000000000000000000","delay":864000},{"id":"0x99979392a952eef62666ac91808b1c6b3b35a34092712ab965dbb85ac0b0a702","target":"0x0F99738B2Fc14D77308337f3e2596b63aE7BCC4A","value":0,"data":"0x9623609d0000000000000000000000005132a183e9f3cb7c848b0aac5ae0c4f0491b7ab2000000000000000000000000b1585916487acedd99952086f2950763d253b923000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000647240f9af0000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000001076332e302e302d696e636162657272790000000000000000000000000000000000000000000000000000000000000000000000000000000000000000","delay":864000},{"id":"0xff337aa79b453bd0ae64d7668a9ac83cdf4666bde0977afdf04462c4e14978c8","target":"0x0F99738B2Fc14D77308337f3e2596b63aE7BCC4A","value":0,"data":"0x99a88ec4000000000000000000000000580bda1e7a0cfae92fa7f6c20a3794f169ce3cfb0000000000000000000000002e38cd55163137483e30580cb468c2dff1d85077","delay":864000},{"id":"0xff337aa79b453bd0ae64d7668a9ac83cdf4666bde0977afdf04462c4e14978c8","target":"0x0F99738B2Fc14D77308337f3e2596b63aE7BCC4A","value":0,"data":"0x99a88ec40000000000000000000000002a3dd3eb832af982ec71669e178424b10dca2ede0000000000000000000000000feb850b183c57534b56b7d56520133c8f9bdb65","delay":864000},{"id":"0xff337aa79b453bd0ae64d7668a9ac83cdf4666bde0977afdf04462c4e14978c8","target":"0x0F99738B2Fc14D77308337f3e2596b63aE7BCC4A","value":0,"data":"0x9623609d0000000000000000000000005132a183e9f3cb7c848b0aac5ae0c4f0491b7ab20000000000000000000000003b82da772c825283d85d5d6717a77c6ff582053b000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000001440645af090000000000000000000000006329fe417621925c81c16f9f9a18c203c21af7ab00000000000000000000000000000000000000000000000000000000000697800000000000000000000000000000000000000000000000000000000000069780000000000000000000000000242dae44f5d8fb54b198d03a94da45b5a4413e21000000000000000000000000ef1462451c30ea7ad8555386226059fe837ca4ef00000000000000000000000037c58dfa7bf0a165c5aaeddf3e2edb475ac6dcb6000000000000000000000000519e42c24163192dca44cd3fbdcebf6be91309870000000000000000000000001c3a3da552b8662cd69538356b1e7c2e9cc1ebd80000000000000000000000000000000000000000000000000000000000000007000000000000000000000000000000000000000000000000000000000000044d00000000000000000000000000000000000000000000000000000000","delay":864000},{"id":"0x84be1445c72b5d8056fe3f1a482e08a6ef1a74fdc78f85dbb16f1d5980f4f16a","target":"0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2","value":0,"data":"0xf34eb8eb0000000000000000000000009cf80f7eb1c76ec5ae7a88b417e373449b73ac300000000000000000000000001c3a3da552b8662cd69538356b1e7c2e9cc1ebd800000000000000000000000000000000000000000000000000000000000000070000000000000000000000000000000000000000000000000000000000000000e3a7d8bae497945ba8ddc51c69564f60ad4c1a990b9c7bdbd27f7929bfa8f27200000000000000000000000000000000000000000000000000000000000000c0000000000000000000000000000000000000000000000000000000000000005d547970653a2056616c696469756d2c2056657273696f6e3a206574726f672c2067656e657369733a202f697066732f516d55586e526f5062556d5a75455a43477969486a45736f4e6346567533684c74537668706e664253326d415955000000","delay":864000},{"id":"0x8bae5e2a8aaf4501e263b917591e7fcf9b1d28c85962a8847a845aff916b50ad","target":"0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2","value":0,"data":"0xf34eb8eb0000000000000000000000002650a9a4fc64f63f573ef0f405064ef54bc46f710000000000000000000000004aabba26ea9e7a7fbd052d17a167e6ae3f8ec7be00000000000000000000000000000000000000000000000000000000000000080000000000000000000000000000000000000000000000000000000000000000e3a7d8bae497945ba8ddc51c69564f60ad4c1a990b9c7bdbd27f7929bfa8f27200000000000000000000000000000000000000000000000000000000000000c0000000000000000000000000000000000000000000000000000000000000005e547970653a207a6b45564d2c2056657273696f6e3a20696e636162657272792c2067656e657369733a202f697066732f516d55586e526f5062556d5a75455a43477969486a45736f4e6346567533684c74537668706e664253326d4159550000","delay":864000},{"id":"0xb492d5648af7003fa67cd99f58c95eaec5a32e0768bb99268bee18b19e8cf869","target":"0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2","value":0,"data":"0xc4c928c2000000000000000000000000519e42c24163192dca44cd3fbdcebf6be9130987000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000000","delay":864000},{"id":"0xd43e98454a4d7bef73956a5239de00d4858589ccf39f1d26a8c5bd9d1e5f671b","target":"0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2","value":0,"data":"0xf34eb8eb00000000000000000000000010d296e8add0535be71639e5d1d1c30ae1c6bd4c0000000000000000000000004aabba26ea9e7a7fbd052d17a167e6ae3f8ec7be00000000000000000000000000000000000000000000000000000000000000080000000000000000000000000000000000000000000000000000000000000000e3a7d8bae497945ba8ddc51c69564f60ad4c1a990b9c7bdbd27f7929bfa8f27200000000000000000000000000000000000000000000000000000000000000c00000000000000000000000000000000000000000000000000000000000000061547970653a2056616c696469756d2c2056657273696f6e3a20696e636162657272792c2067656e657369733a202f697066732f516d55586e526f5062556d5a75455a43477969486a45736f4e6346567533684c74537668706e664253326d41595500000000000000000000000000000000000000000000000000000000000000","delay":864000},{"id":"0xd67d30e173069baf06cd69ce4df5951d855ab47e107cbaf1ac07f0fa42fb6af9","target":"0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2","value":0,"data":"0xc4c928c20000000000000000000000001e163594e13030244dcaf4cdfc2cd0ba3206da800000000000000000000000000000000000000000000000000000000000000003000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000041c8b937000000000000000000000000000000000000000000000000000000000","delay":864000},{"id":"0xdf877691807571a83db47daab96ce9c103ea6459d7a56b57f040f8039186cd31","target":"0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2","value":0,"data":"0xf34eb8eb0000000000000000000000002650a9a4fc64f63f573ef0f405064ef54bc46f710000000000000000000000000775e11309d75aa6b0967917fb0213c5673edf8100000000000000000000000000000000000000000000000000000000000000090000000000000000000000000000000000000000000000000000000000000000e3a7d8bae497945ba8ddc51c69564f60ad4c1a990b9c7bdbd27f7929bfa8f27200000000000000000000000000000000000000000000000000000000000000c00000000000000000000000000000000000000000000000000000000000000060547970653a207a6b45564d2c2056657273696f6e3a20656c64656c6265727279322c2067656e657369733a202f697066732f516d55586e526f5062556d5a75455a43477969486a45736f4e6346567533684c74537668706e664253326d415955","delay":0},{"id":"0xdd9feb4dbad03c98d76f1bc8d746e99e1ee05ecac1b4233e1388d6c6532e02f6","target":"0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2","value":0,"data":"0x2f2ff15d66156603fe29d13f97c6f3e3dff4ef71919f9aa61c555be0182d954e94221aac000000000000000000000000242dae44f5d8fb54b198d03a94da45b5a4413e21","delay":0},{"id":"0xdecad137d29f44776cbe1de5721dd879cbc65f189fa8f4f93451c6621fa31363","target":"0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2","value":0,"data":"0xf34eb8eb00000000000000000000000010d296e8add0535be71639e5d1d1c30ae1c6bd4c0000000000000000000000000775e11309d75aa6b0967917fb0213c5673edf8100000000000000000000000000000000000000000000000000000000000000090000000000000000000000000000000000000000000000000000000000000000e3a7d8bae497945ba8ddc51c69564f60ad4c1a990b9c7bdbd27f7929bfa8f27200000000000000000000000000000000000000000000000000000000000000c00000000000000000000000000000000000000000000000000000000000000063547970653a2056616c696469756d2c2056657273696f6e3a20656c64656c6265727279322c2067656e657369733a202f697066732f516d55586e526f5062556d5a75455a43477969486a45736f4e6346567533684c74537668706e664253326d4159550000000000000000000000000000000000000000000000000000000000","delay":0}]
      values.scheduledTransactionsDecoded:
+        [{"target":"0x0F99738B2Fc14D77308337f3e2596b63aE7BCC4A","value":"0","function":"upgradeAndCall","inputs":{"proxy":"0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2","implementation":"0x301442aA888701c8B86727d42F3C55Fb0dd9eF7F","data":{"_versionString":"v2.0.0-RC1-fork.5"}},"predecessor":"0x0000000000000000000000000000000000000000000000000000000000000000","delay":"864000"},{"target":"0x0F99738B2Fc14D77308337f3e2596b63aE7BCC4A","value":"0","function":"upgradeAndCall","inputs":{"proxy":"0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2","implementation":"0xb1585916487AcEdD99952086f2950763D253b923","data":{"_versionString":"v3.0.0-incaberry"}},"predecessor":"0x0000000000000000000000000000000000000000000000000000000000000000","delay":"864000"},{"target":"0x0F99738B2Fc14D77308337f3e2596b63aE7BCC4A","value":"0","function":"upgrade","inputs":{"proxy":"0x580bda1e7A0CFAe92Fa7F6c20A3794F169CE3CFb","implementation":"0x2E38cD55163137483E30580Cb468C2dFf1d85077"},"predecessor":"0x0000000000000000000000000000000000000000000000000000000000000000","delay":"864000"},{"target":"0x0F99738B2Fc14D77308337f3e2596b63aE7BCC4A","value":"0","function":"upgrade","inputs":{"proxy":"0x2a3DD3EB832aF982ec71669E178424b10Dca2EDe","implementation":"0x0FeB850B183C57534b56b7d56520133C8f9BDB65"},"predecessor":"0x0000000000000000000000000000000000000000000000000000000000000000","delay":"864000"},{"target":"0x0F99738B2Fc14D77308337f3e2596b63aE7BCC4A","value":"0","function":"upgradeAndCall","inputs":{"proxy":"0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2","implementation":"0x3b82Da772c825283d85d5d6717A77C6Ff582053b","data":{"trustedAggregator":"0x6329Fe417621925C81c16F9F9a18c203C21Af7ab","_pendingStateTimeout":432000,"_trustedAggregatorTimeout":432000,"admin":"0x242daE44F5d8fb54B198D03a94dA45B5a4413e21","timelock":"0xEf1462451C30Ea7aD8555386226059Fe837CA4EF","emergencyCouncil":"0x37c58Dfa7BF0A165C5AAEdDf3e2EdB475ac6Dcb6","polygonZkEVM":"0x519E42c24163192Dca44CD3fBDCEBF6be9130987","zkEVMVerifier":"0x1C3A3da552b8662CD69538356b1E7c2E9CC1EBD8","zkEVMForkID":7,"zkEVMChainID":1101}},"predecessor":"0x0000000000000000000000000000000000000000000000000000000000000000","delay":"864000"},{"target":"0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2","value":"0","function":"0xf34eb8eb","inputs":{"calldata":"0000000000000000000000009cf80f7eb1c76ec5ae7a88b417e373449b73ac300000000000000000000000001c3a3da552b8662cd69538356b1e7c2e9cc1ebd800000000000000000000000000000000000000000000000000000000000000070000000000000000000000000000000000000000000000000000000000000000e3a7d8bae497945ba8ddc51c69564f60ad4c1a990b9c7bdbd27f7929bfa8f27200000000000000000000000000000000000000000000000000000000000000c0000000000000000000000000000000000000000000000000000000000000005d547970653a2056616c696469756d2c2056657273696f6e3a206574726f672c2067656e657369733a202f697066732f516d55586e526f5062556d5a75455a43477969486a45736f4e6346567533684c74537668706e664253326d415955000000"},"predecessor":"0x0000000000000000000000000000000000000000000000000000000000000000","delay":"864000"},{"target":"0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2","value":"0","function":"addNewRollupType","inputs":{"consensusImplementation":"0x2650a9a4fC64f63F573EF0F405064EF54BC46f71","verifier":"0x4AaBBA26EA9E7A7fbD052d17a167e6aE3F8eC7Be","forkID":8,"rollupCompatibilityID":0,"genesis":"0xe3a7d8bae497945ba8ddc51c69564f60ad4c1a990b9c7bdbd27f7929bfa8f272","description":"Type: zkEVM, Version: incaberry, genesis: /ipfs/QmUXnRoPbUmZuEZCGyiHjEsoNcFVu3hLtSvhpnfBS2mAYU"},"predecessor":"0x0000000000000000000000000000000000000000000000000000000000000000","delay":"864000"},{"target":"0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2","value":"0","function":"updateRollup","inputs":{"rollupContract":"0x519E42c24163192Dca44CD3fBDCEBF6be9130987","newRollupTypeID":2,"upgradeData":"0x"},"predecessor":"0x0000000000000000000000000000000000000000000000000000000000000000","delay":"864000"},{"target":"0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2","value":"0","function":"addNewRollupType","inputs":{"consensusImplementation":"0x10D296e8aDd0535be71639E5D1d1c30ae1C6bD4C","verifier":"0x4AaBBA26EA9E7A7fbD052d17a167e6aE3F8eC7Be","forkID":8,"rollupCompatibilityID":0,"genesis":"0xe3a7d8bae497945ba8ddc51c69564f60ad4c1a990b9c7bdbd27f7929bfa8f272","description":"Type: Validium, Version: incaberry, genesis: /ipfs/QmUXnRoPbUmZuEZCGyiHjEsoNcFVu3hLtSvhpnfBS2mAYU"},"predecessor":"0x8bae5e2a8aaf4501e263b917591e7fcf9b1d28c85962a8847a845aff916b50ad","delay":"864000"},{"target":"0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2","value":"0","function":"updateRollup","inputs":{"rollupContract":"0x1E163594e13030244DCAf4cDfC2cd0ba3206DA80","newRollupTypeID":3,"upgradeData":"0x1c8b9370"},"predecessor":"0x0000000000000000000000000000000000000000000000000000000000000000","delay":"864000"},{"target":"0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2","value":"0","function":"addNewRollupType","inputs":{"consensusImplementation":"0x2650a9a4fC64f63F573EF0F405064EF54BC46f71","verifier":"0x0775e11309d75aA6b0967917fB0213C5673eDf81","forkID":9,"rollupCompatibilityID":0,"genesis":"0xe3a7d8bae497945ba8ddc51c69564f60ad4c1a990b9c7bdbd27f7929bfa8f272","description":"Type: zkEVM, Version: eldelberry2, genesis: /ipfs/QmUXnRoPbUmZuEZCGyiHjEsoNcFVu3hLtSvhpnfBS2mAYU"},"predecessor":"0x0000000000000000000000000000000000000000000000000000000000000000","delay":"0"},{"target":"0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2","value":"0","function":"grantRole","inputs":{"role":"0x66156603fe29d13f97c6f3e3dff4ef71919f9aa61c555be0182d954e94221aac","account":"0x242daE44F5d8fb54B198D03a94dA45B5a4413e21"},"predecessor":"0x0000000000000000000000000000000000000000000000000000000000000000","delay":"0"},{"target":"0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2","value":"0","function":"addNewRollupType","inputs":{"consensusImplementation":"0x10D296e8aDd0535be71639E5D1d1c30ae1C6bD4C","verifier":"0x0775e11309d75aA6b0967917fB0213C5673eDf81","forkID":9,"rollupCompatibilityID":0,"genesis":"0xe3a7d8bae497945ba8ddc51c69564f60ad4c1a990b9c7bdbd27f7929bfa8f272","description":"Type: Validium, Version: eldelberry2, genesis: /ipfs/QmUXnRoPbUmZuEZCGyiHjEsoNcFVu3hLtSvhpnfBS2mAYU"},"predecessor":"0x0000000000000000000000000000000000000000000000000000000000000000","delay":"0"}]
    }
```

Generated with discovered.json: 0x1eb369afff0ddd1308836d5a882cdace0d276e29

# Diff at Fri, 12 Jul 2024 10:13:30 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@48ec906f1df3ec8351c0e2324170592091f7c1db block: 20259919
- current block number: 20289749

## Description

Pay network (Wirex) is verifying batches. The review is in the pipeline ;)

## Watched changes

```diff
    contract PolygonRollupManager (0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2) {
    +++ description: None
+++ description: Checks if lastVerifiedBatch for a rollupID is greater than one. Works like a trigger for projects becoming active after deployment. Mind that index here is rollupID-1.
      values.isVerifyingBatches.7.0:
-        false
+        true
    }
```

Generated with discovered.json: 0xf22e5a01a8c218f2ca43be201d375ff6c484b857

# Diff at Mon, 08 Jul 2024 06:11:47 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@e192ffbc9e265fdc44012a487bab5f0859ffe881 block: 20239328
- current block number: 20259919

## Description

The rollup contract associated with a project called `prism` (networkName string) is producing and verifying batches. Info on this project is hard to find.

## Watched changes 

```diff
    contract PolygonRollupManager (0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2) {
    +++ description: None
+++ description: Checks if lastVerifiedBatch for a rollupID is greater than one. Works like a trigger for projects becoming active after deployment. Mind that index here is rollupID-1.
      values.isVerifyingBatches.6.0:
-        false
+        true
    }
```

Generated with discovered.json: 0x6c7284e62751150f3d598db66cc024b11d5b68b7

# Diff at Fri, 05 Jul 2024 09:12:17 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@38ab6c6f42360c40ef4d13f9e02761a9d45810a2 block: 20189645
- current block number: 20239328

## Description

`createNewRollup()` is called by the RollupManagerAdminMultisig, adding a new rollup with a new chainID and the same rollupTypeID 4 as currently all other registered zkEVM rollups in the manager except PolygonZkEVM (3). This one is related to [Pay Chain by Wirex](https://wirexapp.com/blog/post/introducing-wirex-pay-wirexs-zk-powered-app-chain-on-polygon-0783). (not launched / not producing blocks yet)

### Current state of projects on Polygon CDK

rolluptype: 3 = rollup, 4 = validium

🚀 = live

rollupIDs:
-   1: pol zkEVM 1101 (type3) 🚀
-	2: astar 3776 (type4) 🚀
-	3: OkX X Chain 196 (type4) 🚀
-	4: OEV network chainid 4913 (type4)
-	5: gptprotocol.org 1511670449 (type4) 🚀
-	6: witnesschain 1702448187 (type4) 🚀
-	7: prism (by prism bridge?) 994873017 (type4)
-	8: pay network (wirex) 31415 (type4)


## Watched changes

```diff
    contract PolygonRollupManager (0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2) {
    +++ description: None
+++ description: Checks if lastVerifiedBatch for a rollupID is greater than one. Works like a trigger for projects becoming active after deployment. Mind that index here is rollupID-1.
      values.isVerifyingBatches.7:
+        [false]
      values.rollupCount:
-        7
+        8
+++ description: Maps rollup contracts and their verifier. Any change should be picked up also by the specific rollup config, unless it's a new rollup. [rollupContract, chainID, verifier, rollupTypeID]
+++ severity: MEDIUM
      values.rollupsData.7:
+        ["0x78253E2E6120164bd826668A4C96Db20f78A94c9",31415,"0x0775e11309d75aA6b0967917fB0213C5673eDf81",4]
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20189645 (main branch discovery), not current.

```diff
    contract PolygonRollupManager (0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2) {
    +++ description: None
+++ description: Checks if lastVerifiedBatch for a rollupID is greater than one. Works like a trigger for projects becoming active after deployment. Mind that index here is rollupID-1.
      values.isVerifyingBatches:
+        [[true],[true],[true],[false],[true],[true],[false]]
      usedTypes:
+        [{"typeCaster":"GreaterThan","arg":{"value":1}}]
    }
```

Generated with discovered.json: 0xe187c281eb0dc50a8c9d425f0f0d54dfd05cd099

# Diff at Fri, 28 Jun 2024 10:40:16 GMT:

- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@555efdd96fadc389c2c70beacf820125fbb25a7d block: 20110313
- current block number: 20189645

## Description

New zk rollup is launching, same verifier as polygon zk and astar zk. Not public yet, waiting on more info.

## Watched changes

```diff
    contract PolygonRollupManager (0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2) {
    +++ description: None
      values.rollupCount:
-        6
+        7
+++ description: Maps rollup contracts and their verifier. Any change should be picked up also by the specific rollup config, unless it's a new rollup. [rollupContract, chainID, verifier, rollupTypeID]
+++ severity: MEDIUM
      values.rollupsData.6:
+        ["0x92726F7dE49300DBdb60930066bc1d0803c0740B",994873017,"0x0775e11309d75aA6b0967917fB0213C5673eDf81",4]
    }
```

Generated with discovered.json: 0x9a73a2c326dacbeb2ddcf0eab4fa287e6a66cc55

# Diff at Mon, 17 Jun 2024 08:28:41 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@f39ec7f15738d4847f0cbde4818140d42e26440f block: 19967357
- current block number: 20110313

## Description

`createNewRollup()` is called by the RollupManagerAdminMultisig, adding a new rollup with a new chainID and the same rollupTypeID 4 as currently all other registered zkEVM rollups in the manager except PolygonZkEVM (3). This one is related to [Witnesschain](https://www.witnesschain.com/). (not launched / not producing blocks yet)

## Watched changes

```diff
    contract PolygonRollupManager (0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2) {
    +++ description: None
      values.rollupCount:
-        5
+        6
+++ description: Maps rollup contracts and their verifier. Any change should be picked up also by the specific rollup config, unless it's a new rollup. [rollupContract, chainID, verifier, rollupTypeID]
+++ severity: MEDIUM
      values.rollupsData.5:
+        ["0x42Ac57F24EC4C3AAC843f6DBAcd9282DAaeE9238",1702448187,"0x0775e11309d75aA6b0967917fB0213C5673eDf81",4]
    }
```

Generated with discovered.json: 0xb2a7c134dab045edcf9290ea3379e7233ab83f46

# Diff at Tue, 28 May 2024 09:05:30 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@26fb47d2fe07f8328027e4981771b4477e23fd15 block: 19882094
- current block number: 19967357

## Description

`createNewRollup()` is called by the AdminMultisig, adding a new rollup with a new chainID and the same rollupTypeID 4 as currently all other registered zkEVM rollups in the manager except PolygonZkEVM (3). This one is related to [gptprotocol](gptprotocol.org). (not launched / not producing blocks yet)

## Watched changes

```diff
    contract PolygonRollupManager (0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2) {
    +++ description: None
      values.rollupCount:
-        4
+        5
+++ description: Maps rollup contracts and their verifier. Any change should be picked up also by the specific rollup config, unless it's a new rollup. [rollupContract, chainID, verifier, rollupTypeID]
+++ severity: MEDIUM
      values.rollupsData.4:
+        ["0xC4E903D3Af4c3d2e437492d602adcC9d9b536858",1511670449,"0x0775e11309d75aA6b0967917fB0213C5673eDf81",4]
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19882094 (main branch discovery), not current.

```diff
    contract PolygonRollupManager (0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2) {
    +++ description: None
+++ description: Maps rollup contracts and their verifier. Any change should be picked up also by the specific rollup config, unless it's a new rollup. [rollupContract, chainID, verifier, rollupTypeID]
+++ severity: MEDIUM
      values.rollupsData.3.3:
+        4
+++ description: Maps rollup contracts and their verifier. Any change should be picked up also by the specific rollup config, unless it's a new rollup. [rollupContract, chainID, verifier, rollupTypeID]
+++ severity: MEDIUM
      values.rollupsData.3.2:
+        "0x0775e11309d75aA6b0967917fB0213C5673eDf81"
+++ description: Maps rollup contracts and their verifier. Any change should be picked up also by the specific rollup config, unless it's a new rollup. [rollupContract, chainID, verifier, rollupTypeID]
+++ severity: MEDIUM
      values.rollupsData.3.1:
-        "0x0775e11309d75aA6b0967917fB0213C5673eDf81"
+        4913
+++ description: Maps rollup contracts and their verifier. Any change should be picked up also by the specific rollup config, unless it's a new rollup. [rollupContract, chainID, verifier, rollupTypeID]
+++ severity: MEDIUM
      values.rollupsData.2.3:
+        4
+++ description: Maps rollup contracts and their verifier. Any change should be picked up also by the specific rollup config, unless it's a new rollup. [rollupContract, chainID, verifier, rollupTypeID]
+++ severity: MEDIUM
      values.rollupsData.2.2:
+        "0x0775e11309d75aA6b0967917fB0213C5673eDf81"
+++ description: Maps rollup contracts and their verifier. Any change should be picked up also by the specific rollup config, unless it's a new rollup. [rollupContract, chainID, verifier, rollupTypeID]
+++ severity: MEDIUM
      values.rollupsData.2.1:
-        "0x0775e11309d75aA6b0967917fB0213C5673eDf81"
+        196
+++ description: Maps rollup contracts and their verifier. Any change should be picked up also by the specific rollup config, unless it's a new rollup. [rollupContract, chainID, verifier, rollupTypeID]
+++ severity: MEDIUM
      values.rollupsData.1.3:
+        4
+++ description: Maps rollup contracts and their verifier. Any change should be picked up also by the specific rollup config, unless it's a new rollup. [rollupContract, chainID, verifier, rollupTypeID]
+++ severity: MEDIUM
      values.rollupsData.1.2:
+        "0x0775e11309d75aA6b0967917fB0213C5673eDf81"
+++ description: Maps rollup contracts and their verifier. Any change should be picked up also by the specific rollup config, unless it's a new rollup. [rollupContract, chainID, verifier, rollupTypeID]
+++ severity: MEDIUM
      values.rollupsData.1.1:
-        "0x0775e11309d75aA6b0967917fB0213C5673eDf81"
+        3776
+++ description: Maps rollup contracts and their verifier. Any change should be picked up also by the specific rollup config, unless it's a new rollup. [rollupContract, chainID, verifier, rollupTypeID]
+++ severity: MEDIUM
      values.rollupsData.0.3:
+        3
+++ description: Maps rollup contracts and their verifier. Any change should be picked up also by the specific rollup config, unless it's a new rollup. [rollupContract, chainID, verifier, rollupTypeID]
+++ severity: MEDIUM
      values.rollupsData.0.2:
+        "0x0775e11309d75aA6b0967917fB0213C5673eDf81"
+++ description: Maps rollup contracts and their verifier. Any change should be picked up also by the specific rollup config, unless it's a new rollup. [rollupContract, chainID, verifier, rollupTypeID]
+++ severity: MEDIUM
      values.rollupsData.0.1:
-        "0x0775e11309d75aA6b0967917fB0213C5673eDf81"
+        1101
    }
```

Generated with discovered.json: 0x6124ec4be2edb290f32c6def8e55cfc071ddc45e

# Diff at Thu, 16 May 2024 10:59:41 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@59d36171ee3aaf27d6db0c75fdfba523d2dad686 block: 19718134
- current block number: 19882094

## Description

Changes related to improving the shared-polygon-cdk module.
Verifier is no longer part of this shared module - each rollup discoveres it for themselfs.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19718134 (main branch discovery), not current.

```diff
-   Status: DELETED
    contract FflonkVerifier (0x0775e11309d75aA6b0967917fB0213C5673eDf81)
    +++ description: None
```

Generated with discovered.json: 0x675abae30b8f0674b5c4e121e5e94f1373994217

# Diff at Tue, 23 Apr 2024 12:36:37 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@490974f5b59ffaa2fc80e604d18674505076a157 block: 19631886
- current block number: 19718134

## Description

A new unverified contract is added. Will take care of it once verified.

## Watched changes

```diff
    contract PolygonRollupManager (0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2) {
    +++ description: None
      values.rollupCount:
-        3
+        4
+++ description: Maps rollup contracts and their verifier. Any change either should be picked up also by the specific rollup config, unless it's a new rollup.
+++ severity: MEDIUM
      values.rollupsData.3:
+        ["0x88AaB361f108C3c959F2928Da3cD8e47298016B5","0x0775e11309d75aA6b0967917fB0213C5673eDf81"]
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19631886 (main branch discovery), not current.

```diff
-   Status: DELETED
    contract PolygonDataCommittee (0x05652Ec92366F3C2255991a265c499E01Ba58e6a)
    +++ description: None
```

```diff
    contract ProxyAdmin (0x0F99738B2Fc14D77308337f3e2596b63aE7BCC4A) {
    +++ description: None
      name:
-        "ProxyAdmin"
+        "SharedProxyAdmin"
    }
```

```diff
-   Status: DELETED
    contract ProxyAdmin (0x1e37EA18e9515db29b3E94A00eD31484A3130204)
    +++ description: None
```

```diff
-   Status: DELETED
    contract PolygonValidiumStorageMigration (0x2B0ee28D4D51bC9aDde5E58E295873F61F4a0507)
    +++ description: None
```

```diff
-   Status: DELETED
    contract OKBImplementation (0x75231F58b43240C9718Dd58B4967c5114342a86c)
    +++ description: None
```

Generated with discovered.json: 0xca1dcfc893f3259ddea0aa19ddc937f9e0d76fa1

# Diff at Wed, 10 Apr 2024 09:31:38 GMT:

- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@6bb1fb9faf46a5960ef8903031fd713f6bd1234a block: 19610745
- current block number: 19624352

## Description

Provide description of changes. This section will be preserved.

## Watched changes

```diff
-   Status: DELETED
    contract FflonkVerifier (0x1C3A3da552b8662CD69538356b1E7c2E9CC1EBD8)
    +++ description: None
```

```diff
    contract PolygonRollupManager (0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2) {
    +++ description: None
      values.rollupsData.1.1:
-        "0x1C3A3da552b8662CD69538356b1E7c2E9CC1EBD8"
+        "0x0775e11309d75aA6b0967917fB0213C5673eDf81"
    }
```

## Source code changes

```diff
.../contracts/verifiers/FflonkVerifier.sol         |    0
 .../FflonkVerifier}/meta.txt                       |    0
 .../verifiers/FflonkVerifier.sol => /dev/null      | 1244 --------------------
 .../meta.txt => /dev/null                          |    2 -
 4 files changed, 1246 deletions(-)
```

Generated with discovered.json: 0x84208cfb3134802fcfbb77b6a1e6a6a4aa4c8419

# Diff at Mon, 08 Apr 2024 11:47:10 GMT:

- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@786d5557d38c508087b24a36535c329c2bdbb5ab block: 19525405
- current block number: 19610745

## Description

Provide description of changes. This section will be preserved.

## Watched changes

```diff
    contract PolygonRollupManager (0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2) {
    +++ description: None
      values.rollupCount:
-        2
+        3
      values.rollupsData.2:
+        ["0x2B0ee28D4D51bC9aDde5E58E295873F61F4a0507","0x0775e11309d75aA6b0967917fB0213C5673eDf81"]
      values.rollupTypeCount:
-        3
+        4
      values.rollupTypes.3:
+        ["0x10D296e8aDd0535be71639E5D1d1c30ae1C6bD4C","0x0775e11309d75aA6b0967917fB0213C5673eDf81"]
    }
```

```diff
+   Status: CREATED
    contract PolygonDataCommittee (0x05652Ec92366F3C2255991a265c499E01Ba58e6a)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x1e37EA18e9515db29b3E94A00eD31484A3130204)
    +++ description: None
```

```diff
+   Status: CREATED
    contract PolygonValidiumStorageMigration (0x2B0ee28D4D51bC9aDde5E58E295873F61F4a0507)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OKBImplementation (0x75231F58b43240C9718Dd58B4967c5114342a86c)
    +++ description: None
```

## Source code changes

```diff
.../.code/OKBImplementation/implementation/OKb.sol |  408 +++++
 .../OKBImplementation/implementation/SafeMath.sol  |   28 +
 .../OKBImplementation/implementation/meta.txt      |    2 +
 .../.code/OKBImplementation/proxy/Address.sol      |   23 +
 .../proxy/OwnedUpgradeabilityProxy.sol             |   86 +
 .../.code/OKBImplementation/proxy/Proxy.sol        |   34 +
 .../proxy/UpgradeabilityProxy.sol                  |   59 +
 .../.code/OKBImplementation/proxy/meta.txt         |    2 +
 .../@openzeppelin/contracts/utils/Strings.sol      |   70 +
 .../contracts/utils/cryptography/ECDSA.sol         |  213 +++
 .../@openzeppelin/contracts/utils/math/Math.sol    |  345 ++++
 .../access/OwnableUpgradeable.sol                  |   95 +
 .../proxy/utils/Initializable.sol                  |  165 ++
 .../utils/AddressUpgradeable.sol                   |  219 +++
 .../utils/ContextUpgradeable.sol                   |   37 +
 .../v2/consensus/validium/PolygonDataCommittee.sol |  197 ++
 .../v2/interfaces/IDataAvailabilityProtocol.sol    |   12 +
 .../v2/interfaces/IPolygonDataCommitteeErrors.sol  |   40 +
 .../PolygonDataCommittee/implementation/meta.txt   |    2 +
 .../@openzeppelin/contracts/access/Ownable.sol     |   83 +
 .../contracts/interfaces/IERC1967.sol              |   26 +
 .../contracts/interfaces/draft-IERC1822.sol        |   20 +
 .../contracts/proxy/ERC1967/ERC1967Proxy.sol       |   32 +
 .../contracts/proxy/ERC1967/ERC1967Upgrade.sol     |  171 ++
 .../proxy/@openzeppelin/contracts/proxy/Proxy.sol  |   86 +
 .../contracts/proxy/beacon/BeaconProxy.sol         |   61 +
 .../contracts/proxy/beacon/IBeacon.sol             |   16 +
 .../contracts/proxy/beacon/UpgradeableBeacon.sol   |   65 +
 .../contracts/proxy/transparent/ProxyAdmin.sol     |   81 +
 .../transparent/TransparentUpgradeableProxy.sol    |  193 ++
 .../@openzeppelin/contracts/utils/Address.sol      |  244 +++
 .../@openzeppelin/contracts/utils/Context.sol      |   24 +
 .../@openzeppelin/contracts/utils/StorageSlot.sol  |   88 +
 .../.code/PolygonDataCommittee/proxy/meta.txt      |    2 +
 .../access/IAccessControlUpgradeable.sol           |   88 +
 .../proxy/utils/Initializable.sol                  |  165 ++
 .../token/ERC20/IERC20Upgradeable.sol              |   82 +
 .../ERC20/extensions/IERC20MetadataUpgradeable.sol |   28 +
 .../extensions/draft-IERC20PermitUpgradeable.sol   |   60 +
 .../token/ERC20/utils/SafeERC20Upgradeable.sol     |  116 ++
 .../utils/AddressUpgradeable.sol                   |  219 +++
 .../utils/ContextUpgradeable.sol                   |   37 +
 .../utils/StringsUpgradeable.sol                   |   70 +
 .../utils/introspection/ERC165Upgradeable.sol      |   42 +
 .../utils/introspection/IERC165Upgradeable.sol     |   25 +
 .../utils/math/MathUpgradeable.sol                 |  345 ++++
 .../@openzeppelin/contracts5/access/Ownable.sol    |  100 +
 .../contracts5/interfaces/IERC1967.sol             |   24 +
 .../contracts5/proxy/ERC1967/ERC1967Proxy.sol      |   40 +
 .../contracts5/proxy/ERC1967/ERC1967Utils.sol      |  193 ++
 .../@openzeppelin/contracts5/proxy/Proxy.sol       |   69 +
 .../contracts5/proxy/beacon/IBeacon.sol            |   16 +
 .../contracts5/proxy/transparent/ProxyAdmin.sol    |   45 +
 .../transparent/TransparentUpgradeableProxy.sol    |  116 ++
 .../@openzeppelin/contracts5/utils/Address.sol     |  159 ++
 .../@openzeppelin/contracts5/utils/Context.sol     |   24 +
 .../@openzeppelin/contracts5/utils/StorageSlot.sol |  135 ++
 .../interfaces/IBasePolygonZkEVMGlobalExitRoot.sol |   16 +
 .../contracts/interfaces/IPolygonZkEVMBridge.sol   |  118 ++
 .../contracts/interfaces/IPolygonZkEVMErrors.sol   |  211 +++
 .../contracts/interfaces/IVerifierRollup.sol       |   13 +
 .../contracts/lib/EmergencyManager.sol             |   73 +
 .../contracts/v2/PolygonRollupManager.sol          | 1911 ++++++++++++++++++++
 .../migration/PolygonRollupBaseEtrogNoGap.sol      |  945 ++++++++++
 .../migration/PolygonValidiumStorageMigration.sol  |  347 ++++
 .../consensus/zkEVM/PolygonZkEVMExistentEtrog.sol  |  134 ++
 .../v2/interfaces/IDataAvailabilityProtocol.sol    |   12 +
 .../contracts/v2/interfaces/IPolygonRollupBase.sol |   20 +
 .../v2/interfaces/IPolygonRollupManager.sol        |  170 ++
 .../contracts/v2/interfaces/IPolygonValidium.sol   |   15 +
 .../v2/interfaces/IPolygonZkEVMBridgeV2.sol        |  166 ++
 .../interfaces/IPolygonZkEVMGlobalExitRootV2.sol   |   10 +
 .../v2/interfaces/IPolygonZkEVMVEtrogErrors.sol    |   56 +
 .../contracts/v2/lib/LegacyZKEVMStateVariables.sol |  153 ++
 .../v2/lib/PolygonAccessControlUpgradeable.sol     |  245 +++
 .../contracts/v2/lib/PolygonConstantsBase.sol      |   14 +
 .../contracts/v2/lib/PolygonRollupBaseEtrog.sol    |  951 ++++++++++
 .../contracts/v2/lib/PolygonTransparentProxy.sol   |   79 +
 .../implementation/meta.txt                        |    2 +
 .../PolygonValidiumStorageMigration/proxy/meta.txt |    2 +
 .../ProxyAdmin.sol                                 |    0
 .../meta.txt                                       |    0
 .../@openzeppelin/contracts/access/Ownable.sol     |   83 +
 .../contracts/interfaces/IERC1967.sol              |   26 +
 .../contracts/interfaces/draft-IERC1822.sol        |   20 +
 .../contracts/proxy/ERC1967/ERC1967Proxy.sol       |   32 +
 .../contracts/proxy/ERC1967/ERC1967Upgrade.sol     |  171 ++
 .../@openzeppelin/contracts/proxy/Proxy.sol        |   86 +
 .../contracts/proxy/beacon/BeaconProxy.sol         |   61 +
 .../contracts/proxy/beacon/IBeacon.sol             |   16 +
 .../contracts/proxy/beacon/UpgradeableBeacon.sol   |   65 +
 .../contracts/proxy/transparent/ProxyAdmin.sol     |   81 +
 .../transparent/TransparentUpgradeableProxy.sol    |  193 ++
 .../@openzeppelin/contracts/utils/Address.sol      |  244 +++
 .../@openzeppelin/contracts/utils/Context.sol      |   24 +
 .../@openzeppelin/contracts/utils/StorageSlot.sol  |   88 +
 .../meta.txt                                       |    2 +
 97 files changed, 12282 insertions(+)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19525405 (main branch discovery), not current.

```diff
    contract RollupManagerAdminMultisig (0x242daE44F5d8fb54B198D03a94dA45B5a4413e21) {
    +++ description: None
      upgradeability.threshold:
+        "2 of 3 (67%)"
    }
```

```diff
    contract SecurityCouncil (0x37c58Dfa7BF0A165C5AAEdDf3e2EdB475ac6Dcb6) {
    +++ description: None
      upgradeability.threshold:
+        "6 of 8 (75%)"
    }
```

```diff
    contract PolygonRollupManager (0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2) {
    +++ description: None
      values.rollupsData:
+        [["0x519E42c24163192Dca44CD3fBDCEBF6be9130987","0x0775e11309d75aA6b0967917fB0213C5673eDf81"],["0x1E163594e13030244DCAf4cDfC2cd0ba3206DA80","0x1C3A3da552b8662CD69538356b1E7c2E9CC1EBD8"]]
      values.rollupTypes:
+        [["0x9cf80f7eB1C76ec5AE7A88b417e373449b73ac30","0x1C3A3da552b8662CD69538356b1E7c2E9CC1EBD8"],["0x2650a9a4fC64f63F573EF0F405064EF54BC46f71","0x4AaBBA26EA9E7A7fbD052d17a167e6aE3F8eC7Be"],["0x2650a9a4fC64f63F573EF0F405064EF54BC46f71","0x0775e11309d75aA6b0967917fB0213C5673eDf81"]]
    }
```

```diff
+   Status: CREATED
    contract FflonkVerifier (0x0775e11309d75aA6b0967917fB0213C5673eDf81)
    +++ description: None
```

```diff
+   Status: CREATED
    contract FflonkVerifier (0x1C3A3da552b8662CD69538356b1E7c2E9CC1EBD8)
    +++ description: None
```

Generated with discovered.json: 0xba10c72cf7e833b13b991039623f6503c48425c3

# Diff at Wed, 27 Mar 2024 11:36:42 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- current block number: 19525405

## Description

Provide description of changes. This section will be preserved.

## Initial discovery

```diff
+   Status: CREATED
    contract Permit2 (0x000000000022D473030F116dDEE9F6B43aC78BA3)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x0F99738B2Fc14D77308337f3e2596b63aE7BCC4A)
    +++ description: None
```

```diff
+   Status: CREATED
    contract RollupManagerAdminMultisig (0x242daE44F5d8fb54B198D03a94dA45B5a4413e21)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Bridge (0x2a3DD3EB832aF982ec71669E178424b10Dca2EDe)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SecurityCouncil (0x37c58Dfa7BF0A165C5AAEdDf3e2EdB475ac6Dcb6)
    +++ description: None
```

```diff
+   Status: CREATED
    contract POL (0x455e53CBB86018Ac2B8092FdCd39d8444aFFC3F6)
    +++ description: None
```

```diff
+   Status: CREATED
    contract PolygonRollupManager (0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GlobalExitRootV2 (0x580bda1e7A0CFAe92Fa7F6c20A3794F169CE3CFb)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Timelock (0xEf1462451C30Ea7aD8555386226059Fe837CA4EF)
    +++ description: None
```
