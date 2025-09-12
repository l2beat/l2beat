Generated with discovered.json: 0xdd0bae03aeab90c0cd26aac31d9cd0e9e6b4c2c5

# Diff at Mon, 01 Sep 2025 10:01:10 GMT:

Merge mark

Generated with discovered.json: 0xf85c77dbc01857bc2ab4089df2e6e3f0b82185e4

# Diff at Tue, 15 Jul 2025 09:07:39 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@fe7c3b2343ca7836e6a947e456ab91a6f0f6f592 block: 21802884
- current block number: 22923582

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

Generated with discovered.json: 0x92943551dfea16fa561f473120b5c7527be16074

# Diff at Mon, 14 Jul 2025 12:45:01 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@9f4300dad2f3d080cd56fa311d4a848556c74e72 block: 21802884
- current block number: 21802884

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21802884 (main branch discovery), not current.

```diff
    EOA  (0x000000000000000000000000000000000000dEaD) {
    +++ description: None
      address:
-        "0x000000000000000000000000000000000000dEaD"
+        "eth:0x000000000000000000000000000000000000dEaD"
    }
```

```diff
    contract L1ERC721Bridge (0x00050ae93fBFaf5823A4ae229E4651F7F7A02FfA) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      address:
-        "0x00050ae93fBFaf5823A4ae229E4651F7F7A02FfA"
+        "eth:0x00050ae93fBFaf5823A4ae229E4651F7F7A02FfA"
      values.$admin:
-        "0x0bc380347A0B7aF5453492CAF20e1E38bc0Abc2f"
+        "eth:0x0bc380347A0B7aF5453492CAF20e1E38bc0Abc2f"
      values.$implementation:
-        "0x26dcD660CFe0ae991053dA73077914F95C15E79D"
+        "eth:0x26dcD660CFe0ae991053dA73077914F95C15E79D"
      values.$pastUpgrades.0.2.0:
-        "0x26dcD660CFe0ae991053dA73077914F95C15E79D"
+        "eth:0x26dcD660CFe0ae991053dA73077914F95C15E79D"
      values.messenger:
-        "0x226A1e4A3D8e64A9De8423F9344348c179C72CB2"
+        "eth:0x226A1e4A3D8e64A9De8423F9344348c179C72CB2"
      values.MESSENGER:
-        "0x226A1e4A3D8e64A9De8423F9344348c179C72CB2"
+        "eth:0x226A1e4A3D8e64A9De8423F9344348c179C72CB2"
      values.OTHER_BRIDGE:
-        "0x4200000000000000000000000000000000000014"
+        "eth:0x4200000000000000000000000000000000000014"
      values.otherBridge:
-        "0x4200000000000000000000000000000000000014"
+        "eth:0x4200000000000000000000000000000000000014"
      values.superchainConfig:
-        "0x14B768F93f256Ad8D2d018930DBdAe61306c4752"
+        "eth:0x14B768F93f256Ad8D2d018930DBdAe61306c4752"
      implementationNames.0x00050ae93fBFaf5823A4ae229E4651F7F7A02FfA:
-        "Proxy"
      implementationNames.0x26dcD660CFe0ae991053dA73077914F95C15E79D:
-        "L1ERC721Bridge"
      implementationNames.eth:0x00050ae93fBFaf5823A4ae229E4651F7F7A02FfA:
+        "Proxy"
      implementationNames.eth:0x26dcD660CFe0ae991053dA73077914F95C15E79D:
+        "L1ERC721Bridge"
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
    contract ProxyAdmin (0x0bc380347A0B7aF5453492CAF20e1E38bc0Abc2f) {
    +++ description: None
      address:
-        "0x0bc380347A0B7aF5453492CAF20e1E38bc0Abc2f"
+        "eth:0x0bc380347A0B7aF5453492CAF20e1E38bc0Abc2f"
      values.addressManager:
-        "0x464Ca56D40f94E8A50eFa7F5b90c59D956a0efC9"
+        "eth:0x464Ca56D40f94E8A50eFa7F5b90c59D956a0efC9"
      values.owner:
-        "0xB68361AAac2Bc8a4b8BFe36B8C6d0B429b5930ea"
+        "eth:0xB68361AAac2Bc8a4b8BFe36B8C6d0B429b5930ea"
      implementationNames.0x0bc380347A0B7aF5453492CAF20e1E38bc0Abc2f:
-        "ProxyAdmin"
      implementationNames.eth:0x0bc380347A0B7aF5453492CAF20e1E38bc0Abc2f:
+        "ProxyAdmin"
    }
```

```diff
    contract L2OutputOracle (0x0eB331B615030819464225Ecd373e5FFBE502DC4) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      address:
-        "0x0eB331B615030819464225Ecd373e5FFBE502DC4"
+        "eth:0x0eB331B615030819464225Ecd373e5FFBE502DC4"
      values.$admin:
-        "0x0bc380347A0B7aF5453492CAF20e1E38bc0Abc2f"
+        "eth:0x0bc380347A0B7aF5453492CAF20e1E38bc0Abc2f"
      values.$implementation:
-        "0xC12C14d46a53a0BBAA1e71Ae42bA4fAb079E7933"
+        "eth:0xC12C14d46a53a0BBAA1e71Ae42bA4fAb079E7933"
      values.$pastUpgrades.0.2.0:
-        "0xC12C14d46a53a0BBAA1e71Ae42bA4fAb079E7933"
+        "eth:0xC12C14d46a53a0BBAA1e71Ae42bA4fAb079E7933"
+++ severity: HIGH
      values.challenger:
-        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
+        "eth:0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
      values.CHALLENGER:
-        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
+        "eth:0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
+++ severity: HIGH
      values.proposer:
-        "0xF49212F977986347b73345D382a811e148751eED"
+        "eth:0xF49212F977986347b73345D382a811e148751eED"
      values.PROPOSER:
-        "0xF49212F977986347b73345D382a811e148751eED"
+        "eth:0xF49212F977986347b73345D382a811e148751eED"
      implementationNames.0x0eB331B615030819464225Ecd373e5FFBE502DC4:
-        "Proxy"
      implementationNames.0xC12C14d46a53a0BBAA1e71Ae42bA4fAb079E7933:
-        "L2OutputOracle"
      implementationNames.eth:0x0eB331B615030819464225Ecd373e5FFBE502DC4:
+        "Proxy"
      implementationNames.eth:0xC12C14d46a53a0BBAA1e71Ae42bA4fAb079E7933:
+        "L2OutputOracle"
    }
```

```diff
    contract SuperchainConfig (0x14B768F93f256Ad8D2d018930DBdAe61306c4752) {
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      address:
-        "0x14B768F93f256Ad8D2d018930DBdAe61306c4752"
+        "eth:0x14B768F93f256Ad8D2d018930DBdAe61306c4752"
      values.$admin:
-        "0x0bc380347A0B7aF5453492CAF20e1E38bc0Abc2f"
+        "eth:0x0bc380347A0B7aF5453492CAF20e1E38bc0Abc2f"
      values.$implementation:
-        "0xD3fc43F83E0f287b9438cE323AC0Da8dEf28c65b"
+        "eth:0xD3fc43F83E0f287b9438cE323AC0Da8dEf28c65b"
      values.$pastUpgrades.0.2.0:
-        "0xD3fc43F83E0f287b9438cE323AC0Da8dEf28c65b"
+        "eth:0xD3fc43F83E0f287b9438cE323AC0Da8dEf28c65b"
      values.guardian:
-        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
+        "eth:0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
      implementationNames.0x14B768F93f256Ad8D2d018930DBdAe61306c4752:
-        "Proxy"
      implementationNames.0xD3fc43F83E0f287b9438cE323AC0Da8dEf28c65b:
-        "SuperchainConfig"
      implementationNames.eth:0x14B768F93f256Ad8D2d018930DBdAe61306c4752:
+        "Proxy"
      implementationNames.eth:0xD3fc43F83E0f287b9438cE323AC0Da8dEf28c65b:
+        "SuperchainConfig"
    }
```

```diff
    contract SystemConfig (0x20c3035C92bdB4C461242571EeAc59EeD03Df931) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      address:
-        "0x20c3035C92bdB4C461242571EeAc59EeD03Df931"
+        "eth:0x20c3035C92bdB4C461242571EeAc59EeD03Df931"
      values.$admin:
-        "0x0bc380347A0B7aF5453492CAF20e1E38bc0Abc2f"
+        "eth:0x0bc380347A0B7aF5453492CAF20e1E38bc0Abc2f"
      values.$implementation:
-        "0xe9670A42Fd1433c29Eda37eE63EF96A3277A9b93"
+        "eth:0xe9670A42Fd1433c29Eda37eE63EF96A3277A9b93"
      values.$pastUpgrades.0.2.0:
-        "0xe9670A42Fd1433c29Eda37eE63EF96A3277A9b93"
+        "eth:0xe9670A42Fd1433c29Eda37eE63EF96A3277A9b93"
      values.batcherHash:
-        "0x43Ca061Ea80FBB4A2b5515F4be4e953b191147aF"
+        "eth:0x43Ca061Ea80FBB4A2b5515F4be4e953b191147aF"
      values.batchInbox:
-        "0xfF00000000000000000000000000000000000183"
+        "eth:0xfF00000000000000000000000000000000000183"
      values.disputeGameFactory:
-        "0xFcdb270B674911D321F1014c347EaBB1c55134FB"
+        "eth:0xFcdb270B674911D321F1014c347EaBB1c55134FB"
      values.gasPayingToken.addr_:
-        "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE"
+        "eth:0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE"
      values.l1CrossDomainMessenger:
-        "0x226A1e4A3D8e64A9De8423F9344348c179C72CB2"
+        "eth:0x226A1e4A3D8e64A9De8423F9344348c179C72CB2"
      values.l1ERC721Bridge:
-        "0x00050ae93fBFaf5823A4ae229E4651F7F7A02FfA"
+        "eth:0x00050ae93fBFaf5823A4ae229E4651F7F7A02FfA"
      values.l1StandardBridge:
-        "0x908C324c35fF36F64236A7CDa4D50f3003E9C5C3"
+        "eth:0x908C324c35fF36F64236A7CDa4D50f3003E9C5C3"
      values.optimismMintableERC20Factory:
-        "0x45BEaf3Bd26b76796692b1Ef1E67469B84ADB914"
+        "eth:0x45BEaf3Bd26b76796692b1Ef1E67469B84ADB914"
      values.optimismPortal:
-        "0xDA29f0B4da6c23f6c1aF273945c290C0268c4ea9"
+        "eth:0xDA29f0B4da6c23f6c1aF273945c290C0268c4ea9"
      values.owner:
-        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
+        "eth:0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
      values.sequencerInbox:
-        "0xfF00000000000000000000000000000000000183"
+        "eth:0xfF00000000000000000000000000000000000183"
      values.unsafeBlockSigner:
-        "0xD1705B4FFFc540EDeD73046ee1F3A8Db10d143f8"
+        "eth:0xD1705B4FFFc540EDeD73046ee1F3A8Db10d143f8"
      implementationNames.0x20c3035C92bdB4C461242571EeAc59EeD03Df931:
-        "Proxy"
      implementationNames.0xe9670A42Fd1433c29Eda37eE63EF96A3277A9b93:
-        "SystemConfig"
      implementationNames.eth:0x20c3035C92bdB4C461242571EeAc59EeD03Df931:
+        "Proxy"
      implementationNames.eth:0xe9670A42Fd1433c29Eda37eE63EF96A3277A9b93:
+        "SystemConfig"
    }
```

