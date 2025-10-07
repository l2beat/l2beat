Generated with discovered.json: 0x339ce62850bcc471ed5200f76a5468c031adcd2a

# Diff at Fri, 03 Oct 2025 08:42:17 GMT:

- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@e647409961cd173771dcfcaeb808991c99e73911 block: 1757342217
- current timestamp: 1759480868

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

Generated with discovered.json: 0x733105c3ddddfc18cc8a56dcf671cbb529c7609d

# Diff at Mon, 15 Sep 2025 09:50:29 GMT:

- author: Sergey Shemyakov (<sergey.shemyakov@l2beat.com>)
- comparing to: main@37882e40cb6029f3a2ae2bb177048e3e846b833d block: 1757342217
- current timestamp: 1757342217

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1757342217 (main branch discovery), not current.

```diff
    contract DisputeGameFactory (eth:0x87DAFf495b5F6c4f79CEeAAF85f1Ef3df3B30d21) {
    +++ description: The dispute game factory allows the creation of dispute games, used to propose state roots and eventually challenge them.
+++ severity: HIGH
      values.gameImpls.2:
+        "eth:0x0000000000000000000000000000000000000000"
+++ severity: HIGH
      values.gameImpls.3:
+        "eth:0x0000000000000000000000000000000000000000"
    }
```

Generated with discovered.json: 0xe5ebd7478519867680c623942d10a15ddba67604

# Diff at Mon, 08 Sep 2025 14:38:04 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@6e5af02c5100c2570f6cffd305339a1ef7226578 block: 1756214657
- current timestamp: 1757342217

## Description

gas limit increase.

## Watched changes

```diff
    contract SystemConfig (eth:0x0e4C4CDd01ceCB01070E9Fdfe7600871e4ae996e) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
+++ description: Gas limit for blocks on L2.
+++ severity: LOW
      values.gasLimit:
-        120000000
+        200000000
    }
```

Generated with discovered.json: 0xf85059a6c9ef502635cc295de16b8b8e6073251a

# Diff at Mon, 01 Sep 2025 10:01:10 GMT:

Merge mark

Generated with discovered.json: 0x56ecfb1fe3b5fe2cdc9d873e4483f828472dffed

# Diff at Tue, 26 Aug 2025 13:29:24 GMT:

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

Generated with discovered.json: 0x1803a496e78e9d16d29e6ce173ae328fc9e0d2c9

# Diff at Tue, 12 Aug 2025 14:41:06 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@e94498235c6c8b45d3e4bfb77316081ba540850a block: 1753430543
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

Generated with discovered.json: 0x9262cc5c15528d2b3cc181df3d5795392e9a8fe3

# Diff at Fri, 25 Jul 2025 15:49:53 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@85b717d6efe0c0a7691beb49532a0ce49bb7634a block: 22975733
- current block number: 22994843

## Description

Conduit: Optiportal2 upgrade (permissioned gametype). All contracts are using standard implementations.

absolute prestate: v1.6.0 (cannon64) - does not use alt-DA commitments

standard 3.5; 3.5; 7 finality conf

## Watched changes

```diff
    EOA  (0x03e820562ffd2e0390787caD706EaF1FF98C2608) {
    +++ description: None
      receivedPermissions.0:
-        {"permission":"propose","from":"eth:0x1145E7848c8B64c6cab86Fd6D378733385c5C3Ba","role":".proposer"}
      receivedPermissions.1.role:
-        ".PROPOSER"
+        ".proposer"
      receivedPermissions.1.from:
-        "eth:0x1145E7848c8B64c6cab86Fd6D378733385c5C3Ba"
+        "eth:0x35844639E3e674C484180C650EfD2170433Df71c"
    }
```

```diff
    contract OptimismMintableERC20Factory (0x08Dea366F26C25a08C8D1C3568ad07d1e587136d) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintableERC20 as this chain's representation of a token on the host chain, or vice-versa.
      sourceHashes.1:
-        "0x4c5ac4e53576924cabbd2a471f368a541bc3f4b1f53fa41a389692fcc62f6176"
+        "0x9650b4bba6299e410f01a369a95a2c57e1c3ca35f0d80c13f4f59fc468f370e5"
      values.$implementation:
-        "eth:0xE01efbeb1089D1d1dB9c6c8b135C934C0734c846"
+        "eth:0x5493f4677A186f64805fe7317D6993ba4863988F"
      values.$pastUpgrades.4:
+        ["2025-07-24T14:52:47.000Z","0xb41226dab91e6857f94533a72be19210a412221cd34a454076d43efe17278af8",["eth:0x5493f4677A186f64805fe7317D6993ba4863988F"]]
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
    contract SystemConfig (0x0e4C4CDd01ceCB01070E9Fdfe7600871e4ae996e) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      sourceHashes.1:
-        "0xc7135dbd2a53312d36df3f3ee91ce0a5a459ab8fc7725880a3a9c55a5fa0ed6c"
+        "0x921de6fc906d159fdcef862d2b9559063f5e7b9b7588fa5f33153360ddf296e7"
      values.$implementation:
-        "eth:0xAB9d6cB7A427c0765163A7f45BB91cAfe5f2D375"
+        "eth:0x340f923E5c7cbB2171146f64169EC9d5a9FfE647"
      values.$pastUpgrades.4:
+        ["2025-07-24T14:52:47.000Z","0xb41226dab91e6857f94533a72be19210a412221cd34a454076d43efe17278af8",["eth:0xd81f43eDBCAcb4c29a9bA38a13Ee5d79278270cC"]]
      values.$pastUpgrades.5:
+        ["2025-07-24T14:52:47.000Z","0xb41226dab91e6857f94533a72be19210a412221cd34a454076d43efe17278af8",["eth:0xAB9d6cB7A427c0765163A7f45BB91cAfe5f2D375"]]
      values.$pastUpgrades.6:
+        ["2025-07-24T14:52:47.000Z","0xb41226dab91e6857f94533a72be19210a412221cd34a454076d43efe17278af8",["eth:0x760C48C62A85045A6B69f07F4a9f22868659CbCc"]]
      values.$pastUpgrades.7:
+        ["2025-07-24T14:52:47.000Z","0xb41226dab91e6857f94533a72be19210a412221cd34a454076d43efe17278af8",["eth:0x340f923E5c7cbB2171146f64169EC9d5a9FfE647"]]
      values.$upgradeCount:
-        4
+        8
      values.basefeeScalar:
-        0
+        39330
      values.disputeGameFactory:
-        "eth:0x0000000000000000000000000000000000000000"
+        "eth:0x87DAFf495b5F6c4f79CEeAAF85f1Ef3df3B30d21"
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
+        {"l1CrossDomainMessenger":"eth:0x5456f02c08e9A018E42C39b351328E5AA864174A","l1ERC721Bridge":"eth:0x6CC3268794c5d3E3d9d52adEfC748B59d536cb22","l1StandardBridge":"eth:0x61E44dC0dae6888B5a301887732217d5725B0bFf","disputeGameFactory":"eth:0x87DAFf495b5F6c4f79CEeAAF85f1Ef3df3B30d21","optimismPortal":"eth:0x85eA9c11cf3D4786027F7FD08F4406b15777e5f8","optimismMintableERC20Factory":"eth:0x08Dea366F26C25a08C8D1C3568ad07d1e587136d"}
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
-   Status: DELETED
    contract L2OutputOracle (0x1145E7848c8B64c6cab86Fd6D378733385c5C3Ba)
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
```

```diff
    contract ProxyAdmin (0x35d5D43271548c984662d4879FBc8e041Bc1Ff93) {
    +++ description: None
      directlyReceivedPermissions.3.from:
-        "eth:0x1145E7848c8B64c6cab86Fd6D378733385c5C3Ba"
+        "eth:0x50E61EBCAB2307584B22bCFC32B97a0B56Ed2A31"
      directlyReceivedPermissions.8:
+        {"permission":"upgrade","from":"eth:0x87DAFf495b5F6c4f79CEeAAF85f1Ef3df3B30d21","role":"admin"}
      directlyReceivedPermissions.9:
+        {"permission":"upgrade","from":"eth:0xd6f5C91E2bD2ed5726eE84e8D7B97B01A079E1C5","role":"admin"}
    }
```

```diff
    contract Conduit Multisig 1 (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      receivedPermissions.0:
+        {"permission":"challenge","from":"eth:0x35844639E3e674C484180C650EfD2170433Df71c","role":".challenger"}
      receivedPermissions.1:
-        {"permission":"guard","from":"eth:0x85eA9c11cf3D4786027F7FD08F4406b15777e5f8","role":".guardian"}
      receivedPermissions.2:
-        {"permission":"guard","from":"eth:0x85eA9c11cf3D4786027F7FD08F4406b15777e5f8","role":".GUARDIAN"}
      receivedPermissions.3:
+        {"permission":"interact","from":"eth:0x50E61EBCAB2307584B22bCFC32B97a0B56Ed2A31","description":"can pull funds from the contract in case of emergency.","role":".owner"}
      receivedPermissions.8.from:
-        "eth:0x1145E7848c8B64c6cab86Fd6D378733385c5C3Ba"
+        "eth:0x50E61EBCAB2307584B22bCFC32B97a0B56Ed2A31"
      receivedPermissions.13:
+        {"permission":"upgrade","from":"eth:0x87DAFf495b5F6c4f79CEeAAF85f1Ef3df3B30d21","role":"admin","via":[{"address":"eth:0x35d5D43271548c984662d4879FBc8e041Bc1Ff93"}]}
      receivedPermissions.14:
+        {"permission":"upgrade","from":"eth:0xd6f5C91E2bD2ed5726eE84e8D7B97B01A079E1C5","role":"admin","via":[{"address":"eth:0x35d5D43271548c984662d4879FBc8e041Bc1Ff93"}]}
    }
```

```diff
    contract L1CrossDomainMessenger (0x5456f02c08e9A018E42C39b351328E5AA864174A) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      sourceHashes.1:
-        "0x1cc8a3b7de3d2c54c4706bb3f3015714d3b56647fc9fbfd6f8b068f5f63c1c25"
+        "0x03bcdc719cb7bd0a1377c01bb50b30a6122b308f673b7d7b15a3bb8628e6bd8c"
      values.$implementation:
-        "eth:0xD3494713A5cfaD3F5359379DfA074E2Ac8C6Fd65"
+        "eth:0x5D5a095665886119693F0B41d8DFeE78da033e8B"
      values.$pastUpgrades.6:
+        ["2025-07-24T14:52:47.000Z","0xb41226dab91e6857f94533a72be19210a412221cd34a454076d43efe17278af8",["eth:0x3eA6084748ED1b2A9B5D4426181F1ad8C93F6231"]]
      values.$pastUpgrades.7:
+        ["2025-07-24T14:52:47.000Z","0xb41226dab91e6857f94533a72be19210a412221cd34a454076d43efe17278af8",["eth:0x5D5a095665886119693F0B41d8DFeE78da033e8B"]]
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
    contract L1StandardBridge (0x61E44dC0dae6888B5a301887732217d5725B0bFf) {
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
    contract L1ERC721Bridge (0x6CC3268794c5d3E3d9d52adEfC748B59d536cb22) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      sourceHashes.1:
-        "0x482ec6e91304ac39a3fb4505634427bddfddee23b8e93a4f7f995ca5083ae3c3"
+        "0x28669b49da3effd51f0f9424ca9cdd455c5b9327c09a40c65fc06f114a6eb837"
      values.$implementation:
-        "eth:0xAE2AF01232a6c4a4d3012C5eC5b1b35059caF10d"
+        "eth:0x7aE1d3BD877a4C5CA257404ce26BE93A02C98013"
      values.$pastUpgrades.5:
+        ["2025-07-24T14:52:47.000Z","0xb41226dab91e6857f94533a72be19210a412221cd34a454076d43efe17278af8",["eth:0x276d3730f219f7ec22274f7263180b8452B46d47"]]
      values.$pastUpgrades.6:
+        ["2025-07-24T14:52:47.000Z","0xb41226dab91e6857f94533a72be19210a412221cd34a454076d43efe17278af8",["eth:0x7aE1d3BD877a4C5CA257404ce26BE93A02C98013"]]
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
    contract OptimismPortal2 (0x85eA9c11cf3D4786027F7FD08F4406b15777e5f8) {
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
+        ["2025-07-24T14:52:47.000Z","0xb41226dab91e6857f94533a72be19210a412221cd34a454076d43efe17278af8",["eth:0xd81f43eDBCAcb4c29a9bA38a13Ee5d79278270cC"]]
      values.$pastUpgrades.4:
+        ["2025-07-24T14:52:47.000Z","0xb41226dab91e6857f94533a72be19210a412221cd34a454076d43efe17278af8",["eth:0xe2F826324b2faf99E513D16D266c3F80aE87832B"]]
      values.$pastUpgrades.5:
+        ["2025-07-24T14:52:47.000Z","0xb41226dab91e6857f94533a72be19210a412221cd34a454076d43efe17278af8",["eth:0x2D7e764a0D9919e16983a46595CfA81fc34fa7Cd"]]
      values.$pastUpgrades.6:
+        ["2025-07-24T14:52:47.000Z","0xb41226dab91e6857f94533a72be19210a412221cd34a454076d43efe17278af8",["eth:0xB443Da3e07052204A02d630a8933dAc05a0d6fB4"]]
      values.$upgradeCount:
-        3
+        7
      values.GUARDIAN:
-        "eth:0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      values.L2_ORACLE:
-        "eth:0x1145E7848c8B64c6cab86Fd6D378733385c5C3Ba"
      values.l2Oracle:
-        "eth:0x1145E7848c8B64c6cab86Fd6D378733385c5C3Ba"
      values.SYSTEM_CONFIG:
-        "eth:0x0e4C4CDd01ceCB01070E9Fdfe7600871e4ae996e"
      values.version:
-        "2.5.0"
+        "3.14.0"
      values.disputeGameFactory:
+        "eth:0x87DAFf495b5F6c4f79CEeAAF85f1Ef3df3B30d21"
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
+        1753368767
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
    contract LyraMultisig (0x91F4be0C264FAFA1fEd75c4440910Cba2cAd98e8)
    +++ description: None
```

```diff
+   Status: CREATED
    contract PreimageOracle (0x1fb8cdFc6831fc866Ed9C51aF8817Da5c287aDD3)
    +++ description: The PreimageOracle contract is used to load the required data from L1 for a dispute game.
```

```diff
+   Status: CREATED
    contract PermissionedDisputeGame (0x35844639E3e674C484180C650EfD2170433Df71c)
    +++ description: Same as FaultDisputeGame, but only two permissioned addresses are designated as proposer and challenger.
```

```diff
+   Status: CREATED
    contract DelayedWETH (0x50E61EBCAB2307584B22bCFC32B97a0B56Ed2A31)
    +++ description: Contract designed to hold the bonded ETH for each game. It is designed as a wrapper around WETH to allow an owner to function as a backstop if a game would incorrectly distribute funds.
```

```diff
+   Status: CREATED
    contract DisputeGameFactory (0x87DAFf495b5F6c4f79CEeAAF85f1Ef3df3B30d21)
    +++ description: The dispute game factory allows the creation of dispute games, used to propose state roots and eventually challenge them.
```

```diff
+   Status: CREATED
    contract AnchorStateRegistry (0xd6f5C91E2bD2ed5726eE84e8D7B97B01A079E1C5)
    +++ description: Contains the latest confirmed state root that can be used as a starting point in a dispute game.
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
 .../lyra/ethereum/.flat/DelayedWETH/Proxy.p.sol    |  200 +
 .../DisputeGameFactory/DisputeGameFactory.sol      | 1482 +++++++
 .../ethereum/.flat/DisputeGameFactory/Proxy.p.sol  |  200 +
 .../L1CrossDomainMessenger.sol                     |  736 +++-
 .../L1ERC721Bridge/L1ERC721Bridge.sol              |  418 +-
 .../L1StandardBridge/L1StandardBridge.sol          |  508 ++-
 .../L2OutputOracle/L2OutputOracle.sol => /dev/null |  679 ----
 .../LyraMultisig/GnosisSafe.sol => /dev/null       |  953 -----
 .../GnosisSafeProxy.p.sol => /dev/null             |   35 -
 .../src/projects/lyra/ethereum/.flat/MIPS.sol      | 2515 ++++++++++++
 .../OptimismMintableERC20Factory.sol               |   30 +-
 .../OptimismPortal/Proxy.p.sol => /dev/null        |  211 -
 .../OptimismPortal2/OptimismPortal2.sol}           |  926 +++--
 .../OptimismPortal2}/Proxy.p.sol                   |    0
 .../ethereum/.flat/PermissionedDisputeGame.sol     | 4121 ++++++++++++++++++++
 .../lyra/ethereum/.flat/PreimageOracle.sol         | 1311 +++++++
 .../SystemConfig/SystemConfig.sol                  | 1439 +------
 20 files changed, 13121 insertions(+), 4019 deletions(-)
```

Generated with discovered.json: 0xf7de5c7abc5d31902c7e4ec652f9ec731a6da032

# Diff at Tue, 22 Jul 2025 15:53:19 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@83bf55f537ce86d3d1dac9f1a98f31f9169b801f block: 22895939
- current block number: 22975733

## Description

Conduit: Upgrade to known OP stack contracts. (no OptiPortal2 yet)

## Watched changes

```diff
    EOA  (0x03e820562ffd2e0390787caD706EaF1FF98C2608) {
    +++ description: None
      receivedPermissions.0:
+        {"permission":"propose","from":"eth:0x1145E7848c8B64c6cab86Fd6D378733385c5C3Ba","role":".proposer"}
    }
```

