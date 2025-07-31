Generated with discovered.json: 0x41f35531c2ecf864defca72ab41510be745e1606

# Diff at Fri, 25 Jul 2025 15:49:54 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@85b717d6efe0c0a7691beb49532a0ce49bb7634a block: 22975742
- current block number: 22997036

## Description

Conduit: Optiportal2 upgrade (permissioned gametype). All contracts are using standard implementations.

absolute prestate: v1.6.0 (cannon64) - does not respect alt-DA commitments

standard 3.5; 3.5; 7 finality conf

## Watched changes

```diff
    contract Conduit Multisig 1 (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      receivedPermissions.0:
+        {"permission":"challenge","from":"eth:0xef91b38Ca24C97C7147FcA3429503c76CdE043DD","role":".challenger"}
      receivedPermissions.1:
-        {"permission":"guard","from":"eth:0x91493a61ab83b62943E6dCAa5475Dd330704Cc84","role":".guardian"}
      receivedPermissions.2:
-        {"permission":"guard","from":"eth:0x91493a61ab83b62943E6dCAa5475Dd330704Cc84","role":".GUARDIAN"}
      receivedPermissions.4:
+        {"permission":"interact","from":"eth:0xFc908935E4BBA7D7bD1CBFf72bDD79bd1c1d751E","description":"can pull funds from the contract in case of emergency.","role":".owner"}
      receivedPermissions.6.from:
-        "eth:0x5e76821C3c1AbB9fD6E310224804556C61D860e0"
+        "eth:0x4d3189fa0E612fb640a1DbEd9fAd9518bB3c13Dc"
      receivedPermissions.12:
+        {"permission":"upgrade","from":"eth:0xC8BF04A73704051E5E274F1B43B1F2F153Db2136","role":"admin","via":[{"address":"eth:0xb570F4aD27e7De879A2E4F2F3DE27dBaBc20E9B9"}]}
      receivedPermissions.14:
+        {"permission":"upgrade","from":"eth:0xFc908935E4BBA7D7bD1CBFf72bDD79bd1c1d751E","role":"admin","via":[{"address":"eth:0xb570F4aD27e7De879A2E4F2F3DE27dBaBc20E9B9"}]}
    }
```

```diff
-   Status: DELETED
    contract L2OutputOracle (0x5e76821C3c1AbB9fD6E310224804556C61D860e0)
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
```

```diff
    EOA  (0x74BaD482a7f73C8286F50D8Aa03e53b7d24A5f3B) {
    +++ description: None
      receivedPermissions.0:
-        {"permission":"propose","from":"eth:0x5e76821C3c1AbB9fD6E310224804556C61D860e0","role":".proposer"}
      receivedPermissions.1.role:
-        ".PROPOSER"
+        ".proposer"
      receivedPermissions.1.from:
-        "eth:0x5e76821C3c1AbB9fD6E310224804556C61D860e0"
+        "eth:0xef91b38Ca24C97C7147FcA3429503c76CdE043DD"
    }
```

```diff
    contract OptimismMintableERC20Factory (0x7a69a90d8ea11E9618855da55D09E6F953730686) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintableERC20 as this chain's representation of a token on the host chain, or vice-versa.
      sourceHashes.1:
-        "0x4c5ac4e53576924cabbd2a471f368a541bc3f4b1f53fa41a389692fcc62f6176"
+        "0x9650b4bba6299e410f01a369a95a2c57e1c3ca35f0d80c13f4f59fc468f370e5"
      values.$implementation:
-        "eth:0xE01efbeb1089D1d1dB9c6c8b135C934C0734c846"
+        "eth:0x5493f4677A186f64805fe7317D6993ba4863988F"
      values.$pastUpgrades.4:
+        ["2025-07-24T15:21:23.000Z","0xc65976839f6e929c869ef77b21b8bd5dde36cf9b0d6b28c93c6f281215a75db8",["eth:0x5493f4677A186f64805fe7317D6993ba4863988F"]]
      values.$upgradeCount:
-        4
+        5
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
    contract SystemConfig (0x886B187C3D293B1449A3A0F23Ca9e2269E0f2664) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      sourceHashes.1:
-        "0xc7135dbd2a53312d36df3f3ee91ce0a5a459ab8fc7725880a3a9c55a5fa0ed6c"
+        "0x921de6fc906d159fdcef862d2b9559063f5e7b9b7588fa5f33153360ddf296e7"
      values.$implementation:
-        "eth:0xAB9d6cB7A427c0765163A7f45BB91cAfe5f2D375"
+        "eth:0x340f923E5c7cbB2171146f64169EC9d5a9FfE647"
      values.$pastUpgrades.4:
+        ["2025-07-24T15:21:23.000Z","0xc65976839f6e929c869ef77b21b8bd5dde36cf9b0d6b28c93c6f281215a75db8",["eth:0xd81f43eDBCAcb4c29a9bA38a13Ee5d79278270cC"]]
      values.$pastUpgrades.5:
+        ["2025-07-24T15:21:23.000Z","0xc65976839f6e929c869ef77b21b8bd5dde36cf9b0d6b28c93c6f281215a75db8",["eth:0xAB9d6cB7A427c0765163A7f45BB91cAfe5f2D375"]]
      values.$pastUpgrades.6:
+        ["2025-07-24T15:21:23.000Z","0xc65976839f6e929c869ef77b21b8bd5dde36cf9b0d6b28c93c6f281215a75db8",["eth:0x760C48C62A85045A6B69f07F4a9f22868659CbCc"]]
      values.$pastUpgrades.7:
+        ["2025-07-24T15:21:23.000Z","0xc65976839f6e929c869ef77b21b8bd5dde36cf9b0d6b28c93c6f281215a75db8",["eth:0x340f923E5c7cbB2171146f64169EC9d5a9FfE647"]]
      values.$upgradeCount:
-        4
+        8
      values.basefeeScalar:
-        0
+        5472
      values.disputeGameFactory:
-        "eth:0x0000000000000000000000000000000000000000"
+        "eth:0xC8BF04A73704051E5E274F1B43B1F2F153Db2136"
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
+        {"l1CrossDomainMessenger":"eth:0xc76543A64666d9a073FaEF4e75F651c88e7DBC08","l1ERC721Bridge":"eth:0x934Ab59Ef14b638653b1C0FEf7aB9a72186393DC","l1StandardBridge":"eth:0xe07eA0436100918F157DF35D01dCE5c11b16D1F1","disputeGameFactory":"eth:0xC8BF04A73704051E5E274F1B43B1F2F153Db2136","optimismPortal":"eth:0x91493a61ab83b62943E6dCAa5475Dd330704Cc84","optimismMintableERC20Factory":"eth:0x7a69a90d8ea11E9618855da55D09E6F953730686"}
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
    contract OptimismPortal2 (0x91493a61ab83b62943E6dCAa5475Dd330704Cc84) {
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
+        "eth:0xB443Da3e07052204A02d630a8933dAc05a0d6fB4"
      values.$pastUpgrades.3:
+        ["2025-07-24T15:21:23.000Z","0xc65976839f6e929c869ef77b21b8bd5dde36cf9b0d6b28c93c6f281215a75db8",["eth:0xd81f43eDBCAcb4c29a9bA38a13Ee5d79278270cC"]]
      values.$pastUpgrades.4:
+        ["2025-07-24T15:21:23.000Z","0xc65976839f6e929c869ef77b21b8bd5dde36cf9b0d6b28c93c6f281215a75db8",["eth:0xe2F826324b2faf99E513D16D266c3F80aE87832B"]]
      values.$pastUpgrades.5:
+        ["2025-07-24T15:21:23.000Z","0xc65976839f6e929c869ef77b21b8bd5dde36cf9b0d6b28c93c6f281215a75db8",["eth:0x2D7e764a0D9919e16983a46595CfA81fc34fa7Cd"]]
      values.$pastUpgrades.6:
+        ["2025-07-24T15:21:23.000Z","0xc65976839f6e929c869ef77b21b8bd5dde36cf9b0d6b28c93c6f281215a75db8",["eth:0xB443Da3e07052204A02d630a8933dAc05a0d6fB4"]]
      values.$upgradeCount:
-        3
+        7
      values.GUARDIAN:
-        "eth:0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      values.L2_ORACLE:
-        "eth:0x5e76821C3c1AbB9fD6E310224804556C61D860e0"
      values.l2Oracle:
-        "eth:0x5e76821C3c1AbB9fD6E310224804556C61D860e0"
      values.SYSTEM_CONFIG:
-        "eth:0x886B187C3D293B1449A3A0F23Ca9e2269E0f2664"
      values.version:
-        "2.5.0"
+        "3.14.0"
      values.disputeGameFactory:
+        "eth:0xC8BF04A73704051E5E274F1B43B1F2F153Db2136"
      values.disputeGameFinalityDelaySeconds:
+        302400
      values.proofMaturityDelaySeconds:
+        604800
      values.RespectedGameString:
+        "PermissionedDisputeGame"
+++ severity: HIGH
      values.respectedGameType:
+        1
      values.respectedGameTypeUpdatedAt:
+        1753370483
      implementationNames.eth:0x2D778797049FE9259d947D1ED8e5442226dFB589:
-        "OptimismPortal"
      implementationNames.eth:0xB443Da3e07052204A02d630a8933dAc05a0d6fB4:
+        "OptimismPortal2"
      fieldMeta:
+        {"respectedGameType":{"severity":"HIGH"},"paused":{"severity":"HIGH","description":"Whether the contract is paused or not. Determined by the SuperchainConfig contract PAUSED_SLOT. Here it pauses withdrawals. If this is paused, also the L1CrossDomainMessenger and ERC-20, ERC-721 deposits are paused."}}
      usedTypes:
+        [{"typeCaster":"Mapping","arg":{"0":"FaultDisputeGame","1":"PermissionedDisputeGame","1337":"KailuaGame"}}]
    }
```

```diff
    contract L1ERC721Bridge (0x934Ab59Ef14b638653b1C0FEf7aB9a72186393DC) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      sourceHashes.1:
-        "0x482ec6e91304ac39a3fb4505634427bddfddee23b8e93a4f7f995ca5083ae3c3"
+        "0x28669b49da3effd51f0f9424ca9cdd455c5b9327c09a40c65fc06f114a6eb837"
      values.$implementation:
-        "eth:0xAE2AF01232a6c4a4d3012C5eC5b1b35059caF10d"
+        "eth:0x7aE1d3BD877a4C5CA257404ce26BE93A02C98013"
      values.$pastUpgrades.5:
+        ["2025-07-24T15:21:23.000Z","0xc65976839f6e929c869ef77b21b8bd5dde36cf9b0d6b28c93c6f281215a75db8",["eth:0x276d3730f219f7ec22274f7263180b8452B46d47"]]
      values.$pastUpgrades.6:
+        ["2025-07-24T15:21:23.000Z","0xc65976839f6e929c869ef77b21b8bd5dde36cf9b0d6b28c93c6f281215a75db8",["eth:0x7aE1d3BD877a4C5CA257404ce26BE93A02C98013"]]
      values.$upgradeCount:
-        5
+        7
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
    contract ProxyAdmin (0xb570F4aD27e7De879A2E4F2F3DE27dBaBc20E9B9) {
    +++ description: None
      directlyReceivedPermissions.1.from:
-        "eth:0x5e76821C3c1AbB9fD6E310224804556C61D860e0"
+        "eth:0x4d3189fa0E612fb640a1DbEd9fAd9518bB3c13Dc"
      directlyReceivedPermissions.7:
+        {"permission":"upgrade","from":"eth:0xC8BF04A73704051E5E274F1B43B1F2F153Db2136","role":"admin"}
      directlyReceivedPermissions.9:
+        {"permission":"upgrade","from":"eth:0xFc908935E4BBA7D7bD1CBFf72bDD79bd1c1d751E","role":"admin"}
    }
```

```diff
    contract L1CrossDomainMessenger (0xc76543A64666d9a073FaEF4e75F651c88e7DBC08) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      sourceHashes.1:
-        "0x1cc8a3b7de3d2c54c4706bb3f3015714d3b56647fc9fbfd6f8b068f5f63c1c25"
+        "0x03bcdc719cb7bd0a1377c01bb50b30a6122b308f673b7d7b15a3bb8628e6bd8c"
      values.$implementation:
-        "eth:0xD3494713A5cfaD3F5359379DfA074E2Ac8C6Fd65"
+        "eth:0x5D5a095665886119693F0B41d8DFeE78da033e8B"
      values.$pastUpgrades.6:
+        ["2025-07-24T15:21:23.000Z","0xc65976839f6e929c869ef77b21b8bd5dde36cf9b0d6b28c93c6f281215a75db8",["eth:0x3eA6084748ED1b2A9B5D4426181F1ad8C93F6231"]]
      values.$pastUpgrades.7:
+        ["2025-07-24T15:21:23.000Z","0xc65976839f6e929c869ef77b21b8bd5dde36cf9b0d6b28c93c6f281215a75db8",["eth:0x5D5a095665886119693F0B41d8DFeE78da033e8B"]]
      values.$upgradeCount:
-        6
+        8
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
-   Status: DELETED
    contract OrderlyMultisig (0xcE10372313Ca39Fbf75A09e7f4c0E57F070259f4)
    +++ description: None
```

```diff
    contract L1StandardBridge (0xe07eA0436100918F157DF35D01dCE5c11b16D1F1) {
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
+   Status: CREATED
    contract PreimageOracle (0x1fb8cdFc6831fc866Ed9C51aF8817Da5c287aDD3)
    +++ description: The PreimageOracle contract is used to load the required data from L1 for a dispute game.
```

```diff
+   Status: CREATED
    contract AnchorStateRegistry (0x4d3189fa0E612fb640a1DbEd9fAd9518bB3c13Dc)
    +++ description: Contains the latest confirmed state root that can be used as a starting point in a dispute game.
```

```diff
+   Status: CREATED
    contract DisputeGameFactory (0xC8BF04A73704051E5E274F1B43B1F2F153Db2136)
    +++ description: The dispute game factory allows the creation of dispute games, used to propose state roots and eventually challenge them.
```

```diff
+   Status: CREATED
    contract PermissionedDisputeGame (0xef91b38Ca24C97C7147FcA3429503c76CdE043DD)
    +++ description: Same as FaultDisputeGame, but only two permissioned addresses are designated as proposer and challenger.
```

```diff
+   Status: CREATED
    contract MIPS (0xF027F4A985560fb13324e943edf55ad6F1d15Dc1)
    +++ description: The MIPS contract is used to execute the final step of the dispute game which objectively determines the winner of the dispute.
```

```diff
+   Status: CREATED
    contract DelayedWETH (0xFc908935E4BBA7D7bD1CBFf72bDD79bd1c1d751E)
    +++ description: Contract designed to hold the bonded ETH for each game. It is designed as a wrapper around WETH to allow an owner to function as a backstop if a game would incorrectly distribute funds.
```

## Source code changes

```diff
.../AnchorStateRegistry/AnchorStateRegistry.sol    |  568 +++
 .../ethereum/.flat/AnchorStateRegistry/Proxy.p.sol |  200 +
 .../ethereum/.flat/DelayedWETH/DelayedWETH.sol     |  608 +++
 .../orderly/ethereum/.flat/DelayedWETH/Proxy.p.sol |  200 +
 .../DisputeGameFactory/DisputeGameFactory.sol      | 1482 +++++++
 .../ethereum/.flat/DisputeGameFactory/Proxy.p.sol  |  200 +
 .../L1CrossDomainMessenger.sol                     |  736 +++-
 .../L1ERC721Bridge/L1ERC721Bridge.sol              |  418 +-
 .../L1StandardBridge/L1StandardBridge.sol          |  508 ++-
 .../L2OutputOracle/L2OutputOracle.sol => /dev/null |  679 ----
 .../src/projects/orderly/ethereum/.flat/MIPS.sol   | 2515 ++++++++++++
 .../OptimismMintableERC20Factory.sol               |   30 +-
 .../OptimismPortal/Proxy.p.sol => /dev/null        |  211 -
 .../OptimismPortal2/OptimismPortal2.sol}           |  926 +++--
 .../OptimismPortal2}/Proxy.p.sol                   |    0
 .../OrderlyMultisig/GnosisSafe.sol => /dev/null    |  953 -----
 .../GnosisSafeProxy.p.sol => /dev/null             |   35 -
 .../ethereum/.flat/PermissionedDisputeGame.sol     | 4121 ++++++++++++++++++++
 .../orderly/ethereum/.flat/PreimageOracle.sol      | 1311 +++++++
 .../SystemConfig/SystemConfig.sol                  | 1439 +------
 20 files changed, 13121 insertions(+), 4019 deletions(-)
```

Generated with discovered.json: 0x7ee62b35fea6692ad3f1de7647c9e9624718b1c5

# Diff at Tue, 22 Jul 2025 15:55:05 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@83bf55f537ce86d3d1dac9f1a98f31f9169b801f block: 22895942
- current block number: 22975742

## Description

Conduit: Upgrade to known OP stack contracts. (no OptiPortal2 yet).

## Watched changes

