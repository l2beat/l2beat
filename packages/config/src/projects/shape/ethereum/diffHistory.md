Generated with discovered.json: 0x5ed441550c1bcdc1e308b29951e99ae62bf6f8ac

# Diff at Mon, 28 Jul 2025 05:57:46 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@8e540d8d4e2ea097e63a067c52194d1bf06f9b4a block: 22988760
- current block number: 23015702

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

Generated with discovered.json: 0x40094c526e381ac903591b9a5064829e65eddf1c

# Diff at Fri, 25 Jul 2025 13:52:41 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@85b717d6efe0c0a7691beb49532a0ce49bb7634a block: 22988760
- current block number: 22988760

## Description

templatize op upgrade 16 contracts

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22988760 (main branch discovery), not current.

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

Generated with discovered.json: 0x989c29495e4502dd7c9db022ab891bfac75bbfa0

# Diff at Thu, 24 Jul 2025 16:48:27 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@a3f740c0fd51a5745c45d8f349ab01f4f33f7770 block: 22988760
- current block number: 22988760

## Description

set dispute game impl changes to high severity.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22988760 (main branch discovery), not current.

```diff
    contract DisputeGameFactory (0x2c03e8BF8b16Af89079852BE87f0e9eC674a5952) {
    +++ description: The dispute game factory allows the creation of dispute games, used to propose state roots and eventually challenge them.
      fieldMeta:
+        {"gameImpls":{"severity":"HIGH"},"game1337":{"severity":"HIGH"}}
    }
```

```diff
    contract OptimismPortal2 (0xEB06fFa16011B5628BaB98E29776361c83741dd3) {
    +++ description: The OptimismPortal contract is the main entry point to deposit funds from L1 to L2. It also allows to prove and finalize withdrawals. It specifies which game type can be used for withdrawals, which currently is the PermissionedDisputeGame.
      fieldMeta.respectedGameType:
+        {"severity":"HIGH"}
    }
```

Generated with discovered.json: 0xe8993b25162336bcd8a226689b0a2d7bf29844dd

# Diff at Thu, 24 Jul 2025 11:37:40 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@daf9b4c0c3e0cc879ae7e4d12a2a3cc6a78da2a5 block: 22731117
- current block number: 22988760

## Description

1559 gas config added.

## Watched changes

```diff
    contract SystemConfig (0xfF11e41D5C4F522E423Ff6C064Ff8D55AF8f7355) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
+++ description: volatility param: lower denominator -> quicker fee changes on L2
      values.eip1559Denominator:
-        0
+        250
      values.eip1559Elasticity:
-        0
+        2
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22731117 (main branch discovery), not current.

```diff
    contract DisputeGameFactory (0x2c03e8BF8b16Af89079852BE87f0e9eC674a5952) {
    +++ description: The dispute game factory allows the creation of dispute games, used to propose state roots and eventually challenge them.
      values.game1337:
+        "eth:0x0000000000000000000000000000000000000000"
    }
```

```diff
    contract OptimismPortal2 (0xEB06fFa16011B5628BaB98E29776361c83741dd3) {
    +++ description: The OptimismPortal contract is the main entry point to deposit funds from L1 to L2. It also allows to prove and finalize withdrawals. It specifies which game type can be used for withdrawals, which currently is the PermissionedDisputeGame.
      usedTypes.0.arg.1337:
+        "KailuaGame"
    }
```

Generated with discovered.json: 0x7f1e7e883fd20f30b2f62f6556fe741f32d4330d

# Diff at Mon, 14 Jul 2025 12:46:06 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@9f4300dad2f3d080cd56fa311d4a848556c74e72 block: 22731117
- current block number: 22731117

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22731117 (main branch discovery), not current.

```diff
    EOA  (0x000000000000000000000000000000000000dEaD) {
    +++ description: None
      address:
-        "0x000000000000000000000000000000000000dEaD"
+        "eth:0x000000000000000000000000000000000000dEaD"
    }
