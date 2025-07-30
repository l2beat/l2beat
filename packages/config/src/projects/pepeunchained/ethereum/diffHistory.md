Generated with discovered.json: 0xd40176beb85b12a122c7878f7f8f710568134e1e

# Diff at Mon, 28 Jul 2025 05:55:44 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@8e540d8d4e2ea097e63a067c52194d1bf06f9b4a block: 22895944
- current block number: 23015685

## Description

Op stack gov upgrade: standard SuperchainConfig is not used and OpFoundationOperationsSafe is now the direct guardian.

disco archived since project is archived.

## Watched changes

```diff
-   Status: DELETED
    contract LivenessModule (0x0454092516c9A4d636d3CAfA1e82161376C8a748)
    +++ description: used to remove members inactive for 98d while making sure that the threshold remains above 75%. If the number of members falls below 8, the eth:0x847B5c174615B1B7fDF770882256e2D3E95b9D92 takes ownership of the multisig
```

```diff
-   Status: DELETED
    contract Optimism Guardian Multisig (0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2)
    +++ description: None
```

```diff
-   Status: DELETED
    contract DeputyPauseModule (0x126a736B18E0a64fBA19D421647A530E327E112C)
    +++ description: Allows eth:0x352f1defB49718e7Ea411687E850aA8d6299F7aC, called the deputy pauser, to act on behalf of the eth:0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A if set as its Safe module.
```

```diff
-   Status: DELETED
    contract LivenessGuard (0x24424336F04440b1c28685a38303aC33C9D14a25)
    +++ description: Modular contract to be used together with the LivenessModule. Tracks liveness / activity of Safe owners.
```

```diff
-   Status: DELETED
    contract SuperchainProxyAdmin (0x543bA4AADBAb8f9025686Bd03993043599c6fB04)
    +++ description: None
```

```diff
-   Status: DELETED
    contract SuperchainProxyAdminOwner (0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A)
    +++ description: None
```

```diff
-   Status: DELETED
    contract OpFoundationUpgradeSafe (0x847B5c174615B1B7fDF770882256e2D3E95b9D92)
    +++ description: None
```

```diff
-   Status: DELETED
    contract SuperchainConfig (0x95703e0982140D16f8ebA6d158FccEde42f04a4C)
    +++ description: Used to manage global configuration values for multiple OP Chains within a single Superchain network. The SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the Superchain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
```

```diff
    contract OpFoundationOperationsSafe (0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A) {
    +++ description: None
      values.getModules.0:
-        "eth:0x126a736B18E0a64fBA19D421647A530E327E112C"
      values.GnosisSafe_modules.0:
-        "eth:0x126a736B18E0a64fBA19D421647A530E327E112C"
      receivedPermissions.2:
-        {"permission":"guard","from":"eth:0x95703e0982140D16f8ebA6d158FccEde42f04a4C","role":".guardian","via":[{"address":"eth:0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2"},{"address":"eth:0xc6901F65369FC59fC1B4D6D6bE7A2318Ff38dB5B","condition":"if not revoked by the Security Council"}]}
      directlyReceivedPermissions:
-        [{"permission":"act","from":"eth:0xc6901F65369FC59fC1B4D6D6bE7A2318Ff38dB5B","role":".deputyGuardian","condition":"if not revoked by the Security Council"}]
    }
```

```diff
-   Status: DELETED
    contract Optimism Security Council (0xc2819DC788505Aac350142A7A707BF9D03E3Bd03)
    +++ description: None
```

```diff
-   Status: DELETED
    contract DeputyGuardianModule (0xc6901F65369FC59fC1B4D6D6bE7A2318Ff38dB5B)
    +++ description: allows the eth:0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A, called the deputy guardian, to act on behalf of the Gnosis Safe.
```

```diff
-   Status: DELETED
    contract AddressManager (0xdE1FCfB0851916CA5101820A69b13a4E276bd81F)
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
```

## Source code changes

```diff
.../dev/null                                       |  152 ---
 .../AddressManager.sol}                            |    0
 .../DeputyGuardianModule.sol => /dev/null          |  156 ---
 .../DeputyPauseModule.sol => /dev/null             | 1338 --------------------
 .../.flat@22895944/LivenessGuard.sol => /dev/null  |  582 ---------
 .../.flat@22895944/LivenessModule.sol => /dev/null |  258 ----
 .../GnosisSafe.sol => /dev/null                    |  953 --------------
 .../GnosisSafeProxy.p.sol => /dev/null             |   35 -
 .../GnosisSafe.sol => /dev/null                    |  953 --------------
 .../GnosisSafeProxy.p.sol => /dev/null             |   35 -
 .../GnosisSafe.sol => /dev/null                    |  953 --------------
 .../GnosisSafeProxy.p.sol => /dev/null             |   35 -
 .../SuperchainConfig}/Proxy.p.sol                  |    0
 .../SuperchainConfig}/SuperchainConfig.sol         |    0
 .../Proxy.p.sol => /dev/null                       |  200 ---
 .../SuperchainConfig.sol => /dev/null              |  477 -------
 .../SuperchainProxyAdmin.sol => /dev/null          |  298 -----
 .../GnosisSafe.sol => /dev/null                    |  953 --------------
 .../GnosisSafeProxy.p.sol => /dev/null             |   35 -
 19 files changed, 7413 deletions(-)
```

Generated with discovered.json: 0x82dc9d2cb9707b909cc2df1aa6715eb56c83d093

# Diff at Fri, 25 Jul 2025 13:52:19 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@85b717d6efe0c0a7691beb49532a0ce49bb7634a block: 22895944
- current block number: 22895944

## Description

templatize op upgrade 16 contracts

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22895944 (main branch discovery), not current.

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
      receivedPermissions.1.via.1.condition:
-        "though restricted to the global pause function"
+        "though restricted to the SuperchainConfig's `pause()` function"
      receivedPermissions.2.via.3.condition:
-        "though restricted to the global pause function"
+        "though restricted to the SuperchainConfig's `pause()` function"
      directlyReceivedPermissions.0.condition:
-        "though restricted to the global pause function"
+        "though restricted to the SuperchainConfig's `pause()` function"
    }
```

Generated with discovered.json: 0x0a42d4c1adff4473ee4430e01f8c7e02a320e30c

# Diff at Mon, 14 Jul 2025 12:45:55 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@9f4300dad2f3d080cd56fa311d4a848556c74e72 block: 22895944
- current block number: 22895944

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22895944 (main branch discovery), not current.

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
    contract SuperchainConfig (0x11654D67e0360A82e5Badd272Ced336B80972135) {
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      address:
-        "0x11654D67e0360A82e5Badd272Ced336B80972135"
+        "eth:0x11654D67e0360A82e5Badd272Ced336B80972135"
      values.$admin:
-        "0x320E53df19662A58fF4953d62B229E9BCAAC0b49"
+        "eth:0x320E53df19662A58fF4953d62B229E9BCAAC0b49"
      values.$implementation:
-        "0xF8b4a49204203a8449035Ec3ADd928556C8C6397"
+        "eth:0xF8b4a49204203a8449035Ec3ADd928556C8C6397"
      values.$pastUpgrades.0.2.0:
-        "0xF8b4a49204203a8449035Ec3ADd928556C8C6397"
+        "eth:0xF8b4a49204203a8449035Ec3ADd928556C8C6397"
      values.guardian:
-        "0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A"
+        "eth:0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A"
      implementationNames.0x11654D67e0360A82e5Badd272Ced336B80972135:
-        "Proxy"
      implementationNames.0xF8b4a49204203a8449035Ec3ADd928556C8C6397:
-        "SuperchainConfig"
      implementationNames.eth:0x11654D67e0360A82e5Badd272Ced336B80972135:
+        "Proxy"
      implementationNames.eth:0xF8b4a49204203a8449035Ec3ADd928556C8C6397:
+        "SuperchainConfig"
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
    EOA  (0x3041BA32f451F5850c147805F5521AC206421623) {
    +++ description: None
      address:
-        "0x3041BA32f451F5850c147805F5521AC206421623"
+        "eth:0x3041BA32f451F5850c147805F5521AC206421623"
    }
```

```diff
    contract ProxyAdmin (0x320E53df19662A58fF4953d62B229E9BCAAC0b49) {
    +++ description: None
      address:
-        "0x320E53df19662A58fF4953d62B229E9BCAAC0b49"
+        "eth:0x320E53df19662A58fF4953d62B229E9BCAAC0b49"
      values.addressManager:
-        "0xC3BcdF5cb9AEA2cc4938C9D1AA866CF0BA6B19b5"
+        "eth:0xC3BcdF5cb9AEA2cc4938C9D1AA866CF0BA6B19b5"
      values.owner:
-        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
+        "eth:0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      implementationNames.0x320E53df19662A58fF4953d62B229E9BCAAC0b49:
-        "ProxyAdmin"
      implementationNames.eth:0x320E53df19662A58fF4953d62B229E9BCAAC0b49:
+        "ProxyAdmin"
    }
```

```diff
    EOA  (0x3276053cb5C0fEb1825678e6D9441ddc935FE12e) {
    +++ description: None
      address:
-        "0x3276053cb5C0fEb1825678e6D9441ddc935FE12e"
+        "eth:0x3276053cb5C0fEb1825678e6D9441ddc935FE12e"
    }
```

