Generated with discovered.json: 0x57253bc4083373787d0168fb90f6f7741632c5cf

# Diff at Fri, 25 Jul 2025 15:49:51 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@85b717d6efe0c0a7691beb49532a0ce49bb7634a block: 22975693
- current block number: 22994605

## Description

Conduit: Optiportal2 upgrade (permissioned gametype). All contracts are using standard implementations.

absolute prestate: v1.6.0 (cannon64) - does not use alt-DA commitments

the finality config is particularly short with ~1h state root finality:
proofMaturityDelaySeconds = 1h
disputeGameFinalityDelaySeconds = 30min
maxClockDuration = 30min

## Watched changes

```diff
    contract L1CrossDomainMessenger (0x11dd2d9B5ec142dbAFBEFEA82a75985Eae4e12b0) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      sourceHashes.1:
-        "0x1cc8a3b7de3d2c54c4706bb3f3015714d3b56647fc9fbfd6f8b068f5f63c1c25"
+        "0x03bcdc719cb7bd0a1377c01bb50b30a6122b308f673b7d7b15a3bb8628e6bd8c"
      values.$implementation:
-        "eth:0xD3494713A5cfaD3F5359379DfA074E2Ac8C6Fd65"
+        "eth:0x5D5a095665886119693F0B41d8DFeE78da033e8B"
      values.$pastUpgrades.10:
+        ["2025-07-24T14:01:11.000Z","0xd75f116a171758a602f7cfb27520a1cd3c741822834c3b23db0a29a879da04fc",["eth:0x3eA6084748ED1b2A9B5D4426181F1ad8C93F6231"]]
      values.$pastUpgrades.11:
+        ["2025-07-24T14:01:11.000Z","0xd75f116a171758a602f7cfb27520a1cd3c741822834c3b23db0a29a879da04fc",["eth:0x5D5a095665886119693F0B41d8DFeE78da033e8B"]]
      values.$upgradeCount:
-        10
+        12
      values.version:
-        "2.3.0"
+        "2.6.0"
      values.ENCODING_OVERHEAD:
+        260
      values.FLOOR_CALLDATA_OVERHEAD:
+        40
      values.TX_BASE_GAS:
+        21000
      implementationNames.eth:0xD3494713A5cfaD3F5359379DfA074E2Ac8C6Fd65:
-        "L1CrossDomainMessenger"
      implementationNames.eth:0x5D5a095665886119693F0B41d8DFeE78da033e8B:
+        "L1CrossDomainMessenger"
    }
```

```diff
    contract ProxyAdmin (0x27ff92b30Cae00dABCF8045cc68fc9dcB67C5019) {
    +++ description: None
      directlyReceivedPermissions.1:
+        {"permission":"upgrade","from":"eth:0x0c0105334a50Db16B51B2911C9956539753A2CF8","role":"admin"}
      directlyReceivedPermissions.5:
+        {"permission":"upgrade","from":"eth:0x535fA600a9Cb3e0731a18B0C16b39ad461B63bDb","role":"admin"}
      directlyReceivedPermissions.6:
+        {"permission":"upgrade","from":"eth:0x5c30F525Ca2F10377F352B349fca9a6b2AA1cA2E","role":"admin"}
      directlyReceivedPermissions.6:
-        {"permission":"upgrade","from":"eth:0x909E51211e959339EFb14b36f5A50955a8ae3770","role":"admin"}
    }
```

```diff
    contract L1ERC721Bridge (0x2e7d7B188D663F38c2E4fF9C59328458A2D676F0) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      sourceHashes.1:
-        "0x482ec6e91304ac39a3fb4505634427bddfddee23b8e93a4f7f995ca5083ae3c3"
+        "0x28669b49da3effd51f0f9424ca9cdd455c5b9327c09a40c65fc06f114a6eb837"
      values.$implementation:
-        "eth:0xAE2AF01232a6c4a4d3012C5eC5b1b35059caF10d"
+        "eth:0x7aE1d3BD877a4C5CA257404ce26BE93A02C98013"
      values.$pastUpgrades.7:
+        ["2025-07-24T14:01:11.000Z","0xd75f116a171758a602f7cfb27520a1cd3c741822834c3b23db0a29a879da04fc",["eth:0x276d3730f219f7ec22274f7263180b8452B46d47"]]
      values.$pastUpgrades.8:
+        ["2025-07-24T14:01:11.000Z","0xd75f116a171758a602f7cfb27520a1cd3c741822834c3b23db0a29a879da04fc",["eth:0x7aE1d3BD877a4C5CA257404ce26BE93A02C98013"]]
      values.$upgradeCount:
-        7
+        9
      values.version:
-        "2.1.0"
+        "2.4.0"
      implementationNames.eth:0xAE2AF01232a6c4a4d3012C5eC5b1b35059caF10d:
-        "L1ERC721Bridge"
      implementationNames.eth:0x7aE1d3BD877a4C5CA257404ce26BE93A02C98013:
+        "L1ERC721Bridge"
    }
```

```diff
    contract L1StandardBridge (0x4082C9647c098a6493fb499EaE63b5ce3259c574) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      sourceHashes.1:
-        "0x1010ff7f40ab4d53e6d9996aefa04423dabe9d0e22fac2d02b330ed3aa2c5740"
+        "0x4e15d99844dc5a4304c2396a66c95ec41218ea311c8e524b118fad7beed0bb53"
      values.$implementation:
-        "eth:0x64B5a5Ed26DCb17370Ff4d33a8D503f0fbD06CfF"
+        "eth:0x0b09ba359A106C9ea3b181CBc5F394570c7d2a7A"
      values.version:
-        "2.1.0"
+        "2.3.0"
      implementationNames.eth:0x64B5a5Ed26DCb17370Ff4d33a8D503f0fbD06CfF:
-        "L1StandardBridge"
      implementationNames.eth:0x0b09ba359A106C9ea3b181CBc5F394570c7d2a7A:
+        "L1StandardBridge"
    }
```

```diff
    contract Conduit Multisig 1 (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      receivedPermissions.0:
-        {"permission":"challenge","from":"eth:0x909E51211e959339EFb14b36f5A50955a8ae3770","role":".challenger"}
      receivedPermissions.1.role:
-        ".CHALLENGER"
+        ".challenger"
      receivedPermissions.1.from:
-        "eth:0x909E51211e959339EFb14b36f5A50955a8ae3770"
+        "eth:0x7326889874BBFE3fE6364BE73f0FFcDBD3dC827C"
      receivedPermissions.3:
-        {"permission":"guard","from":"eth:0x787A0ACaB02437c60Aafb1a29167A3609801e320","role":".guardian"}
      receivedPermissions.4.description:
+        "can pull funds from the contract in case of emergency."
      receivedPermissions.4.role:
-        ".GUARDIAN"
+        ".owner"
      receivedPermissions.4.from:
-        "eth:0x787A0ACaB02437c60Aafb1a29167A3609801e320"
+        "eth:0x5c30F525Ca2F10377F352B349fca9a6b2AA1cA2E"
      receivedPermissions.4.permission:
-        "guard"
+        "interact"
      receivedPermissions.6:
+        {"permission":"upgrade","from":"eth:0x0c0105334a50Db16B51B2911C9956539753A2CF8","role":"admin","via":[{"address":"eth:0x27ff92b30Cae00dABCF8045cc68fc9dcB67C5019"}]}
      receivedPermissions.10:
+        {"permission":"upgrade","from":"eth:0x535fA600a9Cb3e0731a18B0C16b39ad461B63bDb","role":"admin","via":[{"address":"eth:0x27ff92b30Cae00dABCF8045cc68fc9dcB67C5019"}]}
      receivedPermissions.11:
+        {"permission":"upgrade","from":"eth:0x5c30F525Ca2F10377F352B349fca9a6b2AA1cA2E","role":"admin","via":[{"address":"eth:0x27ff92b30Cae00dABCF8045cc68fc9dcB67C5019"}]}
      receivedPermissions.13:
-        {"permission":"upgrade","from":"eth:0x909E51211e959339EFb14b36f5A50955a8ae3770","role":"admin","via":[{"address":"eth:0x27ff92b30Cae00dABCF8045cc68fc9dcB67C5019"}]}
    }
```

```diff
    contract OptimismMintableERC20Factory (0x5DbBa17eb2458A05AbBA79E650dF607F0681Cc6a) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintableERC20 as this chain's representation of a token on the host chain, or vice-versa.
      sourceHashes.1:
-        "0x4c5ac4e53576924cabbd2a471f368a541bc3f4b1f53fa41a389692fcc62f6176"
+        "0x9650b4bba6299e410f01a369a95a2c57e1c3ca35f0d80c13f4f59fc468f370e5"
      values.$implementation:
-        "eth:0xE01efbeb1089D1d1dB9c6c8b135C934C0734c846"
+        "eth:0x5493f4677A186f64805fe7317D6993ba4863988F"
      values.$pastUpgrades.6:
+        ["2025-07-24T14:01:11.000Z","0xd75f116a171758a602f7cfb27520a1cd3c741822834c3b23db0a29a879da04fc",["eth:0x5493f4677A186f64805fe7317D6993ba4863988F"]]
      values.$upgradeCount:
-        6
+        7
      values.version:
-        "1.9.0"
+        "1.10.1"
      implementationNames.eth:0xE01efbeb1089D1d1dB9c6c8b135C934C0734c846:
-        "OptimismMintableERC20Factory"
      implementationNames.eth:0x5493f4677A186f64805fe7317D6993ba4863988F:
+        "OptimismMintableERC20Factory"
    }
```

```diff
    EOA  (0x75ACb7ae6C76B3f5cA049431FE2c0797dD002b90) {
    +++ description: None
      receivedPermissions.0:
-        {"permission":"propose","from":"eth:0x909E51211e959339EFb14b36f5A50955a8ae3770","role":".proposer"}
      receivedPermissions.1.role:
-        ".PROPOSER"
+        ".proposer"
      receivedPermissions.1.from:
-        "eth:0x909E51211e959339EFb14b36f5A50955a8ae3770"
+        "eth:0x7326889874BBFE3fE6364BE73f0FFcDBD3dC827C"
    }
```

```diff
    contract OptimismPortal2 (0x787A0ACaB02437c60Aafb1a29167A3609801e320) {
    +++ description: The OptimismPortal contract is the main entry point to deposit funds from L1 to L2. It also allows to prove and finalize withdrawals. It specifies which game type can be used for withdrawals, which currently is the PermissionedDisputeGame.
      name:
-        "OptimismPortal"
+        "OptimismPortal2"
      template:
-        "opstack/OptimismPortal"
+        "opstack/OptimismPortal2"
      sourceHashes.1:
-        "0xe35fb7bc0433439337b3eadda3d6fb7991918162f62a337a695e8c7f948cdd35"
+        "0xc483ef9e0a5ec2a0450732e743b3784de0cd3876b8fadfce14c0805a0846d26b"
      description:
-        "The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals."
+        "The OptimismPortal contract is the main entry point to deposit funds from L1 to L2. It also allows to prove and finalize withdrawals. It specifies which game type can be used for withdrawals, which currently is the PermissionedDisputeGame."
      values.$implementation:
-        "eth:0x2D778797049FE9259d947D1ED8e5442226dFB589"
+        "eth:0xaa5b13609Fd0a48b3B20202B25494F58F3Ff89f4"
      values.$pastUpgrades.5:
+        ["2025-07-24T14:01:11.000Z","0xd75f116a171758a602f7cfb27520a1cd3c741822834c3b23db0a29a879da04fc",["eth:0xd81f43eDBCAcb4c29a9bA38a13Ee5d79278270cC"]]
      values.$pastUpgrades.6:
+        ["2025-07-24T14:01:11.000Z","0xd75f116a171758a602f7cfb27520a1cd3c741822834c3b23db0a29a879da04fc",["eth:0xdc78882AB9F77C8821327D586547a80C2D712A24"]]
      values.$pastUpgrades.7:
+        ["2025-07-24T14:01:11.000Z","0xd75f116a171758a602f7cfb27520a1cd3c741822834c3b23db0a29a879da04fc",["eth:0xdc78882AB9F77C8821327D586547a80C2D712A24"]]
      values.$pastUpgrades.8:
+        ["2025-07-24T14:01:11.000Z","0xd75f116a171758a602f7cfb27520a1cd3c741822834c3b23db0a29a879da04fc",["eth:0xaa5b13609Fd0a48b3B20202B25494F58F3Ff89f4"]]
      values.$upgradeCount:
-        5
+        9
      values.GUARDIAN:
-        "eth:0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      values.L2_ORACLE:
-        "eth:0x909E51211e959339EFb14b36f5A50955a8ae3770"
      values.l2Oracle:
-        "eth:0x909E51211e959339EFb14b36f5A50955a8ae3770"
      values.SYSTEM_CONFIG:
-        "eth:0xF761Cc49bB127AB666899b41CDC4E62fA50cD9ca"
      values.version:
-        "2.5.0"
+        "3.14.0"
      values.disputeGameFactory:
+        "eth:0x0c0105334a50Db16B51B2911C9956539753A2CF8"
      values.disputeGameFinalityDelaySeconds:
+        1800
      values.proofMaturityDelaySeconds:
+        3600
      values.RespectedGameString:
+        "PermissionedDisputeGame"
+++ severity: HIGH
      values.respectedGameType:
+        1
      values.respectedGameTypeUpdatedAt:
+        1753365671
      implementationNames.eth:0x2D778797049FE9259d947D1ED8e5442226dFB589:
-        "OptimismPortal"
      implementationNames.eth:0xaa5b13609Fd0a48b3B20202B25494F58F3Ff89f4:
+        "OptimismPortal2"
      fieldMeta:
+        {"respectedGameType":{"severity":"HIGH"},"paused":{"severity":"HIGH","description":"Whether the contract is paused or not. Determined by the SuperchainConfig contract PAUSED_SLOT. Here it pauses withdrawals. If this is paused, also the L1CrossDomainMessenger and ERC-20, ERC-721 deposits are paused."}}
      usedTypes:
+        [{"typeCaster":"Mapping","arg":{"0":"FaultDisputeGame","1":"PermissionedDisputeGame","1337":"KailuaGame"}}]
    }
```

```diff
-   Status: DELETED
    contract L2OutputOracle (0x909E51211e959339EFb14b36f5A50955a8ae3770)
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
```

```diff
    contract SystemConfig (0xF761Cc49bB127AB666899b41CDC4E62fA50cD9ca) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      sourceHashes.1:
-        "0xc7135dbd2a53312d36df3f3ee91ce0a5a459ab8fc7725880a3a9c55a5fa0ed6c"
+        "0x921de6fc906d159fdcef862d2b9559063f5e7b9b7588fa5f33153360ddf296e7"
      values.$implementation:
-        "eth:0xAB9d6cB7A427c0765163A7f45BB91cAfe5f2D375"
+        "eth:0x340f923E5c7cbB2171146f64169EC9d5a9FfE647"
      values.$pastUpgrades.6:
+        ["2025-07-24T14:01:11.000Z","0xd75f116a171758a602f7cfb27520a1cd3c741822834c3b23db0a29a879da04fc",["eth:0xd81f43eDBCAcb4c29a9bA38a13Ee5d79278270cC"]]
      values.$pastUpgrades.7:
+        ["2025-07-24T14:01:11.000Z","0xd75f116a171758a602f7cfb27520a1cd3c741822834c3b23db0a29a879da04fc",["eth:0xAB9d6cB7A427c0765163A7f45BB91cAfe5f2D375"]]
      values.$pastUpgrades.8:
+        ["2025-07-24T14:01:11.000Z","0xd75f116a171758a602f7cfb27520a1cd3c741822834c3b23db0a29a879da04fc",["eth:0x760C48C62A85045A6B69f07F4a9f22868659CbCc"]]
      values.$pastUpgrades.9:
+        ["2025-07-24T14:01:11.000Z","0xd75f116a171758a602f7cfb27520a1cd3c741822834c3b23db0a29a879da04fc",["eth:0x340f923E5c7cbB2171146f64169EC9d5a9FfE647"]]
      values.$upgradeCount:
-        6
+        10
      values.basefeeScalar:
-        0
+        68400
      values.disputeGameFactory:
-        "eth:0x0000000000000000000000000000000000000000"
+        "eth:0x0c0105334a50Db16B51B2911C9956539753A2CF8"
      values.gasPayingToken:
-        {"addr_":"eth:0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE","decimals_":18}
      values.gasPayingTokenName:
-        "Ether"
      values.gasPayingTokenSymbol:
-        "ETH"
      values.isCustomGasToken:
-        false
      values.version:
-        "2.3.0"
+        "2.5.0"
      values.getAddresses:
+        {"l1CrossDomainMessenger":"eth:0x11dd2d9B5ec142dbAFBEFEA82a75985Eae4e12b0","l1ERC721Bridge":"eth:0x2e7d7B188D663F38c2E4fF9C59328458A2D676F0","l1StandardBridge":"eth:0x4082C9647c098a6493fb499EaE63b5ce3259c574","disputeGameFactory":"eth:0x0c0105334a50Db16B51B2911C9956539753A2CF8","optimismPortal":"eth:0x787A0ACaB02437c60Aafb1a29167A3609801e320","optimismMintableERC20Factory":"eth:0x5DbBa17eb2458A05AbBA79E650dF607F0681Cc6a"}
      values.operatorFeeConstant:
+        0
      values.operatorFeeScalar:
+        0
      implementationNames.eth:0xAB9d6cB7A427c0765163A7f45BB91cAfe5f2D375:
-        "SystemConfig"
      implementationNames.eth:0x340f923E5c7cbB2171146f64169EC9d5a9FfE647:
+        "SystemConfig"
    }
```

