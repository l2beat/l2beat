Generated with discovered.json: 0x5a26972d20a0d99b09f72545140c151dad15eca8

# Diff at Wed, 09 Jul 2025 15:55:00 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@d05d4ec9af28b2df4e687d7b7676cddffcae6887 block: 22437734
- current block number: 22882513

## Description

Isthmus upgrade - Celo edition (non-standard contracts), added all templates.

no significant changes apart from the standard isthmus ones!

- OptimismPortal2: 
  - diff with prev: https://disco.l2beat.com/diff/eth:0x3Da872782f9fB696fD72Af2ec9313a56bDA6f06d/eth:0x215A5fF85308A72A772F09B520dA71D3520e9aC7
  - diff with op stack standard @ same version (adds custom gastoken): https://disco.l2beat.com/diff/eth:0xB443Da3e07052204A02d630a8933dAc05a0d6fB4/eth:0x215A5fF85308A72A772F09B520dA71D3520e9aC7
- SystemConfig: https://disco.l2beat.com/diff/eth:0x911EA44d22EB903515378625dA3a0E09D2E1B074/eth:0x9c61C5a8FF9408B83ac92571278550097A9d2BB5
- L1StandardBridge: https://disco.l2beat.com/diff/eth:0x0b09ba359A106C9ea3b181CBc5F394570c7d2a7A/eth:0x28841965B26d41304905A836Da5C0921DA7dBB84
- L1CDM: https://disco.l2beat.com/diff/eth:0x3d5a67747dE7E09b0d71F5d782c8b45f6307B9Fd/eth:0x807124F75FF2120b2f26D7e6f9e39C03ee9DE212

## Watched changes

```diff
    EOA  (0x1204884E697efD929729B9A717Ea14496298A689) {
    +++ description: None
      receivedPermissions:
-        [{"permission":"propose","from":"eth:0x2bCeB78Fda0d5e3bfA7F4B8c499aa74bDf8D7755","role":".proposer"}]
    }
```

```diff
    contract L1CrossDomainMessenger (0x1AC1181fc4e4F877963680587AEAa2C90D7EbB95) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      sourceHashes.1:
-        "0x63e8f4931670a580e9e4b27d106235189507cc22a57c6c7aecd8f8a79d8d08ee"
+        "0x6831ab5545aca99fd05c64f6718bff61dc5cbdb7d5b248257ea6e95a132024c3"
      values.$implementation:
-        "0xDE47b113E4157ed15fA46c5572562aC11146c5eA"
+        "0x807124F75FF2120b2f26D7e6f9e39C03ee9DE212"
      values.$pastUpgrades.1:
+        ["2025-07-07T10:24:11.000Z","0x14663947fe932e8ad6d57fe9aa61910d8d2e5fc37ac5e16e4345c3f8e2f7b2d2",["0x3d5a67747dE7E09b0d71F5d782c8b45f6307B9Fd"]]
      values.$pastUpgrades.2:
+        ["2025-07-07T10:27:11.000Z","0xa9816c6dcbbe126e3b5c56f26ecfeebcb2dc03ab78535a7d5ed2bcdeea7ccf39",["0x807124F75FF2120b2f26D7e6f9e39C03ee9DE212"]]
      values.$upgradeCount:
-        1
+        3
      values.version:
-        "2.4.1-beta.2"
+        "2.6.0"
      values.ENCODING_OVERHEAD:
+        260
      values.FLOOR_CALLDATA_OVERHEAD:
+        40
      values.TX_BASE_GAS:
+        21000
      implementationNames.0xDE47b113E4157ed15fA46c5572562aC11146c5eA:
-        "L1CrossDomainMessenger"
      implementationNames.0x807124F75FF2120b2f26D7e6f9e39C03ee9DE212:
+        "L1CrossDomainMessenger"
    }
```

```diff
-   Status: DELETED
    contract PermissionedDisputeGame (0x2bCeB78Fda0d5e3bfA7F4B8c499aa74bDf8D7755)
    +++ description: Same as FaultDisputeGame, but only two permissioned addresses are designated as proposer and challenger.
```

```diff
    contract L1ERC721Bridge (0x3C519816C5BdC0a0199147594F83feD4F5847f13) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      sourceHashes.1:
-        "0x8d03a6303efd76759aaa7d52a65a151d851750f2f816678bf97961d413d4b9c0"
+        "0x28669b49da3effd51f0f9424ca9cdd455c5b9327c09a40c65fc06f114a6eb837"
      values.$implementation:
-        "0xad5D111e961A5E451C8172034115bcc0551b6551"
+        "0x7aE1d3BD877a4C5CA257404ce26BE93A02C98013"
      values.$pastUpgrades.1:
+        ["2025-07-07T10:24:11.000Z","0x14663947fe932e8ad6d57fe9aa61910d8d2e5fc37ac5e16e4345c3f8e2f7b2d2",["0x276d3730f219f7ec22274f7263180b8452B46d47"]]
      values.$pastUpgrades.2:
+        ["2025-07-07T10:27:11.000Z","0xa9816c6dcbbe126e3b5c56f26ecfeebcb2dc03ab78535a7d5ed2bcdeea7ccf39",["0x7aE1d3BD877a4C5CA257404ce26BE93A02C98013"]]
      values.$upgradeCount:
-        1
+        3
      values.version:
-        "2.2.0-beta.1"
+        "2.4.0"
      implementationNames.0xad5D111e961A5E451C8172034115bcc0551b6551:
-        "L1ERC721Bridge"
      implementationNames.0x7aE1d3BD877a4C5CA257404ce26BE93A02C98013:
+        "L1ERC721Bridge"
    }
```

```diff
    contract CeloProxyAdminOwner (0x4092A77bAF58fef0309452cEaCb09221e556E112) {
    +++ description: None
      receivedPermissions.3:
+        {"permission":"upgrade","from":"eth:0x057898f3C43F129a17517B9056D23851F124b19f","role":"admin","via":[{"address":"eth:0x783A434532Ee94667979213af1711505E8bFE374"}]}
      receivedPermissions.9.from:
-        "eth:0xa24Bf5Bc02997f63da4e2C7F802067e05a102504"
+        "eth:0x9F18D91949731E766f294A14027bBFE8F28328CC"
    }
```

```diff
    EOA  (0x6b145Ebf66602Ec524b196426B46631259689583) {
    +++ description: None
      receivedPermissions:
-        [{"permission":"challenge","from":"eth:0x2bCeB78Fda0d5e3bfA7F4B8c499aa74bDf8D7755","role":".challenger"}]
    }
```

```diff
    contract OptimismMintableERC20Factory (0x6f0E4f1EB98A52EfaCF7BE11d48B9d9d6510A906) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      sourceHashes.1:
-        "0xa4526e33eb750144164c05badf980525f867cae82e7db6e108b17aeb61b99924"
+        "0x9650b4bba6299e410f01a369a95a2c57e1c3ca35f0d80c13f4f59fc468f370e5"
      values.$implementation:
-        "0x0B3004b843dA84FE5D4C46AeB5E80F826e5CD69A"
+        "0x5493f4677A186f64805fe7317D6993ba4863988F"
      values.$pastUpgrades.1:
+        ["2025-07-07T10:24:11.000Z","0x14663947fe932e8ad6d57fe9aa61910d8d2e5fc37ac5e16e4345c3f8e2f7b2d2",["0x5493f4677A186f64805fe7317D6993ba4863988F"]]
      values.$upgradeCount:
-        1
+        2
      values.version:
-        "1.10.1-beta.4"
+        "1.10.1"
      implementationNames.0x0B3004b843dA84FE5D4C46AeB5E80F826e5CD69A:
-        "OptimismMintableERC20Factory"
      implementationNames.0x5493f4677A186f64805fe7317D6993ba4863988F:
+        "OptimismMintableERC20Factory"
    }
```

```diff
    contract ProxyAdmin (0x783A434532Ee94667979213af1711505E8bFE374) {
    +++ description: None
      directlyReceivedPermissions.1:
+        {"permission":"upgrade","from":"eth:0x057898f3C43F129a17517B9056D23851F124b19f","role":"admin"}
      directlyReceivedPermissions.7.from:
-        "eth:0xa24Bf5Bc02997f63da4e2C7F802067e05a102504"
+        "eth:0x9F18D91949731E766f294A14027bBFE8F28328CC"
    }
```

