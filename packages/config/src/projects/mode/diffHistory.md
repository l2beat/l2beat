Generated with discovered.json: 0x426d187785f76461364a70bba696f43256292e0e

# Diff at Thu, 23 Oct 2025 12:38:25 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@57d3f180a9197fcc582bfc2d2856eea99da824cc block: 1760306862
- current timestamp: 1761223020

## Description

msig change.

## Watched changes

```diff
    contract OpFoundationUpgradeSafe (eth:0x847B5c174615B1B7fDF770882256e2D3E95b9D92) {
    +++ description: None
      values.$members.5:
-        "eth:0x7cB07FE039a92B3D784f284D919503A381BEC54f"
+        "eth:0x69acfE2096Dfb8d5A041eF37693553c48d9BFd02"
    }
```

```diff
    contract OpFoundationOperationsSafe (eth:0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A) {
    +++ description: None
      values.$members.5:
-        "eth:0x7cB07FE039a92B3D784f284D919503A381BEC54f"
+        "eth:0x69acfE2096Dfb8d5A041eF37693553c48d9BFd02"
    }
```

Generated with discovered.json: 0x5b88ae5cf1514ea80804a08c67afe8ac19f4c45e

# Diff at Sun, 12 Oct 2025 22:08:50 GMT:

- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@be19e15e05865ff8c557a70a542cd8d359ce8e39 block: 1759480897
- current timestamp: 1760306862

## Description

Upgrade to 16a contracts version (https://gov.optimism.io/t/maintenance-upgrade-proposal-u16a/10288
) - all contracts templatized.

## Watched changes

```diff
    contract L1ERC721Bridge (eth:0x2901dA832a4D0297FF0691100A8E496626cc626D) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      sourceHashes.1:
-        "0x482ec6e91304ac39a3fb4505634427bddfddee23b8e93a4f7f995ca5083ae3c3"
+        "0xab560cdc633c64552a47cd693ebc9aaab91fe80bec99e9e89b9d13d89a994c22"
      values.$implementation:
-        "eth:0xAE2AF01232a6c4a4d3012C5eC5b1b35059caF10d"
+        "eth:0x7f1d12fB2911EB095278085f721e644C1f675696"
      values.$pastUpgrades.5:
+        ["2025-10-09T20:14:23.000Z","0x3ac45d51da454abfba887b5ab1dae831a78e068615893fb62d8034437bb17063",["eth:0x276d3730f219f7ec22274f7263180b8452B46d47"]]
      values.$pastUpgrades.6:
+        ["2025-10-09T20:14:23.000Z","0x3ac45d51da454abfba887b5ab1dae831a78e068615893fb62d8034437bb17063",["eth:0x7aE1d3BD877a4C5CA257404ce26BE93A02C98013"]]
      values.$pastUpgrades.7:
+        ["2025-10-09T20:14:23.000Z","0x3ac45d51da454abfba887b5ab1dae831a78e068615893fb62d8034437bb17063",["eth:0x7f1d12fB2911EB095278085f721e644C1f675696"]]
      values.$upgradeCount:
-        5
+        8
      values.version:
-        "2.1.0"
+        "2.8.0"
      values.initVersion:
+        3
      values.proxyAdmin:
+        "eth:0x470d87b1dae09a454A43D1fD772A561a03276aB7"
      values.proxyAdminOwner:
+        "eth:0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A"
      values.systemConfig:
+        "eth:0x5e6432F18Bc5d497B1Ab2288a025Fbf9D69E2221"
      implementationNames.eth:0xAE2AF01232a6c4a4d3012C5eC5b1b35059caF10d:
-        "L1ERC721Bridge"
      implementationNames.eth:0x7f1d12fB2911EB095278085f721e644C1f675696:
+        "L1ERC721Bridge"
    }
```

```diff
    contract ProxyAdmin (eth:0x470d87b1dae09a454A43D1fD772A561a03276aB7) {
    +++ description: None
      directlyReceivedPermissions.1:
+        {"permission":"upgrade","from":"eth:0x1C823D585B2b4325A0DB845cEBe32FC7Ad67514a","role":"admin"}
      directlyReceivedPermissions.8:
-        {"permission":"upgrade","from":"eth:0xa29b6D87Ee95375E7a31374667054F38b920ab7a","role":"admin"}
      directlyReceivedPermissions.9.from:
-        "eth:0xbf1229eE0782939bB4325Fd13a0b481949e311Aa"
+        "eth:0xEB9d917868276cee5457609dbBF470FdE41BADE8"
    }
```

```diff
    contract SuperchainProxyAdminOwner (eth:0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A) {
    +++ description: None
      receivedPermissions.1:
-        {"permission":"interact","from":"eth:0xa29b6D87Ee95375E7a31374667054F38b920ab7a","description":"can pull funds from the contract in case of emergency.","role":".owner"}
      receivedPermissions.2:
+        {"permission":"upgrade","from":"eth:0x1C823D585B2b4325A0DB845cEBe32FC7Ad67514a","role":"admin","via":[{"address":"eth:0x470d87b1dae09a454A43D1fD772A561a03276aB7"}]}
      receivedPermissions.11:
-        {"permission":"upgrade","from":"eth:0xa29b6D87Ee95375E7a31374667054F38b920ab7a","role":"admin","via":[{"address":"eth:0x470d87b1dae09a454A43D1fD772A561a03276aB7"}]}
      receivedPermissions.12.from:
-        "eth:0xbf1229eE0782939bB4325Fd13a0b481949e311Aa"
+        "eth:0xEB9d917868276cee5457609dbBF470FdE41BADE8"
    }
```

```diff
    contract SystemConfig (eth:0x5e6432F18Bc5d497B1Ab2288a025Fbf9D69E2221) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      sourceHashes.1:
-        "0xc7135dbd2a53312d36df3f3ee91ce0a5a459ab8fc7725880a3a9c55a5fa0ed6c"
+        "0xc64176b1425d9639f5082ecef5e30b3b365111e2be71596ab1bd831edba65bd9"
      values.$implementation:
-        "eth:0xAB9d6cB7A427c0765163A7f45BB91cAfe5f2D375"
+        "eth:0x2bFE4A5Bd5A41e9d848d843ebCDFa15954e9A557"
      values.$pastUpgrades.7:
+        ["2025-10-09T20:14:23.000Z","0x3ac45d51da454abfba887b5ab1dae831a78e068615893fb62d8034437bb17063",["eth:0x760C48C62A85045A6B69f07F4a9f22868659CbCc"]]
      values.$pastUpgrades.8:
+        ["2025-10-09T20:14:23.000Z","0x3ac45d51da454abfba887b5ab1dae831a78e068615893fb62d8034437bb17063",["eth:0x340f923E5c7cbB2171146f64169EC9d5a9FfE647"]]
      values.$pastUpgrades.9:
+        ["2025-10-09T20:14:23.000Z","0x3ac45d51da454abfba887b5ab1dae831a78e068615893fb62d8034437bb17063",["eth:0x2bFE4A5Bd5A41e9d848d843ebCDFa15954e9A557"]]
      values.$upgradeCount:
-        7
+        10
      values.DISPUTE_GAME_FACTORY_SLOT:
-        "0x52322a25d9f59ea17656545543306b7aef62bc0cc53a0e65ccfa0c75b97aa906"
      values.gasPayingToken:
-        {"addr_":"eth:0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE","decimals_":18}
      values.gasPayingTokenName:
-        "Ether"
      values.gasPayingTokenSymbol:
-        "ETH"
      values.isCustomGasToken:
-        false
      values.maximumGasLimit:
-        200000000
+        500000000
      values.version:
-        "2.3.0"
+        "3.7.0"
      values.getAddresses:
+        {"l1CrossDomainMessenger":"eth:0x95bDCA6c8EdEB69C98Bd5bd17660BaCef1298A6f","l1ERC721Bridge":"eth:0x2901dA832a4D0297FF0691100A8E496626cc626D","l1StandardBridge":"eth:0x735aDBbE72226BD52e818E7181953f42E3b0FF21","optimismPortal":"eth:0x8B34b14c7c7123459Cf3076b8Cb929BE097d0C07","optimismMintableERC20Factory":"eth:0x69216395A62dFb243C05EF4F1C27AF8655096a95"}
      values.guardian:
+        "eth:0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2"
      values.initVersion:
+        3
      values.l2ChainId:
+        34443
      values.operatorFeeConstant:
+        0
      values.operatorFeeScalar:
+        0
      values.paused:
+        false
      values.proxyAdmin:
+        "eth:0x470d87b1dae09a454A43D1fD772A561a03276aB7"
      values.proxyAdminOwner:
+        "eth:0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A"
      values.superchainConfig:
+        "eth:0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
      implementationNames.eth:0xAB9d6cB7A427c0765163A7f45BB91cAfe5f2D375:
-        "SystemConfig"
      implementationNames.eth:0x2bFE4A5Bd5A41e9d848d843ebCDFa15954e9A557:
+        "SystemConfig"
    }
```

```diff
-   Status: DELETED
    contract MIPS (eth:0x5fE03a12C1236F9C22Cb6479778DDAa4bce6299C)
    +++ description: The MIPS contract is used to execute the final step of the dispute game which objectively determines the winner of the dispute.
```

```diff
    EOA  (eth:0x674F64D64Ddc198db83cd9047dF54BF89cCD0ddB) {
    +++ description: None
      receivedPermissions:
-        [{"permission":"propose","from":"eth:0x75fa114D4286c7d1114CE773EfF0f1bDe0aF966a","role":".proposer"}]
    }
```

```diff
    contract OptimismMintableERC20Factory (eth:0x69216395A62dFb243C05EF4F1C27AF8655096a95) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintableERC20 as this chain's representation of a token on the host chain, or vice-versa.
      sourceHashes.1:
-        "0x4c5ac4e53576924cabbd2a471f368a541bc3f4b1f53fa41a389692fcc62f6176"
+        "0x9650b4bba6299e410f01a369a95a2c57e1c3ca35f0d80c13f4f59fc468f370e5"
      values.$implementation:
-        "eth:0xE01efbeb1089D1d1dB9c6c8b135C934C0734c846"
+        "eth:0x5493f4677A186f64805fe7317D6993ba4863988F"
      values.$pastUpgrades.4:
+        ["2025-10-09T20:14:23.000Z","0x3ac45d51da454abfba887b5ab1dae831a78e068615893fb62d8034437bb17063",["eth:0x5493f4677A186f64805fe7317D6993ba4863988F"]]
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
    contract DisputeGameFactory (eth:0x6f13EFadABD9269D6cEAd22b448d434A1f1B433E) {
    +++ description: The dispute game factory allows the creation of dispute games, used to propose state roots and eventually challenge them.
      sourceHashes.1:
-        "0x7f307d6191215a72b6c24c01b3c2fc87c84f7fb346790132e58736caa2d1dd14"
+        "0x93342e3d1e616bd6c727a5f73b09c0811bdab764dc9ad7346278593fb66b3689"
      values.$implementation:
-        "eth:0xc641A33cab81C559F2bd4b21EA34C290E2440C2B"
+        "eth:0x33D1e8571a85a538ed3D5A4d88f46C112383439D"
      values.$pastUpgrades.1:
+        ["2025-10-09T20:14:23.000Z","0x3ac45d51da454abfba887b5ab1dae831a78e068615893fb62d8034437bb17063",["eth:0x4bbA758F006Ef09402eF31724203F316ab74e4a0"]]
      values.$pastUpgrades.2:
+        ["2025-10-09T20:14:23.000Z","0x3ac45d51da454abfba887b5ab1dae831a78e068615893fb62d8034437bb17063",["eth:0x33D1e8571a85a538ed3D5A4d88f46C112383439D"]]
      values.$upgradeCount:
-        1
+        3
+++ severity: HIGH
      values.gameImpls.1:
-        "eth:0x75fa114D4286c7d1114CE773EfF0f1bDe0aF966a"
+        "eth:0xF25E6e47Ce13a73550c4DA8824DFC3bDa9191249"
      values.version:
-        "1.0.0"
+        "1.2.0"
      values.initVersion:
+        1
      values.proxyAdmin:
+        "eth:0x470d87b1dae09a454A43D1fD772A561a03276aB7"
      values.proxyAdminOwner:
+        "eth:0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A"
      implementationNames.eth:0xc641A33cab81C559F2bd4b21EA34C290E2440C2B:
-        "DisputeGameFactory"
      implementationNames.eth:0x33D1e8571a85a538ed3D5A4d88f46C112383439D:
+        "DisputeGameFactory"
    }
```

```diff
    contract L1StandardBridge (eth:0x735aDBbE72226BD52e818E7181953f42E3b0FF21) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      sourceHashes.1:
-        "0x1010ff7f40ab4d53e6d9996aefa04423dabe9d0e22fac2d02b330ed3aa2c5740"
+        "0x29b630d028d2dfddff75dc128b41ae51836c874dcd31a62c9d7313599e6261fb"
      values.$implementation:
-        "eth:0x64B5a5Ed26DCb17370Ff4d33a8D503f0fbD06CfF"
+        "eth:0xe32B192fb1DcA88fCB1C56B3ACb429e32238aDCb"
      values.version:
-        "2.1.0"
+        "2.7.0"
      values.initVersion:
+        3
      values.proxyAdmin:
+        "eth:0x470d87b1dae09a454A43D1fD772A561a03276aB7"
      values.proxyAdminOwner:
+        "eth:0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A"
      values.systemConfig:
+        "eth:0x5e6432F18Bc5d497B1Ab2288a025Fbf9D69E2221"
      implementationNames.eth:0x64B5a5Ed26DCb17370Ff4d33a8D503f0fbD06CfF:
-        "L1StandardBridge"
      implementationNames.eth:0xe32B192fb1DcA88fCB1C56B3ACb429e32238aDCb:
+        "L1StandardBridge"
    }
```

```diff
-   Status: DELETED
    contract PermissionedDisputeGame (eth:0x75fa114D4286c7d1114CE773EfF0f1bDe0aF966a)
    +++ description: Same as FaultDisputeGame, but only two permissioned addresses are designated as proposer and challenger.
```

```diff
    contract OptimismPortal2 (eth:0x8B34b14c7c7123459Cf3076b8Cb929BE097d0C07) {
    +++ description: The OptimismPortal contract is the main entry point to deposit funds from L1 to L2. It also allows to prove and finalize withdrawals. It specifies which game type can be used for withdrawals, which currently is the PermissionedDisputeGame.
      sourceHashes.1:
-        "0x41be46bdb67af1b7af90e1bd70a1fcd31a3352282beb83b846a5189675c37ac1"
+        "0x8ca0818fc584e81a5cead0efc1c32f3273182323dcbd08a60779d55cb0aa90c9"
      values.$implementation:
-        "eth:0xe2F826324b2faf99E513D16D266c3F80aE87832B"
+        "eth:0x381E729FF983FA4BCEd820e7b922d79bF653B999"
      values.$pastUpgrades.9:
+        ["2025-10-09T20:14:23.000Z","0x3ac45d51da454abfba887b5ab1dae831a78e068615893fb62d8034437bb17063",["eth:0x2D7e764a0D9919e16983a46595CfA81fc34fa7Cd"]]
      values.$pastUpgrades.10:
+        ["2025-10-09T20:14:23.000Z","0x3ac45d51da454abfba887b5ab1dae831a78e068615893fb62d8034437bb17063",["eth:0xB443Da3e07052204A02d630a8933dAc05a0d6fB4"]]
      values.$pastUpgrades.11:
+        ["2025-10-09T20:14:23.000Z","0x3ac45d51da454abfba887b5ab1dae831a78e068615893fb62d8034437bb17063",["eth:0x381E729FF983FA4BCEd820e7b922d79bF653B999"]]
      values.$upgradeCount:
-        9
+        12
      values.respectedGameTypeUpdatedAt:
-        1749825119
+        1760040863
      values.version:
-        "3.10.0"
+        "5.0.0"
      values.anchorStateRegistry:
+        "eth:0xEB9d917868276cee5457609dbBF470FdE41BADE8"
      values.ethLockbox:
+        "eth:0x0000000000000000000000000000000000000000"
      values.initVersion:
+        3
      values.proxyAdmin:
+        "eth:0x470d87b1dae09a454A43D1fD772A561a03276aB7"
      values.proxyAdminOwner:
+        "eth:0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A"
      implementationNames.eth:0xe2F826324b2faf99E513D16D266c3F80aE87832B:
-        "OptimismPortal2"
      implementationNames.eth:0x381E729FF983FA4BCEd820e7b922d79bF653B999:
+        "OptimismPortal2"
    }
```

```diff
    contract L1CrossDomainMessenger (eth:0x95bDCA6c8EdEB69C98Bd5bd17660BaCef1298A6f) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      sourceHashes.1:
-        "0x1cc8a3b7de3d2c54c4706bb3f3015714d3b56647fc9fbfd6f8b068f5f63c1c25"
+        "0x12cf78bcfa479caaee8133c0f935dcdcc333cdc116805f6b81bd80f6ba52128c"
      values.$implementation:
-        "eth:0xD3494713A5cfaD3F5359379DfA074E2Ac8C6Fd65"
+        "eth:0x22D12E0FAebD62d429514A65EBAe32dd316c12D6"
      values.$pastUpgrades.6:
+        ["2025-10-09T20:14:23.000Z","0x3ac45d51da454abfba887b5ab1dae831a78e068615893fb62d8034437bb17063",["eth:0x3eA6084748ED1b2A9B5D4426181F1ad8C93F6231"]]
      values.$pastUpgrades.7:
+        ["2025-10-09T20:14:23.000Z","0x3ac45d51da454abfba887b5ab1dae831a78e068615893fb62d8034437bb17063",["eth:0x5D5a095665886119693F0B41d8DFeE78da033e8B"]]
      values.$pastUpgrades.8:
+        ["2025-10-09T20:14:23.000Z","0x3ac45d51da454abfba887b5ab1dae831a78e068615893fb62d8034437bb17063",["eth:0x22D12E0FAebD62d429514A65EBAe32dd316c12D6"]]
      values.$upgradeCount:
-        6
+        9
      values.version:
-        "2.3.0"
+        "2.10.0"
      values.ENCODING_OVERHEAD:
+        260
      values.FLOOR_CALLDATA_OVERHEAD:
+        40
      values.initVersion:
+        3
      values.proxyAdmin:
+        "eth:0x470d87b1dae09a454A43D1fD772A561a03276aB7"
      values.proxyAdminOwner:
+        "eth:0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A"
      values.systemConfig:
+        "eth:0x5e6432F18Bc5d497B1Ab2288a025Fbf9D69E2221"
      values.TX_BASE_GAS:
+        21000
      implementationNames.eth:0xD3494713A5cfaD3F5359379DfA074E2Ac8C6Fd65:
-        "L1CrossDomainMessenger"
      implementationNames.eth:0x22D12E0FAebD62d429514A65EBAe32dd316c12D6:
+        "L1CrossDomainMessenger"
    }
```

```diff
    contract OpFoundationOperationsSafe (eth:0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A) {
    +++ description: None
      receivedPermissions:
-        [{"permission":"challenge","from":"eth:0x75fa114D4286c7d1114CE773EfF0f1bDe0aF966a","role":".challenger"}]
    }
```

```diff
-   Status: DELETED
    contract PreimageOracle (eth:0x9c065e11870B891D214Bc2Da7EF1f9DDFA1BE277)
    +++ description: The PreimageOracle contract is used to load the required data from L1 for a dispute game.
```

```diff
-   Status: DELETED
    contract DelayedWETH (eth:0xa29b6D87Ee95375E7a31374667054F38b920ab7a)
    +++ description: Contract designed to hold the bonded ETH for each game. It is designed as a wrapper around WETH to allow an owner to function as a backstop if a game would incorrectly distribute funds.
```

```diff
-   Status: DELETED
    contract AnchorStateRegistry (eth:0xbf1229eE0782939bB4325Fd13a0b481949e311Aa)
    +++ description: Contains the latest confirmed state root that can be used as a starting point in a dispute game.
```

```diff
+   Status: CREATED
    contract MIPS (eth:0x07BABE08EE4D07dBA236530183B24055535A7011)
    +++ description: The MIPS contract is used to execute the final step of the dispute game which objectively determines the winner of the dispute.
```

```diff
+   Status: CREATED
    contract DelayedWETH (eth:0x1C823D585B2b4325A0DB845cEBe32FC7Ad67514a)
    +++ description: Contract designed to hold the bonded ETH for each game. It is designed as a wrapper around WETH to allow an owner to function as a backstop if a game would incorrectly distribute funds.
```

```diff
+   Status: CREATED
    contract PreimageOracle (eth:0x1fb8cdFc6831fc866Ed9C51aF8817Da5c287aDD3)
    +++ description: The PreimageOracle contract is used to load the required data from L1 for a dispute game.
```

```diff
+   Status: CREATED
    contract AnchorStateRegistry (eth:0xEB9d917868276cee5457609dbBF470FdE41BADE8)
    +++ description: Contains the latest confirmed state root that can be used as a starting point in a dispute game. It specifies which game type can be used for withdrawals, which currently is the PermissionedDisputeGame.
```

```diff
+   Status: CREATED
    contract PermissionedDisputeGame (eth:0xF25E6e47Ce13a73550c4DA8824DFC3bDa9191249)
    +++ description: Same as FaultDisputeGame, but only two permissioned addresses are designated as proposer and challenger.
```

## Source code changes

```diff
.../AnchorStateRegistry/AnchorStateRegistry.sol    |  610 ++++-
 .../DelayedWETH/DelayedWETH.sol                    |  595 +++--
 .../DisputeGameFactory/DisputeGameFactory.sol      |  484 ++--
 .../L1CrossDomainMessenger.sol                     | 1009 +++++++--
 .../L1ERC721Bridge/L1ERC721Bridge.sol              |  689 ++++--
 .../L1StandardBridge/L1StandardBridge.sol          |  805 +++++--
 .../mode/{.flat@1759480897 => .flat}/MIPS.sol      | 2323 ++++++++++++++------
 .../OptimismMintableERC20Factory.sol               |   30 +-
 .../OptimismPortal2/OptimismPortal2.sol            | 1080 ++++++---
 .../PermissionedDisputeGame.sol                    |  371 +++-
 .../{.flat@1759480897 => .flat}/PreimageOracle.sol |  216 +-
 .../SystemConfig/SystemConfig.sol                  | 1874 ++++------------
 12 files changed, 6413 insertions(+), 3673 deletions(-)
```

Generated with discovered.json: 0x020641b9f90d1d97aeb056b9851ce6c9bfb33a18

# Diff at Fri, 03 Oct 2025 08:42:48 GMT:

- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@e647409961cd173771dcfcaeb808991c99e73911 block: 1759250604
- current timestamp: 1759480897

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

Generated with discovered.json: 0x82255800157831d345753aeaf28b585448583c58

# Diff at Tue, 30 Sep 2025 16:44:29 GMT:

- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@c66a02d28b2467edd595f8a8468988549dd6d3cf block: 1756214657
- current timestamp: 1759250604

## Description

Period formatting change.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1756214657 (main branch discovery), not current.

```diff
    contract LivenessModule (eth:0x0454092516c9A4d636d3CAfA1e82161376C8a748) {
    +++ description: used to remove members inactive for 3mo 8d while making sure that the threshold remains above 75%. If the number of members falls below 8, the eth:0x847B5c174615B1B7fDF770882256e2D3E95b9D92 takes ownership of the multisig
      description:
-        "used to remove members inactive for 98d while making sure that the threshold remains above 75%. If the number of members falls below 8, the eth:0x847B5c174615B1B7fDF770882256e2D3E95b9D92 takes ownership of the multisig"
+        "used to remove members inactive for 3mo 8d while making sure that the threshold remains above 75%. If the number of members falls below 8, the eth:0x847B5c174615B1B7fDF770882256e2D3E95b9D92 takes ownership of the multisig"
      values.livenessInterval:
-        "98d"
+        "3mo 8d"
    }
```

```diff
    contract LivenessGuard (eth:0x24424336F04440b1c28685a38303aC33C9D14a25) {
    +++ description: Modular contract to be used together with the LivenessModule. Tracks liveness / activity of Safe owners.
      receivedPermissions.0.description:
-        "can remove members of eth:0xc2819DC788505Aac350142A7A707BF9D03E3Bd03 inactive for 98d."
+        "can remove members of eth:0xc2819DC788505Aac350142A7A707BF9D03E3Bd03 inactive for 3mo 8d."
    }
```

```diff
    contract SuperchainConfig (eth:0x95703e0982140D16f8ebA6d158FccEde42f04a4C) {
    +++ description: Used to manage global configuration values for multiple OP Chains within a single Superchain network. The SuperchainConfig contract manages individual pause states for each chain connected to it, as well as a global pause state for all chains. The guardian role can pause either separately, but each pause expires after 3 months if left untouched.
      values.pauseExpiryFmt:
-        "91d 6h"
+        "3mo 1d"
    }
```

Generated with discovered.json: 0x6c1a7aa1f4140c383a8ba86d8927c6f9f1f7f856

# Diff at Mon, 15 Sep 2025 09:50:30 GMT:

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
    contract DisputeGameFactory (eth:0x6f13EFadABD9269D6cEAd22b448d434A1f1B433E) {
    +++ description: The dispute game factory allows the creation of dispute games, used to propose state roots and eventually challenge them.
+++ severity: HIGH
      values.gameImpls.2:
+        "eth:0x0000000000000000000000000000000000000000"
+++ severity: HIGH
      values.gameImpls.3:
+        "eth:0x0000000000000000000000000000000000000000"
    }
```

Generated with discovered.json: 0x7764576348096edf1b0deb58d0ec014885330f00

# Diff at Mon, 01 Sep 2025 10:01:10 GMT:

Merge mark

Generated with discovered.json: 0x5af13bf435e987e50d5930c95ed99a96468f6d00

# Diff at Tue, 26 Aug 2025 13:30:26 GMT:

- chain: ethereum
- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@e10932be0db538f3a760bbc29232375f08915af7 block: 1755507657
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

Generated with discovered.json: 0x60eafce40efab76faf0b67a456fa9f5db19d1669

# Diff at Mon, 18 Aug 2025 09:02:59 GMT:

- chain: ethereum
- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@0dd593b7eab607ddac1ba1df05212f23f79157e3 block: 1755009465
- current timestamp: 1755507657

## Description

Security council members rotation.

## Watched changes

```diff
    contract Optimism Security Council (0xc2819DC788505Aac350142A7A707BF9D03E3Bd03) {
    +++ description: None
      values.$members.4:
-        "eth:0x51aCb8e1205De850D1b512584FeE9C29C3813dDa"
+        "eth:0x3A53B4B081Eb7Cb00C46497b16Ea22e65E4Faa94"
      values.$members.10:
-        "eth:0x9Eb11A55132c851b9991F148b3Af791ca498fD7A"
+        "eth:0x0a8742365a7EB0A3698293ac54357B5Ac04cefE6"
    }
```

Generated with discovered.json: 0x69e58fa63275b3053e8d8377ee5246f5d0fe8d1c

# Diff at Tue, 12 Aug 2025 14:41:29 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@e94498235c6c8b45d3e4bfb77316081ba540850a block: 1753681907
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

Generated with discovered.json: 0xd0a13d18f1acd96a660d8b133e273f94538d1123

# Diff at Mon, 28 Jul 2025 05:52:02 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@8e540d8d4e2ea097e63a067c52194d1bf06f9b4a block: 22895942
- current block number: 23015674

## Description

Op stack gov upgrade: SuperchainConfig with pause expiry and DeputyPausModule. See optimism diffHistory for details.

## Watched changes

```diff
    contract Optimism Guardian Multisig (0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2) {
    +++ description: None
      values.GnosisSafe_modules.0:
-        "eth:0xc6901F65369FC59fC1B4D6D6bE7A2318Ff38dB5B"
+        "eth:0x76fC2F971FB355D0453cF9F64d3F9E4f640E1754"
    }
```

```diff
-   Status: DELETED
    contract DeputyPauseModule (0x126a736B18E0a64fBA19D421647A530E327E112C)
    +++ description: Allows eth:0x352f1defB49718e7Ea411687E850aA8d6299F7aC, called the deputy pauser, to act on behalf of the eth:0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A if set as its Safe module.
```

```diff
    EOA Optimism EOA 1 (0x352f1defB49718e7Ea411687E850aA8d6299F7aC) {
    +++ description: None
      receivedPermissions.0:
-        {"permission":"challenge","from":"eth:0x75fa114D4286c7d1114CE773EfF0f1bDe0aF966a","role":".challenger","via":[{"address":"eth:0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A"},{"address":"eth:0x126a736B18E0a64fBA19D421647A530E327E112C","condition":"though restricted to the SuperchainConfig's `pause()` function"}]}
      receivedPermissions.1.via.3.address:
-        "eth:0x126a736B18E0a64fBA19D421647A530E327E112C"
+        "eth:0x76fC2F971FB355D0453cF9F64d3F9E4f640E1754"
      receivedPermissions.1.via.2:
-        {"address":"eth:0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A"}
      receivedPermissions.1.via.1:
-        {"address":"eth:0xc6901F65369FC59fC1B4D6D6bE7A2318Ff38dB5B","condition":"if not revoked by the Security Council"}
      directlyReceivedPermissions.0.from:
-        "eth:0x126a736B18E0a64fBA19D421647A530E327E112C"
+        "eth:0x76fC2F971FB355D0453cF9F64d3F9E4f640E1754"
    }
```

```diff
    contract SuperchainConfig (0x95703e0982140D16f8ebA6d158FccEde42f04a4C) {
    +++ description: Used to manage global configuration values for multiple OP Chains within a single Superchain network. The SuperchainConfig contract manages individual pause states for each chain connected to it, as well as a global pause state for all chains. The guardian role can pause either separately, but each pause expires after 3 months if left untouched.
      template:
-        "opstack/SuperchainConfig"
+        "opstack/SuperchainConfig_expiry"
      sourceHashes.1:
-        "0x03dba37173051b02bc81487e181c791bcf1aef664c249e5d035f11f488bdd686"
+        "0x5a0e73c7d129cc83e1c387b55df0141890c02d2cb4111b8a1b6376d737d88f6b"
      description:
-        "Used to manage global configuration values for multiple OP Chains within a single Superchain network. The SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the Superchain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system."
+        "Used to manage global configuration values for multiple OP Chains within a single Superchain network. The SuperchainConfig contract manages individual pause states for each chain connected to it, as well as a global pause state for all chains. The guardian role can pause either separately, but each pause expires after 3 months if left untouched."
      values.$implementation:
-        "eth:0x4da82a327773965b8d4D85Fa3dB8249b387458E7"
+        "eth:0xCe28685EB204186b557133766eCA00334EB441E4"
      values.$pastUpgrades.4:
+        ["2025-07-24T17:47:23.000Z","0x46acdce174c8d83ebe2f208d8c76c867e75617483d64c3e407f69ae2f9868716",["eth:0xCe28685EB204186b557133766eCA00334EB441E4"]]
      values.$upgradeCount:
-        4
+        5
      values.GUARDIAN_SLOT:
-        "0xd30e835d3f35624761057ff5b27d558f97bd5be034621e62240e5c0b784abe68"
      values.PAUSED_SLOT:
-        "0x54176ff9944c4784e5857ec4e5ef560a462c483bf534eda43f91bb01a470b1b6"
      values.version:
-        "1.2.0"
+        "2.3.0"
      values.initVersion:
+        2
      values.pauseExpiry:
+        7884000
      values.pauseExpiryFmt:
+        "91d 6h"
      values.proxyAdmin:
+        "eth:0x543bA4AADBAb8f9025686Bd03993043599c6fB04"
      values.proxyAdminOwner:
+        "eth:0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A"
      implementationNames.eth:0x4da82a327773965b8d4D85Fa3dB8249b387458E7:
-        "SuperchainConfig"
      implementationNames.eth:0xCe28685EB204186b557133766eCA00334EB441E4:
+        "SuperchainConfig"
      fieldMeta:
+        {"paused":{"severity":"HIGH"}}
    }
```

```diff
    contract OpFoundationOperationsSafe (0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A) {
    +++ description: None
      values.getModules.0:
-        "eth:0x126a736B18E0a64fBA19D421647A530E327E112C"
      values.GnosisSafe_modules.0:
-        "eth:0x126a736B18E0a64fBA19D421647A530E327E112C"
      receivedPermissions.1:
-        {"permission":"guard","from":"eth:0x95703e0982140D16f8ebA6d158FccEde42f04a4C","role":".guardian","via":[{"address":"eth:0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2"},{"address":"eth:0xc6901F65369FC59fC1B4D6D6bE7A2318Ff38dB5B","condition":"if not revoked by the Security Council"}]}
      directlyReceivedPermissions:
-        [{"permission":"act","from":"eth:0xc6901F65369FC59fC1B4D6D6bE7A2318Ff38dB5B","role":".deputyGuardian","condition":"if not revoked by the Security Council"}]
    }
```

```diff
-   Status: DELETED
    contract DeputyGuardianModule (0xc6901F65369FC59fC1B4D6D6bE7A2318Ff38dB5B)
    +++ description: allows the eth:0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A, called the deputy guardian, to act on behalf of the Gnosis Safe.
```

```diff
+   Status: CREATED
    contract DeputyPauseModule (0x76fC2F971FB355D0453cF9F64d3F9E4f640E1754)
    +++ description: Allows eth:0x352f1defB49718e7Ea411687E850aA8d6299F7aC, called the deputy pauser, to act on behalf of the eth:0x847B5c174615B1B7fDF770882256e2D3E95b9D92 if set as its Safe module.
```

## Source code changes

```diff
.../DeputyGuardianModule.sol => /dev/null          | 156 -------
 .../DeputyPauseModule.sol                          |  87 ++--
 .../SuperchainConfig/SuperchainConfig.sol          | 487 ++++++++++++++++-----
 3 files changed, 395 insertions(+), 335 deletions(-)
```

Generated with discovered.json: 0x0ece9057301cf82a4153b67ca11412f2df0f4d3a

# Diff at Fri, 25 Jul 2025 13:51:51 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@85b717d6efe0c0a7691beb49532a0ce49bb7634a block: 22895942
- current block number: 22895942

## Description

templatize op upgrade 16 contracts

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22895942 (main branch discovery), not current.

```diff
    contract LivenessGuard (0x24424336F04440b1c28685a38303aC33C9D14a25) {
    +++ description: Modular contract to be used together with the LivenessModule. Tracks liveness / activity of Safe owners.
      template:
+        "gnosisSafeModules/LivenessGuard"
      description:
+        "Modular contract to be used together with the LivenessModule. Tracks liveness / activity of Safe owners."
    }
```

```diff
    EOA Optimism EOA 1 (0x352f1defB49718e7Ea411687E850aA8d6299F7aC) {
    +++ description: None
      receivedPermissions.0.via.1.condition:
-        "though restricted to the global pause function"
+        "though restricted to the SuperchainConfig's `pause()` function"
      receivedPermissions.1.via.3.condition:
-        "though restricted to the global pause function"
+        "though restricted to the SuperchainConfig's `pause()` function"
      directlyReceivedPermissions.0.condition:
-        "though restricted to the global pause function"
+        "though restricted to the SuperchainConfig's `pause()` function"
    }
```

Generated with discovered.json: 0x2ce517d712332a48c70bd34b3276673eacd75626

# Diff at Thu, 24 Jul 2025 16:48:25 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@a3f740c0fd51a5745c45d8f349ab01f4f33f7770 block: 22895942
- current block number: 22895942

## Description

set dispute game impl changes to high severity.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22895942 (main branch discovery), not current.

```diff
    contract DisputeGameFactory (0x6f13EFadABD9269D6cEAd22b448d434A1f1B433E) {
    +++ description: The dispute game factory allows the creation of dispute games, used to propose state roots and eventually challenge them.
      fieldMeta:
+        {"gameImpls":{"severity":"HIGH"},"game1337":{"severity":"HIGH"}}
    }
```

```diff
    contract OptimismPortal2 (0x8B34b14c7c7123459Cf3076b8Cb929BE097d0C07) {
    +++ description: The OptimismPortal contract is the main entry point to deposit funds from L1 to L2. It also allows to prove and finalize withdrawals. It specifies which game type can be used for withdrawals, which currently is the PermissionedDisputeGame.
      fieldMeta.respectedGameType:
+        {"severity":"HIGH"}
    }
```

Generated with discovered.json: 0xadbd98b3988cf72cf980cd2e76e5047afa1d7763

# Diff at Tue, 22 Jul 2025 14:10:07 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@d5d65d1883c757ae790bbd0a6f785c98310d2516 block: 22895942
- current block number: 22895942

## Description

Config: Kailua added to OptimismPortal2 and DisputeGameFactory.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22895942 (main branch discovery), not current.

```diff
    contract DisputeGameFactory (0x6f13EFadABD9269D6cEAd22b448d434A1f1B433E) {
    +++ description: The dispute game factory allows the creation of dispute games, used to propose state roots and eventually challenge them.
      values.game1337:
+        "eth:0x0000000000000000000000000000000000000000"
    }
