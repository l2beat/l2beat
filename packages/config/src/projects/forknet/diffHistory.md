Generated with discovered.json: 0x8db21264faa75f158f30e4a2bb97a821378deec0

# Diff at Tue, 27 Jan 2026 12:29:40 GMT:

- author: vincfurc (<vincfurc@users.noreply.github.com>)
- comparing to: main@01c924f177b66fde012756076e94adb03520b757 block: 1768996338
- current timestamp: 1769516650

## Description

New member added to Conduit Multisig 1, increasing from 4 of 12 to 4 of 13 threshold.

## Watched changes

```diff
    contract Conduit Multisig 1 (eth:0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      values.$members.0:
+        "eth:0xA9FCCc53F1c9095DA867Bd648683F8bdCcc78d09"
      values.multisigThreshold:
-        "4 of 12 (33%)"
+        "4 of 13 (31%)"
    }
```

Generated with discovered.json: 0x1a3cef86ae755c234141734216bdbef5077591d7

# Diff at Wed, 21 Jan 2026 12:17:21 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@244fb212545a72797e49afed711b24371c1ca962 block: 1768816348
- current timestamp: 1768996338

## Description

Upgrade to known contracts. The depositTransaction() revert in OptimismPortal is now removed. It is very likely that the node software / derivation changed though, ignoring deposits from the OptimismPortal2. We do not have an execution logic root because there is no proof system (absolute prestate in the PermissionedDisputeGame is normal).

## Watched changes

```diff
-   Status: DELETED
    contract AnchorStateRegistry (eth:0x010DEBD63B170821ae1b4ba93Fe46005aaaB1692)
    +++ description: Contains the latest confirmed state root that can be used as a starting point in a dispute game.
```

```diff
    contract Conduit Multisig 1 (eth:0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      values.$members.0:
+        "eth:0x381624F7912BddD83dc67c6C53Ef6FE61B87Cf07"
      values.multisigThreshold:
-        "4 of 11 (36%)"
+        "4 of 12 (33%)"
      receivedPermissions.3:
-        {"permission":"interact","from":"eth:0xe0fCd317cbF59bA23205ab1662811E631AcbCE29","description":"can pull funds from the contract in case of emergency.","role":".owner"}
      receivedPermissions.4.from:
-        "eth:0x010DEBD63B170821ae1b4ba93Fe46005aaaB1692"
+        "eth:0x04B540f9e071a83555aB12d0CCcA812E272dcAf1"
      receivedPermissions.13.from:
-        "eth:0xe0fCd317cbF59bA23205ab1662811E631AcbCE29"
+        "eth:0xf9E57a0B702dF449295DEc146eC2bc80339FAAED"
    }
```

```diff
    contract OptimismMintableERC20Factory (eth:0x514795090ceA49c14f65b45c4403A36b3576AE03) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintableERC20 as this chain's representation of a token on the host chain, or vice-versa.
      sourceHashes.1:
-        "0x9650b4bba6299e410f01a369a95a2c57e1c3ca35f0d80c13f4f59fc468f370e5"
+        "0x25bad2bdb7df4347412a48e271dea1489299460192b43b8ca52ed191b4940992"
      values.$implementation:
-        "eth:0x5493f4677A186f64805fe7317D6993ba4863988F"
+        "eth:0x8ee6fB13c6c9a7e401531168E196Fbf8b05cEabB"
      values.$pastUpgrades.1:
+        ["2026-01-20T15:54:47.000Z","0xdafb601ff7f28a914b21897e0fe0db50cf79e1e4376b62b8e503240368155c12",["eth:0x8ee6fB13c6c9a7e401531168E196Fbf8b05cEabB"]]
      values.$upgradeCount:
-        1
+        2
      values.version:
-        "1.10.1"
+        "1.10.2"
      implementationNames.eth:0x5493f4677A186f64805fe7317D6993ba4863988F:
-        "OptimismMintableERC20Factory"
      implementationNames.eth:0x8ee6fB13c6c9a7e401531168E196Fbf8b05cEabB:
+        "OptimismMintableERC20Factory"
    }
```

