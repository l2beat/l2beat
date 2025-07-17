Generated with discovered.json: 0x2a0a31f3a971ca30ab405299cbd5b61a248427c9

# Diff at Mon, 14 Jul 2025 12:46:32 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@9f4300dad2f3d080cd56fa311d4a848556c74e72 block: 22895950
- current block number: 22895950

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22895950 (main branch discovery), not current.

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
    contract AddressManager (0x0a1B34aA2047AD1AbEF8aC085b1a7802Ed9dbCF0) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      address:
-        "0x0a1B34aA2047AD1AbEF8aC085b1a7802Ed9dbCF0"
+        "eth:0x0a1B34aA2047AD1AbEF8aC085b1a7802Ed9dbCF0"
      values.owner:
-        "0xF3b7697c9C0CbdE923f34991F2D19cC1c66612bD"
+        "eth:0xF3b7697c9C0CbdE923f34991F2D19cC1c66612bD"
      implementationNames.0x0a1B34aA2047AD1AbEF8aC085b1a7802Ed9dbCF0:
-        "AddressManager"
      implementationNames.eth:0x0a1B34aA2047AD1AbEF8aC085b1a7802Ed9dbCF0:
+        "AddressManager"
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
    contract SuperchainConfig (0x118D04d841B54FC52e56D39371E278EF7815C358) {
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      address:
-        "0x118D04d841B54FC52e56D39371E278EF7815C358"
+        "eth:0x118D04d841B54FC52e56D39371E278EF7815C358"
      values.$admin:
-        "0xF3b7697c9C0CbdE923f34991F2D19cC1c66612bD"
+        "eth:0xF3b7697c9C0CbdE923f34991F2D19cC1c66612bD"
      values.$implementation:
-        "0x83c32a88cFc57dBb771A1E00B48B66b5bfD0AfD1"
+        "eth:0x83c32a88cFc57dBb771A1E00B48B66b5bfD0AfD1"
      values.$pastUpgrades.0.2.0:
-        "0x83c32a88cFc57dBb771A1E00B48B66b5bfD0AfD1"
+        "eth:0x83c32a88cFc57dBb771A1E00B48B66b5bfD0AfD1"
      values.guardian:
-        "0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A"
+        "eth:0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A"
      implementationNames.0x118D04d841B54FC52e56D39371E278EF7815C358:
-        "Proxy"
      implementationNames.0x83c32a88cFc57dBb771A1E00B48B66b5bfD0AfD1:
-        "SuperchainConfig"
      implementationNames.eth:0x118D04d841B54FC52e56D39371E278EF7815C358:
+        "Proxy"
      implementationNames.eth:0x83c32a88cFc57dBb771A1E00B48B66b5bfD0AfD1:
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
    contract OptimismPortal (0x2c2150aa5c75A24fB93d4fD2F2a895D618054f07) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      address:
-        "0x2c2150aa5c75A24fB93d4fD2F2a895D618054f07"
+        "eth:0x2c2150aa5c75A24fB93d4fD2F2a895D618054f07"
      values.$admin:
-        "0xF3b7697c9C0CbdE923f34991F2D19cC1c66612bD"
+        "eth:0xF3b7697c9C0CbdE923f34991F2D19cC1c66612bD"
      values.$implementation:
-        "0xbCDA9e8434eEB0bfCD24fE8b9947c80328dD0270"
+        "eth:0xbCDA9e8434eEB0bfCD24fE8b9947c80328dD0270"
      values.$pastUpgrades.0.2.0:
-        "0xbCDA9e8434eEB0bfCD24fE8b9947c80328dD0270"
+        "eth:0xbCDA9e8434eEB0bfCD24fE8b9947c80328dD0270"
      values.guardian:
-        "0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A"
+        "eth:0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A"
      values.l2Oracle:
-        "0x693A0F8854F458D282DE3C5b69E8eE5EEE8aA949"
+        "eth:0x693A0F8854F458D282DE3C5b69E8eE5EEE8aA949"
      values.l2Sender:
-        "0x000000000000000000000000000000000000dEaD"
+        "eth:0x000000000000000000000000000000000000dEaD"
      values.superchainConfig:
-        "0x118D04d841B54FC52e56D39371E278EF7815C358"
+        "eth:0x118D04d841B54FC52e56D39371E278EF7815C358"
      values.systemConfig:
-        "0x525a2744134805516a45B8abb6Aa0aA1dA3809F6"
+        "eth:0x525a2744134805516a45B8abb6Aa0aA1dA3809F6"
      implementationNames.0x2c2150aa5c75A24fB93d4fD2F2a895D618054f07:
-        "Proxy"
      implementationNames.0xbCDA9e8434eEB0bfCD24fE8b9947c80328dD0270:
-        "OptimismPortal"
      implementationNames.eth:0x2c2150aa5c75A24fB93d4fD2F2a895D618054f07:
+        "Proxy"
      implementationNames.eth:0xbCDA9e8434eEB0bfCD24fE8b9947c80328dD0270:
+        "OptimismPortal"
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
    EOA  (0x3840f487A17A41100DD1Bf0946c34f132a57Fd5f) {
    +++ description: None
      address:
-        "0x3840f487A17A41100DD1Bf0946c34f132a57Fd5f"
+        "eth:0x3840f487A17A41100DD1Bf0946c34f132a57Fd5f"
    }
```

```diff
    contract L1CrossDomainMessenger (0x3a30AEd8fa7717aC2D8454D82c125cF6B875061a) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      address:
-        "0x3a30AEd8fa7717aC2D8454D82c125cF6B875061a"
+        "eth:0x3a30AEd8fa7717aC2D8454D82c125cF6B875061a"
      values.$admin:
-        "0xF3b7697c9C0CbdE923f34991F2D19cC1c66612bD"
+        "eth:0xF3b7697c9C0CbdE923f34991F2D19cC1c66612bD"
      values.$implementation:
-        "0x6D9D1C7D7148eb567894B9cbcB85Dd0bA9036532"
+        "eth:0x6D9D1C7D7148eb567894B9cbcB85Dd0bA9036532"
      values.$pastUpgrades.0.2.0:
-        "0x6D9D1C7D7148eb567894B9cbcB85Dd0bA9036532"
+        "eth:0x6D9D1C7D7148eb567894B9cbcB85Dd0bA9036532"
      values.OTHER_MESSENGER:
-        "0x4200000000000000000000000000000000000007"
+        "eth:0x4200000000000000000000000000000000000007"
      values.otherMessenger:
-        "0x4200000000000000000000000000000000000007"
+        "eth:0x4200000000000000000000000000000000000007"
      values.portal:
-        "0x2c2150aa5c75A24fB93d4fD2F2a895D618054f07"
+        "eth:0x2c2150aa5c75A24fB93d4fD2F2a895D618054f07"
      values.PORTAL:
-        "0x2c2150aa5c75A24fB93d4fD2F2a895D618054f07"
+        "eth:0x2c2150aa5c75A24fB93d4fD2F2a895D618054f07"
      values.ResolvedDelegateProxy_addressManager:
-        "0x0a1B34aA2047AD1AbEF8aC085b1a7802Ed9dbCF0"
+        "eth:0x0a1B34aA2047AD1AbEF8aC085b1a7802Ed9dbCF0"
      values.superchainConfig:
-        "0x118D04d841B54FC52e56D39371E278EF7815C358"
+        "eth:0x118D04d841B54FC52e56D39371E278EF7815C358"
      values.systemConfig:
-        "0x525a2744134805516a45B8abb6Aa0aA1dA3809F6"
+        "eth:0x525a2744134805516a45B8abb6Aa0aA1dA3809F6"
      implementationNames.0x3a30AEd8fa7717aC2D8454D82c125cF6B875061a:
-        "ResolvedDelegateProxy"
      implementationNames.0x6D9D1C7D7148eb567894B9cbcB85Dd0bA9036532:
-        "L1CrossDomainMessenger"
      implementationNames.eth:0x3a30AEd8fa7717aC2D8454D82c125cF6B875061a:
+        "ResolvedDelegateProxy"
      implementationNames.eth:0x6D9D1C7D7148eb567894B9cbcB85Dd0bA9036532:
+        "L1CrossDomainMessenger"
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
    contract OptimismMintableERC20Factory (0x484529223d68a0Cf85902Bf5E781394f0D0f837C) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintableERC20 as this chain's representation of a token on the host chain, or vice-versa.
      address:
-        "0x484529223d68a0Cf85902Bf5E781394f0D0f837C"
+        "eth:0x484529223d68a0Cf85902Bf5E781394f0D0f837C"
      values.$admin:
-        "0xF3b7697c9C0CbdE923f34991F2D19cC1c66612bD"
+        "eth:0xF3b7697c9C0CbdE923f34991F2D19cC1c66612bD"
      values.$implementation:
-        "0x2D06aB23BadC284507048F12c8a49927E4c10058"
+        "eth:0x2D06aB23BadC284507048F12c8a49927E4c10058"
      values.$pastUpgrades.0.2.0:
-        "0x2D06aB23BadC284507048F12c8a49927E4c10058"
+        "eth:0x2D06aB23BadC284507048F12c8a49927E4c10058"
      values.bridge:
-        "0x8b0576E39F1233679109F9b40cFcC2a7E0901Ede"
+        "eth:0x8b0576E39F1233679109F9b40cFcC2a7E0901Ede"
      values.BRIDGE:
-        "0x8b0576E39F1233679109F9b40cFcC2a7E0901Ede"
+        "eth:0x8b0576E39F1233679109F9b40cFcC2a7E0901Ede"
      implementationNames.0x484529223d68a0Cf85902Bf5E781394f0D0f837C:
-        "Proxy"
      implementationNames.0x2D06aB23BadC284507048F12c8a49927E4c10058:
-        "OptimismMintableERC20Factory"
      implementationNames.eth:0x484529223d68a0Cf85902Bf5E781394f0D0f837C:
+        "Proxy"
      implementationNames.eth:0x2D06aB23BadC284507048F12c8a49927E4c10058:
+        "OptimismMintableERC20Factory"
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
    contract SystemConfig (0x525a2744134805516a45B8abb6Aa0aA1dA3809F6) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      address:
-        "0x525a2744134805516a45B8abb6Aa0aA1dA3809F6"
+        "eth:0x525a2744134805516a45B8abb6Aa0aA1dA3809F6"
      values.$admin:
-        "0xF3b7697c9C0CbdE923f34991F2D19cC1c66612bD"
+        "eth:0xF3b7697c9C0CbdE923f34991F2D19cC1c66612bD"
      values.$implementation:
-        "0x86fDeC2E82C59e4d7A2FEe41824f16c995685108"
+        "eth:0x86fDeC2E82C59e4d7A2FEe41824f16c995685108"
      values.$pastUpgrades.0.2.0:
-        "0x86fDeC2E82C59e4d7A2FEe41824f16c995685108"
+        "eth:0x86fDeC2E82C59e4d7A2FEe41824f16c995685108"
      values.batcherHash:
-        "0xa9B074B27DE97f492F8F07fD7C213400E4ca5391"
+        "eth:0xa9B074B27DE97f492F8F07fD7C213400E4ca5391"
      values.batchInbox:
-        "0x8612014a343089F1ddBACfD42baf4Afbf9133593"
+        "eth:0x8612014a343089F1ddBACfD42baf4Afbf9133593"
      values.disputeGameFactory:
-        "0x8b097CF1f9BbD9cbFD0DD561858a1FCbC8857Be0"
+        "eth:0x8b097CF1f9BbD9cbFD0DD561858a1FCbC8857Be0"
      values.gasPayingToken.addr_:
-        "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE"
+        "eth:0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE"
      values.l1CrossDomainMessenger:
-        "0x3a30AEd8fa7717aC2D8454D82c125cF6B875061a"
+        "eth:0x3a30AEd8fa7717aC2D8454D82c125cF6B875061a"
      values.l1ERC721Bridge:
-        "0xA99f82730e68968a78AA21522FC7eb90DB76D8Cb"
+        "eth:0xA99f82730e68968a78AA21522FC7eb90DB76D8Cb"
      values.l1StandardBridge:
-        "0x8b0576E39F1233679109F9b40cFcC2a7E0901Ede"
+        "eth:0x8b0576E39F1233679109F9b40cFcC2a7E0901Ede"
      values.optimismMintableERC20Factory:
-        "0x484529223d68a0Cf85902Bf5E781394f0D0f837C"
+        "eth:0x484529223d68a0Cf85902Bf5E781394f0D0f837C"
      values.optimismPortal:
-        "0x2c2150aa5c75A24fB93d4fD2F2a895D618054f07"
+        "eth:0x2c2150aa5c75A24fB93d4fD2F2a895D618054f07"
      values.owner:
-        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
+        "eth:0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      values.sequencerInbox:
-        "0x8612014a343089F1ddBACfD42baf4Afbf9133593"
+        "eth:0x8612014a343089F1ddBACfD42baf4Afbf9133593"
      values.unsafeBlockSigner:
-        "0x92Dc533201e8634f0337D66a11820a8C4E902474"
+        "eth:0x92Dc533201e8634f0337D66a11820a8C4E902474"
      implementationNames.0x525a2744134805516a45B8abb6Aa0aA1dA3809F6:
-        "Proxy"
      implementationNames.0x86fDeC2E82C59e4d7A2FEe41824f16c995685108:
-        "SystemConfig"
      implementationNames.eth:0x525a2744134805516a45B8abb6Aa0aA1dA3809F6:
+        "Proxy"
      implementationNames.eth:0x86fDeC2E82C59e4d7A2FEe41824f16c995685108:
+        "SystemConfig"
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
    contract L2OutputOracle (0x693A0F8854F458D282DE3C5b69E8eE5EEE8aA949) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      address:
-        "0x693A0F8854F458D282DE3C5b69E8eE5EEE8aA949"
+        "eth:0x693A0F8854F458D282DE3C5b69E8eE5EEE8aA949"
      values.$admin:
-        "0xF3b7697c9C0CbdE923f34991F2D19cC1c66612bD"
+        "eth:0xF3b7697c9C0CbdE923f34991F2D19cC1c66612bD"
      values.$implementation:
-        "0xDfd8898340F685746d52c38b583086C3D5197C24"
+        "eth:0xDfd8898340F685746d52c38b583086C3D5197C24"
      values.$pastUpgrades.0.2.0:
-        "0xDfd8898340F685746d52c38b583086C3D5197C24"
+        "eth:0xDfd8898340F685746d52c38b583086C3D5197C24"
+++ severity: HIGH
      values.challenger:
-        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
+        "eth:0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      values.CHALLENGER:
-        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
+        "eth:0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
+++ severity: HIGH
      values.proposer:
-        "0xB2354BDF5925d03cA06B03a7bD7386Bd685cE814"
+        "eth:0xB2354BDF5925d03cA06B03a7bD7386Bd685cE814"
      values.PROPOSER:
-        "0xB2354BDF5925d03cA06B03a7bD7386Bd685cE814"
+        "eth:0xB2354BDF5925d03cA06B03a7bD7386Bd685cE814"
      implementationNames.0x693A0F8854F458D282DE3C5b69E8eE5EEE8aA949:
-        "Proxy"
      implementationNames.0xDfd8898340F685746d52c38b583086C3D5197C24:
-        "L2OutputOracle"
      implementationNames.eth:0x693A0F8854F458D282DE3C5b69E8eE5EEE8aA949:
+        "Proxy"
      implementationNames.eth:0xDfd8898340F685746d52c38b583086C3D5197C24:
+        "L2OutputOracle"
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
    EOA  (0x8612014a343089F1ddBACfD42baf4Afbf9133593) {
    +++ description: None
      address:
-        "0x8612014a343089F1ddBACfD42baf4Afbf9133593"
+        "eth:0x8612014a343089F1ddBACfD42baf4Afbf9133593"
    }
```

```diff
    contract L1StandardBridge (0x8b0576E39F1233679109F9b40cFcC2a7E0901Ede) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      address:
-        "0x8b0576E39F1233679109F9b40cFcC2a7E0901Ede"
+        "eth:0x8b0576E39F1233679109F9b40cFcC2a7E0901Ede"
      values.$admin:
-        "0xF3b7697c9C0CbdE923f34991F2D19cC1c66612bD"
+        "eth:0xF3b7697c9C0CbdE923f34991F2D19cC1c66612bD"
      values.$implementation:
-        "0xaCc17e58C480D4CCD78317928259347132690425"
+        "eth:0xaCc17e58C480D4CCD78317928259347132690425"
      values.l2TokenBridge:
-        "0x4200000000000000000000000000000000000010"
+        "eth:0x4200000000000000000000000000000000000010"
      values.messenger:
-        "0x3a30AEd8fa7717aC2D8454D82c125cF6B875061a"
+        "eth:0x3a30AEd8fa7717aC2D8454D82c125cF6B875061a"
      values.MESSENGER:
-        "0x3a30AEd8fa7717aC2D8454D82c125cF6B875061a"
+        "eth:0x3a30AEd8fa7717aC2D8454D82c125cF6B875061a"
      values.OTHER_BRIDGE:
-        "0x4200000000000000000000000000000000000010"
+        "eth:0x4200000000000000000000000000000000000010"
      values.otherBridge:
-        "0x4200000000000000000000000000000000000010"
+        "eth:0x4200000000000000000000000000000000000010"
      values.superchainConfig:
-        "0x118D04d841B54FC52e56D39371E278EF7815C358"
+        "eth:0x118D04d841B54FC52e56D39371E278EF7815C358"
      values.systemConfig:
-        "0x525a2744134805516a45B8abb6Aa0aA1dA3809F6"
+        "eth:0x525a2744134805516a45B8abb6Aa0aA1dA3809F6"
      implementationNames.0x8b0576E39F1233679109F9b40cFcC2a7E0901Ede:
-        "L1ChugSplashProxy"
      implementationNames.0xaCc17e58C480D4CCD78317928259347132690425:
-        "L1StandardBridge"
      implementationNames.eth:0x8b0576E39F1233679109F9b40cFcC2a7E0901Ede:
+        "L1ChugSplashProxy"
      implementationNames.eth:0xaCc17e58C480D4CCD78317928259347132690425:
+        "L1StandardBridge"
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
    EOA  (0x92Dc533201e8634f0337D66a11820a8C4E902474) {
    +++ description: None
      address:
-        "0x92Dc533201e8634f0337D66a11820a8C4E902474"
+        "eth:0x92Dc533201e8634f0337D66a11820a8C4E902474"
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
    contract L1ERC721Bridge (0xA99f82730e68968a78AA21522FC7eb90DB76D8Cb) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      address:
-        "0xA99f82730e68968a78AA21522FC7eb90DB76D8Cb"
+        "eth:0xA99f82730e68968a78AA21522FC7eb90DB76D8Cb"
      values.$admin:
-        "0xF3b7697c9C0CbdE923f34991F2D19cC1c66612bD"
+        "eth:0xF3b7697c9C0CbdE923f34991F2D19cC1c66612bD"
      values.$implementation:
-        "0x4Fa018BC93eE0b9183fE138c11c02d0b2209f04f"
+        "eth:0x4Fa018BC93eE0b9183fE138c11c02d0b2209f04f"
      values.$pastUpgrades.0.2.0:
-        "0x4Fa018BC93eE0b9183fE138c11c02d0b2209f04f"
+        "eth:0x4Fa018BC93eE0b9183fE138c11c02d0b2209f04f"
      values.messenger:
-        "0x3a30AEd8fa7717aC2D8454D82c125cF6B875061a"
+        "eth:0x3a30AEd8fa7717aC2D8454D82c125cF6B875061a"
      values.MESSENGER:
-        "0x3a30AEd8fa7717aC2D8454D82c125cF6B875061a"
+        "eth:0x3a30AEd8fa7717aC2D8454D82c125cF6B875061a"
      values.OTHER_BRIDGE:
-        "0x4200000000000000000000000000000000000014"
+        "eth:0x4200000000000000000000000000000000000014"
      values.otherBridge:
-        "0x4200000000000000000000000000000000000014"
+        "eth:0x4200000000000000000000000000000000000014"
      values.superchainConfig:
-        "0x118D04d841B54FC52e56D39371E278EF7815C358"
+        "eth:0x118D04d841B54FC52e56D39371E278EF7815C358"
      implementationNames.0xA99f82730e68968a78AA21522FC7eb90DB76D8Cb:
-        "Proxy"
      implementationNames.0x4Fa018BC93eE0b9183fE138c11c02d0b2209f04f:
-        "L1ERC721Bridge"
      implementationNames.eth:0xA99f82730e68968a78AA21522FC7eb90DB76D8Cb:
+        "Proxy"
      implementationNames.eth:0x4Fa018BC93eE0b9183fE138c11c02d0b2209f04f:
+        "L1ERC721Bridge"
    }
```

```diff
    EOA  (0xa9B074B27DE97f492F8F07fD7C213400E4ca5391) {
    +++ description: None
      address:
-        "0xa9B074B27DE97f492F8F07fD7C213400E4ca5391"
+        "eth:0xa9B074B27DE97f492F8F07fD7C213400E4ca5391"
    }
```

```diff
    EOA  (0xB2354BDF5925d03cA06B03a7bD7386Bd685cE814) {
    +++ description: None
      address:
-        "0xB2354BDF5925d03cA06B03a7bD7386Bd685cE814"
+        "eth:0xB2354BDF5925d03cA06B03a7bD7386Bd685cE814"
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
    contract ProxyAdmin (0xF3b7697c9C0CbdE923f34991F2D19cC1c66612bD) {
    +++ description: None
      address:
-        "0xF3b7697c9C0CbdE923f34991F2D19cC1c66612bD"
+        "eth:0xF3b7697c9C0CbdE923f34991F2D19cC1c66612bD"
      values.addressManager:
-        "0x0a1B34aA2047AD1AbEF8aC085b1a7802Ed9dbCF0"
+        "eth:0x0a1B34aA2047AD1AbEF8aC085b1a7802Ed9dbCF0"
      values.owner:
-        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
+        "eth:0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      implementationNames.0xF3b7697c9C0CbdE923f34991F2D19cC1c66612bD:
-        "ProxyAdmin"
      implementationNames.eth:0xF3b7697c9C0CbdE923f34991F2D19cC1c66612bD:
+        "ProxyAdmin"
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
    contract AddressManager (0x0a1B34aA2047AD1AbEF8aC085b1a7802Ed9dbCF0)
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
```

```diff
+   Status: CREATED
    contract SuperchainConfig (0x118D04d841B54FC52e56D39371E278EF7815C358)
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
    contract OptimismPortal (0x2c2150aa5c75A24fB93d4fD2F2a895D618054f07)
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
```

```diff
+   Status: CREATED
    contract L1CrossDomainMessenger (0x3a30AEd8fa7717aC2D8454D82c125cF6B875061a)
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
```

```diff
+   Status: CREATED
    contract GnosisSafe (0x42d27eEA1AD6e22Af6284F609847CB3Cd56B9c64)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OptimismMintableERC20Factory (0x484529223d68a0Cf85902Bf5E781394f0D0f837C)
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintableERC20 as this chain's representation of a token on the host chain, or vice-versa.
```

```diff
+   Status: CREATED
    contract Conduit Multisig 1 (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SystemConfig (0x525a2744134805516a45B8abb6Aa0aA1dA3809F6)
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
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
    contract L2OutputOracle (0x693A0F8854F458D282DE3C5b69E8eE5EEE8aA949)
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
```

```diff
+   Status: CREATED
    contract OpFoundationUpgradeSafe (0x847B5c174615B1B7fDF770882256e2D3E95b9D92)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1StandardBridge (0x8b0576E39F1233679109F9b40cFcC2a7E0901Ede)
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
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
    contract L1ERC721Bridge (0xA99f82730e68968a78AA21522FC7eb90DB76D8Cb)
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
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
    contract ProxyAdmin (0xF3b7697c9C0CbdE923f34991F2D19cC1c66612bD)
    +++ description: None
```

Generated with discovered.json: 0xcc4ae9687b9f6ff27af0c149d82adb510eda78f1

# Diff at Mon, 14 Jul 2025 08:02:46 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@0dc82cd5064c9c6dc9fb20e2291a8bb6b2048e27 block: 22895950
- current block number: 22895950

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22895950 (main branch discovery), not current.

```diff
    contract OptimismMintableERC20Factory (0x484529223d68a0Cf85902Bf5E781394f0D0f837C) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintableERC20 as this chain's representation of a token on the host chain, or vice-versa.
      description:
-        "A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa."
+        "A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintableERC20 as this chain's representation of a token on the host chain, or vice-versa."
    }
```

Generated with discovered.json: 0x05037032d7382626c87547aeb771ea02a83ce690

# Diff at Fri, 04 Jul 2025 12:19:23 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f56dc47fe915564d4555300304da4d3bcbc087f block: 22615680
- current block number: 22615680

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22615680 (main branch discovery), not current.

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
-        "ethereum:0x118D04d841B54FC52e56D39371E278EF7815C358"
+        "eth:0x118D04d841B54FC52e56D39371E278EF7815C358"
      receivedPermissions.1.via.1.address:
-        "ethereum:0x126a736B18E0a64fBA19D421647A530E327E112C"
+        "eth:0x126a736B18E0a64fBA19D421647A530E327E112C"
      receivedPermissions.1.via.0.address:
-        "ethereum:0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A"
+        "eth:0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A"
      receivedPermissions.1.from:
-        "ethereum:0x2c2150aa5c75A24fB93d4fD2F2a895D618054f07"
+        "eth:0x2c2150aa5c75A24fB93d4fD2F2a895D618054f07"
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
-        "ethereum:0x693A0F8854F458D282DE3C5b69E8eE5EEE8aA949"
+        "eth:0x693A0F8854F458D282DE3C5b69E8eE5EEE8aA949"
      receivedPermissions.1.from:
-        "ethereum:0x693A0F8854F458D282DE3C5b69E8eE5EEE8aA949"
+        "eth:0x693A0F8854F458D282DE3C5b69E8eE5EEE8aA949"
      receivedPermissions.2.via.0.address:
-        "ethereum:0xF3b7697c9C0CbdE923f34991F2D19cC1c66612bD"
+        "eth:0xF3b7697c9C0CbdE923f34991F2D19cC1c66612bD"
      receivedPermissions.2.from:
-        "ethereum:0x0a1B34aA2047AD1AbEF8aC085b1a7802Ed9dbCF0"
+        "eth:0x0a1B34aA2047AD1AbEF8aC085b1a7802Ed9dbCF0"
      receivedPermissions.3.from:
-        "ethereum:0x525a2744134805516a45B8abb6Aa0aA1dA3809F6"
+        "eth:0x525a2744134805516a45B8abb6Aa0aA1dA3809F6"
      receivedPermissions.4.via.0.address:
-        "ethereum:0xF3b7697c9C0CbdE923f34991F2D19cC1c66612bD"
+        "eth:0xF3b7697c9C0CbdE923f34991F2D19cC1c66612bD"
      receivedPermissions.4.from:
-        "ethereum:0x118D04d841B54FC52e56D39371E278EF7815C358"
+        "eth:0x118D04d841B54FC52e56D39371E278EF7815C358"
      receivedPermissions.5.via.0.address:
-        "ethereum:0xF3b7697c9C0CbdE923f34991F2D19cC1c66612bD"
+        "eth:0xF3b7697c9C0CbdE923f34991F2D19cC1c66612bD"
      receivedPermissions.5.from:
-        "ethereum:0x2c2150aa5c75A24fB93d4fD2F2a895D618054f07"
+        "eth:0x2c2150aa5c75A24fB93d4fD2F2a895D618054f07"
      receivedPermissions.6.via.0.address:
-        "ethereum:0xF3b7697c9C0CbdE923f34991F2D19cC1c66612bD"
+        "eth:0xF3b7697c9C0CbdE923f34991F2D19cC1c66612bD"
      receivedPermissions.6.from:
-        "ethereum:0x3a30AEd8fa7717aC2D8454D82c125cF6B875061a"
+        "eth:0x3a30AEd8fa7717aC2D8454D82c125cF6B875061a"
      receivedPermissions.7.via.0.address:
-        "ethereum:0xF3b7697c9C0CbdE923f34991F2D19cC1c66612bD"
+        "eth:0xF3b7697c9C0CbdE923f34991F2D19cC1c66612bD"
      receivedPermissions.7.from:
-        "ethereum:0x484529223d68a0Cf85902Bf5E781394f0D0f837C"
+        "eth:0x484529223d68a0Cf85902Bf5E781394f0D0f837C"
      receivedPermissions.8.via.0.address:
-        "ethereum:0xF3b7697c9C0CbdE923f34991F2D19cC1c66612bD"
+        "eth:0xF3b7697c9C0CbdE923f34991F2D19cC1c66612bD"
      receivedPermissions.8.from:
-        "ethereum:0x525a2744134805516a45B8abb6Aa0aA1dA3809F6"
+        "eth:0x525a2744134805516a45B8abb6Aa0aA1dA3809F6"
      receivedPermissions.9.via.0.address:
-        "ethereum:0xF3b7697c9C0CbdE923f34991F2D19cC1c66612bD"
+        "eth:0xF3b7697c9C0CbdE923f34991F2D19cC1c66612bD"
      receivedPermissions.9.from:
-        "ethereum:0x693A0F8854F458D282DE3C5b69E8eE5EEE8aA949"
+        "eth:0x693A0F8854F458D282DE3C5b69E8eE5EEE8aA949"
      receivedPermissions.10.via.0.address:
-        "ethereum:0xF3b7697c9C0CbdE923f34991F2D19cC1c66612bD"
+        "eth:0xF3b7697c9C0CbdE923f34991F2D19cC1c66612bD"
      receivedPermissions.10.from:
-        "ethereum:0x8b0576E39F1233679109F9b40cFcC2a7E0901Ede"
+        "eth:0x8b0576E39F1233679109F9b40cFcC2a7E0901Ede"
      receivedPermissions.11.via.0.address:
-        "ethereum:0xF3b7697c9C0CbdE923f34991F2D19cC1c66612bD"
+        "eth:0xF3b7697c9C0CbdE923f34991F2D19cC1c66612bD"
      receivedPermissions.11.from:
-        "ethereum:0xA99f82730e68968a78AA21522FC7eb90DB76D8Cb"
+        "eth:0xA99f82730e68968a78AA21522FC7eb90DB76D8Cb"
      directlyReceivedPermissions.0.from:
-        "ethereum:0xF3b7697c9C0CbdE923f34991F2D19cC1c66612bD"
+        "eth:0xF3b7697c9C0CbdE923f34991F2D19cC1c66612bD"
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
      receivedPermissions.0.from:
-        "ethereum:0x118D04d841B54FC52e56D39371E278EF7815C358"
+        "eth:0x118D04d841B54FC52e56D39371E278EF7815C358"
      receivedPermissions.1.from:
-        "ethereum:0x2c2150aa5c75A24fB93d4fD2F2a895D618054f07"
+        "eth:0x2c2150aa5c75A24fB93d4fD2F2a895D618054f07"
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
    EOA  (0xa9B074B27DE97f492F8F07fD7C213400E4ca5391) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0x525a2744134805516a45B8abb6Aa0aA1dA3809F6"
+        "eth:0x525a2744134805516a45B8abb6Aa0aA1dA3809F6"
    }
```

```diff
    EOA  (0xB2354BDF5925d03cA06B03a7bD7386Bd685cE814) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0x693A0F8854F458D282DE3C5b69E8eE5EEE8aA949"
+        "eth:0x693A0F8854F458D282DE3C5b69E8eE5EEE8aA949"
      receivedPermissions.1.from:
-        "ethereum:0x693A0F8854F458D282DE3C5b69E8eE5EEE8aA949"
+        "eth:0x693A0F8854F458D282DE3C5b69E8eE5EEE8aA949"
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
    contract ProxyAdmin (0xF3b7697c9C0CbdE923f34991F2D19cC1c66612bD) {
    +++ description: None
      directlyReceivedPermissions.0.from:
-        "ethereum:0x0a1B34aA2047AD1AbEF8aC085b1a7802Ed9dbCF0"
+        "eth:0x0a1B34aA2047AD1AbEF8aC085b1a7802Ed9dbCF0"
      directlyReceivedPermissions.1.from:
-        "ethereum:0x118D04d841B54FC52e56D39371E278EF7815C358"
+        "eth:0x118D04d841B54FC52e56D39371E278EF7815C358"
      directlyReceivedPermissions.2.from:
-        "ethereum:0x2c2150aa5c75A24fB93d4fD2F2a895D618054f07"
+        "eth:0x2c2150aa5c75A24fB93d4fD2F2a895D618054f07"
      directlyReceivedPermissions.3.from:
-        "ethereum:0x3a30AEd8fa7717aC2D8454D82c125cF6B875061a"
+        "eth:0x3a30AEd8fa7717aC2D8454D82c125cF6B875061a"
      directlyReceivedPermissions.4.from:
-        "ethereum:0x484529223d68a0Cf85902Bf5E781394f0D0f837C"
+        "eth:0x484529223d68a0Cf85902Bf5E781394f0D0f837C"
      directlyReceivedPermissions.5.from:
-        "ethereum:0x525a2744134805516a45B8abb6Aa0aA1dA3809F6"
+        "eth:0x525a2744134805516a45B8abb6Aa0aA1dA3809F6"
      directlyReceivedPermissions.6.from:
-        "ethereum:0x693A0F8854F458D282DE3C5b69E8eE5EEE8aA949"
+        "eth:0x693A0F8854F458D282DE3C5b69E8eE5EEE8aA949"
      directlyReceivedPermissions.7.from:
-        "ethereum:0x8b0576E39F1233679109F9b40cFcC2a7E0901Ede"
+        "eth:0x8b0576E39F1233679109F9b40cFcC2a7E0901Ede"
      directlyReceivedPermissions.8.from:
-        "ethereum:0xA99f82730e68968a78AA21522FC7eb90DB76D8Cb"
+        "eth:0xA99f82730e68968a78AA21522FC7eb90DB76D8Cb"
    }
```

Generated with discovered.json: 0x8c511ffae379db7975d7de3f66c5efaf7d80bfc4

# Diff at Mon, 16 Jun 2025 08:43:21 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@e1208475abce20cea1768d2e4878c03350c1b7c9 block: 22615680
- current block number: 22615680

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22615680 (main branch discovery), not current.

```diff
    contract L1CrossDomainMessenger (0x3a30AEd8fa7717aC2D8454D82c125cF6B875061a) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      values.$admin:
+        "0xF3b7697c9C0CbdE923f34991F2D19cC1c66612bD"
    }
```

```diff
    contract Conduit Multisig 1 (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      receivedPermissions.11:
+        {"permission":"upgrade","from":"ethereum:0xA99f82730e68968a78AA21522FC7eb90DB76D8Cb","role":"admin","via":[{"address":"ethereum:0xF3b7697c9C0CbdE923f34991F2D19cC1c66612bD"}]}
      receivedPermissions.10.from:
-        "ethereum:0xA99f82730e68968a78AA21522FC7eb90DB76D8Cb"
+        "ethereum:0x693A0F8854F458D282DE3C5b69E8eE5EEE8aA949"
      receivedPermissions.9.from:
-        "ethereum:0x693A0F8854F458D282DE3C5b69E8eE5EEE8aA949"
+        "ethereum:0x525a2744134805516a45B8abb6Aa0aA1dA3809F6"
      receivedPermissions.8.from:
-        "ethereum:0x525a2744134805516a45B8abb6Aa0aA1dA3809F6"
+        "ethereum:0x118D04d841B54FC52e56D39371E278EF7815C358"
      receivedPermissions.7.from:
-        "ethereum:0x118D04d841B54FC52e56D39371E278EF7815C358"
+        "ethereum:0x484529223d68a0Cf85902Bf5E781394f0D0f837C"
      receivedPermissions.6.permission:
-        "upgrade"
+        "challenge"
      receivedPermissions.6.from:
-        "ethereum:0x484529223d68a0Cf85902Bf5E781394f0D0f837C"
+        "ethereum:0x693A0F8854F458D282DE3C5b69E8eE5EEE8aA949"
      receivedPermissions.6.role:
-        "admin"
+        ".CHALLENGER"
      receivedPermissions.6.via:
-        [{"address":"ethereum:0xF3b7697c9C0CbdE923f34991F2D19cC1c66612bD"}]
      receivedPermissions.5.permission:
-        "challenge"
+        "upgrade"
      receivedPermissions.5.from:
-        "ethereum:0x693A0F8854F458D282DE3C5b69E8eE5EEE8aA949"
+        "ethereum:0x2c2150aa5c75A24fB93d4fD2F2a895D618054f07"
      receivedPermissions.5.role:
-        ".CHALLENGER"
+        "admin"
      receivedPermissions.5.via:
+        [{"address":"ethereum:0xF3b7697c9C0CbdE923f34991F2D19cC1c66612bD"}]
      receivedPermissions.4.permission:
-        "upgrade"
+        "challenge"
      receivedPermissions.4.from:
-        "ethereum:0x2c2150aa5c75A24fB93d4fD2F2a895D618054f07"
+        "ethereum:0x693A0F8854F458D282DE3C5b69E8eE5EEE8aA949"
      receivedPermissions.4.role:
-        "admin"
+        ".challenger"
      receivedPermissions.4.via:
-        [{"address":"ethereum:0xF3b7697c9C0CbdE923f34991F2D19cC1c66612bD"}]
      receivedPermissions.3.permission:
-        "challenge"
+        "upgrade"
      receivedPermissions.3.from:
-        "ethereum:0x693A0F8854F458D282DE3C5b69E8eE5EEE8aA949"
+        "ethereum:0x3a30AEd8fa7717aC2D8454D82c125cF6B875061a"
      receivedPermissions.3.role:
-        ".challenger"
+        "admin"
      receivedPermissions.3.via:
+        [{"address":"ethereum:0xF3b7697c9C0CbdE923f34991F2D19cC1c66612bD"}]
    }
```

```diff
    contract ProxyAdmin (0xF3b7697c9C0CbdE923f34991F2D19cC1c66612bD) {
    +++ description: None
      directlyReceivedPermissions.8:
+        {"permission":"upgrade","from":"ethereum:0xA99f82730e68968a78AA21522FC7eb90DB76D8Cb","role":"admin"}
      directlyReceivedPermissions.7.from:
-        "ethereum:0xA99f82730e68968a78AA21522FC7eb90DB76D8Cb"
+        "ethereum:0x693A0F8854F458D282DE3C5b69E8eE5EEE8aA949"
      directlyReceivedPermissions.6.from:
-        "ethereum:0x693A0F8854F458D282DE3C5b69E8eE5EEE8aA949"
+        "ethereum:0x525a2744134805516a45B8abb6Aa0aA1dA3809F6"
      directlyReceivedPermissions.5.from:
-        "ethereum:0x525a2744134805516a45B8abb6Aa0aA1dA3809F6"
+        "ethereum:0x118D04d841B54FC52e56D39371E278EF7815C358"
      directlyReceivedPermissions.4.from:
-        "ethereum:0x118D04d841B54FC52e56D39371E278EF7815C358"
+        "ethereum:0x484529223d68a0Cf85902Bf5E781394f0D0f837C"
      directlyReceivedPermissions.3.from:
-        "ethereum:0x484529223d68a0Cf85902Bf5E781394f0D0f837C"
+        "ethereum:0x2c2150aa5c75A24fB93d4fD2F2a895D618054f07"
      directlyReceivedPermissions.2.from:
-        "ethereum:0x2c2150aa5c75A24fB93d4fD2F2a895D618054f07"
+        "ethereum:0x3a30AEd8fa7717aC2D8454D82c125cF6B875061a"
    }
```

Generated with discovered.json: 0xdbd5b378d9cba4a198bbc6d519e640cb094f5f97

# Diff at Mon, 02 Jun 2025 08:02:37 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@2fee84b782a329885c84742cf9cf43143842a2d5 block: 22437747
- current block number: 22615680

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

Generated with discovered.json: 0x73014f34e7641cc383261dba7137e03ed11b489b

# Diff at Fri, 30 May 2025 07:16:35 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@a4d8c436027d17df0f9b76843cd6deb1888fa381 block: 22437747
- current block number: 22437747

## Description

config: change comment about eip1559 fee val

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22437747 (main branch discovery), not current.

```diff
    contract SystemConfig (0x525a2744134805516a45B8abb6Aa0aA1dA3809F6) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      fieldMeta.eip1559Denominator:
+        {"description":"volatility param: lower denominator -> quicker fee changes on L2"}
    }
```

Generated with discovered.json: 0xf818af72be5290fc750a94e9d64cbaa9e7f2be2f

# Diff at Thu, 29 May 2025 07:50:46 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@9764537dfab122079ee09c9ec95835b322e2dd25 block: 22437747
- current block number: 22437747

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22437747 (main branch discovery), not current.

```diff
+   Status: CREATED
    contract LivenessGuard (0x24424336F04440b1c28685a38303aC33C9D14a25)
    +++ description: None
```

Generated with discovered.json: 0x573a55046d4bdc818bccef5ed084b9a6658de38d

# Diff at Fri, 23 May 2025 09:41:06 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@69cd181abbc3c830a6caf2f4429b37cae72ffdb8 block: 22437747
- current block number: 22437747

## Description

Introduced .role field on each permission, defaulting to field name on which it was defined (with '.' prefix)

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22437747 (main branch discovery), not current.

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
+        {"permission":"upgrade","from":"0x484529223d68a0Cf85902Bf5E781394f0D0f837C","role":"admin","via":[{"address":"0xF3b7697c9C0CbdE923f34991F2D19cC1c66612bD"}]}
      receivedPermissions.9.from:
-        "0x484529223d68a0Cf85902Bf5E781394f0D0f837C"
+        "0x2c2150aa5c75A24fB93d4fD2F2a895D618054f07"
      receivedPermissions.9.role:
+        "admin"
      receivedPermissions.8.from:
-        "0x2c2150aa5c75A24fB93d4fD2F2a895D618054f07"
+        "0x693A0F8854F458D282DE3C5b69E8eE5EEE8aA949"
      receivedPermissions.8.role:
+        "admin"
      receivedPermissions.7.from:
-        "0x693A0F8854F458D282DE3C5b69E8eE5EEE8aA949"
+        "0x525a2744134805516a45B8abb6Aa0aA1dA3809F6"
      receivedPermissions.7.role:
+        "admin"
      receivedPermissions.6.from:
-        "0x525a2744134805516a45B8abb6Aa0aA1dA3809F6"
+        "0x118D04d841B54FC52e56D39371E278EF7815C358"
      receivedPermissions.6.role:
+        "admin"
      receivedPermissions.5.from:
-        "0x118D04d841B54FC52e56D39371E278EF7815C358"
+        "0xA99f82730e68968a78AA21522FC7eb90DB76D8Cb"
      receivedPermissions.5.role:
+        "admin"
      receivedPermissions.4.role:
+        ".CHALLENGER"
      receivedPermissions.3.permission:
-        "upgrade"
+        "challenge"
      receivedPermissions.3.from:
-        "0x8b0576E39F1233679109F9b40cFcC2a7E0901Ede"
+        "0x693A0F8854F458D282DE3C5b69E8eE5EEE8aA949"
      receivedPermissions.3.description:
-        "upgrading the bridge implementation can give access to all funds escrowed therein."
      receivedPermissions.3.via:
-        [{"address":"0xF3b7697c9C0CbdE923f34991F2D19cC1c66612bD"}]
      receivedPermissions.3.role:
+        ".challenger"
      receivedPermissions.2.permission:
-        "interact"
+        "upgrade"
      receivedPermissions.2.from:
-        "0x0a1B34aA2047AD1AbEF8aC085b1a7802Ed9dbCF0"
+        "0x8b0576E39F1233679109F9b40cFcC2a7E0901Ede"
      receivedPermissions.2.description:
-        "set and change address mappings."
+        "upgrading the bridge implementation can give access to all funds escrowed therein."
      receivedPermissions.2.role:
+        ".$admin"
      receivedPermissions.1.permission:
-        "upgrade"
+        "interact"
      receivedPermissions.1.from:
-        "0xA99f82730e68968a78AA21522FC7eb90DB76D8Cb"
+        "0x0a1B34aA2047AD1AbEF8aC085b1a7802Ed9dbCF0"
      receivedPermissions.1.description:
+        "set and change address mappings."
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
    EOA  (0xa9B074B27DE97f492F8F07fD7C213400E4ca5391) {
    +++ description: None
      receivedPermissions.0.role:
+        ".batcherHash"
    }
```

```diff
    EOA  (0xB2354BDF5925d03cA06B03a7bD7386Bd685cE814) {
    +++ description: None
      receivedPermissions.1:
+        {"permission":"propose","from":"0x693A0F8854F458D282DE3C5b69E8eE5EEE8aA949","role":".proposer"}
      receivedPermissions.0.role:
+        ".PROPOSER"
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
    contract ProxyAdmin (0xF3b7697c9C0CbdE923f34991F2D19cC1c66612bD) {
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
      directlyReceivedPermissions.2.from:
-        "0x8b0576E39F1233679109F9b40cFcC2a7E0901Ede"
+        "0xA99f82730e68968a78AA21522FC7eb90DB76D8Cb"
      directlyReceivedPermissions.2.description:
-        "upgrading the bridge implementation can give access to all funds escrowed therein."
      directlyReceivedPermissions.2.role:
+        "admin"
      directlyReceivedPermissions.1.permission:
-        "interact"
+        "upgrade"
      directlyReceivedPermissions.1.from:
-        "0x0a1B34aA2047AD1AbEF8aC085b1a7802Ed9dbCF0"
+        "0x8b0576E39F1233679109F9b40cFcC2a7E0901Ede"
      directlyReceivedPermissions.1.description:
-        "set and change address mappings."
+        "upgrading the bridge implementation can give access to all funds escrowed therein."
      directlyReceivedPermissions.1.role:
+        ".$admin"
      directlyReceivedPermissions.0.permission:
-        "upgrade"
+        "interact"
      directlyReceivedPermissions.0.from:
-        "0xA99f82730e68968a78AA21522FC7eb90DB76D8Cb"
+        "0x0a1B34aA2047AD1AbEF8aC085b1a7802Ed9dbCF0"
      directlyReceivedPermissions.0.description:
+        "set and change address mappings."
      directlyReceivedPermissions.0.role:
+        ".owner"
    }
```

Generated with discovered.json: 0x7379dfb61f1fe7929c4c563f419e59277eb31ae8

# Diff at Fri, 09 May 2025 10:09:21 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@c3a1d49c07f4092914d62c65181e5fec18a88318 block: 22437747
- current block number: 22437747

## Description

Config related: Move IFs to the editable string for condition configs (yeet IFs from the automatic resolver).

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22437747 (main branch discovery), not current.

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

Generated with discovered.json: 0x45707e6370501fed37075f67b93e7c0786e1a5d1

# Diff at Thu, 08 May 2025 08:51:10 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@8e1926142ab0c57cc131de4d8da307e13d9af54d block: 22165377
- current block number: 22437747

## Description

Superchain guardian connected, not full superchain gov.

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
+        {"permission":"guard","from":"0x2c2150aa5c75A24fB93d4fD2F2a895D618054f07"}
      receivedPermissions.1.from:
-        "0x2c2150aa5c75A24fB93d4fD2F2a895D618054f07"
+        "0x118D04d841B54FC52e56D39371E278EF7815C358"
      receivedPermissions.0.from:
-        "0x118D04d841B54FC52e56D39371E278EF7815C358"
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
...0x0a1B34aA2047AD1AbEF8aC085b1a7802Ed9dbCF0.sol} |    0
 ...-0xdE1FCfB0851916CA5101820A69b13a4E276bd81F.sol |  152 +++
 .../ethereum/.flat/DeputyGuardianModule.sol        |  156 +++
 .../superseed/ethereum/.flat/DeputyPauseModule.sol | 1338 ++++++++++++++++++++
 .../superseed/ethereum/.flat/LivenessModule.sol    |  258 ++++
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

Generated with discovered.json: 0x3da76880222ea1da4cd6fb562ed87c41d3da7c0d

# Diff at Tue, 29 Apr 2025 08:19:13 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@ef7477af00fe0b57a2f7cacf7e958c12494af662 block: 22165377
- current block number: 22165377

## Description

Field .issuedPermissions is removed from the output as no longer needed. Added 'permissionsConfigHash' due to refactoring of the modelling process (into a separate command).

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22165377 (main branch discovery), not current.

```diff
    contract AddressManager (0x0a1B34aA2047AD1AbEF8aC085b1a7802Ed9dbCF0) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      issuedPermissions:
-        [{"permission":"interact","to":"0x4a4962275DF8C60a80d3a25faEc5AA7De116A746","description":"set and change address mappings.","via":[{"address":"0xF3b7697c9C0CbdE923f34991F2D19cC1c66612bD"}]}]
    }
```

```diff
    contract SuperchainConfig (0x118D04d841B54FC52e56D39371E278EF7815C358) {
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      issuedPermissions:
-        [{"permission":"guard","to":"0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A","via":[]},{"permission":"upgrade","to":"0x4a4962275DF8C60a80d3a25faEc5AA7De116A746","via":[{"address":"0xF3b7697c9C0CbdE923f34991F2D19cC1c66612bD"}]}]
    }
```

```diff
    contract OptimismPortal (0x2c2150aa5c75A24fB93d4fD2F2a895D618054f07) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      issuedPermissions:
-        [{"permission":"guard","to":"0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A","via":[]},{"permission":"upgrade","to":"0x4a4962275DF8C60a80d3a25faEc5AA7De116A746","via":[{"address":"0xF3b7697c9C0CbdE923f34991F2D19cC1c66612bD"}]}]
    }
```

```diff
    contract OptimismMintableERC20Factory (0x484529223d68a0Cf85902Bf5E781394f0D0f837C) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x4a4962275DF8C60a80d3a25faEc5AA7De116A746","via":[{"address":"0xF3b7697c9C0CbdE923f34991F2D19cC1c66612bD"}]}]
    }
```

```diff
    contract SystemConfig (0x525a2744134805516a45B8abb6Aa0aA1dA3809F6) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      issuedPermissions:
-        [{"permission":"interact","to":"0x4a4962275DF8C60a80d3a25faEc5AA7De116A746","description":"it can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system.","via":[]},{"permission":"sequence","to":"0xa9B074B27DE97f492F8F07fD7C213400E4ca5391","via":[]},{"permission":"upgrade","to":"0x4a4962275DF8C60a80d3a25faEc5AA7De116A746","via":[{"address":"0xF3b7697c9C0CbdE923f34991F2D19cC1c66612bD"}]}]
    }
