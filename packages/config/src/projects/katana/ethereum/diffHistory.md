Generated with discovered.json: 0x931b50b0738f7df8ea39eca00aeebcf7afbb33f6

# Diff at Fri, 01 Aug 2025 13:23:05 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@802242fc2209399893865092b1048d583aafc2bb block: 1753356947
- current timestamp: 1754054572

## Description

op  stack operator fee constant set.

three members added to multisig, threshold increased.

## Watched changes

```diff
    contract SystemConfig (0xb6e1f8B589A14B79DDD3aD7F0589AB548c70C174) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      values.operatorFeeConstant:
-        0
+        1351351351351
    }
```

```diff
    contract Polygon Multisig 2 (0xd0673F989bc3BA9314d0AAF28BfC84e99B7898CC) {
    +++ description: None
      values.$members.0:
+        "eth:0x2483A0d6a3Bd89D5C17aA80B3f8f6102ac053361"
      values.$members.1:
+        "eth:0x73D8846324B30477EA3Ac055589e40F39DE497F8"
      values.$members.2:
+        "eth:0x34d23C4fb6542B467cA8724bAD30AC811399b184"
      values.$threshold:
-        1
+        3
      values.multisigThreshold:
-        "1 of 2 (50%)"
+        "3 of 5 (60%)"
    }
```

Generated with discovered.json: 0xa91c32ac9e9a7e5b109b7094b0b8cb6daec8e3d3

# Diff at Thu, 24 Jul 2025 16:55:25 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@a3f740c0fd51a5745c45d8f349ab01f4f33f7770 block: 22988752
- current block number: 22988752

## Description

config: set dispute game impl changes to high severity.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22988752 (main branch discovery), not current.

```diff
    contract DisputeGameFactory (0xe06278351d120288eDfCB963F934113Ca3C21AFe) {
    +++ description: The dispute game factory allows the creation of dispute games, used to propose state roots and eventually challenge them.
      fieldMeta:
+        {"gameImpls":{"severity":"HIGH"},"game1337":{"severity":"HIGH"}}
    }
```

Generated with discovered.json: 0xb4ffe8a242a8b05c153c4f7d3aeab0d2f3bf1d2c

# Diff at Thu, 24 Jul 2025 11:38:32 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@daf9b4c0c3e0cc879ae7e4d12a2a3cc6a78da2a5 block: 22966867
- current block number: 22988752

## Description

Upgrade op stack contracts to known versions. The only abberant contract is the new OptiPortal2, which, like the old one, [disallows deposited transactions](https://disco.l2beat.com/diff/eth:0xB443Da3e07052204A02d630a8933dAc05a0d6fB4/eth:0x51c852eC17062FB229A117Cb8abCBc7Eb171D5Bc).

Config: Kailua added to OptimismPortal2 and DisputeGameFectory.

## Watched changes

```diff
    contract L1ERC721Bridge (0x15a32FCeA89617Ff450F094cDE102CCa46598B7F) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      sourceHashes.1:
-        "0x482ec6e91304ac39a3fb4505634427bddfddee23b8e93a4f7f995ca5083ae3c3"
+        "0x28669b49da3effd51f0f9424ca9cdd455c5b9327c09a40c65fc06f114a6eb837"
      values.$implementation:
-        "eth:0xAE2AF01232a6c4a4d3012C5eC5b1b35059caF10d"
+        "eth:0x7aE1d3BD877a4C5CA257404ce26BE93A02C98013"
      values.$pastUpgrades.1:
+        ["2025-07-23T17:04:59.000Z","0xc60a3166aa296b584f143a129ac53f156ee9946373ff5fb97b3785cc5fc092a2",["eth:0x276d3730f219f7ec22274f7263180b8452B46d47"]]
      values.$pastUpgrades.2:
+        ["2025-07-23T17:04:59.000Z","0xc60a3166aa296b584f143a129ac53f156ee9946373ff5fb97b3785cc5fc092a2",["eth:0x7aE1d3BD877a4C5CA257404ce26BE93A02C98013"]]
      values.$upgradeCount:
-        1
+        3
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
    contract ProxyAdmin (0x19DbD16f0a8e706D817B7e3b7bcF72917Ebb8832) {
    +++ description: None
      directlyReceivedPermissions.2:
+        {"permission":"upgrade","from":"eth:0x1AaA08d577cbC3da3b955DC1B7a281D7b8fE3372","role":"admin"}
      directlyReceivedPermissions.5:
-        {"permission":"upgrade","from":"eth:0x79ecD8d8040496014bcD3bA16AdF3914b23f8Fd5","role":"admin"}
    }
```

```diff
    contract L1CrossDomainMessenger (0x2008A6Ba8CAF85AaFAe7880664Dfe681D533ac2E) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      sourceHashes.1:
-        "0x1cc8a3b7de3d2c54c4706bb3f3015714d3b56647fc9fbfd6f8b068f5f63c1c25"
+        "0x03bcdc719cb7bd0a1377c01bb50b30a6122b308f673b7d7b15a3bb8628e6bd8c"
      values.$implementation:
-        "eth:0xD3494713A5cfaD3F5359379DfA074E2Ac8C6Fd65"
+        "eth:0x5D5a095665886119693F0B41d8DFeE78da033e8B"
      values.$pastUpgrades.1:
+        ["2025-07-23T17:04:59.000Z","0xc60a3166aa296b584f143a129ac53f156ee9946373ff5fb97b3785cc5fc092a2",["eth:0x3eA6084748ED1b2A9B5D4426181F1ad8C93F6231"]]
      values.$pastUpgrades.2:
+        ["2025-07-23T17:04:59.000Z","0xc60a3166aa296b584f143a129ac53f156ee9946373ff5fb97b3785cc5fc092a2",["eth:0x5D5a095665886119693F0B41d8DFeE78da033e8B"]]
      values.$upgradeCount:
-        1
+        3
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
    contract OptimismPortal2 (0x250D30c523104bf0a06825e7eAdE4Dc46EdfE40E) {
    +++ description: The OptimismPortal contract usually is the main entry point to deposit funds from L1 to L2 or for finalizing withdrawals. It specifies which game type can be used for withdrawals, which currently is the PermissionedDisputeGame. This specific fork of the standard contract **disables the depositTransaction() function**, which prevents users from sending or forcing any transactions from L1 to L2, including token deposits. It is instead used for configuration and administration of the system.
      sourceHashes.1:
-        "0x1e6e48895b45b98acfe8b9c9f4568d3662e2932d82019f4ea721e2f7b57a58fc"
+        "0x9cf3cb8a68c82a3a8328495d5f019daa51e9098a69b69ee8e349e3058b789338"
      values.$implementation:
-        "eth:0x9a6C2Dcc7e523f87716e17Ba36D10CCfFA0A60bb"
+        "eth:0x51c852eC17062FB229A117Cb8abCBc7Eb171D5Bc"
      values.$pastUpgrades.2:
+        ["2025-07-23T17:04:59.000Z","0xc60a3166aa296b584f143a129ac53f156ee9946373ff5fb97b3785cc5fc092a2",["eth:0x2D7e764a0D9919e16983a46595CfA81fc34fa7Cd"]]
      values.$pastUpgrades.3:
+        ["2025-07-23T17:04:59.000Z","0xc60a3166aa296b584f143a129ac53f156ee9946373ff5fb97b3785cc5fc092a2",["eth:0xB443Da3e07052204A02d630a8933dAc05a0d6fB4"]]
      values.$pastUpgrades.4:
+        ["2025-07-23T17:04:59.000Z","0xc60a3166aa296b584f143a129ac53f156ee9946373ff5fb97b3785cc5fc092a2",["eth:0x51c852eC17062FB229A117Cb8abCBc7Eb171D5Bc"]]
      values.$upgradeCount:
-        2
+        5
      values.version:
-        "3.11.0-beta.6"
+        "3.14.0"
      implementationNames.eth:0x9a6C2Dcc7e523f87716e17Ba36D10CCfFA0A60bb:
-        "OptimismPortal2"
      implementationNames.eth:0x51c852eC17062FB229A117Cb8abCBc7Eb171D5Bc:
+        "OptimismPortal2"
    }
```

```diff
-   Status: DELETED
    contract PermissionedDisputeGame (0x2d4B822F8B74AdE7fcD5F740967f4dFcD2fef5e4)
    +++ description: Same as FaultDisputeGame, but only two permissioned addresses are designated as proposer and challenger.
```

```diff
    contract SuperchainConfig (0x2F439B95fa789C5d3a5C99cc70EB3ee83D08a811) {
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      sourceHashes.1:
-        "0x3f0bcc82f3184c1cb2e9aa6d3ecdd7c863186eea851dda56dd7e100d9174b840"
+        "0x03dba37173051b02bc81487e181c791bcf1aef664c249e5d035f11f488bdd686"
      values.$implementation:
-        "eth:0x838897A86Cb4F130D0eFC1203d7dA6D0db4bEd1A"
+        "eth:0x4da82a327773965b8d4D85Fa3dB8249b387458E7"
      values.$pastUpgrades.3:
+        ["2025-07-23T17:04:59.000Z","0xc60a3166aa296b584f143a129ac53f156ee9946373ff5fb97b3785cc5fc092a2",["eth:0x4da82a327773965b8d4D85Fa3dB8249b387458E7"]]
      values.$upgradeCount:
-        3
+        4
      values.version:
-        "1.1.1-beta.1"
+        "1.2.0"
      implementationNames.eth:0x838897A86Cb4F130D0eFC1203d7dA6D0db4bEd1A:
-        "SuperchainConfig"
      implementationNames.eth:0x4da82a327773965b8d4D85Fa3dB8249b387458E7:
+        "SuperchainConfig"
    }
```

```diff
    contract Katana Foundation Engineering/Security Multisig (0x4e981bAe8E3cd06Ca911ffFE5504B2653ac1C38a) {
    +++ description: None
      receivedPermissions.6:
+        {"permission":"upgrade","from":"eth:0x1AaA08d577cbC3da3b955DC1B7a281D7b8fE3372","role":"admin","via":[{"address":"eth:0x19DbD16f0a8e706D817B7e3b7bcF72917Ebb8832"}]}
      receivedPermissions.10:
-        {"permission":"upgrade","from":"eth:0x79ecD8d8040496014bcD3bA16AdF3914b23f8Fd5","role":"admin","via":[{"address":"eth:0x19DbD16f0a8e706D817B7e3b7bcF72917Ebb8832"}]}
    }
```

```diff
-   Status: DELETED
    contract MIPS (0x5fE03a12C1236F9C22Cb6479778DDAa4bce6299C)
    +++ description: The MIPS contract is used to execute the final step of the dispute game which objectively determines the winner of the dispute.
```

```diff
    contract DelayedWETH (0x74034597d29613CC8C0BDc8780e1d292A553Bd32) {
    +++ description: Contract designed to hold the bonded ETH for each game. It is designed as a wrapper around WETH to allow an owner to function as a backstop if a game would incorrectly distribute funds.
      sourceHashes.1:
-        "0xfff6f4cca21febd4323222e2ca87ec8b78edfdeeca942468fbf331e537815484"
+        "0x1c7d0fda5ed6d8fc7f5b5f7df5e307f0fcfd173fa5833ea9fce8875d5d44d86a"
      values.$implementation:
-        "eth:0x71e966Ae981d1ce531a7b6d23DC0f27B38409087"
+        "eth:0x5e40B9231B86984b5150507046e354dbFbeD3d9e"
      values.$pastUpgrades.1:
+        ["2025-07-23T17:04:59.000Z","0xc60a3166aa296b584f143a129ac53f156ee9946373ff5fb97b3785cc5fc092a2",["eth:0x5e40B9231B86984b5150507046e354dbFbeD3d9e"]]
      values.$upgradeCount:
-        1
+        2
      values.delay:
-        604800
+        302400
      values.version:
-        "1.1.0"
+        "1.3.0"
      implementationNames.eth:0x71e966Ae981d1ce531a7b6d23DC0f27B38409087:
-        "DelayedWETH"
      implementationNames.eth:0x5e40B9231B86984b5150507046e354dbFbeD3d9e:
+        "DelayedWETH"
    }
```

```diff
-   Status: DELETED
    contract AnchorStateRegistry (0x79ecD8d8040496014bcD3bA16AdF3914b23f8Fd5)
    +++ description: Contains the latest confirmed state root that can be used as a starting point in a dispute game.
```

```diff
    contract L1StandardBridge (0x98906C3f90A06B5484DD67bf32938815d2993dBC) {
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
-   Status: DELETED
    contract PreimageOracle (0x9c065e11870B891D214Bc2Da7EF1f9DDFA1BE277)
    +++ description: The PreimageOracle contract is used to load the required data from L1 for a dispute game.
```

```diff
    contract OptimismMintableERC20Factory (0xA84C37cD0b9bA1B43276C11976DBE9d1344C7f4E) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintableERC20 as this chain's representation of a token on the host chain, or vice-versa.
      sourceHashes.1:
-        "0x4c5ac4e53576924cabbd2a471f368a541bc3f4b1f53fa41a389692fcc62f6176"
+        "0x9650b4bba6299e410f01a369a95a2c57e1c3ca35f0d80c13f4f59fc468f370e5"
      values.$implementation:
-        "eth:0xE01efbeb1089D1d1dB9c6c8b135C934C0734c846"
+        "eth:0x5493f4677A186f64805fe7317D6993ba4863988F"
      values.$pastUpgrades.1:
+        ["2025-07-23T17:04:59.000Z","0xc60a3166aa296b584f143a129ac53f156ee9946373ff5fb97b3785cc5fc092a2",["eth:0x5493f4677A186f64805fe7317D6993ba4863988F"]]
      values.$upgradeCount:
-        1
+        2
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
    contract SystemConfig (0xb6e1f8B589A14B79DDD3aD7F0589AB548c70C174) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      sourceHashes.1:
-        "0xc7135dbd2a53312d36df3f3ee91ce0a5a459ab8fc7725880a3a9c55a5fa0ed6c"
+        "0x921de6fc906d159fdcef862d2b9559063f5e7b9b7588fa5f33153360ddf296e7"
      values.$implementation:
-        "eth:0xAB9d6cB7A427c0765163A7f45BB91cAfe5f2D375"
+        "eth:0x340f923E5c7cbB2171146f64169EC9d5a9FfE647"
      values.$pastUpgrades.2:
+        ["2025-07-23T17:04:59.000Z","0xc60a3166aa296b584f143a129ac53f156ee9946373ff5fb97b3785cc5fc092a2",["eth:0x760C48C62A85045A6B69f07F4a9f22868659CbCc"]]
      values.$pastUpgrades.3:
+        ["2025-07-23T17:04:59.000Z","0xc60a3166aa296b584f143a129ac53f156ee9946373ff5fb97b3785cc5fc092a2",["eth:0x340f923E5c7cbB2171146f64169EC9d5a9FfE647"]]
      values.$upgradeCount:
-        2
+        4
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
+        {"l1CrossDomainMessenger":"eth:0x2008A6Ba8CAF85AaFAe7880664Dfe681D533ac2E","l1ERC721Bridge":"eth:0x15a32FCeA89617Ff450F094cDE102CCa46598B7F","l1StandardBridge":"eth:0x98906C3f90A06B5484DD67bf32938815d2993dBC","disputeGameFactory":"eth:0xe06278351d120288eDfCB963F934113Ca3C21AFe","optimismPortal":"eth:0x250D30c523104bf0a06825e7eAdE4Dc46EdfE40E","optimismMintableERC20Factory":"eth:0xA84C37cD0b9bA1B43276C11976DBE9d1344C7f4E"}
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
    contract DisputeGameFactory (0xe06278351d120288eDfCB963F934113Ca3C21AFe) {
    +++ description: The dispute game factory allows the creation of dispute games, used to propose state roots and eventually challenge them.
      sourceHashes.1:
-        "0x7f307d6191215a72b6c24c01b3c2fc87c84f7fb346790132e58736caa2d1dd14"
+        "0x85ca17941ef36ac6b28a4f8f89803d0d41ef419c47586dcd3acdb47ee9617285"
      values.$implementation:
-        "eth:0xc641A33cab81C559F2bd4b21EA34C290E2440C2B"
+        "eth:0x4bbA758F006Ef09402eF31724203F316ab74e4a0"
      values.$pastUpgrades.1:
+        ["2025-07-23T17:04:59.000Z","0xc60a3166aa296b584f143a129ac53f156ee9946373ff5fb97b3785cc5fc092a2",["eth:0x4bbA758F006Ef09402eF31724203F316ab74e4a0"]]
      values.$upgradeCount:
-        1
+        2
      values.gameImpls.1:
-        "eth:0x2d4B822F8B74AdE7fcD5F740967f4dFcD2fef5e4"
+        "eth:0x667b7DA73DA7B2A75286378FF45637eEaE9B4793"
      values.version:
-        "1.0.0"
+        "1.0.1"
      implementationNames.eth:0xc641A33cab81C559F2bd4b21EA34C290E2440C2B:
-        "DisputeGameFactory"
      implementationNames.eth:0x4bbA758F006Ef09402eF31724203F316ab74e4a0:
+        "DisputeGameFactory"
    }
```

```diff
+   Status: CREATED
    contract AnchorStateRegistry (0x1AaA08d577cbC3da3b955DC1B7a281D7b8fE3372)
    +++ description: Contains the latest confirmed state root that can be used as a starting point in a dispute game.
```

```diff
+   Status: CREATED
    contract PreimageOracle (0x1fb8cdFc6831fc866Ed9C51aF8817Da5c287aDD3)
    +++ description: The PreimageOracle contract is used to load the required data from L1 for a dispute game.
```

```diff
+   Status: CREATED
    contract PermissionedDisputeGame (0x667b7DA73DA7B2A75286378FF45637eEaE9B4793)
    +++ description: Same as FaultDisputeGame, but only two permissioned addresses are designated as proposer and challenger.
```

```diff
+   Status: CREATED
    contract MIPS (0xF027F4A985560fb13324e943edf55ad6F1d15Dc1)
    +++ description: The MIPS contract is used to execute the final step of the dispute game which objectively determines the winner of the dispute.
```

## Source code changes

```diff
.../AnchorStateRegistry/AnchorStateRegistry.sol    |  270 ++-
 .../DelayedWETH/DelayedWETH.sol                    |  231 +--
 .../DisputeGameFactory/DisputeGameFactory.sol      |  240 +--
 .../L1CrossDomainMessenger.sol                     |  736 ++++++--
 .../L1ERC721Bridge/L1ERC721Bridge.sol              |  418 +++--
 .../L1StandardBridge/L1StandardBridge.sol          |  508 ++++--
 .../ethereum/{.flat@22966867 => .flat}/MIPS.sol    | 1922 ++++++++++++++------
 .../OptimismMintableERC20Factory.sol               |   30 +-
 .../OptimismPortal2/OptimismPortal2.sol            |  529 ++----
 .../PermissionedDisputeGame.sol                    |  267 ++-
 .../{.flat@22966867 => .flat}/PreimageOracle.sol   |  216 +--
 .../SuperchainConfig/SuperchainConfig.sol          |    8 +-
 .../SystemConfig/SystemConfig.sol                  | 1439 +--------------
 13 files changed, 3410 insertions(+), 3404 deletions(-)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22966867 (main branch discovery), not current.

```diff
    contract DisputeGameFactory (0xe06278351d120288eDfCB963F934113Ca3C21AFe) {
    +++ description: The dispute game factory allows the creation of dispute games, used to propose state roots and eventually challenge them.
      values.game1337:
+        "eth:0x0000000000000000000000000000000000000000"
    }
```

Generated with discovered.json: 0xcc3793504351cb584ce330874f8995ff7b6bac5e

# Diff at Mon, 21 Jul 2025 10:08:59 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@c89d5207a278197d1d4bfd60ac8e37852accba7c block: 22895938
- current block number: 22966867

## Description

MS two members added.

## Watched changes

```diff
    contract Katana yieldRecipient Mulsitig (0x67C912fF560951526BffDff66dFbD4DF8AE23756) {
    +++ description: None
      values.$members.0:
+        "eth:0x34d23C4fb6542B467cA8724bAD30AC811399b184"
      values.$members.1:
+        "eth:0x09f5F2592791208219A1F51e3855Be9419fF6bE4"
      values.multisigThreshold:
-        "2 of 5 (40%)"
+        "2 of 7 (29%)"
    }
```

Generated with discovered.json: 0xdd6f8c72b7d5f1d1507f9d3bf9b72685cface25c

# Diff at Mon, 14 Jul 2025 12:45:14 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@9f4300dad2f3d080cd56fa311d4a848556c74e72 block: 22895938
- current block number: 22895938

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22895938 (main branch discovery), not current.

```diff
    EOA  (0x000000000000000000000000000000000000dEaD) {
    +++ description: None
      address:
-        "0x000000000000000000000000000000000000dEaD"
+        "eth:0x000000000000000000000000000000000000dEaD"
    }
```

```diff
    EOA  (0x000d4411cdeb152378626B5C5E33fd5D6808939a) {
    +++ description: None
      address:
-        "0x000d4411cdeb152378626B5C5E33fd5D6808939a"
+        "eth:0x000d4411cdeb152378626B5C5E33fd5D6808939a"
    }
```

```diff
    EOA  (0x0A4857fD89ABfB7536a6D0Bd4400EF769E84Ec8b) {
    +++ description: None
      address:
-        "0x0A4857fD89ABfB7536a6D0Bd4400EF769E84Ec8b"
+        "eth:0x0A4857fD89ABfB7536a6D0Bd4400EF769E84Ec8b"
    }
```

```diff
    EOA  (0x0D61C8b6CA9669A36F351De3AE335e9689dd9C5b) {
    +++ description: None
      address:
-        "0x0D61C8b6CA9669A36F351De3AE335e9689dd9C5b"
+        "eth:0x0D61C8b6CA9669A36F351De3AE335e9689dd9C5b"
    }
```

```diff
    contract AggchainFEP (0x100d3ca4f97776A40A7D93dB4AbF0FEA34230666) {
    +++ description: The main system contract defining the katana Layer 2 logic. As this contract is based on the OP-Succinct L2OutputOracle, OP stack outputRoots (L2 state roots) are saved here.
      address:
-        "0x100d3ca4f97776A40A7D93dB4AbF0FEA34230666"
+        "eth:0x100d3ca4f97776A40A7D93dB4AbF0FEA34230666"
      values.$admin:
-        "0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2"
+        "eth:0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2"
      values.$implementation:
-        "0xe7FE45579D784DC83B0feD844A65f4cEEFDe5682"
+        "eth:0xe7FE45579D784DC83B0feD844A65f4cEEFDe5682"
      values.$pastUpgrades.0.2.0:
-        "0x18C45DD422f6587357a6d3b23307E75D42b2bc5B"
+        "eth:0x18C45DD422f6587357a6d3b23307E75D42b2bc5B"
      values.$pastUpgrades.1.2.0:
-        "0x18C45DD422f6587357a6d3b23307E75D42b2bc5B"
+        "eth:0x18C45DD422f6587357a6d3b23307E75D42b2bc5B"
      values.$pastUpgrades.2.2.0:
-        "0xe7FE45579D784DC83B0feD844A65f4cEEFDe5682"
+        "eth:0xe7FE45579D784DC83B0feD844A65f4cEEFDe5682"
      values.admin:
-        "0xa4000bDD2bB92ce6750b31F1eeda47Bd1cB8e6e4"
+        "eth:0xa4000bDD2bB92ce6750b31F1eeda47Bd1cB8e6e4"
      values.aggchainManager:
-        "0x4e981bAe8E3cd06Ca911ffFE5504B2653ac1C38a"
+        "eth:0x4e981bAe8E3cd06Ca911ffFE5504B2653ac1C38a"
      values.aggLayerGateway:
-        "0x046Bb8bb98Db4ceCbB2929542686B74b516274b3"
+        "eth:0x046Bb8bb98Db4ceCbB2929542686B74b516274b3"
      values.bridgeAddress:
-        "0x2a3DD3EB832aF982ec71669E178424b10Dca2EDe"
+        "eth:0x2a3DD3EB832aF982ec71669E178424b10Dca2EDe"
      values.forceBatchAddress:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.gasTokenAddress:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.globalExitRootManager:
-        "0x580bda1e7A0CFAe92Fa7F6c20A3794F169CE3CFb"
+        "eth:0x580bda1e7A0CFAe92Fa7F6c20A3794F169CE3CFb"
      values.optimisticModeManager:
-        "0x4e981bAe8E3cd06Ca911ffFE5504B2653ac1C38a"
+        "eth:0x4e981bAe8E3cd06Ca911ffFE5504B2653ac1C38a"
      values.pendingAdmin:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.pendingAggchainManager:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.pendingOptimisticModeManager:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.pendingVKeyManager:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.pol:
-        "0x455e53CBB86018Ac2B8092FdCd39d8444aFFC3F6"
+        "eth:0x455e53CBB86018Ac2B8092FdCd39d8444aFFC3F6"
      values.rollupManager:
-        "0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2"
+        "eth:0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2"
      values.trustedSequencer:
-        "0xC1E65a0cEbF95f56Cd8729f7e37CB33eD94d6439"
+        "eth:0xC1E65a0cEbF95f56Cd8729f7e37CB33eD94d6439"
      values.vKeyManager:
-        "0x4e981bAe8E3cd06Ca911ffFE5504B2653ac1C38a"
+        "eth:0x4e981bAe8E3cd06Ca911ffFE5504B2653ac1C38a"
      implementationNames.0x100d3ca4f97776A40A7D93dB4AbF0FEA34230666:
-        "PolygonTransparentProxy"
      implementationNames.0xe7FE45579D784DC83B0feD844A65f4cEEFDe5682:
-        "AggchainFEP"
      implementationNames.eth:0x100d3ca4f97776A40A7D93dB4AbF0FEA34230666:
+        "PolygonTransparentProxy"
      implementationNames.eth:0xe7FE45579D784DC83B0feD844A65f4cEEFDe5682:
+        "AggchainFEP"
    }
```

```diff
    contract ProxyAdmin (0x14Be6579A41342ca6B402ec85E7be538e6Ade951) {
    +++ description: None
      address:
-        "0x14Be6579A41342ca6B402ec85E7be538e6Ade951"
+        "eth:0x14Be6579A41342ca6B402ec85E7be538e6Ade951"
      values.owner:
-        "0x2De242e27386e224E5fbF110EA8406d5B70740ec"
+        "eth:0x2De242e27386e224E5fbF110EA8406d5B70740ec"
      implementationNames.0x14Be6579A41342ca6B402ec85E7be538e6Ade951:
-        "ProxyAdmin"
      implementationNames.eth:0x14Be6579A41342ca6B402ec85E7be538e6Ade951:
+        "ProxyAdmin"
    }
```

```diff
    contract L1ERC721Bridge (0x15a32FCeA89617Ff450F094cDE102CCa46598B7F) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      address:
-        "0x15a32FCeA89617Ff450F094cDE102CCa46598B7F"
+        "eth:0x15a32FCeA89617Ff450F094cDE102CCa46598B7F"
      values.$admin:
-        "0x19DbD16f0a8e706D817B7e3b7bcF72917Ebb8832"
+        "eth:0x19DbD16f0a8e706D817B7e3b7bcF72917Ebb8832"
      values.$implementation:
-        "0xAE2AF01232a6c4a4d3012C5eC5b1b35059caF10d"
+        "eth:0xAE2AF01232a6c4a4d3012C5eC5b1b35059caF10d"
      values.$pastUpgrades.0.2.0:
-        "0xAE2AF01232a6c4a4d3012C5eC5b1b35059caF10d"
+        "eth:0xAE2AF01232a6c4a4d3012C5eC5b1b35059caF10d"
      values.messenger:
-        "0x2008A6Ba8CAF85AaFAe7880664Dfe681D533ac2E"
+        "eth:0x2008A6Ba8CAF85AaFAe7880664Dfe681D533ac2E"
      values.MESSENGER:
-        "0x2008A6Ba8CAF85AaFAe7880664Dfe681D533ac2E"
+        "eth:0x2008A6Ba8CAF85AaFAe7880664Dfe681D533ac2E"
      values.OTHER_BRIDGE:
-        "0x4200000000000000000000000000000000000014"
+        "eth:0x4200000000000000000000000000000000000014"
      values.otherBridge:
-        "0x4200000000000000000000000000000000000014"
+        "eth:0x4200000000000000000000000000000000000014"
      values.superchainConfig:
-        "0x2F439B95fa789C5d3a5C99cc70EB3ee83D08a811"
+        "eth:0x2F439B95fa789C5d3a5C99cc70EB3ee83D08a811"
      implementationNames.0x15a32FCeA89617Ff450F094cDE102CCa46598B7F:
-        "Proxy"
      implementationNames.0xAE2AF01232a6c4a4d3012C5eC5b1b35059caF10d:
-        "L1ERC721Bridge"
      implementationNames.eth:0x15a32FCeA89617Ff450F094cDE102CCa46598B7F:
+        "Proxy"
      implementationNames.eth:0xAE2AF01232a6c4a4d3012C5eC5b1b35059caF10d:
+        "L1ERC721Bridge"
    }
