Generated with discovered.json: 0xed1558c85ada56f0d1f361c1786fe90edc0f3cbe

# Diff at Mon, 28 Jul 2025 17:42:23 GMT:

- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@2c26a3acc54ed5596db035d8504bd1cec71d3bfb block: 22774371
- current block number: 23019202

## Description

Upgraded the proof system, new flow:
1. A watcher requests a dispute by bonding METIS (unchanged).
2. The request waits for a game to be deployed (by a whitelisted gameCreator) (unchanged)
3. If the deadline arrives and no game exists, anyone can call disputeTimeout. The diffence here is that disputeTimeout is not just a flagging function, but it now calls saveDisputedBatchTimeout on the StateCommitmentChain, which marks the batch root as disputed with disputedBatches[root]=true.
4. Because the batch is now disputed, all later safety checks treat it as not final until MVM_Verifier deletes it. In particular, L2->L1 messaging/withdrawal is blocked for the batch root since the relayMessage() function in the L1CrossDomainMessanger eventually (in _verifyStateRootProofByChainId()) calls the ovmStateCommitmentChain to check the earliestDisputedBlockNumber, and any withdrawal whose L2 block ≥ earliestDisputedBlockNumber reverts until the dispute batch is deleted.

## Watched changes

```diff
    contract L1CrossDomainMessenger (0x081D1101855bD523bA69A9794e0217F0DB6323ff) {
    +++ description: The L1 Cross Domain Messenger (L1xDM) contract sends messages from L1 to Metis, and relays messages from Metis onto L1. In the event that a message sent from L1 to Metis is rejected for exceeding the Metis epoch gas limit, it can be resubmitted via this contract's replay function.
      sourceHashes.1:
-        "0xda7b05d88be95072ae926d6f2b176d60c2d568f45ef6c67071b28159388c81e7"
+        "0x27041f5f59b6e2efc5f1041e1ffb068e899b3da3761cafa4259df6c44b760893"
      values.$implementation:
-        "eth:0x8bF439ef7167023F009E24b21719Ca5f768Ecb36"
+        "eth:0xc1Ce5240B42AB158027095f658d530F9989b414F"
      values.$pastUpgrades.1:
+        ["2025-07-23T04:50:23.000Z","0xcbea695d784f8a5c4a51baebf910f7c3f449b48d690b52c937ec1dc1d5458e2b",["eth:0xc1Ce5240B42AB158027095f658d530F9989b414F"]]
      values.$upgradeCount:
-        1
+        2
      implementationNames.eth:0x8bF439ef7167023F009E24b21719Ca5f768Ecb36:
-        "L1CrossDomainMessenger"
      implementationNames.eth:0xc1Ce5240B42AB158027095f658d530F9989b414F:
+        "L1CrossDomainMessenger"
    }
```

```diff
    contract DisputeGameFactory (0x1C2f0A08762f0aD4598fB5de8f9D6626a4e4aeE3) {
    +++ description: Factory contract for creating dispute games. Unlike in standard OP Stack chains, games are not created to propose state roots. Instead, games are created on demand by the permissioned `GameCreator` only should a dispute arise.
      sourceHashes.1:
-        "0x45c38e69c9d8bca18eef505efeea8dfbe4deec90b00e915cedc1a2bb22743119"
+        "0xd86d5b68e9916386254080e646f5f34295ee3dcc904ba1b186df6cdc65ea4268"
      values.$admin:
-        "eth:0x48fE1f85ff8Ad9D088863A42Af54d06a1328cF21"
+        "eth:0x8FbB8D00f7621B68F219B0B18738F07aF513D5C8"
      values.$implementation:
-        "eth:0xEc2EB7E045EB9D835a93113DABaa6Ae7a6776E45"
+        "eth:0x61B220bbfeF9A94163764928B039d85e94A509d9"
      values.$pastUpgrades.2:
+        ["2025-07-23T04:50:23.000Z","0xcbea695d784f8a5c4a51baebf910f7c3f449b48d690b52c937ec1dc1d5458e2b",["eth:0x61B220bbfeF9A94163764928B039d85e94A509d9"]]
      values.$upgradeCount:
-        2
+        3
      values.accessControl.GAME_CREATOR_ROLE.members.1:
+        "eth:0xAaaAA9A2e72753cE09915fee7c0AFa6f34745799"
      values.gameCreator.1:
+        "eth:0xAaaAA9A2e72753cE09915fee7c0AFa6f34745799"
      values.gameImpls.0:
-        "eth:0x477f9d1CC62Ea2c8ff0963B11C5D782Cef536235"
+        "eth:0xD362F83945118dC953924Da1E30D7029b9Cf113d"
      values.DEFAULT_CHAIN_ID:
+        1088
      implementationNames.eth:0xEc2EB7E045EB9D835a93113DABaa6Ae7a6776E45:
-        "DisputeGameFactory"
      implementationNames.eth:0x61B220bbfeF9A94163764928B039d85e94A509d9:
+        "DisputeGameFactory"
    }
```

```diff
    contract FaultProofLockingPool (0x2CA48fF3bBC59Bff859543E63233116ecdA3DCBb) {
    +++ description: The FaultProofLockingPool is a contract that allows sequencers to lock their funds for a certain period of time. The contract is used in the Metis protocol to ensure that sequencers have enough funds to cover the potential losses from disputes. It currently has a balance of 0 METIS.
      sourceHashes.1:
-        "0x02c0d23b76bc8c0494b55f759d5d258315ed65ca85f13a0741bce12941ab0bb5"
+        "0x4e82791368b36a60ae6fc09aeb4023ce27c20f273f81bd9d6822056101d268ec"
      values.$admin:
-        "eth:0x48fE1f85ff8Ad9D088863A42Af54d06a1328cF21"
+        "eth:0x8FbB8D00f7621B68F219B0B18738F07aF513D5C8"
      values.$implementation:
-        "eth:0xE141db3Ed25A58BB8BBd331AE373605108aaAAe4"
+        "eth:0x1061528C33b8034952fb7355cC481e193b29FCa6"
      values.$pastUpgrades.2:
+        ["2025-07-23T04:50:23.000Z","0xcbea695d784f8a5c4a51baebf910f7c3f449b48d690b52c937ec1dc1d5458e2b",["eth:0x1061528C33b8034952fb7355cC481e193b29FCa6"]]
      values.$upgradeCount:
-        2
+        3
      implementationNames.eth:0xE141db3Ed25A58BB8BBd331AE373605108aaAAe4:
-        "LockingPool"
      implementationNames.eth:0x1061528C33b8034952fb7355cC481e193b29FCa6:
+        "LockingPool"
    }
```

```diff
-   Status: DELETED
    contract FaultDisputeGame (0x477f9d1CC62Ea2c8ff0963B11C5D782Cef536235)
    +++ description: Contract for handling fault disputes (should games be created). Successfully disputed batches are marked as disputed to the StateCommitmentChain.
```

```diff
    contract Metis Multisig (0x48fE1f85ff8Ad9D088863A42Af54d06a1328cF21) {
    +++ description: Can pause, censor, instantly upgrade the bridge and upgrade other critical contracts in the system.
      receivedPermissions.4.via:
+        [{"address":"eth:0x8FbB8D00f7621B68F219B0B18738F07aF513D5C8"}]
      receivedPermissions.5.via:
+        [{"address":"eth:0x8FbB8D00f7621B68F219B0B18738F07aF513D5C8"}]
      receivedPermissions.12.via:
+        [{"address":"eth:0x8FbB8D00f7621B68F219B0B18738F07aF513D5C8"}]
    }
```

```diff
    contract ProxyAdmin (0x8FbB8D00f7621B68F219B0B18738F07aF513D5C8) {
    +++ description: None
      directlyReceivedPermissions.1:
+        {"permission":"upgrade","from":"eth:0x1C2f0A08762f0aD4598fB5de8f9D6626a4e4aeE3","role":"admin"}
      directlyReceivedPermissions.2:
+        {"permission":"upgrade","from":"eth:0x2CA48fF3bBC59Bff859543E63233116ecdA3DCBb","role":"admin"}
      directlyReceivedPermissions.4:
+        {"permission":"upgrade","from":"eth:0xfA947f70c3509d5b70A606e871aE0C85397D0738","role":"admin"}
    }
```

```diff
    contract StateCommitmentChain (0xA2FaAAC9120c1Ff75814F0c6DdB119496a12eEA6) {
    +++ description: The State Commitment Chain (SCC) stores a list of proposed state roots in a linked ChainStorageContainer contract. Only a permissioned state root proposer (MVM_Proposer) can submit new state roots.
      sourceHashes.1:
-        "0x97bafeecd79eafa0a2d331c68498ce2ccecf89112ed12cb22b90aac48f1d0aa5"
+        "0xc9988c7d5840913f9a08b776cd81c6474c41bcb476822f537b3763d33f8e30e3"
      values.$implementation:
-        "eth:0xe6E2DFf51b039C8EFf0b21880E2Fb008AF10B365"
+        "eth:0x49A4D7ae835eA21c919B363fa88614b61d7985E7"
      values.earliestDisputedBlockNumber:
+        0
      implementationNames.eth:0xe6E2DFf51b039C8EFf0b21880E2Fb008AF10B365:
-        "MVM_StateCommitmentChain"
      implementationNames.eth:0x49A4D7ae835eA21c919B363fa88614b61d7985E7:
+        "MVM_StateCommitmentChain"
    }
```

```diff
    contract DelayedWMetis (0xfA947f70c3509d5b70A606e871aE0C85397D0738) {
    +++ description: Delayed wrapped Metis token contract.
      values.$admin:
-        "eth:0x48fE1f85ff8Ad9D088863A42Af54d06a1328cF21"
+        "eth:0x8FbB8D00f7621B68F219B0B18738F07aF513D5C8"
    }
```

```diff
+   Status: CREATED
    contract FaultDisputeGame (0xD362F83945118dC953924Da1E30D7029b9Cf113d)
    +++ description: Contract for handling fault disputes (should games be created). Successfully disputed batches are marked as disputed to the StateCommitmentChain.
```

## Source code changes

```diff
.../DisputeGameFactory/DisputeGameFactory.sol      |  83 ++-
 .../{.flat@22774371 => .flat}/FaultDisputeGame.sol |   2 +-
 .../FaultProofLockingPool/LockingPool.sol          |   3 +
 .../L1CrossDomainMessenger.sol                     | 632 ++++++++++++++-------
 .../MVM_StateCommitmentChain.sol                   | 131 ++++-
 5 files changed, 616 insertions(+), 235 deletions(-)
```

Generated with discovered.json: 0xfcc176a86d8568b55e1c49cb21e02bc24b16b86b

# Diff at Mon, 14 Jul 2025 12:45:25 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@9f4300dad2f3d080cd56fa311d4a848556c74e72 block: 22774371
- current block number: 22774371

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22774371 (main branch discovery), not current.

```diff
    EOA  (0x001088E383A00ff4ab36F37f7021Cb6d7B415751) {
    +++ description: None
      address:
-        "0x001088E383A00ff4ab36F37f7021Cb6d7B415751"
+        "eth:0x001088E383A00ff4ab36F37f7021Cb6d7B415751"
    }
```

```diff
    EOA  (0x02058Bb1d98D88087008F2ac1273584591380e3F) {
    +++ description: None
      address:
-        "0x02058Bb1d98D88087008F2ac1273584591380e3F"
+        "eth:0x02058Bb1d98D88087008F2ac1273584591380e3F"
    }
```

```diff
    contract L1CrossDomainMessenger (0x081D1101855bD523bA69A9794e0217F0DB6323ff) {
    +++ description: The L1 Cross Domain Messenger (L1xDM) contract sends messages from L1 to Metis, and relays messages from Metis onto L1. In the event that a message sent from L1 to Metis is rejected for exceeding the Metis epoch gas limit, it can be resubmitted via this contract's replay function.
      address:
-        "0x081D1101855bD523bA69A9794e0217F0DB6323ff"
+        "eth:0x081D1101855bD523bA69A9794e0217F0DB6323ff"
      values.$admin:
-        "0x48fE1f85ff8Ad9D088863A42Af54d06a1328cF21"
+        "eth:0x48fE1f85ff8Ad9D088863A42Af54d06a1328cF21"
      values.$implementation:
-        "0x8bF439ef7167023F009E24b21719Ca5f768Ecb36"
+        "eth:0x8bF439ef7167023F009E24b21719Ca5f768Ecb36"
      values.$pastUpgrades.0.2.0:
-        "0x8bF439ef7167023F009E24b21719Ca5f768Ecb36"
+        "eth:0x8bF439ef7167023F009E24b21719Ca5f768Ecb36"
      values.libAddressManager:
-        "0x918778e825747a892b17C66fe7D24C618262867d"
+        "eth:0x918778e825747a892b17C66fe7D24C618262867d"
      values.owner:
-        "0xDD6FFC7D9a4Fb420b637747edc6456340d12d377"
+        "eth:0xDD6FFC7D9a4Fb420b637747edc6456340d12d377"
      values.ResolvedDelegateProxy_addressManager:
-        "0x918778e825747a892b17C66fe7D24C618262867d"
+        "eth:0x918778e825747a892b17C66fe7D24C618262867d"
      implementationNames.0x081D1101855bD523bA69A9794e0217F0DB6323ff:
-        "Lib_ResolvedDelegateProxy"
      implementationNames.0x8bF439ef7167023F009E24b21719Ca5f768Ecb36:
-        "L1CrossDomainMessenger"
      implementationNames.eth:0x081D1101855bD523bA69A9794e0217F0DB6323ff:
+        "Lib_ResolvedDelegateProxy"
      implementationNames.eth:0x8bF439ef7167023F009E24b21719Ca5f768Ecb36:
+        "L1CrossDomainMessenger"
    }
```

```diff
    contract LockingInfo (0x0fe382b74C3894B65c10E5C12ae60Bbd8FAf5b48) {
    +++ description: Contract acting as an escrow for METIS tokens managed by LockingPool.
      address:
-        "0x0fe382b74C3894B65c10E5C12ae60Bbd8FAf5b48"
+        "eth:0x0fe382b74C3894B65c10E5C12ae60Bbd8FAf5b48"
      values.$admin:
-        "0x8FbB8D00f7621B68F219B0B18738F07aF513D5C8"
+        "eth:0x8FbB8D00f7621B68F219B0B18738F07aF513D5C8"
      values.$implementation:
-        "0x0D30F0d7934f53aaF6a1630A4c109AF4513a65cC"
+        "eth:0x0D30F0d7934f53aaF6a1630A4c109AF4513a65cC"
      values.$pastUpgrades.0.2.0:
-        "0x8db636418F10d514c4c68235ee3d640dDBCC7a8a"
+        "eth:0x8db636418F10d514c4c68235ee3d640dDBCC7a8a"
      values.$pastUpgrades.1.2.0:
-        "0x0D30F0d7934f53aaF6a1630A4c109AF4513a65cC"
+        "eth:0x0D30F0d7934f53aaF6a1630A4c109AF4513a65cC"
      values.bridge:
-        "0x3980c9ed79d2c191A89E02Fa3529C60eD6e9c04b"
+        "eth:0x3980c9ed79d2c191A89E02Fa3529C60eD6e9c04b"
      values.l1Token:
-        "0x9E32b13ce7f2E80A01932B42553652E053D6ed8e"
+        "eth:0x9E32b13ce7f2E80A01932B42553652E053D6ed8e"
      values.l2Token:
-        "0xDeadDeAddeAddEAddeadDEaDDEAdDeaDDeAD0000"
+        "eth:0xDeadDeAddeAddEAddeadDEaDDEAdDeaDDeAD0000"
      values.manager:
-        "0xD54c868362C2098E0E46F12E7D924C6A332952Dd"
+        "eth:0xD54c868362C2098E0E46F12E7D924C6A332952Dd"
      values.owner:
-        "0x48fE1f85ff8Ad9D088863A42Af54d06a1328cF21"
+        "eth:0x48fE1f85ff8Ad9D088863A42Af54d06a1328cF21"
      values.rewardPayer:
-        "0x62478E4eeb4070fE399866aB05e821AB97200947"
+        "eth:0x62478E4eeb4070fE399866aB05e821AB97200947"
      implementationNames.0x0fe382b74C3894B65c10E5C12ae60Bbd8FAf5b48:
-        "TransparentUpgradeableProxy"
      implementationNames.0x0D30F0d7934f53aaF6a1630A4c109AF4513a65cC:
-        "LockingInfo"
      implementationNames.eth:0x0fe382b74C3894B65c10E5C12ae60Bbd8FAf5b48:
+        "TransparentUpgradeableProxy"
      implementationNames.eth:0x0D30F0d7934f53aaF6a1630A4c109AF4513a65cC:
+        "LockingInfo"
    }
```

```diff
    contract ChainStorageContainer-SCC-batches (0x10739F09f6e62689c0aA8A1878816de9e166d6f9) {
    +++ description: Storage container for SCC batches.
      address:
-        "0x10739F09f6e62689c0aA8A1878816de9e166d6f9"
+        "eth:0x10739F09f6e62689c0aA8A1878816de9e166d6f9"
      values.libAddressManager:
-        "0x918778e825747a892b17C66fe7D24C618262867d"
+        "eth:0x918778e825747a892b17C66fe7D24C618262867d"
      implementationNames.0x10739F09f6e62689c0aA8A1878816de9e166d6f9:
-        "ChainStorageContainer"
      implementationNames.eth:0x10739F09f6e62689c0aA8A1878816de9e166d6f9:
+        "ChainStorageContainer"
    }
```

```diff
    EOA  (0x1577D2b835f561BD021E3219Cd786181D0e17ff5) {
    +++ description: None
      address:
-        "0x1577D2b835f561BD021E3219Cd786181D0e17ff5"
+        "eth:0x1577D2b835f561BD021E3219Cd786181D0e17ff5"
    }
```

```diff
    EOA  (0x1A9da0aedA630dDf2748a453BF6d92560762D914) {
    +++ description: None
      address:
-        "0x1A9da0aedA630dDf2748a453BF6d92560762D914"
+        "eth:0x1A9da0aedA630dDf2748a453BF6d92560762D914"
    }
```

```diff
    contract DisputeGameFactory (0x1C2f0A08762f0aD4598fB5de8f9D6626a4e4aeE3) {
    +++ description: Factory contract for creating dispute games. Unlike in standard OP Stack chains, games are not created to propose state roots. Instead, games are created on demand by the permissioned `GameCreator` only should a dispute arise.
      address:
-        "0x1C2f0A08762f0aD4598fB5de8f9D6626a4e4aeE3"
+        "eth:0x1C2f0A08762f0aD4598fB5de8f9D6626a4e4aeE3"
      values.$admin:
-        "0x48fE1f85ff8Ad9D088863A42Af54d06a1328cF21"
+        "eth:0x48fE1f85ff8Ad9D088863A42Af54d06a1328cF21"
      values.$implementation:
-        "0xEc2EB7E045EB9D835a93113DABaa6Ae7a6776E45"
+        "eth:0xEc2EB7E045EB9D835a93113DABaa6Ae7a6776E45"
      values.$pastUpgrades.0.2.0:
-        "0xb864eEca2a047058Eb1e28e43FEAEBE8F38843B3"
+        "eth:0xb864eEca2a047058Eb1e28e43FEAEBE8F38843B3"
      values.$pastUpgrades.1.2.0:
-        "0xEc2EB7E045EB9D835a93113DABaa6Ae7a6776E45"
+        "eth:0xEc2EB7E045EB9D835a93113DABaa6Ae7a6776E45"
      values.accessControl.DEFAULT_ADMIN_ROLE.members.0:
-        "0x48fE1f85ff8Ad9D088863A42Af54d06a1328cF21"
+        "eth:0x48fE1f85ff8Ad9D088863A42Af54d06a1328cF21"
      values.accessControl.GAME_CREATOR_ROLE.members.0:
-        "0x48fE1f85ff8Ad9D088863A42Af54d06a1328cF21"
+        "eth:0x48fE1f85ff8Ad9D088863A42Af54d06a1328cF21"
      values.gameCreator.0:
-        "0x48fE1f85ff8Ad9D088863A42Af54d06a1328cF21"
+        "eth:0x48fE1f85ff8Ad9D088863A42Af54d06a1328cF21"
      values.gameImpls.0:
-        "0x477f9d1CC62Ea2c8ff0963B11C5D782Cef536235"
+        "eth:0x477f9d1CC62Ea2c8ff0963B11C5D782Cef536235"
      values.gameImpls.1:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.gameImpls.2:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.gameImpls.3:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.gameImpls.4:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.METIS:
-        "0x9E32b13ce7f2E80A01932B42553652E053D6ed8e"
+        "eth:0x9E32b13ce7f2E80A01932B42553652E053D6ed8e"
      implementationNames.0x1C2f0A08762f0aD4598fB5de8f9D6626a4e4aeE3:
-        "TransparentUpgradeableProxy"
      implementationNames.0xEc2EB7E045EB9D835a93113DABaa6Ae7a6776E45:
-        "DisputeGameFactory"
      implementationNames.eth:0x1C2f0A08762f0aD4598fB5de8f9D6626a4e4aeE3:
+        "TransparentUpgradeableProxy"
      implementationNames.eth:0xEc2EB7E045EB9D835a93113DABaa6Ae7a6776E45:
+        "DisputeGameFactory"
    }
```

```diff
    EOA  (0x217fD54d336f710F8aee19572dBfBf0B2297ed69) {
    +++ description: None
      address:
-        "0x217fD54d336f710F8aee19572dBfBf0B2297ed69"
+        "eth:0x217fD54d336f710F8aee19572dBfBf0B2297ed69"
    }
```

```diff
    EOA  (0x26eC4FF77DF305d5a9A7660E046dd1c06ce517f6) {
    +++ description: None
      address:
-        "0x26eC4FF77DF305d5a9A7660E046dd1c06ce517f6"
+        "eth:0x26eC4FF77DF305d5a9A7660E046dd1c06ce517f6"
    }
```

```diff
    contract MetisConfig (0x2aA4E192994757c5fAB87Ba13812B89564EA57Ff) {
    +++ description: Contract used to manage configuration of global Metis values.
      address:
-        "0x2aA4E192994757c5fAB87Ba13812B89564EA57Ff"
+        "eth:0x2aA4E192994757c5fAB87Ba13812B89564EA57Ff"
      values.guardian:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      implementationNames.0x2aA4E192994757c5fAB87Ba13812B89564EA57Ff:
-        "MetisConfig"
      implementationNames.eth:0x2aA4E192994757c5fAB87Ba13812B89564EA57Ff:
+        "MetisConfig"
    }
```

```diff
    contract FaultProofLockingPool (0x2CA48fF3bBC59Bff859543E63233116ecdA3DCBb) {
    +++ description: The FaultProofLockingPool is a contract that allows sequencers to lock their funds for a certain period of time. The contract is used in the Metis protocol to ensure that sequencers have enough funds to cover the potential losses from disputes. It currently has a balance of 0 METIS.
      address:
-        "0x2CA48fF3bBC59Bff859543E63233116ecdA3DCBb"
+        "eth:0x2CA48fF3bBC59Bff859543E63233116ecdA3DCBb"
      values.$admin:
-        "0x48fE1f85ff8Ad9D088863A42Af54d06a1328cF21"
+        "eth:0x48fE1f85ff8Ad9D088863A42Af54d06a1328cF21"
      values.$implementation:
-        "0xE141db3Ed25A58BB8BBd331AE373605108aaAAe4"
+        "eth:0xE141db3Ed25A58BB8BBd331AE373605108aaAAe4"
      values.$pastUpgrades.0.2.0:
-        "0x6d554097D5784a7184650B95ba7EA359d162Dbb7"
+        "eth:0x6d554097D5784a7184650B95ba7EA359d162Dbb7"
      values.$pastUpgrades.1.2.0:
-        "0xE141db3Ed25A58BB8BBd331AE373605108aaAAe4"
+        "eth:0xE141db3Ed25A58BB8BBd331AE373605108aaAAe4"
      values.addressManager:
-        "0x918778e825747a892b17C66fe7D24C618262867d"
+        "eth:0x918778e825747a892b17C66fe7D24C618262867d"
      values.config:
-        "0x2aA4E192994757c5fAB87Ba13812B89564EA57Ff"
+        "eth:0x2aA4E192994757c5fAB87Ba13812B89564EA57Ff"
      values.owner:
-        "0x48fE1f85ff8Ad9D088863A42Af54d06a1328cF21"
+        "eth:0x48fE1f85ff8Ad9D088863A42Af54d06a1328cF21"
      values.token:
-        "0x9E32b13ce7f2E80A01932B42553652E053D6ed8e"
+        "eth:0x9E32b13ce7f2E80A01932B42553652E053D6ed8e"
      implementationNames.0x2CA48fF3bBC59Bff859543E63233116ecdA3DCBb:
-        "TransparentUpgradeableProxy"
      implementationNames.0xE141db3Ed25A58BB8BBd331AE373605108aaAAe4:
-        "LockingPool"
      implementationNames.eth:0x2CA48fF3bBC59Bff859543E63233116ecdA3DCBb:
+        "TransparentUpgradeableProxy"
      implementationNames.eth:0xE141db3Ed25A58BB8BBd331AE373605108aaAAe4:
+        "LockingPool"
    }
```

