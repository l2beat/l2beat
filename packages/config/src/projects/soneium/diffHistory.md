Generated with discovered.json: 0x10ce92d4a03d9e40475e803c257dc0d61a5a1dbc

# Diff at Thu, 23 Oct 2025 12:41:45 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@57d3f180a9197fcc582bfc2d2856eea99da824cc block: 1759501481
- current timestamp: 1761223197

## Description

msig change.

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

Generated with discovered.json: 0x5dd87e3fa6cc23afbac8fc42530f8205940a5e39

# Diff at Fri, 03 Oct 2025 14:25:50 GMT:

- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@2a86d862e7686075acdb5f1c005d9ab095b4d598 block: 1759389840
- current timestamp: 1759501481

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

PermissionedDisputeGame (via DisputeGameFactory gameImpls[1]) - no code changes; constructor variables updated (e.g., DelayedWETH, VM).
https://disco.l2beat.com/diff/eth:0x3c12f1F4F0702CB7fC83e2e5594331c10b9e39b4/eth:0xB4343238bfC15aA0104276c00F88B54D2de3d6F1

MIPS → MIPS64 - added function for pseudorandomness generation.
https://disco.l2beat.com/diff/eth:0xA1B54D89e305bcd322Ba0C9C094093173C0d6b3a/eth:0x07BABE08EE4D07dBA236530183B24055535A7011

DelayedWETH (replacement) - same code, same admin; only diff is totalSupply.
https://disco.l2beat.com/diff/eth:0x372dC0B87b790D6e1308CF9e7f73F0F1fcbD3754/eth:0x70277624cdE90492231Eb23309e1251Beb18Dff5

## Watched changes

```diff
-   Status: DELETED
    contract DelayedWETH (eth:0x372dC0B87b790D6e1308CF9e7f73F0F1fcbD3754)
    +++ description: Contract designed to hold the bonded ETH for each game. It is designed as a wrapper around WETH to allow an owner to function as a backstop if a game would incorrectly distribute funds.
```

```diff
-   Status: DELETED
    contract PermissionedDisputeGame (eth:0x3c12f1F4F0702CB7fC83e2e5594331c10b9e39b4)
    +++ description: Same as FaultDisputeGame, but only two permissioned addresses are designated as proposer and challenger.
```

```diff
    contract AnchorStateRegistry (eth:0x4890928941e62e273dA359374b105F803329F473) {
    +++ description: Contains the latest confirmed state root that can be used as a starting point in a dispute game. It specifies which game type can be used for withdrawals, which currently is the PermissionedDisputeGame.
      values.$pastUpgrades.1:
+        ["2025-10-02T16:35:23.000Z","0x744cf7d28324729cace731ac736872da669439a0d380f1f52b8d31af203f7329",["eth:0xeb69cC681E8D4a557b30DFFBAd85aFfD47a2CF2E"]]
      values.$upgradeCount:
-        1
+        2
    }
```

```diff
    contract DisputeGameFactory (eth:0x512A3d2c7a43BD9261d2B8E8C9c70D4bd4D503C0) {
    +++ description: The dispute game factory allows the creation of dispute games, used to propose state roots and eventually challenge them.
      values.$pastUpgrades.3:
+        ["2025-10-02T16:35:23.000Z","0x744cf7d28324729cace731ac736872da669439a0d380f1f52b8d31af203f7329",["eth:0x33D1e8571a85a538ed3D5A4d88f46C112383439D"]]
      values.$upgradeCount:
-        3
+        4
+++ severity: HIGH
      values.gameImpls.1:
-        "eth:0x3c12f1F4F0702CB7fC83e2e5594331c10b9e39b4"
+        "eth:0xB4343238bfC15aA0104276c00F88B54D2de3d6F1"
    }
```

```diff
    contract L1ERC721Bridge (eth:0x5933e323bE8896DfaCd1cD671442F27dAA10a053) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      sourceHashes.1:
-        "0x8ec2646e7ca57c49fef7769f200a751b7199526d590c9c43e6c7b134f43de630"
+        "0xab560cdc633c64552a47cd693ebc9aaab91fe80bec99e9e89b9d13d89a994c22"
      values.$implementation:
-        "eth:0x25d6CeDEB277Ad7ebEe71226eD7877768E0B7A2F"
+        "eth:0x7f1d12fB2911EB095278085f721e644C1f675696"
      values.$pastUpgrades.4:
+        ["2025-10-02T16:35:23.000Z","0x744cf7d28324729cace731ac736872da669439a0d380f1f52b8d31af203f7329",["eth:0x7f1d12fB2911EB095278085f721e644C1f675696"]]
      values.$upgradeCount:
-        4
+        5
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
    contract SuperchainProxyAdminOwner (eth:0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A) {
    +++ description: None
      receivedPermissions.2:
-        {"permission":"upgrade","from":"eth:0x372dC0B87b790D6e1308CF9e7f73F0F1fcbD3754","role":"admin","via":[{"address":"eth:0x89889B569c3a505f3640ee1Bd0ac1D557f436D2a"}]}
      receivedPermissions.6:
+        {"permission":"upgrade","from":"eth:0x70277624cdE90492231Eb23309e1251Beb18Dff5","role":"admin","via":[{"address":"eth:0x89889B569c3a505f3640ee1Bd0ac1D557f436D2a"}]}
    }
```

```diff
    contract SystemConfig (eth:0x7A8Ed66B319911A0F3E7288BDdAB30d9c0C875c3) {
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
      values.$pastUpgrades.7:
+        ["2025-10-02T16:35:23.000Z","0x744cf7d28324729cace731ac736872da669439a0d380f1f52b8d31af203f7329",["eth:0x2bFE4A5Bd5A41e9d848d843ebCDFa15954e9A557"]]
      values.$upgradeCount:
-        7
+        8
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
    contract OptimismPortal2 (eth:0x88e529A6ccd302c948689Cd5156C83D4614FAE92) {
    +++ description: The OptimismPortal contract is the main entry point to deposit funds from L1 to L2. It also allows to prove and finalize withdrawals. It specifies which game type can be used for withdrawals, which currently is the PermissionedDisputeGame.
      template:
-        "opstack/OptimismPortal2_post13"
+        "opstack/OptimismPortal2"
      sourceHashes.1:
-        "0x025be6415d31a7c8f475bf94e05a8288787b4adb41562108a42d0574c9af9543"
+        "0x8ca0818fc584e81a5cead0efc1c32f3273182323dcbd08a60779d55cb0aa90c9"
      description:
-        "The OptimismPortal contract is the main entry point to deposit funds from L1 to L2. It also allows to prove and finalize withdrawals. The state root respected for withdrawals comnes from the PermissionedDisputeGame."
+        "The OptimismPortal contract is the main entry point to deposit funds from L1 to L2. It also allows to prove and finalize withdrawals. It specifies which game type can be used for withdrawals, which currently is the PermissionedDisputeGame."
      values.$implementation:
-        "eth:0xEFEd7F38BB9BE74bBa583a1A5B7D0fe7C9D5787a"
+        "eth:0x381E729FF983FA4BCEd820e7b922d79bF653B999"
      values.$pastUpgrades.4:
+        ["2025-10-02T16:35:23.000Z","0x744cf7d28324729cace731ac736872da669439a0d380f1f52b8d31af203f7329",["eth:0x381E729FF983FA4BCEd820e7b922d79bF653B999"]]
      values.$upgradeCount:
-        4
+        5
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
    contract ProxyAdmin (eth:0x89889B569c3a505f3640ee1Bd0ac1D557f436D2a) {
    +++ description: None
      directlyReceivedPermissions.1:
-        {"permission":"upgrade","from":"eth:0x372dC0B87b790D6e1308CF9e7f73F0F1fcbD3754","role":"admin"}
      directlyReceivedPermissions.5:
+        {"permission":"upgrade","from":"eth:0x70277624cdE90492231Eb23309e1251Beb18Dff5","role":"admin"}
    }
```

```diff
    contract L1CrossDomainMessenger (eth:0x9CF951E3F74B644e621b36Ca9cea147a78D4c39f) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      sourceHashes.1:
-        "0x21cd6c80343ba49cbb9f3e96c5f4ca0bc77bc617825495fbaad1026ed9a42026"
+        "0x12cf78bcfa479caaee8133c0f935dcdcc333cdc116805f6b81bd80f6ba52128c"
      values.$implementation:
-        "eth:0xD26bB3aaAa4cB5638A8581A4c4b1d937D8E05c54"
+        "eth:0x22D12E0FAebD62d429514A65EBAe32dd316c12D6"
      values.$pastUpgrades.4:
+        ["2025-10-02T16:35:23.000Z","0x744cf7d28324729cace731ac736872da669439a0d380f1f52b8d31af203f7329",["eth:0x22D12E0FAebD62d429514A65EBAe32dd316c12D6"]]
      values.$upgradeCount:
-        4
+        5
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
-   Status: DELETED
    contract MIPS (eth:0xA1B54D89e305bcd322Ba0C9C094093173C0d6b3a)
    +++ description: The MIPS contract is used to execute the final step of the dispute game which objectively determines the winner of the dispute.
```

```diff
    contract L1StandardBridge (eth:0xeb9bf100225c214Efc3E7C651ebbaDcF85177607) {
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
+   Status: CREATED
    contract MIPS (eth:0x07BABE08EE4D07dBA236530183B24055535A7011)
    +++ description: The MIPS contract is used to execute the final step of the dispute game which objectively determines the winner of the dispute.
```

```diff
+   Status: CREATED
    contract DelayedWETH (eth:0x70277624cdE90492231Eb23309e1251Beb18Dff5)
    +++ description: Contract designed to hold the bonded ETH for each game. It is designed as a wrapper around WETH to allow an owner to function as a backstop if a game would incorrectly distribute funds.
```

```diff
+   Status: CREATED
    contract PermissionedDisputeGame (eth:0xB4343238bfC15aA0104276c00F88B54D2de3d6F1)
    +++ description: Same as FaultDisputeGame, but only two permissioned addresses are designated as proposer and challenger.
```

## Source code changes

```diff
.../L1CrossDomainMessenger.sol                     |  33 ++-
 .../L1ERC721Bridge/L1ERC721Bridge.sol              |  33 ++-
 .../L1StandardBridge/L1StandardBridge.sol          |  33 ++-
 .../soneium/{.flat@1759389840 => .flat}/MIPS.sol   |  70 ++++-
 .../OptimismPortal2/OptimismPortal2.sol            | 283 +++++----------------
 .../SystemConfig/SystemConfig.sol                  |  63 ++++-
 6 files changed, 267 insertions(+), 248 deletions(-)
```

Generated with discovered.json: 0xbda5a2c433a85e3dc8a6f817fe3c553bd56625be

# Diff at Thu, 02 Oct 2025 07:25:08 GMT:

- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@b1cfb9bd1821e27488215e4364f565cfd7d54c2e block: 1759157377
- current timestamp: 1759389840

## Description

Period format change.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1759157377 (main branch discovery), not current.

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

Generated with discovered.json: 0x33ef571b9d959ee1de6a8e6dc659966874b60eef

# Diff at Mon, 29 Sep 2025 14:50:42 GMT:

- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@c66a02d28b2467edd595f8a8468988549dd6d3cf block: 1756804623
- current timestamp: 1759157377

## Description

Increase in EIP-1559 elasticity (from 8 to 9), meaning that in periods of high demand the block can expand up to 9x the block gas target.

## Watched changes

```diff
    contract SystemConfig (eth:0x7A8Ed66B319911A0F3E7288BDdAB30d9c0C875c3) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      values.eip1559Elasticity:
-        8
+        9
    }
```

Generated with discovered.json: 0x39b2414b88a8076534e228c94d172d9a66ca5c56

# Diff at Mon, 15 Sep 2025 09:50:51 GMT:

- author: Sergey Shemyakov (<sergey.shemyakov@l2beat.com>)
- comparing to: main@37882e40cb6029f3a2ae2bb177048e3e846b833d block: 1756804623
- current timestamp: 1756804623

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1756804623 (main branch discovery), not current.

```diff
    contract DisputeGameFactory (eth:0x512A3d2c7a43BD9261d2B8E8C9c70D4bd4D503C0) {
    +++ description: The dispute game factory allows the creation of dispute games, used to propose state roots and eventually challenge them.
+++ severity: HIGH
      values.gameImpls.2:
+        "eth:0x0000000000000000000000000000000000000000"
+++ severity: HIGH
      values.gameImpls.3:
+        "eth:0x0000000000000000000000000000000000000000"
    }
```

Generated with discovered.json: 0xe8ba2922f5fffe0fc0695dc5e7c1eb26311883ec

# Diff at Tue, 02 Sep 2025 09:18:46 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@1144aeaf984988c003c97be3791eeda76896f8ca block: 1755507657
- current timestamp: 1756804623

## Description

Fee market changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1755507657 (main branch discovery), not current.

```diff
    contract SystemConfig (eth:0x7A8Ed66B319911A0F3E7288BDdAB30d9c0C875c3) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      values.eip1559Elasticity:
-        7
+        8
    }
```

Generated with discovered.json: 0xd01e4cd7139efe68c128464b8aeea2e2e291f094

# Diff at Mon, 01 Sep 2025 10:01:10 GMT:

Merge mark

Generated with discovered.json: 0x941b9a68726bb93adc914540fea0fa9659bec6f3

# Diff at Mon, 18 Aug 2025 09:03:38 GMT:

- chain: ethereum
- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@0dd593b7eab607ddac1ba1df05212f23f79157e3 block: 1753451099
- current timestamp: 1755507657

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

Generated with discovered.json: 0x1437e45d43964ca965bbaf082803fe6230917f87

# Diff at Fri, 25 Jul 2025 17:48:25 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@dff0cc78015c4909229d9a2a9ca8fb6a3498b9d5 block: 22437746
- current block number: 22996539

## Description

Check optimism diffhistory for [the upgrade 16 breakdown](https://gov.optimism.io/t/upgrade-16-proposal-interop-contracts-stage-1-and-go-1-23-support-in-cannon/10037).

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
    contract AnchorStateRegistry (0x190B6ecEE5A2ddF39669288B9B8daEa4641ae8b1)
    +++ description: Contains the latest confirmed state root that can be used as a starting point in a dispute game.
```

```diff
    EOA Optimism EOA 1 (0x352f1defB49718e7Ea411687E850aA8d6299F7aC) {
    +++ description: None
      receivedPermissions.0:
-        {"permission":"challenge","from":"eth:0x3D56d47b9E7E34A46612BadC70377F74051E6b17","role":".challenger","via":[{"address":"eth:0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A"},{"address":"eth:0x126a736B18E0a64fBA19D421647A530E327E112C","condition":"though restricted to the SuperchainConfig's `pause()` function"}]}
      receivedPermissions.1.via.3.address:
-        "eth:0x126a736B18E0a64fBA19D421647A530E327E112C"
+        "eth:0x76fC2F971FB355D0453cF9F64d3F9E4f640E1754"
      receivedPermissions.1.via.2:
-        {"address":"eth:0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A"}
      receivedPermissions.1.via.1:
-        {"address":"eth:0xc6901F65369FC59fC1B4D6D6bE7A2318Ff38dB5B","condition":"if not revoked by the Security Council"}
      directlyReceivedPermissions.0.from:
-        "eth:0x126a736B18E0a64fBA19D421647A530E327E112C"
+        "eth:0x76fC2F971FB355D0453cF9F64d3F9E4f640E1754"
    }
```

```diff
-   Status: DELETED
    contract PermissionedDisputeGame (0x3D56d47b9E7E34A46612BadC70377F74051E6b17)
    +++ description: Same as FaultDisputeGame, but only two permissioned addresses are designated as proposer and challenger.
```

```diff
    EOA  (0x400c164C4a8cA84385B70EEd6eB03ea847c8E1b8) {
    +++ description: None
      receivedPermissions:
-        [{"permission":"propose","from":"eth:0x3D56d47b9E7E34A46612BadC70377F74051E6b17","role":".proposer"}]
    }
```

```diff
    contract DisputeGameFactory (0x512A3d2c7a43BD9261d2B8E8C9c70D4bd4D503C0) {
    +++ description: The dispute game factory allows the creation of dispute games, used to propose state roots and eventually challenge them.
      sourceHashes.1:
-        "0x85ca17941ef36ac6b28a4f8f89803d0d41ef419c47586dcd3acdb47ee9617285"
+        "0x93342e3d1e616bd6c727a5f73b09c0811bdab764dc9ad7346278593fb66b3689"
      values.$implementation:
-        "eth:0x4bbA758F006Ef09402eF31724203F316ab74e4a0"
+        "eth:0x33D1e8571a85a538ed3D5A4d88f46C112383439D"
      values.$pastUpgrades.2:
+        ["2025-07-24T18:01:35.000Z","0xdd89a3933dea0f44e1a461441f3c78e341702e9a4148784780644cdac90148c2",["eth:0x33D1e8571a85a538ed3D5A4d88f46C112383439D"]]
      values.$upgradeCount:
-        2
+        3
+++ severity: HIGH
      values.gameImpls.1:
-        "eth:0x3D56d47b9E7E34A46612BadC70377F74051E6b17"
+        "eth:0x3c12f1F4F0702CB7fC83e2e5594331c10b9e39b4"
      values.version:
-        "1.0.1"
+        "1.2.0"
      values.initVersion:
+        1
      values.proxyAdmin:
+        "eth:0x89889B569c3a505f3640ee1Bd0ac1D557f436D2a"
      values.proxyAdminOwner:
+        "eth:0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A"
      implementationNames.eth:0x4bbA758F006Ef09402eF31724203F316ab74e4a0:
-        "DisputeGameFactory"
      implementationNames.eth:0x33D1e8571a85a538ed3D5A4d88f46C112383439D:
+        "DisputeGameFactory"
    }
```

```diff
    contract L1ERC721Bridge (0x5933e323bE8896DfaCd1cD671442F27dAA10a053) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      sourceHashes.1:
-        "0x28669b49da3effd51f0f9424ca9cdd455c5b9327c09a40c65fc06f114a6eb837"
+        "0x8ec2646e7ca57c49fef7769f200a751b7199526d590c9c43e6c7b134f43de630"
      values.$implementation:
-        "eth:0x7aE1d3BD877a4C5CA257404ce26BE93A02C98013"
+        "eth:0x25d6CeDEB277Ad7ebEe71226eD7877768E0B7A2F"
      values.$pastUpgrades.3:
+        ["2025-07-24T18:01:35.000Z","0xdd89a3933dea0f44e1a461441f3c78e341702e9a4148784780644cdac90148c2",["eth:0x25d6CeDEB277Ad7ebEe71226eD7877768E0B7A2F"]]
      values.$upgradeCount:
-        3
+        4
      values.version:
-        "2.4.0"
+        "2.7.0"
      values.initVersion:
+        2
      values.proxyAdmin:
+        "eth:0x89889B569c3a505f3640ee1Bd0ac1D557f436D2a"
      values.proxyAdminOwner:
+        "eth:0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A"
      values.systemConfig:
+        "eth:0x7A8Ed66B319911A0F3E7288BDdAB30d9c0C875c3"
      implementationNames.eth:0x7aE1d3BD877a4C5CA257404ce26BE93A02C98013:
-        "L1ERC721Bridge"
      implementationNames.eth:0x25d6CeDEB277Ad7ebEe71226eD7877768E0B7A2F:
+        "L1ERC721Bridge"
    }
```

```diff
    contract SuperchainProxyAdminOwner (0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A) {
    +++ description: None
      receivedPermissions.0:
-        {"permission":"interact","from":"eth:0x9AEA1FD851b63d57Ba4Fc556B0e0c170126C9EAf","description":"can pull funds from the contract in case of emergency.","role":".owner"}
      receivedPermissions.2:
+        {"permission":"upgrade","from":"eth:0x372dC0B87b790D6e1308CF9e7f73F0F1fcbD3754","role":"admin","via":[{"address":"eth:0x89889B569c3a505f3640ee1Bd0ac1D557f436D2a"}]}
      receivedPermissions.3.from:
-        "eth:0x190B6ecEE5A2ddF39669288B9B8daEa4641ae8b1"
+        "eth:0x4890928941e62e273dA359374b105F803329F473"
      receivedPermissions.6:
+        {"permission":"upgrade","from":"eth:0x67B4de6FfA66EF201Ea6099A89cA397D56622E31","role":"admin","via":[{"address":"eth:0x89889B569c3a505f3640ee1Bd0ac1D557f436D2a"}]}
      receivedPermissions.9:
-        {"permission":"upgrade","from":"eth:0x9AEA1FD851b63d57Ba4Fc556B0e0c170126C9EAf","role":"admin","via":[{"address":"eth:0x89889B569c3a505f3640ee1Bd0ac1D557f436D2a"}]}
    }