```

```diff
    contract OptimismPortal2 (0x8B34b14c7c7123459Cf3076b8Cb929BE097d0C07) {
    +++ description: The OptimismPortal contract is the main entry point to deposit funds from L1 to L2. It also allows to prove and finalize withdrawals. It specifies which game type can be used for withdrawals, which currently is the PermissionedDisputeGame.
      usedTypes.0.arg.1337:
+        "KailuaGame"
    }
```

Generated with discovered.json: 0x98d654eecfedfabe951dcb0a9d962fbea7bc4409

# Diff at Mon, 14 Jul 2025 12:45:26 GMT:

- chain: ethereum
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
    EOA  (0x0aA384EB2fedD2741277A0f72909A0d7275575D7) {
    +++ description: None
      address:
-        "0x0aA384EB2fedD2741277A0f72909A0d7275575D7"
+        "eth:0x0aA384EB2fedD2741277A0f72909A0d7275575D7"
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
    EOA  (0x24E59d9d3Bd73ccC28Dc54062AF7EF7bFF58Bd67) {
    +++ description: None
      address:
-        "0x24E59d9d3Bd73ccC28Dc54062AF7EF7bFF58Bd67"
+        "eth:0x24E59d9d3Bd73ccC28Dc54062AF7EF7bFF58Bd67"
    }
```

```diff
    contract L1ERC721Bridge (0x2901dA832a4D0297FF0691100A8E496626cc626D) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      address:
-        "0x2901dA832a4D0297FF0691100A8E496626cc626D"
+        "eth:0x2901dA832a4D0297FF0691100A8E496626cc626D"
      values.$admin:
-        "0x470d87b1dae09a454A43D1fD772A561a03276aB7"
+        "eth:0x470d87b1dae09a454A43D1fD772A561a03276aB7"
      values.$implementation:
-        "0xAE2AF01232a6c4a4d3012C5eC5b1b35059caF10d"
+        "eth:0xAE2AF01232a6c4a4d3012C5eC5b1b35059caF10d"
      values.$pastUpgrades.0.2.0:
-        "0x8b91Af069928bA6591c950354d1EA29e08192Bf8"
+        "eth:0x8b91Af069928bA6591c950354d1EA29e08192Bf8"
      values.$pastUpgrades.1.2.0:
-        "0xd81f43eDBCAcb4c29a9bA38a13Ee5d79278270cC"
+        "eth:0xd81f43eDBCAcb4c29a9bA38a13Ee5d79278270cC"
      values.$pastUpgrades.2.2.0:
-        "0xAE2AF01232a6c4a4d3012C5eC5b1b35059caF10d"
+        "eth:0xAE2AF01232a6c4a4d3012C5eC5b1b35059caF10d"
      values.$pastUpgrades.3.2.0:
-        "0xd81f43eDBCAcb4c29a9bA38a13Ee5d79278270cC"
+        "eth:0xd81f43eDBCAcb4c29a9bA38a13Ee5d79278270cC"
      values.$pastUpgrades.4.2.0:
-        "0xAE2AF01232a6c4a4d3012C5eC5b1b35059caF10d"
+        "eth:0xAE2AF01232a6c4a4d3012C5eC5b1b35059caF10d"
      values.messenger:
-        "0x95bDCA6c8EdEB69C98Bd5bd17660BaCef1298A6f"
+        "eth:0x95bDCA6c8EdEB69C98Bd5bd17660BaCef1298A6f"
      values.MESSENGER:
-        "0x95bDCA6c8EdEB69C98Bd5bd17660BaCef1298A6f"
+        "eth:0x95bDCA6c8EdEB69C98Bd5bd17660BaCef1298A6f"
      values.OTHER_BRIDGE:
-        "0x4200000000000000000000000000000000000014"
+        "eth:0x4200000000000000000000000000000000000014"
      values.otherBridge:
-        "0x4200000000000000000000000000000000000014"
+        "eth:0x4200000000000000000000000000000000000014"
      values.superchainConfig:
-        "0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
+        "eth:0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
      implementationNames.0x2901dA832a4D0297FF0691100A8E496626cc626D:
-        "Proxy"
      implementationNames.0xAE2AF01232a6c4a4d3012C5eC5b1b35059caF10d:
-        "L1ERC721Bridge"
      implementationNames.eth:0x2901dA832a4D0297FF0691100A8E496626cc626D:
+        "Proxy"
      implementationNames.eth:0xAE2AF01232a6c4a4d3012C5eC5b1b35059caF10d:
+        "L1ERC721Bridge"
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
    contract ProxyAdmin (0x470d87b1dae09a454A43D1fD772A561a03276aB7) {
    +++ description: None
      address:
-        "0x470d87b1dae09a454A43D1fD772A561a03276aB7"
+        "eth:0x470d87b1dae09a454A43D1fD772A561a03276aB7"
      values.addressManager:
-        "0x50eF494573f28Cad6B64C31b7a00Cdaa48306e15"
+        "eth:0x50eF494573f28Cad6B64C31b7a00Cdaa48306e15"
      values.owner:
-        "0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A"
+        "eth:0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A"
      implementationNames.0x470d87b1dae09a454A43D1fD772A561a03276aB7:
-        "ProxyAdmin"
      implementationNames.eth:0x470d87b1dae09a454A43D1fD772A561a03276aB7:
+        "ProxyAdmin"
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
    contract AddressManager (0x50eF494573f28Cad6B64C31b7a00Cdaa48306e15) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      address:
-        "0x50eF494573f28Cad6B64C31b7a00Cdaa48306e15"
+        "eth:0x50eF494573f28Cad6B64C31b7a00Cdaa48306e15"
      values.owner:
-        "0x470d87b1dae09a454A43D1fD772A561a03276aB7"
+        "eth:0x470d87b1dae09a454A43D1fD772A561a03276aB7"
      implementationNames.0x50eF494573f28Cad6B64C31b7a00Cdaa48306e15:
-        "AddressManager"
      implementationNames.eth:0x50eF494573f28Cad6B64C31b7a00Cdaa48306e15:
+        "AddressManager"
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
    contract SystemConfig (0x5e6432F18Bc5d497B1Ab2288a025Fbf9D69E2221) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      address:
-        "0x5e6432F18Bc5d497B1Ab2288a025Fbf9D69E2221"
+        "eth:0x5e6432F18Bc5d497B1Ab2288a025Fbf9D69E2221"
      values.$admin:
-        "0x470d87b1dae09a454A43D1fD772A561a03276aB7"
+        "eth:0x470d87b1dae09a454A43D1fD772A561a03276aB7"
      values.$implementation:
-        "0xAB9d6cB7A427c0765163A7f45BB91cAfe5f2D375"
+        "eth:0xAB9d6cB7A427c0765163A7f45BB91cAfe5f2D375"
      values.$pastUpgrades.0.2.0:
-        "0x951754B08C52b2aC5d5a2aF1D52C2D12aED5Bcaf"
+        "eth:0x951754B08C52b2aC5d5a2aF1D52C2D12aED5Bcaf"
      values.$pastUpgrades.1.2.0:
-        "0xd81f43eDBCAcb4c29a9bA38a13Ee5d79278270cC"
+        "eth:0xd81f43eDBCAcb4c29a9bA38a13Ee5d79278270cC"
      values.$pastUpgrades.2.2.0:
-        "0xba2492e52F45651B60B8B38d4Ea5E2390C64Ffb1"
+        "eth:0xba2492e52F45651B60B8B38d4Ea5E2390C64Ffb1"
      values.$pastUpgrades.3.2.0:
-        "0xd81f43eDBCAcb4c29a9bA38a13Ee5d79278270cC"
+        "eth:0xd81f43eDBCAcb4c29a9bA38a13Ee5d79278270cC"
      values.$pastUpgrades.4.2.0:
-        "0xAB9d6cB7A427c0765163A7f45BB91cAfe5f2D375"
+        "eth:0xAB9d6cB7A427c0765163A7f45BB91cAfe5f2D375"
      values.$pastUpgrades.5.2.0:
-        "0xd81f43eDBCAcb4c29a9bA38a13Ee5d79278270cC"
+        "eth:0xd81f43eDBCAcb4c29a9bA38a13Ee5d79278270cC"
      values.$pastUpgrades.6.2.0:
-        "0xAB9d6cB7A427c0765163A7f45BB91cAfe5f2D375"
+        "eth:0xAB9d6cB7A427c0765163A7f45BB91cAfe5f2D375"
      values.batcherHash:
-        "0x99199a22125034c808ff20f377d91187E8050F2E"
+        "eth:0x99199a22125034c808ff20f377d91187E8050F2E"
      values.batchInbox:
-        "0x24E59d9d3Bd73ccC28Dc54062AF7EF7bFF58Bd67"
+        "eth:0x24E59d9d3Bd73ccC28Dc54062AF7EF7bFF58Bd67"
      values.disputeGameFactory:
-        "0x6f13EFadABD9269D6cEAd22b448d434A1f1B433E"
+        "eth:0x6f13EFadABD9269D6cEAd22b448d434A1f1B433E"
      values.gasPayingToken.addr_:
-        "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE"
+        "eth:0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE"
      values.l1CrossDomainMessenger:
-        "0x95bDCA6c8EdEB69C98Bd5bd17660BaCef1298A6f"
+        "eth:0x95bDCA6c8EdEB69C98Bd5bd17660BaCef1298A6f"
      values.l1ERC721Bridge:
-        "0x2901dA832a4D0297FF0691100A8E496626cc626D"
+        "eth:0x2901dA832a4D0297FF0691100A8E496626cc626D"
      values.l1StandardBridge:
-        "0x735aDBbE72226BD52e818E7181953f42E3b0FF21"
+        "eth:0x735aDBbE72226BD52e818E7181953f42E3b0FF21"
      values.optimismMintableERC20Factory:
-        "0x69216395A62dFb243C05EF4F1C27AF8655096a95"
+        "eth:0x69216395A62dFb243C05EF4F1C27AF8655096a95"
      values.optimismPortal:
-        "0x8B34b14c7c7123459Cf3076b8Cb929BE097d0C07"
+        "eth:0x8B34b14c7c7123459Cf3076b8Cb929BE097d0C07"
      values.owner:
-        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
+        "eth:0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      values.sequencerInbox:
-        "0x24E59d9d3Bd73ccC28Dc54062AF7EF7bFF58Bd67"
+        "eth:0x24E59d9d3Bd73ccC28Dc54062AF7EF7bFF58Bd67"
      values.unsafeBlockSigner:
-        "0xa7fA9CA4ac88686A542C0f830d7378eAB4A0278F"
+        "eth:0xa7fA9CA4ac88686A542C0f830d7378eAB4A0278F"
      implementationNames.0x5e6432F18Bc5d497B1Ab2288a025Fbf9D69E2221:
-        "Proxy"
      implementationNames.0xAB9d6cB7A427c0765163A7f45BB91cAfe5f2D375:
-        "SystemConfig"
      implementationNames.eth:0x5e6432F18Bc5d497B1Ab2288a025Fbf9D69E2221:
+        "Proxy"
      implementationNames.eth:0xAB9d6cB7A427c0765163A7f45BB91cAfe5f2D375:
+        "SystemConfig"
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
    EOA  (0x674F64D64Ddc198db83cd9047dF54BF89cCD0ddB) {
    +++ description: None
      address:
-        "0x674F64D64Ddc198db83cd9047dF54BF89cCD0ddB"
+        "eth:0x674F64D64Ddc198db83cd9047dF54BF89cCD0ddB"
    }
```

```diff
    contract OptimismMintableERC20Factory (0x69216395A62dFb243C05EF4F1C27AF8655096a95) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintableERC20 as this chain's representation of a token on the host chain, or vice-versa.
      address:
-        "0x69216395A62dFb243C05EF4F1C27AF8655096a95"
+        "eth:0x69216395A62dFb243C05EF4F1C27AF8655096a95"
      values.$admin:
-        "0x470d87b1dae09a454A43D1fD772A561a03276aB7"
+        "eth:0x470d87b1dae09a454A43D1fD772A561a03276aB7"
      values.$implementation:
-        "0xE01efbeb1089D1d1dB9c6c8b135C934C0734c846"
+        "eth:0xE01efbeb1089D1d1dB9c6c8b135C934C0734c846"
      values.$pastUpgrades.0.2.0:
-        "0xc0c6A811BBf07FA01b946F1C46a9A94c2eE8C73E"
+        "eth:0xc0c6A811BBf07FA01b946F1C46a9A94c2eE8C73E"
      values.$pastUpgrades.1.2.0:
-        "0xd81f43eDBCAcb4c29a9bA38a13Ee5d79278270cC"
+        "eth:0xd81f43eDBCAcb4c29a9bA38a13Ee5d79278270cC"
      values.$pastUpgrades.2.2.0:
-        "0xE01efbeb1089D1d1dB9c6c8b135C934C0734c846"
+        "eth:0xE01efbeb1089D1d1dB9c6c8b135C934C0734c846"
      values.$pastUpgrades.3.2.0:
-        "0xE01efbeb1089D1d1dB9c6c8b135C934C0734c846"
+        "eth:0xE01efbeb1089D1d1dB9c6c8b135C934C0734c846"
      values.bridge:
-        "0x735aDBbE72226BD52e818E7181953f42E3b0FF21"
+        "eth:0x735aDBbE72226BD52e818E7181953f42E3b0FF21"
      values.BRIDGE:
-        "0x735aDBbE72226BD52e818E7181953f42E3b0FF21"
+        "eth:0x735aDBbE72226BD52e818E7181953f42E3b0FF21"
      implementationNames.0x69216395A62dFb243C05EF4F1C27AF8655096a95:
-        "Proxy"
      implementationNames.0xE01efbeb1089D1d1dB9c6c8b135C934C0734c846:
-        "OptimismMintableERC20Factory"
      implementationNames.eth:0x69216395A62dFb243C05EF4F1C27AF8655096a95:
+        "Proxy"
      implementationNames.eth:0xE01efbeb1089D1d1dB9c6c8b135C934C0734c846:
+        "OptimismMintableERC20Factory"
    }
```

```diff
    contract DisputeGameFactory (0x6f13EFadABD9269D6cEAd22b448d434A1f1B433E) {
    +++ description: The dispute game factory allows the creation of dispute games, used to propose state roots and eventually challenge them.
      address:
-        "0x6f13EFadABD9269D6cEAd22b448d434A1f1B433E"
+        "eth:0x6f13EFadABD9269D6cEAd22b448d434A1f1B433E"
      values.$admin:
-        "0x470d87b1dae09a454A43D1fD772A561a03276aB7"
+        "eth:0x470d87b1dae09a454A43D1fD772A561a03276aB7"
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
-        "0x75fa114D4286c7d1114CE773EfF0f1bDe0aF966a"
+        "eth:0x75fa114D4286c7d1114CE773EfF0f1bDe0aF966a"
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
-        "0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A"
+        "eth:0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A"
      implementationNames.0x6f13EFadABD9269D6cEAd22b448d434A1f1B433E:
-        "Proxy"
      implementationNames.0xc641A33cab81C559F2bd4b21EA34C290E2440C2B:
-        "DisputeGameFactory"
      implementationNames.eth:0x6f13EFadABD9269D6cEAd22b448d434A1f1B433E:
+        "Proxy"
      implementationNames.eth:0xc641A33cab81C559F2bd4b21EA34C290E2440C2B:
+        "DisputeGameFactory"
    }
```

```diff
    contract L1StandardBridge (0x735aDBbE72226BD52e818E7181953f42E3b0FF21) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      address:
-        "0x735aDBbE72226BD52e818E7181953f42E3b0FF21"
+        "eth:0x735aDBbE72226BD52e818E7181953f42E3b0FF21"
      values.$admin:
-        "0x470d87b1dae09a454A43D1fD772A561a03276aB7"
+        "eth:0x470d87b1dae09a454A43D1fD772A561a03276aB7"
      values.$implementation:
-        "0x64B5a5Ed26DCb17370Ff4d33a8D503f0fbD06CfF"
+        "eth:0x64B5a5Ed26DCb17370Ff4d33a8D503f0fbD06CfF"
      values.l2TokenBridge:
-        "0x4200000000000000000000000000000000000010"
+        "eth:0x4200000000000000000000000000000000000010"
      values.messenger:
-        "0x95bDCA6c8EdEB69C98Bd5bd17660BaCef1298A6f"
+        "eth:0x95bDCA6c8EdEB69C98Bd5bd17660BaCef1298A6f"
      values.MESSENGER:
-        "0x95bDCA6c8EdEB69C98Bd5bd17660BaCef1298A6f"
+        "eth:0x95bDCA6c8EdEB69C98Bd5bd17660BaCef1298A6f"
      values.OTHER_BRIDGE:
-        "0x4200000000000000000000000000000000000010"
+        "eth:0x4200000000000000000000000000000000000010"
      values.otherBridge:
-        "0x4200000000000000000000000000000000000010"
+        "eth:0x4200000000000000000000000000000000000010"
      values.superchainConfig:
-        "0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
+        "eth:0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
      implementationNames.0x735aDBbE72226BD52e818E7181953f42E3b0FF21:
-        "L1ChugSplashProxy"
      implementationNames.0x64B5a5Ed26DCb17370Ff4d33a8D503f0fbD06CfF:
-        "L1StandardBridge"
      implementationNames.eth:0x735aDBbE72226BD52e818E7181953f42E3b0FF21:
+        "L1ChugSplashProxy"
      implementationNames.eth:0x64B5a5Ed26DCb17370Ff4d33a8D503f0fbD06CfF:
+        "L1StandardBridge"
    }
```

```diff
    contract PermissionedDisputeGame (0x75fa114D4286c7d1114CE773EfF0f1bDe0aF966a) {
    +++ description: Same as FaultDisputeGame, but only two permissioned addresses are designated as proposer and challenger.
      address:
-        "0x75fa114D4286c7d1114CE773EfF0f1bDe0aF966a"
+        "eth:0x75fa114D4286c7d1114CE773EfF0f1bDe0aF966a"
      values.anchorStateRegistry:
-        "0xbf1229eE0782939bB4325Fd13a0b481949e311Aa"
+        "eth:0xbf1229eE0782939bB4325Fd13a0b481949e311Aa"
      values.challenger:
-        "0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A"
+        "eth:0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A"
      values.gameCreator:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.l2BlockNumberChallenger:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.proposer:
-        "0x674F64D64Ddc198db83cd9047dF54BF89cCD0ddB"
+        "eth:0x674F64D64Ddc198db83cd9047dF54BF89cCD0ddB"
      values.vm:
-        "0x5fE03a12C1236F9C22Cb6479778DDAa4bce6299C"
+        "eth:0x5fE03a12C1236F9C22Cb6479778DDAa4bce6299C"
      values.weth:
-        "0xa29b6D87Ee95375E7a31374667054F38b920ab7a"
+        "eth:0xa29b6D87Ee95375E7a31374667054F38b920ab7a"
      implementationNames.0x75fa114D4286c7d1114CE773EfF0f1bDe0aF966a:
-        "PermissionedDisputeGame"
      implementationNames.eth:0x75fa114D4286c7d1114CE773EfF0f1bDe0aF966a:
+        "PermissionedDisputeGame"
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
    contract OptimismPortal2 (0x8B34b14c7c7123459Cf3076b8Cb929BE097d0C07) {
    +++ description: The OptimismPortal contract is the main entry point to deposit funds from L1 to L2. It also allows to prove and finalize withdrawals. It specifies which game type can be used for withdrawals, which currently is the PermissionedDisputeGame.
      address:
-        "0x8B34b14c7c7123459Cf3076b8Cb929BE097d0C07"
+        "eth:0x8B34b14c7c7123459Cf3076b8Cb929BE097d0C07"
      values.$admin:
-        "0x470d87b1dae09a454A43D1fD772A561a03276aB7"
+        "eth:0x470d87b1dae09a454A43D1fD772A561a03276aB7"
      values.$implementation:
-        "0xe2F826324b2faf99E513D16D266c3F80aE87832B"
+        "eth:0xe2F826324b2faf99E513D16D266c3F80aE87832B"
      values.$pastUpgrades.0.2.0:
-        "0xad3DC277d3242938F8Be18f0560e3d9B9988C46A"
+        "eth:0xad3DC277d3242938F8Be18f0560e3d9B9988C46A"
      values.$pastUpgrades.1.2.0:
-        "0xd81f43eDBCAcb4c29a9bA38a13Ee5d79278270cC"
+        "eth:0xd81f43eDBCAcb4c29a9bA38a13Ee5d79278270cC"
      values.$pastUpgrades.2.2.0:
-        "0x2D778797049FE9259d947D1ED8e5442226dFB589"
+        "eth:0x2D778797049FE9259d947D1ED8e5442226dFB589"
      values.$pastUpgrades.3.2.0:
-        "0x57e5AB742DDa19b60Fa2A43275722296B05A661A"
+        "eth:0x57e5AB742DDa19b60Fa2A43275722296B05A661A"
      values.$pastUpgrades.4.2.0:
-        "0x2D778797049FE9259d947D1ED8e5442226dFB589"
+        "eth:0x2D778797049FE9259d947D1ED8e5442226dFB589"
      values.$pastUpgrades.5.2.0:
-        "0x57e5AB742DDa19b60Fa2A43275722296B05A661A"
+        "eth:0x57e5AB742DDa19b60Fa2A43275722296B05A661A"
      values.$pastUpgrades.6.2.0:
-        "0x2D778797049FE9259d947D1ED8e5442226dFB589"
+        "eth:0x2D778797049FE9259d947D1ED8e5442226dFB589"
      values.$pastUpgrades.7.2.0:
-        "0xd81f43eDBCAcb4c29a9bA38a13Ee5d79278270cC"
+        "eth:0xd81f43eDBCAcb4c29a9bA38a13Ee5d79278270cC"
      values.$pastUpgrades.8.2.0:
-        "0xe2F826324b2faf99E513D16D266c3F80aE87832B"
+        "eth:0xe2F826324b2faf99E513D16D266c3F80aE87832B"
      values.disputeGameFactory:
-        "0x6f13EFadABD9269D6cEAd22b448d434A1f1B433E"
+        "eth:0x6f13EFadABD9269D6cEAd22b448d434A1f1B433E"
      values.guardian:
-        "0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2"
+        "eth:0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2"
      values.l2Sender:
-        "0x000000000000000000000000000000000000dEaD"
+        "eth:0x000000000000000000000000000000000000dEaD"
      values.superchainConfig:
-        "0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
+        "eth:0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
      values.systemConfig:
-        "0x5e6432F18Bc5d497B1Ab2288a025Fbf9D69E2221"
+        "eth:0x5e6432F18Bc5d497B1Ab2288a025Fbf9D69E2221"
      implementationNames.0x8B34b14c7c7123459Cf3076b8Cb929BE097d0C07:
-        "Proxy"
      implementationNames.0xe2F826324b2faf99E513D16D266c3F80aE87832B:
-        "OptimismPortal2"
      implementationNames.eth:0x8B34b14c7c7123459Cf3076b8Cb929BE097d0C07:
+        "Proxy"
      implementationNames.eth:0xe2F826324b2faf99E513D16D266c3F80aE87832B:
+        "OptimismPortal2"
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
    contract L1CrossDomainMessenger (0x95bDCA6c8EdEB69C98Bd5bd17660BaCef1298A6f) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      address:
-        "0x95bDCA6c8EdEB69C98Bd5bd17660BaCef1298A6f"
+        "eth:0x95bDCA6c8EdEB69C98Bd5bd17660BaCef1298A6f"
      values.$admin:
-        "0x470d87b1dae09a454A43D1fD772A561a03276aB7"
+        "eth:0x470d87b1dae09a454A43D1fD772A561a03276aB7"
      values.$implementation:
-        "0xD3494713A5cfaD3F5359379DfA074E2Ac8C6Fd65"
+        "eth:0xD3494713A5cfaD3F5359379DfA074E2Ac8C6Fd65"
      values.$pastUpgrades.0.2.0:
-        "0x95bDCA6c8EdEB69C98Bd5bd17660BaCef1298A6f"
+        "eth:0x95bDCA6c8EdEB69C98Bd5bd17660BaCef1298A6f"
      values.$pastUpgrades.1.2.0:
-        "0x14DdD08c0e28764FC89a266eC95A93619b0EE835"
+        "eth:0x14DdD08c0e28764FC89a266eC95A93619b0EE835"
      values.$pastUpgrades.2.2.0:
-        "0xd81f43eDBCAcb4c29a9bA38a13Ee5d79278270cC"
+        "eth:0xd81f43eDBCAcb4c29a9bA38a13Ee5d79278270cC"
      values.$pastUpgrades.3.2.0:
-        "0xD3494713A5cfaD3F5359379DfA074E2Ac8C6Fd65"
+        "eth:0xD3494713A5cfaD3F5359379DfA074E2Ac8C6Fd65"
      values.$pastUpgrades.4.2.0:
-        "0xd81f43eDBCAcb4c29a9bA38a13Ee5d79278270cC"
+        "eth:0xd81f43eDBCAcb4c29a9bA38a13Ee5d79278270cC"
      values.$pastUpgrades.5.2.0:
-        "0xD3494713A5cfaD3F5359379DfA074E2Ac8C6Fd65"
+        "eth:0xD3494713A5cfaD3F5359379DfA074E2Ac8C6Fd65"
      values.OTHER_MESSENGER:
-        "0x4200000000000000000000000000000000000007"
+        "eth:0x4200000000000000000000000000000000000007"
      values.otherMessenger:
-        "0x4200000000000000000000000000000000000007"
+        "eth:0x4200000000000000000000000000000000000007"
      values.portal:
-        "0x8B34b14c7c7123459Cf3076b8Cb929BE097d0C07"
+        "eth:0x8B34b14c7c7123459Cf3076b8Cb929BE097d0C07"
      values.PORTAL:
-        "0x8B34b14c7c7123459Cf3076b8Cb929BE097d0C07"
+        "eth:0x8B34b14c7c7123459Cf3076b8Cb929BE097d0C07"
      values.ResolvedDelegateProxy_addressManager:
-        "0x50eF494573f28Cad6B64C31b7a00Cdaa48306e15"
+        "eth:0x50eF494573f28Cad6B64C31b7a00Cdaa48306e15"
      values.superchainConfig:
-        "0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
+        "eth:0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
      implementationNames.0x95bDCA6c8EdEB69C98Bd5bd17660BaCef1298A6f:
-        "ResolvedDelegateProxy"
      implementationNames.0xD3494713A5cfaD3F5359379DfA074E2Ac8C6Fd65:
-        "L1CrossDomainMessenger"
      implementationNames.eth:0x95bDCA6c8EdEB69C98Bd5bd17660BaCef1298A6f:
+        "ResolvedDelegateProxy"
      implementationNames.eth:0xD3494713A5cfaD3F5359379DfA074E2Ac8C6Fd65:
+        "L1CrossDomainMessenger"
    }
```

```diff
    EOA  (0x99199a22125034c808ff20f377d91187E8050F2E) {
    +++ description: None
      address:
-        "0x99199a22125034c808ff20f377d91187E8050F2E"
+        "eth:0x99199a22125034c808ff20f377d91187E8050F2E"
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
    contract DelayedWETH (0xa29b6D87Ee95375E7a31374667054F38b920ab7a) {
    +++ description: Contract designed to hold the bonded ETH for each game. It is designed as a wrapper around WETH to allow an owner to function as a backstop if a game would incorrectly distribute funds.
      address:
-        "0xa29b6D87Ee95375E7a31374667054F38b920ab7a"
+        "eth:0xa29b6D87Ee95375E7a31374667054F38b920ab7a"
      values.$admin:
-        "0x470d87b1dae09a454A43D1fD772A561a03276aB7"
+        "eth:0x470d87b1dae09a454A43D1fD772A561a03276aB7"
      values.$implementation:
-        "0x71e966Ae981d1ce531a7b6d23DC0f27B38409087"
+        "eth:0x71e966Ae981d1ce531a7b6d23DC0f27B38409087"
      values.$pastUpgrades.0.2.0:
-        "0x71e966Ae981d1ce531a7b6d23DC0f27B38409087"
+        "eth:0x71e966Ae981d1ce531a7b6d23DC0f27B38409087"
      values.config:
-        "0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
+        "eth:0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
      values.owner:
-        "0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A"
+        "eth:0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A"
      implementationNames.0xa29b6D87Ee95375E7a31374667054F38b920ab7a:
-        "Proxy"
      implementationNames.0x71e966Ae981d1ce531a7b6d23DC0f27B38409087:
-        "DelayedWETH"
      implementationNames.eth:0xa29b6D87Ee95375E7a31374667054F38b920ab7a:
+        "Proxy"
      implementationNames.eth:0x71e966Ae981d1ce531a7b6d23DC0f27B38409087:
+        "DelayedWETH"
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
    EOA  (0xa7fA9CA4ac88686A542C0f830d7378eAB4A0278F) {
    +++ description: None
      address:
-        "0xa7fA9CA4ac88686A542C0f830d7378eAB4A0278F"
+        "eth:0xa7fA9CA4ac88686A542C0f830d7378eAB4A0278F"
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
    contract AnchorStateRegistry (0xbf1229eE0782939bB4325Fd13a0b481949e311Aa) {
    +++ description: Contains the latest confirmed state root that can be used as a starting point in a dispute game.
      address:
-        "0xbf1229eE0782939bB4325Fd13a0b481949e311Aa"
+        "eth:0xbf1229eE0782939bB4325Fd13a0b481949e311Aa"
      values.$admin:
-        "0x470d87b1dae09a454A43D1fD772A561a03276aB7"
+        "eth:0x470d87b1dae09a454A43D1fD772A561a03276aB7"
      values.$implementation:
-        "0xF027D5B39fB1Ca1A6143e63ea0Be3cc8b099aF7D"
+        "eth:0xF027D5B39fB1Ca1A6143e63ea0Be3cc8b099aF7D"
      values.$pastUpgrades.0.2.0:
-        "0xF027D5B39fB1Ca1A6143e63ea0Be3cc8b099aF7D"
+        "eth:0xF027D5B39fB1Ca1A6143e63ea0Be3cc8b099aF7D"
      values.disputeGameFactory:
-        "0x6f13EFadABD9269D6cEAd22b448d434A1f1B433E"
+        "eth:0x6f13EFadABD9269D6cEAd22b448d434A1f1B433E"
      values.superchainConfig:
-        "0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
+        "eth:0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
      implementationNames.0xbf1229eE0782939bB4325Fd13a0b481949e311Aa:
-        "Proxy"
      implementationNames.0xF027D5B39fB1Ca1A6143e63ea0Be3cc8b099aF7D:
-        "AnchorStateRegistry"
      implementationNames.eth:0xbf1229eE0782939bB4325Fd13a0b481949e311Aa:
+        "Proxy"
      implementationNames.eth:0xF027D5B39fB1Ca1A6143e63ea0Be3cc8b099aF7D:
+        "AnchorStateRegistry"
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
    contract L1ERC721Bridge (0x2901dA832a4D0297FF0691100A8E496626cc626D)
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
```

```diff
+   Status: CREATED
    contract GnosisSafe (0x42d27eEA1AD6e22Af6284F609847CB3Cd56B9c64)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x470d87b1dae09a454A43D1fD772A561a03276aB7)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Conduit Multisig 1 (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746)
    +++ description: None
```

```diff
+   Status: CREATED
    contract AddressManager (0x50eF494573f28Cad6B64C31b7a00Cdaa48306e15)
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
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
    contract SystemConfig (0x5e6432F18Bc5d497B1Ab2288a025Fbf9D69E2221)
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
```

```diff
+   Status: CREATED
    contract MIPS (0x5fE03a12C1236F9C22Cb6479778DDAa4bce6299C)
    +++ description: The MIPS contract is used to execute the final step of the dispute game which objectively determines the winner of the dispute.
```

```diff
+   Status: CREATED
    contract OptimismMintableERC20Factory (0x69216395A62dFb243C05EF4F1C27AF8655096a95)
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintableERC20 as this chain's representation of a token on the host chain, or vice-versa.
```

```diff
+   Status: CREATED
    contract DisputeGameFactory (0x6f13EFadABD9269D6cEAd22b448d434A1f1B433E)
    +++ description: The dispute game factory allows the creation of dispute games, used to propose state roots and eventually challenge them.
```

```diff
+   Status: CREATED
    contract L1StandardBridge (0x735aDBbE72226BD52e818E7181953f42E3b0FF21)
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
```

```diff
+   Status: CREATED
    contract PermissionedDisputeGame (0x75fa114D4286c7d1114CE773EfF0f1bDe0aF966a)
    +++ description: Same as FaultDisputeGame, but only two permissioned addresses are designated as proposer and challenger.
```

```diff
+   Status: CREATED
    contract OpFoundationUpgradeSafe (0x847B5c174615B1B7fDF770882256e2D3E95b9D92)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OptimismPortal2 (0x8B34b14c7c7123459Cf3076b8Cb929BE097d0C07)
    +++ description: The OptimismPortal contract is the main entry point to deposit funds from L1 to L2. It also allows to prove and finalize withdrawals. It specifies which game type can be used for withdrawals, which currently is the PermissionedDisputeGame.
```

```diff
+   Status: CREATED
    contract SuperchainConfig (0x95703e0982140D16f8ebA6d158FccEde42f04a4C)
    +++ description: Used to manage global configuration values for multiple OP Chains within a single Superchain network. The SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the Superchain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
```

```diff
+   Status: CREATED
    contract L1CrossDomainMessenger (0x95bDCA6c8EdEB69C98Bd5bd17660BaCef1298A6f)
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
```

```diff
+   Status: CREATED
    contract OpFoundationOperationsSafe (0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A)
    +++ description: None
```

```diff
+   Status: CREATED
    contract PreimageOracle (0x9c065e11870B891D214Bc2Da7EF1f9DDFA1BE277)
    +++ description: The PreimageOracle contract is used to load the required data from L1 for a dispute game.
```

```diff
+   Status: CREATED
    contract DelayedWETH (0xa29b6D87Ee95375E7a31374667054F38b920ab7a)
    +++ description: Contract designed to hold the bonded ETH for each game. It is designed as a wrapper around WETH to allow an owner to function as a backstop if a game would incorrectly distribute funds.
```

```diff
+   Status: CREATED
    contract AnchorStateRegistry (0xbf1229eE0782939bB4325Fd13a0b481949e311Aa)
    +++ description: Contains the latest confirmed state root that can be used as a starting point in a dispute game.
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

Generated with discovered.json: 0x8ab0f72f623b0c3d2bdd7c3403273fdd6b948394

# Diff at Mon, 14 Jul 2025 08:02:45 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@0dc82cd5064c9c6dc9fb20e2291a8bb6b2048e27 block: 22895942
- current block number: 22895942

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22895942 (main branch discovery), not current.

```diff
    contract OptimismMintableERC20Factory (0x69216395A62dFb243C05EF4F1C27AF8655096a95) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintableERC20 as this chain's representation of a token on the host chain, or vice-versa.
      description:
-        "A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa."
+        "A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintableERC20 as this chain's representation of a token on the host chain, or vice-versa."
    }
```

Generated with discovered.json: 0xe9e715d8d5861bce2f58528e2027e838c1a926ae

# Diff at Fri, 04 Jul 2025 12:19:09 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f56dc47fe915564d4555300304da4d3bcbc087f block: 22716369
- current block number: 22716369

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22716369 (main branch discovery), not current.

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
-        "ethereum:0x75fa114D4286c7d1114CE773EfF0f1bDe0aF966a"
+        "eth:0x75fa114D4286c7d1114CE773EfF0f1bDe0aF966a"
      receivedPermissions.1.via.3.address:
-        "ethereum:0x126a736B18E0a64fBA19D421647A530E327E112C"
+        "eth:0x126a736B18E0a64fBA19D421647A530E327E112C"
      receivedPermissions.1.via.2.address:
-        "ethereum:0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A"
+        "eth:0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A"
      receivedPermissions.1.via.1.address:
-        "ethereum:0xc6901F65369FC59fC1B4D6D6bE7A2318Ff38dB5B"
+        "eth:0xc6901F65369FC59fC1B4D6D6bE7A2318Ff38dB5B"
      receivedPermissions.1.via.0.address:
-        "ethereum:0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2"
+        "eth:0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2"
      receivedPermissions.1.from:
-        "ethereum:0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
+        "eth:0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
      directlyReceivedPermissions.0.from:
-        "ethereum:0x126a736B18E0a64fBA19D421647A530E327E112C"
+        "eth:0x126a736B18E0a64fBA19D421647A530E327E112C"
    }
```