```diff
    contract L1CrossDomainMessenger (0x226A1e4A3D8e64A9De8423F9344348c179C72CB2) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      address:
-        "0x226A1e4A3D8e64A9De8423F9344348c179C72CB2"
+        "eth:0x226A1e4A3D8e64A9De8423F9344348c179C72CB2"
      values.$admin:
-        "0x0bc380347A0B7aF5453492CAF20e1E38bc0Abc2f"
+        "eth:0x0bc380347A0B7aF5453492CAF20e1E38bc0Abc2f"
      values.$implementation:
-        "0xcfB7B0E4f49782CE44A2f590180ecE5Ea3FF43e5"
+        "eth:0xcfB7B0E4f49782CE44A2f590180ecE5Ea3FF43e5"
      values.$pastUpgrades.0.2.0:
-        "0xcfB7B0E4f49782CE44A2f590180ecE5Ea3FF43e5"
+        "eth:0xcfB7B0E4f49782CE44A2f590180ecE5Ea3FF43e5"
      values.OTHER_MESSENGER:
-        "0x4200000000000000000000000000000000000007"
+        "eth:0x4200000000000000000000000000000000000007"
      values.otherMessenger:
-        "0x4200000000000000000000000000000000000007"
+        "eth:0x4200000000000000000000000000000000000007"
      values.portal:
-        "0xDA29f0B4da6c23f6c1aF273945c290C0268c4ea9"
+        "eth:0xDA29f0B4da6c23f6c1aF273945c290C0268c4ea9"
      values.PORTAL:
-        "0xDA29f0B4da6c23f6c1aF273945c290C0268c4ea9"
+        "eth:0xDA29f0B4da6c23f6c1aF273945c290C0268c4ea9"
      values.ResolvedDelegateProxy_addressManager:
-        "0x464Ca56D40f94E8A50eFa7F5b90c59D956a0efC9"
+        "eth:0x464Ca56D40f94E8A50eFa7F5b90c59D956a0efC9"
      values.superchainConfig:
-        "0x14B768F93f256Ad8D2d018930DBdAe61306c4752"
+        "eth:0x14B768F93f256Ad8D2d018930DBdAe61306c4752"
      values.systemConfig:
-        "0x20c3035C92bdB4C461242571EeAc59EeD03Df931"
+        "eth:0x20c3035C92bdB4C461242571EeAc59EeD03Df931"
      implementationNames.0x226A1e4A3D8e64A9De8423F9344348c179C72CB2:
-        "ResolvedDelegateProxy"
      implementationNames.0xcfB7B0E4f49782CE44A2f590180ecE5Ea3FF43e5:
-        "L1CrossDomainMessenger"
      implementationNames.eth:0x226A1e4A3D8e64A9De8423F9344348c179C72CB2:
+        "ResolvedDelegateProxy"
      implementationNames.eth:0xcfB7B0E4f49782CE44A2f590180ecE5Ea3FF43e5:
+        "L1CrossDomainMessenger"
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
    EOA  (0x349f3839012DB2271e1BeC68F1668471D175Adb9) {
    +++ description: None
      address:
-        "0x349f3839012DB2271e1BeC68F1668471D175Adb9"
+        "eth:0x349f3839012DB2271e1BeC68F1668471D175Adb9"
    }
```

```diff
    EOA  (0x43Ca061Ea80FBB4A2b5515F4be4e953b191147aF) {
    +++ description: None
      address:
-        "0x43Ca061Ea80FBB4A2b5515F4be4e953b191147aF"
+        "eth:0x43Ca061Ea80FBB4A2b5515F4be4e953b191147aF"
    }
```

```diff
    contract OptimismMintableERC20Factory (0x45BEaf3Bd26b76796692b1Ef1E67469B84ADB914) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintableERC20 as this chain's representation of a token on the host chain, or vice-versa.
      address:
-        "0x45BEaf3Bd26b76796692b1Ef1E67469B84ADB914"
+        "eth:0x45BEaf3Bd26b76796692b1Ef1E67469B84ADB914"
      values.$admin:
-        "0x0bc380347A0B7aF5453492CAF20e1E38bc0Abc2f"
+        "eth:0x0bc380347A0B7aF5453492CAF20e1E38bc0Abc2f"
      values.$implementation:
-        "0x7f3710c09FcB168d11E4761c8e2683f3d207b202"
+        "eth:0x7f3710c09FcB168d11E4761c8e2683f3d207b202"
      values.$pastUpgrades.0.2.0:
-        "0x7f3710c09FcB168d11E4761c8e2683f3d207b202"
+        "eth:0x7f3710c09FcB168d11E4761c8e2683f3d207b202"
      values.bridge:
-        "0x908C324c35fF36F64236A7CDa4D50f3003E9C5C3"
+        "eth:0x908C324c35fF36F64236A7CDa4D50f3003E9C5C3"
      values.BRIDGE:
-        "0x908C324c35fF36F64236A7CDa4D50f3003E9C5C3"
+        "eth:0x908C324c35fF36F64236A7CDa4D50f3003E9C5C3"
      implementationNames.0x45BEaf3Bd26b76796692b1Ef1E67469B84ADB914:
-        "Proxy"
      implementationNames.0x7f3710c09FcB168d11E4761c8e2683f3d207b202:
-        "OptimismMintableERC20Factory"
      implementationNames.eth:0x45BEaf3Bd26b76796692b1Ef1E67469B84ADB914:
+        "Proxy"
      implementationNames.eth:0x7f3710c09FcB168d11E4761c8e2683f3d207b202:
+        "OptimismMintableERC20Factory"
    }
```

```diff
    contract AddressManager (0x464Ca56D40f94E8A50eFa7F5b90c59D956a0efC9) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      address:
-        "0x464Ca56D40f94E8A50eFa7F5b90c59D956a0efC9"
+        "eth:0x464Ca56D40f94E8A50eFa7F5b90c59D956a0efC9"
      values.owner:
-        "0x0bc380347A0B7aF5453492CAF20e1E38bc0Abc2f"
+        "eth:0x0bc380347A0B7aF5453492CAF20e1E38bc0Abc2f"
      implementationNames.0x464Ca56D40f94E8A50eFa7F5b90c59D956a0efC9:
-        "AddressManager"
      implementationNames.eth:0x464Ca56D40f94E8A50eFa7F5b90c59D956a0efC9:
+        "AddressManager"
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
    contract L1StandardBridge (0x908C324c35fF36F64236A7CDa4D50f3003E9C5C3) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      address:
-        "0x908C324c35fF36F64236A7CDa4D50f3003E9C5C3"
+        "eth:0x908C324c35fF36F64236A7CDa4D50f3003E9C5C3"
      values.$admin:
-        "0x0bc380347A0B7aF5453492CAF20e1E38bc0Abc2f"
+        "eth:0x0bc380347A0B7aF5453492CAF20e1E38bc0Abc2f"
      values.$implementation:
-        "0x4AEC9D641b46124f89dcf3a0C16f75053a8B836c"
+        "eth:0x4AEC9D641b46124f89dcf3a0C16f75053a8B836c"
      values.l2TokenBridge:
-        "0x4200000000000000000000000000000000000010"
+        "eth:0x4200000000000000000000000000000000000010"
      values.messenger:
-        "0x226A1e4A3D8e64A9De8423F9344348c179C72CB2"
+        "eth:0x226A1e4A3D8e64A9De8423F9344348c179C72CB2"
      values.MESSENGER:
-        "0x226A1e4A3D8e64A9De8423F9344348c179C72CB2"
+        "eth:0x226A1e4A3D8e64A9De8423F9344348c179C72CB2"
      values.OTHER_BRIDGE:
-        "0x4200000000000000000000000000000000000010"
+        "eth:0x4200000000000000000000000000000000000010"
      values.otherBridge:
-        "0x4200000000000000000000000000000000000010"
+        "eth:0x4200000000000000000000000000000000000010"
      values.superchainConfig:
-        "0x14B768F93f256Ad8D2d018930DBdAe61306c4752"
+        "eth:0x14B768F93f256Ad8D2d018930DBdAe61306c4752"
      values.systemConfig:
-        "0x20c3035C92bdB4C461242571EeAc59EeD03Df931"
+        "eth:0x20c3035C92bdB4C461242571EeAc59EeD03Df931"
      implementationNames.0x908C324c35fF36F64236A7CDa4D50f3003E9C5C3:
-        "L1ChugSplashProxy"
      implementationNames.0x4AEC9D641b46124f89dcf3a0C16f75053a8B836c:
-        "L1StandardBridge"
      implementationNames.eth:0x908C324c35fF36F64236A7CDa4D50f3003E9C5C3:
+        "L1ChugSplashProxy"
      implementationNames.eth:0x4AEC9D641b46124f89dcf3a0C16f75053a8B836c:
+        "L1StandardBridge"
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
    contract EthernityMultisig (0xB68361AAac2Bc8a4b8BFe36B8C6d0B429b5930ea) {
    +++ description: None
      address:
-        "0xB68361AAac2Bc8a4b8BFe36B8C6d0B429b5930ea"
+        "eth:0xB68361AAac2Bc8a4b8BFe36B8C6d0B429b5930ea"
      values.$implementation:
-        "0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
+        "eth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
      values.$members.0:
-        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
+        "eth:0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
      implementationNames.0xB68361AAac2Bc8a4b8BFe36B8C6d0B429b5930ea:
-        "GnosisSafeProxy"
      implementationNames.0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
-        "GnosisSafe"
      implementationNames.eth:0xB68361AAac2Bc8a4b8BFe36B8C6d0B429b5930ea:
+        "GnosisSafeProxy"
      implementationNames.eth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
+        "GnosisSafe"
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
    EOA  (0xD1705B4FFFc540EDeD73046ee1F3A8Db10d143f8) {
    +++ description: None
      address:
-        "0xD1705B4FFFc540EDeD73046ee1F3A8Db10d143f8"
+        "eth:0xD1705B4FFFc540EDeD73046ee1F3A8Db10d143f8"
    }
```