```

```diff
    EOA  (0x001271c57AeC639952B5201D052767c316755512) {
    +++ description: None
      address:
-        "0x001271c57AeC639952B5201D052767c316755512"
+        "eth:0x001271c57AeC639952B5201D052767c316755512"
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
    EOA  (0x0D8a607F3d2de86adD04Df00f06794cB339A40de) {
    +++ description: None
      address:
-        "0x0D8a607F3d2de86adD04Df00f06794cB339A40de"
+        "eth:0x0D8a607F3d2de86adD04Df00f06794cB339A40de"
    }
```

```diff
    contract ProxyAdmin (0x11B190Ae661c6d6884dFEE48E215691E0DdB842e) {
    +++ description: None
      address:
-        "0x11B190Ae661c6d6884dFEE48E215691E0DdB842e"
+        "eth:0x11B190Ae661c6d6884dFEE48E215691E0DdB842e"
      values.addressManager:
-        "0xcee78437aE9e15cee9c78E63757E0153c0FD7479"
+        "eth:0xcee78437aE9e15cee9c78E63757E0153c0FD7479"
      values.owner:
-        "0xA4fB12D15Eb85dc9284a7df0AdBC8B696EdbbF1d"
+        "eth:0xA4fB12D15Eb85dc9284a7df0AdBC8B696EdbbF1d"
      implementationNames.0x11B190Ae661c6d6884dFEE48E215691E0DdB842e:
-        "ProxyAdmin"
      implementationNames.eth:0x11B190Ae661c6d6884dFEE48E215691E0DdB842e:
+        "ProxyAdmin"
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
    contract L1CrossDomainMessenger (0x2b18602877181C3cB72C687E2A771E123A3788E3) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      address:
-        "0x2b18602877181C3cB72C687E2A771E123A3788E3"
+        "eth:0x2b18602877181C3cB72C687E2A771E123A3788E3"
      values.$admin:
-        "0x11B190Ae661c6d6884dFEE48E215691E0DdB842e"
+        "eth:0x11B190Ae661c6d6884dFEE48E215691E0DdB842e"
      values.$implementation:
-        "0xD3494713A5cfaD3F5359379DfA074E2Ac8C6Fd65"
+        "eth:0xD3494713A5cfaD3F5359379DfA074E2Ac8C6Fd65"
      values.$pastUpgrades.0.2.0:
-        "0xAEfEA5D2Dd3B9A05a67FBD5E7C06c19151A7fe50"
+        "eth:0xAEfEA5D2Dd3B9A05a67FBD5E7C06c19151A7fe50"
      values.$pastUpgrades.1.2.0:
-        "0xd81f43eDBCAcb4c29a9bA38a13Ee5d79278270cC"
+        "eth:0xd81f43eDBCAcb4c29a9bA38a13Ee5d79278270cC"
      values.$pastUpgrades.2.2.0:
-        "0xD3494713A5cfaD3F5359379DfA074E2Ac8C6Fd65"
+        "eth:0xD3494713A5cfaD3F5359379DfA074E2Ac8C6Fd65"
      values.OTHER_MESSENGER:
-        "0x4200000000000000000000000000000000000007"
+        "eth:0x4200000000000000000000000000000000000007"
      values.otherMessenger:
-        "0x4200000000000000000000000000000000000007"
+        "eth:0x4200000000000000000000000000000000000007"
      values.portal:
-        "0xEB06fFa16011B5628BaB98E29776361c83741dd3"
+        "eth:0xEB06fFa16011B5628BaB98E29776361c83741dd3"
      values.PORTAL:
-        "0xEB06fFa16011B5628BaB98E29776361c83741dd3"
+        "eth:0xEB06fFa16011B5628BaB98E29776361c83741dd3"
      values.ResolvedDelegateProxy_addressManager:
-        "0xcee78437aE9e15cee9c78E63757E0153c0FD7479"
+        "eth:0xcee78437aE9e15cee9c78E63757E0153c0FD7479"
      values.superchainConfig:
-        "0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
+        "eth:0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
      implementationNames.0x2b18602877181C3cB72C687E2A771E123A3788E3:
-        "ResolvedDelegateProxy"
      implementationNames.0xD3494713A5cfaD3F5359379DfA074E2Ac8C6Fd65:
-        "L1CrossDomainMessenger"
      implementationNames.eth:0x2b18602877181C3cB72C687E2A771E123A3788E3:
+        "ResolvedDelegateProxy"
      implementationNames.eth:0xD3494713A5cfaD3F5359379DfA074E2Ac8C6Fd65:
+        "L1CrossDomainMessenger"
    }
```

```diff
    contract DisputeGameFactory (0x2c03e8BF8b16Af89079852BE87f0e9eC674a5952) {
    +++ description: The dispute game factory allows the creation of dispute games, used to propose state roots and eventually challenge them.
      address:
-        "0x2c03e8BF8b16Af89079852BE87f0e9eC674a5952"
+        "eth:0x2c03e8BF8b16Af89079852BE87f0e9eC674a5952"
      values.$admin:
-        "0x11B190Ae661c6d6884dFEE48E215691E0DdB842e"
+        "eth:0x11B190Ae661c6d6884dFEE48E215691E0DdB842e"
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
-        "0x8090Ac33F4C9A1A220492487390dbe0c3b56a37A"
+        "eth:0x8090Ac33F4C9A1A220492487390dbe0c3b56a37A"
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
-        "0xA4fB12D15Eb85dc9284a7df0AdBC8B696EdbbF1d"
+        "eth:0xA4fB12D15Eb85dc9284a7df0AdBC8B696EdbbF1d"
      implementationNames.0x2c03e8BF8b16Af89079852BE87f0e9eC674a5952:
-        "Proxy"
      implementationNames.0xc641A33cab81C559F2bd4b21EA34C290E2440C2B:
-        "DisputeGameFactory"
      implementationNames.eth:0x2c03e8BF8b16Af89079852BE87f0e9eC674a5952:
+        "Proxy"
      implementationNames.eth:0xc641A33cab81C559F2bd4b21EA34C290E2440C2B:
+        "DisputeGameFactory"
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
    contract OptimismMintableERC20Factory (0x319322906beAdf69dF5d4607169c63D692B1aDC1) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintableERC20 as this chain's representation of a token on the host chain, or vice-versa.
      address:
-        "0x319322906beAdf69dF5d4607169c63D692B1aDC1"
+        "eth:0x319322906beAdf69dF5d4607169c63D692B1aDC1"
      values.$admin:
-        "0x11B190Ae661c6d6884dFEE48E215691E0DdB842e"
+        "eth:0x11B190Ae661c6d6884dFEE48E215691E0DdB842e"
      values.$implementation:
-        "0xE01efbeb1089D1d1dB9c6c8b135C934C0734c846"
+        "eth:0xE01efbeb1089D1d1dB9c6c8b135C934C0734c846"
      values.$pastUpgrades.0.2.0:
-        "0x70201b22244D19fc52c2D09DC3e06c6cD2819067"
+        "eth:0x70201b22244D19fc52c2D09DC3e06c6cD2819067"
      values.$pastUpgrades.1.2.0:
-        "0xE01efbeb1089D1d1dB9c6c8b135C934C0734c846"
+        "eth:0xE01efbeb1089D1d1dB9c6c8b135C934C0734c846"
      values.bridge:
-        "0x62Edd5f4930Ea92dCa3fB81689bDD9b9d076b57B"
+        "eth:0x62Edd5f4930Ea92dCa3fB81689bDD9b9d076b57B"
      values.BRIDGE:
-        "0x62Edd5f4930Ea92dCa3fB81689bDD9b9d076b57B"
+        "eth:0x62Edd5f4930Ea92dCa3fB81689bDD9b9d076b57B"
      implementationNames.0x319322906beAdf69dF5d4607169c63D692B1aDC1:
-        "Proxy"
      implementationNames.0xE01efbeb1089D1d1dB9c6c8b135C934C0734c846:
-        "OptimismMintableERC20Factory"
      implementationNames.eth:0x319322906beAdf69dF5d4607169c63D692B1aDC1:
+        "Proxy"
      implementationNames.eth:0xE01efbeb1089D1d1dB9c6c8b135C934C0734c846:
+        "OptimismMintableERC20Factory"
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
    EOA  (0x35A2079110aa30d1De381cf75aCd1836b6dEE1d7) {
    +++ description: None
      address:
-        "0x35A2079110aa30d1De381cf75aCd1836b6dEE1d7"
+        "eth:0x35A2079110aa30d1De381cf75aCd1836b6dEE1d7"
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
    contract L1StandardBridge (0x62Edd5f4930Ea92dCa3fB81689bDD9b9d076b57B) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      address:
-        "0x62Edd5f4930Ea92dCa3fB81689bDD9b9d076b57B"
+        "eth:0x62Edd5f4930Ea92dCa3fB81689bDD9b9d076b57B"
      values.$admin:
-        "0x11B190Ae661c6d6884dFEE48E215691E0DdB842e"
+        "eth:0x11B190Ae661c6d6884dFEE48E215691E0DdB842e"
      values.$implementation:
-        "0x64B5a5Ed26DCb17370Ff4d33a8D503f0fbD06CfF"
+        "eth:0x64B5a5Ed26DCb17370Ff4d33a8D503f0fbD06CfF"
      values.l2TokenBridge:
-        "0x4200000000000000000000000000000000000010"
+        "eth:0x4200000000000000000000000000000000000010"
      values.messenger:
-        "0x2b18602877181C3cB72C687E2A771E123A3788E3"
+        "eth:0x2b18602877181C3cB72C687E2A771E123A3788E3"
      values.MESSENGER:
-        "0x2b18602877181C3cB72C687E2A771E123A3788E3"
+        "eth:0x2b18602877181C3cB72C687E2A771E123A3788E3"
      values.OTHER_BRIDGE:
-        "0x4200000000000000000000000000000000000010"
+        "eth:0x4200000000000000000000000000000000000010"
      values.otherBridge:
-        "0x4200000000000000000000000000000000000010"
+        "eth:0x4200000000000000000000000000000000000010"
      values.superchainConfig:
-        "0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
+        "eth:0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
      implementationNames.0x62Edd5f4930Ea92dCa3fB81689bDD9b9d076b57B:
-        "L1ChugSplashProxy"
      implementationNames.0x64B5a5Ed26DCb17370Ff4d33a8D503f0fbD06CfF:
-        "L1StandardBridge"
      implementationNames.eth:0x62Edd5f4930Ea92dCa3fB81689bDD9b9d076b57B:
+        "L1ChugSplashProxy"
      implementationNames.eth:0x64B5a5Ed26DCb17370Ff4d33a8D503f0fbD06CfF:
+        "L1StandardBridge"
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
    contract AnchorStateRegistry (0x6ace93AF6E8b36803577381be9f02A552e81C10D) {
    +++ description: Contains the latest confirmed state root that can be used as a starting point in a dispute game.
      address:
-        "0x6ace93AF6E8b36803577381be9f02A552e81C10D"
+        "eth:0x6ace93AF6E8b36803577381be9f02A552e81C10D"
      values.$admin:
-        "0x11B190Ae661c6d6884dFEE48E215691E0DdB842e"
+        "eth:0x11B190Ae661c6d6884dFEE48E215691E0DdB842e"
      values.$implementation:
-        "0x581cB5157dcAaA7B5Ea88D28e384dA3A8D46267e"
+        "eth:0x581cB5157dcAaA7B5Ea88D28e384dA3A8D46267e"
      values.$pastUpgrades.0.2.0:
-        "0x581cB5157dcAaA7B5Ea88D28e384dA3A8D46267e"
+        "eth:0x581cB5157dcAaA7B5Ea88D28e384dA3A8D46267e"
      values.disputeGameFactory:
-        "0x2c03e8BF8b16Af89079852BE87f0e9eC674a5952"
+        "eth:0x2c03e8BF8b16Af89079852BE87f0e9eC674a5952"
      values.superchainConfig:
-        "0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
+        "eth:0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
      implementationNames.0x6ace93AF6E8b36803577381be9f02A552e81C10D:
-        "Proxy"
      implementationNames.0x581cB5157dcAaA7B5Ea88D28e384dA3A8D46267e:
-        "AnchorStateRegistry"
      implementationNames.eth:0x6ace93AF6E8b36803577381be9f02A552e81C10D:
+        "Proxy"
      implementationNames.eth:0x581cB5157dcAaA7B5Ea88D28e384dA3A8D46267e:
+        "AnchorStateRegistry"
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
    contract PermissionedDisputeGame (0x8090Ac33F4C9A1A220492487390dbe0c3b56a37A) {
    +++ description: Same as FaultDisputeGame, but only two permissioned addresses are designated as proposer and challenger.
      address:
-        "0x8090Ac33F4C9A1A220492487390dbe0c3b56a37A"
+        "eth:0x8090Ac33F4C9A1A220492487390dbe0c3b56a37A"
      values.anchorStateRegistry:
-        "0x6ace93AF6E8b36803577381be9f02A552e81C10D"
+        "eth:0x6ace93AF6E8b36803577381be9f02A552e81C10D"
      values.challenger:
-        "0xA4fB12D15Eb85dc9284a7df0AdBC8B696EdbbF1d"
+        "eth:0xA4fB12D15Eb85dc9284a7df0AdBC8B696EdbbF1d"
      values.gameCreator:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.l2BlockNumberChallenger:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.proposer:
-        "0x0D8a607F3d2de86adD04Df00f06794cB339A40de"
+        "eth:0x0D8a607F3d2de86adD04Df00f06794cB339A40de"
      values.vm:
-        "0x5fE03a12C1236F9C22Cb6479778DDAa4bce6299C"
+        "eth:0x5fE03a12C1236F9C22Cb6479778DDAa4bce6299C"
      values.weth:
-        "0x846d9469BAaF481f8516f7c1d03990672B68CB09"
+        "eth:0x846d9469BAaF481f8516f7c1d03990672B68CB09"
      implementationNames.0x8090Ac33F4C9A1A220492487390dbe0c3b56a37A:
-        "PermissionedDisputeGame"
      implementationNames.eth:0x8090Ac33F4C9A1A220492487390dbe0c3b56a37A:
+        "PermissionedDisputeGame"
    }
```

```diff
    contract DelayedWETH (0x846d9469BAaF481f8516f7c1d03990672B68CB09) {
    +++ description: Contract designed to hold the bonded ETH for each game. It is designed as a wrapper around WETH to allow an owner to function as a backstop if a game would incorrectly distribute funds.
      address:
-        "0x846d9469BAaF481f8516f7c1d03990672B68CB09"
+        "eth:0x846d9469BAaF481f8516f7c1d03990672B68CB09"
      values.$admin:
-        "0x11B190Ae661c6d6884dFEE48E215691E0DdB842e"
+        "eth:0x11B190Ae661c6d6884dFEE48E215691E0DdB842e"
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
-        "0xee1Af3f99AF8C5b93512FbE2A3f0dD5568CE087f"
+        "eth:0xee1Af3f99AF8C5b93512FbE2A3f0dD5568CE087f"
      implementationNames.0x846d9469BAaF481f8516f7c1d03990672B68CB09:
-        "Proxy"
      implementationNames.0x71e966Ae981d1ce531a7b6d23DC0f27B38409087:
-        "DelayedWETH"
      implementationNames.eth:0x846d9469BAaF481f8516f7c1d03990672B68CB09:
+        "Proxy"
      implementationNames.eth:0x71e966Ae981d1ce531a7b6d23DC0f27B38409087:
+        "DelayedWETH"
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
    EOA  (0x9C66333c504F3A4f5593D0e9739434744cCC5B5d) {
    +++ description: None
      address:
-        "0x9C66333c504F3A4f5593D0e9739434744cCC5B5d"
+        "eth:0x9C66333c504F3A4f5593D0e9739434744cCC5B5d"
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
    EOA  (0xA351A874b48dCEdf1883dD4F4049bE3d9923700a) {
    +++ description: None
      address:
-        "0xA351A874b48dCEdf1883dD4F4049bE3d9923700a"
+        "eth:0xA351A874b48dCEdf1883dD4F4049bE3d9923700a"
    }
```

```diff
    contract Alchemy Multisig 1 (0xA4fB12D15Eb85dc9284a7df0AdBC8B696EdbbF1d) {
    +++ description: None
      address:
-        "0xA4fB12D15Eb85dc9284a7df0AdBC8B696EdbbF1d"
+        "eth:0xA4fB12D15Eb85dc9284a7df0AdBC8B696EdbbF1d"
      values.$implementation:
-        "0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
+        "eth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
      values.$members.0:
-        "0xCA730AFfb87935E70E5889418C731eb196237476"
+        "eth:0xCA730AFfb87935E70E5889418C731eb196237476"
      values.$members.1:
-        "0xFB00073F931A817b244bF211aA2E5DCBfff8B1ca"
+        "eth:0xFB00073F931A817b244bF211aA2E5DCBfff8B1ca"
      values.$members.2:
-        "0x35A2079110aa30d1De381cf75aCd1836b6dEE1d7"
+        "eth:0x35A2079110aa30d1De381cf75aCd1836b6dEE1d7"
      values.$members.3:
-        "0x001271c57AeC639952B5201D052767c316755512"
+        "eth:0x001271c57AeC639952B5201D052767c316755512"
      values.$members.4:
-        "0xA351A874b48dCEdf1883dD4F4049bE3d9923700a"
+        "eth:0xA351A874b48dCEdf1883dD4F4049bE3d9923700a"
      values.$members.5:
-        "0xd1447Dd15D9e24ddFF99f0fE3C88Bf64d23D1670"
+        "eth:0xd1447Dd15D9e24ddFF99f0fE3C88Bf64d23D1670"
      values.$members.6:
-        "0xeD9919D57162D518014C391a687AA8fb9DB55654"
+        "eth:0xeD9919D57162D518014C391a687AA8fb9DB55654"
      values.$members.7:
-        "0xB2aa0C2C4fD6BFCBF699d4c787CD6Cc0dC461a9d"
+        "eth:0xB2aa0C2C4fD6BFCBF699d4c787CD6Cc0dC461a9d"
      implementationNames.0xA4fB12D15Eb85dc9284a7df0AdBC8B696EdbbF1d:
-        "GnosisSafeProxy"
      implementationNames.0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
-        "GnosisSafe"
      implementationNames.eth:0xA4fB12D15Eb85dc9284a7df0AdBC8B696EdbbF1d:
+        "GnosisSafeProxy"
      implementationNames.eth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
+        "GnosisSafe"
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
    EOA  (0xB2aa0C2C4fD6BFCBF699d4c787CD6Cc0dC461a9d) {
    +++ description: None
      address:
-        "0xB2aa0C2C4fD6BFCBF699d4c787CD6Cc0dC461a9d"
+        "eth:0xB2aa0C2C4fD6BFCBF699d4c787CD6Cc0dC461a9d"
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
    EOA  (0xCA730AFfb87935E70E5889418C731eb196237476) {
    +++ description: None
      address:
-        "0xCA730AFfb87935E70E5889418C731eb196237476"
+        "eth:0xCA730AFfb87935E70E5889418C731eb196237476"
    }
```

```diff
    contract AddressManager (0xcee78437aE9e15cee9c78E63757E0153c0FD7479) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      address:
-        "0xcee78437aE9e15cee9c78E63757E0153c0FD7479"
+        "eth:0xcee78437aE9e15cee9c78E63757E0153c0FD7479"
      values.owner:
-        "0x11B190Ae661c6d6884dFEE48E215691E0DdB842e"
+        "eth:0x11B190Ae661c6d6884dFEE48E215691E0DdB842e"
      implementationNames.0xcee78437aE9e15cee9c78E63757E0153c0FD7479:
-        "AddressManager"
      implementationNames.eth:0xcee78437aE9e15cee9c78E63757E0153c0FD7479:
+        "AddressManager"
    }
```

```diff
    EOA  (0xd1447Dd15D9e24ddFF99f0fE3C88Bf64d23D1670) {
    +++ description: None
      address:
-        "0xd1447Dd15D9e24ddFF99f0fE3C88Bf64d23D1670"
+        "eth:0xd1447Dd15D9e24ddFF99f0fE3C88Bf64d23D1670"
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
    contract L1ERC721Bridge (0xe9d3E49b0636016c5fE9eaA2347948D0bA9f15Af) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      address:
-        "0xe9d3E49b0636016c5fE9eaA2347948D0bA9f15Af"
+        "eth:0xe9d3E49b0636016c5fE9eaA2347948D0bA9f15Af"
      values.$admin:
-        "0x11B190Ae661c6d6884dFEE48E215691E0DdB842e"
+        "eth:0x11B190Ae661c6d6884dFEE48E215691E0DdB842e"
      values.$implementation:
-        "0xAE2AF01232a6c4a4d3012C5eC5b1b35059caF10d"
+        "eth:0xAE2AF01232a6c4a4d3012C5eC5b1b35059caF10d"
      values.$pastUpgrades.0.2.0:
-        "0x5cBe8a4463370e38AcE1406875872eF38342a1c6"
+        "eth:0x5cBe8a4463370e38AcE1406875872eF38342a1c6"
      values.$pastUpgrades.1.2.0:
-        "0xd81f43eDBCAcb4c29a9bA38a13Ee5d79278270cC"
+        "eth:0xd81f43eDBCAcb4c29a9bA38a13Ee5d79278270cC"
      values.$pastUpgrades.2.2.0:
-        "0xAE2AF01232a6c4a4d3012C5eC5b1b35059caF10d"
+        "eth:0xAE2AF01232a6c4a4d3012C5eC5b1b35059caF10d"
      values.messenger:
-        "0x2b18602877181C3cB72C687E2A771E123A3788E3"
+        "eth:0x2b18602877181C3cB72C687E2A771E123A3788E3"
      values.MESSENGER:
-        "0x2b18602877181C3cB72C687E2A771E123A3788E3"
+        "eth:0x2b18602877181C3cB72C687E2A771E123A3788E3"
      values.OTHER_BRIDGE:
-        "0x4200000000000000000000000000000000000014"
+        "eth:0x4200000000000000000000000000000000000014"
      values.otherBridge:
-        "0x4200000000000000000000000000000000000014"
+        "eth:0x4200000000000000000000000000000000000014"
      values.superchainConfig:
-        "0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
+        "eth:0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
      implementationNames.0xe9d3E49b0636016c5fE9eaA2347948D0bA9f15Af:
-        "Proxy"
      implementationNames.0xAE2AF01232a6c4a4d3012C5eC5b1b35059caF10d:
-        "L1ERC721Bridge"
      implementationNames.eth:0xe9d3E49b0636016c5fE9eaA2347948D0bA9f15Af:
+        "Proxy"
      implementationNames.eth:0xAE2AF01232a6c4a4d3012C5eC5b1b35059caF10d:
+        "L1ERC721Bridge"
    }
```

```diff
    contract OptimismPortal2 (0xEB06fFa16011B5628BaB98E29776361c83741dd3) {
    +++ description: The OptimismPortal contract is the main entry point to deposit funds from L1 to L2. It also allows to prove and finalize withdrawals. It specifies which game type can be used for withdrawals, which currently is the PermissionedDisputeGame.
      address:
-        "0xEB06fFa16011B5628BaB98E29776361c83741dd3"
+        "eth:0xEB06fFa16011B5628BaB98E29776361c83741dd3"
      values.$admin:
-        "0x11B190Ae661c6d6884dFEE48E215691E0DdB842e"
+        "eth:0x11B190Ae661c6d6884dFEE48E215691E0DdB842e"
      values.$implementation:
-        "0xe2F826324b2faf99E513D16D266c3F80aE87832B"
+        "eth:0xe2F826324b2faf99E513D16D266c3F80aE87832B"
      values.$pastUpgrades.0.2.0:
-        "0x3Db18Ba41E7F377fa2603D2B500f40CF82683b78"
+        "eth:0x3Db18Ba41E7F377fa2603D2B500f40CF82683b78"
      values.$pastUpgrades.1.2.0:
-        "0xd81f43eDBCAcb4c29a9bA38a13Ee5d79278270cC"
+        "eth:0xd81f43eDBCAcb4c29a9bA38a13Ee5d79278270cC"
      values.$pastUpgrades.2.2.0:
-        "0xe2F826324b2faf99E513D16D266c3F80aE87832B"
+        "eth:0xe2F826324b2faf99E513D16D266c3F80aE87832B"
      values.disputeGameFactory:
-        "0x2c03e8BF8b16Af89079852BE87f0e9eC674a5952"
+        "eth:0x2c03e8BF8b16Af89079852BE87f0e9eC674a5952"
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
-        "0xfF11e41D5C4F522E423Ff6C064Ff8D55AF8f7355"
+        "eth:0xfF11e41D5C4F522E423Ff6C064Ff8D55AF8f7355"
      implementationNames.0xEB06fFa16011B5628BaB98E29776361c83741dd3:
-        "Proxy"
      implementationNames.0xe2F826324b2faf99E513D16D266c3F80aE87832B:
-        "OptimismPortal2"
      implementationNames.eth:0xEB06fFa16011B5628BaB98E29776361c83741dd3:
+        "Proxy"
      implementationNames.eth:0xe2F826324b2faf99E513D16D266c3F80aE87832B:
+        "OptimismPortal2"
    }
```

```diff
    EOA  (0xeD9919D57162D518014C391a687AA8fb9DB55654) {
    +++ description: None
      address:
-        "0xeD9919D57162D518014C391a687AA8fb9DB55654"
+        "eth:0xeD9919D57162D518014C391a687AA8fb9DB55654"
    }
```

```diff
    EOA  (0xee1Af3f99AF8C5b93512FbE2A3f0dD5568CE087f) {
    +++ description: None
      address:
-        "0xee1Af3f99AF8C5b93512FbE2A3f0dD5568CE087f"
+        "eth:0xee1Af3f99AF8C5b93512FbE2A3f0dD5568CE087f"
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
    EOA  (0xF7ca543d652E38692fD12f989eb55b5327eC9A20) {
    +++ description: None
      address:
-        "0xF7ca543d652E38692fD12f989eb55b5327eC9A20"
+        "eth:0xF7ca543d652E38692fD12f989eb55b5327eC9A20"
    }
```

```diff
    EOA  (0xFB00073F931A817b244bF211aA2E5DCBfff8B1ca) {
    +++ description: None
      address:
-        "0xFB00073F931A817b244bF211aA2E5DCBfff8B1ca"
+        "eth:0xFB00073F931A817b244bF211aA2E5DCBfff8B1ca"
    }
```

```diff
    EOA  (0xfF00000000000000000000000000000000000360) {
    +++ description: None
      address:
-        "0xfF00000000000000000000000000000000000360"
+        "eth:0xfF00000000000000000000000000000000000360"
    }
```

```diff
    contract SystemConfig (0xfF11e41D5C4F522E423Ff6C064Ff8D55AF8f7355) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      address:
-        "0xfF11e41D5C4F522E423Ff6C064Ff8D55AF8f7355"
+        "eth:0xfF11e41D5C4F522E423Ff6C064Ff8D55AF8f7355"
      values.$admin:
-        "0x11B190Ae661c6d6884dFEE48E215691E0DdB842e"
+        "eth:0x11B190Ae661c6d6884dFEE48E215691E0DdB842e"
      values.$implementation:
-        "0xAB9d6cB7A427c0765163A7f45BB91cAfe5f2D375"
+        "eth:0xAB9d6cB7A427c0765163A7f45BB91cAfe5f2D375"
      values.$pastUpgrades.0.2.0:
-        "0x8174764Ae82696D232D5C93FEA6A006b1286dC4a"
+        "eth:0x8174764Ae82696D232D5C93FEA6A006b1286dC4a"
      values.$pastUpgrades.1.2.0:
-        "0xd81f43eDBCAcb4c29a9bA38a13Ee5d79278270cC"
+        "eth:0xd81f43eDBCAcb4c29a9bA38a13Ee5d79278270cC"
      values.$pastUpgrades.2.2.0:
-        "0xF56D96B2535B932656d3c04Ebf51baBff241D886"
+        "eth:0xF56D96B2535B932656d3c04Ebf51baBff241D886"
      values.$pastUpgrades.3.2.0:
-        "0xd81f43eDBCAcb4c29a9bA38a13Ee5d79278270cC"
+        "eth:0xd81f43eDBCAcb4c29a9bA38a13Ee5d79278270cC"
      values.$pastUpgrades.4.2.0:
-        "0xAB9d6cB7A427c0765163A7f45BB91cAfe5f2D375"
+        "eth:0xAB9d6cB7A427c0765163A7f45BB91cAfe5f2D375"
      values.batcherHash:
-        "0xF7ca543d652E38692fD12f989eb55b5327eC9A20"
+        "eth:0xF7ca543d652E38692fD12f989eb55b5327eC9A20"
      values.batchInbox:
-        "0xfF00000000000000000000000000000000000360"
+        "eth:0xfF00000000000000000000000000000000000360"
      values.disputeGameFactory:
-        "0x2c03e8BF8b16Af89079852BE87f0e9eC674a5952"
+        "eth:0x2c03e8BF8b16Af89079852BE87f0e9eC674a5952"
      values.gasPayingToken.addr_:
-        "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE"
+        "eth:0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE"
      values.l1CrossDomainMessenger:
-        "0x2b18602877181C3cB72C687E2A771E123A3788E3"
+        "eth:0x2b18602877181C3cB72C687E2A771E123A3788E3"
      values.l1ERC721Bridge:
-        "0xe9d3E49b0636016c5fE9eaA2347948D0bA9f15Af"
+        "eth:0xe9d3E49b0636016c5fE9eaA2347948D0bA9f15Af"
      values.l1StandardBridge:
-        "0x62Edd5f4930Ea92dCa3fB81689bDD9b9d076b57B"
+        "eth:0x62Edd5f4930Ea92dCa3fB81689bDD9b9d076b57B"
      values.optimismMintableERC20Factory:
-        "0x319322906beAdf69dF5d4607169c63D692B1aDC1"
+        "eth:0x319322906beAdf69dF5d4607169c63D692B1aDC1"
      values.optimismPortal:
-        "0xEB06fFa16011B5628BaB98E29776361c83741dd3"
+        "eth:0xEB06fFa16011B5628BaB98E29776361c83741dd3"
      values.owner:
-        "0xee1Af3f99AF8C5b93512FbE2A3f0dD5568CE087f"
+        "eth:0xee1Af3f99AF8C5b93512FbE2A3f0dD5568CE087f"
      values.sequencerInbox:
-        "0xfF00000000000000000000000000000000000360"
+        "eth:0xfF00000000000000000000000000000000000360"
      values.unsafeBlockSigner:
-        "0x9C66333c504F3A4f5593D0e9739434744cCC5B5d"
+        "eth:0x9C66333c504F3A4f5593D0e9739434744cCC5B5d"
      implementationNames.0xfF11e41D5C4F522E423Ff6C064Ff8D55AF8f7355:
-        "Proxy"
      implementationNames.0xAB9d6cB7A427c0765163A7f45BB91cAfe5f2D375:
-        "SystemConfig"
      implementationNames.eth:0xfF11e41D5C4F522E423Ff6C064Ff8D55AF8f7355:
+        "Proxy"
      implementationNames.eth:0xAB9d6cB7A427c0765163A7f45BB91cAfe5f2D375:
+        "SystemConfig"
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
    contract ProxyAdmin (0x11B190Ae661c6d6884dFEE48E215691E0DdB842e)
    +++ description: None
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
    contract L1CrossDomainMessenger (0x2b18602877181C3cB72C687E2A771E123A3788E3)
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
```

```diff
+   Status: CREATED
    contract DisputeGameFactory (0x2c03e8BF8b16Af89079852BE87f0e9eC674a5952)
    +++ description: The dispute game factory allows the creation of dispute games, used to propose state roots and eventually challenge them.
```

```diff
+   Status: CREATED
    contract OptimismMintableERC20Factory (0x319322906beAdf69dF5d4607169c63D692B1aDC1)
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintableERC20 as this chain's representation of a token on the host chain, or vice-versa.
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
    contract L1StandardBridge (0x62Edd5f4930Ea92dCa3fB81689bDD9b9d076b57B)
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
```

```diff
+   Status: CREATED
    contract AnchorStateRegistry (0x6ace93AF6E8b36803577381be9f02A552e81C10D)
    +++ description: Contains the latest confirmed state root that can be used as a starting point in a dispute game.
```

```diff
+   Status: CREATED
    contract PermissionedDisputeGame (0x8090Ac33F4C9A1A220492487390dbe0c3b56a37A)
    +++ description: Same as FaultDisputeGame, but only two permissioned addresses are designated as proposer and challenger.
```

```diff
+   Status: CREATED
    contract DelayedWETH (0x846d9469BAaF481f8516f7c1d03990672B68CB09)
    +++ description: Contract designed to hold the bonded ETH for each game. It is designed as a wrapper around WETH to allow an owner to function as a backstop if a game would incorrectly distribute funds.
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
    contract Alchemy Multisig 1 (0xA4fB12D15Eb85dc9284a7df0AdBC8B696EdbbF1d)
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
    contract AddressManager (0xcee78437aE9e15cee9c78E63757E0153c0FD7479)
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
```

```diff
+   Status: CREATED
    contract AddressManager (0xdE1FCfB0851916CA5101820A69b13a4E276bd81F)
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
```

```diff
+   Status: CREATED
    contract L1ERC721Bridge (0xe9d3E49b0636016c5fE9eaA2347948D0bA9f15Af)
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
```

```diff
+   Status: CREATED
    contract OptimismPortal2 (0xEB06fFa16011B5628BaB98E29776361c83741dd3)
    +++ description: The OptimismPortal contract is the main entry point to deposit funds from L1 to L2. It also allows to prove and finalize withdrawals. It specifies which game type can be used for withdrawals, which currently is the PermissionedDisputeGame.
```

```diff
+   Status: CREATED
    contract SystemConfig (0xfF11e41D5C4F522E423Ff6C064Ff8D55AF8f7355)
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
```

Generated with discovered.json: 0x2ae282eb841872180834b8105d215c6c0568f92c

# Diff at Mon, 14 Jul 2025 08:02:46 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@0dc82cd5064c9c6dc9fb20e2291a8bb6b2048e27 block: 22731117
- current block number: 22731117

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22731117 (main branch discovery), not current.

```diff
    contract OptimismMintableERC20Factory (0x319322906beAdf69dF5d4607169c63D692B1aDC1) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintableERC20 as this chain's representation of a token on the host chain, or vice-versa.
      description:
-        "A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa."
+        "A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintableERC20 as this chain's representation of a token on the host chain, or vice-versa."
    }
```

Generated with discovered.json: 0xb4c6072d4d5d39f30139a79cdda4178740837e40

# Diff at Fri, 04 Jul 2025 12:19:19 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f56dc47fe915564d4555300304da4d3bcbc087f block: 22731117
- current block number: 22731117

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22731117 (main branch discovery), not current.

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
    EOA  (0x0D8a607F3d2de86adD04Df00f06794cB339A40de) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0x8090Ac33F4C9A1A220492487390dbe0c3b56a37A"
+        "eth:0x8090Ac33F4C9A1A220492487390dbe0c3b56a37A"
    }
```

```diff
    contract ProxyAdmin (0x11B190Ae661c6d6884dFEE48E215691E0DdB842e) {
    +++ description: None
      directlyReceivedPermissions.0.from:
-        "ethereum:0xcee78437aE9e15cee9c78E63757E0153c0FD7479"
+        "eth:0xcee78437aE9e15cee9c78E63757E0153c0FD7479"
      directlyReceivedPermissions.1.from:
-        "ethereum:0x2b18602877181C3cB72C687E2A771E123A3788E3"
+        "eth:0x2b18602877181C3cB72C687E2A771E123A3788E3"
      directlyReceivedPermissions.2.from:
-        "ethereum:0x2c03e8BF8b16Af89079852BE87f0e9eC674a5952"
+        "eth:0x2c03e8BF8b16Af89079852BE87f0e9eC674a5952"
      directlyReceivedPermissions.3.from:
-        "ethereum:0x319322906beAdf69dF5d4607169c63D692B1aDC1"
+        "eth:0x319322906beAdf69dF5d4607169c63D692B1aDC1"
      directlyReceivedPermissions.4.from:
-        "ethereum:0x62Edd5f4930Ea92dCa3fB81689bDD9b9d076b57B"
+        "eth:0x62Edd5f4930Ea92dCa3fB81689bDD9b9d076b57B"
      directlyReceivedPermissions.5.from:
-        "ethereum:0x6ace93AF6E8b36803577381be9f02A552e81C10D"
+        "eth:0x6ace93AF6E8b36803577381be9f02A552e81C10D"
      directlyReceivedPermissions.6.from:
-        "ethereum:0x846d9469BAaF481f8516f7c1d03990672B68CB09"
+        "eth:0x846d9469BAaF481f8516f7c1d03990672B68CB09"
      directlyReceivedPermissions.7.from:
-        "ethereum:0xe9d3E49b0636016c5fE9eaA2347948D0bA9f15Af"
+        "eth:0xe9d3E49b0636016c5fE9eaA2347948D0bA9f15Af"
      directlyReceivedPermissions.8.from:
-        "ethereum:0xEB06fFa16011B5628BaB98E29776361c83741dd3"
+        "eth:0xEB06fFa16011B5628BaB98E29776361c83741dd3"
      directlyReceivedPermissions.9.from:
-        "ethereum:0xfF11e41D5C4F522E423Ff6C064Ff8D55AF8f7355"
+        "eth:0xfF11e41D5C4F522E423Ff6C064Ff8D55AF8f7355"
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
-        "ethereum:0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
+        "eth:0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
    }
```

```diff
    contract SuperchainProxyAdminOwner (0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A) {
    +++ description: None
      receivedPermissions.0.via.0.address:
-        "ethereum:0x543bA4AADBAb8f9025686Bd03993043599c6fB04"
+        "eth:0x543bA4AADBAb8f9025686Bd03993043599c6fB04"
      receivedPermissions.0.from:
-        "ethereum:0xdE1FCfB0851916CA5101820A69b13a4E276bd81F"
+        "eth:0xdE1FCfB0851916CA5101820A69b13a4E276bd81F"
      receivedPermissions.1.via.0.address:
-        "ethereum:0x543bA4AADBAb8f9025686Bd03993043599c6fB04"
+        "eth:0x543bA4AADBAb8f9025686Bd03993043599c6fB04"
      receivedPermissions.1.from:
-        "ethereum:0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
+        "eth:0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
      directlyReceivedPermissions.0.from:
-        "ethereum:0x543bA4AADBAb8f9025686Bd03993043599c6fB04"
+        "eth:0x543bA4AADBAb8f9025686Bd03993043599c6fB04"
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
    contract Alchemy Multisig 1 (0xA4fB12D15Eb85dc9284a7df0AdBC8B696EdbbF1d) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0x8090Ac33F4C9A1A220492487390dbe0c3b56a37A"
+        "eth:0x8090Ac33F4C9A1A220492487390dbe0c3b56a37A"
      receivedPermissions.1.via.0.address:
-        "ethereum:0x11B190Ae661c6d6884dFEE48E215691E0DdB842e"
+        "eth:0x11B190Ae661c6d6884dFEE48E215691E0DdB842e"
      receivedPermissions.1.from:
-        "ethereum:0xcee78437aE9e15cee9c78E63757E0153c0FD7479"
+        "eth:0xcee78437aE9e15cee9c78E63757E0153c0FD7479"
      receivedPermissions.2.via.0.address:
-        "ethereum:0x11B190Ae661c6d6884dFEE48E215691E0DdB842e"
+        "eth:0x11B190Ae661c6d6884dFEE48E215691E0DdB842e"
      receivedPermissions.2.from:
-        "ethereum:0x2b18602877181C3cB72C687E2A771E123A3788E3"
+        "eth:0x2b18602877181C3cB72C687E2A771E123A3788E3"
      receivedPermissions.3.via.0.address:
-        "ethereum:0x11B190Ae661c6d6884dFEE48E215691E0DdB842e"
+        "eth:0x11B190Ae661c6d6884dFEE48E215691E0DdB842e"
      receivedPermissions.3.from:
-        "ethereum:0x2c03e8BF8b16Af89079852BE87f0e9eC674a5952"
+        "eth:0x2c03e8BF8b16Af89079852BE87f0e9eC674a5952"
      receivedPermissions.4.via.0.address:
-        "ethereum:0x11B190Ae661c6d6884dFEE48E215691E0DdB842e"
+        "eth:0x11B190Ae661c6d6884dFEE48E215691E0DdB842e"
      receivedPermissions.4.from:
-        "ethereum:0x319322906beAdf69dF5d4607169c63D692B1aDC1"
+        "eth:0x319322906beAdf69dF5d4607169c63D692B1aDC1"
      receivedPermissions.5.via.0.address:
-        "ethereum:0x11B190Ae661c6d6884dFEE48E215691E0DdB842e"
+        "eth:0x11B190Ae661c6d6884dFEE48E215691E0DdB842e"
      receivedPermissions.5.from:
-        "ethereum:0x62Edd5f4930Ea92dCa3fB81689bDD9b9d076b57B"
+        "eth:0x62Edd5f4930Ea92dCa3fB81689bDD9b9d076b57B"
      receivedPermissions.6.via.0.address:
-        "ethereum:0x11B190Ae661c6d6884dFEE48E215691E0DdB842e"
+        "eth:0x11B190Ae661c6d6884dFEE48E215691E0DdB842e"
      receivedPermissions.6.from:
-        "ethereum:0x6ace93AF6E8b36803577381be9f02A552e81C10D"
+        "eth:0x6ace93AF6E8b36803577381be9f02A552e81C10D"
      receivedPermissions.7.via.0.address:
-        "ethereum:0x11B190Ae661c6d6884dFEE48E215691E0DdB842e"
+        "eth:0x11B190Ae661c6d6884dFEE48E215691E0DdB842e"
      receivedPermissions.7.from:
-        "ethereum:0x846d9469BAaF481f8516f7c1d03990672B68CB09"
+        "eth:0x846d9469BAaF481f8516f7c1d03990672B68CB09"
      receivedPermissions.8.via.0.address:
-        "ethereum:0x11B190Ae661c6d6884dFEE48E215691E0DdB842e"
+        "eth:0x11B190Ae661c6d6884dFEE48E215691E0DdB842e"
      receivedPermissions.8.from:
-        "ethereum:0xe9d3E49b0636016c5fE9eaA2347948D0bA9f15Af"
+        "eth:0xe9d3E49b0636016c5fE9eaA2347948D0bA9f15Af"
      receivedPermissions.9.via.0.address:
-        "ethereum:0x11B190Ae661c6d6884dFEE48E215691E0DdB842e"
+        "eth:0x11B190Ae661c6d6884dFEE48E215691E0DdB842e"
      receivedPermissions.9.from:
-        "ethereum:0xEB06fFa16011B5628BaB98E29776361c83741dd3"
+        "eth:0xEB06fFa16011B5628BaB98E29776361c83741dd3"
      receivedPermissions.10.via.0.address:
-        "ethereum:0x11B190Ae661c6d6884dFEE48E215691E0DdB842e"
+        "eth:0x11B190Ae661c6d6884dFEE48E215691E0DdB842e"
      receivedPermissions.10.from:
-        "ethereum:0xfF11e41D5C4F522E423Ff6C064Ff8D55AF8f7355"
+        "eth:0xfF11e41D5C4F522E423Ff6C064Ff8D55AF8f7355"
      directlyReceivedPermissions.0.from:
-        "ethereum:0x11B190Ae661c6d6884dFEE48E215691E0DdB842e"
+        "eth:0x11B190Ae661c6d6884dFEE48E215691E0DdB842e"
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
    EOA  (0xee1Af3f99AF8C5b93512FbE2A3f0dD5568CE087f) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0x846d9469BAaF481f8516f7c1d03990672B68CB09"
+        "eth:0x846d9469BAaF481f8516f7c1d03990672B68CB09"
      receivedPermissions.1.from:
-        "ethereum:0xfF11e41D5C4F522E423Ff6C064Ff8D55AF8f7355"
+        "eth:0xfF11e41D5C4F522E423Ff6C064Ff8D55AF8f7355"
    }
```

```diff
    EOA  (0xF7ca543d652E38692fD12f989eb55b5327eC9A20) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0xfF11e41D5C4F522E423Ff6C064Ff8D55AF8f7355"
+        "eth:0xfF11e41D5C4F522E423Ff6C064Ff8D55AF8f7355"
    }
```

Generated with discovered.json: 0x0b92bd1cc75023a91be741682463089e5452803f

# Diff at Wed, 18 Jun 2025 11:38:16 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@a8e4f22a1441bd5040898cc3d3d62b3582942b65 block: 22437744
- current block number: 22731117

## Description

MS signer changed.

## Watched changes

```diff
    contract Alchemy Multisig 1 (0xA4fB12D15Eb85dc9284a7df0AdBC8B696EdbbF1d) {
    +++ description: None
      values.$members.4:
-        "0x0a214444613E3970049BD74a8d72d5bF9EF0094c"
+        "0xCA730AFfb87935E70E5889418C731eb196237476"
    }
```

Generated with discovered.json: 0xccab1a6104e99ab98a694a5b0e81cb5d757457a1

# Diff at Mon, 16 Jun 2025 10:14:38 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@e1208475abce20cea1768d2e4878c03350c1b7c9 block: 22437744
- current block number: 22437744

## Description

Config: add permissioned opfp role tags.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22437744 (main branch discovery), not current.

```diff
    EOA  (0x0D8a607F3d2de86adD04Df00f06794cB339A40de) {
    +++ description: None
      receivedPermissions:
+        [{"permission":"propose","from":"ethereum:0x8090Ac33F4C9A1A220492487390dbe0c3b56a37A","role":".proposer"}]
    }
```

```diff
    contract ProxyAdmin (0x11B190Ae661c6d6884dFEE48E215691E0DdB842e) {
    +++ description: None
      directlyReceivedPermissions.9:
+        {"permission":"upgrade","from":"ethereum:0x2c03e8BF8b16Af89079852BE87f0e9eC674a5952","role":"admin"}
      directlyReceivedPermissions.8.from:
-        "ethereum:0x2c03e8BF8b16Af89079852BE87f0e9eC674a5952"
+        "ethereum:0x6ace93AF6E8b36803577381be9f02A552e81C10D"
      directlyReceivedPermissions.7.from:
-        "ethereum:0x6ace93AF6E8b36803577381be9f02A552e81C10D"
+        "ethereum:0x2b18602877181C3cB72C687E2A771E123A3788E3"
    }
```

```diff
    contract L1CrossDomainMessenger (0x2b18602877181C3cB72C687E2A771E123A3788E3) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      values.$admin:
+        "0x11B190Ae661c6d6884dFEE48E215691E0DdB842e"
    }
```

```diff
    contract Alchemy Multisig 1 (0xA4fB12D15Eb85dc9284a7df0AdBC8B696EdbbF1d) {
    +++ description: None
      receivedPermissions.10:
+        {"permission":"upgrade","from":"ethereum:0x2c03e8BF8b16Af89079852BE87f0e9eC674a5952","role":"admin","via":[{"address":"ethereum:0x11B190Ae661c6d6884dFEE48E215691E0DdB842e"}]}
      receivedPermissions.9:
+        {"permission":"upgrade","from":"ethereum:0x6ace93AF6E8b36803577381be9f02A552e81C10D","role":"admin","via":[{"address":"ethereum:0x11B190Ae661c6d6884dFEE48E215691E0DdB842e"}]}
      receivedPermissions.8.from:
-        "ethereum:0x2c03e8BF8b16Af89079852BE87f0e9eC674a5952"
+        "ethereum:0x2b18602877181C3cB72C687E2A771E123A3788E3"
      receivedPermissions.7.from:
-        "ethereum:0x6ace93AF6E8b36803577381be9f02A552e81C10D"
+        "ethereum:0x319322906beAdf69dF5d4607169c63D692B1aDC1"
      receivedPermissions.6.from:
-        "ethereum:0x319322906beAdf69dF5d4607169c63D692B1aDC1"
+        "ethereum:0xe9d3E49b0636016c5fE9eaA2347948D0bA9f15Af"
      receivedPermissions.5.from:
-        "ethereum:0xe9d3E49b0636016c5fE9eaA2347948D0bA9f15Af"
+        "ethereum:0xfF11e41D5C4F522E423Ff6C064Ff8D55AF8f7355"
      receivedPermissions.4.from:
-        "ethereum:0xfF11e41D5C4F522E423Ff6C064Ff8D55AF8f7355"
+        "ethereum:0x846d9469BAaF481f8516f7c1d03990672B68CB09"
      receivedPermissions.3.from:
-        "ethereum:0x846d9469BAaF481f8516f7c1d03990672B68CB09"
+        "ethereum:0xEB06fFa16011B5628BaB98E29776361c83741dd3"
      receivedPermissions.2.permission:
-        "upgrade"
+        "challenge"
      receivedPermissions.2.from:
-        "ethereum:0xEB06fFa16011B5628BaB98E29776361c83741dd3"
+        "ethereum:0x8090Ac33F4C9A1A220492487390dbe0c3b56a37A"
      receivedPermissions.2.role:
-        "admin"
+        ".challenger"
      receivedPermissions.2.via:
-        [{"address":"ethereum:0x11B190Ae661c6d6884dFEE48E215691E0DdB842e"}]
    }
```

Generated with discovered.json: 0xa6d800240d8b9ab37cc75bdd326d55ff0a90a6e6

# Diff at Fri, 30 May 2025 07:15:17 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@a4d8c436027d17df0f9b76843cd6deb1888fa381 block: 22437744
- current block number: 22437744

## Description

config: change comment about eip1559 fee val

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22437744 (main branch discovery), not current.

```diff
    contract SystemConfig (0xfF11e41D5C4F522E423Ff6C064Ff8D55AF8f7355) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      fieldMeta.eip1559Denominator:
+        {"description":"volatility param: lower denominator -> quicker fee changes on L2"}
    }
```

Generated with discovered.json: 0xeab16992414e807293de0f18b5d18edbfd459d3b

# Diff at Fri, 23 May 2025 09:41:03 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@69cd181abbc3c830a6caf2f4429b37cae72ffdb8 block: 22437744
- current block number: 22437744

## Description

Introduced .role field on each permission, defaulting to field name on which it was defined (with '.' prefix)

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22437744 (main branch discovery), not current.

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
    contract ProxyAdmin (0x11B190Ae661c6d6884dFEE48E215691E0DdB842e) {
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
      receivedPermissions.1.permission:
-        "interact"
+        "upgrade"
      receivedPermissions.1.from:
-        "0xdE1FCfB0851916CA5101820A69b13a4E276bd81F"
+        "0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
      receivedPermissions.1.description:
-        "set and change address mappings."
      receivedPermissions.1.role:
+        "admin"
      receivedPermissions.0.permission:
-        "upgrade"
+        "interact"
      receivedPermissions.0.from:
-        "0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
+        "0xdE1FCfB0851916CA5101820A69b13a4E276bd81F"
      receivedPermissions.0.description:
+        "set and change address mappings."
      receivedPermissions.0.role:
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
    contract Alchemy Multisig 1 (0xA4fB12D15Eb85dc9284a7df0AdBC8B696EdbbF1d) {
    +++ description: None
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
+        ".$admin"
      receivedPermissions.0.role:
+        ".owner"
      directlyReceivedPermissions.0.role:
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
    EOA  (0xee1Af3f99AF8C5b93512FbE2A3f0dD5568CE087f) {
    +++ description: None
      receivedPermissions.1.role:
+        ".owner"
      receivedPermissions.0.role:
+        ".owner"
    }
```

```diff
    EOA  (0xF7ca543d652E38692fD12f989eb55b5327eC9A20) {
    +++ description: None
      receivedPermissions.0.role:
+        ".batcherHash"
    }
```

Generated with discovered.json: 0xc0898f0f3c0b801edf8b149a489faa2edb8e378d

# Diff at Fri, 09 May 2025 10:09:11 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@c3a1d49c07f4092914d62c65181e5fec18a88318 block: 22437744
- current block number: 22437744

## Description

Config related: Move IFs to the editable string for condition configs (yeet IFs from the automatic resolver).

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22437744 (main branch discovery), not current.

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

Generated with discovered.json: 0x8019c5f1a883bde9d0f03734c1c66854bdf55af2

# Diff at Thu, 08 May 2025 08:50:35 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@8e1926142ab0c57cc131de4d8da307e13d9af54d block: 22194732
- current block number: 22437744

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
.../shape/ethereum/.flat/DeputyPauseModule.sol     | 1338 ++++++++++++++++++++
 1 file changed, 1338 insertions(+)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22194732 (main branch discovery), not current.

```diff
    contract PermissionedDisputeGame (0x8090Ac33F4C9A1A220492487390dbe0c3b56a37A) {
    +++ description: Same as FaultDisputeGame, but only two permissioned addresses are designated as proposer and challenger.
      usedTypes.0.arg.0x03682932cec7ce0a3874b19675a6bbc923054a7b321efc7d3835187b172494b6:
+        "v1.6.0 (cannon64)"
    }
```

Generated with discovered.json: 0xb70a0db5dbc957a1270d419a7f5733e0350dea3f

# Diff at Tue, 29 Apr 2025 08:19:11 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@ef7477af00fe0b57a2f7cacf7e958c12494af662 block: 22194732
- current block number: 22194732

## Description

Field .issuedPermissions is removed from the output as no longer needed. Added 'permissionsConfigHash' due to refactoring of the modelling process (into a separate command).

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22194732 (main branch discovery), not current.

```diff
    contract LivenessModule (0x0454092516c9A4d636d3CAfA1e82161376C8a748) {
    +++ description: used to remove members inactive for 98d while making sure that the threshold remains above 75%. If the number of members falls below 8, the 0x847B5c174615B1B7fDF770882256e2D3E95b9D92 takes ownership of the multisig
      issuedPermissions:
-        [{"permission":"interact","to":"0x24424336F04440b1c28685a38303aC33C9D14a25","description":"can remove members of 0xc2819DC788505Aac350142A7A707BF9D03E3Bd03 inactive for 98d.","via":[]}]
    }
```

```diff
    contract DisputeGameFactory (0x2c03e8BF8b16Af89079852BE87f0e9eC674a5952) {
    +++ description: The dispute game factory allows the creation of dispute games, used to propose state roots and eventually challenge them.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0xA4fB12D15Eb85dc9284a7df0AdBC8B696EdbbF1d","via":[{"address":"0x11B190Ae661c6d6884dFEE48E215691E0DdB842e"}]}]
    }
```

```diff
    contract OptimismMintableERC20Factory (0x319322906beAdf69dF5d4607169c63D692B1aDC1) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0xA4fB12D15Eb85dc9284a7df0AdBC8B696EdbbF1d","via":[{"address":"0x11B190Ae661c6d6884dFEE48E215691E0DdB842e"}]}]
    }
```

```diff
    contract L1StandardBridge (0x62Edd5f4930Ea92dCa3fB81689bDD9b9d076b57B) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0xA4fB12D15Eb85dc9284a7df0AdBC8B696EdbbF1d","description":"upgrading the bridge implementation can give access to all funds escrowed therein.","via":[{"address":"0x11B190Ae661c6d6884dFEE48E215691E0DdB842e"}]}]
    }
```

```diff
    contract AnchorStateRegistry (0x6ace93AF6E8b36803577381be9f02A552e81C10D) {
    +++ description: Contains the latest confirmed state root that can be used as a starting point in a dispute game.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0xA4fB12D15Eb85dc9284a7df0AdBC8B696EdbbF1d","via":[{"address":"0x11B190Ae661c6d6884dFEE48E215691E0DdB842e"}]}]
    }
```

```diff
    contract DelayedWETH (0x846d9469BAaF481f8516f7c1d03990672B68CB09) {
    +++ description: Contract designed to hold the bonded ETH for each game. It is designed as a wrapper around WETH to allow an owner to function as a backstop if a game would incorrectly distribute funds.
      issuedPermissions:
-        [{"permission":"interact","to":"0xee1Af3f99AF8C5b93512FbE2A3f0dD5568CE087f","description":"can pull funds from the contract in case of emergency.","via":[]},{"permission":"upgrade","to":"0xA4fB12D15Eb85dc9284a7df0AdBC8B696EdbbF1d","via":[{"address":"0x11B190Ae661c6d6884dFEE48E215691E0DdB842e"}]}]
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
    contract AddressManager (0xcee78437aE9e15cee9c78E63757E0153c0FD7479) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      issuedPermissions:
-        [{"permission":"interact","to":"0xA4fB12D15Eb85dc9284a7df0AdBC8B696EdbbF1d","description":"set and change address mappings.","via":[{"address":"0x11B190Ae661c6d6884dFEE48E215691E0DdB842e"}]}]
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
    contract L1ERC721Bridge (0xe9d3E49b0636016c5fE9eaA2347948D0bA9f15Af) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0xA4fB12D15Eb85dc9284a7df0AdBC8B696EdbbF1d","via":[{"address":"0x11B190Ae661c6d6884dFEE48E215691E0DdB842e"}]}]
    }
```

```diff
    contract OptimismPortal2 (0xEB06fFa16011B5628BaB98E29776361c83741dd3) {
    +++ description: The OptimismPortal contract is the main entry point to deposit funds from L1 to L2. It also allows to prove and finalize withdrawals. It specifies which game type can be used for withdrawals, which currently is the PermissionedDisputeGame.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0xA4fB12D15Eb85dc9284a7df0AdBC8B696EdbbF1d","via":[{"address":"0x11B190Ae661c6d6884dFEE48E215691E0DdB842e"}]}]
    }
```

```diff
    contract SystemConfig (0xfF11e41D5C4F522E423Ff6C064Ff8D55AF8f7355) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      issuedPermissions:
-        [{"permission":"interact","to":"0xee1Af3f99AF8C5b93512FbE2A3f0dD5568CE087f","description":"it can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system.","via":[]},{"permission":"sequence","to":"0xF7ca543d652E38692fD12f989eb55b5327eC9A20","via":[]},{"permission":"upgrade","to":"0xA4fB12D15Eb85dc9284a7df0AdBC8B696EdbbF1d","via":[{"address":"0x11B190Ae661c6d6884dFEE48E215691E0DdB842e"}]}]
    }
```

Generated with discovered.json: 0x10fcd0edbb0bbb7895c3f471e2c0f8c37693d90b

# Diff at Fri, 11 Apr 2025 13:16:19 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@b607477490db79d49274f7585039ac7263456118 block: 22194732
- current block number: 22194732

## Description

Config: global mapping updated for op stack prestates.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22194732 (main branch discovery), not current.

```diff
    contract PermissionedDisputeGame (0x8090Ac33F4C9A1A220492487390dbe0c3b56a37A) {
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

Generated with discovered.json: 0x7e33b426344b36f2c246ff54c08664074388a7e7

# Diff at Thu, 10 Apr 2025 14:43:04 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@f38a3c9bf359344e4c4cd3006f58271cb8f78d15 block: 22194732
- current block number: 22194732

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22194732 (main branch discovery), not current.

```diff
    contract SuperchainProxyAdmin (0x543bA4AADBAb8f9025686Bd03993043599c6fB04) {
    +++ description: None
      displayName:
-        "ProxyAdmin"
    }
```

Generated with discovered.json: 0x6170a28b2b6210c9a7e4c5be45e261e6573757f2

# Diff at Fri, 04 Apr 2025 09:43:07 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@b3154c4385e52c9ffc0dab984c207390e5ccc13d block: 22166595
- current block number: 22194732

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
discovery. Values are for block 22166595 (main branch discovery), not current.

```diff
    contract DelayedWETH (0x846d9469BAaF481f8516f7c1d03990672B68CB09) {
    +++ description: Contract designed to hold the bonded ETH for each game. It is designed as a wrapper around WETH to allow an owner to function as a backstop if a game would incorrectly distribute funds.
      issuedPermissions.1:
+        {"permission":"interact","to":"0xee1Af3f99AF8C5b93512FbE2A3f0dD5568CE087f","description":"can pull funds from the contract in case of emergency.","via":[]}
    }
```

```diff
    contract undefined (0xee1Af3f99AF8C5b93512FbE2A3f0dD5568CE087f) {
    +++ description: None
      receivedPermissions.1:
+        {"permission":"interact","from":"0x846d9469BAaF481f8516f7c1d03990672B68CB09","description":"can pull funds from the contract in case of emergency."}
    }
```

Generated with discovered.json: 0x1cab0e4e4f18e701e0a32f789fe45b838ece6395

# Diff at Mon, 31 Mar 2025 11:27:18 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@71ffebe835be10b6d5d09ef65aa19b910de8a2ec block: 22073412
- current block number: 22166595

## Description

ms signer changes.

## Watched changes

```diff
    contract Alchemy Multisig 1 (0xA4fB12D15Eb85dc9284a7df0AdBC8B696EdbbF1d) {
    +++ description: None
      values.$members.7:
+        "0x001271c57AeC639952B5201D052767c316755512"
      values.$members.6:
+        "0xB2aa0C2C4fD6BFCBF699d4c787CD6Cc0dC461a9d"
      values.$members.5:
-        "0x5EABE7f6673311EdD1Ad17A76ce148c2Bb56aF01"
+        "0xFB00073F931A817b244bF211aA2E5DCBfff8B1ca"
      values.$members.4:
-        "0x39CF304731099e756204219BF0a8cCc4738dE9dD"
+        "0x0a214444613E3970049BD74a8d72d5bF9EF0094c"
      values.$members.3:
-        "0xaCEF7482b54a57F50b1CD8c99d1dC1964202A063"
+        "0xA351A874b48dCEdf1883dD4F4049bE3d9923700a"
      values.$members.2:
-        "0xB2aa0C2C4fD6BFCBF699d4c787CD6Cc0dC461a9d"
+        "0xeD9919D57162D518014C391a687AA8fb9DB55654"
      values.$members.1:
-        "0x3f0030b9Ca695Abd41b2B619F3298e172e4FCAD6"
+        "0x35A2079110aa30d1De381cf75aCd1836b6dEE1d7"
      values.$members.0:
-        "0x2e42cEfC761e64Bf4442694220d31C2464a6EE21"
+        "0xd1447Dd15D9e24ddFF99f0fE3C88Bf64d23D1670"
      values.$threshold:
-        3
+        5
      values.multisigThreshold:
-        "3 of 6 (50%)"
+        "5 of 8 (63%)"
    }
```

Generated with discovered.json: 0xa4947940206d53ddf0dee0c33860e6071cccb1ef

# Diff at Thu, 27 Mar 2025 11:15:04 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@8cc2e36080df3a74dfd8475d41c64f46203f5218 block: 22073412
- current block number: 22073412

## Description

Config related: add guardian description details, hide some noisy values, hide AddressManager as spam cat, add proposer / challenger to permissioned opfp chains.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22073412 (main branch discovery), not current.

```diff
    contract AddressManager (0xcee78437aE9e15cee9c78E63757E0153c0FD7479) {
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

Generated with discovered.json: 0x8b5fbd90b33b2314754f4d9a684603fc02480374

# Diff at Tue, 18 Mar 2025 11:17:59 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@8a389387016e20fe96cd5cb775e4b943b3aaa832 block: 21895001
- current block number: 22073412

## Description

Upgrade to standard SystemConfig v2.3.0.

## Watched changes

```diff
    contract SystemConfig (0xfF11e41D5C4F522E423Ff6C064Ff8D55AF8f7355) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      sourceHashes.1:
-        "0xbbb92920a096eced30e3ce67bbc443f134b217e8847433fbb192ecb9fdddcbc2"
+        "0xc7135dbd2a53312d36df3f3ee91ce0a5a459ab8fc7725880a3a9c55a5fa0ed6c"
      values.$implementation:
-        "0xF56D96B2535B932656d3c04Ebf51baBff241D886"
+        "0xAB9d6cB7A427c0765163A7f45BB91cAfe5f2D375"
      values.$pastUpgrades.4:
+        ["2025-02-04T20:28:23.000Z","0x2f29cb5a59d7e7d132eb7afe57d9bf12df3db311db4ef5c5079f9043660635df",["0xF56D96B2535B932656d3c04Ebf51baBff241D886"]]
      values.$pastUpgrades.3:
+        ["2025-03-17T16:24:35.000Z","0xae6ce7a33b18c6ecd39e5c2435a1b9e629b193e97fbf5aaa74e20d7475e50c02",["0xAB9d6cB7A427c0765163A7f45BB91cAfe5f2D375"]]
      values.$pastUpgrades.2.1:
-        ["0xF56D96B2535B932656d3c04Ebf51baBff241D886"]
+        "0x2f29cb5a59d7e7d132eb7afe57d9bf12df3db311db4ef5c5079f9043660635df"
      values.$pastUpgrades.2.0:
-        "0x2f29cb5a59d7e7d132eb7afe57d9bf12df3db311db4ef5c5079f9043660635df"
+        ["0xd81f43eDBCAcb4c29a9bA38a13Ee5d79278270cC"]
      values.$pastUpgrades.1.2:
-        "2025-02-04T20:28:23.000Z"
+        "0xae6ce7a33b18c6ecd39e5c2435a1b9e629b193e97fbf5aaa74e20d7475e50c02"
      values.$pastUpgrades.1.1:
-        "0x2f29cb5a59d7e7d132eb7afe57d9bf12df3db311db4ef5c5079f9043660635df"
+        "2025-03-17T16:24:35.000Z"
      values.$upgradeCount:
-        3
+        5
      values.version:
-        "2.2.0"
+        "2.3.0"
      values.basefeeScalar:
+        10200
      values.blobbasefeeScalar:
+        906223
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

Generated with discovered.json: 0xafdc4aa2856f236716c4cf69d01c753aa42f9726

# Diff at Tue, 18 Mar 2025 08:13:47 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@4ef7a8dbcec1cd9fec77aae2b73d81347a4ffb13 block: 21895001
- current block number: 21895001

## Description

Config: change Multisig names.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21895001 (main branch discovery), not current.

```diff
    contract Optimism Guardian Multisig (0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2) {
    +++ description: None
      name:
-        "SuperchainGuardianMultisig"
+        "Optimism Guardian Multisig"
    }
```

```diff
    contract Alchemy Multisig 1 (0xA4fB12D15Eb85dc9284a7df0AdBC8B696EdbbF1d) {
    +++ description: None
      name:
-        "AlchemyMultisig1"
+        "Alchemy Multisig 1"
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

Generated with discovered.json: 0x67d73bc8cef26647fd5391403ccccbbf492dbb1d

# Diff at Tue, 04 Mar 2025 11:26:17 GMT:

- author: Michał Podsiadły (<michal.podsiadly@l2beat.com>)
- comparing to: main@be38e12d3ff947ca8de40f3a23a9ba1875a54f5a block: 21895001
- current block number: 21895001

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21895001 (main branch discovery), not current.

```diff
    contract SystemConfig (0xfF11e41D5C4F522E423Ff6C064Ff8D55AF8f7355) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      values.opStackDA.isSomeTxsLengthEqualToCelestiaDAExample:
-        false
      values.opStackDA.isUsingCelestia:
+        false
    }
```

Generated with discovered.json: 0x0149b88672e142b05d47a04f246c79b6b6bd91a0

# Diff at Tue, 04 Mar 2025 10:39:46 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@98d260b45fe0d2195ce5e629bd7b200c8706e8ba block: 21895001
- current block number: 21895001

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21895001 (main branch discovery), not current.

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
    contract ProxyAdmin (0x11B190Ae661c6d6884dFEE48E215691E0DdB842e) {
    +++ description: None
      sinceBlock:
+        20369923
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
    contract L1CrossDomainMessenger (0x2b18602877181C3cB72C687E2A771E123A3788E3) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      sinceBlock:
+        20369936
    }
```

```diff
    contract DisputeGameFactory (0x2c03e8BF8b16Af89079852BE87f0e9eC674a5952) {
    +++ description: The dispute game factory allows the creation of dispute games, used to propose state roots and eventually challenge them.
      sinceBlock:
+        21695466
    }
```

```diff
    contract OptimismMintableERC20Factory (0x319322906beAdf69dF5d4607169c63D692B1aDC1) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      sinceBlock:
+        20369937
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
    contract SuperchainProxyAdminOwner (0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A) {
    +++ description: None
      sinceBlock:
+        19185554
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
    contract L1StandardBridge (0x62Edd5f4930Ea92dCa3fB81689bDD9b9d076b57B) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      sinceBlock:
+        20369935
    }
```

```diff
    contract AnchorStateRegistry (0x6ace93AF6E8b36803577381be9f02A552e81C10D) {
    +++ description: Contains the latest confirmed state root that can be used as a starting point in a dispute game.
      sinceBlock:
+        21695467
    }
```

```diff
    contract PermissionedDisputeGame (0x8090Ac33F4C9A1A220492487390dbe0c3b56a37A) {
    +++ description: Same as FaultDisputeGame, but only two permissioned addresses are designated as proposer and challenger.
      sinceBlock:
+        21875214
    }
```

```diff
    contract DelayedWETH (0x846d9469BAaF481f8516f7c1d03990672B68CB09) {
    +++ description: Contract designed to hold the bonded ETH for each game. It is designed as a wrapper around WETH to allow an owner to function as a backstop if a game would incorrectly distribute funds.
      sinceBlock:
+        21875210
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
    contract AlchemyMultisig1 (0xA4fB12D15Eb85dc9284a7df0AdBC8B696EdbbF1d) {
    +++ description: None
      sinceBlock:
+        20178171
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
    contract AddressManager (0xcee78437aE9e15cee9c78E63757E0153c0FD7479) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      sinceBlock:
+        20369922
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
    contract L1ERC721Bridge (0xe9d3E49b0636016c5fE9eaA2347948D0bA9f15Af) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      sinceBlock:
+        20369938
    }
```

```diff
    contract OptimismPortal2 (0xEB06fFa16011B5628BaB98E29776361c83741dd3) {
    +++ description: The OptimismPortal contract is the main entry point to deposit funds from L1 to L2. It also allows to prove and finalize withdrawals. It specifies which game type can be used for withdrawals, which currently is the PermissionedDisputeGame.
      sinceBlock:
+        20369933
    }
```

```diff
    contract SystemConfig (0xfF11e41D5C4F522E423Ff6C064Ff8D55AF8f7355) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      sinceBlock:
+        20369934
    }
```

Generated with discovered.json: 0xe1934f179c51829ef5e4c723f9a7349aea89d21a

# Diff at Thu, 27 Feb 2025 12:01:46 GMT:

- author: Michał Podsiadły (<michal.podsiadly@l2beat.com>)
- comparing to: main@a4b50e45bb44f8ceeea29f9236088d26a843c885 block: 21895001
- current block number: 21895001

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21895001 (main branch discovery), not current.

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

```diff
    contract OptimismPortal2 (0xEB06fFa16011B5628BaB98E29776361c83741dd3) {
    +++ description: The OptimismPortal contract is the main entry point to deposit funds from L1 to L2. It also allows to prove and finalize withdrawals. It specifies which game type can be used for withdrawals, which currently is the PermissionedDisputeGame.
      displayName:
-        "OptimismPortal"
    }
```

Generated with discovered.json: 0xc3e1392d9a8528a37337ce4a78e7f092953cfac8

# Diff at Wed, 26 Feb 2025 10:33:01 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@18513668f913fbe57a197f43655b19111df0e627 block: 21895001
- current block number: 21895001

## Description

config related: added categories for all opstack, op stack and polygoncdk stack templates.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21895001 (main branch discovery), not current.

```diff
    contract L1CrossDomainMessenger (0x2b18602877181C3cB72C687E2A771E123A3788E3) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      category:
+        {"name":"Canonical Bridges","priority":2}
    }
```

```diff
    contract DisputeGameFactory (0x2c03e8BF8b16Af89079852BE87f0e9eC674a5952) {
    +++ description: The dispute game factory allows the creation of dispute games, used to propose state roots and eventually challenge them.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract L1StandardBridge (0x62Edd5f4930Ea92dCa3fB81689bDD9b9d076b57B) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
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
    contract L1ERC721Bridge (0xe9d3E49b0636016c5fE9eaA2347948D0bA9f15Af) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      category:
+        {"name":"Canonical Bridges","priority":2}
    }
```

```diff
    contract OptimismPortal2 (0xEB06fFa16011B5628BaB98E29776361c83741dd3) {
    +++ description: The OptimismPortal contract is the main entry point to deposit funds from L1 to L2. It also allows to prove and finalize withdrawals. It specifies which game type can be used for withdrawals, which currently is the PermissionedDisputeGame.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract SystemConfig (0xfF11e41D5C4F522E423Ff6C064Ff8D55AF8f7355) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

Generated with discovered.json: 0xa53323b7d4c67a47cf8b70119e74cf05b2872bdf

# Diff at Fri, 21 Feb 2025 13:26:09 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@d219f271711b2cf7a164e3443bead5e4957d13a8 block: 21829672
- current block number: 21895001

## Description

PermissionedDisputeGame upgraded to known version.

## Watched changes

```diff
    contract ProxyAdmin (0x11B190Ae661c6d6884dFEE48E215691E0DdB842e) {
    +++ description: None
      directlyReceivedPermissions.5.from:
-        "0x753355FE25E5592345Ac426DF2F6325E658575D1"
+        "0x846d9469BAaF481f8516f7c1d03990672B68CB09"
    }
```

```diff
-   Status: DELETED
    contract MIPS (0x16e83cE5Ce29BF90AD9Da06D2fE6a15d5f344ce4)
    +++ description: The MIPS contract is used to execute the final step of the dispute game which objectively determines the winner of the dispute.
```

```diff
    contract DisputeGameFactory (0x2c03e8BF8b16Af89079852BE87f0e9eC674a5952) {
    +++ description: The dispute game factory allows the creation of dispute games, used to propose state roots and eventually challenge them.
      values.gameImpls.1:
-        "0xeFcb9D8FD3e21346a26791359a015c2304582238"
+        "0x8090Ac33F4C9A1A220492487390dbe0c3b56a37A"
    }
```

```diff
-   Status: DELETED
    contract DelayedWETH (0x753355FE25E5592345Ac426DF2F6325E658575D1)
    +++ description: Contract designed to hold the bonded ETH for each game. It is designed as a wrapper around WETH to allow an owner to function as a backstop if a game would incorrectly distribute funds.
```

```diff
    contract AlchemyMultisig1 (0xA4fB12D15Eb85dc9284a7df0AdBC8B696EdbbF1d) {
    +++ description: None
      receivedPermissions.5.from:
-        "0x753355FE25E5592345Ac426DF2F6325E658575D1"
+        "0x846d9469BAaF481f8516f7c1d03990672B68CB09"
    }
```

```diff
-   Status: DELETED
    contract PermissionedDisputeGame (0xeFcb9D8FD3e21346a26791359a015c2304582238)
    +++ description: Same as FaultDisputeGame, but only two permissioned addresses are designated as proposer and challenger.
```

```diff
+   Status: CREATED
    contract MIPS (0x5fE03a12C1236F9C22Cb6479778DDAa4bce6299C)
    +++ description: The MIPS contract is used to execute the final step of the dispute game which objectively determines the winner of the dispute.
```

```diff
+   Status: CREATED
    contract PermissionedDisputeGame (0x8090Ac33F4C9A1A220492487390dbe0c3b56a37A)
    +++ description: Same as FaultDisputeGame, but only two permissioned addresses are designated as proposer and challenger.
```

```diff
+   Status: CREATED
    contract DelayedWETH (0x846d9469BAaF481f8516f7c1d03990672B68CB09)
    +++ description: Contract designed to hold the bonded ETH for each game. It is designed as a wrapper around WETH to allow an owner to function as a backstop if a game would incorrectly distribute funds.
```

## Source code changes

```diff
.../ethereum/{.flat@21829672 => .flat}/MIPS.sol    | 444 +++++++++++++++------
 .../PermissionedDisputeGame.sol                    | 408 +++++++++----------
 2 files changed, 507 insertions(+), 345 deletions(-)
```

Generated with discovered.json: 0x71b7102e0ff332a1aa972b3b99d8693931ea21bd

# Diff at Fri, 21 Feb 2025 09:00:03 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1cf9ec35847912163c4b663a633e258a434c0bca block: 21829672
- current block number: 21829672

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21829672 (main branch discovery), not current.

```diff
    contract L1CrossDomainMessenger (0x2b18602877181C3cB72C687E2A771E123A3788E3) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      categories:
-        ["Core"]
    }
```

```diff
    contract L1StandardBridge (0x62Edd5f4930Ea92dCa3fB81689bDD9b9d076b57B) {
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

Generated with discovered.json: 0xda0183afeacdd52205d42f7b68fd6531164f5729

# Diff at Wed, 12 Feb 2025 10:00:21 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@554a6f0e6aa688c758b37653d0be7eb446f9152e block: 21802837
- current block number: 21829672

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

Generated with discovered.json: 0x90601f582bb25fab38b63365fc407644ec211cb2

# Diff at Mon, 10 Feb 2025 19:04:34 GMT:

- author: Michał Podsiadły (<michal.podsiadly@l2beat.com>)
- comparing to: main@3756adff7c1ac86d8af3374a90a75c1999aae2b3 block: 21802837
- current block number: 21802837

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21802837 (main branch discovery), not current.

```diff
    contract SystemConfig (0xfF11e41D5C4F522E423Ff6C064Ff8D55AF8f7355) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      values.opStackDA.isUsingEigenDA:
+        false
    }
```

Generated with discovered.json: 0x88bd372ba5847bacf9e04869a98b13e04f97295b

# Diff at Sat, 08 Feb 2025 15:58:10 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@ef01ea79812e0d524af00be3fae1170cef6fd662 block: 21786508
- current block number: 21802837

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

Generated with discovered.json: 0x4f9f8df0c3b11770236173b2eaaf61339365b642

# Diff at Thu, 06 Feb 2025 09:20:44 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@fa699ce266b15edb364aa471a661f580ea1a4529 block: 21778483
- current block number: 21786508

## Description

OP Stack SC signer rotation. Ignored permissioned games count manually.

## Watched changes

```diff
    contract SecurityCouncilMultisig (0xc2819DC788505Aac350142A7A707BF9D03E3Bd03) {
    +++ description: None
      values.$members.9:
-        "0x8Afe777B5A4D1e156435ab44Ad4b73A318cE0EA4"
+        "0x0aA384EB2fedD2741277A0f72909A0d7275575D7"
    }
```

Generated with discovered.json: 0x0bb7f1bd068fba5f1baee6e37857fcf15d1599b5

# Diff at Wed, 05 Feb 2025 06:24:28 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@24a3610845e7ae2b3cc2daf90feff25e498e4068 block: 21080599
- current block number: 21778483

## Description

Upgrade to OptiPortal2 and permissioned proofs.

## Watched changes

```diff
    contract ProxyAdmin (0x11B190Ae661c6d6884dFEE48E215691E0DdB842e) {
    +++ description: None
      directlyReceivedPermissions.8:
+        {"permission":"upgrade","from":"0xfF11e41D5C4F522E423Ff6C064Ff8D55AF8f7355"}
      directlyReceivedPermissions.7.from:
-        "0xfF11e41D5C4F522E423Ff6C064Ff8D55AF8f7355"
+        "0xEB06fFa16011B5628BaB98E29776361c83741dd3"
      directlyReceivedPermissions.6.from:
-        "0xEB06fFa16011B5628BaB98E29776361c83741dd3"
+        "0xe9d3E49b0636016c5fE9eaA2347948D0bA9f15Af"
      directlyReceivedPermissions.5.from:
-        "0xe9d3E49b0636016c5fE9eaA2347948D0bA9f15Af"
+        "0x753355FE25E5592345Ac426DF2F6325E658575D1"
      directlyReceivedPermissions.4.from:
-        "0x6Ef8c69CfE4635d866e3E02732068022c06e724D"
+        "0x6ace93AF6E8b36803577381be9f02A552e81C10D"
      directlyReceivedPermissions.1.from:
-        "0x125664BEf08177ca43f6f301E63118b1e4cCDe09"
+        "0x2c03e8BF8b16Af89079852BE87f0e9eC674a5952"
    }
```

```diff
-   Status: DELETED
    contract SuperchainConfig (0x125664BEf08177ca43f6f301E63118b1e4cCDe09)
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
```

```diff
    contract L1CrossDomainMessenger (0x2b18602877181C3cB72C687E2A771E123A3788E3) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      values.$implementation:
-        "0xAEfEA5D2Dd3B9A05a67FBD5E7C06c19151A7fe50"
+        "0xD3494713A5cfaD3F5359379DfA074E2Ac8C6Fd65"
      values.$pastUpgrades.2:
+        ["2025-02-04T20:28:23.000Z","0x2f29cb5a59d7e7d132eb7afe57d9bf12df3db311db4ef5c5079f9043660635df",["0xD3494713A5cfaD3F5359379DfA074E2Ac8C6Fd65"]]
      values.$pastUpgrades.1:
+        ["2025-02-04T20:28:23.000Z","0x2f29cb5a59d7e7d132eb7afe57d9bf12df3db311db4ef5c5079f9043660635df",["0xd81f43eDBCAcb4c29a9bA38a13Ee5d79278270cC"]]
      values.$upgradeCount:
-        1
+        3
      values.superchainConfig:
-        "0x125664BEf08177ca43f6f301E63118b1e4cCDe09"
+        "0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
    }
```

```diff
    contract OptimismMintableERC20Factory (0x319322906beAdf69dF5d4607169c63D692B1aDC1) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      values.$implementation:
-        "0x70201b22244D19fc52c2D09DC3e06c6cD2819067"
+        "0xE01efbeb1089D1d1dB9c6c8b135C934C0734c846"
      values.$pastUpgrades.1:
+        ["2025-02-04T20:28:23.000Z","0x2f29cb5a59d7e7d132eb7afe57d9bf12df3db311db4ef5c5079f9043660635df",["0xE01efbeb1089D1d1dB9c6c8b135C934C0734c846"]]
      values.$upgradeCount:
-        1
+        2
    }
```

```diff
    contract L1StandardBridge (0x62Edd5f4930Ea92dCa3fB81689bDD9b9d076b57B) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      values.$implementation:
-        "0x5B0dE7F3CC36E5b4AF6580Ae7149Afad3E3C94D4"
+        "0x64B5a5Ed26DCb17370Ff4d33a8D503f0fbD06CfF"
      values.superchainConfig:
-        "0x125664BEf08177ca43f6f301E63118b1e4cCDe09"
+        "0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
    }
```

```diff
-   Status: DELETED
    contract L2OutputOracle (0x6Ef8c69CfE4635d866e3E02732068022c06e724D)
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
```

```diff
    contract AlchemyMultisig1 (0xA4fB12D15Eb85dc9284a7df0AdBC8B696EdbbF1d) {
    +++ description: None
      receivedPermissions.8:
+        {"permission":"upgrade","from":"0xfF11e41D5C4F522E423Ff6C064Ff8D55AF8f7355","via":[{"address":"0x11B190Ae661c6d6884dFEE48E215691E0DdB842e"}]}
      receivedPermissions.7.from:
-        "0xfF11e41D5C4F522E423Ff6C064Ff8D55AF8f7355"
+        "0xEB06fFa16011B5628BaB98E29776361c83741dd3"
      receivedPermissions.6.from:
-        "0xEB06fFa16011B5628BaB98E29776361c83741dd3"
+        "0xe9d3E49b0636016c5fE9eaA2347948D0bA9f15Af"
      receivedPermissions.5.from:
-        "0xe9d3E49b0636016c5fE9eaA2347948D0bA9f15Af"
+        "0x753355FE25E5592345Ac426DF2F6325E658575D1"
      receivedPermissions.4.from:
-        "0x6Ef8c69CfE4635d866e3E02732068022c06e724D"
+        "0x6ace93AF6E8b36803577381be9f02A552e81C10D"
      receivedPermissions.1.from:
-        "0x125664BEf08177ca43f6f301E63118b1e4cCDe09"
+        "0x2c03e8BF8b16Af89079852BE87f0e9eC674a5952"
    }
```

```diff
    contract L1ERC721Bridge (0xe9d3E49b0636016c5fE9eaA2347948D0bA9f15Af) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      values.$implementation:
-        "0x5cBe8a4463370e38AcE1406875872eF38342a1c6"
+        "0xAE2AF01232a6c4a4d3012C5eC5b1b35059caF10d"
      values.$pastUpgrades.2:
+        ["2025-02-04T20:28:23.000Z","0x2f29cb5a59d7e7d132eb7afe57d9bf12df3db311db4ef5c5079f9043660635df",["0xAE2AF01232a6c4a4d3012C5eC5b1b35059caF10d"]]
      values.$pastUpgrades.1:
+        ["2025-02-04T20:28:23.000Z","0x2f29cb5a59d7e7d132eb7afe57d9bf12df3db311db4ef5c5079f9043660635df",["0xd81f43eDBCAcb4c29a9bA38a13Ee5d79278270cC"]]
      values.$upgradeCount:
-        1
+        3
      values.superchainConfig:
-        "0x125664BEf08177ca43f6f301E63118b1e4cCDe09"
+        "0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
    }
```

```diff
    contract OptimismPortal2 (0xEB06fFa16011B5628BaB98E29776361c83741dd3) {
    +++ description: The OptimismPortal contract is the main entry point to deposit funds from L1 to L2. It also allows to prove and finalize withdrawals. It specifies which game type can be used for withdrawals, which currently is the PermissionedDisputeGame.
      name:
-        "OptimismPortal"
+        "OptimismPortal2"
      template:
-        "opstack/OptimismPortal"
+        "opstack/OptimismPortal2"
      sourceHashes.1:
-        "0x90ab8a3636fafa5cb0ab4305b2d912546ceb47ebc3abed324bfa1727a9c74acc"
+        "0x41be46bdb67af1b7af90e1bd70a1fcd31a3352282beb83b846a5189675c37ac1"
      description:
-        "The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals."
+        "The OptimismPortal contract is the main entry point to deposit funds from L1 to L2. It also allows to prove and finalize withdrawals. It specifies which game type can be used for withdrawals, which currently is the PermissionedDisputeGame."
      issuedPermissions.1:
-        {"permission":"upgrade","to":"0xA4fB12D15Eb85dc9284a7df0AdBC8B696EdbbF1d","via":[{"address":"0x11B190Ae661c6d6884dFEE48E215691E0DdB842e"}]}
      issuedPermissions.0.permission:
-        "guard"
+        "upgrade"
      issuedPermissions.0.to:
-        "0xee1Af3f99AF8C5b93512FbE2A3f0dD5568CE087f"
+        "0xA4fB12D15Eb85dc9284a7df0AdBC8B696EdbbF1d"
      issuedPermissions.0.via.0:
+        {"address":"0x11B190Ae661c6d6884dFEE48E215691E0DdB842e"}
      values.$implementation:
-        "0x3Db18Ba41E7F377fa2603D2B500f40CF82683b78"
+        "0xe2F826324b2faf99E513D16D266c3F80aE87832B"
      values.$pastUpgrades.2:
+        ["2025-02-04T20:28:23.000Z","0x2f29cb5a59d7e7d132eb7afe57d9bf12df3db311db4ef5c5079f9043660635df",["0xe2F826324b2faf99E513D16D266c3F80aE87832B"]]
      values.$pastUpgrades.1:
+        ["2025-02-04T20:28:23.000Z","0x2f29cb5a59d7e7d132eb7afe57d9bf12df3db311db4ef5c5079f9043660635df",["0xd81f43eDBCAcb4c29a9bA38a13Ee5d79278270cC"]]
      values.$upgradeCount:
-        1
+        3
      values.guardian:
-        "0xee1Af3f99AF8C5b93512FbE2A3f0dD5568CE087f"
+        "0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2"
      values.l2Oracle:
-        "0x6Ef8c69CfE4635d866e3E02732068022c06e724D"
      values.superchainConfig:
-        "0x125664BEf08177ca43f6f301E63118b1e4cCDe09"
+        "0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
      values.version:
-        "2.6.0"
+        "3.10.0"
      values.disputeGameFactory:
+        "0x2c03e8BF8b16Af89079852BE87f0e9eC674a5952"
      values.disputeGameFinalityDelaySeconds:
+        302400
      values.proofMaturityDelaySeconds:
+        604800
      values.RespectedGameString:
+        "PermissionedDisputeGame"
      values.respectedGameType:
+        1
      values.respectedGameTypeUpdatedAt:
+        1738700903
      displayName:
+        "OptimismPortal"
      fieldMeta:
+        {"paused":{"severity":"HIGH","description":"Whether the contract is paused or not. Determined by the SuperchainConfig contract PAUSED_SLOT. Here it pauses withdrawals. If this is paused, also the L1CrossDomainMessenger and ERC-20, ERC-721 deposits are paused."}}
      usedTypes:
+        [{"typeCaster":"Mapping","arg":{"0":"FaultDisputeGame","1":"PermissionedDisputeGame"}}]
    }
```

```diff
    contract SystemConfig (0xfF11e41D5C4F522E423Ff6C064Ff8D55AF8f7355) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      sourceHashes.1:
-        "0xdf9a11b46747139bfe0135df8a65a2728a2dbd60a689e2398c45627915cdd752"
+        "0xbbb92920a096eced30e3ce67bbc443f134b217e8847433fbb192ecb9fdddcbc2"
      values.$implementation:
-        "0x8174764Ae82696D232D5C93FEA6A006b1286dC4a"
+        "0xF56D96B2535B932656d3c04Ebf51baBff241D886"
      values.$pastUpgrades.2:
+        ["2025-02-04T20:28:23.000Z","0x2f29cb5a59d7e7d132eb7afe57d9bf12df3db311db4ef5c5079f9043660635df",["0xF56D96B2535B932656d3c04Ebf51baBff241D886"]]
      values.$pastUpgrades.1:
+        ["2025-02-04T20:28:23.000Z","0x2f29cb5a59d7e7d132eb7afe57d9bf12df3db311db4ef5c5079f9043660635df",["0xd81f43eDBCAcb4c29a9bA38a13Ee5d79278270cC"]]
      values.$upgradeCount:
-        1
+        3
      values.L2_OUTPUT_ORACLE_SLOT:
-        "0xe52a667f71ec761b9b381c7b76ca9b852adf7e8905da0e0ad49986a0a6871815"
      values.l2OutputOracle:
-        "0x6Ef8c69CfE4635d866e3E02732068022c06e724D"
      values.version:
-        "1.12.0"
+        "2.2.0"
      values.DISPUTE_GAME_FACTORY_SLOT:
+        "0x52322a25d9f59ea17656545543306b7aef62bc0cc53a0e65ccfa0c75b97aa906"
      values.disputeGameFactory:
+        "0x2c03e8BF8b16Af89079852BE87f0e9eC674a5952"
      values.maximumGasLimit:
+        200000000
    }
```

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
    contract DisputeGameFactory (0x2c03e8BF8b16Af89079852BE87f0e9eC674a5952)
    +++ description: The dispute game factory allows the creation of dispute games, used to propose state roots and eventually challenge them.
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
    contract AnchorStateRegistry (0x6ace93AF6E8b36803577381be9f02A552e81C10D)
    +++ description: Contains the latest confirmed state root that can be used as a starting point in a dispute game.
```

```diff
+   Status: CREATED
    contract DelayedWETH (0x753355FE25E5592345Ac426DF2F6325E658575D1)
    +++ description: Contract designed to hold the bonded ETH for each game. It is designed as a wrapper around WETH to allow an owner to function as a backstop if a game would incorrectly distribute funds.
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
    contract PermissionedDisputeGame (0xeFcb9D8FD3e21346a26791359a015c2304582238)
    +++ description: Same as FaultDisputeGame, but only two permissioned addresses are designated as proposer and challenger.
```

## Source code changes

```diff
.../AnchorStateRegistry/AnchorStateRegistry.sol    |  448 +++
 .../AnchorStateRegistry}/Proxy.p.sol               |    0
 .../ethereum/.flat/DelayedWETH/DelayedWETH.sol     |  651 ++++
 .../DelayedWETH}/Proxy.p.sol                       |    0
 .../shape/ethereum/.flat/DeputyGuardianModule.sol  |  156 +
 .../DisputeGameFactory/DisputeGameFactory.sol      | 1550 ++++++++
 .../ethereum/.flat/DisputeGameFactory/Proxy.p.sol  |  200 +
 .../shape/ethereum/.flat/GnosisSafe/GnosisSafe.sol |  953 +++++
 .../.flat/GnosisSafe/GnosisSafeProxy.p.sol         |   35 +
 .../L2OutputOracle/L2OutputOracle.sol => /dev/null |  679 ----
 .../shape/ethereum/.flat/Lib_AddressManager.sol    |  152 +
 .../shape/ethereum/.flat/LivenessGuard.sol         |  582 +++
 .../shape/ethereum/.flat/LivenessModule.sol        |  258 ++
 .../shape/ethereum/.flat/MIPS.sol                  | 1517 ++++++++
 .../OpFoundationOperationsSafe/GnosisSafe.sol      |  959 +++++
 .../.flat/OpFoundationOperationsSafe/Proxy.p.sol   |   39 +
 .../.flat/OpFoundationUpgradeSafe/GnosisSafe.sol   |  953 +++++
 .../OpFoundationUpgradeSafe/GnosisSafeProxy.p.sol  |   35 +
 .../OptimismPortal2/OptimismPortal2.sol}           |  408 +-
 .../ethereum/.flat/OptimismPortal2/Proxy.p.sol     |  200 +
 .../ethereum/.flat/PermissionedDisputeGame.sol     | 4074 ++++++++++++++++++++
 .../shape/ethereum/.flat/PreimageOracle.sol        | 1353 +++++++
 .../.flat/SecurityCouncilMultisig/GnosisSafe.sol   |  953 +++++
 .../SecurityCouncilMultisig/GnosisSafeProxy.p.sol  |   35 +
 .../SuperchainGuardianMultisig/GnosisSafe.sol      |  953 +++++
 .../GnosisSafeProxy.p.sol                          |   35 +
 .../shape/ethereum/.flat/SuperchainProxyAdmin.sol  |  298 ++
 .../.flat/SuperchainProxyAdminOwner/GnosisSafe.sol |  953 +++++
 .../GnosisSafeProxy.p.sol                          |   35 +
 .../SystemConfig/SystemConfig.sol                  |   48 +-
 30 files changed, 17665 insertions(+), 847 deletions(-)
```

Generated with discovered.json: 0x563c869bdef59ca1935387e06fc1c22834b0ef95

# Diff at Tue, 04 Feb 2025 12:31:58 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@145553eed7ba44636411ecb25e4099728acd02f9 block: 21080599
- current block number: 21080599

## Description

Rename 'configure' permission to 'interact'

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21080599 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x11B190Ae661c6d6884dFEE48E215691E0DdB842e) {
    +++ description: None
      directlyReceivedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract AlchemyMultisig1 (0xA4fB12D15Eb85dc9284a7df0AdBC8B696EdbbF1d) {
    +++ description: None
      receivedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract AddressManager (0xcee78437aE9e15cee9c78E63757E0153c0FD7479) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      issuedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract SystemConfig (0xfF11e41D5C4F522E423Ff6C064Ff8D55AF8f7355) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      issuedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

Generated with discovered.json: 0x94a5184d4b5cee757f3b929e2c0995471185a43f

# Diff at Fri, 24 Jan 2025 10:54:04 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@fff69b1db37918a5360f1e3b59d2f37be25d166f block: 21080599
- current block number: 21080599

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21080599 (main branch discovery), not current.

```diff
    contract AlchemyMultisig1 (0xA4fB12D15Eb85dc9284a7df0AdBC8B696EdbbF1d) {
    +++ description: None
      name:
-        "ShapeMultisig"
+        "AlchemyMultisig1"
    }
```

Generated with discovered.json: 0x30ffb1d3f623302f755781864733fa26f4bd3507

# Diff at Mon, 20 Jan 2025 11:10:01 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@2c8b4f3d9910bb6371be9b4df87b70856e7d8c64 block: 21080599
- current block number: 21080599

## Description

Rerun on the same block number. Applies fixes to permissions and via field. Renames permission's target to to/from.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21080599 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x11B190Ae661c6d6884dFEE48E215691E0DdB842e) {
    +++ description: None
      directlyReceivedPermissions.7.target:
-        "0xfF11e41D5C4F522E423Ff6C064Ff8D55AF8f7355"
      directlyReceivedPermissions.7.from:
+        "0xfF11e41D5C4F522E423Ff6C064Ff8D55AF8f7355"
      directlyReceivedPermissions.6.target:
-        "0xEB06fFa16011B5628BaB98E29776361c83741dd3"
      directlyReceivedPermissions.6.from:
+        "0xEB06fFa16011B5628BaB98E29776361c83741dd3"
      directlyReceivedPermissions.5.target:
-        "0xe9d3E49b0636016c5fE9eaA2347948D0bA9f15Af"
      directlyReceivedPermissions.5.from:
+        "0xe9d3E49b0636016c5fE9eaA2347948D0bA9f15Af"
      directlyReceivedPermissions.4.target:
-        "0x6Ef8c69CfE4635d866e3E02732068022c06e724D"
      directlyReceivedPermissions.4.from:
+        "0x6Ef8c69CfE4635d866e3E02732068022c06e724D"
      directlyReceivedPermissions.3.target:
-        "0x62Edd5f4930Ea92dCa3fB81689bDD9b9d076b57B"
      directlyReceivedPermissions.3.from:
+        "0x62Edd5f4930Ea92dCa3fB81689bDD9b9d076b57B"
      directlyReceivedPermissions.2.target:
-        "0x319322906beAdf69dF5d4607169c63D692B1aDC1"
      directlyReceivedPermissions.2.from:
+        "0x319322906beAdf69dF5d4607169c63D692B1aDC1"
      directlyReceivedPermissions.1.target:
-        "0x125664BEf08177ca43f6f301E63118b1e4cCDe09"
      directlyReceivedPermissions.1.from:
+        "0x125664BEf08177ca43f6f301E63118b1e4cCDe09"
      directlyReceivedPermissions.0.target:
-        "0xcee78437aE9e15cee9c78E63757E0153c0FD7479"
      directlyReceivedPermissions.0.from:
+        "0xcee78437aE9e15cee9c78E63757E0153c0FD7479"
    }
```

```diff
    contract SuperchainConfig (0x125664BEf08177ca43f6f301E63118b1e4cCDe09) {
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      issuedPermissions.1.target:
-        "0xA4fB12D15Eb85dc9284a7df0AdBC8B696EdbbF1d"
      issuedPermissions.1.via.0.delay:
-        0
      issuedPermissions.1.to:
+        "0xA4fB12D15Eb85dc9284a7df0AdBC8B696EdbbF1d"
      issuedPermissions.0.target:
-        "0xee1Af3f99AF8C5b93512FbE2A3f0dD5568CE087f"
      issuedPermissions.0.to:
+        "0xee1Af3f99AF8C5b93512FbE2A3f0dD5568CE087f"
    }
```

```diff
    contract OptimismMintableERC20Factory (0x319322906beAdf69dF5d4607169c63D692B1aDC1) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      issuedPermissions.0.target:
-        "0xA4fB12D15Eb85dc9284a7df0AdBC8B696EdbbF1d"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0xA4fB12D15Eb85dc9284a7df0AdBC8B696EdbbF1d"
    }
```

```diff
    contract L1StandardBridge (0x62Edd5f4930Ea92dCa3fB81689bDD9b9d076b57B) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      issuedPermissions.0.target:
-        "0xA4fB12D15Eb85dc9284a7df0AdBC8B696EdbbF1d"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.via.0.description:
-        "upgrading the bridge implementation can give access to all funds escrowed therein."
      issuedPermissions.0.to:
+        "0xA4fB12D15Eb85dc9284a7df0AdBC8B696EdbbF1d"
      issuedPermissions.0.description:
+        "upgrading the bridge implementation can give access to all funds escrowed therein."
    }
```

```diff
    contract L2OutputOracle (0x6Ef8c69CfE4635d866e3E02732068022c06e724D) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      issuedPermissions.2.target:
-        "0xA4fB12D15Eb85dc9284a7df0AdBC8B696EdbbF1d"
      issuedPermissions.2.via.0.delay:
-        0
      issuedPermissions.2.to:
+        "0xA4fB12D15Eb85dc9284a7df0AdBC8B696EdbbF1d"
      issuedPermissions.1.target:
-        "0x0D8a607F3d2de86adD04Df00f06794cB339A40de"
      issuedPermissions.1.to:
+        "0x0D8a607F3d2de86adD04Df00f06794cB339A40de"
      issuedPermissions.0.target:
-        "0xee1Af3f99AF8C5b93512FbE2A3f0dD5568CE087f"
      issuedPermissions.0.to:
+        "0xee1Af3f99AF8C5b93512FbE2A3f0dD5568CE087f"
    }
```

```diff
    contract ShapeMultisig (0xA4fB12D15Eb85dc9284a7df0AdBC8B696EdbbF1d) {
    +++ description: None
      receivedPermissions.7.target:
-        "0xfF11e41D5C4F522E423Ff6C064Ff8D55AF8f7355"
      receivedPermissions.7.from:
+        "0xfF11e41D5C4F522E423Ff6C064Ff8D55AF8f7355"
      receivedPermissions.6.target:
-        "0xEB06fFa16011B5628BaB98E29776361c83741dd3"
      receivedPermissions.6.from:
+        "0xEB06fFa16011B5628BaB98E29776361c83741dd3"
      receivedPermissions.5.target:
-        "0xe9d3E49b0636016c5fE9eaA2347948D0bA9f15Af"
      receivedPermissions.5.from:
+        "0xe9d3E49b0636016c5fE9eaA2347948D0bA9f15Af"
      receivedPermissions.4.target:
-        "0x6Ef8c69CfE4635d866e3E02732068022c06e724D"
      receivedPermissions.4.from:
+        "0x6Ef8c69CfE4635d866e3E02732068022c06e724D"
      receivedPermissions.3.target:
-        "0x62Edd5f4930Ea92dCa3fB81689bDD9b9d076b57B"
      receivedPermissions.3.from:
+        "0x62Edd5f4930Ea92dCa3fB81689bDD9b9d076b57B"
      receivedPermissions.2.target:
-        "0x319322906beAdf69dF5d4607169c63D692B1aDC1"
      receivedPermissions.2.from:
+        "0x319322906beAdf69dF5d4607169c63D692B1aDC1"
      receivedPermissions.1.target:
-        "0x125664BEf08177ca43f6f301E63118b1e4cCDe09"
      receivedPermissions.1.from:
+        "0x125664BEf08177ca43f6f301E63118b1e4cCDe09"
      receivedPermissions.0.target:
-        "0xcee78437aE9e15cee9c78E63757E0153c0FD7479"
      receivedPermissions.0.from:
+        "0xcee78437aE9e15cee9c78E63757E0153c0FD7479"
      directlyReceivedPermissions.0.target:
-        "0x11B190Ae661c6d6884dFEE48E215691E0DdB842e"
      directlyReceivedPermissions.0.from:
+        "0x11B190Ae661c6d6884dFEE48E215691E0DdB842e"
    }
```

```diff
    contract AddressManager (0xcee78437aE9e15cee9c78E63757E0153c0FD7479) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      issuedPermissions.0.target:
-        "0xA4fB12D15Eb85dc9284a7df0AdBC8B696EdbbF1d"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.via.0.description:
-        "set and change address mappings."
      issuedPermissions.0.to:
+        "0xA4fB12D15Eb85dc9284a7df0AdBC8B696EdbbF1d"
      issuedPermissions.0.description:
+        "set and change address mappings."
    }
```

```diff
    contract L1ERC721Bridge (0xe9d3E49b0636016c5fE9eaA2347948D0bA9f15Af) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      issuedPermissions.0.target:
-        "0xA4fB12D15Eb85dc9284a7df0AdBC8B696EdbbF1d"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0xA4fB12D15Eb85dc9284a7df0AdBC8B696EdbbF1d"
    }
```

```diff
    contract OptimismPortal (0xEB06fFa16011B5628BaB98E29776361c83741dd3) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      issuedPermissions.1.target:
-        "0xA4fB12D15Eb85dc9284a7df0AdBC8B696EdbbF1d"
      issuedPermissions.1.via.0.delay:
-        0
      issuedPermissions.1.to:
+        "0xA4fB12D15Eb85dc9284a7df0AdBC8B696EdbbF1d"
      issuedPermissions.0.target:
-        "0xee1Af3f99AF8C5b93512FbE2A3f0dD5568CE087f"
      issuedPermissions.0.to:
+        "0xee1Af3f99AF8C5b93512FbE2A3f0dD5568CE087f"
    }
```

```diff
    contract SystemConfig (0xfF11e41D5C4F522E423Ff6C064Ff8D55AF8f7355) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      issuedPermissions.2.target:
-        "0xA4fB12D15Eb85dc9284a7df0AdBC8B696EdbbF1d"
      issuedPermissions.2.via.0.delay:
-        0
      issuedPermissions.2.to:
+        "0xA4fB12D15Eb85dc9284a7df0AdBC8B696EdbbF1d"
      issuedPermissions.1.target:
-        "0xF7ca543d652E38692fD12f989eb55b5327eC9A20"
      issuedPermissions.1.to:
+        "0xF7ca543d652E38692fD12f989eb55b5327eC9A20"
      issuedPermissions.0.target:
-        "0xee1Af3f99AF8C5b93512FbE2A3f0dD5568CE087f"
      issuedPermissions.0.to:
+        "0xee1Af3f99AF8C5b93512FbE2A3f0dD5568CE087f"
      issuedPermissions.0.description:
+        "it can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system."
    }
```

Generated with discovered.json: 0x2cd9f040f9ea2a25b4b2d26405262f84c225623e

# Diff at Wed, 08 Jan 2025 09:06:59 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@deefa974378c2cd6b74f061e1f5a494bbbe1d63a block: 21080599
- current block number: 21080599

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21080599 (main branch discovery), not current.

```diff
    contract L1StandardBridge (0x62Edd5f4930Ea92dCa3fB81689bDD9b9d076b57B) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      description:
-        "The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token."
+        "The main entry point to deposit ERC20 tokens from host chain to this chain."
    }
```

Generated with discovered.json: 0x678f29dc48de902c4a772dd221be85fcae8baa1f

# Diff at Fri, 01 Nov 2024 12:24:04 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@cd1f0e71bb08ce16b2084a11b768538e8aa6ba8c block: 21080599
- current block number: 21080599

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21080599 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x11B190Ae661c6d6884dFEE48E215691E0DdB842e) {
    +++ description: None
      directlyReceivedPermissions.3.description:
-        "upgrading bridge implementation allows to access all funds and change every system component."
+        "upgrading the bridge implementation can give access to all funds escrowed therein."
    }
```

```diff
    contract SuperchainConfig (0x125664BEf08177ca43f6f301E63118b1e4cCDe09) {
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      description:
-        "This is NOT the shared SuperchainConfig of the OP stack Superchain. This SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system."
+        "This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system."
    }
```

```diff
    contract L1StandardBridge (0x62Edd5f4930Ea92dCa3fB81689bDD9b9d076b57B) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token.
      issuedPermissions.0.via.0.description:
-        "upgrading bridge implementation allows to access all funds and change every system component."
+        "upgrading the bridge implementation can give access to all funds escrowed therein."
    }
```

```diff
    contract ShapeMultisig (0xA4fB12D15Eb85dc9284a7df0AdBC8B696EdbbF1d) {
    +++ description: None
      receivedPermissions.3.description:
-        "upgrading bridge implementation allows to access all funds and change every system component."
+        "upgrading the bridge implementation can give access to all funds escrowed therein."
    }
```

Generated with discovered.json: 0x39ecb14810ed4c9c8150c10b6d44fef2197d999a

# Diff at Wed, 30 Oct 2024 19:40:16 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@35a03ca692bdeb6d3ac713174a7a196c73e4a9de block: 21065298
- current block number: 21080599

## Description

Shape switches the ProxyAdmin owner to a 3/6 multisig. EOA warning removed.

## Watched changes

```diff
    contract ProxyAdmin (0x11B190Ae661c6d6884dFEE48E215691E0DdB842e) {
    +++ description: None
      values.owner:
-        "0xacAF178b5048CB56712dc59E95fBA72F7990A005"
+        "0xA4fB12D15Eb85dc9284a7df0AdBC8B696EdbbF1d"
    }
```

```diff
    contract SuperchainConfig (0x125664BEf08177ca43f6f301E63118b1e4cCDe09) {
    +++ description: This is NOT the shared SuperchainConfig of the OP stack Superchain. This SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      issuedPermissions.1.target:
-        "0xee1Af3f99AF8C5b93512FbE2A3f0dD5568CE087f"
+        "0xA4fB12D15Eb85dc9284a7df0AdBC8B696EdbbF1d"
      issuedPermissions.1.via.1:
-        {"address":"0x11B190Ae661c6d6884dFEE48E215691E0DdB842e","delay":0}
      issuedPermissions.1.via.0.address:
-        "0xacAF178b5048CB56712dc59E95fBA72F7990A005"
+        "0x11B190Ae661c6d6884dFEE48E215691E0DdB842e"
    }
```

```diff
    contract OptimismMintableERC20Factory (0x319322906beAdf69dF5d4607169c63D692B1aDC1) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      issuedPermissions.0.target:
-        "0xee1Af3f99AF8C5b93512FbE2A3f0dD5568CE087f"
+        "0xA4fB12D15Eb85dc9284a7df0AdBC8B696EdbbF1d"
      issuedPermissions.0.via.1:
-        {"address":"0x11B190Ae661c6d6884dFEE48E215691E0DdB842e","delay":0}
      issuedPermissions.0.via.0.address:
-        "0xacAF178b5048CB56712dc59E95fBA72F7990A005"
+        "0x11B190Ae661c6d6884dFEE48E215691E0DdB842e"
    }
