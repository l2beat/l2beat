Generated with discovered.json: 0xf4af50fdb3e4403cd6d8ea8c1ec9d5317d106f47

# Diff at Wed, 07 Oct 2026 13:54:24 GMT:

- id: 33e3ca7c
- author: vincfurc (<vincfurc@users.noreply.github.com>)
- comparing to: main@5edde6f8ac69ac3c111b5c401ecf044f7c546310 block: 1790850991
- current timestamp: 1791381140

## Description

Liquifier: the 24h timed pause set on 2026-09-30 by a guardian was lifted early on 2026-10-01 by the operating multisig.

## Watched changes

```diff
    contract Liquifier (eth:0x9FFDF407cDe9a93c47611799DA23924Af3EF764F) [etherfi/Liquifier] {
    +++ description: Accepts whitelisted liquid staking tokens and restaked positions in exchange for eETH, later unwinding them to ETH.
      values.pausedUntil:
-        1790894891
+        0
    }
```

Generated with discovered.json: 0x2fbe4952c5f4bf0aef668ba8f04ae06432e1948d

# Diff at Thu, 01 Oct 2026 11:10:31 GMT:

- id: e2a34318
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@ed7cdd77b1978c118fb9b1f824ae6cb10dfb566e block: 1789917578
- current timestamp: 1790850991

## Description

- Upgrade via the 10d Upgrade timelock of EtherFiNodesManager, StakingManager, EtherFiAdmin and the EtherFiNode beacon implementation. Adds pod-less EtherFiNodes (node itself is the withdrawal credential target and calls the EIP-7002/EIP-7251 predeploys directly), EigenPod retirement, checks that consolidation targets are ether.fi validators, moves `linkLegacyValidatorIds` to the operating multisig, opens call forwarding to the housekeeping role (still selector-whitelisted) and drops id-based overloads.
  - EtherFiNodesManager: https://disco.l2beat.com/diff/eth:0xcF5928EA7d7F164ec868cEdA7a69E08a102B5e05/eth:0x020016Fa077515451975712595EB3e984907ad3b
  - StakingManager: https://disco.l2beat.com/diff/eth:0x66e1C53e846eF3E9f3722591868AfcFfB7f39800/eth:0x6515B41BDcf83BE5543B88591BC0bC34d844c9c2
  - EtherFiAdmin: https://disco.l2beat.com/diff/eth:0x5b083DDe26FBA0E43940b2e161FCd129903FC27d/eth:0x841fA691AA6E30E97c817608F90111701a3D0Ac8
  - EtherFiNode (beacon impl): https://disco.l2beat.com/diff/eth:0x556Db8c611FE63e694413F718d795f976dcF5881/eth:0x73Df4a005332525fB0A0B2cf067352a9b706f233
- LiquidityPool `validatorSizeWei` 32 -> 1901 ETH (Operating timelock): new validators are funded as 1901 ETH compounding validators.
- Liquifier paused for 1 day by a guardian (`pausedUntil`).
- Treasury Safe signer swapped.

## Watched changes

```diff
    contract Safe (eth:0x0c83EAe1FE72c390A02E426572854931EefF93BA) [GnosisSafe] {
    +++ description: None
      values.$members.7:
-        "eth:0x4024380A7c52328a0BB2B608846dCf2E4621f049"
+        "eth:0x513A849d64C3a199C288D679946a65e5a5B709F4"
    }
```