```diff
    contract OptimismPortal (0xDA29f0B4da6c23f6c1aF273945c290C0268c4ea9) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      address:
-        "0xDA29f0B4da6c23f6c1aF273945c290C0268c4ea9"
+        "eth:0xDA29f0B4da6c23f6c1aF273945c290C0268c4ea9"
      values.$admin:
-        "0x0bc380347A0B7aF5453492CAF20e1E38bc0Abc2f"
+        "eth:0x0bc380347A0B7aF5453492CAF20e1E38bc0Abc2f"
      values.$implementation:
-        "0x8956B5301DbB0e410b97006DdC07a8f360062D04"
+        "eth:0x8956B5301DbB0e410b97006DdC07a8f360062D04"
      values.$pastUpgrades.0.2.0:
-        "0x8956B5301DbB0e410b97006DdC07a8f360062D04"
+        "eth:0x8956B5301DbB0e410b97006DdC07a8f360062D04"
      values.guardian:
-        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
+        "eth:0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
      values.l2Oracle:
-        "0x0eB331B615030819464225Ecd373e5FFBE502DC4"
+        "eth:0x0eB331B615030819464225Ecd373e5FFBE502DC4"
      values.l2Sender:
-        "0x000000000000000000000000000000000000dEaD"
+        "eth:0x000000000000000000000000000000000000dEaD"
      values.superchainConfig:
-        "0x14B768F93f256Ad8D2d018930DBdAe61306c4752"
+        "eth:0x14B768F93f256Ad8D2d018930DBdAe61306c4752"
      values.systemConfig:
-        "0x20c3035C92bdB4C461242571EeAc59EeD03Df931"
+        "eth:0x20c3035C92bdB4C461242571EeAc59EeD03Df931"
      implementationNames.0xDA29f0B4da6c23f6c1aF273945c290C0268c4ea9:
-        "Proxy"
      implementationNames.0x8956B5301DbB0e410b97006DdC07a8f360062D04:
-        "OptimismPortal"
      implementationNames.eth:0xDA29f0B4da6c23f6c1aF273945c290C0268c4ea9:
+        "Proxy"
      implementationNames.eth:0x8956B5301DbB0e410b97006DdC07a8f360062D04:
+        "OptimismPortal"
    }
```

```diff
    EOA  (0xF49212F977986347b73345D382a811e148751eED) {
    +++ description: None
      address:
-        "0xF49212F977986347b73345D382a811e148751eED"
+        "eth:0xF49212F977986347b73345D382a811e148751eED"
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
    EOA  (0xfF00000000000000000000000000000000000183) {
    +++ description: None
      address:
-        "0xfF00000000000000000000000000000000000183"
+        "eth:0xfF00000000000000000000000000000000000183"
    }
```

```diff
+   Status: CREATED
    contract L1ERC721Bridge (0x00050ae93fBFaf5823A4ae229E4651F7F7A02FfA)
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x0bc380347A0B7aF5453492CAF20e1E38bc0Abc2f)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L2OutputOracle (0x0eB331B615030819464225Ecd373e5FFBE502DC4)
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
```

```diff
+   Status: CREATED
    contract SuperchainConfig (0x14B768F93f256Ad8D2d018930DBdAe61306c4752)
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
```

```diff
+   Status: CREATED
    contract SystemConfig (0x20c3035C92bdB4C461242571EeAc59EeD03Df931)
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
```

```diff
+   Status: CREATED
    contract L1CrossDomainMessenger (0x226A1e4A3D8e64A9De8423F9344348c179C72CB2)
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
```

```diff
+   Status: CREATED
    contract OptimismMintableERC20Factory (0x45BEaf3Bd26b76796692b1Ef1E67469B84ADB914)
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintableERC20 as this chain's representation of a token on the host chain, or vice-versa.
```

```diff
+   Status: CREATED
    contract AddressManager (0x464Ca56D40f94E8A50eFa7F5b90c59D956a0efC9)
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
```

```diff
+   Status: CREATED
    contract L1StandardBridge (0x908C324c35fF36F64236A7CDa4D50f3003E9C5C3)
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
```

```diff
+   Status: CREATED
    contract EthernityMultisig (0xB68361AAac2Bc8a4b8BFe36B8C6d0B429b5930ea)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Gelato Multisig (0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OptimismPortal (0xDA29f0B4da6c23f6c1aF273945c290C0268c4ea9)
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
```

Generated with discovered.json: 0x42c894f993c802d6c15ee55d73b951b52211fcac

# Diff at Mon, 14 Jul 2025 08:02:44 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@0dc82cd5064c9c6dc9fb20e2291a8bb6b2048e27 block: 21802884
- current block number: 21802884

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21802884 (main branch discovery), not current.

```diff
    contract OptimismMintableERC20Factory (0x45BEaf3Bd26b76796692b1Ef1E67469B84ADB914) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintableERC20 as this chain's representation of a token on the host chain, or vice-versa.
      description:
-        "A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa."
+        "A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintableERC20 as this chain's representation of a token on the host chain, or vice-versa."
    }
```

Generated with discovered.json: 0xfd0cc4f41579af19ceed01fb711f7ead330db005

# Diff at Fri, 04 Jul 2025 12:18:59 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f56dc47fe915564d4555300304da4d3bcbc087f block: 21802884
- current block number: 21802884

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21802884 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x0bc380347A0B7aF5453492CAF20e1E38bc0Abc2f) {
    +++ description: None
      directlyReceivedPermissions.0.from:
-        "ethereum:0x464Ca56D40f94E8A50eFa7F5b90c59D956a0efC9"
+        "eth:0x464Ca56D40f94E8A50eFa7F5b90c59D956a0efC9"
      directlyReceivedPermissions.1.from:
-        "ethereum:0x00050ae93fBFaf5823A4ae229E4651F7F7A02FfA"
+        "eth:0x00050ae93fBFaf5823A4ae229E4651F7F7A02FfA"
      directlyReceivedPermissions.2.from:
-        "ethereum:0x0eB331B615030819464225Ecd373e5FFBE502DC4"
+        "eth:0x0eB331B615030819464225Ecd373e5FFBE502DC4"
      directlyReceivedPermissions.3.from:
-        "ethereum:0x14B768F93f256Ad8D2d018930DBdAe61306c4752"
+        "eth:0x14B768F93f256Ad8D2d018930DBdAe61306c4752"
      directlyReceivedPermissions.4.from:
-        "ethereum:0x20c3035C92bdB4C461242571EeAc59EeD03Df931"
+        "eth:0x20c3035C92bdB4C461242571EeAc59EeD03Df931"
      directlyReceivedPermissions.5.from:
-        "ethereum:0x226A1e4A3D8e64A9De8423F9344348c179C72CB2"
+        "eth:0x226A1e4A3D8e64A9De8423F9344348c179C72CB2"
      directlyReceivedPermissions.6.from:
-        "ethereum:0x45BEaf3Bd26b76796692b1Ef1E67469B84ADB914"
+        "eth:0x45BEaf3Bd26b76796692b1Ef1E67469B84ADB914"
      directlyReceivedPermissions.7.from:
-        "ethereum:0x908C324c35fF36F64236A7CDa4D50f3003E9C5C3"
+        "eth:0x908C324c35fF36F64236A7CDa4D50f3003E9C5C3"
      directlyReceivedPermissions.8.from:
-        "ethereum:0xDA29f0B4da6c23f6c1aF273945c290C0268c4ea9"
+        "eth:0xDA29f0B4da6c23f6c1aF273945c290C0268c4ea9"
    }
```

```diff
    EOA  (0x43Ca061Ea80FBB4A2b5515F4be4e953b191147aF) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0x20c3035C92bdB4C461242571EeAc59EeD03Df931"
+        "eth:0x20c3035C92bdB4C461242571EeAc59EeD03Df931"
    }
```

```diff
    contract EthernityMultisig (0xB68361AAac2Bc8a4b8BFe36B8C6d0B429b5930ea) {
    +++ description: None
      directlyReceivedPermissions.0.from:
-        "ethereum:0x0bc380347A0B7aF5453492CAF20e1E38bc0Abc2f"
+        "eth:0x0bc380347A0B7aF5453492CAF20e1E38bc0Abc2f"
    }
