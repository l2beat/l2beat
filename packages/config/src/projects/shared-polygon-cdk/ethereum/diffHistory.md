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

xlayer is upgraded to the new type 8 validium, which was freshly added and has minimal diff to the type 7 from the [servicing upgrade](https://polygon.technology/blog/polygon-zkevm-servicing-update-coming-to-mainnet-beta). The Validium implementation is the same while the varifier differs.

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