```

```diff
    contract Yearn Strategist Multisig (0x16388463d60FFE0661Cf7F1f31a7D658aC790ff7) {
    +++ description: None
      address:
-        "0x16388463d60FFE0661Cf7F1f31a7D658aC790ff7"
+        "eth:0x16388463d60FFE0661Cf7F1f31a7D658aC790ff7"
      values.$implementation:
-        "0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
+        "eth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
      values.$members.0:
-        "0xB13C8f58a233607569D2F8411B912148aeC4aEe2"
+        "eth:0xB13C8f58a233607569D2F8411B912148aeC4aEe2"
      values.$members.1:
-        "0xBD5f1429Ab467E69BEeba51E547C00A21F2a2092"
+        "eth:0xBD5f1429Ab467E69BEeba51E547C00A21F2a2092"
      values.$members.2:
-        "0x787aba336583f4A1D4f8cBBFDFFD49f3a38De665"
+        "eth:0x787aba336583f4A1D4f8cBBFDFFD49f3a38De665"
      values.$members.3:
-        "0x2C2dc95F8C8060a7e3B354c1B9540881AEa1613C"
+        "eth:0x2C2dc95F8C8060a7e3B354c1B9540881AEa1613C"
      values.$members.4:
-        "0xd0002c648CCa8DeE2f2b8D70D542Ccde8ad6EC03"
+        "eth:0xd0002c648CCa8DeE2f2b8D70D542Ccde8ad6EC03"
      values.$members.5:
-        "0x1b5f15DCb82d25f91c65b53CEe151E8b9fBdD271"
+        "eth:0x1b5f15DCb82d25f91c65b53CEe151E8b9fBdD271"
      values.$members.6:
-        "0x254f44F45ac892730e511f143DEd3Cd920b075aF"
+        "eth:0x254f44F45ac892730e511f143DEd3Cd920b075aF"
      implementationNames.0x16388463d60FFE0661Cf7F1f31a7D658aC790ff7:
-        "Proxy"
      implementationNames.0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
-        "GnosisSafe"
      implementationNames.eth:0x16388463d60FFE0661Cf7F1f31a7D658aC790ff7:
+        "Proxy"
      implementationNames.eth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
+        "GnosisSafe"
    }
```

```diff
    contract ProxyAdmin (0x19DbD16f0a8e706D817B7e3b7bcF72917Ebb8832) {
    +++ description: None
      address:
-        "0x19DbD16f0a8e706D817B7e3b7bcF72917Ebb8832"
+        "eth:0x19DbD16f0a8e706D817B7e3b7bcF72917Ebb8832"
      values.addressManager:
-        "0xEaB94275eD336D80d4F46EA8Ea0427e351f11D65"
+        "eth:0xEaB94275eD336D80d4F46EA8Ea0427e351f11D65"
      values.owner:
-        "0x4e981bAe8E3cd06Ca911ffFE5504B2653ac1C38a"
+        "eth:0x4e981bAe8E3cd06Ca911ffFE5504B2653ac1C38a"
      implementationNames.0x19DbD16f0a8e706D817B7e3b7bcF72917Ebb8832:
-        "ProxyAdmin"
      implementationNames.eth:0x19DbD16f0a8e706D817B7e3b7bcF72917Ebb8832:
+        "ProxyAdmin"
    }
```

```diff
    EOA  (0x1b5f15DCb82d25f91c65b53CEe151E8b9fBdD271) {
    +++ description: None
      address:
-        "0x1b5f15DCb82d25f91c65b53CEe151E8b9fBdD271"
+        "eth:0x1b5f15DCb82d25f91c65b53CEe151E8b9fBdD271"
    }
```

```diff
    EOA  (0x1DD6473a6bb5fF9041D945C7d15AC8fBc2Ee1164) {
    +++ description: None
      address:
-        "0x1DD6473a6bb5fF9041D945C7d15AC8fBc2Ee1164"
+        "eth:0x1DD6473a6bb5fF9041D945C7d15AC8fBc2Ee1164"
    }
```

```diff
    EOA  (0x1FFDA89C755f6D4Af069897D77CcAbb580Fd412a) {
    +++ description: None
      address:
-        "0x1FFDA89C755f6D4Af069897D77CcAbb580Fd412a"
+        "eth:0x1FFDA89C755f6D4Af069897D77CcAbb580Fd412a"
    }
```

```diff
    contract L1CrossDomainMessenger (0x2008A6Ba8CAF85AaFAe7880664Dfe681D533ac2E) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      address:
-        "0x2008A6Ba8CAF85AaFAe7880664Dfe681D533ac2E"
+        "eth:0x2008A6Ba8CAF85AaFAe7880664Dfe681D533ac2E"
      values.$admin:
-        "0x19DbD16f0a8e706D817B7e3b7bcF72917Ebb8832"
+        "eth:0x19DbD16f0a8e706D817B7e3b7bcF72917Ebb8832"
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
-        "0x250D30c523104bf0a06825e7eAdE4Dc46EdfE40E"
+        "eth:0x250D30c523104bf0a06825e7eAdE4Dc46EdfE40E"
      values.PORTAL:
-        "0x250D30c523104bf0a06825e7eAdE4Dc46EdfE40E"
+        "eth:0x250D30c523104bf0a06825e7eAdE4Dc46EdfE40E"
      values.ResolvedDelegateProxy_addressManager:
-        "0xEaB94275eD336D80d4F46EA8Ea0427e351f11D65"
+        "eth:0xEaB94275eD336D80d4F46EA8Ea0427e351f11D65"
      values.superchainConfig:
-        "0x2F439B95fa789C5d3a5C99cc70EB3ee83D08a811"
+        "eth:0x2F439B95fa789C5d3a5C99cc70EB3ee83D08a811"
      implementationNames.0x2008A6Ba8CAF85AaFAe7880664Dfe681D533ac2E:
-        "ResolvedDelegateProxy"
      implementationNames.0xD3494713A5cfaD3F5359379DfA074E2Ac8C6Fd65:
-        "L1CrossDomainMessenger"
      implementationNames.eth:0x2008A6Ba8CAF85AaFAe7880664Dfe681D533ac2E:
+        "ResolvedDelegateProxy"
      implementationNames.eth:0xD3494713A5cfaD3F5359379DfA074E2Ac8C6Fd65:
+        "L1CrossDomainMessenger"
    }
```

```diff
    EOA  (0x227D9Ea843910Edd305c42e7bB9Ce6D9f369238c) {
    +++ description: None
      address:
-        "0x227D9Ea843910Edd305c42e7bB9Ce6D9f369238c"
+        "eth:0x227D9Ea843910Edd305c42e7bB9Ce6D9f369238c"
    }
```

```diff
    contract OptimismPortal2 (0x250D30c523104bf0a06825e7eAdE4Dc46EdfE40E) {
    +++ description: The OptimismPortal contract usually is the main entry point to deposit funds from L1 to L2 or for finalizing withdrawals. It specifies which game type can be used for withdrawals, which currently is the PermissionedDisputeGame. This specific fork of the standard contract **disables the depositTransaction() function**, which prevents users from sending or forcing any transactions from L1 to L2, including token deposits. It is instead used for configuration and administration of the system.
      address:
-        "0x250D30c523104bf0a06825e7eAdE4Dc46EdfE40E"
+        "eth:0x250D30c523104bf0a06825e7eAdE4Dc46EdfE40E"
      values.$admin:
-        "0x19DbD16f0a8e706D817B7e3b7bcF72917Ebb8832"
+        "eth:0x19DbD16f0a8e706D817B7e3b7bcF72917Ebb8832"
      values.$implementation:
-        "0x9a6C2Dcc7e523f87716e17Ba36D10CCfFA0A60bb"
+        "eth:0x9a6C2Dcc7e523f87716e17Ba36D10CCfFA0A60bb"
      values.$pastUpgrades.0.2.0:
-        "0xe2F826324b2faf99E513D16D266c3F80aE87832B"
+        "eth:0xe2F826324b2faf99E513D16D266c3F80aE87832B"
      values.$pastUpgrades.1.2.0:
-        "0x9a6C2Dcc7e523f87716e17Ba36D10CCfFA0A60bb"
+        "eth:0x9a6C2Dcc7e523f87716e17Ba36D10CCfFA0A60bb"
      values.disputeGameFactory:
-        "0xe06278351d120288eDfCB963F934113Ca3C21AFe"
+        "eth:0xe06278351d120288eDfCB963F934113Ca3C21AFe"
      values.guardian:
-        "0x4e981bAe8E3cd06Ca911ffFE5504B2653ac1C38a"
+        "eth:0x4e981bAe8E3cd06Ca911ffFE5504B2653ac1C38a"
      values.l2Sender:
-        "0x000000000000000000000000000000000000dEaD"
+        "eth:0x000000000000000000000000000000000000dEaD"
      values.superchainConfig:
-        "0x2F439B95fa789C5d3a5C99cc70EB3ee83D08a811"
+        "eth:0x2F439B95fa789C5d3a5C99cc70EB3ee83D08a811"
      values.systemConfig:
-        "0xb6e1f8B589A14B79DDD3aD7F0589AB548c70C174"
+        "eth:0xb6e1f8B589A14B79DDD3aD7F0589AB548c70C174"
      implementationNames.0x250D30c523104bf0a06825e7eAdE4Dc46EdfE40E:
-        "Proxy"
      implementationNames.0x9a6C2Dcc7e523f87716e17Ba36D10CCfFA0A60bb:
-        "OptimismPortal2"
      implementationNames.eth:0x250D30c523104bf0a06825e7eAdE4Dc46EdfE40E:
+        "Proxy"
      implementationNames.eth:0x9a6C2Dcc7e523f87716e17Ba36D10CCfFA0A60bb:
+        "OptimismPortal2"
    }
```

```diff
    EOA  (0x254f44F45ac892730e511f143DEd3Cd920b075aF) {
    +++ description: None
      address:
-        "0x254f44F45ac892730e511f143DEd3Cd920b075aF"
+        "eth:0x254f44F45ac892730e511f143DEd3Cd920b075aF"
    }
```

```diff
    contract ProxyAdmin (0x263b251D67BB154DD6b8352539466ACE7948ED56) {
    +++ description: None
      address:
-        "0x263b251D67BB154DD6b8352539466ACE7948ED56"
+        "eth:0x263b251D67BB154DD6b8352539466ACE7948ED56"
      values.owner:
-        "0x9d851f8b8751c5FbC09b9E74E6e68E9950949052"
+        "eth:0x9d851f8b8751c5FbC09b9E74E6e68E9950949052"
      implementationNames.0x263b251D67BB154DD6b8352539466ACE7948ED56:
-        "ProxyAdmin"
      implementationNames.eth:0x263b251D67BB154DD6b8352539466ACE7948ED56:
+        "ProxyAdmin"
    }
```

```diff
    contract vbWBTC (0x2C24B57e2CCd1f273045Af6A5f632504C432374F) {
    +++ description: This token contract uses a standard 'vault bridge token' implementation created by Agglayer CDK. It keeps deposited assets in a vault and issues an IOU token (Vault Bridge WBTC) which can be deposited to Agglayer. The underlying asset is generating yield, which does not accrue to the vbWBTC-IOU but is sent to eth:0x67C912fF560951526BffDff66dFbD4DF8AE23756.
      address:
-        "0x2C24B57e2CCd1f273045Af6A5f632504C432374F"
+        "eth:0x2C24B57e2CCd1f273045Af6A5f632504C432374F"
      description:
-        "This token contract uses a standard 'vault bridge token' implementation created by Agglayer CDK. It keeps deposited assets in a vault and issues an IOU token (Vault Bridge WBTC) which can be deposited to Agglayer. The underlying asset is generating yield, which does not accrue to the vbWBTC-IOU but is sent to 0x67C912fF560951526BffDff66dFbD4DF8AE23756."
+        "This token contract uses a standard 'vault bridge token' implementation created by Agglayer CDK. It keeps deposited assets in a vault and issues an IOU token (Vault Bridge WBTC) which can be deposited to Agglayer. The underlying asset is generating yield, which does not accrue to the vbWBTC-IOU but is sent to eth:0x67C912fF560951526BffDff66dFbD4DF8AE23756."
      values.$admin:
-        "0x420693B32113a0e00Eb9f3315D5D5ec3b32C2d69"
+        "eth:0x420693B32113a0e00Eb9f3315D5D5ec3b32C2d69"
      values.$implementation:
-        "0xcC865B0324121b43728176024f58bdbB3afd6f29"
+        "eth:0xcC865B0324121b43728176024f58bdbB3afd6f29"
      values.$pastUpgrades.0.2.0:
-        "0xcC865B0324121b43728176024f58bdbB3afd6f29"
+        "eth:0xcC865B0324121b43728176024f58bdbB3afd6f29"
      values.accessControl.DEFAULT_ADMIN_ROLE.members.0:
-        "0x2De242e27386e224E5fbF110EA8406d5B70740ec"
+        "eth:0x2De242e27386e224E5fbF110EA8406d5B70740ec"
      values.accessControl.REBALANCER_ROLE.members.0:
-        "0x2De242e27386e224E5fbF110EA8406d5B70740ec"
+        "eth:0x2De242e27386e224E5fbF110EA8406d5B70740ec"
      values.accessControl.YIELD_COLLECTOR_ROLE.members.0:
-        "0x2De242e27386e224E5fbF110EA8406d5B70740ec"
+        "eth:0x2De242e27386e224E5fbF110EA8406d5B70740ec"
      values.accessControl.YIELD_COLLECTOR_ROLE.members.1:
-        "0xcB1e45481461aeF38E6B0a34F1444E9C5D647645"
+        "eth:0xcB1e45481461aeF38E6B0a34F1444E9C5D647645"
      values.accessControl.PAUSER_ROLE.members.0:
-        "0x2De242e27386e224E5fbF110EA8406d5B70740ec"
+        "eth:0x2De242e27386e224E5fbF110EA8406d5B70740ec"
      values.asset:
-        "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599"
+        "eth:0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599"
      values.eip712Domain.verifyingContract:
-        "0x2C24B57e2CCd1f273045Af6A5f632504C432374F"
+        "eth:0x2C24B57e2CCd1f273045Af6A5f632504C432374F"
      values.lxlyBridge:
-        "0x2a3DD3EB832aF982ec71669E178424b10Dca2EDe"
+        "eth:0x2a3DD3EB832aF982ec71669E178424b10Dca2EDe"
      values.migrationManager:
-        "0x417d01B64Ea30C4E163873f3a1f77b727c689e02"
+        "eth:0x417d01B64Ea30C4E163873f3a1f77b727c689e02"
      values.underlyingToken:
-        "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599"
+        "eth:0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599"
      implementationNames.0x2C24B57e2CCd1f273045Af6A5f632504C432374F:
-        "TransparentUpgradeableProxy"
      implementationNames.0xcC865B0324121b43728176024f58bdbB3afd6f29:
-        "GenericVaultBridgeToken"
      implementationNames.eth:0x2C24B57e2CCd1f273045Af6A5f632504C432374F:
+        "TransparentUpgradeableProxy"
      implementationNames.eth:0xcC865B0324121b43728176024f58bdbB3afd6f29:
+        "GenericVaultBridgeToken"
    }