```diff
    contract OptimismMintableERC20Factory (0x08Dea366F26C25a08C8D1C3568ad07d1e587136d) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintableERC20 as this chain's representation of a token on the host chain, or vice-versa.
      sourceHashes.1:
-        "0xc8aea1ad75944084aeb3dc8b5c63135af405055da6baaffde3ed51e92c91e2eb"
+        "0x4c5ac4e53576924cabbd2a471f368a541bc3f4b1f53fa41a389692fcc62f6176"
      values.$implementation:
-        "eth:0x81C2645D347a67c089169a4Da074aF7788650955"
+        "eth:0xE01efbeb1089D1d1dB9c6c8b135C934C0734c846"
      values.$pastUpgrades.1:
+        ["2025-07-21T13:55:23.000Z","0xd68af1ee03a69c8215177fe7b44fbee51e722507e51a8351e767e459692f335e",["eth:0x6322C2f2D6a4305Fc033754d486A5A067Ee5F9b1"]]
      values.$pastUpgrades.2:
+        ["2025-07-21T13:55:23.000Z","0xd68af1ee03a69c8215177fe7b44fbee51e722507e51a8351e767e459692f335e",["eth:0xE01efbeb1089D1d1dB9c6c8b135C934C0734c846"]]
      values.$pastUpgrades.3:
+        ["2025-07-21T14:52:47.000Z","0x07329c5de3d281a32db65d3f66c8360fe0f228bddb79fdc80825e540627c9b2e",["eth:0xE01efbeb1089D1d1dB9c6c8b135C934C0734c846"]]
      values.$upgradeCount:
-        1
+        4
      values.version:
-        "1.1.1"
+        "1.9.0"
      values.bridge:
+        "eth:0x61E44dC0dae6888B5a301887732217d5725B0bFf"
      implementationNames.eth:0x81C2645D347a67c089169a4Da074aF7788650955:
-        "OptimismMintableERC20Factory"
      implementationNames.eth:0xE01efbeb1089D1d1dB9c6c8b135C934C0734c846:
+        "OptimismMintableERC20Factory"
    }
```

```diff
    contract SystemConfig (0x0e4C4CDd01ceCB01070E9Fdfe7600871e4ae996e) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      sourceHashes.1:
-        "0x29908eb7685943ff431cd384af851ce36a30997bbad880f9b4385bfc3abb86a2"
+        "0xc7135dbd2a53312d36df3f3ee91ce0a5a459ab8fc7725880a3a9c55a5fa0ed6c"
      values.$implementation:
-        "eth:0x81CCFC10CB55B58449A3FEE870D63C4D61941DaC"
+        "eth:0xAB9d6cB7A427c0765163A7f45BB91cAfe5f2D375"
      values.$pastUpgrades.1:
+        ["2025-07-21T13:55:23.000Z","0xd68af1ee03a69c8215177fe7b44fbee51e722507e51a8351e767e459692f335e",["eth:0x6322C2f2D6a4305Fc033754d486A5A067Ee5F9b1"]]
      values.$pastUpgrades.2:
+        ["2025-07-21T13:55:23.000Z","0xd68af1ee03a69c8215177fe7b44fbee51e722507e51a8351e767e459692f335e",["eth:0xba2492e52F45651B60B8B38d4Ea5E2390C64Ffb1"]]
      values.$pastUpgrades.3:
+        ["2025-07-21T14:52:47.000Z","0x07329c5de3d281a32db65d3f66c8360fe0f228bddb79fdc80825e540627c9b2e",["eth:0xAB9d6cB7A427c0765163A7f45BB91cAfe5f2D375"]]
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
+        "eth:0x5f7f7f6DB967F0ef10BdA0678964DBA185d16c50"
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
+        "eth:0x5456f02c08e9A018E42C39b351328E5AA864174A"
      values.l1ERC721Bridge:
+        "eth:0x6CC3268794c5d3E3d9d52adEfC748B59d536cb22"
      values.l1StandardBridge:
+        "eth:0x61E44dC0dae6888B5a301887732217d5725B0bFf"
      values.maximumGasLimit:
+        200000000
      values.OPTIMISM_MINTABLE_ERC20_FACTORY_SLOT:
+        "0xa04c5bb938ca6fc46d95553abf0a76345ce3e722a30bf4f74928b8e7d852320c"
      values.OPTIMISM_PORTAL_SLOT:
+        "0x4b6c74f9e688cb39801f2112c14a8c57232a3fc5202e1444126d4bce86eb19ac"
      values.optimismMintableERC20Factory:
+        "eth:0x08Dea366F26C25a08C8D1C3568ad07d1e587136d"
      values.optimismPortal:
+        "eth:0x85eA9c11cf3D4786027F7FD08F4406b15777e5f8"
      values.START_BLOCK_SLOT:
+        "0xa11ee3ab75b40e88a0105e935d17cd36c8faee0138320d776c411291bdbbb19f"
      values.startBlock:
+        18574846
      implementationNames.eth:0x81CCFC10CB55B58449A3FEE870D63C4D61941DaC:
-        "SystemConfig"
      implementationNames.eth:0xAB9d6cB7A427c0765163A7f45BB91cAfe5f2D375:
+        "SystemConfig"
    }
```

```diff
    contract L2OutputOracle (0x1145E7848c8B64c6cab86Fd6D378733385c5C3Ba) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      sourceHashes.1:
-        "0xcca8986d0789aa489ba57cd234e886bd92cb5a0d477e1f5ae5e6e030e15fb183"
+        "0x025c187b0231be4785898f25f98d749f953f5d06781772aef242812e2ecf52e3"
      values.$implementation:
-        "eth:0xad206309916Fe08A27221133dde05a8F30f75e29"
+        "eth:0xF243BEd163251380e78068d317ae10f26042B292"
      values.$pastUpgrades.1:
+        ["2025-07-21T13:55:23.000Z","0xd68af1ee03a69c8215177fe7b44fbee51e722507e51a8351e767e459692f335e",["eth:0x6322C2f2D6a4305Fc033754d486A5A067Ee5F9b1"]]
      values.$pastUpgrades.2:
+        ["2025-07-21T13:55:23.000Z","0xd68af1ee03a69c8215177fe7b44fbee51e722507e51a8351e767e459692f335e",["eth:0xF243BEd163251380e78068d317ae10f26042B292"]]
      values.$upgradeCount:
-        1
+        3
      values.version:
-        "1.3.1"
+        "1.8.0"
+++ severity: HIGH
      values.challenger:
+        "eth:0x91F4be0C264FAFA1fEd75c4440910Cba2cAd98e8"
      values.finalizationPeriodSeconds:
+        604800
      values.l2BlockTime:
+        2
+++ severity: HIGH
      values.proposer:
+        "eth:0x03e820562ffd2e0390787caD706EaF1FF98C2608"
      values.submissionInterval:
+        1800
      implementationNames.eth:0xad206309916Fe08A27221133dde05a8F30f75e29:
-        "L2OutputOracle"
      implementationNames.eth:0xF243BEd163251380e78068d317ae10f26042B292:
+        "L2OutputOracle"
    }
```

```diff
    contract Conduit Multisig 1 (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      receivedPermissions.0:
+        {"permission":"guard","from":"eth:0x097f99768A0a4a0A81bAbbCB1ea18193bA9D53cC","role":".guardian"}
      receivedPermissions.1:
+        {"permission":"guard","from":"eth:0x85eA9c11cf3D4786027F7FD08F4406b15777e5f8","role":".guardian"}
      receivedPermissions.2:
+        {"permission":"guard","from":"eth:0x85eA9c11cf3D4786027F7FD08F4406b15777e5f8","role":".GUARDIAN"}
      receivedPermissions.6:
+        {"permission":"upgrade","from":"eth:0x097f99768A0a4a0A81bAbbCB1ea18193bA9D53cC","role":"admin","via":[{"address":"eth:0xb4899FF43Ae727B1E9CB19AC44660e4A43Fad0b5"}]}
      directlyReceivedPermissions.1:
+        {"permission":"act","from":"eth:0xb4899FF43Ae727B1E9CB19AC44660e4A43Fad0b5","role":".owner"}
    }
```

```diff
    contract L1CrossDomainMessenger (0x5456f02c08e9A018E42C39b351328E5AA864174A) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      sourceHashes.1:
-        "0xebfb36a18bcaa176678925149b43fdc5f9f943d98a6405ae1cbc26f4c168ff88"
+        "0x1cc8a3b7de3d2c54c4706bb3f3015714d3b56647fc9fbfd6f8b068f5f63c1c25"
      values.$implementation:
-        "eth:0x93f5d9CD5BE592F1DC602E0CF4A38148b880cd13"
+        "eth:0xD3494713A5cfaD3F5359379DfA074E2Ac8C6Fd65"
      values.$pastUpgrades.2:
+        ["2025-07-21T13:55:23.000Z","0xd68af1ee03a69c8215177fe7b44fbee51e722507e51a8351e767e459692f335e",["eth:0x6322C2f2D6a4305Fc033754d486A5A067Ee5F9b1"]]
      values.$pastUpgrades.3:
+        ["2025-07-21T13:55:23.000Z","0xd68af1ee03a69c8215177fe7b44fbee51e722507e51a8351e767e459692f335e",["eth:0xD3494713A5cfaD3F5359379DfA074E2Ac8C6Fd65"]]
      values.$pastUpgrades.4:
+        ["2025-07-21T14:52:47.000Z","0x07329c5de3d281a32db65d3f66c8360fe0f228bddb79fdc80825e540627c9b2e",["eth:0xd81f43eDBCAcb4c29a9bA38a13Ee5d79278270cC"]]
      values.$pastUpgrades.5:
+        ["2025-07-21T14:52:47.000Z","0x07329c5de3d281a32db65d3f66c8360fe0f228bddb79fdc80825e540627c9b2e",["eth:0xD3494713A5cfaD3F5359379DfA074E2Ac8C6Fd65"]]
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
+        "eth:0x85eA9c11cf3D4786027F7FD08F4406b15777e5f8"
      values.superchainConfig:
+        "eth:0x097f99768A0a4a0A81bAbbCB1ea18193bA9D53cC"
      implementationNames.eth:0x93f5d9CD5BE592F1DC602E0CF4A38148b880cd13:
-        "L1CrossDomainMessenger"
      implementationNames.eth:0xD3494713A5cfaD3F5359379DfA074E2Ac8C6Fd65:
+        "L1CrossDomainMessenger"
    }
```

```diff
    contract L1StandardBridge (0x61E44dC0dae6888B5a301887732217d5725B0bFf) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      sourceHashes.1:
-        "0x79abdbd90460fe2ac0535b5cb7b4c45284322b49a0a090d1c509cdaf35dbc87e"
+        "0x1010ff7f40ab4d53e6d9996aefa04423dabe9d0e22fac2d02b330ed3aa2c5740"
      values.$implementation:
-        "eth:0xff7E236F171131cCB7a5149cE4645aBc92E0D8fb"
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
      implementationNames.eth:0xff7E236F171131cCB7a5149cE4645aBc92E0D8fb:
-        "L1StandardBridge"
      implementationNames.eth:0x64B5a5Ed26DCb17370Ff4d33a8D503f0fbD06CfF:
+        "L1StandardBridge"
    }
```

```diff
    contract L1ERC721Bridge (0x6CC3268794c5d3E3d9d52adEfC748B59d536cb22) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      sourceHashes.1:
-        "0x95c690f70db8f82a05347087d704333c180048757ff015d74a5b186c1b6b24ab"
+        "0x482ec6e91304ac39a3fb4505634427bddfddee23b8e93a4f7f995ca5083ae3c3"
      values.$implementation:
-        "eth:0x4f993d43f697Cb4c63D719Bb8Dc762dcbbB11476"
+        "eth:0xAE2AF01232a6c4a4d3012C5eC5b1b35059caF10d"
      values.$pastUpgrades.1:
+        ["2025-07-21T13:55:23.000Z","0xd68af1ee03a69c8215177fe7b44fbee51e722507e51a8351e767e459692f335e",["eth:0x6322C2f2D6a4305Fc033754d486A5A067Ee5F9b1"]]
      values.$pastUpgrades.2:
+        ["2025-07-21T13:55:23.000Z","0xd68af1ee03a69c8215177fe7b44fbee51e722507e51a8351e767e459692f335e",["eth:0xAE2AF01232a6c4a4d3012C5eC5b1b35059caF10d"]]
      values.$pastUpgrades.3:
+        ["2025-07-21T14:52:47.000Z","0x07329c5de3d281a32db65d3f66c8360fe0f228bddb79fdc80825e540627c9b2e",["eth:0xd81f43eDBCAcb4c29a9bA38a13Ee5d79278270cC"]]
      values.$pastUpgrades.4:
+        ["2025-07-21T14:52:47.000Z","0x07329c5de3d281a32db65d3f66c8360fe0f228bddb79fdc80825e540627c9b2e",["eth:0xAE2AF01232a6c4a4d3012C5eC5b1b35059caF10d"]]
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
      implementationNames.eth:0x4f993d43f697Cb4c63D719Bb8Dc762dcbbB11476:
-        "L1ERC721Bridge"
      implementationNames.eth:0xAE2AF01232a6c4a4d3012C5eC5b1b35059caF10d:
+        "L1ERC721Bridge"
    }
```

```diff
    contract OptimismPortal (0x85eA9c11cf3D4786027F7FD08F4406b15777e5f8) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      sourceHashes.1:
-        "0xd7fe53899c31d6d8e73b6724694736dc3c3c4ebc8f4ddbe989fe9d3dba26692d"
+        "0xe35fb7bc0433439337b3eadda3d6fb7991918162f62a337a695e8c7f948cdd35"
      values.$implementation:
-        "eth:0x4Ec5C80Fa12d04DB3A208DD0Fa5C01178FF5a16e"
+        "eth:0x2D778797049FE9259d947D1ED8e5442226dFB589"
      values.$pastUpgrades.1:
+        ["2025-07-21T13:55:23.000Z","0xd68af1ee03a69c8215177fe7b44fbee51e722507e51a8351e767e459692f335e",["eth:0x6322C2f2D6a4305Fc033754d486A5A067Ee5F9b1"]]
      values.$pastUpgrades.2:
+        ["2025-07-21T13:55:23.000Z","0xd68af1ee03a69c8215177fe7b44fbee51e722507e51a8351e767e459692f335e",["eth:0x2D778797049FE9259d947D1ED8e5442226dFB589"]]
      values.$upgradeCount:
-        1
+        3
      values.GUARDIAN:
-        "eth:0x91F4be0C264FAFA1fEd75c4440910Cba2cAd98e8"
+        "eth:0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      values.version:
-        "1.7.2"
+        "2.5.0"
      values.guardian:
+        "eth:0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      values.l2Oracle:
+        "eth:0x1145E7848c8B64c6cab86Fd6D378733385c5C3Ba"
      values.superchainConfig:
+        "eth:0x097f99768A0a4a0A81bAbbCB1ea18193bA9D53cC"
      values.systemConfig:
+        "eth:0x0e4C4CDd01ceCB01070E9Fdfe7600871e4ae996e"
      implementationNames.eth:0x4Ec5C80Fa12d04DB3A208DD0Fa5C01178FF5a16e:
-        "OptimismPortal"
      implementationNames.eth:0x2D778797049FE9259d947D1ED8e5442226dFB589:
+        "OptimismPortal"
    }
```

```diff
    contract LyraMultisig (0x91F4be0C264FAFA1fEd75c4440910Cba2cAd98e8) {
    +++ description: None
      receivedPermissions.0:
+        {"permission":"challenge","from":"eth:0x1145E7848c8B64c6cab86Fd6D378733385c5C3Ba","role":".challenger"}
      receivedPermissions.1:
-        {"permission":"guard","from":"eth:0x85eA9c11cf3D4786027F7FD08F4406b15777e5f8","role":".GUARDIAN"}
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

## Source code changes

```diff
.../L1CrossDomainMessenger.sol                     | 1654 +++++++---------
 .../L1ERC721Bridge/L1ERC721Bridge.sol              |  611 +++---
 .../L1StandardBridge/L1StandardBridge.sol          | 1431 +++++++-------
 .../L2OutputOracle/L2OutputOracle.sol              |  548 ++----
 .../OptimismMintableERC20Factory.sol               |  441 ++++-
 .../OptimismPortal/OptimismPortal.sol              | 1336 +++++--------
 ...0x35d5D43271548c984662d4879FBc8e041Bc1Ff93.sol} |    0
 ...:0xb4899FF43Ae727B1E9CB19AC44660e4A43Fad0b5.sol |  298 +++
 .../ethereum/.flat/SuperchainConfig/Proxy.p.sol    |  200 ++
 .../.flat/SuperchainConfig/SuperchainConfig.sol    |  477 +++++
 .../SystemConfig/SystemConfig.sol                  | 2034 +++++++++++++++++---
 11 files changed, 5544 insertions(+), 3486 deletions(-)
```

Generated with discovered.json: 0x163f86c923ef6e8f26f75995104e304bb5f1e97d

# Diff at Mon, 14 Jul 2025 12:45:20 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@9f4300dad2f3d080cd56fa311d4a848556c74e72 block: 22895939
- current block number: 22895939

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22895939 (main branch discovery), not current.

```diff
    EOA  (0x000000000000000000000000000000000000dEaD) {
    +++ description: None
      address:
-        "0x000000000000000000000000000000000000dEaD"
+        "eth:0x000000000000000000000000000000000000dEaD"
    }
```

```diff
    EOA  (0x03e820562ffd2e0390787caD706EaF1FF98C2608) {
    +++ description: None
      address:
-        "0x03e820562ffd2e0390787caD706EaF1FF98C2608"
+        "eth:0x03e820562ffd2e0390787caD706EaF1FF98C2608"
    }
```

```diff
    contract OptimismMintableERC20Factory (0x08Dea366F26C25a08C8D1C3568ad07d1e587136d) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintableERC20 as this chain's representation of a token on the host chain, or vice-versa.
      address:
-        "0x08Dea366F26C25a08C8D1C3568ad07d1e587136d"
+        "eth:0x08Dea366F26C25a08C8D1C3568ad07d1e587136d"
      values.$admin:
-        "0x35d5D43271548c984662d4879FBc8e041Bc1Ff93"
+        "eth:0x35d5D43271548c984662d4879FBc8e041Bc1Ff93"
      values.$implementation:
-        "0x81C2645D347a67c089169a4Da074aF7788650955"
+        "eth:0x81C2645D347a67c089169a4Da074aF7788650955"
      values.$pastUpgrades.0.2.0:
-        "0x81C2645D347a67c089169a4Da074aF7788650955"
+        "eth:0x81C2645D347a67c089169a4Da074aF7788650955"
      values.BRIDGE:
-        "0x61E44dC0dae6888B5a301887732217d5725B0bFf"
+        "eth:0x61E44dC0dae6888B5a301887732217d5725B0bFf"
      implementationNames.0x08Dea366F26C25a08C8D1C3568ad07d1e587136d:
-        "Proxy"
      implementationNames.0x81C2645D347a67c089169a4Da074aF7788650955:
-        "OptimismMintableERC20Factory"
      implementationNames.eth:0x08Dea366F26C25a08C8D1C3568ad07d1e587136d:
+        "Proxy"
      implementationNames.eth:0x81C2645D347a67c089169a4Da074aF7788650955:
+        "OptimismMintableERC20Factory"
    }
```

```diff
    contract SystemConfig (0x0e4C4CDd01ceCB01070E9Fdfe7600871e4ae996e) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      address:
-        "0x0e4C4CDd01ceCB01070E9Fdfe7600871e4ae996e"
+        "eth:0x0e4C4CDd01ceCB01070E9Fdfe7600871e4ae996e"
      values.$admin:
-        "0x35d5D43271548c984662d4879FBc8e041Bc1Ff93"
+        "eth:0x35d5D43271548c984662d4879FBc8e041Bc1Ff93"
      values.$implementation:
-        "0x81CCFC10CB55B58449A3FEE870D63C4D61941DaC"
+        "eth:0x81CCFC10CB55B58449A3FEE870D63C4D61941DaC"
      values.$pastUpgrades.0.2.0:
-        "0x81CCFC10CB55B58449A3FEE870D63C4D61941DaC"
+        "eth:0x81CCFC10CB55B58449A3FEE870D63C4D61941DaC"
      values.batcherHash:
-        "0x14e4E97bDc195d399Ad8E7FC14451C279FE04c8e"
+        "eth:0x14e4E97bDc195d399Ad8E7FC14451C279FE04c8e"
      values.owner:
-        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
+        "eth:0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      values.sequencerInbox:
-        "0x5f7f7f6DB967F0ef10BdA0678964DBA185d16c50"
+        "eth:0x5f7f7f6DB967F0ef10BdA0678964DBA185d16c50"
      values.unsafeBlockSigner:
-        "0xB71B58FfE538628557433dbBfA08d45ee5a69B44"
+        "eth:0xB71B58FfE538628557433dbBfA08d45ee5a69B44"
      implementationNames.0x0e4C4CDd01ceCB01070E9Fdfe7600871e4ae996e:
-        "Proxy"
      implementationNames.0x81CCFC10CB55B58449A3FEE870D63C4D61941DaC:
-        "SystemConfig"
      implementationNames.eth:0x0e4C4CDd01ceCB01070E9Fdfe7600871e4ae996e:
+        "Proxy"
      implementationNames.eth:0x81CCFC10CB55B58449A3FEE870D63C4D61941DaC:
+        "SystemConfig"
    }
```

```diff
    contract L2OutputOracle (0x1145E7848c8B64c6cab86Fd6D378733385c5C3Ba) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      address:
-        "0x1145E7848c8B64c6cab86Fd6D378733385c5C3Ba"
+        "eth:0x1145E7848c8B64c6cab86Fd6D378733385c5C3Ba"
      values.$admin:
-        "0x35d5D43271548c984662d4879FBc8e041Bc1Ff93"
+        "eth:0x35d5D43271548c984662d4879FBc8e041Bc1Ff93"
      values.$implementation:
-        "0xad206309916Fe08A27221133dde05a8F30f75e29"
+        "eth:0xad206309916Fe08A27221133dde05a8F30f75e29"
      values.$pastUpgrades.0.2.0:
-        "0xad206309916Fe08A27221133dde05a8F30f75e29"
+        "eth:0xad206309916Fe08A27221133dde05a8F30f75e29"
      values.CHALLENGER:
-        "0x91F4be0C264FAFA1fEd75c4440910Cba2cAd98e8"
+        "eth:0x91F4be0C264FAFA1fEd75c4440910Cba2cAd98e8"
      values.PROPOSER:
-        "0x03e820562ffd2e0390787caD706EaF1FF98C2608"
+        "eth:0x03e820562ffd2e0390787caD706EaF1FF98C2608"
      implementationNames.0x1145E7848c8B64c6cab86Fd6D378733385c5C3Ba:
-        "Proxy"
      implementationNames.0xad206309916Fe08A27221133dde05a8F30f75e29:
-        "L2OutputOracle"
      implementationNames.eth:0x1145E7848c8B64c6cab86Fd6D378733385c5C3Ba:
+        "Proxy"
      implementationNames.eth:0xad206309916Fe08A27221133dde05a8F30f75e29:
+        "L2OutputOracle"
    }
```

```diff
    EOA  (0x14e4E97bDc195d399Ad8E7FC14451C279FE04c8e) {
    +++ description: None
      address:
-        "0x14e4E97bDc195d399Ad8E7FC14451C279FE04c8e"
+        "eth:0x14e4E97bDc195d399Ad8E7FC14451C279FE04c8e"
    }
```

```diff
    contract ProxyAdmin (0x35d5D43271548c984662d4879FBc8e041Bc1Ff93) {
    +++ description: None
      address:
-        "0x35d5D43271548c984662d4879FBc8e041Bc1Ff93"
+        "eth:0x35d5D43271548c984662d4879FBc8e041Bc1Ff93"
      values.addressManager:
-        "0xC845F9C4004EB35a8bde8ad89C4760a9c0e65CAB"
+        "eth:0xC845F9C4004EB35a8bde8ad89C4760a9c0e65CAB"
      values.owner:
-        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
+        "eth:0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      implementationNames.0x35d5D43271548c984662d4879FBc8e041Bc1Ff93:
-        "ProxyAdmin"
      implementationNames.eth:0x35d5D43271548c984662d4879FBc8e041Bc1Ff93:
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
    EOA  (0x52E84149daE06CB5C4E92029140Da4faD86CE968) {
    +++ description: None
      address:
-        "0x52E84149daE06CB5C4E92029140Da4faD86CE968"
+        "eth:0x52E84149daE06CB5C4E92029140Da4faD86CE968"
    }
```

```diff
    contract L1CrossDomainMessenger (0x5456f02c08e9A018E42C39b351328E5AA864174A) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      address:
-        "0x5456f02c08e9A018E42C39b351328E5AA864174A"
+        "eth:0x5456f02c08e9A018E42C39b351328E5AA864174A"
      values.$admin:
-        "0x35d5D43271548c984662d4879FBc8e041Bc1Ff93"
+        "eth:0x35d5D43271548c984662d4879FBc8e041Bc1Ff93"
      values.$implementation:
-        "0x93f5d9CD5BE592F1DC602E0CF4A38148b880cd13"
+        "eth:0x93f5d9CD5BE592F1DC602E0CF4A38148b880cd13"
      values.$pastUpgrades.0.2.0:
-        "0x5456f02c08e9A018E42C39b351328E5AA864174A"
+        "eth:0x5456f02c08e9A018E42C39b351328E5AA864174A"
      values.$pastUpgrades.1.2.0:
-        "0x93f5d9CD5BE592F1DC602E0CF4A38148b880cd13"
+        "eth:0x93f5d9CD5BE592F1DC602E0CF4A38148b880cd13"
      values.OTHER_MESSENGER:
-        "0x4200000000000000000000000000000000000007"
+        "eth:0x4200000000000000000000000000000000000007"
      values.PORTAL:
-        "0x85eA9c11cf3D4786027F7FD08F4406b15777e5f8"
+        "eth:0x85eA9c11cf3D4786027F7FD08F4406b15777e5f8"
      values.ResolvedDelegateProxy_addressManager:
-        "0xC845F9C4004EB35a8bde8ad89C4760a9c0e65CAB"
+        "eth:0xC845F9C4004EB35a8bde8ad89C4760a9c0e65CAB"
      implementationNames.0x5456f02c08e9A018E42C39b351328E5AA864174A:
-        "ResolvedDelegateProxy"
      implementationNames.0x93f5d9CD5BE592F1DC602E0CF4A38148b880cd13:
-        "L1CrossDomainMessenger"
      implementationNames.eth:0x5456f02c08e9A018E42C39b351328E5AA864174A:
+        "ResolvedDelegateProxy"
      implementationNames.eth:0x93f5d9CD5BE592F1DC602E0CF4A38148b880cd13:
+        "L1CrossDomainMessenger"
    }
```

```diff
    EOA  (0x5f7f7f6DB967F0ef10BdA0678964DBA185d16c50) {
    +++ description: None
      address:
-        "0x5f7f7f6DB967F0ef10BdA0678964DBA185d16c50"
+        "eth:0x5f7f7f6DB967F0ef10BdA0678964DBA185d16c50"
    }
```

```diff
    contract L1StandardBridge (0x61E44dC0dae6888B5a301887732217d5725B0bFf) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      address:
-        "0x61E44dC0dae6888B5a301887732217d5725B0bFf"
+        "eth:0x61E44dC0dae6888B5a301887732217d5725B0bFf"
      values.$admin:
-        "0x35d5D43271548c984662d4879FBc8e041Bc1Ff93"
+        "eth:0x35d5D43271548c984662d4879FBc8e041Bc1Ff93"
      values.$implementation:
-        "0xff7E236F171131cCB7a5149cE4645aBc92E0D8fb"
+        "eth:0xff7E236F171131cCB7a5149cE4645aBc92E0D8fb"
      values.l2TokenBridge:
-        "0x4200000000000000000000000000000000000010"
+        "eth:0x4200000000000000000000000000000000000010"
      values.messenger:
-        "0x5456f02c08e9A018E42C39b351328E5AA864174A"
+        "eth:0x5456f02c08e9A018E42C39b351328E5AA864174A"
      values.MESSENGER:
-        "0x5456f02c08e9A018E42C39b351328E5AA864174A"
+        "eth:0x5456f02c08e9A018E42C39b351328E5AA864174A"
      values.OTHER_BRIDGE:
-        "0x4200000000000000000000000000000000000010"
+        "eth:0x4200000000000000000000000000000000000010"
      implementationNames.0x61E44dC0dae6888B5a301887732217d5725B0bFf:
-        "L1ChugSplashProxy"
      implementationNames.0xff7E236F171131cCB7a5149cE4645aBc92E0D8fb:
-        "L1StandardBridge"
      implementationNames.eth:0x61E44dC0dae6888B5a301887732217d5725B0bFf:
+        "L1ChugSplashProxy"
      implementationNames.eth:0xff7E236F171131cCB7a5149cE4645aBc92E0D8fb:
+        "L1StandardBridge"
    }
```

```diff
    contract L1ERC721Bridge (0x6CC3268794c5d3E3d9d52adEfC748B59d536cb22) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      address:
-        "0x6CC3268794c5d3E3d9d52adEfC748B59d536cb22"
+        "eth:0x6CC3268794c5d3E3d9d52adEfC748B59d536cb22"
      values.$admin:
-        "0x35d5D43271548c984662d4879FBc8e041Bc1Ff93"
+        "eth:0x35d5D43271548c984662d4879FBc8e041Bc1Ff93"
      values.$implementation:
-        "0x4f993d43f697Cb4c63D719Bb8Dc762dcbbB11476"
+        "eth:0x4f993d43f697Cb4c63D719Bb8Dc762dcbbB11476"
      values.$pastUpgrades.0.2.0:
-        "0x4f993d43f697Cb4c63D719Bb8Dc762dcbbB11476"
+        "eth:0x4f993d43f697Cb4c63D719Bb8Dc762dcbbB11476"
      values.messenger:
-        "0x5456f02c08e9A018E42C39b351328E5AA864174A"
+        "eth:0x5456f02c08e9A018E42C39b351328E5AA864174A"
      values.MESSENGER:
-        "0x5456f02c08e9A018E42C39b351328E5AA864174A"
+        "eth:0x5456f02c08e9A018E42C39b351328E5AA864174A"
      values.OTHER_BRIDGE:
-        "0x4200000000000000000000000000000000000014"
+        "eth:0x4200000000000000000000000000000000000014"
      values.otherBridge:
-        "0x4200000000000000000000000000000000000014"
+        "eth:0x4200000000000000000000000000000000000014"
      implementationNames.0x6CC3268794c5d3E3d9d52adEfC748B59d536cb22:
-        "Proxy"
      implementationNames.0x4f993d43f697Cb4c63D719Bb8Dc762dcbbB11476:
-        "L1ERC721Bridge"
      implementationNames.eth:0x6CC3268794c5d3E3d9d52adEfC748B59d536cb22:
+        "Proxy"
      implementationNames.eth:0x4f993d43f697Cb4c63D719Bb8Dc762dcbbB11476:
+        "L1ERC721Bridge"
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
    EOA  (0x824CACbBeA0377801f72d736CFd5C869dd89b931) {
    +++ description: None
      address:
-        "0x824CACbBeA0377801f72d736CFd5C869dd89b931"
+        "eth:0x824CACbBeA0377801f72d736CFd5C869dd89b931"
    }
```

```diff
    contract OptimismPortal (0x85eA9c11cf3D4786027F7FD08F4406b15777e5f8) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      address:
-        "0x85eA9c11cf3D4786027F7FD08F4406b15777e5f8"
+        "eth:0x85eA9c11cf3D4786027F7FD08F4406b15777e5f8"
      values.$admin:
-        "0x35d5D43271548c984662d4879FBc8e041Bc1Ff93"
+        "eth:0x35d5D43271548c984662d4879FBc8e041Bc1Ff93"
      values.$implementation:
-        "0x4Ec5C80Fa12d04DB3A208DD0Fa5C01178FF5a16e"
+        "eth:0x4Ec5C80Fa12d04DB3A208DD0Fa5C01178FF5a16e"
      values.$pastUpgrades.0.2.0:
-        "0x4Ec5C80Fa12d04DB3A208DD0Fa5C01178FF5a16e"
+        "eth:0x4Ec5C80Fa12d04DB3A208DD0Fa5C01178FF5a16e"
      values.GUARDIAN:
-        "0x91F4be0C264FAFA1fEd75c4440910Cba2cAd98e8"
+        "eth:0x91F4be0C264FAFA1fEd75c4440910Cba2cAd98e8"
      values.L2_ORACLE:
-        "0x1145E7848c8B64c6cab86Fd6D378733385c5C3Ba"
+        "eth:0x1145E7848c8B64c6cab86Fd6D378733385c5C3Ba"
      values.l2Sender:
-        "0x000000000000000000000000000000000000dEaD"
+        "eth:0x000000000000000000000000000000000000dEaD"
      values.SYSTEM_CONFIG:
-        "0x0e4C4CDd01ceCB01070E9Fdfe7600871e4ae996e"
+        "eth:0x0e4C4CDd01ceCB01070E9Fdfe7600871e4ae996e"
      implementationNames.0x85eA9c11cf3D4786027F7FD08F4406b15777e5f8:
-        "Proxy"
      implementationNames.0x4Ec5C80Fa12d04DB3A208DD0Fa5C01178FF5a16e:
-        "OptimismPortal"
      implementationNames.eth:0x85eA9c11cf3D4786027F7FD08F4406b15777e5f8:
+        "Proxy"
      implementationNames.eth:0x4Ec5C80Fa12d04DB3A208DD0Fa5C01178FF5a16e:
+        "OptimismPortal"
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
    contract LyraMultisig (0x91F4be0C264FAFA1fEd75c4440910Cba2cAd98e8) {
    +++ description: None
      address:
-        "0x91F4be0C264FAFA1fEd75c4440910Cba2cAd98e8"
+        "eth:0x91F4be0C264FAFA1fEd75c4440910Cba2cAd98e8"
      values.$implementation:
-        "0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
+        "eth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
      values.$members.0:
-        "0xdb5CF90A8f97C372d5AEC650a5668d4E4bECFC10"
+        "eth:0xdb5CF90A8f97C372d5AEC650a5668d4E4bECFC10"
      values.$members.1:
-        "0x824CACbBeA0377801f72d736CFd5C869dd89b931"
+        "eth:0x824CACbBeA0377801f72d736CFd5C869dd89b931"
      values.$members.2:
-        "0x52E84149daE06CB5C4E92029140Da4faD86CE968"
+        "eth:0x52E84149daE06CB5C4E92029140Da4faD86CE968"
      values.$members.3:
-        "0x3840f487A17A41100DD1Bf0946c34f132a57Fd5f"
+        "eth:0x3840f487A17A41100DD1Bf0946c34f132a57Fd5f"
      values.$members.4:
-        "0xa0C600a6e85bf225958FFAcC70B5FDDF9A059038"
+        "eth:0xa0C600a6e85bf225958FFAcC70B5FDDF9A059038"
      values.$members.5:
-        "0xefCf0c8faFB425997870f845e26fC6cA6EE6dD5C"
+        "eth:0xefCf0c8faFB425997870f845e26fC6cA6EE6dD5C"
      implementationNames.0x91F4be0C264FAFA1fEd75c4440910Cba2cAd98e8:
-        "GnosisSafeProxy"
      implementationNames.0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
-        "GnosisSafe"
      implementationNames.eth:0x91F4be0C264FAFA1fEd75c4440910Cba2cAd98e8:
+        "GnosisSafeProxy"
      implementationNames.eth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
+        "GnosisSafe"
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
    EOA  (0xB71B58FfE538628557433dbBfA08d45ee5a69B44) {
    +++ description: None
      address:
-        "0xB71B58FfE538628557433dbBfA08d45ee5a69B44"
+        "eth:0xB71B58FfE538628557433dbBfA08d45ee5a69B44"
    }
```

```diff
    contract AddressManager (0xC845F9C4004EB35a8bde8ad89C4760a9c0e65CAB) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      address:
-        "0xC845F9C4004EB35a8bde8ad89C4760a9c0e65CAB"
+        "eth:0xC845F9C4004EB35a8bde8ad89C4760a9c0e65CAB"
      values.owner:
-        "0x35d5D43271548c984662d4879FBc8e041Bc1Ff93"
+        "eth:0x35d5D43271548c984662d4879FBc8e041Bc1Ff93"
      implementationNames.0xC845F9C4004EB35a8bde8ad89C4760a9c0e65CAB:
-        "AddressManager"
      implementationNames.eth:0xC845F9C4004EB35a8bde8ad89C4760a9c0e65CAB:
+        "AddressManager"
    }
