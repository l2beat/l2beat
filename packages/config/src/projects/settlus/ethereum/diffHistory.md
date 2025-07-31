Generated with discovered.json: 0x9cbf07cdc9045418a5125aadc74d4bf8b52892db

# Diff at Mon, 28 Jul 2025 05:57:28 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@8e540d8d4e2ea097e63a067c52194d1bf06f9b4a block: 22988756
- current block number: 23015701

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

Generated with discovered.json: 0x9e1126fb119400fe79dd584343ddbfe618beca15

# Diff at Fri, 25 Jul 2025 13:52:40 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@85b717d6efe0c0a7691beb49532a0ce49bb7634a block: 22988756
- current block number: 22988756

## Description

templatize op upgrade 16 contracts

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22988756 (main branch discovery), not current.

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

Generated with discovered.json: 0xfb6baaba1411148f5137de58ec0833ac4ed61bb3

# Diff at Thu, 24 Jul 2025 16:48:27 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@a3f740c0fd51a5745c45d8f349ab01f4f33f7770 block: 22988756
- current block number: 22988756

## Description

set dispute game impl changes to high severity.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22988756 (main branch discovery), not current.

```diff
    contract DisputeGameFactory (0xde9FDA9C499bA1C0168AC083acF5BEc5cC67fA76) {
    +++ description: The dispute game factory allows the creation of dispute games, used to propose state roots and eventually challenge them.
      fieldMeta:
+        {"gameImpls":{"severity":"HIGH"},"game1337":{"severity":"HIGH"}}
    }
```

```diff
    contract OptimismPortal2 (0xFc1D560eB01443e31B0EB56620703E80e42A7E4e) {
    +++ description: The OptimismPortal contract is the main entry point to deposit funds from L1 to L2. It also allows to prove and finalize withdrawals. It specifies which game type can be used for withdrawals, which currently is the PermissionedDisputeGame.
      fieldMeta.respectedGameType:
+        {"severity":"HIGH"}
    }
```

Generated with discovered.json: 0xbecc6c38891abb3f0f32814371f6ba8de8ec235d

# Diff at Thu, 24 Jul 2025 11:36:53 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@daf9b4c0c3e0cc879ae7e4d12a2a3cc6a78da2a5 block: 22731117
- current block number: 22988756

## Description

1559 gas config added.

## Watched changes

```diff
    contract SystemConfig (0x15C1dAED5443A77b4DcF6FE35cAFcCEBb0c6da0E) {
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
    contract DisputeGameFactory (0xde9FDA9C499bA1C0168AC083acF5BEc5cC67fA76) {
    +++ description: The dispute game factory allows the creation of dispute games, used to propose state roots and eventually challenge them.
      values.game1337:
+        "eth:0x0000000000000000000000000000000000000000"
    }
```

```diff
    contract OptimismPortal2 (0xFc1D560eB01443e31B0EB56620703E80e42A7E4e) {
    +++ description: The OptimismPortal contract is the main entry point to deposit funds from L1 to L2. It also allows to prove and finalize withdrawals. It specifies which game type can be used for withdrawals, which currently is the PermissionedDisputeGame.
      usedTypes.0.arg.1337:
+        "KailuaGame"
    }
```