```

```diff
    EOA  (0x2C2dc95F8C8060a7e3B354c1B9540881AEa1613C) {
    +++ description: None
      address:
-        "0x2C2dc95F8C8060a7e3B354c1B9540881AEa1613C"
+        "eth:0x2C2dc95F8C8060a7e3B354c1B9540881AEa1613C"
    }
```

```diff
    contract PermissionedDisputeGame (0x2d4B822F8B74AdE7fcD5F740967f4dFcD2fef5e4) {
    +++ description: Same as FaultDisputeGame, but only two permissioned addresses are designated as proposer and challenger.
      address:
-        "0x2d4B822F8B74AdE7fcD5F740967f4dFcD2fef5e4"
+        "eth:0x2d4B822F8B74AdE7fcD5F740967f4dFcD2fef5e4"
      values.anchorStateRegistry:
-        "0x79ecD8d8040496014bcD3bA16AdF3914b23f8Fd5"
+        "eth:0x79ecD8d8040496014bcD3bA16AdF3914b23f8Fd5"
      values.challenger:
-        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
+        "eth:0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      values.gameCreator:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.l2BlockNumberChallenger:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.proposer:
-        "0x4A6f5889409Bf4Bf3Bff0Fef585D7A29FdA64258"
+        "eth:0x4A6f5889409Bf4Bf3Bff0Fef585D7A29FdA64258"
      values.vm:
-        "0x5fE03a12C1236F9C22Cb6479778DDAa4bce6299C"
+        "eth:0x5fE03a12C1236F9C22Cb6479778DDAa4bce6299C"
      values.weth:
-        "0x74034597d29613CC8C0BDc8780e1d292A553Bd32"
+        "eth:0x74034597d29613CC8C0BDc8780e1d292A553Bd32"
      implementationNames.0x2d4B822F8B74AdE7fcD5F740967f4dFcD2fef5e4:
-        "PermissionedDisputeGame"
      implementationNames.eth:0x2d4B822F8B74AdE7fcD5F740967f4dFcD2fef5e4:
+        "PermissionedDisputeGame"
    }
```

```diff
    contract vbETH (0x2DC70fb75b88d2eB4715bc06E1595E6D97c34DFF) {
    +++ description: This token contract uses a standard 'vault bridge token' implementation created by Agglayer CDK. It keeps deposited assets in a vault and issues an IOU token (Vault Bridge ETH) which can be deposited to Agglayer. The underlying asset is generating yield, which does not accrue to the vbETH-IOU but is sent to eth:0x67C912fF560951526BffDff66dFbD4DF8AE23756.
      address:
-        "0x2DC70fb75b88d2eB4715bc06E1595E6D97c34DFF"
+        "eth:0x2DC70fb75b88d2eB4715bc06E1595E6D97c34DFF"
      description:
-        "This token contract uses a standard 'vault bridge token' implementation created by Agglayer CDK. It keeps deposited assets in a vault and issues an IOU token (Vault Bridge ETH) which can be deposited to Agglayer. The underlying asset is generating yield, which does not accrue to the vbETH-IOU but is sent to 0x67C912fF560951526BffDff66dFbD4DF8AE23756."
+        "This token contract uses a standard 'vault bridge token' implementation created by Agglayer CDK. It keeps deposited assets in a vault and issues an IOU token (Vault Bridge ETH) which can be deposited to Agglayer. The underlying asset is generating yield, which does not accrue to the vbETH-IOU but is sent to eth:0x67C912fF560951526BffDff66dFbD4DF8AE23756."
      values.$admin:
-        "0x14Be6579A41342ca6B402ec85E7be538e6Ade951"
+        "eth:0x14Be6579A41342ca6B402ec85E7be538e6Ade951"
      values.$implementation:
-        "0x81c16F89222C32806Daf01f5129937dFE19D525e"
+        "eth:0x81c16F89222C32806Daf01f5129937dFE19D525e"
      values.$pastUpgrades.0.2.0:
-        "0x81c16F89222C32806Daf01f5129937dFE19D525e"
+        "eth:0x81c16F89222C32806Daf01f5129937dFE19D525e"
      values.accessControl.DEFAULT_ADMIN_ROLE.members.0:
-        "0x2De242e27386e224E5fbF110EA8406d5B70740ec"
+        "eth:0x2De242e27386e224E5fbF110EA8406d5B70740ec"
      values.accessControl.REBALANCER_ROLE.members.0:
-        "0x2De242e27386e224E5fbF110EA8406d5B70740ec"
+        "eth:0x2De242e27386e224E5fbF110EA8406d5B70740ec"
      values.accessControl.YIELD_COLLECTOR_ROLE.members.0:
-        "0x2De242e27386e224E5fbF110EA8406d5B70740ec"
+        "eth:0x2De242e27386e224E5fbF110EA8406d5B70740ec"
      values.accessControl.YIELD_COLLECTOR_ROLE.members.1:
-        "0xcB1e45481461aeF38E6B0a34F1444E9C5D647645"
+        "eth:0xcB1e45481461aeF38E6B0a34F1444E9C5D647645"
      values.accessControl.PAUSER_ROLE.members.0:
-        "0x2De242e27386e224E5fbF110EA8406d5B70740ec"
+        "eth:0x2De242e27386e224E5fbF110EA8406d5B70740ec"
      values.asset:
-        "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
+        "eth:0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
      values.eip712Domain.verifyingContract:
-        "0x2DC70fb75b88d2eB4715bc06E1595E6D97c34DFF"
+        "eth:0x2DC70fb75b88d2eB4715bc06E1595E6D97c34DFF"
      values.lxlyBridge:
-        "0x2a3DD3EB832aF982ec71669E178424b10Dca2EDe"
+        "eth:0x2a3DD3EB832aF982ec71669E178424b10Dca2EDe"
      values.migrationManager:
-        "0x417d01B64Ea30C4E163873f3a1f77b727c689e02"
+        "eth:0x417d01B64Ea30C4E163873f3a1f77b727c689e02"
      values.underlyingToken:
-        "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
+        "eth:0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
      implementationNames.0x2DC70fb75b88d2eB4715bc06E1595E6D97c34DFF:
-        "TransparentUpgradeableProxy"
      implementationNames.0x81c16F89222C32806Daf01f5129937dFE19D525e:
-        "VbETH"
      implementationNames.eth:0x2DC70fb75b88d2eB4715bc06E1595E6D97c34DFF:
+        "TransparentUpgradeableProxy"
      implementationNames.eth:0x81c16F89222C32806Daf01f5129937dFE19D525e:
+        "VbETH"
    }
```

```diff
    contract Katana vaultBridge Multisig 1 (0x2De242e27386e224E5fbF110EA8406d5B70740ec) {
    +++ description: None
      address:
-        "0x2De242e27386e224E5fbF110EA8406d5B70740ec"
+        "eth:0x2De242e27386e224E5fbF110EA8406d5B70740ec"
      values.$implementation:
-        "0x41675C099F32341bf84BFc5382aF534df5C7461a"
+        "eth:0x41675C099F32341bf84BFc5382aF534df5C7461a"
      values.$members.0:
-        "0x4082A1D91A353b16e112FbE36b55d222bF417919"
+        "eth:0x4082A1D91A353b16e112FbE36b55d222bF417919"
      values.$members.1:
-        "0x9d851f8b8751c5FbC09b9E74E6e68E9950949052"
+        "eth:0x9d851f8b8751c5FbC09b9E74E6e68E9950949052"
      values.$members.2:
-        "0xd0673F989bc3BA9314d0AAF28BfC84e99B7898CC"
+        "eth:0xd0673F989bc3BA9314d0AAF28BfC84e99B7898CC"
      implementationNames.0x2De242e27386e224E5fbF110EA8406d5B70740ec:
-        "SafeProxy"
      implementationNames.0x41675C099F32341bf84BFc5382aF534df5C7461a:
-        "Safe"
      implementationNames.eth:0x2De242e27386e224E5fbF110EA8406d5B70740ec:
+        "SafeProxy"
      implementationNames.eth:0x41675C099F32341bf84BFc5382aF534df5C7461a:
+        "Safe"
    }
```

```diff
    contract SuperchainConfig (0x2F439B95fa789C5d3a5C99cc70EB3ee83D08a811) {
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      address:
-        "0x2F439B95fa789C5d3a5C99cc70EB3ee83D08a811"
+        "eth:0x2F439B95fa789C5d3a5C99cc70EB3ee83D08a811"
      values.$admin:
-        "0x6d0ff67fb427422AfF35EEa8596949B374b09a52"
+        "eth:0x6d0ff67fb427422AfF35EEa8596949B374b09a52"
      values.$implementation:
-        "0x838897A86Cb4F130D0eFC1203d7dA6D0db4bEd1A"
+        "eth:0x838897A86Cb4F130D0eFC1203d7dA6D0db4bEd1A"
      values.$pastUpgrades.0.2.0:
-        "0x838897A86Cb4F130D0eFC1203d7dA6D0db4bEd1A"
+        "eth:0x838897A86Cb4F130D0eFC1203d7dA6D0db4bEd1A"
      values.$pastUpgrades.1.2.0:
-        "0xd81f43eDBCAcb4c29a9bA38a13Ee5d79278270cC"
+        "eth:0xd81f43eDBCAcb4c29a9bA38a13Ee5d79278270cC"
      values.$pastUpgrades.2.2.0:
-        "0x838897A86Cb4F130D0eFC1203d7dA6D0db4bEd1A"
+        "eth:0x838897A86Cb4F130D0eFC1203d7dA6D0db4bEd1A"
      values.guardian:
-        "0x4e981bAe8E3cd06Ca911ffFE5504B2653ac1C38a"
+        "eth:0x4e981bAe8E3cd06Ca911ffFE5504B2653ac1C38a"
      implementationNames.0x2F439B95fa789C5d3a5C99cc70EB3ee83D08a811:
-        "Proxy"
      implementationNames.0x838897A86Cb4F130D0eFC1203d7dA6D0db4bEd1A:
-        "SuperchainConfig"
      implementationNames.eth:0x2F439B95fa789C5d3a5C99cc70EB3ee83D08a811:
+        "Proxy"
      implementationNames.eth:0x838897A86Cb4F130D0eFC1203d7dA6D0db4bEd1A:
+        "SuperchainConfig"
    }