```diff
+   Status: CREATED
    contract DisputeGameFactory (0x0c0105334a50Db16B51B2911C9956539753A2CF8)
    +++ description: The dispute game factory allows the creation of dispute games, used to propose state roots and eventually challenge them.
```

```diff
+   Status: CREATED
    contract MIPS (0x17c64e93846935Dfbd281a5540a14d4Cd67195F7)
    +++ description: The MIPS contract is used to execute the final step of the dispute game which objectively determines the winner of the dispute.
```

```diff
+   Status: CREATED
    contract AnchorStateRegistry (0x535fA600a9Cb3e0731a18B0C16b39ad461B63bDb)
    +++ description: Contains the latest confirmed state root that can be used as a starting point in a dispute game.
```

```diff
+   Status: CREATED
    contract DelayedWETH (0x5c30F525Ca2F10377F352B349fca9a6b2AA1cA2E)
    +++ description: Contract designed to hold the bonded ETH for each game. It is designed as a wrapper around WETH to allow an owner to function as a backstop if a game would incorrectly distribute funds.
```

```diff
+   Status: CREATED
    contract PermissionedDisputeGame (0x7326889874BBFE3fE6364BE73f0FFcDBD3dC827C)
    +++ description: Same as FaultDisputeGame, but only two permissioned addresses are designated as proposer and challenger.
```

```diff
+   Status: CREATED
    contract PreimageOracle (0xeE74fd716Edbfe6575ecc18B39F181b4De79fA7A)
    +++ description: The PreimageOracle contract is used to load the required data from L1 for a dispute game.
```

## Source code changes

```diff
.../AnchorStateRegistry/AnchorStateRegistry.sol    |  568 +++
 .../ethereum/.flat/AnchorStateRegistry/Proxy.p.sol |  200 +
 .../ethereum/.flat/DelayedWETH/DelayedWETH.sol     |  608 +++
 .../aevo/ethereum/.flat/DelayedWETH/Proxy.p.sol    |  200 +
 .../DisputeGameFactory/DisputeGameFactory.sol      | 1482 +++++++
 .../ethereum/.flat/DisputeGameFactory/Proxy.p.sol  |  200 +
 .../L1CrossDomainMessenger.sol                     |  736 +++-
 .../L1ERC721Bridge/L1ERC721Bridge.sol              |  418 +-
 .../L1StandardBridge/L1StandardBridge.sol          |  508 ++-
 .../L2OutputOracle/L2OutputOracle.sol => /dev/null |  679 ----
 .../src/projects/aevo/ethereum/.flat/MIPS.sol      | 2515 ++++++++++++
 .../OptimismMintableERC20Factory.sol               |   30 +-
 .../OptimismPortal/Proxy.p.sol => /dev/null        |  211 -
 .../OptimismPortal2/OptimismPortal2.sol}           |  926 +++--
 .../OptimismPortal2}/Proxy.p.sol                   |    0
 .../ethereum/.flat/PermissionedDisputeGame.sol     | 4121 ++++++++++++++++++++
 .../aevo/ethereum/.flat/PreimageOracle.sol         | 1311 +++++++
 .../SystemConfig/SystemConfig.sol                  | 1439 +------
 18 files changed, 13121 insertions(+), 3031 deletions(-)
```

Generated with discovered.json: 0xad2837fa5e402192aa66c74e60b314a15a244bce

# Diff at Tue, 22 Jul 2025 15:49:05 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@83bf55f537ce86d3d1dac9f1a98f31f9169b801f block: 22895931
- current block number: 22975693

## Description

Conduit: Upgrade to known OP stack contracts. (no OptiPortal2 yet)

## Watched changes

```diff
    contract L1CrossDomainMessenger (0x11dd2d9B5ec142dbAFBEFEA82a75985Eae4e12b0) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      sourceHashes.1:
-        "0xebfb36a18bcaa176678925149b43fdc5f9f943d98a6405ae1cbc26f4c168ff88"
+        "0x1cc8a3b7de3d2c54c4706bb3f3015714d3b56647fc9fbfd6f8b068f5f63c1c25"
      values.$implementation:
-        "eth:0x8CfF5bDb1B428B979E3D87087dA8549A28065DDB"
+        "eth:0xD3494713A5cfaD3F5359379DfA074E2Ac8C6Fd65"
      values.$pastUpgrades.6:
+        ["2025-07-21T13:22:47.000Z","0xc875094b76d46a0955ad6d560e6154806538855e429feac498dbc03ec2c1af24",["eth:0x6322C2f2D6a4305Fc033754d486A5A067Ee5F9b1"]]
      values.$pastUpgrades.7:
+        ["2025-07-21T13:22:47.000Z","0xc875094b76d46a0955ad6d560e6154806538855e429feac498dbc03ec2c1af24",["eth:0xD3494713A5cfaD3F5359379DfA074E2Ac8C6Fd65"]]
      values.$pastUpgrades.8:
+        ["2025-07-21T14:46:11.000Z","0x216d7eeeaafd2a8fec6f782d288e7c343d09ebed89cceddc1fa3aa3d8d2808b1",["eth:0xd81f43eDBCAcb4c29a9bA38a13Ee5d79278270cC"]]
      values.$pastUpgrades.9:
+        ["2025-07-21T14:46:11.000Z","0x216d7eeeaafd2a8fec6f782d288e7c343d09ebed89cceddc1fa3aa3d8d2808b1",["eth:0xD3494713A5cfaD3F5359379DfA074E2Ac8C6Fd65"]]
      values.$upgradeCount:
-        6
+        10
      values.version:
-        "1.4.1"
+        "2.3.0"
      values.otherMessenger:
+        "eth:0x4200000000000000000000000000000000000007"
      values.paused:
+        false
      values.portal:
+        "eth:0x787A0ACaB02437c60Aafb1a29167A3609801e320"
      values.superchainConfig:
+        "eth:0x097f99768A0a4a0A81bAbbCB1ea18193bA9D53cC"
      implementationNames.eth:0x8CfF5bDb1B428B979E3D87087dA8549A28065DDB:
-        "L1CrossDomainMessenger"
      implementationNames.eth:0xD3494713A5cfaD3F5359379DfA074E2Ac8C6Fd65:
+        "L1CrossDomainMessenger"
    }
```

```diff
    contract ProxyAdmin (0x27ff92b30Cae00dABCF8045cc68fc9dcB67C5019) {
    +++ description: None
      directlyReceivedPermissions.2:
+        {"permission":"upgrade","from":"eth:0x2e7d7B188D663F38c2E4fF9C59328458A2D676F0","role":"admin"}
      directlyReceivedPermissions.4:
+        {"permission":"upgrade","from":"eth:0x5DbBa17eb2458A05AbBA79E650dF607F0681Cc6a","role":"admin"}
    }
```

```diff
    contract L1StandardBridge (0x4082C9647c098a6493fb499EaE63b5ce3259c574) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      sourceHashes.1:
-        "0x79abdbd90460fe2ac0535b5cb7b4c45284322b49a0a090d1c509cdaf35dbc87e"
+        "0x1010ff7f40ab4d53e6d9996aefa04423dabe9d0e22fac2d02b330ed3aa2c5740"
      values.$implementation:
-        "eth:0x20F1380A78492227A9B2366242335D684aF22507"
+        "eth:0x64B5a5Ed26DCb17370Ff4d33a8D503f0fbD06CfF"
      values.version:
-        "1.1.1"
+        "2.1.0"
      values.otherBridge:
+        "eth:0x4200000000000000000000000000000000000010"
      values.paused:
+        false
      values.superchainConfig:
+        "eth:0x097f99768A0a4a0A81bAbbCB1ea18193bA9D53cC"
      implementationNames.eth:0x20F1380A78492227A9B2366242335D684aF22507:
-        "L1StandardBridge"
      implementationNames.eth:0x64B5a5Ed26DCb17370Ff4d33a8D503f0fbD06CfF:
+        "L1StandardBridge"
    }
```

```diff
    contract Conduit Multisig 1 (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      receivedPermissions.0:
+        {"permission":"challenge","from":"eth:0x909E51211e959339EFb14b36f5A50955a8ae3770","role":".challenger"}
      receivedPermissions.2:
+        {"permission":"guard","from":"eth:0x097f99768A0a4a0A81bAbbCB1ea18193bA9D53cC","role":".guardian"}
      receivedPermissions.3:
+        {"permission":"guard","from":"eth:0x787A0ACaB02437c60Aafb1a29167A3609801e320","role":".guardian"}
      receivedPermissions.7:
+        {"permission":"upgrade","from":"eth:0x097f99768A0a4a0A81bAbbCB1ea18193bA9D53cC","role":"admin","via":[{"address":"eth:0xb4899FF43Ae727B1E9CB19AC44660e4A43Fad0b5"}]}
      receivedPermissions.9:
+        {"permission":"upgrade","from":"eth:0x2e7d7B188D663F38c2E4fF9C59328458A2D676F0","role":"admin","via":[{"address":"eth:0x27ff92b30Cae00dABCF8045cc68fc9dcB67C5019"}]}
      receivedPermissions.11:
+        {"permission":"upgrade","from":"eth:0x5DbBa17eb2458A05AbBA79E650dF607F0681Cc6a","role":"admin","via":[{"address":"eth:0x27ff92b30Cae00dABCF8045cc68fc9dcB67C5019"}]}
      directlyReceivedPermissions.1:
+        {"permission":"act","from":"eth:0xb4899FF43Ae727B1E9CB19AC44660e4A43Fad0b5","role":".owner"}
    }
```

```diff
    EOA  (0x75ACb7ae6C76B3f5cA049431FE2c0797dD002b90) {
    +++ description: None
      receivedPermissions.0:
+        {"permission":"propose","from":"eth:0x909E51211e959339EFb14b36f5A50955a8ae3770","role":".proposer"}
    }
```

```diff
    contract OptimismPortal (0x787A0ACaB02437c60Aafb1a29167A3609801e320) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      sourceHashes.1:
-        "0xd7fe53899c31d6d8e73b6724694736dc3c3c4ebc8f4ddbe989fe9d3dba26692d"
+        "0xe35fb7bc0433439337b3eadda3d6fb7991918162f62a337a695e8c7f948cdd35"
      values.$implementation:
-        "eth:0x098927F692C86fA1722115652b9d2d7BE8cBa6D3"
+        "eth:0x2D778797049FE9259d947D1ED8e5442226dFB589"
      values.$pastUpgrades.3:
+        ["2025-07-21T13:22:47.000Z","0xc875094b76d46a0955ad6d560e6154806538855e429feac498dbc03ec2c1af24",["eth:0x6322C2f2D6a4305Fc033754d486A5A067Ee5F9b1"]]
      values.$pastUpgrades.4:
+        ["2025-07-21T13:22:47.000Z","0xc875094b76d46a0955ad6d560e6154806538855e429feac498dbc03ec2c1af24",["eth:0x2D778797049FE9259d947D1ED8e5442226dFB589"]]
      values.$upgradeCount:
-        3
+        5
      values.version:
-        "1.7.2"
+        "2.5.0"
      values.guardian:
+        "eth:0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      values.l2Oracle:
+        "eth:0x909E51211e959339EFb14b36f5A50955a8ae3770"
      values.superchainConfig:
+        "eth:0x097f99768A0a4a0A81bAbbCB1ea18193bA9D53cC"
      values.systemConfig:
+        "eth:0xF761Cc49bB127AB666899b41CDC4E62fA50cD9ca"
      implementationNames.eth:0x098927F692C86fA1722115652b9d2d7BE8cBa6D3:
-        "OptimismPortal"
      implementationNames.eth:0x2D778797049FE9259d947D1ED8e5442226dFB589:
+        "OptimismPortal"
    }
```

```diff
    contract L2OutputOracle (0x909E51211e959339EFb14b36f5A50955a8ae3770) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      sourceHashes.1:
-        "0xcca8986d0789aa489ba57cd234e886bd92cb5a0d477e1f5ae5e6e030e15fb183"
+        "0x025c187b0231be4785898f25f98d749f953f5d06781772aef242812e2ecf52e3"
      values.$implementation:
-        "eth:0x0af92E6944900abA4B9BAC1417bA13ED6F45c27f"
+        "eth:0xF243BEd163251380e78068d317ae10f26042B292"
      values.$pastUpgrades.4:
+        ["2025-07-21T13:22:47.000Z","0xc875094b76d46a0955ad6d560e6154806538855e429feac498dbc03ec2c1af24",["eth:0x6322C2f2D6a4305Fc033754d486A5A067Ee5F9b1"]]
      values.$pastUpgrades.5:
+        ["2025-07-21T13:22:47.000Z","0xc875094b76d46a0955ad6d560e6154806538855e429feac498dbc03ec2c1af24",["eth:0xF243BEd163251380e78068d317ae10f26042B292"]]
      values.$upgradeCount:
-        4
+        6
      values.version:
-        "1.3.1"
+        "1.8.0"
+++ severity: HIGH
      values.challenger:
+        "eth:0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      values.finalizationPeriodSeconds:
+        3600
      values.l2BlockTime:
+        10
+++ severity: HIGH
      values.proposer:
+        "eth:0x75ACb7ae6C76B3f5cA049431FE2c0797dD002b90"
      values.submissionInterval:
+        600
      implementationNames.eth:0x0af92E6944900abA4B9BAC1417bA13ED6F45c27f:
-        "L2OutputOracle"
      implementationNames.eth:0xF243BEd163251380e78068d317ae10f26042B292:
+        "L2OutputOracle"
    }
```

```diff
    contract SystemConfig (0xF761Cc49bB127AB666899b41CDC4E62fA50cD9ca) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      sourceHashes.1:
-        "0x29908eb7685943ff431cd384af851ce36a30997bbad880f9b4385bfc3abb86a2"
+        "0xc7135dbd2a53312d36df3f3ee91ce0a5a459ab8fc7725880a3a9c55a5fa0ed6c"
      values.$implementation:
-        "eth:0xA872bca05c9F8A97CC36D879e43B33dB8ed7b69E"
+        "eth:0xAB9d6cB7A427c0765163A7f45BB91cAfe5f2D375"
      values.$pastUpgrades.3:
+        ["2025-07-21T13:22:47.000Z","0xc875094b76d46a0955ad6d560e6154806538855e429feac498dbc03ec2c1af24",["eth:0x6322C2f2D6a4305Fc033754d486A5A067Ee5F9b1"]]
      values.$pastUpgrades.4:
+        ["2025-07-21T13:22:47.000Z","0xc875094b76d46a0955ad6d560e6154806538855e429feac498dbc03ec2c1af24",["eth:0xba2492e52F45651B60B8B38d4Ea5E2390C64Ffb1"]]
      values.$pastUpgrades.5:
+        ["2025-07-21T14:46:11.000Z","0x216d7eeeaafd2a8fec6f782d288e7c343d09ebed89cceddc1fa3aa3d8d2808b1",["eth:0xAB9d6cB7A427c0765163A7f45BB91cAfe5f2D375"]]
      values.$upgradeCount:
-        3
+        6
      values.version:
-        "1.3.1"
+        "2.3.0"
      values.basefeeScalar:
+        0
      values.BATCH_INBOX_SLOT:
+        "0x71ac12829d66ee73d8d95bff50b3589745ce57edae70a3fb111a2342464dc597"
      values.batchInbox:
+        "eth:0x253887577420Cb7e7418cD4d50147743c8041b28"
      values.blobbasefeeScalar:
+        0
      values.DISPUTE_GAME_FACTORY_SLOT:
+        "0x52322a25d9f59ea17656545543306b7aef62bc0cc53a0e65ccfa0c75b97aa906"
      values.disputeGameFactory:
+        "eth:0x0000000000000000000000000000000000000000"
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
      values.L1_CROSS_DOMAIN_MESSENGER_SLOT:
+        "0x383f291819e6d54073bc9a648251d97421076bdd101933c0c022219ce9580636"
      values.L1_ERC_721_BRIDGE_SLOT:
+        "0x46adcbebc6be8ce551740c29c47c8798210f23f7f4086c41752944352568d5a7"
      values.L1_STANDARD_BRIDGE_SLOT:
+        "0x9904ba90dde5696cda05c9e0dab5cbaa0fea005ace4d11218a02ac668dad6376"
      values.l1CrossDomainMessenger:
+        "eth:0x11dd2d9B5ec142dbAFBEFEA82a75985Eae4e12b0"
      values.l1ERC721Bridge:
+        "eth:0x2e7d7B188D663F38c2E4fF9C59328458A2D676F0"
      values.l1StandardBridge:
+        "eth:0x4082C9647c098a6493fb499EaE63b5ce3259c574"
      values.maximumGasLimit:
+        200000000
      values.OPTIMISM_MINTABLE_ERC20_FACTORY_SLOT:
+        "0xa04c5bb938ca6fc46d95553abf0a76345ce3e722a30bf4f74928b8e7d852320c"
      values.OPTIMISM_PORTAL_SLOT:
+        "0x4b6c74f9e688cb39801f2112c14a8c57232a3fc5202e1444126d4bce86eb19ac"
      values.optimismMintableERC20Factory:
+        "eth:0x5DbBa17eb2458A05AbBA79E650dF607F0681Cc6a"
      values.optimismPortal:
+        "eth:0x787A0ACaB02437c60Aafb1a29167A3609801e320"
      values.START_BLOCK_SLOT:
+        "0xa11ee3ab75b40e88a0105e935d17cd36c8faee0138320d776c411291bdbbb19f"
      values.startBlock:
+        16858818
      implementationNames.eth:0xA872bca05c9F8A97CC36D879e43B33dB8ed7b69E:
-        "SystemConfig"
      implementationNames.eth:0xAB9d6cB7A427c0765163A7f45BB91cAfe5f2D375:
+        "SystemConfig"
    }
```