```diff
-   Status: DELETED
    contract FaultDisputeGame (0x876e8eeE292F23F163C9bCA406eDD65bEAEFBEBC)
    +++ description: Logic of the dispute game. When a state root is proposed, a dispute game contract is deployed. Challengers can use such contracts to challenge the proposed state root.
```

```diff
    contract SystemConfig (0x89E31965D844a309231B1f17759Ccaf1b7c09861) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      sourceHashes.1:
-        "0xc7135dbd2a53312d36df3f3ee91ce0a5a459ab8fc7725880a3a9c55a5fa0ed6c"
+        "0xde1dd3a62e9db0a611ef7256805eb375a1fa1a6c8fa0ba6afc44df5b3cd7d8be"
      values.$implementation:
-        "0x7b5a84F818B6fC3F079EE87c214F369062188D2A"
+        "0x9c61C5a8FF9408B83ac92571278550097A9d2BB5"
      values.$pastUpgrades.1:
+        ["2025-07-07T10:24:11.000Z","0x14663947fe932e8ad6d57fe9aa61910d8d2e5fc37ac5e16e4345c3f8e2f7b2d2",["0x911EA44d22EB903515378625dA3a0E09D2E1B074"]]
      values.$pastUpgrades.2:
+        ["2025-07-07T10:27:11.000Z","0xa9816c6dcbbe126e3b5c56f26ecfeebcb2dc03ab78535a7d5ed2bcdeea7ccf39",["0x9c61C5a8FF9408B83ac92571278550097A9d2BB5"]]
      values.$upgradeCount:
-        1
+        3
      values.version:
-        "2.3.0"
+        "2.5.0"
      values.getAddresses:
+        {"l1CrossDomainMessenger":"0x1AC1181fc4e4F877963680587AEAa2C90D7EbB95","l1ERC721Bridge":"0x3C519816C5BdC0a0199147594F83feD4F5847f13","l1StandardBridge":"0x9C4955b92F34148dbcfDCD82e9c9eCe5CF2badfe","disputeGameFactory":"0xFbAC162162f4009Bb007C6DeBC36B1dAC10aF683","optimismPortal":"0xc5c5D157928BDBD2ACf6d0777626b6C75a9EAEDC","optimismMintableERC20Factory":"0x6f0E4f1EB98A52EfaCF7BE11d48B9d9d6510A906","gasPayingToken":"0x057898f3C43F129a17517B9056D23851F124b19f"}
      values.operatorFeeConstant:
+        0
      values.operatorFeeScalar:
+        0
      implementationNames.0x7b5a84F818B6fC3F079EE87c214F369062188D2A:
-        "SystemConfig"
      implementationNames.0x9c61C5a8FF9408B83ac92571278550097A9d2BB5:
+        "SystemConfig"
    }
```

```diff
-   Status: DELETED
    contract MIPS (0x8A12E1754f729C0856E2E32D4821577f0B245bfA)
    +++ description: The MIPS contract is used to execute the final step of the dispute game which objectively determines the winner of the dispute.
```

```diff
    contract DelayedWETH (0x9c314E8057025F2982aa4B3923Abd741A8e8DE91) {
    +++ description: Contract designed to hold the bonded ETH for each game. It is designed as a wrapper around WETH to allow an owner to function as a backstop if a game would incorrectly distribute funds.
      sourceHashes.1:
-        "0x2301d347829ef824a15e141e20cb7f1567a2425ebc534de28ee1f56ca3d48189"
+        "0x1c7d0fda5ed6d8fc7f5b5f7df5e307f0fcfd173fa5833ea9fce8875d5d44d86a"
      values.$implementation:
-        "0xDFBB69681F217aB3221E94AFCA4fEa51f5c6a779"
+        "0x1e121E21E1A11Ae47C0EFE8A7E13ae3eb4923796"
      values.$pastUpgrades.1:
+        ["2025-07-07T10:24:11.000Z","0x14663947fe932e8ad6d57fe9aa61910d8d2e5fc37ac5e16e4345c3f8e2f7b2d2",["0x1e121E21E1A11Ae47C0EFE8A7E13ae3eb4923796"]]
      values.$upgradeCount:
-        1
+        2
      values.version:
-        "1.2.0-beta.3"
+        "1.3.0"
      implementationNames.0xDFBB69681F217aB3221E94AFCA4fEa51f5c6a779:
-        "DelayedWETH"
      implementationNames.0x1e121E21E1A11Ae47C0EFE8A7E13ae3eb4923796:
+        "DelayedWETH"
    }
```

```diff
    contract L1StandardBridge (0x9C4955b92F34148dbcfDCD82e9c9eCe5CF2badfe) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      sourceHashes.1:
-        "0x660d3bcc53c06135b0810d3b5ca347ffde4e6a49e66f0bb081771b45d0baa1e5"
+        "0xcc038053dba84fe88b91f9062f3927165798c810fed5cb953c2045de301daf95"
      values.$implementation:
-        "0x5e21245e97A7BB4733f72c412DcdDCED1f408587"
+        "0x28841965B26d41304905A836Da5C0921DA7dBB84"
      values.version:
-        "2.2.1-beta.2"
+        "2.3.0"
      implementationNames.0x5e21245e97A7BB4733f72c412DcdDCED1f408587:
-        "L1StandardBridge"
      implementationNames.0x28841965B26d41304905A836Da5C0921DA7dBB84:
+        "L1StandardBridge"
    }
```

```diff
-   Status: DELETED
    contract AnchorStateRegistry (0xa24Bf5Bc02997f63da4e2C7F802067e05a102504)
    +++ description: Contains the latest confirmed state root that can be used as a starting point in a dispute game.
```

```diff
    contract DelayedWETH (0xa316D42E8Fd98D2Ec364b8bF853d2623E768f95a) {
    +++ description: Contract designed to hold the bonded ETH for each game. It is designed as a wrapper around WETH to allow an owner to function as a backstop if a game would incorrectly distribute funds.
      sourceHashes.1:
-        "0x2301d347829ef824a15e141e20cb7f1567a2425ebc534de28ee1f56ca3d48189"
+        "0x1c7d0fda5ed6d8fc7f5b5f7df5e307f0fcfd173fa5833ea9fce8875d5d44d86a"
      values.$implementation:
-        "0xDFBB69681F217aB3221E94AFCA4fEa51f5c6a779"
+        "0x1e121E21E1A11Ae47C0EFE8A7E13ae3eb4923796"
      values.$pastUpgrades.1:
+        ["2025-07-07T10:24:11.000Z","0x14663947fe932e8ad6d57fe9aa61910d8d2e5fc37ac5e16e4345c3f8e2f7b2d2",["0x1e121E21E1A11Ae47C0EFE8A7E13ae3eb4923796"]]
      values.$upgradeCount:
-        1
+        2
      values.version:
-        "1.2.0-beta.3"
+        "1.3.0"
      implementationNames.0xDFBB69681F217aB3221E94AFCA4fEa51f5c6a779:
-        "DelayedWETH"
      implementationNames.0x1e121E21E1A11Ae47C0EFE8A7E13ae3eb4923796:
+        "DelayedWETH"
    }
```

```diff
    contract OptimismPortal2 (0xc5c5D157928BDBD2ACf6d0777626b6C75a9EAEDC) {
    +++ description: The OptimismPortal contract is the main entry point to deposit funds from L1 to L2. It also allows to prove and finalize withdrawals. It specifies which game type can be used for withdrawals, which currently is the PermissionedDisputeGame.
      sourceHashes.1:
-        "0x3428a8cdf5cc8628eb5234317ac9c44a21c8171ebfea260dfae5ad3c629b9e3b"
+        "0x61779e0cf81852e74f9420c1500237e5c588b39f95b03369daca20d2e624b741"
      values.$implementation:
-        "0x3Da872782f9fB696fD72Af2ec9313a56bDA6f06d"
+        "0x215A5fF85308A72A772F09B520dA71D3520e9aC7"
      values.$pastUpgrades.2:
+        ["2025-07-07T10:24:11.000Z","0x14663947fe932e8ad6d57fe9aa61910d8d2e5fc37ac5e16e4345c3f8e2f7b2d2",["0xBeD463769920dAc19a7E2aDf47B6C6Bb6480bD97"]]
      values.$pastUpgrades.3:
+        ["2025-07-07T10:27:11.000Z","0xa9816c6dcbbe126e3b5c56f26ecfeebcb2dc03ab78535a7d5ed2bcdeea7ccf39",["0x215A5fF85308A72A772F09B520dA71D3520e9aC7"]]
      values.$upgradeCount:
-        2
+        4
      values.version:
-        "3.11.0-beta.6"
+        "3.14.0"
      implementationNames.0x3Da872782f9fB696fD72Af2ec9313a56bDA6f06d:
-        "OptimismPortal2"
      implementationNames.0x215A5fF85308A72A772F09B520dA71D3520e9aC7:
+        "OptimismPortal2"
    }
```