```diff
    contract Conduit Multisig 1 (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      receivedPermissions.0:
+        {"permission":"guard","from":"eth:0x097f99768A0a4a0A81bAbbCB1ea18193bA9D53cC","role":".guardian"}
      receivedPermissions.1:
+        {"permission":"guard","from":"eth:0x91493a61ab83b62943E6dCAa5475Dd330704Cc84","role":".guardian"}
      receivedPermissions.2:
+        {"permission":"guard","from":"eth:0x91493a61ab83b62943E6dCAa5475Dd330704Cc84","role":".GUARDIAN"}
      receivedPermissions.5:
+        {"permission":"upgrade","from":"eth:0x097f99768A0a4a0A81bAbbCB1ea18193bA9D53cC","role":"admin","via":[{"address":"eth:0xb4899FF43Ae727B1E9CB19AC44660e4A43Fad0b5"}]}
      receivedPermissions.7:
+        {"permission":"upgrade","from":"eth:0x7a69a90d8ea11E9618855da55D09E6F953730686","role":"admin","via":[{"address":"eth:0xb570F4aD27e7De879A2E4F2F3DE27dBaBc20E9B9"}]}
      directlyReceivedPermissions.0:
+        {"permission":"act","from":"eth:0xb4899FF43Ae727B1E9CB19AC44660e4A43Fad0b5","role":".owner"}
    }
```

```diff
    contract L2OutputOracle (0x5e76821C3c1AbB9fD6E310224804556C61D860e0) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      sourceHashes.1:
-        "0xcca8986d0789aa489ba57cd234e886bd92cb5a0d477e1f5ae5e6e030e15fb183"
+        "0x025c187b0231be4785898f25f98d749f953f5d06781772aef242812e2ecf52e3"
      values.$implementation:
-        "eth:0x334251f91a3795c043663172CB59a963a9029aed"
+        "eth:0xF243BEd163251380e78068d317ae10f26042B292"
      values.$pastUpgrades.1:
+        ["2025-07-21T14:30:47.000Z","0x1a4d52d7716a5235faca739cc50998dc7dccff0a6ba0413b4b5dc6473f541cc8",["eth:0x6322C2f2D6a4305Fc033754d486A5A067Ee5F9b1"]]
      values.$pastUpgrades.2:
+        ["2025-07-21T14:30:47.000Z","0x1a4d52d7716a5235faca739cc50998dc7dccff0a6ba0413b4b5dc6473f541cc8",["eth:0xF243BEd163251380e78068d317ae10f26042B292"]]
      values.$upgradeCount:
-        1
+        3
      values.version:
-        "1.3.1"
+        "1.8.0"
+++ severity: HIGH
      values.challenger:
+        "eth:0xcE10372313Ca39Fbf75A09e7f4c0E57F070259f4"
      values.finalizationPeriodSeconds:
+        604800
      values.l2BlockTime:
+        2
+++ severity: HIGH
      values.proposer:
+        "eth:0x74BaD482a7f73C8286F50D8Aa03e53b7d24A5f3B"
      values.submissionInterval:
+        1800
      implementationNames.eth:0x334251f91a3795c043663172CB59a963a9029aed:
-        "L2OutputOracle"
      implementationNames.eth:0xF243BEd163251380e78068d317ae10f26042B292:
+        "L2OutputOracle"
    }
```

```diff
    EOA  (0x74BaD482a7f73C8286F50D8Aa03e53b7d24A5f3B) {
    +++ description: None
      receivedPermissions.0:
+        {"permission":"propose","from":"eth:0x5e76821C3c1AbB9fD6E310224804556C61D860e0","role":".proposer"}
    }
```

```diff
    contract SystemConfig (0x886B187C3D293B1449A3A0F23Ca9e2269E0f2664) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      sourceHashes.1:
-        "0x29908eb7685943ff431cd384af851ce36a30997bbad880f9b4385bfc3abb86a2"
+        "0xc7135dbd2a53312d36df3f3ee91ce0a5a459ab8fc7725880a3a9c55a5fa0ed6c"
      values.$implementation:
-        "eth:0x240B3bd6b95cE40497Aafd71aD4705d0345A33CD"
+        "eth:0xAB9d6cB7A427c0765163A7f45BB91cAfe5f2D375"
      values.$pastUpgrades.1:
+        ["2025-07-21T14:30:47.000Z","0x1a4d52d7716a5235faca739cc50998dc7dccff0a6ba0413b4b5dc6473f541cc8",["eth:0x6322C2f2D6a4305Fc033754d486A5A067Ee5F9b1"]]
      values.$pastUpgrades.2:
+        ["2025-07-21T14:30:47.000Z","0x1a4d52d7716a5235faca739cc50998dc7dccff0a6ba0413b4b5dc6473f541cc8",["eth:0xba2492e52F45651B60B8B38d4Ea5E2390C64Ffb1"]]
      values.$pastUpgrades.3:
+        ["2025-07-21T14:58:11.000Z","0xbdcfd3c80c25c5aa99782ff98f440bb352443dfb23a1a56cd4023856b4a6afd4",["eth:0xAB9d6cB7A427c0765163A7f45BB91cAfe5f2D375"]]
      values.$upgradeCount:
-        1
+        4
      values.version:
-        "1.3.1"
+        "2.3.0"
      values.basefeeScalar:
+        0
      values.BATCH_INBOX_SLOT:
+        "0x71ac12829d66ee73d8d95bff50b3589745ce57edae70a3fb111a2342464dc597"
      values.batchInbox:
+        "eth:0x08aA34cC843CeEBcC88A627F18430294aA9780be"
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
+        "eth:0xc76543A64666d9a073FaEF4e75F651c88e7DBC08"
      values.l1ERC721Bridge:
+        "eth:0x934Ab59Ef14b638653b1C0FEf7aB9a72186393DC"
      values.l1StandardBridge:
+        "eth:0xe07eA0436100918F157DF35D01dCE5c11b16D1F1"
      values.maximumGasLimit:
+        200000000
      values.OPTIMISM_MINTABLE_ERC20_FACTORY_SLOT:
+        "0xa04c5bb938ca6fc46d95553abf0a76345ce3e722a30bf4f74928b8e7d852320c"
      values.OPTIMISM_PORTAL_SLOT:
+        "0x4b6c74f9e688cb39801f2112c14a8c57232a3fc5202e1444126d4bce86eb19ac"
      values.optimismMintableERC20Factory:
+        "eth:0x7a69a90d8ea11E9618855da55D09E6F953730686"
      values.optimismPortal:
+        "eth:0x91493a61ab83b62943E6dCAa5475Dd330704Cc84"
      values.START_BLOCK_SLOT:
+        "0xa11ee3ab75b40e88a0105e935d17cd36c8faee0138320d776c411291bdbbb19f"
      values.startBlock:
+        18292538
      implementationNames.eth:0x240B3bd6b95cE40497Aafd71aD4705d0345A33CD:
-        "SystemConfig"
      implementationNames.eth:0xAB9d6cB7A427c0765163A7f45BB91cAfe5f2D375:
+        "SystemConfig"
    }
```

```diff
    contract OptimismPortal (0x91493a61ab83b62943E6dCAa5475Dd330704Cc84) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      sourceHashes.1:
-        "0xd7fe53899c31d6d8e73b6724694736dc3c3c4ebc8f4ddbe989fe9d3dba26692d"
+        "0xe35fb7bc0433439337b3eadda3d6fb7991918162f62a337a695e8c7f948cdd35"
      values.$implementation:
-        "eth:0x7A163eb6Df3EEBbf817A7A9769F53FB2a441D47E"
+        "eth:0x2D778797049FE9259d947D1ED8e5442226dFB589"
      values.$pastUpgrades.1:
+        ["2025-07-21T14:30:47.000Z","0x1a4d52d7716a5235faca739cc50998dc7dccff0a6ba0413b4b5dc6473f541cc8",["eth:0x6322C2f2D6a4305Fc033754d486A5A067Ee5F9b1"]]
      values.$pastUpgrades.2:
+        ["2025-07-21T14:30:47.000Z","0x1a4d52d7716a5235faca739cc50998dc7dccff0a6ba0413b4b5dc6473f541cc8",["eth:0x2D778797049FE9259d947D1ED8e5442226dFB589"]]
      values.$upgradeCount:
-        1
+        3
      values.GUARDIAN:
-        "eth:0xcE10372313Ca39Fbf75A09e7f4c0E57F070259f4"
+        "eth:0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      values.version:
-        "1.7.2"
+        "2.5.0"
      values.guardian:
+        "eth:0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      values.l2Oracle:
+        "eth:0x5e76821C3c1AbB9fD6E310224804556C61D860e0"
      values.superchainConfig:
+        "eth:0x097f99768A0a4a0A81bAbbCB1ea18193bA9D53cC"
      values.systemConfig:
+        "eth:0x886B187C3D293B1449A3A0F23Ca9e2269E0f2664"
      implementationNames.eth:0x7A163eb6Df3EEBbf817A7A9769F53FB2a441D47E:
-        "OptimismPortal"
      implementationNames.eth:0x2D778797049FE9259d947D1ED8e5442226dFB589:
+        "OptimismPortal"
    }
```

```diff
    contract L1ERC721Bridge (0x934Ab59Ef14b638653b1C0FEf7aB9a72186393DC) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      sourceHashes.1:
-        "0x95c690f70db8f82a05347087d704333c180048757ff015d74a5b186c1b6b24ab"
+        "0x482ec6e91304ac39a3fb4505634427bddfddee23b8e93a4f7f995ca5083ae3c3"
      values.$implementation:
-        "eth:0x701E95156dfD378d1985C6CC405D0Ee3d2af8503"
+        "eth:0xAE2AF01232a6c4a4d3012C5eC5b1b35059caF10d"
      values.$pastUpgrades.1:
+        ["2025-07-21T14:30:47.000Z","0x1a4d52d7716a5235faca739cc50998dc7dccff0a6ba0413b4b5dc6473f541cc8",["eth:0x6322C2f2D6a4305Fc033754d486A5A067Ee5F9b1"]]
      values.$pastUpgrades.2:
+        ["2025-07-21T14:30:47.000Z","0x1a4d52d7716a5235faca739cc50998dc7dccff0a6ba0413b4b5dc6473f541cc8",["eth:0xAE2AF01232a6c4a4d3012C5eC5b1b35059caF10d"]]
      values.$pastUpgrades.3:
+        ["2025-07-21T14:58:11.000Z","0xbdcfd3c80c25c5aa99782ff98f440bb352443dfb23a1a56cd4023856b4a6afd4",["eth:0xd81f43eDBCAcb4c29a9bA38a13Ee5d79278270cC"]]
      values.$pastUpgrades.4:
+        ["2025-07-21T14:58:11.000Z","0xbdcfd3c80c25c5aa99782ff98f440bb352443dfb23a1a56cd4023856b4a6afd4",["eth:0xAE2AF01232a6c4a4d3012C5eC5b1b35059caF10d"]]
      values.$upgradeCount:
-        1
+        5
      values.version:
-        "1.1.2"
+        "2.1.0"
      values.paused:
+        false
      values.superchainConfig:
+        "eth:0x097f99768A0a4a0A81bAbbCB1ea18193bA9D53cC"
      implementationNames.eth:0x701E95156dfD378d1985C6CC405D0Ee3d2af8503:
-        "L1ERC721Bridge"
      implementationNames.eth:0xAE2AF01232a6c4a4d3012C5eC5b1b35059caF10d:
+        "L1ERC721Bridge"
    }
```

```diff
    contract ProxyAdmin (0xb570F4aD27e7De879A2E4F2F3DE27dBaBc20E9B9) {
    +++ description: None
      directlyReceivedPermissions.2:
+        {"permission":"upgrade","from":"eth:0x7a69a90d8ea11E9618855da55D09E6F953730686","role":"admin"}
    }
```

```diff
    contract L1CrossDomainMessenger (0xc76543A64666d9a073FaEF4e75F651c88e7DBC08) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      sourceHashes.1:
-        "0xebfb36a18bcaa176678925149b43fdc5f9f943d98a6405ae1cbc26f4c168ff88"
+        "0x1cc8a3b7de3d2c54c4706bb3f3015714d3b56647fc9fbfd6f8b068f5f63c1c25"
      values.$implementation:
-        "eth:0xB6767fA038e8fbe3B60d42866dbeF0fca3B1a7d6"
+        "eth:0xD3494713A5cfaD3F5359379DfA074E2Ac8C6Fd65"
      values.$pastUpgrades.2:
+        ["2025-07-21T14:30:47.000Z","0x1a4d52d7716a5235faca739cc50998dc7dccff0a6ba0413b4b5dc6473f541cc8",["eth:0x6322C2f2D6a4305Fc033754d486A5A067Ee5F9b1"]]
      values.$pastUpgrades.3:
+        ["2025-07-21T14:30:47.000Z","0x1a4d52d7716a5235faca739cc50998dc7dccff0a6ba0413b4b5dc6473f541cc8",["eth:0xD3494713A5cfaD3F5359379DfA074E2Ac8C6Fd65"]]
      values.$pastUpgrades.4:
+        ["2025-07-21T14:58:11.000Z","0xbdcfd3c80c25c5aa99782ff98f440bb352443dfb23a1a56cd4023856b4a6afd4",["eth:0xd81f43eDBCAcb4c29a9bA38a13Ee5d79278270cC"]]
      values.$pastUpgrades.5:
+        ["2025-07-21T14:58:11.000Z","0xbdcfd3c80c25c5aa99782ff98f440bb352443dfb23a1a56cd4023856b4a6afd4",["eth:0xD3494713A5cfaD3F5359379DfA074E2Ac8C6Fd65"]]
      values.$upgradeCount:
-        2
+        6
      values.version:
-        "1.4.1"
+        "2.3.0"
      values.otherMessenger:
+        "eth:0x4200000000000000000000000000000000000007"
      values.paused:
+        false
      values.portal:
+        "eth:0x91493a61ab83b62943E6dCAa5475Dd330704Cc84"
      values.superchainConfig:
+        "eth:0x097f99768A0a4a0A81bAbbCB1ea18193bA9D53cC"
      implementationNames.eth:0xB6767fA038e8fbe3B60d42866dbeF0fca3B1a7d6:
-        "L1CrossDomainMessenger"
      implementationNames.eth:0xD3494713A5cfaD3F5359379DfA074E2Ac8C6Fd65:
+        "L1CrossDomainMessenger"
    }
```

```diff
    contract OrderlyMultisig (0xcE10372313Ca39Fbf75A09e7f4c0E57F070259f4) {
    +++ description: None
      receivedPermissions.0:
+        {"permission":"challenge","from":"eth:0x5e76821C3c1AbB9fD6E310224804556C61D860e0","role":".challenger"}
      receivedPermissions.1:
-        {"permission":"guard","from":"eth:0x91493a61ab83b62943E6dCAa5475Dd330704Cc84","role":".GUARDIAN"}
    }
```

```diff
    contract L1StandardBridge (0xe07eA0436100918F157DF35D01dCE5c11b16D1F1) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      sourceHashes.1:
-        "0x79abdbd90460fe2ac0535b5cb7b4c45284322b49a0a090d1c509cdaf35dbc87e"
+        "0x1010ff7f40ab4d53e6d9996aefa04423dabe9d0e22fac2d02b330ed3aa2c5740"
      values.$implementation:
-        "eth:0xc1D40DbA2505E43c5834DA7Ec03953397C2f3087"
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
      implementationNames.eth:0xc1D40DbA2505E43c5834DA7Ec03953397C2f3087:
-        "L1StandardBridge"
      implementationNames.eth:0x64B5a5Ed26DCb17370Ff4d33a8D503f0fbD06CfF:
+        "L1StandardBridge"
    }
```

```diff
+   Status: CREATED
    contract SuperchainConfig (0x097f99768A0a4a0A81bAbbCB1ea18193bA9D53cC)
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
```

```diff
+   Status: CREATED
    contract OptimismMintableERC20Factory (0x7a69a90d8ea11E9618855da55D09E6F953730686)
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
 .../L1ERC721Bridge/L1ERC721Bridge.sol              |  611 +++---
 .../L1StandardBridge/L1StandardBridge.sol          | 1431 +++++++-------
 .../L2OutputOracle/L2OutputOracle.sol              |  548 ++----
 .../OptimismMintableERC20Factory.sol               |  427 ++++
 .../.flat/OptimismMintableERC20Factory/Proxy.p.sol |  211 ++
 .../OptimismPortal/OptimismPortal.sol              | 1336 +++++--------
 ...0xb4899FF43Ae727B1E9CB19AC44660e4A43Fad0b5.sol} |    0
 ...:0xb570F4aD27e7De879A2E4F2F3DE27dBaBc20E9B9.sol |  298 +++
 .../ethereum/.flat/SuperchainConfig/Proxy.p.sol    |  200 ++
 .../.flat/SuperchainConfig/SuperchainConfig.sol    |  477 +++++
 .../SystemConfig/SystemConfig.sol                  | 2034 +++++++++++++++++---
 12 files changed, 5840 insertions(+), 3387 deletions(-)
```