```diff
    contract EtherFiAdmin (eth:0x0EF8fa4760Db8f5Cd4d993f3e3416f30f942D705) [etherfi/EtherFiAdmin] {
    +++ description: Executor that validates and applies EtherFiOracle reports (rebase, withdrawal finalization, validator approvals) subject to per-task bounds.
      sourceHashes.1:
-        "0xb5f2218dca3868408b4238b08b798eb2ab3e45919de0d85dd4f5963c3e2cecdc"
+        "0x3736ab2214c0d4dffc6a163cadb347acb16e34bffc95d8a146cfc90158618d94"
      values.$implementation:
-        "eth:0x5b083DDe26FBA0E43940b2e161FCd129903FC27d"
+        "eth:0x841fA691AA6E30E97c817608F90111701a3D0Ac8"
      values.$pastUpgrades.6:
+        ["2026-09-25T14:59:11.000Z","0x6a586a6e6ff829746c75f63317f5bda559191c3fac5240220ea45fae3023ea1d",["eth:0x841fA691AA6E30E97c817608F90111701a3D0Ac8"]]
      values.$upgradeCount:
-        6
+        7
      values.getImplementation:
-        "eth:0x5b083DDe26FBA0E43940b2e161FCd129903FC27d"
+        "eth:0x841fA691AA6E30E97c817608F90111701a3D0Ac8"
      implementationNames.eth:0x5b083DDe26FBA0E43940b2e161FCd129903FC27d:
-        "EtherFiAdmin"
      implementationNames.eth:0x841fA691AA6E30E97c817608F90111701a3D0Ac8:
+        "EtherFiAdmin"
    }
```

```diff
    contract StakingManager (eth:0x25e821b7197B146F7713C3b89B6A4D83516B912d) [etherfi/StakingManager] {
    +++ description: Registers validators and creates EtherFiNode instances (behind a beacon), with or without an EigenLayer EigenPod. Batches beacon-chain deposits from LiquidityPool ETH, binding withdrawal credentials to the node's EigenPod or, for a node without a pod, to the node itself.
      sourceHashes.1:
-        "0xf36cf379595a1d17bc1065160d3a3eaa2d035f0b27b4b68d02d98f38ce47b663"
+        "0x81978cd715155eb02a9c441bf197fe27a8ae61eb6589c8255f400431c01b398a"
      values.$implementation:
-        "eth:0x66e1C53e846eF3E9f3722591868AfcFfB7f39800"
+        "eth:0x6515B41BDcf83BE5543B88591BC0bC34d844c9c2"
      values.$pastUpgrades.10:
+        ["2026-09-25T14:59:11.000Z","0x6a586a6e6ff829746c75f63317f5bda559191c3fac5240220ea45fae3023ea1d",["eth:0x6515B41BDcf83BE5543B88591BC0bC34d844c9c2"]]
      values.$upgradeCount:
-        10
+        11
      values.implementation:
-        "eth:0x556Db8c611FE63e694413F718d795f976dcF5881"
+        "eth:0x73Df4a005332525fB0A0B2cf067352a9b706f233"
      implementationNames.eth:0x66e1C53e846eF3E9f3722591868AfcFfB7f39800:
-        "StakingManager"
      implementationNames.eth:0x6515B41BDcf83BE5543B88591BC0bC34d844c9c2:
+        "StakingManager"
    }
```

```diff
    contract LiquidityPool (eth:0x308861A430be4cce5502d0A12724771Fc6DaF216) [etherfi/LiquidityPool] {
    +++ description: The protocol hub and ETH custodian. Holds pooled ETH, mints/burns eETH, prices shares, routes deposits to validators via StakingManager and serves withdrawals through the WithdrawRequestNFT queue and the EtherFiRedemptionManager buffer.
      values.validatorSizeWei:
-        "32000000000000000000"
+        "1901000000000000000000"
    }
```

```diff
    contract UpgradeableBeacon (eth:0x3c55986Cfee455E2533F4D29006634EcF9B7c03F) [global/UpgradeableBeacon] {
    +++ description: A beacon with an upgradeable implementation currently set as eth:0x73Df4a005332525fB0A0B2cf067352a9b706f233. Beacon proxy contracts pointing to this beacon will all use its implementation.
      description:
-        "A beacon with an upgradeable implementation currently set as eth:0x556Db8c611FE63e694413F718d795f976dcF5881. Beacon proxy contracts pointing to this beacon will all use its implementation."
+        "A beacon with an upgradeable implementation currently set as eth:0x73Df4a005332525fB0A0B2cf067352a9b706f233. Beacon proxy contracts pointing to this beacon will all use its implementation."
+++ severity: HIGH
      values.implementation:
-        "eth:0x556Db8c611FE63e694413F718d795f976dcF5881"
+        "eth:0x73Df4a005332525fB0A0B2cf067352a9b706f233"
    }
```

