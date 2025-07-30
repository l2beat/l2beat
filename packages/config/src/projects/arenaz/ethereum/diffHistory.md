Generated with discovered.json: 0x7315a9f8b9998252833ba1c06ec35118893238d9

# Diff at Mon, 28 Jul 2025 05:47:17 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@8e540d8d4e2ea097e63a067c52194d1bf06f9b4a block: 22923575
- current block number: 23015650

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
      receivedPermissions.0:
-        {"permission":"challenge","from":"eth:0x80533687a66A1bB366094A9B622873a6CA8415a5","role":".challenger","via":[{"address":"eth:0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A"},{"address":"eth:0x126a736B18E0a64fBA19D421647A530E327E112C","condition":"though restricted to the SuperchainConfig's `pause()` function"}]}
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
    contract OpFoundationOperationsSafe (0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A) {
    +++ description: None
      values.getModules.0:
-        "eth:0x126a736B18E0a64fBA19D421647A530E327E112C"
      values.GnosisSafe_modules.0:
-        "eth:0x126a736B18E0a64fBA19D421647A530E327E112C"
      receivedPermissions.1:
-        {"permission":"guard","from":"eth:0x95703e0982140D16f8ebA6d158FccEde42f04a4C","role":".guardian","via":[{"address":"eth:0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2"},{"address":"eth:0xc6901F65369FC59fC1B4D6D6bE7A2318Ff38dB5B","condition":"if not revoked by the Security Council"}]}
      directlyReceivedPermissions:
-        [{"permission":"act","from":"eth:0xc6901F65369FC59fC1B4D6D6bE7A2318Ff38dB5B","role":".deputyGuardian","condition":"if not revoked by the Security Council"}]
    }
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
.../DeputyGuardianModule.sol => /dev/null          | 156 -------
 .../DeputyPauseModule.sol                          |  87 ++--
 .../SuperchainConfig/SuperchainConfig.sol          | 487 ++++++++++++++++-----
 3 files changed, 395 insertions(+), 335 deletions(-)
```

Generated with discovered.json: 0xfa03d17b5bbf90078f4dbc26739ef5eef9fb80c6

# Diff at Fri, 25 Jul 2025 13:51:44 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@85b717d6efe0c0a7691beb49532a0ce49bb7634a block: 22923575
- current block number: 22923575

## Description

templatize op upgrade 16 contracts

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22923575 (main branch discovery), not current.

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

Generated with discovered.json: 0xee58b448a5fb1f5fe9f6a077055d7129ef035c1c

# Diff at Thu, 24 Jul 2025 16:48:16 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@a3f740c0fd51a5745c45d8f349ab01f4f33f7770 block: 22923575
- current block number: 22923575

## Description

set dispute game impl changes to high severity.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22923575 (main branch discovery), not current.

```diff
    contract DisputeGameFactory (0x658656A14AFdf9c507096aC406564497d13EC754) {
    +++ description: The dispute game factory allows the creation of dispute games, used to propose state roots and eventually challenge them.
      fieldMeta:
+        {"gameImpls":{"severity":"HIGH"},"game1337":{"severity":"HIGH"}}
    }
```

```diff
    contract OptimismPortal2 (0xB20f99b598E8d888d1887715439851BC68806b22) {
    +++ description: The OptimismPortal contract is the main entry point to deposit funds from L1 to L2. It also allows to prove and finalize withdrawals. It specifies which game type can be used for withdrawals, which currently is the PermissionedDisputeGame.
      fieldMeta.respectedGameType:
+        {"severity":"HIGH"}
    }
```

Generated with discovered.json: 0xc28e877cd3b10f47644bafb51f3d67abac1636d5

# Diff at Tue, 22 Jul 2025 14:07:52 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@d5d65d1883c757ae790bbd0a6f785c98310d2516 block: 22923575
- current block number: 22923575

## Description

Config: Kailua added to OptimismPortal2 and DisputeGameFectory.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22923575 (main branch discovery), not current.

```diff
    contract DisputeGameFactory (0x658656A14AFdf9c507096aC406564497d13EC754) {
    +++ description: The dispute game factory allows the creation of dispute games, used to propose state roots and eventually challenge them.
      values.game1337:
+        "eth:0x0000000000000000000000000000000000000000"
    }
```

```diff
    contract OptimismPortal2 (0xB20f99b598E8d888d1887715439851BC68806b22) {
    +++ description: The OptimismPortal contract is the main entry point to deposit funds from L1 to L2. It also allows to prove and finalize withdrawals. It specifies which game type can be used for withdrawals, which currently is the PermissionedDisputeGame.
      usedTypes.0.arg.1337:
+        "KailuaGame"
    }
```

Generated with discovered.json: 0x472524e51fd5de2a717d2ecb5da307d08ef6d475

# Diff at Tue, 15 Jul 2025 09:06:30 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@fe7c3b2343ca7836e6a947e456ab91a6f0f6f592 block: 22795725
- current block number: 22923575

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

Generated with discovered.json: 0xf46e91471fdb2de0bf4b62d12f98bbb174bd93a7

# Diff at Mon, 14 Jul 2025 12:44:46 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@9f4300dad2f3d080cd56fa311d4a848556c74e72 block: 22795725
- current block number: 22795725

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22795725 (main branch discovery), not current.

```diff
    EOA  (0x000000000000000000000000000000000000dEaD) {
    +++ description: None
      address:
-        "0x000000000000000000000000000000000000dEaD"
+        "eth:0x000000000000000000000000000000000000dEaD"
    }
