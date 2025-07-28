Generated with discovered.json: 0xaa74771f9b0f9ccfddfd1a0fff6c0b9cd16b4806

# Diff at Fri, 25 Jul 2025 15:49:52 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@85b717d6efe0c0a7691beb49532a0ce49bb7634a block: 22975729
- current block number: 22994665

## Description

Conduit: Optiportal2 upgrade (permissioned gametype). All contracts are using standard implementations.

absolute prestate: v1.6.0 (cannon64) - does not use alt-DA commitments

standard 3.5; 3.5; 7 finality conf

## Watched changes

```diff
    contract L1CrossDomainMessenger (0x012c341506ee1939e56084F43Ae5dbCe224Ce2af) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      sourceHashes.1:
-        "0x1cc8a3b7de3d2c54c4706bb3f3015714d3b56647fc9fbfd6f8b068f5f63c1c25"
+        "0x03bcdc719cb7bd0a1377c01bb50b30a6122b308f673b7d7b15a3bb8628e6bd8c"
      values.$implementation:
-        "eth:0xD3494713A5cfaD3F5359379DfA074E2Ac8C6Fd65"
+        "eth:0x5D5a095665886119693F0B41d8DFeE78da033e8B"
      values.$pastUpgrades.6:
+        ["2025-07-24T14:34:11.000Z","0x4c2fcc2257cfc70f1217803fbd7d995137d19f0bd11bb6394247615d983de3bd",["eth:0x3eA6084748ED1b2A9B5D4426181F1ad8C93F6231"]]
      values.$pastUpgrades.7:
+        ["2025-07-24T14:34:11.000Z","0x4c2fcc2257cfc70f1217803fbd7d995137d19f0bd11bb6394247615d983de3bd",["eth:0x5D5a095665886119693F0B41d8DFeE78da033e8B"]]
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
    contract SystemConfig (0x0b4cfc49aCc656CE6D03CB0794860Da92bE3E8ec) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      sourceHashes.1:
-        "0xc7135dbd2a53312d36df3f3ee91ce0a5a459ab8fc7725880a3a9c55a5fa0ed6c"
+        "0x921de6fc906d159fdcef862d2b9559063f5e7b9b7588fa5f33153360ddf296e7"
      values.$implementation:
-        "eth:0xAB9d6cB7A427c0765163A7f45BB91cAfe5f2D375"
+        "eth:0x340f923E5c7cbB2171146f64169EC9d5a9FfE647"
      values.$pastUpgrades.4:
+        ["2025-07-24T14:34:11.000Z","0x4c2fcc2257cfc70f1217803fbd7d995137d19f0bd11bb6394247615d983de3bd",["eth:0xd81f43eDBCAcb4c29a9bA38a13Ee5d79278270cC"]]
      values.$pastUpgrades.5:
+        ["2025-07-24T14:34:11.000Z","0x4c2fcc2257cfc70f1217803fbd7d995137d19f0bd11bb6394247615d983de3bd",["eth:0xAB9d6cB7A427c0765163A7f45BB91cAfe5f2D375"]]
      values.$pastUpgrades.6:
+        ["2025-07-24T14:34:11.000Z","0x4c2fcc2257cfc70f1217803fbd7d995137d19f0bd11bb6394247615d983de3bd",["eth:0x760C48C62A85045A6B69f07F4a9f22868659CbCc"]]
      values.$pastUpgrades.7:
+        ["2025-07-24T14:34:11.000Z","0x4c2fcc2257cfc70f1217803fbd7d995137d19f0bd11bb6394247615d983de3bd",["eth:0x340f923E5c7cbB2171146f64169EC9d5a9FfE647"]]
      values.$upgradeCount:
-        4
+        8
      values.basefeeScalar:
-        0
+        68400
      values.disputeGameFactory:
-        "eth:0x0000000000000000000000000000000000000000"
+        "eth:0x3CEa4B383D855208f5d06e5b1A602E4006a1d0E1"
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
+        {"l1CrossDomainMessenger":"eth:0x012c341506ee1939e56084F43Ae5dbCe224Ce2af","l1ERC721Bridge":"eth:0xd5e3eDf5b68135D559D572E26bF863FBC1950033","l1StandardBridge":"eth:0x12d4E64E1B46d27A00fe392653A894C1dd36fb80","disputeGameFactory":"eth:0x3CEa4B383D855208f5d06e5b1A602E4006a1d0E1","optimismPortal":"eth:0x639F2AECE398Aa76b07e59eF6abe2cFe32bacb68","optimismMintableERC20Factory":"eth:0xF2b7b677d14F4F570D084d7d615254F984e7089E"}
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
    contract L1StandardBridge (0x12d4E64E1B46d27A00fe392653A894C1dd36fb80) {
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
    contract Ancient8GuardianMultisig (0x1B1ecDdbd5F9601b34262Aa3Ca346209E61aA68f)
    +++ description: None
```

```diff
    contract Conduit Multisig 1 (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      receivedPermissions.0:
+        {"permission":"challenge","from":"eth:0xF91357dCa2abDB3388600792d51CAe6644632Cd5","role":".challenger"}
      receivedPermissions.1:
-        {"permission":"guard","from":"eth:0x639F2AECE398Aa76b07e59eF6abe2cFe32bacb68","role":".guardian"}
      receivedPermissions.2:
-        {"permission":"guard","from":"eth:0x639F2AECE398Aa76b07e59eF6abe2cFe32bacb68","role":".GUARDIAN"}
      receivedPermissions.4:
+        {"permission":"interact","from":"eth:0x7b4F80Bf01b0Dc86C08C55d8AfC1F5535fA925db","description":"can pull funds from the contract in case of emergency.","role":".owner"}
      receivedPermissions.9:
+        {"permission":"upgrade","from":"eth:0x3CEa4B383D855208f5d06e5b1A602E4006a1d0E1","role":"admin","via":[{"address":"eth:0x75a223Fb459461B9Fa61dd25109EA05522b4b492"}]}
      receivedPermissions.10.from:
-        "eth:0xB09DC08428C8b4EFB4ff9C0827386CDF34277996"
+        "eth:0x7b4F80Bf01b0Dc86C08C55d8AfC1F5535fA925db"
      receivedPermissions.13:
+        {"permission":"upgrade","from":"eth:0xd5FeaB771AD626fA33ceE0423Aa0DCF05C13b5C6","role":"admin","via":[{"address":"eth:0x75a223Fb459461B9Fa61dd25109EA05522b4b492"}]}
    }
```

```diff
    contract OptimismPortal2 (0x639F2AECE398Aa76b07e59eF6abe2cFe32bacb68) {
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
+        ["2025-07-24T14:34:11.000Z","0x4c2fcc2257cfc70f1217803fbd7d995137d19f0bd11bb6394247615d983de3bd",["eth:0xd81f43eDBCAcb4c29a9bA38a13Ee5d79278270cC"]]
      values.$pastUpgrades.4:
+        ["2025-07-24T14:34:11.000Z","0x4c2fcc2257cfc70f1217803fbd7d995137d19f0bd11bb6394247615d983de3bd",["eth:0xe2F826324b2faf99E513D16D266c3F80aE87832B"]]
      values.$pastUpgrades.5:
+        ["2025-07-24T14:34:11.000Z","0x4c2fcc2257cfc70f1217803fbd7d995137d19f0bd11bb6394247615d983de3bd",["eth:0x2D7e764a0D9919e16983a46595CfA81fc34fa7Cd"]]
      values.$pastUpgrades.6:
+        ["2025-07-24T14:34:11.000Z","0x4c2fcc2257cfc70f1217803fbd7d995137d19f0bd11bb6394247615d983de3bd",["eth:0xB443Da3e07052204A02d630a8933dAc05a0d6fB4"]]
      values.$upgradeCount:
-        3
+        7
      values.GUARDIAN:
-        "eth:0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      values.L2_ORACLE:
-        "eth:0xB09DC08428C8b4EFB4ff9C0827386CDF34277996"
      values.l2Oracle:
-        "eth:0xB09DC08428C8b4EFB4ff9C0827386CDF34277996"
      values.SYSTEM_CONFIG:
-        "eth:0x0b4cfc49aCc656CE6D03CB0794860Da92bE3E8ec"
      values.version:
-        "2.5.0"
+        "3.14.0"
      values.disputeGameFactory:
+        "eth:0x3CEa4B383D855208f5d06e5b1A602E4006a1d0E1"
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
+        1753367651
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
    contract ProxyAdmin (0x75a223Fb459461B9Fa61dd25109EA05522b4b492) {
    +++ description: None
      directlyReceivedPermissions.4:
+        {"permission":"upgrade","from":"eth:0x3CEa4B383D855208f5d06e5b1A602E4006a1d0E1","role":"admin"}
      directlyReceivedPermissions.5.from:
-        "eth:0xB09DC08428C8b4EFB4ff9C0827386CDF34277996"
+        "eth:0x7b4F80Bf01b0Dc86C08C55d8AfC1F5535fA925db"
      directlyReceivedPermissions.8:
+        {"permission":"upgrade","from":"eth:0xd5FeaB771AD626fA33ceE0423Aa0DCF05C13b5C6","role":"admin"}
    }
```

```diff
    EOA  (0xAF24199C29D5cc3fd298356137913A42847eA690) {
    +++ description: None
      receivedPermissions.0:
-        {"permission":"propose","from":"eth:0xB09DC08428C8b4EFB4ff9C0827386CDF34277996","role":".proposer"}
      receivedPermissions.1.role:
-        ".PROPOSER"
+        ".proposer"
      receivedPermissions.1.from:
-        "eth:0xB09DC08428C8b4EFB4ff9C0827386CDF34277996"
+        "eth:0xF91357dCa2abDB3388600792d51CAe6644632Cd5"
    }
```

```diff
-   Status: DELETED
    contract L2OutputOracle (0xB09DC08428C8b4EFB4ff9C0827386CDF34277996)
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
```

```diff
    contract L1ERC721Bridge (0xd5e3eDf5b68135D559D572E26bF863FBC1950033) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      sourceHashes.1:
-        "0x482ec6e91304ac39a3fb4505634427bddfddee23b8e93a4f7f995ca5083ae3c3"
+        "0x28669b49da3effd51f0f9424ca9cdd455c5b9327c09a40c65fc06f114a6eb837"
      values.$implementation:
-        "eth:0xAE2AF01232a6c4a4d3012C5eC5b1b35059caF10d"
+        "eth:0x7aE1d3BD877a4C5CA257404ce26BE93A02C98013"
      values.$pastUpgrades.5:
+        ["2025-07-24T14:34:11.000Z","0x4c2fcc2257cfc70f1217803fbd7d995137d19f0bd11bb6394247615d983de3bd",["eth:0x276d3730f219f7ec22274f7263180b8452B46d47"]]
      values.$pastUpgrades.6:
+        ["2025-07-24T14:34:11.000Z","0x4c2fcc2257cfc70f1217803fbd7d995137d19f0bd11bb6394247615d983de3bd",["eth:0x7aE1d3BD877a4C5CA257404ce26BE93A02C98013"]]
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
    contract OptimismMintableERC20Factory (0xF2b7b677d14F4F570D084d7d615254F984e7089E) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintableERC20 as this chain's representation of a token on the host chain, or vice-versa.
      sourceHashes.1:
-        "0x4c5ac4e53576924cabbd2a471f368a541bc3f4b1f53fa41a389692fcc62f6176"
+        "0x9650b4bba6299e410f01a369a95a2c57e1c3ca35f0d80c13f4f59fc468f370e5"
      values.$implementation:
-        "eth:0xE01efbeb1089D1d1dB9c6c8b135C934C0734c846"
+        "eth:0x5493f4677A186f64805fe7317D6993ba4863988F"
      values.$pastUpgrades.4:
+        ["2025-07-24T14:34:11.000Z","0x4c2fcc2257cfc70f1217803fbd7d995137d19f0bd11bb6394247615d983de3bd",["eth:0x5493f4677A186f64805fe7317D6993ba4863988F"]]
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
+   Status: CREATED
    contract PreimageOracle (0x1fb8cdFc6831fc866Ed9C51aF8817Da5c287aDD3)
    +++ description: The PreimageOracle contract is used to load the required data from L1 for a dispute game.
```

```diff
+   Status: CREATED
    contract DisputeGameFactory (0x3CEa4B383D855208f5d06e5b1A602E4006a1d0E1)
    +++ description: The dispute game factory allows the creation of dispute games, used to propose state roots and eventually challenge them.
```

```diff
+   Status: CREATED
    contract DelayedWETH (0x7b4F80Bf01b0Dc86C08C55d8AfC1F5535fA925db)
    +++ description: Contract designed to hold the bonded ETH for each game. It is designed as a wrapper around WETH to allow an owner to function as a backstop if a game would incorrectly distribute funds.
```

```diff
+   Status: CREATED
    contract AnchorStateRegistry (0xd5FeaB771AD626fA33ceE0423Aa0DCF05C13b5C6)
    +++ description: Contains the latest confirmed state root that can be used as a starting point in a dispute game.
```

```diff
+   Status: CREATED
    contract MIPS (0xF027F4A985560fb13324e943edf55ad6F1d15Dc1)
    +++ description: The MIPS contract is used to execute the final step of the dispute game which objectively determines the winner of the dispute.
```

```diff
+   Status: CREATED
    contract PermissionedDisputeGame (0xF91357dCa2abDB3388600792d51CAe6644632Cd5)
    +++ description: Same as FaultDisputeGame, but only two permissioned addresses are designated as proposer and challenger.
```

## Source code changes

```diff
.../AnchorStateRegistry/AnchorStateRegistry.sol    |  568 +++
 .../ethereum/.flat/AnchorStateRegistry/Proxy.p.sol |  200 +
 .../GnosisSafe.sol => /dev/null                    |  953 -----
 .../GnosisSafeProxy.p.sol => /dev/null             |   35 -
 .../ethereum/.flat/DelayedWETH/DelayedWETH.sol     |  608 +++
 .../ancient/ethereum/.flat/DelayedWETH/Proxy.p.sol |  200 +
 .../DisputeGameFactory/DisputeGameFactory.sol      | 1482 +++++++
 .../ethereum/.flat/DisputeGameFactory/Proxy.p.sol  |  200 +
 .../L1CrossDomainMessenger.sol                     |  736 +++-
 .../L1ERC721Bridge.sol                             |  418 +-
 .../L1StandardBridge/L1StandardBridge.sol          |  508 ++-
 .../L2OutputOracle/L2OutputOracle.sol => /dev/null |  679 ----
 .../src/projects/ancient/ethereum/.flat/MIPS.sol   | 2515 ++++++++++++
 .../OptimismMintableERC20Factory.sol               |   30 +-
 .../OptimismPortal/Proxy.p.sol => /dev/null        |  211 -
 .../OptimismPortal2/OptimismPortal2.sol}           |  926 +++--
 .../OptimismPortal2}/Proxy.p.sol                   |    0
 .../ethereum/.flat/PermissionedDisputeGame.sol     | 4121 ++++++++++++++++++++
 .../ancient/ethereum/.flat/PreimageOracle.sol      | 1311 +++++++
 .../SystemConfig/SystemConfig.sol                  | 1439 +------
 20 files changed, 13121 insertions(+), 4019 deletions(-)
```

Generated with discovered.json: 0xda962954671dcf7bfdb3eae2ddd6259097092db1

# Diff at Tue, 22 Jul 2025 15:52:32 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@83bf55f537ce86d3d1dac9f1a98f31f9169b801f block: 22895933
- current block number: 22975729

## Description

Conduit: Upgrade to known OP stack contracts. (no OptiPortal2 yet)

## Watched changes