```diff
    contract L1StandardBridge (0x34Ef4B527DB3F4AcfAE7Fdc7Db0f9981F48Cd23F) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      address:
-        "0x34Ef4B527DB3F4AcfAE7Fdc7Db0f9981F48Cd23F"
+        "eth:0x34Ef4B527DB3F4AcfAE7Fdc7Db0f9981F48Cd23F"
      values.$admin:
-        "0x320E53df19662A58fF4953d62B229E9BCAAC0b49"
+        "eth:0x320E53df19662A58fF4953d62B229E9BCAAC0b49"
      values.$implementation:
-        "0x8A51D7311DB5C5DBfB344e79b85d516aD5C72324"
+        "eth:0x8A51D7311DB5C5DBfB344e79b85d516aD5C72324"
      values.l2TokenBridge:
-        "0x4200000000000000000000000000000000000010"
+        "eth:0x4200000000000000000000000000000000000010"
      values.messenger:
-        "0x6007758DBd8c9e83e24761D248e51850Ff2612CC"
+        "eth:0x6007758DBd8c9e83e24761D248e51850Ff2612CC"
      values.MESSENGER:
-        "0x6007758DBd8c9e83e24761D248e51850Ff2612CC"
+        "eth:0x6007758DBd8c9e83e24761D248e51850Ff2612CC"
      values.OTHER_BRIDGE:
-        "0x4200000000000000000000000000000000000010"
+        "eth:0x4200000000000000000000000000000000000010"
      values.otherBridge:
-        "0x4200000000000000000000000000000000000010"
+        "eth:0x4200000000000000000000000000000000000010"
      values.superchainConfig:
-        "0x11654D67e0360A82e5Badd272Ced336B80972135"
+        "eth:0x11654D67e0360A82e5Badd272Ced336B80972135"
      values.systemConfig:
-        "0xF41E72f55d9bE849ecCe3b7AEe2A07Ccdadb655d"
+        "eth:0xF41E72f55d9bE849ecCe3b7AEe2A07Ccdadb655d"
      implementationNames.0x34Ef4B527DB3F4AcfAE7Fdc7Db0f9981F48Cd23F:
-        "L1ChugSplashProxy"
      implementationNames.0x8A51D7311DB5C5DBfB344e79b85d516aD5C72324:
-        "L1StandardBridge"
      implementationNames.eth:0x34Ef4B527DB3F4AcfAE7Fdc7Db0f9981F48Cd23F:
+        "L1ChugSplashProxy"
      implementationNames.eth:0x8A51D7311DB5C5DBfB344e79b85d516aD5C72324:
+        "L1StandardBridge"
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
    EOA  (0x3840f487A17A41100DD1Bf0946c34f132a57Fd5f) {
    +++ description: None
      address:
-        "0x3840f487A17A41100DD1Bf0946c34f132a57Fd5f"
+        "eth:0x3840f487A17A41100DD1Bf0946c34f132a57Fd5f"
    }
```

```diff
    contract OptimismPortal (0x384e3AE4D5efC9471201039b555EAe496b2A7240) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      address:
-        "0x384e3AE4D5efC9471201039b555EAe496b2A7240"
+        "eth:0x384e3AE4D5efC9471201039b555EAe496b2A7240"
      values.$admin:
-        "0x320E53df19662A58fF4953d62B229E9BCAAC0b49"
+        "eth:0x320E53df19662A58fF4953d62B229E9BCAAC0b49"
      values.$implementation:
-        "0xdAc90BD578f229D33D68735B398b544027E3285e"
+        "eth:0xdAc90BD578f229D33D68735B398b544027E3285e"
      values.$pastUpgrades.0.2.0:
-        "0xdAc90BD578f229D33D68735B398b544027E3285e"
+        "eth:0xdAc90BD578f229D33D68735B398b544027E3285e"
      values.guardian:
-        "0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A"
+        "eth:0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A"
      values.l2Oracle:
-        "0xb9c4EA7171b588e8D4c3F63e955Cd61e5172bb92"
+        "eth:0xb9c4EA7171b588e8D4c3F63e955Cd61e5172bb92"
      values.l2Sender:
-        "0x000000000000000000000000000000000000dEaD"
+        "eth:0x000000000000000000000000000000000000dEaD"
      values.superchainConfig:
-        "0x11654D67e0360A82e5Badd272Ced336B80972135"
+        "eth:0x11654D67e0360A82e5Badd272Ced336B80972135"
      values.systemConfig:
-        "0xF41E72f55d9bE849ecCe3b7AEe2A07Ccdadb655d"
+        "eth:0xF41E72f55d9bE849ecCe3b7AEe2A07Ccdadb655d"
      implementationNames.0x384e3AE4D5efC9471201039b555EAe496b2A7240:
-        "Proxy"
      implementationNames.0xdAc90BD578f229D33D68735B398b544027E3285e:
-        "OptimismPortal"
      implementationNames.eth:0x384e3AE4D5efC9471201039b555EAe496b2A7240:
+        "Proxy"
      implementationNames.eth:0xdAc90BD578f229D33D68735B398b544027E3285e:
+        "OptimismPortal"
    }
```

```diff
    contract OptimismMintableERC20Factory (0x3D831FD51f80398488a2452b9Ba44eDe104e8789) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintableERC20 as this chain's representation of a token on the host chain, or vice-versa.
      address:
-        "0x3D831FD51f80398488a2452b9Ba44eDe104e8789"
+        "eth:0x3D831FD51f80398488a2452b9Ba44eDe104e8789"
      values.$admin:
-        "0x320E53df19662A58fF4953d62B229E9BCAAC0b49"
+        "eth:0x320E53df19662A58fF4953d62B229E9BCAAC0b49"
      values.$implementation:
-        "0xA4C2F8848b68ba4D5f6C4c35D85E83CAA055343E"
+        "eth:0xA4C2F8848b68ba4D5f6C4c35D85E83CAA055343E"
      values.$pastUpgrades.0.2.0:
-        "0xA4C2F8848b68ba4D5f6C4c35D85E83CAA055343E"
+        "eth:0xA4C2F8848b68ba4D5f6C4c35D85E83CAA055343E"
      values.bridge:
-        "0x34Ef4B527DB3F4AcfAE7Fdc7Db0f9981F48Cd23F"
+        "eth:0x34Ef4B527DB3F4AcfAE7Fdc7Db0f9981F48Cd23F"
      values.BRIDGE:
-        "0x34Ef4B527DB3F4AcfAE7Fdc7Db0f9981F48Cd23F"
+        "eth:0x34Ef4B527DB3F4AcfAE7Fdc7Db0f9981F48Cd23F"
      implementationNames.0x3D831FD51f80398488a2452b9Ba44eDe104e8789:
-        "Proxy"
      implementationNames.0xA4C2F8848b68ba4D5f6C4c35D85E83CAA055343E:
-        "OptimismMintableERC20Factory"
      implementationNames.eth:0x3D831FD51f80398488a2452b9Ba44eDe104e8789:
+        "Proxy"
      implementationNames.eth:0xA4C2F8848b68ba4D5f6C4c35D85E83CAA055343E:
+        "OptimismMintableERC20Factory"
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
    contract Conduit Multisig 1 (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      address:
-        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
+        "eth:0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      values.$implementation:
-        "0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
+        "eth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
      values.$members.0:
-        "0x81175155D85377C337d92f1FA52Da166C3A4E7Ac"
+        "eth:0x81175155D85377C337d92f1FA52Da166C3A4E7Ac"
      values.$members.1:
-        "0x860e06Fe384D1A3340111e7D142E02642178c053"
+        "eth:0x860e06Fe384D1A3340111e7D142E02642178c053"
      values.$members.2:
-        "0x50930d652266EF4127FA3A1906B7Cb9951076628"
+        "eth:0x50930d652266EF4127FA3A1906B7Cb9951076628"
      values.$members.3:
-        "0xA0737fea60F0601A192E3d2c98865A883ab0bda2"
+        "eth:0xA0737fea60F0601A192E3d2c98865A883ab0bda2"
      values.$members.4:
-        "0xF3313C48BD8E17b823d5498D62F37019dFEA647D"
+        "eth:0xF3313C48BD8E17b823d5498D62F37019dFEA647D"
      values.$members.5:
-        "0xF0B77EaE7F2dabCC2571c7418406A0dCA3afA4f0"
+        "eth:0xF0B77EaE7F2dabCC2571c7418406A0dCA3afA4f0"
      values.$members.6:
-        "0xa4000bDD2bB92ce6750b31F1eeda47Bd1cB8e6e4"
+        "eth:0xa4000bDD2bB92ce6750b31F1eeda47Bd1cB8e6e4"
      values.$members.7:
-        "0x3840f487A17A41100DD1Bf0946c34f132a57Fd5f"
+        "eth:0x3840f487A17A41100DD1Bf0946c34f132a57Fd5f"
      values.$members.8:
-        "0xa0C600a6e85bf225958FFAcC70B5FDDF9A059038"
+        "eth:0xa0C600a6e85bf225958FFAcC70B5FDDF9A059038"
      values.$members.9:
-        "0xefCf0c8faFB425997870f845e26fC6cA6EE6dD5C"
+        "eth:0xefCf0c8faFB425997870f845e26fC6cA6EE6dD5C"
      values.$members.10:
-        "0x4D8007a0E9f293e62E2b0F43C6Cf4C4B9e135BAe"
+        "eth:0x4D8007a0E9f293e62E2b0F43C6Cf4C4B9e135BAe"
      implementationNames.0x4a4962275DF8C60a80d3a25faEc5AA7De116A746:
-        "GnosisSafeProxy"
      implementationNames.0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
-        "GnosisSafe"
      implementationNames.eth:0x4a4962275DF8C60a80d3a25faEc5AA7De116A746:
+        "GnosisSafeProxy"
      implementationNames.eth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
+        "GnosisSafe"
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
    EOA  (0x4D8007a0E9f293e62E2b0F43C6Cf4C4B9e135BAe) {
    +++ description: None
      address:
-        "0x4D8007a0E9f293e62E2b0F43C6Cf4C4B9e135BAe"
+        "eth:0x4D8007a0E9f293e62E2b0F43C6Cf4C4B9e135BAe"
    }
```

```diff
    EOA  (0x50930d652266EF4127FA3A1906B7Cb9951076628) {
    +++ description: None
      address:
-        "0x50930d652266EF4127FA3A1906B7Cb9951076628"
+        "eth:0x50930d652266EF4127FA3A1906B7Cb9951076628"
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
    EOA  (0x5c89b56bead2f99d41721f1D15442Fe813879587) {
    +++ description: None
      address:
-        "0x5c89b56bead2f99d41721f1D15442Fe813879587"
+        "eth:0x5c89b56bead2f99d41721f1D15442Fe813879587"
    }
```