```diff
    EOA  (0x36B892a31b311E5e9960739A69D2dF0aa0F81A01) {
    +++ description: None
      address:
-        "0x36B892a31b311E5e9960739A69D2dF0aa0F81A01"
+        "eth:0x36B892a31b311E5e9960739A69D2dF0aa0F81A01"
    }
```

```diff
    contract ChainStorageContainer-CTC-batches (0x38473Feb3A6366757A249dB2cA4fBB2C663416B7) {
    +++ description: Storage container for CTC batches.
      address:
-        "0x38473Feb3A6366757A249dB2cA4fBB2C663416B7"
+        "eth:0x38473Feb3A6366757A249dB2cA4fBB2C663416B7"
      values.libAddressManager:
-        "0x918778e825747a892b17C66fe7D24C618262867d"
+        "eth:0x918778e825747a892b17C66fe7D24C618262867d"
      implementationNames.0x38473Feb3A6366757A249dB2cA4fBB2C663416B7:
-        "ChainStorageContainer"
      implementationNames.eth:0x38473Feb3A6366757A249dB2cA4fBB2C663416B7:
+        "ChainStorageContainer"
    }
```

```diff
    contract L1StandardBridge (0x3980c9ed79d2c191A89E02Fa3529C60eD6e9c04b) {
    +++ description: Main entry point for users depositing ERC20 tokens and ETH that do not require custom gateway.
      address:
-        "0x3980c9ed79d2c191A89E02Fa3529C60eD6e9c04b"
+        "eth:0x3980c9ed79d2c191A89E02Fa3529C60eD6e9c04b"
      values.$admin:
-        "0x48fE1f85ff8Ad9D088863A42Af54d06a1328cF21"
+        "eth:0x48fE1f85ff8Ad9D088863A42Af54d06a1328cF21"
      values.$implementation:
-        "0xa0cfE8Af2AB5C9232714647702DbACf862EA4798"
+        "eth:0xa0cfE8Af2AB5C9232714647702DbACf862EA4798"
      values.addressmgr:
-        "0x918778e825747a892b17C66fe7D24C618262867d"
+        "eth:0x918778e825747a892b17C66fe7D24C618262867d"
      values.l2TokenBridge:
-        "0x4200000000000000000000000000000000000010"
+        "eth:0x4200000000000000000000000000000000000010"
      values.messenger:
-        "0x081D1101855bD523bA69A9794e0217F0DB6323ff"
+        "eth:0x081D1101855bD523bA69A9794e0217F0DB6323ff"
      values.metis:
-        "0x9E32b13ce7f2E80A01932B42553652E053D6ed8e"
+        "eth:0x9E32b13ce7f2E80A01932B42553652E053D6ed8e"
      implementationNames.0x3980c9ed79d2c191A89E02Fa3529C60eD6e9c04b:
-        "L1ChugSplashProxy"
      implementationNames.0xa0cfE8Af2AB5C9232714647702DbACf862EA4798:
-        "L1StandardBridge"
      implementationNames.eth:0x3980c9ed79d2c191A89E02Fa3529C60eD6e9c04b:
+        "L1ChugSplashProxy"
      implementationNames.eth:0xa0cfE8Af2AB5C9232714647702DbACf862EA4798:
+        "L1StandardBridge"
    }
```

```diff
    EOA  (0x4200000000000000000000000000000000000007) {
    +++ description: None
      address:
-        "0x4200000000000000000000000000000000000007"
+        "eth:0x4200000000000000000000000000000000000007"
    }
```

```diff
    EOA  (0x4200000000000000000000000000000000000010) {
    +++ description: None
      address:
-        "0x4200000000000000000000000000000000000010"
+        "eth:0x4200000000000000000000000000000000000010"
    }
```

```diff
    contract FaultDisputeGame (0x477f9d1CC62Ea2c8ff0963B11C5D782Cef536235) {
    +++ description: Contract for handling fault disputes (should games be created). Successfully disputed batches are marked as disputed to the StateCommitmentChain.
      address:
-        "0x477f9d1CC62Ea2c8ff0963B11C5D782Cef536235"
+        "eth:0x477f9d1CC62Ea2c8ff0963B11C5D782Cef536235"
      values.disputeCreator:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.gameCreator:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.l2BlockNumberChallenger:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.scc:
-        "0xA2FaAAC9120c1Ff75814F0c6DdB119496a12eEA6"
+        "eth:0xA2FaAAC9120c1Ff75814F0c6DdB119496a12eEA6"
      values.vm:
-        "0xAFD640204D73B02C3521eA8ea3771182527Ff057"
+        "eth:0xAFD640204D73B02C3521eA8ea3771182527Ff057"
      values.wmetis:
-        "0xfA947f70c3509d5b70A606e871aE0C85397D0738"
+        "eth:0xfA947f70c3509d5b70A606e871aE0C85397D0738"
      implementationNames.0x477f9d1CC62Ea2c8ff0963B11C5D782Cef536235:
-        "FaultDisputeGame"
      implementationNames.eth:0x477f9d1CC62Ea2c8ff0963B11C5D782Cef536235:
+        "FaultDisputeGame"
    }
```

```diff
    contract Metis Multisig (0x48fE1f85ff8Ad9D088863A42Af54d06a1328cF21) {
    +++ description: Can pause, censor, instantly upgrade the bridge and upgrade other critical contracts in the system.
      address:
-        "0x48fE1f85ff8Ad9D088863A42Af54d06a1328cF21"
+        "eth:0x48fE1f85ff8Ad9D088863A42Af54d06a1328cF21"
      values.$implementation:
-        "0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
+        "eth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
      values.$members.0:
-        "0x1577D2b835f561BD021E3219Cd786181D0e17ff5"
+        "eth:0x1577D2b835f561BD021E3219Cd786181D0e17ff5"
      values.$members.1:
-        "0x36B892a31b311E5e9960739A69D2dF0aa0F81A01"
+        "eth:0x36B892a31b311E5e9960739A69D2dF0aa0F81A01"
      values.$members.2:
-        "0x001088E383A00ff4ab36F37f7021Cb6d7B415751"
+        "eth:0x001088E383A00ff4ab36F37f7021Cb6d7B415751"
      values.$members.3:
-        "0x217fD54d336f710F8aee19572dBfBf0B2297ed69"
+        "eth:0x217fD54d336f710F8aee19572dBfBf0B2297ed69"
      values.$members.4:
-        "0xB383E1331dEE29864b68f7D84b0dC289F770d846"
+        "eth:0xB383E1331dEE29864b68f7D84b0dC289F770d846"
      values.$members.5:
-        "0x7a9059F4A6e50090e4f55994d465918200AB4454"
+        "eth:0x7a9059F4A6e50090e4f55994d465918200AB4454"
      values.$members.6:
-        "0x02058Bb1d98D88087008F2ac1273584591380e3F"
+        "eth:0x02058Bb1d98D88087008F2ac1273584591380e3F"
      values.$members.7:
-        "0xB961047013F974C5b6B6F8dA4402379525316550"
+        "eth:0xB961047013F974C5b6B6F8dA4402379525316550"
      values.$members.8:
-        "0xa6D8941F935932a531A856C2e48046DA73a1098E"
+        "eth:0xa6D8941F935932a531A856C2e48046DA73a1098E"
      implementationNames.0x48fE1f85ff8Ad9D088863A42Af54d06a1328cF21:
-        "GnosisSafeProxy"
      implementationNames.0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
-        "GnosisSafe"
      implementationNames.eth:0x48fE1f85ff8Ad9D088863A42Af54d06a1328cF21:
+        "GnosisSafeProxy"
      implementationNames.eth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
+        "GnosisSafe"
    }
```

```diff
    contract CanonicalTransactionChain (0x56a76bcC92361f6DF8D75476feD8843EdC70e1C9) {
    +++ description: The Canonical Transaction Chain (CTC) contract is an append-only log of transactions which must be applied to the OVM state. Given that transactions batch hashes are sent to an EOA address, it allows any account to enqueue() a transaction, which the Sequencer must eventually append to the rollup state.
      address:
-        "0x56a76bcC92361f6DF8D75476feD8843EdC70e1C9"
+        "eth:0x56a76bcC92361f6DF8D75476feD8843EdC70e1C9"
      values.batches:
-        "0x38473Feb3A6366757A249dB2cA4fBB2C663416B7"
+        "eth:0x38473Feb3A6366757A249dB2cA4fBB2C663416B7"
      values.libAddressManager:
-        "0x918778e825747a892b17C66fe7D24C618262867d"
+        "eth:0x918778e825747a892b17C66fe7D24C618262867d"
      values.queue:
-        "0xA91Ea6F5d1EDA8e6686639d6C88b309cF35D2E57"
+        "eth:0xA91Ea6F5d1EDA8e6686639d6C88b309cF35D2E57"
      implementationNames.0x56a76bcC92361f6DF8D75476feD8843EdC70e1C9:
-        "CanonicalTransactionChain"
      implementationNames.eth:0x56a76bcC92361f6DF8D75476feD8843EdC70e1C9:
+        "CanonicalTransactionChain"
    }
```

```diff
    contract BondManager (0x595801b85628ec6979C420988b8843A40F850528) {
    +++ description: The Bond Manager contract will handle deposits in the form of an ERC20 token from bonded Proposers. It will also handle the accounting of gas costs spent by a Verifier during the course of a challenge. In the event of a successful challenge, the faulty Proposer's bond will be slashed, and the Verifier's gas costs will be refunded. Current mock implementation allows only OVM_Proposer to propose new state roots. No slashing is implemented.
      address:
-        "0x595801b85628ec6979C420988b8843A40F850528"
+        "eth:0x595801b85628ec6979C420988b8843A40F850528"
      values.libAddressManager:
-        "0x918778e825747a892b17C66fe7D24C618262867d"
+        "eth:0x918778e825747a892b17C66fe7D24C618262867d"
      implementationNames.0x595801b85628ec6979C420988b8843A40F850528:
-        "BondManager"
      implementationNames.eth:0x595801b85628ec6979C420988b8843A40F850528:
+        "BondManager"
    }
```

```diff
    contract RewardEscrowerMultisig (0x62478E4eeb4070fE399866aB05e821AB97200947) {
    +++ description: Escrows staking rewards for Sequencers.
      address:
-        "0x62478E4eeb4070fE399866aB05e821AB97200947"
+        "eth:0x62478E4eeb4070fE399866aB05e821AB97200947"
      values.$implementation:
-        "0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
+        "eth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
      values.$members.0:
-        "0x36B892a31b311E5e9960739A69D2dF0aa0F81A01"
+        "eth:0x36B892a31b311E5e9960739A69D2dF0aa0F81A01"
      values.$members.1:
-        "0x1577D2b835f561BD021E3219Cd786181D0e17ff5"
+        "eth:0x1577D2b835f561BD021E3219Cd786181D0e17ff5"
      values.$members.2:
-        "0xa6D8941F935932a531A856C2e48046DA73a1098E"
+        "eth:0xa6D8941F935932a531A856C2e48046DA73a1098E"
      values.$members.3:
-        "0x26eC4FF77DF305d5a9A7660E046dd1c06ce517f6"
+        "eth:0x26eC4FF77DF305d5a9A7660E046dd1c06ce517f6"
      implementationNames.0x62478E4eeb4070fE399866aB05e821AB97200947:
-        "GnosisSafeProxy"
      implementationNames.0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
-        "GnosisSafe"
      implementationNames.eth:0x62478E4eeb4070fE399866aB05e821AB97200947:
+        "GnosisSafeProxy"
      implementationNames.eth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
+        "GnosisSafe"
    }
```

```diff
    contract MVM_CanonicalTransaction (0x6A1DB7d799FBA381F2a518cA859ED30cB8E1d41a) {
    +++ description: MVM CanonicalTransaction is a wrapper of Canonical Transaction Chain that implements optimistic data availability scheme L1. If Sequencer is not malicious, it simply forwards appendSequencerBatch() calls to CanonicalTransactionChain.
      address:
-        "0x6A1DB7d799FBA381F2a518cA859ED30cB8E1d41a"
+        "eth:0x6A1DB7d799FBA381F2a518cA859ED30cB8E1d41a"
      values.$admin:
-        "0x48fE1f85ff8Ad9D088863A42Af54d06a1328cF21"
+        "eth:0x48fE1f85ff8Ad9D088863A42Af54d06a1328cF21"
      values.$implementation:
-        "0xC878771A4ff7466B7be8b59FB8766719AEa8d562"
+        "eth:0xC878771A4ff7466B7be8b59FB8766719AEa8d562"
      values.libAddressManager:
-        "0x918778e825747a892b17C66fe7D24C618262867d"
+        "eth:0x918778e825747a892b17C66fe7D24C618262867d"
      implementationNames.0x6A1DB7d799FBA381F2a518cA859ED30cB8E1d41a:
-        "L1ChugSplashProxy"
      implementationNames.0xC878771A4ff7466B7be8b59FB8766719AEa8d562:
-        "MVM_CanonicalTransaction"
      implementationNames.eth:0x6A1DB7d799FBA381F2a518cA859ED30cB8E1d41a:
+        "L1ChugSplashProxy"
      implementationNames.eth:0xC878771A4ff7466B7be8b59FB8766719AEa8d562:
+        "MVM_CanonicalTransaction"
    }
```

```diff
    contract PreimageOracle (0x789a64284e29d2225430606D3D89a9336870BBbC) {
    +++ description: Oracle for providing preimages.
      address:
-        "0x789a64284e29d2225430606D3D89a9336870BBbC"
+        "eth:0x789a64284e29d2225430606D3D89a9336870BBbC"
      implementationNames.0x789a64284e29d2225430606D3D89a9336870BBbC:
-        "PreimageOracle"
      implementationNames.eth:0x789a64284e29d2225430606D3D89a9336870BBbC:
+        "PreimageOracle"
    }
```

```diff
    EOA  (0x7a9059F4A6e50090e4f55994d465918200AB4454) {
    +++ description: None
      address:
-        "0x7a9059F4A6e50090e4f55994d465918200AB4454"
+        "eth:0x7a9059F4A6e50090e4f55994d465918200AB4454"
    }
```

```diff
    contract MVM_DiscountOracle (0x7f6B0b7589febc40419a8646EFf9801b87397063) {
    +++ description: Oracle specifying user fees for sending L1 -> Metis messages and other parameters for cross-chain communication.
      address:
-        "0x7f6B0b7589febc40419a8646EFf9801b87397063"
+        "eth:0x7f6B0b7589febc40419a8646EFf9801b87397063"
      values.libAddressManager:
-        "0x918778e825747a892b17C66fe7D24C618262867d"
+        "eth:0x918778e825747a892b17C66fe7D24C618262867d"
      implementationNames.0x7f6B0b7589febc40419a8646EFf9801b87397063:
-        "MVM_DiscountOracle"
      implementationNames.eth:0x7f6B0b7589febc40419a8646EFf9801b87397063:
+        "MVM_DiscountOracle"
    }
```

```diff
    contract ProxyAdmin (0x8FbB8D00f7621B68F219B0B18738F07aF513D5C8) {
    +++ description: None
      address:
-        "0x8FbB8D00f7621B68F219B0B18738F07aF513D5C8"
+        "eth:0x8FbB8D00f7621B68F219B0B18738F07aF513D5C8"
      values.owner:
-        "0x48fE1f85ff8Ad9D088863A42Af54d06a1328cF21"
+        "eth:0x48fE1f85ff8Ad9D088863A42Af54d06a1328cF21"
      implementationNames.0x8FbB8D00f7621B68F219B0B18738F07aF513D5C8:
-        "ProxyAdmin"
      implementationNames.eth:0x8FbB8D00f7621B68F219B0B18738F07aF513D5C8:
+        "ProxyAdmin"
    }
```

```diff
    contract Lib_AddressManager (0x918778e825747a892b17C66fe7D24C618262867d) {
    +++ description: Contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      address:
-        "0x918778e825747a892b17C66fe7D24C618262867d"
+        "eth:0x918778e825747a892b17C66fe7D24C618262867d"
      values._1088_MVM_FraudVerifier:
-        "0x48fE1f85ff8Ad9D088863A42Af54d06a1328cF21"
+        "eth:0x48fE1f85ff8Ad9D088863A42Af54d06a1328cF21"
      values._1088_MVM_Proposer:
-        "0xf3CEB4C2ef996CdBc95C4E18c6D0CA988CC09040"
+        "eth:0xf3CEB4C2ef996CdBc95C4E18c6D0CA988CC09040"
      values._1088_MVM_Sequencer:
-        "0x6A1DB7d799FBA381F2a518cA859ED30cB8E1d41a"
+        "eth:0x6A1DB7d799FBA381F2a518cA859ED30cB8E1d41a"
      values._1088_MVM_Sequencer_Wrapper:
-        "0xcDf02971871B7736874E20B8487c019D28090019"
+        "eth:0xcDf02971871B7736874E20B8487c019D28090019"
      values.1088_MVM_FraudVerifier:
-        "0x48fE1f85ff8Ad9D088863A42Af54d06a1328cF21"
+        "eth:0x48fE1f85ff8Ad9D088863A42Af54d06a1328cF21"
      values.blobBatcher:
-        "0xae4d46bd9117cb017c5185844699c51107cb28a9"
+        "eth:0xaE4d46bD9117Cb017C5185844699c51107cB28a9"
      values.BondManager:
-        "0x595801b85628ec6979C420988b8843A40F850528"
+        "eth:0x595801b85628ec6979C420988b8843A40F850528"
      values.CanonicalTransactionChain:
-        "0x56a76bcC92361f6DF8D75476feD8843EdC70e1C9"
+        "eth:0x56a76bcC92361f6DF8D75476feD8843EdC70e1C9"
      values.ChainStorageContainer_CTC_queue:
-        "0xA91Ea6F5d1EDA8e6686639d6C88b309cF35D2E57"
+        "eth:0xA91Ea6F5d1EDA8e6686639d6C88b309cF35D2E57"
      values.DisputeGameFactory:
-        "0x1C2f0A08762f0aD4598fB5de8f9D6626a4e4aeE3"
+        "eth:0x1C2f0A08762f0aD4598fB5de8f9D6626a4e4aeE3"
      values.FaultProofLockingPool:
-        "0x2CA48fF3bBC59Bff859543E63233116ecdA3DCBb"
+        "eth:0x2CA48fF3bBC59Bff859543E63233116ecdA3DCBb"
      values.inboxAddress:
-        "0xFf00000000000000000000000000000000001088"
+        "eth:0xFf00000000000000000000000000000000001088"
      values.L2CrossDomainMessenger:
-        "0x4200000000000000000000000000000000000007"
+        "eth:0x4200000000000000000000000000000000000007"
      values.METIS_MANAGER:
-        "0x48fE1f85ff8Ad9D088863A42Af54d06a1328cF21"
+        "eth:0x48fE1f85ff8Ad9D088863A42Af54d06a1328cF21"
      values.MVM_DiscountOracle:
-        "0x7f6B0b7589febc40419a8646EFf9801b87397063"
+        "eth:0x7f6B0b7589febc40419a8646EFf9801b87397063"
      values.owner:
-        "0x48fE1f85ff8Ad9D088863A42Af54d06a1328cF21"
+        "eth:0x48fE1f85ff8Ad9D088863A42Af54d06a1328cF21"
      values.Proxy__MVM_CanonicalTransaction:
-        "0x6A1DB7d799FBA381F2a518cA859ED30cB8E1d41a"
+        "eth:0x6A1DB7d799FBA381F2a518cA859ED30cB8E1d41a"
      values.Proxy__MVM_ChainManager:
-        "0xf3d58D1794f2634d6649a978f2dc093898FEEBc0"
+        "eth:0xf3d58D1794f2634d6649a978f2dc093898FEEBc0"
      values.Proxy__MVM_Verifier:
-        "0xe70DD4dE81D282B3fa92A6700FEE8339d2d9b5cb"
+        "eth:0xe70DD4dE81D282B3fa92A6700FEE8339d2d9b5cb"
      values.Proxy__OVM_L1StandardBridge:
-        "0x3980c9ed79d2c191A89E02Fa3529C60eD6e9c04b"
+        "eth:0x3980c9ed79d2c191A89E02Fa3529C60eD6e9c04b"
+++ description: Manages the L2 state on Ethereum. L2 state batches can be appended here by proposers.
+++ severity: HIGH
      values.StateCommitmentChain:
-        "0xA2FaAAC9120c1Ff75814F0c6DdB119496a12eEA6"
+        "eth:0xA2FaAAC9120c1Ff75814F0c6DdB119496a12eEA6"
      values.undefined_MVM_FraudVerifier:
-        "0x5fF5316CD1C015970eEC83D34a69E504B577a5bb"
+        "eth:0x5fF5316CD1C015970eEC83D34a69E504B577a5bb"
      implementationNames.0x918778e825747a892b17C66fe7D24C618262867d:
-        "Lib_AddressManager"
      implementationNames.eth:0x918778e825747a892b17C66fe7D24C618262867d:
+        "Lib_AddressManager"
    }
```

```diff
    contract Metis Token (0x9E32b13ce7f2E80A01932B42553652E053D6ed8e) {
    +++ description: Metis token contract.
      address:
-        "0x9E32b13ce7f2E80A01932B42553652E053D6ed8e"
+        "eth:0x9E32b13ce7f2E80A01932B42553652E053D6ed8e"
      values.owner:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      implementationNames.0x9E32b13ce7f2E80A01932B42553652E053D6ed8e:
-        "MToken"
      implementationNames.eth:0x9E32b13ce7f2E80A01932B42553652E053D6ed8e:
+        "MToken"
    }
```

```diff
    contract StateCommitmentChain (0xA2FaAAC9120c1Ff75814F0c6DdB119496a12eEA6) {
    +++ description: The State Commitment Chain (SCC) stores a list of proposed state roots in a linked ChainStorageContainer contract. Only a permissioned state root proposer (MVM_Proposer) can submit new state roots.
      address:
-        "0xA2FaAAC9120c1Ff75814F0c6DdB119496a12eEA6"
+        "eth:0xA2FaAAC9120c1Ff75814F0c6DdB119496a12eEA6"
      values.$admin:
-        "0x48fE1f85ff8Ad9D088863A42Af54d06a1328cF21"
+        "eth:0x48fE1f85ff8Ad9D088863A42Af54d06a1328cF21"
      values.$implementation:
-        "0xe6E2DFf51b039C8EFf0b21880E2Fb008AF10B365"
+        "eth:0xe6E2DFf51b039C8EFf0b21880E2Fb008AF10B365"
      values.batches:
-        "0x10739F09f6e62689c0aA8A1878816de9e166d6f9"
+        "eth:0x10739F09f6e62689c0aA8A1878816de9e166d6f9"
      values.libAddressManager:
-        "0x918778e825747a892b17C66fe7D24C618262867d"
+        "eth:0x918778e825747a892b17C66fe7D24C618262867d"
      implementationNames.0xA2FaAAC9120c1Ff75814F0c6DdB119496a12eEA6:
-        "L1ChugSplashProxy"
      implementationNames.0xe6E2DFf51b039C8EFf0b21880E2Fb008AF10B365:
-        "MVM_StateCommitmentChain"
      implementationNames.eth:0xA2FaAAC9120c1Ff75814F0c6DdB119496a12eEA6:
+        "L1ChugSplashProxy"
      implementationNames.eth:0xe6E2DFf51b039C8EFf0b21880E2Fb008AF10B365:
+        "MVM_StateCommitmentChain"
    }
```