```diff
    contract L1CrossDomainMessenger (0x012c341506ee1939e56084F43Ae5dbCe224Ce2af) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      sourceHashes.1:
-        "0xebfb36a18bcaa176678925149b43fdc5f9f943d98a6405ae1cbc26f4c168ff88"
+        "0x1cc8a3b7de3d2c54c4706bb3f3015714d3b56647fc9fbfd6f8b068f5f63c1c25"
      values.$implementation:
-        "eth:0x09A25EB69b0d2858800A769Da90934371C7174A9"
+        "eth:0xD3494713A5cfaD3F5359379DfA074E2Ac8C6Fd65"
      values.$pastUpgrades.2:
+        ["2025-07-21T13:41:23.000Z","0x9d384450c51cc1bbafd0da905e3e35a202a26fa9f4fb87a3cb93a6a77929fd76",["eth:0x6322C2f2D6a4305Fc033754d486A5A067Ee5F9b1"]]
      values.$pastUpgrades.3:
+        ["2025-07-21T13:41:23.000Z","0x9d384450c51cc1bbafd0da905e3e35a202a26fa9f4fb87a3cb93a6a77929fd76",["eth:0xD3494713A5cfaD3F5359379DfA074E2Ac8C6Fd65"]]
      values.$pastUpgrades.4:
+        ["2025-07-21T14:46:59.000Z","0xf23b31efc9e9dc5fc5c4a2f8a52b039811055b464b9a99ee48c5241f79fbf900",["eth:0xd81f43eDBCAcb4c29a9bA38a13Ee5d79278270cC"]]
      values.$pastUpgrades.5:
+        ["2025-07-21T14:46:59.000Z","0xf23b31efc9e9dc5fc5c4a2f8a52b039811055b464b9a99ee48c5241f79fbf900",["eth:0xD3494713A5cfaD3F5359379DfA074E2Ac8C6Fd65"]]
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
+        "eth:0x639F2AECE398Aa76b07e59eF6abe2cFe32bacb68"
      values.superchainConfig:
+        "eth:0x097f99768A0a4a0A81bAbbCB1ea18193bA9D53cC"
      implementationNames.eth:0x09A25EB69b0d2858800A769Da90934371C7174A9:
-        "L1CrossDomainMessenger"
      implementationNames.eth:0xD3494713A5cfaD3F5359379DfA074E2Ac8C6Fd65:
+        "L1CrossDomainMessenger"
    }
```

```diff
    contract SystemConfig (0x0b4cfc49aCc656CE6D03CB0794860Da92bE3E8ec) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      sourceHashes.1:
-        "0x29908eb7685943ff431cd384af851ce36a30997bbad880f9b4385bfc3abb86a2"
+        "0xc7135dbd2a53312d36df3f3ee91ce0a5a459ab8fc7725880a3a9c55a5fa0ed6c"
      values.$implementation:
-        "eth:0x188370729584052260214A6e0847B9810e3a120d"
+        "eth:0xAB9d6cB7A427c0765163A7f45BB91cAfe5f2D375"
      values.$pastUpgrades.1:
+        ["2025-07-21T13:41:23.000Z","0x9d384450c51cc1bbafd0da905e3e35a202a26fa9f4fb87a3cb93a6a77929fd76",["eth:0x6322C2f2D6a4305Fc033754d486A5A067Ee5F9b1"]]
      values.$pastUpgrades.2:
+        ["2025-07-21T13:41:23.000Z","0x9d384450c51cc1bbafd0da905e3e35a202a26fa9f4fb87a3cb93a6a77929fd76",["eth:0xba2492e52F45651B60B8B38d4Ea5E2390C64Ffb1"]]
      values.$pastUpgrades.3:
+        ["2025-07-21T14:46:59.000Z","0xf23b31efc9e9dc5fc5c4a2f8a52b039811055b464b9a99ee48c5241f79fbf900",["eth:0xAB9d6cB7A427c0765163A7f45BB91cAfe5f2D375"]]
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
+        "eth:0xd5df46c580fD2FBdaEE751dc535E14295C0336F3"
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
+        "eth:0x012c341506ee1939e56084F43Ae5dbCe224Ce2af"
      values.l1ERC721Bridge:
+        "eth:0xd5e3eDf5b68135D559D572E26bF863FBC1950033"
      values.l1StandardBridge:
+        "eth:0x12d4E64E1B46d27A00fe392653A894C1dd36fb80"
      values.maximumGasLimit:
+        200000000
      values.OPTIMISM_MINTABLE_ERC20_FACTORY_SLOT:
+        "0xa04c5bb938ca6fc46d95553abf0a76345ce3e722a30bf4f74928b8e7d852320c"
      values.OPTIMISM_PORTAL_SLOT:
+        "0x4b6c74f9e688cb39801f2112c14a8c57232a3fc5202e1444126d4bce86eb19ac"
      values.optimismMintableERC20Factory:
+        "eth:0xF2b7b677d14F4F570D084d7d615254F984e7089E"
      values.optimismPortal:
+        "eth:0x639F2AECE398Aa76b07e59eF6abe2cFe32bacb68"
      values.START_BLOCK_SLOT:
+        "0xa11ee3ab75b40e88a0105e935d17cd36c8faee0138320d776c411291bdbbb19f"
      values.startBlock:
+        19070571
      implementationNames.eth:0x188370729584052260214A6e0847B9810e3a120d:
-        "SystemConfig"
      implementationNames.eth:0xAB9d6cB7A427c0765163A7f45BB91cAfe5f2D375:
+        "SystemConfig"
    }
```

```diff
    contract L1StandardBridge (0x12d4E64E1B46d27A00fe392653A894C1dd36fb80) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      sourceHashes.1:
-        "0x79abdbd90460fe2ac0535b5cb7b4c45284322b49a0a090d1c509cdaf35dbc87e"
+        "0x1010ff7f40ab4d53e6d9996aefa04423dabe9d0e22fac2d02b330ed3aa2c5740"
      values.$implementation:
-        "eth:0x2362ff553A9E66bf378E971b2AAa631A4570b53d"
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
      implementationNames.eth:0x2362ff553A9E66bf378E971b2AAa631A4570b53d:
-        "L1StandardBridge"
      implementationNames.eth:0x64B5a5Ed26DCb17370Ff4d33a8D503f0fbD06CfF:
+        "L1StandardBridge"
    }
```

```diff
    contract Ancient8GuardianMultisig (0x1B1ecDdbd5F9601b34262Aa3Ca346209E61aA68f) {
    +++ description: None
      receivedPermissions.0:
+        {"permission":"challenge","from":"eth:0xB09DC08428C8b4EFB4ff9C0827386CDF34277996","role":".challenger"}
      receivedPermissions.1:
-        {"permission":"guard","from":"eth:0x639F2AECE398Aa76b07e59eF6abe2cFe32bacb68","role":".GUARDIAN"}
    }
```

```diff
    contract Conduit Multisig 1 (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      receivedPermissions.0:
+        {"permission":"guard","from":"eth:0x097f99768A0a4a0A81bAbbCB1ea18193bA9D53cC","role":".guardian"}
      receivedPermissions.1:
+        {"permission":"guard","from":"eth:0x639F2AECE398Aa76b07e59eF6abe2cFe32bacb68","role":".guardian"}
      receivedPermissions.2:
+        {"permission":"guard","from":"eth:0x639F2AECE398Aa76b07e59eF6abe2cFe32bacb68","role":".GUARDIAN"}
      receivedPermissions.6:
+        {"permission":"upgrade","from":"eth:0x097f99768A0a4a0A81bAbbCB1ea18193bA9D53cC","role":"admin","via":[{"address":"eth:0xb4899FF43Ae727B1E9CB19AC44660e4A43Fad0b5"}]}
      receivedPermissions.12:
+        {"permission":"upgrade","from":"eth:0xF2b7b677d14F4F570D084d7d615254F984e7089E","role":"admin","via":[{"address":"eth:0x75a223Fb459461B9Fa61dd25109EA05522b4b492"}]}
      directlyReceivedPermissions.1:
+        {"permission":"act","from":"eth:0xb4899FF43Ae727B1E9CB19AC44660e4A43Fad0b5","role":".owner"}
    }
```

```diff
    contract OptimismPortal (0x639F2AECE398Aa76b07e59eF6abe2cFe32bacb68) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      sourceHashes.1:
-        "0xd7fe53899c31d6d8e73b6724694736dc3c3c4ebc8f4ddbe989fe9d3dba26692d"
+        "0xe35fb7bc0433439337b3eadda3d6fb7991918162f62a337a695e8c7f948cdd35"
      values.$implementation:
-        "eth:0x9FC6A608B45c6F129650c26a34bbe5d26959E75e"
+        "eth:0x2D778797049FE9259d947D1ED8e5442226dFB589"
      values.$pastUpgrades.1:
+        ["2025-07-21T13:41:23.000Z","0x9d384450c51cc1bbafd0da905e3e35a202a26fa9f4fb87a3cb93a6a77929fd76",["eth:0x6322C2f2D6a4305Fc033754d486A5A067Ee5F9b1"]]
      values.$pastUpgrades.2:
+        ["2025-07-21T13:41:23.000Z","0x9d384450c51cc1bbafd0da905e3e35a202a26fa9f4fb87a3cb93a6a77929fd76",["eth:0x2D778797049FE9259d947D1ED8e5442226dFB589"]]
      values.$upgradeCount:
-        1
+        3
      values.GUARDIAN:
-        "eth:0x1B1ecDdbd5F9601b34262Aa3Ca346209E61aA68f"
+        "eth:0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      values.version:
-        "1.7.2"
+        "2.5.0"
      values.guardian:
+        "eth:0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      values.l2Oracle:
+        "eth:0xB09DC08428C8b4EFB4ff9C0827386CDF34277996"
      values.superchainConfig:
+        "eth:0x097f99768A0a4a0A81bAbbCB1ea18193bA9D53cC"
      values.systemConfig:
+        "eth:0x0b4cfc49aCc656CE6D03CB0794860Da92bE3E8ec"
      implementationNames.eth:0x9FC6A608B45c6F129650c26a34bbe5d26959E75e:
-        "OptimismPortal"
      implementationNames.eth:0x2D778797049FE9259d947D1ED8e5442226dFB589:
+        "OptimismPortal"
    }
```

```diff
    contract ProxyAdmin (0x75a223Fb459461B9Fa61dd25109EA05522b4b492) {
    +++ description: None
      directlyReceivedPermissions.7:
+        {"permission":"upgrade","from":"eth:0xF2b7b677d14F4F570D084d7d615254F984e7089E","role":"admin"}
    }
```

```diff
    EOA  (0xAF24199C29D5cc3fd298356137913A42847eA690) {
    +++ description: None
      receivedPermissions.0:
+        {"permission":"propose","from":"eth:0xB09DC08428C8b4EFB4ff9C0827386CDF34277996","role":".proposer"}
    }
```

```diff
    contract L2OutputOracle (0xB09DC08428C8b4EFB4ff9C0827386CDF34277996) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      sourceHashes.1:
-        "0xcca8986d0789aa489ba57cd234e886bd92cb5a0d477e1f5ae5e6e030e15fb183"
+        "0x025c187b0231be4785898f25f98d749f953f5d06781772aef242812e2ecf52e3"
      values.$implementation:
-        "eth:0x1F61619E8c228fb67204cD157A3e50Aa6690FbF6"
+        "eth:0xF243BEd163251380e78068d317ae10f26042B292"
      values.$pastUpgrades.1:
+        ["2025-07-21T13:41:23.000Z","0x9d384450c51cc1bbafd0da905e3e35a202a26fa9f4fb87a3cb93a6a77929fd76",["eth:0x6322C2f2D6a4305Fc033754d486A5A067Ee5F9b1"]]
      values.$pastUpgrades.2:
+        ["2025-07-21T13:41:23.000Z","0x9d384450c51cc1bbafd0da905e3e35a202a26fa9f4fb87a3cb93a6a77929fd76",["eth:0xF243BEd163251380e78068d317ae10f26042B292"]]
      values.$upgradeCount:
-        1
+        3
      values.version:
-        "1.3.1"
+        "1.8.0"
+++ severity: HIGH
      values.challenger:
+        "eth:0x1B1ecDdbd5F9601b34262Aa3Ca346209E61aA68f"
      values.finalizationPeriodSeconds:
+        604800
      values.l2BlockTime:
+        2
+++ severity: HIGH
      values.proposer:
+        "eth:0xAF24199C29D5cc3fd298356137913A42847eA690"
      values.submissionInterval:
+        1800
      implementationNames.eth:0x1F61619E8c228fb67204cD157A3e50Aa6690FbF6:
-        "L2OutputOracle"
      implementationNames.eth:0xF243BEd163251380e78068d317ae10f26042B292:
+        "L2OutputOracle"
    }
```

```diff
    contract L1ERC721Bridge (0xd5e3eDf5b68135D559D572E26bF863FBC1950033) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      sourceHashes.1:
-        "0x95c690f70db8f82a05347087d704333c180048757ff015d74a5b186c1b6b24ab"
+        "0x482ec6e91304ac39a3fb4505634427bddfddee23b8e93a4f7f995ca5083ae3c3"
      values.$implementation:
-        "eth:0x132b3456300332d488f946B818eB9512931eBCAa"
+        "eth:0xAE2AF01232a6c4a4d3012C5eC5b1b35059caF10d"
      values.$pastUpgrades.1:
+        ["2025-07-21T13:41:23.000Z","0x9d384450c51cc1bbafd0da905e3e35a202a26fa9f4fb87a3cb93a6a77929fd76",["eth:0x6322C2f2D6a4305Fc033754d486A5A067Ee5F9b1"]]
      values.$pastUpgrades.2:
+        ["2025-07-21T13:41:23.000Z","0x9d384450c51cc1bbafd0da905e3e35a202a26fa9f4fb87a3cb93a6a77929fd76",["eth:0xAE2AF01232a6c4a4d3012C5eC5b1b35059caF10d"]]
      values.$pastUpgrades.3:
+        ["2025-07-21T14:46:59.000Z","0xf23b31efc9e9dc5fc5c4a2f8a52b039811055b464b9a99ee48c5241f79fbf900",["eth:0xd81f43eDBCAcb4c29a9bA38a13Ee5d79278270cC"]]
      values.$pastUpgrades.4:
+        ["2025-07-21T14:46:59.000Z","0xf23b31efc9e9dc5fc5c4a2f8a52b039811055b464b9a99ee48c5241f79fbf900",["eth:0xAE2AF01232a6c4a4d3012C5eC5b1b35059caF10d"]]
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
      implementationNames.eth:0x132b3456300332d488f946B818eB9512931eBCAa:
-        "L1ERC721Bridge"
      implementationNames.eth:0xAE2AF01232a6c4a4d3012C5eC5b1b35059caF10d:
+        "L1ERC721Bridge"
    }
```

```diff
+   Status: CREATED
    contract SuperchainConfig (0x097f99768A0a4a0A81bAbbCB1ea18193bA9D53cC)
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0xb4899FF43Ae727B1E9CB19AC44660e4A43Fad0b5)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OptimismMintableERC20Factory (0xF2b7b677d14F4F570D084d7d615254F984e7089E)
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintableERC20 as this chain's representation of a token on the host chain, or vice-versa.
```

## Source code changes

```diff
.../L1CrossDomainMessenger.sol                     | 1654 +++++++---------
 .../L1ERC721Bridge.sol                             |  611 +++---
 .../L1StandardBridge/L1StandardBridge.sol          | 1431 +++++++-------
 .../L2OutputOracle/L2OutputOracle.sol              |  548 ++----
 .../OptimismMintableERC20Factory.sol               |  427 ++++
 .../.flat/OptimismMintableERC20Factory/Proxy.p.sol |  211 ++
 .../OptimismPortal/OptimismPortal.sol              | 1336 +++++--------
 ...0x75a223Fb459461B9Fa61dd25109EA05522b4b492.sol} |    0
 ...:0xb4899FF43Ae727B1E9CB19AC44660e4A43Fad0b5.sol |  298 +++
 .../ethereum/.flat/SuperchainConfig/Proxy.p.sol    |  200 ++
 .../.flat/SuperchainConfig/SuperchainConfig.sol    |  477 +++++
 .../SystemConfig/SystemConfig.sol                  | 2034 +++++++++++++++++---
 12 files changed, 5840 insertions(+), 3387 deletions(-)
```