```

```diff
    EOA  (0xdb5CF90A8f97C372d5AEC650a5668d4E4bECFC10) {
    +++ description: None
      address:
-        "0xdb5CF90A8f97C372d5AEC650a5668d4E4bECFC10"
+        "eth:0xdb5CF90A8f97C372d5AEC650a5668d4E4bECFC10"
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
    contract OptimismMintableERC20Factory (0x08Dea366F26C25a08C8D1C3568ad07d1e587136d)
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintableERC20 as this chain's representation of a token on the host chain, or vice-versa.
```

```diff
+   Status: CREATED
    contract SystemConfig (0x0e4C4CDd01ceCB01070E9Fdfe7600871e4ae996e)
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
```

```diff
+   Status: CREATED
    contract L2OutputOracle (0x1145E7848c8B64c6cab86Fd6D378733385c5C3Ba)
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x35d5D43271548c984662d4879FBc8e041Bc1Ff93)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Conduit Multisig 1 (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1CrossDomainMessenger (0x5456f02c08e9A018E42C39b351328E5AA864174A)
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
```

```diff
+   Status: CREATED
    contract L1StandardBridge (0x61E44dC0dae6888B5a301887732217d5725B0bFf)
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
```

```diff
+   Status: CREATED
    contract L1ERC721Bridge (0x6CC3268794c5d3E3d9d52adEfC748B59d536cb22)
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
```

```diff
+   Status: CREATED
    contract OptimismPortal (0x85eA9c11cf3D4786027F7FD08F4406b15777e5f8)
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
```

```diff
+   Status: CREATED
    contract LyraMultisig (0x91F4be0C264FAFA1fEd75c4440910Cba2cAd98e8)
    +++ description: None
```

```diff
+   Status: CREATED
    contract AddressManager (0xC845F9C4004EB35a8bde8ad89C4760a9c0e65CAB)
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
```

Generated with discovered.json: 0xc684e16163dc583d64cff29f702ec58c860be7c3

# Diff at Mon, 14 Jul 2025 08:02:45 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@0dc82cd5064c9c6dc9fb20e2291a8bb6b2048e27 block: 22895939
- current block number: 22895939

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22895939 (main branch discovery), not current.

```diff
    contract OptimismMintableERC20Factory (0x08Dea366F26C25a08C8D1C3568ad07d1e587136d) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintableERC20 as this chain's representation of a token on the host chain, or vice-versa.
      description:
-        "A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa."
+        "A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintableERC20 as this chain's representation of a token on the host chain, or vice-versa."
    }
```

Generated with discovered.json: 0x9fc369d71b111b17167e6eadb7f6d17f60259eb4

# Diff at Fri, 04 Jul 2025 12:19:08 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f56dc47fe915564d4555300304da4d3bcbc087f block: 22615668
- current block number: 22615668

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22615668 (main branch discovery), not current.

```diff
    EOA  (0x03e820562ffd2e0390787caD706EaF1FF98C2608) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0x1145E7848c8B64c6cab86Fd6D378733385c5C3Ba"
+        "eth:0x1145E7848c8B64c6cab86Fd6D378733385c5C3Ba"
    }
```

```diff
    EOA  (0x14e4E97bDc195d399Ad8E7FC14451C279FE04c8e) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0x0e4C4CDd01ceCB01070E9Fdfe7600871e4ae996e"
+        "eth:0x0e4C4CDd01ceCB01070E9Fdfe7600871e4ae996e"
    }
```

```diff
    contract ProxyAdmin (0x35d5D43271548c984662d4879FBc8e041Bc1Ff93) {
    +++ description: None
      directlyReceivedPermissions.0.from:
-        "ethereum:0xC845F9C4004EB35a8bde8ad89C4760a9c0e65CAB"
+        "eth:0xC845F9C4004EB35a8bde8ad89C4760a9c0e65CAB"
      directlyReceivedPermissions.1.from:
-        "ethereum:0x08Dea366F26C25a08C8D1C3568ad07d1e587136d"
+        "eth:0x08Dea366F26C25a08C8D1C3568ad07d1e587136d"
      directlyReceivedPermissions.2.from:
-        "ethereum:0x0e4C4CDd01ceCB01070E9Fdfe7600871e4ae996e"
+        "eth:0x0e4C4CDd01ceCB01070E9Fdfe7600871e4ae996e"
      directlyReceivedPermissions.3.from:
-        "ethereum:0x1145E7848c8B64c6cab86Fd6D378733385c5C3Ba"
+        "eth:0x1145E7848c8B64c6cab86Fd6D378733385c5C3Ba"
      directlyReceivedPermissions.4.from:
-        "ethereum:0x5456f02c08e9A018E42C39b351328E5AA864174A"
+        "eth:0x5456f02c08e9A018E42C39b351328E5AA864174A"
      directlyReceivedPermissions.5.from:
-        "ethereum:0x61E44dC0dae6888B5a301887732217d5725B0bFf"
+        "eth:0x61E44dC0dae6888B5a301887732217d5725B0bFf"
      directlyReceivedPermissions.6.from:
-        "ethereum:0x6CC3268794c5d3E3d9d52adEfC748B59d536cb22"
+        "eth:0x6CC3268794c5d3E3d9d52adEfC748B59d536cb22"
      directlyReceivedPermissions.7.from:
-        "ethereum:0x85eA9c11cf3D4786027F7FD08F4406b15777e5f8"
+        "eth:0x85eA9c11cf3D4786027F7FD08F4406b15777e5f8"
    }
```

```diff
    contract Conduit Multisig 1 (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0x0e4C4CDd01ceCB01070E9Fdfe7600871e4ae996e"
+        "eth:0x0e4C4CDd01ceCB01070E9Fdfe7600871e4ae996e"
      receivedPermissions.1.via.0.address:
-        "ethereum:0x35d5D43271548c984662d4879FBc8e041Bc1Ff93"
+        "eth:0x35d5D43271548c984662d4879FBc8e041Bc1Ff93"
      receivedPermissions.1.from:
-        "ethereum:0xC845F9C4004EB35a8bde8ad89C4760a9c0e65CAB"
+        "eth:0xC845F9C4004EB35a8bde8ad89C4760a9c0e65CAB"
      receivedPermissions.2.via.0.address:
-        "ethereum:0x35d5D43271548c984662d4879FBc8e041Bc1Ff93"
+        "eth:0x35d5D43271548c984662d4879FBc8e041Bc1Ff93"
      receivedPermissions.2.from:
-        "ethereum:0x08Dea366F26C25a08C8D1C3568ad07d1e587136d"
+        "eth:0x08Dea366F26C25a08C8D1C3568ad07d1e587136d"
      receivedPermissions.3.via.0.address:
-        "ethereum:0x35d5D43271548c984662d4879FBc8e041Bc1Ff93"
+        "eth:0x35d5D43271548c984662d4879FBc8e041Bc1Ff93"
      receivedPermissions.3.from:
-        "ethereum:0x0e4C4CDd01ceCB01070E9Fdfe7600871e4ae996e"
+        "eth:0x0e4C4CDd01ceCB01070E9Fdfe7600871e4ae996e"
      receivedPermissions.4.via.0.address:
-        "ethereum:0x35d5D43271548c984662d4879FBc8e041Bc1Ff93"
+        "eth:0x35d5D43271548c984662d4879FBc8e041Bc1Ff93"
      receivedPermissions.4.from:
-        "ethereum:0x1145E7848c8B64c6cab86Fd6D378733385c5C3Ba"
+        "eth:0x1145E7848c8B64c6cab86Fd6D378733385c5C3Ba"
      receivedPermissions.5.via.0.address:
-        "ethereum:0x35d5D43271548c984662d4879FBc8e041Bc1Ff93"
+        "eth:0x35d5D43271548c984662d4879FBc8e041Bc1Ff93"
      receivedPermissions.5.from:
-        "ethereum:0x5456f02c08e9A018E42C39b351328E5AA864174A"
+        "eth:0x5456f02c08e9A018E42C39b351328E5AA864174A"
      receivedPermissions.6.via.0.address:
-        "ethereum:0x35d5D43271548c984662d4879FBc8e041Bc1Ff93"
+        "eth:0x35d5D43271548c984662d4879FBc8e041Bc1Ff93"
      receivedPermissions.6.from:
-        "ethereum:0x61E44dC0dae6888B5a301887732217d5725B0bFf"
+        "eth:0x61E44dC0dae6888B5a301887732217d5725B0bFf"
      receivedPermissions.7.via.0.address:
-        "ethereum:0x35d5D43271548c984662d4879FBc8e041Bc1Ff93"
+        "eth:0x35d5D43271548c984662d4879FBc8e041Bc1Ff93"
      receivedPermissions.7.from:
-        "ethereum:0x6CC3268794c5d3E3d9d52adEfC748B59d536cb22"
+        "eth:0x6CC3268794c5d3E3d9d52adEfC748B59d536cb22"
      receivedPermissions.8.via.0.address:
-        "ethereum:0x35d5D43271548c984662d4879FBc8e041Bc1Ff93"
+        "eth:0x35d5D43271548c984662d4879FBc8e041Bc1Ff93"
      receivedPermissions.8.from:
-        "ethereum:0x85eA9c11cf3D4786027F7FD08F4406b15777e5f8"
+        "eth:0x85eA9c11cf3D4786027F7FD08F4406b15777e5f8"
      directlyReceivedPermissions.0.from:
-        "ethereum:0x35d5D43271548c984662d4879FBc8e041Bc1Ff93"
+        "eth:0x35d5D43271548c984662d4879FBc8e041Bc1Ff93"
    }
```

```diff
    contract LyraMultisig (0x91F4be0C264FAFA1fEd75c4440910Cba2cAd98e8) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0x1145E7848c8B64c6cab86Fd6D378733385c5C3Ba"
+        "eth:0x1145E7848c8B64c6cab86Fd6D378733385c5C3Ba"
      receivedPermissions.1.from:
-        "ethereum:0x85eA9c11cf3D4786027F7FD08F4406b15777e5f8"
+        "eth:0x85eA9c11cf3D4786027F7FD08F4406b15777e5f8"
    }
```

Generated with discovered.json: 0xf5e8b9eb215c702edffb0728eda1c183e67cecf8

# Diff at Mon, 16 Jun 2025 08:42:14 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@e1208475abce20cea1768d2e4878c03350c1b7c9 block: 22615668
- current block number: 22615668

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22615668 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x35d5D43271548c984662d4879FBc8e041Bc1Ff93) {
    +++ description: None
      directlyReceivedPermissions.7:
+        {"permission":"upgrade","from":"ethereum:0x6CC3268794c5d3E3d9d52adEfC748B59d536cb22","role":"admin"}
      directlyReceivedPermissions.6.from:
-        "ethereum:0x6CC3268794c5d3E3d9d52adEfC748B59d536cb22"
+        "ethereum:0x85eA9c11cf3D4786027F7FD08F4406b15777e5f8"
      directlyReceivedPermissions.5.from:
-        "ethereum:0x85eA9c11cf3D4786027F7FD08F4406b15777e5f8"
+        "ethereum:0x1145E7848c8B64c6cab86Fd6D378733385c5C3Ba"
      directlyReceivedPermissions.4.from:
-        "ethereum:0x1145E7848c8B64c6cab86Fd6D378733385c5C3Ba"
+        "ethereum:0x0e4C4CDd01ceCB01070E9Fdfe7600871e4ae996e"
      directlyReceivedPermissions.3.from:
-        "ethereum:0x0e4C4CDd01ceCB01070E9Fdfe7600871e4ae996e"
+        "ethereum:0x08Dea366F26C25a08C8D1C3568ad07d1e587136d"
      directlyReceivedPermissions.2.from:
-        "ethereum:0x08Dea366F26C25a08C8D1C3568ad07d1e587136d"
+        "ethereum:0x5456f02c08e9A018E42C39b351328E5AA864174A"
    }
```

```diff
    contract Conduit Multisig 1 (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      receivedPermissions.8:
+        {"permission":"upgrade","from":"ethereum:0x6CC3268794c5d3E3d9d52adEfC748B59d536cb22","role":"admin","via":[{"address":"ethereum:0x35d5D43271548c984662d4879FBc8e041Bc1Ff93"}]}
      receivedPermissions.7.from:
-        "ethereum:0x6CC3268794c5d3E3d9d52adEfC748B59d536cb22"
+        "ethereum:0x85eA9c11cf3D4786027F7FD08F4406b15777e5f8"
      receivedPermissions.6.from:
-        "ethereum:0x85eA9c11cf3D4786027F7FD08F4406b15777e5f8"
+        "ethereum:0x1145E7848c8B64c6cab86Fd6D378733385c5C3Ba"
      receivedPermissions.5.from:
-        "ethereum:0x1145E7848c8B64c6cab86Fd6D378733385c5C3Ba"
+        "ethereum:0x0e4C4CDd01ceCB01070E9Fdfe7600871e4ae996e"
      receivedPermissions.4.from:
-        "ethereum:0x0e4C4CDd01ceCB01070E9Fdfe7600871e4ae996e"
+        "ethereum:0x08Dea366F26C25a08C8D1C3568ad07d1e587136d"
      receivedPermissions.3.from:
-        "ethereum:0x08Dea366F26C25a08C8D1C3568ad07d1e587136d"
+        "ethereum:0x5456f02c08e9A018E42C39b351328E5AA864174A"
    }
```

```diff
    contract L1CrossDomainMessenger (0x5456f02c08e9A018E42C39b351328E5AA864174A) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      values.$admin:
+        "0x35d5D43271548c984662d4879FBc8e041Bc1Ff93"
    }
```

Generated with discovered.json: 0x9a3e1ba838a45096a8f2b74bc6df0c40d5e67d0d

# Diff at Mon, 02 Jun 2025 08:00:27 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@2fee84b782a329885c84742cf9cf43143842a2d5 block: 22046064
- current block number: 22615668

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

Generated with discovered.json: 0xe9fca90445df234c6cadbdd17d66b71ca9220d1d

# Diff at Fri, 30 May 2025 07:08:15 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@a4d8c436027d17df0f9b76843cd6deb1888fa381 block: 22046064
- current block number: 22046064

## Description

config: change comment about eip1559 fee val

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22046064 (main branch discovery), not current.

```diff
    contract SystemConfig (0x0e4C4CDd01ceCB01070E9Fdfe7600871e4ae996e) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      fieldMeta.eip1559Denominator:
+        {"description":"volatility param: lower denominator -> quicker fee changes on L2"}
    }
```

Generated with discovered.json: 0x5a1e226ae83fc277cc7da90c19b1926506054831

# Diff at Fri, 23 May 2025 09:40:59 GMT:

- chain: ethereum
- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@69cd181abbc3c830a6caf2f4429b37cae72ffdb8 block: 22046064
- current block number: 22046064

## Description

Introduced .role field on each permission, defaulting to field name on which it was defined (with '.' prefix)

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22046064 (main branch discovery), not current.

```diff
    EOA  (0x03e820562ffd2e0390787caD706EaF1FF98C2608) {
    +++ description: None
      receivedPermissions.0.role:
+        ".PROPOSER"
    }
```

```diff
    EOA  (0x14e4E97bDc195d399Ad8E7FC14451C279FE04c8e) {
    +++ description: None
      receivedPermissions.0.role:
+        ".batcherHash"
    }
```

```diff
    contract ProxyAdmin (0x35d5D43271548c984662d4879FBc8e041Bc1Ff93) {
    +++ description: None
      directlyReceivedPermissions.6.role:
+        "admin"
      directlyReceivedPermissions.5.role:
+        "admin"
      directlyReceivedPermissions.4.role:
+        "admin"
      directlyReceivedPermissions.3.role:
+        "admin"
      directlyReceivedPermissions.2.from:
-        "0x61E44dC0dae6888B5a301887732217d5725B0bFf"
+        "0x1145E7848c8B64c6cab86Fd6D378733385c5C3Ba"
      directlyReceivedPermissions.2.description:
-        "upgrading the bridge implementation can give access to all funds escrowed therein."
      directlyReceivedPermissions.2.role:
+        "admin"
      directlyReceivedPermissions.1.from:
-        "0x1145E7848c8B64c6cab86Fd6D378733385c5C3Ba"
+        "0x61E44dC0dae6888B5a301887732217d5725B0bFf"
      directlyReceivedPermissions.1.description:
+        "upgrading the bridge implementation can give access to all funds escrowed therein."
      directlyReceivedPermissions.1.role:
+        ".$admin"
      directlyReceivedPermissions.0.role:
+        ".owner"
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
-        "interact"
+        "upgrade"
      receivedPermissions.4.from:
-        "0x0e4C4CDd01ceCB01070E9Fdfe7600871e4ae996e"
+        "0x6CC3268794c5d3E3d9d52adEfC748B59d536cb22"
      receivedPermissions.4.description:
-        "it can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system."
      receivedPermissions.4.role:
+        "admin"
      receivedPermissions.4.via:
+        [{"address":"0x35d5D43271548c984662d4879FBc8e041Bc1Ff93"}]
      receivedPermissions.3.from:
-        "0x6CC3268794c5d3E3d9d52adEfC748B59d536cb22"
+        "0x1145E7848c8B64c6cab86Fd6D378733385c5C3Ba"
      receivedPermissions.3.role:
+        "admin"
      receivedPermissions.2.role:
+        ".$admin"
      receivedPermissions.1.permission:
-        "upgrade"
+        "interact"
      receivedPermissions.1.from:
-        "0x1145E7848c8B64c6cab86Fd6D378733385c5C3Ba"
+        "0x0e4C4CDd01ceCB01070E9Fdfe7600871e4ae996e"
      receivedPermissions.1.via:
-        [{"address":"0x35d5D43271548c984662d4879FBc8e041Bc1Ff93"}]
      receivedPermissions.1.description:
+        "it can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system."
      receivedPermissions.1.role:
+        ".owner"
      receivedPermissions.0.role:
+        ".owner"
      directlyReceivedPermissions.0.role:
+        ".owner"
    }
```