```

```diff
    contract L1StandardBridge (0x62Edd5f4930Ea92dCa3fB81689bDD9b9d076b57B) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token.
      issuedPermissions.0.target:
-        "0xee1Af3f99AF8C5b93512FbE2A3f0dD5568CE087f"
+        "0xA4fB12D15Eb85dc9284a7df0AdBC8B696EdbbF1d"
      issuedPermissions.0.via.1:
-        {"address":"0x11B190Ae661c6d6884dFEE48E215691E0DdB842e","delay":0,"description":"upgrading bridge implementation allows to access all funds and change every system component."}
      issuedPermissions.0.via.0.address:
-        "0xacAF178b5048CB56712dc59E95fBA72F7990A005"
+        "0x11B190Ae661c6d6884dFEE48E215691E0DdB842e"
      issuedPermissions.0.via.0.description:
+        "upgrading bridge implementation allows to access all funds and change every system component."
    }
```

```diff
    contract L2OutputOracle (0x6Ef8c69CfE4635d866e3E02732068022c06e724D) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      issuedPermissions.2.target:
-        "0xee1Af3f99AF8C5b93512FbE2A3f0dD5568CE087f"
+        "0xA4fB12D15Eb85dc9284a7df0AdBC8B696EdbbF1d"
      issuedPermissions.2.via.1:
-        {"address":"0x11B190Ae661c6d6884dFEE48E215691E0DdB842e","delay":0}
      issuedPermissions.2.via.0.address:
-        "0xacAF178b5048CB56712dc59E95fBA72F7990A005"
+        "0x11B190Ae661c6d6884dFEE48E215691E0DdB842e"
    }
```

```diff
-   Status: DELETED
    contract GnosisSafe (0xacAF178b5048CB56712dc59E95fBA72F7990A005)
    +++ description: None
```

```diff
    contract AddressManager (0xcee78437aE9e15cee9c78E63757E0153c0FD7479) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      issuedPermissions.0.target:
-        "0xee1Af3f99AF8C5b93512FbE2A3f0dD5568CE087f"
+        "0xA4fB12D15Eb85dc9284a7df0AdBC8B696EdbbF1d"
      issuedPermissions.0.via.1:
-        {"address":"0x11B190Ae661c6d6884dFEE48E215691E0DdB842e","delay":0,"description":"set and change address mappings."}
      issuedPermissions.0.via.0.address:
-        "0xacAF178b5048CB56712dc59E95fBA72F7990A005"
+        "0x11B190Ae661c6d6884dFEE48E215691E0DdB842e"
      issuedPermissions.0.via.0.description:
+        "set and change address mappings."
    }