Generated with discovered.json: 0x32e70ff6d96121b9a0185100e3d6911e4ce7939a

# Diff at Mon, 14 Jul 2025 12:44:43 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@9f4300dad2f3d080cd56fa311d4a848556c74e72 block: 22895933
- current block number: 22895933

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22895933 (main branch discovery), not current.

```diff
    EOA  (0x000000000000000000000000000000000000dEaD) {
    +++ description: None
      address:
-        "0x000000000000000000000000000000000000dEaD"
+        "eth:0x000000000000000000000000000000000000dEaD"
    }
```

```diff
    contract L1CrossDomainMessenger (0x012c341506ee1939e56084F43Ae5dbCe224Ce2af) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      address:
-        "0x012c341506ee1939e56084F43Ae5dbCe224Ce2af"
+        "eth:0x012c341506ee1939e56084F43Ae5dbCe224Ce2af"
      values.$admin:
-        "0x75a223Fb459461B9Fa61dd25109EA05522b4b492"
+        "eth:0x75a223Fb459461B9Fa61dd25109EA05522b4b492"
      values.$implementation:
-        "0x09A25EB69b0d2858800A769Da90934371C7174A9"
+        "eth:0x09A25EB69b0d2858800A769Da90934371C7174A9"
      values.$pastUpgrades.0.2.0:
-        "0x012c341506ee1939e56084F43Ae5dbCe224Ce2af"
+        "eth:0x012c341506ee1939e56084F43Ae5dbCe224Ce2af"
      values.$pastUpgrades.1.2.0:
-        "0x09A25EB69b0d2858800A769Da90934371C7174A9"
+        "eth:0x09A25EB69b0d2858800A769Da90934371C7174A9"
      values.OTHER_MESSENGER:
-        "0x4200000000000000000000000000000000000007"
+        "eth:0x4200000000000000000000000000000000000007"
      values.PORTAL:
-        "0x639F2AECE398Aa76b07e59eF6abe2cFe32bacb68"
+        "eth:0x639F2AECE398Aa76b07e59eF6abe2cFe32bacb68"
      values.ResolvedDelegateProxy_addressManager:
-        "0x15A52Fed1c448028A240b603dD93f2697E12Dc82"
+        "eth:0x15A52Fed1c448028A240b603dD93f2697E12Dc82"
      implementationNames.0x012c341506ee1939e56084F43Ae5dbCe224Ce2af:
-        "ResolvedDelegateProxy"
      implementationNames.0x09A25EB69b0d2858800A769Da90934371C7174A9:
-        "L1CrossDomainMessenger"
      implementationNames.eth:0x012c341506ee1939e56084F43Ae5dbCe224Ce2af:
+        "ResolvedDelegateProxy"
      implementationNames.eth:0x09A25EB69b0d2858800A769Da90934371C7174A9:
+        "L1CrossDomainMessenger"
    }
```

```diff
    EOA  (0x05F0c4e31e2ab24f5CF20b1B9d2FCe2c3d48BB9C) {
    +++ description: None
      address:
-        "0x05F0c4e31e2ab24f5CF20b1B9d2FCe2c3d48BB9C"
+        "eth:0x05F0c4e31e2ab24f5CF20b1B9d2FCe2c3d48BB9C"
    }
```

```diff
    contract SystemConfig (0x0b4cfc49aCc656CE6D03CB0794860Da92bE3E8ec) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      address:
-        "0x0b4cfc49aCc656CE6D03CB0794860Da92bE3E8ec"
+        "eth:0x0b4cfc49aCc656CE6D03CB0794860Da92bE3E8ec"
      values.$admin:
-        "0x75a223Fb459461B9Fa61dd25109EA05522b4b492"
+        "eth:0x75a223Fb459461B9Fa61dd25109EA05522b4b492"
      values.$implementation:
-        "0x188370729584052260214A6e0847B9810e3a120d"
+        "eth:0x188370729584052260214A6e0847B9810e3a120d"
      values.$pastUpgrades.0.2.0:
-        "0x188370729584052260214A6e0847B9810e3a120d"
+        "eth:0x188370729584052260214A6e0847B9810e3a120d"
      values.batcherHash:
-        "0x6079e9c37b87fE06D0bDe2431a0fa309826c9b67"
+        "eth:0x6079e9c37b87fE06D0bDe2431a0fa309826c9b67"
      values.owner:
-        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
+        "eth:0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      values.sequencerInbox:
-        "0xd5df46c580fD2FBdaEE751dc535E14295C0336F3"
+        "eth:0xd5df46c580fD2FBdaEE751dc535E14295C0336F3"
      values.unsafeBlockSigner:
-        "0x132F4CbD6aE20b264620602fd4faa7a10B084f8c"
+        "eth:0x132F4CbD6aE20b264620602fd4faa7a10B084f8c"
      implementationNames.0x0b4cfc49aCc656CE6D03CB0794860Da92bE3E8ec:
-        "Proxy"
      implementationNames.0x188370729584052260214A6e0847B9810e3a120d:
-        "SystemConfig"
      implementationNames.eth:0x0b4cfc49aCc656CE6D03CB0794860Da92bE3E8ec:
+        "Proxy"
      implementationNames.eth:0x188370729584052260214A6e0847B9810e3a120d:
+        "SystemConfig"
    }
```

```diff
    contract L1StandardBridge (0x12d4E64E1B46d27A00fe392653A894C1dd36fb80) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      address:
-        "0x12d4E64E1B46d27A00fe392653A894C1dd36fb80"
+        "eth:0x12d4E64E1B46d27A00fe392653A894C1dd36fb80"
      values.$admin:
-        "0x75a223Fb459461B9Fa61dd25109EA05522b4b492"
+        "eth:0x75a223Fb459461B9Fa61dd25109EA05522b4b492"
      values.$implementation:
-        "0x2362ff553A9E66bf378E971b2AAa631A4570b53d"
+        "eth:0x2362ff553A9E66bf378E971b2AAa631A4570b53d"
      values.l2TokenBridge:
-        "0x4200000000000000000000000000000000000010"
+        "eth:0x4200000000000000000000000000000000000010"
      values.messenger:
-        "0x012c341506ee1939e56084F43Ae5dbCe224Ce2af"
+        "eth:0x012c341506ee1939e56084F43Ae5dbCe224Ce2af"
      values.MESSENGER:
-        "0x012c341506ee1939e56084F43Ae5dbCe224Ce2af"
+        "eth:0x012c341506ee1939e56084F43Ae5dbCe224Ce2af"
      values.OTHER_BRIDGE:
-        "0x4200000000000000000000000000000000000010"
+        "eth:0x4200000000000000000000000000000000000010"
      implementationNames.0x12d4E64E1B46d27A00fe392653A894C1dd36fb80:
-        "L1ChugSplashProxy"
      implementationNames.0x2362ff553A9E66bf378E971b2AAa631A4570b53d:
-        "L1StandardBridge"
      implementationNames.eth:0x12d4E64E1B46d27A00fe392653A894C1dd36fb80:
+        "L1ChugSplashProxy"
      implementationNames.eth:0x2362ff553A9E66bf378E971b2AAa631A4570b53d:
+        "L1StandardBridge"
    }
```

```diff
    contract L1ERC721Bridge (0x132b3456300332d488f946B818eB9512931eBCAa) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      address:
-        "0x132b3456300332d488f946B818eB9512931eBCAa"
+        "eth:0x132b3456300332d488f946B818eB9512931eBCAa"
      values.messenger:
-        "0x012c341506ee1939e56084F43Ae5dbCe224Ce2af"
+        "eth:0x012c341506ee1939e56084F43Ae5dbCe224Ce2af"
      values.MESSENGER:
-        "0x012c341506ee1939e56084F43Ae5dbCe224Ce2af"
+        "eth:0x012c341506ee1939e56084F43Ae5dbCe224Ce2af"
      values.OTHER_BRIDGE:
-        "0x4200000000000000000000000000000000000014"
+        "eth:0x4200000000000000000000000000000000000014"
      values.otherBridge:
-        "0x4200000000000000000000000000000000000014"
+        "eth:0x4200000000000000000000000000000000000014"
      implementationNames.0x132b3456300332d488f946B818eB9512931eBCAa:
-        "L1ERC721Bridge"
      implementationNames.eth:0x132b3456300332d488f946B818eB9512931eBCAa:
+        "L1ERC721Bridge"
    }
```

```diff
    EOA  (0x132F4CbD6aE20b264620602fd4faa7a10B084f8c) {
    +++ description: None
      address:
-        "0x132F4CbD6aE20b264620602fd4faa7a10B084f8c"
+        "eth:0x132F4CbD6aE20b264620602fd4faa7a10B084f8c"
    }
```

```diff
    contract AddressManager (0x15A52Fed1c448028A240b603dD93f2697E12Dc82) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      address:
-        "0x15A52Fed1c448028A240b603dD93f2697E12Dc82"
+        "eth:0x15A52Fed1c448028A240b603dD93f2697E12Dc82"
      values.owner:
-        "0x75a223Fb459461B9Fa61dd25109EA05522b4b492"
+        "eth:0x75a223Fb459461B9Fa61dd25109EA05522b4b492"
      implementationNames.0x15A52Fed1c448028A240b603dD93f2697E12Dc82:
-        "AddressManager"
      implementationNames.eth:0x15A52Fed1c448028A240b603dD93f2697E12Dc82:
+        "AddressManager"
    }
```

```diff
    contract Ancient8GuardianMultisig (0x1B1ecDdbd5F9601b34262Aa3Ca346209E61aA68f) {
    +++ description: None
      address:
-        "0x1B1ecDdbd5F9601b34262Aa3Ca346209E61aA68f"
+        "eth:0x1B1ecDdbd5F9601b34262Aa3Ca346209E61aA68f"
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
-        "0x05F0c4e31e2ab24f5CF20b1B9d2FCe2c3d48BB9C"
+        "eth:0x05F0c4e31e2ab24f5CF20b1B9d2FCe2c3d48BB9C"
      values.$members.4:
-        "0xcdD7FE91F5e2dCf8a0B30C4127c8D54e3F2a469c"
+        "eth:0xcdD7FE91F5e2dCf8a0B30C4127c8D54e3F2a469c"
      values.$members.5:
-        "0xE3a87D0eE19c66d0d22F2AEf50c78d4C4FEeA5FB"
+        "eth:0xE3a87D0eE19c66d0d22F2AEf50c78d4C4FEeA5FB"
      implementationNames.0x1B1ecDdbd5F9601b34262Aa3Ca346209E61aA68f:
-        "GnosisSafeProxy"
      implementationNames.0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
-        "GnosisSafe"
      implementationNames.eth:0x1B1ecDdbd5F9601b34262Aa3Ca346209E61aA68f:
+        "GnosisSafeProxy"
      implementationNames.eth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
+        "GnosisSafe"
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
    EOA  (0x6079e9c37b87fE06D0bDe2431a0fa309826c9b67) {
    +++ description: None
      address:
-        "0x6079e9c37b87fE06D0bDe2431a0fa309826c9b67"
+        "eth:0x6079e9c37b87fE06D0bDe2431a0fa309826c9b67"
    }
```

```diff
    contract OptimismPortal (0x639F2AECE398Aa76b07e59eF6abe2cFe32bacb68) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      address:
-        "0x639F2AECE398Aa76b07e59eF6abe2cFe32bacb68"
+        "eth:0x639F2AECE398Aa76b07e59eF6abe2cFe32bacb68"
      values.$admin:
-        "0x75a223Fb459461B9Fa61dd25109EA05522b4b492"
+        "eth:0x75a223Fb459461B9Fa61dd25109EA05522b4b492"
      values.$implementation:
-        "0x9FC6A608B45c6F129650c26a34bbe5d26959E75e"
+        "eth:0x9FC6A608B45c6F129650c26a34bbe5d26959E75e"
      values.$pastUpgrades.0.2.0:
-        "0x9FC6A608B45c6F129650c26a34bbe5d26959E75e"
+        "eth:0x9FC6A608B45c6F129650c26a34bbe5d26959E75e"
      values.GUARDIAN:
-        "0x1B1ecDdbd5F9601b34262Aa3Ca346209E61aA68f"
+        "eth:0x1B1ecDdbd5F9601b34262Aa3Ca346209E61aA68f"
      values.L2_ORACLE:
-        "0xB09DC08428C8b4EFB4ff9C0827386CDF34277996"
+        "eth:0xB09DC08428C8b4EFB4ff9C0827386CDF34277996"
      values.l2Sender:
-        "0x000000000000000000000000000000000000dEaD"
+        "eth:0x000000000000000000000000000000000000dEaD"
      values.SYSTEM_CONFIG:
-        "0x0b4cfc49aCc656CE6D03CB0794860Da92bE3E8ec"
+        "eth:0x0b4cfc49aCc656CE6D03CB0794860Da92bE3E8ec"
      implementationNames.0x639F2AECE398Aa76b07e59eF6abe2cFe32bacb68:
-        "Proxy"
      implementationNames.0x9FC6A608B45c6F129650c26a34bbe5d26959E75e:
-        "OptimismPortal"
      implementationNames.eth:0x639F2AECE398Aa76b07e59eF6abe2cFe32bacb68:
+        "Proxy"
      implementationNames.eth:0x9FC6A608B45c6F129650c26a34bbe5d26959E75e:
+        "OptimismPortal"
    }
```

```diff
    contract ProxyAdmin (0x75a223Fb459461B9Fa61dd25109EA05522b4b492) {
    +++ description: None
      address:
-        "0x75a223Fb459461B9Fa61dd25109EA05522b4b492"
+        "eth:0x75a223Fb459461B9Fa61dd25109EA05522b4b492"
      values.addressManager:
-        "0x15A52Fed1c448028A240b603dD93f2697E12Dc82"
+        "eth:0x15A52Fed1c448028A240b603dD93f2697E12Dc82"
      values.owner:
-        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
+        "eth:0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      implementationNames.0x75a223Fb459461B9Fa61dd25109EA05522b4b492:
-        "ProxyAdmin"
      implementationNames.eth:0x75a223Fb459461B9Fa61dd25109EA05522b4b492:
+        "ProxyAdmin"
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
    EOA  (0xAF24199C29D5cc3fd298356137913A42847eA690) {
    +++ description: None
      address:
-        "0xAF24199C29D5cc3fd298356137913A42847eA690"
+        "eth:0xAF24199C29D5cc3fd298356137913A42847eA690"
    }
```

```diff
    contract L2OutputOracle (0xB09DC08428C8b4EFB4ff9C0827386CDF34277996) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      address:
-        "0xB09DC08428C8b4EFB4ff9C0827386CDF34277996"
+        "eth:0xB09DC08428C8b4EFB4ff9C0827386CDF34277996"
      values.$admin:
-        "0x75a223Fb459461B9Fa61dd25109EA05522b4b492"
+        "eth:0x75a223Fb459461B9Fa61dd25109EA05522b4b492"
      values.$implementation:
-        "0x1F61619E8c228fb67204cD157A3e50Aa6690FbF6"
+        "eth:0x1F61619E8c228fb67204cD157A3e50Aa6690FbF6"
      values.$pastUpgrades.0.2.0:
-        "0x1F61619E8c228fb67204cD157A3e50Aa6690FbF6"
+        "eth:0x1F61619E8c228fb67204cD157A3e50Aa6690FbF6"
      values.CHALLENGER:
-        "0x1B1ecDdbd5F9601b34262Aa3Ca346209E61aA68f"
+        "eth:0x1B1ecDdbd5F9601b34262Aa3Ca346209E61aA68f"
      values.PROPOSER:
-        "0xAF24199C29D5cc3fd298356137913A42847eA690"
+        "eth:0xAF24199C29D5cc3fd298356137913A42847eA690"
      implementationNames.0xB09DC08428C8b4EFB4ff9C0827386CDF34277996:
-        "Proxy"
      implementationNames.0x1F61619E8c228fb67204cD157A3e50Aa6690FbF6:
-        "L2OutputOracle"
      implementationNames.eth:0xB09DC08428C8b4EFB4ff9C0827386CDF34277996:
+        "Proxy"
      implementationNames.eth:0x1F61619E8c228fb67204cD157A3e50Aa6690FbF6:
+        "L2OutputOracle"
    }
```