```diff
    contract LyraMultisig (0x91F4be0C264FAFA1fEd75c4440910Cba2cAd98e8) {
    +++ description: None
      receivedPermissions.1.role:
+        ".GUARDIAN"
      receivedPermissions.0.role:
+        ".CHALLENGER"
    }
```

Generated with discovered.json: 0xa20e84cdb941e4968fd1523db8ca8ba9241ae7b8

# Diff at Tue, 29 Apr 2025 08:19:06 GMT:

- chain: ethereum
- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@ef7477af00fe0b57a2f7cacf7e958c12494af662 block: 22046064
- current block number: 22046064

## Description

Field .issuedPermissions is removed from the output as no longer needed. Added 'permissionsConfigHash' due to refactoring of the modelling process (into a separate command).

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22046064 (main branch discovery), not current.

```diff
    contract OptimismMintableERC20Factory (0x08Dea366F26C25a08C8D1C3568ad07d1e587136d) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x4a4962275DF8C60a80d3a25faEc5AA7De116A746","via":[{"address":"0x35d5D43271548c984662d4879FBc8e041Bc1Ff93"}]}]
    }
```

```diff
    contract SystemConfig (0x0e4C4CDd01ceCB01070E9Fdfe7600871e4ae996e) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      issuedPermissions:
-        [{"permission":"interact","to":"0x4a4962275DF8C60a80d3a25faEc5AA7De116A746","description":"it can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system.","via":[]},{"permission":"sequence","to":"0x14e4E97bDc195d399Ad8E7FC14451C279FE04c8e","via":[]},{"permission":"upgrade","to":"0x4a4962275DF8C60a80d3a25faEc5AA7De116A746","via":[{"address":"0x35d5D43271548c984662d4879FBc8e041Bc1Ff93"}]}]
    }
```

```diff
    contract L2OutputOracle (0x1145E7848c8B64c6cab86Fd6D378733385c5C3Ba) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      issuedPermissions:
-        [{"permission":"challenge","to":"0x91F4be0C264FAFA1fEd75c4440910Cba2cAd98e8","via":[]},{"permission":"propose","to":"0x03e820562ffd2e0390787caD706EaF1FF98C2608","via":[]},{"permission":"upgrade","to":"0x4a4962275DF8C60a80d3a25faEc5AA7De116A746","via":[{"address":"0x35d5D43271548c984662d4879FBc8e041Bc1Ff93"}]}]
    }
```

```diff
    contract L1StandardBridge (0x61E44dC0dae6888B5a301887732217d5725B0bFf) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x4a4962275DF8C60a80d3a25faEc5AA7De116A746","description":"upgrading the bridge implementation can give access to all funds escrowed therein.","via":[{"address":"0x35d5D43271548c984662d4879FBc8e041Bc1Ff93"}]}]
    }
```

```diff
    contract L1ERC721Bridge (0x6CC3268794c5d3E3d9d52adEfC748B59d536cb22) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x4a4962275DF8C60a80d3a25faEc5AA7De116A746","via":[{"address":"0x35d5D43271548c984662d4879FBc8e041Bc1Ff93"}]}]
    }
```

```diff
    contract OptimismPortal (0x85eA9c11cf3D4786027F7FD08F4406b15777e5f8) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      issuedPermissions:
-        [{"permission":"guard","to":"0x91F4be0C264FAFA1fEd75c4440910Cba2cAd98e8","via":[]},{"permission":"upgrade","to":"0x4a4962275DF8C60a80d3a25faEc5AA7De116A746","via":[{"address":"0x35d5D43271548c984662d4879FBc8e041Bc1Ff93"}]}]
    }
```

```diff
    contract AddressManager (0xC845F9C4004EB35a8bde8ad89C4760a9c0e65CAB) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      issuedPermissions:
-        [{"permission":"interact","to":"0x4a4962275DF8C60a80d3a25faEc5AA7De116A746","description":"set and change address mappings.","via":[{"address":"0x35d5D43271548c984662d4879FBc8e041Bc1Ff93"}]}]
    }
```

Generated with discovered.json: 0x52b14d2746a6b6352c1269697d4ec3f961e82028

# Diff at Thu, 27 Mar 2025 11:14:36 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@8cc2e36080df3a74dfd8475d41c64f46203f5218 block: 22046064
- current block number: 22046064

## Description

Config related: add guardian description details, hide some noisy values, hide AddressManager as spam cat, add proposer / challenger to permissioned opfp chains.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22046064 (main branch discovery), not current.

```diff
    contract AddressManager (0xC845F9C4004EB35a8bde8ad89C4760a9c0e65CAB) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      category:
+        {"name":"Spam","priority":-1}
    }
```

Generated with discovered.json: 0x9b2cf8e6e1bed05b0e00d30791b8ae5871da0e66

# Diff at Tue, 18 Mar 2025 08:13:08 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@4ef7a8dbcec1cd9fec77aae2b73d81347a4ffb13 block: 22046064
- current block number: 22046064

## Description

Config: change Multisig names.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22046064 (main branch discovery), not current.

```diff
    contract Conduit Multisig 1 (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      name:
-        "ConduitMultisig"
+        "Conduit Multisig 1"
    }
```

Generated with discovered.json: 0xc4dcd7751acc81f4f229462e11a0d63396a87bf5

# Diff at Fri, 14 Mar 2025 15:39:59 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@002bac09dea3b1154ecc36736323fb7552478ce4 block: 21637077
- current block number: 22046064

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

Generated with discovered.json: 0x05dbcf4f54fed742aebad97ab8e8e30e6a85ae48

# Diff at Tue, 04 Mar 2025 11:25:57 GMT:

- chain: ethereum
- author: Michał Podsiadły (<michal.podsiadly@l2beat.com>)
- comparing to: main@be38e12d3ff947ca8de40f3a23a9ba1875a54f5a block: 21637077
- current block number: 21637077

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21637077 (main branch discovery), not current.

```diff
    contract SystemConfig (0x0e4C4CDd01ceCB01070E9Fdfe7600871e4ae996e) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      values.opStackDA.isSomeTxsLengthEqualToCelestiaDAExample:
-        true
      values.opStackDA.isUsingCelestia:
+        true
    }
```

Generated with discovered.json: 0x7feaf65efc62c59190483189aa03cc86e9afb4b4

# Diff at Tue, 04 Mar 2025 10:39:23 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@98d260b45fe0d2195ce5e629bd7b200c8706e8ba block: 21637077
- current block number: 21637077

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21637077 (main branch discovery), not current.

```diff
    contract OptimismMintableERC20Factory (0x08Dea366F26C25a08C8D1C3568ad07d1e587136d) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      sinceBlock:
+        18574846
    }
```

```diff
    contract SystemConfig (0x0e4C4CDd01ceCB01070E9Fdfe7600871e4ae996e) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      sinceBlock:
+        18574846
    }
```

```diff
    contract L2OutputOracle (0x1145E7848c8B64c6cab86Fd6D378733385c5C3Ba) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      sinceBlock:
+        18574846
    }
```

```diff
    contract ProxyAdmin (0x35d5D43271548c984662d4879FBc8e041Bc1Ff93) {
    +++ description: None
      sinceBlock:
+        18574846
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
    contract L1CrossDomainMessenger (0x5456f02c08e9A018E42C39b351328E5AA864174A) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      sinceBlock:
+        18574846
    }
```

```diff
    contract L1StandardBridge (0x61E44dC0dae6888B5a301887732217d5725B0bFf) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      sinceBlock:
+        18574846
    }
```

```diff
    contract L1ERC721Bridge (0x6CC3268794c5d3E3d9d52adEfC748B59d536cb22) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      sinceBlock:
+        18574846
    }
```

```diff
    contract OptimismPortal (0x85eA9c11cf3D4786027F7FD08F4406b15777e5f8) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      sinceBlock:
+        18574846
    }
```

```diff
    contract LyraMultisig (0x91F4be0C264FAFA1fEd75c4440910Cba2cAd98e8) {
    +++ description: None
      sinceBlock:
+        18566596
    }
```

```diff
    contract AddressManager (0xC845F9C4004EB35a8bde8ad89C4760a9c0e65CAB) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      sinceBlock:
+        18574845
    }
```

Generated with discovered.json: 0x3d08a72ef09215a44258642da522f362ff88b549

# Diff at Wed, 26 Feb 2025 10:32:53 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@18513668f913fbe57a197f43655b19111df0e627 block: 21637077
- current block number: 21637077

## Description

config related: added categories for all opstack, op stack and polygoncdk stack templates.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21637077 (main branch discovery), not current.

```diff
    contract SystemConfig (0x0e4C4CDd01ceCB01070E9Fdfe7600871e4ae996e) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract L2OutputOracle (0x1145E7848c8B64c6cab86Fd6D378733385c5C3Ba) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract L1CrossDomainMessenger (0x5456f02c08e9A018E42C39b351328E5AA864174A) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      category:
+        {"name":"Canonical Bridges","priority":2}
    }
```

```diff
    contract L1StandardBridge (0x61E44dC0dae6888B5a301887732217d5725B0bFf) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      category:
+        {"name":"Canonical Bridges","priority":2}
    }
```

```diff
    contract L1ERC721Bridge (0x6CC3268794c5d3E3d9d52adEfC748B59d536cb22) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      category:
+        {"name":"Canonical Bridges","priority":2}
    }
```

```diff
    contract OptimismPortal (0x85eA9c11cf3D4786027F7FD08F4406b15777e5f8) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

Generated with discovered.json: 0x4130dab24773f872376eeedcf30f89fc2bffafbe

# Diff at Fri, 21 Feb 2025 14:08:36 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@d219f271711b2cf7a164e3443bead5e4957d13a8 block: 21637077
- current block number: 21637077

## Description

Config related: Change some severities and add templates.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21637077 (main branch discovery), not current.

```diff
    contract L2OutputOracle (0x1145E7848c8B64c6cab86Fd6D378733385c5C3Ba) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      fieldMeta.proposer:
+        {"severity":"HIGH"}
      fieldMeta.challenger:
+        {"severity":"HIGH"}
      fieldMeta.deletedOutputs:
+        {"severity":"HIGH"}
    }
```

Generated with discovered.json: 0xa8008b663b285e55724f07f305c9d3c4e772d9f6

# Diff at Fri, 21 Feb 2025 08:59:40 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1cf9ec35847912163c4b663a633e258a434c0bca block: 21637077
- current block number: 21637077

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21637077 (main branch discovery), not current.

```diff
    contract L1CrossDomainMessenger (0x5456f02c08e9A018E42C39b351328E5AA864174A) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      categories:
-        ["Core"]
    }
```

Generated with discovered.json: 0xf7138ff85dcf2a9dc19c9cf719056837e4cf7e82

# Diff at Mon, 10 Feb 2025 19:04:13 GMT:

- chain: ethereum
- author: Michał Podsiadły (<michal.podsiadly@l2beat.com>)
- comparing to: main@3756adff7c1ac86d8af3374a90a75c1999aae2b3 block: 21637077
- current block number: 21637077

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21637077 (main branch discovery), not current.

```diff
    contract SystemConfig (0x0e4C4CDd01ceCB01070E9Fdfe7600871e4ae996e) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      values.opStackDA.isUsingEigenDA:
+        false
    }
```

Generated with discovered.json: 0x0a643b66f19d0afbf5d78d1a718b3b09a356188b

# Diff at Tue, 04 Feb 2025 12:31:41 GMT:

- chain: ethereum
- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@145553eed7ba44636411ecb25e4099728acd02f9 block: 21637077
- current block number: 21637077

## Description

Rename 'configure' permission to 'interact'

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21637077 (main branch discovery), not current.

```diff
    contract SystemConfig (0x0e4C4CDd01ceCB01070E9Fdfe7600871e4ae996e) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      issuedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract ProxyAdmin (0x35d5D43271548c984662d4879FBc8e041Bc1Ff93) {
    +++ description: None
      directlyReceivedPermissions.0.permission:
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
    contract AddressManager (0xC845F9C4004EB35a8bde8ad89C4760a9c0e65CAB) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      issuedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

Generated with discovered.json: 0xd004f1e00a907fae5ff5d1eb11417fd0fc6ef72c

# Diff at Mon, 20 Jan 2025 11:09:43 GMT:

- chain: ethereum
- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@2c8b4f3d9910bb6371be9b4df87b70856e7d8c64 block: 21637077
- current block number: 21637077

## Description

Rerun on the same block number. Applies fixes to permissions and via field. Renames permission's target to to/from.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21637077 (main branch discovery), not current.

```diff
    contract OptimismMintableERC20Factory (0x08Dea366F26C25a08C8D1C3568ad07d1e587136d) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      issuedPermissions.0.target:
-        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
    }
```

```diff
    contract SystemConfig (0x0e4C4CDd01ceCB01070E9Fdfe7600871e4ae996e) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      issuedPermissions.2.target:
-        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      issuedPermissions.2.via.0.delay:
-        0
      issuedPermissions.2.to:
+        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      issuedPermissions.1.target:
-        "0x14e4E97bDc195d399Ad8E7FC14451C279FE04c8e"
      issuedPermissions.1.to:
+        "0x14e4E97bDc195d399Ad8E7FC14451C279FE04c8e"
      issuedPermissions.0.target:
-        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      issuedPermissions.0.to:
+        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      issuedPermissions.0.description:
+        "it can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system."
    }
```

```diff
    contract L2OutputOracle (0x1145E7848c8B64c6cab86Fd6D378733385c5C3Ba) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      issuedPermissions.2.target:
-        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      issuedPermissions.2.via.0.delay:
-        0
      issuedPermissions.2.to:
+        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      issuedPermissions.1.target:
-        "0x03e820562ffd2e0390787caD706EaF1FF98C2608"
      issuedPermissions.1.to:
+        "0x03e820562ffd2e0390787caD706EaF1FF98C2608"
      issuedPermissions.0.target:
-        "0x91F4be0C264FAFA1fEd75c4440910Cba2cAd98e8"
      issuedPermissions.0.to:
+        "0x91F4be0C264FAFA1fEd75c4440910Cba2cAd98e8"
    }
```

```diff
    contract ProxyAdmin (0x35d5D43271548c984662d4879FBc8e041Bc1Ff93) {
    +++ description: None
      directlyReceivedPermissions.6.target:
-        "0x85eA9c11cf3D4786027F7FD08F4406b15777e5f8"
      directlyReceivedPermissions.6.from:
+        "0x85eA9c11cf3D4786027F7FD08F4406b15777e5f8"
      directlyReceivedPermissions.5.target:
-        "0x6CC3268794c5d3E3d9d52adEfC748B59d536cb22"
      directlyReceivedPermissions.5.from:
+        "0x6CC3268794c5d3E3d9d52adEfC748B59d536cb22"
      directlyReceivedPermissions.4.target:
-        "0x61E44dC0dae6888B5a301887732217d5725B0bFf"
      directlyReceivedPermissions.4.from:
+        "0x61E44dC0dae6888B5a301887732217d5725B0bFf"
      directlyReceivedPermissions.3.target:
-        "0x1145E7848c8B64c6cab86Fd6D378733385c5C3Ba"
      directlyReceivedPermissions.3.from:
+        "0x1145E7848c8B64c6cab86Fd6D378733385c5C3Ba"
      directlyReceivedPermissions.2.target:
-        "0x0e4C4CDd01ceCB01070E9Fdfe7600871e4ae996e"
      directlyReceivedPermissions.2.from:
+        "0x0e4C4CDd01ceCB01070E9Fdfe7600871e4ae996e"
      directlyReceivedPermissions.1.target:
-        "0x08Dea366F26C25a08C8D1C3568ad07d1e587136d"
      directlyReceivedPermissions.1.from:
+        "0x08Dea366F26C25a08C8D1C3568ad07d1e587136d"
      directlyReceivedPermissions.0.target:
-        "0xC845F9C4004EB35a8bde8ad89C4760a9c0e65CAB"
      directlyReceivedPermissions.0.from:
+        "0xC845F9C4004EB35a8bde8ad89C4760a9c0e65CAB"
    }
```

```diff
    contract ConduitMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      receivedPermissions.7.target:
-        "0x85eA9c11cf3D4786027F7FD08F4406b15777e5f8"
      receivedPermissions.7.from:
+        "0x85eA9c11cf3D4786027F7FD08F4406b15777e5f8"
      receivedPermissions.6.target:
-        "0x6CC3268794c5d3E3d9d52adEfC748B59d536cb22"
      receivedPermissions.6.from:
+        "0x6CC3268794c5d3E3d9d52adEfC748B59d536cb22"
      receivedPermissions.5.target:
-        "0x61E44dC0dae6888B5a301887732217d5725B0bFf"
      receivedPermissions.5.from:
+        "0x61E44dC0dae6888B5a301887732217d5725B0bFf"
      receivedPermissions.4.target:
-        "0x1145E7848c8B64c6cab86Fd6D378733385c5C3Ba"
      receivedPermissions.4.from:
+        "0x1145E7848c8B64c6cab86Fd6D378733385c5C3Ba"
      receivedPermissions.3.target:
-        "0x0e4C4CDd01ceCB01070E9Fdfe7600871e4ae996e"
      receivedPermissions.3.from:
+        "0x0e4C4CDd01ceCB01070E9Fdfe7600871e4ae996e"
      receivedPermissions.2.target:
-        "0x08Dea366F26C25a08C8D1C3568ad07d1e587136d"
      receivedPermissions.2.from:
+        "0x08Dea366F26C25a08C8D1C3568ad07d1e587136d"
      receivedPermissions.1.target:
-        "0xC845F9C4004EB35a8bde8ad89C4760a9c0e65CAB"
      receivedPermissions.1.from:
+        "0xC845F9C4004EB35a8bde8ad89C4760a9c0e65CAB"
      receivedPermissions.0.target:
-        "0x0e4C4CDd01ceCB01070E9Fdfe7600871e4ae996e"
      receivedPermissions.0.from:
+        "0x0e4C4CDd01ceCB01070E9Fdfe7600871e4ae996e"
      directlyReceivedPermissions.0.target:
-        "0x35d5D43271548c984662d4879FBc8e041Bc1Ff93"
      directlyReceivedPermissions.0.from:
+        "0x35d5D43271548c984662d4879FBc8e041Bc1Ff93"
    }
```

```diff
    contract L1StandardBridge (0x61E44dC0dae6888B5a301887732217d5725B0bFf) {
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
    contract L1ERC721Bridge (0x6CC3268794c5d3E3d9d52adEfC748B59d536cb22) {
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
    contract OptimismPortal (0x85eA9c11cf3D4786027F7FD08F4406b15777e5f8) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      issuedPermissions.1.target:
-        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      issuedPermissions.1.via.0.delay:
-        0
      issuedPermissions.1.to:
+        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      issuedPermissions.0.target:
-        "0x91F4be0C264FAFA1fEd75c4440910Cba2cAd98e8"
      issuedPermissions.0.to:
+        "0x91F4be0C264FAFA1fEd75c4440910Cba2cAd98e8"
    }
```

```diff
    contract LyraMultisig (0x91F4be0C264FAFA1fEd75c4440910Cba2cAd98e8) {
    +++ description: None
      receivedPermissions.1.target:
-        "0x85eA9c11cf3D4786027F7FD08F4406b15777e5f8"
      receivedPermissions.1.from:
+        "0x85eA9c11cf3D4786027F7FD08F4406b15777e5f8"
      receivedPermissions.0.target:
-        "0x1145E7848c8B64c6cab86Fd6D378733385c5C3Ba"
      receivedPermissions.0.from:
+        "0x1145E7848c8B64c6cab86Fd6D378733385c5C3Ba"
    }
```

```diff
    contract AddressManager (0xC845F9C4004EB35a8bde8ad89C4760a9c0e65CAB) {
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

Generated with discovered.json: 0xa6bae0291b234cfbadf14bc317caea1250802111

# Diff at Thu, 16 Jan 2025 12:35:06 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@b471de2d691e0c6d99ad89859efde79edd3d4dfb block: 21078659
- current block number: 21637077

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

Generated with discovered.json: 0x72e694db0c9827982b7c275528946bd31b70eb2a

# Diff at Wed, 08 Jan 2025 09:02:53 GMT:

- chain: ethereum
- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@deefa974378c2cd6b74f061e1f5a494bbbe1d63a block: 21078659
- current block number: 21078659

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21078659 (main branch discovery), not current.

```diff
    contract L1StandardBridge (0x61E44dC0dae6888B5a301887732217d5725B0bFf) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      description:
-        "The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token."
+        "The main entry point to deposit ERC20 tokens from host chain to this chain."
    }