```diff
    contract SystemConfig (eth:0x5D2952EAe032aa33e977c52f810e0089261efB27) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      sourceHashes.1:
-        "0x921de6fc906d159fdcef862d2b9559063f5e7b9b7588fa5f33153360ddf296e7"
+        "0x09e12b8c0307a4da75a8b84ed7c88ced81e386ec09025ec5b36873b4f69614d0"
      values.$implementation:
-        "eth:0x340f923E5c7cbB2171146f64169EC9d5a9FfE647"
+        "eth:0x2fA28989fc559836E9d66dFf3010C7F7f41c65ED"
      values.$pastUpgrades.1:
+        ["2026-01-20T15:54:47.000Z","0xdafb601ff7f28a914b21897e0fe0db50cf79e1e4376b62b8e503240368155c12",["eth:0x2bFE4A5Bd5A41e9d848d843ebCDFa15954e9A557"]]
      values.$pastUpgrades.2:
+        ["2026-01-20T15:54:47.000Z","0xdafb601ff7f28a914b21897e0fe0db50cf79e1e4376b62b8e503240368155c12",["eth:0x2fA28989fc559836E9d66dFf3010C7F7f41c65ED"]]
      values.$upgradeCount:
-        1
+        3
      values.DISPUTE_GAME_FACTORY_SLOT:
-        "0x52322a25d9f59ea17656545543306b7aef62bc0cc53a0e65ccfa0c75b97aa906"
      values.getAddresses.disputeGameFactory:
-        "eth:0xAa47071585ee92Fa9AE314C87d3d12a25c241EeD"
      values.maximumGasLimit:
-        200000000
+        500000000
      values.version:
-        "2.5.0"
+        "3.11.0"
      values.daFootprintGasScalar:
+        0
      values.guardian:
+        "eth:0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      values.initVersion:
+        3
      values.l2ChainId:
+        8338
      values.minBaseFee:
+        0
      values.paused:
+        false
      values.proxyAdmin:
+        "eth:0xEfBb0af25B3bE24347f17916fda058795f36a5A0"
      values.proxyAdminOwner:
+        "eth:0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      values.superchainConfig:
+        "eth:0x097f99768A0a4a0A81bAbbCB1ea18193bA9D53cC"
      implementationNames.eth:0x340f923E5c7cbB2171146f64169EC9d5a9FfE647:
-        "SystemConfig"
      implementationNames.eth:0x2fA28989fc559836E9d66dFf3010C7F7f41c65ED:
+        "SystemConfig"
    }
```

```diff
    contract L1StandardBridge (eth:0x6C82EEE75Bb8b957C12FaaF8CAb549BE4b0fD5af) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      sourceHashes.1:
-        "0x4e15d99844dc5a4304c2396a66c95ec41218ea311c8e524b118fad7beed0bb53"
+        "0x0114d3af66179d6404d14360203dc6bcf404f23e2db4ee1b5848e923e131bc00"
      values.$implementation:
-        "eth:0x0b09ba359A106C9ea3b181CBc5F394570c7d2a7A"
+        "eth:0x61525EaaCDdB97D9184aFc205827E6A4fd0Bf62A"
      values.version:
-        "2.3.0"
+        "2.8.0"
      values.initVersion:
+        3
      values.proxyAdmin:
+        "eth:0xEfBb0af25B3bE24347f17916fda058795f36a5A0"
      values.proxyAdminOwner:
+        "eth:0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      values.systemConfig:
+        "eth:0x5D2952EAe032aa33e977c52f810e0089261efB27"
      implementationNames.eth:0x0b09ba359A106C9ea3b181CBc5F394570c7d2a7A:
-        "L1StandardBridge"
      implementationNames.eth:0x61525EaaCDdB97D9184aFc205827E6A4fd0Bf62A:
+        "L1StandardBridge"
    }
```

```diff
    contract DisputeGameFactory (eth:0xAa47071585ee92Fa9AE314C87d3d12a25c241EeD) {
    +++ description: The dispute game factory allows the creation of dispute games, used to propose state roots and eventually challenge them.
      sourceHashes.1:
-        "0x85ca17941ef36ac6b28a4f8f89803d0d41ef419c47586dcd3acdb47ee9617285"
+        "0x19f3f7c7ee3977705261bfb86f826d5f97b885796f2246be7cc3e815c3e95dca"
      values.$implementation:
-        "eth:0x4bbA758F006Ef09402eF31724203F316ab74e4a0"
+        "eth:0x74Fac1D45B98bae058F8F566201c9A81B85C7D50"
      values.$pastUpgrades.1:
+        ["2026-01-20T15:54:47.000Z","0xdafb601ff7f28a914b21897e0fe0db50cf79e1e4376b62b8e503240368155c12",["eth:0x33D1e8571a85a538ed3D5A4d88f46C112383439D"]]
      values.$pastUpgrades.2:
+        ["2026-01-20T15:54:47.000Z","0xdafb601ff7f28a914b21897e0fe0db50cf79e1e4376b62b8e503240368155c12",["eth:0x74Fac1D45B98bae058F8F566201c9A81B85C7D50"]]
      values.$upgradeCount:
-        1
+        3
+++ severity: HIGH
      values.gameImpls.1:
-        "eth:0xd102e395aA8b4710db44B33F14Ae0038F318C2AC"
+        "eth:0x88d414cA1d500E5CDf131022e4A27D281e8Dba44"
      values.version:
-        "1.0.1"
+        "1.3.0"
      values.initVersion:
+        1
      values.proxyAdmin:
+        "eth:0xEfBb0af25B3bE24347f17916fda058795f36a5A0"
      values.proxyAdminOwner:
+        "eth:0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      implementationNames.eth:0x4bbA758F006Ef09402eF31724203F316ab74e4a0:
-        "DisputeGameFactory"
      implementationNames.eth:0x74Fac1D45B98bae058F8F566201c9A81B85C7D50:
+        "DisputeGameFactory"
    }
```