```diff
-   Status: DELETED
    contract PreimageOracle (0xfaB0F466955D87e596Ca87E20c505bB6470D0DC4)
    +++ description: The PreimageOracle contract is used to load the required data from L1 for a dispute game.
```

```diff
    contract DisputeGameFactory (0xFbAC162162f4009Bb007C6DeBC36B1dAC10aF683) {
    +++ description: The dispute game factory allows the creation of dispute games, used to propose state roots and eventually challenge them.
      sourceHashes.1:
-        "0xe74de8a6ebfd4ec156cf8699ce372d14df81ea1ce6e0a4b4460f1b3575aa658a"
+        "0x85ca17941ef36ac6b28a4f8f89803d0d41ef419c47586dcd3acdb47ee9617285"
      values.$implementation:
-        "0xe8b013bEE7Bd603e2f0B4825638559d645A4C4CB"
+        "0x4bbA758F006Ef09402eF31724203F316ab74e4a0"
      values.$pastUpgrades.1:
+        ["2025-07-07T10:24:11.000Z","0x14663947fe932e8ad6d57fe9aa61910d8d2e5fc37ac5e16e4345c3f8e2f7b2d2",["0x4bbA758F006Ef09402eF31724203F316ab74e4a0"]]
      values.$upgradeCount:
-        1
+        2
      values.gameImpls.0:
-        "0x876e8eeE292F23F163C9bCA406eDD65bEAEFBEBC"
+        "0xcc744008aD3306a716fED303b0A6eA5b5d0690a5"
      values.gameImpls.1:
-        "0x2bCeB78Fda0d5e3bfA7F4B8c499aa74bDf8D7755"
+        "0x25c2e07A24a74F9FA54f7CA5ddAfedB2264a5d02"
      values.version:
-        "1.0.1-beta.3"
+        "1.0.1"
      implementationNames.0xe8b013bEE7Bd603e2f0B4825638559d645A4C4CB:
-        "DisputeGameFactory"
      implementationNames.0x4bbA758F006Ef09402eF31724203F316ab74e4a0:
+        "DisputeGameFactory"
    }
```

```diff
+   Status: CREATED
    contract Celo native asset Token (0x057898f3C43F129a17517B9056D23851F124b19f)
    +++ description: None
```

```diff
+   Status: CREATED
    contract PreimageOracle (0x1fb8cdFc6831fc866Ed9C51aF8817Da5c287aDD3)
    +++ description: The PreimageOracle contract is used to load the required data from L1 for a dispute game.
```

```diff
+   Status: CREATED
    contract PermissionedDisputeGame (0x25c2e07A24a74F9FA54f7CA5ddAfedB2264a5d02)
    +++ description: Same as FaultDisputeGame, but only two permissioned addresses are designated as proposer and challenger.
```

```diff
+   Status: CREATED
    contract AnchorStateRegistry (0x9F18D91949731E766f294A14027bBFE8F28328CC)
    +++ description: Contains the latest confirmed state root that can be used as a starting point in a dispute game.
```

```diff
+   Status: CREATED
    contract MIPS (0xaA59A0777648BC75cd10364083e878c1cCd6112a)
    +++ description: The MIPS contract is used to execute the final step of the dispute game which objectively determines the winner of the dispute.
```

```diff
+   Status: CREATED
    contract FaultDisputeGame (0xcc744008aD3306a716fED303b0A6eA5b5d0690a5)
    +++ description: Logic of the dispute game. When a state root is proposed, a dispute game contract is deployed. Challengers can use such contracts to challenge the proposed state root.
```

## Source code changes

```diff
.../AnchorStateRegistry/AnchorStateRegistry.sol    | 270 ++++++--
 .../.flat/Celo native asset Token/CeloTokenL1.sol  | 763 +++++++++++++++++++++
 .../.flat/Celo native asset Token/Proxy.p.sol      | 200 ++++++
 .../DelayedWETH.sol                                |  30 +-
 .../DelayedWETH.sol                                |  30 +-
 .../DisputeGameFactory/DisputeGameFactory.sol      |   8 +-
 .../{.flat@22437734 => .flat}/FaultDisputeGame.sol | 230 +++++--
 .../L1CrossDomainMessenger.sol                     | 366 +++++++++-
 .../L1ERC721Bridge/L1ERC721Bridge.sol              | 216 +++---
 .../L1StandardBridge/L1StandardBridge.sol          | 255 +++----
 .../ethereum/{.flat@22437734 => .flat}/MIPS.sol    |  75 +-
 .../OptimismMintableERC20Factory.sol               |   8 +-
 .../OptimismPortal2/OptimismPortal2.sol            | 191 +++++-
 .../PermissionedDisputeGame.sol                    | 267 ++++---
 .../{.flat@22437734 => .flat}/PreimageOracle.sol   |  71 +-
 .../SystemConfig/SystemConfig.sol                  |  89 +--
 16 files changed, 2422 insertions(+), 647 deletions(-)
```

Generated with discovered.json: 0x907e9adfe3e8034d50e4b10ebeac62b3bc839075

# Diff at Fri, 04 Jul 2025 12:18:56 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f56dc47fe915564d4555300304da4d3bcbc087f block: 22437734
- current block number: 22437734

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22437734 (main branch discovery), not current.

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
    EOA  (0x0cd08c7f7A96AA9635f761b49216B9eA74C5cA60) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0x89E31965D844a309231B1f17759Ccaf1b7c09861"
+        "eth:0x89E31965D844a309231B1f17759Ccaf1b7c09861"
    }
```

```diff
    EOA  (0x1204884E697efD929729B9A717Ea14496298A689) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0x2bCeB78Fda0d5e3bfA7F4B8c499aa74bDf8D7755"