```

```diff
    EOA  (0x00f9BCEe08DCe4F0e7906c1f6cFb10c77802EEd0) {
    +++ description: None
      address:
-        "0x00f9BCEe08DCe4F0e7906c1f6cFb10c77802EEd0"
+        "eth:0x00f9BCEe08DCe4F0e7906c1f6cFb10c77802EEd0"
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
    contract L1CrossDomainMessenger (0x0BE364912219bC74760f1d1c25F4866b328eBfC6) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      address:
-        "0x0BE364912219bC74760f1d1c25F4866b328eBfC6"
+        "eth:0x0BE364912219bC74760f1d1c25F4866b328eBfC6"
      values.$admin:
-        "0xEEFD1782D70824CBcacf9438afab7f353F1797F0"
+        "eth:0xEEFD1782D70824CBcacf9438afab7f353F1797F0"
      values.$implementation:
-        "0xD3494713A5cfaD3F5359379DfA074E2Ac8C6Fd65"
+        "eth:0xD3494713A5cfaD3F5359379DfA074E2Ac8C6Fd65"
      values.$pastUpgrades.0.2.0:
-        "0xD3494713A5cfaD3F5359379DfA074E2Ac8C6Fd65"
+        "eth:0xD3494713A5cfaD3F5359379DfA074E2Ac8C6Fd65"
      values.OTHER_MESSENGER:
-        "0x4200000000000000000000000000000000000007"
+        "eth:0x4200000000000000000000000000000000000007"
      values.otherMessenger:
-        "0x4200000000000000000000000000000000000007"
+        "eth:0x4200000000000000000000000000000000000007"
      values.portal:
-        "0xB20f99b598E8d888d1887715439851BC68806b22"
+        "eth:0xB20f99b598E8d888d1887715439851BC68806b22"
      values.PORTAL:
-        "0xB20f99b598E8d888d1887715439851BC68806b22"
+        "eth:0xB20f99b598E8d888d1887715439851BC68806b22"
      values.ResolvedDelegateProxy_addressManager:
-        "0x1cb5FB7Da1444e2d895420442D246787B7aFA95D"
+        "eth:0x1cb5FB7Da1444e2d895420442D246787B7aFA95D"
      values.superchainConfig:
-        "0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
+        "eth:0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
      implementationNames.0x0BE364912219bC74760f1d1c25F4866b328eBfC6:
-        "ResolvedDelegateProxy"
      implementationNames.0xD3494713A5cfaD3F5359379DfA074E2Ac8C6Fd65:
-        "L1CrossDomainMessenger"
      implementationNames.eth:0x0BE364912219bC74760f1d1c25F4866b328eBfC6:
+        "ResolvedDelegateProxy"
      implementationNames.eth:0xD3494713A5cfaD3F5359379DfA074E2Ac8C6Fd65:
+        "L1CrossDomainMessenger"
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
    contract AddressManager (0x1cb5FB7Da1444e2d895420442D246787B7aFA95D) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      address:
-        "0x1cb5FB7Da1444e2d895420442D246787B7aFA95D"
+        "eth:0x1cb5FB7Da1444e2d895420442D246787B7aFA95D"
      values.owner:
-        "0xEEFD1782D70824CBcacf9438afab7f353F1797F0"
+        "eth:0xEEFD1782D70824CBcacf9438afab7f353F1797F0"
      implementationNames.0x1cb5FB7Da1444e2d895420442D246787B7aFA95D:
-        "AddressManager"
      implementationNames.eth:0x1cb5FB7Da1444e2d895420442D246787B7aFA95D:
+        "AddressManager"
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
    EOA  (0x28bB9385A588EF4747264D19B9A9F1603591680c) {
    +++ description: None
      address:
-        "0x28bB9385A588EF4747264D19B9A9F1603591680c"
+        "eth:0x28bB9385A588EF4747264D19B9A9F1603591680c"
    }
```

```diff
    EOA  (0x2b8733E8c60A928b19BB7db1D79b918e8E09AC8c) {
    +++ description: None
      address:
-        "0x2b8733E8c60A928b19BB7db1D79b918e8E09AC8c"
+        "eth:0x2b8733E8c60A928b19BB7db1D79b918e8E09AC8c"
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
    EOA  (0x349f3839012DB2271e1BeC68F1668471D175Adb9) {
    +++ description: None
      address:
-        "0x349f3839012DB2271e1BeC68F1668471D175Adb9"
+        "eth:0x349f3839012DB2271e1BeC68F1668471D175Adb9"
    }
```

```diff
    contract SystemConfig (0x34A564BbD863C4bf73Eca711Cf38a77C4Ccbdd6A) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      address:
-        "0x34A564BbD863C4bf73Eca711Cf38a77C4Ccbdd6A"
+        "eth:0x34A564BbD863C4bf73Eca711Cf38a77C4Ccbdd6A"
      values.$admin:
-        "0xEEFD1782D70824CBcacf9438afab7f353F1797F0"
+        "eth:0xEEFD1782D70824CBcacf9438afab7f353F1797F0"
      values.$implementation:
-        "0xAB9d6cB7A427c0765163A7f45BB91cAfe5f2D375"
+        "eth:0xAB9d6cB7A427c0765163A7f45BB91cAfe5f2D375"
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
      values.batcherHash:
-        "0x2b8733E8c60A928b19BB7db1D79b918e8E09AC8c"
+        "eth:0x2b8733E8c60A928b19BB7db1D79b918e8E09AC8c"
      values.batchInbox:
-        "0x00f9BCEe08DCe4F0e7906c1f6cFb10c77802EEd0"
+        "eth:0x00f9BCEe08DCe4F0e7906c1f6cFb10c77802EEd0"
      values.disputeGameFactory:
-        "0x658656A14AFdf9c507096aC406564497d13EC754"
+        "eth:0x658656A14AFdf9c507096aC406564497d13EC754"
      values.gasPayingToken.addr_:
-        "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE"
+        "eth:0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE"
      values.l1CrossDomainMessenger:
-        "0x0BE364912219bC74760f1d1c25F4866b328eBfC6"
+        "eth:0x0BE364912219bC74760f1d1c25F4866b328eBfC6"
      values.l1ERC721Bridge:
-        "0xbc404ae11E4E9DA3Ea9276Aa6DCcA31097D4f4Ee"
+        "eth:0xbc404ae11E4E9DA3Ea9276Aa6DCcA31097D4f4Ee"
      values.l1StandardBridge:
-        "0x564Eb0CeFCcA86160649a8986C419693c82F3678"
+        "eth:0x564Eb0CeFCcA86160649a8986C419693c82F3678"
      values.optimismMintableERC20Factory:
-        "0xa33f75a3A2babD502cbC1A6F54345B529C1F306E"
+        "eth:0xa33f75a3A2babD502cbC1A6F54345B529C1F306E"
      values.optimismPortal:
-        "0xB20f99b598E8d888d1887715439851BC68806b22"
+        "eth:0xB20f99b598E8d888d1887715439851BC68806b22"
      values.owner:
-        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
+        "eth:0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
      values.sequencerInbox:
-        "0x00f9BCEe08DCe4F0e7906c1f6cFb10c77802EEd0"
+        "eth:0x00f9BCEe08DCe4F0e7906c1f6cFb10c77802EEd0"
      values.unsafeBlockSigner:
-        "0xb774Ca8438319d2a97B9925F4CD248e4C470Ac5B"
+        "eth:0xb774Ca8438319d2a97B9925F4CD248e4C470Ac5B"
      implementationNames.0x34A564BbD863C4bf73Eca711Cf38a77C4Ccbdd6A:
-        "Proxy"
      implementationNames.0xAB9d6cB7A427c0765163A7f45BB91cAfe5f2D375:
-        "SystemConfig"
      implementationNames.eth:0x34A564BbD863C4bf73Eca711Cf38a77C4Ccbdd6A:
+        "Proxy"
      implementationNames.eth:0xAB9d6cB7A427c0765163A7f45BB91cAfe5f2D375:
+        "SystemConfig"
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
    EOA  (0x547D0F472309e4239b296D01e03bEDc101241a26) {
    +++ description: None
      address:
-        "0x547D0F472309e4239b296D01e03bEDc101241a26"
+        "eth:0x547D0F472309e4239b296D01e03bEDc101241a26"
    }
```

```diff
    contract L1StandardBridge (0x564Eb0CeFCcA86160649a8986C419693c82F3678) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      address:
-        "0x564Eb0CeFCcA86160649a8986C419693c82F3678"
+        "eth:0x564Eb0CeFCcA86160649a8986C419693c82F3678"
      values.$admin:
-        "0xEEFD1782D70824CBcacf9438afab7f353F1797F0"
+        "eth:0xEEFD1782D70824CBcacf9438afab7f353F1797F0"
      values.$implementation:
-        "0x64B5a5Ed26DCb17370Ff4d33a8D503f0fbD06CfF"
+        "eth:0x64B5a5Ed26DCb17370Ff4d33a8D503f0fbD06CfF"
      values.l2TokenBridge:
-        "0x4200000000000000000000000000000000000010"
+        "eth:0x4200000000000000000000000000000000000010"
      values.messenger:
-        "0x0BE364912219bC74760f1d1c25F4866b328eBfC6"
+        "eth:0x0BE364912219bC74760f1d1c25F4866b328eBfC6"
      values.MESSENGER:
-        "0x0BE364912219bC74760f1d1c25F4866b328eBfC6"
+        "eth:0x0BE364912219bC74760f1d1c25F4866b328eBfC6"
      values.OTHER_BRIDGE:
-        "0x4200000000000000000000000000000000000010"
+        "eth:0x4200000000000000000000000000000000000010"
      values.otherBridge:
-        "0x4200000000000000000000000000000000000010"
+        "eth:0x4200000000000000000000000000000000000010"
      values.superchainConfig:
-        "0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
+        "eth:0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
      implementationNames.0x564Eb0CeFCcA86160649a8986C419693c82F3678:
-        "L1ChugSplashProxy"
      implementationNames.0x64B5a5Ed26DCb17370Ff4d33a8D503f0fbD06CfF:
-        "L1StandardBridge"
      implementationNames.eth:0x564Eb0CeFCcA86160649a8986C419693c82F3678:
+        "L1ChugSplashProxy"
      implementationNames.eth:0x64B5a5Ed26DCb17370Ff4d33a8D503f0fbD06CfF:
+        "L1StandardBridge"
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
    EOA  (0x5bE3E96Cdc3A97628bD7308d3588B9a474F4A54d) {
    +++ description: None
      address:
-        "0x5bE3E96Cdc3A97628bD7308d3588B9a474F4A54d"
+        "eth:0x5bE3E96Cdc3A97628bD7308d3588B9a474F4A54d"
    }
```

```diff
    contract DelayedWETH (0x5e062522fE9D9E0dc651B5D368a4A2Eb41038F87) {
    +++ description: Contract designed to hold the bonded ETH for each game. It is designed as a wrapper around WETH to allow an owner to function as a backstop if a game would incorrectly distribute funds.
      address:
-        "0x5e062522fE9D9E0dc651B5D368a4A2Eb41038F87"
+        "eth:0x5e062522fE9D9E0dc651B5D368a4A2Eb41038F87"
      values.$admin:
-        "0xEEFD1782D70824CBcacf9438afab7f353F1797F0"
+        "eth:0xEEFD1782D70824CBcacf9438afab7f353F1797F0"
      values.$implementation:
-        "0x71e966Ae981d1ce531a7b6d23DC0f27B38409087"
+        "eth:0x71e966Ae981d1ce531a7b6d23DC0f27B38409087"
      values.$pastUpgrades.0.2.0:
-        "0x71e966Ae981d1ce531a7b6d23DC0f27B38409087"
+        "eth:0x71e966Ae981d1ce531a7b6d23DC0f27B38409087"
      values.config:
-        "0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
+        "eth:0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
      values.owner:
-        "0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A"
+        "eth:0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A"
      implementationNames.0x5e062522fE9D9E0dc651B5D368a4A2Eb41038F87:
-        "Proxy"
      implementationNames.0x71e966Ae981d1ce531a7b6d23DC0f27B38409087:
-        "DelayedWETH"
      implementationNames.eth:0x5e062522fE9D9E0dc651B5D368a4A2Eb41038F87:
+        "Proxy"
      implementationNames.eth:0x71e966Ae981d1ce531a7b6d23DC0f27B38409087:
+        "DelayedWETH"
    }
```

```diff
    EOA  (0x5f16E66D8736B689a430564a31c8d887ca357CD8) {
    +++ description: None
      address:
-        "0x5f16E66D8736B689a430564a31c8d887ca357CD8"
+        "eth:0x5f16E66D8736B689a430564a31c8d887ca357CD8"
    }
```

```diff
    contract MIPS (0x5fE03a12C1236F9C22Cb6479778DDAa4bce6299C) {
    +++ description: The MIPS contract is used to execute the final step of the dispute game which objectively determines the winner of the dispute.
      address:
-        "0x5fE03a12C1236F9C22Cb6479778DDAa4bce6299C"
+        "eth:0x5fE03a12C1236F9C22Cb6479778DDAa4bce6299C"
      values.oracle:
-        "0x9c065e11870B891D214Bc2Da7EF1f9DDFA1BE277"
+        "eth:0x9c065e11870B891D214Bc2Da7EF1f9DDFA1BE277"
      implementationNames.0x5fE03a12C1236F9C22Cb6479778DDAa4bce6299C:
-        "MIPS"
      implementationNames.eth:0x5fE03a12C1236F9C22Cb6479778DDAa4bce6299C:
+        "MIPS"
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
    contract DisputeGameFactory (0x658656A14AFdf9c507096aC406564497d13EC754) {
    +++ description: The dispute game factory allows the creation of dispute games, used to propose state roots and eventually challenge them.
      address:
-        "0x658656A14AFdf9c507096aC406564497d13EC754"
+        "eth:0x658656A14AFdf9c507096aC406564497d13EC754"
      values.$admin:
-        "0xEEFD1782D70824CBcacf9438afab7f353F1797F0"
+        "eth:0xEEFD1782D70824CBcacf9438afab7f353F1797F0"
      values.$implementation:
-        "0xc641A33cab81C559F2bd4b21EA34C290E2440C2B"
+        "eth:0xc641A33cab81C559F2bd4b21EA34C290E2440C2B"
      values.$pastUpgrades.0.2.0:
-        "0xc641A33cab81C559F2bd4b21EA34C290E2440C2B"
+        "eth:0xc641A33cab81C559F2bd4b21EA34C290E2440C2B"
      values.gameImpls.0:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.gameImpls.1:
-        "0x80533687a66A1bB366094A9B622873a6CA8415a5"
+        "eth:0x80533687a66A1bB366094A9B622873a6CA8415a5"
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
      implementationNames.0x658656A14AFdf9c507096aC406564497d13EC754:
-        "Proxy"
      implementationNames.0xc641A33cab81C559F2bd4b21EA34C290E2440C2B:
-        "DisputeGameFactory"
      implementationNames.eth:0x658656A14AFdf9c507096aC406564497d13EC754:
+        "Proxy"
      implementationNames.eth:0xc641A33cab81C559F2bd4b21EA34C290E2440C2B:
+        "DisputeGameFactory"
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
    contract PermissionedDisputeGame (0x80533687a66A1bB366094A9B622873a6CA8415a5) {
    +++ description: Same as FaultDisputeGame, but only two permissioned addresses are designated as proposer and challenger.
      address:
-        "0x80533687a66A1bB366094A9B622873a6CA8415a5"
+        "eth:0x80533687a66A1bB366094A9B622873a6CA8415a5"
      values.anchorStateRegistry:
-        "0x924911E2CCAdB4638447ccD00b6cFb040Cc08560"
+        "eth:0x924911E2CCAdB4638447ccD00b6cFb040Cc08560"
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
-        "0x5f16E66D8736B689a430564a31c8d887ca357CD8"
+        "eth:0x5f16E66D8736B689a430564a31c8d887ca357CD8"
      values.vm:
-        "0x5fE03a12C1236F9C22Cb6479778DDAa4bce6299C"
+        "eth:0x5fE03a12C1236F9C22Cb6479778DDAa4bce6299C"
      values.weth:
-        "0x5e062522fE9D9E0dc651B5D368a4A2Eb41038F87"
+        "eth:0x5e062522fE9D9E0dc651B5D368a4A2Eb41038F87"
      implementationNames.0x80533687a66A1bB366094A9B622873a6CA8415a5:
-        "PermissionedDisputeGame"
      implementationNames.eth:0x80533687a66A1bB366094A9B622873a6CA8415a5:
+        "PermissionedDisputeGame"
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
    EOA  (0x88De44422E1b1c30bc530c35aEdb9f5aD0e6fD52) {
    +++ description: None
      address:
-        "0x88De44422E1b1c30bc530c35aEdb9f5aD0e6fD52"
+        "eth:0x88De44422E1b1c30bc530c35aEdb9f5aD0e6fD52"
    }
```

```diff
    contract AnchorStateRegistry (0x924911E2CCAdB4638447ccD00b6cFb040Cc08560) {
    +++ description: Contains the latest confirmed state root that can be used as a starting point in a dispute game.
      address:
-        "0x924911E2CCAdB4638447ccD00b6cFb040Cc08560"
+        "eth:0x924911E2CCAdB4638447ccD00b6cFb040Cc08560"
      values.$admin:
-        "0xEEFD1782D70824CBcacf9438afab7f353F1797F0"
+        "eth:0xEEFD1782D70824CBcacf9438afab7f353F1797F0"
      values.$implementation:
-        "0x64c805c4d7afbA7bF79E94a8eE1113Ec70F88ae9"
+        "eth:0x64c805c4d7afbA7bF79E94a8eE1113Ec70F88ae9"
      values.$pastUpgrades.0.2.0:
-        "0x64c805c4d7afbA7bF79E94a8eE1113Ec70F88ae9"
+        "eth:0x64c805c4d7afbA7bF79E94a8eE1113Ec70F88ae9"
      values.disputeGameFactory:
-        "0x658656A14AFdf9c507096aC406564497d13EC754"
+        "eth:0x658656A14AFdf9c507096aC406564497d13EC754"
      values.superchainConfig:
-        "0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
+        "eth:0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
      implementationNames.0x924911E2CCAdB4638447ccD00b6cFb040Cc08560:
-        "Proxy"
      implementationNames.0x64c805c4d7afbA7bF79E94a8eE1113Ec70F88ae9:
-        "AnchorStateRegistry"
      implementationNames.eth:0x924911E2CCAdB4638447ccD00b6cFb040Cc08560:
+        "Proxy"
      implementationNames.eth:0x64c805c4d7afbA7bF79E94a8eE1113Ec70F88ae9:
+        "AnchorStateRegistry"
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
    contract PreimageOracle (0x9c065e11870B891D214Bc2Da7EF1f9DDFA1BE277) {
    +++ description: The PreimageOracle contract is used to load the required data from L1 for a dispute game.
      address:
-        "0x9c065e11870B891D214Bc2Da7EF1f9DDFA1BE277"
+        "eth:0x9c065e11870B891D214Bc2Da7EF1f9DDFA1BE277"
      implementationNames.0x9c065e11870B891D214Bc2Da7EF1f9DDFA1BE277:
-        "PreimageOracle"
      implementationNames.eth:0x9c065e11870B891D214Bc2Da7EF1f9DDFA1BE277:
+        "PreimageOracle"
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
    contract OptimismMintableERC20Factory (0xa33f75a3A2babD502cbC1A6F54345B529C1F306E) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintableERC20 as this chain's representation of a token on the host chain, or vice-versa.
      address:
-        "0xa33f75a3A2babD502cbC1A6F54345B529C1F306E"
+        "eth:0xa33f75a3A2babD502cbC1A6F54345B529C1F306E"
      values.$admin:
-        "0xEEFD1782D70824CBcacf9438afab7f353F1797F0"
+        "eth:0xEEFD1782D70824CBcacf9438afab7f353F1797F0"
      values.$implementation:
-        "0xE01efbeb1089D1d1dB9c6c8b135C934C0734c846"
+        "eth:0xE01efbeb1089D1d1dB9c6c8b135C934C0734c846"
      values.$pastUpgrades.0.2.0:
-        "0xE01efbeb1089D1d1dB9c6c8b135C934C0734c846"
+        "eth:0xE01efbeb1089D1d1dB9c6c8b135C934C0734c846"
      values.bridge:
-        "0x564Eb0CeFCcA86160649a8986C419693c82F3678"
+        "eth:0x564Eb0CeFCcA86160649a8986C419693c82F3678"
      values.BRIDGE:
-        "0x564Eb0CeFCcA86160649a8986C419693c82F3678"
+        "eth:0x564Eb0CeFCcA86160649a8986C419693c82F3678"
      implementationNames.0xa33f75a3A2babD502cbC1A6F54345B529C1F306E:
-        "Proxy"
      implementationNames.0xE01efbeb1089D1d1dB9c6c8b135C934C0734c846:
-        "OptimismMintableERC20Factory"
      implementationNames.eth:0xa33f75a3A2babD502cbC1A6F54345B529C1F306E:
+        "Proxy"
      implementationNames.eth:0xE01efbeb1089D1d1dB9c6c8b135C934C0734c846:
+        "OptimismMintableERC20Factory"
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
    contract OptimismPortal2 (0xB20f99b598E8d888d1887715439851BC68806b22) {
    +++ description: The OptimismPortal contract is the main entry point to deposit funds from L1 to L2. It also allows to prove and finalize withdrawals. It specifies which game type can be used for withdrawals, which currently is the PermissionedDisputeGame.
      address:
-        "0xB20f99b598E8d888d1887715439851BC68806b22"
+        "eth:0xB20f99b598E8d888d1887715439851BC68806b22"
      values.$admin:
-        "0xEEFD1782D70824CBcacf9438afab7f353F1797F0"
+        "eth:0xEEFD1782D70824CBcacf9438afab7f353F1797F0"
      values.$implementation:
-        "0xe2F826324b2faf99E513D16D266c3F80aE87832B"
+        "eth:0xe2F826324b2faf99E513D16D266c3F80aE87832B"
      values.$pastUpgrades.0.2.0:
-        "0xe2F826324b2faf99E513D16D266c3F80aE87832B"
+        "eth:0xe2F826324b2faf99E513D16D266c3F80aE87832B"
      values.disputeGameFactory:
-        "0x658656A14AFdf9c507096aC406564497d13EC754"
+        "eth:0x658656A14AFdf9c507096aC406564497d13EC754"
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
-        "0x34A564BbD863C4bf73Eca711Cf38a77C4Ccbdd6A"
+        "eth:0x34A564BbD863C4bf73Eca711Cf38a77C4Ccbdd6A"
      implementationNames.0xB20f99b598E8d888d1887715439851BC68806b22:
-        "Proxy"
      implementationNames.0xe2F826324b2faf99E513D16D266c3F80aE87832B:
-        "OptimismPortal2"
      implementationNames.eth:0xB20f99b598E8d888d1887715439851BC68806b22:
+        "Proxy"
      implementationNames.eth:0xe2F826324b2faf99E513D16D266c3F80aE87832B:
+        "OptimismPortal2"
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
    EOA  (0xB65540bBA534E88EB4a5062D0E6519C07063b259) {
    +++ description: None
      address:
-        "0xB65540bBA534E88EB4a5062D0E6519C07063b259"
+        "eth:0xB65540bBA534E88EB4a5062D0E6519C07063b259"
    }
```

```diff
    EOA  (0xb774Ca8438319d2a97B9925F4CD248e4C470Ac5B) {
    +++ description: None
      address:
-        "0xb774Ca8438319d2a97B9925F4CD248e4C470Ac5B"
+        "eth:0xb774Ca8438319d2a97B9925F4CD248e4C470Ac5B"
    }
```

```diff
    contract L1ERC721Bridge (0xbc404ae11E4E9DA3Ea9276Aa6DCcA31097D4f4Ee) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      address:
-        "0xbc404ae11E4E9DA3Ea9276Aa6DCcA31097D4f4Ee"
+        "eth:0xbc404ae11E4E9DA3Ea9276Aa6DCcA31097D4f4Ee"
      values.$admin:
-        "0xEEFD1782D70824CBcacf9438afab7f353F1797F0"
+        "eth:0xEEFD1782D70824CBcacf9438afab7f353F1797F0"
      values.$implementation:
-        "0xAE2AF01232a6c4a4d3012C5eC5b1b35059caF10d"
+        "eth:0xAE2AF01232a6c4a4d3012C5eC5b1b35059caF10d"
      values.$pastUpgrades.0.2.0:
-        "0xAE2AF01232a6c4a4d3012C5eC5b1b35059caF10d"
+        "eth:0xAE2AF01232a6c4a4d3012C5eC5b1b35059caF10d"
      values.messenger:
-        "0x0BE364912219bC74760f1d1c25F4866b328eBfC6"
+        "eth:0x0BE364912219bC74760f1d1c25F4866b328eBfC6"
      values.MESSENGER:
-        "0x0BE364912219bC74760f1d1c25F4866b328eBfC6"
+        "eth:0x0BE364912219bC74760f1d1c25F4866b328eBfC6"
      values.OTHER_BRIDGE:
-        "0x4200000000000000000000000000000000000014"
+        "eth:0x4200000000000000000000000000000000000014"
      values.otherBridge:
-        "0x4200000000000000000000000000000000000014"
+        "eth:0x4200000000000000000000000000000000000014"
      values.superchainConfig:
-        "0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
+        "eth:0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
      implementationNames.0xbc404ae11E4E9DA3Ea9276Aa6DCcA31097D4f4Ee:
-        "Proxy"
      implementationNames.0xAE2AF01232a6c4a4d3012C5eC5b1b35059caF10d:
-        "L1ERC721Bridge"
      implementationNames.eth:0xbc404ae11E4E9DA3Ea9276Aa6DCcA31097D4f4Ee:
+        "Proxy"
      implementationNames.eth:0xAE2AF01232a6c4a4d3012C5eC5b1b35059caF10d:
+        "L1ERC721Bridge"
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
    contract ProxyAdmin (0xEEFD1782D70824CBcacf9438afab7f353F1797F0) {
    +++ description: None
      address:
-        "0xEEFD1782D70824CBcacf9438afab7f353F1797F0"
+        "eth:0xEEFD1782D70824CBcacf9438afab7f353F1797F0"
      values.addressManager:
-        "0x1cb5FB7Da1444e2d895420442D246787B7aFA95D"
+        "eth:0x1cb5FB7Da1444e2d895420442D246787B7aFA95D"
      values.owner:
-        "0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A"
+        "eth:0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A"
      implementationNames.0xEEFD1782D70824CBcacf9438afab7f353F1797F0:
-        "ProxyAdmin"
      implementationNames.eth:0xEEFD1782D70824CBcacf9438afab7f353F1797F0:
+        "ProxyAdmin"
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
    EOA  (0xf83bC4688979b13Da02CB94c76cEB169540760b5) {
    +++ description: None
      address:
-        "0xf83bC4688979b13Da02CB94c76cEB169540760b5"
+        "eth:0xf83bC4688979b13Da02CB94c76cEB169540760b5"
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
    contract L1CrossDomainMessenger (0x0BE364912219bC74760f1d1c25F4866b328eBfC6)
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
```

```diff
+   Status: CREATED
    contract DeputyPauseModule (0x126a736B18E0a64fBA19D421647A530E327E112C)
    +++ description: Allows eth:0x352f1defB49718e7Ea411687E850aA8d6299F7aC, called the deputy pauser, to act on behalf of the eth:0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A if set as its Safe module.
```

```diff
+   Status: CREATED
    contract AddressManager (0x1cb5FB7Da1444e2d895420442D246787B7aFA95D)
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
```

```diff
+   Status: CREATED
    contract LivenessGuard (0x24424336F04440b1c28685a38303aC33C9D14a25)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SystemConfig (0x34A564BbD863C4bf73Eca711Cf38a77C4Ccbdd6A)
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
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
    contract L1StandardBridge (0x564Eb0CeFCcA86160649a8986C419693c82F3678)
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
```

```diff
+   Status: CREATED
    contract SuperchainProxyAdminOwner (0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A)
    +++ description: None
```

```diff
+   Status: CREATED
    contract DelayedWETH (0x5e062522fE9D9E0dc651B5D368a4A2Eb41038F87)
    +++ description: Contract designed to hold the bonded ETH for each game. It is designed as a wrapper around WETH to allow an owner to function as a backstop if a game would incorrectly distribute funds.
```

```diff
+   Status: CREATED
    contract MIPS (0x5fE03a12C1236F9C22Cb6479778DDAa4bce6299C)
    +++ description: The MIPS contract is used to execute the final step of the dispute game which objectively determines the winner of the dispute.
```

```diff
+   Status: CREATED
    contract DisputeGameFactory (0x658656A14AFdf9c507096aC406564497d13EC754)
    +++ description: The dispute game factory allows the creation of dispute games, used to propose state roots and eventually challenge them.
```

```diff
+   Status: CREATED
    contract PermissionedDisputeGame (0x80533687a66A1bB366094A9B622873a6CA8415a5)
    +++ description: Same as FaultDisputeGame, but only two permissioned addresses are designated as proposer and challenger.
```

```diff
+   Status: CREATED
    contract OpFoundationUpgradeSafe (0x847B5c174615B1B7fDF770882256e2D3E95b9D92)
    +++ description: None
```

```diff
+   Status: CREATED
    contract AnchorStateRegistry (0x924911E2CCAdB4638447ccD00b6cFb040Cc08560)
    +++ description: Contains the latest confirmed state root that can be used as a starting point in a dispute game.
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
    contract OptimismMintableERC20Factory (0xa33f75a3A2babD502cbC1A6F54345B529C1F306E)
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintableERC20 as this chain's representation of a token on the host chain, or vice-versa.
```

```diff
+   Status: CREATED
    contract OptimismPortal2 (0xB20f99b598E8d888d1887715439851BC68806b22)
    +++ description: The OptimismPortal contract is the main entry point to deposit funds from L1 to L2. It also allows to prove and finalize withdrawals. It specifies which game type can be used for withdrawals, which currently is the PermissionedDisputeGame.
```

```diff
+   Status: CREATED
    contract L1ERC721Bridge (0xbc404ae11E4E9DA3Ea9276Aa6DCcA31097D4f4Ee)
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
```

```diff
+   Status: CREATED
    contract Gelato Multisig (0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb)
    +++ description: None
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
    contract ProxyAdmin (0xEEFD1782D70824CBcacf9438afab7f353F1797F0)
    +++ description: None
```

Generated with discovered.json: 0x6aab7494fb3989a813a8c8f9e458ff3a97f2e990

# Diff at Mon, 14 Jul 2025 08:02:43 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@0dc82cd5064c9c6dc9fb20e2291a8bb6b2048e27 block: 22795725
- current block number: 22795725

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22795725 (main branch discovery), not current.

```diff
    contract OptimismMintableERC20Factory (0xa33f75a3A2babD502cbC1A6F54345B529C1F306E) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintableERC20 as this chain's representation of a token on the host chain, or vice-versa.
      description:
-        "A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa."
+        "A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintableERC20 as this chain's representation of a token on the host chain, or vice-versa."
    }
```

Generated with discovered.json: 0x11d23d550ccc303c9c15ec63838f1d42ee3c8a9b

# Diff at Fri, 04 Jul 2025 12:18:52 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f56dc47fe915564d4555300304da4d3bcbc087f block: 22795725
- current block number: 22795725

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22795725 (main branch discovery), not current.

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
    EOA  (0x2b8733E8c60A928b19BB7db1D79b918e8E09AC8c) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0x34A564BbD863C4bf73Eca711Cf38a77C4Ccbdd6A"
+        "eth:0x34A564BbD863C4bf73Eca711Cf38a77C4Ccbdd6A"
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
-        "ethereum:0x80533687a66A1bB366094A9B622873a6CA8415a5"
+        "eth:0x80533687a66A1bB366094A9B622873a6CA8415a5"
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
      receivedPermissions.0.via.0.address:
-        "ethereum:0xEEFD1782D70824CBcacf9438afab7f353F1797F0"
+        "eth:0xEEFD1782D70824CBcacf9438afab7f353F1797F0"
      receivedPermissions.0.from:
-        "ethereum:0x1cb5FB7Da1444e2d895420442D246787B7aFA95D"
+        "eth:0x1cb5FB7Da1444e2d895420442D246787B7aFA95D"
      receivedPermissions.1.from:
-        "ethereum:0x5e062522fE9D9E0dc651B5D368a4A2Eb41038F87"
+        "eth:0x5e062522fE9D9E0dc651B5D368a4A2Eb41038F87"
      receivedPermissions.2.via.0.address:
-        "ethereum:0x543bA4AADBAb8f9025686Bd03993043599c6fB04"
+        "eth:0x543bA4AADBAb8f9025686Bd03993043599c6fB04"
      receivedPermissions.2.from:
-        "ethereum:0xdE1FCfB0851916CA5101820A69b13a4E276bd81F"
+        "eth:0xdE1FCfB0851916CA5101820A69b13a4E276bd81F"
      receivedPermissions.3.via.0.address:
-        "ethereum:0xEEFD1782D70824CBcacf9438afab7f353F1797F0"
+        "eth:0xEEFD1782D70824CBcacf9438afab7f353F1797F0"
      receivedPermissions.3.from:
-        "ethereum:0x0BE364912219bC74760f1d1c25F4866b328eBfC6"
+        "eth:0x0BE364912219bC74760f1d1c25F4866b328eBfC6"
      receivedPermissions.4.via.0.address:
-        "ethereum:0xEEFD1782D70824CBcacf9438afab7f353F1797F0"
+        "eth:0xEEFD1782D70824CBcacf9438afab7f353F1797F0"
      receivedPermissions.4.from:
-        "ethereum:0x34A564BbD863C4bf73Eca711Cf38a77C4Ccbdd6A"
+        "eth:0x34A564BbD863C4bf73Eca711Cf38a77C4Ccbdd6A"
      receivedPermissions.5.via.0.address:
-        "ethereum:0xEEFD1782D70824CBcacf9438afab7f353F1797F0"
+        "eth:0xEEFD1782D70824CBcacf9438afab7f353F1797F0"
      receivedPermissions.5.from:
-        "ethereum:0x564Eb0CeFCcA86160649a8986C419693c82F3678"
+        "eth:0x564Eb0CeFCcA86160649a8986C419693c82F3678"
      receivedPermissions.6.via.0.address:
-        "ethereum:0xEEFD1782D70824CBcacf9438afab7f353F1797F0"
+        "eth:0xEEFD1782D70824CBcacf9438afab7f353F1797F0"
      receivedPermissions.6.from:
-        "ethereum:0x5e062522fE9D9E0dc651B5D368a4A2Eb41038F87"
+        "eth:0x5e062522fE9D9E0dc651B5D368a4A2Eb41038F87"
      receivedPermissions.7.via.0.address:
-        "ethereum:0xEEFD1782D70824CBcacf9438afab7f353F1797F0"
+        "eth:0xEEFD1782D70824CBcacf9438afab7f353F1797F0"
      receivedPermissions.7.from:
-        "ethereum:0x658656A14AFdf9c507096aC406564497d13EC754"
+        "eth:0x658656A14AFdf9c507096aC406564497d13EC754"
      receivedPermissions.8.via.0.address:
-        "ethereum:0xEEFD1782D70824CBcacf9438afab7f353F1797F0"
+        "eth:0xEEFD1782D70824CBcacf9438afab7f353F1797F0"
      receivedPermissions.8.from:
-        "ethereum:0x924911E2CCAdB4638447ccD00b6cFb040Cc08560"
+        "eth:0x924911E2CCAdB4638447ccD00b6cFb040Cc08560"
      receivedPermissions.9.via.0.address:
-        "ethereum:0x543bA4AADBAb8f9025686Bd03993043599c6fB04"
+        "eth:0x543bA4AADBAb8f9025686Bd03993043599c6fB04"
      receivedPermissions.9.from:
-        "ethereum:0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
+        "eth:0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
      receivedPermissions.10.via.0.address:
-        "ethereum:0xEEFD1782D70824CBcacf9438afab7f353F1797F0"
+        "eth:0xEEFD1782D70824CBcacf9438afab7f353F1797F0"
      receivedPermissions.10.from:
-        "ethereum:0xa33f75a3A2babD502cbC1A6F54345B529C1F306E"
+        "eth:0xa33f75a3A2babD502cbC1A6F54345B529C1F306E"
      receivedPermissions.11.via.0.address:
-        "ethereum:0xEEFD1782D70824CBcacf9438afab7f353F1797F0"
+        "eth:0xEEFD1782D70824CBcacf9438afab7f353F1797F0"
      receivedPermissions.11.from:
-        "ethereum:0xB20f99b598E8d888d1887715439851BC68806b22"
+        "eth:0xB20f99b598E8d888d1887715439851BC68806b22"
      receivedPermissions.12.via.0.address:
-        "ethereum:0xEEFD1782D70824CBcacf9438afab7f353F1797F0"
+        "eth:0xEEFD1782D70824CBcacf9438afab7f353F1797F0"
      receivedPermissions.12.from:
-        "ethereum:0xbc404ae11E4E9DA3Ea9276Aa6DCcA31097D4f4Ee"
+        "eth:0xbc404ae11E4E9DA3Ea9276Aa6DCcA31097D4f4Ee"
      directlyReceivedPermissions.0.from:
-        "ethereum:0x543bA4AADBAb8f9025686Bd03993043599c6fB04"
+        "eth:0x543bA4AADBAb8f9025686Bd03993043599c6fB04"
      directlyReceivedPermissions.1.from:
-        "ethereum:0xEEFD1782D70824CBcacf9438afab7f353F1797F0"
+        "eth:0xEEFD1782D70824CBcacf9438afab7f353F1797F0"
    }
```

```diff
    EOA  (0x5f16E66D8736B689a430564a31c8d887ca357CD8) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0x80533687a66A1bB366094A9B622873a6CA8415a5"
+        "eth:0x80533687a66A1bB366094A9B622873a6CA8415a5"
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
    contract OpFoundationOperationsSafe (0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0x80533687a66A1bB366094A9B622873a6CA8415a5"
+        "eth:0x80533687a66A1bB366094A9B622873a6CA8415a5"
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
    contract Gelato Multisig (0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0x34A564BbD863C4bf73Eca711Cf38a77C4Ccbdd6A"
+        "eth:0x34A564BbD863C4bf73Eca711Cf38a77C4Ccbdd6A"
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

```diff
    contract ProxyAdmin (0xEEFD1782D70824CBcacf9438afab7f353F1797F0) {
    +++ description: None
      directlyReceivedPermissions.0.from:
-        "ethereum:0x1cb5FB7Da1444e2d895420442D246787B7aFA95D"
+        "eth:0x1cb5FB7Da1444e2d895420442D246787B7aFA95D"
      directlyReceivedPermissions.1.from:
-        "ethereum:0x0BE364912219bC74760f1d1c25F4866b328eBfC6"
+        "eth:0x0BE364912219bC74760f1d1c25F4866b328eBfC6"
      directlyReceivedPermissions.2.from:
-        "ethereum:0x34A564BbD863C4bf73Eca711Cf38a77C4Ccbdd6A"
+        "eth:0x34A564BbD863C4bf73Eca711Cf38a77C4Ccbdd6A"
      directlyReceivedPermissions.3.from:
-        "ethereum:0x564Eb0CeFCcA86160649a8986C419693c82F3678"
+        "eth:0x564Eb0CeFCcA86160649a8986C419693c82F3678"
      directlyReceivedPermissions.4.from:
-        "ethereum:0x5e062522fE9D9E0dc651B5D368a4A2Eb41038F87"
+        "eth:0x5e062522fE9D9E0dc651B5D368a4A2Eb41038F87"
      directlyReceivedPermissions.5.from:
-        "ethereum:0x658656A14AFdf9c507096aC406564497d13EC754"
+        "eth:0x658656A14AFdf9c507096aC406564497d13EC754"
      directlyReceivedPermissions.6.from:
-        "ethereum:0x924911E2CCAdB4638447ccD00b6cFb040Cc08560"
+        "eth:0x924911E2CCAdB4638447ccD00b6cFb040Cc08560"
      directlyReceivedPermissions.7.from:
-        "ethereum:0xa33f75a3A2babD502cbC1A6F54345B529C1F306E"
+        "eth:0xa33f75a3A2babD502cbC1A6F54345B529C1F306E"
      directlyReceivedPermissions.8.from:
-        "ethereum:0xB20f99b598E8d888d1887715439851BC68806b22"
+        "eth:0xB20f99b598E8d888d1887715439851BC68806b22"
      directlyReceivedPermissions.9.from:
-        "ethereum:0xbc404ae11E4E9DA3Ea9276Aa6DCcA31097D4f4Ee"
+        "eth:0xbc404ae11E4E9DA3Ea9276Aa6DCcA31097D4f4Ee"
    }
```

Generated with discovered.json: 0x7c590631cd205c06aefc25952360c0f75524784f

# Diff at Fri, 27 Jun 2025 12:18:41 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@0486f9e4c91d499528f32792e73e81ff4cc57d2c block: 22494925
- current block number: 22795725

## Description

Delete permissionless disputeGame for swell and arenaz [in one tx](https://app.blocksec.com/explorer/tx/eth/0x7d2a05b891c480b91a472a135e867e6a94ba196439e47e76cc08954401a9b224). Both did not use it.

## Watched changes

```diff
-   Status: DELETED
    contract DelayedWETH (0x46Bbd2515CBfd85e8aE786F253E403F84b5718Be)
    +++ description: Contract designed to hold the bonded ETH for each game. It is designed as a wrapper around WETH to allow an owner to function as a backstop if a game would incorrectly distribute funds.
```

```diff
    contract SuperchainProxyAdminOwner (0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A) {
    +++ description: None
      receivedPermissions.1:
-        {"permission":"interact","from":"ethereum:0x46Bbd2515CBfd85e8aE786F253E403F84b5718Be","description":"can pull funds from the contract in case of emergency.","role":".owner"}
      receivedPermissions.6:
-        {"permission":"upgrade","from":"ethereum:0x46Bbd2515CBfd85e8aE786F253E403F84b5718Be","role":"admin","via":[{"address":"ethereum:0xEEFD1782D70824CBcacf9438afab7f353F1797F0"}]}
    }
```

```diff
    contract DisputeGameFactory (0x658656A14AFdf9c507096aC406564497d13EC754) {
    +++ description: The dispute game factory allows the creation of dispute games, used to propose state roots and eventually challenge them.
      values.gameImpls.0:
-        "0x733a80Ce3bAec1f27869b6e4C8bc0E358C121045"
+        "0x0000000000000000000000000000000000000000"
    }
```

```diff
-   Status: DELETED
    contract FaultDisputeGame (0x733a80Ce3bAec1f27869b6e4C8bc0E358C121045)
    +++ description: Logic of the dispute game. When a state root is proposed, a dispute game contract is deployed. Challengers can use such contracts to challenge the proposed state root.
```

```diff
    contract ProxyAdmin (0xEEFD1782D70824CBcacf9438afab7f353F1797F0) {
    +++ description: None
      directlyReceivedPermissions.3:
-        {"permission":"upgrade","from":"ethereum:0x46Bbd2515CBfd85e8aE786F253E403F84b5718Be","role":"admin"}
    }
```

## Source code changes

```diff
.../DelayedWETH}/DelayedWETH.sol                   |    0
 .../DelayedWETH}/Proxy.p.sol                       |    0
 .../DelayedWETH.sol => /dev/null                   |  651 ----
 .../Proxy.p.sol => /dev/null                       |  200 -
 .../FaultDisputeGame.sol => /dev/null              | 3921 --------------------
 5 files changed, 4772 deletions(-)
```

Generated with discovered.json: 0xb154d48b03cb9fd175894bd3a8a89931f7e33f11

# Diff at Mon, 16 Jun 2025 10:14:35 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@e1208475abce20cea1768d2e4878c03350c1b7c9 block: 22494925
- current block number: 22494925

## Description

Config: add permissioned opfp role tags.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22494925 (main branch discovery), not current.

```diff
    contract L1CrossDomainMessenger (0x0BE364912219bC74760f1d1c25F4866b328eBfC6) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      values.$admin:
+        "0xEEFD1782D70824CBcacf9438afab7f353F1797F0"
    }
```

```diff
    EOA Optimism EOA 1 (0x352f1defB49718e7Ea411687E850aA8d6299F7aC) {
    +++ description: None
      receivedPermissions.1:
+        {"permission":"challenge","from":"ethereum:0x80533687a66A1bB366094A9B622873a6CA8415a5","role":".challenger","via":[{"address":"ethereum:0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A"},{"address":"ethereum:0x126a736B18E0a64fBA19D421647A530E327E112C","condition":"though restricted to the global pause function"}]}
    }
```

```diff
    contract SuperchainProxyAdminOwner (0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A) {
    +++ description: None
      receivedPermissions.14:
+        {"permission":"upgrade","from":"ethereum:0x46Bbd2515CBfd85e8aE786F253E403F84b5718Be","role":"admin","via":[{"address":"ethereum:0xEEFD1782D70824CBcacf9438afab7f353F1797F0"}]}
      receivedPermissions.13.from:
-        "ethereum:0x46Bbd2515CBfd85e8aE786F253E403F84b5718Be"
+        "ethereum:0x34A564BbD863C4bf73Eca711Cf38a77C4Ccbdd6A"
      receivedPermissions.12.from:
-        "ethereum:0x34A564BbD863C4bf73Eca711Cf38a77C4Ccbdd6A"
+        "ethereum:0x5e062522fE9D9E0dc651B5D368a4A2Eb41038F87"
      receivedPermissions.11.from:
-        "ethereum:0x5e062522fE9D9E0dc651B5D368a4A2Eb41038F87"
+        "ethereum:0xbc404ae11E4E9DA3Ea9276Aa6DCcA31097D4f4Ee"
      receivedPermissions.10.from:
-        "ethereum:0xbc404ae11E4E9DA3Ea9276Aa6DCcA31097D4f4Ee"
+        "ethereum:0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
      receivedPermissions.10.via.0.address:
-        "ethereum:0xEEFD1782D70824CBcacf9438afab7f353F1797F0"
+        "ethereum:0x543bA4AADBAb8f9025686Bd03993043599c6fB04"
      receivedPermissions.9.from:
-        "ethereum:0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
+        "ethereum:0x924911E2CCAdB4638447ccD00b6cFb040Cc08560"
      receivedPermissions.9.via.0.address:
-        "ethereum:0x543bA4AADBAb8f9025686Bd03993043599c6fB04"
+        "ethereum:0xEEFD1782D70824CBcacf9438afab7f353F1797F0"
      receivedPermissions.8.from:
-        "ethereum:0x924911E2CCAdB4638447ccD00b6cFb040Cc08560"
+        "ethereum:0xB20f99b598E8d888d1887715439851BC68806b22"
      receivedPermissions.7.from:
-        "ethereum:0xB20f99b598E8d888d1887715439851BC68806b22"
+        "ethereum:0x0BE364912219bC74760f1d1c25F4866b328eBfC6"
    }
```

```diff
    EOA  (0x5f16E66D8736B689a430564a31c8d887ca357CD8) {
    +++ description: None
      receivedPermissions:
+        [{"permission":"propose","from":"ethereum:0x80533687a66A1bB366094A9B622873a6CA8415a5","role":".proposer"}]
    }
```

```diff
    contract OpFoundationOperationsSafe (0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A) {
    +++ description: None
      receivedPermissions.1:
+        {"permission":"challenge","from":"ethereum:0x80533687a66A1bB366094A9B622873a6CA8415a5","role":".challenger"}
    }
```

```diff
    contract ProxyAdmin (0xEEFD1782D70824CBcacf9438afab7f353F1797F0) {
    +++ description: None
      directlyReceivedPermissions.10:
+        {"permission":"upgrade","from":"ethereum:0x46Bbd2515CBfd85e8aE786F253E403F84b5718Be","role":"admin"}
      directlyReceivedPermissions.9.from:
-        "ethereum:0x46Bbd2515CBfd85e8aE786F253E403F84b5718Be"
+        "ethereum:0x34A564BbD863C4bf73Eca711Cf38a77C4Ccbdd6A"
      directlyReceivedPermissions.8.from:
-        "ethereum:0x34A564BbD863C4bf73Eca711Cf38a77C4Ccbdd6A"
+        "ethereum:0x5e062522fE9D9E0dc651B5D368a4A2Eb41038F87"
      directlyReceivedPermissions.7.from:
-        "ethereum:0x5e062522fE9D9E0dc651B5D368a4A2Eb41038F87"
+        "ethereum:0xbc404ae11E4E9DA3Ea9276Aa6DCcA31097D4f4Ee"
      directlyReceivedPermissions.6.from:
-        "ethereum:0xbc404ae11E4E9DA3Ea9276Aa6DCcA31097D4f4Ee"
+        "ethereum:0x924911E2CCAdB4638447ccD00b6cFb040Cc08560"
      directlyReceivedPermissions.5.from:
-        "ethereum:0x924911E2CCAdB4638447ccD00b6cFb040Cc08560"
+        "ethereum:0xB20f99b598E8d888d1887715439851BC68806b22"
      directlyReceivedPermissions.4.from:
-        "ethereum:0xB20f99b598E8d888d1887715439851BC68806b22"
+        "ethereum:0x0BE364912219bC74760f1d1c25F4866b328eBfC6"
    }
```

Generated with discovered.json: 0x980914e1b2ae059da1f99b523a516d6592679901

# Diff at Fri, 30 May 2025 06:54:51 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@a4d8c436027d17df0f9b76843cd6deb1888fa381 block: 22494925
- current block number: 22494925

## Description

config: change comment about eip1559 fee val

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22494925 (main branch discovery), not current.

```diff
    contract SystemConfig (0x34A564BbD863C4bf73Eca711Cf38a77C4Ccbdd6A) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      fieldMeta.eip1559Denominator:
+        {"description":"volatility param: lower denominator -> quicker fee changes on L2"}
    }
```

Generated with discovered.json: 0x629a572778b445aefc231779e46271b4cc81ebb4

# Diff at Fri, 23 May 2025 09:40:53 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@69cd181abbc3c830a6caf2f4429b37cae72ffdb8 block: 22494925
- current block number: 22494925

## Description

Introduced .role field on each permission, defaulting to field name on which it was defined (with '.' prefix)

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22494925 (main branch discovery), not current.

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
    EOA  (0x2b8733E8c60A928b19BB7db1D79b918e8E09AC8c) {
    +++ description: None
      receivedPermissions.0.role:
+        ".batcherHash"
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
      receivedPermissions.13.role:
+        "admin"
      receivedPermissions.12.role:
+        "admin"
      receivedPermissions.11.role:
+        "admin"
      receivedPermissions.10.from:
-        "0x564Eb0CeFCcA86160649a8986C419693c82F3678"
+        "0x924911E2CCAdB4638447ccD00b6cFb040Cc08560"
      receivedPermissions.10.description:
-        "upgrading the bridge implementation can give access to all funds escrowed therein."
      receivedPermissions.10.role:
+        "admin"
      receivedPermissions.9.permission:
-        "interact"
+        "upgrade"
      receivedPermissions.9.from:
-        "0xdE1FCfB0851916CA5101820A69b13a4E276bd81F"
+        "0x46Bbd2515CBfd85e8aE786F253E403F84b5718Be"
      receivedPermissions.9.description:
-        "set and change address mappings."
      receivedPermissions.9.via.0.address:
-        "0x543bA4AADBAb8f9025686Bd03993043599c6fB04"
+        "0xEEFD1782D70824CBcacf9438afab7f353F1797F0"
      receivedPermissions.9.role:
+        "admin"
      receivedPermissions.8.permission:
-        "interact"
+        "upgrade"
      receivedPermissions.8.from:
-        "0x1cb5FB7Da1444e2d895420442D246787B7aFA95D"
+        "0x5e062522fE9D9E0dc651B5D368a4A2Eb41038F87"
      receivedPermissions.8.description:
-        "set and change address mappings."
      receivedPermissions.8.role:
+        "admin"
      receivedPermissions.7.from:
-        "0x924911E2CCAdB4638447ccD00b6cFb040Cc08560"
+        "0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
      receivedPermissions.7.via.0.address:
-        "0xEEFD1782D70824CBcacf9438afab7f353F1797F0"
+        "0x543bA4AADBAb8f9025686Bd03993043599c6fB04"
      receivedPermissions.7.role:
+        "admin"
      receivedPermissions.6.from:
-        "0x46Bbd2515CBfd85e8aE786F253E403F84b5718Be"
+        "0xa33f75a3A2babD502cbC1A6F54345B529C1F306E"
      receivedPermissions.6.role:
+        "admin"
      receivedPermissions.5.from:
-        "0x5e062522fE9D9E0dc651B5D368a4A2Eb41038F87"
+        "0xB20f99b598E8d888d1887715439851BC68806b22"
      receivedPermissions.5.role:
+        "admin"
      receivedPermissions.4.from:
-        "0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
+        "0x564Eb0CeFCcA86160649a8986C419693c82F3678"
      receivedPermissions.4.via.0.address:
-        "0x543bA4AADBAb8f9025686Bd03993043599c6fB04"
+        "0xEEFD1782D70824CBcacf9438afab7f353F1797F0"
      receivedPermissions.4.description:
+        "upgrading the bridge implementation can give access to all funds escrowed therein."
      receivedPermissions.4.role:
+        ".$admin"
      receivedPermissions.3.permission:
-        "upgrade"
+        "interact"
      receivedPermissions.3.from:
-        "0xa33f75a3A2babD502cbC1A6F54345B529C1F306E"
+        "0xdE1FCfB0851916CA5101820A69b13a4E276bd81F"
      receivedPermissions.3.via.0.address:
-        "0xEEFD1782D70824CBcacf9438afab7f353F1797F0"
+        "0x543bA4AADBAb8f9025686Bd03993043599c6fB04"
      receivedPermissions.3.description:
+        "set and change address mappings."
      receivedPermissions.3.role:
+        ".owner"
      receivedPermissions.2.permission:
-        "upgrade"
+        "interact"
      receivedPermissions.2.from:
-        "0xB20f99b598E8d888d1887715439851BC68806b22"
+        "0x1cb5FB7Da1444e2d895420442D246787B7aFA95D"
      receivedPermissions.2.description:
+        "set and change address mappings."
      receivedPermissions.2.role:
+        ".owner"
      receivedPermissions.1.role:
+        ".owner"
      receivedPermissions.0.role:
+        ".owner"
      directlyReceivedPermissions.1.role:
+        ".owner"
      directlyReceivedPermissions.0.role:
+        ".owner"
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
    contract OpFoundationOperationsSafe (0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A) {
    +++ description: None
      receivedPermissions.0.role:
+        ".guardian"
      directlyReceivedPermissions.0.role:
+        ".deputyGuardian"
    }
```

```diff
    contract Gelato Multisig (0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb) {
    +++ description: None
      receivedPermissions.0.role:
+        ".owner"
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

```diff
    contract ProxyAdmin (0xEEFD1782D70824CBcacf9438afab7f353F1797F0) {
    +++ description: None
      directlyReceivedPermissions.9.role:
+        "admin"
      directlyReceivedPermissions.8.role:
+        "admin"
      directlyReceivedPermissions.7.role:
+        "admin"
      directlyReceivedPermissions.6.from:
-        "0x564Eb0CeFCcA86160649a8986C419693c82F3678"
+        "0x924911E2CCAdB4638447ccD00b6cFb040Cc08560"
      directlyReceivedPermissions.6.description:
-        "upgrading the bridge implementation can give access to all funds escrowed therein."
      directlyReceivedPermissions.6.role:
+        "admin"
      directlyReceivedPermissions.5.permission:
-        "interact"
+        "upgrade"
      directlyReceivedPermissions.5.from:
-        "0x1cb5FB7Da1444e2d895420442D246787B7aFA95D"
+        "0x46Bbd2515CBfd85e8aE786F253E403F84b5718Be"
      directlyReceivedPermissions.5.description:
-        "set and change address mappings."
      directlyReceivedPermissions.5.role:
+        "admin"
      directlyReceivedPermissions.4.from:
-        "0x924911E2CCAdB4638447ccD00b6cFb040Cc08560"
+        "0x5e062522fE9D9E0dc651B5D368a4A2Eb41038F87"
      directlyReceivedPermissions.4.role:
+        "admin"
      directlyReceivedPermissions.3.from:
-        "0x46Bbd2515CBfd85e8aE786F253E403F84b5718Be"
+        "0xa33f75a3A2babD502cbC1A6F54345B529C1F306E"
      directlyReceivedPermissions.3.role:
+        "admin"
      directlyReceivedPermissions.2.from:
-        "0x5e062522fE9D9E0dc651B5D368a4A2Eb41038F87"
+        "0xB20f99b598E8d888d1887715439851BC68806b22"
      directlyReceivedPermissions.2.role:
+        "admin"
      directlyReceivedPermissions.1.from:
-        "0xa33f75a3A2babD502cbC1A6F54345B529C1F306E"
+        "0x564Eb0CeFCcA86160649a8986C419693c82F3678"
      directlyReceivedPermissions.1.description:
+        "upgrading the bridge implementation can give access to all funds escrowed therein."
      directlyReceivedPermissions.1.role:
+        ".$admin"
      directlyReceivedPermissions.0.permission:
-        "upgrade"
+        "interact"
      directlyReceivedPermissions.0.from:
-        "0xB20f99b598E8d888d1887715439851BC68806b22"
+        "0x1cb5FB7Da1444e2d895420442D246787B7aFA95D"
      directlyReceivedPermissions.0.description:
+        "set and change address mappings."
      directlyReceivedPermissions.0.role:
+        ".owner"
    }
```

Generated with discovered.json: 0x7d95eb389cd9311f276ec9e1b078a5f6daaf7b87

# Diff at Fri, 16 May 2025 10:05:16 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@9912083f7b773804513e08ee765f8ba71a92980b block: 22437731
- current block number: 22494925

## Description

Upgrade to new proof system version with MIPS v1.2.1, still permissioned.

## Watched changes

```diff
-   Status: DELETED
    contract MIPS (0x16e83cE5Ce29BF90AD9Da06D2fE6a15d5f344ce4)
    +++ description: The MIPS contract is used to execute the final step of the dispute game which objectively determines the winner of the dispute.
```

```diff
-   Status: DELETED
    contract PermissionedDisputeGame (0x227882E5972EbAd990dcF04E2dbe2fC84094E146)
    +++ description: Same as FaultDisputeGame, but only two permissioned addresses are designated as proposer and challenger.
```

```diff
    contract SuperchainProxyAdminOwner (0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A) {
    +++ description: None
      receivedPermissions.13:
+        {"permission":"upgrade","from":"0x34A564BbD863C4bf73Eca711Cf38a77C4Ccbdd6A","via":[{"address":"0xEEFD1782D70824CBcacf9438afab7f353F1797F0"}]}
      receivedPermissions.12:
+        {"permission":"upgrade","from":"0xbc404ae11E4E9DA3Ea9276Aa6DCcA31097D4f4Ee","via":[{"address":"0xEEFD1782D70824CBcacf9438afab7f353F1797F0"}]}
      receivedPermissions.11.from:
-        "0x34A564BbD863C4bf73Eca711Cf38a77C4Ccbdd6A"
+        "0x658656A14AFdf9c507096aC406564497d13EC754"
      receivedPermissions.10.from:
-        "0xbc404ae11E4E9DA3Ea9276Aa6DCcA31097D4f4Ee"
+        "0x564Eb0CeFCcA86160649a8986C419693c82F3678"
      receivedPermissions.10.description:
+        "upgrading the bridge implementation can give access to all funds escrowed therein."
      receivedPermissions.9.permission:
-        "upgrade"
+        "interact"
      receivedPermissions.9.from:
-        "0x658656A14AFdf9c507096aC406564497d13EC754"
+        "0xdE1FCfB0851916CA5101820A69b13a4E276bd81F"
      receivedPermissions.9.via.0.address:
-        "0xEEFD1782D70824CBcacf9438afab7f353F1797F0"
+        "0x543bA4AADBAb8f9025686Bd03993043599c6fB04"
      receivedPermissions.9.description:
+        "set and change address mappings."
      receivedPermissions.8.permission:
-        "upgrade"
+        "interact"
      receivedPermissions.8.from:
-        "0x564Eb0CeFCcA86160649a8986C419693c82F3678"
+        "0x1cb5FB7Da1444e2d895420442D246787B7aFA95D"
      receivedPermissions.8.description:
-        "upgrading the bridge implementation can give access to all funds escrowed therein."
+        "set and change address mappings."
      receivedPermissions.7.permission:
-        "interact"
+        "upgrade"
      receivedPermissions.7.from:
-        "0xdE1FCfB0851916CA5101820A69b13a4E276bd81F"
+        "0x924911E2CCAdB4638447ccD00b6cFb040Cc08560"
      receivedPermissions.7.description:
-        "set and change address mappings."
      receivedPermissions.7.via.0.address:
-        "0x543bA4AADBAb8f9025686Bd03993043599c6fB04"
+        "0xEEFD1782D70824CBcacf9438afab7f353F1797F0"
      receivedPermissions.6.permission:
-        "interact"
+        "upgrade"
      receivedPermissions.6.from:
-        "0x1cb5FB7Da1444e2d895420442D246787B7aFA95D"
+        "0x46Bbd2515CBfd85e8aE786F253E403F84b5718Be"
      receivedPermissions.6.description:
-        "set and change address mappings."
      receivedPermissions.5.from:
-        "0x924911E2CCAdB4638447ccD00b6cFb040Cc08560"
+        "0x5e062522fE9D9E0dc651B5D368a4A2Eb41038F87"
      receivedPermissions.4.from:
-        "0xAF1308930B721e763a6b21cf143E4e86e702f164"
+        "0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
      receivedPermissions.4.via.0.address:
-        "0xEEFD1782D70824CBcacf9438afab7f353F1797F0"
+        "0x543bA4AADBAb8f9025686Bd03993043599c6fB04"
      receivedPermissions.3.from:
-        "0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
+        "0xa33f75a3A2babD502cbC1A6F54345B529C1F306E"
      receivedPermissions.3.via.0.address:
-        "0x543bA4AADBAb8f9025686Bd03993043599c6fB04"
+        "0xEEFD1782D70824CBcacf9438afab7f353F1797F0"
      receivedPermissions.2.from:
-        "0xa33f75a3A2babD502cbC1A6F54345B529C1F306E"
+        "0xB20f99b598E8d888d1887715439851BC68806b22"
      receivedPermissions.1.permission:
-        "upgrade"
+        "interact"
      receivedPermissions.1.from:
-        "0xB20f99b598E8d888d1887715439851BC68806b22"
+        "0x46Bbd2515CBfd85e8aE786F253E403F84b5718Be"
      receivedPermissions.1.via:
-        [{"address":"0xEEFD1782D70824CBcacf9438afab7f353F1797F0"}]
      receivedPermissions.1.description:
+        "can pull funds from the contract in case of emergency."
      receivedPermissions.0.from:
-        "0xAF1308930B721e763a6b21cf143E4e86e702f164"
+        "0x5e062522fE9D9E0dc651B5D368a4A2Eb41038F87"
    }
```

```diff
    contract DisputeGameFactory (0x658656A14AFdf9c507096aC406564497d13EC754) {
    +++ description: The dispute game factory allows the creation of dispute games, used to propose state roots and eventually challenge them.
      values.gameImpls.4:
-        "0x227882E5972EbAd990dcF04E2dbe2fC84094E146"
+        "0x80533687a66A1bB366094A9B622873a6CA8415a5"
      values.gameImpls.3:
-        "0x0000000000000000000000000000000000000000"
+        "0x733a80Ce3bAec1f27869b6e4C8bc0E358C121045"
    }
```

```diff
-   Status: DELETED
    contract DelayedWETH (0xAF1308930B721e763a6b21cf143E4e86e702f164)
    +++ description: Contract designed to hold the bonded ETH for each game. It is designed as a wrapper around WETH to allow an owner to function as a backstop if a game would incorrectly distribute funds.
```

```diff
    contract ProxyAdmin (0xEEFD1782D70824CBcacf9438afab7f353F1797F0) {
    +++ description: None
      directlyReceivedPermissions.9:
+        {"permission":"upgrade","from":"0x34A564BbD863C4bf73Eca711Cf38a77C4Ccbdd6A"}
      directlyReceivedPermissions.8.from:
-        "0x34A564BbD863C4bf73Eca711Cf38a77C4Ccbdd6A"
+        "0xbc404ae11E4E9DA3Ea9276Aa6DCcA31097D4f4Ee"
      directlyReceivedPermissions.7.from:
-        "0xbc404ae11E4E9DA3Ea9276Aa6DCcA31097D4f4Ee"
+        "0x658656A14AFdf9c507096aC406564497d13EC754"
      directlyReceivedPermissions.6.from:
-        "0x658656A14AFdf9c507096aC406564497d13EC754"
+        "0x564Eb0CeFCcA86160649a8986C419693c82F3678"
      directlyReceivedPermissions.6.description:
+        "upgrading the bridge implementation can give access to all funds escrowed therein."
      directlyReceivedPermissions.5.permission:
-        "upgrade"
+        "interact"
      directlyReceivedPermissions.5.from:
-        "0x564Eb0CeFCcA86160649a8986C419693c82F3678"
+        "0x1cb5FB7Da1444e2d895420442D246787B7aFA95D"
      directlyReceivedPermissions.5.description:
-        "upgrading the bridge implementation can give access to all funds escrowed therein."
+        "set and change address mappings."
      directlyReceivedPermissions.4.permission:
-        "interact"
+        "upgrade"
      directlyReceivedPermissions.4.from:
-        "0x1cb5FB7Da1444e2d895420442D246787B7aFA95D"
+        "0x924911E2CCAdB4638447ccD00b6cFb040Cc08560"
      directlyReceivedPermissions.4.description:
-        "set and change address mappings."
      directlyReceivedPermissions.3.from:
-        "0x924911E2CCAdB4638447ccD00b6cFb040Cc08560"
+        "0x46Bbd2515CBfd85e8aE786F253E403F84b5718Be"
      directlyReceivedPermissions.2.from:
-        "0xAF1308930B721e763a6b21cf143E4e86e702f164"
+        "0x5e062522fE9D9E0dc651B5D368a4A2Eb41038F87"
    }
```

```diff
+   Status: CREATED
    contract DelayedWETH (0x46Bbd2515CBfd85e8aE786F253E403F84b5718Be)
    +++ description: Contract designed to hold the bonded ETH for each game. It is designed as a wrapper around WETH to allow an owner to function as a backstop if a game would incorrectly distribute funds.
```

```diff
+   Status: CREATED
    contract DelayedWETH (0x5e062522fE9D9E0dc651B5D368a4A2Eb41038F87)
    +++ description: Contract designed to hold the bonded ETH for each game. It is designed as a wrapper around WETH to allow an owner to function as a backstop if a game would incorrectly distribute funds.
```

```diff
+   Status: CREATED
    contract MIPS (0x5fE03a12C1236F9C22Cb6479778DDAa4bce6299C)
    +++ description: The MIPS contract is used to execute the final step of the dispute game which objectively determines the winner of the dispute.
```

```diff
+   Status: CREATED
    contract FaultDisputeGame (0x733a80Ce3bAec1f27869b6e4C8bc0E358C121045)
    +++ description: Logic of the dispute game. When a state root is proposed, a dispute game contract is deployed. Challengers can use such contracts to challenge the proposed state root.
```

```diff
+   Status: CREATED
    contract PermissionedDisputeGame (0x80533687a66A1bB366094A9B622873a6CA8415a5)
    +++ description: Same as FaultDisputeGame, but only two permissioned addresses are designated as proposer and challenger.
```

## Source code changes

```diff
.../DelayedWETH.sol                                |    0
 .../Proxy.p.sol                                    |    0
 .../DelayedWETH.sol                                |  651 ++++
 .../Proxy.p.sol                                    |  200 +
 .../arenaz/ethereum/.flat/FaultDisputeGame.sol     | 3921 ++++++++++++++++++++
 .../ethereum/{.flat@22437731 => .flat}/MIPS.sol    |  444 ++-
 .../PermissionedDisputeGame.sol                    |   14 +-
 7 files changed, 5106 insertions(+), 124 deletions(-)
```

Generated with discovered.json: 0x0b668b163543f8447213feec3cb630d3e90aef9e

# Diff at Fri, 09 May 2025 10:09:02 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@c3a1d49c07f4092914d62c65181e5fec18a88318 block: 22437731
- current block number: 22437731

## Description

Config related: Move IFs to the editable string for condition configs (yeet IFs from the automatic resolver).

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22437731 (main branch discovery), not current.

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

Generated with discovered.json: 0xe2dd5888ba0d5c9d53d47fd45de751637b0ed72b

# Diff at Thu, 08 May 2025 08:48:01 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@8e1926142ab0c57cc131de4d8da307e13d9af54d block: 22194734
- current block number: 22437731

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
.../arenaz/ethereum/.flat/DeputyPauseModule.sol    | 1338 ++++++++++++++++++++
 1 file changed, 1338 insertions(+)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22194734 (main branch discovery), not current.

```diff
    contract PermissionedDisputeGame (0x227882E5972EbAd990dcF04E2dbe2fC84094E146) {
    +++ description: Same as FaultDisputeGame, but only two permissioned addresses are designated as proposer and challenger.
      usedTypes.0.arg.0x03682932cec7ce0a3874b19675a6bbc923054a7b321efc7d3835187b172494b6:
+        "v1.6.0 (cannon64)"
    }
```

Generated with discovered.json: 0xe288dc36c905bd991ec4a545b5ed7addf6e030f9

# Diff at Tue, 29 Apr 2025 08:18:59 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@ef7477af00fe0b57a2f7cacf7e958c12494af662 block: 22194734
- current block number: 22194734

## Description

Field .issuedPermissions is removed from the output as no longer needed. Added 'permissionsConfigHash' due to refactoring of the modelling process (into a separate command).

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22194734 (main branch discovery), not current.

```diff
    contract LivenessModule (0x0454092516c9A4d636d3CAfA1e82161376C8a748) {
    +++ description: used to remove members inactive for 98d while making sure that the threshold remains above 75%. If the number of members falls below 8, the 0x847B5c174615B1B7fDF770882256e2D3E95b9D92 takes ownership of the multisig
      issuedPermissions:
-        [{"permission":"interact","to":"0x24424336F04440b1c28685a38303aC33C9D14a25","description":"can remove members of 0xc2819DC788505Aac350142A7A707BF9D03E3Bd03 inactive for 98d.","via":[]}]
    }
```

```diff
    contract AddressManager (0x1cb5FB7Da1444e2d895420442D246787B7aFA95D) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      issuedPermissions:
-        [{"permission":"interact","to":"0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A","description":"set and change address mappings.","via":[{"address":"0xEEFD1782D70824CBcacf9438afab7f353F1797F0"}]}]
    }
```

```diff
    contract SystemConfig (0x34A564BbD863C4bf73Eca711Cf38a77C4Ccbdd6A) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      issuedPermissions:
-        [{"permission":"interact","to":"0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb","description":"it can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system.","via":[]},{"permission":"sequence","to":"0x2b8733E8c60A928b19BB7db1D79b918e8E09AC8c","via":[]},{"permission":"upgrade","to":"0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A","via":[{"address":"0xEEFD1782D70824CBcacf9438afab7f353F1797F0"}]}]
    }
```

```diff
    contract L1StandardBridge (0x564Eb0CeFCcA86160649a8986C419693c82F3678) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A","description":"upgrading the bridge implementation can give access to all funds escrowed therein.","via":[{"address":"0xEEFD1782D70824CBcacf9438afab7f353F1797F0"}]}]
    }
```

```diff
    contract DisputeGameFactory (0x658656A14AFdf9c507096aC406564497d13EC754) {
    +++ description: The dispute game factory allows the creation of dispute games, used to propose state roots and eventually challenge them.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A","via":[{"address":"0xEEFD1782D70824CBcacf9438afab7f353F1797F0"}]}]
    }
```

```diff
    contract AnchorStateRegistry (0x924911E2CCAdB4638447ccD00b6cFb040Cc08560) {
    +++ description: Contains the latest confirmed state root that can be used as a starting point in a dispute game.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A","via":[{"address":"0xEEFD1782D70824CBcacf9438afab7f353F1797F0"}]}]
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
    contract OptimismMintableERC20Factory (0xa33f75a3A2babD502cbC1A6F54345B529C1F306E) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A","via":[{"address":"0xEEFD1782D70824CBcacf9438afab7f353F1797F0"}]}]
    }
```

```diff
    contract DelayedWETH (0xAF1308930B721e763a6b21cf143E4e86e702f164) {
    +++ description: Contract designed to hold the bonded ETH for each game. It is designed as a wrapper around WETH to allow an owner to function as a backstop if a game would incorrectly distribute funds.
      issuedPermissions:
-        [{"permission":"interact","to":"0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A","description":"can pull funds from the contract in case of emergency.","via":[]},{"permission":"upgrade","to":"0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A","via":[{"address":"0xEEFD1782D70824CBcacf9438afab7f353F1797F0"}]}]
    }
```

```diff
    contract OptimismPortal2 (0xB20f99b598E8d888d1887715439851BC68806b22) {
    +++ description: The OptimismPortal contract is the main entry point to deposit funds from L1 to L2. It also allows to prove and finalize withdrawals. It specifies which game type can be used for withdrawals, which currently is the PermissionedDisputeGame.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A","via":[{"address":"0xEEFD1782D70824CBcacf9438afab7f353F1797F0"}]}]
    }
```

```diff
    contract L1ERC721Bridge (0xbc404ae11E4E9DA3Ea9276Aa6DCcA31097D4f4Ee) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A","via":[{"address":"0xEEFD1782D70824CBcacf9438afab7f353F1797F0"}]}]
    }
```

```diff
    contract AddressManager (0xdE1FCfB0851916CA5101820A69b13a4E276bd81F) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      issuedPermissions:
-        [{"permission":"interact","to":"0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A","description":"set and change address mappings.","via":[{"address":"0x543bA4AADBAb8f9025686Bd03993043599c6fB04"}]}]
    }
