Generated with discovered.json: 0xea828b4017f00237c4450c27b0775baed43ff3d3

# Diff at Mon, 20 Oct 2025 15:26:02 GMT:

- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@bfe80e92f67656ee716f7ab40cc8f3f9e92dc7d6 block: 1759250569
- current timestamp: 1760973885

## Description

OpFoundation multisig member rotation.

## Watched changes

```diff
    contract OpFoundationUpgradeSafe (eth:0x847B5c174615B1B7fDF770882256e2D3E95b9D92) {
    +++ description: None
      values.$members.5:
-        "eth:0x7cB07FE039a92B3D784f284D919503A381BEC54f"
+        "eth:0x69acfE2096Dfb8d5A041eF37693553c48d9BFd02"
    }
```

Generated with discovered.json: 0xc8ae34ea301f01c93d448c8471675069b7302bf6

# Diff at Tue, 30 Sep 2025 16:43:54 GMT:

- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@c66a02d28b2467edd595f8a8468988549dd6d3cf block: 1755507657
- current timestamp: 1759250569

## Description

Period formatting change.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1755507657 (main branch discovery), not current.

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

Generated with discovered.json: 0xcfd93f1f3fe1538412c17d6e4a9794da86e72c0a

# Diff at Mon, 15 Sep 2025 09:50:25 GMT:

- author: Sergey Shemyakov (<sergey.shemyakov@l2beat.com>)
- comparing to: main@37882e40cb6029f3a2ae2bb177048e3e846b833d block: 1755507657
- current timestamp: 1755507657

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1755507657 (main branch discovery), not current.

```diff
    contract DisputeGameFactory (eth:0x0CF7D3706a27CCE2017aEB11E8a9c8b5388c282C) {
    +++ description: The dispute game factory allows the creation of dispute games, used to propose state roots and eventually challenge them.
+++ severity: HIGH
      values.gameImpls.2:
+        "eth:0x0000000000000000000000000000000000000000"
+++ severity: HIGH
      values.gameImpls.3:
+        "eth:0x0000000000000000000000000000000000000000"
    }
```

Generated with discovered.json: 0xb853df0d6f06f969596b2da922e2cee3ade17c84

# Diff at Mon, 01 Sep 2025 10:01:10 GMT:

Merge mark

Generated with discovered.json: 0x77ee470977d9222a8d5d4bc1a87663dc23d86ac0

# Diff at Mon, 18 Aug 2025 09:02:32 GMT:

- chain: ethereum
- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@0dd593b7eab607ddac1ba1df05212f23f79157e3 block: 1755157463
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

Generated with discovered.json: 0x1770a53928ac28479d73ffff0b80022fd2c0fbb6

# Diff at Thu, 14 Aug 2025 07:44:37 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@200c2747a4a049cdea3746f37927303721bc165b block: 1753681871
- current timestamp: 1755157463

## Description

Fee pricing update.

## Watched changes

```diff
    contract SystemConfig (0x05f23282FFDCA8286E4738C1aF79079f3d843750) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      values.basefeeScalar:
-        37110
+        127543
    }
```

Generated with discovered.json: 0x2a80b28a2389cdbae8bd6fc063a9a09620bba0c1

# Diff at Mon, 28 Jul 2025 05:51:30 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@8e540d8d4e2ea097e63a067c52194d1bf06f9b4a block: 22966962
- current block number: 23015671

## Description

Op stack gov upgrade: SuperchainConfig with pause expiry and DeputyPausModule. See optimism diffHistory for details.

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
    contract OpFoundationOperationsSafe (0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A)
    +++ description: None
```

```diff
-   Status: DELETED
    contract DeputyGuardianModule (0xc6901F65369FC59fC1B4D6D6bE7A2318Ff38dB5B)
    +++ description: allows the eth:0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A, called the deputy guardian, to act on behalf of the Gnosis Safe.
```

```diff
+   Status: CREATED
    contract DeputyPauseModule (0x76fC2F971FB355D0453cF9F64d3F9E4f640E1754)
    +++ description: Allows eth:0x352f1defB49718e7Ea411687E850aA8d6299F7aC, called the deputy pauser, to act on behalf of the eth:0x847B5c174615B1B7fDF770882256e2D3E95b9D92 if set as its Safe module.
```

## Source code changes

```diff
.../DeputyGuardianModule.sol => /dev/null          | 156 ----
 .../DeputyPauseModule.sol                          |  87 +-
 .../GnosisSafe.sol => /dev/null                    | 959 ---------------------
 .../Proxy.p.sol => /dev/null                       |  39 -
 .../SuperchainConfig/SuperchainConfig.sol          | 487 ++++++++---
 5 files changed, 395 insertions(+), 1333 deletions(-)
```

Generated with discovered.json: 0x024a275031f1b595dcb64c45b781b4dbcf439a9a

# Diff at Fri, 25 Jul 2025 13:51:50 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@85b717d6efe0c0a7691beb49532a0ce49bb7634a block: 22966962
- current block number: 22966962

## Description

templatize op upgrade 16 contracts

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22966962 (main branch discovery), not current.

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
      receivedPermissions.0.via.3.condition:
-        "though restricted to the global pause function"
+        "though restricted to the SuperchainConfig's `pause()` function"
      directlyReceivedPermissions.0.condition:
-        "though restricted to the global pause function"
+        "though restricted to the SuperchainConfig's `pause()` function"
    }
```

Generated with discovered.json: 0x480cdfa8a1b2c44ad80db11d9e87e67bc2573158

# Diff at Thu, 24 Jul 2025 16:48:24 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@a3f740c0fd51a5745c45d8f349ab01f4f33f7770 block: 22966962
- current block number: 22966962

## Description

set dispute game impl changes to high severity.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22966962 (main branch discovery), not current.

```diff
    contract DisputeGameFactory (0x0CF7D3706a27CCE2017aEB11E8a9c8b5388c282C) {
    +++ description: The dispute game factory allows the creation of dispute games, used to propose state roots and eventually challenge them.
      fieldMeta:
+        {"gameImpls":{"severity":"HIGH"},"game1337":{"severity":"HIGH"}}
    }
```

```diff
    contract OptimismPortal2 (0x26dB93F8b8b4f7016240af62F7730979d353f9A7) {
    +++ description: The OptimismPortal contract is the main entry point to deposit funds from L1 to L2. It also allows to prove and finalize withdrawals. It specifies which game type can be used for withdrawals, which currently is the PermissionedDisputeGame.
      fieldMeta.respectedGameType:
+        {"severity":"HIGH"}
    }
```

Generated with discovered.json: 0x7fa64ee7e7c44d5da93e9d41769356a4e1f34ae1

# Diff at Tue, 22 Jul 2025 14:09:31 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@d5d65d1883c757ae790bbd0a6f785c98310d2516 block: 22966962
- current block number: 22966962

## Description

Config: Kailua added to OptimismPortal2 and DisputeGameFactory.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22966962 (main branch discovery), not current.

```diff
    contract DisputeGameFactory (0x0CF7D3706a27CCE2017aEB11E8a9c8b5388c282C) {
    +++ description: The dispute game factory allows the creation of dispute games, used to propose state roots and eventually challenge them.
      values.game1337:
+        "eth:0x0000000000000000000000000000000000000000"
    }
```

```diff
    contract OptimismPortal2 (0x26dB93F8b8b4f7016240af62F7730979d353f9A7) {
    +++ description: The OptimismPortal contract is the main entry point to deposit funds from L1 to L2. It also allows to prove and finalize withdrawals. It specifies which game type can be used for withdrawals, which currently is the PermissionedDisputeGame.
      usedTypes.0.arg.1337:
+        "KailuaGame"
    }
```

Generated with discovered.json: 0x63cda7b773464ed272fd1da7d0a3b42bc9014ffb

# Diff at Mon, 21 Jul 2025 10:30:37 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@c89d5207a278197d1d4bfd60ac8e37852accba7c block: 22923591
- current block number: 22966962

## Description

standard op stack v3 upgrade (optiPortal 2) to permissioned fp game.

## Watched changes

```diff
    contract SystemConfig (0x05f23282FFDCA8286E4738C1aF79079f3d843750) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      sourceHashes.1:
-        "0xdf9a11b46747139bfe0135df8a65a2728a2dbd60a689e2398c45627915cdd752"
+        "0xc7135dbd2a53312d36df3f3ee91ce0a5a459ab8fc7725880a3a9c55a5fa0ed6c"
      values.$implementation:
-        "eth:0xc6cF1149d23F2788AC94312E68EB52a74F288ebe"
+        "eth:0xAB9d6cB7A427c0765163A7f45BB91cAfe5f2D375"
      values.$pastUpgrades.1:
+        ["2025-07-15T19:20:23.000Z","0x3786f23fa6b766eb330ab5b46bdcae3224c208c00b03405952e7743b5e13a89d",["eth:0xd81f43eDBCAcb4c29a9bA38a13Ee5d79278270cC"]]
      values.$pastUpgrades.2:
+        ["2025-07-15T19:20:23.000Z","0x3786f23fa6b766eb330ab5b46bdcae3224c208c00b03405952e7743b5e13a89d",["eth:0xAB9d6cB7A427c0765163A7f45BB91cAfe5f2D375"]]
      values.$upgradeCount:
-        1
+        3
      values.L2_OUTPUT_ORACLE_SLOT:
-        "0xe52a667f71ec761b9b381c7b76ca9b852adf7e8905da0e0ad49986a0a6871815"
      values.l2OutputOracle:
-        "eth:0x113cB99283AF242Da0A0C54347667edF531Aa7d6"
      values.version:
-        "1.12.0"
+        "2.3.0"
      values.basefeeScalar:
+        37110
      values.blobbasefeeScalar:
+        1201993
      values.DISPUTE_GAME_FACTORY_SLOT:
+        "0x52322a25d9f59ea17656545543306b7aef62bc0cc53a0e65ccfa0c75b97aa906"
      values.disputeGameFactory:
+        "eth:0x0CF7D3706a27CCE2017aEB11E8a9c8b5388c282C"
+++ description: volatility param: lower denominator -> quicker fee changes on L2
      values.eip1559Denominator:
+        0
      values.eip1559Elasticity:
+        0
      values.gasPayingToken:
+        {"addr_":"eth:0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE","decimals_":18}
      values.gasPayingTokenName:
+        "Ether"
      values.gasPayingTokenSymbol:
+        "ETH"
      values.isCustomGasToken:
+        false
      values.maximumGasLimit:
+        200000000
      implementationNames.eth:0xc6cF1149d23F2788AC94312E68EB52a74F288ebe:
-        "SystemConfig"
      implementationNames.eth:0xAB9d6cB7A427c0765163A7f45BB91cAfe5f2D375:
+        "SystemConfig"
    }
```

```diff
    EOA  (0x0AbD6da1cE10D1cD6c7C9C14b905786D20f3EB23) {
    +++ description: None
      receivedPermissions.0:
-        {"permission":"propose","from":"eth:0x113cB99283AF242Da0A0C54347667edF531Aa7d6","role":".proposer"}
      receivedPermissions.1.role:
-        ".PROPOSER"
+        ".proposer"
      receivedPermissions.1.from:
-        "eth:0x113cB99283AF242Da0A0C54347667edF531Aa7d6"
+        "eth:0x095102Ec7bea1c5f25090705b196a6EA2e6b64f6"
    }
```

```diff
-   Status: DELETED
    contract L2OutputOracle (0x113cB99283AF242Da0A0C54347667edF531Aa7d6)
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
```

```diff
    contract L1StandardBridge (0x2658723Bf70c7667De6B25F99fcce13A16D25d08) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      values.$implementation:
-        "eth:0x5BFC7acc740D2E19c290167052F69947e19475F3"
+        "eth:0x64B5a5Ed26DCb17370Ff4d33a8D503f0fbD06CfF"
      values.superchainConfig:
-        "eth:0x26C7bFB430d68Bf74d2d52497836d4336b555dE7"
+        "eth:0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
      implementationNames.eth:0x5BFC7acc740D2E19c290167052F69947e19475F3:
-        "L1StandardBridge"
      implementationNames.eth:0x64B5a5Ed26DCb17370Ff4d33a8D503f0fbD06CfF:
+        "L1StandardBridge"
    }
```

```diff
-   Status: DELETED
    contract SuperchainConfig (0x26C7bFB430d68Bf74d2d52497836d4336b555dE7)
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
```

```diff
    contract OptimismPortal2 (0x26dB93F8b8b4f7016240af62F7730979d353f9A7) {
    +++ description: The OptimismPortal contract is the main entry point to deposit funds from L1 to L2. It also allows to prove and finalize withdrawals. It specifies which game type can be used for withdrawals, which currently is the PermissionedDisputeGame.
      name:
-        "OptimismPortal"
+        "OptimismPortal2"
      template:
-        "opstack/OptimismPortal"
+        "opstack/OptimismPortal2"
      sourceHashes.1:
-        "0xe35fb7bc0433439337b3eadda3d6fb7991918162f62a337a695e8c7f948cdd35"
+        "0x41be46bdb67af1b7af90e1bd70a1fcd31a3352282beb83b846a5189675c37ac1"
      description:
-        "The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals."
+        "The OptimismPortal contract is the main entry point to deposit funds from L1 to L2. It also allows to prove and finalize withdrawals. It specifies which game type can be used for withdrawals, which currently is the PermissionedDisputeGame."
      values.$implementation:
-        "eth:0x3Ff11Cde41a5f7c791eFfcd6AeEA05dd2df5e21e"
+        "eth:0xe2F826324b2faf99E513D16D266c3F80aE87832B"
      values.$pastUpgrades.1:
+        ["2025-07-15T19:20:23.000Z","0x3786f23fa6b766eb330ab5b46bdcae3224c208c00b03405952e7743b5e13a89d",["eth:0xd81f43eDBCAcb4c29a9bA38a13Ee5d79278270cC"]]
      values.$pastUpgrades.2:
+        ["2025-07-15T19:20:23.000Z","0x3786f23fa6b766eb330ab5b46bdcae3224c208c00b03405952e7743b5e13a89d",["eth:0xe2F826324b2faf99E513D16D266c3F80aE87832B"]]
      values.$upgradeCount:
-        1
+        3
      values.guardian:
-        "eth:0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
+        "eth:0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2"
      values.GUARDIAN:
-        "eth:0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
      values.L2_ORACLE:
-        "eth:0x113cB99283AF242Da0A0C54347667edF531Aa7d6"
      values.l2Oracle:
-        "eth:0x113cB99283AF242Da0A0C54347667edF531Aa7d6"
      values.superchainConfig:
-        "eth:0x26C7bFB430d68Bf74d2d52497836d4336b555dE7"
+        "eth:0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
      values.SYSTEM_CONFIG:
-        "eth:0x05f23282FFDCA8286E4738C1aF79079f3d843750"
      values.version:
-        "2.5.0"
+        "3.10.0"
      values.disputeGameFactory:
+        "eth:0x0CF7D3706a27CCE2017aEB11E8a9c8b5388c282C"
      values.disputeGameFinalityDelaySeconds:
+        302400
      values.proofMaturityDelaySeconds:
+        604800
      values.RespectedGameString:
+        "PermissionedDisputeGame"
      values.respectedGameType:
+        1
      values.respectedGameTypeUpdatedAt:
+        1752607223
      implementationNames.eth:0x3Ff11Cde41a5f7c791eFfcd6AeEA05dd2df5e21e:
-        "OptimismPortal"
      implementationNames.eth:0xe2F826324b2faf99E513D16D266c3F80aE87832B:
+        "OptimismPortal2"
      fieldMeta:
+        {"paused":{"severity":"HIGH","description":"Whether the contract is paused or not. Determined by the SuperchainConfig contract PAUSED_SLOT. Here it pauses withdrawals. If this is paused, also the L1CrossDomainMessenger and ERC-20, ERC-721 deposits are paused."}}
      usedTypes:
+        [{"typeCaster":"Mapping","arg":{"0":"FaultDisputeGame","1":"PermissionedDisputeGame"}}]
    }
```

```diff
    contract L1CrossDomainMessenger (0x31B72D76FB666844C41EdF08dF0254875Dbb7edB) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      values.$implementation:
-        "eth:0x0318A37e2662507789a6E17E85A506709F89488b"
+        "eth:0xD3494713A5cfaD3F5359379DfA074E2Ac8C6Fd65"
      values.$pastUpgrades.1:
+        ["2025-07-15T19:20:23.000Z","0x3786f23fa6b766eb330ab5b46bdcae3224c208c00b03405952e7743b5e13a89d",["eth:0xd81f43eDBCAcb4c29a9bA38a13Ee5d79278270cC"]]
      values.$pastUpgrades.2:
+        ["2025-07-15T19:20:23.000Z","0x3786f23fa6b766eb330ab5b46bdcae3224c208c00b03405952e7743b5e13a89d",["eth:0xD3494713A5cfaD3F5359379DfA074E2Ac8C6Fd65"]]
      values.$upgradeCount:
-        1
+        3
      values.superchainConfig:
-        "eth:0x26C7bFB430d68Bf74d2d52497836d4336b555dE7"
+        "eth:0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
      implementationNames.eth:0x0318A37e2662507789a6E17E85A506709F89488b:
-        "L1CrossDomainMessenger"
      implementationNames.eth:0xD3494713A5cfaD3F5359379DfA074E2Ac8C6Fd65:
+        "L1CrossDomainMessenger"
    }
```

```diff
    contract L1ERC721Bridge (0x3A44A3b263FB631cdbf25f339e2D29497511A81f) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      values.$implementation:
-        "eth:0xefBDff012170ae592A3d197bf9Ac10eBF313233a"
+        "eth:0xAE2AF01232a6c4a4d3012C5eC5b1b35059caF10d"
      values.$pastUpgrades.1:
+        ["2025-07-15T19:20:23.000Z","0x3786f23fa6b766eb330ab5b46bdcae3224c208c00b03405952e7743b5e13a89d",["eth:0xd81f43eDBCAcb4c29a9bA38a13Ee5d79278270cC"]]
      values.$pastUpgrades.2:
+        ["2025-07-15T19:20:23.000Z","0x3786f23fa6b766eb330ab5b46bdcae3224c208c00b03405952e7743b5e13a89d",["eth:0xAE2AF01232a6c4a4d3012C5eC5b1b35059caF10d"]]
      values.$upgradeCount:
-        1
+        3
      values.superchainConfig:
-        "eth:0x26C7bFB430d68Bf74d2d52497836d4336b555dE7"
+        "eth:0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
      implementationNames.eth:0xefBDff012170ae592A3d197bf9Ac10eBF313233a:
-        "L1ERC721Bridge"
      implementationNames.eth:0xAE2AF01232a6c4a4d3012C5eC5b1b35059caF10d:
+        "L1ERC721Bridge"
    }
```

```diff
    contract Gelato Multisig (0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb) {
    +++ description: None
      receivedPermissions.0:
-        {"permission":"challenge","from":"eth:0x113cB99283AF242Da0A0C54347667edF531Aa7d6","role":".challenger"}
      receivedPermissions.1:
-        {"permission":"challenge","from":"eth:0x113cB99283AF242Da0A0C54347667edF531Aa7d6","role":".CHALLENGER"}
      receivedPermissions.2:
-        {"permission":"guard","from":"eth:0x26C7bFB430d68Bf74d2d52497836d4336b555dE7","role":".guardian"}
      receivedPermissions.3:
-        {"permission":"guard","from":"eth:0x26dB93F8b8b4f7016240af62F7730979d353f9A7","role":".guardian"}
      receivedPermissions.4.role:
-        ".GUARDIAN"
+        ".challenger"
      receivedPermissions.4.from:
-        "eth:0x26dB93F8b8b4f7016240af62F7730979d353f9A7"
+        "eth:0x095102Ec7bea1c5f25090705b196a6EA2e6b64f6"
      receivedPermissions.4.permission:
-        "guard"
+        "challenge"
      receivedPermissions.3:
+        {"permission":"interact","from":"eth:0x31eFC2c8012c56E007E5Bdb8E5B7955D197C168e","description":"can pull funds from the contract in case of emergency.","role":".owner","via":[{"address":"eth:0xECd4150ABbb1EBff13f74e42Fb43C3d78B4E0b45"}]}
      receivedPermissions.8.from:
-        "eth:0x113cB99283AF242Da0A0C54347667edF531Aa7d6"
+        "eth:0x0CF7D3706a27CCE2017aEB11E8a9c8b5388c282C"
      receivedPermissions.10:
-        {"permission":"upgrade","from":"eth:0x26C7bFB430d68Bf74d2d52497836d4336b555dE7","role":"admin","via":[{"address":"eth:0xeC432c4F1d0E12737f3a42a459B84848Af979b2d"},{"address":"eth:0xECd4150ABbb1EBff13f74e42Fb43C3d78B4E0b45"}]}
      receivedPermissions.9:
+        {"permission":"upgrade","from":"eth:0x31eFC2c8012c56E007E5Bdb8E5B7955D197C168e","role":"admin","via":[{"address":"eth:0xeC432c4F1d0E12737f3a42a459B84848Af979b2d"},{"address":"eth:0xECd4150ABbb1EBff13f74e42Fb43C3d78B4E0b45"}]}
      receivedPermissions.11:
+        {"permission":"upgrade","from":"eth:0x7ad0d165B9607960AD850090DDd7B9eB381D9c1e","role":"admin","via":[{"address":"eth:0xeC432c4F1d0E12737f3a42a459B84848Af979b2d"},{"address":"eth:0xECd4150ABbb1EBff13f74e42Fb43C3d78B4E0b45"}]}
    }
```

```diff
    contract OptimismMintableERC20Factory (0xc1dA06CC5DD5cE23bABa924463de7F762039252d) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintableERC20 as this chain's representation of a token on the host chain, or vice-versa.
      values.$implementation:
-        "eth:0xD00e38514d66bf1B761a8937559c6b2854A5B3ad"
+        "eth:0xE01efbeb1089D1d1dB9c6c8b135C934C0734c846"
      values.$pastUpgrades.1:
+        ["2025-07-15T19:20:23.000Z","0x3786f23fa6b766eb330ab5b46bdcae3224c208c00b03405952e7743b5e13a89d",["eth:0xE01efbeb1089D1d1dB9c6c8b135C934C0734c846"]]
      values.$upgradeCount:
-        1
+        2
      implementationNames.eth:0xD00e38514d66bf1B761a8937559c6b2854A5B3ad:
-        "OptimismMintableERC20Factory"
      implementationNames.eth:0xE01efbeb1089D1d1dB9c6c8b135C934C0734c846:
+        "OptimismMintableERC20Factory"
    }
```

```diff
    contract ProxyAdmin (0xeC432c4F1d0E12737f3a42a459B84848Af979b2d) {
    +++ description: None
      directlyReceivedPermissions.2.from:
-        "eth:0x113cB99283AF242Da0A0C54347667edF531Aa7d6"
+        "eth:0x0CF7D3706a27CCE2017aEB11E8a9c8b5388c282C"
      directlyReceivedPermissions.4:
-        {"permission":"upgrade","from":"eth:0x26C7bFB430d68Bf74d2d52497836d4336b555dE7","role":"admin"}
      directlyReceivedPermissions.6:
+        {"permission":"upgrade","from":"eth:0x31eFC2c8012c56E007E5Bdb8E5B7955D197C168e","role":"admin"}
      directlyReceivedPermissions.8:
+        {"permission":"upgrade","from":"eth:0x7ad0d165B9607960AD850090DDd7B9eB381D9c1e","role":"admin"}
    }
```

```diff
    contract Lisk Multisig (0xECd4150ABbb1EBff13f74e42Fb43C3d78B4E0b45) {
    +++ description: None
      directlyReceivedPermissions.1:
+        {"permission":"interact","from":"eth:0x31eFC2c8012c56E007E5Bdb8E5B7955D197C168e","description":"can pull funds from the contract in case of emergency.","role":".owner"}
    }
```

```diff
+   Status: CREATED
    contract LivenessModule (0x0454092516c9A4d636d3CAfA1e82161376C8a748)
    +++ description: used to remove members inactive for 98d while making sure that the threshold remains above 75%. If the number of members falls below 8, the eth:0x847B5c174615B1B7fDF770882256e2D3E95b9D92 takes ownership of the multisig
```

```diff
+   Status: CREATED
    contract PermissionedDisputeGame (0x095102Ec7bea1c5f25090705b196a6EA2e6b64f6)
    +++ description: Same as FaultDisputeGame, but only two permissioned addresses are designated as proposer and challenger.
```

```diff
+   Status: CREATED
    contract Optimism Guardian Multisig (0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2)
    +++ description: None
```