```diff
-   Status: DELETED
    contract EtherFiNode (eth:0x556Db8c611FE63e694413F718d795f976dcF5881) [etherfi/EtherFiNode]
    +++ description: Per-node implementation (behind a beacon). A node either owns an EigenLayer EigenPod that is its validators' withdrawal address, or, if created without a pod, is the withdrawal address itself and calls the EIP-7002/EIP-7251 system contracts directly to request exits and consolidations. ETH it receives is swept to the LiquidityPool. EigenLayer contracts are external.
```

```diff
    contract EtherFiNodesManager (eth:0x8B71140AD2e5d1E7018d2a7f8a288BD3CD38916F) [etherfi/EtherFiNodesManager] {
    +++ description: Manages the fleet of EtherFiNode contracts: resolves each node's withdrawal-credential target (its EigenPod, or the node itself if it has none), forwards whitelisted EigenLayer and external calls, submits EIP-7002 exit and EIP-7251 consolidation requests and sweeps node ETH to the LiquidityPool.
      sourceHashes.1:
-        "0x254c6c89d62670152c9108204fc7b53e3b2e9de699f29271f75bb6d6f5e654f2"
+        "0xa3bff41a6f2d4f89f69fef7d5aa8b83d941986ea885f6b9cf76af4c1d0fbf106"
      values.$implementation:
-        "eth:0xcF5928EA7d7F164ec868cEdA7a69E08a102B5e05"
+        "eth:0x020016Fa077515451975712595EB3e984907ad3b"
      values.$pastUpgrades.18:
+        ["2026-09-25T14:59:11.000Z","0x6a586a6e6ff829746c75f63317f5bda559191c3fac5240220ea45fae3023ea1d",["eth:0x020016Fa077515451975712595EB3e984907ad3b"]]
      values.$upgradeCount:
-        18
+        19
      implementationNames.eth:0xcF5928EA7d7F164ec868cEdA7a69E08a102B5e05:
-        "EtherFiNodesManager"
      implementationNames.eth:0x020016Fa077515451975712595EB3e984907ad3b:
+        "EtherFiNodesManager"
    }
```

```diff
    contract Liquifier (eth:0x9FFDF407cDe9a93c47611799DA23924Af3EF764F) [etherfi/Liquifier] {
    +++ description: Accepts whitelisted liquid staking tokens and restaked positions in exchange for eETH, later unwinding them to ETH.
      values.pausedUntil:
-        0
+        1790894891
    }
```

```diff
+   Status: CREATED
    contract EtherFiNode (eth:0x73Df4a005332525fB0A0B2cf067352a9b706f233) [etherfi/EtherFiNode]
    +++ description: Per-node implementation (behind a beacon). A node either owns an EigenLayer EigenPod that is its validators' withdrawal address, or, if created without a pod, is the withdrawal address itself and calls the EIP-7002/EIP-7251 system contracts directly to request exits and consolidations. ETH it receives is swept to the LiquidityPool. EigenLayer contracts are external.
```

## Source code changes

```diff
.../EtherFiAdmin/EtherFiAdmin.sol                  |   63 +-
 .../{.flat@1789917578 => .flat}/EtherFiNode.sol    | 3291 ++++++++++----------
 .../EtherFiNodesManager/EtherFiNodesManager.sol    |  314 +-
 .../StakingManager/StakingManager.sol              |   82 +-
 4 files changed, 2082 insertions(+), 1668 deletions(-)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1789917578 (main branch discovery), not current.

```diff
    contract StakingManager (eth:0x25e821b7197B146F7713C3b89B6A4D83516B912d) [etherfi/StakingManager] {
    +++ description: Registers validators and creates EtherFiNode instances (behind a beacon), with or without an EigenLayer EigenPod. Batches beacon-chain deposits from LiquidityPool ETH, binding withdrawal credentials to the node's EigenPod or, for a node without a pod, to the node itself.
      description:
-        "Registers validators and creates EtherFiNode instances (behind a beacon). Batches beacon-chain deposits from LiquidityPool ETH."
+        "Registers validators and creates EtherFiNode instances (behind a beacon), with or without an EigenLayer EigenPod. Batches beacon-chain deposits from LiquidityPool ETH, binding withdrawal credentials to the node's EigenPod or, for a node without a pod, to the node itself."
    }