```

```diff
    contract ProxyAdmin (0x377a9e5df2882DC1DF8A0bD162cbc640eA634010) {
    +++ description: None
      address:
-        "0x377a9e5df2882DC1DF8A0bD162cbc640eA634010"
+        "eth:0x377a9e5df2882DC1DF8A0bD162cbc640eA634010"
      values.owner:
-        "0x2De242e27386e224E5fbF110EA8406d5B70740ec"
+        "eth:0x2De242e27386e224E5fbF110EA8406d5B70740ec"
      implementationNames.0x377a9e5df2882DC1DF8A0bD162cbc640eA634010:
-        "ProxyAdmin"
      implementationNames.eth:0x377a9e5df2882DC1DF8A0bD162cbc640eA634010:
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
    EOA  (0x387Cde8598E1CBb297FDc5bAEbA5E5c5c2735344) {
    +++ description: None
      address:
-        "0x387Cde8598E1CBb297FDc5bAEbA5E5c5c2735344"
+        "eth:0x387Cde8598E1CBb297FDc5bAEbA5E5c5c2735344"
    }
```

```diff
    contract vbUSDS (0x3DD459dE96F9C28e3a343b831cbDC2B93c8C4855) {
    +++ description: This token contract uses a standard 'vault bridge token' implementation created by Agglayer CDK. It keeps deposited assets in a vault and issues an IOU token (Vault Bridge USDS) which can be deposited to Agglayer. The underlying asset is generating yield, which does not accrue to the vbUSDS-IOU but is sent to eth:0x67C912fF560951526BffDff66dFbD4DF8AE23756.
      address:
-        "0x3DD459dE96F9C28e3a343b831cbDC2B93c8C4855"
+        "eth:0x3DD459dE96F9C28e3a343b831cbDC2B93c8C4855"
      description:
-        "This token contract uses a standard 'vault bridge token' implementation created by Agglayer CDK. It keeps deposited assets in a vault and issues an IOU token (Vault Bridge USDS) which can be deposited to Agglayer. The underlying asset is generating yield, which does not accrue to the vbUSDS-IOU but is sent to 0x67C912fF560951526BffDff66dFbD4DF8AE23756."
+        "This token contract uses a standard 'vault bridge token' implementation created by Agglayer CDK. It keeps deposited assets in a vault and issues an IOU token (Vault Bridge USDS) which can be deposited to Agglayer. The underlying asset is generating yield, which does not accrue to the vbUSDS-IOU but is sent to eth:0x67C912fF560951526BffDff66dFbD4DF8AE23756."
      values.$admin:
-        "0xD1e389c046FB734D2a0c7C390312210c408ba832"
+        "eth:0xD1e389c046FB734D2a0c7C390312210c408ba832"
      values.$implementation:
-        "0xcC865B0324121b43728176024f58bdbB3afd6f29"
+        "eth:0xcC865B0324121b43728176024f58bdbB3afd6f29"
      values.$pastUpgrades.0.2.0:
-        "0xcC865B0324121b43728176024f58bdbB3afd6f29"
+        "eth:0xcC865B0324121b43728176024f58bdbB3afd6f29"
      values.accessControl.DEFAULT_ADMIN_ROLE.members.0:
-        "0xA8C31B2edd84c654d06d626383f4154D1E40C5Ff"
+        "eth:0xA8C31B2edd84c654d06d626383f4154D1E40C5Ff"
      values.accessControl.REBALANCER_ROLE.members.0:
-        "0xA8C31B2edd84c654d06d626383f4154D1E40C5Ff"
+        "eth:0xA8C31B2edd84c654d06d626383f4154D1E40C5Ff"
      values.accessControl.YIELD_COLLECTOR_ROLE.members.0:
-        "0xA8C31B2edd84c654d06d626383f4154D1E40C5Ff"
+        "eth:0xA8C31B2edd84c654d06d626383f4154D1E40C5Ff"
      values.accessControl.YIELD_COLLECTOR_ROLE.members.1:
-        "0xcB1e45481461aeF38E6B0a34F1444E9C5D647645"
+        "eth:0xcB1e45481461aeF38E6B0a34F1444E9C5D647645"
      values.accessControl.PAUSER_ROLE.members.0:
-        "0xA8C31B2edd84c654d06d626383f4154D1E40C5Ff"
+        "eth:0xA8C31B2edd84c654d06d626383f4154D1E40C5Ff"
      values.asset:
-        "0xdC035D45d973E3EC169d2276DDab16f1e407384F"
+        "eth:0xdC035D45d973E3EC169d2276DDab16f1e407384F"
      values.eip712Domain.verifyingContract:
-        "0x3DD459dE96F9C28e3a343b831cbDC2B93c8C4855"
+        "eth:0x3DD459dE96F9C28e3a343b831cbDC2B93c8C4855"
      values.lxlyBridge:
-        "0x2a3DD3EB832aF982ec71669E178424b10Dca2EDe"
+        "eth:0x2a3DD3EB832aF982ec71669E178424b10Dca2EDe"
      values.migrationManager:
-        "0x417d01B64Ea30C4E163873f3a1f77b727c689e02"
+        "eth:0x417d01B64Ea30C4E163873f3a1f77b727c689e02"
      values.underlyingToken:
-        "0xdC035D45d973E3EC169d2276DDab16f1e407384F"
+        "eth:0xdC035D45d973E3EC169d2276DDab16f1e407384F"
      implementationNames.0x3DD459dE96F9C28e3a343b831cbDC2B93c8C4855:
-        "TransparentUpgradeableProxy"
      implementationNames.0xcC865B0324121b43728176024f58bdbB3afd6f29:
-        "GenericVaultBridgeToken"
      implementationNames.eth:0x3DD459dE96F9C28e3a343b831cbDC2B93c8C4855:
+        "TransparentUpgradeableProxy"
      implementationNames.eth:0xcC865B0324121b43728176024f58bdbB3afd6f29:
+        "GenericVaultBridgeToken"
    }
```

```diff
    EOA  (0x4082A1D91A353b16e112FbE36b55d222bF417919) {
    +++ description: None
      address:
-        "0x4082A1D91A353b16e112FbE36b55d222bF417919"
+        "eth:0x4082A1D91A353b16e112FbE36b55d222bF417919"
    }
```

```diff
    contract MigrationManager (0x417d01B64Ea30C4E163873f3a1f77b727c689e02) {
    +++ description: Helper contract for the vaultBridge tokens on Layer 2. If any vbTokens are minted 'natively' on Layer 2, this contract can receive the underlying assets and lock them in the Layer 1 vaults.
      address:
-        "0x417d01B64Ea30C4E163873f3a1f77b727c689e02"
+        "eth:0x417d01B64Ea30C4E163873f3a1f77b727c689e02"
      values.$admin:
-        "0x263b251D67BB154DD6b8352539466ACE7948ED56"
+        "eth:0x263b251D67BB154DD6b8352539466ACE7948ED56"
      values.$implementation:
-        "0xC6dD6399eAE419A0a33A8dc307f4c1dB26D30e45"
+        "eth:0xC6dD6399eAE419A0a33A8dc307f4c1dB26D30e45"
      values.$pastUpgrades.0.2.0:
-        "0xC6dD6399eAE419A0a33A8dc307f4c1dB26D30e45"
+        "eth:0xC6dD6399eAE419A0a33A8dc307f4c1dB26D30e45"
      values.accessControl.DEFAULT_ADMIN_ROLE.members.0:
-        "0x9d851f8b8751c5FbC09b9E74E6e68E9950949052"
+        "eth:0x9d851f8b8751c5FbC09b9E74E6e68E9950949052"
      values.accessControl.PAUSER_ROLE.members.0:
-        "0x9d851f8b8751c5FbC09b9E74E6e68E9950949052"
+        "eth:0x9d851f8b8751c5FbC09b9E74E6e68E9950949052"
      values.lxlyBridge:
-        "0x2a3DD3EB832aF982ec71669E178424b10Dca2EDe"
+        "eth:0x2a3DD3EB832aF982ec71669E178424b10Dca2EDe"
      implementationNames.0x417d01B64Ea30C4E163873f3a1f77b727c689e02:
-        "TransparentUpgradeableProxy"
      implementationNames.0xC6dD6399eAE419A0a33A8dc307f4c1dB26D30e45:
-        "MigrationManager"
      implementationNames.eth:0x417d01B64Ea30C4E163873f3a1f77b727c689e02:
+        "TransparentUpgradeableProxy"
      implementationNames.eth:0xC6dD6399eAE419A0a33A8dc307f4c1dB26D30e45:
+        "MigrationManager"
    }
```

```diff
    contract ProxyAdmin (0x420693B32113a0e00Eb9f3315D5D5ec3b32C2d69) {
    +++ description: None
      address:
-        "0x420693B32113a0e00Eb9f3315D5D5ec3b32C2d69"
+        "eth:0x420693B32113a0e00Eb9f3315D5D5ec3b32C2d69"
      values.owner:
-        "0x2De242e27386e224E5fbF110EA8406d5B70740ec"
+        "eth:0x2De242e27386e224E5fbF110EA8406d5B70740ec"
      implementationNames.0x420693B32113a0e00Eb9f3315D5D5ec3b32C2d69:
-        "ProxyAdmin"
      implementationNames.eth:0x420693B32113a0e00Eb9f3315D5D5ec3b32C2d69:
+        "ProxyAdmin"
    }
```

```diff
    EOA  (0x450A3A6AE85904cb4Aa0809Fb41E53B687a28397) {
    +++ description: None
      address:
-        "0x450A3A6AE85904cb4Aa0809Fb41E53B687a28397"
+        "eth:0x450A3A6AE85904cb4Aa0809Fb41E53B687a28397"
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
    EOA  (0x4A6f5889409Bf4Bf3Bff0Fef585D7A29FdA64258) {
    +++ description: None
      address:
-        "0x4A6f5889409Bf4Bf3Bff0Fef585D7A29FdA64258"
+        "eth:0x4A6f5889409Bf4Bf3Bff0Fef585D7A29FdA64258"
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
    contract Katana Foundation Engineering/Security Multisig (0x4e981bAe8E3cd06Ca911ffFE5504B2653ac1C38a) {
    +++ description: None
      address:
-        "0x4e981bAe8E3cd06Ca911ffFE5504B2653ac1C38a"
+        "eth:0x4e981bAe8E3cd06Ca911ffFE5504B2653ac1C38a"
      values.$implementation:
-        "0x3E5c63644E683549055b9Be8653de26E0B4CD36E"
+        "eth:0x3E5c63644E683549055b9Be8653de26E0B4CD36E"
      values.$members.0:
-        "0x516eEcfb38aA308c5f1878497108c7d054fd46B7"
+        "eth:0x516eEcfb38aA308c5f1878497108c7d054fd46B7"
      values.$members.1:
-        "0xEad77b01ea770839F7f576Cd1516Ff6A298d9dB2"
+        "eth:0xEad77b01ea770839F7f576Cd1516Ff6A298d9dB2"
      values.$members.2:
-        "0x54c401eD03D086fE13221E5422165f3b024265d9"
+        "eth:0x54c401eD03D086fE13221E5422165f3b024265d9"
      values.$members.3:
-        "0xAb3506507449bF1880f3337825efd19ac89E235E"
+        "eth:0xAb3506507449bF1880f3337825efd19ac89E235E"
      values.$members.4:
-        "0xcAB31b6A7b4d2eCd562A09e2BfA46535a18862f9"
+        "eth:0xcAB31b6A7b4d2eCd562A09e2BfA46535a18862f9"
      implementationNames.0x4e981bAe8E3cd06Ca911ffFE5504B2653ac1C38a:
-        "GnosisSafeProxy"
      implementationNames.0x3E5c63644E683549055b9Be8653de26E0B4CD36E:
-        "GnosisSafeL2"
      implementationNames.eth:0x4e981bAe8E3cd06Ca911ffFE5504B2653ac1C38a:
+        "GnosisSafeProxy"
      implementationNames.eth:0x3E5c63644E683549055b9Be8653de26E0B4CD36E:
+        "GnosisSafeL2"
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
    contract vbUSDC (0x53E82ABbb12638F09d9e624578ccB666217a765e) {
    +++ description: This token contract uses a standard 'vault bridge token' implementation created by Agglayer CDK. It keeps deposited assets in a vault and issues an IOU token (Vault Bridge USDC) which can be deposited to Agglayer. The underlying asset is generating yield, which does not accrue to the vbUSDC-IOU but is sent to eth:0x67C912fF560951526BffDff66dFbD4DF8AE23756.
      address:
-        "0x53E82ABbb12638F09d9e624578ccB666217a765e"
+        "eth:0x53E82ABbb12638F09d9e624578ccB666217a765e"
      description:
-        "This token contract uses a standard 'vault bridge token' implementation created by Agglayer CDK. It keeps deposited assets in a vault and issues an IOU token (Vault Bridge USDC) which can be deposited to Agglayer. The underlying asset is generating yield, which does not accrue to the vbUSDC-IOU but is sent to 0x67C912fF560951526BffDff66dFbD4DF8AE23756."
+        "This token contract uses a standard 'vault bridge token' implementation created by Agglayer CDK. It keeps deposited assets in a vault and issues an IOU token (Vault Bridge USDC) which can be deposited to Agglayer. The underlying asset is generating yield, which does not accrue to the vbUSDC-IOU but is sent to eth:0x67C912fF560951526BffDff66dFbD4DF8AE23756."
      values.$admin:
-        "0x8970650CF3f1E57cA804C65B4DBcFf698789FE30"
+        "eth:0x8970650CF3f1E57cA804C65B4DBcFf698789FE30"
      values.$implementation:
-        "0xcC865B0324121b43728176024f58bdbB3afd6f29"
+        "eth:0xcC865B0324121b43728176024f58bdbB3afd6f29"
      values.$pastUpgrades.0.2.0:
-        "0xcC865B0324121b43728176024f58bdbB3afd6f29"
+        "eth:0xcC865B0324121b43728176024f58bdbB3afd6f29"
      values.accessControl.DEFAULT_ADMIN_ROLE.members.0:
-        "0xf4F2f5F6bAdBE05433C4604320ecC56BbECBC04E"
+        "eth:0xf4F2f5F6bAdBE05433C4604320ecC56BbECBC04E"
      values.accessControl.REBALANCER_ROLE.members.0:
-        "0xf4F2f5F6bAdBE05433C4604320ecC56BbECBC04E"
+        "eth:0xf4F2f5F6bAdBE05433C4604320ecC56BbECBC04E"
      values.accessControl.YIELD_COLLECTOR_ROLE.members.0:
-        "0xf4F2f5F6bAdBE05433C4604320ecC56BbECBC04E"
+        "eth:0xf4F2f5F6bAdBE05433C4604320ecC56BbECBC04E"
      values.accessControl.YIELD_COLLECTOR_ROLE.members.1:
-        "0xcB1e45481461aeF38E6B0a34F1444E9C5D647645"
+        "eth:0xcB1e45481461aeF38E6B0a34F1444E9C5D647645"
      values.accessControl.PAUSER_ROLE.members.0:
-        "0xf4F2f5F6bAdBE05433C4604320ecC56BbECBC04E"
+        "eth:0xf4F2f5F6bAdBE05433C4604320ecC56BbECBC04E"
      values.asset:
-        "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"
+        "eth:0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"
      values.eip712Domain.verifyingContract:
-        "0x53E82ABbb12638F09d9e624578ccB666217a765e"
+        "eth:0x53E82ABbb12638F09d9e624578ccB666217a765e"
      values.lxlyBridge:
-        "0x2a3DD3EB832aF982ec71669E178424b10Dca2EDe"
+        "eth:0x2a3DD3EB832aF982ec71669E178424b10Dca2EDe"
      values.migrationManager:
-        "0x417d01B64Ea30C4E163873f3a1f77b727c689e02"
+        "eth:0x417d01B64Ea30C4E163873f3a1f77b727c689e02"
      values.underlyingToken:
-        "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"
+        "eth:0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"
      implementationNames.0x53E82ABbb12638F09d9e624578ccB666217a765e:
-        "TransparentUpgradeableProxy"
      implementationNames.0xcC865B0324121b43728176024f58bdbB3afd6f29:
-        "GenericVaultBridgeToken"
      implementationNames.eth:0x53E82ABbb12638F09d9e624578ccB666217a765e:
+        "TransparentUpgradeableProxy"
      implementationNames.eth:0xcC865B0324121b43728176024f58bdbB3afd6f29:
+        "GenericVaultBridgeToken"
    }
```

```diff
    EOA  (0x54DFA4B635E7eB98515fEBA81d360A3871739277) {
    +++ description: None
      address:
-        "0x54DFA4B635E7eB98515fEBA81d360A3871739277"
+        "eth:0x54DFA4B635E7eB98515fEBA81d360A3871739277"
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
    contract Katana yieldRecipient Mulsitig (0x67C912fF560951526BffDff66dFbD4DF8AE23756) {
    +++ description: None
      address:
-        "0x67C912fF560951526BffDff66dFbD4DF8AE23756"
+        "eth:0x67C912fF560951526BffDff66dFbD4DF8AE23756"
      values.$implementation:
-        "0x41675C099F32341bf84BFc5382aF534df5C7461a"
+        "eth:0x41675C099F32341bf84BFc5382aF534df5C7461a"
      values.$members.0:
-        "0x0A4857fD89ABfB7536a6D0Bd4400EF769E84Ec8b"
+        "eth:0x0A4857fD89ABfB7536a6D0Bd4400EF769E84Ec8b"
      values.$members.1:
-        "0x54DFA4B635E7eB98515fEBA81d360A3871739277"
+        "eth:0x54DFA4B635E7eB98515fEBA81d360A3871739277"
      values.$members.2:
-        "0xb3dA4c1Ba8De9E04f22B1554a070189F518FDCac"
+        "eth:0xb3dA4c1Ba8De9E04f22B1554a070189F518FDCac"
      values.$members.3:
-        "0xa1a4C71024a0CAD6a1cEf85561f1B9a34E00ff62"
+        "eth:0xa1a4C71024a0CAD6a1cEf85561f1B9a34E00ff62"
      values.$members.4:
-        "0x227D9Ea843910Edd305c42e7bB9Ce6D9f369238c"
+        "eth:0x227D9Ea843910Edd305c42e7bB9Ce6D9f369238c"
      implementationNames.0x67C912fF560951526BffDff66dFbD4DF8AE23756:
-        "SafeProxy"
      implementationNames.0x41675C099F32341bf84BFc5382aF534df5C7461a:
-        "Safe"
      implementationNames.eth:0x67C912fF560951526BffDff66dFbD4DF8AE23756:
+        "SafeProxy"
      implementationNames.eth:0x41675C099F32341bf84BFc5382aF534df5C7461a:
+        "Safe"
    }
```

```diff
    contract ProxyAdmin (0x6d0ff67fb427422AfF35EEa8596949B374b09a52) {
    +++ description: None
      address:
-        "0x6d0ff67fb427422AfF35EEa8596949B374b09a52"
+        "eth:0x6d0ff67fb427422AfF35EEa8596949B374b09a52"
      values.addressManager:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.owner:
-        "0x4e981bAe8E3cd06Ca911ffFE5504B2653ac1C38a"
+        "eth:0x4e981bAe8E3cd06Ca911ffFE5504B2653ac1C38a"
      implementationNames.0x6d0ff67fb427422AfF35EEa8596949B374b09a52:
-        "ProxyAdmin"
      implementationNames.eth:0x6d0ff67fb427422AfF35EEa8596949B374b09a52:
+        "ProxyAdmin"
    }
```

```diff
    contract vbUSDT (0x6d4f9f9f8f0155509ecd6Ac6c544fF27999845CC) {
    +++ description: This token contract uses a standard 'vault bridge token' implementation created by Agglayer CDK. It keeps deposited assets in a vault and issues an IOU token (Vault Bridge USDT) which can be deposited to Agglayer. The underlying asset is generating yield, which does not accrue to the vbUSDT-IOU but is sent to eth:0x67C912fF560951526BffDff66dFbD4DF8AE23756.
      address:
-        "0x6d4f9f9f8f0155509ecd6Ac6c544fF27999845CC"
+        "eth:0x6d4f9f9f8f0155509ecd6Ac6c544fF27999845CC"
      description:
-        "This token contract uses a standard 'vault bridge token' implementation created by Agglayer CDK. It keeps deposited assets in a vault and issues an IOU token (Vault Bridge USDT) which can be deposited to Agglayer. The underlying asset is generating yield, which does not accrue to the vbUSDT-IOU but is sent to 0x67C912fF560951526BffDff66dFbD4DF8AE23756."
+        "This token contract uses a standard 'vault bridge token' implementation created by Agglayer CDK. It keeps deposited assets in a vault and issues an IOU token (Vault Bridge USDT) which can be deposited to Agglayer. The underlying asset is generating yield, which does not accrue to the vbUSDT-IOU but is sent to eth:0x67C912fF560951526BffDff66dFbD4DF8AE23756."
      values.$admin:
-        "0x377a9e5df2882DC1DF8A0bD162cbc640eA634010"
+        "eth:0x377a9e5df2882DC1DF8A0bD162cbc640eA634010"
      values.$implementation:
-        "0xcC865B0324121b43728176024f58bdbB3afd6f29"
+        "eth:0xcC865B0324121b43728176024f58bdbB3afd6f29"
      values.$pastUpgrades.0.2.0:
-        "0xcC865B0324121b43728176024f58bdbB3afd6f29"
+        "eth:0xcC865B0324121b43728176024f58bdbB3afd6f29"
      values.accessControl.DEFAULT_ADMIN_ROLE.members.0:
-        "0x2De242e27386e224E5fbF110EA8406d5B70740ec"
+        "eth:0x2De242e27386e224E5fbF110EA8406d5B70740ec"
      values.accessControl.REBALANCER_ROLE.members.0:
-        "0x2De242e27386e224E5fbF110EA8406d5B70740ec"
+        "eth:0x2De242e27386e224E5fbF110EA8406d5B70740ec"
      values.accessControl.YIELD_COLLECTOR_ROLE.members.0:
-        "0x2De242e27386e224E5fbF110EA8406d5B70740ec"
+        "eth:0x2De242e27386e224E5fbF110EA8406d5B70740ec"
      values.accessControl.YIELD_COLLECTOR_ROLE.members.1:
-        "0xcB1e45481461aeF38E6B0a34F1444E9C5D647645"
+        "eth:0xcB1e45481461aeF38E6B0a34F1444E9C5D647645"
      values.accessControl.PAUSER_ROLE.members.0:
-        "0x2De242e27386e224E5fbF110EA8406d5B70740ec"
+        "eth:0x2De242e27386e224E5fbF110EA8406d5B70740ec"
      values.asset:
-        "0xdAC17F958D2ee523a2206206994597C13D831ec7"
+        "eth:0xdAC17F958D2ee523a2206206994597C13D831ec7"
      values.eip712Domain.verifyingContract:
-        "0x6d4f9f9f8f0155509ecd6Ac6c544fF27999845CC"
+        "eth:0x6d4f9f9f8f0155509ecd6Ac6c544fF27999845CC"
      values.lxlyBridge:
-        "0x2a3DD3EB832aF982ec71669E178424b10Dca2EDe"
+        "eth:0x2a3DD3EB832aF982ec71669E178424b10Dca2EDe"
      values.migrationManager:
-        "0x417d01B64Ea30C4E163873f3a1f77b727c689e02"
+        "eth:0x417d01B64Ea30C4E163873f3a1f77b727c689e02"
      values.underlyingToken:
-        "0xdAC17F958D2ee523a2206206994597C13D831ec7"
+        "eth:0xdAC17F958D2ee523a2206206994597C13D831ec7"
      implementationNames.0x6d4f9f9f8f0155509ecd6Ac6c544fF27999845CC:
-        "TransparentUpgradeableProxy"
      implementationNames.0xcC865B0324121b43728176024f58bdbB3afd6f29:
-        "GenericVaultBridgeToken"
      implementationNames.eth:0x6d4f9f9f8f0155509ecd6Ac6c544fF27999845CC:
+        "TransparentUpgradeableProxy"
      implementationNames.eth:0xcC865B0324121b43728176024f58bdbB3afd6f29:
+        "GenericVaultBridgeToken"
    }
```

```diff
    contract DelayedWETH (0x74034597d29613CC8C0BDc8780e1d292A553Bd32) {
    +++ description: Contract designed to hold the bonded ETH for each game. It is designed as a wrapper around WETH to allow an owner to function as a backstop if a game would incorrectly distribute funds.
      address:
-        "0x74034597d29613CC8C0BDc8780e1d292A553Bd32"
+        "eth:0x74034597d29613CC8C0BDc8780e1d292A553Bd32"
      values.$admin:
-        "0x19DbD16f0a8e706D817B7e3b7bcF72917Ebb8832"
+        "eth:0x19DbD16f0a8e706D817B7e3b7bcF72917Ebb8832"
      values.$implementation:
-        "0x71e966Ae981d1ce531a7b6d23DC0f27B38409087"
+        "eth:0x71e966Ae981d1ce531a7b6d23DC0f27B38409087"
      values.$pastUpgrades.0.2.0:
-        "0x71e966Ae981d1ce531a7b6d23DC0f27B38409087"
+        "eth:0x71e966Ae981d1ce531a7b6d23DC0f27B38409087"
      values.config:
-        "0x2F439B95fa789C5d3a5C99cc70EB3ee83D08a811"
+        "eth:0x2F439B95fa789C5d3a5C99cc70EB3ee83D08a811"
      values.owner:
-        "0x4e981bAe8E3cd06Ca911ffFE5504B2653ac1C38a"
+        "eth:0x4e981bAe8E3cd06Ca911ffFE5504B2653ac1C38a"
      implementationNames.0x74034597d29613CC8C0BDc8780e1d292A553Bd32:
-        "Proxy"
      implementationNames.0x71e966Ae981d1ce531a7b6d23DC0f27B38409087:
-        "DelayedWETH"
      implementationNames.eth:0x74034597d29613CC8C0BDc8780e1d292A553Bd32:
+        "Proxy"
      implementationNames.eth:0x71e966Ae981d1ce531a7b6d23DC0f27B38409087:
+        "DelayedWETH"
    }
```

```diff
    EOA  (0x787aba336583f4A1D4f8cBBFDFFD49f3a38De665) {
    +++ description: None
      address:
-        "0x787aba336583f4A1D4f8cBBFDFFD49f3a38De665"
+        "eth:0x787aba336583f4A1D4f8cBBFDFFD49f3a38De665"
    }
```

```diff
    contract AnchorStateRegistry (0x79ecD8d8040496014bcD3bA16AdF3914b23f8Fd5) {
    +++ description: Contains the latest confirmed state root that can be used as a starting point in a dispute game.
      address:
-        "0x79ecD8d8040496014bcD3bA16AdF3914b23f8Fd5"
+        "eth:0x79ecD8d8040496014bcD3bA16AdF3914b23f8Fd5"
      values.$admin:
-        "0x19DbD16f0a8e706D817B7e3b7bcF72917Ebb8832"
+        "eth:0x19DbD16f0a8e706D817B7e3b7bcF72917Ebb8832"
      values.$implementation:
-        "0x393d0b46A30226Fa60AB3BD7D20e9C7890344A79"
+        "eth:0x393d0b46A30226Fa60AB3BD7D20e9C7890344A79"
      values.$pastUpgrades.0.2.0:
-        "0x393d0b46A30226Fa60AB3BD7D20e9C7890344A79"
+        "eth:0x393d0b46A30226Fa60AB3BD7D20e9C7890344A79"
      values.disputeGameFactory:
-        "0xe06278351d120288eDfCB963F934113Ca3C21AFe"
+        "eth:0xe06278351d120288eDfCB963F934113Ca3C21AFe"
      values.superchainConfig:
-        "0x2F439B95fa789C5d3a5C99cc70EB3ee83D08a811"
+        "eth:0x2F439B95fa789C5d3a5C99cc70EB3ee83D08a811"
      implementationNames.0x79ecD8d8040496014bcD3bA16AdF3914b23f8Fd5:
-        "Proxy"
      implementationNames.0x393d0b46A30226Fa60AB3BD7D20e9C7890344A79:
-        "AnchorStateRegistry"
      implementationNames.eth:0x79ecD8d8040496014bcD3bA16AdF3914b23f8Fd5:
+        "Proxy"
      implementationNames.eth:0x393d0b46A30226Fa60AB3BD7D20e9C7890344A79:
+        "AnchorStateRegistry"
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
    contract Katana Steakhouse Financial / Morpho Multisig (0x827e86072B06674a077f592A531dcE4590aDeCdB) {
    +++ description: None
      address:
-        "0x827e86072B06674a077f592A531dcE4590aDeCdB"
+        "eth:0x827e86072B06674a077f592A531dcE4590aDeCdB"
      values.$implementation:
-        "0x41675C099F32341bf84BFc5382aF534df5C7461a"
+        "eth:0x41675C099F32341bf84BFc5382aF534df5C7461a"
      values.$members.0:
-        "0x0D61C8b6CA9669A36F351De3AE335e9689dd9C5b"
+        "eth:0x0D61C8b6CA9669A36F351De3AE335e9689dd9C5b"
      values.$members.1:
-        "0xcC771952fdE840E30C6802734e5ad20479c2959f"
+        "eth:0xcC771952fdE840E30C6802734e5ad20479c2959f"
      values.$members.2:
-        "0x387Cde8598E1CBb297FDc5bAEbA5E5c5c2735344"
+        "eth:0x387Cde8598E1CBb297FDc5bAEbA5E5c5c2735344"
      values.$members.3:
-        "0xE3fCEE6B6cd564E073346f71394f60eC9aDf5120"
+        "eth:0xE3fCEE6B6cd564E073346f71394f60eC9aDf5120"
      implementationNames.0x827e86072B06674a077f592A531dcE4590aDeCdB:
-        "SafeProxy"
      implementationNames.0x41675C099F32341bf84BFc5382aF534df5C7461a:
-        "Safe"
      implementationNames.eth:0x827e86072B06674a077f592A531dcE4590aDeCdB:
+        "SafeProxy"
      implementationNames.eth:0x41675C099F32341bf84BFc5382aF534df5C7461a:
+        "Safe"
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
    contract ProxyAdmin (0x8970650CF3f1E57cA804C65B4DBcFf698789FE30) {
    +++ description: None
      address:
-        "0x8970650CF3f1E57cA804C65B4DBcFf698789FE30"
+        "eth:0x8970650CF3f1E57cA804C65B4DBcFf698789FE30"
      values.owner:
-        "0xf4F2f5F6bAdBE05433C4604320ecC56BbECBC04E"
+        "eth:0xf4F2f5F6bAdBE05433C4604320ecC56BbECBC04E"
      implementationNames.0x8970650CF3f1E57cA804C65B4DBcFf698789FE30:
-        "ProxyAdmin"
      implementationNames.eth:0x8970650CF3f1E57cA804C65B4DBcFf698789FE30:
+        "ProxyAdmin"
    }
```

```diff
    contract L1StandardBridge (0x98906C3f90A06B5484DD67bf32938815d2993dBC) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      address:
-        "0x98906C3f90A06B5484DD67bf32938815d2993dBC"
+        "eth:0x98906C3f90A06B5484DD67bf32938815d2993dBC"
      values.$admin:
-        "0x19DbD16f0a8e706D817B7e3b7bcF72917Ebb8832"
+        "eth:0x19DbD16f0a8e706D817B7e3b7bcF72917Ebb8832"
      values.$implementation:
-        "0x64B5a5Ed26DCb17370Ff4d33a8D503f0fbD06CfF"
+        "eth:0x64B5a5Ed26DCb17370Ff4d33a8D503f0fbD06CfF"
      values.l2TokenBridge:
-        "0x4200000000000000000000000000000000000010"
+        "eth:0x4200000000000000000000000000000000000010"
      values.messenger:
-        "0x2008A6Ba8CAF85AaFAe7880664Dfe681D533ac2E"
+        "eth:0x2008A6Ba8CAF85AaFAe7880664Dfe681D533ac2E"
      values.MESSENGER:
-        "0x2008A6Ba8CAF85AaFAe7880664Dfe681D533ac2E"
+        "eth:0x2008A6Ba8CAF85AaFAe7880664Dfe681D533ac2E"
      values.OTHER_BRIDGE:
-        "0x4200000000000000000000000000000000000010"
+        "eth:0x4200000000000000000000000000000000000010"
      values.otherBridge:
-        "0x4200000000000000000000000000000000000010"
+        "eth:0x4200000000000000000000000000000000000010"
      values.superchainConfig:
-        "0x2F439B95fa789C5d3a5C99cc70EB3ee83D08a811"
+        "eth:0x2F439B95fa789C5d3a5C99cc70EB3ee83D08a811"
      implementationNames.0x98906C3f90A06B5484DD67bf32938815d2993dBC:
-        "L1ChugSplashProxy"
      implementationNames.0x64B5a5Ed26DCb17370Ff4d33a8D503f0fbD06CfF:
-        "L1StandardBridge"
      implementationNames.eth:0x98906C3f90A06B5484DD67bf32938815d2993dBC:
+        "L1ChugSplashProxy"
      implementationNames.eth:0x64B5a5Ed26DCb17370Ff4d33a8D503f0fbD06CfF:
+        "L1StandardBridge"
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
    contract Polygon Labs Engineering/Security Multisig (0x9d851f8b8751c5FbC09b9E74E6e68E9950949052) {
    +++ description: None
      address:
-        "0x9d851f8b8751c5FbC09b9E74E6e68E9950949052"
+        "eth:0x9d851f8b8751c5FbC09b9E74E6e68E9950949052"
      values.$implementation:
-        "0x41675C099F32341bf84BFc5382aF534df5C7461a"
+        "eth:0x41675C099F32341bf84BFc5382aF534df5C7461a"
      values.$members.0:
-        "0xeD44D1CFfB91e163CB7126bdEeA83959f175dB37"
+        "eth:0xeD44D1CFfB91e163CB7126bdEeA83959f175dB37"
      values.$members.1:
-        "0xffbfc0c8331C5fc912DDA3C6D4A86eEB80203238"
+        "eth:0xffbfc0c8331C5fc912DDA3C6D4A86eEB80203238"
      values.$members.2:
-        "0xdFEd8373695a7b3DaF268CF91e71f6a7024A56Da"
+        "eth:0xdFEd8373695a7b3DaF268CF91e71f6a7024A56Da"
      values.$members.3:
-        "0xED7cC82235A7757702475c8f77c7830c095FB5a2"
+        "eth:0xED7cC82235A7757702475c8f77c7830c095FB5a2"
      values.$members.4:
-        "0x21618593F7147235aC8D511d68A547C935F9d417"
+        "eth:0x21618593F7147235aC8D511d68A547C935F9d417"
      implementationNames.0x9d851f8b8751c5FbC09b9E74E6e68E9950949052:
-        "SafeProxy"
      implementationNames.0x41675C099F32341bf84BFc5382aF534df5C7461a:
-        "Safe"
      implementationNames.eth:0x9d851f8b8751c5FbC09b9E74E6e68E9950949052:
+        "SafeProxy"
      implementationNames.eth:0x41675C099F32341bf84BFc5382aF534df5C7461a:
+        "Safe"
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
    EOA  (0xa1a4C71024a0CAD6a1cEf85561f1B9a34E00ff62) {
    +++ description: None
      address:
-        "0xa1a4C71024a0CAD6a1cEf85561f1B9a34E00ff62"
+        "eth:0xa1a4C71024a0CAD6a1cEf85561f1B9a34E00ff62"
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
    contract OptimismMintableERC20Factory (0xA84C37cD0b9bA1B43276C11976DBE9d1344C7f4E) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintableERC20 as this chain's representation of a token on the host chain, or vice-versa.
      address:
-        "0xA84C37cD0b9bA1B43276C11976DBE9d1344C7f4E"
+        "eth:0xA84C37cD0b9bA1B43276C11976DBE9d1344C7f4E"
      values.$admin:
-        "0x19DbD16f0a8e706D817B7e3b7bcF72917Ebb8832"
+        "eth:0x19DbD16f0a8e706D817B7e3b7bcF72917Ebb8832"
      values.$implementation:
-        "0xE01efbeb1089D1d1dB9c6c8b135C934C0734c846"
+        "eth:0xE01efbeb1089D1d1dB9c6c8b135C934C0734c846"
      values.$pastUpgrades.0.2.0:
-        "0xE01efbeb1089D1d1dB9c6c8b135C934C0734c846"
+        "eth:0xE01efbeb1089D1d1dB9c6c8b135C934C0734c846"
      values.bridge:
-        "0x98906C3f90A06B5484DD67bf32938815d2993dBC"
+        "eth:0x98906C3f90A06B5484DD67bf32938815d2993dBC"
      values.BRIDGE:
-        "0x98906C3f90A06B5484DD67bf32938815d2993dBC"
+        "eth:0x98906C3f90A06B5484DD67bf32938815d2993dBC"
      implementationNames.0xA84C37cD0b9bA1B43276C11976DBE9d1344C7f4E:
-        "Proxy"
      implementationNames.0xE01efbeb1089D1d1dB9c6c8b135C934C0734c846:
-        "OptimismMintableERC20Factory"
      implementationNames.eth:0xA84C37cD0b9bA1B43276C11976DBE9d1344C7f4E:
+        "Proxy"
      implementationNames.eth:0xE01efbeb1089D1d1dB9c6c8b135C934C0734c846:
+        "OptimismMintableERC20Factory"
    }
```

```diff
    contract Katana vaultBridge Multisig 2 (0xA8C31B2edd84c654d06d626383f4154D1E40C5Ff) {
    +++ description: None
      address:
-        "0xA8C31B2edd84c654d06d626383f4154D1E40C5Ff"
+        "eth:0xA8C31B2edd84c654d06d626383f4154D1E40C5Ff"
      values.$implementation:
-        "0x41675C099F32341bf84BFc5382aF534df5C7461a"
+        "eth:0x41675C099F32341bf84BFc5382aF534df5C7461a"
      values.$members.0:
-        "0x16388463d60FFE0661Cf7F1f31a7D658aC790ff7"
+        "eth:0x16388463d60FFE0661Cf7F1f31a7D658aC790ff7"
      values.$members.1:
-        "0x9d851f8b8751c5FbC09b9E74E6e68E9950949052"
+        "eth:0x9d851f8b8751c5FbC09b9E74E6e68E9950949052"
      values.$members.2:
-        "0xd0673F989bc3BA9314d0AAF28BfC84e99B7898CC"
+        "eth:0xd0673F989bc3BA9314d0AAF28BfC84e99B7898CC"
      implementationNames.0xA8C31B2edd84c654d06d626383f4154D1E40C5Ff:
-        "SafeProxy"
      implementationNames.0x41675C099F32341bf84BFc5382aF534df5C7461a:
-        "Safe"
      implementationNames.eth:0xA8C31B2edd84c654d06d626383f4154D1E40C5Ff:
+        "SafeProxy"
      implementationNames.eth:0x41675C099F32341bf84BFc5382aF534df5C7461a:
+        "Safe"
    }
```

```diff
    EOA  (0xB13C8f58a233607569D2F8411B912148aeC4aEe2) {
    +++ description: None
      address:
-        "0xB13C8f58a233607569D2F8411B912148aeC4aEe2"
+        "eth:0xB13C8f58a233607569D2F8411B912148aeC4aEe2"
    }
```

```diff
    EOA  (0xb3dA4c1Ba8De9E04f22B1554a070189F518FDCac) {
    +++ description: None
      address:
-        "0xb3dA4c1Ba8De9E04f22B1554a070189F518FDCac"
+        "eth:0xb3dA4c1Ba8De9E04f22B1554a070189F518FDCac"
    }
```

```diff
    contract SystemConfig (0xb6e1f8B589A14B79DDD3aD7F0589AB548c70C174) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      address:
-        "0xb6e1f8B589A14B79DDD3aD7F0589AB548c70C174"
+        "eth:0xb6e1f8B589A14B79DDD3aD7F0589AB548c70C174"
      values.$admin:
-        "0x19DbD16f0a8e706D817B7e3b7bcF72917Ebb8832"
+        "eth:0x19DbD16f0a8e706D817B7e3b7bcF72917Ebb8832"
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
-        "0x1FFDA89C755f6D4Af069897D77CcAbb580Fd412a"
+        "eth:0x1FFDA89C755f6D4Af069897D77CcAbb580Fd412a"
      values.batchInbox:
-        "0x000d4411cdeb152378626B5C5E33fd5D6808939a"
+        "eth:0x000d4411cdeb152378626B5C5E33fd5D6808939a"
      values.disputeGameFactory:
-        "0xe06278351d120288eDfCB963F934113Ca3C21AFe"
+        "eth:0xe06278351d120288eDfCB963F934113Ca3C21AFe"
      values.gasPayingToken.addr_:
-        "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE"
+        "eth:0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE"
      values.l1CrossDomainMessenger:
-        "0x2008A6Ba8CAF85AaFAe7880664Dfe681D533ac2E"
+        "eth:0x2008A6Ba8CAF85AaFAe7880664Dfe681D533ac2E"
      values.l1ERC721Bridge:
-        "0x15a32FCeA89617Ff450F094cDE102CCa46598B7F"
+        "eth:0x15a32FCeA89617Ff450F094cDE102CCa46598B7F"
      values.l1StandardBridge:
-        "0x98906C3f90A06B5484DD67bf32938815d2993dBC"
+        "eth:0x98906C3f90A06B5484DD67bf32938815d2993dBC"
      values.optimismMintableERC20Factory:
-        "0xA84C37cD0b9bA1B43276C11976DBE9d1344C7f4E"
+        "eth:0xA84C37cD0b9bA1B43276C11976DBE9d1344C7f4E"
      values.optimismPortal:
-        "0x250D30c523104bf0a06825e7eAdE4Dc46EdfE40E"
+        "eth:0x250D30c523104bf0a06825e7eAdE4Dc46EdfE40E"
      values.owner:
-        "0x4e981bAe8E3cd06Ca911ffFE5504B2653ac1C38a"
+        "eth:0x4e981bAe8E3cd06Ca911ffFE5504B2653ac1C38a"
      values.sequencerInbox:
-        "0x000d4411cdeb152378626B5C5E33fd5D6808939a"
+        "eth:0x000d4411cdeb152378626B5C5E33fd5D6808939a"
      values.unsafeBlockSigner:
-        "0x450A3A6AE85904cb4Aa0809Fb41E53B687a28397"
+        "eth:0x450A3A6AE85904cb4Aa0809Fb41E53B687a28397"
      implementationNames.0xb6e1f8B589A14B79DDD3aD7F0589AB548c70C174:
-        "Proxy"
      implementationNames.0xAB9d6cB7A427c0765163A7f45BB91cAfe5f2D375:
-        "SystemConfig"
      implementationNames.eth:0xb6e1f8B589A14B79DDD3aD7F0589AB548c70C174:
+        "Proxy"
      implementationNames.eth:0xAB9d6cB7A427c0765163A7f45BB91cAfe5f2D375:
+        "SystemConfig"
    }
```

```diff
    EOA  (0xBD5f1429Ab467E69BEeba51E547C00A21F2a2092) {
    +++ description: None
      address:
-        "0xBD5f1429Ab467E69BEeba51E547C00A21F2a2092"
+        "eth:0xBD5f1429Ab467E69BEeba51E547C00A21F2a2092"
    }
```

```diff
    EOA  (0xC1E65a0cEbF95f56Cd8729f7e37CB33eD94d6439) {
    +++ description: None
      address:
-        "0xC1E65a0cEbF95f56Cd8729f7e37CB33eD94d6439"
+        "eth:0xC1E65a0cEbF95f56Cd8729f7e37CB33eD94d6439"
    }
```

```diff
    EOA  (0xcB1e45481461aeF38E6B0a34F1444E9C5D647645) {
    +++ description: None
      address:
-        "0xcB1e45481461aeF38E6B0a34F1444E9C5D647645"
+        "eth:0xcB1e45481461aeF38E6B0a34F1444E9C5D647645"
    }
```

```diff
    EOA  (0xcC771952fdE840E30C6802734e5ad20479c2959f) {
    +++ description: None
      address:
-        "0xcC771952fdE840E30C6802734e5ad20479c2959f"
+        "eth:0xcC771952fdE840E30C6802734e5ad20479c2959f"
    }
```

```diff
    EOA  (0xd0002c648CCa8DeE2f2b8D70D542Ccde8ad6EC03) {
    +++ description: None
      address:
-        "0xd0002c648CCa8DeE2f2b8D70D542Ccde8ad6EC03"
+        "eth:0xd0002c648CCa8DeE2f2b8D70D542Ccde8ad6EC03"
    }
```

```diff
    contract Polygon Multisig 2 (0xd0673F989bc3BA9314d0AAF28BfC84e99B7898CC) {
    +++ description: None
      address:
-        "0xd0673F989bc3BA9314d0AAF28BfC84e99B7898CC"
+        "eth:0xd0673F989bc3BA9314d0AAF28BfC84e99B7898CC"
      values.$implementation:
-        "0x41675C099F32341bf84BFc5382aF534df5C7461a"
+        "eth:0x41675C099F32341bf84BFc5382aF534df5C7461a"
      values.$members.0:
-        "0x1DD6473a6bb5fF9041D945C7d15AC8fBc2Ee1164"
+        "eth:0x1DD6473a6bb5fF9041D945C7d15AC8fBc2Ee1164"
      values.$members.1:
-        "0xa43901c63f7702C407378E55E0d0EB4064a2AE31"
+        "eth:0xa43901c63f7702C407378E55E0d0EB4064a2AE31"
      implementationNames.0xd0673F989bc3BA9314d0AAF28BfC84e99B7898CC:
-        "SafeProxy"
      implementationNames.0x41675C099F32341bf84BFc5382aF534df5C7461a:
-        "Safe"
      implementationNames.eth:0xd0673F989bc3BA9314d0AAF28BfC84e99B7898CC:
+        "SafeProxy"
      implementationNames.eth:0x41675C099F32341bf84BFc5382aF534df5C7461a:
+        "Safe"
    }
```

```diff
    contract ProxyAdmin (0xD1e389c046FB734D2a0c7C390312210c408ba832) {
    +++ description: None
      address:
-        "0xD1e389c046FB734D2a0c7C390312210c408ba832"
+        "eth:0xD1e389c046FB734D2a0c7C390312210c408ba832"
      values.owner:
-        "0xA8C31B2edd84c654d06d626383f4154D1E40C5Ff"
+        "eth:0xA8C31B2edd84c654d06d626383f4154D1E40C5Ff"
      implementationNames.0xD1e389c046FB734D2a0c7C390312210c408ba832:
-        "ProxyAdmin"
      implementationNames.eth:0xD1e389c046FB734D2a0c7C390312210c408ba832:
+        "ProxyAdmin"
    }
```

```diff
    contract DisputeGameFactory (0xe06278351d120288eDfCB963F934113Ca3C21AFe) {
    +++ description: The dispute game factory allows the creation of dispute games, used to propose state roots and eventually challenge them.
      address:
-        "0xe06278351d120288eDfCB963F934113Ca3C21AFe"
+        "eth:0xe06278351d120288eDfCB963F934113Ca3C21AFe"
      values.$admin:
-        "0x19DbD16f0a8e706D817B7e3b7bcF72917Ebb8832"
+        "eth:0x19DbD16f0a8e706D817B7e3b7bcF72917Ebb8832"
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
-        "0x2d4B822F8B74AdE7fcD5F740967f4dFcD2fef5e4"
+        "eth:0x2d4B822F8B74AdE7fcD5F740967f4dFcD2fef5e4"
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
-        "0x4e981bAe8E3cd06Ca911ffFE5504B2653ac1C38a"
+        "eth:0x4e981bAe8E3cd06Ca911ffFE5504B2653ac1C38a"
      implementationNames.0xe06278351d120288eDfCB963F934113Ca3C21AFe:
-        "Proxy"
      implementationNames.0xc641A33cab81C559F2bd4b21EA34C290E2440C2B:
-        "DisputeGameFactory"
      implementationNames.eth:0xe06278351d120288eDfCB963F934113Ca3C21AFe:
+        "Proxy"
      implementationNames.eth:0xc641A33cab81C559F2bd4b21EA34C290E2440C2B:
+        "DisputeGameFactory"
    }
```

```diff
    EOA  (0xE3fCEE6B6cd564E073346f71394f60eC9aDf5120) {
    +++ description: None
      address:
-        "0xE3fCEE6B6cd564E073346f71394f60eC9aDf5120"
+        "eth:0xE3fCEE6B6cd564E073346f71394f60eC9aDf5120"
    }
```

```diff
    contract AddressManager (0xEaB94275eD336D80d4F46EA8Ea0427e351f11D65) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      address:
-        "0xEaB94275eD336D80d4F46EA8Ea0427e351f11D65"
+        "eth:0xEaB94275eD336D80d4F46EA8Ea0427e351f11D65"
      values.owner:
-        "0x19DbD16f0a8e706D817B7e3b7bcF72917Ebb8832"
+        "eth:0x19DbD16f0a8e706D817B7e3b7bcF72917Ebb8832"
      implementationNames.0xEaB94275eD336D80d4F46EA8Ea0427e351f11D65:
-        "AddressManager"
      implementationNames.eth:0xEaB94275eD336D80d4F46EA8Ea0427e351f11D65:
+        "AddressManager"
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
    contract Katana vaultBridge Multisig 3 (0xf4F2f5F6bAdBE05433C4604320ecC56BbECBC04E) {
    +++ description: None
      address:
-        "0xf4F2f5F6bAdBE05433C4604320ecC56BbECBC04E"
+        "eth:0xf4F2f5F6bAdBE05433C4604320ecC56BbECBC04E"
      values.$implementation:
-        "0x41675C099F32341bf84BFc5382aF534df5C7461a"
+        "eth:0x41675C099F32341bf84BFc5382aF534df5C7461a"
      values.$members.0:
-        "0x9d851f8b8751c5FbC09b9E74E6e68E9950949052"
+        "eth:0x9d851f8b8751c5FbC09b9E74E6e68E9950949052"
      values.$members.1:
-        "0xd0673F989bc3BA9314d0AAF28BfC84e99B7898CC"
+        "eth:0xd0673F989bc3BA9314d0AAF28BfC84e99B7898CC"
      values.$members.2:
-        "0x827e86072B06674a077f592A531dcE4590aDeCdB"
+        "eth:0x827e86072B06674a077f592A531dcE4590aDeCdB"
      implementationNames.0xf4F2f5F6bAdBE05433C4604320ecC56BbECBC04E:
-        "SafeProxy"
      implementationNames.0x41675C099F32341bf84BFc5382aF534df5C7461a:
-        "Safe"
      implementationNames.eth:0xf4F2f5F6bAdBE05433C4604320ecC56BbECBC04E:
+        "SafeProxy"
      implementationNames.eth:0x41675C099F32341bf84BFc5382aF534df5C7461a:
+        "Safe"
    }
```

```diff
+   Status: CREATED
    contract AggchainFEP (0x100d3ca4f97776A40A7D93dB4AbF0FEA34230666)
    +++ description: The main system contract defining the katana Layer 2 logic. As this contract is based on the OP-Succinct L2OutputOracle, OP stack outputRoots (L2 state roots) are saved here.
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x14Be6579A41342ca6B402ec85E7be538e6Ade951)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1ERC721Bridge (0x15a32FCeA89617Ff450F094cDE102CCa46598B7F)
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
```

```diff
+   Status: CREATED
    contract Yearn Strategist Multisig (0x16388463d60FFE0661Cf7F1f31a7D658aC790ff7)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x19DbD16f0a8e706D817B7e3b7bcF72917Ebb8832)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1CrossDomainMessenger (0x2008A6Ba8CAF85AaFAe7880664Dfe681D533ac2E)
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
```

```diff
+   Status: CREATED
    contract OptimismPortal2 (0x250D30c523104bf0a06825e7eAdE4Dc46EdfE40E)
    +++ description: The OptimismPortal contract usually is the main entry point to deposit funds from L1 to L2 or for finalizing withdrawals. It specifies which game type can be used for withdrawals, which currently is the PermissionedDisputeGame. This specific fork of the standard contract **disables the depositTransaction() function**, which prevents users from sending or forcing any transactions from L1 to L2, including token deposits. It is instead used for configuration and administration of the system.
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x263b251D67BB154DD6b8352539466ACE7948ED56)
    +++ description: None
```

```diff
+   Status: CREATED
    contract vbWBTC (0x2C24B57e2CCd1f273045Af6A5f632504C432374F)
    +++ description: This token contract uses a standard 'vault bridge token' implementation created by Agglayer CDK. It keeps deposited assets in a vault and issues an IOU token (Vault Bridge WBTC) which can be deposited to Agglayer. The underlying asset is generating yield, which does not accrue to the vbWBTC-IOU but is sent to eth:0x67C912fF560951526BffDff66dFbD4DF8AE23756.
```

```diff
+   Status: CREATED
    contract PermissionedDisputeGame (0x2d4B822F8B74AdE7fcD5F740967f4dFcD2fef5e4)
    +++ description: Same as FaultDisputeGame, but only two permissioned addresses are designated as proposer and challenger.
```

```diff
+   Status: CREATED
    contract vbETH (0x2DC70fb75b88d2eB4715bc06E1595E6D97c34DFF)
    +++ description: This token contract uses a standard 'vault bridge token' implementation created by Agglayer CDK. It keeps deposited assets in a vault and issues an IOU token (Vault Bridge ETH) which can be deposited to Agglayer. The underlying asset is generating yield, which does not accrue to the vbETH-IOU but is sent to eth:0x67C912fF560951526BffDff66dFbD4DF8AE23756.
```

```diff
+   Status: CREATED
    contract Katana vaultBridge Multisig 1 (0x2De242e27386e224E5fbF110EA8406d5B70740ec)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SuperchainConfig (0x2F439B95fa789C5d3a5C99cc70EB3ee83D08a811)
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x377a9e5df2882DC1DF8A0bD162cbc640eA634010)
    +++ description: None
```

```diff
+   Status: CREATED
    contract vbUSDS (0x3DD459dE96F9C28e3a343b831cbDC2B93c8C4855)
    +++ description: This token contract uses a standard 'vault bridge token' implementation created by Agglayer CDK. It keeps deposited assets in a vault and issues an IOU token (Vault Bridge USDS) which can be deposited to Agglayer. The underlying asset is generating yield, which does not accrue to the vbUSDS-IOU but is sent to eth:0x67C912fF560951526BffDff66dFbD4DF8AE23756.
```

```diff
+   Status: CREATED
    contract MigrationManager (0x417d01B64Ea30C4E163873f3a1f77b727c689e02)
    +++ description: Helper contract for the vaultBridge tokens on Layer 2. If any vbTokens are minted 'natively' on Layer 2, this contract can receive the underlying assets and lock them in the Layer 1 vaults.
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x420693B32113a0e00Eb9f3315D5D5ec3b32C2d69)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Conduit Multisig 1 (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Katana Foundation Engineering/Security Multisig (0x4e981bAe8E3cd06Ca911ffFE5504B2653ac1C38a)
    +++ description: None
```

```diff
+   Status: CREATED
    contract vbUSDC (0x53E82ABbb12638F09d9e624578ccB666217a765e)
    +++ description: This token contract uses a standard 'vault bridge token' implementation created by Agglayer CDK. It keeps deposited assets in a vault and issues an IOU token (Vault Bridge USDC) which can be deposited to Agglayer. The underlying asset is generating yield, which does not accrue to the vbUSDC-IOU but is sent to eth:0x67C912fF560951526BffDff66dFbD4DF8AE23756.
```

```diff
+   Status: CREATED
    contract MIPS (0x5fE03a12C1236F9C22Cb6479778DDAa4bce6299C)
    +++ description: The MIPS contract is used to execute the final step of the dispute game which objectively determines the winner of the dispute.
```

```diff
+   Status: CREATED
    contract Katana yieldRecipient Mulsitig (0x67C912fF560951526BffDff66dFbD4DF8AE23756)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x6d0ff67fb427422AfF35EEa8596949B374b09a52)
    +++ description: None
```

```diff
+   Status: CREATED
    contract vbUSDT (0x6d4f9f9f8f0155509ecd6Ac6c544fF27999845CC)
    +++ description: This token contract uses a standard 'vault bridge token' implementation created by Agglayer CDK. It keeps deposited assets in a vault and issues an IOU token (Vault Bridge USDT) which can be deposited to Agglayer. The underlying asset is generating yield, which does not accrue to the vbUSDT-IOU but is sent to eth:0x67C912fF560951526BffDff66dFbD4DF8AE23756.
```

```diff
+   Status: CREATED
    contract DelayedWETH (0x74034597d29613CC8C0BDc8780e1d292A553Bd32)
    +++ description: Contract designed to hold the bonded ETH for each game. It is designed as a wrapper around WETH to allow an owner to function as a backstop if a game would incorrectly distribute funds.
```

```diff
+   Status: CREATED
    contract AnchorStateRegistry (0x79ecD8d8040496014bcD3bA16AdF3914b23f8Fd5)
    +++ description: Contains the latest confirmed state root that can be used as a starting point in a dispute game.
```

```diff
+   Status: CREATED
    contract Katana Steakhouse Financial / Morpho Multisig (0x827e86072B06674a077f592A531dcE4590aDeCdB)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x8970650CF3f1E57cA804C65B4DBcFf698789FE30)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1StandardBridge (0x98906C3f90A06B5484DD67bf32938815d2993dBC)
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
```

```diff
+   Status: CREATED
    contract PreimageOracle (0x9c065e11870B891D214Bc2Da7EF1f9DDFA1BE277)
    +++ description: The PreimageOracle contract is used to load the required data from L1 for a dispute game.
```

```diff
+   Status: CREATED
    contract Polygon Labs Engineering/Security Multisig (0x9d851f8b8751c5FbC09b9E74E6e68E9950949052)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OptimismMintableERC20Factory (0xA84C37cD0b9bA1B43276C11976DBE9d1344C7f4E)
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintableERC20 as this chain's representation of a token on the host chain, or vice-versa.
```

```diff
+   Status: CREATED
    contract Katana vaultBridge Multisig 2 (0xA8C31B2edd84c654d06d626383f4154D1E40C5Ff)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SystemConfig (0xb6e1f8B589A14B79DDD3aD7F0589AB548c70C174)
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
```

```diff
+   Status: CREATED
    contract Polygon Multisig 2 (0xd0673F989bc3BA9314d0AAF28BfC84e99B7898CC)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0xD1e389c046FB734D2a0c7C390312210c408ba832)
    +++ description: None