```diff
+   Status: CREATED
    contract DisputeGameFactory (0x0CF7D3706a27CCE2017aEB11E8a9c8b5388c282C)
    +++ description: The dispute game factory allows the creation of dispute games, used to propose state roots and eventually challenge them.
```

```diff
+   Status: CREATED
    contract DeputyPauseModule (0x126a736B18E0a64fBA19D421647A530E327E112C)
    +++ description: Allows eth:0x352f1defB49718e7Ea411687E850aA8d6299F7aC, called the deputy pauser, to act on behalf of the eth:0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A if set as its Safe module.
```

```diff
+   Status: CREATED
    contract LivenessGuard (0x24424336F04440b1c28685a38303aC33C9D14a25)
    +++ description: None
```

```diff
+   Status: CREATED
    contract DelayedWETH (0x31eFC2c8012c56E007E5Bdb8E5B7955D197C168e)
    +++ description: Contract designed to hold the bonded ETH for each game. It is designed as a wrapper around WETH to allow an owner to function as a backstop if a game would incorrectly distribute funds.
```

```diff
+   Status: CREATED
    contract GnosisSafe (0x42d27eEA1AD6e22Af6284F609847CB3Cd56B9c64)
    +++ description: None
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
    contract MIPS (0x5fE03a12C1236F9C22Cb6479778DDAa4bce6299C)
    +++ description: The MIPS contract is used to execute the final step of the dispute game which objectively determines the winner of the dispute.
```

```diff
+   Status: CREATED
    contract AnchorStateRegistry (0x7ad0d165B9607960AD850090DDd7B9eB381D9c1e)
    +++ description: Contains the latest confirmed state root that can be used as a starting point in a dispute game.
```

```diff
+   Status: CREATED
    contract OpFoundationUpgradeSafe (0x847B5c174615B1B7fDF770882256e2D3E95b9D92)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SuperchainConfig (0x95703e0982140D16f8ebA6d158FccEde42f04a4C)
    +++ description: Used to manage global configuration values for multiple OP Chains within a single Superchain network. The SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the Superchain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
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

## Source code changes

```diff
...0x2dF7057d3F25212E51aFEA8dA628668229Ea423f.sol} |    0
 ...:0xdE1FCfB0851916CA5101820A69b13a4E276bd81F.sol |  152 +
 .../AnchorStateRegistry/AnchorStateRegistry.sol    |  448 +++
 .../AnchorStateRegistry}/Proxy.p.sol               |    0
 .../ethereum/.flat/DelayedWETH/DelayedWETH.sol     |  651 ++++
 .../DelayedWETH}/Proxy.p.sol                       |    0
 .../lisk/ethereum/.flat/DeputyGuardianModule.sol   |  156 +
 .../lisk/ethereum/.flat/DeputyPauseModule.sol      | 1338 +++++++
 .../DisputeGameFactory/DisputeGameFactory.sol      | 1550 ++++++++
 .../ethereum/.flat/DisputeGameFactory/Proxy.p.sol  |  200 +
 .../lisk/ethereum/.flat/GnosisSafe/GnosisSafe.sol  |  953 +++++
 .../.flat/GnosisSafe/GnosisSafeProxy.p.sol         |   35 +
 .../L2OutputOracle/L2OutputOracle.sol => /dev/null |  679 ----
 .../projects/lisk/ethereum/.flat/LivenessGuard.sol |  582 +++
 .../lisk/ethereum/.flat/LivenessModule.sol         |  258 ++
 .../src/projects/lisk/ethereum/.flat/MIPS.sol      | 1717 +++++++++
 .../OpFoundationOperationsSafe/GnosisSafe.sol      |  959 +++++
 .../.flat/OpFoundationOperationsSafe/Proxy.p.sol   |   39 +
 .../.flat/OpFoundationUpgradeSafe/GnosisSafe.sol   |  953 +++++
 .../OpFoundationUpgradeSafe/GnosisSafeProxy.p.sol  |   35 +
 .../Optimism Guardian Multisig/GnosisSafe.sol      |  953 +++++
 .../GnosisSafeProxy.p.sol                          |   35 +
 .../.flat/Optimism Security Council/GnosisSafe.sol |  953 +++++
 .../GnosisSafeProxy.p.sol                          |   35 +
 .../OptimismPortal2/OptimismPortal2.sol}           |  512 ++-
 .../ethereum/.flat/OptimismPortal2/Proxy.p.sol     |  200 +
 .../ethereum/.flat/PermissionedDisputeGame.sol     | 4036 ++++++++++++++++++++
 .../lisk/ethereum/.flat/PreimageOracle.sol         | 1353 +++++++
 .../SuperchainConfig/SuperchainConfig.sol          |    8 +-
 .../lisk/ethereum/.flat/SuperchainProxyAdmin.sol   |  298 ++
 .../.flat/SuperchainProxyAdminOwner/GnosisSafe.sol |  953 +++++
 .../GnosisSafeProxy.p.sol                          |   35 +
 .../SystemConfig/SystemConfig.sol                  | 1502 +++++++-
 33 files changed, 20667 insertions(+), 911 deletions(-)
```

Generated with discovered.json: 0xc01ca22d9cd792a0e1fc0e653856f69e777fc476

# Diff at Tue, 15 Jul 2025 09:09:26 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@fe7c3b2343ca7836e6a947e456ab91a6f0f6f592 block: 22624983
- current block number: 22923591

## Description

Gelato MS: one signer removed, one changed.

## Watched changes

```diff
    contract Gelato Multisig (0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb) {
    +++ description: None
      values.$members.2:
-        "eth:0xB0C2CBFfCd4C31AFFEe14993b6d48f99D285f621"
+        "eth:0x58edE8C66A15f23c61b8EadD1191FdaD904f7a87"
      values.$members.8:
-        "eth:0xf83bC4688979b13Da02CB94c76cEB169540760b5"
      values.multisigThreshold:
-        "4 of 10 (40%)"
+        "4 of 9 (44%)"
    }
```

Generated with discovered.json: 0xe4219fead1ad6479198f2d0d8b1a35cc6da7391c

# Diff at Mon, 14 Jul 2025 12:45:19 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@9f4300dad2f3d080cd56fa311d4a848556c74e72 block: 22624983
- current block number: 22624983

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22624983 (main branch discovery), not current.

```diff
    EOA  (0x000000000000000000000000000000000000dEaD) {
    +++ description: None
      address:
-        "0x000000000000000000000000000000000000dEaD"
+        "eth:0x000000000000000000000000000000000000dEaD"
    }
```

```diff
    EOA  (0x01a0A7BaAAca31AFB5b770FeFD69CE4917D9c32e) {
    +++ description: None
      address:
-        "0x01a0A7BaAAca31AFB5b770FeFD69CE4917D9c32e"
+        "eth:0x01a0A7BaAAca31AFB5b770FeFD69CE4917D9c32e"
    }
```

```diff
    contract SystemConfig (0x05f23282FFDCA8286E4738C1aF79079f3d843750) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      address:
-        "0x05f23282FFDCA8286E4738C1aF79079f3d843750"
+        "eth:0x05f23282FFDCA8286E4738C1aF79079f3d843750"
      values.$admin:
-        "0xeC432c4F1d0E12737f3a42a459B84848Af979b2d"
+        "eth:0xeC432c4F1d0E12737f3a42a459B84848Af979b2d"
      values.$implementation:
-        "0xc6cF1149d23F2788AC94312E68EB52a74F288ebe"
+        "eth:0xc6cF1149d23F2788AC94312E68EB52a74F288ebe"
      values.$pastUpgrades.0.2.0:
-        "0xc6cF1149d23F2788AC94312E68EB52a74F288ebe"
+        "eth:0xc6cF1149d23F2788AC94312E68EB52a74F288ebe"
      values.batcherHash:
-        "0xa6Ea2f3299b63c53143c993d2d5E60A69Cd6Fe24"
+        "eth:0xa6Ea2f3299b63c53143c993d2d5E60A69Cd6Fe24"
      values.batchInbox:
-        "0xFf00000000000000000000000000000000001135"
+        "eth:0xFf00000000000000000000000000000000001135"
      values.l1CrossDomainMessenger:
-        "0x31B72D76FB666844C41EdF08dF0254875Dbb7edB"
+        "eth:0x31B72D76FB666844C41EdF08dF0254875Dbb7edB"
      values.l1ERC721Bridge:
-        "0x3A44A3b263FB631cdbf25f339e2D29497511A81f"
+        "eth:0x3A44A3b263FB631cdbf25f339e2D29497511A81f"
      values.l1StandardBridge:
-        "0x2658723Bf70c7667De6B25F99fcce13A16D25d08"
+        "eth:0x2658723Bf70c7667De6B25F99fcce13A16D25d08"
      values.l2OutputOracle:
-        "0x113cB99283AF242Da0A0C54347667edF531Aa7d6"
+        "eth:0x113cB99283AF242Da0A0C54347667edF531Aa7d6"
      values.optimismMintableERC20Factory:
-        "0xc1dA06CC5DD5cE23bABa924463de7F762039252d"
+        "eth:0xc1dA06CC5DD5cE23bABa924463de7F762039252d"
      values.optimismPortal:
-        "0x26dB93F8b8b4f7016240af62F7730979d353f9A7"
+        "eth:0x26dB93F8b8b4f7016240af62F7730979d353f9A7"
      values.owner:
-        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
+        "eth:0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
      values.sequencerInbox:
-        "0xFf00000000000000000000000000000000001135"
+        "eth:0xFf00000000000000000000000000000000001135"
      values.unsafeBlockSigner:
-        "0xb9DE90a90c5E441C483e754FE7341100D5fbaEcA"
+        "eth:0xb9DE90a90c5E441C483e754FE7341100D5fbaEcA"
      implementationNames.0x05f23282FFDCA8286E4738C1aF79079f3d843750:
-        "Proxy"
      implementationNames.0xc6cF1149d23F2788AC94312E68EB52a74F288ebe:
-        "SystemConfig"
      implementationNames.eth:0x05f23282FFDCA8286E4738C1aF79079f3d843750:
+        "Proxy"
      implementationNames.eth:0xc6cF1149d23F2788AC94312E68EB52a74F288ebe:
+        "SystemConfig"
    }
```

```diff
    EOA  (0x0AbD6da1cE10D1cD6c7C9C14b905786D20f3EB23) {
    +++ description: None
      address:
-        "0x0AbD6da1cE10D1cD6c7C9C14b905786D20f3EB23"
+        "eth:0x0AbD6da1cE10D1cD6c7C9C14b905786D20f3EB23"
    }
```

```diff
    contract L2OutputOracle (0x113cB99283AF242Da0A0C54347667edF531Aa7d6) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      address:
-        "0x113cB99283AF242Da0A0C54347667edF531Aa7d6"
+        "eth:0x113cB99283AF242Da0A0C54347667edF531Aa7d6"
      values.$admin:
-        "0xeC432c4F1d0E12737f3a42a459B84848Af979b2d"
+        "eth:0xeC432c4F1d0E12737f3a42a459B84848Af979b2d"
      values.$implementation:
-        "0xe8912070277Dd5D9473904b7F4e6C71290F2AE90"
+        "eth:0xe8912070277Dd5D9473904b7F4e6C71290F2AE90"
      values.$pastUpgrades.0.2.0:
-        "0xe8912070277Dd5D9473904b7F4e6C71290F2AE90"
+        "eth:0xe8912070277Dd5D9473904b7F4e6C71290F2AE90"
      values.$pastUpgrades.1.2.0:
-        "0x4a8515A656BF683cCdabc27C25610223033b594e"
+        "eth:0x4a8515A656BF683cCdabc27C25610223033b594e"
      values.$pastUpgrades.2.2.0:
-        "0xe8912070277Dd5D9473904b7F4e6C71290F2AE90"
+        "eth:0xe8912070277Dd5D9473904b7F4e6C71290F2AE90"
+++ severity: HIGH
      values.challenger:
-        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
+        "eth:0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
      values.CHALLENGER:
-        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
+        "eth:0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
+++ severity: HIGH
      values.proposer:
-        "0x0AbD6da1cE10D1cD6c7C9C14b905786D20f3EB23"
+        "eth:0x0AbD6da1cE10D1cD6c7C9C14b905786D20f3EB23"
      values.PROPOSER:
-        "0x0AbD6da1cE10D1cD6c7C9C14b905786D20f3EB23"
+        "eth:0x0AbD6da1cE10D1cD6c7C9C14b905786D20f3EB23"
      implementationNames.0x113cB99283AF242Da0A0C54347667edF531Aa7d6:
-        "Proxy"
      implementationNames.0xe8912070277Dd5D9473904b7F4e6C71290F2AE90:
-        "L2OutputOracle"
      implementationNames.eth:0x113cB99283AF242Da0A0C54347667edF531Aa7d6:
+        "Proxy"
      implementationNames.eth:0xe8912070277Dd5D9473904b7F4e6C71290F2AE90:
+        "L2OutputOracle"
    }
```

```diff
    contract L1StandardBridge (0x2658723Bf70c7667De6B25F99fcce13A16D25d08) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      address:
-        "0x2658723Bf70c7667De6B25F99fcce13A16D25d08"
+        "eth:0x2658723Bf70c7667De6B25F99fcce13A16D25d08"
      values.$admin:
-        "0xeC432c4F1d0E12737f3a42a459B84848Af979b2d"
+        "eth:0xeC432c4F1d0E12737f3a42a459B84848Af979b2d"
      values.$implementation:
-        "0x5BFC7acc740D2E19c290167052F69947e19475F3"
+        "eth:0x5BFC7acc740D2E19c290167052F69947e19475F3"
      values.l2TokenBridge:
-        "0x4200000000000000000000000000000000000010"
+        "eth:0x4200000000000000000000000000000000000010"
      values.messenger:
-        "0x31B72D76FB666844C41EdF08dF0254875Dbb7edB"
+        "eth:0x31B72D76FB666844C41EdF08dF0254875Dbb7edB"
      values.MESSENGER:
-        "0x31B72D76FB666844C41EdF08dF0254875Dbb7edB"
+        "eth:0x31B72D76FB666844C41EdF08dF0254875Dbb7edB"
      values.OTHER_BRIDGE:
-        "0x4200000000000000000000000000000000000010"
+        "eth:0x4200000000000000000000000000000000000010"
      values.otherBridge:
-        "0x4200000000000000000000000000000000000010"
+        "eth:0x4200000000000000000000000000000000000010"
      values.superchainConfig:
-        "0x26C7bFB430d68Bf74d2d52497836d4336b555dE7"
+        "eth:0x26C7bFB430d68Bf74d2d52497836d4336b555dE7"
      implementationNames.0x2658723Bf70c7667De6B25F99fcce13A16D25d08:
-        "L1ChugSplashProxy"
      implementationNames.0x5BFC7acc740D2E19c290167052F69947e19475F3:
-        "L1StandardBridge"
      implementationNames.eth:0x2658723Bf70c7667De6B25F99fcce13A16D25d08:
+        "L1ChugSplashProxy"
      implementationNames.eth:0x5BFC7acc740D2E19c290167052F69947e19475F3:
+        "L1StandardBridge"
    }
```

```diff
    contract SuperchainConfig (0x26C7bFB430d68Bf74d2d52497836d4336b555dE7) {
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      address:
-        "0x26C7bFB430d68Bf74d2d52497836d4336b555dE7"
+        "eth:0x26C7bFB430d68Bf74d2d52497836d4336b555dE7"
      values.$admin:
-        "0xeC432c4F1d0E12737f3a42a459B84848Af979b2d"
+        "eth:0xeC432c4F1d0E12737f3a42a459B84848Af979b2d"
      values.$implementation:
-        "0xd637dc6d7DA9151b5069a4bFB74a12E67a532CC3"
+        "eth:0xd637dc6d7DA9151b5069a4bFB74a12E67a532CC3"
      values.$pastUpgrades.0.2.0:
-        "0xd637dc6d7DA9151b5069a4bFB74a12E67a532CC3"
+        "eth:0xd637dc6d7DA9151b5069a4bFB74a12E67a532CC3"
      values.$pastUpgrades.1.2.0:
-        "0x4a8515A656BF683cCdabc27C25610223033b594e"
+        "eth:0x4a8515A656BF683cCdabc27C25610223033b594e"
      values.$pastUpgrades.2.2.0:
-        "0xd637dc6d7DA9151b5069a4bFB74a12E67a532CC3"
+        "eth:0xd637dc6d7DA9151b5069a4bFB74a12E67a532CC3"
      values.guardian:
-        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
+        "eth:0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
      implementationNames.0x26C7bFB430d68Bf74d2d52497836d4336b555dE7:
-        "Proxy"
      implementationNames.0xd637dc6d7DA9151b5069a4bFB74a12E67a532CC3:
-        "SuperchainConfig"
      implementationNames.eth:0x26C7bFB430d68Bf74d2d52497836d4336b555dE7:
+        "Proxy"
      implementationNames.eth:0xd637dc6d7DA9151b5069a4bFB74a12E67a532CC3:
+        "SuperchainConfig"
    }
```

```diff
    contract OptimismPortal (0x26dB93F8b8b4f7016240af62F7730979d353f9A7) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      address:
-        "0x26dB93F8b8b4f7016240af62F7730979d353f9A7"
+        "eth:0x26dB93F8b8b4f7016240af62F7730979d353f9A7"
      values.$admin:
-        "0xeC432c4F1d0E12737f3a42a459B84848Af979b2d"
+        "eth:0xeC432c4F1d0E12737f3a42a459B84848Af979b2d"
      values.$implementation:
-        "0x3Ff11Cde41a5f7c791eFfcd6AeEA05dd2df5e21e"
+        "eth:0x3Ff11Cde41a5f7c791eFfcd6AeEA05dd2df5e21e"
      values.$pastUpgrades.0.2.0:
-        "0x3Ff11Cde41a5f7c791eFfcd6AeEA05dd2df5e21e"
+        "eth:0x3Ff11Cde41a5f7c791eFfcd6AeEA05dd2df5e21e"
      values.guardian:
-        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
+        "eth:0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
      values.GUARDIAN:
-        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
+        "eth:0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
      values.L2_ORACLE:
-        "0x113cB99283AF242Da0A0C54347667edF531Aa7d6"
+        "eth:0x113cB99283AF242Da0A0C54347667edF531Aa7d6"
      values.l2Oracle:
-        "0x113cB99283AF242Da0A0C54347667edF531Aa7d6"
+        "eth:0x113cB99283AF242Da0A0C54347667edF531Aa7d6"
      values.l2Sender:
-        "0x000000000000000000000000000000000000dEaD"
+        "eth:0x000000000000000000000000000000000000dEaD"
      values.superchainConfig:
-        "0x26C7bFB430d68Bf74d2d52497836d4336b555dE7"
+        "eth:0x26C7bFB430d68Bf74d2d52497836d4336b555dE7"
      values.SYSTEM_CONFIG:
-        "0x05f23282FFDCA8286E4738C1aF79079f3d843750"
+        "eth:0x05f23282FFDCA8286E4738C1aF79079f3d843750"
      values.systemConfig:
-        "0x05f23282FFDCA8286E4738C1aF79079f3d843750"
+        "eth:0x05f23282FFDCA8286E4738C1aF79079f3d843750"
      implementationNames.0x26dB93F8b8b4f7016240af62F7730979d353f9A7:
-        "Proxy"
      implementationNames.0x3Ff11Cde41a5f7c791eFfcd6AeEA05dd2df5e21e:
-        "OptimismPortal"
      implementationNames.eth:0x26dB93F8b8b4f7016240af62F7730979d353f9A7:
+        "Proxy"
      implementationNames.eth:0x3Ff11Cde41a5f7c791eFfcd6AeEA05dd2df5e21e:
+        "OptimismPortal"
    }
```

```diff
    EOA  (0x28bB9385A588EF4747264D19B9A9F1603591680c) {
    +++ description: None
      address:
-        "0x28bB9385A588EF4747264D19B9A9F1603591680c"
+        "eth:0x28bB9385A588EF4747264D19B9A9F1603591680c"
    }
```

```diff
    contract AddressManager (0x2dF7057d3F25212E51aFEA8dA628668229Ea423f) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      address:
-        "0x2dF7057d3F25212E51aFEA8dA628668229Ea423f"
+        "eth:0x2dF7057d3F25212E51aFEA8dA628668229Ea423f"
      values.owner:
-        "0xeC432c4F1d0E12737f3a42a459B84848Af979b2d"
+        "eth:0xeC432c4F1d0E12737f3a42a459B84848Af979b2d"
      implementationNames.0x2dF7057d3F25212E51aFEA8dA628668229Ea423f:
-        "AddressManager"
      implementationNames.eth:0x2dF7057d3F25212E51aFEA8dA628668229Ea423f:
+        "AddressManager"
    }
```

```diff
    contract L1CrossDomainMessenger (0x31B72D76FB666844C41EdF08dF0254875Dbb7edB) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      address:
-        "0x31B72D76FB666844C41EdF08dF0254875Dbb7edB"
+        "eth:0x31B72D76FB666844C41EdF08dF0254875Dbb7edB"
      values.$admin:
-        "0xeC432c4F1d0E12737f3a42a459B84848Af979b2d"
+        "eth:0xeC432c4F1d0E12737f3a42a459B84848Af979b2d"
      values.$implementation:
-        "0x0318A37e2662507789a6E17E85A506709F89488b"
+        "eth:0x0318A37e2662507789a6E17E85A506709F89488b"
      values.$pastUpgrades.0.2.0:
-        "0x0318A37e2662507789a6E17E85A506709F89488b"
+        "eth:0x0318A37e2662507789a6E17E85A506709F89488b"
      values.OTHER_MESSENGER:
-        "0x4200000000000000000000000000000000000007"
+        "eth:0x4200000000000000000000000000000000000007"
      values.otherMessenger:
-        "0x4200000000000000000000000000000000000007"
+        "eth:0x4200000000000000000000000000000000000007"
      values.portal:
-        "0x26dB93F8b8b4f7016240af62F7730979d353f9A7"
+        "eth:0x26dB93F8b8b4f7016240af62F7730979d353f9A7"
      values.PORTAL:
-        "0x26dB93F8b8b4f7016240af62F7730979d353f9A7"
+        "eth:0x26dB93F8b8b4f7016240af62F7730979d353f9A7"
      values.ResolvedDelegateProxy_addressManager:
-        "0x2dF7057d3F25212E51aFEA8dA628668229Ea423f"
+        "eth:0x2dF7057d3F25212E51aFEA8dA628668229Ea423f"
      values.superchainConfig:
-        "0x26C7bFB430d68Bf74d2d52497836d4336b555dE7"
+        "eth:0x26C7bFB430d68Bf74d2d52497836d4336b555dE7"
      implementationNames.0x31B72D76FB666844C41EdF08dF0254875Dbb7edB:
-        "ResolvedDelegateProxy"
      implementationNames.0x0318A37e2662507789a6E17E85A506709F89488b:
-        "L1CrossDomainMessenger"
      implementationNames.eth:0x31B72D76FB666844C41EdF08dF0254875Dbb7edB:
+        "ResolvedDelegateProxy"
      implementationNames.eth:0x0318A37e2662507789a6E17E85A506709F89488b:
+        "L1CrossDomainMessenger"
    }
```

```diff
    EOA  (0x349f3839012DB2271e1BeC68F1668471D175Adb9) {
    +++ description: None
      address:
-        "0x349f3839012DB2271e1BeC68F1668471D175Adb9"
+        "eth:0x349f3839012DB2271e1BeC68F1668471D175Adb9"
    }
```

```diff
    contract L1ERC721Bridge (0x3A44A3b263FB631cdbf25f339e2D29497511A81f) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      address:
-        "0x3A44A3b263FB631cdbf25f339e2D29497511A81f"
+        "eth:0x3A44A3b263FB631cdbf25f339e2D29497511A81f"
      values.$admin:
-        "0xeC432c4F1d0E12737f3a42a459B84848Af979b2d"
+        "eth:0xeC432c4F1d0E12737f3a42a459B84848Af979b2d"
      values.$implementation:
-        "0xefBDff012170ae592A3d197bf9Ac10eBF313233a"
+        "eth:0xefBDff012170ae592A3d197bf9Ac10eBF313233a"
      values.$pastUpgrades.0.2.0:
-        "0xefBDff012170ae592A3d197bf9Ac10eBF313233a"
+        "eth:0xefBDff012170ae592A3d197bf9Ac10eBF313233a"
      values.messenger:
-        "0x31B72D76FB666844C41EdF08dF0254875Dbb7edB"
+        "eth:0x31B72D76FB666844C41EdF08dF0254875Dbb7edB"
      values.MESSENGER:
-        "0x31B72D76FB666844C41EdF08dF0254875Dbb7edB"
+        "eth:0x31B72D76FB666844C41EdF08dF0254875Dbb7edB"
      values.OTHER_BRIDGE:
-        "0x4200000000000000000000000000000000000014"
+        "eth:0x4200000000000000000000000000000000000014"
      values.otherBridge:
-        "0x4200000000000000000000000000000000000014"
+        "eth:0x4200000000000000000000000000000000000014"
      values.superchainConfig:
-        "0x26C7bFB430d68Bf74d2d52497836d4336b555dE7"
+        "eth:0x26C7bFB430d68Bf74d2d52497836d4336b555dE7"
      implementationNames.0x3A44A3b263FB631cdbf25f339e2D29497511A81f:
-        "Proxy"
      implementationNames.0xefBDff012170ae592A3d197bf9Ac10eBF313233a:
-        "L1ERC721Bridge"
      implementationNames.eth:0x3A44A3b263FB631cdbf25f339e2D29497511A81f:
+        "Proxy"
      implementationNames.eth:0xefBDff012170ae592A3d197bf9Ac10eBF313233a:
+        "L1ERC721Bridge"
    }
```

```diff
    EOA  (0x547D0F472309e4239b296D01e03bEDc101241a26) {
    +++ description: None
      address:
-        "0x547D0F472309e4239b296D01e03bEDc101241a26"
+        "eth:0x547D0F472309e4239b296D01e03bEDc101241a26"
    }
```

```diff
    EOA  (0x5bE3E96Cdc3A97628bD7308d3588B9a474F4A54d) {
    +++ description: None
      address:
-        "0x5bE3E96Cdc3A97628bD7308d3588B9a474F4A54d"
+        "eth:0x5bE3E96Cdc3A97628bD7308d3588B9a474F4A54d"
    }
```

```diff
    EOA  (0x691C2EF68e25E620fa6cAdE2728f6aE34F37aAD2) {
    +++ description: None
      address:
-        "0x691C2EF68e25E620fa6cAdE2728f6aE34F37aAD2"
+        "eth:0x691C2EF68e25E620fa6cAdE2728f6aE34F37aAD2"
    }
```

```diff
    EOA  (0x88De44422E1b1c30bc530c35aEdb9f5aD0e6fD52) {
    +++ description: None
      address:
-        "0x88De44422E1b1c30bc530c35aEdb9f5aD0e6fD52"
+        "eth:0x88De44422E1b1c30bc530c35aEdb9f5aD0e6fD52"
    }
```

```diff
    contract L1ERC20TokenBridge (0x9348AF23B01F2B517AFE8f29B3183d2Bb7d69Fcf) {
    +++ description: Escrow for custom external tokens that use the canonical bridge for messaging but are governed externally.
      address:
-        "0x9348AF23B01F2B517AFE8f29B3183d2Bb7d69Fcf"
+        "eth:0x9348AF23B01F2B517AFE8f29B3183d2Bb7d69Fcf"
      values.$admin:
-        "0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c"
+        "eth:0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c"
      values.$implementation:
-        "0xC7315f4FaaB2F700fc6b4704BB801c46ff6327AC"
+        "eth:0xC7315f4FaaB2F700fc6b4704BB801c46ff6327AC"
      values.$pastUpgrades.0.2.0:
-        "0xC7315f4FaaB2F700fc6b4704BB801c46ff6327AC"
+        "eth:0xC7315f4FaaB2F700fc6b4704BB801c46ff6327AC"
      values.l1Token:
-        "0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0"
+        "eth:0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0"
      values.l2Token:
-        "0x76D8de471F54aAA87784119c60Df1bbFc852C415"
+        "eth:0x76D8de471F54aAA87784119c60Df1bbFc852C415"
      values.l2TokenBridge:
-        "0xca498Ee83eD3546321d4DC25e2789B0624F15f68"
+        "eth:0xca498Ee83eD3546321d4DC25e2789B0624F15f68"
      values.messenger:
-        "0x31B72D76FB666844C41EdF08dF0254875Dbb7edB"
+        "eth:0x31B72D76FB666844C41EdF08dF0254875Dbb7edB"
      values.proxy__getAdmin:
-        "0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c"
+        "eth:0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c"
      values.proxy__getImplementation:
-        "0xC7315f4FaaB2F700fc6b4704BB801c46ff6327AC"
+        "eth:0xC7315f4FaaB2F700fc6b4704BB801c46ff6327AC"
      implementationNames.0x9348AF23B01F2B517AFE8f29B3183d2Bb7d69Fcf:
-        "OssifiableProxy"
      implementationNames.0xC7315f4FaaB2F700fc6b4704BB801c46ff6327AC:
-        "L1ERC20TokenBridge"
      implementationNames.eth:0x9348AF23B01F2B517AFE8f29B3183d2Bb7d69Fcf:
+        "OssifiableProxy"
      implementationNames.eth:0xC7315f4FaaB2F700fc6b4704BB801c46ff6327AC:
+        "L1ERC20TokenBridge"
    }
```

```diff
    EOA  (0xa6Ea2f3299b63c53143c993d2d5E60A69Cd6Fe24) {
    +++ description: None
      address:
-        "0xa6Ea2f3299b63c53143c993d2d5E60A69Cd6Fe24"
+        "eth:0xa6Ea2f3299b63c53143c993d2d5E60A69Cd6Fe24"
    }
```

```diff
    EOA  (0xB0C2CBFfCd4C31AFFEe14993b6d48f99D285f621) {
    +++ description: None
      address:
-        "0xB0C2CBFfCd4C31AFFEe14993b6d48f99D285f621"
+        "eth:0xB0C2CBFfCd4C31AFFEe14993b6d48f99D285f621"
    }
```

```diff
    EOA  (0xB65540bBA534E88EB4a5062D0E6519C07063b259) {
    +++ description: None
      address:
-        "0xB65540bBA534E88EB4a5062D0E6519C07063b259"
+        "eth:0xB65540bBA534E88EB4a5062D0E6519C07063b259"
    }
```

```diff
    EOA  (0xb9DE90a90c5E441C483e754FE7341100D5fbaEcA) {
    +++ description: None
      address:
-        "0xb9DE90a90c5E441C483e754FE7341100D5fbaEcA"
+        "eth:0xb9DE90a90c5E441C483e754FE7341100D5fbaEcA"
    }
```

```diff
    contract Gelato Multisig (0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb) {
    +++ description: None
      address:
-        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
+        "eth:0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
      values.$implementation:
-        "0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
+        "eth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
      values.$members.0:
-        "0x349f3839012DB2271e1BeC68F1668471D175Adb9"
+        "eth:0x349f3839012DB2271e1BeC68F1668471D175Adb9"
      values.$members.1:
-        "0xB65540bBA534E88EB4a5062D0E6519C07063b259"
+        "eth:0xB65540bBA534E88EB4a5062D0E6519C07063b259"
      values.$members.2:
-        "0xB0C2CBFfCd4C31AFFEe14993b6d48f99D285f621"
+        "eth:0xB0C2CBFfCd4C31AFFEe14993b6d48f99D285f621"
      values.$members.3:
-        "0x28bB9385A588EF4747264D19B9A9F1603591680c"
+        "eth:0x28bB9385A588EF4747264D19B9A9F1603591680c"
      values.$members.4:
-        "0x691C2EF68e25E620fa6cAdE2728f6aE34F37aAD2"
+        "eth:0x691C2EF68e25E620fa6cAdE2728f6aE34F37aAD2"
      values.$members.5:
-        "0x5bE3E96Cdc3A97628bD7308d3588B9a474F4A54d"
+        "eth:0x5bE3E96Cdc3A97628bD7308d3588B9a474F4A54d"
      values.$members.6:
-        "0x88De44422E1b1c30bc530c35aEdb9f5aD0e6fD52"
+        "eth:0x88De44422E1b1c30bc530c35aEdb9f5aD0e6fD52"
      values.$members.7:
-        "0x01a0A7BaAAca31AFB5b770FeFD69CE4917D9c32e"
+        "eth:0x01a0A7BaAAca31AFB5b770FeFD69CE4917D9c32e"
      values.$members.8:
-        "0xf83bC4688979b13Da02CB94c76cEB169540760b5"
+        "eth:0xf83bC4688979b13Da02CB94c76cEB169540760b5"
      values.$members.9:
-        "0x547D0F472309e4239b296D01e03bEDc101241a26"
+        "eth:0x547D0F472309e4239b296D01e03bEDc101241a26"
      implementationNames.0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb:
-        "GnosisSafeProxy"
      implementationNames.0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
-        "GnosisSafe"
      implementationNames.eth:0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb:
+        "GnosisSafeProxy"
      implementationNames.eth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
+        "GnosisSafe"
    }
```

```diff
    contract OptimismMintableERC20Factory (0xc1dA06CC5DD5cE23bABa924463de7F762039252d) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintableERC20 as this chain's representation of a token on the host chain, or vice-versa.
      address:
-        "0xc1dA06CC5DD5cE23bABa924463de7F762039252d"
+        "eth:0xc1dA06CC5DD5cE23bABa924463de7F762039252d"
      values.$admin:
-        "0xeC432c4F1d0E12737f3a42a459B84848Af979b2d"
+        "eth:0xeC432c4F1d0E12737f3a42a459B84848Af979b2d"
      values.$implementation:
-        "0xD00e38514d66bf1B761a8937559c6b2854A5B3ad"
+        "eth:0xD00e38514d66bf1B761a8937559c6b2854A5B3ad"
      values.$pastUpgrades.0.2.0:
-        "0xD00e38514d66bf1B761a8937559c6b2854A5B3ad"
+        "eth:0xD00e38514d66bf1B761a8937559c6b2854A5B3ad"
      values.bridge:
-        "0x2658723Bf70c7667De6B25F99fcce13A16D25d08"
+        "eth:0x2658723Bf70c7667De6B25F99fcce13A16D25d08"
      values.BRIDGE:
-        "0x2658723Bf70c7667De6B25F99fcce13A16D25d08"
+        "eth:0x2658723Bf70c7667De6B25F99fcce13A16D25d08"
      implementationNames.0xc1dA06CC5DD5cE23bABa924463de7F762039252d:
-        "Proxy"
      implementationNames.0xD00e38514d66bf1B761a8937559c6b2854A5B3ad:
-        "OptimismMintableERC20Factory"
      implementationNames.eth:0xc1dA06CC5DD5cE23bABa924463de7F762039252d:
+        "Proxy"
      implementationNames.eth:0xD00e38514d66bf1B761a8937559c6b2854A5B3ad:
+        "OptimismMintableERC20Factory"
    }
```

```diff
    contract L1OpUSDCBridgeAdapter (0xE3622468Ea7dD804702B56ca2a4f88C0936995e6) {
    +++ description: Escrow for USDC that uses the canonical bridge for messaging but is governed externally.
      address:
-        "0xE3622468Ea7dD804702B56ca2a4f88C0936995e6"
+        "eth:0xE3622468Ea7dD804702B56ca2a4f88C0936995e6"
      values.$admin:
-        "0xD2D7535e099F26EbfbA26d96bD1a661d3531d0e9"
+        "eth:0xD2D7535e099F26EbfbA26d96bD1a661d3531d0e9"
      values.$implementation:
-        "0x61488ae9dEDCA3f29F5e72bbf23ba975862c20bA"
+        "eth:0x61488ae9dEDCA3f29F5e72bbf23ba975862c20bA"
      values.$pastUpgrades.0.2.0:
-        "0x61488ae9dEDCA3f29F5e72bbf23ba975862c20bA"
+        "eth:0x61488ae9dEDCA3f29F5e72bbf23ba975862c20bA"
      values.burnCaller:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.eip712Domain.verifyingContract:
-        "0xE3622468Ea7dD804702B56ca2a4f88C0936995e6"
+        "eth:0xE3622468Ea7dD804702B56ca2a4f88C0936995e6"
      values.LINKED_ADAPTER:
-        "0x3b1ac69368eb6447F5db2d4E1641380Fa9e40d29"
+        "eth:0x3b1ac69368eb6447F5db2d4E1641380Fa9e40d29"
      values.MESSENGER:
-        "0x31B72D76FB666844C41EdF08dF0254875Dbb7edB"
+        "eth:0x31B72D76FB666844C41EdF08dF0254875Dbb7edB"
      values.owner:
-        "0xD2D7535e099F26EbfbA26d96bD1a661d3531d0e9"
+        "eth:0xD2D7535e099F26EbfbA26d96bD1a661d3531d0e9"
      values.USDC:
-        "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"
+        "eth:0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"
      implementationNames.0xE3622468Ea7dD804702B56ca2a4f88C0936995e6:
-        "ERC1967Proxy"
      implementationNames.0x61488ae9dEDCA3f29F5e72bbf23ba975862c20bA:
-        "L1OpUSDCBridgeAdapter"
      implementationNames.eth:0xE3622468Ea7dD804702B56ca2a4f88C0936995e6:
+        "ERC1967Proxy"
      implementationNames.eth:0x61488ae9dEDCA3f29F5e72bbf23ba975862c20bA:
+        "L1OpUSDCBridgeAdapter"
    }
```

```diff
    contract L1OpEURCBridgeAdapter (0xEb99c8c87c5e0C2dCb01E2A1E35AA01f5889F677) {
    +++ description: Escrow for EURC that uses the canonical bridge for messaging but is governed externally.
      address:
-        "0xEb99c8c87c5e0C2dCb01E2A1E35AA01f5889F677"
+        "eth:0xEb99c8c87c5e0C2dCb01E2A1E35AA01f5889F677"
      values.$admin:
-        "0xD2D7535e099F26EbfbA26d96bD1a661d3531d0e9"
+        "eth:0xD2D7535e099F26EbfbA26d96bD1a661d3531d0e9"
      values.$implementation:
-        "0x7C82666cE6C2DCFD8458148c98C8b156D6Bc0d80"
+        "eth:0x7C82666cE6C2DCFD8458148c98C8b156D6Bc0d80"
      values.$pastUpgrades.0.2.0:
-        "0x7C82666cE6C2DCFD8458148c98C8b156D6Bc0d80"
+        "eth:0x7C82666cE6C2DCFD8458148c98C8b156D6Bc0d80"
      values.burnCaller:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.eip712Domain.verifyingContract:
-        "0xEb99c8c87c5e0C2dCb01E2A1E35AA01f5889F677"
+        "eth:0xEb99c8c87c5e0C2dCb01E2A1E35AA01f5889F677"
      values.EURC:
-        "0x1aBaEA1f7C830bD89Acc67eC4af516284b1bC33c"
+        "eth:0x1aBaEA1f7C830bD89Acc67eC4af516284b1bC33c"
      values.LINKED_ADAPTER:
-        "0x4db1c96C1f9c3d5429fDf35ED2e684b309b0c281"
+        "eth:0x4db1c96C1f9c3d5429fDf35ED2e684b309b0c281"
      values.MESSENGER:
-        "0x31B72D76FB666844C41EdF08dF0254875Dbb7edB"
+        "eth:0x31B72D76FB666844C41EdF08dF0254875Dbb7edB"
      values.owner:
-        "0xD2D7535e099F26EbfbA26d96bD1a661d3531d0e9"
+        "eth:0xD2D7535e099F26EbfbA26d96bD1a661d3531d0e9"
      implementationNames.0xEb99c8c87c5e0C2dCb01E2A1E35AA01f5889F677:
-        "ERC1967Proxy"
      implementationNames.0x7C82666cE6C2DCFD8458148c98C8b156D6Bc0d80:
-        "L1OpEURCBridgeAdapter"
      implementationNames.eth:0xEb99c8c87c5e0C2dCb01E2A1E35AA01f5889F677:
+        "ERC1967Proxy"
      implementationNames.eth:0x7C82666cE6C2DCFD8458148c98C8b156D6Bc0d80:
+        "L1OpEURCBridgeAdapter"
    }
```

```diff
    contract ProxyAdmin (0xeC432c4F1d0E12737f3a42a459B84848Af979b2d) {
    +++ description: None
      address:
-        "0xeC432c4F1d0E12737f3a42a459B84848Af979b2d"
+        "eth:0xeC432c4F1d0E12737f3a42a459B84848Af979b2d"
      values.addressManager:
-        "0x2dF7057d3F25212E51aFEA8dA628668229Ea423f"
+        "eth:0x2dF7057d3F25212E51aFEA8dA628668229Ea423f"
      values.owner:
-        "0xECd4150ABbb1EBff13f74e42Fb43C3d78B4E0b45"
+        "eth:0xECd4150ABbb1EBff13f74e42Fb43C3d78B4E0b45"
      implementationNames.0xeC432c4F1d0E12737f3a42a459B84848Af979b2d:
-        "ProxyAdmin"
      implementationNames.eth:0xeC432c4F1d0E12737f3a42a459B84848Af979b2d:
+        "ProxyAdmin"
    }
```

```diff
    contract Lisk Multisig (0xECd4150ABbb1EBff13f74e42Fb43C3d78B4E0b45) {
    +++ description: None
      address:
-        "0xECd4150ABbb1EBff13f74e42Fb43C3d78B4E0b45"
+        "eth:0xECd4150ABbb1EBff13f74e42Fb43C3d78B4E0b45"
      values.$implementation:
-        "0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
+        "eth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
      values.$members.0:
-        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
+        "eth:0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
      implementationNames.0xECd4150ABbb1EBff13f74e42Fb43C3d78B4E0b45:
-        "GnosisSafeProxy"
      implementationNames.0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
-        "GnosisSafe"
      implementationNames.eth:0xECd4150ABbb1EBff13f74e42Fb43C3d78B4E0b45:
+        "GnosisSafeProxy"
      implementationNames.eth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
+        "GnosisSafe"
    }
```

```diff
    EOA  (0xf83bC4688979b13Da02CB94c76cEB169540760b5) {
    +++ description: None
      address:
-        "0xf83bC4688979b13Da02CB94c76cEB169540760b5"
+        "eth:0xf83bC4688979b13Da02CB94c76cEB169540760b5"
    }
```

```diff
    EOA  (0xFf00000000000000000000000000000000001135) {
    +++ description: None
      address:
-        "0xFf00000000000000000000000000000000001135"
+        "eth:0xFf00000000000000000000000000000000001135"
    }
```

```diff
+   Status: CREATED
    contract SystemConfig (0x05f23282FFDCA8286E4738C1aF79079f3d843750)
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
```

```diff
+   Status: CREATED
    contract L2OutputOracle (0x113cB99283AF242Da0A0C54347667edF531Aa7d6)
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
```

```diff
+   Status: CREATED
    contract L1StandardBridge (0x2658723Bf70c7667De6B25F99fcce13A16D25d08)
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
```

```diff
+   Status: CREATED
    contract SuperchainConfig (0x26C7bFB430d68Bf74d2d52497836d4336b555dE7)
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
```

```diff
+   Status: CREATED
    contract OptimismPortal (0x26dB93F8b8b4f7016240af62F7730979d353f9A7)
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
```

```diff
+   Status: CREATED
    contract AddressManager (0x2dF7057d3F25212E51aFEA8dA628668229Ea423f)
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
```

```diff
+   Status: CREATED
    contract L1CrossDomainMessenger (0x31B72D76FB666844C41EdF08dF0254875Dbb7edB)
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
```

```diff
+   Status: CREATED
    contract L1ERC721Bridge (0x3A44A3b263FB631cdbf25f339e2D29497511A81f)
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
```

```diff
+   Status: CREATED
    contract L1ERC20TokenBridge (0x9348AF23B01F2B517AFE8f29B3183d2Bb7d69Fcf)
    +++ description: Escrow for custom external tokens that use the canonical bridge for messaging but are governed externally.
```

```diff
+   Status: CREATED
    contract Gelato Multisig (0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OptimismMintableERC20Factory (0xc1dA06CC5DD5cE23bABa924463de7F762039252d)
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintableERC20 as this chain's representation of a token on the host chain, or vice-versa.
```

```diff
+   Status: CREATED
    contract L1OpUSDCBridgeAdapter (0xE3622468Ea7dD804702B56ca2a4f88C0936995e6)
    +++ description: Escrow for USDC that uses the canonical bridge for messaging but is governed externally.
```

```diff
+   Status: CREATED
    contract L1OpEURCBridgeAdapter (0xEb99c8c87c5e0C2dCb01E2A1E35AA01f5889F677)
    +++ description: Escrow for EURC that uses the canonical bridge for messaging but is governed externally.
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0xeC432c4F1d0E12737f3a42a459B84848Af979b2d)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Lisk Multisig (0xECd4150ABbb1EBff13f74e42Fb43C3d78B4E0b45)
    +++ description: None
```

Generated with discovered.json: 0xbb24b05f614275c8839af610957d194bf6639158

# Diff at Mon, 14 Jul 2025 08:02:45 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@0dc82cd5064c9c6dc9fb20e2291a8bb6b2048e27 block: 22624983
- current block number: 22624983

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22624983 (main branch discovery), not current.

```diff
    contract OptimismMintableERC20Factory (0xc1dA06CC5DD5cE23bABa924463de7F762039252d) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintableERC20 as this chain's representation of a token on the host chain, or vice-versa.
      description:
-        "A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa."
+        "A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintableERC20 as this chain's representation of a token on the host chain, or vice-versa."
    }
```

Generated with discovered.json: 0xe2b75be4eef99669d0fff8f1f661c855c25a532c

# Diff at Fri, 04 Jul 2025 12:19:07 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f56dc47fe915564d4555300304da4d3bcbc087f block: 22624983
- current block number: 22624983

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22624983 (main branch discovery), not current.

```diff
    EOA  (0x0AbD6da1cE10D1cD6c7C9C14b905786D20f3EB23) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0x113cB99283AF242Da0A0C54347667edF531Aa7d6"
+        "eth:0x113cB99283AF242Da0A0C54347667edF531Aa7d6"
      receivedPermissions.1.from:
-        "ethereum:0x113cB99283AF242Da0A0C54347667edF531Aa7d6"
+        "eth:0x113cB99283AF242Da0A0C54347667edF531Aa7d6"
    }
```

```diff
    EOA  (0xa6Ea2f3299b63c53143c993d2d5E60A69Cd6Fe24) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0x05f23282FFDCA8286E4738C1aF79079f3d843750"
+        "eth:0x05f23282FFDCA8286E4738C1aF79079f3d843750"
    }
