Generated with discovered.json: 0x255a08bffbc6e5c2d0ddb3d6cf39a7f41892bb61

# Diff at Fri, 03 Oct 2025 08:42:37 GMT:

- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@e647409961cd173771dcfcaeb808991c99e73911 block: 1756214657
- current timestamp: 1759480887

## Description

Member removed from multisig.

## Watched changes

```diff
    contract Conduit Multisig 1 (eth:0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      values.$members.2:
-        "eth:0x50930d652266EF4127FA3A1906B7Cb9951076628"
      values.multisigThreshold:
-        "4 of 11 (36%)"
+        "4 of 10 (40%)"
    }
```

Generated with discovered.json: 0x46ad5e1ae7eda151d480d586c35932e21f9cea54

# Diff at Mon, 15 Sep 2025 09:50:29 GMT:

- author: Sergey Shemyakov (<sergey.shemyakov@l2beat.com>)
- comparing to: main@37882e40cb6029f3a2ae2bb177048e3e846b833d block: 1756214657
- current timestamp: 1756214657

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1756214657 (main branch discovery), not current.

```diff
    contract DisputeGameFactory (eth:0xD2922A726501f027a5a5AC122BEc92bCfb437662) {
    +++ description: The dispute game factory allows the creation of dispute games, used to propose state roots and eventually challenge them.
+++ severity: HIGH
      values.gameImpls.2:
+        "eth:0x0000000000000000000000000000000000000000"
+++ severity: HIGH
      values.gameImpls.3:
+        "eth:0x0000000000000000000000000000000000000000"
    }
```

Generated with discovered.json: 0x9cc1c286f26fd71b84c8e35b10e3775ced8308c0

# Diff at Mon, 01 Sep 2025 10:01:10 GMT:

Merge mark

Generated with discovered.json: 0xf1986265c50fec067e4d26d5d42a34a4deffab03

# Diff at Tue, 26 Aug 2025 13:30:05 GMT:

- chain: ethereum
- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@e10932be0db538f3a760bbc29232375f08915af7 block: 1755009465
- current timestamp: 1756214657

## Description

Conduit msig: removed one address

## Watched changes

```diff
    contract Conduit Multisig 1 (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      values.$members.2:
-        "eth:0x860e06Fe384D1A3340111e7D142E02642178c053"
      values.multisigThreshold:
-        "4 of 12 (33%)"
+        "4 of 11 (36%)"
    }
```

Generated with discovered.json: 0x550389e52a29a9f2bf7e5119c3841815e202eb8f

# Diff at Tue, 12 Aug 2025 14:41:22 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@e94498235c6c8b45d3e4bfb77316081ba540850a block: 1754910496
- current timestamp: 1755009465

## Description

Conduit Multisig 1 signer added.

## Watched changes

```diff
    contract Conduit Multisig 1 (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      values.$members.0:
+        "eth:0xFe0ab87ebE03DD0bF52DaF34Dfda6639c335e2d4"
      values.multisigThreshold:
-        "4 of 11 (36%)"
+        "4 of 12 (33%)"
    }
```

Generated with discovered.json: 0xaad92dd71754f968a0ef93c4d38edf9b9e83bdc1

# Diff at Mon, 11 Aug 2025 11:08:30 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@32817e35c9fe0ba1a1c24a734c37d91068b1565d block: 1753457471
- current timestamp: 1754910496

## Description

basefee scalar x3.

## Watched changes

```diff
    contract SystemConfig (0xC975862927797812371A9Fb631f83F8f5e2240D5) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      values.basefeeScalar:
-        100000
+        300000
    }
```

Generated with discovered.json: 0xe6b8ab68c41088a361aa2ea8cce5803feb63348c

# Diff at Fri, 25 Jul 2025 15:49:53 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@85b717d6efe0c0a7691beb49532a0ce49bb7634a block: 22975737
- current block number: 22997066

## Description

Conduit: Optiportal2 upgrade (permissioned gametype). All contracts are using standard implementations.

absolute prestate: v1.6.0 (cannon64)

standard 3.5; 3.5; 7 finality conf

## Watched changes

```diff
    contract L1StandardBridge (0x2b3F201543adF73160bA42E1a5b7750024F30420) {
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
    EOA  (0x3d53Df1e69A32F98dFCcf23CCB689763E21A78bA) {
    +++ description: None
      receivedPermissions.0:
-        {"permission":"propose","from":"eth:0xB751A613f2Db932c6cdeF5048E6D2af05F9B98ED","role":".proposer"}
      receivedPermissions.1.role:
-        ".PROPOSER"
+        ".proposer"
      receivedPermissions.1.from:
-        "eth:0xB751A613f2Db932c6cdeF5048E6D2af05F9B98ED"
+        "eth:0x3E2986901f7149b61C2F11603b165BAf9D33d531"
    }
```

```diff
    contract Conduit Multisig 1 (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      receivedPermissions.0:
-        {"permission":"challenge","from":"eth:0xB751A613f2Db932c6cdeF5048E6D2af05F9B98ED","role":".challenger"}
      receivedPermissions.1.role:
-        ".CHALLENGER"
+        ".challenger"
      receivedPermissions.1.from:
-        "eth:0xB751A613f2Db932c6cdeF5048E6D2af05F9B98ED"
+        "eth:0x3E2986901f7149b61C2F11603b165BAf9D33d531"
      receivedPermissions.3:
-        {"permission":"guard","from":"eth:0x59625d1FE0Eeb8114a4d13c863978F39b3471781","role":".guardian"}
      receivedPermissions.4.description:
+        "can pull funds from the contract in case of emergency."
      receivedPermissions.4.role:
-        ".GUARDIAN"
+        ".owner"
      receivedPermissions.4.from:
-        "eth:0x59625d1FE0Eeb8114a4d13c863978F39b3471781"
+        "eth:0x6d4A27F3eb196E4d039a5EE5B510Cc4C89b7eA9a"
      receivedPermissions.4.permission:
-        "guard"
+        "interact"
      receivedPermissions.8:
+        {"permission":"upgrade","from":"eth:0x6d4A27F3eb196E4d039a5EE5B510Cc4C89b7eA9a","role":"admin","via":[{"address":"eth:0xc684075a7Cc997Aa2e72152c330BDAc73FeacbDF"}]}
      receivedPermissions.10.from:
-        "eth:0xB751A613f2Db932c6cdeF5048E6D2af05F9B98ED"
+        "eth:0x807c2aF3Ae99a20576B00b58327B594D47f837FB"
      receivedPermissions.12:
+        {"permission":"upgrade","from":"eth:0xD2922A726501f027a5a5AC122BEc92bCfb437662","role":"admin","via":[{"address":"eth:0xc684075a7Cc997Aa2e72152c330BDAc73FeacbDF"}]}
    }
```

```diff
    contract OptimismPortal2 (0x59625d1FE0Eeb8114a4d13c863978F39b3471781) {
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
+        ["2025-07-24T15:28:59.000Z","0x0ddcc8af073f449f419c8e7c22c408b8dd73c48e2da61136088ad965a0e8ddaf",["eth:0xd81f43eDBCAcb4c29a9bA38a13Ee5d79278270cC"]]
      values.$pastUpgrades.4:
+        ["2025-07-24T15:28:59.000Z","0x0ddcc8af073f449f419c8e7c22c408b8dd73c48e2da61136088ad965a0e8ddaf",["eth:0xe2F826324b2faf99E513D16D266c3F80aE87832B"]]
      values.$pastUpgrades.5:
+        ["2025-07-24T15:28:59.000Z","0x0ddcc8af073f449f419c8e7c22c408b8dd73c48e2da61136088ad965a0e8ddaf",["eth:0x2D7e764a0D9919e16983a46595CfA81fc34fa7Cd"]]
      values.$pastUpgrades.6:
+        ["2025-07-24T15:28:59.000Z","0x0ddcc8af073f449f419c8e7c22c408b8dd73c48e2da61136088ad965a0e8ddaf",["eth:0xB443Da3e07052204A02d630a8933dAc05a0d6fB4"]]
      values.$upgradeCount:
-        3
+        7
      values.GUARDIAN:
-        "eth:0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      values.L2_ORACLE:
-        "eth:0xB751A613f2Db932c6cdeF5048E6D2af05F9B98ED"
      values.l2Oracle:
-        "eth:0xB751A613f2Db932c6cdeF5048E6D2af05F9B98ED"
      values.SYSTEM_CONFIG:
-        "eth:0xC975862927797812371A9Fb631f83F8f5e2240D5"
      values.version:
-        "2.5.0"
+        "3.14.0"
      values.disputeGameFactory:
+        "eth:0xD2922A726501f027a5a5AC122BEc92bCfb437662"
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
+        1753370939
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
-   Status: DELETED
    contract L2OutputOracle (0xB751A613f2Db932c6cdeF5048E6D2af05F9B98ED)
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
```

```diff
    contract L1ERC721Bridge (0xC2C908F3226d9082130D8e48378CD2eFb08B521D) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      sourceHashes.1:
-        "0x482ec6e91304ac39a3fb4505634427bddfddee23b8e93a4f7f995ca5083ae3c3"
+        "0x28669b49da3effd51f0f9424ca9cdd455c5b9327c09a40c65fc06f114a6eb837"
      values.$implementation:
-        "eth:0xAE2AF01232a6c4a4d3012C5eC5b1b35059caF10d"
+        "eth:0x7aE1d3BD877a4C5CA257404ce26BE93A02C98013"
      values.$pastUpgrades.5:
+        ["2025-07-24T15:28:59.000Z","0x0ddcc8af073f449f419c8e7c22c408b8dd73c48e2da61136088ad965a0e8ddaf",["eth:0x276d3730f219f7ec22274f7263180b8452B46d47"]]
      values.$pastUpgrades.6:
+        ["2025-07-24T15:28:59.000Z","0x0ddcc8af073f449f419c8e7c22c408b8dd73c48e2da61136088ad965a0e8ddaf",["eth:0x7aE1d3BD877a4C5CA257404ce26BE93A02C98013"]]
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
    contract ProxyAdmin (0xc684075a7Cc997Aa2e72152c330BDAc73FeacbDF) {
    +++ description: None
      directlyReceivedPermissions.3:
+        {"permission":"upgrade","from":"eth:0x6d4A27F3eb196E4d039a5EE5B510Cc4C89b7eA9a","role":"admin"}
      directlyReceivedPermissions.3.from:
-        "eth:0xB751A613f2Db932c6cdeF5048E6D2af05F9B98ED"
+        "eth:0x807c2aF3Ae99a20576B00b58327B594D47f837FB"
      directlyReceivedPermissions.7:
+        {"permission":"upgrade","from":"eth:0xD2922A726501f027a5a5AC122BEc92bCfb437662","role":"admin"}
    }
```

```diff
    contract SystemConfig (0xC975862927797812371A9Fb631f83F8f5e2240D5) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      sourceHashes.1:
-        "0xc7135dbd2a53312d36df3f3ee91ce0a5a459ab8fc7725880a3a9c55a5fa0ed6c"
+        "0x921de6fc906d159fdcef862d2b9559063f5e7b9b7588fa5f33153360ddf296e7"
      values.$implementation:
-        "eth:0xAB9d6cB7A427c0765163A7f45BB91cAfe5f2D375"
+        "eth:0x340f923E5c7cbB2171146f64169EC9d5a9FfE647"
      values.$pastUpgrades.4:
+        ["2025-07-24T15:28:59.000Z","0x0ddcc8af073f449f419c8e7c22c408b8dd73c48e2da61136088ad965a0e8ddaf",["eth:0xd81f43eDBCAcb4c29a9bA38a13Ee5d79278270cC"]]
      values.$pastUpgrades.5:
+        ["2025-07-24T15:28:59.000Z","0x0ddcc8af073f449f419c8e7c22c408b8dd73c48e2da61136088ad965a0e8ddaf",["eth:0xAB9d6cB7A427c0765163A7f45BB91cAfe5f2D375"]]
      values.$pastUpgrades.6:
+        ["2025-07-24T15:28:59.000Z","0x0ddcc8af073f449f419c8e7c22c408b8dd73c48e2da61136088ad965a0e8ddaf",["eth:0x760C48C62A85045A6B69f07F4a9f22868659CbCc"]]
      values.$pastUpgrades.7:
+        ["2025-07-24T15:28:59.000Z","0x0ddcc8af073f449f419c8e7c22c408b8dd73c48e2da61136088ad965a0e8ddaf",["eth:0x340f923E5c7cbB2171146f64169EC9d5a9FfE647"]]
      values.$upgradeCount:
-        4
+        8
      values.basefeeScalar:
-        0
+        100000
      values.blobbasefeeScalar:
-        0
+        611590
      values.disputeGameFactory:
-        "eth:0x0000000000000000000000000000000000000000"
+        "eth:0xD2922A726501f027a5a5AC122BEc92bCfb437662"
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
+        {"l1CrossDomainMessenger":"eth:0xf80be9f7a74ab776b69d3F0dC5C08c39b3A0bA19","l1ERC721Bridge":"eth:0xC2C908F3226d9082130D8e48378CD2eFb08B521D","l1StandardBridge":"eth:0x2b3F201543adF73160bA42E1a5b7750024F30420","disputeGameFactory":"eth:0xD2922A726501f027a5a5AC122BEc92bCfb437662","optimismPortal":"eth:0x59625d1FE0Eeb8114a4d13c863978F39b3471781","optimismMintableERC20Factory":"eth:0xF02012065Ef6121a2A59EA0C590f42803Cf101EA"}
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
    contract OptimismMintableERC20Factory (0xF02012065Ef6121a2A59EA0C590f42803Cf101EA) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintableERC20 as this chain's representation of a token on the host chain, or vice-versa.
      sourceHashes.1:
-        "0x4c5ac4e53576924cabbd2a471f368a541bc3f4b1f53fa41a389692fcc62f6176"
+        "0x9650b4bba6299e410f01a369a95a2c57e1c3ca35f0d80c13f4f59fc468f370e5"
      values.$implementation:
-        "eth:0xE01efbeb1089D1d1dB9c6c8b135C934C0734c846"
+        "eth:0x5493f4677A186f64805fe7317D6993ba4863988F"
      values.$pastUpgrades.4:
+        ["2025-07-24T15:28:59.000Z","0x0ddcc8af073f449f419c8e7c22c408b8dd73c48e2da61136088ad965a0e8ddaf",["eth:0x5493f4677A186f64805fe7317D6993ba4863988F"]]
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
    contract L1CrossDomainMessenger (0xf80be9f7a74ab776b69d3F0dC5C08c39b3A0bA19) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      sourceHashes.1:
-        "0x1cc8a3b7de3d2c54c4706bb3f3015714d3b56647fc9fbfd6f8b068f5f63c1c25"
+        "0x03bcdc719cb7bd0a1377c01bb50b30a6122b308f673b7d7b15a3bb8628e6bd8c"
      values.$implementation:
-        "eth:0xD3494713A5cfaD3F5359379DfA074E2Ac8C6Fd65"
+        "eth:0x5D5a095665886119693F0B41d8DFeE78da033e8B"
      values.$pastUpgrades.6:
+        ["2025-07-24T15:28:59.000Z","0x0ddcc8af073f449f419c8e7c22c408b8dd73c48e2da61136088ad965a0e8ddaf",["eth:0x3eA6084748ED1b2A9B5D4426181F1ad8C93F6231"]]
      values.$pastUpgrades.7:
+        ["2025-07-24T15:28:59.000Z","0x0ddcc8af073f449f419c8e7c22c408b8dd73c48e2da61136088ad965a0e8ddaf",["eth:0x5D5a095665886119693F0B41d8DFeE78da033e8B"]]
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
+   Status: CREATED
    contract PreimageOracle (0x1fb8cdFc6831fc866Ed9C51aF8817Da5c287aDD3)
    +++ description: The PreimageOracle contract is used to load the required data from L1 for a dispute game.
```