```diff
+   Status: CREATED
    contract SuperchainConfig (0x097f99768A0a4a0A81bAbbCB1ea18193bA9D53cC)
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
```

```diff
+   Status: CREATED
    contract L1ERC721Bridge (0x2e7d7B188D663F38c2E4fF9C59328458A2D676F0)
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
```

```diff
+   Status: CREATED
    contract OptimismMintableERC20Factory (0x5DbBa17eb2458A05AbBA79E650dF607F0681Cc6a)
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintableERC20 as this chain's representation of a token on the host chain, or vice-versa.
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0xb4899FF43Ae727B1E9CB19AC44660e4A43Fad0b5)
    +++ description: None
```

## Source code changes

```diff
.../L1CrossDomainMessenger.sol                     | 1654 +++++++---------
 .../.flat/L1ERC721Bridge/L1ERC721Bridge.sol        |  707 +++++++
 .../aevo/ethereum/.flat/L1ERC721Bridge/Proxy.p.sol |  211 ++
 .../L1StandardBridge/L1StandardBridge.sol          | 1431 +++++++-------
 .../L2OutputOracle/L2OutputOracle.sol              |  548 ++----
 .../OptimismMintableERC20Factory.sol               |  427 ++++
 .../.flat/OptimismMintableERC20Factory/Proxy.p.sol |  211 ++
 .../OptimismPortal/OptimismPortal.sol              | 1336 +++++--------
 ...0x27ff92b30Cae00dABCF8045cc68fc9dcB67C5019.sol} |    0
 ...:0xb4899FF43Ae727B1E9CB19AC44660e4A43Fad0b5.sol |  298 +++
 .../ethereum/.flat/SuperchainConfig/Proxy.p.sol    |  200 ++
 .../.flat/SuperchainConfig/SuperchainConfig.sol    |  477 +++++
 .../SystemConfig/SystemConfig.sol                  | 2034 +++++++++++++++++---
 13 files changed, 6416 insertions(+), 3118 deletions(-)
```

Generated with discovered.json: 0xff4304ae5bc99696f6c11da05407e6e3bc82c620

# Diff at Mon, 14 Jul 2025 12:44:40 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@9f4300dad2f3d080cd56fa311d4a848556c74e72 block: 22895931
- current block number: 22895931

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22895931 (main branch discovery), not current.

```diff
    EOA  (0x000000000000000000000000000000000000dEaD) {
    +++ description: None
      address:
-        "0x000000000000000000000000000000000000dEaD"
+        "eth:0x000000000000000000000000000000000000dEaD"
    }
```

```diff
    contract L1CrossDomainMessenger (0x11dd2d9B5ec142dbAFBEFEA82a75985Eae4e12b0) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      address:
-        "0x11dd2d9B5ec142dbAFBEFEA82a75985Eae4e12b0"
+        "eth:0x11dd2d9B5ec142dbAFBEFEA82a75985Eae4e12b0"
      values.$admin:
-        "0x27ff92b30Cae00dABCF8045cc68fc9dcB67C5019"
+        "eth:0x27ff92b30Cae00dABCF8045cc68fc9dcB67C5019"
      values.$implementation:
-        "0x8CfF5bDb1B428B979E3D87087dA8549A28065DDB"
+        "eth:0x8CfF5bDb1B428B979E3D87087dA8549A28065DDB"
      values.$pastUpgrades.0.2.0:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.$pastUpgrades.1.2.0:
-        "0xfA6aCD3c452ADE8910505cc61352274b4C6d526c"
+        "eth:0xfA6aCD3c452ADE8910505cc61352274b4C6d526c"
      values.$pastUpgrades.2.2.0:
-        "0x8ea8000814b14884317dF94D2fD26553C3fFd976"
+        "eth:0x8ea8000814b14884317dF94D2fD26553C3fFd976"
      values.$pastUpgrades.3.2.0:
-        "0x8ea8000814b14884317dF94D2fD26553C3fFd976"
+        "eth:0x8ea8000814b14884317dF94D2fD26553C3fFd976"
      values.$pastUpgrades.4.2.0:
-        "0x8ea8000814b14884317dF94D2fD26553C3fFd976"
+        "eth:0x8ea8000814b14884317dF94D2fD26553C3fFd976"
      values.$pastUpgrades.5.2.0:
-        "0x8CfF5bDb1B428B979E3D87087dA8549A28065DDB"
+        "eth:0x8CfF5bDb1B428B979E3D87087dA8549A28065DDB"
      values.OTHER_MESSENGER:
-        "0x4200000000000000000000000000000000000007"
+        "eth:0x4200000000000000000000000000000000000007"
      values.PORTAL:
-        "0x787A0ACaB02437c60Aafb1a29167A3609801e320"
+        "eth:0x787A0ACaB02437c60Aafb1a29167A3609801e320"
      values.ResolvedDelegateProxy_addressManager:
-        "0x7a616b25E7c96fc4d652966d7DDAbB51dE28eCc1"
+        "eth:0x7a616b25E7c96fc4d652966d7DDAbB51dE28eCc1"
      implementationNames.0x11dd2d9B5ec142dbAFBEFEA82a75985Eae4e12b0:
-        "ResolvedDelegateProxy"
      implementationNames.0x8CfF5bDb1B428B979E3D87087dA8549A28065DDB:
-        "L1CrossDomainMessenger"
      implementationNames.eth:0x11dd2d9B5ec142dbAFBEFEA82a75985Eae4e12b0:
+        "ResolvedDelegateProxy"
      implementationNames.eth:0x8CfF5bDb1B428B979E3D87087dA8549A28065DDB:
+        "L1CrossDomainMessenger"
    }
```

```diff
    EOA  (0x253887577420Cb7e7418cD4d50147743c8041b28) {
    +++ description: None
      address:
-        "0x253887577420Cb7e7418cD4d50147743c8041b28"
+        "eth:0x253887577420Cb7e7418cD4d50147743c8041b28"
    }
```

```diff
    contract ProxyAdmin (0x27ff92b30Cae00dABCF8045cc68fc9dcB67C5019) {
    +++ description: None
      address:
-        "0x27ff92b30Cae00dABCF8045cc68fc9dcB67C5019"
+        "eth:0x27ff92b30Cae00dABCF8045cc68fc9dcB67C5019"
      values.addressManager:
-        "0x7a616b25E7c96fc4d652966d7DDAbB51dE28eCc1"
+        "eth:0x7a616b25E7c96fc4d652966d7DDAbB51dE28eCc1"
      values.owner:
-        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
+        "eth:0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      implementationNames.0x27ff92b30Cae00dABCF8045cc68fc9dcB67C5019:
-        "ProxyAdmin"
      implementationNames.eth:0x27ff92b30Cae00dABCF8045cc68fc9dcB67C5019:
+        "ProxyAdmin"
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
    contract L1StandardBridge (0x4082C9647c098a6493fb499EaE63b5ce3259c574) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      address:
-        "0x4082C9647c098a6493fb499EaE63b5ce3259c574"
+        "eth:0x4082C9647c098a6493fb499EaE63b5ce3259c574"
      values.$admin:
-        "0x27ff92b30Cae00dABCF8045cc68fc9dcB67C5019"
+        "eth:0x27ff92b30Cae00dABCF8045cc68fc9dcB67C5019"
      values.$implementation:
-        "0x20F1380A78492227A9B2366242335D684aF22507"
+        "eth:0x20F1380A78492227A9B2366242335D684aF22507"
      values.l2TokenBridge:
-        "0x4200000000000000000000000000000000000010"
+        "eth:0x4200000000000000000000000000000000000010"
      values.messenger:
-        "0x11dd2d9B5ec142dbAFBEFEA82a75985Eae4e12b0"
+        "eth:0x11dd2d9B5ec142dbAFBEFEA82a75985Eae4e12b0"
      values.MESSENGER:
-        "0x11dd2d9B5ec142dbAFBEFEA82a75985Eae4e12b0"
+        "eth:0x11dd2d9B5ec142dbAFBEFEA82a75985Eae4e12b0"
      values.OTHER_BRIDGE:
-        "0x4200000000000000000000000000000000000010"
+        "eth:0x4200000000000000000000000000000000000010"
      implementationNames.0x4082C9647c098a6493fb499EaE63b5ce3259c574:
-        "L1ChugSplashProxy"
      implementationNames.0x20F1380A78492227A9B2366242335D684aF22507:
-        "L1StandardBridge"
      implementationNames.eth:0x4082C9647c098a6493fb499EaE63b5ce3259c574:
+        "L1ChugSplashProxy"
      implementationNames.eth:0x20F1380A78492227A9B2366242335D684aF22507:
+        "L1StandardBridge"
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
    EOA  (0x75ACb7ae6C76B3f5cA049431FE2c0797dD002b90) {
    +++ description: None
      address:
-        "0x75ACb7ae6C76B3f5cA049431FE2c0797dD002b90"
+        "eth:0x75ACb7ae6C76B3f5cA049431FE2c0797dD002b90"
    }
```

```diff
    contract OptimismPortal (0x787A0ACaB02437c60Aafb1a29167A3609801e320) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      address:
-        "0x787A0ACaB02437c60Aafb1a29167A3609801e320"
+        "eth:0x787A0ACaB02437c60Aafb1a29167A3609801e320"
      values.$admin:
-        "0x27ff92b30Cae00dABCF8045cc68fc9dcB67C5019"
+        "eth:0x27ff92b30Cae00dABCF8045cc68fc9dcB67C5019"
      values.$implementation:
-        "0x098927F692C86fA1722115652b9d2d7BE8cBa6D3"
+        "eth:0x098927F692C86fA1722115652b9d2d7BE8cBa6D3"
      values.$pastUpgrades.0.2.0:
-        "0x9Cb22AF811cFF79b89d25570FAC31586af7b4a97"
+        "eth:0x9Cb22AF811cFF79b89d25570FAC31586af7b4a97"
      values.$pastUpgrades.1.2.0:
-        "0xD45C7A59fca1b435ae805E8F6eF27418d92877AD"
+        "eth:0xD45C7A59fca1b435ae805E8F6eF27418d92877AD"
      values.$pastUpgrades.2.2.0:
-        "0x098927F692C86fA1722115652b9d2d7BE8cBa6D3"
+        "eth:0x098927F692C86fA1722115652b9d2d7BE8cBa6D3"
      values.GUARDIAN:
-        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
+        "eth:0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      values.L2_ORACLE:
-        "0x909E51211e959339EFb14b36f5A50955a8ae3770"
+        "eth:0x909E51211e959339EFb14b36f5A50955a8ae3770"
      values.l2Sender:
-        "0x000000000000000000000000000000000000dEaD"
+        "eth:0x000000000000000000000000000000000000dEaD"
      values.SYSTEM_CONFIG:
-        "0xF761Cc49bB127AB666899b41CDC4E62fA50cD9ca"
+        "eth:0xF761Cc49bB127AB666899b41CDC4E62fA50cD9ca"
      implementationNames.0x787A0ACaB02437c60Aafb1a29167A3609801e320:
-        "Proxy"
      implementationNames.0x098927F692C86fA1722115652b9d2d7BE8cBa6D3:
-        "OptimismPortal"
      implementationNames.eth:0x787A0ACaB02437c60Aafb1a29167A3609801e320:
+        "Proxy"
      implementationNames.eth:0x098927F692C86fA1722115652b9d2d7BE8cBa6D3:
+        "OptimismPortal"
    }
```

```diff
    contract AddressManager (0x7a616b25E7c96fc4d652966d7DDAbB51dE28eCc1) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      address:
-        "0x7a616b25E7c96fc4d652966d7DDAbB51dE28eCc1"
+        "eth:0x7a616b25E7c96fc4d652966d7DDAbB51dE28eCc1"
      values.owner:
-        "0x27ff92b30Cae00dABCF8045cc68fc9dcB67C5019"
+        "eth:0x27ff92b30Cae00dABCF8045cc68fc9dcB67C5019"
      implementationNames.0x7a616b25E7c96fc4d652966d7DDAbB51dE28eCc1:
-        "AddressManager"
      implementationNames.eth:0x7a616b25E7c96fc4d652966d7DDAbB51dE28eCc1:
+        "AddressManager"
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
    EOA  (0x860e06Fe384D1A3340111e7D142E02642178c053) {
    +++ description: None
      address:
-        "0x860e06Fe384D1A3340111e7D142E02642178c053"
+        "eth:0x860e06Fe384D1A3340111e7D142E02642178c053"
    }
```

```diff
    EOA  (0x889e21d7BA3d6dD62e75d4980A4Ad1349c61599d) {
    +++ description: None
      address:
-        "0x889e21d7BA3d6dD62e75d4980A4Ad1349c61599d"
+        "eth:0x889e21d7BA3d6dD62e75d4980A4Ad1349c61599d"
    }
```

```diff
    contract L2OutputOracle (0x909E51211e959339EFb14b36f5A50955a8ae3770) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      address:
-        "0x909E51211e959339EFb14b36f5A50955a8ae3770"
+        "eth:0x909E51211e959339EFb14b36f5A50955a8ae3770"
      values.$admin:
-        "0x27ff92b30Cae00dABCF8045cc68fc9dcB67C5019"
+        "eth:0x27ff92b30Cae00dABCF8045cc68fc9dcB67C5019"
      values.$implementation:
-        "0x0af92E6944900abA4B9BAC1417bA13ED6F45c27f"
+        "eth:0x0af92E6944900abA4B9BAC1417bA13ED6F45c27f"
      values.$pastUpgrades.0.2.0:
-        "0x2EFA0d1CBd36Aa0db7C0b59d32F6dA68cA83A722"
+        "eth:0x2EFA0d1CBd36Aa0db7C0b59d32F6dA68cA83A722"
      values.$pastUpgrades.1.2.0:
-        "0xfbc5b862CE0007AfD9fc58cf07D8A00Cf494fAAA"
+        "eth:0xfbc5b862CE0007AfD9fc58cf07D8A00Cf494fAAA"
      values.$pastUpgrades.2.2.0:
-        "0xb717dF06e095Bc7438721964DD43a2532963E885"
+        "eth:0xb717dF06e095Bc7438721964DD43a2532963E885"
      values.$pastUpgrades.3.2.0:
-        "0x0af92E6944900abA4B9BAC1417bA13ED6F45c27f"
+        "eth:0x0af92E6944900abA4B9BAC1417bA13ED6F45c27f"
      values.CHALLENGER:
-        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
+        "eth:0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      values.PROPOSER:
-        "0x75ACb7ae6C76B3f5cA049431FE2c0797dD002b90"
+        "eth:0x75ACb7ae6C76B3f5cA049431FE2c0797dD002b90"
      implementationNames.0x909E51211e959339EFb14b36f5A50955a8ae3770:
-        "Proxy"
      implementationNames.0x0af92E6944900abA4B9BAC1417bA13ED6F45c27f:
-        "L2OutputOracle"
      implementationNames.eth:0x909E51211e959339EFb14b36f5A50955a8ae3770:
+        "Proxy"
      implementationNames.eth:0x0af92E6944900abA4B9BAC1417bA13ED6F45c27f:
+        "L2OutputOracle"
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
    EOA  (0xE3e57f917E788F3921528CAABf76EEaF781d3326) {
    +++ description: None
      address:
-        "0xE3e57f917E788F3921528CAABf76EEaF781d3326"
+        "eth:0xE3e57f917E788F3921528CAABf76EEaF781d3326"
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
    contract SystemConfig (0xF761Cc49bB127AB666899b41CDC4E62fA50cD9ca) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      address:
-        "0xF761Cc49bB127AB666899b41CDC4E62fA50cD9ca"
+        "eth:0xF761Cc49bB127AB666899b41CDC4E62fA50cD9ca"
      values.$admin:
-        "0x27ff92b30Cae00dABCF8045cc68fc9dcB67C5019"
+        "eth:0x27ff92b30Cae00dABCF8045cc68fc9dcB67C5019"
      values.$implementation:
-        "0xA872bca05c9F8A97CC36D879e43B33dB8ed7b69E"
+        "eth:0xA872bca05c9F8A97CC36D879e43B33dB8ed7b69E"
      values.$pastUpgrades.0.2.0:
-        "0x552FFBdDFB01B6F7f3A3C39E9d3D0A5Fa8436394"
+        "eth:0x552FFBdDFB01B6F7f3A3C39E9d3D0A5Fa8436394"
      values.$pastUpgrades.1.2.0:
-        "0x98F5f3455B71C297e4f7D7Cd1FAA80b5CDf4A542"
+        "eth:0x98F5f3455B71C297e4f7D7Cd1FAA80b5CDf4A542"
      values.$pastUpgrades.2.2.0:
-        "0xA872bca05c9F8A97CC36D879e43B33dB8ed7b69E"
+        "eth:0xA872bca05c9F8A97CC36D879e43B33dB8ed7b69E"
      values.batcherHash:
-        "0x889e21d7BA3d6dD62e75d4980A4Ad1349c61599d"
+        "eth:0x889e21d7BA3d6dD62e75d4980A4Ad1349c61599d"
      values.owner:
-        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
+        "eth:0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      values.sequencerInbox:
-        "0x253887577420Cb7e7418cD4d50147743c8041b28"
+        "eth:0x253887577420Cb7e7418cD4d50147743c8041b28"
      values.unsafeBlockSigner:
-        "0xE3e57f917E788F3921528CAABf76EEaF781d3326"
+        "eth:0xE3e57f917E788F3921528CAABf76EEaF781d3326"
      implementationNames.0xF761Cc49bB127AB666899b41CDC4E62fA50cD9ca:
-        "Proxy"
      implementationNames.0xA872bca05c9F8A97CC36D879e43B33dB8ed7b69E:
-        "SystemConfig"
      implementationNames.eth:0xF761Cc49bB127AB666899b41CDC4E62fA50cD9ca:
+        "Proxy"
      implementationNames.eth:0xA872bca05c9F8A97CC36D879e43B33dB8ed7b69E:
+        "SystemConfig"
    }
```