```diff
    EOA  (0xa6D8941F935932a531A856C2e48046DA73a1098E) {
    +++ description: None
      address:
-        "0xa6D8941F935932a531A856C2e48046DA73a1098E"
+        "eth:0xa6D8941F935932a531A856C2e48046DA73a1098E"
    }
```

```diff
    contract ChainStorageContainer-CTC-queue (0xA91Ea6F5d1EDA8e6686639d6C88b309cF35D2E57) {
    +++ description: Storage container for CTC queue.
      address:
-        "0xA91Ea6F5d1EDA8e6686639d6C88b309cF35D2E57"
+        "eth:0xA91Ea6F5d1EDA8e6686639d6C88b309cF35D2E57"
      values.libAddressManager:
-        "0x918778e825747a892b17C66fe7D24C618262867d"
+        "eth:0x918778e825747a892b17C66fe7D24C618262867d"
      implementationNames.0xA91Ea6F5d1EDA8e6686639d6C88b309cF35D2E57:
-        "ChainStorageContainer"
      implementationNames.eth:0xA91Ea6F5d1EDA8e6686639d6C88b309cF35D2E57:
+        "ChainStorageContainer"
    }
```

```diff
    EOA  (0xaE4d46bD9117Cb017C5185844699c51107cB28a9) {
    +++ description: None
      address:
-        "0xaE4d46bD9117Cb017C5185844699c51107cB28a9"
+        "eth:0xaE4d46bD9117Cb017C5185844699c51107cB28a9"
    }
```

```diff
    contract MIPS (0xAFD640204D73B02C3521eA8ea3771182527Ff057) {
    +++ description: None
      address:
-        "0xAFD640204D73B02C3521eA8ea3771182527Ff057"
+        "eth:0xAFD640204D73B02C3521eA8ea3771182527Ff057"
      values.oracle:
-        "0x789a64284e29d2225430606D3D89a9336870BBbC"
+        "eth:0x789a64284e29d2225430606D3D89a9336870BBbC"
      implementationNames.0xAFD640204D73B02C3521eA8ea3771182527Ff057:
-        "MIPS"
      implementationNames.eth:0xAFD640204D73B02C3521eA8ea3771182527Ff057:
+        "MIPS"
    }
```

```diff
    EOA  (0xB383E1331dEE29864b68f7D84b0dC289F770d846) {
    +++ description: None
      address:
-        "0xB383E1331dEE29864b68f7D84b0dC289F770d846"
+        "eth:0xB383E1331dEE29864b68f7D84b0dC289F770d846"
    }
```

```diff
    EOA  (0xB961047013F974C5b6B6F8dA4402379525316550) {
    +++ description: None
      address:
-        "0xB961047013F974C5b6B6F8dA4402379525316550"
+        "eth:0xB961047013F974C5b6B6F8dA4402379525316550"
    }
```

```diff
    EOA  (0xcDf02971871B7736874E20B8487c019D28090019) {
    +++ description: None
      address:
-        "0xcDf02971871B7736874E20B8487c019D28090019"
+        "eth:0xcDf02971871B7736874E20B8487c019D28090019"
    }
```

```diff
    EOA  (0xD294A6f4287edbFeBF9d57B79ce657BD33bB8b3b) {
    +++ description: None
      address:
-        "0xD294A6f4287edbFeBF9d57B79ce657BD33bB8b3b"
+        "eth:0xD294A6f4287edbFeBF9d57B79ce657BD33bB8b3b"
    }
```

```diff
    contract LockingPool (0xD54c868362C2098E0E46F12E7D924C6A332952Dd) {
    +++ description: Contract allowing users to lock tokens to apply to become a sequencer, receive rewards, unlock tokens to exit the sequencer, reward distribution.
      address:
-        "0xD54c868362C2098E0E46F12E7D924C6A332952Dd"
+        "eth:0xD54c868362C2098E0E46F12E7D924C6A332952Dd"
      values.$admin:
-        "0x8FbB8D00f7621B68F219B0B18738F07aF513D5C8"
+        "eth:0x8FbB8D00f7621B68F219B0B18738F07aF513D5C8"
      values.$implementation:
-        "0xD8f38c831E5032d23065Eaaee8c0620e17c04D60"
+        "eth:0xD8f38c831E5032d23065Eaaee8c0620e17c04D60"
      values.$pastUpgrades.0.2.0:
-        "0xd87Da73F82abe83915d61342199A4690cfdf4718"
+        "eth:0xd87Da73F82abe83915d61342199A4690cfdf4718"
      values.$pastUpgrades.1.2.0:
-        "0xD8f38c831E5032d23065Eaaee8c0620e17c04D60"
+        "eth:0xD8f38c831E5032d23065Eaaee8c0620e17c04D60"
      values.escrow:
-        "0x0fe382b74C3894B65c10E5C12ae60Bbd8FAf5b48"
+        "eth:0x0fe382b74C3894B65c10E5C12ae60Bbd8FAf5b48"
      values.mpcAddress:
-        "0xD294A6f4287edbFeBF9d57B79ce657BD33bB8b3b"
+        "eth:0xD294A6f4287edbFeBF9d57B79ce657BD33bB8b3b"
      values.owner:
-        "0x48fE1f85ff8Ad9D088863A42Af54d06a1328cF21"
+        "eth:0x48fE1f85ff8Ad9D088863A42Af54d06a1328cF21"
      implementationNames.0xD54c868362C2098E0E46F12E7D924C6A332952Dd:
-        "TransparentUpgradeableProxy"
      implementationNames.0xD8f38c831E5032d23065Eaaee8c0620e17c04D60:
-        "LockingPool"
      implementationNames.eth:0xD54c868362C2098E0E46F12E7D924C6A332952Dd:
+        "TransparentUpgradeableProxy"
      implementationNames.eth:0xD8f38c831E5032d23065Eaaee8c0620e17c04D60:
+        "LockingPool"
    }
```

```diff
    EOA  (0xDD6FFC7D9a4Fb420b637747edc6456340d12d377) {
    +++ description: None
      address:
-        "0xDD6FFC7D9a4Fb420b637747edc6456340d12d377"
+        "eth:0xDD6FFC7D9a4Fb420b637747edc6456340d12d377"
    }
```

```diff
    EOA  (0xDeadDeAddeAddEAddeadDEaDDEAdDeaDDeAD0000) {
    +++ description: None
      address:
-        "0xDeadDeAddeAddEAddeadDEaDDEAdDeaDDeAD0000"
+        "eth:0xDeadDeAddeAddEAddeadDEaDDEAdDeaDDeAD0000"
    }
```

```diff
    contract MVM_Verifier (0xe70DD4dE81D282B3fa92A6700FEE8339d2d9b5cb) {
    +++ description: The MVM Verifier contract is responsible for verifying the state of the MVM.
      address:
-        "0xe70DD4dE81D282B3fa92A6700FEE8339d2d9b5cb"
+        "eth:0xe70DD4dE81D282B3fa92A6700FEE8339d2d9b5cb"
      values.$admin:
-        "0x48fE1f85ff8Ad9D088863A42Af54d06a1328cF21"
+        "eth:0x48fE1f85ff8Ad9D088863A42Af54d06a1328cF21"
      values.$implementation:
-        "0x47b5A78E127Dfd521532Fdca89651c832Acb7e0E"
+        "eth:0x47b5A78E127Dfd521532Fdca89651c832Acb7e0E"
      values.libAddressManager:
-        "0x918778e825747a892b17C66fe7D24C618262867d"
+        "eth:0x918778e825747a892b17C66fe7D24C618262867d"
      values.metis:
-        "0x9E32b13ce7f2E80A01932B42553652E053D6ed8e"
+        "eth:0x9E32b13ce7f2E80A01932B42553652E053D6ed8e"
      implementationNames.0xe70DD4dE81D282B3fa92A6700FEE8339d2d9b5cb:
-        "L1ChugSplashProxy"
      implementationNames.0x47b5A78E127Dfd521532Fdca89651c832Acb7e0E:
-        "MVM_Verifier"
      implementationNames.eth:0xe70DD4dE81D282B3fa92A6700FEE8339d2d9b5cb:
+        "L1ChugSplashProxy"
      implementationNames.eth:0x47b5A78E127Dfd521532Fdca89651c832Acb7e0E:
+        "MVM_Verifier"
    }
```

```diff
    EOA  (0xf3CEB4C2ef996CdBc95C4E18c6D0CA988CC09040) {
    +++ description: None
      address:
-        "0xf3CEB4C2ef996CdBc95C4E18c6D0CA988CC09040"
+        "eth:0xf3CEB4C2ef996CdBc95C4E18c6D0CA988CC09040"
    }
```

```diff
    contract MVM_L2ChainManagerOnL1 (0xf3d58D1794f2634d6649a978f2dc093898FEEBc0) {
    +++ description: Contract that allows METIS_MANAGER to switch Sequencer.
      address:
-        "0xf3d58D1794f2634d6649a978f2dc093898FEEBc0"
+        "eth:0xf3d58D1794f2634d6649a978f2dc093898FEEBc0"
      values.$admin:
-        "0x48fE1f85ff8Ad9D088863A42Af54d06a1328cF21"
+        "eth:0x48fE1f85ff8Ad9D088863A42Af54d06a1328cF21"
      values.$implementation:
-        "0x7b5AFdA01ef32d95858A22E5fc0a6821A12CDAe5"
+        "eth:0x7b5AFdA01ef32d95858A22E5fc0a6821A12CDAe5"
      values.addressmgr:
-        "0x918778e825747a892b17C66fe7D24C618262867d"
+        "eth:0x918778e825747a892b17C66fe7D24C618262867d"
      values.messenger:
-        "0x081D1101855bD523bA69A9794e0217F0DB6323ff"
+        "eth:0x081D1101855bD523bA69A9794e0217F0DB6323ff"
      implementationNames.0xf3d58D1794f2634d6649a978f2dc093898FEEBc0:
-        "L1ChugSplashProxy"
      implementationNames.0x7b5AFdA01ef32d95858A22E5fc0a6821A12CDAe5:
-        "MVM_L2ChainManagerOnL1"
      implementationNames.eth:0xf3d58D1794f2634d6649a978f2dc093898FEEBc0:
+        "L1ChugSplashProxy"
      implementationNames.eth:0x7b5AFdA01ef32d95858A22E5fc0a6821A12CDAe5:
+        "MVM_L2ChainManagerOnL1"
    }
```

```diff
    contract DelayedWMetis (0xfA947f70c3509d5b70A606e871aE0C85397D0738) {
    +++ description: Delayed wrapped Metis token contract.
      address:
-        "0xfA947f70c3509d5b70A606e871aE0C85397D0738"
+        "eth:0xfA947f70c3509d5b70A606e871aE0C85397D0738"
      values.$admin:
-        "0x48fE1f85ff8Ad9D088863A42Af54d06a1328cF21"
+        "eth:0x48fE1f85ff8Ad9D088863A42Af54d06a1328cF21"
      values.$implementation:
-        "0xa2033fbb6213B2233a6998391ccc8E070BcC1B51"
+        "eth:0xa2033fbb6213B2233a6998391ccc8E070BcC1B51"
      values.$pastUpgrades.0.2.0:
-        "0xa2033fbb6213B2233a6998391ccc8E070BcC1B51"
+        "eth:0xa2033fbb6213B2233a6998391ccc8E070BcC1B51"
      values.config:
-        "0x2aA4E192994757c5fAB87Ba13812B89564EA57Ff"
+        "eth:0x2aA4E192994757c5fAB87Ba13812B89564EA57Ff"
      values.metisToken:
-        "0x9E32b13ce7f2E80A01932B42553652E053D6ed8e"
+        "eth:0x9E32b13ce7f2E80A01932B42553652E053D6ed8e"
      values.owner:
-        "0x48fE1f85ff8Ad9D088863A42Af54d06a1328cF21"
+        "eth:0x48fE1f85ff8Ad9D088863A42Af54d06a1328cF21"
      implementationNames.0xfA947f70c3509d5b70A606e871aE0C85397D0738:
-        "TransparentUpgradeableProxy"
      implementationNames.0xa2033fbb6213B2233a6998391ccc8E070BcC1B51:
-        "DelayedWMetis"
      implementationNames.eth:0xfA947f70c3509d5b70A606e871aE0C85397D0738:
+        "TransparentUpgradeableProxy"
      implementationNames.eth:0xa2033fbb6213B2233a6998391ccc8E070BcC1B51:
+        "DelayedWMetis"
    }
```

```diff
    EOA  (0xFf00000000000000000000000000000000001088) {
    +++ description: None
      address:
-        "0xFf00000000000000000000000000000000001088"
+        "eth:0xFf00000000000000000000000000000000001088"
    }
```

```diff
+   Status: CREATED
    contract L1CrossDomainMessenger (0x081D1101855bD523bA69A9794e0217F0DB6323ff)
    +++ description: The L1 Cross Domain Messenger (L1xDM) contract sends messages from L1 to Metis, and relays messages from Metis onto L1. In the event that a message sent from L1 to Metis is rejected for exceeding the Metis epoch gas limit, it can be resubmitted via this contract's replay function.
```

```diff
+   Status: CREATED
    contract LockingInfo (0x0fe382b74C3894B65c10E5C12ae60Bbd8FAf5b48)
    +++ description: Contract acting as an escrow for METIS tokens managed by LockingPool.
```

```diff
+   Status: CREATED
    contract ChainStorageContainer-SCC-batches (0x10739F09f6e62689c0aA8A1878816de9e166d6f9)
    +++ description: Storage container for SCC batches.
```

```diff
+   Status: CREATED
    contract DisputeGameFactory (0x1C2f0A08762f0aD4598fB5de8f9D6626a4e4aeE3)
    +++ description: Factory contract for creating dispute games. Unlike in standard OP Stack chains, games are not created to propose state roots. Instead, games are created on demand by the permissioned `GameCreator` only should a dispute arise.
```

```diff
+   Status: CREATED
    contract MetisConfig (0x2aA4E192994757c5fAB87Ba13812B89564EA57Ff)
    +++ description: Contract used to manage configuration of global Metis values.
```

```diff
+   Status: CREATED
    contract FaultProofLockingPool (0x2CA48fF3bBC59Bff859543E63233116ecdA3DCBb)
    +++ description: The FaultProofLockingPool is a contract that allows sequencers to lock their funds for a certain period of time. The contract is used in the Metis protocol to ensure that sequencers have enough funds to cover the potential losses from disputes. It currently has a balance of 0 METIS.
```

```diff
+   Status: CREATED
    contract ChainStorageContainer-CTC-batches (0x38473Feb3A6366757A249dB2cA4fBB2C663416B7)
    +++ description: Storage container for CTC batches.
```

```diff
+   Status: CREATED
    contract L1StandardBridge (0x3980c9ed79d2c191A89E02Fa3529C60eD6e9c04b)
    +++ description: Main entry point for users depositing ERC20 tokens and ETH that do not require custom gateway.
```

```diff
+   Status: CREATED
    contract FaultDisputeGame (0x477f9d1CC62Ea2c8ff0963B11C5D782Cef536235)
    +++ description: Contract for handling fault disputes (should games be created). Successfully disputed batches are marked as disputed to the StateCommitmentChain.
```

```diff
+   Status: CREATED
    contract Metis Multisig (0x48fE1f85ff8Ad9D088863A42Af54d06a1328cF21)
    +++ description: Can pause, censor, instantly upgrade the bridge and upgrade other critical contracts in the system.
```

```diff
+   Status: CREATED
    contract CanonicalTransactionChain (0x56a76bcC92361f6DF8D75476feD8843EdC70e1C9)
    +++ description: The Canonical Transaction Chain (CTC) contract is an append-only log of transactions which must be applied to the OVM state. Given that transactions batch hashes are sent to an EOA address, it allows any account to enqueue() a transaction, which the Sequencer must eventually append to the rollup state.
```

```diff
+   Status: CREATED
    contract BondManager (0x595801b85628ec6979C420988b8843A40F850528)
    +++ description: The Bond Manager contract will handle deposits in the form of an ERC20 token from bonded Proposers. It will also handle the accounting of gas costs spent by a Verifier during the course of a challenge. In the event of a successful challenge, the faulty Proposer's bond will be slashed, and the Verifier's gas costs will be refunded. Current mock implementation allows only OVM_Proposer to propose new state roots. No slashing is implemented.
```

```diff
+   Status: CREATED
    contract RewardEscrowerMultisig (0x62478E4eeb4070fE399866aB05e821AB97200947)
    +++ description: Escrows staking rewards for Sequencers.
```

```diff
+   Status: CREATED
    contract MVM_CanonicalTransaction (0x6A1DB7d799FBA381F2a518cA859ED30cB8E1d41a)
    +++ description: MVM CanonicalTransaction is a wrapper of Canonical Transaction Chain that implements optimistic data availability scheme L1. If Sequencer is not malicious, it simply forwards appendSequencerBatch() calls to CanonicalTransactionChain.
```

```diff
+   Status: CREATED
    contract PreimageOracle (0x789a64284e29d2225430606D3D89a9336870BBbC)
    +++ description: Oracle for providing preimages.
```

```diff
+   Status: CREATED
    contract MVM_DiscountOracle (0x7f6B0b7589febc40419a8646EFf9801b87397063)
    +++ description: Oracle specifying user fees for sending L1 -> Metis messages and other parameters for cross-chain communication.
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x8FbB8D00f7621B68F219B0B18738F07aF513D5C8)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Lib_AddressManager (0x918778e825747a892b17C66fe7D24C618262867d)
    +++ description: Contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
```

```diff
+   Status: CREATED
    contract Metis Token (0x9E32b13ce7f2E80A01932B42553652E053D6ed8e)
    +++ description: Metis token contract.
```

```diff
+   Status: CREATED
    contract StateCommitmentChain (0xA2FaAAC9120c1Ff75814F0c6DdB119496a12eEA6)
    +++ description: The State Commitment Chain (SCC) stores a list of proposed state roots in a linked ChainStorageContainer contract. Only a permissioned state root proposer (MVM_Proposer) can submit new state roots.
```

```diff
+   Status: CREATED
    contract ChainStorageContainer-CTC-queue (0xA91Ea6F5d1EDA8e6686639d6C88b309cF35D2E57)
    +++ description: Storage container for CTC queue.
```

```diff
+   Status: CREATED
    contract MIPS (0xAFD640204D73B02C3521eA8ea3771182527Ff057)
    +++ description: None
```

```diff
+   Status: CREATED
    contract LockingPool (0xD54c868362C2098E0E46F12E7D924C6A332952Dd)
    +++ description: Contract allowing users to lock tokens to apply to become a sequencer, receive rewards, unlock tokens to exit the sequencer, reward distribution.
```

```diff
+   Status: CREATED
    contract MVM_Verifier (0xe70DD4dE81D282B3fa92A6700FEE8339d2d9b5cb)
    +++ description: The MVM Verifier contract is responsible for verifying the state of the MVM.
```

```diff
+   Status: CREATED
    contract MVM_L2ChainManagerOnL1 (0xf3d58D1794f2634d6649a978f2dc093898FEEBc0)
    +++ description: Contract that allows METIS_MANAGER to switch Sequencer.
```

```diff
+   Status: CREATED
    contract DelayedWMetis (0xfA947f70c3509d5b70A606e871aE0C85397D0738)
    +++ description: Delayed wrapped Metis token contract.
```

Generated with discovered.json: 0x582819c46777f619913faed86222a47108cbd7da

# Diff at Fri, 04 Jul 2025 12:19:09 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f56dc47fe915564d4555300304da4d3bcbc087f block: 22774371
- current block number: 22774371

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22774371 (main branch discovery), not current.

```diff
    contract Metis Multisig (0x48fE1f85ff8Ad9D088863A42Af54d06a1328cF21) {
    +++ description: Can pause, censor, instantly upgrade the bridge and upgrade other critical contracts in the system.
      receivedPermissions.0.from:
-        "ethereum:0x1C2f0A08762f0aD4598fB5de8f9D6626a4e4aeE3"
+        "eth:0x1C2f0A08762f0aD4598fB5de8f9D6626a4e4aeE3"
      receivedPermissions.1.from:
-        "ethereum:0x918778e825747a892b17C66fe7D24C618262867d"
+        "eth:0x918778e825747a892b17C66fe7D24C618262867d"
      receivedPermissions.2.from:
-        "ethereum:0x081D1101855bD523bA69A9794e0217F0DB6323ff"
+        "eth:0x081D1101855bD523bA69A9794e0217F0DB6323ff"
      receivedPermissions.3.via.0.address:
-        "ethereum:0x8FbB8D00f7621B68F219B0B18738F07aF513D5C8"
+        "eth:0x8FbB8D00f7621B68F219B0B18738F07aF513D5C8"
      receivedPermissions.3.from:
-        "ethereum:0x0fe382b74C3894B65c10E5C12ae60Bbd8FAf5b48"
+        "eth:0x0fe382b74C3894B65c10E5C12ae60Bbd8FAf5b48"
      receivedPermissions.4.from:
-        "ethereum:0x1C2f0A08762f0aD4598fB5de8f9D6626a4e4aeE3"
+        "eth:0x1C2f0A08762f0aD4598fB5de8f9D6626a4e4aeE3"
      receivedPermissions.5.from:
-        "ethereum:0x2CA48fF3bBC59Bff859543E63233116ecdA3DCBb"
+        "eth:0x2CA48fF3bBC59Bff859543E63233116ecdA3DCBb"
      receivedPermissions.6.from:
-        "ethereum:0x3980c9ed79d2c191A89E02Fa3529C60eD6e9c04b"
+        "eth:0x3980c9ed79d2c191A89E02Fa3529C60eD6e9c04b"
      receivedPermissions.7.from:
-        "ethereum:0x6A1DB7d799FBA381F2a518cA859ED30cB8E1d41a"
+        "eth:0x6A1DB7d799FBA381F2a518cA859ED30cB8E1d41a"
      receivedPermissions.8.from:
-        "ethereum:0xA2FaAAC9120c1Ff75814F0c6DdB119496a12eEA6"
+        "eth:0xA2FaAAC9120c1Ff75814F0c6DdB119496a12eEA6"
      receivedPermissions.9.via.0.address:
-        "ethereum:0x8FbB8D00f7621B68F219B0B18738F07aF513D5C8"
+        "eth:0x8FbB8D00f7621B68F219B0B18738F07aF513D5C8"
      receivedPermissions.9.from:
-        "ethereum:0xD54c868362C2098E0E46F12E7D924C6A332952Dd"
+        "eth:0xD54c868362C2098E0E46F12E7D924C6A332952Dd"
      receivedPermissions.10.from:
-        "ethereum:0xe70DD4dE81D282B3fa92A6700FEE8339d2d9b5cb"
+        "eth:0xe70DD4dE81D282B3fa92A6700FEE8339d2d9b5cb"
      receivedPermissions.11.from:
-        "ethereum:0xf3d58D1794f2634d6649a978f2dc093898FEEBc0"
+        "eth:0xf3d58D1794f2634d6649a978f2dc093898FEEBc0"
      receivedPermissions.12.from:
-        "ethereum:0xfA947f70c3509d5b70A606e871aE0C85397D0738"
+        "eth:0xfA947f70c3509d5b70A606e871aE0C85397D0738"
      directlyReceivedPermissions.0.from:
-        "ethereum:0x8FbB8D00f7621B68F219B0B18738F07aF513D5C8"
+        "eth:0x8FbB8D00f7621B68F219B0B18738F07aF513D5C8"
    }
```