```diff
    contract ProxyAdmin (0x470d87b1dae09a454A43D1fD772A561a03276aB7) {
    +++ description: None
      directlyReceivedPermissions.0.from:
-        "ethereum:0x50eF494573f28Cad6B64C31b7a00Cdaa48306e15"
+        "eth:0x50eF494573f28Cad6B64C31b7a00Cdaa48306e15"
      directlyReceivedPermissions.1.from:
-        "ethereum:0x2901dA832a4D0297FF0691100A8E496626cc626D"
+        "eth:0x2901dA832a4D0297FF0691100A8E496626cc626D"
      directlyReceivedPermissions.2.from:
-        "ethereum:0x5e6432F18Bc5d497B1Ab2288a025Fbf9D69E2221"
+        "eth:0x5e6432F18Bc5d497B1Ab2288a025Fbf9D69E2221"
      directlyReceivedPermissions.3.from:
-        "ethereum:0x69216395A62dFb243C05EF4F1C27AF8655096a95"
+        "eth:0x69216395A62dFb243C05EF4F1C27AF8655096a95"
      directlyReceivedPermissions.4.from:
-        "ethereum:0x6f13EFadABD9269D6cEAd22b448d434A1f1B433E"
+        "eth:0x6f13EFadABD9269D6cEAd22b448d434A1f1B433E"
      directlyReceivedPermissions.5.from:
-        "ethereum:0x735aDBbE72226BD52e818E7181953f42E3b0FF21"
+        "eth:0x735aDBbE72226BD52e818E7181953f42E3b0FF21"
      directlyReceivedPermissions.6.from:
-        "ethereum:0x8B34b14c7c7123459Cf3076b8Cb929BE097d0C07"
+        "eth:0x8B34b14c7c7123459Cf3076b8Cb929BE097d0C07"
      directlyReceivedPermissions.7.from:
-        "ethereum:0x95bDCA6c8EdEB69C98Bd5bd17660BaCef1298A6f"
+        "eth:0x95bDCA6c8EdEB69C98Bd5bd17660BaCef1298A6f"
      directlyReceivedPermissions.8.from:
-        "ethereum:0xa29b6D87Ee95375E7a31374667054F38b920ab7a"
+        "eth:0xa29b6D87Ee95375E7a31374667054F38b920ab7a"
      directlyReceivedPermissions.9.from:
-        "ethereum:0xbf1229eE0782939bB4325Fd13a0b481949e311Aa"
+        "eth:0xbf1229eE0782939bB4325Fd13a0b481949e311Aa"
    }
```

```diff
    contract Conduit Multisig 1 (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0x5e6432F18Bc5d497B1Ab2288a025Fbf9D69E2221"
+        "eth:0x5e6432F18Bc5d497B1Ab2288a025Fbf9D69E2221"
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
-        "ethereum:0x470d87b1dae09a454A43D1fD772A561a03276aB7"
+        "eth:0x470d87b1dae09a454A43D1fD772A561a03276aB7"
      receivedPermissions.0.from:
-        "ethereum:0x50eF494573f28Cad6B64C31b7a00Cdaa48306e15"
+        "eth:0x50eF494573f28Cad6B64C31b7a00Cdaa48306e15"
      receivedPermissions.1.from:
-        "ethereum:0xa29b6D87Ee95375E7a31374667054F38b920ab7a"
+        "eth:0xa29b6D87Ee95375E7a31374667054F38b920ab7a"
      receivedPermissions.2.via.0.address:
-        "ethereum:0x543bA4AADBAb8f9025686Bd03993043599c6fB04"
+        "eth:0x543bA4AADBAb8f9025686Bd03993043599c6fB04"
      receivedPermissions.2.from:
-        "ethereum:0xdE1FCfB0851916CA5101820A69b13a4E276bd81F"
+        "eth:0xdE1FCfB0851916CA5101820A69b13a4E276bd81F"
      receivedPermissions.3.via.0.address:
-        "ethereum:0x470d87b1dae09a454A43D1fD772A561a03276aB7"
+        "eth:0x470d87b1dae09a454A43D1fD772A561a03276aB7"
      receivedPermissions.3.from:
-        "ethereum:0x2901dA832a4D0297FF0691100A8E496626cc626D"
+        "eth:0x2901dA832a4D0297FF0691100A8E496626cc626D"
      receivedPermissions.4.via.0.address:
-        "ethereum:0x470d87b1dae09a454A43D1fD772A561a03276aB7"
+        "eth:0x470d87b1dae09a454A43D1fD772A561a03276aB7"
      receivedPermissions.4.from:
-        "ethereum:0x5e6432F18Bc5d497B1Ab2288a025Fbf9D69E2221"
+        "eth:0x5e6432F18Bc5d497B1Ab2288a025Fbf9D69E2221"
      receivedPermissions.5.via.0.address:
-        "ethereum:0x470d87b1dae09a454A43D1fD772A561a03276aB7"
+        "eth:0x470d87b1dae09a454A43D1fD772A561a03276aB7"
      receivedPermissions.5.from:
-        "ethereum:0x69216395A62dFb243C05EF4F1C27AF8655096a95"
+        "eth:0x69216395A62dFb243C05EF4F1C27AF8655096a95"
      receivedPermissions.6.via.0.address:
-        "ethereum:0x470d87b1dae09a454A43D1fD772A561a03276aB7"
+        "eth:0x470d87b1dae09a454A43D1fD772A561a03276aB7"
      receivedPermissions.6.from:
-        "ethereum:0x6f13EFadABD9269D6cEAd22b448d434A1f1B433E"
+        "eth:0x6f13EFadABD9269D6cEAd22b448d434A1f1B433E"
      receivedPermissions.7.via.0.address:
-        "ethereum:0x470d87b1dae09a454A43D1fD772A561a03276aB7"
+        "eth:0x470d87b1dae09a454A43D1fD772A561a03276aB7"
      receivedPermissions.7.from:
-        "ethereum:0x735aDBbE72226BD52e818E7181953f42E3b0FF21"
+        "eth:0x735aDBbE72226BD52e818E7181953f42E3b0FF21"
      receivedPermissions.8.via.0.address:
-        "ethereum:0x470d87b1dae09a454A43D1fD772A561a03276aB7"
+        "eth:0x470d87b1dae09a454A43D1fD772A561a03276aB7"
      receivedPermissions.8.from:
-        "ethereum:0x8B34b14c7c7123459Cf3076b8Cb929BE097d0C07"
+        "eth:0x8B34b14c7c7123459Cf3076b8Cb929BE097d0C07"
      receivedPermissions.9.via.0.address:
-        "ethereum:0x543bA4AADBAb8f9025686Bd03993043599c6fB04"
+        "eth:0x543bA4AADBAb8f9025686Bd03993043599c6fB04"
      receivedPermissions.9.from:
-        "ethereum:0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
+        "eth:0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
      receivedPermissions.10.via.0.address:
-        "ethereum:0x470d87b1dae09a454A43D1fD772A561a03276aB7"
+        "eth:0x470d87b1dae09a454A43D1fD772A561a03276aB7"
      receivedPermissions.10.from:
-        "ethereum:0x95bDCA6c8EdEB69C98Bd5bd17660BaCef1298A6f"
+        "eth:0x95bDCA6c8EdEB69C98Bd5bd17660BaCef1298A6f"
      receivedPermissions.11.via.0.address:
-        "ethereum:0x470d87b1dae09a454A43D1fD772A561a03276aB7"
+        "eth:0x470d87b1dae09a454A43D1fD772A561a03276aB7"
      receivedPermissions.11.from:
-        "ethereum:0xa29b6D87Ee95375E7a31374667054F38b920ab7a"
+        "eth:0xa29b6D87Ee95375E7a31374667054F38b920ab7a"
      receivedPermissions.12.via.0.address:
-        "ethereum:0x470d87b1dae09a454A43D1fD772A561a03276aB7"
+        "eth:0x470d87b1dae09a454A43D1fD772A561a03276aB7"
      receivedPermissions.12.from:
-        "ethereum:0xbf1229eE0782939bB4325Fd13a0b481949e311Aa"
+        "eth:0xbf1229eE0782939bB4325Fd13a0b481949e311Aa"
      directlyReceivedPermissions.0.from:
-        "ethereum:0x470d87b1dae09a454A43D1fD772A561a03276aB7"
+        "eth:0x470d87b1dae09a454A43D1fD772A561a03276aB7"
      directlyReceivedPermissions.1.from:
-        "ethereum:0x543bA4AADBAb8f9025686Bd03993043599c6fB04"
+        "eth:0x543bA4AADBAb8f9025686Bd03993043599c6fB04"
    }
```

```diff
    EOA  (0x674F64D64Ddc198db83cd9047dF54BF89cCD0ddB) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0x75fa114D4286c7d1114CE773EfF0f1bDe0aF966a"
+        "eth:0x75fa114D4286c7d1114CE773EfF0f1bDe0aF966a"
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
    EOA  (0x99199a22125034c808ff20f377d91187E8050F2E) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0x5e6432F18Bc5d497B1Ab2288a025Fbf9D69E2221"
+        "eth:0x5e6432F18Bc5d497B1Ab2288a025Fbf9D69E2221"
    }
```

```diff
    contract OpFoundationOperationsSafe (0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0x75fa114D4286c7d1114CE773EfF0f1bDe0aF966a"
+        "eth:0x75fa114D4286c7d1114CE773EfF0f1bDe0aF966a"
      receivedPermissions.1.via.1.address:
-        "ethereum:0xc6901F65369FC59fC1B4D6D6bE7A2318Ff38dB5B"
+        "eth:0xc6901F65369FC59fC1B4D6D6bE7A2318Ff38dB5B"
      receivedPermissions.1.via.0.address:
-        "ethereum:0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2"
+        "eth:0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2"
      receivedPermissions.1.from:
-        "ethereum:0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
+        "eth:0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
      directlyReceivedPermissions.0.from:
-        "ethereum:0xc6901F65369FC59fC1B4D6D6bE7A2318Ff38dB5B"
+        "eth:0xc6901F65369FC59fC1B4D6D6bE7A2318Ff38dB5B"
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

Generated with discovered.json: 0xd7ce231d6f7929de3890e2b9042dff85caf3ad02

# Diff at Mon, 16 Jun 2025 10:05:50 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@e1208475abce20cea1768d2e4878c03350c1b7c9 block: 22615671
- current block number: 22716369

## Description

Upgrade to permissioned fault proofs (opfp) and optimism governance.

## Watched changes

```diff
    contract Optimism Guardian Multisig (0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2) {
    +++ description: None
      directlyReceivedPermissions.2:
-        {"permission":"guard","from":"ethereum:0x8B34b14c7c7123459Cf3076b8Cb929BE097d0C07","role":".GUARDIAN"}
      directlyReceivedPermissions.1:
-        {"permission":"guard","from":"ethereum:0x95703e0982140D16f8ebA6d158FccEde42f04a4C","role":".guardian"}
      directlyReceivedPermissions.0.from:
-        "ethereum:0x8B34b14c7c7123459Cf3076b8Cb929BE097d0C07"
+        "ethereum:0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
    }
```

```diff
    contract L1ERC721Bridge (0x2901dA832a4D0297FF0691100A8E496626cc626D) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      values.$pastUpgrades.4:
+        ["2024-04-19T18:22:11.000Z","0xfd62d0d284c8655e916a5cdd2472b461ed5686ab1414b834a1ffdb06a44f63b4",["0xAE2AF01232a6c4a4d3012C5eC5b1b35059caF10d"]]
      values.$pastUpgrades.3:
+        ["2024-04-19T18:22:11.000Z","0xfd62d0d284c8655e916a5cdd2472b461ed5686ab1414b834a1ffdb06a44f63b4",["0xd81f43eDBCAcb4c29a9bA38a13Ee5d79278270cC"]]
      values.$pastUpgrades.2.2:
-        "0xfd62d0d284c8655e916a5cdd2472b461ed5686ab1414b834a1ffdb06a44f63b4"
+        "2025-06-13T14:31:59.000Z"
      values.$pastUpgrades.2.1:
-        ["0xAE2AF01232a6c4a4d3012C5eC5b1b35059caF10d"]
+        "0xd8fd08e0a66a0f5c0e5aed4e078e77bf8c3e50c27d09db458e2b04e7c6b2f5e7"
      values.$pastUpgrades.2.0:
-        "2024-04-19T18:22:11.000Z"
+        ["0xd81f43eDBCAcb4c29a9bA38a13Ee5d79278270cC"]
      values.$pastUpgrades.1.2:
-        "0xfd62d0d284c8655e916a5cdd2472b461ed5686ab1414b834a1ffdb06a44f63b4"
+        "2025-06-13T14:31:59.000Z"
      values.$pastUpgrades.1.1:
-        "2024-04-19T18:22:11.000Z"
+        ["0xAE2AF01232a6c4a4d3012C5eC5b1b35059caF10d"]
      values.$pastUpgrades.1.0:
-        ["0xd81f43eDBCAcb4c29a9bA38a13Ee5d79278270cC"]
+        "0xd8fd08e0a66a0f5c0e5aed4e078e77bf8c3e50c27d09db458e2b04e7c6b2f5e7"
      values.$upgradeCount:
-        3
+        5
    }
```

```diff
-   Status: DELETED
    contract Mode Multisig (0x309Fe2536d01867018D120b40e4676723C53A14C)
    +++ description: None
```

```diff
    EOA Optimism EOA 1 (0x352f1defB49718e7Ea411687E850aA8d6299F7aC) {
    +++ description: None
      receivedPermissions.2:
-        {"permission":"guard","from":"ethereum:0x8B34b14c7c7123459Cf3076b8Cb929BE097d0C07","role":".GUARDIAN","via":[{"address":"ethereum:0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2"},{"address":"ethereum:0xc6901F65369FC59fC1B4D6D6bE7A2318Ff38dB5B","condition":"if not revoked by the Security Council"},{"address":"ethereum:0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A"},{"address":"ethereum:0x126a736B18E0a64fBA19D421647A530E327E112C","condition":"though restricted to the global pause function"}]}
      receivedPermissions.1.permission:
-        "guard"
+        "challenge"
      receivedPermissions.1.from:
-        "ethereum:0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
+        "ethereum:0x75fa114D4286c7d1114CE773EfF0f1bDe0aF966a"
      receivedPermissions.1.role:
-        ".guardian"
+        ".challenger"
      receivedPermissions.1.via.3:
-        {"address":"ethereum:0xc6901F65369FC59fC1B4D6D6bE7A2318Ff38dB5B","condition":"if not revoked by the Security Council"}
      receivedPermissions.1.via.2:
-        {"address":"ethereum:0x126a736B18E0a64fBA19D421647A530E327E112C","condition":"though restricted to the global pause function"}
      receivedPermissions.1.via.1.address:
-        "ethereum:0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2"
+        "ethereum:0x126a736B18E0a64fBA19D421647A530E327E112C"
      receivedPermissions.1.via.1.condition:
+        "though restricted to the global pause function"
      receivedPermissions.0.from:
-        "ethereum:0x8B34b14c7c7123459Cf3076b8Cb929BE097d0C07"
+        "ethereum:0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
    }
```

```diff
-   Status: DELETED
    contract L2OutputOracle (0x4317ba146D4933D889518a3e5E11Fe7a53199b04)
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
```

```diff
    contract ProxyAdmin (0x470d87b1dae09a454A43D1fD772A561a03276aB7) {
    +++ description: None
      directlyReceivedPermissions.9:
+        {"permission":"upgrade","from":"ethereum:0xa29b6D87Ee95375E7a31374667054F38b920ab7a","role":"admin"}
      directlyReceivedPermissions.8:
+        {"permission":"upgrade","from":"ethereum:0x2901dA832a4D0297FF0691100A8E496626cc626D","role":"admin"}
      directlyReceivedPermissions.7.from:
-        "ethereum:0x2901dA832a4D0297FF0691100A8E496626cc626D"
+        "ethereum:0x6f13EFadABD9269D6cEAd22b448d434A1f1B433E"
      directlyReceivedPermissions.6.from:
-        "ethereum:0x4317ba146D4933D889518a3e5E11Fe7a53199b04"
+        "ethereum:0xbf1229eE0782939bB4325Fd13a0b481949e311Aa"
    }
```

```diff
    contract SuperchainProxyAdminOwner (0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A) {
    +++ description: None
      receivedPermissions.12:
+        {"permission":"upgrade","from":"ethereum:0xa29b6D87Ee95375E7a31374667054F38b920ab7a","role":"admin","via":[{"address":"ethereum:0x470d87b1dae09a454A43D1fD772A561a03276aB7"}]}
      receivedPermissions.11:
+        {"permission":"upgrade","from":"ethereum:0x2901dA832a4D0297FF0691100A8E496626cc626D","role":"admin","via":[{"address":"ethereum:0x470d87b1dae09a454A43D1fD772A561a03276aB7"}]}
      receivedPermissions.10:
+        {"permission":"upgrade","from":"ethereum:0x95703e0982140D16f8ebA6d158FccEde42f04a4C","role":"admin","via":[{"address":"ethereum:0x543bA4AADBAb8f9025686Bd03993043599c6fB04"}]}
      receivedPermissions.9.from:
-        "ethereum:0x2901dA832a4D0297FF0691100A8E496626cc626D"
+        "ethereum:0x6f13EFadABD9269D6cEAd22b448d434A1f1B433E"
      receivedPermissions.8.from:
-        "ethereum:0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
+        "ethereum:0xbf1229eE0782939bB4325Fd13a0b481949e311Aa"
      receivedPermissions.8.via.0.address:
-        "ethereum:0x543bA4AADBAb8f9025686Bd03993043599c6fB04"
+        "ethereum:0x470d87b1dae09a454A43D1fD772A561a03276aB7"
      receivedPermissions.7.from:
-        "ethereum:0x4317ba146D4933D889518a3e5E11Fe7a53199b04"
+        "ethereum:0x95bDCA6c8EdEB69C98Bd5bd17660BaCef1298A6f"
      receivedPermissions.6.permission:
-        "upgrade"
+        "interact"
      receivedPermissions.6.from:
-        "ethereum:0x95bDCA6c8EdEB69C98Bd5bd17660BaCef1298A6f"
+        "ethereum:0xa29b6D87Ee95375E7a31374667054F38b920ab7a"
      receivedPermissions.6.role:
-        "admin"
+        ".owner"
      receivedPermissions.6.via:
-        [{"address":"ethereum:0x470d87b1dae09a454A43D1fD772A561a03276aB7"}]
      receivedPermissions.6.description:
+        "can pull funds from the contract in case of emergency."
    }
```

```diff
    contract SystemConfig (0x5e6432F18Bc5d497B1Ab2288a025Fbf9D69E2221) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      values.$pastUpgrades.6:
+        ["2024-04-19T18:22:11.000Z","0xfd62d0d284c8655e916a5cdd2472b461ed5686ab1414b834a1ffdb06a44f63b4",["0xd81f43eDBCAcb4c29a9bA38a13Ee5d79278270cC"]]
      values.$pastUpgrades.5:
+        ["2024-04-19T18:22:11.000Z","0xfd62d0d284c8655e916a5cdd2472b461ed5686ab1414b834a1ffdb06a44f63b4",["0xba2492e52F45651B60B8B38d4Ea5E2390C64Ffb1"]]
      values.$pastUpgrades.4.2:
-        "0xfd62d0d284c8655e916a5cdd2472b461ed5686ab1414b834a1ffdb06a44f63b4"
+        "2025-06-13T14:31:59.000Z"
      values.$pastUpgrades.4.1:
-        "2024-04-19T18:22:11.000Z"
+        "0xd8fd08e0a66a0f5c0e5aed4e078e77bf8c3e50c27d09db458e2b04e7c6b2f5e7"
      values.$pastUpgrades.3.2:
-        "0xfd62d0d284c8655e916a5cdd2472b461ed5686ab1414b834a1ffdb06a44f63b4"
+        "2025-01-24T14:41:35.000Z"
      values.$pastUpgrades.3.1:
-        "2024-04-19T18:22:11.000Z"
+        ["0xAB9d6cB7A427c0765163A7f45BB91cAfe5f2D375"]
      values.$pastUpgrades.3.0:
-        ["0xba2492e52F45651B60B8B38d4Ea5E2390C64Ffb1"]
+        "0x86da7386a26978c3db89e97c1f4feee613a8a0c07bbe4640624b05276f49c350"
      values.$pastUpgrades.2.1:
-        ["0xAB9d6cB7A427c0765163A7f45BB91cAfe5f2D375"]
+        "0x86da7386a26978c3db89e97c1f4feee613a8a0c07bbe4640624b05276f49c350"
      values.$pastUpgrades.2.0:
-        "0x86da7386a26978c3db89e97c1f4feee613a8a0c07bbe4640624b05276f49c350"
+        ["0xd81f43eDBCAcb4c29a9bA38a13Ee5d79278270cC"]
      values.$pastUpgrades.1.2:
-        "2025-01-24T14:41:35.000Z"
+        "2025-06-13T14:31:59.000Z"
      values.$pastUpgrades.1.1:
-        "0x86da7386a26978c3db89e97c1f4feee613a8a0c07bbe4640624b05276f49c350"
+        ["0xAB9d6cB7A427c0765163A7f45BB91cAfe5f2D375"]
      values.$pastUpgrades.1.0:
-        ["0xd81f43eDBCAcb4c29a9bA38a13Ee5d79278270cC"]
+        "0xd8fd08e0a66a0f5c0e5aed4e078e77bf8c3e50c27d09db458e2b04e7c6b2f5e7"
      values.$upgradeCount:
-        5
+        7
      values.disputeGameFactory:
-        "0x0000000000000000000000000000000000000000"
+        "0x6f13EFadABD9269D6cEAd22b448d434A1f1B433E"
    }
```

```diff
    EOA  (0x674F64D64Ddc198db83cd9047dF54BF89cCD0ddB) {
    +++ description: None
      receivedPermissions.1:
-        {"permission":"propose","from":"ethereum:0x4317ba146D4933D889518a3e5E11Fe7a53199b04","role":".proposer"}
      receivedPermissions.0.from:
-        "ethereum:0x4317ba146D4933D889518a3e5E11Fe7a53199b04"
+        "ethereum:0x75fa114D4286c7d1114CE773EfF0f1bDe0aF966a"
      receivedPermissions.0.role:
-        ".PROPOSER"
+        ".proposer"
    }
```

```diff
    contract OptimismMintableERC20Factory (0x69216395A62dFb243C05EF4F1C27AF8655096a95) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      values.$pastUpgrades.3:
+        ["2024-04-19T18:22:11.000Z","0xfd62d0d284c8655e916a5cdd2472b461ed5686ab1414b834a1ffdb06a44f63b4",["0xE01efbeb1089D1d1dB9c6c8b135C934C0734c846"]]
      values.$pastUpgrades.2.0.0:
-        "0xE01efbeb1089D1d1dB9c6c8b135C934C0734c846"
+        "0xd81f43eDBCAcb4c29a9bA38a13Ee5d79278270cC"
      values.$pastUpgrades.1.2:
-        "0xfd62d0d284c8655e916a5cdd2472b461ed5686ab1414b834a1ffdb06a44f63b4"
+        "2025-06-13T14:31:59.000Z"
      values.$pastUpgrades.1.1:
-        "2024-04-19T18:22:11.000Z"
+        ["0xE01efbeb1089D1d1dB9c6c8b135C934C0734c846"]
      values.$pastUpgrades.1.0:
-        ["0xd81f43eDBCAcb4c29a9bA38a13Ee5d79278270cC"]
+        "0xd8fd08e0a66a0f5c0e5aed4e078e77bf8c3e50c27d09db458e2b04e7c6b2f5e7"
      values.$upgradeCount:
-        3
+        4
    }
```

```diff
    contract OpFoundationUpgradeSafe (0x847B5c174615B1B7fDF770882256e2D3E95b9D92) {
    +++ description: None
      receivedPermissions.2:
-        {"permission":"guard","from":"ethereum:0x8B34b14c7c7123459Cf3076b8Cb929BE097d0C07","role":".GUARDIAN","via":[{"address":"ethereum:0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2"},{"address":"ethereum:0xc2819DC788505Aac350142A7A707BF9D03E3Bd03"},{"address":"ethereum:0x0454092516c9A4d636d3CAfA1e82161376C8a748","condition":"if the number of 0xc2819DC788505Aac350142A7A707BF9D03E3Bd03 members falls below 8."}]}
      receivedPermissions.1:
-        {"permission":"guard","from":"ethereum:0x95703e0982140D16f8ebA6d158FccEde42f04a4C","role":".guardian","via":[{"address":"ethereum:0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2"},{"address":"ethereum:0xc2819DC788505Aac350142A7A707BF9D03E3Bd03"},{"address":"ethereum:0x0454092516c9A4d636d3CAfA1e82161376C8a748","condition":"if the number of 0xc2819DC788505Aac350142A7A707BF9D03E3Bd03 members falls below 8."}]}
      receivedPermissions.0.from:
-        "ethereum:0x8B34b14c7c7123459Cf3076b8Cb929BE097d0C07"
+        "ethereum:0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
    }
```

```diff
    contract OptimismPortal2 (0x8B34b14c7c7123459Cf3076b8Cb929BE097d0C07) {
    +++ description: The OptimismPortal contract is the main entry point to deposit funds from L1 to L2. It also allows to prove and finalize withdrawals. It specifies which game type can be used for withdrawals, which currently is the PermissionedDisputeGame.
      name:
-        "OptimismPortal"
+        "OptimismPortal2"
      template:
-        "opstack/OptimismPortal"
+        "opstack/OptimismPortal2"
      sourceHashes.1:
-        "0xe35fb7bc0433439337b3eadda3d6fb7991918162f62a337a695e8c7f948cdd35"
+        "0x2cdcfef705094aaac53d507bad64d27b48ea5a9c11a7fadffacc192aab7a823f"
      sourceHashes.0:
-        "0x2cdcfef705094aaac53d507bad64d27b48ea5a9c11a7fadffacc192aab7a823f"
+        "0x41be46bdb67af1b7af90e1bd70a1fcd31a3352282beb83b846a5189675c37ac1"
      description:
-        "The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals."
+        "The OptimismPortal contract is the main entry point to deposit funds from L1 to L2. It also allows to prove and finalize withdrawals. It specifies which game type can be used for withdrawals, which currently is the PermissionedDisputeGame."
      values.$implementation:
-        "0x2D778797049FE9259d947D1ED8e5442226dFB589"
+        "0xe2F826324b2faf99E513D16D266c3F80aE87832B"
      values.$pastUpgrades.8:
+        ["2024-08-01T21:25:23.000Z","0x9154d2b581e84b15615b4a857476af9fa6b682622d6e30e7c28bae6331a5fe39",["0x57e5AB742DDa19b60Fa2A43275722296B05A661A"]]
      values.$pastUpgrades.7:
+        ["2024-04-19T18:22:11.000Z","0xfd62d0d284c8655e916a5cdd2472b461ed5686ab1414b834a1ffdb06a44f63b4",["0xd81f43eDBCAcb4c29a9bA38a13Ee5d79278270cC"]]
      values.$pastUpgrades.6.2.0:
-        "0x57e5AB742DDa19b60Fa2A43275722296B05A661A"
+        "0xe2F826324b2faf99E513D16D266c3F80aE87832B"
      values.$pastUpgrades.6.1:
-        "2024-08-01T21:25:23.000Z"
+        "2025-06-13T14:31:59.000Z"
      values.$pastUpgrades.6.0:
-        "0x9154d2b581e84b15615b4a857476af9fa6b682622d6e30e7c28bae6331a5fe39"
+        "0xd8fd08e0a66a0f5c0e5aed4e078e77bf8c3e50c27d09db458e2b04e7c6b2f5e7"
      values.$pastUpgrades.5.2:
-        "0xfd62d0d284c8655e916a5cdd2472b461ed5686ab1414b834a1ffdb06a44f63b4"
+        "2025-06-13T14:31:59.000Z"
      values.$pastUpgrades.5.1:
-        "2024-04-19T18:22:11.000Z"
+        "0xd8fd08e0a66a0f5c0e5aed4e078e77bf8c3e50c27d09db458e2b04e7c6b2f5e7"
      values.$upgradeCount:
-        7
+        9
      values.GUARDIAN:
-        "0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2"
      values.L2_ORACLE:
-        "0x4317ba146D4933D889518a3e5E11Fe7a53199b04"
      values.l2Oracle:
-        "0x4317ba146D4933D889518a3e5E11Fe7a53199b04"
      values.SYSTEM_CONFIG:
-        "0x5e6432F18Bc5d497B1Ab2288a025Fbf9D69E2221"
      values.version:
-        "2.5.0"
+        "3.10.0"
      values.disputeGameFactory:
+        "0x6f13EFadABD9269D6cEAd22b448d434A1f1B433E"
      values.disputeGameFinalityDelaySeconds:
+        302400
      values.proofMaturityDelaySeconds:
+        604800
      values.RespectedGameString:
+        "PermissionedDisputeGame"
      values.respectedGameType:
+        1
      values.respectedGameTypeUpdatedAt:
+        1749825119
      implementationNames.0x2D778797049FE9259d947D1ED8e5442226dFB589:
-        "OptimismPortal"
      implementationNames.0xe2F826324b2faf99E513D16D266c3F80aE87832B:
+        "OptimismPortal2"
      fieldMeta:
+        {"paused":{"severity":"HIGH","description":"Whether the contract is paused or not. Determined by the SuperchainConfig contract PAUSED_SLOT. Here it pauses withdrawals. If this is paused, also the L1CrossDomainMessenger and ERC-20, ERC-721 deposits are paused."}}
      usedTypes:
+        [{"typeCaster":"Mapping","arg":{"0":"FaultDisputeGame","1":"PermissionedDisputeGame"}}]
    }
```

```diff
    contract L1CrossDomainMessenger (0x95bDCA6c8EdEB69C98Bd5bd17660BaCef1298A6f) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      values.$pastUpgrades.5:
+        ["2024-04-19T18:22:11.000Z","0xfd62d0d284c8655e916a5cdd2472b461ed5686ab1414b834a1ffdb06a44f63b4",["0xD3494713A5cfaD3F5359379DfA074E2Ac8C6Fd65"]]
      values.$pastUpgrades.4:
+        ["2024-04-19T18:22:11.000Z","0xfd62d0d284c8655e916a5cdd2472b461ed5686ab1414b834a1ffdb06a44f63b4",["0xd81f43eDBCAcb4c29a9bA38a13Ee5d79278270cC"]]
      values.$pastUpgrades.3.2:
-        "0xfd62d0d284c8655e916a5cdd2472b461ed5686ab1414b834a1ffdb06a44f63b4"
+        "2025-06-13T14:31:59.000Z"
      values.$pastUpgrades.3.1:
-        "2024-04-19T18:22:11.000Z"
+        "0xd8fd08e0a66a0f5c0e5aed4e078e77bf8c3e50c27d09db458e2b04e7c6b2f5e7"
      values.$pastUpgrades.3.0.0:
-        "0xD3494713A5cfaD3F5359379DfA074E2Ac8C6Fd65"
+        "0xd81f43eDBCAcb4c29a9bA38a13Ee5d79278270cC"
      values.$pastUpgrades.2.2:
-        "0xfd62d0d284c8655e916a5cdd2472b461ed5686ab1414b834a1ffdb06a44f63b4"
+        "2025-06-13T14:31:59.000Z"
      values.$pastUpgrades.2.1:
-        "2024-04-19T18:22:11.000Z"
+        ["0xD3494713A5cfaD3F5359379DfA074E2Ac8C6Fd65"]
      values.$pastUpgrades.2.0:
-        ["0xd81f43eDBCAcb4c29a9bA38a13Ee5d79278270cC"]
+        "0xd8fd08e0a66a0f5c0e5aed4e078e77bf8c3e50c27d09db458e2b04e7c6b2f5e7"
      values.$upgradeCount:
-        4
+        6
    }
```

```diff
    contract OpFoundationOperationsSafe (0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A) {
    +++ description: None
      receivedPermissions.2:
-        {"permission":"guard","from":"ethereum:0x8B34b14c7c7123459Cf3076b8Cb929BE097d0C07","role":".GUARDIAN","via":[{"address":"ethereum:0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2"},{"address":"ethereum:0xc6901F65369FC59fC1B4D6D6bE7A2318Ff38dB5B","condition":"if not revoked by the Security Council"}]}
      receivedPermissions.1.permission:
-        "guard"
+        "challenge"
      receivedPermissions.1.from:
-        "ethereum:0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
+        "ethereum:0x75fa114D4286c7d1114CE773EfF0f1bDe0aF966a"
      receivedPermissions.1.role:
-        ".guardian"
+        ".challenger"
      receivedPermissions.1.via:
-        [{"address":"ethereum:0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2"},{"address":"ethereum:0xc6901F65369FC59fC1B4D6D6bE7A2318Ff38dB5B","condition":"if not revoked by the Security Council"}]
      receivedPermissions.0.from:
-        "ethereum:0x8B34b14c7c7123459Cf3076b8Cb929BE097d0C07"
+        "ethereum:0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
    }
```

```diff
    contract Optimism Security Council (0xc2819DC788505Aac350142A7A707BF9D03E3Bd03) {
    +++ description: None
      receivedPermissions.2:
-        {"permission":"guard","from":"ethereum:0x8B34b14c7c7123459Cf3076b8Cb929BE097d0C07","role":".GUARDIAN","via":[{"address":"ethereum:0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2"}]}
      receivedPermissions.1:
-        {"permission":"guard","from":"ethereum:0x95703e0982140D16f8ebA6d158FccEde42f04a4C","role":".guardian","via":[{"address":"ethereum:0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2"}]}
      receivedPermissions.0.from:
-        "ethereum:0x8B34b14c7c7123459Cf3076b8Cb929BE097d0C07"
+        "ethereum:0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
    }
```

```diff
+   Status: CREATED
    contract MIPS (0x5fE03a12C1236F9C22Cb6479778DDAa4bce6299C)
    +++ description: The MIPS contract is used to execute the final step of the dispute game which objectively determines the winner of the dispute.
```

```diff
+   Status: CREATED
    contract DisputeGameFactory (0x6f13EFadABD9269D6cEAd22b448d434A1f1B433E)
    +++ description: The dispute game factory allows the creation of dispute games, used to propose state roots and eventually challenge them.
```

```diff
+   Status: CREATED
    contract PermissionedDisputeGame (0x75fa114D4286c7d1114CE773EfF0f1bDe0aF966a)
    +++ description: Same as FaultDisputeGame, but only two permissioned addresses are designated as proposer and challenger.
```

```diff
+   Status: CREATED
    contract PreimageOracle (0x9c065e11870B891D214Bc2Da7EF1f9DDFA1BE277)
    +++ description: The PreimageOracle contract is used to load the required data from L1 for a dispute game.
```

```diff
+   Status: CREATED
    contract DelayedWETH (0xa29b6D87Ee95375E7a31374667054F38b920ab7a)
    +++ description: Contract designed to hold the bonded ETH for each game. It is designed as a wrapper around WETH to allow an owner to function as a backstop if a game would incorrectly distribute funds.
```

```diff
+   Status: CREATED
    contract AnchorStateRegistry (0xbf1229eE0782939bB4325Fd13a0b481949e311Aa)
    +++ description: Contains the latest confirmed state root that can be used as a starting point in a dispute game.
```

## Source code changes

```diff
.../AnchorStateRegistry/AnchorStateRegistry.sol    |  448 +++
 .../ethereum/.flat/AnchorStateRegistry/Proxy.p.sol |  200 +
 .../ethereum/.flat/DelayedWETH/DelayedWETH.sol     |  651 ++++
 .../mode/ethereum/.flat/DelayedWETH/Proxy.p.sol    |  200 +
 .../DisputeGameFactory/DisputeGameFactory.sol      | 1550 ++++++++
 .../ethereum/.flat/DisputeGameFactory/Proxy.p.sol  |  200 +
 .../L2OutputOracle/L2OutputOracle.sol => /dev/null |  679 ----
 .../src/projects/mode/ethereum/.flat/MIPS.sol      | 1717 +++++++++
 .../Mode Multisig/GnosisSafe.sol => /dev/null      |  953 -----
 .../GnosisSafeProxy.p.sol => /dev/null             |   35 -
 .../OptimismPortal/Proxy.p.sol => /dev/null        |  211 -
 .../OptimismPortal2/OptimismPortal2.sol}           |  512 ++-
 .../OptimismPortal2}/Proxy.p.sol                   |    0
 .../ethereum/.flat/PermissionedDisputeGame.sol     | 4036 ++++++++++++++++++++
 .../mode/ethereum/.flat/PreimageOracle.sol         | 1353 +++++++
 15 files changed, 10679 insertions(+), 2066 deletions(-)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22615671 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x470d87b1dae09a454A43D1fD772A561a03276aB7) {
    +++ description: None
      directlyReceivedPermissions.7:
+        {"permission":"upgrade","from":"ethereum:0x2901dA832a4D0297FF0691100A8E496626cc626D","role":"admin"}
      directlyReceivedPermissions.6.from:
-        "ethereum:0x2901dA832a4D0297FF0691100A8E496626cc626D"
+        "ethereum:0x4317ba146D4933D889518a3e5E11Fe7a53199b04"
      directlyReceivedPermissions.5.from:
-        "ethereum:0x4317ba146D4933D889518a3e5E11Fe7a53199b04"
+        "ethereum:0x95bDCA6c8EdEB69C98Bd5bd17660BaCef1298A6f"
    }