```

```diff
    contract Gelato Multisig (0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0x113cB99283AF242Da0A0C54347667edF531Aa7d6"
+        "eth:0x113cB99283AF242Da0A0C54347667edF531Aa7d6"
      receivedPermissions.1.from:
-        "ethereum:0x113cB99283AF242Da0A0C54347667edF531Aa7d6"
+        "eth:0x113cB99283AF242Da0A0C54347667edF531Aa7d6"
      receivedPermissions.2.from:
-        "ethereum:0x26C7bFB430d68Bf74d2d52497836d4336b555dE7"
+        "eth:0x26C7bFB430d68Bf74d2d52497836d4336b555dE7"
      receivedPermissions.3.from:
-        "ethereum:0x26dB93F8b8b4f7016240af62F7730979d353f9A7"
+        "eth:0x26dB93F8b8b4f7016240af62F7730979d353f9A7"
      receivedPermissions.4.from:
-        "ethereum:0x26dB93F8b8b4f7016240af62F7730979d353f9A7"
+        "eth:0x26dB93F8b8b4f7016240af62F7730979d353f9A7"
      receivedPermissions.5.from:
-        "ethereum:0x05f23282FFDCA8286E4738C1aF79079f3d843750"
+        "eth:0x05f23282FFDCA8286E4738C1aF79079f3d843750"
      receivedPermissions.6.via.1.address:
-        "ethereum:0xECd4150ABbb1EBff13f74e42Fb43C3d78B4E0b45"
+        "eth:0xECd4150ABbb1EBff13f74e42Fb43C3d78B4E0b45"
      receivedPermissions.6.via.0.address:
-        "ethereum:0xeC432c4F1d0E12737f3a42a459B84848Af979b2d"
+        "eth:0xeC432c4F1d0E12737f3a42a459B84848Af979b2d"
      receivedPermissions.6.from:
-        "ethereum:0x2dF7057d3F25212E51aFEA8dA628668229Ea423f"
+        "eth:0x2dF7057d3F25212E51aFEA8dA628668229Ea423f"
      receivedPermissions.7.via.1.address:
-        "ethereum:0xECd4150ABbb1EBff13f74e42Fb43C3d78B4E0b45"
+        "eth:0xECd4150ABbb1EBff13f74e42Fb43C3d78B4E0b45"
      receivedPermissions.7.via.0.address:
-        "ethereum:0xeC432c4F1d0E12737f3a42a459B84848Af979b2d"
+        "eth:0xeC432c4F1d0E12737f3a42a459B84848Af979b2d"
      receivedPermissions.7.from:
-        "ethereum:0x05f23282FFDCA8286E4738C1aF79079f3d843750"
+        "eth:0x05f23282FFDCA8286E4738C1aF79079f3d843750"
      receivedPermissions.8.via.1.address:
-        "ethereum:0xECd4150ABbb1EBff13f74e42Fb43C3d78B4E0b45"
+        "eth:0xECd4150ABbb1EBff13f74e42Fb43C3d78B4E0b45"
      receivedPermissions.8.via.0.address:
-        "ethereum:0xeC432c4F1d0E12737f3a42a459B84848Af979b2d"
+        "eth:0xeC432c4F1d0E12737f3a42a459B84848Af979b2d"
      receivedPermissions.8.from:
-        "ethereum:0x113cB99283AF242Da0A0C54347667edF531Aa7d6"
+        "eth:0x113cB99283AF242Da0A0C54347667edF531Aa7d6"
      receivedPermissions.9.via.1.address:
-        "ethereum:0xECd4150ABbb1EBff13f74e42Fb43C3d78B4E0b45"
+        "eth:0xECd4150ABbb1EBff13f74e42Fb43C3d78B4E0b45"
      receivedPermissions.9.via.0.address:
-        "ethereum:0xeC432c4F1d0E12737f3a42a459B84848Af979b2d"
+        "eth:0xeC432c4F1d0E12737f3a42a459B84848Af979b2d"
      receivedPermissions.9.from:
-        "ethereum:0x2658723Bf70c7667De6B25F99fcce13A16D25d08"
+        "eth:0x2658723Bf70c7667De6B25F99fcce13A16D25d08"
      receivedPermissions.10.via.1.address:
-        "ethereum:0xECd4150ABbb1EBff13f74e42Fb43C3d78B4E0b45"
+        "eth:0xECd4150ABbb1EBff13f74e42Fb43C3d78B4E0b45"
      receivedPermissions.10.via.0.address:
-        "ethereum:0xeC432c4F1d0E12737f3a42a459B84848Af979b2d"
+        "eth:0xeC432c4F1d0E12737f3a42a459B84848Af979b2d"
      receivedPermissions.10.from:
-        "ethereum:0x26C7bFB430d68Bf74d2d52497836d4336b555dE7"
+        "eth:0x26C7bFB430d68Bf74d2d52497836d4336b555dE7"
      receivedPermissions.11.via.1.address:
-        "ethereum:0xECd4150ABbb1EBff13f74e42Fb43C3d78B4E0b45"
+        "eth:0xECd4150ABbb1EBff13f74e42Fb43C3d78B4E0b45"
      receivedPermissions.11.via.0.address:
-        "ethereum:0xeC432c4F1d0E12737f3a42a459B84848Af979b2d"
+        "eth:0xeC432c4F1d0E12737f3a42a459B84848Af979b2d"
      receivedPermissions.11.from:
-        "ethereum:0x26dB93F8b8b4f7016240af62F7730979d353f9A7"
+        "eth:0x26dB93F8b8b4f7016240af62F7730979d353f9A7"
      receivedPermissions.12.via.1.address:
-        "ethereum:0xECd4150ABbb1EBff13f74e42Fb43C3d78B4E0b45"
+        "eth:0xECd4150ABbb1EBff13f74e42Fb43C3d78B4E0b45"
      receivedPermissions.12.via.0.address:
-        "ethereum:0xeC432c4F1d0E12737f3a42a459B84848Af979b2d"
+        "eth:0xeC432c4F1d0E12737f3a42a459B84848Af979b2d"
      receivedPermissions.12.from:
-        "ethereum:0x31B72D76FB666844C41EdF08dF0254875Dbb7edB"
+        "eth:0x31B72D76FB666844C41EdF08dF0254875Dbb7edB"
      receivedPermissions.13.via.1.address:
-        "ethereum:0xECd4150ABbb1EBff13f74e42Fb43C3d78B4E0b45"
+        "eth:0xECd4150ABbb1EBff13f74e42Fb43C3d78B4E0b45"
      receivedPermissions.13.via.0.address:
-        "ethereum:0xeC432c4F1d0E12737f3a42a459B84848Af979b2d"
+        "eth:0xeC432c4F1d0E12737f3a42a459B84848Af979b2d"
      receivedPermissions.13.from:
-        "ethereum:0x3A44A3b263FB631cdbf25f339e2D29497511A81f"
+        "eth:0x3A44A3b263FB631cdbf25f339e2D29497511A81f"
      receivedPermissions.14.via.1.address:
-        "ethereum:0xECd4150ABbb1EBff13f74e42Fb43C3d78B4E0b45"
+        "eth:0xECd4150ABbb1EBff13f74e42Fb43C3d78B4E0b45"
      receivedPermissions.14.via.0.address:
-        "ethereum:0xeC432c4F1d0E12737f3a42a459B84848Af979b2d"
+        "eth:0xeC432c4F1d0E12737f3a42a459B84848Af979b2d"
      receivedPermissions.14.from:
-        "ethereum:0xc1dA06CC5DD5cE23bABa924463de7F762039252d"
+        "eth:0xc1dA06CC5DD5cE23bABa924463de7F762039252d"
    }
```

```diff
    contract ProxyAdmin (0xeC432c4F1d0E12737f3a42a459B84848Af979b2d) {
    +++ description: None
      directlyReceivedPermissions.0.from:
-        "ethereum:0x2dF7057d3F25212E51aFEA8dA628668229Ea423f"
+        "eth:0x2dF7057d3F25212E51aFEA8dA628668229Ea423f"
      directlyReceivedPermissions.1.from:
-        "ethereum:0x05f23282FFDCA8286E4738C1aF79079f3d843750"
+        "eth:0x05f23282FFDCA8286E4738C1aF79079f3d843750"
      directlyReceivedPermissions.2.from:
-        "ethereum:0x113cB99283AF242Da0A0C54347667edF531Aa7d6"
+        "eth:0x113cB99283AF242Da0A0C54347667edF531Aa7d6"
      directlyReceivedPermissions.3.from:
-        "ethereum:0x2658723Bf70c7667De6B25F99fcce13A16D25d08"
+        "eth:0x2658723Bf70c7667De6B25F99fcce13A16D25d08"
      directlyReceivedPermissions.4.from:
-        "ethereum:0x26C7bFB430d68Bf74d2d52497836d4336b555dE7"
+        "eth:0x26C7bFB430d68Bf74d2d52497836d4336b555dE7"
      directlyReceivedPermissions.5.from:
-        "ethereum:0x26dB93F8b8b4f7016240af62F7730979d353f9A7"
+        "eth:0x26dB93F8b8b4f7016240af62F7730979d353f9A7"
      directlyReceivedPermissions.6.from:
-        "ethereum:0x31B72D76FB666844C41EdF08dF0254875Dbb7edB"
+        "eth:0x31B72D76FB666844C41EdF08dF0254875Dbb7edB"
      directlyReceivedPermissions.7.from:
-        "ethereum:0x3A44A3b263FB631cdbf25f339e2D29497511A81f"
+        "eth:0x3A44A3b263FB631cdbf25f339e2D29497511A81f"
      directlyReceivedPermissions.8.from:
-        "ethereum:0xc1dA06CC5DD5cE23bABa924463de7F762039252d"
+        "eth:0xc1dA06CC5DD5cE23bABa924463de7F762039252d"
    }
```

```diff
    contract Lisk Multisig (0xECd4150ABbb1EBff13f74e42Fb43C3d78B4E0b45) {
    +++ description: None
      directlyReceivedPermissions.0.from:
-        "ethereum:0xeC432c4F1d0E12737f3a42a459B84848Af979b2d"
+        "eth:0xeC432c4F1d0E12737f3a42a459B84848Af979b2d"
    }
```

Generated with discovered.json: 0xaa8da913f0dcb686ab86c3f08da2b79da69b6f16

# Diff at Mon, 16 Jun 2025 08:42:13 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@e1208475abce20cea1768d2e4878c03350c1b7c9 block: 22624983
- current block number: 22624983

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22624983 (main branch discovery), not current.

```diff
    contract L1CrossDomainMessenger (0x31B72D76FB666844C41EdF08dF0254875Dbb7edB) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      values.$admin:
+        "0xeC432c4F1d0E12737f3a42a459B84848Af979b2d"
    }
```

```diff
    contract Gelato Multisig (0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb) {
    +++ description: None
      receivedPermissions.14:
+        {"permission":"upgrade","from":"ethereum:0x05f23282FFDCA8286E4738C1aF79079f3d843750","role":"admin","via":[{"address":"ethereum:0xeC432c4F1d0E12737f3a42a459B84848Af979b2d"},{"address":"ethereum:0xECd4150ABbb1EBff13f74e42Fb43C3d78B4E0b45"}]}
      receivedPermissions.13.from:
-        "ethereum:0x05f23282FFDCA8286E4738C1aF79079f3d843750"
+        "ethereum:0x3A44A3b263FB631cdbf25f339e2D29497511A81f"
      receivedPermissions.12.from:
-        "ethereum:0x3A44A3b263FB631cdbf25f339e2D29497511A81f"
+        "ethereum:0x31B72D76FB666844C41EdF08dF0254875Dbb7edB"
    }
```

```diff
    contract ProxyAdmin (0xeC432c4F1d0E12737f3a42a459B84848Af979b2d) {
    +++ description: None
      directlyReceivedPermissions.8:
+        {"permission":"upgrade","from":"ethereum:0x05f23282FFDCA8286E4738C1aF79079f3d843750","role":"admin"}
      directlyReceivedPermissions.7.from:
-        "ethereum:0x05f23282FFDCA8286E4738C1aF79079f3d843750"
+        "ethereum:0x3A44A3b263FB631cdbf25f339e2D29497511A81f"
      directlyReceivedPermissions.6.from:
-        "ethereum:0x3A44A3b263FB631cdbf25f339e2D29497511A81f"
+        "ethereum:0x31B72D76FB666844C41EdF08dF0254875Dbb7edB"
    }
```

Generated with discovered.json: 0x998c9180f1fe32ed5bae94f8fe03f73f20955cb4

# Diff at Tue, 03 Jun 2025 15:23:28 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@207cc2f32f4d79aaacbe9c1afa45e44aaef6bf87 block: 22266078
- current block number: 22624983

## Description

add EURC external bridge.

## Watched changes

```diff
    contract L1OpEURCBridgeAdapter (0xEb99c8c87c5e0C2dCb01E2A1E35AA01f5889F677) {
    +++ description: Escrow for EURC that uses the canonical bridge for messaging but is governed externally.
      type:
-        "EOA"
+        "Contract"
      proxyType:
-        "EOA"
+        "EIP1967 proxy"
      name:
+        "L1OpEURCBridgeAdapter"
      template:
+        "circle/L1OpEURCBridgeAdapter"
      sourceHashes:
+        ["0xbbe53a68c0042f4050bdf21e8d16eee4688dd35d24e49740915f0a0cf994f0d6","0x54fe8d50c1e462bc4bc77f3edef769d75b14fe44a09a708ceb8125d9760e71db"]
      description:
+        "Escrow for EURC that uses the canonical bridge for messaging but is governed externally."
      sinceTimestamp:
+        1748849495
      sinceBlock:
+        22615527
      values:
+        {"$admin":"0xD2D7535e099F26EbfbA26d96bD1a661d3531d0e9","$implementation":"0x7C82666cE6C2DCFD8458148c98C8b156D6Bc0d80","$pastUpgrades":[["2025-06-02T07:31:35.000Z","0x842ad723004e0ab6eec96d63e9480318f20b4262a5727cdf8ab01df70aed9c83",["0x7C82666cE6C2DCFD8458148c98C8b156D6Bc0d80"]]],"$upgradeCount":1,"BRIDGE_MESSAGE_TYPEHASH":"0x87e4683aad14f1869b43140e06b846bd1b00c2e08e9825f6719d163b4cfef2a6","burnAmount":0,"burnCaller":"0x0000000000000000000000000000000000000000","eip712Domain":{"fields":"0x0f","name":"OpEURCBridgeAdapter","version":"1.0.0","chainId":1,"verifyingContract":"0xEb99c8c87c5e0C2dCb01E2A1E35AA01f5889F677","salt":"0x0000000000000000000000000000000000000000000000000000000000000000","extensions":[]},"EURC":"0x1aBaEA1f7C830bD89Acc67eC4af516284b1bC33c","LINKED_ADAPTER":"0x4db1c96C1f9c3d5429fDf35ED2e684b309b0c281","MESSENGER":"0x31B72D76FB666844C41EdF08dF0254875Dbb7edB","messengerStatus":0,"owner":"0xD2D7535e099F26EbfbA26d96bD1a661d3531d0e9","UPGRADE_INTERFACE_VERSION":"5.0.0"}
      implementationNames:
+        {"0xEb99c8c87c5e0C2dCb01E2A1E35AA01f5889F677":"ERC1967Proxy","0x7C82666cE6C2DCFD8458148c98C8b156D6Bc0d80":"L1OpEURCBridgeAdapter"}
    }
```

## Source code changes

```diff
.../.flat/L1OpEURCBridgeAdapter/ERC1967Proxy.p.sol |  523 ++++
 .../L1OpEURCBridgeAdapter.sol                      | 2836 ++++++++++++++++++++
 2 files changed, 3359 insertions(+)
```

Generated with discovered.json: 0x60dbe9c88cbdaa650b7412ebf1368b65a1ff0274

# Diff at Fri, 30 May 2025 07:07:09 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@a4d8c436027d17df0f9b76843cd6deb1888fa381 block: 22266078
- current block number: 22266078

## Description

config: change comment about eip1559 fee val

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22266078 (main branch discovery), not current.

```diff
    contract SystemConfig (0x05f23282FFDCA8286E4738C1aF79079f3d843750) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      fieldMeta.eip1559Denominator:
+        {"description":"volatility param: lower denominator -> quicker fee changes on L2"}
    }
```

Generated with discovered.json: 0xb6153275dce616ff19a8ad9568c9fcd941212510

# Diff at Fri, 23 May 2025 09:40:59 GMT:

- chain: ethereum
- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@69cd181abbc3c830a6caf2f4429b37cae72ffdb8 block: 22266078
- current block number: 22266078

## Description

Introduced .role field on each permission, defaulting to field name on which it was defined (with '.' prefix)

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22266078 (main branch discovery), not current.

```diff
    EOA  (0x0AbD6da1cE10D1cD6c7C9C14b905786D20f3EB23) {
    +++ description: None
      receivedPermissions.1:
+        {"permission":"propose","from":"0x113cB99283AF242Da0A0C54347667edF531Aa7d6","role":".proposer"}
      receivedPermissions.0.role:
+        ".PROPOSER"
    }
```

```diff
    EOA  (0xa6Ea2f3299b63c53143c993d2d5E60A69Cd6Fe24) {
    +++ description: None
      receivedPermissions.0.role:
+        ".batcherHash"
    }
```

```diff
    contract Gelato Multisig (0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb) {
    +++ description: None
      receivedPermissions.13:
+        {"permission":"upgrade","from":"0x3A44A3b263FB631cdbf25f339e2D29497511A81f","role":"admin","via":[{"address":"0xeC432c4F1d0E12737f3a42a459B84848Af979b2d"},{"address":"0xECd4150ABbb1EBff13f74e42Fb43C3d78B4E0b45"}]}
      receivedPermissions.12:
+        {"permission":"upgrade","from":"0x26dB93F8b8b4f7016240af62F7730979d353f9A7","role":"admin","via":[{"address":"0xeC432c4F1d0E12737f3a42a459B84848Af979b2d"},{"address":"0xECd4150ABbb1EBff13f74e42Fb43C3d78B4E0b45"}]}
      receivedPermissions.11.from:
-        "0x3A44A3b263FB631cdbf25f339e2D29497511A81f"
+        "0xc1dA06CC5DD5cE23bABa924463de7F762039252d"
      receivedPermissions.11.role:
+        "admin"
      receivedPermissions.10.from:
-        "0x26dB93F8b8b4f7016240af62F7730979d353f9A7"
+        "0x26C7bFB430d68Bf74d2d52497836d4336b555dE7"
      receivedPermissions.10.role:
+        "admin"
      receivedPermissions.9.from:
-        "0xc1dA06CC5DD5cE23bABa924463de7F762039252d"
+        "0x05f23282FFDCA8286E4738C1aF79079f3d843750"
      receivedPermissions.9.role:
+        "admin"
      receivedPermissions.8.permission:
-        "upgrade"
+        "guard"
      receivedPermissions.8.from:
-        "0x26C7bFB430d68Bf74d2d52497836d4336b555dE7"
+        "0x26dB93F8b8b4f7016240af62F7730979d353f9A7"
      receivedPermissions.8.via:
-        [{"address":"0xeC432c4F1d0E12737f3a42a459B84848Af979b2d"},{"address":"0xECd4150ABbb1EBff13f74e42Fb43C3d78B4E0b45"}]
      receivedPermissions.8.role:
+        ".GUARDIAN"
      receivedPermissions.7.from:
-        "0x05f23282FFDCA8286E4738C1aF79079f3d843750"
+        "0x113cB99283AF242Da0A0C54347667edF531Aa7d6"
      receivedPermissions.7.role:
+        "admin"
      receivedPermissions.6.role:
+        ".guardian"
      receivedPermissions.5.role:
+        ".guardian"
      receivedPermissions.4.permission:
-        "upgrade"
+        "challenge"
      receivedPermissions.4.via:
-        [{"address":"0xeC432c4F1d0E12737f3a42a459B84848Af979b2d"},{"address":"0xECd4150ABbb1EBff13f74e42Fb43C3d78B4E0b45"}]
      receivedPermissions.4.role:
+        ".CHALLENGER"
      receivedPermissions.3.permission:
-        "interact"
+        "challenge"
      receivedPermissions.3.from:
-        "0x05f23282FFDCA8286E4738C1aF79079f3d843750"
+        "0x113cB99283AF242Da0A0C54347667edF531Aa7d6"
      receivedPermissions.3.description:
-        "it can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system."
      receivedPermissions.3.role:
+        ".challenger"
      receivedPermissions.2.permission:
-        "challenge"
+        "interact"
      receivedPermissions.2.from:
-        "0x113cB99283AF242Da0A0C54347667edF531Aa7d6"
+        "0x05f23282FFDCA8286E4738C1aF79079f3d843750"
      receivedPermissions.2.description:
+        "it can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system."
      receivedPermissions.2.role:
+        ".owner"
      receivedPermissions.1.permission:
-        "interact"
+        "upgrade"
      receivedPermissions.1.from:
-        "0x2dF7057d3F25212E51aFEA8dA628668229Ea423f"
+        "0x2658723Bf70c7667De6B25F99fcce13A16D25d08"
      receivedPermissions.1.description:
-        "set and change address mappings."
+        "upgrading the bridge implementation can give access to all funds escrowed therein."
      receivedPermissions.1.role:
+        ".$admin"
      receivedPermissions.0.permission:
-        "upgrade"
+        "interact"
      receivedPermissions.0.from:
-        "0x2658723Bf70c7667De6B25F99fcce13A16D25d08"
+        "0x2dF7057d3F25212E51aFEA8dA628668229Ea423f"
      receivedPermissions.0.description:
-        "upgrading the bridge implementation can give access to all funds escrowed therein."
+        "set and change address mappings."
      receivedPermissions.0.role:
+        ".owner"
    }
```

```diff
    contract ProxyAdmin (0xeC432c4F1d0E12737f3a42a459B84848Af979b2d) {
    +++ description: None
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
      directlyReceivedPermissions.1.permission:
-        "interact"
+        "upgrade"
      directlyReceivedPermissions.1.from:
-        "0x2dF7057d3F25212E51aFEA8dA628668229Ea423f"
+        "0x2658723Bf70c7667De6B25F99fcce13A16D25d08"
      directlyReceivedPermissions.1.description:
-        "set and change address mappings."
+        "upgrading the bridge implementation can give access to all funds escrowed therein."
      directlyReceivedPermissions.1.role:
+        ".$admin"
      directlyReceivedPermissions.0.permission:
-        "upgrade"
+        "interact"
      directlyReceivedPermissions.0.from:
-        "0x2658723Bf70c7667De6B25F99fcce13A16D25d08"
+        "0x2dF7057d3F25212E51aFEA8dA628668229Ea423f"
      directlyReceivedPermissions.0.description:
-        "upgrading the bridge implementation can give access to all funds escrowed therein."
+        "set and change address mappings."
      directlyReceivedPermissions.0.role:
+        ".owner"
    }
```

```diff
    contract Lisk Multisig (0xECd4150ABbb1EBff13f74e42Fb43C3d78B4E0b45) {
    +++ description: None
      directlyReceivedPermissions.0.role:
+        ".owner"
    }
```

Generated with discovered.json: 0xb1a9859c234e25e2e548b6d3fb137fff118f9af3

# Diff at Tue, 29 Apr 2025 08:19:06 GMT:

- chain: ethereum
- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@ef7477af00fe0b57a2f7cacf7e958c12494af662 block: 22266078
- current block number: 22266078

## Description

Field .issuedPermissions is removed from the output as no longer needed. Added 'permissionsConfigHash' due to refactoring of the modelling process (into a separate command).

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22266078 (main branch discovery), not current.

```diff
    contract SystemConfig (0x05f23282FFDCA8286E4738C1aF79079f3d843750) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      issuedPermissions:
-        [{"permission":"interact","to":"0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb","description":"it can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system.","via":[]},{"permission":"sequence","to":"0xa6Ea2f3299b63c53143c993d2d5E60A69Cd6Fe24","via":[]},{"permission":"upgrade","to":"0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb","via":[{"address":"0xECd4150ABbb1EBff13f74e42Fb43C3d78B4E0b45"},{"address":"0xeC432c4F1d0E12737f3a42a459B84848Af979b2d"}]}]
    }
```

```diff
    contract L2OutputOracle (0x113cB99283AF242Da0A0C54347667edF531Aa7d6) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      issuedPermissions:
-        [{"permission":"challenge","to":"0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb","via":[]},{"permission":"propose","to":"0x0AbD6da1cE10D1cD6c7C9C14b905786D20f3EB23","via":[]},{"permission":"upgrade","to":"0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb","via":[{"address":"0xECd4150ABbb1EBff13f74e42Fb43C3d78B4E0b45"},{"address":"0xeC432c4F1d0E12737f3a42a459B84848Af979b2d"}]}]
    }
```

```diff
    contract L1StandardBridge (0x2658723Bf70c7667De6B25F99fcce13A16D25d08) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb","description":"upgrading the bridge implementation can give access to all funds escrowed therein.","via":[{"address":"0xECd4150ABbb1EBff13f74e42Fb43C3d78B4E0b45"},{"address":"0xeC432c4F1d0E12737f3a42a459B84848Af979b2d"}]}]
    }
```

```diff
    contract SuperchainConfig (0x26C7bFB430d68Bf74d2d52497836d4336b555dE7) {
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      issuedPermissions:
-        [{"permission":"guard","to":"0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb","via":[]},{"permission":"upgrade","to":"0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb","via":[{"address":"0xECd4150ABbb1EBff13f74e42Fb43C3d78B4E0b45"},{"address":"0xeC432c4F1d0E12737f3a42a459B84848Af979b2d"}]}]
    }
```

```diff
    contract OptimismPortal (0x26dB93F8b8b4f7016240af62F7730979d353f9A7) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      issuedPermissions:
-        [{"permission":"guard","to":"0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb","via":[]},{"permission":"upgrade","to":"0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb","via":[{"address":"0xECd4150ABbb1EBff13f74e42Fb43C3d78B4E0b45"},{"address":"0xeC432c4F1d0E12737f3a42a459B84848Af979b2d"}]}]
    }
```

```diff
    contract AddressManager (0x2dF7057d3F25212E51aFEA8dA628668229Ea423f) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      issuedPermissions:
-        [{"permission":"interact","to":"0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb","description":"set and change address mappings.","via":[{"address":"0xECd4150ABbb1EBff13f74e42Fb43C3d78B4E0b45"},{"address":"0xeC432c4F1d0E12737f3a42a459B84848Af979b2d"}]}]
    }
```

```diff
    contract L1ERC721Bridge (0x3A44A3b263FB631cdbf25f339e2D29497511A81f) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb","via":[{"address":"0xECd4150ABbb1EBff13f74e42Fb43C3d78B4E0b45"},{"address":"0xeC432c4F1d0E12737f3a42a459B84848Af979b2d"}]}]
    }