```

```diff
+   Status: CREATED
    contract DisputeGameFactory (0xe06278351d120288eDfCB963F934113Ca3C21AFe)
    +++ description: The dispute game factory allows the creation of dispute games, used to propose state roots and eventually challenge them.
```

```diff
+   Status: CREATED
    contract AddressManager (0xEaB94275eD336D80d4F46EA8Ea0427e351f11D65)
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
```

```diff
+   Status: CREATED
    contract Katana vaultBridge Multisig 3 (0xf4F2f5F6bAdBE05433C4604320ecC56BbECBC04E)
    +++ description: None
```

Generated with discovered.json: 0x4de9b7e488759b6a86bc33ee8a000f43196bb151

# Diff at Mon, 14 Jul 2025 08:02:45 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@0dc82cd5064c9c6dc9fb20e2291a8bb6b2048e27 block: 22895938
- current block number: 22895938

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22895938 (main branch discovery), not current.

```diff
    contract OptimismMintableERC20Factory (0xA84C37cD0b9bA1B43276C11976DBE9d1344C7f4E) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintableERC20 as this chain's representation of a token on the host chain, or vice-versa.
      description:
-        "A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa."
+        "A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintableERC20 as this chain's representation of a token on the host chain, or vice-versa."
    }
```

Generated with discovered.json: 0xcd8b1f519e36434eaf3e03c79a3ba0d0d39c873a

# Diff at Fri, 11 Jul 2025 12:28:54 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@6f02976fdd9466dab085b947bf3c4d28ccef1010 block: 22837267
- current block number: 22895938

## Description

2 member added, 1 member switch.

## Watched changes

```diff
    contract Katana Foundation Engineering/Security Multisig (0x4e981bAe8E3cd06Ca911ffFE5504B2653ac1C38a) {
    +++ description: None
      values.$members.4:
-        "0xeD44D1CFfB91e163CB7126bdEeA83959f175dB37"
+        "0xcAB31b6A7b4d2eCd562A09e2BfA46535a18862f9"
    }