```

```diff
    contract SuperchainProxyAdminOwner (0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A) {
    +++ description: None
      receivedPermissions.9:
+        {"permission":"upgrade","from":"ethereum:0x2901dA832a4D0297FF0691100A8E496626cc626D","role":"admin","via":[{"address":"ethereum:0x470d87b1dae09a454A43D1fD772A561a03276aB7"}]}
      receivedPermissions.8.from:
-        "ethereum:0x2901dA832a4D0297FF0691100A8E496626cc626D"
+        "ethereum:0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
      receivedPermissions.8.via.0.address:
-        "ethereum:0x470d87b1dae09a454A43D1fD772A561a03276aB7"
+        "ethereum:0x543bA4AADBAb8f9025686Bd03993043599c6fB04"
      receivedPermissions.7.from:
-        "ethereum:0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
+        "ethereum:0x4317ba146D4933D889518a3e5E11Fe7a53199b04"
      receivedPermissions.7.via.0.address:
-        "ethereum:0x543bA4AADBAb8f9025686Bd03993043599c6fB04"
+        "ethereum:0x470d87b1dae09a454A43D1fD772A561a03276aB7"
      receivedPermissions.6.from:
-        "ethereum:0x4317ba146D4933D889518a3e5E11Fe7a53199b04"
+        "ethereum:0x95bDCA6c8EdEB69C98Bd5bd17660BaCef1298A6f"
    }
```

```diff
    contract L1CrossDomainMessenger (0x95bDCA6c8EdEB69C98Bd5bd17660BaCef1298A6f) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      values.$admin:
+        "0x470d87b1dae09a454A43D1fD772A561a03276aB7"
    }
```

Generated with discovered.json: 0x772eb21d401c5aedd942d540b0eab294acf7875a

# Diff at Mon, 02 Jun 2025 08:00:55 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@2fee84b782a329885c84742cf9cf43143842a2d5 block: 22437739
- current block number: 22615671

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

Generated with discovered.json: 0x024359adadb4f80dfced095dd9ead878f960c045

# Diff at Fri, 30 May 2025 07:10:09 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@a4d8c436027d17df0f9b76843cd6deb1888fa381 block: 22437739
- current block number: 22437739

## Description

config: change comment about eip1559 fee val

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22437739 (main branch discovery), not current.

```diff
    contract SystemConfig (0x5e6432F18Bc5d497B1Ab2288a025Fbf9D69E2221) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      fieldMeta.eip1559Denominator:
+        {"description":"volatility param: lower denominator -> quicker fee changes on L2"}
    }
```

Generated with discovered.json: 0x12c316ff03f7d0d5b4fcbd06f959091b26033206

# Diff at Fri, 23 May 2025 09:41:00 GMT:

- chain: ethereum
- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@69cd181abbc3c830a6caf2f4429b37cae72ffdb8 block: 22437739
- current block number: 22437739

## Description

Introduced .role field on each permission, defaulting to field name on which it was defined (with '.' prefix)

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22437739 (main branch discovery), not current.

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
      directlyReceivedPermissions.2:
+        {"permission":"guard","from":"0x8B34b14c7c7123459Cf3076b8Cb929BE097d0C07","role":".GUARDIAN"}
      directlyReceivedPermissions.1.role:
+        ".guardian"
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
    contract LivenessGuard (0x24424336F04440b1c28685a38303aC33C9D14a25) {
    +++ description: None
      receivedPermissions.0.role:
+        ".livenessGuard"
    }
```

```diff
    contract Mode Multisig (0x309Fe2536d01867018D120b40e4676723C53A14C) {
    +++ description: None
      receivedPermissions.1:
+        {"permission":"challenge","from":"0x4317ba146D4933D889518a3e5E11Fe7a53199b04","role":".CHALLENGER"}
      receivedPermissions.0.role:
+        ".challenger"
    }
```

```diff
    EOA Optimism EOA 1 (0x352f1defB49718e7Ea411687E850aA8d6299F7aC) {
    +++ description: None
      receivedPermissions.2:
+        {"permission":"guard","from":"0x8B34b14c7c7123459Cf3076b8Cb929BE097d0C07","role":".GUARDIAN","via":[{"address":"0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2"},{"address":"0xc6901F65369FC59fC1B4D6D6bE7A2318Ff38dB5B","condition":"if not revoked by the Security Council"},{"address":"0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A"},{"address":"0x126a736B18E0a64fBA19D421647A530E327E112C","condition":"though restricted to the global pause function"}]}
      receivedPermissions.1.role:
+        ".guardian"
      receivedPermissions.0.role:
+        ".guardian"
      directlyReceivedPermissions.0.role:
+        ".deputy"
    }
```

```diff
    contract ProxyAdmin (0x470d87b1dae09a454A43D1fD772A561a03276aB7) {
    +++ description: None
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
-        "0x50eF494573f28Cad6B64C31b7a00Cdaa48306e15"
+        "0x735aDBbE72226BD52e818E7181953f42E3b0FF21"
      directlyReceivedPermissions.1.description:
-        "set and change address mappings."
+        "upgrading the bridge implementation can give access to all funds escrowed therein."
      directlyReceivedPermissions.1.role:
+        ".$admin"
      directlyReceivedPermissions.0.permission:
-        "upgrade"
+        "interact"
      directlyReceivedPermissions.0.from:
-        "0x735aDBbE72226BD52e818E7181953f42E3b0FF21"
+        "0x50eF494573f28Cad6B64C31b7a00Cdaa48306e15"
      directlyReceivedPermissions.0.description:
-        "upgrading the bridge implementation can give access to all funds escrowed therein."
+        "set and change address mappings."
      directlyReceivedPermissions.0.role:
+        ".owner"
    }
```

```diff
    contract Conduit Multisig 1 (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      receivedPermissions.0.role:
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
-        "0xdE1FCfB0851916CA5101820A69b13a4E276bd81F"
+        "0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
      receivedPermissions.4.description:
-        "set and change address mappings."
      receivedPermissions.4.role:
+        "admin"
      receivedPermissions.3.from:
-        "0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
+        "0x4317ba146D4933D889518a3e5E11Fe7a53199b04"
      receivedPermissions.3.via.0.address:
-        "0x543bA4AADBAb8f9025686Bd03993043599c6fB04"
+        "0x470d87b1dae09a454A43D1fD772A561a03276aB7"
      receivedPermissions.3.role:
+        "admin"
      receivedPermissions.2.permission:
-        "upgrade"
+        "interact"
      receivedPermissions.2.from:
-        "0x4317ba146D4933D889518a3e5E11Fe7a53199b04"
+        "0xdE1FCfB0851916CA5101820A69b13a4E276bd81F"
      receivedPermissions.2.via.0.address:
-        "0x470d87b1dae09a454A43D1fD772A561a03276aB7"
+        "0x543bA4AADBAb8f9025686Bd03993043599c6fB04"
      receivedPermissions.2.description:
+        "set and change address mappings."
      receivedPermissions.2.role:
+        ".owner"
      receivedPermissions.1.permission:
-        "interact"
+        "upgrade"
      receivedPermissions.1.from:
-        "0x50eF494573f28Cad6B64C31b7a00Cdaa48306e15"
+        "0x735aDBbE72226BD52e818E7181953f42E3b0FF21"
      receivedPermissions.1.description:
-        "set and change address mappings."
+        "upgrading the bridge implementation can give access to all funds escrowed therein."
      receivedPermissions.1.role:
+        ".$admin"
      receivedPermissions.0.permission:
-        "upgrade"
+        "interact"
      receivedPermissions.0.from:
-        "0x735aDBbE72226BD52e818E7181953f42E3b0FF21"
+        "0x50eF494573f28Cad6B64C31b7a00Cdaa48306e15"
      receivedPermissions.0.description:
-        "upgrading the bridge implementation can give access to all funds escrowed therein."
+        "set and change address mappings."
      receivedPermissions.0.role:
+        ".owner"
      directlyReceivedPermissions.1.role:
+        ".owner"
      directlyReceivedPermissions.0.role:
+        ".owner"
    }
```

```diff
    EOA  (0x674F64D64Ddc198db83cd9047dF54BF89cCD0ddB) {
    +++ description: None
      receivedPermissions.1:
+        {"permission":"propose","from":"0x4317ba146D4933D889518a3e5E11Fe7a53199b04","role":".proposer"}
      receivedPermissions.0.role:
+        ".PROPOSER"
    }
```

```diff
    contract OpFoundationUpgradeSafe (0x847B5c174615B1B7fDF770882256e2D3E95b9D92) {
    +++ description: None
      receivedPermissions.2:
+        {"permission":"guard","from":"0x8B34b14c7c7123459Cf3076b8Cb929BE097d0C07","role":".GUARDIAN","via":[{"address":"0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2"},{"address":"0xc2819DC788505Aac350142A7A707BF9D03E3Bd03"},{"address":"0x0454092516c9A4d636d3CAfA1e82161376C8a748","condition":"if the number of 0xc2819DC788505Aac350142A7A707BF9D03E3Bd03 members falls below 8."}]}
      receivedPermissions.1.role:
+        ".guardian"
      receivedPermissions.0.role:
+        ".guardian"
      directlyReceivedPermissions.0.role:
+        ".fallbackOwner"
    }
```

```diff
    EOA  (0x99199a22125034c808ff20f377d91187E8050F2E) {
    +++ description: None
      receivedPermissions.0.role:
+        ".batcherHash"
    }
```

```diff
    contract OpFoundationOperationsSafe (0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A) {
    +++ description: None
      receivedPermissions.2:
+        {"permission":"guard","from":"0x8B34b14c7c7123459Cf3076b8Cb929BE097d0C07","role":".GUARDIAN","via":[{"address":"0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2"},{"address":"0xc6901F65369FC59fC1B4D6D6bE7A2318Ff38dB5B","condition":"if not revoked by the Security Council"}]}
      receivedPermissions.1.role:
+        ".guardian"
      receivedPermissions.0.role:
+        ".guardian"
      directlyReceivedPermissions.0.role:
+        ".deputyGuardian"
    }
```

```diff
    contract Optimism Security Council (0xc2819DC788505Aac350142A7A707BF9D03E3Bd03) {
    +++ description: None
      receivedPermissions.2:
+        {"permission":"guard","from":"0x8B34b14c7c7123459Cf3076b8Cb929BE097d0C07","role":".GUARDIAN","via":[{"address":"0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2"}]}
      receivedPermissions.1.role:
+        ".guardian"
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

Generated with discovered.json: 0x748a61b07f0bea51c80da05174a74211b01d7da8

# Diff at Fri, 09 May 2025 10:09:09 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@c3a1d49c07f4092914d62c65181e5fec18a88318 block: 22437739
- current block number: 22437739

## Description

Config related: Move IFs to the editable string for condition configs (yeet IFs from the automatic resolver).

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22437739 (main branch discovery), not current.

```diff
    EOA Optimism EOA 1 (0x352f1defB49718e7Ea411687E850aA8d6299F7aC) {
    +++ description: None
      receivedPermissions.1.via.3.condition:
-        "not revoked by the Security Council"
+        "if not revoked by the Security Council"
      receivedPermissions.1.via.1.address:
-        "0x126a736B18E0a64fBA19D421647A530E327E112C"
+        "0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2"
      receivedPermissions.1.via.1.condition:
-        "restricted to the global pause function"
      receivedPermissions.1.via.0.address:
-        "0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2"
+        "0x126a736B18E0a64fBA19D421647A530E327E112C"
      receivedPermissions.1.via.0.condition:
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
      receivedPermissions.1.via.0.condition:
-        "the number of 0xc2819DC788505Aac350142A7A707BF9D03E3Bd03 members falls below 8."
+        "if the number of 0xc2819DC788505Aac350142A7A707BF9D03E3Bd03 members falls below 8."
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
      receivedPermissions.1.via.1.condition:
-        "not revoked by the Security Council"
+        "if not revoked by the Security Council"
      receivedPermissions.0.via.1.condition:
-        "not revoked by the Security Council"
+        "if not revoked by the Security Council"
      directlyReceivedPermissions.0.condition:
-        "not revoked by the Security Council"
+        "if not revoked by the Security Council"
    }
```

Generated with discovered.json: 0xa8c93d9e326a3599bb392b9be0718a6df0daba8b

# Diff at Thu, 08 May 2025 08:49:27 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@8e1926142ab0c57cc131de4d8da307e13d9af54d block: 22194719
- current block number: 22437739

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
.../mode/ethereum/.flat/DeputyPauseModule.sol      | 1338 ++++++++++++++++++++
 1 file changed, 1338 insertions(+)
```

Generated with discovered.json: 0xeee80195ddcb83c2314e5f7a800a53275d86b84c

# Diff at Tue, 29 Apr 2025 08:19:07 GMT:

- chain: ethereum
- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@ef7477af00fe0b57a2f7cacf7e958c12494af662 block: 22194719
- current block number: 22194719

## Description

Field .issuedPermissions is removed from the output as no longer needed. Added 'permissionsConfigHash' due to refactoring of the modelling process (into a separate command).

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22194719 (main branch discovery), not current.

```diff
    contract LivenessModule (0x0454092516c9A4d636d3CAfA1e82161376C8a748) {
    +++ description: used to remove members inactive for 98d while making sure that the threshold remains above 75%. If the number of members falls below 8, the 0x847B5c174615B1B7fDF770882256e2D3E95b9D92 takes ownership of the multisig
      issuedPermissions:
-        [{"permission":"interact","to":"0x24424336F04440b1c28685a38303aC33C9D14a25","description":"can remove members of 0xc2819DC788505Aac350142A7A707BF9D03E3Bd03 inactive for 98d.","via":[]}]
    }
```

```diff
    contract L1ERC721Bridge (0x2901dA832a4D0297FF0691100A8E496626cc626D) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A","via":[{"address":"0x470d87b1dae09a454A43D1fD772A561a03276aB7"}]}]
    }
```

```diff
    contract L2OutputOracle (0x4317ba146D4933D889518a3e5E11Fe7a53199b04) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      issuedPermissions:
-        [{"permission":"challenge","to":"0x309Fe2536d01867018D120b40e4676723C53A14C","via":[]},{"permission":"propose","to":"0x674F64D64Ddc198db83cd9047dF54BF89cCD0ddB","via":[]},{"permission":"upgrade","to":"0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A","via":[{"address":"0x470d87b1dae09a454A43D1fD772A561a03276aB7"}]}]
    }
```

```diff
    contract AddressManager (0x50eF494573f28Cad6B64C31b7a00Cdaa48306e15) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      issuedPermissions:
-        [{"permission":"interact","to":"0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A","description":"set and change address mappings.","via":[{"address":"0x470d87b1dae09a454A43D1fD772A561a03276aB7"}]}]
    }
```

```diff
    contract SystemConfig (0x5e6432F18Bc5d497B1Ab2288a025Fbf9D69E2221) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      issuedPermissions:
-        [{"permission":"interact","to":"0x4a4962275DF8C60a80d3a25faEc5AA7De116A746","description":"it can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system.","via":[]},{"permission":"sequence","to":"0x99199a22125034c808ff20f377d91187E8050F2E","via":[]},{"permission":"upgrade","to":"0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A","via":[{"address":"0x470d87b1dae09a454A43D1fD772A561a03276aB7"}]}]
    }
```

```diff
    contract OptimismMintableERC20Factory (0x69216395A62dFb243C05EF4F1C27AF8655096a95) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A","via":[{"address":"0x470d87b1dae09a454A43D1fD772A561a03276aB7"}]}]
    }
```

```diff
    contract L1StandardBridge (0x735aDBbE72226BD52e818E7181953f42E3b0FF21) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A","description":"upgrading the bridge implementation can give access to all funds escrowed therein.","via":[{"address":"0x470d87b1dae09a454A43D1fD772A561a03276aB7"}]}]
    }
```

```diff
    contract OptimismPortal (0x8B34b14c7c7123459Cf3076b8Cb929BE097d0C07) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      issuedPermissions:
-        [{"permission":"guard","to":"0x847B5c174615B1B7fDF770882256e2D3E95b9D92","via":[{"address":"0x0454092516c9A4d636d3CAfA1e82161376C8a748","condition":"the number of 0xc2819DC788505Aac350142A7A707BF9D03E3Bd03 members falls below 8."},{"address":"0xc2819DC788505Aac350142A7A707BF9D03E3Bd03"},{"address":"0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2"}]},{"permission":"guard","to":"0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A","via":[{"address":"0xc6901F65369FC59fC1B4D6D6bE7A2318Ff38dB5B","condition":"not revoked by the Security Council"},{"address":"0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2"}]},{"permission":"guard","to":"0xc2819DC788505Aac350142A7A707BF9D03E3Bd03","via":[{"address":"0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2"}]},{"permission":"upgrade","to":"0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A","via":[{"address":"0x470d87b1dae09a454A43D1fD772A561a03276aB7"}]}]
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
    contract AddressManager (0xdE1FCfB0851916CA5101820A69b13a4E276bd81F) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      issuedPermissions:
-        [{"permission":"interact","to":"0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A","description":"set and change address mappings.","via":[{"address":"0x543bA4AADBAb8f9025686Bd03993043599c6fB04"}]}]
    }
```

Generated with discovered.json: 0x085213a5272cf91e18fc19e0f81a28dd5b73631e

# Diff at Thu, 10 Apr 2025 14:42:45 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@f38a3c9bf359344e4c4cd3006f58271cb8f78d15 block: 22194719
- current block number: 22194719

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22194719 (main branch discovery), not current.

```diff
    contract SuperchainProxyAdmin (0x543bA4AADBAb8f9025686Bd03993043599c6fB04) {
    +++ description: None
      displayName:
-        "ProxyAdmin"
    }
```

Generated with discovered.json: 0x3338d4e679dd17d539345310c85fcb02f33cd77c

# Diff at Fri, 04 Apr 2025 09:40:28 GMT:

- chain: ethereum
- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@b3154c4385e52c9ffc0dab984c207390e5ccc13d block: 22046068
- current block number: 22194719

## Description

Provide description of changes. This section will be preserved.

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

## Source code changes

```diff
.../SuperchainConfig/SuperchainConfig.sol                         | 8 ++++----
 1 file changed, 4 insertions(+), 4 deletions(-)
```

Generated with discovered.json: 0xc58feb8df7bea39711139049131b535a10c9d5e9

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
    contract AddressManager (0x50eF494573f28Cad6B64C31b7a00Cdaa48306e15) {
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

Generated with discovered.json: 0xea025f18cce6261588054f9390f61d5351639c88

# Diff at Wed, 19 Mar 2025 13:05:03 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@e950b6e93c84855ee2ec1740913b7b4c994b9ae2 block: 22046068
- current block number: 22046068

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22046068 (main branch discovery), not current.

```diff
    contract Mode Multisig (0x309Fe2536d01867018D120b40e4676723C53A14C) {
    +++ description: None
      severity:
-        "HIGH"
    }
```

```diff
    contract undefined (0x674F64D64Ddc198db83cd9047dF54BF89cCD0ddB) {
    +++ description: None
      severity:
-        "HIGH"
    }
```

Generated with discovered.json: 0x698d6400d1a17e981970493f16f64fdc03cc4419

# Diff at Tue, 18 Mar 2025 08:13:15 GMT:

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
    contract Optimism Guardian Multisig (0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2) {
    +++ description: None
      name:
-        "SuperchainGuardianMultisig"
+        "Optimism Guardian Multisig"
    }
```

```diff
    contract Mode Multisig (0x309Fe2536d01867018D120b40e4676723C53A14C) {
    +++ description: None
      name:
-        "ModeMultisig"
+        "Mode Multisig"
    }
```

```diff
    contract Conduit Multisig 1 (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      name:
-        "ConduitMultisig"
+        "Conduit Multisig 1"
    }
```

```diff
    contract Optimism Security Council (0xc2819DC788505Aac350142A7A707BF9D03E3Bd03) {
    +++ description: None
      name:
-        "SecurityCouncilMultisig"
+        "Optimism Security Council"
    }
```

Generated with discovered.json: 0x78004d3645409745af28fa7cdeb622ba64020449

# Diff at Fri, 14 Mar 2025 15:40:20 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@002bac09dea3b1154ecc36736323fb7552478ce4 block: 21829671
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

Generated with discovered.json: 0x48e6a1e3bf91b4dbad8a49984b40c28b39b0416f

# Diff at Tue, 04 Mar 2025 11:26:00 GMT:

- chain: ethereum
- author: Michał Podsiadły (<michal.podsiadly@l2beat.com>)
- comparing to: main@be38e12d3ff947ca8de40f3a23a9ba1875a54f5a block: 21829671
- current block number: 21829671

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21829671 (main branch discovery), not current.

```diff
    contract SystemConfig (0x5e6432F18Bc5d497B1Ab2288a025Fbf9D69E2221) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      values.opStackDA.isSomeTxsLengthEqualToCelestiaDAExample:
-        false
      values.opStackDA.isUsingCelestia:
+        false
    }
```

Generated with discovered.json: 0xb12e94f63087f507f941e73c15d485d5162342e1

# Diff at Tue, 04 Mar 2025 10:39:27 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@98d260b45fe0d2195ce5e629bd7b200c8706e8ba block: 21829671
- current block number: 21829671

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21829671 (main branch discovery), not current.

```diff
    contract LivenessModule (0x0454092516c9A4d636d3CAfA1e82161376C8a748) {
    +++ description: used to remove members inactive for 98d while making sure that the threshold remains above 75%. If the number of members falls below 8, the 0x847B5c174615B1B7fDF770882256e2D3E95b9D92 takes ownership of the multisig
      sinceBlock:
+        19989094
    }
```

```diff
    contract SuperchainGuardianMultisig (0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2) {
    +++ description: None
      sinceBlock:
+        19968607
    }
```

```diff
    contract LivenessGuard (0x24424336F04440b1c28685a38303aC33C9D14a25) {
    +++ description: None
      sinceBlock:
+        19989094
    }
```

```diff
    contract L1ERC721Bridge (0x2901dA832a4D0297FF0691100A8E496626cc626D) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      sinceBlock:
+        18586931
    }
```

```diff
    contract ModeMultisig (0x309Fe2536d01867018D120b40e4676723C53A14C) {
    +++ description: None
      sinceBlock:
+        18586802
    }
```

```diff
    contract GnosisSafe (0x42d27eEA1AD6e22Af6284F609847CB3Cd56B9c64) {
    +++ description: None
      sinceBlock:
+        16780617
    }
```

```diff
    contract L2OutputOracle (0x4317ba146D4933D889518a3e5E11Fe7a53199b04) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      sinceBlock:
+        18586931
    }
```

```diff
    contract ProxyAdmin (0x470d87b1dae09a454A43D1fD772A561a03276aB7) {
    +++ description: None
      sinceBlock:
+        18586931
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
    contract AddressManager (0x50eF494573f28Cad6B64C31b7a00Cdaa48306e15) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      sinceBlock:
+        18586931
    }
```

```diff
    contract SuperchainProxyAdmin (0x543bA4AADBAb8f9025686Bd03993043599c6fB04) {
    +++ description: None
      sinceBlock:
+        17365800
    }
```

```diff
    contract SuperchainProxyAdminOwner (0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A) {
    +++ description: None
      sinceBlock:
+        19185554
    }
```

```diff
    contract SystemConfig (0x5e6432F18Bc5d497B1Ab2288a025Fbf9D69E2221) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      sinceBlock:
+        18586931
    }
```

```diff
    contract OptimismMintableERC20Factory (0x69216395A62dFb243C05EF4F1C27AF8655096a95) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      sinceBlock:
+        18586931
    }
```

```diff
    contract L1StandardBridge (0x735aDBbE72226BD52e818E7181953f42E3b0FF21) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      sinceBlock:
+        18586931
    }
```

```diff
    contract OpFoundationUpgradeSafe (0x847B5c174615B1B7fDF770882256e2D3E95b9D92) {
    +++ description: None
      sinceBlock:
+        19185544
    }
```

```diff
    contract OptimismPortal (0x8B34b14c7c7123459Cf3076b8Cb929BE097d0C07) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      sinceBlock:
+        18586931
    }
```

```diff
    contract SuperchainConfig (0x95703e0982140D16f8ebA6d158FccEde42f04a4C) {
    +++ description: Used to manage global configuration values for multiple OP Chains within a single Superchain network. The SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the Superchain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      sinceBlock:
+        19064589
    }
```

```diff
    contract L1CrossDomainMessenger (0x95bDCA6c8EdEB69C98Bd5bd17660BaCef1298A6f) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      sinceBlock:
+        18586931
    }
```

```diff
    contract OpFoundationOperationsSafe (0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A) {
    +++ description: None
      sinceBlock:
+        11670007
    }
```

```diff
    contract SecurityCouncilMultisig (0xc2819DC788505Aac350142A7A707BF9D03E3Bd03) {
    +++ description: None
      sinceBlock:
+        19185517
    }
```

```diff
    contract DeputyGuardianModule (0xc6901F65369FC59fC1B4D6D6bE7A2318Ff38dB5B) {
    +++ description: allows the 0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A, called the deputy guardian, to act on behalf of the Gnosis Safe.
      sinceBlock:
+        20566057
    }
```

```diff
    contract AddressManager (0xdE1FCfB0851916CA5101820A69b13a4E276bd81F) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      sinceBlock:
+        12686687
    }
```

Generated with discovered.json: 0x8f4c69a0561f6c67e75c12dd329c235f70c5f2e2

# Diff at Thu, 27 Feb 2025 11:46:03 GMT:

- chain: ethereum
- author: Michał Podsiadły (<michal.podsiadly@l2beat.com>)
- comparing to: main@a4b50e45bb44f8ceeea29f9236088d26a843c885 block: 21829671
- current block number: 21829671

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21829671 (main branch discovery), not current.

```diff
    contract AddressManager (0xdE1FCfB0851916CA5101820A69b13a4E276bd81F) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      name:
-        "Lib_AddressManager"
+        "AddressManager"
      displayName:
-        "AddressManager"
    }
```

Generated with discovered.json: 0xc1568ccda07f850f2dd7ebfcc9ece737f0aab234

# Diff at Wed, 26 Feb 2025 10:32:55 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@18513668f913fbe57a197f43655b19111df0e627 block: 21829671
- current block number: 21829671

## Description

config related: added categories for all opstack, op stack and polygoncdk stack templates.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21829671 (main branch discovery), not current.

```diff
    contract L1ERC721Bridge (0x2901dA832a4D0297FF0691100A8E496626cc626D) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      category:
+        {"name":"Canonical Bridges","priority":2}
    }
```

```diff
    contract L2OutputOracle (0x4317ba146D4933D889518a3e5E11Fe7a53199b04) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract SystemConfig (0x5e6432F18Bc5d497B1Ab2288a025Fbf9D69E2221) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract L1StandardBridge (0x735aDBbE72226BD52e818E7181953f42E3b0FF21) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      category:
+        {"name":"Canonical Bridges","priority":2}
    }
```

```diff
    contract OptimismPortal (0x8B34b14c7c7123459Cf3076b8Cb929BE097d0C07) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract SuperchainConfig (0x95703e0982140D16f8ebA6d158FccEde42f04a4C) {
    +++ description: Used to manage global configuration values for multiple OP Chains within a single Superchain network. The SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the Superchain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      category:
+        {"name":"Shared Infrastructure","priority":4}
    }
```

```diff
    contract L1CrossDomainMessenger (0x95bDCA6c8EdEB69C98Bd5bd17660BaCef1298A6f) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      category:
+        {"name":"Canonical Bridges","priority":2}
    }
```

Generated with discovered.json: 0xf2eafed79385876bc302121a2c9188b32cce1cc0

# Diff at Fri, 21 Feb 2025 14:09:18 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@d219f271711b2cf7a164e3443bead5e4957d13a8 block: 21829671
- current block number: 21829671

## Description

Config related: Change some severities and add templates.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21829671 (main branch discovery), not current.

```diff
    contract ModeMultisig (0x309Fe2536d01867018D120b40e4676723C53A14C) {
    +++ description: None
      severity:
+        "HIGH"
    }
```

```diff
    contract L2OutputOracle (0x4317ba146D4933D889518a3e5E11Fe7a53199b04) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      fieldMeta.proposer:
+        {"severity":"HIGH"}
      fieldMeta.challenger:
+        {"severity":"HIGH"}
      fieldMeta.deletedOutputs:
+        {"severity":"HIGH"}
    }
```

Generated with discovered.json: 0x6dfd1e14324abdc35a253c23a5446fc420faaa85

# Diff at Fri, 21 Feb 2025 08:59:44 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1cf9ec35847912163c4b663a633e258a434c0bca block: 21829671
- current block number: 21829671

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21829671 (main branch discovery), not current.

```diff
    contract L1StandardBridge (0x735aDBbE72226BD52e818E7181953f42E3b0FF21) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      categories:
-        ["Gateways&Escrows"]
    }
```

```diff
    contract SuperchainConfig (0x95703e0982140D16f8ebA6d158FccEde42f04a4C) {
    +++ description: Used to manage global configuration values for multiple OP Chains within a single Superchain network. The SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the Superchain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      categories:
-        ["Upgrades&Governance"]
    }
```

```diff
    contract L1CrossDomainMessenger (0x95bDCA6c8EdEB69C98Bd5bd17660BaCef1298A6f) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      categories:
-        ["Core"]
    }
```

Generated with discovered.json: 0x1794b2e7d9ccde9ddd9d460f64aa32cadc1775b6

# Diff at Wed, 12 Feb 2025 09:59:59 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@554a6f0e6aa688c758b37653d0be7eb446f9152e block: 21802835
- current block number: 21829671

## Description

Optimism SecurityCouncil rotates signers.

## Watched changes

```diff
    contract SecurityCouncilMultisig (0xc2819DC788505Aac350142A7A707BF9D03E3Bd03) {
    +++ description: None
      values.$members.7:
-        "0x74FAE9a9fbe31d1F69b95f59CaF12736a8b6B310"
+        "0xd5b735b676A043a53946C3b6F6BE28c1ECE6aC90"
      values.$members.5:
-        "0x5C0F529d5B025540c54f71d2BcbB4c78F368C47e"
+        "0xEF9A98511939eEe6Ec69af62082E3F2ff606877c"
    }
```

Generated with discovered.json: 0x96a52ac28b4945f71920e5fd6a23959c1e44f793

# Diff at Mon, 10 Feb 2025 19:04:16 GMT:

- chain: ethereum
- author: Michał Podsiadły (<michal.podsiadly@l2beat.com>)
- comparing to: main@3756adff7c1ac86d8af3374a90a75c1999aae2b3 block: 21802835
- current block number: 21802835

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21802835 (main branch discovery), not current.

```diff
    contract SystemConfig (0x5e6432F18Bc5d497B1Ab2288a025Fbf9D69E2221) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      values.opStackDA.isUsingEigenDA:
+        false
    }
```

Generated with discovered.json: 0x3bc746906e58f30590f2ba2b2b5f561ad0193291

# Diff at Sat, 08 Feb 2025 15:57:42 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@ef01ea79812e0d524af00be3fae1170cef6fd662 block: 21786506
- current block number: 21802835

## Description

Single SC member rotated.

## Watched changes

```diff
    contract SecurityCouncilMultisig (0xc2819DC788505Aac350142A7A707BF9D03E3Bd03) {
    +++ description: None
      values.$members.12:
-        "0xE895076cD050F1f042d1040E47b5929bE989E514"
+        "0x92827223f6b397CE9F208eE352bacA710765cACb"
      values.$members.1:
-        "0x0a122d8aA40758FBAFf0360BFB391EdFfD9758b8"
+        "0x652BC529E171847E2fFddCeA13567643C84ccB5f"
    }
```

Generated with discovered.json: 0xbe697822379c16f7bfedb2e462219faf94820535

# Diff at Thu, 06 Feb 2025 09:16:41 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@fa699ce266b15edb364aa471a661f580ea1a4529 block: 21715411
- current block number: 21786506

## Description

OP Stack SC signer rotation.

## Watched changes

```diff
    contract SecurityCouncilMultisig (0xc2819DC788505Aac350142A7A707BF9D03E3Bd03) {
    +++ description: None
      values.$members.9:
-        "0x8Afe777B5A4D1e156435ab44Ad4b73A318cE0EA4"
+        "0x0aA384EB2fedD2741277A0f72909A0d7275575D7"
    }