```

```diff
    contract OptimismMintableERC20Factory (0xc1dA06CC5DD5cE23bABa924463de7F762039252d) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb","via":[{"address":"0xECd4150ABbb1EBff13f74e42Fb43C3d78B4E0b45"},{"address":"0xeC432c4F1d0E12737f3a42a459B84848Af979b2d"}]}]
    }
```

Generated with discovered.json: 0x83988919972989857b574ec1a0c64817c96cc2d9

# Diff at Mon, 14 Apr 2025 08:37:06 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@51cb72b175a19516796629e400e8354f50e161ac block: 21635783
- current block number: 22266078

## Description

Add custom wstETH escrow.

## Watched changes

```diff
    contract L1ERC20TokenBridge (0x9348AF23B01F2B517AFE8f29B3183d2Bb7d69Fcf) {
    +++ description: Escrow for custom external tokens that use the canonical bridge for messaging but are governed externally.
      type:
-        "EOA"
+        "Contract"
      proxyType:
-        "EOA"
+        "EIP1967 proxy"
      name:
+        "L1ERC20TokenBridge"
      template:
+        "lido/L1ERC20TokenBridge"
      sourceHashes:
+        ["0x698ae88793265d087e07a445b69bf16b450cdcf636b9073b86221936e912a135","0xc4b0423b7d0fcada3862027e805c2fc79676feb6f4bc3978e5a86b390bfd7be3"]
      description:
+        "Escrow for custom external tokens that use the canonical bridge for messaging but are governed externally."
      sinceTimestamp:
+        1737623423
      sinceBlock:
+        21686205
      values:
+        {"$admin":"0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c","$implementation":"0xC7315f4FaaB2F700fc6b4704BB801c46ff6327AC","$pastUpgrades":[["2025-01-23T09:10:23.000Z","0xc46d4a4110ff87720804f018aa5be922d1a401d1b869ea4f7fee645ee6ba1b60",["0xC7315f4FaaB2F700fc6b4704BB801c46ff6327AC"]]],"$upgradeCount":1,"DEFAULT_ADMIN_ROLE":"0x0000000000000000000000000000000000000000000000000000000000000000","DEPOSITS_DISABLER_ROLE":"0x63f736f21cb2943826cd50b191eb054ebbea670e4e962d0527611f830cd399d6","DEPOSITS_ENABLER_ROLE":"0x4b43b36766bde12c5e9cbbc37d15f8d1f769f08f54720ab370faeb4ce893753a","isDepositsEnabled":true,"isInitialized":true,"isWithdrawalsEnabled":true,"l1Token":"0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0","l2Token":"0x76D8de471F54aAA87784119c60Df1bbFc852C415","l2TokenBridge":"0xca498Ee83eD3546321d4DC25e2789B0624F15f68","messenger":"0x31B72D76FB666844C41EdF08dF0254875Dbb7edB","proxy__getAdmin":"0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c","proxy__getImplementation":"0xC7315f4FaaB2F700fc6b4704BB801c46ff6327AC","proxy__getIsOssified":false,"WITHDRAWALS_DISABLER_ROLE":"0x94a954c0bc99227eddbc0715a62a7e1056ed8784cd719c2303b685683908857c","WITHDRAWALS_ENABLER_ROLE":"0x9ab8816a3dc0b3849ec1ac00483f6ec815b07eee2fd766a353311c823ad59d0d"}
      derivedName:
+        "L1ERC20TokenBridge"
    }
```

## Source code changes

```diff
.../L1ERC20TokenBridge/L1ERC20TokenBridge.sol      | 1078 ++++++++++++++++++++
 .../.flat/L1ERC20TokenBridge/OssifiableProxy.p.sol |  614 +++++++++++
 2 files changed, 1692 insertions(+)
```

Generated with discovered.json: 0xc5aae6763bd4dd2a45aabf15a3545fff4224a75f

# Diff at Thu, 27 Mar 2025 11:14:35 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@8cc2e36080df3a74dfd8475d41c64f46203f5218 block: 21635783
- current block number: 21635783

## Description

Config related: add guardian description details, hide some noisy values, hide AddressManager as spam cat, add proposer / challenger to permissioned opfp chains.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21635783 (main branch discovery), not current.

```diff
    contract AddressManager (0x2dF7057d3F25212E51aFEA8dA628668229Ea423f) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      category:
+        {"name":"Spam","priority":-1}
    }
```

Generated with discovered.json: 0x5118a246e61ba9279ace63b31bb607717d4f3129

# Diff at Wed, 19 Mar 2025 13:04:57 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@e950b6e93c84855ee2ec1740913b7b4c994b9ae2 block: 21635783
- current block number: 21635783

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21635783 (main branch discovery), not current.

```diff
    contract undefined (0x0AbD6da1cE10D1cD6c7C9C14b905786D20f3EB23) {
    +++ description: None
      severity:
-        "HIGH"
    }
```

```diff
    contract Gelato Multisig (0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb) {
    +++ description: None
      severity:
-        "HIGH"
    }
```

Generated with discovered.json: 0x7c7940cf33a1431143e232682c660cc8c0e86130

# Diff at Tue, 18 Mar 2025 08:13:07 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@4ef7a8dbcec1cd9fec77aae2b73d81347a4ffb13 block: 21635783
- current block number: 21635783

## Description

Config: change Multisig names.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21635783 (main branch discovery), not current.

```diff
    contract Gelato Multisig (0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb) {
    +++ description: None
      name:
-        "GelatoMultisig"
+        "Gelato Multisig"
    }
```

```diff
    contract Lisk Multisig (0xECd4150ABbb1EBff13f74e42Fb43C3d78B4E0b45) {
    +++ description: None
      name:
-        "LiskRollupOwnerMultisig"
+        "Lisk Multisig"
    }
```

Generated with discovered.json: 0xb9fc2452852595a5d77859e30ce6235c8124a2d3

# Diff at Tue, 04 Mar 2025 11:25:56 GMT:

- chain: ethereum
- author: Michał Podsiadły (<michal.podsiadly@l2beat.com>)
- comparing to: main@be38e12d3ff947ca8de40f3a23a9ba1875a54f5a block: 21635783
- current block number: 21635783

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21635783 (main branch discovery), not current.

```diff
    contract SystemConfig (0x05f23282FFDCA8286E4738C1aF79079f3d843750) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      values.opStackDA.isSomeTxsLengthEqualToCelestiaDAExample:
-        false
      values.opStackDA.isUsingCelestia:
+        false
    }
```

Generated with discovered.json: 0x404b91a0b9e97ec38559cabb2b48cf3233432f67

# Diff at Tue, 04 Mar 2025 10:39:22 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@98d260b45fe0d2195ce5e629bd7b200c8706e8ba block: 21635783
- current block number: 21635783

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21635783 (main branch discovery), not current.

```diff
    contract SystemConfig (0x05f23282FFDCA8286E4738C1aF79079f3d843750) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      sinceBlock:
+        19788823
    }
```

```diff
    contract L2OutputOracle (0x113cB99283AF242Da0A0C54347667edF531Aa7d6) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      sinceBlock:
+        19788822
    }
```

```diff
    contract L1StandardBridge (0x2658723Bf70c7667De6B25F99fcce13A16D25d08) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      sinceBlock:
+        19788825
    }
```

```diff
    contract SuperchainConfig (0x26C7bFB430d68Bf74d2d52497836d4336b555dE7) {
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      sinceBlock:
+        19788804
    }
```

```diff
    contract OptimismPortal (0x26dB93F8b8b4f7016240af62F7730979d353f9A7) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      sinceBlock:
+        19788820
    }
```

```diff
    contract AddressManager (0x2dF7057d3F25212E51aFEA8dA628668229Ea423f) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      sinceBlock:
+        19788798
    }
```

```diff
    contract L1CrossDomainMessenger (0x31B72D76FB666844C41EdF08dF0254875Dbb7edB) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      sinceBlock:
+        19788827
    }
```

```diff
    contract L1ERC721Bridge (0x3A44A3b263FB631cdbf25f339e2D29497511A81f) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      sinceBlock:
+        19788831
    }
```

```diff
    contract GelatoMultisig (0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb) {
    +++ description: None
      sinceBlock:
+        19521321
    }
```

```diff
    contract OptimismMintableERC20Factory (0xc1dA06CC5DD5cE23bABa924463de7F762039252d) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      sinceBlock:
+        19788829
    }
```

```diff
    contract L1OpUSDCBridgeAdapter (0xE3622468Ea7dD804702B56ca2a4f88C0936995e6) {
    +++ description: Escrow for USDC that uses the canonical bridge for messaging but is governed externally.
      sinceBlock:
+        20865118
    }
```

```diff
    contract ProxyAdmin (0xeC432c4F1d0E12737f3a42a459B84848Af979b2d) {
    +++ description: None
      sinceBlock:
+        19788801
    }
```

```diff
    contract LiskRollupOwnerMultisig (0xECd4150ABbb1EBff13f74e42Fb43C3d78B4E0b45) {
    +++ description: None
      sinceBlock:
+        19788796
    }
```

Generated with discovered.json: 0x4245e6ea71a88f69ede0b5bcb51e9b483296d38f

# Diff at Wed, 26 Feb 2025 10:32:53 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@18513668f913fbe57a197f43655b19111df0e627 block: 21635783
- current block number: 21635783

## Description

config related: added categories for all opstack, op stack and polygoncdk stack templates.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21635783 (main branch discovery), not current.

```diff
    contract SystemConfig (0x05f23282FFDCA8286E4738C1aF79079f3d843750) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract L2OutputOracle (0x113cB99283AF242Da0A0C54347667edF531Aa7d6) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract L1StandardBridge (0x2658723Bf70c7667De6B25F99fcce13A16D25d08) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      category:
+        {"name":"Canonical Bridges","priority":2}
    }
```

```diff
    contract SuperchainConfig (0x26C7bFB430d68Bf74d2d52497836d4336b555dE7) {
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      category:
+        {"name":"Governance","priority":3}
    }
```

```diff
    contract OptimismPortal (0x26dB93F8b8b4f7016240af62F7730979d353f9A7) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract L1CrossDomainMessenger (0x31B72D76FB666844C41EdF08dF0254875Dbb7edB) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      category:
+        {"name":"Canonical Bridges","priority":2}
    }
```

```diff
    contract L1ERC721Bridge (0x3A44A3b263FB631cdbf25f339e2D29497511A81f) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      category:
+        {"name":"Canonical Bridges","priority":2}
    }
```

Generated with discovered.json: 0x3cdf02cc6d4e6138aa5dd98f713585f38ea4b09c

# Diff at Fri, 21 Feb 2025 14:08:22 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@d219f271711b2cf7a164e3443bead5e4957d13a8 block: 21635783
- current block number: 21635783

## Description

Config related: Change some severities and add templates.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21635783 (main branch discovery), not current.

```diff
    contract L2OutputOracle (0x113cB99283AF242Da0A0C54347667edF531Aa7d6) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      fieldMeta.proposer:
+        {"severity":"HIGH"}
      fieldMeta.challenger:
+        {"severity":"HIGH"}
      fieldMeta.deletedOutputs:
+        {"severity":"HIGH"}
    }
```

```diff
    contract GelatoMultisig (0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb) {
    +++ description: None
      severity:
+        "HIGH"
    }
```

Generated with discovered.json: 0x006845ad78ba7264e240685865e10bca42220254

# Diff at Fri, 21 Feb 2025 08:59:40 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1cf9ec35847912163c4b663a633e258a434c0bca block: 21635783
- current block number: 21635783

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21635783 (main branch discovery), not current.

```diff
    contract L1StandardBridge (0x2658723Bf70c7667De6B25F99fcce13A16D25d08) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      categories:
-        ["Gateways&Escrows"]
    }
```

```diff
    contract SuperchainConfig (0x26C7bFB430d68Bf74d2d52497836d4336b555dE7) {
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      categories:
-        ["Upgrades&Governance"]
    }
```

```diff
    contract L1CrossDomainMessenger (0x31B72D76FB666844C41EdF08dF0254875Dbb7edB) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      categories:
-        ["Core"]
    }
```

Generated with discovered.json: 0xd266ca8d8c162ce2daf529f20bbbaca8b0c69048

# Diff at Mon, 10 Feb 2025 19:04:11 GMT:

- chain: ethereum
- author: Michał Podsiadły (<michal.podsiadly@l2beat.com>)
- comparing to: main@3756adff7c1ac86d8af3374a90a75c1999aae2b3 block: 21635783
- current block number: 21635783

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21635783 (main branch discovery), not current.

```diff
    contract SystemConfig (0x05f23282FFDCA8286E4738C1aF79079f3d843750) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      values.opStackDA.isUsingEigenDA:
+        false
    }
```

Generated with discovered.json: 0x64db1d1f4aaa37e25c7224e5bb3815a0776f9e8a

# Diff at Tue, 04 Feb 2025 12:31:38 GMT:

- chain: ethereum
- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@145553eed7ba44636411ecb25e4099728acd02f9 block: 21635783
- current block number: 21635783

## Description

Rename 'configure' permission to 'interact'

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21635783 (main branch discovery), not current.

```diff
    contract SystemConfig (0x05f23282FFDCA8286E4738C1aF79079f3d843750) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      issuedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract AddressManager (0x2dF7057d3F25212E51aFEA8dA628668229Ea423f) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      issuedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract GelatoMultisig (0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb) {
    +++ description: None
      receivedPermissions.4.permission:
-        "guard"
+        "interact"
      receivedPermissions.4.from:
-        "0x26dB93F8b8b4f7016240af62F7730979d353f9A7"
+        "0x2dF7057d3F25212E51aFEA8dA628668229Ea423f"
      receivedPermissions.4.description:
+        "set and change address mappings."
      receivedPermissions.4.via:
+        [{"address":"0xeC432c4F1d0E12737f3a42a459B84848Af979b2d"},{"address":"0xECd4150ABbb1EBff13f74e42Fb43C3d78B4E0b45"}]
      receivedPermissions.3.permission:
-        "guard"
+        "interact"
      receivedPermissions.3.from:
-        "0x26C7bFB430d68Bf74d2d52497836d4336b555dE7"
+        "0x05f23282FFDCA8286E4738C1aF79079f3d843750"
      receivedPermissions.3.description:
+        "it can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system."
      receivedPermissions.2.permission:
-        "configure"
+        "guard"
      receivedPermissions.2.from:
-        "0x2dF7057d3F25212E51aFEA8dA628668229Ea423f"
+        "0x26dB93F8b8b4f7016240af62F7730979d353f9A7"
      receivedPermissions.2.description:
-        "set and change address mappings."
      receivedPermissions.2.via:
-        [{"address":"0xeC432c4F1d0E12737f3a42a459B84848Af979b2d"},{"address":"0xECd4150ABbb1EBff13f74e42Fb43C3d78B4E0b45"}]
      receivedPermissions.1.permission:
-        "configure"
+        "guard"
      receivedPermissions.1.from:
-        "0x05f23282FFDCA8286E4738C1aF79079f3d843750"
+        "0x26C7bFB430d68Bf74d2d52497836d4336b555dE7"
      receivedPermissions.1.description:
-        "it can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system."
    }