```diff
    EOA  (0xcdD7FE91F5e2dCf8a0B30C4127c8D54e3F2a469c) {
    +++ description: None
      address:
-        "0xcdD7FE91F5e2dCf8a0B30C4127c8D54e3F2a469c"
+        "eth:0xcdD7FE91F5e2dCf8a0B30C4127c8D54e3F2a469c"
    }
```

```diff
    EOA  (0xd5df46c580fD2FBdaEE751dc535E14295C0336F3) {
    +++ description: None
      address:
-        "0xd5df46c580fD2FBdaEE751dc535E14295C0336F3"
+        "eth:0xd5df46c580fD2FBdaEE751dc535E14295C0336F3"
    }
```

```diff
    contract L1ERC721Bridge (0xd5e3eDf5b68135D559D572E26bF863FBC1950033) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      address:
-        "0xd5e3eDf5b68135D559D572E26bF863FBC1950033"
+        "eth:0xd5e3eDf5b68135D559D572E26bF863FBC1950033"
      values.$admin:
-        "0x75a223Fb459461B9Fa61dd25109EA05522b4b492"
+        "eth:0x75a223Fb459461B9Fa61dd25109EA05522b4b492"
      values.$implementation:
-        "0x132b3456300332d488f946B818eB9512931eBCAa"
+        "eth:0x132b3456300332d488f946B818eB9512931eBCAa"
      values.$pastUpgrades.0.2.0:
-        "0x132b3456300332d488f946B818eB9512931eBCAa"
+        "eth:0x132b3456300332d488f946B818eB9512931eBCAa"
      values.messenger:
-        "0x012c341506ee1939e56084F43Ae5dbCe224Ce2af"
+        "eth:0x012c341506ee1939e56084F43Ae5dbCe224Ce2af"
      values.MESSENGER:
-        "0x012c341506ee1939e56084F43Ae5dbCe224Ce2af"
+        "eth:0x012c341506ee1939e56084F43Ae5dbCe224Ce2af"
      values.OTHER_BRIDGE:
-        "0x4200000000000000000000000000000000000014"
+        "eth:0x4200000000000000000000000000000000000014"
      values.otherBridge:
-        "0x4200000000000000000000000000000000000014"
+        "eth:0x4200000000000000000000000000000000000014"
      implementationNames.0xd5e3eDf5b68135D559D572E26bF863FBC1950033:
-        "Proxy"
      implementationNames.0x132b3456300332d488f946B818eB9512931eBCAa:
-        "L1ERC721Bridge"
      implementationNames.eth:0xd5e3eDf5b68135D559D572E26bF863FBC1950033:
+        "Proxy"
      implementationNames.eth:0x132b3456300332d488f946B818eB9512931eBCAa:
+        "L1ERC721Bridge"
    }
```

```diff
    EOA  (0xE3a87D0eE19c66d0d22F2AEf50c78d4C4FEeA5FB) {
    +++ description: None
      address:
-        "0xE3a87D0eE19c66d0d22F2AEf50c78d4C4FEeA5FB"
+        "eth:0xE3a87D0eE19c66d0d22F2AEf50c78d4C4FEeA5FB"
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
+   Status: CREATED
    contract L1CrossDomainMessenger (0x012c341506ee1939e56084F43Ae5dbCe224Ce2af)
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
```

```diff
+   Status: CREATED
    contract SystemConfig (0x0b4cfc49aCc656CE6D03CB0794860Da92bE3E8ec)
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
```

```diff
+   Status: CREATED
    contract L1StandardBridge (0x12d4E64E1B46d27A00fe392653A894C1dd36fb80)
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
```

```diff
+   Status: CREATED
    contract L1ERC721Bridge (0x132b3456300332d488f946B818eB9512931eBCAa)
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
```

```diff
+   Status: CREATED
    contract AddressManager (0x15A52Fed1c448028A240b603dD93f2697E12Dc82)
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
```

```diff
+   Status: CREATED
    contract Ancient8GuardianMultisig (0x1B1ecDdbd5F9601b34262Aa3Ca346209E61aA68f)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Conduit Multisig 1 (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OptimismPortal (0x639F2AECE398Aa76b07e59eF6abe2cFe32bacb68)
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x75a223Fb459461B9Fa61dd25109EA05522b4b492)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L2OutputOracle (0xB09DC08428C8b4EFB4ff9C0827386CDF34277996)
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
```

```diff
+   Status: CREATED
    contract L1ERC721Bridge (0xd5e3eDf5b68135D559D572E26bF863FBC1950033)
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
```

Generated with discovered.json: 0xd39d3508e87685b7419f9c17ab086246a88bc366

# Diff at Fri, 04 Jul 2025 12:18:51 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f56dc47fe915564d4555300304da4d3bcbc087f block: 22615662
- current block number: 22615662

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22615662 (main branch discovery), not current.

```diff
    contract Ancient8GuardianMultisig (0x1B1ecDdbd5F9601b34262Aa3Ca346209E61aA68f) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0xB09DC08428C8b4EFB4ff9C0827386CDF34277996"
+        "eth:0xB09DC08428C8b4EFB4ff9C0827386CDF34277996"
      receivedPermissions.1.from:
-        "ethereum:0x639F2AECE398Aa76b07e59eF6abe2cFe32bacb68"
+        "eth:0x639F2AECE398Aa76b07e59eF6abe2cFe32bacb68"
    }
```

```diff
    contract Conduit Multisig 1 (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0x0b4cfc49aCc656CE6D03CB0794860Da92bE3E8ec"
+        "eth:0x0b4cfc49aCc656CE6D03CB0794860Da92bE3E8ec"
      receivedPermissions.1.via.0.address:
-        "ethereum:0x75a223Fb459461B9Fa61dd25109EA05522b4b492"
+        "eth:0x75a223Fb459461B9Fa61dd25109EA05522b4b492"
      receivedPermissions.1.from:
-        "ethereum:0x15A52Fed1c448028A240b603dD93f2697E12Dc82"
+        "eth:0x15A52Fed1c448028A240b603dD93f2697E12Dc82"
      receivedPermissions.2.via.0.address:
-        "ethereum:0x75a223Fb459461B9Fa61dd25109EA05522b4b492"
+        "eth:0x75a223Fb459461B9Fa61dd25109EA05522b4b492"
      receivedPermissions.2.from:
-        "ethereum:0x012c341506ee1939e56084F43Ae5dbCe224Ce2af"
+        "eth:0x012c341506ee1939e56084F43Ae5dbCe224Ce2af"
      receivedPermissions.3.via.0.address:
-        "ethereum:0x75a223Fb459461B9Fa61dd25109EA05522b4b492"
+        "eth:0x75a223Fb459461B9Fa61dd25109EA05522b4b492"
      receivedPermissions.3.from:
-        "ethereum:0x0b4cfc49aCc656CE6D03CB0794860Da92bE3E8ec"
+        "eth:0x0b4cfc49aCc656CE6D03CB0794860Da92bE3E8ec"
      receivedPermissions.4.via.0.address:
-        "ethereum:0x75a223Fb459461B9Fa61dd25109EA05522b4b492"
+        "eth:0x75a223Fb459461B9Fa61dd25109EA05522b4b492"
      receivedPermissions.4.from:
-        "ethereum:0x12d4E64E1B46d27A00fe392653A894C1dd36fb80"
+        "eth:0x12d4E64E1B46d27A00fe392653A894C1dd36fb80"
      receivedPermissions.5.via.0.address:
-        "ethereum:0x75a223Fb459461B9Fa61dd25109EA05522b4b492"
+        "eth:0x75a223Fb459461B9Fa61dd25109EA05522b4b492"
      receivedPermissions.5.from:
-        "ethereum:0x639F2AECE398Aa76b07e59eF6abe2cFe32bacb68"
+        "eth:0x639F2AECE398Aa76b07e59eF6abe2cFe32bacb68"
      receivedPermissions.6.via.0.address:
-        "ethereum:0x75a223Fb459461B9Fa61dd25109EA05522b4b492"
+        "eth:0x75a223Fb459461B9Fa61dd25109EA05522b4b492"
      receivedPermissions.6.from:
-        "ethereum:0xB09DC08428C8b4EFB4ff9C0827386CDF34277996"
+        "eth:0xB09DC08428C8b4EFB4ff9C0827386CDF34277996"
      receivedPermissions.7.via.0.address:
-        "ethereum:0x75a223Fb459461B9Fa61dd25109EA05522b4b492"
+        "eth:0x75a223Fb459461B9Fa61dd25109EA05522b4b492"
      receivedPermissions.7.from:
-        "ethereum:0xd5e3eDf5b68135D559D572E26bF863FBC1950033"
+        "eth:0xd5e3eDf5b68135D559D572E26bF863FBC1950033"
      directlyReceivedPermissions.0.from:
-        "ethereum:0x75a223Fb459461B9Fa61dd25109EA05522b4b492"
+        "eth:0x75a223Fb459461B9Fa61dd25109EA05522b4b492"
    }
```

```diff
    EOA  (0x6079e9c37b87fE06D0bDe2431a0fa309826c9b67) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0x0b4cfc49aCc656CE6D03CB0794860Da92bE3E8ec"
+        "eth:0x0b4cfc49aCc656CE6D03CB0794860Da92bE3E8ec"
    }
```

```diff
    contract ProxyAdmin (0x75a223Fb459461B9Fa61dd25109EA05522b4b492) {
    +++ description: None
      directlyReceivedPermissions.0.from:
-        "ethereum:0x15A52Fed1c448028A240b603dD93f2697E12Dc82"
+        "eth:0x15A52Fed1c448028A240b603dD93f2697E12Dc82"
      directlyReceivedPermissions.1.from:
-        "ethereum:0x012c341506ee1939e56084F43Ae5dbCe224Ce2af"
+        "eth:0x012c341506ee1939e56084F43Ae5dbCe224Ce2af"
      directlyReceivedPermissions.2.from:
-        "ethereum:0x0b4cfc49aCc656CE6D03CB0794860Da92bE3E8ec"
+        "eth:0x0b4cfc49aCc656CE6D03CB0794860Da92bE3E8ec"
      directlyReceivedPermissions.3.from:
-        "ethereum:0x12d4E64E1B46d27A00fe392653A894C1dd36fb80"
+        "eth:0x12d4E64E1B46d27A00fe392653A894C1dd36fb80"
      directlyReceivedPermissions.4.from:
-        "ethereum:0x639F2AECE398Aa76b07e59eF6abe2cFe32bacb68"
+        "eth:0x639F2AECE398Aa76b07e59eF6abe2cFe32bacb68"
      directlyReceivedPermissions.5.from:
-        "ethereum:0xB09DC08428C8b4EFB4ff9C0827386CDF34277996"
+        "eth:0xB09DC08428C8b4EFB4ff9C0827386CDF34277996"
      directlyReceivedPermissions.6.from:
-        "ethereum:0xd5e3eDf5b68135D559D572E26bF863FBC1950033"
+        "eth:0xd5e3eDf5b68135D559D572E26bF863FBC1950033"
    }
```

```diff
    EOA  (0xAF24199C29D5cc3fd298356137913A42847eA690) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0xB09DC08428C8b4EFB4ff9C0827386CDF34277996"
+        "eth:0xB09DC08428C8b4EFB4ff9C0827386CDF34277996"
    }
```

Generated with discovered.json: 0x8dd36a2beabb179fb015affe636c9c41f8221508

# Diff at Mon, 16 Jun 2025 08:41:39 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@e1208475abce20cea1768d2e4878c03350c1b7c9 block: 22615662
- current block number: 22615662

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22615662 (main branch discovery), not current.

```diff
    contract L1CrossDomainMessenger (0x012c341506ee1939e56084F43Ae5dbCe224Ce2af) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      values.$admin:
+        "0x75a223Fb459461B9Fa61dd25109EA05522b4b492"
    }
```

```diff
    contract Conduit Multisig 1 (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      receivedPermissions.7:
+        {"permission":"upgrade","from":"ethereum:0x012c341506ee1939e56084F43Ae5dbCe224Ce2af","role":"admin","via":[{"address":"ethereum:0x75a223Fb459461B9Fa61dd25109EA05522b4b492"}]}
    }
```

```diff
    contract ProxyAdmin (0x75a223Fb459461B9Fa61dd25109EA05522b4b492) {
    +++ description: None
      directlyReceivedPermissions.6:
+        {"permission":"upgrade","from":"ethereum:0x012c341506ee1939e56084F43Ae5dbCe224Ce2af","role":"admin"}
    }
```

Generated with discovered.json: 0x1bff0a00266aa4990ee9d6bed9531f5a3b30d17c

# Diff at Mon, 02 Jun 2025 07:59:19 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@2fee84b782a329885c84742cf9cf43143842a2d5 block: 22566407
- current block number: 22615662

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

Generated with discovered.json: 0x78030b7d9efc6a2acf35cc0d8c1099a97d479d4d

# Diff at Fri, 30 May 2025 06:54:28 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@a4d8c436027d17df0f9b76843cd6deb1888fa381 block: 22566407
- current block number: 22566407

## Description

config: change comment about eip1559 fee val

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22566407 (main branch discovery), not current.

```diff
    contract SystemConfig (0x0b4cfc49aCc656CE6D03CB0794860Da92bE3E8ec) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      fieldMeta.eip1559Denominator:
+        {"description":"volatility param: lower denominator -> quicker fee changes on L2"}
    }
```

Generated with discovered.json: 0x9600022031d7987e67a5fdb244a30dab1e980b32

# Diff at Tue, 27 May 2025 12:35:46 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@23beb76ada08c9c42f8f16b886f40d94b22ac36e block: 22566407
- current block number: 22566407

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22566407 (main branch discovery), not current.

```diff
    contract SystemConfig (0x0b4cfc49aCc656CE6D03CB0794860Da92bE3E8ec) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      values.opStackDA.isUsingCelestia:
-        false
+        true
    }
```

Generated with discovered.json: 0xd89d102ad342b175a1c44885cfc8a862e057af57

# Diff at Mon, 26 May 2025 10:36:26 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@5ebb17207c8579b0c67f4b4fedb1eb093f29aadf block: 22046058
- current block number: 22566407

## Description

Handler is broken, does not detect their new commitments. Ancient switched from `0xce` to `0x01010c`.

## Watched changes

```diff
    contract SystemConfig (0x0b4cfc49aCc656CE6D03CB0794860Da92bE3E8ec) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      values.opStackDA.isUsingCelestia:
-        true
+        false
    }
```

Generated with discovered.json: 0x26418774a47098d4a61c68ba325ff22d3f364b66

# Diff at Fri, 23 May 2025 09:40:52 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@69cd181abbc3c830a6caf2f4429b37cae72ffdb8 block: 22046058
- current block number: 22046058

## Description

Introduced .role field on each permission, defaulting to field name on which it was defined (with '.' prefix)

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22046058 (main branch discovery), not current.

```diff
    contract Ancient8GuardianMultisig (0x1B1ecDdbd5F9601b34262Aa3Ca346209E61aA68f) {
    +++ description: None
      receivedPermissions.1.permission:
-        "challenge"
+        "guard"
      receivedPermissions.1.from:
-        "0xB09DC08428C8b4EFB4ff9C0827386CDF34277996"
+        "0x639F2AECE398Aa76b07e59eF6abe2cFe32bacb68"
      receivedPermissions.1.role:
+        ".GUARDIAN"
      receivedPermissions.0.permission:
-        "guard"
+        "challenge"
      receivedPermissions.0.from:
-        "0x639F2AECE398Aa76b07e59eF6abe2cFe32bacb68"
+        "0xB09DC08428C8b4EFB4ff9C0827386CDF34277996"
      receivedPermissions.0.role:
+        ".CHALLENGER"
    }
```