```diff
    contract L1CrossDomainMessenger (eth:0xB847cf7F5CE23cBaF76E751C066bfE732951501f) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      sourceHashes.1:
-        "0x03bcdc719cb7bd0a1377c01bb50b30a6122b308f673b7d7b15a3bb8628e6bd8c"
+        "0xfa9c986019a03bd66efb7584a7064e708f6fb71956643a9d4daa2c0972a29c03"
      values.$implementation:
-        "eth:0x5D5a095665886119693F0B41d8DFeE78da033e8B"
+        "eth:0xb686F13AfF1e427a1f993F29ab0F2E7383729FE0"
      values.$pastUpgrades.1:
+        ["2026-01-20T15:54:47.000Z","0xdafb601ff7f28a914b21897e0fe0db50cf79e1e4376b62b8e503240368155c12",["eth:0x22D12E0FAebD62d429514A65EBAe32dd316c12D6"]]
      values.$pastUpgrades.2:
+        ["2026-01-20T15:54:47.000Z","0xdafb601ff7f28a914b21897e0fe0db50cf79e1e4376b62b8e503240368155c12",["eth:0xb686F13AfF1e427a1f993F29ab0F2E7383729FE0"]]
      values.$upgradeCount:
-        1
+        3
      values.version:
-        "2.6.0"
+        "2.11.0"
      values.initVersion:
+        3
      values.proxyAdmin:
+        "eth:0xEfBb0af25B3bE24347f17916fda058795f36a5A0"
      values.proxyAdminOwner:
+        "eth:0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      values.systemConfig:
+        "eth:0x5D2952EAe032aa33e977c52f810e0089261efB27"
      implementationNames.eth:0x5D5a095665886119693F0B41d8DFeE78da033e8B:
-        "L1CrossDomainMessenger"
      implementationNames.eth:0xb686F13AfF1e427a1f993F29ab0F2E7383729FE0:
+        "L1CrossDomainMessenger"
    }
```

```diff
-   Status: DELETED
    contract PermissionedDisputeGame (eth:0xd102e395aA8b4710db44B33F14Ae0038F318C2AC)
    +++ description: Same as FaultDisputeGame, but only two permissioned addresses are designated as proposer and challenger. In the context of this permissioned aggkit deployment, there are no state proposals made here and the op stack fault proof system is not used.
```

```diff
    contract L1ERC721Bridge (eth:0xd1cFFdEF1dc379372CB06f3dEdC6debeF6059E82) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      sourceHashes.1:
-        "0x28669b49da3effd51f0f9424ca9cdd455c5b9327c09a40c65fc06f114a6eb837"
+        "0x75cd470a9d1c1afc343b599b1c14731f55bb36fe8a4e844ddb88a0b791918795"
      values.$implementation:
-        "eth:0x7aE1d3BD877a4C5CA257404ce26BE93A02C98013"
+        "eth:0x74f1aC50EB0BE98853805D381C884f5f9abDEcf9"
      values.$pastUpgrades.1:
+        ["2026-01-20T15:54:47.000Z","0xdafb601ff7f28a914b21897e0fe0db50cf79e1e4376b62b8e503240368155c12",["eth:0x7f1d12fB2911EB095278085f721e644C1f675696"]]
      values.$pastUpgrades.2:
+        ["2026-01-20T15:54:47.000Z","0xdafb601ff7f28a914b21897e0fe0db50cf79e1e4376b62b8e503240368155c12",["eth:0x74f1aC50EB0BE98853805D381C884f5f9abDEcf9"]]
      values.$upgradeCount:
-        1
+        3
      values.version:
-        "2.4.0"
+        "2.9.0"
      values.initVersion:
+        3
      values.proxyAdmin:
+        "eth:0xEfBb0af25B3bE24347f17916fda058795f36a5A0"
      values.proxyAdminOwner:
+        "eth:0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      values.systemConfig:
+        "eth:0x5D2952EAe032aa33e977c52f810e0089261efB27"
      implementationNames.eth:0x7aE1d3BD877a4C5CA257404ce26BE93A02C98013:
-        "L1ERC721Bridge"
      implementationNames.eth:0x74f1aC50EB0BE98853805D381C884f5f9abDEcf9:
+        "L1ERC721Bridge"
    }
```