```diff
    contract ProxyAdmin (0x8FbB8D00f7621B68F219B0B18738F07aF513D5C8) {
    +++ description: None
      directlyReceivedPermissions.0.from:
-        "ethereum:0x0fe382b74C3894B65c10E5C12ae60Bbd8FAf5b48"
+        "eth:0x0fe382b74C3894B65c10E5C12ae60Bbd8FAf5b48"
      directlyReceivedPermissions.1.from:
-        "ethereum:0xD54c868362C2098E0E46F12E7D924C6A332952Dd"
+        "eth:0xD54c868362C2098E0E46F12E7D924C6A332952Dd"
    }
```

```diff
    EOA  (0xaE4d46bD9117Cb017C5185844699c51107cB28a9) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0x918778e825747a892b17C66fe7D24C618262867d"
+        "eth:0x918778e825747a892b17C66fe7D24C618262867d"
    }
```

```diff
    EOA  (0xDD6FFC7D9a4Fb420b637747edc6456340d12d377) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0x081D1101855bD523bA69A9794e0217F0DB6323ff"
+        "eth:0x081D1101855bD523bA69A9794e0217F0DB6323ff"
    }
```

```diff
    EOA  (0xf3CEB4C2ef996CdBc95C4E18c6D0CA988CC09040) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0x918778e825747a892b17C66fe7D24C618262867d"
+        "eth:0x918778e825747a892b17C66fe7D24C618262867d"
    }
```

Generated with discovered.json: 0x4e028964bfbdf05a633872f5c0bd914532d79de2

# Diff at Tue, 24 Jun 2025 12:44:56 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@165a3574e7a5112b92cf5b6d87a202235001fcdf block: 22739723
- current block number: 22774371

## Description

Adds missing hardcoded values.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22739723 (main branch discovery), not current.

```diff
    EOA  (0x1A9da0aedA630dDf2748a453BF6d92560762D914) {
    +++ description: None
      receivedPermissions:
-        [{"permission":"sequence","from":"ethereum:0x918778e825747a892b17C66fe7D24C618262867d","role":".txChainBatcher"}]
    }
```

```diff
    contract Lib_AddressManager (0x918778e825747a892b17C66fe7D24C618262867d) {
    +++ description: Contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      values.txChainBatcher:
-        "0x1A9da0aedA630dDf2748a453BF6d92560762D914"
      values.inboxAddress:
+        "0xFf00000000000000000000000000000000001088"
    }
```

Generated with discovered.json: 0x1e232db2a1106231a47c3641020ffaf90c56ce7c

# Diff at Fri, 20 Jun 2025 09:04:23 GMT:

- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@d5c484ae81a750a81728eec4c46d10685ad38407 block: 22610669
- current block number: 22739723

## Description

The game creator role is still permissioned. The DisputeGameFactory is updated to contain a disputeTimeout function. The function allows to transfer a bond from the new FaultProofLockingPool contract (through timeoutSlashs()) to the dispute creator (which created the dispute with dispute() on the DisputeGameFactory), should a game not be created within the DISPUTE_TIMEOUT_PERIOD (2 days from the dispute creation). Sequencers are supposed to deposit METIS tokens to this pool so that it can be slashed in case of successful dispute.
In practice should a malicious state root be proposed and unchallenged by the Metis multisig, the user disputing gets partly compensated with a bond from the pool (currently an unknown amount as it depends on deposits), while the potential loss amounts to the full value in the bridge (~130m).

## Watched changes

```diff
    contract DisputeGameFactory (0x1C2f0A08762f0aD4598fB5de8f9D6626a4e4aeE3) {
    +++ description: Factory contract for creating dispute games. Unlike in standard OP Stack chains, games are not created to propose state roots. Instead, games are created on demand by the permissioned `GameCreator` only should a dispute arise.
      sourceHashes.1:
-        "0x39144681962383da8221186c19e95a5cbb0d397751dceaab7cf7237aa369a892"
+        "0x45c38e69c9d8bca18eef505efeea8dfbe4deec90b00e915cedc1a2bb22743119"
      values.$admin:
-        "0x280f9c9DF12431Aed70731D5CD3d192456606a21"
+        "0x48fE1f85ff8Ad9D088863A42Af54d06a1328cF21"
      values.$implementation:
-        "0xb864eEca2a047058Eb1e28e43FEAEBE8F38843B3"
+        "0xEc2EB7E045EB9D835a93113DABaa6Ae7a6776E45"
      values.$pastUpgrades.1:
+        ["2025-06-19T02:52:35.000Z","0xfca0728fa948cf329424111232b2c80521c66bf13f49e9fff118a8de282f1cd5",["0xEc2EB7E045EB9D835a93113DABaa6Ae7a6776E45"]]
      values.$upgradeCount:
-        1
+        2
      values.DISPUTE_TIMEOUT_PERIOD:
+        172800
      implementationNames.0xb864eEca2a047058Eb1e28e43FEAEBE8F38843B3:
-        "DisputeGameFactory"
      implementationNames.0xEc2EB7E045EB9D835a93113DABaa6Ae7a6776E45:
+        "DisputeGameFactory"
    }
```

```diff
-   Status: DELETED
    contract ProxyAdmin (0x280f9c9DF12431Aed70731D5CD3d192456606a21)
    +++ description: None
```

```diff
    contract FaultProofLockingPool (0x2CA48fF3bBC59Bff859543E63233116ecdA3DCBb) {
    +++ description: The FaultProofLockingPool is a contract that allows sequencers to lock their funds for a certain period of time. The contract is used in the Metis protocol to ensure that sequencers have enough funds to cover the potential losses from disputes. It currently has a balance of 0 METIS.
      name:
-        "LockingPool"
+        "FaultProofLockingPool"
      sourceHashes.1:
-        "0x2daed4f8b60d2e56f9557c3fb4a471cdc6259d6be64746b08106a3fedf37f18a"
+        "0x02c0d23b76bc8c0494b55f759d5d258315ed65ca85f13a0741bce12941ab0bb5"
      values.$admin:
-        "0x280f9c9DF12431Aed70731D5CD3d192456606a21"
+        "0x48fE1f85ff8Ad9D088863A42Af54d06a1328cF21"
      values.$implementation:
-        "0x6d554097D5784a7184650B95ba7EA359d162Dbb7"
+        "0xE141db3Ed25A58BB8BBd331AE373605108aaAAe4"
      values.$pastUpgrades.1:
+        ["2025-06-19T02:52:59.000Z","0x6e859980e53cbf8c232b3c491787274de2ec78c2af68069d0d910cd452fd99a5",["0xE141db3Ed25A58BB8BBd331AE373605108aaAAe4"]]
      values.$upgradeCount:
-        1
+        2
      implementationNames.0x6d554097D5784a7184650B95ba7EA359d162Dbb7:
-        "LockingPool"
      implementationNames.0xE141db3Ed25A58BB8BBd331AE373605108aaAAe4:
+        "LockingPool"
      template:
+        "metis/FaultProofLockingPool"
      description:
+        "The FaultProofLockingPool is a contract that allows sequencers to lock their funds for a certain period of time. The contract is used in the Metis protocol to ensure that sequencers have enough funds to cover the potential losses from disputes. It currently has a balance of 0 METIS."
    }
```

```diff
    contract Metis Multisig (0x48fE1f85ff8Ad9D088863A42Af54d06a1328cF21) {
    +++ description: Can pause, censor, instantly upgrade the bridge and upgrade other critical contracts in the system.
      receivedPermissions.12:
+        {"permission":"upgrade","from":"ethereum:0x0fe382b74C3894B65c10E5C12ae60Bbd8FAf5b48","role":"admin","via":[{"address":"ethereum:0x8FbB8D00f7621B68F219B0B18738F07aF513D5C8"}]}
      receivedPermissions.11:
+        {"permission":"upgrade","from":"ethereum:0xfA947f70c3509d5b70A606e871aE0C85397D0738","role":"admin"}
      receivedPermissions.10:
+        {"permission":"upgrade","from":"ethereum:0xD54c868362C2098E0E46F12E7D924C6A332952Dd","role":"admin","via":[{"address":"ethereum:0x8FbB8D00f7621B68F219B0B18738F07aF513D5C8"}]}
      receivedPermissions.9.from:
-        "ethereum:0x0fe382b74C3894B65c10E5C12ae60Bbd8FAf5b48"
+        "ethereum:0x081D1101855bD523bA69A9794e0217F0DB6323ff"
      receivedPermissions.9.via:
-        [{"address":"ethereum:0x8FbB8D00f7621B68F219B0B18738F07aF513D5C8"}]
      receivedPermissions.8.from:
-        "ethereum:0xD54c868362C2098E0E46F12E7D924C6A332952Dd"
+        "ethereum:0xe70DD4dE81D282B3fa92A6700FEE8339d2d9b5cb"
      receivedPermissions.8.via:
-        [{"address":"ethereum:0x8FbB8D00f7621B68F219B0B18738F07aF513D5C8"}]
      receivedPermissions.7.from:
-        "ethereum:0x081D1101855bD523bA69A9794e0217F0DB6323ff"
+        "ethereum:0x3980c9ed79d2c191A89E02Fa3529C60eD6e9c04b"
      receivedPermissions.6.from:
-        "ethereum:0xe70DD4dE81D282B3fa92A6700FEE8339d2d9b5cb"
+        "ethereum:0xf3d58D1794f2634d6649a978f2dc093898FEEBc0"
      receivedPermissions.5.from:
-        "ethereum:0x3980c9ed79d2c191A89E02Fa3529C60eD6e9c04b"
+        "ethereum:0x6A1DB7d799FBA381F2a518cA859ED30cB8E1d41a"
      receivedPermissions.4.from:
-        "ethereum:0xf3d58D1794f2634d6649a978f2dc093898FEEBc0"
+        "ethereum:0x2CA48fF3bBC59Bff859543E63233116ecdA3DCBb"
      receivedPermissions.3.from:
-        "ethereum:0x6A1DB7d799FBA381F2a518cA859ED30cB8E1d41a"
+        "ethereum:0xA2FaAAC9120c1Ff75814F0c6DdB119496a12eEA6"
      receivedPermissions.2.from:
-        "ethereum:0xA2FaAAC9120c1Ff75814F0c6DdB119496a12eEA6"
+        "ethereum:0x1C2f0A08762f0aD4598fB5de8f9D6626a4e4aeE3"
    }
```

```diff
    contract DelayedWMetis (0xfA947f70c3509d5b70A606e871aE0C85397D0738) {
    +++ description: Delayed wrapped Metis token contract.
      values.$admin:
-        "0x280f9c9DF12431Aed70731D5CD3d192456606a21"
+        "0x48fE1f85ff8Ad9D088863A42Af54d06a1328cF21"
    }
```

## Source code changes

```diff
.../DisputeGameFactory/DisputeGameFactory.sol      |  57 +++++++-
 .../FaultProofLockingPool}/LockingPool.sol         |  76 +++++++++--
 .../TransparentUpgradeableProxy.p.sol              |   0
 .../LockingPool}/LockingPool.sol                   |   0
 .../LockingPool}/TransparentUpgradeableProxy.p.sol |   0
 .../dev/null                                       | 147 ---------------------
 .../ProxyAdmin.sol}                                |   0
 7 files changed, 119 insertions(+), 161 deletions(-)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22610669 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x280f9c9DF12431Aed70731D5CD3d192456606a21) {
    +++ description: None
      directlyReceivedPermissions.2:
+        {"permission":"upgrade","from":"ethereum:0xfA947f70c3509d5b70A606e871aE0C85397D0738","role":"admin"}
      directlyReceivedPermissions.1.from:
-        "ethereum:0xfA947f70c3509d5b70A606e871aE0C85397D0738"
+        "ethereum:0x2CA48fF3bBC59Bff859543E63233116ecdA3DCBb"
    }
```

```diff
    EOA  (0x5345fCDCF5449a40df030798C195603d27691502) {
    +++ description: None
      receivedPermissions.2:
+        {"permission":"upgrade","from":"ethereum:0xfA947f70c3509d5b70A606e871aE0C85397D0738","role":"admin","via":[{"address":"ethereum:0x280f9c9DF12431Aed70731D5CD3d192456606a21"}]}
      receivedPermissions.1.from:
-        "ethereum:0xfA947f70c3509d5b70A606e871aE0C85397D0738"
+        "ethereum:0x2CA48fF3bBC59Bff859543E63233116ecdA3DCBb"
    }
```

```diff
    contract Lib_AddressManager (0x918778e825747a892b17C66fe7D24C618262867d) {
    +++ description: Contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      values.FaultProofLockingPool:
+        "0x2CA48fF3bBC59Bff859543E63233116ecdA3DCBb"
    }
```

```diff
+   Status: CREATED
    contract LockingPool (0x2CA48fF3bBC59Bff859543E63233116ecdA3DCBb)
    +++ description: None
```

Generated with discovered.json: 0x03c87f9692339be57e9e0d17b4d449d3642ecc25

# Diff at Mon, 16 Jun 2025 08:42:19 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@e1208475abce20cea1768d2e4878c03350c1b7c9 block: 22610669
- current block number: 22610669

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22610669 (main branch discovery), not current.

```diff
    contract L1CrossDomainMessenger (0x081D1101855bD523bA69A9794e0217F0DB6323ff) {
    +++ description: The L1 Cross Domain Messenger (L1xDM) contract sends messages from L1 to Metis, and relays messages from Metis onto L1. In the event that a message sent from L1 to Metis is rejected for exceeding the Metis epoch gas limit, it can be resubmitted via this contract's replay function.
      values.$admin:
+        "0x48fE1f85ff8Ad9D088863A42Af54d06a1328cF21"
    }
```

```diff
    contract Metis Multisig (0x48fE1f85ff8Ad9D088863A42Af54d06a1328cF21) {
    +++ description: Can pause, censor, instantly upgrade the bridge and upgrade other critical contracts in the system.
      receivedPermissions.9:
+        {"permission":"upgrade","from":"ethereum:0x0fe382b74C3894B65c10E5C12ae60Bbd8FAf5b48","role":"admin","via":[{"address":"ethereum:0x8FbB8D00f7621B68F219B0B18738F07aF513D5C8"}]}
      receivedPermissions.8.from:
-        "ethereum:0x0fe382b74C3894B65c10E5C12ae60Bbd8FAf5b48"
+        "ethereum:0xD54c868362C2098E0E46F12E7D924C6A332952Dd"
      receivedPermissions.7.from:
-        "ethereum:0xD54c868362C2098E0E46F12E7D924C6A332952Dd"
+        "ethereum:0x081D1101855bD523bA69A9794e0217F0DB6323ff"
      receivedPermissions.7.via:
-        [{"address":"ethereum:0x8FbB8D00f7621B68F219B0B18738F07aF513D5C8"}]
    }
```

Generated with discovered.json: 0xb13163a69b9e656ea98b6cb2ca6ad0c0e5a9cac0

# Diff at Sun, 01 Jun 2025 16:06:11 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@9b0628e2bcceefdad3711656588a7d18b4de026c block: 22567898
- current block number: 22610669

## Description

Added the state delete permission which is the only way to propagate a successful state challenge to the bridge's source of truth (ChainStorageContainer-SCC-batches VIA StateCommitmentChain).

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22567898 (main branch discovery), not current.

```diff
    contract Metis Multisig (0x48fE1f85ff8Ad9D088863A42Af54d06a1328cF21) {
    +++ description: Can pause, censor, instantly upgrade the bridge and upgrade other critical contracts in the system.
      receivedPermissions.8:
+        {"permission":"upgrade","from":"0x3980c9ed79d2c191A89E02Fa3529C60eD6e9c04b","role":"admin"}
      receivedPermissions.7.from:
-        "0x3980c9ed79d2c191A89E02Fa3529C60eD6e9c04b"
+        "0xe70DD4dE81D282B3fa92A6700FEE8339d2d9b5cb"
      receivedPermissions.6.from:
-        "0xe70DD4dE81D282B3fa92A6700FEE8339d2d9b5cb"
+        "0xf3d58D1794f2634d6649a978f2dc093898FEEBc0"
      receivedPermissions.5.permission:
-        "upgrade"
+        "stateDeleterMetis"
      receivedPermissions.5.from:
-        "0xf3d58D1794f2634d6649a978f2dc093898FEEBc0"
+        "0x918778e825747a892b17C66fe7D24C618262867d"
      receivedPermissions.5.role:
-        "admin"
+        ".1088_MVM_FraudVerifier"
      receivedPermissions.5.description:
+        "Can delete batches from the StateCommitmentChain."
    }
```

```diff
    EOA  (0xDD6FFC7D9a4Fb420b637747edc6456340d12d377) {
    +++ description: None
      receivedPermissions:
+        [{"permission":"interact","from":"0x081D1101855bD523bA69A9794e0217F0DB6323ff","description":"block (censor) specific L2->L1 messages (e.g. withdrawals), so that they cannot be relayed, pause the contract.","role":".owner"}]
    }
```

Generated with discovered.json: 0xc98c9d24d53925a7cb95cd03abb47e59ae234d5f

# Diff at Mon, 26 May 2025 15:48:31 GMT:

- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@d675d0bd208eadc685b2cb489512b83f62c0890e block: 22545767
- current block number: 22567898

## Description

Added access control to DisputeGameFactory.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22545767 (main branch discovery), not current.

```diff
    EOA  (0x1A9da0aedA630dDf2748a453BF6d92560762D914) {
    +++ description: None
      receivedPermissions:
+        [{"permission":"sequence","from":"0x918778e825747a892b17C66fe7D24C618262867d","role":".txChainBatcher"}]
    }
```

```diff
    contract DisputeGameFactory (0x1C2f0A08762f0aD4598fB5de8f9D6626a4e4aeE3) {
    +++ description: Factory contract for creating dispute games. Unlike in standard OP Stack chains, games are not created to propose state roots. Instead, games are created on demand by the permissioned `GameCreator` only should a dispute arise.
      description:
-        "Factory contract for creating dispute games. Currently not used, no games are created."
+        "Factory contract for creating dispute games. Unlike in standard OP Stack chains, games are not created to propose state roots. Instead, games are created on demand by the permissioned `GameCreator` only should a dispute arise."
      values.accessControl:
+        {"DEFAULT_ADMIN_ROLE":{"adminRole":"DEFAULT_ADMIN_ROLE","members":["0x48fE1f85ff8Ad9D088863A42Af54d06a1328cF21"]},"GAME_CREATOR_ROLE":{"adminRole":"DEFAULT_ADMIN_ROLE","members":["0x48fE1f85ff8Ad9D088863A42Af54d06a1328cF21"]}}
      values.gameCreator:
+        ["0x48fE1f85ff8Ad9D088863A42Af54d06a1328cF21"]
    }
```

```diff
    contract Metis Multisig (0x48fE1f85ff8Ad9D088863A42Af54d06a1328cF21) {
    +++ description: Can pause, censor, instantly upgrade the bridge and upgrade other critical contracts in the system.
      receivedPermissions.7:
+        {"permission":"upgrade","from":"0x3980c9ed79d2c191A89E02Fa3529C60eD6e9c04b","role":"admin"}
      receivedPermissions.6.from:
-        "0x3980c9ed79d2c191A89E02Fa3529C60eD6e9c04b"
+        "0xe70DD4dE81D282B3fa92A6700FEE8339d2d9b5cb"
      receivedPermissions.5.from:
-        "0xe70DD4dE81D282B3fa92A6700FEE8339d2d9b5cb"
+        "0xf3d58D1794f2634d6649a978f2dc093898FEEBc0"
      receivedPermissions.4.from:
-        "0xf3d58D1794f2634d6649a978f2dc093898FEEBc0"
+        "0x6A1DB7d799FBA381F2a518cA859ED30cB8E1d41a"
      receivedPermissions.3.from:
-        "0x6A1DB7d799FBA381F2a518cA859ED30cB8E1d41a"
+        "0xA2FaAAC9120c1Ff75814F0c6DdB119496a12eEA6"
      receivedPermissions.2.from:
-        "0xA2FaAAC9120c1Ff75814F0c6DdB119496a12eEA6"
+        "0xD54c868362C2098E0E46F12E7D924C6A332952Dd"
      receivedPermissions.2.via:
+        [{"address":"0x8FbB8D00f7621B68F219B0B18738F07aF513D5C8"}]
      receivedPermissions.1.from:
-        "0xD54c868362C2098E0E46F12E7D924C6A332952Dd"
+        "0x0fe382b74C3894B65c10E5C12ae60Bbd8FAf5b48"
      receivedPermissions.0.permission:
-        "upgrade"
+        "metisGameCreator"
      receivedPermissions.0.from:
-        "0x0fe382b74C3894B65c10E5C12ae60Bbd8FAf5b48"
+        "0x1C2f0A08762f0aD4598fB5de8f9D6626a4e4aeE3"
      receivedPermissions.0.role:
-        "admin"
+        ".gameCreator"
      receivedPermissions.0.via:
-        [{"address":"0x8FbB8D00f7621B68F219B0B18738F07aF513D5C8"}]
    }
```

```diff
    contract Lib_AddressManager (0x918778e825747a892b17C66fe7D24C618262867d) {
    +++ description: Contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      values.blobBatcher:
+        "0xae4d46bd9117cb017c5185844699c51107cb28a9"
      values.txChainBatcher:
+        "0x1A9da0aedA630dDf2748a453BF6d92560762D914"
    }
```

```diff
    EOA  (0xaE4d46bD9117Cb017C5185844699c51107cB28a9) {
    +++ description: None
      receivedPermissions:
+        [{"permission":"sequence","from":"0x918778e825747a892b17C66fe7D24C618262867d","role":".blobBatcher"}]
    }
```

```diff
    EOA  (0xf3CEB4C2ef996CdBc95C4E18c6D0CA988CC09040) {
    +++ description: None
      receivedPermissions:
+        [{"permission":"propose","from":"0x918778e825747a892b17C66fe7D24C618262867d","role":"._1088_MVM_Proposer"}]
    }
```

Generated with discovered.json: 0xac83b4b3d25472fc55c1908686ca00de7665f81b

# Diff at Fri, 23 May 2025 13:41:14 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@0981ad29dde2407ba3849802ee6a490d2d0799a5 block: 22494955
- current block number: 22545767

## Description

Templatized contracts.

Batcher is posting blobs to the inbox, the authorized batcher is in L2 node config (https://github.com/MetisProtocol/mvm/blob/e816c6c461a8e91db3a9ccaa33d2d0f6a60633d5/go/op-program/chainconfig/rollupcfg.go#L85)

However, DisputeGameFactory is not used, meaning that no games a created. 
In theory, games could be played and disputed state batches can be marked as such in the StateCommitmentChain. Then, these flagged batches could be deleted (within the fraud proof window). However, batches can only be deleted from the MVM_Verifier contract, which currently is set to a Multisig. So proof system could be operational if a) games are created b) Multisig acts as permissioned challenger.

## Watched changes