```

Generated with discovered.json: 0x16330838367fd65a83bba31b1a21dd0845566e2d

# Diff at Tue, 04 Feb 2025 12:31:43 GMT:

- chain: ethereum
- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@145553eed7ba44636411ecb25e4099728acd02f9 block: 21715411
- current block number: 21715411

## Description

Rename 'configure' permission to 'interact'

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21715411 (main branch discovery), not current.

```diff
    contract LivenessModule (0x0454092516c9A4d636d3CAfA1e82161376C8a748) {
    +++ description: used to remove members inactive for 98d while making sure that the threshold remains above 75%. If the number of members falls below 8, the 0x847B5c174615B1B7fDF770882256e2D3E95b9D92 takes ownership of the multisig
      issuedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract LivenessGuard (0x24424336F04440b1c28685a38303aC33C9D14a25) {
    +++ description: None
      receivedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract ProxyAdmin (0x470d87b1dae09a454A43D1fD772A561a03276aB7) {
    +++ description: None
      directlyReceivedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract ConduitMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      receivedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract AddressManager (0x50eF494573f28Cad6B64C31b7a00Cdaa48306e15) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      issuedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract SuperchainProxyAdmin (0x543bA4AADBAb8f9025686Bd03993043599c6fB04) {
    +++ description: None
      directlyReceivedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract SuperchainProxyAdminOwner (0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A) {
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
    contract SystemConfig (0x5e6432F18Bc5d497B1Ab2288a025Fbf9D69E2221) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      issuedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract Lib_AddressManager (0xdE1FCfB0851916CA5101820A69b13a4E276bd81F) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      issuedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

Generated with discovered.json: 0x6e46911e8f771ca250c9118d8f8cda262b5e1507

# Diff at Mon, 27 Jan 2025 11:02:08 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@43cb526d71ed01f024dced9d5aea2a30cf306714 block: 21637080
- current block number: 21715411

## Description

This is a SystemConfig upgrade (v2.3.0, adding gasToken support) for five Superchain eco chains that use superchain governance.
- op mainnet
- metal
- zora
- arena-z
- mode

Due to temporary storage setter implementations, multiple upgrades are counted within a single tx.

## Watched changes

```diff
    contract SystemConfig (0x5e6432F18Bc5d497B1Ab2288a025Fbf9D69E2221) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      sourceHashes.1:
-        "0xdf9a11b46747139bfe0135df8a65a2728a2dbd60a689e2398c45627915cdd752"
+        "0xc7135dbd2a53312d36df3f3ee91ce0a5a459ab8fc7725880a3a9c55a5fa0ed6c"
      values.$implementation:
-        "0xba2492e52F45651B60B8B38d4Ea5E2390C64Ffb1"
+        "0xAB9d6cB7A427c0765163A7f45BB91cAfe5f2D375"
      values.$pastUpgrades.4:
+        ["2025-01-24T14:41:35.000Z","0x86da7386a26978c3db89e97c1f4feee613a8a0c07bbe4640624b05276f49c350",["0xAB9d6cB7A427c0765163A7f45BB91cAfe5f2D375"]]
      values.$pastUpgrades.3:
+        ["2025-01-24T14:41:35.000Z","0x86da7386a26978c3db89e97c1f4feee613a8a0c07bbe4640624b05276f49c350",["0xd81f43eDBCAcb4c29a9bA38a13Ee5d79278270cC"]]
      values.$upgradeCount:
-        3
+        5
      values.L2_OUTPUT_ORACLE_SLOT:
-        "0xe52a667f71ec761b9b381c7b76ca9b852adf7e8905da0e0ad49986a0a6871815"
      values.l2OutputOracle:
-        "0x4317ba146D4933D889518a3e5E11Fe7a53199b04"
      values.version:
-        "1.12.0"
+        "2.3.0"
      values.basefeeScalar:
+        20000
      values.blobbasefeeScalar:
+        611590
      values.DISPUTE_GAME_FACTORY_SLOT:
+        "0x52322a25d9f59ea17656545543306b7aef62bc0cc53a0e65ccfa0c75b97aa906"
      values.disputeGameFactory:
+        "0x0000000000000000000000000000000000000000"
      values.eip1559Denominator:
+        0
      values.eip1559Elasticity:
+        0
      values.gasPayingToken:
+        {"addr_":"0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE","decimals_":18}
      values.gasPayingTokenName:
+        "Ether"
      values.gasPayingTokenSymbol:
+        "ETH"
      values.isCustomGasToken:
+        false
      values.maximumGasLimit:
+        200000000
    }
```

## Source code changes

```diff
.../SystemConfig/SystemConfig.sol                  | 1502 +++++++++++++++++++-
 1 file changed, 1462 insertions(+), 40 deletions(-)
```

Generated with discovered.json: 0x973e904b6eecfee2e9d06f62cbafa5b48ffc7104

# Diff at Tue, 21 Jan 2025 11:19:03 GMT:

- chain: ethereum
- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@0da84acc479f34212f2c8133869a3eef33d46ecc block: 21637080
- current block number: 21637080

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21637080 (main branch discovery), not current.

```diff
    contract LivenessModule (0x0454092516c9A4d636d3CAfA1e82161376C8a748) {
    +++ description: used to remove members inactive for 98d while making sure that the threshold remains above 75%. If the number of members falls below 8, the 0x847B5c174615B1B7fDF770882256e2D3E95b9D92 takes ownership of the multisig
      receivedPermissions:
-        [{"permission":"guard","from":"0x8B34b14c7c7123459Cf3076b8Cb929BE097d0C07","via":[{"address":"0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2"},{"address":"0xc2819DC788505Aac350142A7A707BF9D03E3Bd03"}]},{"permission":"guard","from":"0x95703e0982140D16f8ebA6d158FccEde42f04a4C","via":[{"address":"0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2"},{"address":"0xc2819DC788505Aac350142A7A707BF9D03E3Bd03"}]}]
      issuedPermissions:
+        [{"permission":"configure","to":"0x24424336F04440b1c28685a38303aC33C9D14a25","description":"can remove members of 0xc2819DC788505Aac350142A7A707BF9D03E3Bd03 inactive for 98d.","via":[]}]
    }
```

```diff
    contract LivenessGuard (0x24424336F04440b1c28685a38303aC33C9D14a25) {
    +++ description: None
      receivedPermissions:
+        [{"permission":"configure","from":"0x0454092516c9A4d636d3CAfA1e82161376C8a748","description":"can remove members of 0xc2819DC788505Aac350142A7A707BF9D03E3Bd03 inactive for 98d."}]
    }
```

```diff
    contract OpFoundationUpgradeSafe (0x847B5c174615B1B7fDF770882256e2D3E95b9D92) {
    +++ description: None
      receivedPermissions:
+        [{"permission":"guard","from":"0x8B34b14c7c7123459Cf3076b8Cb929BE097d0C07","via":[{"address":"0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2"},{"address":"0xc2819DC788505Aac350142A7A707BF9D03E3Bd03"},{"address":"0x0454092516c9A4d636d3CAfA1e82161376C8a748","condition":"the number of 0xc2819DC788505Aac350142A7A707BF9D03E3Bd03 members falls below 8."}]},{"permission":"guard","from":"0x95703e0982140D16f8ebA6d158FccEde42f04a4C","via":[{"address":"0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2"},{"address":"0xc2819DC788505Aac350142A7A707BF9D03E3Bd03"},{"address":"0x0454092516c9A4d636d3CAfA1e82161376C8a748","condition":"the number of 0xc2819DC788505Aac350142A7A707BF9D03E3Bd03 members falls below 8."}]}]
      directlyReceivedPermissions:
+        [{"permission":"act","from":"0x0454092516c9A4d636d3CAfA1e82161376C8a748","description":"takes ownership of 0xc2819DC788505Aac350142A7A707BF9D03E3Bd03","condition":"the number of 0xc2819DC788505Aac350142A7A707BF9D03E3Bd03 members falls below 8."}]
    }
```

```diff
    contract OptimismPortal (0x8B34b14c7c7123459Cf3076b8Cb929BE097d0C07) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      issuedPermissions.1.via.0.condition:
+        "not revoked by the Security Council"
      issuedPermissions.0.to:
-        "0x0454092516c9A4d636d3CAfA1e82161376C8a748"
+        "0x847B5c174615B1B7fDF770882256e2D3E95b9D92"
      issuedPermissions.0.via.2:
+        {"address":"0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2"}
      issuedPermissions.0.via.1.address:
-        "0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2"
+        "0xc2819DC788505Aac350142A7A707BF9D03E3Bd03"
      issuedPermissions.0.via.0.address:
-        "0xc2819DC788505Aac350142A7A707BF9D03E3Bd03"
+        "0x0454092516c9A4d636d3CAfA1e82161376C8a748"
      issuedPermissions.0.via.0.condition:
+        "the number of 0xc2819DC788505Aac350142A7A707BF9D03E3Bd03 members falls below 8."
    }
```

```diff
    contract SuperchainConfig (0x95703e0982140D16f8ebA6d158FccEde42f04a4C) {
    +++ description: Used to manage global configuration values for multiple OP Chains within a single Superchain network. The SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the Superchain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      issuedPermissions.1.via.0.condition:
+        "not revoked by the Security Council"
      issuedPermissions.0.to:
-        "0x0454092516c9A4d636d3CAfA1e82161376C8a748"
+        "0x847B5c174615B1B7fDF770882256e2D3E95b9D92"
      issuedPermissions.0.via.2:
+        {"address":"0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2"}
      issuedPermissions.0.via.1.address:
-        "0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2"
+        "0xc2819DC788505Aac350142A7A707BF9D03E3Bd03"
      issuedPermissions.0.via.0.address:
-        "0xc2819DC788505Aac350142A7A707BF9D03E3Bd03"
+        "0x0454092516c9A4d636d3CAfA1e82161376C8a748"
      issuedPermissions.0.via.0.condition:
+        "the number of 0xc2819DC788505Aac350142A7A707BF9D03E3Bd03 members falls below 8."
    }
```

```diff
    contract OpFoundationOperationsSafe (0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A) {
    +++ description: None
      receivedPermissions.1.via.1.condition:
+        "not revoked by the Security Council"
      receivedPermissions.0.via.1.condition:
+        "not revoked by the Security Council"
      directlyReceivedPermissions.0.condition:
+        "not revoked by the Security Council"
    }
```

Generated with discovered.json: 0xc05adbad920520a126b8ee5bb009d010d0940c20

# Diff at Mon, 20 Jan 2025 11:09:46 GMT:

- chain: ethereum
- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@2c8b4f3d9910bb6371be9b4df87b70856e7d8c64 block: 21637080
- current block number: 21637080

## Description

Rerun on the same block number. Applies fixes to permissions and via field. Renames permission's target to to/from.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21637080 (main branch discovery), not current.

```diff
    contract LivenessModule (0x0454092516c9A4d636d3CAfA1e82161376C8a748) {
    +++ description: used to remove members inactive for 98d while making sure that the threshold remains above 75%. If the number of members falls below 8, the 0x847B5c174615B1B7fDF770882256e2D3E95b9D92 takes ownership of the multisig
      receivedPermissions.1.target:
-        "0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
      receivedPermissions.1.from:
+        "0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
      receivedPermissions.0.target:
-        "0x8B34b14c7c7123459Cf3076b8Cb929BE097d0C07"
      receivedPermissions.0.from:
+        "0x8B34b14c7c7123459Cf3076b8Cb929BE097d0C07"
      directlyReceivedPermissions.0.target:
-        "0xc2819DC788505Aac350142A7A707BF9D03E3Bd03"
      directlyReceivedPermissions.0.from:
+        "0xc2819DC788505Aac350142A7A707BF9D03E3Bd03"
    }
```

```diff
    contract SuperchainGuardianMultisig (0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2) {
    +++ description: None
      directlyReceivedPermissions.1.target:
-        "0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
      directlyReceivedPermissions.1.from:
+        "0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
      directlyReceivedPermissions.0.target:
-        "0x8B34b14c7c7123459Cf3076b8Cb929BE097d0C07"
      directlyReceivedPermissions.0.from:
+        "0x8B34b14c7c7123459Cf3076b8Cb929BE097d0C07"
    }
```

```diff
    contract L1ERC721Bridge (0x2901dA832a4D0297FF0691100A8E496626cc626D) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      issuedPermissions.0.target:
-        "0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A"
    }
```

```diff
    contract ModeMultisig (0x309Fe2536d01867018D120b40e4676723C53A14C) {
    +++ description: None
      receivedPermissions.0.target:
-        "0x4317ba146D4933D889518a3e5E11Fe7a53199b04"
      receivedPermissions.0.from:
+        "0x4317ba146D4933D889518a3e5E11Fe7a53199b04"
    }
```

```diff
    contract L2OutputOracle (0x4317ba146D4933D889518a3e5E11Fe7a53199b04) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      issuedPermissions.2.target:
-        "0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A"
      issuedPermissions.2.via.0.delay:
-        0
      issuedPermissions.2.to:
+        "0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A"
      issuedPermissions.1.target:
-        "0x674F64D64Ddc198db83cd9047dF54BF89cCD0ddB"
      issuedPermissions.1.to:
+        "0x674F64D64Ddc198db83cd9047dF54BF89cCD0ddB"
      issuedPermissions.0.target:
-        "0x309Fe2536d01867018D120b40e4676723C53A14C"
      issuedPermissions.0.to:
+        "0x309Fe2536d01867018D120b40e4676723C53A14C"
    }
```

```diff
    contract ProxyAdmin (0x470d87b1dae09a454A43D1fD772A561a03276aB7) {
    +++ description: None
      directlyReceivedPermissions.6.target:
-        "0x8B34b14c7c7123459Cf3076b8Cb929BE097d0C07"
      directlyReceivedPermissions.6.from:
+        "0x8B34b14c7c7123459Cf3076b8Cb929BE097d0C07"
      directlyReceivedPermissions.5.target:
-        "0x735aDBbE72226BD52e818E7181953f42E3b0FF21"
      directlyReceivedPermissions.5.from:
+        "0x735aDBbE72226BD52e818E7181953f42E3b0FF21"
      directlyReceivedPermissions.4.target:
-        "0x69216395A62dFb243C05EF4F1C27AF8655096a95"
      directlyReceivedPermissions.4.from:
+        "0x69216395A62dFb243C05EF4F1C27AF8655096a95"
      directlyReceivedPermissions.3.target:
-        "0x5e6432F18Bc5d497B1Ab2288a025Fbf9D69E2221"
      directlyReceivedPermissions.3.from:
+        "0x5e6432F18Bc5d497B1Ab2288a025Fbf9D69E2221"
      directlyReceivedPermissions.2.target:
-        "0x4317ba146D4933D889518a3e5E11Fe7a53199b04"
      directlyReceivedPermissions.2.from:
+        "0x4317ba146D4933D889518a3e5E11Fe7a53199b04"
      directlyReceivedPermissions.1.target:
-        "0x2901dA832a4D0297FF0691100A8E496626cc626D"
      directlyReceivedPermissions.1.from:
+        "0x2901dA832a4D0297FF0691100A8E496626cc626D"
      directlyReceivedPermissions.0.target:
-        "0x50eF494573f28Cad6B64C31b7a00Cdaa48306e15"
      directlyReceivedPermissions.0.from:
+        "0x50eF494573f28Cad6B64C31b7a00Cdaa48306e15"
    }
```

```diff
    contract ConduitMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      receivedPermissions.0.target:
-        "0x5e6432F18Bc5d497B1Ab2288a025Fbf9D69E2221"
      receivedPermissions.0.from:
+        "0x5e6432F18Bc5d497B1Ab2288a025Fbf9D69E2221"
    }
```

```diff
    contract AddressManager (0x50eF494573f28Cad6B64C31b7a00Cdaa48306e15) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      issuedPermissions.0.target:
-        "0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.via.0.description:
-        "set and change address mappings."
      issuedPermissions.0.to:
+        "0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A"
      issuedPermissions.0.description:
+        "set and change address mappings."
    }
```

```diff
    contract SuperchainProxyAdmin (0x543bA4AADBAb8f9025686Bd03993043599c6fB04) {
    +++ description: None
      directlyReceivedPermissions.1.target:
-        "0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
      directlyReceivedPermissions.1.from:
+        "0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
      directlyReceivedPermissions.0.target:
-        "0xdE1FCfB0851916CA5101820A69b13a4E276bd81F"
      directlyReceivedPermissions.0.from:
+        "0xdE1FCfB0851916CA5101820A69b13a4E276bd81F"
    }
```

```diff
    contract SuperchainProxyAdminOwner (0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A) {
    +++ description: None
      receivedPermissions.8.target:
-        "0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
      receivedPermissions.8.from:
+        "0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
      receivedPermissions.7.target:
-        "0x8B34b14c7c7123459Cf3076b8Cb929BE097d0C07"
      receivedPermissions.7.from:
+        "0x8B34b14c7c7123459Cf3076b8Cb929BE097d0C07"
      receivedPermissions.6.target:
-        "0x735aDBbE72226BD52e818E7181953f42E3b0FF21"
      receivedPermissions.6.from:
+        "0x735aDBbE72226BD52e818E7181953f42E3b0FF21"
      receivedPermissions.5.target:
-        "0x69216395A62dFb243C05EF4F1C27AF8655096a95"
      receivedPermissions.5.from:
+        "0x69216395A62dFb243C05EF4F1C27AF8655096a95"
      receivedPermissions.4.target:
-        "0x5e6432F18Bc5d497B1Ab2288a025Fbf9D69E2221"
      receivedPermissions.4.from:
+        "0x5e6432F18Bc5d497B1Ab2288a025Fbf9D69E2221"
      receivedPermissions.3.target:
-        "0x4317ba146D4933D889518a3e5E11Fe7a53199b04"
      receivedPermissions.3.from:
+        "0x4317ba146D4933D889518a3e5E11Fe7a53199b04"
      receivedPermissions.2.target:
-        "0x2901dA832a4D0297FF0691100A8E496626cc626D"
      receivedPermissions.2.from:
+        "0x2901dA832a4D0297FF0691100A8E496626cc626D"
      receivedPermissions.1.target:
-        "0xdE1FCfB0851916CA5101820A69b13a4E276bd81F"
      receivedPermissions.1.from:
+        "0xdE1FCfB0851916CA5101820A69b13a4E276bd81F"
      receivedPermissions.0.target:
-        "0x50eF494573f28Cad6B64C31b7a00Cdaa48306e15"
      receivedPermissions.0.from:
+        "0x50eF494573f28Cad6B64C31b7a00Cdaa48306e15"
      directlyReceivedPermissions.1.target:
-        "0x543bA4AADBAb8f9025686Bd03993043599c6fB04"
      directlyReceivedPermissions.1.from:
+        "0x543bA4AADBAb8f9025686Bd03993043599c6fB04"
      directlyReceivedPermissions.0.target:
-        "0x470d87b1dae09a454A43D1fD772A561a03276aB7"
      directlyReceivedPermissions.0.from:
+        "0x470d87b1dae09a454A43D1fD772A561a03276aB7"
    }
```

```diff
    contract SystemConfig (0x5e6432F18Bc5d497B1Ab2288a025Fbf9D69E2221) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      issuedPermissions.2.target:
-        "0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A"
      issuedPermissions.2.via.0.delay:
-        0
      issuedPermissions.2.to:
+        "0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A"
      issuedPermissions.1.target:
-        "0x99199a22125034c808ff20f377d91187E8050F2E"
      issuedPermissions.1.to:
+        "0x99199a22125034c808ff20f377d91187E8050F2E"
      issuedPermissions.0.target:
-        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      issuedPermissions.0.to:
+        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      issuedPermissions.0.description:
+        "it can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system."
    }
```

```diff
    contract OptimismMintableERC20Factory (0x69216395A62dFb243C05EF4F1C27AF8655096a95) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      issuedPermissions.0.target:
-        "0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A"
    }
```

```diff
    contract L1StandardBridge (0x735aDBbE72226BD52e818E7181953f42E3b0FF21) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      issuedPermissions.0.target:
-        "0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.via.0.description:
-        "upgrading the bridge implementation can give access to all funds escrowed therein."
      issuedPermissions.0.to:
+        "0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A"
      issuedPermissions.0.description:
+        "upgrading the bridge implementation can give access to all funds escrowed therein."
    }
```

```diff
    contract OptimismPortal (0x8B34b14c7c7123459Cf3076b8Cb929BE097d0C07) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      issuedPermissions.3.target:
-        "0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A"
      issuedPermissions.3.via.0.delay:
-        0
      issuedPermissions.3.to:
+        "0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A"
      issuedPermissions.2.target:
-        "0xc2819DC788505Aac350142A7A707BF9D03E3Bd03"
      issuedPermissions.2.via.0.delay:
-        0
      issuedPermissions.2.to:
+        "0xc2819DC788505Aac350142A7A707BF9D03E3Bd03"
      issuedPermissions.1.target:
-        "0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A"
      issuedPermissions.1.via.1.delay:
-        0
      issuedPermissions.1.via.0.delay:
-        0
      issuedPermissions.1.to:
+        "0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A"
      issuedPermissions.0.target:
-        "0x0454092516c9A4d636d3CAfA1e82161376C8a748"
      issuedPermissions.0.via.1.delay:
-        0
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x0454092516c9A4d636d3CAfA1e82161376C8a748"
    }
```

```diff
    contract SuperchainConfig (0x95703e0982140D16f8ebA6d158FccEde42f04a4C) {
    +++ description: Used to manage global configuration values for multiple OP Chains within a single Superchain network. The SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the Superchain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      issuedPermissions.3.target:
-        "0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A"
      issuedPermissions.3.via.0.delay:
-        0
      issuedPermissions.3.to:
+        "0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A"
      issuedPermissions.2.target:
-        "0xc2819DC788505Aac350142A7A707BF9D03E3Bd03"
      issuedPermissions.2.via.0.delay:
-        0
      issuedPermissions.2.to:
+        "0xc2819DC788505Aac350142A7A707BF9D03E3Bd03"
      issuedPermissions.1.target:
-        "0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A"
      issuedPermissions.1.via.1.delay:
-        0
      issuedPermissions.1.via.0.delay:
-        0
      issuedPermissions.1.to:
+        "0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A"
      issuedPermissions.0.target:
-        "0x0454092516c9A4d636d3CAfA1e82161376C8a748"
      issuedPermissions.0.via.1.delay:
-        0
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x0454092516c9A4d636d3CAfA1e82161376C8a748"
    }
```

```diff
    contract OpFoundationOperationsSafe (0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A) {
    +++ description: None
      receivedPermissions.1.target:
-        "0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
      receivedPermissions.1.from:
+        "0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
      receivedPermissions.0.target:
-        "0x8B34b14c7c7123459Cf3076b8Cb929BE097d0C07"
      receivedPermissions.0.from:
+        "0x8B34b14c7c7123459Cf3076b8Cb929BE097d0C07"
      directlyReceivedPermissions.0.target:
-        "0xc6901F65369FC59fC1B4D6D6bE7A2318Ff38dB5B"
      directlyReceivedPermissions.0.from:
+        "0xc6901F65369FC59fC1B4D6D6bE7A2318Ff38dB5B"
    }
```

```diff
    contract SecurityCouncilMultisig (0xc2819DC788505Aac350142A7A707BF9D03E3Bd03) {
    +++ description: None
      receivedPermissions.1.target:
-        "0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
      receivedPermissions.1.from:
+        "0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
      receivedPermissions.0.target:
-        "0x8B34b14c7c7123459Cf3076b8Cb929BE097d0C07"
      receivedPermissions.0.from:
+        "0x8B34b14c7c7123459Cf3076b8Cb929BE097d0C07"
    }
```

```diff
    contract DeputyGuardianModule (0xc6901F65369FC59fC1B4D6D6bE7A2318Ff38dB5B) {
    +++ description: allows the 0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A, called the deputy guardian, to act on behalf of the Gnosis Safe.
      directlyReceivedPermissions.0.target:
-        "0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2"
      directlyReceivedPermissions.0.from:
+        "0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2"
    }
```

```diff
    contract Lib_AddressManager (0xdE1FCfB0851916CA5101820A69b13a4E276bd81F) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      issuedPermissions.0.target:
-        "0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.via.0.description:
-        "set and change address mappings."
      issuedPermissions.0.to:
+        "0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A"
      issuedPermissions.0.description:
+        "set and change address mappings."
    }
```

Generated with discovered.json: 0x3ac0009433b58b86caf389502a4f45ce667d31f4

# Diff at Thu, 16 Jan 2025 12:35:41 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@b471de2d691e0c6d99ad89859efde79edd3d4dfb block: 21628477
- current block number: 21637080

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

Generated with discovered.json: 0x74a25ad7dab442951c2f7f98b2222c63337db01c

# Diff at Wed, 15 Jan 2025 07:46:03 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@3ea176aee1470e5ec80e65adfc81a954f84584d8 block: 21235655
- current block number: 21628477

## Description

Config related: displayName.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21235655 (main branch discovery), not current.

```diff
    contract SuperchainProxyAdmin (0x543bA4AADBAb8f9025686Bd03993043599c6fB04) {
    +++ description: None
      displayName:
+        "ProxyAdmin"
    }
```

Generated with discovered.json: 0x0aa3d1e7c4fd4f8fe8b2000b3a5d6bc00c904036

# Diff at Wed, 08 Jan 2025 09:04:37 GMT:

- chain: ethereum
- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@deefa974378c2cd6b74f061e1f5a494bbbe1d63a block: 21235655
- current block number: 21235655

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21235655 (main branch discovery), not current.

```diff
    contract L1StandardBridge (0x735aDBbE72226BD52e818E7181953f42E3b0FF21) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      description:
-        "The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token."
+        "The main entry point to deposit ERC20 tokens from host chain to this chain."
    }
```

Generated with discovered.json: 0xf73e1117d5feb6cf657bc64d4d9303a11fb1357d

# Diff at Thu, 21 Nov 2024 10:58:06 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@de1745323b367dd0fbb18ad6c862147dd90e90b0 block: 21121972
- current block number: 21235655

## Description

Rename OP-Foundation multisigs

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21121972 (main branch discovery), not current.

```diff
    contract OpFoundationUpgradeSafe (0x847B5c174615B1B7fDF770882256e2D3E95b9D92) {
    +++ description: None
      name:
-        "OptimismFoundationMultisig_1"
+        "OpFoundationUpgradeSafe"
    }
```

```diff
    contract OpFoundationOperationsSafe (0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A) {
    +++ description: None
      name:
-        "OptimismFoundationMultisig_2"
+        "OpFoundationOperationsSafe"
    }
```

Generated with discovered.json: 0xfb61e850286d2e0ab62963eca464971c5e37c360

# Diff at Tue, 05 Nov 2024 14:14:19 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@5e6ce51851b57187ccdd52c4944a82e2a8ab1e88 block: 21078666
- current block number: 21121972

## Description

Config related.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21078666 (main branch discovery), not current.

```diff
    contract OptimismFoundationMultisig_1 (0x847B5c174615B1B7fDF770882256e2D3E95b9D92) {
    +++ description: None
      name:
-        "FoundationMultisig_1"
+        "OptimismFoundationMultisig_1"
    }
```

```diff
    contract OptimismFoundationMultisig_2 (0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A) {
    +++ description: None
      name:
-        "FoundationMultisig_2"
+        "OptimismFoundationMultisig_2"
    }
```

Generated with discovered.json: 0xdc68741dbbcdbfbae745ba2d52c1975d471847bf

# Diff at Fri, 01 Nov 2024 12:10:09 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@cd1f0e71bb08ce16b2084a11b768538e8aa6ba8c block: 21078666
- current block number: 21078666

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21078666 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x470d87b1dae09a454A43D1fD772A561a03276aB7) {
    +++ description: None
      directlyReceivedPermissions.5.description:
-        "upgrading bridge implementation allows to access all funds and change every system component."
+        "upgrading the bridge implementation can give access to all funds escrowed therein."
    }
```

```diff
    contract SuperchainProxyAdminOwner (0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A) {
    +++ description: None
      receivedPermissions.6.description:
-        "upgrading bridge implementation allows to access all funds and change every system component."
+        "upgrading the bridge implementation can give access to all funds escrowed therein."
    }
```

```diff
    contract L1StandardBridge (0x735aDBbE72226BD52e818E7181953f42E3b0FF21) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token.
      issuedPermissions.0.via.0.description:
-        "upgrading bridge implementation allows to access all funds and change every system component."
+        "upgrading the bridge implementation can give access to all funds escrowed therein."
    }
```

Generated with discovered.json: 0x0c5708bd0e5260e72c3cbf44639c886c55681a1d

# Diff at Wed, 30 Oct 2024 13:10:52 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@0a8a53530022c6c5edd257c3682a3e7f80d0c550 block: 20992152
- current block number: 21078666

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

Generated with discovered.json: 0xecb5d2b1186453aaec05cf065c6e08d9ea13daec

# Diff at Tue, 29 Oct 2024 13:13:19 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@7b3fc9dc9074e1d423b48522c3f0273c86aab54a block: 20992152
- current block number: 20992152

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20992152 (main branch discovery), not current.

```diff
    contract L2OutputOracle (0x4317ba146D4933D889518a3e5E11Fe7a53199b04) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      fieldMeta:
+        {"FINALIZATION_PERIOD_SECONDS":{"description":"Challenge period (Number of seconds until a state root is finalized)."}}
    }
```

Generated with discovered.json: 0xb03ed59466a586dd4080d5dac302d1b0df8c5c5f

# Diff at Mon, 21 Oct 2024 12:46:10 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@e660599f23a07618fe949a07be1f516ce44f1914 block: 20992152
- current block number: 20992152

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20992152 (main branch discovery), not current.

```diff
    contract LivenessModule (0x0454092516c9A4d636d3CAfA1e82161376C8a748) {
    +++ description: used to remove members inactive for 98d while making sure that the threshold remains above 75%. If the number of members falls below 8, the 0x847B5c174615B1B7fDF770882256e2D3E95b9D92 takes ownership of the multisig
      descriptions:
-        ["used to remove members inactive for 98d while making sure that the threshold remains above 75%. If the number of members falls below 8, the 0x847B5c174615B1B7fDF770882256e2D3E95b9D92 takes ownership of the multisig"]
      description:
+        "used to remove members inactive for 98d while making sure that the threshold remains above 75%. If the number of members falls below 8, the 0x847B5c174615B1B7fDF770882256e2D3E95b9D92 takes ownership of the multisig"
    }
```

```diff
    contract L1ERC721Bridge (0x2901dA832a4D0297FF0691100A8E496626cc626D) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      descriptions:
-        ["Used to bridge ERC-721 tokens from host chain to this chain."]
      description:
+        "Used to bridge ERC-721 tokens from host chain to this chain."
    }
```

```diff
    contract L2OutputOracle (0x4317ba146D4933D889518a3e5E11Fe7a53199b04) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      descriptions:
-        ["Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots."]
      description:
+        "Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots."
    }
```

```diff
    contract AddressManager (0x50eF494573f28Cad6B64C31b7a00Cdaa48306e15) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      descriptions:
-        ["Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts."]
      description:
+        "Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts."
    }
```

```diff
    contract SystemConfig (0x5e6432F18Bc5d497B1Ab2288a025Fbf9D69E2221) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      descriptions:
-        ["Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address."]
      description:
+        "Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address."
    }
```

```diff
    contract OptimismMintableERC20Factory (0x69216395A62dFb243C05EF4F1C27AF8655096a95) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      descriptions:
-        ["A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa."]
      description:
+        "A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa."
    }
```

```diff
    contract L1StandardBridge (0x735aDBbE72226BD52e818E7181953f42E3b0FF21) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token.
      descriptions:
-        ["The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token."]
      description:
+        "The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token."
    }
```

```diff
    contract OptimismPortal (0x8B34b14c7c7123459Cf3076b8Cb929BE097d0C07) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      descriptions:
-        ["The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals."]
      description:
+        "The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals."
    }
```

```diff
    contract SuperchainConfig (0x95703e0982140D16f8ebA6d158FccEde42f04a4C) {
    +++ description: Used to manage global configuration values for multiple OP Chains within a single Superchain network. The SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the Superchain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      descriptions:
-        ["Used to manage global configuration values for multiple OP Chains within a single Superchain network. The SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the Superchain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system."]
      description:
+        "Used to manage global configuration values for multiple OP Chains within a single Superchain network. The SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the Superchain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system."
    }
```

```diff
    contract L1CrossDomainMessenger (0x95bDCA6c8EdEB69C98Bd5bd17660BaCef1298A6f) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      descriptions:
-        ["Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function."]
      description:
+        "Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function."
    }
```

```diff
    contract DeputyGuardianModule (0xc6901F65369FC59fC1B4D6D6bE7A2318Ff38dB5B) {
    +++ description: allows the 0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A, called the deputy guardian, to act on behalf of the Gnosis Safe.
      descriptions:
-        ["allows the 0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A, called the deputy guardian, to act on behalf of the Gnosis Safe."]
      description:
+        "allows the 0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A, called the deputy guardian, to act on behalf of the Gnosis Safe."
    }
```

```diff
    contract Lib_AddressManager (0xdE1FCfB0851916CA5101820A69b13a4E276bd81F) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      descriptions:
-        ["Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts."]
      description:
+        "Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts."
    }
```

Generated with discovered.json: 0x0c513b3ea82679c08485fc13a34b3e3f7168fd24

# Diff at Mon, 21 Oct 2024 11:07:54 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@8895d33866f5665c4c710f4ddaa32bfa63cc3c78 block: 20992152
- current block number: 20992152

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20992152 (main branch discovery), not current.

```diff
    contract L1ERC721Bridge (0x2901dA832a4D0297FF0691100A8E496626cc626D) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      values.$pastUpgrades.2.2:
+        ["0xAE2AF01232a6c4a4d3012C5eC5b1b35059caF10d"]
      values.$pastUpgrades.2.1:
-        ["0xAE2AF01232a6c4a4d3012C5eC5b1b35059caF10d"]
+        "0xfd62d0d284c8655e916a5cdd2472b461ed5686ab1414b834a1ffdb06a44f63b4"
      values.$pastUpgrades.1.2:
+        ["0xd81f43eDBCAcb4c29a9bA38a13Ee5d79278270cC"]
      values.$pastUpgrades.1.1:
-        ["0xd81f43eDBCAcb4c29a9bA38a13Ee5d79278270cC"]
+        "0xfd62d0d284c8655e916a5cdd2472b461ed5686ab1414b834a1ffdb06a44f63b4"
      values.$pastUpgrades.0.2:
+        ["0x8b91Af069928bA6591c950354d1EA29e08192Bf8"]
      values.$pastUpgrades.0.1:
-        ["0x8b91Af069928bA6591c950354d1EA29e08192Bf8"]
+        "0xb29209e447dc6b3a0e8b8980a5412f3f964d63e500b75ec78773454d948e2b31"
    }
```

```diff
    contract L2OutputOracle (0x4317ba146D4933D889518a3e5E11Fe7a53199b04) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      values.$pastUpgrades.2.2:
+        ["0xF243BEd163251380e78068d317ae10f26042B292"]
      values.$pastUpgrades.2.1:
-        ["0xF243BEd163251380e78068d317ae10f26042B292"]
+        "0xfd62d0d284c8655e916a5cdd2472b461ed5686ab1414b834a1ffdb06a44f63b4"
      values.$pastUpgrades.1.2:
+        ["0xd81f43eDBCAcb4c29a9bA38a13Ee5d79278270cC"]
      values.$pastUpgrades.1.1:
-        ["0xd81f43eDBCAcb4c29a9bA38a13Ee5d79278270cC"]
+        "0xfd62d0d284c8655e916a5cdd2472b461ed5686ab1414b834a1ffdb06a44f63b4"
      values.$pastUpgrades.0.2:
+        ["0x6093023a4A7E6873EDFb02B4bCE48c53FD310EEc"]
      values.$pastUpgrades.0.1:
-        ["0x6093023a4A7E6873EDFb02B4bCE48c53FD310EEc"]
+        "0x735c6ee808c97d94ef495d8c16bf5c7bbdbec39a99be006ab5e623b0027fb376"
    }
```

```diff
    contract SystemConfig (0x5e6432F18Bc5d497B1Ab2288a025Fbf9D69E2221) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      values.$pastUpgrades.2.2:
+        ["0xba2492e52F45651B60B8B38d4Ea5E2390C64Ffb1"]
      values.$pastUpgrades.2.1:
-        ["0xba2492e52F45651B60B8B38d4Ea5E2390C64Ffb1"]
+        "0xfd62d0d284c8655e916a5cdd2472b461ed5686ab1414b834a1ffdb06a44f63b4"
      values.$pastUpgrades.1.2:
+        ["0xd81f43eDBCAcb4c29a9bA38a13Ee5d79278270cC"]
      values.$pastUpgrades.1.1:
-        ["0xd81f43eDBCAcb4c29a9bA38a13Ee5d79278270cC"]
+        "0xfd62d0d284c8655e916a5cdd2472b461ed5686ab1414b834a1ffdb06a44f63b4"
      values.$pastUpgrades.0.2:
+        ["0x951754B08C52b2aC5d5a2aF1D52C2D12aED5Bcaf"]
      values.$pastUpgrades.0.1:
-        ["0x951754B08C52b2aC5d5a2aF1D52C2D12aED5Bcaf"]
+        "0x8473b263561fb96ae9e89d6254e2bdda4bcb7b3d75442c49b4528defab1bf382"
    }
```

```diff
    contract OptimismMintableERC20Factory (0x69216395A62dFb243C05EF4F1C27AF8655096a95) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      values.$pastUpgrades.2.2:
+        ["0xE01efbeb1089D1d1dB9c6c8b135C934C0734c846"]
      values.$pastUpgrades.2.1:
-        ["0xE01efbeb1089D1d1dB9c6c8b135C934C0734c846"]
+        "0xfd62d0d284c8655e916a5cdd2472b461ed5686ab1414b834a1ffdb06a44f63b4"
      values.$pastUpgrades.1.2:
+        ["0xd81f43eDBCAcb4c29a9bA38a13Ee5d79278270cC"]
      values.$pastUpgrades.1.1:
-        ["0xd81f43eDBCAcb4c29a9bA38a13Ee5d79278270cC"]
+        "0xfd62d0d284c8655e916a5cdd2472b461ed5686ab1414b834a1ffdb06a44f63b4"
      values.$pastUpgrades.0.2:
+        ["0xc0c6A811BBf07FA01b946F1C46a9A94c2eE8C73E"]
      values.$pastUpgrades.0.1:
-        ["0xc0c6A811BBf07FA01b946F1C46a9A94c2eE8C73E"]
+        "0x8a428a8fcd89e1f7bd5dcbe87d31ba8f81a0d857bbcf1a7bf9a1a030b37dbe7c"
    }
```

```diff
    contract OptimismPortal (0x8B34b14c7c7123459Cf3076b8Cb929BE097d0C07) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      values.$pastUpgrades.6.2:
+        ["0x2D778797049FE9259d947D1ED8e5442226dFB589"]
      values.$pastUpgrades.6.1:
-        ["0x2D778797049FE9259d947D1ED8e5442226dFB589"]
+        "0x9154d2b581e84b15615b4a857476af9fa6b682622d6e30e7c28bae6331a5fe39"
      values.$pastUpgrades.5.2:
+        ["0x57e5AB742DDa19b60Fa2A43275722296B05A661A"]
      values.$pastUpgrades.5.1:
-        ["0x57e5AB742DDa19b60Fa2A43275722296B05A661A"]
+        "0x9154d2b581e84b15615b4a857476af9fa6b682622d6e30e7c28bae6331a5fe39"
      values.$pastUpgrades.4.2:
+        ["0x2D778797049FE9259d947D1ED8e5442226dFB589"]
      values.$pastUpgrades.4.1:
-        ["0x2D778797049FE9259d947D1ED8e5442226dFB589"]
+        "0xa313efb0fa16910e1b0b17dc5ad9890de6d45a95f12c78b2d3ae312daf212785"
      values.$pastUpgrades.3.2:
+        ["0x57e5AB742DDa19b60Fa2A43275722296B05A661A"]
      values.$pastUpgrades.3.1:
-        ["0x57e5AB742DDa19b60Fa2A43275722296B05A661A"]
+        "0xa313efb0fa16910e1b0b17dc5ad9890de6d45a95f12c78b2d3ae312daf212785"
      values.$pastUpgrades.2.2:
+        ["0x2D778797049FE9259d947D1ED8e5442226dFB589"]
      values.$pastUpgrades.2.1:
-        ["0x2D778797049FE9259d947D1ED8e5442226dFB589"]
+        "0xfd62d0d284c8655e916a5cdd2472b461ed5686ab1414b834a1ffdb06a44f63b4"
      values.$pastUpgrades.1.2:
+        ["0xd81f43eDBCAcb4c29a9bA38a13Ee5d79278270cC"]
      values.$pastUpgrades.1.1:
-        ["0xd81f43eDBCAcb4c29a9bA38a13Ee5d79278270cC"]
+        "0xfd62d0d284c8655e916a5cdd2472b461ed5686ab1414b834a1ffdb06a44f63b4"
      values.$pastUpgrades.0.2:
+        ["0xad3DC277d3242938F8Be18f0560e3d9B9988C46A"]
      values.$pastUpgrades.0.1:
-        ["0xad3DC277d3242938F8Be18f0560e3d9B9988C46A"]
+        "0x1143694680c231c1cae10bbffc56cdd0643ab0efb3e433a4aced170af72fc37e"
    }
```

```diff
    contract SuperchainConfig (0x95703e0982140D16f8ebA6d158FccEde42f04a4C) {
    +++ description: Used to manage global configuration values for multiple OP Chains within a single Superchain network. The SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the Superchain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      values.$pastUpgrades.2.2:
+        ["0x53c165169401764778F780a69701385eb0FF19B7"]
      values.$pastUpgrades.2.1:
-        ["0x53c165169401764778F780a69701385eb0FF19B7"]
+        "0xe361c0d4ae3aebc94b3f281ee372fbb1cbdb0c33ca8b1b35e7f3b009b2fcbdb0"
      values.$pastUpgrades.1.2:
+        ["0xd81f43eDBCAcb4c29a9bA38a13Ee5d79278270cC"]
      values.$pastUpgrades.1.1:
-        ["0xd81f43eDBCAcb4c29a9bA38a13Ee5d79278270cC"]
+        "0xe361c0d4ae3aebc94b3f281ee372fbb1cbdb0c33ca8b1b35e7f3b009b2fcbdb0"
      values.$pastUpgrades.0.2:
+        ["0x53c165169401764778F780a69701385eb0FF19B7"]
      values.$pastUpgrades.0.1:
-        ["0x53c165169401764778F780a69701385eb0FF19B7"]
+        "0x8ba0e42b89cde22310b644ed30fd44e4a348619a165a54c908e7dc341e9bbd0c"
    }