```diff
+   Status: CREATED
    contract L1CrossDomainMessenger (0x11dd2d9B5ec142dbAFBEFEA82a75985Eae4e12b0)
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x27ff92b30Cae00dABCF8045cc68fc9dcB67C5019)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1StandardBridge (0x4082C9647c098a6493fb499EaE63b5ce3259c574)
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
```

```diff
+   Status: CREATED
    contract Conduit Multisig 1 (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OptimismPortal (0x787A0ACaB02437c60Aafb1a29167A3609801e320)
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
```

```diff
+   Status: CREATED
    contract AddressManager (0x7a616b25E7c96fc4d652966d7DDAbB51dE28eCc1)
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
```

```diff
+   Status: CREATED
    contract L2OutputOracle (0x909E51211e959339EFb14b36f5A50955a8ae3770)
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
```

```diff
+   Status: CREATED
    contract SystemConfig (0xF761Cc49bB127AB666899b41CDC4E62fA50cD9ca)
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
```

Generated with discovered.json: 0xa293d3fa3485a481c85f2ceea8f0170f5bb505d4

# Diff at Fri, 04 Jul 2025 12:18:50 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f56dc47fe915564d4555300304da4d3bcbc087f block: 22615660
- current block number: 22615660

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22615660 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x27ff92b30Cae00dABCF8045cc68fc9dcB67C5019) {
    +++ description: None
      directlyReceivedPermissions.0.from:
-        "ethereum:0x7a616b25E7c96fc4d652966d7DDAbB51dE28eCc1"
+        "eth:0x7a616b25E7c96fc4d652966d7DDAbB51dE28eCc1"
      directlyReceivedPermissions.1.from:
-        "ethereum:0x11dd2d9B5ec142dbAFBEFEA82a75985Eae4e12b0"
+        "eth:0x11dd2d9B5ec142dbAFBEFEA82a75985Eae4e12b0"
      directlyReceivedPermissions.2.from:
-        "ethereum:0x4082C9647c098a6493fb499EaE63b5ce3259c574"
+        "eth:0x4082C9647c098a6493fb499EaE63b5ce3259c574"
      directlyReceivedPermissions.3.from:
-        "ethereum:0x787A0ACaB02437c60Aafb1a29167A3609801e320"
+        "eth:0x787A0ACaB02437c60Aafb1a29167A3609801e320"
      directlyReceivedPermissions.4.from:
-        "ethereum:0x909E51211e959339EFb14b36f5A50955a8ae3770"
+        "eth:0x909E51211e959339EFb14b36f5A50955a8ae3770"
      directlyReceivedPermissions.5.from:
-        "ethereum:0xF761Cc49bB127AB666899b41CDC4E62fA50cD9ca"
+        "eth:0xF761Cc49bB127AB666899b41CDC4E62fA50cD9ca"
    }
```

```diff
    contract Conduit Multisig 1 (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0x909E51211e959339EFb14b36f5A50955a8ae3770"
+        "eth:0x909E51211e959339EFb14b36f5A50955a8ae3770"
      receivedPermissions.1.from:
-        "ethereum:0x787A0ACaB02437c60Aafb1a29167A3609801e320"
+        "eth:0x787A0ACaB02437c60Aafb1a29167A3609801e320"
      receivedPermissions.2.via.0.address:
-        "ethereum:0x27ff92b30Cae00dABCF8045cc68fc9dcB67C5019"
+        "eth:0x27ff92b30Cae00dABCF8045cc68fc9dcB67C5019"
      receivedPermissions.2.from:
-        "ethereum:0x7a616b25E7c96fc4d652966d7DDAbB51dE28eCc1"
+        "eth:0x7a616b25E7c96fc4d652966d7DDAbB51dE28eCc1"
      receivedPermissions.3.from:
-        "ethereum:0xF761Cc49bB127AB666899b41CDC4E62fA50cD9ca"
+        "eth:0xF761Cc49bB127AB666899b41CDC4E62fA50cD9ca"
      receivedPermissions.4.via.0.address:
-        "ethereum:0x27ff92b30Cae00dABCF8045cc68fc9dcB67C5019"
+        "eth:0x27ff92b30Cae00dABCF8045cc68fc9dcB67C5019"
      receivedPermissions.4.from:
-        "ethereum:0x11dd2d9B5ec142dbAFBEFEA82a75985Eae4e12b0"
+        "eth:0x11dd2d9B5ec142dbAFBEFEA82a75985Eae4e12b0"
      receivedPermissions.5.via.0.address:
-        "ethereum:0x27ff92b30Cae00dABCF8045cc68fc9dcB67C5019"
+        "eth:0x27ff92b30Cae00dABCF8045cc68fc9dcB67C5019"
      receivedPermissions.5.from:
-        "ethereum:0x4082C9647c098a6493fb499EaE63b5ce3259c574"
+        "eth:0x4082C9647c098a6493fb499EaE63b5ce3259c574"
      receivedPermissions.6.via.0.address:
-        "ethereum:0x27ff92b30Cae00dABCF8045cc68fc9dcB67C5019"
+        "eth:0x27ff92b30Cae00dABCF8045cc68fc9dcB67C5019"
      receivedPermissions.6.from:
-        "ethereum:0x787A0ACaB02437c60Aafb1a29167A3609801e320"
+        "eth:0x787A0ACaB02437c60Aafb1a29167A3609801e320"
      receivedPermissions.7.via.0.address:
-        "ethereum:0x27ff92b30Cae00dABCF8045cc68fc9dcB67C5019"
+        "eth:0x27ff92b30Cae00dABCF8045cc68fc9dcB67C5019"
      receivedPermissions.7.from:
-        "ethereum:0x909E51211e959339EFb14b36f5A50955a8ae3770"
+        "eth:0x909E51211e959339EFb14b36f5A50955a8ae3770"
      receivedPermissions.8.via.0.address:
-        "ethereum:0x27ff92b30Cae00dABCF8045cc68fc9dcB67C5019"
+        "eth:0x27ff92b30Cae00dABCF8045cc68fc9dcB67C5019"
      receivedPermissions.8.from:
-        "ethereum:0xF761Cc49bB127AB666899b41CDC4E62fA50cD9ca"
+        "eth:0xF761Cc49bB127AB666899b41CDC4E62fA50cD9ca"
      directlyReceivedPermissions.0.from:
-        "ethereum:0x27ff92b30Cae00dABCF8045cc68fc9dcB67C5019"
+        "eth:0x27ff92b30Cae00dABCF8045cc68fc9dcB67C5019"
    }
```

```diff
    EOA  (0x75ACb7ae6C76B3f5cA049431FE2c0797dD002b90) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0x909E51211e959339EFb14b36f5A50955a8ae3770"
+        "eth:0x909E51211e959339EFb14b36f5A50955a8ae3770"
    }
```

```diff
    EOA  (0x889e21d7BA3d6dD62e75d4980A4Ad1349c61599d) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0xF761Cc49bB127AB666899b41CDC4E62fA50cD9ca"
+        "eth:0xF761Cc49bB127AB666899b41CDC4E62fA50cD9ca"
    }
```

Generated with discovered.json: 0xfb005a8e2933dd4ee6738e881c4bb667d860a657

# Diff at Mon, 16 Jun 2025 08:41:36 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@e1208475abce20cea1768d2e4878c03350c1b7c9 block: 22615660
- current block number: 22615660

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22615660 (main branch discovery), not current.

```diff
    contract L1CrossDomainMessenger (0x11dd2d9B5ec142dbAFBEFEA82a75985Eae4e12b0) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      values.$admin:
+        "0x27ff92b30Cae00dABCF8045cc68fc9dcB67C5019"
    }
```

```diff
    contract ProxyAdmin (0x27ff92b30Cae00dABCF8045cc68fc9dcB67C5019) {
    +++ description: None
      directlyReceivedPermissions.5:
+        {"permission":"upgrade","from":"ethereum:0x909E51211e959339EFb14b36f5A50955a8ae3770","role":"admin"}
      directlyReceivedPermissions.4.from:
-        "ethereum:0x909E51211e959339EFb14b36f5A50955a8ae3770"
+        "ethereum:0xF761Cc49bB127AB666899b41CDC4E62fA50cD9ca"
      directlyReceivedPermissions.3.from:
-        "ethereum:0xF761Cc49bB127AB666899b41CDC4E62fA50cD9ca"
+        "ethereum:0x787A0ACaB02437c60Aafb1a29167A3609801e320"
      directlyReceivedPermissions.2.from:
-        "ethereum:0x787A0ACaB02437c60Aafb1a29167A3609801e320"
+        "ethereum:0x11dd2d9B5ec142dbAFBEFEA82a75985Eae4e12b0"
    }
```

```diff
    contract Conduit Multisig 1 (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      receivedPermissions.8:
+        {"permission":"upgrade","from":"ethereum:0x909E51211e959339EFb14b36f5A50955a8ae3770","role":"admin","via":[{"address":"ethereum:0x27ff92b30Cae00dABCF8045cc68fc9dcB67C5019"}]}
      receivedPermissions.7.from:
-        "ethereum:0x909E51211e959339EFb14b36f5A50955a8ae3770"
+        "ethereum:0xF761Cc49bB127AB666899b41CDC4E62fA50cD9ca"
      receivedPermissions.6.permission:
-        "upgrade"
+        "challenge"
      receivedPermissions.6.from:
-        "ethereum:0xF761Cc49bB127AB666899b41CDC4E62fA50cD9ca"
+        "ethereum:0x909E51211e959339EFb14b36f5A50955a8ae3770"
      receivedPermissions.6.role:
-        "admin"
+        ".CHALLENGER"
      receivedPermissions.6.via:
-        [{"address":"ethereum:0x27ff92b30Cae00dABCF8045cc68fc9dcB67C5019"}]
      receivedPermissions.5.permission:
-        "challenge"
+        "guard"
      receivedPermissions.5.from:
-        "ethereum:0x909E51211e959339EFb14b36f5A50955a8ae3770"
+        "ethereum:0x787A0ACaB02437c60Aafb1a29167A3609801e320"
      receivedPermissions.5.role:
-        ".CHALLENGER"
+        ".GUARDIAN"
      receivedPermissions.4.permission:
-        "guard"
+        "upgrade"
      receivedPermissions.4.role:
-        ".GUARDIAN"
+        "admin"
      receivedPermissions.4.via:
+        [{"address":"ethereum:0x27ff92b30Cae00dABCF8045cc68fc9dcB67C5019"}]
      receivedPermissions.3.permission:
-        "upgrade"
+        "interact"
      receivedPermissions.3.from:
-        "ethereum:0x787A0ACaB02437c60Aafb1a29167A3609801e320"
+        "ethereum:0xF761Cc49bB127AB666899b41CDC4E62fA50cD9ca"
      receivedPermissions.3.role:
-        "admin"
+        ".owner"
      receivedPermissions.3.via:
-        [{"address":"ethereum:0x27ff92b30Cae00dABCF8045cc68fc9dcB67C5019"}]
      receivedPermissions.3.description:
+        "it can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system."
      receivedPermissions.2.permission:
-        "interact"
+        "upgrade"
      receivedPermissions.2.from:
-        "ethereum:0xF761Cc49bB127AB666899b41CDC4E62fA50cD9ca"
+        "ethereum:0x11dd2d9B5ec142dbAFBEFEA82a75985Eae4e12b0"
      receivedPermissions.2.description:
-        "it can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system."
      receivedPermissions.2.role:
-        ".owner"
+        "admin"
      receivedPermissions.2.via:
+        [{"address":"ethereum:0x27ff92b30Cae00dABCF8045cc68fc9dcB67C5019"}]
    }
```

Generated with discovered.json: 0x64216c0aa467329d1e1420ccfd74485e22e0cd99

# Diff at Mon, 02 Jun 2025 07:58:53 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@2fee84b782a329885c84742cf9cf43143842a2d5 block: 22397569
- current block number: 22615660

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

Generated with discovered.json: 0x16a937db882949c0f48d33a0e4838fd76669c7bb

# Diff at Fri, 30 May 2025 06:54:19 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@a4d8c436027d17df0f9b76843cd6deb1888fa381 block: 22397569
- current block number: 22397569

## Description

config: change comment about eip1559 fee val

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22397569 (main branch discovery), not current.

```diff
    contract SystemConfig (0xF761Cc49bB127AB666899b41CDC4E62fA50cD9ca) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      fieldMeta.eip1559Denominator:
+        {"description":"volatility param: lower denominator -> quicker fee changes on L2"}
    }
```

Generated with discovered.json: 0xfa9766de9064dc0aa2e0496273ddeeca9af0ef23

# Diff at Fri, 23 May 2025 09:40:52 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@69cd181abbc3c830a6caf2f4429b37cae72ffdb8 block: 22397569
- current block number: 22397569

## Description

Introduced .role field on each permission, defaulting to field name on which it was defined (with '.' prefix)

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22397569 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x27ff92b30Cae00dABCF8045cc68fc9dcB67C5019) {
    +++ description: None
      directlyReceivedPermissions.4.role:
+        "admin"
      directlyReceivedPermissions.3.role:
+        "admin"
      directlyReceivedPermissions.2.role:
+        "admin"
      directlyReceivedPermissions.1.role:
+        ".owner"
      directlyReceivedPermissions.0.role:
+        ".$admin"
    }
```

```diff
    contract Conduit Multisig 1 (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      receivedPermissions.7.role:
+        "admin"
      receivedPermissions.6.role:
+        "admin"
      receivedPermissions.5.role:
+        "admin"
      receivedPermissions.4.permission:
-        "challenge"
+        "guard"
      receivedPermissions.4.from:
-        "0x909E51211e959339EFb14b36f5A50955a8ae3770"
+        "0x787A0ACaB02437c60Aafb1a29167A3609801e320"
      receivedPermissions.4.role:
+        ".GUARDIAN"
      receivedPermissions.3.permission:
-        "guard"
+        "challenge"
      receivedPermissions.3.from:
-        "0x787A0ACaB02437c60Aafb1a29167A3609801e320"
+        "0x909E51211e959339EFb14b36f5A50955a8ae3770"
      receivedPermissions.3.role:
+        ".CHALLENGER"
      receivedPermissions.2.role:
+        ".owner"
      receivedPermissions.1.role:
+        ".owner"
      receivedPermissions.0.role:
+        ".$admin"
      directlyReceivedPermissions.0.role:
+        ".owner"
    }
```

```diff
    EOA  (0x75ACb7ae6C76B3f5cA049431FE2c0797dD002b90) {
    +++ description: None
      receivedPermissions.0.role:
+        ".PROPOSER"
    }
```

```diff
    EOA  (0x889e21d7BA3d6dD62e75d4980A4Ad1349c61599d) {
    +++ description: None
      receivedPermissions.0.role:
+        ".batcherHash"
    }
```

Generated with discovered.json: 0xbc33454c4fbabf1ab0fa8559745045b6f73e0a4f

# Diff at Tue, 29 Apr 2025 08:18:58 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@ef7477af00fe0b57a2f7cacf7e958c12494af662 block: 22046056
- current block number: 22046056

## Description

Field .issuedPermissions is removed from the output as no longer needed. Added 'permissionsConfigHash' due to refactoring of the modelling process (into a separate command).

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22046056 (main branch discovery), not current.

```diff
    contract L1StandardBridge (0x4082C9647c098a6493fb499EaE63b5ce3259c574) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x4a4962275DF8C60a80d3a25faEc5AA7De116A746","description":"upgrading the bridge implementation can give access to all funds escrowed therein.","via":[{"address":"0x27ff92b30Cae00dABCF8045cc68fc9dcB67C5019"}]}]
    }
```

```diff
    contract OptimismPortal (0x787A0ACaB02437c60Aafb1a29167A3609801e320) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      issuedPermissions:
-        [{"permission":"guard","to":"0x4a4962275DF8C60a80d3a25faEc5AA7De116A746","via":[]},{"permission":"upgrade","to":"0x4a4962275DF8C60a80d3a25faEc5AA7De116A746","via":[{"address":"0x27ff92b30Cae00dABCF8045cc68fc9dcB67C5019"}]}]
    }
```

```diff
    contract AddressManager (0x7a616b25E7c96fc4d652966d7DDAbB51dE28eCc1) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      issuedPermissions:
-        [{"permission":"interact","to":"0x4a4962275DF8C60a80d3a25faEc5AA7De116A746","description":"set and change address mappings.","via":[{"address":"0x27ff92b30Cae00dABCF8045cc68fc9dcB67C5019"}]}]
    }
```