```diff
    contract Lib_AddressManager (0x918778e825747a892b17C66fe7D24C618262867d) {
    +++ description: Contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      values._1088_MVM_FraudVerifier:
-        "0xe70DD4dE81D282B3fa92A6700FEE8339d2d9b5cb"
+        "0x48fE1f85ff8Ad9D088863A42Af54d06a1328cF21"
      values.1088_MVM_FraudVerifier:
-        "0xe70DD4dE81D282B3fa92A6700FEE8339d2d9b5cb"
+        "0x48fE1f85ff8Ad9D088863A42Af54d06a1328cF21"
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22494955 (main branch discovery), not current.

```diff
    contract L1CrossDomainMessenger (0x081D1101855bD523bA69A9794e0217F0DB6323ff) {
    +++ description: The L1 Cross Domain Messenger (L1xDM) contract sends messages from L1 to Metis, and relays messages from Metis onto L1. In the event that a message sent from L1 to Metis is rejected for exceeding the Metis epoch gas limit, it can be resubmitted via this contract's replay function.
      template:
+        "metis/L1CrossDomainMessenger"
      description:
+        "The L1 Cross Domain Messenger (L1xDM) contract sends messages from L1 to Metis, and relays messages from Metis onto L1. In the event that a message sent from L1 to Metis is rejected for exceeding the Metis epoch gas limit, it can be resubmitted via this contract's replay function."
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract LockingInfo (0x0fe382b74C3894B65c10E5C12ae60Bbd8FAf5b48) {
    +++ description: Contract acting as an escrow for METIS tokens managed by LockingPool.
      values.proxiableUUID:
+        "EXPECT_REVERT"
      template:
+        "metis/LockingInfo"
      description:
+        "Contract acting as an escrow for METIS tokens managed by LockingPool."
    }
```

```diff
    contract ChainStorageContainer-SCC-batches (0x10739F09f6e62689c0aA8A1878816de9e166d6f9) {
    +++ description: Storage container for SCC batches.
      template:
+        "metis/ChainStorageContainer-SCC-batches"
      description:
+        "Storage container for SCC batches."
    }
```

```diff
    contract DisputeGameFactory (0x1C2f0A08762f0aD4598fB5de8f9D6626a4e4aeE3) {
    +++ description: Factory contract for creating dispute games. Currently not used, no games are created.
      template:
+        "metis/DisputeGameFactory_Metis"
      description:
+        "Factory contract for creating dispute games. Currently not used, no games are created."
    }
```

```diff
    contract MetisConfig (0x2aA4E192994757c5fAB87Ba13812B89564EA57Ff) {
    +++ description: Contract used to manage configuration of global Metis values.
      template:
+        "metis/MetisConfig"
      description:
+        "Contract used to manage configuration of global Metis values."
    }
```

```diff
    contract ChainStorageContainer-CTC-batches (0x38473Feb3A6366757A249dB2cA4fBB2C663416B7) {
    +++ description: Storage container for CTC batches.
      template:
+        "metis/ChainStorageContainer-CTC-batches"
      description:
+        "Storage container for CTC batches."
    }
```

```diff
    contract L1StandardBridge (0x3980c9ed79d2c191A89E02Fa3529C60eD6e9c04b) {
    +++ description: Main entry point for users depositing ERC20 tokens and ETH that do not require custom gateway.
      values.proxiableUUID:
+        "EXPECT_REVERT"
      template:
+        "metis/L1StandardBridge"
      description:
+        "Main entry point for users depositing ERC20 tokens and ETH that do not require custom gateway."
    }
```

```diff
    contract FaultDisputeGame (0x477f9d1CC62Ea2c8ff0963B11C5D782Cef536235) {
    +++ description: Contract for handling fault disputes (should games be created). Successfully disputed batches are marked as disputed to the StateCommitmentChain.
      template:
+        "metis/FaultDisputeGame"
      description:
+        "Contract for handling fault disputes (should games be created). Successfully disputed batches are marked as disputed to the StateCommitmentChain."
    }
```

```diff
    contract Metis Multisig (0x48fE1f85ff8Ad9D088863A42Af54d06a1328cF21) {
    +++ description: Can pause, censor, instantly upgrade the bridge and upgrade other critical contracts in the system.
      receivedPermissions.7:
-        {"permission":"upgrade","from":"0x3980c9ed79d2c191A89E02Fa3529C60eD6e9c04b","role":"admin"}
      receivedPermissions.6.from:
-        "0xe70DD4dE81D282B3fa92A6700FEE8339d2d9b5cb"
+        "0x3980c9ed79d2c191A89E02Fa3529C60eD6e9c04b"
      receivedPermissions.5.from:
-        "0xf3d58D1794f2634d6649a978f2dc093898FEEBc0"
+        "0xe70DD4dE81D282B3fa92A6700FEE8339d2d9b5cb"
      receivedPermissions.4.from:
-        "0x6A1DB7d799FBA381F2a518cA859ED30cB8E1d41a"
+        "0xf3d58D1794f2634d6649a978f2dc093898FEEBc0"
      receivedPermissions.3.from:
-        "0xA2FaAAC9120c1Ff75814F0c6DdB119496a12eEA6"
+        "0x6A1DB7d799FBA381F2a518cA859ED30cB8E1d41a"
      receivedPermissions.2.from:
-        "0xD54c868362C2098E0E46F12E7D924C6A332952Dd"
+        "0xA2FaAAC9120c1Ff75814F0c6DdB119496a12eEA6"
      receivedPermissions.2.via:
-        [{"address":"0x8FbB8D00f7621B68F219B0B18738F07aF513D5C8"}]
      receivedPermissions.1.from:
-        "0x0fe382b74C3894B65c10E5C12ae60Bbd8FAf5b48"
+        "0xD54c868362C2098E0E46F12E7D924C6A332952Dd"
      receivedPermissions.0.permission:
-        "interact"
+        "upgrade"
      receivedPermissions.0.from:
-        "0x918778e825747a892b17C66fe7D24C618262867d"
+        "0x0fe382b74C3894B65c10E5C12ae60Bbd8FAf5b48"
      receivedPermissions.0.description:
-        "set and change address mappings."
      receivedPermissions.0.role:
-        ".owner"
+        "admin"
      receivedPermissions.0.via:
+        [{"address":"0x8FbB8D00f7621B68F219B0B18738F07aF513D5C8"}]
    }
```

```diff
    contract CanonicalTransactionChain (0x56a76bcC92361f6DF8D75476feD8843EdC70e1C9) {
    +++ description: The Canonical Transaction Chain (CTC) contract is an append-only log of transactions which must be applied to the OVM state. Given that transactions batch hashes are sent to an EOA address, it allows any account to enqueue() a transaction, which the Sequencer must eventually append to the rollup state.
      template:
+        "metis/CanonicalTransactionChain"
      description:
+        "The Canonical Transaction Chain (CTC) contract is an append-only log of transactions which must be applied to the OVM state. Given that transactions batch hashes are sent to an EOA address, it allows any account to enqueue() a transaction, which the Sequencer must eventually append to the rollup state."
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract BondManager (0x595801b85628ec6979C420988b8843A40F850528) {
    +++ description: The Bond Manager contract will handle deposits in the form of an ERC20 token from bonded Proposers. It will also handle the accounting of gas costs spent by a Verifier during the course of a challenge. In the event of a successful challenge, the faulty Proposer's bond will be slashed, and the Verifier's gas costs will be refunded. Current mock implementation allows only OVM_Proposer to propose new state roots. No slashing is implemented.
      values.proxiableUUID:
+        "EXPECT_REVERT"
      template:
+        "metis/BondManager"
      description:
+        "The Bond Manager contract will handle deposits in the form of an ERC20 token from bonded Proposers. It will also handle the accounting of gas costs spent by a Verifier during the course of a challenge. In the event of a successful challenge, the faulty Proposer's bond will be slashed, and the Verifier's gas costs will be refunded. Current mock implementation allows only OVM_Proposer to propose new state roots. No slashing is implemented."
    }
```

```diff
-   Status: DELETED
    contract  (0x5fF5316CD1C015970eEC83D34a69E504B577a5bb)
    +++ description: None
```

```diff
    contract MVM_CanonicalTransaction (0x6A1DB7d799FBA381F2a518cA859ED30cB8E1d41a) {
    +++ description: MVM CanonicalTransaction is a wrapper of Canonical Transaction Chain that implements optimistic data availability scheme L1. If Sequencer is not malicious, it simply forwards appendSequencerBatch() calls to CanonicalTransactionChain.
      values.proxiableUUID:
+        "EXPECT_REVERT"
      template:
+        "metis/MVM_CanonicalTransaction"
      description:
+        "MVM CanonicalTransaction is a wrapper of Canonical Transaction Chain that implements optimistic data availability scheme L1. If Sequencer is not malicious, it simply forwards appendSequencerBatch() calls to CanonicalTransactionChain."
    }
```

```diff
    contract PreimageOracle (0x789a64284e29d2225430606D3D89a9336870BBbC) {
    +++ description: Oracle for providing preimages.
      template:
+        "metis/PreimageOracle"
      description:
+        "Oracle for providing preimages."
    }
```

```diff
    contract MVM_DiscountOracle (0x7f6B0b7589febc40419a8646EFf9801b87397063) {
    +++ description: Oracle specifying user fees for sending L1 -> Metis messages and other parameters for cross-chain communication.
      values.proxiableUUID:
+        "EXPECT_REVERT"
      template:
+        "metis/MVM_DiscountOracle"
      description:
+        "Oracle specifying user fees for sending L1 -> Metis messages and other parameters for cross-chain communication."
    }
```

```diff
    contract Lib_AddressManager (0x918778e825747a892b17C66fe7D24C618262867d) {
    +++ description: Contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      template:
-        "opstack/AddressManager"
+        "metis/Lib_AddressManager"
      description:
-        "Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts."
+        "Contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts."
      values.1088_MVM_FraudVerifier:
+        "0xe70DD4dE81D282B3fa92A6700FEE8339d2d9b5cb"
      category:
-        {"name":"Spam","priority":-1}
    }
```

```diff
    contract Metis Token (0x9E32b13ce7f2E80A01932B42553652E053D6ed8e) {
    +++ description: Metis token contract.
      name:
-        "MToken"
+        "Metis Token"
      template:
+        "metis/METISToken"
      description:
+        "Metis token contract."
    }
```

```diff
    contract StateCommitmentChain (0xA2FaAAC9120c1Ff75814F0c6DdB119496a12eEA6) {
    +++ description: The State Commitment Chain (SCC) stores a list of proposed state roots in a linked ChainStorageContainer contract. Only a permissioned state root proposer (MVM_Proposer) can submit new state roots.
      template:
+        "metis/MVM_StateCommitmentChain"
      description:
+        "The State Commitment Chain (SCC) stores a list of proposed state roots in a linked ChainStorageContainer contract. Only a permissioned state root proposer (MVM_Proposer) can submit new state roots."
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract ChainStorageContainer-CTC-queue (0xA91Ea6F5d1EDA8e6686639d6C88b309cF35D2E57) {
    +++ description: Storage container for CTC queue.
      template:
+        "metis/ChainStorageContainer-CTC-queue"
      description:
+        "Storage container for CTC queue."
    }
```

```diff
    contract MIPS (0xAFD640204D73B02C3521eA8ea3771182527Ff057) {
    +++ description: None
      template:
+        "metis/MIPS"
    }
```

```diff
    contract LockingPool (0xD54c868362C2098E0E46F12E7D924C6A332952Dd) {
    +++ description: Contract allowing users to lock tokens to apply to become a sequencer, receive rewards, unlock tokens to exit the sequencer, reward distribution.
      template:
+        "metis/LockingPool"
      description:
+        "Contract allowing users to lock tokens to apply to become a sequencer, receive rewards, unlock tokens to exit the sequencer, reward distribution."
    }
```

```diff
    contract MVM_Verifier (0xe70DD4dE81D282B3fa92A6700FEE8339d2d9b5cb) {
    +++ description: The MVM Verifier contract is responsible for verifying the state of the MVM.
      values.proxiableUUID:
+        "EXPECT_REVERT"
      template:
+        "metis/MVM_Verifier"
      description:
+        "The MVM Verifier contract is responsible for verifying the state of the MVM."
    }
```

```diff
    contract MVM_L2ChainManagerOnL1 (0xf3d58D1794f2634d6649a978f2dc093898FEEBc0) {
    +++ description: Contract that allows METIS_MANAGER to switch Sequencer.
      values.proxiableUUID:
+        "EXPECT_REVERT"
      template:
+        "metis/MVM_L2ChainManagerOnL1"
      description:
+        "Contract that allows METIS_MANAGER to switch Sequencer."
    }
```

```diff
    contract DelayedWMetis (0xfA947f70c3509d5b70A606e871aE0C85397D0738) {
    +++ description: Delayed wrapped Metis token contract.
      template:
+        "metis/DelayedWMetis"
      description:
+        "Delayed wrapped Metis token contract."
    }
```

Generated with discovered.json: 0xee316cd9d06ba620002ce4a912220373f42eb647

# Diff at Fri, 23 May 2025 09:40:59 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@69cd181abbc3c830a6caf2f4429b37cae72ffdb8 block: 22494955
- current block number: 22494955

## Description

Introduced .role field on each permission, defaulting to field name on which it was defined (with '.' prefix)

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22494955 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x280f9c9DF12431Aed70731D5CD3d192456606a21) {
    +++ description: None
      directlyReceivedPermissions.1.role:
+        "admin"
      directlyReceivedPermissions.0.role:
+        "admin"
    }
```

```diff
    contract Metis Multisig (0x48fE1f85ff8Ad9D088863A42Af54d06a1328cF21) {
    +++ description: Can pause, censor, instantly upgrade the bridge and upgrade other critical contracts in the system.
      receivedPermissions.7.role:
+        "admin"
      receivedPermissions.6.role:
+        "admin"
      receivedPermissions.5.role:
+        "admin"
      receivedPermissions.4.role:
+        "admin"
      receivedPermissions.3.permission:
-        "interact"
+        "upgrade"
      receivedPermissions.3.from:
-        "0x918778e825747a892b17C66fe7D24C618262867d"
+        "0xA2FaAAC9120c1Ff75814F0c6DdB119496a12eEA6"
      receivedPermissions.3.description:
-        "set and change address mappings."
      receivedPermissions.3.role:
+        "admin"
      receivedPermissions.2.from:
-        "0xA2FaAAC9120c1Ff75814F0c6DdB119496a12eEA6"
+        "0xD54c868362C2098E0E46F12E7D924C6A332952Dd"
      receivedPermissions.2.role:
+        "admin"
      receivedPermissions.2.via:
+        [{"address":"0x8FbB8D00f7621B68F219B0B18738F07aF513D5C8"}]
      receivedPermissions.1.from:
-        "0xD54c868362C2098E0E46F12E7D924C6A332952Dd"
+        "0x0fe382b74C3894B65c10E5C12ae60Bbd8FAf5b48"
      receivedPermissions.1.role:
+        "admin"
      receivedPermissions.0.permission:
-        "upgrade"
+        "interact"
      receivedPermissions.0.from:
-        "0x0fe382b74C3894B65c10E5C12ae60Bbd8FAf5b48"
+        "0x918778e825747a892b17C66fe7D24C618262867d"
      receivedPermissions.0.via:
-        [{"address":"0x8FbB8D00f7621B68F219B0B18738F07aF513D5C8"}]
      receivedPermissions.0.description:
+        "set and change address mappings."
      receivedPermissions.0.role:
+        ".owner"
      directlyReceivedPermissions.0.role:
+        ".owner"
    }
```

```diff
    EOA  (0x5345fCDCF5449a40df030798C195603d27691502) {
    +++ description: None
      receivedPermissions.1.role:
+        "admin"
      receivedPermissions.0.role:
+        "admin"
      directlyReceivedPermissions.0.role:
+        ".owner"
    }
```

```diff
    contract ProxyAdmin (0x8FbB8D00f7621B68F219B0B18738F07aF513D5C8) {
    +++ description: None
      directlyReceivedPermissions.1.role:
+        "admin"
      directlyReceivedPermissions.0.role:
+        "admin"
    }
```

Generated with discovered.json: 0xe76af737833e2ba17ce79291ef9499bc8dfac9fb

# Diff at Fri, 16 May 2025 12:25:09 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@9912083f7b773804513e08ee765f8ba71a92980b block: 21242106
- current block number: 22494955

## Description

StateCommitmentChain. A heavily modified DisputeGameFactory/FaultDisputeGame is referenced but apparently not used as proof system yet. Also upgradeable by EOA.

## Watched changes

```diff
    contract Lib_AddressManager (0x918778e825747a892b17C66fe7D24C618262867d) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      values.DisputeGameFactory:
-        "0x0000000000000000000000000000000000000000"
+        "0x1C2f0A08762f0aD4598fB5de8f9D6626a4e4aeE3"
    }
```

```diff
    contract StateCommitmentChain (0xA2FaAAC9120c1Ff75814F0c6DdB119496a12eEA6) {
    +++ description: None
      sourceHashes.1:
-        "0xc6bcfffdfe15d4c259332b8f62b29950aecdec253e8eeed2ebfa9e78ca1cea2b"
+        "0x18e98a64fbfe011a7514d7a547900c02a3e0f9a49ab3413d517fd7e0e3c539dd"
      sourceHashes.0:
-        "0x18e98a64fbfe011a7514d7a547900c02a3e0f9a49ab3413d517fd7e0e3c539dd"
+        "0x97bafeecd79eafa0a2d331c68498ce2ccecf89112ed12cb22b90aac48f1d0aa5"
      values.$implementation:
-        "0x6b1Cd90796Dc97C859734dDA4fF7816f703DDb48"
+        "0xe6E2DFf51b039C8EFf0b21880E2Fb008AF10B365"
      values.DISPUTE_GAME_FACTORY_NAME:
+        "DisputeGameFactory"
      values.findEarliestDisputableBatch:
+        []
      implementationNames.0x6b1Cd90796Dc97C859734dDA4fF7816f703DDb48:
-        "MVM_StateCommitmentChain"
      implementationNames.0xe6E2DFf51b039C8EFf0b21880E2Fb008AF10B365:
+        "MVM_StateCommitmentChain"
    }
```

```diff
+   Status: CREATED
    contract DisputeGameFactory (0x1C2f0A08762f0aD4598fB5de8f9D6626a4e4aeE3)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x280f9c9DF12431Aed70731D5CD3d192456606a21)
    +++ description: None
```

```diff
+   Status: CREATED
    contract MetisConfig (0x2aA4E192994757c5fAB87Ba13812B89564EA57Ff)
    +++ description: None
```

```diff
+   Status: CREATED
    contract FaultDisputeGame (0x477f9d1CC62Ea2c8ff0963B11C5D782Cef536235)
    +++ description: None
```

```diff
+   Status: CREATED
    contract PreimageOracle (0x789a64284e29d2225430606D3D89a9336870BBbC)
    +++ description: None
```

```diff
+   Status: CREATED
    contract MIPS (0xAFD640204D73B02C3521eA8ea3771182527Ff057)
    +++ description: None
```

```diff
+   Status: CREATED
    contract DelayedWMetis (0xfA947f70c3509d5b70A606e871aE0C85397D0738)
    +++ description: None
```

## Source code changes

```diff
.../ethereum/.flat/DelayedWMetis/DelayedWMetis.sol |  966 +++++
 .../TransparentUpgradeableProxy.p.sol              |  695 ++++
 .../DisputeGameFactory/DisputeGameFactory.sol      | 1944 ++++++++++
 .../TransparentUpgradeableProxy.p.sol              |  695 ++++
 .../metis/ethereum/.flat/FaultDisputeGame.sol      | 4083 ++++++++++++++++++++
 .../src/projects/metis/ethereum/.flat/MIPS.sol     | 1528 ++++++++
 .../projects/metis/ethereum/.flat/MetisConfig.sol  |  477 +++
 .../metis/ethereum/.flat/PreimageOracle.sol        | 1353 +++++++
 ...-0x280f9c9DF12431Aed70731D5CD3d192456606a21.sol |  147 +
 ...0x8FbB8D00f7621B68F219B0B18738F07aF513D5C8.sol} |    0
 .../MVM_StateCommitmentChain.sol                   |  268 +-
 11 files changed, 12127 insertions(+), 29 deletions(-)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21242106 (main branch discovery), not current.

```diff
    contract Lib_AddressManager (0x918778e825747a892b17C66fe7D24C618262867d) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      values.DisputeGameFactory:
+        "0x0000000000000000000000000000000000000000"
    }
```

Generated with discovered.json: 0x90ecc89fe6949f63992ec7b1d2e42ae4684b7ff9

# Diff at Tue, 29 Apr 2025 08:19:06 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@ef7477af00fe0b57a2f7cacf7e958c12494af662 block: 21242106
- current block number: 21242106

## Description

Field .issuedPermissions is removed from the output as no longer needed. Added 'permissionsConfigHash' due to refactoring of the modelling process (into a separate command).

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21242106 (main branch discovery), not current.

```diff
    contract LockingInfo (0x0fe382b74C3894B65c10E5C12ae60Bbd8FAf5b48) {
    +++ description: None
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x48fE1f85ff8Ad9D088863A42Af54d06a1328cF21","via":[{"address":"0x8FbB8D00f7621B68F219B0B18738F07aF513D5C8"}]}]
    }
```

```diff
    contract L1StandardBridge (0x3980c9ed79d2c191A89E02Fa3529C60eD6e9c04b) {
    +++ description: None
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x48fE1f85ff8Ad9D088863A42Af54d06a1328cF21","via":[]}]
    }
```

```diff
    contract MVM_CanonicalTransaction (0x6A1DB7d799FBA381F2a518cA859ED30cB8E1d41a) {
    +++ description: None
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x48fE1f85ff8Ad9D088863A42Af54d06a1328cF21","via":[]}]
    }
```

```diff
    contract Lib_AddressManager (0x918778e825747a892b17C66fe7D24C618262867d) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      issuedPermissions:
-        [{"permission":"interact","to":"0x48fE1f85ff8Ad9D088863A42Af54d06a1328cF21","description":"set and change address mappings.","via":[]}]
    }
```

```diff
    contract StateCommitmentChain (0xA2FaAAC9120c1Ff75814F0c6DdB119496a12eEA6) {
    +++ description: None
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x48fE1f85ff8Ad9D088863A42Af54d06a1328cF21","via":[]}]
    }
```

```diff
    contract LockingPool (0xD54c868362C2098E0E46F12E7D924C6A332952Dd) {
    +++ description: None
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x48fE1f85ff8Ad9D088863A42Af54d06a1328cF21","via":[{"address":"0x8FbB8D00f7621B68F219B0B18738F07aF513D5C8"}]}]
    }
```

```diff
    contract MVM_Verifier (0xe70DD4dE81D282B3fa92A6700FEE8339d2d9b5cb) {
    +++ description: None
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x48fE1f85ff8Ad9D088863A42Af54d06a1328cF21","via":[]}]
    }
```

```diff
    contract MVM_L2ChainManagerOnL1 (0xf3d58D1794f2634d6649a978f2dc093898FEEBc0) {
    +++ description: None
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x48fE1f85ff8Ad9D088863A42Af54d06a1328cF21","via":[]}]
    }
```

Generated with discovered.json: 0x29434752bd18560c7eab8450475962ebc1b66a04

# Diff at Thu, 10 Apr 2025 14:42:44 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@f38a3c9bf359344e4c4cd3006f58271cb8f78d15 block: 21242106
- current block number: 21242106

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21242106 (main branch discovery), not current.

```diff
    contract Lib_AddressManager (0x918778e825747a892b17C66fe7D24C618262867d) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      displayName:
-        "AddressManager"
    }
```

Generated with discovered.json: 0xf7f50a04d1d35a796525334d58176e1e4a621155

# Diff at Thu, 27 Mar 2025 11:14:40 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@8cc2e36080df3a74dfd8475d41c64f46203f5218 block: 21242106
- current block number: 21242106

## Description

Config related: add guardian description details, hide some noisy values, hide AddressManager as spam cat, add proposer / challenger to permissioned opfp chains.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21242106 (main branch discovery), not current.

```diff
    contract Lib_AddressManager (0x918778e825747a892b17C66fe7D24C618262867d) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      category:
+        {"name":"Spam","priority":-1}
    }
```

Generated with discovered.json: 0xbaf0938aed711a89d28c7323b65672ff86fca5b0

# Diff at Mon, 17 Mar 2025 15:28:48 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@83c6f5a675a7a6512e7a8af5c777ef32d60dc946 block: 21242106
- current block number: 21242106

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21242106 (main branch discovery), not current.

```diff
    contract RewardEscrowerMultisig (0x62478E4eeb4070fE399866aB05e821AB97200947) {
    +++ description: Escrows staking rewards for Sequencers.
      description:
+        "Escrows staking rewards for Sequencers."
    }
```

Generated with discovered.json: 0x658b2df4853dee3fe7249bc00711864742231a05

# Diff at Tue, 04 Mar 2025 10:39:26 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@98d260b45fe0d2195ce5e629bd7b200c8706e8ba block: 21242106
- current block number: 21242106

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21242106 (main branch discovery), not current.

```diff
    contract L1CrossDomainMessenger (0x081D1101855bD523bA69A9794e0217F0DB6323ff) {
    +++ description: None
      sinceBlock:
+        13627370
    }