```

```diff
    contract L1ERC721Bridge (0xe9d3E49b0636016c5fE9eaA2347948D0bA9f15Af) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      issuedPermissions.0.target:
-        "0xee1Af3f99AF8C5b93512FbE2A3f0dD5568CE087f"
+        "0xA4fB12D15Eb85dc9284a7df0AdBC8B696EdbbF1d"
      issuedPermissions.0.via.1:
-        {"address":"0x11B190Ae661c6d6884dFEE48E215691E0DdB842e","delay":0}
      issuedPermissions.0.via.0.address:
-        "0xacAF178b5048CB56712dc59E95fBA72F7990A005"
+        "0x11B190Ae661c6d6884dFEE48E215691E0DdB842e"
    }
```

```diff
    contract OptimismPortal (0xEB06fFa16011B5628BaB98E29776361c83741dd3) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      issuedPermissions.1.target:
-        "0xee1Af3f99AF8C5b93512FbE2A3f0dD5568CE087f"
+        "0xA4fB12D15Eb85dc9284a7df0AdBC8B696EdbbF1d"
      issuedPermissions.1.via.1:
-        {"address":"0x11B190Ae661c6d6884dFEE48E215691E0DdB842e","delay":0}
      issuedPermissions.1.via.0.address:
-        "0xacAF178b5048CB56712dc59E95fBA72F7990A005"
+        "0x11B190Ae661c6d6884dFEE48E215691E0DdB842e"
    }