```

Generated with discovered.json: 0xc309f5f8bddf8942fdd0a4007579b8151461d2fb

# Diff at Fri, 01 Nov 2024 12:09:46 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@cd1f0e71bb08ce16b2084a11b768538e8aa6ba8c block: 21078659
- current block number: 21078659

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21078659 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x35d5D43271548c984662d4879FBc8e041Bc1Ff93) {
    +++ description: None
      directlyReceivedPermissions.4.description:
-        "upgrading bridge implementation allows to access all funds and change every system component."
+        "upgrading the bridge implementation can give access to all funds escrowed therein."
    }
```

```diff
    contract ConduitMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      receivedPermissions.5.description:
-        "upgrading bridge implementation allows to access all funds and change every system component."
+        "upgrading the bridge implementation can give access to all funds escrowed therein."
    }
```

```diff
    contract L1StandardBridge (0x61E44dC0dae6888B5a301887732217d5725B0bFf) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token.
      issuedPermissions.0.via.0.description:
-        "upgrading bridge implementation allows to access all funds and change every system component."
+        "upgrading the bridge implementation can give access to all funds escrowed therein."
    }
```

Generated with discovered.json: 0x92de6131de98dc2e9fe86dd9c21c7e3fee947d07

# Diff at Wed, 30 Oct 2024 13:09:14 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@0a8a53530022c6c5edd257c3682a3e7f80d0c550 block: 20920202
- current block number: 21078659

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

Generated with discovered.json: 0x3006aa8c5d1ecc28f5dc93d167798775ac8b372c

# Diff at Tue, 29 Oct 2024 13:10:42 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@7b3fc9dc9074e1d423b48522c3f0273c86aab54a block: 20920202
- current block number: 20920202

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20920202 (main branch discovery), not current.

```diff
    contract L2OutputOracle (0x1145E7848c8B64c6cab86Fd6D378733385c5C3Ba) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      fieldMeta:
+        {"FINALIZATION_PERIOD_SECONDS":{"description":"Challenge period (Number of seconds until a state root is finalized)."}}
    }
```

Generated with discovered.json: 0x396a8d8c8afdee0de75cab211d1e15f3670a943b

# Diff at Mon, 21 Oct 2024 12:45:42 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@e660599f23a07618fe949a07be1f516ce44f1914 block: 20920202
- current block number: 20920202

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20920202 (main branch discovery), not current.

```diff
    contract OptimismMintableERC20Factory (0x08Dea366F26C25a08C8D1C3568ad07d1e587136d) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      descriptions:
-        ["A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa."]
      description:
+        "A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa."
    }
```

```diff
    contract SystemConfig (0x0e4C4CDd01ceCB01070E9Fdfe7600871e4ae996e) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      descriptions:
-        ["Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address."]
      description:
+        "Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address."
    }
```

```diff
    contract L2OutputOracle (0x1145E7848c8B64c6cab86Fd6D378733385c5C3Ba) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      descriptions:
-        ["Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots."]
      description:
+        "Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots."
    }
```

```diff
    contract L1CrossDomainMessenger (0x5456f02c08e9A018E42C39b351328E5AA864174A) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      descriptions:
-        ["Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function."]
      description:
+        "Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function."
    }
```

```diff
    contract L1StandardBridge (0x61E44dC0dae6888B5a301887732217d5725B0bFf) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token.
      descriptions:
-        ["The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token."]
      description:
+        "The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token."
    }
```

```diff
    contract L1ERC721Bridge (0x6CC3268794c5d3E3d9d52adEfC748B59d536cb22) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      descriptions:
-        ["Used to bridge ERC-721 tokens from host chain to this chain."]
      description:
+        "Used to bridge ERC-721 tokens from host chain to this chain."
    }
```

```diff
    contract OptimismPortal (0x85eA9c11cf3D4786027F7FD08F4406b15777e5f8) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      descriptions:
-        ["The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals."]
      description:
+        "The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals."
    }
```

```diff
    contract AddressManager (0xC845F9C4004EB35a8bde8ad89C4760a9c0e65CAB) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      descriptions:
-        ["Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts."]
      description:
+        "Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts."
    }
```

Generated with discovered.json: 0xd3066dfc6fdb35ec634310c7062e39e6e8af9d55

# Diff at Mon, 21 Oct 2024 11:07:25 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@8895d33866f5665c4c710f4ddaa32bfa63cc3c78 block: 20920202
- current block number: 20920202

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20920202 (main branch discovery), not current.

```diff
    contract OptimismMintableERC20Factory (0x08Dea366F26C25a08C8D1C3568ad07d1e587136d) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      values.$pastUpgrades.0.2:
+        ["0x81C2645D347a67c089169a4Da074aF7788650955"]
      values.$pastUpgrades.0.1:
-        ["0x81C2645D347a67c089169a4Da074aF7788650955"]
+        "0x862edb6ab42445b7c63a416197cc4b660bc10eef56a6a1698de23a06e18ccd12"
    }
```

```diff
    contract SystemConfig (0x0e4C4CDd01ceCB01070E9Fdfe7600871e4ae996e) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      values.$pastUpgrades.0.2:
+        ["0x81CCFC10CB55B58449A3FEE870D63C4D61941DaC"]
      values.$pastUpgrades.0.1:
-        ["0x81CCFC10CB55B58449A3FEE870D63C4D61941DaC"]
+        "0xc79cfab290a401347ecdb45319667db2187d95846fbe0afa45ebe533b9e58309"
    }
```

```diff
    contract L2OutputOracle (0x1145E7848c8B64c6cab86Fd6D378733385c5C3Ba) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      values.$pastUpgrades.0.2:
+        ["0xad206309916Fe08A27221133dde05a8F30f75e29"]
      values.$pastUpgrades.0.1:
-        ["0xad206309916Fe08A27221133dde05a8F30f75e29"]
+        "0xeae3cb376d1d8a00946fd6477d78dff305b53d0d1eabd263642c1e16e49b6348"
    }
```

```diff
    contract L1CrossDomainMessenger (0x5456f02c08e9A018E42C39b351328E5AA864174A) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      values.$pastUpgrades.1.2:
+        ["0x93f5d9CD5BE592F1DC602E0CF4A38148b880cd13"]
      values.$pastUpgrades.1.1:
-        ["0x93f5d9CD5BE592F1DC602E0CF4A38148b880cd13"]
+        "0xc2ca4d4e11fa334c6d9108f324117ef7600256c1f8041a266033b225903267b9"
      values.$pastUpgrades.0.2:
+        ["0x5456f02c08e9A018E42C39b351328E5AA864174A"]
      values.$pastUpgrades.0.1:
-        ["0x5456f02c08e9A018E42C39b351328E5AA864174A"]
+        "0x96cbc2591b826790a8ef721a895889cf4cef735a8b41577acddf1fc3889b3655"
    }
```

```diff
    contract L1ERC721Bridge (0x6CC3268794c5d3E3d9d52adEfC748B59d536cb22) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      values.$pastUpgrades.0.2:
+        ["0x4f993d43f697Cb4c63D719Bb8Dc762dcbbB11476"]
      values.$pastUpgrades.0.1:
-        ["0x4f993d43f697Cb4c63D719Bb8Dc762dcbbB11476"]
+        "0x0b7b3fc23c744f9ba1d9be819afbf1ec831949217f72fcea2fb9ccf0b073e62f"
    }
```

```diff
    contract OptimismPortal (0x85eA9c11cf3D4786027F7FD08F4406b15777e5f8) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      values.$pastUpgrades.0.2:
+        ["0x4Ec5C80Fa12d04DB3A208DD0Fa5C01178FF5a16e"]
      values.$pastUpgrades.0.1:
-        ["0x4Ec5C80Fa12d04DB3A208DD0Fa5C01178FF5a16e"]
+        "0xa2425b071316f9bcd7b56f603bfb90ebb94833ab24bfdb0318278ce69615d86b"
    }
```

Generated with discovered.json: 0x73c83e7aabe62f9ede83a3992d7c6842862fe955

# Diff at Wed, 16 Oct 2024 11:37:33 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@a3d139b799cc0b28e5e912febb17464d4e5aef5d block: 20920202
- current block number: 20920202

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20920202 (main branch discovery), not current.

```diff
    contract SystemConfig (0x0e4C4CDd01ceCB01070E9Fdfe7600871e4ae996e) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      issuedPermissions.2:
+        {"permission":"upgrade","target":"0x4a4962275DF8C60a80d3a25faEc5AA7De116A746","via":[{"address":"0x35d5D43271548c984662d4879FBc8e041Bc1Ff93","delay":0}]}
      issuedPermissions.1.permission:
-        "upgrade"
+        "sequence"
      issuedPermissions.1.target:
-        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
+        "0x14e4E97bDc195d399Ad8E7FC14451C279FE04c8e"
      issuedPermissions.1.via.0:
-        {"address":"0x35d5D43271548c984662d4879FBc8e041Bc1Ff93","delay":0}
    }
```

```diff
    contract L2OutputOracle (0x1145E7848c8B64c6cab86Fd6D378733385c5C3Ba) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      issuedPermissions.2:
+        {"permission":"upgrade","target":"0x4a4962275DF8C60a80d3a25faEc5AA7De116A746","via":[{"address":"0x35d5D43271548c984662d4879FBc8e041Bc1Ff93","delay":0}]}
      issuedPermissions.1:
+        {"permission":"propose","target":"0x03e820562ffd2e0390787caD706EaF1FF98C2608","via":[]}
      issuedPermissions.0.permission:
-        "upgrade"
+        "challenge"
      issuedPermissions.0.target:
-        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
+        "0x91F4be0C264FAFA1fEd75c4440910Cba2cAd98e8"
      issuedPermissions.0.via.0:
-        {"address":"0x35d5D43271548c984662d4879FBc8e041Bc1Ff93","delay":0}
    }
```

```diff
    contract OptimismPortal (0x85eA9c11cf3D4786027F7FD08F4406b15777e5f8) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      issuedPermissions.1:
+        {"permission":"upgrade","target":"0x4a4962275DF8C60a80d3a25faEc5AA7De116A746","via":[{"address":"0x35d5D43271548c984662d4879FBc8e041Bc1Ff93","delay":0}]}
      issuedPermissions.0.permission:
-        "upgrade"
+        "guard"
      issuedPermissions.0.target:
-        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
+        "0x91F4be0C264FAFA1fEd75c4440910Cba2cAd98e8"
      issuedPermissions.0.via.0:
-        {"address":"0x35d5D43271548c984662d4879FBc8e041Bc1Ff93","delay":0}
    }
```

```diff
    contract LyraMultisig (0x91F4be0C264FAFA1fEd75c4440910Cba2cAd98e8) {
    +++ description: None
      roles:
-        ["Challenger","Guardian"]
      receivedPermissions:
+        [{"permission":"challenge","target":"0x1145E7848c8B64c6cab86Fd6D378733385c5C3Ba"},{"permission":"guard","target":"0x85eA9c11cf3D4786027F7FD08F4406b15777e5f8"}]
    }
```

Generated with discovered.json: 0x808c87c1e37dcaef6e40e45747254ddaca7a840b

# Diff at Mon, 14 Oct 2024 10:52:42 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1afc77ff111ceb0970e7d09efcc7b2f376b0c281 block: 20920202
- current block number: 20920202

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20920202 (main branch discovery), not current.

```diff
    contract OptimismMintableERC20Factory (0x08Dea366F26C25a08C8D1C3568ad07d1e587136d) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      sourceHashes:
+        ["0x2cdcfef705094aaac53d507bad64d27b48ea5a9c11a7fadffacc192aab7a823f","0xc8aea1ad75944084aeb3dc8b5c63135af405055da6baaffde3ed51e92c91e2eb"]
    }
```

```diff
    contract SystemConfig (0x0e4C4CDd01ceCB01070E9Fdfe7600871e4ae996e) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      sourceHashes:
+        ["0x2cdcfef705094aaac53d507bad64d27b48ea5a9c11a7fadffacc192aab7a823f","0x29908eb7685943ff431cd384af851ce36a30997bbad880f9b4385bfc3abb86a2"]
    }
```

```diff
    contract L2OutputOracle (0x1145E7848c8B64c6cab86Fd6D378733385c5C3Ba) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      sourceHashes:
+        ["0x2cdcfef705094aaac53d507bad64d27b48ea5a9c11a7fadffacc192aab7a823f","0xcca8986d0789aa489ba57cd234e886bd92cb5a0d477e1f5ae5e6e030e15fb183"]
    }
```

```diff
    contract ProxyAdmin (0x35d5D43271548c984662d4879FBc8e041Bc1Ff93) {
    +++ description: None
      template:
-        "opstack/ProxyAdmin"
+        "global/ProxyAdmin"
      sourceHashes:
+        ["0x96d2f0fa1bd83ebd61ba6a2351c64c7fda7aa580b11ea67bb6bf4338e5c28512"]
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
    contract L1CrossDomainMessenger (0x5456f02c08e9A018E42C39b351328E5AA864174A) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      sourceHashes:
+        ["0x20a2eb4d3677fc8a15e944f7b1843acd01b2e92acdc4c7a7f7a35b07b891149b","0xebfb36a18bcaa176678925149b43fdc5f9f943d98a6405ae1cbc26f4c168ff88"]
    }
```

```diff
    contract L1StandardBridge (0x61E44dC0dae6888B5a301887732217d5725B0bFf) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token.
      sourceHashes:
+        ["0xbfb58685ff2f2f07eaa01a3c4e3c33c97686bfd3ae7c50c49f9da6ef5098cb31","0x79abdbd90460fe2ac0535b5cb7b4c45284322b49a0a090d1c509cdaf35dbc87e"]
    }
```

```diff
    contract L1ERC721Bridge (0x6CC3268794c5d3E3d9d52adEfC748B59d536cb22) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      sourceHashes:
+        ["0x2cdcfef705094aaac53d507bad64d27b48ea5a9c11a7fadffacc192aab7a823f","0x95c690f70db8f82a05347087d704333c180048757ff015d74a5b186c1b6b24ab"]
    }
```