```

```diff
    contract LockingInfo (0x0fe382b74C3894B65c10E5C12ae60Bbd8FAf5b48) {
    +++ description: None
      sinceBlock:
+        19424659
    }
```

```diff
    contract ChainStorageContainer-SCC-batches (0x10739F09f6e62689c0aA8A1878816de9e166d6f9) {
    +++ description: None
      sinceBlock:
+        13626929
    }
```

```diff
    contract ChainStorageContainer-CTC-batches (0x38473Feb3A6366757A249dB2cA4fBB2C663416B7) {
    +++ description: None
      sinceBlock:
+        13625270
    }
```

```diff
    contract L1StandardBridge (0x3980c9ed79d2c191A89E02Fa3529C60eD6e9c04b) {
    +++ description: None
      sinceBlock:
+        13627429
    }
```

```diff
    contract Metis Multisig (0x48fE1f85ff8Ad9D088863A42Af54d06a1328cF21) {
    +++ description: Can pause, censor, instantly upgrade the bridge and upgrade other critical contracts in the system.
      sinceBlock:
+        13616534
    }
```

```diff
    contract CanonicalTransactionChain (0x56a76bcC92361f6DF8D75476feD8843EdC70e1C9) {
    +++ description: None
      sinceBlock:
+        13626959
    }
```

```diff
    contract BondManager (0x595801b85628ec6979C420988b8843A40F850528) {
    +++ description: None
      sinceBlock:
+        19717907
    }
```

```diff
    contract  (0x5fF5316CD1C015970eEC83D34a69E504B577a5bb) {
    +++ description: None
      sinceBlock:
+        13627861
    }
```

```diff
    contract RewardEscrowerMultisig (0x62478E4eeb4070fE399866aB05e821AB97200947) {
    +++ description: None
      sinceBlock:
+        19697815
    }
```

```diff
    contract MVM_CanonicalTransaction (0x6A1DB7d799FBA381F2a518cA859ED30cB8E1d41a) {
    +++ description: None
      sinceBlock:
+        14561258
    }
```

```diff
    contract MVM_DiscountOracle (0x7f6B0b7589febc40419a8646EFf9801b87397063) {
    +++ description: None
      sinceBlock:
+        14577582
    }
```

```diff
    contract ProxyAdmin (0x8FbB8D00f7621B68F219B0B18738F07aF513D5C8) {
    +++ description: None
      sinceBlock:
+        19424653
    }
```

```diff
    contract Lib_AddressManager (0x918778e825747a892b17C66fe7D24C618262867d) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      sinceBlock:
+        13625248
    }
```

```diff
    contract MToken (0x9E32b13ce7f2E80A01932B42553652E053D6ed8e) {
    +++ description: None
      sinceBlock:
+        11434969
    }
```

```diff
    contract StateCommitmentChain (0xA2FaAAC9120c1Ff75814F0c6DdB119496a12eEA6) {
    +++ description: None
      sinceBlock:
+        19438866
    }
```

```diff
    contract ChainStorageContainer-CTC-queue (0xA91Ea6F5d1EDA8e6686639d6C88b309cF35D2E57) {
    +++ description: None
      sinceBlock:
+        13625297
    }
```

```diff
    contract LockingPool (0xD54c868362C2098E0E46F12E7D924C6A332952Dd) {
    +++ description: None
      sinceBlock:
+        19424665
    }
```

```diff
    contract MVM_Verifier (0xe70DD4dE81D282B3fa92A6700FEE8339d2d9b5cb) {
    +++ description: None
      sinceBlock:
+        14567320
    }
```

```diff
    contract MVM_L2ChainManagerOnL1 (0xf3d58D1794f2634d6649a978f2dc093898FEEBc0) {
    +++ description: None
      sinceBlock:
+        13628326
    }