```diff
    contract L1CrossDomainMessenger (0x6007758DBd8c9e83e24761D248e51850Ff2612CC) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      address:
-        "0x6007758DBd8c9e83e24761D248e51850Ff2612CC"
+        "eth:0x6007758DBd8c9e83e24761D248e51850Ff2612CC"
      values.$admin:
-        "0x320E53df19662A58fF4953d62B229E9BCAAC0b49"
+        "eth:0x320E53df19662A58fF4953d62B229E9BCAAC0b49"
      values.$implementation:
-        "0xe36A1936AdA988529946237cd23bbA42071138CB"
+        "eth:0xe36A1936AdA988529946237cd23bbA42071138CB"
      values.$pastUpgrades.0.2.0:
-        "0xe36A1936AdA988529946237cd23bbA42071138CB"
+        "eth:0xe36A1936AdA988529946237cd23bbA42071138CB"
      values.OTHER_MESSENGER:
-        "0x4200000000000000000000000000000000000007"
+        "eth:0x4200000000000000000000000000000000000007"
      values.otherMessenger:
-        "0x4200000000000000000000000000000000000007"
+        "eth:0x4200000000000000000000000000000000000007"
      values.portal:
-        "0x384e3AE4D5efC9471201039b555EAe496b2A7240"
+        "eth:0x384e3AE4D5efC9471201039b555EAe496b2A7240"
      values.PORTAL:
-        "0x384e3AE4D5efC9471201039b555EAe496b2A7240"
+        "eth:0x384e3AE4D5efC9471201039b555EAe496b2A7240"
      values.ResolvedDelegateProxy_addressManager:
-        "0xC3BcdF5cb9AEA2cc4938C9D1AA866CF0BA6B19b5"
+        "eth:0xC3BcdF5cb9AEA2cc4938C9D1AA866CF0BA6B19b5"
      values.superchainConfig:
-        "0x11654D67e0360A82e5Badd272Ced336B80972135"
+        "eth:0x11654D67e0360A82e5Badd272Ced336B80972135"
      values.systemConfig:
-        "0xF41E72f55d9bE849ecCe3b7AEe2A07Ccdadb655d"
+        "eth:0xF41E72f55d9bE849ecCe3b7AEe2A07Ccdadb655d"
      implementationNames.0x6007758DBd8c9e83e24761D248e51850Ff2612CC:
-        "ResolvedDelegateProxy"
      implementationNames.0xe36A1936AdA988529946237cd23bbA42071138CB:
-        "L1CrossDomainMessenger"
      implementationNames.eth:0x6007758DBd8c9e83e24761D248e51850Ff2612CC:
+        "ResolvedDelegateProxy"
      implementationNames.eth:0xe36A1936AdA988529946237cd23bbA42071138CB:
+        "L1CrossDomainMessenger"
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
    EOA  (0x81175155D85377C337d92f1FA52Da166C3A4E7Ac) {
    +++ description: None
      address:
-        "0x81175155D85377C337d92f1FA52Da166C3A4E7Ac"
+        "eth:0x81175155D85377C337d92f1FA52Da166C3A4E7Ac"
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
    EOA  (0x860e06Fe384D1A3340111e7D142E02642178c053) {
    +++ description: None
      address:
-        "0x860e06Fe384D1A3340111e7D142E02642178c053"
+        "eth:0x860e06Fe384D1A3340111e7D142E02642178c053"
    }
```

```diff
    EOA  (0x919B2511b2DB24Cc0C0EebE28b62a4E591579C1B) {
    +++ description: None
      address:
-        "0x919B2511b2DB24Cc0C0EebE28b62a4E591579C1B"
+        "eth:0x919B2511b2DB24Cc0C0EebE28b62a4E591579C1B"
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
    contract L1ERC721Bridge (0x9dd8e00Ff731FBf3dd3559578BeB518a41b16Cfe) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      address:
-        "0x9dd8e00Ff731FBf3dd3559578BeB518a41b16Cfe"
+        "eth:0x9dd8e00Ff731FBf3dd3559578BeB518a41b16Cfe"
      values.$admin:
-        "0x320E53df19662A58fF4953d62B229E9BCAAC0b49"
+        "eth:0x320E53df19662A58fF4953d62B229E9BCAAC0b49"
      values.$implementation:
-        "0x46Fd984c10648C26B4099e42a23a644B36ecA5A8"
+        "eth:0x46Fd984c10648C26B4099e42a23a644B36ecA5A8"
      values.$pastUpgrades.0.2.0:
-        "0x46Fd984c10648C26B4099e42a23a644B36ecA5A8"
+        "eth:0x46Fd984c10648C26B4099e42a23a644B36ecA5A8"
      values.messenger:
-        "0x6007758DBd8c9e83e24761D248e51850Ff2612CC"
+        "eth:0x6007758DBd8c9e83e24761D248e51850Ff2612CC"
      values.MESSENGER:
-        "0x6007758DBd8c9e83e24761D248e51850Ff2612CC"
+        "eth:0x6007758DBd8c9e83e24761D248e51850Ff2612CC"
      values.OTHER_BRIDGE:
-        "0x4200000000000000000000000000000000000014"
+        "eth:0x4200000000000000000000000000000000000014"
      values.otherBridge:
-        "0x4200000000000000000000000000000000000014"
+        "eth:0x4200000000000000000000000000000000000014"
      values.superchainConfig:
-        "0x11654D67e0360A82e5Badd272Ced336B80972135"
+        "eth:0x11654D67e0360A82e5Badd272Ced336B80972135"
      implementationNames.0x9dd8e00Ff731FBf3dd3559578BeB518a41b16Cfe:
-        "Proxy"
      implementationNames.0x46Fd984c10648C26B4099e42a23a644B36ecA5A8:
-        "L1ERC721Bridge"
      implementationNames.eth:0x9dd8e00Ff731FBf3dd3559578BeB518a41b16Cfe:
+        "Proxy"
      implementationNames.eth:0x46Fd984c10648C26B4099e42a23a644B36ecA5A8:
+        "L1ERC721Bridge"
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
    EOA  (0xA0737fea60F0601A192E3d2c98865A883ab0bda2) {
    +++ description: None
      address:
-        "0xA0737fea60F0601A192E3d2c98865A883ab0bda2"
+        "eth:0xA0737fea60F0601A192E3d2c98865A883ab0bda2"
    }
```

```diff
    EOA  (0xa0C600a6e85bf225958FFAcC70B5FDDF9A059038) {
    +++ description: None
      address:
-        "0xa0C600a6e85bf225958FFAcC70B5FDDF9A059038"
+        "eth:0xa0C600a6e85bf225958FFAcC70B5FDDF9A059038"
    }
```

```diff
    EOA  (0xa4000bDD2bB92ce6750b31F1eeda47Bd1cB8e6e4) {
    +++ description: None
      address:
-        "0xa4000bDD2bB92ce6750b31F1eeda47Bd1cB8e6e4"
+        "eth:0xa4000bDD2bB92ce6750b31F1eeda47Bd1cB8e6e4"
    }
```

```diff
    EOA  (0xa7AD24D2299Aa7025842bfF596B9806d31bC12D6) {
    +++ description: None
      address:
-        "0xa7AD24D2299Aa7025842bfF596B9806d31bC12D6"
+        "eth:0xa7AD24D2299Aa7025842bfF596B9806d31bC12D6"
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
    contract L2OutputOracle (0xb9c4EA7171b588e8D4c3F63e955Cd61e5172bb92) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      address:
-        "0xb9c4EA7171b588e8D4c3F63e955Cd61e5172bb92"
+        "eth:0xb9c4EA7171b588e8D4c3F63e955Cd61e5172bb92"
      values.$admin:
-        "0x320E53df19662A58fF4953d62B229E9BCAAC0b49"
+        "eth:0x320E53df19662A58fF4953d62B229E9BCAAC0b49"
      values.$implementation:
-        "0x1Fd1be2e1c65F136020d2CcC073ED8A7269aE53f"
+        "eth:0x1Fd1be2e1c65F136020d2CcC073ED8A7269aE53f"
      values.$pastUpgrades.0.2.0:
-        "0x1Fd1be2e1c65F136020d2CcC073ED8A7269aE53f"
+        "eth:0x1Fd1be2e1c65F136020d2CcC073ED8A7269aE53f"
      values.$pastUpgrades.1.2.0:
-        "0xd81f43eDBCAcb4c29a9bA38a13Ee5d79278270cC"
+        "eth:0xd81f43eDBCAcb4c29a9bA38a13Ee5d79278270cC"
      values.$pastUpgrades.2.2.0:
-        "0x1Fd1be2e1c65F136020d2CcC073ED8A7269aE53f"
+        "eth:0x1Fd1be2e1c65F136020d2CcC073ED8A7269aE53f"
+++ severity: HIGH
      values.challenger:
-        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
+        "eth:0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      values.CHALLENGER:
-        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
+        "eth:0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
+++ severity: HIGH
      values.proposer:
-        "0x919B2511b2DB24Cc0C0EebE28b62a4E591579C1B"
+        "eth:0x919B2511b2DB24Cc0C0EebE28b62a4E591579C1B"
      values.PROPOSER:
-        "0x919B2511b2DB24Cc0C0EebE28b62a4E591579C1B"
+        "eth:0x919B2511b2DB24Cc0C0EebE28b62a4E591579C1B"
      implementationNames.0xb9c4EA7171b588e8D4c3F63e955Cd61e5172bb92:
-        "Proxy"
      implementationNames.0x1Fd1be2e1c65F136020d2CcC073ED8A7269aE53f:
-        "L2OutputOracle"
      implementationNames.eth:0xb9c4EA7171b588e8D4c3F63e955Cd61e5172bb92:
+        "Proxy"
      implementationNames.eth:0x1Fd1be2e1c65F136020d2CcC073ED8A7269aE53f:
+        "L2OutputOracle"
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
    contract AddressManager (0xC3BcdF5cb9AEA2cc4938C9D1AA866CF0BA6B19b5) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      address:
-        "0xC3BcdF5cb9AEA2cc4938C9D1AA866CF0BA6B19b5"
+        "eth:0xC3BcdF5cb9AEA2cc4938C9D1AA866CF0BA6B19b5"
      values.owner:
-        "0x320E53df19662A58fF4953d62B229E9BCAAC0b49"
+        "eth:0x320E53df19662A58fF4953d62B229E9BCAAC0b49"
      implementationNames.0xC3BcdF5cb9AEA2cc4938C9D1AA866CF0BA6B19b5:
-        "AddressManager"
      implementationNames.eth:0xC3BcdF5cb9AEA2cc4938C9D1AA866CF0BA6B19b5:
+        "AddressManager"
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
    EOA  (0xEF9A98511939eEe6Ec69af62082E3F2ff606877c) {
    +++ description: None
      address:
-        "0xEF9A98511939eEe6Ec69af62082E3F2ff606877c"
+        "eth:0xEF9A98511939eEe6Ec69af62082E3F2ff606877c"
    }
```