Generated with discovered.json: 0x0ff5fd2e9177ddcad4af8d4a46117ab9dc99d315

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
    EOA  (0x003E40D3125591bD722aB1bB880c78e4D74d0977) {
    +++ description: None
      address:
-        "0x003E40D3125591bD722aB1bB880c78e4D74d0977"
+        "eth:0x003E40D3125591bD722aB1bB880c78e4D74d0977"
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
    contract SystemConfig (0x15C1dAED5443A77b4DcF6FE35cAFcCEBb0c6da0E) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      address:
-        "0x15C1dAED5443A77b4DcF6FE35cAFcCEBb0c6da0E"
+        "eth:0x15C1dAED5443A77b4DcF6FE35cAFcCEBb0c6da0E"
      values.$admin:
-        "0xd35FeF329Bb6569baa373BDa702F3dfF59D57321"
+        "eth:0xd35FeF329Bb6569baa373BDa702F3dfF59D57321"
      values.$implementation:
-        "0xAB9d6cB7A427c0765163A7f45BB91cAfe5f2D375"
+        "eth:0xAB9d6cB7A427c0765163A7f45BB91cAfe5f2D375"
      values.$pastUpgrades.0.2.0:
-        "0xAB9d6cB7A427c0765163A7f45BB91cAfe5f2D375"
+        "eth:0xAB9d6cB7A427c0765163A7f45BB91cAfe5f2D375"
      values.$pastUpgrades.1.2.0:
-        "0xAB9d6cB7A427c0765163A7f45BB91cAfe5f2D375"
+        "eth:0xAB9d6cB7A427c0765163A7f45BB91cAfe5f2D375"
      values.batcherHash:
-        "0xD0b4c3aC8A50B6F1B3949ADaf55Cc9805620EB57"
+        "eth:0xD0b4c3aC8A50B6F1B3949ADaf55Cc9805620EB57"
      values.batchInbox:
-        "0x003E40D3125591bD722aB1bB880c78e4D74d0977"
+        "eth:0x003E40D3125591bD722aB1bB880c78e4D74d0977"
      values.disputeGameFactory:
-        "0xde9FDA9C499bA1C0168AC083acF5BEc5cC67fA76"
+        "eth:0xde9FDA9C499bA1C0168AC083acF5BEc5cC67fA76"
      values.gasPayingToken.addr_:
-        "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE"
+        "eth:0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE"
      values.l1CrossDomainMessenger:
-        "0x9BdA922e6f1bD53c24F9bCFb88B9638199A82CEb"
+        "eth:0x9BdA922e6f1bD53c24F9bCFb88B9638199A82CEb"
      values.l1ERC721Bridge:
-        "0xCcfa1f8A93640488E3E1AE90A0edAf44680E9f82"
+        "eth:0xCcfa1f8A93640488E3E1AE90A0edAf44680E9f82"
      values.l1StandardBridge:
-        "0xFD4918e51d1e5aa2195C42654CF769b152C9d9C0"
+        "eth:0xFD4918e51d1e5aa2195C42654CF769b152C9d9C0"
      values.optimismMintableERC20Factory:
-        "0x44e9388e88Bb8edE446d62590d8A4C6d34813e98"
+        "eth:0x44e9388e88Bb8edE446d62590d8A4C6d34813e98"
      values.optimismPortal:
-        "0xFc1D560eB01443e31B0EB56620703E80e42A7E4e"
+        "eth:0xFc1D560eB01443e31B0EB56620703E80e42A7E4e"
      values.owner:
-        "0x57669299e2a7D5BE46Ba817d8039C1350af830e8"
+        "eth:0x57669299e2a7D5BE46Ba817d8039C1350af830e8"
      values.sequencerInbox:
-        "0x003E40D3125591bD722aB1bB880c78e4D74d0977"
+        "eth:0x003E40D3125591bD722aB1bB880c78e4D74d0977"
      values.unsafeBlockSigner:
-        "0xE7c264af5bdF997A78105A6e0FF32C126Eda66D9"
+        "eth:0xE7c264af5bdF997A78105A6e0FF32C126Eda66D9"
      implementationNames.0x15C1dAED5443A77b4DcF6FE35cAFcCEBb0c6da0E:
-        "Proxy"
      implementationNames.0xAB9d6cB7A427c0765163A7f45BB91cAfe5f2D375:
-        "SystemConfig"
      implementationNames.eth:0x15C1dAED5443A77b4DcF6FE35cAFcCEBb0c6da0E:
+        "Proxy"
      implementationNames.eth:0xAB9d6cB7A427c0765163A7f45BB91cAfe5f2D375:
+        "SystemConfig"
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
    EOA  (0x1bC6Df949b8eDC8EE61adB99d578A7a6E6Ff7310) {
    +++ description: None
      address:
-        "0x1bC6Df949b8eDC8EE61adB99d578A7a6E6Ff7310"
+        "eth:0x1bC6Df949b8eDC8EE61adB99d578A7a6E6Ff7310"
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
    contract OptimismMintableERC20Factory (0x44e9388e88Bb8edE446d62590d8A4C6d34813e98) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintableERC20 as this chain's representation of a token on the host chain, or vice-versa.
      address:
-        "0x44e9388e88Bb8edE446d62590d8A4C6d34813e98"
+        "eth:0x44e9388e88Bb8edE446d62590d8A4C6d34813e98"
      values.$admin:
-        "0xd35FeF329Bb6569baa373BDa702F3dfF59D57321"
+        "eth:0xd35FeF329Bb6569baa373BDa702F3dfF59D57321"
      values.$implementation:
-        "0xE01efbeb1089D1d1dB9c6c8b135C934C0734c846"
+        "eth:0xE01efbeb1089D1d1dB9c6c8b135C934C0734c846"
      values.$pastUpgrades.0.2.0:
-        "0xE01efbeb1089D1d1dB9c6c8b135C934C0734c846"
+        "eth:0xE01efbeb1089D1d1dB9c6c8b135C934C0734c846"
      values.bridge:
-        "0xFD4918e51d1e5aa2195C42654CF769b152C9d9C0"
+        "eth:0xFD4918e51d1e5aa2195C42654CF769b152C9d9C0"
      values.BRIDGE:
-        "0xFD4918e51d1e5aa2195C42654CF769b152C9d9C0"
+        "eth:0xFD4918e51d1e5aa2195C42654CF769b152C9d9C0"
      implementationNames.0x44e9388e88Bb8edE446d62590d8A4C6d34813e98:
-        "Proxy"
      implementationNames.0xE01efbeb1089D1d1dB9c6c8b135C934C0734c846:
-        "OptimismMintableERC20Factory"
      implementationNames.eth:0x44e9388e88Bb8edE446d62590d8A4C6d34813e98:
+        "Proxy"
      implementationNames.eth:0xE01efbeb1089D1d1dB9c6c8b135C934C0734c846:
+        "OptimismMintableERC20Factory"
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
    EOA  (0x57669299e2a7D5BE46Ba817d8039C1350af830e8) {
    +++ description: None
      address:
-        "0x57669299e2a7D5BE46Ba817d8039C1350af830e8"
+        "eth:0x57669299e2a7D5BE46Ba817d8039C1350af830e8"
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
    contract L1CrossDomainMessenger (0x9BdA922e6f1bD53c24F9bCFb88B9638199A82CEb) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      address:
-        "0x9BdA922e6f1bD53c24F9bCFb88B9638199A82CEb"
+        "eth:0x9BdA922e6f1bD53c24F9bCFb88B9638199A82CEb"
      values.$admin:
-        "0xd35FeF329Bb6569baa373BDa702F3dfF59D57321"
+        "eth:0xd35FeF329Bb6569baa373BDa702F3dfF59D57321"
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
-        "0xFc1D560eB01443e31B0EB56620703E80e42A7E4e"
+        "eth:0xFc1D560eB01443e31B0EB56620703E80e42A7E4e"
      values.PORTAL:
-        "0xFc1D560eB01443e31B0EB56620703E80e42A7E4e"
+        "eth:0xFc1D560eB01443e31B0EB56620703E80e42A7E4e"
      values.ResolvedDelegateProxy_addressManager:
-        "0xC24C700BC65a3b15De13e489e155c81F621B1856"
+        "eth:0xC24C700BC65a3b15De13e489e155c81F621B1856"
      values.superchainConfig:
-        "0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
+        "eth:0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
      implementationNames.0x9BdA922e6f1bD53c24F9bCFb88B9638199A82CEb:
-        "ResolvedDelegateProxy"
      implementationNames.0xD3494713A5cfaD3F5359379DfA074E2Ac8C6Fd65:
-        "L1CrossDomainMessenger"
      implementationNames.eth:0x9BdA922e6f1bD53c24F9bCFb88B9638199A82CEb:
+        "ResolvedDelegateProxy"
      implementationNames.eth:0xD3494713A5cfaD3F5359379DfA074E2Ac8C6Fd65:
+        "L1CrossDomainMessenger"
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
    contract AnchorStateRegistry (0xb5150595F1E2240b76F414dc96509f5125ba5DD0) {
    +++ description: Contains the latest confirmed state root that can be used as a starting point in a dispute game.
      address:
-        "0xb5150595F1E2240b76F414dc96509f5125ba5DD0"
+        "eth:0xb5150595F1E2240b76F414dc96509f5125ba5DD0"
      values.$admin:
-        "0xd35FeF329Bb6569baa373BDa702F3dfF59D57321"
+        "eth:0xd35FeF329Bb6569baa373BDa702F3dfF59D57321"
      values.$implementation:
-        "0x6779A8a56a817dF8718015C1898eADe453a76495"
+        "eth:0x6779A8a56a817dF8718015C1898eADe453a76495"
      values.$pastUpgrades.0.2.0:
-        "0x6779A8a56a817dF8718015C1898eADe453a76495"
+        "eth:0x6779A8a56a817dF8718015C1898eADe453a76495"
      values.disputeGameFactory:
-        "0xde9FDA9C499bA1C0168AC083acF5BEc5cC67fA76"
+        "eth:0xde9FDA9C499bA1C0168AC083acF5BEc5cC67fA76"
      values.superchainConfig:
-        "0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
+        "eth:0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
      implementationNames.0xb5150595F1E2240b76F414dc96509f5125ba5DD0:
-        "Proxy"
      implementationNames.0x6779A8a56a817dF8718015C1898eADe453a76495:
-        "AnchorStateRegistry"
      implementationNames.eth:0xb5150595F1E2240b76F414dc96509f5125ba5DD0:
+        "Proxy"
      implementationNames.eth:0x6779A8a56a817dF8718015C1898eADe453a76495:
+        "AnchorStateRegistry"
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
    contract DelayedWETH (0xC206D300b07cB905Cb1831d8a9172d4c66394638) {
    +++ description: Contract designed to hold the bonded ETH for each game. It is designed as a wrapper around WETH to allow an owner to function as a backstop if a game would incorrectly distribute funds.
      address:
-        "0xC206D300b07cB905Cb1831d8a9172d4c66394638"
+        "eth:0xC206D300b07cB905Cb1831d8a9172d4c66394638"
      values.$admin:
-        "0xd35FeF329Bb6569baa373BDa702F3dfF59D57321"
+        "eth:0xd35FeF329Bb6569baa373BDa702F3dfF59D57321"
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
-        "0xA4fB12D15Eb85dc9284a7df0AdBC8B696EdbbF1d"
+        "eth:0xA4fB12D15Eb85dc9284a7df0AdBC8B696EdbbF1d"
      implementationNames.0xC206D300b07cB905Cb1831d8a9172d4c66394638:
-        "Proxy"
      implementationNames.0x71e966Ae981d1ce531a7b6d23DC0f27B38409087:
-        "DelayedWETH"
      implementationNames.eth:0xC206D300b07cB905Cb1831d8a9172d4c66394638:
+        "Proxy"
      implementationNames.eth:0x71e966Ae981d1ce531a7b6d23DC0f27B38409087:
+        "DelayedWETH"
    }
```

```diff
    contract AddressManager (0xC24C700BC65a3b15De13e489e155c81F621B1856) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      address:
-        "0xC24C700BC65a3b15De13e489e155c81F621B1856"
+        "eth:0xC24C700BC65a3b15De13e489e155c81F621B1856"
      values.owner:
-        "0xd35FeF329Bb6569baa373BDa702F3dfF59D57321"
+        "eth:0xd35FeF329Bb6569baa373BDa702F3dfF59D57321"
      implementationNames.0xC24C700BC65a3b15De13e489e155c81F621B1856:
-        "AddressManager"
      implementationNames.eth:0xC24C700BC65a3b15De13e489e155c81F621B1856:
+        "AddressManager"
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
    contract L1ERC721Bridge (0xCcfa1f8A93640488E3E1AE90A0edAf44680E9f82) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      address:
-        "0xCcfa1f8A93640488E3E1AE90A0edAf44680E9f82"
+        "eth:0xCcfa1f8A93640488E3E1AE90A0edAf44680E9f82"
      values.$admin:
-        "0xd35FeF329Bb6569baa373BDa702F3dfF59D57321"
+        "eth:0xd35FeF329Bb6569baa373BDa702F3dfF59D57321"
      values.$implementation:
-        "0xAE2AF01232a6c4a4d3012C5eC5b1b35059caF10d"
+        "eth:0xAE2AF01232a6c4a4d3012C5eC5b1b35059caF10d"
      values.$pastUpgrades.0.2.0:
-        "0xAE2AF01232a6c4a4d3012C5eC5b1b35059caF10d"
+        "eth:0xAE2AF01232a6c4a4d3012C5eC5b1b35059caF10d"
      values.messenger:
-        "0x9BdA922e6f1bD53c24F9bCFb88B9638199A82CEb"
+        "eth:0x9BdA922e6f1bD53c24F9bCFb88B9638199A82CEb"
      values.MESSENGER:
-        "0x9BdA922e6f1bD53c24F9bCFb88B9638199A82CEb"
+        "eth:0x9BdA922e6f1bD53c24F9bCFb88B9638199A82CEb"
      values.OTHER_BRIDGE:
-        "0x4200000000000000000000000000000000000014"
+        "eth:0x4200000000000000000000000000000000000014"
      values.otherBridge:
-        "0x4200000000000000000000000000000000000014"
+        "eth:0x4200000000000000000000000000000000000014"
      values.superchainConfig:
-        "0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
+        "eth:0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
      implementationNames.0xCcfa1f8A93640488E3E1AE90A0edAf44680E9f82:
-        "Proxy"
      implementationNames.0xAE2AF01232a6c4a4d3012C5eC5b1b35059caF10d:
-        "L1ERC721Bridge"
      implementationNames.eth:0xCcfa1f8A93640488E3E1AE90A0edAf44680E9f82:
+        "Proxy"
      implementationNames.eth:0xAE2AF01232a6c4a4d3012C5eC5b1b35059caF10d:
+        "L1ERC721Bridge"
    }
```

```diff
    EOA  (0xD0b4c3aC8A50B6F1B3949ADaf55Cc9805620EB57) {
    +++ description: None
      address:
-        "0xD0b4c3aC8A50B6F1B3949ADaf55Cc9805620EB57"
+        "eth:0xD0b4c3aC8A50B6F1B3949ADaf55Cc9805620EB57"
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
    contract ProxyAdmin (0xd35FeF329Bb6569baa373BDa702F3dfF59D57321) {
    +++ description: None
      address:
-        "0xd35FeF329Bb6569baa373BDa702F3dfF59D57321"
+        "eth:0xd35FeF329Bb6569baa373BDa702F3dfF59D57321"
      values.addressManager:
-        "0xC24C700BC65a3b15De13e489e155c81F621B1856"
+        "eth:0xC24C700BC65a3b15De13e489e155c81F621B1856"
      values.owner:
-        "0xA4fB12D15Eb85dc9284a7df0AdBC8B696EdbbF1d"
+        "eth:0xA4fB12D15Eb85dc9284a7df0AdBC8B696EdbbF1d"
      implementationNames.0xd35FeF329Bb6569baa373BDa702F3dfF59D57321:
-        "ProxyAdmin"
      implementationNames.eth:0xd35FeF329Bb6569baa373BDa702F3dfF59D57321:
+        "ProxyAdmin"
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
    contract DisputeGameFactory (0xde9FDA9C499bA1C0168AC083acF5BEc5cC67fA76) {
    +++ description: The dispute game factory allows the creation of dispute games, used to propose state roots and eventually challenge them.
      address:
-        "0xde9FDA9C499bA1C0168AC083acF5BEc5cC67fA76"
+        "eth:0xde9FDA9C499bA1C0168AC083acF5BEc5cC67fA76"
      values.$admin:
-        "0xd35FeF329Bb6569baa373BDa702F3dfF59D57321"
+        "eth:0xd35FeF329Bb6569baa373BDa702F3dfF59D57321"
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
-        "0xf9534EBc84082dF9d35Fb1Ed8786bF8cE8a90294"
+        "eth:0xf9534EBc84082dF9d35Fb1Ed8786bF8cE8a90294"
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
      implementationNames.0xde9FDA9C499bA1C0168AC083acF5BEc5cC67fA76:
-        "Proxy"
      implementationNames.0xc641A33cab81C559F2bd4b21EA34C290E2440C2B:
-        "DisputeGameFactory"
      implementationNames.eth:0xde9FDA9C499bA1C0168AC083acF5BEc5cC67fA76:
+        "Proxy"
      implementationNames.eth:0xc641A33cab81C559F2bd4b21EA34C290E2440C2B:
+        "DisputeGameFactory"
    }
```

```diff
    EOA  (0xE7c264af5bdF997A78105A6e0FF32C126Eda66D9) {
    +++ description: None
      address:
-        "0xE7c264af5bdF997A78105A6e0FF32C126Eda66D9"
+        "eth:0xE7c264af5bdF997A78105A6e0FF32C126Eda66D9"
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
    EOA  (0xeD9919D57162D518014C391a687AA8fb9DB55654) {
    +++ description: None
      address:
-        "0xeD9919D57162D518014C391a687AA8fb9DB55654"
+        "eth:0xeD9919D57162D518014C391a687AA8fb9DB55654"
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
    contract PermissionedDisputeGame (0xf9534EBc84082dF9d35Fb1Ed8786bF8cE8a90294) {
    +++ description: Same as FaultDisputeGame, but only two permissioned addresses are designated as proposer and challenger.
      address:
-        "0xf9534EBc84082dF9d35Fb1Ed8786bF8cE8a90294"
+        "eth:0xf9534EBc84082dF9d35Fb1Ed8786bF8cE8a90294"
      values.anchorStateRegistry:
-        "0xb5150595F1E2240b76F414dc96509f5125ba5DD0"
+        "eth:0xb5150595F1E2240b76F414dc96509f5125ba5DD0"
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
-        "0x1bC6Df949b8eDC8EE61adB99d578A7a6E6Ff7310"
+        "eth:0x1bC6Df949b8eDC8EE61adB99d578A7a6E6Ff7310"
      values.vm:
-        "0x5fE03a12C1236F9C22Cb6479778DDAa4bce6299C"
+        "eth:0x5fE03a12C1236F9C22Cb6479778DDAa4bce6299C"
      values.weth:
-        "0xC206D300b07cB905Cb1831d8a9172d4c66394638"
+        "eth:0xC206D300b07cB905Cb1831d8a9172d4c66394638"
      implementationNames.0xf9534EBc84082dF9d35Fb1Ed8786bF8cE8a90294:
-        "PermissionedDisputeGame"
      implementationNames.eth:0xf9534EBc84082dF9d35Fb1Ed8786bF8cE8a90294:
+        "PermissionedDisputeGame"
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
    contract OptimismPortal2 (0xFc1D560eB01443e31B0EB56620703E80e42A7E4e) {
    +++ description: The OptimismPortal contract is the main entry point to deposit funds from L1 to L2. It also allows to prove and finalize withdrawals. It specifies which game type can be used for withdrawals, which currently is the PermissionedDisputeGame.
      address:
-        "0xFc1D560eB01443e31B0EB56620703E80e42A7E4e"
+        "eth:0xFc1D560eB01443e31B0EB56620703E80e42A7E4e"
      values.$admin:
-        "0xd35FeF329Bb6569baa373BDa702F3dfF59D57321"
+        "eth:0xd35FeF329Bb6569baa373BDa702F3dfF59D57321"
      values.$implementation:
-        "0xe2F826324b2faf99E513D16D266c3F80aE87832B"
+        "eth:0xe2F826324b2faf99E513D16D266c3F80aE87832B"
      values.$pastUpgrades.0.2.0:
-        "0xe2F826324b2faf99E513D16D266c3F80aE87832B"
+        "eth:0xe2F826324b2faf99E513D16D266c3F80aE87832B"
      values.disputeGameFactory:
-        "0xde9FDA9C499bA1C0168AC083acF5BEc5cC67fA76"
+        "eth:0xde9FDA9C499bA1C0168AC083acF5BEc5cC67fA76"
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
-        "0x15C1dAED5443A77b4DcF6FE35cAFcCEBb0c6da0E"
+        "eth:0x15C1dAED5443A77b4DcF6FE35cAFcCEBb0c6da0E"
      implementationNames.0xFc1D560eB01443e31B0EB56620703E80e42A7E4e:
-        "Proxy"
      implementationNames.0xe2F826324b2faf99E513D16D266c3F80aE87832B:
-        "OptimismPortal2"
      implementationNames.eth:0xFc1D560eB01443e31B0EB56620703E80e42A7E4e:
+        "Proxy"
      implementationNames.eth:0xe2F826324b2faf99E513D16D266c3F80aE87832B:
+        "OptimismPortal2"
    }
```

```diff
    contract L1StandardBridge (0xFD4918e51d1e5aa2195C42654CF769b152C9d9C0) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      address:
-        "0xFD4918e51d1e5aa2195C42654CF769b152C9d9C0"
+        "eth:0xFD4918e51d1e5aa2195C42654CF769b152C9d9C0"
      values.$admin:
-        "0xd35FeF329Bb6569baa373BDa702F3dfF59D57321"
+        "eth:0xd35FeF329Bb6569baa373BDa702F3dfF59D57321"
      values.$implementation:
-        "0x64B5a5Ed26DCb17370Ff4d33a8D503f0fbD06CfF"
+        "eth:0x64B5a5Ed26DCb17370Ff4d33a8D503f0fbD06CfF"
      values.l2TokenBridge:
-        "0x4200000000000000000000000000000000000010"
+        "eth:0x4200000000000000000000000000000000000010"
      values.messenger:
-        "0x9BdA922e6f1bD53c24F9bCFb88B9638199A82CEb"
+        "eth:0x9BdA922e6f1bD53c24F9bCFb88B9638199A82CEb"
      values.MESSENGER:
-        "0x9BdA922e6f1bD53c24F9bCFb88B9638199A82CEb"
+        "eth:0x9BdA922e6f1bD53c24F9bCFb88B9638199A82CEb"
      values.OTHER_BRIDGE:
-        "0x4200000000000000000000000000000000000010"
+        "eth:0x4200000000000000000000000000000000000010"
      values.otherBridge:
-        "0x4200000000000000000000000000000000000010"
+        "eth:0x4200000000000000000000000000000000000010"
      values.superchainConfig:
-        "0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
+        "eth:0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
      implementationNames.0xFD4918e51d1e5aa2195C42654CF769b152C9d9C0:
-        "L1ChugSplashProxy"
      implementationNames.0x64B5a5Ed26DCb17370Ff4d33a8D503f0fbD06CfF:
-        "L1StandardBridge"
      implementationNames.eth:0xFD4918e51d1e5aa2195C42654CF769b152C9d9C0:
+        "L1ChugSplashProxy"
      implementationNames.eth:0x64B5a5Ed26DCb17370Ff4d33a8D503f0fbD06CfF:
+        "L1StandardBridge"
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
    contract SystemConfig (0x15C1dAED5443A77b4DcF6FE35cAFcCEBb0c6da0E)
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
```

```diff
+   Status: CREATED
    contract LivenessGuard (0x24424336F04440b1c28685a38303aC33C9D14a25)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafe (0x42d27eEA1AD6e22Af6284F609847CB3Cd56B9c64)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OptimismMintableERC20Factory (0x44e9388e88Bb8edE446d62590d8A4C6d34813e98)
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintableERC20 as this chain's representation of a token on the host chain, or vice-versa.
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
    contract L1CrossDomainMessenger (0x9BdA922e6f1bD53c24F9bCFb88B9638199A82CEb)
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
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
    contract AnchorStateRegistry (0xb5150595F1E2240b76F414dc96509f5125ba5DD0)
    +++ description: Contains the latest confirmed state root that can be used as a starting point in a dispute game.
```

```diff
+   Status: CREATED
    contract DelayedWETH (0xC206D300b07cB905Cb1831d8a9172d4c66394638)
    +++ description: Contract designed to hold the bonded ETH for each game. It is designed as a wrapper around WETH to allow an owner to function as a backstop if a game would incorrectly distribute funds.
```

```diff
+   Status: CREATED
    contract AddressManager (0xC24C700BC65a3b15De13e489e155c81F621B1856)
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
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
    contract L1ERC721Bridge (0xCcfa1f8A93640488E3E1AE90A0edAf44680E9f82)
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0xd35FeF329Bb6569baa373BDa702F3dfF59D57321)
    +++ description: None
```

```diff
+   Status: CREATED
    contract AddressManager (0xdE1FCfB0851916CA5101820A69b13a4E276bd81F)
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
```

```diff
+   Status: CREATED
    contract DisputeGameFactory (0xde9FDA9C499bA1C0168AC083acF5BEc5cC67fA76)
    +++ description: The dispute game factory allows the creation of dispute games, used to propose state roots and eventually challenge them.
```

```diff
+   Status: CREATED
    contract PermissionedDisputeGame (0xf9534EBc84082dF9d35Fb1Ed8786bF8cE8a90294)
    +++ description: Same as FaultDisputeGame, but only two permissioned addresses are designated as proposer and challenger.
```

```diff
+   Status: CREATED
    contract OptimismPortal2 (0xFc1D560eB01443e31B0EB56620703E80e42A7E4e)
    +++ description: The OptimismPortal contract is the main entry point to deposit funds from L1 to L2. It also allows to prove and finalize withdrawals. It specifies which game type can be used for withdrawals, which currently is the PermissionedDisputeGame.
```

```diff
+   Status: CREATED
    contract L1StandardBridge (0xFD4918e51d1e5aa2195C42654CF769b152C9d9C0)
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
```

Generated with discovered.json: 0x0f24f49d295e806c0248792d27c3451e6ce5e026

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
    contract OptimismMintableERC20Factory (0x44e9388e88Bb8edE446d62590d8A4C6d34813e98) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintableERC20 as this chain's representation of a token on the host chain, or vice-versa.
      description:
-        "A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa."
+        "A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintableERC20 as this chain's representation of a token on the host chain, or vice-versa."
    }
```

Generated with discovered.json: 0x3e18c56f6058c29014196b9578bf293d82c06007

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
    contract DeputyPauseModule (0x126a736B18E0a64fBA19D421647A530E327E112C) {
    +++ description: Allows 0x352f1defB49718e7Ea411687E850aA8d6299F7aC, called the deputy pauser, to act on behalf of the 0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A if set as its Safe module.
      directlyReceivedPermissions.0.from:
-        "ethereum:0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A"
+        "eth:0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A"
    }
```

```diff
    EOA  (0x1bC6Df949b8eDC8EE61adB99d578A7a6E6Ff7310) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0xf9534EBc84082dF9d35Fb1Ed8786bF8cE8a90294"
+        "eth:0xf9534EBc84082dF9d35Fb1Ed8786bF8cE8a90294"
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
    EOA  (0x57669299e2a7D5BE46Ba817d8039C1350af830e8) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0x15C1dAED5443A77b4DcF6FE35cAFcCEBb0c6da0E"
+        "eth:0x15C1dAED5443A77b4DcF6FE35cAFcCEBb0c6da0E"
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
-        "ethereum:0xf9534EBc84082dF9d35Fb1Ed8786bF8cE8a90294"
+        "eth:0xf9534EBc84082dF9d35Fb1Ed8786bF8cE8a90294"
      receivedPermissions.1.from:
-        "ethereum:0xC206D300b07cB905Cb1831d8a9172d4c66394638"
+        "eth:0xC206D300b07cB905Cb1831d8a9172d4c66394638"
      receivedPermissions.2.via.0.address:
-        "ethereum:0xd35FeF329Bb6569baa373BDa702F3dfF59D57321"
+        "eth:0xd35FeF329Bb6569baa373BDa702F3dfF59D57321"
      receivedPermissions.2.from:
-        "ethereum:0xC24C700BC65a3b15De13e489e155c81F621B1856"
+        "eth:0xC24C700BC65a3b15De13e489e155c81F621B1856"
      receivedPermissions.3.via.0.address:
-        "ethereum:0xd35FeF329Bb6569baa373BDa702F3dfF59D57321"
+        "eth:0xd35FeF329Bb6569baa373BDa702F3dfF59D57321"
      receivedPermissions.3.from:
-        "ethereum:0x15C1dAED5443A77b4DcF6FE35cAFcCEBb0c6da0E"
+        "eth:0x15C1dAED5443A77b4DcF6FE35cAFcCEBb0c6da0E"
      receivedPermissions.4.via.0.address:
-        "ethereum:0xd35FeF329Bb6569baa373BDa702F3dfF59D57321"
+        "eth:0xd35FeF329Bb6569baa373BDa702F3dfF59D57321"
      receivedPermissions.4.from:
-        "ethereum:0x44e9388e88Bb8edE446d62590d8A4C6d34813e98"
+        "eth:0x44e9388e88Bb8edE446d62590d8A4C6d34813e98"
      receivedPermissions.5.via.0.address:
-        "ethereum:0xd35FeF329Bb6569baa373BDa702F3dfF59D57321"
+        "eth:0xd35FeF329Bb6569baa373BDa702F3dfF59D57321"
      receivedPermissions.5.from:
-        "ethereum:0x9BdA922e6f1bD53c24F9bCFb88B9638199A82CEb"
+        "eth:0x9BdA922e6f1bD53c24F9bCFb88B9638199A82CEb"
      receivedPermissions.6.via.0.address:
-        "ethereum:0xd35FeF329Bb6569baa373BDa702F3dfF59D57321"
+        "eth:0xd35FeF329Bb6569baa373BDa702F3dfF59D57321"
      receivedPermissions.6.from:
-        "ethereum:0xb5150595F1E2240b76F414dc96509f5125ba5DD0"
+        "eth:0xb5150595F1E2240b76F414dc96509f5125ba5DD0"
      receivedPermissions.7.via.0.address:
-        "ethereum:0xd35FeF329Bb6569baa373BDa702F3dfF59D57321"
+        "eth:0xd35FeF329Bb6569baa373BDa702F3dfF59D57321"
      receivedPermissions.7.from:
-        "ethereum:0xC206D300b07cB905Cb1831d8a9172d4c66394638"
+        "eth:0xC206D300b07cB905Cb1831d8a9172d4c66394638"
      receivedPermissions.8.via.0.address:
-        "ethereum:0xd35FeF329Bb6569baa373BDa702F3dfF59D57321"
+        "eth:0xd35FeF329Bb6569baa373BDa702F3dfF59D57321"
      receivedPermissions.8.from:
-        "ethereum:0xCcfa1f8A93640488E3E1AE90A0edAf44680E9f82"
+        "eth:0xCcfa1f8A93640488E3E1AE90A0edAf44680E9f82"
      receivedPermissions.9.via.0.address:
-        "ethereum:0xd35FeF329Bb6569baa373BDa702F3dfF59D57321"
+        "eth:0xd35FeF329Bb6569baa373BDa702F3dfF59D57321"
      receivedPermissions.9.from:
-        "ethereum:0xde9FDA9C499bA1C0168AC083acF5BEc5cC67fA76"
+        "eth:0xde9FDA9C499bA1C0168AC083acF5BEc5cC67fA76"
      receivedPermissions.10.via.0.address:
-        "ethereum:0xd35FeF329Bb6569baa373BDa702F3dfF59D57321"
+        "eth:0xd35FeF329Bb6569baa373BDa702F3dfF59D57321"
      receivedPermissions.10.from:
-        "ethereum:0xFc1D560eB01443e31B0EB56620703E80e42A7E4e"
+        "eth:0xFc1D560eB01443e31B0EB56620703E80e42A7E4e"
      receivedPermissions.11.via.0.address:
-        "ethereum:0xd35FeF329Bb6569baa373BDa702F3dfF59D57321"
+        "eth:0xd35FeF329Bb6569baa373BDa702F3dfF59D57321"
      receivedPermissions.11.from:
-        "ethereum:0xFD4918e51d1e5aa2195C42654CF769b152C9d9C0"
+        "eth:0xFD4918e51d1e5aa2195C42654CF769b152C9d9C0"
      directlyReceivedPermissions.0.from:
-        "ethereum:0xd35FeF329Bb6569baa373BDa702F3dfF59D57321"
+        "eth:0xd35FeF329Bb6569baa373BDa702F3dfF59D57321"
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
    EOA  (0xD0b4c3aC8A50B6F1B3949ADaf55Cc9805620EB57) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0x15C1dAED5443A77b4DcF6FE35cAFcCEBb0c6da0E"
+        "eth:0x15C1dAED5443A77b4DcF6FE35cAFcCEBb0c6da0E"
    }
```

```diff
    contract ProxyAdmin (0xd35FeF329Bb6569baa373BDa702F3dfF59D57321) {
    +++ description: None
      directlyReceivedPermissions.0.from:
-        "ethereum:0xC24C700BC65a3b15De13e489e155c81F621B1856"
+        "eth:0xC24C700BC65a3b15De13e489e155c81F621B1856"
      directlyReceivedPermissions.1.from:
-        "ethereum:0x15C1dAED5443A77b4DcF6FE35cAFcCEBb0c6da0E"
+        "eth:0x15C1dAED5443A77b4DcF6FE35cAFcCEBb0c6da0E"
      directlyReceivedPermissions.2.from:
-        "ethereum:0x44e9388e88Bb8edE446d62590d8A4C6d34813e98"
+        "eth:0x44e9388e88Bb8edE446d62590d8A4C6d34813e98"
      directlyReceivedPermissions.3.from:
-        "ethereum:0x9BdA922e6f1bD53c24F9bCFb88B9638199A82CEb"
+        "eth:0x9BdA922e6f1bD53c24F9bCFb88B9638199A82CEb"
      directlyReceivedPermissions.4.from:
-        "ethereum:0xb5150595F1E2240b76F414dc96509f5125ba5DD0"
+        "eth:0xb5150595F1E2240b76F414dc96509f5125ba5DD0"
      directlyReceivedPermissions.5.from:
-        "ethereum:0xC206D300b07cB905Cb1831d8a9172d4c66394638"
+        "eth:0xC206D300b07cB905Cb1831d8a9172d4c66394638"
      directlyReceivedPermissions.6.from:
-        "ethereum:0xCcfa1f8A93640488E3E1AE90A0edAf44680E9f82"
+        "eth:0xCcfa1f8A93640488E3E1AE90A0edAf44680E9f82"
      directlyReceivedPermissions.7.from:
-        "ethereum:0xde9FDA9C499bA1C0168AC083acF5BEc5cC67fA76"
+        "eth:0xde9FDA9C499bA1C0168AC083acF5BEc5cC67fA76"
      directlyReceivedPermissions.8.from:
-        "ethereum:0xFc1D560eB01443e31B0EB56620703E80e42A7E4e"
+        "eth:0xFc1D560eB01443e31B0EB56620703E80e42A7E4e"
      directlyReceivedPermissions.9.from:
-        "ethereum:0xFD4918e51d1e5aa2195C42654CF769b152C9d9C0"
+        "eth:0xFD4918e51d1e5aa2195C42654CF769b152C9d9C0"
    }
```

Generated with discovered.json: 0x8c1bd55153dfb7a54d0756d5bccf40e7094a367a

# Diff at Wed, 18 Jun 2025 11:38:10 GMT:

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

Generated with discovered.json: 0x88c0076f327f4b2f781d6546901ee757f8e5ff62

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
    contract L1CrossDomainMessenger (0x9BdA922e6f1bD53c24F9bCFb88B9638199A82CEb) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      values.$admin:
+        "0xd35FeF329Bb6569baa373BDa702F3dfF59D57321"
    }
```

```diff
    contract Alchemy Multisig 1 (0xA4fB12D15Eb85dc9284a7df0AdBC8B696EdbbF1d) {
    +++ description: None
      receivedPermissions.11:
+        {"permission":"upgrade","from":"ethereum:0xCcfa1f8A93640488E3E1AE90A0edAf44680E9f82","role":"admin","via":[{"address":"ethereum:0xd35FeF329Bb6569baa373BDa702F3dfF59D57321"}]}
      receivedPermissions.10.from:
-        "ethereum:0xCcfa1f8A93640488E3E1AE90A0edAf44680E9f82"
+        "ethereum:0xde9FDA9C499bA1C0168AC083acF5BEc5cC67fA76"
      receivedPermissions.9.from:
-        "ethereum:0xde9FDA9C499bA1C0168AC083acF5BEc5cC67fA76"
+        "ethereum:0x44e9388e88Bb8edE446d62590d8A4C6d34813e98"
      receivedPermissions.8.from:
-        "ethereum:0x44e9388e88Bb8edE446d62590d8A4C6d34813e98"
+        "ethereum:0xC206D300b07cB905Cb1831d8a9172d4c66394638"
      receivedPermissions.7.from:
-        "ethereum:0xC206D300b07cB905Cb1831d8a9172d4c66394638"
+        "ethereum:0xb5150595F1E2240b76F414dc96509f5125ba5DD0"
      receivedPermissions.6.from:
-        "ethereum:0xb5150595F1E2240b76F414dc96509f5125ba5DD0"
+        "ethereum:0x15C1dAED5443A77b4DcF6FE35cAFcCEBb0c6da0E"
      receivedPermissions.5.from:
-        "ethereum:0x15C1dAED5443A77b4DcF6FE35cAFcCEBb0c6da0E"
+        "ethereum:0x9BdA922e6f1bD53c24F9bCFb88B9638199A82CEb"
    }
```

```diff
    contract ProxyAdmin (0xd35FeF329Bb6569baa373BDa702F3dfF59D57321) {
    +++ description: None
      directlyReceivedPermissions.9:
+        {"permission":"upgrade","from":"ethereum:0xCcfa1f8A93640488E3E1AE90A0edAf44680E9f82","role":"admin"}
      directlyReceivedPermissions.8.from:
-        "ethereum:0xCcfa1f8A93640488E3E1AE90A0edAf44680E9f82"
+        "ethereum:0xde9FDA9C499bA1C0168AC083acF5BEc5cC67fA76"
      directlyReceivedPermissions.7.from:
-        "ethereum:0xde9FDA9C499bA1C0168AC083acF5BEc5cC67fA76"
+        "ethereum:0x44e9388e88Bb8edE446d62590d8A4C6d34813e98"
      directlyReceivedPermissions.6.from:
-        "ethereum:0x44e9388e88Bb8edE446d62590d8A4C6d34813e98"
+        "ethereum:0xC206D300b07cB905Cb1831d8a9172d4c66394638"
      directlyReceivedPermissions.5.from:
-        "ethereum:0xC206D300b07cB905Cb1831d8a9172d4c66394638"
+        "ethereum:0xb5150595F1E2240b76F414dc96509f5125ba5DD0"
      directlyReceivedPermissions.4.from:
-        "ethereum:0xb5150595F1E2240b76F414dc96509f5125ba5DD0"
+        "ethereum:0x15C1dAED5443A77b4DcF6FE35cAFcCEBb0c6da0E"
      directlyReceivedPermissions.3.from:
-        "ethereum:0x15C1dAED5443A77b4DcF6FE35cAFcCEBb0c6da0E"
+        "ethereum:0x9BdA922e6f1bD53c24F9bCFb88B9638199A82CEb"
    }
```

Generated with discovered.json: 0x41da0f1f01c1ca971192f3e3e719b71bf69ef2ac

# Diff at Fri, 30 May 2025 07:14:59 GMT:

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
    contract SystemConfig (0x15C1dAED5443A77b4DcF6FE35cAFcCEBb0c6da0E) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      fieldMeta.eip1559Denominator:
+        {"description":"volatility param: lower denominator -> quicker fee changes on L2"}
    }
```

Generated with discovered.json: 0xedd40a46f25cd9a467310e014fef522c1117a8ee

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
    contract DeputyPauseModule (0x126a736B18E0a64fBA19D421647A530E327E112C) {
    +++ description: Allows 0x352f1defB49718e7Ea411687E850aA8d6299F7aC, called the deputy pauser, to act on behalf of the 0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A if set as its Safe module.
      directlyReceivedPermissions.0.role:
+        ".GnosisSafe_modules"
    }
```

```diff
    EOA  (0x1bC6Df949b8eDC8EE61adB99d578A7a6E6Ff7310) {
    +++ description: None
      receivedPermissions.0.role:
+        ".proposer"
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
    EOA  (0x57669299e2a7D5BE46Ba817d8039C1350af830e8) {
    +++ description: None
      receivedPermissions.0.role:
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
      receivedPermissions.10.role:
+        "admin"
      receivedPermissions.9.role:
+        "admin"
      receivedPermissions.8.permission:
-        "interact"
+        "upgrade"
      receivedPermissions.8.from:
-        "0xC206D300b07cB905Cb1831d8a9172d4c66394638"
+        "0xFc1D560eB01443e31B0EB56620703E80e42A7E4e"
      receivedPermissions.8.description:
-        "can pull funds from the contract in case of emergency."
      receivedPermissions.8.role:
+        "admin"
      receivedPermissions.8.via:
+        [{"address":"0xd35FeF329Bb6569baa373BDa702F3dfF59D57321"}]
      receivedPermissions.7.permission:
-        "challenge"
+        "upgrade"
      receivedPermissions.7.from:
-        "0xf9534EBc84082dF9d35Fb1Ed8786bF8cE8a90294"
+        "0xde9FDA9C499bA1C0168AC083acF5BEc5cC67fA76"
      receivedPermissions.7.role:
+        "admin"
      receivedPermissions.7.via:
+        [{"address":"0xd35FeF329Bb6569baa373BDa702F3dfF59D57321"}]
      receivedPermissions.6.from:
-        "0xFD4918e51d1e5aa2195C42654CF769b152C9d9C0"
+        "0xb5150595F1E2240b76F414dc96509f5125ba5DD0"
      receivedPermissions.6.description:
-        "upgrading the bridge implementation can give access to all funds escrowed therein."
      receivedPermissions.6.role:
+        "admin"
      receivedPermissions.5.from:
-        "0xFc1D560eB01443e31B0EB56620703E80e42A7E4e"
+        "0xC206D300b07cB905Cb1831d8a9172d4c66394638"
      receivedPermissions.5.role:
+        "admin"
      receivedPermissions.4.from:
-        "0xde9FDA9C499bA1C0168AC083acF5BEc5cC67fA76"
+        "0xCcfa1f8A93640488E3E1AE90A0edAf44680E9f82"
      receivedPermissions.4.role:
+        "admin"
      receivedPermissions.3.permission:
-        "upgrade"
+        "challenge"
      receivedPermissions.3.from:
-        "0xb5150595F1E2240b76F414dc96509f5125ba5DD0"
+        "0xf9534EBc84082dF9d35Fb1Ed8786bF8cE8a90294"
      receivedPermissions.3.via:
-        [{"address":"0xd35FeF329Bb6569baa373BDa702F3dfF59D57321"}]
      receivedPermissions.3.role:
+        ".challenger"
      receivedPermissions.2.from:
-        "0xC206D300b07cB905Cb1831d8a9172d4c66394638"
+        "0xFD4918e51d1e5aa2195C42654CF769b152C9d9C0"
      receivedPermissions.2.description:
+        "upgrading the bridge implementation can give access to all funds escrowed therein."
      receivedPermissions.2.role:
+        ".$admin"
      receivedPermissions.1.permission:
-        "upgrade"
+        "interact"
      receivedPermissions.1.from:
-        "0xCcfa1f8A93640488E3E1AE90A0edAf44680E9f82"
+        "0xC206D300b07cB905Cb1831d8a9172d4c66394638"
      receivedPermissions.1.via:
-        [{"address":"0xd35FeF329Bb6569baa373BDa702F3dfF59D57321"}]
      receivedPermissions.1.description:
+        "can pull funds from the contract in case of emergency."
      receivedPermissions.1.role:
+        ".owner"
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
    EOA  (0xD0b4c3aC8A50B6F1B3949ADaf55Cc9805620EB57) {
    +++ description: None
      receivedPermissions.0.role:
+        ".batcherHash"
    }
```

```diff
    contract ProxyAdmin (0xd35FeF329Bb6569baa373BDa702F3dfF59D57321) {
    +++ description: None
      directlyReceivedPermissions.8.role:
+        "admin"
      directlyReceivedPermissions.7.role:
+        "admin"
      directlyReceivedPermissions.6.from:
-        "0xFD4918e51d1e5aa2195C42654CF769b152C9d9C0"
+        "0xFc1D560eB01443e31B0EB56620703E80e42A7E4e"
      directlyReceivedPermissions.6.description:
-        "upgrading the bridge implementation can give access to all funds escrowed therein."
      directlyReceivedPermissions.6.role:
+        "admin"
      directlyReceivedPermissions.5.from:
-        "0xFc1D560eB01443e31B0EB56620703E80e42A7E4e"
+        "0xde9FDA9C499bA1C0168AC083acF5BEc5cC67fA76"
      directlyReceivedPermissions.5.role:
+        "admin"
      directlyReceivedPermissions.4.from:
-        "0xde9FDA9C499bA1C0168AC083acF5BEc5cC67fA76"
+        "0xb5150595F1E2240b76F414dc96509f5125ba5DD0"
      directlyReceivedPermissions.4.role:
+        "admin"
      directlyReceivedPermissions.3.from:
-        "0xb5150595F1E2240b76F414dc96509f5125ba5DD0"
+        "0xC206D300b07cB905Cb1831d8a9172d4c66394638"
      directlyReceivedPermissions.3.role:
+        "admin"
      directlyReceivedPermissions.2.from:
-        "0xC206D300b07cB905Cb1831d8a9172d4c66394638"
+        "0xCcfa1f8A93640488E3E1AE90A0edAf44680E9f82"
      directlyReceivedPermissions.2.role:
+        "admin"
      directlyReceivedPermissions.1.from:
-        "0xCcfa1f8A93640488E3E1AE90A0edAf44680E9f82"
+        "0xFD4918e51d1e5aa2195C42654CF769b152C9d9C0"
      directlyReceivedPermissions.1.description:
+        "upgrading the bridge implementation can give access to all funds escrowed therein."
      directlyReceivedPermissions.1.role:
+        ".$admin"
      directlyReceivedPermissions.0.role:
+        ".owner"
    }
```

Generated with discovered.json: 0x3d8a2fa622047003658561b9b797a57dbac1c621

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

Generated with discovered.json: 0x0dec4aa61d65e2ab15401f129e1cf45c4af7efbc

# Diff at Thu, 08 May 2025 08:50:26 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@8e1926142ab0c57cc131de4d8da307e13d9af54d block: 22244007
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
.../settlus/ethereum/.flat/DeputyPauseModule.sol   | 1338 ++++++++++++++++++++
 1 file changed, 1338 insertions(+)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22244007 (main branch discovery), not current.

```diff
    contract PermissionedDisputeGame (0xf9534EBc84082dF9d35Fb1Ed8786bF8cE8a90294) {
    +++ description: Same as FaultDisputeGame, but only two permissioned addresses are designated as proposer and challenger.
      usedTypes.0.arg.0x03682932cec7ce0a3874b19675a6bbc923054a7b321efc7d3835187b172494b6:
+        "v1.6.0 (cannon64)"
    }
```

Generated with discovered.json: 0x753e6b21c9a2e1adc98dadcd97ca4d50aa704d9f

# Diff at Tue, 29 Apr 2025 08:19:11 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@ef7477af00fe0b57a2f7cacf7e958c12494af662 block: 22244007
- current block number: 22244007

## Description

Field .issuedPermissions is removed from the output as no longer needed. Added 'permissionsConfigHash' due to refactoring of the modelling process (into a separate command).

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22244007 (main branch discovery), not current.

```diff
    contract LivenessModule (0x0454092516c9A4d636d3CAfA1e82161376C8a748) {
    +++ description: used to remove members inactive for 98d while making sure that the threshold remains above 75%. If the number of members falls below 8, the 0x847B5c174615B1B7fDF770882256e2D3E95b9D92 takes ownership of the multisig
      issuedPermissions:
-        [{"permission":"interact","to":"0x24424336F04440b1c28685a38303aC33C9D14a25","description":"can remove members of 0xc2819DC788505Aac350142A7A707BF9D03E3Bd03 inactive for 98d.","via":[]}]
    }
```

```diff
    contract SystemConfig (0x15C1dAED5443A77b4DcF6FE35cAFcCEBb0c6da0E) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      issuedPermissions:
-        [{"permission":"interact","to":"0x57669299e2a7D5BE46Ba817d8039C1350af830e8","description":"it can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system.","via":[]},{"permission":"sequence","to":"0xD0b4c3aC8A50B6F1B3949ADaf55Cc9805620EB57","via":[]},{"permission":"upgrade","to":"0xA4fB12D15Eb85dc9284a7df0AdBC8B696EdbbF1d","via":[{"address":"0xd35FeF329Bb6569baa373BDa702F3dfF59D57321"}]}]
    }
```

```diff
    contract OptimismMintableERC20Factory (0x44e9388e88Bb8edE446d62590d8A4C6d34813e98) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0xA4fB12D15Eb85dc9284a7df0AdBC8B696EdbbF1d","via":[{"address":"0xd35FeF329Bb6569baa373BDa702F3dfF59D57321"}]}]
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
    contract AnchorStateRegistry (0xb5150595F1E2240b76F414dc96509f5125ba5DD0) {
    +++ description: Contains the latest confirmed state root that can be used as a starting point in a dispute game.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0xA4fB12D15Eb85dc9284a7df0AdBC8B696EdbbF1d","via":[{"address":"0xd35FeF329Bb6569baa373BDa702F3dfF59D57321"}]}]
    }
```

```diff
    contract DelayedWETH (0xC206D300b07cB905Cb1831d8a9172d4c66394638) {
    +++ description: Contract designed to hold the bonded ETH for each game. It is designed as a wrapper around WETH to allow an owner to function as a backstop if a game would incorrectly distribute funds.
      issuedPermissions:
-        [{"permission":"interact","to":"0xA4fB12D15Eb85dc9284a7df0AdBC8B696EdbbF1d","description":"can pull funds from the contract in case of emergency.","via":[]},{"permission":"upgrade","to":"0xA4fB12D15Eb85dc9284a7df0AdBC8B696EdbbF1d","via":[{"address":"0xd35FeF329Bb6569baa373BDa702F3dfF59D57321"}]}]
    }
```

```diff
    contract AddressManager (0xC24C700BC65a3b15De13e489e155c81F621B1856) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      issuedPermissions:
-        [{"permission":"interact","to":"0xA4fB12D15Eb85dc9284a7df0AdBC8B696EdbbF1d","description":"set and change address mappings.","via":[{"address":"0xd35FeF329Bb6569baa373BDa702F3dfF59D57321"}]}]
    }
```

```diff
    contract L1ERC721Bridge (0xCcfa1f8A93640488E3E1AE90A0edAf44680E9f82) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0xA4fB12D15Eb85dc9284a7df0AdBC8B696EdbbF1d","via":[{"address":"0xd35FeF329Bb6569baa373BDa702F3dfF59D57321"}]}]
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
    contract DisputeGameFactory (0xde9FDA9C499bA1C0168AC083acF5BEc5cC67fA76) {
    +++ description: The dispute game factory allows the creation of dispute games, used to propose state roots and eventually challenge them.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0xA4fB12D15Eb85dc9284a7df0AdBC8B696EdbbF1d","via":[{"address":"0xd35FeF329Bb6569baa373BDa702F3dfF59D57321"}]}]
    }
```

```diff
    contract PermissionedDisputeGame (0xf9534EBc84082dF9d35Fb1Ed8786bF8cE8a90294) {
    +++ description: Same as FaultDisputeGame, but only two permissioned addresses are designated as proposer and challenger.
      issuedPermissions:
-        [{"permission":"challenge","to":"0xA4fB12D15Eb85dc9284a7df0AdBC8B696EdbbF1d","via":[]},{"permission":"propose","to":"0x1bC6Df949b8eDC8EE61adB99d578A7a6E6Ff7310","via":[]}]
    }
```

```diff
    contract OptimismPortal2 (0xFc1D560eB01443e31B0EB56620703E80e42A7E4e) {
    +++ description: The OptimismPortal contract is the main entry point to deposit funds from L1 to L2. It also allows to prove and finalize withdrawals. It specifies which game type can be used for withdrawals, which currently is the PermissionedDisputeGame.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0xA4fB12D15Eb85dc9284a7df0AdBC8B696EdbbF1d","via":[{"address":"0xd35FeF329Bb6569baa373BDa702F3dfF59D57321"}]}]
    }
```

```diff
    contract L1StandardBridge (0xFD4918e51d1e5aa2195C42654CF769b152C9d9C0) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0xA4fB12D15Eb85dc9284a7df0AdBC8B696EdbbF1d","description":"upgrading the bridge implementation can give access to all funds escrowed therein.","via":[{"address":"0xd35FeF329Bb6569baa373BDa702F3dfF59D57321"}]}]
    }
```

Generated with discovered.json: 0x151d144c18e05969a21fd67947e6ffd76e72857c

# Diff at Fri, 11 Apr 2025 13:16:18 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@b607477490db79d49274f7585039ac7263456118 block: 22244007
- current block number: 22244007

## Description

Config: global mapping updated for op stack prestates.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22244007 (main branch discovery), not current.

```diff
    contract PermissionedDisputeGame (0xf9534EBc84082dF9d35Fb1Ed8786bF8cE8a90294) {
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

Generated with discovered.json: 0x8f258791e26a28a4fbcd34ad54d47a61bb860ccb

# Diff at Thu, 10 Apr 2025 14:43:04 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@f38a3c9bf359344e4c4cd3006f58271cb8f78d15 block: 22208464
- current block number: 22208464

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22208464 (main branch discovery), not current.

```diff
    contract SuperchainProxyAdmin (0x543bA4AADBAb8f9025686Bd03993043599c6fB04) {
    +++ description: None
      displayName:
-        "ProxyAdmin"
    }
```

Generated with discovered.json: 0x5e344c5a32a7e413fc28a6e647c1c291d26a8d64

# Diff at Sun, 06 Apr 2025 07:50:31 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@02dea11f7707601873600e275c4e2b7792c1a190 block: 22195794
- current block number: 22208464

## Description

add proposer, challenger permission.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22195794 (main branch discovery), not current.

```diff
    contract undefined (0x1bC6Df949b8eDC8EE61adB99d578A7a6E6Ff7310) {
    +++ description: None
      receivedPermissions:
+        [{"permission":"propose","from":"0xf9534EBc84082dF9d35Fb1Ed8786bF8cE8a90294"}]
    }
```

```diff
    contract Alchemy Multisig 1 (0xA4fB12D15Eb85dc9284a7df0AdBC8B696EdbbF1d) {
    +++ description: None
      receivedPermissions.10:
+        {"permission":"upgrade","from":"0x15C1dAED5443A77b4DcF6FE35cAFcCEBb0c6da0E","via":[{"address":"0xd35FeF329Bb6569baa373BDa702F3dfF59D57321"}]}
      receivedPermissions.9.from:
-        "0x15C1dAED5443A77b4DcF6FE35cAFcCEBb0c6da0E"
+        "0x44e9388e88Bb8edE446d62590d8A4C6d34813e98"
      receivedPermissions.8.permission:
-        "upgrade"
+        "interact"
      receivedPermissions.8.from:
-        "0x44e9388e88Bb8edE446d62590d8A4C6d34813e98"
+        "0xC206D300b07cB905Cb1831d8a9172d4c66394638"
      receivedPermissions.8.via:
-        [{"address":"0xd35FeF329Bb6569baa373BDa702F3dfF59D57321"}]
      receivedPermissions.8.description:
+        "can pull funds from the contract in case of emergency."
      receivedPermissions.7.permission:
-        "interact"
+        "challenge"
      receivedPermissions.7.from:
-        "0xC206D300b07cB905Cb1831d8a9172d4c66394638"
+        "0xf9534EBc84082dF9d35Fb1Ed8786bF8cE8a90294"
      receivedPermissions.7.description:
-        "can pull funds from the contract in case of emergency."
    }
```

```diff
    contract PermissionedDisputeGame (0xf9534EBc84082dF9d35Fb1Ed8786bF8cE8a90294) {
    +++ description: Same as FaultDisputeGame, but only two permissioned addresses are designated as proposer and challenger.
      issuedPermissions:
+        [{"permission":"challenge","to":"0xA4fB12D15Eb85dc9284a7df0AdBC8B696EdbbF1d","via":[]},{"permission":"propose","to":"0x1bC6Df949b8eDC8EE61adB99d578A7a6E6Ff7310","via":[]}]
    }
```

Generated with discovered.json: 0x33ebf6e1d182b7763fb455e9a19dea092ab18dd9

# Diff at Fri, 04 Apr 2025 13:17:10 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- current block number: 22195794

## Description

Standard OP chain.

## Initial discovery

```diff
+   Status: CREATED
    contract LivenessModule (0x0454092516c9A4d636d3CAfA1e82161376C8a748)
    +++ description: used to remove members inactive for 98d while making sure that the threshold remains above 75%. If the number of members falls below 8, the 0x847B5c174615B1B7fDF770882256e2D3E95b9D92 takes ownership of the multisig
```

```diff
+   Status: CREATED
    contract Optimism Guardian Multisig (0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SystemConfig (0x15C1dAED5443A77b4DcF6FE35cAFcCEBb0c6da0E)
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
```

```diff
+   Status: CREATED
    contract LivenessGuard (0x24424336F04440b1c28685a38303aC33C9D14a25)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafe (0x42d27eEA1AD6e22Af6284F609847CB3Cd56B9c64)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OptimismMintableERC20Factory (0x44e9388e88Bb8edE446d62590d8A4C6d34813e98)
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
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
    contract L1CrossDomainMessenger (0x9BdA922e6f1bD53c24F9bCFb88B9638199A82CEb)
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
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
    contract AnchorStateRegistry (0xb5150595F1E2240b76F414dc96509f5125ba5DD0)
    +++ description: Contains the latest confirmed state root that can be used as a starting point in a dispute game.
```

```diff
+   Status: CREATED
    contract DelayedWETH (0xC206D300b07cB905Cb1831d8a9172d4c66394638)
    +++ description: Contract designed to hold the bonded ETH for each game. It is designed as a wrapper around WETH to allow an owner to function as a backstop if a game would incorrectly distribute funds.
```

```diff
+   Status: CREATED
    contract AddressManager (0xC24C700BC65a3b15De13e489e155c81F621B1856)
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
```

```diff
+   Status: CREATED
    contract Optimism Security Council (0xc2819DC788505Aac350142A7A707BF9D03E3Bd03)
    +++ description: None
```

```diff
+   Status: CREATED
    contract DeputyGuardianModule (0xc6901F65369FC59fC1B4D6D6bE7A2318Ff38dB5B)
    +++ description: allows the 0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A, called the deputy guardian, to act on behalf of the Gnosis Safe.
```

```diff
+   Status: CREATED
    contract L1ERC721Bridge (0xCcfa1f8A93640488E3E1AE90A0edAf44680E9f82)
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0xd35FeF329Bb6569baa373BDa702F3dfF59D57321)
    +++ description: None
```

```diff
+   Status: CREATED
    contract AddressManager (0xdE1FCfB0851916CA5101820A69b13a4E276bd81F)
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
```

```diff
+   Status: CREATED
    contract DisputeGameFactory (0xde9FDA9C499bA1C0168AC083acF5BEc5cC67fA76)
    +++ description: The dispute game factory allows the creation of dispute games, used to propose state roots and eventually challenge them.
```

```diff
+   Status: CREATED
    contract PermissionedDisputeGame (0xf9534EBc84082dF9d35Fb1Ed8786bF8cE8a90294)
    +++ description: Same as FaultDisputeGame, but only two permissioned addresses are designated as proposer and challenger.
```

```diff
+   Status: CREATED
    contract OptimismPortal2 (0xFc1D560eB01443e31B0EB56620703E80e42A7E4e)
    +++ description: The OptimismPortal contract is the main entry point to deposit funds from L1 to L2. It also allows to prove and finalize withdrawals. It specifies which game type can be used for withdrawals, which currently is the PermissionedDisputeGame.
```

```diff
+   Status: CREATED
    contract L1StandardBridge (0xFD4918e51d1e5aa2195C42654CF769b152C9d9C0)
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
```