```diff
    contract OptimismPortal2 (eth:0xD7cF5ce4688663e057E99D9f880599Ce88757695) {
    +++ description: The OptimismPortal contract usually is the main entry point to deposit funds from L1 to L2 or for finalizing withdrawals. It specifies which game type can be used for withdrawals, which currently is the PermissionedDisputeGame. This specific contract is deployed in the agglayer system context which **disables the depositTransaction() function**, preventing users from sending or forcing any transactions from L1 to L2, including token deposits. It is instead used for configuration and administration of the system.
      name:
-        "OptimismPortal2_neutered"
+        "OptimismPortal2"
      template:
-        "opstack/OptimismPortal2_noForce"
+        "opstack/OptimismPortal2"
      sourceHashes.1:
-        "0x9cf3cb8a68c82a3a8328495d5f019daa51e9098a69b69ee8e349e3058b789338"
+        "0xec3fef2865ee3bd465fea37851bfc490f143eba36d1e45d220832d39770aa8f2"
      values.$implementation:
-        "eth:0x51c852eC17062FB229A117Cb8abCBc7Eb171D5Bc"
+        "eth:0x7Cf803296662e8C72A6C1d6450572209aCF7f202"
      values.$pastUpgrades.2:
+        ["2026-01-20T15:54:47.000Z","0xdafb601ff7f28a914b21897e0fe0db50cf79e1e4376b62b8e503240368155c12",["eth:0x381E729FF983FA4BCEd820e7b922d79bF653B999"]]
      values.$pastUpgrades.3:
+        ["2026-01-20T15:54:47.000Z","0xdafb601ff7f28a914b21897e0fe0db50cf79e1e4376b62b8e503240368155c12",["eth:0x7Cf803296662e8C72A6C1d6450572209aCF7f202"]]
      values.$upgradeCount:
-        2
+        4
      values.respectedGameTypeUpdatedAt:
-        1756893611
+        1768924487
      values.version:
-        "3.14.0"
+        "5.1.1"
      values.anchorStateRegistry:
+        "eth:0xf9E57a0B702dF449295DEc146eC2bc80339FAAED"
      values.ethLockbox:
+        "eth:0x0000000000000000000000000000000000000000"
      values.initVersion:
+        3
      values.proxyAdmin:
+        "eth:0xEfBb0af25B3bE24347f17916fda058795f36a5A0"
      values.proxyAdminOwner:
+        "eth:0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      fieldMeta.respectedGameType:
+        {"severity":"HIGH"}
      implementationNames.eth:0x51c852eC17062FB229A117Cb8abCBc7Eb171D5Bc:
-        "OptimismPortal2"
      implementationNames.eth:0x7Cf803296662e8C72A6C1d6450572209aCF7f202:
+        "OptimismPortal2"
      usedTypes.0.arg.1337:
+        "KailuaGame"
    }
```

```diff
-   Status: DELETED
    contract DelayedWETH (eth:0xe0fCd317cbF59bA23205ab1662811E631AcbCE29)
    +++ description: Contract designed to hold the bonded ETH for each game. It is designed as a wrapper around WETH to allow an owner to function as a backstop if a game would incorrectly distribute funds.
```

```diff
    contract ProxyAdmin (eth:0xEfBb0af25B3bE24347f17916fda058795f36a5A0) {
    +++ description: None
      directlyReceivedPermissions.1.from:
-        "eth:0x010DEBD63B170821ae1b4ba93Fe46005aaaB1692"
+        "eth:0x04B540f9e071a83555aB12d0CCcA812E272dcAf1"
      directlyReceivedPermissions.9.from:
-        "eth:0xe0fCd317cbF59bA23205ab1662811E631AcbCE29"
+        "eth:0xf9E57a0B702dF449295DEc146eC2bc80339FAAED"
    }
```