```diff
    contract Conduit Multisig 1 (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      receivedPermissions.6.role:
+        "admin"
      receivedPermissions.5.role:
+        "admin"
      receivedPermissions.4.role:
+        "admin"
      receivedPermissions.3.from:
-        "0x12d4E64E1B46d27A00fe392653A894C1dd36fb80"
+        "0x0b4cfc49aCc656CE6D03CB0794860Da92bE3E8ec"
      receivedPermissions.3.description:
-        "upgrading the bridge implementation can give access to all funds escrowed therein."
      receivedPermissions.3.role:
+        "admin"
      receivedPermissions.2.from:
-        "0x0b4cfc49aCc656CE6D03CB0794860Da92bE3E8ec"
+        "0x12d4E64E1B46d27A00fe392653A894C1dd36fb80"
      receivedPermissions.2.description:
+        "upgrading the bridge implementation can give access to all funds escrowed therein."
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
    EOA  (0x6079e9c37b87fE06D0bDe2431a0fa309826c9b67) {
    +++ description: None
      receivedPermissions.0.role:
+        ".batcherHash"
    }
```

```diff
    contract ProxyAdmin (0x75a223Fb459461B9Fa61dd25109EA05522b4b492) {
    +++ description: None
      directlyReceivedPermissions.5.role:
+        "admin"
      directlyReceivedPermissions.4.role:
+        "admin"
      directlyReceivedPermissions.3.role:
+        "admin"
      directlyReceivedPermissions.2.from:
-        "0x12d4E64E1B46d27A00fe392653A894C1dd36fb80"
+        "0x0b4cfc49aCc656CE6D03CB0794860Da92bE3E8ec"
      directlyReceivedPermissions.2.description:
-        "upgrading the bridge implementation can give access to all funds escrowed therein."
      directlyReceivedPermissions.2.role:
+        "admin"
      directlyReceivedPermissions.1.from:
-        "0x0b4cfc49aCc656CE6D03CB0794860Da92bE3E8ec"
+        "0x12d4E64E1B46d27A00fe392653A894C1dd36fb80"
      directlyReceivedPermissions.1.description:
+        "upgrading the bridge implementation can give access to all funds escrowed therein."
      directlyReceivedPermissions.1.role:
+        ".$admin"
      directlyReceivedPermissions.0.role:
+        ".owner"
    }
```

```diff
    EOA  (0xAF24199C29D5cc3fd298356137913A42847eA690) {
    +++ description: None
      receivedPermissions.0.role:
+        ".PROPOSER"
    }
```

Generated with discovered.json: 0x8d7c187e8e886c5bc3ba35f0b26c08e1537c7fd5

# Diff at Tue, 29 Apr 2025 08:18:59 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@ef7477af00fe0b57a2f7cacf7e958c12494af662 block: 22046058
- current block number: 22046058

## Description

Field .issuedPermissions is removed from the output as no longer needed. Added 'permissionsConfigHash' due to refactoring of the modelling process (into a separate command).

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22046058 (main branch discovery), not current.

```diff
    contract SystemConfig (0x0b4cfc49aCc656CE6D03CB0794860Da92bE3E8ec) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      issuedPermissions:
-        [{"permission":"interact","to":"0x4a4962275DF8C60a80d3a25faEc5AA7De116A746","description":"it can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system.","via":[]},{"permission":"sequence","to":"0x6079e9c37b87fE06D0bDe2431a0fa309826c9b67","via":[]},{"permission":"upgrade","to":"0x4a4962275DF8C60a80d3a25faEc5AA7De116A746","via":[{"address":"0x75a223Fb459461B9Fa61dd25109EA05522b4b492"}]}]
    }
```

```diff
    contract L1StandardBridge (0x12d4E64E1B46d27A00fe392653A894C1dd36fb80) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x4a4962275DF8C60a80d3a25faEc5AA7De116A746","description":"upgrading the bridge implementation can give access to all funds escrowed therein.","via":[{"address":"0x75a223Fb459461B9Fa61dd25109EA05522b4b492"}]}]
    }
```

```diff
    contract AddressManager (0x15A52Fed1c448028A240b603dD93f2697E12Dc82) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      issuedPermissions:
-        [{"permission":"interact","to":"0x4a4962275DF8C60a80d3a25faEc5AA7De116A746","description":"set and change address mappings.","via":[{"address":"0x75a223Fb459461B9Fa61dd25109EA05522b4b492"}]}]
    }
```

```diff
    contract OptimismPortal (0x639F2AECE398Aa76b07e59eF6abe2cFe32bacb68) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      issuedPermissions:
-        [{"permission":"guard","to":"0x1B1ecDdbd5F9601b34262Aa3Ca346209E61aA68f","via":[]},{"permission":"upgrade","to":"0x4a4962275DF8C60a80d3a25faEc5AA7De116A746","via":[{"address":"0x75a223Fb459461B9Fa61dd25109EA05522b4b492"}]}]
    }
```

```diff
    contract L2OutputOracle (0xB09DC08428C8b4EFB4ff9C0827386CDF34277996) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      issuedPermissions:
-        [{"permission":"challenge","to":"0x1B1ecDdbd5F9601b34262Aa3Ca346209E61aA68f","via":[]},{"permission":"propose","to":"0xAF24199C29D5cc3fd298356137913A42847eA690","via":[]},{"permission":"upgrade","to":"0x4a4962275DF8C60a80d3a25faEc5AA7De116A746","via":[{"address":"0x75a223Fb459461B9Fa61dd25109EA05522b4b492"}]}]
    }
```

```diff
    contract L1ERC721Bridge (0xd5e3eDf5b68135D559D572E26bF863FBC1950033) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x4a4962275DF8C60a80d3a25faEc5AA7De116A746","via":[{"address":"0x75a223Fb459461B9Fa61dd25109EA05522b4b492"}]}]
    }
```

Generated with discovered.json: 0x8425aba06ba38879d91b6dd8ae17fba494d748f7

# Diff at Thu, 27 Mar 2025 11:13:56 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@8cc2e36080df3a74dfd8475d41c64f46203f5218 block: 22046058
- current block number: 22046058

## Description

Config related: add guardian description details, hide some noisy values, hide AddressManager as spam cat, add proposer / challenger to permissioned opfp chains.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22046058 (main branch discovery), not current.

```diff
    contract AddressManager (0x15A52Fed1c448028A240b603dD93f2697E12Dc82) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      category:
+        {"name":"Spam","priority":-1}
    }
```

Generated with discovered.json: 0x52852ef052daeed0c943c87e9411c58da8d9458c

# Diff at Tue, 18 Mar 2025 08:12:22 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@4ef7a8dbcec1cd9fec77aae2b73d81347a4ffb13 block: 22046058
- current block number: 22046058

## Description

Config: change Multisig names.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22046058 (main branch discovery), not current.

```diff
    contract Conduit Multisig 1 (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      name:
-        "ConduitMultisig"
+        "Conduit Multisig 1"
    }
```

Generated with discovered.json: 0xf7576c39836040906960bed32d9b5097f09b8d63

# Diff at Fri, 14 Mar 2025 15:38:45 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@002bac09dea3b1154ecc36736323fb7552478ce4 block: 21808937
- current block number: 22046058

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

Generated with discovered.json: 0xb5bf75cb1345c45d0969c953c7388f372d2581c0

# Diff at Tue, 04 Mar 2025 11:25:23 GMT:

- author: Michał Podsiadły (<michal.podsiadly@l2beat.com>)
- comparing to: main@be38e12d3ff947ca8de40f3a23a9ba1875a54f5a block: 21808937
- current block number: 21808937

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21808937 (main branch discovery), not current.

```diff
    contract SystemConfig (0x0b4cfc49aCc656CE6D03CB0794860Da92bE3E8ec) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      values.opStackDA.isSomeTxsLengthEqualToCelestiaDAExample:
-        true
      values.opStackDA.isUsingCelestia:
+        true
    }
```

Generated with discovered.json: 0x15624a6ab10fcd7307797526216a44bb1bf29c90

# Diff at Tue, 04 Mar 2025 10:38:54 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@98d260b45fe0d2195ce5e629bd7b200c8706e8ba block: 21808937
- current block number: 21808937

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21808937 (main branch discovery), not current.

```diff
    contract L1CrossDomainMessenger (0x012c341506ee1939e56084F43Ae5dbCe224Ce2af) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      sinceBlock:
+        19070571
    }
```

```diff
    contract SystemConfig (0x0b4cfc49aCc656CE6D03CB0794860Da92bE3E8ec) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      sinceBlock:
+        19070571
    }
```

```diff
    contract L1StandardBridge (0x12d4E64E1B46d27A00fe392653A894C1dd36fb80) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      sinceBlock:
+        19070571
    }
```

```diff
    contract L1ERC721Bridge (0x132b3456300332d488f946B818eB9512931eBCAa) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      sinceBlock:
+        19070571
    }
```

```diff
    contract AddressManager (0x15A52Fed1c448028A240b603dD93f2697E12Dc82) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      sinceBlock:
+        19070571
    }
```

```diff
    contract Ancient8GuardianMultisig (0x1B1ecDdbd5F9601b34262Aa3Ca346209E61aA68f) {
    +++ description: None
      sinceBlock:
+        19070482
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
    contract OptimismPortal (0x639F2AECE398Aa76b07e59eF6abe2cFe32bacb68) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      sinceBlock:
+        19070571
    }
```

```diff
    contract ProxyAdmin (0x75a223Fb459461B9Fa61dd25109EA05522b4b492) {
    +++ description: None
      sinceBlock:
+        19070571
    }
```

```diff
    contract L2OutputOracle (0xB09DC08428C8b4EFB4ff9C0827386CDF34277996) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      sinceBlock:
+        19070571
    }
```

```diff
    contract L1ERC721Bridge (0xd5e3eDf5b68135D559D572E26bF863FBC1950033) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      sinceBlock:
+        19070571
    }
```

Generated with discovered.json: 0x5e4df0f6f25ff6353dcd14d6cbe60956599be018

# Diff at Wed, 26 Feb 2025 10:32:29 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@18513668f913fbe57a197f43655b19111df0e627 block: 21808937
- current block number: 21808937

## Description

config related: added categories for all opstack, op stack and polygoncdk stack templates.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21808937 (main branch discovery), not current.

```diff
    contract L1CrossDomainMessenger (0x012c341506ee1939e56084F43Ae5dbCe224Ce2af) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      category:
+        {"name":"Canonical Bridges","priority":2}
    }
```

```diff
    contract SystemConfig (0x0b4cfc49aCc656CE6D03CB0794860Da92bE3E8ec) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract L1StandardBridge (0x12d4E64E1B46d27A00fe392653A894C1dd36fb80) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      category:
+        {"name":"Canonical Bridges","priority":2}
    }
```

```diff
    contract L1ERC721Bridge (0x132b3456300332d488f946B818eB9512931eBCAa) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      category:
+        {"name":"Canonical Bridges","priority":2}
    }
```

```diff
    contract OptimismPortal (0x639F2AECE398Aa76b07e59eF6abe2cFe32bacb68) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract L2OutputOracle (0xB09DC08428C8b4EFB4ff9C0827386CDF34277996) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract L1ERC721Bridge (0xd5e3eDf5b68135D559D572E26bF863FBC1950033) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      category:
+        {"name":"Canonical Bridges","priority":2}
    }
```

Generated with discovered.json: 0x8f3203f295ffb86267cbf456ad9c7a00b7234699

# Diff at Fri, 21 Feb 2025 14:04:47 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@d219f271711b2cf7a164e3443bead5e4957d13a8 block: 21808937
- current block number: 21808937

## Description

Config related: Change some severities and add templates.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21808937 (main branch discovery), not current.

```diff
    contract L2OutputOracle (0xB09DC08428C8b4EFB4ff9C0827386CDF34277996) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      fieldMeta.proposer:
+        {"severity":"HIGH"}
      fieldMeta.challenger:
+        {"severity":"HIGH"}
      fieldMeta.deletedOutputs:
+        {"severity":"HIGH"}
    }
```

Generated with discovered.json: 0xd6ea3ec8fa58e793ccea18bb9961e7e5e9a7131b

# Diff at Fri, 21 Feb 2025 08:59:02 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1cf9ec35847912163c4b663a633e258a434c0bca block: 21808937
- current block number: 21808937

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21808937 (main branch discovery), not current.

```diff
    contract L1CrossDomainMessenger (0x012c341506ee1939e56084F43Ae5dbCe224Ce2af) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      categories:
-        ["Core"]
    }
```

Generated with discovered.json: 0xcc63f5d6a488c46b23b85e44572bd3cdf33f09f3

# Diff at Mon, 10 Feb 2025 19:03:38 GMT:

- author: Michał Podsiadły (<michal.podsiadly@l2beat.com>)
- comparing to: main@3756adff7c1ac86d8af3374a90a75c1999aae2b3 block: 21773864
- current block number: 21808937

## Description

Added Eigen DA detection under OpStackDAHandler.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21773864 (main branch discovery), not current.

```diff
    contract SystemConfig (0x0b4cfc49aCc656CE6D03CB0794860Da92bE3E8ec) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      values.opStackDA.isUsingEigenDA:
+        false
    }
```

Generated with discovered.json: 0xa2afb9fecefb74fd51385f58f4806e58e5b9c210

# Diff at Tue, 04 Feb 2025 14:56:50 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@0b255b1e33d3bf85933cb640f6762fa0c8f26ff4 block: 21637075
- current block number: 21773864

## Description

discodrive!

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21637075 (main branch discovery), not current.

```diff
    contract Ancient8GuardianMultisig (0x1B1ecDdbd5F9601b34262Aa3Ca346209E61aA68f) {
    +++ description: None
      name:
-        "ChallengerMultisig"
+        "Ancient8GuardianMultisig"
    }
```

```diff
+   Status: CREATED
    contract L1ERC721Bridge (0x132b3456300332d488f946B818eB9512931eBCAa)
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
```

Generated with discovered.json: 0x9b6209b47e918e1381188b4331477bb5f681674a

# Diff at Tue, 04 Feb 2025 12:30:46 GMT:

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
    contract SystemConfig (0x0b4cfc49aCc656CE6D03CB0794860Da92bE3E8ec) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      issuedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract AddressManager (0x15A52Fed1c448028A240b603dD93f2697E12Dc82) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      issuedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

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
    contract ProxyAdmin (0x75a223Fb459461B9Fa61dd25109EA05522b4b492) {
    +++ description: None
      directlyReceivedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

Generated with discovered.json: 0xb9538bcbc2921da23f76b24fa896eee26af488ca

# Diff at Mon, 20 Jan 2025 11:09:15 GMT:

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
    contract SystemConfig (0x0b4cfc49aCc656CE6D03CB0794860Da92bE3E8ec) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      issuedPermissions.2.target:
-        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      issuedPermissions.2.via.0.delay:
-        0
      issuedPermissions.2.to:
+        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      issuedPermissions.1.target:
-        "0x6079e9c37b87fE06D0bDe2431a0fa309826c9b67"
      issuedPermissions.1.to:
+        "0x6079e9c37b87fE06D0bDe2431a0fa309826c9b67"
      issuedPermissions.0.target:
-        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      issuedPermissions.0.to:
+        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      issuedPermissions.0.description:
+        "it can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system."
    }