```

```diff
    contract L2OutputOracle (0x693A0F8854F458D282DE3C5b69E8eE5EEE8aA949) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      issuedPermissions:
-        [{"permission":"challenge","to":"0x4a4962275DF8C60a80d3a25faEc5AA7De116A746","via":[]},{"permission":"propose","to":"0xB2354BDF5925d03cA06B03a7bD7386Bd685cE814","via":[]},{"permission":"upgrade","to":"0x4a4962275DF8C60a80d3a25faEc5AA7De116A746","via":[{"address":"0xF3b7697c9C0CbdE923f34991F2D19cC1c66612bD"}]}]
    }
```

```diff
    contract L1StandardBridge (0x8b0576E39F1233679109F9b40cFcC2a7E0901Ede) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x4a4962275DF8C60a80d3a25faEc5AA7De116A746","description":"upgrading the bridge implementation can give access to all funds escrowed therein.","via":[{"address":"0xF3b7697c9C0CbdE923f34991F2D19cC1c66612bD"}]}]
    }
```

```diff
    contract L1ERC721Bridge (0xA99f82730e68968a78AA21522FC7eb90DB76D8Cb) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x4a4962275DF8C60a80d3a25faEc5AA7De116A746","via":[{"address":"0xF3b7697c9C0CbdE923f34991F2D19cC1c66612bD"}]}]
    }