Generated with discovered.json: 0x5ccff23e2868acc37a68f2cd76f810ff9d5ebf54

# Diff at Mon, 14 Jul 2025 12:45:53 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@9f4300dad2f3d080cd56fa311d4a848556c74e72 block: 22895942
- current block number: 22895942

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22895942 (main branch discovery), not current.

```diff
    EOA  (0x000000000000000000000000000000000000dEaD) {
    +++ description: None
      address:
-        "0x000000000000000000000000000000000000dEaD"
+        "eth:0x000000000000000000000000000000000000dEaD"
    }
```

```diff
    EOA  (0x08aA34cC843CeEBcC88A627F18430294aA9780be) {
    +++ description: None
      address:
-        "0x08aA34cC843CeEBcC88A627F18430294aA9780be"
+        "eth:0x08aA34cC843CeEBcC88A627F18430294aA9780be"
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
    contract L2OutputOracle (0x5e76821C3c1AbB9fD6E310224804556C61D860e0) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      address:
-        "0x5e76821C3c1AbB9fD6E310224804556C61D860e0"
+        "eth:0x5e76821C3c1AbB9fD6E310224804556C61D860e0"
      values.$admin:
-        "0xb570F4aD27e7De879A2E4F2F3DE27dBaBc20E9B9"
+        "eth:0xb570F4aD27e7De879A2E4F2F3DE27dBaBc20E9B9"
      values.$implementation:
-        "0x334251f91a3795c043663172CB59a963a9029aed"
+        "eth:0x334251f91a3795c043663172CB59a963a9029aed"
      values.$pastUpgrades.0.2.0:
-        "0x334251f91a3795c043663172CB59a963a9029aed"
+        "eth:0x334251f91a3795c043663172CB59a963a9029aed"
      values.CHALLENGER:
-        "0xcE10372313Ca39Fbf75A09e7f4c0E57F070259f4"
+        "eth:0xcE10372313Ca39Fbf75A09e7f4c0E57F070259f4"
      values.PROPOSER:
-        "0x74BaD482a7f73C8286F50D8Aa03e53b7d24A5f3B"
+        "eth:0x74BaD482a7f73C8286F50D8Aa03e53b7d24A5f3B"
      implementationNames.0x5e76821C3c1AbB9fD6E310224804556C61D860e0:
-        "Proxy"
      implementationNames.0x334251f91a3795c043663172CB59a963a9029aed:
-        "L2OutputOracle"
      implementationNames.eth:0x5e76821C3c1AbB9fD6E310224804556C61D860e0:
+        "Proxy"
      implementationNames.eth:0x334251f91a3795c043663172CB59a963a9029aed:
+        "L2OutputOracle"
    }
```

```diff
    EOA  (0x71884086Cfacc370cf5EC34363Bf3938C6c6d888) {
    +++ description: None
      address:
-        "0x71884086Cfacc370cf5EC34363Bf3938C6c6d888"
+        "eth:0x71884086Cfacc370cf5EC34363Bf3938C6c6d888"
    }
```

```diff
    EOA  (0x74BaD482a7f73C8286F50D8Aa03e53b7d24A5f3B) {
    +++ description: None
      address:
-        "0x74BaD482a7f73C8286F50D8Aa03e53b7d24A5f3B"
+        "eth:0x74BaD482a7f73C8286F50D8Aa03e53b7d24A5f3B"
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
    contract AddressManager (0x87630a802a3789463eC4b00f89b27b1e9f6b92e9) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      address:
-        "0x87630a802a3789463eC4b00f89b27b1e9f6b92e9"
+        "eth:0x87630a802a3789463eC4b00f89b27b1e9f6b92e9"
      values.owner:
-        "0xb570F4aD27e7De879A2E4F2F3DE27dBaBc20E9B9"
+        "eth:0xb570F4aD27e7De879A2E4F2F3DE27dBaBc20E9B9"
      implementationNames.0x87630a802a3789463eC4b00f89b27b1e9f6b92e9:
-        "AddressManager"
      implementationNames.eth:0x87630a802a3789463eC4b00f89b27b1e9f6b92e9:
+        "AddressManager"
    }
```

```diff
    contract SystemConfig (0x886B187C3D293B1449A3A0F23Ca9e2269E0f2664) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      address:
-        "0x886B187C3D293B1449A3A0F23Ca9e2269E0f2664"
+        "eth:0x886B187C3D293B1449A3A0F23Ca9e2269E0f2664"
      values.$admin:
-        "0xb570F4aD27e7De879A2E4F2F3DE27dBaBc20E9B9"
+        "eth:0xb570F4aD27e7De879A2E4F2F3DE27dBaBc20E9B9"
      values.$implementation:
-        "0x240B3bd6b95cE40497Aafd71aD4705d0345A33CD"
+        "eth:0x240B3bd6b95cE40497Aafd71aD4705d0345A33CD"
      values.$pastUpgrades.0.2.0:
-        "0x240B3bd6b95cE40497Aafd71aD4705d0345A33CD"
+        "eth:0x240B3bd6b95cE40497Aafd71aD4705d0345A33CD"
      values.batcherHash:
-        "0xf8dB8Aba597fF36cCD16fECfbb1B816B3236E9b8"
+        "eth:0xf8dB8Aba597fF36cCD16fECfbb1B816B3236E9b8"
      values.owner:
-        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
+        "eth:0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      values.sequencerInbox:
-        "0x08aA34cC843CeEBcC88A627F18430294aA9780be"
+        "eth:0x08aA34cC843CeEBcC88A627F18430294aA9780be"
      values.unsafeBlockSigner:
-        "0xceED24B1Fd4A4393f6A9D2B137D9597dd5482569"
+        "eth:0xceED24B1Fd4A4393f6A9D2B137D9597dd5482569"
      implementationNames.0x886B187C3D293B1449A3A0F23Ca9e2269E0f2664:
-        "Proxy"
      implementationNames.0x240B3bd6b95cE40497Aafd71aD4705d0345A33CD:
-        "SystemConfig"
      implementationNames.eth:0x886B187C3D293B1449A3A0F23Ca9e2269E0f2664:
+        "Proxy"
      implementationNames.eth:0x240B3bd6b95cE40497Aafd71aD4705d0345A33CD:
+        "SystemConfig"
    }
```

```diff
    contract OptimismPortal (0x91493a61ab83b62943E6dCAa5475Dd330704Cc84) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      address:
-        "0x91493a61ab83b62943E6dCAa5475Dd330704Cc84"
+        "eth:0x91493a61ab83b62943E6dCAa5475Dd330704Cc84"
      values.$admin:
-        "0xb570F4aD27e7De879A2E4F2F3DE27dBaBc20E9B9"
+        "eth:0xb570F4aD27e7De879A2E4F2F3DE27dBaBc20E9B9"
      values.$implementation:
-        "0x7A163eb6Df3EEBbf817A7A9769F53FB2a441D47E"
+        "eth:0x7A163eb6Df3EEBbf817A7A9769F53FB2a441D47E"
      values.$pastUpgrades.0.2.0:
-        "0x7A163eb6Df3EEBbf817A7A9769F53FB2a441D47E"
+        "eth:0x7A163eb6Df3EEBbf817A7A9769F53FB2a441D47E"
      values.GUARDIAN:
-        "0xcE10372313Ca39Fbf75A09e7f4c0E57F070259f4"
+        "eth:0xcE10372313Ca39Fbf75A09e7f4c0E57F070259f4"
      values.L2_ORACLE:
-        "0x5e76821C3c1AbB9fD6E310224804556C61D860e0"
+        "eth:0x5e76821C3c1AbB9fD6E310224804556C61D860e0"
      values.l2Sender:
-        "0x000000000000000000000000000000000000dEaD"
+        "eth:0x000000000000000000000000000000000000dEaD"
      values.SYSTEM_CONFIG:
-        "0x886B187C3D293B1449A3A0F23Ca9e2269E0f2664"
+        "eth:0x886B187C3D293B1449A3A0F23Ca9e2269E0f2664"
      implementationNames.0x91493a61ab83b62943E6dCAa5475Dd330704Cc84:
-        "Proxy"
      implementationNames.0x7A163eb6Df3EEBbf817A7A9769F53FB2a441D47E:
-        "OptimismPortal"
      implementationNames.eth:0x91493a61ab83b62943E6dCAa5475Dd330704Cc84:
+        "Proxy"
      implementationNames.eth:0x7A163eb6Df3EEBbf817A7A9769F53FB2a441D47E:
+        "OptimismPortal"
    }
```

```diff
    contract L1ERC721Bridge (0x934Ab59Ef14b638653b1C0FEf7aB9a72186393DC) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      address:
-        "0x934Ab59Ef14b638653b1C0FEf7aB9a72186393DC"
+        "eth:0x934Ab59Ef14b638653b1C0FEf7aB9a72186393DC"
      values.$admin:
-        "0xb570F4aD27e7De879A2E4F2F3DE27dBaBc20E9B9"
+        "eth:0xb570F4aD27e7De879A2E4F2F3DE27dBaBc20E9B9"
      values.$implementation:
-        "0x701E95156dfD378d1985C6CC405D0Ee3d2af8503"
+        "eth:0x701E95156dfD378d1985C6CC405D0Ee3d2af8503"
      values.$pastUpgrades.0.2.0:
-        "0x701E95156dfD378d1985C6CC405D0Ee3d2af8503"
+        "eth:0x701E95156dfD378d1985C6CC405D0Ee3d2af8503"
      values.messenger:
-        "0xc76543A64666d9a073FaEF4e75F651c88e7DBC08"
+        "eth:0xc76543A64666d9a073FaEF4e75F651c88e7DBC08"
      values.MESSENGER:
-        "0xc76543A64666d9a073FaEF4e75F651c88e7DBC08"
+        "eth:0xc76543A64666d9a073FaEF4e75F651c88e7DBC08"
      values.OTHER_BRIDGE:
-        "0x4200000000000000000000000000000000000014"
+        "eth:0x4200000000000000000000000000000000000014"
      values.otherBridge:
-        "0x4200000000000000000000000000000000000014"
+        "eth:0x4200000000000000000000000000000000000014"
      implementationNames.0x934Ab59Ef14b638653b1C0FEf7aB9a72186393DC:
-        "Proxy"
      implementationNames.0x701E95156dfD378d1985C6CC405D0Ee3d2af8503:
-        "L1ERC721Bridge"
      implementationNames.eth:0x934Ab59Ef14b638653b1C0FEf7aB9a72186393DC:
+        "Proxy"
      implementationNames.eth:0x701E95156dfD378d1985C6CC405D0Ee3d2af8503:
+        "L1ERC721Bridge"
    }
```

```diff
    EOA  (0x985Fa8958Aa3dcE89a83E519e6FAAeCAa4930b32) {
    +++ description: None
      address:
-        "0x985Fa8958Aa3dcE89a83E519e6FAAeCAa4930b32"
+        "eth:0x985Fa8958Aa3dcE89a83E519e6FAAeCAa4930b32"
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
    contract ProxyAdmin (0xb570F4aD27e7De879A2E4F2F3DE27dBaBc20E9B9) {
    +++ description: None
      address:
-        "0xb570F4aD27e7De879A2E4F2F3DE27dBaBc20E9B9"
+        "eth:0xb570F4aD27e7De879A2E4F2F3DE27dBaBc20E9B9"
      values.addressManager:
-        "0x87630a802a3789463eC4b00f89b27b1e9f6b92e9"
+        "eth:0x87630a802a3789463eC4b00f89b27b1e9f6b92e9"
      values.owner:
-        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
+        "eth:0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      implementationNames.0xb570F4aD27e7De879A2E4F2F3DE27dBaBc20E9B9:
-        "ProxyAdmin"
      implementationNames.eth:0xb570F4aD27e7De879A2E4F2F3DE27dBaBc20E9B9:
+        "ProxyAdmin"
    }
```

```diff
    EOA  (0xC11D658978FF288da8bda4004CB93C6C99D791b1) {
    +++ description: None
      address:
-        "0xC11D658978FF288da8bda4004CB93C6C99D791b1"
+        "eth:0xC11D658978FF288da8bda4004CB93C6C99D791b1"
    }
```

```diff
    contract L1CrossDomainMessenger (0xc76543A64666d9a073FaEF4e75F651c88e7DBC08) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      address:
-        "0xc76543A64666d9a073FaEF4e75F651c88e7DBC08"
+        "eth:0xc76543A64666d9a073FaEF4e75F651c88e7DBC08"
      values.$admin:
-        "0xb570F4aD27e7De879A2E4F2F3DE27dBaBc20E9B9"
+        "eth:0xb570F4aD27e7De879A2E4F2F3DE27dBaBc20E9B9"
      values.$implementation:
-        "0xB6767fA038e8fbe3B60d42866dbeF0fca3B1a7d6"
+        "eth:0xB6767fA038e8fbe3B60d42866dbeF0fca3B1a7d6"
      values.$pastUpgrades.0.2.0:
-        "0xc76543A64666d9a073FaEF4e75F651c88e7DBC08"
+        "eth:0xc76543A64666d9a073FaEF4e75F651c88e7DBC08"
      values.$pastUpgrades.1.2.0:
-        "0xB6767fA038e8fbe3B60d42866dbeF0fca3B1a7d6"
+        "eth:0xB6767fA038e8fbe3B60d42866dbeF0fca3B1a7d6"
      values.OTHER_MESSENGER:
-        "0x4200000000000000000000000000000000000007"
+        "eth:0x4200000000000000000000000000000000000007"
      values.PORTAL:
-        "0x91493a61ab83b62943E6dCAa5475Dd330704Cc84"
+        "eth:0x91493a61ab83b62943E6dCAa5475Dd330704Cc84"
      values.ResolvedDelegateProxy_addressManager:
-        "0x87630a802a3789463eC4b00f89b27b1e9f6b92e9"
+        "eth:0x87630a802a3789463eC4b00f89b27b1e9f6b92e9"
      implementationNames.0xc76543A64666d9a073FaEF4e75F651c88e7DBC08:
-        "ResolvedDelegateProxy"
      implementationNames.0xB6767fA038e8fbe3B60d42866dbeF0fca3B1a7d6:
-        "L1CrossDomainMessenger"
      implementationNames.eth:0xc76543A64666d9a073FaEF4e75F651c88e7DBC08:
+        "ResolvedDelegateProxy"
      implementationNames.eth:0xB6767fA038e8fbe3B60d42866dbeF0fca3B1a7d6:
+        "L1CrossDomainMessenger"
    }
```

```diff
    contract OrderlyMultisig (0xcE10372313Ca39Fbf75A09e7f4c0E57F070259f4) {
    +++ description: None
      address:
-        "0xcE10372313Ca39Fbf75A09e7f4c0E57F070259f4"
+        "eth:0xcE10372313Ca39Fbf75A09e7f4c0E57F070259f4"
      values.$implementation:
-        "0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
+        "eth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
      values.$members.0:
-        "0xefCf0c8faFB425997870f845e26fC6cA6EE6dD5C"
+        "eth:0xefCf0c8faFB425997870f845e26fC6cA6EE6dD5C"
      values.$members.1:
-        "0x3840f487A17A41100DD1Bf0946c34f132a57Fd5f"
+        "eth:0x3840f487A17A41100DD1Bf0946c34f132a57Fd5f"
      values.$members.2:
-        "0xa0C600a6e85bf225958FFAcC70B5FDDF9A059038"
+        "eth:0xa0C600a6e85bf225958FFAcC70B5FDDF9A059038"
      values.$members.3:
-        "0x71884086Cfacc370cf5EC34363Bf3938C6c6d888"
+        "eth:0x71884086Cfacc370cf5EC34363Bf3938C6c6d888"
      values.$members.4:
-        "0xC11D658978FF288da8bda4004CB93C6C99D791b1"
+        "eth:0xC11D658978FF288da8bda4004CB93C6C99D791b1"
      values.$members.5:
-        "0x985Fa8958Aa3dcE89a83E519e6FAAeCAa4930b32"
+        "eth:0x985Fa8958Aa3dcE89a83E519e6FAAeCAa4930b32"
      implementationNames.0xcE10372313Ca39Fbf75A09e7f4c0E57F070259f4:
-        "GnosisSafeProxy"
      implementationNames.0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
-        "GnosisSafe"
      implementationNames.eth:0xcE10372313Ca39Fbf75A09e7f4c0E57F070259f4:
+        "GnosisSafeProxy"
      implementationNames.eth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
+        "GnosisSafe"
    }
```

```diff
    EOA  (0xceED24B1Fd4A4393f6A9D2B137D9597dd5482569) {
    +++ description: None
      address:
-        "0xceED24B1Fd4A4393f6A9D2B137D9597dd5482569"
+        "eth:0xceED24B1Fd4A4393f6A9D2B137D9597dd5482569"
    }
```