```

```diff
    contract Gelato Multisig (0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0x0eB331B615030819464225Ecd373e5FFBE502DC4"
+        "eth:0x0eB331B615030819464225Ecd373e5FFBE502DC4"
      receivedPermissions.1.from:
-        "ethereum:0x0eB331B615030819464225Ecd373e5FFBE502DC4"
+        "eth:0x0eB331B615030819464225Ecd373e5FFBE502DC4"
      receivedPermissions.2.from:
-        "ethereum:0x14B768F93f256Ad8D2d018930DBdAe61306c4752"
+        "eth:0x14B768F93f256Ad8D2d018930DBdAe61306c4752"
      receivedPermissions.3.from:
-        "ethereum:0xDA29f0B4da6c23f6c1aF273945c290C0268c4ea9"
+        "eth:0xDA29f0B4da6c23f6c1aF273945c290C0268c4ea9"
      receivedPermissions.4.from:
-        "ethereum:0x20c3035C92bdB4C461242571EeAc59EeD03Df931"
+        "eth:0x20c3035C92bdB4C461242571EeAc59EeD03Df931"
      receivedPermissions.5.via.1.address:
-        "ethereum:0xB68361AAac2Bc8a4b8BFe36B8C6d0B429b5930ea"
+        "eth:0xB68361AAac2Bc8a4b8BFe36B8C6d0B429b5930ea"
      receivedPermissions.5.via.0.address:
-        "ethereum:0x0bc380347A0B7aF5453492CAF20e1E38bc0Abc2f"
+        "eth:0x0bc380347A0B7aF5453492CAF20e1E38bc0Abc2f"
      receivedPermissions.5.from:
-        "ethereum:0x464Ca56D40f94E8A50eFa7F5b90c59D956a0efC9"
+        "eth:0x464Ca56D40f94E8A50eFa7F5b90c59D956a0efC9"
      receivedPermissions.6.via.1.address:
-        "ethereum:0xB68361AAac2Bc8a4b8BFe36B8C6d0B429b5930ea"
+        "eth:0xB68361AAac2Bc8a4b8BFe36B8C6d0B429b5930ea"
      receivedPermissions.6.via.0.address:
-        "ethereum:0x0bc380347A0B7aF5453492CAF20e1E38bc0Abc2f"
+        "eth:0x0bc380347A0B7aF5453492CAF20e1E38bc0Abc2f"
      receivedPermissions.6.from:
-        "ethereum:0x00050ae93fBFaf5823A4ae229E4651F7F7A02FfA"
+        "eth:0x00050ae93fBFaf5823A4ae229E4651F7F7A02FfA"
      receivedPermissions.7.via.1.address:
-        "ethereum:0xB68361AAac2Bc8a4b8BFe36B8C6d0B429b5930ea"
+        "eth:0xB68361AAac2Bc8a4b8BFe36B8C6d0B429b5930ea"
      receivedPermissions.7.via.0.address:
-        "ethereum:0x0bc380347A0B7aF5453492CAF20e1E38bc0Abc2f"
+        "eth:0x0bc380347A0B7aF5453492CAF20e1E38bc0Abc2f"
      receivedPermissions.7.from:
-        "ethereum:0x0eB331B615030819464225Ecd373e5FFBE502DC4"
+        "eth:0x0eB331B615030819464225Ecd373e5FFBE502DC4"
      receivedPermissions.8.via.1.address:
-        "ethereum:0xB68361AAac2Bc8a4b8BFe36B8C6d0B429b5930ea"
+        "eth:0xB68361AAac2Bc8a4b8BFe36B8C6d0B429b5930ea"
      receivedPermissions.8.via.0.address:
-        "ethereum:0x0bc380347A0B7aF5453492CAF20e1E38bc0Abc2f"
+        "eth:0x0bc380347A0B7aF5453492CAF20e1E38bc0Abc2f"
      receivedPermissions.8.from:
-        "ethereum:0x14B768F93f256Ad8D2d018930DBdAe61306c4752"
+        "eth:0x14B768F93f256Ad8D2d018930DBdAe61306c4752"
      receivedPermissions.9.via.1.address:
-        "ethereum:0xB68361AAac2Bc8a4b8BFe36B8C6d0B429b5930ea"
+        "eth:0xB68361AAac2Bc8a4b8BFe36B8C6d0B429b5930ea"
      receivedPermissions.9.via.0.address:
-        "ethereum:0x0bc380347A0B7aF5453492CAF20e1E38bc0Abc2f"
+        "eth:0x0bc380347A0B7aF5453492CAF20e1E38bc0Abc2f"
      receivedPermissions.9.from:
-        "ethereum:0x20c3035C92bdB4C461242571EeAc59EeD03Df931"
+        "eth:0x20c3035C92bdB4C461242571EeAc59EeD03Df931"
      receivedPermissions.10.via.1.address:
-        "ethereum:0xB68361AAac2Bc8a4b8BFe36B8C6d0B429b5930ea"
+        "eth:0xB68361AAac2Bc8a4b8BFe36B8C6d0B429b5930ea"
      receivedPermissions.10.via.0.address:
-        "ethereum:0x0bc380347A0B7aF5453492CAF20e1E38bc0Abc2f"
+        "eth:0x0bc380347A0B7aF5453492CAF20e1E38bc0Abc2f"
      receivedPermissions.10.from:
-        "ethereum:0x226A1e4A3D8e64A9De8423F9344348c179C72CB2"
+        "eth:0x226A1e4A3D8e64A9De8423F9344348c179C72CB2"
      receivedPermissions.11.via.1.address:
-        "ethereum:0xB68361AAac2Bc8a4b8BFe36B8C6d0B429b5930ea"
+        "eth:0xB68361AAac2Bc8a4b8BFe36B8C6d0B429b5930ea"
      receivedPermissions.11.via.0.address:
-        "ethereum:0x0bc380347A0B7aF5453492CAF20e1E38bc0Abc2f"
+        "eth:0x0bc380347A0B7aF5453492CAF20e1E38bc0Abc2f"
      receivedPermissions.11.from:
-        "ethereum:0x45BEaf3Bd26b76796692b1Ef1E67469B84ADB914"
+        "eth:0x45BEaf3Bd26b76796692b1Ef1E67469B84ADB914"
      receivedPermissions.12.via.1.address:
-        "ethereum:0xB68361AAac2Bc8a4b8BFe36B8C6d0B429b5930ea"
+        "eth:0xB68361AAac2Bc8a4b8BFe36B8C6d0B429b5930ea"
      receivedPermissions.12.via.0.address:
-        "ethereum:0x0bc380347A0B7aF5453492CAF20e1E38bc0Abc2f"
+        "eth:0x0bc380347A0B7aF5453492CAF20e1E38bc0Abc2f"
      receivedPermissions.12.from:
-        "ethereum:0x908C324c35fF36F64236A7CDa4D50f3003E9C5C3"
+        "eth:0x908C324c35fF36F64236A7CDa4D50f3003E9C5C3"
      receivedPermissions.13.via.1.address:
-        "ethereum:0xB68361AAac2Bc8a4b8BFe36B8C6d0B429b5930ea"
+        "eth:0xB68361AAac2Bc8a4b8BFe36B8C6d0B429b5930ea"
      receivedPermissions.13.via.0.address:
-        "ethereum:0x0bc380347A0B7aF5453492CAF20e1E38bc0Abc2f"
+        "eth:0x0bc380347A0B7aF5453492CAF20e1E38bc0Abc2f"
      receivedPermissions.13.from:
-        "ethereum:0xDA29f0B4da6c23f6c1aF273945c290C0268c4ea9"
+        "eth:0xDA29f0B4da6c23f6c1aF273945c290C0268c4ea9"
    }
```

```diff
    EOA  (0xF49212F977986347b73345D382a811e148751eED) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0x0eB331B615030819464225Ecd373e5FFBE502DC4"
+        "eth:0x0eB331B615030819464225Ecd373e5FFBE502DC4"
      receivedPermissions.1.from:
-        "ethereum:0x0eB331B615030819464225Ecd373e5FFBE502DC4"
+        "eth:0x0eB331B615030819464225Ecd373e5FFBE502DC4"
    }
```

Generated with discovered.json: 0xe14fddf7efd6c8c975db74b7cd6588fd80b8e315

# Diff at Mon, 16 Jun 2025 08:41:54 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@e1208475abce20cea1768d2e4878c03350c1b7c9 block: 21802884
- current block number: 21802884

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21802884 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x0bc380347A0B7aF5453492CAF20e1E38bc0Abc2f) {
    +++ description: None
      directlyReceivedPermissions.8:
+        {"permission":"upgrade","from":"ethereum:0x00050ae93fBFaf5823A4ae229E4651F7F7A02FfA","role":"admin"}
      directlyReceivedPermissions.7.from:
-        "ethereum:0x00050ae93fBFaf5823A4ae229E4651F7F7A02FfA"
+        "ethereum:0x45BEaf3Bd26b76796692b1Ef1E67469B84ADB914"
      directlyReceivedPermissions.6.from:
-        "ethereum:0x45BEaf3Bd26b76796692b1Ef1E67469B84ADB914"
+        "ethereum:0x226A1e4A3D8e64A9De8423F9344348c179C72CB2"
    }
```

```diff
    contract L1CrossDomainMessenger (0x226A1e4A3D8e64A9De8423F9344348c179C72CB2) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      values.$admin:
+        "0x0bc380347A0B7aF5453492CAF20e1E38bc0Abc2f"
    }
```

```diff
    contract Gelato Multisig (0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb) {
    +++ description: None
      receivedPermissions.13:
+        {"permission":"upgrade","from":"ethereum:0x00050ae93fBFaf5823A4ae229E4651F7F7A02FfA","role":"admin","via":[{"address":"ethereum:0x0bc380347A0B7aF5453492CAF20e1E38bc0Abc2f"},{"address":"ethereum:0xB68361AAac2Bc8a4b8BFe36B8C6d0B429b5930ea"}]}
      receivedPermissions.12.from:
-        "ethereum:0x00050ae93fBFaf5823A4ae229E4651F7F7A02FfA"
+        "ethereum:0x45BEaf3Bd26b76796692b1Ef1E67469B84ADB914"
      receivedPermissions.11.from:
-        "ethereum:0x45BEaf3Bd26b76796692b1Ef1E67469B84ADB914"
+        "ethereum:0x226A1e4A3D8e64A9De8423F9344348c179C72CB2"
    }
```

Generated with discovered.json: 0x8b917c888abdf1b2cda39072d8571a64be18061b

# Diff at Fri, 30 May 2025 06:58:09 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@a4d8c436027d17df0f9b76843cd6deb1888fa381 block: 21802884
- current block number: 21802884

## Description

config: change comment about eip1559 fee val

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21802884 (main branch discovery), not current.

```diff
    contract SystemConfig (0x20c3035C92bdB4C461242571EeAc59EeD03Df931) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      fieldMeta.eip1559Denominator:
+        {"description":"volatility param: lower denominator -> quicker fee changes on L2"}
    }
```

Generated with discovered.json: 0x2cd630b5ff2b1d2be1ff93d93be7441b63e1ed92

# Diff at Fri, 23 May 2025 09:40:56 GMT:

- chain: ethereum
- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@69cd181abbc3c830a6caf2f4429b37cae72ffdb8 block: 21802884
- current block number: 21802884

## Description