```

```diff
    contract EtherFiNode (eth:0x556Db8c611FE63e694413F718d795f976dcF5881) [etherfi/EtherFiNode] {
    +++ description: Per-node implementation (behind a beacon). A node either owns an EigenLayer EigenPod that is its validators' withdrawal address, or, if created without a pod, is the withdrawal address itself and calls the EIP-7002/EIP-7251 system contracts directly to request exits and consolidations. ETH it receives is swept to the LiquidityPool. EigenLayer contracts are external.
      description:
-        "Per-node implementation (behind a beacon) that holds an EigenLayer EigenPod and splits validator rewards. EigenLayer contracts are external."
+        "Per-node implementation (behind a beacon). A node either owns an EigenLayer EigenPod that is its validators' withdrawal address, or, if created without a pod, is the withdrawal address itself and calls the EIP-7002/EIP-7251 system contracts directly to request exits and consolidations. ETH it receives is swept to the LiquidityPool. EigenLayer contracts are external."
    }
```

```diff
    contract EtherFiNodesManager (eth:0x8B71140AD2e5d1E7018d2a7f8a288BD3CD38916F) [etherfi/EtherFiNodesManager] {
    +++ description: Manages the fleet of EtherFiNode contracts: resolves each node's withdrawal-credential target (its EigenPod, or the node itself if it has none), forwards whitelisted EigenLayer and external calls, submits EIP-7002 exit and EIP-7251 consolidation requests and sweeps node ETH to the LiquidityPool.
      description:
-        "Manages the fleet of EtherFiNode contracts: withdrawal credentials, rewards distribution and validator lifecycle."
+        "Manages the fleet of EtherFiNode contracts: resolves each node's withdrawal-credential target (its EigenPod, or the node itself if it has none), forwards whitelisted EigenLayer and external calls, submits EIP-7002 exit and EIP-7251 consolidation requests and sweeps node ETH to the LiquidityPool."
    }
```

Generated with discovered.json: 0xf540b9213090c715d1bd68a678e5a331c8f3e040

# Diff at Wed, 23 Sep 2026 05:46:19 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@2e9174e8edc4a3b646f958a1d6e0d4360abec40d block: 1789917578
- current timestamp: 1789917578

## Description

Refresh config-derived discovery metadata at the main-branch block.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1789917578 (main branch discovery), not current.

```diff
    contract UpgradeableBeacon (eth:0x29b1C223be35CCB6bfBd43154528cD0B881756e9) [global/UpgradeableBeacon] {
    +++ description: A beacon with an upgradeable implementation currently set as eth:0xf4718766a7fc8c81F788669B0985FAC03D064D29. Beacon proxy contracts pointing to this beacon will all use its implementation.
      fieldMeta.owner:
-        {"severity":"HIGH"}
    }
```

```diff
    contract UpgradeableBeacon (eth:0x3c55986Cfee455E2533F4D29006634EcF9B7c03F) [global/UpgradeableBeacon] {
    +++ description: A beacon with an upgradeable implementation currently set as eth:0x556Db8c611FE63e694413F718d795f976dcF5881. Beacon proxy contracts pointing to this beacon will all use its implementation.
      fieldMeta.owner:
-        {"severity":"HIGH"}
    }
```

```diff
    contract ProxyAdmin (eth:0xa9E9bBf04F95688D7fd82036f83544630E463CAc) [global/ProxyAdmin] {
    +++ description: None
      fieldMeta:
-        {"addressManager":{"severity":"HIGH"},"owner":{"severity":"HIGH"}}
    }
```

```diff
    contract ProxyAdmin (eth:0xDBf6bE120D4dc72f01534673a1223182D9F6261D) [global/ProxyAdmin] {
    +++ description: None
      fieldMeta:
-        {"addressManager":{"severity":"HIGH"},"owner":{"severity":"HIGH"}}
    }