```

```diff
    contract ProxyAdmin (0xeC432c4F1d0E12737f3a42a459B84848Af979b2d) {
    +++ description: None
      directlyReceivedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

Generated with discovered.json: 0x76000d31756d58b56febb27b960e896b554029ca

# Diff at Mon, 20 Jan 2025 11:09:42 GMT:

- chain: ethereum
- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@2c8b4f3d9910bb6371be9b4df87b70856e7d8c64 block: 21635783
- current block number: 21635783

## Description

Rerun on the same block number. Applies fixes to permissions and via field. Renames permission's target to to/from.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21635783 (main branch discovery), not current.

```diff
    contract SystemConfig (0x05f23282FFDCA8286E4738C1aF79079f3d843750) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      issuedPermissions.2.target:
-        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
      issuedPermissions.2.via.1.delay:
-        0
      issuedPermissions.2.via.0.delay:
-        0
      issuedPermissions.2.to:
+        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
      issuedPermissions.1.target:
-        "0xa6Ea2f3299b63c53143c993d2d5E60A69Cd6Fe24"
      issuedPermissions.1.to:
+        "0xa6Ea2f3299b63c53143c993d2d5E60A69Cd6Fe24"
      issuedPermissions.0.target:
-        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
      issuedPermissions.0.to:
+        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
      issuedPermissions.0.description:
+        "it can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system."
    }
```

```diff
    contract L2OutputOracle (0x113cB99283AF242Da0A0C54347667edF531Aa7d6) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      issuedPermissions.2.target:
-        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
      issuedPermissions.2.via.1.delay:
-        0
      issuedPermissions.2.via.0.delay:
-        0
      issuedPermissions.2.to:
+        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
      issuedPermissions.1.target:
-        "0x0AbD6da1cE10D1cD6c7C9C14b905786D20f3EB23"
      issuedPermissions.1.to:
+        "0x0AbD6da1cE10D1cD6c7C9C14b905786D20f3EB23"
      issuedPermissions.0.target:
-        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
      issuedPermissions.0.to:
+        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
    }
```

```diff
    contract L1StandardBridge (0x2658723Bf70c7667De6B25F99fcce13A16D25d08) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      issuedPermissions.0.target:
-        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
      issuedPermissions.0.via.1.delay:
-        0
      issuedPermissions.0.via.1.description:
-        "upgrading the bridge implementation can give access to all funds escrowed therein."
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
      issuedPermissions.0.description:
+        "upgrading the bridge implementation can give access to all funds escrowed therein."
    }
```

```diff
    contract SuperchainConfig (0x26C7bFB430d68Bf74d2d52497836d4336b555dE7) {
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      issuedPermissions.1.target:
-        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
      issuedPermissions.1.via.1.delay:
-        0
      issuedPermissions.1.via.0.delay:
-        0
      issuedPermissions.1.to:
+        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
      issuedPermissions.0.target:
-        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
      issuedPermissions.0.to:
+        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
    }
```

```diff
    contract OptimismPortal (0x26dB93F8b8b4f7016240af62F7730979d353f9A7) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      issuedPermissions.1.target:
-        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
      issuedPermissions.1.via.1.delay:
-        0
      issuedPermissions.1.via.0.delay:
-        0
      issuedPermissions.1.to:
+        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
      issuedPermissions.0.target:
-        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
      issuedPermissions.0.to:
+        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
    }
```

```diff
    contract AddressManager (0x2dF7057d3F25212E51aFEA8dA628668229Ea423f) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      issuedPermissions.0.target:
-        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
      issuedPermissions.0.via.1.delay:
-        0
      issuedPermissions.0.via.1.description:
-        "set and change address mappings."
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
      issuedPermissions.0.description:
+        "set and change address mappings."
    }
```

```diff
    contract L1ERC721Bridge (0x3A44A3b263FB631cdbf25f339e2D29497511A81f) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      issuedPermissions.0.target:
-        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
      issuedPermissions.0.via.1.delay:
-        0
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
    }
```

```diff
    contract GelatoMultisig (0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb) {
    +++ description: None
      receivedPermissions.11.target:
-        "0xc1dA06CC5DD5cE23bABa924463de7F762039252d"
      receivedPermissions.11.from:
+        "0xc1dA06CC5DD5cE23bABa924463de7F762039252d"
      receivedPermissions.10.target:
-        "0x3A44A3b263FB631cdbf25f339e2D29497511A81f"
      receivedPermissions.10.from:
+        "0x3A44A3b263FB631cdbf25f339e2D29497511A81f"
      receivedPermissions.9.target:
-        "0x26dB93F8b8b4f7016240af62F7730979d353f9A7"
      receivedPermissions.9.from:
+        "0x26dB93F8b8b4f7016240af62F7730979d353f9A7"
      receivedPermissions.8.target:
-        "0x26C7bFB430d68Bf74d2d52497836d4336b555dE7"
      receivedPermissions.8.from:
+        "0x26C7bFB430d68Bf74d2d52497836d4336b555dE7"
      receivedPermissions.7.target:
-        "0x2658723Bf70c7667De6B25F99fcce13A16D25d08"
      receivedPermissions.7.from:
+        "0x2658723Bf70c7667De6B25F99fcce13A16D25d08"
      receivedPermissions.6.target:
-        "0x113cB99283AF242Da0A0C54347667edF531Aa7d6"
      receivedPermissions.6.from:
+        "0x113cB99283AF242Da0A0C54347667edF531Aa7d6"
      receivedPermissions.5.target:
-        "0x05f23282FFDCA8286E4738C1aF79079f3d843750"
      receivedPermissions.5.from:
+        "0x05f23282FFDCA8286E4738C1aF79079f3d843750"
      receivedPermissions.4.target:
-        "0x26dB93F8b8b4f7016240af62F7730979d353f9A7"
      receivedPermissions.4.from:
+        "0x26dB93F8b8b4f7016240af62F7730979d353f9A7"
      receivedPermissions.3.target:
-        "0x26C7bFB430d68Bf74d2d52497836d4336b555dE7"
      receivedPermissions.3.from:
+        "0x26C7bFB430d68Bf74d2d52497836d4336b555dE7"
      receivedPermissions.2.target:
-        "0x2dF7057d3F25212E51aFEA8dA628668229Ea423f"
      receivedPermissions.2.from:
+        "0x2dF7057d3F25212E51aFEA8dA628668229Ea423f"
      receivedPermissions.1.target:
-        "0x05f23282FFDCA8286E4738C1aF79079f3d843750"
      receivedPermissions.1.from:
+        "0x05f23282FFDCA8286E4738C1aF79079f3d843750"
      receivedPermissions.0.target:
-        "0x113cB99283AF242Da0A0C54347667edF531Aa7d6"
      receivedPermissions.0.from:
+        "0x113cB99283AF242Da0A0C54347667edF531Aa7d6"
    }
```

```diff
    contract OptimismMintableERC20Factory (0xc1dA06CC5DD5cE23bABa924463de7F762039252d) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      issuedPermissions.0.target:
-        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
      issuedPermissions.0.via.1.delay:
-        0
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
    }
```

```diff
    contract ProxyAdmin (0xeC432c4F1d0E12737f3a42a459B84848Af979b2d) {
    +++ description: None
      directlyReceivedPermissions.7.target:
-        "0xc1dA06CC5DD5cE23bABa924463de7F762039252d"
      directlyReceivedPermissions.7.from:
+        "0xc1dA06CC5DD5cE23bABa924463de7F762039252d"
      directlyReceivedPermissions.6.target:
-        "0x3A44A3b263FB631cdbf25f339e2D29497511A81f"
      directlyReceivedPermissions.6.from:
+        "0x3A44A3b263FB631cdbf25f339e2D29497511A81f"
      directlyReceivedPermissions.5.target:
-        "0x26dB93F8b8b4f7016240af62F7730979d353f9A7"
      directlyReceivedPermissions.5.from:
+        "0x26dB93F8b8b4f7016240af62F7730979d353f9A7"
      directlyReceivedPermissions.4.target:
-        "0x26C7bFB430d68Bf74d2d52497836d4336b555dE7"
      directlyReceivedPermissions.4.from:
+        "0x26C7bFB430d68Bf74d2d52497836d4336b555dE7"
      directlyReceivedPermissions.3.target:
-        "0x2658723Bf70c7667De6B25F99fcce13A16D25d08"
      directlyReceivedPermissions.3.from:
+        "0x2658723Bf70c7667De6B25F99fcce13A16D25d08"
      directlyReceivedPermissions.2.target:
-        "0x113cB99283AF242Da0A0C54347667edF531Aa7d6"
      directlyReceivedPermissions.2.from:
+        "0x113cB99283AF242Da0A0C54347667edF531Aa7d6"
      directlyReceivedPermissions.1.target:
-        "0x05f23282FFDCA8286E4738C1aF79079f3d843750"
      directlyReceivedPermissions.1.from:
+        "0x05f23282FFDCA8286E4738C1aF79079f3d843750"
      directlyReceivedPermissions.0.target:
-        "0x2dF7057d3F25212E51aFEA8dA628668229Ea423f"
      directlyReceivedPermissions.0.from:
+        "0x2dF7057d3F25212E51aFEA8dA628668229Ea423f"
    }
```

```diff
    contract LiskRollupOwnerMultisig (0xECd4150ABbb1EBff13f74e42Fb43C3d78B4E0b45) {
    +++ description: None
      directlyReceivedPermissions.0.target:
-        "0xeC432c4F1d0E12737f3a42a459B84848Af979b2d"
      directlyReceivedPermissions.0.from:
+        "0xeC432c4F1d0E12737f3a42a459B84848Af979b2d"
    }
```

Generated with discovered.json: 0x2869029ba963ae7645a09f7662eeab1fa9595eb1

# Diff at Thu, 16 Jan 2025 08:14:39 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@a739892e4565ca2cf8f67abed360c494a770dcea block: 21628398
- current block number: 21635783

## Description

Gas limit doubled to 60M.

## Watched changes

```diff
    contract SystemConfig (0x05f23282FFDCA8286E4738C1aF79079f3d843750) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
+++ description: Gas limit for blocks on L2.
+++ severity: LOW
      values.gasLimit:
-        30000000
+        60000000
    }
```

Generated with discovered.json: 0x47c7010c9b019fc821f8fc9e972898eea4eab874

# Diff at Wed, 15 Jan 2025 07:30:12 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@3ea176aee1470e5ec80e65adfc81a954f84584d8 block: 21343018
- current block number: 21628398

## Description

Two signers added to Gelato MS, now 4/10.

## Watched changes

```diff
    contract GelatoMultisig (0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb) {
    +++ description: None
      values.$members.9:
+        "0x547D0F472309e4239b296D01e03bEDc101241a26"
      values.$members.8:
+        "0xf83bC4688979b13Da02CB94c76cEB169540760b5"
      values.$members.7:
-        "0x547D0F472309e4239b296D01e03bEDc101241a26"
+        "0x01a0A7BaAAca31AFB5b770FeFD69CE4917D9c32e"
      values.$members.6:
-        "0xf83bC4688979b13Da02CB94c76cEB169540760b5"
+        "0x88De44422E1b1c30bc530c35aEdb9f5aD0e6fD52"
      values.$members.5:
-        "0x01a0A7BaAAca31AFB5b770FeFD69CE4917D9c32e"
+        "0x5bE3E96Cdc3A97628bD7308d3588B9a474F4A54d"
      values.$members.4:
-        "0xBc0ca6865d6883a83D4aDDD6b862aE042d855E0d"
+        "0x691C2EF68e25E620fa6cAdE2728f6aE34F37aAD2"
      values.$members.3:
-        "0x5bE3E96Cdc3A97628bD7308d3588B9a474F4A54d"
+        "0x28bB9385A588EF4747264D19B9A9F1603591680c"
      values.$members.2:
-        "0x691C2EF68e25E620fa6cAdE2728f6aE34F37aAD2"
+        "0xB0C2CBFfCd4C31AFFEe14993b6d48f99D285f621"
      values.$members.1:
-        "0x28bB9385A588EF4747264D19B9A9F1603591680c"
+        "0xB65540bBA534E88EB4a5062D0E6519C07063b259"
      values.$members.0:
-        "0xB0C2CBFfCd4C31AFFEe14993b6d48f99D285f621"
+        "0x349f3839012DB2271e1BeC68F1668471D175Adb9"
      values.multisigThreshold:
-        "4 of 8 (50%)"
+        "4 of 10 (40%)"
    }
```

Generated with discovered.json: 0xbb9eeffc226264cb17a75017f4162fe347bdfc0d

# Diff at Wed, 08 Jan 2025 09:02:41 GMT:

- chain: ethereum
- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@deefa974378c2cd6b74f061e1f5a494bbbe1d63a block: 21343018
- current block number: 21343018

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21343018 (main branch discovery), not current.

```diff
    contract L1StandardBridge (0x2658723Bf70c7667De6B25F99fcce13A16D25d08) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      description:
-        "The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token."
+        "The main entry point to deposit ERC20 tokens from host chain to this chain."
    }
```

Generated with discovered.json: 0xb692a1191b502cd01b681db4ab87a83ad01c9835

# Diff at Fri, 06 Dec 2024 11:00:47 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@da76f61d2c06d695d89e2429e2266a54932319a2 block: 21078724
- current block number: 21343018

## Description

Add external USDC escrow.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21078724 (main branch discovery), not current.

```diff
+   Status: CREATED
    contract L1OpUSDCBridgeAdapter (0xE3622468Ea7dD804702B56ca2a4f88C0936995e6)
    +++ description: Escrow for USDC that uses the canonical bridge for messaging but is governed externally.
```

Generated with discovered.json: 0x4643eb50cf7ef31cd03bbcb51f9bd08800a664c8

# Diff at Fri, 01 Nov 2024 12:23:32 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@cd1f0e71bb08ce16b2084a11b768538e8aa6ba8c block: 21078724
- current block number: 21078724

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21078724 (main branch discovery), not current.

```diff
    contract L1StandardBridge (0x2658723Bf70c7667De6B25F99fcce13A16D25d08) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token.
      issuedPermissions.0.via.1.description:
-        "upgrading bridge implementation allows to access all funds and change every system component."
+        "upgrading the bridge implementation can give access to all funds escrowed therein."
    }
```

```diff
    contract SuperchainConfig (0x26C7bFB430d68Bf74d2d52497836d4336b555dE7) {
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      description:
-        "This is NOT the shared SuperchainConfig of the OP stack Superchain. This SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system."
+        "This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system."
    }
```

```diff
    contract GelatoMultisig (0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb) {
    +++ description: None
      receivedPermissions.7.description:
-        "upgrading bridge implementation allows to access all funds and change every system component."
+        "upgrading the bridge implementation can give access to all funds escrowed therein."
    }
```

```diff
    contract ProxyAdmin (0xeC432c4F1d0E12737f3a42a459B84848Af979b2d) {
    +++ description: None
      directlyReceivedPermissions.3.description:
-        "upgrading bridge implementation allows to access all funds and change every system component."
+        "upgrading the bridge implementation can give access to all funds escrowed therein."
    }
```

Generated with discovered.json: 0x1595c2bb52291e5edea61159da4d34466d89e118

# Diff at Wed, 30 Oct 2024 13:22:20 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@0a8a53530022c6c5edd257c3682a3e7f80d0c550 block: 20941810
- current block number: 21078724

## Description

GelatoMS: Signer removed, threshold decreased.

## Watched changes

```diff
    contract GelatoMultisig (0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb) {
    +++ description: None
      values.$members.8:
-        "0x547D0F472309e4239b296D01e03bEDc101241a26"
      values.$members.7:
-        "0xf83bC4688979b13Da02CB94c76cEB169540760b5"
+        "0x547D0F472309e4239b296D01e03bEDc101241a26"
      values.$members.6:
-        "0x01a0A7BaAAca31AFB5b770FeFD69CE4917D9c32e"
+        "0xf83bC4688979b13Da02CB94c76cEB169540760b5"
      values.$members.5:
-        "0xc85aC6d2fdC376F335455D4cCA30c45ED1080849"
+        "0x01a0A7BaAAca31AFB5b770FeFD69CE4917D9c32e"
      values.$threshold:
-        6
+        4
      values.multisigThreshold:
-        "6 of 9 (67%)"
+        "4 of 8 (50%)"
    }
```

Generated with discovered.json: 0x198f883b6f8dc6ff7e56c16f98997a93a2c53f84

# Diff at Tue, 29 Oct 2024 13:10:12 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@7b3fc9dc9074e1d423b48522c3f0273c86aab54a block: 20941810
- current block number: 20941810

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20941810 (main branch discovery), not current.

```diff
    contract L2OutputOracle (0x113cB99283AF242Da0A0C54347667edF531Aa7d6) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      fieldMeta:
+        {"FINALIZATION_PERIOD_SECONDS":{"description":"Challenge period (Number of seconds until a state root is finalized)."}}
    }
```

Generated with discovered.json: 0x49a5fcb52e9729c0dab86a13c3f3fc7f897a7def

# Diff at Tue, 22 Oct 2024 13:50:24 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@c4e420ffba204be049626040a9ea287e023948f8 block: 20941810
- current block number: 20941810

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20941810 (main branch discovery), not current.

```diff
    contract SuperchainConfig (0x26C7bFB430d68Bf74d2d52497836d4336b555dE7) {
    +++ description: This is NOT the shared SuperchainConfig of the OP stack Superchain. This SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      template:
-        "opstack/SuperchainConfig"
+        "opstack/SuperchainConfigFake"
      description:
-        "Used to manage global configuration values for multiple OP Chains within a single Superchain network. The SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the Superchain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system."
+        "This is NOT the shared SuperchainConfig of the OP stack Superchain. This SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system."
    }
```

Generated with discovered.json: 0xa92bbe11ff93f5e94854f4307b9c398c69965a0b

# Diff at Mon, 21 Oct 2024 12:45:35 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@e660599f23a07618fe949a07be1f516ce44f1914 block: 20941810
- current block number: 20941810

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20941810 (main branch discovery), not current.

```diff
    contract SystemConfig (0x05f23282FFDCA8286E4738C1aF79079f3d843750) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      descriptions:
-        ["Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address."]
      description:
+        "Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address."
    }
```

```diff
    contract L2OutputOracle (0x113cB99283AF242Da0A0C54347667edF531Aa7d6) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      descriptions:
-        ["Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots."]
      description:
+        "Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots."
    }
```

```diff
    contract L1StandardBridge (0x2658723Bf70c7667De6B25F99fcce13A16D25d08) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token.
      descriptions:
-        ["The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token."]
      description:
+        "The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token."
    }
```

```diff
    contract SuperchainConfig (0x26C7bFB430d68Bf74d2d52497836d4336b555dE7) {
    +++ description: Used to manage global configuration values for multiple OP Chains within a single Superchain network. The SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the Superchain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      descriptions:
-        ["Used to manage global configuration values for multiple OP Chains within a single Superchain network. The SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the Superchain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system."]
      description:
+        "Used to manage global configuration values for multiple OP Chains within a single Superchain network. The SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the Superchain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system."
    }
```

```diff
    contract OptimismPortal (0x26dB93F8b8b4f7016240af62F7730979d353f9A7) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      descriptions:
-        ["The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals."]
      description:
+        "The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals."
    }
```

```diff
    contract AddressManager (0x2dF7057d3F25212E51aFEA8dA628668229Ea423f) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      descriptions:
-        ["Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts."]
      description:
+        "Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts."
    }
```

```diff
    contract L1CrossDomainMessenger (0x31B72D76FB666844C41EdF08dF0254875Dbb7edB) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      descriptions:
-        ["Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function."]
      description:
+        "Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function."
    }
```

```diff
    contract L1ERC721Bridge (0x3A44A3b263FB631cdbf25f339e2D29497511A81f) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      descriptions:
-        ["Used to bridge ERC-721 tokens from host chain to this chain."]
      description:
+        "Used to bridge ERC-721 tokens from host chain to this chain."
    }
```

```diff
    contract OptimismMintableERC20Factory (0xc1dA06CC5DD5cE23bABa924463de7F762039252d) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      descriptions:
-        ["A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa."]
      description:
+        "A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa."
    }
```

Generated with discovered.json: 0xcff24f05f9be6465f44ce3160477e6743d8c5698

# Diff at Mon, 21 Oct 2024 11:07:18 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@8895d33866f5665c4c710f4ddaa32bfa63cc3c78 block: 20941810
- current block number: 20941810

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20941810 (main branch discovery), not current.

```diff
    contract SystemConfig (0x05f23282FFDCA8286E4738C1aF79079f3d843750) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      values.$pastUpgrades.0.2:
+        ["0xc6cF1149d23F2788AC94312E68EB52a74F288ebe"]
      values.$pastUpgrades.0.1:
-        ["0xc6cF1149d23F2788AC94312E68EB52a74F288ebe"]
+        "0xc11b949a2d36badaad0e61d755725b252de22d520f00c496c4a9d3b8cbb8a3b2"
    }
```

```diff
    contract L2OutputOracle (0x113cB99283AF242Da0A0C54347667edF531Aa7d6) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      values.$pastUpgrades.2.2:
+        ["0xe8912070277Dd5D9473904b7F4e6C71290F2AE90"]
      values.$pastUpgrades.2.1:
-        ["0xe8912070277Dd5D9473904b7F4e6C71290F2AE90"]
+        "0x0f93b344ebb035d302c35ca71e44da57db2f85df8895e5ddd2f9229245922785"
      values.$pastUpgrades.1.2:
+        ["0x4a8515A656BF683cCdabc27C25610223033b594e"]
      values.$pastUpgrades.1.1:
-        ["0x4a8515A656BF683cCdabc27C25610223033b594e"]
+        "0x0f93b344ebb035d302c35ca71e44da57db2f85df8895e5ddd2f9229245922785"
      values.$pastUpgrades.0.2:
+        ["0xe8912070277Dd5D9473904b7F4e6C71290F2AE90"]
      values.$pastUpgrades.0.1:
-        ["0xe8912070277Dd5D9473904b7F4e6C71290F2AE90"]
+        "0x26fede05b0c5857b3171d848447a7b8303ac46bc8c52de81eee10aea983c6d92"
    }
```

```diff
    contract SuperchainConfig (0x26C7bFB430d68Bf74d2d52497836d4336b555dE7) {
    +++ description: Used to manage global configuration values for multiple OP Chains within a single Superchain network. The SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the Superchain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      values.$pastUpgrades.2.2:
+        ["0xd637dc6d7DA9151b5069a4bFB74a12E67a532CC3"]
      values.$pastUpgrades.2.1:
-        ["0xd637dc6d7DA9151b5069a4bFB74a12E67a532CC3"]
+        "0x118a7068dc6193af0c0ee92c1c5c109135517c54bd86a8cbb65c8380962de332"
      values.$pastUpgrades.1.2:
+        ["0x4a8515A656BF683cCdabc27C25610223033b594e"]
      values.$pastUpgrades.1.1:
-        ["0x4a8515A656BF683cCdabc27C25610223033b594e"]
+        "0x118a7068dc6193af0c0ee92c1c5c109135517c54bd86a8cbb65c8380962de332"
      values.$pastUpgrades.0.2:
+        ["0xd637dc6d7DA9151b5069a4bFB74a12E67a532CC3"]
      values.$pastUpgrades.0.1:
-        ["0xd637dc6d7DA9151b5069a4bFB74a12E67a532CC3"]
+        "0x46970f847dcde9d9c041d68ef64608e478a6857b80c57c8651ae535c4f4b3f36"
    }
```

```diff
    contract OptimismPortal (0x26dB93F8b8b4f7016240af62F7730979d353f9A7) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      values.$pastUpgrades.0.2:
+        ["0x3Ff11Cde41a5f7c791eFfcd6AeEA05dd2df5e21e"]
      values.$pastUpgrades.0.1:
-        ["0x3Ff11Cde41a5f7c791eFfcd6AeEA05dd2df5e21e"]
+        "0x4194ea6fa29f5dd080b647267726a7f0b36d277f46019550706335c763ac352d"
    }
```

```diff
    contract L1CrossDomainMessenger (0x31B72D76FB666844C41EdF08dF0254875Dbb7edB) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      values.$pastUpgrades.0.2:
+        ["0x0318A37e2662507789a6E17E85A506709F89488b"]
      values.$pastUpgrades.0.1:
-        ["0x0318A37e2662507789a6E17E85A506709F89488b"]
+        "0xfae1f2f01e0de9b66095de3faf83be79326792924394411ebef79b3c4d3314b9"
    }
```

```diff
    contract L1ERC721Bridge (0x3A44A3b263FB631cdbf25f339e2D29497511A81f) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      values.$pastUpgrades.0.2:
+        ["0xefBDff012170ae592A3d197bf9Ac10eBF313233a"]
      values.$pastUpgrades.0.1:
-        ["0xefBDff012170ae592A3d197bf9Ac10eBF313233a"]
+        "0x27155d16a9584317f4c13bac90f9b3ff0b1df01ff4f7360bcddfb343e6b61d50"
    }
```

```diff
    contract OptimismMintableERC20Factory (0xc1dA06CC5DD5cE23bABa924463de7F762039252d) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      values.$pastUpgrades.0.2:
+        ["0xD00e38514d66bf1B761a8937559c6b2854A5B3ad"]
      values.$pastUpgrades.0.1:
-        ["0xD00e38514d66bf1B761a8937559c6b2854A5B3ad"]
+        "0xc8310656324ea8f2f677190f579a9f950979ba83586245df990cdbf8f82b9fd0"
    }
```

Generated with discovered.json: 0x93482259fc8eab2995472f9ebe88ea8e87676318

# Diff at Wed, 16 Oct 2024 11:37:27 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@a3d139b799cc0b28e5e912febb17464d4e5aef5d block: 20941810
- current block number: 20941810

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20941810 (main branch discovery), not current.

```diff
    contract SystemConfig (0x05f23282FFDCA8286E4738C1aF79079f3d843750) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      issuedPermissions.2:
+        {"permission":"upgrade","target":"0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb","via":[{"address":"0xECd4150ABbb1EBff13f74e42Fb43C3d78B4E0b45","delay":0},{"address":"0xeC432c4F1d0E12737f3a42a459B84848Af979b2d","delay":0}]}
      issuedPermissions.1.permission:
-        "upgrade"
+        "sequence"
      issuedPermissions.1.target:
-        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
+        "0xa6Ea2f3299b63c53143c993d2d5E60A69Cd6Fe24"
      issuedPermissions.1.via.1:
-        {"address":"0xeC432c4F1d0E12737f3a42a459B84848Af979b2d","delay":0}
      issuedPermissions.1.via.0:
-        {"address":"0xECd4150ABbb1EBff13f74e42Fb43C3d78B4E0b45","delay":0}
    }
```

```diff
    contract L2OutputOracle (0x113cB99283AF242Da0A0C54347667edF531Aa7d6) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      issuedPermissions.2:
+        {"permission":"upgrade","target":"0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb","via":[{"address":"0xECd4150ABbb1EBff13f74e42Fb43C3d78B4E0b45","delay":0},{"address":"0xeC432c4F1d0E12737f3a42a459B84848Af979b2d","delay":0}]}
      issuedPermissions.1:
+        {"permission":"propose","target":"0x0AbD6da1cE10D1cD6c7C9C14b905786D20f3EB23","via":[]}
      issuedPermissions.0.permission:
-        "upgrade"
+        "challenge"
      issuedPermissions.0.via.1:
-        {"address":"0xeC432c4F1d0E12737f3a42a459B84848Af979b2d","delay":0}
      issuedPermissions.0.via.0:
-        {"address":"0xECd4150ABbb1EBff13f74e42Fb43C3d78B4E0b45","delay":0}
    }
```

```diff
    contract SuperchainConfig (0x26C7bFB430d68Bf74d2d52497836d4336b555dE7) {
    +++ description: Used to manage global configuration values for multiple OP Chains within a single Superchain network. The SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the Superchain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      issuedPermissions.1:
+        {"permission":"upgrade","target":"0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb","via":[{"address":"0xECd4150ABbb1EBff13f74e42Fb43C3d78B4E0b45","delay":0},{"address":"0xeC432c4F1d0E12737f3a42a459B84848Af979b2d","delay":0}]}
      issuedPermissions.0.permission:
-        "upgrade"
+        "guard"
      issuedPermissions.0.via.1:
-        {"address":"0xeC432c4F1d0E12737f3a42a459B84848Af979b2d","delay":0}
      issuedPermissions.0.via.0:
-        {"address":"0xECd4150ABbb1EBff13f74e42Fb43C3d78B4E0b45","delay":0}
    }
```

```diff
    contract OptimismPortal (0x26dB93F8b8b4f7016240af62F7730979d353f9A7) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      issuedPermissions.1:
+        {"permission":"upgrade","target":"0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb","via":[{"address":"0xECd4150ABbb1EBff13f74e42Fb43C3d78B4E0b45","delay":0},{"address":"0xeC432c4F1d0E12737f3a42a459B84848Af979b2d","delay":0}]}
      issuedPermissions.0.permission:
-        "upgrade"
+        "guard"
      issuedPermissions.0.via.1:
-        {"address":"0xeC432c4F1d0E12737f3a42a459B84848Af979b2d","delay":0}
      issuedPermissions.0.via.0:
-        {"address":"0xECd4150ABbb1EBff13f74e42Fb43C3d78B4E0b45","delay":0}
    }
```

```diff
    contract GelatoMultisig (0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb) {
    +++ description: None
      roles:
-        ["Challenger","Guardian"]
      receivedPermissions.11:
+        {"permission":"upgrade","target":"0xc1dA06CC5DD5cE23bABa924463de7F762039252d","via":[{"address":"0xeC432c4F1d0E12737f3a42a459B84848Af979b2d"},{"address":"0xECd4150ABbb1EBff13f74e42Fb43C3d78B4E0b45"}]}
      receivedPermissions.10:
+        {"permission":"upgrade","target":"0x3A44A3b263FB631cdbf25f339e2D29497511A81f","via":[{"address":"0xeC432c4F1d0E12737f3a42a459B84848Af979b2d"},{"address":"0xECd4150ABbb1EBff13f74e42Fb43C3d78B4E0b45"}]}
      receivedPermissions.9:
+        {"permission":"upgrade","target":"0x26dB93F8b8b4f7016240af62F7730979d353f9A7","via":[{"address":"0xeC432c4F1d0E12737f3a42a459B84848Af979b2d"},{"address":"0xECd4150ABbb1EBff13f74e42Fb43C3d78B4E0b45"}]}
      receivedPermissions.8.target:
-        "0xc1dA06CC5DD5cE23bABa924463de7F762039252d"
+        "0x26C7bFB430d68Bf74d2d52497836d4336b555dE7"
      receivedPermissions.7.target:
-        "0x3A44A3b263FB631cdbf25f339e2D29497511A81f"
+        "0x2658723Bf70c7667De6B25F99fcce13A16D25d08"
      receivedPermissions.7.description:
+        "upgrading bridge implementation allows to access all funds and change every system component."
      receivedPermissions.6.target:
-        "0x26dB93F8b8b4f7016240af62F7730979d353f9A7"
+        "0x113cB99283AF242Da0A0C54347667edF531Aa7d6"
      receivedPermissions.5.target:
-        "0x26C7bFB430d68Bf74d2d52497836d4336b555dE7"
+        "0x05f23282FFDCA8286E4738C1aF79079f3d843750"
      receivedPermissions.4.permission:
-        "upgrade"
+        "guard"
      receivedPermissions.4.target:
-        "0x2658723Bf70c7667De6B25F99fcce13A16D25d08"
+        "0x26dB93F8b8b4f7016240af62F7730979d353f9A7"
      receivedPermissions.4.description:
-        "upgrading bridge implementation allows to access all funds and change every system component."
      receivedPermissions.4.via:
-        [{"address":"0xeC432c4F1d0E12737f3a42a459B84848Af979b2d"},{"address":"0xECd4150ABbb1EBff13f74e42Fb43C3d78B4E0b45"}]
      receivedPermissions.3.permission:
-        "upgrade"
+        "guard"
      receivedPermissions.3.target:
-        "0x113cB99283AF242Da0A0C54347667edF531Aa7d6"
+        "0x26C7bFB430d68Bf74d2d52497836d4336b555dE7"
      receivedPermissions.3.via:
-        [{"address":"0xeC432c4F1d0E12737f3a42a459B84848Af979b2d"},{"address":"0xECd4150ABbb1EBff13f74e42Fb43C3d78B4E0b45"}]
      receivedPermissions.2.permission:
-        "upgrade"
+        "configure"
      receivedPermissions.2.target:
-        "0x05f23282FFDCA8286E4738C1aF79079f3d843750"
+        "0x2dF7057d3F25212E51aFEA8dA628668229Ea423f"
      receivedPermissions.2.description:
+        "set and change address mappings."
      receivedPermissions.1.target:
-        "0x2dF7057d3F25212E51aFEA8dA628668229Ea423f"
+        "0x05f23282FFDCA8286E4738C1aF79079f3d843750"
      receivedPermissions.1.description:
-        "set and change address mappings."
+        "it can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system."
      receivedPermissions.1.via:
-        [{"address":"0xeC432c4F1d0E12737f3a42a459B84848Af979b2d"},{"address":"0xECd4150ABbb1EBff13f74e42Fb43C3d78B4E0b45"}]
      receivedPermissions.0.permission:
-        "configure"
+        "challenge"
      receivedPermissions.0.target:
-        "0x05f23282FFDCA8286E4738C1aF79079f3d843750"
+        "0x113cB99283AF242Da0A0C54347667edF531Aa7d6"
      receivedPermissions.0.description:
-        "it can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system."
    }
```

Generated with discovered.json: 0x0a554f5ef66c77ababf423e17d7ffff609c1c32f

# Diff at Mon, 14 Oct 2024 10:52:36 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1afc77ff111ceb0970e7d09efcc7b2f376b0c281 block: 20941810
- current block number: 20941810

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20941810 (main branch discovery), not current.

```diff
    contract SystemConfig (0x05f23282FFDCA8286E4738C1aF79079f3d843750) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      sourceHashes:
+        ["0x7913a1d7d0c47796c94eb6f8fd87a89ae9f2716eda57c9be4fd2b27c70bed617","0xdf9a11b46747139bfe0135df8a65a2728a2dbd60a689e2398c45627915cdd752"]
    }
```

```diff
    contract L2OutputOracle (0x113cB99283AF242Da0A0C54347667edF531Aa7d6) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      sourceHashes:
+        ["0x7913a1d7d0c47796c94eb6f8fd87a89ae9f2716eda57c9be4fd2b27c70bed617","0x025c187b0231be4785898f25f98d749f953f5d06781772aef242812e2ecf52e3"]
    }
```

```diff
    contract L1StandardBridge (0x2658723Bf70c7667De6B25F99fcce13A16D25d08) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token.
      sourceHashes:
+        ["0xbfb58685ff2f2f07eaa01a3c4e3c33c97686bfd3ae7c50c49f9da6ef5098cb31","0x1010ff7f40ab4d53e6d9996aefa04423dabe9d0e22fac2d02b330ed3aa2c5740"]
    }
```

```diff
    contract SuperchainConfig (0x26C7bFB430d68Bf74d2d52497836d4336b555dE7) {
    +++ description: Used to manage global configuration values for multiple OP Chains within a single Superchain network. The SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the Superchain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      sourceHashes:
+        ["0x7913a1d7d0c47796c94eb6f8fd87a89ae9f2716eda57c9be4fd2b27c70bed617","0x3ac96c9c95e25f689f65a50f24b325e3f891029cb1cea96dc642418bbb535b1d"]
    }
```

```diff
    contract OptimismPortal (0x26dB93F8b8b4f7016240af62F7730979d353f9A7) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      sourceHashes:
+        ["0x7913a1d7d0c47796c94eb6f8fd87a89ae9f2716eda57c9be4fd2b27c70bed617","0xe35fb7bc0433439337b3eadda3d6fb7991918162f62a337a695e8c7f948cdd35"]
    }
```

```diff
    contract AddressManager (0x2dF7057d3F25212E51aFEA8dA628668229Ea423f) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      sourceHashes:
+        ["0xdc86a850f11dc2b5c0472a05d0e3c14f239baf2c3b1ab19631591b0827985380"]
    }
```

```diff
    contract L1CrossDomainMessenger (0x31B72D76FB666844C41EdF08dF0254875Dbb7edB) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      sourceHashes:
+        ["0x20a2eb4d3677fc8a15e944f7b1843acd01b2e92acdc4c7a7f7a35b07b891149b","0x1cc8a3b7de3d2c54c4706bb3f3015714d3b56647fc9fbfd6f8b068f5f63c1c25"]
    }
```

```diff
    contract L1ERC721Bridge (0x3A44A3b263FB631cdbf25f339e2D29497511A81f) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      sourceHashes:
+        ["0x7913a1d7d0c47796c94eb6f8fd87a89ae9f2716eda57c9be4fd2b27c70bed617","0x482ec6e91304ac39a3fb4505634427bddfddee23b8e93a4f7f995ca5083ae3c3"]
    }
```

```diff
    contract GelatoMultisig (0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb) {
    +++ description: None
      sourceHashes:
+        ["0x81a7349eebb98ac33b0bc6842e3cb258034a8f2a4ba004570bb8e2e25947f9ff","0xd42bbf9f7dcd3720a7fc6bdc6edfdfae8800a37d6dd4decfa0ef6ca4a2e88940"]
    }
```

```diff
    contract OptimismMintableERC20Factory (0xc1dA06CC5DD5cE23bABa924463de7F762039252d) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      sourceHashes:
+        ["0x7913a1d7d0c47796c94eb6f8fd87a89ae9f2716eda57c9be4fd2b27c70bed617","0x4c5ac4e53576924cabbd2a471f368a541bc3f4b1f53fa41a389692fcc62f6176"]
    }
```

```diff
    contract ProxyAdmin (0xeC432c4F1d0E12737f3a42a459B84848Af979b2d) {
    +++ description: None
      template:
-        "opstack/ProxyAdmin"
+        "global/ProxyAdmin"
      sourceHashes:
+        ["0x96d2f0fa1bd83ebd61ba6a2351c64c7fda7aa580b11ea67bb6bf4338e5c28512"]
    }
```

```diff
    contract LiskRollupOwnerMultisig (0xECd4150ABbb1EBff13f74e42Fb43C3d78B4E0b45) {
    +++ description: None
      sourceHashes:
+        ["0x81a7349eebb98ac33b0bc6842e3cb258034a8f2a4ba004570bb8e2e25947f9ff","0xd42bbf9f7dcd3720a7fc6bdc6edfdfae8800a37d6dd4decfa0ef6ca4a2e88940"]
    }
```

Generated with discovered.json: 0x97f6e9d4d5cdd349a1b3f9f190b8950ba2d9ab1d

# Diff at Fri, 11 Oct 2024 10:34:24 GMT:

- chain: ethereum
- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@8f7c5fd25193054458be38552e62a708c480b2c8 block: 20368673
- current block number: 20941810

## Description

Getalo MS signer removed.

## Watched changes

```diff
    contract GelatoMultisig (0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb) {
    +++ description: None
      values.$members.9:
-        "0x547D0F472309e4239b296D01e03bEDc101241a26"
      values.$members.8:
-        "0xf83bC4688979b13Da02CB94c76cEB169540760b5"
+        "0x547D0F472309e4239b296D01e03bEDc101241a26"
      values.$members.7:
-        "0x01a0A7BaAAca31AFB5b770FeFD69CE4917D9c32e"
+        "0xf83bC4688979b13Da02CB94c76cEB169540760b5"
      values.$members.6:
-        "0x27b1682E9C5Cb0E58Ff474F3a13EeCC36E708ad3"
+        "0x01a0A7BaAAca31AFB5b770FeFD69CE4917D9c32e"
      values.multisigThreshold:
-        "6 of 10 (60%)"
+        "6 of 9 (67%)"
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20368673 (main branch discovery), not current.

```diff
    contract SystemConfig (0x05f23282FFDCA8286E4738C1aF79079f3d843750) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      issuedPermissions.1.target:
-        "0xECd4150ABbb1EBff13f74e42Fb43C3d78B4E0b45"
+        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
      issuedPermissions.1.via.1:
+        {"address":"0xeC432c4F1d0E12737f3a42a459B84848Af979b2d","delay":0}
      issuedPermissions.1.via.0.address:
-        "0xeC432c4F1d0E12737f3a42a459B84848Af979b2d"
+        "0xECd4150ABbb1EBff13f74e42Fb43C3d78B4E0b45"
    }