```diff
    contract OptimismPortal (0x85eA9c11cf3D4786027F7FD08F4406b15777e5f8) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      sourceHashes:
+        ["0x2cdcfef705094aaac53d507bad64d27b48ea5a9c11a7fadffacc192aab7a823f","0xd7fe53899c31d6d8e73b6724694736dc3c3c4ebc8f4ddbe989fe9d3dba26692d"]
    }
```

```diff
    contract LyraMultisig (0x91F4be0C264FAFA1fEd75c4440910Cba2cAd98e8) {
    +++ description: None
      sourceHashes:
+        ["0x81a7349eebb98ac33b0bc6842e3cb258034a8f2a4ba004570bb8e2e25947f9ff","0xd42bbf9f7dcd3720a7fc6bdc6edfdfae8800a37d6dd4decfa0ef6ca4a2e88940"]
    }
```

```diff
    contract AddressManager (0xC845F9C4004EB35a8bde8ad89C4760a9c0e65CAB) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      sourceHashes:
+        ["0xdc86a850f11dc2b5c0472a05d0e3c14f239baf2c3b1ab19631591b0827985380"]
    }
```

Generated with discovered.json: 0x39d3beda0e8d031372a85a31e1afca44d475b434

# Diff at Wed, 09 Oct 2024 13:09:43 GMT:

- chain: ethereum
- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@37683e2b3d0587372f886eef49e921277810c8bf block: 20920202
- current block number: 20920202

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20920202 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x35d5D43271548c984662d4879FBc8e041Bc1Ff93) {
    +++ description: None
      directlyReceivedPermissions.0.description:
+        "set and change address mappings."
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
    contract AddressManager (0xC845F9C4004EB35a8bde8ad89C4760a9c0e65CAB) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      issuedPermissions.0.via.0.description:
+        "set and change address mappings."
      descriptions:
+        ["Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts."]
    }
```

Generated with discovered.json: 0x182b6509349018221a7f288bfd6e35ad2819a770

# Diff at Tue, 08 Oct 2024 16:26:07 GMT:

- chain: ethereum
- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@bca55174129419533cd4173605c170ea99ac6f98 block: 20775910
- current block number: 20920202

## Description

Move to discovery driven data.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20775910 (main branch discovery), not current.

```diff
    contract LyraMultisig (0x91F4be0C264FAFA1fEd75c4440910Cba2cAd98e8) {
    +++ description: None
      name:
-        "ChallengerMultisig"
+        "LyraMultisig"
    }
```

Generated with discovered.json: 0x5a6b28eb95f5a78bd06baa8065b6a8a7233fe30c

# Diff at Tue, 01 Oct 2024 10:52:21 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bd754dc73c66120164006054f8d25c5fae9cd910 block: 20775910
- current block number: 20775910

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20775910 (main branch discovery), not current.

```diff
    contract OptimismMintableERC20Factory (0x08Dea366F26C25a08C8D1C3568ad07d1e587136d) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      values.$pastUpgrades:
+        [["2023-11-15T04:14:35.000Z",["0x81C2645D347a67c089169a4Da074aF7788650955"]]]
    }
```

```diff
    contract SystemConfig (0x0e4C4CDd01ceCB01070E9Fdfe7600871e4ae996e) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      values.$pastUpgrades:
+        [["2023-11-15T04:14:35.000Z",["0x81CCFC10CB55B58449A3FEE870D63C4D61941DaC"]]]
    }
```

```diff
    contract L2OutputOracle (0x1145E7848c8B64c6cab86Fd6D378733385c5C3Ba) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      values.$pastUpgrades:
+        [["2023-11-15T04:14:35.000Z",["0xad206309916Fe08A27221133dde05a8F30f75e29"]]]
    }
```

```diff
    contract L1CrossDomainMessenger (0x5456f02c08e9A018E42C39b351328E5AA864174A) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      values.$pastUpgrades:
+        [["2023-11-15T04:14:35.000Z",["0x5456f02c08e9A018E42C39b351328E5AA864174A"]],["2023-11-15T04:14:35.000Z",["0x93f5d9CD5BE592F1DC602E0CF4A38148b880cd13"]]]
      values.$upgradeCount:
+        2
    }
```

```diff
    contract L1StandardBridge (0x61E44dC0dae6888B5a301887732217d5725B0bFf) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token.
      values.$pastUpgrades:
+        []
    }
```

```diff
    contract L1ERC721Bridge (0x6CC3268794c5d3E3d9d52adEfC748B59d536cb22) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      values.$pastUpgrades:
+        [["2023-11-15T04:14:35.000Z",["0x4f993d43f697Cb4c63D719Bb8Dc762dcbbB11476"]]]
    }
```

```diff
    contract OptimismPortal (0x85eA9c11cf3D4786027F7FD08F4406b15777e5f8) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      values.$pastUpgrades:
+        [["2023-11-15T04:14:35.000Z",["0x4Ec5C80Fa12d04DB3A208DD0Fa5C01178FF5a16e"]]]
    }
```

Generated with discovered.json: 0x043b3de45c6f2ef3da3fce6a7eae5c24c963b180

# Diff at Wed, 18 Sep 2024 11:33:33 GMT:

- chain: ethereum
- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@eb09774f0f9d9322f2117dfdfda7d4bb095f6c52 block: 20331900
- current block number: 20775910

## Description

Shape related.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20331900 (main branch discovery), not current.

```diff
    contract OptimismMintableERC20Factory (0x08Dea366F26C25a08C8D1C3568ad07d1e587136d) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      template:
+        "opstack/OptimismMintableERC20Factory"
      descriptions:
+        ["A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa."]
    }
```

```diff
    contract SystemConfig (0x0e4C4CDd01ceCB01070E9Fdfe7600871e4ae996e) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      issuedPermissions.1:
+        {"permission":"upgrade","target":"0x4a4962275DF8C60a80d3a25faEc5AA7De116A746","via":[{"address":"0x35d5D43271548c984662d4879FBc8e041Bc1Ff93","delay":0}]}
      issuedPermissions.0.permission:
-        "upgrade"
+        "configure"
      issuedPermissions.0.via.0:
-        {"address":"0x35d5D43271548c984662d4879FBc8e041Bc1Ff93","delay":0}
      template:
+        "opstack/SystemConfig"
      descriptions:
+        ["Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address."]
      fieldMeta:
+        {"gasLimit":{"severity":"LOW","description":"Gas limit for blocks on L2."}}
    }
```

```diff
    contract L2OutputOracle (0x1145E7848c8B64c6cab86Fd6D378733385c5C3Ba) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      template:
+        "opstack/L2OutputOracle"
      descriptions:
+        ["Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots."]
    }
```

```diff
    contract ProxyAdmin (0x35d5D43271548c984662d4879FBc8e041Bc1Ff93) {
    +++ description: None
      directlyReceivedPermissions.4.description:
+        "upgrading bridge implementation allows to access all funds and change every system component."
    }
```

```diff
    contract ConduitMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      receivedPermissions.7:
+        {"permission":"upgrade","target":"0x85eA9c11cf3D4786027F7FD08F4406b15777e5f8","via":[{"address":"0x35d5D43271548c984662d4879FBc8e041Bc1Ff93"}]}
      receivedPermissions.6.target:
-        "0x85eA9c11cf3D4786027F7FD08F4406b15777e5f8"
+        "0x6CC3268794c5d3E3d9d52adEfC748B59d536cb22"
      receivedPermissions.5.target:
-        "0x6CC3268794c5d3E3d9d52adEfC748B59d536cb22"
+        "0x61E44dC0dae6888B5a301887732217d5725B0bFf"
      receivedPermissions.5.description:
+        "upgrading bridge implementation allows to access all funds and change every system component."
      receivedPermissions.4.target:
-        "0x61E44dC0dae6888B5a301887732217d5725B0bFf"
+        "0x1145E7848c8B64c6cab86Fd6D378733385c5C3Ba"
      receivedPermissions.3.target:
-        "0x1145E7848c8B64c6cab86Fd6D378733385c5C3Ba"
+        "0x0e4C4CDd01ceCB01070E9Fdfe7600871e4ae996e"
      receivedPermissions.2.target:
-        "0x0e4C4CDd01ceCB01070E9Fdfe7600871e4ae996e"
+        "0x08Dea366F26C25a08C8D1C3568ad07d1e587136d"
      receivedPermissions.1.permission:
-        "upgrade"
+        "configure"
      receivedPermissions.1.target:
-        "0x08Dea366F26C25a08C8D1C3568ad07d1e587136d"
+        "0xC845F9C4004EB35a8bde8ad89C4760a9c0e65CAB"
      receivedPermissions.0.target:
-        "0xC845F9C4004EB35a8bde8ad89C4760a9c0e65CAB"
+        "0x0e4C4CDd01ceCB01070E9Fdfe7600871e4ae996e"
      receivedPermissions.0.via:
-        [{"address":"0x35d5D43271548c984662d4879FBc8e041Bc1Ff93"}]
      receivedPermissions.0.description:
+        "it can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system."
    }
```

```diff
    contract L1CrossDomainMessenger (0x5456f02c08e9A018E42C39b351328E5AA864174A) {
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
    contract L1StandardBridge (0x61E44dC0dae6888B5a301887732217d5725B0bFf) {
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
    contract L1ERC721Bridge (0x6CC3268794c5d3E3d9d52adEfC748B59d536cb22) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      template:
+        "opstack/L1ERC721Bridge"
      descriptions:
+        ["Used to bridge ERC-721 tokens from host chain to this chain."]
    }
```

```diff
    contract OptimismPortal (0x85eA9c11cf3D4786027F7FD08F4406b15777e5f8) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      template:
+        "opstack/OptimismPortal"
      descriptions:
+        ["The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals."]
    }
```

```diff
    contract ChallengerMultisig (0x91F4be0C264FAFA1fEd75c4440910Cba2cAd98e8) {
    +++ description: None
      roles:
+        ["Challenger","Guardian"]
    }
```

Generated with discovered.json: 0xc968684a22b006d35a4830f8209c2feef1e839f8

# Diff at Sun, 08 Sep 2024 17:18:23 GMT:

- chain: ethereum
- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@fd881462cca0d7ef4519f907f3c6cfd5fe1cde8f block: 20331900
- current block number: 20331900

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20331900 (main branch discovery), not current.

```diff
    contract OptimismMintableERC20Factory (0x08Dea366F26C25a08C8D1C3568ad07d1e587136d) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x35d5D43271548c984662d4879FBc8e041Bc1Ff93"
+        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      issuedPermissions.0.via.0:
+        {"address":"0x35d5D43271548c984662d4879FBc8e041Bc1Ff93","delay":0}
    }
```

```diff
    contract SystemConfig (0x0e4C4CDd01ceCB01070E9Fdfe7600871e4ae996e) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x35d5D43271548c984662d4879FBc8e041Bc1Ff93"
+        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      issuedPermissions.0.via.0:
+        {"address":"0x35d5D43271548c984662d4879FBc8e041Bc1Ff93","delay":0}
    }
```

```diff
    contract L2OutputOracle (0x1145E7848c8B64c6cab86Fd6D378733385c5C3Ba) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x35d5D43271548c984662d4879FBc8e041Bc1Ff93"
+        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      issuedPermissions.0.via.0:
+        {"address":"0x35d5D43271548c984662d4879FBc8e041Bc1Ff93","delay":0}
    }
```

```diff
    contract ProxyAdmin (0x35d5D43271548c984662d4879FBc8e041Bc1Ff93) {
    +++ description: None
      issuedPermissions:
-        [{"permission":"configure","target":"0x4a4962275DF8C60a80d3a25faEc5AA7De116A746","via":[]}]
      receivedPermissions:
-        [{"permission":"configure","target":"0xC845F9C4004EB35a8bde8ad89C4760a9c0e65CAB"},{"permission":"upgrade","target":"0x08Dea366F26C25a08C8D1C3568ad07d1e587136d"},{"permission":"upgrade","target":"0x0e4C4CDd01ceCB01070E9Fdfe7600871e4ae996e"},{"permission":"upgrade","target":"0x1145E7848c8B64c6cab86Fd6D378733385c5C3Ba"},{"permission":"upgrade","target":"0x61E44dC0dae6888B5a301887732217d5725B0bFf"},{"permission":"upgrade","target":"0x6CC3268794c5d3E3d9d52adEfC748B59d536cb22"},{"permission":"upgrade","target":"0x85eA9c11cf3D4786027F7FD08F4406b15777e5f8"}]
      directlyReceivedPermissions:
+        [{"permission":"configure","target":"0xC845F9C4004EB35a8bde8ad89C4760a9c0e65CAB"},{"permission":"upgrade","target":"0x08Dea366F26C25a08C8D1C3568ad07d1e587136d"},{"permission":"upgrade","target":"0x0e4C4CDd01ceCB01070E9Fdfe7600871e4ae996e"},{"permission":"upgrade","target":"0x1145E7848c8B64c6cab86Fd6D378733385c5C3Ba"},{"permission":"upgrade","target":"0x61E44dC0dae6888B5a301887732217d5725B0bFf"},{"permission":"upgrade","target":"0x6CC3268794c5d3E3d9d52adEfC748B59d536cb22"},{"permission":"upgrade","target":"0x85eA9c11cf3D4786027F7FD08F4406b15777e5f8"}]
    }
```

```diff
    contract ConduitMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      descriptions:
-        ["It can act on behalf of 0x35d5D43271548c984662d4879FBc8e041Bc1Ff93, inheriting its permissions."]
      receivedPermissions.6:
+        {"permission":"upgrade","target":"0x85eA9c11cf3D4786027F7FD08F4406b15777e5f8","via":[{"address":"0x35d5D43271548c984662d4879FBc8e041Bc1Ff93"}]}
      receivedPermissions.5:
+        {"permission":"upgrade","target":"0x6CC3268794c5d3E3d9d52adEfC748B59d536cb22","via":[{"address":"0x35d5D43271548c984662d4879FBc8e041Bc1Ff93"}]}
      receivedPermissions.4:
+        {"permission":"upgrade","target":"0x61E44dC0dae6888B5a301887732217d5725B0bFf","via":[{"address":"0x35d5D43271548c984662d4879FBc8e041Bc1Ff93"}]}
      receivedPermissions.3:
+        {"permission":"upgrade","target":"0x1145E7848c8B64c6cab86Fd6D378733385c5C3Ba","via":[{"address":"0x35d5D43271548c984662d4879FBc8e041Bc1Ff93"}]}
      receivedPermissions.2:
+        {"permission":"upgrade","target":"0x0e4C4CDd01ceCB01070E9Fdfe7600871e4ae996e","via":[{"address":"0x35d5D43271548c984662d4879FBc8e041Bc1Ff93"}]}
      receivedPermissions.1:
+        {"permission":"upgrade","target":"0x08Dea366F26C25a08C8D1C3568ad07d1e587136d","via":[{"address":"0x35d5D43271548c984662d4879FBc8e041Bc1Ff93"}]}
      receivedPermissions.0.target:
-        "0x35d5D43271548c984662d4879FBc8e041Bc1Ff93"
+        "0xC845F9C4004EB35a8bde8ad89C4760a9c0e65CAB"
      receivedPermissions.0.via:
+        [{"address":"0x35d5D43271548c984662d4879FBc8e041Bc1Ff93"}]
      directlyReceivedPermissions:
+        [{"permission":"act","target":"0x35d5D43271548c984662d4879FBc8e041Bc1Ff93"}]
    }
```

```diff
    contract L1StandardBridge (0x61E44dC0dae6888B5a301887732217d5725B0bFf) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x35d5D43271548c984662d4879FBc8e041Bc1Ff93"
+        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      issuedPermissions.0.via.0:
+        {"address":"0x35d5D43271548c984662d4879FBc8e041Bc1Ff93","delay":0}
    }
```

```diff
    contract L1ERC721Bridge (0x6CC3268794c5d3E3d9d52adEfC748B59d536cb22) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x35d5D43271548c984662d4879FBc8e041Bc1Ff93"
+        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      issuedPermissions.0.via.0:
+        {"address":"0x35d5D43271548c984662d4879FBc8e041Bc1Ff93","delay":0}
    }
```

```diff
    contract OptimismPortal (0x85eA9c11cf3D4786027F7FD08F4406b15777e5f8) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x35d5D43271548c984662d4879FBc8e041Bc1Ff93"
+        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      issuedPermissions.0.via.0:
+        {"address":"0x35d5D43271548c984662d4879FBc8e041Bc1Ff93","delay":0}
    }
```

```diff
    contract AddressManager (0xC845F9C4004EB35a8bde8ad89C4760a9c0e65CAB) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x35d5D43271548c984662d4879FBc8e041Bc1Ff93"
+        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      issuedPermissions.0.via.0:
+        {"address":"0x35d5D43271548c984662d4879FBc8e041Bc1Ff93","delay":0}
    }
```

Generated with discovered.json: 0x81a42d1e238b9f2a813beeeda213a44faa4e468f

# Diff at Fri, 30 Aug 2024 07:53:32 GMT:

- chain: ethereum
- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@6c1bd1f41fadf5f2cb1c1805b5a2c6138a3ed35a block: 20331900
- current block number: 20331900

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20331900 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x35d5D43271548c984662d4879FBc8e041Bc1Ff93) {
    +++ description: None
      receivedPermissions.6.via:
-        []
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

```diff
    contract ConduitMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: It can act on behalf of 0x35d5D43271548c984662d4879FBc8e041Bc1Ff93, inheriting its permissions.
      receivedPermissions.0.via:
-        []
    }