```

Generated with discovered.json: 0x4d327249ee45bbd427186bb1e87c3d72ad3f5e32

# Diff at Mon, 21 Sep 2026 11:24:00 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@231e4a5828ee5ff5a863f7b80215466ca39a5b1e block: 1789917578
- current timestamp: 1789917578

## Description

ossification re-review: field severities

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1789917578 (main branch discovery), not current.

```diff
    contract UpgradeableBeacon (eth:0x29b1C223be35CCB6bfBd43154528cD0B881756e9) [global/UpgradeableBeacon] {
    +++ description: A beacon with an upgradeable implementation currently set as eth:0xf4718766a7fc8c81F788669B0985FAC03D064D29. Beacon proxy contracts pointing to this beacon will all use its implementation.
      fieldMeta.owner:
+        {"severity":"HIGH"}
    }
```

```diff
    contract UpgradeableBeacon (eth:0x3c55986Cfee455E2533F4D29006634EcF9B7c03F) [global/UpgradeableBeacon] {
    +++ description: A beacon with an upgradeable implementation currently set as eth:0x556Db8c611FE63e694413F718d795f976dcF5881. Beacon proxy contracts pointing to this beacon will all use its implementation.
      fieldMeta.owner:
+        {"severity":"HIGH"}
    }
```

```diff
    contract ProxyAdmin (eth:0xa9E9bBf04F95688D7fd82036f83544630E463CAc) [global/ProxyAdmin] {
    +++ description: None
      fieldMeta.addressManager:
+        {"severity":"HIGH"}
    }
```

```diff
    contract ProxyAdmin (eth:0xDBf6bE120D4dc72f01534673a1223182D9F6261D) [global/ProxyAdmin] {
    +++ description: None
      fieldMeta.addressManager:
+        {"severity":"HIGH"}
    }
```

Generated with discovered.json: 0x2ca750e03b9d71e960df966af2a40e96bbfe9e66

# Diff at Sun, 20 Sep 2026 15:21:38 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@ad122e711014afb1a7c2455ebdcb95e39fccaa39 block: 1789673752
- current timestamp: 1789917578

## Description

critical contracts and severities for the ossification perimeter (re-run after merging main)

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1789673752 (main branch discovery), not current.

```diff
    contract ProxyAdmin (eth:0xa9E9bBf04F95688D7fd82036f83544630E463CAc) [global/ProxyAdmin] {
    +++ description: None
      fieldMeta:
+        {"owner":{"severity":"HIGH"}}
    }
```

```diff
    contract ProxyAdmin (eth:0xDBf6bE120D4dc72f01534673a1223182D9F6261D) [global/ProxyAdmin] {
    +++ description: None
      fieldMeta:
+        {"owner":{"severity":"HIGH"}}
    }
```

Generated with discovered.json: 0xb89ab4cc575f1a17437190aa945cf7c5d7ea9745

# Diff at Thu, 10 Sep 2026 12:48:31 GMT:

- author: vincfurc (<vincfurc@users.noreply.github.com>)
- current timestamp: 1788954474

## Description

Initial discovery of ether.fi (eETH/weETH): tokens, LiquidityPool custody, staking/validator ops, oracle+admin report pipeline, withdrawal queue and redemption buffer, restaking and cross-chain adapters. External protocols (Lido, EigenLayer, LayerZero, Curve) and per-validator node clones are treated as out-of-scope boundaries.

## Initial discovery

```diff
+   Status: CREATED
    contract DepositContract (eth:0x00000000219ab540356cBB839Cbe05303d7705Fa) [global/DepositContract]
    +++ description: Ethereum Beacon Chain deposit contract.
```

```diff
+   Status: CREATED
    contract AuctionManager (eth:0x00C452aFFee3a17d9Cecc1Bcd2B8d5C7635C4CB9) [etherfi/AuctionManager]
    +++ description: Node-operator bid auction: operators post bids that are consumed when validators are assigned to them.
```

```diff
+   Status: CREATED
    contract Safe (eth:0x0c83EAe1FE72c390A02E426572854931EefF93BA) [GnosisSafe]
    +++ description: None
```

```diff
+   Status: CREATED
    contract EtherFiAdmin (eth:0x0EF8fa4760Db8f5Cd4d993f3e3416f30f942D705) [etherfi/EtherFiAdmin]
    +++ description: Executor that validates and applies EtherFiOracle reports (rebase, withdrawal finalization, validator approvals) subject to per-task bounds.