```

```diff
    contract SystemConfig (0xfF11e41D5C4F522E423Ff6C064Ff8D55AF8f7355) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      issuedPermissions.2.target:
-        "0xee1Af3f99AF8C5b93512FbE2A3f0dD5568CE087f"
+        "0xA4fB12D15Eb85dc9284a7df0AdBC8B696EdbbF1d"
      issuedPermissions.2.via.1:
-        {"address":"0x11B190Ae661c6d6884dFEE48E215691E0DdB842e","delay":0}
      issuedPermissions.2.via.0.address:
-        "0xacAF178b5048CB56712dc59E95fBA72F7990A005"
+        "0x11B190Ae661c6d6884dFEE48E215691E0DdB842e"
    }
```

```diff
+   Status: CREATED
    contract ShapeMultisig (0xA4fB12D15Eb85dc9284a7df0AdBC8B696EdbbF1d)
    +++ description: None
```

## Source code changes

```diff
.../{.flat@21065298/GnosisSafe => .flat/ShapeMultisig}/GnosisSafe.sol     | 0
 .../GnosisSafe => .flat/ShapeMultisig}/GnosisSafeProxy.p.sol              | 0
 2 files changed, 0 insertions(+), 0 deletions(-)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21065298 (main branch discovery), not current.

```diff
    contract GnosisSafe (0xacAF178b5048CB56712dc59E95fBA72F7990A005) {
    +++ description: None
      name:
-        "ShapeMultisig"
+        "GnosisSafe"
    }
```