```diff
-   Status: DELETED
    contract MIPS (eth:0xF027F4A985560fb13324e943edf55ad6F1d15Dc1)
    +++ description: The MIPS contract is used to execute the final step of the dispute game which objectively determines the winner of the dispute.
```

```diff
+   Status: CREATED
    contract DelayedWETH (eth:0x04B540f9e071a83555aB12d0CCcA812E272dcAf1)
    +++ description: Contract designed to hold the bonded ETH for each game. It is designed as a wrapper around WETH to allow an owner to function as a backstop if a game would incorrectly distribute funds.
```

```diff
+   Status: CREATED
    contract MIPS (eth:0x6463dEE3828677F6270d83d45408044fc5eDB908)
    +++ description: The MIPS contract is used to execute the final step of the dispute game which objectively determines the winner of the dispute.
```

```diff
+   Status: CREATED
    contract PermissionedDisputeGame (eth:0x88d414cA1d500E5CDf131022e4A27D281e8Dba44)
    +++ description: Same as FaultDisputeGame, but only two permissioned addresses are designated as proposer and challenger.
```

```diff
+   Status: CREATED
    contract AnchorStateRegistry (eth:0xf9E57a0B702dF449295DEc146eC2bc80339FAAED)
    +++ description: Contains the latest confirmed state root that can be used as a starting point in a dispute game. It specifies which game type can be used for withdrawals, which currently is the PermissionedDisputeGame.
```

## Source code changes

```diff
.../AnchorStateRegistry/AnchorStateRegistry.sol    | 418 ++++++++-
 .../DelayedWETH/DelayedWETH.sol                    | 406 ++++++---
 .../DisputeGameFactory/DisputeGameFactory.sol      | 297 ++++++-
 .../L1CrossDomainMessenger.sol                     | 377 +++++++-
 .../L1ERC721Bridge/L1ERC721Bridge.sol              | 313 ++++++-
 .../L1StandardBridge/L1StandardBridge.sol          | 313 ++++++-
 .../forknet/{.flat@1768816348 => .flat}/MIPS.sol   | 622 +++++++------
 .../OptimismMintableERC20Factory.sol               |   4 +-
 .../OptimismPortal2}/OptimismPortal2.sol           | 967 +++++++++++++--------
 .../OptimismPortal2}/Proxy.p.sol                   |   0
 .../PermissionedDisputeGame.sol                    | 142 ++-
 .../SystemConfig/SystemConfig.sol                  | 495 ++++++++---
 12 files changed, 3346 insertions(+), 1008 deletions(-)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1768816348 (main branch discovery), not current.

```diff
    contract OptimismPortal2_neutered (eth:0xD7cF5ce4688663e057E99D9f880599Ce88757695) {
    +++ description: The OptimismPortal contract usually is the main entry point to deposit funds from L1 to L2 or for finalizing withdrawals. It specifies which game type can be used for withdrawals, which currently is the PermissionedDisputeGame. This specific contract is deployed in the agglayer system context which **disables the depositTransaction() function**, preventing users from sending or forcing any transactions from L1 to L2, including token deposits. It is instead used for configuration and administration of the system.
      description:
-        "The OptimismPortal contract usually is the main entry point to deposit funds from L1 to L2 or for finalizing withdrawals. It specifies which game type can be used for withdrawals, which currently is the PermissionedDisputeGame. This specific fork of the standard contract **disables the depositTransaction() function**, which prevents users from sending or forcing any transactions from L1 to L2, including token deposits. It is instead used for configuration and administration of the system."
+        "The OptimismPortal contract usually is the main entry point to deposit funds from L1 to L2 or for finalizing withdrawals. It specifies which game type can be used for withdrawals, which currently is the PermissionedDisputeGame. This specific contract is deployed in the agglayer system context which **disables the depositTransaction() function**, preventing users from sending or forcing any transactions from L1 to L2, including token deposits. It is instead used for configuration and administration of the system."
    }
```

Generated with discovered.json: 0x6680748b69bbba76a039e6e9ff1353e8e42f0621

# Diff at Mon, 19 Jan 2026 09:53:35 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@fedbf0b580d39c802d10691add7e94f6a4b53464 block: 1768370289
- current timestamp: 1768816348

## Description

ms member added.

## Watched changes

```diff
    contract Conduit Multisig 1 (eth:0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      values.$members.0:
+        "eth:0x6BB4249858Ee19b6ABC071AD26bEe690baa783A6"
      values.multisigThreshold:
-        "4 of 10 (40%)"
+        "4 of 11 (36%)"
    }