Introduced .role field on each permission, defaulting to field name on which it was defined (with '.' prefix)

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21802884 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x0bc380347A0B7aF5453492CAF20e1E38bc0Abc2f) {
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
    EOA  (0x43Ca061Ea80FBB4A2b5515F4be4e953b191147aF) {
    +++ description: None
      receivedPermissions.0.role:
+        ".batcherHash"
    }
```

```diff
    contract EthernityMultisig (0xB68361AAac2Bc8a4b8BFe36B8C6d0B429b5930ea) {
    +++ description: None
      directlyReceivedPermissions.0.role:
+        ".owner"
    }
```

```diff
    contract Gelato Multisig (0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb) {
    +++ description: None
      receivedPermissions.12:
+        {"permission":"upgrade","from":"0x14B768F93f256Ad8D2d018930DBdAe61306c4752","role":"admin","via":[{"address":"0x0bc380347A0B7aF5453492CAF20e1E38bc0Abc2f"},{"address":"0xB68361AAac2Bc8a4b8BFe36B8C6d0B429b5930ea"}]}
      receivedPermissions.11.from:
-        "0x14B768F93f256Ad8D2d018930DBdAe61306c4752"
+        "0xDA29f0B4da6c23f6c1aF273945c290C0268c4ea9"
      receivedPermissions.11.role:
+        "admin"
      receivedPermissions.10.from:
-        "0xDA29f0B4da6c23f6c1aF273945c290C0268c4ea9"
+        "0x20c3035C92bdB4C461242571EeAc59EeD03Df931"
      receivedPermissions.10.role:
+        "admin"
      receivedPermissions.9.from:
-        "0x20c3035C92bdB4C461242571EeAc59EeD03Df931"
+        "0x45BEaf3Bd26b76796692b1Ef1E67469B84ADB914"
      receivedPermissions.9.role:
+        "admin"
      receivedPermissions.8.from:
-        "0x45BEaf3Bd26b76796692b1Ef1E67469B84ADB914"
+        "0x0eB331B615030819464225Ecd373e5FFBE502DC4"
      receivedPermissions.8.role:
+        "admin"
      receivedPermissions.7.from:
-        "0x0eB331B615030819464225Ecd373e5FFBE502DC4"
+        "0x00050ae93fBFaf5823A4ae229E4651F7F7A02FfA"
      receivedPermissions.7.role:
+        "admin"
      receivedPermissions.6.role:
+        ".guardian"
      receivedPermissions.5.permission:
-        "upgrade"
+        "guard"
      receivedPermissions.5.from:
-        "0x00050ae93fBFaf5823A4ae229E4651F7F7A02FfA"
+        "0xDA29f0B4da6c23f6c1aF273945c290C0268c4ea9"
      receivedPermissions.5.via:
-        [{"address":"0x0bc380347A0B7aF5453492CAF20e1E38bc0Abc2f"},{"address":"0xB68361AAac2Bc8a4b8BFe36B8C6d0B429b5930ea"}]
      receivedPermissions.5.role:
+        ".guardian"
      receivedPermissions.4.permission:
-        "guard"
+        "upgrade"
      receivedPermissions.4.from:
-        "0xDA29f0B4da6c23f6c1aF273945c290C0268c4ea9"
+        "0x908C324c35fF36F64236A7CDa4D50f3003E9C5C3"
      receivedPermissions.4.description:
+        "upgrading the bridge implementation can give access to all funds escrowed therein."
      receivedPermissions.4.role:
+        ".$admin"
      receivedPermissions.4.via:
+        [{"address":"0x0bc380347A0B7aF5453492CAF20e1E38bc0Abc2f"},{"address":"0xB68361AAac2Bc8a4b8BFe36B8C6d0B429b5930ea"}]
      receivedPermissions.3.permission:
-        "upgrade"
+        "challenge"
      receivedPermissions.3.from:
-        "0x908C324c35fF36F64236A7CDa4D50f3003E9C5C3"
+        "0x0eB331B615030819464225Ecd373e5FFBE502DC4"
      receivedPermissions.3.description:
-        "upgrading the bridge implementation can give access to all funds escrowed therein."
      receivedPermissions.3.via:
-        [{"address":"0x0bc380347A0B7aF5453492CAF20e1E38bc0Abc2f"},{"address":"0xB68361AAac2Bc8a4b8BFe36B8C6d0B429b5930ea"}]
      receivedPermissions.3.role:
+        ".CHALLENGER"
      receivedPermissions.2.role:
+        ".challenger"
      receivedPermissions.1.role:
+        ".owner"
      receivedPermissions.0.role:
+        ".owner"
    }
```

```diff
    EOA  (0xF49212F977986347b73345D382a811e148751eED) {
    +++ description: None
      receivedPermissions.1:
+        {"permission":"propose","from":"0x0eB331B615030819464225Ecd373e5FFBE502DC4","role":".proposer"}
      receivedPermissions.0.role:
+        ".PROPOSER"
    }
```

Generated with discovered.json: 0xc8f218cb740b3b4ba9df33f11cadf4f7dbbef1d9

# Diff at Tue, 29 Apr 2025 08:19:02 GMT:

- chain: ethereum
- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@ef7477af00fe0b57a2f7cacf7e958c12494af662 block: 21802884
- current block number: 21802884

## Description

Field .issuedPermissions is removed from the output as no longer needed. Added 'permissionsConfigHash' due to refactoring of the modelling process (into a separate command).

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21802884 (main branch discovery), not current.

```diff
    contract L1ERC721Bridge (0x00050ae93fBFaf5823A4ae229E4651F7F7A02FfA) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb","via":[{"address":"0xB68361AAac2Bc8a4b8BFe36B8C6d0B429b5930ea"},{"address":"0x0bc380347A0B7aF5453492CAF20e1E38bc0Abc2f"}]}]
    }
```

```diff
    contract L2OutputOracle (0x0eB331B615030819464225Ecd373e5FFBE502DC4) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      issuedPermissions:
-        [{"permission":"challenge","to":"0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb","via":[]},{"permission":"propose","to":"0xF49212F977986347b73345D382a811e148751eED","via":[]},{"permission":"upgrade","to":"0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb","via":[{"address":"0xB68361AAac2Bc8a4b8BFe36B8C6d0B429b5930ea"},{"address":"0x0bc380347A0B7aF5453492CAF20e1E38bc0Abc2f"}]}]
    }
```

```diff
    contract SuperchainConfig (0x14B768F93f256Ad8D2d018930DBdAe61306c4752) {
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      issuedPermissions:
-        [{"permission":"guard","to":"0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb","via":[]},{"permission":"upgrade","to":"0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb","via":[{"address":"0xB68361AAac2Bc8a4b8BFe36B8C6d0B429b5930ea"},{"address":"0x0bc380347A0B7aF5453492CAF20e1E38bc0Abc2f"}]}]
    }
```

```diff
    contract SystemConfig (0x20c3035C92bdB4C461242571EeAc59EeD03Df931) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      issuedPermissions:
-        [{"permission":"interact","to":"0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb","description":"it can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system.","via":[]},{"permission":"sequence","to":"0x43Ca061Ea80FBB4A2b5515F4be4e953b191147aF","via":[]},{"permission":"upgrade","to":"0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb","via":[{"address":"0xB68361AAac2Bc8a4b8BFe36B8C6d0B429b5930ea"},{"address":"0x0bc380347A0B7aF5453492CAF20e1E38bc0Abc2f"}]}]
    }
```

```diff
    contract OptimismMintableERC20Factory (0x45BEaf3Bd26b76796692b1Ef1E67469B84ADB914) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb","via":[{"address":"0xB68361AAac2Bc8a4b8BFe36B8C6d0B429b5930ea"},{"address":"0x0bc380347A0B7aF5453492CAF20e1E38bc0Abc2f"}]}]
    }
```

```diff
    contract AddressManager (0x464Ca56D40f94E8A50eFa7F5b90c59D956a0efC9) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      issuedPermissions:
-        [{"permission":"interact","to":"0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb","description":"set and change address mappings.","via":[{"address":"0xB68361AAac2Bc8a4b8BFe36B8C6d0B429b5930ea"},{"address":"0x0bc380347A0B7aF5453492CAF20e1E38bc0Abc2f"}]}]
    }
```

```diff
    contract L1StandardBridge (0x908C324c35fF36F64236A7CDa4D50f3003E9C5C3) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb","description":"upgrading the bridge implementation can give access to all funds escrowed therein.","via":[{"address":"0xB68361AAac2Bc8a4b8BFe36B8C6d0B429b5930ea"},{"address":"0x0bc380347A0B7aF5453492CAF20e1E38bc0Abc2f"}]}]
    }
```

```diff
    contract OptimismPortal (0xDA29f0B4da6c23f6c1aF273945c290C0268c4ea9) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      issuedPermissions:
-        [{"permission":"guard","to":"0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb","via":[]},{"permission":"upgrade","to":"0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb","via":[{"address":"0xB68361AAac2Bc8a4b8BFe36B8C6d0B429b5930ea"},{"address":"0x0bc380347A0B7aF5453492CAF20e1E38bc0Abc2f"}]}]
    }
```

Generated with discovered.json: 0x44f27fae2733646a53635f3c1f9ecf1e4760f2a7

# Diff at Thu, 27 Mar 2025 11:14:16 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@8cc2e36080df3a74dfd8475d41c64f46203f5218 block: 21802884
- current block number: 21802884

## Description

Config related: add guardian description details, hide some noisy values, hide AddressManager as spam cat, add proposer / challenger to permissioned opfp chains.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21802884 (main branch discovery), not current.

```diff
    contract AddressManager (0x464Ca56D40f94E8A50eFa7F5b90c59D956a0efC9) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      category:
+        {"name":"Spam","priority":-1}
    }
```

Generated with discovered.json: 0x179e7852ae37cb70cef736fd5780a08b1cc329db

# Diff at Wed, 19 Mar 2025 13:04:37 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@e950b6e93c84855ee2ec1740913b7b4c994b9ae2 block: 21802884
- current block number: 21802884

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21802884 (main branch discovery), not current.

```diff
    contract Gelato Multisig (0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb) {
    +++ description: None
      severity:
-        "HIGH"
    }
```

```diff
    contract undefined (0xF49212F977986347b73345D382a811e148751eED) {
    +++ description: None
      severity:
-        "HIGH"
    }
```

Generated with discovered.json: 0xaecc22c349f84e7a6d8afb1524ce729f8431248e

# Diff at Tue, 18 Mar 2025 08:12:41 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@4ef7a8dbcec1cd9fec77aae2b73d81347a4ffb13 block: 21802884
- current block number: 21802884

## Description

Config: change Multisig names.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21802884 (main branch discovery), not current.

```diff
    contract Gelato Multisig (0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb) {
    +++ description: None
      name:
-        "GelatoMultisig"
+        "Gelato Multisig"
    }
```

Generated with discovered.json: 0xc323fba942427fa17b12b103161c509fa151b62f

# Diff at Tue, 04 Mar 2025 11:25:39 GMT:

- chain: ethereum
- author: Michał Podsiadły (<michal.podsiadly@l2beat.com>)
- comparing to: main@be38e12d3ff947ca8de40f3a23a9ba1875a54f5a block: 21802884
- current block number: 21802884

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21802884 (main branch discovery), not current.

```diff
    contract SystemConfig (0x20c3035C92bdB4C461242571EeAc59EeD03Df931) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      values.opStackDA.isSomeTxsLengthEqualToCelestiaDAExample:
-        false
      values.opStackDA.isUsingCelestia:
+        false
    }
```

Generated with discovered.json: 0xb243b567494978534a0b770d1b23e135eb590012

# Diff at Tue, 04 Mar 2025 10:39:08 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@98d260b45fe0d2195ce5e629bd7b200c8706e8ba block: 21802884
- current block number: 21802884

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21802884 (main branch discovery), not current.

```diff
    contract L1ERC721Bridge (0x00050ae93fBFaf5823A4ae229E4651F7F7A02FfA) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      sinceBlock:
+        20519437
    }
```

```diff
    contract ProxyAdmin (0x0bc380347A0B7aF5453492CAF20e1E38bc0Abc2f) {
    +++ description: None
      sinceBlock:
+        20519437
    }