```diff
    contract L1StandardBridge (0xe07eA0436100918F157DF35D01dCE5c11b16D1F1) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      address:
-        "0xe07eA0436100918F157DF35D01dCE5c11b16D1F1"
+        "eth:0xe07eA0436100918F157DF35D01dCE5c11b16D1F1"
      values.$admin:
-        "0xb570F4aD27e7De879A2E4F2F3DE27dBaBc20E9B9"
+        "eth:0xb570F4aD27e7De879A2E4F2F3DE27dBaBc20E9B9"
      values.$implementation:
-        "0xc1D40DbA2505E43c5834DA7Ec03953397C2f3087"
+        "eth:0xc1D40DbA2505E43c5834DA7Ec03953397C2f3087"
      values.l2TokenBridge:
-        "0x4200000000000000000000000000000000000010"
+        "eth:0x4200000000000000000000000000000000000010"
      values.messenger:
-        "0xc76543A64666d9a073FaEF4e75F651c88e7DBC08"
+        "eth:0xc76543A64666d9a073FaEF4e75F651c88e7DBC08"
      values.MESSENGER:
-        "0xc76543A64666d9a073FaEF4e75F651c88e7DBC08"
+        "eth:0xc76543A64666d9a073FaEF4e75F651c88e7DBC08"
      values.OTHER_BRIDGE:
-        "0x4200000000000000000000000000000000000010"
+        "eth:0x4200000000000000000000000000000000000010"
      implementationNames.0xe07eA0436100918F157DF35D01dCE5c11b16D1F1:
-        "L1ChugSplashProxy"
      implementationNames.0xc1D40DbA2505E43c5834DA7Ec03953397C2f3087:
-        "L1StandardBridge"
      implementationNames.eth:0xe07eA0436100918F157DF35D01dCE5c11b16D1F1:
+        "L1ChugSplashProxy"
      implementationNames.eth:0xc1D40DbA2505E43c5834DA7Ec03953397C2f3087:
+        "L1StandardBridge"
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
    EOA  (0xf8dB8Aba597fF36cCD16fECfbb1B816B3236E9b8) {
    +++ description: None
      address:
-        "0xf8dB8Aba597fF36cCD16fECfbb1B816B3236E9b8"
+        "eth:0xf8dB8Aba597fF36cCD16fECfbb1B816B3236E9b8"
    }
```

```diff
+   Status: CREATED
    contract Conduit Multisig 1 (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L2OutputOracle (0x5e76821C3c1AbB9fD6E310224804556C61D860e0)
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
```

```diff
+   Status: CREATED
    contract AddressManager (0x87630a802a3789463eC4b00f89b27b1e9f6b92e9)
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
```

```diff
+   Status: CREATED
    contract SystemConfig (0x886B187C3D293B1449A3A0F23Ca9e2269E0f2664)
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
```

```diff
+   Status: CREATED
    contract OptimismPortal (0x91493a61ab83b62943E6dCAa5475Dd330704Cc84)
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
```

```diff
+   Status: CREATED
    contract L1ERC721Bridge (0x934Ab59Ef14b638653b1C0FEf7aB9a72186393DC)
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0xb570F4aD27e7De879A2E4F2F3DE27dBaBc20E9B9)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1CrossDomainMessenger (0xc76543A64666d9a073FaEF4e75F651c88e7DBC08)
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
```

```diff
+   Status: CREATED
    contract OrderlyMultisig (0xcE10372313Ca39Fbf75A09e7f4c0E57F070259f4)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1StandardBridge (0xe07eA0436100918F157DF35D01dCE5c11b16D1F1)
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
```

Generated with discovered.json: 0x39730e17429ee873c0055c643a3b66b632622b7e

# Diff at Fri, 04 Jul 2025 12:19:13 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f56dc47fe915564d4555300304da4d3bcbc087f block: 22615672
- current block number: 22615672

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22615672 (main branch discovery), not current.

```diff
    contract Conduit Multisig 1 (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      receivedPermissions.0.via.0.address:
-        "ethereum:0xb570F4aD27e7De879A2E4F2F3DE27dBaBc20E9B9"
+        "eth:0xb570F4aD27e7De879A2E4F2F3DE27dBaBc20E9B9"
      receivedPermissions.0.from:
-        "ethereum:0x87630a802a3789463eC4b00f89b27b1e9f6b92e9"
+        "eth:0x87630a802a3789463eC4b00f89b27b1e9f6b92e9"
      receivedPermissions.1.from:
-        "ethereum:0x886B187C3D293B1449A3A0F23Ca9e2269E0f2664"
+        "eth:0x886B187C3D293B1449A3A0F23Ca9e2269E0f2664"
      receivedPermissions.2.via.0.address:
-        "ethereum:0xb570F4aD27e7De879A2E4F2F3DE27dBaBc20E9B9"
+        "eth:0xb570F4aD27e7De879A2E4F2F3DE27dBaBc20E9B9"
      receivedPermissions.2.from:
-        "ethereum:0x5e76821C3c1AbB9fD6E310224804556C61D860e0"
+        "eth:0x5e76821C3c1AbB9fD6E310224804556C61D860e0"
      receivedPermissions.3.via.0.address:
-        "ethereum:0xb570F4aD27e7De879A2E4F2F3DE27dBaBc20E9B9"
+        "eth:0xb570F4aD27e7De879A2E4F2F3DE27dBaBc20E9B9"
      receivedPermissions.3.from:
-        "ethereum:0x886B187C3D293B1449A3A0F23Ca9e2269E0f2664"
+        "eth:0x886B187C3D293B1449A3A0F23Ca9e2269E0f2664"
      receivedPermissions.4.via.0.address:
-        "ethereum:0xb570F4aD27e7De879A2E4F2F3DE27dBaBc20E9B9"
+        "eth:0xb570F4aD27e7De879A2E4F2F3DE27dBaBc20E9B9"
      receivedPermissions.4.from:
-        "ethereum:0x91493a61ab83b62943E6dCAa5475Dd330704Cc84"
+        "eth:0x91493a61ab83b62943E6dCAa5475Dd330704Cc84"
      receivedPermissions.5.via.0.address:
-        "ethereum:0xb570F4aD27e7De879A2E4F2F3DE27dBaBc20E9B9"
+        "eth:0xb570F4aD27e7De879A2E4F2F3DE27dBaBc20E9B9"
      receivedPermissions.5.from:
-        "ethereum:0x934Ab59Ef14b638653b1C0FEf7aB9a72186393DC"
+        "eth:0x934Ab59Ef14b638653b1C0FEf7aB9a72186393DC"
      receivedPermissions.6.via.0.address:
-        "ethereum:0xb570F4aD27e7De879A2E4F2F3DE27dBaBc20E9B9"
+        "eth:0xb570F4aD27e7De879A2E4F2F3DE27dBaBc20E9B9"
      receivedPermissions.6.from:
-        "ethereum:0xc76543A64666d9a073FaEF4e75F651c88e7DBC08"
+        "eth:0xc76543A64666d9a073FaEF4e75F651c88e7DBC08"
      receivedPermissions.7.via.0.address:
-        "ethereum:0xb570F4aD27e7De879A2E4F2F3DE27dBaBc20E9B9"
+        "eth:0xb570F4aD27e7De879A2E4F2F3DE27dBaBc20E9B9"
      receivedPermissions.7.from:
-        "ethereum:0xe07eA0436100918F157DF35D01dCE5c11b16D1F1"
+        "eth:0xe07eA0436100918F157DF35D01dCE5c11b16D1F1"
      directlyReceivedPermissions.0.from:
-        "ethereum:0xb570F4aD27e7De879A2E4F2F3DE27dBaBc20E9B9"
+        "eth:0xb570F4aD27e7De879A2E4F2F3DE27dBaBc20E9B9"
    }
```

```diff
    EOA  (0x74BaD482a7f73C8286F50D8Aa03e53b7d24A5f3B) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0x5e76821C3c1AbB9fD6E310224804556C61D860e0"
+        "eth:0x5e76821C3c1AbB9fD6E310224804556C61D860e0"
    }
```

```diff
    contract ProxyAdmin (0xb570F4aD27e7De879A2E4F2F3DE27dBaBc20E9B9) {
    +++ description: None
      directlyReceivedPermissions.0.from:
-        "ethereum:0x87630a802a3789463eC4b00f89b27b1e9f6b92e9"
+        "eth:0x87630a802a3789463eC4b00f89b27b1e9f6b92e9"
      directlyReceivedPermissions.1.from:
-        "ethereum:0x5e76821C3c1AbB9fD6E310224804556C61D860e0"
+        "eth:0x5e76821C3c1AbB9fD6E310224804556C61D860e0"
      directlyReceivedPermissions.2.from:
-        "ethereum:0x886B187C3D293B1449A3A0F23Ca9e2269E0f2664"
+        "eth:0x886B187C3D293B1449A3A0F23Ca9e2269E0f2664"
      directlyReceivedPermissions.3.from:
-        "ethereum:0x91493a61ab83b62943E6dCAa5475Dd330704Cc84"
+        "eth:0x91493a61ab83b62943E6dCAa5475Dd330704Cc84"
      directlyReceivedPermissions.4.from:
-        "ethereum:0x934Ab59Ef14b638653b1C0FEf7aB9a72186393DC"
+        "eth:0x934Ab59Ef14b638653b1C0FEf7aB9a72186393DC"
      directlyReceivedPermissions.5.from:
-        "ethereum:0xc76543A64666d9a073FaEF4e75F651c88e7DBC08"
+        "eth:0xc76543A64666d9a073FaEF4e75F651c88e7DBC08"
      directlyReceivedPermissions.6.from:
-        "ethereum:0xe07eA0436100918F157DF35D01dCE5c11b16D1F1"
+        "eth:0xe07eA0436100918F157DF35D01dCE5c11b16D1F1"
    }
```

```diff
    contract OrderlyMultisig (0xcE10372313Ca39Fbf75A09e7f4c0E57F070259f4) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0x5e76821C3c1AbB9fD6E310224804556C61D860e0"
+        "eth:0x5e76821C3c1AbB9fD6E310224804556C61D860e0"
      receivedPermissions.1.from:
-        "ethereum:0x91493a61ab83b62943E6dCAa5475Dd330704Cc84"
+        "eth:0x91493a61ab83b62943E6dCAa5475Dd330704Cc84"
    }
```

```diff
    EOA  (0xf8dB8Aba597fF36cCD16fECfbb1B816B3236E9b8) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0x886B187C3D293B1449A3A0F23Ca9e2269E0f2664"
+        "eth:0x886B187C3D293B1449A3A0F23Ca9e2269E0f2664"
    }
```

Generated with discovered.json: 0x2c20cbf064e0cbde05dac05a3d31fa6fced5b913

# Diff at Mon, 16 Jun 2025 08:42:29 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@e1208475abce20cea1768d2e4878c03350c1b7c9 block: 22615672
- current block number: 22615672

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22615672 (main branch discovery), not current.

```diff
    contract Conduit Multisig 1 (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      receivedPermissions.7:
+        {"permission":"upgrade","from":"ethereum:0x91493a61ab83b62943E6dCAa5475Dd330704Cc84","role":"admin","via":[{"address":"ethereum:0xb570F4aD27e7De879A2E4F2F3DE27dBaBc20E9B9"}]}
      receivedPermissions.6.from:
-        "ethereum:0x91493a61ab83b62943E6dCAa5475Dd330704Cc84"
+        "ethereum:0x886B187C3D293B1449A3A0F23Ca9e2269E0f2664"
      receivedPermissions.5.from:
-        "ethereum:0x886B187C3D293B1449A3A0F23Ca9e2269E0f2664"
+        "ethereum:0x934Ab59Ef14b638653b1C0FEf7aB9a72186393DC"
      receivedPermissions.4.from:
-        "ethereum:0x934Ab59Ef14b638653b1C0FEf7aB9a72186393DC"
+        "ethereum:0xc76543A64666d9a073FaEF4e75F651c88e7DBC08"
    }
```

```diff
    contract ProxyAdmin (0xb570F4aD27e7De879A2E4F2F3DE27dBaBc20E9B9) {
    +++ description: None
      directlyReceivedPermissions.6:
+        {"permission":"upgrade","from":"ethereum:0x91493a61ab83b62943E6dCAa5475Dd330704Cc84","role":"admin"}
      directlyReceivedPermissions.5.from:
-        "ethereum:0x91493a61ab83b62943E6dCAa5475Dd330704Cc84"
+        "ethereum:0x886B187C3D293B1449A3A0F23Ca9e2269E0f2664"
      directlyReceivedPermissions.4.from:
-        "ethereum:0x886B187C3D293B1449A3A0F23Ca9e2269E0f2664"
+        "ethereum:0x934Ab59Ef14b638653b1C0FEf7aB9a72186393DC"
      directlyReceivedPermissions.3.from:
-        "ethereum:0x934Ab59Ef14b638653b1C0FEf7aB9a72186393DC"
+        "ethereum:0xc76543A64666d9a073FaEF4e75F651c88e7DBC08"
    }
```

```diff
    contract L1CrossDomainMessenger (0xc76543A64666d9a073FaEF4e75F651c88e7DBC08) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      values.$admin:
+        "0xb570F4aD27e7De879A2E4F2F3DE27dBaBc20E9B9"
    }
```

Generated with discovered.json: 0xeac215bb6331c7ae299c039c5020d127b69b1e45

# Diff at Mon, 02 Jun 2025 08:01:10 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@2fee84b782a329885c84742cf9cf43143842a2d5 block: 22046069
- current block number: 22615672

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

Generated with discovered.json: 0xc67b8e29fe4edac90fffb890cc9a2e84dad1a231

# Diff at Fri, 30 May 2025 07:10:53 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@a4d8c436027d17df0f9b76843cd6deb1888fa381 block: 22046069
- current block number: 22046069

## Description

config: change comment about eip1559 fee val

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22046069 (main branch discovery), not current.

```diff
    contract SystemConfig (0x886B187C3D293B1449A3A0F23Ca9e2269E0f2664) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      fieldMeta.eip1559Denominator:
+        {"description":"volatility param: lower denominator -> quicker fee changes on L2"}
    }
```

Generated with discovered.json: 0x5b8953254ad633366c75134a38bb3ddd80c4c983

# Diff at Fri, 23 May 2025 09:41:01 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@69cd181abbc3c830a6caf2f4429b37cae72ffdb8 block: 22046069
- current block number: 22046069

## Description

Introduced .role field on each permission, defaulting to field name on which it was defined (with '.' prefix)

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22046069 (main branch discovery), not current.

```diff
    contract Conduit Multisig 1 (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      receivedPermissions.6.role:
+        "admin"
      receivedPermissions.5.role:
+        "admin"
      receivedPermissions.4.permission:
-        "interact"
+        "upgrade"
      receivedPermissions.4.from:
-        "0x87630a802a3789463eC4b00f89b27b1e9f6b92e9"
+        "0x886B187C3D293B1449A3A0F23Ca9e2269E0f2664"
      receivedPermissions.4.description:
-        "set and change address mappings."
      receivedPermissions.4.role:
+        "admin"
      receivedPermissions.3.from:
-        "0x886B187C3D293B1449A3A0F23Ca9e2269E0f2664"
+        "0x91493a61ab83b62943E6dCAa5475Dd330704Cc84"
      receivedPermissions.3.role:
+        "admin"
      receivedPermissions.2.from:
-        "0x886B187C3D293B1449A3A0F23Ca9e2269E0f2664"
+        "0x87630a802a3789463eC4b00f89b27b1e9f6b92e9"
      receivedPermissions.2.description:
-        "it can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system."
+        "set and change address mappings."
      receivedPermissions.2.role:
+        ".owner"
      receivedPermissions.2.via:
+        [{"address":"0xb570F4aD27e7De879A2E4F2F3DE27dBaBc20E9B9"}]
      receivedPermissions.1.permission:
-        "upgrade"
+        "interact"
      receivedPermissions.1.from:
-        "0x91493a61ab83b62943E6dCAa5475Dd330704Cc84"
+        "0x886B187C3D293B1449A3A0F23Ca9e2269E0f2664"
      receivedPermissions.1.via:
-        [{"address":"0xb570F4aD27e7De879A2E4F2F3DE27dBaBc20E9B9"}]
      receivedPermissions.1.description:
+        "it can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system."
      receivedPermissions.1.role:
+        ".owner"
      receivedPermissions.0.role:
+        ".$admin"
      directlyReceivedPermissions.0.role:
+        ".owner"
    }
```

```diff
    EOA  (0x74BaD482a7f73C8286F50D8Aa03e53b7d24A5f3B) {
    +++ description: None
      receivedPermissions.0.role:
+        ".PROPOSER"
    }
```