```diff
+   Status: CREATED
    contract PermissionedDisputeGame (0x3E2986901f7149b61C2F11603b165BAf9D33d531)
    +++ description: Same as FaultDisputeGame, but only two permissioned addresses are designated as proposer and challenger.
```

```diff
+   Status: CREATED
    contract DelayedWETH (0x6d4A27F3eb196E4d039a5EE5B510Cc4C89b7eA9a)
    +++ description: Contract designed to hold the bonded ETH for each game. It is designed as a wrapper around WETH to allow an owner to function as a backstop if a game would incorrectly distribute funds.
```

```diff
+   Status: CREATED
    contract AnchorStateRegistry (0x807c2aF3Ae99a20576B00b58327B594D47f837FB)
    +++ description: Contains the latest confirmed state root that can be used as a starting point in a dispute game.
```

```diff
+   Status: CREATED
    contract DisputeGameFactory (0xD2922A726501f027a5a5AC122BEc92bCfb437662)
    +++ description: The dispute game factory allows the creation of dispute games, used to propose state roots and eventually challenge them.
```

```diff
+   Status: CREATED
    contract MIPS (0xF027F4A985560fb13324e943edf55ad6F1d15Dc1)
    +++ description: The MIPS contract is used to execute the final step of the dispute game which objectively determines the winner of the dispute.
```

## Source code changes

```diff
.../AnchorStateRegistry/AnchorStateRegistry.sol    |  568 +++
 .../ethereum/.flat/AnchorStateRegistry/Proxy.p.sol |  200 +
 .../ethereum/.flat/DelayedWETH/DelayedWETH.sol     |  608 +++
 .../mint/ethereum/.flat/DelayedWETH/Proxy.p.sol    |  200 +
 .../DisputeGameFactory/DisputeGameFactory.sol      | 1482 +++++++
 .../ethereum/.flat/DisputeGameFactory/Proxy.p.sol  |  200 +
 .../L1CrossDomainMessenger.sol                     |  736 +++-
 .../L1ERC721Bridge/L1ERC721Bridge.sol              |  418 +-
 .../L1StandardBridge/L1StandardBridge.sol          |  508 ++-
 .../L2OutputOracle/L2OutputOracle.sol => /dev/null |  679 ----
 .../src/projects/mint/ethereum/.flat/MIPS.sol      | 2515 ++++++++++++
 .../OptimismMintableERC20Factory.sol               |   30 +-
 .../OptimismPortal/Proxy.p.sol => /dev/null        |  211 -
 .../OptimismPortal2/OptimismPortal2.sol}           |  926 +++--
 .../OptimismPortal2}/Proxy.p.sol                   |    0
 .../ethereum/.flat/PermissionedDisputeGame.sol     | 4121 ++++++++++++++++++++
 .../mint/ethereum/.flat/PreimageOracle.sol         | 1311 +++++++
 .../SystemConfig/SystemConfig.sol                  | 1439 +------
 18 files changed, 13121 insertions(+), 3031 deletions(-)
```

Generated with discovered.json: 0xc1ba813029424fe8f66f121cb4f3c55e5b67d536

# Diff at Tue, 22 Jul 2025 15:53:48 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@83bf55f537ce86d3d1dac9f1a98f31f9169b801f block: 22895941
- current block number: 22975737

## Description

Conduit: Upgrade to known OP stack contracts. (no OptiPortal2 yet)

## Watched changes

```diff
    contract L1StandardBridge (0x2b3F201543adF73160bA42E1a5b7750024F30420) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      sourceHashes.1:
-        "0x79abdbd90460fe2ac0535b5cb7b4c45284322b49a0a090d1c509cdaf35dbc87e"
+        "0x1010ff7f40ab4d53e6d9996aefa04423dabe9d0e22fac2d02b330ed3aa2c5740"
      values.$implementation:
-        "eth:0xCf95526b7a5DCc029e2f45bB3B4625e36cc7371b"
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
      implementationNames.eth:0xCf95526b7a5DCc029e2f45bB3B4625e36cc7371b:
-        "L1StandardBridge"
      implementationNames.eth:0x64B5a5Ed26DCb17370Ff4d33a8D503f0fbD06CfF:
+        "L1StandardBridge"
    }
```

```diff
    EOA  (0x3d53Df1e69A32F98dFCcf23CCB689763E21A78bA) {
    +++ description: None
      receivedPermissions.0:
+        {"permission":"propose","from":"eth:0xB751A613f2Db932c6cdeF5048E6D2af05F9B98ED","role":".proposer"}
    }
```

```diff
    contract Conduit Multisig 1 (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      receivedPermissions.0:
+        {"permission":"challenge","from":"eth:0xB751A613f2Db932c6cdeF5048E6D2af05F9B98ED","role":".challenger"}
      receivedPermissions.2:
+        {"permission":"guard","from":"eth:0x097f99768A0a4a0A81bAbbCB1ea18193bA9D53cC","role":".guardian"}
      receivedPermissions.3:
+        {"permission":"guard","from":"eth:0x59625d1FE0Eeb8114a4d13c863978F39b3471781","role":".guardian"}
      receivedPermissions.7:
+        {"permission":"upgrade","from":"eth:0x097f99768A0a4a0A81bAbbCB1ea18193bA9D53cC","role":"admin","via":[{"address":"eth:0xb4899FF43Ae727B1E9CB19AC44660e4A43Fad0b5"}]}
      receivedPermissions.11:
+        {"permission":"upgrade","from":"eth:0xC2C908F3226d9082130D8e48378CD2eFb08B521D","role":"admin","via":[{"address":"eth:0xc684075a7Cc997Aa2e72152c330BDAc73FeacbDF"}]}
      receivedPermissions.13:
+        {"permission":"upgrade","from":"eth:0xF02012065Ef6121a2A59EA0C590f42803Cf101EA","role":"admin","via":[{"address":"eth:0xc684075a7Cc997Aa2e72152c330BDAc73FeacbDF"}]}
      directlyReceivedPermissions.0:
+        {"permission":"act","from":"eth:0xb4899FF43Ae727B1E9CB19AC44660e4A43Fad0b5","role":".owner"}
    }
```

```diff
    contract OptimismPortal (0x59625d1FE0Eeb8114a4d13c863978F39b3471781) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      sourceHashes.1:
-        "0xd7fe53899c31d6d8e73b6724694736dc3c3c4ebc8f4ddbe989fe9d3dba26692d"
+        "0xe35fb7bc0433439337b3eadda3d6fb7991918162f62a337a695e8c7f948cdd35"
      values.$implementation:
-        "eth:0x9Cb8F5CBD26d7843a6043EcaB3C12246F8F47FBA"
+        "eth:0x2D778797049FE9259d947D1ED8e5442226dFB589"
      values.$pastUpgrades.1:
+        ["2025-07-21T14:39:35.000Z","0x94a3e5ce180dd13dc7a8e686f24b3458c85ba6d176d1020fb424403f7d000d04",["eth:0x6322C2f2D6a4305Fc033754d486A5A067Ee5F9b1"]]
      values.$pastUpgrades.2:
+        ["2025-07-21T14:39:35.000Z","0x94a3e5ce180dd13dc7a8e686f24b3458c85ba6d176d1020fb424403f7d000d04",["eth:0x2D778797049FE9259d947D1ED8e5442226dFB589"]]
      values.$upgradeCount:
-        1
+        3
      values.version:
-        "1.7.2"
+        "2.5.0"
      values.guardian:
+        "eth:0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      values.l2Oracle:
+        "eth:0xB751A613f2Db932c6cdeF5048E6D2af05F9B98ED"
      values.superchainConfig:
+        "eth:0x097f99768A0a4a0A81bAbbCB1ea18193bA9D53cC"
      values.systemConfig:
+        "eth:0xC975862927797812371A9Fb631f83F8f5e2240D5"
      implementationNames.eth:0x9Cb8F5CBD26d7843a6043EcaB3C12246F8F47FBA:
-        "OptimismPortal"
      implementationNames.eth:0x2D778797049FE9259d947D1ED8e5442226dFB589:
+        "OptimismPortal"
    }
```

```diff
    contract L2OutputOracle (0xB751A613f2Db932c6cdeF5048E6D2af05F9B98ED) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      sourceHashes.1:
-        "0xcca8986d0789aa489ba57cd234e886bd92cb5a0d477e1f5ae5e6e030e15fb183"
+        "0x025c187b0231be4785898f25f98d749f953f5d06781772aef242812e2ecf52e3"
      values.$implementation:
-        "eth:0xaBA3C0FCe72122750D71d4739D7E5Fc7c8a355d4"
+        "eth:0xF243BEd163251380e78068d317ae10f26042B292"
      values.$pastUpgrades.1:
+        ["2025-07-21T14:39:35.000Z","0x94a3e5ce180dd13dc7a8e686f24b3458c85ba6d176d1020fb424403f7d000d04",["eth:0x6322C2f2D6a4305Fc033754d486A5A067Ee5F9b1"]]
      values.$pastUpgrades.2:
+        ["2025-07-21T14:39:35.000Z","0x94a3e5ce180dd13dc7a8e686f24b3458c85ba6d176d1020fb424403f7d000d04",["eth:0xF243BEd163251380e78068d317ae10f26042B292"]]
      values.$upgradeCount:
-        1
+        3
      values.version:
-        "1.3.1"
+        "1.8.0"
+++ severity: HIGH
      values.challenger:
+        "eth:0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      values.finalizationPeriodSeconds:
+        604800
      values.l2BlockTime:
+        2
+++ severity: HIGH
      values.proposer:
+        "eth:0x3d53Df1e69A32F98dFCcf23CCB689763E21A78bA"
      values.submissionInterval:
+        21600
      implementationNames.eth:0xaBA3C0FCe72122750D71d4739D7E5Fc7c8a355d4:
-        "L2OutputOracle"
      implementationNames.eth:0xF243BEd163251380e78068d317ae10f26042B292:
+        "L2OutputOracle"
    }
```

```diff
    contract ProxyAdmin (0xc684075a7Cc997Aa2e72152c330BDAc73FeacbDF) {
    +++ description: None
      directlyReceivedPermissions.4:
+        {"permission":"upgrade","from":"eth:0xC2C908F3226d9082130D8e48378CD2eFb08B521D","role":"admin"}
      directlyReceivedPermissions.6:
+        {"permission":"upgrade","from":"eth:0xF02012065Ef6121a2A59EA0C590f42803Cf101EA","role":"admin"}
    }
```

```diff
    contract SystemConfig (0xC975862927797812371A9Fb631f83F8f5e2240D5) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      sourceHashes.1:
-        "0x29908eb7685943ff431cd384af851ce36a30997bbad880f9b4385bfc3abb86a2"
+        "0xc7135dbd2a53312d36df3f3ee91ce0a5a459ab8fc7725880a3a9c55a5fa0ed6c"
      values.$implementation:
-        "eth:0x08C033C6859093b2803e54DE715077bd400D5f6a"
+        "eth:0xAB9d6cB7A427c0765163A7f45BB91cAfe5f2D375"
      values.$pastUpgrades.1:
+        ["2025-07-21T14:39:35.000Z","0x94a3e5ce180dd13dc7a8e686f24b3458c85ba6d176d1020fb424403f7d000d04",["eth:0x6322C2f2D6a4305Fc033754d486A5A067Ee5F9b1"]]
      values.$pastUpgrades.2:
+        ["2025-07-21T14:39:35.000Z","0x94a3e5ce180dd13dc7a8e686f24b3458c85ba6d176d1020fb424403f7d000d04",["eth:0xba2492e52F45651B60B8B38d4Ea5E2390C64Ffb1"]]
      values.$pastUpgrades.3:
+        ["2025-07-21T14:58:59.000Z","0xac163aced928843d79753aeb9982745627bbd996c94435c06b4fcfbb9a55f728",["eth:0xAB9d6cB7A427c0765163A7f45BB91cAfe5f2D375"]]
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
+        "eth:0x4e31448a098393727b786e25B54E59DcA1b77FE1"
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
+        "eth:0xf80be9f7a74ab776b69d3F0dC5C08c39b3A0bA19"
      values.l1ERC721Bridge:
+        "eth:0xC2C908F3226d9082130D8e48378CD2eFb08B521D"
      values.l1StandardBridge:
+        "eth:0x2b3F201543adF73160bA42E1a5b7750024F30420"
      values.maximumGasLimit:
+        200000000
      values.OPTIMISM_MINTABLE_ERC20_FACTORY_SLOT:
+        "0xa04c5bb938ca6fc46d95553abf0a76345ce3e722a30bf4f74928b8e7d852320c"
      values.OPTIMISM_PORTAL_SLOT:
+        "0x4b6c74f9e688cb39801f2112c14a8c57232a3fc5202e1444126d4bce86eb19ac"
      values.optimismMintableERC20Factory:
+        "eth:0xF02012065Ef6121a2A59EA0C590f42803Cf101EA"
      values.optimismPortal:
+        "eth:0x59625d1FE0Eeb8114a4d13c863978F39b3471781"
      values.START_BLOCK_SLOT:
+        "0xa11ee3ab75b40e88a0105e935d17cd36c8faee0138320d776c411291bdbbb19f"
      values.startBlock:
+        19861572
      implementationNames.eth:0x08C033C6859093b2803e54DE715077bd400D5f6a:
-        "SystemConfig"
      implementationNames.eth:0xAB9d6cB7A427c0765163A7f45BB91cAfe5f2D375:
+        "SystemConfig"
    }
```