```

```diff
    contract Katana yieldRecipient Mulsitig (0x67C912fF560951526BffDff66dFbD4DF8AE23756) {
    +++ description: None
      values.$members.0:
+        "0x0A4857fD89ABfB7536a6D0Bd4400EF769E84Ec8b"
      values.$members.1:
+        "0x54DFA4B635E7eB98515fEBA81d360A3871739277"
      values.multisigThreshold:
-        "2 of 3 (67%)"
+        "2 of 5 (40%)"
    }
```

Generated with discovered.json: 0x5c6d5eccb8c520e2a2c0a17648a1e0b5be8117a5

# Diff at Fri, 04 Jul 2025 12:19:05 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f56dc47fe915564d4555300304da4d3bcbc087f block: 22837267
- current block number: 22837267

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22837267 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x14Be6579A41342ca6B402ec85E7be538e6Ade951) {
    +++ description: None
      directlyReceivedPermissions.0.from:
-        "ethereum:0x2DC70fb75b88d2eB4715bc06E1595E6D97c34DFF"
+        "eth:0x2DC70fb75b88d2eB4715bc06E1595E6D97c34DFF"
    }
```

```diff
    contract ProxyAdmin (0x19DbD16f0a8e706D817B7e3b7bcF72917Ebb8832) {
    +++ description: None
      directlyReceivedPermissions.0.from:
-        "ethereum:0xEaB94275eD336D80d4F46EA8Ea0427e351f11D65"
+        "eth:0xEaB94275eD336D80d4F46EA8Ea0427e351f11D65"
      directlyReceivedPermissions.1.from:
-        "ethereum:0x15a32FCeA89617Ff450F094cDE102CCa46598B7F"
+        "eth:0x15a32FCeA89617Ff450F094cDE102CCa46598B7F"
      directlyReceivedPermissions.2.from:
-        "ethereum:0x2008A6Ba8CAF85AaFAe7880664Dfe681D533ac2E"
+        "eth:0x2008A6Ba8CAF85AaFAe7880664Dfe681D533ac2E"
      directlyReceivedPermissions.3.from:
-        "ethereum:0x250D30c523104bf0a06825e7eAdE4Dc46EdfE40E"
+        "eth:0x250D30c523104bf0a06825e7eAdE4Dc46EdfE40E"
      directlyReceivedPermissions.4.from:
-        "ethereum:0x74034597d29613CC8C0BDc8780e1d292A553Bd32"
+        "eth:0x74034597d29613CC8C0BDc8780e1d292A553Bd32"
      directlyReceivedPermissions.5.from:
-        "ethereum:0x79ecD8d8040496014bcD3bA16AdF3914b23f8Fd5"
+        "eth:0x79ecD8d8040496014bcD3bA16AdF3914b23f8Fd5"
      directlyReceivedPermissions.6.from:
-        "ethereum:0x98906C3f90A06B5484DD67bf32938815d2993dBC"
+        "eth:0x98906C3f90A06B5484DD67bf32938815d2993dBC"
      directlyReceivedPermissions.7.from:
-        "ethereum:0xA84C37cD0b9bA1B43276C11976DBE9d1344C7f4E"
+        "eth:0xA84C37cD0b9bA1B43276C11976DBE9d1344C7f4E"
      directlyReceivedPermissions.8.from:
-        "ethereum:0xb6e1f8B589A14B79DDD3aD7F0589AB548c70C174"
+        "eth:0xb6e1f8B589A14B79DDD3aD7F0589AB548c70C174"
      directlyReceivedPermissions.9.from:
-        "ethereum:0xe06278351d120288eDfCB963F934113Ca3C21AFe"
+        "eth:0xe06278351d120288eDfCB963F934113Ca3C21AFe"
    }
```

```diff
    EOA  (0x1FFDA89C755f6D4Af069897D77CcAbb580Fd412a) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0xb6e1f8B589A14B79DDD3aD7F0589AB548c70C174"
+        "eth:0xb6e1f8B589A14B79DDD3aD7F0589AB548c70C174"
    }
```

```diff
    contract ProxyAdmin (0x263b251D67BB154DD6b8352539466ACE7948ED56) {
    +++ description: None
      directlyReceivedPermissions.0.from:
-        "ethereum:0x417d01B64Ea30C4E163873f3a1f77b727c689e02"
+        "eth:0x417d01B64Ea30C4E163873f3a1f77b727c689e02"
    }
```

```diff
    contract Katana vaultBridge Multisig 1 (0x2De242e27386e224E5fbF110EA8406d5B70740ec) {
    +++ description: None
      receivedPermissions.0.via.0.address:
-        "ethereum:0x420693B32113a0e00Eb9f3315D5D5ec3b32C2d69"
+        "eth:0x420693B32113a0e00Eb9f3315D5D5ec3b32C2d69"
      receivedPermissions.0.from:
-        "ethereum:0x2C24B57e2CCd1f273045Af6A5f632504C432374F"
+        "eth:0x2C24B57e2CCd1f273045Af6A5f632504C432374F"
      receivedPermissions.1.via.0.address:
-        "ethereum:0x14Be6579A41342ca6B402ec85E7be538e6Ade951"
+        "eth:0x14Be6579A41342ca6B402ec85E7be538e6Ade951"
      receivedPermissions.1.from:
-        "ethereum:0x2DC70fb75b88d2eB4715bc06E1595E6D97c34DFF"
+        "eth:0x2DC70fb75b88d2eB4715bc06E1595E6D97c34DFF"
      receivedPermissions.2.via.0.address:
-        "ethereum:0x377a9e5df2882DC1DF8A0bD162cbc640eA634010"
+        "eth:0x377a9e5df2882DC1DF8A0bD162cbc640eA634010"
      receivedPermissions.2.from:
-        "ethereum:0x6d4f9f9f8f0155509ecd6Ac6c544fF27999845CC"
+        "eth:0x6d4f9f9f8f0155509ecd6Ac6c544fF27999845CC"
      directlyReceivedPermissions.0.from:
-        "ethereum:0x14Be6579A41342ca6B402ec85E7be538e6Ade951"
+        "eth:0x14Be6579A41342ca6B402ec85E7be538e6Ade951"
      directlyReceivedPermissions.1.from:
-        "ethereum:0x377a9e5df2882DC1DF8A0bD162cbc640eA634010"
+        "eth:0x377a9e5df2882DC1DF8A0bD162cbc640eA634010"
      directlyReceivedPermissions.2.from:
-        "ethereum:0x420693B32113a0e00Eb9f3315D5D5ec3b32C2d69"
+        "eth:0x420693B32113a0e00Eb9f3315D5D5ec3b32C2d69"
    }
```

```diff
    contract ProxyAdmin (0x377a9e5df2882DC1DF8A0bD162cbc640eA634010) {
    +++ description: None
      directlyReceivedPermissions.0.from:
-        "ethereum:0x6d4f9f9f8f0155509ecd6Ac6c544fF27999845CC"
+        "eth:0x6d4f9f9f8f0155509ecd6Ac6c544fF27999845CC"
    }
```

```diff
    contract ProxyAdmin (0x420693B32113a0e00Eb9f3315D5D5ec3b32C2d69) {
    +++ description: None
      directlyReceivedPermissions.0.from:
-        "ethereum:0x2C24B57e2CCd1f273045Af6A5f632504C432374F"
+        "eth:0x2C24B57e2CCd1f273045Af6A5f632504C432374F"
    }
```

```diff
    contract Katana Foundation Engineering/Security Multisig (0x4e981bAe8E3cd06Ca911ffFE5504B2653ac1C38a) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0x100d3ca4f97776A40A7D93dB4AbF0FEA34230666"
+        "eth:0x100d3ca4f97776A40A7D93dB4AbF0FEA34230666"
      receivedPermissions.1.from:
-        "ethereum:0x100d3ca4f97776A40A7D93dB4AbF0FEA34230666"
+        "eth:0x100d3ca4f97776A40A7D93dB4AbF0FEA34230666"
      receivedPermissions.2.from:
-        "ethereum:0x74034597d29613CC8C0BDc8780e1d292A553Bd32"
+        "eth:0x74034597d29613CC8C0BDc8780e1d292A553Bd32"
      receivedPermissions.3.from:
-        "ethereum:0xb6e1f8B589A14B79DDD3aD7F0589AB548c70C174"
+        "eth:0xb6e1f8B589A14B79DDD3aD7F0589AB548c70C174"
      receivedPermissions.4.via.0.address:
-        "ethereum:0x19DbD16f0a8e706D817B7e3b7bcF72917Ebb8832"
+        "eth:0x19DbD16f0a8e706D817B7e3b7bcF72917Ebb8832"
      receivedPermissions.4.from:
-        "ethereum:0xEaB94275eD336D80d4F46EA8Ea0427e351f11D65"
+        "eth:0xEaB94275eD336D80d4F46EA8Ea0427e351f11D65"
      receivedPermissions.5.via.0.address:
-        "ethereum:0x19DbD16f0a8e706D817B7e3b7bcF72917Ebb8832"
+        "eth:0x19DbD16f0a8e706D817B7e3b7bcF72917Ebb8832"
      receivedPermissions.5.from:
-        "ethereum:0x15a32FCeA89617Ff450F094cDE102CCa46598B7F"
+        "eth:0x15a32FCeA89617Ff450F094cDE102CCa46598B7F"
      receivedPermissions.6.via.0.address:
-        "ethereum:0x19DbD16f0a8e706D817B7e3b7bcF72917Ebb8832"
+        "eth:0x19DbD16f0a8e706D817B7e3b7bcF72917Ebb8832"
      receivedPermissions.6.from:
-        "ethereum:0x2008A6Ba8CAF85AaFAe7880664Dfe681D533ac2E"
+        "eth:0x2008A6Ba8CAF85AaFAe7880664Dfe681D533ac2E"
      receivedPermissions.7.via.0.address:
-        "ethereum:0x19DbD16f0a8e706D817B7e3b7bcF72917Ebb8832"
+        "eth:0x19DbD16f0a8e706D817B7e3b7bcF72917Ebb8832"
      receivedPermissions.7.from:
-        "ethereum:0x250D30c523104bf0a06825e7eAdE4Dc46EdfE40E"
+        "eth:0x250D30c523104bf0a06825e7eAdE4Dc46EdfE40E"
      receivedPermissions.8.via.0.address:
-        "ethereum:0x6d0ff67fb427422AfF35EEa8596949B374b09a52"
+        "eth:0x6d0ff67fb427422AfF35EEa8596949B374b09a52"
      receivedPermissions.8.from:
-        "ethereum:0x2F439B95fa789C5d3a5C99cc70EB3ee83D08a811"
+        "eth:0x2F439B95fa789C5d3a5C99cc70EB3ee83D08a811"
      receivedPermissions.9.via.0.address:
-        "ethereum:0x19DbD16f0a8e706D817B7e3b7bcF72917Ebb8832"
+        "eth:0x19DbD16f0a8e706D817B7e3b7bcF72917Ebb8832"
      receivedPermissions.9.from:
-        "ethereum:0x74034597d29613CC8C0BDc8780e1d292A553Bd32"
+        "eth:0x74034597d29613CC8C0BDc8780e1d292A553Bd32"
      receivedPermissions.10.via.0.address:
-        "ethereum:0x19DbD16f0a8e706D817B7e3b7bcF72917Ebb8832"
+        "eth:0x19DbD16f0a8e706D817B7e3b7bcF72917Ebb8832"
      receivedPermissions.10.from:
-        "ethereum:0x79ecD8d8040496014bcD3bA16AdF3914b23f8Fd5"
+        "eth:0x79ecD8d8040496014bcD3bA16AdF3914b23f8Fd5"
      receivedPermissions.11.via.0.address:
-        "ethereum:0x19DbD16f0a8e706D817B7e3b7bcF72917Ebb8832"
+        "eth:0x19DbD16f0a8e706D817B7e3b7bcF72917Ebb8832"
      receivedPermissions.11.from:
-        "ethereum:0x98906C3f90A06B5484DD67bf32938815d2993dBC"
+        "eth:0x98906C3f90A06B5484DD67bf32938815d2993dBC"
      receivedPermissions.12.via.0.address:
-        "ethereum:0x19DbD16f0a8e706D817B7e3b7bcF72917Ebb8832"
+        "eth:0x19DbD16f0a8e706D817B7e3b7bcF72917Ebb8832"
      receivedPermissions.12.from:
-        "ethereum:0xA84C37cD0b9bA1B43276C11976DBE9d1344C7f4E"
+        "eth:0xA84C37cD0b9bA1B43276C11976DBE9d1344C7f4E"
      receivedPermissions.13.via.0.address:
-        "ethereum:0x19DbD16f0a8e706D817B7e3b7bcF72917Ebb8832"
+        "eth:0x19DbD16f0a8e706D817B7e3b7bcF72917Ebb8832"
      receivedPermissions.13.from:
-        "ethereum:0xb6e1f8B589A14B79DDD3aD7F0589AB548c70C174"
+        "eth:0xb6e1f8B589A14B79DDD3aD7F0589AB548c70C174"
      receivedPermissions.14.via.0.address:
-        "ethereum:0x19DbD16f0a8e706D817B7e3b7bcF72917Ebb8832"
+        "eth:0x19DbD16f0a8e706D817B7e3b7bcF72917Ebb8832"
      receivedPermissions.14.from:
-        "ethereum:0xe06278351d120288eDfCB963F934113Ca3C21AFe"
+        "eth:0xe06278351d120288eDfCB963F934113Ca3C21AFe"
      directlyReceivedPermissions.0.from:
-        "ethereum:0x19DbD16f0a8e706D817B7e3b7bcF72917Ebb8832"
+        "eth:0x19DbD16f0a8e706D817B7e3b7bcF72917Ebb8832"
      directlyReceivedPermissions.1.from:
-        "ethereum:0x6d0ff67fb427422AfF35EEa8596949B374b09a52"
+        "eth:0x6d0ff67fb427422AfF35EEa8596949B374b09a52"
    }
```

```diff
    contract ProxyAdmin (0x6d0ff67fb427422AfF35EEa8596949B374b09a52) {
    +++ description: None
      directlyReceivedPermissions.0.from:
-        "ethereum:0x2F439B95fa789C5d3a5C99cc70EB3ee83D08a811"
+        "eth:0x2F439B95fa789C5d3a5C99cc70EB3ee83D08a811"
    }
```

```diff
    contract ProxyAdmin (0x8970650CF3f1E57cA804C65B4DBcFf698789FE30) {
    +++ description: None
      directlyReceivedPermissions.0.from:
-        "ethereum:0x53E82ABbb12638F09d9e624578ccB666217a765e"
+        "eth:0x53E82ABbb12638F09d9e624578ccB666217a765e"
    }
```

```diff
    contract Polygon Labs Engineering/Security Multisig (0x9d851f8b8751c5FbC09b9E74E6e68E9950949052) {
    +++ description: None
      receivedPermissions.0.via.0.address:
-        "ethereum:0x263b251D67BB154DD6b8352539466ACE7948ED56"
+        "eth:0x263b251D67BB154DD6b8352539466ACE7948ED56"
      receivedPermissions.0.from:
-        "ethereum:0x417d01B64Ea30C4E163873f3a1f77b727c689e02"
+        "eth:0x417d01B64Ea30C4E163873f3a1f77b727c689e02"
      directlyReceivedPermissions.0.from:
-        "ethereum:0x263b251D67BB154DD6b8352539466ACE7948ED56"
+        "eth:0x263b251D67BB154DD6b8352539466ACE7948ED56"
    }
```

```diff
    contract Katana vaultBridge Multisig 2 (0xA8C31B2edd84c654d06d626383f4154D1E40C5Ff) {
    +++ description: None
      receivedPermissions.0.via.0.address:
-        "ethereum:0xD1e389c046FB734D2a0c7C390312210c408ba832"
+        "eth:0xD1e389c046FB734D2a0c7C390312210c408ba832"
      receivedPermissions.0.from:
-        "ethereum:0x3DD459dE96F9C28e3a343b831cbDC2B93c8C4855"
+        "eth:0x3DD459dE96F9C28e3a343b831cbDC2B93c8C4855"
      directlyReceivedPermissions.0.from:
-        "ethereum:0xD1e389c046FB734D2a0c7C390312210c408ba832"
+        "eth:0xD1e389c046FB734D2a0c7C390312210c408ba832"
    }
```

```diff
    EOA  (0xC1E65a0cEbF95f56Cd8729f7e37CB33eD94d6439) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0x100d3ca4f97776A40A7D93dB4AbF0FEA34230666"
+        "eth:0x100d3ca4f97776A40A7D93dB4AbF0FEA34230666"
    }
```