```

```diff
    contract L1CrossDomainMessenger (0x95bDCA6c8EdEB69C98Bd5bd17660BaCef1298A6f) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      values.$pastUpgrades.3.2:
+        ["0xD3494713A5cfaD3F5359379DfA074E2Ac8C6Fd65"]
      values.$pastUpgrades.3.1:
-        ["0xD3494713A5cfaD3F5359379DfA074E2Ac8C6Fd65"]
+        "0xfd62d0d284c8655e916a5cdd2472b461ed5686ab1414b834a1ffdb06a44f63b4"
      values.$pastUpgrades.2.2:
+        ["0xd81f43eDBCAcb4c29a9bA38a13Ee5d79278270cC"]
      values.$pastUpgrades.2.1:
-        ["0xd81f43eDBCAcb4c29a9bA38a13Ee5d79278270cC"]
+        "0xfd62d0d284c8655e916a5cdd2472b461ed5686ab1414b834a1ffdb06a44f63b4"
      values.$pastUpgrades.1.2:
+        ["0x14DdD08c0e28764FC89a266eC95A93619b0EE835"]
      values.$pastUpgrades.1.1:
-        ["0x14DdD08c0e28764FC89a266eC95A93619b0EE835"]
+        "0xad662056dcd7390e217500699f06939418ccd55cf0ee8c5839cc5f5e90b84292"
      values.$pastUpgrades.0.2:
+        ["0x95bDCA6c8EdEB69C98Bd5bd17660BaCef1298A6f"]
      values.$pastUpgrades.0.1:
-        ["0x95bDCA6c8EdEB69C98Bd5bd17660BaCef1298A6f"]
+        "0x58e9f85e8dff61e2d9b22bf79fc2052bc497cc5dd18a8e72e99d436fe229acb6"
    }
```

Generated with discovered.json: 0xd113402b09acdc56661695ad0555b96fe9c0e88d

# Diff at Fri, 18 Oct 2024 11:29:19 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@8bd58d38d84243da335cc86dc9fccafce6e4a0a9 block: 20927606
- current block number: 20992152

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20927606 (main branch discovery), not current.

```diff
    contract LivenessModule (0x0454092516c9A4d636d3CAfA1e82161376C8a748) {
    +++ description: used to remove members inactive for 98d while making sure that the threshold remains above 75%. If the number of members falls below 8, the 0x847B5c174615B1B7fDF770882256e2D3E95b9D92 takes ownership of the multisig
      receivedPermissions:
+        [{"permission":"guard","target":"0x8B34b14c7c7123459Cf3076b8Cb929BE097d0C07","via":[{"address":"0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2"},{"address":"0xc2819DC788505Aac350142A7A707BF9D03E3Bd03"}]},{"permission":"guard","target":"0x95703e0982140D16f8ebA6d158FccEde42f04a4C","via":[{"address":"0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2"},{"address":"0xc2819DC788505Aac350142A7A707BF9D03E3Bd03"}]}]
      directlyReceivedPermissions:
+        [{"permission":"act","target":"0xc2819DC788505Aac350142A7A707BF9D03E3Bd03"}]
    }
```

```diff
    contract OptimismPortal (0x8B34b14c7c7123459Cf3076b8Cb929BE097d0C07) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      issuedPermissions.3:
+        {"permission":"upgrade","target":"0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A","via":[{"address":"0x470d87b1dae09a454A43D1fD772A561a03276aB7","delay":0}]}
      issuedPermissions.2:
+        {"permission":"guard","target":"0xc2819DC788505Aac350142A7A707BF9D03E3Bd03","via":[{"address":"0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2","delay":0}]}
      issuedPermissions.1.permission:
-        "upgrade"
+        "guard"
      issuedPermissions.1.target:
-        "0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A"
+        "0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A"
      issuedPermissions.1.via.1:
+        {"address":"0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2","delay":0}
      issuedPermissions.1.via.0.address:
-        "0x470d87b1dae09a454A43D1fD772A561a03276aB7"
+        "0xc6901F65369FC59fC1B4D6D6bE7A2318Ff38dB5B"
      issuedPermissions.0.target:
-        "0xc2819DC788505Aac350142A7A707BF9D03E3Bd03"
+        "0x0454092516c9A4d636d3CAfA1e82161376C8a748"
      issuedPermissions.0.via.1:
+        {"address":"0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2","delay":0}
      issuedPermissions.0.via.0.address:
-        "0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2"
+        "0xc2819DC788505Aac350142A7A707BF9D03E3Bd03"
    }
```

```diff
    contract SuperchainConfig (0x95703e0982140D16f8ebA6d158FccEde42f04a4C) {
    +++ description: Used to manage global configuration values for multiple OP Chains within a single Superchain network. The SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the Superchain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      issuedPermissions.3:
+        {"permission":"upgrade","target":"0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A","via":[{"address":"0x543bA4AADBAb8f9025686Bd03993043599c6fB04","delay":0}]}
      issuedPermissions.2:
+        {"permission":"guard","target":"0xc2819DC788505Aac350142A7A707BF9D03E3Bd03","via":[{"address":"0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2","delay":0}]}
      issuedPermissions.1.permission:
-        "upgrade"
+        "guard"
      issuedPermissions.1.target:
-        "0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A"
+        "0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A"
      issuedPermissions.1.via.1:
+        {"address":"0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2","delay":0}
      issuedPermissions.1.via.0.address:
-        "0x543bA4AADBAb8f9025686Bd03993043599c6fB04"
+        "0xc6901F65369FC59fC1B4D6D6bE7A2318Ff38dB5B"
      issuedPermissions.0.target:
-        "0xc2819DC788505Aac350142A7A707BF9D03E3Bd03"
+        "0x0454092516c9A4d636d3CAfA1e82161376C8a748"
      issuedPermissions.0.via.1:
+        {"address":"0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2","delay":0}
      issuedPermissions.0.via.0.address:
-        "0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2"
+        "0xc2819DC788505Aac350142A7A707BF9D03E3Bd03"
    }
```

```diff
    contract FoundationMultisig_2 (0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A) {
    +++ description: None
      receivedPermissions:
+        [{"permission":"guard","target":"0x8B34b14c7c7123459Cf3076b8Cb929BE097d0C07","via":[{"address":"0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2"},{"address":"0xc6901F65369FC59fC1B4D6D6bE7A2318Ff38dB5B"}]},{"permission":"guard","target":"0x95703e0982140D16f8ebA6d158FccEde42f04a4C","via":[{"address":"0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2"},{"address":"0xc6901F65369FC59fC1B4D6D6bE7A2318Ff38dB5B"}]}]
      directlyReceivedPermissions:
+        [{"permission":"act","target":"0xc6901F65369FC59fC1B4D6D6bE7A2318Ff38dB5B"}]
    }
```

```diff
    contract DeputyGuardianModule (0xc6901F65369FC59fC1B4D6D6bE7A2318Ff38dB5B) {
    +++ description: allows the 0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A, called the deputy guardian, to act on behalf of the Gnosis Safe.
      directlyReceivedPermissions:
+        [{"permission":"act","target":"0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2"}]
    }
```

Generated with discovered.json: 0x0b3978bc11e42d4b96e58301a2c0a9cb3296a245

# Diff at Wed, 16 Oct 2024 11:38:04 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@a3d139b799cc0b28e5e912febb17464d4e5aef5d block: 20927606
- current block number: 20927606

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20927606 (main branch discovery), not current.

```diff
    contract SuperchainGuardianMultisig (0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2) {
    +++ description: None
      roles:
-        ["Guardian"]
      directlyReceivedPermissions:
+        [{"permission":"guard","target":"0x8B34b14c7c7123459Cf3076b8Cb929BE097d0C07"},{"permission":"guard","target":"0x95703e0982140D16f8ebA6d158FccEde42f04a4C"}]
    }
```

```diff
    contract ModeMultisig (0x309Fe2536d01867018D120b40e4676723C53A14C) {
    +++ description: None
      roles:
-        ["Challenger"]
      receivedPermissions:
+        [{"permission":"challenge","target":"0x4317ba146D4933D889518a3e5E11Fe7a53199b04"}]
    }
```

```diff
    contract L2OutputOracle (0x4317ba146D4933D889518a3e5E11Fe7a53199b04) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      issuedPermissions.2:
+        {"permission":"upgrade","target":"0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A","via":[{"address":"0x470d87b1dae09a454A43D1fD772A561a03276aB7","delay":0}]}
      issuedPermissions.1:
+        {"permission":"propose","target":"0x674F64D64Ddc198db83cd9047dF54BF89cCD0ddB","via":[]}
      issuedPermissions.0.permission:
-        "upgrade"
+        "challenge"
      issuedPermissions.0.target:
-        "0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A"
+        "0x309Fe2536d01867018D120b40e4676723C53A14C"
      issuedPermissions.0.via.0:
-        {"address":"0x470d87b1dae09a454A43D1fD772A561a03276aB7","delay":0}
    }
```

```diff
    contract SystemConfig (0x5e6432F18Bc5d497B1Ab2288a025Fbf9D69E2221) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      issuedPermissions.2:
+        {"permission":"upgrade","target":"0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A","via":[{"address":"0x470d87b1dae09a454A43D1fD772A561a03276aB7","delay":0}]}
      issuedPermissions.1.permission:
-        "upgrade"
+        "sequence"
      issuedPermissions.1.target:
-        "0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A"
+        "0x99199a22125034c808ff20f377d91187E8050F2E"
      issuedPermissions.1.via.0:
-        {"address":"0x470d87b1dae09a454A43D1fD772A561a03276aB7","delay":0}
    }
```

```diff
    contract OptimismPortal (0x8B34b14c7c7123459Cf3076b8Cb929BE097d0C07) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      issuedPermissions.1:
+        {"permission":"upgrade","target":"0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A","via":[{"address":"0x470d87b1dae09a454A43D1fD772A561a03276aB7","delay":0}]}
      issuedPermissions.0.permission:
-        "upgrade"
+        "guard"
      issuedPermissions.0.target:
-        "0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A"
+        "0xc2819DC788505Aac350142A7A707BF9D03E3Bd03"
      issuedPermissions.0.via.0.address:
-        "0x470d87b1dae09a454A43D1fD772A561a03276aB7"
+        "0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2"
    }
```

```diff
    contract SuperchainConfig (0x95703e0982140D16f8ebA6d158FccEde42f04a4C) {
    +++ description: Used to manage global configuration values for multiple OP Chains within a single Superchain network. The SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the Superchain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      issuedPermissions.1:
+        {"permission":"upgrade","target":"0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A","via":[{"address":"0x543bA4AADBAb8f9025686Bd03993043599c6fB04","delay":0}]}
      issuedPermissions.0.permission:
-        "upgrade"
+        "guard"
      issuedPermissions.0.target:
-        "0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A"
+        "0xc2819DC788505Aac350142A7A707BF9D03E3Bd03"
      issuedPermissions.0.via.0.address:
-        "0x543bA4AADBAb8f9025686Bd03993043599c6fB04"
+        "0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2"
    }
```

```diff
    contract SecurityCouncilMultisig (0xc2819DC788505Aac350142A7A707BF9D03E3Bd03) {
    +++ description: None
      receivedPermissions:
+        [{"permission":"guard","target":"0x8B34b14c7c7123459Cf3076b8Cb929BE097d0C07","via":[{"address":"0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2"}]},{"permission":"guard","target":"0x95703e0982140D16f8ebA6d158FccEde42f04a4C","via":[{"address":"0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2"}]}]
    }
```

Generated with discovered.json: 0xdaa08358618ca3ced8c8aba3f23e26a5381ced85

# Diff at Mon, 14 Oct 2024 10:53:08 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1afc77ff111ceb0970e7d09efcc7b2f376b0c281 block: 20927606
- current block number: 20927606

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20927606 (main branch discovery), not current.

```diff
    contract LivenessModule (0x0454092516c9A4d636d3CAfA1e82161376C8a748) {
    +++ description: used to remove members inactive for 98d while making sure that the threshold remains above 75%. If the number of members falls below 8, the 0x847B5c174615B1B7fDF770882256e2D3E95b9D92 takes ownership of the multisig
      sourceHashes:
+        ["0x998654cb64c7fc216505bdb3322b20e7d7c95704005228ad1f878bc631c4af8d"]
    }
```

```diff
    contract SuperchainGuardianMultisig (0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2) {
    +++ description: None
      sourceHashes:
+        ["0x81a7349eebb98ac33b0bc6842e3cb258034a8f2a4ba004570bb8e2e25947f9ff","0xd42bbf9f7dcd3720a7fc6bdc6edfdfae8800a37d6dd4decfa0ef6ca4a2e88940"]
    }
```

```diff
    contract LivenessGuard (0x24424336F04440b1c28685a38303aC33C9D14a25) {
    +++ description: None
      sourceHashes:
+        ["0xe771f3d1c51456e08e2c93a904b12010870dc4fa79ee82e4bc90433557931f05"]
    }
```

```diff
    contract L1ERC721Bridge (0x2901dA832a4D0297FF0691100A8E496626cc626D) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      sourceHashes:
+        ["0x2cdcfef705094aaac53d507bad64d27b48ea5a9c11a7fadffacc192aab7a823f","0x482ec6e91304ac39a3fb4505634427bddfddee23b8e93a4f7f995ca5083ae3c3"]
    }
```

```diff
    contract ModeMultisig (0x309Fe2536d01867018D120b40e4676723C53A14C) {
    +++ description: None
      sourceHashes:
+        ["0x81a7349eebb98ac33b0bc6842e3cb258034a8f2a4ba004570bb8e2e25947f9ff","0xd42bbf9f7dcd3720a7fc6bdc6edfdfae8800a37d6dd4decfa0ef6ca4a2e88940"]
    }
```

```diff
    contract GnosisSafe (0x42d27eEA1AD6e22Af6284F609847CB3Cd56B9c64) {
    +++ description: None
      sourceHashes:
+        ["0x81a7349eebb98ac33b0bc6842e3cb258034a8f2a4ba004570bb8e2e25947f9ff","0xd42bbf9f7dcd3720a7fc6bdc6edfdfae8800a37d6dd4decfa0ef6ca4a2e88940"]
    }
```

```diff
    contract L2OutputOracle (0x4317ba146D4933D889518a3e5E11Fe7a53199b04) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      sourceHashes:
+        ["0x2cdcfef705094aaac53d507bad64d27b48ea5a9c11a7fadffacc192aab7a823f","0x025c187b0231be4785898f25f98d749f953f5d06781772aef242812e2ecf52e3"]
    }
```

```diff
    contract ProxyAdmin (0x470d87b1dae09a454A43D1fD772A561a03276aB7) {
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
    contract AddressManager (0x50eF494573f28Cad6B64C31b7a00Cdaa48306e15) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      sourceHashes:
+        ["0xdc86a850f11dc2b5c0472a05d0e3c14f239baf2c3b1ab19631591b0827985380"]
    }
```

```diff
    contract SuperchainProxyAdmin (0x543bA4AADBAb8f9025686Bd03993043599c6fB04) {
    +++ description: None
      template:
-        "opstack/ProxyAdmin"
+        "global/ProxyAdmin"
      sourceHashes:
+        ["0x96d2f0fa1bd83ebd61ba6a2351c64c7fda7aa580b11ea67bb6bf4338e5c28512"]
    }
```

```diff
    contract SuperchainProxyAdminOwner (0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A) {
    +++ description: None
      sourceHashes:
+        ["0x81a7349eebb98ac33b0bc6842e3cb258034a8f2a4ba004570bb8e2e25947f9ff","0xd42bbf9f7dcd3720a7fc6bdc6edfdfae8800a37d6dd4decfa0ef6ca4a2e88940"]
    }
```

```diff
    contract SystemConfig (0x5e6432F18Bc5d497B1Ab2288a025Fbf9D69E2221) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      sourceHashes:
+        ["0x2cdcfef705094aaac53d507bad64d27b48ea5a9c11a7fadffacc192aab7a823f","0xdf9a11b46747139bfe0135df8a65a2728a2dbd60a689e2398c45627915cdd752"]
    }
```

```diff
    contract OptimismMintableERC20Factory (0x69216395A62dFb243C05EF4F1C27AF8655096a95) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      sourceHashes:
+        ["0x2cdcfef705094aaac53d507bad64d27b48ea5a9c11a7fadffacc192aab7a823f","0x4c5ac4e53576924cabbd2a471f368a541bc3f4b1f53fa41a389692fcc62f6176"]
    }
```

```diff
    contract L1StandardBridge (0x735aDBbE72226BD52e818E7181953f42E3b0FF21) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token.
      sourceHashes:
+        ["0xbfb58685ff2f2f07eaa01a3c4e3c33c97686bfd3ae7c50c49f9da6ef5098cb31","0x1010ff7f40ab4d53e6d9996aefa04423dabe9d0e22fac2d02b330ed3aa2c5740"]
    }
```

```diff
    contract FoundationMultisig_1 (0x847B5c174615B1B7fDF770882256e2D3E95b9D92) {
    +++ description: None
      sourceHashes:
+        ["0x81a7349eebb98ac33b0bc6842e3cb258034a8f2a4ba004570bb8e2e25947f9ff","0xd42bbf9f7dcd3720a7fc6bdc6edfdfae8800a37d6dd4decfa0ef6ca4a2e88940"]
    }
```

```diff
    contract OptimismPortal (0x8B34b14c7c7123459Cf3076b8Cb929BE097d0C07) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      sourceHashes:
+        ["0x2cdcfef705094aaac53d507bad64d27b48ea5a9c11a7fadffacc192aab7a823f","0xe35fb7bc0433439337b3eadda3d6fb7991918162f62a337a695e8c7f948cdd35"]
    }
```

```diff
    contract SuperchainConfig (0x95703e0982140D16f8ebA6d158FccEde42f04a4C) {
    +++ description: Used to manage global configuration values for multiple OP Chains within a single Superchain network. The SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the Superchain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      sourceHashes:
+        ["0x7913a1d7d0c47796c94eb6f8fd87a89ae9f2716eda57c9be4fd2b27c70bed617","0x3ac96c9c95e25f689f65a50f24b325e3f891029cb1cea96dc642418bbb535b1d"]
    }
```

```diff
    contract L1CrossDomainMessenger (0x95bDCA6c8EdEB69C98Bd5bd17660BaCef1298A6f) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      sourceHashes:
+        ["0x20a2eb4d3677fc8a15e944f7b1843acd01b2e92acdc4c7a7f7a35b07b891149b","0x1cc8a3b7de3d2c54c4706bb3f3015714d3b56647fc9fbfd6f8b068f5f63c1c25"]
    }
```

```diff
    contract FoundationMultisig_2 (0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A) {
    +++ description: None
      sourceHashes:
+        ["0xd5a33441170541b7df25812e0e3dff6562b2f09ab835a6b431cb9e7198a47605","0x263aadde480629cd3ca5704cc7d4e7df809d437e68f8d9864039801ddf820367"]
    }
```

```diff
    contract SecurityCouncilMultisig (0xc2819DC788505Aac350142A7A707BF9D03E3Bd03) {
    +++ description: None
      sourceHashes:
+        ["0x81a7349eebb98ac33b0bc6842e3cb258034a8f2a4ba004570bb8e2e25947f9ff","0xd42bbf9f7dcd3720a7fc6bdc6edfdfae8800a37d6dd4decfa0ef6ca4a2e88940"]
    }
```

```diff
    contract DeputyGuardianModule (0xc6901F65369FC59fC1B4D6D6bE7A2318Ff38dB5B) {
    +++ description: allows the 0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A, called the deputy guardian, to act on behalf of the Gnosis Safe.
      sourceHashes:
+        ["0x9624d67fb3738cf1ce1e1f48e2cf433e9373345386943d12f1d751d6b8475cd6"]
    }
```

```diff
    contract Lib_AddressManager (0xdE1FCfB0851916CA5101820A69b13a4E276bd81F) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      sourceHashes:
+        ["0xe5211497d15a7ea75577cf992ab6093dd0f6083f45c955f0136737810e44c205"]
    }
```

Generated with discovered.json: 0xc08ce36d3dc3387fb28ac770b64a2c5d0a716805

# Diff at Wed, 09 Oct 2024 13:10:09 GMT:

- chain: ethereum
- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@37683e2b3d0587372f886eef49e921277810c8bf block: 20769559
- current block number: 20927606

## Description

Move to discovery driven data.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20769559 (main branch discovery), not current.

```diff
    contract SuperchainGuardianMultisig (0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2) {
    +++ description: None
      name:
-        "GuardianMultisig"
+        "SuperchainGuardianMultisig"
    }
```

```diff
    contract ModeMultisig (0x309Fe2536d01867018D120b40e4676723C53A14C) {
    +++ description: None
      name:
-        "ChallengerMultisig"
+        "ModeMultisig"
    }
```

```diff
    contract ProxyAdmin (0x470d87b1dae09a454A43D1fD772A561a03276aB7) {
    +++ description: None
      directlyReceivedPermissions.0.description:
+        "set and change address mappings."
    }
```

```diff
    contract AddressManager (0x50eF494573f28Cad6B64C31b7a00Cdaa48306e15) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      issuedPermissions.0.via.0.description:
+        "set and change address mappings."
      descriptions:
+        ["Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts."]
    }
```

```diff
    contract SuperchainProxyAdmin (0x543bA4AADBAb8f9025686Bd03993043599c6fB04) {
    +++ description: None
      directlyReceivedPermissions.0.description:
+        "set and change address mappings."
    }
```

```diff
    contract SuperchainProxyAdminOwner (0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A) {
    +++ description: None
      receivedPermissions.1.description:
+        "set and change address mappings."
      receivedPermissions.0.description:
+        "set and change address mappings."
    }
```

```diff
    contract Lib_AddressManager (0xdE1FCfB0851916CA5101820A69b13a4E276bd81F) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      issuedPermissions.0.via.0.description:
+        "set and change address mappings."
      displayName:
+        "AddressManager"
      descriptions:
+        ["Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts."]
    }
```

Generated with discovered.json: 0x82ac0decd951d4449afa308861fdbfe561f2301b

# Diff at Tue, 01 Oct 2024 10:53:10 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bd754dc73c66120164006054f8d25c5fae9cd910 block: 20769559
- current block number: 20769559

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20769559 (main branch discovery), not current.

```diff
    contract L1ERC721Bridge (0x2901dA832a4D0297FF0691100A8E496626cc626D) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      values.$pastUpgrades:
+        [["2023-11-16T20:47:11.000Z",["0x8b91Af069928bA6591c950354d1EA29e08192Bf8"]],["2024-04-19T18:22:11.000Z",["0xd81f43eDBCAcb4c29a9bA38a13Ee5d79278270cC"]],["2024-04-19T18:22:11.000Z",["0xAE2AF01232a6c4a4d3012C5eC5b1b35059caF10d"]]]
    }
```

```diff
    contract L2OutputOracle (0x4317ba146D4933D889518a3e5E11Fe7a53199b04) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      values.$pastUpgrades:
+        [["2023-11-16T20:47:11.000Z",["0x6093023a4A7E6873EDFb02B4bCE48c53FD310EEc"]],["2024-04-19T18:22:11.000Z",["0xd81f43eDBCAcb4c29a9bA38a13Ee5d79278270cC"]],["2024-04-19T18:22:11.000Z",["0xF243BEd163251380e78068d317ae10f26042B292"]]]
    }
```

```diff
    contract SystemConfig (0x5e6432F18Bc5d497B1Ab2288a025Fbf9D69E2221) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      values.$pastUpgrades:
+        [["2023-11-16T20:47:11.000Z",["0x951754B08C52b2aC5d5a2aF1D52C2D12aED5Bcaf"]],["2024-04-19T18:22:11.000Z",["0xd81f43eDBCAcb4c29a9bA38a13Ee5d79278270cC"]],["2024-04-19T18:22:11.000Z",["0xba2492e52F45651B60B8B38d4Ea5E2390C64Ffb1"]]]
    }
```

```diff
    contract OptimismMintableERC20Factory (0x69216395A62dFb243C05EF4F1C27AF8655096a95) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      values.$pastUpgrades:
+        [["2023-11-16T20:47:11.000Z",["0xc0c6A811BBf07FA01b946F1C46a9A94c2eE8C73E"]],["2024-04-19T18:22:11.000Z",["0xd81f43eDBCAcb4c29a9bA38a13Ee5d79278270cC"]],["2024-04-19T18:22:11.000Z",["0xE01efbeb1089D1d1dB9c6c8b135C934C0734c846"]]]
    }
```

```diff
    contract L1StandardBridge (0x735aDBbE72226BD52e818E7181953f42E3b0FF21) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token.
      values.$pastUpgrades:
+        []
    }
```

```diff
    contract OptimismPortal (0x8B34b14c7c7123459Cf3076b8Cb929BE097d0C07) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      values.$pastUpgrades:
+        [["2023-11-16T20:47:11.000Z",["0xad3DC277d3242938F8Be18f0560e3d9B9988C46A"]],["2024-04-19T18:22:11.000Z",["0xd81f43eDBCAcb4c29a9bA38a13Ee5d79278270cC"]],["2024-04-19T18:22:11.000Z",["0x2D778797049FE9259d947D1ED8e5442226dFB589"]],["2024-08-01T21:20:59.000Z",["0x57e5AB742DDa19b60Fa2A43275722296B05A661A"]],["2024-08-01T21:20:59.000Z",["0x2D778797049FE9259d947D1ED8e5442226dFB589"]],["2024-08-01T21:25:23.000Z",["0x57e5AB742DDa19b60Fa2A43275722296B05A661A"]],["2024-08-01T21:25:23.000Z",["0x2D778797049FE9259d947D1ED8e5442226dFB589"]]]
    }
```

```diff
    contract SuperchainConfig (0x95703e0982140D16f8ebA6d158FccEde42f04a4C) {
    +++ description: Used to manage global configuration values for multiple OP Chains within a single Superchain network. The SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the Superchain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      values.$pastUpgrades:
+        [["2024-01-22T20:19:59.000Z",["0x53c165169401764778F780a69701385eb0FF19B7"]],["2024-06-10T18:29:23.000Z",["0xd81f43eDBCAcb4c29a9bA38a13Ee5d79278270cC"]],["2024-06-10T18:29:23.000Z",["0x53c165169401764778F780a69701385eb0FF19B7"]]]
    }
```

```diff
    contract L1CrossDomainMessenger (0x95bDCA6c8EdEB69C98Bd5bd17660BaCef1298A6f) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      values.$pastUpgrades:
+        [["2023-11-16T20:47:11.000Z",["0x95bDCA6c8EdEB69C98Bd5bd17660BaCef1298A6f"]],["2023-11-16T20:47:11.000Z",["0x14DdD08c0e28764FC89a266eC95A93619b0EE835"]],["2024-04-19T18:22:11.000Z",["0xd81f43eDBCAcb4c29a9bA38a13Ee5d79278270cC"]],["2024-04-19T18:22:11.000Z",["0xD3494713A5cfaD3F5359379DfA074E2Ac8C6Fd65"]]]
      values.$upgradeCount:
+        4
    }
```

Generated with discovered.json: 0x0fdf4ec7e1ec8578d354f97c7e2502f4c16b7d20

# Diff at Tue, 17 Sep 2024 09:54:14 GMT:

- chain: ethereum
- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@a17234c1dfeb209a9842df2b454c07e2b8da435d block: 20475234
- current block number: 20769559

## Description

DeputyGuardianModule upgrade: `setAnchorState()` is now callable by the deputy guardian.

## Watched changes

```diff
    contract GuardianMultisig (0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2) {
    +++ description: None
      values.GnosisSafe_modules.0:
-        "0x5dC91D01290af474CE21DE14c17335a6dEe4d2a8"
+        "0xc6901F65369FC59fC1B4D6D6bE7A2318Ff38dB5B"
    }
```

```diff
-   Status: DELETED
    contract DeputyGuardianModule (0x5dC91D01290af474CE21DE14c17335a6dEe4d2a8)
    +++ description: allows the 0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A, called the deputy guardian, to act on behalf of the Gnosis Safe.
```

```diff
+   Status: CREATED
    contract DeputyGuardianModule (0xc6901F65369FC59fC1B4D6D6bE7A2318Ff38dB5B)
    +++ description: allows the 0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A, called the deputy guardian, to act on behalf of the Gnosis Safe.
```

## Source code changes

```diff
.../DeputyGuardianModule.sol                         | 20 ++++++++++++++++++--
 1 file changed, 18 insertions(+), 2 deletions(-)
```

Generated with discovered.json: 0xb49828aac1db9083b7bd13fc004d2736e57812fb

# Diff at Sun, 08 Sep 2024 17:24:36 GMT:

- chain: ethereum
- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@fd881462cca0d7ef4519f907f3c6cfd5fe1cde8f block: 20475234
- current block number: 20475234

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20475234 (main branch discovery), not current.

```diff
    contract LivenessGuard (0x24424336F04440b1c28685a38303aC33C9D14a25) {
    +++ description: None
      descriptions:
-        ["Liveness Guard of 0x0454092516c9A4d636d3CAfA1e82161376C8a748 - used to remove members inactive for 98d."]
    }
```

```diff
    contract L1ERC721Bridge (0x2901dA832a4D0297FF0691100A8E496626cc626D) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      issuedPermissions.0.target:
-        "0x470d87b1dae09a454A43D1fD772A561a03276aB7"
+        "0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A"
      issuedPermissions.0.via.0:
+        {"address":"0x470d87b1dae09a454A43D1fD772A561a03276aB7","delay":0}
    }
```

```diff
    contract L2OutputOracle (0x4317ba146D4933D889518a3e5E11Fe7a53199b04) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      issuedPermissions.0.target:
-        "0x470d87b1dae09a454A43D1fD772A561a03276aB7"
+        "0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A"
      issuedPermissions.0.via.0:
+        {"address":"0x470d87b1dae09a454A43D1fD772A561a03276aB7","delay":0}
    }
```

```diff
    contract ProxyAdmin (0x470d87b1dae09a454A43D1fD772A561a03276aB7) {
    +++ description: None
      descriptions:
-        ["It can upgrade the bridge implementation potentially gaining access to all funds, and change any system component."]
      issuedPermissions:
-        [{"permission":"configure","target":"0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A","via":[]}]
      receivedPermissions:
-        [{"permission":"configure","target":"0x50eF494573f28Cad6B64C31b7a00Cdaa48306e15"},{"permission":"upgrade","target":"0x2901dA832a4D0297FF0691100A8E496626cc626D"},{"permission":"upgrade","target":"0x4317ba146D4933D889518a3e5E11Fe7a53199b04"},{"permission":"upgrade","target":"0x5e6432F18Bc5d497B1Ab2288a025Fbf9D69E2221"},{"permission":"upgrade","target":"0x69216395A62dFb243C05EF4F1C27AF8655096a95"},{"permission":"upgrade","target":"0x735aDBbE72226BD52e818E7181953f42E3b0FF21"},{"permission":"upgrade","target":"0x8B34b14c7c7123459Cf3076b8Cb929BE097d0C07"}]
      directlyReceivedPermissions:
+        [{"permission":"configure","target":"0x50eF494573f28Cad6B64C31b7a00Cdaa48306e15"},{"permission":"upgrade","target":"0x2901dA832a4D0297FF0691100A8E496626cc626D"},{"permission":"upgrade","target":"0x4317ba146D4933D889518a3e5E11Fe7a53199b04"},{"permission":"upgrade","target":"0x5e6432F18Bc5d497B1Ab2288a025Fbf9D69E2221"},{"permission":"upgrade","target":"0x69216395A62dFb243C05EF4F1C27AF8655096a95"},{"permission":"upgrade","target":"0x735aDBbE72226BD52e818E7181953f42E3b0FF21","description":"upgrading bridge implementation allows to access all funds and change every system component."},{"permission":"upgrade","target":"0x8B34b14c7c7123459Cf3076b8Cb929BE097d0C07"}]
    }
```

```diff
    contract ConduitMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      descriptions:
-        ["It can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system."]
      receivedPermissions.0.description:
+        "it can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system."
    }
```

```diff
    contract AddressManager (0x50eF494573f28Cad6B64C31b7a00Cdaa48306e15) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x470d87b1dae09a454A43D1fD772A561a03276aB7"
+        "0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A"
      issuedPermissions.0.via.0:
+        {"address":"0x470d87b1dae09a454A43D1fD772A561a03276aB7","delay":0}
    }
```

```diff
    contract SuperchainProxyAdmin (0x543bA4AADBAb8f9025686Bd03993043599c6fB04) {
    +++ description: None
      issuedPermissions:
-        [{"permission":"configure","target":"0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A","via":[]}]
      receivedPermissions:
-        [{"permission":"configure","target":"0xdE1FCfB0851916CA5101820A69b13a4E276bd81F"},{"permission":"upgrade","target":"0x95703e0982140D16f8ebA6d158FccEde42f04a4C"}]
      directlyReceivedPermissions:
+        [{"permission":"configure","target":"0xdE1FCfB0851916CA5101820A69b13a4E276bd81F"},{"permission":"upgrade","target":"0x95703e0982140D16f8ebA6d158FccEde42f04a4C"}]
    }
```

```diff
    contract SuperchainProxyAdminOwner (0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A) {
    +++ description: None
      descriptions:
-        ["It can act on behalf of 0x470d87b1dae09a454A43D1fD772A561a03276aB7, inheriting its permissions.","It can act on behalf of 0x543bA4AADBAb8f9025686Bd03993043599c6fB04, inheriting its permissions."]
      receivedPermissions.8:
+        {"permission":"upgrade","target":"0x95703e0982140D16f8ebA6d158FccEde42f04a4C","via":[{"address":"0x543bA4AADBAb8f9025686Bd03993043599c6fB04"}]}
      receivedPermissions.7:
+        {"permission":"upgrade","target":"0x8B34b14c7c7123459Cf3076b8Cb929BE097d0C07","via":[{"address":"0x470d87b1dae09a454A43D1fD772A561a03276aB7"}]}
      receivedPermissions.6:
+        {"permission":"upgrade","target":"0x735aDBbE72226BD52e818E7181953f42E3b0FF21","description":"upgrading bridge implementation allows to access all funds and change every system component.","via":[{"address":"0x470d87b1dae09a454A43D1fD772A561a03276aB7"}]}
      receivedPermissions.5:
+        {"permission":"upgrade","target":"0x69216395A62dFb243C05EF4F1C27AF8655096a95","via":[{"address":"0x470d87b1dae09a454A43D1fD772A561a03276aB7"}]}
      receivedPermissions.4:
+        {"permission":"upgrade","target":"0x5e6432F18Bc5d497B1Ab2288a025Fbf9D69E2221","via":[{"address":"0x470d87b1dae09a454A43D1fD772A561a03276aB7"}]}
      receivedPermissions.3:
+        {"permission":"upgrade","target":"0x4317ba146D4933D889518a3e5E11Fe7a53199b04","via":[{"address":"0x470d87b1dae09a454A43D1fD772A561a03276aB7"}]}
      receivedPermissions.2:
+        {"permission":"upgrade","target":"0x2901dA832a4D0297FF0691100A8E496626cc626D","via":[{"address":"0x470d87b1dae09a454A43D1fD772A561a03276aB7"}]}
      receivedPermissions.1.target:
-        "0x543bA4AADBAb8f9025686Bd03993043599c6fB04"
+        "0xdE1FCfB0851916CA5101820A69b13a4E276bd81F"
      receivedPermissions.1.via:
+        [{"address":"0x543bA4AADBAb8f9025686Bd03993043599c6fB04"}]
      receivedPermissions.0.target:
-        "0x470d87b1dae09a454A43D1fD772A561a03276aB7"
+        "0x50eF494573f28Cad6B64C31b7a00Cdaa48306e15"
      receivedPermissions.0.via:
+        [{"address":"0x470d87b1dae09a454A43D1fD772A561a03276aB7"}]
      directlyReceivedPermissions:
+        [{"permission":"act","target":"0x470d87b1dae09a454A43D1fD772A561a03276aB7"},{"permission":"act","target":"0x543bA4AADBAb8f9025686Bd03993043599c6fB04"}]
    }
```

```diff
    contract DeputyGuardianModule (0x5dC91D01290af474CE21DE14c17335a6dEe4d2a8) {
    +++ description: allows the 0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A, called the deputy guardian, to act on behalf of the Gnosis Safe.
      descriptions.0:
-        "allows the 0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A (the deputy guardian) to act on behalf of the Gnosis Safe."
+        "allows the 0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A, called the deputy guardian, to act on behalf of the Gnosis Safe."
    }
```

```diff
    contract SystemConfig (0x5e6432F18Bc5d497B1Ab2288a025Fbf9D69E2221) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      issuedPermissions.1.target:
-        "0x470d87b1dae09a454A43D1fD772A561a03276aB7"
+        "0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A"
      issuedPermissions.1.via.0:
+        {"address":"0x470d87b1dae09a454A43D1fD772A561a03276aB7","delay":0}
    }