```diff
    contract L1CrossDomainMessenger (0xf80be9f7a74ab776b69d3F0dC5C08c39b3A0bA19) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      sourceHashes.1:
-        "0xebfb36a18bcaa176678925149b43fdc5f9f943d98a6405ae1cbc26f4c168ff88"
+        "0x1cc8a3b7de3d2c54c4706bb3f3015714d3b56647fc9fbfd6f8b068f5f63c1c25"
      values.$implementation:
-        "eth:0x958487e21ba9E073836d598E31f749726f23413f"
+        "eth:0xD3494713A5cfaD3F5359379DfA074E2Ac8C6Fd65"
      values.$pastUpgrades.2:
+        ["2025-07-21T14:39:35.000Z","0x94a3e5ce180dd13dc7a8e686f24b3458c85ba6d176d1020fb424403f7d000d04",["eth:0x6322C2f2D6a4305Fc033754d486A5A067Ee5F9b1"]]
      values.$pastUpgrades.3:
+        ["2025-07-21T14:39:35.000Z","0x94a3e5ce180dd13dc7a8e686f24b3458c85ba6d176d1020fb424403f7d000d04",["eth:0xD3494713A5cfaD3F5359379DfA074E2Ac8C6Fd65"]]
      values.$pastUpgrades.4:
+        ["2025-07-21T14:58:59.000Z","0xac163aced928843d79753aeb9982745627bbd996c94435c06b4fcfbb9a55f728",["eth:0xd81f43eDBCAcb4c29a9bA38a13Ee5d79278270cC"]]
      values.$pastUpgrades.5:
+        ["2025-07-21T14:58:59.000Z","0xac163aced928843d79753aeb9982745627bbd996c94435c06b4fcfbb9a55f728",["eth:0xD3494713A5cfaD3F5359379DfA074E2Ac8C6Fd65"]]
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
+        "eth:0x59625d1FE0Eeb8114a4d13c863978F39b3471781"
      values.superchainConfig:
+        "eth:0x097f99768A0a4a0A81bAbbCB1ea18193bA9D53cC"
      implementationNames.eth:0x958487e21ba9E073836d598E31f749726f23413f:
-        "L1CrossDomainMessenger"
      implementationNames.eth:0xD3494713A5cfaD3F5359379DfA074E2Ac8C6Fd65:
+        "L1CrossDomainMessenger"
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
    contract L1ERC721Bridge (0xC2C908F3226d9082130D8e48378CD2eFb08B521D)
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
```

```diff
+   Status: CREATED
    contract OptimismMintableERC20Factory (0xF02012065Ef6121a2A59EA0C590f42803Cf101EA)
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintableERC20 as this chain's representation of a token on the host chain, or vice-versa.
```

## Source code changes

```diff
.../L1CrossDomainMessenger.sol                     | 1654 +++++++---------
 .../.flat/L1ERC721Bridge/L1ERC721Bridge.sol        |  707 +++++++
 .../mint/ethereum/.flat/L1ERC721Bridge/Proxy.p.sol |  211 ++
 .../L1StandardBridge/L1StandardBridge.sol          | 1431 +++++++-------
 .../L2OutputOracle/L2OutputOracle.sol              |  548 ++----
 .../OptimismMintableERC20Factory.sol               |  427 ++++
 .../.flat/OptimismMintableERC20Factory/Proxy.p.sol |  211 ++
 .../OptimismPortal/OptimismPortal.sol              | 1336 +++++--------
 ...0xb4899FF43Ae727B1E9CB19AC44660e4A43Fad0b5.sol} |    0
 ...:0xc684075a7Cc997Aa2e72152c330BDAc73FeacbDF.sol |  298 +++
 .../ethereum/.flat/SuperchainConfig/Proxy.p.sol    |  200 ++
 .../.flat/SuperchainConfig/SuperchainConfig.sol    |  477 +++++
 .../SystemConfig/SystemConfig.sol                  | 2034 +++++++++++++++++---
 13 files changed, 6416 insertions(+), 3118 deletions(-)
```

Generated with discovered.json: 0x27ccf875e69a3f96b6fac5afc5e496d37de6222f

# Diff at Mon, 14 Jul 2025 12:45:26 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@9f4300dad2f3d080cd56fa311d4a848556c74e72 block: 22895941
- current block number: 22895941

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22895941 (main branch discovery), not current.

```diff
    EOA  (0x000000000000000000000000000000000000dEaD) {
    +++ description: None
      address:
-        "0x000000000000000000000000000000000000dEaD"
+        "eth:0x000000000000000000000000000000000000dEaD"
    }
```

```diff
    contract L1StandardBridge (0x2b3F201543adF73160bA42E1a5b7750024F30420) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      address:
-        "0x2b3F201543adF73160bA42E1a5b7750024F30420"
+        "eth:0x2b3F201543adF73160bA42E1a5b7750024F30420"
      values.$admin:
-        "0xc684075a7Cc997Aa2e72152c330BDAc73FeacbDF"
+        "eth:0xc684075a7Cc997Aa2e72152c330BDAc73FeacbDF"
      values.$implementation:
-        "0xCf95526b7a5DCc029e2f45bB3B4625e36cc7371b"
+        "eth:0xCf95526b7a5DCc029e2f45bB3B4625e36cc7371b"
      values.l2TokenBridge:
-        "0x4200000000000000000000000000000000000010"
+        "eth:0x4200000000000000000000000000000000000010"
      values.messenger:
-        "0xf80be9f7a74ab776b69d3F0dC5C08c39b3A0bA19"
+        "eth:0xf80be9f7a74ab776b69d3F0dC5C08c39b3A0bA19"
      values.MESSENGER:
-        "0xf80be9f7a74ab776b69d3F0dC5C08c39b3A0bA19"
+        "eth:0xf80be9f7a74ab776b69d3F0dC5C08c39b3A0bA19"
      values.OTHER_BRIDGE:
-        "0x4200000000000000000000000000000000000010"
+        "eth:0x4200000000000000000000000000000000000010"
      implementationNames.0x2b3F201543adF73160bA42E1a5b7750024F30420:
-        "L1ChugSplashProxy"
      implementationNames.0xCf95526b7a5DCc029e2f45bB3B4625e36cc7371b:
-        "L1StandardBridge"
      implementationNames.eth:0x2b3F201543adF73160bA42E1a5b7750024F30420:
+        "L1ChugSplashProxy"
      implementationNames.eth:0xCf95526b7a5DCc029e2f45bB3B4625e36cc7371b:
+        "L1StandardBridge"
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
    EOA  (0x3d53Df1e69A32F98dFCcf23CCB689763E21A78bA) {
    +++ description: None
      address:
-        "0x3d53Df1e69A32F98dFCcf23CCB689763E21A78bA"
+        "eth:0x3d53Df1e69A32F98dFCcf23CCB689763E21A78bA"
    }
```

```diff
    EOA  (0x41c4FAE5E80B9a622d8968bcd3EBbcf1F93b30Db) {
    +++ description: None
      address:
-        "0x41c4FAE5E80B9a622d8968bcd3EBbcf1F93b30Db"
+        "eth:0x41c4FAE5E80B9a622d8968bcd3EBbcf1F93b30Db"
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
    EOA  (0x4e31448a098393727b786e25B54E59DcA1b77FE1) {
    +++ description: None
      address:
-        "0x4e31448a098393727b786e25B54E59DcA1b77FE1"
+        "eth:0x4e31448a098393727b786e25B54E59DcA1b77FE1"
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
    contract OptimismPortal (0x59625d1FE0Eeb8114a4d13c863978F39b3471781) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      address:
-        "0x59625d1FE0Eeb8114a4d13c863978F39b3471781"
+        "eth:0x59625d1FE0Eeb8114a4d13c863978F39b3471781"
      values.$admin:
-        "0xc684075a7Cc997Aa2e72152c330BDAc73FeacbDF"
+        "eth:0xc684075a7Cc997Aa2e72152c330BDAc73FeacbDF"
      values.$implementation:
-        "0x9Cb8F5CBD26d7843a6043EcaB3C12246F8F47FBA"
+        "eth:0x9Cb8F5CBD26d7843a6043EcaB3C12246F8F47FBA"
      values.$pastUpgrades.0.2.0:
-        "0x9Cb8F5CBD26d7843a6043EcaB3C12246F8F47FBA"
+        "eth:0x9Cb8F5CBD26d7843a6043EcaB3C12246F8F47FBA"
      values.GUARDIAN:
-        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
+        "eth:0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      values.L2_ORACLE:
-        "0xB751A613f2Db932c6cdeF5048E6D2af05F9B98ED"
+        "eth:0xB751A613f2Db932c6cdeF5048E6D2af05F9B98ED"
      values.l2Sender:
-        "0x000000000000000000000000000000000000dEaD"
+        "eth:0x000000000000000000000000000000000000dEaD"
      values.SYSTEM_CONFIG:
-        "0xC975862927797812371A9Fb631f83F8f5e2240D5"
+        "eth:0xC975862927797812371A9Fb631f83F8f5e2240D5"
      implementationNames.0x59625d1FE0Eeb8114a4d13c863978F39b3471781:
-        "Proxy"
      implementationNames.0x9Cb8F5CBD26d7843a6043EcaB3C12246F8F47FBA:
-        "OptimismPortal"
      implementationNames.eth:0x59625d1FE0Eeb8114a4d13c863978F39b3471781:
+        "Proxy"
      implementationNames.eth:0x9Cb8F5CBD26d7843a6043EcaB3C12246F8F47FBA:
+        "OptimismPortal"
    }
```

```diff
    EOA  (0x68bdFecE01535090c8f3C27ec3b1AE97E83fA4aA) {
    +++ description: None
      address:
-        "0x68bdFecE01535090c8f3C27ec3b1AE97E83fA4aA"
+        "eth:0x68bdFecE01535090c8f3C27ec3b1AE97E83fA4aA"
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
    contract L2OutputOracle (0xB751A613f2Db932c6cdeF5048E6D2af05F9B98ED) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      address:
-        "0xB751A613f2Db932c6cdeF5048E6D2af05F9B98ED"
+        "eth:0xB751A613f2Db932c6cdeF5048E6D2af05F9B98ED"
      values.$admin:
-        "0xc684075a7Cc997Aa2e72152c330BDAc73FeacbDF"
+        "eth:0xc684075a7Cc997Aa2e72152c330BDAc73FeacbDF"
      values.$implementation:
-        "0xaBA3C0FCe72122750D71d4739D7E5Fc7c8a355d4"
+        "eth:0xaBA3C0FCe72122750D71d4739D7E5Fc7c8a355d4"
      values.$pastUpgrades.0.2.0:
-        "0xaBA3C0FCe72122750D71d4739D7E5Fc7c8a355d4"
+        "eth:0xaBA3C0FCe72122750D71d4739D7E5Fc7c8a355d4"
      values.CHALLENGER:
-        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
+        "eth:0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      values.PROPOSER:
-        "0x3d53Df1e69A32F98dFCcf23CCB689763E21A78bA"
+        "eth:0x3d53Df1e69A32F98dFCcf23CCB689763E21A78bA"
      implementationNames.0xB751A613f2Db932c6cdeF5048E6D2af05F9B98ED:
-        "Proxy"
      implementationNames.0xaBA3C0FCe72122750D71d4739D7E5Fc7c8a355d4:
-        "L2OutputOracle"
      implementationNames.eth:0xB751A613f2Db932c6cdeF5048E6D2af05F9B98ED:
+        "Proxy"
      implementationNames.eth:0xaBA3C0FCe72122750D71d4739D7E5Fc7c8a355d4:
+        "L2OutputOracle"
    }
```

```diff
    contract ProxyAdmin (0xc684075a7Cc997Aa2e72152c330BDAc73FeacbDF) {
    +++ description: None
      address:
-        "0xc684075a7Cc997Aa2e72152c330BDAc73FeacbDF"
+        "eth:0xc684075a7Cc997Aa2e72152c330BDAc73FeacbDF"
      values.addressManager:
-        "0xEa4165C5CDCA155779803A113d8391b741bA5228"
+        "eth:0xEa4165C5CDCA155779803A113d8391b741bA5228"
      values.owner:
-        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
+        "eth:0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      implementationNames.0xc684075a7Cc997Aa2e72152c330BDAc73FeacbDF:
-        "ProxyAdmin"
      implementationNames.eth:0xc684075a7Cc997Aa2e72152c330BDAc73FeacbDF:
+        "ProxyAdmin"
    }
```

```diff
    contract SystemConfig (0xC975862927797812371A9Fb631f83F8f5e2240D5) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      address:
-        "0xC975862927797812371A9Fb631f83F8f5e2240D5"
+        "eth:0xC975862927797812371A9Fb631f83F8f5e2240D5"
      values.$admin:
-        "0xc684075a7Cc997Aa2e72152c330BDAc73FeacbDF"
+        "eth:0xc684075a7Cc997Aa2e72152c330BDAc73FeacbDF"
      values.$implementation:
-        "0x08C033C6859093b2803e54DE715077bd400D5f6a"
+        "eth:0x08C033C6859093b2803e54DE715077bd400D5f6a"
      values.$pastUpgrades.0.2.0:
-        "0x08C033C6859093b2803e54DE715077bd400D5f6a"
+        "eth:0x08C033C6859093b2803e54DE715077bd400D5f6a"
      values.batcherHash:
-        "0x68bdFecE01535090c8f3C27ec3b1AE97E83fA4aA"
+        "eth:0x68bdFecE01535090c8f3C27ec3b1AE97E83fA4aA"
      values.owner:
-        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
+        "eth:0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      values.sequencerInbox:
-        "0x4e31448a098393727b786e25B54E59DcA1b77FE1"
+        "eth:0x4e31448a098393727b786e25B54E59DcA1b77FE1"
      values.unsafeBlockSigner:
-        "0x41c4FAE5E80B9a622d8968bcd3EBbcf1F93b30Db"
+        "eth:0x41c4FAE5E80B9a622d8968bcd3EBbcf1F93b30Db"
      implementationNames.0xC975862927797812371A9Fb631f83F8f5e2240D5:
-        "Proxy"
      implementationNames.0x08C033C6859093b2803e54DE715077bd400D5f6a:
-        "SystemConfig"
      implementationNames.eth:0xC975862927797812371A9Fb631f83F8f5e2240D5:
+        "Proxy"
      implementationNames.eth:0x08C033C6859093b2803e54DE715077bd400D5f6a:
+        "SystemConfig"
    }
```