```

Generated with discovered.json: 0xac55b213361f9ac3419e1c72216d5e3c81d3c8cb

# Diff at Fri, 11 Apr 2025 13:15:30 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@b607477490db79d49274f7585039ac7263456118 block: 22194734
- current block number: 22194734

## Description

Config: global mapping updated for op stack prestates.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22194734 (main branch discovery), not current.

```diff
    contract PermissionedDisputeGame (0x227882E5972EbAd990dcF04E2dbe2fC84094E146) {
    +++ description: Same as FaultDisputeGame, but only two permissioned addresses are designated as proposer and challenger.
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

Generated with discovered.json: 0xe35f9f5a13ba6c5799461727f3f95b15b3401441

# Diff at Thu, 10 Apr 2025 14:42:11 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@f38a3c9bf359344e4c4cd3006f58271cb8f78d15 block: 22194734
- current block number: 22194734

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22194734 (main branch discovery), not current.

```diff
    contract SuperchainProxyAdmin (0x543bA4AADBAb8f9025686Bd03993043599c6fB04) {
    +++ description: None
      displayName:
-        "ProxyAdmin"
    }
```

Generated with discovered.json: 0xac629e691ac08f99bc2750b2ca53fc12048b74e0

# Diff at Fri, 04 Apr 2025 09:43:33 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@b3154c4385e52c9ffc0dab984c207390e5ccc13d block: 21829667
- current block number: 22194734

## Description

Discovery rerun on the same block number with only config-related changes.

## Watched changes

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

## Source code changes

```diff
.../SuperchainConfig/SuperchainConfig.sol                         | 8 ++++----
 1 file changed, 4 insertions(+), 4 deletions(-)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21829667 (main branch discovery), not current.

```diff
    contract SuperchainProxyAdminOwner (0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A) {
    +++ description: None
      receivedPermissions.11:
+        {"permission":"upgrade","from":"0x34A564BbD863C4bf73Eca711Cf38a77C4Ccbdd6A","via":[{"address":"0xEEFD1782D70824CBcacf9438afab7f353F1797F0"}]}
      receivedPermissions.10.from:
-        "0x34A564BbD863C4bf73Eca711Cf38a77C4Ccbdd6A"
+        "0xbc404ae11E4E9DA3Ea9276Aa6DCcA31097D4f4Ee"
      receivedPermissions.9.from:
-        "0xbc404ae11E4E9DA3Ea9276Aa6DCcA31097D4f4Ee"
+        "0x658656A14AFdf9c507096aC406564497d13EC754"
      receivedPermissions.8.from:
-        "0x658656A14AFdf9c507096aC406564497d13EC754"
+        "0x564Eb0CeFCcA86160649a8986C419693c82F3678"
      receivedPermissions.8.description:
+        "upgrading the bridge implementation can give access to all funds escrowed therein."
      receivedPermissions.7.permission:
-        "upgrade"
+        "interact"
      receivedPermissions.7.from:
-        "0x564Eb0CeFCcA86160649a8986C419693c82F3678"
+        "0xdE1FCfB0851916CA5101820A69b13a4E276bd81F"
      receivedPermissions.7.description:
-        "upgrading the bridge implementation can give access to all funds escrowed therein."
+        "set and change address mappings."
      receivedPermissions.7.via.0.address:
-        "0xEEFD1782D70824CBcacf9438afab7f353F1797F0"
+        "0x543bA4AADBAb8f9025686Bd03993043599c6fB04"
      receivedPermissions.6.from:
-        "0xdE1FCfB0851916CA5101820A69b13a4E276bd81F"
+        "0x1cb5FB7Da1444e2d895420442D246787B7aFA95D"
      receivedPermissions.6.via.0.address:
-        "0x543bA4AADBAb8f9025686Bd03993043599c6fB04"
+        "0xEEFD1782D70824CBcacf9438afab7f353F1797F0"
      receivedPermissions.5.permission:
-        "interact"
+        "upgrade"
      receivedPermissions.5.from:
-        "0x1cb5FB7Da1444e2d895420442D246787B7aFA95D"
+        "0x924911E2CCAdB4638447ccD00b6cFb040Cc08560"
      receivedPermissions.5.description:
-        "set and change address mappings."
      receivedPermissions.4.from:
-        "0x924911E2CCAdB4638447ccD00b6cFb040Cc08560"
+        "0xAF1308930B721e763a6b21cf143E4e86e702f164"
      receivedPermissions.3.from:
-        "0xAF1308930B721e763a6b21cf143E4e86e702f164"
+        "0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
      receivedPermissions.3.via.0.address:
-        "0xEEFD1782D70824CBcacf9438afab7f353F1797F0"
+        "0x543bA4AADBAb8f9025686Bd03993043599c6fB04"
      receivedPermissions.2.from:
-        "0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
+        "0xa33f75a3A2babD502cbC1A6F54345B529C1F306E"
      receivedPermissions.2.via.0.address:
-        "0x543bA4AADBAb8f9025686Bd03993043599c6fB04"
+        "0xEEFD1782D70824CBcacf9438afab7f353F1797F0"
      receivedPermissions.1.from:
-        "0xa33f75a3A2babD502cbC1A6F54345B529C1F306E"
+        "0xB20f99b598E8d888d1887715439851BC68806b22"
      receivedPermissions.0.permission:
-        "upgrade"
+        "interact"
      receivedPermissions.0.from:
-        "0xB20f99b598E8d888d1887715439851BC68806b22"
+        "0xAF1308930B721e763a6b21cf143E4e86e702f164"
      receivedPermissions.0.via:
-        [{"address":"0xEEFD1782D70824CBcacf9438afab7f353F1797F0"}]
      receivedPermissions.0.description:
+        "can pull funds from the contract in case of emergency."
    }
```

```diff
    contract DelayedWETH (0xAF1308930B721e763a6b21cf143E4e86e702f164) {
    +++ description: Contract designed to hold the bonded ETH for each game. It is designed as a wrapper around WETH to allow an owner to function as a backstop if a game would incorrectly distribute funds.
      issuedPermissions.1:
+        {"permission":"upgrade","to":"0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A","via":[{"address":"0xEEFD1782D70824CBcacf9438afab7f353F1797F0"}]}
      issuedPermissions.0.permission:
-        "upgrade"
+        "interact"
      issuedPermissions.0.via.0:
-        {"address":"0xEEFD1782D70824CBcacf9438afab7f353F1797F0"}
      issuedPermissions.0.description:
+        "can pull funds from the contract in case of emergency."
    }
```

Generated with discovered.json: 0x33fc4f813b1c67525b1d0d43f6f65c725be9030b

# Diff at Thu, 27 Mar 2025 11:14:00 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@8cc2e36080df3a74dfd8475d41c64f46203f5218 block: 21829667
- current block number: 21829667

## Description

Config related: add guardian description details, hide some noisy values, hide AddressManager as spam cat, add proposer / challenger to permissioned opfp chains.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21829667 (main branch discovery), not current.

```diff
    contract AddressManager (0x1cb5FB7Da1444e2d895420442D246787B7aFA95D) {
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

Generated with discovered.json: 0x9766d18ea7f3c23992dbede30f5914e8248cdd9d

# Diff at Tue, 18 Mar 2025 08:12:26 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@4ef7a8dbcec1cd9fec77aae2b73d81347a4ffb13 block: 21829667
- current block number: 21829667

## Description

Config: change Multisig names.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21829667 (main branch discovery), not current.

```diff
    contract Optimism Guardian Multisig (0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2) {
    +++ description: None
      name:
-        "SuperchainGuardianMultisig"
+        "Optimism Guardian Multisig"
    }
```

```diff
    contract Gelato Multisig (0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb) {
    +++ description: None
      name:
-        "GelatoMultisig"
+        "Gelato Multisig"
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

Generated with discovered.json: 0xe552f337200953927d15e2205339e997be75e56e

# Diff at Tue, 04 Mar 2025 11:25:26 GMT:

- author: Michał Podsiadły (<michal.podsiadly@l2beat.com>)
- comparing to: main@be38e12d3ff947ca8de40f3a23a9ba1875a54f5a block: 21829667
- current block number: 21829667

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21829667 (main branch discovery), not current.

```diff
    contract SystemConfig (0x34A564BbD863C4bf73Eca711Cf38a77C4Ccbdd6A) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      values.opStackDA.isSomeTxsLengthEqualToCelestiaDAExample:
-        false
      values.opStackDA.isUsingCelestia:
+        false
    }
```

Generated with discovered.json: 0xa54e436466c8e524ee752a53c75f031f697843e5

# Diff at Tue, 04 Mar 2025 10:38:57 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@98d260b45fe0d2195ce5e629bd7b200c8706e8ba block: 21829667
- current block number: 21829667

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21829667 (main branch discovery), not current.

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
    contract L1CrossDomainMessenger (0x0BE364912219bC74760f1d1c25F4866b328eBfC6) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      sinceBlock:
+        21167590
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
    contract AddressManager (0x1cb5FB7Da1444e2d895420442D246787B7aFA95D) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      sinceBlock:
+        21167590
    }
```

```diff
    contract PermissionedDisputeGame (0x227882E5972EbAd990dcF04E2dbe2fC84094E146) {
    +++ description: Same as FaultDisputeGame, but only two permissioned addresses are designated as proposer and challenger.
      sinceBlock:
+        21167590
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
    contract SystemConfig (0x34A564BbD863C4bf73Eca711Cf38a77C4Ccbdd6A) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      sinceBlock:
+        21167590
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
    contract SuperchainProxyAdmin (0x543bA4AADBAb8f9025686Bd03993043599c6fB04) {
    +++ description: None
      sinceBlock:
+        17365800
    }
```

```diff
    contract L1StandardBridge (0x564Eb0CeFCcA86160649a8986C419693c82F3678) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      sinceBlock:
+        21167590
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
    contract DisputeGameFactory (0x658656A14AFdf9c507096aC406564497d13EC754) {
    +++ description: The dispute game factory allows the creation of dispute games, used to propose state roots and eventually challenge them.
      sinceBlock:
+        21167590
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
    contract AnchorStateRegistry (0x924911E2CCAdB4638447ccD00b6cFb040Cc08560) {
    +++ description: Contains the latest confirmed state root that can be used as a starting point in a dispute game.
      sinceBlock:
+        21167590
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
    contract OptimismMintableERC20Factory (0xa33f75a3A2babD502cbC1A6F54345B529C1F306E) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      sinceBlock:
+        21167590
    }
```

```diff
    contract DelayedWETH (0xAF1308930B721e763a6b21cf143E4e86e702f164) {
    +++ description: Contract designed to hold the bonded ETH for each game. It is designed as a wrapper around WETH to allow an owner to function as a backstop if a game would incorrectly distribute funds.
      sinceBlock:
+        21167590
    }
```

```diff
    contract OptimismPortal2 (0xB20f99b598E8d888d1887715439851BC68806b22) {
    +++ description: The OptimismPortal contract is the main entry point to deposit funds from L1 to L2. It also allows to prove and finalize withdrawals. It specifies which game type can be used for withdrawals, which currently is the PermissionedDisputeGame.
      sinceBlock:
+        21167590
    }
```

```diff
    contract L1ERC721Bridge (0xbc404ae11E4E9DA3Ea9276Aa6DCcA31097D4f4Ee) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      sinceBlock:
+        21167590
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
    contract ProxyAdmin (0xEEFD1782D70824CBcacf9438afab7f353F1797F0) {
    +++ description: None
      sinceBlock:
+        21167590
    }
```

Generated with discovered.json: 0x15e30b69e0866177bb7b50b785f998496c8f58b6

# Diff at Thu, 27 Feb 2025 12:01:43 GMT:

- author: Michał Podsiadły (<michal.podsiadly@l2beat.com>)
- comparing to: main@a4b50e45bb44f8ceeea29f9236088d26a843c885 block: 21829667
- current block number: 21829667

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21829667 (main branch discovery), not current.

```diff
    contract OptimismPortal2 (0xB20f99b598E8d888d1887715439851BC68806b22) {
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

Generated with discovered.json: 0x8f76e0ee1f888c5ca816ad26700ac88e9b768913

# Diff at Wed, 26 Feb 2025 10:32:30 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@18513668f913fbe57a197f43655b19111df0e627 block: 21829667
- current block number: 21829667

## Description

config related: added categories for all opstack, op stack and polygoncdk stack templates.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21829667 (main branch discovery), not current.

```diff
    contract L1CrossDomainMessenger (0x0BE364912219bC74760f1d1c25F4866b328eBfC6) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      category:
+        {"name":"Canonical Bridges","priority":2}
    }