```diff
    EOA  (0xefCf0c8faFB425997870f845e26fC6cA6EE6dD5C) {
    +++ description: None
      address:
-        "0xefCf0c8faFB425997870f845e26fC6cA6EE6dD5C"
+        "eth:0xefCf0c8faFB425997870f845e26fC6cA6EE6dD5C"
    }
```

```diff
    EOA  (0xF0B77EaE7F2dabCC2571c7418406A0dCA3afA4f0) {
    +++ description: None
      address:
-        "0xF0B77EaE7F2dabCC2571c7418406A0dCA3afA4f0"
+        "eth:0xF0B77EaE7F2dabCC2571c7418406A0dCA3afA4f0"
    }
```

```diff
    EOA  (0xF3313C48BD8E17b823d5498D62F37019dFEA647D) {
    +++ description: None
      address:
-        "0xF3313C48BD8E17b823d5498D62F37019dFEA647D"
+        "eth:0xF3313C48BD8E17b823d5498D62F37019dFEA647D"
    }
```

```diff
    contract SystemConfig (0xF41E72f55d9bE849ecCe3b7AEe2A07Ccdadb655d) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      address:
-        "0xF41E72f55d9bE849ecCe3b7AEe2A07Ccdadb655d"
+        "eth:0xF41E72f55d9bE849ecCe3b7AEe2A07Ccdadb655d"
      values.$admin:
-        "0x320E53df19662A58fF4953d62B229E9BCAAC0b49"
+        "eth:0x320E53df19662A58fF4953d62B229E9BCAAC0b49"
      values.$implementation:
-        "0x6f6584F82866aa297Eb5cE0d4Fed200dD0632833"
+        "eth:0x6f6584F82866aa297Eb5cE0d4Fed200dD0632833"
      values.$pastUpgrades.0.2.0:
-        "0x6f6584F82866aa297Eb5cE0d4Fed200dD0632833"
+        "eth:0x6f6584F82866aa297Eb5cE0d4Fed200dD0632833"
      values.batcherHash:
-        "0x5c89b56bead2f99d41721f1D15442Fe813879587"
+        "eth:0x5c89b56bead2f99d41721f1D15442Fe813879587"
      values.batchInbox:
-        "0x3276053cb5C0fEb1825678e6D9441ddc935FE12e"
+        "eth:0x3276053cb5C0fEb1825678e6D9441ddc935FE12e"
      values.disputeGameFactory:
-        "0x4e0371A2fCCf4CCC68217134bADa77914b50B7DD"
+        "eth:0x4e0371A2fCCf4CCC68217134bADa77914b50B7DD"
      values.gasPayingToken.addr_:
-        "0xadd39272E83895E7d3f244f696B7a25635F34234"
+        "eth:0xadd39272E83895E7d3f244f696B7a25635F34234"
      values.l1CrossDomainMessenger:
-        "0x6007758DBd8c9e83e24761D248e51850Ff2612CC"
+        "eth:0x6007758DBd8c9e83e24761D248e51850Ff2612CC"
      values.l1ERC721Bridge:
-        "0x9dd8e00Ff731FBf3dd3559578BeB518a41b16Cfe"
+        "eth:0x9dd8e00Ff731FBf3dd3559578BeB518a41b16Cfe"
      values.l1StandardBridge:
-        "0x34Ef4B527DB3F4AcfAE7Fdc7Db0f9981F48Cd23F"
+        "eth:0x34Ef4B527DB3F4AcfAE7Fdc7Db0f9981F48Cd23F"
      values.optimismMintableERC20Factory:
-        "0x3D831FD51f80398488a2452b9Ba44eDe104e8789"
+        "eth:0x3D831FD51f80398488a2452b9Ba44eDe104e8789"
      values.optimismPortal:
-        "0x384e3AE4D5efC9471201039b555EAe496b2A7240"
+        "eth:0x384e3AE4D5efC9471201039b555EAe496b2A7240"
      values.owner:
-        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
+        "eth:0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      values.sequencerInbox:
-        "0x3276053cb5C0fEb1825678e6D9441ddc935FE12e"
+        "eth:0x3276053cb5C0fEb1825678e6D9441ddc935FE12e"
      values.unsafeBlockSigner:
-        "0xa7AD24D2299Aa7025842bfF596B9806d31bC12D6"
+        "eth:0xa7AD24D2299Aa7025842bfF596B9806d31bC12D6"
      implementationNames.0xF41E72f55d9bE849ecCe3b7AEe2A07Ccdadb655d:
-        "Proxy"
      implementationNames.0x6f6584F82866aa297Eb5cE0d4Fed200dD0632833:
-        "SystemConfig"
      implementationNames.eth:0xF41E72f55d9bE849ecCe3b7AEe2A07Ccdadb655d:
+        "Proxy"
      implementationNames.eth:0x6f6584F82866aa297Eb5cE0d4Fed200dD0632833:
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
    contract SuperchainConfig (0x11654D67e0360A82e5Badd272Ced336B80972135)
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
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
    contract ProxyAdmin (0x320E53df19662A58fF4953d62B229E9BCAAC0b49)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1StandardBridge (0x34Ef4B527DB3F4AcfAE7Fdc7Db0f9981F48Cd23F)
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
```

```diff
+   Status: CREATED
    contract OptimismPortal (0x384e3AE4D5efC9471201039b555EAe496b2A7240)
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
```

```diff
+   Status: CREATED
    contract OptimismMintableERC20Factory (0x3D831FD51f80398488a2452b9Ba44eDe104e8789)
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintableERC20 as this chain's representation of a token on the host chain, or vice-versa.
```

```diff
+   Status: CREATED
    contract GnosisSafe (0x42d27eEA1AD6e22Af6284F609847CB3Cd56B9c64)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Conduit Multisig 1 (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746)
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
    contract L1CrossDomainMessenger (0x6007758DBd8c9e83e24761D248e51850Ff2612CC)
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
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
    contract L1ERC721Bridge (0x9dd8e00Ff731FBf3dd3559578BeB518a41b16Cfe)
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
```

```diff
+   Status: CREATED
    contract L2OutputOracle (0xb9c4EA7171b588e8D4c3F63e955Cd61e5172bb92)
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
```

```diff
+   Status: CREATED
    contract Optimism Security Council (0xc2819DC788505Aac350142A7A707BF9D03E3Bd03)
    +++ description: None
```

```diff
+   Status: CREATED
    contract AddressManager (0xC3BcdF5cb9AEA2cc4938C9D1AA866CF0BA6B19b5)
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
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
    contract SystemConfig (0xF41E72f55d9bE849ecCe3b7AEe2A07Ccdadb655d)
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
```

Generated with discovered.json: 0xf9c6c6b0e608c9bd29cae6dc4599dcb217eaae72

# Diff at Mon, 14 Jul 2025 08:02:46 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@0dc82cd5064c9c6dc9fb20e2291a8bb6b2048e27 block: 22895944
- current block number: 22895944

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22895944 (main branch discovery), not current.

```diff
    contract OptimismMintableERC20Factory (0x3D831FD51f80398488a2452b9Ba44eDe104e8789) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintableERC20 as this chain's representation of a token on the host chain, or vice-versa.
      description:
-        "A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa."
+        "A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintableERC20 as this chain's representation of a token on the host chain, or vice-versa."
    }
```

Generated with discovered.json: 0x0d6e207d649017d0644ae6a0a6ba598673286871