```

```diff
    contract SystemConfig (0x7A8Ed66B319911A0F3E7288BDdAB30d9c0C875c3) {
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
      values.$pastUpgrades.6:
+        ["2025-07-24T18:01:35.000Z","0xdd89a3933dea0f44e1a461441f3c78e341702e9a4148784780644cdac90148c2",["eth:0xFaA660bf783CBAa55e1B7F3475C20Db74a53b9Fa"]]
      values.$upgradeCount:
-        6
+        7
      values.DISPUTE_GAME_FACTORY_SLOT:
-        "0x52322a25d9f59ea17656545543306b7aef62bc0cc53a0e65ccfa0c75b97aa906"
      values.getAddresses.disputeGameFactory:
-        "eth:0x512A3d2c7a43BD9261d2B8E8C9c70D4bd4D503C0"
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
+        1868
+++ description: `superchainConfig.paused(address(lockbox)) || superchainConfig.paused(address(0))`
+++ severity: HIGH
      values.paused:
+        false
      values.proxyAdmin:
+        "eth:0x89889B569c3a505f3640ee1Bd0ac1D557f436D2a"
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
    contract OptimismPortal2 (0x88e529A6ccd302c948689Cd5156C83D4614FAE92) {
    +++ description: The OptimismPortal contract is the main entry point to deposit funds from L1 to L2. It also allows to prove and finalize withdrawals. The state root respected for withdrawals comnes from the PermissionedDisputeGame.
      template:
-        "opstack/OptimismPortal2"
+        "opstack/OptimismPortal2_post13"
      sourceHashes.1:
-        "0xc483ef9e0a5ec2a0450732e743b3784de0cd3876b8fadfce14c0805a0846d26b"
+        "0x025be6415d31a7c8f475bf94e05a8288787b4adb41562108a42d0574c9af9543"
      description:
-        "The OptimismPortal contract is the main entry point to deposit funds from L1 to L2. It also allows to prove and finalize withdrawals. It specifies which game type can be used for withdrawals, which currently is the PermissionedDisputeGame."
+        "The OptimismPortal contract is the main entry point to deposit funds from L1 to L2. It also allows to prove and finalize withdrawals. The state root respected for withdrawals comnes from the PermissionedDisputeGame."
      values.$implementation:
-        "eth:0xB443Da3e07052204A02d630a8933dAc05a0d6fB4"
+        "eth:0xEFEd7F38BB9BE74bBa583a1A5B7D0fe7C9D5787a"
      values.$pastUpgrades.3:
+        ["2025-07-24T18:01:35.000Z","0xdd89a3933dea0f44e1a461441f3c78e341702e9a4148784780644cdac90148c2",["eth:0xEFEd7F38BB9BE74bBa583a1A5B7D0fe7C9D5787a"]]
      values.$upgradeCount:
-        3
+        4
      values.respectedGameTypeUpdatedAt:
-        1733134751
+        1753380095
      values.version:
-        "3.14.0"
+        "4.6.0"
      values.anchorStateRegistry:
+        "eth:0x4890928941e62e273dA359374b105F803329F473"
      values.ethLockbox:
+        "eth:0x67B4de6FfA66EF201Ea6099A89cA397D56622E31"
      values.initVersion:
+        2
      values.proxyAdmin:
+        "eth:0x89889B569c3a505f3640ee1Bd0ac1D557f436D2a"
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
    contract ProxyAdmin (0x89889B569c3a505f3640ee1Bd0ac1D557f436D2a) {
    +++ description: None
      directlyReceivedPermissions.1:
+        {"permission":"upgrade","from":"eth:0x372dC0B87b790D6e1308CF9e7f73F0F1fcbD3754","role":"admin"}
      directlyReceivedPermissions.1.from:
-        "eth:0x190B6ecEE5A2ddF39669288B9B8daEa4641ae8b1"
+        "eth:0x4890928941e62e273dA359374b105F803329F473"
      directlyReceivedPermissions.5:
+        {"permission":"upgrade","from":"eth:0x67B4de6FfA66EF201Ea6099A89cA397D56622E31","role":"admin"}
      directlyReceivedPermissions.6:
-        {"permission":"upgrade","from":"eth:0x9AEA1FD851b63d57Ba4Fc556B0e0c170126C9EAf","role":"admin"}
    }
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
-   Status: DELETED
    contract DelayedWETH (0x9AEA1FD851b63d57Ba4Fc556B0e0c170126C9EAf)
    +++ description: Contract designed to hold the bonded ETH for each game. It is designed as a wrapper around WETH to allow an owner to function as a backstop if a game would incorrectly distribute funds.
```

```diff
    contract OpFoundationOperationsSafe (0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A) {
    +++ description: None
      values.getModules.0:
-        "eth:0x126a736B18E0a64fBA19D421647A530E327E112C"
      values.GnosisSafe_modules.0:
-        "eth:0x126a736B18E0a64fBA19D421647A530E327E112C"
      receivedPermissions:
-        [{"permission":"challenge","from":"eth:0x3D56d47b9E7E34A46612BadC70377F74051E6b17","role":".challenger"},{"permission":"guard","from":"eth:0x95703e0982140D16f8ebA6d158FccEde42f04a4C","role":".guardian","via":[{"address":"eth:0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2"},{"address":"eth:0xc6901F65369FC59fC1B4D6D6bE7A2318Ff38dB5B","condition":"if not revoked by the Security Council"}]}]
      directlyReceivedPermissions:
-        [{"permission":"act","from":"eth:0xc6901F65369FC59fC1B4D6D6bE7A2318Ff38dB5B","role":".deputyGuardian","condition":"if not revoked by the Security Council"}]
    }
```

```diff
    contract L1CrossDomainMessenger (0x9CF951E3F74B644e621b36Ca9cea147a78D4c39f) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      sourceHashes.1:
-        "0x03bcdc719cb7bd0a1377c01bb50b30a6122b308f673b7d7b15a3bb8628e6bd8c"
+        "0x21cd6c80343ba49cbb9f3e96c5f4ca0bc77bc617825495fbaad1026ed9a42026"
      values.$implementation:
-        "eth:0x5D5a095665886119693F0B41d8DFeE78da033e8B"
+        "eth:0xD26bB3aaAa4cB5638A8581A4c4b1d937D8E05c54"
      values.$pastUpgrades.3:
+        ["2025-07-24T18:01:35.000Z","0xdd89a3933dea0f44e1a461441f3c78e341702e9a4148784780644cdac90148c2",["eth:0xD26bB3aaAa4cB5638A8581A4c4b1d937D8E05c54"]]
      values.$upgradeCount:
-        3
+        4
      values.version:
-        "2.6.0"
+        "2.9.0"
      values.initVersion:
+        2
      values.proxyAdmin:
+        "eth:0x89889B569c3a505f3640ee1Bd0ac1D557f436D2a"
      values.proxyAdminOwner:
+        "eth:0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A"
      values.systemConfig:
+        "eth:0x7A8Ed66B319911A0F3E7288BDdAB30d9c0C875c3"
      implementationNames.eth:0x5D5a095665886119693F0B41d8DFeE78da033e8B:
-        "L1CrossDomainMessenger"
      implementationNames.eth:0xD26bB3aaAa4cB5638A8581A4c4b1d937D8E05c54:
+        "L1CrossDomainMessenger"
    }
```

```diff
-   Status: DELETED
    contract DeputyGuardianModule (0xc6901F65369FC59fC1B4D6D6bE7A2318Ff38dB5B)
    +++ description: allows the eth:0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A, called the deputy guardian, to act on behalf of the Gnosis Safe.
```

```diff
    contract L1StandardBridge (0xeb9bf100225c214Efc3E7C651ebbaDcF85177607) {
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
+        "eth:0x89889B569c3a505f3640ee1Bd0ac1D557f436D2a"
      values.proxyAdminOwner:
+        "eth:0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A"
      values.systemConfig:
+        "eth:0x7A8Ed66B319911A0F3E7288BDdAB30d9c0C875c3"
      implementationNames.eth:0x0b09ba359A106C9ea3b181CBc5F394570c7d2a7A:
-        "L1StandardBridge"
      implementationNames.eth:0x44AfB7722AF276A601D524F429016A18B6923df0:
+        "L1StandardBridge"
    }
```

```diff
-   Status: DELETED
    contract MIPS (0xF027F4A985560fb13324e943edf55ad6F1d15Dc1)
    +++ description: The MIPS contract is used to execute the final step of the dispute game which objectively determines the winner of the dispute.
```

```diff
+   Status: CREATED
    contract DelayedWETH (0x372dC0B87b790D6e1308CF9e7f73F0F1fcbD3754)
    +++ description: Contract designed to hold the bonded ETH for each game. It is designed as a wrapper around WETH to allow an owner to function as a backstop if a game would incorrectly distribute funds.
```

```diff
+   Status: CREATED
    contract PermissionedDisputeGame (0x3c12f1F4F0702CB7fC83e2e5594331c10b9e39b4)
    +++ description: Same as FaultDisputeGame, but only two permissioned addresses are designated as proposer and challenger.
```

```diff
+   Status: CREATED
    contract AnchorStateRegistry (0x4890928941e62e273dA359374b105F803329F473)
    +++ description: Contains the latest confirmed state root that can be used as a starting point in a dispute game. It specifies which game type can be used for withdrawals, which currently is the PermissionedDisputeGame.
```

```diff
+   Status: CREATED
    contract ETHLockbox (0x67B4de6FfA66EF201Ea6099A89cA397D56622E31)
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

## Source code changes

```diff
.../AnchorStateRegistry/AnchorStateRegistry.sol    |  418 +++++++-
 .../DelayedWETH/DelayedWETH.sol                    |  406 +++++--
 .../DeputyGuardianModule.sol => /dev/null          |  156 ---
 .../DeputyPauseModule.sol                          |   87 +-
 .../DisputeGameFactory/DisputeGameFactory.sol      |  254 ++++-
 .../ethereum/.flat/ETHLockbox/ETHLockbox.sol       |  757 +++++++++++++
 .../soneium/ethereum/.flat/ETHLockbox/Proxy.p.sol  |  200 ++++
 .../L1CrossDomainMessenger.sol                     |  348 +++++-
 .../L1ERC721Bridge/L1ERC721Bridge.sol              |  298 +++++-
 .../L1StandardBridge/L1StandardBridge.sol          |  298 +++++-
 .../ethereum/{.flat@22437746 => .flat}/MIPS.sol    |  583 +++++-----
 .../OptimismPortal2/OptimismPortal2.sol            | 1111 +++++++++++++-------
 .../PermissionedDisputeGame.sol                    |  110 +-
 .../SuperchainConfig/SuperchainConfig.sol          |  487 ++++++---
 .../SystemConfig/SystemConfig.sol                  |  398 +++++--
 15 files changed, 4580 insertions(+), 1331 deletions(-)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22437746 (main branch discovery), not current.

```diff
    contract LivenessGuard (0x24424336F04440b1c28685a38303aC33C9D14a25) {
    +++ description: Modular contract to be used together with the LivenessModule. Tracks liveness / activity of Safe owners.
      template:
+        "gnosisSafeModules/LivenessGuard"
      description:
+        "Modular contract to be used together with the LivenessModule. Tracks liveness / activity of Safe owners."
    }
```

```diff
    EOA Optimism EOA 1 (0x352f1defB49718e7Ea411687E850aA8d6299F7aC) {
    +++ description: None
      receivedPermissions.0.via.1.condition:
-        "though restricted to the global pause function"
+        "though restricted to the SuperchainConfig's `pause()` function"
      receivedPermissions.1.via.3.condition:
-        "though restricted to the global pause function"
+        "though restricted to the SuperchainConfig's `pause()` function"
      directlyReceivedPermissions.0.condition:
-        "though restricted to the global pause function"
+        "though restricted to the SuperchainConfig's `pause()` function"
    }
```

Generated with discovered.json: 0xaf707818df003452243b14bbf7ea4c1984edb4bb

# Diff at Thu, 24 Jul 2025 16:48:28 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@a3f740c0fd51a5745c45d8f349ab01f4f33f7770 block: 22437746
- current block number: 22437746

## Description

set dispute game impl changes to high severity.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22437746 (main branch discovery), not current.

```diff
    contract DisputeGameFactory (0x512A3d2c7a43BD9261d2B8E8C9c70D4bd4D503C0) {
    +++ description: The dispute game factory allows the creation of dispute games, used to propose state roots and eventually challenge them.
      fieldMeta:
+        {"gameImpls":{"severity":"HIGH"},"game1337":{"severity":"HIGH"}}
    }
```

```diff
    contract OptimismPortal2 (0x88e529A6ccd302c948689Cd5156C83D4614FAE92) {
    +++ description: The OptimismPortal contract is the main entry point to deposit funds from L1 to L2. It also allows to prove and finalize withdrawals. It specifies which game type can be used for withdrawals, which currently is the PermissionedDisputeGame.
      fieldMeta.respectedGameType:
+        {"severity":"HIGH"}
    }
```

Generated with discovered.json: 0xddb46887b9e40985762a7e580c22387d75c260be

# Diff at Tue, 22 Jul 2025 14:11:28 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@d5d65d1883c757ae790bbd0a6f785c98310d2516 block: 22437746
- current block number: 22437746

## Description

Config: Kailua added to OptimismPortal2 and DisputeGameFactory.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22437746 (main branch discovery), not current.

```diff
    contract DisputeGameFactory (0x512A3d2c7a43BD9261d2B8E8C9c70D4bd4D503C0) {
    +++ description: The dispute game factory allows the creation of dispute games, used to propose state roots and eventually challenge them.
      values.game1337:
+        "eth:0x0000000000000000000000000000000000000000"
    }
```

```diff
    contract OptimismPortal2 (0x88e529A6ccd302c948689Cd5156C83D4614FAE92) {
    +++ description: The OptimismPortal contract is the main entry point to deposit funds from L1 to L2. It also allows to prove and finalize withdrawals. It specifies which game type can be used for withdrawals, which currently is the PermissionedDisputeGame.
      usedTypes.0.arg.1337:
+        "KailuaGame"
    }
```

Generated with discovered.json: 0x2037d3d9cab2a6d496fb6c4a1c110a6b248aac0e

# Diff at Mon, 14 Jul 2025 12:46:24 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@9f4300dad2f3d080cd56fa311d4a848556c74e72 block: 22437746
- current block number: 22437746

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22437746 (main branch discovery), not current.

```diff
    EOA  (0x000000000000000000000000000000000000dEaD) {
    +++ description: None
      address:
-        "0x000000000000000000000000000000000000dEaD"
+        "eth:0x000000000000000000000000000000000000dEaD"
    }
```

```diff
    EOA  (0x008dC74CecC9dedA8595B2Fe210cE5979F0BfA8e) {
    +++ description: None
      address:
-        "0x008dC74CecC9dedA8595B2Fe210cE5979F0BfA8e"
+        "eth:0x008dC74CecC9dedA8595B2Fe210cE5979F0BfA8e"
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
    contract AnchorStateRegistry (0x190B6ecEE5A2ddF39669288B9B8daEa4641ae8b1) {
    +++ description: Contains the latest confirmed state root that can be used as a starting point in a dispute game.
      address:
-        "0x190B6ecEE5A2ddF39669288B9B8daEa4641ae8b1"
+        "eth:0x190B6ecEE5A2ddF39669288B9B8daEa4641ae8b1"
      values.$admin:
-        "0x89889B569c3a505f3640ee1Bd0ac1D557f436D2a"
+        "eth:0x89889B569c3a505f3640ee1Bd0ac1D557f436D2a"
      values.$implementation:
-        "0x7b465370BB7A333f99edd19599EB7Fb1c2D3F8D2"
+        "eth:0x7b465370BB7A333f99edd19599EB7Fb1c2D3F8D2"
      values.$pastUpgrades.0.2.0:
-        "0x7b465370BB7A333f99edd19599EB7Fb1c2D3F8D2"
+        "eth:0x7b465370BB7A333f99edd19599EB7Fb1c2D3F8D2"
      values.disputeGameFactory:
-        "0x512A3d2c7a43BD9261d2B8E8C9c70D4bd4D503C0"
+        "eth:0x512A3d2c7a43BD9261d2B8E8C9c70D4bd4D503C0"
      values.portal:
-        "0x88e529A6ccd302c948689Cd5156C83D4614FAE92"
+        "eth:0x88e529A6ccd302c948689Cd5156C83D4614FAE92"
      values.superchainConfig:
-        "0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
+        "eth:0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
      implementationNames.0x190B6ecEE5A2ddF39669288B9B8daEa4641ae8b1:
-        "Proxy"
      implementationNames.0x7b465370BB7A333f99edd19599EB7Fb1c2D3F8D2:
-        "AnchorStateRegistry"
      implementationNames.eth:0x190B6ecEE5A2ddF39669288B9B8daEa4641ae8b1:
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
    contract LivenessGuard (0x24424336F04440b1c28685a38303aC33C9D14a25) {
    +++ description: None
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
    contract L1ERC20TokenBridge (0x2F543A7C9cc80Cc2427c892B96263098d23ee55a) {
    +++ description: Lido custom escrow for wstETH tokens that uses the canonical bridge for messaging but is governed externally.
      address:
-        "0x2F543A7C9cc80Cc2427c892B96263098d23ee55a"
+        "eth:0x2F543A7C9cc80Cc2427c892B96263098d23ee55a"
      values.$admin:
-        "0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c"
+        "eth:0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c"
      values.$implementation:
-        "0xf034dE8BD85A434d9Dc68F03382B589f86791425"
+        "eth:0xf034dE8BD85A434d9Dc68F03382B589f86791425"
      values.$pastUpgrades.0.2.0:
-        "0xf034dE8BD85A434d9Dc68F03382B589f86791425"
+        "eth:0xf034dE8BD85A434d9Dc68F03382B589f86791425"
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
-        "0xaA9BD8c957D803466FA92504BDd728cC140f8941"
+        "eth:0xaA9BD8c957D803466FA92504BDd728cC140f8941"
      values.L2_TOKEN_REBASABLE:
-        "0x0Ce031AEd457C870D74914eCAA7971dd3176cDAF"
+        "eth:0x0Ce031AEd457C870D74914eCAA7971dd3176cDAF"
      values.l2TokenBridge:
-        "0xb4a0Cc7bE277DC9F9CBB6fbE8574B6f5221018D8"
+        "eth:0xb4a0Cc7bE277DC9F9CBB6fbE8574B6f5221018D8"
      values.MESSENGER:
-        "0x9CF951E3F74B644e621b36Ca9cea147a78D4c39f"
+        "eth:0x9CF951E3F74B644e621b36Ca9cea147a78D4c39f"
      values.proxy__getAdmin:
-        "0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c"
+        "eth:0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c"
      values.proxy__getImplementation:
-        "0xf034dE8BD85A434d9Dc68F03382B589f86791425"
+        "eth:0xf034dE8BD85A434d9Dc68F03382B589f86791425"
      values.WSTETH:
-        "0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0"
+        "eth:0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0"
      implementationNames.0x2F543A7C9cc80Cc2427c892B96263098d23ee55a:
-        "OssifiableProxy"
      implementationNames.0xf034dE8BD85A434d9Dc68F03382B589f86791425:
-        "L1LidoTokensBridge"
      implementationNames.eth:0x2F543A7C9cc80Cc2427c892B96263098d23ee55a:
+        "OssifiableProxy"
      implementationNames.eth:0xf034dE8BD85A434d9Dc68F03382B589f86791425:
+        "L1LidoTokensBridge"
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
    EOA Optimism EOA 1 (0x352f1defB49718e7Ea411687E850aA8d6299F7aC) {
    +++ description: None
      address:
-        "0x352f1defB49718e7Ea411687E850aA8d6299F7aC"
+        "eth:0x352f1defB49718e7Ea411687E850aA8d6299F7aC"
    }
```

```diff
    contract PermissionedDisputeGame (0x3D56d47b9E7E34A46612BadC70377F74051E6b17) {
    +++ description: Same as FaultDisputeGame, but only two permissioned addresses are designated as proposer and challenger.
      address:
-        "0x3D56d47b9E7E34A46612BadC70377F74051E6b17"
+        "eth:0x3D56d47b9E7E34A46612BadC70377F74051E6b17"
      values.anchorStateRegistry:
-        "0x190B6ecEE5A2ddF39669288B9B8daEa4641ae8b1"
+        "eth:0x190B6ecEE5A2ddF39669288B9B8daEa4641ae8b1"
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
-        "0x400c164C4a8cA84385B70EEd6eB03ea847c8E1b8"
+        "eth:0x400c164C4a8cA84385B70EEd6eB03ea847c8E1b8"
      values.vm:
-        "0xF027F4A985560fb13324e943edf55ad6F1d15Dc1"
+        "eth:0xF027F4A985560fb13324e943edf55ad6F1d15Dc1"
      values.weth:
-        "0x9AEA1FD851b63d57Ba4Fc556B0e0c170126C9EAf"
+        "eth:0x9AEA1FD851b63d57Ba4Fc556B0e0c170126C9EAf"
      implementationNames.0x3D56d47b9E7E34A46612BadC70377F74051E6b17:
-        "PermissionedDisputeGame"
      implementationNames.eth:0x3D56d47b9E7E34A46612BadC70377F74051E6b17:
+        "PermissionedDisputeGame"
    }
```

```diff
    EOA  (0x400c164C4a8cA84385B70EEd6eB03ea847c8E1b8) {
    +++ description: None
      address:
-        "0x400c164C4a8cA84385B70EEd6eB03ea847c8E1b8"
+        "eth:0x400c164C4a8cA84385B70EEd6eB03ea847c8E1b8"
    }
```

```diff
    EOA  (0x420537Ec5e82CDE86f04F3d61F3aD56F7c7dD32B) {
    +++ description: None
      address:
-        "0x420537Ec5e82CDE86f04F3d61F3aD56F7c7dD32B"
+        "eth:0x420537Ec5e82CDE86f04F3d61F3aD56F7c7dD32B"
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
    contract Soneium Multisig (0x509182eC226b3B71D36A3255A80EF0b1A9D43033) {
    +++ description: None
      address:
-        "0x509182eC226b3B71D36A3255A80EF0b1A9D43033"
+        "eth:0x509182eC226b3B71D36A3255A80EF0b1A9D43033"
      values.$implementation:
-        "0x41675C099F32341bf84BFc5382aF534df5C7461a"
+        "eth:0x41675C099F32341bf84BFc5382aF534df5C7461a"
      values.$members.0:
-        "0xd45F9F3990C48AfA5C90404c7a748b4c23FB2cba"
+        "eth:0xd45F9F3990C48AfA5C90404c7a748b4c23FB2cba"
      values.$members.1:
-        "0x94e9Ef16A9eF6C37164A7BCA6CFb03b52d23AF7E"
+        "eth:0x94e9Ef16A9eF6C37164A7BCA6CFb03b52d23AF7E"
      values.$members.2:
-        "0x420537Ec5e82CDE86f04F3d61F3aD56F7c7dD32B"
+        "eth:0x420537Ec5e82CDE86f04F3d61F3aD56F7c7dD32B"
      values.$members.3:
-        "0xb9269f274E7Edc73bf3d923E347d0784e4a5e452"
+        "eth:0xb9269f274E7Edc73bf3d923E347d0784e4a5e452"
      values.$members.4:
-        "0xD6db4b8aD9b8BD4665B968fab017ffEAb546F94a"
+        "eth:0xD6db4b8aD9b8BD4665B968fab017ffEAb546F94a"
      values.$members.5:
-        "0xba1a565d2bF6D27F451a459308f423219478c5cB"
+        "eth:0xba1a565d2bF6D27F451a459308f423219478c5cB"
      implementationNames.0x509182eC226b3B71D36A3255A80EF0b1A9D43033:
-        "SafeProxy"
      implementationNames.0x41675C099F32341bf84BFc5382aF534df5C7461a:
-        "Safe"
      implementationNames.eth:0x509182eC226b3B71D36A3255A80EF0b1A9D43033:
+        "SafeProxy"
      implementationNames.eth:0x41675C099F32341bf84BFc5382aF534df5C7461a:
+        "Safe"
    }
```

```diff
    contract DisputeGameFactory (0x512A3d2c7a43BD9261d2B8E8C9c70D4bd4D503C0) {
    +++ description: The dispute game factory allows the creation of dispute games, used to propose state roots and eventually challenge them.
      address:
-        "0x512A3d2c7a43BD9261d2B8E8C9c70D4bd4D503C0"
+        "eth:0x512A3d2c7a43BD9261d2B8E8C9c70D4bd4D503C0"
      values.$admin:
-        "0x89889B569c3a505f3640ee1Bd0ac1D557f436D2a"
+        "eth:0x89889B569c3a505f3640ee1Bd0ac1D557f436D2a"
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
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.gameImpls.1:
-        "0x3D56d47b9E7E34A46612BadC70377F74051E6b17"
+        "eth:0x3D56d47b9E7E34A46612BadC70377F74051E6b17"
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
      implementationNames.0x512A3d2c7a43BD9261d2B8E8C9c70D4bd4D503C0:
-        "Proxy"
      implementationNames.0x4bbA758F006Ef09402eF31724203F316ab74e4a0:
-        "DisputeGameFactory"
      implementationNames.eth:0x512A3d2c7a43BD9261d2B8E8C9c70D4bd4D503C0:
+        "Proxy"
      implementationNames.eth:0x4bbA758F006Ef09402eF31724203F316ab74e4a0:
+        "DisputeGameFactory"
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
    contract L1ERC721Bridge (0x5933e323bE8896DfaCd1cD671442F27dAA10a053) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      address:
-        "0x5933e323bE8896DfaCd1cD671442F27dAA10a053"
+        "eth:0x5933e323bE8896DfaCd1cD671442F27dAA10a053"
      values.$admin:
-        "0x89889B569c3a505f3640ee1Bd0ac1D557f436D2a"
+        "eth:0x89889B569c3a505f3640ee1Bd0ac1D557f436D2a"
      values.$implementation:
-        "0x7aE1d3BD877a4C5CA257404ce26BE93A02C98013"
+        "eth:0x7aE1d3BD877a4C5CA257404ce26BE93A02C98013"
      values.$pastUpgrades.0.2.0:
-        "0xAE2AF01232a6c4a4d3012C5eC5b1b35059caF10d"
+        "eth:0xAE2AF01232a6c4a4d3012C5eC5b1b35059caF10d"
      values.$pastUpgrades.1.2.0:
-        "0x276d3730f219f7ec22274f7263180b8452B46d47"
+        "eth:0x276d3730f219f7ec22274f7263180b8452B46d47"
      values.$pastUpgrades.2.2.0:
-        "0x7aE1d3BD877a4C5CA257404ce26BE93A02C98013"
+        "eth:0x7aE1d3BD877a4C5CA257404ce26BE93A02C98013"
      values.messenger:
-        "0x9CF951E3F74B644e621b36Ca9cea147a78D4c39f"
+        "eth:0x9CF951E3F74B644e621b36Ca9cea147a78D4c39f"
      values.MESSENGER:
-        "0x9CF951E3F74B644e621b36Ca9cea147a78D4c39f"
+        "eth:0x9CF951E3F74B644e621b36Ca9cea147a78D4c39f"
      values.OTHER_BRIDGE:
-        "0x4200000000000000000000000000000000000014"
+        "eth:0x4200000000000000000000000000000000000014"
      values.otherBridge:
-        "0x4200000000000000000000000000000000000014"
+        "eth:0x4200000000000000000000000000000000000014"
      values.superchainConfig:
-        "0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
+        "eth:0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
      implementationNames.0x5933e323bE8896DfaCd1cD671442F27dAA10a053:
-        "Proxy"
      implementationNames.0x7aE1d3BD877a4C5CA257404ce26BE93A02C98013:
-        "L1ERC721Bridge"
      implementationNames.eth:0x5933e323bE8896DfaCd1cD671442F27dAA10a053:
+        "Proxy"
      implementationNames.eth:0x7aE1d3BD877a4C5CA257404ce26BE93A02C98013:
+        "L1ERC721Bridge"
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
    EOA  (0x6776BE80dBAda6A02B5F2095cF13734ac303B8d1) {
    +++ description: None
      address:
-        "0x6776BE80dBAda6A02B5F2095cF13734ac303B8d1"
+        "eth:0x6776BE80dBAda6A02B5F2095cF13734ac303B8d1"
    }
```

```diff
    contract SystemConfig (0x7A8Ed66B319911A0F3E7288BDdAB30d9c0C875c3) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      address:
-        "0x7A8Ed66B319911A0F3E7288BDdAB30d9c0C875c3"
+        "eth:0x7A8Ed66B319911A0F3E7288BDdAB30d9c0C875c3"
      values.$admin:
-        "0x89889B569c3a505f3640ee1Bd0ac1D557f436D2a"
+        "eth:0x89889B569c3a505f3640ee1Bd0ac1D557f436D2a"
      values.$implementation:
-        "0x340f923E5c7cbB2171146f64169EC9d5a9FfE647"
+        "eth:0x340f923E5c7cbB2171146f64169EC9d5a9FfE647"
      values.$pastUpgrades.0.2.0:
-        "0xF56D96B2535B932656d3c04Ebf51baBff241D886"
+        "eth:0xF56D96B2535B932656d3c04Ebf51baBff241D886"
      values.$pastUpgrades.1.2.0:
-        "0xF56D96B2535B932656d3c04Ebf51baBff241D886"
+        "eth:0xF56D96B2535B932656d3c04Ebf51baBff241D886"
      values.$pastUpgrades.2.2.0:
-        "0xd81f43eDBCAcb4c29a9bA38a13Ee5d79278270cC"
+        "eth:0xd81f43eDBCAcb4c29a9bA38a13Ee5d79278270cC"
      values.$pastUpgrades.3.2.0:
-        "0xAB9d6cB7A427c0765163A7f45BB91cAfe5f2D375"
+        "eth:0xAB9d6cB7A427c0765163A7f45BB91cAfe5f2D375"
      values.$pastUpgrades.4.2.0:
-        "0x760C48C62A85045A6B69f07F4a9f22868659CbCc"
+        "eth:0x760C48C62A85045A6B69f07F4a9f22868659CbCc"
      values.$pastUpgrades.5.2.0:
-        "0x340f923E5c7cbB2171146f64169EC9d5a9FfE647"
+        "eth:0x340f923E5c7cbB2171146f64169EC9d5a9FfE647"
      values.batcherHash:
-        "0x6776BE80dBAda6A02B5F2095cF13734ac303B8d1"
+        "eth:0x6776BE80dBAda6A02B5F2095cF13734ac303B8d1"
      values.batchInbox:
-        "0x008dC74CecC9dedA8595B2Fe210cE5979F0BfA8e"
+        "eth:0x008dC74CecC9dedA8595B2Fe210cE5979F0BfA8e"
      values.disputeGameFactory:
-        "0x512A3d2c7a43BD9261d2B8E8C9c70D4bd4D503C0"
+        "eth:0x512A3d2c7a43BD9261d2B8E8C9c70D4bd4D503C0"
      values.getAddresses.l1CrossDomainMessenger:
-        "0x9CF951E3F74B644e621b36Ca9cea147a78D4c39f"
+        "eth:0x9CF951E3F74B644e621b36Ca9cea147a78D4c39f"
      values.getAddresses.l1ERC721Bridge:
-        "0x5933e323bE8896DfaCd1cD671442F27dAA10a053"
+        "eth:0x5933e323bE8896DfaCd1cD671442F27dAA10a053"
      values.getAddresses.l1StandardBridge:
-        "0xeb9bf100225c214Efc3E7C651ebbaDcF85177607"
+        "eth:0xeb9bf100225c214Efc3E7C651ebbaDcF85177607"
      values.getAddresses.disputeGameFactory:
-        "0x512A3d2c7a43BD9261d2B8E8C9c70D4bd4D503C0"
+        "eth:0x512A3d2c7a43BD9261d2B8E8C9c70D4bd4D503C0"
      values.getAddresses.optimismPortal:
-        "0x88e529A6ccd302c948689Cd5156C83D4614FAE92"
+        "eth:0x88e529A6ccd302c948689Cd5156C83D4614FAE92"
      values.getAddresses.optimismMintableERC20Factory:
-        "0xc1047e30EFC9E172cFe7aa0219895B6a43fC415F"
+        "eth:0xc1047e30EFC9E172cFe7aa0219895B6a43fC415F"
      values.l1CrossDomainMessenger:
-        "0x9CF951E3F74B644e621b36Ca9cea147a78D4c39f"
+        "eth:0x9CF951E3F74B644e621b36Ca9cea147a78D4c39f"
      values.l1ERC721Bridge:
-        "0x5933e323bE8896DfaCd1cD671442F27dAA10a053"
+        "eth:0x5933e323bE8896DfaCd1cD671442F27dAA10a053"
      values.l1StandardBridge:
-        "0xeb9bf100225c214Efc3E7C651ebbaDcF85177607"
+        "eth:0xeb9bf100225c214Efc3E7C651ebbaDcF85177607"
      values.optimismMintableERC20Factory:
-        "0xc1047e30EFC9E172cFe7aa0219895B6a43fC415F"
+        "eth:0xc1047e30EFC9E172cFe7aa0219895B6a43fC415F"
      values.optimismPortal:
-        "0x88e529A6ccd302c948689Cd5156C83D4614FAE92"
+        "eth:0x88e529A6ccd302c948689Cd5156C83D4614FAE92"
      values.owner:
-        "0x509182eC226b3B71D36A3255A80EF0b1A9D43033"
+        "eth:0x509182eC226b3B71D36A3255A80EF0b1A9D43033"
      values.sequencerInbox:
-        "0x008dC74CecC9dedA8595B2Fe210cE5979F0BfA8e"
+        "eth:0x008dC74CecC9dedA8595B2Fe210cE5979F0BfA8e"
      values.unsafeBlockSigner:
-        "0x7c2Bd59ee2a2C7391c9A240132f26071e9546262"
+        "eth:0x7c2Bd59ee2a2C7391c9A240132f26071e9546262"
      implementationNames.0x7A8Ed66B319911A0F3E7288BDdAB30d9c0C875c3:
-        "Proxy"
      implementationNames.0x340f923E5c7cbB2171146f64169EC9d5a9FfE647:
-        "SystemConfig"
      implementationNames.eth:0x7A8Ed66B319911A0F3E7288BDdAB30d9c0C875c3:
+        "Proxy"
      implementationNames.eth:0x340f923E5c7cbB2171146f64169EC9d5a9FfE647:
+        "SystemConfig"
    }
```

```diff
    EOA  (0x7c2Bd59ee2a2C7391c9A240132f26071e9546262) {
    +++ description: None
      address:
-        "0x7c2Bd59ee2a2C7391c9A240132f26071e9546262"
+        "eth:0x7c2Bd59ee2a2C7391c9A240132f26071e9546262"
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
    contract OptimismPortal2 (0x88e529A6ccd302c948689Cd5156C83D4614FAE92) {
    +++ description: The OptimismPortal contract is the main entry point to deposit funds from L1 to L2. It also allows to prove and finalize withdrawals. It specifies which game type can be used for withdrawals, which currently is the PermissionedDisputeGame.
      address:
-        "0x88e529A6ccd302c948689Cd5156C83D4614FAE92"
+        "eth:0x88e529A6ccd302c948689Cd5156C83D4614FAE92"
      values.$admin:
-        "0x89889B569c3a505f3640ee1Bd0ac1D557f436D2a"
+        "eth:0x89889B569c3a505f3640ee1Bd0ac1D557f436D2a"
      values.$implementation:
-        "0xB443Da3e07052204A02d630a8933dAc05a0d6fB4"
+        "eth:0xB443Da3e07052204A02d630a8933dAc05a0d6fB4"
      values.$pastUpgrades.0.2.0:
-        "0xe2F826324b2faf99E513D16D266c3F80aE87832B"
+        "eth:0xe2F826324b2faf99E513D16D266c3F80aE87832B"
      values.$pastUpgrades.1.2.0:
-        "0x2D7e764a0D9919e16983a46595CfA81fc34fa7Cd"
+        "eth:0x2D7e764a0D9919e16983a46595CfA81fc34fa7Cd"
      values.$pastUpgrades.2.2.0:
-        "0xB443Da3e07052204A02d630a8933dAc05a0d6fB4"
+        "eth:0xB443Da3e07052204A02d630a8933dAc05a0d6fB4"
      values.disputeGameFactory:
-        "0x512A3d2c7a43BD9261d2B8E8C9c70D4bd4D503C0"
+        "eth:0x512A3d2c7a43BD9261d2B8E8C9c70D4bd4D503C0"
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
-        "0x7A8Ed66B319911A0F3E7288BDdAB30d9c0C875c3"
+        "eth:0x7A8Ed66B319911A0F3E7288BDdAB30d9c0C875c3"
      implementationNames.0x88e529A6ccd302c948689Cd5156C83D4614FAE92:
-        "Proxy"
      implementationNames.0xB443Da3e07052204A02d630a8933dAc05a0d6fB4:
-        "OptimismPortal2"
      implementationNames.eth:0x88e529A6ccd302c948689Cd5156C83D4614FAE92:
+        "Proxy"
      implementationNames.eth:0xB443Da3e07052204A02d630a8933dAc05a0d6fB4:
+        "OptimismPortal2"
    }
```

```diff
    contract ProxyAdmin (0x89889B569c3a505f3640ee1Bd0ac1D557f436D2a) {
    +++ description: None
      address:
-        "0x89889B569c3a505f3640ee1Bd0ac1D557f436D2a"
+        "eth:0x89889B569c3a505f3640ee1Bd0ac1D557f436D2a"
      values.addressManager:
-        "0xB24bFEeCE1B3b7A44559F4Cbc21BeD312b130b70"
+        "eth:0xB24bFEeCE1B3b7A44559F4Cbc21BeD312b130b70"
      values.owner:
-        "0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A"
+        "eth:0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A"
      implementationNames.0x89889B569c3a505f3640ee1Bd0ac1D557f436D2a:
-        "ProxyAdmin"
      implementationNames.eth:0x89889B569c3a505f3640ee1Bd0ac1D557f436D2a:
+        "ProxyAdmin"
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
    EOA  (0x94e9Ef16A9eF6C37164A7BCA6CFb03b52d23AF7E) {
    +++ description: None
      address:
-        "0x94e9Ef16A9eF6C37164A7BCA6CFb03b52d23AF7E"
+        "eth:0x94e9Ef16A9eF6C37164A7BCA6CFb03b52d23AF7E"
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
    contract DelayedWETH (0x9AEA1FD851b63d57Ba4Fc556B0e0c170126C9EAf) {
    +++ description: Contract designed to hold the bonded ETH for each game. It is designed as a wrapper around WETH to allow an owner to function as a backstop if a game would incorrectly distribute funds.
      address:
-        "0x9AEA1FD851b63d57Ba4Fc556B0e0c170126C9EAf"
+        "eth:0x9AEA1FD851b63d57Ba4Fc556B0e0c170126C9EAf"
      values.$admin:
-        "0x89889B569c3a505f3640ee1Bd0ac1D557f436D2a"
+        "eth:0x89889B569c3a505f3640ee1Bd0ac1D557f436D2a"
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
      implementationNames.0x9AEA1FD851b63d57Ba4Fc556B0e0c170126C9EAf:
-        "Proxy"
      implementationNames.0x5e40B9231B86984b5150507046e354dbFbeD3d9e:
-        "DelayedWETH"
      implementationNames.eth:0x9AEA1FD851b63d57Ba4Fc556B0e0c170126C9EAf:
+        "Proxy"
      implementationNames.eth:0x5e40B9231B86984b5150507046e354dbFbeD3d9e:
+        "DelayedWETH"
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
    contract L1CrossDomainMessenger (0x9CF951E3F74B644e621b36Ca9cea147a78D4c39f) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      address:
-        "0x9CF951E3F74B644e621b36Ca9cea147a78D4c39f"
+        "eth:0x9CF951E3F74B644e621b36Ca9cea147a78D4c39f"
      values.$admin:
-        "0x89889B569c3a505f3640ee1Bd0ac1D557f436D2a"
+        "eth:0x89889B569c3a505f3640ee1Bd0ac1D557f436D2a"
      values.$implementation:
-        "0x5D5a095665886119693F0B41d8DFeE78da033e8B"
+        "eth:0x5D5a095665886119693F0B41d8DFeE78da033e8B"
      values.$pastUpgrades.0.2.0:
-        "0xD3494713A5cfaD3F5359379DfA074E2Ac8C6Fd65"
+        "eth:0xD3494713A5cfaD3F5359379DfA074E2Ac8C6Fd65"
      values.$pastUpgrades.1.2.0:
-        "0x3eA6084748ED1b2A9B5D4426181F1ad8C93F6231"
+        "eth:0x3eA6084748ED1b2A9B5D4426181F1ad8C93F6231"
      values.$pastUpgrades.2.2.0:
-        "0x5D5a095665886119693F0B41d8DFeE78da033e8B"
+        "eth:0x5D5a095665886119693F0B41d8DFeE78da033e8B"
      values.OTHER_MESSENGER:
-        "0x4200000000000000000000000000000000000007"
+        "eth:0x4200000000000000000000000000000000000007"
      values.otherMessenger:
-        "0x4200000000000000000000000000000000000007"
+        "eth:0x4200000000000000000000000000000000000007"
      values.portal:
-        "0x88e529A6ccd302c948689Cd5156C83D4614FAE92"
+        "eth:0x88e529A6ccd302c948689Cd5156C83D4614FAE92"
      values.PORTAL:
-        "0x88e529A6ccd302c948689Cd5156C83D4614FAE92"
+        "eth:0x88e529A6ccd302c948689Cd5156C83D4614FAE92"
      values.ResolvedDelegateProxy_addressManager:
-        "0xB24bFEeCE1B3b7A44559F4Cbc21BeD312b130b70"
+        "eth:0xB24bFEeCE1B3b7A44559F4Cbc21BeD312b130b70"
      values.superchainConfig:
-        "0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
+        "eth:0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
      implementationNames.0x9CF951E3F74B644e621b36Ca9cea147a78D4c39f:
-        "ResolvedDelegateProxy"
      implementationNames.0x5D5a095665886119693F0B41d8DFeE78da033e8B:
-        "L1CrossDomainMessenger"
      implementationNames.eth:0x9CF951E3F74B644e621b36Ca9cea147a78D4c39f:
+        "ResolvedDelegateProxy"
      implementationNames.eth:0x5D5a095665886119693F0B41d8DFeE78da033e8B:
+        "L1CrossDomainMessenger"
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
    EOA  (0xb23794fd6BA1CEAd01Cf54D772b8341F2F0197A5) {
    +++ description: None
      address:
-        "0xb23794fd6BA1CEAd01Cf54D772b8341F2F0197A5"
+        "eth:0xb23794fd6BA1CEAd01Cf54D772b8341F2F0197A5"
    }
```

```diff
    contract AddressManager (0xB24bFEeCE1B3b7A44559F4Cbc21BeD312b130b70) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      address:
-        "0xB24bFEeCE1B3b7A44559F4Cbc21BeD312b130b70"
+        "eth:0xB24bFEeCE1B3b7A44559F4Cbc21BeD312b130b70"
      values.owner:
-        "0x89889B569c3a505f3640ee1Bd0ac1D557f436D2a"
+        "eth:0x89889B569c3a505f3640ee1Bd0ac1D557f436D2a"
      implementationNames.0xB24bFEeCE1B3b7A44559F4Cbc21BeD312b130b70:
-        "AddressManager"
      implementationNames.eth:0xB24bFEeCE1B3b7A44559F4Cbc21BeD312b130b70:
+        "AddressManager"
    }
```

```diff
    EOA  (0xb9269f274E7Edc73bf3d923E347d0784e4a5e452) {
    +++ description: None
      address:
-        "0xb9269f274E7Edc73bf3d923E347d0784e4a5e452"
+        "eth:0xb9269f274E7Edc73bf3d923E347d0784e4a5e452"
    }
```

```diff
    EOA  (0xba1a565d2bF6D27F451a459308f423219478c5cB) {
    +++ description: None
      address:
-        "0xba1a565d2bF6D27F451a459308f423219478c5cB"
+        "eth:0xba1a565d2bF6D27F451a459308f423219478c5cB"
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
    contract OptimismMintableERC20Factory (0xc1047e30EFC9E172cFe7aa0219895B6a43fC415F) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintableERC20 as this chain's representation of a token on the host chain, or vice-versa.
      address:
-        "0xc1047e30EFC9E172cFe7aa0219895B6a43fC415F"
+        "eth:0xc1047e30EFC9E172cFe7aa0219895B6a43fC415F"
      values.$admin:
-        "0x89889B569c3a505f3640ee1Bd0ac1D557f436D2a"
+        "eth:0x89889B569c3a505f3640ee1Bd0ac1D557f436D2a"
      values.$implementation:
-        "0x5493f4677A186f64805fe7317D6993ba4863988F"
+        "eth:0x5493f4677A186f64805fe7317D6993ba4863988F"
      values.$pastUpgrades.0.2.0:
-        "0xE01efbeb1089D1d1dB9c6c8b135C934C0734c846"
+        "eth:0xE01efbeb1089D1d1dB9c6c8b135C934C0734c846"
      values.$pastUpgrades.1.2.0:
-        "0x5493f4677A186f64805fe7317D6993ba4863988F"
+        "eth:0x5493f4677A186f64805fe7317D6993ba4863988F"
      values.bridge:
-        "0xeb9bf100225c214Efc3E7C651ebbaDcF85177607"
+        "eth:0xeb9bf100225c214Efc3E7C651ebbaDcF85177607"
      values.BRIDGE:
-        "0xeb9bf100225c214Efc3E7C651ebbaDcF85177607"
+        "eth:0xeb9bf100225c214Efc3E7C651ebbaDcF85177607"
      implementationNames.0xc1047e30EFC9E172cFe7aa0219895B6a43fC415F:
-        "Proxy"
      implementationNames.0x5493f4677A186f64805fe7317D6993ba4863988F:
-        "OptimismMintableERC20Factory"
      implementationNames.eth:0xc1047e30EFC9E172cFe7aa0219895B6a43fC415F:
+        "Proxy"
      implementationNames.eth:0x5493f4677A186f64805fe7317D6993ba4863988F:
+        "OptimismMintableERC20Factory"
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
    contract L1OpUSDCBridgeAdapter (0xC67A8c5f22b40274Ca7C4A56Db89569Ee2AD3FAb) {
    +++ description: Escrow for USDC that uses the canonical bridge for messaging but is governed externally.
      address:
-        "0xC67A8c5f22b40274Ca7C4A56Db89569Ee2AD3FAb"
+        "eth:0xC67A8c5f22b40274Ca7C4A56Db89569Ee2AD3FAb"
      values.$admin:
-        "0xE7c9a9DddAb8a384c38D721DE64E4222Fe76DF75"
+        "eth:0xE7c9a9DddAb8a384c38D721DE64E4222Fe76DF75"
      values.$implementation:
-        "0xcfF35e3C0B8D197A6Ce10802cd649FBb9957dA07"
+        "eth:0xcfF35e3C0B8D197A6Ce10802cd649FBb9957dA07"
      values.$pastUpgrades.0.2.0:
-        "0xcfF35e3C0B8D197A6Ce10802cd649FBb9957dA07"
+        "eth:0xcfF35e3C0B8D197A6Ce10802cd649FBb9957dA07"
      values.burnCaller:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.eip712Domain.verifyingContract:
-        "0xC67A8c5f22b40274Ca7C4A56Db89569Ee2AD3FAb"
+        "eth:0xC67A8c5f22b40274Ca7C4A56Db89569Ee2AD3FAb"
      values.LINKED_ADAPTER:
-        "0x8be79275FCfD08A931087ECf70Ba8a99aee3AC59"
+        "eth:0x8be79275FCfD08A931087ECf70Ba8a99aee3AC59"
      values.MESSENGER:
-        "0x9CF951E3F74B644e621b36Ca9cea147a78D4c39f"
+        "eth:0x9CF951E3F74B644e621b36Ca9cea147a78D4c39f"
      values.owner:
-        "0xE7c9a9DddAb8a384c38D721DE64E4222Fe76DF75"
+        "eth:0xE7c9a9DddAb8a384c38D721DE64E4222Fe76DF75"
      values.USDC:
-        "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"
+        "eth:0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"
      implementationNames.0xC67A8c5f22b40274Ca7C4A56Db89569Ee2AD3FAb:
-        "ERC1967Proxy"
      implementationNames.0xcfF35e3C0B8D197A6Ce10802cd649FBb9957dA07:
-        "L1OpUSDCBridgeAdapter"
      implementationNames.eth:0xC67A8c5f22b40274Ca7C4A56Db89569Ee2AD3FAb:
+        "ERC1967Proxy"
      implementationNames.eth:0xcfF35e3C0B8D197A6Ce10802cd649FBb9957dA07:
+        "L1OpUSDCBridgeAdapter"
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
    EOA  (0xd45F9F3990C48AfA5C90404c7a748b4c23FB2cba) {
    +++ description: None
      address:
-        "0xd45F9F3990C48AfA5C90404c7a748b4c23FB2cba"
+        "eth:0xd45F9F3990C48AfA5C90404c7a748b4c23FB2cba"
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
    EOA  (0xD6db4b8aD9b8BD4665B968fab017ffEAb546F94a) {
    +++ description: None
      address:
-        "0xD6db4b8aD9b8BD4665B968fab017ffEAb546F94a"
+        "eth:0xD6db4b8aD9b8BD4665B968fab017ffEAb546F94a"
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
      implementationNames.0xdE1FCfB0851916CA5101820A69b13a4E276bd81F:
-        "Lib_AddressManager"
      implementationNames.eth:0xdE1FCfB0851916CA5101820A69b13a4E276bd81F:
+        "Lib_AddressManager"
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
    contract L1StandardBridge (0xeb9bf100225c214Efc3E7C651ebbaDcF85177607) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      address:
-        "0xeb9bf100225c214Efc3E7C651ebbaDcF85177607"
+        "eth:0xeb9bf100225c214Efc3E7C651ebbaDcF85177607"
      values.$admin:
-        "0x89889B569c3a505f3640ee1Bd0ac1D557f436D2a"
+        "eth:0x89889B569c3a505f3640ee1Bd0ac1D557f436D2a"
      values.$implementation:
-        "0x0b09ba359A106C9ea3b181CBc5F394570c7d2a7A"
+        "eth:0x0b09ba359A106C9ea3b181CBc5F394570c7d2a7A"
      values.l2TokenBridge:
-        "0x4200000000000000000000000000000000000010"
+        "eth:0x4200000000000000000000000000000000000010"
      values.messenger:
-        "0x9CF951E3F74B644e621b36Ca9cea147a78D4c39f"
+        "eth:0x9CF951E3F74B644e621b36Ca9cea147a78D4c39f"
      values.MESSENGER:
-        "0x9CF951E3F74B644e621b36Ca9cea147a78D4c39f"
+        "eth:0x9CF951E3F74B644e621b36Ca9cea147a78D4c39f"
      values.OTHER_BRIDGE:
-        "0x4200000000000000000000000000000000000010"
+        "eth:0x4200000000000000000000000000000000000010"
      values.otherBridge:
-        "0x4200000000000000000000000000000000000010"
+        "eth:0x4200000000000000000000000000000000000010"
      values.superchainConfig:
-        "0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
+        "eth:0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
      implementationNames.0xeb9bf100225c214Efc3E7C651ebbaDcF85177607:
-        "L1ChugSplashProxy"
      implementationNames.0x0b09ba359A106C9ea3b181CBc5F394570c7d2a7A:
-        "L1StandardBridge"
      implementationNames.eth:0xeb9bf100225c214Efc3E7C651ebbaDcF85177607:
+        "L1ChugSplashProxy"
      implementationNames.eth:0x0b09ba359A106C9ea3b181CBc5F394570c7d2a7A:
+        "L1StandardBridge"
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
    contract DeputyPauseModule (0x126a736B18E0a64fBA19D421647A530E327E112C)
    +++ description: Allows eth:0x352f1defB49718e7Ea411687E850aA8d6299F7aC, called the deputy pauser, to act on behalf of the eth:0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A if set as its Safe module.
```

```diff
+   Status: CREATED
    contract AnchorStateRegistry (0x190B6ecEE5A2ddF39669288B9B8daEa4641ae8b1)
    +++ description: Contains the latest confirmed state root that can be used as a starting point in a dispute game.
```

```diff
+   Status: CREATED
    contract PreimageOracle (0x1fb8cdFc6831fc866Ed9C51aF8817Da5c287aDD3)
    +++ description: The PreimageOracle contract is used to load the required data from L1 for a dispute game.
```

```diff
+   Status: CREATED
    contract LivenessGuard (0x24424336F04440b1c28685a38303aC33C9D14a25)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1ERC20TokenBridge (0x2F543A7C9cc80Cc2427c892B96263098d23ee55a)
    +++ description: Lido custom escrow for wstETH tokens that uses the canonical bridge for messaging but is governed externally.
```

```diff
+   Status: CREATED
    contract PermissionedDisputeGame (0x3D56d47b9E7E34A46612BadC70377F74051E6b17)
    +++ description: Same as FaultDisputeGame, but only two permissioned addresses are designated as proposer and challenger.
```

```diff
+   Status: CREATED
    contract GnosisSafe (0x42d27eEA1AD6e22Af6284F609847CB3Cd56B9c64)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Soneium Multisig (0x509182eC226b3B71D36A3255A80EF0b1A9D43033)
    +++ description: None
```

```diff
+   Status: CREATED
    contract DisputeGameFactory (0x512A3d2c7a43BD9261d2B8E8C9c70D4bd4D503C0)
    +++ description: The dispute game factory allows the creation of dispute games, used to propose state roots and eventually challenge them.
```

```diff
+   Status: CREATED
    contract SuperchainProxyAdmin (0x543bA4AADBAb8f9025686Bd03993043599c6fB04)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1ERC721Bridge (0x5933e323bE8896DfaCd1cD671442F27dAA10a053)
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
```

```diff
+   Status: CREATED
    contract SuperchainProxyAdminOwner (0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SystemConfig (0x7A8Ed66B319911A0F3E7288BDdAB30d9c0C875c3)
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
```

```diff
+   Status: CREATED
    contract OpFoundationUpgradeSafe (0x847B5c174615B1B7fDF770882256e2D3E95b9D92)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OptimismPortal2 (0x88e529A6ccd302c948689Cd5156C83D4614FAE92)
    +++ description: The OptimismPortal contract is the main entry point to deposit funds from L1 to L2. It also allows to prove and finalize withdrawals. It specifies which game type can be used for withdrawals, which currently is the PermissionedDisputeGame.
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x89889B569c3a505f3640ee1Bd0ac1D557f436D2a)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SuperchainConfig (0x95703e0982140D16f8ebA6d158FccEde42f04a4C)
    +++ description: Used to manage global configuration values for multiple OP Chains within a single Superchain network. The SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the Superchain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
```

```diff
+   Status: CREATED
    contract DelayedWETH (0x9AEA1FD851b63d57Ba4Fc556B0e0c170126C9EAf)
    +++ description: Contract designed to hold the bonded ETH for each game. It is designed as a wrapper around WETH to allow an owner to function as a backstop if a game would incorrectly distribute funds.
```

```diff
+   Status: CREATED
    contract OpFoundationOperationsSafe (0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1CrossDomainMessenger (0x9CF951E3F74B644e621b36Ca9cea147a78D4c39f)
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
```

```diff
+   Status: CREATED
    contract AddressManager (0xB24bFEeCE1B3b7A44559F4Cbc21BeD312b130b70)
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
```

```diff
+   Status: CREATED
    contract OptimismMintableERC20Factory (0xc1047e30EFC9E172cFe7aa0219895B6a43fC415F)
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintableERC20 as this chain's representation of a token on the host chain, or vice-versa.
```

```diff
+   Status: CREATED
    contract Optimism Security Council (0xc2819DC788505Aac350142A7A707BF9D03E3Bd03)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1OpUSDCBridgeAdapter (0xC67A8c5f22b40274Ca7C4A56Db89569Ee2AD3FAb)
    +++ description: Escrow for USDC that uses the canonical bridge for messaging but is governed externally.
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
    contract L1StandardBridge (0xeb9bf100225c214Efc3E7C651ebbaDcF85177607)
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
```

```diff
+   Status: CREATED
    contract MIPS (0xF027F4A985560fb13324e943edf55ad6F1d15Dc1)
    +++ description: The MIPS contract is used to execute the final step of the dispute game which objectively determines the winner of the dispute.
```

Generated with discovered.json: 0x1a4f022d2d714808992f800b30a52b77f9fcd482

# Diff at Mon, 14 Jul 2025 08:02:46 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@0dc82cd5064c9c6dc9fb20e2291a8bb6b2048e27 block: 22437746
- current block number: 22437746

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22437746 (main branch discovery), not current.

```diff
    contract OptimismMintableERC20Factory (0xc1047e30EFC9E172cFe7aa0219895B6a43fC415F) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintableERC20 as this chain's representation of a token on the host chain, or vice-versa.
      description:
-        "A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa."
+        "A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintableERC20 as this chain's representation of a token on the host chain, or vice-versa."
    }
```

Generated with discovered.json: 0x5a78ffd552a58204d7413a87d850f8186763a703

# Diff at Fri, 04 Jul 2025 12:19:21 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f56dc47fe915564d4555300304da4d3bcbc087f block: 22437746
- current block number: 22437746

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22437746 (main branch discovery), not current.

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
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0x0454092516c9A4d636d3CAfA1e82161376C8a748"
+        "eth:0x0454092516c9A4d636d3CAfA1e82161376C8a748"
    }
```

```diff
    EOA Optimism EOA 1 (0x352f1defB49718e7Ea411687E850aA8d6299F7aC) {
    +++ description: None
      receivedPermissions.0.via.1.address:
-        "ethereum:0x126a736B18E0a64fBA19D421647A530E327E112C"
+        "eth:0x126a736B18E0a64fBA19D421647A530E327E112C"
      receivedPermissions.0.via.0.address:
-        "ethereum:0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A"
+        "eth:0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A"
      receivedPermissions.0.from:
-        "ethereum:0x3D56d47b9E7E34A46612BadC70377F74051E6b17"
+        "eth:0x3D56d47b9E7E34A46612BadC70377F74051E6b17"
      receivedPermissions.1.via.3.address:
-        "ethereum:0x126a736B18E0a64fBA19D421647A530E327E112C"
+        "eth:0x126a736B18E0a64fBA19D421647A530E327E112C"
      receivedPermissions.1.via.2.address:
-        "ethereum:0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A"
+        "eth:0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A"
      receivedPermissions.1.via.1.address:
-        "ethereum:0xc6901F65369FC59fC1B4D6D6bE7A2318Ff38dB5B"
+        "eth:0xc6901F65369FC59fC1B4D6D6bE7A2318Ff38dB5B"
      receivedPermissions.1.via.0.address:
-        "ethereum:0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2"
+        "eth:0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2"
      receivedPermissions.1.from:
-        "ethereum:0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
+        "eth:0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
      directlyReceivedPermissions.0.from:
-        "ethereum:0x126a736B18E0a64fBA19D421647A530E327E112C"
+        "eth:0x126a736B18E0a64fBA19D421647A530E327E112C"
    }
```

```diff
    EOA  (0x400c164C4a8cA84385B70EEd6eB03ea847c8E1b8) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0x3D56d47b9E7E34A46612BadC70377F74051E6b17"
+        "eth:0x3D56d47b9E7E34A46612BadC70377F74051E6b17"
    }
```

```diff
    contract Soneium Multisig (0x509182eC226b3B71D36A3255A80EF0b1A9D43033) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0x7A8Ed66B319911A0F3E7288BDdAB30d9c0C875c3"
+        "eth:0x7A8Ed66B319911A0F3E7288BDdAB30d9c0C875c3"
    }
```

```diff
    contract SuperchainProxyAdmin (0x543bA4AADBAb8f9025686Bd03993043599c6fB04) {
    +++ description: None
      directlyReceivedPermissions.0.from:
-        "ethereum:0xdE1FCfB0851916CA5101820A69b13a4E276bd81F"
+        "eth:0xdE1FCfB0851916CA5101820A69b13a4E276bd81F"
      directlyReceivedPermissions.1.from:
-        "ethereum:0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
+        "eth:0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
    }
```

```diff
    contract SuperchainProxyAdminOwner (0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0x9AEA1FD851b63d57Ba4Fc556B0e0c170126C9EAf"
+        "eth:0x9AEA1FD851b63d57Ba4Fc556B0e0c170126C9EAf"
      receivedPermissions.1.via.0.address:
-        "ethereum:0x89889B569c3a505f3640ee1Bd0ac1D557f436D2a"
+        "eth:0x89889B569c3a505f3640ee1Bd0ac1D557f436D2a"
      receivedPermissions.1.from:
-        "ethereum:0xB24bFEeCE1B3b7A44559F4Cbc21BeD312b130b70"
+        "eth:0xB24bFEeCE1B3b7A44559F4Cbc21BeD312b130b70"
      receivedPermissions.2.via.0.address:
-        "ethereum:0x543bA4AADBAb8f9025686Bd03993043599c6fB04"
+        "eth:0x543bA4AADBAb8f9025686Bd03993043599c6fB04"
      receivedPermissions.2.from:
-        "ethereum:0xdE1FCfB0851916CA5101820A69b13a4E276bd81F"
+        "eth:0xdE1FCfB0851916CA5101820A69b13a4E276bd81F"
      receivedPermissions.3.via.0.address:
-        "ethereum:0x89889B569c3a505f3640ee1Bd0ac1D557f436D2a"
+        "eth:0x89889B569c3a505f3640ee1Bd0ac1D557f436D2a"
      receivedPermissions.3.from:
-        "ethereum:0x190B6ecEE5A2ddF39669288B9B8daEa4641ae8b1"
+        "eth:0x190B6ecEE5A2ddF39669288B9B8daEa4641ae8b1"
      receivedPermissions.4.via.0.address:
-        "ethereum:0x89889B569c3a505f3640ee1Bd0ac1D557f436D2a"
+        "eth:0x89889B569c3a505f3640ee1Bd0ac1D557f436D2a"
      receivedPermissions.4.from:
-        "ethereum:0x512A3d2c7a43BD9261d2B8E8C9c70D4bd4D503C0"
+        "eth:0x512A3d2c7a43BD9261d2B8E8C9c70D4bd4D503C0"
      receivedPermissions.5.via.0.address:
-        "ethereum:0x89889B569c3a505f3640ee1Bd0ac1D557f436D2a"
+        "eth:0x89889B569c3a505f3640ee1Bd0ac1D557f436D2a"
      receivedPermissions.5.from:
-        "ethereum:0x5933e323bE8896DfaCd1cD671442F27dAA10a053"
+        "eth:0x5933e323bE8896DfaCd1cD671442F27dAA10a053"
      receivedPermissions.6.via.0.address:
-        "ethereum:0x89889B569c3a505f3640ee1Bd0ac1D557f436D2a"
+        "eth:0x89889B569c3a505f3640ee1Bd0ac1D557f436D2a"
      receivedPermissions.6.from:
-        "ethereum:0x7A8Ed66B319911A0F3E7288BDdAB30d9c0C875c3"
+        "eth:0x7A8Ed66B319911A0F3E7288BDdAB30d9c0C875c3"
      receivedPermissions.7.via.0.address:
-        "ethereum:0x89889B569c3a505f3640ee1Bd0ac1D557f436D2a"
+        "eth:0x89889B569c3a505f3640ee1Bd0ac1D557f436D2a"
      receivedPermissions.7.from:
-        "ethereum:0x88e529A6ccd302c948689Cd5156C83D4614FAE92"
+        "eth:0x88e529A6ccd302c948689Cd5156C83D4614FAE92"
      receivedPermissions.8.via.0.address:
-        "ethereum:0x543bA4AADBAb8f9025686Bd03993043599c6fB04"
+        "eth:0x543bA4AADBAb8f9025686Bd03993043599c6fB04"
      receivedPermissions.8.from:
-        "ethereum:0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
+        "eth:0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
      receivedPermissions.9.via.0.address:
-        "ethereum:0x89889B569c3a505f3640ee1Bd0ac1D557f436D2a"
+        "eth:0x89889B569c3a505f3640ee1Bd0ac1D557f436D2a"
      receivedPermissions.9.from:
-        "ethereum:0x9AEA1FD851b63d57Ba4Fc556B0e0c170126C9EAf"
+        "eth:0x9AEA1FD851b63d57Ba4Fc556B0e0c170126C9EAf"
      receivedPermissions.10.via.0.address:
-        "ethereum:0x89889B569c3a505f3640ee1Bd0ac1D557f436D2a"
+        "eth:0x89889B569c3a505f3640ee1Bd0ac1D557f436D2a"
      receivedPermissions.10.from:
-        "ethereum:0x9CF951E3F74B644e621b36Ca9cea147a78D4c39f"
+        "eth:0x9CF951E3F74B644e621b36Ca9cea147a78D4c39f"
      receivedPermissions.11.via.0.address:
-        "ethereum:0x89889B569c3a505f3640ee1Bd0ac1D557f436D2a"
+        "eth:0x89889B569c3a505f3640ee1Bd0ac1D557f436D2a"
      receivedPermissions.11.from:
-        "ethereum:0xc1047e30EFC9E172cFe7aa0219895B6a43fC415F"
+        "eth:0xc1047e30EFC9E172cFe7aa0219895B6a43fC415F"
      receivedPermissions.12.via.0.address:
-        "ethereum:0x89889B569c3a505f3640ee1Bd0ac1D557f436D2a"
+        "eth:0x89889B569c3a505f3640ee1Bd0ac1D557f436D2a"
      receivedPermissions.12.from:
-        "ethereum:0xeb9bf100225c214Efc3E7C651ebbaDcF85177607"
+        "eth:0xeb9bf100225c214Efc3E7C651ebbaDcF85177607"
      directlyReceivedPermissions.0.from:
-        "ethereum:0x543bA4AADBAb8f9025686Bd03993043599c6fB04"
+        "eth:0x543bA4AADBAb8f9025686Bd03993043599c6fB04"
      directlyReceivedPermissions.1.from:
-        "ethereum:0x89889B569c3a505f3640ee1Bd0ac1D557f436D2a"
+        "eth:0x89889B569c3a505f3640ee1Bd0ac1D557f436D2a"
    }
```

```diff
    EOA  (0x6776BE80dBAda6A02B5F2095cF13734ac303B8d1) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0x7A8Ed66B319911A0F3E7288BDdAB30d9c0C875c3"
+        "eth:0x7A8Ed66B319911A0F3E7288BDdAB30d9c0C875c3"
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
      directlyReceivedPermissions.0.from:
-        "ethereum:0x0454092516c9A4d636d3CAfA1e82161376C8a748"
+        "eth:0x0454092516c9A4d636d3CAfA1e82161376C8a748"
    }
```

```diff
    contract ProxyAdmin (0x89889B569c3a505f3640ee1Bd0ac1D557f436D2a) {
    +++ description: None
      directlyReceivedPermissions.0.from:
-        "ethereum:0xB24bFEeCE1B3b7A44559F4Cbc21BeD312b130b70"
+        "eth:0xB24bFEeCE1B3b7A44559F4Cbc21BeD312b130b70"
      directlyReceivedPermissions.1.from:
-        "ethereum:0x190B6ecEE5A2ddF39669288B9B8daEa4641ae8b1"
+        "eth:0x190B6ecEE5A2ddF39669288B9B8daEa4641ae8b1"
      directlyReceivedPermissions.2.from:
-        "ethereum:0x512A3d2c7a43BD9261d2B8E8C9c70D4bd4D503C0"
+        "eth:0x512A3d2c7a43BD9261d2B8E8C9c70D4bd4D503C0"
      directlyReceivedPermissions.3.from:
-        "ethereum:0x5933e323bE8896DfaCd1cD671442F27dAA10a053"
+        "eth:0x5933e323bE8896DfaCd1cD671442F27dAA10a053"
      directlyReceivedPermissions.4.from:
-        "ethereum:0x7A8Ed66B319911A0F3E7288BDdAB30d9c0C875c3"
+        "eth:0x7A8Ed66B319911A0F3E7288BDdAB30d9c0C875c3"
      directlyReceivedPermissions.5.from:
-        "ethereum:0x88e529A6ccd302c948689Cd5156C83D4614FAE92"
+        "eth:0x88e529A6ccd302c948689Cd5156C83D4614FAE92"
      directlyReceivedPermissions.6.from:
-        "ethereum:0x9AEA1FD851b63d57Ba4Fc556B0e0c170126C9EAf"
+        "eth:0x9AEA1FD851b63d57Ba4Fc556B0e0c170126C9EAf"
      directlyReceivedPermissions.7.from:
-        "ethereum:0x9CF951E3F74B644e621b36Ca9cea147a78D4c39f"
+        "eth:0x9CF951E3F74B644e621b36Ca9cea147a78D4c39f"
      directlyReceivedPermissions.8.from:
-        "ethereum:0xc1047e30EFC9E172cFe7aa0219895B6a43fC415F"
+        "eth:0xc1047e30EFC9E172cFe7aa0219895B6a43fC415F"
      directlyReceivedPermissions.9.from:
-        "ethereum:0xeb9bf100225c214Efc3E7C651ebbaDcF85177607"
+        "eth:0xeb9bf100225c214Efc3E7C651ebbaDcF85177607"
    }
```

```diff
    contract OpFoundationOperationsSafe (0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0x3D56d47b9E7E34A46612BadC70377F74051E6b17"
+        "eth:0x3D56d47b9E7E34A46612BadC70377F74051E6b17"
      receivedPermissions.1.via.1.address:
-        "ethereum:0xc6901F65369FC59fC1B4D6D6bE7A2318Ff38dB5B"
+        "eth:0xc6901F65369FC59fC1B4D6D6bE7A2318Ff38dB5B"
      receivedPermissions.1.via.0.address:
-        "ethereum:0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2"
+        "eth:0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2"
      receivedPermissions.1.from:
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

Generated with discovered.json: 0x3058a4ab8e4c5aa8ef92262c6eef31c9b569e287

# Diff at Mon, 16 Jun 2025 10:14:39 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@e1208475abce20cea1768d2e4878c03350c1b7c9 block: 22437746
- current block number: 22437746

## Description

Config: add permissioned opfp role tags.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22437746 (main branch discovery), not current.

```diff
    EOA Optimism EOA 1 (0x352f1defB49718e7Ea411687E850aA8d6299F7aC) {
    +++ description: None
      receivedPermissions.1:
+        {"permission":"challenge","from":"ethereum:0x3D56d47b9E7E34A46612BadC70377F74051E6b17","role":".challenger","via":[{"address":"ethereum:0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A"},{"address":"ethereum:0x126a736B18E0a64fBA19D421647A530E327E112C","condition":"though restricted to the global pause function"}]}
    }
```

```diff
    EOA  (0x400c164C4a8cA84385B70EEd6eB03ea847c8E1b8) {
    +++ description: None
      receivedPermissions:
+        [{"permission":"propose","from":"ethereum:0x3D56d47b9E7E34A46612BadC70377F74051E6b17","role":".proposer"}]
    }
```

```diff
    contract SuperchainProxyAdminOwner (0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A) {
    +++ description: None
      receivedPermissions.12:
+        {"permission":"upgrade","from":"ethereum:0x88e529A6ccd302c948689Cd5156C83D4614FAE92","role":"admin","via":[{"address":"ethereum:0x89889B569c3a505f3640ee1Bd0ac1D557f436D2a"}]}
      receivedPermissions.11.from:
-        "ethereum:0x88e529A6ccd302c948689Cd5156C83D4614FAE92"
+        "ethereum:0x9AEA1FD851b63d57Ba4Fc556B0e0c170126C9EAf"
      receivedPermissions.10.from:
-        "ethereum:0x9AEA1FD851b63d57Ba4Fc556B0e0c170126C9EAf"
+        "ethereum:0x5933e323bE8896DfaCd1cD671442F27dAA10a053"
      receivedPermissions.9.from:
-        "ethereum:0x5933e323bE8896DfaCd1cD671442F27dAA10a053"
+        "ethereum:0x7A8Ed66B319911A0F3E7288BDdAB30d9c0C875c3"
      receivedPermissions.8.from:
-        "ethereum:0x7A8Ed66B319911A0F3E7288BDdAB30d9c0C875c3"
+        "ethereum:0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
      receivedPermissions.8.via.0.address:
-        "ethereum:0x89889B569c3a505f3640ee1Bd0ac1D557f436D2a"
+        "ethereum:0x543bA4AADBAb8f9025686Bd03993043599c6fB04"
      receivedPermissions.7.from:
-        "ethereum:0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
+        "ethereum:0x190B6ecEE5A2ddF39669288B9B8daEa4641ae8b1"
      receivedPermissions.7.via.0.address:
-        "ethereum:0x543bA4AADBAb8f9025686Bd03993043599c6fB04"
+        "ethereum:0x89889B569c3a505f3640ee1Bd0ac1D557f436D2a"
      receivedPermissions.6.from:
-        "ethereum:0x190B6ecEE5A2ddF39669288B9B8daEa4641ae8b1"
+        "ethereum:0xc1047e30EFC9E172cFe7aa0219895B6a43fC415F"
      receivedPermissions.5.from:
-        "ethereum:0xc1047e30EFC9E172cFe7aa0219895B6a43fC415F"
+        "ethereum:0x512A3d2c7a43BD9261d2B8E8C9c70D4bd4D503C0"
      receivedPermissions.4.from:
-        "ethereum:0x512A3d2c7a43BD9261d2B8E8C9c70D4bd4D503C0"
+        "ethereum:0x9CF951E3F74B644e621b36Ca9cea147a78D4c39f"
    }
```

```diff
    contract ProxyAdmin (0x89889B569c3a505f3640ee1Bd0ac1D557f436D2a) {
    +++ description: None
      directlyReceivedPermissions.9:
+        {"permission":"upgrade","from":"ethereum:0x88e529A6ccd302c948689Cd5156C83D4614FAE92","role":"admin"}
      directlyReceivedPermissions.8.from:
-        "ethereum:0x88e529A6ccd302c948689Cd5156C83D4614FAE92"
+        "ethereum:0x9AEA1FD851b63d57Ba4Fc556B0e0c170126C9EAf"
      directlyReceivedPermissions.7.from:
-        "ethereum:0x9AEA1FD851b63d57Ba4Fc556B0e0c170126C9EAf"
+        "ethereum:0x5933e323bE8896DfaCd1cD671442F27dAA10a053"
      directlyReceivedPermissions.6.from:
-        "ethereum:0x5933e323bE8896DfaCd1cD671442F27dAA10a053"
+        "ethereum:0x7A8Ed66B319911A0F3E7288BDdAB30d9c0C875c3"
      directlyReceivedPermissions.5.from:
-        "ethereum:0x7A8Ed66B319911A0F3E7288BDdAB30d9c0C875c3"
+        "ethereum:0x190B6ecEE5A2ddF39669288B9B8daEa4641ae8b1"
      directlyReceivedPermissions.4.from:
-        "ethereum:0x190B6ecEE5A2ddF39669288B9B8daEa4641ae8b1"
+        "ethereum:0xc1047e30EFC9E172cFe7aa0219895B6a43fC415F"
      directlyReceivedPermissions.3.from:
-        "ethereum:0xc1047e30EFC9E172cFe7aa0219895B6a43fC415F"
+        "ethereum:0x512A3d2c7a43BD9261d2B8E8C9c70D4bd4D503C0"
      directlyReceivedPermissions.2.from:
-        "ethereum:0x512A3d2c7a43BD9261d2B8E8C9c70D4bd4D503C0"
+        "ethereum:0x9CF951E3F74B644e621b36Ca9cea147a78D4c39f"
    }
```

```diff
    contract OpFoundationOperationsSafe (0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A) {
    +++ description: None
      receivedPermissions.1:
+        {"permission":"guard","from":"ethereum:0x95703e0982140D16f8ebA6d158FccEde42f04a4C","role":".guardian","via":[{"address":"ethereum:0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2"},{"address":"ethereum:0xc6901F65369FC59fC1B4D6D6bE7A2318Ff38dB5B","condition":"if not revoked by the Security Council"}]}
      receivedPermissions.0.permission:
-        "guard"
+        "challenge"
      receivedPermissions.0.from:
-        "ethereum:0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
+        "ethereum:0x3D56d47b9E7E34A46612BadC70377F74051E6b17"
      receivedPermissions.0.role:
-        ".guardian"
+        ".challenger"
      receivedPermissions.0.via:
-        [{"address":"ethereum:0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2"},{"address":"ethereum:0xc6901F65369FC59fC1B4D6D6bE7A2318Ff38dB5B","condition":"if not revoked by the Security Council"}]
    }
```

```diff
    contract L1CrossDomainMessenger (0x9CF951E3F74B644e621b36Ca9cea147a78D4c39f) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      values.$admin:
+        "0x89889B569c3a505f3640ee1Bd0ac1D557f436D2a"
    }
```

Generated with discovered.json: 0xe73aec3dce1cd96cf66ae538bb5f179db31500f2

# Diff at Fri, 30 May 2025 07:16:01 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@a4d8c436027d17df0f9b76843cd6deb1888fa381 block: 22437746
- current block number: 22437746

## Description

config: change comment about eip1559 fee val

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22437746 (main branch discovery), not current.

```diff
    contract SystemConfig (0x7A8Ed66B319911A0F3E7288BDdAB30d9c0C875c3) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      fieldMeta.eip1559Denominator:
+        {"description":"volatility param: lower denominator -> quicker fee changes on L2"}
    }
```

Generated with discovered.json: 0x4900de56437c372c14779396cfa50de9db699d6f

# Diff at Fri, 23 May 2025 09:41:05 GMT:

- chain: ethereum
- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@69cd181abbc3c830a6caf2f4429b37cae72ffdb8 block: 22437746
- current block number: 22437746

## Description

Introduced .role field on each permission, defaulting to field name on which it was defined (with '.' prefix)

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22437746 (main branch discovery), not current.

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
    +++ description: None
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
    contract Soneium Multisig (0x509182eC226b3B71D36A3255A80EF0b1A9D43033) {
    +++ description: None
      receivedPermissions.0.role:
+        ".owner"
    }
```

```diff
    contract SuperchainProxyAdmin (0x543bA4AADBAb8f9025686Bd03993043599c6fB04) {
    +++ description: None
      directlyReceivedPermissions.1.permission:
-        "interact"
+        "upgrade"
      directlyReceivedPermissions.1.from:
-        "0xdE1FCfB0851916CA5101820A69b13a4E276bd81F"
+        "0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
      directlyReceivedPermissions.1.description:
-        "set and change address mappings."
      directlyReceivedPermissions.1.role:
+        "admin"
      directlyReceivedPermissions.0.permission:
-        "upgrade"
+        "interact"
      directlyReceivedPermissions.0.from:
-        "0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
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
      receivedPermissions.11.role:
+        "admin"
      receivedPermissions.10.permission:
-        "interact"
+        "upgrade"
      receivedPermissions.10.from:
-        "0x9AEA1FD851b63d57Ba4Fc556B0e0c170126C9EAf"
+        "0x7A8Ed66B319911A0F3E7288BDdAB30d9c0C875c3"
      receivedPermissions.10.description:
-        "can pull funds from the contract in case of emergency."
      receivedPermissions.10.role:
+        "admin"
      receivedPermissions.10.via:
+        [{"address":"0x89889B569c3a505f3640ee1Bd0ac1D557f436D2a"}]
      receivedPermissions.9.from:
-        "0x7A8Ed66B319911A0F3E7288BDdAB30d9c0C875c3"
+        "0x88e529A6ccd302c948689Cd5156C83D4614FAE92"
      receivedPermissions.9.role:
+        "admin"
      receivedPermissions.8.from:
-        "0x88e529A6ccd302c948689Cd5156C83D4614FAE92"
+        "0x512A3d2c7a43BD9261d2B8E8C9c70D4bd4D503C0"
      receivedPermissions.8.role:
+        "admin"
      receivedPermissions.7.from:
-        "0x512A3d2c7a43BD9261d2B8E8C9c70D4bd4D503C0"
+        "0x190B6ecEE5A2ddF39669288B9B8daEa4641ae8b1"
      receivedPermissions.7.role:
+        "admin"
      receivedPermissions.6.permission:
-        "interact"
+        "upgrade"
      receivedPermissions.6.from:
-        "0xdE1FCfB0851916CA5101820A69b13a4E276bd81F"
+        "0x5933e323bE8896DfaCd1cD671442F27dAA10a053"
      receivedPermissions.6.description:
-        "set and change address mappings."
      receivedPermissions.6.via.0.address:
-        "0x543bA4AADBAb8f9025686Bd03993043599c6fB04"
+        "0x89889B569c3a505f3640ee1Bd0ac1D557f436D2a"
      receivedPermissions.6.role:
+        "admin"
      receivedPermissions.5.from:
-        "0x190B6ecEE5A2ddF39669288B9B8daEa4641ae8b1"
+        "0xc1047e30EFC9E172cFe7aa0219895B6a43fC415F"
      receivedPermissions.5.role:
+        "admin"
      receivedPermissions.4.from:
-        "0x5933e323bE8896DfaCd1cD671442F27dAA10a053"
+        "0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
      receivedPermissions.4.via.0.address:
-        "0x89889B569c3a505f3640ee1Bd0ac1D557f436D2a"
+        "0x543bA4AADBAb8f9025686Bd03993043599c6fB04"
      receivedPermissions.4.role:
+        "admin"
      receivedPermissions.3.permission:
-        "upgrade"
+        "interact"
      receivedPermissions.3.from:
-        "0xc1047e30EFC9E172cFe7aa0219895B6a43fC415F"
+        "0x9AEA1FD851b63d57Ba4Fc556B0e0c170126C9EAf"
      receivedPermissions.3.via:
-        [{"address":"0x89889B569c3a505f3640ee1Bd0ac1D557f436D2a"}]
      receivedPermissions.3.description:
+        "can pull funds from the contract in case of emergency."
      receivedPermissions.3.role:
+        ".owner"
      receivedPermissions.2.permission:
-        "upgrade"
+        "interact"
      receivedPermissions.2.from:
-        "0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
+        "0xdE1FCfB0851916CA5101820A69b13a4E276bd81F"
      receivedPermissions.2.description:
+        "set and change address mappings."
      receivedPermissions.2.role:
+        ".owner"
      receivedPermissions.1.role:
+        ".$admin"
      receivedPermissions.0.role:
+        ".owner"
      directlyReceivedPermissions.1.role:
+        ".owner"
      directlyReceivedPermissions.0.role:
+        ".owner"
    }
```

```diff
    EOA  (0x6776BE80dBAda6A02B5F2095cF13734ac303B8d1) {
    +++ description: None
      receivedPermissions.0.role:
+        ".batcherHash"
    }
```

```diff
    contract OpFoundationUpgradeSafe (0x847B5c174615B1B7fDF770882256e2D3E95b9D92) {
    +++ description: None
      receivedPermissions.0.role:
+        ".guardian"
      directlyReceivedPermissions.0.role:
+        ".fallbackOwner"
    }
```

```diff
    contract ProxyAdmin (0x89889B569c3a505f3640ee1Bd0ac1D557f436D2a) {
    +++ description: None
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
+        ".$admin"
      directlyReceivedPermissions.0.role:
+        ".owner"
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

Generated with discovered.json: 0xfba1f4082c76bc77112d628eb936323d17a110bf

# Diff at Fri, 09 May 2025 10:09:21 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@c3a1d49c07f4092914d62c65181e5fec18a88318 block: 22437746
- current block number: 22437746

## Description

Config related: Move IFs to the editable string for condition configs (yeet IFs from the automatic resolver).

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22437746 (main branch discovery), not current.

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
      receivedPermissions.0.via.0.condition:
-        "the number of 0xc2819DC788505Aac350142A7A707BF9D03E3Bd03 members falls below 8."
+        "if the number of 0xc2819DC788505Aac350142A7A707BF9D03E3Bd03 members falls below 8."
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

Generated with discovered.json: 0x83a67f03de4ef56cc46b570db951377528070aba

# Diff at Thu, 08 May 2025 08:50:59 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@8e1926142ab0c57cc131de4d8da307e13d9af54d block: 22346273
- current block number: 22437746

## Description

OP stack DeputyPauser upgrade (see op mainnet for more info).

## Watched changes

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
+   Status: CREATED
    contract DeputyPauseModule (0x126a736B18E0a64fBA19D421647A530E327E112C)
    +++ description: Allows 0x352f1defB49718e7Ea411687E850aA8d6299F7aC, called the deputy pauser, to act on behalf of the 0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A if set as its Safe module.
```

## Source code changes

```diff
.../soneium/ethereum/.flat/DeputyPauseModule.sol   | 1338 ++++++++++++++++++++
 1 file changed, 1338 insertions(+)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22346273 (main branch discovery), not current.

```diff
    contract PermissionedDisputeGame (0x3D56d47b9E7E34A46612BadC70377F74051E6b17) {
    +++ description: Same as FaultDisputeGame, but only two permissioned addresses are designated as proposer and challenger.
      usedTypes.0.arg.0x03682932cec7ce0a3874b19675a6bbc923054a7b321efc7d3835187b172494b6:
+        "v1.6.0 (cannon64)"
    }
```

Generated with discovered.json: 0x366ee0ffdf9fc9e7159fe282bf6425cfd7196e7d

# Diff at Tue, 29 Apr 2025 08:19:12 GMT:

- chain: ethereum
- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@ef7477af00fe0b57a2f7cacf7e958c12494af662 block: 22346273
- current block number: 22346273

## Description

Field .issuedPermissions is removed from the output as no longer needed. Added 'permissionsConfigHash' due to refactoring of the modelling process (into a separate command).

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22346273 (main branch discovery), not current.

```diff
    contract LivenessModule (0x0454092516c9A4d636d3CAfA1e82161376C8a748) {
    +++ description: used to remove members inactive for 98d while making sure that the threshold remains above 75%. If the number of members falls below 8, the 0x847B5c174615B1B7fDF770882256e2D3E95b9D92 takes ownership of the multisig
      issuedPermissions:
-        [{"permission":"interact","to":"0x24424336F04440b1c28685a38303aC33C9D14a25","description":"can remove members of 0xc2819DC788505Aac350142A7A707BF9D03E3Bd03 inactive for 98d.","via":[]}]
    }
```

```diff
    contract AnchorStateRegistry (0x190B6ecEE5A2ddF39669288B9B8daEa4641ae8b1) {
    +++ description: Contains the latest confirmed state root that can be used as a starting point in a dispute game.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A","via":[{"address":"0x89889B569c3a505f3640ee1Bd0ac1D557f436D2a"}]}]
    }
```

```diff
    contract DisputeGameFactory (0x512A3d2c7a43BD9261d2B8E8C9c70D4bd4D503C0) {
    +++ description: The dispute game factory allows the creation of dispute games, used to propose state roots and eventually challenge them.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A","via":[{"address":"0x89889B569c3a505f3640ee1Bd0ac1D557f436D2a"}]}]
    }
```

```diff
    contract L1ERC721Bridge (0x5933e323bE8896DfaCd1cD671442F27dAA10a053) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A","via":[{"address":"0x89889B569c3a505f3640ee1Bd0ac1D557f436D2a"}]}]
    }
```

```diff
    contract SystemConfig (0x7A8Ed66B319911A0F3E7288BDdAB30d9c0C875c3) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      issuedPermissions:
-        [{"permission":"interact","to":"0x509182eC226b3B71D36A3255A80EF0b1A9D43033","description":"it can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system.","via":[]},{"permission":"sequence","to":"0x6776BE80dBAda6A02B5F2095cF13734ac303B8d1","via":[]},{"permission":"upgrade","to":"0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A","via":[{"address":"0x89889B569c3a505f3640ee1Bd0ac1D557f436D2a"}]}]
    }
```

```diff
    contract OptimismPortal2 (0x88e529A6ccd302c948689Cd5156C83D4614FAE92) {
    +++ description: The OptimismPortal contract is the main entry point to deposit funds from L1 to L2. It also allows to prove and finalize withdrawals. It specifies which game type can be used for withdrawals, which currently is the PermissionedDisputeGame.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A","via":[{"address":"0x89889B569c3a505f3640ee1Bd0ac1D557f436D2a"}]}]
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
    contract DelayedWETH (0x9AEA1FD851b63d57Ba4Fc556B0e0c170126C9EAf) {
    +++ description: Contract designed to hold the bonded ETH for each game. It is designed as a wrapper around WETH to allow an owner to function as a backstop if a game would incorrectly distribute funds.
      issuedPermissions:
-        [{"permission":"interact","to":"0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A","description":"can pull funds from the contract in case of emergency.","via":[]},{"permission":"upgrade","to":"0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A","via":[{"address":"0x89889B569c3a505f3640ee1Bd0ac1D557f436D2a"}]}]
    }
```

```diff
    contract AddressManager (0xB24bFEeCE1B3b7A44559F4Cbc21BeD312b130b70) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      issuedPermissions:
-        [{"permission":"interact","to":"0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A","description":"set and change address mappings.","via":[{"address":"0x89889B569c3a505f3640ee1Bd0ac1D557f436D2a"}]}]
    }
```

```diff
    contract OptimismMintableERC20Factory (0xc1047e30EFC9E172cFe7aa0219895B6a43fC415F) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A","via":[{"address":"0x89889B569c3a505f3640ee1Bd0ac1D557f436D2a"}]}]
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
    contract L1StandardBridge (0xeb9bf100225c214Efc3E7C651ebbaDcF85177607) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A","description":"upgrading the bridge implementation can give access to all funds escrowed therein.","via":[{"address":"0x89889B569c3a505f3640ee1Bd0ac1D557f436D2a"}]}]
    }
```

Generated with discovered.json: 0xead1723a123ece3a04daf8dca4c4530d7cddbb08

# Diff at Fri, 25 Apr 2025 13:16:01 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@652ccb636c46013db1624f1ac3562cb4dcbc059b block: 22208586
- current block number: 22346273

## Description

[Isthmus upgrade](https://vote.optimism.io/proposals/8705916809146420472067303211131851783087744913535435360574720946039078686841):
- upgraded proof system VM: MIPS (MT-Cannon MIPS64)
- operator fee (fee mechanism to improve fee config for zk proven and alt-DA systems)
- pectra readiness

## Watched changes

```diff
-   Status: DELETED
    contract PermissionedDisputeGame (0x1661af719956198628F7e67087F19f8A79524a1d)
    +++ description: Same as FaultDisputeGame, but only two permissioned addresses are designated as proposer and challenger.
```

```diff
    contract DisputeGameFactory (0x512A3d2c7a43BD9261d2B8E8C9c70D4bd4D503C0) {
    +++ description: The dispute game factory allows the creation of dispute games, used to propose state roots and eventually challenge them.
      values.gameImpls.4:
-        "0x1661af719956198628F7e67087F19f8A79524a1d"
+        "0x3D56d47b9E7E34A46612BadC70377F74051E6b17"
    }
```

```diff
    contract L1ERC721Bridge (0x5933e323bE8896DfaCd1cD671442F27dAA10a053) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      sourceHashes.1:
-        "0x9de28f19e0d1200bf0afda5ab90c9d2dffa44a775e71cfe9232ee1808338996c"
+        "0x28669b49da3effd51f0f9424ca9cdd455c5b9327c09a40c65fc06f114a6eb837"
      values.$implementation:
-        "0x276d3730f219f7ec22274f7263180b8452B46d47"
+        "0x7aE1d3BD877a4C5CA257404ce26BE93A02C98013"
      values.$pastUpgrades.2:
+        ["2025-04-02T16:50:23.000Z","0x5f3530e593bbac37c61dc5b7755b6a40c06c20c1a3a1b13fca5b7d00cde65c29",["0x276d3730f219f7ec22274f7263180b8452B46d47"]]
      values.$pastUpgrades.1.2:
-        "0x5f3530e593bbac37c61dc5b7755b6a40c06c20c1a3a1b13fca5b7d00cde65c29"
+        ["0xAE2AF01232a6c4a4d3012C5eC5b1b35059caF10d"]
      values.$pastUpgrades.1.1:
-        "2025-04-02T16:50:23.000Z"
+        "0x521e36f9009b6c2545f054baf46587c17738e71b354712e0b534c5a53192fceb"
      values.$pastUpgrades.1.0:
-        ["0x276d3730f219f7ec22274f7263180b8452B46d47"]
+        "2024-12-02T10:19:11.000Z"
      values.$pastUpgrades.0.2.0:
-        "0xAE2AF01232a6c4a4d3012C5eC5b1b35059caF10d"
+        "0x7aE1d3BD877a4C5CA257404ce26BE93A02C98013"
      values.$pastUpgrades.0.1:
-        "0x521e36f9009b6c2545f054baf46587c17738e71b354712e0b534c5a53192fceb"
+        "2025-04-24T16:16:23.000Z"
      values.$pastUpgrades.0.0:
-        "2024-12-02T10:19:11.000Z"
+        "0xbe44244e352a9ffa67ad7f7133e9ed014b380e4b1bd789419e6d33aaad780d12"
      values.$upgradeCount:
-        2
+        3
      values.version:
-        "2.3.1"
+        "2.4.0"
    }
```

```diff
    contract SystemConfig (0x7A8Ed66B319911A0F3E7288BDdAB30d9c0C875c3) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      sourceHashes.1:
-        "0x6e293d82eb36a83fb5d8b06268cd4fbf46027b87eea77fcc68f78e4b010a3774"
+        "0x921de6fc906d159fdcef862d2b9559063f5e7b9b7588fa5f33153360ddf296e7"
      values.$implementation:
-        "0x760C48C62A85045A6B69f07F4a9f22868659CbCc"
+        "0x340f923E5c7cbB2171146f64169EC9d5a9FfE647"
      values.$pastUpgrades.5:
+        ["2025-02-28T14:55:35.000Z","0x9c6af2cb2b4fcde9e351662342f15b60f004108b575dddd05d0caa4f50220966",["0xAB9d6cB7A427c0765163A7f45BB91cAfe5f2D375"]]
      values.$pastUpgrades.4.2:
-        "0x9c6af2cb2b4fcde9e351662342f15b60f004108b575dddd05d0caa4f50220966"
+        "0x5f3530e593bbac37c61dc5b7755b6a40c06c20c1a3a1b13fca5b7d00cde65c29"
      values.$pastUpgrades.4.1:
-        ["0xAB9d6cB7A427c0765163A7f45BB91cAfe5f2D375"]
+        "2025-04-02T16:50:23.000Z"
      values.$pastUpgrades.4.0:
-        "2025-02-28T14:55:35.000Z"
+        ["0x760C48C62A85045A6B69f07F4a9f22868659CbCc"]
      values.$pastUpgrades.3.2:
-        "0x5f3530e593bbac37c61dc5b7755b6a40c06c20c1a3a1b13fca5b7d00cde65c29"
+        "0x9c6af2cb2b4fcde9e351662342f15b60f004108b575dddd05d0caa4f50220966"
      values.$pastUpgrades.3.1:
-        "2025-04-02T16:50:23.000Z"
+        "2025-02-28T14:55:35.000Z"
      values.$pastUpgrades.3.0.0:
-        "0x760C48C62A85045A6B69f07F4a9f22868659CbCc"
+        "0xd81f43eDBCAcb4c29a9bA38a13Ee5d79278270cC"
      values.$pastUpgrades.2.2:
-        "0x9c6af2cb2b4fcde9e351662342f15b60f004108b575dddd05d0caa4f50220966"
+        ["0xF56D96B2535B932656d3c04Ebf51baBff241D886"]
      values.$pastUpgrades.2.1:
-        "2025-02-28T14:55:35.000Z"
+        "0x521e36f9009b6c2545f054baf46587c17738e71b354712e0b534c5a53192fceb"
      values.$pastUpgrades.2.0:
-        ["0xd81f43eDBCAcb4c29a9bA38a13Ee5d79278270cC"]
+        "2024-12-02T10:19:11.000Z"
      values.$pastUpgrades.0.2:
-        ["0xF56D96B2535B932656d3c04Ebf51baBff241D886"]
+        "2025-04-24T16:16:23.000Z"
      values.$pastUpgrades.0.1:
-        "0x521e36f9009b6c2545f054baf46587c17738e71b354712e0b534c5a53192fceb"
+        "0xbe44244e352a9ffa67ad7f7133e9ed014b380e4b1bd789419e6d33aaad780d12"
      values.$pastUpgrades.0.0:
-        "2024-12-02T10:19:11.000Z"
+        ["0x340f923E5c7cbB2171146f64169EC9d5a9FfE647"]
      values.$upgradeCount:
-        5
+        6
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
    contract OptimismPortal2 (0x88e529A6ccd302c948689Cd5156C83D4614FAE92) {
    +++ description: The OptimismPortal contract is the main entry point to deposit funds from L1 to L2. It also allows to prove and finalize withdrawals. It specifies which game type can be used for withdrawals, which currently is the PermissionedDisputeGame.
      sourceHashes.1:
-        "0x67ee16b5b6c32cdcc862bea390e45017908e6945cfaa01d3ef75dc9de7c9d946"
+        "0xc483ef9e0a5ec2a0450732e743b3784de0cd3876b8fadfce14c0805a0846d26b"
      values.$implementation:
-        "0x2D7e764a0D9919e16983a46595CfA81fc34fa7Cd"
+        "0xB443Da3e07052204A02d630a8933dAc05a0d6fB4"
      values.$pastUpgrades.2:
+        ["2024-12-02T10:19:11.000Z","0x521e36f9009b6c2545f054baf46587c17738e71b354712e0b534c5a53192fceb",["0xe2F826324b2faf99E513D16D266c3F80aE87832B"]]
      values.$pastUpgrades.1.2:
-        ["0xe2F826324b2faf99E513D16D266c3F80aE87832B"]
+        "0x5f3530e593bbac37c61dc5b7755b6a40c06c20c1a3a1b13fca5b7d00cde65c29"
      values.$pastUpgrades.1.1:
-        "0x521e36f9009b6c2545f054baf46587c17738e71b354712e0b534c5a53192fceb"
+        "2025-04-02T16:50:23.000Z"
      values.$pastUpgrades.1.0:
-        "2024-12-02T10:19:11.000Z"
+        ["0x2D7e764a0D9919e16983a46595CfA81fc34fa7Cd"]
      values.$pastUpgrades.0.2:
-        "0x5f3530e593bbac37c61dc5b7755b6a40c06c20c1a3a1b13fca5b7d00cde65c29"
+        ["0xB443Da3e07052204A02d630a8933dAc05a0d6fB4"]
      values.$pastUpgrades.0.1:
-        "2025-04-02T16:50:23.000Z"
+        "2025-04-24T16:16:23.000Z"
      values.$pastUpgrades.0.0:
-        ["0x2D7e764a0D9919e16983a46595CfA81fc34fa7Cd"]
+        "0xbe44244e352a9ffa67ad7f7133e9ed014b380e4b1bd789419e6d33aaad780d12"
      values.$upgradeCount:
-        2
+        3
      values.version:
-        "3.13.0"
+        "3.14.0"
    }
```

```diff
    contract L1CrossDomainMessenger (0x9CF951E3F74B644e621b36Ca9cea147a78D4c39f) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      sourceHashes.1:
-        "0xfaa50769db48b1d2c04c06a8a0a4771b87b3c0ff20a508115bfdb2b576fdb454"
+        "0x03bcdc719cb7bd0a1377c01bb50b30a6122b308f673b7d7b15a3bb8628e6bd8c"
      values.$implementation:
-        "0x3eA6084748ED1b2A9B5D4426181F1ad8C93F6231"
+        "0x5D5a095665886119693F0B41d8DFeE78da033e8B"
      values.$pastUpgrades.2:
+        ["2025-04-02T16:50:23.000Z","0x5f3530e593bbac37c61dc5b7755b6a40c06c20c1a3a1b13fca5b7d00cde65c29",["0x3eA6084748ED1b2A9B5D4426181F1ad8C93F6231"]]
      values.$pastUpgrades.1.2:
-        "0x5f3530e593bbac37c61dc5b7755b6a40c06c20c1a3a1b13fca5b7d00cde65c29"
+        ["0x5D5a095665886119693F0B41d8DFeE78da033e8B"]
      values.$pastUpgrades.1.1:
-        ["0x3eA6084748ED1b2A9B5D4426181F1ad8C93F6231"]
+        "2025-04-24T16:16:23.000Z"
      values.$pastUpgrades.1.0:
-        "2025-04-02T16:50:23.000Z"
+        "0xbe44244e352a9ffa67ad7f7133e9ed014b380e4b1bd789419e6d33aaad780d12"
      values.$upgradeCount:
-        2
+        3
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
-   Status: DELETED
    contract MIPS (0xaA59A0777648BC75cd10364083e878c1cCd6112a)
    +++ description: The MIPS contract is used to execute the final step of the dispute game which objectively determines the winner of the dispute.
```

```diff
    contract L1StandardBridge (0xeb9bf100225c214Efc3E7C651ebbaDcF85177607) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      sourceHashes.1:
-        "0x4a2d83507f25be218f504b76815e4494138af88734cc54d34666c631aea88af5"
+        "0xbfb58685ff2f2f07eaa01a3c4e3c33c97686bfd3ae7c50c49f9da6ef5098cb31"
      sourceHashes.0:
-        "0xbfb58685ff2f2f07eaa01a3c4e3c33c97686bfd3ae7c50c49f9da6ef5098cb31"
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
+   Status: CREATED
    contract PermissionedDisputeGame (0x3D56d47b9E7E34A46612BadC70377F74051E6b17)
    +++ description: Same as FaultDisputeGame, but only two permissioned addresses are designated as proposer and challenger.
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
 .../ethereum/{.flat@22208586 => .flat}/MIPS.sol    | 1869 ++++++++++++++------
 .../OptimismPortal2/OptimismPortal2.sol            |   83 +-
 .../SystemConfig/SystemConfig.sol                  |   29 +-
 6 files changed, 1793 insertions(+), 580 deletions(-)
```

Generated with discovered.json: 0x780f9c86e012cb3d585f4db259395861a9138347

# Diff at Fri, 11 Apr 2025 13:16:34 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@b607477490db79d49274f7585039ac7263456118 block: 22208586
- current block number: 22208586

## Description

Config: global mapping updated for op stack prestates.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22208586 (main branch discovery), not current.

```diff
    contract PermissionedDisputeGame (0x1661af719956198628F7e67087F19f8A79524a1d) {
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

Generated with discovered.json: 0x60e7253bc3ccbe20f289a8fa5ab31ce9f066f508

# Diff at Thu, 10 Apr 2025 14:43:16 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@f38a3c9bf359344e4c4cd3006f58271cb8f78d15 block: 22208586
- current block number: 22208586

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22208586 (main branch discovery), not current.

```diff
    contract SuperchainProxyAdmin (0x543bA4AADBAb8f9025686Bd03993043599c6fB04) {
    +++ description: None
      displayName:
-        "ProxyAdmin"
    }
```

Generated with discovered.json: 0x66ef377cbf450f537dc789ea969ac77b2551224e

# Diff at Sun, 06 Apr 2025 08:10:27 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@02dea11f7707601873600e275c4e2b7792c1a190 block: 22194718
- current block number: 22208586

## Description

eip 1559 gas conf added.

## Watched changes

```diff
    contract SystemConfig (0x7A8Ed66B319911A0F3E7288BDdAB30d9c0C875c3) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      values.eip1559Denominator:
-        0
+        250
      values.eip1559Elasticity:
-        0
+        7
    }
```

Generated with discovered.json: 0x7ab6d9fe359cbff5c1c2c4b5e9b12dd8cbae7322

# Diff at Fri, 04 Apr 2025 09:40:12 GMT:

- chain: ethereum
- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@b3154c4385e52c9ffc0dab984c207390e5ccc13d block: 21995440
- current block number: 22194718

## Description

Discovery rerun on the same block number with only config-related changes.

## Watched changes

```diff
-   Status: DELETED
    contract MIPS (0x16e83cE5Ce29BF90AD9Da06D2fE6a15d5f344ce4)
    +++ description: The MIPS contract is used to execute the final step of the dispute game which objectively determines the winner of the dispute.
```

```diff
-   Status: DELETED
    contract PermissionedDisputeGame (0x42D15f045159Ce4adE9EDC7da5704eF36056c936)
    +++ description: Same as FaultDisputeGame, but only two permissioned addresses are designated as proposer and challenger.
```

```diff
    contract DisputeGameFactory (0x512A3d2c7a43BD9261d2B8E8C9c70D4bd4D503C0) {
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
-        "0x42D15f045159Ce4adE9EDC7da5704eF36056c936"
+        "0x1661af719956198628F7e67087F19f8A79524a1d"
      values.version:
-        "1.0.0"
+        "1.0.1"
    }
```

```diff
    contract L1ERC721Bridge (0x5933e323bE8896DfaCd1cD671442F27dAA10a053) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      sourceHashes.1:
-        "0x482ec6e91304ac39a3fb4505634427bddfddee23b8e93a4f7f995ca5083ae3c3"
+        "0x9de28f19e0d1200bf0afda5ab90c9d2dffa44a775e71cfe9232ee1808338996c"
      values.$implementation:
-        "0xAE2AF01232a6c4a4d3012C5eC5b1b35059caF10d"
+        "0x276d3730f219f7ec22274f7263180b8452B46d47"
      values.$pastUpgrades.1:
+        ["2025-04-02T16:50:23.000Z","0x5f3530e593bbac37c61dc5b7755b6a40c06c20c1a3a1b13fca5b7d00cde65c29",["0x276d3730f219f7ec22274f7263180b8452B46d47"]]
      values.$upgradeCount:
-        1
+        2
      values.version:
-        "2.1.0"
+        "2.3.1"
    }
```

```diff
    contract SuperchainProxyAdminOwner (0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A) {
    +++ description: None
      receivedPermissions.8.from:
-        "0x61f89A381E0BE13BD8Ab356cf4B7301BC97d7522"
+        "0x88e529A6ccd302c948689Cd5156C83D4614FAE92"
      receivedPermissions.7.from:
-        "0x88e529A6ccd302c948689Cd5156C83D4614FAE92"
+        "0x512A3d2c7a43BD9261d2B8E8C9c70D4bd4D503C0"
      receivedPermissions.6.permission:
-        "upgrade"
+        "interact"
      receivedPermissions.6.from:
-        "0x512A3d2c7a43BD9261d2B8E8C9c70D4bd4D503C0"
+        "0xdE1FCfB0851916CA5101820A69b13a4E276bd81F"
      receivedPermissions.6.via.0.address:
-        "0x89889B569c3a505f3640ee1Bd0ac1D557f436D2a"
+        "0x543bA4AADBAb8f9025686Bd03993043599c6fB04"
      receivedPermissions.6.description:
+        "set and change address mappings."
      receivedPermissions.5.permission:
-        "interact"
+        "upgrade"
      receivedPermissions.5.from:
-        "0xdE1FCfB0851916CA5101820A69b13a4E276bd81F"
+        "0x190B6ecEE5A2ddF39669288B9B8daEa4641ae8b1"
      receivedPermissions.5.description:
-        "set and change address mappings."
      receivedPermissions.5.via.0.address:
-        "0x543bA4AADBAb8f9025686Bd03993043599c6fB04"
+        "0x89889B569c3a505f3640ee1Bd0ac1D557f436D2a"
    }
```

```diff
-   Status: DELETED
    contract AnchorStateRegistry (0x61f89A381E0BE13BD8Ab356cf4B7301BC97d7522)
    +++ description: Contains the latest confirmed state root that can be used as a starting point in a dispute game.
```

```diff
    contract SystemConfig (0x7A8Ed66B319911A0F3E7288BDdAB30d9c0C875c3) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      sourceHashes.1:
-        "0xc7135dbd2a53312d36df3f3ee91ce0a5a459ab8fc7725880a3a9c55a5fa0ed6c"
+        "0x6e293d82eb36a83fb5d8b06268cd4fbf46027b87eea77fcc68f78e4b010a3774"
      values.$implementation:
-        "0xAB9d6cB7A427c0765163A7f45BB91cAfe5f2D375"
+        "0x760C48C62A85045A6B69f07F4a9f22868659CbCc"
      values.$pastUpgrades.4:
+        ["2025-02-28T14:55:35.000Z","0x9c6af2cb2b4fcde9e351662342f15b60f004108b575dddd05d0caa4f50220966",["0xAB9d6cB7A427c0765163A7f45BB91cAfe5f2D375"]]
      values.$pastUpgrades.3.2:
-        "0x9c6af2cb2b4fcde9e351662342f15b60f004108b575dddd05d0caa4f50220966"
+        "0x5f3530e593bbac37c61dc5b7755b6a40c06c20c1a3a1b13fca5b7d00cde65c29"
      values.$pastUpgrades.3.1:
-        ["0xAB9d6cB7A427c0765163A7f45BB91cAfe5f2D375"]
+        "2025-04-02T16:50:23.000Z"
      values.$pastUpgrades.3.0:
-        "2025-02-28T14:55:35.000Z"
+        ["0x760C48C62A85045A6B69f07F4a9f22868659CbCc"]
      values.$upgradeCount:
-        4
+        5
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
+        {"l1CrossDomainMessenger":"0x9CF951E3F74B644e621b36Ca9cea147a78D4c39f","l1ERC721Bridge":"0x5933e323bE8896DfaCd1cD671442F27dAA10a053","l1StandardBridge":"0xeb9bf100225c214Efc3E7C651ebbaDcF85177607","disputeGameFactory":"0x512A3d2c7a43BD9261d2B8E8C9c70D4bd4D503C0","optimismPortal":"0x88e529A6ccd302c948689Cd5156C83D4614FAE92","optimismMintableERC20Factory":"0xc1047e30EFC9E172cFe7aa0219895B6a43fC415F"}
    }
```

```diff
    contract OptimismPortal2 (0x88e529A6ccd302c948689Cd5156C83D4614FAE92) {
    +++ description: The OptimismPortal contract is the main entry point to deposit funds from L1 to L2. It also allows to prove and finalize withdrawals. It specifies which game type can be used for withdrawals, which currently is the PermissionedDisputeGame.
      sourceHashes.1:
-        "0x41be46bdb67af1b7af90e1bd70a1fcd31a3352282beb83b846a5189675c37ac1"
+        "0x67ee16b5b6c32cdcc862bea390e45017908e6945cfaa01d3ef75dc9de7c9d946"
      values.$implementation:
-        "0xe2F826324b2faf99E513D16D266c3F80aE87832B"
+        "0x2D7e764a0D9919e16983a46595CfA81fc34fa7Cd"
      values.$pastUpgrades.1:
+        ["2024-12-02T10:19:11.000Z","0x521e36f9009b6c2545f054baf46587c17738e71b354712e0b534c5a53192fceb",["0xe2F826324b2faf99E513D16D266c3F80aE87832B"]]
      values.$pastUpgrades.0.2:
-        ["0xe2F826324b2faf99E513D16D266c3F80aE87832B"]
+        "0x5f3530e593bbac37c61dc5b7755b6a40c06c20c1a3a1b13fca5b7d00cde65c29"
      values.$pastUpgrades.0.1:
-        "0x521e36f9009b6c2545f054baf46587c17738e71b354712e0b534c5a53192fceb"
+        "2025-04-02T16:50:23.000Z"
      values.$pastUpgrades.0.0:
-        "2024-12-02T10:19:11.000Z"
+        ["0x2D7e764a0D9919e16983a46595CfA81fc34fa7Cd"]
      values.$upgradeCount:
-        1
+        2
      values.version:
-        "3.10.0"
+        "3.13.0"
    }
```

```diff
    contract ProxyAdmin (0x89889B569c3a505f3640ee1Bd0ac1D557f436D2a) {
    +++ description: None
      directlyReceivedPermissions.6.from:
-        "0x61f89A381E0BE13BD8Ab356cf4B7301BC97d7522"
+        "0x88e529A6ccd302c948689Cd5156C83D4614FAE92"
      directlyReceivedPermissions.5.from:
-        "0x88e529A6ccd302c948689Cd5156C83D4614FAE92"
+        "0x512A3d2c7a43BD9261d2B8E8C9c70D4bd4D503C0"
      directlyReceivedPermissions.4.from:
-        "0x512A3d2c7a43BD9261d2B8E8C9c70D4bd4D503C0"
+        "0x190B6ecEE5A2ddF39669288B9B8daEa4641ae8b1"
    }
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
    contract DelayedWETH (0x9AEA1FD851b63d57Ba4Fc556B0e0c170126C9EAf) {
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
-   Status: DELETED
    contract PreimageOracle (0x9c065e11870B891D214Bc2Da7EF1f9DDFA1BE277)
    +++ description: The PreimageOracle contract is used to load the required data from L1 for a dispute game.
```

```diff
    contract L1CrossDomainMessenger (0x9CF951E3F74B644e621b36Ca9cea147a78D4c39f) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      sourceHashes.1:
-        "0x20a2eb4d3677fc8a15e944f7b1843acd01b2e92acdc4c7a7f7a35b07b891149b"
+        "0xfaa50769db48b1d2c04c06a8a0a4771b87b3c0ff20a508115bfdb2b576fdb454"
      sourceHashes.0:
-        "0x1cc8a3b7de3d2c54c4706bb3f3015714d3b56647fc9fbfd6f8b068f5f63c1c25"
+        "0x20a2eb4d3677fc8a15e944f7b1843acd01b2e92acdc4c7a7f7a35b07b891149b"
      values.$implementation:
-        "0xD3494713A5cfaD3F5359379DfA074E2Ac8C6Fd65"
+        "0x3eA6084748ED1b2A9B5D4426181F1ad8C93F6231"
      values.$pastUpgrades.1:
+        ["2025-04-02T16:50:23.000Z","0x5f3530e593bbac37c61dc5b7755b6a40c06c20c1a3a1b13fca5b7d00cde65c29",["0x3eA6084748ED1b2A9B5D4426181F1ad8C93F6231"]]
      values.$upgradeCount:
-        1
+        2
      values.version:
-        "2.3.0"
+        "2.5.0"
    }
```

```diff
    contract OptimismMintableERC20Factory (0xc1047e30EFC9E172cFe7aa0219895B6a43fC415F) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      sourceHashes.1:
-        "0x4c5ac4e53576924cabbd2a471f368a541bc3f4b1f53fa41a389692fcc62f6176"
+        "0x9650b4bba6299e410f01a369a95a2c57e1c3ca35f0d80c13f4f59fc468f370e5"
      values.$implementation:
-        "0xE01efbeb1089D1d1dB9c6c8b135C934C0734c846"
+        "0x5493f4677A186f64805fe7317D6993ba4863988F"
      values.$pastUpgrades.1:
+        ["2025-04-02T16:50:23.000Z","0x5f3530e593bbac37c61dc5b7755b6a40c06c20c1a3a1b13fca5b7d00cde65c29",["0x5493f4677A186f64805fe7317D6993ba4863988F"]]
      values.$upgradeCount:
-        1
+        2
      values.version:
-        "1.9.0"
+        "1.10.1"
    }
```

```diff
    contract L1StandardBridge (0xeb9bf100225c214Efc3E7C651ebbaDcF85177607) {
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
+   Status: CREATED
    contract PermissionedDisputeGame (0x1661af719956198628F7e67087F19f8A79524a1d)
    +++ description: Same as FaultDisputeGame, but only two permissioned addresses are designated as proposer and challenger.
```

```diff
+   Status: CREATED
    contract AnchorStateRegistry (0x190B6ecEE5A2ddF39669288B9B8daEa4641ae8b1)
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

## Source code changes

```diff
.../AnchorStateRegistry/AnchorStateRegistry.sol    |  270 +++-
 .../DelayedWETH/DelayedWETH.sol                    |  231 ++--
 .../DisputeGameFactory/DisputeGameFactory.sol      |  240 ++--
 .../L1CrossDomainMessenger.sol                     |  400 ++++--
 .../L1ERC721Bridge/L1ERC721Bridge.sol              |  413 +++---
 .../L1StandardBridge/L1StandardBridge.sol          |  503 ++++---
 .../ethereum/{.flat@21995440 => .flat}/MIPS.sol    |  511 ++++---
 .../OptimismMintableERC20Factory.sol               |   30 +-
 .../OptimismPortal2/OptimismPortal2.sol            |  439 ++++--
 .../PermissionedDisputeGame.sol                    |  277 ++--
 .../{.flat@21995440 => .flat}/PreimageOracle.sol   |  216 ++-
 .../SuperchainConfig/SuperchainConfig.sol          |    8 +-
 .../SystemConfig/SystemConfig.sol                  | 1414 +-------------------
 13 files changed, 2227 insertions(+), 2725 deletions(-)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21995440 (main branch discovery), not current.

```diff
    contract SuperchainProxyAdminOwner (0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A) {
    +++ description: None
      receivedPermissions.11:
+        {"permission":"upgrade","from":"0x9AEA1FD851b63d57Ba4Fc556B0e0c170126C9EAf","via":[{"address":"0x89889B569c3a505f3640ee1Bd0ac1D557f436D2a"}]}
      receivedPermissions.10.permission:
-        "upgrade"
+        "interact"
      receivedPermissions.10.via:
-        [{"address":"0x89889B569c3a505f3640ee1Bd0ac1D557f436D2a"}]
      receivedPermissions.10.description:
+        "can pull funds from the contract in case of emergency."
    }
```

```diff
    contract DelayedWETH (0x9AEA1FD851b63d57Ba4Fc556B0e0c170126C9EAf) {
    +++ description: Contract designed to hold the bonded ETH for each game. It is designed as a wrapper around WETH to allow an owner to function as a backstop if a game would incorrectly distribute funds.
      issuedPermissions.1:
+        {"permission":"upgrade","to":"0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A","via":[{"address":"0x89889B569c3a505f3640ee1Bd0ac1D557f436D2a"}]}
      issuedPermissions.0.permission:
-        "upgrade"
+        "interact"
      issuedPermissions.0.via.0:
-        {"address":"0x89889B569c3a505f3640ee1Bd0ac1D557f436D2a"}
      issuedPermissions.0.description:
+        "can pull funds from the contract in case of emergency."
    }
```

Generated with discovered.json: 0xe86dccfbd6e7b0b00b79044fee9164a4882017e6

# Diff at Thu, 27 Mar 2025 11:15:19 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@8cc2e36080df3a74dfd8475d41c64f46203f5218 block: 21995440
- current block number: 21995440

## Description

Config related: add guardian description details, hide some noisy values, hide AddressManager as spam cat, add proposer / challenger to permissioned opfp chains.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21995440 (main branch discovery), not current.

```diff
    contract AddressManager (0xB24bFEeCE1B3b7A44559F4Cbc21BeD312b130b70) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract AddressManager (0xdE1FCfB0851916CA5101820A69b13a4E276bd81F) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      category:
+        {"name":"Spam","priority":-1}
    }
```

Generated with discovered.json: 0x7c69bc68591045406bf1858864014cecf839f27a

# Diff at Tue, 18 Mar 2025 08:14:06 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@4ef7a8dbcec1cd9fec77aae2b73d81347a4ffb13 block: 21995440
- current block number: 21995440

## Description

Config: change Multisig names.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21995440 (main branch discovery), not current.

```diff
    contract Optimism Guardian Multisig (0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2) {
    +++ description: None
      name:
-        "SuperchainGuardianMultisig"
+        "Optimism Guardian Multisig"
    }
```

```diff
    contract Soneium Multisig (0x509182eC226b3B71D36A3255A80EF0b1A9D43033) {
    +++ description: None
      name:
-        "SoneiumMultisig"
+        "Soneium Multisig"
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

Generated with discovered.json: 0x374c391f5fda5fa111536a5d4d6b140ae51bd498

# Diff at Fri, 07 Mar 2025 13:56:40 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@c5dbe2ef6b8273c834507deba40dda8a1affce55 block: 21967100
- current block number: 21995440

## Description

Single member added to SoneiumMultisig.

## Watched changes

```diff
    contract SoneiumMultisig (0x509182eC226b3B71D36A3255A80EF0b1A9D43033) {
    +++ description: None
      values.$members.5:
+        "0xba1a565d2bF6D27F451a459308f423219478c5cB"
      values.$members.4:
-        "0xba1a565d2bF6D27F451a459308f423219478c5cB"
+        "0xD6db4b8aD9b8BD4665B968fab017ffEAb546F94a"
      values.$members.3:
-        "0xD6db4b8aD9b8BD4665B968fab017ffEAb546F94a"
+        "0xb9269f274E7Edc73bf3d923E347d0784e4a5e452"
      values.$members.2:
-        "0xb9269f274E7Edc73bf3d923E347d0784e4a5e452"
+        "0x420537Ec5e82CDE86f04F3d61F3aD56F7c7dD32B"
      values.$members.1:
-        "0x420537Ec5e82CDE86f04F3d61F3aD56F7c7dD32B"
+        "0x94e9Ef16A9eF6C37164A7BCA6CFb03b52d23AF7E"
      values.$members.0:
-        "0x94e9Ef16A9eF6C37164A7BCA6CFb03b52d23AF7E"
+        "0xd45F9F3990C48AfA5C90404c7a748b4c23FB2cba"
      values.multisigThreshold:
-        "3 of 5 (60%)"
+        "3 of 6 (50%)"
    }
```

Generated with discovered.json: 0xaaf55dc8427ef3c11d29a220970a49d59a91f0b0

# Diff at Tue, 04 Mar 2025 11:26:31 GMT:

- chain: ethereum
- author: Michał Podsiadły (<michal.podsiadly@l2beat.com>)
- comparing to: main@be38e12d3ff947ca8de40f3a23a9ba1875a54f5a block: 21965340
- current block number: 21967100

## Description

Provide description of changes. This section will be preserved.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21965340 (main branch discovery), not current.

```diff
    contract SystemConfig (0x7A8Ed66B319911A0F3E7288BDdAB30d9c0C875c3) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      values.opStackDA.isSomeTxsLengthEqualToCelestiaDAExample:
-        false
      values.opStackDA.isUsingCelestia:
+        false
    }
```

Generated with discovered.json: 0x1813d25ce6bd3d08381f05bf6ed6a2817f9d9983

# Diff at Tue, 04 Mar 2025 10:39:57 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@98d260b45fe0d2195ce5e629bd7b200c8706e8ba block: 21965340
- current block number: 21965340

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21965340 (main branch discovery), not current.

```diff
    contract LivenessModule (0x0454092516c9A4d636d3CAfA1e82161376C8a748) {
    +++ description: used to remove members inactive for 98d while making sure that the threshold remains above 75%. If the number of members falls below 8, the 0x847B5c174615B1B7fDF770882256e2D3E95b9D92 takes ownership of the multisig
      sinceBlock:
+        19989094
    }
```

```diff
    contract SuperchainGuardianMultisig (0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2) {
    +++ description: None
      sinceBlock:
+        19968607
    }
```

```diff
    contract MIPS (0x16e83cE5Ce29BF90AD9Da06D2fE6a15d5f344ce4) {
    +++ description: The MIPS contract is used to execute the final step of the dispute game which objectively determines the winner of the dispute.
      sinceBlock:
+        20637601
    }
```

```diff
    contract LivenessGuard (0x24424336F04440b1c28685a38303aC33C9D14a25) {
    +++ description: None
      sinceBlock:
+        19989094
    }
```

```diff
    contract L1ERC20TokenBridge (0x2F543A7C9cc80Cc2427c892B96263098d23ee55a) {
    +++ description: Lido custom escrow for wstETH tokens that uses the canonical bridge for messaging but is governed externally.
      sinceBlock:
+        21664885
    }
```

```diff
    contract PermissionedDisputeGame (0x42D15f045159Ce4adE9EDC7da5704eF36056c936) {
    +++ description: Same as FaultDisputeGame, but only two permissioned addresses are designated as proposer and challenger.
      sinceBlock:
+        21314185
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
    contract SoneiumMultisig (0x509182eC226b3B71D36A3255A80EF0b1A9D43033) {
    +++ description: None
      sinceBlock:
+        21278117
    }
```

```diff
    contract DisputeGameFactory (0x512A3d2c7a43BD9261d2B8E8C9c70D4bd4D503C0) {
    +++ description: The dispute game factory allows the creation of dispute games, used to propose state roots and eventually challenge them.
      sinceBlock:
+        21314185
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
    contract L1ERC721Bridge (0x5933e323bE8896DfaCd1cD671442F27dAA10a053) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      sinceBlock:
+        21314185
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
    contract AnchorStateRegistry (0x61f89A381E0BE13BD8Ab356cf4B7301BC97d7522) {
    +++ description: Contains the latest confirmed state root that can be used as a starting point in a dispute game.
      sinceBlock:
+        21314185
    }
```

```diff
    contract SystemConfig (0x7A8Ed66B319911A0F3E7288BDdAB30d9c0C875c3) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      sinceBlock:
+        21314185
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
    contract OptimismPortal2 (0x88e529A6ccd302c948689Cd5156C83D4614FAE92) {
    +++ description: The OptimismPortal contract is the main entry point to deposit funds from L1 to L2. It also allows to prove and finalize withdrawals. It specifies which game type can be used for withdrawals, which currently is the PermissionedDisputeGame.
      sinceBlock:
+        21314185
    }
```

```diff
    contract ProxyAdmin (0x89889B569c3a505f3640ee1Bd0ac1D557f436D2a) {
    +++ description: None
      sinceBlock:
+        21314185
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
    contract DelayedWETH (0x9AEA1FD851b63d57Ba4Fc556B0e0c170126C9EAf) {
    +++ description: Contract designed to hold the bonded ETH for each game. It is designed as a wrapper around WETH to allow an owner to function as a backstop if a game would incorrectly distribute funds.
      sinceBlock:
+        21314185
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
    contract L1CrossDomainMessenger (0x9CF951E3F74B644e621b36Ca9cea147a78D4c39f) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      sinceBlock:
+        21314185
    }
```

```diff
    contract AddressManager (0xB24bFEeCE1B3b7A44559F4Cbc21BeD312b130b70) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      sinceBlock:
+        21314185
    }
```

```diff
    contract OptimismMintableERC20Factory (0xc1047e30EFC9E172cFe7aa0219895B6a43fC415F) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      sinceBlock:
+        21314185
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
    contract L1OpUSDCBridgeAdapter (0xC67A8c5f22b40274Ca7C4A56Db89569Ee2AD3FAb) {
    +++ description: Escrow for USDC that uses the canonical bridge for messaging but is governed externally.
      sinceBlock:
+        21471915
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
    contract L1StandardBridge (0xeb9bf100225c214Efc3E7C651ebbaDcF85177607) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      sinceBlock:
+        21314185
    }
```

Generated with discovered.json: 0x5dd07ab3ee227d71fd3a75f85d228f28f9facfb4

# Diff at Mon, 03 Mar 2025 09:03:39 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@f23dcb100957b0b121d62148a4d586788383af80 block: 21931801
- current block number: 21965340

## Description

SystemConfig upgrade to known version:
- libraries added (Constants, LibString, GasPayingToken)
- minor changes

## Watched changes

```diff
    contract SystemConfig (0x7A8Ed66B319911A0F3E7288BDdAB30d9c0C875c3) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      sourceHashes.1:
-        "0xbbb92920a096eced30e3ce67bbc443f134b217e8847433fbb192ecb9fdddcbc2"
+        "0xc7135dbd2a53312d36df3f3ee91ce0a5a459ab8fc7725880a3a9c55a5fa0ed6c"
      values.$implementation:
-        "0xF56D96B2535B932656d3c04Ebf51baBff241D886"
+        "0xAB9d6cB7A427c0765163A7f45BB91cAfe5f2D375"
      values.$pastUpgrades.3:
+        ["2025-02-28T14:55:35.000Z","0x9c6af2cb2b4fcde9e351662342f15b60f004108b575dddd05d0caa4f50220966",["0xAB9d6cB7A427c0765163A7f45BB91cAfe5f2D375"]]
      values.$pastUpgrades.2:
+        ["2025-02-28T14:55:35.000Z","0x9c6af2cb2b4fcde9e351662342f15b60f004108b575dddd05d0caa4f50220966",["0xd81f43eDBCAcb4c29a9bA38a13Ee5d79278270cC"]]
      values.$upgradeCount:
-        2
+        4
      values.version:
-        "2.2.0"
+        "2.3.0"
      values.basefeeScalar:
+        9736
      values.blobbasefeeScalar:
+        1540079
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

Generated with discovered.json: 0x9ca12edc2675c06e9f0afbc12a0279d05150a132

# Diff at Thu, 27 Feb 2025 12:01:47 GMT:

- chain: ethereum
- author: Michał Podsiadły (<michal.podsiadly@l2beat.com>)
- comparing to: main@a4b50e45bb44f8ceeea29f9236088d26a843c885 block: 21931801
- current block number: 21931801

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21931801 (main branch discovery), not current.

```diff
    contract L1ERC20TokenBridge (0x2F543A7C9cc80Cc2427c892B96263098d23ee55a) {
    +++ description: Lido custom escrow for wstETH tokens that uses the canonical bridge for messaging but is governed externally.
      name:
-        "L1LidoTokensBridge"
+        "L1ERC20TokenBridge"
      displayName:
-        "L1ERC20TokenBridge"
    }
```

```diff
    contract OptimismPortal2 (0x88e529A6ccd302c948689Cd5156C83D4614FAE92) {
    +++ description: The OptimismPortal contract is the main entry point to deposit funds from L1 to L2. It also allows to prove and finalize withdrawals. It specifies which game type can be used for withdrawals, which currently is the PermissionedDisputeGame.
      displayName:
-        "OptimismPortal"
    }
```

```diff
    contract AddressManager (0xdE1FCfB0851916CA5101820A69b13a4E276bd81F) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      name:
-        "Lib_AddressManager"
+        "AddressManager"
      displayName:
-        "AddressManager"
    }
```

Generated with discovered.json: 0x093f3dab64b8cbc670476958de7629ddb9915c16

# Diff at Wed, 26 Feb 2025 16:48:30 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@9eb8b2d626938c85a098b11b809352a92a892736 block: 21872714
- current block number: 21931801

## Description

gasLimit raised a bit (60M->30M in last update).

config related: added categories for all opstack, op stack and polygoncdk stack templates.

## Watched changes

```diff
    contract SystemConfig (0x7A8Ed66B319911A0F3E7288BDdAB30d9c0C875c3) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
+++ description: Gas limit for blocks on L2.
+++ severity: LOW
      values.gasLimit:
-        30000000
+        40000000
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21872714 (main branch discovery), not current.

```diff
    contract DisputeGameFactory (0x512A3d2c7a43BD9261d2B8E8C9c70D4bd4D503C0) {
    +++ description: The dispute game factory allows the creation of dispute games, used to propose state roots and eventually challenge them.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract L1ERC721Bridge (0x5933e323bE8896DfaCd1cD671442F27dAA10a053) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      category:
+        {"name":"Canonical Bridges","priority":2}
    }
```

```diff
    contract SystemConfig (0x7A8Ed66B319911A0F3E7288BDdAB30d9c0C875c3) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract OptimismPortal2 (0x88e529A6ccd302c948689Cd5156C83D4614FAE92) {
    +++ description: The OptimismPortal contract is the main entry point to deposit funds from L1 to L2. It also allows to prove and finalize withdrawals. It specifies which game type can be used for withdrawals, which currently is the PermissionedDisputeGame.
      category:
+        {"name":"Local Infrastructure","priority":5}
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
    contract L1CrossDomainMessenger (0x9CF951E3F74B644e621b36Ca9cea147a78D4c39f) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      category:
+        {"name":"Canonical Bridges","priority":2}
    }
```

```diff
    contract L1StandardBridge (0xeb9bf100225c214Efc3E7C651ebbaDcF85177607) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      category:
+        {"name":"Canonical Bridges","priority":2}
    }
```

Generated with discovered.json: 0xf7727238a444a72d5c5913965abbf5e4f44f8876

# Diff at Fri, 21 Feb 2025 09:00:15 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1cf9ec35847912163c4b663a633e258a434c0bca block: 21872714
- current block number: 21872714

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21872714 (main branch discovery), not current.

```diff
    contract SuperchainConfig (0x95703e0982140D16f8ebA6d158FccEde42f04a4C) {
    +++ description: Used to manage global configuration values for multiple OP Chains within a single Superchain network. The SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the Superchain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      categories:
-        ["Upgrades&Governance"]
    }
```

```diff
    contract L1CrossDomainMessenger (0x9CF951E3F74B644e621b36Ca9cea147a78D4c39f) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      categories:
-        ["Core"]
    }
```

```diff
    contract L1StandardBridge (0xeb9bf100225c214Efc3E7C651ebbaDcF85177607) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      categories:
-        ["Gateways&Escrows"]
    }
```

Generated with discovered.json: 0x1b7ca641ef17503af5c39100ef0b004c8bf955fa

# Diff at Tue, 18 Feb 2025 10:39:42 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@aff7e43e1c06f559de916763e04088cc23b3e08e block: 21829673
- current block number: 21872714

## Description

Soneium gas limit halved (checked on l2 block explorer since some op stacks have weird custom gas config).

## Watched changes

```diff
    contract SystemConfig (0x7A8Ed66B319911A0F3E7288BDdAB30d9c0C875c3) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
+++ description: Gas limit for blocks on L2.
+++ severity: LOW
      values.gasLimit:
-        60000000
+        30000000
    }
```

Generated with discovered.json: 0xb822487d0854a6da7090c4fd28a46b32d8a59a58

# Diff at Wed, 12 Feb 2025 10:00:33 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@554a6f0e6aa688c758b37653d0be7eb446f9152e block: 21802838
- current block number: 21829673

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

Generated with discovered.json: 0x5259e58500198151edb98f0e1469b6760c1fd3c4

# Diff at Mon, 10 Feb 2025 19:04:47 GMT:

- chain: ethereum
- author: Michał Podsiadły (<michal.podsiadly@l2beat.com>)
- comparing to: main@3756adff7c1ac86d8af3374a90a75c1999aae2b3 block: 21802838
- current block number: 21802838

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21802838 (main branch discovery), not current.

```diff
    contract SystemConfig (0x7A8Ed66B319911A0F3E7288BDdAB30d9c0C875c3) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      values.opStackDA.isUsingEigenDA:
+        false
    }
```

Generated with discovered.json: 0x2e5ded78d17c47d32410211fa35102d2f8db52ae

# Diff at Sat, 08 Feb 2025 15:58:23 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@ef01ea79812e0d524af00be3fae1170cef6fd662 block: 21786509
- current block number: 21802838

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

Generated with discovered.json: 0x0bd29bc8808c0486b927b2e562a092b73f95c9ea

# Diff at Thu, 06 Feb 2025 09:17:21 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@fa699ce266b15edb364aa471a661f580ea1a4529 block: 21773634
- current block number: 21786509

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

Generated with discovered.json: 0xf34bcf2bfdea2d66ef2a2c4ff3889c66549735d1

# Diff at Tue, 04 Feb 2025 14:08:55 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@a2f7f11f0fef381d4eb0e185aacd127008332826 block: 21731591
- current block number: 21773634

## Description

Added standard lido external canonical escrow (shapes in stock).

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21731591 (main branch discovery), not current.

```diff
+   Status: CREATED
    contract L1LidoTokensBridge (0x2F543A7C9cc80Cc2427c892B96263098d23ee55a)
    +++ description: Lido custom escrow for wstETH tokens that uses the canonical bridge for messaging but is governed externally.
```

Generated with discovered.json: 0x016ba5982ef0aba702c30e84511699e6675d454d

# Diff at Tue, 04 Feb 2025 12:32:41 GMT:

- chain: ethereum
- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@145553eed7ba44636411ecb25e4099728acd02f9 block: 21731591
- current block number: 21731591

## Description

Rename 'configure' permission to 'interact'

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21731591 (main branch discovery), not current.

```diff
    contract LivenessModule (0x0454092516c9A4d636d3CAfA1e82161376C8a748) {
    +++ description: used to remove members inactive for 98d while making sure that the threshold remains above 75%. If the number of members falls below 8, the 0x847B5c174615B1B7fDF770882256e2D3E95b9D92 takes ownership of the multisig
      issuedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract LivenessGuard (0x24424336F04440b1c28685a38303aC33C9D14a25) {
    +++ description: None
      receivedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract SoneiumMultisig (0x509182eC226b3B71D36A3255A80EF0b1A9D43033) {
    +++ description: None
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
      receivedPermissions.1.permission:
-        "configure"
+        "interact"
      receivedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract SystemConfig (0x7A8Ed66B319911A0F3E7288BDdAB30d9c0C875c3) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      issuedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract ProxyAdmin (0x89889B569c3a505f3640ee1Bd0ac1D557f436D2a) {
    +++ description: None
      directlyReceivedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract AddressManager (0xB24bFEeCE1B3b7A44559F4Cbc21BeD312b130b70) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      issuedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract Lib_AddressManager (0xdE1FCfB0851916CA5101820A69b13a4E276bd81F) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      issuedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

Generated with discovered.json: 0x7f784522bcae3935cf3c5c9c9779c6560eb9c2ef

# Diff at Mon, 27 Jan 2025 12:04:05 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@43cb526d71ed01f024dced9d5aea2a30cf306714 block: 21679918
- current block number: 21715739

## Description

Soneium external bridge gov change.

## Watched changes

```diff
    contract L1OpUSDCBridgeAdapter (0xC67A8c5f22b40274Ca7C4A56Db89569Ee2AD3FAb) {
    +++ description: Escrow for USDC that uses the canonical bridge for messaging but is governed externally.
      values.$admin:
-        "0x448dAe9299366ff611678fdA2f3a386791C95d41"
+        "0xE7c9a9DddAb8a384c38D721DE64E4222Fe76DF75"
      values.owner:
-        "0x448dAe9299366ff611678fdA2f3a386791C95d41"
+        "0xE7c9a9DddAb8a384c38D721DE64E4222Fe76DF75"
    }
```

Generated with discovered.json: 0x8730e527cd5a87ec57ec483c285c96d2fc30707a

# Diff at Wed, 22 Jan 2025 12:20:00 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@ae0363af45e5c1f3ac9d68ef4ce62fdaada6de1c block: 21637001
- current block number: 21679918

## Description

MS member changes.

## Watched changes

```diff
    contract SoneiumMultisig (0x509182eC226b3B71D36A3255A80EF0b1A9D43033) {
    +++ description: None
      values.$members.4:
-        "0x48FF760E582c3740336656349684b4FD4c6ED88F"
+        "0xba1a565d2bF6D27F451a459308f423219478c5cB"
      values.$members.3:
-        "0x127Bae6Fc751dC92111a359500ae91EB437f3dCb"
+        "0xD6db4b8aD9b8BD4665B968fab017ffEAb546F94a"
      values.$members.2:
-        "0x83cC8195856b0463dEd5f052021009b7985FDa2C"
+        "0xb9269f274E7Edc73bf3d923E347d0784e4a5e452"
      values.$members.1:
-        "0xEc33045FA66cF43E9b5b9F332dc124dbc71c0917"
+        "0x420537Ec5e82CDE86f04F3d61F3aD56F7c7dD32B"
      values.$members.0:
-        "0x2b3Aa0Dc0622eFb9426F5A44015aE9151Bd8224C"
+        "0x94e9Ef16A9eF6C37164A7BCA6CFb03b52d23AF7E"
      values.$threshold:
-        2
+        3
      values.multisigThreshold:
-        "2 of 5 (40%)"
+        "3 of 5 (60%)"
    }
```

Generated with discovered.json: 0x0bf578323590845037f9bf560f3aed23eb097384

# Diff at Tue, 21 Jan 2025 11:19:15 GMT:

- chain: ethereum
- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@0da84acc479f34212f2c8133869a3eef33d46ecc block: 21637001
- current block number: 21637001

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21637001 (main branch discovery), not current.

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
    +++ description: None
      receivedPermissions:
+        [{"permission":"configure","from":"0x0454092516c9A4d636d3CAfA1e82161376C8a748","description":"can remove members of 0xc2819DC788505Aac350142A7A707BF9D03E3Bd03 inactive for 98d."}]
    }
```

```diff
    contract OpFoundationUpgradeSafe (0x847B5c174615B1B7fDF770882256e2D3E95b9D92) {
    +++ description: None
      receivedPermissions:
+        [{"permission":"guard","from":"0x95703e0982140D16f8ebA6d158FccEde42f04a4C","via":[{"address":"0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2"},{"address":"0xc2819DC788505Aac350142A7A707BF9D03E3Bd03"},{"address":"0x0454092516c9A4d636d3CAfA1e82161376C8a748","condition":"the number of 0xc2819DC788505Aac350142A7A707BF9D03E3Bd03 members falls below 8."}]}]
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

Generated with discovered.json: 0x173647e6bffec7726d89f9bcd1b4fd7cd6f3c888

# Diff at Mon, 20 Jan 2025 11:10:09 GMT:

- chain: ethereum
- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@2c8b4f3d9910bb6371be9b4df87b70856e7d8c64 block: 21637001
- current block number: 21637001

## Description

Rerun on the same block number. Applies fixes to permissions and via field. Renames permission's target to to/from.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21637001 (main branch discovery), not current.

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
    contract SuperchainGuardianMultisig (0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2) {
    +++ description: None
      directlyReceivedPermissions.0.target:
-        "0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
      directlyReceivedPermissions.0.from:
+        "0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
    }
```

```diff
    contract SoneiumMultisig (0x509182eC226b3B71D36A3255A80EF0b1A9D43033) {
    +++ description: None
      receivedPermissions.0.target:
-        "0x7A8Ed66B319911A0F3E7288BDdAB30d9c0C875c3"
      receivedPermissions.0.from:
+        "0x7A8Ed66B319911A0F3E7288BDdAB30d9c0C875c3"
    }
```

```diff
    contract DisputeGameFactory (0x512A3d2c7a43BD9261d2B8E8C9c70D4bd4D503C0) {
    +++ description: The dispute game factory allows the creation of dispute games, used to propose state roots and eventually challenge them.
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
      directlyReceivedPermissions.1.target:
-        "0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
      directlyReceivedPermissions.1.from:
+        "0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
      directlyReceivedPermissions.0.target:
-        "0xdE1FCfB0851916CA5101820A69b13a4E276bd81F"
      directlyReceivedPermissions.0.from:
+        "0xdE1FCfB0851916CA5101820A69b13a4E276bd81F"
    }
```

```diff
    contract L1ERC721Bridge (0x5933e323bE8896DfaCd1cD671442F27dAA10a053) {
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
    contract SuperchainProxyAdminOwner (0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A) {
    +++ description: None
      receivedPermissions.10.target:
-        "0xeb9bf100225c214Efc3E7C651ebbaDcF85177607"
      receivedPermissions.10.from:
+        "0xeb9bf100225c214Efc3E7C651ebbaDcF85177607"
      receivedPermissions.9.target:
-        "0xc1047e30EFC9E172cFe7aa0219895B6a43fC415F"
      receivedPermissions.9.from:
+        "0xc1047e30EFC9E172cFe7aa0219895B6a43fC415F"
      receivedPermissions.8.target:
-        "0x9AEA1FD851b63d57Ba4Fc556B0e0c170126C9EAf"
      receivedPermissions.8.from:
+        "0x9AEA1FD851b63d57Ba4Fc556B0e0c170126C9EAf"
      receivedPermissions.7.target:
-        "0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
      receivedPermissions.7.from:
+        "0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
      receivedPermissions.6.target:
-        "0x88e529A6ccd302c948689Cd5156C83D4614FAE92"
      receivedPermissions.6.from:
+        "0x88e529A6ccd302c948689Cd5156C83D4614FAE92"
      receivedPermissions.5.target:
-        "0x7A8Ed66B319911A0F3E7288BDdAB30d9c0C875c3"
      receivedPermissions.5.from:
+        "0x7A8Ed66B319911A0F3E7288BDdAB30d9c0C875c3"
      receivedPermissions.4.target:
-        "0x61f89A381E0BE13BD8Ab356cf4B7301BC97d7522"
      receivedPermissions.4.from:
+        "0x61f89A381E0BE13BD8Ab356cf4B7301BC97d7522"
      receivedPermissions.3.target:
-        "0x5933e323bE8896DfaCd1cD671442F27dAA10a053"
      receivedPermissions.3.from:
+        "0x5933e323bE8896DfaCd1cD671442F27dAA10a053"
      receivedPermissions.2.target:
-        "0x512A3d2c7a43BD9261d2B8E8C9c70D4bd4D503C0"
      receivedPermissions.2.from:
+        "0x512A3d2c7a43BD9261d2B8E8C9c70D4bd4D503C0"
      receivedPermissions.1.target:
-        "0xdE1FCfB0851916CA5101820A69b13a4E276bd81F"
      receivedPermissions.1.from:
+        "0xdE1FCfB0851916CA5101820A69b13a4E276bd81F"
      receivedPermissions.0.target:
-        "0xB24bFEeCE1B3b7A44559F4Cbc21BeD312b130b70"
      receivedPermissions.0.from:
+        "0xB24bFEeCE1B3b7A44559F4Cbc21BeD312b130b70"
      directlyReceivedPermissions.1.target:
-        "0x89889B569c3a505f3640ee1Bd0ac1D557f436D2a"
      directlyReceivedPermissions.1.from:
+        "0x89889B569c3a505f3640ee1Bd0ac1D557f436D2a"
      directlyReceivedPermissions.0.target:
-        "0x543bA4AADBAb8f9025686Bd03993043599c6fB04"
      directlyReceivedPermissions.0.from:
+        "0x543bA4AADBAb8f9025686Bd03993043599c6fB04"
    }
```

```diff
    contract AnchorStateRegistry (0x61f89A381E0BE13BD8Ab356cf4B7301BC97d7522) {
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
    contract SystemConfig (0x7A8Ed66B319911A0F3E7288BDdAB30d9c0C875c3) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      issuedPermissions.2.target:
-        "0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A"
      issuedPermissions.2.via.0.delay:
-        0
      issuedPermissions.2.to:
+        "0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A"
      issuedPermissions.1.target:
-        "0x6776BE80dBAda6A02B5F2095cF13734ac303B8d1"
      issuedPermissions.1.to:
+        "0x6776BE80dBAda6A02B5F2095cF13734ac303B8d1"
      issuedPermissions.0.target:
-        "0x509182eC226b3B71D36A3255A80EF0b1A9D43033"
      issuedPermissions.0.to:
+        "0x509182eC226b3B71D36A3255A80EF0b1A9D43033"
      issuedPermissions.0.description:
+        "it can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system."
    }
```

```diff
    contract OptimismPortal2 (0x88e529A6ccd302c948689Cd5156C83D4614FAE92) {
    +++ description: The OptimismPortal contract is the main entry point to deposit funds from L1 to L2. It also allows to prove and finalize withdrawals. It specifies which game type can be used for withdrawals, which currently is the PermissionedDisputeGame.
      issuedPermissions.0.target:
-        "0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A"
    }
```

```diff
    contract ProxyAdmin (0x89889B569c3a505f3640ee1Bd0ac1D557f436D2a) {
    +++ description: None
      directlyReceivedPermissions.8.target:
-        "0xeb9bf100225c214Efc3E7C651ebbaDcF85177607"
      directlyReceivedPermissions.8.from:
+        "0xeb9bf100225c214Efc3E7C651ebbaDcF85177607"
      directlyReceivedPermissions.7.target:
-        "0xc1047e30EFC9E172cFe7aa0219895B6a43fC415F"
      directlyReceivedPermissions.7.from:
+        "0xc1047e30EFC9E172cFe7aa0219895B6a43fC415F"
      directlyReceivedPermissions.6.target:
-        "0x9AEA1FD851b63d57Ba4Fc556B0e0c170126C9EAf"
      directlyReceivedPermissions.6.from:
+        "0x9AEA1FD851b63d57Ba4Fc556B0e0c170126C9EAf"
      directlyReceivedPermissions.5.target:
-        "0x88e529A6ccd302c948689Cd5156C83D4614FAE92"
      directlyReceivedPermissions.5.from:
+        "0x88e529A6ccd302c948689Cd5156C83D4614FAE92"
      directlyReceivedPermissions.4.target:
-        "0x7A8Ed66B319911A0F3E7288BDdAB30d9c0C875c3"
      directlyReceivedPermissions.4.from:
+        "0x7A8Ed66B319911A0F3E7288BDdAB30d9c0C875c3"
      directlyReceivedPermissions.3.target:
-        "0x61f89A381E0BE13BD8Ab356cf4B7301BC97d7522"
      directlyReceivedPermissions.3.from:
+        "0x61f89A381E0BE13BD8Ab356cf4B7301BC97d7522"
      directlyReceivedPermissions.2.target:
-        "0x5933e323bE8896DfaCd1cD671442F27dAA10a053"
      directlyReceivedPermissions.2.from:
+        "0x5933e323bE8896DfaCd1cD671442F27dAA10a053"
      directlyReceivedPermissions.1.target:
-        "0x512A3d2c7a43BD9261d2B8E8C9c70D4bd4D503C0"
      directlyReceivedPermissions.1.from:
+        "0x512A3d2c7a43BD9261d2B8E8C9c70D4bd4D503C0"
      directlyReceivedPermissions.0.target:
-        "0xB24bFEeCE1B3b7A44559F4Cbc21BeD312b130b70"
      directlyReceivedPermissions.0.from:
+        "0xB24bFEeCE1B3b7A44559F4Cbc21BeD312b130b70"
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
    contract DelayedWETH (0x9AEA1FD851b63d57Ba4Fc556B0e0c170126C9EAf) {
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
    contract AddressManager (0xB24bFEeCE1B3b7A44559F4Cbc21BeD312b130b70) {
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
    contract OptimismMintableERC20Factory (0xc1047e30EFC9E172cFe7aa0219895B6a43fC415F) {
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
    contract Lib_AddressManager (0xdE1FCfB0851916CA5101820A69b13a4E276bd81F) {
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
    contract L1StandardBridge (0xeb9bf100225c214Efc3E7C651ebbaDcF85177607) {
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

Generated with discovered.json: 0x8387f14109ac505e99b3e77a20086e5357c48219

# Diff at Thu, 16 Jan 2025 10:14:46 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@3513cb068688b9fa7f9ddd40447f5f70d088c2cf block: 21631401
- current block number: 21631401

## Description

Add decoding of absolute prestate hashes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21631401 (main branch discovery), not current.

```diff
    contract PermissionedDisputeGame (0x42D15f045159Ce4adE9EDC7da5704eF36056c936) {
    +++ description: Same as FaultDisputeGame, but only two permissioned addresses are designated as proposer and challenger.
+++ description: Prestate tag for known prestates.
      values.absolutePrestateDecoded:
+        "v1.3.1 (govApproved)"
      fieldMeta:
+        {"absolutePrestateDecoded":{"description":"Prestate tag for known prestates."}}
      usedTypes:
+        [{"typeCaster":"Mapping","arg":{"0x0386cde2f2b1bde1189ac9c9b7d66774e6260eca778223def326bfe680c14ab9":"v1.4.1-rc.2 (cannon64)","0x03045fd433fb5391c40751939d7cb5e9dfe83cf156f9395566a311e7fe9d3aa2":"v1.4.1-rc.2","0x03b7eaa4e3cbce90381921a4b48008f4769871d64f93d113fcadca08ecee503b":"v1.4.0 (cannon64)","0x03f89406817db1ed7fd8b31e13300444652cdb0b9c509a674de43483b2f83568":"v1.4.0 (govApproved)","0x0348ce2059f718af75729c2c56860551b46b665956a641b3cb2cd51e50b7b725":"v1.4.0-rc.2 (cannon64)","0x0364e4e72922e7d649338f558f8a14b50ca31922a1484e73ea03987fb1516095":"v1.4.0-rc.2","0x032e5d6119ee983cb87deae3eef16ea6086f2347433c99f1820d60f36a24a6e6":"v1.4.0-rc.1 (cannon64)","0x03925193e3e89f87835bbdf3a813f60b2aa818a36bbe71cd5d8fd7e79f5e8afe":"v1.4.0-rc.1","0x03c50b9fd04bdadc228205f340767bbf2d01a030aec39903120d3559d94bb8cc":"v1.3.1-ink","0x038512e02c4c3f7bdaec27d00edf55b7155e0905301e1a88083e4e0a6764d54c":"v1.3.1 (govApproved)","0x03e806a2859a875267a563462a06d4d1d1b455a9efee959a46e21e54b6caf69a":"v1.3.1-rc.1","0x030de10d9da911a2b180ecfae2aeaba8758961fc28262ce989458c6f9a547922":"v1.3.0-rc.3","0x0385c3f8ee78491001d92b90b07d0cf387b7b52ab9b83b4d87c994e92cf823ba":"v1.3.0-rc.2","0x0367c4aa897bffbded0b523f277ca892298dc3c691baf37bc2099b86024f9673":"v1.3.0-rc.1","0x03617abec0b255dc7fc7a0513a2c2220140a1dcd7a1c8eca567659bd67e05cea":"v1.2.0 (govApproved)","0x03e69d3de5155f4a80da99dd534561cbddd4f9dd56c9ecc704d6886625711d2b":"v1.1.0","0x0398bdd93e2e9313befdf82beb709da6a4daf35ce1abb42d8a998ec9bc1c572e":"v1.0.1","0x037ef3c1a487960b0e633d3e513df020c43432769f41a634d18a9595cbf53c55":"v1.0.0 (govApproved)","0x034c8cc69f22c35ae386a97136715dd48aaf97fd190942a111bfa680c2f2f421":"v0.3.0","0x031e3b504740d0b1264e8cf72b6dde0d497184cfb3f98e451c6be8b33bd3f808":"v0.2.0","0x038942ec840131a63c49fa514a3f0577ae401fd5584d56ad50cdf5a8b41d4538":"v0.1.0","0x03babef4b4c6d866d56e6356d961839fd9475931d11e0ea507420a87b0cadbdd":"v0.0.1"}}]
    }
```

Generated with discovered.json: 0x47e1ac6530ee74ed0306f6733efac8f0134cbf55

# Diff at Wed, 15 Jan 2025 17:33:42 GMT:

- chain: ethereum
- author: Luca Donno (<donnoh99@gmail.com>)
- current block number: 21631401

## Description

First discovery of Soneium.

## Initial discovery

```diff
+   Status: CREATED
    contract LivenessModule (0x0454092516c9A4d636d3CAfA1e82161376C8a748)
    +++ description: used to remove members inactive for 98d while making sure that the threshold remains above 75%. If the number of members falls below 8, the 0x847B5c174615B1B7fDF770882256e2D3E95b9D92 takes ownership of the multisig
```

```diff
+   Status: CREATED
    contract SuperchainGuardianMultisig (0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2)
    +++ description: None
```

```diff
+   Status: CREATED
    contract MIPS (0x16e83cE5Ce29BF90AD9Da06D2fE6a15d5f344ce4)
    +++ description: The MIPS contract is used to execute the final step of the dispute game which objectively determines the winner of the dispute.
```

```diff
+   Status: CREATED
    contract LivenessGuard (0x24424336F04440b1c28685a38303aC33C9D14a25)
    +++ description: None
```

```diff
+   Status: CREATED
    contract PermissionedDisputeGame (0x42D15f045159Ce4adE9EDC7da5704eF36056c936)
    +++ description: Same as FaultDisputeGame, but only two permissioned addresses are designated as proposer and challenger.
```

```diff
+   Status: CREATED
    contract GnosisSafe (0x42d27eEA1AD6e22Af6284F609847CB3Cd56B9c64)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SoneiumMultisig (0x509182eC226b3B71D36A3255A80EF0b1A9D43033)
    +++ description: None
```

```diff
+   Status: CREATED
    contract DisputeGameFactory (0x512A3d2c7a43BD9261d2B8E8C9c70D4bd4D503C0)
    +++ description: The dispute game factory allows the creation of dispute games, used to propose state roots and eventually challenge them.
```

```diff
+   Status: CREATED
    contract SuperchainProxyAdmin (0x543bA4AADBAb8f9025686Bd03993043599c6fB04)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1ERC721Bridge (0x5933e323bE8896DfaCd1cD671442F27dAA10a053)
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
```

```diff
+   Status: CREATED
    contract SuperchainProxyAdminOwner (0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A)
    +++ description: None
```

```diff
+   Status: CREATED
    contract AnchorStateRegistry (0x61f89A381E0BE13BD8Ab356cf4B7301BC97d7522)
    +++ description: Contains the latest confirmed state root that can be used as a starting point in a dispute game.
```

```diff
+   Status: CREATED
    contract SystemConfig (0x7A8Ed66B319911A0F3E7288BDdAB30d9c0C875c3)
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
```

```diff
+   Status: CREATED
    contract OpFoundationUpgradeSafe (0x847B5c174615B1B7fDF770882256e2D3E95b9D92)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OptimismPortal2 (0x88e529A6ccd302c948689Cd5156C83D4614FAE92)
    +++ description: The OptimismPortal contract is the main entry point to deposit funds from L1 to L2. It also allows to prove and finalize withdrawals. It specifies which game type can be used for withdrawals, which currently is the PermissionedDisputeGame.
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x89889B569c3a505f3640ee1Bd0ac1D557f436D2a)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SuperchainConfig (0x95703e0982140D16f8ebA6d158FccEde42f04a4C)
    +++ description: Used to manage global configuration values for multiple OP Chains within a single Superchain network. The SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the Superchain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
```

```diff
+   Status: CREATED
    contract DelayedWETH (0x9AEA1FD851b63d57Ba4Fc556B0e0c170126C9EAf)
    +++ description: Contract designed to hold the bonded ETH for each game. It is designed as a wrapper around WETH to allow an owner to function as a backstop if a game would incorrectly distribute funds.
```

```diff
+   Status: CREATED
    contract OpFoundationOperationsSafe (0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A)
    +++ description: None
```

```diff
+   Status: CREATED
    contract PreimageOracle (0x9c065e11870B891D214Bc2Da7EF1f9DDFA1BE277)
    +++ description: The PreimageOracle contract is used to load the required data from L1 for a dispute game.
```

```diff
+   Status: CREATED
    contract L1CrossDomainMessenger (0x9CF951E3F74B644e621b36Ca9cea147a78D4c39f)
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
```

```diff
+   Status: CREATED
    contract AddressManager (0xB24bFEeCE1B3b7A44559F4Cbc21BeD312b130b70)
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
```

```diff
+   Status: CREATED
    contract OptimismMintableERC20Factory (0xc1047e30EFC9E172cFe7aa0219895B6a43fC415F)
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
```

```diff
+   Status: CREATED
    contract SecurityCouncilMultisig (0xc2819DC788505Aac350142A7A707BF9D03E3Bd03)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1OpUSDCBridgeAdapter (0xC67A8c5f22b40274Ca7C4A56Db89569Ee2AD3FAb)
    +++ description: Escrow for USDC that uses the canonical bridge for messaging but is governed externally.
```

```diff
+   Status: CREATED
    contract DeputyGuardianModule (0xc6901F65369FC59fC1B4D6D6bE7A2318Ff38dB5B)
    +++ description: allows the 0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A, called the deputy guardian, to act on behalf of the Gnosis Safe.
```

```diff
+   Status: CREATED
    contract Lib_AddressManager (0xdE1FCfB0851916CA5101820A69b13a4E276bd81F)
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
```

```diff
+   Status: CREATED
    contract L1StandardBridge (0xeb9bf100225c214Efc3E7C651ebbaDcF85177607)
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
```