```diff
    contract AddressManager (0xEa4165C5CDCA155779803A113d8391b741bA5228) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      address:
-        "0xEa4165C5CDCA155779803A113d8391b741bA5228"
+        "eth:0xEa4165C5CDCA155779803A113d8391b741bA5228"
      values.owner:
-        "0xc684075a7Cc997Aa2e72152c330BDAc73FeacbDF"
+        "eth:0xc684075a7Cc997Aa2e72152c330BDAc73FeacbDF"
      implementationNames.0xEa4165C5CDCA155779803A113d8391b741bA5228:
-        "AddressManager"
      implementationNames.eth:0xEa4165C5CDCA155779803A113d8391b741bA5228:
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
    contract L1CrossDomainMessenger (0xf80be9f7a74ab776b69d3F0dC5C08c39b3A0bA19) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      address:
-        "0xf80be9f7a74ab776b69d3F0dC5C08c39b3A0bA19"
+        "eth:0xf80be9f7a74ab776b69d3F0dC5C08c39b3A0bA19"
      values.$admin:
-        "0xc684075a7Cc997Aa2e72152c330BDAc73FeacbDF"
+        "eth:0xc684075a7Cc997Aa2e72152c330BDAc73FeacbDF"
      values.$implementation:
-        "0x958487e21ba9E073836d598E31f749726f23413f"
+        "eth:0x958487e21ba9E073836d598E31f749726f23413f"
      values.$pastUpgrades.0.2.0:
-        "0xf80be9f7a74ab776b69d3F0dC5C08c39b3A0bA19"
+        "eth:0xf80be9f7a74ab776b69d3F0dC5C08c39b3A0bA19"
      values.$pastUpgrades.1.2.0:
-        "0x958487e21ba9E073836d598E31f749726f23413f"
+        "eth:0x958487e21ba9E073836d598E31f749726f23413f"
      values.OTHER_MESSENGER:
-        "0x4200000000000000000000000000000000000007"
+        "eth:0x4200000000000000000000000000000000000007"
      values.PORTAL:
-        "0x59625d1FE0Eeb8114a4d13c863978F39b3471781"
+        "eth:0x59625d1FE0Eeb8114a4d13c863978F39b3471781"
      values.ResolvedDelegateProxy_addressManager:
-        "0xEa4165C5CDCA155779803A113d8391b741bA5228"
+        "eth:0xEa4165C5CDCA155779803A113d8391b741bA5228"
      implementationNames.0xf80be9f7a74ab776b69d3F0dC5C08c39b3A0bA19:
-        "ResolvedDelegateProxy"
      implementationNames.0x958487e21ba9E073836d598E31f749726f23413f:
-        "L1CrossDomainMessenger"
      implementationNames.eth:0xf80be9f7a74ab776b69d3F0dC5C08c39b3A0bA19:
+        "ResolvedDelegateProxy"
      implementationNames.eth:0x958487e21ba9E073836d598E31f749726f23413f:
+        "L1CrossDomainMessenger"
    }
```

```diff
+   Status: CREATED
    contract L1StandardBridge (0x2b3F201543adF73160bA42E1a5b7750024F30420)
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
```

```diff
+   Status: CREATED
    contract Conduit Multisig 1 (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OptimismPortal (0x59625d1FE0Eeb8114a4d13c863978F39b3471781)
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
```

```diff
+   Status: CREATED
    contract L2OutputOracle (0xB751A613f2Db932c6cdeF5048E6D2af05F9B98ED)
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0xc684075a7Cc997Aa2e72152c330BDAc73FeacbDF)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SystemConfig (0xC975862927797812371A9Fb631f83F8f5e2240D5)
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
```

```diff
+   Status: CREATED
    contract AddressManager (0xEa4165C5CDCA155779803A113d8391b741bA5228)
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
```

```diff
+   Status: CREATED
    contract L1CrossDomainMessenger (0xf80be9f7a74ab776b69d3F0dC5C08c39b3A0bA19)
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
```

Generated with discovered.json: 0xd1df82e17ed6ca6d84beb657c05cb85fcdc619b3

# Diff at Fri, 04 Jul 2025 12:19:09 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f56dc47fe915564d4555300304da4d3bcbc087f block: 22615670
- current block number: 22615670

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22615670 (main branch discovery), not current.

```diff
    EOA  (0x3d53Df1e69A32F98dFCcf23CCB689763E21A78bA) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0xB751A613f2Db932c6cdeF5048E6D2af05F9B98ED"
+        "eth:0xB751A613f2Db932c6cdeF5048E6D2af05F9B98ED"
    }
```

```diff
    contract Conduit Multisig 1 (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0xB751A613f2Db932c6cdeF5048E6D2af05F9B98ED"
+        "eth:0xB751A613f2Db932c6cdeF5048E6D2af05F9B98ED"
      receivedPermissions.1.from:
-        "ethereum:0x59625d1FE0Eeb8114a4d13c863978F39b3471781"
+        "eth:0x59625d1FE0Eeb8114a4d13c863978F39b3471781"
      receivedPermissions.2.from:
-        "ethereum:0xC975862927797812371A9Fb631f83F8f5e2240D5"
+        "eth:0xC975862927797812371A9Fb631f83F8f5e2240D5"
      receivedPermissions.3.via.0.address:
-        "ethereum:0xc684075a7Cc997Aa2e72152c330BDAc73FeacbDF"
+        "eth:0xc684075a7Cc997Aa2e72152c330BDAc73FeacbDF"
      receivedPermissions.3.from:
-        "ethereum:0xEa4165C5CDCA155779803A113d8391b741bA5228"
+        "eth:0xEa4165C5CDCA155779803A113d8391b741bA5228"
      receivedPermissions.4.via.0.address:
-        "ethereum:0xc684075a7Cc997Aa2e72152c330BDAc73FeacbDF"
+        "eth:0xc684075a7Cc997Aa2e72152c330BDAc73FeacbDF"
      receivedPermissions.4.from:
-        "ethereum:0x2b3F201543adF73160bA42E1a5b7750024F30420"
+        "eth:0x2b3F201543adF73160bA42E1a5b7750024F30420"
      receivedPermissions.5.via.0.address:
-        "ethereum:0xc684075a7Cc997Aa2e72152c330BDAc73FeacbDF"
+        "eth:0xc684075a7Cc997Aa2e72152c330BDAc73FeacbDF"
      receivedPermissions.5.from:
-        "ethereum:0x59625d1FE0Eeb8114a4d13c863978F39b3471781"
+        "eth:0x59625d1FE0Eeb8114a4d13c863978F39b3471781"
      receivedPermissions.6.via.0.address:
-        "ethereum:0xc684075a7Cc997Aa2e72152c330BDAc73FeacbDF"
+        "eth:0xc684075a7Cc997Aa2e72152c330BDAc73FeacbDF"
      receivedPermissions.6.from:
-        "ethereum:0xB751A613f2Db932c6cdeF5048E6D2af05F9B98ED"
+        "eth:0xB751A613f2Db932c6cdeF5048E6D2af05F9B98ED"
      receivedPermissions.7.via.0.address:
-        "ethereum:0xc684075a7Cc997Aa2e72152c330BDAc73FeacbDF"
+        "eth:0xc684075a7Cc997Aa2e72152c330BDAc73FeacbDF"
      receivedPermissions.7.from:
-        "ethereum:0xC975862927797812371A9Fb631f83F8f5e2240D5"
+        "eth:0xC975862927797812371A9Fb631f83F8f5e2240D5"
      receivedPermissions.8.via.0.address:
-        "ethereum:0xc684075a7Cc997Aa2e72152c330BDAc73FeacbDF"
+        "eth:0xc684075a7Cc997Aa2e72152c330BDAc73FeacbDF"
      receivedPermissions.8.from:
-        "ethereum:0xf80be9f7a74ab776b69d3F0dC5C08c39b3A0bA19"
+        "eth:0xf80be9f7a74ab776b69d3F0dC5C08c39b3A0bA19"
      directlyReceivedPermissions.0.from:
-        "ethereum:0xc684075a7Cc997Aa2e72152c330BDAc73FeacbDF"
+        "eth:0xc684075a7Cc997Aa2e72152c330BDAc73FeacbDF"
    }
```

```diff
    EOA  (0x68bdFecE01535090c8f3C27ec3b1AE97E83fA4aA) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0xC975862927797812371A9Fb631f83F8f5e2240D5"
+        "eth:0xC975862927797812371A9Fb631f83F8f5e2240D5"
    }
```

```diff
    contract ProxyAdmin (0xc684075a7Cc997Aa2e72152c330BDAc73FeacbDF) {
    +++ description: None
      directlyReceivedPermissions.0.from:
-        "ethereum:0xEa4165C5CDCA155779803A113d8391b741bA5228"
+        "eth:0xEa4165C5CDCA155779803A113d8391b741bA5228"
      directlyReceivedPermissions.1.from:
-        "ethereum:0x2b3F201543adF73160bA42E1a5b7750024F30420"
+        "eth:0x2b3F201543adF73160bA42E1a5b7750024F30420"
      directlyReceivedPermissions.2.from:
-        "ethereum:0x59625d1FE0Eeb8114a4d13c863978F39b3471781"
+        "eth:0x59625d1FE0Eeb8114a4d13c863978F39b3471781"
      directlyReceivedPermissions.3.from:
-        "ethereum:0xB751A613f2Db932c6cdeF5048E6D2af05F9B98ED"
+        "eth:0xB751A613f2Db932c6cdeF5048E6D2af05F9B98ED"
      directlyReceivedPermissions.4.from:
-        "ethereum:0xC975862927797812371A9Fb631f83F8f5e2240D5"
+        "eth:0xC975862927797812371A9Fb631f83F8f5e2240D5"
      directlyReceivedPermissions.5.from:
-        "ethereum:0xf80be9f7a74ab776b69d3F0dC5C08c39b3A0bA19"
+        "eth:0xf80be9f7a74ab776b69d3F0dC5C08c39b3A0bA19"
    }
```

Generated with discovered.json: 0x0ccf1b82cc7306e6527cf4728448f8c96f756145

# Diff at Mon, 16 Jun 2025 08:42:19 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@e1208475abce20cea1768d2e4878c03350c1b7c9 block: 22615670
- current block number: 22615670

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22615670 (main branch discovery), not current.

```diff
    contract Conduit Multisig 1 (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      receivedPermissions.8:
+        {"permission":"upgrade","from":"ethereum:0xC975862927797812371A9Fb631f83F8f5e2240D5","role":"admin","via":[{"address":"ethereum:0xc684075a7Cc997Aa2e72152c330BDAc73FeacbDF"}]}
      receivedPermissions.7.from:
-        "ethereum:0xC975862927797812371A9Fb631f83F8f5e2240D5"
+        "ethereum:0x59625d1FE0Eeb8114a4d13c863978F39b3471781"
      receivedPermissions.6.from:
-        "ethereum:0x59625d1FE0Eeb8114a4d13c863978F39b3471781"
+        "ethereum:0xB751A613f2Db932c6cdeF5048E6D2af05F9B98ED"
      receivedPermissions.5.permission:
-        "upgrade"
+        "guard"
      receivedPermissions.5.from:
-        "ethereum:0xB751A613f2Db932c6cdeF5048E6D2af05F9B98ED"
+        "ethereum:0x59625d1FE0Eeb8114a4d13c863978F39b3471781"
      receivedPermissions.5.role:
-        "admin"
+        ".GUARDIAN"
      receivedPermissions.5.via:
-        [{"address":"ethereum:0xc684075a7Cc997Aa2e72152c330BDAc73FeacbDF"}]
      receivedPermissions.4.permission:
-        "guard"
+        "upgrade"
      receivedPermissions.4.from:
-        "ethereum:0x59625d1FE0Eeb8114a4d13c863978F39b3471781"
+        "ethereum:0xf80be9f7a74ab776b69d3F0dC5C08c39b3A0bA19"
      receivedPermissions.4.role:
-        ".GUARDIAN"
+        "admin"
      receivedPermissions.4.via:
+        [{"address":"ethereum:0xc684075a7Cc997Aa2e72152c330BDAc73FeacbDF"}]
    }
```

```diff
    contract ProxyAdmin (0xc684075a7Cc997Aa2e72152c330BDAc73FeacbDF) {
    +++ description: None
      directlyReceivedPermissions.5:
+        {"permission":"upgrade","from":"ethereum:0xC975862927797812371A9Fb631f83F8f5e2240D5","role":"admin"}
      directlyReceivedPermissions.4.from:
-        "ethereum:0xC975862927797812371A9Fb631f83F8f5e2240D5"
+        "ethereum:0x59625d1FE0Eeb8114a4d13c863978F39b3471781"
      directlyReceivedPermissions.3.from:
-        "ethereum:0x59625d1FE0Eeb8114a4d13c863978F39b3471781"
+        "ethereum:0xB751A613f2Db932c6cdeF5048E6D2af05F9B98ED"
      directlyReceivedPermissions.2.from:
-        "ethereum:0xB751A613f2Db932c6cdeF5048E6D2af05F9B98ED"
+        "ethereum:0xf80be9f7a74ab776b69d3F0dC5C08c39b3A0bA19"
    }
```

```diff
    contract L1CrossDomainMessenger (0xf80be9f7a74ab776b69d3F0dC5C08c39b3A0bA19) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      values.$admin:
+        "0xc684075a7Cc997Aa2e72152c330BDAc73FeacbDF"
    }
```