# Diff at Fri, 04 Jul 2025 12:19:14 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f56dc47fe915564d4555300304da4d3bcbc087f block: 22615673
- current block number: 22615673

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22615673 (main branch discovery), not current.

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
    contract ProxyAdmin (0x320E53df19662A58fF4953d62B229E9BCAAC0b49) {
    +++ description: None
      directlyReceivedPermissions.0.from:
-        "ethereum:0xC3BcdF5cb9AEA2cc4938C9D1AA866CF0BA6B19b5"
+        "eth:0xC3BcdF5cb9AEA2cc4938C9D1AA866CF0BA6B19b5"
      directlyReceivedPermissions.1.from:
-        "ethereum:0x11654D67e0360A82e5Badd272Ced336B80972135"
+        "eth:0x11654D67e0360A82e5Badd272Ced336B80972135"
      directlyReceivedPermissions.2.from:
-        "ethereum:0x34Ef4B527DB3F4AcfAE7Fdc7Db0f9981F48Cd23F"
+        "eth:0x34Ef4B527DB3F4AcfAE7Fdc7Db0f9981F48Cd23F"
      directlyReceivedPermissions.3.from:
-        "ethereum:0x384e3AE4D5efC9471201039b555EAe496b2A7240"
+        "eth:0x384e3AE4D5efC9471201039b555EAe496b2A7240"
      directlyReceivedPermissions.4.from:
-        "ethereum:0x3D831FD51f80398488a2452b9Ba44eDe104e8789"
+        "eth:0x3D831FD51f80398488a2452b9Ba44eDe104e8789"
      directlyReceivedPermissions.5.from:
-        "ethereum:0x6007758DBd8c9e83e24761D248e51850Ff2612CC"
+        "eth:0x6007758DBd8c9e83e24761D248e51850Ff2612CC"
      directlyReceivedPermissions.6.from:
-        "ethereum:0x9dd8e00Ff731FBf3dd3559578BeB518a41b16Cfe"
+        "eth:0x9dd8e00Ff731FBf3dd3559578BeB518a41b16Cfe"
      directlyReceivedPermissions.7.from:
-        "ethereum:0xb9c4EA7171b588e8D4c3F63e955Cd61e5172bb92"
+        "eth:0xb9c4EA7171b588e8D4c3F63e955Cd61e5172bb92"
      directlyReceivedPermissions.8.from:
-        "ethereum:0xF41E72f55d9bE849ecCe3b7AEe2A07Ccdadb655d"
+        "eth:0xF41E72f55d9bE849ecCe3b7AEe2A07Ccdadb655d"
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
-        "ethereum:0x11654D67e0360A82e5Badd272Ced336B80972135"
+        "eth:0x11654D67e0360A82e5Badd272Ced336B80972135"
      receivedPermissions.1.via.1.address:
-        "ethereum:0x126a736B18E0a64fBA19D421647A530E327E112C"
+        "eth:0x126a736B18E0a64fBA19D421647A530E327E112C"
      receivedPermissions.1.via.0.address:
-        "ethereum:0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A"
+        "eth:0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A"
      receivedPermissions.1.from:
-        "ethereum:0x384e3AE4D5efC9471201039b555EAe496b2A7240"
+        "eth:0x384e3AE4D5efC9471201039b555EAe496b2A7240"
      receivedPermissions.2.via.3.address:
-        "ethereum:0x126a736B18E0a64fBA19D421647A530E327E112C"
+        "eth:0x126a736B18E0a64fBA19D421647A530E327E112C"
      receivedPermissions.2.via.2.address:
-        "ethereum:0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A"
+        "eth:0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A"
      receivedPermissions.2.via.1.address:
-        "ethereum:0xc6901F65369FC59fC1B4D6D6bE7A2318Ff38dB5B"
+        "eth:0xc6901F65369FC59fC1B4D6D6bE7A2318Ff38dB5B"
      receivedPermissions.2.via.0.address:
-        "ethereum:0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2"
+        "eth:0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2"
      receivedPermissions.2.from:
-        "ethereum:0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
+        "eth:0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
      directlyReceivedPermissions.0.from:
-        "ethereum:0x126a736B18E0a64fBA19D421647A530E327E112C"
+        "eth:0x126a736B18E0a64fBA19D421647A530E327E112C"
    }
```

```diff
    contract Conduit Multisig 1 (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0xb9c4EA7171b588e8D4c3F63e955Cd61e5172bb92"
+        "eth:0xb9c4EA7171b588e8D4c3F63e955Cd61e5172bb92"
      receivedPermissions.1.from:
-        "ethereum:0xb9c4EA7171b588e8D4c3F63e955Cd61e5172bb92"
+        "eth:0xb9c4EA7171b588e8D4c3F63e955Cd61e5172bb92"
      receivedPermissions.2.via.0.address:
-        "ethereum:0x320E53df19662A58fF4953d62B229E9BCAAC0b49"
+        "eth:0x320E53df19662A58fF4953d62B229E9BCAAC0b49"
      receivedPermissions.2.from:
-        "ethereum:0xC3BcdF5cb9AEA2cc4938C9D1AA866CF0BA6B19b5"
+        "eth:0xC3BcdF5cb9AEA2cc4938C9D1AA866CF0BA6B19b5"
      receivedPermissions.3.from:
-        "ethereum:0xF41E72f55d9bE849ecCe3b7AEe2A07Ccdadb655d"
+        "eth:0xF41E72f55d9bE849ecCe3b7AEe2A07Ccdadb655d"
      receivedPermissions.4.via.0.address:
-        "ethereum:0x320E53df19662A58fF4953d62B229E9BCAAC0b49"
+        "eth:0x320E53df19662A58fF4953d62B229E9BCAAC0b49"
      receivedPermissions.4.from:
-        "ethereum:0x11654D67e0360A82e5Badd272Ced336B80972135"
+        "eth:0x11654D67e0360A82e5Badd272Ced336B80972135"
      receivedPermissions.5.via.0.address:
-        "ethereum:0x320E53df19662A58fF4953d62B229E9BCAAC0b49"
+        "eth:0x320E53df19662A58fF4953d62B229E9BCAAC0b49"
      receivedPermissions.5.from:
-        "ethereum:0x34Ef4B527DB3F4AcfAE7Fdc7Db0f9981F48Cd23F"
+        "eth:0x34Ef4B527DB3F4AcfAE7Fdc7Db0f9981F48Cd23F"
      receivedPermissions.6.via.0.address:
-        "ethereum:0x320E53df19662A58fF4953d62B229E9BCAAC0b49"
+        "eth:0x320E53df19662A58fF4953d62B229E9BCAAC0b49"
      receivedPermissions.6.from:
-        "ethereum:0x384e3AE4D5efC9471201039b555EAe496b2A7240"
+        "eth:0x384e3AE4D5efC9471201039b555EAe496b2A7240"
      receivedPermissions.7.via.0.address:
-        "ethereum:0x320E53df19662A58fF4953d62B229E9BCAAC0b49"
+        "eth:0x320E53df19662A58fF4953d62B229E9BCAAC0b49"
      receivedPermissions.7.from:
-        "ethereum:0x3D831FD51f80398488a2452b9Ba44eDe104e8789"
+        "eth:0x3D831FD51f80398488a2452b9Ba44eDe104e8789"
      receivedPermissions.8.via.0.address:
-        "ethereum:0x320E53df19662A58fF4953d62B229E9BCAAC0b49"
+        "eth:0x320E53df19662A58fF4953d62B229E9BCAAC0b49"
      receivedPermissions.8.from:
-        "ethereum:0x6007758DBd8c9e83e24761D248e51850Ff2612CC"
+        "eth:0x6007758DBd8c9e83e24761D248e51850Ff2612CC"
      receivedPermissions.9.via.0.address:
-        "ethereum:0x320E53df19662A58fF4953d62B229E9BCAAC0b49"
+        "eth:0x320E53df19662A58fF4953d62B229E9BCAAC0b49"
      receivedPermissions.9.from:
-        "ethereum:0x9dd8e00Ff731FBf3dd3559578BeB518a41b16Cfe"
+        "eth:0x9dd8e00Ff731FBf3dd3559578BeB518a41b16Cfe"
      receivedPermissions.10.via.0.address:
-        "ethereum:0x320E53df19662A58fF4953d62B229E9BCAAC0b49"
+        "eth:0x320E53df19662A58fF4953d62B229E9BCAAC0b49"
      receivedPermissions.10.from:
-        "ethereum:0xb9c4EA7171b588e8D4c3F63e955Cd61e5172bb92"
+        "eth:0xb9c4EA7171b588e8D4c3F63e955Cd61e5172bb92"
      receivedPermissions.11.via.0.address:
-        "ethereum:0x320E53df19662A58fF4953d62B229E9BCAAC0b49"
+        "eth:0x320E53df19662A58fF4953d62B229E9BCAAC0b49"
      receivedPermissions.11.from:
-        "ethereum:0xF41E72f55d9bE849ecCe3b7AEe2A07Ccdadb655d"
+        "eth:0xF41E72f55d9bE849ecCe3b7AEe2A07Ccdadb655d"
      directlyReceivedPermissions.0.from:
-        "ethereum:0x320E53df19662A58fF4953d62B229E9BCAAC0b49"
+        "eth:0x320E53df19662A58fF4953d62B229E9BCAAC0b49"
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
    EOA  (0x5c89b56bead2f99d41721f1D15442Fe813879587) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0xF41E72f55d9bE849ecCe3b7AEe2A07Ccdadb655d"
+        "eth:0xF41E72f55d9bE849ecCe3b7AEe2A07Ccdadb655d"
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
    EOA  (0x919B2511b2DB24Cc0C0EebE28b62a4E591579C1B) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0xb9c4EA7171b588e8D4c3F63e955Cd61e5172bb92"
+        "eth:0xb9c4EA7171b588e8D4c3F63e955Cd61e5172bb92"
      receivedPermissions.1.from:
-        "ethereum:0xb9c4EA7171b588e8D4c3F63e955Cd61e5172bb92"
+        "eth:0xb9c4EA7171b588e8D4c3F63e955Cd61e5172bb92"
    }
```

```diff
    contract OpFoundationOperationsSafe (0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0x11654D67e0360A82e5Badd272Ced336B80972135"
+        "eth:0x11654D67e0360A82e5Badd272Ced336B80972135"
      receivedPermissions.1.from:
-        "ethereum:0x384e3AE4D5efC9471201039b555EAe496b2A7240"
+        "eth:0x384e3AE4D5efC9471201039b555EAe496b2A7240"
      receivedPermissions.2.via.1.address:
-        "ethereum:0xc6901F65369FC59fC1B4D6D6bE7A2318Ff38dB5B"
+        "eth:0xc6901F65369FC59fC1B4D6D6bE7A2318Ff38dB5B"
      receivedPermissions.2.via.0.address:
-        "ethereum:0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2"
+        "eth:0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2"
      receivedPermissions.2.from:
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

Generated with discovered.json: 0x731217e40b7cd50ecbbe8e38d2be66aa707206ec

# Diff at Mon, 16 Jun 2025 08:42:30 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@e1208475abce20cea1768d2e4878c03350c1b7c9 block: 22615673
- current block number: 22615673

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22615673 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x320E53df19662A58fF4953d62B229E9BCAAC0b49) {
    +++ description: None
      directlyReceivedPermissions.8:
+        {"permission":"upgrade","from":"ethereum:0x9dd8e00Ff731FBf3dd3559578BeB518a41b16Cfe","role":"admin"}
      directlyReceivedPermissions.7.from:
-        "ethereum:0x9dd8e00Ff731FBf3dd3559578BeB518a41b16Cfe"
+        "ethereum:0x3D831FD51f80398488a2452b9Ba44eDe104e8789"
      directlyReceivedPermissions.6.from:
-        "ethereum:0x3D831FD51f80398488a2452b9Ba44eDe104e8789"
+        "ethereum:0x384e3AE4D5efC9471201039b555EAe496b2A7240"
      directlyReceivedPermissions.5.from:
-        "ethereum:0x384e3AE4D5efC9471201039b555EAe496b2A7240"
+        "ethereum:0xF41E72f55d9bE849ecCe3b7AEe2A07Ccdadb655d"
      directlyReceivedPermissions.4.from:
-        "ethereum:0xF41E72f55d9bE849ecCe3b7AEe2A07Ccdadb655d"
+        "ethereum:0x6007758DBd8c9e83e24761D248e51850Ff2612CC"
    }