```

Generated with discovered.json: 0x36fae4976f4a4fccb1418c7490e7ae0c52dc9f84

# Diff at Wed, 14 Jan 2026 05:59:19 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@109a5d8ec861590e65983ea0257074c65c29ed21 block: 1764933637
- current timestamp: 1768370289

## Description

SuperchainConfig upgrade (new known version, still fake).

## Watched changes

```diff
    contract SuperchainConfig (eth:0x097f99768A0a4a0A81bAbbCB1ea18193bA9D53cC) {
    +++ description: Since this contract is deployed in the context of a neutered op stack system, the guardian role has no significance.
      template:
-        "opstack/SuperchainConfigFake"
+        "opstack/SuperchainConfigFake_expiry"
      sourceHashes.1:
-        "0x03dba37173051b02bc81487e181c791bcf1aef664c249e5d035f11f488bdd686"
+        "0x53a6b3db7f270298025bbfef7f6c77b420a9808341212fa9cf54a5e157a18567"
      values.$implementation:
-        "eth:0x4da82a327773965b8d4D85Fa3dB8249b387458E7"
+        "eth:0xb08Cc720F511062537ca78BdB0AE691F04F5a957"
      values.$pastUpgrades.1:
+        ["2026-01-12T08:51:11.000Z","0x00b0d87bdd24f6273dabd8cb118814977b0e80773f88cb5baabb50463252d744",["eth:0xCe28685EB204186b557133766eCA00334EB441E4"]]
      values.$pastUpgrades.2:
+        ["2026-01-12T08:51:11.000Z","0x00b0d87bdd24f6273dabd8cb118814977b0e80773f88cb5baabb50463252d744",["eth:0xb08Cc720F511062537ca78BdB0AE691F04F5a957"]]
      values.$upgradeCount:
-        1
+        3
      values.GUARDIAN_SLOT:
-        "0xd30e835d3f35624761057ff5b27d558f97bd5be034621e62240e5c0b784abe68"
      values.PAUSED_SLOT:
-        "0x54176ff9944c4784e5857ec4e5ef560a462c483bf534eda43f91bb01a470b1b6"
      values.version:
-        "1.2.0"
+        "2.4.0"
      values.initVersion:
+        2
      values.pauseExpiry:
+        7884000
      values.pauseExpiryFmt:
+        "3mo 1d"
      values.proxyAdmin:
+        "eth:0xb4899FF43Ae727B1E9CB19AC44660e4A43Fad0b5"
      values.proxyAdminOwner:
+        "eth:0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      implementationNames.eth:0x4da82a327773965b8d4D85Fa3dB8249b387458E7:
-        "SuperchainConfig"
      implementationNames.eth:0xb08Cc720F511062537ca78BdB0AE691F04F5a957:
+        "SuperchainConfig"
      fieldMeta:
+        {"paused":{"severity":"HIGH"}}
    }
```

## Source code changes

```diff
.../SuperchainConfig/SuperchainConfig.sol          | 465 +++++++++++++++------
 1 file changed, 346 insertions(+), 119 deletions(-)
```

Generated with discovered.json: 0x51ae10a285c2f9e0b1788b4d3d04b56710ba5095

# Diff at Wed, 17 Dec 2025 10:37:11 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@8e3e624ee8b25c3a6106ebb6a5295b78f99241f8 block: 1764933637
- current timestamp: 1764933637

## Description

config: rename noforce portal.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1764933637 (main branch discovery), not current.

```diff
    contract OptimismPortal2_neutered (eth:0xD7cF5ce4688663e057E99D9f880599Ce88757695) {
    +++ description: The OptimismPortal contract usually is the main entry point to deposit funds from L1 to L2 or for finalizing withdrawals. It specifies which game type can be used for withdrawals, which currently is the PermissionedDisputeGame. This specific fork of the standard contract **disables the depositTransaction() function**, which prevents users from sending or forcing any transactions from L1 to L2, including token deposits. It is instead used for configuration and administration of the system.
      name:
-        "OptimismPortal2"
+        "OptimismPortal2_neutered"
    }
```

Generated with discovered.json: 0x76c69a4ede68e536d0f872f95f9c60382ac7958e

# Diff at Fri, 12 Dec 2025 16:19:52 GMT:

- author: vincfurc (<vincfurc@users.noreply.github.com>)
- comparing to: main@d2235ef7f5c90cb4a3a617fea7d52a655dc22fa1 block: 1764933637
- current timestamp: 1764933637

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1764933637 (main branch discovery), not current.

```diff
    contract DisputeGameFactory (eth:0xAa47071585ee92Fa9AE314C87d3d12a25c241EeD) {
    +++ description: The dispute game factory allows the creation of dispute games, used to propose state roots and eventually challenge them.
+++ severity: HIGH
      values.game2000:
+        "eth:0x0000000000000000000000000000000000000000"
+++ severity: HIGH
      values.game42:
+        "eth:0x0000000000000000000000000000000000000000"
      values.initBondGame42:
+        0
      fieldMeta.game2000:
+        {"severity":"HIGH"}
      fieldMeta.game42:
+        {"severity":"HIGH"}
    }