```

```diff
    contract L2OutputOracle (0x0eB331B615030819464225Ecd373e5FFBE502DC4) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      sinceBlock:
+        20519437
    }
```

```diff
    contract SuperchainConfig (0x14B768F93f256Ad8D2d018930DBdAe61306c4752) {
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      sinceBlock:
+        20519437
    }
```

```diff
    contract SystemConfig (0x20c3035C92bdB4C461242571EeAc59EeD03Df931) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      sinceBlock:
+        20519437
    }
```

```diff
    contract L1CrossDomainMessenger (0x226A1e4A3D8e64A9De8423F9344348c179C72CB2) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      sinceBlock:
+        20519437
    }
```

```diff
    contract OptimismMintableERC20Factory (0x45BEaf3Bd26b76796692b1Ef1E67469B84ADB914) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      sinceBlock:
+        20519437
    }
```

```diff
    contract AddressManager (0x464Ca56D40f94E8A50eFa7F5b90c59D956a0efC9) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      sinceBlock:
+        20519437
    }
```

```diff
    contract L1StandardBridge (0x908C324c35fF36F64236A7CDa4D50f3003E9C5C3) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      sinceBlock:
+        20519437
    }
```

```diff
    contract EthernityMultisig (0xB68361AAac2Bc8a4b8BFe36B8C6d0B429b5930ea) {
    +++ description: None
      sinceBlock:
+        20519437
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
    contract OptimismPortal (0xDA29f0B4da6c23f6c1aF273945c290C0268c4ea9) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      sinceBlock:
+        20519437
    }
```

Generated with discovered.json: 0xe39d5284b7dc64806c99272586868e3ef7802220

# Diff at Wed, 26 Feb 2025 10:32:34 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@18513668f913fbe57a197f43655b19111df0e627 block: 21802884
- current block number: 21802884

## Description

config related: added categories for all opstack, op stack and polygoncdk stack templates.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21802884 (main branch discovery), not current.

```diff
    contract L1ERC721Bridge (0x00050ae93fBFaf5823A4ae229E4651F7F7A02FfA) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      category:
+        {"name":"Canonical Bridges","priority":2}
    }
```

```diff
    contract L2OutputOracle (0x0eB331B615030819464225Ecd373e5FFBE502DC4) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract SuperchainConfig (0x14B768F93f256Ad8D2d018930DBdAe61306c4752) {
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      category:
+        {"name":"Governance","priority":3}
    }
```

```diff
    contract SystemConfig (0x20c3035C92bdB4C461242571EeAc59EeD03Df931) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract L1CrossDomainMessenger (0x226A1e4A3D8e64A9De8423F9344348c179C72CB2) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      category:
+        {"name":"Canonical Bridges","priority":2}
    }
```

```diff
    contract L1StandardBridge (0x908C324c35fF36F64236A7CDa4D50f3003E9C5C3) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      category:
+        {"name":"Canonical Bridges","priority":2}
    }
```

```diff
    contract OptimismPortal (0xDA29f0B4da6c23f6c1aF273945c290C0268c4ea9) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

Generated with discovered.json: 0x7cbafc5bfbb7b1f5460716fe4815ae361ff211aa

# Diff at Fri, 21 Feb 2025 14:06:35 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@d219f271711b2cf7a164e3443bead5e4957d13a8 block: 21802884
- current block number: 21802884

## Description

Config related: Change some severities and add templates.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21802884 (main branch discovery), not current.

```diff
    contract L2OutputOracle (0x0eB331B615030819464225Ecd373e5FFBE502DC4) {
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

Generated with discovered.json: 0x40557f3c27f8635b7058333392727d19df8b4999

# Diff at Fri, 21 Feb 2025 08:59:26 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1cf9ec35847912163c4b663a633e258a434c0bca block: 21802884
- current block number: 21802884

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21802884 (main branch discovery), not current.

```diff
    contract SuperchainConfig (0x14B768F93f256Ad8D2d018930DBdAe61306c4752) {
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      categories:
-        ["Upgrades&Governance"]
    }
```

```diff
    contract L1CrossDomainMessenger (0x226A1e4A3D8e64A9De8423F9344348c179C72CB2) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      categories:
-        ["Core"]
    }
```

```diff
    contract L1StandardBridge (0x908C324c35fF36F64236A7CDa4D50f3003E9C5C3) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      categories:
-        ["Gateways&Escrows"]
    }
```

Generated with discovered.json: 0x5a9b41eac22d1194a959c8bfc4a755a03216ae18

# Diff at Mon, 10 Feb 2025 19:03:55 GMT:

- chain: ethereum
- author: Michał Podsiadły (<michal.podsiadly@l2beat.com>)
- comparing to: main@3756adff7c1ac86d8af3374a90a75c1999aae2b3 block: 21802884
- current block number: 21802884

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21802884 (main branch discovery), not current.

```diff
    contract SystemConfig (0x20c3035C92bdB4C461242571EeAc59EeD03Df931) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      values.opStackDA.isUsingEigenDA:
+        false
    }
```

Generated with discovered.json: 0x00973ecc6c527059032bd501781758b5d5587296

# Diff at Sat, 08 Feb 2025 16:07:25 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@ef01ea79812e0d524af00be3fae1170cef6fd662 block: 21693095
- current block number: 21802884

## Description

EOA gov removed --> Gelato.

## Watched changes

```diff
    contract L1ERC721Bridge (0x00050ae93fBFaf5823A4ae229E4651F7F7A02FfA) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      issuedPermissions.1:
-        {"permission":"upgrade","to":"0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb","via":[{"address":"0xB68361AAac2Bc8a4b8BFe36B8C6d0B429b5930ea"},{"address":"0x0bc380347A0B7aF5453492CAF20e1E38bc0Abc2f"}]}
      issuedPermissions.0.to:
-        "0x633AC9c23250377cC1A36f374764ABd13051eF59"
+        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
    }
```

```diff
    contract L2OutputOracle (0x0eB331B615030819464225Ecd373e5FFBE502DC4) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      issuedPermissions.3:
-        {"permission":"upgrade","to":"0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb","via":[{"address":"0xB68361AAac2Bc8a4b8BFe36B8C6d0B429b5930ea"},{"address":"0x0bc380347A0B7aF5453492CAF20e1E38bc0Abc2f"}]}
      issuedPermissions.2.to:
-        "0x633AC9c23250377cC1A36f374764ABd13051eF59"
+        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
    }
```

```diff
    contract SuperchainConfig (0x14B768F93f256Ad8D2d018930DBdAe61306c4752) {
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      issuedPermissions.2:
-        {"permission":"upgrade","to":"0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb","via":[{"address":"0xB68361AAac2Bc8a4b8BFe36B8C6d0B429b5930ea"},{"address":"0x0bc380347A0B7aF5453492CAF20e1E38bc0Abc2f"}]}
      issuedPermissions.1.to:
-        "0x633AC9c23250377cC1A36f374764ABd13051eF59"
+        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
    }
```

```diff
    contract SystemConfig (0x20c3035C92bdB4C461242571EeAc59EeD03Df931) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      issuedPermissions.3:
-        {"permission":"upgrade","to":"0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb","via":[{"address":"0xB68361AAac2Bc8a4b8BFe36B8C6d0B429b5930ea"},{"address":"0x0bc380347A0B7aF5453492CAF20e1E38bc0Abc2f"}]}
      issuedPermissions.2.to:
-        "0x633AC9c23250377cC1A36f374764ABd13051eF59"
+        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
    }
```

```diff
    contract OptimismMintableERC20Factory (0x45BEaf3Bd26b76796692b1Ef1E67469B84ADB914) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      issuedPermissions.1:
-        {"permission":"upgrade","to":"0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb","via":[{"address":"0xB68361AAac2Bc8a4b8BFe36B8C6d0B429b5930ea"},{"address":"0x0bc380347A0B7aF5453492CAF20e1E38bc0Abc2f"}]}
      issuedPermissions.0.to:
-        "0x633AC9c23250377cC1A36f374764ABd13051eF59"
+        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
    }
```

```diff
    contract AddressManager (0x464Ca56D40f94E8A50eFa7F5b90c59D956a0efC9) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      issuedPermissions.1:
-        {"permission":"interact","to":"0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb","description":"set and change address mappings.","via":[{"address":"0xB68361AAac2Bc8a4b8BFe36B8C6d0B429b5930ea"},{"address":"0x0bc380347A0B7aF5453492CAF20e1E38bc0Abc2f"}]}
      issuedPermissions.0.to:
-        "0x633AC9c23250377cC1A36f374764ABd13051eF59"
+        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
    }
```

```diff
    contract L1StandardBridge (0x908C324c35fF36F64236A7CDa4D50f3003E9C5C3) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      issuedPermissions.1:
-        {"permission":"upgrade","to":"0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb","description":"upgrading the bridge implementation can give access to all funds escrowed therein.","via":[{"address":"0xB68361AAac2Bc8a4b8BFe36B8C6d0B429b5930ea"},{"address":"0x0bc380347A0B7aF5453492CAF20e1E38bc0Abc2f"}]}
      issuedPermissions.0.to:
-        "0x633AC9c23250377cC1A36f374764ABd13051eF59"
+        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
    }
```

```diff
    contract EthernityMultisig (0xB68361AAac2Bc8a4b8BFe36B8C6d0B429b5930ea) {
    +++ description: None
      values.$members.1:
-        "0x633AC9c23250377cC1A36f374764ABd13051eF59"
      values.multisigThreshold:
-        "1 of 2 (50%)"
+        "1 of 1 (100%)"
    }
```

```diff
    contract OptimismPortal (0xDA29f0B4da6c23f6c1aF273945c290C0268c4ea9) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      issuedPermissions.2:
-        {"permission":"upgrade","to":"0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb","via":[{"address":"0xB68361AAac2Bc8a4b8BFe36B8C6d0B429b5930ea"},{"address":"0x0bc380347A0B7aF5453492CAF20e1E38bc0Abc2f"}]}
      issuedPermissions.1.to:
-        "0x633AC9c23250377cC1A36f374764ABd13051eF59"
+        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
    }