```

```diff
    contract L1StandardBridge (0x12d4E64E1B46d27A00fe392653A894C1dd36fb80) {
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
    contract AddressManager (0x15A52Fed1c448028A240b603dD93f2697E12Dc82) {
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
    contract ChallengerMultisig (0x1B1ecDdbd5F9601b34262Aa3Ca346209E61aA68f) {
    +++ description: None
      receivedPermissions.1.target:
-        "0x639F2AECE398Aa76b07e59eF6abe2cFe32bacb68"
      receivedPermissions.1.from:
+        "0x639F2AECE398Aa76b07e59eF6abe2cFe32bacb68"
      receivedPermissions.0.target:
-        "0xB09DC08428C8b4EFB4ff9C0827386CDF34277996"
      receivedPermissions.0.from:
+        "0xB09DC08428C8b4EFB4ff9C0827386CDF34277996"
    }
```

```diff
    contract ConduitMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      receivedPermissions.6.target:
-        "0xd5e3eDf5b68135D559D572E26bF863FBC1950033"
      receivedPermissions.6.from:
+        "0xd5e3eDf5b68135D559D572E26bF863FBC1950033"
      receivedPermissions.5.target:
-        "0xB09DC08428C8b4EFB4ff9C0827386CDF34277996"
      receivedPermissions.5.from:
+        "0xB09DC08428C8b4EFB4ff9C0827386CDF34277996"
      receivedPermissions.4.target:
-        "0x639F2AECE398Aa76b07e59eF6abe2cFe32bacb68"
      receivedPermissions.4.from:
+        "0x639F2AECE398Aa76b07e59eF6abe2cFe32bacb68"
      receivedPermissions.3.target:
-        "0x12d4E64E1B46d27A00fe392653A894C1dd36fb80"
      receivedPermissions.3.from:
+        "0x12d4E64E1B46d27A00fe392653A894C1dd36fb80"
      receivedPermissions.2.target:
-        "0x0b4cfc49aCc656CE6D03CB0794860Da92bE3E8ec"
      receivedPermissions.2.from:
+        "0x0b4cfc49aCc656CE6D03CB0794860Da92bE3E8ec"
      receivedPermissions.1.target:
-        "0x15A52Fed1c448028A240b603dD93f2697E12Dc82"
      receivedPermissions.1.from:
+        "0x15A52Fed1c448028A240b603dD93f2697E12Dc82"
      receivedPermissions.0.target:
-        "0x0b4cfc49aCc656CE6D03CB0794860Da92bE3E8ec"
      receivedPermissions.0.from:
+        "0x0b4cfc49aCc656CE6D03CB0794860Da92bE3E8ec"
      directlyReceivedPermissions.0.target:
-        "0x75a223Fb459461B9Fa61dd25109EA05522b4b492"
      directlyReceivedPermissions.0.from:
+        "0x75a223Fb459461B9Fa61dd25109EA05522b4b492"
    }
```

```diff
    contract OptimismPortal (0x639F2AECE398Aa76b07e59eF6abe2cFe32bacb68) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      issuedPermissions.1.target:
-        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      issuedPermissions.1.via.0.delay:
-        0
      issuedPermissions.1.to:
+        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      issuedPermissions.0.target:
-        "0x1B1ecDdbd5F9601b34262Aa3Ca346209E61aA68f"
      issuedPermissions.0.to:
+        "0x1B1ecDdbd5F9601b34262Aa3Ca346209E61aA68f"
    }
```

```diff
    contract ProxyAdmin (0x75a223Fb459461B9Fa61dd25109EA05522b4b492) {
    +++ description: None
      directlyReceivedPermissions.5.target:
-        "0xd5e3eDf5b68135D559D572E26bF863FBC1950033"
      directlyReceivedPermissions.5.from:
+        "0xd5e3eDf5b68135D559D572E26bF863FBC1950033"
      directlyReceivedPermissions.4.target:
-        "0xB09DC08428C8b4EFB4ff9C0827386CDF34277996"
      directlyReceivedPermissions.4.from:
+        "0xB09DC08428C8b4EFB4ff9C0827386CDF34277996"
      directlyReceivedPermissions.3.target:
-        "0x639F2AECE398Aa76b07e59eF6abe2cFe32bacb68"
      directlyReceivedPermissions.3.from:
+        "0x639F2AECE398Aa76b07e59eF6abe2cFe32bacb68"
      directlyReceivedPermissions.2.target:
-        "0x12d4E64E1B46d27A00fe392653A894C1dd36fb80"
      directlyReceivedPermissions.2.from:
+        "0x12d4E64E1B46d27A00fe392653A894C1dd36fb80"
      directlyReceivedPermissions.1.target:
-        "0x0b4cfc49aCc656CE6D03CB0794860Da92bE3E8ec"
      directlyReceivedPermissions.1.from:
+        "0x0b4cfc49aCc656CE6D03CB0794860Da92bE3E8ec"
      directlyReceivedPermissions.0.target:
-        "0x15A52Fed1c448028A240b603dD93f2697E12Dc82"
      directlyReceivedPermissions.0.from:
+        "0x15A52Fed1c448028A240b603dD93f2697E12Dc82"
    }
```

```diff
    contract L2OutputOracle (0xB09DC08428C8b4EFB4ff9C0827386CDF34277996) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      issuedPermissions.2.target:
-        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      issuedPermissions.2.via.0.delay:
-        0
      issuedPermissions.2.to:
+        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      issuedPermissions.1.target:
-        "0xAF24199C29D5cc3fd298356137913A42847eA690"
      issuedPermissions.1.to:
+        "0xAF24199C29D5cc3fd298356137913A42847eA690"
      issuedPermissions.0.target:
-        "0x1B1ecDdbd5F9601b34262Aa3Ca346209E61aA68f"
      issuedPermissions.0.to:
+        "0x1B1ecDdbd5F9601b34262Aa3Ca346209E61aA68f"
    }
```

```diff
    contract L1ERC721Bridge (0xd5e3eDf5b68135D559D572E26bF863FBC1950033) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      issuedPermissions.0.target:
-        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
    }
```

Generated with discovered.json: 0xe510187097f98bb7ad8b431cfd6416d584e59ba1

# Diff at Thu, 16 Jan 2025 12:34:36 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@b471de2d691e0c6d99ad89859efde79edd3d4dfb block: 21078628
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

Generated with discovered.json: 0x5726f4e7e698e320c39527b2ff1378532cfb9c94

# Diff at Wed, 08 Jan 2025 08:58:04 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@deefa974378c2cd6b74f061e1f5a494bbbe1d63a block: 21078628
- current block number: 21078628

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21078628 (main branch discovery), not current.

```diff
    contract L1StandardBridge (0x12d4E64E1B46d27A00fe392653A894C1dd36fb80) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      description:
-        "The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token."
+        "The main entry point to deposit ERC20 tokens from host chain to this chain."
    }
```

Generated with discovered.json: 0x66ab3c72a1e041e762cadcd99f683528f83d8090

# Diff at Fri, 01 Nov 2024 12:09:03 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@cd1f0e71bb08ce16b2084a11b768538e8aa6ba8c block: 21078628
- current block number: 21078628

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21078628 (main branch discovery), not current.

```diff
    contract L1StandardBridge (0x12d4E64E1B46d27A00fe392653A894C1dd36fb80) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token.
      issuedPermissions.0.via.0.description:
-        "upgrading bridge implementation allows to access all funds and change every system component."
+        "upgrading the bridge implementation can give access to all funds escrowed therein."
    }
```

```diff
    contract ConduitMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      receivedPermissions.3.description:
-        "upgrading bridge implementation allows to access all funds and change every system component."
+        "upgrading the bridge implementation can give access to all funds escrowed therein."
    }
```

```diff
    contract ProxyAdmin (0x75a223Fb459461B9Fa61dd25109EA05522b4b492) {
    +++ description: None
      directlyReceivedPermissions.2.description:
-        "upgrading bridge implementation allows to access all funds and change every system component."
+        "upgrading the bridge implementation can give access to all funds escrowed therein."
    }
```

Generated with discovered.json: 0x4d339635af8e544eabe9970b13d80ffd34926b1e

# Diff at Wed, 30 Oct 2024 13:02:55 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@0a8a53530022c6c5edd257c3682a3e7f80d0c550 block: 20775882
- current block number: 21078628

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

Generated with discovered.json: 0xb209342c20010aec0ddd00bfa44821cfb3bb0cb3

# Diff at Tue, 29 Oct 2024 13:03:50 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@7b3fc9dc9074e1d423b48522c3f0273c86aab54a block: 20775882
- current block number: 20775882

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20775882 (main branch discovery), not current.

```diff
    contract L2OutputOracle (0xB09DC08428C8b4EFB4ff9C0827386CDF34277996) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      fieldMeta:
+        {"FINALIZATION_PERIOD_SECONDS":{"description":"Challenge period (Number of seconds until a state root is finalized)."}}
    }
```

Generated with discovered.json: 0x0486abc6761c2b835b3fa7111bb26872455e98a0

# Diff at Mon, 21 Oct 2024 12:42:33 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@e660599f23a07618fe949a07be1f516ce44f1914 block: 20775882
- current block number: 20775882

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20775882 (main branch discovery), not current.

```diff
    contract L1CrossDomainMessenger (0x012c341506ee1939e56084F43Ae5dbCe224Ce2af) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      descriptions:
-        ["Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function."]
      description:
+        "Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function."
    }
```

```diff
    contract SystemConfig (0x0b4cfc49aCc656CE6D03CB0794860Da92bE3E8ec) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      descriptions:
-        ["Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address."]
      description:
+        "Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address."
    }
```

```diff
    contract L1StandardBridge (0x12d4E64E1B46d27A00fe392653A894C1dd36fb80) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token.
      descriptions:
-        ["The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token."]
      description:
+        "The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token."
    }
```

```diff
    contract AddressManager (0x15A52Fed1c448028A240b603dD93f2697E12Dc82) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      descriptions:
-        ["Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts."]
      description:
+        "Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts."
    }
```

```diff
    contract OptimismPortal (0x639F2AECE398Aa76b07e59eF6abe2cFe32bacb68) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      descriptions:
-        ["The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals."]
      description:
+        "The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals."
    }
```

```diff
    contract L2OutputOracle (0xB09DC08428C8b4EFB4ff9C0827386CDF34277996) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      descriptions:
-        ["Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots."]
      description:
+        "Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots."
    }
```

```diff
    contract L1ERC721Bridge (0xd5e3eDf5b68135D559D572E26bF863FBC1950033) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      descriptions:
-        ["Used to bridge ERC-721 tokens from host chain to this chain."]
      description:
+        "Used to bridge ERC-721 tokens from host chain to this chain."
    }
```

Generated with discovered.json: 0xca1868bffd486bc1c03bfbbabc86c9f6981c1609

# Diff at Mon, 21 Oct 2024 11:04:08 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@8895d33866f5665c4c710f4ddaa32bfa63cc3c78 block: 20775882
- current block number: 20775882

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20775882 (main branch discovery), not current.

```diff
    contract L1CrossDomainMessenger (0x012c341506ee1939e56084F43Ae5dbCe224Ce2af) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      values.$pastUpgrades.1.2:
+        ["0x09A25EB69b0d2858800A769Da90934371C7174A9"]
      values.$pastUpgrades.1.1:
-        ["0x09A25EB69b0d2858800A769Da90934371C7174A9"]
+        "0x1b66f25b410f8283ab6936b8843d2dce0ce8bfb64022af3cb0cdac4c693fafbf"
      values.$pastUpgrades.0.2:
+        ["0x012c341506ee1939e56084F43Ae5dbCe224Ce2af"]
      values.$pastUpgrades.0.1:
-        ["0x012c341506ee1939e56084F43Ae5dbCe224Ce2af"]
+        "0x185c0814ce1d86690eb60ee5c74354ea592d408a2622c7fb89e23a298c7b7b39"
    }
```

```diff
    contract SystemConfig (0x0b4cfc49aCc656CE6D03CB0794860Da92bE3E8ec) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      values.$pastUpgrades.0.2:
+        ["0x188370729584052260214A6e0847B9810e3a120d"]
      values.$pastUpgrades.0.1:
-        ["0x188370729584052260214A6e0847B9810e3a120d"]
+        "0x29cca6431f8855382846890f2d96b022bc575e35d5b599d370343a9d6bfd6563"
    }
```

```diff
    contract OptimismPortal (0x639F2AECE398Aa76b07e59eF6abe2cFe32bacb68) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      values.$pastUpgrades.0.2:
+        ["0x9FC6A608B45c6F129650c26a34bbe5d26959E75e"]
      values.$pastUpgrades.0.1:
-        ["0x9FC6A608B45c6F129650c26a34bbe5d26959E75e"]
+        "0x0fcde8d306862af703a65ee04c4a237e4b60bd7d07b05eea7fe86250d28674d8"
    }
```

```diff
    contract L2OutputOracle (0xB09DC08428C8b4EFB4ff9C0827386CDF34277996) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      values.$pastUpgrades.0.2:
+        ["0x1F61619E8c228fb67204cD157A3e50Aa6690FbF6"]
      values.$pastUpgrades.0.1:
-        ["0x1F61619E8c228fb67204cD157A3e50Aa6690FbF6"]
+        "0x085b93df4b2466060df8a5b0b9d89e228e45993a2887e0d038416a61d816660c"
    }
```

```diff
    contract L1ERC721Bridge (0xd5e3eDf5b68135D559D572E26bF863FBC1950033) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      values.$pastUpgrades.0.2:
+        ["0x132b3456300332d488f946B818eB9512931eBCAa"]
      values.$pastUpgrades.0.1:
-        ["0x132b3456300332d488f946B818eB9512931eBCAa"]
+        "0xb3faea51544a91e99f889a9eceb7a0396d9c8eb4b559e5970dee5e699b3bc369"
    }
```

Generated with discovered.json: 0xe60054e5bcb3a7d5b5bb184cde4ce0561124d8d0

# Diff at Wed, 16 Oct 2024 11:34:40 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@a3d139b799cc0b28e5e912febb17464d4e5aef5d block: 20775882
- current block number: 20775882

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20775882 (main branch discovery), not current.

```diff
    contract SystemConfig (0x0b4cfc49aCc656CE6D03CB0794860Da92bE3E8ec) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      issuedPermissions.2:
+        {"permission":"upgrade","target":"0x4a4962275DF8C60a80d3a25faEc5AA7De116A746","via":[{"address":"0x75a223Fb459461B9Fa61dd25109EA05522b4b492","delay":0}]}
      issuedPermissions.1.permission:
-        "upgrade"
+        "sequence"
      issuedPermissions.1.target:
-        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
+        "0x6079e9c37b87fE06D0bDe2431a0fa309826c9b67"
      issuedPermissions.1.via.0:
-        {"address":"0x75a223Fb459461B9Fa61dd25109EA05522b4b492","delay":0}
    }
```

```diff
    contract ChallengerMultisig (0x1B1ecDdbd5F9601b34262Aa3Ca346209E61aA68f) {
    +++ description: None
      roles:
-        ["Challenger","Guardian"]
      receivedPermissions:
+        [{"permission":"challenge","target":"0xB09DC08428C8b4EFB4ff9C0827386CDF34277996"},{"permission":"guard","target":"0x639F2AECE398Aa76b07e59eF6abe2cFe32bacb68"}]
    }
```

```diff
    contract OptimismPortal (0x639F2AECE398Aa76b07e59eF6abe2cFe32bacb68) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      issuedPermissions.1:
+        {"permission":"upgrade","target":"0x4a4962275DF8C60a80d3a25faEc5AA7De116A746","via":[{"address":"0x75a223Fb459461B9Fa61dd25109EA05522b4b492","delay":0}]}
      issuedPermissions.0.permission:
-        "upgrade"
+        "guard"
      issuedPermissions.0.target:
-        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
+        "0x1B1ecDdbd5F9601b34262Aa3Ca346209E61aA68f"
      issuedPermissions.0.via.0:
-        {"address":"0x75a223Fb459461B9Fa61dd25109EA05522b4b492","delay":0}
    }
```

```diff
    contract L2OutputOracle (0xB09DC08428C8b4EFB4ff9C0827386CDF34277996) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      issuedPermissions.2:
+        {"permission":"upgrade","target":"0x4a4962275DF8C60a80d3a25faEc5AA7De116A746","via":[{"address":"0x75a223Fb459461B9Fa61dd25109EA05522b4b492","delay":0}]}
      issuedPermissions.1:
+        {"permission":"propose","target":"0xAF24199C29D5cc3fd298356137913A42847eA690","via":[]}
      issuedPermissions.0.permission:
-        "upgrade"
+        "challenge"
      issuedPermissions.0.target:
-        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
+        "0x1B1ecDdbd5F9601b34262Aa3Ca346209E61aA68f"
      issuedPermissions.0.via.0:
-        {"address":"0x75a223Fb459461B9Fa61dd25109EA05522b4b492","delay":0}
    }
```

Generated with discovered.json: 0x252f9cf619a5690eea38f8736191c3bb5d829384

# Diff at Mon, 14 Oct 2024 10:49:15 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1afc77ff111ceb0970e7d09efcc7b2f376b0c281 block: 20775882
- current block number: 20775882

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20775882 (main branch discovery), not current.

```diff
    contract L1CrossDomainMessenger (0x012c341506ee1939e56084F43Ae5dbCe224Ce2af) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      sourceHashes:
+        ["0x20a2eb4d3677fc8a15e944f7b1843acd01b2e92acdc4c7a7f7a35b07b891149b","0xebfb36a18bcaa176678925149b43fdc5f9f943d98a6405ae1cbc26f4c168ff88"]
    }
```

```diff
    contract SystemConfig (0x0b4cfc49aCc656CE6D03CB0794860Da92bE3E8ec) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      sourceHashes:
+        ["0x2cdcfef705094aaac53d507bad64d27b48ea5a9c11a7fadffacc192aab7a823f","0x29908eb7685943ff431cd384af851ce36a30997bbad880f9b4385bfc3abb86a2"]
    }
```

```diff
    contract L1StandardBridge (0x12d4E64E1B46d27A00fe392653A894C1dd36fb80) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token.
      sourceHashes:
+        ["0xbfb58685ff2f2f07eaa01a3c4e3c33c97686bfd3ae7c50c49f9da6ef5098cb31","0x79abdbd90460fe2ac0535b5cb7b4c45284322b49a0a090d1c509cdaf35dbc87e"]
    }
```

```diff
    contract AddressManager (0x15A52Fed1c448028A240b603dD93f2697E12Dc82) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      sourceHashes:
+        ["0xdc86a850f11dc2b5c0472a05d0e3c14f239baf2c3b1ab19631591b0827985380"]
    }
```

```diff
    contract ChallengerMultisig (0x1B1ecDdbd5F9601b34262Aa3Ca346209E61aA68f) {
    +++ description: None
      sourceHashes:
+        ["0x81a7349eebb98ac33b0bc6842e3cb258034a8f2a4ba004570bb8e2e25947f9ff","0xd42bbf9f7dcd3720a7fc6bdc6edfdfae8800a37d6dd4decfa0ef6ca4a2e88940"]
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
    contract OptimismPortal (0x639F2AECE398Aa76b07e59eF6abe2cFe32bacb68) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      sourceHashes:
+        ["0x2cdcfef705094aaac53d507bad64d27b48ea5a9c11a7fadffacc192aab7a823f","0xd7fe53899c31d6d8e73b6724694736dc3c3c4ebc8f4ddbe989fe9d3dba26692d"]
    }
```

```diff
    contract ProxyAdmin (0x75a223Fb459461B9Fa61dd25109EA05522b4b492) {
    +++ description: None
      template:
-        "opstack/ProxyAdmin"
+        "global/ProxyAdmin"
      sourceHashes:
+        ["0x96d2f0fa1bd83ebd61ba6a2351c64c7fda7aa580b11ea67bb6bf4338e5c28512"]
    }
```

```diff
    contract L2OutputOracle (0xB09DC08428C8b4EFB4ff9C0827386CDF34277996) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      sourceHashes:
+        ["0x2cdcfef705094aaac53d507bad64d27b48ea5a9c11a7fadffacc192aab7a823f","0xcca8986d0789aa489ba57cd234e886bd92cb5a0d477e1f5ae5e6e030e15fb183"]
    }
```

```diff
    contract L1ERC721Bridge (0xd5e3eDf5b68135D559D572E26bF863FBC1950033) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      sourceHashes:
+        ["0x2cdcfef705094aaac53d507bad64d27b48ea5a9c11a7fadffacc192aab7a823f","0x95c690f70db8f82a05347087d704333c180048757ff015d74a5b186c1b6b24ab"]
    }
```

Generated with discovered.json: 0xc8e362cfab6976d0bdb353b1a3a37c59c1821d0c

# Diff at Wed, 09 Oct 2024 13:08:54 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@37683e2b3d0587372f886eef49e921277810c8bf block: 20775882
- current block number: 20775882

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20775882 (main branch discovery), not current.

```diff
    contract AddressManager (0x15A52Fed1c448028A240b603dD93f2697E12Dc82) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      issuedPermissions.0.via.0.description:
+        "set and change address mappings."
      descriptions:
+        ["Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts."]
    }
```

```diff
    contract ConduitMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      receivedPermissions.1.description:
+        "set and change address mappings."
    }
```

```diff
    contract ProxyAdmin (0x75a223Fb459461B9Fa61dd25109EA05522b4b492) {
    +++ description: None
      directlyReceivedPermissions.0.description:
+        "set and change address mappings."
    }
```

Generated with discovered.json: 0x427b880b693cc0c69fe47d766327b036991c22a8

# Diff at Tue, 01 Oct 2024 10:49:38 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bd754dc73c66120164006054f8d25c5fae9cd910 block: 20775882
- current block number: 20775882

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20775882 (main branch discovery), not current.

```diff
    contract L1CrossDomainMessenger (0x012c341506ee1939e56084F43Ae5dbCe224Ce2af) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      values.$pastUpgrades:
+        [["2024-01-23T16:30:47.000Z",["0x012c341506ee1939e56084F43Ae5dbCe224Ce2af"]],["2024-01-23T16:30:59.000Z",["0x09A25EB69b0d2858800A769Da90934371C7174A9"]]]
      values.$upgradeCount:
+        2
    }
```

```diff
    contract SystemConfig (0x0b4cfc49aCc656CE6D03CB0794860Da92bE3E8ec) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      values.$pastUpgrades:
+        [["2024-01-23T16:30:59.000Z",["0x188370729584052260214A6e0847B9810e3a120d"]]]
    }
```

```diff
    contract L1StandardBridge (0x12d4E64E1B46d27A00fe392653A894C1dd36fb80) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token.
      values.$pastUpgrades:
+        []
    }
```

```diff
    contract OptimismPortal (0x639F2AECE398Aa76b07e59eF6abe2cFe32bacb68) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      values.$pastUpgrades:
+        [["2024-01-23T16:30:59.000Z",["0x9FC6A608B45c6F129650c26a34bbe5d26959E75e"]]]
    }
```

```diff
    contract L2OutputOracle (0xB09DC08428C8b4EFB4ff9C0827386CDF34277996) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      values.$pastUpgrades:
+        [["2024-01-23T16:30:59.000Z",["0x1F61619E8c228fb67204cD157A3e50Aa6690FbF6"]]]
    }
```

```diff
    contract L1ERC721Bridge (0xd5e3eDf5b68135D559D572E26bF863FBC1950033) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      values.$pastUpgrades:
+        [["2024-01-23T16:30:59.000Z",["0x132b3456300332d488f946B818eB9512931eBCAa"]]]
    }
```

Generated with discovered.json: 0x996461c8378fd4ac2a35be15ba17bbdef20f577c

# Diff at Wed, 18 Sep 2024 11:31:42 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@eb09774f0f9d9322f2117dfdfda7d4bb095f6c52 block: 19927693
- current block number: 20775882

## Description

Config/shape related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19927693 (main branch discovery), not current.

```diff
    contract L1CrossDomainMessenger (0x012c341506ee1939e56084F43Ae5dbCe224Ce2af) {
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
    contract SystemConfig (0x0b4cfc49aCc656CE6D03CB0794860Da92bE3E8ec) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      issuedPermissions.1:
+        {"permission":"upgrade","target":"0x4a4962275DF8C60a80d3a25faEc5AA7De116A746","via":[{"address":"0x75a223Fb459461B9Fa61dd25109EA05522b4b492","delay":0}]}
      issuedPermissions.0.permission:
-        "upgrade"
+        "configure"
      issuedPermissions.0.via.0:
-        {"address":"0x75a223Fb459461B9Fa61dd25109EA05522b4b492","delay":0}
      template:
+        "opstack/SystemConfig"
      descriptions:
+        ["Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address."]
      fieldMeta:
+        {"gasLimit":{"severity":"LOW","description":"Gas limit for blocks on L2."}}
    }
```

```diff
    contract L1StandardBridge (0x12d4E64E1B46d27A00fe392653A894C1dd36fb80) {
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
    contract ChallengerMultisig (0x1B1ecDdbd5F9601b34262Aa3Ca346209E61aA68f) {
    +++ description: None
      roles:
+        ["Challenger","Guardian"]
    }
```

```diff
    contract ConduitMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      receivedPermissions.6:
+        {"permission":"upgrade","target":"0xd5e3eDf5b68135D559D572E26bF863FBC1950033","via":[{"address":"0x75a223Fb459461B9Fa61dd25109EA05522b4b492"}]}
      receivedPermissions.5.target:
-        "0xd5e3eDf5b68135D559D572E26bF863FBC1950033"
+        "0xB09DC08428C8b4EFB4ff9C0827386CDF34277996"
      receivedPermissions.4.target:
-        "0xB09DC08428C8b4EFB4ff9C0827386CDF34277996"
+        "0x639F2AECE398Aa76b07e59eF6abe2cFe32bacb68"
      receivedPermissions.3.target:
-        "0x639F2AECE398Aa76b07e59eF6abe2cFe32bacb68"
+        "0x12d4E64E1B46d27A00fe392653A894C1dd36fb80"
      receivedPermissions.3.description:
+        "upgrading bridge implementation allows to access all funds and change every system component."
      receivedPermissions.2.target:
-        "0x12d4E64E1B46d27A00fe392653A894C1dd36fb80"
+        "0x0b4cfc49aCc656CE6D03CB0794860Da92bE3E8ec"
      receivedPermissions.1.permission:
-        "upgrade"
+        "configure"
      receivedPermissions.1.target:
-        "0x0b4cfc49aCc656CE6D03CB0794860Da92bE3E8ec"
+        "0x15A52Fed1c448028A240b603dD93f2697E12Dc82"
      receivedPermissions.0.target:
-        "0x15A52Fed1c448028A240b603dD93f2697E12Dc82"
+        "0x0b4cfc49aCc656CE6D03CB0794860Da92bE3E8ec"
      receivedPermissions.0.via:
-        [{"address":"0x75a223Fb459461B9Fa61dd25109EA05522b4b492"}]
      receivedPermissions.0.description:
+        "it can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system."
    }
```

```diff
    contract OptimismPortal (0x639F2AECE398Aa76b07e59eF6abe2cFe32bacb68) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      template:
+        "opstack/OptimismPortal"
      descriptions:
+        ["The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals."]
    }
```

```diff
    contract ProxyAdmin (0x75a223Fb459461B9Fa61dd25109EA05522b4b492) {
    +++ description: None
      directlyReceivedPermissions.2.description:
+        "upgrading bridge implementation allows to access all funds and change every system component."
    }
```

```diff
    contract L2OutputOracle (0xB09DC08428C8b4EFB4ff9C0827386CDF34277996) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      template:
+        "opstack/L2OutputOracle"
      descriptions:
+        ["Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots."]
    }
```

```diff
    contract L1ERC721Bridge (0xd5e3eDf5b68135D559D572E26bF863FBC1950033) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      template:
+        "opstack/L1ERC721Bridge"
      descriptions:
+        ["Used to bridge ERC-721 tokens from host chain to this chain."]
    }
```

Generated with discovered.json: 0xafb5da06b9f1c86060fdb372b0e3bc8af83de857

# Diff at Sun, 08 Sep 2024 17:17:49 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@fd881462cca0d7ef4519f907f3c6cfd5fe1cde8f block: 19927693
- current block number: 19927693

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19927693 (main branch discovery), not current.

```diff
    contract SystemConfig (0x0b4cfc49aCc656CE6D03CB0794860Da92bE3E8ec) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x75a223Fb459461B9Fa61dd25109EA05522b4b492"
+        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      issuedPermissions.0.via.0:
+        {"address":"0x75a223Fb459461B9Fa61dd25109EA05522b4b492","delay":0}
    }
```

```diff
    contract L1StandardBridge (0x12d4E64E1B46d27A00fe392653A894C1dd36fb80) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x75a223Fb459461B9Fa61dd25109EA05522b4b492"
+        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      issuedPermissions.0.via.0:
+        {"address":"0x75a223Fb459461B9Fa61dd25109EA05522b4b492","delay":0}
    }
```

```diff
    contract AddressManager (0x15A52Fed1c448028A240b603dD93f2697E12Dc82) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x75a223Fb459461B9Fa61dd25109EA05522b4b492"
+        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      issuedPermissions.0.via.0:
+        {"address":"0x75a223Fb459461B9Fa61dd25109EA05522b4b492","delay":0}
    }
```

```diff
    contract ConduitMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      descriptions:
-        ["It can act on behalf of 0x75a223Fb459461B9Fa61dd25109EA05522b4b492, inheriting its permissions."]
      receivedPermissions.5:
+        {"permission":"upgrade","target":"0xd5e3eDf5b68135D559D572E26bF863FBC1950033","via":[{"address":"0x75a223Fb459461B9Fa61dd25109EA05522b4b492"}]}
      receivedPermissions.4:
+        {"permission":"upgrade","target":"0xB09DC08428C8b4EFB4ff9C0827386CDF34277996","via":[{"address":"0x75a223Fb459461B9Fa61dd25109EA05522b4b492"}]}
      receivedPermissions.3:
+        {"permission":"upgrade","target":"0x639F2AECE398Aa76b07e59eF6abe2cFe32bacb68","via":[{"address":"0x75a223Fb459461B9Fa61dd25109EA05522b4b492"}]}
      receivedPermissions.2:
+        {"permission":"upgrade","target":"0x12d4E64E1B46d27A00fe392653A894C1dd36fb80","via":[{"address":"0x75a223Fb459461B9Fa61dd25109EA05522b4b492"}]}
      receivedPermissions.1:
+        {"permission":"upgrade","target":"0x0b4cfc49aCc656CE6D03CB0794860Da92bE3E8ec","via":[{"address":"0x75a223Fb459461B9Fa61dd25109EA05522b4b492"}]}
      receivedPermissions.0.target:
-        "0x75a223Fb459461B9Fa61dd25109EA05522b4b492"
+        "0x15A52Fed1c448028A240b603dD93f2697E12Dc82"
      receivedPermissions.0.via:
+        [{"address":"0x75a223Fb459461B9Fa61dd25109EA05522b4b492"}]
      directlyReceivedPermissions:
+        [{"permission":"act","target":"0x75a223Fb459461B9Fa61dd25109EA05522b4b492"}]
    }
```

```diff
    contract OptimismPortal (0x639F2AECE398Aa76b07e59eF6abe2cFe32bacb68) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x75a223Fb459461B9Fa61dd25109EA05522b4b492"
+        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      issuedPermissions.0.via.0:
+        {"address":"0x75a223Fb459461B9Fa61dd25109EA05522b4b492","delay":0}
    }