```

```diff
    contract SystemConfig (0x34A564BbD863C4bf73Eca711Cf38a77C4Ccbdd6A) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract L1StandardBridge (0x564Eb0CeFCcA86160649a8986C419693c82F3678) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      category:
+        {"name":"Canonical Bridges","priority":2}
    }
```

```diff
    contract DisputeGameFactory (0x658656A14AFdf9c507096aC406564497d13EC754) {
    +++ description: The dispute game factory allows the creation of dispute games, used to propose state roots and eventually challenge them.
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
    contract OptimismPortal2 (0xB20f99b598E8d888d1887715439851BC68806b22) {
    +++ description: The OptimismPortal contract is the main entry point to deposit funds from L1 to L2. It also allows to prove and finalize withdrawals. It specifies which game type can be used for withdrawals, which currently is the PermissionedDisputeGame.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract L1ERC721Bridge (0xbc404ae11E4E9DA3Ea9276Aa6DCcA31097D4f4Ee) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      category:
+        {"name":"Canonical Bridges","priority":2}
    }
```

Generated with discovered.json: 0x1fc1b46a28447d2ef3d745959aec590828e6ea10

# Diff at Fri, 21 Feb 2025 08:59:13 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1cf9ec35847912163c4b663a633e258a434c0bca block: 21829667
- current block number: 21829667

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21829667 (main branch discovery), not current.

```diff
    contract L1CrossDomainMessenger (0x0BE364912219bC74760f1d1c25F4866b328eBfC6) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      categories:
-        ["Core"]
    }