```

Generated with discovered.json: 0xa45d280158816c143fa16d7daff05fae2222eee7

# Diff at Tue, 04 Feb 2025 12:31:42 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@145553eed7ba44636411ecb25e4099728acd02f9 block: 21242106
- current block number: 21242106

## Description

Rename 'configure' permission to 'interact'

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21242106 (main branch discovery), not current.

```diff
    contract Metis Multisig (0x48fE1f85ff8Ad9D088863A42Af54d06a1328cF21) {
    +++ description: Can pause, censor, instantly upgrade the bridge and upgrade other critical contracts in the system.
      receivedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract Lib_AddressManager (0x918778e825747a892b17C66fe7D24C618262867d) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      issuedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

Generated with discovered.json: 0x4d30d420200d002030af6165bb9417e5d8376268

# Diff at Mon, 20 Jan 2025 11:09:45 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@2c8b4f3d9910bb6371be9b4df87b70856e7d8c64 block: 21242106
- current block number: 21242106

## Description

Rerun on the same block number. Applies fixes to permissions and via field. Renames permission's target to to/from.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21242106 (main branch discovery), not current.

```diff
    contract LockingInfo (0x0fe382b74C3894B65c10E5C12ae60Bbd8FAf5b48) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x48fE1f85ff8Ad9D088863A42Af54d06a1328cF21"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x48fE1f85ff8Ad9D088863A42Af54d06a1328cF21"
    }
```

```diff
    contract L1StandardBridge (0x3980c9ed79d2c191A89E02Fa3529C60eD6e9c04b) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x48fE1f85ff8Ad9D088863A42Af54d06a1328cF21"
      issuedPermissions.0.to:
+        "0x48fE1f85ff8Ad9D088863A42Af54d06a1328cF21"
    }
```

```diff
    contract Metis Multisig (0x48fE1f85ff8Ad9D088863A42Af54d06a1328cF21) {
    +++ description: Can pause, censor, instantly upgrade the bridge and upgrade other critical contracts in the system.
      receivedPermissions.7.target:
-        "0xf3d58D1794f2634d6649a978f2dc093898FEEBc0"
      receivedPermissions.7.from:
+        "0xf3d58D1794f2634d6649a978f2dc093898FEEBc0"
      receivedPermissions.6.target:
-        "0xe70DD4dE81D282B3fa92A6700FEE8339d2d9b5cb"
      receivedPermissions.6.from:
+        "0xe70DD4dE81D282B3fa92A6700FEE8339d2d9b5cb"
      receivedPermissions.5.target:
-        "0xD54c868362C2098E0E46F12E7D924C6A332952Dd"
      receivedPermissions.5.from:
+        "0xD54c868362C2098E0E46F12E7D924C6A332952Dd"
      receivedPermissions.4.target:
-        "0xA2FaAAC9120c1Ff75814F0c6DdB119496a12eEA6"
      receivedPermissions.4.from:
+        "0xA2FaAAC9120c1Ff75814F0c6DdB119496a12eEA6"
      receivedPermissions.3.target:
-        "0x6A1DB7d799FBA381F2a518cA859ED30cB8E1d41a"
      receivedPermissions.3.from:
+        "0x6A1DB7d799FBA381F2a518cA859ED30cB8E1d41a"
      receivedPermissions.2.target:
-        "0x3980c9ed79d2c191A89E02Fa3529C60eD6e9c04b"
      receivedPermissions.2.from:
+        "0x3980c9ed79d2c191A89E02Fa3529C60eD6e9c04b"
      receivedPermissions.1.target:
-        "0x0fe382b74C3894B65c10E5C12ae60Bbd8FAf5b48"
      receivedPermissions.1.from:
+        "0x0fe382b74C3894B65c10E5C12ae60Bbd8FAf5b48"
      receivedPermissions.0.target:
-        "0x918778e825747a892b17C66fe7D24C618262867d"
      receivedPermissions.0.from:
+        "0x918778e825747a892b17C66fe7D24C618262867d"
      directlyReceivedPermissions.0.target:
-        "0x8FbB8D00f7621B68F219B0B18738F07aF513D5C8"
      directlyReceivedPermissions.0.from:
+        "0x8FbB8D00f7621B68F219B0B18738F07aF513D5C8"
    }
```

```diff
    contract MVM_CanonicalTransaction (0x6A1DB7d799FBA381F2a518cA859ED30cB8E1d41a) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x48fE1f85ff8Ad9D088863A42Af54d06a1328cF21"
      issuedPermissions.0.to:
+        "0x48fE1f85ff8Ad9D088863A42Af54d06a1328cF21"
    }
```

```diff
    contract ProxyAdmin (0x8FbB8D00f7621B68F219B0B18738F07aF513D5C8) {
    +++ description: None
      directlyReceivedPermissions.1.target:
-        "0xD54c868362C2098E0E46F12E7D924C6A332952Dd"
      directlyReceivedPermissions.1.from:
+        "0xD54c868362C2098E0E46F12E7D924C6A332952Dd"
      directlyReceivedPermissions.0.target:
-        "0x0fe382b74C3894B65c10E5C12ae60Bbd8FAf5b48"
      directlyReceivedPermissions.0.from:
+        "0x0fe382b74C3894B65c10E5C12ae60Bbd8FAf5b48"
    }
```

```diff
    contract Lib_AddressManager (0x918778e825747a892b17C66fe7D24C618262867d) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      issuedPermissions.0.target:
-        "0x48fE1f85ff8Ad9D088863A42Af54d06a1328cF21"
      issuedPermissions.0.to:
+        "0x48fE1f85ff8Ad9D088863A42Af54d06a1328cF21"
      issuedPermissions.0.description:
+        "set and change address mappings."
    }
```

```diff
    contract StateCommitmentChain (0xA2FaAAC9120c1Ff75814F0c6DdB119496a12eEA6) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x48fE1f85ff8Ad9D088863A42Af54d06a1328cF21"
      issuedPermissions.0.to:
+        "0x48fE1f85ff8Ad9D088863A42Af54d06a1328cF21"
    }
```

```diff
    contract LockingPool (0xD54c868362C2098E0E46F12E7D924C6A332952Dd) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x48fE1f85ff8Ad9D088863A42Af54d06a1328cF21"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x48fE1f85ff8Ad9D088863A42Af54d06a1328cF21"
    }
```

```diff
    contract MVM_Verifier (0xe70DD4dE81D282B3fa92A6700FEE8339d2d9b5cb) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x48fE1f85ff8Ad9D088863A42Af54d06a1328cF21"
      issuedPermissions.0.to:
+        "0x48fE1f85ff8Ad9D088863A42Af54d06a1328cF21"
    }
```

```diff
    contract MVM_L2ChainManagerOnL1 (0xf3d58D1794f2634d6649a978f2dc093898FEEBc0) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x48fE1f85ff8Ad9D088863A42Af54d06a1328cF21"
      issuedPermissions.0.to:
+        "0x48fE1f85ff8Ad9D088863A42Af54d06a1328cF21"
    }
```

Generated with discovered.json: 0x6a10bd6445b4572b3e0aa53692b4db70a921cca7

# Diff at Mon, 20 Jan 2025 09:25:00 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@82d3b5c180381f7d2d0e30406b2ac10025d0614f block: 21242106
- current block number: 21242106

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21242106 (main branch discovery), not current.

```diff
    contract Metis Multisig (0x48fE1f85ff8Ad9D088863A42Af54d06a1328cF21) {
    +++ description: Can pause, censor, instantly upgrade the bridge and upgrade other critical contracts in the system.
      fieldMeta.getOwners.type:
+        "PERMISSION"
      fieldMeta.getThreshold.type:
+        "PERMISSION"
    }
```

```diff
    contract Lib_AddressManager (0x918778e825747a892b17C66fe7D24C618262867d) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      fieldMeta.StateCommitmentChain.type:
+        "CODE_CHANGE"
    }
```

Generated with discovered.json: 0x5e91894fac1cc33d8a28a8c428389bbff89ad8e9

# Diff at Wed, 04 Dec 2024 14:21:32 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@5ce1f4558272638b4ce9e4501463a3fa3ee115cb block: 21242106
- current block number: 21242106

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21242106 (main branch discovery), not current.

```diff
    contract ChainStorageContainer-SCC-batches (0x10739F09f6e62689c0aA8A1878816de9e166d6f9) {
    +++ description: None
      name:
-        "ChainStorageContainer"
+        "ChainStorageContainer-SCC-batches"
    }
```

```diff
    contract ChainStorageContainer-CTC-batches (0x38473Feb3A6366757A249dB2cA4fBB2C663416B7) {
    +++ description: None
      name:
-        "ChainStorageContainer"
+        "ChainStorageContainer-CTC-batches"
    }
```

```diff
    contract ChainStorageContainer-CTC-queue (0xA91Ea6F5d1EDA8e6686639d6C88b309cF35D2E57) {
    +++ description: None
      name:
-        "ChainStorageContainer"
+        "ChainStorageContainer-CTC-queue"
    }
```

Generated with discovered.json: 0xc18eb8ea91524ae0c35320c5d45eeacf4a7106d7

# Diff at Fri, 22 Nov 2024 08:34:18 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@292f23170122adf00047246ebc612907f3cba48f block: 20211335
- current block number: 21242106

## Description

Config related (ProxyAdmin template match).

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20211335 (main branch discovery), not current.

```diff
    contract LockingInfo (0x0fe382b74C3894B65c10E5C12ae60Bbd8FAf5b48) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x8FbB8D00f7621B68F219B0B18738F07aF513D5C8"
+        "0x48fE1f85ff8Ad9D088863A42Af54d06a1328cF21"
      issuedPermissions.0.via.0:
+        {"address":"0x8FbB8D00f7621B68F219B0B18738F07aF513D5C8","delay":0}
    }
```

```diff
    contract Metis Multisig (0x48fE1f85ff8Ad9D088863A42Af54d06a1328cF21) {
    +++ description: Can pause, censor, instantly upgrade the bridge and upgrade other critical contracts in the system.
      receivedPermissions.7:
+        {"permission":"upgrade","target":"0xf3d58D1794f2634d6649a978f2dc093898FEEBc0"}
      receivedPermissions.6:
+        {"permission":"upgrade","target":"0xe70DD4dE81D282B3fa92A6700FEE8339d2d9b5cb"}
      receivedPermissions.5.target:
-        "0xf3d58D1794f2634d6649a978f2dc093898FEEBc0"
+        "0xD54c868362C2098E0E46F12E7D924C6A332952Dd"
      receivedPermissions.5.via:
+        [{"address":"0x8FbB8D00f7621B68F219B0B18738F07aF513D5C8"}]
      receivedPermissions.4.target:
-        "0xe70DD4dE81D282B3fa92A6700FEE8339d2d9b5cb"
+        "0xA2FaAAC9120c1Ff75814F0c6DdB119496a12eEA6"
      receivedPermissions.3.target:
-        "0xA2FaAAC9120c1Ff75814F0c6DdB119496a12eEA6"
+        "0x6A1DB7d799FBA381F2a518cA859ED30cB8E1d41a"
      receivedPermissions.2.target:
-        "0x6A1DB7d799FBA381F2a518cA859ED30cB8E1d41a"
+        "0x3980c9ed79d2c191A89E02Fa3529C60eD6e9c04b"
      receivedPermissions.1.target:
-        "0x3980c9ed79d2c191A89E02Fa3529C60eD6e9c04b"
+        "0x0fe382b74C3894B65c10E5C12ae60Bbd8FAf5b48"
      receivedPermissions.1.via:
+        [{"address":"0x8FbB8D00f7621B68F219B0B18738F07aF513D5C8"}]
      directlyReceivedPermissions:
+        [{"permission":"act","target":"0x8FbB8D00f7621B68F219B0B18738F07aF513D5C8"}]
    }
```

```diff
    contract ProxyAdmin (0x8FbB8D00f7621B68F219B0B18738F07aF513D5C8) {
    +++ description: None
      receivedPermissions:
-        [{"permission":"upgrade","target":"0x0fe382b74C3894B65c10E5C12ae60Bbd8FAf5b48"},{"permission":"upgrade","target":"0xD54c868362C2098E0E46F12E7D924C6A332952Dd"}]
      template:
+        "global/ProxyAdmin"
      directlyReceivedPermissions:
+        [{"permission":"upgrade","target":"0x0fe382b74C3894B65c10E5C12ae60Bbd8FAf5b48"},{"permission":"upgrade","target":"0xD54c868362C2098E0E46F12E7D924C6A332952Dd"}]
    }
```

```diff
    contract LockingPool (0xD54c868362C2098E0E46F12E7D924C6A332952Dd) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x8FbB8D00f7621B68F219B0B18738F07aF513D5C8"
+        "0x48fE1f85ff8Ad9D088863A42Af54d06a1328cF21"
      issuedPermissions.0.via.0:
+        {"address":"0x8FbB8D00f7621B68F219B0B18738F07aF513D5C8","delay":0}
    }
```

Generated with discovered.json: 0x9d98c92aed2ee7c458049d4a169109e311e347cc

# Diff at Mon, 21 Oct 2024 12:46:03 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@e660599f23a07618fe949a07be1f516ce44f1914 block: 20211335
- current block number: 20211335

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20211335 (main branch discovery), not current.

```diff
    contract Metis Multisig (0x48fE1f85ff8Ad9D088863A42Af54d06a1328cF21) {
    +++ description: Can pause, censor, instantly upgrade the bridge and upgrade other critical contracts in the system.
      descriptions:
-        ["Can pause, censor, instantly upgrade the bridge and upgrade other critical contracts in the system."]
      description:
+        "Can pause, censor, instantly upgrade the bridge and upgrade other critical contracts in the system."
    }
```

```diff
    contract Lib_AddressManager (0x918778e825747a892b17C66fe7D24C618262867d) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      descriptions:
-        ["Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts."]
      description:
+        "Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts."
    }
```

Generated with discovered.json: 0x3aecf356f21722538eccbb22982470f6d770547f

# Diff at Mon, 21 Oct 2024 11:07:46 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@8895d33866f5665c4c710f4ddaa32bfa63cc3c78 block: 20211335
- current block number: 20211335

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20211335 (main branch discovery), not current.

```diff
    contract L1CrossDomainMessenger (0x081D1101855bD523bA69A9794e0217F0DB6323ff) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0x8bF439ef7167023F009E24b21719Ca5f768Ecb36"]
      values.$pastUpgrades.0.1:
-        ["0x8bF439ef7167023F009E24b21719Ca5f768Ecb36"]
+        "0xa752a872bee0f5d9be41b00f85e4d0b5e958f5644f5609dd0907dd74263ff7f4"
    }
```

```diff
    contract LockingInfo (0x0fe382b74C3894B65c10E5C12ae60Bbd8FAf5b48) {
    +++ description: None
      values.$pastUpgrades.1.2:
+        ["0x0D30F0d7934f53aaF6a1630A4c109AF4513a65cC"]
      values.$pastUpgrades.1.1:
-        ["0x0D30F0d7934f53aaF6a1630A4c109AF4513a65cC"]
+        "0x356768c4abdb1df76773881dc3c4d8ad7af36ac2154baaec83c3f878aedb6b57"
      values.$pastUpgrades.0.2:
+        ["0x8db636418F10d514c4c68235ee3d640dDBCC7a8a"]
      values.$pastUpgrades.0.1:
-        ["0x8db636418F10d514c4c68235ee3d640dDBCC7a8a"]
+        "0x37356e30602c7e4e6b05129e3a0375c3fbeb08856eb198ef7ec2a6c75fd3ee78"
    }
```

```diff
    contract LockingPool (0xD54c868362C2098E0E46F12E7D924C6A332952Dd) {
    +++ description: None
      values.$pastUpgrades.1.2:
+        ["0xD8f38c831E5032d23065Eaaee8c0620e17c04D60"]
      values.$pastUpgrades.1.1:
-        ["0xD8f38c831E5032d23065Eaaee8c0620e17c04D60"]
+        "0x356768c4abdb1df76773881dc3c4d8ad7af36ac2154baaec83c3f878aedb6b57"
      values.$pastUpgrades.0.2:
+        ["0xd87Da73F82abe83915d61342199A4690cfdf4718"]
      values.$pastUpgrades.0.1:
-        ["0xd87Da73F82abe83915d61342199A4690cfdf4718"]
+        "0x5a9766b27606f1c41f132a4a900131f39ab49a27607d27db667ecc1de2f9f0d1"
    }
```

Generated with discovered.json: 0xc823b4ffab0465686326f926227fda7a063de0b5

# Diff at Mon, 14 Oct 2024 10:53:01 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1afc77ff111ceb0970e7d09efcc7b2f376b0c281 block: 20211335
- current block number: 20211335

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20211335 (main branch discovery), not current.

```diff
    contract L1CrossDomainMessenger (0x081D1101855bD523bA69A9794e0217F0DB6323ff) {
    +++ description: None
      sourceHashes:
+        ["0x6e4b297b822bdda2bb8bbf4dde360ee51379af5a0de55c0d726a2d7b68791bf7","0xda7b05d88be95072ae926d6f2b176d60c2d568f45ef6c67071b28159388c81e7"]
    }
```

```diff
    contract LockingInfo (0x0fe382b74C3894B65c10E5C12ae60Bbd8FAf5b48) {
    +++ description: None
      sourceHashes:
+        ["0xccb5b222f823953e2082d6174b99d09cb9046c862bb91c6fe6cb57e5289a9738","0x3052e020792c1a42febb86916d737ca4d3962b80b97fe18c7a778bf270acf023"]
    }
```

```diff
    contract ChainStorageContainer (0x10739F09f6e62689c0aA8A1878816de9e166d6f9) {
    +++ description: None
      sourceHashes:
+        ["0x94ea4eb57654b23e5ce34a8f4571a446786efb3080044f3ecfc2f3870e601ee0"]
    }
```

```diff
    contract ChainStorageContainer (0x38473Feb3A6366757A249dB2cA4fBB2C663416B7) {
    +++ description: None
      sourceHashes:
+        ["0x94ea4eb57654b23e5ce34a8f4571a446786efb3080044f3ecfc2f3870e601ee0"]
    }
```

```diff
    contract L1StandardBridge (0x3980c9ed79d2c191A89E02Fa3529C60eD6e9c04b) {
    +++ description: None
      sourceHashes:
+        ["0x18e98a64fbfe011a7514d7a547900c02a3e0f9a49ab3413d517fd7e0e3c539dd","0x6e30dabe85a54d5753ec304088b4cc9f1fc2ba202fb3982bf202b0cc4a922c99"]
    }
```

```diff
    contract Metis Multisig (0x48fE1f85ff8Ad9D088863A42Af54d06a1328cF21) {
    +++ description: Can pause, censor, instantly upgrade the bridge and upgrade other critical contracts in the system.
      receivedPermissions.5:
+        {"permission":"upgrade","target":"0xf3d58D1794f2634d6649a978f2dc093898FEEBc0"}
      receivedPermissions.4.target:
-        "0xf3d58D1794f2634d6649a978f2dc093898FEEBc0"
+        "0xe70DD4dE81D282B3fa92A6700FEE8339d2d9b5cb"
      receivedPermissions.3.target:
-        "0xe70DD4dE81D282B3fa92A6700FEE8339d2d9b5cb"
+        "0xA2FaAAC9120c1Ff75814F0c6DdB119496a12eEA6"
      receivedPermissions.2.target:
-        "0xA2FaAAC9120c1Ff75814F0c6DdB119496a12eEA6"
+        "0x6A1DB7d799FBA381F2a518cA859ED30cB8E1d41a"
      receivedPermissions.1.target:
-        "0x6A1DB7d799FBA381F2a518cA859ED30cB8E1d41a"
+        "0x3980c9ed79d2c191A89E02Fa3529C60eD6e9c04b"
      receivedPermissions.0.permission:
-        "upgrade"
+        "configure"
      receivedPermissions.0.target:
-        "0x3980c9ed79d2c191A89E02Fa3529C60eD6e9c04b"
+        "0x918778e825747a892b17C66fe7D24C618262867d"
      receivedPermissions.0.description:
+        "set and change address mappings."
      sourceHashes:
+        ["0x81a7349eebb98ac33b0bc6842e3cb258034a8f2a4ba004570bb8e2e25947f9ff","0xd42bbf9f7dcd3720a7fc6bdc6edfdfae8800a37d6dd4decfa0ef6ca4a2e88940"]
    }
```

```diff
    contract CanonicalTransactionChain (0x56a76bcC92361f6DF8D75476feD8843EdC70e1C9) {
    +++ description: None
      sourceHashes:
+        ["0x70010b1d5bb98964174a28e3c3a229763fb65df55575104adbec0bc0552cd31d"]
    }
```

```diff
    contract BondManager (0x595801b85628ec6979C420988b8843A40F850528) {
    +++ description: None
      sourceHashes:
+        ["0xe429226928e3766e14dbbf6391a4caa68cf9e4c12cb9e81ef04b84a38747449a"]
    }
```

```diff
    contract RewardEscrowerMultisig (0x62478E4eeb4070fE399866aB05e821AB97200947) {
    +++ description: None
      sourceHashes:
+        ["0x81a7349eebb98ac33b0bc6842e3cb258034a8f2a4ba004570bb8e2e25947f9ff","0xd42bbf9f7dcd3720a7fc6bdc6edfdfae8800a37d6dd4decfa0ef6ca4a2e88940"]
    }
```

```diff
    contract MVM_CanonicalTransaction (0x6A1DB7d799FBA381F2a518cA859ED30cB8E1d41a) {
    +++ description: None
      sourceHashes:
+        ["0x18e98a64fbfe011a7514d7a547900c02a3e0f9a49ab3413d517fd7e0e3c539dd","0xc5bc8dddf764177767a3613d96c31c0fcc86db07c909c72cbf2f6a2443942109"]
    }
```

```diff
    contract MVM_DiscountOracle (0x7f6B0b7589febc40419a8646EFf9801b87397063) {
    +++ description: None
      sourceHashes:
+        ["0x8406419ac446023c37b27d0154da77b664a20b7da231802e32193c8883d32d06"]
    }
```

```diff
    contract ProxyAdmin (0x8FbB8D00f7621B68F219B0B18738F07aF513D5C8) {
    +++ description: None
      sourceHashes:
+        ["0x1c9416031605fbda74b5da95a290e00995eaed2f6f6ba85ff2681131efe940a0"]
    }
```

```diff
    contract Lib_AddressManager (0x918778e825747a892b17C66fe7D24C618262867d) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      template:
+        "opstack/AddressManager"
      sourceHashes:
+        ["0x763c5728a19538783edf38c17731f9cf79ff6f38bfa4bce61333cef0aac5452e"]
      displayName:
+        "AddressManager"
      descriptions:
+        ["Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts."]
      issuedPermissions:
+        [{"permission":"configure","target":"0x48fE1f85ff8Ad9D088863A42Af54d06a1328cF21","via":[]}]
    }
```

```diff
    contract MToken (0x9E32b13ce7f2E80A01932B42553652E053D6ed8e) {
    +++ description: None
      sourceHashes:
+        ["0xd0f9d9680beb2766f32df8f35302771cde6d0ccb5c3e7f32fdacd13bf5c58203"]
    }
```

```diff
    contract StateCommitmentChain (0xA2FaAAC9120c1Ff75814F0c6DdB119496a12eEA6) {
    +++ description: None
      sourceHashes:
+        ["0x18e98a64fbfe011a7514d7a547900c02a3e0f9a49ab3413d517fd7e0e3c539dd","0xc6bcfffdfe15d4c259332b8f62b29950aecdec253e8eeed2ebfa9e78ca1cea2b"]
    }
```

```diff
    contract ChainStorageContainer (0xA91Ea6F5d1EDA8e6686639d6C88b309cF35D2E57) {
    +++ description: None
      sourceHashes:
+        ["0x94ea4eb57654b23e5ce34a8f4571a446786efb3080044f3ecfc2f3870e601ee0"]
    }
```

```diff
    contract LockingPool (0xD54c868362C2098E0E46F12E7D924C6A332952Dd) {
    +++ description: None
      sourceHashes:
+        ["0xccb5b222f823953e2082d6174b99d09cb9046c862bb91c6fe6cb57e5289a9738","0xff86f55c7d91dbdd408e8b44c6aa3647e5d7cef144de8a65bc84e13e3bf3524f"]
    }
```

```diff
    contract MVM_Verifier (0xe70DD4dE81D282B3fa92A6700FEE8339d2d9b5cb) {
    +++ description: None
      sourceHashes:
+        ["0x18e98a64fbfe011a7514d7a547900c02a3e0f9a49ab3413d517fd7e0e3c539dd","0x85cae352a6b900f9d20a913095da6267900b8e10f04d7277743dcdd0ce8c809e"]
    }
```

```diff
    contract MVM_L2ChainManagerOnL1 (0xf3d58D1794f2634d6649a978f2dc093898FEEBc0) {
    +++ description: None
      sourceHashes:
+        ["0x18e98a64fbfe011a7514d7a547900c02a3e0f9a49ab3413d517fd7e0e3c539dd","0x8be6c2abbd355799e149ebae677a3814685c6b43ebad0b7853fe236af7a84fe7"]
    }
```

Generated with discovered.json: 0xb81d3b00e3bf20bbf472f7ce4bf1ae1c9a9021bd

# Diff at Tue, 01 Oct 2024 10:53:04 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bd754dc73c66120164006054f8d25c5fae9cd910 block: 20211335
- current block number: 20211335

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20211335 (main branch discovery), not current.

```diff
    contract L1CrossDomainMessenger (0x081D1101855bD523bA69A9794e0217F0DB6323ff) {
    +++ description: None
      values.$pastUpgrades:
+        [["2021-11-16T15:26:15.000Z",["0x8bF439ef7167023F009E24b21719Ca5f768Ecb36"]]]
      values.$upgradeCount:
+        1
    }
```

```diff
    contract LockingInfo (0x0fe382b74C3894B65c10E5C12ae60Bbd8FAf5b48) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-03-13T07:27:47.000Z",["0x8db636418F10d514c4c68235ee3d640dDBCC7a8a"]],["2024-06-29T01:46:35.000Z",["0x0D30F0d7934f53aaF6a1630A4c109AF4513a65cC"]]]
    }
```

```diff
    contract L1StandardBridge (0x3980c9ed79d2c191A89E02Fa3529C60eD6e9c04b) {
    +++ description: None
      values.$pastUpgrades:
+        []
    }
```

```diff
    contract MVM_CanonicalTransaction (0x6A1DB7d799FBA381F2a518cA859ED30cB8E1d41a) {
    +++ description: None
      values.$pastUpgrades:
+        []
    }
```

```diff
    contract StateCommitmentChain (0xA2FaAAC9120c1Ff75814F0c6DdB119496a12eEA6) {
    +++ description: None
      values.$pastUpgrades:
+        []
    }
```

```diff
    contract LockingPool (0xD54c868362C2098E0E46F12E7D924C6A332952Dd) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-03-13T07:28:59.000Z",["0xd87Da73F82abe83915d61342199A4690cfdf4718"]],["2024-06-29T01:46:35.000Z",["0xD8f38c831E5032d23065Eaaee8c0620e17c04D60"]]]
    }
```

```diff
    contract MVM_Verifier (0xe70DD4dE81D282B3fa92A6700FEE8339d2d9b5cb) {
    +++ description: None
      values.$pastUpgrades:
+        []
    }
```

```diff
    contract MVM_L2ChainManagerOnL1 (0xf3d58D1794f2634d6649a978f2dc093898FEEBc0) {
    +++ description: None
      values.$pastUpgrades:
+        []
    }
```

Generated with discovered.json: 0x8063b8a835380221625fb5e93e5b60a87eba1e12

# Diff at Fri, 30 Aug 2024 07:53:44 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@6c1bd1f41fadf5f2cb1c1805b5a2c6138a3ed35a block: 20211335
- current block number: 20211335

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20211335 (main branch discovery), not current.

```diff
    contract Metis Multisig (0x48fE1f85ff8Ad9D088863A42Af54d06a1328cF21) {
    +++ description: Can pause, censor, instantly upgrade the bridge and upgrade other critical contracts in the system.
      receivedPermissions.4.via:
-        []
      receivedPermissions.3.via:
-        []
      receivedPermissions.2.via:
-        []
      receivedPermissions.1.via:
-        []
      receivedPermissions.0.via:
-        []
    }
```

```diff
    contract ProxyAdmin (0x8FbB8D00f7621B68F219B0B18738F07aF513D5C8) {
    +++ description: None
      receivedPermissions.1.via:
-        []
      receivedPermissions.0.via:
-        []
    }
```

Generated with discovered.json: 0x5fbf6a2b5d9a2a0956c6939ffdbce796e6a1638d

# Diff at Fri, 23 Aug 2024 09:53:22 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@67597c7d6c810bc726594446890178150240711e block: 20211335
- current block number: 20211335

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20211335 (main branch discovery), not current.

```diff
    contract LockingInfo (0x0fe382b74C3894B65c10E5C12ae60Bbd8FAf5b48) {
    +++ description: None
      values.$upgradeCount:
+        2
    }
```

```diff
    contract L1StandardBridge (0x3980c9ed79d2c191A89E02Fa3529C60eD6e9c04b) {
    +++ description: None
      values.$upgradeCount:
+        0
    }
```

```diff
    contract MVM_CanonicalTransaction (0x6A1DB7d799FBA381F2a518cA859ED30cB8E1d41a) {
    +++ description: None
      values.$upgradeCount:
+        0
    }
```

```diff
    contract StateCommitmentChain (0xA2FaAAC9120c1Ff75814F0c6DdB119496a12eEA6) {
    +++ description: None
      values.$upgradeCount:
+        0
    }
```

```diff
    contract LockingPool (0xD54c868362C2098E0E46F12E7D924C6A332952Dd) {
    +++ description: None
      values.$upgradeCount:
+        2
    }
```

```diff
    contract MVM_Verifier (0xe70DD4dE81D282B3fa92A6700FEE8339d2d9b5cb) {
    +++ description: None
      values.$upgradeCount:
+        0
    }
```

```diff
    contract MVM_L2ChainManagerOnL1 (0xf3d58D1794f2634d6649a978f2dc093898FEEBc0) {
    +++ description: None
      values.$upgradeCount:
+        0
    }
```

Generated with discovered.json: 0xb23695bb53308f9952d1308824fe405e1d092e00

# Diff at Wed, 21 Aug 2024 10:04:08 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@2f6dde3357bf5d79196b6e94f79d853a6c4ec72b block: 20211335
- current block number: 20211335

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20211335 (main branch discovery), not current.

```diff
    contract LockingInfo (0x0fe382b74C3894B65c10E5C12ae60Bbd8FAf5b48) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x8FbB8D00f7621B68F219B0B18738F07aF513D5C8","via":[]}]
    }
```

```diff
    contract L1StandardBridge (0x3980c9ed79d2c191A89E02Fa3529C60eD6e9c04b) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x48fE1f85ff8Ad9D088863A42Af54d06a1328cF21","via":[]}]
    }
```

```diff
    contract Metis Multisig (0x48fE1f85ff8Ad9D088863A42Af54d06a1328cF21) {
    +++ description: Can pause, censor, instantly upgrade the bridge and upgrade other critical contracts in the system.
      assignedPermissions:
-        {"upgrade":["0x3980c9ed79d2c191A89E02Fa3529C60eD6e9c04b","0x6A1DB7d799FBA381F2a518cA859ED30cB8E1d41a","0xA2FaAAC9120c1Ff75814F0c6DdB119496a12eEA6","0xe70DD4dE81D282B3fa92A6700FEE8339d2d9b5cb","0xf3d58D1794f2634d6649a978f2dc093898FEEBc0"]}
      receivedPermissions:
+        [{"permission":"upgrade","target":"0x3980c9ed79d2c191A89E02Fa3529C60eD6e9c04b","via":[]},{"permission":"upgrade","target":"0x6A1DB7d799FBA381F2a518cA859ED30cB8E1d41a","via":[]},{"permission":"upgrade","target":"0xA2FaAAC9120c1Ff75814F0c6DdB119496a12eEA6","via":[]},{"permission":"upgrade","target":"0xe70DD4dE81D282B3fa92A6700FEE8339d2d9b5cb","via":[]},{"permission":"upgrade","target":"0xf3d58D1794f2634d6649a978f2dc093898FEEBc0","via":[]}]
    }
```

```diff
    contract MVM_CanonicalTransaction (0x6A1DB7d799FBA381F2a518cA859ED30cB8E1d41a) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x48fE1f85ff8Ad9D088863A42Af54d06a1328cF21","via":[]}]
    }
```

```diff
    contract ProxyAdmin (0x8FbB8D00f7621B68F219B0B18738F07aF513D5C8) {
    +++ description: None
      assignedPermissions:
-        {"upgrade":["0x0fe382b74C3894B65c10E5C12ae60Bbd8FAf5b48","0xD54c868362C2098E0E46F12E7D924C6A332952Dd"]}
      receivedPermissions:
+        [{"permission":"upgrade","target":"0x0fe382b74C3894B65c10E5C12ae60Bbd8FAf5b48","via":[]},{"permission":"upgrade","target":"0xD54c868362C2098E0E46F12E7D924C6A332952Dd","via":[]}]
    }
```

```diff
    contract StateCommitmentChain (0xA2FaAAC9120c1Ff75814F0c6DdB119496a12eEA6) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x48fE1f85ff8Ad9D088863A42Af54d06a1328cF21","via":[]}]
    }
```

```diff
    contract LockingPool (0xD54c868362C2098E0E46F12E7D924C6A332952Dd) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x8FbB8D00f7621B68F219B0B18738F07aF513D5C8","via":[]}]
    }
```

```diff
    contract MVM_Verifier (0xe70DD4dE81D282B3fa92A6700FEE8339d2d9b5cb) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x48fE1f85ff8Ad9D088863A42Af54d06a1328cF21","via":[]}]
    }
```

```diff
    contract MVM_L2ChainManagerOnL1 (0xf3d58D1794f2634d6649a978f2dc093898FEEBc0) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x48fE1f85ff8Ad9D088863A42Af54d06a1328cF21","via":[]}]
    }
```

Generated with discovered.json: 0xfd7a32c80d4acddc2de88f062b543c857fcaf921

# Diff at Fri, 09 Aug 2024 12:00:31 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bf40aa32f030fd312056ca0ef198c8550467d1d7 block: 20211335
- current block number: 20211335

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20211335 (main branch discovery), not current.

```diff
    contract Metis Multisig (0x48fE1f85ff8Ad9D088863A42Af54d06a1328cF21) {
    +++ description: Can pause, censor, instantly upgrade the bridge and upgrade other critical contracts in the system.
      assignedPermissions.upgrade.4:
-        "0xA2FaAAC9120c1Ff75814F0c6DdB119496a12eEA6"
+        "0xf3d58D1794f2634d6649a978f2dc093898FEEBc0"
      assignedPermissions.upgrade.3:
-        "0xf3d58D1794f2634d6649a978f2dc093898FEEBc0"
+        "0xe70DD4dE81D282B3fa92A6700FEE8339d2d9b5cb"
      assignedPermissions.upgrade.2:
-        "0x6A1DB7d799FBA381F2a518cA859ED30cB8E1d41a"
+        "0xA2FaAAC9120c1Ff75814F0c6DdB119496a12eEA6"
      assignedPermissions.upgrade.1:
-        "0xe70DD4dE81D282B3fa92A6700FEE8339d2d9b5cb"
+        "0x6A1DB7d799FBA381F2a518cA859ED30cB8E1d41a"
    }
```

```diff
    contract ProxyAdmin (0x8FbB8D00f7621B68F219B0B18738F07aF513D5C8) {
    +++ description: None
      assignedPermissions.upgrade.1:
-        "0x0fe382b74C3894B65c10E5C12ae60Bbd8FAf5b48"
+        "0xD54c868362C2098E0E46F12E7D924C6A332952Dd"
      assignedPermissions.upgrade.0:
-        "0xD54c868362C2098E0E46F12E7D924C6A332952Dd"
+        "0x0fe382b74C3894B65c10E5C12ae60Bbd8FAf5b48"
    }
```

Generated with discovered.json: 0xe0e1aa09f815df21c7c4ef140cde5cbfb26bbb3e

# Diff at Fri, 09 Aug 2024 10:10:36 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f0da1d0aab7bc6b3b5e54e7e93480bd98e57035 block: 20211335
- current block number: 20211335

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20211335 (main branch discovery), not current.

```diff
    contract Metis Multisig (0x48fE1f85ff8Ad9D088863A42Af54d06a1328cF21) {
    +++ description: Can pause, censor, instantly upgrade the bridge and upgrade other critical contracts in the system.
      assignedPermissions.admin:
-        ["0x3980c9ed79d2c191A89E02Fa3529C60eD6e9c04b","0x6A1DB7d799FBA381F2a518cA859ED30cB8E1d41a","0xA2FaAAC9120c1Ff75814F0c6DdB119496a12eEA6","0xe70DD4dE81D282B3fa92A6700FEE8339d2d9b5cb","0xf3d58D1794f2634d6649a978f2dc093898FEEBc0"]
      assignedPermissions.upgrade:
+        ["0x3980c9ed79d2c191A89E02Fa3529C60eD6e9c04b","0xe70DD4dE81D282B3fa92A6700FEE8339d2d9b5cb","0x6A1DB7d799FBA381F2a518cA859ED30cB8E1d41a","0xf3d58D1794f2634d6649a978f2dc093898FEEBc0","0xA2FaAAC9120c1Ff75814F0c6DdB119496a12eEA6"]
      values.$multisigThreshold:
-        "4 of 9 (44%)"
+++ severity: LOW
      values.getOwners:
-        ["0x1577D2b835f561BD021E3219Cd786181D0e17ff5","0x36B892a31b311E5e9960739A69D2dF0aa0F81A01","0x001088E383A00ff4ab36F37f7021Cb6d7B415751","0x217fD54d336f710F8aee19572dBfBf0B2297ed69","0xB383E1331dEE29864b68f7D84b0dC289F770d846","0x7a9059F4A6e50090e4f55994d465918200AB4454","0x02058Bb1d98D88087008F2ac1273584591380e3F","0xB961047013F974C5b6B6F8dA4402379525316550","0xa6D8941F935932a531A856C2e48046DA73a1098E"]
+++ severity: HIGH
      values.getThreshold:
-        4
      values.$members:
+        ["0x1577D2b835f561BD021E3219Cd786181D0e17ff5","0x36B892a31b311E5e9960739A69D2dF0aa0F81A01","0x001088E383A00ff4ab36F37f7021Cb6d7B415751","0x217fD54d336f710F8aee19572dBfBf0B2297ed69","0xB383E1331dEE29864b68f7D84b0dC289F770d846","0x7a9059F4A6e50090e4f55994d465918200AB4454","0x02058Bb1d98D88087008F2ac1273584591380e3F","0xB961047013F974C5b6B6F8dA4402379525316550","0xa6D8941F935932a531A856C2e48046DA73a1098E"]
      values.$threshold:
+        4
      values.multisigThreshold:
+        "4 of 9 (44%)"
    }
```

```diff
    contract RewardEscrowerMultisig (0x62478E4eeb4070fE399866aB05e821AB97200947) {
    +++ description: None
      values.$multisigThreshold:
-        "2 of 4 (50%)"
      values.getOwners:
-        ["0x36B892a31b311E5e9960739A69D2dF0aa0F81A01","0x1577D2b835f561BD021E3219Cd786181D0e17ff5","0xa6D8941F935932a531A856C2e48046DA73a1098E","0x26eC4FF77DF305d5a9A7660E046dd1c06ce517f6"]
      values.getThreshold:
-        2
      values.$members:
+        ["0x36B892a31b311E5e9960739A69D2dF0aa0F81A01","0x1577D2b835f561BD021E3219Cd786181D0e17ff5","0xa6D8941F935932a531A856C2e48046DA73a1098E","0x26eC4FF77DF305d5a9A7660E046dd1c06ce517f6"]
      values.$threshold:
+        2
      values.multisigThreshold:
+        "2 of 4 (50%)"
    }
```

```diff
    contract ProxyAdmin (0x8FbB8D00f7621B68F219B0B18738F07aF513D5C8) {
    +++ description: None
      assignedPermissions.admin:
-        ["0x0fe382b74C3894B65c10E5C12ae60Bbd8FAf5b48","0xD54c868362C2098E0E46F12E7D924C6A332952Dd"]
      assignedPermissions.upgrade:
+        ["0xD54c868362C2098E0E46F12E7D924C6A332952Dd","0x0fe382b74C3894B65c10E5C12ae60Bbd8FAf5b48"]
    }
```

Generated with discovered.json: 0x875c4da9f3fbdd0fee44fd890a860a348e3914cc

# Diff at Tue, 30 Jul 2024 11:12:48 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@b2b6471ff62871f4956541f42ec025c356c08f7e block: 20211335
- current block number: 20211335

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20211335 (main branch discovery), not current.

```diff
    contract Metis Multisig (0x48fE1f85ff8Ad9D088863A42Af54d06a1328cF21) {
    +++ description: Can pause, censor, instantly upgrade the bridge and upgrade other critical contracts in the system.
      fieldMeta:
+        {"getOwners":{"severity":"LOW"},"getThreshold":{"severity":"HIGH"}}
    }
```

```diff
    contract Lib_AddressManager (0x918778e825747a892b17C66fe7D24C618262867d) {
    +++ description: None
      fieldMeta:
+        {"StateCommitmentChain":{"severity":"HIGH","description":"Manages the L2 state on Ethereum. L2 state batches can be appended here by proposers."}}
    }
```

Generated with discovered.json: 0xc2b133e2d28061b2f2999510d44b3619992bd7a1

# Diff at Mon, 01 Jul 2024 11:22:03 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@b5540be6f0b9cb1f69a05dba32413b0eae0acbf4 block: 19926649
- current block number: 20211335

## Description

Small upgrade of LockingInfo and LockingPool to add a `withdraw()` function that allows whitelisted sequencers to withdraw their collateral.
No other changes.

## Watched changes

```diff
    contract LockingInfo (0x0fe382b74C3894B65c10E5C12ae60Bbd8FAf5b48) {
    +++ description: None
      upgradeability.implementation:
-        "0x8db636418F10d514c4c68235ee3d640dDBCC7a8a"
+        "0x0D30F0d7934f53aaF6a1630A4c109AF4513a65cC"
      implementations.0:
-        "0x8db636418F10d514c4c68235ee3d640dDBCC7a8a"
+        "0x0D30F0d7934f53aaF6a1630A4c109AF4513a65cC"
    }
```

```diff
    contract LockingPool (0xD54c868362C2098E0E46F12E7D924C6A332952Dd) {
    +++ description: None
      upgradeability.implementation:
-        "0xd87Da73F82abe83915d61342199A4690cfdf4718"
+        "0xD8f38c831E5032d23065Eaaee8c0620e17c04D60"
      implementations.0:
-        "0xd87Da73F82abe83915d61342199A4690cfdf4718"
+        "0xD8f38c831E5032d23065Eaaee8c0620e17c04D60"
    }
```

## Source code changes

```diff
.../LockingInfo/LockingInfo.sol                    | 41 +++++++++++++++++++++-
 .../LockingPool/LockingPool.sol                    | 31 ++++++++++++++++
 2 files changed, 71 insertions(+), 1 deletion(-)
```

Generated with discovered.json: 0xa6118ecf8ee031edb689b088ecd67c6ab3dce64a

# Diff at Wed, 22 May 2024 16:35:57 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@7eae7b47a410c2b8cc7e6a7d7a0bc841a31c6e83 block: 19866806
- current block number: 19926649

## Description

One new signer (`0x1577D2b835f561BD021E3219Cd786181D0e17ff5`) is added to Metis Multisig and RewardEscrowerMultisig, which also gains another signer from Metis Multisig.

## Watched changes

```diff
    contract Metis Multisig (0x48fE1f85ff8Ad9D088863A42Af54d06a1328cF21) {
    +++ description: Can pause, censor, instantly upgrade the bridge and upgrade other critical contracts in the system.
      upgradeability.threshold:
-        "4 of 8 (50%)"
+        "4 of 9 (44%)"
+++ type: PERMISSION
+++ severity: LOW
      values.getOwners.8:
+        "0xa6D8941F935932a531A856C2e48046DA73a1098E"
+++ type: PERMISSION
+++ severity: LOW
      values.getOwners.7:
-        "0xa6D8941F935932a531A856C2e48046DA73a1098E"
+        "0xB961047013F974C5b6B6F8dA4402379525316550"
+++ type: PERMISSION
+++ severity: LOW
      values.getOwners.6:
-        "0xB961047013F974C5b6B6F8dA4402379525316550"
+        "0x02058Bb1d98D88087008F2ac1273584591380e3F"
+++ type: PERMISSION
+++ severity: LOW
      values.getOwners.5:
-        "0x02058Bb1d98D88087008F2ac1273584591380e3F"
+        "0x7a9059F4A6e50090e4f55994d465918200AB4454"
+++ type: PERMISSION
+++ severity: LOW
      values.getOwners.4:
-        "0x7a9059F4A6e50090e4f55994d465918200AB4454"
+        "0xB383E1331dEE29864b68f7D84b0dC289F770d846"
+++ type: PERMISSION
+++ severity: LOW
      values.getOwners.3:
-        "0xB383E1331dEE29864b68f7D84b0dC289F770d846"
+        "0x217fD54d336f710F8aee19572dBfBf0B2297ed69"
+++ type: PERMISSION
+++ severity: LOW
      values.getOwners.2:
-        "0x217fD54d336f710F8aee19572dBfBf0B2297ed69"
+        "0x001088E383A00ff4ab36F37f7021Cb6d7B415751"
+++ type: PERMISSION
+++ severity: LOW
      values.getOwners.1:
-        "0x001088E383A00ff4ab36F37f7021Cb6d7B415751"
+        "0x36B892a31b311E5e9960739A69D2dF0aa0F81A01"
+++ type: PERMISSION
+++ severity: LOW
      values.getOwners.0:
-        "0x36B892a31b311E5e9960739A69D2dF0aa0F81A01"
+        "0x1577D2b835f561BD021E3219Cd786181D0e17ff5"
    }
```

```diff
    contract RewardEscrowerMultisig (0x62478E4eeb4070fE399866aB05e821AB97200947) {
    +++ description: Escrows staking rewards for Sequencers.
      upgradeability.threshold:
-        "2 of 2 (100%)"
+        "2 of 4 (50%)"
      values.getOwners.3:
+        "0x26eC4FF77DF305d5a9A7660E046dd1c06ce517f6"
      values.getOwners.2:
+        "0xa6D8941F935932a531A856C2e48046DA73a1098E"
      values.getOwners.1:
-        "0x26eC4FF77DF305d5a9A7660E046dd1c06ce517f6"
+        "0x1577D2b835f561BD021E3219Cd786181D0e17ff5"
      values.getOwners.0:
-        "0xa6D8941F935932a531A856C2e48046DA73a1098E"
+        "0x36B892a31b311E5e9960739A69D2dF0aa0F81A01"
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19866806 (main branch discovery), not current.

```diff
    contract GnosisSafe (0x62478E4eeb4070fE399866aB05e821AB97200947) {
    +++ description: None
      name:
-        "GnosisSafe"
+        "RewardEscrowerMultisig"
    }
```

Generated with discovered.json: 0xe1b1004c8e1e55d7df21acfdc86aae2a9e021b38

# Diff at Tue, 14 May 2024 07:37:14 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@0dcad16d442c9306c666eb55cc246f5202105346 block: 19810457
- current block number: 19866806

## Description

Sequencer relatives and sequencing rewards are now ignored in watch mode.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19810457 (main branch discovery), not current.

```diff
-   Status: DELETED
    contract EqbToken (0x0Cf6ab3c169B0169E35aD58D350CbACdaF80E139)
    +++ description: None
```

```diff
-   Status: DELETED
    contract BeaconProxy (0x66c7674732357b01B3E9a8F94A05C411BeA1767A)
    +++ description: None
```

Generated with discovered.json: 0x759b0a0e3864e323491cdd0f35fd5e8153894b95

# Diff at Mon, 06 May 2024 10:30:49 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@db9818837028c52979d74016bb4f011aa0545e1f block: 19761802
- current block number: 19810457

## Description

### Enki liquid Metis staking

A sequencer is added to the LockingPool at index 4. It seems to belong to [Enki](https://enkixyz.com/), a new liquid staking protocol on Metis L2.
Enki deployed multiple contracts on L1 (Dealer, SequencerAgent) and L2 (eMetisMinter) to support their liquid staking protocol.
The METIS gets bridged natively from L2 (eMetisMinter) to the Dealer contract on L1 and then deposited by SequencerAgent contracts through the Dealer to the standard LockingInfo contract. Rewards accrue to eMetisMinter on L2.

### Rewards change

METIS rewards for sequencers have been increased by ~50% to 0.001504744 METIS (~10 cents, or 25% APY for 20k METIS per sequencer) per L1 block (L1 block because L2 block times are dynamic).

## Watched changes

```diff
    contract LockingPool (0xD54c868362C2098E0E46F12E7D924C6A332952Dd) {
    +++ description: None
      values.BLOCK_REWARD:
-        1504744000000000
+        2245402873000000
      values.rewardPerBlock:
-        1504744000000000
+        2245402873000000
    }
```

```diff
+   Status: CREATED
    contract BeaconProxy (0x66c7674732357b01B3E9a8F94A05C411BeA1767A)
    +++ description: None
```

## Source code changes

```diff
.../contracts/interfaces/IERC1967.sol              |  26 +++
 .../contracts/interfaces/draft-IERC1822.sol        |  20 ++
 .../contracts/proxy/ERC1967/ERC1967Upgrade.sol     | 157 +++++++++++++
 .../@openzeppelin/contracts/proxy/Proxy.sol        |  86 ++++++++
 .../contracts/proxy/beacon/BeaconProxy.sol         |  61 ++++++
 .../contracts/proxy/beacon/IBeacon.sol             |  16 ++
 .../@openzeppelin/contracts/utils/Address.sol      | 244 +++++++++++++++++++++
 .../@openzeppelin/contracts/utils/StorageSlot.sol  | 138 ++++++++++++
 .../metis/ethereum/.code/BeaconProxy/meta.txt      |   2 +
 9 files changed, 750 insertions(+)
```

Generated with discovered.json: 0x32cd4835f42450c41cf18b3710f155a0ea983391

# Diff at Sat, 27 Apr 2024 06:12:10 GMT:

- author: Bartek Kiepuszewski (<bkiepuszewski@gmail.com>)
- comparing to: main@137703a8d89fb4befd7908b97b5e85939d7d2e88 block: 19726038
- current block number: 19744803

## Description

Owners of StateCommitment Chains and ProxyAdmin that upgrades LockingPool and LockingInfo contracts changed from EOA to Metis MultiSig

## Watched changes

```diff
    contract LockingInfo (0x0fe382b74C3894B65c10E5C12ae60Bbd8FAf5b48) {
    +++ description: None
      values.owner:
-        "0x001088E383A00ff4ab36F37f7021Cb6d7B415751"
+        "0x48fE1f85ff8Ad9D088863A42Af54d06a1328cF21"
    }
```

```diff
    contract ProxyAdmin (0x8FbB8D00f7621B68F219B0B18738F07aF513D5C8) {
    +++ description: None
      values.owner:
-        "0x001088E383A00ff4ab36F37f7021Cb6d7B415751"
+        "0x48fE1f85ff8Ad9D088863A42Af54d06a1328cF21"
    }
```

```diff
    contract StateCommitmentChain (0xA2FaAAC9120c1Ff75814F0c6DdB119496a12eEA6) {
    +++ description: None
      upgradeability.admin:
-        "0x001088E383A00ff4ab36F37f7021Cb6d7B415751"
+        "0x48fE1f85ff8Ad9D088863A42Af54d06a1328cF21"
    }
```

```diff
    contract LockingPool (0xD54c868362C2098E0E46F12E7D924C6A332952Dd) {
    +++ description: None
      values.owner:
-        "0x001088E383A00ff4ab36F37f7021Cb6d7B415751"
+        "0x48fE1f85ff8Ad9D088863A42Af54d06a1328cF21"
    }
```

Generated with discovered.json: 0x94a766214a80c0a94393fcb2824015d182ebffe2

# Diff at Wed, 24 Apr 2024 15:11:42 GMT:

- author: sekuba (<sekuba@users.noreply.githum.com>)
- comparing to: main@c8ed50df909cddbb2e3d9ea318326016eb2de775 block: 19531985
- current block number: 19726038

## Description

Discovery now includes the addresses related to the Metis sequencer decentralization efforts.
The current discovered.json in ProtocolBeat shows a good overview.
Batches still get posted to `0xFf00000000000000000000000000000000001088`.
The logic for the Sequencer Pool MPC that results in posted hash batches on Ethereum is off-chain and does not get verified on ethereum.
LockinPool, LockingInfo (via ProxyAdmin) and SCC have an EOA as Admin.

### LockingInfo

Escrow for METIS locked by bonded Sequencers.

### LockingPool

Registry for Sequencers and the MPC address. Four sequencers are currently bonded of which 3 are funded by Metis and 1 is funded by Equilibria Finance.

### rewardPayer Multisig

2/2 Multisig that funds sequencing rewards.

### StakingPool and StakingPoolManager

Deployed by Equilibria Finance. StakingPool is registered as a Sequencer owner (manages a Sequencer).
Currently not included in discovery as it seems to be external to Metis.

## Watched changes

```diff
    contract LockingInfo (0x0fe382b74C3894B65c10E5C12ae60Bbd8FAf5b48) {
    +++ description: None
      values.rewardPayer:
-        "0x0000000000000000000000000000000000000000"
+        "0x62478E4eeb4070fE399866aB05e821AB97200947"
    }
```

```diff
    contract Lib_AddressManager (0x918778e825747a892b17C66fe7D24C618262867d) {
    +++ description: None
      values.BondManager:
-        "0xf51B9C9a1c12e7E48BEC15DC358D0C1f0d7Eb3be"
+        "0x595801b85628ec6979C420988b8843A40F850528"
    }
```

```diff
    contract LockingPool (0xD54c868362C2098E0E46F12E7D924C6A332952Dd) {
    +++ description: None
      values.BLOCK_REWARD:
-        761000000000000
+        1504744000000000
      values.mpcAddress:
-        "0x0000000000000000000000000000000000000000"
+        "0xD294A6f4287edbFeBF9d57B79ce657BD33bB8b3b"
      values.rewardPerBlock:
-        761000000000000
+        1504744000000000
      values.sequencers.3:
+        ["58634578080235465000000",0,2,2,0,0,0,1,"0x735Aad08c5eF7620b6422E85613f8335Ec07b573","0x31e623DCb8B43aD4d05aAA6209574cf336980590","0xa3f2635f4d555f68f7be80fcf7b13ec9ecdf09365e6a57f6c5f513aa1d1af4565e53a0612e4e4a97124aa95cc17a3e56b5da1afb21c41d9cdb7e5264380a0790","0x0Cf6ab3c169B0169E35aD58D350CbACdaF80E139",2]
      values.sequencers.2:
+        ["20000000000000000000000","341195111000000000000",1,1,0,0,0,1,"0x24194DFB135B33507a8F05C3F9Ada922F40CE3Ff","0xAfF606251d8540f97Ca2Db12774C0147A170aB9e","0x713de5a736a196d0d65fc7e5d8cd716086d099fbaee929774752f2e8e370105e2d90e846d64167ea59a95160277abddf004660c6dac47f5c92a0f00234fe7000","0x0000000000000000000000000000000000000000",2]
      values.sequencers.1:
+        ["20000000000000000000000","386890878000000000000",1,1,0,0,0,1,"0xe8D97563Cfd919F1B9F7cE0049346e8796148CD5","0xa233Cc81fC6C12e3318eA71EC5D7bBA78C706b04","0x1674b9842e300ab236bf6cedfea92e80a04cc7f12bbff2ff35b01295380d9211a9861a40867a4a04c6a89ee0a022f7afccbb5dddb87d622e1ddff9bd2069c7e8","0x0000000000000000000000000000000000000000",2]
      values.sequencers.0:
+        ["20000000000000000000000","431750306000000000000",1,1,0,0,0,1,"0x05B755a8B2fEc50391B5C38B2afB206Ba0e8e50E","0xEcA7Ae7dE0d1978DF299a547Ee66c4503fBa474D","0x4d5e02936a222d68b5d423e566828d8c67ca2290cf428254c44c7be458b33decec1fe85d900756811366e2d19baeb2fe81b46ce10c1863e00d811e68a4e76c9f","0x0000000000000000000000000000000000000000",2]
    }
```

```diff
-   Status: DELETED
    contract BondManager (0xf51B9C9a1c12e7E48BEC15DC358D0C1f0d7Eb3be)
    +++ description: None
```

```diff
+   Status: CREATED
    contract EqbToken (0x0Cf6ab3c169B0169E35aD58D350CbACdaF80E139)
    +++ description: None
```

```diff
+   Status: CREATED
    contract BondManager (0x595801b85628ec6979C420988b8843A40F850528)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafe (0x62478E4eeb4070fE399866aB05e821AB97200947)
    +++ description: None
```

## Source code changes

```diff
.../contracts/L1/verification/BondManager.sol      |  26 +-
 .../contracts/L1/verification/IBondManager.sol     |   1 +
 .../contracts/libraries/utils/Lib_Uint.sol         |  39 ++
 .../{.code@19531985 => .code}/BondManager/meta.txt |   2 +-
 .../access/OwnableUpgradeable.sol                  |  95 +++++
 .../proxy/utils/Initializable.sol                  | 138 +++++++
 .../token/ERC20/ERC20Upgradeable.sol               | 395 +++++++++++++++++++
 .../token/ERC20/IERC20Upgradeable.sol              |  82 ++++
 .../ERC20/extensions/IERC20MetadataUpgradeable.sol |  28 ++
 .../utils/AddressUpgradeable.sol                   | 195 ++++++++++
 .../utils/ContextUpgradeable.sol                   |  37 ++
 .../ethereum/.code/EqbToken/contracts/EqbToken.sol |  24 ++
 .../metis/ethereum/.code/EqbToken/meta.txt         |   2 +
 .../implementation/contracts/GnosisSafe.sol        | 422 +++++++++++++++++++++
 .../implementation/contracts/base/Executor.sol     |  27 ++
 .../contracts/base/FallbackManager.sol             |  53 +++
 .../implementation/contracts/base/GuardManager.sol |  50 +++
 .../contracts/base/ModuleManager.sol               | 133 +++++++
 .../implementation/contracts/base/OwnerManager.sol | 149 ++++++++
 .../implementation/contracts/common/Enum.sol       |   8 +
 .../contracts/common/EtherPaymentFallback.sol      |  13 +
 .../contracts/common/SecuredTokenTransfer.sol      |  35 ++
 .../contracts/common/SelfAuthorized.sol            |  16 +
 .../contracts/common/SignatureDecoder.sol          |  36 ++
 .../implementation/contracts/common/Singleton.sol  |  11 +
 .../contracts/common/StorageAccessible.sol         |  47 +++
 .../contracts/external/GnosisSafeMath.sol          |  54 +++
 .../contracts/interfaces/ISignatureValidator.sol   |  20 +
 .../.code/GnosisSafe/implementation/meta.txt       |   2 +
 .../.code/GnosisSafe/proxy/GnosisSafeProxy.sol     | 155 ++++++++
 .../metis/ethereum/.code/GnosisSafe/proxy/meta.txt |   2 +
 31 files changed, 2286 insertions(+), 11 deletions(-)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19531985 (main branch discovery), not current.

```diff
+   Status: CREATED
    contract LockingInfo (0x0fe382b74C3894B65c10E5C12ae60Bbd8FAf5b48)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x8FbB8D00f7621B68F219B0B18738F07aF513D5C8)
    +++ description: None
```

```diff
+   Status: CREATED
    contract LockingPool (0xD54c868362C2098E0E46F12E7D924C6A332952Dd)
    +++ description: None
```

Generated with discovered.json: 0x61dd6c8c90be3d312520dbd91d547e88fa6b5daf

# Diff at Thu, 28 Mar 2024 10:22:25 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@dd32bb06b292cc8459fb09925454ee3a90f5c27e block: 19489325
- current block number: 19531985

## Description

Update discovery to include the multisig threshold.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19489325 (main branch discovery), not current.

```diff
    contract Metis Multisig (0x48fE1f85ff8Ad9D088863A42Af54d06a1328cF21) {
    +++ description: Can pause, censor, instantly upgrade the bridge and upgrade other critical contracts in the system.
      upgradeability.threshold:
+        "4 of 8 (50%)"
    }
```

Generated with discovered.json: 0x32ada392a2476f61c6a679a370ed6032290b3273

# Diff at Fri, 22 Mar 2024 09:39:12 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@0bfaf274e094a51da737f99f9979af9d44884387 block: 19432288
- current block number: 19489325

## Description

The State Commitment Chain (SCC) is upgraded to a new implementation behind a proxy and the default proposer is changed.

### Decentralized proposer changes in the SCC

The SCC now disregards the Canonical Transaction Chain (CTC).
The logic for accepting state batches from permissionless proposers in the SCC is now present in appendStateBatch(), but the BondManager still disqualifies any non-default proposer and thus in practice the sequencer is still centralized until the BondManager code gets updated to actually verify collateralization when called.

The old SCC rejected any third party state batches during a 'SEQUENCER_PUBLISH_WINDOW' of half a year, which effectively made the default sequencer the only one. This has now been deprecated in the new SCC implementation.

## Watched changes

```diff
    contract Lib_AddressManager (0x918778e825747a892b17C66fe7D24C618262867d) {
    +++ description: None
      values._1088_MVM_Proposer:
-        "0x9cB01d516D930EF49591a05B09e0D33E6286689D"
+        "0xf3CEB4C2ef996CdBc95C4E18c6D0CA988CC09040"
+++ description: Manages the L2 state on Ethereum. L2 state batches can be appended here by proposers.
+++ type: CODE_CHANGE
+++ severity: HIGH
      values.StateCommitmentChain:
-        "0xf209815E595Cdf3ed0aAF9665b1772e608AB9380"
+        "0xA2FaAAC9120c1Ff75814F0c6DdB119496a12eEA6"
    }
```

```diff
-   Status: DELETED
    contract StateCommitmentChain (0xf209815E595Cdf3ed0aAF9665b1772e608AB9380)
    +++ description: None
```

```diff
+   Status: CREATED
    contract StateCommitmentChain (0xA2FaAAC9120c1Ff75814F0c6DdB119496a12eEA6)
    +++ description: None
```

## Source code changes

```diff
.../ICanonicalTransactionChain.sol => /dev/null    | 441 ---------------------
 .../libraries/rlp/Lib_RLPWriter.sol => /dev/null   | 208 ----------
 .../utils/Lib_Bytes32Utils.sol => /dev/null        |  47 ---
 .../utils/Lib_BytesUtils.sol => /dev/null          | 127 ------
 .../@openzeppelin/contracts/access/Ownable.sol     |   0
 .../@openzeppelin/contracts/utils/Context.sol      |   0
 .../contracts/L1/rollup/IChainStorageContainer.sol |  62 +--
 .../contracts/L1/rollup/IStateCommitmentChain.sol  |  55 +--
 .../contracts/L1/verification/IBondManager.sol     |   1 +
 .../contracts/MVM/MVM_StateCommitmentChain.sol}    | 330 +++++----------
 .../contracts/libraries/codec/Lib_OVMCodec.sol     |   3 -
 .../libraries/resolver/Lib_AddressManager.sol      |   0
 .../libraries/resolver/Lib_AddressResolver.sol     |   0
 .../contracts/libraries/rlp/Lib_RLPReader.sol      |   0
 .../contracts/libraries/utils/Lib_MerkleTree.sol   |   0
 .../contracts/libraries/utils/Lib_Uint.sol         |  39 ++
 .../StateCommitmentChain/implementation/meta.txt   |   2 +
 .../StateCommitmentChain/meta.txt => /dev/null     |   2 -
 .../contracts/chugsplash/L1ChugSplashProxy.sol     | 278 +++++++++++++
 .../interfaces/iL1ChugSplashDeployer.sol           |   9 +
 .../.code/StateCommitmentChain/proxy/meta.txt      |   2 +
 21 files changed, 459 insertions(+), 1147 deletions(-)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19432288 (main branch discovery), not current.

```diff
    contract StateCommitmentChain (0xf209815E595Cdf3ed0aAF9665b1772e608AB9380) {
    +++ description: None
      values.getLastSequencerTimestampByChainId:
-        1710389927
+        [0,0,0,0,0]
      values.getTotalBatchesByChainId:
-        22918
+        [0,0,0,0,0]
      values.getTotalElementsByChainId:
-        15213630
+        [0,0,0,0,0]
      errors:
+        {"getLastSequencerTimestampByChainId":"Too many values. Update configuration to explore fully","getTotalBatchesByChainId":"Too many values. Update configuration to explore fully","getTotalElementsByChainId":"Too many values. Update configuration to explore fully"}
    }
```

Generated with discovered.json: 0xb4944b31e0a3f27a1a1f785c95fb0e29a6338e7a

# Diff at Thu, 14 Mar 2024 09:14:30 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@af87effd99a7b745cb97368cfbb16dc82443174a block: 18833503
- current block number: 19432288

## Description

Two signers are added to the multisig.

## Watched changes

```diff
    contract Metis Multisig (0x48fE1f85ff8Ad9D088863A42Af54d06a1328cF21) {
    +++ description: None
      values.getOwners[7]:
+        "0xa6D8941F935932a531A856C2e48046DA73a1098E"
      values.getOwners[6]:
+        "0xB961047013F974C5b6B6F8dA4402379525316550"
+++ description: Array of the multisig signers
+++ type: PERMISSION
+++ severity: LOW
      values.getOwners.5:
-        "0xa6D8941F935932a531A856C2e48046DA73a1098E"
+        "0x02058Bb1d98D88087008F2ac1273584591380e3F"
+++ description: Array of the multisig signers
+++ type: PERMISSION
+++ severity: LOW
      values.getOwners.4:
-        "0xB961047013F974C5b6B6F8dA4402379525316550"
+        "0x7a9059F4A6e50090e4f55994d465918200AB4454"
+++ description: Array of the multisig signers
+++ type: PERMISSION
+++ severity: LOW
      values.getOwners.3:
-        "0x02058Bb1d98D88087008F2ac1273584591380e3F"
+        "0xB383E1331dEE29864b68f7D84b0dC289F770d846"
+++ description: Array of the multisig signers
+++ type: PERMISSION
+++ severity: LOW
      values.getOwners.2:
-        "0x7a9059F4A6e50090e4f55994d465918200AB4454"
+        "0x217fD54d336f710F8aee19572dBfBf0B2297ed69"
+++ description: Array of the multisig signers
+++ type: PERMISSION
+++ severity: LOW
      values.getOwners.1:
-        "0xB383E1331dEE29864b68f7D84b0dC289F770d846"
+        "0x001088E383A00ff4ab36F37f7021Cb6d7B415751"
+++ description: Array of the multisig signers
+++ type: PERMISSION
+++ severity: LOW
      values.getOwners.0:
-        "0x217fD54d336f710F8aee19572dBfBf0B2297ed69"
+        "0x36B892a31b311E5e9960739A69D2dF0aa0F81A01"
    }
```

Generated with discovered.json: 0xd3b550ff7c80b542babb88f19ab684dbc8a006b9

# Diff at Thu, 21 Dec 2023 10:01:06 GMT:

- author: Radina Talanova (<nt.radina@gmail.com>)
- comparing to: main@e3ed8c1fec052d9121fe4f20c32a54980307e76e

## Description

The total supply of the Metis Token has been increased to 10000000.

## Watched changes

```diff
    contract MToken (0x9E32b13ce7f2E80A01932B42553652E053D6ed8e) {
      values.totalSupply:
-        "5410000510000000000000000"
+        "10000000000000000000000000"
    }
```