```

```diff
    contract ProxyAdmin (0x75a223Fb459461B9Fa61dd25109EA05522b4b492) {
    +++ description: None
      issuedPermissions:
-        [{"permission":"configure","target":"0x4a4962275DF8C60a80d3a25faEc5AA7De116A746","via":[]}]
      receivedPermissions:
-        [{"permission":"configure","target":"0x15A52Fed1c448028A240b603dD93f2697E12Dc82"},{"permission":"upgrade","target":"0x0b4cfc49aCc656CE6D03CB0794860Da92bE3E8ec"},{"permission":"upgrade","target":"0x12d4E64E1B46d27A00fe392653A894C1dd36fb80"},{"permission":"upgrade","target":"0x639F2AECE398Aa76b07e59eF6abe2cFe32bacb68"},{"permission":"upgrade","target":"0xB09DC08428C8b4EFB4ff9C0827386CDF34277996"},{"permission":"upgrade","target":"0xd5e3eDf5b68135D559D572E26bF863FBC1950033"}]
      directlyReceivedPermissions:
+        [{"permission":"configure","target":"0x15A52Fed1c448028A240b603dD93f2697E12Dc82"},{"permission":"upgrade","target":"0x0b4cfc49aCc656CE6D03CB0794860Da92bE3E8ec"},{"permission":"upgrade","target":"0x12d4E64E1B46d27A00fe392653A894C1dd36fb80"},{"permission":"upgrade","target":"0x639F2AECE398Aa76b07e59eF6abe2cFe32bacb68"},{"permission":"upgrade","target":"0xB09DC08428C8b4EFB4ff9C0827386CDF34277996"},{"permission":"upgrade","target":"0xd5e3eDf5b68135D559D572E26bF863FBC1950033"}]
    }
```

```diff
    contract L2OutputOracle (0xB09DC08428C8b4EFB4ff9C0827386CDF34277996) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x75a223Fb459461B9Fa61dd25109EA05522b4b492"
+        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      issuedPermissions.0.via.0:
+        {"address":"0x75a223Fb459461B9Fa61dd25109EA05522b4b492","delay":0}
    }
```

```diff
    contract L1ERC721Bridge (0xd5e3eDf5b68135D559D572E26bF863FBC1950033) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x75a223Fb459461B9Fa61dd25109EA05522b4b492"
+        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      issuedPermissions.0.via.0:
+        {"address":"0x75a223Fb459461B9Fa61dd25109EA05522b4b492","delay":0}
    }
```

Generated with discovered.json: 0x37a184859ae9acb69dd9df08530d7987a6ef0cb2

# Diff at Fri, 30 Aug 2024 07:51:01 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@6c1bd1f41fadf5f2cb1c1805b5a2c6138a3ed35a block: 19927693
- current block number: 19927693

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19927693 (main branch discovery), not current.

```diff
    contract ConduitMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: It can act on behalf of 0x75a223Fb459461B9Fa61dd25109EA05522b4b492, inheriting its permissions.
      receivedPermissions.0.via:
-        []
    }
```

```diff
    contract ProxyAdmin (0x75a223Fb459461B9Fa61dd25109EA05522b4b492) {
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

Generated with discovered.json: 0x80cb2e9800ed42e3be9948aee89921179784643f

# Diff at Fri, 23 Aug 2024 09:51:04 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@67597c7d6c810bc726594446890178150240711e block: 19927693
- current block number: 19927693

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19927693 (main branch discovery), not current.

```diff
    contract SystemConfig (0x0b4cfc49aCc656CE6D03CB0794860Da92bE3E8ec) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract L1StandardBridge (0x12d4E64E1B46d27A00fe392653A894C1dd36fb80) {
    +++ description: None
      values.$upgradeCount:
+        0
    }
```

```diff
    contract OptimismPortal (0x639F2AECE398Aa76b07e59eF6abe2cFe32bacb68) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract L2OutputOracle (0xB09DC08428C8b4EFB4ff9C0827386CDF34277996) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract L1ERC721Bridge (0xd5e3eDf5b68135D559D572E26bF863FBC1950033) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

Generated with discovered.json: 0x8d36cce96460a07728a8b7303a806d9ea4996f5a

# Diff at Wed, 21 Aug 2024 10:01:50 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@2f6dde3357bf5d79196b6e94f79d853a6c4ec72b block: 19927693
- current block number: 19927693

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19927693 (main branch discovery), not current.

```diff
    contract SystemConfig (0x0b4cfc49aCc656CE6D03CB0794860Da92bE3E8ec) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x75a223Fb459461B9Fa61dd25109EA05522b4b492","via":[]}]
    }
```

```diff
    contract L1StandardBridge (0x12d4E64E1B46d27A00fe392653A894C1dd36fb80) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x75a223Fb459461B9Fa61dd25109EA05522b4b492","via":[]}]
    }
```

```diff
    contract AddressManager (0x15A52Fed1c448028A240b603dD93f2697E12Dc82) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"configure","target":"0x75a223Fb459461B9Fa61dd25109EA05522b4b492","via":[]}]
    }
```

```diff
    contract ConduitMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: It can act on behalf of 0x75a223Fb459461B9Fa61dd25109EA05522b4b492, inheriting its permissions.
      assignedPermissions:
-        {"configure":["0x75a223Fb459461B9Fa61dd25109EA05522b4b492"]}
      receivedPermissions:
+        [{"permission":"configure","target":"0x75a223Fb459461B9Fa61dd25109EA05522b4b492","via":[]}]
    }
```

```diff
    contract OptimismPortal (0x639F2AECE398Aa76b07e59eF6abe2cFe32bacb68) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x75a223Fb459461B9Fa61dd25109EA05522b4b492","via":[]}]
    }
```

```diff
    contract ProxyAdmin (0x75a223Fb459461B9Fa61dd25109EA05522b4b492) {
    +++ description: None
      assignedPermissions:
-        {"upgrade":["0x0b4cfc49aCc656CE6D03CB0794860Da92bE3E8ec","0x12d4E64E1B46d27A00fe392653A894C1dd36fb80","0x639F2AECE398Aa76b07e59eF6abe2cFe32bacb68","0xB09DC08428C8b4EFB4ff9C0827386CDF34277996","0xd5e3eDf5b68135D559D572E26bF863FBC1950033"],"configure":["0x15A52Fed1c448028A240b603dD93f2697E12Dc82"]}
      issuedPermissions:
+        [{"permission":"configure","target":"0x4a4962275DF8C60a80d3a25faEc5AA7De116A746","via":[]}]
      receivedPermissions:
+        [{"permission":"configure","target":"0x15A52Fed1c448028A240b603dD93f2697E12Dc82","via":[]},{"permission":"upgrade","target":"0x0b4cfc49aCc656CE6D03CB0794860Da92bE3E8ec","via":[]},{"permission":"upgrade","target":"0x12d4E64E1B46d27A00fe392653A894C1dd36fb80","via":[]},{"permission":"upgrade","target":"0x639F2AECE398Aa76b07e59eF6abe2cFe32bacb68","via":[]},{"permission":"upgrade","target":"0xB09DC08428C8b4EFB4ff9C0827386CDF34277996","via":[]},{"permission":"upgrade","target":"0xd5e3eDf5b68135D559D572E26bF863FBC1950033","via":[]}]
    }
```

```diff
    contract L2OutputOracle (0xB09DC08428C8b4EFB4ff9C0827386CDF34277996) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x75a223Fb459461B9Fa61dd25109EA05522b4b492","via":[]}]
    }
```

```diff
    contract L1ERC721Bridge (0xd5e3eDf5b68135D559D572E26bF863FBC1950033) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x75a223Fb459461B9Fa61dd25109EA05522b4b492","via":[]}]
    }
```

Generated with discovered.json: 0xa51c5d012bba6ff29847e956447b87255769d0ef

# Diff at Fri, 09 Aug 2024 11:58:23 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bf40aa32f030fd312056ca0ef198c8550467d1d7 block: 19927693
- current block number: 19927693

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19927693 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x75a223Fb459461B9Fa61dd25109EA05522b4b492) {
    +++ description: None
      assignedPermissions.upgrade.4:
-        "0x0b4cfc49aCc656CE6D03CB0794860Da92bE3E8ec"
+        "0xd5e3eDf5b68135D559D572E26bF863FBC1950033"
      assignedPermissions.upgrade.2:
-        "0xd5e3eDf5b68135D559D572E26bF863FBC1950033"
+        "0x639F2AECE398Aa76b07e59eF6abe2cFe32bacb68"
      assignedPermissions.upgrade.0:
-        "0x639F2AECE398Aa76b07e59eF6abe2cFe32bacb68"
+        "0x0b4cfc49aCc656CE6D03CB0794860Da92bE3E8ec"
    }
```

Generated with discovered.json: 0x335e8ee095e5a61d2c73e2c2dba3ee4287a347f6

# Diff at Fri, 09 Aug 2024 10:08:29 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f0da1d0aab7bc6b3b5e54e7e93480bd98e57035 block: 19927693
- current block number: 19927693

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19927693 (main branch discovery), not current.

```diff
    contract ChallengerMultisig (0x1B1ecDdbd5F9601b34262Aa3Ca346209E61aA68f) {
    +++ description: None
      values.$multisigThreshold:
-        "4 of 6 (67%)"
      values.getOwners:
-        ["0xefCf0c8faFB425997870f845e26fC6cA6EE6dD5C","0x3840f487A17A41100DD1Bf0946c34f132a57Fd5f","0xa0C600a6e85bf225958FFAcC70B5FDDF9A059038","0x05F0c4e31e2ab24f5CF20b1B9d2FCe2c3d48BB9C","0xcdD7FE91F5e2dCf8a0B30C4127c8D54e3F2a469c","0xE3a87D0eE19c66d0d22F2AEf50c78d4C4FEeA5FB"]
      values.getThreshold:
-        4
      values.$members:
+        ["0xefCf0c8faFB425997870f845e26fC6cA6EE6dD5C","0x3840f487A17A41100DD1Bf0946c34f132a57Fd5f","0xa0C600a6e85bf225958FFAcC70B5FDDF9A059038","0x05F0c4e31e2ab24f5CF20b1B9d2FCe2c3d48BB9C","0xcdD7FE91F5e2dCf8a0B30C4127c8D54e3F2a469c","0xE3a87D0eE19c66d0d22F2AEf50c78d4C4FEeA5FB"]
      values.$threshold:
+        4
      values.multisigThreshold:
+        "4 of 6 (67%)"
    }
```

```diff
    contract ConduitMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: It can act on behalf of 0x75a223Fb459461B9Fa61dd25109EA05522b4b492, inheriting its permissions.
      assignedPermissions.owner:
-        ["0x75a223Fb459461B9Fa61dd25109EA05522b4b492"]
      assignedPermissions.configure:
+        ["0x75a223Fb459461B9Fa61dd25109EA05522b4b492"]
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
    contract ProxyAdmin (0x75a223Fb459461B9Fa61dd25109EA05522b4b492) {
    +++ description: None
      assignedPermissions.admin:
-        ["0x0b4cfc49aCc656CE6D03CB0794860Da92bE3E8ec","0x12d4E64E1B46d27A00fe392653A894C1dd36fb80","0x639F2AECE398Aa76b07e59eF6abe2cFe32bacb68","0xB09DC08428C8b4EFB4ff9C0827386CDF34277996","0xd5e3eDf5b68135D559D572E26bF863FBC1950033"]
      assignedPermissions.owner:
-        ["0x15A52Fed1c448028A240b603dD93f2697E12Dc82"]
      assignedPermissions.upgrade:
+        ["0x639F2AECE398Aa76b07e59eF6abe2cFe32bacb68","0x12d4E64E1B46d27A00fe392653A894C1dd36fb80","0xd5e3eDf5b68135D559D572E26bF863FBC1950033","0xB09DC08428C8b4EFB4ff9C0827386CDF34277996","0x0b4cfc49aCc656CE6D03CB0794860Da92bE3E8ec"]
      assignedPermissions.configure:
+        ["0x15A52Fed1c448028A240b603dD93f2697E12Dc82"]
    }
```

Generated with discovered.json: 0xd5e828b274e743cfd2c6c37c67ffe84261597d28

# Diff at Thu, 18 Jul 2024 10:29:29 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@d89fe52cb65d643cef712d1d7910564a7acf2dce block: 19927693
- current block number: 19927693

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19927693 (main branch discovery), not current.

```diff
    contract ConduitMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      descriptions:
+        ["It can act on behalf of 0x75a223Fb459461B9Fa61dd25109EA05522b4b492, inheriting its permissions."]
    }
```

Generated with discovered.json: 0x8c34e30ec59ca39871f637a25774caf5e293d8dc

# Diff at Wed, 22 May 2024 20:06:11 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@bac4efad06804152ae97853892e122a801bbc509 block: 19918740
- current block number: 19927693

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

Generated with discovered.json: 0x0014cacc2439b6116f5eab2dfd9297c6443ff925

# Diff at Tue, 21 May 2024 14:00:40 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@c032520e456d0e6bee8b65e420ff7dba9f36bd48 block: 19531414
- current block number: 19918740

## Description

Name change.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19531414 (main branch discovery), not current.

```diff
    contract Ancient8Multisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      name:
-        "Ancient8Multisig"
+        "ConduitMultisig"
    }
```

Generated with discovered.json: 0x773dec9f626d22f93d9330da1369977fd53d9b27

# Diff at Thu, 28 Mar 2024 08:27:31 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@867de6120241d47b66bf76f83c490408eb3595b0 block: 19412062
- current block number: 19531414

## Description

Update discovery to include the multisig threshold.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19412062 (main branch discovery), not current.

```diff
    contract ChallengerMultisig (0x1B1ecDdbd5F9601b34262Aa3Ca346209E61aA68f) {
    +++ description: None
      upgradeability.threshold:
+        "4 of 6 (67%)"
    }
```

```diff
    contract Ancient8Multisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      upgradeability.threshold:
+        "3 of 5 (60%)"
    }
```

Generated with discovered.json: 0x425613a7645f93f490c32e837884a2039f9afa63

# Diff at Mon, 11 Mar 2024 13:10:22 GMT:

- author: Michał Sobieraj-Jakubiec (<michalsidzej@gmail.com>)
- comparing to: main@64454506aee2b4b4e15b121f096369e92ec4cf20 block: 19369992
- current block number: 19412062

## Description

Update OP stack DA handler

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19369992 (main branch discovery), not current.

```diff
    contract SystemConfig (0x0b4cfc49aCc656CE6D03CB0794860Da92bE3E8ec) {
    +++ description: None
      values.opStackDA.isSequencerSendingBlobTx:
+        false
    }
```

Generated with discovered.json: 0x573721713ae6ff81bafd1346c53f2ddd8f194913

# Diff at Mon, 26 Feb 2024 09:48:06 GMT:

- author: Radina Talanova (<nt.radina@gmail.com>)
- current block number: 19310944

## Description

Update discovery to include the multisig threshold.

## Initial discovery

```diff
+   Status: CREATED
    contract L1CrossDomainMessenger (0x012c341506ee1939e56084F43Ae5dbCe224Ce2af) {
    }
```

```diff
+   Status: CREATED
    contract SystemConfig (0x0b4cfc49aCc656CE6D03CB0794860Da92bE3E8ec) {
    }
```

```diff
+   Status: CREATED
    contract L1StandardBridge (0x12d4E64E1B46d27A00fe392653A894C1dd36fb80) {
    }
```

```diff
+   Status: CREATED
    contract AddressManager (0x15A52Fed1c448028A240b603dD93f2697E12Dc82) {
    }
```

```diff
+   Status: CREATED
    contract ChallengerMultisig (0x1B1ecDdbd5F9601b34262Aa3Ca346209E61aA68f) {
    }
```

```diff
+   Status: CREATED
    contract Ancient8Multisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    }
```

```diff
+   Status: CREATED
    contract OptimismPortal (0x639F2AECE398Aa76b07e59eF6abe2cFe32bacb68) {
    }
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x75a223Fb459461B9Fa61dd25109EA05522b4b492) {
    }
```

```diff
+   Status: CREATED
    contract L2OutputOracle (0xB09DC08428C8b4EFB4ff9C0827386CDF34277996) {
    }
```

```diff
+   Status: CREATED
    contract L1ERC721Bridge (0xd5e3eDf5b68135D559D572E26bF863FBC1950033) {
    }
```