```

Generated with discovered.json: 0x749870376f0225f1b5484c547380dcda87e11ce6

# Diff at Fri, 23 Aug 2024 09:53:07 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@67597c7d6c810bc726594446890178150240711e block: 20331900
- current block number: 20331900

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20331900 (main branch discovery), not current.

```diff
    contract OptimismMintableERC20Factory (0x08Dea366F26C25a08C8D1C3568ad07d1e587136d) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract SystemConfig (0x0e4C4CDd01ceCB01070E9Fdfe7600871e4ae996e) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract L2OutputOracle (0x1145E7848c8B64c6cab86Fd6D378733385c5C3Ba) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract L1StandardBridge (0x61E44dC0dae6888B5a301887732217d5725B0bFf) {
    +++ description: None
      values.$upgradeCount:
+        0
    }
```

```diff
    contract L1ERC721Bridge (0x6CC3268794c5d3E3d9d52adEfC748B59d536cb22) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract OptimismPortal (0x85eA9c11cf3D4786027F7FD08F4406b15777e5f8) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

Generated with discovered.json: 0x9fd448ab838efb3dd0784aa9eda6406d195424a6

# Diff at Wed, 21 Aug 2024 10:03:52 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@2f6dde3357bf5d79196b6e94f79d853a6c4ec72b block: 20331900
- current block number: 20331900

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20331900 (main branch discovery), not current.

```diff
    contract OptimismMintableERC20Factory (0x08Dea366F26C25a08C8D1C3568ad07d1e587136d) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x35d5D43271548c984662d4879FBc8e041Bc1Ff93","via":[]}]
    }
```

```diff
    contract SystemConfig (0x0e4C4CDd01ceCB01070E9Fdfe7600871e4ae996e) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x35d5D43271548c984662d4879FBc8e041Bc1Ff93","via":[]}]
    }
```

```diff
    contract L2OutputOracle (0x1145E7848c8B64c6cab86Fd6D378733385c5C3Ba) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x35d5D43271548c984662d4879FBc8e041Bc1Ff93","via":[]}]
    }
```

```diff
    contract ProxyAdmin (0x35d5D43271548c984662d4879FBc8e041Bc1Ff93) {
    +++ description: None
      assignedPermissions:
-        {"upgrade":["0x08Dea366F26C25a08C8D1C3568ad07d1e587136d","0x0e4C4CDd01ceCB01070E9Fdfe7600871e4ae996e","0x1145E7848c8B64c6cab86Fd6D378733385c5C3Ba","0x61E44dC0dae6888B5a301887732217d5725B0bFf","0x6CC3268794c5d3E3d9d52adEfC748B59d536cb22","0x85eA9c11cf3D4786027F7FD08F4406b15777e5f8"],"configure":["0xC845F9C4004EB35a8bde8ad89C4760a9c0e65CAB"]}
      issuedPermissions:
+        [{"permission":"configure","target":"0x4a4962275DF8C60a80d3a25faEc5AA7De116A746","via":[]}]
      receivedPermissions:
+        [{"permission":"configure","target":"0xC845F9C4004EB35a8bde8ad89C4760a9c0e65CAB","via":[]},{"permission":"upgrade","target":"0x08Dea366F26C25a08C8D1C3568ad07d1e587136d","via":[]},{"permission":"upgrade","target":"0x0e4C4CDd01ceCB01070E9Fdfe7600871e4ae996e","via":[]},{"permission":"upgrade","target":"0x1145E7848c8B64c6cab86Fd6D378733385c5C3Ba","via":[]},{"permission":"upgrade","target":"0x61E44dC0dae6888B5a301887732217d5725B0bFf","via":[]},{"permission":"upgrade","target":"0x6CC3268794c5d3E3d9d52adEfC748B59d536cb22","via":[]},{"permission":"upgrade","target":"0x85eA9c11cf3D4786027F7FD08F4406b15777e5f8","via":[]}]
    }
```

```diff
    contract ConduitMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: It can act on behalf of 0x35d5D43271548c984662d4879FBc8e041Bc1Ff93, inheriting its permissions.
      assignedPermissions:
-        {"configure":["0x35d5D43271548c984662d4879FBc8e041Bc1Ff93"]}
      receivedPermissions:
+        [{"permission":"configure","target":"0x35d5D43271548c984662d4879FBc8e041Bc1Ff93","via":[]}]
    }
```

```diff
    contract L1StandardBridge (0x61E44dC0dae6888B5a301887732217d5725B0bFf) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x35d5D43271548c984662d4879FBc8e041Bc1Ff93","via":[]}]
    }
```

```diff
    contract L1ERC721Bridge (0x6CC3268794c5d3E3d9d52adEfC748B59d536cb22) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x35d5D43271548c984662d4879FBc8e041Bc1Ff93","via":[]}]
    }
```

```diff
    contract OptimismPortal (0x85eA9c11cf3D4786027F7FD08F4406b15777e5f8) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x35d5D43271548c984662d4879FBc8e041Bc1Ff93","via":[]}]
    }
```

```diff
    contract AddressManager (0xC845F9C4004EB35a8bde8ad89C4760a9c0e65CAB) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"configure","target":"0x35d5D43271548c984662d4879FBc8e041Bc1Ff93","via":[]}]
    }
```

Generated with discovered.json: 0xdfbedb7f8eb83676ac0e4df91ee3e68c94175b64

# Diff at Fri, 09 Aug 2024 12:00:15 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bf40aa32f030fd312056ca0ef198c8550467d1d7 block: 20331900
- current block number: 20331900

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20331900 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x35d5D43271548c984662d4879FBc8e041Bc1Ff93) {
    +++ description: None
      assignedPermissions.upgrade.5:
-        "0x0e4C4CDd01ceCB01070E9Fdfe7600871e4ae996e"
+        "0x85eA9c11cf3D4786027F7FD08F4406b15777e5f8"
      assignedPermissions.upgrade.4:
-        "0x1145E7848c8B64c6cab86Fd6D378733385c5C3Ba"
+        "0x6CC3268794c5d3E3d9d52adEfC748B59d536cb22"
      assignedPermissions.upgrade.3:
-        "0x85eA9c11cf3D4786027F7FD08F4406b15777e5f8"
+        "0x61E44dC0dae6888B5a301887732217d5725B0bFf"
      assignedPermissions.upgrade.2:
-        "0x61E44dC0dae6888B5a301887732217d5725B0bFf"
+        "0x1145E7848c8B64c6cab86Fd6D378733385c5C3Ba"
      assignedPermissions.upgrade.1:
-        "0x6CC3268794c5d3E3d9d52adEfC748B59d536cb22"
+        "0x0e4C4CDd01ceCB01070E9Fdfe7600871e4ae996e"
    }
```

Generated with discovered.json: 0xf222c3f8e360f3af5a7ea224dbe7155df463f756

# Diff at Fri, 09 Aug 2024 10:10:22 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f0da1d0aab7bc6b3b5e54e7e93480bd98e57035 block: 20331900
- current block number: 20331900

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20331900 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x35d5D43271548c984662d4879FBc8e041Bc1Ff93) {
    +++ description: None
      assignedPermissions.admin:
-        ["0x08Dea366F26C25a08C8D1C3568ad07d1e587136d","0x0e4C4CDd01ceCB01070E9Fdfe7600871e4ae996e","0x1145E7848c8B64c6cab86Fd6D378733385c5C3Ba","0x61E44dC0dae6888B5a301887732217d5725B0bFf","0x6CC3268794c5d3E3d9d52adEfC748B59d536cb22","0x85eA9c11cf3D4786027F7FD08F4406b15777e5f8"]
      assignedPermissions.owner:
-        ["0xC845F9C4004EB35a8bde8ad89C4760a9c0e65CAB"]
      assignedPermissions.upgrade:
+        ["0x08Dea366F26C25a08C8D1C3568ad07d1e587136d","0x6CC3268794c5d3E3d9d52adEfC748B59d536cb22","0x61E44dC0dae6888B5a301887732217d5725B0bFf","0x85eA9c11cf3D4786027F7FD08F4406b15777e5f8","0x1145E7848c8B64c6cab86Fd6D378733385c5C3Ba","0x0e4C4CDd01ceCB01070E9Fdfe7600871e4ae996e"]
      assignedPermissions.configure:
+        ["0xC845F9C4004EB35a8bde8ad89C4760a9c0e65CAB"]
    }
```

```diff
    contract ConduitMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: It can act on behalf of 0x35d5D43271548c984662d4879FBc8e041Bc1Ff93, inheriting its permissions.
      assignedPermissions.owner:
-        ["0x35d5D43271548c984662d4879FBc8e041Bc1Ff93"]
      assignedPermissions.configure:
+        ["0x35d5D43271548c984662d4879FBc8e041Bc1Ff93"]
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
    contract ChallengerMultisig (0x91F4be0C264FAFA1fEd75c4440910Cba2cAd98e8) {
    +++ description: None
      values.$multisigThreshold:
-        "4 of 6 (67%)"
      values.getOwners:
-        ["0xdb5CF90A8f97C372d5AEC650a5668d4E4bECFC10","0x824CACbBeA0377801f72d736CFd5C869dd89b931","0x52E84149daE06CB5C4E92029140Da4faD86CE968","0x3840f487A17A41100DD1Bf0946c34f132a57Fd5f","0xa0C600a6e85bf225958FFAcC70B5FDDF9A059038","0xefCf0c8faFB425997870f845e26fC6cA6EE6dD5C"]
      values.getThreshold:
-        4
      values.$members:
+        ["0xdb5CF90A8f97C372d5AEC650a5668d4E4bECFC10","0x824CACbBeA0377801f72d736CFd5C869dd89b931","0x52E84149daE06CB5C4E92029140Da4faD86CE968","0x3840f487A17A41100DD1Bf0946c34f132a57Fd5f","0xa0C600a6e85bf225958FFAcC70B5FDDF9A059038","0xefCf0c8faFB425997870f845e26fC6cA6EE6dD5C"]
      values.$threshold:
+        4
      values.multisigThreshold:
+        "4 of 6 (67%)"
    }
```

Generated with discovered.json: 0x823df2d38ee05218e577638bf8aebb0cfc3be7c8

# Diff at Thu, 18 Jul 2024 10:31:44 GMT:

- chain: ethereum
- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@d89fe52cb65d643cef712d1d7910564a7acf2dce block: 20331900
- current block number: 20331900

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20331900 (main branch discovery), not current.

```diff
    contract ConduitMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      descriptions:
+        ["It can act on behalf of 0x35d5D43271548c984662d4879FBc8e041Bc1Ff93, inheriting its permissions."]
    }
```

Generated with discovered.json: 0xea71ccb52a7fbc8dc15a42c895b9a0c73ce801e5

# Diff at Thu, 18 Jul 2024 07:25:30 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@14a8b2e13da16d68d776511f98207e5360accba3 block: 19927699
- current block number: 20331900

## Description

Lyra bumps gas limit by 4x to 120M. This is in the ballpark of what base is also running.

## Watched changes

```diff
    contract SystemConfig (0x0e4C4CDd01ceCB01070E9Fdfe7600871e4ae996e) {
    +++ description: None
      values.gasLimit:
-        30000000
+        120000000
    }
```

Generated with discovered.json: 0x0eea8969d66cf8d703d845a3102f84b758742fa1

# Diff at Wed, 22 May 2024 20:07:21 GMT:

- chain: ethereum
- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@bac4efad06804152ae97853892e122a801bbc509 block: 19918742
- current block number: 19927699

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

Generated with discovered.json: 0xb37e4ebb45bc5eac603646bd455d4891ca8d5069

# Diff at Tue, 21 May 2024 14:01:11 GMT:

- chain: ethereum
- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@c032520e456d0e6bee8b65e420ff7dba9f36bd48 block: 19531962
- current block number: 19918742

## Description

Name change.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19531962 (main branch discovery), not current.

```diff
    contract LyraMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      name:
-        "LyraMultisig"
+        "ConduitMultisig"
    }
```

Generated with discovered.json: 0x07856a84aab1e3a9f52fa26b7cf05e154e094e4d

# Diff at Thu, 28 Mar 2024 10:17:32 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@dd32bb06b292cc8459fb09925454ee3a90f5c27e block: 19488865
- current block number: 19531962

## Description

Update discovery to include the multisig threshold.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19488865 (main branch discovery), not current.

```diff
    contract LyraMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      upgradeability.threshold:
+        "3 of 5 (60%)"
    }
```

```diff
    contract ChallengerMultisig (0x91F4be0C264FAFA1fEd75c4440910Cba2cAd98e8) {
    +++ description: None
      upgradeability.threshold:
+        "4 of 6 (67%)"
    }
```

Generated with discovered.json: 0x483b8b606b6d775399f6b2056e464f7b45b6ef3a

# Diff at Mon, 11 Mar 2024 13:04:46 GMT:

- chain: ethereum
- author: Michał Sobieraj-Jakubiec (<michalsidzej@gmail.com>)
- comparing to: main@64454506aee2b4b4e15b121f096369e92ec4cf20 block: 19176784
- current block number: 19412035

## Description

Update OP stack DA handler

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19176784 (main branch discovery), not current.

```diff
    contract SystemConfig (0x0e4C4CDd01ceCB01070E9Fdfe7600871e4ae996e) {
    +++ description: None
      values.opStackDA.isSequencerSendingBlobTx:
+        false
    }
```

Generated with discovered.json: 0xe094838366e0c9e35830fe03bd7405a15ba56cab

# Diff at Wed, 07 Feb 2024 14:03:33 GMT:

- chain: ethereum
- author: Michał Sobieraj-Jakubiec (<michalsidzej@gmail.com>)
- comparing to: main@2e35800e01005d93332a552032058dcd67f3631d block: 19175190
- current block number: 19176784

## Description

Added opStackSequencerInbox handler

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19175190 (main branch discovery), not current.

```diff
    contract SystemConfig (0x0e4C4CDd01ceCB01070E9Fdfe7600871e4ae996e) {
      values.sequencerInbox:
+        "0x5f7f7f6DB967F0ef10BdA0678964DBA185d16c50"
    }
```

Generated with discovered.json: 0x0f77399b9256ea1e65b40583d3103421cce8b78e

# Diff at Wed, 07 Feb 2024 08:41:30 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@64f1e0f27f831d3ef860a1c2faad8c77e04e6c29 block: 19090320
- current block number: 19175190

## Description

Updated with the new OpDAHandler to remove the field.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19090320 (main branch discovery), not current.

```diff
    contract SystemConfig (0x0e4C4CDd01ceCB01070E9Fdfe7600871e4ae996e) {
      values.opStackDA.isAllTxsLengthEqualToCelestiaDAExample:
-        true
    }
```

Generated with discovered.json: 0x4503a45a15552e2f0c5fac881fdbb0f026d5f650

# Diff at Fri, 26 Jan 2024 10:56:14 GMT:

- chain: ethereum
- author: Michał Sobieraj-Jakubiec (<michalsidzej@gmail.com>)
- comparing to: main@bb037f7100968a00265a4787338e51ca81aafe9b block: 19032828
- current block number: 19090320

## Description

Added opStackDa handler

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19032828 (main branch discovery), not current.

```diff
    contract SystemConfig (0x0e4C4CDd01ceCB01070E9Fdfe7600871e4ae996e) {
      values.opStackDA:
+        {"isAllTxsLengthEqualToCelestiaDAExample":true,"isSomeTxsLengthEqualToCelestiaDAExample":true}
    }
```

Generated with discovered.json: 0xf25c1536731bdb55d1cbfab87638b709e4c1b961

# Diff at Thu, 18 Jan 2024 09:23:11 GMT:

- chain: ethereum
- author: Michał Podsiadły (<michal.podsiadly@l2beat.com>)
- comparing to: main@0cb1eb82b45ad89a272a3c1b8f8f24ae020627cc block: 18927731
- current block number: 19032828

## Description

Dynamic fee overhead has been changed.

## Watched changes

```diff
    contract SystemConfig (0x0e4C4CDd01ceCB01070E9Fdfe7600871e4ae996e) {
      values.scalar:
-        684000
+        68400
    }
```

# Diff at Wed, 03 Jan 2024 15:30:59 GMT:

- chain: ethereum
- author: Radina Talanova (<nt.radina@gmail.com>)
- comparing to: main@e8eb03b39061a86a8ec01e26d970e40d080ad225

## Description

One owner is removed and another is added to LyraMultisig.

## Watched changes

```diff
    contract LyraMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
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
    }
```

# Diff at Tue, 19 Dec 2023 08:25:57 GMT:

- chain: ethereum
- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@

## Description

Add initial config for Lyra.

## Watched changes

```diff
+   Status: CREATED
    contract OptimismMintableERC20Factory (0x08Dea366F26C25a08C8D1C3568ad07d1e587136d) {
    }
```

```diff
+   Status: CREATED
    contract SystemConfig (0x0e4C4CDd01ceCB01070E9Fdfe7600871e4ae996e) {
    }
```

```diff
+   Status: CREATED
    contract L2OutputOracle (0x1145E7848c8B64c6cab86Fd6D378733385c5C3Ba) {
    }
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x35d5D43271548c984662d4879FBc8e041Bc1Ff93) {
    }
```

```diff
+   Status: CREATED
    contract LyraMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    }
```

```diff
+   Status: CREATED
    contract L1CrossDomainMessenger (0x5456f02c08e9A018E42C39b351328E5AA864174A) {
    }
```

```diff
+   Status: CREATED
    contract L1StandardBridge (0x61E44dC0dae6888B5a301887732217d5725B0bFf) {
    }
```

```diff
+   Status: CREATED
    contract L1ERC721Bridge (0x6CC3268794c5d3E3d9d52adEfC748B59d536cb22) {
    }
```

```diff
+   Status: CREATED
    contract OptimismPortal (0x85eA9c11cf3D4786027F7FD08F4406b15777e5f8) {
    }
```

```diff
+   Status: CREATED
    contract ChallengerMultisig (0x91F4be0C264FAFA1fEd75c4440910Cba2cAd98e8) {
    }
```

```diff
+   Status: CREATED
    contract AddressManager (0xC845F9C4004EB35a8bde8ad89C4760a9c0e65CAB) {
    }
```