```

```diff
    contract OptimismMintableERC20Factory (0x69216395A62dFb243C05EF4F1C27AF8655096a95) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      issuedPermissions.0.target:
-        "0x470d87b1dae09a454A43D1fD772A561a03276aB7"
+        "0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A"
      issuedPermissions.0.via.0:
+        {"address":"0x470d87b1dae09a454A43D1fD772A561a03276aB7","delay":0}
    }
```

```diff
    contract L1StandardBridge (0x735aDBbE72226BD52e818E7181953f42E3b0FF21) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token.
      issuedPermissions.0.target:
-        "0x470d87b1dae09a454A43D1fD772A561a03276aB7"
+        "0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A"
      issuedPermissions.0.via.0:
+        {"address":"0x470d87b1dae09a454A43D1fD772A561a03276aB7","delay":0,"description":"upgrading bridge implementation allows to access all funds and change every system component."}
    }
```

```diff
    contract FoundationMultisig_1 (0x847B5c174615B1B7fDF770882256e2D3E95b9D92) {
    +++ description: None
      descriptions:
-        ["Fallback Owner of 0x0454092516c9A4d636d3CAfA1e82161376C8a748 - takes ownership of 0xc2819DC788505Aac350142A7A707BF9D03E3Bd03 if the number of members falls below 8."]
    }
```

```diff
    contract OptimismPortal (0x8B34b14c7c7123459Cf3076b8Cb929BE097d0C07) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      issuedPermissions.0.target:
-        "0x470d87b1dae09a454A43D1fD772A561a03276aB7"
+        "0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A"
      issuedPermissions.0.via.0:
+        {"address":"0x470d87b1dae09a454A43D1fD772A561a03276aB7","delay":0}
    }
```

```diff
    contract SuperchainConfig (0x95703e0982140D16f8ebA6d158FccEde42f04a4C) {
    +++ description: Used to manage global configuration values for multiple OP Chains within a single Superchain network. The SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the Superchain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      issuedPermissions.0.target:
-        "0x543bA4AADBAb8f9025686Bd03993043599c6fB04"
+        "0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A"
      issuedPermissions.0.via.0:
+        {"address":"0x543bA4AADBAb8f9025686Bd03993043599c6fB04","delay":0}
    }
```

```diff
    contract FoundationMultisig_2 (0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A) {
    +++ description: None
      descriptions:
-        ["Deputy Guardian of 0x5dC91D01290af474CE21DE14c17335a6dEe4d2a8. It can act on behalf of the 0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2."]
    }
```

```diff
    contract Lib_AddressManager (0xdE1FCfB0851916CA5101820A69b13a4E276bd81F) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x543bA4AADBAb8f9025686Bd03993043599c6fB04"
+        "0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A"
      issuedPermissions.0.via.0:
+        {"address":"0x543bA4AADBAb8f9025686Bd03993043599c6fB04","delay":0}
    }
```

Generated with discovered.json: 0xbf0c508374858d8a4283e0a5e43fe33d11881f33

# Diff at Fri, 30 Aug 2024 07:53:47 GMT:

- chain: ethereum
- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@6c1bd1f41fadf5f2cb1c1805b5a2c6138a3ed35a block: 20475234
- current block number: 20475234

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20475234 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x470d87b1dae09a454A43D1fD772A561a03276aB7) {
    +++ description: It can upgrade the bridge implementation potentially gaining access to all funds, and change any system component.
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
    +++ description: It can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system.
      receivedPermissions.0.via:
-        []
    }
```

```diff
    contract SuperchainProxyAdmin (0x543bA4AADBAb8f9025686Bd03993043599c6fB04) {
    +++ description: None
      receivedPermissions.1.via:
-        []
      receivedPermissions.0.via:
-        []
    }
```

```diff
    contract SuperchainProxyAdminOwner (0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A) {
    +++ description: It can act on behalf of 0x470d87b1dae09a454A43D1fD772A561a03276aB7, inheriting its permissions. It can act on behalf of 0x543bA4AADBAb8f9025686Bd03993043599c6fB04, inheriting its permissions.
      receivedPermissions.1.via:
-        []
      receivedPermissions.0.via:
-        []
    }
```

Generated with discovered.json: 0xa4aa2895df01ae7ea7a17ea2189786228004041e

# Diff at Fri, 23 Aug 2024 09:53:27 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@67597c7d6c810bc726594446890178150240711e block: 20475234
- current block number: 20475234

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20475234 (main branch discovery), not current.

```diff
    contract L1ERC721Bridge (0x2901dA832a4D0297FF0691100A8E496626cc626D) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      values.$upgradeCount:
+        3
    }
```

```diff
    contract L2OutputOracle (0x4317ba146D4933D889518a3e5E11Fe7a53199b04) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      values.$upgradeCount:
+        3
    }
```

```diff
    contract SystemConfig (0x5e6432F18Bc5d497B1Ab2288a025Fbf9D69E2221) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      values.$upgradeCount:
+        3
    }
```

```diff
    contract OptimismMintableERC20Factory (0x69216395A62dFb243C05EF4F1C27AF8655096a95) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      values.$upgradeCount:
+        3
    }
```

```diff
    contract L1StandardBridge (0x735aDBbE72226BD52e818E7181953f42E3b0FF21) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token.
      values.$upgradeCount:
+        0
    }
```

```diff
    contract OptimismPortal (0x8B34b14c7c7123459Cf3076b8Cb929BE097d0C07) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      values.$upgradeCount:
+        7
    }
```

```diff
    contract SuperchainConfig (0x95703e0982140D16f8ebA6d158FccEde42f04a4C) {
    +++ description: Used to manage global configuration values for multiple OP Chains within a single Superchain network. The SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the Superchain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      values.$upgradeCount:
+        3
    }
```

Generated with discovered.json: 0xc6f095cb396951462001e142d81600fdd2ffcfbe

# Diff at Wed, 21 Aug 2024 10:04:13 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@2f6dde3357bf5d79196b6e94f79d853a6c4ec72b block: 20475234
- current block number: 20475234

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20475234 (main branch discovery), not current.

```diff
    contract L1ERC721Bridge (0x2901dA832a4D0297FF0691100A8E496626cc626D) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x470d87b1dae09a454A43D1fD772A561a03276aB7","via":[]}]
    }
```

```diff
    contract L2OutputOracle (0x4317ba146D4933D889518a3e5E11Fe7a53199b04) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x470d87b1dae09a454A43D1fD772A561a03276aB7","via":[]}]
    }
```

```diff
    contract ProxyAdmin (0x470d87b1dae09a454A43D1fD772A561a03276aB7) {
    +++ description: It can upgrade the bridge implementation potentially gaining access to all funds, and change any system component.
      assignedPermissions:
-        {"upgrade":["0x2901dA832a4D0297FF0691100A8E496626cc626D","0x4317ba146D4933D889518a3e5E11Fe7a53199b04","0x5e6432F18Bc5d497B1Ab2288a025Fbf9D69E2221","0x69216395A62dFb243C05EF4F1C27AF8655096a95","0x735aDBbE72226BD52e818E7181953f42E3b0FF21","0x8B34b14c7c7123459Cf3076b8Cb929BE097d0C07"],"configure":["0x50eF494573f28Cad6B64C31b7a00Cdaa48306e15"]}
      issuedPermissions:
+        [{"permission":"configure","target":"0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A","via":[]}]
      receivedPermissions:
+        [{"permission":"configure","target":"0x50eF494573f28Cad6B64C31b7a00Cdaa48306e15","via":[]},{"permission":"upgrade","target":"0x2901dA832a4D0297FF0691100A8E496626cc626D","via":[]},{"permission":"upgrade","target":"0x4317ba146D4933D889518a3e5E11Fe7a53199b04","via":[]},{"permission":"upgrade","target":"0x5e6432F18Bc5d497B1Ab2288a025Fbf9D69E2221","via":[]},{"permission":"upgrade","target":"0x69216395A62dFb243C05EF4F1C27AF8655096a95","via":[]},{"permission":"upgrade","target":"0x735aDBbE72226BD52e818E7181953f42E3b0FF21","via":[]},{"permission":"upgrade","target":"0x8B34b14c7c7123459Cf3076b8Cb929BE097d0C07","via":[]}]
    }
```

```diff
    contract ConduitMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: It can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system.
      assignedPermissions:
-        {"configure":["0x5e6432F18Bc5d497B1Ab2288a025Fbf9D69E2221"]}
      receivedPermissions:
+        [{"permission":"configure","target":"0x5e6432F18Bc5d497B1Ab2288a025Fbf9D69E2221","via":[]}]
    }
```

```diff
    contract AddressManager (0x50eF494573f28Cad6B64C31b7a00Cdaa48306e15) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"configure","target":"0x470d87b1dae09a454A43D1fD772A561a03276aB7","via":[]}]
    }
```

```diff
    contract SuperchainProxyAdmin (0x543bA4AADBAb8f9025686Bd03993043599c6fB04) {
    +++ description: None
      assignedPermissions:
-        {"upgrade":["0x95703e0982140D16f8ebA6d158FccEde42f04a4C"],"configure":["0xdE1FCfB0851916CA5101820A69b13a4E276bd81F"]}
      issuedPermissions:
+        [{"permission":"configure","target":"0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A","via":[]}]
      receivedPermissions:
+        [{"permission":"configure","target":"0xdE1FCfB0851916CA5101820A69b13a4E276bd81F","via":[]},{"permission":"upgrade","target":"0x95703e0982140D16f8ebA6d158FccEde42f04a4C","via":[]}]
    }
```

```diff
    contract SuperchainProxyAdminOwner (0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A) {
    +++ description: It can act on behalf of 0x470d87b1dae09a454A43D1fD772A561a03276aB7, inheriting its permissions. It can act on behalf of 0x543bA4AADBAb8f9025686Bd03993043599c6fB04, inheriting its permissions.
      assignedPermissions:
-        {"configure":["0x470d87b1dae09a454A43D1fD772A561a03276aB7","0x543bA4AADBAb8f9025686Bd03993043599c6fB04"]}
      receivedPermissions:
+        [{"permission":"configure","target":"0x470d87b1dae09a454A43D1fD772A561a03276aB7","via":[]},{"permission":"configure","target":"0x543bA4AADBAb8f9025686Bd03993043599c6fB04","via":[]}]
    }
```

```diff
    contract SystemConfig (0x5e6432F18Bc5d497B1Ab2288a025Fbf9D69E2221) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      issuedPermissions:
+        [{"permission":"configure","target":"0x4a4962275DF8C60a80d3a25faEc5AA7De116A746","via":[]},{"permission":"upgrade","target":"0x470d87b1dae09a454A43D1fD772A561a03276aB7","via":[]}]
    }
```

```diff
    contract OptimismMintableERC20Factory (0x69216395A62dFb243C05EF4F1C27AF8655096a95) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x470d87b1dae09a454A43D1fD772A561a03276aB7","via":[]}]
    }
```

```diff
    contract L1StandardBridge (0x735aDBbE72226BD52e818E7181953f42E3b0FF21) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token.
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x470d87b1dae09a454A43D1fD772A561a03276aB7","via":[]}]
    }
```

```diff
    contract OptimismPortal (0x8B34b14c7c7123459Cf3076b8Cb929BE097d0C07) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x470d87b1dae09a454A43D1fD772A561a03276aB7","via":[]}]
    }
```

```diff
    contract SuperchainConfig (0x95703e0982140D16f8ebA6d158FccEde42f04a4C) {
    +++ description: Used to manage global configuration values for multiple OP Chains within a single Superchain network. The SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the Superchain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x543bA4AADBAb8f9025686Bd03993043599c6fB04","via":[]}]
    }
```

```diff
    contract Lib_AddressManager (0xdE1FCfB0851916CA5101820A69b13a4E276bd81F) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"configure","target":"0x543bA4AADBAb8f9025686Bd03993043599c6fB04","via":[]}]
    }
```

Generated with discovered.json: 0xab19b50883073914e8522303459553cc8bdabf2d

# Diff at Fri, 09 Aug 2024 12:00:35 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bf40aa32f030fd312056ca0ef198c8550467d1d7 block: 20475234
- current block number: 20475234

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20475234 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x470d87b1dae09a454A43D1fD772A561a03276aB7) {
    +++ description: It can upgrade the bridge implementation potentially gaining access to all funds, and change any system component.
      assignedPermissions.upgrade.5:
-        "0x69216395A62dFb243C05EF4F1C27AF8655096a95"
+        "0x8B34b14c7c7123459Cf3076b8Cb929BE097d0C07"
      assignedPermissions.upgrade.4:
-        "0x5e6432F18Bc5d497B1Ab2288a025Fbf9D69E2221"
+        "0x735aDBbE72226BD52e818E7181953f42E3b0FF21"
      assignedPermissions.upgrade.3:
-        "0x4317ba146D4933D889518a3e5E11Fe7a53199b04"
+        "0x69216395A62dFb243C05EF4F1C27AF8655096a95"
      assignedPermissions.upgrade.2:
-        "0x8B34b14c7c7123459Cf3076b8Cb929BE097d0C07"
+        "0x5e6432F18Bc5d497B1Ab2288a025Fbf9D69E2221"
      assignedPermissions.upgrade.1:
-        "0x735aDBbE72226BD52e818E7181953f42E3b0FF21"
+        "0x4317ba146D4933D889518a3e5E11Fe7a53199b04"
    }
```

Generated with discovered.json: 0xe0aa3df3a6070ebaac253cddc268a74360ef2bcc

# Diff at Fri, 09 Aug 2024 10:10:41 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f0da1d0aab7bc6b3b5e54e7e93480bd98e57035 block: 20475234
- current block number: 20475234

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20475234 (main branch discovery), not current.

```diff
    contract GuardianMultisig (0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2) {
    +++ description: None
      values.$multisigThreshold:
-        "1 of 1 (100%)"
      values.getOwners:
-        ["0xc2819DC788505Aac350142A7A707BF9D03E3Bd03"]
      values.getThreshold:
-        1
      values.$members:
+        ["0xc2819DC788505Aac350142A7A707BF9D03E3Bd03"]
      values.$threshold:
+        1
      values.multisigThreshold:
+        "1 of 1 (100%)"
    }
```

```diff
    contract ChallengerMultisig (0x309Fe2536d01867018D120b40e4676723C53A14C) {
    +++ description: None
      values.$multisigThreshold:
-        "4 of 6 (67%)"
      values.getOwners:
-        ["0x8DF5F3E4a0688595b02768c37F32424365F36f26","0x0825BdB1A5868682B1F880CF1E743e0bA4634ceC","0xa85EF4aEDf7B395cDbb894DF8F017E8A73f4a6fB","0x3840f487A17A41100DD1Bf0946c34f132a57Fd5f","0xa0C600a6e85bf225958FFAcC70B5FDDF9A059038","0xefCf0c8faFB425997870f845e26fC6cA6EE6dD5C"]
      values.getThreshold:
-        4
      values.$members:
+        ["0x8DF5F3E4a0688595b02768c37F32424365F36f26","0x0825BdB1A5868682B1F880CF1E743e0bA4634ceC","0xa85EF4aEDf7B395cDbb894DF8F017E8A73f4a6fB","0x3840f487A17A41100DD1Bf0946c34f132a57Fd5f","0xa0C600a6e85bf225958FFAcC70B5FDDF9A059038","0xefCf0c8faFB425997870f845e26fC6cA6EE6dD5C"]
      values.$threshold:
+        4
      values.multisigThreshold:
+        "4 of 6 (67%)"
    }
```

```diff
    contract GnosisSafe (0x42d27eEA1AD6e22Af6284F609847CB3Cd56B9c64) {
    +++ description: None
      values.$multisigThreshold:
-        "2 of 2 (100%)"
      values.getOwners:
-        ["0xb23794fd6BA1CEAd01Cf54D772b8341F2F0197A5","0x4665374939642965EfD8357D4568D2A77f677429"]
      values.getThreshold:
-        2
      values.$members:
+        ["0xb23794fd6BA1CEAd01Cf54D772b8341F2F0197A5","0x4665374939642965EfD8357D4568D2A77f677429"]
      values.$threshold:
+        2
      values.multisigThreshold:
+        "2 of 2 (100%)"
    }
```

```diff
    contract ProxyAdmin (0x470d87b1dae09a454A43D1fD772A561a03276aB7) {
    +++ description: It can upgrade the bridge implementation potentially gaining access to all funds, and change any system component.
      assignedPermissions.admin:
-        ["0x2901dA832a4D0297FF0691100A8E496626cc626D","0x4317ba146D4933D889518a3e5E11Fe7a53199b04","0x5e6432F18Bc5d497B1Ab2288a025Fbf9D69E2221","0x69216395A62dFb243C05EF4F1C27AF8655096a95","0x735aDBbE72226BD52e818E7181953f42E3b0FF21","0x8B34b14c7c7123459Cf3076b8Cb929BE097d0C07"]
      assignedPermissions.owner:
-        ["0x50eF494573f28Cad6B64C31b7a00Cdaa48306e15"]
      assignedPermissions.upgrade:
+        ["0x2901dA832a4D0297FF0691100A8E496626cc626D","0x735aDBbE72226BD52e818E7181953f42E3b0FF21","0x8B34b14c7c7123459Cf3076b8Cb929BE097d0C07","0x4317ba146D4933D889518a3e5E11Fe7a53199b04","0x5e6432F18Bc5d497B1Ab2288a025Fbf9D69E2221","0x69216395A62dFb243C05EF4F1C27AF8655096a95"]
      assignedPermissions.configure:
+        ["0x50eF494573f28Cad6B64C31b7a00Cdaa48306e15"]
    }
```

```diff
    contract ConduitMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: It can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system.
      assignedPermissions.owner:
-        ["0x5e6432F18Bc5d497B1Ab2288a025Fbf9D69E2221"]
      assignedPermissions.configure:
+        ["0x5e6432F18Bc5d497B1Ab2288a025Fbf9D69E2221"]
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
    contract SuperchainProxyAdmin (0x543bA4AADBAb8f9025686Bd03993043599c6fB04) {
    +++ description: None
      assignedPermissions.admin:
-        ["0x95703e0982140D16f8ebA6d158FccEde42f04a4C"]
      assignedPermissions.owner:
-        ["0xdE1FCfB0851916CA5101820A69b13a4E276bd81F"]
      assignedPermissions.upgrade:
+        ["0x95703e0982140D16f8ebA6d158FccEde42f04a4C"]
      assignedPermissions.configure:
+        ["0xdE1FCfB0851916CA5101820A69b13a4E276bd81F"]
    }
```

```diff
    contract SuperchainProxyAdminOwner (0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A) {
    +++ description: It can act on behalf of 0x470d87b1dae09a454A43D1fD772A561a03276aB7, inheriting its permissions. It can act on behalf of 0x543bA4AADBAb8f9025686Bd03993043599c6fB04, inheriting its permissions.
      assignedPermissions.owner:
-        ["0x470d87b1dae09a454A43D1fD772A561a03276aB7","0x543bA4AADBAb8f9025686Bd03993043599c6fB04"]
      assignedPermissions.configure:
+        ["0x470d87b1dae09a454A43D1fD772A561a03276aB7","0x543bA4AADBAb8f9025686Bd03993043599c6fB04"]
      values.$multisigThreshold:
-        "2 of 2 (100%)"
      values.getOwners:
-        ["0x847B5c174615B1B7fDF770882256e2D3E95b9D92","0xc2819DC788505Aac350142A7A707BF9D03E3Bd03"]
      values.getThreshold:
-        2
      values.$members:
+        ["0x847B5c174615B1B7fDF770882256e2D3E95b9D92","0xc2819DC788505Aac350142A7A707BF9D03E3Bd03"]
      values.$threshold:
+        2
      values.multisigThreshold:
+        "2 of 2 (100%)"
    }
```

```diff
    contract FoundationMultisig_1 (0x847B5c174615B1B7fDF770882256e2D3E95b9D92) {
    +++ description: Fallback Owner of 0x0454092516c9A4d636d3CAfA1e82161376C8a748 - takes ownership of 0xc2819DC788505Aac350142A7A707BF9D03E3Bd03 if the number of members falls below 8.
      values.$multisigThreshold:
-        "5 of 7 (71%)"
      values.getOwners:
-        ["0x42d27eEA1AD6e22Af6284F609847CB3Cd56B9c64","0x3041BA32f451F5850c147805F5521AC206421623","0xE7dEA1306D9F829bA469d1904c50903b46ebd02e","0xBF93D4d727F7Ba1F753E1124C3e532dCb04Ea2c8","0x4D014f3c5F33Aa9Cd1Dc29ce29618d07Ae666d15","0x7cB07FE039a92B3D784f284D919503A381BEC54f","0x9bbFB9919062C29a5eE15aCD93c9D7c3b14d31aa"]
      values.getThreshold:
-        5
      values.$members:
+        ["0x42d27eEA1AD6e22Af6284F609847CB3Cd56B9c64","0x3041BA32f451F5850c147805F5521AC206421623","0xE7dEA1306D9F829bA469d1904c50903b46ebd02e","0xBF93D4d727F7Ba1F753E1124C3e532dCb04Ea2c8","0x4D014f3c5F33Aa9Cd1Dc29ce29618d07Ae666d15","0x7cB07FE039a92B3D784f284D919503A381BEC54f","0x9bbFB9919062C29a5eE15aCD93c9D7c3b14d31aa"]
      values.$threshold:
+        5
      values.multisigThreshold:
+        "5 of 7 (71%)"
    }
```

```diff
    contract FoundationMultisig_2 (0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A) {
    +++ description: Deputy Guardian of 0x5dC91D01290af474CE21DE14c17335a6dEe4d2a8. It can act on behalf of the 0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2.
      values.$multisigThreshold:
-        "5 of 7 (71%)"
      values.getOwners:
-        ["0x42d27eEA1AD6e22Af6284F609847CB3Cd56B9c64","0x3041BA32f451F5850c147805F5521AC206421623","0xE7dEA1306D9F829bA469d1904c50903b46ebd02e","0xBF93D4d727F7Ba1F753E1124C3e532dCb04Ea2c8","0x4D014f3c5F33Aa9Cd1Dc29ce29618d07Ae666d15","0x7cB07FE039a92B3D784f284D919503A381BEC54f","0x9bbFB9919062C29a5eE15aCD93c9D7c3b14d31aa"]
      values.getThreshold:
-        5
      values.$members:
+        ["0x42d27eEA1AD6e22Af6284F609847CB3Cd56B9c64","0x3041BA32f451F5850c147805F5521AC206421623","0xE7dEA1306D9F829bA469d1904c50903b46ebd02e","0xBF93D4d727F7Ba1F753E1124C3e532dCb04Ea2c8","0x4D014f3c5F33Aa9Cd1Dc29ce29618d07Ae666d15","0x7cB07FE039a92B3D784f284D919503A381BEC54f","0x9bbFB9919062C29a5eE15aCD93c9D7c3b14d31aa"]
      values.$threshold:
+        5
      values.multisigThreshold:
+        "5 of 7 (71%)"
    }
```

```diff
    contract SecurityCouncilMultisig (0xc2819DC788505Aac350142A7A707BF9D03E3Bd03) {
    +++ description: None
      values.$multisigThreshold:
-        "10 of 13 (77%)"
      values.getOwners:
-        ["0x07dC0893cAfbF810e3E72505041f2865726Fd073","0x0a122d8aA40758FBAFf0360BFB391EdFfD9758b8","0x1822b35B09f5ce1C78ecbC06AC0A4e17885b925e","0x4A7322258c9E690e4CB8Cea6e5251443E956e61E","0x51aCb8e1205De850D1b512584FeE9C29C3813dDa","0x5C0F529d5B025540c54f71d2BcbB4c78F368C47e","0x6323ef2b80030f3fBc508bFc321Fc71fDB95c865","0x74FAE9a9fbe31d1F69b95f59CaF12736a8b6B310","0x7ed8d9Af9eaA194D1A75C67c1475579E42289E39","0x8Afe777B5A4D1e156435ab44Ad4b73A318cE0EA4","0x9Eb11A55132c851b9991F148b3Af791ca498fD7A","0xbfA046B0bc5cEa1596be62B8b3f79f9f41f1E0d9","0xE895076cD050F1f042d1040E47b5929bE989E514"]
      values.getThreshold:
-        10
      values.$members:
+        ["0x07dC0893cAfbF810e3E72505041f2865726Fd073","0x0a122d8aA40758FBAFf0360BFB391EdFfD9758b8","0x1822b35B09f5ce1C78ecbC06AC0A4e17885b925e","0x4A7322258c9E690e4CB8Cea6e5251443E956e61E","0x51aCb8e1205De850D1b512584FeE9C29C3813dDa","0x5C0F529d5B025540c54f71d2BcbB4c78F368C47e","0x6323ef2b80030f3fBc508bFc321Fc71fDB95c865","0x74FAE9a9fbe31d1F69b95f59CaF12736a8b6B310","0x7ed8d9Af9eaA194D1A75C67c1475579E42289E39","0x8Afe777B5A4D1e156435ab44Ad4b73A318cE0EA4","0x9Eb11A55132c851b9991F148b3Af791ca498fD7A","0xbfA046B0bc5cEa1596be62B8b3f79f9f41f1E0d9","0xE895076cD050F1f042d1040E47b5929bE989E514"]
      values.$threshold:
+        10
      values.multisigThreshold:
+        "10 of 13 (77%)"
    }
```

Generated with discovered.json: 0xd220121ce90c4ff9be1a2a9416be1d074c02f1ec

# Diff at Wed, 07 Aug 2024 07:35:36 GMT:

- chain: ethereum
- author: Radina Talanova (<nt.radina@gmail.com>)
- comparing to: main@47685977ba2390a8eafac8e0d4cac7c81dff5758 block: 20211472
- current block number: 20475234

## Description

The ProxyAdmin owner is changed to SuperchainProxyAdminOwner and Conduit Multisig is removed.

## Watched changes

```diff
    contract ProxyAdmin (0x470d87b1dae09a454A43D1fD772A561a03276aB7) {
    +++ description: It can upgrade the bridge implementation potentially gaining access to all funds, and change any system component.
      values.owner:
-        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
+        "0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A"
    }
```

```diff
    contract ConduitMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: It can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system.
      descriptions.1:
-        "It can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system."
      descriptions.0:
-        "It can act on behalf of 0x470d87b1dae09a454A43D1fD772A561a03276aB7, inheriting its permissions."
+        "It can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system."
      assignedPermissions.owner.1:
-        "0x5e6432F18Bc5d497B1Ab2288a025Fbf9D69E2221"
      assignedPermissions.owner.0:
-        "0x470d87b1dae09a454A43D1fD772A561a03276aB7"
+        "0x5e6432F18Bc5d497B1Ab2288a025Fbf9D69E2221"
    }
```

```diff
    contract SuperchainProxyAdminOwner (0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A) {
    +++ description: It can act on behalf of 0x470d87b1dae09a454A43D1fD772A561a03276aB7, inheriting its permissions. It can act on behalf of 0x543bA4AADBAb8f9025686Bd03993043599c6fB04, inheriting its permissions.
      descriptions.1:
+        "It can act on behalf of 0x543bA4AADBAb8f9025686Bd03993043599c6fB04, inheriting its permissions."
      descriptions.0:
-        "It can act on behalf of 0x543bA4AADBAb8f9025686Bd03993043599c6fB04, inheriting its permissions."
+        "It can act on behalf of 0x470d87b1dae09a454A43D1fD772A561a03276aB7, inheriting its permissions."
      assignedPermissions.owner.1:
+        "0x543bA4AADBAb8f9025686Bd03993043599c6fB04"
      assignedPermissions.owner.0:
-        "0x543bA4AADBAb8f9025686Bd03993043599c6fB04"
+        "0x470d87b1dae09a454A43D1fD772A561a03276aB7"
    }
```

Generated with discovered.json: 0x28abf5e906cdaadf3ba88273bce0525f6320b16a

# Diff at Tue, 30 Jul 2024 11:12:54 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@b2b6471ff62871f4956541f42ec025c356c08f7e block: 20211472
- current block number: 20211472

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20211472 (main branch discovery), not current.

```diff
    contract SystemConfig (0x5e6432F18Bc5d497B1Ab2288a025Fbf9D69E2221) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      fieldMeta:
+        {"gasLimit":{"severity":"LOW","description":"Gas limit for blocks on L2."}}
    }
```

Generated with discovered.json: 0x8b699b8c889c7f74f8931bd192aa598bd1a0f2c6

# Diff at Thu, 18 Jul 2024 10:32:01 GMT:

- chain: ethereum
- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@d89fe52cb65d643cef712d1d7910564a7acf2dce block: 20211472
- current block number: 20211472

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20211472 (main branch discovery), not current.

```diff
    contract LivenessModule (0x0454092516c9A4d636d3CAfA1e82161376C8a748) {
    +++ description: None
      values.livenessInterval:
-        8467200
+        "98d"
      template:
+        "gnosisSafeModules/LivenessModule"
      descriptions:
+        ["used to remove members inactive for 98d while making sure that the threshold remains above 75%. If the number of members falls below 8, the 0x847B5c174615B1B7fDF770882256e2D3E95b9D92 takes ownership of the multisig"]
    }
```

```diff
    contract LivenessGuard (0x24424336F04440b1c28685a38303aC33C9D14a25) {
    +++ description: None
      descriptions:
+        ["Liveness Guard of 0x0454092516c9A4d636d3CAfA1e82161376C8a748 - used to remove members inactive for 98d."]
    }
```

```diff
    contract L1ERC721Bridge (0x2901dA832a4D0297FF0691100A8E496626cc626D) {
    +++ description: None
      descriptions.0:
-        "Used to bridge ERC-721 tokens from L1 to L2"
+        "Used to bridge ERC-721 tokens from host chain to this chain."
    }
```

```diff
    contract ProxyAdmin (0x470d87b1dae09a454A43D1fD772A561a03276aB7) {
    +++ description: None
      descriptions:
+        ["It can upgrade the bridge implementation potentially gaining access to all funds, and change any system component."]
    }
```

```diff
    contract ConduitMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      descriptions:
+        ["It can act on behalf of 0x470d87b1dae09a454A43D1fD772A561a03276aB7, inheriting its permissions.","It can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system."]
    }
```

```diff
    contract SuperchainProxyAdminOwner (0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A) {
    +++ description: None
      descriptions:
+        ["It can act on behalf of 0x543bA4AADBAb8f9025686Bd03993043599c6fB04, inheriting its permissions."]
    }
```

```diff
    contract DeputyGuardianModule (0x5dC91D01290af474CE21DE14c17335a6dEe4d2a8) {
    +++ description: None
      template:
+        "gnosisSafeModules/DeputyGuardianModule"
      descriptions:
+        ["allows the 0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A (the deputy guardian) to act on behalf of the Gnosis Safe."]
    }
```

```diff
    contract SystemConfig (0x5e6432F18Bc5d497B1Ab2288a025Fbf9D69E2221) {
    +++ description: None
      descriptions.0:
-        "Contains configuration parameters such as the Sequencer address, the L2 gas limit and the unsafe block signer address."
+        "Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address."
    }
```

```diff
    contract OptimismMintableERC20Factory (0x69216395A62dFb243C05EF4F1C27AF8655096a95) {
    +++ description: None
      template:
+        "opstack/OptimismMintableERC20Factory"
      descriptions:
+        ["A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa."]
    }
```

```diff
    contract L1StandardBridge (0x735aDBbE72226BD52e818E7181953f42E3b0FF21) {
    +++ description: None
      descriptions.0:
-        "The main entry point to deposit ERC20 tokens from L1 to L2. This contract can store any token."
+        "The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token."
      categories:
+        ["Gateways&Escrows"]
    }
```

```diff
    contract FoundationMultisig_1 (0x847B5c174615B1B7fDF770882256e2D3E95b9D92) {
    +++ description: None
      descriptions:
+        ["Fallback Owner of 0x0454092516c9A4d636d3CAfA1e82161376C8a748 - takes ownership of 0xc2819DC788505Aac350142A7A707BF9D03E3Bd03 if the number of members falls below 8."]
    }
```

```diff
    contract OptimismPortal (0x8B34b14c7c7123459Cf3076b8Cb929BE097d0C07) {
    +++ description: None
      descriptions.0:
-        "The main entry point to deposit funds from L1 to L2. It also allows to prove and finalize withdrawals."
+        "The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals."
    }
```

```diff
    contract L1CrossDomainMessenger (0x95bDCA6c8EdEB69C98Bd5bd17660BaCef1298A6f) {
    +++ description: None
      descriptions.0:
-        "Sends messages from L1 to L2, and relays messages from L2 onto L1. In the event that a message sent from L1 to L2 is rejected for exceeding the L2 epoch gas limit, it can be resubmitted via this contract's replay function."
+        "Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function."
    }
```

```diff
    contract FoundationMultisig_2 (0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A) {
    +++ description: None
      descriptions:
+        ["Deputy Guardian of 0x5dC91D01290af474CE21DE14c17335a6dEe4d2a8. It can act on behalf of the 0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2."]
    }
```

Generated with discovered.json: 0x9f87d66ebe309620dc3eca424e960eb28adb0d82

# Diff at Fri, 28 Jun 2024 07:30:45 GMT:

- chain: ethereum
- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@555efdd96fadc389c2c70beacf820125fbb25a7d block: 20073661
- current block number: 20188700

## Description

Nonce of foundation multisig increased, after executing transaction to change the owner of the SystemConfig contract.

## Watched changes

```diff
    contract FoundationMultisig_2 (0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A) {
    +++ description: None
      values.nonce:
-        92
+        93
    }
```

Generated with discovered.json: 0x6a375fc46bdbde85214e37d66370814e5f3b66c1

# Diff at Wed, 12 Jun 2024 05:28:56 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@09246cd19afe46cf207c325923fef8f51d581735 block: 19927713
- current block number: 20073661

## Description

Changes due to Superchain permissions upgrade: 
- Security Council MS threshold raised
- Liveness and DeputyGuardian modules added
- Guardian (proxy)MS added

## Watched changes

```diff
    contract OptimismPortal (0x8B34b14c7c7123459Cf3076b8Cb929BE097d0C07) {
    +++ description: None
      values.guardian:
-        "0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A"
+        "0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2"
      values.GUARDIAN:
-        "0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A"
+        "0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2"
    }
```

```diff
    contract SuperchainConfig (0x95703e0982140D16f8ebA6d158FccEde42f04a4C) {
    +++ description: None
      values.guardian:
-        "0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A"
+        "0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2"
    }
```

```diff
    contract SecurityCouncilMultisig (0xc2819DC788505Aac350142A7A707BF9D03E3Bd03) {
    +++ description: None
      upgradeability.modules.0:
+        "0x0454092516c9A4d636d3CAfA1e82161376C8a748"
      upgradeability.threshold:
-        "4 of 13 (31%)"
+        "10 of 13 (77%)"
      values.getThreshold:
-        4
+        10
    }
```

```diff
+   Status: CREATED
    contract LivenessModule (0x0454092516c9A4d636d3CAfA1e82161376C8a748)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GuardianMultisig (0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2)
    +++ description: None
```

```diff
+   Status: CREATED
    contract LivenessGuard (0x24424336F04440b1c28685a38303aC33C9D14a25)
    +++ description: None
```

```diff
+   Status: CREATED
    contract DeputyGuardianModule (0x5dC91D01290af474CE21DE14c17335a6dEe4d2a8)
    +++ description: None
```

## Source code changes

```diff
.../mode/ethereum/.flat/DeputyGuardianModule.sol   | 139 +++
 .../ethereum/.flat/GuardianMultisig/GnosisSafe.sol | 952 +++++++++++++++++++++
 .../.flat/GuardianMultisig/GnosisSafeProxy.p.sol   |  34 +
 .../mode/ethereum/.flat/LivenessGuard.sol          | 581 +++++++++++++
 .../mode/ethereum/.flat/LivenessModule.sol         | 257 ++++++
 5 files changed, 1963 insertions(+)
```

Generated with discovered.json: 0xfffebdaab376af03709f0a2eeacf05b0a7213d19

# Diff at Wed, 22 May 2024 20:10:11 GMT:

- chain: ethereum
- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@bac4efad06804152ae97853892e122a801bbc509 block: 19918748
- current block number: 19927713

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

Generated with discovered.json: 0x6580fca91888426840cc3da6d0b9e9b39d214523

# Diff at Tue, 21 May 2024 14:02:35 GMT:

- chain: ethereum
- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@c032520e456d0e6bee8b65e420ff7dba9f36bd48 block: 19711616
- current block number: 19918748

## Description

Name change.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19711616 (main branch discovery), not current.

```diff
    contract ProxyAdminOwner (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      name:
-        "ProxyAdminOwner"
+        "ConduitMultisig"
    }