```diff
    contract ProxyAdmin (0xD1e389c046FB734D2a0c7C390312210c408ba832) {
    +++ description: None
      directlyReceivedPermissions.0.from:
-        "ethereum:0x3DD459dE96F9C28e3a343b831cbDC2B93c8C4855"
+        "eth:0x3DD459dE96F9C28e3a343b831cbDC2B93c8C4855"
    }
```

```diff
    contract Katana vaultBridge Multisig 3 (0xf4F2f5F6bAdBE05433C4604320ecC56BbECBC04E) {
    +++ description: None
      receivedPermissions.0.via.0.address:
-        "ethereum:0x8970650CF3f1E57cA804C65B4DBcFf698789FE30"
+        "eth:0x8970650CF3f1E57cA804C65B4DBcFf698789FE30"
      receivedPermissions.0.from:
-        "ethereum:0x53E82ABbb12638F09d9e624578ccB666217a765e"
+        "eth:0x53E82ABbb12638F09d9e624578ccB666217a765e"
      directlyReceivedPermissions.0.from:
-        "ethereum:0x8970650CF3f1E57cA804C65B4DBcFf698789FE30"
+        "eth:0x8970650CF3f1E57cA804C65B4DBcFf698789FE30"
    }
```

Generated with discovered.json: 0x5aa7e41e27277da1df64f06a0985e2f48af69bf3

# Diff at Thu, 03 Jul 2025 10:57:02 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@fa3b82adfb9dedeb2acea8fde7b79e65d59fb2b6 block: 22837267
- current block number: 22837267

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22837267 (main branch discovery), not current.

```diff
    contract L1ERC721Bridge (0x15a32FCeA89617Ff450F094cDE102CCa46598B7F) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      category.name:
-        "Canonical Bridges"
+        "Spam"
      category.priority:
-        2
+        -1
    }
```

```diff
    contract L1CrossDomainMessenger (0x2008A6Ba8CAF85AaFAe7880664Dfe681D533ac2E) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      category.name:
-        "Canonical Bridges"
+        "Spam"
      category.priority:
-        2
+        -1
    }
```

```diff
    contract L1StandardBridge (0x98906C3f90A06B5484DD67bf32938815d2993dBC) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      category.name:
-        "Canonical Bridges"
+        "Spam"
      category.priority:
-        2
+        -1
    }
```

```diff
    contract DisputeGameFactory (0xe06278351d120288eDfCB963F934113Ca3C21AFe) {
    +++ description: The dispute game factory allows the creation of dispute games, used to propose state roots and eventually challenge them.
      category.name:
-        "Local Infrastructure"
+        "Spam"
      category.priority:
-        5
+        -1
    }
```

Generated with discovered.json: 0xfb8af94a9da8bc0661f4417e752fcc542343186b

# Diff at Thu, 03 Jul 2025 09:54:26 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@717eea3a0fc625b39e556e700bc9e657bb32fa71 block: 22825494
- current block number: 22837267

## Description

add op stack gasconfig parameters.

config: refine descriptions and permissions.

## Watched changes

```diff
    contract SystemConfig (0xb6e1f8B589A14B79DDD3aD7F0589AB548c70C174) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
+++ description: volatility param: lower denominator -> quicker fee changes on L2
      values.eip1559Denominator:
-        0
+        250
      values.eip1559Elasticity:
-        0
+        60
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22825494 (main branch discovery), not current.

```diff
    contract AggchainFEP (0x100d3ca4f97776A40A7D93dB4AbF0FEA34230666) {
    +++ description: The main system contract defining the katana Layer 2 logic. As this contract is based on the OP-Succinct L2OutputOracle, OP stack outputRoots (L2 state roots) are saved here.
      fieldMeta.aggregationVkey.description:
-        "Verification key for the aggregation step which aggregates multiple range proofs into a single proof. The aggregation proof ensures that all range proofs in a given block range are linked and use the `rangeVkeyCommitment` as the verification key."
+        "Verification key for the aggregation step which aggregates multiple range proofs into a single proof. The aggregation proof ensures that all range proofs in a given block range are linked and use the `rangeVkeyCommitment` as the verification key. This proof is in turn wrapped by the aggchainVkey."
      fieldMeta.aggregationVkey.severity:
+        "HIGH"
      fieldMeta.rangeVkeyCommitment.description:
-        "Verification key for the OP Stack derivation + STF proof for a range of blocks."
+        "Verification key for the OP Stack derivation + STF proof for a range of blocks. This proof is the bottom level proof, wrapped by the aggregationVkey."
      fieldMeta.rangeVkeyCommitment.severity:
+        "HIGH"
      fieldMeta.optimisticMode:
+        {"severity":"HIGH","description":"degrades the system into a permissioned finalization mode without validity proofs. the state root in the aggchain proof in optimistic mode does not need an op succinct validity proof, but only a signature of the trustedSequencer."}
    }
```

```diff
    contract OptimismPortal2 (0x250D30c523104bf0a06825e7eAdE4Dc46EdfE40E) {
    +++ description: The OptimismPortal contract usually is the main entry point to deposit funds from L1 to L2 or for finalizing withdrawals. It specifies which game type can be used for withdrawals, which currently is the PermissionedDisputeGame. This specific fork of the standard contract **disables the depositTransaction() function**, which prevents users from sending or forcing any transactions from L1 to L2, including token deposits. It is instead used for configuration and administration of the system.
      description:
-        "[PAUSED] The OptimismPortal contract is the main entry point to deposit funds from L1 to L2. It also allows to prove and finalize withdrawals. It specifies which game type can be used for withdrawals, which currently is the PermissionedDisputeGame. This specific fork of the standard contract **disables the depositTransaction() function**, which prevents users from sending or forcing any transactions from L1 to L2, including token deposits."
+        "The OptimismPortal contract usually is the main entry point to deposit funds from L1 to L2 or for finalizing withdrawals. It specifies which game type can be used for withdrawals, which currently is the PermissionedDisputeGame. This specific fork of the standard contract **disables the depositTransaction() function**, which prevents users from sending or forcing any transactions from L1 to L2, including token deposits. It is instead used for configuration and administration of the system."
    }
```

```diff
    contract vbWBTC (0x2C24B57e2CCd1f273045Af6A5f632504C432374F) {
    +++ description: This token contract uses a standard 'vault bridge token' implementation created by Agglayer CDK. It keeps deposited assets in a vault and issues an IOU token (Vault Bridge WBTC) which can be deposited to Agglayer. The underlying asset is generating yield, which does not accrue to the vbWBTC-IOU but is sent to 0x67C912fF560951526BffDff66dFbD4DF8AE23756.
      name:
-        "GenericVaultBridgeToken"
+        "vbWBTC"
      description:
+        "This token contract uses a standard 'vault bridge token' implementation created by Agglayer CDK. It keeps deposited assets in a vault and issues an IOU token (Vault Bridge WBTC) which can be deposited to Agglayer. The underlying asset is generating yield, which does not accrue to the vbWBTC-IOU but is sent to 0x67C912fF560951526BffDff66dFbD4DF8AE23756."
      category:
+        {"name":"External Bridges","priority":1}
    }
```

```diff
    contract vbETH (0x2DC70fb75b88d2eB4715bc06E1595E6D97c34DFF) {
    +++ description: This token contract uses a standard 'vault bridge token' implementation created by Agglayer CDK. It keeps deposited assets in a vault and issues an IOU token (Vault Bridge ETH) which can be deposited to Agglayer. The underlying asset is generating yield, which does not accrue to the vbETH-IOU but is sent to 0x67C912fF560951526BffDff66dFbD4DF8AE23756.
      name:
-        "VbETH"
+        "vbETH"
      description:
+        "This token contract uses a standard 'vault bridge token' implementation created by Agglayer CDK. It keeps deposited assets in a vault and issues an IOU token (Vault Bridge ETH) which can be deposited to Agglayer. The underlying asset is generating yield, which does not accrue to the vbETH-IOU but is sent to 0x67C912fF560951526BffDff66dFbD4DF8AE23756."
      category:
+        {"name":"External Bridges","priority":1}
    }
```

```diff
    contract Katana vaultBridge Multisig 1 (0x2De242e27386e224E5fbF110EA8406d5B70740ec) {
    +++ description: None
      name:
-        "Safe"
+        "Katana vaultBridge Multisig 1"
    }
```

```diff
    contract SuperchainConfig (0x2F439B95fa789C5d3a5C99cc70EB3ee83D08a811) {
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      template:
-        "opstack/SuperchainConfigFake"
+        "opstack/SuperchainConfigNoGuard"
      category.name:
-        "Governance"
+        "Spam"
      category.priority:
-        3
+        -1
    }
```

```diff
    contract vbUSDS (0x3DD459dE96F9C28e3a343b831cbDC2B93c8C4855) {
    +++ description: This token contract uses a standard 'vault bridge token' implementation created by Agglayer CDK. It keeps deposited assets in a vault and issues an IOU token (Vault Bridge USDS) which can be deposited to Agglayer. The underlying asset is generating yield, which does not accrue to the vbUSDS-IOU but is sent to 0x67C912fF560951526BffDff66dFbD4DF8AE23756.
      name:
-        "GenericVaultBridgeToken"
+        "vbUSDS"
      description:
+        "This token contract uses a standard 'vault bridge token' implementation created by Agglayer CDK. It keeps deposited assets in a vault and issues an IOU token (Vault Bridge USDS) which can be deposited to Agglayer. The underlying asset is generating yield, which does not accrue to the vbUSDS-IOU but is sent to 0x67C912fF560951526BffDff66dFbD4DF8AE23756."
      category:
+        {"name":"External Bridges","priority":1}
    }
```

```diff
-   Status: DELETED
    contract Accountant (0x40a87104AEb279C061Af6b7C48F7E08c4A6e388D)
    +++ description: None
```

```diff
    contract MigrationManager (0x417d01B64Ea30C4E163873f3a1f77b727c689e02) {
    +++ description: Helper contract for the vaultBridge tokens on Layer 2. If any vbTokens are minted 'natively' on Layer 2, this contract can receive the underlying assets and lock them in the Layer 1 vaults.
      description:
+        "Helper contract for the vaultBridge tokens on Layer 2. If any vbTokens are minted 'natively' on Layer 2, this contract can receive the underlying assets and lock them in the Layer 1 vaults."
      category:
+        {"name":"External Bridges","priority":1}
    }
```

```diff
-   Status: DELETED
    contract Katana Pre-Deposit USDT Token (0x48c03B6FfD0008460F8657Db1037C7e09dEedfcb)
    +++ description: None
```

```diff
    contract Katana Foundation Engineering/Security Multisig (0x4e981bAe8E3cd06Ca911ffFE5504B2653ac1C38a) {
    +++ description: None
      name:
-        "Katana Multisig 2"
+        "Katana Foundation Engineering/Security Multisig"
      receivedPermissions.0:
+        {"permission":"interact","from":"ethereum:0x100d3ca4f97776A40A7D93dB4AbF0FEA34230666","description":"change the op-succinct related verification keys (aggregationVkey, rangeVkeyCommitment) and the rollupConfigHash.","role":".aggchainManager"}
      receivedPermissions.0.description:
+        "toggle the 'optimisticMode'."
      receivedPermissions.0.role:
-        ".guardian"
+        ".optimisticModeManager"
      receivedPermissions.0.from:
-        "ethereum:0x2F439B95fa789C5d3a5C99cc70EB3ee83D08a811"
+        "ethereum:0x100d3ca4f97776A40A7D93dB4AbF0FEA34230666"
      receivedPermissions.0.permission:
-        "guard"
+        "interact"
    }
```

```diff
    contract vbUSDC (0x53E82ABbb12638F09d9e624578ccB666217a765e) {
    +++ description: This token contract uses a standard 'vault bridge token' implementation created by Agglayer CDK. It keeps deposited assets in a vault and issues an IOU token (Vault Bridge USDC) which can be deposited to Agglayer. The underlying asset is generating yield, which does not accrue to the vbUSDC-IOU but is sent to 0x67C912fF560951526BffDff66dFbD4DF8AE23756.
      name:
-        "GenericVaultBridgeToken"
+        "vbUSDC"
      description:
+        "This token contract uses a standard 'vault bridge token' implementation created by Agglayer CDK. It keeps deposited assets in a vault and issues an IOU token (Vault Bridge USDC) which can be deposited to Agglayer. The underlying asset is generating yield, which does not accrue to the vbUSDC-IOU but is sent to 0x67C912fF560951526BffDff66dFbD4DF8AE23756."
      category:
+        {"name":"External Bridges","priority":1}
    }