```

Generated with discovered.json: 0xe1f05c44c918e340eac09f325cc796de754221be

# Diff at Tue, 09 Dec 2025 11:33:06 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@ed25b2aa28d6ab9faa5f06bc943948919be9627d block: 1764933637
- current timestamp: 1764933637

## Description

config: add aggchain_type description and severity.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1764933637 (main branch discovery), not current.

```diff
    contract AggchainECDSAMultisig (eth:0x2f3d687e02dbe83B6cDaE02aeb66C0e8E69CcA4b) {
    +++ description: System contract defining the forknet Aggchain logic. It only enforces bridge accounting (pessimistic) proofs to protect the shared bridge while the Aggchain state transitions are not proven. They must instead be signed by 1 aggchainSigner(s).
      fieldMeta.AGGCHAIN_TYPE:
+        {"severity":"HIGH","description":"0: ECDSA sig verification, 1: limited to vkeys in AggchainGateway with 1 as second byte"}
    }
```

Generated with discovered.json: 0x30078bc6eff8a2381ca5075e939f6d3822eb0d08

# Diff at Fri, 05 Dec 2025 11:21:56 GMT:

- author: vincfurc (<vincfurc@users.noreply.github.com>)
- comparing to: main@1edf3e71cea32596658a3ea017cea9df6408b77c block: 1762246195
- current timestamp: 1764933637

## Description

Conduit multisig key rotation.

## Watched changes

```diff
    contract Conduit Multisig 1 (eth:0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      values.$members.0:
+        "eth:0x2103c69696CB2D3779f5445393808239034E911c"
      values.$members.0:
-        "eth:0xFe0ab87ebE03DD0bF52DaF34Dfda6639c335e2d4"
+        "eth:0x65D1d44B8B2fE15d45A03708E0835C7E98a56007"
      values.$members.4:
-        "eth:0xF0B77EaE7F2dabCC2571c7418406A0dCA3afA4f0"
    }
```

Generated with discovered.json: 0x19a7b60ba68b440c0dc55920844f5c85c81ea4a3

# Diff at Tue, 04 Nov 2025 12:58:21 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@6b9a294e84c4d5ca84a7b377bd638098bb461624 block: 1762246195
- current timestamp: 1762246195

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1762246195 (main branch discovery), not current.

```diff
    contract PermissionedDisputeGame (eth:0xd102e395aA8b4710db44B33F14Ae0038F318C2AC) {
    +++ description: Same as FaultDisputeGame, but only two permissioned addresses are designated as proposer and challenger. In the context of this permissioned aggkit deployment, there are no state proposals made here and the op stack fault proof system is not used.
      sourceHashes.0:
-        "0x7129ee348039f13e017c18c90ffcb319f67a8fdd3b4a5a28c39aabc8bf0c57f6"
+        "0x0a442058af95748cc6199d889a46c775f9f6f4d29a61df5124ceb93ff631074d"
    }
```

```diff
    contract MIPS (eth:0xF027F4A985560fb13324e943edf55ad6F1d15Dc1) {
    +++ description: The MIPS contract is used to execute the final step of the dispute game which objectively determines the winner of the dispute.
      sourceHashes.0:
-        "0x115725ab57eeed11f754138c0ec5f9bfba41e494b2336c2cd4745778eb26f776"
+        "0xd693f0cc376e99425037555be4a61adb70c597ad1485e838c475743c79a41fa0"
    }
```

Generated with discovered.json: 0x17c2a52161ad7790b711c373b99243b95983b9fc

# Diff at Tue, 04 Nov 2025 09:09:39 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- current timestamp: 1762246195

## Description

aggkit opstack without proof system/state roots and onchain DA.

## Initial discovery

```diff
+   Status: CREATED
    contract AnchorStateRegistry (eth:0x010DEBD63B170821ae1b4ba93Fe46005aaaB1692)
    +++ description: Contains the latest confirmed state root that can be used as a starting point in a dispute game.