Generated with discovered.json: 0x581ee2fc952d0bc796a95b4389c07338ff31bdff

# Diff at Mon, 02 Jun 2025 08:00:45 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@2fee84b782a329885c84742cf9cf43143842a2d5 block: 22046068
- current block number: 22615670

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

Generated with discovered.json: 0x6ad300001eb1ab9771c00abd45448861959cf01b

# Diff at Fri, 30 May 2025 07:09:56 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@a4d8c436027d17df0f9b76843cd6deb1888fa381 block: 22046068
- current block number: 22046068

## Description

config: change comment about eip1559 fee val

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22046068 (main branch discovery), not current.

```diff
    contract SystemConfig (0xC975862927797812371A9Fb631f83F8f5e2240D5) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      fieldMeta.eip1559Denominator:
+        {"description":"volatility param: lower denominator -> quicker fee changes on L2"}
    }
```

Generated with discovered.json: 0x7436cc6484b61ae2330862bbc230b2e45d9aeee0

# Diff at Fri, 23 May 2025 09:40:59 GMT:

- chain: ethereum
- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@69cd181abbc3c830a6caf2f4429b37cae72ffdb8 block: 22046068
- current block number: 22046068

## Description

Introduced .role field on each permission, defaulting to field name on which it was defined (with '.' prefix)

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22046068 (main branch discovery), not current.

```diff
    EOA  (0x3d53Df1e69A32F98dFCcf23CCB689763E21A78bA) {
    +++ description: None
      receivedPermissions.0.role:
+        ".PROPOSER"
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
-        "upgrade"
+        "guard"
      receivedPermissions.4.from:
-        "0x2b3F201543adF73160bA42E1a5b7750024F30420"
+        "0x59625d1FE0Eeb8114a4d13c863978F39b3471781"
      receivedPermissions.4.description:
-        "upgrading the bridge implementation can give access to all funds escrowed therein."
      receivedPermissions.4.via:
-        [{"address":"0xc684075a7Cc997Aa2e72152c330BDAc73FeacbDF"}]
      receivedPermissions.4.role:
+        ".GUARDIAN"
      receivedPermissions.3.role:
+        ".CHALLENGER"
      receivedPermissions.2.permission:
-        "guard"
+        "upgrade"
      receivedPermissions.2.from:
-        "0x59625d1FE0Eeb8114a4d13c863978F39b3471781"
+        "0x2b3F201543adF73160bA42E1a5b7750024F30420"
      receivedPermissions.2.description:
+        "upgrading the bridge implementation can give access to all funds escrowed therein."
      receivedPermissions.2.role:
+        ".$admin"
      receivedPermissions.2.via:
+        [{"address":"0xc684075a7Cc997Aa2e72152c330BDAc73FeacbDF"}]
      receivedPermissions.1.role:
+        ".owner"
      receivedPermissions.0.role:
+        ".owner"
      directlyReceivedPermissions.0.role:
+        ".owner"
    }
```

```diff
    EOA  (0x68bdFecE01535090c8f3C27ec3b1AE97E83fA4aA) {
    +++ description: None
      receivedPermissions.0.role:
+        ".batcherHash"
    }
```

```diff
    contract ProxyAdmin (0xc684075a7Cc997Aa2e72152c330BDAc73FeacbDF) {
    +++ description: None
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

Generated with discovered.json: 0xa5f8c641b9401cbdece680d336e4d241c7346191

# Diff at Tue, 29 Apr 2025 08:19:07 GMT:

- chain: ethereum
- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@ef7477af00fe0b57a2f7cacf7e958c12494af662 block: 22046068
- current block number: 22046068

## Description

Field .issuedPermissions is removed from the output as no longer needed. Added 'permissionsConfigHash' due to refactoring of the modelling process (into a separate command).

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22046068 (main branch discovery), not current.

```diff
    contract L1StandardBridge (0x2b3F201543adF73160bA42E1a5b7750024F30420) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x4a4962275DF8C60a80d3a25faEc5AA7De116A746","description":"upgrading the bridge implementation can give access to all funds escrowed therein.","via":[{"address":"0xc684075a7Cc997Aa2e72152c330BDAc73FeacbDF"}]}]
    }
```

```diff
    contract OptimismPortal (0x59625d1FE0Eeb8114a4d13c863978F39b3471781) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      issuedPermissions:
-        [{"permission":"guard","to":"0x4a4962275DF8C60a80d3a25faEc5AA7De116A746","via":[]},{"permission":"upgrade","to":"0x4a4962275DF8C60a80d3a25faEc5AA7De116A746","via":[{"address":"0xc684075a7Cc997Aa2e72152c330BDAc73FeacbDF"}]}]
    }
```

```diff
    contract L2OutputOracle (0xB751A613f2Db932c6cdeF5048E6D2af05F9B98ED) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      issuedPermissions:
-        [{"permission":"challenge","to":"0x4a4962275DF8C60a80d3a25faEc5AA7De116A746","via":[]},{"permission":"propose","to":"0x3d53Df1e69A32F98dFCcf23CCB689763E21A78bA","via":[]},{"permission":"upgrade","to":"0x4a4962275DF8C60a80d3a25faEc5AA7De116A746","via":[{"address":"0xc684075a7Cc997Aa2e72152c330BDAc73FeacbDF"}]}]
    }
```

```diff
    contract SystemConfig (0xC975862927797812371A9Fb631f83F8f5e2240D5) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      issuedPermissions:
-        [{"permission":"interact","to":"0x4a4962275DF8C60a80d3a25faEc5AA7De116A746","description":"it can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system.","via":[]},{"permission":"sequence","to":"0x68bdFecE01535090c8f3C27ec3b1AE97E83fA4aA","via":[]},{"permission":"upgrade","to":"0x4a4962275DF8C60a80d3a25faEc5AA7De116A746","via":[{"address":"0xc684075a7Cc997Aa2e72152c330BDAc73FeacbDF"}]}]
    }
```

```diff
    contract AddressManager (0xEa4165C5CDCA155779803A113d8391b741bA5228) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      issuedPermissions:
-        [{"permission":"interact","to":"0x4a4962275DF8C60a80d3a25faEc5AA7De116A746","description":"set and change address mappings.","via":[{"address":"0xc684075a7Cc997Aa2e72152c330BDAc73FeacbDF"}]}]
    }
```

Generated with discovered.json: 0x09954235868d651334f50ac3c29f30b428e1ee68

# Diff at Thu, 27 Mar 2025 11:14:40 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@8cc2e36080df3a74dfd8475d41c64f46203f5218 block: 22046068
- current block number: 22046068

## Description

Config related: add guardian description details, hide some noisy values, hide AddressManager as spam cat, add proposer / challenger to permissioned opfp chains.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22046068 (main branch discovery), not current.

```diff
    contract AddressManager (0xEa4165C5CDCA155779803A113d8391b741bA5228) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      category:
+        {"name":"Spam","priority":-1}
    }
```

Generated with discovered.json: 0x8a284686b28ca2449e4b1f0e744f8c650066e447

# Diff at Tue, 18 Mar 2025 08:13:14 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@4ef7a8dbcec1cd9fec77aae2b73d81347a4ffb13 block: 22046068
- current block number: 22046068

## Description

Config: change Multisig names.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22046068 (main branch discovery), not current.

```diff
    contract Conduit Multisig 1 (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      name:
-        "ConduitMultisig"
+        "Conduit Multisig 1"
    }
```

Generated with discovered.json: 0xcce18df376f64a86c3e1137a08b3168ead5c3c95

# Diff at Fri, 14 Mar 2025 15:40:12 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@002bac09dea3b1154ecc36736323fb7552478ce4 block: 21637079
- current block number: 22046068

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

Generated with discovered.json: 0xbf5135fedb6b64e93b10e95424de68b6082a37b2

# Diff at Tue, 04 Mar 2025 11:26:00 GMT:

- chain: ethereum
- author: Michał Podsiadły (<michal.podsiadly@l2beat.com>)
- comparing to: main@be38e12d3ff947ca8de40f3a23a9ba1875a54f5a block: 21637079
- current block number: 21637079

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21637079 (main branch discovery), not current.

```diff
    contract SystemConfig (0xC975862927797812371A9Fb631f83F8f5e2240D5) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      values.opStackDA.isSomeTxsLengthEqualToCelestiaDAExample:
-        false
      values.opStackDA.isUsingCelestia:
+        false
    }
```

Generated with discovered.json: 0xf7b3b4a6a592ca5226321bee2f2ec5505cbee68b

# Diff at Tue, 04 Mar 2025 10:39:26 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@98d260b45fe0d2195ce5e629bd7b200c8706e8ba block: 21637079
- current block number: 21637079

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21637079 (main branch discovery), not current.

```diff
    contract L1StandardBridge (0x2b3F201543adF73160bA42E1a5b7750024F30420) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      sinceBlock:
+        19861572
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
    contract OptimismPortal (0x59625d1FE0Eeb8114a4d13c863978F39b3471781) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      sinceBlock:
+        19861572
    }
```

```diff
    contract L2OutputOracle (0xB751A613f2Db932c6cdeF5048E6D2af05F9B98ED) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      sinceBlock:
+        19861572
    }
```

```diff
    contract ProxyAdmin (0xc684075a7Cc997Aa2e72152c330BDAc73FeacbDF) {
    +++ description: None
      sinceBlock:
+        19861572
    }
```

```diff
    contract SystemConfig (0xC975862927797812371A9Fb631f83F8f5e2240D5) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      sinceBlock:
+        19861572
    }
```

```diff
    contract AddressManager (0xEa4165C5CDCA155779803A113d8391b741bA5228) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      sinceBlock:
+        19861572
    }
```

```diff
    contract L1CrossDomainMessenger (0xf80be9f7a74ab776b69d3F0dC5C08c39b3A0bA19) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      sinceBlock:
+        19861572
    }
```

Generated with discovered.json: 0x7b14aa4a02152a56b2298707e1021fbc4f88c6e7

# Diff at Wed, 26 Feb 2025 10:32:55 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@18513668f913fbe57a197f43655b19111df0e627 block: 21637079
- current block number: 21637079

## Description

config related: added categories for all opstack, op stack and polygoncdk stack templates.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21637079 (main branch discovery), not current.

```diff
    contract L1StandardBridge (0x2b3F201543adF73160bA42E1a5b7750024F30420) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      category:
+        {"name":"Canonical Bridges","priority":2}
    }
```

```diff
    contract OptimismPortal (0x59625d1FE0Eeb8114a4d13c863978F39b3471781) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract L2OutputOracle (0xB751A613f2Db932c6cdeF5048E6D2af05F9B98ED) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract SystemConfig (0xC975862927797812371A9Fb631f83F8f5e2240D5) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract L1CrossDomainMessenger (0xf80be9f7a74ab776b69d3F0dC5C08c39b3A0bA19) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      category:
+        {"name":"Canonical Bridges","priority":2}
    }
```

Generated with discovered.json: 0x823fcc62594463b3cf8293409bb7ddc96f7b63cc

# Diff at Fri, 21 Feb 2025 14:09:08 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@d219f271711b2cf7a164e3443bead5e4957d13a8 block: 21637079
- current block number: 21637079

## Description

Config related: Change some severities and add templates.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21637079 (main branch discovery), not current.

```diff
    contract L2OutputOracle (0xB751A613f2Db932c6cdeF5048E6D2af05F9B98ED) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      fieldMeta.proposer:
+        {"severity":"HIGH"}
      fieldMeta.challenger:
+        {"severity":"HIGH"}
      fieldMeta.deletedOutputs:
+        {"severity":"HIGH"}
    }
```

Generated with discovered.json: 0xd7e8f3732a33489a5075f9e1e7bc74acc0d38379

# Diff at Fri, 21 Feb 2025 08:59:44 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1cf9ec35847912163c4b663a633e258a434c0bca block: 21637079
- current block number: 21637079

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21637079 (main branch discovery), not current.

```diff
    contract L1CrossDomainMessenger (0xf80be9f7a74ab776b69d3F0dC5C08c39b3A0bA19) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      categories:
-        ["Core"]
    }
```

Generated with discovered.json: 0x4c511f3b01105304c7de006c09fa999853acbcb5

# Diff at Mon, 10 Feb 2025 19:04:16 GMT:

- chain: ethereum
- author: Michał Podsiadły (<michal.podsiadly@l2beat.com>)
- comparing to: main@3756adff7c1ac86d8af3374a90a75c1999aae2b3 block: 21637079
- current block number: 21637079

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21637079 (main branch discovery), not current.

```diff
    contract SystemConfig (0xC975862927797812371A9Fb631f83F8f5e2240D5) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      values.opStackDA.isUsingEigenDA:
+        false
    }
```

Generated with discovered.json: 0x5d059c3dbf5253fc0a4b79dab4aa1c636d9cb6eb

# Diff at Tue, 04 Feb 2025 12:31:43 GMT:

- chain: ethereum
- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@145553eed7ba44636411ecb25e4099728acd02f9 block: 21637079
- current block number: 21637079

## Description

Rename 'configure' permission to 'interact'

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21637079 (main branch discovery), not current.

```diff
    contract ConduitMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      receivedPermissions.3.permission:
-        "guard"
+        "interact"
      receivedPermissions.3.from:
-        "0x59625d1FE0Eeb8114a4d13c863978F39b3471781"
+        "0xEa4165C5CDCA155779803A113d8391b741bA5228"
      receivedPermissions.3.description:
+        "set and change address mappings."
      receivedPermissions.3.via:
+        [{"address":"0xc684075a7Cc997Aa2e72152c330BDAc73FeacbDF"}]
      receivedPermissions.2.permission:
-        "configure"
+        "interact"
      receivedPermissions.2.from:
-        "0xEa4165C5CDCA155779803A113d8391b741bA5228"
+        "0xC975862927797812371A9Fb631f83F8f5e2240D5"
      receivedPermissions.2.description:
-        "set and change address mappings."
+        "it can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system."
      receivedPermissions.2.via:
-        [{"address":"0xc684075a7Cc997Aa2e72152c330BDAc73FeacbDF"}]
      receivedPermissions.1.permission:
-        "configure"
+        "guard"
      receivedPermissions.1.from:
-        "0xC975862927797812371A9Fb631f83F8f5e2240D5"
+        "0x59625d1FE0Eeb8114a4d13c863978F39b3471781"
      receivedPermissions.1.description:
-        "it can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system."
    }
```

```diff
    contract ProxyAdmin (0xc684075a7Cc997Aa2e72152c330BDAc73FeacbDF) {
    +++ description: None
      directlyReceivedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract SystemConfig (0xC975862927797812371A9Fb631f83F8f5e2240D5) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      issuedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract AddressManager (0xEa4165C5CDCA155779803A113d8391b741bA5228) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      issuedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

Generated with discovered.json: 0xaa75bf422fd03ea01d523df42729e67603e3ea13

# Diff at Mon, 20 Jan 2025 11:09:45 GMT:

- chain: ethereum
- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@2c8b4f3d9910bb6371be9b4df87b70856e7d8c64 block: 21637079
- current block number: 21637079

## Description

Rerun on the same block number. Applies fixes to permissions and via field. Renames permission's target to to/from.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21637079 (main branch discovery), not current.

```diff
    contract L1StandardBridge (0x2b3F201543adF73160bA42E1a5b7750024F30420) {
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
-        "0xC975862927797812371A9Fb631f83F8f5e2240D5"
      receivedPermissions.7.from:
+        "0xC975862927797812371A9Fb631f83F8f5e2240D5"
      receivedPermissions.6.target:
-        "0xB751A613f2Db932c6cdeF5048E6D2af05F9B98ED"
      receivedPermissions.6.from:
+        "0xB751A613f2Db932c6cdeF5048E6D2af05F9B98ED"
      receivedPermissions.5.target:
-        "0x59625d1FE0Eeb8114a4d13c863978F39b3471781"
      receivedPermissions.5.from:
+        "0x59625d1FE0Eeb8114a4d13c863978F39b3471781"
      receivedPermissions.4.target:
-        "0x2b3F201543adF73160bA42E1a5b7750024F30420"
      receivedPermissions.4.from:
+        "0x2b3F201543adF73160bA42E1a5b7750024F30420"
      receivedPermissions.3.target:
-        "0x59625d1FE0Eeb8114a4d13c863978F39b3471781"
      receivedPermissions.3.from:
+        "0x59625d1FE0Eeb8114a4d13c863978F39b3471781"
      receivedPermissions.2.target:
-        "0xEa4165C5CDCA155779803A113d8391b741bA5228"
      receivedPermissions.2.from:
+        "0xEa4165C5CDCA155779803A113d8391b741bA5228"
      receivedPermissions.1.target:
-        "0xC975862927797812371A9Fb631f83F8f5e2240D5"
      receivedPermissions.1.from:
+        "0xC975862927797812371A9Fb631f83F8f5e2240D5"
      receivedPermissions.0.target:
-        "0xB751A613f2Db932c6cdeF5048E6D2af05F9B98ED"
      receivedPermissions.0.from:
+        "0xB751A613f2Db932c6cdeF5048E6D2af05F9B98ED"
      directlyReceivedPermissions.0.target:
-        "0xc684075a7Cc997Aa2e72152c330BDAc73FeacbDF"
      directlyReceivedPermissions.0.from:
+        "0xc684075a7Cc997Aa2e72152c330BDAc73FeacbDF"
    }
```

```diff
    contract OptimismPortal (0x59625d1FE0Eeb8114a4d13c863978F39b3471781) {
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
    contract L2OutputOracle (0xB751A613f2Db932c6cdeF5048E6D2af05F9B98ED) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      issuedPermissions.2.target:
-        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      issuedPermissions.2.via.0.delay:
-        0
      issuedPermissions.2.to:
+        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      issuedPermissions.1.target:
-        "0x3d53Df1e69A32F98dFCcf23CCB689763E21A78bA"
      issuedPermissions.1.to:
+        "0x3d53Df1e69A32F98dFCcf23CCB689763E21A78bA"
      issuedPermissions.0.target:
-        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      issuedPermissions.0.to:
+        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
    }
```

```diff
    contract ProxyAdmin (0xc684075a7Cc997Aa2e72152c330BDAc73FeacbDF) {
    +++ description: None
      directlyReceivedPermissions.4.target:
-        "0xC975862927797812371A9Fb631f83F8f5e2240D5"
      directlyReceivedPermissions.4.from:
+        "0xC975862927797812371A9Fb631f83F8f5e2240D5"
      directlyReceivedPermissions.3.target:
-        "0xB751A613f2Db932c6cdeF5048E6D2af05F9B98ED"
      directlyReceivedPermissions.3.from:
+        "0xB751A613f2Db932c6cdeF5048E6D2af05F9B98ED"
      directlyReceivedPermissions.2.target:
-        "0x59625d1FE0Eeb8114a4d13c863978F39b3471781"
      directlyReceivedPermissions.2.from:
+        "0x59625d1FE0Eeb8114a4d13c863978F39b3471781"
      directlyReceivedPermissions.1.target:
-        "0x2b3F201543adF73160bA42E1a5b7750024F30420"
      directlyReceivedPermissions.1.from:
+        "0x2b3F201543adF73160bA42E1a5b7750024F30420"
      directlyReceivedPermissions.0.target:
-        "0xEa4165C5CDCA155779803A113d8391b741bA5228"
      directlyReceivedPermissions.0.from:
+        "0xEa4165C5CDCA155779803A113d8391b741bA5228"
    }
```

```diff
    contract SystemConfig (0xC975862927797812371A9Fb631f83F8f5e2240D5) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      issuedPermissions.2.target:
-        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      issuedPermissions.2.via.0.delay:
-        0
      issuedPermissions.2.to:
+        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      issuedPermissions.1.target:
-        "0x68bdFecE01535090c8f3C27ec3b1AE97E83fA4aA"
      issuedPermissions.1.to:
+        "0x68bdFecE01535090c8f3C27ec3b1AE97E83fA4aA"
      issuedPermissions.0.target:
-        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      issuedPermissions.0.to:
+        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      issuedPermissions.0.description:
+        "it can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system."
    }
```

```diff
    contract AddressManager (0xEa4165C5CDCA155779803A113d8391b741bA5228) {
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

Generated with discovered.json: 0x304e69c53d1245293b59d1e99d06f7a3971e90f6

# Diff at Thu, 16 Jan 2025 12:35:31 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@b471de2d691e0c6d99ad89859efde79edd3d4dfb block: 21078665
- current block number: 21637079

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

Generated with discovered.json: 0xc2501c451f048f88335e3550ad8bdf7c6af64360

# Diff at Wed, 08 Jan 2025 09:04:12 GMT:

- chain: ethereum
- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@deefa974378c2cd6b74f061e1f5a494bbbe1d63a block: 21078665
- current block number: 21078665

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21078665 (main branch discovery), not current.

```diff
    contract L1StandardBridge (0x2b3F201543adF73160bA42E1a5b7750024F30420) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      description:
-        "The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token."
+        "The main entry point to deposit ERC20 tokens from host chain to this chain."
    }