+        "eth:0x2bCeB78Fda0d5e3bfA7F4B8c499aa74bDf8D7755"
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
    contract CeloProxyAdminOwner (0x4092A77bAF58fef0309452cEaCb09221e556E112) {
    +++ description: None
      receivedPermissions.0.via.0.address:
-        "ethereum:0x783A434532Ee94667979213af1711505E8bFE374"
+        "eth:0x783A434532Ee94667979213af1711505E8bFE374"
      receivedPermissions.0.from:
-        "ethereum:0x55093104b76FAA602F9d6c35A5FFF576bE78d753"
+        "eth:0x55093104b76FAA602F9d6c35A5FFF576bE78d753"
      receivedPermissions.1.from:
-        "ethereum:0x89E31965D844a309231B1f17759Ccaf1b7c09861"
+        "eth:0x89E31965D844a309231B1f17759Ccaf1b7c09861"
      receivedPermissions.2.from:
-        "ethereum:0xa316D42E8Fd98D2Ec364b8bF853d2623E768f95a"
+        "eth:0xa316D42E8Fd98D2Ec364b8bF853d2623E768f95a"
      receivedPermissions.3.via.0.address:
-        "ethereum:0x783A434532Ee94667979213af1711505E8bFE374"
+        "eth:0x783A434532Ee94667979213af1711505E8bFE374"
      receivedPermissions.3.from:
-        "ethereum:0x1AC1181fc4e4F877963680587AEAa2C90D7EbB95"
+        "eth:0x1AC1181fc4e4F877963680587AEAa2C90D7EbB95"
      receivedPermissions.4.via.0.address:
-        "ethereum:0x783A434532Ee94667979213af1711505E8bFE374"
+        "eth:0x783A434532Ee94667979213af1711505E8bFE374"
      receivedPermissions.4.from:
-        "ethereum:0x3C519816C5BdC0a0199147594F83feD4F5847f13"
+        "eth:0x3C519816C5BdC0a0199147594F83feD4F5847f13"
      receivedPermissions.5.via.0.address:
-        "ethereum:0x783A434532Ee94667979213af1711505E8bFE374"
+        "eth:0x783A434532Ee94667979213af1711505E8bFE374"
      receivedPermissions.5.from:
-        "ethereum:0x6f0E4f1EB98A52EfaCF7BE11d48B9d9d6510A906"
+        "eth:0x6f0E4f1EB98A52EfaCF7BE11d48B9d9d6510A906"
      receivedPermissions.6.via.0.address:
-        "ethereum:0x783A434532Ee94667979213af1711505E8bFE374"
+        "eth:0x783A434532Ee94667979213af1711505E8bFE374"
      receivedPermissions.6.from:
-        "ethereum:0x89E31965D844a309231B1f17759Ccaf1b7c09861"
+        "eth:0x89E31965D844a309231B1f17759Ccaf1b7c09861"
      receivedPermissions.7.via.0.address:
-        "ethereum:0x783A434532Ee94667979213af1711505E8bFE374"
+        "eth:0x783A434532Ee94667979213af1711505E8bFE374"
      receivedPermissions.7.from:
-        "ethereum:0x9c314E8057025F2982aa4B3923Abd741A8e8DE91"
+        "eth:0x9c314E8057025F2982aa4B3923Abd741A8e8DE91"
      receivedPermissions.8.via.0.address:
-        "ethereum:0x783A434532Ee94667979213af1711505E8bFE374"
+        "eth:0x783A434532Ee94667979213af1711505E8bFE374"
      receivedPermissions.8.from:
-        "ethereum:0x9C4955b92F34148dbcfDCD82e9c9eCe5CF2badfe"
+        "eth:0x9C4955b92F34148dbcfDCD82e9c9eCe5CF2badfe"
      receivedPermissions.9.via.0.address:
-        "ethereum:0x783A434532Ee94667979213af1711505E8bFE374"
+        "eth:0x783A434532Ee94667979213af1711505E8bFE374"
      receivedPermissions.9.from:
-        "ethereum:0xa24Bf5Bc02997f63da4e2C7F802067e05a102504"
+        "eth:0xa24Bf5Bc02997f63da4e2C7F802067e05a102504"
      receivedPermissions.10.via.0.address:
-        "ethereum:0x783A434532Ee94667979213af1711505E8bFE374"
+        "eth:0x783A434532Ee94667979213af1711505E8bFE374"
      receivedPermissions.10.from:
-        "ethereum:0xa316D42E8Fd98D2Ec364b8bF853d2623E768f95a"
+        "eth:0xa316D42E8Fd98D2Ec364b8bF853d2623E768f95a"
      receivedPermissions.11.via.0.address:
-        "ethereum:0x783A434532Ee94667979213af1711505E8bFE374"
+        "eth:0x783A434532Ee94667979213af1711505E8bFE374"
      receivedPermissions.11.from:
-        "ethereum:0xa440975E5A6BB19Bc3Bee901d909BB24b0f43D33"
+        "eth:0xa440975E5A6BB19Bc3Bee901d909BB24b0f43D33"
      receivedPermissions.12.via.0.address:
-        "ethereum:0x783A434532Ee94667979213af1711505E8bFE374"
+        "eth:0x783A434532Ee94667979213af1711505E8bFE374"
      receivedPermissions.12.from:
-        "ethereum:0xc5c5D157928BDBD2ACf6d0777626b6C75a9EAEDC"
+        "eth:0xc5c5D157928BDBD2ACf6d0777626b6C75a9EAEDC"
      receivedPermissions.13.via.0.address:
-        "ethereum:0x783A434532Ee94667979213af1711505E8bFE374"
+        "eth:0x783A434532Ee94667979213af1711505E8bFE374"
      receivedPermissions.13.from:
-        "ethereum:0xFbAC162162f4009Bb007C6DeBC36B1dAC10aF683"
+        "eth:0xFbAC162162f4009Bb007C6DeBC36B1dAC10aF683"
      directlyReceivedPermissions.0.from:
-        "ethereum:0x783A434532Ee94667979213af1711505E8bFE374"
+        "eth:0x783A434532Ee94667979213af1711505E8bFE374"
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
    EOA  (0x6b145Ebf66602Ec524b196426B46631259689583) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0x2bCeB78Fda0d5e3bfA7F4B8c499aa74bDf8D7755"
+        "eth:0x2bCeB78Fda0d5e3bfA7F4B8c499aa74bDf8D7755"
    }
```

```diff
    EOA  (0x6E226fa22e5F19363d231D3FA048aaBa73CC1f47) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0xa440975E5A6BB19Bc3Bee901d909BB24b0f43D33"
+        "eth:0xa440975E5A6BB19Bc3Bee901d909BB24b0f43D33"
    }