```diff
    contract L2OutputOracle (0x909E51211e959339EFb14b36f5A50955a8ae3770) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      issuedPermissions:
-        [{"permission":"challenge","to":"0x4a4962275DF8C60a80d3a25faEc5AA7De116A746","via":[]},{"permission":"propose","to":"0x75ACb7ae6C76B3f5cA049431FE2c0797dD002b90","via":[]},{"permission":"upgrade","to":"0x4a4962275DF8C60a80d3a25faEc5AA7De116A746","via":[{"address":"0x27ff92b30Cae00dABCF8045cc68fc9dcB67C5019"}]}]
    }
```

```diff
    contract SystemConfig (0xF761Cc49bB127AB666899b41CDC4E62fA50cD9ca) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      issuedPermissions:
-        [{"permission":"interact","to":"0x4a4962275DF8C60a80d3a25faEc5AA7De116A746","description":"it can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system.","via":[]},{"permission":"sequence","to":"0x889e21d7BA3d6dD62e75d4980A4Ad1349c61599d","via":[]},{"permission":"upgrade","to":"0x4a4962275DF8C60a80d3a25faEc5AA7De116A746","via":[{"address":"0x27ff92b30Cae00dABCF8045cc68fc9dcB67C5019"}]}]
    }
```

Generated with discovered.json: 0x6558060e6b2cef207ddcb8bb8c26ad10fdcc7468

# Diff at Thu, 27 Mar 2025 11:13:52 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@8cc2e36080df3a74dfd8475d41c64f46203f5218 block: 22046056
- current block number: 22046056

## Description

Config related: add guardian description details, hide some noisy values, hide AddressManager as spam cat, add proposer / challenger to permissioned opfp chains.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22046056 (main branch discovery), not current.

```diff
    contract AddressManager (0x7a616b25E7c96fc4d652966d7DDAbB51dE28eCc1) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      category:
+        {"name":"Spam","priority":-1}
    }
```

Generated with discovered.json: 0x999a1c249153090eccd03602e99f0aaabc8a4081

# Diff at Tue, 18 Mar 2025 08:12:18 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@4ef7a8dbcec1cd9fec77aae2b73d81347a4ffb13 block: 22046056
- current block number: 22046056

## Description

Config: change Multisig names.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22046056 (main branch discovery), not current.

```diff
    contract Conduit Multisig 1 (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      name:
-        "ConduitMultisig"
+        "Conduit Multisig 1"
    }
```

Generated with discovered.json: 0x6002b54b7c72532477e4f087b5d9417ec164629a

# Diff at Fri, 14 Mar 2025 15:38:08 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@002bac09dea3b1154ecc36736323fb7552478ce4 block: 21808921
- current block number: 22046056

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

Generated with discovered.json: 0xf47aaf175f4485ae00c952c7d1ae42a756b3233a

# Diff at Tue, 04 Mar 2025 11:25:20 GMT:

- author: Michał Podsiadły (<michal.podsiadly@l2beat.com>)
- comparing to: main@be38e12d3ff947ca8de40f3a23a9ba1875a54f5a block: 21808921
- current block number: 21808921

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21808921 (main branch discovery), not current.

```diff
    contract SystemConfig (0xF761Cc49bB127AB666899b41CDC4E62fA50cD9ca) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      values.opStackDA.isSomeTxsLengthEqualToCelestiaDAExample:
-        false
      values.opStackDA.isUsingCelestia:
+        false
    }
```

Generated with discovered.json: 0x21f361a5920ae615dfbb93f720f916e14c1b442c

# Diff at Tue, 04 Mar 2025 10:38:50 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@98d260b45fe0d2195ce5e629bd7b200c8706e8ba block: 21808921
- current block number: 21808921

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21808921 (main branch discovery), not current.

```diff
    contract L1CrossDomainMessenger (0x11dd2d9B5ec142dbAFBEFEA82a75985Eae4e12b0) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      sinceBlock:
+        16858814
    }
```

```diff
    contract ProxyAdmin (0x27ff92b30Cae00dABCF8045cc68fc9dcB67C5019) {
    +++ description: None
      sinceBlock:
+        16858810
    }
```

```diff
    contract L1StandardBridge (0x4082C9647c098a6493fb499EaE63b5ce3259c574) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      sinceBlock:
+        16858812
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
    contract OptimismPortal (0x787A0ACaB02437c60Aafb1a29167A3609801e320) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      sinceBlock:
+        16858815
    }
```

```diff
    contract AddressManager (0x7a616b25E7c96fc4d652966d7DDAbB51dE28eCc1) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      sinceBlock:
+        16858811
    }
```

```diff
    contract L2OutputOracle (0x909E51211e959339EFb14b36f5A50955a8ae3770) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      sinceBlock:
+        16858813
    }
```

```diff
    contract SystemConfig (0xF761Cc49bB127AB666899b41CDC4E62fA50cD9ca) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      sinceBlock:
+        16858818
    }
```

Generated with discovered.json: 0xff4c9ee33f97a1ee1c2cddce2f4b3ce3ba414651

# Diff at Wed, 26 Feb 2025 10:32:29 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@18513668f913fbe57a197f43655b19111df0e627 block: 21808921
- current block number: 21808921

## Description

config related: added categories for all opstack, op stack and polygoncdk stack templates.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21808921 (main branch discovery), not current.

```diff
    contract L1CrossDomainMessenger (0x11dd2d9B5ec142dbAFBEFEA82a75985Eae4e12b0) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      category:
+        {"name":"Canonical Bridges","priority":2}
    }
```

```diff
    contract L1StandardBridge (0x4082C9647c098a6493fb499EaE63b5ce3259c574) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      category:
+        {"name":"Canonical Bridges","priority":2}
    }
```

```diff
    contract OptimismPortal (0x787A0ACaB02437c60Aafb1a29167A3609801e320) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract L2OutputOracle (0x909E51211e959339EFb14b36f5A50955a8ae3770) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract SystemConfig (0xF761Cc49bB127AB666899b41CDC4E62fA50cD9ca) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

Generated with discovered.json: 0xe10ebab67f8ba856e91564c21ab8ea9d6fa47d38

# Diff at Fri, 21 Feb 2025 14:04:34 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@d219f271711b2cf7a164e3443bead5e4957d13a8 block: 21808921
- current block number: 21808921

## Description

Config related: Change some severities and add templates.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21808921 (main branch discovery), not current.

```diff
    contract L2OutputOracle (0x909E51211e959339EFb14b36f5A50955a8ae3770) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      fieldMeta.proposer:
+        {"severity":"HIGH"}
      fieldMeta.challenger:
+        {"severity":"HIGH"}
      fieldMeta.deletedOutputs:
+        {"severity":"HIGH"}
    }
```

Generated with discovered.json: 0x8132549c58f9d9c6708d4f64a6e524e874ff8edb

# Diff at Fri, 21 Feb 2025 08:58:58 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1cf9ec35847912163c4b663a633e258a434c0bca block: 21808921
- current block number: 21808921

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21808921 (main branch discovery), not current.

```diff
    contract L1CrossDomainMessenger (0x11dd2d9B5ec142dbAFBEFEA82a75985Eae4e12b0) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      categories:
-        ["Core"]
    }
```

Generated with discovered.json: 0x5b15f691f70298303502ccdc1292cbff14938f69

# Diff at Mon, 10 Feb 2025 19:03:35 GMT:

- author: Michał Podsiadły (<michal.podsiadly@l2beat.com>)
- comparing to: main@3756adff7c1ac86d8af3374a90a75c1999aae2b3 block: 21637075
- current block number: 21808921

## Description

Added Eigen DA detection under OpStackDAHandler.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21637075 (main branch discovery), not current.

```diff
    contract SystemConfig (0xF761Cc49bB127AB666899b41CDC4E62fA50cD9ca) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      values.opStackDA.isUsingEigenDA:
+        true
    }
```

Generated with discovered.json: 0x5e9ed6ddd01fd4a5e570bc5937d3034289466686

# Diff at Tue, 04 Feb 2025 12:30:44 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@145553eed7ba44636411ecb25e4099728acd02f9 block: 21637075
- current block number: 21637075

## Description

Rename 'configure' permission to 'interact'

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21637075 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x27ff92b30Cae00dABCF8045cc68fc9dcB67C5019) {
    +++ description: None
      directlyReceivedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract ConduitMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      receivedPermissions.3.permission:
-        "guard"
+        "interact"
      receivedPermissions.3.from:
-        "0x787A0ACaB02437c60Aafb1a29167A3609801e320"
+        "0xF761Cc49bB127AB666899b41CDC4E62fA50cD9ca"
      receivedPermissions.3.description:
+        "it can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system."
      receivedPermissions.2.permission:
-        "configure"
+        "interact"
      receivedPermissions.2.from:
-        "0xF761Cc49bB127AB666899b41CDC4E62fA50cD9ca"
+        "0x7a616b25E7c96fc4d652966d7DDAbB51dE28eCc1"
      receivedPermissions.2.description:
-        "it can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system."
+        "set and change address mappings."
      receivedPermissions.2.via:
+        [{"address":"0x27ff92b30Cae00dABCF8045cc68fc9dcB67C5019"}]
      receivedPermissions.1.permission:
-        "configure"
+        "guard"
      receivedPermissions.1.from:
-        "0x7a616b25E7c96fc4d652966d7DDAbB51dE28eCc1"
+        "0x787A0ACaB02437c60Aafb1a29167A3609801e320"
      receivedPermissions.1.description:
-        "set and change address mappings."
      receivedPermissions.1.via:
-        [{"address":"0x27ff92b30Cae00dABCF8045cc68fc9dcB67C5019"}]
    }
```

```diff
    contract AddressManager (0x7a616b25E7c96fc4d652966d7DDAbB51dE28eCc1) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      issuedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract SystemConfig (0xF761Cc49bB127AB666899b41CDC4E62fA50cD9ca) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      issuedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

Generated with discovered.json: 0x2dedac4627067f6c02eb580c4000e0ced70f7ef4

# Diff at Mon, 20 Jan 2025 11:09:12 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@2c8b4f3d9910bb6371be9b4df87b70856e7d8c64 block: 21637075
- current block number: 21637075

## Description

Rerun on the same block number. Applies fixes to permissions and via field. Renames permission's target to to/from.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21637075 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x27ff92b30Cae00dABCF8045cc68fc9dcB67C5019) {
    +++ description: None
      directlyReceivedPermissions.4.target:
-        "0xF761Cc49bB127AB666899b41CDC4E62fA50cD9ca"
      directlyReceivedPermissions.4.from:
+        "0xF761Cc49bB127AB666899b41CDC4E62fA50cD9ca"
      directlyReceivedPermissions.3.target:
-        "0x909E51211e959339EFb14b36f5A50955a8ae3770"
      directlyReceivedPermissions.3.from:
+        "0x909E51211e959339EFb14b36f5A50955a8ae3770"
      directlyReceivedPermissions.2.target:
-        "0x787A0ACaB02437c60Aafb1a29167A3609801e320"
      directlyReceivedPermissions.2.from:
+        "0x787A0ACaB02437c60Aafb1a29167A3609801e320"
      directlyReceivedPermissions.1.target:
-        "0x4082C9647c098a6493fb499EaE63b5ce3259c574"
      directlyReceivedPermissions.1.from:
+        "0x4082C9647c098a6493fb499EaE63b5ce3259c574"
      directlyReceivedPermissions.0.target:
-        "0x7a616b25E7c96fc4d652966d7DDAbB51dE28eCc1"
      directlyReceivedPermissions.0.from:
+        "0x7a616b25E7c96fc4d652966d7DDAbB51dE28eCc1"
    }
```

```diff
    contract L1StandardBridge (0x4082C9647c098a6493fb499EaE63b5ce3259c574) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      issuedPermissions.0.target:
-        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.via.0.description:
-        "upgrading the bridge implementation can give access to all funds escrowed therein."
      issuedPermissions.0.to:
+        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      issuedPermissions.0.description:
+        "upgrading the bridge implementation can give access to all funds escrowed therein."
    }
```

```diff
    contract ConduitMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      receivedPermissions.7.target:
-        "0xF761Cc49bB127AB666899b41CDC4E62fA50cD9ca"
      receivedPermissions.7.from:
+        "0xF761Cc49bB127AB666899b41CDC4E62fA50cD9ca"
      receivedPermissions.6.target:
-        "0x909E51211e959339EFb14b36f5A50955a8ae3770"
      receivedPermissions.6.from:
+        "0x909E51211e959339EFb14b36f5A50955a8ae3770"
      receivedPermissions.5.target:
-        "0x787A0ACaB02437c60Aafb1a29167A3609801e320"
      receivedPermissions.5.from:
+        "0x787A0ACaB02437c60Aafb1a29167A3609801e320"
      receivedPermissions.4.target:
-        "0x4082C9647c098a6493fb499EaE63b5ce3259c574"
      receivedPermissions.4.from:
+        "0x4082C9647c098a6493fb499EaE63b5ce3259c574"
      receivedPermissions.3.target:
-        "0x787A0ACaB02437c60Aafb1a29167A3609801e320"
      receivedPermissions.3.from:
+        "0x787A0ACaB02437c60Aafb1a29167A3609801e320"
      receivedPermissions.2.target:
-        "0xF761Cc49bB127AB666899b41CDC4E62fA50cD9ca"
      receivedPermissions.2.from:
+        "0xF761Cc49bB127AB666899b41CDC4E62fA50cD9ca"
      receivedPermissions.1.target:
-        "0x7a616b25E7c96fc4d652966d7DDAbB51dE28eCc1"
      receivedPermissions.1.from:
+        "0x7a616b25E7c96fc4d652966d7DDAbB51dE28eCc1"
      receivedPermissions.0.target:
-        "0x909E51211e959339EFb14b36f5A50955a8ae3770"
      receivedPermissions.0.from:
+        "0x909E51211e959339EFb14b36f5A50955a8ae3770"
      directlyReceivedPermissions.0.target:
-        "0x27ff92b30Cae00dABCF8045cc68fc9dcB67C5019"
      directlyReceivedPermissions.0.from:
+        "0x27ff92b30Cae00dABCF8045cc68fc9dcB67C5019"
    }
```

```diff
    contract OptimismPortal (0x787A0ACaB02437c60Aafb1a29167A3609801e320) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      issuedPermissions.1.target:
-        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      issuedPermissions.1.via.0.delay:
-        0
      issuedPermissions.1.to:
+        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      issuedPermissions.0.target:
-        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      issuedPermissions.0.to:
+        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
    }
```

```diff
    contract AddressManager (0x7a616b25E7c96fc4d652966d7DDAbB51dE28eCc1) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      issuedPermissions.0.target:
-        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.via.0.description:
-        "set and change address mappings."
      issuedPermissions.0.to:
+        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      issuedPermissions.0.description:
+        "set and change address mappings."
    }
```

```diff
    contract L2OutputOracle (0x909E51211e959339EFb14b36f5A50955a8ae3770) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      issuedPermissions.2.target:
-        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      issuedPermissions.2.via.0.delay:
-        0
      issuedPermissions.2.to:
+        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      issuedPermissions.1.target:
-        "0x75ACb7ae6C76B3f5cA049431FE2c0797dD002b90"
      issuedPermissions.1.to:
+        "0x75ACb7ae6C76B3f5cA049431FE2c0797dD002b90"
      issuedPermissions.0.target:
-        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      issuedPermissions.0.to:
+        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
    }
```

```diff
    contract SystemConfig (0xF761Cc49bB127AB666899b41CDC4E62fA50cD9ca) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      issuedPermissions.2.target:
-        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      issuedPermissions.2.via.0.delay:
-        0
      issuedPermissions.2.to:
+        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      issuedPermissions.1.target:
-        "0x889e21d7BA3d6dD62e75d4980A4Ad1349c61599d"
      issuedPermissions.1.to:
+        "0x889e21d7BA3d6dD62e75d4980A4Ad1349c61599d"
      issuedPermissions.0.target:
-        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      issuedPermissions.0.to:
+        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      issuedPermissions.0.description:
+        "it can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system."
    }
```

Generated with discovered.json: 0xe98469fb79dd8b9ec03e291190ba335b75c93edd

# Diff at Thu, 16 Jan 2025 12:34:31 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@b471de2d691e0c6d99ad89859efde79edd3d4dfb block: 21628882
- current block number: 21637075

## Description

ConduitMultisig signer changes.

## Watched changes

```diff
    contract ConduitMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      values.$members.8:
+        "0x4D8007a0E9f293e62E2b0F43C6Cf4C4B9e135BAe"
      values.$members.7:
-        "0x4D8007a0E9f293e62E2b0F43C6Cf4C4B9e135BAe"
+        "0xefCf0c8faFB425997870f845e26fC6cA6EE6dD5C"
      values.$members.6:
-        "0xefCf0c8faFB425997870f845e26fC6cA6EE6dD5C"
+        "0xa0C600a6e85bf225958FFAcC70B5FDDF9A059038"
      values.$members.5:
-        "0xa0C600a6e85bf225958FFAcC70B5FDDF9A059038"
+        "0x3840f487A17A41100DD1Bf0946c34f132a57Fd5f"
      values.$members.4:
-        "0x3840f487A17A41100DD1Bf0946c34f132a57Fd5f"
+        "0xa4000bDD2bB92ce6750b31F1eeda47Bd1cB8e6e4"
      values.$members.3:
-        "0xa4000bDD2bB92ce6750b31F1eeda47Bd1cB8e6e4"
+        "0xF0B77EaE7F2dabCC2571c7418406A0dCA3afA4f0"
      values.$members.2:
-        "0xF0B77EaE7F2dabCC2571c7418406A0dCA3afA4f0"
+        "0xF3313C48BD8E17b823d5498D62F37019dFEA647D"
      values.$members.1:
-        "0xF3313C48BD8E17b823d5498D62F37019dFEA647D"
+        "0xA0737fea60F0601A192E3d2c98865A883ab0bda2"
      values.$members.0:
-        "0xA0737fea60F0601A192E3d2c98865A883ab0bda2"
+        "0x50930d652266EF4127FA3A1906B7Cb9951076628"
      values.multisigThreshold:
-        "4 of 8 (50%)"
+        "4 of 9 (44%)"
    }
```