```diff
    contract ProxyAdmin (0xb570F4aD27e7De879A2E4F2F3DE27dBaBc20E9B9) {
    +++ description: None
      directlyReceivedPermissions.5.role:
+        "admin"
      directlyReceivedPermissions.4.role:
+        "admin"
      directlyReceivedPermissions.3.permission:
-        "interact"
+        "upgrade"
      directlyReceivedPermissions.3.from:
-        "0x87630a802a3789463eC4b00f89b27b1e9f6b92e9"
+        "0x886B187C3D293B1449A3A0F23Ca9e2269E0f2664"
      directlyReceivedPermissions.3.description:
-        "set and change address mappings."
      directlyReceivedPermissions.3.role:
+        "admin"
      directlyReceivedPermissions.2.from:
-        "0x886B187C3D293B1449A3A0F23Ca9e2269E0f2664"
+        "0x91493a61ab83b62943E6dCAa5475Dd330704Cc84"
      directlyReceivedPermissions.2.role:
+        "admin"
      directlyReceivedPermissions.1.permission:
-        "upgrade"
+        "interact"
      directlyReceivedPermissions.1.from:
-        "0x91493a61ab83b62943E6dCAa5475Dd330704Cc84"
+        "0x87630a802a3789463eC4b00f89b27b1e9f6b92e9"
      directlyReceivedPermissions.1.description:
+        "set and change address mappings."
      directlyReceivedPermissions.1.role:
+        ".owner"
      directlyReceivedPermissions.0.role:
+        ".$admin"
    }
```

```diff
    contract OrderlyMultisig (0xcE10372313Ca39Fbf75A09e7f4c0E57F070259f4) {
    +++ description: None
      receivedPermissions.1.role:
+        ".CHALLENGER"
      receivedPermissions.0.role:
+        ".GUARDIAN"
    }
```

```diff
    EOA  (0xf8dB8Aba597fF36cCD16fECfbb1B816B3236E9b8) {
    +++ description: None
      receivedPermissions.0.role:
+        ".batcherHash"
    }
```

Generated with discovered.json: 0x40fe6abf990ba174085f8b6b6dfe7d0502f06ad2

# Diff at Tue, 29 Apr 2025 08:19:08 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@ef7477af00fe0b57a2f7cacf7e958c12494af662 block: 22046069
- current block number: 22046069

## Description

Field .issuedPermissions is removed from the output as no longer needed. Added 'permissionsConfigHash' due to refactoring of the modelling process (into a separate command).

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22046069 (main branch discovery), not current.

```diff
    contract L2OutputOracle (0x5e76821C3c1AbB9fD6E310224804556C61D860e0) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      issuedPermissions:
-        [{"permission":"challenge","to":"0xcE10372313Ca39Fbf75A09e7f4c0E57F070259f4","via":[]},{"permission":"propose","to":"0x74BaD482a7f73C8286F50D8Aa03e53b7d24A5f3B","via":[]},{"permission":"upgrade","to":"0x4a4962275DF8C60a80d3a25faEc5AA7De116A746","via":[{"address":"0xb570F4aD27e7De879A2E4F2F3DE27dBaBc20E9B9"}]}]
    }
```

```diff
    contract AddressManager (0x87630a802a3789463eC4b00f89b27b1e9f6b92e9) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      issuedPermissions:
-        [{"permission":"interact","to":"0x4a4962275DF8C60a80d3a25faEc5AA7De116A746","description":"set and change address mappings.","via":[{"address":"0xb570F4aD27e7De879A2E4F2F3DE27dBaBc20E9B9"}]}]
    }
```

```diff
    contract SystemConfig (0x886B187C3D293B1449A3A0F23Ca9e2269E0f2664) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      issuedPermissions:
-        [{"permission":"interact","to":"0x4a4962275DF8C60a80d3a25faEc5AA7De116A746","description":"it can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system.","via":[]},{"permission":"sequence","to":"0xf8dB8Aba597fF36cCD16fECfbb1B816B3236E9b8","via":[]},{"permission":"upgrade","to":"0x4a4962275DF8C60a80d3a25faEc5AA7De116A746","via":[{"address":"0xb570F4aD27e7De879A2E4F2F3DE27dBaBc20E9B9"}]}]
    }
```

```diff
    contract OptimismPortal (0x91493a61ab83b62943E6dCAa5475Dd330704Cc84) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      issuedPermissions:
-        [{"permission":"guard","to":"0xcE10372313Ca39Fbf75A09e7f4c0E57F070259f4","via":[]},{"permission":"upgrade","to":"0x4a4962275DF8C60a80d3a25faEc5AA7De116A746","via":[{"address":"0xb570F4aD27e7De879A2E4F2F3DE27dBaBc20E9B9"}]}]
    }
```

```diff
    contract L1ERC721Bridge (0x934Ab59Ef14b638653b1C0FEf7aB9a72186393DC) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x4a4962275DF8C60a80d3a25faEc5AA7De116A746","via":[{"address":"0xb570F4aD27e7De879A2E4F2F3DE27dBaBc20E9B9"}]}]
    }
```

```diff
    contract L1StandardBridge (0xe07eA0436100918F157DF35D01dCE5c11b16D1F1) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x4a4962275DF8C60a80d3a25faEc5AA7De116A746","description":"upgrading the bridge implementation can give access to all funds escrowed therein.","via":[{"address":"0xb570F4aD27e7De879A2E4F2F3DE27dBaBc20E9B9"}]}]
    }
```

Generated with discovered.json: 0x82ec47e70a25325a9270785d407476019589c0f0

# Diff at Thu, 27 Mar 2025 11:14:50 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@8cc2e36080df3a74dfd8475d41c64f46203f5218 block: 22046069
- current block number: 22046069

## Description

Config related: add guardian description details, hide some noisy values, hide AddressManager as spam cat, add proposer / challenger to permissioned opfp chains.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22046069 (main branch discovery), not current.

```diff
    contract AddressManager (0x87630a802a3789463eC4b00f89b27b1e9f6b92e9) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      category:
+        {"name":"Spam","priority":-1}
    }
```

Generated with discovered.json: 0x98e819c9d4276898ea04ce77749f95f8a78e7e49

# Diff at Tue, 18 Mar 2025 08:13:30 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@4ef7a8dbcec1cd9fec77aae2b73d81347a4ffb13 block: 22046069
- current block number: 22046069

## Description

Config: change Multisig names.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22046069 (main branch discovery), not current.

```diff
    contract Conduit Multisig 1 (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      name:
-        "ConduitMultisig"
+        "Conduit Multisig 1"
    }
```

Generated with discovered.json: 0xd193cc0f80f740480c0e87e3ba08132a6034322a

# Diff at Fri, 14 Mar 2025 15:40:49 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@002bac09dea3b1154ecc36736323fb7552478ce4 block: 21637081
- current block number: 22046069

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

Generated with discovered.json: 0x4d3fb1e91784d73d26b0b145999fd52381b3b8fb

# Diff at Tue, 04 Mar 2025 11:26:06 GMT:

- author: Michał Podsiadły (<michal.podsiadly@l2beat.com>)
- comparing to: main@be38e12d3ff947ca8de40f3a23a9ba1875a54f5a block: 21637081
- current block number: 21637081

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21637081 (main branch discovery), not current.

```diff
    contract SystemConfig (0x886B187C3D293B1449A3A0F23Ca9e2269E0f2664) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      values.opStackDA.isSomeTxsLengthEqualToCelestiaDAExample:
-        true
      values.opStackDA.isUsingCelestia:
+        true
    }
```

Generated with discovered.json: 0xab6bb0fba9f2d290bf34d23d1083c5cec26cfe2e

# Diff at Tue, 04 Mar 2025 10:39:35 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@98d260b45fe0d2195ce5e629bd7b200c8706e8ba block: 21637081
- current block number: 21637081

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21637081 (main branch discovery), not current.

```diff
    contract ConduitMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      sinceBlock:
+        16990669
    }
```

```diff
    contract L2OutputOracle (0x5e76821C3c1AbB9fD6E310224804556C61D860e0) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      sinceBlock:
+        18292537
    }
```

```diff
    contract AddressManager (0x87630a802a3789463eC4b00f89b27b1e9f6b92e9) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      sinceBlock:
+        18292533
    }
```

```diff
    contract SystemConfig (0x886B187C3D293B1449A3A0F23Ca9e2269E0f2664) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      sinceBlock:
+        18292538
    }
```

```diff
    contract OptimismPortal (0x91493a61ab83b62943E6dCAa5475Dd330704Cc84) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      sinceBlock:
+        18292536
    }
```

```diff
    contract L1ERC721Bridge (0x934Ab59Ef14b638653b1C0FEf7aB9a72186393DC) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      sinceBlock:
+        18292543
    }
```

```diff
    contract ProxyAdmin (0xb570F4aD27e7De879A2E4F2F3DE27dBaBc20E9B9) {
    +++ description: None
      sinceBlock:
+        18292534
    }
```

```diff
    contract L1CrossDomainMessenger (0xc76543A64666d9a073FaEF4e75F651c88e7DBC08) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      sinceBlock:
+        18292540
    }
```

```diff
    contract OrderlyMultisig (0xcE10372313Ca39Fbf75A09e7f4c0E57F070259f4) {
    +++ description: None
      sinceBlock:
+        18285574
    }
```

```diff
    contract L1StandardBridge (0xe07eA0436100918F157DF35D01dCE5c11b16D1F1) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      sinceBlock:
+        18292539
    }
```

Generated with discovered.json: 0xe43309611711fd10dfb634f39df9edaa4c7715e2

# Diff at Wed, 26 Feb 2025 10:32:57 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@18513668f913fbe57a197f43655b19111df0e627 block: 21637081
- current block number: 21637081

## Description

config related: added categories for all opstack, op stack and polygoncdk stack templates.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21637081 (main branch discovery), not current.

```diff
    contract L2OutputOracle (0x5e76821C3c1AbB9fD6E310224804556C61D860e0) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract SystemConfig (0x886B187C3D293B1449A3A0F23Ca9e2269E0f2664) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract OptimismPortal (0x91493a61ab83b62943E6dCAa5475Dd330704Cc84) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract L1ERC721Bridge (0x934Ab59Ef14b638653b1C0FEf7aB9a72186393DC) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      category:
+        {"name":"Canonical Bridges","priority":2}
    }
```

```diff
    contract L1CrossDomainMessenger (0xc76543A64666d9a073FaEF4e75F651c88e7DBC08) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      category:
+        {"name":"Canonical Bridges","priority":2}
    }
```

```diff
    contract L1StandardBridge (0xe07eA0436100918F157DF35D01dCE5c11b16D1F1) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      category:
+        {"name":"Canonical Bridges","priority":2}
    }
```

Generated with discovered.json: 0x008ff4634a97e990f7312982bef720ef11d4e38b

# Diff at Fri, 21 Feb 2025 14:09:50 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@d219f271711b2cf7a164e3443bead5e4957d13a8 block: 21637081
- current block number: 21637081

## Description

Config related: Change some severities and add templates.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21637081 (main branch discovery), not current.

```diff
    contract L2OutputOracle (0x5e76821C3c1AbB9fD6E310224804556C61D860e0) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      fieldMeta.proposer:
+        {"severity":"HIGH"}
      fieldMeta.challenger:
+        {"severity":"HIGH"}
      fieldMeta.deletedOutputs:
+        {"severity":"HIGH"}
    }
```

Generated with discovered.json: 0x1c7260cf4514eb400760183a64e6018bea09b5cc

# Diff at Fri, 21 Feb 2025 08:59:53 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1cf9ec35847912163c4b663a633e258a434c0bca block: 21637081
- current block number: 21637081

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21637081 (main branch discovery), not current.

```diff
    contract L1CrossDomainMessenger (0xc76543A64666d9a073FaEF4e75F651c88e7DBC08) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      categories:
-        ["Core"]
    }
```

Generated with discovered.json: 0x7f155f10082233a50cfa22f206e1c6bd06f171a0

# Diff at Mon, 10 Feb 2025 19:04:24 GMT:

- author: Michał Podsiadły (<michal.podsiadly@l2beat.com>)
- comparing to: main@3756adff7c1ac86d8af3374a90a75c1999aae2b3 block: 21637081
- current block number: 21637081

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21637081 (main branch discovery), not current.

```diff
    contract SystemConfig (0x886B187C3D293B1449A3A0F23Ca9e2269E0f2664) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      values.opStackDA.isUsingEigenDA:
+        false
    }
```

Generated with discovered.json: 0x66fcd6ecc85b48e0a1936aa87bb8b1f9a902a1fd

# Diff at Tue, 04 Feb 2025 12:31:50 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@145553eed7ba44636411ecb25e4099728acd02f9 block: 21637081
- current block number: 21637081

## Description

Rename 'configure' permission to 'interact'

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21637081 (main branch discovery), not current.

```diff
    contract ConduitMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
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
    contract AddressManager (0x87630a802a3789463eC4b00f89b27b1e9f6b92e9) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      issuedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract SystemConfig (0x886B187C3D293B1449A3A0F23Ca9e2269E0f2664) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      issuedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract ProxyAdmin (0xb570F4aD27e7De879A2E4F2F3DE27dBaBc20E9B9) {
    +++ description: None
      directlyReceivedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

Generated with discovered.json: 0x9a6dca585daadd9318b5e3f5104fd8ff9dfb24ad

# Diff at Mon, 20 Jan 2025 11:09:52 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@2c8b4f3d9910bb6371be9b4df87b70856e7d8c64 block: 21637081
- current block number: 21637081

## Description

Rerun on the same block number. Applies fixes to permissions and via field. Renames permission's target to to/from.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21637081 (main branch discovery), not current.

```diff
    contract ConduitMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      receivedPermissions.6.target:
-        "0xe07eA0436100918F157DF35D01dCE5c11b16D1F1"
      receivedPermissions.6.from:
+        "0xe07eA0436100918F157DF35D01dCE5c11b16D1F1"
      receivedPermissions.5.target:
-        "0x934Ab59Ef14b638653b1C0FEf7aB9a72186393DC"
      receivedPermissions.5.from:
+        "0x934Ab59Ef14b638653b1C0FEf7aB9a72186393DC"
      receivedPermissions.4.target:
-        "0x91493a61ab83b62943E6dCAa5475Dd330704Cc84"
      receivedPermissions.4.from:
+        "0x91493a61ab83b62943E6dCAa5475Dd330704Cc84"
      receivedPermissions.3.target:
-        "0x886B187C3D293B1449A3A0F23Ca9e2269E0f2664"
      receivedPermissions.3.from:
+        "0x886B187C3D293B1449A3A0F23Ca9e2269E0f2664"
      receivedPermissions.2.target:
-        "0x5e76821C3c1AbB9fD6E310224804556C61D860e0"
      receivedPermissions.2.from:
+        "0x5e76821C3c1AbB9fD6E310224804556C61D860e0"
      receivedPermissions.1.target:
-        "0x886B187C3D293B1449A3A0F23Ca9e2269E0f2664"
      receivedPermissions.1.from:
+        "0x886B187C3D293B1449A3A0F23Ca9e2269E0f2664"
      receivedPermissions.0.target:
-        "0x87630a802a3789463eC4b00f89b27b1e9f6b92e9"
      receivedPermissions.0.from:
+        "0x87630a802a3789463eC4b00f89b27b1e9f6b92e9"
      directlyReceivedPermissions.0.target:
-        "0xb570F4aD27e7De879A2E4F2F3DE27dBaBc20E9B9"
      directlyReceivedPermissions.0.from:
+        "0xb570F4aD27e7De879A2E4F2F3DE27dBaBc20E9B9"
    }
```

```diff
    contract L2OutputOracle (0x5e76821C3c1AbB9fD6E310224804556C61D860e0) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      issuedPermissions.2.target:
-        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      issuedPermissions.2.via.0.delay:
-        0
      issuedPermissions.2.to:
+        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      issuedPermissions.1.target:
-        "0x74BaD482a7f73C8286F50D8Aa03e53b7d24A5f3B"
      issuedPermissions.1.to:
+        "0x74BaD482a7f73C8286F50D8Aa03e53b7d24A5f3B"
      issuedPermissions.0.target:
-        "0xcE10372313Ca39Fbf75A09e7f4c0E57F070259f4"
      issuedPermissions.0.to:
+        "0xcE10372313Ca39Fbf75A09e7f4c0E57F070259f4"
    }
```

```diff
    contract AddressManager (0x87630a802a3789463eC4b00f89b27b1e9f6b92e9) {
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
    contract SystemConfig (0x886B187C3D293B1449A3A0F23Ca9e2269E0f2664) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      issuedPermissions.2.target:
-        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      issuedPermissions.2.via.0.delay:
-        0
      issuedPermissions.2.to:
+        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      issuedPermissions.1.target:
-        "0xf8dB8Aba597fF36cCD16fECfbb1B816B3236E9b8"
      issuedPermissions.1.to:
+        "0xf8dB8Aba597fF36cCD16fECfbb1B816B3236E9b8"
      issuedPermissions.0.target:
-        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      issuedPermissions.0.to:
+        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      issuedPermissions.0.description:
+        "it can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system."
    }
```

```diff
    contract OptimismPortal (0x91493a61ab83b62943E6dCAa5475Dd330704Cc84) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      issuedPermissions.1.target:
-        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      issuedPermissions.1.via.0.delay:
-        0
      issuedPermissions.1.to:
+        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      issuedPermissions.0.target:
-        "0xcE10372313Ca39Fbf75A09e7f4c0E57F070259f4"
      issuedPermissions.0.to:
+        "0xcE10372313Ca39Fbf75A09e7f4c0E57F070259f4"
    }