```

```diff
+   Status: CREATED
    reference AgglayerGateway (eth:0x046Bb8bb98Db4ceCbB2929542686B74b516274b3)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SuperchainConfig (eth:0x097f99768A0a4a0A81bAbbCB1ea18193bA9D53cC)
    +++ description: Since this contract is deployed in the context of a neutered op stack system, the guardian role has no significance.
```

```diff
+   Status: CREATED
    contract PreimageOracle (eth:0x1fb8cdFc6831fc866Ed9C51aF8817Da5c287aDD3)
    +++ description: The PreimageOracle contract is used to load the required data from L1 for a dispute game.
```

```diff
+   Status: CREATED
    contract AddressManager (eth:0x2258d4C98AaeDB54f6f1be40ca347FD3160B34C2)
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
```

```diff
+   Status: CREATED
    reference AgglayerBridge (eth:0x2a3DD3EB832aF982ec71669E178424b10Dca2EDe)
    +++ description: None
```

```diff
+   Status: CREATED
    contract AggchainECDSAMultisig (eth:0x2f3d687e02dbe83B6cDaE02aeb66C0e8E69CcA4b)
    +++ description: System contract defining the forknet Aggchain logic. It only enforces bridge accounting (pessimistic) proofs to protect the shared bridge while the Aggchain state transitions are not proven. They must instead be signed by 1 aggchainSigner(s).
```

```diff
+   Status: CREATED
    contract Conduit Multisig 1 (eth:0x4a4962275DF8C60a80d3a25faEc5AA7De116A746)
    +++ description: None
```

```diff
+   Status: CREATED
    reference AgglayerManager (eth:0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OptimismMintableERC20Factory (eth:0x514795090ceA49c14f65b45c4403A36b3576AE03)
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintableERC20 as this chain's representation of a token on the host chain, or vice-versa.
```

```diff
+   Status: CREATED
    reference AgglayerGER (eth:0x580bda1e7A0CFAe92Fa7F6c20A3794F169CE3CFb)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SystemConfig (eth:0x5D2952EAe032aa33e977c52f810e0089261efB27)
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
```

```diff
+   Status: CREATED
    contract L1StandardBridge (eth:0x6C82EEE75Bb8b957C12FaaF8CAb549BE4b0fD5af)
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
```

```diff
+   Status: CREATED
    contract DisputeGameFactory (eth:0xAa47071585ee92Fa9AE314C87d3d12a25c241EeD)
    +++ description: The dispute game factory allows the creation of dispute games, used to propose state roots and eventually challenge them.
```

```diff
+   Status: CREATED
    contract ProxyAdmin (eth:0xb4899FF43Ae727B1E9CB19AC44660e4A43Fad0b5)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1CrossDomainMessenger (eth:0xB847cf7F5CE23cBaF76E751C066bfE732951501f)
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
```

```diff
+   Status: CREATED
    contract PermissionedDisputeGame (eth:0xd102e395aA8b4710db44B33F14Ae0038F318C2AC)
    +++ description: Same as FaultDisputeGame, but only two permissioned addresses are designated as proposer and challenger. In the context of this permissioned aggkit deployment, there are no state proposals made here and the op stack fault proof system is not used.
```

```diff
+   Status: CREATED
    contract L1ERC721Bridge (eth:0xd1cFFdEF1dc379372CB06f3dEdC6debeF6059E82)
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
```

```diff
+   Status: CREATED
    contract OptimismPortal2 (eth:0xD7cF5ce4688663e057E99D9f880599Ce88757695)
    +++ description: The OptimismPortal contract usually is the main entry point to deposit funds from L1 to L2 or for finalizing withdrawals. It specifies which game type can be used for withdrawals, which currently is the PermissionedDisputeGame. This specific fork of the standard contract **disables the depositTransaction() function**, which prevents users from sending or forcing any transactions from L1 to L2, including token deposits. It is instead used for configuration and administration of the system.
```

```diff
+   Status: CREATED
    contract DelayedWETH (eth:0xe0fCd317cbF59bA23205ab1662811E631AcbCE29)
    +++ description: Contract designed to hold the bonded ETH for each game. It is designed as a wrapper around WETH to allow an owner to function as a backstop if a game would incorrectly distribute funds.
```

```diff
+   Status: CREATED
    contract ProxyAdmin (eth:0xEfBb0af25B3bE24347f17916fda058795f36a5A0)
    +++ description: None
```

```diff
+   Status: CREATED
    contract MIPS (eth:0xF027F4A985560fb13324e943edf55ad6F1d15Dc1)
    +++ description: The MIPS contract is used to execute the final step of the dispute game which objectively determines the winner of the dispute.
```