Generated with discovered.json: 0xcd56bb0152b78215fa65e3b2cc8d5adbe0bd73bc

# Diff at Wed, 15 Jan 2025 09:07:32 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@3ea176aee1470e5ec80e65adfc81a954f84584d8 block: 21078634
- current block number: 21628882

## Description

DA commitment change. As per the OP stack alt-DA spec, the current commitment is for EigenDA:
```
          EigenDA (da service id byte)
          l
0x 01 01 00 00f9021bf852f842a00...
    l  l
    l  L - - commit type (alt-DA)
    version 1
```

badge changed.

## Watched changes

```diff
    contract SystemConfig (0xF761Cc49bB127AB666899b41CDC4E62fA50cD9ca) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      values.opStackDA.isSomeTxsLengthEqualToCelestiaDAExample:
-        true
+        false
    }
```

Generated with discovered.json: 0x2220bf1da60c03ba861effedadc5e568c69c2745

# Diff at Wed, 08 Jan 2025 08:57:49 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@deefa974378c2cd6b74f061e1f5a494bbbe1d63a block: 21078634
- current block number: 21078634

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21078634 (main branch discovery), not current.

```diff
    contract L1StandardBridge (0x4082C9647c098a6493fb499EaE63b5ce3259c574) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      description:
-        "The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token."
+        "The main entry point to deposit ERC20 tokens from host chain to this chain."
    }
```

Generated with discovered.json: 0xfb9ab40cd447dc4794600b1c2699dd305b17c1a7

# Diff at Fri, 01 Nov 2024 12:08:59 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@cd1f0e71bb08ce16b2084a11b768538e8aa6ba8c block: 21078634
- current block number: 21078634

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21078634 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x27ff92b30Cae00dABCF8045cc68fc9dcB67C5019) {
    +++ description: None
      directlyReceivedPermissions.1.description:
-        "upgrading bridge implementation allows to access all funds and change every system component."
+        "upgrading the bridge implementation can give access to all funds escrowed therein."
    }
```

```diff
    contract L1StandardBridge (0x4082C9647c098a6493fb499EaE63b5ce3259c574) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token.
      issuedPermissions.0.via.0.description:
-        "upgrading bridge implementation allows to access all funds and change every system component."
+        "upgrading the bridge implementation can give access to all funds escrowed therein."
    }
```

```diff
    contract ConduitMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      receivedPermissions.4.description:
-        "upgrading bridge implementation allows to access all funds and change every system component."
+        "upgrading the bridge implementation can give access to all funds escrowed therein."
    }
```

Generated with discovered.json: 0xf490776f4150a2b8d90f63e8fb3320f2534d6504

# Diff at Wed, 30 Oct 2024 13:04:07 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@0a8a53530022c6c5edd257c3682a3e7f80d0c550 block: 20920177
- current block number: 21078634

## Description

Conduit Multisig: Signer added.

## Watched changes

```diff
    contract ConduitMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      values.$members.7:
+        "0x4D8007a0E9f293e62E2b0F43C6Cf4C4B9e135BAe"
      values.$members.6:
-        "0x4D8007a0E9f293e62E2b0F43C6Cf4C4B9e135BAe"
+        "0xefCf0c8faFB425997870f845e26fC6cA6EE6dD5C"
      values.$members.5:
-        "0xefCf0c8faFB425997870f845e26fC6cA6EE6dD5C"
+        "0xa0C600a6e85bf225958FFAcC70B5FDDF9A059038"
      values.$members.4:
-        "0xa0C600a6e85bf225958FFAcC70B5FDDF9A059038"
+        "0x3840f487A17A41100DD1Bf0946c34f132a57Fd5f"
      values.$members.3:
-        "0x3840f487A17A41100DD1Bf0946c34f132a57Fd5f"
+        "0xa4000bDD2bB92ce6750b31F1eeda47Bd1cB8e6e4"
      values.$members.2:
-        "0xa4000bDD2bB92ce6750b31F1eeda47Bd1cB8e6e4"
+        "0xF0B77EaE7F2dabCC2571c7418406A0dCA3afA4f0"
      values.$members.1:
-        "0xF0B77EaE7F2dabCC2571c7418406A0dCA3afA4f0"
+        "0xF3313C48BD8E17b823d5498D62F37019dFEA647D"
      values.$members.0:
-        "0xF3313C48BD8E17b823d5498D62F37019dFEA647D"
+        "0xA0737fea60F0601A192E3d2c98865A883ab0bda2"
      values.multisigThreshold:
-        "4 of 7 (57%)"
+        "4 of 8 (50%)"
    }
```

Generated with discovered.json: 0xbdc880f6268b6e65a7972792dd7b566f0ee8df3c

# Diff at Tue, 29 Oct 2024 13:03:17 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@7b3fc9dc9074e1d423b48522c3f0273c86aab54a block: 20920177
- current block number: 20920177

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20920177 (main branch discovery), not current.

```diff
    contract L2OutputOracle (0x909E51211e959339EFb14b36f5A50955a8ae3770) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      fieldMeta:
+        {"FINALIZATION_PERIOD_SECONDS":{"description":"Challenge period (Number of seconds until a state root is finalized)."}}
    }
```

Generated with discovered.json: 0xd106d6330d1e67690056ea20149b29ebc51a2ce5

# Diff at Mon, 21 Oct 2024 12:42:08 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@e660599f23a07618fe949a07be1f516ce44f1914 block: 20920177
- current block number: 20920177

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20920177 (main branch discovery), not current.

```diff
    contract L1CrossDomainMessenger (0x11dd2d9B5ec142dbAFBEFEA82a75985Eae4e12b0) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      descriptions:
-        ["Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function."]
      description:
+        "Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function."
    }
```

```diff
    contract L1StandardBridge (0x4082C9647c098a6493fb499EaE63b5ce3259c574) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token.
      descriptions:
-        ["The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token."]
      description:
+        "The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token."
    }
```

```diff
    contract OptimismPortal (0x787A0ACaB02437c60Aafb1a29167A3609801e320) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      descriptions:
-        ["The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals."]
      description:
+        "The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals."
    }
```

```diff
    contract AddressManager (0x7a616b25E7c96fc4d652966d7DDAbB51dE28eCc1) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      descriptions:
-        ["Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts."]
      description:
+        "Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts."
    }
```

```diff
    contract L2OutputOracle (0x909E51211e959339EFb14b36f5A50955a8ae3770) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      descriptions:
-        ["Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots."]
      description:
+        "Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots."
    }
```

```diff
    contract SystemConfig (0xF761Cc49bB127AB666899b41CDC4E62fA50cD9ca) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      descriptions:
-        ["Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address."]
      description:
+        "Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address."
    }
```

Generated with discovered.json: 0xa34b1ace6ad3dda701d8aaecaeb24a3e61a5abe6

# Diff at Mon, 21 Oct 2024 11:03:45 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@8895d33866f5665c4c710f4ddaa32bfa63cc3c78 block: 20920177
- current block number: 20920177

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20920177 (main branch discovery), not current.

```diff
    contract L1CrossDomainMessenger (0x11dd2d9B5ec142dbAFBEFEA82a75985Eae4e12b0) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      values.$pastUpgrades.5.2:
+        ["0x8CfF5bDb1B428B979E3D87087dA8549A28065DDB"]
      values.$pastUpgrades.5.1:
-        ["0x8CfF5bDb1B428B979E3D87087dA8549A28065DDB"]
+        "0x60f1457bbf8e61f25203769ade47092100fb0d0f105d1b0a4734dbb052b0910d"
      values.$pastUpgrades.4.2:
+        ["0x8ea8000814b14884317dF94D2fD26553C3fFd976"]
      values.$pastUpgrades.4.1:
-        ["0x8ea8000814b14884317dF94D2fD26553C3fFd976"]
+        "0xd19ed55de296e03d3a00afdf5272d8ef73404602966de1682de751bc91e0f8e6"
      values.$pastUpgrades.3.2:
+        ["0x8ea8000814b14884317dF94D2fD26553C3fFd976"]
      values.$pastUpgrades.3.1:
-        ["0x8ea8000814b14884317dF94D2fD26553C3fFd976"]
+        "0x45f84133cdae2a8b259ab309ca0d499a0b175986c08a4e313ac25109b1dd858c"
      values.$pastUpgrades.2.2:
+        ["0x8ea8000814b14884317dF94D2fD26553C3fFd976"]
      values.$pastUpgrades.2.1:
-        ["0x8ea8000814b14884317dF94D2fD26553C3fFd976"]
+        "0x2967e7dde9e9a7b2e1535c014117e73b29d0a5f486b533bbf2461c34c36a3ff6"
      values.$pastUpgrades.1.2:
+        ["0xfA6aCD3c452ADE8910505cc61352274b4C6d526c"]
      values.$pastUpgrades.1.1:
-        ["0xfA6aCD3c452ADE8910505cc61352274b4C6d526c"]
+        "0x081ad9f0592ee5da39dceb73ea43b57f1442749d480a756e4938bf4999f0ee22"
      values.$pastUpgrades.0.2:
+        ["0x0000000000000000000000000000000000000000"]
      values.$pastUpgrades.0.1:
-        ["0x0000000000000000000000000000000000000000"]
+        "0x7abed0916f03770749ed56034cabc49ae8e403a7940bc4137493e439e431d609"
    }
```

```diff
    contract OptimismPortal (0x787A0ACaB02437c60Aafb1a29167A3609801e320) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      values.$pastUpgrades.2.2:
+        ["0x098927F692C86fA1722115652b9d2d7BE8cBa6D3"]
      values.$pastUpgrades.2.1:
-        ["0x098927F692C86fA1722115652b9d2d7BE8cBa6D3"]
+        "0x60f1457bbf8e61f25203769ade47092100fb0d0f105d1b0a4734dbb052b0910d"
      values.$pastUpgrades.1.2:
+        ["0xD45C7A59fca1b435ae805E8F6eF27418d92877AD"]
      values.$pastUpgrades.1.1:
-        ["0xD45C7A59fca1b435ae805E8F6eF27418d92877AD"]
+        "0x67627d33be7254318cea66122094bf3260d8dba551983dee907390414090503b"
      values.$pastUpgrades.0.2:
+        ["0x9Cb22AF811cFF79b89d25570FAC31586af7b4a97"]
      values.$pastUpgrades.0.1:
-        ["0x9Cb22AF811cFF79b89d25570FAC31586af7b4a97"]
+        "0x081ad9f0592ee5da39dceb73ea43b57f1442749d480a756e4938bf4999f0ee22"
    }
```

```diff
    contract L2OutputOracle (0x909E51211e959339EFb14b36f5A50955a8ae3770) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      values.$pastUpgrades.3.2:
+        ["0x0af92E6944900abA4B9BAC1417bA13ED6F45c27f"]
      values.$pastUpgrades.3.1:
-        ["0x0af92E6944900abA4B9BAC1417bA13ED6F45c27f"]
+        "0x60f1457bbf8e61f25203769ade47092100fb0d0f105d1b0a4734dbb052b0910d"
      values.$pastUpgrades.2.2:
+        ["0xb717dF06e095Bc7438721964DD43a2532963E885"]
      values.$pastUpgrades.2.1:
-        ["0xb717dF06e095Bc7438721964DD43a2532963E885"]
+        "0x919f18f60fdf6f2a0caba6d91002f7124eed9ff6f795eb0b283b8d6d94ec58ca"
      values.$pastUpgrades.1.2:
+        ["0xfbc5b862CE0007AfD9fc58cf07D8A00Cf494fAAA"]
      values.$pastUpgrades.1.1:
-        ["0xfbc5b862CE0007AfD9fc58cf07D8A00Cf494fAAA"]
+        "0x52bf2ebf9e73d5b6c5119b9fb5cb5346c2784dbb9bb7ab4de28cc289e5ffcafd"
      values.$pastUpgrades.0.2:
+        ["0x2EFA0d1CBd36Aa0db7C0b59d32F6dA68cA83A722"]
      values.$pastUpgrades.0.1:
-        ["0x2EFA0d1CBd36Aa0db7C0b59d32F6dA68cA83A722"]
+        "0x081ad9f0592ee5da39dceb73ea43b57f1442749d480a756e4938bf4999f0ee22"
    }
```

```diff
    contract SystemConfig (0xF761Cc49bB127AB666899b41CDC4E62fA50cD9ca) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      values.$pastUpgrades.2.2:
+        ["0xA872bca05c9F8A97CC36D879e43B33dB8ed7b69E"]
      values.$pastUpgrades.2.1:
-        ["0xA872bca05c9F8A97CC36D879e43B33dB8ed7b69E"]
+        "0x60f1457bbf8e61f25203769ade47092100fb0d0f105d1b0a4734dbb052b0910d"
      values.$pastUpgrades.1.2:
+        ["0x98F5f3455B71C297e4f7D7Cd1FAA80b5CDf4A542"]
      values.$pastUpgrades.1.1:
-        ["0x98F5f3455B71C297e4f7D7Cd1FAA80b5CDf4A542"]
+        "0xdd0f719c148c6de4894f667a50f2b580ee92fbe7cd673e918aebe05c7b49266b"
      values.$pastUpgrades.0.2:
+        ["0x552FFBdDFB01B6F7f3A3C39E9d3D0A5Fa8436394"]
      values.$pastUpgrades.0.1:
-        ["0x552FFBdDFB01B6F7f3A3C39E9d3D0A5Fa8436394"]
+        "0xbef016225c40c0d75131bc4e8a5f6ce6f7a5c872e2449f267413c5bbc6afbf25"
    }
```

Generated with discovered.json: 0x95334861e4b89e2c74a101448825fb2c397a2437

# Diff at Wed, 16 Oct 2024 11:34:23 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@a3d139b799cc0b28e5e912febb17464d4e5aef5d block: 20920177
- current block number: 20920177

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20920177 (main branch discovery), not current.

```diff
    contract ConduitMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      roles:
-        ["Challenger","Guardian"]
      receivedPermissions.7:
+        {"permission":"upgrade","target":"0xF761Cc49bB127AB666899b41CDC4E62fA50cD9ca","via":[{"address":"0x27ff92b30Cae00dABCF8045cc68fc9dcB67C5019"}]}
      receivedPermissions.6:
+        {"permission":"upgrade","target":"0x909E51211e959339EFb14b36f5A50955a8ae3770","via":[{"address":"0x27ff92b30Cae00dABCF8045cc68fc9dcB67C5019"}]}
      receivedPermissions.5.target:
-        "0xF761Cc49bB127AB666899b41CDC4E62fA50cD9ca"
+        "0x787A0ACaB02437c60Aafb1a29167A3609801e320"
      receivedPermissions.4.target:
-        "0x909E51211e959339EFb14b36f5A50955a8ae3770"
+        "0x4082C9647c098a6493fb499EaE63b5ce3259c574"
      receivedPermissions.4.description:
+        "upgrading bridge implementation allows to access all funds and change every system component."
      receivedPermissions.3.permission:
-        "upgrade"
+        "guard"
      receivedPermissions.3.via:
-        [{"address":"0x27ff92b30Cae00dABCF8045cc68fc9dcB67C5019"}]
      receivedPermissions.2.permission:
-        "upgrade"
+        "configure"
      receivedPermissions.2.target:
-        "0x4082C9647c098a6493fb499EaE63b5ce3259c574"
+        "0xF761Cc49bB127AB666899b41CDC4E62fA50cD9ca"
      receivedPermissions.2.description:
-        "upgrading bridge implementation allows to access all funds and change every system component."
+        "it can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system."
      receivedPermissions.2.via:
-        [{"address":"0x27ff92b30Cae00dABCF8045cc68fc9dcB67C5019"}]
      receivedPermissions.1.target:
-        "0xF761Cc49bB127AB666899b41CDC4E62fA50cD9ca"
+        "0x7a616b25E7c96fc4d652966d7DDAbB51dE28eCc1"
      receivedPermissions.1.description:
-        "it can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system."
+        "set and change address mappings."
      receivedPermissions.1.via:
+        [{"address":"0x27ff92b30Cae00dABCF8045cc68fc9dcB67C5019"}]
      receivedPermissions.0.permission:
-        "configure"
+        "challenge"
      receivedPermissions.0.target:
-        "0x7a616b25E7c96fc4d652966d7DDAbB51dE28eCc1"
+        "0x909E51211e959339EFb14b36f5A50955a8ae3770"
      receivedPermissions.0.description:
-        "set and change address mappings."
      receivedPermissions.0.via:
-        [{"address":"0x27ff92b30Cae00dABCF8045cc68fc9dcB67C5019"}]
    }
```

```diff
    contract OptimismPortal (0x787A0ACaB02437c60Aafb1a29167A3609801e320) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      issuedPermissions.1:
+        {"permission":"upgrade","target":"0x4a4962275DF8C60a80d3a25faEc5AA7De116A746","via":[{"address":"0x27ff92b30Cae00dABCF8045cc68fc9dcB67C5019","delay":0}]}
      issuedPermissions.0.permission:
-        "upgrade"
+        "guard"
      issuedPermissions.0.via.0:
-        {"address":"0x27ff92b30Cae00dABCF8045cc68fc9dcB67C5019","delay":0}
    }
```

```diff
    contract L2OutputOracle (0x909E51211e959339EFb14b36f5A50955a8ae3770) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      issuedPermissions.2:
+        {"permission":"upgrade","target":"0x4a4962275DF8C60a80d3a25faEc5AA7De116A746","via":[{"address":"0x27ff92b30Cae00dABCF8045cc68fc9dcB67C5019","delay":0}]}
      issuedPermissions.1:
+        {"permission":"propose","target":"0x75ACb7ae6C76B3f5cA049431FE2c0797dD002b90","via":[]}
      issuedPermissions.0.permission:
-        "upgrade"
+        "challenge"
      issuedPermissions.0.via.0:
-        {"address":"0x27ff92b30Cae00dABCF8045cc68fc9dcB67C5019","delay":0}
    }
```

```diff
    contract SystemConfig (0xF761Cc49bB127AB666899b41CDC4E62fA50cD9ca) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      issuedPermissions.2:
+        {"permission":"upgrade","target":"0x4a4962275DF8C60a80d3a25faEc5AA7De116A746","via":[{"address":"0x27ff92b30Cae00dABCF8045cc68fc9dcB67C5019","delay":0}]}
      issuedPermissions.1.permission:
-        "upgrade"
+        "sequence"
      issuedPermissions.1.target:
-        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
+        "0x889e21d7BA3d6dD62e75d4980A4Ad1349c61599d"
      issuedPermissions.1.via.0:
-        {"address":"0x27ff92b30Cae00dABCF8045cc68fc9dcB67C5019","delay":0}
    }
```

Generated with discovered.json: 0x39a41eda6e3ff2b2673d73386c1d3244828dadee

# Diff at Mon, 14 Oct 2024 10:48:35 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1afc77ff111ceb0970e7d09efcc7b2f376b0c281 block: 20920177
- current block number: 20920177

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20920177 (main branch discovery), not current.

```diff
    contract L1CrossDomainMessenger (0x11dd2d9B5ec142dbAFBEFEA82a75985Eae4e12b0) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      sourceHashes:
+        ["0x20a2eb4d3677fc8a15e944f7b1843acd01b2e92acdc4c7a7f7a35b07b891149b","0xebfb36a18bcaa176678925149b43fdc5f9f943d98a6405ae1cbc26f4c168ff88"]
    }
```

```diff
    contract ProxyAdmin (0x27ff92b30Cae00dABCF8045cc68fc9dcB67C5019) {
    +++ description: None
      template:
-        "opstack/ProxyAdmin"
+        "global/ProxyAdmin"
      sourceHashes:
+        ["0x96d2f0fa1bd83ebd61ba6a2351c64c7fda7aa580b11ea67bb6bf4338e5c28512"]
    }
```

```diff
    contract L1StandardBridge (0x4082C9647c098a6493fb499EaE63b5ce3259c574) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token.
      sourceHashes:
+        ["0xbfb58685ff2f2f07eaa01a3c4e3c33c97686bfd3ae7c50c49f9da6ef5098cb31","0x79abdbd90460fe2ac0535b5cb7b4c45284322b49a0a090d1c509cdaf35dbc87e"]
    }
```

```diff
    contract ConduitMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      sourceHashes:
+        ["0x81a7349eebb98ac33b0bc6842e3cb258034a8f2a4ba004570bb8e2e25947f9ff","0xd42bbf9f7dcd3720a7fc6bdc6edfdfae8800a37d6dd4decfa0ef6ca4a2e88940"]
    }
```

```diff
    contract OptimismPortal (0x787A0ACaB02437c60Aafb1a29167A3609801e320) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      sourceHashes:
+        ["0x2cdcfef705094aaac53d507bad64d27b48ea5a9c11a7fadffacc192aab7a823f","0xd7fe53899c31d6d8e73b6724694736dc3c3c4ebc8f4ddbe989fe9d3dba26692d"]
    }
```

```diff
    contract AddressManager (0x7a616b25E7c96fc4d652966d7DDAbB51dE28eCc1) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      sourceHashes:
+        ["0xdc86a850f11dc2b5c0472a05d0e3c14f239baf2c3b1ab19631591b0827985380"]
    }
```

```diff
    contract L2OutputOracle (0x909E51211e959339EFb14b36f5A50955a8ae3770) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      sourceHashes:
+        ["0x2cdcfef705094aaac53d507bad64d27b48ea5a9c11a7fadffacc192aab7a823f","0xcca8986d0789aa489ba57cd234e886bd92cb5a0d477e1f5ae5e6e030e15fb183"]
    }
```

```diff
    contract SystemConfig (0xF761Cc49bB127AB666899b41CDC4E62fA50cD9ca) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      sourceHashes:
+        ["0x2cdcfef705094aaac53d507bad64d27b48ea5a9c11a7fadffacc192aab7a823f","0x29908eb7685943ff431cd384af851ce36a30997bbad880f9b4385bfc3abb86a2"]
    }
```

Generated with discovered.json: 0xef9b3a41f47739dcf57b0e7d9d3d566941e04a49

# Diff at Wed, 09 Oct 2024 13:08:51 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@37683e2b3d0587372f886eef49e921277810c8bf block: 20920177
- current block number: 20920177

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20920177 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x27ff92b30Cae00dABCF8045cc68fc9dcB67C5019) {
    +++ description: None
      directlyReceivedPermissions.0.description:
+        "set and change address mappings."
    }
```

```diff
    contract ConduitMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      receivedPermissions.0.description:
+        "set and change address mappings."
    }
```

```diff
    contract AddressManager (0x7a616b25E7c96fc4d652966d7DDAbB51dE28eCc1) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      issuedPermissions.0.via.0.description:
+        "set and change address mappings."
      descriptions:
+        ["Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts."]
    }
```

Generated with discovered.json: 0x7837e1d0d2733afb5b4762c9d3206085fe15efa3

# Diff at Tue, 01 Oct 2024 10:49:26 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bd754dc73c66120164006054f8d25c5fae9cd910 block: 20775852
- current block number: 20775852

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20775852 (main branch discovery), not current.

```diff
    contract L1CrossDomainMessenger (0x11dd2d9B5ec142dbAFBEFEA82a75985Eae4e12b0) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      values.$pastUpgrades:
+        [["2023-03-19T02:37:11.000Z",["0x0000000000000000000000000000000000000000"]],["2023-03-19T02:38:11.000Z",["0xfA6aCD3c452ADE8910505cc61352274b4C6d526c"]],["2023-04-01T20:56:11.000Z",["0x8ea8000814b14884317dF94D2fD26553C3fFd976"]],["2023-04-01T20:58:11.000Z",["0x8ea8000814b14884317dF94D2fD26553C3fFd976"]],["2023-04-01T20:58:59.000Z",["0x8ea8000814b14884317dF94D2fD26553C3fFd976"]],["2023-08-30T22:08:35.000Z",["0x8CfF5bDb1B428B979E3D87087dA8549A28065DDB"]]]
      values.$upgradeCount:
+        6
    }
```

```diff
    contract L1StandardBridge (0x4082C9647c098a6493fb499EaE63b5ce3259c574) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token.
      values.$pastUpgrades:
+        []
    }
```

```diff
    contract OptimismPortal (0x787A0ACaB02437c60Aafb1a29167A3609801e320) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      values.$pastUpgrades:
+        [["2023-03-19T02:38:11.000Z",["0x9Cb22AF811cFF79b89d25570FAC31586af7b4a97"]],["2023-04-01T20:59:47.000Z",["0xD45C7A59fca1b435ae805E8F6eF27418d92877AD"]],["2023-08-30T22:08:35.000Z",["0x098927F692C86fA1722115652b9d2d7BE8cBa6D3"]]]
    }
```

```diff
    contract L2OutputOracle (0x909E51211e959339EFb14b36f5A50955a8ae3770) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      values.$pastUpgrades:
+        [["2023-03-19T02:38:11.000Z",["0x2EFA0d1CBd36Aa0db7C0b59d32F6dA68cA83A722"]],["2023-03-27T23:14:35.000Z",["0xfbc5b862CE0007AfD9fc58cf07D8A00Cf494fAAA"]],["2023-04-01T20:59:23.000Z",["0xb717dF06e095Bc7438721964DD43a2532963E885"]],["2023-08-30T22:08:35.000Z",["0x0af92E6944900abA4B9BAC1417bA13ED6F45c27f"]]]
    }
```

```diff
    contract SystemConfig (0xF761Cc49bB127AB666899b41CDC4E62fA50cD9ca) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      values.$pastUpgrades:
+        [["2023-03-19T02:36:59.000Z",["0x552FFBdDFB01B6F7f3A3C39E9d3D0A5Fa8436394"]],["2023-04-01T20:59:59.000Z",["0x98F5f3455B71C297e4f7D7Cd1FAA80b5CDf4A542"]],["2023-08-30T22:08:35.000Z",["0xA872bca05c9F8A97CC36D879e43B33dB8ed7b69E"]]]
    }
```

Generated with discovered.json: 0x0c694cf4f80dcef08a16c48165cc74f596a0a51c

# Diff at Wed, 18 Sep 2024 11:31:00 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@eb09774f0f9d9322f2117dfdfda7d4bb095f6c52 block: 19927688
- current block number: 20775852

## Description

Shape related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19927688 (main branch discovery), not current.

```diff
    contract L1CrossDomainMessenger (0x11dd2d9B5ec142dbAFBEFEA82a75985Eae4e12b0) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      template:
+        "opstack/L1CrossDomainMessenger"
      descriptions:
+        ["Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function."]
      categories:
+        ["Core"]
    }
```

```diff
    contract ProxyAdmin (0x27ff92b30Cae00dABCF8045cc68fc9dcB67C5019) {
    +++ description: None
      directlyReceivedPermissions.1.description:
+        "upgrading bridge implementation allows to access all funds and change every system component."
    }
```

```diff
    contract L1StandardBridge (0x4082C9647c098a6493fb499EaE63b5ce3259c574) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token.
      issuedPermissions.0.via.0.description:
+        "upgrading bridge implementation allows to access all funds and change every system component."
      template:
+        "opstack/L1StandardBridge"
      descriptions:
+        ["The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token."]
    }
```

```diff
    contract ConduitMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      receivedPermissions.5:
+        {"permission":"upgrade","target":"0xF761Cc49bB127AB666899b41CDC4E62fA50cD9ca","via":[{"address":"0x27ff92b30Cae00dABCF8045cc68fc9dcB67C5019"}]}
      receivedPermissions.4.target:
-        "0xF761Cc49bB127AB666899b41CDC4E62fA50cD9ca"
+        "0x909E51211e959339EFb14b36f5A50955a8ae3770"
      receivedPermissions.3.target:
-        "0x909E51211e959339EFb14b36f5A50955a8ae3770"
+        "0x787A0ACaB02437c60Aafb1a29167A3609801e320"
      receivedPermissions.2.target:
-        "0x787A0ACaB02437c60Aafb1a29167A3609801e320"
+        "0x4082C9647c098a6493fb499EaE63b5ce3259c574"
      receivedPermissions.2.description:
+        "upgrading bridge implementation allows to access all funds and change every system component."
      receivedPermissions.1.permission:
-        "upgrade"
+        "configure"
      receivedPermissions.1.target:
-        "0x4082C9647c098a6493fb499EaE63b5ce3259c574"
+        "0xF761Cc49bB127AB666899b41CDC4E62fA50cD9ca"
      receivedPermissions.1.via:
-        [{"address":"0x27ff92b30Cae00dABCF8045cc68fc9dcB67C5019"}]
      receivedPermissions.1.description:
+        "it can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system."
      roles:
+        ["Challenger","Guardian"]
    }
```

```diff
    contract OptimismPortal (0x787A0ACaB02437c60Aafb1a29167A3609801e320) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      template:
+        "opstack/OptimismPortal"
      descriptions:
+        ["The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals."]
    }
```

```diff
    contract L2OutputOracle (0x909E51211e959339EFb14b36f5A50955a8ae3770) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      template:
+        "opstack/L2OutputOracle"
      descriptions:
+        ["Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots."]
    }
```

```diff
    contract SystemConfig (0xF761Cc49bB127AB666899b41CDC4E62fA50cD9ca) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      issuedPermissions.1:
+        {"permission":"upgrade","target":"0x4a4962275DF8C60a80d3a25faEc5AA7De116A746","via":[{"address":"0x27ff92b30Cae00dABCF8045cc68fc9dcB67C5019","delay":0}]}
      issuedPermissions.0.permission:
-        "upgrade"
+        "configure"
      issuedPermissions.0.via.0:
-        {"address":"0x27ff92b30Cae00dABCF8045cc68fc9dcB67C5019","delay":0}
      template:
+        "opstack/SystemConfig"
      descriptions:
+        ["Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address."]
      fieldMeta:
+        {"gasLimit":{"severity":"LOW","description":"Gas limit for blocks on L2."}}
    }
```

Generated with discovered.json: 0x22bdeca9fe8c7fb73dbf1ea6a0ac0696d356ecf9

# Diff at Sun, 08 Sep 2024 17:17:46 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@fd881462cca0d7ef4519f907f3c6cfd5fe1cde8f block: 19927688
- current block number: 19927688

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19927688 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x27ff92b30Cae00dABCF8045cc68fc9dcB67C5019) {
    +++ description: None
      issuedPermissions:
-        [{"permission":"configure","target":"0x4a4962275DF8C60a80d3a25faEc5AA7De116A746","via":[]}]
      receivedPermissions:
-        [{"permission":"configure","target":"0x7a616b25E7c96fc4d652966d7DDAbB51dE28eCc1"},{"permission":"upgrade","target":"0x4082C9647c098a6493fb499EaE63b5ce3259c574"},{"permission":"upgrade","target":"0x787A0ACaB02437c60Aafb1a29167A3609801e320"},{"permission":"upgrade","target":"0x909E51211e959339EFb14b36f5A50955a8ae3770"},{"permission":"upgrade","target":"0xF761Cc49bB127AB666899b41CDC4E62fA50cD9ca"}]
      directlyReceivedPermissions:
+        [{"permission":"configure","target":"0x7a616b25E7c96fc4d652966d7DDAbB51dE28eCc1"},{"permission":"upgrade","target":"0x4082C9647c098a6493fb499EaE63b5ce3259c574"},{"permission":"upgrade","target":"0x787A0ACaB02437c60Aafb1a29167A3609801e320"},{"permission":"upgrade","target":"0x909E51211e959339EFb14b36f5A50955a8ae3770"},{"permission":"upgrade","target":"0xF761Cc49bB127AB666899b41CDC4E62fA50cD9ca"}]
    }
```

```diff
    contract L1StandardBridge (0x4082C9647c098a6493fb499EaE63b5ce3259c574) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x27ff92b30Cae00dABCF8045cc68fc9dcB67C5019"
+        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      issuedPermissions.0.via.0:
+        {"address":"0x27ff92b30Cae00dABCF8045cc68fc9dcB67C5019","delay":0}
    }
```

```diff
    contract ConduitMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      descriptions:
-        ["It can act on behalf of 0x27ff92b30Cae00dABCF8045cc68fc9dcB67C5019, inheriting its permissions."]
      receivedPermissions.4:
+        {"permission":"upgrade","target":"0xF761Cc49bB127AB666899b41CDC4E62fA50cD9ca","via":[{"address":"0x27ff92b30Cae00dABCF8045cc68fc9dcB67C5019"}]}
      receivedPermissions.3:
+        {"permission":"upgrade","target":"0x909E51211e959339EFb14b36f5A50955a8ae3770","via":[{"address":"0x27ff92b30Cae00dABCF8045cc68fc9dcB67C5019"}]}
      receivedPermissions.2:
+        {"permission":"upgrade","target":"0x787A0ACaB02437c60Aafb1a29167A3609801e320","via":[{"address":"0x27ff92b30Cae00dABCF8045cc68fc9dcB67C5019"}]}
      receivedPermissions.1:
+        {"permission":"upgrade","target":"0x4082C9647c098a6493fb499EaE63b5ce3259c574","via":[{"address":"0x27ff92b30Cae00dABCF8045cc68fc9dcB67C5019"}]}
      receivedPermissions.0.target:
-        "0x27ff92b30Cae00dABCF8045cc68fc9dcB67C5019"
+        "0x7a616b25E7c96fc4d652966d7DDAbB51dE28eCc1"
      receivedPermissions.0.via:
+        [{"address":"0x27ff92b30Cae00dABCF8045cc68fc9dcB67C5019"}]
      directlyReceivedPermissions:
+        [{"permission":"act","target":"0x27ff92b30Cae00dABCF8045cc68fc9dcB67C5019"}]
    }
```

```diff
    contract OptimismPortal (0x787A0ACaB02437c60Aafb1a29167A3609801e320) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x27ff92b30Cae00dABCF8045cc68fc9dcB67C5019"
+        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      issuedPermissions.0.via.0:
+        {"address":"0x27ff92b30Cae00dABCF8045cc68fc9dcB67C5019","delay":0}
    }
```

```diff
    contract AddressManager (0x7a616b25E7c96fc4d652966d7DDAbB51dE28eCc1) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x27ff92b30Cae00dABCF8045cc68fc9dcB67C5019"