```

```diff
    contract L1ERC721Bridge (0x934Ab59Ef14b638653b1C0FEf7aB9a72186393DC) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      issuedPermissions.0.target:
-        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
    }
```

```diff
    contract ProxyAdmin (0xb570F4aD27e7De879A2E4F2F3DE27dBaBc20E9B9) {
    +++ description: None
      directlyReceivedPermissions.5.target:
-        "0xe07eA0436100918F157DF35D01dCE5c11b16D1F1"
      directlyReceivedPermissions.5.from:
+        "0xe07eA0436100918F157DF35D01dCE5c11b16D1F1"
      directlyReceivedPermissions.4.target:
-        "0x934Ab59Ef14b638653b1C0FEf7aB9a72186393DC"
      directlyReceivedPermissions.4.from:
+        "0x934Ab59Ef14b638653b1C0FEf7aB9a72186393DC"
      directlyReceivedPermissions.3.target:
-        "0x91493a61ab83b62943E6dCAa5475Dd330704Cc84"
      directlyReceivedPermissions.3.from:
+        "0x91493a61ab83b62943E6dCAa5475Dd330704Cc84"
      directlyReceivedPermissions.2.target:
-        "0x886B187C3D293B1449A3A0F23Ca9e2269E0f2664"
      directlyReceivedPermissions.2.from:
+        "0x886B187C3D293B1449A3A0F23Ca9e2269E0f2664"
      directlyReceivedPermissions.1.target:
-        "0x5e76821C3c1AbB9fD6E310224804556C61D860e0"
      directlyReceivedPermissions.1.from:
+        "0x5e76821C3c1AbB9fD6E310224804556C61D860e0"
      directlyReceivedPermissions.0.target:
-        "0x87630a802a3789463eC4b00f89b27b1e9f6b92e9"
      directlyReceivedPermissions.0.from:
+        "0x87630a802a3789463eC4b00f89b27b1e9f6b92e9"
    }
```

```diff
    contract OrderlyMultisig (0xcE10372313Ca39Fbf75A09e7f4c0E57F070259f4) {
    +++ description: None
      receivedPermissions.1.target:
-        "0x91493a61ab83b62943E6dCAa5475Dd330704Cc84"
      receivedPermissions.1.from:
+        "0x91493a61ab83b62943E6dCAa5475Dd330704Cc84"
      receivedPermissions.0.target:
-        "0x5e76821C3c1AbB9fD6E310224804556C61D860e0"
      receivedPermissions.0.from:
+        "0x5e76821C3c1AbB9fD6E310224804556C61D860e0"
    }