```

```diff
    contract Conduit Multisig 1 (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      receivedPermissions.11:
+        {"permission":"upgrade","from":"ethereum:0x9dd8e00Ff731FBf3dd3559578BeB518a41b16Cfe","role":"admin","via":[{"address":"ethereum:0x320E53df19662A58fF4953d62B229E9BCAAC0b49"}]}
      receivedPermissions.10.from:
-        "ethereum:0x9dd8e00Ff731FBf3dd3559578BeB518a41b16Cfe"
+        "ethereum:0x3D831FD51f80398488a2452b9Ba44eDe104e8789"
      receivedPermissions.9.from:
-        "ethereum:0x3D831FD51f80398488a2452b9Ba44eDe104e8789"
+        "ethereum:0x384e3AE4D5efC9471201039b555EAe496b2A7240"
      receivedPermissions.8.from:
-        "ethereum:0x384e3AE4D5efC9471201039b555EAe496b2A7240"
+        "ethereum:0xF41E72f55d9bE849ecCe3b7AEe2A07Ccdadb655d"
      receivedPermissions.7.from:
-        "ethereum:0xF41E72f55d9bE849ecCe3b7AEe2A07Ccdadb655d"
+        "ethereum:0x6007758DBd8c9e83e24761D248e51850Ff2612CC"
    }
```

```diff
    contract L1CrossDomainMessenger (0x6007758DBd8c9e83e24761D248e51850Ff2612CC) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      values.$admin:
+        "0x320E53df19662A58fF4953d62B229E9BCAAC0b49"
    }
```

Generated with discovered.json: 0x68e04c045fb9239b676a025a1ea45de7460ba0ed

# Diff at Mon, 02 Jun 2025 08:01:49 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@2fee84b782a329885c84742cf9cf43143842a2d5 block: 22567759
- current block number: 22615673

## Description

conduit ms signer change.

## Watched changes

```diff
    contract Conduit Multisig 1 (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      values.$members.10:
+        "0xA0737fea60F0601A192E3d2c98865A883ab0bda2"
      values.$members.9:
-        "0xA0737fea60F0601A192E3d2c98865A883ab0bda2"
+        "0xa0C600a6e85bf225958FFAcC70B5FDDF9A059038"
      values.$members.8:
-        "0xa0C600a6e85bf225958FFAcC70B5FDDF9A059038"
+        "0xF3313C48BD8E17b823d5498D62F37019dFEA647D"
      values.$members.7:
-        "0xF3313C48BD8E17b823d5498D62F37019dFEA647D"
+        "0xefCf0c8faFB425997870f845e26fC6cA6EE6dD5C"
      values.$members.6:
-        "0xefCf0c8faFB425997870f845e26fC6cA6EE6dD5C"
+        "0x81175155D85377C337d92f1FA52Da166C3A4E7Ac"
      values.multisigThreshold:
-        "4 of 10 (40%)"
+        "4 of 11 (36%)"
    }
```

Generated with discovered.json: 0xa2b9c94c4be83e190cddd946f1ca6be7108785c9

# Diff at Fri, 30 May 2025 07:11:06 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@a4d8c436027d17df0f9b76843cd6deb1888fa381 block: 22567759
- current block number: 22567759

## Description

config: change comment about eip1559 fee val

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22567759 (main branch discovery), not current.

```diff
    contract SystemConfig (0xF41E72f55d9bE849ecCe3b7AEe2A07Ccdadb655d) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      fieldMeta.eip1559Denominator:
+        {"description":"volatility param: lower denominator -> quicker fee changes on L2"}
    }
```

Generated with discovered.json: 0x082edef6acd818723c57c8cb4286064fef8325fa

# Diff at Thu, 29 May 2025 07:50:08 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@9764537dfab122079ee09c9ec95835b322e2dd25 block: 22567759
- current block number: 22567759

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22567759 (main branch discovery), not current.

```diff
+   Status: CREATED
    contract LivenessGuard (0x24424336F04440b1c28685a38303aC33C9D14a25)
    +++ description: None
```

Generated with discovered.json: 0xe3cfdd3005d26bc831115d11326aa50990f53c88

# Diff at Tue, 27 May 2025 12:36:46 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@23beb76ada08c9c42f8f16b886f40d94b22ac36e block: 22567759
- current block number: 22567759

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22567759 (main branch discovery), not current.

```diff
    contract SystemConfig (0xF41E72f55d9bE849ecCe3b7AEe2A07Ccdadb655d) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      values.opStackDA.isUsingCelestia:
-        false
+        true
    }
```

Generated with discovered.json: 0xb544c250b57c3391314e663f28fb02bc55eec943

# Diff at Mon, 26 May 2025 15:09:59 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@d675d0bd208eadc685b2cb489512b83f62c0890e block: 22437741
- current block number: 22567759

## Description

config related: decoding bug in our opstackDA handler (see ancient disco).

## Watched changes

```diff
    contract SystemConfig (0xF41E72f55d9bE849ecCe3b7AEe2A07Ccdadb655d) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      values.opStackDA.isUsingCelestia:
-        true
+        false
    }
```

Generated with discovered.json: 0x11521e6115c598ce15a1a495272efa0618431904

# Diff at Fri, 23 May 2025 09:41:01 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@69cd181abbc3c830a6caf2f4429b37cae72ffdb8 block: 22437741
- current block number: 22437741

## Description

Introduced .role field on each permission, defaulting to field name on which it was defined (with '.' prefix)

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22437741 (main branch discovery), not current.

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
    contract ProxyAdmin (0x320E53df19662A58fF4953d62B229E9BCAAC0b49) {
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
      directlyReceivedPermissions.1.role:
+        ".$admin"
      directlyReceivedPermissions.0.role:
+        ".owner"
    }
```

```diff
    EOA Optimism EOA 1 (0x352f1defB49718e7Ea411687E850aA8d6299F7aC) {
    +++ description: None
      receivedPermissions.2.role:
+        ".guardian"
      receivedPermissions.1.role:
+        ".guardian"
      receivedPermissions.0.role:
+        ".guardian"
      directlyReceivedPermissions.0.role:
+        ".deputy"
    }
```

```diff
    contract Conduit Multisig 1 (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      receivedPermissions.10:
+        {"permission":"upgrade","from":"0x9dd8e00Ff731FBf3dd3559578BeB518a41b16Cfe","role":"admin","via":[{"address":"0x320E53df19662A58fF4953d62B229E9BCAAC0b49"}]}
      receivedPermissions.9.from:
-        "0x9dd8e00Ff731FBf3dd3559578BeB518a41b16Cfe"
+        "0x3D831FD51f80398488a2452b9Ba44eDe104e8789"
      receivedPermissions.9.role:
+        "admin"
      receivedPermissions.8.from:
-        "0x3D831FD51f80398488a2452b9Ba44eDe104e8789"
+        "0x11654D67e0360A82e5Badd272Ced336B80972135"
      receivedPermissions.8.role:
+        "admin"
      receivedPermissions.7.from:
-        "0x11654D67e0360A82e5Badd272Ced336B80972135"
+        "0x384e3AE4D5efC9471201039b555EAe496b2A7240"
      receivedPermissions.7.role:
+        "admin"
      receivedPermissions.6.from:
-        "0x384e3AE4D5efC9471201039b555EAe496b2A7240"
+        "0xb9c4EA7171b588e8D4c3F63e955Cd61e5172bb92"
      receivedPermissions.6.role:
+        "admin"
      receivedPermissions.5.from:
-        "0xb9c4EA7171b588e8D4c3F63e955Cd61e5172bb92"
+        "0xF41E72f55d9bE849ecCe3b7AEe2A07Ccdadb655d"
      receivedPermissions.5.role:
+        "admin"
      receivedPermissions.4.permission:
-        "upgrade"
+        "challenge"
      receivedPermissions.4.from:
-        "0xF41E72f55d9bE849ecCe3b7AEe2A07Ccdadb655d"
+        "0xb9c4EA7171b588e8D4c3F63e955Cd61e5172bb92"
      receivedPermissions.4.via:
-        [{"address":"0x320E53df19662A58fF4953d62B229E9BCAAC0b49"}]
      receivedPermissions.4.role:
+        ".CHALLENGER"
      receivedPermissions.3.role:
+        ".challenger"
      receivedPermissions.2.role:
+        ".$admin"
      receivedPermissions.1.role:
+        ".owner"
      receivedPermissions.0.role:
+        ".owner"
      directlyReceivedPermissions.0.role:
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
    EOA  (0x5c89b56bead2f99d41721f1D15442Fe813879587) {
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
    EOA  (0x919B2511b2DB24Cc0C0EebE28b62a4E591579C1B) {
    +++ description: None
      receivedPermissions.1:
+        {"permission":"propose","from":"0xb9c4EA7171b588e8D4c3F63e955Cd61e5172bb92","role":".proposer"}
      receivedPermissions.0.role:
+        ".PROPOSER"
    }
```