+        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      issuedPermissions.0.via.0:
+        {"address":"0x27ff92b30Cae00dABCF8045cc68fc9dcB67C5019","delay":0}
    }
```

```diff
    contract L2OutputOracle (0x909E51211e959339EFb14b36f5A50955a8ae3770) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x27ff92b30Cae00dABCF8045cc68fc9dcB67C5019"
+        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      issuedPermissions.0.via.0:
+        {"address":"0x27ff92b30Cae00dABCF8045cc68fc9dcB67C5019","delay":0}
    }
```

```diff
    contract SystemConfig (0xF761Cc49bB127AB666899b41CDC4E62fA50cD9ca) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x27ff92b30Cae00dABCF8045cc68fc9dcB67C5019"
+        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      issuedPermissions.0.via.0:
+        {"address":"0x27ff92b30Cae00dABCF8045cc68fc9dcB67C5019","delay":0}
    }
```

Generated with discovered.json: 0x9c819f01a661cd94f84f4004336eafc9e1aefc95

# Diff at Fri, 30 Aug 2024 07:50:54 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@6c1bd1f41fadf5f2cb1c1805b5a2c6138a3ed35a block: 19927688
- current block number: 19927688

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19927688 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x27ff92b30Cae00dABCF8045cc68fc9dcB67C5019) {
    +++ description: None
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
    contract ConduitMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: It can act on behalf of 0x27ff92b30Cae00dABCF8045cc68fc9dcB67C5019, inheriting its permissions.
      receivedPermissions.0.via:
-        []
    }
```

Generated with discovered.json: 0xbce73f390f3e47eecb3024cb6bf4536feab9e7c0

# Diff at Fri, 23 Aug 2024 09:50:55 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@67597c7d6c810bc726594446890178150240711e block: 19927688
- current block number: 19927688

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19927688 (main branch discovery), not current.

```diff
    contract L1StandardBridge (0x4082C9647c098a6493fb499EaE63b5ce3259c574) {
    +++ description: None
      values.$upgradeCount:
+        0
    }
```

```diff
    contract OptimismPortal (0x787A0ACaB02437c60Aafb1a29167A3609801e320) {
    +++ description: None
      values.$upgradeCount:
+        3
    }
```

```diff
    contract L2OutputOracle (0x909E51211e959339EFb14b36f5A50955a8ae3770) {
    +++ description: None
      values.$upgradeCount:
+        4
    }
```

```diff
    contract SystemConfig (0xF761Cc49bB127AB666899b41CDC4E62fA50cD9ca) {
    +++ description: None
      values.$upgradeCount:
+        3
    }
```

Generated with discovered.json: 0x940825f4d5ccc389ec13cd1898dd8007420541cf

# Diff at Wed, 21 Aug 2024 10:01:41 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@2f6dde3357bf5d79196b6e94f79d853a6c4ec72b block: 19927688
- current block number: 19927688

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19927688 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x27ff92b30Cae00dABCF8045cc68fc9dcB67C5019) {
    +++ description: None
      assignedPermissions:
-        {"upgrade":["0x4082C9647c098a6493fb499EaE63b5ce3259c574","0x787A0ACaB02437c60Aafb1a29167A3609801e320","0x909E51211e959339EFb14b36f5A50955a8ae3770","0xF761Cc49bB127AB666899b41CDC4E62fA50cD9ca"],"configure":["0x7a616b25E7c96fc4d652966d7DDAbB51dE28eCc1"]}
      issuedPermissions:
+        [{"permission":"configure","target":"0x4a4962275DF8C60a80d3a25faEc5AA7De116A746","via":[]}]
      receivedPermissions:
+        [{"permission":"configure","target":"0x7a616b25E7c96fc4d652966d7DDAbB51dE28eCc1","via":[]},{"permission":"upgrade","target":"0x4082C9647c098a6493fb499EaE63b5ce3259c574","via":[]},{"permission":"upgrade","target":"0x787A0ACaB02437c60Aafb1a29167A3609801e320","via":[]},{"permission":"upgrade","target":"0x909E51211e959339EFb14b36f5A50955a8ae3770","via":[]},{"permission":"upgrade","target":"0xF761Cc49bB127AB666899b41CDC4E62fA50cD9ca","via":[]}]
    }
```

```diff
    contract L1StandardBridge (0x4082C9647c098a6493fb499EaE63b5ce3259c574) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x27ff92b30Cae00dABCF8045cc68fc9dcB67C5019","via":[]}]
    }
```

```diff
    contract ConduitMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: It can act on behalf of 0x27ff92b30Cae00dABCF8045cc68fc9dcB67C5019, inheriting its permissions.
      assignedPermissions:
-        {"configure":["0x27ff92b30Cae00dABCF8045cc68fc9dcB67C5019"]}
      receivedPermissions:
+        [{"permission":"configure","target":"0x27ff92b30Cae00dABCF8045cc68fc9dcB67C5019","via":[]}]
    }
```

```diff
    contract OptimismPortal (0x787A0ACaB02437c60Aafb1a29167A3609801e320) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x27ff92b30Cae00dABCF8045cc68fc9dcB67C5019","via":[]}]
    }
```

```diff
    contract AddressManager (0x7a616b25E7c96fc4d652966d7DDAbB51dE28eCc1) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"configure","target":"0x27ff92b30Cae00dABCF8045cc68fc9dcB67C5019","via":[]}]
    }
```

```diff
    contract L2OutputOracle (0x909E51211e959339EFb14b36f5A50955a8ae3770) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x27ff92b30Cae00dABCF8045cc68fc9dcB67C5019","via":[]}]
    }
```

```diff
    contract SystemConfig (0xF761Cc49bB127AB666899b41CDC4E62fA50cD9ca) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x27ff92b30Cae00dABCF8045cc68fc9dcB67C5019","via":[]}]
    }
```

Generated with discovered.json: 0x2cbeb821f96bae0f1cc3737b3cf20caccb8a7a4b

# Diff at Fri, 09 Aug 2024 10:08:20 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f0da1d0aab7bc6b3b5e54e7e93480bd98e57035 block: 19927688
- current block number: 19927688

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19927688 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x27ff92b30Cae00dABCF8045cc68fc9dcB67C5019) {
    +++ description: None
      assignedPermissions.admin:
-        ["0x4082C9647c098a6493fb499EaE63b5ce3259c574","0x787A0ACaB02437c60Aafb1a29167A3609801e320","0x909E51211e959339EFb14b36f5A50955a8ae3770","0xF761Cc49bB127AB666899b41CDC4E62fA50cD9ca"]
      assignedPermissions.owner:
-        ["0x7a616b25E7c96fc4d652966d7DDAbB51dE28eCc1"]
      assignedPermissions.upgrade:
+        ["0x4082C9647c098a6493fb499EaE63b5ce3259c574","0x787A0ACaB02437c60Aafb1a29167A3609801e320","0x909E51211e959339EFb14b36f5A50955a8ae3770","0xF761Cc49bB127AB666899b41CDC4E62fA50cD9ca"]
      assignedPermissions.configure:
+        ["0x7a616b25E7c96fc4d652966d7DDAbB51dE28eCc1"]
    }
```

```diff
    contract ConduitMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: It can act on behalf of 0x27ff92b30Cae00dABCF8045cc68fc9dcB67C5019, inheriting its permissions.
      assignedPermissions.owner:
-        ["0x27ff92b30Cae00dABCF8045cc68fc9dcB67C5019"]
      assignedPermissions.configure:
+        ["0x27ff92b30Cae00dABCF8045cc68fc9dcB67C5019"]
      values.$multisigThreshold:
-        "4 of 7 (57%)"
      values.getOwners:
-        ["0xF3313C48BD8E17b823d5498D62F37019dFEA647D","0xF0B77EaE7F2dabCC2571c7418406A0dCA3afA4f0","0xa4000bDD2bB92ce6750b31F1eeda47Bd1cB8e6e4","0x3840f487A17A41100DD1Bf0946c34f132a57Fd5f","0xa0C600a6e85bf225958FFAcC70B5FDDF9A059038","0xefCf0c8faFB425997870f845e26fC6cA6EE6dD5C","0x4D8007a0E9f293e62E2b0F43C6Cf4C4B9e135BAe"]
      values.getThreshold:
-        4
      values.$members:
+        ["0xF3313C48BD8E17b823d5498D62F37019dFEA647D","0xF0B77EaE7F2dabCC2571c7418406A0dCA3afA4f0","0xa4000bDD2bB92ce6750b31F1eeda47Bd1cB8e6e4","0x3840f487A17A41100DD1Bf0946c34f132a57Fd5f","0xa0C600a6e85bf225958FFAcC70B5FDDF9A059038","0xefCf0c8faFB425997870f845e26fC6cA6EE6dD5C","0x4D8007a0E9f293e62E2b0F43C6Cf4C4B9e135BAe"]
      values.$threshold:
+        4
      values.multisigThreshold:
+        "4 of 7 (57%)"
    }
```

Generated with discovered.json: 0xd006631d52426a7542dbb69b5c018ff0a05af1f4

# Diff at Thu, 18 Jul 2024 10:29:22 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@d89fe52cb65d643cef712d1d7910564a7acf2dce block: 19927688
- current block number: 19927688

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19927688 (main branch discovery), not current.

```diff
    contract ConduitMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      descriptions:
+        ["It can act on behalf of 0x27ff92b30Cae00dABCF8045cc68fc9dcB67C5019, inheriting its permissions."]
    }
```

Generated with discovered.json: 0xe4639032fbd1e336dfb6bc223ea0ea8cb20c2d38

# Diff at Wed, 22 May 2024 20:04:57 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@bac4efad06804152ae97853892e122a801bbc509 block: 19918875
- current block number: 19927688

## Description

ConduitMultisig update.

## Watched changes

```diff
    contract ConduitMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      upgradeability.threshold:
-        "3 of 5 (60%)"
+        "4 of 7 (57%)"
      values.getOwners.6:
+        "0x4D8007a0E9f293e62E2b0F43C6Cf4C4B9e135BAe"
      values.getOwners.5:
+        "0xefCf0c8faFB425997870f845e26fC6cA6EE6dD5C"
      values.getOwners.4:
-        "0x4D8007a0E9f293e62E2b0F43C6Cf4C4B9e135BAe"
+        "0xa0C600a6e85bf225958FFAcC70B5FDDF9A059038"
      values.getOwners.3:
-        "0xefCf0c8faFB425997870f845e26fC6cA6EE6dD5C"
+        "0x3840f487A17A41100DD1Bf0946c34f132a57Fd5f"
      values.getOwners.2:
-        "0xa0C600a6e85bf225958FFAcC70B5FDDF9A059038"
+        "0xa4000bDD2bB92ce6750b31F1eeda47Bd1cB8e6e4"
      values.getOwners.1:
-        "0x3840f487A17A41100DD1Bf0946c34f132a57Fd5f"
+        "0xF0B77EaE7F2dabCC2571c7418406A0dCA3afA4f0"
      values.getOwners.0:
-        "0xa4000bDD2bB92ce6750b31F1eeda47Bd1cB8e6e4"
+        "0xF3313C48BD8E17b823d5498D62F37019dFEA647D"
      values.getThreshold:
-        3
+        4
    }
```

Generated with discovered.json: 0xc32a7c7a041fd05ebe665655ae4552e25de6a5e1

# Diff at Tue, 21 May 2024 14:28:13 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@c032520e456d0e6bee8b65e420ff7dba9f36bd48 block: 19531398
- current block number: 19918875

## Description

Name change.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19531398 (main branch discovery), not current.

```diff
    contract AevoMultiSig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      name:
-        "AevoMultiSig"
+        "ConduitMultisig"
    }
```

Generated with discovered.json: 0x7ea75822b1ed65b8b2d69da70a1727f6abbd48b5

# Diff at Thu, 28 Mar 2024 08:24:20 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@867de6120241d47b66bf76f83c490408eb3595b0 block: 19411980
- current block number: 19531398

## Description

Update discovery to include the multisig threshold.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19411980 (main branch discovery), not current.

```diff
    contract AevoMultiSig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      upgradeability.threshold:
+        "3 of 5 (60%)"
    }
```

Generated with discovered.json: 0x5ac8e286dec030bdfa6c4454607ac3469df1550a

# Diff at Mon, 11 Mar 2024 12:55:52 GMT:

- author: Michał Sobieraj-Jakubiec (<michalsidzej@gmail.com>)
- comparing to: main@64454506aee2b4b4e15b121f096369e92ec4cf20 block: 19176638
- current block number: 19411980

## Description

Update OP stack DA handler

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19176638 (main branch discovery), not current.

```diff
    contract SystemConfig (0xF761Cc49bB127AB666899b41CDC4E62fA50cD9ca) {
    +++ description: None
      values.opStackDA.isSequencerSendingBlobTx:
+        false
    }
```

Generated with discovered.json: 0x7c248e7cf936813d85d694d339b4b74a03d9aa12

# Diff at Wed, 07 Feb 2024 13:34:15 GMT:

- author: Michał Sobieraj-Jakubiec (<michalsidzej@gmail.com>)
- comparing to: main@2e35800e01005d93332a552032058dcd67f3631d block: 19175204
- current block number: 19176638

## Description

Added opStackSequencerInbox handler

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19175204 (main branch discovery), not current.

```diff
    contract SystemConfig (0xF761Cc49bB127AB666899b41CDC4E62fA50cD9ca) {
      values.sequencerInbox:
+        "0x253887577420Cb7e7418cD4d50147743c8041b28"
    }
```

Generated with discovered.json: 0x368096bbdf292ae6710cc705bf1eb0584f168ba1

# Diff at Wed, 07 Feb 2024 08:44:14 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@64f1e0f27f831d3ef860a1c2faad8c77e04e6c29 block: 19090313
- current block number: 19175204

## Description

Increased the gas limit.
Updated with the new OpDAHandler to remove the field.

## Watched changes

```diff
    contract SystemConfig (0xF761Cc49bB127AB666899b41CDC4E62fA50cD9ca) {
      values.gasLimit:
-        30000000
+        150000000
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19090313 (main branch discovery), not current.

```diff
    contract SystemConfig (0xF761Cc49bB127AB666899b41CDC4E62fA50cD9ca) {
      values.opStackDA.isAllTxsLengthEqualToCelestiaDAExample:
-        true
    }
```

Generated with discovered.json: 0xdbe6ce9040494aceffa3835445396479993d2e68

# Diff at Fri, 26 Jan 2024 10:54:51 GMT:

- author: Michał Sobieraj-Jakubiec (<michalsidzej@gmail.com>)
- comparing to: main@bb037f7100968a00265a4787338e51ca81aafe9b block: 19032812
- current block number: 19090313

## Description

Added opStackDa handler

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19032812 (main branch discovery), not current.

```diff
    contract SystemConfig (0xF761Cc49bB127AB666899b41CDC4E62fA50cD9ca) {
      values.opStackDA:
+        {"isAllTxsLengthEqualToCelestiaDAExample":true,"isSomeTxsLengthEqualToCelestiaDAExample":true}
    }
```

Generated with discovered.json: 0x7c9f89d35918320ff94fc04fa034065255687352

# Diff at Thu, 18 Jan 2024 09:19:36 GMT:

- author: Michał Podsiadły (<michal.podsiadly@l2beat.com>)
- comparing to: main@0cb1eb82b45ad89a272a3c1b8f8f24ae020627cc block: 18933723
- current block number: 19032812

## Description

Changed dynamic and static L2 fee overhead.
Ignoring multisig nonce.

## Watched changes

```diff
    contract SystemConfig (0xF761Cc49bB127AB666899b41CDC4E62fA50cD9ca) {
      values.overhead:
-        2100
+        188
      values.scalar:
-        1000000
+        68400
    }
```

# Diff at Thu, 04 Jan 2024 11:38:42 GMT:

- author: Radina Talanova (<nt.radina@gmail.com>)
- comparing to: main@45fa22227d0d99394ce6d0a25e40e8ceeca18cb3

## Description

One owner is removed and another is added to AevoMultiSig.

## Watched changes

```diff
    contract AevoMultiSig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
      values.getOwners.4:
-        "0x5553a23a71Bc7985c8E58Ca08072D2Fa9D1D1F4c"
+        "0x4D8007a0E9f293e62E2b0F43C6Cf4C4B9e135BAe"
      values.getOwners.3:
-        "0x4D8007a0E9f293e62E2b0F43C6Cf4C4B9e135BAe"
+        "0xefCf0c8faFB425997870f845e26fC6cA6EE6dD5C"
      values.getOwners.2:
-        "0xefCf0c8faFB425997870f845e26fC6cA6EE6dD5C"
+        "0xa0C600a6e85bf225958FFAcC70B5FDDF9A059038"
      values.getOwners.1:
-        "0xa0C600a6e85bf225958FFAcC70B5FDDF9A059038"
+        "0x3840f487A17A41100DD1Bf0946c34f132a57Fd5f"
      values.getOwners.0:
-        "0x3840f487A17A41100DD1Bf0946c34f132a57Fd5f"
+        "0xa4000bDD2bB92ce6750b31F1eeda47Bd1cB8e6e4"
      values.nonce:
-        8
+        9
    }
```

# Diff at Tue, 26 Sep 2023 09:30:32 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@cfd4e281f2af40c7c69302b16c1308c0c5651be0

## Watched changes

```diff
    contract L2OutputOracle (0x909E51211e959339EFb14b36f5A50955a8ae3770) {
      values.deletedOutputs:
+        []
    }
```