Generated with discovered.json: 0x2bdd7db42436b16052a7763488380979b6e85e5c

# Diff at Tue, 29 Oct 2024 13:17:47 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@7b3fc9dc9074e1d423b48522c3f0273c86aab54a block: 21065298
- current block number: 21065298

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21065298 (main branch discovery), not current.

```diff
    contract L2OutputOracle (0x6Ef8c69CfE4635d866e3E02732068022c06e724D) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      fieldMeta:
+        {"FINALIZATION_PERIOD_SECONDS":{"description":"Challenge period (Number of seconds until a state root is finalized)."}}
    }
```

Generated with discovered.json: 0x59f5c1563ea358ac473956b2ebb44a8a48245f23

# Diff at Mon, 28 Oct 2024 16:23:35 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- current block number: 21065298

## Description

Initial discovery: Standard OP stack rollup with EOA admin. (alchemy)

## Initial discovery

```diff
+   Status: CREATED
    contract ProxyAdmin (0x11B190Ae661c6d6884dFEE48E215691E0DdB842e)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SuperchainConfig (0x125664BEf08177ca43f6f301E63118b1e4cCDe09)
    +++ description: This is NOT the shared SuperchainConfig of the OP stack Superchain. This SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
```

```diff
+   Status: CREATED
    contract L1CrossDomainMessenger (0x2b18602877181C3cB72C687E2A771E123A3788E3)
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
```

```diff
+   Status: CREATED
    contract OptimismMintableERC20Factory (0x319322906beAdf69dF5d4607169c63D692B1aDC1)
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
```

```diff
+   Status: CREATED
    contract L1StandardBridge (0x62Edd5f4930Ea92dCa3fB81689bDD9b9d076b57B)
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token.
```

```diff
+   Status: CREATED
    contract L2OutputOracle (0x6Ef8c69CfE4635d866e3E02732068022c06e724D)
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
```

```diff
+   Status: CREATED
    contract ShapeMultisig (0xacAF178b5048CB56712dc59E95fBA72F7990A005)
    +++ description: None
```

```diff
+   Status: CREATED
    contract AddressManager (0xcee78437aE9e15cee9c78E63757E0153c0FD7479)
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
```

```diff
+   Status: CREATED
    contract L1ERC721Bridge (0xe9d3E49b0636016c5fE9eaA2347948D0bA9f15Af)
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
```

```diff
+   Status: CREATED
    contract OptimismPortal (0xEB06fFa16011B5628BaB98E29776361c83741dd3)
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
```

```diff
+   Status: CREATED
    contract SystemConfig (0xfF11e41D5C4F522E423Ff6C064Ff8D55AF8f7355)
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
```