```diff
    contract OpFoundationOperationsSafe (0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A) {
    +++ description: None
      receivedPermissions.2.role:
+        ".guardian"
      receivedPermissions.1.role:
+        ".guardian"
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

Generated with discovered.json: 0x9338cdc37db14d89fad80615383b8a9a7e085241

# Diff at Fri, 09 May 2025 10:09:10 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@c3a1d49c07f4092914d62c65181e5fec18a88318 block: 22437741
- current block number: 22437741

## Description

Config related: Move IFs to the editable string for condition configs (yeet IFs from the automatic resolver).

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22437741 (main branch discovery), not current.

```diff
    EOA Optimism EOA 1 (0x352f1defB49718e7Ea411687E850aA8d6299F7aC) {
    +++ description: None
      receivedPermissions.2.via.0.condition:
-        "restricted to the global pause function"
+        "though restricted to the global pause function"
      receivedPermissions.1.via.0.condition:
-        "restricted to the global pause function"
+        "though restricted to the global pause function"
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

Generated with discovered.json: 0x8364d97f09dbc7bc00cd89f43f269c890b1ddc3f

# Diff at Thu, 08 May 2025 08:50:03 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@8e1926142ab0c57cc131de4d8da307e13d9af54d block: 22244001
- current block number: 22437741

## Description

superchain guardian connected, but not full superchain gov.

OP stack DeputyPauser upgrade (see op mainnet for more info).

## Watched changes

```diff
    contract OpFoundationOperationsSafe (0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A) {
    +++ description: None
      values.getModules.0:
+        "0x126a736B18E0a64fBA19D421647A530E327E112C"
      values.GnosisSafe_modules.0:
+        "0x126a736B18E0a64fBA19D421647A530E327E112C"
      receivedPermissions.2:
+        {"permission":"guard","from":"0x11654D67e0360A82e5Badd272Ced336B80972135"}
      receivedPermissions.1.from:
-        "0x11654D67e0360A82e5Badd272Ced336B80972135"
+        "0x384e3AE4D5efC9471201039b555EAe496b2A7240"
      receivedPermissions.0.from:
-        "0x384e3AE4D5efC9471201039b555EAe496b2A7240"
+        "0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
      receivedPermissions.0.via:
+        [{"address":"0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2"},{"address":"0xc6901F65369FC59fC1B4D6D6bE7A2318Ff38dB5B","condition":"not revoked by the Security Council"}]
      directlyReceivedPermissions:
+        [{"permission":"act","from":"0xc6901F65369FC59fC1B4D6D6bE7A2318Ff38dB5B","condition":"not revoked by the Security Council"}]
    }
```

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
    contract DeputyPauseModule (0x126a736B18E0a64fBA19D421647A530E327E112C)
    +++ description: Allows 0x352f1defB49718e7Ea411687E850aA8d6299F7aC, called the deputy pauser, to act on behalf of the 0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A if set as its Safe module.
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
    contract AddressManager (0xdE1FCfB0851916CA5101820A69b13a4E276bd81F)
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
```

## Source code changes

```diff
...0xC3BcdF5cb9AEA2cc4938C9D1AA866CF0BA6B19b5.sol} |    0
 ...-0xdE1FCfB0851916CA5101820A69b13a4E276bd81F.sol |  152 +++
 .../ethereum/.flat/DeputyGuardianModule.sol        |  156 +++
 .../ethereum/.flat/DeputyPauseModule.sol           | 1338 ++++++++++++++++++++
 .../ethereum/.flat/LivenessModule.sol              |  258 ++++
 .../.flat/OpFoundationUpgradeSafe/GnosisSafe.sol   |  953 ++++++++++++++
 .../OpFoundationUpgradeSafe/GnosisSafeProxy.p.sol  |   35 +
 .../Optimism Guardian Multisig/GnosisSafe.sol      |  953 ++++++++++++++
 .../GnosisSafeProxy.p.sol                          |   35 +
 .../.flat/Optimism Security Council/GnosisSafe.sol |  953 ++++++++++++++
 .../GnosisSafeProxy.p.sol                          |   35 +
 .../Proxy.p.sol                                    |    0
 .../SuperchainConfig.sol                           |    0
 .../Proxy.p.sol                                    |  200 +++
 .../SuperchainConfig.sol                           |  477 +++++++
 .../ethereum/.flat/SuperchainProxyAdmin.sol        |  298 +++++
 .../.flat/SuperchainProxyAdminOwner/GnosisSafe.sol |  953 ++++++++++++++
 .../GnosisSafeProxy.p.sol                          |   35 +
 18 files changed, 6831 insertions(+)
```

Generated with discovered.json: 0xb90df94d2efca2ffe0e9b3c7dddd173ac6cf9e76

# Diff at Tue, 29 Apr 2025 08:19:09 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@ef7477af00fe0b57a2f7cacf7e958c12494af662 block: 22244001
- current block number: 22244001

## Description

Field .issuedPermissions is removed from the output as no longer needed. Added 'permissionsConfigHash' due to refactoring of the modelling process (into a separate command).

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22244001 (main branch discovery), not current.

```diff
    contract SuperchainConfig (0x11654D67e0360A82e5Badd272Ced336B80972135) {
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      issuedPermissions:
-        [{"permission":"guard","to":"0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A","via":[]},{"permission":"upgrade","to":"0x4a4962275DF8C60a80d3a25faEc5AA7De116A746","via":[{"address":"0x320E53df19662A58fF4953d62B229E9BCAAC0b49"}]}]
    }
```

```diff
    contract L1StandardBridge (0x34Ef4B527DB3F4AcfAE7Fdc7Db0f9981F48Cd23F) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x4a4962275DF8C60a80d3a25faEc5AA7De116A746","description":"upgrading the bridge implementation can give access to all funds escrowed therein.","via":[{"address":"0x320E53df19662A58fF4953d62B229E9BCAAC0b49"}]}]
    }
```

```diff
    contract OptimismPortal (0x384e3AE4D5efC9471201039b555EAe496b2A7240) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      issuedPermissions:
-        [{"permission":"guard","to":"0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A","via":[]},{"permission":"upgrade","to":"0x4a4962275DF8C60a80d3a25faEc5AA7De116A746","via":[{"address":"0x320E53df19662A58fF4953d62B229E9BCAAC0b49"}]}]
    }
```

```diff
    contract OptimismMintableERC20Factory (0x3D831FD51f80398488a2452b9Ba44eDe104e8789) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x4a4962275DF8C60a80d3a25faEc5AA7De116A746","via":[{"address":"0x320E53df19662A58fF4953d62B229E9BCAAC0b49"}]}]
    }
```

```diff
    contract L1ERC721Bridge (0x9dd8e00Ff731FBf3dd3559578BeB518a41b16Cfe) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x4a4962275DF8C60a80d3a25faEc5AA7De116A746","via":[{"address":"0x320E53df19662A58fF4953d62B229E9BCAAC0b49"}]}]
    }
```

```diff
    contract L2OutputOracle (0xb9c4EA7171b588e8D4c3F63e955Cd61e5172bb92) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      issuedPermissions:
-        [{"permission":"challenge","to":"0x4a4962275DF8C60a80d3a25faEc5AA7De116A746","via":[]},{"permission":"propose","to":"0x919B2511b2DB24Cc0C0EebE28b62a4E591579C1B","via":[]},{"permission":"upgrade","to":"0x4a4962275DF8C60a80d3a25faEc5AA7De116A746","via":[{"address":"0x320E53df19662A58fF4953d62B229E9BCAAC0b49"}]}]
    }
```

```diff
    contract AddressManager (0xC3BcdF5cb9AEA2cc4938C9D1AA866CF0BA6B19b5) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      issuedPermissions:
-        [{"permission":"interact","to":"0x4a4962275DF8C60a80d3a25faEc5AA7De116A746","description":"set and change address mappings.","via":[{"address":"0x320E53df19662A58fF4953d62B229E9BCAAC0b49"}]}]
    }
```

```diff
    contract SystemConfig (0xF41E72f55d9bE849ecCe3b7AEe2A07Ccdadb655d) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      issuedPermissions:
-        [{"permission":"interact","to":"0x4a4962275DF8C60a80d3a25faEc5AA7De116A746","description":"it can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system.","via":[]},{"permission":"sequence","to":"0x5c89b56bead2f99d41721f1D15442Fe813879587","via":[]},{"permission":"upgrade","to":"0x4a4962275DF8C60a80d3a25faEc5AA7De116A746","via":[{"address":"0x320E53df19662A58fF4953d62B229E9BCAAC0b49"}]}]
    }
```

Generated with discovered.json: 0xa1f850efa1c8afa86d1d1fff5b5fc9a62be49e35

# Diff at Fri, 11 Apr 2025 06:47:53 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@a946e9842245b891a11dfd66e5a103281bde27da block: 22046072
- current block number: 22244001

## Description

storageSetter upgrade for changing the challenge period (1d).

## Watched changes

```diff
    contract L2OutputOracle (0xb9c4EA7171b588e8D4c3F63e955Cd61e5172bb92) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      values.$pastUpgrades.2:
+        ["2025-04-09T18:39:47.000Z","0x6a3c741de4a66f9e4f6ab204507d0d1e6c6c0e8ec2ca63bb03ad6c57e8e5d373",["0xd81f43eDBCAcb4c29a9bA38a13Ee5d79278270cC"]]
      values.$pastUpgrades.1:
+        ["2025-04-09T18:39:47.000Z","0x6a3c741de4a66f9e4f6ab204507d0d1e6c6c0e8ec2ca63bb03ad6c57e8e5d373",["0x1Fd1be2e1c65F136020d2CcC073ED8A7269aE53f"]]
      values.$upgradeCount:
-        1
+        3
+++ description: Challenge period (Number of seconds until a state root is finalized).
      values.FINALIZATION_PERIOD_SECONDS:
-        604800
+        86400
      values.finalizationPeriodSeconds:
-        604800
+        86400
    }
```

Generated with discovered.json: 0x3cc31776ff2f7ea42a8f5bdbac490b0ad6b0c065

# Diff at Thu, 27 Mar 2025 11:14:52 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@8cc2e36080df3a74dfd8475d41c64f46203f5218 block: 22046072
- current block number: 22046072

## Description

Config related: add guardian description details, hide some noisy values, hide AddressManager as spam cat, add proposer / challenger to permissioned opfp chains.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22046072 (main branch discovery), not current.

```diff
    contract AddressManager (0xC3BcdF5cb9AEA2cc4938C9D1AA866CF0BA6B19b5) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      category:
+        {"name":"Spam","priority":-1}
    }
```

Generated with discovered.json: 0xd930fc9221f4bd1e8e89d1082adf8c2ed4931013

# Diff at Wed, 19 Mar 2025 13:05:15 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@e950b6e93c84855ee2ec1740913b7b4c994b9ae2 block: 22046072
- current block number: 22046072

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22046072 (main branch discovery), not current.

```diff
    contract Conduit Multisig 1 (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      severity:
-        "HIGH"
    }
```

```diff
    contract undefined (0x919B2511b2DB24Cc0C0EebE28b62a4E591579C1B) {
    +++ description: None
      severity:
-        "HIGH"
    }
```

Generated with discovered.json: 0x6ebedc309d2143462ff2c40d745e6c9e8b3fd68f

# Diff at Tue, 18 Mar 2025 08:13:33 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@4ef7a8dbcec1cd9fec77aae2b73d81347a4ffb13 block: 22046072
- current block number: 22046072

## Description

Config: change Multisig names.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22046072 (main branch discovery), not current.

```diff
    contract Conduit Multisig 1 (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      name:
-        "ConduitMultisig"
+        "Conduit Multisig 1"
    }
```

Generated with discovered.json: 0x8285fe5f90a90d7d2236e5cb364a2e88043d6955

# Diff at Fri, 14 Mar 2025 15:41:19 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@002bac09dea3b1154ecc36736323fb7552478ce4 block: 21894981
- current block number: 22046072

## Description

Conduit MS changes.

## Watched changes

```diff
    contract ConduitMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      values.$members.9:
+        "0x4D8007a0E9f293e62E2b0F43C6Cf4C4B9e135BAe"
      values.$members.8:
-        "0x4D8007a0E9f293e62E2b0F43C6Cf4C4B9e135BAe"
+        "0xefCf0c8faFB425997870f845e26fC6cA6EE6dD5C"
      values.$members.7:
-        "0xefCf0c8faFB425997870f845e26fC6cA6EE6dD5C"
+        "0xa0C600a6e85bf225958FFAcC70B5FDDF9A059038"
      values.$members.6:
-        "0xa0C600a6e85bf225958FFAcC70B5FDDF9A059038"
+        "0x3840f487A17A41100DD1Bf0946c34f132a57Fd5f"
      values.$members.5:
-        "0x3840f487A17A41100DD1Bf0946c34f132a57Fd5f"
+        "0xa4000bDD2bB92ce6750b31F1eeda47Bd1cB8e6e4"
      values.$members.4:
-        "0xa4000bDD2bB92ce6750b31F1eeda47Bd1cB8e6e4"
+        "0xF0B77EaE7F2dabCC2571c7418406A0dCA3afA4f0"
      values.$members.3:
-        "0xF0B77EaE7F2dabCC2571c7418406A0dCA3afA4f0"
+        "0xF3313C48BD8E17b823d5498D62F37019dFEA647D"
      values.$members.2:
-        "0xF3313C48BD8E17b823d5498D62F37019dFEA647D"
+        "0xA0737fea60F0601A192E3d2c98865A883ab0bda2"
      values.$members.1:
-        "0xA0737fea60F0601A192E3d2c98865A883ab0bda2"
+        "0x50930d652266EF4127FA3A1906B7Cb9951076628"
      values.$members.0:
-        "0x50930d652266EF4127FA3A1906B7Cb9951076628"
+        "0x860e06Fe384D1A3340111e7D142E02642178c053"
      values.multisigThreshold:
-        "4 of 9 (44%)"
+        "4 of 10 (40%)"
    }
```

Generated with discovered.json: 0xcba398ba072c0c68a565eacd78b667153fd85ddb

# Diff at Tue, 04 Mar 2025 11:26:08 GMT:

- author: Michał Podsiadły (<michal.podsiadly@l2beat.com>)
- comparing to: main@be38e12d3ff947ca8de40f3a23a9ba1875a54f5a block: 21894981
- current block number: 21894981

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21894981 (main branch discovery), not current.

```diff
    contract SystemConfig (0xF41E72f55d9bE849ecCe3b7AEe2A07Ccdadb655d) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      values.opStackDA.isSomeTxsLengthEqualToCelestiaDAExample:
-        true
      values.opStackDA.isUsingCelestia:
+        true
    }
```

Generated with discovered.json: 0x6870cc88fdec3d9f181a85247370469ffff9f0c8

# Diff at Tue, 04 Mar 2025 10:39:36 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@98d260b45fe0d2195ce5e629bd7b200c8706e8ba block: 21894981
- current block number: 21894981

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21894981 (main branch discovery), not current.

```diff
    contract SuperchainConfig (0x11654D67e0360A82e5Badd272Ced336B80972135) {
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      sinceBlock:
+        21314015
    }
```

```diff
    contract ProxyAdmin (0x320E53df19662A58fF4953d62B229E9BCAAC0b49) {
    +++ description: None
      sinceBlock:
+        21314014
    }
```

```diff
    contract L1StandardBridge (0x34Ef4B527DB3F4AcfAE7Fdc7Db0f9981F48Cd23F) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      sinceBlock:
+        21314015
    }
```

```diff
    contract OptimismPortal (0x384e3AE4D5efC9471201039b555EAe496b2A7240) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      sinceBlock:
+        21314015
    }
```

```diff
    contract OptimismMintableERC20Factory (0x3D831FD51f80398488a2452b9Ba44eDe104e8789) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      sinceBlock:
+        21314015
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
    contract ConduitMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      sinceBlock:
+        16990669
    }
```

```diff
    contract L1CrossDomainMessenger (0x6007758DBd8c9e83e24761D248e51850Ff2612CC) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      sinceBlock:
+        21314015
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
    contract L1ERC721Bridge (0x9dd8e00Ff731FBf3dd3559578BeB518a41b16Cfe) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      sinceBlock:
+        21314017
    }
```

```diff
    contract L2OutputOracle (0xb9c4EA7171b588e8D4c3F63e955Cd61e5172bb92) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      sinceBlock:
+        21314017
    }
```

```diff
    contract AddressManager (0xC3BcdF5cb9AEA2cc4938C9D1AA866CF0BA6B19b5) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      sinceBlock:
+        21314014
    }
```

```diff
    contract SystemConfig (0xF41E72f55d9bE849ecCe3b7AEe2A07Ccdadb655d) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      sinceBlock:
+        21314015
    }
```

Generated with discovered.json: 0x2b73f94e639cf264857a0b01aa5b427a2c5aea2c

# Diff at Wed, 26 Feb 2025 10:32:57 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@18513668f913fbe57a197f43655b19111df0e627 block: 21894981
- current block number: 21894981

## Description

config related: added categories for all opstack, op stack and polygoncdk stack templates.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21894981 (main branch discovery), not current.

```diff
    contract SuperchainConfig (0x11654D67e0360A82e5Badd272Ced336B80972135) {
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      category:
+        {"name":"Governance","priority":3}
    }
```

```diff
    contract L1StandardBridge (0x34Ef4B527DB3F4AcfAE7Fdc7Db0f9981F48Cd23F) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      category:
+        {"name":"Canonical Bridges","priority":2}
    }
```

```diff
    contract OptimismPortal (0x384e3AE4D5efC9471201039b555EAe496b2A7240) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract L1CrossDomainMessenger (0x6007758DBd8c9e83e24761D248e51850Ff2612CC) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      category:
+        {"name":"Canonical Bridges","priority":2}
    }
```

```diff
    contract L1ERC721Bridge (0x9dd8e00Ff731FBf3dd3559578BeB518a41b16Cfe) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      category:
+        {"name":"Canonical Bridges","priority":2}
    }
```

```diff
    contract L2OutputOracle (0xb9c4EA7171b588e8D4c3F63e955Cd61e5172bb92) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract SystemConfig (0xF41E72f55d9bE849ecCe3b7AEe2A07Ccdadb655d) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

Generated with discovered.json: 0x43a781fae05bc530d11a404544d31bc8d3d6825e

# Diff at Fri, 21 Feb 2025 19:02:13 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- current block number: 21894981

## Description

First discovery. OpStack using Celestia for DA. DisputeGameFactory and related contracts are deployed but not used.

## Initial discovery

```diff
+   Status: CREATED
    contract SuperchainConfig (0x11654D67e0360A82e5Badd272Ced336B80972135)
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x320E53df19662A58fF4953d62B229E9BCAAC0b49)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1StandardBridge (0x34Ef4B527DB3F4AcfAE7Fdc7Db0f9981F48Cd23F)
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
```

```diff
+   Status: CREATED
    contract OptimismPortal (0x384e3AE4D5efC9471201039b555EAe496b2A7240)
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
```

```diff
+   Status: CREATED
    contract OptimismMintableERC20Factory (0x3D831FD51f80398488a2452b9Ba44eDe104e8789)
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
```

```diff
+   Status: CREATED
    contract GnosisSafe (0x42d27eEA1AD6e22Af6284F609847CB3Cd56B9c64)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ConduitMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1CrossDomainMessenger (0x6007758DBd8c9e83e24761D248e51850Ff2612CC)
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
```

```diff
+   Status: CREATED
    contract OpFoundationOperationsSafe (0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1ERC721Bridge (0x9dd8e00Ff731FBf3dd3559578BeB518a41b16Cfe)
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
```

```diff
+   Status: CREATED
    contract L2OutputOracle (0xb9c4EA7171b588e8D4c3F63e955Cd61e5172bb92)
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
```

```diff
+   Status: CREATED
    contract AddressManager (0xC3BcdF5cb9AEA2cc4938C9D1AA866CF0BA6B19b5)
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
```

```diff
+   Status: CREATED
    contract SystemConfig (0xF41E72f55d9bE849ecCe3b7AEe2A07Ccdadb655d)
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
```