```

Generated with discovered.json: 0xa0afcb4960b94b4c336942f0cc0272297bbad77a

# Diff at Fri, 01 Nov 2024 12:10:03 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@cd1f0e71bb08ce16b2084a11b768538e8aa6ba8c block: 21078665
- current block number: 21078665

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21078665 (main branch discovery), not current.

```diff
    contract L1StandardBridge (0x2b3F201543adF73160bA42E1a5b7750024F30420) {
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

```diff
    contract ProxyAdmin (0xc684075a7Cc997Aa2e72152c330BDAc73FeacbDF) {
    +++ description: None
      directlyReceivedPermissions.1.description:
-        "upgrading bridge implementation allows to access all funds and change every system component."
+        "upgrading the bridge implementation can give access to all funds escrowed therein."
    }
```

Generated with discovered.json: 0xaa58554978b22d31d83fd8664dc086ce579198bc

# Diff at Wed, 30 Oct 2024 13:10:23 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@0a8a53530022c6c5edd257c3682a3e7f80d0c550 block: 20915064
- current block number: 21078665

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

Generated with discovered.json: 0x4895221ac5ad4940dfd9fbf850135a7fd5203f4d

# Diff at Tue, 29 Oct 2024 13:12:45 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@7b3fc9dc9074e1d423b48522c3f0273c86aab54a block: 20915064
- current block number: 20915064

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20915064 (main branch discovery), not current.

```diff
    contract L2OutputOracle (0xB751A613f2Db932c6cdeF5048E6D2af05F9B98ED) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      fieldMeta:
+        {"FINALIZATION_PERIOD_SECONDS":{"description":"Challenge period (Number of seconds until a state root is finalized)."}}
    }
```

Generated with discovered.json: 0xf1d95e88677b6873fd6f714c8156a3e84f5a7d65

# Diff at Mon, 21 Oct 2024 12:46:05 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@e660599f23a07618fe949a07be1f516ce44f1914 block: 20915064
- current block number: 20915064

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20915064 (main branch discovery), not current.

```diff
    contract L1StandardBridge (0x2b3F201543adF73160bA42E1a5b7750024F30420) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token.
      descriptions:
-        ["The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token."]
      description:
+        "The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token."
    }
```

```diff
    contract OptimismPortal (0x59625d1FE0Eeb8114a4d13c863978F39b3471781) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      descriptions:
-        ["The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals."]
      description:
+        "The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals."
    }
```

```diff
    contract L2OutputOracle (0xB751A613f2Db932c6cdeF5048E6D2af05F9B98ED) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      descriptions:
-        ["Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots."]
      description:
+        "Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots."
    }
```

```diff
    contract SystemConfig (0xC975862927797812371A9Fb631f83F8f5e2240D5) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      descriptions:
-        ["Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address."]
      description:
+        "Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address."
    }
```

```diff
    contract AddressManager (0xEa4165C5CDCA155779803A113d8391b741bA5228) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      descriptions:
-        ["Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts."]
      description:
+        "Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts."
    }
```

```diff
    contract L1CrossDomainMessenger (0xf80be9f7a74ab776b69d3F0dC5C08c39b3A0bA19) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      descriptions:
-        ["Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function."]
      description:
+        "Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function."
    }
```

Generated with discovered.json: 0x4278b05a89be8a240d29ca1bf06079377f02dbc7

# Diff at Mon, 21 Oct 2024 11:07:49 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@8895d33866f5665c4c710f4ddaa32bfa63cc3c78 block: 20915064
- current block number: 20915064

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20915064 (main branch discovery), not current.

```diff
    contract OptimismPortal (0x59625d1FE0Eeb8114a4d13c863978F39b3471781) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      values.$pastUpgrades.0.2:
+        ["0x9Cb8F5CBD26d7843a6043EcaB3C12246F8F47FBA"]
      values.$pastUpgrades.0.1:
-        ["0x9Cb8F5CBD26d7843a6043EcaB3C12246F8F47FBA"]
+        "0xf9c4b516fbf6330483f4bb2dc6db4e544d1eb9d09a7b9cda3e578d48bcc10736"
    }
```

```diff
    contract L2OutputOracle (0xB751A613f2Db932c6cdeF5048E6D2af05F9B98ED) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      values.$pastUpgrades.0.2:
+        ["0xaBA3C0FCe72122750D71d4739D7E5Fc7c8a355d4"]
      values.$pastUpgrades.0.1:
-        ["0xaBA3C0FCe72122750D71d4739D7E5Fc7c8a355d4"]
+        "0xd780db925a08261a82189b1d692b87934304277d8db9e6e2faf198afdd0d2c13"
    }
```

```diff
    contract SystemConfig (0xC975862927797812371A9Fb631f83F8f5e2240D5) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      values.$pastUpgrades.0.2:
+        ["0x08C033C6859093b2803e54DE715077bd400D5f6a"]
      values.$pastUpgrades.0.1:
-        ["0x08C033C6859093b2803e54DE715077bd400D5f6a"]
+        "0x2b9629c950de2ee9defa34d449dd784caa1877200c1c6fabfbde02692a6d077f"
    }
```

```diff
    contract L1CrossDomainMessenger (0xf80be9f7a74ab776b69d3F0dC5C08c39b3A0bA19) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      values.$pastUpgrades.1.2:
+        ["0x958487e21ba9E073836d598E31f749726f23413f"]
      values.$pastUpgrades.1.1:
-        ["0x958487e21ba9E073836d598E31f749726f23413f"]
+        "0x9d07d5c5f28d46fdc0b6ff4ecf7cdf165e162a5d44623955da21c7340686d8f5"
      values.$pastUpgrades.0.2:
+        ["0xf80be9f7a74ab776b69d3F0dC5C08c39b3A0bA19"]
      values.$pastUpgrades.0.1:
-        ["0xf80be9f7a74ab776b69d3F0dC5C08c39b3A0bA19"]
+        "0x127974ee188b1f3ce9ff4ad58f1cb84fa84029b470db08a64958dd97d350d8c7"
    }
```

Generated with discovered.json: 0x03d42535d8fb607379d5d54f4b765351b458ccd9

# Diff at Wed, 16 Oct 2024 11:38:00 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@a3d139b799cc0b28e5e912febb17464d4e5aef5d block: 20915064
- current block number: 20915064

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20915064 (main branch discovery), not current.

```diff
    contract ConduitMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      roles:
-        ["Challenger","Guardian"]
      receivedPermissions.7:
+        {"permission":"upgrade","target":"0xC975862927797812371A9Fb631f83F8f5e2240D5","via":[{"address":"0xc684075a7Cc997Aa2e72152c330BDAc73FeacbDF"}]}
      receivedPermissions.6:
+        {"permission":"upgrade","target":"0xB751A613f2Db932c6cdeF5048E6D2af05F9B98ED","via":[{"address":"0xc684075a7Cc997Aa2e72152c330BDAc73FeacbDF"}]}
      receivedPermissions.5.target:
-        "0xC975862927797812371A9Fb631f83F8f5e2240D5"
+        "0x59625d1FE0Eeb8114a4d13c863978F39b3471781"
      receivedPermissions.4.target:
-        "0xB751A613f2Db932c6cdeF5048E6D2af05F9B98ED"
+        "0x2b3F201543adF73160bA42E1a5b7750024F30420"
      receivedPermissions.4.description:
+        "upgrading bridge implementation allows to access all funds and change every system component."
      receivedPermissions.3.permission:
-        "upgrade"
+        "guard"
      receivedPermissions.3.via:
-        [{"address":"0xc684075a7Cc997Aa2e72152c330BDAc73FeacbDF"}]
      receivedPermissions.2.permission:
-        "upgrade"
+        "configure"
      receivedPermissions.2.target:
-        "0x2b3F201543adF73160bA42E1a5b7750024F30420"
+        "0xEa4165C5CDCA155779803A113d8391b741bA5228"
      receivedPermissions.2.description:
-        "upgrading bridge implementation allows to access all funds and change every system component."
+        "set and change address mappings."
      receivedPermissions.1.target:
-        "0xEa4165C5CDCA155779803A113d8391b741bA5228"
+        "0xC975862927797812371A9Fb631f83F8f5e2240D5"
      receivedPermissions.1.description:
-        "set and change address mappings."
+        "it can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system."
      receivedPermissions.1.via:
-        [{"address":"0xc684075a7Cc997Aa2e72152c330BDAc73FeacbDF"}]
      receivedPermissions.0.permission:
-        "configure"
+        "challenge"
      receivedPermissions.0.target:
-        "0xC975862927797812371A9Fb631f83F8f5e2240D5"
+        "0xB751A613f2Db932c6cdeF5048E6D2af05F9B98ED"
      receivedPermissions.0.description:
-        "it can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system."
    }
```

```diff
    contract OptimismPortal (0x59625d1FE0Eeb8114a4d13c863978F39b3471781) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      issuedPermissions.1:
+        {"permission":"upgrade","target":"0x4a4962275DF8C60a80d3a25faEc5AA7De116A746","via":[{"address":"0xc684075a7Cc997Aa2e72152c330BDAc73FeacbDF","delay":0}]}
      issuedPermissions.0.permission:
-        "upgrade"
+        "guard"
      issuedPermissions.0.via.0:
-        {"address":"0xc684075a7Cc997Aa2e72152c330BDAc73FeacbDF","delay":0}
    }
```

```diff
    contract L2OutputOracle (0xB751A613f2Db932c6cdeF5048E6D2af05F9B98ED) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      issuedPermissions.2:
+        {"permission":"upgrade","target":"0x4a4962275DF8C60a80d3a25faEc5AA7De116A746","via":[{"address":"0xc684075a7Cc997Aa2e72152c330BDAc73FeacbDF","delay":0}]}
      issuedPermissions.1:
+        {"permission":"propose","target":"0x3d53Df1e69A32F98dFCcf23CCB689763E21A78bA","via":[]}
      issuedPermissions.0.permission:
-        "upgrade"
+        "challenge"
      issuedPermissions.0.via.0:
-        {"address":"0xc684075a7Cc997Aa2e72152c330BDAc73FeacbDF","delay":0}
    }
```

```diff
    contract SystemConfig (0xC975862927797812371A9Fb631f83F8f5e2240D5) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      issuedPermissions.2:
+        {"permission":"upgrade","target":"0x4a4962275DF8C60a80d3a25faEc5AA7De116A746","via":[{"address":"0xc684075a7Cc997Aa2e72152c330BDAc73FeacbDF","delay":0}]}
      issuedPermissions.1.permission:
-        "upgrade"
+        "sequence"
      issuedPermissions.1.target:
-        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
+        "0x68bdFecE01535090c8f3C27ec3b1AE97E83fA4aA"
      issuedPermissions.1.via.0:
-        {"address":"0xc684075a7Cc997Aa2e72152c330BDAc73FeacbDF","delay":0}
    }
```

Generated with discovered.json: 0xee4da1c703ca11994585ea3ca45b8d2dd352d71d

# Diff at Mon, 14 Oct 2024 10:53:04 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1afc77ff111ceb0970e7d09efcc7b2f376b0c281 block: 20915064
- current block number: 20915064

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20915064 (main branch discovery), not current.

```diff
    contract L1StandardBridge (0x2b3F201543adF73160bA42E1a5b7750024F30420) {
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
    contract OptimismPortal (0x59625d1FE0Eeb8114a4d13c863978F39b3471781) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      sourceHashes:
+        ["0x2cdcfef705094aaac53d507bad64d27b48ea5a9c11a7fadffacc192aab7a823f","0xd7fe53899c31d6d8e73b6724694736dc3c3c4ebc8f4ddbe989fe9d3dba26692d"]
    }
```

```diff
    contract L2OutputOracle (0xB751A613f2Db932c6cdeF5048E6D2af05F9B98ED) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      sourceHashes:
+        ["0x2cdcfef705094aaac53d507bad64d27b48ea5a9c11a7fadffacc192aab7a823f","0xcca8986d0789aa489ba57cd234e886bd92cb5a0d477e1f5ae5e6e030e15fb183"]
    }
```

```diff
    contract ProxyAdmin (0xc684075a7Cc997Aa2e72152c330BDAc73FeacbDF) {
    +++ description: None
      template:
-        "opstack/ProxyAdmin"
+        "global/ProxyAdmin"
      sourceHashes:
+        ["0x96d2f0fa1bd83ebd61ba6a2351c64c7fda7aa580b11ea67bb6bf4338e5c28512"]
    }
```

```diff
    contract SystemConfig (0xC975862927797812371A9Fb631f83F8f5e2240D5) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      sourceHashes:
+        ["0x2cdcfef705094aaac53d507bad64d27b48ea5a9c11a7fadffacc192aab7a823f","0x29908eb7685943ff431cd384af851ce36a30997bbad880f9b4385bfc3abb86a2"]
    }
```

```diff
    contract AddressManager (0xEa4165C5CDCA155779803A113d8391b741bA5228) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      sourceHashes:
+        ["0xdc86a850f11dc2b5c0472a05d0e3c14f239baf2c3b1ab19631591b0827985380"]
    }
```

```diff
    contract L1CrossDomainMessenger (0xf80be9f7a74ab776b69d3F0dC5C08c39b3A0bA19) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      sourceHashes:
+        ["0x20a2eb4d3677fc8a15e944f7b1843acd01b2e92acdc4c7a7f7a35b07b891149b","0xebfb36a18bcaa176678925149b43fdc5f9f943d98a6405ae1cbc26f4c168ff88"]
    }
```

Generated with discovered.json: 0x2f8a0067d0f54fff426d1712769d173dc7746819

# Diff at Wed, 09 Oct 2024 13:09:58 GMT:

- chain: ethereum
- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@37683e2b3d0587372f886eef49e921277810c8bf block: 20915064
- current block number: 20915064

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20915064 (main branch discovery), not current.

```diff
    contract ConduitMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      receivedPermissions.1.description:
+        "set and change address mappings."
    }
```

```diff
    contract ProxyAdmin (0xc684075a7Cc997Aa2e72152c330BDAc73FeacbDF) {
    +++ description: None
      directlyReceivedPermissions.0.description:
+        "set and change address mappings."
    }
```

```diff
    contract AddressManager (0xEa4165C5CDCA155779803A113d8391b741bA5228) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      issuedPermissions.0.via.0.description:
+        "set and change address mappings."
      descriptions:
+        ["Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts."]
    }
```

Generated with discovered.json: 0x2857b7cc32864c486998374c5650111df06679b5

# Diff at Tue, 01 Oct 2024 10:53:06 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bd754dc73c66120164006054f8d25c5fae9cd910 block: 20032860
- current block number: 20032860

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20032860 (main branch discovery), not current.

```diff
    contract L1StandardBridge (0x2b3F201543adF73160bA42E1a5b7750024F30420) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token.
      values.$pastUpgrades:
+        []
    }
```

```diff
    contract OptimismPortal (0x59625d1FE0Eeb8114a4d13c863978F39b3471781) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      values.$pastUpgrades:
+        [["2024-05-13T14:04:47.000Z",["0x9Cb8F5CBD26d7843a6043EcaB3C12246F8F47FBA"]]]
    }
```

```diff
    contract L2OutputOracle (0xB751A613f2Db932c6cdeF5048E6D2af05F9B98ED) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      values.$pastUpgrades:
+        [["2024-05-13T14:04:47.000Z",["0xaBA3C0FCe72122750D71d4739D7E5Fc7c8a355d4"]]]
    }
```

```diff
    contract SystemConfig (0xC975862927797812371A9Fb631f83F8f5e2240D5) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      values.$pastUpgrades:
+        [["2024-05-13T14:04:47.000Z",["0x08C033C6859093b2803e54DE715077bd400D5f6a"]]]
    }
```

```diff
    contract L1CrossDomainMessenger (0xf80be9f7a74ab776b69d3F0dC5C08c39b3A0bA19) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      values.$pastUpgrades:
+        [["2024-05-13T14:04:23.000Z",["0xf80be9f7a74ab776b69d3F0dC5C08c39b3A0bA19"]],["2024-05-13T14:04:47.000Z",["0x958487e21ba9E073836d598E31f749726f23413f"]]]
      values.$upgradeCount:
+        2
    }
```

Generated with discovered.json: 0x4d4a060c945d3ee7625ef881e76e1744b92a522f

# Diff at Tue, 17 Sep 2024 09:19:45 GMT:

- chain: ethereum
- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@a17234c1dfeb209a9842df2b454c07e2b8da435d block: 20032860
- current block number: 20032860

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20032860 (main branch discovery), not current.

```diff
    contract L1StandardBridge (0x2b3F201543adF73160bA42E1a5b7750024F30420) {
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
      receivedPermissions.2.description:
+        "upgrading bridge implementation allows to access all funds and change every system component."
      roles:
+        ["Challenger","Guardian"]
    }
```

```diff
    contract ProxyAdmin (0xc684075a7Cc997Aa2e72152c330BDAc73FeacbDF) {
    +++ description: None
      directlyReceivedPermissions.1.description:
+        "upgrading bridge implementation allows to access all funds and change every system component."
    }
```

```diff
    contract L1CrossDomainMessenger (0xf80be9f7a74ab776b69d3F0dC5C08c39b3A0bA19) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      categories:
+        ["Core"]
    }
```

Generated with discovered.json: 0x853e63a362fe17fee5d5625ac0958fe682ff1c84

# Diff at Sun, 08 Sep 2024 17:18:50 GMT:

- chain: ethereum
- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@fd881462cca0d7ef4519f907f3c6cfd5fe1cde8f block: 20032860
- current block number: 20032860

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20032860 (main branch discovery), not current.

```diff
    contract L1StandardBridge (0x2b3F201543adF73160bA42E1a5b7750024F30420) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xc684075a7Cc997Aa2e72152c330BDAc73FeacbDF"
+        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      issuedPermissions.0.via.0:
+        {"address":"0xc684075a7Cc997Aa2e72152c330BDAc73FeacbDF","delay":0}
    }
```

```diff
    contract ConduitMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      descriptions:
-        ["It can act on behalf of 0xc684075a7Cc997Aa2e72152c330BDAc73FeacbDF, inheriting its permissions.","It can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system."]
      receivedPermissions.5:
+        {"permission":"upgrade","target":"0xC975862927797812371A9Fb631f83F8f5e2240D5","via":[{"address":"0xc684075a7Cc997Aa2e72152c330BDAc73FeacbDF"}]}
      receivedPermissions.4:
+        {"permission":"upgrade","target":"0xB751A613f2Db932c6cdeF5048E6D2af05F9B98ED","via":[{"address":"0xc684075a7Cc997Aa2e72152c330BDAc73FeacbDF"}]}
      receivedPermissions.3:
+        {"permission":"upgrade","target":"0x59625d1FE0Eeb8114a4d13c863978F39b3471781","via":[{"address":"0xc684075a7Cc997Aa2e72152c330BDAc73FeacbDF"}]}
      receivedPermissions.2:
+        {"permission":"upgrade","target":"0x2b3F201543adF73160bA42E1a5b7750024F30420","via":[{"address":"0xc684075a7Cc997Aa2e72152c330BDAc73FeacbDF"}]}
      receivedPermissions.1.target:
-        "0xC975862927797812371A9Fb631f83F8f5e2240D5"
+        "0xEa4165C5CDCA155779803A113d8391b741bA5228"
      receivedPermissions.1.via:
+        [{"address":"0xc684075a7Cc997Aa2e72152c330BDAc73FeacbDF"}]
      receivedPermissions.0.target:
-        "0xc684075a7Cc997Aa2e72152c330BDAc73FeacbDF"
+        "0xC975862927797812371A9Fb631f83F8f5e2240D5"
      receivedPermissions.0.description:
+        "it can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system."
      directlyReceivedPermissions:
+        [{"permission":"act","target":"0xc684075a7Cc997Aa2e72152c330BDAc73FeacbDF"}]
    }
```

```diff
    contract OptimismPortal (0x59625d1FE0Eeb8114a4d13c863978F39b3471781) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      issuedPermissions.0.target:
-        "0xc684075a7Cc997Aa2e72152c330BDAc73FeacbDF"
+        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      issuedPermissions.0.via.0:
+        {"address":"0xc684075a7Cc997Aa2e72152c330BDAc73FeacbDF","delay":0}
    }
```

```diff
    contract L2OutputOracle (0xB751A613f2Db932c6cdeF5048E6D2af05F9B98ED) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      issuedPermissions.0.target:
-        "0xc684075a7Cc997Aa2e72152c330BDAc73FeacbDF"
+        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      issuedPermissions.0.via.0:
+        {"address":"0xc684075a7Cc997Aa2e72152c330BDAc73FeacbDF","delay":0}
    }
```

```diff
    contract ProxyAdmin (0xc684075a7Cc997Aa2e72152c330BDAc73FeacbDF) {
    +++ description: None
      issuedPermissions:
-        [{"permission":"configure","target":"0x4a4962275DF8C60a80d3a25faEc5AA7De116A746","via":[]}]
      receivedPermissions:
-        [{"permission":"configure","target":"0xEa4165C5CDCA155779803A113d8391b741bA5228"},{"permission":"upgrade","target":"0x2b3F201543adF73160bA42E1a5b7750024F30420"},{"permission":"upgrade","target":"0x59625d1FE0Eeb8114a4d13c863978F39b3471781"},{"permission":"upgrade","target":"0xB751A613f2Db932c6cdeF5048E6D2af05F9B98ED"},{"permission":"upgrade","target":"0xC975862927797812371A9Fb631f83F8f5e2240D5"}]
      directlyReceivedPermissions:
+        [{"permission":"configure","target":"0xEa4165C5CDCA155779803A113d8391b741bA5228"},{"permission":"upgrade","target":"0x2b3F201543adF73160bA42E1a5b7750024F30420"},{"permission":"upgrade","target":"0x59625d1FE0Eeb8114a4d13c863978F39b3471781"},{"permission":"upgrade","target":"0xB751A613f2Db932c6cdeF5048E6D2af05F9B98ED"},{"permission":"upgrade","target":"0xC975862927797812371A9Fb631f83F8f5e2240D5"}]
    }
```

```diff
    contract SystemConfig (0xC975862927797812371A9Fb631f83F8f5e2240D5) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      issuedPermissions.1.target:
-        "0xc684075a7Cc997Aa2e72152c330BDAc73FeacbDF"
+        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      issuedPermissions.1.via.0:
+        {"address":"0xc684075a7Cc997Aa2e72152c330BDAc73FeacbDF","delay":0}
    }
```

```diff
    contract AddressManager (0xEa4165C5CDCA155779803A113d8391b741bA5228) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xc684075a7Cc997Aa2e72152c330BDAc73FeacbDF"
+        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      issuedPermissions.0.via.0:
+        {"address":"0xc684075a7Cc997Aa2e72152c330BDAc73FeacbDF","delay":0}
    }
```

Generated with discovered.json: 0x3bf5da31819ff1427e452945233ffe550cabb39b

# Diff at Fri, 30 Aug 2024 07:53:45 GMT:

- chain: ethereum
- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@6c1bd1f41fadf5f2cb1c1805b5a2c6138a3ed35a block: 20032860
- current block number: 20032860

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20032860 (main branch discovery), not current.

```diff
    contract ConduitMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: It can act on behalf of 0xc684075a7Cc997Aa2e72152c330BDAc73FeacbDF, inheriting its permissions. It can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system.
      receivedPermissions.1.via:
-        []
      receivedPermissions.0.via:
-        []
    }
```

```diff
    contract ProxyAdmin (0xc684075a7Cc997Aa2e72152c330BDAc73FeacbDF) {
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

Generated with discovered.json: 0xe377321f8f756baf61b172572d8db26130d2c3a0

# Diff at Fri, 23 Aug 2024 09:53:24 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@67597c7d6c810bc726594446890178150240711e block: 20032860
- current block number: 20032860

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20032860 (main branch discovery), not current.

```diff
    contract L1StandardBridge (0x2b3F201543adF73160bA42E1a5b7750024F30420) {
    +++ description: None
      values.$upgradeCount:
+        0
    }
```

```diff
    contract OptimismPortal (0x59625d1FE0Eeb8114a4d13c863978F39b3471781) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      values.$upgradeCount:
+        1
    }