```

Generated with discovered.json: 0x212125d3c7fcbb0eddc6945f4d91be21113ca25d

# Diff at Tue, 04 Feb 2025 12:31:24 GMT:

- chain: ethereum
- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@145553eed7ba44636411ecb25e4099728acd02f9 block: 21693095
- current block number: 21693095

## Description

Rename 'configure' permission to 'interact'

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21693095 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x0bc380347A0B7aF5453492CAF20e1E38bc0Abc2f) {
    +++ description: None
      directlyReceivedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract SystemConfig (0x20c3035C92bdB4C461242571EeAc59EeD03Df931) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      issuedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract AddressManager (0x464Ca56D40f94E8A50eFa7F5b90c59D956a0efC9) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      issuedPermissions.1.permission:
-        "configure"
+        "interact"
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
-        "0xDA29f0B4da6c23f6c1aF273945c290C0268c4ea9"
+        "0x464Ca56D40f94E8A50eFa7F5b90c59D956a0efC9"
      receivedPermissions.4.description:
+        "set and change address mappings."
      receivedPermissions.4.via:
+        [{"address":"0x0bc380347A0B7aF5453492CAF20e1E38bc0Abc2f"},{"address":"0xB68361AAac2Bc8a4b8BFe36B8C6d0B429b5930ea"}]
      receivedPermissions.3.permission:
-        "guard"
+        "interact"
      receivedPermissions.3.from:
-        "0x14B768F93f256Ad8D2d018930DBdAe61306c4752"
+        "0x20c3035C92bdB4C461242571EeAc59EeD03Df931"
      receivedPermissions.3.description:
+        "it can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system."
      receivedPermissions.2.permission:
-        "configure"
+        "guard"
      receivedPermissions.2.from:
-        "0x464Ca56D40f94E8A50eFa7F5b90c59D956a0efC9"
+        "0xDA29f0B4da6c23f6c1aF273945c290C0268c4ea9"
      receivedPermissions.2.description:
-        "set and change address mappings."
      receivedPermissions.2.via:
-        [{"address":"0x0bc380347A0B7aF5453492CAF20e1E38bc0Abc2f"},{"address":"0xB68361AAac2Bc8a4b8BFe36B8C6d0B429b5930ea"}]
      receivedPermissions.1.permission:
-        "configure"
+        "guard"
      receivedPermissions.1.from:
-        "0x20c3035C92bdB4C461242571EeAc59EeD03Df931"
+        "0x14B768F93f256Ad8D2d018930DBdAe61306c4752"
      receivedPermissions.1.description:
-        "it can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system."
    }
```

Generated with discovered.json: 0x9716cff7d69a202efc143b5e91d342cbce20a15b

# Diff at Fri, 24 Jan 2025 08:14:34 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@fff69b1db37918a5360f1e3b59d2f37be25d166f block: 21628387
- current block number: 21693095

## Description

EthernityMultisig member added (1/2).

## Watched changes

```diff
    contract L1ERC721Bridge (0x00050ae93fBFaf5823A4ae229E4651F7F7A02FfA) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      issuedPermissions.1:
+        {"permission":"upgrade","to":"0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb","via":[{"address":"0xB68361AAac2Bc8a4b8BFe36B8C6d0B429b5930ea"},{"address":"0x0bc380347A0B7aF5453492CAF20e1E38bc0Abc2f"}]}
    }
```

```diff
    contract L2OutputOracle (0x0eB331B615030819464225Ecd373e5FFBE502DC4) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      issuedPermissions.3:
+        {"permission":"upgrade","to":"0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb","via":[{"address":"0xB68361AAac2Bc8a4b8BFe36B8C6d0B429b5930ea"},{"address":"0x0bc380347A0B7aF5453492CAF20e1E38bc0Abc2f"}]}
    }
```

```diff
    contract SuperchainConfig (0x14B768F93f256Ad8D2d018930DBdAe61306c4752) {
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      issuedPermissions.2:
+        {"permission":"upgrade","to":"0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb","via":[{"address":"0xB68361AAac2Bc8a4b8BFe36B8C6d0B429b5930ea"},{"address":"0x0bc380347A0B7aF5453492CAF20e1E38bc0Abc2f"}]}
    }
```

```diff
    contract SystemConfig (0x20c3035C92bdB4C461242571EeAc59EeD03Df931) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      issuedPermissions.3:
+        {"permission":"upgrade","to":"0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb","via":[{"address":"0xB68361AAac2Bc8a4b8BFe36B8C6d0B429b5930ea"},{"address":"0x0bc380347A0B7aF5453492CAF20e1E38bc0Abc2f"}]}
    }
```

```diff
    contract OptimismMintableERC20Factory (0x45BEaf3Bd26b76796692b1Ef1E67469B84ADB914) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      issuedPermissions.1:
+        {"permission":"upgrade","to":"0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb","via":[{"address":"0xB68361AAac2Bc8a4b8BFe36B8C6d0B429b5930ea"},{"address":"0x0bc380347A0B7aF5453492CAF20e1E38bc0Abc2f"}]}
    }
```

```diff
    contract AddressManager (0x464Ca56D40f94E8A50eFa7F5b90c59D956a0efC9) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      issuedPermissions.1:
+        {"permission":"configure","to":"0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb","description":"set and change address mappings.","via":[{"address":"0xB68361AAac2Bc8a4b8BFe36B8C6d0B429b5930ea"},{"address":"0x0bc380347A0B7aF5453492CAF20e1E38bc0Abc2f"}]}
    }
```

```diff
    contract L1StandardBridge (0x908C324c35fF36F64236A7CDa4D50f3003E9C5C3) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      issuedPermissions.1:
+        {"permission":"upgrade","to":"0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb","description":"upgrading the bridge implementation can give access to all funds escrowed therein.","via":[{"address":"0xB68361AAac2Bc8a4b8BFe36B8C6d0B429b5930ea"},{"address":"0x0bc380347A0B7aF5453492CAF20e1E38bc0Abc2f"}]}
    }
```

```diff
    contract EthernityMultisig (0xB68361AAac2Bc8a4b8BFe36B8C6d0B429b5930ea) {
    +++ description: None
      values.$members.1:
+        "0x633AC9c23250377cC1A36f374764ABd13051eF59"
      values.$members.0:
-        "0x633AC9c23250377cC1A36f374764ABd13051eF59"
+        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
      values.multisigThreshold:
-        "1 of 1 (100%)"
+        "1 of 2 (50%)"
    }
```

```diff
    contract GelatoMultisig (0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb) {
    +++ description: None
      receivedPermissions.11:
+        {"permission":"upgrade","from":"0xDA29f0B4da6c23f6c1aF273945c290C0268c4ea9","via":[{"address":"0x0bc380347A0B7aF5453492CAF20e1E38bc0Abc2f"},{"address":"0xB68361AAac2Bc8a4b8BFe36B8C6d0B429b5930ea"}]}
      receivedPermissions.10:
+        {"permission":"upgrade","from":"0x908C324c35fF36F64236A7CDa4D50f3003E9C5C3","description":"upgrading the bridge implementation can give access to all funds escrowed therein.","via":[{"address":"0x0bc380347A0B7aF5453492CAF20e1E38bc0Abc2f"},{"address":"0xB68361AAac2Bc8a4b8BFe36B8C6d0B429b5930ea"}]}
      receivedPermissions.9:
+        {"permission":"upgrade","from":"0x45BEaf3Bd26b76796692b1Ef1E67469B84ADB914","via":[{"address":"0x0bc380347A0B7aF5453492CAF20e1E38bc0Abc2f"},{"address":"0xB68361AAac2Bc8a4b8BFe36B8C6d0B429b5930ea"}]}
      receivedPermissions.8:
+        {"permission":"upgrade","from":"0x20c3035C92bdB4C461242571EeAc59EeD03Df931","via":[{"address":"0x0bc380347A0B7aF5453492CAF20e1E38bc0Abc2f"},{"address":"0xB68361AAac2Bc8a4b8BFe36B8C6d0B429b5930ea"}]}
      receivedPermissions.7:
+        {"permission":"upgrade","from":"0x14B768F93f256Ad8D2d018930DBdAe61306c4752","via":[{"address":"0x0bc380347A0B7aF5453492CAF20e1E38bc0Abc2f"},{"address":"0xB68361AAac2Bc8a4b8BFe36B8C6d0B429b5930ea"}]}
      receivedPermissions.6:
+        {"permission":"upgrade","from":"0x0eB331B615030819464225Ecd373e5FFBE502DC4","via":[{"address":"0x0bc380347A0B7aF5453492CAF20e1E38bc0Abc2f"},{"address":"0xB68361AAac2Bc8a4b8BFe36B8C6d0B429b5930ea"}]}
      receivedPermissions.5:
+        {"permission":"upgrade","from":"0x00050ae93fBFaf5823A4ae229E4651F7F7A02FfA","via":[{"address":"0x0bc380347A0B7aF5453492CAF20e1E38bc0Abc2f"},{"address":"0xB68361AAac2Bc8a4b8BFe36B8C6d0B429b5930ea"}]}
      receivedPermissions.4:
+        {"permission":"guard","from":"0xDA29f0B4da6c23f6c1aF273945c290C0268c4ea9"}
      receivedPermissions.3.from:
-        "0xDA29f0B4da6c23f6c1aF273945c290C0268c4ea9"
+        "0x14B768F93f256Ad8D2d018930DBdAe61306c4752"
      receivedPermissions.2.permission:
-        "guard"
+        "configure"
      receivedPermissions.2.from:
-        "0x14B768F93f256Ad8D2d018930DBdAe61306c4752"
+        "0x464Ca56D40f94E8A50eFa7F5b90c59D956a0efC9"
      receivedPermissions.2.description:
+        "set and change address mappings."
      receivedPermissions.2.via:
+        [{"address":"0x0bc380347A0B7aF5453492CAF20e1E38bc0Abc2f"},{"address":"0xB68361AAac2Bc8a4b8BFe36B8C6d0B429b5930ea"}]
    }
```

```diff
    contract OptimismPortal (0xDA29f0B4da6c23f6c1aF273945c290C0268c4ea9) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      issuedPermissions.2:
+        {"permission":"upgrade","to":"0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb","via":[{"address":"0xB68361AAac2Bc8a4b8BFe36B8C6d0B429b5930ea"},{"address":"0x0bc380347A0B7aF5453492CAF20e1E38bc0Abc2f"}]}
    }
```

Generated with discovered.json: 0x2fd89e7f46bdb502e33cfecafa2d8d61b689e3d0

# Diff at Mon, 20 Jan 2025 11:09:29 GMT:

- chain: ethereum
- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@2c8b4f3d9910bb6371be9b4df87b70856e7d8c64 block: 21628387
- current block number: 21628387

## Description

Rerun on the same block number. Applies fixes to permissions and via field. Renames permission's target to to/from.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21628387 (main branch discovery), not current.

```diff
    contract L1ERC721Bridge (0x00050ae93fBFaf5823A4ae229E4651F7F7A02FfA) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      issuedPermissions.0.target:
-        "0x633AC9c23250377cC1A36f374764ABd13051eF59"
      issuedPermissions.0.via.1.delay:
-        0
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x633AC9c23250377cC1A36f374764ABd13051eF59"
    }
```