```

```diff
+   Status: CREATED
    contract EtherFiRestaker (eth:0x1B7a4C3797236A1C37f8741c0Be35c2c72736fFf) [etherfi/EtherFiRestaker]
    +++ description: Routes protocol ETH/LSTs into EigenLayer restaking and Lido withdrawals. EigenLayer and Lido contracts are external dependencies.
```

```diff
+   Status: CREATED
    contract AvsOperatorManager (eth:0x2093Bbb221f1d8C7c932c32ee28Be6dEe4a37A6a) [etherfi/AvsOperatorManager]
    +++ description: Deploys and controls per-AVS operator contracts (behind a beacon) for EigenLayer AVS registration. EigenLayer core is external.
```

```diff
+   Status: CREATED
    contract StakingManager (eth:0x25e821b7197B146F7713C3b89B6A4D83516B912d) [etherfi/StakingManager]
    +++ description: Registers validators and creates EtherFiNode instances (behind a beacon). Batches beacon-chain deposits from LiquidityPool ETH.
```

```diff
+   Status: CREATED
    contract UpgradeableBeacon (eth:0x29b1C223be35CCB6bfBd43154528cD0B881756e9) [global/UpgradeableBeacon]
    +++ description: A beacon with an upgradeable implementation currently set as eth:0xf4718766a7fc8c81F788669B0985FAC03D064D29. Beacon proxy contracts pointing to this beacon will all use its implementation.
```

```diff
+   Status: CREATED
    contract GnosisSafe (eth:0x2aCA71020De61bb532008049e1Bd41E451aE8AdC) [GnosisSafe]
    +++ description: None
```

```diff
+   Status: CREATED
    contract EtherFiViewer (eth:0x2ecd155405cA52a5ca0e552981fF44A8252FAb81) [etherfi/EtherFiViewer]
    +++ description: Stateless read-only aggregator for off-chain interfaces. Holds no funds or permissions.
```

```diff
+   Status: CREATED
    contract LiquidityPool (eth:0x308861A430be4cce5502d0A12724771Fc6DaF216) [etherfi/LiquidityPool]
    +++ description: The protocol hub and ETH custodian. Holds pooled ETH, mints/burns eETH, prices shares, routes deposits to validators via StakingManager and serves withdrawals through the WithdrawRequestNFT queue and the EtherFiRedemptionManager buffer.
```

```diff
+   Status: CREATED
    contract PriorityWithdrawalQueue (eth:0x35e7D6feF6f72aDd3c3e39dEc6d9CCc29e3345FA) [etherfi/PriorityWithdrawalQueue]
    +++ description: Priority lane of the withdrawal system for privileged/large redemptions.
```

```diff
+   Status: CREATED
    contract eETH (eth:0x35fA164735182de50811E8e2E824cFb9B6118ac2) [etherfi/eETH]
    +++ description: Rebasing liquid staking token. Balances are shares × the LiquidityPool exchange rate and total supply tracks pooled ETH. Only the LiquidityPool can mint and burn.
```

```diff
+   Status: CREATED
    contract UpgradeableBeacon (eth:0x3c55986Cfee455E2533F4D29006634EcF9B7c03F) [global/UpgradeableBeacon]
    +++ description: A beacon with an upgradeable implementation currently set as eth:0x556Db8c611FE63e694413F718d795f976dcF5881. Beacon proxy contracts pointing to this beacon will all use its implementation.
```

```diff
+   Status: CREATED
    contract MembershipManager (eth:0x3d320286E014C3e1ce99Af6d6B00f0C1D63E3000) [etherfi/MembershipManager]
    +++ description: Manages membership NFTs recording loyalty points and tiers for depositors.
```

```diff
+   Status: CREATED
    contract RevokeAdmin (eth:0x4A84BA0b5e716b37C78D0F5094757205626C7C1e) [etherfi/RevokeAdmin]
    +++ description: Contract that can revoke admin and other roles in an emergency.