```

```diff
    contract L2OutputOracle (0x113cB99283AF242Da0A0C54347667edF531Aa7d6) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      issuedPermissions.0.target:
-        "0xECd4150ABbb1EBff13f74e42Fb43C3d78B4E0b45"
+        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
      issuedPermissions.0.via.1:
+        {"address":"0xeC432c4F1d0E12737f3a42a459B84848Af979b2d","delay":0}
      issuedPermissions.0.via.0.address:
-        "0xeC432c4F1d0E12737f3a42a459B84848Af979b2d"
+        "0xECd4150ABbb1EBff13f74e42Fb43C3d78B4E0b45"
    }
```

```diff
    contract L1StandardBridge (0x2658723Bf70c7667De6B25F99fcce13A16D25d08) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token.
      issuedPermissions.0.target:
-        "0xECd4150ABbb1EBff13f74e42Fb43C3d78B4E0b45"
+        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
      issuedPermissions.0.via.1:
+        {"address":"0xeC432c4F1d0E12737f3a42a459B84848Af979b2d","delay":0,"description":"upgrading bridge implementation allows to access all funds and change every system component."}
      issuedPermissions.0.via.0.address:
-        "0xeC432c4F1d0E12737f3a42a459B84848Af979b2d"
+        "0xECd4150ABbb1EBff13f74e42Fb43C3d78B4E0b45"
      issuedPermissions.0.via.0.description:
-        "upgrading bridge implementation allows to access all funds and change every system component."
    }
```

```diff
    contract SuperchainConfig (0x26C7bFB430d68Bf74d2d52497836d4336b555dE7) {
    +++ description: Used to manage global configuration values for multiple OP Chains within a single Superchain network. The SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the Superchain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      issuedPermissions.0.target:
-        "0xECd4150ABbb1EBff13f74e42Fb43C3d78B4E0b45"
+        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
      issuedPermissions.0.via.1:
+        {"address":"0xeC432c4F1d0E12737f3a42a459B84848Af979b2d","delay":0}
      issuedPermissions.0.via.0.address:
-        "0xeC432c4F1d0E12737f3a42a459B84848Af979b2d"
+        "0xECd4150ABbb1EBff13f74e42Fb43C3d78B4E0b45"
    }
```

```diff
    contract OptimismPortal (0x26dB93F8b8b4f7016240af62F7730979d353f9A7) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      issuedPermissions.0.target:
-        "0xECd4150ABbb1EBff13f74e42Fb43C3d78B4E0b45"
+        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
      issuedPermissions.0.via.1:
+        {"address":"0xeC432c4F1d0E12737f3a42a459B84848Af979b2d","delay":0}
      issuedPermissions.0.via.0.address:
-        "0xeC432c4F1d0E12737f3a42a459B84848Af979b2d"
+        "0xECd4150ABbb1EBff13f74e42Fb43C3d78B4E0b45"
    }
```

```diff
    contract AddressManager (0x2dF7057d3F25212E51aFEA8dA628668229Ea423f) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      issuedPermissions.0.target:
-        "0xECd4150ABbb1EBff13f74e42Fb43C3d78B4E0b45"
+        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
      issuedPermissions.0.via.1:
+        {"address":"0xeC432c4F1d0E12737f3a42a459B84848Af979b2d","delay":0,"description":"set and change address mappings."}
      issuedPermissions.0.via.0.address:
-        "0xeC432c4F1d0E12737f3a42a459B84848Af979b2d"
+        "0xECd4150ABbb1EBff13f74e42Fb43C3d78B4E0b45"
      issuedPermissions.0.via.0.description:
-        "set and change address mappings."
    }
```

```diff
    contract L1ERC721Bridge (0x3A44A3b263FB631cdbf25f339e2D29497511A81f) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      issuedPermissions.0.target:
-        "0xECd4150ABbb1EBff13f74e42Fb43C3d78B4E0b45"
+        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
      issuedPermissions.0.via.1:
+        {"address":"0xeC432c4F1d0E12737f3a42a459B84848Af979b2d","delay":0}
      issuedPermissions.0.via.0.address:
-        "0xeC432c4F1d0E12737f3a42a459B84848Af979b2d"
+        "0xECd4150ABbb1EBff13f74e42Fb43C3d78B4E0b45"
    }
```

```diff
    contract GelatoMultisig (0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb) {
    +++ description: None
      receivedPermissions.8:
+        {"permission":"upgrade","target":"0xc1dA06CC5DD5cE23bABa924463de7F762039252d","via":[{"address":"0xeC432c4F1d0E12737f3a42a459B84848Af979b2d"},{"address":"0xECd4150ABbb1EBff13f74e42Fb43C3d78B4E0b45"}]}
      receivedPermissions.7:
+        {"permission":"upgrade","target":"0x3A44A3b263FB631cdbf25f339e2D29497511A81f","via":[{"address":"0xeC432c4F1d0E12737f3a42a459B84848Af979b2d"},{"address":"0xECd4150ABbb1EBff13f74e42Fb43C3d78B4E0b45"}]}
      receivedPermissions.6:
+        {"permission":"upgrade","target":"0x26dB93F8b8b4f7016240af62F7730979d353f9A7","via":[{"address":"0xeC432c4F1d0E12737f3a42a459B84848Af979b2d"},{"address":"0xECd4150ABbb1EBff13f74e42Fb43C3d78B4E0b45"}]}
      receivedPermissions.5:
+        {"permission":"upgrade","target":"0x26C7bFB430d68Bf74d2d52497836d4336b555dE7","via":[{"address":"0xeC432c4F1d0E12737f3a42a459B84848Af979b2d"},{"address":"0xECd4150ABbb1EBff13f74e42Fb43C3d78B4E0b45"}]}
      receivedPermissions.4:
+        {"permission":"upgrade","target":"0x2658723Bf70c7667De6B25F99fcce13A16D25d08","description":"upgrading bridge implementation allows to access all funds and change every system component.","via":[{"address":"0xeC432c4F1d0E12737f3a42a459B84848Af979b2d"},{"address":"0xECd4150ABbb1EBff13f74e42Fb43C3d78B4E0b45"}]}
      receivedPermissions.3:
+        {"permission":"upgrade","target":"0x113cB99283AF242Da0A0C54347667edF531Aa7d6","via":[{"address":"0xeC432c4F1d0E12737f3a42a459B84848Af979b2d"},{"address":"0xECd4150ABbb1EBff13f74e42Fb43C3d78B4E0b45"}]}
      receivedPermissions.2:
+        {"permission":"upgrade","target":"0x05f23282FFDCA8286E4738C1aF79079f3d843750","via":[{"address":"0xeC432c4F1d0E12737f3a42a459B84848Af979b2d"},{"address":"0xECd4150ABbb1EBff13f74e42Fb43C3d78B4E0b45"}]}
      receivedPermissions.1:
+        {"permission":"configure","target":"0x2dF7057d3F25212E51aFEA8dA628668229Ea423f","description":"set and change address mappings.","via":[{"address":"0xeC432c4F1d0E12737f3a42a459B84848Af979b2d"},{"address":"0xECd4150ABbb1EBff13f74e42Fb43C3d78B4E0b45"}]}
    }
```

```diff
    contract OptimismMintableERC20Factory (0xc1dA06CC5DD5cE23bABa924463de7F762039252d) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      issuedPermissions.0.target:
-        "0xECd4150ABbb1EBff13f74e42Fb43C3d78B4E0b45"
+        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
      issuedPermissions.0.via.1:
+        {"address":"0xeC432c4F1d0E12737f3a42a459B84848Af979b2d","delay":0}
      issuedPermissions.0.via.0.address:
-        "0xeC432c4F1d0E12737f3a42a459B84848Af979b2d"
+        "0xECd4150ABbb1EBff13f74e42Fb43C3d78B4E0b45"
    }
```

```diff
    contract LiskRollupOwnerMultisig (0xECd4150ABbb1EBff13f74e42Fb43C3d78B4E0b45) {
    +++ description: None
      receivedPermissions:
-        [{"permission":"configure","target":"0x2dF7057d3F25212E51aFEA8dA628668229Ea423f","description":"set and change address mappings.","via":[{"address":"0xeC432c4F1d0E12737f3a42a459B84848Af979b2d"}]},{"permission":"upgrade","target":"0x05f23282FFDCA8286E4738C1aF79079f3d843750","via":[{"address":"0xeC432c4F1d0E12737f3a42a459B84848Af979b2d"}]},{"permission":"upgrade","target":"0x113cB99283AF242Da0A0C54347667edF531Aa7d6","via":[{"address":"0xeC432c4F1d0E12737f3a42a459B84848Af979b2d"}]},{"permission":"upgrade","target":"0x2658723Bf70c7667De6B25F99fcce13A16D25d08","description":"upgrading bridge implementation allows to access all funds and change every system component.","via":[{"address":"0xeC432c4F1d0E12737f3a42a459B84848Af979b2d"}]},{"permission":"upgrade","target":"0x26C7bFB430d68Bf74d2d52497836d4336b555dE7","via":[{"address":"0xeC432c4F1d0E12737f3a42a459B84848Af979b2d"}]},{"permission":"upgrade","target":"0x26dB93F8b8b4f7016240af62F7730979d353f9A7","via":[{"address":"0xeC432c4F1d0E12737f3a42a459B84848Af979b2d"}]},{"permission":"upgrade","target":"0x3A44A3b263FB631cdbf25f339e2D29497511A81f","via":[{"address":"0xeC432c4F1d0E12737f3a42a459B84848Af979b2d"}]},{"permission":"upgrade","target":"0xc1dA06CC5DD5cE23bABa924463de7F762039252d","via":[{"address":"0xeC432c4F1d0E12737f3a42a459B84848Af979b2d"}]}]
    }
```

Generated with discovered.json: 0xa7fb12400a09bb3c5f25cc682d8f3e388068223f

# Diff at Wed, 09 Oct 2024 13:09:39 GMT:

- chain: ethereum
- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@37683e2b3d0587372f886eef49e921277810c8bf block: 20368673
- current block number: 20368673

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20368673 (main branch discovery), not current.

```diff
    contract AddressManager (0x2dF7057d3F25212E51aFEA8dA628668229Ea423f) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      issuedPermissions.0.via.0.description:
+        "set and change address mappings."
      descriptions:
+        ["Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts."]
    }
```

```diff
    contract ProxyAdmin (0xeC432c4F1d0E12737f3a42a459B84848Af979b2d) {
    +++ description: None
      directlyReceivedPermissions.0.description:
+        "set and change address mappings."
    }
```

```diff
    contract LiskRollupOwnerMultisig (0xECd4150ABbb1EBff13f74e42Fb43C3d78B4E0b45) {
    +++ description: None
      receivedPermissions.0.description:
+        "set and change address mappings."
    }
```

Generated with discovered.json: 0x32a30fce5dbba8c94f9ff2899f4e454e5162ed5e

# Diff at Tue, 01 Oct 2024 10:52:15 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bd754dc73c66120164006054f8d25c5fae9cd910 block: 20368673
- current block number: 20368673

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20368673 (main branch discovery), not current.

```diff
    contract SystemConfig (0x05f23282FFDCA8286E4738C1aF79079f3d843750) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      values.$pastUpgrades:
+        [["2024-05-03T09:59:59.000Z",["0xc6cF1149d23F2788AC94312E68EB52a74F288ebe"]]]
    }
```

```diff
    contract L2OutputOracle (0x113cB99283AF242Da0A0C54347667edF531Aa7d6) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      values.$pastUpgrades:
+        [["2024-05-03T10:02:59.000Z",["0xe8912070277Dd5D9473904b7F4e6C71290F2AE90"]],["2024-07-22T12:25:35.000Z",["0x4a8515A656BF683cCdabc27C25610223033b594e"]],["2024-07-22T12:25:35.000Z",["0xe8912070277Dd5D9473904b7F4e6C71290F2AE90"]]]
    }
```

```diff
    contract L1StandardBridge (0x2658723Bf70c7667De6B25F99fcce13A16D25d08) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token.
      values.$pastUpgrades:
+        []
    }
```

```diff
    contract SuperchainConfig (0x26C7bFB430d68Bf74d2d52497836d4336b555dE7) {
    +++ description: Used to manage global configuration values for multiple OP Chains within a single Superchain network. The SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the Superchain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      values.$pastUpgrades:
+        [["2024-05-03T09:51:11.000Z",["0xd637dc6d7DA9151b5069a4bFB74a12E67a532CC3"]],["2024-07-22T12:26:23.000Z",["0x4a8515A656BF683cCdabc27C25610223033b594e"]],["2024-07-22T12:26:23.000Z",["0xd637dc6d7DA9151b5069a4bFB74a12E67a532CC3"]]]
    }
```

```diff
    contract OptimismPortal (0x26dB93F8b8b4f7016240af62F7730979d353f9A7) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      values.$pastUpgrades:
+        [["2024-05-03T10:03:35.000Z",["0x3Ff11Cde41a5f7c791eFfcd6AeEA05dd2df5e21e"]]]
    }
```

```diff
    contract L1CrossDomainMessenger (0x31B72D76FB666844C41EdF08dF0254875Dbb7edB) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      values.$pastUpgrades:
+        [["2024-05-03T10:02:23.000Z",["0x0318A37e2662507789a6E17E85A506709F89488b"]]]
      values.$upgradeCount:
+        1
    }
```

```diff
    contract L1ERC721Bridge (0x3A44A3b263FB631cdbf25f339e2D29497511A81f) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      values.$pastUpgrades:
+        [["2024-05-03T10:00:59.000Z",["0xefBDff012170ae592A3d197bf9Ac10eBF313233a"]]]
    }
```

```diff
    contract OptimismMintableERC20Factory (0xc1dA06CC5DD5cE23bABa924463de7F762039252d) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      values.$pastUpgrades:
+        [["2024-05-03T10:01:23.000Z",["0xD00e38514d66bf1B761a8937559c6b2854A5B3ad"]]]
    }
```

Generated with discovered.json: 0x60b4dae22b52bad733321b15f4204f13dfc3ff07

# Diff at Sun, 08 Sep 2024 17:24:31 GMT:

- chain: ethereum
- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@fd881462cca0d7ef4519f907f3c6cfd5fe1cde8f block: 20368673
- current block number: 20368673

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20368673 (main branch discovery), not current.

```diff
    contract SystemConfig (0x05f23282FFDCA8286E4738C1aF79079f3d843750) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      issuedPermissions.1.target:
-        "0xeC432c4F1d0E12737f3a42a459B84848Af979b2d"
+        "0xECd4150ABbb1EBff13f74e42Fb43C3d78B4E0b45"
      issuedPermissions.1.via.0:
+        {"address":"0xeC432c4F1d0E12737f3a42a459B84848Af979b2d","delay":0}
    }
```

```diff
    contract L2OutputOracle (0x113cB99283AF242Da0A0C54347667edF531Aa7d6) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      issuedPermissions.0.target:
-        "0xeC432c4F1d0E12737f3a42a459B84848Af979b2d"
+        "0xECd4150ABbb1EBff13f74e42Fb43C3d78B4E0b45"
      issuedPermissions.0.via.0:
+        {"address":"0xeC432c4F1d0E12737f3a42a459B84848Af979b2d","delay":0}
    }
```

```diff
    contract L1StandardBridge (0x2658723Bf70c7667De6B25F99fcce13A16D25d08) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token.
      issuedPermissions.0.target:
-        "0xeC432c4F1d0E12737f3a42a459B84848Af979b2d"
+        "0xECd4150ABbb1EBff13f74e42Fb43C3d78B4E0b45"
      issuedPermissions.0.via.0:
+        {"address":"0xeC432c4F1d0E12737f3a42a459B84848Af979b2d","delay":0,"description":"upgrading bridge implementation allows to access all funds and change every system component."}
    }
```

```diff
    contract SuperchainConfig (0x26C7bFB430d68Bf74d2d52497836d4336b555dE7) {
    +++ description: Used to manage global configuration values for multiple OP Chains within a single Superchain network. The SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the Superchain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      issuedPermissions.0.target:
-        "0xeC432c4F1d0E12737f3a42a459B84848Af979b2d"
+        "0xECd4150ABbb1EBff13f74e42Fb43C3d78B4E0b45"
      issuedPermissions.0.via.0:
+        {"address":"0xeC432c4F1d0E12737f3a42a459B84848Af979b2d","delay":0}
    }
```

```diff
    contract OptimismPortal (0x26dB93F8b8b4f7016240af62F7730979d353f9A7) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      issuedPermissions.0.target:
-        "0xeC432c4F1d0E12737f3a42a459B84848Af979b2d"
+        "0xECd4150ABbb1EBff13f74e42Fb43C3d78B4E0b45"
      issuedPermissions.0.via.0:
+        {"address":"0xeC432c4F1d0E12737f3a42a459B84848Af979b2d","delay":0}
    }
```

```diff
    contract AddressManager (0x2dF7057d3F25212E51aFEA8dA628668229Ea423f) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xeC432c4F1d0E12737f3a42a459B84848Af979b2d"
+        "0xECd4150ABbb1EBff13f74e42Fb43C3d78B4E0b45"
      issuedPermissions.0.via.0:
+        {"address":"0xeC432c4F1d0E12737f3a42a459B84848Af979b2d","delay":0}
    }
```

```diff
    contract L1ERC721Bridge (0x3A44A3b263FB631cdbf25f339e2D29497511A81f) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      issuedPermissions.0.target:
-        "0xeC432c4F1d0E12737f3a42a459B84848Af979b2d"
+        "0xECd4150ABbb1EBff13f74e42Fb43C3d78B4E0b45"
      issuedPermissions.0.via.0:
+        {"address":"0xeC432c4F1d0E12737f3a42a459B84848Af979b2d","delay":0}
    }
```

```diff
    contract GelatoMultisig (0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb) {
    +++ description: None
      descriptions:
-        ["It can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system."]
      receivedPermissions.0.description:
+        "it can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system."
    }
```

```diff
    contract OptimismMintableERC20Factory (0xc1dA06CC5DD5cE23bABa924463de7F762039252d) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      issuedPermissions.0.target:
-        "0xeC432c4F1d0E12737f3a42a459B84848Af979b2d"
+        "0xECd4150ABbb1EBff13f74e42Fb43C3d78B4E0b45"
      issuedPermissions.0.via.0:
+        {"address":"0xeC432c4F1d0E12737f3a42a459B84848Af979b2d","delay":0}
    }
```

```diff
    contract ProxyAdmin (0xeC432c4F1d0E12737f3a42a459B84848Af979b2d) {
    +++ description: None
      descriptions:
-        ["It can upgrade the bridge implementation potentially gaining access to all funds, and change any system component."]
      issuedPermissions:
-        [{"permission":"configure","target":"0xECd4150ABbb1EBff13f74e42Fb43C3d78B4E0b45","via":[]}]
      receivedPermissions:
-        [{"permission":"configure","target":"0x2dF7057d3F25212E51aFEA8dA628668229Ea423f"},{"permission":"upgrade","target":"0x05f23282FFDCA8286E4738C1aF79079f3d843750"},{"permission":"upgrade","target":"0x113cB99283AF242Da0A0C54347667edF531Aa7d6"},{"permission":"upgrade","target":"0x2658723Bf70c7667De6B25F99fcce13A16D25d08"},{"permission":"upgrade","target":"0x26C7bFB430d68Bf74d2d52497836d4336b555dE7"},{"permission":"upgrade","target":"0x26dB93F8b8b4f7016240af62F7730979d353f9A7"},{"permission":"upgrade","target":"0x3A44A3b263FB631cdbf25f339e2D29497511A81f"},{"permission":"upgrade","target":"0xc1dA06CC5DD5cE23bABa924463de7F762039252d"}]
      directlyReceivedPermissions:
+        [{"permission":"configure","target":"0x2dF7057d3F25212E51aFEA8dA628668229Ea423f"},{"permission":"upgrade","target":"0x05f23282FFDCA8286E4738C1aF79079f3d843750"},{"permission":"upgrade","target":"0x113cB99283AF242Da0A0C54347667edF531Aa7d6"},{"permission":"upgrade","target":"0x2658723Bf70c7667De6B25F99fcce13A16D25d08","description":"upgrading bridge implementation allows to access all funds and change every system component."},{"permission":"upgrade","target":"0x26C7bFB430d68Bf74d2d52497836d4336b555dE7"},{"permission":"upgrade","target":"0x26dB93F8b8b4f7016240af62F7730979d353f9A7"},{"permission":"upgrade","target":"0x3A44A3b263FB631cdbf25f339e2D29497511A81f"},{"permission":"upgrade","target":"0xc1dA06CC5DD5cE23bABa924463de7F762039252d"}]
    }
```

```diff
    contract LiskRollupOwnerMultisig (0xECd4150ABbb1EBff13f74e42Fb43C3d78B4E0b45) {
    +++ description: None
      descriptions:
-        ["It can act on behalf of 0xeC432c4F1d0E12737f3a42a459B84848Af979b2d, inheriting its permissions."]
      receivedPermissions.7:
+        {"permission":"upgrade","target":"0xc1dA06CC5DD5cE23bABa924463de7F762039252d","via":[{"address":"0xeC432c4F1d0E12737f3a42a459B84848Af979b2d"}]}
      receivedPermissions.6:
+        {"permission":"upgrade","target":"0x3A44A3b263FB631cdbf25f339e2D29497511A81f","via":[{"address":"0xeC432c4F1d0E12737f3a42a459B84848Af979b2d"}]}
      receivedPermissions.5:
+        {"permission":"upgrade","target":"0x26dB93F8b8b4f7016240af62F7730979d353f9A7","via":[{"address":"0xeC432c4F1d0E12737f3a42a459B84848Af979b2d"}]}
      receivedPermissions.4:
+        {"permission":"upgrade","target":"0x26C7bFB430d68Bf74d2d52497836d4336b555dE7","via":[{"address":"0xeC432c4F1d0E12737f3a42a459B84848Af979b2d"}]}
      receivedPermissions.3:
+        {"permission":"upgrade","target":"0x2658723Bf70c7667De6B25F99fcce13A16D25d08","description":"upgrading bridge implementation allows to access all funds and change every system component.","via":[{"address":"0xeC432c4F1d0E12737f3a42a459B84848Af979b2d"}]}
      receivedPermissions.2:
+        {"permission":"upgrade","target":"0x113cB99283AF242Da0A0C54347667edF531Aa7d6","via":[{"address":"0xeC432c4F1d0E12737f3a42a459B84848Af979b2d"}]}
      receivedPermissions.1:
+        {"permission":"upgrade","target":"0x05f23282FFDCA8286E4738C1aF79079f3d843750","via":[{"address":"0xeC432c4F1d0E12737f3a42a459B84848Af979b2d"}]}
      receivedPermissions.0.target:
-        "0xeC432c4F1d0E12737f3a42a459B84848Af979b2d"
+        "0x2dF7057d3F25212E51aFEA8dA628668229Ea423f"
      receivedPermissions.0.via:
+        [{"address":"0xeC432c4F1d0E12737f3a42a459B84848Af979b2d"}]
      directlyReceivedPermissions:
+        [{"permission":"act","target":"0xeC432c4F1d0E12737f3a42a459B84848Af979b2d"}]
    }
```

Generated with discovered.json: 0x2ca54c37f7c02c8b27ebabc2ed5605a3c9bf3e63

# Diff at Fri, 30 Aug 2024 07:53:29 GMT:

- chain: ethereum
- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@6c1bd1f41fadf5f2cb1c1805b5a2c6138a3ed35a block: 20368673
- current block number: 20368673

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20368673 (main branch discovery), not current.

```diff
    contract GelatoMultisig (0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb) {
    +++ description: It can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system.
      receivedPermissions.0.via:
-        []
    }
```

```diff
    contract ProxyAdmin (0xeC432c4F1d0E12737f3a42a459B84848Af979b2d) {
    +++ description: It can upgrade the bridge implementation potentially gaining access to all funds, and change any system component.
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
    contract LiskRollupOwnerMultisig (0xECd4150ABbb1EBff13f74e42Fb43C3d78B4E0b45) {
    +++ description: It can act on behalf of 0xeC432c4F1d0E12737f3a42a459B84848Af979b2d, inheriting its permissions.
      receivedPermissions.0.via:
-        []
    }
```

Generated with discovered.json: 0x41ba141115593de23e25a41ef173868064cb70db

# Diff at Fri, 23 Aug 2024 09:53:02 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@67597c7d6c810bc726594446890178150240711e block: 20368673
- current block number: 20368673

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20368673 (main branch discovery), not current.

```diff
    contract SystemConfig (0x05f23282FFDCA8286E4738C1aF79079f3d843750) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      values.$upgradeCount:
+        1
    }
```

```diff
    contract L2OutputOracle (0x113cB99283AF242Da0A0C54347667edF531Aa7d6) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      values.$upgradeCount:
+        3
    }
```

```diff
    contract L1StandardBridge (0x2658723Bf70c7667De6B25F99fcce13A16D25d08) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token.
      values.$upgradeCount:
+        0
    }
```

```diff
    contract SuperchainConfig (0x26C7bFB430d68Bf74d2d52497836d4336b555dE7) {
    +++ description: Used to manage global configuration values for multiple OP Chains within a single Superchain network. The SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the Superchain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      values.$upgradeCount:
+        3
    }
```

```diff
    contract OptimismPortal (0x26dB93F8b8b4f7016240af62F7730979d353f9A7) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      values.$upgradeCount:
+        1
    }
```

```diff
    contract L1ERC721Bridge (0x3A44A3b263FB631cdbf25f339e2D29497511A81f) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      values.$upgradeCount:
+        1
    }
```

```diff
    contract OptimismMintableERC20Factory (0xc1dA06CC5DD5cE23bABa924463de7F762039252d) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      values.$upgradeCount:
+        1
    }
```

Generated with discovered.json: 0xb81be2d309fbabf0f34e1cf39f94a516caac2ab2

# Diff at Wed, 21 Aug 2024 10:03:48 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@2f6dde3357bf5d79196b6e94f79d853a6c4ec72b block: 20368673
- current block number: 20368673

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20368673 (main branch discovery), not current.

```diff
    contract SystemConfig (0x05f23282FFDCA8286E4738C1aF79079f3d843750) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      issuedPermissions:
+        [{"permission":"configure","target":"0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb","via":[]},{"permission":"upgrade","target":"0xeC432c4F1d0E12737f3a42a459B84848Af979b2d","via":[]}]
    }
```

```diff
    contract L2OutputOracle (0x113cB99283AF242Da0A0C54347667edF531Aa7d6) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xeC432c4F1d0E12737f3a42a459B84848Af979b2d","via":[]}]
    }
```

```diff
    contract L1StandardBridge (0x2658723Bf70c7667De6B25F99fcce13A16D25d08) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token.
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xeC432c4F1d0E12737f3a42a459B84848Af979b2d","via":[]}]
    }
```

```diff
    contract SuperchainConfig (0x26C7bFB430d68Bf74d2d52497836d4336b555dE7) {
    +++ description: Used to manage global configuration values for multiple OP Chains within a single Superchain network. The SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the Superchain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xeC432c4F1d0E12737f3a42a459B84848Af979b2d","via":[]}]
    }
```

```diff
    contract OptimismPortal (0x26dB93F8b8b4f7016240af62F7730979d353f9A7) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xeC432c4F1d0E12737f3a42a459B84848Af979b2d","via":[]}]
    }
```

```diff
    contract AddressManager (0x2dF7057d3F25212E51aFEA8dA628668229Ea423f) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"configure","target":"0xeC432c4F1d0E12737f3a42a459B84848Af979b2d","via":[]}]
    }
```

```diff
    contract L1ERC721Bridge (0x3A44A3b263FB631cdbf25f339e2D29497511A81f) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xeC432c4F1d0E12737f3a42a459B84848Af979b2d","via":[]}]
    }
```

```diff
    contract GelatoMultisig (0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb) {
    +++ description: It can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system.
      assignedPermissions:
-        {"configure":["0x05f23282FFDCA8286E4738C1aF79079f3d843750"]}
      receivedPermissions:
+        [{"permission":"configure","target":"0x05f23282FFDCA8286E4738C1aF79079f3d843750","via":[]}]
    }
```

```diff
    contract OptimismMintableERC20Factory (0xc1dA06CC5DD5cE23bABa924463de7F762039252d) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xeC432c4F1d0E12737f3a42a459B84848Af979b2d","via":[]}]
    }
```

```diff
    contract ProxyAdmin (0xeC432c4F1d0E12737f3a42a459B84848Af979b2d) {
    +++ description: It can upgrade the bridge implementation potentially gaining access to all funds, and change any system component.
      assignedPermissions:
-        {"upgrade":["0x05f23282FFDCA8286E4738C1aF79079f3d843750","0x113cB99283AF242Da0A0C54347667edF531Aa7d6","0x2658723Bf70c7667De6B25F99fcce13A16D25d08","0x26C7bFB430d68Bf74d2d52497836d4336b555dE7","0x26dB93F8b8b4f7016240af62F7730979d353f9A7","0x3A44A3b263FB631cdbf25f339e2D29497511A81f","0xc1dA06CC5DD5cE23bABa924463de7F762039252d"],"configure":["0x2dF7057d3F25212E51aFEA8dA628668229Ea423f"]}
      issuedPermissions:
+        [{"permission":"configure","target":"0xECd4150ABbb1EBff13f74e42Fb43C3d78B4E0b45","via":[]}]
      receivedPermissions:
+        [{"permission":"configure","target":"0x2dF7057d3F25212E51aFEA8dA628668229Ea423f","via":[]},{"permission":"upgrade","target":"0x05f23282FFDCA8286E4738C1aF79079f3d843750","via":[]},{"permission":"upgrade","target":"0x113cB99283AF242Da0A0C54347667edF531Aa7d6","via":[]},{"permission":"upgrade","target":"0x2658723Bf70c7667De6B25F99fcce13A16D25d08","via":[]},{"permission":"upgrade","target":"0x26C7bFB430d68Bf74d2d52497836d4336b555dE7","via":[]},{"permission":"upgrade","target":"0x26dB93F8b8b4f7016240af62F7730979d353f9A7","via":[]},{"permission":"upgrade","target":"0x3A44A3b263FB631cdbf25f339e2D29497511A81f","via":[]},{"permission":"upgrade","target":"0xc1dA06CC5DD5cE23bABa924463de7F762039252d","via":[]}]
    }
```

```diff
    contract LiskRollupOwnerMultisig (0xECd4150ABbb1EBff13f74e42Fb43C3d78B4E0b45) {
    +++ description: It can act on behalf of 0xeC432c4F1d0E12737f3a42a459B84848Af979b2d, inheriting its permissions.
      assignedPermissions:
-        {"configure":["0xeC432c4F1d0E12737f3a42a459B84848Af979b2d"]}
      receivedPermissions:
+        [{"permission":"configure","target":"0xeC432c4F1d0E12737f3a42a459B84848Af979b2d","via":[]}]
    }
```

Generated with discovered.json: 0xc988d44587d40c17e96c4210210f3743a3f3cd5a

# Diff at Fri, 09 Aug 2024 12:00:11 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bf40aa32f030fd312056ca0ef198c8550467d1d7 block: 20368673
- current block number: 20368673

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20368673 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0xeC432c4F1d0E12737f3a42a459B84848Af979b2d) {
    +++ description: It can upgrade the bridge implementation potentially gaining access to all funds, and change any system component.
      assignedPermissions.upgrade.4:
-        "0x05f23282FFDCA8286E4738C1aF79079f3d843750"
+        "0x26dB93F8b8b4f7016240af62F7730979d353f9A7"
      assignedPermissions.upgrade.3:
-        "0x113cB99283AF242Da0A0C54347667edF531Aa7d6"
+        "0x26C7bFB430d68Bf74d2d52497836d4336b555dE7"
      assignedPermissions.upgrade.2:
-        "0x26dB93F8b8b4f7016240af62F7730979d353f9A7"
+        "0x2658723Bf70c7667De6B25F99fcce13A16D25d08"
      assignedPermissions.upgrade.1:
-        "0x26C7bFB430d68Bf74d2d52497836d4336b555dE7"
+        "0x113cB99283AF242Da0A0C54347667edF531Aa7d6"
      assignedPermissions.upgrade.0:
-        "0x2658723Bf70c7667De6B25F99fcce13A16D25d08"
+        "0x05f23282FFDCA8286E4738C1aF79079f3d843750"
    }
```

Generated with discovered.json: 0x3c1e04c49c1534797ef43b1068b0a76881f43b28

# Diff at Fri, 09 Aug 2024 10:10:18 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f0da1d0aab7bc6b3b5e54e7e93480bd98e57035 block: 20368673
- current block number: 20368673

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20368673 (main branch discovery), not current.

```diff
    contract GelatoMultisig (0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb) {
    +++ description: It can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system.
      assignedPermissions.owner:
-        ["0x05f23282FFDCA8286E4738C1aF79079f3d843750"]
      assignedPermissions.configure:
+        ["0x05f23282FFDCA8286E4738C1aF79079f3d843750"]
      values.$multisigThreshold:
-        "6 of 10 (60%)"
      values.getOwners:
-        ["0xB0C2CBFfCd4C31AFFEe14993b6d48f99D285f621","0x28bB9385A588EF4747264D19B9A9F1603591680c","0x691C2EF68e25E620fa6cAdE2728f6aE34F37aAD2","0x5bE3E96Cdc3A97628bD7308d3588B9a474F4A54d","0xBc0ca6865d6883a83D4aDDD6b862aE042d855E0d","0xc85aC6d2fdC376F335455D4cCA30c45ED1080849","0x27b1682E9C5Cb0E58Ff474F3a13EeCC36E708ad3","0x01a0A7BaAAca31AFB5b770FeFD69CE4917D9c32e","0xf83bC4688979b13Da02CB94c76cEB169540760b5","0x547D0F472309e4239b296D01e03bEDc101241a26"]
      values.getThreshold:
-        6
      values.$members:
+        ["0xB0C2CBFfCd4C31AFFEe14993b6d48f99D285f621","0x28bB9385A588EF4747264D19B9A9F1603591680c","0x691C2EF68e25E620fa6cAdE2728f6aE34F37aAD2","0x5bE3E96Cdc3A97628bD7308d3588B9a474F4A54d","0xBc0ca6865d6883a83D4aDDD6b862aE042d855E0d","0xc85aC6d2fdC376F335455D4cCA30c45ED1080849","0x27b1682E9C5Cb0E58Ff474F3a13EeCC36E708ad3","0x01a0A7BaAAca31AFB5b770FeFD69CE4917D9c32e","0xf83bC4688979b13Da02CB94c76cEB169540760b5","0x547D0F472309e4239b296D01e03bEDc101241a26"]
      values.$threshold:
+        6
      values.multisigThreshold:
+        "6 of 10 (60%)"
    }
```

```diff
    contract ProxyAdmin (0xeC432c4F1d0E12737f3a42a459B84848Af979b2d) {
    +++ description: It can upgrade the bridge implementation potentially gaining access to all funds, and change any system component.
      assignedPermissions.admin:
-        ["0x05f23282FFDCA8286E4738C1aF79079f3d843750","0x113cB99283AF242Da0A0C54347667edF531Aa7d6","0x2658723Bf70c7667De6B25F99fcce13A16D25d08","0x26C7bFB430d68Bf74d2d52497836d4336b555dE7","0x26dB93F8b8b4f7016240af62F7730979d353f9A7","0x3A44A3b263FB631cdbf25f339e2D29497511A81f","0xc1dA06CC5DD5cE23bABa924463de7F762039252d"]
      assignedPermissions.owner:
-        ["0x2dF7057d3F25212E51aFEA8dA628668229Ea423f"]
      assignedPermissions.upgrade:
+        ["0x2658723Bf70c7667De6B25F99fcce13A16D25d08","0x26C7bFB430d68Bf74d2d52497836d4336b555dE7","0x26dB93F8b8b4f7016240af62F7730979d353f9A7","0x113cB99283AF242Da0A0C54347667edF531Aa7d6","0x05f23282FFDCA8286E4738C1aF79079f3d843750","0x3A44A3b263FB631cdbf25f339e2D29497511A81f","0xc1dA06CC5DD5cE23bABa924463de7F762039252d"]
      assignedPermissions.configure:
+        ["0x2dF7057d3F25212E51aFEA8dA628668229Ea423f"]
    }
```

```diff
    contract LiskRollupOwnerMultisig (0xECd4150ABbb1EBff13f74e42Fb43C3d78B4E0b45) {
    +++ description: It can act on behalf of 0xeC432c4F1d0E12737f3a42a459B84848Af979b2d, inheriting its permissions.
      assignedPermissions.owner:
-        ["0xeC432c4F1d0E12737f3a42a459B84848Af979b2d"]
      assignedPermissions.configure:
+        ["0xeC432c4F1d0E12737f3a42a459B84848Af979b2d"]
      values.$multisigThreshold:
-        "1 of 1 (100%)"
      values.getOwners:
-        ["0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"]
      values.getThreshold:
-        1
      values.$members:
+        ["0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"]
      values.$threshold:
+        1
      values.multisigThreshold:
+        "1 of 1 (100%)"
    }
```

Generated with discovered.json: 0x4220929a666aee751752bbed1141d7d708ba2ef8

# Diff at Tue, 30 Jul 2024 11:12:30 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@b2b6471ff62871f4956541f42ec025c356c08f7e block: 20368673
- current block number: 20368673

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20368673 (main branch discovery), not current.

```diff
    contract SystemConfig (0x05f23282FFDCA8286E4738C1aF79079f3d843750) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      fieldMeta:
+        {"gasLimit":{"severity":"LOW","description":"Gas limit for blocks on L2."}}
    }
```

Generated with discovered.json: 0x8d4557f91adb07eed80d7b422ffce2b174c2270e

# Diff at Tue, 23 Jul 2024 10:36:43 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@490aaec1a76ba293d442449146dd7c8335f4b7a1 block: 20367772
- current block number: 20368673

## Description

EOA signer removed, the LiskRollupOwnerMultisig is now just a transparent MS for Gelato MS. Warning removed from FE.

## Watched changes

```diff
    contract LiskRollupOwnerMultisig (0xECd4150ABbb1EBff13f74e42Fb43C3d78B4E0b45) {
    +++ description: None
      values.$multisigThreshold:
-        "1 of 2 (50%)"
+        "1 of 1 (100%)"
      values.getOwners.1:
-        "0xdA6e5640aFB2ED212Ba3a6fd83076e2ad3daD185"
    }
```

Generated with discovered.json: 0x4ea5b8947e58d62a04b241936e836cfc4c567bba

# Diff at Tue, 23 Jul 2024 07:36:01 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@898b873eac66b785af49fe56edca0c3dc1a5d0d7 block: 20339917
- current block number: 20367772

## Description

Challenger and Guardian are changed to the GelatoMultisig. Rollup Upgrade owner is still an EOA (and additionally GelatoMS).

## Watched changes

```diff
    contract SystemConfig (0x05f23282FFDCA8286E4738C1aF79079f3d843750) {
    +++ description: None
      values.owner:
-        "0xdA6e5640aFB2ED212Ba3a6fd83076e2ad3daD185"
+        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
    }
```

```diff
    contract L2OutputOracle (0x113cB99283AF242Da0A0C54347667edF531Aa7d6) {
    +++ description: None
      values.challenger:
-        "0xdA6e5640aFB2ED212Ba3a6fd83076e2ad3daD185"
+        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
      values.CHALLENGER:
-        "0xdA6e5640aFB2ED212Ba3a6fd83076e2ad3daD185"
+        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
    }
```

```diff
    contract SuperchainConfig (0x26C7bFB430d68Bf74d2d52497836d4336b555dE7) {
    +++ description: None
      values.guardian:
-        "0xdA6e5640aFB2ED212Ba3a6fd83076e2ad3daD185"
+        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
    }
```

```diff
    contract OptimismPortal (0x26dB93F8b8b4f7016240af62F7730979d353f9A7) {
    +++ description: None
      values.guardian:
-        "0xdA6e5640aFB2ED212Ba3a6fd83076e2ad3daD185"
+        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
      values.GUARDIAN:
-        "0xdA6e5640aFB2ED212Ba3a6fd83076e2ad3daD185"
+        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
    }
```

```diff
    contract LiskRollupOwnerMultisig (0xECd4150ABbb1EBff13f74e42Fb43C3d78B4E0b45) {
    +++ description: None
      values.$multisigThreshold:
-        "1 of 1 (100%)"
+        "1 of 2 (50%)"
      values.getOwners.1:
+        "0xdA6e5640aFB2ED212Ba3a6fd83076e2ad3daD185"
      values.getOwners.0:
-        "0xdA6e5640aFB2ED212Ba3a6fd83076e2ad3daD185"
+        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
    }
```

```diff
+   Status: CREATED
    contract GelatoMultisig (0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb)
    +++ description: None
```

## Source code changes

```diff
.../ethereum/.flat/GelatoMultisig/GnosisSafe.sol   | 952 +++++++++++++++++++++
 .../.flat/GelatoMultisig/GnosisSafeProxy.p.sol     |  34 +
 2 files changed, 986 insertions(+)
```

Generated with discovered.json: 0xbbda4273693b98590b45a10179daf316b84586ba

# Diff at Fri, 19 Jul 2024 10:16:12 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- current block number: 20339917

## Description

Initial discovery: OP stack rollup on the latest superchain (fork) contracts. EOA-governed without being in the Superchain governance.

## Initial discovery

```diff
+   Status: CREATED
    contract SystemConfig (0x05f23282FFDCA8286E4738C1aF79079f3d843750)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L2OutputOracle (0x113cB99283AF242Da0A0C54347667edF531Aa7d6)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1StandardBridge (0x2658723Bf70c7667De6B25F99fcce13A16D25d08)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SuperchainConfig (0x26C7bFB430d68Bf74d2d52497836d4336b555dE7)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OptimismPortal (0x26dB93F8b8b4f7016240af62F7730979d353f9A7)
    +++ description: None
```

```diff
+   Status: CREATED
    contract AddressManager (0x2dF7057d3F25212E51aFEA8dA628668229Ea423f)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1CrossDomainMessenger (0x31B72D76FB666844C41EdF08dF0254875Dbb7edB)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1ERC721Bridge (0x3A44A3b263FB631cdbf25f339e2D29497511A81f)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OptimismMintableERC20Factory (0xc1dA06CC5DD5cE23bABa924463de7F762039252d)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0xeC432c4F1d0E12737f3a42a459B84848Af979b2d)
    +++ description: None
```

```diff
+   Status: CREATED
    contract LiskRollupOwnerMultisig (0xECd4150ABbb1EBff13f74e42Fb43C3d78B4E0b45)
    +++ description: None
```