```

Generated with discovered.json: 0x6b8f47c6dd67058b5e18d28b4430bc59133b6bcf

# Diff at Mon, 31 Mar 2025 07:55:13 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- current block number: 22165377

## Description

Initial discovery: standard OP stack without proof system (conduit) and unused dispute game contracts.

## Initial discovery

```diff
+   Status: CREATED
    contract AddressManager (0x0a1B34aA2047AD1AbEF8aC085b1a7802Ed9dbCF0)
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
```

```diff
+   Status: CREATED
    contract SuperchainConfig (0x118D04d841B54FC52e56D39371E278EF7815C358)
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
```

```diff
+   Status: CREATED
    contract OptimismPortal (0x2c2150aa5c75A24fB93d4fD2F2a895D618054f07)
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
```

```diff
+   Status: CREATED
    contract L1CrossDomainMessenger (0x3a30AEd8fa7717aC2D8454D82c125cF6B875061a)
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
```

```diff
+   Status: CREATED
    contract GnosisSafe (0x42d27eEA1AD6e22Af6284F609847CB3Cd56B9c64)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OptimismMintableERC20Factory (0x484529223d68a0Cf85902Bf5E781394f0D0f837C)
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
```

```diff
+   Status: CREATED
    contract Conduit Multisig 1 (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SystemConfig (0x525a2744134805516a45B8abb6Aa0aA1dA3809F6)
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
```

```diff
+   Status: CREATED
    contract L2OutputOracle (0x693A0F8854F458D282DE3C5b69E8eE5EEE8aA949)
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
```

```diff
+   Status: CREATED
    contract L1StandardBridge (0x8b0576E39F1233679109F9b40cFcC2a7E0901Ede)
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
```

```diff
+   Status: CREATED
    contract OpFoundationOperationsSafe (0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1ERC721Bridge (0xA99f82730e68968a78AA21522FC7eb90DB76D8Cb)
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0xF3b7697c9C0CbdE923f34991F2D19cC1c66612bD)
    +++ description: None
```