```

```diff
    contract L1StandardBridge (0x564Eb0CeFCcA86160649a8986C419693c82F3678) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      categories:
-        ["Gateways&Escrows"]
    }
```

```diff
    contract SuperchainConfig (0x95703e0982140D16f8ebA6d158FccEde42f04a4C) {
    +++ description: Used to manage global configuration values for multiple OP Chains within a single Superchain network. The SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the Superchain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      categories:
-        ["Upgrades&Governance"]
    }
```

Generated with discovered.json: 0x46b9a9dffd3ff8c80b31f272aa46e26bed7720a0

# Diff at Wed, 12 Feb 2025 09:59:14 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@554a6f0e6aa688c758b37653d0be7eb446f9152e block: 21802830
- current block number: 21829667

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

Generated with discovered.json: 0xf2ec35f7ae251fd47e4a29c66e4877a0ad6ae0f9

# Diff at Mon, 10 Feb 2025 19:03:40 GMT:

- author: Michał Podsiadły (<michal.podsiadly@l2beat.com>)
- comparing to: main@3756adff7c1ac86d8af3374a90a75c1999aae2b3 block: 21802830
- current block number: 21802830

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21802830 (main branch discovery), not current.

```diff
    contract SystemConfig (0x34A564BbD863C4bf73Eca711Cf38a77C4Ccbdd6A) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      values.opStackDA.isUsingEigenDA:
+        false
    }
```

Generated with discovered.json: 0x1caddacaea60091808f088f39b79c67c06b3ce07

# Diff at Sat, 08 Feb 2025 15:56:50 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@ef01ea79812e0d524af00be3fae1170cef6fd662 block: 21786502
- current block number: 21802830

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

Generated with discovered.json: 0x20584e45890427a5c97af3c07ce6af06ef3ae506

# Diff at Thu, 06 Feb 2025 09:15:56 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@fa699ce266b15edb364aa471a661f580ea1a4529 block: 21715233
- current block number: 21786502

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

Generated with discovered.json: 0xb0fbaedf0dcd5de2d9bd9b6de5c2ae81e2d646f4

# Diff at Tue, 04 Feb 2025 12:30:48 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@145553eed7ba44636411ecb25e4099728acd02f9 block: 21715233
- current block number: 21715233

## Description

Rename 'configure' permission to 'interact'

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21715233 (main branch discovery), not current.

```diff
    contract LivenessModule (0x0454092516c9A4d636d3CAfA1e82161376C8a748) {
    +++ description: used to remove members inactive for 98d while making sure that the threshold remains above 75%. If the number of members falls below 8, the 0x847B5c174615B1B7fDF770882256e2D3E95b9D92 takes ownership of the multisig
      issuedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract AddressManager (0x1cb5FB7Da1444e2d895420442D246787B7aFA95D) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
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
    contract SystemConfig (0x34A564BbD863C4bf73Eca711Cf38a77C4Ccbdd6A) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      issuedPermissions.0.permission:
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
    contract GelatoMultisig (0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb) {
    +++ description: None
      receivedPermissions.0.permission:
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

```diff
    contract ProxyAdmin (0xEEFD1782D70824CBcacf9438afab7f353F1797F0) {
    +++ description: None
      directlyReceivedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

Generated with discovered.json: 0x0c56c3c6cbc64ee07e03c08e92441c991576b606

# Diff at Mon, 27 Jan 2025 10:56:30 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@43cb526d71ed01f024dced9d5aea2a30cf306714 block: 21694413
- current block number: 21715233

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
    contract SystemConfig (0x34A564BbD863C4bf73Eca711Cf38a77C4Ccbdd6A) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      sourceHashes.1:
-        "0xbbb92920a096eced30e3ce67bbc443f134b217e8847433fbb192ecb9fdddcbc2"
+        "0xc7135dbd2a53312d36df3f3ee91ce0a5a459ab8fc7725880a3a9c55a5fa0ed6c"
      values.$implementation:
-        "0xF56D96B2535B932656d3c04Ebf51baBff241D886"
+        "0xAB9d6cB7A427c0765163A7f45BB91cAfe5f2D375"
      values.$pastUpgrades.3:
+        ["2025-01-24T14:41:35.000Z","0x86da7386a26978c3db89e97c1f4feee613a8a0c07bbe4640624b05276f49c350",["0xAB9d6cB7A427c0765163A7f45BB91cAfe5f2D375"]]
      values.$pastUpgrades.2:
+        ["2025-01-24T14:41:35.000Z","0x86da7386a26978c3db89e97c1f4feee613a8a0c07bbe4640624b05276f49c350",["0xd81f43eDBCAcb4c29a9bA38a13Ee5d79278270cC"]]
      values.$upgradeCount:
-        2
+        4
      values.version:
-        "2.2.0"
+        "2.3.0"
      values.basefeeScalar:
+        801949
      values.blobbasefeeScalar:
+        0
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

Generated with discovered.json: 0xdb527793795e306d2223a48af72fded169a8506b

# Diff at Fri, 24 Jan 2025 12:39:09 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- current block number: 21694413

## Description

Initial discovery: OP stack RU with OptiPortal 2 and PermissionedGames as default. Optimism governance, SC properly set up.

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
    contract L1CrossDomainMessenger (0x0BE364912219bC74760f1d1c25F4866b328eBfC6)
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
```

```diff
+   Status: CREATED
    contract MIPS (0x16e83cE5Ce29BF90AD9Da06D2fE6a15d5f344ce4)
    +++ description: The MIPS contract is used to execute the final step of the dispute game which objectively determines the winner of the dispute.
```

```diff
+   Status: CREATED
    contract AddressManager (0x1cb5FB7Da1444e2d895420442D246787B7aFA95D)
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
```

```diff
+   Status: CREATED
    contract PermissionedDisputeGame (0x227882E5972EbAd990dcF04E2dbe2fC84094E146)
    +++ description: Same as FaultDisputeGame, but only two permissioned addresses are designated as proposer and challenger.
```

```diff
+   Status: CREATED
    contract LivenessGuard (0x24424336F04440b1c28685a38303aC33C9D14a25)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SystemConfig (0x34A564BbD863C4bf73Eca711Cf38a77C4Ccbdd6A)
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
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
    contract L1StandardBridge (0x564Eb0CeFCcA86160649a8986C419693c82F3678)
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
```

```diff
+   Status: CREATED
    contract SuperchainProxyAdminOwner (0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A)
    +++ description: None
```

```diff
+   Status: CREATED
    contract DisputeGameFactory (0x658656A14AFdf9c507096aC406564497d13EC754)
    +++ description: The dispute game factory allows the creation of dispute games, used to propose state roots and eventually challenge them.
```

```diff
+   Status: CREATED
    contract OpFoundationUpgradeSafe (0x847B5c174615B1B7fDF770882256e2D3E95b9D92)
    +++ description: None
```

```diff
+   Status: CREATED
    contract AnchorStateRegistry (0x924911E2CCAdB4638447ccD00b6cFb040Cc08560)
    +++ description: Contains the latest confirmed state root that can be used as a starting point in a dispute game.
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
    contract OptimismMintableERC20Factory (0xa33f75a3A2babD502cbC1A6F54345B529C1F306E)
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
```

```diff
+   Status: CREATED
    contract DelayedWETH (0xAF1308930B721e763a6b21cf143E4e86e702f164)
    +++ description: Contract designed to hold the bonded ETH for each game. It is designed as a wrapper around WETH to allow an owner to function as a backstop if a game would incorrectly distribute funds.
```

```diff
+   Status: CREATED
    contract OptimismPortal2 (0xB20f99b598E8d888d1887715439851BC68806b22)
    +++ description: The OptimismPortal contract is the main entry point to deposit funds from L1 to L2. It also allows to prove and finalize withdrawals. It specifies which game type can be used for withdrawals, which currently is the PermissionedDisputeGame.
```

```diff
+   Status: CREATED
    contract L1ERC721Bridge (0xbc404ae11E4E9DA3Ea9276Aa6DCcA31097D4f4Ee)
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
```

```diff
+   Status: CREATED
    contract GelatoMultisig (0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SecurityCouncilMultisig (0xc2819DC788505Aac350142A7A707BF9D03E3Bd03)
    +++ description: None
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
    contract ProxyAdmin (0xEEFD1782D70824CBcacf9438afab7f353F1797F0)
    +++ description: None
```