```

```diff
+   Status: CREATED
    contract EtherFiNode (eth:0x556Db8c611FE63e694413F718d795f976dcF5881) [etherfi/EtherFiNode]
    +++ description: Per-node implementation (behind a beacon) that holds an EigenLayer EigenPod and splits validator rewards. EigenLayer contracts are external.
```

```diff
+   Status: CREATED
    contract Blacklister (eth:0x5585996E7cFE95f2D99e61168B8b35C66Ff99B18) [etherfi/Blacklister]
    +++ description: Holds the blacklist consulted by eETH/weETH transfers.
```

```diff
+   Status: CREATED
    contract EtherFiOracle (eth:0x57AaF0004C716388B21795431CD7D5f9D3Bb6a41) [etherfi/EtherFiOracle]
    +++ description: Committee oracle: members submit periodic reports (beacon balances, rewards, withdrawal amounts) that reach consensus before EtherFiAdmin applies them.
```

```diff
+   Status: CREATED
    contract RoleRegistry (eth:0x62247D29B4B9BECf4BB73E0c722cf6445cfC7cE9) [etherfi/RoleRegistry]
    +++ description: Central access-control registry: named roles gate privileged functions across the protocol. Role membership is read live.
```

```diff
+   Status: CREATED
    contract EtherFiRateLimiter (eth:0x6C7c54cfC2225fA985cD25F04d923B93c60a02F8) [etherfi/EtherFiRateLimiter]
    +++ description: Shared rate limiter that bounds sensitive flows (e.g. withdrawals) per epoch.
```

```diff
+   Status: CREATED
    contract CumulativeMerkleDrop (eth:0x6Db24Ee656843E3fE03eb8762a54D86186bA6B64) [etherfi/CumulativeMerkleDrop]
    +++ description: Distributor for cumulative Merkle-based claims of KING reward tokens.
```

```diff
+   Status: CREATED
    contract EtherFiRewardsRouter (eth:0x73f7b1184B5cD361cC0f7654998953E2a251dd58) [etherfi/EtherFiRewardsRouter]
    +++ description: Routes execution-layer/consensus rewards ETH back to the LiquidityPool and treasury.
```

```diff
+   Status: CREATED
    contract WithdrawRequestNFT (eth:0x7d5706f6ef3F89B3951E23e557CDFBC3239D4E2c) [etherfi/WithdrawRequestNFT]
    +++ description: The eETH withdrawal queue. Burning eETH mints an NFT claim that the oracle and admin finalize, after which holders redeem it for ETH.
```

```diff
+   Status: CREATED
    contract AddressProvider (eth:0x8487c5F8550E3C3e7734Fe7DCF77DB2B72E4A848) [etherfi/AddressProvider]
    +++ description: Legacy address registry mapping protocol contract names to addresses.
```

```diff
+   Status: CREATED
    contract RestakingRewardsRouter (eth:0x89E45081437c959A827d2027135bC201Ab33a2C8) [etherfi/RestakingRewardsRouter]
    +++ description: Routes EigenLayer restaking rewards to their recipients. The reward token is external.
```

```diff
+   Status: CREATED
    contract EtherFiNodesManager (eth:0x8B71140AD2e5d1E7018d2a7f8a288BD3CD38916F) [etherfi/EtherFiNodesManager]
    +++ description: Manages the fleet of EtherFiNode contracts: withdrawal credentials, rewards distribution and validator lifecycle.
```

```diff
+   Status: CREATED
    contract CumulativeMerkleRewardsDistributor (eth:0x9A8c5046a290664Bf42D065d33512fe403484534) [etherfi/CumulativeMerkleRewardsDistributor]
    +++ description: Cumulative Merkle distributor for protocol rewards.
```

```diff
+   Status: CREATED
    contract EtherFiTimelock (eth:0x9f26d4C958fD811A1F59B01B86Be7dFFc9d20761) [etherfi/EtherFiTimelock]
    +++ description: OpenZeppelin TimelockController governing contract upgrades and privileged operations. Two instances: a longer Upgrade timelock and a shorter Operating timelock.
```

```diff
+   Status: CREATED
    contract Liquifier (eth:0x9FFDF407cDe9a93c47611799DA23924Af3EF764F) [etherfi/Liquifier]
    +++ description: Accepts whitelisted liquid staking tokens and restaked positions in exchange for eETH, later unwinding them to ETH.
