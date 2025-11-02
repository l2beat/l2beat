Generated with discovered.json: 0xbcf59c3129576741002675696eee8bc141adaf09

# Diff at Wed, 29 Oct 2025 18:21:16 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@cd3acb30978545d875852451e86e15a019f3b00a block: 1761223045
- current timestamp: 1761761995

## Description

performed an empty mint to disallow inflating the supply for one year. the inflation rate is 2% per year but it was never used, and it is the first time they explicitly skip a year. the value here shows the timestamp of last mint.

## Watched changes

```diff
    contract MintManager (oeth:0x5C4e7Ba1E219E47948e6e3F55019A647bA501005) {
    +++ description: Controls the OP inflation rate, which is currently hardcoded to 2% annually.
      values.mintPermittedAfter:
-        0
+        1793220409
    }
```

Generated with discovered.json: 0x46c4412bd0070ee7ddde29397205ba18790a1ada

# Diff at Mon, 20 Oct 2025 15:27:50 GMT:

- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@bfe80e92f67656ee716f7ab40cc8f3f9e92dc7d6 block: 1759501868
- current timestamp: 1760973987

## Description

OpFoundation multisigs member rotation.

## Watched changes

```diff
    contract OpFoundationUpgradeSafe (eth:0x847B5c174615B1B7fDF770882256e2D3E95b9D92) {
    +++ description: None
      values.$members.5:
-        "eth:0x7cB07FE039a92B3D784f284D919503A381BEC54f"
+        "eth:0x69acfE2096Dfb8d5A041eF37693553c48d9BFd02"
    }
```

```diff
    contract OpFoundationOperationsSafe (eth:0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A) {
    +++ description: None
      values.$members.5:
-        "eth:0x7cB07FE039a92B3D784f284D919503A381BEC54f"
+        "eth:0x69acfE2096Dfb8d5A041eF37693553c48d9BFd02"
    }
```

Generated with discovered.json: 0x9428db4fa555821476493c76919104e9598ed8bf

# Diff at Fri, 03 Oct 2025 14:32:18 GMT:

- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@2a86d862e7686075acdb5f1c005d9ab095b4d598 block: 1759250642
- current timestamp: 1759501868

## Description

This is upgrade 16a (https://gov.optimism.io/t/maintenance-upgrade-proposal-u16a/10288)

OptimismPortal2 - removed unused superchain withdrawal code, ETH lockbox feature moved out to its own contract.
https://disco.l2beat.com/diff/eth:0xEFEd7F38BB9BE74bBa583a1A5B7D0fe7C9D5787a/eth:0x381E729FF983FA4BCEd820e7b922d79bF653B999

SystemConfig - setFeature function to activate/deactivate features (currently used for the ETHLockbox feature).
https://disco.l2beat.com/diff/eth:0xFaA660bf783CBAa55e1B7F3475C20Db74a53b9Fa/eth:0x2bFE4A5Bd5A41e9d848d843ebCDFa15954e9A557

L1ERC721Bridge - minor changes.
https://disco.l2beat.com/diff/eth:0x25d6CeDEB277Ad7ebEe71226eD7877768E0B7A2F/eth:0x7f1d12fB2911EB095278085f721e644C1f675696

L1CrossDomainMessenger - minor changes.
https://disco.l2beat.com/diff/eth:0xD26bB3aaAa4cB5638A8581A4c4b1d937D8E05c54/eth:0x22D12E0FAebD62d429514A65EBAe32dd316c12D6

L1StandardBridge - minor changes.
https://disco.l2beat.com/diff/eth:0x44AfB7722AF276A601D524F429016A18B6923df0/eth:0xe32B192fb1DcA88fCB1C56B3ACb429e32238aDCb

FaultDisputeGame (via DisputeGameFactory gameImpls[0]) - no code changes; constructor variables updated (e.g., DelayedWETH, VM).
https://disco.l2beat.com/diff/eth:0xd73Dd0F5665055B03eA0bFcac49bd4d26F1FFA4F/eth:0x22F2AfB837156246187Cd2652ad281eE08EBBB9d

PermissionedDisputeGame (via DisputeGameFactory gameImpls[1]) - no code changes; constructor variables updated (e.g., DelayedWETH, VM).
https://disco.l2beat.com/diff/eth:0xEcca4BFbD017002abf25Aeebf2B21b903A5fC124/eth:0xbF2027A15e1a6ceE76257ED9bB623C8dC08D4EF7

MIPS → MIPS64 - added function for pseudorandomness generation.
https://disco.l2beat.com/diff/eth:0xA1B54D89e305bcd322Ba0C9C094093173C0d6b3a/eth:0x07BABE08EE4D07dBA236530183B24055535A7011

DelayedWETH (replacement 1) - same code, same admin; only diff is totalSupply.
https://disco.l2beat.com/diff/eth:0xc5f54F934075677FBA99b5E43468439cbdE88ca7/eth:0xD061AB95069987868768818cc1248705351e2D0e

DelayedWETH (replacement 2) - same code, same admin; only diff is totalSupply.
https://disco.l2beat.com/diff/eth:0xe214879aD573693A4C49f7654449Caa455cdE34f/eth:0xe03F4d1D0E6B8b18b97198598b3f792E57BA17d4

## Watched changes

```diff
    contract SystemConfig (eth:0x229047fed2591dbec1eF1118d64F7aF3dB9EB290) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      template:
-        "opstack/SystemConfig_pauseId"
+        "opstack/SystemConfig"
      sourceHashes.1:
-        "0xbca9388c120780391489984ba6cb1ec20bc4b0cf9644579f960e0b3aee1282b5"
+        "0xc64176b1425d9639f5082ecef5e30b3b365111e2be71596ab1bd831edba65bd9"
      values.$implementation:
-        "eth:0xFaA660bf783CBAa55e1B7F3475C20Db74a53b9Fa"
+        "eth:0x2bFE4A5Bd5A41e9d848d843ebCDFa15954e9A557"
      values.$pastUpgrades.12:
+        ["2025-10-02T16:35:23.000Z","0x744cf7d28324729cace731ac736872da669439a0d380f1f52b8d31af203f7329",["eth:0x2bFE4A5Bd5A41e9d848d843ebCDFa15954e9A557"]]
      values.$upgradeCount:
-        12
+        13
      values.initVersion:
-        2
+        3
      values.version:
-        "3.4.0"
+        "3.7.0"
      fieldMeta.paused:
-        {"severity":"HIGH","description":"`superchainConfig.paused(address(lockbox)) || superchainConfig.paused(address(0))`"}
      implementationNames.eth:0xFaA660bf783CBAa55e1B7F3475C20Db74a53b9Fa:
-        "SystemConfig"
      implementationNames.eth:0x2bFE4A5Bd5A41e9d848d843ebCDFa15954e9A557:
+        "SystemConfig"
    }
```

```diff
    contract AnchorStateRegistry (eth:0x23B2C62946350F4246f9f9D027e071f0264FD113) {
    +++ description: Contains the latest confirmed state root that can be used as a starting point in a dispute game. It specifies which game type can be used for withdrawals, which currently is the FaultDisputeGame.
      values.$pastUpgrades.1:
+        ["2025-10-02T16:35:23.000Z","0x744cf7d28324729cace731ac736872da669439a0d380f1f52b8d31af203f7329",["eth:0xeb69cC681E8D4a557b30DFFBAd85aFfD47a2CF2E"]]
      values.$upgradeCount:
-        1
+        2
    }
```

```diff
    contract L1CrossDomainMessenger (eth:0x25ace71c97B33Cc4729CF772ae268934F7ab5fA1) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      sourceHashes.1:
-        "0x21cd6c80343ba49cbb9f3e96c5f4ca0bc77bc617825495fbaad1026ed9a42026"
+        "0x12cf78bcfa479caaee8133c0f935dcdcc333cdc116805f6b81bd80f6ba52128c"
      values.$implementation:
-        "eth:0xD26bB3aaAa4cB5638A8581A4c4b1d937D8E05c54"
+        "eth:0x22D12E0FAebD62d429514A65EBAe32dd316c12D6"
      values.$pastUpgrades.13:
+        ["2025-10-02T16:35:23.000Z","0x744cf7d28324729cace731ac736872da669439a0d380f1f52b8d31af203f7329",["eth:0x22D12E0FAebD62d429514A65EBAe32dd316c12D6"]]
      values.$upgradeCount:
-        13
+        14
      values.initVersion:
-        2
+        3
      values.version:
-        "2.9.0"
+        "2.10.0"
      implementationNames.eth:0xD26bB3aaAa4cB5638A8581A4c4b1d937D8E05c54:
-        "L1CrossDomainMessenger"
      implementationNames.eth:0x22D12E0FAebD62d429514A65EBAe32dd316c12D6:
+        "L1CrossDomainMessenger"
    }
```

```diff
    contract SuperchainProxyAdmin (eth:0x543bA4AADBAb8f9025686Bd03993043599c6fB04) {
    +++ description: None
      directlyReceivedPermissions.10.from:
-        "eth:0xc5f54F934075677FBA99b5E43468439cbdE88ca7"
+        "eth:0xD061AB95069987868768818cc1248705351e2D0e"
      directlyReceivedPermissions.11.from:
-        "eth:0xe214879aD573693A4C49f7654449Caa455cdE34f"
+        "eth:0xe03F4d1D0E6B8b18b97198598b3f792E57BA17d4"
    }
```

```diff
    contract SuperchainProxyAdminOwner (eth:0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A) {
    +++ description: None
      receivedPermissions.10.from:
-        "eth:0xc5f54F934075677FBA99b5E43468439cbdE88ca7"
+        "eth:0xD061AB95069987868768818cc1248705351e2D0e"
      receivedPermissions.11.from:
-        "eth:0xe214879aD573693A4C49f7654449Caa455cdE34f"
+        "eth:0xe03F4d1D0E6B8b18b97198598b3f792E57BA17d4"
    }
```

```diff
    contract L1ERC721Bridge (eth:0x5a7749f83b81B301cAb5f48EB8516B986DAef23D) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      sourceHashes.1:
-        "0x8ec2646e7ca57c49fef7769f200a751b7199526d590c9c43e6c7b134f43de630"
+        "0xab560cdc633c64552a47cd693ebc9aaab91fe80bec99e9e89b9d13d89a994c22"
      values.$implementation:
-        "eth:0x25d6CeDEB277Ad7ebEe71226eD7877768E0B7A2F"
+        "eth:0x7f1d12fB2911EB095278085f721e644C1f675696"
      values.$pastUpgrades.9:
+        ["2025-10-02T16:35:23.000Z","0x744cf7d28324729cace731ac736872da669439a0d380f1f52b8d31af203f7329",["eth:0x7f1d12fB2911EB095278085f721e644C1f675696"]]
      values.$upgradeCount:
-        9
+        10
      values.initVersion:
-        2
+        3
      values.version:
-        "2.7.0"
+        "2.8.0"
      implementationNames.eth:0x25d6CeDEB277Ad7ebEe71226eD7877768E0B7A2F:
-        "L1ERC721Bridge"
      implementationNames.eth:0x7f1d12fB2911EB095278085f721e644C1f675696:
+        "L1ERC721Bridge"
    }
```

```diff
    contract L1StandardBridge (eth:0x99C9fc46f92E8a1c0deC1b1747d010903E884bE1) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      sourceHashes.1:
-        "0x7ca93e9b7ebe02b3a013eeb8b0db9c37bee9ffa1a9b47f52dc52b8d5594afcb5"
+        "0x29b630d028d2dfddff75dc128b41ae51836c874dcd31a62c9d7313599e6261fb"
      values.$implementation:
-        "eth:0x44AfB7722AF276A601D524F429016A18B6923df0"
+        "eth:0xe32B192fb1DcA88fCB1C56B3ACb429e32238aDCb"
      values.initVersion:
-        2
+        3
      values.version:
-        "2.6.0"
+        "2.7.0"
      implementationNames.eth:0x44AfB7722AF276A601D524F429016A18B6923df0:
-        "L1StandardBridge"
      implementationNames.eth:0xe32B192fb1DcA88fCB1C56B3ACb429e32238aDCb:
+        "L1StandardBridge"
    }
```

```diff
-   Status: DELETED
    contract MIPS (eth:0xA1B54D89e305bcd322Ba0C9C094093173C0d6b3a)
    +++ description: The MIPS contract is used to execute the final step of the dispute game which objectively determines the winner of the dispute.
```

```diff
    contract OptimismPortal2 (eth:0xbEb5Fc579115071764c7423A4f12eDde41f106Ed) {
    +++ description: The OptimismPortal contract is the main entry point to deposit funds from L1 to L2. It also allows to prove and finalize withdrawals. It specifies which game type can be used for withdrawals, which currently is the FaultDisputeGame.
      template:
-        "opstack/OptimismPortal2_post13"
+        "opstack/OptimismPortal2"
      sourceHashes.1:
-        "0x025be6415d31a7c8f475bf94e05a8288787b4adb41562108a42d0574c9af9543"
+        "0x8ca0818fc584e81a5cead0efc1c32f3273182323dcbd08a60779d55cb0aa90c9"
      description:
-        "The OptimismPortal contract is the main entry point to deposit funds from L1 to L2. It also allows to prove and finalize withdrawals. The state root respected for withdrawals comnes from the FaultDisputeGame."
+        "The OptimismPortal contract is the main entry point to deposit funds from L1 to L2. It also allows to prove and finalize withdrawals. It specifies which game type can be used for withdrawals, which currently is the FaultDisputeGame."
      values.$implementation:
-        "eth:0xEFEd7F38BB9BE74bBa583a1A5B7D0fe7C9D5787a"
+        "eth:0x381E729FF983FA4BCEd820e7b922d79bF653B999"
      values.$pastUpgrades.10:
+        ["2025-10-02T16:35:23.000Z","0x744cf7d28324729cace731ac736872da669439a0d380f1f52b8d31af203f7329",["eth:0x381E729FF983FA4BCEd820e7b922d79bF653B999"]]
      values.$upgradeCount:
-        10
+        11
      values.initVersion:
-        2
+        3
      values.superRootsActive:
-        false
      values.version:
-        "4.6.0"
+        "5.0.0"
      implementationNames.eth:0xEFEd7F38BB9BE74bBa583a1A5B7D0fe7C9D5787a:
-        "OptimismPortal2"
      implementationNames.eth:0x381E729FF983FA4BCEd820e7b922d79bF653B999:
+        "OptimismPortal2"
    }
```

```diff
-   Status: DELETED
    contract DelayedWETH (eth:0xc5f54F934075677FBA99b5E43468439cbdE88ca7)
    +++ description: Contract designed to hold the bonded ETH for each game. It is designed as a wrapper around WETH to allow an owner to function as a backstop if a game would incorrectly distribute funds.
```

```diff
-   Status: DELETED
    contract FaultDisputeGame (eth:0xd73Dd0F5665055B03eA0bFcac49bd4d26F1FFA4F)
    +++ description: Logic of the dispute game. When a state root is proposed, a dispute game contract is deployed. Challengers can use such contracts to challenge the proposed state root.
```

```diff
-   Status: DELETED
    contract DelayedWETH (eth:0xe214879aD573693A4C49f7654449Caa455cdE34f)
    +++ description: Contract designed to hold the bonded ETH for each game. It is designed as a wrapper around WETH to allow an owner to function as a backstop if a game would incorrectly distribute funds.
```

```diff
    contract DisputeGameFactory (eth:0xe5965Ab5962eDc7477C8520243A95517CD252fA9) {
    +++ description: The dispute game factory allows the creation of dispute games, used to propose state roots and eventually challenge them.
      values.$pastUpgrades.3:
+        ["2025-10-02T16:35:23.000Z","0x744cf7d28324729cace731ac736872da669439a0d380f1f52b8d31af203f7329",["eth:0x33D1e8571a85a538ed3D5A4d88f46C112383439D"]]
      values.$upgradeCount:
-        3
+        4
+++ severity: HIGH
      values.gameImpls.0:
-        "eth:0xd73Dd0F5665055B03eA0bFcac49bd4d26F1FFA4F"
+        "eth:0x22F2AfB837156246187Cd2652ad281eE08EBBB9d"
+++ severity: HIGH
      values.gameImpls.1:
-        "eth:0xEcca4BFbD017002abf25Aeebf2B21b903A5fC124"
+        "eth:0xbF2027A15e1a6ceE76257ED9bB623C8dC08D4EF7"
    }
```

```diff
-   Status: DELETED
    contract PermissionedDisputeGame (eth:0xEcca4BFbD017002abf25Aeebf2B21b903A5fC124)
    +++ description: Same as FaultDisputeGame, but only two permissioned addresses are designated as proposer and challenger.
```

```diff
+   Status: CREATED
    contract MIPS (eth:0x07BABE08EE4D07dBA236530183B24055535A7011)
    +++ description: The MIPS contract is used to execute the final step of the dispute game which objectively determines the winner of the dispute.
```

```diff
+   Status: CREATED
    contract FaultDisputeGame (eth:0x22F2AfB837156246187Cd2652ad281eE08EBBB9d)
    +++ description: Logic of the dispute game. When a state root is proposed, a dispute game contract is deployed. Challengers can use such contracts to challenge the proposed state root.
```

```diff
+   Status: CREATED
    contract PermissionedDisputeGame (eth:0xbF2027A15e1a6ceE76257ED9bB623C8dC08D4EF7)
    +++ description: Same as FaultDisputeGame, but only two permissioned addresses are designated as proposer and challenger.
```

```diff
+   Status: CREATED
    contract DelayedWETH (eth:0xD061AB95069987868768818cc1248705351e2D0e)
    +++ description: Contract designed to hold the bonded ETH for each game. It is designed as a wrapper around WETH to allow an owner to function as a backstop if a game would incorrectly distribute funds.
```

```diff
+   Status: CREATED
    contract DelayedWETH (eth:0xe03F4d1D0E6B8b18b97198598b3f792E57BA17d4)
    +++ description: Contract designed to hold the bonded ETH for each game. It is designed as a wrapper around WETH to allow an owner to function as a backstop if a game would incorrectly distribute funds.
```

## Source code changes

```diff
.../DelayedWETH.sol                                |   0
 .../Proxy.p.sol                                    |   0
 .../DelayedWETH.sol                                |   0
 .../Proxy.p.sol                                    |   0
 .../L1CrossDomainMessenger.sol                     |  33 ++-
 .../L1ERC721Bridge/L1ERC721Bridge.sol              |  33 ++-
 .../L1StandardBridge/L1StandardBridge.sol          |  33 ++-
 .../optimism/{.flat@1759250642 => .flat}/MIPS.sol  |  70 ++++-
 .../OptimismPortal2/OptimismPortal2.sol            | 283 +++++----------------
 .../SystemConfig/SystemConfig.sol                  |  63 ++++-
 10 files changed, 267 insertions(+), 248 deletions(-)
```

Generated with discovered.json: 0x31339a96597c5826631399338abb22e770abfb23

# Diff at Tue, 30 Sep 2025 16:46:51 GMT:

- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@c66a02d28b2467edd595f8a8468988549dd6d3cf block: 1755525885
- current timestamp: 1759250642

## Description

Period formatting change.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1755525885 (main branch discovery), not current.

```diff
    contract LivenessModule (eth:0x0454092516c9A4d636d3CAfA1e82161376C8a748) {
    +++ description: used to remove members inactive for 3mo 8d while making sure that the threshold remains above 75%. If the number of members falls below 8, the eth:0x847B5c174615B1B7fDF770882256e2D3E95b9D92 takes ownership of the multisig
      description:
-        "used to remove members inactive for 98d while making sure that the threshold remains above 75%. If the number of members falls below 8, the eth:0x847B5c174615B1B7fDF770882256e2D3E95b9D92 takes ownership of the multisig"
+        "used to remove members inactive for 3mo 8d while making sure that the threshold remains above 75%. If the number of members falls below 8, the eth:0x847B5c174615B1B7fDF770882256e2D3E95b9D92 takes ownership of the multisig"
      values.livenessInterval:
-        "98d"
+        "3mo 8d"
    }
```

```diff
    contract LivenessGuard (eth:0x24424336F04440b1c28685a38303aC33C9D14a25) {
    +++ description: Modular contract to be used together with the LivenessModule. Tracks liveness / activity of Safe owners.
      receivedPermissions.0.description:
-        "can remove members of eth:0xc2819DC788505Aac350142A7A707BF9D03E3Bd03 inactive for 98d."
+        "can remove members of eth:0xc2819DC788505Aac350142A7A707BF9D03E3Bd03 inactive for 3mo 8d."
    }
```

```diff
    contract SuperchainConfig (eth:0x95703e0982140D16f8ebA6d158FccEde42f04a4C) {
    +++ description: Used to manage global configuration values for multiple OP Chains within a single Superchain network. The SuperchainConfig contract manages individual pause states for each chain connected to it, as well as a global pause state for all chains. The guardian role can pause either separately, but each pause expires after 3 months if left untouched.
      values.pauseExpiryFmt:
-        "91d 6h"
+        "3mo 1d"
    }
```

Generated with discovered.json: 0x36129a8c95dae27a9c81a4147da205c42a0b3a2d

# Diff at Mon, 01 Sep 2025 10:01:10 GMT:

Merge mark

Generated with discovered.json: 0x7dae92d4b1e854f566557c1eeaf16cd4f853d2ec

# Diff at Mon, 18 Aug 2025 14:04:55 GMT:

- chain: ethereum
- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@70881ae705004613dec64296e96ebed823431af6 block: 1753434851
- current timestamp: 1755525885

## Description

Security council members rotation.

## Watched changes

```diff
    contract Optimism Security Council (0xc2819DC788505Aac350142A7A707BF9D03E3Bd03) {
    +++ description: None
      values.$members.4:
-        "eth:0x51aCb8e1205De850D1b512584FeE9C29C3813dDa"
+        "eth:0x3A53B4B081Eb7Cb00C46497b16Ea22e65E4Faa94"
      values.$members.10:
-        "eth:0x9Eb11A55132c851b9991F148b3Af791ca498fD7A"
+        "eth:0x0a8742365a7EB0A3698293ac54357B5Ac04cefE6"
    }
```

Generated with discovered.json: 0x5b2ac51f9e66bc6e3e888ee22e0db69a71390a73

# Diff at Fri, 25 Jul 2025 17:48:24 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@dff0cc78015c4909229d9a2a9ca8fb6a3498b9d5 block: 22567749
- current block number: 22995199

## Description

[Optimism upgrade 16](https://gov.optimism.io/t/upgrade-16-proposal-interop-contracts-stage-1-and-go-1-23-support-in-cannon/10037): Interop Contracts, Stage 1, and Go 1.23 Support in Cannon

gov changes:
- DeputyGuardianModule removed: only the SC can e.g. blacklistDisputeGame or change respectedGameType
- DeputyPauseModule is now a module of the Optimism Guardian Multisig, meaning the Optimism EOA can pause through it
- Pause expires after 3 months (local + superchain pause = 6 months max pause)
  - identifier = local eth lockbox for local pause or 0x0 for global pause

almost all contracts have:
- paused() and guardian() now exposed
- additional initializer/upgrade check
- lots of interfaces added in the flat files

[OptimismPortal2](https://disco.l2beat.com/diff/eth:0xB443Da3e07052204A02d630a8933dAc05a0d6fB4/eth:0xEFEd7F38BB9BE74bBa583a1A5B7D0fe7C9D5787a)
- add `migrateLiquidity()` and `migrateToSuperRoots()`, callable by proxyAdminOwner
- `setRespectedGameType()` and `blacklistDisputeGame()` removed (moved to AnchorStateRegistry)
- ETH moved to the ETHLockbox
- superRoots (interop) support (e.g. for proving withdrawals)

ETHLockbox
- new contract
- holds ETH
- ETH can be unlocked by the optiportal, or withdrawn/migrated by the ProxyAdminOwner

[SystemConfig](https://disco.l2beat.com/diff/eth:0x340f923E5c7cbB2171146f64169EC9d5a9FfE647/eth:0xFaA660bf783CBAa55e1B7F3475C20Db74a53b9Fa)
- max gas limit 200M -> 500M

[L1Standardbridge](https://disco.l2beat.com/diff/eth:0x0b09ba359A106C9ea3b181CBc5F394570c7d2a7A/eth:0x44AfB7722AF276A601D524F429016A18B6923df0)
- no significant changes (still holds the ERC-20 tokens)

[L1CDM](https://disco.l2beat.com/diff/eth:0x5D5a095665886119693F0B41d8DFeE78da033e8B/eth:0xD26bB3aaAa4cB5638A8581A4c4b1d937D8E05c54)
- `hashSuperRootProof()`, `encodeSuperRootProof()` added, related to the future SuperFaultDisputeGame and interop

[DisputeGameFactory](https://disco.l2beat.com/diff/eth:0x4bbA758F006Ef09402eF31724203F316ab74e4a0/eth:0x33D1e8571a85a538ed3D5A4d88f46C112383439D)
- minimal changes

[AnchorStateRegistry](https://disco.l2beat.com/diff/eth:0x7b465370BB7A333f99edd19599EB7Fb1c2D3F8D2/eth:0xeb69cC681E8D4a557b30DFFBAd85aFfD47a2CF2E)
- `setRespectedGameType()` and `blacklistDisputeGame()` added, can be called by guardian (not DeputyPauser)

[FaultDisputeGame](https://disco.l2beat.com/diff/eth:0x89D68b1D63AAA0db4af1163e81f56B76934292F8/eth:0xd73Dd0F5665055B03eA0bFcac49bd4d26F1FFA4F)
- minimal changes

[PermissionedDisputegame](https://disco.l2beat.com/diff/eth:0xa1E0baCde89d899B3f24eEF3D179cC335A24E777/eth:0xEcca4BFbD017002abf25Aeebf2B21b903A5fC124)
- minimal changes

[DelayedWETH](https://disco.l2beat.com/diff/eth:0x5e40B9231B86984b5150507046e354dbFbeD3d9e/eth:0x33Dadc2d1aA9BB613A7AE6B28425eA00D44c6998)
- ownable removed
- `hold()` (recover) now requires msg.sender == proxyadminowner

[MIPS64](https://disco.l2beat.com/diff/eth:0xF027F4A985560fb13324e943edf55ad6F1d15Dc1/eth:0xA1B54D89e305bcd322Ba0C9C094093173C0d6b3a)
- explanations about the diff are in the forum post

[L1ERC721Bridge](https://disco.l2beat.com/diff/eth:0x7aE1d3BD877a4C5CA257404ce26BE93A02C98013/eth:0x25d6CeDEB277Ad7ebEe71226eD7877768E0B7A2F)
- minimal changes

## Watched changes

```diff
    contract Optimism Guardian Multisig (0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2) {
    +++ description: None
      values.GnosisSafe_modules.0:
-        "eth:0xc6901F65369FC59fC1B4D6D6bE7A2318Ff38dB5B"
+        "eth:0x76fC2F971FB355D0453cF9F64d3F9E4f640E1754"
    }
```

```diff
-   Status: DELETED
    contract DeputyPauseModule (0x126a736B18E0a64fBA19D421647A530E327E112C)
    +++ description: Allows eth:0x352f1defB49718e7Ea411687E850aA8d6299F7aC, called the deputy pauser, to act on behalf of the eth:0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A if set as its Safe module.
```

```diff
-   Status: DELETED
    contract AnchorStateRegistry (0x1c68ECfbf9C8B1E6C0677965b3B9Ecf9A104305b)
    +++ description: Contains the latest confirmed state root that can be used as a starting point in a dispute game.
```

```diff
-   Status: DELETED
    contract DelayedWETH_PermissionedGames (0x21429aF66058BC3e4aE4a8f2EC4531AaC433ecbC)
    +++ description: Contract designed to hold the bonded ETH for each game. It is designed as a wrapper around WETH to allow an owner to function as a backstop if a game would incorrectly distribute funds.
```

```diff
    contract SystemConfig (0x229047fed2591dbec1eF1118d64F7aF3dB9EB290) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      template:
-        "opstack/SystemConfig"
+        "opstack/SystemConfig_pauseId"
      sourceHashes.1:
-        "0x921de6fc906d159fdcef862d2b9559063f5e7b9b7588fa5f33153360ddf296e7"
+        "0xbca9388c120780391489984ba6cb1ec20bc4b0cf9644579f960e0b3aee1282b5"
      values.$implementation:
-        "eth:0x340f923E5c7cbB2171146f64169EC9d5a9FfE647"
+        "eth:0xFaA660bf783CBAa55e1B7F3475C20Db74a53b9Fa"
      values.$pastUpgrades.11:
+        ["2025-07-24T17:47:23.000Z","0x46acdce174c8d83ebe2f208d8c76c867e75617483d64c3e407f69ae2f9868716",["eth:0xFaA660bf783CBAa55e1B7F3475C20Db74a53b9Fa"]]
      values.$upgradeCount:
-        11
+        12
      values.DISPUTE_GAME_FACTORY_SLOT:
-        "0x52322a25d9f59ea17656545543306b7aef62bc0cc53a0e65ccfa0c75b97aa906"
      values.getAddresses.disputeGameFactory:
-        "eth:0xe5965Ab5962eDc7477C8520243A95517CD252fA9"
      values.maximumGasLimit:
-        200000000
+        500000000
      values.version:
-        "2.5.0"
+        "3.4.0"
      values.guardian:
+        "eth:0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2"
      values.initVersion:
+        2
      values.l2ChainId:
+        10
+++ description: `superchainConfig.paused(address(lockbox)) || superchainConfig.paused(address(0))`
+++ severity: HIGH
      values.paused:
+        false
      values.proxyAdmin:
+        "eth:0x543bA4AADBAb8f9025686Bd03993043599c6fB04"
      values.proxyAdminOwner:
+        "eth:0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A"
      values.superchainConfig:
+        "eth:0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
      fieldMeta.paused:
+        {"severity":"HIGH","description":"`superchainConfig.paused(address(lockbox)) || superchainConfig.paused(address(0))`"}
      implementationNames.eth:0x340f923E5c7cbB2171146f64169EC9d5a9FfE647:
-        "SystemConfig"
      implementationNames.eth:0xFaA660bf783CBAa55e1B7F3475C20Db74a53b9Fa:
+        "SystemConfig"
    }
```

```diff
    contract L1CrossDomainMessenger (0x25ace71c97B33Cc4729CF772ae268934F7ab5fA1) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      sourceHashes.1:
-        "0x03bcdc719cb7bd0a1377c01bb50b30a6122b308f673b7d7b15a3bb8628e6bd8c"
+        "0x21cd6c80343ba49cbb9f3e96c5f4ca0bc77bc617825495fbaad1026ed9a42026"
      values.$implementation:
-        "eth:0x5D5a095665886119693F0B41d8DFeE78da033e8B"
+        "eth:0xD26bB3aaAa4cB5638A8581A4c4b1d937D8E05c54"
      values.$pastUpgrades.12:
+        ["2025-07-24T17:47:23.000Z","0x46acdce174c8d83ebe2f208d8c76c867e75617483d64c3e407f69ae2f9868716",["eth:0xD26bB3aaAa4cB5638A8581A4c4b1d937D8E05c54"]]
      values.$upgradeCount:
-        12
+        13
      values.version:
-        "2.6.0"
+        "2.9.0"
      values.initVersion:
+        2
      values.proxyAdmin:
+        "eth:0x543bA4AADBAb8f9025686Bd03993043599c6fB04"
      values.proxyAdminOwner:
+        "eth:0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A"
      values.systemConfig:
+        "eth:0x229047fed2591dbec1eF1118d64F7aF3dB9EB290"
      implementationNames.eth:0x5D5a095665886119693F0B41d8DFeE78da033e8B:
-        "L1CrossDomainMessenger"
      implementationNames.eth:0xD26bB3aaAa4cB5638A8581A4c4b1d937D8E05c54:
+        "L1CrossDomainMessenger"
    }
```

```diff
-   Status: DELETED
    contract DelayedWETH_PermissionlessGames (0x323dFC63c9B83CB83f40325AaB74b245937cbdF0)
    +++ description: Contract designed to hold the bonded ETH for each game. It is designed as a wrapper around WETH to allow an owner to function as a backstop if a game would incorrectly distribute funds.
```

```diff
    EOA Optimism EOA 1 (0x352f1defB49718e7Ea411687E850aA8d6299F7aC) {
    +++ description: None
      receivedPermissions.0.via.3.address:
-        "eth:0x126a736B18E0a64fBA19D421647A530E327E112C"
+        "eth:0x76fC2F971FB355D0453cF9F64d3F9E4f640E1754"
      receivedPermissions.0.via.2:
-        {"address":"eth:0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A"}
      receivedPermissions.0.via.1:
-        {"address":"eth:0xc6901F65369FC59fC1B4D6D6bE7A2318Ff38dB5B","condition":"if not revoked by the Security Council"}
      directlyReceivedPermissions.0.from:
-        "eth:0x126a736B18E0a64fBA19D421647A530E327E112C"
+        "eth:0x76fC2F971FB355D0453cF9F64d3F9E4f640E1754"
    }
```

```diff
    contract SuperchainProxyAdmin (0x543bA4AADBAb8f9025686Bd03993043599c6fB04) {
    +++ description: None
      directlyReceivedPermissions.1:
-        {"permission":"upgrade","from":"eth:0x1c68ECfbf9C8B1E6C0677965b3B9Ecf9A104305b","role":"admin"}
      directlyReceivedPermissions.2:
-        {"permission":"upgrade","from":"eth:0x21429aF66058BC3e4aE4a8f2EC4531AaC433ecbC","role":"admin"}
      directlyReceivedPermissions.2:
+        {"permission":"upgrade","from":"eth:0x23B2C62946350F4246f9f9D027e071f0264FD113","role":"admin"}
      directlyReceivedPermissions.5.from:
-        "eth:0x323dFC63c9B83CB83f40325AaB74b245937cbdF0"
+        "eth:0x322b47Ff1FA8D5611F761e3E275C45B71b294D43"
      directlyReceivedPermissions.10:
+        {"permission":"upgrade","from":"eth:0xc5f54F934075677FBA99b5E43468439cbdE88ca7","role":"admin"}
      directlyReceivedPermissions.11:
+        {"permission":"upgrade","from":"eth:0xe214879aD573693A4C49f7654449Caa455cdE34f","role":"admin"}
    }
```

```diff
    contract SuperchainProxyAdminOwner (0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A) {
    +++ description: None
      receivedPermissions.0:
-        {"permission":"interact","from":"eth:0x21429aF66058BC3e4aE4a8f2EC4531AaC433ecbC","description":"can pull funds from the contract in case of emergency.","role":".owner"}
      receivedPermissions.1:
-        {"permission":"interact","from":"eth:0x323dFC63c9B83CB83f40325AaB74b245937cbdF0","description":"can pull funds from the contract in case of emergency.","role":".owner"}
      receivedPermissions.3:
-        {"permission":"upgrade","from":"eth:0x1c68ECfbf9C8B1E6C0677965b3B9Ecf9A104305b","role":"admin","via":[{"address":"eth:0x543bA4AADBAb8f9025686Bd03993043599c6fB04"}]}
      receivedPermissions.4:
-        {"permission":"upgrade","from":"eth:0x21429aF66058BC3e4aE4a8f2EC4531AaC433ecbC","role":"admin","via":[{"address":"eth:0x543bA4AADBAb8f9025686Bd03993043599c6fB04"}]}
      receivedPermissions.2:
+        {"permission":"upgrade","from":"eth:0x23B2C62946350F4246f9f9D027e071f0264FD113","role":"admin","via":[{"address":"eth:0x543bA4AADBAb8f9025686Bd03993043599c6fB04"}]}
      receivedPermissions.7.from:
-        "eth:0x323dFC63c9B83CB83f40325AaB74b245937cbdF0"
+        "eth:0x322b47Ff1FA8D5611F761e3E275C45B71b294D43"
      receivedPermissions.10:
+        {"permission":"upgrade","from":"eth:0xc5f54F934075677FBA99b5E43468439cbdE88ca7","role":"admin","via":[{"address":"eth:0x543bA4AADBAb8f9025686Bd03993043599c6fB04"}]}
      receivedPermissions.11:
+        {"permission":"upgrade","from":"eth:0xe214879aD573693A4C49f7654449Caa455cdE34f","role":"admin","via":[{"address":"eth:0x543bA4AADBAb8f9025686Bd03993043599c6fB04"}]}
    }
```

```diff
    contract L1ERC721Bridge (0x5a7749f83b81B301cAb5f48EB8516B986DAef23D) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      sourceHashes.1:
-        "0x28669b49da3effd51f0f9424ca9cdd455c5b9327c09a40c65fc06f114a6eb837"
+        "0x8ec2646e7ca57c49fef7769f200a751b7199526d590c9c43e6c7b134f43de630"
      values.$implementation:
-        "eth:0x7aE1d3BD877a4C5CA257404ce26BE93A02C98013"
+        "eth:0x25d6CeDEB277Ad7ebEe71226eD7877768E0B7A2F"
      values.$pastUpgrades.8:
+        ["2025-07-24T17:47:23.000Z","0x46acdce174c8d83ebe2f208d8c76c867e75617483d64c3e407f69ae2f9868716",["eth:0x25d6CeDEB277Ad7ebEe71226eD7877768E0B7A2F"]]
      values.$upgradeCount:
-        8
+        9
      values.version:
-        "2.4.0"
+        "2.7.0"
      values.initVersion:
+        2
      values.proxyAdmin:
+        "eth:0x543bA4AADBAb8f9025686Bd03993043599c6fB04"
      values.proxyAdminOwner:
+        "eth:0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A"
      values.systemConfig:
+        "eth:0x229047fed2591dbec1eF1118d64F7aF3dB9EB290"
      implementationNames.eth:0x7aE1d3BD877a4C5CA257404ce26BE93A02C98013:
-        "L1ERC721Bridge"
      implementationNames.eth:0x25d6CeDEB277Ad7ebEe71226eD7877768E0B7A2F:
+        "L1ERC721Bridge"
    }
```

```diff
-   Status: DELETED
    contract FaultDisputeGame (0x89D68b1D63AAA0db4af1163e81f56B76934292F8)
    +++ description: Logic of the dispute game. When a state root is proposed, a dispute game contract is deployed. Challengers can use such contracts to challenge the proposed state root.
```

```diff
    contract SuperchainConfig (0x95703e0982140D16f8ebA6d158FccEde42f04a4C) {
    +++ description: Used to manage global configuration values for multiple OP Chains within a single Superchain network. The SuperchainConfig contract manages individual pause states for each chain connected to it, as well as a global pause state for all chains. The guardian role can pause either separately, but each pause expires after 3 months if left untouched.
      template:
-        "opstack/SuperchainConfig"
+        "opstack/SuperchainConfig_expiry"
      sourceHashes.1:
-        "0x03dba37173051b02bc81487e181c791bcf1aef664c249e5d035f11f488bdd686"
+        "0x5a0e73c7d129cc83e1c387b55df0141890c02d2cb4111b8a1b6376d737d88f6b"
      description:
-        "Used to manage global configuration values for multiple OP Chains within a single Superchain network. The SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the Superchain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system."
+        "Used to manage global configuration values for multiple OP Chains within a single Superchain network. The SuperchainConfig contract manages individual pause states for each chain connected to it, as well as a global pause state for all chains. The guardian role can pause either separately, but each pause expires after 3 months if left untouched."
      values.$implementation:
-        "eth:0x4da82a327773965b8d4D85Fa3dB8249b387458E7"
+        "eth:0xCe28685EB204186b557133766eCA00334EB441E4"
      values.$pastUpgrades.4:
+        ["2025-07-24T17:47:23.000Z","0x46acdce174c8d83ebe2f208d8c76c867e75617483d64c3e407f69ae2f9868716",["eth:0xCe28685EB204186b557133766eCA00334EB441E4"]]
      values.$upgradeCount:
-        4
+        5
      values.GUARDIAN_SLOT:
-        "0xd30e835d3f35624761057ff5b27d558f97bd5be034621e62240e5c0b784abe68"
      values.PAUSED_SLOT:
-        "0x54176ff9944c4784e5857ec4e5ef560a462c483bf534eda43f91bb01a470b1b6"
      values.version:
-        "1.2.0"
+        "2.3.0"
      values.initVersion:
+        2
      values.pauseExpiry:
+        7884000
      values.pauseExpiryFmt:
+        "91d 6h"
      values.proxyAdmin:
+        "eth:0x543bA4AADBAb8f9025686Bd03993043599c6fB04"
      values.proxyAdminOwner:
+        "eth:0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A"
      implementationNames.eth:0x4da82a327773965b8d4D85Fa3dB8249b387458E7:
-        "SuperchainConfig"
      implementationNames.eth:0xCe28685EB204186b557133766eCA00334EB441E4:
+        "SuperchainConfig"
      fieldMeta:
+        {"paused":{"severity":"HIGH"}}
    }
```

```diff
    contract L1StandardBridge (0x99C9fc46f92E8a1c0deC1b1747d010903E884bE1) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      sourceHashes.1:
-        "0x4e15d99844dc5a4304c2396a66c95ec41218ea311c8e524b118fad7beed0bb53"
+        "0x7ca93e9b7ebe02b3a013eeb8b0db9c37bee9ffa1a9b47f52dc52b8d5594afcb5"
      values.$implementation:
-        "eth:0x0b09ba359A106C9ea3b181CBc5F394570c7d2a7A"
+        "eth:0x44AfB7722AF276A601D524F429016A18B6923df0"
      values.version:
-        "2.3.0"
+        "2.6.0"
      values.initVersion:
+        2
      values.proxyAdmin:
+        "eth:0x543bA4AADBAb8f9025686Bd03993043599c6fB04"
      values.proxyAdminOwner:
+        "eth:0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A"
      values.systemConfig:
+        "eth:0x229047fed2591dbec1eF1118d64F7aF3dB9EB290"
      implementationNames.eth:0x0b09ba359A106C9ea3b181CBc5F394570c7d2a7A:
-        "L1StandardBridge"
      implementationNames.eth:0x44AfB7722AF276A601D524F429016A18B6923df0:
+        "L1StandardBridge"
    }
```

```diff
    contract OpFoundationOperationsSafe (0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A) {
    +++ description: None
      values.getModules.0:
-        "eth:0x126a736B18E0a64fBA19D421647A530E327E112C"
      values.GnosisSafe_modules.0:
-        "eth:0x126a736B18E0a64fBA19D421647A530E327E112C"
      receivedPermissions:
-        [{"permission":"guard","from":"eth:0x95703e0982140D16f8ebA6d158FccEde42f04a4C","role":".guardian","via":[{"address":"eth:0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2"},{"address":"eth:0xc6901F65369FC59fC1B4D6D6bE7A2318Ff38dB5B","condition":"if not revoked by the Security Council"}]}]
      directlyReceivedPermissions:
-        [{"permission":"act","from":"eth:0xc6901F65369FC59fC1B4D6D6bE7A2318Ff38dB5B","role":".deputyGuardian","condition":"if not revoked by the Security Council"}]
    }
```

```diff
-   Status: DELETED
    contract PermissionedDisputeGame (0xa1E0baCde89d899B3f24eEF3D179cC335A24E777)
    +++ description: Same as FaultDisputeGame, but only two permissioned addresses are designated as proposer and challenger.
```

```diff
    contract OptimismPortal2 (0xbEb5Fc579115071764c7423A4f12eDde41f106Ed) {
    +++ description: The OptimismPortal contract is the main entry point to deposit funds from L1 to L2. It also allows to prove and finalize withdrawals. The state root respected for withdrawals comnes from the FaultDisputeGame.
      template:
-        "opstack/OptimismPortal2"
+        "opstack/OptimismPortal2_post13"
      sourceHashes.1:
-        "0xc483ef9e0a5ec2a0450732e743b3784de0cd3876b8fadfce14c0805a0846d26b"
+        "0x025be6415d31a7c8f475bf94e05a8288787b4adb41562108a42d0574c9af9543"
      description:
-        "The OptimismPortal contract is the main entry point to deposit funds from L1 to L2. It also allows to prove and finalize withdrawals. It specifies which game type can be used for withdrawals, which currently is the FaultDisputeGame."
+        "The OptimismPortal contract is the main entry point to deposit funds from L1 to L2. It also allows to prove and finalize withdrawals. The state root respected for withdrawals comes from the FaultDisputeGame."
      values.$implementation:
-        "eth:0xB443Da3e07052204A02d630a8933dAc05a0d6fB4"
+        "eth:0xEFEd7F38BB9BE74bBa583a1A5B7D0fe7C9D5787a"
      values.$pastUpgrades.9:
+        ["2025-07-24T17:47:23.000Z","0x46acdce174c8d83ebe2f208d8c76c867e75617483d64c3e407f69ae2f9868716",["eth:0xEFEd7F38BB9BE74bBa583a1A5B7D0fe7C9D5787a"]]
      values.$upgradeCount:
-        9
+        10
      values.respectedGameTypeUpdatedAt:
-        1726070915
+        1753379243
      values.version:
-        "3.14.0"
+        "4.6.0"
      values.anchorStateRegistry:
+        "eth:0x23B2C62946350F4246f9f9D027e071f0264FD113"
      values.ethLockbox:
+        "eth:0x322b47Ff1FA8D5611F761e3E275C45B71b294D43"
      values.initVersion:
+        2
      values.proxyAdmin:
+        "eth:0x543bA4AADBAb8f9025686Bd03993043599c6fB04"
      values.proxyAdminOwner:
+        "eth:0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A"
      values.superRootsActive:
+        false
      implementationNames.eth:0xB443Da3e07052204A02d630a8933dAc05a0d6fB4:
-        "OptimismPortal2"
      implementationNames.eth:0xEFEd7F38BB9BE74bBa583a1A5B7D0fe7C9D5787a:
+        "OptimismPortal2"
    }
```

```diff
-   Status: DELETED
    contract DeputyGuardianModule (0xc6901F65369FC59fC1B4D6D6bE7A2318Ff38dB5B)
    +++ description: allows the eth:0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A, called the deputy guardian, to act on behalf of the Gnosis Safe.
```

```diff
    contract DisputeGameFactory (0xe5965Ab5962eDc7477C8520243A95517CD252fA9) {
    +++ description: The dispute game factory allows the creation of dispute games, used to propose state roots and eventually challenge them.
      sourceHashes.1:
-        "0x85ca17941ef36ac6b28a4f8f89803d0d41ef419c47586dcd3acdb47ee9617285"
+        "0x93342e3d1e616bd6c727a5f73b09c0811bdab764dc9ad7346278593fb66b3689"
      values.$implementation:
-        "eth:0x4bbA758F006Ef09402eF31724203F316ab74e4a0"
+        "eth:0x33D1e8571a85a538ed3D5A4d88f46C112383439D"
      values.$pastUpgrades.2:
+        ["2025-07-24T17:47:23.000Z","0x46acdce174c8d83ebe2f208d8c76c867e75617483d64c3e407f69ae2f9868716",["eth:0x33D1e8571a85a538ed3D5A4d88f46C112383439D"]]
      values.$upgradeCount:
-        2
+        3
+++ severity: HIGH
      values.gameImpls.0:
-        "eth:0x89D68b1D63AAA0db4af1163e81f56B76934292F8"
+        "eth:0xd73Dd0F5665055B03eA0bFcac49bd4d26F1FFA4F"
+++ severity: HIGH
      values.gameImpls.1:
-        "eth:0xa1E0baCde89d899B3f24eEF3D179cC335A24E777"
+        "eth:0xEcca4BFbD017002abf25Aeebf2B21b903A5fC124"
      values.version:
-        "1.0.1"
+        "1.2.0"
      values.initVersion:
+        1
      values.proxyAdmin:
+        "eth:0x543bA4AADBAb8f9025686Bd03993043599c6fB04"
      values.proxyAdminOwner:
+        "eth:0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A"
      implementationNames.eth:0x4bbA758F006Ef09402eF31724203F316ab74e4a0:
-        "DisputeGameFactory"
      implementationNames.eth:0x33D1e8571a85a538ed3D5A4d88f46C112383439D:
+        "DisputeGameFactory"
    }
```

```diff
-   Status: DELETED
    contract MIPS (0xF027F4A985560fb13324e943edf55ad6F1d15Dc1)
    +++ description: The MIPS contract is used to execute the final step of the dispute game which objectively determines the winner of the dispute.
```

```diff
+   Status: CREATED
    contract AnchorStateRegistry (0x23B2C62946350F4246f9f9D027e071f0264FD113)
    +++ description: Contains the latest confirmed state root that can be used as a starting point in a dispute game. It specifies which game type can be used for withdrawals, which currently is the FaultDisputeGame.
```

```diff
+   Status: CREATED
    contract ETHLockbox (0x322b47Ff1FA8D5611F761e3E275C45B71b294D43)
    +++ description: A simple escrow contract storing ETH for the canonical bridge.
```

```diff
+   Status: CREATED
    contract DeputyPauseModule (0x76fC2F971FB355D0453cF9F64d3F9E4f640E1754)
    +++ description: Allows eth:0x352f1defB49718e7Ea411687E850aA8d6299F7aC, called the deputy pauser, to act on behalf of the eth:0x847B5c174615B1B7fDF770882256e2D3E95b9D92 if set as its Safe module.
```

```diff
+   Status: CREATED
    contract MIPS (0xA1B54D89e305bcd322Ba0C9C094093173C0d6b3a)
    +++ description: The MIPS contract is used to execute the final step of the dispute game which objectively determines the winner of the dispute.
```

```diff
+   Status: CREATED
    contract DelayedWETH (0xc5f54F934075677FBA99b5E43468439cbdE88ca7)
    +++ description: Contract designed to hold the bonded ETH for each game. It is designed as a wrapper around WETH to allow an owner to function as a backstop if a game would incorrectly distribute funds.
```

```diff
+   Status: CREATED
    contract FaultDisputeGame (0xd73Dd0F5665055B03eA0bFcac49bd4d26F1FFA4F)
    +++ description: Logic of the dispute game. When a state root is proposed, a dispute game contract is deployed. Challengers can use such contracts to challenge the proposed state root.
```

```diff
+   Status: CREATED
    contract DelayedWETH (0xe214879aD573693A4C49f7654449Caa455cdE34f)
    +++ description: Contract designed to hold the bonded ETH for each game. It is designed as a wrapper around WETH to allow an owner to function as a backstop if a game would incorrectly distribute funds.
```

```diff
+   Status: CREATED
    contract PermissionedDisputeGame (0xEcca4BFbD017002abf25Aeebf2B21b903A5fC124)
    +++ description: Same as FaultDisputeGame, but only two permissioned addresses are designated as proposer and challenger.
```

## Source code changes

```diff
.../AnchorStateRegistry/AnchorStateRegistry.sol    |  418 +++++++-
 .../DelayedWETH.sol                                |  406 +++++--
 .../Proxy.p.sol                                    |    0
 .../DelayedWETH.sol                                |  406 +++++--
 .../Proxy.p.sol                                    |    0
 .../DeputyGuardianModule.sol => /dev/null          |  156 ---
 .../DeputyPauseModule.sol                          |   87 +-
 .../DisputeGameFactory/DisputeGameFactory.sol      |  254 ++++-
 .../ethereum/.flat/ETHLockbox/ETHLockbox.sol       |  757 +++++++++++++
 .../optimism/ethereum/.flat/ETHLockbox/Proxy.p.sol |  200 ++++
 .../{.flat@22567749 => .flat}/FaultDisputeGame.sol |  106 +-
 .../L1CrossDomainMessenger.sol                     |  348 +++++-
 .../L1ERC721Bridge/L1ERC721Bridge.sol              |  298 +++++-
 .../L1StandardBridge/L1StandardBridge.sol          |  298 +++++-
 .../ethereum/{.flat@22567749 => .flat}/MIPS.sol    |  583 +++++-----
 .../OptimismPortal2/OptimismPortal2.sol            | 1111 +++++++++++++-------
 .../PermissionedDisputeGame.sol                    |  110 +-
 .../SuperchainConfig/SuperchainConfig.sol          |  487 ++++++---
 .../SystemConfig/SystemConfig.sol                  |  398 +++++--
 19 files changed, 4962 insertions(+), 1461 deletions(-)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22567749 (main branch discovery), not current.

```diff
    contract LivenessGuard (0x24424336F04440b1c28685a38303aC33C9D14a25) {
    +++ description: Modular contract to be used together with the LivenessModule. Tracks liveness / activity of Safe owners.
      template:
+        "gnosisSafeModules/LivenessGuard"
    }
```

```diff
    EOA Optimism EOA 1 (0x352f1defB49718e7Ea411687E850aA8d6299F7aC) {
    +++ description: None
      receivedPermissions.0.via.3.condition:
-        "though restricted to the global pause function"
+        "though restricted to the SuperchainConfig's `pause()` function"
      directlyReceivedPermissions.0.condition:
-        "though restricted to the global pause function"
+        "though restricted to the SuperchainConfig's `pause()` function"
    }
```

Generated with discovered.json: 0x3789dfc5375fcf17326d8c64858d8b54eeaccf16

# Diff at Thu, 24 Jul 2025 16:48:26 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@a3f740c0fd51a5745c45d8f349ab01f4f33f7770 block: 22567749
- current block number: 22567749

## Description

set dispute game impl changes to high severity.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22567749 (main branch discovery), not current.

```diff
    contract OptimismPortal2 (0xbEb5Fc579115071764c7423A4f12eDde41f106Ed) {
    +++ description: The OptimismPortal contract is the main entry point to deposit funds from L1 to L2. It also allows to prove and finalize withdrawals. It specifies which game type can be used for withdrawals, which currently is the FaultDisputeGame.
      fieldMeta.respectedGameType:
+        {"severity":"HIGH"}
    }
```

```diff
    contract DisputeGameFactory (0xe5965Ab5962eDc7477C8520243A95517CD252fA9) {
    +++ description: The dispute game factory allows the creation of dispute games, used to propose state roots and eventually challenge them.
      fieldMeta:
+        {"gameImpls":{"severity":"HIGH"},"game1337":{"severity":"HIGH"}}
    }
```

Generated with discovered.json: 0xacd04eb2dc80b00a09f219689691d71f949272b1

# Diff at Tue, 22 Jul 2025 14:15:53 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@d5d65d1883c757ae790bbd0a6f785c98310d2516 block: 22567749
- current block number: 22567749

## Description

Config: Kailua added to OptimismPortal2 and DisputeGameFactory.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22567749 (main branch discovery), not current.

```diff
    contract OptimismPortal2 (0xbEb5Fc579115071764c7423A4f12eDde41f106Ed) {
    +++ description: The OptimismPortal contract is the main entry point to deposit funds from L1 to L2. It also allows to prove and finalize withdrawals. It specifies which game type can be used for withdrawals, which currently is the FaultDisputeGame.
      usedTypes.0.arg.1337:
+        "KailuaGame"
    }
```

```diff
    contract DisputeGameFactory (0xe5965Ab5962eDc7477C8520243A95517CD252fA9) {
    +++ description: The dispute game factory allows the creation of dispute games, used to propose state roots and eventually challenge them.
      values.game1337:
+        "eth:0x0000000000000000000000000000000000000000"
    }
```

Generated with discovered.json: 0xc6b3bead15bf20de9587b76a3ceddbc947547979

# Diff at Mon, 14 Jul 2025 12:47:06 GMT:

- chain: optimism
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@9f4300dad2f3d080cd56fa311d4a848556c74e72 block: 135717996
- current block number: 135717996

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 135717996 (main branch discovery), not current.

```diff
    EOA  (0x25ace71c97B33Cc4729CF772ae268934F7ab5fA1) {
    +++ description: None
      address:
-        "0x25ace71c97B33Cc4729CF772ae268934F7ab5fA1"
+        "oeth:0x25ace71c97B33Cc4729CF772ae268934F7ab5fA1"
    }
```

```diff
    contract MintManagerOwner (0x2A82Ae142b2e62Cb7D10b55E323ACB1Cab663a26) {
    +++ description: None
      address:
-        "0x2A82Ae142b2e62Cb7D10b55E323ACB1Cab663a26"
+        "oeth:0x2A82Ae142b2e62Cb7D10b55E323ACB1Cab663a26"
      values.$implementation:
-        "0xfb1bffC9d739B8D520DaF37dF666da4C687191EA"
+        "oeth:0xfb1bffC9d739B8D520DaF37dF666da4C687191EA"
      values.$members.0:
-        "0x3041BA32f451F5850c147805F5521AC206421623"
+        "oeth:0x3041BA32f451F5850c147805F5521AC206421623"
      values.$members.1:
-        "0x7cB07FE039a92B3D784f284D919503A381BEC54f"
+        "oeth:0x7cB07FE039a92B3D784f284D919503A381BEC54f"
      values.$members.2:
-        "0xdb203D7f00fF435dA107543B33495f9cA2c484C6"
+        "oeth:0xdb203D7f00fF435dA107543B33495f9cA2c484C6"
      values.$members.3:
-        "0x4D014f3c5F33Aa9Cd1Dc29ce29618d07Ae666d15"
+        "oeth:0x4D014f3c5F33Aa9Cd1Dc29ce29618d07Ae666d15"
      values.$members.4:
-        "0xA902A27a7631D502E3Ec17fc5d4c3e0861752c94"
+        "oeth:0xA902A27a7631D502E3Ec17fc5d4c3e0861752c94"
      implementationNames.0x2A82Ae142b2e62Cb7D10b55E323ACB1Cab663a26:
-        "GnosisSafeProxy"
      implementationNames.0xfb1bffC9d739B8D520DaF37dF666da4C687191EA:
-        "GnosisSafeL2"
      implementationNames.oeth:0x2A82Ae142b2e62Cb7D10b55E323ACB1Cab663a26:
+        "GnosisSafeProxy"
      implementationNames.oeth:0xfb1bffC9d739B8D520DaF37dF666da4C687191EA:
+        "GnosisSafeL2"
    }
```

```diff
    EOA  (0x3041BA32f451F5850c147805F5521AC206421623) {
    +++ description: None
      address:
-        "0x3041BA32f451F5850c147805F5521AC206421623"
+        "oeth:0x3041BA32f451F5850c147805F5521AC206421623"
    }
```

```diff
    contract DeployerWhitelist (0x4200000000000000000000000000000000000002) {
    +++ description: Legacy contract that was originally used to act as a whitelist of addresses allowed to the Optimism network. Fully unused and deprecated since the Bedrock upgrade.
      address:
-        "0x4200000000000000000000000000000000000002"
+        "oeth:0x4200000000000000000000000000000000000002"
      values.$admin:
-        "0x4200000000000000000000000000000000000018"
+        "oeth:0x4200000000000000000000000000000000000018"
      values.$implementation:
-        "0xc0d3c0d3C0d3c0D3c0d3C0D3c0d3C0d3c0D30002"
+        "oeth:0xc0d3c0d3C0d3c0D3c0d3C0D3c0d3C0d3c0D30002"
      values.owner:
-        "0x0000000000000000000000000000000000000000"
+        "oeth:0x0000000000000000000000000000000000000000"
      implementationNames.0x4200000000000000000000000000000000000002:
-        "Proxy"
      implementationNames.0xc0d3c0d3C0d3c0D3c0d3C0D3c0d3C0d3c0D30002:
-        "DeployerWhitelist"
      implementationNames.oeth:0x4200000000000000000000000000000000000002:
+        "Proxy"
      implementationNames.oeth:0xc0d3c0d3C0d3c0D3c0d3C0D3c0d3C0d3c0D30002:
+        "DeployerWhitelist"
    }
```

```diff
    contract L2CrossDomainMessenger (0x4200000000000000000000000000000000000007) {
    +++ description: The L2CrossDomainMessenger (L2xDM) contract sends messages from L2 to L1, and relays messages from L1 onto L2 with a system tx. In the event that a message sent from L2 to L1 is rejected for exceeding the L1 gas limit, it can be resubmitted via this contract’s replay function.
      address:
-        "0x4200000000000000000000000000000000000007"
+        "oeth:0x4200000000000000000000000000000000000007"
      values.$admin:
-        "0x4200000000000000000000000000000000000018"
+        "oeth:0x4200000000000000000000000000000000000018"
      values.$implementation:
-        "0xC0d3c0d3c0D3c0D3C0d3C0D3C0D3c0d3c0d30007"
+        "oeth:0xC0d3c0d3c0D3c0D3C0d3C0D3C0D3c0d3c0d30007"
      values.l1CrossDomainMessenger:
-        "0x25ace71c97B33Cc4729CF772ae268934F7ab5fA1"
+        "oeth:0x25ace71c97B33Cc4729CF772ae268934F7ab5fA1"
      values.OTHER_MESSENGER:
-        "0x25ace71c97B33Cc4729CF772ae268934F7ab5fA1"
+        "oeth:0x25ace71c97B33Cc4729CF772ae268934F7ab5fA1"
      implementationNames.0x4200000000000000000000000000000000000007:
-        "Proxy"
      implementationNames.0xC0d3c0d3c0D3c0D3C0d3C0D3C0D3c0d3c0d30007:
-        "L2CrossDomainMessenger"
      implementationNames.oeth:0x4200000000000000000000000000000000000007:
+        "Proxy"
      implementationNames.oeth:0xC0d3c0d3c0D3c0D3C0d3C0D3C0D3c0d3c0d30007:
+        "L2CrossDomainMessenger"
    }
```

```diff
    contract GasPriceOracle (0x420000000000000000000000000000000000000F) {
    +++ description: Provides the current gas price for L2 transactions.
      address:
-        "0x420000000000000000000000000000000000000F"
+        "oeth:0x420000000000000000000000000000000000000F"
      values.$admin:
-        "0x4200000000000000000000000000000000000018"
+        "oeth:0x4200000000000000000000000000000000000018"
      values.$implementation:
-        "0x93e57A196454CB919193fa9946f14943cf733845"
+        "oeth:0x93e57A196454CB919193fa9946f14943cf733845"
      values.$pastUpgrades.0.2.0:
-        "0xb528D11cC114E026F138fE568744c6D45ce6Da7A"
+        "oeth:0xb528D11cC114E026F138fE568744c6D45ce6Da7A"
      values.$pastUpgrades.1.2.0:
-        "0xa919894851548179A0750865e7974DA599C0Fac7"
+        "oeth:0xa919894851548179A0750865e7974DA599C0Fac7"
      values.$pastUpgrades.2.2.0:
-        "0x93e57A196454CB919193fa9946f14943cf733845"
+        "oeth:0x93e57A196454CB919193fa9946f14943cf733845"
      implementationNames.0x420000000000000000000000000000000000000F:
-        "Proxy"
      implementationNames.0x93e57A196454CB919193fa9946f14943cf733845:
-        "GasPriceOracle"
      implementationNames.oeth:0x420000000000000000000000000000000000000F:
+        "Proxy"
      implementationNames.oeth:0x93e57A196454CB919193fa9946f14943cf733845:
+        "GasPriceOracle"
    }
```

```diff
    contract L2StandardBridge (0x4200000000000000000000000000000000000010) {
    +++ description: The L2StandardBridge contract is the main entry point to deposit or withdraw ERC20 tokens from L2 to L1. This contract can store any token.
      address:
-        "0x4200000000000000000000000000000000000010"
+        "oeth:0x4200000000000000000000000000000000000010"
      values.$admin:
-        "0x4200000000000000000000000000000000000018"
+        "oeth:0x4200000000000000000000000000000000000018"
      values.$implementation:
-        "0xC0d3c0d3c0D3c0d3C0D3c0D3C0d3C0D3C0D30010"
+        "oeth:0xC0d3c0d3c0D3c0d3C0D3c0D3C0d3C0D3C0D30010"
      values.l1TokenBridge:
-        "0x99C9fc46f92E8a1c0deC1b1747d010903E884bE1"
+        "oeth:0x99C9fc46f92E8a1c0deC1b1747d010903E884bE1"
      values.messenger:
-        "0x4200000000000000000000000000000000000007"
+        "oeth:0x4200000000000000000000000000000000000007"
      values.MESSENGER:
-        "0x4200000000000000000000000000000000000007"
+        "oeth:0x4200000000000000000000000000000000000007"
      values.OTHER_BRIDGE:
-        "0x99C9fc46f92E8a1c0deC1b1747d010903E884bE1"
+        "oeth:0x99C9fc46f92E8a1c0deC1b1747d010903E884bE1"
      implementationNames.0x4200000000000000000000000000000000000010:
-        "Proxy"
      implementationNames.0xC0d3c0d3c0D3c0d3C0D3c0D3C0d3C0D3C0D30010:
-        "L2StandardBridge"
      implementationNames.oeth:0x4200000000000000000000000000000000000010:
+        "Proxy"
      implementationNames.oeth:0xC0d3c0d3c0D3c0d3C0D3c0D3C0d3C0D3C0D30010:
+        "L2StandardBridge"
    }
```

```diff
    contract SequencerFeeVault (0x4200000000000000000000000000000000000011) {
    +++ description: Collects the sequencer fees, which are withdrawable to the FeesCollector on L1.
      address:
-        "0x4200000000000000000000000000000000000011"
+        "oeth:0x4200000000000000000000000000000000000011"
      values.$admin:
-        "0x4200000000000000000000000000000000000018"
+        "oeth:0x4200000000000000000000000000000000000018"
      values.$implementation:
-        "0xC0D3C0d3c0d3c0d3C0D3c0d3C0D3c0d3c0D30011"
+        "oeth:0xC0D3C0d3c0d3c0d3C0D3c0d3C0D3c0d3c0D30011"
      values.l1FeeWallet:
-        "0xa3d596EAfaB6B13Ab18D40FaE1A962700C84ADEa"
+        "oeth:0xa3d596EAfaB6B13Ab18D40FaE1A962700C84ADEa"
      values.RECIPIENT:
-        "0xa3d596EAfaB6B13Ab18D40FaE1A962700C84ADEa"
+        "oeth:0xa3d596EAfaB6B13Ab18D40FaE1A962700C84ADEa"
      implementationNames.0x4200000000000000000000000000000000000011:
-        "Proxy"
      implementationNames.0xC0D3C0d3c0d3c0d3C0D3c0d3C0D3c0d3c0D30011:
-        "SequencerFeeVault"
      implementationNames.oeth:0x4200000000000000000000000000000000000011:
+        "Proxy"
      implementationNames.oeth:0xC0D3C0d3c0d3c0d3C0D3c0d3C0D3c0d3c0D30011:
+        "SequencerFeeVault"
    }
```

```diff
    contract OptimismMintableERC20Factory (0x4200000000000000000000000000000000000012) {
    +++ description: Factory contract to create bridge compliant ERC20 IOU token representations of bridged L1 ERC20 tokens.
      address:
-        "0x4200000000000000000000000000000000000012"
+        "oeth:0x4200000000000000000000000000000000000012"
      values.$admin:
-        "0x4200000000000000000000000000000000000018"
+        "oeth:0x4200000000000000000000000000000000000018"
      values.$implementation:
-        "0xc0D3c0d3C0d3c0d3c0D3c0d3c0D3c0D3c0D30012"
+        "oeth:0xc0D3c0d3C0d3c0d3c0D3c0d3c0D3c0D3c0D30012"
      values.BRIDGE:
-        "0x4200000000000000000000000000000000000010"
+        "oeth:0x4200000000000000000000000000000000000010"
      implementationNames.0x4200000000000000000000000000000000000012:
-        "Proxy"
      implementationNames.0xc0D3c0d3C0d3c0d3c0D3c0d3c0D3c0D3c0D30012:
-        "OptimismMintableERC20Factory"
      implementationNames.oeth:0x4200000000000000000000000000000000000012:
+        "Proxy"
      implementationNames.oeth:0xc0D3c0d3C0d3c0d3c0D3c0d3c0D3c0D3c0D30012:
+        "OptimismMintableERC20Factory"
    }
```

```diff
    contract L1BlockNumber (0x4200000000000000000000000000000000000013) {
    +++ description: Simple contract that returns the latest L1 block number.
      address:
-        "0x4200000000000000000000000000000000000013"
+        "oeth:0x4200000000000000000000000000000000000013"
      values.$admin:
-        "0x4200000000000000000000000000000000000018"
+        "oeth:0x4200000000000000000000000000000000000018"
      values.$implementation:
-        "0xC0D3C0d3C0D3c0D3C0d3c0D3C0d3c0d3C0d30013"
+        "oeth:0xC0D3C0d3C0D3c0D3C0d3c0D3C0d3c0d3C0d30013"
      implementationNames.0x4200000000000000000000000000000000000013:
-        "Proxy"
      implementationNames.0xC0D3C0d3C0D3c0D3C0d3c0D3C0d3c0d3C0d30013:
-        "L1BlockNumber"
      implementationNames.oeth:0x4200000000000000000000000000000000000013:
+        "Proxy"
      implementationNames.oeth:0xC0D3C0d3C0D3c0D3C0d3c0D3C0d3c0d3C0d30013:
+        "L1BlockNumber"
    }
```

```diff
    contract L2ERC721Bridge (0x4200000000000000000000000000000000000014) {
    +++ description: The L2ERC721Bridge contract is the main entry point to deposit or withdraw ERC721 tokens from L2 to L1. This contract can store any token.
      address:
-        "0x4200000000000000000000000000000000000014"
+        "oeth:0x4200000000000000000000000000000000000014"
      values.$admin:
-        "0x4200000000000000000000000000000000000018"
+        "oeth:0x4200000000000000000000000000000000000018"
      values.$implementation:
-        "0xC0D3c0d3c0d3c0d3c0D3C0d3C0D3C0D3c0d30014"
+        "oeth:0xC0D3c0d3c0d3c0d3c0D3C0d3C0D3C0D3c0d30014"
      values.$pastUpgrades.0.2.0:
-        "0x5a7749f83b81B301cAb5f48EB8516B986DAef23D"
+        "oeth:0x5a7749f83b81B301cAb5f48EB8516B986DAef23D"
      values.messenger:
-        "0x4200000000000000000000000000000000000007"
+        "oeth:0x4200000000000000000000000000000000000007"
      values.MESSENGER:
-        "0x4200000000000000000000000000000000000007"
+        "oeth:0x4200000000000000000000000000000000000007"
      values.OTHER_BRIDGE:
-        "0x5a7749f83b81B301cAb5f48EB8516B986DAef23D"
+        "oeth:0x5a7749f83b81B301cAb5f48EB8516B986DAef23D"
      values.otherBridge:
-        "0x5a7749f83b81B301cAb5f48EB8516B986DAef23D"
+        "oeth:0x5a7749f83b81B301cAb5f48EB8516B986DAef23D"
      implementationNames.0x4200000000000000000000000000000000000014:
-        "Proxy"
      implementationNames.0xC0D3c0d3c0d3c0d3c0D3C0d3C0D3C0D3c0d30014:
-        "L2ERC721Bridge"
      implementationNames.oeth:0x4200000000000000000000000000000000000014:
+        "Proxy"
      implementationNames.oeth:0xC0D3c0d3c0d3c0d3c0D3C0d3C0D3C0D3c0d30014:
+        "L2ERC721Bridge"
    }
```

```diff
    contract L1Block (0x4200000000000000000000000000000000000015) {
    +++ description: Simple contract that returns information about the latest L1 block, which is derived permissionlessly from the L1 chain.
      address:
-        "0x4200000000000000000000000000000000000015"
+        "oeth:0x4200000000000000000000000000000000000015"
      values.$admin:
-        "0x4200000000000000000000000000000000000018"
+        "oeth:0x4200000000000000000000000000000000000018"
      values.$implementation:
-        "0xFf256497D61dcd71a9e9Ff43967C13fdE1F72D12"
+        "oeth:0xFf256497D61dcd71a9e9Ff43967C13fdE1F72D12"
      values.$pastUpgrades.0.2.0:
-        "0x07dbe8500fc591d1852B76feE44d5a05e13097Ff"
+        "oeth:0x07dbe8500fc591d1852B76feE44d5a05e13097Ff"
      values.$pastUpgrades.1.2.0:
-        "0xFf256497D61dcd71a9e9Ff43967C13fdE1F72D12"
+        "oeth:0xFf256497D61dcd71a9e9Ff43967C13fdE1F72D12"
      values.DEPOSITOR_ACCOUNT:
-        "0xDeaDDEaDDeAdDeAdDEAdDEaddeAddEAdDEAd0001"
+        "oeth:0xDeaDDEaDDeAdDeAdDEAdDEaddeAddEAdDEAd0001"
      values.gasPayingToken.addr_:
-        "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE"
+        "oeth:0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE"
      implementationNames.0x4200000000000000000000000000000000000015:
-        "Proxy"
      implementationNames.0xFf256497D61dcd71a9e9Ff43967C13fdE1F72D12:
-        "L1Block"
      implementationNames.oeth:0x4200000000000000000000000000000000000015:
+        "Proxy"
      implementationNames.oeth:0xFf256497D61dcd71a9e9Ff43967C13fdE1F72D12:
+        "L1Block"
    }
```

```diff
    contract L2ToL1MessagePasser (0x4200000000000000000000000000000000000016) {
    +++ description: Contract used internally by the L2CrossDomainMessenger to send messages to L1, including withdrawals. It can also be used directly as a low-level interface.
      address:
-        "0x4200000000000000000000000000000000000016"
+        "oeth:0x4200000000000000000000000000000000000016"
      values.$admin:
-        "0x4200000000000000000000000000000000000018"
+        "oeth:0x4200000000000000000000000000000000000018"
      values.$implementation:
-        "0xC0D3C0d3C0d3c0d3C0d3C0D3c0D3c0d3c0D30016"
+        "oeth:0xC0D3C0d3C0d3c0d3C0d3C0D3c0D3c0d3c0D30016"
      implementationNames.0x4200000000000000000000000000000000000016:
-        "Proxy"
      implementationNames.0xC0D3C0d3C0d3c0d3C0d3C0D3c0D3c0d3c0D30016:
-        "L2ToL1MessagePasser"
      implementationNames.oeth:0x4200000000000000000000000000000000000016:
+        "Proxy"
      implementationNames.oeth:0xC0D3C0d3C0d3c0d3C0d3C0D3c0D3c0d3c0D30016:
+        "L2ToL1MessagePasser"
    }
```

```diff
    contract OptimismMintableERC721Factory (0x4200000000000000000000000000000000000017) {
    +++ description: Factory contract to create bridge compliant ERC721 IOU token representations of bridged L1 ERC721 tokens.
      address:
-        "0x4200000000000000000000000000000000000017"
+        "oeth:0x4200000000000000000000000000000000000017"
      values.$admin:
-        "0x4200000000000000000000000000000000000018"
+        "oeth:0x4200000000000000000000000000000000000018"
      values.$implementation:
-        "0xc0d3C0d3C0d3C0d3C0d3c0d3C0D3C0d3C0D30017"
+        "oeth:0xc0d3C0d3C0d3C0d3C0d3c0d3C0D3C0d3C0D30017"
      values.BRIDGE:
-        "0x4200000000000000000000000000000000000014"
+        "oeth:0x4200000000000000000000000000000000000014"
      implementationNames.0x4200000000000000000000000000000000000017:
-        "Proxy"
      implementationNames.0xc0d3C0d3C0d3C0d3C0d3c0d3C0D3C0d3C0D30017:
-        "OptimismMintableERC721Factory"
      implementationNames.oeth:0x4200000000000000000000000000000000000017:
+        "Proxy"
      implementationNames.oeth:0xc0d3C0d3C0d3C0d3C0d3c0d3C0D3C0d3C0D30017:
+        "OptimismMintableERC721Factory"
    }
```

```diff
    contract ProxyAdmin (0x4200000000000000000000000000000000000018) {
    +++ description: None
      address:
-        "0x4200000000000000000000000000000000000018"
+        "oeth:0x4200000000000000000000000000000000000018"
      values.$admin:
-        "0x4200000000000000000000000000000000000018"
+        "oeth:0x4200000000000000000000000000000000000018"
      values.$implementation:
-        "0xC0d3C0D3c0d3C0d3c0d3c0D3C0D3C0d3C0D30018"
+        "oeth:0xC0d3C0D3c0d3C0d3c0d3c0D3C0D3C0d3C0D30018"
      values.addressManager:
-        "0x0000000000000000000000000000000000000000"
+        "oeth:0x0000000000000000000000000000000000000000"
      values.owner:
-        "0x6B1BAE59D09fCcbdDB6C6cceb07B7279367C4E3b"
+        "oeth:0x6B1BAE59D09fCcbdDB6C6cceb07B7279367C4E3b"
      implementationNames.0x4200000000000000000000000000000000000018:
-        "Proxy"
      implementationNames.0xC0d3C0D3c0d3C0d3c0d3c0D3C0D3C0d3C0D30018:
-        "ProxyAdmin"
      implementationNames.oeth:0x4200000000000000000000000000000000000018:
+        "Proxy"
      implementationNames.oeth:0xC0d3C0D3c0d3C0d3c0d3c0D3C0D3C0d3C0D30018:
+        "ProxyAdmin"
    }
```

```diff
    contract BaseFeeVault (0x4200000000000000000000000000000000000019) {
    +++ description: Collects EIP-1559 base fees, which are withdrawable to the FeesCollector on L1.
      address:
-        "0x4200000000000000000000000000000000000019"
+        "oeth:0x4200000000000000000000000000000000000019"
      values.$admin:
-        "0x4200000000000000000000000000000000000018"
+        "oeth:0x4200000000000000000000000000000000000018"
      values.$implementation:
-        "0xC0d3c0D3c0d3C0D3C0D3C0d3c0D3C0D3c0d30019"
+        "oeth:0xC0d3c0D3c0d3C0D3C0D3C0d3c0D3C0D3c0d30019"
      values.RECIPIENT:
-        "0xa3d596EAfaB6B13Ab18D40FaE1A962700C84ADEa"
+        "oeth:0xa3d596EAfaB6B13Ab18D40FaE1A962700C84ADEa"
      implementationNames.0x4200000000000000000000000000000000000019:
-        "Proxy"
      implementationNames.0xC0d3c0D3c0d3C0D3C0D3C0d3c0D3C0D3c0d30019:
-        "BaseFeeVault"
      implementationNames.oeth:0x4200000000000000000000000000000000000019:
+        "Proxy"
      implementationNames.oeth:0xC0d3c0D3c0d3C0D3C0D3C0d3c0D3C0D3c0d30019:
+        "BaseFeeVault"
    }
```

```diff
    contract L1FeeVault (0x420000000000000000000000000000000000001A) {
    +++ description: Collects the L1 portion of the L2 transaction fees, which are withdrawable to the FeesCollector on L1.
      address:
-        "0x420000000000000000000000000000000000001A"
+        "oeth:0x420000000000000000000000000000000000001A"
      values.$admin:
-        "0x4200000000000000000000000000000000000018"
+        "oeth:0x4200000000000000000000000000000000000018"
      values.$implementation:
-        "0xc0D3c0D3C0d3c0d3c0d3C0d3c0d3C0d3C0D3001A"
+        "oeth:0xc0D3c0D3C0d3c0d3c0d3C0d3c0d3C0d3C0D3001A"
      values.RECIPIENT:
-        "0xa3d596EAfaB6B13Ab18D40FaE1A962700C84ADEa"
+        "oeth:0xa3d596EAfaB6B13Ab18D40FaE1A962700C84ADEa"
      implementationNames.0x420000000000000000000000000000000000001A:
-        "Proxy"
      implementationNames.0xc0D3c0D3C0d3c0d3c0d3C0d3c0d3C0d3C0D3001A:
-        "L1FeeVault"
      implementationNames.oeth:0x420000000000000000000000000000000000001A:
+        "Proxy"
      implementationNames.oeth:0xc0D3c0D3C0d3c0d3c0d3C0d3c0d3C0d3C0D3001A:
+        "L1FeeVault"
    }
```

```diff
    contract OperatorFeeVault (0x420000000000000000000000000000000000001b) {
    +++ description: Holds the 'operator fees' for the L2 network, which are part of the L2 fees that users pay.
      address:
-        "0x420000000000000000000000000000000000001b"
+        "oeth:0x420000000000000000000000000000000000001b"
      values.$admin:
-        "0x4200000000000000000000000000000000000018"
+        "oeth:0x4200000000000000000000000000000000000018"
      values.$implementation:
-        "0x4fa2Be8cd41504037F1838BcE3bCC93bC68Ff537"
+        "oeth:0x4fa2Be8cd41504037F1838BcE3bCC93bC68Ff537"
      values.$pastUpgrades.0.2.0:
-        "0x4fa2Be8cd41504037F1838BcE3bCC93bC68Ff537"
+        "oeth:0x4fa2Be8cd41504037F1838BcE3bCC93bC68Ff537"
      values.recipient:
-        "0x4200000000000000000000000000000000000019"
+        "oeth:0x4200000000000000000000000000000000000019"
      values.RECIPIENT:
-        "0x4200000000000000000000000000000000000019"
+        "oeth:0x4200000000000000000000000000000000000019"
      implementationNames.0x420000000000000000000000000000000000001b:
-        "Proxy"
      implementationNames.0x4fa2Be8cd41504037F1838BcE3bCC93bC68Ff537:
-        "OperatorFeeVault"
      implementationNames.oeth:0x420000000000000000000000000000000000001b:
+        "Proxy"
      implementationNames.oeth:0x4fa2Be8cd41504037F1838BcE3bCC93bC68Ff537:
+        "OperatorFeeVault"
    }
```

```diff
    contract SchemaRegistry (0x4200000000000000000000000000000000000020) {
    +++ description: Contracts to register schemas for the Ethereum Attestation Service (EAS).
      address:
-        "0x4200000000000000000000000000000000000020"
+        "oeth:0x4200000000000000000000000000000000000020"
      values.$admin:
-        "0x4200000000000000000000000000000000000018"
+        "oeth:0x4200000000000000000000000000000000000018"
      values.$implementation:
-        "0x6232208d66bAc2305b46b4Cb6BCB3857B298DF13"
+        "oeth:0x6232208d66bAc2305b46b4Cb6BCB3857B298DF13"
      values.$pastUpgrades.0.2.0:
-        "0x6232208d66bAc2305b46b4Cb6BCB3857B298DF13"
+        "oeth:0x6232208d66bAc2305b46b4Cb6BCB3857B298DF13"
      implementationNames.0x4200000000000000000000000000000000000020:
-        "Proxy"
      implementationNames.0x6232208d66bAc2305b46b4Cb6BCB3857B298DF13:
-        "SchemaRegistry"
      implementationNames.oeth:0x4200000000000000000000000000000000000020:
+        "Proxy"
      implementationNames.oeth:0x6232208d66bAc2305b46b4Cb6BCB3857B298DF13:
+        "SchemaRegistry"
    }
```

```diff
    contract EAS (0x4200000000000000000000000000000000000021) {
    +++ description: Contract containing the main logic for the Ethereum Attestation Service (EAS).
      address:
-        "0x4200000000000000000000000000000000000021"
+        "oeth:0x4200000000000000000000000000000000000021"
      values.$admin:
-        "0x4200000000000000000000000000000000000018"
+        "oeth:0x4200000000000000000000000000000000000018"
      values.$implementation:
-        "0x4E0275Ea5a89e7a3c1B58411379D1a0eDdc5b088"
+        "oeth:0x4E0275Ea5a89e7a3c1B58411379D1a0eDdc5b088"
      values.$pastUpgrades.0.2.0:
-        "0x4E0275Ea5a89e7a3c1B58411379D1a0eDdc5b088"
+        "oeth:0x4E0275Ea5a89e7a3c1B58411379D1a0eDdc5b088"
      values.getSchemaRegistry:
-        "0x4200000000000000000000000000000000000020"
+        "oeth:0x4200000000000000000000000000000000000020"
      implementationNames.0x4200000000000000000000000000000000000021:
-        "Proxy"
      implementationNames.0x4E0275Ea5a89e7a3c1B58411379D1a0eDdc5b088:
-        "EAS"
      implementationNames.oeth:0x4200000000000000000000000000000000000021:
+        "Proxy"
      implementationNames.oeth:0x4E0275Ea5a89e7a3c1B58411379D1a0eDdc5b088:
+        "EAS"
    }
```

```diff
    contract OPToken (0x4200000000000000000000000000000000000042) {
    +++ description: The OP token contract. The minting policy is controlled by the oeth:0x5C4e7Ba1E219E47948e6e3F55019A647bA501005.
      address:
-        "0x4200000000000000000000000000000000000042"
+        "oeth:0x4200000000000000000000000000000000000042"
      description:
-        "The OP token contract. The minting policy is controlled by the 0x5C4e7Ba1E219E47948e6e3F55019A647bA501005."
+        "The OP token contract. The minting policy is controlled by the oeth:0x5C4e7Ba1E219E47948e6e3F55019A647bA501005."
      values.owner:
-        "0x5C4e7Ba1E219E47948e6e3F55019A647bA501005"
+        "oeth:0x5C4e7Ba1E219E47948e6e3F55019A647bA501005"
      implementationNames.0x4200000000000000000000000000000000000042:
-        "GovernanceToken"
      implementationNames.oeth:0x4200000000000000000000000000000000000042:
+        "GovernanceToken"
    }
```

```diff
    EOA  (0x4D014f3c5F33Aa9Cd1Dc29ce29618d07Ae666d15) {
    +++ description: None
      address:
-        "0x4D014f3c5F33Aa9Cd1Dc29ce29618d07Ae666d15"
+        "oeth:0x4D014f3c5F33Aa9Cd1Dc29ce29618d07Ae666d15"
    }
```

```diff
    contract MintManager (0x5C4e7Ba1E219E47948e6e3F55019A647bA501005) {
    +++ description: Controls the OP inflation rate, which is currently hardcoded to 2% annually.
      address:
-        "0x5C4e7Ba1E219E47948e6e3F55019A647bA501005"
+        "oeth:0x5C4e7Ba1E219E47948e6e3F55019A647bA501005"
      values.governanceToken:
-        "0x4200000000000000000000000000000000000042"
+        "oeth:0x4200000000000000000000000000000000000042"
      values.owner:
-        "0x2A82Ae142b2e62Cb7D10b55E323ACB1Cab663a26"
+        "oeth:0x2A82Ae142b2e62Cb7D10b55E323ACB1Cab663a26"
      implementationNames.0x5C4e7Ba1E219E47948e6e3F55019A647bA501005:
-        "MintManager"
      implementationNames.oeth:0x5C4e7Ba1E219E47948e6e3F55019A647bA501005:
+        "MintManager"
    }
```

```diff
    EOA SuperchainProxyAdminOwner - L2 Alias (0x6B1BAE59D09fCcbdDB6C6cceb07B7279367C4E3b) {
    +++ description: None
      address:
-        "0x6B1BAE59D09fCcbdDB6C6cceb07B7279367C4E3b"
+        "oeth:0x6B1BAE59D09fCcbdDB6C6cceb07B7279367C4E3b"
    }
```

```diff
    EOA  (0x7cB07FE039a92B3D784f284D919503A381BEC54f) {
    +++ description: None
      address:
-        "0x7cB07FE039a92B3D784f284D919503A381BEC54f"
+        "oeth:0x7cB07FE039a92B3D784f284D919503A381BEC54f"
    }
```

```diff
    EOA  (0x99C9fc46f92E8a1c0deC1b1747d010903E884bE1) {
    +++ description: None
      address:
-        "0x99C9fc46f92E8a1c0deC1b1747d010903E884bE1"
+        "oeth:0x99C9fc46f92E8a1c0deC1b1747d010903E884bE1"
    }
```

```diff
    EOA  (0xa3d596EAfaB6B13Ab18D40FaE1A962700C84ADEa) {
    +++ description: None
      address:
-        "0xa3d596EAfaB6B13Ab18D40FaE1A962700C84ADEa"
+        "oeth:0xa3d596EAfaB6B13Ab18D40FaE1A962700C84ADEa"
    }
```

```diff
    EOA  (0xA902A27a7631D502E3Ec17fc5d4c3e0861752c94) {
    +++ description: None
      address:
-        "0xA902A27a7631D502E3Ec17fc5d4c3e0861752c94"
+        "oeth:0xA902A27a7631D502E3Ec17fc5d4c3e0861752c94"
    }
```

```diff
    EOA  (0xdb203D7f00fF435dA107543B33495f9cA2c484C6) {
    +++ description: None
      address:
-        "0xdb203D7f00fF435dA107543B33495f9cA2c484C6"
+        "oeth:0xdb203D7f00fF435dA107543B33495f9cA2c484C6"
    }
```

```diff
    EOA  (0xDeaDDEaDDeAdDeAdDEAdDEaddeAddEAdDEAd0001) {
    +++ description: None
      address:
-        "0xDeaDDEaDDeAdDeAdDEAdDEaddeAddEAdDEAd0001"
+        "oeth:0xDeaDDEaDDeAdDeAdDEAdDEaddeAddEAdDEAd0001"
    }
```

```diff
    EOA  (0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE) {
    +++ description: None
      address:
-        "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE"
+        "oeth:0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE"
    }
```

```diff
+   Status: CREATED
    contract MintManagerOwner (0x2A82Ae142b2e62Cb7D10b55E323ACB1Cab663a26)
    +++ description: None
```

```diff
+   Status: CREATED
    contract DeployerWhitelist (0x4200000000000000000000000000000000000002)
    +++ description: Legacy contract that was originally used to act as a whitelist of addresses allowed to the Optimism network. Fully unused and deprecated since the Bedrock upgrade.
```

```diff
+   Status: CREATED
    contract L2CrossDomainMessenger (0x4200000000000000000000000000000000000007)
    +++ description: The L2CrossDomainMessenger (L2xDM) contract sends messages from L2 to L1, and relays messages from L1 onto L2 with a system tx. In the event that a message sent from L2 to L1 is rejected for exceeding the L1 gas limit, it can be resubmitted via this contract’s replay function.
```

```diff
+   Status: CREATED
    contract GasPriceOracle (0x420000000000000000000000000000000000000F)
    +++ description: Provides the current gas price for L2 transactions.
```

```diff
+   Status: CREATED
    contract L2StandardBridge (0x4200000000000000000000000000000000000010)
    +++ description: The L2StandardBridge contract is the main entry point to deposit or withdraw ERC20 tokens from L2 to L1. This contract can store any token.
```

```diff
+   Status: CREATED
    contract SequencerFeeVault (0x4200000000000000000000000000000000000011)
    +++ description: Collects the sequencer fees, which are withdrawable to the FeesCollector on L1.
```

```diff
+   Status: CREATED
    contract OptimismMintableERC20Factory (0x4200000000000000000000000000000000000012)
    +++ description: Factory contract to create bridge compliant ERC20 IOU token representations of bridged L1 ERC20 tokens.
```

```diff
+   Status: CREATED
    contract L1BlockNumber (0x4200000000000000000000000000000000000013)
    +++ description: Simple contract that returns the latest L1 block number.
```

```diff
+   Status: CREATED
    contract L2ERC721Bridge (0x4200000000000000000000000000000000000014)
    +++ description: The L2ERC721Bridge contract is the main entry point to deposit or withdraw ERC721 tokens from L2 to L1. This contract can store any token.
```

```diff
+   Status: CREATED
    contract L1Block (0x4200000000000000000000000000000000000015)
    +++ description: Simple contract that returns information about the latest L1 block, which is derived permissionlessly from the L1 chain.
```

```diff
+   Status: CREATED
    contract L2ToL1MessagePasser (0x4200000000000000000000000000000000000016)
    +++ description: Contract used internally by the L2CrossDomainMessenger to send messages to L1, including withdrawals. It can also be used directly as a low-level interface.
```

```diff
+   Status: CREATED
    contract OptimismMintableERC721Factory (0x4200000000000000000000000000000000000017)
    +++ description: Factory contract to create bridge compliant ERC721 IOU token representations of bridged L1 ERC721 tokens.
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x4200000000000000000000000000000000000018)
    +++ description: None
```

```diff
+   Status: CREATED
    contract BaseFeeVault (0x4200000000000000000000000000000000000019)
    +++ description: Collects EIP-1559 base fees, which are withdrawable to the FeesCollector on L1.
```

```diff
+   Status: CREATED
    contract L1FeeVault (0x420000000000000000000000000000000000001A)
    +++ description: Collects the L1 portion of the L2 transaction fees, which are withdrawable to the FeesCollector on L1.
```

```diff
+   Status: CREATED
    contract OperatorFeeVault (0x420000000000000000000000000000000000001b)
    +++ description: Holds the 'operator fees' for the L2 network, which are part of the L2 fees that users pay.
```

```diff
+   Status: CREATED
    contract SchemaRegistry (0x4200000000000000000000000000000000000020)
    +++ description: Contracts to register schemas for the Ethereum Attestation Service (EAS).
```

```diff
+   Status: CREATED
    contract EAS (0x4200000000000000000000000000000000000021)
    +++ description: Contract containing the main logic for the Ethereum Attestation Service (EAS).
```

```diff
+   Status: CREATED
    contract OPToken (0x4200000000000000000000000000000000000042)
    +++ description: The OP token contract. The minting policy is controlled by the oeth:0x5C4e7Ba1E219E47948e6e3F55019A647bA501005.
```

```diff
+   Status: CREATED
    contract MintManager (0x5C4e7Ba1E219E47948e6e3F55019A647bA501005)
    +++ description: Controls the OP inflation rate, which is currently hardcoded to 2% annually.
```

Generated with discovered.json: 0xe42a65ea4e402017d72e9491ccc0a93e7f985b9a

# Diff at Mon, 14 Jul 2025 12:47:06 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@9f4300dad2f3d080cd56fa311d4a848556c74e72 block: 22567749
- current block number: 22567749

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22567749 (main branch discovery), not current.

```diff
    EOA  (0x000000000000000000000000000000000000dEaD) {
    +++ description: None
      address:
-        "0x000000000000000000000000000000000000dEaD"
+        "eth:0x000000000000000000000000000000000000dEaD"
    }
```

```diff
    contract LivenessModule (0x0454092516c9A4d636d3CAfA1e82161376C8a748) {
    +++ description: used to remove members inactive for 98d while making sure that the threshold remains above 75%. If the number of members falls below 8, the eth:0x847B5c174615B1B7fDF770882256e2D3E95b9D92 takes ownership of the multisig
      address:
-        "0x0454092516c9A4d636d3CAfA1e82161376C8a748"
+        "eth:0x0454092516c9A4d636d3CAfA1e82161376C8a748"
      description:
-        "used to remove members inactive for 98d while making sure that the threshold remains above 75%. If the number of members falls below 8, the 0x847B5c174615B1B7fDF770882256e2D3E95b9D92 takes ownership of the multisig"
+        "used to remove members inactive for 98d while making sure that the threshold remains above 75%. If the number of members falls below 8, the eth:0x847B5c174615B1B7fDF770882256e2D3E95b9D92 takes ownership of the multisig"
      values.fallbackOwner:
-        "0x847B5c174615B1B7fDF770882256e2D3E95b9D92"
+        "eth:0x847B5c174615B1B7fDF770882256e2D3E95b9D92"
      values.livenessGuard:
-        "0x24424336F04440b1c28685a38303aC33C9D14a25"
+        "eth:0x24424336F04440b1c28685a38303aC33C9D14a25"
      values.safe:
-        "0xc2819DC788505Aac350142A7A707BF9D03E3Bd03"
+        "eth:0xc2819DC788505Aac350142A7A707BF9D03E3Bd03"
      implementationNames.0x0454092516c9A4d636d3CAfA1e82161376C8a748:
-        "LivenessModule"
      implementationNames.eth:0x0454092516c9A4d636d3CAfA1e82161376C8a748:
+        "LivenessModule"
    }
```

```diff
    EOA  (0x07dC0893cAfbF810e3E72505041f2865726Fd073) {
    +++ description: None
      address:
-        "0x07dC0893cAfbF810e3E72505041f2865726Fd073"
+        "eth:0x07dC0893cAfbF810e3E72505041f2865726Fd073"
    }
```

```diff
    contract Optimism Guardian Multisig (0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2) {
    +++ description: None
      address:
-        "0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2"
+        "eth:0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2"
      values.$implementation:
-        "0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
+        "eth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
      values.$members.0:
-        "0xc2819DC788505Aac350142A7A707BF9D03E3Bd03"
+        "eth:0xc2819DC788505Aac350142A7A707BF9D03E3Bd03"
      values.GnosisSafe_modules.0:
-        "0xc6901F65369FC59fC1B4D6D6bE7A2318Ff38dB5B"
+        "eth:0xc6901F65369FC59fC1B4D6D6bE7A2318Ff38dB5B"
      implementationNames.0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2:
-        "GnosisSafeProxy"
      implementationNames.0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
-        "GnosisSafe"
      implementationNames.eth:0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2:
+        "GnosisSafeProxy"
      implementationNames.eth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
+        "GnosisSafe"
    }
```

```diff
    EOA  (0x0aA384EB2fedD2741277A0f72909A0d7275575D7) {
    +++ description: None
      address:
-        "0x0aA384EB2fedD2741277A0f72909A0d7275575D7"
+        "eth:0x0aA384EB2fedD2741277A0f72909A0d7275575D7"
    }
```

```diff
    contract L1DAITokenBridge (0x10E6593CDda8c58a1d0f14C5164B376352a55f2F) {
    +++ description: Custom Gateway for DAI deposits via canonical messaging. Deposited DAI is forwarded to a Vault contract.
      address:
-        "0x10E6593CDda8c58a1d0f14C5164B376352a55f2F"
+        "eth:0x10E6593CDda8c58a1d0f14C5164B376352a55f2F"
      values.escrow:
-        "0x467194771dAe2967Aef3ECbEDD3Bf9a310C76C65"
+        "eth:0x467194771dAe2967Aef3ECbEDD3Bf9a310C76C65"
      values.l1Token:
-        "0x6B175474E89094C44Da98b954EedeAC495271d0F"
+        "eth:0x6B175474E89094C44Da98b954EedeAC495271d0F"
      values.l2DAITokenBridge:
-        "0x467194771dAe2967Aef3ECbEDD3Bf9a310C76C65"
+        "eth:0x467194771dAe2967Aef3ECbEDD3Bf9a310C76C65"
      values.l2Token:
-        "0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1"
+        "eth:0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1"
      values.messenger:
-        "0x25ace71c97B33Cc4729CF772ae268934F7ab5fA1"
+        "eth:0x25ace71c97B33Cc4729CF772ae268934F7ab5fA1"
      implementationNames.0x10E6593CDda8c58a1d0f14C5164B376352a55f2F:
-        "L1DAITokenBridge"
      implementationNames.eth:0x10E6593CDda8c58a1d0f14C5164B376352a55f2F:
+        "L1DAITokenBridge"
    }
```

```diff
    contract DeputyPauseModule (0x126a736B18E0a64fBA19D421647A530E327E112C) {
    +++ description: Allows eth:0x352f1defB49718e7Ea411687E850aA8d6299F7aC, called the deputy pauser, to act on behalf of the eth:0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A if set as its Safe module.
      address:
-        "0x126a736B18E0a64fBA19D421647A530E327E112C"
+        "eth:0x126a736B18E0a64fBA19D421647A530E327E112C"
      description:
-        "Allows 0x352f1defB49718e7Ea411687E850aA8d6299F7aC, called the deputy pauser, to act on behalf of the 0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A if set as its Safe module."
+        "Allows eth:0x352f1defB49718e7Ea411687E850aA8d6299F7aC, called the deputy pauser, to act on behalf of the eth:0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A if set as its Safe module."
      values.deputy:
-        "0x352f1defB49718e7Ea411687E850aA8d6299F7aC"
+        "eth:0x352f1defB49718e7Ea411687E850aA8d6299F7aC"
      values.deputyGuardianModule:
-        "0xc6901F65369FC59fC1B4D6D6bE7A2318Ff38dB5B"
+        "eth:0xc6901F65369FC59fC1B4D6D6bE7A2318Ff38dB5B"
      values.eip712Domain.verifyingContract:
-        "0x126a736B18E0a64fBA19D421647A530E327E112C"
+        "eth:0x126a736B18E0a64fBA19D421647A530E327E112C"
      values.foundationSafe:
-        "0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A"
+        "eth:0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A"
      values.superchainConfig:
-        "0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
+        "eth:0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
      implementationNames.0x126a736B18E0a64fBA19D421647A530E327E112C:
-        "DeputyPauseModule"
      implementationNames.eth:0x126a736B18E0a64fBA19D421647A530E327E112C:
+        "DeputyPauseModule"
    }
```

```diff
    EOA  (0x1822b35B09f5ce1C78ecbC06AC0A4e17885b925e) {
    +++ description: None
      address:
-        "0x1822b35B09f5ce1C78ecbC06AC0A4e17885b925e"
+        "eth:0x1822b35B09f5ce1C78ecbC06AC0A4e17885b925e"
    }
```

```diff
    contract AnchorStateRegistry (0x1c68ECfbf9C8B1E6C0677965b3B9Ecf9A104305b) {
    +++ description: Contains the latest confirmed state root that can be used as a starting point in a dispute game.
      address:
-        "0x1c68ECfbf9C8B1E6C0677965b3B9Ecf9A104305b"
+        "eth:0x1c68ECfbf9C8B1E6C0677965b3B9Ecf9A104305b"
      values.$admin:
-        "0x543bA4AADBAb8f9025686Bd03993043599c6fB04"
+        "eth:0x543bA4AADBAb8f9025686Bd03993043599c6fB04"
      values.$implementation:
-        "0x7b465370BB7A333f99edd19599EB7Fb1c2D3F8D2"
+        "eth:0x7b465370BB7A333f99edd19599EB7Fb1c2D3F8D2"
      values.$pastUpgrades.0.2.0:
-        "0x7b465370BB7A333f99edd19599EB7Fb1c2D3F8D2"
+        "eth:0x7b465370BB7A333f99edd19599EB7Fb1c2D3F8D2"
      values.disputeGameFactory:
-        "0xe5965Ab5962eDc7477C8520243A95517CD252fA9"
+        "eth:0xe5965Ab5962eDc7477C8520243A95517CD252fA9"
      values.portal:
-        "0xbEb5Fc579115071764c7423A4f12eDde41f106Ed"
+        "eth:0xbEb5Fc579115071764c7423A4f12eDde41f106Ed"
      values.superchainConfig:
-        "0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
+        "eth:0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
      implementationNames.0x1c68ECfbf9C8B1E6C0677965b3B9Ecf9A104305b:
-        "Proxy"
      implementationNames.0x7b465370BB7A333f99edd19599EB7Fb1c2D3F8D2:
-        "AnchorStateRegistry"
      implementationNames.eth:0x1c68ECfbf9C8B1E6C0677965b3B9Ecf9A104305b:
+        "Proxy"
      implementationNames.eth:0x7b465370BB7A333f99edd19599EB7Fb1c2D3F8D2:
+        "AnchorStateRegistry"
    }
```

```diff
    contract PreimageOracle (0x1fb8cdFc6831fc866Ed9C51aF8817Da5c287aDD3) {
    +++ description: The PreimageOracle contract is used to load the required data from L1 for a dispute game.
      address:
-        "0x1fb8cdFc6831fc866Ed9C51aF8817Da5c287aDD3"
+        "eth:0x1fb8cdFc6831fc866Ed9C51aF8817Da5c287aDD3"
      implementationNames.0x1fb8cdFc6831fc866Ed9C51aF8817Da5c287aDD3:
-        "PreimageOracle"
      implementationNames.eth:0x1fb8cdFc6831fc866Ed9C51aF8817Da5c287aDD3:
+        "PreimageOracle"
    }
```

```diff
    contract DelayedWETH_PermissionedGames (0x21429aF66058BC3e4aE4a8f2EC4531AaC433ecbC) {
    +++ description: Contract designed to hold the bonded ETH for each game. It is designed as a wrapper around WETH to allow an owner to function as a backstop if a game would incorrectly distribute funds.
      address:
-        "0x21429aF66058BC3e4aE4a8f2EC4531AaC433ecbC"
+        "eth:0x21429aF66058BC3e4aE4a8f2EC4531AaC433ecbC"
      values.$admin:
-        "0x543bA4AADBAb8f9025686Bd03993043599c6fB04"
+        "eth:0x543bA4AADBAb8f9025686Bd03993043599c6fB04"
      values.$implementation:
-        "0x5e40B9231B86984b5150507046e354dbFbeD3d9e"
+        "eth:0x5e40B9231B86984b5150507046e354dbFbeD3d9e"
      values.$pastUpgrades.0.2.0:
-        "0x71e966Ae981d1ce531a7b6d23DC0f27B38409087"
+        "eth:0x71e966Ae981d1ce531a7b6d23DC0f27B38409087"
      values.$pastUpgrades.1.2.0:
-        "0x5e40B9231B86984b5150507046e354dbFbeD3d9e"
+        "eth:0x5e40B9231B86984b5150507046e354dbFbeD3d9e"
      values.config:
-        "0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
+        "eth:0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
      values.owner:
-        "0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A"
+        "eth:0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A"
      implementationNames.0x21429aF66058BC3e4aE4a8f2EC4531AaC433ecbC:
-        "Proxy"
      implementationNames.0x5e40B9231B86984b5150507046e354dbFbeD3d9e:
-        "DelayedWETH"
      implementationNames.eth:0x21429aF66058BC3e4aE4a8f2EC4531AaC433ecbC:
+        "Proxy"
      implementationNames.eth:0x5e40B9231B86984b5150507046e354dbFbeD3d9e:
+        "DelayedWETH"
    }
```

```diff
    contract SystemConfig (0x229047fed2591dbec1eF1118d64F7aF3dB9EB290) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      address:
-        "0x229047fed2591dbec1eF1118d64F7aF3dB9EB290"
+        "eth:0x229047fed2591dbec1eF1118d64F7aF3dB9EB290"
      values.$admin:
-        "0x543bA4AADBAb8f9025686Bd03993043599c6fB04"
+        "eth:0x543bA4AADBAb8f9025686Bd03993043599c6fB04"
      values.$implementation:
-        "0x340f923E5c7cbB2171146f64169EC9d5a9FfE647"
+        "eth:0x340f923E5c7cbB2171146f64169EC9d5a9FfE647"
      values.$pastUpgrades.0.2.0:
-        "0x5efa852e92800D1C982711761e45c3FE39a2b6D8"
+        "eth:0x5efa852e92800D1C982711761e45c3FE39a2b6D8"
      values.$pastUpgrades.1.2.0:
-        "0xd81f43eDBCAcb4c29a9bA38a13Ee5d79278270cC"
+        "eth:0xd81f43eDBCAcb4c29a9bA38a13Ee5d79278270cC"
      values.$pastUpgrades.2.2.0:
-        "0x33A032ec93Ec0C492Ec4BF0B30D5f51986E5a314"
+        "eth:0x33A032ec93Ec0C492Ec4BF0B30D5f51986E5a314"
      values.$pastUpgrades.3.2.0:
-        "0xd81f43eDBCAcb4c29a9bA38a13Ee5d79278270cC"
+        "eth:0xd81f43eDBCAcb4c29a9bA38a13Ee5d79278270cC"
      values.$pastUpgrades.4.2.0:
-        "0xba2492e52F45651B60B8B38d4Ea5E2390C64Ffb1"
+        "eth:0xba2492e52F45651B60B8B38d4Ea5E2390C64Ffb1"
      values.$pastUpgrades.5.2.0:
-        "0xd81f43eDBCAcb4c29a9bA38a13Ee5d79278270cC"
+        "eth:0xd81f43eDBCAcb4c29a9bA38a13Ee5d79278270cC"
      values.$pastUpgrades.6.2.0:
-        "0xF56D96B2535B932656d3c04Ebf51baBff241D886"
+        "eth:0xF56D96B2535B932656d3c04Ebf51baBff241D886"
      values.$pastUpgrades.7.2.0:
-        "0xd81f43eDBCAcb4c29a9bA38a13Ee5d79278270cC"
+        "eth:0xd81f43eDBCAcb4c29a9bA38a13Ee5d79278270cC"
      values.$pastUpgrades.8.2.0:
-        "0xAB9d6cB7A427c0765163A7f45BB91cAfe5f2D375"
+        "eth:0xAB9d6cB7A427c0765163A7f45BB91cAfe5f2D375"
      values.$pastUpgrades.9.2.0:
-        "0x760C48C62A85045A6B69f07F4a9f22868659CbCc"
+        "eth:0x760C48C62A85045A6B69f07F4a9f22868659CbCc"
      values.$pastUpgrades.10.2.0:
-        "0x340f923E5c7cbB2171146f64169EC9d5a9FfE647"
+        "eth:0x340f923E5c7cbB2171146f64169EC9d5a9FfE647"
      values.batcherHash:
-        "0x6887246668a3b87F54DeB3b94Ba47a6f63F32985"
+        "eth:0x6887246668a3b87F54DeB3b94Ba47a6f63F32985"
      values.batchInbox:
-        "0xFF00000000000000000000000000000000000010"
+        "eth:0xFF00000000000000000000000000000000000010"
      values.disputeGameFactory:
-        "0xe5965Ab5962eDc7477C8520243A95517CD252fA9"
+        "eth:0xe5965Ab5962eDc7477C8520243A95517CD252fA9"
      values.getAddresses.l1CrossDomainMessenger:
-        "0x25ace71c97B33Cc4729CF772ae268934F7ab5fA1"
+        "eth:0x25ace71c97B33Cc4729CF772ae268934F7ab5fA1"
      values.getAddresses.l1ERC721Bridge:
-        "0x5a7749f83b81B301cAb5f48EB8516B986DAef23D"
+        "eth:0x5a7749f83b81B301cAb5f48EB8516B986DAef23D"
      values.getAddresses.l1StandardBridge:
-        "0x99C9fc46f92E8a1c0deC1b1747d010903E884bE1"
+        "eth:0x99C9fc46f92E8a1c0deC1b1747d010903E884bE1"
      values.getAddresses.disputeGameFactory:
-        "0xe5965Ab5962eDc7477C8520243A95517CD252fA9"
+        "eth:0xe5965Ab5962eDc7477C8520243A95517CD252fA9"
      values.getAddresses.optimismPortal:
-        "0xbEb5Fc579115071764c7423A4f12eDde41f106Ed"
+        "eth:0xbEb5Fc579115071764c7423A4f12eDde41f106Ed"
      values.getAddresses.optimismMintableERC20Factory:
-        "0x75505a97BD334E7BD3C476893285569C4136Fa0F"
+        "eth:0x75505a97BD334E7BD3C476893285569C4136Fa0F"
      values.l1CrossDomainMessenger:
-        "0x25ace71c97B33Cc4729CF772ae268934F7ab5fA1"
+        "eth:0x25ace71c97B33Cc4729CF772ae268934F7ab5fA1"
      values.l1ERC721Bridge:
-        "0x5a7749f83b81B301cAb5f48EB8516B986DAef23D"
+        "eth:0x5a7749f83b81B301cAb5f48EB8516B986DAef23D"
      values.l1StandardBridge:
-        "0x99C9fc46f92E8a1c0deC1b1747d010903E884bE1"
+        "eth:0x99C9fc46f92E8a1c0deC1b1747d010903E884bE1"
      values.optimismMintableERC20Factory:
-        "0x75505a97BD334E7BD3C476893285569C4136Fa0F"
+        "eth:0x75505a97BD334E7BD3C476893285569C4136Fa0F"
      values.optimismPortal:
-        "0xbEb5Fc579115071764c7423A4f12eDde41f106Ed"
+        "eth:0xbEb5Fc579115071764c7423A4f12eDde41f106Ed"
      values.owner:
-        "0x847B5c174615B1B7fDF770882256e2D3E95b9D92"
+        "eth:0x847B5c174615B1B7fDF770882256e2D3E95b9D92"
      values.sequencerInbox:
-        "0xFF00000000000000000000000000000000000010"
+        "eth:0xFF00000000000000000000000000000000000010"
      values.unsafeBlockSigner:
-        "0xAAAA45d9549EDA09E70937013520214382Ffc4A2"
+        "eth:0xAAAA45d9549EDA09E70937013520214382Ffc4A2"
      implementationNames.0x229047fed2591dbec1eF1118d64F7aF3dB9EB290:
-        "Proxy"
      implementationNames.0x340f923E5c7cbB2171146f64169EC9d5a9FfE647:
-        "SystemConfig"
      implementationNames.eth:0x229047fed2591dbec1eF1118d64F7aF3dB9EB290:
+        "Proxy"
      implementationNames.eth:0x340f923E5c7cbB2171146f64169EC9d5a9FfE647:
+        "SystemConfig"
    }
```

```diff
    contract LivenessGuard (0x24424336F04440b1c28685a38303aC33C9D14a25) {
    +++ description: Modular contract to be used together with the LivenessModule. Tracks liveness / activity of Safe owners.
      address:
-        "0x24424336F04440b1c28685a38303aC33C9D14a25"
+        "eth:0x24424336F04440b1c28685a38303aC33C9D14a25"
      receivedPermissions.0.description:
-        "can remove members of 0xc2819DC788505Aac350142A7A707BF9D03E3Bd03 inactive for 98d."
+        "can remove members of eth:0xc2819DC788505Aac350142A7A707BF9D03E3Bd03 inactive for 98d."
      values.safe:
-        "0xc2819DC788505Aac350142A7A707BF9D03E3Bd03"
+        "eth:0xc2819DC788505Aac350142A7A707BF9D03E3Bd03"
      implementationNames.0x24424336F04440b1c28685a38303aC33C9D14a25:
-        "LivenessGuard"
      implementationNames.eth:0x24424336F04440b1c28685a38303aC33C9D14a25:
+        "LivenessGuard"
    }
```

```diff
    contract L1CrossDomainMessenger (0x25ace71c97B33Cc4729CF772ae268934F7ab5fA1) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      address:
-        "0x25ace71c97B33Cc4729CF772ae268934F7ab5fA1"
+        "eth:0x25ace71c97B33Cc4729CF772ae268934F7ab5fA1"
      values.$admin:
-        "0x543bA4AADBAb8f9025686Bd03993043599c6fB04"
+        "eth:0x543bA4AADBAb8f9025686Bd03993043599c6fB04"
      values.$implementation:
-        "0x5D5a095665886119693F0B41d8DFeE78da033e8B"
+        "eth:0x5D5a095665886119693F0B41d8DFeE78da033e8B"
      values.$pastUpgrades.0.2.0:
-        "0x16393737D09d2722AD13DcA3cA8C3DB957699F1D"
+        "eth:0x16393737D09d2722AD13DcA3cA8C3DB957699F1D"
      values.$pastUpgrades.1.2.0:
-        "0xbfba066b5cA610Fe70AdCE45FcB622F945891bb0"
+        "eth:0xbfba066b5cA610Fe70AdCE45FcB622F945891bb0"
      values.$pastUpgrades.2.2.0:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.$pastUpgrades.3.2.0:
-        "0xd9166833FF12A5F900ccfBf2c8B62a90F1Ca1FD5"
+        "eth:0xd9166833FF12A5F900ccfBf2c8B62a90F1Ca1FD5"
      values.$pastUpgrades.4.2.0:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.$pastUpgrades.5.2.0:
-        "0x2150Bc3c64cbfDDbaC9815EF615D6AB8671bfe43"
+        "eth:0x2150Bc3c64cbfDDbaC9815EF615D6AB8671bfe43"
      values.$pastUpgrades.6.2.0:
-        "0xd81f43eDBCAcb4c29a9bA38a13Ee5d79278270cC"
+        "eth:0xd81f43eDBCAcb4c29a9bA38a13Ee5d79278270cC"
      values.$pastUpgrades.7.2.0:
-        "0xa95B24af19f8907390eD15f8348A1a5e6Ccbc5C6"
+        "eth:0xa95B24af19f8907390eD15f8348A1a5e6Ccbc5C6"
      values.$pastUpgrades.8.2.0:
-        "0xd81f43eDBCAcb4c29a9bA38a13Ee5d79278270cC"
+        "eth:0xd81f43eDBCAcb4c29a9bA38a13Ee5d79278270cC"
      values.$pastUpgrades.9.2.0:
-        "0xD3494713A5cfaD3F5359379DfA074E2Ac8C6Fd65"
+        "eth:0xD3494713A5cfaD3F5359379DfA074E2Ac8C6Fd65"
      values.$pastUpgrades.10.2.0:
-        "0x3eA6084748ED1b2A9B5D4426181F1ad8C93F6231"
+        "eth:0x3eA6084748ED1b2A9B5D4426181F1ad8C93F6231"
      values.$pastUpgrades.11.2.0:
-        "0x5D5a095665886119693F0B41d8DFeE78da033e8B"
+        "eth:0x5D5a095665886119693F0B41d8DFeE78da033e8B"
      values.portal:
-        "0xbEb5Fc579115071764c7423A4f12eDde41f106Ed"
+        "eth:0xbEb5Fc579115071764c7423A4f12eDde41f106Ed"
      values.PORTAL:
-        "0xbEb5Fc579115071764c7423A4f12eDde41f106Ed"
+        "eth:0xbEb5Fc579115071764c7423A4f12eDde41f106Ed"
      values.ResolvedDelegateProxy_addressManager:
-        "0xdE1FCfB0851916CA5101820A69b13a4E276bd81F"
+        "eth:0xdE1FCfB0851916CA5101820A69b13a4E276bd81F"
      values.superchainConfig:
-        "0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
+        "eth:0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
      implementationNames.0x25ace71c97B33Cc4729CF772ae268934F7ab5fA1:
-        "Lib_ResolvedDelegateProxy"
      implementationNames.0x5D5a095665886119693F0B41d8DFeE78da033e8B:
-        "L1CrossDomainMessenger"
      implementationNames.eth:0x25ace71c97B33Cc4729CF772ae268934F7ab5fA1:
+        "Lib_ResolvedDelegateProxy"
      implementationNames.eth:0x5D5a095665886119693F0B41d8DFeE78da033e8B:
+        "L1CrossDomainMessenger"
    }
```

```diff
    EOA  (0x3041BA32f451F5850c147805F5521AC206421623) {
    +++ description: None
      address:
-        "0x3041BA32f451F5850c147805F5521AC206421623"
+        "eth:0x3041BA32f451F5850c147805F5521AC206421623"
    }
```

```diff
    contract DelayedWETH_PermissionlessGames (0x323dFC63c9B83CB83f40325AaB74b245937cbdF0) {
    +++ description: Contract designed to hold the bonded ETH for each game. It is designed as a wrapper around WETH to allow an owner to function as a backstop if a game would incorrectly distribute funds.
      address:
-        "0x323dFC63c9B83CB83f40325AaB74b245937cbdF0"
+        "eth:0x323dFC63c9B83CB83f40325AaB74b245937cbdF0"
      values.$admin:
-        "0x543bA4AADBAb8f9025686Bd03993043599c6fB04"
+        "eth:0x543bA4AADBAb8f9025686Bd03993043599c6fB04"
      values.$implementation:
-        "0x5e40B9231B86984b5150507046e354dbFbeD3d9e"
+        "eth:0x5e40B9231B86984b5150507046e354dbFbeD3d9e"
      values.$pastUpgrades.0.2.0:
-        "0x71e966Ae981d1ce531a7b6d23DC0f27B38409087"
+        "eth:0x71e966Ae981d1ce531a7b6d23DC0f27B38409087"
      values.$pastUpgrades.1.2.0:
-        "0x5e40B9231B86984b5150507046e354dbFbeD3d9e"
+        "eth:0x5e40B9231B86984b5150507046e354dbFbeD3d9e"
      values.config:
-        "0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
+        "eth:0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
      values.owner:
-        "0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A"
+        "eth:0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A"
      implementationNames.0x323dFC63c9B83CB83f40325AaB74b245937cbdF0:
-        "Proxy"
      implementationNames.0x5e40B9231B86984b5150507046e354dbFbeD3d9e:
-        "DelayedWETH"
      implementationNames.eth:0x323dFC63c9B83CB83f40325AaB74b245937cbdF0:
+        "Proxy"
      implementationNames.eth:0x5e40B9231B86984b5150507046e354dbFbeD3d9e:
+        "DelayedWETH"
    }
```

```diff
    EOA Optimism EOA 1 (0x352f1defB49718e7Ea411687E850aA8d6299F7aC) {
    +++ description: None
      address:
-        "0x352f1defB49718e7Ea411687E850aA8d6299F7aC"
+        "eth:0x352f1defB49718e7Ea411687E850aA8d6299F7aC"
    }
```

```diff
    contract GnosisSafe (0x42d27eEA1AD6e22Af6284F609847CB3Cd56B9c64) {
    +++ description: None
      address:
-        "0x42d27eEA1AD6e22Af6284F609847CB3Cd56B9c64"
+        "eth:0x42d27eEA1AD6e22Af6284F609847CB3Cd56B9c64"
      values.$implementation:
-        "0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
+        "eth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
      values.$members.0:
-        "0xb23794fd6BA1CEAd01Cf54D772b8341F2F0197A5"
+        "eth:0xb23794fd6BA1CEAd01Cf54D772b8341F2F0197A5"
      values.$members.1:
-        "0x4665374939642965EfD8357D4568D2A77f677429"
+        "eth:0x4665374939642965EfD8357D4568D2A77f677429"
      implementationNames.0x42d27eEA1AD6e22Af6284F609847CB3Cd56B9c64:
-        "GnosisSafeProxy"
      implementationNames.0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
-        "GnosisSafe"
      implementationNames.eth:0x42d27eEA1AD6e22Af6284F609847CB3Cd56B9c64:
+        "GnosisSafeProxy"
      implementationNames.eth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
+        "GnosisSafe"
    }
```

```diff
    EOA  (0x4665374939642965EfD8357D4568D2A77f677429) {
    +++ description: None
      address:
-        "0x4665374939642965EfD8357D4568D2A77f677429"
+        "eth:0x4665374939642965EfD8357D4568D2A77f677429"
    }
```

```diff
    contract L1DAIEscrow (0x467194771dAe2967Aef3ECbEDD3Bf9a310C76C65) {
    +++ description: Stores DAI deposited from the attached L1DAITokenBridge.
      address:
-        "0x467194771dAe2967Aef3ECbEDD3Bf9a310C76C65"
+        "eth:0x467194771dAe2967Aef3ECbEDD3Bf9a310C76C65"
      values.wards.0:
-        "0xBE8E3e3618f7474F8cB1d074A26afFef007E98FB"
+        "eth:0xBE8E3e3618f7474F8cB1d074A26afFef007E98FB"
      values.wards.1:
-        "0x09e05fF6142F2f9de8B6B65855A1d56B6cfE4c58"
+        "eth:0x09e05fF6142F2f9de8B6B65855A1d56B6cfE4c58"
      implementationNames.0x467194771dAe2967Aef3ECbEDD3Bf9a310C76C65:
-        "L1Escrow"
      implementationNames.eth:0x467194771dAe2967Aef3ECbEDD3Bf9a310C76C65:
+        "L1Escrow"
    }
```

```diff
    EOA  (0x473300df21D047806A082244b417f96b32f13A33) {
    +++ description: None
      address:
-        "0x473300df21D047806A082244b417f96b32f13A33"
+        "eth:0x473300df21D047806A082244b417f96b32f13A33"
    }
```

```diff
    EOA  (0x4A7322258c9E690e4CB8Cea6e5251443E956e61E) {
    +++ description: None
      address:
-        "0x4A7322258c9E690e4CB8Cea6e5251443E956e61E"
+        "eth:0x4A7322258c9E690e4CB8Cea6e5251443E956e61E"
    }
```

```diff
    EOA  (0x4D014f3c5F33Aa9Cd1Dc29ce29618d07Ae666d15) {
    +++ description: None
      address:
-        "0x4D014f3c5F33Aa9Cd1Dc29ce29618d07Ae666d15"
+        "eth:0x4D014f3c5F33Aa9Cd1Dc29ce29618d07Ae666d15"
    }
```

```diff
    EOA  (0x51aCb8e1205De850D1b512584FeE9C29C3813dDa) {
    +++ description: None
      address:
-        "0x51aCb8e1205De850D1b512584FeE9C29C3813dDa"
+        "eth:0x51aCb8e1205De850D1b512584FeE9C29C3813dDa"
    }
```

```diff
    contract SuperchainProxyAdmin (0x543bA4AADBAb8f9025686Bd03993043599c6fB04) {
    +++ description: None
      address:
-        "0x543bA4AADBAb8f9025686Bd03993043599c6fB04"
+        "eth:0x543bA4AADBAb8f9025686Bd03993043599c6fB04"
      values.addressManager:
-        "0xdE1FCfB0851916CA5101820A69b13a4E276bd81F"
+        "eth:0xdE1FCfB0851916CA5101820A69b13a4E276bd81F"
      values.owner:
-        "0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A"
+        "eth:0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A"
      implementationNames.0x543bA4AADBAb8f9025686Bd03993043599c6fB04:
-        "ProxyAdmin"
      implementationNames.eth:0x543bA4AADBAb8f9025686Bd03993043599c6fB04:
+        "ProxyAdmin"
    }
```

```diff
    contract SuperchainProxyAdminOwner (0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A) {
    +++ description: None
      address:
-        "0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A"
+        "eth:0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A"
      values.$implementation:
-        "0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
+        "eth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
      values.$members.0:
-        "0x847B5c174615B1B7fDF770882256e2D3E95b9D92"
+        "eth:0x847B5c174615B1B7fDF770882256e2D3E95b9D92"
      values.$members.1:
-        "0xc2819DC788505Aac350142A7A707BF9D03E3Bd03"
+        "eth:0xc2819DC788505Aac350142A7A707BF9D03E3Bd03"
      implementationNames.0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A:
-        "GnosisSafeProxy"
      implementationNames.0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
-        "GnosisSafe"
      implementationNames.eth:0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A:
+        "GnosisSafeProxy"
      implementationNames.eth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
+        "GnosisSafe"
    }
```

```diff
    contract L1ERC721Bridge (0x5a7749f83b81B301cAb5f48EB8516B986DAef23D) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      address:
-        "0x5a7749f83b81B301cAb5f48EB8516B986DAef23D"
+        "eth:0x5a7749f83b81B301cAb5f48EB8516B986DAef23D"
      values.$admin:
-        "0x543bA4AADBAb8f9025686Bd03993043599c6fB04"
+        "eth:0x543bA4AADBAb8f9025686Bd03993043599c6fB04"
      values.$implementation:
-        "0x7aE1d3BD877a4C5CA257404ce26BE93A02C98013"
+        "eth:0x7aE1d3BD877a4C5CA257404ce26BE93A02C98013"
      values.$pastUpgrades.0.2.0:
-        "0x3268Ed09f76e619331528270B6267D4d2C5Ab5C2"
+        "eth:0x3268Ed09f76e619331528270B6267D4d2C5Ab5C2"
      values.$pastUpgrades.1.2.0:
-        "0x3268Ed09f76e619331528270B6267D4d2C5Ab5C2"
+        "eth:0x3268Ed09f76e619331528270B6267D4d2C5Ab5C2"
      values.$pastUpgrades.2.2.0:
-        "0xd81f43eDBCAcb4c29a9bA38a13Ee5d79278270cC"
+        "eth:0xd81f43eDBCAcb4c29a9bA38a13Ee5d79278270cC"
      values.$pastUpgrades.3.2.0:
-        "0xc599Fa757c2bCaA5aE3753Ab129237F38C10da0b"
+        "eth:0xc599Fa757c2bCaA5aE3753Ab129237F38C10da0b"
      values.$pastUpgrades.4.2.0:
-        "0xd81f43eDBCAcb4c29a9bA38a13Ee5d79278270cC"
+        "eth:0xd81f43eDBCAcb4c29a9bA38a13Ee5d79278270cC"
      values.$pastUpgrades.5.2.0:
-        "0xAE2AF01232a6c4a4d3012C5eC5b1b35059caF10d"
+        "eth:0xAE2AF01232a6c4a4d3012C5eC5b1b35059caF10d"
      values.$pastUpgrades.6.2.0:
-        "0x276d3730f219f7ec22274f7263180b8452B46d47"
+        "eth:0x276d3730f219f7ec22274f7263180b8452B46d47"
      values.$pastUpgrades.7.2.0:
-        "0x7aE1d3BD877a4C5CA257404ce26BE93A02C98013"
+        "eth:0x7aE1d3BD877a4C5CA257404ce26BE93A02C98013"
      values.messenger:
-        "0x25ace71c97B33Cc4729CF772ae268934F7ab5fA1"
+        "eth:0x25ace71c97B33Cc4729CF772ae268934F7ab5fA1"
      values.MESSENGER:
-        "0x25ace71c97B33Cc4729CF772ae268934F7ab5fA1"
+        "eth:0x25ace71c97B33Cc4729CF772ae268934F7ab5fA1"
      values.superchainConfig:
-        "0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
+        "eth:0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
      implementationNames.0x5a7749f83b81B301cAb5f48EB8516B986DAef23D:
-        "Proxy"
      implementationNames.0x7aE1d3BD877a4C5CA257404ce26BE93A02C98013:
-        "L1ERC721Bridge"
      implementationNames.eth:0x5a7749f83b81B301cAb5f48EB8516B986DAef23D:
+        "Proxy"
      implementationNames.eth:0x7aE1d3BD877a4C5CA257404ce26BE93A02C98013:
+        "L1ERC721Bridge"
    }
```

```diff
    contract SynthetixBridgeEscrow (0x5Fd79D46EBA7F351fe49BFF9E87cdeA6c821eF9f) {
    +++ description: Custom escrow for SNX bridged via canonical messaging.
      address:
-        "0x5Fd79D46EBA7F351fe49BFF9E87cdeA6c821eF9f"
+        "eth:0x5Fd79D46EBA7F351fe49BFF9E87cdeA6c821eF9f"
      values.nominatedOwner:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.owner:
-        "0xEb3107117FEAd7de89Cd14D463D340A2E6917769"
+        "eth:0xEb3107117FEAd7de89Cd14D463D340A2E6917769"
      implementationNames.0x5Fd79D46EBA7F351fe49BFF9E87cdeA6c821eF9f:
-        "SynthetixBridgeEscrow"
      implementationNames.eth:0x5Fd79D46EBA7F351fe49BFF9E87cdeA6c821eF9f:
+        "SynthetixBridgeEscrow"
    }
```

```diff
    EOA  (0x6323ef2b80030f3fBc508bFc321Fc71fDB95c865) {
    +++ description: None
      address:
-        "0x6323ef2b80030f3fBc508bFc321Fc71fDB95c865"
+        "eth:0x6323ef2b80030f3fBc508bFc321Fc71fDB95c865"
    }
```

```diff
    EOA  (0x652BC529E171847E2fFddCeA13567643C84ccB5f) {
    +++ description: None
      address:
-        "0x652BC529E171847E2fFddCeA13567643C84ccB5f"
+        "eth:0x652BC529E171847E2fFddCeA13567643C84ccB5f"
    }
```

```diff
    EOA  (0x6887246668a3b87F54DeB3b94Ba47a6f63F32985) {
    +++ description: None
      address:
-        "0x6887246668a3b87F54DeB3b94Ba47a6f63F32985"
+        "eth:0x6887246668a3b87F54DeB3b94Ba47a6f63F32985"
    }
```

```diff
    contract OptimismMintableERC20Factory (0x75505a97BD334E7BD3C476893285569C4136Fa0F) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintableERC20 as this chain's representation of a token on the host chain, or vice-versa.
      address:
-        "0x75505a97BD334E7BD3C476893285569C4136Fa0F"
+        "eth:0x75505a97BD334E7BD3C476893285569C4136Fa0F"
      values.$admin:
-        "0x543bA4AADBAb8f9025686Bd03993043599c6fB04"
+        "eth:0x543bA4AADBAb8f9025686Bd03993043599c6fB04"
      values.$implementation:
-        "0x5493f4677A186f64805fe7317D6993ba4863988F"
+        "eth:0x5493f4677A186f64805fe7317D6993ba4863988F"
      values.$pastUpgrades.0.2.0:
-        "0xaE849EFA4BcFc419593420e14707996936E365E2"
+        "eth:0xaE849EFA4BcFc419593420e14707996936E365E2"
      values.$pastUpgrades.1.2.0:
-        "0xd81f43eDBCAcb4c29a9bA38a13Ee5d79278270cC"
+        "eth:0xd81f43eDBCAcb4c29a9bA38a13Ee5d79278270cC"
      values.$pastUpgrades.2.2.0:
-        "0x74e273220Fa1cB62Fd756FE6CbDA8BBb89404deD"
+        "eth:0x74e273220Fa1cB62Fd756FE6CbDA8BBb89404deD"
      values.$pastUpgrades.3.2.0:
-        "0xd81f43eDBCAcb4c29a9bA38a13Ee5d79278270cC"
+        "eth:0xd81f43eDBCAcb4c29a9bA38a13Ee5d79278270cC"
      values.$pastUpgrades.4.2.0:
-        "0xE01efbeb1089D1d1dB9c6c8b135C934C0734c846"
+        "eth:0xE01efbeb1089D1d1dB9c6c8b135C934C0734c846"
      values.$pastUpgrades.5.2.0:
-        "0x5493f4677A186f64805fe7317D6993ba4863988F"
+        "eth:0x5493f4677A186f64805fe7317D6993ba4863988F"
      values.bridge:
-        "0x99C9fc46f92E8a1c0deC1b1747d010903E884bE1"
+        "eth:0x99C9fc46f92E8a1c0deC1b1747d010903E884bE1"
      values.BRIDGE:
-        "0x99C9fc46f92E8a1c0deC1b1747d010903E884bE1"
+        "eth:0x99C9fc46f92E8a1c0deC1b1747d010903E884bE1"
      implementationNames.0x75505a97BD334E7BD3C476893285569C4136Fa0F:
-        "Proxy"
      implementationNames.0x5493f4677A186f64805fe7317D6993ba4863988F:
-        "OptimismMintableERC20Factory"
      implementationNames.eth:0x75505a97BD334E7BD3C476893285569C4136Fa0F:
+        "Proxy"
      implementationNames.eth:0x5493f4677A186f64805fe7317D6993ba4863988F:
+        "OptimismMintableERC20Factory"
    }
```

```diff
    contract wstETHEscrow (0x76943C0D61395d8F2edF9060e1533529cAe05dE6) {
    +++ description: Lido custom escrow for wstETH tokens that uses the canonical bridge for messaging but is governed externally.
      address:
-        "0x76943C0D61395d8F2edF9060e1533529cAe05dE6"
+        "eth:0x76943C0D61395d8F2edF9060e1533529cAe05dE6"
      values.$admin:
-        "0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c"
+        "eth:0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c"
      values.$implementation:
-        "0x168Cfea1Ad879d7032B3936eF3b0E90790b6B6D4"
+        "eth:0x168Cfea1Ad879d7032B3936eF3b0E90790b6B6D4"
      values.$pastUpgrades.0.2.0:
-        "0x29C5c51A031165CE62F964966A6399b81165EFA4"
+        "eth:0x29C5c51A031165CE62F964966A6399b81165EFA4"
      values.$pastUpgrades.1.2.0:
-        "0x168Cfea1Ad879d7032B3936eF3b0E90790b6B6D4"
+        "eth:0x168Cfea1Ad879d7032B3936eF3b0E90790b6B6D4"
      values.accesscontrol.DEFAULT_ADMIN_ROLE.members.0:
-        "0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c"
+        "eth:0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c"
      values.accesscontrol.0x4b43b36766bde12c5e9cbbc37d15f8d1f769f08f54720ab370faeb4ce893753a.members.0:
-        "0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c"
+        "eth:0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c"
      values.accesscontrol.0x63f736f21cb2943826cd50b191eb054ebbea670e4e962d0527611f830cd399d6.members.0:
-        "0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c"
+        "eth:0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c"
      values.accesscontrol.0x63f736f21cb2943826cd50b191eb054ebbea670e4e962d0527611f830cd399d6.members.1:
-        "0x73b047fe6337183A454c5217241D780a932777bD"
+        "eth:0x73b047fe6337183A454c5217241D780a932777bD"
      values.accesscontrol.0x9ab8816a3dc0b3849ec1ac00483f6ec815b07eee2fd766a353311c823ad59d0d.members.0:
-        "0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c"
+        "eth:0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c"
      values.accesscontrol.0x94a954c0bc99227eddbc0715a62a7e1056ed8784cd719c2303b685683908857c.members.0:
-        "0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c"
+        "eth:0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c"
      values.accesscontrol.0x94a954c0bc99227eddbc0715a62a7e1056ed8784cd719c2303b685683908857c.members.1:
-        "0x73b047fe6337183A454c5217241D780a932777bD"
+        "eth:0x73b047fe6337183A454c5217241D780a932777bD"
      values.ACCOUNTING_ORACLE:
-        "0x852deD011285fe67063a08005c71a85690503Cee"
+        "eth:0x852deD011285fe67063a08005c71a85690503Cee"
      values.L1_TOKEN_NON_REBASABLE:
-        "0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0"
+        "eth:0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0"
      values.L1_TOKEN_REBASABLE:
-        "0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84"
+        "eth:0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84"
      values.L2_TOKEN_NON_REBASABLE:
-        "0x1F32b1c2345538c0c6f582fCB022739c4A194Ebb"
+        "eth:0x1F32b1c2345538c0c6f582fCB022739c4A194Ebb"
      values.L2_TOKEN_REBASABLE:
-        "0x76A50b8c7349cCDDb7578c6627e79b5d99D24138"
+        "eth:0x76A50b8c7349cCDDb7578c6627e79b5d99D24138"
      values.l2TokenBridge:
-        "0x8E01013243a96601a86eb3153F0d9Fa4fbFb6957"
+        "eth:0x8E01013243a96601a86eb3153F0d9Fa4fbFb6957"
      values.MESSENGER:
-        "0x25ace71c97B33Cc4729CF772ae268934F7ab5fA1"
+        "eth:0x25ace71c97B33Cc4729CF772ae268934F7ab5fA1"
      values.proxy__getAdmin:
-        "0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c"
+        "eth:0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c"
      values.proxy__getImplementation:
-        "0x168Cfea1Ad879d7032B3936eF3b0E90790b6B6D4"
+        "eth:0x168Cfea1Ad879d7032B3936eF3b0E90790b6B6D4"
      values.WSTETH:
-        "0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0"
+        "eth:0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0"
      implementationNames.0x76943C0D61395d8F2edF9060e1533529cAe05dE6:
-        "OssifiableProxy"
      implementationNames.0x168Cfea1Ad879d7032B3936eF3b0E90790b6B6D4:
-        "L1LidoTokensBridge"
      implementationNames.eth:0x76943C0D61395d8F2edF9060e1533529cAe05dE6:
+        "OssifiableProxy"
      implementationNames.eth:0x168Cfea1Ad879d7032B3936eF3b0E90790b6B6D4:
+        "L1LidoTokensBridge"
    }
```

```diff
    EOA  (0x7cB07FE039a92B3D784f284D919503A381BEC54f) {
    +++ description: None
      address:
-        "0x7cB07FE039a92B3D784f284D919503A381BEC54f"
+        "eth:0x7cB07FE039a92B3D784f284D919503A381BEC54f"
    }
```

```diff
    EOA  (0x7ed8d9Af9eaA194D1A75C67c1475579E42289E39) {
    +++ description: None
      address:
-        "0x7ed8d9Af9eaA194D1A75C67c1475579E42289E39"
+        "eth:0x7ed8d9Af9eaA194D1A75C67c1475579E42289E39"
    }
```

```diff
    contract OpFoundationUpgradeSafe (0x847B5c174615B1B7fDF770882256e2D3E95b9D92) {
    +++ description: None
      address:
-        "0x847B5c174615B1B7fDF770882256e2D3E95b9D92"
+        "eth:0x847B5c174615B1B7fDF770882256e2D3E95b9D92"
      receivedPermissions.0.via.2.condition:
-        "if the number of 0xc2819DC788505Aac350142A7A707BF9D03E3Bd03 members falls below 8."
+        "if the number of eth:0xc2819DC788505Aac350142A7A707BF9D03E3Bd03 members falls below 8."
      directlyReceivedPermissions.0.condition:
-        "if the number of 0xc2819DC788505Aac350142A7A707BF9D03E3Bd03 members falls below 8."
+        "if the number of eth:0xc2819DC788505Aac350142A7A707BF9D03E3Bd03 members falls below 8."
      directlyReceivedPermissions.0.description:
-        "takes ownership of 0xc2819DC788505Aac350142A7A707BF9D03E3Bd03"
+        "takes ownership of eth:0xc2819DC788505Aac350142A7A707BF9D03E3Bd03"
      values.$implementation:
-        "0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
+        "eth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
      values.$members.0:
-        "0x42d27eEA1AD6e22Af6284F609847CB3Cd56B9c64"
+        "eth:0x42d27eEA1AD6e22Af6284F609847CB3Cd56B9c64"
      values.$members.1:
-        "0x3041BA32f451F5850c147805F5521AC206421623"
+        "eth:0x3041BA32f451F5850c147805F5521AC206421623"
      values.$members.2:
-        "0xE7dEA1306D9F829bA469d1904c50903b46ebd02e"
+        "eth:0xE7dEA1306D9F829bA469d1904c50903b46ebd02e"
      values.$members.3:
-        "0xBF93D4d727F7Ba1F753E1124C3e532dCb04Ea2c8"
+        "eth:0xBF93D4d727F7Ba1F753E1124C3e532dCb04Ea2c8"
      values.$members.4:
-        "0x4D014f3c5F33Aa9Cd1Dc29ce29618d07Ae666d15"
+        "eth:0x4D014f3c5F33Aa9Cd1Dc29ce29618d07Ae666d15"
      values.$members.5:
-        "0x7cB07FE039a92B3D784f284D919503A381BEC54f"
+        "eth:0x7cB07FE039a92B3D784f284D919503A381BEC54f"
      values.$members.6:
-        "0x9bbFB9919062C29a5eE15aCD93c9D7c3b14d31aa"
+        "eth:0x9bbFB9919062C29a5eE15aCD93c9D7c3b14d31aa"
      implementationNames.0x847B5c174615B1B7fDF770882256e2D3E95b9D92:
-        "GnosisSafeProxy"
      implementationNames.0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
-        "GnosisSafe"
      implementationNames.eth:0x847B5c174615B1B7fDF770882256e2D3E95b9D92:
+        "GnosisSafeProxy"
      implementationNames.eth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
+        "GnosisSafe"
    }
```

```diff
    contract FaultDisputeGame (0x89D68b1D63AAA0db4af1163e81f56B76934292F8) {
    +++ description: Logic of the dispute game. When a state root is proposed, a dispute game contract is deployed. Challengers can use such contracts to challenge the proposed state root.
      address:
-        "0x89D68b1D63AAA0db4af1163e81f56B76934292F8"
+        "eth:0x89D68b1D63AAA0db4af1163e81f56B76934292F8"
      values.anchorStateRegistry:
-        "0x1c68ECfbf9C8B1E6C0677965b3B9Ecf9A104305b"
+        "eth:0x1c68ECfbf9C8B1E6C0677965b3B9Ecf9A104305b"
      values.gameCreator:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.l2BlockNumberChallenger:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.vm:
-        "0xF027F4A985560fb13324e943edf55ad6F1d15Dc1"
+        "eth:0xF027F4A985560fb13324e943edf55ad6F1d15Dc1"
      values.weth:
-        "0x323dFC63c9B83CB83f40325AaB74b245937cbdF0"
+        "eth:0x323dFC63c9B83CB83f40325AaB74b245937cbdF0"
      implementationNames.0x89D68b1D63AAA0db4af1163e81f56B76934292F8:
-        "FaultDisputeGame"
      implementationNames.eth:0x89D68b1D63AAA0db4af1163e81f56B76934292F8:
+        "FaultDisputeGame"
    }
```

```diff
    EOA  (0x92827223f6b397CE9F208eE352bacA710765cACb) {
    +++ description: None
      address:
-        "0x92827223f6b397CE9F208eE352bacA710765cACb"
+        "eth:0x92827223f6b397CE9F208eE352bacA710765cACb"
    }
```

```diff
    contract SuperchainConfig (0x95703e0982140D16f8ebA6d158FccEde42f04a4C) {
    +++ description: Used to manage global configuration values for multiple OP Chains within a single Superchain network. The SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the Superchain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      address:
-        "0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
+        "eth:0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
      values.$admin:
-        "0x543bA4AADBAb8f9025686Bd03993043599c6fB04"
+        "eth:0x543bA4AADBAb8f9025686Bd03993043599c6fB04"
      values.$implementation:
-        "0x4da82a327773965b8d4D85Fa3dB8249b387458E7"
+        "eth:0x4da82a327773965b8d4D85Fa3dB8249b387458E7"
      values.$pastUpgrades.0.2.0:
-        "0x53c165169401764778F780a69701385eb0FF19B7"
+        "eth:0x53c165169401764778F780a69701385eb0FF19B7"
      values.$pastUpgrades.1.2.0:
-        "0xd81f43eDBCAcb4c29a9bA38a13Ee5d79278270cC"
+        "eth:0xd81f43eDBCAcb4c29a9bA38a13Ee5d79278270cC"
      values.$pastUpgrades.2.2.0:
-        "0x53c165169401764778F780a69701385eb0FF19B7"
+        "eth:0x53c165169401764778F780a69701385eb0FF19B7"
      values.$pastUpgrades.3.2.0:
-        "0x4da82a327773965b8d4D85Fa3dB8249b387458E7"
+        "eth:0x4da82a327773965b8d4D85Fa3dB8249b387458E7"
      values.guardian:
-        "0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2"
+        "eth:0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2"
      implementationNames.0x95703e0982140D16f8ebA6d158FccEde42f04a4C:
-        "Proxy"
      implementationNames.0x4da82a327773965b8d4D85Fa3dB8249b387458E7:
-        "SuperchainConfig"
      implementationNames.eth:0x95703e0982140D16f8ebA6d158FccEde42f04a4C:
+        "Proxy"
      implementationNames.eth:0x4da82a327773965b8d4D85Fa3dB8249b387458E7:
+        "SuperchainConfig"
    }
```

```diff
    contract L1StandardBridge (0x99C9fc46f92E8a1c0deC1b1747d010903E884bE1) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      address:
-        "0x99C9fc46f92E8a1c0deC1b1747d010903E884bE1"
+        "eth:0x99C9fc46f92E8a1c0deC1b1747d010903E884bE1"
      values.$admin:
-        "0x543bA4AADBAb8f9025686Bd03993043599c6fB04"
+        "eth:0x543bA4AADBAb8f9025686Bd03993043599c6fB04"
      values.$implementation:
-        "0x0b09ba359A106C9ea3b181CBc5F394570c7d2a7A"
+        "eth:0x0b09ba359A106C9ea3b181CBc5F394570c7d2a7A"
      values.messenger:
-        "0x25ace71c97B33Cc4729CF772ae268934F7ab5fA1"
+        "eth:0x25ace71c97B33Cc4729CF772ae268934F7ab5fA1"
      values.MESSENGER:
-        "0x25ace71c97B33Cc4729CF772ae268934F7ab5fA1"
+        "eth:0x25ace71c97B33Cc4729CF772ae268934F7ab5fA1"
      values.superchainConfig:
-        "0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
+        "eth:0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
      implementationNames.0x99C9fc46f92E8a1c0deC1b1747d010903E884bE1:
-        "L1ChugSplashProxy"
      implementationNames.0x0b09ba359A106C9ea3b181CBc5F394570c7d2a7A:
-        "L1StandardBridge"
      implementationNames.eth:0x99C9fc46f92E8a1c0deC1b1747d010903E884bE1:
+        "L1ChugSplashProxy"
      implementationNames.eth:0x0b09ba359A106C9ea3b181CBc5F394570c7d2a7A:
+        "L1StandardBridge"
    }
```

```diff
    contract OpFoundationOperationsSafe (0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A) {
    +++ description: None
      address:
-        "0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A"
+        "eth:0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A"
      values.$implementation:
-        "0x34CfAC646f301356fAa8B21e94227e3583Fe3F5F"
+        "eth:0x34CfAC646f301356fAa8B21e94227e3583Fe3F5F"
      values.$members.0:
-        "0x42d27eEA1AD6e22Af6284F609847CB3Cd56B9c64"
+        "eth:0x42d27eEA1AD6e22Af6284F609847CB3Cd56B9c64"
      values.$members.1:
-        "0x3041BA32f451F5850c147805F5521AC206421623"
+        "eth:0x3041BA32f451F5850c147805F5521AC206421623"
      values.$members.2:
-        "0xE7dEA1306D9F829bA469d1904c50903b46ebd02e"
+        "eth:0xE7dEA1306D9F829bA469d1904c50903b46ebd02e"
      values.$members.3:
-        "0xBF93D4d727F7Ba1F753E1124C3e532dCb04Ea2c8"
+        "eth:0xBF93D4d727F7Ba1F753E1124C3e532dCb04Ea2c8"
      values.$members.4:
-        "0x4D014f3c5F33Aa9Cd1Dc29ce29618d07Ae666d15"
+        "eth:0x4D014f3c5F33Aa9Cd1Dc29ce29618d07Ae666d15"
      values.$members.5:
-        "0x7cB07FE039a92B3D784f284D919503A381BEC54f"
+        "eth:0x7cB07FE039a92B3D784f284D919503A381BEC54f"
      values.$members.6:
-        "0x9bbFB9919062C29a5eE15aCD93c9D7c3b14d31aa"
+        "eth:0x9bbFB9919062C29a5eE15aCD93c9D7c3b14d31aa"
      values.getModules.0:
-        "0x126a736B18E0a64fBA19D421647A530E327E112C"
+        "eth:0x126a736B18E0a64fBA19D421647A530E327E112C"
      values.GnosisSafe_modules.0:
-        "0x126a736B18E0a64fBA19D421647A530E327E112C"
+        "eth:0x126a736B18E0a64fBA19D421647A530E327E112C"
      implementationNames.0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A:
-        "Proxy"
      implementationNames.0x34CfAC646f301356fAa8B21e94227e3583Fe3F5F:
-        "GnosisSafe"
      implementationNames.eth:0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A:
+        "Proxy"
      implementationNames.eth:0x34CfAC646f301356fAa8B21e94227e3583Fe3F5F:
+        "GnosisSafe"
    }
```

```diff
    EOA  (0x9bbFB9919062C29a5eE15aCD93c9D7c3b14d31aa) {
    +++ description: None
      address:
-        "0x9bbFB9919062C29a5eE15aCD93c9D7c3b14d31aa"
+        "eth:0x9bbFB9919062C29a5eE15aCD93c9D7c3b14d31aa"
    }
```

```diff
    EOA  (0x9Eb11A55132c851b9991F148b3Af791ca498fD7A) {
    +++ description: None
      address:
-        "0x9Eb11A55132c851b9991F148b3Af791ca498fD7A"
+        "eth:0x9Eb11A55132c851b9991F148b3Af791ca498fD7A"
    }
```

```diff
    contract PermissionedDisputeGame (0xa1E0baCde89d899B3f24eEF3D179cC335A24E777) {
    +++ description: Same as FaultDisputeGame, but only two permissioned addresses are designated as proposer and challenger.
      address:
-        "0xa1E0baCde89d899B3f24eEF3D179cC335A24E777"
+        "eth:0xa1E0baCde89d899B3f24eEF3D179cC335A24E777"
      values.anchorStateRegistry:
-        "0x1c68ECfbf9C8B1E6C0677965b3B9Ecf9A104305b"
+        "eth:0x1c68ECfbf9C8B1E6C0677965b3B9Ecf9A104305b"
      values.challenger:
-        "0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A"
+        "eth:0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A"
      values.gameCreator:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.l2BlockNumberChallenger:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.proposer:
-        "0x473300df21D047806A082244b417f96b32f13A33"
+        "eth:0x473300df21D047806A082244b417f96b32f13A33"
      values.vm:
-        "0xF027F4A985560fb13324e943edf55ad6F1d15Dc1"
+        "eth:0xF027F4A985560fb13324e943edf55ad6F1d15Dc1"
      values.weth:
-        "0x21429aF66058BC3e4aE4a8f2EC4531AaC433ecbC"
+        "eth:0x21429aF66058BC3e4aE4a8f2EC4531AaC433ecbC"
      implementationNames.0xa1E0baCde89d899B3f24eEF3D179cC335A24E777:
-        "PermissionedDisputeGame"
      implementationNames.eth:0xa1E0baCde89d899B3f24eEF3D179cC335A24E777:
+        "PermissionedDisputeGame"
    }
```

```diff
    contract FeesCollector (0xa3d596EAfaB6B13Ab18D40FaE1A962700C84ADEa) {
    +++ description: Collecting sequencer, base- and L1 fees from L2.
      address:
-        "0xa3d596EAfaB6B13Ab18D40FaE1A962700C84ADEa"
+        "eth:0xa3d596EAfaB6B13Ab18D40FaE1A962700C84ADEa"
      values.$implementation:
-        "0xE8E847cf573Fc8ed75621660A36AffD18c543d7E"
+        "eth:0xE8E847cf573Fc8ed75621660A36AffD18c543d7E"
      implementationNames.0xa3d596EAfaB6B13Ab18D40FaE1A962700C84ADEa:
-        "WalletSimple"
      implementationNames.0xE8E847cf573Fc8ed75621660A36AffD18c543d7E:
-        "WalletSimple"
      implementationNames.eth:0xa3d596EAfaB6B13Ab18D40FaE1A962700C84ADEa:
+        "WalletSimple"
      implementationNames.eth:0xE8E847cf573Fc8ed75621660A36AffD18c543d7E:
+        "WalletSimple"
    }
```

```diff
    EOA  (0xAAAA45d9549EDA09E70937013520214382Ffc4A2) {
    +++ description: None
      address:
-        "0xAAAA45d9549EDA09E70937013520214382Ffc4A2"
+        "eth:0xAAAA45d9549EDA09E70937013520214382Ffc4A2"
    }
```

```diff
    EOA  (0xb23794fd6BA1CEAd01Cf54D772b8341F2F0197A5) {
    +++ description: None
      address:
-        "0xb23794fd6BA1CEAd01Cf54D772b8341F2F0197A5"
+        "eth:0xb23794fd6BA1CEAd01Cf54D772b8341F2F0197A5"
    }
```

```diff
    contract OptimismPortal2 (0xbEb5Fc579115071764c7423A4f12eDde41f106Ed) {
    +++ description: The OptimismPortal contract is the main entry point to deposit funds from L1 to L2. It also allows to prove and finalize withdrawals. It specifies which game type can be used for withdrawals, which currently is the FaultDisputeGame.
      address:
-        "0xbEb5Fc579115071764c7423A4f12eDde41f106Ed"
+        "eth:0xbEb5Fc579115071764c7423A4f12eDde41f106Ed"
      values.$admin:
-        "0x543bA4AADBAb8f9025686Bd03993043599c6fB04"
+        "eth:0x543bA4AADBAb8f9025686Bd03993043599c6fB04"
      values.$implementation:
-        "0xB443Da3e07052204A02d630a8933dAc05a0d6fB4"
+        "eth:0xB443Da3e07052204A02d630a8933dAc05a0d6fB4"
      values.$pastUpgrades.0.2.0:
-        "0x28a55488fef40005309e2DA0040DbE9D300a64AB"
+        "eth:0x28a55488fef40005309e2DA0040DbE9D300a64AB"
      values.$pastUpgrades.1.2.0:
-        "0xd81f43eDBCAcb4c29a9bA38a13Ee5d79278270cC"
+        "eth:0xd81f43eDBCAcb4c29a9bA38a13Ee5d79278270cC"
      values.$pastUpgrades.2.2.0:
-        "0xaBAbe63514dDd6277356F8cc3d6518aA8BDEB4de"
+        "eth:0xaBAbe63514dDd6277356F8cc3d6518aA8BDEB4de"
      values.$pastUpgrades.3.2.0:
-        "0xd81f43eDBCAcb4c29a9bA38a13Ee5d79278270cC"
+        "eth:0xd81f43eDBCAcb4c29a9bA38a13Ee5d79278270cC"
      values.$pastUpgrades.4.2.0:
-        "0x2D778797049FE9259d947D1ED8e5442226dFB589"
+        "eth:0x2D778797049FE9259d947D1ED8e5442226dFB589"
      values.$pastUpgrades.5.2.0:
-        "0xd81f43eDBCAcb4c29a9bA38a13Ee5d79278270cC"
+        "eth:0xd81f43eDBCAcb4c29a9bA38a13Ee5d79278270cC"
      values.$pastUpgrades.6.2.0:
-        "0xe2F826324b2faf99E513D16D266c3F80aE87832B"
+        "eth:0xe2F826324b2faf99E513D16D266c3F80aE87832B"
      values.$pastUpgrades.7.2.0:
-        "0x2D7e764a0D9919e16983a46595CfA81fc34fa7Cd"
+        "eth:0x2D7e764a0D9919e16983a46595CfA81fc34fa7Cd"
      values.$pastUpgrades.8.2.0:
-        "0xB443Da3e07052204A02d630a8933dAc05a0d6fB4"
+        "eth:0xB443Da3e07052204A02d630a8933dAc05a0d6fB4"
      values.disputeGameFactory:
-        "0xe5965Ab5962eDc7477C8520243A95517CD252fA9"
+        "eth:0xe5965Ab5962eDc7477C8520243A95517CD252fA9"
      values.guardian:
-        "0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2"
+        "eth:0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2"
      values.l2Sender:
-        "0x000000000000000000000000000000000000dEaD"
+        "eth:0x000000000000000000000000000000000000dEaD"
      values.superchainConfig:
-        "0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
+        "eth:0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
      values.systemConfig:
-        "0x229047fed2591dbec1eF1118d64F7aF3dB9EB290"
+        "eth:0x229047fed2591dbec1eF1118d64F7aF3dB9EB290"
      implementationNames.0xbEb5Fc579115071764c7423A4f12eDde41f106Ed:
-        "Proxy"
      implementationNames.0xB443Da3e07052204A02d630a8933dAc05a0d6fB4:
-        "OptimismPortal2"
      implementationNames.eth:0xbEb5Fc579115071764c7423A4f12eDde41f106Ed:
+        "Proxy"
      implementationNames.eth:0xB443Da3e07052204A02d630a8933dAc05a0d6fB4:
+        "OptimismPortal2"
    }
```

```diff
    EOA  (0xBF93D4d727F7Ba1F753E1124C3e532dCb04Ea2c8) {
    +++ description: None
      address:
-        "0xBF93D4d727F7Ba1F753E1124C3e532dCb04Ea2c8"
+        "eth:0xBF93D4d727F7Ba1F753E1124C3e532dCb04Ea2c8"
    }
```

```diff
    EOA  (0xbfA046B0bc5cEa1596be62B8b3f79f9f41f1E0d9) {
    +++ description: None
      address:
-        "0xbfA046B0bc5cEa1596be62B8b3f79f9f41f1E0d9"
+        "eth:0xbfA046B0bc5cEa1596be62B8b3f79f9f41f1E0d9"
    }
```

```diff
    contract Optimism Security Council (0xc2819DC788505Aac350142A7A707BF9D03E3Bd03) {
    +++ description: None
      address:
-        "0xc2819DC788505Aac350142A7A707BF9D03E3Bd03"
+        "eth:0xc2819DC788505Aac350142A7A707BF9D03E3Bd03"
      values.$implementation:
-        "0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
+        "eth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
      values.$members.0:
-        "0x07dC0893cAfbF810e3E72505041f2865726Fd073"
+        "eth:0x07dC0893cAfbF810e3E72505041f2865726Fd073"
      values.$members.1:
-        "0x652BC529E171847E2fFddCeA13567643C84ccB5f"
+        "eth:0x652BC529E171847E2fFddCeA13567643C84ccB5f"
      values.$members.2:
-        "0x1822b35B09f5ce1C78ecbC06AC0A4e17885b925e"
+        "eth:0x1822b35B09f5ce1C78ecbC06AC0A4e17885b925e"
      values.$members.3:
-        "0x4A7322258c9E690e4CB8Cea6e5251443E956e61E"
+        "eth:0x4A7322258c9E690e4CB8Cea6e5251443E956e61E"
      values.$members.4:
-        "0x51aCb8e1205De850D1b512584FeE9C29C3813dDa"
+        "eth:0x51aCb8e1205De850D1b512584FeE9C29C3813dDa"
      values.$members.5:
-        "0xEF9A98511939eEe6Ec69af62082E3F2ff606877c"
+        "eth:0xEF9A98511939eEe6Ec69af62082E3F2ff606877c"
      values.$members.6:
-        "0x6323ef2b80030f3fBc508bFc321Fc71fDB95c865"
+        "eth:0x6323ef2b80030f3fBc508bFc321Fc71fDB95c865"
      values.$members.7:
-        "0xd5b735b676A043a53946C3b6F6BE28c1ECE6aC90"
+        "eth:0xd5b735b676A043a53946C3b6F6BE28c1ECE6aC90"
      values.$members.8:
-        "0x7ed8d9Af9eaA194D1A75C67c1475579E42289E39"
+        "eth:0x7ed8d9Af9eaA194D1A75C67c1475579E42289E39"
      values.$members.9:
-        "0x0aA384EB2fedD2741277A0f72909A0d7275575D7"
+        "eth:0x0aA384EB2fedD2741277A0f72909A0d7275575D7"
      values.$members.10:
-        "0x9Eb11A55132c851b9991F148b3Af791ca498fD7A"
+        "eth:0x9Eb11A55132c851b9991F148b3Af791ca498fD7A"
      values.$members.11:
-        "0xbfA046B0bc5cEa1596be62B8b3f79f9f41f1E0d9"
+        "eth:0xbfA046B0bc5cEa1596be62B8b3f79f9f41f1E0d9"
      values.$members.12:
-        "0x92827223f6b397CE9F208eE352bacA710765cACb"
+        "eth:0x92827223f6b397CE9F208eE352bacA710765cACb"
      values.GnosisSafe_modules.0:
-        "0x0454092516c9A4d636d3CAfA1e82161376C8a748"
+        "eth:0x0454092516c9A4d636d3CAfA1e82161376C8a748"
      implementationNames.0xc2819DC788505Aac350142A7A707BF9D03E3Bd03:
-        "GnosisSafeProxy"
      implementationNames.0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
-        "GnosisSafe"
      implementationNames.eth:0xc2819DC788505Aac350142A7A707BF9D03E3Bd03:
+        "GnosisSafeProxy"
      implementationNames.eth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
+        "GnosisSafe"
    }
```

```diff
    contract DeputyGuardianModule (0xc6901F65369FC59fC1B4D6D6bE7A2318Ff38dB5B) {
    +++ description: allows the eth:0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A, called the deputy guardian, to act on behalf of the Gnosis Safe.
      address:
-        "0xc6901F65369FC59fC1B4D6D6bE7A2318Ff38dB5B"
+        "eth:0xc6901F65369FC59fC1B4D6D6bE7A2318Ff38dB5B"
      description:
-        "allows the 0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A, called the deputy guardian, to act on behalf of the Gnosis Safe."
+        "allows the eth:0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A, called the deputy guardian, to act on behalf of the Gnosis Safe."
      values.deputyGuardian:
-        "0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A"
+        "eth:0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A"
      values.safe:
-        "0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2"
+        "eth:0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2"
      values.superchainConfig:
-        "0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
+        "eth:0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
      implementationNames.0xc6901F65369FC59fC1B4D6D6bE7A2318Ff38dB5B:
-        "DeputyGuardianModule"
      implementationNames.eth:0xc6901F65369FC59fC1B4D6D6bE7A2318Ff38dB5B:
+        "DeputyGuardianModule"
    }
```

```diff
    EOA  (0xd5b735b676A043a53946C3b6F6BE28c1ECE6aC90) {
    +++ description: None
      address:
-        "0xd5b735b676A043a53946C3b6F6BE28c1ECE6aC90"
+        "eth:0xd5b735b676A043a53946C3b6F6BE28c1ECE6aC90"
    }
```

```diff
    contract AddressManager (0xdE1FCfB0851916CA5101820A69b13a4E276bd81F) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      address:
-        "0xdE1FCfB0851916CA5101820A69b13a4E276bd81F"
+        "eth:0xdE1FCfB0851916CA5101820A69b13a4E276bd81F"
      values.owner:
-        "0x543bA4AADBAb8f9025686Bd03993043599c6fB04"
+        "eth:0x543bA4AADBAb8f9025686Bd03993043599c6fB04"
      values.Proxy__OVM_L1CrossDomainMessenger:
-        "0x25ace71c97B33Cc4729CF772ae268934F7ab5fA1"
+        "eth:0x25ace71c97B33Cc4729CF772ae268934F7ab5fA1"
      values.Proxy__OVM_L1StandardBridge:
-        "0x99C9fc46f92E8a1c0deC1b1747d010903E884bE1"
+        "eth:0x99C9fc46f92E8a1c0deC1b1747d010903E884bE1"
      implementationNames.0xdE1FCfB0851916CA5101820A69b13a4E276bd81F:
-        "Lib_AddressManager"
      implementationNames.eth:0xdE1FCfB0851916CA5101820A69b13a4E276bd81F:
+        "Lib_AddressManager"
    }
```

```diff
    contract DisputeGameFactory (0xe5965Ab5962eDc7477C8520243A95517CD252fA9) {
    +++ description: The dispute game factory allows the creation of dispute games, used to propose state roots and eventually challenge them.
      address:
-        "0xe5965Ab5962eDc7477C8520243A95517CD252fA9"
+        "eth:0xe5965Ab5962eDc7477C8520243A95517CD252fA9"
      values.$admin:
-        "0x543bA4AADBAb8f9025686Bd03993043599c6fB04"
+        "eth:0x543bA4AADBAb8f9025686Bd03993043599c6fB04"
      values.$implementation:
-        "0x4bbA758F006Ef09402eF31724203F316ab74e4a0"
+        "eth:0x4bbA758F006Ef09402eF31724203F316ab74e4a0"
      values.$pastUpgrades.0.2.0:
-        "0xc641A33cab81C559F2bd4b21EA34C290E2440C2B"
+        "eth:0xc641A33cab81C559F2bd4b21EA34C290E2440C2B"
      values.$pastUpgrades.1.2.0:
-        "0x4bbA758F006Ef09402eF31724203F316ab74e4a0"
+        "eth:0x4bbA758F006Ef09402eF31724203F316ab74e4a0"
      values.gameImpls.0:
-        "0x89D68b1D63AAA0db4af1163e81f56B76934292F8"
+        "eth:0x89D68b1D63AAA0db4af1163e81f56B76934292F8"
      values.gameImpls.1:
-        "0xa1E0baCde89d899B3f24eEF3D179cC335A24E777"
+        "eth:0xa1E0baCde89d899B3f24eEF3D179cC335A24E777"
      values.gameImpls.2:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.gameImpls.3:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.gameImpls.4:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.owner:
-        "0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A"
+        "eth:0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A"
      implementationNames.0xe5965Ab5962eDc7477C8520243A95517CD252fA9:
-        "Proxy"
      implementationNames.0x4bbA758F006Ef09402eF31724203F316ab74e4a0:
-        "DisputeGameFactory"
      implementationNames.eth:0xe5965Ab5962eDc7477C8520243A95517CD252fA9:
+        "Proxy"
      implementationNames.eth:0x4bbA758F006Ef09402eF31724203F316ab74e4a0:
+        "DisputeGameFactory"
    }
```

```diff
    EOA  (0xE7dEA1306D9F829bA469d1904c50903b46ebd02e) {
    +++ description: None
      address:
-        "0xE7dEA1306D9F829bA469d1904c50903b46ebd02e"
+        "eth:0xE7dEA1306D9F829bA469d1904c50903b46ebd02e"
    }
```

```diff
    EOA  (0xEF9A98511939eEe6Ec69af62082E3F2ff606877c) {
    +++ description: None
      address:
-        "0xEF9A98511939eEe6Ec69af62082E3F2ff606877c"
+        "eth:0xEF9A98511939eEe6Ec69af62082E3F2ff606877c"
    }
```

```diff
    contract MIPS (0xF027F4A985560fb13324e943edf55ad6F1d15Dc1) {
    +++ description: The MIPS contract is used to execute the final step of the dispute game which objectively determines the winner of the dispute.
      address:
-        "0xF027F4A985560fb13324e943edf55ad6F1d15Dc1"
+        "eth:0xF027F4A985560fb13324e943edf55ad6F1d15Dc1"
      values.oracle:
-        "0x1fb8cdFc6831fc866Ed9C51aF8817Da5c287aDD3"
+        "eth:0x1fb8cdFc6831fc866Ed9C51aF8817Da5c287aDD3"
      implementationNames.0xF027F4A985560fb13324e943edf55ad6F1d15Dc1:
-        "MIPS64"
      implementationNames.eth:0xF027F4A985560fb13324e943edf55ad6F1d15Dc1:
+        "MIPS64"
    }
```

```diff
    EOA  (0xFF00000000000000000000000000000000000010) {
    +++ description: None
      address:
-        "0xFF00000000000000000000000000000000000010"
+        "eth:0xFF00000000000000000000000000000000000010"
    }
```

```diff
+   Status: CREATED
    contract LivenessModule (0x0454092516c9A4d636d3CAfA1e82161376C8a748)
    +++ description: used to remove members inactive for 98d while making sure that the threshold remains above 75%. If the number of members falls below 8, the eth:0x847B5c174615B1B7fDF770882256e2D3E95b9D92 takes ownership of the multisig
```

```diff
+   Status: CREATED
    contract Optimism Guardian Multisig (0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1DAITokenBridge (0x10E6593CDda8c58a1d0f14C5164B376352a55f2F)
    +++ description: Custom Gateway for DAI deposits via canonical messaging. Deposited DAI is forwarded to a Vault contract.
```

```diff
+   Status: CREATED
    contract DeputyPauseModule (0x126a736B18E0a64fBA19D421647A530E327E112C)
    +++ description: Allows eth:0x352f1defB49718e7Ea411687E850aA8d6299F7aC, called the deputy pauser, to act on behalf of the eth:0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A if set as its Safe module.
```

```diff
+   Status: CREATED
    contract AnchorStateRegistry (0x1c68ECfbf9C8B1E6C0677965b3B9Ecf9A104305b)
    +++ description: Contains the latest confirmed state root that can be used as a starting point in a dispute game.
```

```diff
+   Status: CREATED
    contract PreimageOracle (0x1fb8cdFc6831fc866Ed9C51aF8817Da5c287aDD3)
    +++ description: The PreimageOracle contract is used to load the required data from L1 for a dispute game.
```

```diff
+   Status: CREATED
    contract DelayedWETH_PermissionedGames (0x21429aF66058BC3e4aE4a8f2EC4531AaC433ecbC)
    +++ description: Contract designed to hold the bonded ETH for each game. It is designed as a wrapper around WETH to allow an owner to function as a backstop if a game would incorrectly distribute funds.
```

```diff
+   Status: CREATED
    contract SystemConfig (0x229047fed2591dbec1eF1118d64F7aF3dB9EB290)
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
```

```diff
+   Status: CREATED
    contract LivenessGuard (0x24424336F04440b1c28685a38303aC33C9D14a25)
    +++ description: Modular contract to be used together with the LivenessModule. Tracks liveness / activity of Safe owners.
```

```diff
+   Status: CREATED
    contract L1CrossDomainMessenger (0x25ace71c97B33Cc4729CF772ae268934F7ab5fA1)
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
```

```diff
+   Status: CREATED
    contract DelayedWETH_PermissionlessGames (0x323dFC63c9B83CB83f40325AaB74b245937cbdF0)
    +++ description: Contract designed to hold the bonded ETH for each game. It is designed as a wrapper around WETH to allow an owner to function as a backstop if a game would incorrectly distribute funds.
```

```diff
+   Status: CREATED
    contract GnosisSafe (0x42d27eEA1AD6e22Af6284F609847CB3Cd56B9c64)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1DAIEscrow (0x467194771dAe2967Aef3ECbEDD3Bf9a310C76C65)
    +++ description: Stores DAI deposited from the attached L1DAITokenBridge.
```

```diff
+   Status: CREATED
    contract SuperchainProxyAdmin (0x543bA4AADBAb8f9025686Bd03993043599c6fB04)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SuperchainProxyAdminOwner (0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1ERC721Bridge (0x5a7749f83b81B301cAb5f48EB8516B986DAef23D)
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
```

```diff
+   Status: CREATED
    contract SynthetixBridgeEscrow (0x5Fd79D46EBA7F351fe49BFF9E87cdeA6c821eF9f)
    +++ description: Custom escrow for SNX bridged via canonical messaging.
```

```diff
+   Status: CREATED
    contract OptimismMintableERC20Factory (0x75505a97BD334E7BD3C476893285569C4136Fa0F)
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintableERC20 as this chain's representation of a token on the host chain, or vice-versa.
```

```diff
+   Status: CREATED
    contract wstETHEscrow (0x76943C0D61395d8F2edF9060e1533529cAe05dE6)
    +++ description: Lido custom escrow for wstETH tokens that uses the canonical bridge for messaging but is governed externally.
```

```diff
+   Status: CREATED
    contract OpFoundationUpgradeSafe (0x847B5c174615B1B7fDF770882256e2D3E95b9D92)
    +++ description: None
```

```diff
+   Status: CREATED
    contract FaultDisputeGame (0x89D68b1D63AAA0db4af1163e81f56B76934292F8)
    +++ description: Logic of the dispute game. When a state root is proposed, a dispute game contract is deployed. Challengers can use such contracts to challenge the proposed state root.
```

```diff
+   Status: CREATED
    contract SuperchainConfig (0x95703e0982140D16f8ebA6d158FccEde42f04a4C)
    +++ description: Used to manage global configuration values for multiple OP Chains within a single Superchain network. The SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the Superchain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
```

```diff
+   Status: CREATED
    contract L1StandardBridge (0x99C9fc46f92E8a1c0deC1b1747d010903E884bE1)
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
```

```diff
+   Status: CREATED
    contract OpFoundationOperationsSafe (0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A)
    +++ description: None
```

```diff
+   Status: CREATED
    contract PermissionedDisputeGame (0xa1E0baCde89d899B3f24eEF3D179cC335A24E777)
    +++ description: Same as FaultDisputeGame, but only two permissioned addresses are designated as proposer and challenger.
```

```diff
+   Status: CREATED
    contract FeesCollector (0xa3d596EAfaB6B13Ab18D40FaE1A962700C84ADEa)
    +++ description: Collecting sequencer, base- and L1 fees from L2.
```

```diff
+   Status: CREATED
    contract OptimismPortal2 (0xbEb5Fc579115071764c7423A4f12eDde41f106Ed)
    +++ description: The OptimismPortal contract is the main entry point to deposit funds from L1 to L2. It also allows to prove and finalize withdrawals. It specifies which game type can be used for withdrawals, which currently is the FaultDisputeGame.
```

```diff
+   Status: CREATED
    contract Optimism Security Council (0xc2819DC788505Aac350142A7A707BF9D03E3Bd03)
    +++ description: None
```

```diff
+   Status: CREATED
    contract DeputyGuardianModule (0xc6901F65369FC59fC1B4D6D6bE7A2318Ff38dB5B)
    +++ description: allows the eth:0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A, called the deputy guardian, to act on behalf of the Gnosis Safe.
```

```diff
+   Status: CREATED
    contract AddressManager (0xdE1FCfB0851916CA5101820A69b13a4E276bd81F)
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
```

```diff
+   Status: CREATED
    contract DisputeGameFactory (0xe5965Ab5962eDc7477C8520243A95517CD252fA9)
    +++ description: The dispute game factory allows the creation of dispute games, used to propose state roots and eventually challenge them.
```

```diff
+   Status: CREATED
    contract MIPS (0xF027F4A985560fb13324e943edf55ad6F1d15Dc1)
    +++ description: The MIPS contract is used to execute the final step of the dispute game which objectively determines the winner of the dispute.
```

Generated with discovered.json: 0xc8e981d15fe0b7ef7711f1aae25ed0a6484c6e01

# Diff at Mon, 14 Jul 2025 08:02:45 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@0dc82cd5064c9c6dc9fb20e2291a8bb6b2048e27 block: 22567749
- current block number: 22567749

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22567749 (main branch discovery), not current.

```diff
    contract OptimismMintableERC20Factory (0x75505a97BD334E7BD3C476893285569C4136Fa0F) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintableERC20 as this chain's representation of a token on the host chain, or vice-versa.
      description:
-        "A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa."
+        "A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintableERC20 as this chain's representation of a token on the host chain, or vice-versa."
    }
```

Generated with discovered.json: 0xd812ab59033c4742416187e45a90fe155fd51304

# Diff at Fri, 04 Jul 2025 12:19:13 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f56dc47fe915564d4555300304da4d3bcbc087f block: 22567749
- current block number: 22567749

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22567749 (main branch discovery), not current.

```diff
    contract LivenessModule (0x0454092516c9A4d636d3CAfA1e82161376C8a748) {
    +++ description: used to remove members inactive for 98d while making sure that the threshold remains above 75%. If the number of members falls below 8, the 0x847B5c174615B1B7fDF770882256e2D3E95b9D92 takes ownership of the multisig
      directlyReceivedPermissions.0.from:
-        "ethereum:0xc2819DC788505Aac350142A7A707BF9D03E3Bd03"
+        "eth:0xc2819DC788505Aac350142A7A707BF9D03E3Bd03"
    }
```

```diff
    contract Optimism Guardian Multisig (0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2) {
    +++ description: None
      directlyReceivedPermissions.0.from:
-        "ethereum:0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
+        "eth:0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
    }
```

```diff
    contract DeputyPauseModule (0x126a736B18E0a64fBA19D421647A530E327E112C) {
    +++ description: Allows 0x352f1defB49718e7Ea411687E850aA8d6299F7aC, called the deputy pauser, to act on behalf of the 0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A if set as its Safe module.
      directlyReceivedPermissions.0.from:
-        "ethereum:0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A"
+        "eth:0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A"
    }
```

```diff
    contract LivenessGuard (0x24424336F04440b1c28685a38303aC33C9D14a25) {
    +++ description: Modular contract to be used together with the LivenessModule. Tracks liveness / activity of Safe owners.
      receivedPermissions.0.from:
-        "ethereum:0x0454092516c9A4d636d3CAfA1e82161376C8a748"
+        "eth:0x0454092516c9A4d636d3CAfA1e82161376C8a748"
    }
```

```diff
    EOA Optimism EOA 1 (0x352f1defB49718e7Ea411687E850aA8d6299F7aC) {
    +++ description: None
      receivedPermissions.0.via.3.address:
-        "ethereum:0x126a736B18E0a64fBA19D421647A530E327E112C"
+        "eth:0x126a736B18E0a64fBA19D421647A530E327E112C"
      receivedPermissions.0.via.2.address:
-        "ethereum:0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A"
+        "eth:0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A"
      receivedPermissions.0.via.1.address:
-        "ethereum:0xc6901F65369FC59fC1B4D6D6bE7A2318Ff38dB5B"
+        "eth:0xc6901F65369FC59fC1B4D6D6bE7A2318Ff38dB5B"
      receivedPermissions.0.via.0.address:
-        "ethereum:0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2"
+        "eth:0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2"
      receivedPermissions.0.from:
-        "ethereum:0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
+        "eth:0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
      directlyReceivedPermissions.0.from:
-        "ethereum:0x126a736B18E0a64fBA19D421647A530E327E112C"
+        "eth:0x126a736B18E0a64fBA19D421647A530E327E112C"
    }
```

```diff
    contract SuperchainProxyAdmin (0x543bA4AADBAb8f9025686Bd03993043599c6fB04) {
    +++ description: None
      directlyReceivedPermissions.0.from:
-        "ethereum:0xdE1FCfB0851916CA5101820A69b13a4E276bd81F"
+        "eth:0xdE1FCfB0851916CA5101820A69b13a4E276bd81F"
      directlyReceivedPermissions.1.from:
-        "ethereum:0x1c68ECfbf9C8B1E6C0677965b3B9Ecf9A104305b"
+        "eth:0x1c68ECfbf9C8B1E6C0677965b3B9Ecf9A104305b"
      directlyReceivedPermissions.2.from:
-        "ethereum:0x21429aF66058BC3e4aE4a8f2EC4531AaC433ecbC"
+        "eth:0x21429aF66058BC3e4aE4a8f2EC4531AaC433ecbC"
      directlyReceivedPermissions.3.from:
-        "ethereum:0x229047fed2591dbec1eF1118d64F7aF3dB9EB290"
+        "eth:0x229047fed2591dbec1eF1118d64F7aF3dB9EB290"
      directlyReceivedPermissions.4.from:
-        "ethereum:0x25ace71c97B33Cc4729CF772ae268934F7ab5fA1"
+        "eth:0x25ace71c97B33Cc4729CF772ae268934F7ab5fA1"
      directlyReceivedPermissions.5.from:
-        "ethereum:0x323dFC63c9B83CB83f40325AaB74b245937cbdF0"
+        "eth:0x323dFC63c9B83CB83f40325AaB74b245937cbdF0"
      directlyReceivedPermissions.6.from:
-        "ethereum:0x5a7749f83b81B301cAb5f48EB8516B986DAef23D"
+        "eth:0x5a7749f83b81B301cAb5f48EB8516B986DAef23D"
      directlyReceivedPermissions.7.from:
-        "ethereum:0x75505a97BD334E7BD3C476893285569C4136Fa0F"
+        "eth:0x75505a97BD334E7BD3C476893285569C4136Fa0F"
      directlyReceivedPermissions.8.from:
-        "ethereum:0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
+        "eth:0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
      directlyReceivedPermissions.9.from:
-        "ethereum:0x99C9fc46f92E8a1c0deC1b1747d010903E884bE1"
+        "eth:0x99C9fc46f92E8a1c0deC1b1747d010903E884bE1"
      directlyReceivedPermissions.10.from:
-        "ethereum:0xbEb5Fc579115071764c7423A4f12eDde41f106Ed"
+        "eth:0xbEb5Fc579115071764c7423A4f12eDde41f106Ed"
      directlyReceivedPermissions.11.from:
-        "ethereum:0xe5965Ab5962eDc7477C8520243A95517CD252fA9"
+        "eth:0xe5965Ab5962eDc7477C8520243A95517CD252fA9"
    }
```

```diff
    contract SuperchainProxyAdminOwner (0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0x21429aF66058BC3e4aE4a8f2EC4531AaC433ecbC"
+        "eth:0x21429aF66058BC3e4aE4a8f2EC4531AaC433ecbC"
      receivedPermissions.1.from:
-        "ethereum:0x323dFC63c9B83CB83f40325AaB74b245937cbdF0"
+        "eth:0x323dFC63c9B83CB83f40325AaB74b245937cbdF0"
      receivedPermissions.2.via.0.address:
-        "ethereum:0x543bA4AADBAb8f9025686Bd03993043599c6fB04"
+        "eth:0x543bA4AADBAb8f9025686Bd03993043599c6fB04"
      receivedPermissions.2.from:
-        "ethereum:0xdE1FCfB0851916CA5101820A69b13a4E276bd81F"
+        "eth:0xdE1FCfB0851916CA5101820A69b13a4E276bd81F"
      receivedPermissions.3.via.0.address:
-        "ethereum:0x543bA4AADBAb8f9025686Bd03993043599c6fB04"
+        "eth:0x543bA4AADBAb8f9025686Bd03993043599c6fB04"
      receivedPermissions.3.from:
-        "ethereum:0x1c68ECfbf9C8B1E6C0677965b3B9Ecf9A104305b"
+        "eth:0x1c68ECfbf9C8B1E6C0677965b3B9Ecf9A104305b"
      receivedPermissions.4.via.0.address:
-        "ethereum:0x543bA4AADBAb8f9025686Bd03993043599c6fB04"
+        "eth:0x543bA4AADBAb8f9025686Bd03993043599c6fB04"
      receivedPermissions.4.from:
-        "ethereum:0x21429aF66058BC3e4aE4a8f2EC4531AaC433ecbC"
+        "eth:0x21429aF66058BC3e4aE4a8f2EC4531AaC433ecbC"
      receivedPermissions.5.via.0.address:
-        "ethereum:0x543bA4AADBAb8f9025686Bd03993043599c6fB04"
+        "eth:0x543bA4AADBAb8f9025686Bd03993043599c6fB04"
      receivedPermissions.5.from:
-        "ethereum:0x229047fed2591dbec1eF1118d64F7aF3dB9EB290"
+        "eth:0x229047fed2591dbec1eF1118d64F7aF3dB9EB290"
      receivedPermissions.6.via.0.address:
-        "ethereum:0x543bA4AADBAb8f9025686Bd03993043599c6fB04"
+        "eth:0x543bA4AADBAb8f9025686Bd03993043599c6fB04"
      receivedPermissions.6.from:
-        "ethereum:0x25ace71c97B33Cc4729CF772ae268934F7ab5fA1"
+        "eth:0x25ace71c97B33Cc4729CF772ae268934F7ab5fA1"
      receivedPermissions.7.via.0.address:
-        "ethereum:0x543bA4AADBAb8f9025686Bd03993043599c6fB04"
+        "eth:0x543bA4AADBAb8f9025686Bd03993043599c6fB04"
      receivedPermissions.7.from:
-        "ethereum:0x323dFC63c9B83CB83f40325AaB74b245937cbdF0"
+        "eth:0x323dFC63c9B83CB83f40325AaB74b245937cbdF0"
      receivedPermissions.8.via.0.address:
-        "ethereum:0x543bA4AADBAb8f9025686Bd03993043599c6fB04"
+        "eth:0x543bA4AADBAb8f9025686Bd03993043599c6fB04"
      receivedPermissions.8.from:
-        "ethereum:0x5a7749f83b81B301cAb5f48EB8516B986DAef23D"
+        "eth:0x5a7749f83b81B301cAb5f48EB8516B986DAef23D"
      receivedPermissions.9.via.0.address:
-        "ethereum:0x543bA4AADBAb8f9025686Bd03993043599c6fB04"
+        "eth:0x543bA4AADBAb8f9025686Bd03993043599c6fB04"
      receivedPermissions.9.from:
-        "ethereum:0x75505a97BD334E7BD3C476893285569C4136Fa0F"
+        "eth:0x75505a97BD334E7BD3C476893285569C4136Fa0F"
      receivedPermissions.10.via.0.address:
-        "ethereum:0x543bA4AADBAb8f9025686Bd03993043599c6fB04"
+        "eth:0x543bA4AADBAb8f9025686Bd03993043599c6fB04"
      receivedPermissions.10.from:
-        "ethereum:0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
+        "eth:0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
      receivedPermissions.11.via.0.address:
-        "ethereum:0x543bA4AADBAb8f9025686Bd03993043599c6fB04"
+        "eth:0x543bA4AADBAb8f9025686Bd03993043599c6fB04"
      receivedPermissions.11.from:
-        "ethereum:0x99C9fc46f92E8a1c0deC1b1747d010903E884bE1"
+        "eth:0x99C9fc46f92E8a1c0deC1b1747d010903E884bE1"
      receivedPermissions.12.via.0.address:
-        "ethereum:0x543bA4AADBAb8f9025686Bd03993043599c6fB04"
+        "eth:0x543bA4AADBAb8f9025686Bd03993043599c6fB04"
      receivedPermissions.12.from:
-        "ethereum:0xbEb5Fc579115071764c7423A4f12eDde41f106Ed"
+        "eth:0xbEb5Fc579115071764c7423A4f12eDde41f106Ed"
      receivedPermissions.13.via.0.address:
-        "ethereum:0x543bA4AADBAb8f9025686Bd03993043599c6fB04"
+        "eth:0x543bA4AADBAb8f9025686Bd03993043599c6fB04"
      receivedPermissions.13.from:
-        "ethereum:0xe5965Ab5962eDc7477C8520243A95517CD252fA9"
+        "eth:0xe5965Ab5962eDc7477C8520243A95517CD252fA9"
      directlyReceivedPermissions.0.from:
-        "ethereum:0x543bA4AADBAb8f9025686Bd03993043599c6fB04"
+        "eth:0x543bA4AADBAb8f9025686Bd03993043599c6fB04"
    }
```

```diff
    EOA  (0x6887246668a3b87F54DeB3b94Ba47a6f63F32985) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0x229047fed2591dbec1eF1118d64F7aF3dB9EB290"
+        "eth:0x229047fed2591dbec1eF1118d64F7aF3dB9EB290"
    }
```

```diff
    contract OpFoundationUpgradeSafe (0x847B5c174615B1B7fDF770882256e2D3E95b9D92) {
    +++ description: None
      receivedPermissions.0.via.2.address:
-        "ethereum:0x0454092516c9A4d636d3CAfA1e82161376C8a748"
+        "eth:0x0454092516c9A4d636d3CAfA1e82161376C8a748"
      receivedPermissions.0.via.1.address:
-        "ethereum:0xc2819DC788505Aac350142A7A707BF9D03E3Bd03"
+        "eth:0xc2819DC788505Aac350142A7A707BF9D03E3Bd03"
      receivedPermissions.0.via.0.address:
-        "ethereum:0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2"
+        "eth:0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2"
      receivedPermissions.0.from:
-        "ethereum:0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
+        "eth:0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
      receivedPermissions.1.from:
-        "ethereum:0x229047fed2591dbec1eF1118d64F7aF3dB9EB290"
+        "eth:0x229047fed2591dbec1eF1118d64F7aF3dB9EB290"
      directlyReceivedPermissions.0.from:
-        "ethereum:0x0454092516c9A4d636d3CAfA1e82161376C8a748"
+        "eth:0x0454092516c9A4d636d3CAfA1e82161376C8a748"
    }
```

```diff
    contract OpFoundationOperationsSafe (0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A) {
    +++ description: None
      receivedPermissions.0.via.1.address:
-        "ethereum:0xc6901F65369FC59fC1B4D6D6bE7A2318Ff38dB5B"
+        "eth:0xc6901F65369FC59fC1B4D6D6bE7A2318Ff38dB5B"
      receivedPermissions.0.via.0.address:
-        "ethereum:0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2"
+        "eth:0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2"
      receivedPermissions.0.from:
-        "ethereum:0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
+        "eth:0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
      directlyReceivedPermissions.0.from:
-        "ethereum:0xc6901F65369FC59fC1B4D6D6bE7A2318Ff38dB5B"
+        "eth:0xc6901F65369FC59fC1B4D6D6bE7A2318Ff38dB5B"
    }
```

```diff
    contract Optimism Security Council (0xc2819DC788505Aac350142A7A707BF9D03E3Bd03) {
    +++ description: None
      receivedPermissions.0.via.0.address:
-        "ethereum:0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2"
+        "eth:0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2"
      receivedPermissions.0.from:
-        "ethereum:0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
+        "eth:0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
    }
```

```diff
    contract DeputyGuardianModule (0xc6901F65369FC59fC1B4D6D6bE7A2318Ff38dB5B) {
    +++ description: allows the 0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A, called the deputy guardian, to act on behalf of the Gnosis Safe.
      directlyReceivedPermissions.0.from:
-        "ethereum:0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2"
+        "eth:0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2"
    }
```

Generated with discovered.json: 0x0fcbf20a1d1dd7bbc4badcdf41eeb65cadb93d71

# Diff at Fri, 04 Jul 2025 12:19:12 GMT:

- chain: optimism
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f56dc47fe915564d4555300304da4d3bcbc087f block: 135717996
- current block number: 135717996

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 135717996 (main branch discovery), not current.

```diff
    contract MintManagerOwner (0x2A82Ae142b2e62Cb7D10b55E323ACB1Cab663a26) {
    +++ description: None
      receivedPermissions.0.from:
-        "optimism:0x5C4e7Ba1E219E47948e6e3F55019A647bA501005"
+        "oeth:0x5C4e7Ba1E219E47948e6e3F55019A647bA501005"
    }
```

```diff
    contract ProxyAdmin (0x4200000000000000000000000000000000000018) {
    +++ description: None
      directlyReceivedPermissions.0.from:
-        "optimism:0x4200000000000000000000000000000000000002"
+        "oeth:0x4200000000000000000000000000000000000002"
      directlyReceivedPermissions.1.from:
-        "optimism:0x4200000000000000000000000000000000000007"
+        "oeth:0x4200000000000000000000000000000000000007"
      directlyReceivedPermissions.2.from:
-        "optimism:0x420000000000000000000000000000000000000F"
+        "oeth:0x420000000000000000000000000000000000000F"
      directlyReceivedPermissions.3.from:
-        "optimism:0x4200000000000000000000000000000000000010"
+        "oeth:0x4200000000000000000000000000000000000010"
      directlyReceivedPermissions.4.from:
-        "optimism:0x4200000000000000000000000000000000000011"
+        "oeth:0x4200000000000000000000000000000000000011"
      directlyReceivedPermissions.5.from:
-        "optimism:0x4200000000000000000000000000000000000012"
+        "oeth:0x4200000000000000000000000000000000000012"
      directlyReceivedPermissions.6.from:
-        "optimism:0x4200000000000000000000000000000000000013"
+        "oeth:0x4200000000000000000000000000000000000013"
      directlyReceivedPermissions.7.from:
-        "optimism:0x4200000000000000000000000000000000000014"
+        "oeth:0x4200000000000000000000000000000000000014"
      directlyReceivedPermissions.8.from:
-        "optimism:0x4200000000000000000000000000000000000015"
+        "oeth:0x4200000000000000000000000000000000000015"
      directlyReceivedPermissions.9.from:
-        "optimism:0x4200000000000000000000000000000000000016"
+        "oeth:0x4200000000000000000000000000000000000016"
      directlyReceivedPermissions.10.from:
-        "optimism:0x4200000000000000000000000000000000000017"
+        "oeth:0x4200000000000000000000000000000000000017"
      directlyReceivedPermissions.11.from:
-        "optimism:0x4200000000000000000000000000000000000018"
+        "oeth:0x4200000000000000000000000000000000000018"
      directlyReceivedPermissions.12.from:
-        "optimism:0x4200000000000000000000000000000000000019"
+        "oeth:0x4200000000000000000000000000000000000019"
      directlyReceivedPermissions.13.from:
-        "optimism:0x420000000000000000000000000000000000001A"
+        "oeth:0x420000000000000000000000000000000000001A"
      directlyReceivedPermissions.14.from:
-        "optimism:0x420000000000000000000000000000000000001b"
+        "oeth:0x420000000000000000000000000000000000001b"
      directlyReceivedPermissions.15.from:
-        "optimism:0x4200000000000000000000000000000000000020"
+        "oeth:0x4200000000000000000000000000000000000020"
      directlyReceivedPermissions.16.from:
-        "optimism:0x4200000000000000000000000000000000000021"
+        "oeth:0x4200000000000000000000000000000000000021"
    }
```

```diff
    EOA SuperchainProxyAdminOwner - L2 Alias (0x6B1BAE59D09fCcbdDB6C6cceb07B7279367C4E3b) {
    +++ description: None
      receivedPermissions.0.via.0.address:
-        "optimism:0x4200000000000000000000000000000000000018"
+        "oeth:0x4200000000000000000000000000000000000018"
      receivedPermissions.0.from:
-        "optimism:0x4200000000000000000000000000000000000002"
+        "oeth:0x4200000000000000000000000000000000000002"
      receivedPermissions.1.via.0.address:
-        "optimism:0x4200000000000000000000000000000000000018"
+        "oeth:0x4200000000000000000000000000000000000018"
      receivedPermissions.1.from:
-        "optimism:0x4200000000000000000000000000000000000007"
+        "oeth:0x4200000000000000000000000000000000000007"
      receivedPermissions.2.via.0.address:
-        "optimism:0x4200000000000000000000000000000000000018"
+        "oeth:0x4200000000000000000000000000000000000018"
      receivedPermissions.2.from:
-        "optimism:0x420000000000000000000000000000000000000F"
+        "oeth:0x420000000000000000000000000000000000000F"
      receivedPermissions.3.via.0.address:
-        "optimism:0x4200000000000000000000000000000000000018"
+        "oeth:0x4200000000000000000000000000000000000018"
      receivedPermissions.3.from:
-        "optimism:0x4200000000000000000000000000000000000010"
+        "oeth:0x4200000000000000000000000000000000000010"
      receivedPermissions.4.via.0.address:
-        "optimism:0x4200000000000000000000000000000000000018"
+        "oeth:0x4200000000000000000000000000000000000018"
      receivedPermissions.4.from:
-        "optimism:0x4200000000000000000000000000000000000011"
+        "oeth:0x4200000000000000000000000000000000000011"
      receivedPermissions.5.via.0.address:
-        "optimism:0x4200000000000000000000000000000000000018"
+        "oeth:0x4200000000000000000000000000000000000018"
      receivedPermissions.5.from:
-        "optimism:0x4200000000000000000000000000000000000012"
+        "oeth:0x4200000000000000000000000000000000000012"
      receivedPermissions.6.via.0.address:
-        "optimism:0x4200000000000000000000000000000000000018"
+        "oeth:0x4200000000000000000000000000000000000018"
      receivedPermissions.6.from:
-        "optimism:0x4200000000000000000000000000000000000013"
+        "oeth:0x4200000000000000000000000000000000000013"
      receivedPermissions.7.via.0.address:
-        "optimism:0x4200000000000000000000000000000000000018"
+        "oeth:0x4200000000000000000000000000000000000018"
      receivedPermissions.7.from:
-        "optimism:0x4200000000000000000000000000000000000014"
+        "oeth:0x4200000000000000000000000000000000000014"
      receivedPermissions.8.via.0.address:
-        "optimism:0x4200000000000000000000000000000000000018"
+        "oeth:0x4200000000000000000000000000000000000018"
      receivedPermissions.8.from:
-        "optimism:0x4200000000000000000000000000000000000015"
+        "oeth:0x4200000000000000000000000000000000000015"
      receivedPermissions.9.via.0.address:
-        "optimism:0x4200000000000000000000000000000000000018"
+        "oeth:0x4200000000000000000000000000000000000018"
      receivedPermissions.9.from:
-        "optimism:0x4200000000000000000000000000000000000016"
+        "oeth:0x4200000000000000000000000000000000000016"
      receivedPermissions.10.via.0.address:
-        "optimism:0x4200000000000000000000000000000000000018"
+        "oeth:0x4200000000000000000000000000000000000018"
      receivedPermissions.10.from:
-        "optimism:0x4200000000000000000000000000000000000017"
+        "oeth:0x4200000000000000000000000000000000000017"
      receivedPermissions.11.via.0.address:
-        "optimism:0x4200000000000000000000000000000000000018"
+        "oeth:0x4200000000000000000000000000000000000018"
      receivedPermissions.11.from:
-        "optimism:0x4200000000000000000000000000000000000018"
+        "oeth:0x4200000000000000000000000000000000000018"
      receivedPermissions.12.via.0.address:
-        "optimism:0x4200000000000000000000000000000000000018"
+        "oeth:0x4200000000000000000000000000000000000018"
      receivedPermissions.12.from:
-        "optimism:0x4200000000000000000000000000000000000019"
+        "oeth:0x4200000000000000000000000000000000000019"
      receivedPermissions.13.via.0.address:
-        "optimism:0x4200000000000000000000000000000000000018"
+        "oeth:0x4200000000000000000000000000000000000018"
      receivedPermissions.13.from:
-        "optimism:0x420000000000000000000000000000000000001A"
+        "oeth:0x420000000000000000000000000000000000001A"
      receivedPermissions.14.via.0.address:
-        "optimism:0x4200000000000000000000000000000000000018"
+        "oeth:0x4200000000000000000000000000000000000018"
      receivedPermissions.14.from:
-        "optimism:0x420000000000000000000000000000000000001b"
+        "oeth:0x420000000000000000000000000000000000001b"
      receivedPermissions.15.via.0.address:
-        "optimism:0x4200000000000000000000000000000000000018"
+        "oeth:0x4200000000000000000000000000000000000018"
      receivedPermissions.15.from:
-        "optimism:0x4200000000000000000000000000000000000020"
+        "oeth:0x4200000000000000000000000000000000000020"
      receivedPermissions.16.via.0.address:
-        "optimism:0x4200000000000000000000000000000000000018"
+        "oeth:0x4200000000000000000000000000000000000018"
      receivedPermissions.16.from:
-        "optimism:0x4200000000000000000000000000000000000021"
+        "oeth:0x4200000000000000000000000000000000000021"
      directlyReceivedPermissions.0.from:
-        "optimism:0x4200000000000000000000000000000000000018"
+        "oeth:0x4200000000000000000000000000000000000018"
    }
```

Generated with discovered.json: 0xb8869ad66c7579fdda1454834f8b9c1b86d4b63d

# Diff at Thu, 03 Jul 2025 10:57:04 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@fa3b82adfb9dedeb2acea8fde7b79e65d59fb2b6 block: 22567749
- current block number: 22567749

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22567749 (main branch discovery), not current.

```diff
    contract L1DAIEscrow (0x467194771dAe2967Aef3ECbEDD3Bf9a310C76C65) {
    +++ description: Stores DAI deposited from the attached L1DAITokenBridge.
      description:
-        "Simple escrow that accepts tokens and allows to configure permissioned addresses that can access the tokens."
+        "Stores DAI deposited from the attached L1DAITokenBridge."
    }
```

Generated with discovered.json: 0x2bcbfa17532cf9f269da8f62f760c437b84aae20

# Diff at Mon, 16 Jun 2025 08:43:56 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@e1208475abce20cea1768d2e4878c03350c1b7c9 block: 22567749
- current block number: 22567749

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22567749 (main branch discovery), not current.

```diff
    contract L1CrossDomainMessenger (0x25ace71c97B33Cc4729CF772ae268934F7ab5fA1) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      values.$admin:
+        "0x543bA4AADBAb8f9025686Bd03993043599c6fB04"
    }
```

```diff
    contract SuperchainProxyAdmin (0x543bA4AADBAb8f9025686Bd03993043599c6fB04) {
    +++ description: None
      directlyReceivedPermissions.11:
+        {"permission":"upgrade","from":"ethereum:0x21429aF66058BC3e4aE4a8f2EC4531AaC433ecbC","role":"admin"}
      directlyReceivedPermissions.10.from:
-        "ethereum:0x21429aF66058BC3e4aE4a8f2EC4531AaC433ecbC"
+        "ethereum:0x25ace71c97B33Cc4729CF772ae268934F7ab5fA1"
    }
```

```diff
    contract SuperchainProxyAdminOwner (0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A) {
    +++ description: None
      receivedPermissions.13:
+        {"permission":"upgrade","from":"ethereum:0x21429aF66058BC3e4aE4a8f2EC4531AaC433ecbC","role":"admin","via":[{"address":"ethereum:0x543bA4AADBAb8f9025686Bd03993043599c6fB04"}]}
      receivedPermissions.12.from:
-        "ethereum:0x21429aF66058BC3e4aE4a8f2EC4531AaC433ecbC"
+        "ethereum:0x25ace71c97B33Cc4729CF772ae268934F7ab5fA1"
    }
```

Generated with discovered.json: 0xfaf887eecbfababe6dc711b593376a93ddfdbb2c

# Diff at Wed, 11 Jun 2025 10:36:33 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@9d1575fea6364921032f9ded0a049bdf9fc57604 block: 22567749
- current block number: 22567749

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22567749 (main branch discovery), not current.

```diff
    contract FeesCollector (0xa3d596EAfaB6B13Ab18D40FaE1A962700C84ADEa) {
    +++ description: Collecting sequencer, base- and L1 fees from L2.
      sourceHashes.1:
+        "0xa58ba822ad1db27a90c11078dd6ececa7d90a2f12794716b21e0ffaa038ff101"
      proxyType:
-        "immutable"
+        "EIP1167 proxy"
      values.$immutable:
-        true
      values.$implementation:
+        "0xE8E847cf573Fc8ed75621660A36AffD18c543d7E"
      implementationNames.0xE8E847cf573Fc8ed75621660A36AffD18c543d7E:
+        "WalletSimple"
    }
```

Generated with discovered.json: 0xcb5ed4e4c4ca8496b10afa9ffd1eee3c3c99763c

# Diff at Fri, 30 May 2025 07:10:10 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@a4d8c436027d17df0f9b76843cd6deb1888fa381 block: 22567749
- current block number: 22567749

## Description

config: change comment about eip1559 fee val

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22567749 (main branch discovery), not current.

```diff
    contract SystemConfig (0x229047fed2591dbec1eF1118d64F7aF3dB9EB290) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      fieldMeta.eip1559Denominator:
+        {"description":"volatility param: lower denominator -> quicker fee changes on L2"}
    }
```

Generated with discovered.json: 0xecc6f5c7804e59404dde4a8d82406b290553dc08

# Diff at Mon, 26 May 2025 15:08:08 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@d675d0bd208eadc685b2cb489512b83f62c0890e block: 22437740
- current block number: 22567749

## Description

gaslimit adjustments (net increase while decreasing elasticity).

## Watched changes

```diff
    contract SystemConfig (0x229047fed2591dbec1eF1118d64F7aF3dB9EB290) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      values.eip1559Elasticity:
-        4
+        2
+++ description: Gas limit for blocks on L2.
+++ severity: LOW
      values.gasLimit:
-        60000000
+        40000000
    }
```

Generated with discovered.json: 0xb74eb30fdff99fd84eb2e70d2931ba830105c87b

# Diff at Fri, 23 May 2025 09:41:16 GMT:

- chain: optimism
- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@69cd181abbc3c830a6caf2f4429b37cae72ffdb8 block: 135717996
- current block number: 135717996

## Description

Introduced .role field on each permission, defaulting to field name on which it was defined (with '.' prefix)

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 135717996 (main branch discovery), not current.

```diff
    contract MintManagerOwner (0x2A82Ae142b2e62Cb7D10b55E323ACB1Cab663a26) {
    +++ description: None
      receivedPermissions.0.role:
+        ".owner"
    }
```

```diff
    contract ProxyAdmin (0x4200000000000000000000000000000000000018) {
    +++ description: None
      directlyReceivedPermissions.16.role:
+        "admin"
      directlyReceivedPermissions.15.role:
+        "admin"
      directlyReceivedPermissions.14.role:
+        "admin"
      directlyReceivedPermissions.13.role:
+        "admin"
      directlyReceivedPermissions.12.role:
+        "admin"
      directlyReceivedPermissions.11.role:
+        "admin"
      directlyReceivedPermissions.10.role:
+        "admin"
      directlyReceivedPermissions.9.role:
+        "admin"
      directlyReceivedPermissions.8.role:
+        "admin"
      directlyReceivedPermissions.7.role:
+        "admin"
      directlyReceivedPermissions.6.role:
+        "admin"
      directlyReceivedPermissions.5.role:
+        "admin"
      directlyReceivedPermissions.4.role:
+        "admin"
      directlyReceivedPermissions.3.role:
+        "admin"
      directlyReceivedPermissions.2.role:
+        "admin"
      directlyReceivedPermissions.1.role:
+        "admin"
      directlyReceivedPermissions.0.role:
+        "admin"
    }
```

```diff
    EOA SuperchainProxyAdminOwner - L2 Alias (0x6B1BAE59D09fCcbdDB6C6cceb07B7279367C4E3b) {
    +++ description: None
      receivedPermissions.16.role:
+        "admin"
      receivedPermissions.15.role:
+        "admin"
      receivedPermissions.14.role:
+        "admin"
      receivedPermissions.13.role:
+        "admin"
      receivedPermissions.12.role:
+        "admin"
      receivedPermissions.11.role:
+        "admin"
      receivedPermissions.10.role:
+        "admin"
      receivedPermissions.9.role:
+        "admin"
      receivedPermissions.8.role:
+        "admin"
      receivedPermissions.7.role:
+        "admin"
      receivedPermissions.6.role:
+        "admin"
      receivedPermissions.5.role:
+        "admin"
      receivedPermissions.4.role:
+        "admin"
      receivedPermissions.3.role:
+        "admin"
      receivedPermissions.2.role:
+        "admin"
      receivedPermissions.1.role:
+        "admin"
      receivedPermissions.0.role:
+        "admin"
      directlyReceivedPermissions.0.role:
+        ".owner"
    }
```

Generated with discovered.json: 0xb57532f0bb876cf2ee08f6f99f6c0fe0777aea1e

# Diff at Fri, 23 May 2025 09:41:16 GMT:

- chain: ethereum
- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@69cd181abbc3c830a6caf2f4429b37cae72ffdb8 block: 22437740
- current block number: 22437740

## Description

Introduced .role field on each permission, defaulting to field name on which it was defined (with '.' prefix)

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22437740 (main branch discovery), not current.

```diff
    contract LivenessModule (0x0454092516c9A4d636d3CAfA1e82161376C8a748) {
    +++ description: used to remove members inactive for 98d while making sure that the threshold remains above 75%. If the number of members falls below 8, the 0x847B5c174615B1B7fDF770882256e2D3E95b9D92 takes ownership of the multisig
      directlyReceivedPermissions.0.role:
+        ".GnosisSafe_modules"
    }
```

```diff
    contract Optimism Guardian Multisig (0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2) {
    +++ description: None
      directlyReceivedPermissions.0.role:
+        ".guardian"
    }
```

```diff
    contract DeputyPauseModule (0x126a736B18E0a64fBA19D421647A530E327E112C) {
    +++ description: Allows 0x352f1defB49718e7Ea411687E850aA8d6299F7aC, called the deputy pauser, to act on behalf of the 0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A if set as its Safe module.
      directlyReceivedPermissions.0.role:
+        ".GnosisSafe_modules"
    }
```

```diff
    contract LivenessGuard (0x24424336F04440b1c28685a38303aC33C9D14a25) {
    +++ description: Modular contract to be used together with the LivenessModule. Tracks liveness / activity of Safe owners.
      receivedPermissions.0.role:
+        ".livenessGuard"
    }
```

```diff
    EOA Optimism EOA 1 (0x352f1defB49718e7Ea411687E850aA8d6299F7aC) {
    +++ description: None
      receivedPermissions.0.role:
+        ".guardian"
      directlyReceivedPermissions.0.role:
+        ".deputy"
    }
```

```diff
    contract SuperchainProxyAdmin (0x543bA4AADBAb8f9025686Bd03993043599c6fB04) {
    +++ description: None
      directlyReceivedPermissions.10.role:
+        "admin"
      directlyReceivedPermissions.9.role:
+        "admin"
      directlyReceivedPermissions.8.permission:
-        "interact"
+        "upgrade"
      directlyReceivedPermissions.8.from:
-        "0xdE1FCfB0851916CA5101820A69b13a4E276bd81F"
+        "0x21429aF66058BC3e4aE4a8f2EC4531AaC433ecbC"
      directlyReceivedPermissions.8.description:
-        "set and change address mappings."
      directlyReceivedPermissions.8.role:
+        "admin"
      directlyReceivedPermissions.7.from:
-        "0x21429aF66058BC3e4aE4a8f2EC4531AaC433ecbC"
+        "0x229047fed2591dbec1eF1118d64F7aF3dB9EB290"
      directlyReceivedPermissions.7.role:
+        "admin"
      directlyReceivedPermissions.6.from:
-        "0x229047fed2591dbec1eF1118d64F7aF3dB9EB290"
+        "0x75505a97BD334E7BD3C476893285569C4136Fa0F"
      directlyReceivedPermissions.6.role:
+        "admin"
      directlyReceivedPermissions.5.from:
-        "0x75505a97BD334E7BD3C476893285569C4136Fa0F"
+        "0xe5965Ab5962eDc7477C8520243A95517CD252fA9"
      directlyReceivedPermissions.5.role:
+        "admin"
      directlyReceivedPermissions.4.from:
-        "0x99C9fc46f92E8a1c0deC1b1747d010903E884bE1"
+        "0xbEb5Fc579115071764c7423A4f12eDde41f106Ed"
      directlyReceivedPermissions.4.description:
-        "upgrading the bridge implementation can give access to all funds escrowed therein."
      directlyReceivedPermissions.4.role:
+        "admin"
      directlyReceivedPermissions.3.from:
-        "0xe5965Ab5962eDc7477C8520243A95517CD252fA9"
+        "0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
      directlyReceivedPermissions.3.role:
+        "admin"
      directlyReceivedPermissions.2.from:
-        "0xbEb5Fc579115071764c7423A4f12eDde41f106Ed"
+        "0x1c68ECfbf9C8B1E6C0677965b3B9Ecf9A104305b"
      directlyReceivedPermissions.2.role:
+        "admin"
      directlyReceivedPermissions.1.from:
-        "0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
+        "0x99C9fc46f92E8a1c0deC1b1747d010903E884bE1"
      directlyReceivedPermissions.1.description:
+        "upgrading the bridge implementation can give access to all funds escrowed therein."
      directlyReceivedPermissions.1.role:
+        ".$admin"
      directlyReceivedPermissions.0.permission:
-        "upgrade"
+        "interact"
      directlyReceivedPermissions.0.from:
-        "0x1c68ECfbf9C8B1E6C0677965b3B9Ecf9A104305b"
+        "0xdE1FCfB0851916CA5101820A69b13a4E276bd81F"
      directlyReceivedPermissions.0.description:
+        "set and change address mappings."
      directlyReceivedPermissions.0.role:
+        ".owner"
    }
```

```diff
    contract SuperchainProxyAdminOwner (0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A) {
    +++ description: None
      receivedPermissions.12.role:
+        "admin"
      receivedPermissions.11.role:
+        "admin"
      receivedPermissions.10.permission:
-        "interact"
+        "upgrade"
      receivedPermissions.10.from:
-        "0x323dFC63c9B83CB83f40325AaB74b245937cbdF0"
+        "0x21429aF66058BC3e4aE4a8f2EC4531AaC433ecbC"
      receivedPermissions.10.description:
-        "can pull funds from the contract in case of emergency."
      receivedPermissions.10.role:
+        "admin"
      receivedPermissions.10.via:
+        [{"address":"0x543bA4AADBAb8f9025686Bd03993043599c6fB04"}]
      receivedPermissions.9.permission:
-        "interact"
+        "upgrade"
      receivedPermissions.9.from:
-        "0xdE1FCfB0851916CA5101820A69b13a4E276bd81F"
+        "0x229047fed2591dbec1eF1118d64F7aF3dB9EB290"
      receivedPermissions.9.description:
-        "set and change address mappings."
      receivedPermissions.9.role:
+        "admin"
      receivedPermissions.8.from:
-        "0x21429aF66058BC3e4aE4a8f2EC4531AaC433ecbC"
+        "0x75505a97BD334E7BD3C476893285569C4136Fa0F"
      receivedPermissions.8.role:
+        "admin"
      receivedPermissions.7.from:
-        "0x229047fed2591dbec1eF1118d64F7aF3dB9EB290"
+        "0xe5965Ab5962eDc7477C8520243A95517CD252fA9"
      receivedPermissions.7.role:
+        "admin"
      receivedPermissions.6.from:
-        "0x75505a97BD334E7BD3C476893285569C4136Fa0F"
+        "0xbEb5Fc579115071764c7423A4f12eDde41f106Ed"
      receivedPermissions.6.role:
+        "admin"
      receivedPermissions.5.from:
-        "0x99C9fc46f92E8a1c0deC1b1747d010903E884bE1"
+        "0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
      receivedPermissions.5.description:
-        "upgrading the bridge implementation can give access to all funds escrowed therein."
      receivedPermissions.5.role:
+        "admin"
      receivedPermissions.4.permission:
-        "interact"
+        "upgrade"
      receivedPermissions.4.from:
-        "0x21429aF66058BC3e4aE4a8f2EC4531AaC433ecbC"
+        "0x1c68ECfbf9C8B1E6C0677965b3B9Ecf9A104305b"
      receivedPermissions.4.description:
-        "can pull funds from the contract in case of emergency."
      receivedPermissions.4.role:
+        "admin"
      receivedPermissions.4.via:
+        [{"address":"0x543bA4AADBAb8f9025686Bd03993043599c6fB04"}]
      receivedPermissions.3.permission:
-        "upgrade"
+        "interact"
      receivedPermissions.3.from:
-        "0xe5965Ab5962eDc7477C8520243A95517CD252fA9"
+        "0x323dFC63c9B83CB83f40325AaB74b245937cbdF0"
      receivedPermissions.3.via:
-        [{"address":"0x543bA4AADBAb8f9025686Bd03993043599c6fB04"}]
      receivedPermissions.3.description:
+        "can pull funds from the contract in case of emergency."
      receivedPermissions.3.role:
+        ".owner"
      receivedPermissions.2.from:
-        "0xbEb5Fc579115071764c7423A4f12eDde41f106Ed"
+        "0x99C9fc46f92E8a1c0deC1b1747d010903E884bE1"
      receivedPermissions.2.description:
+        "upgrading the bridge implementation can give access to all funds escrowed therein."
      receivedPermissions.2.role:
+        ".$admin"
      receivedPermissions.1.permission:
-        "upgrade"
+        "interact"
      receivedPermissions.1.from:
-        "0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
+        "0xdE1FCfB0851916CA5101820A69b13a4E276bd81F"
      receivedPermissions.1.description:
+        "set and change address mappings."
      receivedPermissions.1.role:
+        ".owner"
      receivedPermissions.0.permission:
-        "upgrade"
+        "interact"
      receivedPermissions.0.from:
-        "0x1c68ECfbf9C8B1E6C0677965b3B9Ecf9A104305b"
+        "0x21429aF66058BC3e4aE4a8f2EC4531AaC433ecbC"
      receivedPermissions.0.via:
-        [{"address":"0x543bA4AADBAb8f9025686Bd03993043599c6fB04"}]
      receivedPermissions.0.description:
+        "can pull funds from the contract in case of emergency."
      receivedPermissions.0.role:
+        ".owner"
      directlyReceivedPermissions.0.role:
+        ".owner"
    }
```

```diff
    EOA  (0x6887246668a3b87F54DeB3b94Ba47a6f63F32985) {
    +++ description: None
      receivedPermissions.0.role:
+        ".batcherHash"
    }
```

```diff
    contract OpFoundationUpgradeSafe (0x847B5c174615B1B7fDF770882256e2D3E95b9D92) {
    +++ description: None
      receivedPermissions.1.role:
+        ".owner"
      receivedPermissions.0.role:
+        ".guardian"
      directlyReceivedPermissions.0.role:
+        ".fallbackOwner"
    }
```

```diff
    contract OpFoundationOperationsSafe (0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A) {
    +++ description: None
      receivedPermissions.0.role:
+        ".guardian"
      directlyReceivedPermissions.0.role:
+        ".deputyGuardian"
    }
```

```diff
    contract Optimism Security Council (0xc2819DC788505Aac350142A7A707BF9D03E3Bd03) {
    +++ description: None
      receivedPermissions.0.role:
+        ".guardian"
    }
```

```diff
    contract DeputyGuardianModule (0xc6901F65369FC59fC1B4D6D6bE7A2318Ff38dB5B) {
    +++ description: allows the 0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A, called the deputy guardian, to act on behalf of the Gnosis Safe.
      directlyReceivedPermissions.0.role:
+        ".GnosisSafe_modules"
    }
```

Generated with discovered.json: 0x1690da88842d9c153abb98cf07bb56cda11e92dc

# Diff at Mon, 12 May 2025 08:10:17 GMT:

- chain: optimism
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@4a373705dbec82410d264d404f2ff330f41666ef block: 132493968
- current block number: 135717996

## Description

Isthmus L2 contract upgrades, mainly focusing on support for the new operator fee.

## Watched changes

```diff
    contract GasPriceOracle (0x420000000000000000000000000000000000000F) {
    +++ description: Provides the current gas price for L2 transactions.
      sourceHashes.1:
-        "0x6d0f92051952bf3dcccae9e0ff5cf654e3b386df386bc0609b0c7234a2a108bb"
+        "0x926a45849c8c68704718056d544ac26d7683a6b44a90a9590dda1a9bdd495962"
      values.$implementation:
-        "0xa919894851548179A0750865e7974DA599C0Fac7"
+        "0x93e57A196454CB919193fa9946f14943cf733845"
      values.$pastUpgrades.2:
+        ["2024-07-10T16:00:01.000Z","0x2f63bbe08a66796dde569281a58a53e0b0f64b7aa067297e9c70455fb8e375bc",["0xa919894851548179A0750865e7974DA599C0Fac7"]]
      values.$pastUpgrades.1.2:
-        "2024-07-10T16:00:01.000Z"
+        "2024-03-14T00:00:01.000Z"
      values.$pastUpgrades.1.1:
-        "0x2f63bbe08a66796dde569281a58a53e0b0f64b7aa067297e9c70455fb8e375bc"
+        "0xedbfdad1f44ea830b863eac45eca4408398351b30511826012882059625963d2"
      values.$pastUpgrades.1.0.0:
-        "0xa919894851548179A0750865e7974DA599C0Fac7"
+        "0xb528D11cC114E026F138fE568744c6D45ce6Da7A"
      values.$pastUpgrades.0.2:
-        "2024-03-14T00:00:01.000Z"
+        "0xb6560306ccb0e772b132a8a6dd78244c0d7ac270c80baba40f95006184926c30"
      values.$pastUpgrades.0.1:
-        "0xedbfdad1f44ea830b863eac45eca4408398351b30511826012882059625963d2"
+        "2025-05-09T16:00:01.000Z"
      values.$pastUpgrades.0.0.0:
-        "0xb528D11cC114E026F138fE568744c6D45ce6Da7A"
+        "0x93e57A196454CB919193fa9946f14943cf733845"
      values.$upgradeCount:
-        2
+        3
      values.version:
-        "1.3.0"
+        "1.4.0"
      values.isIsthmus:
+        true
      implementationNames.0xa919894851548179A0750865e7974DA599C0Fac7:
-        "GasPriceOracle"
      implementationNames.0x93e57A196454CB919193fa9946f14943cf733845:
+        "GasPriceOracle"
    }
```

```diff
    contract L1Block (0x4200000000000000000000000000000000000015) {
    +++ description: Simple contract that returns information about the latest L1 block, which is derived permissionlessly from the L1 chain.
      sourceHashes.1:
-        "0xbdd7533735ef92fffadfbee431b476e72f2f048487c921c5570443e3cba5cb30"
+        "0xb3745d52050d9a2c6bfa6e6e091bdfa43e7c87a22542aa276d323a29431ec108"
      values.$implementation:
-        "0x07dbe8500fc591d1852B76feE44d5a05e13097Ff"
+        "0xFf256497D61dcd71a9e9Ff43967C13fdE1F72D12"
      values.$pastUpgrades.1:
+        ["2024-03-14T00:00:01.000Z","0x9f2b2d34dfa2cb55cceb9860cade0cb03cfbd7ff1dd07d48b4708b29a46b4a24",["0x07dbe8500fc591d1852B76feE44d5a05e13097Ff"]]
      values.$pastUpgrades.0.2:
-        "2024-03-14T00:00:01.000Z"
+        "0xe992e00998b34075506d2726a274db07a62af6cdd9d527bfda9128114603cfbd"
      values.$pastUpgrades.0.1:
-        "0x9f2b2d34dfa2cb55cceb9860cade0cb03cfbd7ff1dd07d48b4708b29a46b4a24"
+        ["0xFf256497D61dcd71a9e9Ff43967C13fdE1F72D12"]
      values.$pastUpgrades.0.0:
-        ["0x07dbe8500fc591d1852B76feE44d5a05e13097Ff"]
+        "2025-05-09T16:00:01.000Z"
      values.$upgradeCount:
-        1
+        2
      values.version:
-        "1.2.0"
+        "1.6.0"
      values.gasPayingToken:
+        {"addr_":"0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE","decimals_":18}
      values.gasPayingTokenName:
+        "Ether"
      values.gasPayingTokenSymbol:
+        "ETH"
      values.isCustomGasToken:
+        false
      implementationNames.0x07dbe8500fc591d1852B76feE44d5a05e13097Ff:
-        "L1Block"
      implementationNames.0xFf256497D61dcd71a9e9Ff43967C13fdE1F72D12:
+        "L1Block"
    }
```

```diff
    contract ProxyAdmin (0x4200000000000000000000000000000000000018) {
    +++ description: None
      directlyReceivedPermissions.16:
+        {"permission":"upgrade","from":"0x4200000000000000000000000000000000000002"}
      directlyReceivedPermissions.15.from:
-        "0x4200000000000000000000000000000000000002"
+        "0x4200000000000000000000000000000000000007"
      directlyReceivedPermissions.14.from:
-        "0x4200000000000000000000000000000000000007"
+        "0x420000000000000000000000000000000000000F"
      directlyReceivedPermissions.13.from:
-        "0x420000000000000000000000000000000000000F"
+        "0x4200000000000000000000000000000000000010"
      directlyReceivedPermissions.12.from:
-        "0x4200000000000000000000000000000000000010"
+        "0x4200000000000000000000000000000000000011"
      directlyReceivedPermissions.11.from:
-        "0x4200000000000000000000000000000000000011"
+        "0x4200000000000000000000000000000000000012"
      directlyReceivedPermissions.10.from:
-        "0x4200000000000000000000000000000000000012"
+        "0x4200000000000000000000000000000000000013"
      directlyReceivedPermissions.9.from:
-        "0x4200000000000000000000000000000000000013"
+        "0x4200000000000000000000000000000000000014"
      directlyReceivedPermissions.8.from:
-        "0x4200000000000000000000000000000000000014"
+        "0x4200000000000000000000000000000000000015"
      directlyReceivedPermissions.7.from:
-        "0x4200000000000000000000000000000000000015"
+        "0x4200000000000000000000000000000000000016"
      directlyReceivedPermissions.6.from:
-        "0x4200000000000000000000000000000000000016"
+        "0x4200000000000000000000000000000000000017"
      directlyReceivedPermissions.5.from:
-        "0x4200000000000000000000000000000000000017"
+        "0x4200000000000000000000000000000000000018"
      directlyReceivedPermissions.4.from:
-        "0x4200000000000000000000000000000000000018"
+        "0x4200000000000000000000000000000000000019"
      directlyReceivedPermissions.3.from:
-        "0x4200000000000000000000000000000000000019"
+        "0x420000000000000000000000000000000000001A"
      directlyReceivedPermissions.2.from:
-        "0x420000000000000000000000000000000000001A"
+        "0x4200000000000000000000000000000000000020"
      directlyReceivedPermissions.1.from:
-        "0x4200000000000000000000000000000000000020"
+        "0x4200000000000000000000000000000000000021"
      directlyReceivedPermissions.0.from:
-        "0x4200000000000000000000000000000000000021"
+        "0x420000000000000000000000000000000000001b"
    }
```

```diff
    contract OperatorFeeVault (0x420000000000000000000000000000000000001b) {
    +++ description: Holds the 'operator fees' for the L2 network, which are part of the L2 fees that users pay.
      name:
-        "Proxy"
+        "OperatorFeeVault"
      sourceHashes.1:
+        "0xc35c98e4b7bad72da3eda4ed9193d928885e62142aaf1ab37e3a298cf7a51371"
      proxyType:
-        "immutable"
+        "EIP1967 proxy"
      values.$immutable:
-        true
      values.$admin:
+        "0x4200000000000000000000000000000000000018"
      values.$implementation:
+        "0x4fa2Be8cd41504037F1838BcE3bCC93bC68Ff537"
      values.$pastUpgrades:
+        [["2025-05-09T16:00:01.000Z","0xf162acc8ebbaf9237755736b62331a4817fe27bbbe3712f473ecfa8fee499f7c",["0x4fa2Be8cd41504037F1838BcE3bCC93bC68Ff537"]]]
      values.$upgradeCount:
+        1
      values.MIN_WITHDRAWAL_AMOUNT:
+        0
      values.minWithdrawalAmount:
+        0
      values.recipient:
+        "0x4200000000000000000000000000000000000019"
      values.RECIPIENT:
+        "0x4200000000000000000000000000000000000019"
      values.totalProcessed:
+        0
      values.version:
+        "1.0.0"
      values.WITHDRAWAL_NETWORK:
+        1
      values.withdrawalNetwork:
+        1
      implementationNames.0x4fa2Be8cd41504037F1838BcE3bCC93bC68Ff537:
+        "OperatorFeeVault"
      template:
+        "opstack/Layer2/OperatorFeeVault"
      description:
+        "Holds the 'operator fees' for the L2 network, which are part of the L2 fees that users pay."
    }
```

```diff
    EOA SuperchainProxyAdminOwner - L2 Alias (0x6B1BAE59D09fCcbdDB6C6cceb07B7279367C4E3b) {
    +++ description: None
      receivedPermissions.16:
+        {"permission":"upgrade","from":"0x4200000000000000000000000000000000000002","via":[{"address":"0x4200000000000000000000000000000000000018"}]}
      receivedPermissions.15.from:
-        "0x4200000000000000000000000000000000000002"
+        "0x4200000000000000000000000000000000000007"
      receivedPermissions.14.from:
-        "0x4200000000000000000000000000000000000007"
+        "0x420000000000000000000000000000000000000F"
      receivedPermissions.13.from:
-        "0x420000000000000000000000000000000000000F"
+        "0x4200000000000000000000000000000000000010"
      receivedPermissions.12.from:
-        "0x4200000000000000000000000000000000000010"
+        "0x4200000000000000000000000000000000000011"
      receivedPermissions.11.from:
-        "0x4200000000000000000000000000000000000011"
+        "0x4200000000000000000000000000000000000012"
      receivedPermissions.10.from:
-        "0x4200000000000000000000000000000000000012"
+        "0x4200000000000000000000000000000000000013"
      receivedPermissions.9.from:
-        "0x4200000000000000000000000000000000000013"
+        "0x4200000000000000000000000000000000000014"
      receivedPermissions.8.from:
-        "0x4200000000000000000000000000000000000014"
+        "0x4200000000000000000000000000000000000015"
      receivedPermissions.7.from:
-        "0x4200000000000000000000000000000000000015"
+        "0x4200000000000000000000000000000000000016"
      receivedPermissions.6.from:
-        "0x4200000000000000000000000000000000000016"
+        "0x4200000000000000000000000000000000000017"
      receivedPermissions.5.from:
-        "0x4200000000000000000000000000000000000017"
+        "0x4200000000000000000000000000000000000018"
      receivedPermissions.4.from:
-        "0x4200000000000000000000000000000000000018"
+        "0x4200000000000000000000000000000000000019"
      receivedPermissions.3.from:
-        "0x4200000000000000000000000000000000000019"
+        "0x420000000000000000000000000000000000001A"
      receivedPermissions.2.from:
-        "0x420000000000000000000000000000000000001A"
+        "0x4200000000000000000000000000000000000020"
      receivedPermissions.1.from:
-        "0x4200000000000000000000000000000000000020"
+        "0x4200000000000000000000000000000000000021"
      receivedPermissions.0.from:
-        "0x4200000000000000000000000000000000000021"
+        "0x420000000000000000000000000000000000001b"
    }
```

## Source code changes

```diff
.../GasPriceOracle/GasPriceOracle.sol              | 531 +++++++++++++++++++-
 .../{.flat@132493968 => .flat}/L1Block/L1Block.sol | 151 +++++-
 .../.flat/OperatorFeeVault/OperatorFeeVault.sol    | 546 +++++++++++++++++++++
 .../OperatorFeeVault/Proxy.p.sol}                  |   0
 4 files changed, 1205 insertions(+), 23 deletions(-)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 132493968 (main branch discovery), not current.

```diff
+   Status: CREATED
    contract Proxy (0x420000000000000000000000000000000000001b)
    +++ description: None
```

Generated with discovered.json: 0x62d3e25f10b25eb492219ff93b745452568b8749

# Diff at Fri, 09 May 2025 10:09:09 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@c3a1d49c07f4092914d62c65181e5fec18a88318 block: 22437740
- current block number: 22437740

## Description

Config related: Move IFs to the editable string for condition configs (yeet IFs from the automatic resolver).

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22437740 (main branch discovery), not current.

```diff
    EOA Optimism EOA 1 (0x352f1defB49718e7Ea411687E850aA8d6299F7aC) {
    +++ description: None
      receivedPermissions.0.via.3.condition:
-        "not revoked by the Security Council"
+        "if not revoked by the Security Council"
      receivedPermissions.0.via.1.address:
-        "0x126a736B18E0a64fBA19D421647A530E327E112C"
+        "0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2"
      receivedPermissions.0.via.1.condition:
-        "restricted to the global pause function"
      receivedPermissions.0.via.0.address:
-        "0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2"
+        "0x126a736B18E0a64fBA19D421647A530E327E112C"
      receivedPermissions.0.via.0.condition:
+        "though restricted to the global pause function"
      directlyReceivedPermissions.0.condition:
-        "restricted to the global pause function"
+        "though restricted to the global pause function"
    }
```

```diff
    contract OpFoundationUpgradeSafe (0x847B5c174615B1B7fDF770882256e2D3E95b9D92) {
    +++ description: None
      receivedPermissions.1.permission:
-        "guard"
+        "interact"
      receivedPermissions.1.from:
-        "0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
+        "0x229047fed2591dbec1eF1118d64F7aF3dB9EB290"
      receivedPermissions.1.via:
-        [{"address":"0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2"},{"address":"0xc2819DC788505Aac350142A7A707BF9D03E3Bd03"},{"address":"0x0454092516c9A4d636d3CAfA1e82161376C8a748","condition":"the number of 0xc2819DC788505Aac350142A7A707BF9D03E3Bd03 members falls below 8."}]
      receivedPermissions.1.description:
+        "it can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system."
      receivedPermissions.0.permission:
-        "interact"
+        "guard"
      receivedPermissions.0.from:
-        "0x229047fed2591dbec1eF1118d64F7aF3dB9EB290"
+        "0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
      receivedPermissions.0.description:
-        "it can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system."
      receivedPermissions.0.via:
+        [{"address":"0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2"},{"address":"0xc2819DC788505Aac350142A7A707BF9D03E3Bd03"},{"address":"0x0454092516c9A4d636d3CAfA1e82161376C8a748","condition":"if the number of 0xc2819DC788505Aac350142A7A707BF9D03E3Bd03 members falls below 8."}]
      directlyReceivedPermissions.0.condition:
-        "the number of 0xc2819DC788505Aac350142A7A707BF9D03E3Bd03 members falls below 8."
+        "if the number of 0xc2819DC788505Aac350142A7A707BF9D03E3Bd03 members falls below 8."
    }
```

```diff
    contract OpFoundationOperationsSafe (0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A) {
    +++ description: None
      receivedPermissions.0.via.1.condition:
-        "not revoked by the Security Council"
+        "if not revoked by the Security Council"
      directlyReceivedPermissions.0.condition:
-        "not revoked by the Security Council"
+        "if not revoked by the Security Council"
    }
```

Generated with discovered.json: 0x784a1fb479970a8645868c1c2acda7c93ad9c7da

# Diff at Thu, 08 May 2025 10:05:18 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@8e1926142ab0c57cc131de4d8da307e13d9af54d block: 22366063
- current block number: 22437740

## Description

Introduction of the DeputyPause Module and the EOA superchain pauser. New dispute games deployed with identical code but 1.6.0 cannon64 prestates.

## Watched changes

```diff
-   Status: DELETED
    contract PermissionedDisputeGame (0x1Ae178eBFEECd51709432EA5f37845Da0414EdFe)
    +++ description: Same as FaultDisputeGame, but only two permissioned addresses are designated as proposer and challenger.
```

```diff
    contract SystemConfig (0x229047fed2591dbec1eF1118d64F7aF3dB9EB290) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      values.eip1559Denominator:
-        0
+        250
      values.eip1559Elasticity:
-        0
+        4
    }
```

```diff
-   Status: DELETED
    contract FaultDisputeGame (0x5738a876359b48A65d35482C93B43e2c1147B32B)
    +++ description: Logic of the dispute game. When a state root is proposed, a dispute game contract is deployed. Challengers can use such contracts to challenge the proposed state root.
```

```diff
    contract OpFoundationOperationsSafe (0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A) {
    +++ description: None
      values.getModules.0:
+        "0x126a736B18E0a64fBA19D421647A530E327E112C"
      values.GnosisSafe_modules.0:
+        "0x126a736B18E0a64fBA19D421647A530E327E112C"
    }
```

```diff
    contract DisputeGameFactory (0xe5965Ab5962eDc7477C8520243A95517CD252fA9) {
    +++ description: The dispute game factory allows the creation of dispute games, used to propose state roots and eventually challenge them.
      values.gameImpls.4:
-        "0x1Ae178eBFEECd51709432EA5f37845Da0414EdFe"
+        "0x89D68b1D63AAA0db4af1163e81f56B76934292F8"
      values.gameImpls.3:
-        "0x5738a876359b48A65d35482C93B43e2c1147B32B"
+        "0xa1E0baCde89d899B3f24eEF3D179cC335A24E777"
    }
```

```diff
+   Status: CREATED
    contract DeputyPauseModule (0x126a736B18E0a64fBA19D421647A530E327E112C)
    +++ description: Allows 0x352f1defB49718e7Ea411687E850aA8d6299F7aC, called the deputy pauser, to act on behalf of the 0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A if set as its Safe module.
```

```diff
+   Status: CREATED
    contract FaultDisputeGame (0x89D68b1D63AAA0db4af1163e81f56B76934292F8)
    +++ description: Logic of the dispute game. When a state root is proposed, a dispute game contract is deployed. Challengers can use such contracts to challenge the proposed state root.
```

```diff
+   Status: CREATED
    contract PermissionedDisputeGame (0xa1E0baCde89d899B3f24eEF3D179cC335A24E777)
    +++ description: Same as FaultDisputeGame, but only two permissioned addresses are designated as proposer and challenger.
```

## Source code changes

```diff
.../optimism/ethereum/.flat/DeputyPauseModule.sol  | 1338 ++++++++++++++++++++
 1 file changed, 1338 insertions(+)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22366063 (main branch discovery), not current.

```diff
    contract PermissionedDisputeGame (0x1Ae178eBFEECd51709432EA5f37845Da0414EdFe) {
    +++ description: Same as FaultDisputeGame, but only two permissioned addresses are designated as proposer and challenger.
      usedTypes.0.arg.0x03682932cec7ce0a3874b19675a6bbc923054a7b321efc7d3835187b172494b6:
+        "v1.6.0 (cannon64)"
    }
```

```diff
    contract FaultDisputeGame (0x5738a876359b48A65d35482C93B43e2c1147B32B) {
    +++ description: Logic of the dispute game. When a state root is proposed, a dispute game contract is deployed. Challengers can use such contracts to challenge the proposed state root.
      usedTypes.0.arg.0x03682932cec7ce0a3874b19675a6bbc923054a7b321efc7d3835187b172494b6:
+        "v1.6.0 (cannon64)"
    }
```

Generated with discovered.json: 0x5562284cade647fc85f194127234bc5583fd7b00

# Diff at Tue, 06 May 2025 10:57:06 GMT:

- chain: optimism
- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@3a394513711f46aa66871603365b6afb40a79057 block: 132493968
- current block number: 132493968

## Description

Marking EOAs if they control the highest number of upgrade permissions in the project.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 132493968 (main branch discovery), not current.

```diff
    EOA SuperchainProxyAdminOwner - L2 Alias (0x6B1BAE59D09fCcbdDB6C6cceb07B7279367C4E3b) {
    +++ description: None
      controlsMajorityOfUpgradePermissions:
+        true
    }
```

Generated with discovered.json: 0x825d9aec929a8b487100a20bfe92a28822972779

# Diff at Wed, 30 Apr 2025 09:41:39 GMT:

- chain: optimism
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@84235dd5417ade9a370db923dce740dd4503b6dc block: 132493968
- current block number: 132493968

## Description

add l2 alias name.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 132493968 (main branch discovery), not current.

```diff
    contract SuperchainProxyAdminOwner - L2 Alias (0x6B1BAE59D09fCcbdDB6C6cceb07B7279367C4E3b) {
    +++ description: None
      name:
+        "SuperchainProxyAdminOwner - L2 Alias"
    }
```

Generated with discovered.json: 0x6df4d35954022633efb387864de3648bd946e3a3

# Diff at Tue, 29 Apr 2025 08:19:24 GMT:

- chain: optimism
- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@ef7477af00fe0b57a2f7cacf7e958c12494af662 block: 132493968
- current block number: 132493968

## Description

Field .issuedPermissions is removed from the output as no longer needed. Added 'permissionsConfigHash' due to refactoring of the modelling process (into a separate command).

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 132493968 (main branch discovery), not current.

```diff
    contract DeployerWhitelist (0x4200000000000000000000000000000000000002) {
    +++ description: Legacy contract that was originally used to act as a whitelist of addresses allowed to the Optimism network. Fully unused and deprecated since the Bedrock upgrade.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x6B1BAE59D09fCcbdDB6C6cceb07B7279367C4E3b","via":[{"address":"0x4200000000000000000000000000000000000018"}]}]
    }
```

```diff
    contract L2CrossDomainMessenger (0x4200000000000000000000000000000000000007) {
    +++ description: The L2CrossDomainMessenger (L2xDM) contract sends messages from L2 to L1, and relays messages from L1 onto L2 with a system tx. In the event that a message sent from L2 to L1 is rejected for exceeding the L1 gas limit, it can be resubmitted via this contract’s replay function.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x6B1BAE59D09fCcbdDB6C6cceb07B7279367C4E3b","via":[{"address":"0x4200000000000000000000000000000000000018"}]}]
    }
```

```diff
    contract GasPriceOracle (0x420000000000000000000000000000000000000F) {
    +++ description: Provides the current gas price for L2 transactions.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x6B1BAE59D09fCcbdDB6C6cceb07B7279367C4E3b","via":[{"address":"0x4200000000000000000000000000000000000018"}]}]
    }
```

```diff
    contract L2StandardBridge (0x4200000000000000000000000000000000000010) {
    +++ description: The L2StandardBridge contract is the main entry point to deposit or withdraw ERC20 tokens from L2 to L1. This contract can store any token.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x6B1BAE59D09fCcbdDB6C6cceb07B7279367C4E3b","via":[{"address":"0x4200000000000000000000000000000000000018"}]}]
    }
```

```diff
    contract SequencerFeeVault (0x4200000000000000000000000000000000000011) {
    +++ description: Collects the sequencer fees, which are withdrawable to the FeesCollector on L1.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x6B1BAE59D09fCcbdDB6C6cceb07B7279367C4E3b","via":[{"address":"0x4200000000000000000000000000000000000018"}]}]
    }
```

```diff
    contract OptimismMintableERC20Factory (0x4200000000000000000000000000000000000012) {
    +++ description: Factory contract to create bridge compliant ERC20 IOU token representations of bridged L1 ERC20 tokens.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x6B1BAE59D09fCcbdDB6C6cceb07B7279367C4E3b","via":[{"address":"0x4200000000000000000000000000000000000018"}]}]
    }
```

```diff
    contract L1BlockNumber (0x4200000000000000000000000000000000000013) {
    +++ description: Simple contract that returns the latest L1 block number.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x6B1BAE59D09fCcbdDB6C6cceb07B7279367C4E3b","via":[{"address":"0x4200000000000000000000000000000000000018"}]}]
    }
```

```diff
    contract L2ERC721Bridge (0x4200000000000000000000000000000000000014) {
    +++ description: The L2ERC721Bridge contract is the main entry point to deposit or withdraw ERC721 tokens from L2 to L1. This contract can store any token.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x6B1BAE59D09fCcbdDB6C6cceb07B7279367C4E3b","via":[{"address":"0x4200000000000000000000000000000000000018"}]}]
    }
```

```diff
    contract L1Block (0x4200000000000000000000000000000000000015) {
    +++ description: Simple contract that returns information about the latest L1 block, which is derived permissionlessly from the L1 chain.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x6B1BAE59D09fCcbdDB6C6cceb07B7279367C4E3b","via":[{"address":"0x4200000000000000000000000000000000000018"}]}]
    }
```

```diff
    contract L2ToL1MessagePasser (0x4200000000000000000000000000000000000016) {
    +++ description: Contract used internally by the L2CrossDomainMessenger to send messages to L1, including withdrawals. It can also be used directly as a low-level interface.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x6B1BAE59D09fCcbdDB6C6cceb07B7279367C4E3b","via":[{"address":"0x4200000000000000000000000000000000000018"}]}]
    }
```

```diff
    contract OptimismMintableERC721Factory (0x4200000000000000000000000000000000000017) {
    +++ description: Factory contract to create bridge compliant ERC721 IOU token representations of bridged L1 ERC721 tokens.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x6B1BAE59D09fCcbdDB6C6cceb07B7279367C4E3b","via":[{"address":"0x4200000000000000000000000000000000000018"}]}]
    }
```

```diff
    contract ProxyAdmin (0x4200000000000000000000000000000000000018) {
    +++ description: None
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x6B1BAE59D09fCcbdDB6C6cceb07B7279367C4E3b","via":[{"address":"0x4200000000000000000000000000000000000018"}]}]
    }
```

```diff
    contract BaseFeeVault (0x4200000000000000000000000000000000000019) {
    +++ description: Collects EIP-1559 base fees, which are withdrawable to the FeesCollector on L1.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x6B1BAE59D09fCcbdDB6C6cceb07B7279367C4E3b","via":[{"address":"0x4200000000000000000000000000000000000018"}]}]
    }
```

```diff
    contract L1FeeVault (0x420000000000000000000000000000000000001A) {
    +++ description: Collects the L1 portion of the L2 transaction fees, which are withdrawable to the FeesCollector on L1.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x6B1BAE59D09fCcbdDB6C6cceb07B7279367C4E3b","via":[{"address":"0x4200000000000000000000000000000000000018"}]}]
    }
```

```diff
    contract SchemaRegistry (0x4200000000000000000000000000000000000020) {
    +++ description: Contracts to register schemas for the Ethereum Attestation Service (EAS).
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x6B1BAE59D09fCcbdDB6C6cceb07B7279367C4E3b","via":[{"address":"0x4200000000000000000000000000000000000018"}]}]
    }
```

```diff
    contract EAS (0x4200000000000000000000000000000000000021) {
    +++ description: Contract containing the main logic for the Ethereum Attestation Service (EAS).
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x6B1BAE59D09fCcbdDB6C6cceb07B7279367C4E3b","via":[{"address":"0x4200000000000000000000000000000000000018"}]}]
    }
```

```diff
    contract MintManager (0x5C4e7Ba1E219E47948e6e3F55019A647bA501005) {
    +++ description: Controls the OP inflation rate, which is currently hardcoded to 2% annually.
      issuedPermissions:
-        [{"permission":"interact","to":"0x2A82Ae142b2e62Cb7D10b55E323ACB1Cab663a26","description":"change the OP token owner to a different MintManager and therefore change the inflation policy.","via":[]}]
    }
```

Generated with discovered.json: 0xea9d4ca150b5a9b161ae82d6d7796eeb8116ac22

# Diff at Tue, 29 Apr 2025 08:19:24 GMT:

- chain: ethereum
- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@ef7477af00fe0b57a2f7cacf7e958c12494af662 block: 22366063
- current block number: 22366063

## Description

Field .issuedPermissions is removed from the output as no longer needed. Added 'permissionsConfigHash' due to refactoring of the modelling process (into a separate command).

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22366063 (main branch discovery), not current.

```diff
    contract LivenessModule (0x0454092516c9A4d636d3CAfA1e82161376C8a748) {
    +++ description: used to remove members inactive for 98d while making sure that the threshold remains above 75%. If the number of members falls below 8, the 0x847B5c174615B1B7fDF770882256e2D3E95b9D92 takes ownership of the multisig
      issuedPermissions:
-        [{"permission":"interact","to":"0x24424336F04440b1c28685a38303aC33C9D14a25","description":"can remove members of 0xc2819DC788505Aac350142A7A707BF9D03E3Bd03 inactive for 98d.","via":[]}]
    }
```

```diff
    contract AnchorStateRegistry (0x1c68ECfbf9C8B1E6C0677965b3B9Ecf9A104305b) {
    +++ description: Contains the latest confirmed state root that can be used as a starting point in a dispute game.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A","via":[{"address":"0x543bA4AADBAb8f9025686Bd03993043599c6fB04"}]}]
    }
```

```diff
    contract DelayedWETH_PermissionedGames (0x21429aF66058BC3e4aE4a8f2EC4531AaC433ecbC) {
    +++ description: Contract designed to hold the bonded ETH for each game. It is designed as a wrapper around WETH to allow an owner to function as a backstop if a game would incorrectly distribute funds.
      issuedPermissions:
-        [{"permission":"interact","to":"0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A","description":"can pull funds from the contract in case of emergency.","via":[]},{"permission":"upgrade","to":"0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A","via":[{"address":"0x543bA4AADBAb8f9025686Bd03993043599c6fB04"}]}]
    }
```

```diff
    contract SystemConfig (0x229047fed2591dbec1eF1118d64F7aF3dB9EB290) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      issuedPermissions:
-        [{"permission":"interact","to":"0x847B5c174615B1B7fDF770882256e2D3E95b9D92","description":"it can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system.","via":[]},{"permission":"sequence","to":"0x6887246668a3b87F54DeB3b94Ba47a6f63F32985","via":[]},{"permission":"upgrade","to":"0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A","via":[{"address":"0x543bA4AADBAb8f9025686Bd03993043599c6fB04"}]}]
    }
```

```diff
    contract DelayedWETH_PermissionlessGames (0x323dFC63c9B83CB83f40325AaB74b245937cbdF0) {
    +++ description: Contract designed to hold the bonded ETH for each game. It is designed as a wrapper around WETH to allow an owner to function as a backstop if a game would incorrectly distribute funds.
      issuedPermissions:
-        [{"permission":"interact","to":"0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A","description":"can pull funds from the contract in case of emergency.","via":[]},{"permission":"upgrade","to":"0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A","via":[{"address":"0x543bA4AADBAb8f9025686Bd03993043599c6fB04"}]}]
    }
```

```diff
    contract L1ERC721Bridge (0x5a7749f83b81B301cAb5f48EB8516B986DAef23D) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A","via":[{"address":"0x543bA4AADBAb8f9025686Bd03993043599c6fB04"}]}]
    }
```

```diff
    contract OptimismMintableERC20Factory (0x75505a97BD334E7BD3C476893285569C4136Fa0F) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A","via":[{"address":"0x543bA4AADBAb8f9025686Bd03993043599c6fB04"}]}]
    }
```

```diff
    contract SuperchainConfig (0x95703e0982140D16f8ebA6d158FccEde42f04a4C) {
    +++ description: Used to manage global configuration values for multiple OP Chains within a single Superchain network. The SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the Superchain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      issuedPermissions:
-        [{"permission":"guard","to":"0x847B5c174615B1B7fDF770882256e2D3E95b9D92","via":[{"address":"0x0454092516c9A4d636d3CAfA1e82161376C8a748","condition":"the number of 0xc2819DC788505Aac350142A7A707BF9D03E3Bd03 members falls below 8."},{"address":"0xc2819DC788505Aac350142A7A707BF9D03E3Bd03"},{"address":"0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2"}]},{"permission":"guard","to":"0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A","via":[{"address":"0xc6901F65369FC59fC1B4D6D6bE7A2318Ff38dB5B","condition":"not revoked by the Security Council"},{"address":"0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2"}]},{"permission":"guard","to":"0xc2819DC788505Aac350142A7A707BF9D03E3Bd03","via":[{"address":"0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2"}]},{"permission":"upgrade","to":"0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A","via":[{"address":"0x543bA4AADBAb8f9025686Bd03993043599c6fB04"}]}]
    }
```

```diff
    contract L1StandardBridge (0x99C9fc46f92E8a1c0deC1b1747d010903E884bE1) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A","description":"upgrading the bridge implementation can give access to all funds escrowed therein.","via":[{"address":"0x543bA4AADBAb8f9025686Bd03993043599c6fB04"}]}]
    }
```

```diff
    contract OptimismPortal2 (0xbEb5Fc579115071764c7423A4f12eDde41f106Ed) {
    +++ description: The OptimismPortal contract is the main entry point to deposit funds from L1 to L2. It also allows to prove and finalize withdrawals. It specifies which game type can be used for withdrawals, which currently is the FaultDisputeGame.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A","via":[{"address":"0x543bA4AADBAb8f9025686Bd03993043599c6fB04"}]}]
    }
```

```diff
    contract AddressManager (0xdE1FCfB0851916CA5101820A69b13a4E276bd81F) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      issuedPermissions:
-        [{"permission":"interact","to":"0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A","description":"set and change address mappings.","via":[{"address":"0x543bA4AADBAb8f9025686Bd03993043599c6fB04"}]}]
    }
```

```diff
    contract DisputeGameFactory (0xe5965Ab5962eDc7477C8520243A95517CD252fA9) {
    +++ description: The dispute game factory allows the creation of dispute games, used to propose state roots and eventually challenge them.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A","via":[{"address":"0x543bA4AADBAb8f9025686Bd03993043599c6fB04"}]}]
    }
```

Generated with discovered.json: 0x70aa5c2cc63540a8960dce0317a3d86e136a946c

# Diff at Mon, 28 Apr 2025 07:26:55 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@eab7fd7faeb51149b02aa194788c8c00acde6c43 block: 22346267
- current block number: 22366063

## Description

DelayedWETH owners upgraded to the SuperchainProxyAdminOwner. Under review removed.

## Watched changes

```diff
    contract DelayedWETH_PermissionedGames (0x21429aF66058BC3e4aE4a8f2EC4531AaC433ecbC) {
    +++ description: Contract designed to hold the bonded ETH for each game. It is designed as a wrapper around WETH to allow an owner to function as a backstop if a game would incorrectly distribute funds.
      issuedPermissions.0.to:
-        "0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A"
+        "0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A"
      values.owner:
-        "0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A"
+        "0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A"
    }
```

```diff
    contract DelayedWETH_PermissionlessGames (0x323dFC63c9B83CB83f40325AaB74b245937cbdF0) {
    +++ description: Contract designed to hold the bonded ETH for each game. It is designed as a wrapper around WETH to allow an owner to function as a backstop if a game would incorrectly distribute funds.
      issuedPermissions.0.to:
-        "0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A"
+        "0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A"
      values.owner:
-        "0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A"
+        "0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A"
    }
```

```diff
    contract SuperchainProxyAdminOwner (0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A) {
    +++ description: None
      receivedPermissions.12:
+        {"permission":"upgrade","from":"0x323dFC63c9B83CB83f40325AaB74b245937cbdF0","via":[{"address":"0x543bA4AADBAb8f9025686Bd03993043599c6fB04"}]}
      receivedPermissions.11:
+        {"permission":"upgrade","from":"0x5a7749f83b81B301cAb5f48EB8516B986DAef23D","via":[{"address":"0x543bA4AADBAb8f9025686Bd03993043599c6fB04"}]}
      receivedPermissions.10.permission:
-        "upgrade"
+        "interact"
      receivedPermissions.10.via:
-        [{"address":"0x543bA4AADBAb8f9025686Bd03993043599c6fB04"}]
      receivedPermissions.10.description:
+        "can pull funds from the contract in case of emergency."
      receivedPermissions.9.permission:
-        "upgrade"
+        "interact"
      receivedPermissions.9.from:
-        "0x5a7749f83b81B301cAb5f48EB8516B986DAef23D"
+        "0xdE1FCfB0851916CA5101820A69b13a4E276bd81F"
      receivedPermissions.9.description:
+        "set and change address mappings."
      receivedPermissions.8.permission:
-        "interact"
+        "upgrade"
      receivedPermissions.8.from:
-        "0xdE1FCfB0851916CA5101820A69b13a4E276bd81F"
+        "0x21429aF66058BC3e4aE4a8f2EC4531AaC433ecbC"
      receivedPermissions.8.description:
-        "set and change address mappings."
      receivedPermissions.7.from:
-        "0x21429aF66058BC3e4aE4a8f2EC4531AaC433ecbC"
+        "0x229047fed2591dbec1eF1118d64F7aF3dB9EB290"
      receivedPermissions.6.from:
-        "0x229047fed2591dbec1eF1118d64F7aF3dB9EB290"
+        "0x75505a97BD334E7BD3C476893285569C4136Fa0F"
      receivedPermissions.5.from:
-        "0x75505a97BD334E7BD3C476893285569C4136Fa0F"
+        "0x99C9fc46f92E8a1c0deC1b1747d010903E884bE1"
      receivedPermissions.5.description:
+        "upgrading the bridge implementation can give access to all funds escrowed therein."
      receivedPermissions.4.permission:
-        "upgrade"
+        "interact"
      receivedPermissions.4.from:
-        "0x99C9fc46f92E8a1c0deC1b1747d010903E884bE1"
+        "0x21429aF66058BC3e4aE4a8f2EC4531AaC433ecbC"
      receivedPermissions.4.description:
-        "upgrading the bridge implementation can give access to all funds escrowed therein."
+        "can pull funds from the contract in case of emergency."
      receivedPermissions.4.via:
-        [{"address":"0x543bA4AADBAb8f9025686Bd03993043599c6fB04"}]
    }
```

```diff
    contract OpFoundationOperationsSafe (0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A) {
    +++ description: None
      receivedPermissions.2:
-        {"permission":"interact","from":"0x323dFC63c9B83CB83f40325AaB74b245937cbdF0","description":"can pull funds from the contract in case of emergency."}
      receivedPermissions.1:
-        {"permission":"interact","from":"0x21429aF66058BC3e4aE4a8f2EC4531AaC433ecbC","description":"can pull funds from the contract in case of emergency."}
    }
```

Generated with discovered.json: 0x4028119b91831a011bcc3bcced5b8dbd9ff6187e

# Diff at Fri, 25 Apr 2025 13:14:46 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@652ccb636c46013db1624f1ac3562cb4dcbc059b block: 22273522
- current block number: 22346267

## Description

[Isthmus upgrade](https://vote.optimism.io/proposals/8705916809146420472067303211131851783087744913535435360574720946039078686841):
- upgraded proof system VM: MIPS (MT-Cannon MIPS64)
- operator fee (fee mechanism to improve fee config for zk proven and alt-DA systems)
- pectra readiness

## Watched changes

```diff
    contract SystemConfig (0x229047fed2591dbec1eF1118d64F7aF3dB9EB290) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      sourceHashes.0:
-        "0x6e293d82eb36a83fb5d8b06268cd4fbf46027b87eea77fcc68f78e4b010a3774"
+        "0x921de6fc906d159fdcef862d2b9559063f5e7b9b7588fa5f33153360ddf296e7"
      values.$implementation:
-        "0x760C48C62A85045A6B69f07F4a9f22868659CbCc"
+        "0x340f923E5c7cbB2171146f64169EC9d5a9FfE647"
      values.$pastUpgrades.10:
+        ["2025-01-24T14:41:35.000Z","0x86da7386a26978c3db89e97c1f4feee613a8a0c07bbe4640624b05276f49c350",["0xAB9d6cB7A427c0765163A7f45BB91cAfe5f2D375"]]
      values.$pastUpgrades.9.1:
-        ["0xAB9d6cB7A427c0765163A7f45BB91cAfe5f2D375"]
+        "0x86da7386a26978c3db89e97c1f4feee613a8a0c07bbe4640624b05276f49c350"
      values.$pastUpgrades.9.0:
-        "0x86da7386a26978c3db89e97c1f4feee613a8a0c07bbe4640624b05276f49c350"
+        ["0xd81f43eDBCAcb4c29a9bA38a13Ee5d79278270cC"]
      values.$pastUpgrades.8.2:
-        "2025-01-24T14:41:35.000Z"
+        ["0xba2492e52F45651B60B8B38d4Ea5E2390C64Ffb1"]
      values.$pastUpgrades.8.1:
-        "0x86da7386a26978c3db89e97c1f4feee613a8a0c07bbe4640624b05276f49c350"
+        "0x4758bd62359bc69d7e8a0faaf5308d826379c23258d689a7430d5c0ad0361ad2"
      values.$pastUpgrades.8.0:
-        ["0xd81f43eDBCAcb4c29a9bA38a13Ee5d79278270cC"]
+        "2024-04-11T20:49:59.000Z"
      values.$pastUpgrades.7.2:
-        ["0xba2492e52F45651B60B8B38d4Ea5E2390C64Ffb1"]
+        "0x5f3530e593bbac37c61dc5b7755b6a40c06c20c1a3a1b13fca5b7d00cde65c29"
      values.$pastUpgrades.7.1:
-        "0x4758bd62359bc69d7e8a0faaf5308d826379c23258d689a7430d5c0ad0361ad2"
+        "2025-04-02T16:50:23.000Z"
      values.$pastUpgrades.7.0:
-        "2024-04-11T20:49:59.000Z"
+        ["0x760C48C62A85045A6B69f07F4a9f22868659CbCc"]
      values.$pastUpgrades.6.2:
-        "0x5f3530e593bbac37c61dc5b7755b6a40c06c20c1a3a1b13fca5b7d00cde65c29"
+        "0x76bceccd7d44656f5a129a600a6120091570b897c1d45c18cd7134cfe67c2537"
      values.$pastUpgrades.6.1:
-        "2025-04-02T16:50:23.000Z"
+        ["0x5efa852e92800D1C982711761e45c3FE39a2b6D8"]
      values.$pastUpgrades.6.0:
-        ["0x760C48C62A85045A6B69f07F4a9f22868659CbCc"]
+        "2023-06-06T15:58:47.000Z"
      values.$pastUpgrades.5.2:
-        "0x76bceccd7d44656f5a129a600a6120091570b897c1d45c18cd7134cfe67c2537"
+        "0xbe810ed6e1e827930bd46cde42c4883662ddb6d244a26af2f0409cc2782bee61"
      values.$pastUpgrades.5.1.0:
-        "0x5efa852e92800D1C982711761e45c3FE39a2b6D8"
+        "0xF56D96B2535B932656d3c04Ebf51baBff241D886"
      values.$pastUpgrades.5.0:
-        "2023-06-06T15:58:47.000Z"
+        "2024-06-10T16:42:59.000Z"
      values.$pastUpgrades.4.2:
-        "0xbe810ed6e1e827930bd46cde42c4883662ddb6d244a26af2f0409cc2782bee61"
+        ["0xd81f43eDBCAcb4c29a9bA38a13Ee5d79278270cC"]
      values.$pastUpgrades.4.1:
-        ["0xF56D96B2535B932656d3c04Ebf51baBff241D886"]
+        "2024-02-26T21:44:11.000Z"
      values.$pastUpgrades.4.0:
-        "2024-06-10T16:42:59.000Z"
+        "0x3f7c36a1d636cdb23bf4f9171c27ebe58b73f4c0e6a33dbaac2c2f3c142faf50"
      values.$pastUpgrades.3.2:
-        ["0xd81f43eDBCAcb4c29a9bA38a13Ee5d79278270cC"]
+        "0xbe810ed6e1e827930bd46cde42c4883662ddb6d244a26af2f0409cc2782bee61"
      values.$pastUpgrades.3.1:
-        "2024-02-26T21:44:11.000Z"
+        ["0xd81f43eDBCAcb4c29a9bA38a13Ee5d79278270cC"]
      values.$pastUpgrades.3.0:
-        "0x3f7c36a1d636cdb23bf4f9171c27ebe58b73f4c0e6a33dbaac2c2f3c142faf50"
+        "2024-06-10T16:42:59.000Z"
      values.$pastUpgrades.2.2:
-        "0xbe810ed6e1e827930bd46cde42c4883662ddb6d244a26af2f0409cc2782bee61"
+        "0x4758bd62359bc69d7e8a0faaf5308d826379c23258d689a7430d5c0ad0361ad2"
      values.$pastUpgrades.2.0:
-        "2024-06-10T16:42:59.000Z"
+        "2024-04-11T20:49:59.000Z"
      values.$pastUpgrades.1.2:
-        "0x4758bd62359bc69d7e8a0faaf5308d826379c23258d689a7430d5c0ad0361ad2"
+        "2024-02-26T21:44:11.000Z"
      values.$pastUpgrades.1.1:
-        ["0xd81f43eDBCAcb4c29a9bA38a13Ee5d79278270cC"]
+        "0x3f7c36a1d636cdb23bf4f9171c27ebe58b73f4c0e6a33dbaac2c2f3c142faf50"
      values.$pastUpgrades.1.0:
-        "2024-04-11T20:49:59.000Z"
+        ["0x33A032ec93Ec0C492Ec4BF0B30D5f51986E5a314"]
      values.$pastUpgrades.0.2:
-        "2024-02-26T21:44:11.000Z"
+        "2025-04-24T16:16:23.000Z"
      values.$pastUpgrades.0.1:
-        "0x3f7c36a1d636cdb23bf4f9171c27ebe58b73f4c0e6a33dbaac2c2f3c142faf50"
+        "0xbe44244e352a9ffa67ad7f7133e9ed014b380e4b1bd789419e6d33aaad780d12"
      values.$pastUpgrades.0.0.0:
-        "0x33A032ec93Ec0C492Ec4BF0B30D5f51986E5a314"
+        "0x340f923E5c7cbB2171146f64169EC9d5a9FfE647"
      values.$upgradeCount:
-        10
+        11
      values.version:
-        "2.4.0"
+        "2.5.0"
      values.operatorFeeConstant:
+        0
      values.operatorFeeScalar:
+        0
    }
```

```diff
    contract L1CrossDomainMessenger (0x25ace71c97B33Cc4729CF772ae268934F7ab5fA1) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      sourceHashes.1:
-        "0xfaa50769db48b1d2c04c06a8a0a4771b87b3c0ff20a508115bfdb2b576fdb454"
+        "0x03bcdc719cb7bd0a1377c01bb50b30a6122b308f673b7d7b15a3bb8628e6bd8c"
      values.$implementation:
-        "0x3eA6084748ED1b2A9B5D4426181F1ad8C93F6231"
+        "0x5D5a095665886119693F0B41d8DFeE78da033e8B"
      values.$pastUpgrades.11:
+        ["2023-06-06T18:24:11.000Z","0xe2ff41f9bdf03d5455f55539b8b9c350276a179ca7f79322e2077d7c1ffb1268",["0x2150Bc3c64cbfDDbaC9815EF615D6AB8671bfe43"]]
      values.$pastUpgrades.10.2:
-        "2023-06-06T18:24:11.000Z"
+        "0x2625aa2013fd1a650fb0264d2746be597e12f846baa48a68fe14539c200ed6dc"
      values.$pastUpgrades.10.1:
-        "0xe2ff41f9bdf03d5455f55539b8b9c350276a179ca7f79322e2077d7c1ffb1268"
+        "2021-11-11T17:37:56.000Z"
      values.$pastUpgrades.10.0.0:
-        "0x2150Bc3c64cbfDDbaC9815EF615D6AB8671bfe43"
+        "0x0000000000000000000000000000000000000000"
      values.$pastUpgrades.9.2:
-        "0x2625aa2013fd1a650fb0264d2746be597e12f846baa48a68fe14539c200ed6dc"
+        "0x5f3530e593bbac37c61dc5b7755b6a40c06c20c1a3a1b13fca5b7d00cde65c29"
      values.$pastUpgrades.9.1:
-        "2021-11-11T17:37:56.000Z"
+        ["0x3eA6084748ED1b2A9B5D4426181F1ad8C93F6231"]
      values.$pastUpgrades.9.0:
-        ["0x0000000000000000000000000000000000000000"]
+        "2025-04-02T16:50:23.000Z"
      values.$pastUpgrades.8.2:
-        "0x5f3530e593bbac37c61dc5b7755b6a40c06c20c1a3a1b13fca5b7d00cde65c29"
+        "0xd19d40f11c375feeea5fe47576ce98a3a08caac68b2a8a52fb95dd1a76dd205a"
      values.$pastUpgrades.8.1:
-        ["0x3eA6084748ED1b2A9B5D4426181F1ad8C93F6231"]
+        "2021-06-22T22:29:27.000Z"
      values.$pastUpgrades.8.0:
-        "2025-04-02T16:50:23.000Z"
+        ["0x16393737D09d2722AD13DcA3cA8C3DB957699F1D"]
      values.$pastUpgrades.7.2:
-        "0xd19d40f11c375feeea5fe47576ce98a3a08caac68b2a8a52fb95dd1a76dd205a"
+        ["0x5D5a095665886119693F0B41d8DFeE78da033e8B"]
      values.$pastUpgrades.7.1:
-        "2021-06-22T22:29:27.000Z"
+        "2025-04-24T16:16:23.000Z"
      values.$pastUpgrades.7.0:
-        ["0x16393737D09d2722AD13DcA3cA8C3DB957699F1D"]
+        "0xbe44244e352a9ffa67ad7f7133e9ed014b380e4b1bd789419e6d33aaad780d12"
      values.$upgradeCount:
-        11
+        12
      values.version:
-        "2.5.0"
+        "2.6.0"
      values.ENCODING_OVERHEAD:
+        260
      values.FLOOR_CALLDATA_OVERHEAD:
+        40
      values.TX_BASE_GAS:
+        21000
    }
```

```diff
    contract L1ERC721Bridge (0x5a7749f83b81B301cAb5f48EB8516B986DAef23D) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      sourceHashes.1:
-        "0x9de28f19e0d1200bf0afda5ab90c9d2dffa44a775e71cfe9232ee1808338996c"
+        "0x28669b49da3effd51f0f9424ca9cdd455c5b9327c09a40c65fc06f114a6eb837"
      values.$implementation:
-        "0x276d3730f219f7ec22274f7263180b8452B46d47"
+        "0x7aE1d3BD877a4C5CA257404ce26BE93A02C98013"
      values.$pastUpgrades.7:
+        ["2025-04-02T16:50:23.000Z","0x5f3530e593bbac37c61dc5b7755b6a40c06c20c1a3a1b13fca5b7d00cde65c29",["0x276d3730f219f7ec22274f7263180b8452B46d47"]]
      values.$pastUpgrades.6.2:
-        "0x5f3530e593bbac37c61dc5b7755b6a40c06c20c1a3a1b13fca5b7d00cde65c29"
+        ["0xAE2AF01232a6c4a4d3012C5eC5b1b35059caF10d"]
      values.$pastUpgrades.6.1:
-        "2025-04-02T16:50:23.000Z"
+        "0x4758bd62359bc69d7e8a0faaf5308d826379c23258d689a7430d5c0ad0361ad2"
      values.$pastUpgrades.6.0:
-        ["0x276d3730f219f7ec22274f7263180b8452B46d47"]
+        "2024-04-11T20:49:59.000Z"
      values.$pastUpgrades.5.2:
-        ["0xAE2AF01232a6c4a4d3012C5eC5b1b35059caF10d"]
+        "0xe8f632050cdf538eebcc5ab4a0ecb426966acfd14118e4fb8b181948449ae70d"
      values.$pastUpgrades.5.1:
-        "0x4758bd62359bc69d7e8a0faaf5308d826379c23258d689a7430d5c0ad0361ad2"
+        "2022-10-04T22:08:59.000Z"
      values.$pastUpgrades.5.0:
-        "2024-04-11T20:49:59.000Z"
+        ["0x3268Ed09f76e619331528270B6267D4d2C5Ab5C2"]
      values.$pastUpgrades.4.2:
-        "0xe8f632050cdf538eebcc5ab4a0ecb426966acfd14118e4fb8b181948449ae70d"
+        "2023-06-06T18:24:11.000Z"
      values.$pastUpgrades.4.1:
-        "2022-10-04T22:08:59.000Z"
+        "0xe2ff41f9bdf03d5455f55539b8b9c350276a179ca7f79322e2077d7c1ffb1268"
      values.$pastUpgrades.3.2:
-        "2023-06-06T18:24:11.000Z"
+        ["0xd81f43eDBCAcb4c29a9bA38a13Ee5d79278270cC"]
      values.$pastUpgrades.3.1:
-        "0xe2ff41f9bdf03d5455f55539b8b9c350276a179ca7f79322e2077d7c1ffb1268"
+        "2024-02-26T21:44:11.000Z"
      values.$pastUpgrades.3.0:
-        ["0x3268Ed09f76e619331528270B6267D4d2C5Ab5C2"]
+        "0x3f7c36a1d636cdb23bf4f9171c27ebe58b73f4c0e6a33dbaac2c2f3c142faf50"
      values.$pastUpgrades.2.2.0:
-        "0xd81f43eDBCAcb4c29a9bA38a13Ee5d79278270cC"
+        "0xc599Fa757c2bCaA5aE3753Ab129237F38C10da0b"
      values.$pastUpgrades.1.2:
-        ["0xc599Fa757c2bCaA5aE3753Ab129237F38C10da0b"]
+        "0x4758bd62359bc69d7e8a0faaf5308d826379c23258d689a7430d5c0ad0361ad2"
      values.$pastUpgrades.1.1:
-        "2024-02-26T21:44:11.000Z"
+        ["0xd81f43eDBCAcb4c29a9bA38a13Ee5d79278270cC"]
      values.$pastUpgrades.1.0:
-        "0x3f7c36a1d636cdb23bf4f9171c27ebe58b73f4c0e6a33dbaac2c2f3c142faf50"
+        "2024-04-11T20:49:59.000Z"
      values.$pastUpgrades.0.2:
-        "0x4758bd62359bc69d7e8a0faaf5308d826379c23258d689a7430d5c0ad0361ad2"
+        ["0x7aE1d3BD877a4C5CA257404ce26BE93A02C98013"]
      values.$pastUpgrades.0.1:
-        ["0xd81f43eDBCAcb4c29a9bA38a13Ee5d79278270cC"]
+        "2025-04-24T16:16:23.000Z"
      values.$pastUpgrades.0.0:
-        "2024-04-11T20:49:59.000Z"
+        "0xbe44244e352a9ffa67ad7f7133e9ed014b380e4b1bd789419e6d33aaad780d12"
      values.$upgradeCount:
-        7
+        8
      values.version:
-        "2.3.1"
+        "2.4.0"
    }
```

```diff
    contract L1StandardBridge (0x99C9fc46f92E8a1c0deC1b1747d010903E884bE1) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      sourceHashes.1:
-        "0x4a2d83507f25be218f504b76815e4494138af88734cc54d34666c631aea88af5"
+        "0x18e98a64fbfe011a7514d7a547900c02a3e0f9a49ab3413d517fd7e0e3c539dd"
      sourceHashes.0:
-        "0x18e98a64fbfe011a7514d7a547900c02a3e0f9a49ab3413d517fd7e0e3c539dd"
+        "0x4e15d99844dc5a4304c2396a66c95ec41218ea311c8e524b118fad7beed0bb53"
      values.$implementation:
-        "0x78972E88Ab8BBB517a36cAea23b931BAB58AD3c6"
+        "0x0b09ba359A106C9ea3b181CBc5F394570c7d2a7A"
      values.version:
-        "2.2.2"
+        "2.3.0"
    }
```

```diff
-   Status: DELETED
    contract MIPS (0xaA59A0777648BC75cd10364083e878c1cCd6112a)
    +++ description: The MIPS contract is used to execute the final step of the dispute game which objectively determines the winner of the dispute.
```

```diff
-   Status: DELETED
    contract FaultDisputeGame (0xbA94955CA3422fC57f9D982a0BaD2a9c88e2a9D0)
    +++ description: Logic of the dispute game. When a state root is proposed, a dispute game contract is deployed. Challengers can use such contracts to challenge the proposed state root.
```

```diff
    contract OptimismPortal2 (0xbEb5Fc579115071764c7423A4f12eDde41f106Ed) {
    +++ description: The OptimismPortal contract is the main entry point to deposit funds from L1 to L2. It also allows to prove and finalize withdrawals. It specifies which game type can be used for withdrawals, which currently is the FaultDisputeGame.
      sourceHashes.1:
-        "0x67ee16b5b6c32cdcc862bea390e45017908e6945cfaa01d3ef75dc9de7c9d946"
+        "0xc483ef9e0a5ec2a0450732e743b3784de0cd3876b8fadfce14c0805a0846d26b"
      values.$implementation:
-        "0x2D7e764a0D9919e16983a46595CfA81fc34fa7Cd"
+        "0xB443Da3e07052204A02d630a8933dAc05a0d6fB4"
      values.$pastUpgrades.8:
+        ["2024-06-10T16:42:59.000Z","0xbe810ed6e1e827930bd46cde42c4883662ddb6d244a26af2f0409cc2782bee61",["0xe2F826324b2faf99E513D16D266c3F80aE87832B"]]
      values.$pastUpgrades.7.2.0:
-        "0xe2F826324b2faf99E513D16D266c3F80aE87832B"
+        "0x28a55488fef40005309e2DA0040DbE9D300a64AB"
      values.$pastUpgrades.7.1:
-        "0xbe810ed6e1e827930bd46cde42c4883662ddb6d244a26af2f0409cc2782bee61"
+        "2023-06-06T18:24:11.000Z"
      values.$pastUpgrades.7.0:
-        "2024-06-10T16:42:59.000Z"
+        "0xe2ff41f9bdf03d5455f55539b8b9c350276a179ca7f79322e2077d7c1ffb1268"
      values.$pastUpgrades.6.2:
-        ["0x28a55488fef40005309e2DA0040DbE9D300a64AB"]
+        "0x5f3530e593bbac37c61dc5b7755b6a40c06c20c1a3a1b13fca5b7d00cde65c29"
      values.$pastUpgrades.6.1:
-        "2023-06-06T18:24:11.000Z"
+        "2025-04-02T16:50:23.000Z"
      values.$pastUpgrades.6.0:
-        "0xe2ff41f9bdf03d5455f55539b8b9c350276a179ca7f79322e2077d7c1ffb1268"
+        ["0x2D7e764a0D9919e16983a46595CfA81fc34fa7Cd"]
      values.$pastUpgrades.5.2:
-        "0x5f3530e593bbac37c61dc5b7755b6a40c06c20c1a3a1b13fca5b7d00cde65c29"
+        ["0xB443Da3e07052204A02d630a8933dAc05a0d6fB4"]
      values.$pastUpgrades.5.1:
-        "2025-04-02T16:50:23.000Z"
+        "2025-04-24T16:16:23.000Z"
      values.$pastUpgrades.5.0:
-        ["0x2D7e764a0D9919e16983a46595CfA81fc34fa7Cd"]
+        "0xbe44244e352a9ffa67ad7f7133e9ed014b380e4b1bd789419e6d33aaad780d12"
      values.$upgradeCount:
-        8
+        9
      values.version:
-        "3.13.0"
+        "3.14.0"
    }
```

```diff
-   Status: DELETED
    contract PermissionedDisputeGame (0xd113ad136a0dF1c7FfB7F1606Be1c778bCfE2f3b)
    +++ description: Same as FaultDisputeGame, but only two permissioned addresses are designated as proposer and challenger.
```

```diff
    contract DisputeGameFactory (0xe5965Ab5962eDc7477C8520243A95517CD252fA9) {
    +++ description: The dispute game factory allows the creation of dispute games, used to propose state roots and eventually challenge them.
      values.gameImpls.4:
-        "0xbA94955CA3422fC57f9D982a0BaD2a9c88e2a9D0"
+        "0x1Ae178eBFEECd51709432EA5f37845Da0414EdFe"
      values.gameImpls.3:
-        "0xd113ad136a0dF1c7FfB7F1606Be1c778bCfE2f3b"
+        "0x5738a876359b48A65d35482C93B43e2c1147B32B"
    }
```

```diff
+   Status: CREATED
    contract PermissionedDisputeGame (0x1Ae178eBFEECd51709432EA5f37845Da0414EdFe)
    +++ description: Same as FaultDisputeGame, but only two permissioned addresses are designated as proposer and challenger.
```

```diff
+   Status: CREATED
    contract FaultDisputeGame (0x5738a876359b48A65d35482C93B43e2c1147B32B)
    +++ description: Logic of the dispute game. When a state root is proposed, a dispute game contract is deployed. Challengers can use such contracts to challenge the proposed state root.
```

```diff
+   Status: CREATED
    contract MIPS (0xF027F4A985560fb13324e943edf55ad6F1d15Dc1)
    +++ description: The MIPS contract is used to execute the final step of the dispute game which objectively determines the winner of the dispute.
```

## Source code changes

```diff
.../L1CrossDomainMessenger.sol                     |  350 +++-
 .../L1ERC721Bridge/L1ERC721Bridge.sol              |   21 +-
 .../L1StandardBridge/L1StandardBridge.sol          |   21 +-
 .../ethereum/{.flat@22273522 => .flat}/MIPS.sol    | 1869 ++++++++++++++------
 .../OptimismPortal2/OptimismPortal2.sol            |   83 +-
 .../SystemConfig/SystemConfig.sol                  |   29 +-
 6 files changed, 1793 insertions(+), 580 deletions(-)
```

Generated with discovered.json: 0xbcbe4025d922c24764f460dc2c2b5aad21be68ed

# Diff at Thu, 24 Apr 2025 07:16:51 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@5e04a862ca14d0cf2b0f2109c8f3cf63d05c6b32 block: 22273522
- current block number: 22273522

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22273522 (main branch discovery), not current.

```diff
    contract L1CrossDomainMessenger (0x25ace71c97B33Cc4729CF772ae268934F7ab5fA1) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      values.OTHER_MESSENGER:
-        "optimism:0x4200000000000000000000000000000000000007"
+        "oeth:0x4200000000000000000000000000000000000007"
      values.otherMessenger:
-        "optimism:0x4200000000000000000000000000000000000007"
+        "oeth:0x4200000000000000000000000000000000000007"
      usedTypes.0.arg.prefix:
-        "optimism"
+        "oeth"
    }
```

```diff
    contract L1ERC721Bridge (0x5a7749f83b81B301cAb5f48EB8516B986DAef23D) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      values.OTHER_BRIDGE:
-        "optimism:0x4200000000000000000000000000000000000014"
+        "oeth:0x4200000000000000000000000000000000000014"
      values.otherBridge:
-        "optimism:0x4200000000000000000000000000000000000014"
+        "oeth:0x4200000000000000000000000000000000000014"
      usedTypes.0.arg.prefix:
-        "optimism"
+        "oeth"
    }
```

```diff
    contract L1StandardBridge (0x99C9fc46f92E8a1c0deC1b1747d010903E884bE1) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      values.l2TokenBridge:
-        "optimism:0x4200000000000000000000000000000000000010"
+        "oeth:0x4200000000000000000000000000000000000010"
      values.OTHER_BRIDGE:
-        "optimism:0x4200000000000000000000000000000000000010"
+        "oeth:0x4200000000000000000000000000000000000010"
      values.otherBridge:
-        "optimism:0x4200000000000000000000000000000000000010"
+        "oeth:0x4200000000000000000000000000000000000010"
      usedTypes.0.arg.prefix:
-        "optimism"
+        "oeth"
    }
```

Generated with discovered.json: 0xb3cd8d378fcca754fe83317ffe7020f56a9ebe92

# Diff at Tue, 15 Apr 2025 09:37:32 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@7b0857850157d265e4d429d336d4517950f5340c block: 22194605
- current block number: 22273522

## Description

disco config cleanup and .ts templatize.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22194605 (main branch discovery), not current.

```diff
    contract OptimismPortal2 (0xbEb5Fc579115071764c7423A4f12eDde41f106Ed) {
    +++ description: The OptimismPortal contract is the main entry point to deposit funds from L1 to L2. It also allows to prove and finalize withdrawals. It specifies which game type can be used for withdrawals, which currently is the FaultDisputeGame.
      name:
-        "OptimismPortal"
+        "OptimismPortal2"
    }
```

Generated with discovered.json: 0xc7bebe076b595202de60cd3e9060a615d06de26a

# Diff at Fri, 11 Apr 2025 13:16:05 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@b607477490db79d49274f7585039ac7263456118 block: 22194605
- current block number: 22194605

## Description

Config: global mapping updated for op stack prestates.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22194605 (main branch discovery), not current.

```diff
    contract FaultDisputeGame (0xbA94955CA3422fC57f9D982a0BaD2a9c88e2a9D0) {
    +++ description: Logic of the dispute game. When a state root is proposed, a dispute game contract is deployed. Challengers can use such contracts to challenge the proposed state root.
+++ description: Prestate tag for known prestates.
      values.absolutePrestateDecoded:
-        "0x039facea52b20c605c05efb0a33560a92de7074218998f75bcdf61e8989cb5d9"
+        "v1.5.0"
      usedTypes.0.arg.0x03ee2917da962ec266b091f4b62121dc9682bb0db534633707325339f99ee405:
+        "v1.5.1-rc.1 (cannon64)"
      usedTypes.0.arg.0x0354eee87a1775d96afee8977ef6d5d6bd3612b256170952a01bf1051610ee01:
+        "v1.5.1-rc.1"
      usedTypes.0.arg.0x039970872142f48b189d18dcbc03a3737338d098b0101713dc2d6710f9deb5ef:
+        "v1.5.0 (cannon64)"
      usedTypes.0.arg.0x039facea52b20c605c05efb0a33560a92de7074218998f75bcdf61e8989cb5d9:
+        "v1.5.0"
      usedTypes.0.arg.0x0336751a224445089ba5456c8028376a0faf2bafa81d35f43fab8730258cdf37:
+        "v1.4.0-unichain"
    }
```

```diff
    contract PermissionedDisputeGame (0xd113ad136a0dF1c7FfB7F1606Be1c778bCfE2f3b) {
    +++ description: Same as FaultDisputeGame, but only two permissioned addresses are designated as proposer and challenger.
+++ description: Prestate tag for known prestates.
      values.absolutePrestateDecoded:
-        "0x039facea52b20c605c05efb0a33560a92de7074218998f75bcdf61e8989cb5d9"
+        "v1.5.0"
      usedTypes.0.arg.0x03ee2917da962ec266b091f4b62121dc9682bb0db534633707325339f99ee405:
+        "v1.5.1-rc.1 (cannon64)"
      usedTypes.0.arg.0x0354eee87a1775d96afee8977ef6d5d6bd3612b256170952a01bf1051610ee01:
+        "v1.5.1-rc.1"
      usedTypes.0.arg.0x039970872142f48b189d18dcbc03a3737338d098b0101713dc2d6710f9deb5ef:
+        "v1.5.0 (cannon64)"
      usedTypes.0.arg.0x039facea52b20c605c05efb0a33560a92de7074218998f75bcdf61e8989cb5d9:
+        "v1.5.0"
      usedTypes.0.arg.0x0336751a224445089ba5456c8028376a0faf2bafa81d35f43fab8730258cdf37:
+        "v1.4.0-unichain"
    }
```

Generated with discovered.json: 0xbb31ff908876b37764a2b1fbbe7dfab0cf687ae6

# Diff at Thu, 10 Apr 2025 14:42:50 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@f38a3c9bf359344e4c4cd3006f58271cb8f78d15 block: 22194605
- current block number: 22194605

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22194605 (main branch discovery), not current.

```diff
    contract DelayedWETH_PermissionedGames (0x21429aF66058BC3e4aE4a8f2EC4531AaC433ecbC) {
    +++ description: Contract designed to hold the bonded ETH for each game. It is designed as a wrapper around WETH to allow an owner to function as a backstop if a game would incorrectly distribute funds.
      displayName:
-        "DelayedWETH"
    }
```

```diff
    contract DelayedWETH_PermissionlessGames (0x323dFC63c9B83CB83f40325AaB74b245937cbdF0) {
    +++ description: Contract designed to hold the bonded ETH for each game. It is designed as a wrapper around WETH to allow an owner to function as a backstop if a game would incorrectly distribute funds.
      displayName:
-        "DelayedWETH"
    }
```

```diff
    contract L1DAIEscrow (0x467194771dAe2967Aef3ECbEDD3Bf9a310C76C65) {
    +++ description: Simple escrow that accepts tokens and allows to configure permissioned addresses that can access the tokens.
      description:
-        "Stores DAI deposited from the attached L1DAITokenBridge."
+        "Simple escrow that accepts tokens and allows to configure permissioned addresses that can access the tokens."
    }
```

```diff
    contract SuperchainProxyAdmin (0x543bA4AADBAb8f9025686Bd03993043599c6fB04) {
    +++ description: None
      displayName:
-        "ProxyAdmin"
    }
```

```diff
    contract wstETHEscrow (0x76943C0D61395d8F2edF9060e1533529cAe05dE6) {
    +++ description: Lido custom escrow for wstETH tokens that uses the canonical bridge for messaging but is governed externally.
      displayName:
-        "L1ERC20TokenBridge"
    }
```

```diff
    contract OptimismPortal (0xbEb5Fc579115071764c7423A4f12eDde41f106Ed) {
    +++ description: The OptimismPortal contract is the main entry point to deposit funds from L1 to L2. It also allows to prove and finalize withdrawals. It specifies which game type can be used for withdrawals, which currently is the FaultDisputeGame.
      displayName:
-        "OptimismPortal2"
    }
```

Generated with discovered.json: 0x49ffd12f9564a7dc7cb070d5c62ba4dbb12018fe

# Diff at Fri, 04 Apr 2025 09:17:31 GMT:

- chain: ethereum
- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@b3154c4385e52c9ffc0dab984c207390e5ccc13d block: 21829671
- current block number: 22194605

## Description

Upgrade 13: https://gov.optimism.io/t/upgrade-proposal-13-opcm-and-incident-response-improvements/9739

## Watched changes

```diff
-   Status: DELETED
    contract AnchorStateRegistry (0x18DAc71c228D1C32c99489B7323d441E1175e443)
    +++ description: Contains the latest confirmed state root that can be used as a starting point in a dispute game.
```

```diff
    contract DelayedWETH_PermissionedGames (0x21429aF66058BC3e4aE4a8f2EC4531AaC433ecbC) {
    +++ description: Contract designed to hold the bonded ETH for each game. It is designed as a wrapper around WETH to allow an owner to function as a backstop if a game would incorrectly distribute funds.
      sourceHashes.1:
-        "0xfff6f4cca21febd4323222e2ca87ec8b78edfdeeca942468fbf331e537815484"
+        "0x1c7d0fda5ed6d8fc7f5b5f7df5e307f0fcfd173fa5833ea9fce8875d5d44d86a"
      values.$implementation:
-        "0x71e966Ae981d1ce531a7b6d23DC0f27B38409087"
+        "0x5e40B9231B86984b5150507046e354dbFbeD3d9e"
      values.$pastUpgrades.1:
+        ["2024-12-11T12:29:23.000Z","0x6b9ad25cef01bd97f1be9642d96cbf75d533129608d5a62e4ae3d69ead47d3dc",["0x71e966Ae981d1ce531a7b6d23DC0f27B38409087"]]
      values.$pastUpgrades.0.2:
-        "2024-12-11T12:29:23.000Z"
+        ["0x5e40B9231B86984b5150507046e354dbFbeD3d9e"]
      values.$pastUpgrades.0.1:
-        "0x6b9ad25cef01bd97f1be9642d96cbf75d533129608d5a62e4ae3d69ead47d3dc"
+        "0x5f3530e593bbac37c61dc5b7755b6a40c06c20c1a3a1b13fca5b7d00cde65c29"
      values.$pastUpgrades.0.0:
-        ["0x71e966Ae981d1ce531a7b6d23DC0f27B38409087"]
+        "2025-04-02T16:50:23.000Z"
      values.$upgradeCount:
-        1
+        2
      values.delay:
-        604800
+        302400
      values.version:
-        "1.1.0"
+        "1.3.0"
    }
```

```diff
    contract SystemConfig (0x229047fed2591dbec1eF1118d64F7aF3dB9EB290) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      sourceHashes.1:
-        "0xc7135dbd2a53312d36df3f3ee91ce0a5a459ab8fc7725880a3a9c55a5fa0ed6c"
+        "0x2cdcfef705094aaac53d507bad64d27b48ea5a9c11a7fadffacc192aab7a823f"
      sourceHashes.0:
-        "0x2cdcfef705094aaac53d507bad64d27b48ea5a9c11a7fadffacc192aab7a823f"
+        "0x6e293d82eb36a83fb5d8b06268cd4fbf46027b87eea77fcc68f78e4b010a3774"
      values.$implementation:
-        "0xAB9d6cB7A427c0765163A7f45BB91cAfe5f2D375"
+        "0x760C48C62A85045A6B69f07F4a9f22868659CbCc"
      values.$pastUpgrades.9:
+        ["2025-01-24T14:41:35.000Z","0x86da7386a26978c3db89e97c1f4feee613a8a0c07bbe4640624b05276f49c350",["0xAB9d6cB7A427c0765163A7f45BB91cAfe5f2D375"]]
      values.$pastUpgrades.8.1:
-        ["0xAB9d6cB7A427c0765163A7f45BB91cAfe5f2D375"]
+        "0x86da7386a26978c3db89e97c1f4feee613a8a0c07bbe4640624b05276f49c350"
      values.$pastUpgrades.8.0:
-        "0x86da7386a26978c3db89e97c1f4feee613a8a0c07bbe4640624b05276f49c350"
+        ["0xd81f43eDBCAcb4c29a9bA38a13Ee5d79278270cC"]
      values.$pastUpgrades.7.2:
-        "2025-01-24T14:41:35.000Z"
+        ["0xba2492e52F45651B60B8B38d4Ea5E2390C64Ffb1"]
      values.$pastUpgrades.7.1:
-        "0x86da7386a26978c3db89e97c1f4feee613a8a0c07bbe4640624b05276f49c350"
+        "0x4758bd62359bc69d7e8a0faaf5308d826379c23258d689a7430d5c0ad0361ad2"
      values.$pastUpgrades.7.0:
-        ["0xd81f43eDBCAcb4c29a9bA38a13Ee5d79278270cC"]
+        "2024-04-11T20:49:59.000Z"
      values.$pastUpgrades.6.2:
-        ["0xba2492e52F45651B60B8B38d4Ea5E2390C64Ffb1"]
+        "0x5f3530e593bbac37c61dc5b7755b6a40c06c20c1a3a1b13fca5b7d00cde65c29"
      values.$pastUpgrades.6.1:
-        "0x4758bd62359bc69d7e8a0faaf5308d826379c23258d689a7430d5c0ad0361ad2"
+        "2025-04-02T16:50:23.000Z"
      values.$pastUpgrades.6.0:
-        "2024-04-11T20:49:59.000Z"
+        ["0x760C48C62A85045A6B69f07F4a9f22868659CbCc"]
      values.$upgradeCount:
-        9
+        10
      values.gasPayingToken:
-        {"addr_":"0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE","decimals_":18}
      values.gasPayingTokenName:
-        "Ether"
      values.gasPayingTokenSymbol:
-        "ETH"
      values.isCustomGasToken:
-        false
      values.version:
-        "2.3.0"
+        "2.4.0"
      values.getAddresses:
+        {"l1CrossDomainMessenger":"0x25ace71c97B33Cc4729CF772ae268934F7ab5fA1","l1ERC721Bridge":"0x5a7749f83b81B301cAb5f48EB8516B986DAef23D","l1StandardBridge":"0x99C9fc46f92E8a1c0deC1b1747d010903E884bE1","disputeGameFactory":"0xe5965Ab5962eDc7477C8520243A95517CD252fA9","optimismPortal":"0xbEb5Fc579115071764c7423A4f12eDde41f106Ed","optimismMintableERC20Factory":"0x75505a97BD334E7BD3C476893285569C4136Fa0F"}
    }
```

```diff
    contract L1CrossDomainMessenger (0x25ace71c97B33Cc4729CF772ae268934F7ab5fA1) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      sourceHashes.1:
-        "0x6e4b297b822bdda2bb8bbf4dde360ee51379af5a0de55c0d726a2d7b68791bf7"
+        "0xfaa50769db48b1d2c04c06a8a0a4771b87b3c0ff20a508115bfdb2b576fdb454"
      sourceHashes.0:
-        "0x1cc8a3b7de3d2c54c4706bb3f3015714d3b56647fc9fbfd6f8b068f5f63c1c25"
+        "0x6e4b297b822bdda2bb8bbf4dde360ee51379af5a0de55c0d726a2d7b68791bf7"
      values.$implementation:
-        "0xD3494713A5cfaD3F5359379DfA074E2Ac8C6Fd65"
+        "0x3eA6084748ED1b2A9B5D4426181F1ad8C93F6231"
      values.$pastUpgrades.10:
+        ["2023-06-06T18:24:11.000Z","0xe2ff41f9bdf03d5455f55539b8b9c350276a179ca7f79322e2077d7c1ffb1268",["0x2150Bc3c64cbfDDbaC9815EF615D6AB8671bfe43"]]
      values.$pastUpgrades.9.2:
-        "2023-06-06T18:24:11.000Z"
+        "0x2625aa2013fd1a650fb0264d2746be597e12f846baa48a68fe14539c200ed6dc"
      values.$pastUpgrades.9.1:
-        "0xe2ff41f9bdf03d5455f55539b8b9c350276a179ca7f79322e2077d7c1ffb1268"
+        "2021-11-11T17:37:56.000Z"
      values.$pastUpgrades.9.0.0:
-        "0x2150Bc3c64cbfDDbaC9815EF615D6AB8671bfe43"
+        "0x0000000000000000000000000000000000000000"
      values.$pastUpgrades.8.2:
-        "0x2625aa2013fd1a650fb0264d2746be597e12f846baa48a68fe14539c200ed6dc"
+        "0x5f3530e593bbac37c61dc5b7755b6a40c06c20c1a3a1b13fca5b7d00cde65c29"
      values.$pastUpgrades.8.1:
-        "2021-11-11T17:37:56.000Z"
+        ["0x3eA6084748ED1b2A9B5D4426181F1ad8C93F6231"]
      values.$pastUpgrades.8.0:
-        ["0x0000000000000000000000000000000000000000"]
+        "2025-04-02T16:50:23.000Z"
      values.$upgradeCount:
-        10
+        11
      values.version:
-        "2.3.0"
+        "2.5.0"
    }
```

```diff
-   Status: DELETED
    contract FaultDisputeGame (0x27B81db41F586016694632193b99E45b1a27B8f8)
    +++ description: Logic of the dispute game. When a state root is proposed, a dispute game contract is deployed. Challengers can use such contracts to challenge the proposed state root.
```

```diff
    contract DelayedWETH_PermissionlessGames (0x323dFC63c9B83CB83f40325AaB74b245937cbdF0) {
    +++ description: Contract designed to hold the bonded ETH for each game. It is designed as a wrapper around WETH to allow an owner to function as a backstop if a game would incorrectly distribute funds.
      sourceHashes.1:
-        "0xfff6f4cca21febd4323222e2ca87ec8b78edfdeeca942468fbf331e537815484"
+        "0x1c7d0fda5ed6d8fc7f5b5f7df5e307f0fcfd173fa5833ea9fce8875d5d44d86a"
      values.$implementation:
-        "0x71e966Ae981d1ce531a7b6d23DC0f27B38409087"
+        "0x5e40B9231B86984b5150507046e354dbFbeD3d9e"
      values.$pastUpgrades.1:
+        ["2025-04-02T16:50:23.000Z","0x5f3530e593bbac37c61dc5b7755b6a40c06c20c1a3a1b13fca5b7d00cde65c29",["0x5e40B9231B86984b5150507046e354dbFbeD3d9e"]]
      values.$upgradeCount:
-        1
+        2
      values.delay:
-        604800
+        302400
      values.version:
-        "1.1.0"
+        "1.3.0"
    }
```

```diff
    contract SuperchainProxyAdmin (0x543bA4AADBAb8f9025686Bd03993043599c6fB04) {
    +++ description: None
      directlyReceivedPermissions.10.from:
-        "0x18DAc71c228D1C32c99489B7323d441E1175e443"
+        "0x323dFC63c9B83CB83f40325AaB74b245937cbdF0"
      directlyReceivedPermissions.9.from:
-        "0x323dFC63c9B83CB83f40325AaB74b245937cbdF0"
+        "0x5a7749f83b81B301cAb5f48EB8516B986DAef23D"
      directlyReceivedPermissions.8.permission:
-        "upgrade"
+        "interact"
      directlyReceivedPermissions.8.from:
-        "0x5a7749f83b81B301cAb5f48EB8516B986DAef23D"
+        "0xdE1FCfB0851916CA5101820A69b13a4E276bd81F"
      directlyReceivedPermissions.8.description:
+        "set and change address mappings."
      directlyReceivedPermissions.7.permission:
-        "interact"
+        "upgrade"
      directlyReceivedPermissions.7.from:
-        "0xdE1FCfB0851916CA5101820A69b13a4E276bd81F"
+        "0x21429aF66058BC3e4aE4a8f2EC4531AaC433ecbC"
      directlyReceivedPermissions.7.description:
-        "set and change address mappings."
      directlyReceivedPermissions.6.from:
-        "0x21429aF66058BC3e4aE4a8f2EC4531AaC433ecbC"
+        "0x229047fed2591dbec1eF1118d64F7aF3dB9EB290"
      directlyReceivedPermissions.5.from:
-        "0x229047fed2591dbec1eF1118d64F7aF3dB9EB290"
+        "0x75505a97BD334E7BD3C476893285569C4136Fa0F"
      directlyReceivedPermissions.4.from:
-        "0x75505a97BD334E7BD3C476893285569C4136Fa0F"
+        "0x99C9fc46f92E8a1c0deC1b1747d010903E884bE1"
      directlyReceivedPermissions.4.description:
+        "upgrading the bridge implementation can give access to all funds escrowed therein."
      directlyReceivedPermissions.3.from:
-        "0x99C9fc46f92E8a1c0deC1b1747d010903E884bE1"
+        "0xe5965Ab5962eDc7477C8520243A95517CD252fA9"
      directlyReceivedPermissions.3.description:
-        "upgrading the bridge implementation can give access to all funds escrowed therein."
      directlyReceivedPermissions.2.from:
-        "0xe5965Ab5962eDc7477C8520243A95517CD252fA9"
+        "0xbEb5Fc579115071764c7423A4f12eDde41f106Ed"
      directlyReceivedPermissions.1.from:
-        "0xbEb5Fc579115071764c7423A4f12eDde41f106Ed"
+        "0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
      directlyReceivedPermissions.0.from:
-        "0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
+        "0x1c68ECfbf9C8B1E6C0677965b3B9Ecf9A104305b"
    }
```

```diff
    contract SuperchainProxyAdminOwner (0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A) {
    +++ description: None
      receivedPermissions.10.from:
-        "0x18DAc71c228D1C32c99489B7323d441E1175e443"
+        "0x323dFC63c9B83CB83f40325AaB74b245937cbdF0"
      receivedPermissions.9.from:
-        "0x323dFC63c9B83CB83f40325AaB74b245937cbdF0"
+        "0x5a7749f83b81B301cAb5f48EB8516B986DAef23D"
      receivedPermissions.8.permission:
-        "upgrade"
+        "interact"
      receivedPermissions.8.from:
-        "0x5a7749f83b81B301cAb5f48EB8516B986DAef23D"
+        "0xdE1FCfB0851916CA5101820A69b13a4E276bd81F"
      receivedPermissions.8.description:
+        "set and change address mappings."
      receivedPermissions.7.permission:
-        "interact"
+        "upgrade"
      receivedPermissions.7.from:
-        "0xdE1FCfB0851916CA5101820A69b13a4E276bd81F"
+        "0x21429aF66058BC3e4aE4a8f2EC4531AaC433ecbC"
      receivedPermissions.7.description:
-        "set and change address mappings."
      receivedPermissions.6.from:
-        "0x21429aF66058BC3e4aE4a8f2EC4531AaC433ecbC"
+        "0x229047fed2591dbec1eF1118d64F7aF3dB9EB290"
      receivedPermissions.5.from:
-        "0x229047fed2591dbec1eF1118d64F7aF3dB9EB290"
+        "0x75505a97BD334E7BD3C476893285569C4136Fa0F"
      receivedPermissions.4.from:
-        "0x75505a97BD334E7BD3C476893285569C4136Fa0F"
+        "0x99C9fc46f92E8a1c0deC1b1747d010903E884bE1"
      receivedPermissions.4.description:
+        "upgrading the bridge implementation can give access to all funds escrowed therein."
      receivedPermissions.3.from:
-        "0x99C9fc46f92E8a1c0deC1b1747d010903E884bE1"
+        "0xe5965Ab5962eDc7477C8520243A95517CD252fA9"
      receivedPermissions.3.description:
-        "upgrading the bridge implementation can give access to all funds escrowed therein."
      receivedPermissions.2.from:
-        "0xe5965Ab5962eDc7477C8520243A95517CD252fA9"
+        "0xbEb5Fc579115071764c7423A4f12eDde41f106Ed"
      receivedPermissions.1.from:
-        "0xbEb5Fc579115071764c7423A4f12eDde41f106Ed"
+        "0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
      receivedPermissions.0.from:
-        "0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
+        "0x1c68ECfbf9C8B1E6C0677965b3B9Ecf9A104305b"
    }
```

```diff
    contract L1ERC721Bridge (0x5a7749f83b81B301cAb5f48EB8516B986DAef23D) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      sourceHashes.1:
-        "0x482ec6e91304ac39a3fb4505634427bddfddee23b8e93a4f7f995ca5083ae3c3"
+        "0x9de28f19e0d1200bf0afda5ab90c9d2dffa44a775e71cfe9232ee1808338996c"
      values.$implementation:
-        "0xAE2AF01232a6c4a4d3012C5eC5b1b35059caF10d"
+        "0x276d3730f219f7ec22274f7263180b8452B46d47"
      values.$pastUpgrades.6:
+        ["2025-04-02T16:50:23.000Z","0x5f3530e593bbac37c61dc5b7755b6a40c06c20c1a3a1b13fca5b7d00cde65c29",["0x276d3730f219f7ec22274f7263180b8452B46d47"]]
      values.$upgradeCount:
-        6
+        7
      values.version:
-        "2.1.0"
+        "2.3.1"
    }
```

```diff
-   Status: DELETED
    contract MIPS (0x5fE03a12C1236F9C22Cb6479778DDAa4bce6299C)
    +++ description: The MIPS contract is used to execute the final step of the dispute game which objectively determines the winner of the dispute.
```

```diff
    contract OptimismMintableERC20Factory (0x75505a97BD334E7BD3C476893285569C4136Fa0F) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      sourceHashes.0:
-        "0x4c5ac4e53576924cabbd2a471f368a541bc3f4b1f53fa41a389692fcc62f6176"
+        "0x9650b4bba6299e410f01a369a95a2c57e1c3ca35f0d80c13f4f59fc468f370e5"
      values.$implementation:
-        "0xE01efbeb1089D1d1dB9c6c8b135C934C0734c846"
+        "0x5493f4677A186f64805fe7317D6993ba4863988F"
      values.$pastUpgrades.5:
+        ["2023-06-06T18:24:11.000Z","0xe2ff41f9bdf03d5455f55539b8b9c350276a179ca7f79322e2077d7c1ffb1268",["0xaE849EFA4BcFc419593420e14707996936E365E2"]]
      values.$pastUpgrades.4.2:
-        "2023-06-06T18:24:11.000Z"
+        "0x5f3530e593bbac37c61dc5b7755b6a40c06c20c1a3a1b13fca5b7d00cde65c29"
      values.$pastUpgrades.4.1:
-        "0xe2ff41f9bdf03d5455f55539b8b9c350276a179ca7f79322e2077d7c1ffb1268"
+        "2025-04-02T16:50:23.000Z"
      values.$pastUpgrades.4.0.0:
-        "0xaE849EFA4BcFc419593420e14707996936E365E2"
+        "0x5493f4677A186f64805fe7317D6993ba4863988F"
      values.$upgradeCount:
-        5
+        6
      values.version:
-        "1.9.0"
+        "1.10.1"
    }
```

```diff
-   Status: DELETED
    contract PermissionedDisputeGame (0x91a661891248d8C4916FB4a1508492a5e2CBcb87)
    +++ description: Same as FaultDisputeGame, but only two permissioned addresses are designated as proposer and challenger.
```

```diff
    contract SuperchainConfig (0x95703e0982140D16f8ebA6d158FccEde42f04a4C) {
    +++ description: Used to manage global configuration values for multiple OP Chains within a single Superchain network. The SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the Superchain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      sourceHashes.1:
-        "0x3ac96c9c95e25f689f65a50f24b325e3f891029cb1cea96dc642418bbb535b1d"
+        "0x03dba37173051b02bc81487e181c791bcf1aef664c249e5d035f11f488bdd686"
      values.$implementation:
-        "0x53c165169401764778F780a69701385eb0FF19B7"
+        "0x4da82a327773965b8d4D85Fa3dB8249b387458E7"
      values.$pastUpgrades.3:
+        ["2025-04-02T16:50:23.000Z","0x5f3530e593bbac37c61dc5b7755b6a40c06c20c1a3a1b13fca5b7d00cde65c29",["0x4da82a327773965b8d4D85Fa3dB8249b387458E7"]]
      values.$upgradeCount:
-        3
+        4
      values.version:
-        "1.1.0"
+        "1.2.0"
    }
```

```diff
    contract L1StandardBridge (0x99C9fc46f92E8a1c0deC1b1747d010903E884bE1) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      sourceHashes.1:
-        "0x1010ff7f40ab4d53e6d9996aefa04423dabe9d0e22fac2d02b330ed3aa2c5740"
+        "0x4a2d83507f25be218f504b76815e4494138af88734cc54d34666c631aea88af5"
      values.$implementation:
-        "0x64B5a5Ed26DCb17370Ff4d33a8D503f0fbD06CfF"
+        "0x78972E88Ab8BBB517a36cAea23b931BAB58AD3c6"
      values.version:
-        "2.1.0"
+        "2.2.2"
    }
```

```diff
-   Status: DELETED
    contract PreimageOracle (0x9c065e11870B891D214Bc2Da7EF1f9DDFA1BE277)
    +++ description: The PreimageOracle contract is used to load the required data from L1 for a dispute game.
```

```diff
    contract OptimismPortal (0xbEb5Fc579115071764c7423A4f12eDde41f106Ed) {
    +++ description: The OptimismPortal contract is the main entry point to deposit funds from L1 to L2. It also allows to prove and finalize withdrawals. It specifies which game type can be used for withdrawals, which currently is the FaultDisputeGame.
      sourceHashes.1:
-        "0x2cdcfef705094aaac53d507bad64d27b48ea5a9c11a7fadffacc192aab7a823f"
+        "0x67ee16b5b6c32cdcc862bea390e45017908e6945cfaa01d3ef75dc9de7c9d946"
      sourceHashes.0:
-        "0x41be46bdb67af1b7af90e1bd70a1fcd31a3352282beb83b846a5189675c37ac1"
+        "0x2cdcfef705094aaac53d507bad64d27b48ea5a9c11a7fadffacc192aab7a823f"
      values.$implementation:
-        "0xe2F826324b2faf99E513D16D266c3F80aE87832B"
+        "0x2D7e764a0D9919e16983a46595CfA81fc34fa7Cd"
      values.$pastUpgrades.7:
+        ["2024-06-10T16:42:59.000Z","0xbe810ed6e1e827930bd46cde42c4883662ddb6d244a26af2f0409cc2782bee61",["0xe2F826324b2faf99E513D16D266c3F80aE87832B"]]
      values.$pastUpgrades.6.2.0:
-        "0xe2F826324b2faf99E513D16D266c3F80aE87832B"
+        "0x28a55488fef40005309e2DA0040DbE9D300a64AB"
      values.$pastUpgrades.6.1:
-        "0xbe810ed6e1e827930bd46cde42c4883662ddb6d244a26af2f0409cc2782bee61"
+        "2023-06-06T18:24:11.000Z"
      values.$pastUpgrades.6.0:
-        "2024-06-10T16:42:59.000Z"
+        "0xe2ff41f9bdf03d5455f55539b8b9c350276a179ca7f79322e2077d7c1ffb1268"
      values.$pastUpgrades.5.2:
-        ["0x28a55488fef40005309e2DA0040DbE9D300a64AB"]
+        "0x5f3530e593bbac37c61dc5b7755b6a40c06c20c1a3a1b13fca5b7d00cde65c29"
      values.$pastUpgrades.5.1:
-        "2023-06-06T18:24:11.000Z"
+        "2025-04-02T16:50:23.000Z"
      values.$pastUpgrades.5.0:
-        "0xe2ff41f9bdf03d5455f55539b8b9c350276a179ca7f79322e2077d7c1ffb1268"
+        ["0x2D7e764a0D9919e16983a46595CfA81fc34fa7Cd"]
      values.$upgradeCount:
-        7
+        8
      values.version:
-        "3.10.0"
+        "3.13.0"
    }
```

```diff
    contract DisputeGameFactory (0xe5965Ab5962eDc7477C8520243A95517CD252fA9) {
    +++ description: The dispute game factory allows the creation of dispute games, used to propose state roots and eventually challenge them.
      sourceHashes.1:
-        "0x7f307d6191215a72b6c24c01b3c2fc87c84f7fb346790132e58736caa2d1dd14"
+        "0x85ca17941ef36ac6b28a4f8f89803d0d41ef419c47586dcd3acdb47ee9617285"
      values.$implementation:
-        "0xc641A33cab81C559F2bd4b21EA34C290E2440C2B"
+        "0x4bbA758F006Ef09402eF31724203F316ab74e4a0"
      values.$pastUpgrades.1:
+        ["2025-04-02T16:50:23.000Z","0x5f3530e593bbac37c61dc5b7755b6a40c06c20c1a3a1b13fca5b7d00cde65c29",["0x4bbA758F006Ef09402eF31724203F316ab74e4a0"]]
      values.$upgradeCount:
-        1
+        2
      values.gameImpls.4:
-        "0x27B81db41F586016694632193b99E45b1a27B8f8"
+        "0xbA94955CA3422fC57f9D982a0BaD2a9c88e2a9D0"
      values.gameImpls.3:
-        "0x91a661891248d8C4916FB4a1508492a5e2CBcb87"
+        "0xd113ad136a0dF1c7FfB7F1606Be1c778bCfE2f3b"
      values.version:
-        "1.0.0"
+        "1.0.1"
    }
```

```diff
+   Status: CREATED
    contract AnchorStateRegistry (0x1c68ECfbf9C8B1E6C0677965b3B9Ecf9A104305b)
    +++ description: Contains the latest confirmed state root that can be used as a starting point in a dispute game.
```

```diff
+   Status: CREATED
    contract PreimageOracle (0x1fb8cdFc6831fc866Ed9C51aF8817Da5c287aDD3)
    +++ description: The PreimageOracle contract is used to load the required data from L1 for a dispute game.
```

```diff
+   Status: CREATED
    contract MIPS (0xaA59A0777648BC75cd10364083e878c1cCd6112a)
    +++ description: The MIPS contract is used to execute the final step of the dispute game which objectively determines the winner of the dispute.
```

```diff
+   Status: CREATED
    contract FaultDisputeGame (0xbA94955CA3422fC57f9D982a0BaD2a9c88e2a9D0)
    +++ description: Logic of the dispute game. When a state root is proposed, a dispute game contract is deployed. Challengers can use such contracts to challenge the proposed state root.
```

```diff
+   Status: CREATED
    contract PermissionedDisputeGame (0xd113ad136a0dF1c7FfB7F1606Be1c778bCfE2f3b)
    +++ description: Same as FaultDisputeGame, but only two permissioned addresses are designated as proposer and challenger.
```

## Source code changes

```diff
.../AnchorStateRegistry/AnchorStateRegistry.sol    |  292 ++--
 .../DelayedWETH_PermissionedGames/DelayedWETH.sol  |  231 ++--
 .../DelayedWETH.sol                                |  231 ++--
 .../DisputeGameFactory/DisputeGameFactory.sol      |  240 ++--
 .../{.flat@21829671 => .flat}/FaultDisputeGame.sol |  230 +++-
 .../L1CrossDomainMessenger.sol                     |  400 ++++--
 .../L1ERC721Bridge/L1ERC721Bridge.sol              |  413 +++---
 .../L1StandardBridge/L1StandardBridge.sol          |  503 ++++---
 .../ethereum/{.flat@21829671 => .flat}/MIPS.sol    |   75 +-
 .../OptimismMintableERC20Factory.sol               |   30 +-
 .../OptimismPortal/OptimismPortal2.sol             |  439 ++++--
 .../PermissionedDisputeGame.sol                    |  267 ++--
 .../{.flat@21829671 => .flat}/PreimageOracle.sol   |  216 ++-
 .../SuperchainConfig/SuperchainConfig.sol          |    8 +-
 .../SystemConfig/SystemConfig.sol                  | 1414 +-------------------
 15 files changed, 2165 insertions(+), 2824 deletions(-)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21829671 (main branch discovery), not current.

```diff
    contract DelayedWETH_PermissionedGames (0x21429aF66058BC3e4aE4a8f2EC4531AaC433ecbC) {
    +++ description: Contract designed to hold the bonded ETH for each game. It is designed as a wrapper around WETH to allow an owner to function as a backstop if a game would incorrectly distribute funds.
      issuedPermissions.1:
+        {"permission":"upgrade","to":"0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A","via":[{"address":"0x543bA4AADBAb8f9025686Bd03993043599c6fB04"}]}
      issuedPermissions.0.permission:
-        "upgrade"
+        "interact"
      issuedPermissions.0.to:
-        "0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A"
+        "0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A"
      issuedPermissions.0.via.0:
-        {"address":"0x543bA4AADBAb8f9025686Bd03993043599c6fB04"}
      issuedPermissions.0.description:
+        "can pull funds from the contract in case of emergency."
    }
```

```diff
    contract DelayedWETH_PermissionlessGames (0x323dFC63c9B83CB83f40325AaB74b245937cbdF0) {
    +++ description: Contract designed to hold the bonded ETH for each game. It is designed as a wrapper around WETH to allow an owner to function as a backstop if a game would incorrectly distribute funds.
      issuedPermissions.1:
+        {"permission":"upgrade","to":"0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A","via":[{"address":"0x543bA4AADBAb8f9025686Bd03993043599c6fB04"}]}
      issuedPermissions.0.permission:
-        "upgrade"
+        "interact"
      issuedPermissions.0.to:
-        "0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A"
+        "0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A"
      issuedPermissions.0.via.0:
-        {"address":"0x543bA4AADBAb8f9025686Bd03993043599c6fB04"}
      issuedPermissions.0.description:
+        "can pull funds from the contract in case of emergency."
    }
```

```diff
    contract OpFoundationOperationsSafe (0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A) {
    +++ description: None
      receivedPermissions.2:
+        {"permission":"interact","from":"0x323dFC63c9B83CB83f40325AaB74b245937cbdF0","description":"can pull funds from the contract in case of emergency."}
      receivedPermissions.1:
+        {"permission":"interact","from":"0x21429aF66058BC3e4aE4a8f2EC4531AaC433ecbC","description":"can pull funds from the contract in case of emergency."}
    }
```

Generated with discovered.json: 0x87539add223f50b5a7c6a7d779aa1008d664cae3

# Diff at Thu, 27 Mar 2025 11:14:47 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@8cc2e36080df3a74dfd8475d41c64f46203f5218 block: 21829671
- current block number: 21829671

## Description

Config related: add guardian description details, hide some noisy values, hide AddressManager as spam cat, add proposer / challenger to permissioned opfp chains.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21829671 (main branch discovery), not current.

```diff
    contract AddressManager (0xdE1FCfB0851916CA5101820A69b13a4E276bd81F) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      category:
+        {"name":"Spam","priority":-1}
    }
```

Generated with discovered.json: 0x5c06a066a847752e7dc617c94745f047b497964f

# Diff at Tue, 18 Mar 2025 08:13:25 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@4ef7a8dbcec1cd9fec77aae2b73d81347a4ffb13 block: 21829671
- current block number: 21829671

## Description

Config: change Multisig names.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21829671 (main branch discovery), not current.

```diff
    contract Optimism Guardian Multisig (0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2) {
    +++ description: None
      name:
-        "GuardianMultisig"
+        "Optimism Guardian Multisig"
    }
```

```diff
    contract Optimism Security Council (0xc2819DC788505Aac350142A7A707BF9D03E3Bd03) {
    +++ description: None
      name:
-        "SecurityCouncilMultisig"
+        "Optimism Security Council"
    }
```

Generated with discovered.json: 0x5a61dce339870dbc849ad40184331fd237508dde

# Diff at Tue, 04 Mar 2025 11:26:05 GMT:

- chain: ethereum
- author: Michał Podsiadły (<michal.podsiadly@l2beat.com>)
- comparing to: main@be38e12d3ff947ca8de40f3a23a9ba1875a54f5a block: 21829671
- current block number: 21829671

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21829671 (main branch discovery), not current.

```diff
    contract SystemConfig (0x229047fed2591dbec1eF1118d64F7aF3dB9EB290) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      values.opStackDA.isSomeTxsLengthEqualToCelestiaDAExample:
-        false
      values.opStackDA.isUsingCelestia:
+        false
    }
```

Generated with discovered.json: 0x88f8e76eac5ae79f50169a94779a0d6d0d069f34

# Diff at Tue, 04 Mar 2025 10:40:38 GMT:

- chain: optimism
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@98d260b45fe0d2195ce5e629bd7b200c8706e8ba block: 132493968
- current block number: 132493968

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 132493968 (main branch discovery), not current.

```diff
    contract MintManagerOwner (0x2A82Ae142b2e62Cb7D10b55E323ACB1Cab663a26) {
    +++ description: None
      sinceBlock:
+        6297293
    }
```

```diff
    contract DeployerWhitelist (0x4200000000000000000000000000000000000002) {
    +++ description: Legacy contract that was originally used to act as a whitelist of addresses allowed to the Optimism network. Fully unused and deprecated since the Bedrock upgrade.
      sinceBlock:
+        0
    }
```

```diff
    contract L2CrossDomainMessenger (0x4200000000000000000000000000000000000007) {
    +++ description: The L2CrossDomainMessenger (L2xDM) contract sends messages from L2 to L1, and relays messages from L1 onto L2 with a system tx. In the event that a message sent from L2 to L1 is rejected for exceeding the L1 gas limit, it can be resubmitted via this contract’s replay function.
      sinceBlock:
+        0
    }
```

```diff
    contract GasPriceOracle (0x420000000000000000000000000000000000000F) {
    +++ description: Provides the current gas price for L2 transactions.
      sinceBlock:
+        0
    }
```

```diff
    contract L2StandardBridge (0x4200000000000000000000000000000000000010) {
    +++ description: The L2StandardBridge contract is the main entry point to deposit or withdraw ERC20 tokens from L2 to L1. This contract can store any token.
      sinceBlock:
+        0
    }
```

```diff
    contract SequencerFeeVault (0x4200000000000000000000000000000000000011) {
    +++ description: Collects the sequencer fees, which are withdrawable to the FeesCollector on L1.
      sinceBlock:
+        0
    }
```

```diff
    contract OptimismMintableERC20Factory (0x4200000000000000000000000000000000000012) {
    +++ description: Factory contract to create bridge compliant ERC20 IOU token representations of bridged L1 ERC20 tokens.
      sinceBlock:
+        0
    }
```

```diff
    contract L1BlockNumber (0x4200000000000000000000000000000000000013) {
    +++ description: Simple contract that returns the latest L1 block number.
      sinceBlock:
+        0
    }
```

```diff
    contract L2ERC721Bridge (0x4200000000000000000000000000000000000014) {
    +++ description: The L2ERC721Bridge contract is the main entry point to deposit or withdraw ERC721 tokens from L2 to L1. This contract can store any token.
      sinceBlock:
+        27391910
    }
```

```diff
    contract L1Block (0x4200000000000000000000000000000000000015) {
    +++ description: Simple contract that returns information about the latest L1 block, which is derived permissionlessly from the L1 chain.
      sinceBlock:
+        0
    }
```

```diff
    contract L2ToL1MessagePasser (0x4200000000000000000000000000000000000016) {
    +++ description: Contract used internally by the L2CrossDomainMessenger to send messages to L1, including withdrawals. It can also be used directly as a low-level interface.
      sinceBlock:
+        0
    }
```

```diff
    contract OptimismMintableERC721Factory (0x4200000000000000000000000000000000000017) {
    +++ description: Factory contract to create bridge compliant ERC721 IOU token representations of bridged L1 ERC721 tokens.
      sinceBlock:
+        0
    }
```

```diff
    contract ProxyAdmin (0x4200000000000000000000000000000000000018) {
    +++ description: None
      sinceBlock:
+        0
    }
```

```diff
    contract BaseFeeVault (0x4200000000000000000000000000000000000019) {
    +++ description: Collects EIP-1559 base fees, which are withdrawable to the FeesCollector on L1.
      sinceBlock:
+        0
    }
```

```diff
    contract L1FeeVault (0x420000000000000000000000000000000000001A) {
    +++ description: Collects the L1 portion of the L2 transaction fees, which are withdrawable to the FeesCollector on L1.
      sinceBlock:
+        0
    }
```

```diff
    contract SchemaRegistry (0x4200000000000000000000000000000000000020) {
    +++ description: Contracts to register schemas for the Ethereum Attestation Service (EAS).
      sinceBlock:
+        0
    }
```

```diff
    contract EAS (0x4200000000000000000000000000000000000021) {
    +++ description: Contract containing the main logic for the Ethereum Attestation Service (EAS).
      sinceBlock:
+        0
    }
```

```diff
    contract OPToken (0x4200000000000000000000000000000000000042) {
    +++ description: The OP token contract. The minting policy is controlled by the 0x5C4e7Ba1E219E47948e6e3F55019A647bA501005.
      sinceBlock:
+        6490467
    }
```

```diff
    contract MintManager (0x5C4e7Ba1E219E47948e6e3F55019A647bA501005) {
    +++ description: Controls the OP inflation rate, which is currently hardcoded to 2% annually.
      sinceBlock:
+        28103702
    }
```

Generated with discovered.json: 0x755415bfee07fdf2bed54d2e61e44f5e524db12f

# Diff at Tue, 04 Mar 2025 10:39:31 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@98d260b45fe0d2195ce5e629bd7b200c8706e8ba block: 21829671
- current block number: 21829671

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21829671 (main branch discovery), not current.

```diff
    contract LivenessModule (0x0454092516c9A4d636d3CAfA1e82161376C8a748) {
    +++ description: used to remove members inactive for 98d while making sure that the threshold remains above 75%. If the number of members falls below 8, the 0x847B5c174615B1B7fDF770882256e2D3E95b9D92 takes ownership of the multisig
      sinceBlock:
+        19989094
    }
```

```diff
    contract GuardianMultisig (0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2) {
    +++ description: None
      sinceBlock:
+        19968607
    }
```

```diff
    contract L1DAITokenBridge (0x10E6593CDda8c58a1d0f14C5164B376352a55f2F) {
    +++ description: Custom Gateway for DAI deposits via canonical messaging. Deposited DAI is forwarded to a Vault contract.
      sinceBlock:
+        12781431
    }
```

```diff
    contract AnchorStateRegistry (0x18DAc71c228D1C32c99489B7323d441E1175e443) {
    +++ description: Contains the latest confirmed state root that can be used as a starting point in a dispute game.
      sinceBlock:
+        19884569
    }
```

```diff
    contract DelayedWETH_PermissionedGames (0x21429aF66058BC3e4aE4a8f2EC4531AaC433ecbC) {
    +++ description: Contract designed to hold the bonded ETH for each game. It is designed as a wrapper around WETH to allow an owner to function as a backstop if a game would incorrectly distribute funds.
      sinceBlock:
+        21379267
    }
```

```diff
    contract SystemConfig (0x229047fed2591dbec1eF1118d64F7aF3dB9EB290) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      sinceBlock:
+        17365804
    }
```

```diff
    contract LivenessGuard (0x24424336F04440b1c28685a38303aC33C9D14a25) {
    +++ description: Modular contract to be used together with the LivenessModule. Tracks liveness / activity of Safe owners.
      sinceBlock:
+        19989094
    }
```

```diff
    contract L1CrossDomainMessenger (0x25ace71c97B33Cc4729CF772ae268934F7ab5fA1) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      sinceBlock:
+        12686757
    }
```

```diff
    contract FaultDisputeGame (0x27B81db41F586016694632193b99E45b1a27B8f8) {
    +++ description: Logic of the dispute game. When a state root is proposed, a dispute game contract is deployed. Challengers can use such contracts to challenge the proposed state root.
      sinceBlock:
+        21379274
    }
```

```diff
    contract DelayedWETH_PermissionlessGames (0x323dFC63c9B83CB83f40325AaB74b245937cbdF0) {
    +++ description: Contract designed to hold the bonded ETH for each game. It is designed as a wrapper around WETH to allow an owner to function as a backstop if a game would incorrectly distribute funds.
      sinceBlock:
+        21379271
    }
```

```diff
    contract GnosisSafe (0x42d27eEA1AD6e22Af6284F609847CB3Cd56B9c64) {
    +++ description: None
      sinceBlock:
+        16780617
    }
```

```diff
    contract L1DAIEscrow (0x467194771dAe2967Aef3ECbEDD3Bf9a310C76C65) {
    +++ description: Stores DAI deposited from the attached L1DAITokenBridge.
      sinceBlock:
+        12781427
    }
```

```diff
    contract SuperchainProxyAdmin (0x543bA4AADBAb8f9025686Bd03993043599c6fB04) {
    +++ description: None
      sinceBlock:
+        17365800
    }
```

```diff
    contract SuperchainProxyAdminOwner (0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A) {
    +++ description: None
      sinceBlock:
+        19185554
    }
```

```diff
    contract L1ERC721Bridge (0x5a7749f83b81B301cAb5f48EB8516B986DAef23D) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      sinceBlock:
+        15677422
    }
```

```diff
    contract SynthetixBridgeEscrow (0x5Fd79D46EBA7F351fe49BFF9E87cdeA6c821eF9f) {
    +++ description: Custom escrow for SNX bridged via canonical messaging.
      sinceBlock:
+        12409015
    }
```

```diff
    contract MIPS (0x5fE03a12C1236F9C22Cb6479778DDAa4bce6299C) {
    +++ description: The MIPS contract is used to execute the final step of the dispute game which objectively determines the winner of the dispute.
      sinceBlock:
+        21379266
    }
```

```diff
    contract OptimismMintableERC20Factory (0x75505a97BD334E7BD3C476893285569C4136Fa0F) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      sinceBlock:
+        17365803
    }
```

```diff
    contract wstETHEscrow (0x76943C0D61395d8F2edF9060e1533529cAe05dE6) {
    +++ description: Lido custom escrow for wstETH tokens that uses the canonical bridge for messaging but is governed externally.
      sinceBlock:
+        15281202
    }
```

```diff
    contract OpFoundationUpgradeSafe (0x847B5c174615B1B7fDF770882256e2D3E95b9D92) {
    +++ description: None
      sinceBlock:
+        19185544
    }
```

```diff
    contract PermissionedDisputeGame (0x91a661891248d8C4916FB4a1508492a5e2CBcb87) {
    +++ description: Same as FaultDisputeGame, but only two permissioned addresses are designated as proposer and challenger.
      sinceBlock:
+        21379270
    }
```

```diff
    contract SuperchainConfig (0x95703e0982140D16f8ebA6d158FccEde42f04a4C) {
    +++ description: Used to manage global configuration values for multiple OP Chains within a single Superchain network. The SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the Superchain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      sinceBlock:
+        19064589
    }
```

```diff
    contract L1StandardBridge (0x99C9fc46f92E8a1c0deC1b1747d010903E884bE1) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      sinceBlock:
+        12686786
    }
```

```diff
    contract OpFoundationOperationsSafe (0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A) {
    +++ description: None
      sinceBlock:
+        11670007
    }
```

```diff
    contract PreimageOracle (0x9c065e11870B891D214Bc2Da7EF1f9DDFA1BE277) {
    +++ description: The PreimageOracle contract is used to load the required data from L1 for a dispute game.
      sinceBlock:
+        20637600
    }
```

```diff
    contract FeesCollector (0xa3d596EAfaB6B13Ab18D40FaE1A962700C84ADEa) {
    +++ description: Collecting sequencer, base- and L1 fees from L2.
      sinceBlock:
+        16341988
    }
```

```diff
    contract OptimismPortal (0xbEb5Fc579115071764c7423A4f12eDde41f106Ed) {
    +++ description: The OptimismPortal contract is the main entry point to deposit funds from L1 to L2. It also allows to prove and finalize withdrawals. It specifies which game type can be used for withdrawals, which currently is the FaultDisputeGame.
      sinceBlock:
+        17365802
    }
```

```diff
    contract SecurityCouncilMultisig (0xc2819DC788505Aac350142A7A707BF9D03E3Bd03) {
    +++ description: None
      sinceBlock:
+        19185517
    }
```

```diff
    contract DeputyGuardianModule (0xc6901F65369FC59fC1B4D6D6bE7A2318Ff38dB5B) {
    +++ description: allows the 0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A, called the deputy guardian, to act on behalf of the Gnosis Safe.
      sinceBlock:
+        20566057
    }
```

```diff
    contract AddressManager (0xdE1FCfB0851916CA5101820A69b13a4E276bd81F) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      sinceBlock:
+        12686687
    }
```

```diff
    contract DisputeGameFactory (0xe5965Ab5962eDc7477C8520243A95517CD252fA9) {
    +++ description: The dispute game factory allows the creation of dispute games, used to propose state roots and eventually challenge them.
      sinceBlock:
+        19884569
    }
```

Generated with discovered.json: 0xbb1928a72ad4ebae57abb75bb2356f46d658a1ff

# Diff at Sat, 01 Mar 2025 09:54:33 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@a345eaeb3dc1d9d41bdaf608eb366f7f0aae874a block: 21829671
- current block number: 21829671

## Description

config related: added starknet discodrive templates incl escrows.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21829671 (main branch discovery), not current.

```diff
    contract L1DAIEscrow (0x467194771dAe2967Aef3ECbEDD3Bf9a310C76C65) {
    +++ description: Stores DAI deposited from the attached L1DAITokenBridge.
      values.wards:
+        ["0xBE8E3e3618f7474F8cB1d074A26afFef007E98FB","0x09e05fF6142F2f9de8B6B65855A1d56B6cfE4c58"]
      template:
+        "maker/L1Escrow"
    }
```

Generated with discovered.json: 0xc0c590f9293b4d447bbb55c50e1eda8895d12852

# Diff at Thu, 27 Feb 2025 12:01:46 GMT:

- chain: ethereum
- author: Michał Podsiadły (<michal.podsiadly@l2beat.com>)
- comparing to: main@a4b50e45bb44f8ceeea29f9236088d26a843c885 block: 21829671
- current block number: 21829671

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21829671 (main branch discovery), not current.

```diff
    contract OptimismPortal (0xbEb5Fc579115071764c7423A4f12eDde41f106Ed) {
    +++ description: The OptimismPortal contract is the main entry point to deposit funds from L1 to L2. It also allows to prove and finalize withdrawals. It specifies which game type can be used for withdrawals, which currently is the FaultDisputeGame.
      displayName:
+        "OptimismPortal2"
    }
```

Generated with discovered.json: 0xf654b71fc48982c2205f2d49c17291433b9f7a08

# Diff at Wed, 26 Feb 2025 16:18:43 GMT:

- chain: optimism
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@9eb8b2d626938c85a098b11b809352a92a892736 block: 132390328
- current block number: 132493968

## Description

Config related: Add L2 contracts as templates with source.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 132390328 (main branch discovery), not current.

```diff
    contract L2CrossDomainMessenger (0x4200000000000000000000000000000000000007) {
    +++ description: The L2CrossDomainMessenger (L2xDM) contract sends messages from L2 to L1, and relays messages from L1 onto L2 with a system tx. In the event that a message sent from L2 to L1 is rejected for exceeding the L1 gas limit, it can be resubmitted via this contract’s replay function.
      template:
+        "opstack/Layer2/L2CrossDomainMessenger"
    }
```

```diff
    contract GasPriceOracle (0x420000000000000000000000000000000000000F) {
    +++ description: Provides the current gas price for L2 transactions.
      template:
+        "opstack/Layer2/GasPriceOracle"
    }
```

```diff
    contract L2StandardBridge (0x4200000000000000000000000000000000000010) {
    +++ description: The L2StandardBridge contract is the main entry point to deposit or withdraw ERC20 tokens from L2 to L1. This contract can store any token.
      template:
+        "opstack/Layer2/L2StandardBridge"
    }
```

```diff
    contract SequencerFeeVault (0x4200000000000000000000000000000000000011) {
    +++ description: Collects the sequencer fees, which are withdrawable to the FeesCollector on L1.
      template:
+        "opstack/Layer2/SequencerFeeVault"
    }
```

```diff
    contract OptimismMintableERC20Factory (0x4200000000000000000000000000000000000012) {
    +++ description: Factory contract to create bridge compliant ERC20 IOU token representations of bridged L1 ERC20 tokens.
      template:
+        "opstack/Layer2/OptimismMintableERC20Factory"
    }
```

```diff
    contract L1BlockNumber (0x4200000000000000000000000000000000000013) {
    +++ description: Simple contract that returns the latest L1 block number.
      template:
+        "opstack/Layer2/L1BlockNumber"
    }
```

```diff
    contract L2ERC721Bridge (0x4200000000000000000000000000000000000014) {
    +++ description: The L2ERC721Bridge contract is the main entry point to deposit or withdraw ERC721 tokens from L2 to L1. This contract can store any token.
      template:
+        "opstack/Layer2/L2ERC721Bridge"
    }
```

```diff
    contract L1Block (0x4200000000000000000000000000000000000015) {
    +++ description: Simple contract that returns information about the latest L1 block, which is derived permissionlessly from the L1 chain.
      template:
+        "opstack/Layer2/L1Block"
    }
```

```diff
    contract L2ToL1MessagePasser (0x4200000000000000000000000000000000000016) {
    +++ description: Contract used internally by the L2CrossDomainMessenger to send messages to L1, including withdrawals. It can also be used directly as a low-level interface.
      template:
+        "opstack/Layer2/L2ToL1MessagePasser"
    }
```

```diff
    contract OptimismMintableERC721Factory (0x4200000000000000000000000000000000000017) {
    +++ description: Factory contract to create bridge compliant ERC721 IOU token representations of bridged L1 ERC721 tokens.
      template:
+        "opstack/Layer2/OptimismMintableERC721Factory"
    }
```

```diff
    contract ProxyAdmin (0x4200000000000000000000000000000000000018) {
    +++ description: None
      name:
-        "L2ProxyAdmin"
+        "ProxyAdmin"
      displayName:
-        "ProxyAdmin"
    }
```

```diff
    contract BaseFeeVault (0x4200000000000000000000000000000000000019) {
    +++ description: Collects EIP-1559 base fees, which are withdrawable to the FeesCollector on L1.
      template:
+        "opstack/Layer2/BaseFeeVault"
    }
```

```diff
    contract L1FeeVault (0x420000000000000000000000000000000000001A) {
    +++ description: Collects the L1 portion of the L2 transaction fees, which are withdrawable to the FeesCollector on L1.
      template:
+        "opstack/Layer2/L1FeeVault"
    }
```

```diff
    contract SchemaRegistry (0x4200000000000000000000000000000000000020) {
    +++ description: Contracts to register schemas for the Ethereum Attestation Service (EAS).
      template:
+        "opstack/Layer2/SchemaRegistry"
    }
```

```diff
    contract EAS (0x4200000000000000000000000000000000000021) {
    +++ description: Contract containing the main logic for the Ethereum Attestation Service (EAS).
      template:
+        "opstack/Layer2/EAS"
    }
```

Generated with discovered.json: 0xe79ecb7b53e573874c504a2b6fc82cca882f7c7f

# Diff at Wed, 26 Feb 2025 10:32:56 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@18513668f913fbe57a197f43655b19111df0e627 block: 21829671
- current block number: 21829671

## Description

config related: added categories for all opstack, op stack and polygoncdk stack templates.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21829671 (main branch discovery), not current.

```diff
    contract SystemConfig (0x229047fed2591dbec1eF1118d64F7aF3dB9EB290) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract L1CrossDomainMessenger (0x25ace71c97B33Cc4729CF772ae268934F7ab5fA1) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      category:
+        {"name":"Canonical Bridges","priority":2}
    }
```

```diff
    contract L1ERC721Bridge (0x5a7749f83b81B301cAb5f48EB8516B986DAef23D) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      category:
+        {"name":"Canonical Bridges","priority":2}
    }
```

```diff
    contract SuperchainConfig (0x95703e0982140D16f8ebA6d158FccEde42f04a4C) {
    +++ description: Used to manage global configuration values for multiple OP Chains within a single Superchain network. The SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the Superchain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      category:
+        {"name":"Shared Infrastructure","priority":4}
    }
```

```diff
    contract L1StandardBridge (0x99C9fc46f92E8a1c0deC1b1747d010903E884bE1) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      category:
+        {"name":"Canonical Bridges","priority":2}
    }
```

```diff
    contract OptimismPortal (0xbEb5Fc579115071764c7423A4f12eDde41f106Ed) {
    +++ description: The OptimismPortal contract is the main entry point to deposit funds from L1 to L2. It also allows to prove and finalize withdrawals. It specifies which game type can be used for withdrawals, which currently is the FaultDisputeGame.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract DisputeGameFactory (0xe5965Ab5962eDc7477C8520243A95517CD252fA9) {
    +++ description: The dispute game factory allows the creation of dispute games, used to propose state roots and eventually challenge them.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

Generated with discovered.json: 0x49a97b4161c2c2fa22dff0b24eabdfbdce65dec5

# Diff at Fri, 21 Feb 2025 08:59:50 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1cf9ec35847912163c4b663a633e258a434c0bca block: 21829671
- current block number: 21829671

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21829671 (main branch discovery), not current.

```diff
    contract L1CrossDomainMessenger (0x25ace71c97B33Cc4729CF772ae268934F7ab5fA1) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      categories:
-        ["Core"]
    }
```

```diff
    contract SuperchainConfig (0x95703e0982140D16f8ebA6d158FccEde42f04a4C) {
    +++ description: Used to manage global configuration values for multiple OP Chains within a single Superchain network. The SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the Superchain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      categories:
-        ["Upgrades&Governance"]
    }
```

```diff
    contract L1StandardBridge (0x99C9fc46f92E8a1c0deC1b1747d010903E884bE1) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      categories:
-        ["Gateways&Escrows"]
    }
```

Generated with discovered.json: 0x32e2202986ae0bfd2c9aeee9064bddd2c4b320c8

# Diff at Wed, 12 Feb 2025 10:00:09 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@554a6f0e6aa688c758b37653d0be7eb446f9152e block: 21802836
- current block number: 21829671

## Description

Optimism SecurityCouncil rotates signers.

## Watched changes

```diff
    contract SecurityCouncilMultisig (0xc2819DC788505Aac350142A7A707BF9D03E3Bd03) {
    +++ description: None
      values.$members.7:
-        "0x74FAE9a9fbe31d1F69b95f59CaF12736a8b6B310"
+        "0xd5b735b676A043a53946C3b6F6BE28c1ECE6aC90"
      values.$members.5:
-        "0x5C0F529d5B025540c54f71d2BcbB4c78F368C47e"
+        "0xEF9A98511939eEe6Ec69af62082E3F2ff606877c"
    }
```

Generated with discovered.json: 0xcb44a454fbff2336266629c0ebc16493b2eac91e

# Diff at Mon, 10 Feb 2025 19:04:22 GMT:

- chain: ethereum
- author: Michał Podsiadły (<michal.podsiadly@l2beat.com>)
- comparing to: main@3756adff7c1ac86d8af3374a90a75c1999aae2b3 block: 21802836
- current block number: 21802836

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21802836 (main branch discovery), not current.

```diff
    contract SystemConfig (0x229047fed2591dbec1eF1118d64F7aF3dB9EB290) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      values.opStackDA.isUsingEigenDA:
+        false
    }
```

Generated with discovered.json: 0x8722173fbd3544e8bbe3e1d40db7e9e65aa42244

# Diff at Sat, 08 Feb 2025 15:57:57 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@ef01ea79812e0d524af00be3fae1170cef6fd662 block: 21786507
- current block number: 21802836

## Description

Single SC member rotated.

## Watched changes

```diff
    contract SecurityCouncilMultisig (0xc2819DC788505Aac350142A7A707BF9D03E3Bd03) {
    +++ description: None
      values.$members.12:
-        "0xE895076cD050F1f042d1040E47b5929bE989E514"
+        "0x92827223f6b397CE9F208eE352bacA710765cACb"
      values.$members.1:
-        "0x0a122d8aA40758FBAFf0360BFB391EdFfD9758b8"
+        "0x652BC529E171847E2fFddCeA13567643C84ccB5f"
    }
```

Generated with discovered.json: 0x2a4a0b8161b118d83f09cbb458f531ad7ba42035

# Diff at Thu, 06 Feb 2025 09:16:56 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@fa699ce266b15edb364aa471a661f580ea1a4529 block: 21715623
- current block number: 21786507

## Description

OP Stack SC signer rotation.

## Watched changes

```diff
    contract SecurityCouncilMultisig (0xc2819DC788505Aac350142A7A707BF9D03E3Bd03) {
    +++ description: None
      values.$members.9:
-        "0x8Afe777B5A4D1e156435ab44Ad4b73A318cE0EA4"
+        "0x0aA384EB2fedD2741277A0f72909A0d7275575D7"
    }
```

Generated with discovered.json: 0x2a19130fd8007af6b57f015d92053932cbfb08d3

# Diff at Tue, 04 Feb 2025 12:34:03 GMT:

- chain: optimism
- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@145553eed7ba44636411ecb25e4099728acd02f9 block: 130896600
- current block number: 130896600

## Description

Rename 'configure' permission to 'interact'

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 130896600 (main branch discovery), not current.

```diff
    contract MintManagerOwner (0x2A82Ae142b2e62Cb7D10b55E323ACB1Cab663a26) {
    +++ description: None
      receivedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract MintManager (0x5C4e7Ba1E219E47948e6e3F55019A647bA501005) {
    +++ description: Controls the OP inflation rate, which is currently hardcoded to 2% annually.
      issuedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

Generated with discovered.json: 0xc8a909eec708f3e121a697c81119c1f8b103e4ac

# Diff at Tue, 04 Feb 2025 12:31:49 GMT:

- chain: ethereum
- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@145553eed7ba44636411ecb25e4099728acd02f9 block: 21715623
- current block number: 21715623

## Description

Rename 'configure' permission to 'interact'

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21715623 (main branch discovery), not current.

```diff
    contract LivenessModule (0x0454092516c9A4d636d3CAfA1e82161376C8a748) {
    +++ description: used to remove members inactive for 98d while making sure that the threshold remains above 75%. If the number of members falls below 8, the 0x847B5c174615B1B7fDF770882256e2D3E95b9D92 takes ownership of the multisig
      issuedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract SystemConfig (0x229047fed2591dbec1eF1118d64F7aF3dB9EB290) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      issuedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract LivenessGuard (0x24424336F04440b1c28685a38303aC33C9D14a25) {
    +++ description: Modular contract to be used together with the LivenessModule. Tracks liveness / activity of Safe owners.
      receivedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract SuperchainProxyAdmin (0x543bA4AADBAb8f9025686Bd03993043599c6fB04) {
    +++ description: None
      directlyReceivedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract SuperchainProxyAdminOwner (0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A) {
    +++ description: None
      receivedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract OpFoundationUpgradeSafe (0x847B5c174615B1B7fDF770882256e2D3E95b9D92) {
    +++ description: None
      receivedPermissions.1.permission:
-        "guard"
+        "interact"
      receivedPermissions.1.from:
-        "0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
+        "0x229047fed2591dbec1eF1118d64F7aF3dB9EB290"
      receivedPermissions.1.via:
-        [{"address":"0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2"},{"address":"0xc2819DC788505Aac350142A7A707BF9D03E3Bd03"},{"address":"0x0454092516c9A4d636d3CAfA1e82161376C8a748","condition":"the number of 0xc2819DC788505Aac350142A7A707BF9D03E3Bd03 members falls below 8."}]
      receivedPermissions.1.description:
+        "it can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system."
      receivedPermissions.0.permission:
-        "configure"
+        "guard"
      receivedPermissions.0.from:
-        "0x229047fed2591dbec1eF1118d64F7aF3dB9EB290"
+        "0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
      receivedPermissions.0.description:
-        "it can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system."
      receivedPermissions.0.via:
+        [{"address":"0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2"},{"address":"0xc2819DC788505Aac350142A7A707BF9D03E3Bd03"},{"address":"0x0454092516c9A4d636d3CAfA1e82161376C8a748","condition":"the number of 0xc2819DC788505Aac350142A7A707BF9D03E3Bd03 members falls below 8."}]
    }
```

```diff
    contract AddressManager (0xdE1FCfB0851916CA5101820A69b13a4E276bd81F) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      issuedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

Generated with discovered.json: 0x0455cb9a7661f2ac5522b9735c07a463a7a67503

# Diff at Mon, 27 Jan 2025 11:40:56 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@43cb526d71ed01f024dced9d5aea2a30cf306714 block: 21667015
- current block number: 21715623

## Description

This is a SystemConfig upgrade (v2.3.0, adding gasToken support) for five Superchain eco chains that use superchain governance.
- op mainnet
- metal
- zora
- arena-z
- mode

Due to temporary storage setter implementations, multiple upgrades are counted within a single tx.

## Watched changes

```diff
    contract SystemConfig (0x229047fed2591dbec1eF1118d64F7aF3dB9EB290) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      sourceHashes.1:
-        "0xbbb92920a096eced30e3ce67bbc443f134b217e8847433fbb192ecb9fdddcbc2"
+        "0xc7135dbd2a53312d36df3f3ee91ce0a5a459ab8fc7725880a3a9c55a5fa0ed6c"
      values.$implementation:
-        "0xF56D96B2535B932656d3c04Ebf51baBff241D886"
+        "0xAB9d6cB7A427c0765163A7f45BB91cAfe5f2D375"
      values.$pastUpgrades.8:
+        ["2025-01-24T14:41:35.000Z","0x86da7386a26978c3db89e97c1f4feee613a8a0c07bbe4640624b05276f49c350",["0xAB9d6cB7A427c0765163A7f45BB91cAfe5f2D375"]]
      values.$pastUpgrades.7:
+        ["2025-01-24T14:41:35.000Z","0x86da7386a26978c3db89e97c1f4feee613a8a0c07bbe4640624b05276f49c350",["0xd81f43eDBCAcb4c29a9bA38a13Ee5d79278270cC"]]
      values.$upgradeCount:
-        7
+        9
      values.version:
-        "2.2.0"
+        "2.3.0"
      values.basefeeScalar:
+        5227
      values.blobbasefeeScalar:
+        1014213
      values.eip1559Denominator:
+        0
      values.eip1559Elasticity:
+        0
      values.gasPayingToken:
+        {"addr_":"0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE","decimals_":18}
      values.gasPayingTokenName:
+        "Ether"
      values.gasPayingTokenSymbol:
+        "ETH"
      values.isCustomGasToken:
+        false
    }
```

## Source code changes

```diff
.../SystemConfig/SystemConfig.sol                  | 1458 +++++++++++++++++++-
 1 file changed, 1436 insertions(+), 22 deletions(-)
```

Generated with discovered.json: 0xfe4f950cc9481767f7f4d17684d9295c599d211a

# Diff at Tue, 21 Jan 2025 11:19:15 GMT:

- chain: ethereum
- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@0da84acc479f34212f2c8133869a3eef33d46ecc block: 21667015
- current block number: 21667015

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21667015 (main branch discovery), not current.

```diff
    contract LivenessModule (0x0454092516c9A4d636d3CAfA1e82161376C8a748) {
    +++ description: used to remove members inactive for 98d while making sure that the threshold remains above 75%. If the number of members falls below 8, the 0x847B5c174615B1B7fDF770882256e2D3E95b9D92 takes ownership of the multisig
      receivedPermissions:
-        [{"permission":"guard","from":"0x95703e0982140D16f8ebA6d158FccEde42f04a4C","via":[{"address":"0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2"},{"address":"0xc2819DC788505Aac350142A7A707BF9D03E3Bd03"}]}]
      issuedPermissions:
+        [{"permission":"configure","to":"0x24424336F04440b1c28685a38303aC33C9D14a25","description":"can remove members of 0xc2819DC788505Aac350142A7A707BF9D03E3Bd03 inactive for 98d.","via":[]}]
    }
```

```diff
    contract LivenessGuard (0x24424336F04440b1c28685a38303aC33C9D14a25) {
    +++ description: Modular contract to be used together with the LivenessModule. Tracks liveness / activity of Safe owners.
      receivedPermissions:
+        [{"permission":"configure","from":"0x0454092516c9A4d636d3CAfA1e82161376C8a748","description":"can remove members of 0xc2819DC788505Aac350142A7A707BF9D03E3Bd03 inactive for 98d."}]
    }
```

```diff
    contract OpFoundationUpgradeSafe (0x847B5c174615B1B7fDF770882256e2D3E95b9D92) {
    +++ description: None
      receivedPermissions.1:
+        {"permission":"guard","from":"0x95703e0982140D16f8ebA6d158FccEde42f04a4C","via":[{"address":"0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2"},{"address":"0xc2819DC788505Aac350142A7A707BF9D03E3Bd03"},{"address":"0x0454092516c9A4d636d3CAfA1e82161376C8a748","condition":"the number of 0xc2819DC788505Aac350142A7A707BF9D03E3Bd03 members falls below 8."}]}
      directlyReceivedPermissions:
+        [{"permission":"act","from":"0x0454092516c9A4d636d3CAfA1e82161376C8a748","description":"takes ownership of 0xc2819DC788505Aac350142A7A707BF9D03E3Bd03","condition":"the number of 0xc2819DC788505Aac350142A7A707BF9D03E3Bd03 members falls below 8."}]
    }
```

```diff
    contract SuperchainConfig (0x95703e0982140D16f8ebA6d158FccEde42f04a4C) {
    +++ description: Used to manage global configuration values for multiple OP Chains within a single Superchain network. The SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the Superchain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      issuedPermissions.1.via.0.condition:
+        "not revoked by the Security Council"
      issuedPermissions.0.to:
-        "0x0454092516c9A4d636d3CAfA1e82161376C8a748"
+        "0x847B5c174615B1B7fDF770882256e2D3E95b9D92"
      issuedPermissions.0.via.2:
+        {"address":"0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2"}
      issuedPermissions.0.via.1.address:
-        "0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2"
+        "0xc2819DC788505Aac350142A7A707BF9D03E3Bd03"
      issuedPermissions.0.via.0.address:
-        "0xc2819DC788505Aac350142A7A707BF9D03E3Bd03"
+        "0x0454092516c9A4d636d3CAfA1e82161376C8a748"
      issuedPermissions.0.via.0.condition:
+        "the number of 0xc2819DC788505Aac350142A7A707BF9D03E3Bd03 members falls below 8."
    }
```

```diff
    contract OpFoundationOperationsSafe (0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A) {
    +++ description: None
      receivedPermissions.0.via.1.condition:
+        "not revoked by the Security Council"
      directlyReceivedPermissions.0.condition:
+        "not revoked by the Security Council"
    }
```

Generated with discovered.json: 0xae91963222c9b674621fdfc1d623d287a26da936

# Diff at Mon, 20 Jan 2025 16:53:06 GMT:

- chain: optimism
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@dcd1272b687a01381d2cbcd98213070f430a92aa block: 130664390
- current block number: 130896600

## Description

discodrive!

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 130664390 (main branch discovery), not current.

```diff
    contract MintManagerOwner (0x2A82Ae142b2e62Cb7D10b55E323ACB1Cab663a26) {
    +++ description: None
      receivedPermissions:
+        [{"permission":"configure","from":"0x5C4e7Ba1E219E47948e6e3F55019A647bA501005","description":"change the OP token owner to a different MintManager and therefore change the inflation policy."}]
    }
```

```diff
    contract DeployerWhitelist (0x4200000000000000000000000000000000000002) {
    +++ description: Legacy contract that was originally used to act as a whitelist of addresses allowed to the Optimism network. Fully unused and deprecated since the Bedrock upgrade.
      description:
+        "Legacy contract that was originally used to act as a whitelist of addresses allowed to the Optimism network. Fully unused and deprecated since the Bedrock upgrade."
    }
```

```diff
    contract L2CrossDomainMessenger (0x4200000000000000000000000000000000000007) {
    +++ description: The L2CrossDomainMessenger (L2xDM) contract sends messages from L2 to L1, and relays messages from L1 onto L2 with a system tx. In the event that a message sent from L2 to L1 is rejected for exceeding the L1 gas limit, it can be resubmitted via this contract’s replay function.
      description:
+        "The L2CrossDomainMessenger (L2xDM) contract sends messages from L2 to L1, and relays messages from L1 onto L2 with a system tx. In the event that a message sent from L2 to L1 is rejected for exceeding the L1 gas limit, it can be resubmitted via this contract’s replay function."
    }
```

```diff
    contract GasPriceOracle (0x420000000000000000000000000000000000000F) {
    +++ description: Provides the current gas price for L2 transactions.
      description:
+        "Provides the current gas price for L2 transactions."
    }
```

```diff
    contract L2StandardBridge (0x4200000000000000000000000000000000000010) {
    +++ description: The L2StandardBridge contract is the main entry point to deposit or withdraw ERC20 tokens from L2 to L1. This contract can store any token.
      description:
+        "The L2StandardBridge contract is the main entry point to deposit or withdraw ERC20 tokens from L2 to L1. This contract can store any token."
    }
```

```diff
    contract SequencerFeeVault (0x4200000000000000000000000000000000000011) {
    +++ description: Collects the sequencer fees, which are withdrawable to the FeesCollector on L1.
      description:
+        "Collects the sequencer fees, which are withdrawable to the FeesCollector on L1."
    }
```

```diff
    contract OptimismMintableERC20Factory (0x4200000000000000000000000000000000000012) {
    +++ description: Factory contract to create bridge compliant ERC20 IOU token representations of bridged L1 ERC20 tokens.
      description:
+        "Factory contract to create bridge compliant ERC20 IOU token representations of bridged L1 ERC20 tokens."
    }
```

```diff
    contract L1BlockNumber (0x4200000000000000000000000000000000000013) {
    +++ description: Simple contract that returns the latest L1 block number.
      description:
+        "Simple contract that returns the latest L1 block number."
    }
```

```diff
    contract L2ERC721Bridge (0x4200000000000000000000000000000000000014) {
    +++ description: The L2ERC721Bridge contract is the main entry point to deposit or withdraw ERC721 tokens from L2 to L1. This contract can store any token.
      description:
+        "The L2ERC721Bridge contract is the main entry point to deposit or withdraw ERC721 tokens from L2 to L1. This contract can store any token."
    }
```

```diff
    contract L1Block (0x4200000000000000000000000000000000000015) {
    +++ description: Simple contract that returns information about the latest L1 block, which is derived permissionlessly from the L1 chain.
      description:
+        "Simple contract that returns information about the latest L1 block, which is derived permissionlessly from the L1 chain."
    }
```

```diff
    contract L2ToL1MessagePasser (0x4200000000000000000000000000000000000016) {
    +++ description: Contract used internally by the L2CrossDomainMessenger to send messages to L1, including withdrawals. It can also be used directly as a low-level interface.
      description:
+        "Contract used internally by the L2CrossDomainMessenger to send messages to L1, including withdrawals. It can also be used directly as a low-level interface."
    }
```

```diff
    contract OptimismMintableERC721Factory (0x4200000000000000000000000000000000000017) {
    +++ description: Factory contract to create bridge compliant ERC721 IOU token representations of bridged L1 ERC721 tokens.
      description:
+        "Factory contract to create bridge compliant ERC721 IOU token representations of bridged L1 ERC721 tokens."
    }
```

```diff
    contract BaseFeeVault (0x4200000000000000000000000000000000000019) {
    +++ description: Collects EIP-1559 base fees, which are withdrawable to the FeesCollector on L1.
      description:
+        "Collects EIP-1559 base fees, which are withdrawable to the FeesCollector on L1."
    }
```

```diff
    contract L1FeeVault (0x420000000000000000000000000000000000001A) {
    +++ description: Collects the L1 portion of the L2 transaction fees, which are withdrawable to the FeesCollector on L1.
      description:
+        "Collects the L1 portion of the L2 transaction fees, which are withdrawable to the FeesCollector on L1."
    }
```

```diff
    contract SchemaRegistry (0x4200000000000000000000000000000000000020) {
    +++ description: Contracts to register schemas for the Ethereum Attestation Service (EAS).
      description:
+        "Contracts to register schemas for the Ethereum Attestation Service (EAS)."
    }
```

```diff
    contract EAS (0x4200000000000000000000000000000000000021) {
    +++ description: Contract containing the main logic for the Ethereum Attestation Service (EAS).
      description:
+        "Contract containing the main logic for the Ethereum Attestation Service (EAS)."
    }
```

```diff
    contract OPToken (0x4200000000000000000000000000000000000042) {
    +++ description: The OP token contract. The minting policy is controlled by the 0x5C4e7Ba1E219E47948e6e3F55019A647bA501005.
      description:
+        "The OP token contract. The minting policy is controlled by the 0x5C4e7Ba1E219E47948e6e3F55019A647bA501005."
    }
```

```diff
    contract MintManager (0x5C4e7Ba1E219E47948e6e3F55019A647bA501005) {
    +++ description: Controls the OP inflation rate, which is currently hardcoded to 2% annually.
      description:
+        "Controls the OP inflation rate, which is currently hardcoded to 2% annually."
      issuedPermissions:
+        [{"permission":"configure","to":"0x2A82Ae142b2e62Cb7D10b55E323ACB1Cab663a26","description":"change the OP token owner to a different MintManager and therefore change the inflation policy.","via":[]}]
    }
```

Generated with discovered.json: 0xdbdb1340e6fba71b420ba1d6aa279fdc2bac5cef

# Diff at Mon, 20 Jan 2025 16:52:23 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@dcd1272b687a01381d2cbcd98213070f430a92aa block: 21628485
- current block number: 21667015

## Description

discodrive!

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21628485 (main branch discovery), not current.

```diff
    contract L1DAITokenBridge (0x10E6593CDda8c58a1d0f14C5164B376352a55f2F) {
    +++ description: Custom Gateway for DAI deposits via canonical messaging. Deposited DAI is forwarded to a Vault contract.
      description:
+        "Custom Gateway for DAI deposits via canonical messaging. Deposited DAI is forwarded to a Vault contract."
    }
```

```diff
    contract LivenessGuard (0x24424336F04440b1c28685a38303aC33C9D14a25) {
    +++ description: Modular contract to be used together with the LivenessModule. Tracks liveness / activity of Safe owners.
      description:
+        "Modular contract to be used together with the LivenessModule. Tracks liveness / activity of Safe owners."
    }
```

```diff
    contract L1DAIEscrow (0x467194771dAe2967Aef3ECbEDD3Bf9a310C76C65) {
    +++ description: Stores DAI deposited from the attached L1DAITokenBridge.
      name:
-        "L1Escrow"
+        "L1DAIEscrow"
      description:
+        "Stores DAI deposited from the attached L1DAITokenBridge."
    }
```

```diff
    contract SynthetixBridgeEscrow (0x5Fd79D46EBA7F351fe49BFF9E87cdeA6c821eF9f) {
    +++ description: Custom escrow for SNX bridged via canonical messaging.
      description:
+        "Custom escrow for SNX bridged via canonical messaging."
    }
```

```diff
    contract FeesCollector (0xa3d596EAfaB6B13Ab18D40FaE1A962700C84ADEa) {
    +++ description: Collecting sequencer, base- and L1 fees from L2.
      description:
+        "Collecting sequencer, base- and L1 fees from L2."
    }
```

```diff
    contract SecurityCouncilMultisig (0xc2819DC788505Aac350142A7A707BF9D03E3Bd03) {
    +++ description: None
      references:
+        [{"text":"Security Council members - Optimism Collective Governance Forum","href":"https://gov.optimism.io/t/security-council-vote-2-initial-member-ratification/7118"}]
    }
```

Generated with discovered.json: 0xb64fb12ad7c0ba866205db300934491b303764ef

# Diff at Mon, 20 Jan 2025 11:10:41 GMT:

- chain: optimism
- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@2c8b4f3d9910bb6371be9b4df87b70856e7d8c64 block: 130664390
- current block number: 130664390

## Description

Rerun on the same block number. Applies fixes to permissions and via field. Renames permission's target to to/from.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 130664390 (main branch discovery), not current.

```diff
    contract DeployerWhitelist (0x4200000000000000000000000000000000000002) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x6B1BAE59D09fCcbdDB6C6cceb07B7279367C4E3b"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x6B1BAE59D09fCcbdDB6C6cceb07B7279367C4E3b"
    }
```

```diff
    contract L2CrossDomainMessenger (0x4200000000000000000000000000000000000007) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x6B1BAE59D09fCcbdDB6C6cceb07B7279367C4E3b"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x6B1BAE59D09fCcbdDB6C6cceb07B7279367C4E3b"
    }
```

```diff
    contract GasPriceOracle (0x420000000000000000000000000000000000000F) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x6B1BAE59D09fCcbdDB6C6cceb07B7279367C4E3b"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x6B1BAE59D09fCcbdDB6C6cceb07B7279367C4E3b"
    }
```

```diff
    contract L2StandardBridge (0x4200000000000000000000000000000000000010) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x6B1BAE59D09fCcbdDB6C6cceb07B7279367C4E3b"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x6B1BAE59D09fCcbdDB6C6cceb07B7279367C4E3b"
    }
```

```diff
    contract SequencerFeeVault (0x4200000000000000000000000000000000000011) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x6B1BAE59D09fCcbdDB6C6cceb07B7279367C4E3b"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x6B1BAE59D09fCcbdDB6C6cceb07B7279367C4E3b"
    }
```

```diff
    contract OptimismMintableERC20Factory (0x4200000000000000000000000000000000000012) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x6B1BAE59D09fCcbdDB6C6cceb07B7279367C4E3b"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x6B1BAE59D09fCcbdDB6C6cceb07B7279367C4E3b"
    }
```

```diff
    contract L1BlockNumber (0x4200000000000000000000000000000000000013) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x6B1BAE59D09fCcbdDB6C6cceb07B7279367C4E3b"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x6B1BAE59D09fCcbdDB6C6cceb07B7279367C4E3b"
    }
```

```diff
    contract L2ERC721Bridge (0x4200000000000000000000000000000000000014) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x6B1BAE59D09fCcbdDB6C6cceb07B7279367C4E3b"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x6B1BAE59D09fCcbdDB6C6cceb07B7279367C4E3b"
    }
```

```diff
    contract L1Block (0x4200000000000000000000000000000000000015) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x6B1BAE59D09fCcbdDB6C6cceb07B7279367C4E3b"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x6B1BAE59D09fCcbdDB6C6cceb07B7279367C4E3b"
    }
```

```diff
    contract L2ToL1MessagePasser (0x4200000000000000000000000000000000000016) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x6B1BAE59D09fCcbdDB6C6cceb07B7279367C4E3b"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x6B1BAE59D09fCcbdDB6C6cceb07B7279367C4E3b"
    }
```

```diff
    contract OptimismMintableERC721Factory (0x4200000000000000000000000000000000000017) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x6B1BAE59D09fCcbdDB6C6cceb07B7279367C4E3b"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x6B1BAE59D09fCcbdDB6C6cceb07B7279367C4E3b"
    }
```

```diff
    contract L2ProxyAdmin (0x4200000000000000000000000000000000000018) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x6B1BAE59D09fCcbdDB6C6cceb07B7279367C4E3b"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x6B1BAE59D09fCcbdDB6C6cceb07B7279367C4E3b"
      directlyReceivedPermissions.15.target:
-        "0x4200000000000000000000000000000000000021"
      directlyReceivedPermissions.15.from:
+        "0x4200000000000000000000000000000000000021"
      directlyReceivedPermissions.14.target:
-        "0x4200000000000000000000000000000000000020"
      directlyReceivedPermissions.14.from:
+        "0x4200000000000000000000000000000000000020"
      directlyReceivedPermissions.13.target:
-        "0x420000000000000000000000000000000000001A"
      directlyReceivedPermissions.13.from:
+        "0x420000000000000000000000000000000000001A"
      directlyReceivedPermissions.12.target:
-        "0x4200000000000000000000000000000000000019"
      directlyReceivedPermissions.12.from:
+        "0x4200000000000000000000000000000000000019"
      directlyReceivedPermissions.11.target:
-        "0x4200000000000000000000000000000000000018"
      directlyReceivedPermissions.11.from:
+        "0x4200000000000000000000000000000000000018"
      directlyReceivedPermissions.10.target:
-        "0x4200000000000000000000000000000000000017"
      directlyReceivedPermissions.10.from:
+        "0x4200000000000000000000000000000000000017"
      directlyReceivedPermissions.9.target:
-        "0x4200000000000000000000000000000000000016"
      directlyReceivedPermissions.9.from:
+        "0x4200000000000000000000000000000000000016"
      directlyReceivedPermissions.8.target:
-        "0x4200000000000000000000000000000000000015"
      directlyReceivedPermissions.8.from:
+        "0x4200000000000000000000000000000000000015"
      directlyReceivedPermissions.7.target:
-        "0x4200000000000000000000000000000000000014"
      directlyReceivedPermissions.7.from:
+        "0x4200000000000000000000000000000000000014"
      directlyReceivedPermissions.6.target:
-        "0x4200000000000000000000000000000000000013"
      directlyReceivedPermissions.6.from:
+        "0x4200000000000000000000000000000000000013"
      directlyReceivedPermissions.5.target:
-        "0x4200000000000000000000000000000000000012"
      directlyReceivedPermissions.5.from:
+        "0x4200000000000000000000000000000000000012"
      directlyReceivedPermissions.4.target:
-        "0x4200000000000000000000000000000000000011"
      directlyReceivedPermissions.4.from:
+        "0x4200000000000000000000000000000000000011"
      directlyReceivedPermissions.3.target:
-        "0x4200000000000000000000000000000000000010"
      directlyReceivedPermissions.3.from:
+        "0x4200000000000000000000000000000000000010"
      directlyReceivedPermissions.2.target:
-        "0x420000000000000000000000000000000000000F"
      directlyReceivedPermissions.2.from:
+        "0x420000000000000000000000000000000000000F"
      directlyReceivedPermissions.1.target:
-        "0x4200000000000000000000000000000000000007"
      directlyReceivedPermissions.1.from:
+        "0x4200000000000000000000000000000000000007"
      directlyReceivedPermissions.0.target:
-        "0x4200000000000000000000000000000000000002"
      directlyReceivedPermissions.0.from:
+        "0x4200000000000000000000000000000000000002"
    }
```

```diff
    contract BaseFeeVault (0x4200000000000000000000000000000000000019) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x6B1BAE59D09fCcbdDB6C6cceb07B7279367C4E3b"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x6B1BAE59D09fCcbdDB6C6cceb07B7279367C4E3b"
    }
```

```diff
    contract L1FeeVault (0x420000000000000000000000000000000000001A) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x6B1BAE59D09fCcbdDB6C6cceb07B7279367C4E3b"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x6B1BAE59D09fCcbdDB6C6cceb07B7279367C4E3b"
    }
```

```diff
    contract SchemaRegistry (0x4200000000000000000000000000000000000020) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x6B1BAE59D09fCcbdDB6C6cceb07B7279367C4E3b"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x6B1BAE59D09fCcbdDB6C6cceb07B7279367C4E3b"
    }
```

```diff
    contract EAS (0x4200000000000000000000000000000000000021) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x6B1BAE59D09fCcbdDB6C6cceb07B7279367C4E3b"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x6B1BAE59D09fCcbdDB6C6cceb07B7279367C4E3b"
    }
```

Generated with discovered.json: 0x8041ea0cdb624733b4720a0c5e34a4532f51cbe4

# Diff at Mon, 20 Jan 2025 11:09:51 GMT:

- chain: ethereum
- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@2c8b4f3d9910bb6371be9b4df87b70856e7d8c64 block: 21628485
- current block number: 21628485

## Description

Rerun on the same block number. Applies fixes to permissions and via field. Renames permission's target to to/from.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21628485 (main branch discovery), not current.

```diff
    contract LivenessModule (0x0454092516c9A4d636d3CAfA1e82161376C8a748) {
    +++ description: used to remove members inactive for 98d while making sure that the threshold remains above 75%. If the number of members falls below 8, the 0x847B5c174615B1B7fDF770882256e2D3E95b9D92 takes ownership of the multisig
      receivedPermissions.0.target:
-        "0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
      receivedPermissions.0.from:
+        "0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
      directlyReceivedPermissions.0.target:
-        "0xc2819DC788505Aac350142A7A707BF9D03E3Bd03"
      directlyReceivedPermissions.0.from:
+        "0xc2819DC788505Aac350142A7A707BF9D03E3Bd03"
    }
```

```diff
    contract GuardianMultisig (0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2) {
    +++ description: None
      directlyReceivedPermissions.0.target:
-        "0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
      directlyReceivedPermissions.0.from:
+        "0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
    }
```

```diff
    contract AnchorStateRegistry (0x18DAc71c228D1C32c99489B7323d441E1175e443) {
    +++ description: Contains the latest confirmed state root that can be used as a starting point in a dispute game.
      issuedPermissions.0.target:
-        "0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A"
    }
```

```diff
    contract DelayedWETH_PermissionedGames (0x21429aF66058BC3e4aE4a8f2EC4531AaC433ecbC) {
    +++ description: Contract designed to hold the bonded ETH for each game. It is designed as a wrapper around WETH to allow an owner to function as a backstop if a game would incorrectly distribute funds.
      issuedPermissions.0.target:
-        "0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A"
    }
```

```diff
    contract SystemConfig (0x229047fed2591dbec1eF1118d64F7aF3dB9EB290) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      issuedPermissions.2.target:
-        "0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A"
      issuedPermissions.2.via.0.delay:
-        0
      issuedPermissions.2.to:
+        "0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A"
      issuedPermissions.1.target:
-        "0x6887246668a3b87F54DeB3b94Ba47a6f63F32985"
      issuedPermissions.1.to:
+        "0x6887246668a3b87F54DeB3b94Ba47a6f63F32985"
      issuedPermissions.0.target:
-        "0x847B5c174615B1B7fDF770882256e2D3E95b9D92"
      issuedPermissions.0.to:
+        "0x847B5c174615B1B7fDF770882256e2D3E95b9D92"
      issuedPermissions.0.description:
+        "it can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system."
    }
```

```diff
    contract DelayedWETH_PermissionlessGames (0x323dFC63c9B83CB83f40325AaB74b245937cbdF0) {
    +++ description: Contract designed to hold the bonded ETH for each game. It is designed as a wrapper around WETH to allow an owner to function as a backstop if a game would incorrectly distribute funds.
      issuedPermissions.0.target:
-        "0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A"
    }
```

```diff
    contract SuperchainProxyAdmin (0x543bA4AADBAb8f9025686Bd03993043599c6fB04) {
    +++ description: None
      directlyReceivedPermissions.10.target:
-        "0xe5965Ab5962eDc7477C8520243A95517CD252fA9"
      directlyReceivedPermissions.10.from:
+        "0xe5965Ab5962eDc7477C8520243A95517CD252fA9"
      directlyReceivedPermissions.9.target:
-        "0xbEb5Fc579115071764c7423A4f12eDde41f106Ed"
      directlyReceivedPermissions.9.from:
+        "0xbEb5Fc579115071764c7423A4f12eDde41f106Ed"
      directlyReceivedPermissions.8.target:
-        "0x99C9fc46f92E8a1c0deC1b1747d010903E884bE1"
      directlyReceivedPermissions.8.from:
+        "0x99C9fc46f92E8a1c0deC1b1747d010903E884bE1"
      directlyReceivedPermissions.7.target:
-        "0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
      directlyReceivedPermissions.7.from:
+        "0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
      directlyReceivedPermissions.6.target:
-        "0x75505a97BD334E7BD3C476893285569C4136Fa0F"
      directlyReceivedPermissions.6.from:
+        "0x75505a97BD334E7BD3C476893285569C4136Fa0F"
      directlyReceivedPermissions.5.target:
-        "0x5a7749f83b81B301cAb5f48EB8516B986DAef23D"
      directlyReceivedPermissions.5.from:
+        "0x5a7749f83b81B301cAb5f48EB8516B986DAef23D"
      directlyReceivedPermissions.4.target:
-        "0x323dFC63c9B83CB83f40325AaB74b245937cbdF0"
      directlyReceivedPermissions.4.from:
+        "0x323dFC63c9B83CB83f40325AaB74b245937cbdF0"
      directlyReceivedPermissions.3.target:
-        "0x229047fed2591dbec1eF1118d64F7aF3dB9EB290"
      directlyReceivedPermissions.3.from:
+        "0x229047fed2591dbec1eF1118d64F7aF3dB9EB290"
      directlyReceivedPermissions.2.target:
-        "0x21429aF66058BC3e4aE4a8f2EC4531AaC433ecbC"
      directlyReceivedPermissions.2.from:
+        "0x21429aF66058BC3e4aE4a8f2EC4531AaC433ecbC"
      directlyReceivedPermissions.1.target:
-        "0x18DAc71c228D1C32c99489B7323d441E1175e443"
      directlyReceivedPermissions.1.from:
+        "0x18DAc71c228D1C32c99489B7323d441E1175e443"
      directlyReceivedPermissions.0.target:
-        "0xdE1FCfB0851916CA5101820A69b13a4E276bd81F"
      directlyReceivedPermissions.0.from:
+        "0xdE1FCfB0851916CA5101820A69b13a4E276bd81F"
    }
```

```diff
    contract SuperchainProxyAdminOwner (0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A) {
    +++ description: None
      receivedPermissions.10.target:
-        "0xe5965Ab5962eDc7477C8520243A95517CD252fA9"
      receivedPermissions.10.from:
+        "0xe5965Ab5962eDc7477C8520243A95517CD252fA9"
      receivedPermissions.9.target:
-        "0xbEb5Fc579115071764c7423A4f12eDde41f106Ed"
      receivedPermissions.9.from:
+        "0xbEb5Fc579115071764c7423A4f12eDde41f106Ed"
      receivedPermissions.8.target:
-        "0x99C9fc46f92E8a1c0deC1b1747d010903E884bE1"
      receivedPermissions.8.from:
+        "0x99C9fc46f92E8a1c0deC1b1747d010903E884bE1"
      receivedPermissions.7.target:
-        "0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
      receivedPermissions.7.from:
+        "0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
      receivedPermissions.6.target:
-        "0x75505a97BD334E7BD3C476893285569C4136Fa0F"
      receivedPermissions.6.from:
+        "0x75505a97BD334E7BD3C476893285569C4136Fa0F"
      receivedPermissions.5.target:
-        "0x5a7749f83b81B301cAb5f48EB8516B986DAef23D"
      receivedPermissions.5.from:
+        "0x5a7749f83b81B301cAb5f48EB8516B986DAef23D"
      receivedPermissions.4.target:
-        "0x323dFC63c9B83CB83f40325AaB74b245937cbdF0"
      receivedPermissions.4.from:
+        "0x323dFC63c9B83CB83f40325AaB74b245937cbdF0"
      receivedPermissions.3.target:
-        "0x229047fed2591dbec1eF1118d64F7aF3dB9EB290"
      receivedPermissions.3.from:
+        "0x229047fed2591dbec1eF1118d64F7aF3dB9EB290"
      receivedPermissions.2.target:
-        "0x21429aF66058BC3e4aE4a8f2EC4531AaC433ecbC"
      receivedPermissions.2.from:
+        "0x21429aF66058BC3e4aE4a8f2EC4531AaC433ecbC"
      receivedPermissions.1.target:
-        "0x18DAc71c228D1C32c99489B7323d441E1175e443"
      receivedPermissions.1.from:
+        "0x18DAc71c228D1C32c99489B7323d441E1175e443"
      receivedPermissions.0.target:
-        "0xdE1FCfB0851916CA5101820A69b13a4E276bd81F"
      receivedPermissions.0.from:
+        "0xdE1FCfB0851916CA5101820A69b13a4E276bd81F"
      directlyReceivedPermissions.0.target:
-        "0x543bA4AADBAb8f9025686Bd03993043599c6fB04"
      directlyReceivedPermissions.0.from:
+        "0x543bA4AADBAb8f9025686Bd03993043599c6fB04"
    }
```

```diff
    contract L1ERC721Bridge (0x5a7749f83b81B301cAb5f48EB8516B986DAef23D) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      issuedPermissions.0.target:
-        "0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A"
    }
```

```diff
    contract OptimismMintableERC20Factory (0x75505a97BD334E7BD3C476893285569C4136Fa0F) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      issuedPermissions.0.target:
-        "0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A"
    }
```

```diff
    contract OpFoundationUpgradeSafe (0x847B5c174615B1B7fDF770882256e2D3E95b9D92) {
    +++ description: None
      receivedPermissions.0.target:
-        "0x229047fed2591dbec1eF1118d64F7aF3dB9EB290"
      receivedPermissions.0.from:
+        "0x229047fed2591dbec1eF1118d64F7aF3dB9EB290"
    }
```

```diff
    contract SuperchainConfig (0x95703e0982140D16f8ebA6d158FccEde42f04a4C) {
    +++ description: Used to manage global configuration values for multiple OP Chains within a single Superchain network. The SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the Superchain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      issuedPermissions.3.target:
-        "0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A"
      issuedPermissions.3.via.0.delay:
-        0
      issuedPermissions.3.to:
+        "0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A"
      issuedPermissions.2.target:
-        "0xc2819DC788505Aac350142A7A707BF9D03E3Bd03"
      issuedPermissions.2.via.0.delay:
-        0
      issuedPermissions.2.to:
+        "0xc2819DC788505Aac350142A7A707BF9D03E3Bd03"
      issuedPermissions.1.target:
-        "0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A"
      issuedPermissions.1.via.1.delay:
-        0
      issuedPermissions.1.via.0.delay:
-        0
      issuedPermissions.1.to:
+        "0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A"
      issuedPermissions.0.target:
-        "0x0454092516c9A4d636d3CAfA1e82161376C8a748"
      issuedPermissions.0.via.1.delay:
-        0
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x0454092516c9A4d636d3CAfA1e82161376C8a748"
    }
```

```diff
    contract L1StandardBridge (0x99C9fc46f92E8a1c0deC1b1747d010903E884bE1) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      issuedPermissions.0.target:
-        "0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.via.0.description:
-        "upgrading the bridge implementation can give access to all funds escrowed therein."
      issuedPermissions.0.to:
+        "0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A"
      issuedPermissions.0.description:
+        "upgrading the bridge implementation can give access to all funds escrowed therein."
    }
```

```diff
    contract OpFoundationOperationsSafe (0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A) {
    +++ description: None
      receivedPermissions.0.target:
-        "0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
      receivedPermissions.0.from:
+        "0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
      directlyReceivedPermissions.0.target:
-        "0xc6901F65369FC59fC1B4D6D6bE7A2318Ff38dB5B"
      directlyReceivedPermissions.0.from:
+        "0xc6901F65369FC59fC1B4D6D6bE7A2318Ff38dB5B"
    }
```

```diff
    contract OptimismPortal (0xbEb5Fc579115071764c7423A4f12eDde41f106Ed) {
    +++ description: The OptimismPortal contract is the main entry point to deposit funds from L1 to L2. It also allows to prove and finalize withdrawals. It specifies which game type can be used for withdrawals, which currently is the FaultDisputeGame.
      issuedPermissions.0.target:
-        "0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A"
    }
```

```diff
    contract SecurityCouncilMultisig (0xc2819DC788505Aac350142A7A707BF9D03E3Bd03) {
    +++ description: None
      receivedPermissions.0.target:
-        "0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
      receivedPermissions.0.from:
+        "0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
    }
```

```diff
    contract DeputyGuardianModule (0xc6901F65369FC59fC1B4D6D6bE7A2318Ff38dB5B) {
    +++ description: allows the 0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A, called the deputy guardian, to act on behalf of the Gnosis Safe.
      directlyReceivedPermissions.0.target:
-        "0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2"
      directlyReceivedPermissions.0.from:
+        "0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2"
    }
```

```diff
    contract AddressManager (0xdE1FCfB0851916CA5101820A69b13a4E276bd81F) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      issuedPermissions.0.target:
-        "0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.via.0.description:
-        "set and change address mappings."
      issuedPermissions.0.to:
+        "0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A"
      issuedPermissions.0.description:
+        "set and change address mappings."
    }
```

```diff
    contract DisputeGameFactory (0xe5965Ab5962eDc7477C8520243A95517CD252fA9) {
    +++ description: The dispute game factory allows the creation of dispute games, used to propose state roots and eventually challenge them.
      issuedPermissions.0.target:
-        "0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A"
    }
```

Generated with discovered.json: 0x0e4714a7acf50240fab2a665cce85031a2c9189c

# Diff at Thu, 16 Jan 2025 10:14:45 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@3513cb068688b9fa7f9ddd40447f5f70d088c2cf block: 21628485
- current block number: 21628485

## Description

Add decoding of absolute prestate hashes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21628485 (main branch discovery), not current.

```diff
    contract FaultDisputeGame (0x27B81db41F586016694632193b99E45b1a27B8f8) {
    +++ description: Logic of the dispute game. When a state root is proposed, a dispute game contract is deployed. Challengers can use such contracts to challenge the proposed state root.
+++ description: Prestate tag for known prestates.
      values.absolutePrestateDecoded:
+        "v1.4.0 (govApproved)"
      fieldMeta:
+        {"absolutePrestateDecoded":{"description":"Prestate tag for known prestates."}}
      usedTypes:
+        [{"typeCaster":"Mapping","arg":{"0x0386cde2f2b1bde1189ac9c9b7d66774e6260eca778223def326bfe680c14ab9":"v1.4.1-rc.2 (cannon64)","0x03045fd433fb5391c40751939d7cb5e9dfe83cf156f9395566a311e7fe9d3aa2":"v1.4.1-rc.2","0x03b7eaa4e3cbce90381921a4b48008f4769871d64f93d113fcadca08ecee503b":"v1.4.0 (cannon64)","0x03f89406817db1ed7fd8b31e13300444652cdb0b9c509a674de43483b2f83568":"v1.4.0 (govApproved)","0x0348ce2059f718af75729c2c56860551b46b665956a641b3cb2cd51e50b7b725":"v1.4.0-rc.2 (cannon64)","0x0364e4e72922e7d649338f558f8a14b50ca31922a1484e73ea03987fb1516095":"v1.4.0-rc.2","0x032e5d6119ee983cb87deae3eef16ea6086f2347433c99f1820d60f36a24a6e6":"v1.4.0-rc.1 (cannon64)","0x03925193e3e89f87835bbdf3a813f60b2aa818a36bbe71cd5d8fd7e79f5e8afe":"v1.4.0-rc.1","0x03c50b9fd04bdadc228205f340767bbf2d01a030aec39903120d3559d94bb8cc":"v1.3.1-ink","0x038512e02c4c3f7bdaec27d00edf55b7155e0905301e1a88083e4e0a6764d54c":"v1.3.1 (govApproved)","0x03e806a2859a875267a563462a06d4d1d1b455a9efee959a46e21e54b6caf69a":"v1.3.1-rc.1","0x030de10d9da911a2b180ecfae2aeaba8758961fc28262ce989458c6f9a547922":"v1.3.0-rc.3","0x0385c3f8ee78491001d92b90b07d0cf387b7b52ab9b83b4d87c994e92cf823ba":"v1.3.0-rc.2","0x0367c4aa897bffbded0b523f277ca892298dc3c691baf37bc2099b86024f9673":"v1.3.0-rc.1","0x03617abec0b255dc7fc7a0513a2c2220140a1dcd7a1c8eca567659bd67e05cea":"v1.2.0 (govApproved)","0x03e69d3de5155f4a80da99dd534561cbddd4f9dd56c9ecc704d6886625711d2b":"v1.1.0","0x0398bdd93e2e9313befdf82beb709da6a4daf35ce1abb42d8a998ec9bc1c572e":"v1.0.1","0x037ef3c1a487960b0e633d3e513df020c43432769f41a634d18a9595cbf53c55":"v1.0.0 (govApproved)","0x034c8cc69f22c35ae386a97136715dd48aaf97fd190942a111bfa680c2f2f421":"v0.3.0","0x031e3b504740d0b1264e8cf72b6dde0d497184cfb3f98e451c6be8b33bd3f808":"v0.2.0","0x038942ec840131a63c49fa514a3f0577ae401fd5584d56ad50cdf5a8b41d4538":"v0.1.0","0x03babef4b4c6d866d56e6356d961839fd9475931d11e0ea507420a87b0cadbdd":"v0.0.1"}}]
    }
```

```diff
    contract PermissionedDisputeGame (0x91a661891248d8C4916FB4a1508492a5e2CBcb87) {
    +++ description: Same as FaultDisputeGame, but only two permissioned addresses are designated as proposer and challenger.
+++ description: Prestate tag for known prestates.
      values.absolutePrestateDecoded:
+        "v1.4.0 (govApproved)"
      fieldMeta:
+        {"absolutePrestateDecoded":{"description":"Prestate tag for known prestates."}}
      usedTypes:
+        [{"typeCaster":"Mapping","arg":{"0x0386cde2f2b1bde1189ac9c9b7d66774e6260eca778223def326bfe680c14ab9":"v1.4.1-rc.2 (cannon64)","0x03045fd433fb5391c40751939d7cb5e9dfe83cf156f9395566a311e7fe9d3aa2":"v1.4.1-rc.2","0x03b7eaa4e3cbce90381921a4b48008f4769871d64f93d113fcadca08ecee503b":"v1.4.0 (cannon64)","0x03f89406817db1ed7fd8b31e13300444652cdb0b9c509a674de43483b2f83568":"v1.4.0 (govApproved)","0x0348ce2059f718af75729c2c56860551b46b665956a641b3cb2cd51e50b7b725":"v1.4.0-rc.2 (cannon64)","0x0364e4e72922e7d649338f558f8a14b50ca31922a1484e73ea03987fb1516095":"v1.4.0-rc.2","0x032e5d6119ee983cb87deae3eef16ea6086f2347433c99f1820d60f36a24a6e6":"v1.4.0-rc.1 (cannon64)","0x03925193e3e89f87835bbdf3a813f60b2aa818a36bbe71cd5d8fd7e79f5e8afe":"v1.4.0-rc.1","0x03c50b9fd04bdadc228205f340767bbf2d01a030aec39903120d3559d94bb8cc":"v1.3.1-ink","0x038512e02c4c3f7bdaec27d00edf55b7155e0905301e1a88083e4e0a6764d54c":"v1.3.1 (govApproved)","0x03e806a2859a875267a563462a06d4d1d1b455a9efee959a46e21e54b6caf69a":"v1.3.1-rc.1","0x030de10d9da911a2b180ecfae2aeaba8758961fc28262ce989458c6f9a547922":"v1.3.0-rc.3","0x0385c3f8ee78491001d92b90b07d0cf387b7b52ab9b83b4d87c994e92cf823ba":"v1.3.0-rc.2","0x0367c4aa897bffbded0b523f277ca892298dc3c691baf37bc2099b86024f9673":"v1.3.0-rc.1","0x03617abec0b255dc7fc7a0513a2c2220140a1dcd7a1c8eca567659bd67e05cea":"v1.2.0 (govApproved)","0x03e69d3de5155f4a80da99dd534561cbddd4f9dd56c9ecc704d6886625711d2b":"v1.1.0","0x0398bdd93e2e9313befdf82beb709da6a4daf35ce1abb42d8a998ec9bc1c572e":"v1.0.1","0x037ef3c1a487960b0e633d3e513df020c43432769f41a634d18a9595cbf53c55":"v1.0.0 (govApproved)","0x034c8cc69f22c35ae386a97136715dd48aaf97fd190942a111bfa680c2f2f421":"v0.3.0","0x031e3b504740d0b1264e8cf72b6dde0d497184cfb3f98e451c6be8b33bd3f808":"v0.2.0","0x038942ec840131a63c49fa514a3f0577ae401fd5584d56ad50cdf5a8b41d4538":"v0.1.0","0x03babef4b4c6d866d56e6356d961839fd9475931d11e0ea507420a87b0cadbdd":"v0.0.1"}}]
    }
```

Generated with discovered.json: 0x739f5bcf6fd7385b048391104c685042326f2e9c

# Diff at Wed, 15 Jan 2025 07:52:54 GMT:

- chain: optimism
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@3ea176aee1470e5ec80e65adfc81a954f84584d8 block: 122593187
- current block number: 130664390

## Description

Config related: displayName.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 122593187 (main branch discovery), not current.

```diff
    contract L2ProxyAdmin (0x4200000000000000000000000000000000000018) {
    +++ description: None
      displayName:
+        "ProxyAdmin"
    }
```

Generated with discovered.json: 0xc964739c822a328a8e1581b3f1305336221145a1

# Diff at Wed, 15 Jan 2025 07:47:49 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@3ea176aee1470e5ec80e65adfc81a954f84584d8 block: 21585110
- current block number: 21628485

## Description

Config related: displayName.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21585110 (main branch discovery), not current.

```diff
    contract SuperchainProxyAdmin (0x543bA4AADBAb8f9025686Bd03993043599c6fB04) {
    +++ description: None
      displayName:
+        "ProxyAdmin"
    }
```

Generated with discovered.json: 0x55b5ac839416bd5081d30634287a40e8c875684f

# Diff at Thu, 09 Jan 2025 06:23:35 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@edc6acaed84d40aabd5185e0a0b5ebaf1c90143b block: 21346059
- current block number: 21585110

## Description

New MIPS, PermissionedDisputeGame, FaultDisputeGame and DelayedWETH contracts.

- interop: add `hashL2toL2CrossDomainMessage()` and `_dependencySet` (in 'encoding' and 'hashing' libraries)
- formatting and doc changes
- removal of interfaces (IDisputeGame, IFaultDisputeGame)
- no changes in DelayedWETH

### MIPS

Refactor: [64bit architecture and multithreading support](https://github.com/ethereum-optimism/docs/issues/1066).

## Watched changes

```diff
-   Status: DELETED
    contract PermissionedDisputeGame (0x050ed6F6273c7D836a111E42153BC00D0380b87d)
    +++ description: Same as FaultDisputeGame, but only two permissioned addresses are designated as proposer and challenger.
```

```diff
-   Status: DELETED
    contract MIPS (0x16e83cE5Ce29BF90AD9Da06D2fE6a15d5f344ce4)
    +++ description: The MIPS contract is used to execute the final step of the dispute game which objectively determines the winner of the dispute.
```

```diff
    contract SuperchainProxyAdmin (0x543bA4AADBAb8f9025686Bd03993043599c6fB04) {
    +++ description: None
      directlyReceivedPermissions.8.target:
-        "0x9F9b897e37de5052cD70Db6D08474550DDb07f39"
+        "0x99C9fc46f92E8a1c0deC1b1747d010903E884bE1"
      directlyReceivedPermissions.8.description:
+        "upgrading the bridge implementation can give access to all funds escrowed therein."
      directlyReceivedPermissions.7.target:
-        "0x99C9fc46f92E8a1c0deC1b1747d010903E884bE1"
+        "0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
      directlyReceivedPermissions.7.description:
-        "upgrading the bridge implementation can give access to all funds escrowed therein."
      directlyReceivedPermissions.6.target:
-        "0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
+        "0x75505a97BD334E7BD3C476893285569C4136Fa0F"
      directlyReceivedPermissions.5.target:
-        "0x82511d494B5C942BE57498a70Fdd7184Ee33B975"
+        "0x5a7749f83b81B301cAb5f48EB8516B986DAef23D"
      directlyReceivedPermissions.4.target:
-        "0x75505a97BD334E7BD3C476893285569C4136Fa0F"
+        "0x323dFC63c9B83CB83f40325AaB74b245937cbdF0"
      directlyReceivedPermissions.3.target:
-        "0x5a7749f83b81B301cAb5f48EB8516B986DAef23D"
+        "0x229047fed2591dbec1eF1118d64F7aF3dB9EB290"
      directlyReceivedPermissions.2.target:
-        "0x229047fed2591dbec1eF1118d64F7aF3dB9EB290"
+        "0x21429aF66058BC3e4aE4a8f2EC4531AaC433ecbC"
    }
```

```diff
    contract SuperchainProxyAdminOwner (0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A) {
    +++ description: None
      receivedPermissions.8.target:
-        "0x9F9b897e37de5052cD70Db6D08474550DDb07f39"
+        "0x99C9fc46f92E8a1c0deC1b1747d010903E884bE1"
      receivedPermissions.8.description:
+        "upgrading the bridge implementation can give access to all funds escrowed therein."
      receivedPermissions.7.target:
-        "0x99C9fc46f92E8a1c0deC1b1747d010903E884bE1"
+        "0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
      receivedPermissions.7.description:
-        "upgrading the bridge implementation can give access to all funds escrowed therein."
      receivedPermissions.6.target:
-        "0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
+        "0x75505a97BD334E7BD3C476893285569C4136Fa0F"
      receivedPermissions.5.target:
-        "0x82511d494B5C942BE57498a70Fdd7184Ee33B975"
+        "0x5a7749f83b81B301cAb5f48EB8516B986DAef23D"
      receivedPermissions.4.target:
-        "0x75505a97BD334E7BD3C476893285569C4136Fa0F"
+        "0x323dFC63c9B83CB83f40325AaB74b245937cbdF0"
      receivedPermissions.3.target:
-        "0x5a7749f83b81B301cAb5f48EB8516B986DAef23D"
+        "0x229047fed2591dbec1eF1118d64F7aF3dB9EB290"
      receivedPermissions.2.target:
-        "0x229047fed2591dbec1eF1118d64F7aF3dB9EB290"
+        "0x21429aF66058BC3e4aE4a8f2EC4531AaC433ecbC"
    }
```

```diff
-   Status: DELETED
    contract DelayedWETH (0x82511d494B5C942BE57498a70Fdd7184Ee33B975)
    +++ description: Contract designed to hold the bonded ETH for each game. It is designed as a wrapper around WETH to allow an owner to function as a backstop if a game would incorrectly distribute funds.
```

```diff
-   Status: DELETED
    contract DelayedWETH (0x9F9b897e37de5052cD70Db6D08474550DDb07f39)
    +++ description: Contract designed to hold the bonded ETH for each game. It is designed as a wrapper around WETH to allow an owner to function as a backstop if a game would incorrectly distribute funds.
```

```diff
-   Status: DELETED
    contract FaultDisputeGame (0xA6f3DFdbf4855a43c529bc42EDE96797252879af)
    +++ description: Logic of the dispute game. When a state root is proposed, a dispute game contract is deployed. Challengers can use such contracts to challenge the proposed state root.
```

```diff
    contract DisputeGameFactory (0xe5965Ab5962eDc7477C8520243A95517CD252fA9) {
    +++ description: The dispute game factory allows the creation of dispute games, used to propose state roots and eventually challenge them.
      values.gameImpls.1:
-        "0x050ed6F6273c7D836a111E42153BC00D0380b87d"
+        "0x91a661891248d8C4916FB4a1508492a5e2CBcb87"
      values.gameImpls.0:
-        "0xA6f3DFdbf4855a43c529bc42EDE96797252879af"
+        "0x27B81db41F586016694632193b99E45b1a27B8f8"
    }
```

```diff
+   Status: CREATED
    contract DelayedWETH_PermissionedGames (0x21429aF66058BC3e4aE4a8f2EC4531AaC433ecbC)
    +++ description: Contract designed to hold the bonded ETH for each game. It is designed as a wrapper around WETH to allow an owner to function as a backstop if a game would incorrectly distribute funds.
```

```diff
+   Status: CREATED
    contract FaultDisputeGame (0x27B81db41F586016694632193b99E45b1a27B8f8)
    +++ description: Logic of the dispute game. When a state root is proposed, a dispute game contract is deployed. Challengers can use such contracts to challenge the proposed state root.
```

```diff
+   Status: CREATED
    contract DelayedWETH_PermissionlessGames (0x323dFC63c9B83CB83f40325AaB74b245937cbdF0)
    +++ description: Contract designed to hold the bonded ETH for each game. It is designed as a wrapper around WETH to allow an owner to function as a backstop if a game would incorrectly distribute funds.
```

```diff
+   Status: CREATED
    contract MIPS (0x5fE03a12C1236F9C22Cb6479778DDAa4bce6299C)
    +++ description: The MIPS contract is used to execute the final step of the dispute game which objectively determines the winner of the dispute.
```

```diff
+   Status: CREATED
    contract PermissionedDisputeGame (0x91a661891248d8C4916FB4a1508492a5e2CBcb87)
    +++ description: Same as FaultDisputeGame, but only two permissioned addresses are designated as proposer and challenger.
```

## Source code changes

```diff
.../DelayedWETH_PermissionedGames}/DelayedWETH.sol |   0
 .../DelayedWETH_PermissionedGames}/Proxy.p.sol     |   0
 .../DelayedWETH.sol                                |   0
 .../DelayedWETH_PermissionlessGames}/Proxy.p.sol   |   0
 .../{.flat@21346059 => .flat}/FaultDisputeGame.sol | 386 ++++++++----------
 .../ethereum/{.flat@21346059 => .flat}/MIPS.sol    | 444 +++++++++++++++------
 .../PermissionedDisputeGame.sol                    | 408 +++++++++----------
 7 files changed, 681 insertions(+), 557 deletions(-)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21346059 (main branch discovery), not current.

```diff
    contract DelayedWETH (0x82511d494B5C942BE57498a70Fdd7184Ee33B975) {
    +++ description: Contract designed to hold the bonded ETH for each game. It is designed as a wrapper around WETH to allow an owner to function as a backstop if a game would incorrectly distribute funds.
      name:
-        "DelayedWETH_PermissionlessGames"
+        "DelayedWETH"
      displayName:
-        "DelayedWETH"
    }
```

```diff
    contract DelayedWETH (0x9F9b897e37de5052cD70Db6D08474550DDb07f39) {
    +++ description: Contract designed to hold the bonded ETH for each game. It is designed as a wrapper around WETH to allow an owner to function as a backstop if a game would incorrectly distribute funds.
      name:
-        "DelayedWETH_PermissionedGames"
+        "DelayedWETH"
      displayName:
-        "DelayedWETH"
    }
```

Generated with discovered.json: 0xb4955f0f7566471bb9cf8338790547d588590716

# Diff at Wed, 08 Jan 2025 09:04:37 GMT:

- chain: ethereum
- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@deefa974378c2cd6b74f061e1f5a494bbbe1d63a block: 21346059
- current block number: 21346059

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21346059 (main branch discovery), not current.

```diff
    contract L1StandardBridge (0x99C9fc46f92E8a1c0deC1b1747d010903E884bE1) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      description:
-        "The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token."
+        "The main entry point to deposit ERC20 tokens from host chain to this chain."
    }
```

Generated with discovered.json: 0x9074daf74e21587a6df98b6fa92ce587120f152f

# Diff at Sat, 21 Dec 2024 17:14:44 GMT:

- chain: ethereum
- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@873a66d1ca14f5f7fb72cefd59af61bb4df31351 block: 21346059
- current block number: 21346059

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21346059 (main branch discovery), not current.

```diff
    contract SystemConfig (0x229047fed2591dbec1eF1118d64F7aF3dB9EB290) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      issuedPermissions.2:
+        {"permission":"upgrade","target":"0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A","via":[{"address":"0x543bA4AADBAb8f9025686Bd03993043599c6fB04","delay":0}]}
      issuedPermissions.1:
+        {"permission":"sequence","target":"0x6887246668a3b87F54DeB3b94Ba47a6f63F32985","via":[]}
      issuedPermissions.0.permission:
-        "upgrade"
+        "configure"
      issuedPermissions.0.target:
-        "0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A"
+        "0x847B5c174615B1B7fDF770882256e2D3E95b9D92"
      issuedPermissions.0.via.0:
-        {"address":"0x543bA4AADBAb8f9025686Bd03993043599c6fB04","delay":0}
      template:
+        "opstack/SystemConfig"
      description:
+        "Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address."
    }
```

```diff
    contract OpFoundationUpgradeSafe (0x847B5c174615B1B7fDF770882256e2D3E95b9D92) {
    +++ description: None
      receivedPermissions:
+        [{"permission":"configure","target":"0x229047fed2591dbec1eF1118d64F7aF3dB9EB290","description":"it can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system."}]
    }
```

Generated with discovered.json: 0xbe6d1bd6cdf06c3266e47df316adae1127543239

# Diff at Fri, 06 Dec 2024 21:11:41 GMT:

- chain: ethereum
- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@59fd7a30471906b5a479f280731621e94e22f17c block: 21235656
- current block number: 21346059

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21235656 (main branch discovery), not current.

```diff
    contract SecurityCouncilMultisig (0xc2819DC788505Aac350142A7A707BF9D03E3Bd03) {
    +++ description: None
      values.isL2beatStillAnOwner:
+        true
    }
```

Generated with discovered.json: 0x6074bd9f8045463b77dc64eb7ce10714e5f3774e

# Diff at Tue, 19 Nov 2024 13:44:31 GMT:

- chain: ethereum
- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@4c4fda2e697ffddc3e55c5773edb75671d0818a1 block: 21092690
- current block number: 21222156

## Description

Multisig renamings.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21092690 (main branch discovery), not current.

```diff
    contract OpFoundationUpgradeSafe (0x847B5c174615B1B7fDF770882256e2D3E95b9D92) {
    +++ description: None
      name:
-        "OptimismFoundationMultisig_1"
+        "OpFoundationUpgradeSafe"
    }
```

```diff
    contract OpFoundationOperationsSafe (0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A) {
    +++ description: None
      name:
-        "FoundationMultisig_2"
+        "OpFoundationOperationsSafe"
    }
```

Generated with discovered.json: 0x32b53920d26d2a0f4039d0b0715e94e76053591d

# Diff at Fri, 01 Nov 2024 12:23:43 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@cd1f0e71bb08ce16b2084a11b768538e8aa6ba8c block: 21085481
- current block number: 21092690

## Description

Config related (shape template change).

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21085481 (main branch discovery), not current.

```diff
    contract SuperchainProxyAdmin (0x543bA4AADBAb8f9025686Bd03993043599c6fB04) {
    +++ description: None
      directlyReceivedPermissions.7.description:
-        "upgrading bridge implementation allows to access all funds and change every system component."
+        "upgrading the bridge implementation can give access to all funds escrowed therein."
    }
```

```diff
    contract SuperchainProxyAdminOwner (0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A) {
    +++ description: None
      receivedPermissions.7.description:
-        "upgrading bridge implementation allows to access all funds and change every system component."
+        "upgrading the bridge implementation can give access to all funds escrowed therein."
    }
```

```diff
    contract OptimismFoundationMultisig_1 (0x847B5c174615B1B7fDF770882256e2D3E95b9D92) {
    +++ description: None
      name:
-        "FoundationMultisig_1"
+        "OptimismFoundationMultisig_1"
    }
```

```diff
    contract L1StandardBridge (0x99C9fc46f92E8a1c0deC1b1747d010903E884bE1) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token.
      issuedPermissions.0.via.0.description:
-        "upgrading bridge implementation allows to access all funds and change every system component."
+        "upgrading the bridge implementation can give access to all funds escrowed therein."
    }
```

```diff
    contract OptimismPortal (0xbEb5Fc579115071764c7423A4f12eDde41f106Ed) {
    +++ description: The OptimismPortal contract is the main entry point to deposit funds from L1 to L2. It also allows to prove and finalize withdrawals. It specifies which game type can be used for withdrawals, which currently is the FaultDisputeGame.
      description:
-        "The OptimismPortal contract is the main entry point to deposit funds from L1 to L2. It also allows to prove and finalize withdrawals. It specifies which game type can be used for withdrawals."
+        "The OptimismPortal contract is the main entry point to deposit funds from L1 to L2. It also allows to prove and finalize withdrawals. It specifies which game type can be used for withdrawals, which currently is the FaultDisputeGame."
      values.RespectedGameString:
+        "FaultDisputeGame"
      usedTypes:
+        [{"typeCaster":"Mapping","arg":{"0":"FaultDisputeGame","1":"PermissionedDisputeGame"}}]
    }
```

Generated with discovered.json: 0x8387a3e97d24d35e28910cdd6e5f7b3fd390375b

# Diff at Thu, 31 Oct 2024 12:01:33 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@f409157dbd8c6fad51290f20e7bd5692f0556969 block: 21027355
- current block number: 21085481

## Description

Config related (dispute game shapes).

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21027355 (main branch discovery), not current.

```diff
    contract PermissionedDisputeGame (0x050ed6F6273c7D836a111E42153BC00D0380b87d) {
    +++ description: Same as FaultDisputeGame, but only two permissioned addresses are designated as proposer and challenger.
      template:
+        "opstack/PermissionedDisputeGame"
      description:
+        "Same as FaultDisputeGame, but only two permissioned addresses are designated as proposer and challenger."
    }
```

```diff
    contract PreimageOracle (0x9c065e11870B891D214Bc2Da7EF1f9DDFA1BE277) {
    +++ description: The PreimageOracle contract is used to load the required data from L1 for a dispute game.
      template:
+        "opstack/PreimageOracle"
      description:
+        "The PreimageOracle contract is used to load the required data from L1 for a dispute game."
    }
```

```diff
    contract FaultDisputeGame (0xA6f3DFdbf4855a43c529bc42EDE96797252879af) {
    +++ description: Logic of the dispute game. When a state root is proposed, a dispute game contract is deployed. Challengers can use such contracts to challenge the proposed state root.
      template:
+        "opstack/FaultDisputeGame"
      description:
+        "Logic of the dispute game. When a state root is proposed, a dispute game contract is deployed. Challengers can use such contracts to challenge the proposed state root."
    }
```

```diff
    contract OptimismPortal (0xbEb5Fc579115071764c7423A4f12eDde41f106Ed) {
    +++ description: The OptimismPortal contract is the main entry point to deposit funds from L1 to L2. It also allows to prove and finalize withdrawals. It specifies which game type can be used for withdrawals.
      template:
+        "opstack/OptimismPortal2"
      description:
+        "The OptimismPortal contract is the main entry point to deposit funds from L1 to L2. It also allows to prove and finalize withdrawals. It specifies which game type can be used for withdrawals."
    }
```

Generated with discovered.json: 0x9eb2d05d3472d7651e9c0dd368e51ead6e18c373

# Diff at Wed, 23 Oct 2024 09:21:39 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@2734bfe28641dfdb3277a5800faf0a057c08a58f block: 20948093
- current block number: 21027355

## Description

Gas limit doubled to 60M.

## Watched changes

```diff
    contract SystemConfig (0x229047fed2591dbec1eF1118d64F7aF3dB9EB290) {
    +++ description: None
+++ description: Gas limit for blocks on L2.
+++ severity: LOW
      values.gasLimit:
-        30000000
+        60000000
    }
```

Generated with discovered.json: 0x43f1b811871a06a7c23f2a51e441f250da0fa1db

# Diff at Mon, 21 Oct 2024 12:46:47 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@e660599f23a07618fe949a07be1f516ce44f1914 block: 20948093
- current block number: 20948093

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20948093 (main branch discovery), not current.

```diff
    contract LivenessModule (0x0454092516c9A4d636d3CAfA1e82161376C8a748) {
    +++ description: used to remove members inactive for 98d while making sure that the threshold remains above 75%. If the number of members falls below 8, the 0x847B5c174615B1B7fDF770882256e2D3E95b9D92 takes ownership of the multisig
      descriptions:
-        ["used to remove members inactive for 98d while making sure that the threshold remains above 75%. If the number of members falls below 8, the 0x847B5c174615B1B7fDF770882256e2D3E95b9D92 takes ownership of the multisig"]
      description:
+        "used to remove members inactive for 98d while making sure that the threshold remains above 75%. If the number of members falls below 8, the 0x847B5c174615B1B7fDF770882256e2D3E95b9D92 takes ownership of the multisig"
    }
```

```diff
    contract MIPS (0x16e83cE5Ce29BF90AD9Da06D2fE6a15d5f344ce4) {
    +++ description: The MIPS contract is used to execute the final step of the dispute game which objectively determines the winner of the dispute.
      descriptions:
-        ["The MIPS contract is used to execute the final step of the dispute game which objectively determines the winner of the dispute."]
      description:
+        "The MIPS contract is used to execute the final step of the dispute game which objectively determines the winner of the dispute."
    }
```

```diff
    contract AnchorStateRegistry (0x18DAc71c228D1C32c99489B7323d441E1175e443) {
    +++ description: Contains the latest confirmed state root that can be used as a starting point in a dispute game.
      descriptions:
-        ["Contains the latest confirmed state root that can be used as a starting point in a dispute game."]
      description:
+        "Contains the latest confirmed state root that can be used as a starting point in a dispute game."
    }
```

```diff
    contract L1CrossDomainMessenger (0x25ace71c97B33Cc4729CF772ae268934F7ab5fA1) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      descriptions:
-        ["Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function."]
      description:
+        "Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function."
    }
```

```diff
    contract L1ERC721Bridge (0x5a7749f83b81B301cAb5f48EB8516B986DAef23D) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      descriptions:
-        ["Used to bridge ERC-721 tokens from host chain to this chain."]
      description:
+        "Used to bridge ERC-721 tokens from host chain to this chain."
    }
```

```diff
    contract OptimismMintableERC20Factory (0x75505a97BD334E7BD3C476893285569C4136Fa0F) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      descriptions:
-        ["A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa."]
      description:
+        "A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa."
    }
```

```diff
    contract wstETHEscrow (0x76943C0D61395d8F2edF9060e1533529cAe05dE6) {
    +++ description: Lido custom escrow for wstETH tokens that uses the canonical bridge for messaging but is governed externally.
      descriptions:
-        ["Lido custom escrow for wstETH tokens that uses the canonical bridge for messaging but is governed externally."]
      description:
+        "Lido custom escrow for wstETH tokens that uses the canonical bridge for messaging but is governed externally."
    }
```

```diff
    contract DelayedWETH_PermissionlessGames (0x82511d494B5C942BE57498a70Fdd7184Ee33B975) {
    +++ description: Contract designed to hold the bonded ETH for each game. It is designed as a wrapper around WETH to allow an owner to function as a backstop if a game would incorrectly distribute funds.
      descriptions:
-        ["Contract designed to hold the bonded ETH for each game. It is designed as a wrapper around WETH to allow an owner to function as a backstop if a game would incorrectly distribute funds."]
      description:
+        "Contract designed to hold the bonded ETH for each game. It is designed as a wrapper around WETH to allow an owner to function as a backstop if a game would incorrectly distribute funds."
    }
```

```diff
    contract SuperchainConfig (0x95703e0982140D16f8ebA6d158FccEde42f04a4C) {
    +++ description: Used to manage global configuration values for multiple OP Chains within a single Superchain network. The SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the Superchain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      descriptions:
-        ["Used to manage global configuration values for multiple OP Chains within a single Superchain network. The SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the Superchain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system."]
      description:
+        "Used to manage global configuration values for multiple OP Chains within a single Superchain network. The SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the Superchain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system."
    }
```

```diff
    contract L1StandardBridge (0x99C9fc46f92E8a1c0deC1b1747d010903E884bE1) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token.
      descriptions:
-        ["The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token."]
      description:
+        "The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token."
    }
```

```diff
    contract DelayedWETH_PermissionedGames (0x9F9b897e37de5052cD70Db6D08474550DDb07f39) {
    +++ description: Contract designed to hold the bonded ETH for each game. It is designed as a wrapper around WETH to allow an owner to function as a backstop if a game would incorrectly distribute funds.
      descriptions:
-        ["Contract designed to hold the bonded ETH for each game. It is designed as a wrapper around WETH to allow an owner to function as a backstop if a game would incorrectly distribute funds."]
      description:
+        "Contract designed to hold the bonded ETH for each game. It is designed as a wrapper around WETH to allow an owner to function as a backstop if a game would incorrectly distribute funds."
    }
```

```diff
    contract DeputyGuardianModule (0xc6901F65369FC59fC1B4D6D6bE7A2318Ff38dB5B) {
    +++ description: allows the 0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A, called the deputy guardian, to act on behalf of the Gnosis Safe.
      descriptions:
-        ["allows the 0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A, called the deputy guardian, to act on behalf of the Gnosis Safe."]
      description:
+        "allows the 0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A, called the deputy guardian, to act on behalf of the Gnosis Safe."
    }
```

```diff
    contract AddressManager (0xdE1FCfB0851916CA5101820A69b13a4E276bd81F) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      descriptions:
-        ["Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts."]
      description:
+        "Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts."
    }
```

```diff
    contract DisputeGameFactory (0xe5965Ab5962eDc7477C8520243A95517CD252fA9) {
    +++ description: The dispute game factory allows the creation of dispute games, used to propose state roots and eventually challenge them.
      descriptions:
-        ["The dispute game factory allows the creation of dispute games, used to propose state roots and eventually challenge them."]
      description:
+        "The dispute game factory allows the creation of dispute games, used to propose state roots and eventually challenge them."
    }
```

Generated with discovered.json: 0xebfa1d5ba77fb39d275f5e59944a2143e86b16b6

# Diff at Mon, 21 Oct 2024 11:14:25 GMT:

- chain: optimism
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@8895d33866f5665c4c710f4ddaa32bfa63cc3c78 block: 122593187
- current block number: 122593187

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 122593187 (main branch discovery), not current.

```diff
    contract GasPriceOracle (0x420000000000000000000000000000000000000F) {
    +++ description: None
      values.$pastUpgrades.1.2:
+        ["0xa919894851548179A0750865e7974DA599C0Fac7"]
      values.$pastUpgrades.1.1:
-        ["0xa919894851548179A0750865e7974DA599C0Fac7"]
+        "0x2f63bbe08a66796dde569281a58a53e0b0f64b7aa067297e9c70455fb8e375bc"
      values.$pastUpgrades.0.2:
+        ["0xb528D11cC114E026F138fE568744c6D45ce6Da7A"]
      values.$pastUpgrades.0.1:
-        ["0xb528D11cC114E026F138fE568744c6D45ce6Da7A"]
+        "0xedbfdad1f44ea830b863eac45eca4408398351b30511826012882059625963d2"
    }
```

```diff
    contract L2ERC721Bridge (0x4200000000000000000000000000000000000014) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0x5a7749f83b81B301cAb5f48EB8516B986DAef23D"]
      values.$pastUpgrades.0.1:
-        ["0x5a7749f83b81B301cAb5f48EB8516B986DAef23D"]
+        "0x02985bade8b066202067f455d11aa0996a23c022fcd923e113af5d9997ddb5ce"
    }
```

```diff
    contract L1Block (0x4200000000000000000000000000000000000015) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0x07dbe8500fc591d1852B76feE44d5a05e13097Ff"]
      values.$pastUpgrades.0.1:
-        ["0x07dbe8500fc591d1852B76feE44d5a05e13097Ff"]
+        "0x9f2b2d34dfa2cb55cceb9860cade0cb03cfbd7ff1dd07d48b4708b29a46b4a24"
    }
```

```diff
    contract SchemaRegistry (0x4200000000000000000000000000000000000020) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0x6232208d66bAc2305b46b4Cb6BCB3857B298DF13"]
      values.$pastUpgrades.0.1:
-        ["0x6232208d66bAc2305b46b4Cb6BCB3857B298DF13"]
+        "0xe09a2d85965656572055111f1968491e9bb6b174bfaa5b3e38dbbb82ef94e6fb"
    }
```

```diff
    contract EAS (0x4200000000000000000000000000000000000021) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0x4E0275Ea5a89e7a3c1B58411379D1a0eDdc5b088"]
      values.$pastUpgrades.0.1:
-        ["0x4E0275Ea5a89e7a3c1B58411379D1a0eDdc5b088"]
+        "0xe09a2d85965656572055111f1968491e9bb6b174bfaa5b3e38dbbb82ef94e6fb"
    }
```

Generated with discovered.json: 0x8f30c613bf975159a852710a7d29fe563c1b8b00

# Diff at Mon, 21 Oct 2024 11:08:31 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@8895d33866f5665c4c710f4ddaa32bfa63cc3c78 block: 20948093
- current block number: 20948093

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20948093 (main branch discovery), not current.

```diff
    contract AnchorStateRegistry (0x18DAc71c228D1C32c99489B7323d441E1175e443) {
    +++ description: Contains the latest confirmed state root that can be used as a starting point in a dispute game.
      values.$pastUpgrades.2.2:
+        ["0x1B5CC028A4276597C607907F24E1AC05d3852cFC"]
      values.$pastUpgrades.2.1:
-        ["0x1B5CC028A4276597C607907F24E1AC05d3852cFC"]
+        "0x3bd2d811d0298313e6fb75f0e69fb54280c9b4f2e60f8f04472aaa166c285641"
      values.$pastUpgrades.1.2:
+        ["0xd81f43eDBCAcb4c29a9bA38a13Ee5d79278270cC"]
      values.$pastUpgrades.1.1:
-        ["0xd81f43eDBCAcb4c29a9bA38a13Ee5d79278270cC"]
+        "0x3bd2d811d0298313e6fb75f0e69fb54280c9b4f2e60f8f04472aaa166c285641"
      values.$pastUpgrades.0.2:
+        ["0x6B7da1647Aa9684F54B2BEeB699F91F31cd35Fb9"]
      values.$pastUpgrades.0.1:
-        ["0x6B7da1647Aa9684F54B2BEeB699F91F31cd35Fb9"]
+        "0xa3a31ec801f08783b49b1e45953090616e7cadd3b85950983823c49a428665ac"
    }
```

```diff
    contract SystemConfig (0x229047fed2591dbec1eF1118d64F7aF3dB9EB290) {
    +++ description: None
      values.$pastUpgrades.6.2:
+        ["0xF56D96B2535B932656d3c04Ebf51baBff241D886"]
      values.$pastUpgrades.6.1:
-        ["0xF56D96B2535B932656d3c04Ebf51baBff241D886"]
+        "0xbe810ed6e1e827930bd46cde42c4883662ddb6d244a26af2f0409cc2782bee61"
      values.$pastUpgrades.5.2:
+        ["0xd81f43eDBCAcb4c29a9bA38a13Ee5d79278270cC"]
      values.$pastUpgrades.5.1:
-        ["0xd81f43eDBCAcb4c29a9bA38a13Ee5d79278270cC"]
+        "0xbe810ed6e1e827930bd46cde42c4883662ddb6d244a26af2f0409cc2782bee61"
      values.$pastUpgrades.4.2:
+        ["0xba2492e52F45651B60B8B38d4Ea5E2390C64Ffb1"]
      values.$pastUpgrades.4.1:
-        ["0xba2492e52F45651B60B8B38d4Ea5E2390C64Ffb1"]
+        "0x4758bd62359bc69d7e8a0faaf5308d826379c23258d689a7430d5c0ad0361ad2"
      values.$pastUpgrades.3.2:
+        ["0xd81f43eDBCAcb4c29a9bA38a13Ee5d79278270cC"]
      values.$pastUpgrades.3.1:
-        ["0xd81f43eDBCAcb4c29a9bA38a13Ee5d79278270cC"]
+        "0x4758bd62359bc69d7e8a0faaf5308d826379c23258d689a7430d5c0ad0361ad2"
      values.$pastUpgrades.2.2:
+        ["0x33A032ec93Ec0C492Ec4BF0B30D5f51986E5a314"]
      values.$pastUpgrades.2.1:
-        ["0x33A032ec93Ec0C492Ec4BF0B30D5f51986E5a314"]
+        "0x3f7c36a1d636cdb23bf4f9171c27ebe58b73f4c0e6a33dbaac2c2f3c142faf50"
      values.$pastUpgrades.1.2:
+        ["0xd81f43eDBCAcb4c29a9bA38a13Ee5d79278270cC"]
      values.$pastUpgrades.1.1:
-        ["0xd81f43eDBCAcb4c29a9bA38a13Ee5d79278270cC"]
+        "0x3f7c36a1d636cdb23bf4f9171c27ebe58b73f4c0e6a33dbaac2c2f3c142faf50"
      values.$pastUpgrades.0.2:
+        ["0x5efa852e92800D1C982711761e45c3FE39a2b6D8"]
      values.$pastUpgrades.0.1:
-        ["0x5efa852e92800D1C982711761e45c3FE39a2b6D8"]
+        "0x76bceccd7d44656f5a129a600a6120091570b897c1d45c18cd7134cfe67c2537"
    }
```

```diff
    contract L1CrossDomainMessenger (0x25ace71c97B33Cc4729CF772ae268934F7ab5fA1) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      values.$pastUpgrades.9.2:
+        ["0xD3494713A5cfaD3F5359379DfA074E2Ac8C6Fd65"]
      values.$pastUpgrades.9.1:
-        ["0xD3494713A5cfaD3F5359379DfA074E2Ac8C6Fd65"]
+        "0x4758bd62359bc69d7e8a0faaf5308d826379c23258d689a7430d5c0ad0361ad2"
      values.$pastUpgrades.8.2:
+        ["0xd81f43eDBCAcb4c29a9bA38a13Ee5d79278270cC"]
      values.$pastUpgrades.8.1:
-        ["0xd81f43eDBCAcb4c29a9bA38a13Ee5d79278270cC"]
+        "0x4758bd62359bc69d7e8a0faaf5308d826379c23258d689a7430d5c0ad0361ad2"
      values.$pastUpgrades.7.2:
+        ["0xa95B24af19f8907390eD15f8348A1a5e6Ccbc5C6"]
      values.$pastUpgrades.7.1:
-        ["0xa95B24af19f8907390eD15f8348A1a5e6Ccbc5C6"]
+        "0x3f7c36a1d636cdb23bf4f9171c27ebe58b73f4c0e6a33dbaac2c2f3c142faf50"
      values.$pastUpgrades.6.2:
+        ["0xd81f43eDBCAcb4c29a9bA38a13Ee5d79278270cC"]
      values.$pastUpgrades.6.1:
-        ["0xd81f43eDBCAcb4c29a9bA38a13Ee5d79278270cC"]
+        "0x3f7c36a1d636cdb23bf4f9171c27ebe58b73f4c0e6a33dbaac2c2f3c142faf50"
      values.$pastUpgrades.5.2:
+        ["0x2150Bc3c64cbfDDbaC9815EF615D6AB8671bfe43"]
      values.$pastUpgrades.5.1:
-        ["0x2150Bc3c64cbfDDbaC9815EF615D6AB8671bfe43"]
+        "0xe2ff41f9bdf03d5455f55539b8b9c350276a179ca7f79322e2077d7c1ffb1268"
      values.$pastUpgrades.4.2:
+        ["0x0000000000000000000000000000000000000000"]
      values.$pastUpgrades.4.1:
-        ["0x0000000000000000000000000000000000000000"]
+        "0x76bceccd7d44656f5a129a600a6120091570b897c1d45c18cd7134cfe67c2537"
      values.$pastUpgrades.3.2:
+        ["0xd9166833FF12A5F900ccfBf2c8B62a90F1Ca1FD5"]
      values.$pastUpgrades.3.1:
-        ["0xd9166833FF12A5F900ccfBf2c8B62a90F1Ca1FD5"]
+        "0xbabb37235bd38ae5a29717590eedfd9b02f84a12b890b2126feac68f223d7448"
      values.$pastUpgrades.2.2:
+        ["0x0000000000000000000000000000000000000000"]
      values.$pastUpgrades.2.1:
-        ["0x0000000000000000000000000000000000000000"]
+        "0x2625aa2013fd1a650fb0264d2746be597e12f846baa48a68fe14539c200ed6dc"
      values.$pastUpgrades.1.2:
+        ["0xbfba066b5cA610Fe70AdCE45FcB622F945891bb0"]
      values.$pastUpgrades.1.1:
-        ["0xbfba066b5cA610Fe70AdCE45FcB622F945891bb0"]
+        "0x98a05fb521b3349dd92cff2e104d78c6c318add003bb501c0d416b2b4d75df8a"
      values.$pastUpgrades.0.2:
+        ["0x16393737D09d2722AD13DcA3cA8C3DB957699F1D"]
      values.$pastUpgrades.0.1:
-        ["0x16393737D09d2722AD13DcA3cA8C3DB957699F1D"]
+        "0xd19d40f11c375feeea5fe47576ce98a3a08caac68b2a8a52fb95dd1a76dd205a"
    }
```

```diff
    contract L1ERC721Bridge (0x5a7749f83b81B301cAb5f48EB8516B986DAef23D) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      values.$pastUpgrades.5.2:
+        ["0xAE2AF01232a6c4a4d3012C5eC5b1b35059caF10d"]
      values.$pastUpgrades.5.1:
-        ["0xAE2AF01232a6c4a4d3012C5eC5b1b35059caF10d"]
+        "0x4758bd62359bc69d7e8a0faaf5308d826379c23258d689a7430d5c0ad0361ad2"
      values.$pastUpgrades.4.2:
+        ["0xd81f43eDBCAcb4c29a9bA38a13Ee5d79278270cC"]
      values.$pastUpgrades.4.1:
-        ["0xd81f43eDBCAcb4c29a9bA38a13Ee5d79278270cC"]
+        "0x4758bd62359bc69d7e8a0faaf5308d826379c23258d689a7430d5c0ad0361ad2"
      values.$pastUpgrades.3.2:
+        ["0xc599Fa757c2bCaA5aE3753Ab129237F38C10da0b"]
      values.$pastUpgrades.3.1:
-        ["0xc599Fa757c2bCaA5aE3753Ab129237F38C10da0b"]
+        "0x3f7c36a1d636cdb23bf4f9171c27ebe58b73f4c0e6a33dbaac2c2f3c142faf50"
      values.$pastUpgrades.2.2:
+        ["0xd81f43eDBCAcb4c29a9bA38a13Ee5d79278270cC"]
      values.$pastUpgrades.2.1:
-        ["0xd81f43eDBCAcb4c29a9bA38a13Ee5d79278270cC"]
+        "0x3f7c36a1d636cdb23bf4f9171c27ebe58b73f4c0e6a33dbaac2c2f3c142faf50"
      values.$pastUpgrades.1.2:
+        ["0x3268Ed09f76e619331528270B6267D4d2C5Ab5C2"]
      values.$pastUpgrades.1.1:
-        ["0x3268Ed09f76e619331528270B6267D4d2C5Ab5C2"]
+        "0xe2ff41f9bdf03d5455f55539b8b9c350276a179ca7f79322e2077d7c1ffb1268"
      values.$pastUpgrades.0.2:
+        ["0x3268Ed09f76e619331528270B6267D4d2C5Ab5C2"]
      values.$pastUpgrades.0.1:
-        ["0x3268Ed09f76e619331528270B6267D4d2C5Ab5C2"]
+        "0xe8f632050cdf538eebcc5ab4a0ecb426966acfd14118e4fb8b181948449ae70d"
    }
```

```diff
    contract OptimismMintableERC20Factory (0x75505a97BD334E7BD3C476893285569C4136Fa0F) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      values.$pastUpgrades.4.2:
+        ["0xE01efbeb1089D1d1dB9c6c8b135C934C0734c846"]
      values.$pastUpgrades.4.1:
-        ["0xE01efbeb1089D1d1dB9c6c8b135C934C0734c846"]
+        "0x4758bd62359bc69d7e8a0faaf5308d826379c23258d689a7430d5c0ad0361ad2"
      values.$pastUpgrades.3.2:
+        ["0xd81f43eDBCAcb4c29a9bA38a13Ee5d79278270cC"]
      values.$pastUpgrades.3.1:
-        ["0xd81f43eDBCAcb4c29a9bA38a13Ee5d79278270cC"]
+        "0x4758bd62359bc69d7e8a0faaf5308d826379c23258d689a7430d5c0ad0361ad2"
      values.$pastUpgrades.2.2:
+        ["0x74e273220Fa1cB62Fd756FE6CbDA8BBb89404deD"]
      values.$pastUpgrades.2.1:
-        ["0x74e273220Fa1cB62Fd756FE6CbDA8BBb89404deD"]
+        "0x3f7c36a1d636cdb23bf4f9171c27ebe58b73f4c0e6a33dbaac2c2f3c142faf50"
      values.$pastUpgrades.1.2:
+        ["0xd81f43eDBCAcb4c29a9bA38a13Ee5d79278270cC"]
      values.$pastUpgrades.1.1:
-        ["0xd81f43eDBCAcb4c29a9bA38a13Ee5d79278270cC"]
+        "0x3f7c36a1d636cdb23bf4f9171c27ebe58b73f4c0e6a33dbaac2c2f3c142faf50"
      values.$pastUpgrades.0.2:
+        ["0xaE849EFA4BcFc419593420e14707996936E365E2"]
      values.$pastUpgrades.0.1:
-        ["0xaE849EFA4BcFc419593420e14707996936E365E2"]
+        "0xe2ff41f9bdf03d5455f55539b8b9c350276a179ca7f79322e2077d7c1ffb1268"
    }
```

```diff
    contract wstETHEscrow (0x76943C0D61395d8F2edF9060e1533529cAe05dE6) {
    +++ description: Lido custom escrow for wstETH tokens that uses the canonical bridge for messaging but is governed externally.
      values.$pastUpgrades.1.2:
+        ["0x168Cfea1Ad879d7032B3936eF3b0E90790b6B6D4"]
      values.$pastUpgrades.1.1:
-        ["0x168Cfea1Ad879d7032B3936eF3b0E90790b6B6D4"]
+        "0xc7bc3019721ecf320698f2897b329d1930f64661100a5fa159181146088e03c2"
      values.$pastUpgrades.0.2:
+        ["0x29C5c51A031165CE62F964966A6399b81165EFA4"]
      values.$pastUpgrades.0.1:
-        ["0x29C5c51A031165CE62F964966A6399b81165EFA4"]
+        "0x1bc90e7c6fe12e03691f7eccf025f3a244ea5a4888c7fb274f45f5e1004110ca"
    }
```

```diff
    contract DelayedWETH_PermissionlessGames (0x82511d494B5C942BE57498a70Fdd7184Ee33B975) {
    +++ description: Contract designed to hold the bonded ETH for each game. It is designed as a wrapper around WETH to allow an owner to function as a backstop if a game would incorrectly distribute funds.
      values.$pastUpgrades.0.2:
+        ["0x71e966Ae981d1ce531a7b6d23DC0f27B38409087"]
      values.$pastUpgrades.0.1:
-        ["0x71e966Ae981d1ce531a7b6d23DC0f27B38409087"]
+        "0xb5cf8f61fadb175bde0f7df2b7fe5f6837534f5d76d46c22b4bd5d0873c0deaa"
    }
```

```diff
    contract SuperchainConfig (0x95703e0982140D16f8ebA6d158FccEde42f04a4C) {
    +++ description: Used to manage global configuration values for multiple OP Chains within a single Superchain network. The SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the Superchain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      values.$pastUpgrades.2.2:
+        ["0x53c165169401764778F780a69701385eb0FF19B7"]
      values.$pastUpgrades.2.1:
-        ["0x53c165169401764778F780a69701385eb0FF19B7"]
+        "0xe361c0d4ae3aebc94b3f281ee372fbb1cbdb0c33ca8b1b35e7f3b009b2fcbdb0"
      values.$pastUpgrades.1.2:
+        ["0xd81f43eDBCAcb4c29a9bA38a13Ee5d79278270cC"]
      values.$pastUpgrades.1.1:
-        ["0xd81f43eDBCAcb4c29a9bA38a13Ee5d79278270cC"]
+        "0xe361c0d4ae3aebc94b3f281ee372fbb1cbdb0c33ca8b1b35e7f3b009b2fcbdb0"
      values.$pastUpgrades.0.2:
+        ["0x53c165169401764778F780a69701385eb0FF19B7"]
      values.$pastUpgrades.0.1:
-        ["0x53c165169401764778F780a69701385eb0FF19B7"]
+        "0x8ba0e42b89cde22310b644ed30fd44e4a348619a165a54c908e7dc341e9bbd0c"
    }
```

```diff
    contract DelayedWETH_PermissionedGames (0x9F9b897e37de5052cD70Db6D08474550DDb07f39) {
    +++ description: Contract designed to hold the bonded ETH for each game. It is designed as a wrapper around WETH to allow an owner to function as a backstop if a game would incorrectly distribute funds.
      values.$pastUpgrades.0.2:
+        ["0x71e966Ae981d1ce531a7b6d23DC0f27B38409087"]
      values.$pastUpgrades.0.1:
-        ["0x71e966Ae981d1ce531a7b6d23DC0f27B38409087"]
+        "0x25ff142069370a51e79a6c20e066cb5f976667fcd0d31203afed8cccfb864c09"
    }
```

```diff
    contract OptimismPortal (0xbEb5Fc579115071764c7423A4f12eDde41f106Ed) {
    +++ description: None
      values.$pastUpgrades.6.2:
+        ["0xe2F826324b2faf99E513D16D266c3F80aE87832B"]
      values.$pastUpgrades.6.1:
-        ["0xe2F826324b2faf99E513D16D266c3F80aE87832B"]
+        "0xbe810ed6e1e827930bd46cde42c4883662ddb6d244a26af2f0409cc2782bee61"
      values.$pastUpgrades.5.2:
+        ["0xd81f43eDBCAcb4c29a9bA38a13Ee5d79278270cC"]
      values.$pastUpgrades.5.1:
-        ["0xd81f43eDBCAcb4c29a9bA38a13Ee5d79278270cC"]
+        "0xbe810ed6e1e827930bd46cde42c4883662ddb6d244a26af2f0409cc2782bee61"
      values.$pastUpgrades.4.2:
+        ["0x2D778797049FE9259d947D1ED8e5442226dFB589"]
      values.$pastUpgrades.4.1:
-        ["0x2D778797049FE9259d947D1ED8e5442226dFB589"]
+        "0x4758bd62359bc69d7e8a0faaf5308d826379c23258d689a7430d5c0ad0361ad2"
      values.$pastUpgrades.3.2:
+        ["0xd81f43eDBCAcb4c29a9bA38a13Ee5d79278270cC"]
      values.$pastUpgrades.3.1:
-        ["0xd81f43eDBCAcb4c29a9bA38a13Ee5d79278270cC"]
+        "0x4758bd62359bc69d7e8a0faaf5308d826379c23258d689a7430d5c0ad0361ad2"
      values.$pastUpgrades.2.2:
+        ["0xaBAbe63514dDd6277356F8cc3d6518aA8BDEB4de"]
      values.$pastUpgrades.2.1:
-        ["0xaBAbe63514dDd6277356F8cc3d6518aA8BDEB4de"]
+        "0x3f7c36a1d636cdb23bf4f9171c27ebe58b73f4c0e6a33dbaac2c2f3c142faf50"
      values.$pastUpgrades.1.2:
+        ["0xd81f43eDBCAcb4c29a9bA38a13Ee5d79278270cC"]
      values.$pastUpgrades.1.1:
-        ["0xd81f43eDBCAcb4c29a9bA38a13Ee5d79278270cC"]
+        "0x3f7c36a1d636cdb23bf4f9171c27ebe58b73f4c0e6a33dbaac2c2f3c142faf50"
      values.$pastUpgrades.0.2:
+        ["0x28a55488fef40005309e2DA0040DbE9D300a64AB"]
      values.$pastUpgrades.0.1:
-        ["0x28a55488fef40005309e2DA0040DbE9D300a64AB"]
+        "0xe2ff41f9bdf03d5455f55539b8b9c350276a179ca7f79322e2077d7c1ffb1268"
    }
```

```diff
    contract DisputeGameFactory (0xe5965Ab5962eDc7477C8520243A95517CD252fA9) {
    +++ description: The dispute game factory allows the creation of dispute games, used to propose state roots and eventually challenge them.
      values.$pastUpgrades.0.2:
+        ["0xc641A33cab81C559F2bd4b21EA34C290E2440C2B"]
      values.$pastUpgrades.0.1:
-        ["0xc641A33cab81C559F2bd4b21EA34C290E2440C2B"]
+        "0x2c16c813ff50e9e09a3c58508a9b90293c896f1f91534d09a5002f50bc8760ff"
    }
```

Generated with discovered.json: 0xd14bd5e0a026b840d5341e0dd64e9b5a8c5f6bc8

# Diff at Fri, 18 Oct 2024 11:35:24 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@8bd58d38d84243da335cc86dc9fccafce6e4a0a9 block: 20948093
- current block number: 20948093

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20948093 (main branch discovery), not current.

```diff
    contract LivenessModule (0x0454092516c9A4d636d3CAfA1e82161376C8a748) {
    +++ description: used to remove members inactive for 98d while making sure that the threshold remains above 75%. If the number of members falls below 8, the 0x847B5c174615B1B7fDF770882256e2D3E95b9D92 takes ownership of the multisig
      receivedPermissions:
+        [{"permission":"guard","target":"0x95703e0982140D16f8ebA6d158FccEde42f04a4C","via":[{"address":"0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2"},{"address":"0xc2819DC788505Aac350142A7A707BF9D03E3Bd03"}]}]
      directlyReceivedPermissions:
+        [{"permission":"act","target":"0xc2819DC788505Aac350142A7A707BF9D03E3Bd03"}]
    }
```

```diff
    contract SuperchainConfig (0x95703e0982140D16f8ebA6d158FccEde42f04a4C) {
    +++ description: Used to manage global configuration values for multiple OP Chains within a single Superchain network. The SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the Superchain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      issuedPermissions.3:
+        {"permission":"upgrade","target":"0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A","via":[{"address":"0x543bA4AADBAb8f9025686Bd03993043599c6fB04","delay":0}]}
      issuedPermissions.2:
+        {"permission":"guard","target":"0xc2819DC788505Aac350142A7A707BF9D03E3Bd03","via":[{"address":"0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2","delay":0}]}
      issuedPermissions.1.permission:
-        "upgrade"
+        "guard"
      issuedPermissions.1.target:
-        "0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A"
+        "0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A"
      issuedPermissions.1.via.1:
+        {"address":"0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2","delay":0}
      issuedPermissions.1.via.0.address:
-        "0x543bA4AADBAb8f9025686Bd03993043599c6fB04"
+        "0xc6901F65369FC59fC1B4D6D6bE7A2318Ff38dB5B"
      issuedPermissions.0.target:
-        "0xc2819DC788505Aac350142A7A707BF9D03E3Bd03"
+        "0x0454092516c9A4d636d3CAfA1e82161376C8a748"
      issuedPermissions.0.via.1:
+        {"address":"0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2","delay":0}
      issuedPermissions.0.via.0.address:
-        "0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2"
+        "0xc2819DC788505Aac350142A7A707BF9D03E3Bd03"
    }
```

```diff
    contract FoundationMultisig_2 (0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A) {
    +++ description: None
      receivedPermissions:
+        [{"permission":"guard","target":"0x95703e0982140D16f8ebA6d158FccEde42f04a4C","via":[{"address":"0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2"},{"address":"0xc6901F65369FC59fC1B4D6D6bE7A2318Ff38dB5B"}]}]
      directlyReceivedPermissions:
+        [{"permission":"act","target":"0xc6901F65369FC59fC1B4D6D6bE7A2318Ff38dB5B"}]
    }
```

```diff
    contract DeputyGuardianModule (0xc6901F65369FC59fC1B4D6D6bE7A2318Ff38dB5B) {
    +++ description: allows the 0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A, called the deputy guardian, to act on behalf of the Gnosis Safe.
      directlyReceivedPermissions:
+        [{"permission":"act","target":"0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2"}]
    }
```

Generated with discovered.json: 0x40c3483943613e4af97fe6dcd899d2a7b1c0eb6e

# Diff at Wed, 16 Oct 2024 11:38:39 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@a3d139b799cc0b28e5e912febb17464d4e5aef5d block: 20948093
- current block number: 20948093

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20948093 (main branch discovery), not current.

```diff
    contract GuardianMultisig (0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2) {
    +++ description: None
      roles:
-        ["Guardian"]
      directlyReceivedPermissions:
+        [{"permission":"guard","target":"0x95703e0982140D16f8ebA6d158FccEde42f04a4C"}]
    }
```

```diff
    contract SuperchainConfig (0x95703e0982140D16f8ebA6d158FccEde42f04a4C) {
    +++ description: Used to manage global configuration values for multiple OP Chains within a single Superchain network. The SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the Superchain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      issuedPermissions.1:
+        {"permission":"upgrade","target":"0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A","via":[{"address":"0x543bA4AADBAb8f9025686Bd03993043599c6fB04","delay":0}]}
      issuedPermissions.0.permission:
-        "upgrade"
+        "guard"
      issuedPermissions.0.target:
-        "0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A"
+        "0xc2819DC788505Aac350142A7A707BF9D03E3Bd03"
      issuedPermissions.0.via.0.address:
-        "0x543bA4AADBAb8f9025686Bd03993043599c6fB04"
+        "0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2"
    }
```

```diff
    contract SecurityCouncilMultisig (0xc2819DC788505Aac350142A7A707BF9D03E3Bd03) {
    +++ description: None
      receivedPermissions:
+        [{"permission":"guard","target":"0x95703e0982140D16f8ebA6d158FccEde42f04a4C","via":[{"address":"0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2"}]}]
    }
```

Generated with discovered.json: 0x85e07267569ada99b58fe175959a05fe0bd134c1

# Diff at Mon, 14 Oct 2024 11:00:03 GMT:

- chain: optimism
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1afc77ff111ceb0970e7d09efcc7b2f376b0c281 block: 122593187
- current block number: 122593187

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 122593187 (main branch discovery), not current.

```diff
    contract MintManagerOwner (0x2A82Ae142b2e62Cb7D10b55E323ACB1Cab663a26) {
    +++ description: None
      sourceHashes:
+        ["0x81a7349eebb98ac33b0bc6842e3cb258034a8f2a4ba004570bb8e2e25947f9ff","0x59fe14e95a8aa7f52213f18bae5c9329cf583a7ba31194698b15eddb97d5e825"]
    }
```

```diff
    contract DeployerWhitelist (0x4200000000000000000000000000000000000002) {
    +++ description: None
      sourceHashes:
+        ["0x0a47b6d41e108156a5ce873322c843aad6040edbe7cf3d7e3473abb4d01e7e44","0x40a3a457f0e922425ed48d80603e24e652453f57be197487f62795991cff2c2b"]
    }
```

```diff
    contract L2CrossDomainMessenger (0x4200000000000000000000000000000000000007) {
    +++ description: None
      sourceHashes:
+        ["0x0a47b6d41e108156a5ce873322c843aad6040edbe7cf3d7e3473abb4d01e7e44","0x54d303632c7acb15a0f8c319289166a6c178e02f2c930685ab3cdcbe5b19ca29"]
    }
```

```diff
    contract GasPriceOracle (0x420000000000000000000000000000000000000F) {
    +++ description: None
      sourceHashes:
+        ["0x0a47b6d41e108156a5ce873322c843aad6040edbe7cf3d7e3473abb4d01e7e44","0x6d0f92051952bf3dcccae9e0ff5cf654e3b386df386bc0609b0c7234a2a108bb"]
    }
```

```diff
    contract L2StandardBridge (0x4200000000000000000000000000000000000010) {
    +++ description: None
      sourceHashes:
+        ["0x0a47b6d41e108156a5ce873322c843aad6040edbe7cf3d7e3473abb4d01e7e44","0xb1264cdbc9eb25c5d5f9542dc05d942009b4443379d97b246c66b11e2319215f"]
    }
```

```diff
    contract SequencerFeeVault (0x4200000000000000000000000000000000000011) {
    +++ description: None
      sourceHashes:
+        ["0x0a47b6d41e108156a5ce873322c843aad6040edbe7cf3d7e3473abb4d01e7e44","0xf13800f6674424ad602d8daac646acfc10794f492253796903ac26b7fdb3eabf"]
    }
```

```diff
    contract OptimismMintableERC20Factory (0x4200000000000000000000000000000000000012) {
    +++ description: None
      sourceHashes:
+        ["0x0a47b6d41e108156a5ce873322c843aad6040edbe7cf3d7e3473abb4d01e7e44","0x33cbc2e27551e9c304842740517adbe533ed12516557dc9a8b7c63f7d599998b"]
    }
```

```diff
    contract L1BlockNumber (0x4200000000000000000000000000000000000013) {
    +++ description: None
      sourceHashes:
+        ["0x0a47b6d41e108156a5ce873322c843aad6040edbe7cf3d7e3473abb4d01e7e44","0x0ac40be66f726a1d64904e03831f746ee3fd847922d5e54ba4ad0e509602ccf8"]
    }
```

```diff
    contract L2ERC721Bridge (0x4200000000000000000000000000000000000014) {
    +++ description: None
      sourceHashes:
+        ["0x0a47b6d41e108156a5ce873322c843aad6040edbe7cf3d7e3473abb4d01e7e44","0x5e60fa0150197ecbd302b46ad0cc0b6f3f024342d97f052ed2f9a8c2a6ed3846"]
    }
```

```diff
    contract L1Block (0x4200000000000000000000000000000000000015) {
    +++ description: None
      sourceHashes:
+        ["0x0a47b6d41e108156a5ce873322c843aad6040edbe7cf3d7e3473abb4d01e7e44","0xbdd7533735ef92fffadfbee431b476e72f2f048487c921c5570443e3cba5cb30"]
    }
```

```diff
    contract L2ToL1MessagePasser (0x4200000000000000000000000000000000000016) {
    +++ description: None
      sourceHashes:
+        ["0x0a47b6d41e108156a5ce873322c843aad6040edbe7cf3d7e3473abb4d01e7e44","0x362ef15b4c72a78e42b10222a63ec31da455fc051e5fc3e6bade09de4d19bdd9"]
    }
```

```diff
    contract OptimismMintableERC721Factory (0x4200000000000000000000000000000000000017) {
    +++ description: None
      sourceHashes:
+        ["0x0a47b6d41e108156a5ce873322c843aad6040edbe7cf3d7e3473abb4d01e7e44","0x8dc81ca02eba8fc262038825d8c633ed5542af30e92e629f65787cf7161c0b69"]
    }
```

```diff
    contract L2ProxyAdmin (0x4200000000000000000000000000000000000018) {
    +++ description: None
      template:
-        "opstack/ProxyAdmin"
+        "global/ProxyAdmin"
      sourceHashes:
+        ["0x0a47b6d41e108156a5ce873322c843aad6040edbe7cf3d7e3473abb4d01e7e44","0x96d2f0fa1bd83ebd61ba6a2351c64c7fda7aa580b11ea67bb6bf4338e5c28512"]
    }
```

```diff
    contract BaseFeeVault (0x4200000000000000000000000000000000000019) {
    +++ description: None
      sourceHashes:
+        ["0x0a47b6d41e108156a5ce873322c843aad6040edbe7cf3d7e3473abb4d01e7e44","0x0c18a8a786c9a78d1ea6a3f71ee3369ae8acc817629b8bf4934b05f8a38a41a2"]
    }
```

```diff
    contract L1FeeVault (0x420000000000000000000000000000000000001A) {
    +++ description: None
      sourceHashes:
+        ["0x0a47b6d41e108156a5ce873322c843aad6040edbe7cf3d7e3473abb4d01e7e44","0xa5448c99f954f5f48195d1e118c0513d52fe9a6357928d1d29f617258ca935ff"]
    }
```

```diff
    contract SchemaRegistry (0x4200000000000000000000000000000000000020) {
    +++ description: None
      sourceHashes:
+        ["0x0a47b6d41e108156a5ce873322c843aad6040edbe7cf3d7e3473abb4d01e7e44","0x612d21c1676a505153f40dceb55f1251798affb5ed211cfc9c00efa2a51fcbfd"]
    }
```

```diff
    contract EAS (0x4200000000000000000000000000000000000021) {
    +++ description: None
      sourceHashes:
+        ["0x0a47b6d41e108156a5ce873322c843aad6040edbe7cf3d7e3473abb4d01e7e44","0x662edc082d445c579bb50a631e8c4137c8d9d9016da29683e3f1ccf24b835092"]
    }
```

```diff
    contract OPToken (0x4200000000000000000000000000000000000042) {
    +++ description: None
      sourceHashes:
+        ["0xbaac8c2c26ae66ca5f26a277a6fc9ad2cac1d8e638fae5ab2589b8fec8262316"]
    }
```

```diff
    contract MintManager (0x5C4e7Ba1E219E47948e6e3F55019A647bA501005) {
    +++ description: None
      sourceHashes:
+        ["0x132b4ddf43264613a6251435ddd7443efbd8ed51129af51edb5c6ab298471b3d"]
    }
```

Generated with discovered.json: 0xae6b4687219cee3c7a74a93c9852256bf06a4bd5

# Diff at Mon, 14 Oct 2024 10:53:55 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1afc77ff111ceb0970e7d09efcc7b2f376b0c281 block: 20948093
- current block number: 20948093

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20948093 (main branch discovery), not current.

```diff
    contract LivenessModule (0x0454092516c9A4d636d3CAfA1e82161376C8a748) {
    +++ description: used to remove members inactive for 98d while making sure that the threshold remains above 75%. If the number of members falls below 8, the 0x847B5c174615B1B7fDF770882256e2D3E95b9D92 takes ownership of the multisig
      sourceHashes:
+        ["0x998654cb64c7fc216505bdb3322b20e7d7c95704005228ad1f878bc631c4af8d"]
    }
```

```diff
    contract PermissionedDisputeGame (0x050ed6F6273c7D836a111E42153BC00D0380b87d) {
    +++ description: None
      sourceHashes:
+        ["0x6aa2de634fc13396d9ea0b7d9d0869633db9d2bfc5b834f530fdc61ab1184bf6"]
    }
```

```diff
    contract GuardianMultisig (0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2) {
    +++ description: None
      sourceHashes:
+        ["0x81a7349eebb98ac33b0bc6842e3cb258034a8f2a4ba004570bb8e2e25947f9ff","0xd42bbf9f7dcd3720a7fc6bdc6edfdfae8800a37d6dd4decfa0ef6ca4a2e88940"]
    }
```

```diff
    contract L1DAITokenBridge (0x10E6593CDda8c58a1d0f14C5164B376352a55f2F) {
    +++ description: None
      sourceHashes:
+        ["0x4c5465ff113d9808b9b99013be373f52fcb90c8df71628dd658f0adbceff1366"]
    }
```

```diff
    contract MIPS (0x16e83cE5Ce29BF90AD9Da06D2fE6a15d5f344ce4) {
    +++ description: The MIPS contract is used to execute the final step of the dispute game which objectively determines the winner of the dispute.
      sourceHashes:
+        ["0x8144cb5736a5296d5afc2433b58a1fcb99f995c2836fd16aeca18eda86fb2f91"]
    }
```

```diff
    contract AnchorStateRegistry (0x18DAc71c228D1C32c99489B7323d441E1175e443) {
    +++ description: Contains the latest confirmed state root that can be used as a starting point in a dispute game.
      sourceHashes:
+        ["0x7913a1d7d0c47796c94eb6f8fd87a89ae9f2716eda57c9be4fd2b27c70bed617","0x6ceb1548721dae770e84e1c1059e5415381a07285cd687fdb032aa2d320e1f20"]
    }
```

```diff
    contract SystemConfig (0x229047fed2591dbec1eF1118d64F7aF3dB9EB290) {
    +++ description: None
      sourceHashes:
+        ["0x2cdcfef705094aaac53d507bad64d27b48ea5a9c11a7fadffacc192aab7a823f","0xbbb92920a096eced30e3ce67bbc443f134b217e8847433fbb192ecb9fdddcbc2"]
    }
```

```diff
    contract LivenessGuard (0x24424336F04440b1c28685a38303aC33C9D14a25) {
    +++ description: None
      sourceHashes:
+        ["0xe771f3d1c51456e08e2c93a904b12010870dc4fa79ee82e4bc90433557931f05"]
    }
```

```diff
    contract L1CrossDomainMessenger (0x25ace71c97B33Cc4729CF772ae268934F7ab5fA1) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      sourceHashes:
+        ["0x6e4b297b822bdda2bb8bbf4dde360ee51379af5a0de55c0d726a2d7b68791bf7","0x1cc8a3b7de3d2c54c4706bb3f3015714d3b56647fc9fbfd6f8b068f5f63c1c25"]
    }
```

```diff
    contract GnosisSafe (0x42d27eEA1AD6e22Af6284F609847CB3Cd56B9c64) {
    +++ description: None
      sourceHashes:
+        ["0x81a7349eebb98ac33b0bc6842e3cb258034a8f2a4ba004570bb8e2e25947f9ff","0xd42bbf9f7dcd3720a7fc6bdc6edfdfae8800a37d6dd4decfa0ef6ca4a2e88940"]
    }
```

```diff
    contract L1Escrow (0x467194771dAe2967Aef3ECbEDD3Bf9a310C76C65) {
    +++ description: None
      sourceHashes:
+        ["0xe3c0ee54209bc4a4d457bc5e251aff40a83fc784e37b8b90fd9158c6b0f29e5c"]
    }
```

```diff
    contract SuperchainProxyAdmin (0x543bA4AADBAb8f9025686Bd03993043599c6fB04) {
    +++ description: None
      template:
-        "opstack/ProxyAdmin"
+        "global/ProxyAdmin"
      sourceHashes:
+        ["0x96d2f0fa1bd83ebd61ba6a2351c64c7fda7aa580b11ea67bb6bf4338e5c28512"]
    }
```

```diff
    contract SuperchainProxyAdminOwner (0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A) {
    +++ description: None
      sourceHashes:
+        ["0x81a7349eebb98ac33b0bc6842e3cb258034a8f2a4ba004570bb8e2e25947f9ff","0xd42bbf9f7dcd3720a7fc6bdc6edfdfae8800a37d6dd4decfa0ef6ca4a2e88940"]
    }
```

```diff
    contract L1ERC721Bridge (0x5a7749f83b81B301cAb5f48EB8516B986DAef23D) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      sourceHashes:
+        ["0x0a47b6d41e108156a5ce873322c843aad6040edbe7cf3d7e3473abb4d01e7e44","0x482ec6e91304ac39a3fb4505634427bddfddee23b8e93a4f7f995ca5083ae3c3"]
    }
```

```diff
    contract SynthetixBridgeEscrow (0x5Fd79D46EBA7F351fe49BFF9E87cdeA6c821eF9f) {
    +++ description: None
      sourceHashes:
+        ["0x9fdc8650f5cfe4f5ce38accccf178614c6a57917867d6ee7fcc9c5a690ade600"]
    }
```

```diff
    contract OptimismMintableERC20Factory (0x75505a97BD334E7BD3C476893285569C4136Fa0F) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      sourceHashes:
+        ["0x2cdcfef705094aaac53d507bad64d27b48ea5a9c11a7fadffacc192aab7a823f","0x4c5ac4e53576924cabbd2a471f368a541bc3f4b1f53fa41a389692fcc62f6176"]
    }
```

```diff
    contract wstETHEscrow (0x76943C0D61395d8F2edF9060e1533529cAe05dE6) {
    +++ description: Lido custom escrow for wstETH tokens that uses the canonical bridge for messaging but is governed externally.
      sourceHashes:
+        ["0x698ae88793265d087e07a445b69bf16b450cdcf636b9073b86221936e912a135","0xee07202651af1cf311f14f1f29908dd5524a050efc650832b6ee88c9a9cf86fd"]
    }
```

```diff
    contract DelayedWETH_PermissionlessGames (0x82511d494B5C942BE57498a70Fdd7184Ee33B975) {
    +++ description: Contract designed to hold the bonded ETH for each game. It is designed as a wrapper around WETH to allow an owner to function as a backstop if a game would incorrectly distribute funds.
      sourceHashes:
+        ["0x7913a1d7d0c47796c94eb6f8fd87a89ae9f2716eda57c9be4fd2b27c70bed617","0xfff6f4cca21febd4323222e2ca87ec8b78edfdeeca942468fbf331e537815484"]
    }
```

```diff
    contract FoundationMultisig_1 (0x847B5c174615B1B7fDF770882256e2D3E95b9D92) {
    +++ description: None
      sourceHashes:
+        ["0x81a7349eebb98ac33b0bc6842e3cb258034a8f2a4ba004570bb8e2e25947f9ff","0xd42bbf9f7dcd3720a7fc6bdc6edfdfae8800a37d6dd4decfa0ef6ca4a2e88940"]
    }
```

```diff
    contract SuperchainConfig (0x95703e0982140D16f8ebA6d158FccEde42f04a4C) {
    +++ description: Used to manage global configuration values for multiple OP Chains within a single Superchain network. The SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the Superchain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      sourceHashes:
+        ["0x7913a1d7d0c47796c94eb6f8fd87a89ae9f2716eda57c9be4fd2b27c70bed617","0x3ac96c9c95e25f689f65a50f24b325e3f891029cb1cea96dc642418bbb535b1d"]
    }
```

```diff
    contract L1StandardBridge (0x99C9fc46f92E8a1c0deC1b1747d010903E884bE1) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token.
      sourceHashes:
+        ["0x18e98a64fbfe011a7514d7a547900c02a3e0f9a49ab3413d517fd7e0e3c539dd","0x1010ff7f40ab4d53e6d9996aefa04423dabe9d0e22fac2d02b330ed3aa2c5740"]
    }
```

```diff
    contract FoundationMultisig_2 (0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A) {
    +++ description: None
      sourceHashes:
+        ["0xd5a33441170541b7df25812e0e3dff6562b2f09ab835a6b431cb9e7198a47605","0x263aadde480629cd3ca5704cc7d4e7df809d437e68f8d9864039801ddf820367"]
    }
```

```diff
    contract PreimageOracle (0x9c065e11870B891D214Bc2Da7EF1f9DDFA1BE277) {
    +++ description: None
      sourceHashes:
+        ["0xda65cfcdd58c88318ad76812d92be7f0d10716f389549846646b82ceecf47b2b"]
    }
```

```diff
    contract DelayedWETH_PermissionedGames (0x9F9b897e37de5052cD70Db6D08474550DDb07f39) {
    +++ description: Contract designed to hold the bonded ETH for each game. It is designed as a wrapper around WETH to allow an owner to function as a backstop if a game would incorrectly distribute funds.
      sourceHashes:
+        ["0x7913a1d7d0c47796c94eb6f8fd87a89ae9f2716eda57c9be4fd2b27c70bed617","0xfff6f4cca21febd4323222e2ca87ec8b78edfdeeca942468fbf331e537815484"]
    }
```

```diff
    contract FeesCollector (0xa3d596EAfaB6B13Ab18D40FaE1A962700C84ADEa) {
    +++ description: None
      sourceHashes:
+        ["0xa58ba822ad1db27a90c11078dd6ececa7d90a2f12794716b21e0ffaa038ff101"]
    }
```

```diff
    contract FaultDisputeGame (0xA6f3DFdbf4855a43c529bc42EDE96797252879af) {
    +++ description: None
      sourceHashes:
+        ["0x6a8cfd738d026b64f2e5aaaf5faac411dcdc8c0d8ef834587d82144340812a2c"]
    }
```

```diff
    contract OptimismPortal (0xbEb5Fc579115071764c7423A4f12eDde41f106Ed) {
    +++ description: None
      sourceHashes:
+        ["0x2cdcfef705094aaac53d507bad64d27b48ea5a9c11a7fadffacc192aab7a823f","0x41be46bdb67af1b7af90e1bd70a1fcd31a3352282beb83b846a5189675c37ac1"]
    }
```

```diff
    contract SecurityCouncilMultisig (0xc2819DC788505Aac350142A7A707BF9D03E3Bd03) {
    +++ description: None
      sourceHashes:
+        ["0x81a7349eebb98ac33b0bc6842e3cb258034a8f2a4ba004570bb8e2e25947f9ff","0xd42bbf9f7dcd3720a7fc6bdc6edfdfae8800a37d6dd4decfa0ef6ca4a2e88940"]
    }
```

```diff
    contract DeputyGuardianModule (0xc6901F65369FC59fC1B4D6D6bE7A2318Ff38dB5B) {
    +++ description: allows the 0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A, called the deputy guardian, to act on behalf of the Gnosis Safe.
      sourceHashes:
+        ["0x9624d67fb3738cf1ce1e1f48e2cf433e9373345386943d12f1d751d6b8475cd6"]
    }
```

```diff
    contract AddressManager (0xdE1FCfB0851916CA5101820A69b13a4E276bd81F) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      sourceHashes:
+        ["0xe5211497d15a7ea75577cf992ab6093dd0f6083f45c955f0136737810e44c205"]
    }
```

```diff
    contract DisputeGameFactory (0xe5965Ab5962eDc7477C8520243A95517CD252fA9) {
    +++ description: The dispute game factory allows the creation of dispute games, used to propose state roots and eventually challenge them.
      sourceHashes:
+        ["0x7913a1d7d0c47796c94eb6f8fd87a89ae9f2716eda57c9be4fd2b27c70bed617","0x7f307d6191215a72b6c24c01b3c2fc87c84f7fb346790132e58736caa2d1dd14"]
    }
```

Generated with discovered.json: 0xa2d43aa280997cb9afa421b5ed3382e0c9b95f9a

# Diff at Sat, 12 Oct 2024 07:40:30 GMT:

- chain: ethereum
- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@86ddd4ba846ebcaec5953fa3bbd1a66f324e7175 block: 20935110
- current block number: 20948093

## Description

New custom escrow for wstETH, supports rebasable wstETH on L2. Escrowed token is still wstETH.

## Watched changes

```diff
    contract wstETHEscrow (0x76943C0D61395d8F2edF9060e1533529cAe05dE6) {
    +++ description: Lido custom escrow for wstETH tokens that uses the canonical bridge for messaging but is governed externally.
      template:
-        "lido/L1ERC20TokenBridge"
+        "lido/L1LidoTokensBridge"
      descriptions.0:
-        "Escrow for custom external tokens that use the canonical bridge for messaging but are governed externally."
+        "Lido custom escrow for wstETH tokens that uses the canonical bridge for messaging but is governed externally."
      values.$implementation:
-        "0x29C5c51A031165CE62F964966A6399b81165EFA4"
+        "0x168Cfea1Ad879d7032B3936eF3b0E90790b6B6D4"
      values.$pastUpgrades.1:
+        ["2024-10-11T16:21:11.000Z",["0x168Cfea1Ad879d7032B3936eF3b0E90790b6B6D4"]]
      values.$upgradeCount:
-        1
+        2
      values.isDepositsEnabled:
-        false
+        true
      values.l1Token:
-        "0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0"
      values.l2Token:
-        "0x1F32b1c2345538c0c6f582fCB022739c4A194Ebb"
      values.messenger:
-        "0x25ace71c97B33Cc4729CF772ae268934F7ab5fA1"
      values.proxy__getImplementation:
-        "0x29C5c51A031165CE62F964966A6399b81165EFA4"
+        "0x168Cfea1Ad879d7032B3936eF3b0E90790b6B6D4"
      values.accesscontrol:
+        {"DEFAULT_ADMIN_ROLE":{"adminRole":"DEFAULT_ADMIN_ROLE","members":["0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c"]},"0x4b43b36766bde12c5e9cbbc37d15f8d1f769f08f54720ab370faeb4ce893753a":{"adminRole":"DEFAULT_ADMIN_ROLE","members":["0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c"]},"0x63f736f21cb2943826cd50b191eb054ebbea670e4e962d0527611f830cd399d6":{"adminRole":"DEFAULT_ADMIN_ROLE","members":["0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c","0x73b047fe6337183A454c5217241D780a932777bD"]},"0x9ab8816a3dc0b3849ec1ac00483f6ec815b07eee2fd766a353311c823ad59d0d":{"adminRole":"DEFAULT_ADMIN_ROLE","members":["0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c"]},"0x94a954c0bc99227eddbc0715a62a7e1056ed8784cd719c2303b685683908857c":{"adminRole":"DEFAULT_ADMIN_ROLE","members":["0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c","0x73b047fe6337183A454c5217241D780a932777bD"]}}
      values.ACCOUNTING_ORACLE:
+        "0x852deD011285fe67063a08005c71a85690503Cee"
      values.GENESIS_TIME:
+        1606824023
      values.getContractVersion:
+        2
      values.L1_TOKEN_NON_REBASABLE:
+        "0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0"
      values.L1_TOKEN_REBASABLE:
+        "0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84"
      values.L2_TOKEN_NON_REBASABLE:
+        "0x1F32b1c2345538c0c6f582fCB022739c4A194Ebb"
      values.L2_TOKEN_REBASABLE:
+        "0x76A50b8c7349cCDDb7578c6627e79b5d99D24138"
      values.MESSENGER:
+        "0x25ace71c97B33Cc4729CF772ae268934F7ab5fA1"
      values.SECONDS_PER_SLOT:
+        12
      values.TOKEN_RATE_DECIMALS:
+        27
      values.WSTETH:
+        "0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0"
      derivedName:
-        "L1ERC20TokenBridge"
+        "L1LidoTokensBridge"
    }
```

## Source code changes

```diff
.../wstETHEscrow/L1LidoTokensBridge.sol}           | 1864 ++++++++++++--------
 1 file changed, 1082 insertions(+), 782 deletions(-)
```

Generated with discovered.json: 0x41f2c0b7c194a335bce74f0146ed7b8824b7db6f

# Diff at Thu, 10 Oct 2024 12:08:56 GMT:

- chain: ethereum
- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@cb5ff535ffc194baf7396bd6db8232883e2ad088 block: 20922325
- current block number: 20935110

## Description

Ignore SNX Multisig and wstethEscrow relatives + shape template config related.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20922325 (main branch discovery), not current.

```diff
    contract SuperchainProxyAdmin (0x543bA4AADBAb8f9025686Bd03993043599c6fB04) {
    +++ description: None
      directlyReceivedPermissions.0.description:
+        "set and change address mappings."
    }
```

```diff
    contract SuperchainProxyAdminOwner (0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A) {
    +++ description: None
      receivedPermissions.0.description:
+        "set and change address mappings."
    }
```

```diff
    contract wstETHEscrow (0x76943C0D61395d8F2edF9060e1533529cAe05dE6) {
    +++ description: Escrow for custom external tokens that use the canonical bridge for messaging but are governed externally.
      values.accessControl:
-        {"DEFAULT_ADMIN_ROLE":{"adminRole":"DEFAULT_ADMIN_ROLE","members":["0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c"]},"0x4b43b36766bde12c5e9cbbc37d15f8d1f769f08f54720ab370faeb4ce893753a":{"adminRole":"DEFAULT_ADMIN_ROLE","members":["0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c"]},"0x63f736f21cb2943826cd50b191eb054ebbea670e4e962d0527611f830cd399d6":{"adminRole":"DEFAULT_ADMIN_ROLE","members":["0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c","0x73b047fe6337183A454c5217241D780a932777bD"]},"0x9ab8816a3dc0b3849ec1ac00483f6ec815b07eee2fd766a353311c823ad59d0d":{"adminRole":"DEFAULT_ADMIN_ROLE","members":["0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c"]},"0x94a954c0bc99227eddbc0715a62a7e1056ed8784cd719c2303b685683908857c":{"adminRole":"DEFAULT_ADMIN_ROLE","members":["0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c","0x73b047fe6337183A454c5217241D780a932777bD"]}}
    }
```

```diff
    contract AddressManager (0xdE1FCfB0851916CA5101820A69b13a4E276bd81F) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      issuedPermissions.0.via.0.description:
+        "set and change address mappings."
      descriptions:
+        ["Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts."]
    }
```

```diff
-   Status: DELETED
    contract SynthetixMultisig (0xEb3107117FEAd7de89Cd14D463D340A2E6917769)
    +++ description: None
```

Generated with discovered.json: 0xe0aaeba96a6b157035d409db6ad8520899fb43b6

# Diff at Tue, 08 Oct 2024 17:23:11 GMT:

- chain: ethereum
- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@bca55174129419533cd4173605c170ea99ac6f98 block: 20826753
- current block number: 20922325

## Description

The deposits on the main Lido escrow for Optimism are paused by the Lido EmergencyBrake Multisig following [an upgrade proposal](https://research.lido.fi/t/steth-on-optimism-upgrade-announcement-and-action-plan/8474) for rebasing L2 stETH. This is a scheduled action and deposits should be reenabled im 2024/10/10.

Config related: Move to discovery driven data.

## Watched changes

```diff
    contract wstETHEscrow (0x76943C0D61395d8F2edF9060e1533529cAe05dE6) {
    +++ description: Escrow for custom external tokens that use the canonical bridge for messaging but are governed externally.
      values.isDepositsEnabled:
-        true
+        false
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20826753 (main branch discovery), not current.

```diff
    contract wstETHEscrow (0x76943C0D61395d8F2edF9060e1533529cAe05dE6) {
    +++ description: Escrow for custom external tokens that use the canonical bridge for messaging but are governed externally.
      template:
+        "lido/L1ERC20TokenBridge"
      displayName:
+        "L1ERC20TokenBridge"
      descriptions:
+        ["Escrow for custom external tokens that use the canonical bridge for messaging but are governed externally."]
    }
```

Generated with discovered.json: 0xc3527c08f9f1468797be981c8cc9c3858d6d3d87

# Diff at Tue, 01 Oct 2024 11:13:41 GMT:

- chain: optimism
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bd754dc73c66120164006054f8d25c5fae9cd910 block: 122593187
- current block number: 122593187

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 122593187 (main branch discovery), not current.

```diff
    contract DeployerWhitelist (0x4200000000000000000000000000000000000002) {
    +++ description: None
      values.$pastUpgrades:
+        []
    }
```

```diff
    contract L2CrossDomainMessenger (0x4200000000000000000000000000000000000007) {
    +++ description: None
      values.$pastUpgrades:
+        []
    }
```

```diff
    contract GasPriceOracle (0x420000000000000000000000000000000000000F) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-03-14T00:00:01.000Z",["0xb528D11cC114E026F138fE568744c6D45ce6Da7A"]],["2024-07-10T16:00:01.000Z",["0xa919894851548179A0750865e7974DA599C0Fac7"]]]
    }
```

```diff
    contract L2StandardBridge (0x4200000000000000000000000000000000000010) {
    +++ description: None
      values.$pastUpgrades:
+        []
    }
```

```diff
    contract SequencerFeeVault (0x4200000000000000000000000000000000000011) {
    +++ description: None
      values.$pastUpgrades:
+        []
    }
```

```diff
    contract OptimismMintableERC20Factory (0x4200000000000000000000000000000000000012) {
    +++ description: None
      values.$pastUpgrades:
+        []
    }
```

```diff
    contract L1BlockNumber (0x4200000000000000000000000000000000000013) {
    +++ description: None
      values.$pastUpgrades:
+        []
    }
```

```diff
    contract L2ERC721Bridge (0x4200000000000000000000000000000000000014) {
    +++ description: None
      values.$pastUpgrades:
+        [["2022-10-04T21:36:13.000Z",["0x5a7749f83b81B301cAb5f48EB8516B986DAef23D"]]]
    }
```

```diff
    contract L1Block (0x4200000000000000000000000000000000000015) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-03-14T00:00:01.000Z",["0x07dbe8500fc591d1852B76feE44d5a05e13097Ff"]]]
    }
```

```diff
    contract L2ToL1MessagePasser (0x4200000000000000000000000000000000000016) {
    +++ description: None
      values.$pastUpgrades:
+        []
    }
```

```diff
    contract OptimismMintableERC721Factory (0x4200000000000000000000000000000000000017) {
    +++ description: None
      values.$pastUpgrades:
+        []
    }
```

```diff
    contract L2ProxyAdmin (0x4200000000000000000000000000000000000018) {
    +++ description: None
      values.$pastUpgrades:
+        []
    }
```

```diff
    contract BaseFeeVault (0x4200000000000000000000000000000000000019) {
    +++ description: None
      values.$pastUpgrades:
+        []
    }
```

```diff
    contract L1FeeVault (0x420000000000000000000000000000000000001A) {
    +++ description: None
      values.$pastUpgrades:
+        []
    }
```

```diff
    contract SchemaRegistry (0x4200000000000000000000000000000000000020) {
    +++ description: None
      values.$pastUpgrades:
+        [["2023-07-27T22:05:33.000Z",["0x6232208d66bAc2305b46b4Cb6BCB3857B298DF13"]]]
    }
```

```diff
    contract EAS (0x4200000000000000000000000000000000000021) {
    +++ description: None
      values.$pastUpgrades:
+        [["2023-07-27T22:05:33.000Z",["0x4E0275Ea5a89e7a3c1B58411379D1a0eDdc5b088"]]]
    }
```

```diff
-   Status: DELETED
    contract OldQuixoticNFTBridge (0x5a7749f83b81B301cAb5f48EB8516B986DAef23D)
    +++ description: None
```

Generated with discovered.json: 0xab5b0dad05008fc4ed4f6fe633034f4554e466b5

# Diff at Tue, 01 Oct 2024 10:53:43 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bd754dc73c66120164006054f8d25c5fae9cd910 block: 20826753
- current block number: 20826753

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20826753 (main branch discovery), not current.

```diff
    contract AnchorStateRegistry (0x18DAc71c228D1C32c99489B7323d441E1175e443) {
    +++ description: Contains the latest confirmed state root that can be used as a starting point in a dispute game.
      values.$pastUpgrades:
+        [["2024-05-16T19:17:35.000Z",["0x6B7da1647Aa9684F54B2BEeB699F91F31cd35Fb9"]],["2024-09-11T00:54:59.000Z",["0xd81f43eDBCAcb4c29a9bA38a13Ee5d79278270cC"]],["2024-09-11T00:54:59.000Z",["0x1B5CC028A4276597C607907F24E1AC05d3852cFC"]]]
    }
```

```diff
    contract SystemConfig (0x229047fed2591dbec1eF1118d64F7aF3dB9EB290) {
    +++ description: None
      values.$pastUpgrades:
+        [["2023-06-06T15:58:47.000Z",["0x5efa852e92800D1C982711761e45c3FE39a2b6D8"]],["2024-02-26T21:44:11.000Z",["0xd81f43eDBCAcb4c29a9bA38a13Ee5d79278270cC"]],["2024-02-26T21:44:11.000Z",["0x33A032ec93Ec0C492Ec4BF0B30D5f51986E5a314"]],["2024-04-11T20:49:59.000Z",["0xd81f43eDBCAcb4c29a9bA38a13Ee5d79278270cC"]],["2024-04-11T20:49:59.000Z",["0xba2492e52F45651B60B8B38d4Ea5E2390C64Ffb1"]],["2024-06-10T16:42:59.000Z",["0xd81f43eDBCAcb4c29a9bA38a13Ee5d79278270cC"]],["2024-06-10T16:42:59.000Z",["0xF56D96B2535B932656d3c04Ebf51baBff241D886"]]]
    }
```

```diff
    contract L1CrossDomainMessenger (0x25ace71c97B33Cc4729CF772ae268934F7ab5fA1) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      values.$pastUpgrades:
+        [["2021-06-22T22:29:27.000Z",["0x16393737D09d2722AD13DcA3cA8C3DB957699F1D"]],["2021-06-26T00:52:47.000Z",["0xbfba066b5cA610Fe70AdCE45FcB622F945891bb0"]],["2021-11-11T17:37:56.000Z",["0x0000000000000000000000000000000000000000"]],["2021-11-11T19:29:14.000Z",["0xd9166833FF12A5F900ccfBf2c8B62a90F1Ca1FD5"]],["2023-06-06T15:58:47.000Z",["0x0000000000000000000000000000000000000000"]],["2023-06-06T18:24:11.000Z",["0x2150Bc3c64cbfDDbaC9815EF615D6AB8671bfe43"]],["2024-02-26T21:44:11.000Z",["0xd81f43eDBCAcb4c29a9bA38a13Ee5d79278270cC"]],["2024-02-26T21:44:11.000Z",["0xa95B24af19f8907390eD15f8348A1a5e6Ccbc5C6"]],["2024-04-11T20:49:59.000Z",["0xd81f43eDBCAcb4c29a9bA38a13Ee5d79278270cC"]],["2024-04-11T20:49:59.000Z",["0xD3494713A5cfaD3F5359379DfA074E2Ac8C6Fd65"]]]
      values.$upgradeCount:
+        10
    }
```

```diff
    contract L1ERC721Bridge (0x5a7749f83b81B301cAb5f48EB8516B986DAef23D) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      values.$pastUpgrades:
+        [["2022-10-04T22:08:59.000Z",["0x3268Ed09f76e619331528270B6267D4d2C5Ab5C2"]],["2023-06-06T18:24:11.000Z",["0x3268Ed09f76e619331528270B6267D4d2C5Ab5C2"]],["2024-02-26T21:44:11.000Z",["0xd81f43eDBCAcb4c29a9bA38a13Ee5d79278270cC"]],["2024-02-26T21:44:11.000Z",["0xc599Fa757c2bCaA5aE3753Ab129237F38C10da0b"]],["2024-04-11T20:49:59.000Z",["0xd81f43eDBCAcb4c29a9bA38a13Ee5d79278270cC"]],["2024-04-11T20:49:59.000Z",["0xAE2AF01232a6c4a4d3012C5eC5b1b35059caF10d"]]]
    }
```

```diff
    contract OptimismMintableERC20Factory (0x75505a97BD334E7BD3C476893285569C4136Fa0F) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      values.$pastUpgrades:
+        [["2023-06-06T18:24:11.000Z",["0xaE849EFA4BcFc419593420e14707996936E365E2"]],["2024-02-26T21:44:11.000Z",["0xd81f43eDBCAcb4c29a9bA38a13Ee5d79278270cC"]],["2024-02-26T21:44:11.000Z",["0x74e273220Fa1cB62Fd756FE6CbDA8BBb89404deD"]],["2024-04-11T20:49:59.000Z",["0xd81f43eDBCAcb4c29a9bA38a13Ee5d79278270cC"]],["2024-04-11T20:49:59.000Z",["0xE01efbeb1089D1d1dB9c6c8b135C934C0734c846"]]]
    }
```

```diff
    contract wstETHEscrow (0x76943C0D61395d8F2edF9060e1533529cAe05dE6) {
    +++ description: None
      values.$pastUpgrades:
+        [["2022-08-05T08:23:19.000Z",["0x29C5c51A031165CE62F964966A6399b81165EFA4"]]]
    }
```

```diff
    contract DelayedWETH_PermissionlessGames (0x82511d494B5C942BE57498a70Fdd7184Ee33B975) {
    +++ description: Contract designed to hold the bonded ETH for each game. It is designed as a wrapper around WETH to allow an owner to function as a backstop if a game would incorrectly distribute funds.
      values.$pastUpgrades:
+        [["2024-08-29T23:45:23.000Z",["0x71e966Ae981d1ce531a7b6d23DC0f27B38409087"]]]
    }
```

```diff
    contract SuperchainConfig (0x95703e0982140D16f8ebA6d158FccEde42f04a4C) {
    +++ description: Used to manage global configuration values for multiple OP Chains within a single Superchain network. The SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the Superchain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      values.$pastUpgrades:
+        [["2024-01-22T20:19:59.000Z",["0x53c165169401764778F780a69701385eb0FF19B7"]],["2024-06-10T18:29:23.000Z",["0xd81f43eDBCAcb4c29a9bA38a13Ee5d79278270cC"]],["2024-06-10T18:29:23.000Z",["0x53c165169401764778F780a69701385eb0FF19B7"]]]
    }
```

```diff
    contract L1StandardBridge (0x99C9fc46f92E8a1c0deC1b1747d010903E884bE1) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token.
      values.$pastUpgrades:
+        []
    }
```

```diff
    contract DelayedWETH_PermissionedGames (0x9F9b897e37de5052cD70Db6D08474550DDb07f39) {
    +++ description: Contract designed to hold the bonded ETH for each game. It is designed as a wrapper around WETH to allow an owner to function as a backstop if a game would incorrectly distribute funds.
      values.$pastUpgrades:
+        [["2024-08-29T23:45:35.000Z",["0x71e966Ae981d1ce531a7b6d23DC0f27B38409087"]]]
    }
```

```diff
    contract OptimismPortal (0xbEb5Fc579115071764c7423A4f12eDde41f106Ed) {
    +++ description: None
      values.$pastUpgrades:
+        [["2023-06-06T18:24:11.000Z",["0x28a55488fef40005309e2DA0040DbE9D300a64AB"]],["2024-02-26T21:44:11.000Z",["0xd81f43eDBCAcb4c29a9bA38a13Ee5d79278270cC"]],["2024-02-26T21:44:11.000Z",["0xaBAbe63514dDd6277356F8cc3d6518aA8BDEB4de"]],["2024-04-11T20:49:59.000Z",["0xd81f43eDBCAcb4c29a9bA38a13Ee5d79278270cC"]],["2024-04-11T20:49:59.000Z",["0x2D778797049FE9259d947D1ED8e5442226dFB589"]],["2024-06-10T16:42:59.000Z",["0xd81f43eDBCAcb4c29a9bA38a13Ee5d79278270cC"]],["2024-06-10T16:42:59.000Z",["0xe2F826324b2faf99E513D16D266c3F80aE87832B"]]]
    }
```

```diff
    contract DisputeGameFactory (0xe5965Ab5962eDc7477C8520243A95517CD252fA9) {
    +++ description: The dispute game factory allows the creation of dispute games, used to propose state roots and eventually challenge them.
      values.$pastUpgrades:
+        [["2024-05-16T19:17:35.000Z",["0xc641A33cab81C559F2bd4b21EA34C290E2440C2B"]]]
    }
```

Generated with discovered.json: 0xc97d3bc9db68bf215aa669c14b6ff99153c688cf

# Diff at Wed, 25 Sep 2024 09:34:30 GMT:

- chain: ethereum
- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@e8c4fe6b10f7918ebbd761bc35018ba84053b08c block: 20785025
- current block number: 20826753

## Description

Single signer change in SNX MS (SNX escrow owner).

## Watched changes

```diff
    contract SynthetixMultisig (0xEb3107117FEAd7de89Cd14D463D340A2E6917769) {
    +++ description: None
      values.$members.3:
-        "0x0B67bab43157e53D21965Af0d83f83BeD9553E0a"
+        "0xcC934A54A2Dc516B2bb0CFE2F73bfA9A87F5341f"
    }
```

Generated with discovered.json: 0x225b2dce43e2ef7ecd0848d32f679a6bf29f6f43

# Diff at Thu, 19 Sep 2024 13:46:26 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@c189b6a22dcead98913a50430e61a1c3146ee01e block: 20763674
- current block number: 20785025

## Description

Shape related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20763674 (main branch discovery), not current.

```diff
    contract MIPS (0x16e83cE5Ce29BF90AD9Da06D2fE6a15d5f344ce4) {
    +++ description: The MIPS contract is used to execute the final step of the dispute game which objectively determines the winner of the dispute.
      template:
+        "opstack/MIPS"
      descriptions:
+        ["The MIPS contract is used to execute the final step of the dispute game which objectively determines the winner of the dispute."]
    }
```

```diff
    contract AnchorStateRegistry (0x18DAc71c228D1C32c99489B7323d441E1175e443) {
    +++ description: Contains the latest confirmed state root that can be used as a starting point in a dispute game.
      template:
+        "opstack/AnchorStateRegistry"
      descriptions:
+        ["Contains the latest confirmed state root that can be used as a starting point in a dispute game."]
    }
```

```diff
    contract DelayedWETH_PermissionlessGames (0x82511d494B5C942BE57498a70Fdd7184Ee33B975) {
    +++ description: Contract designed to hold the bonded ETH for each game. It is designed as a wrapper around WETH to allow an owner to function as a backstop if a game would incorrectly distribute funds.
      template:
+        "opstack/DelayedWETH"
      displayName:
+        "DelayedWETH"
      descriptions:
+        ["Contract designed to hold the bonded ETH for each game. It is designed as a wrapper around WETH to allow an owner to function as a backstop if a game would incorrectly distribute funds."]
    }
```

```diff
    contract DelayedWETH_PermissionedGames (0x9F9b897e37de5052cD70Db6D08474550DDb07f39) {
    +++ description: Contract designed to hold the bonded ETH for each game. It is designed as a wrapper around WETH to allow an owner to function as a backstop if a game would incorrectly distribute funds.
      template:
+        "opstack/DelayedWETH"
      displayName:
+        "DelayedWETH"
      descriptions:
+        ["Contract designed to hold the bonded ETH for each game. It is designed as a wrapper around WETH to allow an owner to function as a backstop if a game would incorrectly distribute funds."]
    }
```

```diff
    contract DisputeGameFactory (0xe5965Ab5962eDc7477C8520243A95517CD252fA9) {
    +++ description: The dispute game factory allows the creation of dispute games, used to propose state roots and eventually challenge them.
      template:
+        "opstack/DisputeGameFactory"
      descriptions:
+        ["The dispute game factory allows the creation of dispute games, used to propose state roots and eventually challenge them."]
    }
```

Generated with discovered.json: 0x7dfc191f4a5b27f971132ccfb6e195e1993cbfa5

# Diff at Mon, 16 Sep 2024 14:09:19 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@ca08843b12ed576cbcc139ad58ca045f72d96ab5 block: 20733024
- current block number: 20763674

## Description

Synthetix MS signer changes.

## Watched changes

```diff
    contract SynthetixMultisig (0xEb3107117FEAd7de89Cd14D463D340A2E6917769) {
    +++ description: None
      values.$members.7:
+        "0x562948111d50BF039A39Eea48D127f2Ae51ddF02"
      values.$members.6:
-        "0x562948111d50BF039A39Eea48D127f2Ae51ddF02"
+        "0x347c3190bD015FBD0e47fb90AA4917138A8A32FE"
      values.$members.5:
-        "0x347c3190bD015FBD0e47fb90AA4917138A8A32FE"
+        "0x599e835cbFC903eF09f3Dd5E08D1cF63c32AF8d8"
      values.$members.4:
-        "0x599e835cbFC903eF09f3Dd5E08D1cF63c32AF8d8"
+        "0xe1Efa5C91cA533E4a51884d805879249E3FCB2BC"
      values.$members.3:
-        "0xe1Efa5C91cA533E4a51884d805879249E3FCB2BC"
+        "0x0B67bab43157e53D21965Af0d83f83BeD9553E0a"
      values.$members.2:
-        "0x0B67bab43157e53D21965Af0d83f83BeD9553E0a"
+        "0x26E10fF641839cA457695CE955Cb90657D6E3F53"
      values.$members.1:
-        "0x26E10fF641839cA457695CE955Cb90657D6E3F53"
+        "0x1C8236B406911A376369e33D39189F1b4B39F27D"
      values.$members.0:
-        "0x1C8236B406911A376369e33D39189F1b4B39F27D"
+        "0x148a2c821687686CFBeEbC138534E05797D65984"
      values.multisigThreshold:
-        "4 of 7 (57%)"
+        "4 of 8 (50%)"
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20733024 (main branch discovery), not current.

```diff
    contract DeputyGuardianModule (0xc6901F65369FC59fC1B4D6D6bE7A2318Ff38dB5B) {
    +++ description: allows the 0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A, called the deputy guardian, to act on behalf of the Gnosis Safe.
      template:
+        "gnosisSafeModules/DeputyGuardianModule"
      descriptions:
+        ["allows the 0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A, called the deputy guardian, to act on behalf of the Gnosis Safe."]
    }
```

Generated with discovered.json: 0x817e62a0e7ffde4ad58ef30a93a4fc86eba5a8d8

# Diff at Fri, 13 Sep 2024 08:21:47 GMT:

- chain: ethereum
- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@ce8a1965dd21904fb59b1e31d7ec5862dbdf41ab block: 20733024
- current block number: 20733024

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20733024 (main branch discovery), not current.

```diff
    contract LivenessModule (0x0454092516c9A4d636d3CAfA1e82161376C8a748) {
    +++ description: used to remove members inactive for 98d while making sure that the threshold remains above 75%. If the number of members falls below 8, the 0x847B5c174615B1B7fDF770882256e2D3E95b9D92 takes ownership of the multisig
      descriptions.0:
-        "used to remove members inactive for 8467200 while making sure that the threshold remains above 75%. If the number of members falls below 8, the 0x847B5c174615B1B7fDF770882256e2D3E95b9D92 takes ownership of the multisig"
+        "used to remove members inactive for 98d while making sure that the threshold remains above 75%. If the number of members falls below 8, the 0x847B5c174615B1B7fDF770882256e2D3E95b9D92 takes ownership of the multisig"
      values.livenessInterval:
-        8467200
+        "98d"
    }
```

```diff
    contract L1CrossDomainMessenger (0x25ace71c97B33Cc4729CF772ae268934F7ab5fA1) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      categories:
+        ["Core"]
    }
```

```diff
    contract SuperchainProxyAdmin (0x543bA4AADBAb8f9025686Bd03993043599c6fB04) {
    +++ description: None
      directlyReceivedPermissions.10:
+        {"permission":"upgrade","target":"0xe5965Ab5962eDc7477C8520243A95517CD252fA9"}
      directlyReceivedPermissions.9.target:
-        "0xe5965Ab5962eDc7477C8520243A95517CD252fA9"
+        "0xbEb5Fc579115071764c7423A4f12eDde41f106Ed"
      directlyReceivedPermissions.8.target:
-        "0xbEb5Fc579115071764c7423A4f12eDde41f106Ed"
+        "0x9F9b897e37de5052cD70Db6D08474550DDb07f39"
      directlyReceivedPermissions.7.target:
-        "0x9F9b897e37de5052cD70Db6D08474550DDb07f39"
+        "0x99C9fc46f92E8a1c0deC1b1747d010903E884bE1"
      directlyReceivedPermissions.7.description:
+        "upgrading bridge implementation allows to access all funds and change every system component."
      directlyReceivedPermissions.6.target:
-        "0x99C9fc46f92E8a1c0deC1b1747d010903E884bE1"
+        "0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
      directlyReceivedPermissions.5.target:
-        "0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
+        "0x82511d494B5C942BE57498a70Fdd7184Ee33B975"
      directlyReceivedPermissions.4.target:
-        "0x82511d494B5C942BE57498a70Fdd7184Ee33B975"
+        "0x75505a97BD334E7BD3C476893285569C4136Fa0F"
      directlyReceivedPermissions.3.target:
-        "0x75505a97BD334E7BD3C476893285569C4136Fa0F"
+        "0x5a7749f83b81B301cAb5f48EB8516B986DAef23D"
      directlyReceivedPermissions.2.target:
-        "0x5a7749f83b81B301cAb5f48EB8516B986DAef23D"
+        "0x229047fed2591dbec1eF1118d64F7aF3dB9EB290"
      directlyReceivedPermissions.1.target:
-        "0x229047fed2591dbec1eF1118d64F7aF3dB9EB290"
+        "0x18DAc71c228D1C32c99489B7323d441E1175e443"
      directlyReceivedPermissions.0.permission:
-        "upgrade"
+        "configure"
      directlyReceivedPermissions.0.target:
-        "0x18DAc71c228D1C32c99489B7323d441E1175e443"
+        "0xdE1FCfB0851916CA5101820A69b13a4E276bd81F"
    }
```

```diff
    contract SuperchainProxyAdminOwner (0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A) {
    +++ description: None
      receivedPermissions.10:
+        {"permission":"upgrade","target":"0xe5965Ab5962eDc7477C8520243A95517CD252fA9","via":[{"address":"0x543bA4AADBAb8f9025686Bd03993043599c6fB04"}]}
      receivedPermissions.9.target:
-        "0xe5965Ab5962eDc7477C8520243A95517CD252fA9"
+        "0xbEb5Fc579115071764c7423A4f12eDde41f106Ed"
      receivedPermissions.8.target:
-        "0xbEb5Fc579115071764c7423A4f12eDde41f106Ed"
+        "0x9F9b897e37de5052cD70Db6D08474550DDb07f39"
      receivedPermissions.7.target:
-        "0x9F9b897e37de5052cD70Db6D08474550DDb07f39"
+        "0x99C9fc46f92E8a1c0deC1b1747d010903E884bE1"
      receivedPermissions.7.description:
+        "upgrading bridge implementation allows to access all funds and change every system component."
      receivedPermissions.6.target:
-        "0x99C9fc46f92E8a1c0deC1b1747d010903E884bE1"
+        "0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
      receivedPermissions.5.target:
-        "0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
+        "0x82511d494B5C942BE57498a70Fdd7184Ee33B975"
      receivedPermissions.4.target:
-        "0x82511d494B5C942BE57498a70Fdd7184Ee33B975"
+        "0x75505a97BD334E7BD3C476893285569C4136Fa0F"
      receivedPermissions.3.target:
-        "0x75505a97BD334E7BD3C476893285569C4136Fa0F"
+        "0x5a7749f83b81B301cAb5f48EB8516B986DAef23D"
      receivedPermissions.2.target:
-        "0x5a7749f83b81B301cAb5f48EB8516B986DAef23D"
+        "0x229047fed2591dbec1eF1118d64F7aF3dB9EB290"
      receivedPermissions.1.target:
-        "0x229047fed2591dbec1eF1118d64F7aF3dB9EB290"
+        "0x18DAc71c228D1C32c99489B7323d441E1175e443"
      receivedPermissions.0.permission:
-        "upgrade"
+        "configure"
      receivedPermissions.0.target:
-        "0x18DAc71c228D1C32c99489B7323d441E1175e443"
+        "0xdE1FCfB0851916CA5101820A69b13a4E276bd81F"
    }
```

```diff
    contract SuperchainConfig (0x95703e0982140D16f8ebA6d158FccEde42f04a4C) {
    +++ description: Used to manage global configuration values for multiple OP Chains within a single Superchain network. The SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the Superchain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      categories:
+        ["Upgrades&Governance"]
    }
```

```diff
    contract L1StandardBridge (0x99C9fc46f92E8a1c0deC1b1747d010903E884bE1) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token.
      issuedPermissions.0.via.0.description:
+        "upgrading bridge implementation allows to access all funds and change every system component."
    }
```

```diff
    contract AddressManager (0xdE1FCfB0851916CA5101820A69b13a4E276bd81F) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"configure","target":"0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A","via":[{"address":"0x543bA4AADBAb8f9025686Bd03993043599c6fB04","delay":0}]}]
    }
```

Generated with discovered.json: 0xd15cdc9ed08ac4b205c0166d7378930683f40b27

# Diff at Thu, 12 Sep 2024 09:45:48 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@127adf09837b5e1f2ac0ecd582a2ef874e97633f block: 20733024
- current block number: 20733024

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20733024 (main branch discovery), not current.

```diff
    contract L1CrossDomainMessenger (0x25ace71c97B33Cc4729CF772ae268934F7ab5fA1) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      categories:
-        ["Core"]
      values.OTHER_MESSENGER:
-        "0x4200000000000000000000000000000000000007"
+        "optimism:0x4200000000000000000000000000000000000007"
      values.otherMessenger:
-        "0x4200000000000000000000000000000000000007"
+        "optimism:0x4200000000000000000000000000000000000007"
      usedTypes:
+        [{"typeCaster":"ChainPrefix","arg":{"prefix":"optimism"}}]
    }
```

```diff
    contract SuperchainProxyAdmin (0x543bA4AADBAb8f9025686Bd03993043599c6fB04) {
    +++ description: None
      directlyReceivedPermissions.6.description:
-        "upgrading bridge implementation allows to access all funds and change every system component."
    }
```

```diff
    contract SuperchainProxyAdminOwner (0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A) {
    +++ description: None
      receivedPermissions.6.description:
-        "upgrading bridge implementation allows to access all funds and change every system component."
    }
```

```diff
    contract L1ERC721Bridge (0x5a7749f83b81B301cAb5f48EB8516B986DAef23D) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      values.OTHER_BRIDGE:
-        "0x4200000000000000000000000000000000000014"
+        "optimism:0x4200000000000000000000000000000000000014"
      values.otherBridge:
-        "0x4200000000000000000000000000000000000014"
+        "optimism:0x4200000000000000000000000000000000000014"
      usedTypes:
+        [{"typeCaster":"ChainPrefix","arg":{"prefix":"optimism"}}]
    }
```

```diff
    contract SuperchainConfig (0x95703e0982140D16f8ebA6d158FccEde42f04a4C) {
    +++ description: Used to manage global configuration values for multiple OP Chains within a single Superchain network. The SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the Superchain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      categories:
-        ["Upgrades&Governance"]
    }
```

```diff
    contract L1StandardBridge (0x99C9fc46f92E8a1c0deC1b1747d010903E884bE1) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token.
      issuedPermissions.0.via.0.description:
-        "upgrading bridge implementation allows to access all funds and change every system component."
      values.l2TokenBridge:
-        "0x4200000000000000000000000000000000000010"
+        "optimism:0x4200000000000000000000000000000000000010"
      values.OTHER_BRIDGE:
-        "0x4200000000000000000000000000000000000010"
+        "optimism:0x4200000000000000000000000000000000000010"
      values.otherBridge:
-        "0x4200000000000000000000000000000000000010"
+        "optimism:0x4200000000000000000000000000000000000010"
      usedTypes:
+        [{"typeCaster":"ChainPrefix","arg":{"prefix":"optimism"}}]
    }
```

Generated with discovered.json: 0x88253ac8f615733403c9bb9634aa0acb33cf7ea7

# Diff at Thu, 12 Sep 2024 07:25:21 GMT:

- chain: ethereum
- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@21748f79216eb050ed17a98d0e8a74893f478f74 block: 20726488
- current block number: 20733024

## Description

Upgrade 10 part 2. Reactivates proof system and adds ability for guardian module to set anchor state.

## Watched changes

```diff
    contract GuardianMultisig (0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2) {
    +++ description: None
      values.GnosisSafe_modules.0:
-        "0x5dC91D01290af474CE21DE14c17335a6dEe4d2a8"
+        "0xc6901F65369FC59fC1B4D6D6bE7A2318Ff38dB5B"
    }
```

```diff
-   Status: DELETED
    contract DeputyGuardianModule (0x5dC91D01290af474CE21DE14c17335a6dEe4d2a8)
    +++ description: allows the 0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A, called the deputy guardian, to act on behalf of the Gnosis Safe.
```

```diff
    contract OptimismPortal (0xbEb5Fc579115071764c7423A4f12eDde41f106Ed) {
    +++ description: None
      values.respectedGameType:
-        1
+        0
      values.respectedGameTypeUpdatedAt:
-        1723833359
+        1726070915
    }
```

```diff
    contract DisputeGameFactory (0xe5965Ab5962eDc7477C8520243A95517CD252fA9) {
    +++ description: None
      values.permissionedGamesTotal:
-        610
+        617
    }
```

```diff
+   Status: CREATED
    contract DeputyGuardianModule (0xc6901F65369FC59fC1B4D6D6bE7A2318Ff38dB5B)
    +++ description: None
```

## Source code changes

```diff
.../DeputyGuardianModule.sol                         | 20 ++++++++++++++++++--
 1 file changed, 18 insertions(+), 2 deletions(-)
```

Generated with discovered.json: 0xebfb460cbb05426a3ff6f709f74aeef8b015a1b7

# Diff at Wed, 11 Sep 2024 09:31:05 GMT:

- chain: ethereum
- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@c6a3ea686769a7280772f1677e2ce572e1723dab block: 20691253
- current block number: 20726488

## Description

Upgrade #10: https://gov.optimism.io/t/upgrade-proposal-10-granite-network-upgrade/8733

It fixes some bugs and adds the ability to the anchor state registry to be set by the guardian.

## Watched changes

```diff
-   Status: DELETED
    contract MIPS (0x0f8EdFbDdD3c0256A80AD8C0F2560B1807873C9c)
    +++ description: None
```

```diff
    contract AnchorStateRegistry (0x18DAc71c228D1C32c99489B7323d441E1175e443) {
    +++ description: None
      values.$implementation:
-        "0x6B7da1647Aa9684F54B2BEeB699F91F31cd35Fb9"
+        "0x1B5CC028A4276597C607907F24E1AC05d3852cFC"
      values.$upgradeCount:
-        1
+        3
      values.version:
-        "1.0.0"
+        "2.0.0"
      values.superchainConfig:
+        "0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
    }
```

```diff
    contract SuperchainProxyAdmin (0x543bA4AADBAb8f9025686Bd03993043599c6fB04) {
    +++ description: None
      directlyReceivedPermissions.9:
+        {"permission":"upgrade","target":"0xe5965Ab5962eDc7477C8520243A95517CD252fA9"}
      directlyReceivedPermissions.8.target:
-        "0xe5965Ab5962eDc7477C8520243A95517CD252fA9"
+        "0xbEb5Fc579115071764c7423A4f12eDde41f106Ed"
      directlyReceivedPermissions.7.target:
-        "0xE497B094d6DbB3D5E4CaAc9a14696D7572588d14"
+        "0x9F9b897e37de5052cD70Db6D08474550DDb07f39"
      directlyReceivedPermissions.6.target:
-        "0xbEb5Fc579115071764c7423A4f12eDde41f106Ed"
+        "0x99C9fc46f92E8a1c0deC1b1747d010903E884bE1"
      directlyReceivedPermissions.6.description:
+        "upgrading bridge implementation allows to access all funds and change every system component."
      directlyReceivedPermissions.5.target:
-        "0x99C9fc46f92E8a1c0deC1b1747d010903E884bE1"
+        "0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
      directlyReceivedPermissions.5.description:
-        "upgrading bridge implementation allows to access all funds and change every system component."
      directlyReceivedPermissions.4.target:
-        "0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
+        "0x82511d494B5C942BE57498a70Fdd7184Ee33B975"
    }
```

```diff
    contract SuperchainProxyAdminOwner (0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A) {
    +++ description: None
      receivedPermissions.9:
+        {"permission":"upgrade","target":"0xe5965Ab5962eDc7477C8520243A95517CD252fA9","via":[{"address":"0x543bA4AADBAb8f9025686Bd03993043599c6fB04"}]}
      receivedPermissions.8.target:
-        "0xe5965Ab5962eDc7477C8520243A95517CD252fA9"
+        "0xbEb5Fc579115071764c7423A4f12eDde41f106Ed"
      receivedPermissions.7.target:
-        "0xE497B094d6DbB3D5E4CaAc9a14696D7572588d14"
+        "0x9F9b897e37de5052cD70Db6D08474550DDb07f39"
      receivedPermissions.6.target:
-        "0xbEb5Fc579115071764c7423A4f12eDde41f106Ed"
+        "0x99C9fc46f92E8a1c0deC1b1747d010903E884bE1"
      receivedPermissions.6.description:
+        "upgrading bridge implementation allows to access all funds and change every system component."
      receivedPermissions.5.target:
-        "0x99C9fc46f92E8a1c0deC1b1747d010903E884bE1"
+        "0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
      receivedPermissions.5.description:
-        "upgrading bridge implementation allows to access all funds and change every system component."
      receivedPermissions.4.target:
-        "0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
+        "0x82511d494B5C942BE57498a70Fdd7184Ee33B975"
    }
```

```diff
-   Status: DELETED
    contract PermissionedDisputeGame (0xc307e93a7C530a184c98EaDe4545a412b857b62f)
    +++ description: None
```

```diff
-   Status: DELETED
    contract PreimageOracle (0xD326E10B8186e90F4E2adc5c13a2d0C137ee8b34)
    +++ description: None
```

```diff
-   Status: DELETED
    contract DelayedWETH (0xE497B094d6DbB3D5E4CaAc9a14696D7572588d14)
    +++ description: None
```

```diff
    contract DisputeGameFactory (0xe5965Ab5962eDc7477C8520243A95517CD252fA9) {
    +++ description: None
      values.gameImpls.1:
-        "0xc307e93a7C530a184c98EaDe4545a412b857b62f"
+        "0x050ed6F6273c7D836a111E42153BC00D0380b87d"
      values.gameImpls.0:
-        "0xf691F8A6d908B58C534B624cF16495b491E633BA"
+        "0xA6f3DFdbf4855a43c529bc42EDE96797252879af"
      values.permissionedGamesTotal:
-        493
+        610
    }
```

```diff
-   Status: DELETED
    contract FaultDisputeGame (0xf691F8A6d908B58C534B624cF16495b491E633BA)
    +++ description: None
```

```diff
+   Status: CREATED
    contract PermissionedDisputeGame (0x050ed6F6273c7D836a111E42153BC00D0380b87d)
    +++ description: None
```

```diff
+   Status: CREATED
    contract MIPS (0x16e83cE5Ce29BF90AD9Da06D2fE6a15d5f344ce4)
    +++ description: None
```

```diff
+   Status: CREATED
    contract DelayedWETH_PermissionlessGames (0x82511d494B5C942BE57498a70Fdd7184Ee33B975)
    +++ description: None
```

```diff
+   Status: CREATED
    contract PreimageOracle (0x9c065e11870B891D214Bc2Da7EF1f9DDFA1BE277)
    +++ description: None
```

```diff
+   Status: CREATED
    contract DelayedWETH_PermissionedGames (0x9F9b897e37de5052cD70Db6D08474550DDb07f39)
    +++ description: None
```

```diff
+   Status: CREATED
    contract FaultDisputeGame (0xA6f3DFdbf4855a43c529bc42EDE96797252879af)
    +++ description: None
```

## Source code changes

```diff
.../AnchorStateRegistry/AnchorStateRegistry.sol    |   53 +-
 .../DelayedWETH_PermissionedGames}/DelayedWETH.sol |    9 +-
 .../DelayedWETH_PermissionedGames}/Proxy.p.sol     |    0
 .../DelayedWETH.sol                                |  651 ++++++
 .../DelayedWETH_PermissionlessGames/Proxy.p.sol    |  200 ++
 .../{.flat@20691253 => .flat}/FaultDisputeGame.sol |  292 ++-
 .../ethereum/{.flat@20691253 => .flat}/MIPS.sol    | 2201 ++++++++++++--------
 .../PermissionedDisputeGame.sol                    |  292 ++-
 .../{.flat@20691253 => .flat}/PreimageOracle.sol   |   67 +-
 9 files changed, 2811 insertions(+), 954 deletions(-)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20691253 (main branch discovery), not current.

```diff
    contract AnchorStateRegistry (0x18DAc71c228D1C32c99489B7323d441E1175e443) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x543bA4AADBAb8f9025686Bd03993043599c6fB04"
+        "0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A"
      issuedPermissions.0.via.0:
+        {"address":"0x543bA4AADBAb8f9025686Bd03993043599c6fB04","delay":0}
    }
```

```diff
    contract SystemConfig (0x229047fed2591dbec1eF1118d64F7aF3dB9EB290) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x543bA4AADBAb8f9025686Bd03993043599c6fB04"
+        "0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A"
      issuedPermissions.0.via.0:
+        {"address":"0x543bA4AADBAb8f9025686Bd03993043599c6fB04","delay":0}
    }
```

```diff
    contract SuperchainProxyAdmin (0x543bA4AADBAb8f9025686Bd03993043599c6fB04) {
    +++ description: None
      descriptions:
-        ["It can upgrade the bridge implementation potentially gaining access to all funds, and change any system component."]
      issuedPermissions:
-        [{"permission":"configure","target":"0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A","via":[]}]
      receivedPermissions:
-        [{"permission":"upgrade","target":"0x18DAc71c228D1C32c99489B7323d441E1175e443"},{"permission":"upgrade","target":"0x229047fed2591dbec1eF1118d64F7aF3dB9EB290"},{"permission":"upgrade","target":"0x5a7749f83b81B301cAb5f48EB8516B986DAef23D"},{"permission":"upgrade","target":"0x75505a97BD334E7BD3C476893285569C4136Fa0F"},{"permission":"upgrade","target":"0x95703e0982140D16f8ebA6d158FccEde42f04a4C"},{"permission":"upgrade","target":"0x99C9fc46f92E8a1c0deC1b1747d010903E884bE1"},{"permission":"upgrade","target":"0xbEb5Fc579115071764c7423A4f12eDde41f106Ed"},{"permission":"upgrade","target":"0xE497B094d6DbB3D5E4CaAc9a14696D7572588d14"},{"permission":"upgrade","target":"0xe5965Ab5962eDc7477C8520243A95517CD252fA9"}]
      directlyReceivedPermissions:
+        [{"permission":"upgrade","target":"0x18DAc71c228D1C32c99489B7323d441E1175e443"},{"permission":"upgrade","target":"0x229047fed2591dbec1eF1118d64F7aF3dB9EB290"},{"permission":"upgrade","target":"0x5a7749f83b81B301cAb5f48EB8516B986DAef23D"},{"permission":"upgrade","target":"0x75505a97BD334E7BD3C476893285569C4136Fa0F"},{"permission":"upgrade","target":"0x95703e0982140D16f8ebA6d158FccEde42f04a4C"},{"permission":"upgrade","target":"0x99C9fc46f92E8a1c0deC1b1747d010903E884bE1","description":"upgrading bridge implementation allows to access all funds and change every system component."},{"permission":"upgrade","target":"0xbEb5Fc579115071764c7423A4f12eDde41f106Ed"},{"permission":"upgrade","target":"0xE497B094d6DbB3D5E4CaAc9a14696D7572588d14"},{"permission":"upgrade","target":"0xe5965Ab5962eDc7477C8520243A95517CD252fA9"}]
    }
```

```diff
    contract SuperchainProxyAdminOwner (0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A) {
    +++ description: None
      descriptions:
-        ["It can act on behalf of 0x543bA4AADBAb8f9025686Bd03993043599c6fB04, inheriting its permissions."]
      receivedPermissions.8:
+        {"permission":"upgrade","target":"0xe5965Ab5962eDc7477C8520243A95517CD252fA9","via":[{"address":"0x543bA4AADBAb8f9025686Bd03993043599c6fB04"}]}
      receivedPermissions.7:
+        {"permission":"upgrade","target":"0xE497B094d6DbB3D5E4CaAc9a14696D7572588d14","via":[{"address":"0x543bA4AADBAb8f9025686Bd03993043599c6fB04"}]}
      receivedPermissions.6:
+        {"permission":"upgrade","target":"0xbEb5Fc579115071764c7423A4f12eDde41f106Ed","via":[{"address":"0x543bA4AADBAb8f9025686Bd03993043599c6fB04"}]}
      receivedPermissions.5:
+        {"permission":"upgrade","target":"0x99C9fc46f92E8a1c0deC1b1747d010903E884bE1","description":"upgrading bridge implementation allows to access all funds and change every system component.","via":[{"address":"0x543bA4AADBAb8f9025686Bd03993043599c6fB04"}]}
      receivedPermissions.4:
+        {"permission":"upgrade","target":"0x95703e0982140D16f8ebA6d158FccEde42f04a4C","via":[{"address":"0x543bA4AADBAb8f9025686Bd03993043599c6fB04"}]}
      receivedPermissions.3:
+        {"permission":"upgrade","target":"0x75505a97BD334E7BD3C476893285569C4136Fa0F","via":[{"address":"0x543bA4AADBAb8f9025686Bd03993043599c6fB04"}]}
      receivedPermissions.2:
+        {"permission":"upgrade","target":"0x5a7749f83b81B301cAb5f48EB8516B986DAef23D","via":[{"address":"0x543bA4AADBAb8f9025686Bd03993043599c6fB04"}]}
      receivedPermissions.1:
+        {"permission":"upgrade","target":"0x229047fed2591dbec1eF1118d64F7aF3dB9EB290","via":[{"address":"0x543bA4AADBAb8f9025686Bd03993043599c6fB04"}]}
      receivedPermissions.0.permission:
-        "configure"
+        "upgrade"
      receivedPermissions.0.target:
-        "0x543bA4AADBAb8f9025686Bd03993043599c6fB04"
+        "0x18DAc71c228D1C32c99489B7323d441E1175e443"
      receivedPermissions.0.via:
+        [{"address":"0x543bA4AADBAb8f9025686Bd03993043599c6fB04"}]
      directlyReceivedPermissions:
+        [{"permission":"act","target":"0x543bA4AADBAb8f9025686Bd03993043599c6fB04"}]
    }
```

```diff
    contract L1ERC721Bridge (0x5a7749f83b81B301cAb5f48EB8516B986DAef23D) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      issuedPermissions.0.target:
-        "0x543bA4AADBAb8f9025686Bd03993043599c6fB04"
+        "0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A"
      issuedPermissions.0.via.0:
+        {"address":"0x543bA4AADBAb8f9025686Bd03993043599c6fB04","delay":0}
    }
```

```diff
    contract DeputyGuardianModule (0x5dC91D01290af474CE21DE14c17335a6dEe4d2a8) {
    +++ description: allows the 0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A, called the deputy guardian, to act on behalf of the Gnosis Safe.
      descriptions.0:
-        "allows the 0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A (the deputy guardian) to act on behalf of the Gnosis Safe."
+        "allows the 0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A, called the deputy guardian, to act on behalf of the Gnosis Safe."
    }
```

```diff
-   Status: DELETED
    contract CanonicalTransactionChain (0x5E4e65926BA27467555EB562121fac00D24E9dD2)
    +++ description: None
```

```diff
    contract OptimismMintableERC20Factory (0x75505a97BD334E7BD3C476893285569C4136Fa0F) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      issuedPermissions.0.target:
-        "0x543bA4AADBAb8f9025686Bd03993043599c6fB04"
+        "0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A"
      issuedPermissions.0.via.0:
+        {"address":"0x543bA4AADBAb8f9025686Bd03993043599c6fB04","delay":0}
    }
```

```diff
-   Status: DELETED
    contract SCCStorageContainerBatches_OLD (0x77eBfdFcC906DDcDa0C42B866f26A8D5A2bb0572)
    +++ description: None
```

```diff
    contract SuperchainConfig (0x95703e0982140D16f8ebA6d158FccEde42f04a4C) {
    +++ description: Used to manage global configuration values for multiple OP Chains within a single Superchain network. The SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the Superchain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      issuedPermissions.0.target:
-        "0x543bA4AADBAb8f9025686Bd03993043599c6fB04"
+        "0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A"
      issuedPermissions.0.via.0:
+        {"address":"0x543bA4AADBAb8f9025686Bd03993043599c6fB04","delay":0}
    }
```

```diff
    contract L1StandardBridge (0x99C9fc46f92E8a1c0deC1b1747d010903E884bE1) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token.
      issuedPermissions.0.target:
-        "0x543bA4AADBAb8f9025686Bd03993043599c6fB04"
+        "0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A"
      issuedPermissions.0.via.0:
+        {"address":"0x543bA4AADBAb8f9025686Bd03993043599c6fB04","delay":0,"description":"upgrading bridge implementation allows to access all funds and change every system component."}
    }
```

```diff
    contract FoundationMultisig_2 (0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A) {
    +++ description: None
      descriptions:
-        ["Deputy Guardian of 0x5dC91D01290af474CE21DE14c17335a6dEe4d2a8. It can act on behalf of the 0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2."]
    }
```

```diff
-   Status: DELETED
    contract SCCStorageContainerBatches (0xb0ddFf09c4019e31960de11bD845E836078E8EbE)
    +++ description: None
```

```diff
-   Status: DELETED
    contract StateCommitmentChain (0xBe5dAb4A2e9cd0F27300dB4aB94BeE3A233AEB19)
    +++ description: None
```

```diff
    contract OptimismPortal (0xbEb5Fc579115071764c7423A4f12eDde41f106Ed) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x543bA4AADBAb8f9025686Bd03993043599c6fB04"
+        "0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A"
      issuedPermissions.0.via.0:
+        {"address":"0x543bA4AADBAb8f9025686Bd03993043599c6fB04","delay":0}
    }
```

```diff
    contract PermissionedDisputeGame (0xc307e93a7C530a184c98EaDe4545a412b857b62f) {
    +++ description: None
      values.getNumToResolve:
+        [0,0,0,0,0]
      values.resolutionCheckpoints:
+        [[false,0,0,"0x0000000000000000000000000000000000000000"],[false,0,0,"0x0000000000000000000000000000000000000000"],[false,0,0,"0x0000000000000000000000000000000000000000"],[false,0,0,"0x0000000000000000000000000000000000000000"],[false,0,0,"0x0000000000000000000000000000000000000000"]]
      values.resolvedSubgames:
+        [false,false,false,false,false]
      errors:
+        {"getNumToResolve":"Too many values. Update configuration to explore fully","resolutionCheckpoints":"Too many values. Update configuration to explore fully","resolvedSubgames":"Too many values. Update configuration to explore fully"}
    }
```

```diff
-   Status: DELETED
    contract CTCStorageContainerBatches (0xD16463EF9b0338CE3D73309028ef1714D220c024)
    +++ description: None
```

```diff
    contract PreimageOracle (0xD326E10B8186e90F4E2adc5c13a2d0C137ee8b34) {
    +++ description: None
      values.zeroHashes:
+        ["0x0000000000000000000000000000000000000000000000000000000000000000","0xad3228b676f7d3cd4284a5443f17f1962b36e491b30a40b2405849e597ba5fb5","0xb4c11951957c6f8f642c4af61cd6b24640fec6dc7fc607ee8206a99e92410d30","0x21ddb9a356815c3fac1026b6dec5df3124afbadb485c9ba5a3e3398a04b7ba85","0xe58769b32a1beaf1ea27375a44095a0d1fb664ce2dd358e7fcbfb78c26a19344"]
      errors:
+        {"zeroHashes":"Too many values. Update configuration to explore fully"}
    }
```

```diff
    contract AddressManager (0xdE1FCfB0851916CA5101820A69b13a4E276bd81F) {
    +++ description: None
      values.BondManager:
-        "0x0000000000000000000000000000000000000000"
      values.OVM_BondManager:
-        "0x0000000000000000000000000000000000000000"
      values.OVM_CanonicalTransactionChain:
-        "0x0000000000000000000000000000000000000000"
      values.OVM_ChainStorageContainer_CTC_batches:
-        "0x0000000000000000000000000000000000000000"
      values.OVM_ChainStorageContainer_CTC_queue:
-        "0x0000000000000000000000000000000000000000"
      values.OVM_ChainStorageContainer_SCC_batches:
-        "0x77eBfdFcC906DDcDa0C42B866f26A8D5A2bb0572"
      values.OVM_DecompressionPrecompileAddress:
-        "0x0000000000000000000000000000000000000000"
      values.OVM_ExecutionManager:
-        "0x0000000000000000000000000000000000000000"
      values.OVM_FraudVerifier:
-        "0x0000000000000000000000000000000000000000"
      values.OVM_L1MultiMessageRelayer:
-        "0x0000000000000000000000000000000000000000"
      values.OVM_L2CrossDomainMessenger:
-        "0x0000000000000000000000000000000000000000"
      values.OVM_Proposer:
-        "0x0000000000000000000000000000000000000000"
      values.OVM_SafetyChecker:
-        "0x0000000000000000000000000000000000000000"
      values.OVM_Sequencer:
-        "0x0000000000000000000000000000000000000000"
      values.OVM_StateCommitmentChain:
-        "0x0000000000000000000000000000000000000000"
      values.OVM_StateManagerFactory:
-        "0x0000000000000000000000000000000000000000"
      values.OVM_StateTransitionerFactory:
-        "0x0000000000000000000000000000000000000000"
    }
```

```diff
    contract DelayedWETH (0xE497B094d6DbB3D5E4CaAc9a14696D7572588d14) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x543bA4AADBAb8f9025686Bd03993043599c6fB04"
+        "0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A"
      issuedPermissions.0.via.0:
+        {"address":"0x543bA4AADBAb8f9025686Bd03993043599c6fB04","delay":0}
    }
```

```diff
    contract DisputeGameFactory (0xe5965Ab5962eDc7477C8520243A95517CD252fA9) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x543bA4AADBAb8f9025686Bd03993043599c6fB04"
+        "0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A"
      issuedPermissions.0.via.0:
+        {"address":"0x543bA4AADBAb8f9025686Bd03993043599c6fB04","delay":0}
    }
```

```diff
    contract FaultDisputeGame (0xf691F8A6d908B58C534B624cF16495b491E633BA) {
    +++ description: None
      values.getNumToResolve:
+        [0,0,0,0,0]
      values.resolutionCheckpoints:
+        [[false,0,0,"0x0000000000000000000000000000000000000000"],[false,0,0,"0x0000000000000000000000000000000000000000"],[false,0,0,"0x0000000000000000000000000000000000000000"],[false,0,0,"0x0000000000000000000000000000000000000000"],[false,0,0,"0x0000000000000000000000000000000000000000"]]
      values.resolvedSubgames:
+        [false,false,false,false,false]
      errors:
+        {"getNumToResolve":"Too many values. Update configuration to explore fully","resolutionCheckpoints":"Too many values. Update configuration to explore fully","resolvedSubgames":"Too many values. Update configuration to explore fully"}
    }
```

Generated with discovered.json: 0xde56736763a79673334ff3f954cd27f22d15ce8c

# Diff at Sun, 08 Sep 2024 17:20:14 GMT:

- chain: optimism
- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@fd881462cca0d7ef4519f907f3c6cfd5fe1cde8f block: 122593187
- current block number: 122593187

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 122593187 (main branch discovery), not current.

```diff
    contract DeployerWhitelist (0x4200000000000000000000000000000000000002) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x4200000000000000000000000000000000000018"
+        "0x6B1BAE59D09fCcbdDB6C6cceb07B7279367C4E3b"
      issuedPermissions.0.via.0:
+        {"address":"0x4200000000000000000000000000000000000018","delay":0}
    }
```

```diff
    contract L2CrossDomainMessenger (0x4200000000000000000000000000000000000007) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x4200000000000000000000000000000000000018"
+        "0x6B1BAE59D09fCcbdDB6C6cceb07B7279367C4E3b"
      issuedPermissions.0.via.0:
+        {"address":"0x4200000000000000000000000000000000000018","delay":0}
    }
```

```diff
    contract GasPriceOracle (0x420000000000000000000000000000000000000F) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x4200000000000000000000000000000000000018"
+        "0x6B1BAE59D09fCcbdDB6C6cceb07B7279367C4E3b"
      issuedPermissions.0.via.0:
+        {"address":"0x4200000000000000000000000000000000000018","delay":0}
    }
```

```diff
    contract L2StandardBridge (0x4200000000000000000000000000000000000010) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x4200000000000000000000000000000000000018"
+        "0x6B1BAE59D09fCcbdDB6C6cceb07B7279367C4E3b"
      issuedPermissions.0.via.0:
+        {"address":"0x4200000000000000000000000000000000000018","delay":0}
    }
```

```diff
    contract SequencerFeeVault (0x4200000000000000000000000000000000000011) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x4200000000000000000000000000000000000018"
+        "0x6B1BAE59D09fCcbdDB6C6cceb07B7279367C4E3b"
      issuedPermissions.0.via.0:
+        {"address":"0x4200000000000000000000000000000000000018","delay":0}
    }
```

```diff
    contract OptimismMintableERC20Factory (0x4200000000000000000000000000000000000012) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x4200000000000000000000000000000000000018"
+        "0x6B1BAE59D09fCcbdDB6C6cceb07B7279367C4E3b"
      issuedPermissions.0.via.0:
+        {"address":"0x4200000000000000000000000000000000000018","delay":0}
    }
```

```diff
    contract L1BlockNumber (0x4200000000000000000000000000000000000013) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x4200000000000000000000000000000000000018"
+        "0x6B1BAE59D09fCcbdDB6C6cceb07B7279367C4E3b"
      issuedPermissions.0.via.0:
+        {"address":"0x4200000000000000000000000000000000000018","delay":0}
    }
```

```diff
    contract L2ERC721Bridge (0x4200000000000000000000000000000000000014) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x4200000000000000000000000000000000000018"
+        "0x6B1BAE59D09fCcbdDB6C6cceb07B7279367C4E3b"
      issuedPermissions.0.via.0:
+        {"address":"0x4200000000000000000000000000000000000018","delay":0}
    }
```

```diff
    contract L1Block (0x4200000000000000000000000000000000000015) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x4200000000000000000000000000000000000018"
+        "0x6B1BAE59D09fCcbdDB6C6cceb07B7279367C4E3b"
      issuedPermissions.0.via.0:
+        {"address":"0x4200000000000000000000000000000000000018","delay":0}
    }
```

```diff
    contract L2ToL1MessagePasser (0x4200000000000000000000000000000000000016) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x4200000000000000000000000000000000000018"
+        "0x6B1BAE59D09fCcbdDB6C6cceb07B7279367C4E3b"
      issuedPermissions.0.via.0:
+        {"address":"0x4200000000000000000000000000000000000018","delay":0}
    }
```

```diff
    contract OptimismMintableERC721Factory (0x4200000000000000000000000000000000000017) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x4200000000000000000000000000000000000018"
+        "0x6B1BAE59D09fCcbdDB6C6cceb07B7279367C4E3b"
      issuedPermissions.0.via.0:
+        {"address":"0x4200000000000000000000000000000000000018","delay":0}
    }
```

```diff
    contract L2ProxyAdmin (0x4200000000000000000000000000000000000018) {
    +++ description: None
      issuedPermissions.1:
-        {"permission":"upgrade","target":"0x4200000000000000000000000000000000000018","via":[]}
      issuedPermissions.0.permission:
-        "configure"
+        "upgrade"
      issuedPermissions.0.via.0:
+        {"address":"0x4200000000000000000000000000000000000018","delay":0}
      receivedPermissions:
-        [{"permission":"upgrade","target":"0x4200000000000000000000000000000000000002"},{"permission":"upgrade","target":"0x4200000000000000000000000000000000000007"},{"permission":"upgrade","target":"0x420000000000000000000000000000000000000F"},{"permission":"upgrade","target":"0x4200000000000000000000000000000000000010"},{"permission":"upgrade","target":"0x4200000000000000000000000000000000000011"},{"permission":"upgrade","target":"0x4200000000000000000000000000000000000012"},{"permission":"upgrade","target":"0x4200000000000000000000000000000000000013"},{"permission":"upgrade","target":"0x4200000000000000000000000000000000000014"},{"permission":"upgrade","target":"0x4200000000000000000000000000000000000015"},{"permission":"upgrade","target":"0x4200000000000000000000000000000000000016"},{"permission":"upgrade","target":"0x4200000000000000000000000000000000000017"},{"permission":"upgrade","target":"0x4200000000000000000000000000000000000018"},{"permission":"upgrade","target":"0x4200000000000000000000000000000000000019"},{"permission":"upgrade","target":"0x420000000000000000000000000000000000001A"},{"permission":"upgrade","target":"0x4200000000000000000000000000000000000020"},{"permission":"upgrade","target":"0x4200000000000000000000000000000000000021"}]
      directlyReceivedPermissions:
+        [{"permission":"upgrade","target":"0x4200000000000000000000000000000000000002"},{"permission":"upgrade","target":"0x4200000000000000000000000000000000000007"},{"permission":"upgrade","target":"0x420000000000000000000000000000000000000F"},{"permission":"upgrade","target":"0x4200000000000000000000000000000000000010"},{"permission":"upgrade","target":"0x4200000000000000000000000000000000000011"},{"permission":"upgrade","target":"0x4200000000000000000000000000000000000012"},{"permission":"upgrade","target":"0x4200000000000000000000000000000000000013"},{"permission":"upgrade","target":"0x4200000000000000000000000000000000000014"},{"permission":"upgrade","target":"0x4200000000000000000000000000000000000015"},{"permission":"upgrade","target":"0x4200000000000000000000000000000000000016"},{"permission":"upgrade","target":"0x4200000000000000000000000000000000000017"},{"permission":"upgrade","target":"0x4200000000000000000000000000000000000018"},{"permission":"upgrade","target":"0x4200000000000000000000000000000000000019"},{"permission":"upgrade","target":"0x420000000000000000000000000000000000001A"},{"permission":"upgrade","target":"0x4200000000000000000000000000000000000020"},{"permission":"upgrade","target":"0x4200000000000000000000000000000000000021"}]
    }
```

```diff
    contract BaseFeeVault (0x4200000000000000000000000000000000000019) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x4200000000000000000000000000000000000018"
+        "0x6B1BAE59D09fCcbdDB6C6cceb07B7279367C4E3b"
      issuedPermissions.0.via.0:
+        {"address":"0x4200000000000000000000000000000000000018","delay":0}
    }
```

```diff
    contract L1FeeVault (0x420000000000000000000000000000000000001A) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x4200000000000000000000000000000000000018"
+        "0x6B1BAE59D09fCcbdDB6C6cceb07B7279367C4E3b"
      issuedPermissions.0.via.0:
+        {"address":"0x4200000000000000000000000000000000000018","delay":0}
    }
```

```diff
    contract SchemaRegistry (0x4200000000000000000000000000000000000020) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x4200000000000000000000000000000000000018"
+        "0x6B1BAE59D09fCcbdDB6C6cceb07B7279367C4E3b"
      issuedPermissions.0.via.0:
+        {"address":"0x4200000000000000000000000000000000000018","delay":0}
    }
```

```diff
    contract EAS (0x4200000000000000000000000000000000000021) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x4200000000000000000000000000000000000018"
+        "0x6B1BAE59D09fCcbdDB6C6cceb07B7279367C4E3b"
      issuedPermissions.0.via.0:
+        {"address":"0x4200000000000000000000000000000000000018","delay":0}
    }
```

Generated with discovered.json: 0x7cc64751b1461a39df7f0693d54d3a71f7cc6ea9

# Diff at Fri, 06 Sep 2024 11:28:35 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@08a747098d22564c3a0b869c0a20851bf283bd07 block: 20640793
- current block number: 20691253

## Description

One signer of SynthetixMultisig is replaced.

## Watched changes

```diff
    contract DisputeGameFactory (0xe5965Ab5962eDc7477C8520243A95517CD252fA9) {
    +++ description: None
      values.permissionedGamesTotal:
-        326
+        493
    }
```

```diff
    contract SynthetixMultisig (0xEb3107117FEAd7de89Cd14D463D340A2E6917769) {
    +++ description: None
      values.$members.0:
-        "0xe2163dd599067919d1e9108929b568Bf41D3A420"
+        "0x1C8236B406911A376369e33D39189F1b4B39F27D"
    }
```

Generated with discovered.json: 0xa247759011073b8a4fd767846c728bae9aac6f49

# Diff at Fri, 30 Aug 2024 10:28:19 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@78fe1115153efe3e1ba2014fd74329156dca3951 block: 20548226
- current block number: 20640793

## Description

Synthetix MS changes (owns the SNX escrow).

Optimism is meanwhile still using the fallback centralized FPs.

## Watched changes

```diff
    contract DisputeGameFactory (0xe5965Ab5962eDc7477C8520243A95517CD252fA9) {
    +++ description: None
      values.permissionedGamesTotal:
-        17
+        326
    }
```

```diff
    contract SynthetixMultisig (0xEb3107117FEAd7de89Cd14D463D340A2E6917769) {
    +++ description: None
      values.$members.10:
-        "0x562948111d50BF039A39Eea48D127f2Ae51ddF02"
      values.$members.9:
-        "0x1dd532CF7603a60C3ec91360f273DA3Db38545aB"
      values.$members.8:
-        "0x2d8cF727d37e7277D5eeDbAb853a3e8320f767Cd"
      values.$members.7:
-        "0x347c3190bD015FBD0e47fb90AA4917138A8A32FE"
      values.$members.6:
-        "0xa2fa6Ef1Fcf740b632a04B3FC56B5d3118Bbd211"
+        "0x562948111d50BF039A39Eea48D127f2Ae51ddF02"
      values.$members.5:
-        "0x599e835cbFC903eF09f3Dd5E08D1cF63c32AF8d8"
+        "0x347c3190bD015FBD0e47fb90AA4917138A8A32FE"
      values.$members.4:
-        "0xe1Efa5C91cA533E4a51884d805879249E3FCB2BC"
+        "0x599e835cbFC903eF09f3Dd5E08D1cF63c32AF8d8"
      values.$members.3:
-        "0x8909F73188C4fE68B283fCB1E724b2466e0BdfD0"
+        "0xe1Efa5C91cA533E4a51884d805879249E3FCB2BC"
      values.$threshold:
-        5
+        4
      values.multisigThreshold:
-        "5 of 11 (45%)"
+        "4 of 7 (57%)"
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20548226 (main branch discovery), not current.

```diff
    contract SuperchainProxyAdmin (0x543bA4AADBAb8f9025686Bd03993043599c6fB04) {
    +++ description: It can upgrade the bridge implementation potentially gaining access to all funds, and change any system component.
      receivedPermissions.8.via:
-        []
      receivedPermissions.7.via:
-        []
      receivedPermissions.6.via:
-        []
      receivedPermissions.5.via:
-        []
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
    contract SuperchainProxyAdminOwner (0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A) {
    +++ description: It can act on behalf of 0x543bA4AADBAb8f9025686Bd03993043599c6fB04, inheriting its permissions.
      receivedPermissions.0.via:
-        []
    }
```

Generated with discovered.json: 0xbe928e4bf99a8230745afc52ef46b7b67ad76946

# Diff at Fri, 30 Aug 2024 08:07:22 GMT:

- chain: optimism
- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@6c1bd1f41fadf5f2cb1c1805b5a2c6138a3ed35a block: 122593187
- current block number: 122593187

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 122593187 (main branch discovery), not current.

```diff
    contract L2ProxyAdmin (0x4200000000000000000000000000000000000018) {
    +++ description: None
      receivedPermissions.15.via:
-        []
      receivedPermissions.14.via:
-        []
      receivedPermissions.13.via:
-        []
      receivedPermissions.12.via:
-        []
      receivedPermissions.11.via:
-        []
      receivedPermissions.10.via:
-        []
      receivedPermissions.9.via:
-        []
      receivedPermissions.8.via:
-        []
      receivedPermissions.7.via:
-        []
      receivedPermissions.6.via:
-        []
      receivedPermissions.5.via:
-        []
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

Generated with discovered.json: 0xdf61d13f6212a4e33bf5f8853829cc02df1c0ad6

# Diff at Fri, 23 Aug 2024 09:58:04 GMT:

- chain: optimism
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@67597c7d6c810bc726594446890178150240711e block: 122593187
- current block number: 122593187

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 122593187 (main branch discovery), not current.

```diff
    contract DeployerWhitelist (0x4200000000000000000000000000000000000002) {
    +++ description: None
      values.$upgradeCount:
+        0
    }
```

```diff
    contract L2CrossDomainMessenger (0x4200000000000000000000000000000000000007) {
    +++ description: None
      values.$upgradeCount:
+        0
    }
```

```diff
    contract GasPriceOracle (0x420000000000000000000000000000000000000F) {
    +++ description: None
      values.$upgradeCount:
+        2
    }
```

```diff
    contract L2StandardBridge (0x4200000000000000000000000000000000000010) {
    +++ description: None
      values.$upgradeCount:
+        0
    }
```

```diff
    contract SequencerFeeVault (0x4200000000000000000000000000000000000011) {
    +++ description: None
      values.$upgradeCount:
+        0
    }
```

```diff
    contract OptimismMintableERC20Factory (0x4200000000000000000000000000000000000012) {
    +++ description: None
      values.$upgradeCount:
+        0
    }
```

```diff
    contract L1BlockNumber (0x4200000000000000000000000000000000000013) {
    +++ description: None
      values.$upgradeCount:
+        0
    }
```

```diff
    contract L2ERC721Bridge (0x4200000000000000000000000000000000000014) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract L1Block (0x4200000000000000000000000000000000000015) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract L2ToL1MessagePasser (0x4200000000000000000000000000000000000016) {
    +++ description: None
      values.$upgradeCount:
+        0
    }
```

```diff
    contract OptimismMintableERC721Factory (0x4200000000000000000000000000000000000017) {
    +++ description: None
      values.$upgradeCount:
+        0
    }
```

```diff
    contract L2ProxyAdmin (0x4200000000000000000000000000000000000018) {
    +++ description: None
      values.$upgradeCount:
+        0
    }
```

```diff
    contract BaseFeeVault (0x4200000000000000000000000000000000000019) {
    +++ description: None
      values.$upgradeCount:
+        0
    }
```

```diff
    contract L1FeeVault (0x420000000000000000000000000000000000001A) {
    +++ description: None
      values.$upgradeCount:
+        0
    }
```

```diff
    contract SchemaRegistry (0x4200000000000000000000000000000000000020) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract EAS (0x4200000000000000000000000000000000000021) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

Generated with discovered.json: 0x1394163fad243257c6846d189ed0012a66a8e1bb

# Diff at Fri, 23 Aug 2024 09:53:50 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@67597c7d6c810bc726594446890178150240711e block: 20548226
- current block number: 20548226

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20548226 (main branch discovery), not current.

```diff
    contract AnchorStateRegistry (0x18DAc71c228D1C32c99489B7323d441E1175e443) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract SystemConfig (0x229047fed2591dbec1eF1118d64F7aF3dB9EB290) {
    +++ description: None
      values.$upgradeCount:
+        7
    }
```

```diff
    contract L1ERC721Bridge (0x5a7749f83b81B301cAb5f48EB8516B986DAef23D) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      values.$upgradeCount:
+        6
    }
```

```diff
    contract OptimismMintableERC20Factory (0x75505a97BD334E7BD3C476893285569C4136Fa0F) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      values.$upgradeCount:
+        5
    }
```

```diff
    contract wstETHEscrow (0x76943C0D61395d8F2edF9060e1533529cAe05dE6) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract SuperchainConfig (0x95703e0982140D16f8ebA6d158FccEde42f04a4C) {
    +++ description: Used to manage global configuration values for multiple OP Chains within a single Superchain network. The SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the Superchain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      values.$upgradeCount:
+        3
    }
```

```diff
    contract L1StandardBridge (0x99C9fc46f92E8a1c0deC1b1747d010903E884bE1) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token.
      values.$upgradeCount:
+        0
    }
```

```diff
    contract OptimismPortal (0xbEb5Fc579115071764c7423A4f12eDde41f106Ed) {
    +++ description: None
      values.$upgradeCount:
+        7
    }
```

```diff
    contract DelayedWETH (0xE497B094d6DbB3D5E4CaAc9a14696D7572588d14) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract DisputeGameFactory (0xe5965Ab5962eDc7477C8520243A95517CD252fA9) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

Generated with discovered.json: 0xd085c9f1c61827b17645b6775951134a35698f7d

# Diff at Wed, 21 Aug 2024 10:08:25 GMT:

- chain: optimism
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@2f6dde3357bf5d79196b6e94f79d853a6c4ec72b block: 122593187
- current block number: 122593187

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 122593187 (main branch discovery), not current.

```diff
    contract DeployerWhitelist (0x4200000000000000000000000000000000000002) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x4200000000000000000000000000000000000018","via":[]}]
    }
```

```diff
    contract L2CrossDomainMessenger (0x4200000000000000000000000000000000000007) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x4200000000000000000000000000000000000018","via":[]}]
    }
```

```diff
    contract GasPriceOracle (0x420000000000000000000000000000000000000F) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x4200000000000000000000000000000000000018","via":[]}]
    }
```

```diff
    contract L2StandardBridge (0x4200000000000000000000000000000000000010) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x4200000000000000000000000000000000000018","via":[]}]
    }
```

```diff
    contract SequencerFeeVault (0x4200000000000000000000000000000000000011) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x4200000000000000000000000000000000000018","via":[]}]
    }
```

```diff
    contract OptimismMintableERC20Factory (0x4200000000000000000000000000000000000012) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x4200000000000000000000000000000000000018","via":[]}]
    }
```

```diff
    contract L1BlockNumber (0x4200000000000000000000000000000000000013) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x4200000000000000000000000000000000000018","via":[]}]
    }
```

```diff
    contract L2ERC721Bridge (0x4200000000000000000000000000000000000014) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x4200000000000000000000000000000000000018","via":[]}]
    }
```

```diff
    contract L1Block (0x4200000000000000000000000000000000000015) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x4200000000000000000000000000000000000018","via":[]}]
    }
```

```diff
    contract L2ToL1MessagePasser (0x4200000000000000000000000000000000000016) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x4200000000000000000000000000000000000018","via":[]}]
    }
```

```diff
    contract OptimismMintableERC721Factory (0x4200000000000000000000000000000000000017) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x4200000000000000000000000000000000000018","via":[]}]
    }
```

```diff
    contract L2ProxyAdmin (0x4200000000000000000000000000000000000018) {
    +++ description: None
      assignedPermissions:
-        {"upgrade":["0x4200000000000000000000000000000000000002","0x4200000000000000000000000000000000000007","0x420000000000000000000000000000000000000F","0x4200000000000000000000000000000000000010","0x4200000000000000000000000000000000000011","0x4200000000000000000000000000000000000012","0x4200000000000000000000000000000000000013","0x4200000000000000000000000000000000000014","0x4200000000000000000000000000000000000015","0x4200000000000000000000000000000000000016","0x4200000000000000000000000000000000000017","0x4200000000000000000000000000000000000018","0x4200000000000000000000000000000000000019","0x420000000000000000000000000000000000001A","0x4200000000000000000000000000000000000020","0x4200000000000000000000000000000000000021"]}
      issuedPermissions:
+        [{"permission":"configure","target":"0x6B1BAE59D09fCcbdDB6C6cceb07B7279367C4E3b","via":[]},{"permission":"upgrade","target":"0x4200000000000000000000000000000000000018","via":[]}]
      receivedPermissions:
+        [{"permission":"upgrade","target":"0x4200000000000000000000000000000000000002","via":[]},{"permission":"upgrade","target":"0x4200000000000000000000000000000000000007","via":[]},{"permission":"upgrade","target":"0x420000000000000000000000000000000000000F","via":[]},{"permission":"upgrade","target":"0x4200000000000000000000000000000000000010","via":[]},{"permission":"upgrade","target":"0x4200000000000000000000000000000000000011","via":[]},{"permission":"upgrade","target":"0x4200000000000000000000000000000000000012","via":[]},{"permission":"upgrade","target":"0x4200000000000000000000000000000000000013","via":[]},{"permission":"upgrade","target":"0x4200000000000000000000000000000000000014","via":[]},{"permission":"upgrade","target":"0x4200000000000000000000000000000000000015","via":[]},{"permission":"upgrade","target":"0x4200000000000000000000000000000000000016","via":[]},{"permission":"upgrade","target":"0x4200000000000000000000000000000000000017","via":[]},{"permission":"upgrade","target":"0x4200000000000000000000000000000000000018","via":[]},{"permission":"upgrade","target":"0x4200000000000000000000000000000000000019","via":[]},{"permission":"upgrade","target":"0x420000000000000000000000000000000000001A","via":[]},{"permission":"upgrade","target":"0x4200000000000000000000000000000000000020","via":[]},{"permission":"upgrade","target":"0x4200000000000000000000000000000000000021","via":[]}]
    }
```

```diff
    contract BaseFeeVault (0x4200000000000000000000000000000000000019) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x4200000000000000000000000000000000000018","via":[]}]
    }
```

```diff
    contract L1FeeVault (0x420000000000000000000000000000000000001A) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x4200000000000000000000000000000000000018","via":[]}]
    }
```

```diff
    contract SchemaRegistry (0x4200000000000000000000000000000000000020) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x4200000000000000000000000000000000000018","via":[]}]
    }
```

```diff
    contract EAS (0x4200000000000000000000000000000000000021) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x4200000000000000000000000000000000000018","via":[]}]
    }
```

Generated with discovered.json: 0x487f6245b7a3c916d3e5273dedb8454bb9da614a

# Diff at Wed, 21 Aug 2024 10:04:39 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@2f6dde3357bf5d79196b6e94f79d853a6c4ec72b block: 20548226
- current block number: 20548226

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20548226 (main branch discovery), not current.

```diff
    contract AnchorStateRegistry (0x18DAc71c228D1C32c99489B7323d441E1175e443) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x543bA4AADBAb8f9025686Bd03993043599c6fB04","via":[]}]
    }
```

```diff
    contract SystemConfig (0x229047fed2591dbec1eF1118d64F7aF3dB9EB290) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x543bA4AADBAb8f9025686Bd03993043599c6fB04","via":[]}]
    }
```

```diff
    contract SuperchainProxyAdmin (0x543bA4AADBAb8f9025686Bd03993043599c6fB04) {
    +++ description: It can upgrade the bridge implementation potentially gaining access to all funds, and change any system component.
      assignedPermissions:
-        {"upgrade":["0x18DAc71c228D1C32c99489B7323d441E1175e443","0x229047fed2591dbec1eF1118d64F7aF3dB9EB290","0x5a7749f83b81B301cAb5f48EB8516B986DAef23D","0x75505a97BD334E7BD3C476893285569C4136Fa0F","0x95703e0982140D16f8ebA6d158FccEde42f04a4C","0x99C9fc46f92E8a1c0deC1b1747d010903E884bE1","0xE497B094d6DbB3D5E4CaAc9a14696D7572588d14","0xbEb5Fc579115071764c7423A4f12eDde41f106Ed","0xe5965Ab5962eDc7477C8520243A95517CD252fA9"]}
      issuedPermissions:
+        [{"permission":"configure","target":"0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A","via":[]}]
      receivedPermissions:
+        [{"permission":"upgrade","target":"0x18DAc71c228D1C32c99489B7323d441E1175e443","via":[]},{"permission":"upgrade","target":"0x229047fed2591dbec1eF1118d64F7aF3dB9EB290","via":[]},{"permission":"upgrade","target":"0x5a7749f83b81B301cAb5f48EB8516B986DAef23D","via":[]},{"permission":"upgrade","target":"0x75505a97BD334E7BD3C476893285569C4136Fa0F","via":[]},{"permission":"upgrade","target":"0x95703e0982140D16f8ebA6d158FccEde42f04a4C","via":[]},{"permission":"upgrade","target":"0x99C9fc46f92E8a1c0deC1b1747d010903E884bE1","via":[]},{"permission":"upgrade","target":"0xbEb5Fc579115071764c7423A4f12eDde41f106Ed","via":[]},{"permission":"upgrade","target":"0xE497B094d6DbB3D5E4CaAc9a14696D7572588d14","via":[]},{"permission":"upgrade","target":"0xe5965Ab5962eDc7477C8520243A95517CD252fA9","via":[]}]
    }
```

```diff
    contract SuperchainProxyAdminOwner (0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A) {
    +++ description: It can act on behalf of 0x543bA4AADBAb8f9025686Bd03993043599c6fB04, inheriting its permissions.
      assignedPermissions:
-        {"configure":["0x543bA4AADBAb8f9025686Bd03993043599c6fB04"]}
      receivedPermissions:
+        [{"permission":"configure","target":"0x543bA4AADBAb8f9025686Bd03993043599c6fB04","via":[]}]
    }
```

```diff
    contract L1ERC721Bridge (0x5a7749f83b81B301cAb5f48EB8516B986DAef23D) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x543bA4AADBAb8f9025686Bd03993043599c6fB04","via":[]}]
    }
```

```diff
    contract OptimismMintableERC20Factory (0x75505a97BD334E7BD3C476893285569C4136Fa0F) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x543bA4AADBAb8f9025686Bd03993043599c6fB04","via":[]}]
    }
```

```diff
    contract SuperchainConfig (0x95703e0982140D16f8ebA6d158FccEde42f04a4C) {
    +++ description: Used to manage global configuration values for multiple OP Chains within a single Superchain network. The SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the Superchain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x543bA4AADBAb8f9025686Bd03993043599c6fB04","via":[]}]
    }
```

```diff
    contract L1StandardBridge (0x99C9fc46f92E8a1c0deC1b1747d010903E884bE1) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token.
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x543bA4AADBAb8f9025686Bd03993043599c6fB04","via":[]}]
    }
```

```diff
    contract OptimismPortal (0xbEb5Fc579115071764c7423A4f12eDde41f106Ed) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x543bA4AADBAb8f9025686Bd03993043599c6fB04","via":[]}]
    }
```

```diff
    contract DelayedWETH (0xE497B094d6DbB3D5E4CaAc9a14696D7572588d14) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x543bA4AADBAb8f9025686Bd03993043599c6fB04","via":[]}]
    }
```

```diff
    contract DisputeGameFactory (0xe5965Ab5962eDc7477C8520243A95517CD252fA9) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x543bA4AADBAb8f9025686Bd03993043599c6fB04","via":[]}]
    }
```

Generated with discovered.json: 0xc2ec99b57ae94852d03fff550a2bfb18454509b6

# Diff at Sat, 17 Aug 2024 12:04:40 GMT:

- chain: ethereum
- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@cdcd8b00a013be2560c73c34ee9bd4de75515cb9 block: 20541920
- current block number: 20548226

## Description

OP Mainnet has used the fall back to activate permissioned games.

## Watched changes

```diff
    contract OptimismPortal (0xbEb5Fc579115071764c7423A4f12eDde41f106Ed) {
    +++ description: None
      values.respectedGameType:
-        0
+        1
      values.respectedGameTypeUpdatedAt:
-        1718037779
+        1723833359
    }
```

```diff
    contract DisputeGameFactory (0xe5965Ab5962eDc7477C8520243A95517CD252fA9) {
    +++ description: None
      values.permissionedGamesTotal:
-        0
+        17
    }
```

Generated with discovered.json: 0x9feacdb29601d60c3d8eaf1d7584ad76a11ea197

# Diff at Fri, 16 Aug 2024 14:54:57 GMT:

- chain: ethereum
- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@3c09e48bec1d2cc69117ac9d7bd975260c84ebf8 block: 20290315
- current block number: 20541920

## Description

Allows permissioned games to be counted.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20290315 (main branch discovery), not current.

```diff
    contract DisputeGameFactory (0xe5965Ab5962eDc7477C8520243A95517CD252fA9) {
    +++ description: None
      values.permissionedGamesTotal:
+        0
    }
```

Generated with discovered.json: 0x11c5d304eee079e826c09a6ecd7d7e7a37dc2150

# Diff at Fri, 09 Aug 2024 12:04:33 GMT:

- chain: optimism
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bf40aa32f030fd312056ca0ef198c8550467d1d7 block: 122593187
- current block number: 122593187

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 122593187 (main branch discovery), not current.

```diff
    contract L2ProxyAdmin (0x4200000000000000000000000000000000000018) {
    +++ description: None
      assignedPermissions.upgrade.15:
-        "0x4200000000000000000000000000000000000018"
+        "0x4200000000000000000000000000000000000021"
      assignedPermissions.upgrade.14:
-        "0x4200000000000000000000000000000000000007"
+        "0x4200000000000000000000000000000000000020"
      assignedPermissions.upgrade.13:
-        "0x4200000000000000000000000000000000000016"
+        "0x420000000000000000000000000000000000001A"
      assignedPermissions.upgrade.12:
-        "0x4200000000000000000000000000000000000010"
+        "0x4200000000000000000000000000000000000019"
      assignedPermissions.upgrade.11:
-        "0x4200000000000000000000000000000000000019"
+        "0x4200000000000000000000000000000000000018"
      assignedPermissions.upgrade.10:
-        "0x4200000000000000000000000000000000000020"
+        "0x4200000000000000000000000000000000000017"
      assignedPermissions.upgrade.9:
-        "0x4200000000000000000000000000000000000021"
+        "0x4200000000000000000000000000000000000016"
      assignedPermissions.upgrade.7:
-        "0x4200000000000000000000000000000000000017"
+        "0x4200000000000000000000000000000000000014"
      assignedPermissions.upgrade.6:
-        "0x420000000000000000000000000000000000000F"
+        "0x4200000000000000000000000000000000000013"
      assignedPermissions.upgrade.5:
-        "0x4200000000000000000000000000000000000011"
+        "0x4200000000000000000000000000000000000012"
      assignedPermissions.upgrade.4:
-        "0x4200000000000000000000000000000000000014"
+        "0x4200000000000000000000000000000000000011"
      assignedPermissions.upgrade.3:
-        "0x4200000000000000000000000000000000000012"
+        "0x4200000000000000000000000000000000000010"
      assignedPermissions.upgrade.2:
-        "0x420000000000000000000000000000000000001A"
+        "0x420000000000000000000000000000000000000F"
      assignedPermissions.upgrade.1:
-        "0x4200000000000000000000000000000000000002"
+        "0x4200000000000000000000000000000000000007"
      assignedPermissions.upgrade.0:
-        "0x4200000000000000000000000000000000000013"
+        "0x4200000000000000000000000000000000000002"
    }
```

Generated with discovered.json: 0xd5a287f312aefcca647deda382227786f764fe49

# Diff at Fri, 09 Aug 2024 12:00:59 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bf40aa32f030fd312056ca0ef198c8550467d1d7 block: 20290315
- current block number: 20290315

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20290315 (main branch discovery), not current.

```diff
    contract SuperchainProxyAdmin (0x543bA4AADBAb8f9025686Bd03993043599c6fB04) {
    +++ description: It can upgrade the bridge implementation potentially gaining access to all funds, and change any system component.
      assignedPermissions.upgrade.8:
-        "0x18DAc71c228D1C32c99489B7323d441E1175e443"
+        "0xe5965Ab5962eDc7477C8520243A95517CD252fA9"
      assignedPermissions.upgrade.7:
-        "0xE497B094d6DbB3D5E4CaAc9a14696D7572588d14"
+        "0xbEb5Fc579115071764c7423A4f12eDde41f106Ed"
      assignedPermissions.upgrade.6:
-        "0x75505a97BD334E7BD3C476893285569C4136Fa0F"
+        "0xE497B094d6DbB3D5E4CaAc9a14696D7572588d14"
      assignedPermissions.upgrade.5:
-        "0x5a7749f83b81B301cAb5f48EB8516B986DAef23D"
+        "0x99C9fc46f92E8a1c0deC1b1747d010903E884bE1"
      assignedPermissions.upgrade.4:
-        "0xe5965Ab5962eDc7477C8520243A95517CD252fA9"
+        "0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
      assignedPermissions.upgrade.3:
-        "0x229047fed2591dbec1eF1118d64F7aF3dB9EB290"
+        "0x75505a97BD334E7BD3C476893285569C4136Fa0F"
      assignedPermissions.upgrade.2:
-        "0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
+        "0x5a7749f83b81B301cAb5f48EB8516B986DAef23D"
      assignedPermissions.upgrade.1:
-        "0x99C9fc46f92E8a1c0deC1b1747d010903E884bE1"
+        "0x229047fed2591dbec1eF1118d64F7aF3dB9EB290"
      assignedPermissions.upgrade.0:
-        "0xbEb5Fc579115071764c7423A4f12eDde41f106Ed"
+        "0x18DAc71c228D1C32c99489B7323d441E1175e443"
    }
```

Generated with discovered.json: 0x521f8577f44a3d19e4a94182cca9f6b70e4e26a0

# Diff at Fri, 09 Aug 2024 10:14:32 GMT:

- chain: optimism
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f0da1d0aab7bc6b3b5e54e7e93480bd98e57035 block: 122593187
- current block number: 122593187

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 122593187 (main branch discovery), not current.

```diff
    contract MintManagerOwner (0x2A82Ae142b2e62Cb7D10b55E323ACB1Cab663a26) {
    +++ description: None
      values.$multisigThreshold:
-        "3 of 5 (60%)"
      values.getOwners:
-        ["0x3041BA32f451F5850c147805F5521AC206421623","0x7cB07FE039a92B3D784f284D919503A381BEC54f","0xdb203D7f00fF435dA107543B33495f9cA2c484C6","0x4D014f3c5F33Aa9Cd1Dc29ce29618d07Ae666d15","0xA902A27a7631D502E3Ec17fc5d4c3e0861752c94"]
      values.getThreshold:
-        3
      values.$members:
+        ["0x3041BA32f451F5850c147805F5521AC206421623","0x7cB07FE039a92B3D784f284D919503A381BEC54f","0xdb203D7f00fF435dA107543B33495f9cA2c484C6","0x4D014f3c5F33Aa9Cd1Dc29ce29618d07Ae666d15","0xA902A27a7631D502E3Ec17fc5d4c3e0861752c94"]
      values.$threshold:
+        3
      values.multisigThreshold:
+        "3 of 5 (60%)"
    }
```

```diff
    contract L2ProxyAdmin (0x4200000000000000000000000000000000000018) {
    +++ description: None
      assignedPermissions.admin:
-        ["0x4200000000000000000000000000000000000002","0x4200000000000000000000000000000000000007","0x420000000000000000000000000000000000000F","0x4200000000000000000000000000000000000010","0x4200000000000000000000000000000000000011","0x4200000000000000000000000000000000000012","0x4200000000000000000000000000000000000013","0x4200000000000000000000000000000000000014","0x4200000000000000000000000000000000000015","0x4200000000000000000000000000000000000016","0x4200000000000000000000000000000000000017","0x4200000000000000000000000000000000000018","0x4200000000000000000000000000000000000019","0x420000000000000000000000000000000000001A","0x4200000000000000000000000000000000000020","0x4200000000000000000000000000000000000021"]
      assignedPermissions.upgrade:
+        ["0x4200000000000000000000000000000000000013","0x4200000000000000000000000000000000000002","0x420000000000000000000000000000000000001A","0x4200000000000000000000000000000000000012","0x4200000000000000000000000000000000000014","0x4200000000000000000000000000000000000011","0x420000000000000000000000000000000000000F","0x4200000000000000000000000000000000000017","0x4200000000000000000000000000000000000015","0x4200000000000000000000000000000000000021","0x4200000000000000000000000000000000000020","0x4200000000000000000000000000000000000019","0x4200000000000000000000000000000000000010","0x4200000000000000000000000000000000000016","0x4200000000000000000000000000000000000007","0x4200000000000000000000000000000000000018"]
    }
```

Generated with discovered.json: 0xe5d06ed757d61c1668a448077dfb64eb3e35b50a

# Diff at Fri, 09 Aug 2024 10:11:03 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f0da1d0aab7bc6b3b5e54e7e93480bd98e57035 block: 20290315
- current block number: 20290315

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20290315 (main branch discovery), not current.

```diff
    contract GuardianMultisig (0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2) {
    +++ description: None
      values.$multisigThreshold:
-        "1 of 1 (100%)"
      values.getOwners:
-        ["0xc2819DC788505Aac350142A7A707BF9D03E3Bd03"]
      values.getThreshold:
-        1
      values.$members:
+        ["0xc2819DC788505Aac350142A7A707BF9D03E3Bd03"]
      values.$threshold:
+        1
      values.multisigThreshold:
+        "1 of 1 (100%)"
    }
```

```diff
    contract GnosisSafe (0x42d27eEA1AD6e22Af6284F609847CB3Cd56B9c64) {
    +++ description: None
      values.$multisigThreshold:
-        "2 of 2 (100%)"
      values.getOwners:
-        ["0xb23794fd6BA1CEAd01Cf54D772b8341F2F0197A5","0x4665374939642965EfD8357D4568D2A77f677429"]
      values.getThreshold:
-        2
      values.$members:
+        ["0xb23794fd6BA1CEAd01Cf54D772b8341F2F0197A5","0x4665374939642965EfD8357D4568D2A77f677429"]
      values.$threshold:
+        2
      values.multisigThreshold:
+        "2 of 2 (100%)"
    }
```

```diff
    contract SuperchainProxyAdmin (0x543bA4AADBAb8f9025686Bd03993043599c6fB04) {
    +++ description: It can upgrade the bridge implementation potentially gaining access to all funds, and change any system component.
      assignedPermissions.admin:
-        ["0x18DAc71c228D1C32c99489B7323d441E1175e443","0x229047fed2591dbec1eF1118d64F7aF3dB9EB290","0x5a7749f83b81B301cAb5f48EB8516B986DAef23D","0x75505a97BD334E7BD3C476893285569C4136Fa0F","0x95703e0982140D16f8ebA6d158FccEde42f04a4C","0x99C9fc46f92E8a1c0deC1b1747d010903E884bE1","0xE497B094d6DbB3D5E4CaAc9a14696D7572588d14","0xbEb5Fc579115071764c7423A4f12eDde41f106Ed","0xe5965Ab5962eDc7477C8520243A95517CD252fA9"]
      assignedPermissions.upgrade:
+        ["0xbEb5Fc579115071764c7423A4f12eDde41f106Ed","0x99C9fc46f92E8a1c0deC1b1747d010903E884bE1","0x95703e0982140D16f8ebA6d158FccEde42f04a4C","0x229047fed2591dbec1eF1118d64F7aF3dB9EB290","0xe5965Ab5962eDc7477C8520243A95517CD252fA9","0x5a7749f83b81B301cAb5f48EB8516B986DAef23D","0x75505a97BD334E7BD3C476893285569C4136Fa0F","0xE497B094d6DbB3D5E4CaAc9a14696D7572588d14","0x18DAc71c228D1C32c99489B7323d441E1175e443"]
    }
```

```diff
    contract SuperchainProxyAdminOwner (0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A) {
    +++ description: It can act on behalf of 0x543bA4AADBAb8f9025686Bd03993043599c6fB04, inheriting its permissions.
      assignedPermissions.owner:
-        ["0x543bA4AADBAb8f9025686Bd03993043599c6fB04"]
      assignedPermissions.configure:
+        ["0x543bA4AADBAb8f9025686Bd03993043599c6fB04"]
      values.$multisigThreshold:
-        "2 of 2 (100%)"
      values.getOwners:
-        ["0x847B5c174615B1B7fDF770882256e2D3E95b9D92","0xc2819DC788505Aac350142A7A707BF9D03E3Bd03"]
      values.getThreshold:
-        2
      values.$members:
+        ["0x847B5c174615B1B7fDF770882256e2D3E95b9D92","0xc2819DC788505Aac350142A7A707BF9D03E3Bd03"]
      values.$threshold:
+        2
      values.multisigThreshold:
+        "2 of 2 (100%)"
    }
```

```diff
    contract FoundationMultisig_1 (0x847B5c174615B1B7fDF770882256e2D3E95b9D92) {
    +++ description: None
      values.$multisigThreshold:
-        "5 of 7 (71%)"
      values.getOwners:
-        ["0x42d27eEA1AD6e22Af6284F609847CB3Cd56B9c64","0x3041BA32f451F5850c147805F5521AC206421623","0xE7dEA1306D9F829bA469d1904c50903b46ebd02e","0xBF93D4d727F7Ba1F753E1124C3e532dCb04Ea2c8","0x4D014f3c5F33Aa9Cd1Dc29ce29618d07Ae666d15","0x7cB07FE039a92B3D784f284D919503A381BEC54f","0x9bbFB9919062C29a5eE15aCD93c9D7c3b14d31aa"]
      values.getThreshold:
-        5
      values.$members:
+        ["0x42d27eEA1AD6e22Af6284F609847CB3Cd56B9c64","0x3041BA32f451F5850c147805F5521AC206421623","0xE7dEA1306D9F829bA469d1904c50903b46ebd02e","0xBF93D4d727F7Ba1F753E1124C3e532dCb04Ea2c8","0x4D014f3c5F33Aa9Cd1Dc29ce29618d07Ae666d15","0x7cB07FE039a92B3D784f284D919503A381BEC54f","0x9bbFB9919062C29a5eE15aCD93c9D7c3b14d31aa"]
      values.$threshold:
+        5
      values.multisigThreshold:
+        "5 of 7 (71%)"
    }
```

```diff
    contract FoundationMultisig_2 (0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A) {
    +++ description: Deputy Guardian of 0x5dC91D01290af474CE21DE14c17335a6dEe4d2a8. It can act on behalf of the 0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2.
      values.$multisigThreshold:
-        "5 of 7 (71%)"
      values.getOwners:
-        ["0x42d27eEA1AD6e22Af6284F609847CB3Cd56B9c64","0x3041BA32f451F5850c147805F5521AC206421623","0xE7dEA1306D9F829bA469d1904c50903b46ebd02e","0xBF93D4d727F7Ba1F753E1124C3e532dCb04Ea2c8","0x4D014f3c5F33Aa9Cd1Dc29ce29618d07Ae666d15","0x7cB07FE039a92B3D784f284D919503A381BEC54f","0x9bbFB9919062C29a5eE15aCD93c9D7c3b14d31aa"]
      values.getThreshold:
-        5
      values.$members:
+        ["0x42d27eEA1AD6e22Af6284F609847CB3Cd56B9c64","0x3041BA32f451F5850c147805F5521AC206421623","0xE7dEA1306D9F829bA469d1904c50903b46ebd02e","0xBF93D4d727F7Ba1F753E1124C3e532dCb04Ea2c8","0x4D014f3c5F33Aa9Cd1Dc29ce29618d07Ae666d15","0x7cB07FE039a92B3D784f284D919503A381BEC54f","0x9bbFB9919062C29a5eE15aCD93c9D7c3b14d31aa"]
      values.$threshold:
+        5
      values.multisigThreshold:
+        "5 of 7 (71%)"
    }
```

```diff
    contract SecurityCouncilMultisig (0xc2819DC788505Aac350142A7A707BF9D03E3Bd03) {
    +++ description: None
      values.$multisigThreshold:
-        "10 of 13 (77%)"
      values.getOwners:
-        ["0x07dC0893cAfbF810e3E72505041f2865726Fd073","0x0a122d8aA40758FBAFf0360BFB391EdFfD9758b8","0x1822b35B09f5ce1C78ecbC06AC0A4e17885b925e","0x4A7322258c9E690e4CB8Cea6e5251443E956e61E","0x51aCb8e1205De850D1b512584FeE9C29C3813dDa","0x5C0F529d5B025540c54f71d2BcbB4c78F368C47e","0x6323ef2b80030f3fBc508bFc321Fc71fDB95c865","0x74FAE9a9fbe31d1F69b95f59CaF12736a8b6B310","0x7ed8d9Af9eaA194D1A75C67c1475579E42289E39","0x8Afe777B5A4D1e156435ab44Ad4b73A318cE0EA4","0x9Eb11A55132c851b9991F148b3Af791ca498fD7A","0xbfA046B0bc5cEa1596be62B8b3f79f9f41f1E0d9","0xE895076cD050F1f042d1040E47b5929bE989E514"]
      values.getThreshold:
-        10
      values.$members:
+        ["0x07dC0893cAfbF810e3E72505041f2865726Fd073","0x0a122d8aA40758FBAFf0360BFB391EdFfD9758b8","0x1822b35B09f5ce1C78ecbC06AC0A4e17885b925e","0x4A7322258c9E690e4CB8Cea6e5251443E956e61E","0x51aCb8e1205De850D1b512584FeE9C29C3813dDa","0x5C0F529d5B025540c54f71d2BcbB4c78F368C47e","0x6323ef2b80030f3fBc508bFc321Fc71fDB95c865","0x74FAE9a9fbe31d1F69b95f59CaF12736a8b6B310","0x7ed8d9Af9eaA194D1A75C67c1475579E42289E39","0x8Afe777B5A4D1e156435ab44Ad4b73A318cE0EA4","0x9Eb11A55132c851b9991F148b3Af791ca498fD7A","0xbfA046B0bc5cEa1596be62B8b3f79f9f41f1E0d9","0xE895076cD050F1f042d1040E47b5929bE989E514"]
      values.$threshold:
+        10
      values.multisigThreshold:
+        "10 of 13 (77%)"
    }
```

```diff
    contract SynthetixMultisig (0xEb3107117FEAd7de89Cd14D463D340A2E6917769) {
    +++ description: None
      values.$multisigThreshold:
-        "5 of 11 (45%)"
      values.getOwners:
-        ["0xe2163dd599067919d1e9108929b568Bf41D3A420","0x26E10fF641839cA457695CE955Cb90657D6E3F53","0x0B67bab43157e53D21965Af0d83f83BeD9553E0a","0x8909F73188C4fE68B283fCB1E724b2466e0BdfD0","0xe1Efa5C91cA533E4a51884d805879249E3FCB2BC","0x599e835cbFC903eF09f3Dd5E08D1cF63c32AF8d8","0xa2fa6Ef1Fcf740b632a04B3FC56B5d3118Bbd211","0x347c3190bD015FBD0e47fb90AA4917138A8A32FE","0x2d8cF727d37e7277D5eeDbAb853a3e8320f767Cd","0x1dd532CF7603a60C3ec91360f273DA3Db38545aB","0x562948111d50BF039A39Eea48D127f2Ae51ddF02"]
      values.getThreshold:
-        5
      values.$members:
+        ["0xe2163dd599067919d1e9108929b568Bf41D3A420","0x26E10fF641839cA457695CE955Cb90657D6E3F53","0x0B67bab43157e53D21965Af0d83f83BeD9553E0a","0x8909F73188C4fE68B283fCB1E724b2466e0BdfD0","0xe1Efa5C91cA533E4a51884d805879249E3FCB2BC","0x599e835cbFC903eF09f3Dd5E08D1cF63c32AF8d8","0xa2fa6Ef1Fcf740b632a04B3FC56B5d3118Bbd211","0x347c3190bD015FBD0e47fb90AA4917138A8A32FE","0x2d8cF727d37e7277D5eeDbAb853a3e8320f767Cd","0x1dd532CF7603a60C3ec91360f273DA3Db38545aB","0x562948111d50BF039A39Eea48D127f2Ae51ddF02"]
      values.$threshold:
+        5
      values.multisigThreshold:
+        "5 of 11 (45%)"
    }
```

Generated with discovered.json: 0xc5d8b67d84299d6ebcefe389a9fb5eca20ef57d9

# Diff at Tue, 30 Jul 2024 11:13:18 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@b2b6471ff62871f4956541f42ec025c356c08f7e block: 20290315
- current block number: 20290315

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20290315 (main branch discovery), not current.

```diff
    contract SystemConfig (0x229047fed2591dbec1eF1118d64F7aF3dB9EB290) {
    +++ description: None
      fieldMeta:
+        {"gasLimit":{"severity":"LOW","description":"Gas limit for blocks on L2."}}
    }
```

```diff
    contract OptimismPortal (0xbEb5Fc579115071764c7423A4f12eDde41f106Ed) {
    +++ description: None
      fieldMeta:
+        {"paused":{"severity":"HIGH","description":"Whether the contract is paused or not. Determined by the SuperchainConfig contract PAUSED_SLOT. Here it pauses withdrawals. If this is paused, also the L1CrossDomainMessenger and ERC-20, ERC-721 deposits are paused."}}
    }
```

Generated with discovered.json: 0x55a5a82cf4f21a3767afa54a4a7696989b963840

# Diff at Thu, 18 Jul 2024 10:32:23 GMT:

- chain: ethereum
- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@d89fe52cb65d643cef712d1d7910564a7acf2dce block: 20290315
- current block number: 20290315

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20290315 (main branch discovery), not current.

```diff
    contract LivenessModule (0x0454092516c9A4d636d3CAfA1e82161376C8a748) {
    +++ description: None
      template:
+        "gnosisSafeModules/LivenessModule"
      descriptions:
+        ["used to remove members inactive for 8467200 while making sure that the threshold remains above 75%. If the number of members falls below 8, the 0x847B5c174615B1B7fDF770882256e2D3E95b9D92 takes ownership of the multisig"]
    }
```

```diff
    contract GuardianMultisig (0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2) {
    +++ description: None
      roles:
+        ["Guardian"]
    }
```

```diff
    contract L1CrossDomainMessenger (0x25ace71c97B33Cc4729CF772ae268934F7ab5fA1) {
    +++ description: None
      template:
+        "opstack/L1CrossDomainMessenger"
      descriptions:
+        ["Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function."]
      categories:
+        ["Core"]
    }
```

```diff
    contract ProxyAdmin (0x543bA4AADBAb8f9025686Bd03993043599c6fB04) {
    +++ description: None
      name:
-        "ProxyAdmin"
+        "SuperchainProxyAdmin"
      descriptions:
+        ["It can upgrade the bridge implementation potentially gaining access to all funds, and change any system component."]
    }
```

```diff
    contract ProxyAdminOwner (0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A) {
    +++ description: None
      name:
-        "ProxyAdminOwner"
+        "SuperchainProxyAdminOwner"
      descriptions:
+        ["It can act on behalf of 0x543bA4AADBAb8f9025686Bd03993043599c6fB04, inheriting its permissions."]
    }
```

```diff
    contract L1ERC721Bridge (0x5a7749f83b81B301cAb5f48EB8516B986DAef23D) {
    +++ description: None
      template:
+        "opstack/L1ERC721Bridge"
      descriptions:
+        ["Used to bridge ERC-721 tokens from host chain to this chain."]
    }
```

```diff
    contract DeputyGuardianModule (0x5dC91D01290af474CE21DE14c17335a6dEe4d2a8) {
    +++ description: None
      template:
+        "gnosisSafeModules/DeputyGuardianModule"
      descriptions:
+        ["allows the 0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A (the deputy guardian) to act on behalf of the Gnosis Safe."]
    }
```

```diff
    contract OptimismMintableERC20Factory (0x75505a97BD334E7BD3C476893285569C4136Fa0F) {
    +++ description: None
      template:
+        "opstack/OptimismMintableERC20Factory"
      descriptions:
+        ["A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa."]
    }
```

```diff
    contract SuperchainConfig (0x95703e0982140D16f8ebA6d158FccEde42f04a4C) {
    +++ description: None
      template:
+        "opstack/SuperchainConfig"
      descriptions:
+        ["Used to manage global configuration values for multiple OP Chains within a single Superchain network. The SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the Superchain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system."]
      categories:
+        ["Upgrades&Governance"]
    }
```

```diff
    contract L1StandardBridge (0x99C9fc46f92E8a1c0deC1b1747d010903E884bE1) {
    +++ description: None
      template:
+        "opstack/L1StandardBridge"
      descriptions:
+        ["The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token."]
      categories:
+        ["Gateways&Escrows"]
    }
```

```diff
    contract FoundationMultisig_2 (0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A) {
    +++ description: None
      descriptions:
+        ["Deputy Guardian of 0x5dC91D01290af474CE21DE14c17335a6dEe4d2a8. It can act on behalf of the 0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2."]
    }
```

Generated with discovered.json: 0x6c82d42b433ed39ceb66098f6f19c519b6885edb

# Diff at Fri, 12 Jul 2024 12:08:02 GMT:

- chain: ethereum
- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@d6f7bd1c3a10712b93b6891cc6ca39616765a983 block: 20188703
- current block number: 20290315

## Description

These changes are due to the [OP Mainnet 'Fjord' upgrade](https://gov.optimism.io/t/upgrade-proposal-9-fjord-network-upgrade/8236) which, on the L1, affects the fault proof related contracts in order to introduce the new op-program pre-state hash (otherwise code-identical).

### Fjord upgrade TLDR

- secp256r1 precompile
- brotli channel compression
- FastLZ based DA fee calculation
- max sequencer drift (time delta between L2 block ts and according epoch ts derived from L1) raised from 10 to 30 minutes

## Watched changes

```diff
-   Status: DELETED
    contract FaultDisputeGame (0x4146DF64D83acB0DcB0c1a4884a16f090165e122)
    +++ description: None
```

```diff
    contract DisputeGameFactory (0xe5965Ab5962eDc7477C8520243A95517CD252fA9) {
    +++ description: None
      values.gameImpls.1:
-        "0xE9daD167EF4DE8812C1abD013Ac9570C616599A0"
+        "0xc307e93a7C530a184c98EaDe4545a412b857b62f"
      values.gameImpls.0:
-        "0x4146DF64D83acB0DcB0c1a4884a16f090165e122"
+        "0xf691F8A6d908B58C534B624cF16495b491E633BA"
    }
```

```diff
-   Status: DELETED
    contract PermissionedDisputeGame (0xE9daD167EF4DE8812C1abD013Ac9570C616599A0)
    +++ description: None
```

```diff
+   Status: CREATED
    contract PermissionedDisputeGame (0xc307e93a7C530a184c98EaDe4545a412b857b62f)
    +++ description: None
```

```diff
+   Status: CREATED
    contract FaultDisputeGame (0xf691F8A6d908B58C534B624cF16495b491E633BA)
    +++ description: None
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20188703 (main branch discovery), not current.

```diff
    contract FaultDisputeGame (0x4146DF64D83acB0DcB0c1a4884a16f090165e122) {
    +++ description: None
      values.getNumToResolve:
+        [0,0,0,0,0]
      values.resolutionCheckpoints:
+        [[false,0,0,"0x0000000000000000000000000000000000000000"],[false,0,0,"0x0000000000000000000000000000000000000000"],[false,0,0,"0x0000000000000000000000000000000000000000"],[false,0,0,"0x0000000000000000000000000000000000000000"],[false,0,0,"0x0000000000000000000000000000000000000000"]]
      values.resolvedSubgames:
+        [false,false,false,false,false]
      errors:
+        {"getNumToResolve":"Too many values. Update configuration to explore fully","resolutionCheckpoints":"Too many values. Update configuration to explore fully","resolvedSubgames":"Too many values. Update configuration to explore fully"}
    }
```

```diff
    contract PermissionedDisputeGame (0xE9daD167EF4DE8812C1abD013Ac9570C616599A0) {
    +++ description: None
      values.getNumToResolve:
+        [0,0,0,0,0]
      values.resolutionCheckpoints:
+        [[false,0,0,"0x0000000000000000000000000000000000000000"],[false,0,0,"0x0000000000000000000000000000000000000000"],[false,0,0,"0x0000000000000000000000000000000000000000"],[false,0,0,"0x0000000000000000000000000000000000000000"],[false,0,0,"0x0000000000000000000000000000000000000000"]]
      values.resolvedSubgames:
+        [false,false,false,false,false]
      errors:
+        {"getNumToResolve":"Too many values. Update configuration to explore fully","resolutionCheckpoints":"Too many values. Update configuration to explore fully","resolvedSubgames":"Too many values. Update configuration to explore fully"}
    }
```

Generated with discovered.json: 0xbb4c91641c0bf25a3e6c9e69893a5e2edc9eb451

# Diff at Fri, 12 Jul 2024 11:52:45 GMT:

- chain: optimism
- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@d6f7bd1c3a10712b93b6891cc6ca39616765a983 block: 121899221
- current block number: 122593187

## Description

The changes are due to the [OP Mainnet 'Fjord' upgrade](https://gov.optimism.io/t/upgrade-proposal-9-fjord-network-upgrade/8236).

The GasPriceOracle predeploy is changed to use a FastLZ-based compression estimator for gas price estimation. (compare [the spec](https://github.com/ethereum-optimism/specs/blob/main/specs/protocol/fjord/exec-engine.md#fees))

## Watched changes

```diff
    contract GasPriceOracle (0x420000000000000000000000000000000000000F) {
    +++ description: None
      values.$implementation:
-        "0xb528D11cC114E026F138fE568744c6D45ce6Da7A"
+        "0xa919894851548179A0750865e7974DA599C0Fac7"
      values.baseFeeScalar:
-        1368
+        5227
      values.version:
-        "1.2.0"
+        "1.3.0"
      values.isFjord:
+        true
    }
```

```diff
    contract L1Block (0x4200000000000000000000000000000000000015) {
    +++ description: None
      values.baseFeeScalar:
-        1368
+        5227
    }
```

## Source code changes

```diff
.../GasPriceOracle/GasPriceOracle.sol              | 558 ++++++++++++++++++---
 1 file changed, 493 insertions(+), 65 deletions(-)
```

Generated with discovered.json: 0x30dae19859608d0e7e7778237f60c0357f680e61

# Diff at Fri, 28 Jun 2024 07:31:54 GMT:

- chain: ethereum
- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@555efdd96fadc389c2c70beacf820125fbb25a7d block: 20175040
- current block number: 20188703

## Description

Changed SystemConfig owner from FoundationMultisig_2 (5/7) to FoundationMultisig_1 (5/7).

## Watched changes

```diff
    contract SystemConfig (0x229047fed2591dbec1eF1118d64F7aF3dB9EB290) {
    +++ description: None
      values.owner:
-        "0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A"
+        "0x847B5c174615B1B7fDF770882256e2D3E95b9D92"
    }
```

Generated with discovered.json: 0x010f9329c5b32c1c688ec638d3dd7adefe490a80

# Diff at Wed, 26 Jun 2024 10:20:31 GMT:

- chain: optimism
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@cb9200e010745e10244c0b3851b3acf21fe41f31 block: 121593875
- current block number: 121899221

## Description

Ignored.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 121593875 (main branch discovery), not current.

```diff
    contract BaseFeeVault (0x4200000000000000000000000000000000000019) {
    +++ description: None
      values.totalProcessed:
-        "1928902844154653024561"
    }
```

```diff
    contract L1FeeVault (0x420000000000000000000000000000000000001A) {
    +++ description: None
      values.totalProcessed:
-        "11679962820116169091101"
    }
```

Generated with discovered.json: 0x19ad81c5f5a060678a0f05245c18f2d580870d4a

# Diff at Tue, 11 Jun 2024 15:10:44 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@7b9a39f700e84af1cffa010ce0e20e64b23a4c64 block: 20067517
- current block number: 20069391

## Description

Config related, ignore spam.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20067517 (main branch discovery), not current.

```diff
    contract SystemConfig (0x229047fed2591dbec1eF1118d64F7aF3dB9EB290) {
    +++ description: None
      values.resourceConfig:
-        [20000000,10,8,1000000000,1000000,"340282366920938463463374607431768211455"]
+        {"maxResourceLimit":20000000,"elasticityMultiplier":10,"baseFeeMaxChangeDenominator":8,"minimumBaseFee":1000000000,"systemTxMaxGas":1000000,"maximumBaseFee":"340282366920938463463374607431768211455"}
    }
```

```diff
    contract FaultDisputeGame (0x4146DF64D83acB0DcB0c1a4884a16f090165e122) {
    +++ description: None
      values.gameData:
-        [0,"0x0000000000000000000000000000000000000000000000000000000000000000","0x0000000000000000000000000000000000000000000000000000000000000000"]
+        {"gameType_":0,"rootClaim_":"0x0000000000000000000000000000000000000000000000000000000000000000","extraData_":"0x0000000000000000000000000000000000000000000000000000000000000000"}
      values.startingOutputRoot:
-        ["0x0000000000000000000000000000000000000000000000000000000000000000",0]
+        {"root":"0x0000000000000000000000000000000000000000000000000000000000000000","l2BlockNumber":0}
    }
```

```diff
    contract PermissionedDisputeGame (0xE9daD167EF4DE8812C1abD013Ac9570C616599A0) {
    +++ description: None
      values.gameData:
-        [1,"0x0000000000000000000000000000000000000000000000000000000000000000","0x0000000000000000000000000000000000000000000000000000000000000000"]
+        {"gameType_":1,"rootClaim_":"0x0000000000000000000000000000000000000000000000000000000000000000","extraData_":"0x0000000000000000000000000000000000000000000000000000000000000000"}
      values.startingOutputRoot:
-        ["0x0000000000000000000000000000000000000000000000000000000000000000",0]
+        {"root":"0x0000000000000000000000000000000000000000000000000000000000000000","l2BlockNumber":0}
    }
```

Generated with discovered.json: 0xc5eed77bd737b6f96961ef8ac1380b3dcfc065b1

# Diff at Tue, 11 Jun 2024 10:11:02 GMT:

- chain: optimism
- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@6a747b8f93a46c87e2494c6adb06df4640d08444 block: 121202053
- current block number: 121250937

## Description

The ProxyAdmin owner is now the same as L1 (but aliased).

## Watched changes

```diff
-   Status: DELETED
    contract InternalProxyAdminOwnerMultisig1 (0x28B1eE885034ccD2d5Fa228a9A3157390D27177C)
    +++ description: None
```

```diff
    contract L2ProxyAdmin (0x4200000000000000000000000000000000000018) {
    +++ description: None
      values.owner:
-        "0x7871d1187A97cbbE40710aC119AA3d412944e4Fe"
+        "0x6B1BAE59D09fCcbdDB6C6cceb07B7279367C4E3b"
    }
```

```diff
-   Status: DELETED
    contract L2ProxyAdminOwner (0x7871d1187A97cbbE40710aC119AA3d412944e4Fe)
    +++ description: None
```

## Source code changes

```diff
.../GnosisSafeL2.sol => /dev/null                  | 1031 --------------------
 .../GnosisSafeProxy.p.sol => /dev/null             |   34 -
 .../GnosisSafeL2.sol => /dev/null                  | 1031 --------------------
 .../GnosisSafeProxy.p.sol => /dev/null             |   34 -
 4 files changed, 2130 deletions(-)
```

Generated with discovered.json: 0x5794d6cdac900458e007cfc157f752ad75a4602b

# Diff at Tue, 11 Jun 2024 08:53:37 GMT:

- chain: ethereum
- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@6a747b8f93a46c87e2494c6adb06df4640d08444 block: 20025146
- current block number: 20067517

## Description

Introduction of permissionless fraud proofs and permissions update to be Stage 1.

## Watched changes

```diff
    contract SystemConfig (0x229047fed2591dbec1eF1118d64F7aF3dB9EB290) {
    +++ description: None
      upgradeability.implementation:
-        "0xba2492e52F45651B60B8B38d4Ea5E2390C64Ffb1"
+        "0xF56D96B2535B932656d3c04Ebf51baBff241D886"
      implementations.0:
-        "0xba2492e52F45651B60B8B38d4Ea5E2390C64Ffb1"
+        "0xF56D96B2535B932656d3c04Ebf51baBff241D886"
      values.L2_OUTPUT_ORACLE_SLOT:
-        "0xe52a667f71ec761b9b381c7b76ca9b852adf7e8905da0e0ad49986a0a6871815"
      values.l2OutputOracle:
-        "0xdfe97868233d1aa22e815a266982f2cf17685a27"
      values.version:
-        "1.12.0"
+        "2.2.0"
      values.DISPUTE_GAME_FACTORY_SLOT:
+        "0x52322a25d9f59ea17656545543306b7aef62bc0cc53a0e65ccfa0c75b97aa906"
      values.disputeGameFactory:
+        "0xe5965Ab5962eDc7477C8520243A95517CD252fA9"
      values.maximumGasLimit:
+        200000000
    }
```

```diff
    contract SuperchainConfig (0x95703e0982140D16f8ebA6d158FccEde42f04a4C) {
    +++ description: None
      values.guardian:
-        "0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A"
+        "0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2"
    }
```

```diff
    contract OptimismPortal (0xbEb5Fc579115071764c7423A4f12eDde41f106Ed) {
    +++ description: None
      upgradeability.implementation:
-        "0x2D778797049FE9259d947D1ED8e5442226dFB589"
+        "0xe2F826324b2faf99E513D16D266c3F80aE87832B"
      implementations.0:
-        "0x2D778797049FE9259d947D1ED8e5442226dFB589"
+        "0xe2F826324b2faf99E513D16D266c3F80aE87832B"
      values.guardian:
-        "0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A"
+        "0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2"
      values.GUARDIAN:
-        "0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A"
      values.L2_ORACLE:
-        "0xdfe97868233d1aa22e815a266982f2cf17685a27"
      values.l2Oracle:
-        "0xdfe97868233d1aa22e815a266982f2cf17685a27"
      values.SYSTEM_CONFIG:
-        "0x229047fed2591dbec1eF1118d64F7aF3dB9EB290"
      values.version:
-        "2.5.0"
+        "3.10.0"
      values.disputeGameFactory:
+        "0xe5965Ab5962eDc7477C8520243A95517CD252fA9"
      values.disputeGameFinalityDelaySeconds:
+        302400
      values.proofMaturityDelaySeconds:
+        604800
      values.respectedGameType:
+        0
      values.respectedGameTypeUpdatedAt:
+        1718037779
      derivedName:
-        "OptimismPortal"
+        "OptimismPortal2"
    }
```

```diff
    contract SecurityCouncilMultisig (0xc2819DC788505Aac350142A7A707BF9D03E3Bd03) {
    +++ description: None
      upgradeability.modules.0:
+        "0x0454092516c9A4d636d3CAfA1e82161376C8a748"
      upgradeability.threshold:
-        "4 of 13 (31%)"
+        "10 of 13 (77%)"
      values.getThreshold:
-        4
+        10
    }
```

```diff
-   Status: DELETED
    contract L2OutputOracle (0xdfe97868233d1aa22e815a266982f2cf17685a27)
    +++ description: None
```

```diff
+   Status: CREATED
    contract LivenessModule (0x0454092516c9A4d636d3CAfA1e82161376C8a748)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GuardianMultisig (0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2)
    +++ description: None
```

```diff
+   Status: CREATED
    contract MIPS (0x0f8EdFbDdD3c0256A80AD8C0F2560B1807873C9c)
    +++ description: None
```

```diff
+   Status: CREATED
    contract AnchorStateRegistry (0x18DAc71c228D1C32c99489B7323d441E1175e443)
    +++ description: None
```

```diff
+   Status: CREATED
    contract LivenessGuard (0x24424336F04440b1c28685a38303aC33C9D14a25)
    +++ description: None
```

```diff
+   Status: CREATED
    contract FaultDisputeGame (0x4146DF64D83acB0DcB0c1a4884a16f090165e122)
    +++ description: None
```

```diff
+   Status: CREATED
    contract DeputyGuardianModule (0x5dC91D01290af474CE21DE14c17335a6dEe4d2a8)
    +++ description: None
```

```diff
+   Status: CREATED
    contract PreimageOracle (0xD326E10B8186e90F4E2adc5c13a2d0C137ee8b34)
    +++ description: None
```

```diff
+   Status: CREATED
    contract DelayedWETH (0xE497B094d6DbB3D5E4CaAc9a14696D7572588d14)
    +++ description: None
```

```diff
+   Status: CREATED
    contract DisputeGameFactory (0xe5965Ab5962eDc7477C8520243A95517CD252fA9)
    +++ description: None
```

```diff
+   Status: CREATED
    contract PermissionedDisputeGame (0xE9daD167EF4DE8812C1abD013Ac9570C616599A0)
    +++ description: None
```

## Source code changes

```diff
.../AnchorStateRegistry/AnchorStateRegistry.sol    |  414 +++
 .../ethereum/.flat/AnchorStateRegistry/Proxy.p.sol |  199 +
 .../ethereum/.flat/DelayedWETH/DelayedWETH.sol     |  649 ++++
 .../ethereum/.flat/DelayedWETH/Proxy.p.sol         |  199 +
 .../ethereum/.flat/DeputyGuardianModule.sol        |  139 +
 .../DisputeGameFactory/DisputeGameFactory.sol      | 1549 ++++++++
 .../ethereum/.flat/DisputeGameFactory/Proxy.p.sol  |  199 +
 .../optimism/ethereum/.flat/FaultDisputeGame.sol   | 3700 +++++++++++++++++++
 .../ethereum/.flat/GuardianMultisig/GnosisSafe.sol |  952 +++++
 .../.flat/GuardianMultisig/GnosisSafeProxy.p.sol   |   34 +
 .../L2OutputOracle/L2OutputOracle.sol => /dev/null |  678 ----
 .../L2OutputOracle/Proxy.p.sol => /dev/null        |  210 --
 .../optimism/ethereum/.flat/LivenessGuard.sol      |  581 +++
 .../optimism/ethereum/.flat/LivenessModule.sol     |  257 ++
 .../optimism/ethereum/.flat/MIPS.sol               | 1103 ++++++
 .../OptimismPortal/OptimismPortal2.sol}            |  512 ++-
 .../ethereum/.flat/PermissionedDisputeGame.sol     | 3815 ++++++++++++++++++++
 .../optimism/ethereum/.flat/PreimageOracle.sol     | 1309 +++++++
 .../SystemConfig/SystemConfig.sol                  |   48 +-
 19 files changed, 15451 insertions(+), 1096 deletions(-)
```

Generated with discovered.json: 0xf3841b075c5c5f1392147ee9bf27462c6692ba7e

# Diff at Mon, 10 Jun 2024 07:01:37 GMT:

- chain: optimism
- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@023db9216bab49e9b3ffde0e43664e3e63c60fcf block: 120992980
- current block number: 121202053

## Description

Ignored.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 120992980 (main branch discovery), not current.

```diff
    contract SequencerFeeVault (0x4200000000000000000000000000000000000011) {
    +++ description: None
      values.totalProcessed:
-        "3495563082937265797169"
    }
```

Generated with discovered.json: 0xa1d57f190fbdfb73f7171e0322ccf7bddd4a21c9

# Diff at Wed, 05 Jun 2024 10:52:26 GMT:

- chain: optimism
- author: Luca Donno (<donnoh99@gmail.com>)
- current block number: 120992980

## Description

Provide description of changes. This section will be preserved.

## Initial discovery

```diff
+   Status: CREATED
    contract InternalProxyAdminOwnerMultisig1 (0x28B1eE885034ccD2d5Fa228a9A3157390D27177C)
    +++ description: None
```

```diff
+   Status: CREATED
    contract MintManagerOwner (0x2A82Ae142b2e62Cb7D10b55E323ACB1Cab663a26)
    +++ description: None
```

```diff
+   Status: CREATED
    contract DeployerWhitelist (0x4200000000000000000000000000000000000002)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L2CrossDomainMessenger (0x4200000000000000000000000000000000000007)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GasPriceOracle (0x420000000000000000000000000000000000000F)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L2StandardBridge (0x4200000000000000000000000000000000000010)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SequencerFeeVault (0x4200000000000000000000000000000000000011)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OptimismMintableERC20Factory (0x4200000000000000000000000000000000000012)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1BlockNumber (0x4200000000000000000000000000000000000013)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L2ERC721Bridge (0x4200000000000000000000000000000000000014)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1Block (0x4200000000000000000000000000000000000015)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L2ToL1MessagePasser (0x4200000000000000000000000000000000000016)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OptimismMintableERC721Factory (0x4200000000000000000000000000000000000017)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L2ProxyAdmin (0x4200000000000000000000000000000000000018)
    +++ description: None
```

```diff
+   Status: CREATED
    contract BaseFeeVault (0x4200000000000000000000000000000000000019)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1FeeVault (0x420000000000000000000000000000000000001A)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SchemaRegistry (0x4200000000000000000000000000000000000020)
    +++ description: None
```

```diff
+   Status: CREATED
    contract EAS (0x4200000000000000000000000000000000000021)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OPToken (0x4200000000000000000000000000000000000042)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OldQuixoticNFTBridge (0x5a7749f83b81B301cAb5f48EB8516B986DAef23D)
    +++ description: None
```

```diff
+   Status: CREATED
    contract MintManager (0x5C4e7Ba1E219E47948e6e3F55019A647bA501005)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L2ProxyAdminOwner (0x7871d1187A97cbbE40710aC119AA3d412944e4Fe)
    +++ description: None
```

Generated with discovered.json: 0x2e96b99a18a238b80113eef0b15038b22f19a9eb

# Diff at Wed, 05 Jun 2024 10:52:13 GMT:

- chain: ethereum
- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@2d4052223220f6bca7a10a92f78dc445f890f114 block: 19875796
- current block number: 20025146

## Description

Provide description of changes. This section will be preserved.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19875796 (main branch discovery), not current.

```diff
+   Status: CREATED
    contract FeesCollector (0xa3d596EAfaB6B13Ab18D40FaE1A962700C84ADEa)
    +++ description: None
```

Generated with discovered.json: 0x2f397bd826fe7f9bf02d8d05820501cea74e396d

# Diff at Wed, 15 May 2024 13:52:02 GMT:

- chain: ethereum
- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@2a68252776877f0b82e9f7cf6261b744952be771 block: 19639423
- current block number: 19875796

## Description

One signer of the SynthetixMultisig (governing the SNX escrow) has been replaced: `0xEde8a407913A874Dd7e3d5B731AFcA135D30375E` replaced by `0xe2163dd599067919d1e9108929b568Bf41D3A420`.

## Watched changes

```diff
    contract SynthetixMultisig (0xEb3107117FEAd7de89Cd14D463D340A2E6917769) {
    +++ description: None
      values.getOwners.10:
-        "0xEde8a407913A874Dd7e3d5B731AFcA135D30375E"
+        "0x562948111d50BF039A39Eea48D127f2Ae51ddF02"
      values.getOwners.9:
-        "0x562948111d50BF039A39Eea48D127f2Ae51ddF02"
+        "0x1dd532CF7603a60C3ec91360f273DA3Db38545aB"
      values.getOwners.8:
-        "0x1dd532CF7603a60C3ec91360f273DA3Db38545aB"
+        "0x2d8cF727d37e7277D5eeDbAb853a3e8320f767Cd"
      values.getOwners.7:
-        "0x2d8cF727d37e7277D5eeDbAb853a3e8320f767Cd"
+        "0x347c3190bD015FBD0e47fb90AA4917138A8A32FE"
      values.getOwners.6:
-        "0x347c3190bD015FBD0e47fb90AA4917138A8A32FE"
+        "0xa2fa6Ef1Fcf740b632a04B3FC56B5d3118Bbd211"
      values.getOwners.5:
-        "0xa2fa6Ef1Fcf740b632a04B3FC56B5d3118Bbd211"
+        "0x599e835cbFC903eF09f3Dd5E08D1cF63c32AF8d8"
      values.getOwners.4:
-        "0x599e835cbFC903eF09f3Dd5E08D1cF63c32AF8d8"
+        "0xe1Efa5C91cA533E4a51884d805879249E3FCB2BC"
      values.getOwners.3:
-        "0xe1Efa5C91cA533E4a51884d805879249E3FCB2BC"
+        "0x8909F73188C4fE68B283fCB1E724b2466e0BdfD0"
      values.getOwners.2:
-        "0x8909F73188C4fE68B283fCB1E724b2466e0BdfD0"
+        "0x0B67bab43157e53D21965Af0d83f83BeD9553E0a"
      values.getOwners.1:
-        "0x0B67bab43157e53D21965Af0d83f83BeD9553E0a"
+        "0x26E10fF641839cA457695CE955Cb90657D6E3F53"
      values.getOwners.0:
-        "0x26E10fF641839cA457695CE955Cb90657D6E3F53"
+        "0xe2163dd599067919d1e9108929b568Bf41D3A420"
    }
```

Generated with discovered.json: 0xd4cc5d9bc127f06ecb0a0d9f2bf520df2ffc72d5

# Diff at Fri, 12 Apr 2024 12:08:01 GMT:

- chain: ethereum
- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@dfabb973c54d735b834c25775233fa7ed54bdc53 block: 19532035
- current block number: 19639423

## Description

Summary and rationale of the changes: <https://gov.optimism.io/t/upgrade-proposal-6-multi-chain-prep-mcp-l1/7677>

### SystemConfig

The SystemConfig now contains the addresses of all the contracts.

### OptimismPortal

The L2OutputOracle and the SystemConfig variables are no longer immutable. They're only modifiable via an upgrade, but now there is the advantage that different chains can share the same implementation: if they are immutable, the address is hardcoded into the bytecode instead, but now the only things that changes is the state of the proxy.

### L2OutputOracle

Immutable variables, including the challenger and the proposer are no longer immutable.

### L1StandardBridge

The messenger and other bridge on L2 are no longer immutable.

### L1CrossDomainMessenger

The OptimismPortal variable is no longer immutable.

## Watched changes

```diff
    contract SystemConfig (0x229047fed2591dbec1eF1118d64F7aF3dB9EB290) {
    +++ description: None
      upgradeability.implementation:
-        "0x33A032ec93Ec0C492Ec4BF0B30D5f51986E5a314"
+        "0xba2492e52F45651B60B8B38d4Ea5E2390C64Ffb1"
      implementations.0:
-        "0x33A032ec93Ec0C492Ec4BF0B30D5f51986E5a314"
+        "0xba2492e52F45651B60B8B38d4Ea5E2390C64Ffb1"
      values.version:
-        "1.11.0"
+        "1.12.0"
      values.BATCH_INBOX_SLOT:
+        "0x71ac12829d66ee73d8d95bff50b3589745ce57edae70a3fb111a2342464dc597"
      values.batchInbox:
+        "0xFF00000000000000000000000000000000000010"
      values.L1_CROSS_DOMAIN_MESSENGER_SLOT:
+        "0x383f291819e6d54073bc9a648251d97421076bdd101933c0c022219ce9580636"
      values.L1_ERC_721_BRIDGE_SLOT:
+        "0x46adcbebc6be8ce551740c29c47c8798210f23f7f4086c41752944352568d5a7"
      values.L1_STANDARD_BRIDGE_SLOT:
+        "0x9904ba90dde5696cda05c9e0dab5cbaa0fea005ace4d11218a02ac668dad6376"
      values.l1CrossDomainMessenger:
+        "0x25ace71c97B33Cc4729CF772ae268934F7ab5fA1"
      values.l1ERC721Bridge:
+        "0x5a7749f83b81B301cAb5f48EB8516B986DAef23D"
      values.l1StandardBridge:
+        "0x99C9fc46f92E8a1c0deC1b1747d010903E884bE1"
      values.L2_OUTPUT_ORACLE_SLOT:
+        "0xe52a667f71ec761b9b381c7b76ca9b852adf7e8905da0e0ad49986a0a6871815"
      values.l2OutputOracle:
+        "0xdfe97868233d1aa22e815a266982f2cf17685a27"
      values.OPTIMISM_MINTABLE_ERC20_FACTORY_SLOT:
+        "0xa04c5bb938ca6fc46d95553abf0a76345ce3e722a30bf4f74928b8e7d852320c"
      values.OPTIMISM_PORTAL_SLOT:
+        "0x4b6c74f9e688cb39801f2112c14a8c57232a3fc5202e1444126d4bce86eb19ac"
      values.optimismMintableERC20Factory:
+        "0x75505a97BD334E7BD3C476893285569C4136Fa0F"
      values.optimismPortal:
+        "0xbEb5Fc579115071764c7423A4f12eDde41f106Ed"
      values.START_BLOCK_SLOT:
+        "0xa11ee3ab75b40e88a0105e935d17cd36c8faee0138320d776c411291bdbbb19f"
      values.startBlock:
+        17422444
    }
```

```diff
    contract L1CrossDomainMessenger (0x25ace71c97B33Cc4729CF772ae268934F7ab5fA1) {
    +++ description: None
      upgradeability.implementation:
-        "0xa95B24af19f8907390eD15f8348A1a5e6Ccbc5C6"
+        "0xD3494713A5cfaD3F5359379DfA074E2Ac8C6Fd65"
      implementations.0:
-        "0xa95B24af19f8907390eD15f8348A1a5e6Ccbc5C6"
+        "0xD3494713A5cfaD3F5359379DfA074E2Ac8C6Fd65"
      values.version:
-        "2.2.0"
+        "2.3.0"
      values.otherMessenger:
+        "0x4200000000000000000000000000000000000007"
    }
```

```diff
    contract ProxyAdminOwner (0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A) {
    +++ description: None
      values.nonce:
-        1
+        2
    }
```

```diff
    contract FoundationMultisig_1 (0x847B5c174615B1B7fDF770882256e2D3E95b9D92) {
    +++ description: None
      values.nonce:
-        1
+        2
    }
```

```diff
    contract L1StandardBridge (0x99C9fc46f92E8a1c0deC1b1747d010903E884bE1) {
    +++ description: None
      upgradeability.implementation:
-        "0x566511a1A09561e2896F8c0fD77E8544E59bFDB0"
+        "0x64B5a5Ed26DCb17370Ff4d33a8D503f0fbD06CfF"
      implementations.0:
-        "0x566511a1A09561e2896F8c0fD77E8544E59bFDB0"
+        "0x64B5a5Ed26DCb17370Ff4d33a8D503f0fbD06CfF"
      values.version:
-        "2.0.0"
+        "2.1.0"
    }
```

```diff
    contract OptimismPortal (0xbEb5Fc579115071764c7423A4f12eDde41f106Ed) {
    +++ description: None
      upgradeability.implementation:
-        "0xaBAbe63514dDd6277356F8cc3d6518aA8BDEB4de"
+        "0x2D778797049FE9259d947D1ED8e5442226dFB589"
      implementations.0:
-        "0xaBAbe63514dDd6277356F8cc3d6518aA8BDEB4de"
+        "0x2D778797049FE9259d947D1ED8e5442226dFB589"
      values.version:
-        "2.4.0"
+        "2.5.0"
    }
```

```diff
    contract SecurityCouncilMultisig (0xc2819DC788505Aac350142A7A707BF9D03E3Bd03) {
    +++ description: None
      values.nonce:
-        1
+        2
    }
```

```diff
    contract L2OutputOracle (0xdfe97868233d1aa22e815a266982f2cf17685a27) {
    +++ description: None
      upgradeability.implementation:
-        "0xDb5d932AF15D00F879CaBEbf008caDAAAa691e06"
+        "0xF243BEd163251380e78068d317ae10f26042B292"
      implementations.0:
-        "0xDb5d932AF15D00F879CaBEbf008caDAAAa691e06"
+        "0xF243BEd163251380e78068d317ae10f26042B292"
      values.version:
-        "1.7.0"
+        "1.8.0"
    }
```

```diff
+   Status: CREATED
    contract L1ERC721Bridge (0x5a7749f83b81B301cAb5f48EB8516B986DAef23D)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OptimismMintableERC20Factory (0x75505a97BD334E7BD3C476893285569C4136Fa0F)
    +++ description: None
```

## Source code changes

```diff
.../L1CrossDomainMessenger/implementation/meta.txt |   2 +-
 .../src/L1/L1CrossDomainMessenger.sol              |  50 ++-
 .../implementation/src/L1/L2OutputOracle.sol       | 151 ++++---
 .../implementation/src/L1/OptimismPortal.sol       | 100 +++--
 .../implementation/src/L1/SystemConfig.sol         | 166 +++++--
 .../src/universal/CrossDomainMessenger.sol         |  42 +-
 .../contracts/proxy/utils/Initializable.sol        | 138 ++++++
 .../contracts/token/ERC20/ERC20.sol                | 383 ++++++++++++++++
 .../contracts/token/ERC20/IERC20.sol               |  82 ++++
 .../token/ERC20/extensions/IERC20Metadata.sol      |  28 ++
 .../token/ERC20/extensions/draft-IERC20Permit.sol  |  60 +++
 .../contracts/token/ERC20/utils/SafeERC20.sol      | 116 +++++
 .../contracts/token/ERC721/IERC721.sol             | 143 ++++++
 .../token/ERC721/extensions/IERC721Enumerable.sol  |  29 ++
 .../contracts/utils/Address.sol                    | 222 ++++++++++
 .../contracts/utils/Context.sol                    |  24 +
 .../utils/introspection/ERC165Checker.sol          | 123 ++++++
 .../contracts/utils/introspection/IERC165.sol      |  25 ++
 .../contracts/utils/math/Math.sol                  | 226 ++++++++++
 .../contracts/utils/math/SignedMath.sol            |  43 ++
 .../contracts/proxy/utils/Initializable.sol        | 138 ++++++
 .../contracts/utils/AddressUpgradeable.sol         | 195 ++++++++
 .../lib/solmate/src/utils/FixedPointMathLib.sol    | 366 +++++++++++++++
 .../.code/L1ERC721Bridge/implementation/meta.txt   |   2 +
 .../implementation/src/L1/L1ERC721Bridge.sol       | 121 +++++
 .../implementation/src/L1/ResourceMetering.sol     | 162 +++++++
 .../implementation/src/L1/SuperchainConfig.sol     |  94 ++++
 .../implementation/src/L2/L2ERC721Bridge.sol       | 126 ++++++
 .../implementation/src/libraries/Arithmetic.sol    |  28 ++
 .../implementation/src/libraries/Burn.sol          |  32 ++
 .../implementation/src/libraries/Constants.sol     |  46 ++
 .../implementation/src/libraries/Encoding.sol      | 176 ++++++++
 .../implementation/src/libraries/Hashing.sol       | 124 ++++++
 .../implementation/src/libraries/Predeploys.sol    | 113 +++++
 .../implementation/src/libraries/SafeCall.sol      | 142 ++++++
 .../implementation/src/libraries/Storage.sol       |  88 ++++
 .../implementation/src/libraries/Types.sol         |  70 +++
 .../implementation/src/libraries/rlp/RLPWriter.sol | 163 +++++++
 .../src/universal/CrossDomainMessenger.sol         | 406 +++++++++++++++++
 .../implementation/src/universal/ERC721Bridge.sol  | 195 ++++++++
 .../src/universal/IOptimismMintableERC20.sol       |  31 ++
 .../src/universal/IOptimismMintableERC721.sol      |  48 ++
 .../implementation/src/universal/ISemver.sol       |  13 +
 .../src/universal/OptimismMintableERC20.sol        | 140 ++++++
 .../src/universal/StandardBridge.sol               | 489 +++++++++++++++++++++
 .../contracts/universal/Proxy.sol                  | 216 +++++++++
 .../ethereum/.code/L1ERC721Bridge/proxy/meta.txt   |   2 +
 .../L1StandardBridge/implementation/meta.txt       |   2 +-
 .../implementation/src/L1/L1StandardBridge.sol     |  22 +-
 .../src/universal/CrossDomainMessenger.sol         |  42 +-
 .../src/universal/StandardBridge.sol               |  82 ++--
 .../L2OutputOracle/implementation/meta.txt         |   2 +-
 .../implementation/src/L1/L2OutputOracle.sol       | 151 ++++---
 .../contracts/proxy/utils/Initializable.sol        | 138 ++++++
 .../contracts/token/ERC20/ERC20.sol                | 383 ++++++++++++++++
 .../contracts/token/ERC20/IERC20.sol               |  82 ++++
 .../token/ERC20/extensions/IERC20Metadata.sol      |  28 ++
 .../contracts/utils/Address.sol                    | 222 ++++++++++
 .../contracts/utils/Context.sol                    |  24 +
 .../contracts/utils/introspection/IERC165.sol      |  25 ++
 .../implementation/meta.txt                        |   2 +
 .../src/universal/IOptimismMintableERC20.sol       |  31 ++
 .../implementation/src/universal/ISemver.sol       |  13 +
 .../src/universal/OptimismMintableERC20.sol        | 140 ++++++
 .../src/universal/OptimismMintableERC20Factory.sol | 132 ++++++
 .../proxy/contracts/universal/Proxy.sol            | 217 +++++++++
 .../OptimismMintableERC20Factory/proxy/meta.txt    |   2 +
 .../OptimismPortal/implementation/meta.txt         |   2 +-
 .../implementation/src/L1/L2OutputOracle.sol       | 151 ++++---
 .../implementation/src/L1/OptimismPortal.sol       | 100 +++--
 .../implementation/src/L1/SystemConfig.sol         | 166 +++++--
 .../SystemConfig/implementation/meta.txt           |   2 +-
 .../implementation/src/L1/SystemConfig.sol         | 166 +++++--
 73 files changed, 7739 insertions(+), 467 deletions(-)
```

Generated with discovered.json: 0xacb5d4376948d7d85443329dcc1ddcbba2f3598f

# Diff at Thu, 28 Mar 2024 10:32:56 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@dd32bb06b292cc8459fb09925454ee3a90f5c27e block: 19439798
- current block number: 19532035

## Description

Update discovery to include the multisig threshold.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19439798 (main branch discovery), not current.

```diff
    contract GnosisSafe (0x42d27eEA1AD6e22Af6284F609847CB3Cd56B9c64) {
    +++ description: None
      upgradeability.threshold:
+        "2 of 2 (100%)"
    }
```

```diff
    contract ProxyAdminOwner (0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A) {
    +++ description: None
      upgradeability.threshold:
+        "2 of 2 (100%)"
    }
```

```diff
    contract FoundationMultisig_1 (0x847B5c174615B1B7fDF770882256e2D3E95b9D92) {
    +++ description: None
      upgradeability.threshold:
+        "5 of 7 (71%)"
    }
```

```diff
    contract FoundationMultisig_2 (0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A) {
    +++ description: None
      upgradeability.threshold:
+        "5 of 7 (71%)"
    }
```

```diff
    contract SecurityCouncilMultisig (0xc2819DC788505Aac350142A7A707BF9D03E3Bd03) {
    +++ description: None
      upgradeability.threshold:
+        "4 of 13 (31%)"
    }
```

```diff
    contract SynthetixMultisig (0xEb3107117FEAd7de89Cd14D463D340A2E6917769) {
    +++ description: None
      upgradeability.threshold:
+        "5 of 11 (45%)"
    }
```

Generated with discovered.json: 0xe51a8b638c121d61ad42bd18332c0850a4046684

# Diff at Thu, 14 Mar 2024 00:15:18 GMT:

- chain: ethereum
- author: Michał Sobieraj-Jakubiec (<michalsidzej@gmail.com>)
- comparing to: main@e9ab5d808868ba1ecef1f4a9acee050bd71c3c54 block: 19411918
- current block number: 19429627

## Description

Optimism uses blobs

## Watched changes

```diff
    contract SystemConfig (0x229047fed2591dbec1eF1118d64F7aF3dB9EB290) {
    +++ description: None
      values.opStackDA.isSequencerSendingBlobTx:
-        false
+        true
      values.overhead:
-        188
+        0
      values.scalar:
-        684000
+        "452312848583266388373324160190187140051835877600158453279134670530344387928"
    }
```

Generated with discovered.json: 0xd34811c5c471b7976f33f0c576b6903f21608d61

# Diff at Mon, 11 Mar 2024 12:48:08 GMT:

- chain: ethereum
- author: Michał Sobieraj-Jakubiec (<michalsidzej@gmail.com>)
- comparing to: main@64454506aee2b4b4e15b121f096369e92ec4cf20 block: 19379201
- current block number: 19411918

## Description

Update OP stack DA handler

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19379201 (main branch discovery), not current.

```diff
    contract SystemConfig (0x229047fed2591dbec1eF1118d64F7aF3dB9EB290) {
    +++ description: None
      values.opStackDA.isSequencerSendingBlobTx:
+        false
    }
```

Generated with discovered.json: 0x73720a3eaa19fcaa23f7cfa430c9ea5d48aa25df

# Diff at Wed, 06 Mar 2024 22:46:02 GMT:

- chain: ethereum
- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@237a9d8802d6b77ea68f596e77a028c3f0e27e68 block: 19210753
- current block number: 19379201

## Description

Introduced SuperchainConfig contract, able to pause the following functions:
OptimismPortal.proveWithdrawalTransaction()
OptimismPortal.finalizeWithdrawalTransaction()
L1CrossDomainMessenger.relayMessage()
StandardBridge.finalizeBridgeERC20()
StandardBridge.finalizeBridgeETH()
L1ERC721Bridge.finalizeBridgeERC721().

## Watched changes

```diff
    contract SystemConfig (0x229047fed2591dbec1eF1118d64F7aF3dB9EB290) {
    +++ description: None
      upgradeability.implementation:
-        "0x5efa852e92800D1C982711761e45c3FE39a2b6D8"
+        "0x33A032ec93Ec0C492Ec4BF0B30D5f51986E5a314"
      implementations.0:
-        "0x5efa852e92800D1C982711761e45c3FE39a2b6D8"
+        "0x33A032ec93Ec0C492Ec4BF0B30D5f51986E5a314"
      values.version:
-        "1.3.0"
+        "1.11.0"
    }
```

```diff
    contract L1CrossDomainMessenger (0x25ace71c97B33Cc4729CF772ae268934F7ab5fA1) {
    +++ description: None
      upgradeability.implementation:
-        "0x2150Bc3c64cbfDDbaC9815EF615D6AB8671bfe43"
+        "0xa95B24af19f8907390eD15f8348A1a5e6Ccbc5C6"
      implementations.0:
-        "0x2150Bc3c64cbfDDbaC9815EF615D6AB8671bfe43"
+        "0xa95B24af19f8907390eD15f8348A1a5e6Ccbc5C6"
      values.version:
-        "1.4.0"
+        "2.2.0"
      values.paused:
+        false
      values.portal:
+        "0xbEb5Fc579115071764c7423A4f12eDde41f106Ed"
      values.superchainConfig:
+        "0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
    }
```

```diff
    contract ProxyAdminOwner (0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A) {
    +++ description: None
      values.nonce:
-        0
+        1
    }
```

```diff
    contract FoundationMultisig_1 (0x847B5c174615B1B7fDF770882256e2D3E95b9D92) {
    +++ description: None
      values.nonce:
-        0
+        1
    }
```

```diff
    contract L1StandardBridge (0x99C9fc46f92E8a1c0deC1b1747d010903E884bE1) {
    +++ description: None
      upgradeability.implementation:
-        "0xBFB731Cd36D26c2a7287716DE857E4380C73A64a"
+        "0x566511a1A09561e2896F8c0fD77E8544E59bFDB0"
      implementations.0:
-        "0xBFB731Cd36D26c2a7287716DE857E4380C73A64a"
+        "0x566511a1A09561e2896F8c0fD77E8544E59bFDB0"
      values.version:
-        "1.1.0"
+        "2.0.0"
      values.otherBridge:
+        "0x4200000000000000000000000000000000000010"
      values.paused:
+        false
      values.superchainConfig:
+        "0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
    }
```

```diff
    contract OptimismPortal (0xbEb5Fc579115071764c7423A4f12eDde41f106Ed) {
    +++ description: None
      upgradeability.implementation:
-        "0x28a55488fef40005309e2DA0040DbE9D300a64AB"
+        "0xaBAbe63514dDd6277356F8cc3d6518aA8BDEB4de"
      implementations.0:
-        "0x28a55488fef40005309e2DA0040DbE9D300a64AB"
+        "0xaBAbe63514dDd6277356F8cc3d6518aA8BDEB4de"
      values.version:
-        "1.6.0"
+        "2.4.0"
      values.guardian:
+        "0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A"
      values.l2Oracle:
+        "0xdfe97868233d1aa22e815a266982f2cf17685a27"
      values.superchainConfig:
+        "0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
      values.systemConfig:
+        "0x229047fed2591dbec1eF1118d64F7aF3dB9EB290"
    }
```

```diff
    contract SecurityCouncilMultisig (0xc2819DC788505Aac350142A7A707BF9D03E3Bd03) {
    +++ description: None
      values.nonce:
-        0
+        1
    }
```

```diff
    contract L2OutputOracle (0xdfe97868233d1aa22e815a266982f2cf17685a27) {
    +++ description: None
      upgradeability.implementation:
-        "0xd2E67B6a032F0A9B1f569E63ad6C38f7342c2e00"
+        "0xDb5d932AF15D00F879CaBEbf008caDAAAa691e06"
      implementations.0:
-        "0xd2E67B6a032F0A9B1f569E63ad6C38f7342c2e00"
+        "0xDb5d932AF15D00F879CaBEbf008caDAAAa691e06"
      values.version:
-        "1.3.0"
+        "1.7.0"
      values.challenger:
+        "0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A"
      values.finalizationPeriodSeconds:
+        604800
      values.l2BlockTime:
+        2
      values.proposer:
+        "0x473300df21D047806A082244b417f96b32f13A33"
      values.submissionInterval:
+        1800
    }
```

```diff
+   Status: CREATED
    contract SuperchainConfig (0x95703e0982140D16f8ebA6d158FccEde42f04a4C)
    +++ description: None
```

## Source code changes

```diff
.../L1/L1CrossDomainMessenger.sol => /dev/null     |  67 ---
 .../contracts/L1/L2OutputOracle.sol => /dev/null   | 350 -------------
 .../contracts/L1/SystemConfig.sol => /dev/null     | 297 -----------
 .../libraries/Arithmetic.sol => /dev/null          |  48 --
 .../contracts/libraries/Burn.sol => /dev/null      |  42 --
 .../contracts/libraries/Bytes.sol => /dev/null     | 142 ------
 .../contracts/libraries/Constants.sol => /dev/null |  49 --
 .../contracts/libraries/Encoding.sol => /dev/null  | 162 ------
 .../contracts/libraries/Hashing.sol => /dev/null   | 172 -------
 .../libraries/Predeploys.sol => /dev/null          | 112 ----
 .../contracts/libraries/SafeCall.sol => /dev/null  | 160 ------
 .../contracts/libraries/Types.sol => /dev/null     |  84 ---
 .../libraries/rlp/RLPWriter.sol => /dev/null       | 221 --------
 .../trie/SecureMerkleTrie.sol => /dev/null         |  64 ---
 .../CrossDomainMessenger.sol => /dev/null          | 519 -------------------
 .../contracts/universal/Semver.sol => /dev/null    |  58 ---
 .../contracts/proxy/utils/Initializable.sol        |   0
 .../contracts/utils/Address.sol                    |   0
 .../contracts/utils/math/Math.sol                  |   0
 .../contracts/utils/math/SignedMath.sol            |   0
 .../contracts}/access/OwnableUpgradeable.sol       |   0
 .../contracts}/proxy/utils/Initializable.sol       |   0
 .../contracts}/utils/AddressUpgradeable.sol        |   0
 .../contracts}/utils/ContextUpgradeable.sol        |   0
 .../lib}/solmate/src/utils/FixedPointMathLib.sol   |   0
 .../L1CrossDomainMessenger/implementation/meta.txt |   2 +-
 .../contracts/utils/Strings.sol => /dev/null       |  75 ---
 .../src/L1/L1CrossDomainMessenger.sol              |  66 +++
 .../implementation/src/L1/L2OutputOracle.sol       | 296 +++++++++++
 .../implementation/src}/L1/OptimismPortal.sol      | 440 +++++++---------
 .../implementation/src}/L1/ResourceMetering.sol    | 124 ++---
 .../implementation/src/L1/SuperchainConfig.sol     |  94 ++++
 .../implementation/src/L1/SystemConfig.sol         | 255 ++++++++++
 .../implementation/src/libraries/Arithmetic.sol    |  28 +
 .../implementation/src/libraries/Burn.sol          |  32 ++
 .../implementation/src/libraries/Bytes.sol         | 144 ++++++
 .../implementation/src/libraries/Constants.sol     |  46 ++
 .../implementation/src/libraries/Encoding.sol      | 176 +++++++
 .../implementation/src/libraries/Hashing.sol       | 124 +++++
 .../implementation/src/libraries/Predeploys.sol    | 113 +++++
 .../implementation/src/libraries/SafeCall.sol      | 142 ++++++
 .../implementation/src/libraries/Storage.sol       |  88 ++++
 .../implementation/src/libraries/Types.sol         |  70 +++
 .../src}/libraries/rlp/RLPReader.sol               | 249 +++------
 .../implementation/src/libraries/rlp/RLPWriter.sol | 163 ++++++
 .../src}/libraries/trie/MerkleTrie.sol             | 210 +++-----
 .../src/libraries/trie/SecureMerkleTrie.sol        |  49 ++
 .../src/universal/CrossDomainMessenger.sol         | 400 +++++++++++++++
 .../implementation/src/universal/ISemver.sol       |  13 +
 .../src}/vendor/AddressAliasHelper.sol             |   0
 .../contracts/L1/L1StandardBridge.sol => /dev/null | 364 -------------
 .../libraries/Arithmetic.sol => /dev/null          |  48 --
 .../contracts/libraries/Burn.sol => /dev/null      |  42 --
 .../contracts/libraries/Constants.sol => /dev/null |  49 --
 .../contracts/libraries/Encoding.sol => /dev/null  | 162 ------
 .../contracts/libraries/Hashing.sol => /dev/null   | 172 -------
 .../libraries/Predeploys.sol => /dev/null          | 112 ----
 .../contracts/libraries/SafeCall.sol => /dev/null  | 160 ------
 .../contracts/libraries/Types.sol => /dev/null     |  84 ---
 .../libraries/rlp/RLPWriter.sol => /dev/null       | 221 --------
 .../CrossDomainMessenger.sol => /dev/null          | 519 -------------------
 .../OptimismMintableERC20.sol => /dev/null         | 149 ------
 .../contracts/universal/Semver.sol => /dev/null    |  58 ---
 .../universal/StandardBridge.sol => /dev/null      | 561 ---------------------
 .../contracts/proxy/utils/Initializable.sol        |   0
 .../contracts/token/ERC20/ERC20.sol                |   0
 .../contracts/token/ERC20/IERC20.sol               |   0
 .../token/ERC20/extensions/IERC20Metadata.sol      |   0
 .../token/ERC20/extensions/draft-IERC20Permit.sol  |   0
 .../contracts/token/ERC20/utils/SafeERC20.sol      |   0
 .../contracts/utils/Address.sol                    |   0
 .../contracts/utils/Context.sol                    |   0
 .../utils/introspection/ERC165Checker.sol          |   0
 .../contracts/utils/introspection/IERC165.sol      |   0
 .../contracts/utils/math/Math.sol                  |   0
 .../contracts/utils/math/SignedMath.sol            |   0
 .../contracts}/proxy/utils/Initializable.sol       |   0
 .../contracts}/utils/AddressUpgradeable.sol        |   0
 .../lib}/solmate/src/utils/FixedPointMathLib.sol   |   0
 .../L1StandardBridge/implementation/meta.txt       |   2 +-
 .../contracts/utils/Strings.sol => /dev/null       |  75 ---
 .../implementation/src/L1/L1StandardBridge.sol     | 317 ++++++++++++
 .../implementation/src}/L1/ResourceMetering.sol    | 124 ++---
 .../implementation/src/L1/SuperchainConfig.sol     |  94 ++++
 .../implementation/src/libraries/Arithmetic.sol    |  28 +
 .../implementation/src/libraries/Burn.sol          |  32 ++
 .../implementation/src/libraries/Constants.sol     |  46 ++
 .../implementation/src/libraries/Encoding.sol      | 176 +++++++
 .../implementation/src/libraries/Hashing.sol       | 124 +++++
 .../implementation/src/libraries/Predeploys.sol    | 113 +++++
 .../implementation/src/libraries/SafeCall.sol      | 142 ++++++
 .../implementation/src/libraries/Storage.sol       |  88 ++++
 .../implementation/src/libraries/Types.sol         |  70 +++
 .../implementation/src/libraries/rlp/RLPWriter.sol | 163 ++++++
 .../src/universal/CrossDomainMessenger.sol         | 400 +++++++++++++++
 .../src}/universal/IOptimismMintableERC20.sol      |  21 +-
 .../implementation/src/universal/ISemver.sol       |  13 +
 .../src/universal/OptimismMintableERC20.sol        | 140 +++++
 .../src/universal/StandardBridge.sol               | 475 +++++++++++++++++
 .../contracts/L1/L2OutputOracle.sol => /dev/null   | 350 -------------
 .../contracts/libraries/Types.sol => /dev/null     |  84 ---
 .../contracts/universal/Semver.sol => /dev/null    |  58 ---
 .../contracts/proxy/utils/Initializable.sol        |   0
 .../contracts/utils/Address.sol                    |   0
 .../contracts/utils/math/Math.sol                  |   0
 .../contracts/utils/math/SignedMath.sol            |   0
 .../lib}/solmate/src/utils/FixedPointMathLib.sol   |   0
 .../L2OutputOracle/implementation/meta.txt         |   2 +-
 .../contracts/utils/Strings.sol => /dev/null       |  75 ---
 .../implementation/src/L1/L2OutputOracle.sol       | 296 +++++++++++
 .../implementation/src}/L1/ResourceMetering.sol    | 124 ++---
 .../implementation/src/libraries/Arithmetic.sol    |  28 +
 .../implementation/src/libraries/Burn.sol          |  32 ++
 .../implementation/src/libraries/Constants.sol     |  46 ++
 .../implementation/src/libraries/Types.sol         |  70 +++
 .../implementation/src/universal/ISemver.sol       |  13 +
 .../contracts/L1/L2OutputOracle.sol => /dev/null   | 350 -------------
 .../contracts/L1/SystemConfig.sol => /dev/null     | 297 -----------
 .../libraries/Arithmetic.sol => /dev/null          |  48 --
 .../contracts/libraries/Burn.sol => /dev/null      |  42 --
 .../contracts/libraries/Bytes.sol => /dev/null     | 142 ------
 .../contracts/libraries/Constants.sol => /dev/null |  49 --
 .../contracts/libraries/Encoding.sol => /dev/null  | 162 ------
 .../contracts/libraries/Hashing.sol => /dev/null   | 172 -------
 .../contracts/libraries/SafeCall.sol => /dev/null  | 160 ------
 .../contracts/libraries/Types.sol => /dev/null     |  84 ---
 .../libraries/rlp/RLPWriter.sol => /dev/null       | 221 --------
 .../trie/SecureMerkleTrie.sol => /dev/null         |  64 ---
 .../contracts/universal/Semver.sol => /dev/null    |  58 ---
 .../contracts/proxy/utils/Initializable.sol        |   0
 .../contracts/utils/Address.sol                    |   0
 .../contracts/utils/math/Math.sol                  |   0
 .../contracts/utils/math/SignedMath.sol            |   0
 .../contracts}/access/OwnableUpgradeable.sol       |   0
 .../contracts}/proxy/utils/Initializable.sol       |   0
 .../contracts}/utils/AddressUpgradeable.sol        |   0
 .../contracts}/utils/ContextUpgradeable.sol        |   0
 .../lib}/solmate/src/utils/FixedPointMathLib.sol   |   0
 .../OptimismPortal/implementation/meta.txt         |   2 +-
 .../contracts/utils/Strings.sol => /dev/null       |  75 ---
 .../implementation/src/L1/L2OutputOracle.sol       | 296 +++++++++++
 .../implementation/src}/L1/OptimismPortal.sol      | 440 +++++++---------
 .../implementation/src/L1/ResourceMetering.sol     | 162 ++++++
 .../implementation/src/L1/SuperchainConfig.sol     |  94 ++++
 .../implementation/src/L1/SystemConfig.sol         | 255 ++++++++++
 .../implementation/src/libraries/Arithmetic.sol    |  28 +
 .../implementation/src/libraries/Burn.sol          |  32 ++
 .../implementation/src/libraries/Bytes.sol         | 144 ++++++
 .../implementation/src/libraries/Constants.sol     |  46 ++
 .../implementation/src/libraries/Encoding.sol      | 176 +++++++
 .../implementation/src/libraries/Hashing.sol       | 124 +++++
 .../implementation/src/libraries/SafeCall.sol      | 142 ++++++
 .../implementation/src/libraries/Storage.sol       |  88 ++++
 .../implementation/src/libraries/Types.sol         |  70 +++
 .../src}/libraries/rlp/RLPReader.sol               | 249 +++------
 .../implementation/src/libraries/rlp/RLPWriter.sol | 163 ++++++
 .../src}/libraries/trie/MerkleTrie.sol             | 210 +++-----
 .../src/libraries/trie/SecureMerkleTrie.sol        |  49 ++
 .../implementation/src/universal/ISemver.sol       |  13 +
 .../src}/vendor/AddressAliasHelper.sol             |   0
 .../contracts/proxy/utils/Initializable.sol        |   0
 .../contracts/utils/Address.sol                    |   0
 .../.code/SuperchainConfig/implementation/meta.txt |   2 +
 .../implementation/src/L1/SuperchainConfig.sol     |  94 ++++
 .../implementation/src/libraries/Storage.sol       |  88 ++++
 .../implementation/src/universal/ISemver.sol       |  13 +
 .../contracts/proxy/utils/Initializable.sol        | 138 +++++
 .../contracts/utils/Address.sol                    | 222 ++++++++
 .../contracts/utils/math/Math.sol                  | 226 +++++++++
 .../contracts/utils/math/SignedMath.sol            |  43 ++
 .../lib/solmate/src/utils/FixedPointMathLib.sol    | 366 ++++++++++++++
 .../ethereum/.code/SuperchainConfig/proxy/meta.txt |   2 +
 .../proxy/src}/L1/ResourceMetering.sol             | 116 ++---
 .../proxy/src/libraries/Arithmetic.sol             |  28 +
 .../SuperchainConfig/proxy/src/libraries/Burn.sol  |  32 ++
 .../proxy/src/libraries/Constants.sol              |  46 ++
 .../SuperchainConfig/proxy/src/universal/Proxy.sol | 168 ++++++
 .../contracts/L1/SystemConfig.sol => /dev/null     | 297 -----------
 .../libraries/Arithmetic.sol => /dev/null          |  48 --
 .../contracts/libraries/Burn.sol => /dev/null      |  42 --
 .../contracts/universal/Semver.sol => /dev/null    |  58 ---
 .../contracts/proxy/utils/Initializable.sol        | 138 +++++
 .../contracts/utils/Address.sol                    | 222 ++++++++
 .../contracts/utils/math/Math.sol                  | 226 +++++++++
 .../contracts/utils/math/SignedMath.sol            |  43 ++
 .../contracts}/access/OwnableUpgradeable.sol       |   0
 .../contracts}/proxy/utils/Initializable.sol       |   0
 .../contracts}/utils/AddressUpgradeable.sol        |   0
 .../contracts}/utils/ContextUpgradeable.sol        |   0
 .../lib/solmate/src/utils/FixedPointMathLib.sol    | 366 ++++++++++++++
 .../SystemConfig/implementation/meta.txt           |   2 +-
 .../contracts/utils/Strings.sol => /dev/null       |  75 ---
 .../implementation/src/L1/ResourceMetering.sol     | 162 ++++++
 .../implementation/src/L1/SystemConfig.sol         | 255 ++++++++++
 .../implementation/src/libraries/Arithmetic.sol    |  28 +
 .../implementation/src/libraries/Burn.sol          |  32 ++
 .../implementation/src/libraries/Constants.sol     |  46 ++
 .../implementation/src/libraries/Storage.sol       |  88 ++++
 .../implementation/src/universal/ISemver.sol       |  13 +
 199 files changed, 11029 insertions(+), 9871 deletions(-)
```

Generated with discovered.json: 0x7e4c9076131acf85de578916eb5cfca1e750a721

# Diff at Mon, 12 Feb 2024 08:28:31 GMT:

- chain: ethereum
- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@ddc21751860f919d2bc4b19eb9fd41d3f26acdf2 block: 19176787
- current block number: 19210753

## Description

The Security Council is introduced, but with a 4/13 threshold. Now the multisig owning the ProxyAdmin is a 2/2 with the Foundation multisig and the Security Council multisig.

## Watched changes

```diff
    contract ProxyAdmin (0x543bA4AADBAb8f9025686Bd03993043599c6fB04) {
      values.owner:
-        "0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A"
+        "0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A"
    }
```

```diff
+   Status: CREATED
    contract ProxyAdminOwner (0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A) {
    }
```

```diff
+   Status: CREATED
    contract FoundationMultisig_1 (0x847B5c174615B1B7fDF770882256e2D3E95b9D92) {
    }
```

```diff
+   Status: CREATED
    contract SecurityCouncilMultisig (0xc2819DC788505Aac350142A7A707BF9D03E3Bd03) {
    }
```

## Source code changes

```diff
.../implementation/GnosisSafe.sol                  | 422 +++++++++++++++++++++
 .../implementation/base/Executor.sol               |  27 ++
 .../implementation/base/FallbackManager.sol        |  53 +++
 .../implementation/base/GuardManager.sol           |  50 +++
 .../implementation/base/ModuleManager.sol          | 133 +++++++
 .../implementation/base/OwnerManager.sol           | 149 ++++++++
 .../implementation/common/Enum.sol                 |   8 +
 .../implementation/common/EtherPaymentFallback.sol |  13 +
 .../implementation/common/SecuredTokenTransfer.sol |  35 ++
 .../implementation/common/SelfAuthorized.sol       |  16 +
 .../implementation/common/SignatureDecoder.sol     |  36 ++
 .../implementation/common/Singleton.sol            |  11 +
 .../implementation/common/StorageAccessible.sol    |  47 +++
 .../implementation/external/GnosisSafeMath.sol     |  54 +++
 .../interfaces/ISignatureValidator.sol             |  20 +
 .../FoundationMultisig_1/implementation/meta.txt   |   2 +
 .../FoundationMultisig_1/proxy/GnosisSafeProxy.sol | 155 ++++++++
 .../.code/FoundationMultisig_1/proxy/meta.txt      |   2 +
 .../ProxyAdminOwner/implementation/GnosisSafe.sol  | 422 +++++++++++++++++++++
 .../implementation/base/Executor.sol               |  27 ++
 .../implementation/base/FallbackManager.sol        |  53 +++
 .../implementation/base/GuardManager.sol           |  50 +++
 .../implementation/base/ModuleManager.sol          | 133 +++++++
 .../implementation/base/OwnerManager.sol           | 149 ++++++++
 .../ProxyAdminOwner/implementation/common/Enum.sol |   8 +
 .../implementation/common/EtherPaymentFallback.sol |  13 +
 .../implementation/common/SecuredTokenTransfer.sol |  35 ++
 .../implementation/common/SelfAuthorized.sol       |  16 +
 .../implementation/common/SignatureDecoder.sol     |  36 ++
 .../implementation/common/Singleton.sol            |  11 +
 .../implementation/common/StorageAccessible.sol    |  47 +++
 .../implementation/external/GnosisSafeMath.sol     |  54 +++
 .../interfaces/ISignatureValidator.sol             |  20 +
 .../.code/ProxyAdminOwner/implementation/meta.txt  |   2 +
 .../ProxyAdminOwner/proxy/GnosisSafeProxy.sol      | 155 ++++++++
 .../ethereum/.code/ProxyAdminOwner/proxy/meta.txt  |   2 +
 .../implementation/GnosisSafe.sol                  | 422 +++++++++++++++++++++
 .../implementation/base/Executor.sol               |  27 ++
 .../implementation/base/FallbackManager.sol        |  53 +++
 .../implementation/base/GuardManager.sol           |  50 +++
 .../implementation/base/ModuleManager.sol          | 133 +++++++
 .../implementation/base/OwnerManager.sol           | 149 ++++++++
 .../implementation/common/Enum.sol                 |   8 +
 .../implementation/common/EtherPaymentFallback.sol |  13 +
 .../implementation/common/SecuredTokenTransfer.sol |  35 ++
 .../implementation/common/SelfAuthorized.sol       |  16 +
 .../implementation/common/SignatureDecoder.sol     |  36 ++
 .../implementation/common/Singleton.sol            |  11 +
 .../implementation/common/StorageAccessible.sol    |  47 +++
 .../implementation/external/GnosisSafeMath.sol     |  54 +++
 .../interfaces/ISignatureValidator.sol             |  20 +
 .../implementation/meta.txt                        |   2 +
 .../proxy/GnosisSafeProxy.sol                      | 155 ++++++++
 .../.code/SecurityCouncilMultisig/proxy/meta.txt   |   2 +
 54 files changed, 3699 insertions(+)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19176787 (main branch discovery), not current.

```diff
    contract OptimismMultisig (0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A) {
      name:
-        "OptimismMultisig"
+        "FoundationMultisig_2"
    }
```

Generated with discovered.json: 0x75bf0a1e7f3ca34a61085103177321849b59f9c2

# Diff at Wed, 07 Feb 2024 14:04:10 GMT:

- chain: ethereum
- author: Michał Sobieraj-Jakubiec (<michalsidzej@gmail.com>)
- comparing to: main@2e35800e01005d93332a552032058dcd67f3631d block: 19175199
- current block number: 19176787

## Description

Added opStackSequencerInbox handler

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19175199 (main branch discovery), not current.

```diff
    contract SystemConfig (0x229047fed2591dbec1eF1118d64F7aF3dB9EB290) {
      values.sequencerInbox:
+        "0xFF00000000000000000000000000000000000010"
    }
```

Generated with discovered.json: 0x76f079bbf5d43c3c9139458655bfbd274ddbfa2a

# Diff at Wed, 07 Feb 2024 08:43:05 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@64f1e0f27f831d3ef860a1c2faad8c77e04e6c29 block: 19126648
- current block number: 19175199

## Description

Updated with the new OpDAHandler to remove the field.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19126648 (main branch discovery), not current.

```diff
    contract SystemConfig (0x229047fed2591dbec1eF1118d64F7aF3dB9EB290) {
      values.opStackDA.isAllTxsLengthEqualToCelestiaDAExample:
-        false
    }
```

Generated with discovered.json: 0x7bc6699d72e87e966f09a1f8d9b0661ffdb9ab81

# Diff at Wed, 31 Jan 2024 13:05:49 GMT:

- chain: ethereum
- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@74040c3a8f43c630b3d31cc8376e84f5f9acda5c block: 18975204
- current block number: 19126648

## Description

Added opStackDa handler

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 18975204 (main branch discovery), not current.

```diff
    contract SystemConfig (0x229047fed2591dbec1eF1118d64F7aF3dB9EB290) {
      values.opStackDA:
+        {"isAllTxsLengthEqualToCelestiaDAExample":false,"isSomeTxsLengthEqualToCelestiaDAExample":false}
    }
```

# Diff at Wed, 10 Jan 2024 07:58:12 GMT:

- chain: ethereum
- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: master@e2e6b511762816f77296c91449de9dfcd2aa348b block: 18961956
- current block number: 18975204

## Description

Renamed contract to be consistent with template.

## Config related changes

Following changes come from updates made to the config file,
not from differences found during discovery. Values are
for block 18961956 (main branch discovery), not current.

```diff
    contract L1CrossDomainMessengerProxy (0x25ace71c97B33Cc4729CF772ae268934F7ab5fA1) {
      name:
-        "L1CrossDomainMessengerProxy"
+        "L1CrossDomainMessenger"
    }
```

# Diff at Mon, 08 Jan 2024 11:19:28 GMT:

- chain: ethereum
- author: Radina Talanova (<nt.radina@gmail.com>)
- comparing to: master@255faead9c908eabe1ba60518df6fac59f9743e0 block: 18927148
- current block number: 18961956

## Description

One owner is removed from SynthetixMultisig (now 5/11).

## Watched changes

```diff
    contract SynthetixMultisig (0xEb3107117FEAd7de89Cd14D463D340A2E6917769) {
      values.getOwners[11]:
-        "0xEde8a407913A874Dd7e3d5B731AFcA135D30375E"
      values.getOwners.10:
-        "0x562948111d50BF039A39Eea48D127f2Ae51ddF02"
+        "0xEde8a407913A874Dd7e3d5B731AFcA135D30375E"
      values.getOwners.9:
-        "0x1dd532CF7603a60C3ec91360f273DA3Db38545aB"
+        "0x562948111d50BF039A39Eea48D127f2Ae51ddF02"
      values.getOwners.8:
-        "0x2d8cF727d37e7277D5eeDbAb853a3e8320f767Cd"
+        "0x1dd532CF7603a60C3ec91360f273DA3Db38545aB"
      values.getOwners.7:
-        "0x347c3190bD015FBD0e47fb90AA4917138A8A32FE"
+        "0x2d8cF727d37e7277D5eeDbAb853a3e8320f767Cd"
      values.getOwners.6:
-        "0xa2fa6Ef1Fcf740b632a04B3FC56B5d3118Bbd211"
+        "0x347c3190bD015FBD0e47fb90AA4917138A8A32FE"
      values.getOwners.5:
-        "0x599e835cbFC903eF09f3Dd5E08D1cF63c32AF8d8"
+        "0xa2fa6Ef1Fcf740b632a04B3FC56B5d3118Bbd211"
      values.getOwners.4:
-        "0x6985b94Db148eDd4df6BD1Ba3F4640da79B44947"
+        "0x599e835cbFC903eF09f3Dd5E08D1cF63c32AF8d8"
      values.getOwners.0:
-        "0xd9b891AB93C210eafa46c61fAeb53836F99aa35B"
+        "0x26E10fF641839cA457695CE955Cb90657D6E3F53"
    }
```

# Diff at Wed, 03 Jan 2024 13:33:11 GMT:

- chain: ethereum
- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: master@2a4dee9ce3e9f4d9aa3c1d39fafd6ff2ba608ba2

## Description

SynthetixMultisig has removed one owner. We are not showing it on the frontend. If it changes often, we can ignore it but for now I'll leave it as it is.

## Watched changes

```diff
    contract SynthetixMultisig (0xEb3107117FEAd7de89Cd14D463D340A2E6917769) {
      values.getOwners[12]:
-        "0xEde8a407913A874Dd7e3d5B731AFcA135D30375E"
      values.getOwners.11:
-        "0x562948111d50BF039A39Eea48D127f2Ae51ddF02"
+        "0xEde8a407913A874Dd7e3d5B731AFcA135D30375E"
      values.getOwners.10:
-        "0x1dd532CF7603a60C3ec91360f273DA3Db38545aB"
+        "0x562948111d50BF039A39Eea48D127f2Ae51ddF02"
      values.getOwners.9:
-        "0x2d8cF727d37e7277D5eeDbAb853a3e8320f767Cd"
+        "0x1dd532CF7603a60C3ec91360f273DA3Db38545aB"
      values.getOwners.8:
-        "0x347c3190bD015FBD0e47fb90AA4917138A8A32FE"
+        "0x2d8cF727d37e7277D5eeDbAb853a3e8320f767Cd"
      values.getOwners.7:
-        "0xa2fa6Ef1Fcf740b632a04B3FC56B5d3118Bbd211"
+        "0x347c3190bD015FBD0e47fb90AA4917138A8A32FE"
      values.getOwners.6:
-        "0x599e835cbFC903eF09f3Dd5E08D1cF63c32AF8d8"
+        "0xa2fa6Ef1Fcf740b632a04B3FC56B5d3118Bbd211"
      values.getOwners.5:
-        "0x6985b94Db148eDd4df6BD1Ba3F4640da79B44947"
+        "0x599e835cbFC903eF09f3Dd5E08D1cF63c32AF8d8"
      values.getOwners.4:
-        "0xe1Efa5C91cA533E4a51884d805879249E3FCB2BC"
+        "0x6985b94Db148eDd4df6BD1Ba3F4640da79B44947"
      values.getOwners.3:
-        "0x8909F73188C4fE68B283fCB1E724b2466e0BdfD0"
+        "0xe1Efa5C91cA533E4a51884d805879249E3FCB2BC"
      values.getOwners.2:
-        "0x0B67bab43157e53D21965Af0d83f83BeD9553E0a"
+        "0x8909F73188C4fE68B283fCB1E724b2466e0BdfD0"
      values.getOwners.1:
-        "0xd9b891AB93C210eafa46c61fAeb53836F99aa35B"
+        "0x0B67bab43157e53D21965Af0d83f83BeD9553E0a"
      values.getOwners.0:
-        "0x28Ed18Bd77A061E0A886a2a8FFb91da95FF03E56"
+        "0xd9b891AB93C210eafa46c61fAeb53836F99aa35B"
    }
```

# Diff at Tue, 26 Sep 2023 08:05:22 GMT:

- chain: ethereum
- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: master@cfd4e281f2af40c7c69302b16c1308c0c5651be0

## Watched changes

```diff
    contract L2OutputOracle (0xdfe97868233d1aa22e815a266982f2cf17685a27) {
      values.deletedOutputs:
+        []
    }
```