```

```diff
    contract L2OutputOracle (0xB751A613f2Db932c6cdeF5048E6D2af05F9B98ED) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      values.$upgradeCount:
+        1
    }
```

```diff
    contract SystemConfig (0xC975862927797812371A9Fb631f83F8f5e2240D5) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      values.$upgradeCount:
+        1
    }
```

Generated with discovered.json: 0x98b95361b6a19b8d49a861ad2a039b3392df189b

# Diff at Wed, 21 Aug 2024 10:04:10 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@2f6dde3357bf5d79196b6e94f79d853a6c4ec72b block: 20032860
- current block number: 20032860

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20032860 (main branch discovery), not current.

```diff
    contract L1StandardBridge (0x2b3F201543adF73160bA42E1a5b7750024F30420) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xc684075a7Cc997Aa2e72152c330BDAc73FeacbDF","via":[]}]
    }
```

```diff
    contract ConduitMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: It can act on behalf of 0xc684075a7Cc997Aa2e72152c330BDAc73FeacbDF, inheriting its permissions. It can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system.
      assignedPermissions:
-        {"configure":["0xC975862927797812371A9Fb631f83F8f5e2240D5","0xc684075a7Cc997Aa2e72152c330BDAc73FeacbDF"]}
      receivedPermissions:
+        [{"permission":"configure","target":"0xc684075a7Cc997Aa2e72152c330BDAc73FeacbDF","via":[]},{"permission":"configure","target":"0xC975862927797812371A9Fb631f83F8f5e2240D5","via":[]}]
    }
```

```diff
    contract OptimismPortal (0x59625d1FE0Eeb8114a4d13c863978F39b3471781) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xc684075a7Cc997Aa2e72152c330BDAc73FeacbDF","via":[]}]
    }
```

```diff
    contract L2OutputOracle (0xB751A613f2Db932c6cdeF5048E6D2af05F9B98ED) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xc684075a7Cc997Aa2e72152c330BDAc73FeacbDF","via":[]}]
    }
```

```diff
    contract ProxyAdmin (0xc684075a7Cc997Aa2e72152c330BDAc73FeacbDF) {
    +++ description: None
      assignedPermissions:
-        {"upgrade":["0x2b3F201543adF73160bA42E1a5b7750024F30420","0x59625d1FE0Eeb8114a4d13c863978F39b3471781","0xB751A613f2Db932c6cdeF5048E6D2af05F9B98ED","0xC975862927797812371A9Fb631f83F8f5e2240D5"],"configure":["0xEa4165C5CDCA155779803A113d8391b741bA5228"]}
      issuedPermissions:
+        [{"permission":"configure","target":"0x4a4962275DF8C60a80d3a25faEc5AA7De116A746","via":[]}]
      receivedPermissions:
+        [{"permission":"configure","target":"0xEa4165C5CDCA155779803A113d8391b741bA5228","via":[]},{"permission":"upgrade","target":"0x2b3F201543adF73160bA42E1a5b7750024F30420","via":[]},{"permission":"upgrade","target":"0x59625d1FE0Eeb8114a4d13c863978F39b3471781","via":[]},{"permission":"upgrade","target":"0xB751A613f2Db932c6cdeF5048E6D2af05F9B98ED","via":[]},{"permission":"upgrade","target":"0xC975862927797812371A9Fb631f83F8f5e2240D5","via":[]}]
    }
```

```diff
    contract SystemConfig (0xC975862927797812371A9Fb631f83F8f5e2240D5) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      issuedPermissions:
+        [{"permission":"configure","target":"0x4a4962275DF8C60a80d3a25faEc5AA7De116A746","via":[]},{"permission":"upgrade","target":"0xc684075a7Cc997Aa2e72152c330BDAc73FeacbDF","via":[]}]
    }
```

```diff
    contract AddressManager (0xEa4165C5CDCA155779803A113d8391b741bA5228) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"configure","target":"0xc684075a7Cc997Aa2e72152c330BDAc73FeacbDF","via":[]}]
    }
```

Generated with discovered.json: 0xffa2ec60da5474402f9060f965246766d95f3576

# Diff at Fri, 09 Aug 2024 12:00:33 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bf40aa32f030fd312056ca0ef198c8550467d1d7 block: 20032860
- current block number: 20032860

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20032860 (main branch discovery), not current.

```diff
    contract ConduitMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: It can act on behalf of 0xc684075a7Cc997Aa2e72152c330BDAc73FeacbDF, inheriting its permissions. It can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system.
      assignedPermissions.configure.1:
-        "0xC975862927797812371A9Fb631f83F8f5e2240D5"
+        "0xc684075a7Cc997Aa2e72152c330BDAc73FeacbDF"
      assignedPermissions.configure.0:
-        "0xc684075a7Cc997Aa2e72152c330BDAc73FeacbDF"
+        "0xC975862927797812371A9Fb631f83F8f5e2240D5"
    }
```

Generated with discovered.json: 0xebbfc6090005d5430c4cdbea02ba0d9321224635

# Diff at Fri, 09 Aug 2024 10:10:38 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f0da1d0aab7bc6b3b5e54e7e93480bd98e57035 block: 20032860
- current block number: 20032860

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20032860 (main branch discovery), not current.

```diff
    contract ConduitMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: It can act on behalf of 0xc684075a7Cc997Aa2e72152c330BDAc73FeacbDF, inheriting its permissions. It can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system.
      assignedPermissions.owner:
-        ["0xC975862927797812371A9Fb631f83F8f5e2240D5","0xc684075a7Cc997Aa2e72152c330BDAc73FeacbDF"]
      assignedPermissions.configure:
+        ["0xc684075a7Cc997Aa2e72152c330BDAc73FeacbDF","0xC975862927797812371A9Fb631f83F8f5e2240D5"]
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
    contract ProxyAdmin (0xc684075a7Cc997Aa2e72152c330BDAc73FeacbDF) {
    +++ description: None
      assignedPermissions.admin:
-        ["0x2b3F201543adF73160bA42E1a5b7750024F30420","0x59625d1FE0Eeb8114a4d13c863978F39b3471781","0xB751A613f2Db932c6cdeF5048E6D2af05F9B98ED","0xC975862927797812371A9Fb631f83F8f5e2240D5"]
      assignedPermissions.owner:
-        ["0xEa4165C5CDCA155779803A113d8391b741bA5228"]
      assignedPermissions.upgrade:
+        ["0x2b3F201543adF73160bA42E1a5b7750024F30420","0x59625d1FE0Eeb8114a4d13c863978F39b3471781","0xB751A613f2Db932c6cdeF5048E6D2af05F9B98ED","0xC975862927797812371A9Fb631f83F8f5e2240D5"]
      assignedPermissions.configure:
+        ["0xEa4165C5CDCA155779803A113d8391b741bA5228"]
    }
```

Generated with discovered.json: 0xef5d9930be760333d1e12f203bc4672f43849710

# Diff at Tue, 30 Jul 2024 11:12:51 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@b2b6471ff62871f4956541f42ec025c356c08f7e block: 20032860
- current block number: 20032860

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20032860 (main branch discovery), not current.

```diff
    contract SystemConfig (0xC975862927797812371A9Fb631f83F8f5e2240D5) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      fieldMeta:
+        {"gasLimit":{"severity":"LOW","description":"Gas limit for blocks on L2."}}
    }
```

Generated with discovered.json: 0x1d9d5f50fa5e5186410fb005a1c9728894bcede5

# Diff at Thu, 18 Jul 2024 10:31:59 GMT:

- chain: ethereum
- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@d89fe52cb65d643cef712d1d7910564a7acf2dce block: 20032860
- current block number: 20032860

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20032860 (main branch discovery), not current.

```diff
    contract ConduitMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      descriptions:
+        ["It can act on behalf of 0xc684075a7Cc997Aa2e72152c330BDAc73FeacbDF, inheriting its permissions.","It can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system."]
    }
```

```diff
    contract OptimismPortal (0x59625d1FE0Eeb8114a4d13c863978F39b3471781) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      descriptions.0:
-        "The main entry point to deposit funds from L1 to L2. It also allows to prove and finalize withdrawals."
+        "The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals."
    }
```

```diff
    contract SystemConfig (0xC975862927797812371A9Fb631f83F8f5e2240D5) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      descriptions.0:
-        "Contains configuration parameters such as the Sequencer address, the L2 gas limit and the unsafe block signer address."
+        "Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address."
    }
```

```diff
    contract L1CrossDomainMessenger (0xf80be9f7a74ab776b69d3F0dC5C08c39b3A0bA19) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      descriptions.0:
-        "Sends messages from L1 to L2, and relays messages from L2 onto L1. In the event that a message sent from L1 to L2 is rejected for exceeding the L2 epoch gas limit, it can be resubmitted via this contract's replay function."
+        "Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function."
    }
```

Generated with discovered.json: 0x8907a9d0268c44c81ceacbf6af9438ae3a744a10

# Diff at Thu, 06 Jun 2024 12:44:26 GMT:

- chain: ethereum
- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@5302ef2899ddfb7175df497ceaa47fba4e383655 block: 19982484
- current block number: 20032860

## Description

Discovery output now includes names of templates used for contract analysis.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19982484 (main branch discovery), not current.

```diff
    contract ConduitMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      template:
+        "GnosisSafe"
    }
```

```diff
    contract OptimismPortal (0x59625d1FE0Eeb8114a4d13c863978F39b3471781) {
    +++ description: The main entry point to deposit funds from L1 to L2. It also allows to prove and finalize withdrawals.
      template:
+        "opstack/OptimismPortal"
    }
```

```diff
    contract L2OutputOracle (0xB751A613f2Db932c6cdeF5048E6D2af05F9B98ED) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      template:
+        "opstack/L2OutputOracle"
    }
```

```diff
    contract SystemConfig (0xC975862927797812371A9Fb631f83F8f5e2240D5) {
    +++ description: Contains configuration parameters such as the Sequencer address, the L2 gas limit and the unsafe block signer address.
      template:
+        "opstack/SystemConfig"
    }
```

```diff
    contract L1CrossDomainMessenger (0xf80be9f7a74ab776b69d3F0dC5C08c39b3A0bA19) {
    +++ description: Sends messages from L1 to L2, and relays messages from L2 onto L1. In the event that a message sent from L1 to L2 is rejected for exceeding the L2 epoch gas limit, it can be resubmitted via this contract's replay function.
      template:
+        "opstack/L1CrossDomainMessenger"
    }
```

Generated with discovered.json: 0x88e0f828470372caf9a8af58d6227cfdd9d9c65d

# Diff at Thu, 23 May 2024 13:58:42 GMT:

- chain: ethereum
- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@ec50a072d7124fbf2bdaa30b50f821730ba6e919 block: 19926571
- current block number: 19933028

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

Generated with discovered.json: 0x4fe6b15ce9fb31f900191985a91e36dad486b310

# Diff at Wed, 22 May 2024 16:20:16 GMT:

- chain: ethereum
- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- current block number: 19926571

## Description

First discovery.

## Initial discovery

```diff
+   Status: CREATED
    contract L1StandardBridge (0x2b3F201543adF73160bA42E1a5b7750024F30420)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ConduitMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OptimismPortal (0x59625d1FE0Eeb8114a4d13c863978F39b3471781)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L2OutputOracle (0xB751A613f2Db932c6cdeF5048E6D2af05F9B98ED)
    +++ description: Central actor allowed to post new L2 state roots to L1.
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0xc684075a7Cc997Aa2e72152c330BDAc73FeacbDF)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SystemConfig (0xC975862927797812371A9Fb631f83F8f5e2240D5)
    +++ description: None
```

```diff
+   Status: CREATED
    contract AddressManager (0xEa4165C5CDCA155779803A113d8391b741bA5228)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1CrossDomainMessenger (0xf80be9f7a74ab776b69d3F0dC5C08c39b3A0bA19)
    +++ description: None
```