```diff
    contract ProxyAdmin (0x0bc380347A0B7aF5453492CAF20e1E38bc0Abc2f) {
    +++ description: None
      directlyReceivedPermissions.7.target:
-        "0xDA29f0B4da6c23f6c1aF273945c290C0268c4ea9"
      directlyReceivedPermissions.7.from:
+        "0xDA29f0B4da6c23f6c1aF273945c290C0268c4ea9"
      directlyReceivedPermissions.6.target:
-        "0x908C324c35fF36F64236A7CDa4D50f3003E9C5C3"
      directlyReceivedPermissions.6.from:
+        "0x908C324c35fF36F64236A7CDa4D50f3003E9C5C3"
      directlyReceivedPermissions.5.target:
-        "0x45BEaf3Bd26b76796692b1Ef1E67469B84ADB914"
      directlyReceivedPermissions.5.from:
+        "0x45BEaf3Bd26b76796692b1Ef1E67469B84ADB914"
      directlyReceivedPermissions.4.target:
-        "0x20c3035C92bdB4C461242571EeAc59EeD03Df931"
      directlyReceivedPermissions.4.from:
+        "0x20c3035C92bdB4C461242571EeAc59EeD03Df931"
      directlyReceivedPermissions.3.target:
-        "0x14B768F93f256Ad8D2d018930DBdAe61306c4752"
      directlyReceivedPermissions.3.from:
+        "0x14B768F93f256Ad8D2d018930DBdAe61306c4752"
      directlyReceivedPermissions.2.target:
-        "0x0eB331B615030819464225Ecd373e5FFBE502DC4"
      directlyReceivedPermissions.2.from:
+        "0x0eB331B615030819464225Ecd373e5FFBE502DC4"
      directlyReceivedPermissions.1.target:
-        "0x00050ae93fBFaf5823A4ae229E4651F7F7A02FfA"
      directlyReceivedPermissions.1.from:
+        "0x00050ae93fBFaf5823A4ae229E4651F7F7A02FfA"
      directlyReceivedPermissions.0.target:
-        "0x464Ca56D40f94E8A50eFa7F5b90c59D956a0efC9"
      directlyReceivedPermissions.0.from:
+        "0x464Ca56D40f94E8A50eFa7F5b90c59D956a0efC9"
    }
```

```diff
    contract L2OutputOracle (0x0eB331B615030819464225Ecd373e5FFBE502DC4) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      issuedPermissions.2.target:
-        "0x633AC9c23250377cC1A36f374764ABd13051eF59"
      issuedPermissions.2.via.1.delay:
-        0
      issuedPermissions.2.via.0.delay:
-        0
      issuedPermissions.2.to:
+        "0x633AC9c23250377cC1A36f374764ABd13051eF59"
      issuedPermissions.1.target:
-        "0xF49212F977986347b73345D382a811e148751eED"
      issuedPermissions.1.to:
+        "0xF49212F977986347b73345D382a811e148751eED"
      issuedPermissions.0.target:
-        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
      issuedPermissions.0.to:
+        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
    }
```

```diff
    contract SuperchainConfig (0x14B768F93f256Ad8D2d018930DBdAe61306c4752) {
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      issuedPermissions.1.target:
-        "0x633AC9c23250377cC1A36f374764ABd13051eF59"
      issuedPermissions.1.via.1.delay:
-        0
      issuedPermissions.1.via.0.delay:
-        0
      issuedPermissions.1.to:
+        "0x633AC9c23250377cC1A36f374764ABd13051eF59"
      issuedPermissions.0.target:
-        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
      issuedPermissions.0.to:
+        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
    }
```

```diff
    contract SystemConfig (0x20c3035C92bdB4C461242571EeAc59EeD03Df931) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      issuedPermissions.2.target:
-        "0x633AC9c23250377cC1A36f374764ABd13051eF59"
      issuedPermissions.2.via.1.delay:
-        0
      issuedPermissions.2.via.0.delay:
-        0
      issuedPermissions.2.to:
+        "0x633AC9c23250377cC1A36f374764ABd13051eF59"
      issuedPermissions.1.target:
-        "0x43Ca061Ea80FBB4A2b5515F4be4e953b191147aF"
      issuedPermissions.1.to:
+        "0x43Ca061Ea80FBB4A2b5515F4be4e953b191147aF"
      issuedPermissions.0.target:
-        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
      issuedPermissions.0.to:
+        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
      issuedPermissions.0.description:
+        "it can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system."
    }
```

```diff
    contract OptimismMintableERC20Factory (0x45BEaf3Bd26b76796692b1Ef1E67469B84ADB914) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      issuedPermissions.0.target:
-        "0x633AC9c23250377cC1A36f374764ABd13051eF59"
      issuedPermissions.0.via.1.delay:
-        0
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x633AC9c23250377cC1A36f374764ABd13051eF59"
    }
```

```diff
    contract AddressManager (0x464Ca56D40f94E8A50eFa7F5b90c59D956a0efC9) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      issuedPermissions.0.target:
-        "0x633AC9c23250377cC1A36f374764ABd13051eF59"
      issuedPermissions.0.via.1.delay:
-        0
      issuedPermissions.0.via.1.description:
-        "set and change address mappings."
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x633AC9c23250377cC1A36f374764ABd13051eF59"
      issuedPermissions.0.description:
+        "set and change address mappings."
    }
```

```diff
    contract L1StandardBridge (0x908C324c35fF36F64236A7CDa4D50f3003E9C5C3) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      issuedPermissions.0.target:
-        "0x633AC9c23250377cC1A36f374764ABd13051eF59"
      issuedPermissions.0.via.1.delay:
-        0
      issuedPermissions.0.via.1.description:
-        "upgrading the bridge implementation can give access to all funds escrowed therein."
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x633AC9c23250377cC1A36f374764ABd13051eF59"
      issuedPermissions.0.description:
+        "upgrading the bridge implementation can give access to all funds escrowed therein."
    }
```

```diff
    contract EthernityMultisig (0xB68361AAac2Bc8a4b8BFe36B8C6d0B429b5930ea) {
    +++ description: None
      directlyReceivedPermissions.0.target:
-        "0x0bc380347A0B7aF5453492CAF20e1E38bc0Abc2f"
      directlyReceivedPermissions.0.from:
+        "0x0bc380347A0B7aF5453492CAF20e1E38bc0Abc2f"
    }
```

```diff
    contract GelatoMultisig (0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb) {
    +++ description: None
      receivedPermissions.3.target:
-        "0xDA29f0B4da6c23f6c1aF273945c290C0268c4ea9"
      receivedPermissions.3.from:
+        "0xDA29f0B4da6c23f6c1aF273945c290C0268c4ea9"
      receivedPermissions.2.target:
-        "0x14B768F93f256Ad8D2d018930DBdAe61306c4752"
      receivedPermissions.2.from:
+        "0x14B768F93f256Ad8D2d018930DBdAe61306c4752"
      receivedPermissions.1.target:
-        "0x20c3035C92bdB4C461242571EeAc59EeD03Df931"
      receivedPermissions.1.from:
+        "0x20c3035C92bdB4C461242571EeAc59EeD03Df931"
      receivedPermissions.0.target:
-        "0x0eB331B615030819464225Ecd373e5FFBE502DC4"
      receivedPermissions.0.from:
+        "0x0eB331B615030819464225Ecd373e5FFBE502DC4"
    }
```

```diff
    contract OptimismPortal (0xDA29f0B4da6c23f6c1aF273945c290C0268c4ea9) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      issuedPermissions.1.target:
-        "0x633AC9c23250377cC1A36f374764ABd13051eF59"
      issuedPermissions.1.via.1.delay:
-        0
      issuedPermissions.1.via.0.delay:
-        0
      issuedPermissions.1.to:
+        "0x633AC9c23250377cC1A36f374764ABd13051eF59"
      issuedPermissions.0.target:
-        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
      issuedPermissions.0.to:
+        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
    }
```

Generated with discovered.json: 0xa2d562e15d4fc6b581c1004b63102dd863ddf064

# Diff at Wed, 15 Jan 2025 07:28:03 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@3ea176aee1470e5ec80e65adfc81a954f84584d8 block: 21129680
- current block number: 21628387

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

Generated with discovered.json: 0x8548d34d8a1fbb08c6c2da4fc0066684fd970276

# Diff at Wed, 08 Jan 2025 09:00:14 GMT:

- chain: ethereum
- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@deefa974378c2cd6b74f061e1f5a494bbbe1d63a block: 21129680
- current block number: 21129680

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21129680 (main branch discovery), not current.

```diff
    contract L1StandardBridge (0x908C324c35fF36F64236A7CDa4D50f3003E9C5C3) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      description:
-        "The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token."
+        "The main entry point to deposit ERC20 tokens from host chain to this chain."
    }
```

Generated with discovered.json: 0xd38b72b316b50c6a6ae5cf75b0a9a9a0bef1d787

# Diff at Wed, 06 Nov 2024 16:04:17 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- current block number: 21129680

## Description

Standard OP stack Rollup with L2OutputOracle and FaultDisputeGame deployed in parallel (only L2OutputOracle used).

Also eoa admin. :()

0.99 debank l2 code similarity.

## Initial discovery

```diff
+   Status: CREATED
    contract L1ERC721Bridge (0x00050ae93fBFaf5823A4ae229E4651F7F7A02FfA)
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x0bc380347A0B7aF5453492CAF20e1E38bc0Abc2f)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L2OutputOracle (0x0eB331B615030819464225Ecd373e5FFBE502DC4)
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
```

```diff
+   Status: CREATED
    contract SuperchainConfig (0x14B768F93f256Ad8D2d018930DBdAe61306c4752)
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
```

```diff
+   Status: CREATED
    contract SystemConfig (0x20c3035C92bdB4C461242571EeAc59EeD03Df931)
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
```

```diff
+   Status: CREATED
    contract L1CrossDomainMessenger (0x226A1e4A3D8e64A9De8423F9344348c179C72CB2)
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
```

```diff
+   Status: CREATED
    contract OptimismMintableERC20Factory (0x45BEaf3Bd26b76796692b1Ef1E67469B84ADB914)
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
```

```diff
+   Status: CREATED
    contract AddressManager (0x464Ca56D40f94E8A50eFa7F5b90c59D956a0efC9)
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
```

```diff
+   Status: CREATED
    contract L1StandardBridge (0x908C324c35fF36F64236A7CDa4D50f3003E9C5C3)
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token.
```

```diff
+   Status: CREATED
    contract EthernityMultisig (0xB68361AAac2Bc8a4b8BFe36B8C6d0B429b5930ea)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GelatoMultisig (0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OptimismPortal (0xDA29f0B4da6c23f6c1aF273945c290C0268c4ea9)
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
```