```

```diff
    contract L1StandardBridge (0xe07eA0436100918F157DF35D01dCE5c11b16D1F1) {
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

Generated with discovered.json: 0xc817fbd660270ec3a6c083e7bb5c29a9d7760161

# Diff at Thu, 16 Jan 2025 12:35:58 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@b471de2d691e0c6d99ad89859efde79edd3d4dfb block: 21078674
- current block number: 21637081

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

Generated with discovered.json: 0xabddebd4805121726062510a2d0848db8b318e4a

# Diff at Wed, 08 Jan 2025 09:05:11 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@deefa974378c2cd6b74f061e1f5a494bbbe1d63a block: 21078674
- current block number: 21078674

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21078674 (main branch discovery), not current.

```diff
    contract L1StandardBridge (0xe07eA0436100918F157DF35D01dCE5c11b16D1F1) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      description:
-        "The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token."
+        "The main entry point to deposit ERC20 tokens from host chain to this chain."
    }
```

Generated with discovered.json: 0x2d1904484a775595b2df58916cf8777b0c0f1e6c

# Diff at Fri, 01 Nov 2024 12:10:16 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@cd1f0e71bb08ce16b2084a11b768538e8aa6ba8c block: 21078674
- current block number: 21078674

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21078674 (main branch discovery), not current.

```diff
    contract ConduitMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      receivedPermissions.6.description:
-        "upgrading bridge implementation allows to access all funds and change every system component."
+        "upgrading the bridge implementation can give access to all funds escrowed therein."
    }
```

```diff
    contract ProxyAdmin (0xb570F4aD27e7De879A2E4F2F3DE27dBaBc20E9B9) {
    +++ description: None
      directlyReceivedPermissions.5.description:
-        "upgrading bridge implementation allows to access all funds and change every system component."
+        "upgrading the bridge implementation can give access to all funds escrowed therein."
    }
```

```diff
    contract L1StandardBridge (0xe07eA0436100918F157DF35D01dCE5c11b16D1F1) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token.
      issuedPermissions.0.via.0.description:
-        "upgrading bridge implementation allows to access all funds and change every system component."
+        "upgrading the bridge implementation can give access to all funds escrowed therein."
    }
```

Generated with discovered.json: 0x3b50208cabccaf08b0aa97444332c6d316d8623a

# Diff at Wed, 30 Oct 2024 13:12:11 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@0a8a53530022c6c5edd257c3682a3e7f80d0c550 block: 20920069
- current block number: 21078674

## Description

Conduit MS: Signer added.

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

Generated with discovered.json: 0x466a881884904a9c6c0065beebe1a8a3cd3c23b6

# Diff at Tue, 29 Oct 2024 13:15:16 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@7b3fc9dc9074e1d423b48522c3f0273c86aab54a block: 20920069
- current block number: 20920069

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20920069 (main branch discovery), not current.

```diff
    contract L2OutputOracle (0x5e76821C3c1AbB9fD6E310224804556C61D860e0) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      fieldMeta:
+        {"FINALIZATION_PERIOD_SECONDS":{"description":"Challenge period (Number of seconds until a state root is finalized)."}}
    }
```

Generated with discovered.json: 0x72ac4d99c8760631af29ab8ec729d8b414da3309

# Diff at Mon, 21 Oct 2024 12:47:00 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@e660599f23a07618fe949a07be1f516ce44f1914 block: 20920069
- current block number: 20920069

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20920069 (main branch discovery), not current.

```diff
    contract L2OutputOracle (0x5e76821C3c1AbB9fD6E310224804556C61D860e0) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      descriptions:
-        ["Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots."]
      description:
+        "Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots."
    }
```

```diff
    contract AddressManager (0x87630a802a3789463eC4b00f89b27b1e9f6b92e9) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      descriptions:
-        ["Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts."]
      description:
+        "Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts."
    }
```

```diff
    contract SystemConfig (0x886B187C3D293B1449A3A0F23Ca9e2269E0f2664) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      descriptions:
-        ["Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address."]
      description:
+        "Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address."
    }
```

```diff
    contract OptimismPortal (0x91493a61ab83b62943E6dCAa5475Dd330704Cc84) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      descriptions:
-        ["The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals."]
      description:
+        "The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals."
    }
```

```diff
    contract L1ERC721Bridge (0x934Ab59Ef14b638653b1C0FEf7aB9a72186393DC) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      descriptions:
-        ["Used to bridge ERC-721 tokens from host chain to this chain."]
      description:
+        "Used to bridge ERC-721 tokens from host chain to this chain."
    }
```

```diff
    contract L1CrossDomainMessenger (0xc76543A64666d9a073FaEF4e75F651c88e7DBC08) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      descriptions:
-        ["Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function."]
      description:
+        "Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function."
    }
```

```diff
    contract L1StandardBridge (0xe07eA0436100918F157DF35D01dCE5c11b16D1F1) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token.
      descriptions:
-        ["The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token."]
      description:
+        "The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token."
    }
```

Generated with discovered.json: 0x05e1810bbb23d863943574e0d76b7e2000a5455f

# Diff at Mon, 21 Oct 2024 11:08:44 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@8895d33866f5665c4c710f4ddaa32bfa63cc3c78 block: 20920069
- current block number: 20920069

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20920069 (main branch discovery), not current.

```diff
    contract L2OutputOracle (0x5e76821C3c1AbB9fD6E310224804556C61D860e0) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      values.$pastUpgrades.0.2:
+        ["0x334251f91a3795c043663172CB59a963a9029aed"]
      values.$pastUpgrades.0.1:
-        ["0x334251f91a3795c043663172CB59a963a9029aed"]
+        "0xca444e38e6211cc12586b9e29fe3e5612c2571e945baf37bb82f7dd892409292"
    }
```

```diff
    contract SystemConfig (0x886B187C3D293B1449A3A0F23Ca9e2269E0f2664) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      values.$pastUpgrades.0.2:
+        ["0x240B3bd6b95cE40497Aafd71aD4705d0345A33CD"]
      values.$pastUpgrades.0.1:
-        ["0x240B3bd6b95cE40497Aafd71aD4705d0345A33CD"]
+        "0x92a61db152c2af8b75d8189eb9248997deaa06614e070a29476867af140f5562"
    }
```

```diff
    contract OptimismPortal (0x91493a61ab83b62943E6dCAa5475Dd330704Cc84) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      values.$pastUpgrades.0.2:
+        ["0x7A163eb6Df3EEBbf817A7A9769F53FB2a441D47E"]
      values.$pastUpgrades.0.1:
-        ["0x7A163eb6Df3EEBbf817A7A9769F53FB2a441D47E"]
+        "0xe67534a97b70fa009f2193161a0bc01c5ab1e858d26eb90ee81ee9b279a31d3b"
    }
```

```diff
    contract L1ERC721Bridge (0x934Ab59Ef14b638653b1C0FEf7aB9a72186393DC) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      values.$pastUpgrades.0.2:
+        ["0x701E95156dfD378d1985C6CC405D0Ee3d2af8503"]
      values.$pastUpgrades.0.1:
-        ["0x701E95156dfD378d1985C6CC405D0Ee3d2af8503"]
+        "0xdf70e83fd16bf306ecd7497a9f24817d028e8e7bd267ead870360777b9e1a0a8"
    }
```

```diff
    contract L1CrossDomainMessenger (0xc76543A64666d9a073FaEF4e75F651c88e7DBC08) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      values.$pastUpgrades.1.2:
+        ["0xB6767fA038e8fbe3B60d42866dbeF0fca3B1a7d6"]
      values.$pastUpgrades.1.1:
-        ["0xB6767fA038e8fbe3B60d42866dbeF0fca3B1a7d6"]
+        "0xe8bb9753ef91830bd4bae629e76232efcfb35cd39d6b2e2e5bf5384e08e82bbe"
      values.$pastUpgrades.0.2:
+        ["0xc76543A64666d9a073FaEF4e75F651c88e7DBC08"]
      values.$pastUpgrades.0.1:
-        ["0xc76543A64666d9a073FaEF4e75F651c88e7DBC08"]
+        "0x690ab35045db8f46db127951b24b5241e3848503c9e5d6dd6888e34e9373f283"
    }
```

Generated with discovered.json: 0x3fd16b7fc418840f81b6724d1409c7e91b890917

# Diff at Wed, 16 Oct 2024 11:38:51 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@a3d139b799cc0b28e5e912febb17464d4e5aef5d block: 20920069
- current block number: 20920069

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20920069 (main branch discovery), not current.

```diff
    contract L2OutputOracle (0x5e76821C3c1AbB9fD6E310224804556C61D860e0) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      issuedPermissions.2:
+        {"permission":"upgrade","target":"0x4a4962275DF8C60a80d3a25faEc5AA7De116A746","via":[{"address":"0xb570F4aD27e7De879A2E4F2F3DE27dBaBc20E9B9","delay":0}]}
      issuedPermissions.1:
+        {"permission":"propose","target":"0x74BaD482a7f73C8286F50D8Aa03e53b7d24A5f3B","via":[]}
      issuedPermissions.0.permission:
-        "upgrade"
+        "challenge"
      issuedPermissions.0.target:
-        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
+        "0xcE10372313Ca39Fbf75A09e7f4c0E57F070259f4"
      issuedPermissions.0.via.0:
-        {"address":"0xb570F4aD27e7De879A2E4F2F3DE27dBaBc20E9B9","delay":0}
    }
```

```diff
    contract SystemConfig (0x886B187C3D293B1449A3A0F23Ca9e2269E0f2664) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      issuedPermissions.2:
+        {"permission":"upgrade","target":"0x4a4962275DF8C60a80d3a25faEc5AA7De116A746","via":[{"address":"0xb570F4aD27e7De879A2E4F2F3DE27dBaBc20E9B9","delay":0}]}
      issuedPermissions.1.permission:
-        "upgrade"
+        "sequence"
      issuedPermissions.1.target:
-        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
+        "0xf8dB8Aba597fF36cCD16fECfbb1B816B3236E9b8"
      issuedPermissions.1.via.0:
-        {"address":"0xb570F4aD27e7De879A2E4F2F3DE27dBaBc20E9B9","delay":0}
    }
```

```diff
    contract OptimismPortal (0x91493a61ab83b62943E6dCAa5475Dd330704Cc84) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      issuedPermissions.1:
+        {"permission":"upgrade","target":"0x4a4962275DF8C60a80d3a25faEc5AA7De116A746","via":[{"address":"0xb570F4aD27e7De879A2E4F2F3DE27dBaBc20E9B9","delay":0}]}
      issuedPermissions.0.permission:
-        "upgrade"
+        "guard"
      issuedPermissions.0.target:
-        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
+        "0xcE10372313Ca39Fbf75A09e7f4c0E57F070259f4"
      issuedPermissions.0.via.0:
-        {"address":"0xb570F4aD27e7De879A2E4F2F3DE27dBaBc20E9B9","delay":0}
    }
```

```diff
    contract OrderlyMultisig (0xcE10372313Ca39Fbf75A09e7f4c0E57F070259f4) {
    +++ description: None
      roles:
-        ["Challenger","Guardian"]
      receivedPermissions:
+        [{"permission":"challenge","target":"0x5e76821C3c1AbB9fD6E310224804556C61D860e0"},{"permission":"guard","target":"0x91493a61ab83b62943E6dCAa5475Dd330704Cc84"}]
    }
```

Generated with discovered.json: 0xa11f4c4f6d923adfb2f2932ed108c2207b951469

# Diff at Mon, 14 Oct 2024 10:54:07 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1afc77ff111ceb0970e7d09efcc7b2f376b0c281 block: 20920069
- current block number: 20920069

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20920069 (main branch discovery), not current.

```diff
    contract ConduitMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      sourceHashes:
+        ["0x81a7349eebb98ac33b0bc6842e3cb258034a8f2a4ba004570bb8e2e25947f9ff","0xd42bbf9f7dcd3720a7fc6bdc6edfdfae8800a37d6dd4decfa0ef6ca4a2e88940"]
    }
```

```diff
    contract L2OutputOracle (0x5e76821C3c1AbB9fD6E310224804556C61D860e0) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      sourceHashes:
+        ["0x2cdcfef705094aaac53d507bad64d27b48ea5a9c11a7fadffacc192aab7a823f","0xcca8986d0789aa489ba57cd234e886bd92cb5a0d477e1f5ae5e6e030e15fb183"]
    }
```

```diff
    contract AddressManager (0x87630a802a3789463eC4b00f89b27b1e9f6b92e9) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      sourceHashes:
+        ["0xdc86a850f11dc2b5c0472a05d0e3c14f239baf2c3b1ab19631591b0827985380"]
    }
```

```diff
    contract SystemConfig (0x886B187C3D293B1449A3A0F23Ca9e2269E0f2664) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      sourceHashes:
+        ["0x2cdcfef705094aaac53d507bad64d27b48ea5a9c11a7fadffacc192aab7a823f","0x29908eb7685943ff431cd384af851ce36a30997bbad880f9b4385bfc3abb86a2"]
    }
```

```diff
    contract OptimismPortal (0x91493a61ab83b62943E6dCAa5475Dd330704Cc84) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      sourceHashes:
+        ["0x2cdcfef705094aaac53d507bad64d27b48ea5a9c11a7fadffacc192aab7a823f","0xd7fe53899c31d6d8e73b6724694736dc3c3c4ebc8f4ddbe989fe9d3dba26692d"]
    }
```

```diff
    contract L1ERC721Bridge (0x934Ab59Ef14b638653b1C0FEf7aB9a72186393DC) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      sourceHashes:
+        ["0x2cdcfef705094aaac53d507bad64d27b48ea5a9c11a7fadffacc192aab7a823f","0x95c690f70db8f82a05347087d704333c180048757ff015d74a5b186c1b6b24ab"]
    }
```

```diff
    contract ProxyAdmin (0xb570F4aD27e7De879A2E4F2F3DE27dBaBc20E9B9) {
    +++ description: None
      template:
-        "opstack/ProxyAdmin"
+        "global/ProxyAdmin"
      sourceHashes:
+        ["0x96d2f0fa1bd83ebd61ba6a2351c64c7fda7aa580b11ea67bb6bf4338e5c28512"]
    }
```

```diff
    contract L1CrossDomainMessenger (0xc76543A64666d9a073FaEF4e75F651c88e7DBC08) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      sourceHashes:
+        ["0x20a2eb4d3677fc8a15e944f7b1843acd01b2e92acdc4c7a7f7a35b07b891149b","0xebfb36a18bcaa176678925149b43fdc5f9f943d98a6405ae1cbc26f4c168ff88"]
    }
```

```diff
    contract OrderlyMultisig (0xcE10372313Ca39Fbf75A09e7f4c0E57F070259f4) {
    +++ description: None
      sourceHashes:
+        ["0x81a7349eebb98ac33b0bc6842e3cb258034a8f2a4ba004570bb8e2e25947f9ff","0xd42bbf9f7dcd3720a7fc6bdc6edfdfae8800a37d6dd4decfa0ef6ca4a2e88940"]
    }
```

```diff
    contract L1StandardBridge (0xe07eA0436100918F157DF35D01dCE5c11b16D1F1) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token.
      sourceHashes:
+        ["0xbfb58685ff2f2f07eaa01a3c4e3c33c97686bfd3ae7c50c49f9da6ef5098cb31","0x79abdbd90460fe2ac0535b5cb7b4c45284322b49a0a090d1c509cdaf35dbc87e"]
    }
```

Generated with discovered.json: 0x15517beca4a095d532eb18080e8b792831885b8d

# Diff at Wed, 09 Oct 2024 13:10:25 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@37683e2b3d0587372f886eef49e921277810c8bf block: 20920069
- current block number: 20920069

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20920069 (main branch discovery), not current.

```diff
    contract ConduitMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      receivedPermissions.0.description:
+        "set and change address mappings."
    }
```

```diff
    contract AddressManager (0x87630a802a3789463eC4b00f89b27b1e9f6b92e9) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      issuedPermissions.0.via.0.description:
+        "set and change address mappings."
      descriptions:
+        ["Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts."]
    }
```

```diff
    contract ProxyAdmin (0xb570F4aD27e7De879A2E4F2F3DE27dBaBc20E9B9) {
    +++ description: None
      directlyReceivedPermissions.0.description:
+        "set and change address mappings."
    }
```

Generated with discovered.json: 0x0d00d1c4e97a77321515b7cf757d33b25a81d930

# Diff at Tue, 08 Oct 2024 16:27:39 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@bca55174129419533cd4173605c170ea99ac6f98 block: 20775932
- current block number: 20920069

## Description

Move to discovery driven data.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20775932 (main branch discovery), not current.

```diff
    contract SystemConfig (0x886B187C3D293B1449A3A0F23Ca9e2269E0f2664) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      fieldMeta.scalar:
-        {"severity":"LOW","description":"A system configuration parameter used as dynamic L2 gas overhead in the L2 fee calculation."}
    }
```

```diff
    contract OrderlyMultisig (0xcE10372313Ca39Fbf75A09e7f4c0E57F070259f4) {
    +++ description: None
      name:
-        "ChallengerMultisig"
+        "OrderlyMultisig"
    }
```

Generated with discovered.json: 0xbabcc2ea6910170e7f642c9c3436761368428543

# Diff at Tue, 01 Oct 2024 10:53:56 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bd754dc73c66120164006054f8d25c5fae9cd910 block: 20775932
- current block number: 20775932

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20775932 (main branch discovery), not current.

```diff
    contract L2OutputOracle (0x5e76821C3c1AbB9fD6E310224804556C61D860e0) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      values.$pastUpgrades:
+        [["2023-10-06T16:10:47.000Z",["0x334251f91a3795c043663172CB59a963a9029aed"]]]
    }
```

```diff
    contract SystemConfig (0x886B187C3D293B1449A3A0F23Ca9e2269E0f2664) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      values.$pastUpgrades:
+        [["2023-10-06T16:08:47.000Z",["0x240B3bd6b95cE40497Aafd71aD4705d0345A33CD"]]]
    }
```

```diff
    contract OptimismPortal (0x91493a61ab83b62943E6dCAa5475Dd330704Cc84) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      values.$pastUpgrades:
+        [["2023-10-06T16:11:11.000Z",["0x7A163eb6Df3EEBbf817A7A9769F53FB2a441D47E"]]]
    }
```

```diff
    contract L1ERC721Bridge (0x934Ab59Ef14b638653b1C0FEf7aB9a72186393DC) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      values.$pastUpgrades:
+        [["2023-10-06T16:09:35.000Z",["0x701E95156dfD378d1985C6CC405D0Ee3d2af8503"]]]
    }
```

```diff
    contract L1CrossDomainMessenger (0xc76543A64666d9a073FaEF4e75F651c88e7DBC08) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      values.$pastUpgrades:
+        [["2023-10-06T16:06:11.000Z",["0xc76543A64666d9a073FaEF4e75F651c88e7DBC08"]],["2023-10-06T16:10:23.000Z",["0xB6767fA038e8fbe3B60d42866dbeF0fca3B1a7d6"]]]
      values.$upgradeCount:
+        2
    }
```

```diff
    contract L1StandardBridge (0xe07eA0436100918F157DF35D01dCE5c11b16D1F1) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token.
      values.$pastUpgrades:
+        []
    }
```

Generated with discovered.json: 0x6587e77b1bc0109902cce14ed8418d8c477b4747

# Diff at Wed, 18 Sep 2024 11:34:38 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@eb09774f0f9d9322f2117dfdfda7d4bb095f6c52 block: 20389626
- current block number: 20775932

## Description

Shape related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20389626 (main branch discovery), not current.

```diff
    contract ConduitMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      receivedPermissions.6:
+        {"permission":"upgrade","target":"0xe07eA0436100918F157DF35D01dCE5c11b16D1F1","description":"upgrading bridge implementation allows to access all funds and change every system component.","via":[{"address":"0xb570F4aD27e7De879A2E4F2F3DE27dBaBc20E9B9"}]}
      receivedPermissions.5.target:
-        "0xe07eA0436100918F157DF35D01dCE5c11b16D1F1"
+        "0x934Ab59Ef14b638653b1C0FEf7aB9a72186393DC"
      receivedPermissions.4.target:
-        "0x934Ab59Ef14b638653b1C0FEf7aB9a72186393DC"
+        "0x91493a61ab83b62943E6dCAa5475Dd330704Cc84"
      receivedPermissions.3.target:
-        "0x91493a61ab83b62943E6dCAa5475Dd330704Cc84"
+        "0x886B187C3D293B1449A3A0F23Ca9e2269E0f2664"
      receivedPermissions.2.target:
-        "0x886B187C3D293B1449A3A0F23Ca9e2269E0f2664"
+        "0x5e76821C3c1AbB9fD6E310224804556C61D860e0"
      receivedPermissions.1.permission:
-        "upgrade"
+        "configure"
      receivedPermissions.1.target:
-        "0x5e76821C3c1AbB9fD6E310224804556C61D860e0"
+        "0x886B187C3D293B1449A3A0F23Ca9e2269E0f2664"
      receivedPermissions.1.via:
-        [{"address":"0xb570F4aD27e7De879A2E4F2F3DE27dBaBc20E9B9"}]
      receivedPermissions.1.description:
+        "it can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system."
    }
```

```diff
    contract L2OutputOracle (0x5e76821C3c1AbB9fD6E310224804556C61D860e0) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      template:
+        "opstack/L2OutputOracle"
      descriptions:
+        ["Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots."]
    }
```

```diff
    contract SystemConfig (0x886B187C3D293B1449A3A0F23Ca9e2269E0f2664) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      issuedPermissions.1:
+        {"permission":"upgrade","target":"0x4a4962275DF8C60a80d3a25faEc5AA7De116A746","via":[{"address":"0xb570F4aD27e7De879A2E4F2F3DE27dBaBc20E9B9","delay":0}]}
      issuedPermissions.0.permission:
-        "upgrade"
+        "configure"
      issuedPermissions.0.via.0:
-        {"address":"0xb570F4aD27e7De879A2E4F2F3DE27dBaBc20E9B9","delay":0}
      fieldMeta.gasLimit:
+        {"severity":"LOW","description":"Gas limit for blocks on L2."}
      template:
+        "opstack/SystemConfig"
      descriptions:
+        ["Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address."]
    }
```

```diff
    contract OptimismPortal (0x91493a61ab83b62943E6dCAa5475Dd330704Cc84) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      template:
+        "opstack/OptimismPortal"
      descriptions:
+        ["The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals."]
    }
```

```diff
    contract L1ERC721Bridge (0x934Ab59Ef14b638653b1C0FEf7aB9a72186393DC) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      template:
+        "opstack/L1ERC721Bridge"
      descriptions:
+        ["Used to bridge ERC-721 tokens from host chain to this chain."]
    }
```

```diff
    contract ProxyAdmin (0xb570F4aD27e7De879A2E4F2F3DE27dBaBc20E9B9) {
    +++ description: None
      directlyReceivedPermissions.5.description:
+        "upgrading bridge implementation allows to access all funds and change every system component."
    }
```

```diff
    contract L1CrossDomainMessenger (0xc76543A64666d9a073FaEF4e75F651c88e7DBC08) {
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
    contract ChallengerMultisig (0xcE10372313Ca39Fbf75A09e7f4c0E57F070259f4) {
    +++ description: None
      roles:
+        ["Challenger","Guardian"]
    }
```

```diff
    contract L1StandardBridge (0xe07eA0436100918F157DF35D01dCE5c11b16D1F1) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token.
      issuedPermissions.0.via.0.description:
+        "upgrading bridge implementation allows to access all funds and change every system component."
      template:
+        "opstack/L1StandardBridge"
      descriptions:
+        ["The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token."]
    }
```

Generated with discovered.json: 0x3e7c965c6264d54c688e01f8ba4dd0f5e60c8c14

# Diff at Sun, 08 Sep 2024 17:19:25 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@fd881462cca0d7ef4519f907f3c6cfd5fe1cde8f block: 20389626
- current block number: 20389626

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20389626 (main branch discovery), not current.

```diff
    contract ConduitMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      descriptions:
-        ["It can act on behalf of 0xb570F4aD27e7De879A2E4F2F3DE27dBaBc20E9B9, inheriting its permissions."]
      receivedPermissions.5:
+        {"permission":"upgrade","target":"0xe07eA0436100918F157DF35D01dCE5c11b16D1F1","via":[{"address":"0xb570F4aD27e7De879A2E4F2F3DE27dBaBc20E9B9"}]}
      receivedPermissions.4:
+        {"permission":"upgrade","target":"0x934Ab59Ef14b638653b1C0FEf7aB9a72186393DC","via":[{"address":"0xb570F4aD27e7De879A2E4F2F3DE27dBaBc20E9B9"}]}
      receivedPermissions.3:
+        {"permission":"upgrade","target":"0x91493a61ab83b62943E6dCAa5475Dd330704Cc84","via":[{"address":"0xb570F4aD27e7De879A2E4F2F3DE27dBaBc20E9B9"}]}
      receivedPermissions.2:
+        {"permission":"upgrade","target":"0x886B187C3D293B1449A3A0F23Ca9e2269E0f2664","via":[{"address":"0xb570F4aD27e7De879A2E4F2F3DE27dBaBc20E9B9"}]}
      receivedPermissions.1:
+        {"permission":"upgrade","target":"0x5e76821C3c1AbB9fD6E310224804556C61D860e0","via":[{"address":"0xb570F4aD27e7De879A2E4F2F3DE27dBaBc20E9B9"}]}
      receivedPermissions.0.target:
-        "0xb570F4aD27e7De879A2E4F2F3DE27dBaBc20E9B9"
+        "0x87630a802a3789463eC4b00f89b27b1e9f6b92e9"
      receivedPermissions.0.via:
+        [{"address":"0xb570F4aD27e7De879A2E4F2F3DE27dBaBc20E9B9"}]
      directlyReceivedPermissions:
+        [{"permission":"act","target":"0xb570F4aD27e7De879A2E4F2F3DE27dBaBc20E9B9"}]
    }
```

```diff
    contract L2OutputOracle (0x5e76821C3c1AbB9fD6E310224804556C61D860e0) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xb570F4aD27e7De879A2E4F2F3DE27dBaBc20E9B9"
+        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      issuedPermissions.0.via.0:
+        {"address":"0xb570F4aD27e7De879A2E4F2F3DE27dBaBc20E9B9","delay":0}
    }
```

```diff
    contract AddressManager (0x87630a802a3789463eC4b00f89b27b1e9f6b92e9) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xb570F4aD27e7De879A2E4F2F3DE27dBaBc20E9B9"
+        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      issuedPermissions.0.via.0:
+        {"address":"0xb570F4aD27e7De879A2E4F2F3DE27dBaBc20E9B9","delay":0}
    }
```

```diff
    contract SystemConfig (0x886B187C3D293B1449A3A0F23Ca9e2269E0f2664) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xb570F4aD27e7De879A2E4F2F3DE27dBaBc20E9B9"
+        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      issuedPermissions.0.via.0:
+        {"address":"0xb570F4aD27e7De879A2E4F2F3DE27dBaBc20E9B9","delay":0}
    }
```

```diff
    contract OptimismPortal (0x91493a61ab83b62943E6dCAa5475Dd330704Cc84) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xb570F4aD27e7De879A2E4F2F3DE27dBaBc20E9B9"
+        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      issuedPermissions.0.via.0:
+        {"address":"0xb570F4aD27e7De879A2E4F2F3DE27dBaBc20E9B9","delay":0}
    }
```

```diff
    contract L1ERC721Bridge (0x934Ab59Ef14b638653b1C0FEf7aB9a72186393DC) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xb570F4aD27e7De879A2E4F2F3DE27dBaBc20E9B9"
+        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      issuedPermissions.0.via.0:
+        {"address":"0xb570F4aD27e7De879A2E4F2F3DE27dBaBc20E9B9","delay":0}
    }
```

```diff
    contract ProxyAdmin (0xb570F4aD27e7De879A2E4F2F3DE27dBaBc20E9B9) {
    +++ description: None
      issuedPermissions:
-        [{"permission":"configure","target":"0x4a4962275DF8C60a80d3a25faEc5AA7De116A746","via":[]}]
      receivedPermissions:
-        [{"permission":"configure","target":"0x87630a802a3789463eC4b00f89b27b1e9f6b92e9"},{"permission":"upgrade","target":"0x5e76821C3c1AbB9fD6E310224804556C61D860e0"},{"permission":"upgrade","target":"0x886B187C3D293B1449A3A0F23Ca9e2269E0f2664"},{"permission":"upgrade","target":"0x91493a61ab83b62943E6dCAa5475Dd330704Cc84"},{"permission":"upgrade","target":"0x934Ab59Ef14b638653b1C0FEf7aB9a72186393DC"},{"permission":"upgrade","target":"0xe07eA0436100918F157DF35D01dCE5c11b16D1F1"}]
      directlyReceivedPermissions:
+        [{"permission":"configure","target":"0x87630a802a3789463eC4b00f89b27b1e9f6b92e9"},{"permission":"upgrade","target":"0x5e76821C3c1AbB9fD6E310224804556C61D860e0"},{"permission":"upgrade","target":"0x886B187C3D293B1449A3A0F23Ca9e2269E0f2664"},{"permission":"upgrade","target":"0x91493a61ab83b62943E6dCAa5475Dd330704Cc84"},{"permission":"upgrade","target":"0x934Ab59Ef14b638653b1C0FEf7aB9a72186393DC"},{"permission":"upgrade","target":"0xe07eA0436100918F157DF35D01dCE5c11b16D1F1"}]
    }
```

```diff
    contract L1StandardBridge (0xe07eA0436100918F157DF35D01dCE5c11b16D1F1) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xb570F4aD27e7De879A2E4F2F3DE27dBaBc20E9B9"
+        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      issuedPermissions.0.via.0:
+        {"address":"0xb570F4aD27e7De879A2E4F2F3DE27dBaBc20E9B9","delay":0}
    }
```

Generated with discovered.json: 0x9c75831703a3694cfa0e697fd0de4ebff7994eb6

# Diff at Fri, 30 Aug 2024 07:54:22 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@6c1bd1f41fadf5f2cb1c1805b5a2c6138a3ed35a block: 20389626
- current block number: 20389626

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20389626 (main branch discovery), not current.

```diff
    contract ConduitMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: It can act on behalf of 0xb570F4aD27e7De879A2E4F2F3DE27dBaBc20E9B9, inheriting its permissions.
      receivedPermissions.0.via:
-        []
    }
```

```diff
    contract ProxyAdmin (0xb570F4aD27e7De879A2E4F2F3DE27dBaBc20E9B9) {
    +++ description: None
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

Generated with discovered.json: 0xa40daeb4cf7eab339511b0315a54944a5e707d87

# Diff at Fri, 23 Aug 2024 09:54:00 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@67597c7d6c810bc726594446890178150240711e block: 20389626
- current block number: 20389626

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20389626 (main branch discovery), not current.

```diff
    contract L2OutputOracle (0x5e76821C3c1AbB9fD6E310224804556C61D860e0) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract SystemConfig (0x886B187C3D293B1449A3A0F23Ca9e2269E0f2664) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract OptimismPortal (0x91493a61ab83b62943E6dCAa5475Dd330704Cc84) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract L1ERC721Bridge (0x934Ab59Ef14b638653b1C0FEf7aB9a72186393DC) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract L1StandardBridge (0xe07eA0436100918F157DF35D01dCE5c11b16D1F1) {
    +++ description: None
      values.$upgradeCount:
+        0
    }
```

Generated with discovered.json: 0x3ca55cefdcfe9adffcca7bfa15ab94ed5fead558

# Diff at Wed, 21 Aug 2024 10:04:49 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@2f6dde3357bf5d79196b6e94f79d853a6c4ec72b block: 20389626
- current block number: 20389626

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20389626 (main branch discovery), not current.

```diff
    contract ConduitMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: It can act on behalf of 0xb570F4aD27e7De879A2E4F2F3DE27dBaBc20E9B9, inheriting its permissions.
      assignedPermissions:
-        {"configure":["0xb570F4aD27e7De879A2E4F2F3DE27dBaBc20E9B9"]}
      receivedPermissions:
+        [{"permission":"configure","target":"0xb570F4aD27e7De879A2E4F2F3DE27dBaBc20E9B9","via":[]}]
    }