```

```diff
    contract MIPS (0x5fE03a12C1236F9C22Cb6479778DDAa4bce6299C) {
    +++ description: The MIPS contract is used to execute the final step of the dispute game which objectively determines the winner of the dispute.
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract Katana yieldRecipient Mulsitig (0x67C912fF560951526BffDff66dFbD4DF8AE23756) {
    +++ description: None
      name:
-        "Safe"
+        "Katana yieldRecipient Mulsitig"
    }
```

```diff
    contract vbUSDT (0x6d4f9f9f8f0155509ecd6Ac6c544fF27999845CC) {
    +++ description: This token contract uses a standard 'vault bridge token' implementation created by Agglayer CDK. It keeps deposited assets in a vault and issues an IOU token (Vault Bridge USDT) which can be deposited to Agglayer. The underlying asset is generating yield, which does not accrue to the vbUSDT-IOU but is sent to 0x67C912fF560951526BffDff66dFbD4DF8AE23756.
      name:
-        "GenericVaultBridgeToken"
+        "vbUSDT"
      description:
+        "This token contract uses a standard 'vault bridge token' implementation created by Agglayer CDK. It keeps deposited assets in a vault and issues an IOU token (Vault Bridge USDT) which can be deposited to Agglayer. The underlying asset is generating yield, which does not accrue to the vbUSDT-IOU but is sent to 0x67C912fF560951526BffDff66dFbD4DF8AE23756."
      category:
+        {"name":"External Bridges","priority":1}
    }
```

```diff
    contract DelayedWETH (0x74034597d29613CC8C0BDc8780e1d292A553Bd32) {
    +++ description: Contract designed to hold the bonded ETH for each game. It is designed as a wrapper around WETH to allow an owner to function as a backstop if a game would incorrectly distribute funds.
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
-   Status: DELETED
    contract Katana Pre-Deposit USDC Token (0x7B5A0182E400b241b317e781a4e9dEdFc1429822)
    +++ description: None
```

```diff
    contract Katana Steakhouse Financial / Morpho Multisig (0x827e86072B06674a077f592A531dcE4590aDeCdB) {
    +++ description: None
      name:
-        "Safe"
+        "Katana Steakhouse Financial / Morpho Multisig"
    }
```

```diff
-   Status: DELETED
    contract ShareReceiver (0x836304B832687f3811a0dF935934C724B40578eB)
    +++ description: None
```

```diff
-   Status: DELETED
    contract Katana Pre-Deposit WBTC Token (0x92C82f5F771F6A44CfA09357DD0575B81BF5F728)
    +++ description: None
```

```diff
    contract PreimageOracle (0x9c065e11870B891D214Bc2Da7EF1f9DDFA1BE277) {
    +++ description: The PreimageOracle contract is used to load the required data from L1 for a dispute game.
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract Polygon Labs Engineering/Security Multisig (0x9d851f8b8751c5FbC09b9E74E6e68E9950949052) {
    +++ description: None
      name:
-        "Polygon Multisig 2"
+        "Polygon Labs Engineering/Security Multisig"
    }
```

```diff
    contract OptimismMintableERC20Factory (0xA84C37cD0b9bA1B43276C11976DBE9d1344C7f4E) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract Katana vaultBridge Multisig 2 (0xA8C31B2edd84c654d06d626383f4154D1E40C5Ff) {
    +++ description: None
      name:
-        "Safe"
+        "Katana vaultBridge Multisig 2"
    }
```

```diff
-   Status: DELETED
    contract DepositRelayer (0xB01dADEC98308528ee57A17b24A473213c1704bb)
    +++ description: None
```

```diff
    EOA  (0xC1E65a0cEbF95f56Cd8729f7e37CB33eD94d6439) {
    +++ description: None
      receivedPermissions:
+        [{"permission":"interact","from":"ethereum:0x100d3ca4f97776A40A7D93dB4AbF0FEA34230666","description":"finalize any state root with only their signature.","role":".trustedSequencer","condition":"optimisticMode is enabled by the optimisticModeManager."}]
    }
```

```diff
-   Status: DELETED
    contract Katana Pre-Deposit WETH Token (0xcc6a16Be713f6a714f68b0E1f4914fD3db15fBeF)
    +++ description: None
```

```diff
-   Status: DELETED
    contract AllowanceModule (0xCFbFaC74C26F8647cBDb8c5caf80BB5b32E43134)
    +++ description: None
```

```diff
    contract Polygon Multisig 2 (0xd0673F989bc3BA9314d0AAF28BfC84e99B7898CC) {
    +++ description: None
      name:
-        "Safe"
+        "Polygon Multisig 2"
    }
```

```diff
-   Status: DELETED
    contract ERC20Router (0xeeeeee9eC4769A09a76A83C7bC42b185872860eE)
    +++ description: None
```

```diff
    contract Katana vaultBridge Multisig 3 (0xf4F2f5F6bAdBE05433C4604320ecC56BbECBC04E) {
    +++ description: None
      name:
-        "Katana Multisig"
+        "Katana vaultBridge Multisig 3"
    }
```

```diff
-   Status: DELETED
    contract Yearn Treasury Multisig (0xFEB4acf3df3cDEA7399794D0869ef76A6EfAff52)
    +++ description: None
```

Generated with discovered.json: 0x947fb3788d01d2f19ea5e0f4af048ad614ea9e24

# Diff at Tue, 01 Jul 2025 16:11:11 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@f7cc75f3e93efbba70ffb8d54f4aeceb76299220 block: 22816814
- current block number: 22825494

## Description

Predeposits ended (limit 0), chain is live.

add the AggchainFEP core contract of Katana.

move TVS to L2 configs.

## Watched changes

```diff
    contract Katana Pre-Deposit USDT Token (0x48c03B6FfD0008460F8657Db1037C7e09dEedfcb) {
    +++ description: None
      values.deposit_limit:
-        "115792089237316195423570985008687907853269984665640564039457584007913129639935"
+        0
      values.deposit_limit_module:
-        "0x793D85F585145c050487c7AfBF0e9B97143fF1CB"
+        "0x0000000000000000000000000000000000000000"
    }
```

```diff
-   Status: DELETED
    contract DepositModule (0x793D85F585145c050487c7AfBF0e9B97143fF1CB)
    +++ description: None
```

```diff
    contract Katana Pre-Deposit USDC Token (0x7B5A0182E400b241b317e781a4e9dEdFc1429822) {
    +++ description: None
      values.deposit_limit:
-        "115792089237316195423570985008687907853269984665640564039457584007913129639935"
+        0
      values.deposit_limit_module:
-        "0x793D85F585145c050487c7AfBF0e9B97143fF1CB"
+        "0x0000000000000000000000000000000000000000"
    }
```

```diff
    contract Katana Pre-Deposit WBTC Token (0x92C82f5F771F6A44CfA09357DD0575B81BF5F728) {
    +++ description: None
      values.deposit_limit:
-        "115792089237316195423570985008687907853269984665640564039457584007913129639935"
+        0
      values.deposit_limit_module:
-        "0x793D85F585145c050487c7AfBF0e9B97143fF1CB"
+        "0x0000000000000000000000000000000000000000"
    }
```

```diff
    contract Katana Pre-Deposit WETH Token (0xcc6a16Be713f6a714f68b0E1f4914fD3db15fBeF) {
    +++ description: None
      values.deposit_limit:
-        "115792089237316195423570985008687907853269984665640564039457584007913129639935"
+        0
      values.deposit_limit_module:
-        "0x793D85F585145c050487c7AfBF0e9B97143fF1CB"
+        "0x0000000000000000000000000000000000000000"
    }
```

```diff
+   Status: CREATED
    contract Safe (0x67C912fF560951526BffDff66dFbD4DF8AE23756)
    +++ description: None
```

## Source code changes

```diff
.../.flat@22816814/DepositModule.sol => /dev/null  |   76 --
 .../Safe.sol                                       | 1088 ++++++++++++++++++++
 .../SafeProxy.p.sol                                |   37 +
 3 files changed, 1125 insertions(+), 76 deletions(-)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22816814 (main branch discovery), not current.

```diff
+   Status: CREATED
    contract AggchainFEP (0x100d3ca4f97776A40A7D93dB4AbF0FEA34230666)
    +++ description: The main system contract defining the katana Layer 2 logic. As this contract is based on the OP-Succinct L2OutputOracle, OP stack outputRoots (L2 state roots) are saved here.
```

Generated with discovered.json: 0xb8798013ac6ee9c416ee1272bb9e516c63475f37

# Diff at Mon, 30 Jun 2025 11:04:12 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@8f38be1dac1da945211896720e26a33675aff71a block: 22794595
- current block number: 22816814

## Description

New owner / admin for the opstack contracts: tagged it katana multisig 2.

move project under review with activity, TVS.

## Watched changes

```diff
    contract ProxyAdmin (0x19DbD16f0a8e706D817B7e3b7bcF72917Ebb8832) {
    +++ description: None
      values.owner:
-        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
+        "0x4e981bAe8E3cd06Ca911ffFE5504B2653ac1C38a"
    }
```

```diff
    contract OptimismPortal2 (0x250D30c523104bf0a06825e7eAdE4Dc46EdfE40E) {
    +++ description: [PAUSED] The OptimismPortal contract is the main entry point to deposit funds from L1 to L2. It also allows to prove and finalize withdrawals. It specifies which game type can be used for withdrawals, which currently is the PermissionedDisputeGame. This specific fork of the standard contract **disables the depositTransaction() function**, which prevents users from sending or forcing any transactions from L1 to L2, including token deposits.
      values.guardian:
-        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
+        "0x4e981bAe8E3cd06Ca911ffFE5504B2653ac1C38a"
    }
```

```diff
    contract GenericVaultBridgeToken (0x2C24B57e2CCd1f273045Af6A5f632504C432374F) {
    +++ description: None
      values.accessControl.YIELD_COLLECTOR_ROLE.members.1:
+        "0xcB1e45481461aeF38E6B0a34F1444E9C5D647645"
    }
```

```diff
    contract VbETH (0x2DC70fb75b88d2eB4715bc06E1595E6D97c34DFF) {
    +++ description: None
      values.accessControl.YIELD_COLLECTOR_ROLE.members.1:
+        "0xcB1e45481461aeF38E6B0a34F1444E9C5D647645"
    }
```

```diff
    contract SuperchainConfig (0x2F439B95fa789C5d3a5C99cc70EB3ee83D08a811) {
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      values.$pastUpgrades.1:
+        ["2025-06-30T10:33:47.000Z","0x56f6765801bec01f9aa2a5c9750daada809b1f7a3f5343800c0b76c6308b4558",["0xd81f43eDBCAcb4c29a9bA38a13Ee5d79278270cC"]]
      values.$pastUpgrades.2:
+        ["2025-06-30T10:33:47.000Z","0x56f6765801bec01f9aa2a5c9750daada809b1f7a3f5343800c0b76c6308b4558",["0x838897A86Cb4F130D0eFC1203d7dA6D0db4bEd1A"]]
      values.$upgradeCount:
-        1
+        3
      values.guardian:
-        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
+        "0x4e981bAe8E3cd06Ca911ffFE5504B2653ac1C38a"
    }
```

```diff
    contract GenericVaultBridgeToken (0x3DD459dE96F9C28e3a343b831cbDC2B93c8C4855) {
    +++ description: None
      values.accessControl.YIELD_COLLECTOR_ROLE.members.1:
+        "0xcB1e45481461aeF38E6B0a34F1444E9C5D647645"
    }
```

```diff
    contract Conduit Multisig 1 (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      receivedPermissions:
-        [{"permission":"guard","from":"ethereum:0x2F439B95fa789C5d3a5C99cc70EB3ee83D08a811","role":".guardian"},{"permission":"interact","from":"ethereum:0x74034597d29613CC8C0BDc8780e1d292A553Bd32","description":"can pull funds from the contract in case of emergency.","role":".owner"},{"permission":"interact","from":"ethereum:0xb6e1f8B589A14B79DDD3aD7F0589AB548c70C174","description":"it can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system.","role":".owner"},{"permission":"interact","from":"ethereum:0xEaB94275eD336D80d4F46EA8Ea0427e351f11D65","description":"set and change address mappings.","role":".owner","via":[{"address":"ethereum:0x19DbD16f0a8e706D817B7e3b7bcF72917Ebb8832"}]},{"permission":"upgrade","from":"ethereum:0x15a32FCeA89617Ff450F094cDE102CCa46598B7F","role":"admin","via":[{"address":"ethereum:0x19DbD16f0a8e706D817B7e3b7bcF72917Ebb8832"}]},{"permission":"upgrade","from":"ethereum:0x2008A6Ba8CAF85AaFAe7880664Dfe681D533ac2E","role":"admin","via":[{"address":"ethereum:0x19DbD16f0a8e706D817B7e3b7bcF72917Ebb8832"}]},{"permission":"upgrade","from":"ethereum:0x250D30c523104bf0a06825e7eAdE4Dc46EdfE40E","role":"admin","via":[{"address":"ethereum:0x19DbD16f0a8e706D817B7e3b7bcF72917Ebb8832"}]},{"permission":"upgrade","from":"ethereum:0x2F439B95fa789C5d3a5C99cc70EB3ee83D08a811","role":"admin","via":[{"address":"ethereum:0x6d0ff67fb427422AfF35EEa8596949B374b09a52"}]},{"permission":"upgrade","from":"ethereum:0x74034597d29613CC8C0BDc8780e1d292A553Bd32","role":"admin","via":[{"address":"ethereum:0x19DbD16f0a8e706D817B7e3b7bcF72917Ebb8832"}]},{"permission":"upgrade","from":"ethereum:0x79ecD8d8040496014bcD3bA16AdF3914b23f8Fd5","role":"admin","via":[{"address":"ethereum:0x19DbD16f0a8e706D817B7e3b7bcF72917Ebb8832"}]},{"permission":"upgrade","from":"ethereum:0x98906C3f90A06B5484DD67bf32938815d2993dBC","description":"upgrading the bridge implementation can give access to all funds escrowed therein.","role":".$admin","via":[{"address":"ethereum:0x19DbD16f0a8e706D817B7e3b7bcF72917Ebb8832"}]},{"permission":"upgrade","from":"ethereum:0xA84C37cD0b9bA1B43276C11976DBE9d1344C7f4E","role":"admin","via":[{"address":"ethereum:0x19DbD16f0a8e706D817B7e3b7bcF72917Ebb8832"}]},{"permission":"upgrade","from":"ethereum:0xb6e1f8B589A14B79DDD3aD7F0589AB548c70C174","role":"admin","via":[{"address":"ethereum:0x19DbD16f0a8e706D817B7e3b7bcF72917Ebb8832"}]},{"permission":"upgrade","from":"ethereum:0xe06278351d120288eDfCB963F934113Ca3C21AFe","role":"admin","via":[{"address":"ethereum:0x19DbD16f0a8e706D817B7e3b7bcF72917Ebb8832"}]}]
      directlyReceivedPermissions:
-        [{"permission":"act","from":"ethereum:0x19DbD16f0a8e706D817B7e3b7bcF72917Ebb8832","role":".owner"},{"permission":"act","from":"ethereum:0x6d0ff67fb427422AfF35EEa8596949B374b09a52","role":".owner"}]
    }
```

```diff
    contract GenericVaultBridgeToken (0x53E82ABbb12638F09d9e624578ccB666217a765e) {
    +++ description: None
      values.accessControl.YIELD_COLLECTOR_ROLE.members.1:
+        "0xcB1e45481461aeF38E6B0a34F1444E9C5D647645"
    }
```

```diff
    contract ProxyAdmin (0x6d0ff67fb427422AfF35EEa8596949B374b09a52) {
    +++ description: None
      values.owner:
-        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
+        "0x4e981bAe8E3cd06Ca911ffFE5504B2653ac1C38a"
    }
```

```diff
    contract GenericVaultBridgeToken (0x6d4f9f9f8f0155509ecd6Ac6c544fF27999845CC) {
    +++ description: None
      values.accessControl.YIELD_COLLECTOR_ROLE.members.1:
+        "0xcB1e45481461aeF38E6B0a34F1444E9C5D647645"
    }
```

```diff
    contract DelayedWETH (0x74034597d29613CC8C0BDc8780e1d292A553Bd32) {
    +++ description: Contract designed to hold the bonded ETH for each game. It is designed as a wrapper around WETH to allow an owner to function as a backstop if a game would incorrectly distribute funds.
      values.owner:
-        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
+        "0x4e981bAe8E3cd06Ca911ffFE5504B2653ac1C38a"
    }
```

```diff
    contract Polygon Multisig 2 (0x9d851f8b8751c5FbC09b9E74E6e68E9950949052) {
    +++ description: None
      values.$threshold:
-        3
+        2
      values.multisigThreshold:
-        "3 of 5 (60%)"
+        "2 of 5 (40%)"
    }
```

```diff
    contract SystemConfig (0xb6e1f8B589A14B79DDD3aD7F0589AB548c70C174) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      values.owner:
-        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
+        "0x4e981bAe8E3cd06Ca911ffFE5504B2653ac1C38a"
    }
```

```diff
    contract DisputeGameFactory (0xe06278351d120288eDfCB963F934113Ca3C21AFe) {
    +++ description: The dispute game factory allows the creation of dispute games, used to propose state roots and eventually challenge them.
      values.owner:
-        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
+        "0x4e981bAe8E3cd06Ca911ffFE5504B2653ac1C38a"
    }
```

```diff
+   Status: CREATED
    contract Katana Multisig 2 (0x4e981bAe8E3cd06Ca911ffFE5504B2653ac1C38a)
    +++ description: None
```

## Source code changes

```diff
.../.flat/Katana Multisig 2/GnosisSafeL2.sol       | 1032 ++++++++++++++++++++
 .../.flat/Katana Multisig 2/GnosisSafeProxy.p.sol  |   35 +
 2 files changed, 1067 insertions(+)
```

Generated with discovered.json: 0x5d44d99b24dc098733acb03285b80b369e9280f8

# Diff at Fri, 27 Jun 2025 10:25:59 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@1aa90ee63be143107fba7087a30ac92d463e70f3 block: 22780105
- current block number: 22794595

## Description

found the opstack part of katana and some middleware between yearn, morpho and agglayer.

katana is using an OptiPortal2 that [denies all L1->L2 messages.](https://disco.l2beat.com/diff/eth:0x3Da872782f9fB696fD72Af2ec9313a56bDA6f06d/eth:0x9a6C2Dcc7e523f87716e17Ba36D10CCfFA0A60bb) It also does not have any state updates yet. The rest of the system is 'standard' opstack **with** custom gas token support (ETH is set atm, could only be changed with a major upgrade) and standard PermissionedDisputeGame without any games created. Notably this deployment also does not use the latest 7702 protections that the superchain does use.

behind its yearn vaults, katana seems to use a system of smart contracts written by polygon called vaultBridge. For each yielding asset, a vaultBridge contract (erc20 and vault standards) exists and a MigrationManager allows to migrate these derivative vbTokens to the lxly bridge (agglayer shared bridge), which has not happened yet. All user yields are currently accruing to three different Multisigs that have signers from Katana, Agglayer and Yearn (not sure abt morpho).

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22780105 (main branch discovery), not current.

```diff
    contract Yearn Treasury Multisig (0xFEB4acf3df3cDEA7399794D0869ef76A6EfAff52) {
    +++ description: None
      name:
-        "GnosisSafe"
+        "Yearn Treasury Multisig"
    }
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x14Be6579A41342ca6B402ec85E7be538e6Ade951)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1ERC721Bridge (0x15a32FCeA89617Ff450F094cDE102CCa46598B7F)
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
```

```diff
+   Status: CREATED
    contract Yearn Strategist Multisig (0x16388463d60FFE0661Cf7F1f31a7D658aC790ff7)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x19DbD16f0a8e706D817B7e3b7bcF72917Ebb8832)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1CrossDomainMessenger (0x2008A6Ba8CAF85AaFAe7880664Dfe681D533ac2E)
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
```

```diff
+   Status: CREATED
    contract OptimismPortal2 (0x250D30c523104bf0a06825e7eAdE4Dc46EdfE40E)
    +++ description: [PAUSED] The OptimismPortal contract is the main entry point to deposit funds from L1 to L2. It also allows to prove and finalize withdrawals. It specifies which game type can be used for withdrawals, which currently is the PermissionedDisputeGame. This specific fork of the standard contract **disables the depositTransaction() function**, which prevents users from sending or forcing any transactions from L1 to L2, including token deposits.
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x263b251D67BB154DD6b8352539466ACE7948ED56)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GenericVaultBridgeToken (0x2C24B57e2CCd1f273045Af6A5f632504C432374F)
    +++ description: None
```

```diff
+   Status: CREATED
    contract PermissionedDisputeGame (0x2d4B822F8B74AdE7fcD5F740967f4dFcD2fef5e4)
    +++ description: Same as FaultDisputeGame, but only two permissioned addresses are designated as proposer and challenger.
```

```diff
+   Status: CREATED
    contract VbETH (0x2DC70fb75b88d2eB4715bc06E1595E6D97c34DFF)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Safe (0x2De242e27386e224E5fbF110EA8406d5B70740ec)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SuperchainConfig (0x2F439B95fa789C5d3a5C99cc70EB3ee83D08a811)
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x377a9e5df2882DC1DF8A0bD162cbc640eA634010)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GenericVaultBridgeToken (0x3DD459dE96F9C28e3a343b831cbDC2B93c8C4855)
    +++ description: None
```

```diff
+   Status: CREATED
    contract MigrationManager (0x417d01B64Ea30C4E163873f3a1f77b727c689e02)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x420693B32113a0e00Eb9f3315D5D5ec3b32C2d69)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Conduit Multisig 1 (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GenericVaultBridgeToken (0x53E82ABbb12638F09d9e624578ccB666217a765e)
    +++ description: None
```

```diff
+   Status: CREATED
    contract MIPS (0x5fE03a12C1236F9C22Cb6479778DDAa4bce6299C)
    +++ description: The MIPS contract is used to execute the final step of the dispute game which objectively determines the winner of the dispute.
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x6d0ff67fb427422AfF35EEa8596949B374b09a52)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GenericVaultBridgeToken (0x6d4f9f9f8f0155509ecd6Ac6c544fF27999845CC)
    +++ description: None
```

```diff
+   Status: CREATED
    contract DelayedWETH (0x74034597d29613CC8C0BDc8780e1d292A553Bd32)
    +++ description: Contract designed to hold the bonded ETH for each game. It is designed as a wrapper around WETH to allow an owner to function as a backstop if a game would incorrectly distribute funds.
```

```diff
+   Status: CREATED
    contract AnchorStateRegistry (0x79ecD8d8040496014bcD3bA16AdF3914b23f8Fd5)
    +++ description: Contains the latest confirmed state root that can be used as a starting point in a dispute game.
```

```diff
+   Status: CREATED
    contract Safe (0x827e86072B06674a077f592A531dcE4590aDeCdB)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x8970650CF3f1E57cA804C65B4DBcFf698789FE30)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1StandardBridge (0x98906C3f90A06B5484DD67bf32938815d2993dBC)
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
```

```diff
+   Status: CREATED
    contract PreimageOracle (0x9c065e11870B891D214Bc2Da7EF1f9DDFA1BE277)
    +++ description: The PreimageOracle contract is used to load the required data from L1 for a dispute game.
```

```diff
+   Status: CREATED
    contract Polygon Multisig 2 (0x9d851f8b8751c5FbC09b9E74E6e68E9950949052)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OptimismMintableERC20Factory (0xA84C37cD0b9bA1B43276C11976DBE9d1344C7f4E)
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
```

```diff
+   Status: CREATED
    contract Safe (0xA8C31B2edd84c654d06d626383f4154D1E40C5Ff)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SystemConfig (0xb6e1f8B589A14B79DDD3aD7F0589AB548c70C174)
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
```

```diff
+   Status: CREATED
    contract Safe (0xd0673F989bc3BA9314d0AAF28BfC84e99B7898CC)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0xD1e389c046FB734D2a0c7C390312210c408ba832)
    +++ description: None
```

```diff
+   Status: CREATED
    contract DisputeGameFactory (0xe06278351d120288eDfCB963F934113Ca3C21AFe)
    +++ description: The dispute game factory allows the creation of dispute games, used to propose state roots and eventually challenge them.
```

```diff
+   Status: CREATED
    contract AddressManager (0xEaB94275eD336D80d4F46EA8Ea0427e351f11D65)
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
```

```diff
+   Status: CREATED
    contract Katana Multisig (0xf4F2f5F6bAdBE05433C4604320ecC56BbECBC04E)
    +++ description: None
```

Generated with discovered.json: 0xc999da8bc9ac1cc76b4b9adf54debc12d16c2c58

# Diff at Wed, 25 Jun 2025 07:57:08 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@4bade41aedf0f9269688f2c05f04d2992bb2ca38 block: 22637654
- current block number: 22780105

## Description

deposit limit removed for a deposit module governed by yearn strategist MS.

## Watched changes

```diff
    contract Katana Pre-Deposit USDT Token (0x48c03B6FfD0008460F8657Db1037C7e09dEedfcb) {
    +++ description: None
      values.deposit_limit:
-        250000000000000
+        "115792089237316195423570985008687907853269984665640564039457584007913129639935"
      values.deposit_limit_module:
-        "0x0000000000000000000000000000000000000000"
+        "0x793D85F585145c050487c7AfBF0e9B97143fF1CB"
    }
```

```diff
    contract Katana Pre-Deposit USDC Token (0x7B5A0182E400b241b317e781a4e9dEdFc1429822) {
    +++ description: None
      values.deposit_limit:
-        300000000000000
+        "115792089237316195423570985008687907853269984665640564039457584007913129639935"
      values.deposit_limit_module:
-        "0x0000000000000000000000000000000000000000"
+        "0x793D85F585145c050487c7AfBF0e9B97143fF1CB"
    }
```

```diff
    contract Katana Pre-Deposit WBTC Token (0x92C82f5F771F6A44CfA09357DD0575B81BF5F728) {
    +++ description: None
      values.deposit_limit:
-        250000000000
+        "115792089237316195423570985008687907853269984665640564039457584007913129639935"
      values.deposit_limit_module:
-        "0x0000000000000000000000000000000000000000"
+        "0x793D85F585145c050487c7AfBF0e9B97143fF1CB"
    }
```

```diff
    contract Katana Pre-Deposit WETH Token (0xcc6a16Be713f6a714f68b0E1f4914fD3db15fBeF) {
    +++ description: None
      values.deposit_limit:
-        "140000000000000000000000"
+        "115792089237316195423570985008687907853269984665640564039457584007913129639935"
      values.deposit_limit_module:
-        "0x0000000000000000000000000000000000000000"
+        "0x793D85F585145c050487c7AfBF0e9B97143fF1CB"
    }
```

```diff
+   Status: CREATED
    contract DepositModule (0x793D85F585145c050487c7AfBF0e9B97143fF1CB)
    +++ description: None
```

## Source code changes

```diff
.../katana/ethereum/.flat/DepositModule.sol        | 76 ++++++++++++++++++++++
 1 file changed, 76 insertions(+)
```

Generated with discovered.json: 0x26d0d44f72ced7546e79f24db5c69d9d2994af46

# Diff at Wed, 11 Jun 2025 10:34:59 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@9d1575fea6364921032f9ded0a049bdf9fc57604 block: 22637654
- current block number: 22637654

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22637654 (main branch discovery), not current.

```diff
    contract Katana Pre-Deposit USDT Token (0x48c03B6FfD0008460F8657Db1037C7e09dEedfcb) {
    +++ description: None
      sourceHashes.1:
+        "0x5d40986c3a1dd9125adfec96b4aec8a7336eb319d3c4cdde3e55bb1096c11461"
      proxyType:
-        "immutable"
+        "EIP1167 proxy"
      values.$immutable:
-        true
      values.$implementation:
+        "0xd8063123BBA3B480569244AE66BFE72B6c84b00d"
      implementationNames.0xd8063123BBA3B480569244AE66BFE72B6c84b00d:
+        "Yearn V3 Vault"
    }
```

```diff
    contract Katana Pre-Deposit USDC Token (0x7B5A0182E400b241b317e781a4e9dEdFc1429822) {
    +++ description: None
      sourceHashes.1:
+        "0x5d40986c3a1dd9125adfec96b4aec8a7336eb319d3c4cdde3e55bb1096c11461"
      proxyType:
-        "immutable"
+        "EIP1167 proxy"
      values.$immutable:
-        true
      values.$implementation:
+        "0xd8063123BBA3B480569244AE66BFE72B6c84b00d"
      implementationNames.0xd8063123BBA3B480569244AE66BFE72B6c84b00d:
+        "Yearn V3 Vault"
    }
```

```diff
    contract Katana Pre-Deposit WBTC Token (0x92C82f5F771F6A44CfA09357DD0575B81BF5F728) {
    +++ description: None
      sourceHashes.1:
+        "0x5d40986c3a1dd9125adfec96b4aec8a7336eb319d3c4cdde3e55bb1096c11461"
      proxyType:
-        "immutable"
+        "EIP1167 proxy"
      values.$immutable:
-        true
      values.$implementation:
+        "0xd8063123BBA3B480569244AE66BFE72B6c84b00d"
      implementationNames.0xd8063123BBA3B480569244AE66BFE72B6c84b00d:
+        "Yearn V3 Vault"
    }
```

```diff
    contract Katana Pre-Deposit WETH Token (0xcc6a16Be713f6a714f68b0E1f4914fD3db15fBeF) {
    +++ description: None
      sourceHashes.1:
+        "0x5d40986c3a1dd9125adfec96b4aec8a7336eb319d3c4cdde3e55bb1096c11461"
      proxyType:
-        "immutable"
+        "EIP1167 proxy"
      values.$immutable:
-        true
      values.$implementation:
+        "0xd8063123BBA3B480569244AE66BFE72B6c84b00d"
      implementationNames.0xd8063123BBA3B480569244AE66BFE72B6c84b00d:
+        "Yearn V3 Vault"
    }
```

Generated with discovered.json: 0x2f3417effe108cedcb2b9ccc6814066112393c08

# Diff at Thu, 05 Jun 2025 12:10:05 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- current block number: 22637654

## Description

initial katana predeposit disco.

## Initial discovery

```diff
+   Status: CREATED
    contract Accountant (0x40a87104AEb279C061Af6b7C48F7E08c4A6e388D)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Katana Pre-Deposit USDT Token (0x48c03B6FfD0008460F8657Db1037C7e09dEedfcb)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Katana Pre-Deposit USDC Token (0x7B5A0182E400b241b317e781a4e9dEdFc1429822)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ShareReceiver (0x836304B832687f3811a0dF935934C724B40578eB)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Katana Pre-Deposit WBTC Token (0x92C82f5F771F6A44CfA09357DD0575B81BF5F728)
    +++ description: None
```

```diff
+   Status: CREATED
    contract DepositRelayer (0xB01dADEC98308528ee57A17b24A473213c1704bb)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Katana Pre-Deposit WETH Token (0xcc6a16Be713f6a714f68b0E1f4914fD3db15fBeF)
    +++ description: None
```

```diff
+   Status: CREATED
    contract AllowanceModule (0xCFbFaC74C26F8647cBDb8c5caf80BB5b32E43134)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ERC20Router (0xeeeeee9eC4769A09a76A83C7bC42b185872860eE)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafe (0xFEB4acf3df3cDEA7399794D0869ef76A6EfAff52)
    +++ description: None
```