```

```diff
+   Status: CREATED
    contract Safe (eth:0xA000244b4a36D57Ea1ECB39b5F02f255e4C8cd52) [GnosisSafe]
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyAdmin (eth:0xa9E9bBf04F95688D7fd82036f83544630E463CAc) [global/ProxyAdmin]
    +++ description: None
```

```diff
+   Status: CREATED
    contract MembershipNFT (eth:0xb49e4420eA6e35F98060Cd133842DbeA9c27e479) [etherfi/MembershipNFT]
    +++ description: ERC-1155 membership NFT recording loyalty and tier points.
```

```diff
+   Status: CREATED
    contract EtherfiOFTAdapterUpgradeable (eth:0xcd2eb13D6831d4602D80E5db9230A57596CDCA63) [etherfi/EtherfiOFTAdapterUpgradeable]
    +++ description: LayerZero OFT lock-box for weETH: locks mainnet weETH against cross-chain mint/burn. The LayerZero endpoint is external.
```

```diff
+   Status: CREATED
    contract EtherFiTimelock (eth:0xcD425f44758a08BaAB3C4908f3e3dE5776e45d7a) [etherfi/EtherFiTimelock]
    +++ description: OpenZeppelin TimelockController governing contract upgrades and privileged operations. Two instances: a longer Upgrade timelock and a shorter Operating timelock.
```

```diff
+   Status: CREATED
    contract weETH (eth:0xCd5fE23C85820F7B72D0926FC9b05b43E359b7ee) [etherfi/weETH]
    +++ description: Non-rebasing wrapper of eETH. wrap() and unwrap() convert at the LiquidityPool rate. getRate() returns the eETH-per-weETH price.
```

```diff
+   Status: CREATED
    contract DepositAdapter (eth:0xcfC6d9Bd7411962Bfe7145451A7EF71A24b6A7A2) [etherfi/DepositAdapter]
    +++ description: User-facing helper that wraps ETH and accepted liquid staking tokens into weETH in one call.
```

```diff
+   Status: CREATED
    contract EtherFiOperationParameters (eth:0xD0Ff8996DB4bDB46870b7E833b7532f484fEad1A) [etherfi/EtherFiOperationParameters]
    +++ description: Holds tunable operational parameters and per-role operator addresses.
```

```diff
+   Status: CREATED
    contract NodeOperatorManager (eth:0xd5edf7730ABAd812247F6F54D7bd31a52554e35E) [etherfi/NodeOperatorManager]
    +++ description: Registry of permissioned node operators and their key/bid allowances.
```

```diff
+   Status: CREATED
    contract EtherfiL1SyncPoolETH (eth:0xD789870beA40D056A4d26055d0bEFcC8755DA146) [etherfi/EtherfiL1SyncPoolETH]
    +++ description: L1 side of the cross-chain deposit sync pool: mints eETH against ETH bridged from L2s via LayerZero. The endpoint is external.
```

```diff
+   Status: CREATED
    contract EtherFiRedemptionManager (eth:0xDadEf1fFBFeaAB4f68A9fD181395F68b4e4E7Ae0) [etherfi/EtherFiRedemptionManager]
    +++ description: Instant-redemption buffer: swaps eETH/weETH for ETH from a liquidity buffer at a fee, bypassing the withdrawal queue up to available liquidity.
```

```diff
+   Status: CREATED
    contract ProxyAdmin (eth:0xDBf6bE120D4dc72f01534673a1223182D9F6261D) [global/ProxyAdmin]
    +++ description: None
```

```diff
+   Status: CREATED
    contract AvsOperator (eth:0xf4718766a7fc8c81F788669B0985FAC03D064D29) [eigenlayer/AVSOperator]
    +++ description: None
```

```diff
+   Status: CREATED
    contract WeETHWithdrawAdapter (eth:0xFbfe6b9cEe0E555Bad7e2E7309EFFC75200cBE38) [etherfi/WeETHWithdrawAdapter]
    +++ description: Helper that lets a holder go from weETH directly into the eETH withdrawal queue in one transaction.
```