```

```diff
    contract L2OutputOracle (0x5e76821C3c1AbB9fD6E310224804556C61D860e0) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xb570F4aD27e7De879A2E4F2F3DE27dBaBc20E9B9","via":[]}]
    }
```

```diff
    contract AddressManager (0x87630a802a3789463eC4b00f89b27b1e9f6b92e9) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"configure","target":"0xb570F4aD27e7De879A2E4F2F3DE27dBaBc20E9B9","via":[]}]
    }
```

```diff
    contract SystemConfig (0x886B187C3D293B1449A3A0F23Ca9e2269E0f2664) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xb570F4aD27e7De879A2E4F2F3DE27dBaBc20E9B9","via":[]}]
    }
```

```diff
    contract OptimismPortal (0x91493a61ab83b62943E6dCAa5475Dd330704Cc84) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xb570F4aD27e7De879A2E4F2F3DE27dBaBc20E9B9","via":[]}]
    }
```

```diff
    contract L1ERC721Bridge (0x934Ab59Ef14b638653b1C0FEf7aB9a72186393DC) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xb570F4aD27e7De879A2E4F2F3DE27dBaBc20E9B9","via":[]}]
    }
```

```diff
    contract ProxyAdmin (0xb570F4aD27e7De879A2E4F2F3DE27dBaBc20E9B9) {
    +++ description: None
      assignedPermissions:
-        {"upgrade":["0x5e76821C3c1AbB9fD6E310224804556C61D860e0","0x886B187C3D293B1449A3A0F23Ca9e2269E0f2664","0x91493a61ab83b62943E6dCAa5475Dd330704Cc84","0x934Ab59Ef14b638653b1C0FEf7aB9a72186393DC","0xe07eA0436100918F157DF35D01dCE5c11b16D1F1"],"configure":["0x87630a802a3789463eC4b00f89b27b1e9f6b92e9"]}
      issuedPermissions:
+        [{"permission":"configure","target":"0x4a4962275DF8C60a80d3a25faEc5AA7De116A746","via":[]}]
      receivedPermissions:
+        [{"permission":"configure","target":"0x87630a802a3789463eC4b00f89b27b1e9f6b92e9","via":[]},{"permission":"upgrade","target":"0x5e76821C3c1AbB9fD6E310224804556C61D860e0","via":[]},{"permission":"upgrade","target":"0x886B187C3D293B1449A3A0F23Ca9e2269E0f2664","via":[]},{"permission":"upgrade","target":"0x91493a61ab83b62943E6dCAa5475Dd330704Cc84","via":[]},{"permission":"upgrade","target":"0x934Ab59Ef14b638653b1C0FEf7aB9a72186393DC","via":[]},{"permission":"upgrade","target":"0xe07eA0436100918F157DF35D01dCE5c11b16D1F1","via":[]}]
    }
```

```diff
    contract L1StandardBridge (0xe07eA0436100918F157DF35D01dCE5c11b16D1F1) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xb570F4aD27e7De879A2E4F2F3DE27dBaBc20E9B9","via":[]}]
    }
```

Generated with discovered.json: 0x2caca61eaccc3a2c034c3dfe5527b5a76959d731

# Diff at Fri, 09 Aug 2024 12:01:10 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bf40aa32f030fd312056ca0ef198c8550467d1d7 block: 20389626
- current block number: 20389626

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20389626 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0xb570F4aD27e7De879A2E4F2F3DE27dBaBc20E9B9) {
    +++ description: None
      assignedPermissions.upgrade.4:
-        "0x886B187C3D293B1449A3A0F23Ca9e2269E0f2664"
+        "0xe07eA0436100918F157DF35D01dCE5c11b16D1F1"
      assignedPermissions.upgrade.3:
-        "0x5e76821C3c1AbB9fD6E310224804556C61D860e0"
+        "0x934Ab59Ef14b638653b1C0FEf7aB9a72186393DC"
      assignedPermissions.upgrade.1:
-        "0xe07eA0436100918F157DF35D01dCE5c11b16D1F1"
+        "0x886B187C3D293B1449A3A0F23Ca9e2269E0f2664"
      assignedPermissions.upgrade.0:
-        "0x934Ab59Ef14b638653b1C0FEf7aB9a72186393DC"
+        "0x5e76821C3c1AbB9fD6E310224804556C61D860e0"
    }
```

Generated with discovered.json: 0x1841a57a9c7afbf5e3b041512887c9375fe4f8ff

# Diff at Fri, 09 Aug 2024 10:11:13 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f0da1d0aab7bc6b3b5e54e7e93480bd98e57035 block: 20389626
- current block number: 20389626

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20389626 (main branch discovery), not current.

```diff
    contract ConduitMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: It can act on behalf of 0xb570F4aD27e7De879A2E4F2F3DE27dBaBc20E9B9, inheriting its permissions.
      assignedPermissions.owner:
-        ["0xb570F4aD27e7De879A2E4F2F3DE27dBaBc20E9B9"]
      assignedPermissions.configure:
+        ["0xb570F4aD27e7De879A2E4F2F3DE27dBaBc20E9B9"]
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

```diff
    contract ProxyAdmin (0xb570F4aD27e7De879A2E4F2F3DE27dBaBc20E9B9) {
    +++ description: None
      assignedPermissions.admin:
-        ["0x5e76821C3c1AbB9fD6E310224804556C61D860e0","0x886B187C3D293B1449A3A0F23Ca9e2269E0f2664","0x91493a61ab83b62943E6dCAa5475Dd330704Cc84","0x934Ab59Ef14b638653b1C0FEf7aB9a72186393DC","0xe07eA0436100918F157DF35D01dCE5c11b16D1F1"]
      assignedPermissions.owner:
-        ["0x87630a802a3789463eC4b00f89b27b1e9f6b92e9"]
      assignedPermissions.upgrade:
+        ["0x934Ab59Ef14b638653b1C0FEf7aB9a72186393DC","0xe07eA0436100918F157DF35D01dCE5c11b16D1F1","0x91493a61ab83b62943E6dCAa5475Dd330704Cc84","0x5e76821C3c1AbB9fD6E310224804556C61D860e0","0x886B187C3D293B1449A3A0F23Ca9e2269E0f2664"]
      assignedPermissions.configure:
+        ["0x87630a802a3789463eC4b00f89b27b1e9f6b92e9"]
    }
```

```diff
    contract ChallengerMultisig (0xcE10372313Ca39Fbf75A09e7f4c0E57F070259f4) {
    +++ description: None
      values.$multisigThreshold:
-        "4 of 6 (67%)"
      values.getOwners:
-        ["0xefCf0c8faFB425997870f845e26fC6cA6EE6dD5C","0x3840f487A17A41100DD1Bf0946c34f132a57Fd5f","0xa0C600a6e85bf225958FFAcC70B5FDDF9A059038","0x71884086Cfacc370cf5EC34363Bf3938C6c6d888","0xC11D658978FF288da8bda4004CB93C6C99D791b1","0x985Fa8958Aa3dcE89a83E519e6FAAeCAa4930b32"]
      values.getThreshold:
-        4
      values.$members:
+        ["0xefCf0c8faFB425997870f845e26fC6cA6EE6dD5C","0x3840f487A17A41100DD1Bf0946c34f132a57Fd5f","0xa0C600a6e85bf225958FFAcC70B5FDDF9A059038","0x71884086Cfacc370cf5EC34363Bf3938C6c6d888","0xC11D658978FF288da8bda4004CB93C6C99D791b1","0x985Fa8958Aa3dcE89a83E519e6FAAeCAa4930b32"]
      values.$threshold:
+        4
      values.multisigThreshold:
+        "4 of 6 (67%)"
    }
```

Generated with discovered.json: 0xc065214323221c00d532c88f2554ff27ad4bceac

# Diff at Tue, 30 Jul 2024 11:13:25 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@b2b6471ff62871f4956541f42ec025c356c08f7e block: 20389626
- current block number: 20389626

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20389626 (main branch discovery), not current.

```diff
    contract SystemConfig (0x886B187C3D293B1449A3A0F23Ca9e2269E0f2664) {
    +++ description: None
      fieldMeta:
+        {"scalar":{"severity":"LOW","description":"A system configuration parameter used as dynamic L2 gas overhead in the L2 fee calculation."}}
    }
```

Generated with discovered.json: 0x19f4d93eec683b08cf420083a293d12ebb2fd2f9

# Diff at Fri, 26 Jul 2024 08:48:02 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@f98f9bf0ba32e20ec33942af664ae6ed27e8172d block: 20110288
- current block number: 20389626

## Description

Gas limit raise to 180M, the highest current limit on OP stack chains. With a block time of 2s and elasticity of 10x, this currently puts Orderly at 9 GGas/s on average. This is ~ 7x Ethereum Mainnet's 1,25 GGas/s and has a much higher surge scaling buffer. (elasticity)

Note: While orderly has ~ 80% higher Gas/s than base, base more regularly hits its target Gas/s, producing more high-usage data.

## Watched changes

```diff
    contract SystemConfig (0x886B187C3D293B1449A3A0F23Ca9e2269E0f2664) {
    +++ description: None
      values.gasLimit:
-        100000000
+        180000000
    }
```

Generated with discovered.json: 0x88f0e627756850be622db543fb18dbd56fb4d43e

# Diff at Thu, 18 Jul 2024 10:32:27 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@d89fe52cb65d643cef712d1d7910564a7acf2dce block: 20110288
- current block number: 20110288

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20110288 (main branch discovery), not current.

```diff
    contract ConduitMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      descriptions:
+        ["It can act on behalf of 0xb570F4aD27e7De879A2E4F2F3DE27dBaBc20E9B9, inheriting its permissions."]
    }
```

Generated with discovered.json: 0xacba6ab4a87f8e5be0f863efe0fa9ae45984e681

# Diff at Mon, 17 Jun 2024 08:23:38 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@f39ec7f15738d4847f0cbde4818140d42e26440f block: 20082412
- current block number: 20110288

## Description

Gas limit raised. Now ~10% higher than base L2.

## Watched changes

```diff
    contract SystemConfig (0x886B187C3D293B1449A3A0F23Ca9e2269E0f2664) {
    +++ description: None
      values.gasLimit:
-        60000000
+        100000000
    }
```

Generated with discovered.json: 0xfbd9c919a36d8ba7131d60ce803c892cd260a714

# Diff at Thu, 13 Jun 2024 10:50:57 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@cd33b23d6b32d4d38eea92d309fd854193b90203 block: 19927716
- current block number: 20082412

## Description

Gas limit raised.

## Watched changes

```diff
    contract SystemConfig (0x886B187C3D293B1449A3A0F23Ca9e2269E0f2664) {
    +++ description: None
      values.gasLimit:
-        40000000
+        60000000
    }
```

Generated with discovered.json: 0x8ea4f813fa7d4b58eb69ad964fafb89cd12576b2

# Diff at Wed, 22 May 2024 20:10:39 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@bac4efad06804152ae97853892e122a801bbc509 block: 19918763
- current block number: 19927716

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

Generated with discovered.json: 0x540ca88f8981b161a151986f136629dc3e13d7c5

# Diff at Tue, 21 May 2024 14:05:34 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@c032520e456d0e6bee8b65e420ff7dba9f36bd48 block: 19859812
- current block number: 19918763

## Description

Name change.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19859812 (main branch discovery), not current.

```diff
    contract OrderlyMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      name:
-        "OrderlyMultisig"
+        "ConduitMultisig"
    }
```

Generated with discovered.json: 0x5edacefb20bc8a6791e626d8341b2641515ce115

# Diff at Mon, 13 May 2024 08:10:33 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@142cacbaef1c026127ab0d88f45c576741b3a345 block: 19830984
- current block number: 19859812

## Description

After doubling the gasLimit, it is now decreased to 40M, still a 1/3 increase from the original 30M.

## Watched changes

```diff
    contract SystemConfig (0x886B187C3D293B1449A3A0F23Ca9e2269E0f2664) {
    +++ description: None
      values.gasLimit:
-        60000000
+        40000000
    }
```

Generated with discovered.json: 0x5d1123ab6324ea7e55ea01032dfc89c12ca212e2

# Diff at Thu, 09 May 2024 07:27:13 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@d3bba0812727b9105a3f44fe55a68572c804b992 block: 19776802
- current block number: 19830984

## Description

The gasLimit for L2 is doubled. Current block time is 2s, elasticity is 10x. This config is now identical to Base L2.

## Watched changes

```diff
    contract SystemConfig (0x886B187C3D293B1449A3A0F23Ca9e2269E0f2664) {
    +++ description: None
      values.gasLimit:
-        30000000
+        60000000
    }
```

Generated with discovered.json: 0x3edeab069898df087a548f652052250c2f97a55a

# Diff at Thu, 28 Mar 2024 10:33:33 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@dd32bb06b292cc8459fb09925454ee3a90f5c27e block: 19412725
- current block number: 19532040

## Description

Update discovery to include the multisig threshold.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19412725 (main branch discovery), not current.

```diff
    contract OrderlyMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      upgradeability.threshold:
+        "3 of 5 (60%)"
    }
```

```diff
    contract ChallengerMultisig (0xcE10372313Ca39Fbf75A09e7f4c0E57F070259f4) {
    +++ description: None
      upgradeability.threshold:
+        "4 of 6 (67%)"
    }
```

Generated with discovered.json: 0x27306da2737a02c26f8c4f41629c815ee18b5695

# Diff at Mon, 11 Mar 2024 15:24:12 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@d2d5fba14a44528004eaad2e4389550987c4f3cd block: 19370130
- current block number: 19412725

## Description

Update OP stack DA handler.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19370130 (main branch discovery), not current.

```diff
    contract SystemConfig (0x886B187C3D293B1449A3A0F23Ca9e2269E0f2664) {
    +++ description: None
      values.opStackDA.isSequencerSendingBlobTx:
+        false
    }
```

Generated with discovered.json: 0x3cbbe86d1549ff16f956680e8ecb073e926f6be1

# Diff at Tue, 05 Mar 2024 16:23:09 GMT:

- author: Radina Talanova (<nt.radina@gmail.com>)
- comparing to: main@529206d4dcd4dd7502f78a4a18a97240a3a0211b block: 19182535
- current block number: 19370130

## Description

Scalar - a system configuration parameter used as dynamic L2 gas overhead in the L2 fee calculation, has been decreased.

## Watched changes

```diff
    contract SystemConfig (0x886B187C3D293B1449A3A0F23Ca9e2269E0f2664) {
    +++ description: None
      values.scalar:
-        68400
+        13680
    }
```

Generated with discovered.json: 0xbe756234887059a7f1f0faab5602440c3db37a6d

# Diff at Thu, 08 Feb 2024 09:25:18 GMT:

- author: Michał Sobieraj-Jakubiec (<michalsidzej@gmail.com>)
- current block number: 19182535

## Description

Update discovery to include the multisig threshold.

## Initial discovery

```diff
+   Status: CREATED
    contract OrderlyMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    }
```

```diff
+   Status: CREATED
    contract L2OutputOracle (0x5e76821C3c1AbB9fD6E310224804556C61D860e0) {
    }
```

```diff
+   Status: CREATED
    contract AddressManager (0x87630a802a3789463eC4b00f89b27b1e9f6b92e9) {
    }
```

```diff
+   Status: CREATED
    contract SystemConfig (0x886B187C3D293B1449A3A0F23Ca9e2269E0f2664) {
    }
```

```diff
+   Status: CREATED
    contract OptimismPortal (0x91493a61ab83b62943E6dCAa5475Dd330704Cc84) {
    }
```

```diff
+   Status: CREATED
    contract L1ERC721Bridge (0x934Ab59Ef14b638653b1C0FEf7aB9a72186393DC) {
    }
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0xb570F4aD27e7De879A2E4F2F3DE27dBaBc20E9B9) {
    }
```

```diff
+   Status: CREATED
    contract L1CrossDomainMessenger (0xc76543A64666d9a073FaEF4e75F651c88e7DBC08) {
    }
```

```diff
+   Status: CREATED
    contract ChallengerMultisig (0xcE10372313Ca39Fbf75A09e7f4c0E57F070259f4) {
    }
```

```diff
+   Status: CREATED
    contract L1StandardBridge (0xe07eA0436100918F157DF35D01dCE5c11b16D1F1) {
    }
```