```

Generated with discovered.json: 0x8d82bf4a8f5996acda0e483af1b8e4b842e3256c

# Diff at Mon, 22 Apr 2024 14:44:50 GMT:

- chain: ethereum
- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@d4b694a74243557c5ded556721185672f6639b7c block: 19582837
- current block number: 19711616

## Description

The project now uses shared implementations with other projects in the Superchain and a shared Guardian (OP Foundation).

## Watched changes

```diff
    contract L1ERC721Bridge (0x2901dA832a4D0297FF0691100A8E496626cc626D) {
    +++ description: None
      upgradeability.implementation:
-        "0x8b91Af069928bA6591c950354d1EA29e08192Bf8"
+        "0xAE2AF01232a6c4a4d3012C5eC5b1b35059caF10d"
      implementations.0:
-        "0x8b91Af069928bA6591c950354d1EA29e08192Bf8"
+        "0xAE2AF01232a6c4a4d3012C5eC5b1b35059caF10d"
      values.version:
-        "1.1.2"
+        "2.1.0"
      values.paused:
+        false
      values.superchainConfig:
+        "0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
    }
```

```diff
    contract L2OutputOracle (0x4317ba146D4933D889518a3e5E11Fe7a53199b04) {
    +++ description: None
      upgradeability.implementation:
-        "0x6093023a4A7E6873EDFb02B4bCE48c53FD310EEc"
+        "0xF243BEd163251380e78068d317ae10f26042B292"
      implementations.0:
-        "0x6093023a4A7E6873EDFb02B4bCE48c53FD310EEc"
+        "0xF243BEd163251380e78068d317ae10f26042B292"
      values.version:
-        "1.3.1"
+        "1.8.0"
      values.challenger:
+        "0x309Fe2536d01867018D120b40e4676723C53A14C"
      values.finalizationPeriodSeconds:
+        604800
      values.l2BlockTime:
+        2
      values.proposer:
+        "0x674F64D64Ddc198db83cd9047dF54BF89cCD0ddB"
      values.submissionInterval:
+        1800
    }
```

```diff
    contract SystemConfig (0x5e6432F18Bc5d497B1Ab2288a025Fbf9D69E2221) {
    +++ description: None
      upgradeability.implementation:
-        "0x951754B08C52b2aC5d5a2aF1D52C2D12aED5Bcaf"
+        "0xba2492e52F45651B60B8B38d4Ea5E2390C64Ffb1"
      implementations.0:
-        "0x951754B08C52b2aC5d5a2aF1D52C2D12aED5Bcaf"
+        "0xba2492e52F45651B60B8B38d4Ea5E2390C64Ffb1"
      values.version:
-        "1.3.1"
+        "1.12.0"
      values.BATCH_INBOX_SLOT:
+        "0x71ac12829d66ee73d8d95bff50b3589745ce57edae70a3fb111a2342464dc597"
      values.batchInbox:
+        "0x24E59d9d3Bd73ccC28Dc54062AF7EF7bFF58Bd67"
      values.L1_CROSS_DOMAIN_MESSENGER_SLOT:
+        "0x383f291819e6d54073bc9a648251d97421076bdd101933c0c022219ce9580636"
      values.L1_ERC_721_BRIDGE_SLOT:
+        "0x46adcbebc6be8ce551740c29c47c8798210f23f7f4086c41752944352568d5a7"
      values.L1_STANDARD_BRIDGE_SLOT:
+        "0x9904ba90dde5696cda05c9e0dab5cbaa0fea005ace4d11218a02ac668dad6376"
      values.l1CrossDomainMessenger:
+        "0x95bDCA6c8EdEB69C98Bd5bd17660BaCef1298A6f"
      values.l1ERC721Bridge:
+        "0x2901dA832a4D0297FF0691100A8E496626cc626D"
      values.l1StandardBridge:
+        "0x735aDBbE72226BD52e818E7181953f42E3b0FF21"
      values.L2_OUTPUT_ORACLE_SLOT:
+        "0xe52a667f71ec761b9b381c7b76ca9b852adf7e8905da0e0ad49986a0a6871815"
      values.l2OutputOracle:
+        "0x4317ba146D4933D889518a3e5E11Fe7a53199b04"
      values.OPTIMISM_MINTABLE_ERC20_FACTORY_SLOT:
+        "0xa04c5bb938ca6fc46d95553abf0a76345ce3e722a30bf4f74928b8e7d852320c"
      values.OPTIMISM_PORTAL_SLOT:
+        "0x4b6c74f9e688cb39801f2112c14a8c57232a3fc5202e1444126d4bce86eb19ac"
      values.optimismMintableERC20Factory:
+        "0x69216395A62dFb243C05EF4F1C27AF8655096a95"
      values.optimismPortal:
+        "0x8B34b14c7c7123459Cf3076b8Cb929BE097d0C07"
      values.START_BLOCK_SLOT:
+        "0xa11ee3ab75b40e88a0105e935d17cd36c8faee0138320d776c411291bdbbb19f"
      values.startBlock:
+        18586931
    }
```

```diff
    contract L1StandardBridge (0x735aDBbE72226BD52e818E7181953f42E3b0FF21) {
    +++ description: None
      upgradeability.implementation:
-        "0x9c67ACcb38137CB761587032179b176c9276Eb5a"
+        "0x64B5a5Ed26DCb17370Ff4d33a8D503f0fbD06CfF"
      implementations.0:
-        "0x9c67ACcb38137CB761587032179b176c9276Eb5a"
+        "0x64B5a5Ed26DCb17370Ff4d33a8D503f0fbD06CfF"
      values.version:
-        "1.1.1"
+        "2.1.0"
      values.otherBridge:
+        "0x4200000000000000000000000000000000000010"
      values.paused:
+        false
      values.superchainConfig:
+        "0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
    }
```

```diff
    contract OptimismPortal (0x8B34b14c7c7123459Cf3076b8Cb929BE097d0C07) {
    +++ description: None
      upgradeability.implementation:
-        "0xad3DC277d3242938F8Be18f0560e3d9B9988C46A"
+        "0x2D778797049FE9259d947D1ED8e5442226dFB589"
      implementations.0:
-        "0xad3DC277d3242938F8Be18f0560e3d9B9988C46A"
+        "0x2D778797049FE9259d947D1ED8e5442226dFB589"
      values.GUARDIAN:
-        "0x309Fe2536d01867018D120b40e4676723C53A14C"
+        "0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A"
      values.version:
-        "1.7.2"
+        "2.5.0"
      values.guardian:
+        "0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A"
      values.l2Oracle:
+        "0x4317ba146D4933D889518a3e5E11Fe7a53199b04"
      values.superchainConfig:
+        "0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
      values.systemConfig:
+        "0x5e6432F18Bc5d497B1Ab2288a025Fbf9D69E2221"
    }
```

```diff
    contract L1CrossDomainMessenger (0x95bDCA6c8EdEB69C98Bd5bd17660BaCef1298A6f) {
    +++ description: None
      upgradeability.implementation:
-        "0x14DdD08c0e28764FC89a266eC95A93619b0EE835"
+        "0xD3494713A5cfaD3F5359379DfA074E2Ac8C6Fd65"
      implementations.0:
-        "0x14DdD08c0e28764FC89a266eC95A93619b0EE835"
+        "0xD3494713A5cfaD3F5359379DfA074E2Ac8C6Fd65"
      values.version:
-        "1.4.1"
+        "2.3.0"
      values.otherMessenger:
+        "0x4200000000000000000000000000000000000007"
      values.paused:
+        false
      values.portal:
+        "0x8B34b14c7c7123459Cf3076b8Cb929BE097d0C07"
      values.superchainConfig:
+        "0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
    }
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
    contract SuperchainProxyAdminOwner (0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OptimismMintableERC20Factory (0x69216395A62dFb243C05EF4F1C27AF8655096a95)
    +++ description: None
```

```diff
+   Status: CREATED
    contract FoundationMultisig_1 (0x847B5c174615B1B7fDF770882256e2D3E95b9D92)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SuperchainConfig (0x95703e0982140D16f8ebA6d158FccEde42f04a4C)
    +++ description: None
```

```diff
+   Status: CREATED
    contract FoundationMultisig_2 (0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SecurityCouncilMultisig (0xc2819DC788505Aac350142A7A707BF9D03E3Bd03)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Lib_AddressManager (0xdE1FCfB0851916CA5101820A69b13a4E276bd81F)
    +++ description: None
```

## Source code changes

```diff
.../implementation/contracts/GnosisSafe.sol        |  422 ++++++++
 .../implementation/contracts/base/Executor.sol     |   27 +
 .../contracts/base/FallbackManager.sol             |   53 +
 .../implementation/contracts/base/GuardManager.sol |   50 +
 .../contracts/base/ModuleManager.sol               |  133 +++
 .../implementation/contracts/base/OwnerManager.sol |  149 +++
 .../implementation/contracts/common/Enum.sol       |    8 +
 .../contracts/common/EtherPaymentFallback.sol      |   13 +
 .../contracts/common/SecuredTokenTransfer.sol      |   35 +
 .../contracts/common/SelfAuthorized.sol            |   16 +
 .../contracts/common/SignatureDecoder.sol          |   36 +
 .../implementation/contracts/common/Singleton.sol  |   11 +
 .../contracts/common/StorageAccessible.sol         |   47 +
 .../contracts/external/GnosisSafeMath.sol          |   54 +
 .../contracts/interfaces/ISignatureValidator.sol   |   20 +
 .../FoundationMultisig_1/implementation/meta.txt   |    2 +
 .../FoundationMultisig_1/proxy/GnosisSafeProxy.sol |  155 +++
 .../.code/FoundationMultisig_1/proxy/meta.txt      |    2 +
 .../implementation/GnosisSafe.sol                  | 1076 ++++++++++++++++++++
 .../FoundationMultisig_2/implementation/meta.txt   |    2 +
 .../.code/FoundationMultisig_2/proxy/Proxy.sol     |   41 +
 .../.code/FoundationMultisig_2/proxy/meta.txt      |    2 +
 .../implementation/contracts/GnosisSafe.sol        |  422 ++++++++
 .../implementation/contracts/base/Executor.sol     |   27 +
 .../contracts/base/FallbackManager.sol             |   53 +
 .../implementation/contracts/base/GuardManager.sol |   50 +
 .../contracts/base/ModuleManager.sol               |  133 +++
 .../implementation/contracts/base/OwnerManager.sol |  149 +++
 .../implementation/contracts/common/Enum.sol       |    8 +
 .../contracts/common/EtherPaymentFallback.sol      |   13 +
 .../contracts/common/SecuredTokenTransfer.sol      |   35 +
 .../contracts/common/SelfAuthorized.sol            |   16 +
 .../contracts/common/SignatureDecoder.sol          |   36 +
 .../implementation/contracts/common/Singleton.sol  |   11 +
 .../contracts/common/StorageAccessible.sol         |   47 +
 .../contracts/external/GnosisSafeMath.sol          |   54 +
 .../contracts/interfaces/ISignatureValidator.sol   |   20 +
 .../.code/GnosisSafe/implementation/meta.txt       |    2 +
 .../.code/GnosisSafe/proxy/GnosisSafeProxy.sol     |  155 +++
 .../mode/ethereum/.code/GnosisSafe/proxy/meta.txt  |    2 +
 .../L1/L1CrossDomainMessenger.sol => /dev/null     |   67 --
 .../contracts/L1/L2OutputOracle.sol => /dev/null   |  350 -------
 .../contracts/L1/OptimismPortal.sol => /dev/null   |  507 ---------
 .../contracts/L1/SystemConfig.sol => /dev/null     |  297 ------
 .../libraries/Arithmetic.sol => /dev/null          |   48 -
 .../contracts/libraries/Burn.sol => /dev/null      |   42 -
 .../contracts/libraries/Bytes.sol => /dev/null     |  142 ---
 .../contracts/libraries/Constants.sol => /dev/null |   49 -
 .../contracts/libraries/Encoding.sol => /dev/null  |  162 ---
 .../contracts/libraries/Hashing.sol => /dev/null   |  172 ----
 .../libraries/Predeploys.sol => /dev/null          |  112 --
 .../contracts/libraries/SafeCall.sol => /dev/null  |  160 ---
 .../contracts/libraries/Types.sol => /dev/null     |   84 --
 .../libraries/rlp/RLPWriter.sol => /dev/null       |  221 ----
 .../trie/SecureMerkleTrie.sol => /dev/null         |   64 --
 .../CrossDomainMessenger.sol => /dev/null          |  519 ----------
 .../contracts/universal/Semver.sol => /dev/null    |   58 --
 .../contracts/proxy/utils/Initializable.sol        |    0
 .../contracts/utils/Address.sol                    |    0
 .../contracts/utils/math/Math.sol                  |    0
 .../contracts/utils/math/SignedMath.sol            |    0
 .../contracts}/access/OwnableUpgradeable.sol       |    0
 .../contracts}/proxy/utils/Initializable.sol       |    0
 .../contracts}/utils/AddressUpgradeable.sol        |    0
 .../contracts}/utils/ContextUpgradeable.sol        |    0
 .../lib}/solmate/src/utils/FixedPointMathLib.sol   |    0
 .../L1CrossDomainMessenger/implementation/meta.txt |    2 +-
 .../contracts/utils/Strings.sol => /dev/null       |   75 --
 .../src/L1/L1CrossDomainMessenger.sol              |   74 ++
 .../implementation/src}/L1/L2OutputOracle.sol      |  193 ++--
 .../implementation/src}/L1/OptimismPortal.sol      |  252 +++--
 .../implementation/src}/L1/ResourceMetering.sol    |  124 +--
 .../implementation/src/L1/SuperchainConfig.sol     |   94 ++
 .../implementation/src/L1/SystemConfig.sol         |  367 +++++++
 .../implementation/src/libraries/Arithmetic.sol    |   28 +
 .../implementation/src}/libraries/Burn.sol         |    0
 .../implementation/src}/libraries/Bytes.sol        |   16 +-
 .../implementation/src/libraries/Constants.sol     |   46 +
 .../implementation/src}/libraries/Encoding.sol     |   98 +-
 .../implementation/src}/libraries/Hashing.sol      |   80 +-
 .../implementation/src/libraries/Predeploys.sol    |  113 ++
 .../implementation/src}/libraries/SafeCall.sol     |   79 +-
 .../implementation/src/libraries/Storage.sol       |   88 ++
 .../implementation/src}/libraries/Types.sol        |    0
 .../src}/libraries/rlp/RLPReader.sol               |  249 ++---
 .../implementation/src/libraries/rlp/RLPWriter.sol |  163 +++
 .../src}/libraries/trie/MerkleTrie.sol             |  210 ++--
 .../src/libraries/trie/SecureMerkleTrie.sol        |   49 +
 .../src/universal/CrossDomainMessenger.sol         |  406 ++++++++
 .../implementation/src/universal/ISemver.sol       |   13 +
 .../src}/vendor/AddressAliasHelper.sol             |    0
 .../contracts/L1/L1ERC721Bridge.sol => /dev/null   |  107 --
 .../contracts/L2/L2ERC721Bridge.sol => /dev/null   |  126 ---
 .../libraries/Arithmetic.sol => /dev/null          |   48 -
 .../contracts/libraries/Burn.sol => /dev/null      |   42 -
 .../contracts/libraries/Constants.sol => /dev/null |   49 -
 .../contracts/libraries/Encoding.sol => /dev/null  |  162 ---
 .../contracts/libraries/Hashing.sol => /dev/null   |  172 ----
 .../contracts/libraries/SafeCall.sol => /dev/null  |  104 --
 .../contracts/libraries/Types.sol => /dev/null     |   84 --
 .../libraries/rlp/RLPWriter.sol => /dev/null       |  221 ----
 .../CrossDomainMessenger.sol => /dev/null          |  483 ---------
 .../universal/ERC721Bridge.sol => /dev/null        |  214 ----
 .../IOptimismMintableERC721.sol => /dev/null       |   76 --
 .../contracts/universal/Semver.sol => /dev/null    |   58 --
 .../contracts/proxy/utils/Initializable.sol        |    0
 .../contracts/token/ERC20/ERC20.sol                |    0
 .../contracts/token/ERC20/IERC20.sol               |    0
 .../token/ERC20/extensions/IERC20Metadata.sol      |    0
 .../token/ERC20/extensions/draft-IERC20Permit.sol  |    0
 .../contracts/token/ERC20/utils/SafeERC20.sol      |    0
 .../contracts/token/ERC721/IERC721.sol             |    0
 .../token/ERC721/extensions/IERC721Enumerable.sol  |    0
 .../contracts/utils/Address.sol                    |    0
 .../contracts/utils/Context.sol                    |    0
 .../utils/introspection/ERC165Checker.sol          |    0
 .../contracts/utils/introspection/IERC165.sol      |    0
 .../contracts/utils/math/Math.sol                  |    0
 .../contracts/utils/math/SignedMath.sol            |    0
 .../contracts}/proxy/utils/Initializable.sol       |    0
 .../contracts}/utils/AddressUpgradeable.sol        |    0
 .../lib}/solmate/src/utils/FixedPointMathLib.sol   |    0
 .../L1ERC721Bridge/implementation/meta.txt         |    2 +-
 .../contracts/utils/Strings.sol => /dev/null       |   75 --
 .../implementation/src/L1/L1ERC721Bridge.sol       |  121 +++
 .../implementation/src}/L1/ResourceMetering.sol    |  124 +--
 .../implementation/src/L1/SuperchainConfig.sol     |   94 ++
 .../implementation/src/L2/L2ERC721Bridge.sol       |  126 +++
 .../implementation/src/libraries/Arithmetic.sol    |   28 +
 .../implementation/src/libraries/Burn.sol          |   32 +
 .../implementation/src/libraries/Constants.sol     |   46 +
 .../implementation/src/libraries/Encoding.sol      |  176 ++++
 .../implementation/src/libraries/Hashing.sol       |  124 +++
 .../implementation/src/libraries/Predeploys.sol    |  113 ++
 .../implementation/src/libraries/SafeCall.sol      |  142 +++
 .../implementation/src/libraries/Storage.sol       |   88 ++
 .../implementation/src/libraries/Types.sol         |   70 ++
 .../implementation/src/libraries/rlp/RLPWriter.sol |  163 +++
 .../src/universal/CrossDomainMessenger.sol         |  406 ++++++++
 .../implementation/src/universal/ERC721Bridge.sol  |  195 ++++
 .../src}/universal/IOptimismMintableERC20.sol      |   21 +-
 .../src/universal/IOptimismMintableERC721.sol      |   48 +
 .../implementation/src/universal/ISemver.sol       |   13 +
 .../src/universal/OptimismMintableERC20.sol        |  140 +++
 .../src/universal/StandardBridge.sol               |  489 +++++++++
 .../contracts/L1/L1StandardBridge.sol => /dev/null |  364 -------
 .../libraries/Arithmetic.sol => /dev/null          |   48 -
 .../contracts/libraries/Burn.sol => /dev/null      |   42 -
 .../contracts/libraries/Constants.sol => /dev/null |   49 -
 .../contracts/libraries/Encoding.sol => /dev/null  |  162 ---
 .../contracts/libraries/Hashing.sol => /dev/null   |  172 ----
 .../libraries/Predeploys.sol => /dev/null          |  112 --
 .../contracts/libraries/SafeCall.sol => /dev/null  |  104 --
 .../contracts/libraries/Types.sol => /dev/null     |   84 --
 .../libraries/rlp/RLPWriter.sol => /dev/null       |  221 ----
 .../CrossDomainMessenger.sol => /dev/null          |  483 ---------
 .../OptimismMintableERC20.sol => /dev/null         |  149 ---
 .../contracts/universal/Semver.sol => /dev/null    |   58 --
 .../universal/StandardBridge.sol => /dev/null      |  561 ----------
 .../contracts/proxy/utils/Initializable.sol        |    0
 .../contracts/token/ERC20/ERC20.sol                |  383 +++++++
 .../contracts/token/ERC20/IERC20.sol               |   82 ++
 .../token/ERC20/extensions/IERC20Metadata.sol      |   28 +
 .../token/ERC20/extensions/draft-IERC20Permit.sol  |   60 ++
 .../contracts/token/ERC20/utils/SafeERC20.sol      |  116 +++
 .../contracts/utils/Address.sol                    |    0
 .../contracts/utils/Context.sol                    |   24 +
 .../utils/introspection/ERC165Checker.sol          |    0
 .../contracts/utils/introspection/IERC165.sol      |    0
 .../contracts/utils/math/Math.sol                  |    0
 .../contracts/utils/math/SignedMath.sol            |    0
 .../contracts}/proxy/utils/Initializable.sol       |    0
 .../contracts}/utils/AddressUpgradeable.sol        |    0
 .../lib}/solmate/src/utils/FixedPointMathLib.sol   |    0
 .../L1StandardBridge/implementation/meta.txt       |    2 +-
 .../contracts/utils/Strings.sol => /dev/null       |   75 --
 .../implementation/src/L1/L1StandardBridge.sol     |  321 ++++++
 .../implementation/src}/L1/ResourceMetering.sol    |  124 +--
 .../implementation/src/L1/SuperchainConfig.sol     |   94 ++
 .../implementation/src/libraries/Arithmetic.sol    |   28 +
 .../implementation/src/libraries/Burn.sol          |   32 +
 .../implementation/src/libraries/Constants.sol     |   46 +
 .../implementation/src/libraries/Encoding.sol      |  176 ++++
 .../implementation/src/libraries/Hashing.sol       |  124 +++
 .../implementation/src/libraries/Predeploys.sol    |  113 ++
 .../implementation/src/libraries/SafeCall.sol      |  142 +++
 .../implementation/src/libraries/Storage.sol       |   88 ++
 .../implementation/src/libraries/Types.sol         |   70 ++
 .../implementation/src/libraries/rlp/RLPWriter.sol |  163 +++
 .../src/universal/CrossDomainMessenger.sol         |  406 ++++++++
 .../src/universal/IOptimismMintableERC20.sol       |   31 +
 .../implementation/src/universal/ISemver.sol       |   13 +
 .../src/universal/OptimismMintableERC20.sol        |  140 +++
 .../src/universal/StandardBridge.sol               |  489 +++++++++
 .../contracts/L1/L2OutputOracle.sol => /dev/null   |  350 -------
 .../contracts/libraries/Types.sol => /dev/null     |   84 --
 .../contracts/universal/Semver.sol => /dev/null    |   58 --
 .../contracts/proxy/utils/Initializable.sol        |    0
 .../contracts/utils/Address.sol                    |    0
 .../contracts/utils/math/Math.sol                  |    0
 .../contracts/utils/math/SignedMath.sol            |    0
 .../lib}/solmate/src/utils/FixedPointMathLib.sol   |    0
 .../L2OutputOracle/implementation/meta.txt         |    2 +-
 .../contracts/utils/Strings.sol => /dev/null       |   75 --
 .../implementation/src/L1/L2OutputOracle.sol       |  317 ++++++
 .../implementation/src/L1/ResourceMetering.sol     |  162 +++
 .../implementation/src/libraries/Arithmetic.sol    |   28 +
 .../implementation/src/libraries/Burn.sol          |   32 +
 .../implementation/src/libraries/Constants.sol     |   46 +
 .../implementation/src/libraries/Types.sol         |   70 ++
 .../implementation/src/universal/ISemver.sol       |   13 +
 .../@openzeppelin/contracts/access/Ownable.sol     |   68 ++
 .../@openzeppelin/contracts/utils/Context.sol      |   24 +
 .../libraries/resolver/Lib_AddressManager.sol      |   95 ++
 .../ethereum/.code/Lib_AddressManager/meta.txt     |    2 +
 .../contracts/proxy/utils/Initializable.sol        |    0
 .../contracts/token/ERC20/ERC20.sol                |  383 +++++++
 .../contracts/token/ERC20/IERC20.sol               |   82 ++
 .../token/ERC20/extensions/IERC20Metadata.sol      |   28 +
 .../contracts/utils/Address.sol                    |    0
 .../contracts/utils/Context.sol                    |   24 +
 .../contracts/utils/introspection/IERC165.sol      |   25 +
 .../implementation/meta.txt                        |    2 +
 .../src/universal/IOptimismMintableERC20.sol       |   31 +
 .../implementation/src/universal/ISemver.sol       |   13 +
 .../src/universal/OptimismMintableERC20.sol        |  140 +++
 .../src/universal/OptimismMintableERC20Factory.sol |  132 +++
 .../proxy/contracts/universal/Proxy.sol            |  217 ++++
 .../OptimismMintableERC20Factory/proxy/meta.txt    |    2 +
 .../contracts/L1/SystemConfig.sol => /dev/null     |  243 -----
 .../libraries/rlp/RLPWriter.sol => /dev/null       |  221 ----
 .../trie/SecureMerkleTrie.sol => /dev/null         |   64 --
 .../contracts/universal/Semver.sol => /dev/null    |   45 -
 .../contracts/utils/Strings.sol => /dev/null       |   75 --
 .../OptimismPortal/implementation/meta.txt         |    2 +-
 .../implementation/src/L1/L2OutputOracle.sol       |  317 ++++++
 .../implementation/src/L1/OptimismPortal.sol       |  433 ++++++++
 .../implementation/src/L1/ResourceMetering.sol     |  162 +++
 .../implementation/src/L1/SuperchainConfig.sol     |   94 ++
 .../implementation/src/L1/SystemConfig.sol         |  367 +++++++
 .../implementation/src/libraries/Arithmetic.sol    |   28 +
 .../implementation/src/libraries/Burn.sol          |   32 +
 .../implementation/src/libraries/Bytes.sol         |  144 +++
 .../implementation/src/libraries/Constants.sol     |   46 +
 .../implementation/src/libraries/Encoding.sol      |  176 ++++
 .../implementation/src/libraries/Hashing.sol       |  124 +++
 .../implementation/src/libraries/SafeCall.sol      |  142 +++
 .../implementation/src/libraries/Storage.sol       |   88 ++
 .../implementation/src/libraries/Types.sol         |   70 ++
 .../src}/libraries/rlp/RLPReader.sol               |  249 ++---
 .../implementation/src/libraries/rlp/RLPWriter.sol |  163 +++
 .../src}/libraries/trie/MerkleTrie.sol             |  210 ++--
 .../src/libraries/trie/SecureMerkleTrie.sol        |   49 +
 .../implementation/src/universal/ISemver.sol       |   13 +
 .../src}/vendor/AddressAliasHelper.sol             |    0
 .../implementation/contracts/GnosisSafe.sol        |  422 ++++++++
 .../implementation/contracts/base/Executor.sol     |   27 +
 .../contracts/base/FallbackManager.sol             |   53 +
 .../implementation/contracts/base/GuardManager.sol |   50 +
 .../contracts/base/ModuleManager.sol               |  133 +++
 .../implementation/contracts/base/OwnerManager.sol |  149 +++
 .../implementation/contracts/common/Enum.sol       |    8 +
 .../contracts/common/EtherPaymentFallback.sol      |   13 +
 .../contracts/common/SecuredTokenTransfer.sol      |   35 +
 .../contracts/common/SelfAuthorized.sol            |   16 +
 .../contracts/common/SignatureDecoder.sol          |   36 +
 .../implementation/contracts/common/Singleton.sol  |   11 +
 .../contracts/common/StorageAccessible.sol         |   47 +
 .../contracts/external/GnosisSafeMath.sol          |   54 +
 .../contracts/interfaces/ISignatureValidator.sol   |   20 +
 .../implementation/meta.txt                        |    2 +
 .../proxy/GnosisSafeProxy.sol                      |  155 +++
 .../.code/SecurityCouncilMultisig/proxy/meta.txt   |    2 +
 .../contracts/proxy/utils/Initializable.sol        |  138 +++
 .../contracts/utils/Address.sol                    |  222 ++++
 .../.code/SuperchainConfig/implementation/meta.txt |    2 +
 .../implementation/src/L1/SuperchainConfig.sol     |   94 ++
 .../implementation/src/libraries/Storage.sol       |   88 ++
 .../implementation/src/universal/ISemver.sol       |   13 +
 .../contracts/proxy/utils/Initializable.sol        |  138 +++
 .../contracts/utils/Address.sol                    |  222 ++++
 .../contracts/utils/math/Math.sol                  |  226 ++++
 .../contracts/utils/math/SignedMath.sol            |   43 +
 .../lib/solmate/src/utils/FixedPointMathLib.sol    |  366 +++++++
 .../ethereum/.code/SuperchainConfig/proxy/meta.txt |    2 +
 .../proxy/src}/L1/ResourceMetering.sol             |   14 +-
 .../proxy/src}/libraries/Arithmetic.sol            |   16 +-
 .../SuperchainConfig/proxy/src/libraries/Burn.sol  |   32 +
 .../proxy/src}/libraries/Constants.sol             |   15 +-
 .../SuperchainConfig/proxy/src/universal/Proxy.sol |  168 +++
 .../contracts/legacy/AddressManager.sol            |   64 ++
 .../contracts/legacy/L1ChugSplashProxy.sol         |  289 ++++++
 .../contracts/universal/Proxy.sol                  |  217 ++++
 .../contracts/universal/ProxyAdmin.sol             |  254 +++++
 .../ethereum/.code/SuperchainProxyAdmin/meta.txt   |    2 +
 .../@openzeppelin/contracts/access/Ownable.sol     |   83 ++
 .../@openzeppelin/contracts/utils/Context.sol      |   24 +
 .../implementation/contracts/GnosisSafe.sol        |  422 ++++++++
 .../implementation/contracts/base/Executor.sol     |   27 +
 .../contracts/base/FallbackManager.sol             |   53 +
 .../implementation/contracts/base/GuardManager.sol |   50 +
 .../contracts/base/ModuleManager.sol               |  133 +++
 .../implementation/contracts/base/OwnerManager.sol |  149 +++
 .../implementation/contracts/common/Enum.sol       |    8 +
 .../contracts/common/EtherPaymentFallback.sol      |   13 +
 .../contracts/common/SecuredTokenTransfer.sol      |   35 +
 .../contracts/common/SelfAuthorized.sol            |   16 +
 .../contracts/common/SignatureDecoder.sol          |   36 +
 .../implementation/contracts/common/Singleton.sol  |   11 +
 .../contracts/common/StorageAccessible.sol         |   47 +
 .../contracts/external/GnosisSafeMath.sol          |   54 +
 .../contracts/interfaces/ISignatureValidator.sol   |   20 +
 .../implementation/meta.txt                        |    2 +
 .../proxy/GnosisSafeProxy.sol                      |  155 +++
 .../.code/SuperchainProxyAdminOwner/proxy/meta.txt |    2 +
 .../contracts/L1/ResourceMetering.sol => /dev/null |  186 ----
 .../contracts/L1/SystemConfig.sol => /dev/null     |  297 ------
 .../libraries/Arithmetic.sol => /dev/null          |   48 -
 .../contracts/libraries/Burn.sol => /dev/null      |   42 -
 .../contracts/universal/Semver.sol => /dev/null    |   58 --
 .../contracts/proxy/utils/Initializable.sol        |  138 +++
 .../contracts/utils/Address.sol                    |  222 ++++
 .../contracts/utils/math/Math.sol                  |  226 ++++
 .../contracts/utils/math/SignedMath.sol            |   43 +
 .../contracts}/access/OwnableUpgradeable.sol       |    0
 .../contracts}/proxy/utils/Initializable.sol       |    0
 .../contracts}/utils/AddressUpgradeable.sol        |    0
 .../contracts}/utils/ContextUpgradeable.sol        |    0
 .../lib/solmate/src/utils/FixedPointMathLib.sol    |  366 +++++++
 .../SystemConfig/implementation/meta.txt           |    2 +-
 .../contracts/utils/Strings.sol => /dev/null       |   75 --
 .../implementation/src/L1/ResourceMetering.sol     |  162 +++
 .../implementation/src/L1/SystemConfig.sol         |  367 +++++++
 .../implementation/src/libraries/Arithmetic.sol    |   28 +
 .../implementation/src/libraries/Burn.sol          |   32 +
 .../implementation/src/libraries/Constants.sol     |   46 +
 .../implementation/src/libraries/Storage.sol       |   88 ++
 .../implementation/src/universal/ISemver.sol       |   13 +
 338 files changed, 22927 insertions(+), 10993 deletions(-)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19582837 (main branch discovery), not current.

```diff
    contract ModeMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      name:
-        "ModeMultisig"
+        "ProxyAdminOwner"
    }
```

Generated with discovered.json: 0x6f45a1009c898f828353ee2a8c6fb0af9ef7ed51

# Diff at Thu, 28 Mar 2024 10:23:04 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@dd32bb06b292cc8459fb09925454ee3a90f5c27e block: 19439842
- current block number: 19531989

## Description

Update discovery to include the multisig threshold.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19439842 (main branch discovery), not current.

```diff
    contract ChallengerMultisig (0x309Fe2536d01867018D120b40e4676723C53A14C) {
    +++ description: None
      upgradeability.threshold:
+        "4 of 6 (67%)"
    }
```

```diff
    contract ModeMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      upgradeability.threshold:
+        "3 of 5 (60%)"
    }
```

Generated with discovered.json: 0x1d22da0722e3ba859e81dc7e25fcc8b23f10048a

# Diff at Thu, 14 Mar 2024 07:33:30 GMT:

- chain: ethereum
- author: Bartek Kiepuszewski (<bkiepuszewski@gmail.com>)
- comparing to: main@c79c75cb88d41e2f05e9cca5d501133eae405bbe block: 19411974
- current block number: 19431787

## Description

Blobs are switched on.

## Watched changes

```diff
    contract SystemConfig (0x5e6432F18Bc5d497B1Ab2288a025Fbf9D69E2221) {
    +++ description: None
      values.opStackDA.isSequencerSendingBlobTx:
-        false
+        true
      values.overhead:
-        188
+        0
      values.scalar:
-        684000
+        "452312848583266388373324160190187140051835877600158453279133701594312344529"
    }
```

Generated with discovered.json: 0x7583f54e5c6195c95832243781e1837e45e36883

# Diff at Mon, 11 Mar 2024 12:53:12 GMT:

- chain: ethereum
- author: Michał Sobieraj-Jakubiec (<michalsidzej@gmail.com>)
- comparing to: main@64454506aee2b4b4e15b121f096369e92ec4cf20 block: 19176961
- current block number: 19411974

## Description

Update OP stack DA handler

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19176961 (main branch discovery), not current.

```diff
    contract SystemConfig (0x5e6432F18Bc5d497B1Ab2288a025Fbf9D69E2221) {
    +++ description: None
      values.opStackDA.isSequencerSendingBlobTx:
+        false
    }
```

Generated with discovered.json: 0xcc53221fa9d617cfac43ac7d0e03cc50a5345f8c

# Diff at Wed, 07 Feb 2024 14:38:56 GMT:

- chain: ethereum
- author: Michał Sobieraj-Jakubiec (<michalsidzej@gmail.com>)
- comparing to: main@2e35800e01005d93332a552032058dcd67f3631d block: 19175200
- current block number: 19176961

## Description

Added opStackSequencerInbox handler

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19175200 (main branch discovery), not current.

```diff
    contract SystemConfig (0x5e6432F18Bc5d497B1Ab2288a025Fbf9D69E2221) {
      values.sequencerInbox:
+        "0x24E59d9d3Bd73ccC28Dc54062AF7EF7bFF58Bd67"
    }
```

Generated with discovered.json: 0x90d5136a81557b8fc210bdfc11441aa43010487b

# Diff at Wed, 07 Feb 2024 08:43:32 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@64f1e0f27f831d3ef860a1c2faad8c77e04e6c29 block: 19113377
- current block number: 19175200

## Description

Updated with the new OpDAHandler to remove the field.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19113377 (main branch discovery), not current.

```diff
    contract SystemConfig (0x5e6432F18Bc5d497B1Ab2288a025Fbf9D69E2221) {
      values.opStackDA.isAllTxsLengthEqualToCelestiaDAExample:
-        false
    }
```

Generated with discovered.json: 0x8c8447d97aa00a6dffbf43381ebbea74a47cfdbd

# Diff at Mon, 29 Jan 2024 16:29:36 GMT:

- chain: ethereum
- author: Radina Talanova (<radinatalanova@Radinas-MacBook-Air.local>)
- current block number: 19113377

## Description

Update discovery to include the multisig threshold.

## Initial discovery

```diff
+   Status: CREATED
    contract L1ERC721Bridge (0x2901dA832a4D0297FF0691100A8E496626cc626D) {
    }
```

```diff
+   Status: CREATED
    contract ChallengerMultisig (0x309Fe2536d01867018D120b40e4676723C53A14C) {
    }
```

```diff
+   Status: CREATED
    contract L2OutputOracle (0x4317ba146D4933D889518a3e5E11Fe7a53199b04) {
    }
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x470d87b1dae09a454A43D1fD772A561a03276aB7) {
    }
```

```diff
+   Status: CREATED
    contract ModeMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    }
```

```diff
+   Status: CREATED
    contract AddressManager (0x50eF494573f28Cad6B64C31b7a00Cdaa48306e15) {
    }
```

```diff
+   Status: CREATED
    contract SystemConfig (0x5e6432F18Bc5d497B1Ab2288a025Fbf9D69E2221) {
    }
```

```diff
+   Status: CREATED
    contract L1StandardBridge (0x735aDBbE72226BD52e818E7181953f42E3b0FF21) {
    }
```

```diff
+   Status: CREATED
    contract OptimismPortal (0x8B34b14c7c7123459Cf3076b8Cb929BE097d0C07) {
    }
```

```diff
+   Status: CREATED
    contract L1CrossDomainMessenger (0x95bDCA6c8EdEB69C98Bd5bd17660BaCef1298A6f) {
    }
```