```

```diff
    contract ProxyAdmin (0x783A434532Ee94667979213af1711505E8bFE374) {
    +++ description: None
      directlyReceivedPermissions.0.from:
-        "ethereum:0x55093104b76FAA602F9d6c35A5FFF576bE78d753"
+        "eth:0x55093104b76FAA602F9d6c35A5FFF576bE78d753"
      directlyReceivedPermissions.1.from:
-        "ethereum:0x1AC1181fc4e4F877963680587AEAa2C90D7EbB95"
+        "eth:0x1AC1181fc4e4F877963680587AEAa2C90D7EbB95"
      directlyReceivedPermissions.2.from:
-        "ethereum:0x3C519816C5BdC0a0199147594F83feD4F5847f13"
+        "eth:0x3C519816C5BdC0a0199147594F83feD4F5847f13"
      directlyReceivedPermissions.3.from:
-        "ethereum:0x6f0E4f1EB98A52EfaCF7BE11d48B9d9d6510A906"
+        "eth:0x6f0E4f1EB98A52EfaCF7BE11d48B9d9d6510A906"
      directlyReceivedPermissions.4.from:
-        "ethereum:0x89E31965D844a309231B1f17759Ccaf1b7c09861"
+        "eth:0x89E31965D844a309231B1f17759Ccaf1b7c09861"
      directlyReceivedPermissions.5.from:
-        "ethereum:0x9c314E8057025F2982aa4B3923Abd741A8e8DE91"
+        "eth:0x9c314E8057025F2982aa4B3923Abd741A8e8DE91"
      directlyReceivedPermissions.6.from:
-        "ethereum:0x9C4955b92F34148dbcfDCD82e9c9eCe5CF2badfe"
+        "eth:0x9C4955b92F34148dbcfDCD82e9c9eCe5CF2badfe"
      directlyReceivedPermissions.7.from:
-        "ethereum:0xa24Bf5Bc02997f63da4e2C7F802067e05a102504"
+        "eth:0xa24Bf5Bc02997f63da4e2C7F802067e05a102504"
      directlyReceivedPermissions.8.from:
-        "ethereum:0xa316D42E8Fd98D2Ec364b8bF853d2623E768f95a"
+        "eth:0xa316D42E8Fd98D2Ec364b8bF853d2623E768f95a"
      directlyReceivedPermissions.9.from:
-        "ethereum:0xa440975E5A6BB19Bc3Bee901d909BB24b0f43D33"
+        "eth:0xa440975E5A6BB19Bc3Bee901d909BB24b0f43D33"
      directlyReceivedPermissions.10.from:
-        "ethereum:0xc5c5D157928BDBD2ACf6d0777626b6C75a9EAEDC"
+        "eth:0xc5c5D157928BDBD2ACf6d0777626b6C75a9EAEDC"
      directlyReceivedPermissions.11.from:
-        "ethereum:0xFbAC162162f4009Bb007C6DeBC36B1dAC10aF683"
+        "eth:0xFbAC162162f4009Bb007C6DeBC36B1dAC10aF683"
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
    contract SuperchainConfig (0x95703e0982140D16f8ebA6d158FccEde42f04a4C) {
    +++ description: Used to manage global configuration values for multiple OP Chains within a single Superchain network. The SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the Superchain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      receivedPermissions.0.from:
-        "ethereum:0xa440975E5A6BB19Bc3Bee901d909BB24b0f43D33"
+        "eth:0xa440975E5A6BB19Bc3Bee901d909BB24b0f43D33"
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
    EOA  (0xbcA67eE5188efc419c42C91156EcC888b20664f3) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0x9c314E8057025F2982aa4B3923Abd741A8e8DE91"
+        "eth:0x9c314E8057025F2982aa4B3923Abd741A8e8DE91"
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

Generated with discovered.json: 0xc4e27a0026464f69139c0224f2aad719377d9844

# Diff at Mon, 16 Jun 2025 10:14:37 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@e1208475abce20cea1768d2e4878c03350c1b7c9 block: 22437734
- current block number: 22437734

## Description

Config: add permissioned opfp role tags.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22437734 (main branch discovery), not current.

```diff
    contract L1CrossDomainMessenger (0x1AC1181fc4e4F877963680587AEAa2C90D7EbB95) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      values.$admin:
+        "0x783A434532Ee94667979213af1711505E8bFE374"
    }
```

```diff
    contract CeloProxyAdminOwner (0x4092A77bAF58fef0309452cEaCb09221e556E112) {
    +++ description: None
      receivedPermissions.13:
+        {"permission":"upgrade","from":"ethereum:0x89E31965D844a309231B1f17759Ccaf1b7c09861","role":"admin","via":[{"address":"ethereum:0x783A434532Ee94667979213af1711505E8bFE374"}]}
      receivedPermissions.12.from:
-        "ethereum:0x89E31965D844a309231B1f17759Ccaf1b7c09861"
+        "ethereum:0xa440975E5A6BB19Bc3Bee901d909BB24b0f43D33"
      receivedPermissions.11.from:
-        "ethereum:0xa440975E5A6BB19Bc3Bee901d909BB24b0f43D33"
+        "ethereum:0xa316D42E8Fd98D2Ec364b8bF853d2623E768f95a"
      receivedPermissions.10.from:
-        "ethereum:0xa316D42E8Fd98D2Ec364b8bF853d2623E768f95a"
+        "ethereum:0xFbAC162162f4009Bb007C6DeBC36B1dAC10aF683"
      receivedPermissions.9.from:
-        "ethereum:0xFbAC162162f4009Bb007C6DeBC36B1dAC10aF683"
+        "ethereum:0xa24Bf5Bc02997f63da4e2C7F802067e05a102504"
      receivedPermissions.8.from:
-        "ethereum:0xa24Bf5Bc02997f63da4e2C7F802067e05a102504"
+        "ethereum:0xc5c5D157928BDBD2ACf6d0777626b6C75a9EAEDC"
      receivedPermissions.7.from:
-        "ethereum:0xc5c5D157928BDBD2ACf6d0777626b6C75a9EAEDC"
+        "ethereum:0x9c314E8057025F2982aa4B3923Abd741A8e8DE91"
      receivedPermissions.6.permission:
-        "upgrade"
+        "interact"
      receivedPermissions.6.from:
-        "ethereum:0x9c314E8057025F2982aa4B3923Abd741A8e8DE91"
+        "ethereum:0xa316D42E8Fd98D2Ec364b8bF853d2623E768f95a"
      receivedPermissions.6.role:
-        "admin"
+        ".owner"
      receivedPermissions.6.via:
-        [{"address":"ethereum:0x783A434532Ee94667979213af1711505E8bFE374"}]
      receivedPermissions.6.description:
+        "can pull funds from the contract in case of emergency."
      receivedPermissions.5.permission:
-        "interact"
+        "upgrade"
      receivedPermissions.5.from:
-        "ethereum:0xa316D42E8Fd98D2Ec364b8bF853d2623E768f95a"
+        "ethereum:0x6f0E4f1EB98A52EfaCF7BE11d48B9d9d6510A906"
      receivedPermissions.5.description:
-        "can pull funds from the contract in case of emergency."
      receivedPermissions.5.role:
-        ".owner"
+        "admin"
      receivedPermissions.5.via:
+        [{"address":"ethereum:0x783A434532Ee94667979213af1711505E8bFE374"}]
      receivedPermissions.4.from:
-        "ethereum:0x6f0E4f1EB98A52EfaCF7BE11d48B9d9d6510A906"
+        "ethereum:0x3C519816C5BdC0a0199147594F83feD4F5847f13"
      receivedPermissions.3.from:
-        "ethereum:0x3C519816C5BdC0a0199147594F83feD4F5847f13"
+        "ethereum:0x1AC1181fc4e4F877963680587AEAa2C90D7EbB95"
    }
```

```diff
    contract ProxyAdmin (0x783A434532Ee94667979213af1711505E8bFE374) {
    +++ description: None
      directlyReceivedPermissions.11:
+        {"permission":"upgrade","from":"ethereum:0x89E31965D844a309231B1f17759Ccaf1b7c09861","role":"admin"}
      directlyReceivedPermissions.10.from:
-        "ethereum:0x89E31965D844a309231B1f17759Ccaf1b7c09861"
+        "ethereum:0xa440975E5A6BB19Bc3Bee901d909BB24b0f43D33"
      directlyReceivedPermissions.9.from:
-        "ethereum:0xa440975E5A6BB19Bc3Bee901d909BB24b0f43D33"
+        "ethereum:0xa316D42E8Fd98D2Ec364b8bF853d2623E768f95a"
      directlyReceivedPermissions.8.from:
-        "ethereum:0xa316D42E8Fd98D2Ec364b8bF853d2623E768f95a"
+        "ethereum:0xFbAC162162f4009Bb007C6DeBC36B1dAC10aF683"
      directlyReceivedPermissions.7.from:
-        "ethereum:0xFbAC162162f4009Bb007C6DeBC36B1dAC10aF683"
+        "ethereum:0xa24Bf5Bc02997f63da4e2C7F802067e05a102504"
      directlyReceivedPermissions.6.from:
-        "ethereum:0xa24Bf5Bc02997f63da4e2C7F802067e05a102504"
+        "ethereum:0xc5c5D157928BDBD2ACf6d0777626b6C75a9EAEDC"
      directlyReceivedPermissions.5.from:
-        "ethereum:0xc5c5D157928BDBD2ACf6d0777626b6C75a9EAEDC"
+        "ethereum:0x9c314E8057025F2982aa4B3923Abd741A8e8DE91"
      directlyReceivedPermissions.4.from:
-        "ethereum:0x9c314E8057025F2982aa4B3923Abd741A8e8DE91"
+        "ethereum:0x6f0E4f1EB98A52EfaCF7BE11d48B9d9d6510A906"
      directlyReceivedPermissions.3.from:
-        "ethereum:0x6f0E4f1EB98A52EfaCF7BE11d48B9d9d6510A906"
+        "ethereum:0x3C519816C5BdC0a0199147594F83feD4F5847f13"
      directlyReceivedPermissions.2.from:
-        "ethereum:0x3C519816C5BdC0a0199147594F83feD4F5847f13"
+        "ethereum:0x1AC1181fc4e4F877963680587AEAa2C90D7EbB95"
    }
```

Generated with discovered.json: 0x5a298bf0e3708a9384044d5d3cee90b51e616711

# Diff at Fri, 30 May 2025 06:57:02 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@a4d8c436027d17df0f9b76843cd6deb1888fa381 block: 22437734
- current block number: 22437734

## Description

config: change comment about eip1559 fee val

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22437734 (main branch discovery), not current.

```diff
    contract SystemConfig (0x89E31965D844a309231B1f17759Ccaf1b7c09861) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      fieldMeta.eip1559Denominator:
+        {"description":"volatility param: lower denominator -> quicker fee changes on L2"}
    }
```

Generated with discovered.json: 0x79073058ea88e5a3873948aa423fda7be77118a9

# Diff at Fri, 23 May 2025 09:40:54 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@69cd181abbc3c830a6caf2f4429b37cae72ffdb8 block: 22437734
- current block number: 22437734

## Description

Introduced .role field on each permission, defaulting to field name on which it was defined (with '.' prefix)

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22437734 (main branch discovery), not current.

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
    EOA  (0x0cd08c7f7A96AA9635f761b49216B9eA74C5cA60) {
    +++ description: None
      receivedPermissions.0.role:
+        ".batcherHash"
    }
```

```diff
    EOA  (0x1204884E697efD929729B9A717Ea14496298A689) {
    +++ description: None
      receivedPermissions.0.role:
+        ".proposer"
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
    contract CeloProxyAdminOwner (0x4092A77bAF58fef0309452cEaCb09221e556E112) {
    +++ description: None
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
      receivedPermissions.4.permission:
-        "interact"
+        "upgrade"
      receivedPermissions.4.from:
-        "0xa316D42E8Fd98D2Ec364b8bF853d2623E768f95a"
+        "0x89E31965D844a309231B1f17759Ccaf1b7c09861"
      receivedPermissions.4.description:
-        "can pull funds from the contract in case of emergency."
      receivedPermissions.4.role:
+        "admin"
      receivedPermissions.4.via:
+        [{"address":"0x783A434532Ee94667979213af1711505E8bFE374"}]
      receivedPermissions.3.permission:
-        "upgrade"
+        "interact"
      receivedPermissions.3.from:
-        "0x89E31965D844a309231B1f17759Ccaf1b7c09861"
+        "0xa316D42E8Fd98D2Ec364b8bF853d2623E768f95a"
      receivedPermissions.3.via:
-        [{"address":"0x783A434532Ee94667979213af1711505E8bFE374"}]
      receivedPermissions.3.description:
+        "can pull funds from the contract in case of emergency."
      receivedPermissions.3.role:
+        ".owner"
      receivedPermissions.2.permission:
-        "interact"
+        "upgrade"
      receivedPermissions.2.from:
-        "0x55093104b76FAA602F9d6c35A5FFF576bE78d753"
+        "0x9C4955b92F34148dbcfDCD82e9c9eCe5CF2badfe"
      receivedPermissions.2.description:
-        "set and change address mappings."
+        "upgrading the bridge implementation can give access to all funds escrowed therein."
      receivedPermissions.2.role:
+        ".$admin"
      receivedPermissions.1.permission:
-        "upgrade"
+        "interact"
      receivedPermissions.1.from:
-        "0x9C4955b92F34148dbcfDCD82e9c9eCe5CF2badfe"
+        "0x55093104b76FAA602F9d6c35A5FFF576bE78d753"
      receivedPermissions.1.description:
-        "upgrading the bridge implementation can give access to all funds escrowed therein."
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
    EOA  (0x6b145Ebf66602Ec524b196426B46631259689583) {
    +++ description: None
      receivedPermissions.0.role:
+        ".challenger"
    }
```

```diff
    EOA  (0x6E226fa22e5F19363d231D3FA048aaBa73CC1f47) {
    +++ description: None
      receivedPermissions.0.role:
+        ".guardian"
    }
```

```diff
    contract ProxyAdmin (0x783A434532Ee94667979213af1711505E8bFE374) {
    +++ description: None
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
      directlyReceivedPermissions.1.permission:
-        "interact"
+        "upgrade"
      directlyReceivedPermissions.1.from:
-        "0x55093104b76FAA602F9d6c35A5FFF576bE78d753"
+        "0x9C4955b92F34148dbcfDCD82e9c9eCe5CF2badfe"
      directlyReceivedPermissions.1.description:
-        "set and change address mappings."
+        "upgrading the bridge implementation can give access to all funds escrowed therein."
      directlyReceivedPermissions.1.role:
+        ".$admin"
      directlyReceivedPermissions.0.permission:
-        "upgrade"
+        "interact"
      directlyReceivedPermissions.0.from:
-        "0x9C4955b92F34148dbcfDCD82e9c9eCe5CF2badfe"
+        "0x55093104b76FAA602F9d6c35A5FFF576bE78d753"
      directlyReceivedPermissions.0.description:
-        "upgrading the bridge implementation can give access to all funds escrowed therein."
+        "set and change address mappings."
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
    contract SuperchainConfig (0x95703e0982140D16f8ebA6d158FccEde42f04a4C) {
    +++ description: Used to manage global configuration values for multiple OP Chains within a single Superchain network. The SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the Superchain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      receivedPermissions.0.role:
+        ".superchainConfig"
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
    EOA  (0xbcA67eE5188efc419c42C91156EcC888b20664f3) {
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

Generated with discovered.json: 0x437d55dad42be3abef90bce989c04757766721e1

# Diff at Fri, 09 May 2025 10:09:07 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@c3a1d49c07f4092914d62c65181e5fec18a88318 block: 22437734
- current block number: 22437734

## Description

Config related: Move IFs to the editable string for condition configs (yeet IFs from the automatic resolver).

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22437734 (main branch discovery), not current.

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
    contract SuperchainConfig (0x95703e0982140D16f8ebA6d158FccEde42f04a4C) {
    +++ description: Used to manage global configuration values for multiple OP Chains within a single Superchain network. The SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the Superchain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      receivedPermissions.0.condition:
-        "the (global) 0x95703e0982140D16f8ebA6d158FccEde42f04a4C is paused."
+        "if the (global) 0x95703e0982140D16f8ebA6d158FccEde42f04a4C is paused."
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

Generated with discovered.json: 0x4666937aa7dcf66bd825aedfe7523cf6dc1c2b36

# Diff at Thu, 08 May 2025 08:48:52 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@8e1926142ab0c57cc131de4d8da307e13d9af54d block: 22208467
- current block number: 22437734

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
.../celo/ethereum/.flat/DeputyPauseModule.sol      | 1338 ++++++++++++++++++++
 1 file changed, 1338 insertions(+)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22208467 (main branch discovery), not current.

```diff
    contract PermissionedDisputeGame (0x2bCeB78Fda0d5e3bfA7F4B8c499aa74bDf8D7755) {
    +++ description: Same as FaultDisputeGame, but only two permissioned addresses are designated as proposer and challenger.
      usedTypes.0.arg.0x03682932cec7ce0a3874b19675a6bbc923054a7b321efc7d3835187b172494b6:
+        "v1.6.0 (cannon64)"
    }
```

```diff
    contract FaultDisputeGame (0x876e8eeE292F23F163C9bCA406eDD65bEAEFBEBC) {
    +++ description: Logic of the dispute game. When a state root is proposed, a dispute game contract is deployed. Challengers can use such contracts to challenge the proposed state root.
      usedTypes.0.arg.0x03682932cec7ce0a3874b19675a6bbc923054a7b321efc7d3835187b172494b6:
+        "v1.6.0 (cannon64)"
    }
```

Generated with discovered.json: 0xb3f378b1a0837f1bbfe0384a72ffe5c57850e31e

# Diff at Tue, 29 Apr 2025 08:19:01 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@ef7477af00fe0b57a2f7cacf7e958c12494af662 block: 22208467
- current block number: 22208467

## Description

Field .issuedPermissions is removed from the output as no longer needed. Added 'permissionsConfigHash' due to refactoring of the modelling process (into a separate command).

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22208467 (main branch discovery), not current.

```diff
    contract LivenessModule (0x0454092516c9A4d636d3CAfA1e82161376C8a748) {
    +++ description: used to remove members inactive for 98d while making sure that the threshold remains above 75%. If the number of members falls below 8, the 0x847B5c174615B1B7fDF770882256e2D3E95b9D92 takes ownership of the multisig
      issuedPermissions:
-        [{"permission":"interact","to":"0x24424336F04440b1c28685a38303aC33C9D14a25","description":"can remove members of 0xc2819DC788505Aac350142A7A707BF9D03E3Bd03 inactive for 98d.","via":[]}]
    }
```

```diff
    contract PermissionedDisputeGame (0x2bCeB78Fda0d5e3bfA7F4B8c499aa74bDf8D7755) {
    +++ description: Same as FaultDisputeGame, but only two permissioned addresses are designated as proposer and challenger.
      issuedPermissions:
-        [{"permission":"challenge","to":"0x6b145Ebf66602Ec524b196426B46631259689583","via":[]},{"permission":"propose","to":"0x1204884E697efD929729B9A717Ea14496298A689","via":[]}]
    }
```

```diff
    contract L1ERC721Bridge (0x3C519816C5BdC0a0199147594F83feD4F5847f13) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x4092A77bAF58fef0309452cEaCb09221e556E112","via":[{"address":"0x783A434532Ee94667979213af1711505E8bFE374"}]}]
    }
```

```diff
    contract AddressManager (0x55093104b76FAA602F9d6c35A5FFF576bE78d753) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      issuedPermissions:
-        [{"permission":"interact","to":"0x4092A77bAF58fef0309452cEaCb09221e556E112","description":"set and change address mappings.","via":[{"address":"0x783A434532Ee94667979213af1711505E8bFE374"}]}]
    }
```

```diff
    contract OptimismMintableERC20Factory (0x6f0E4f1EB98A52EfaCF7BE11d48B9d9d6510A906) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x4092A77bAF58fef0309452cEaCb09221e556E112","via":[{"address":"0x783A434532Ee94667979213af1711505E8bFE374"}]}]
    }
```

```diff
    contract SystemConfig (0x89E31965D844a309231B1f17759Ccaf1b7c09861) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      issuedPermissions:
-        [{"permission":"interact","to":"0x4092A77bAF58fef0309452cEaCb09221e556E112","description":"it can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system.","via":[]},{"permission":"sequence","to":"0x0cd08c7f7A96AA9635f761b49216B9eA74C5cA60","via":[]},{"permission":"upgrade","to":"0x4092A77bAF58fef0309452cEaCb09221e556E112","via":[{"address":"0x783A434532Ee94667979213af1711505E8bFE374"}]}]
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
    contract DelayedWETH (0x9c314E8057025F2982aa4B3923Abd741A8e8DE91) {
    +++ description: Contract designed to hold the bonded ETH for each game. It is designed as a wrapper around WETH to allow an owner to function as a backstop if a game would incorrectly distribute funds.
      issuedPermissions:
-        [{"permission":"interact","to":"0xbcA67eE5188efc419c42C91156EcC888b20664f3","description":"can pull funds from the contract in case of emergency.","via":[]},{"permission":"upgrade","to":"0x4092A77bAF58fef0309452cEaCb09221e556E112","via":[{"address":"0x783A434532Ee94667979213af1711505E8bFE374"}]}]
    }
```

```diff
    contract L1StandardBridge (0x9C4955b92F34148dbcfDCD82e9c9eCe5CF2badfe) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x4092A77bAF58fef0309452cEaCb09221e556E112","description":"upgrading the bridge implementation can give access to all funds escrowed therein.","via":[{"address":"0x783A434532Ee94667979213af1711505E8bFE374"}]}]
    }
```

```diff
    contract AnchorStateRegistry (0xa24Bf5Bc02997f63da4e2C7F802067e05a102504) {
    +++ description: Contains the latest confirmed state root that can be used as a starting point in a dispute game.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x4092A77bAF58fef0309452cEaCb09221e556E112","via":[{"address":"0x783A434532Ee94667979213af1711505E8bFE374"}]}]
    }
```

```diff
    contract DelayedWETH (0xa316D42E8Fd98D2Ec364b8bF853d2623E768f95a) {
    +++ description: Contract designed to hold the bonded ETH for each game. It is designed as a wrapper around WETH to allow an owner to function as a backstop if a game would incorrectly distribute funds.
      issuedPermissions:
-        [{"permission":"interact","to":"0x4092A77bAF58fef0309452cEaCb09221e556E112","description":"can pull funds from the contract in case of emergency.","via":[]},{"permission":"upgrade","to":"0x4092A77bAF58fef0309452cEaCb09221e556E112","via":[{"address":"0x783A434532Ee94667979213af1711505E8bFE374"}]}]
    }
```

```diff
    contract SuperchainConfigLocal (0xa440975E5A6BB19Bc3Bee901d909BB24b0f43D33) {
    +++ description: A local contract acting as source of truth for the paused status and the guardian role for the local chain.
      issuedPermissions:
-        [{"permission":"guard","to":"0x6E226fa22e5F19363d231D3FA048aaBa73CC1f47","via":[]},{"permission":"interact","to":"0x95703e0982140D16f8ebA6d158FccEde42f04a4C","description":"act as an override that pauses the SuperchainConfigLocal.","condition":"the (global) 0x95703e0982140D16f8ebA6d158FccEde42f04a4C is paused.","via":[]},{"permission":"upgrade","to":"0x4092A77bAF58fef0309452cEaCb09221e556E112","via":[{"address":"0x783A434532Ee94667979213af1711505E8bFE374"}]}]
    }
```

```diff
    contract OptimismPortal2 (0xc5c5D157928BDBD2ACf6d0777626b6C75a9EAEDC) {
    +++ description: The OptimismPortal contract is the main entry point to deposit funds from L1 to L2. It also allows to prove and finalize withdrawals. It specifies which game type can be used for withdrawals, which currently is the PermissionedDisputeGame.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x4092A77bAF58fef0309452cEaCb09221e556E112","via":[{"address":"0x783A434532Ee94667979213af1711505E8bFE374"}]}]
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
    contract DisputeGameFactory (0xFbAC162162f4009Bb007C6DeBC36B1dAC10aF683) {
    +++ description: The dispute game factory allows the creation of dispute games, used to propose state roots and eventually challenge them.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x4092A77bAF58fef0309452cEaCb09221e556E112","via":[{"address":"0x783A434532Ee94667979213af1711505E8bFE374"}]}]
    }
```

Generated with discovered.json: 0xe220ed9292d8e707b6ef35912a92edaa6cfdf969

# Diff at Fri, 11 Apr 2025 13:15:37 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@b607477490db79d49274f7585039ac7263456118 block: 22208467
- current block number: 22208467

## Description

Config: global mapping updated for op stack prestates.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22208467 (main branch discovery), not current.

```diff
    contract PermissionedDisputeGame (0x2bCeB78Fda0d5e3bfA7F4B8c499aa74bDf8D7755) {
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

```diff
    contract FaultDisputeGame (0x876e8eeE292F23F163C9bCA406eDD65bEAEFBEBC) {
    +++ description: Logic of the dispute game. When a state root is proposed, a dispute game contract is deployed. Challengers can use such contracts to challenge the proposed state root.
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

Generated with discovered.json: 0xc6bfbf9782002f1d1668cd99a53a81f4b7fc89d1

# Diff at Thu, 10 Apr 2025 14:42:18 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@f38a3c9bf359344e4c4cd3006f58271cb8f78d15 block: 22208467
- current block number: 22208467

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22208467 (main branch discovery), not current.

```diff
    contract SuperchainProxyAdmin (0x543bA4AADBAb8f9025686Bd03993043599c6fB04) {
    +++ description: None
      displayName:
-        "ProxyAdmin"
    }
```

Generated with discovered.json: 0xe4f4e4148ea7d08d17ba43eaf24f1693d6cc9a25

# Diff at Fri, 04 Apr 2025 09:43:57 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@b3154c4385e52c9ffc0dab984c207390e5ccc13d block: 22166253
- current block number: 22194735

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

```diff
    contract DisputeGameFactory (0xFbAC162162f4009Bb007C6DeBC36B1dAC10aF683) {
    +++ description: The dispute game factory allows the creation of dispute games, used to propose state roots and eventually challenge them.
      values.permissionedGamesTotal:
-        42
+        74
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
discovery. Values are for block 22166253 (main branch discovery), not current.

```diff
    contract CeloProxyAdminOwner (0x4092A77bAF58fef0309452cEaCb09221e556E112) {
    +++ description: None
      receivedPermissions.12:
+        {"permission":"upgrade","from":"0x9c314E8057025F2982aa4B3923Abd741A8e8DE91","via":[{"address":"0x783A434532Ee94667979213af1711505E8bFE374"}]}
      receivedPermissions.11.from:
-        "0x9c314E8057025F2982aa4B3923Abd741A8e8DE91"
+        "0x3C519816C5BdC0a0199147594F83feD4F5847f13"
      receivedPermissions.10.from:
-        "0x3C519816C5BdC0a0199147594F83feD4F5847f13"
+        "0xa24Bf5Bc02997f63da4e2C7F802067e05a102504"
      receivedPermissions.9.from:
-        "0xa24Bf5Bc02997f63da4e2C7F802067e05a102504"
+        "0x6f0E4f1EB98A52EfaCF7BE11d48B9d9d6510A906"
      receivedPermissions.8.from:
-        "0x6f0E4f1EB98A52EfaCF7BE11d48B9d9d6510A906"
+        "0xFbAC162162f4009Bb007C6DeBC36B1dAC10aF683"
      receivedPermissions.7.from:
-        "0xFbAC162162f4009Bb007C6DeBC36B1dAC10aF683"
+        "0xc5c5D157928BDBD2ACf6d0777626b6C75a9EAEDC"
      receivedPermissions.6.from:
-        "0xc5c5D157928BDBD2ACf6d0777626b6C75a9EAEDC"
+        "0xa440975E5A6BB19Bc3Bee901d909BB24b0f43D33"
      receivedPermissions.5.from:
-        "0xa440975E5A6BB19Bc3Bee901d909BB24b0f43D33"
+        "0xa316D42E8Fd98D2Ec364b8bF853d2623E768f95a"
      receivedPermissions.4.permission:
-        "upgrade"
+        "interact"
      receivedPermissions.4.via:
-        [{"address":"0x783A434532Ee94667979213af1711505E8bFE374"}]
      receivedPermissions.4.description:
+        "can pull funds from the contract in case of emergency."
    }
```

```diff
    contract DelayedWETH (0x9c314E8057025F2982aa4B3923Abd741A8e8DE91) {
    +++ description: Contract designed to hold the bonded ETH for each game. It is designed as a wrapper around WETH to allow an owner to function as a backstop if a game would incorrectly distribute funds.
      issuedPermissions.1:
+        {"permission":"interact","to":"0xbcA67eE5188efc419c42C91156EcC888b20664f3","description":"can pull funds from the contract in case of emergency.","via":[]}
    }
```

```diff
    contract DelayedWETH (0xa316D42E8Fd98D2Ec364b8bF853d2623E768f95a) {
    +++ description: Contract designed to hold the bonded ETH for each game. It is designed as a wrapper around WETH to allow an owner to function as a backstop if a game would incorrectly distribute funds.
      issuedPermissions.1:
+        {"permission":"upgrade","to":"0x4092A77bAF58fef0309452cEaCb09221e556E112","via":[{"address":"0x783A434532Ee94667979213af1711505E8bFE374"}]}
      issuedPermissions.0.permission:
-        "upgrade"
+        "interact"
      issuedPermissions.0.via.0:
-        {"address":"0x783A434532Ee94667979213af1711505E8bFE374"}
      issuedPermissions.0.description:
+        "can pull funds from the contract in case of emergency."
    }
```

```diff
    contract undefined (0xbcA67eE5188efc419c42C91156EcC888b20664f3) {
    +++ description: None
      receivedPermissions:
+        [{"permission":"interact","from":"0x9c314E8057025F2982aa4B3923Abd741A8e8DE91","description":"can pull funds from the contract in case of emergency."}]
    }
```

Generated with discovered.json: 0xb772550f6323acde094961a91b201b34afcfc19d

# Diff at Mon, 31 Mar 2025 10:19:03 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@71ffebe835be10b6d5d09ef65aa19b910de8a2ec block: 22131469
- current block number: 22166253

## Description

sub safe signer change.

## Watched changes

```diff
    contract Safe (0xD1C635987B6Aa287361d08C6461491Fa9df087f2) {
    +++ description: None
      values.$members.2:
+        "0xD8091Ded796FE12A4D202Ca7Ab4DA6212BadC564"
      values.$members.1:
-        "0xD8091Ded796FE12A4D202Ca7Ab4DA6212BadC564"
+        "0xc963AE163C7d1DD4d452EA8d9684c4C24655E1E8"
      values.$members.0:
-        "0xc963AE163C7d1DD4d452EA8d9684c4C24655E1E8"
+        "0x4092A77bAF58fef0309452cEaCb09221e556E112"
      values.multisigThreshold:
-        "2 of 2 (100%)"
+        "2 of 3 (67%)"
    }
```

```diff
    contract DisputeGameFactory (0xFbAC162162f4009Bb007C6DeBC36B1dAC10aF683) {
    +++ description: The dispute game factory allows the creation of dispute games, used to propose state roots and eventually challenge them.
      values.permissionedGamesTotal:
-        4
+        42
    }
```

Generated with discovered.json: 0x6a48b27ed7f493a8bcfa78e134c2a69f80ad426b

# Diff at Thu, 27 Mar 2025 11:14:08 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@8cc2e36080df3a74dfd8475d41c64f46203f5218 block: 22131469
- current block number: 22131469

## Description

Config related: add guardian description details, hide some noisy values, hide AddressManager as spam cat, add proposer / challenger to permissioned opfp chains.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22131469 (main branch discovery), not current.

```diff
    contract AddressManager (0x55093104b76FAA602F9d6c35A5FFF576bE78d753) {
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

Generated with discovered.json: 0xae68a60ee89a55da5e8077e39e70b0cc59ac096c

# Diff at Wed, 26 Mar 2025 13:47:13 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- current block number: 22131469

## Description

Initial discovery: Standard OptiPortal2 opstack chain with new SuperchainConfig setup (local with global override).

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
    contract L1CrossDomainMessenger (0x1AC1181fc4e4F877963680587AEAa2C90D7EbB95)
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
```

```diff
+   Status: CREATED
    contract LivenessGuard (0x24424336F04440b1c28685a38303aC33C9D14a25)
    +++ description: None
```

```diff
+   Status: CREATED
    contract PermissionedDisputeGame (0x2bCeB78Fda0d5e3bfA7F4B8c499aa74bDf8D7755)
    +++ description: Same as FaultDisputeGame, but only two permissioned addresses are designated as proposer and challenger.
```

```diff
+   Status: CREATED
    contract L1ERC721Bridge (0x3C519816C5BdC0a0199147594F83feD4F5847f13)
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
```

```diff
+   Status: CREATED
    contract CeloProxyAdminOwner (0x4092A77bAF58fef0309452cEaCb09221e556E112)
    +++ description: None
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
    contract AddressManager (0x55093104b76FAA602F9d6c35A5FFF576bE78d753)
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
```

```diff
+   Status: CREATED
    contract SuperchainProxyAdminOwner (0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OptimismMintableERC20Factory (0x6f0E4f1EB98A52EfaCF7BE11d48B9d9d6510A906)
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x783A434532Ee94667979213af1711505E8bFE374)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OpFoundationUpgradeSafe (0x847B5c174615B1B7fDF770882256e2D3E95b9D92)
    +++ description: None
```

```diff
+   Status: CREATED
    contract FaultDisputeGame (0x876e8eeE292F23F163C9bCA406eDD65bEAEFBEBC)
    +++ description: Logic of the dispute game. When a state root is proposed, a dispute game contract is deployed. Challengers can use such contracts to challenge the proposed state root.
```

```diff
+   Status: CREATED
    contract SystemConfig (0x89E31965D844a309231B1f17759Ccaf1b7c09861)
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
```

```diff
+   Status: CREATED
    contract MIPS (0x8A12E1754f729C0856E2E32D4821577f0B245bfA)
    +++ description: The MIPS contract is used to execute the final step of the dispute game which objectively determines the winner of the dispute.
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
    contract DelayedWETH (0x9c314E8057025F2982aa4B3923Abd741A8e8DE91)
    +++ description: Contract designed to hold the bonded ETH for each game. It is designed as a wrapper around WETH to allow an owner to function as a backstop if a game would incorrectly distribute funds.
```

```diff
+   Status: CREATED
    contract L1StandardBridge (0x9C4955b92F34148dbcfDCD82e9c9eCe5CF2badfe)
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
```

```diff
+   Status: CREATED
    contract Celo Multisig 2 (0x9Eb44Da23433b5cAA1c87e35594D15FcEb08D34d)
    +++ description: None
```

```diff
+   Status: CREATED
    contract AnchorStateRegistry (0xa24Bf5Bc02997f63da4e2C7F802067e05a102504)
    +++ description: Contains the latest confirmed state root that can be used as a starting point in a dispute game.
```

```diff
+   Status: CREATED
    contract DelayedWETH (0xa316D42E8Fd98D2Ec364b8bF853d2623E768f95a)
    +++ description: Contract designed to hold the bonded ETH for each game. It is designed as a wrapper around WETH to allow an owner to function as a backstop if a game would incorrectly distribute funds.
```

```diff
+   Status: CREATED
    contract SuperchainConfigLocal (0xa440975E5A6BB19Bc3Bee901d909BB24b0f43D33)
    +++ description: A local contract acting as source of truth for the paused status and the guardian role for the local chain.
```

```diff
+   Status: CREATED
    contract Celo Multisig 1 (0xC03172263409584f7860C25B6eB4985f0f6F4636)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Optimism Security Council (0xc2819DC788505Aac350142A7A707BF9D03E3Bd03)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OptimismPortal2 (0xc5c5D157928BDBD2ACf6d0777626b6C75a9EAEDC)
    +++ description: The OptimismPortal contract is the main entry point to deposit funds from L1 to L2. It also allows to prove and finalize withdrawals. It specifies which game type can be used for withdrawals, which currently is the PermissionedDisputeGame.
```

```diff
+   Status: CREATED
    contract DeputyGuardianModule (0xc6901F65369FC59fC1B4D6D6bE7A2318Ff38dB5B)
    +++ description: allows the 0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A, called the deputy guardian, to act on behalf of the Gnosis Safe.
```

```diff
+   Status: CREATED
    contract Safe (0xD1C635987B6Aa287361d08C6461491Fa9df087f2)
    +++ description: None
```

```diff
+   Status: CREATED
    contract AddressManager (0xdE1FCfB0851916CA5101820A69b13a4E276bd81F)
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
```

```diff
+   Status: CREATED
    contract PreimageOracle (0xfaB0F466955D87e596Ca87E20c505bB6470D0DC4)
    +++ description: The PreimageOracle contract is used to load the required data from L1 for a dispute game.
```

```diff
+   Status: CREATED
    contract DisputeGameFactory (0xFbAC162162f4009Bb007C6DeBC36B1dAC10aF683)
    +++ description: The dispute game factory allows the creation of dispute games, used to propose state roots and eventually challenge them.
```
