Generated with discovered.json: 0x8d5bd59489351bad23bd41315902b06c16310ea0

# Diff at Mon, 14 Jul 2025 12:46:00 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@9f4300dad2f3d080cd56fa311d4a848556c74e72 block: 22208357
- current block number: 22208357

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22208357 (main branch discovery), not current.

```diff
    EOA  (0x000000000000000000000000000000000000dEaD) {
    +++ description: None
      address:
-        "0x000000000000000000000000000000000000dEaD"
+        "eth:0x000000000000000000000000000000000000dEaD"
    }
```

```diff
    contract SuperchainConfig (0x4b5b41c240173191425F5928bc6bdd0d439331BB) {
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      address:
-        "0x4b5b41c240173191425F5928bc6bdd0d439331BB"
+        "eth:0x4b5b41c240173191425F5928bc6bdd0d439331BB"
      values.$admin:
-        "0xCC53b447aFe07926423aB96D5496b1af30485ED2"
+        "eth:0xCC53b447aFe07926423aB96D5496b1af30485ED2"
      values.$implementation:
-        "0x45920c2242a7F2121716431Dd7c2d68740726934"
+        "eth:0x45920c2242a7F2121716431Dd7c2d68740726934"
      values.$pastUpgrades.0.2.0:
-        "0x45920c2242a7F2121716431Dd7c2d68740726934"
+        "eth:0x45920c2242a7F2121716431Dd7c2d68740726934"
      values.guardian:
-        "0xb356B146F1629c49C44344464F69BCDAfb4bb664"
+        "eth:0xb356B146F1629c49C44344464F69BCDAfb4bb664"
      implementationNames.0x4b5b41c240173191425F5928bc6bdd0d439331BB:
-        "Proxy"
      implementationNames.0x45920c2242a7F2121716431Dd7c2d68740726934:
-        "SuperchainConfig"
      implementationNames.eth:0x4b5b41c240173191425F5928bc6bdd0d439331BB:
+        "Proxy"
      implementationNames.eth:0x45920c2242a7F2121716431Dd7c2d68740726934:
+        "SuperchainConfig"
    }
```

```diff
    EOA  (0x4c465E58946145bb2BFC38833154f5A3B5728CF7) {
    +++ description: None
      address:
-        "0x4c465E58946145bb2BFC38833154f5A3B5728CF7"
+        "eth:0x4c465E58946145bb2BFC38833154f5A3B5728CF7"
    }
```

```diff
    contract L1ERC721Bridge (0x4FFB98dBC3086bA85d5E626a6EbC3D0d08533fF4) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      address:
-        "0x4FFB98dBC3086bA85d5E626a6EbC3D0d08533fF4"
+        "eth:0x4FFB98dBC3086bA85d5E626a6EbC3D0d08533fF4"
      values.$admin:
-        "0xCC53b447aFe07926423aB96D5496b1af30485ED2"
+        "eth:0xCC53b447aFe07926423aB96D5496b1af30485ED2"
      values.$implementation:
-        "0x91Cb4eb84F7117196B1c117C7705F2eAF55AfA16"
+        "eth:0x91Cb4eb84F7117196B1c117C7705F2eAF55AfA16"
      values.$pastUpgrades.0.2.0:
-        "0x91Cb4eb84F7117196B1c117C7705F2eAF55AfA16"
+        "eth:0x91Cb4eb84F7117196B1c117C7705F2eAF55AfA16"
      values.messenger:
-        "0x592C1299e0F8331D81A28C0FC7352Da24eDB444a"
+        "eth:0x592C1299e0F8331D81A28C0FC7352Da24eDB444a"
      values.MESSENGER:
-        "0x592C1299e0F8331D81A28C0FC7352Da24eDB444a"
+        "eth:0x592C1299e0F8331D81A28C0FC7352Da24eDB444a"
      values.OTHER_BRIDGE:
-        "0x4200000000000000000000000000000000000014"
+        "eth:0x4200000000000000000000000000000000000014"
      values.otherBridge:
-        "0x4200000000000000000000000000000000000014"
+        "eth:0x4200000000000000000000000000000000000014"
      values.superchainConfig:
-        "0x4b5b41c240173191425F5928bc6bdd0d439331BB"
+        "eth:0x4b5b41c240173191425F5928bc6bdd0d439331BB"
      implementationNames.0x4FFB98dBC3086bA85d5E626a6EbC3D0d08533fF4:
-        "Proxy"
      implementationNames.0x91Cb4eb84F7117196B1c117C7705F2eAF55AfA16:
-        "L1ERC721Bridge"
      implementationNames.eth:0x4FFB98dBC3086bA85d5E626a6EbC3D0d08533fF4:
+        "Proxy"
      implementationNames.eth:0x91Cb4eb84F7117196B1c117C7705F2eAF55AfA16:
+        "L1ERC721Bridge"
    }
```

```diff
    contract L1CrossDomainMessenger (0x592C1299e0F8331D81A28C0FC7352Da24eDB444a) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      address:
-        "0x592C1299e0F8331D81A28C0FC7352Da24eDB444a"
+        "eth:0x592C1299e0F8331D81A28C0FC7352Da24eDB444a"
      values.$admin:
-        "0xCC53b447aFe07926423aB96D5496b1af30485ED2"
+        "eth:0xCC53b447aFe07926423aB96D5496b1af30485ED2"
      values.$implementation:
-        "0x17AaA27ecEc9a0c530e6Dbd086b6049DCF6D9382"
+        "eth:0x17AaA27ecEc9a0c530e6Dbd086b6049DCF6D9382"
      values.$pastUpgrades.0.2.0:
-        "0x17AaA27ecEc9a0c530e6Dbd086b6049DCF6D9382"
+        "eth:0x17AaA27ecEc9a0c530e6Dbd086b6049DCF6D9382"
      values.OTHER_MESSENGER:
-        "0x4200000000000000000000000000000000000007"
+        "eth:0x4200000000000000000000000000000000000007"
      values.otherMessenger:
-        "0x4200000000000000000000000000000000000007"
+        "eth:0x4200000000000000000000000000000000000007"
      values.portal:
-        "0xC7bCb0e8839a28A1cFadd1CF716de9016CdA51ae"
+        "eth:0xC7bCb0e8839a28A1cFadd1CF716de9016CdA51ae"
      values.PORTAL:
-        "0xC7bCb0e8839a28A1cFadd1CF716de9016CdA51ae"
+        "eth:0xC7bCb0e8839a28A1cFadd1CF716de9016CdA51ae"
      values.ResolvedDelegateProxy_addressManager:
-        "0xFe27f187A9E46104a932189dDF229871E06B22F8"
+        "eth:0xFe27f187A9E46104a932189dDF229871E06B22F8"
      values.superchainConfig:
-        "0x4b5b41c240173191425F5928bc6bdd0d439331BB"
+        "eth:0x4b5b41c240173191425F5928bc6bdd0d439331BB"
      implementationNames.0x592C1299e0F8331D81A28C0FC7352Da24eDB444a:
-        "ResolvedDelegateProxy"
      implementationNames.0x17AaA27ecEc9a0c530e6Dbd086b6049DCF6D9382:
-        "L1CrossDomainMessenger"
      implementationNames.eth:0x592C1299e0F8331D81A28C0FC7352Da24eDB444a:
+        "ResolvedDelegateProxy"
      implementationNames.eth:0x17AaA27ecEc9a0c530e6Dbd086b6049DCF6D9382:
+        "L1CrossDomainMessenger"
    }
```

```diff
    EOA  (0x5DeB7dD12ccF0BFb3b2D26D0A4f302Fb6ACBdcA8) {
    +++ description: None
      address:
-        "0x5DeB7dD12ccF0BFb3b2D26D0A4f302Fb6ACBdcA8"
+        "eth:0x5DeB7dD12ccF0BFb3b2D26D0A4f302Fb6ACBdcA8"
    }
```

```diff
    contract OptimismMintableERC20Factory (0x5f962474834Cf1981Df6232e4b6431d3d10cb71D) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintableERC20 as this chain's representation of a token on the host chain, or vice-versa.
      address:
-        "0x5f962474834Cf1981Df6232e4b6431d3d10cb71D"
+        "eth:0x5f962474834Cf1981Df6232e4b6431d3d10cb71D"
      values.$admin:
-        "0xCC53b447aFe07926423aB96D5496b1af30485ED2"
+        "eth:0xCC53b447aFe07926423aB96D5496b1af30485ED2"
      values.$implementation:
-        "0x9a3292E64C7b7bf6E04c1ebC7D6671bD82dAbf8B"
+        "eth:0x9a3292E64C7b7bf6E04c1ebC7D6671bD82dAbf8B"
      values.$pastUpgrades.0.2.0:
-        "0x9a3292E64C7b7bf6E04c1ebC7D6671bD82dAbf8B"
+        "eth:0x9a3292E64C7b7bf6E04c1ebC7D6671bD82dAbf8B"
      values.bridge:
-        "0xc473ca7E02af24c129c2eEf51F2aDf0411c1Df69"
+        "eth:0xc473ca7E02af24c129c2eEf51F2aDf0411c1Df69"
      values.BRIDGE:
-        "0xc473ca7E02af24c129c2eEf51F2aDf0411c1Df69"
+        "eth:0xc473ca7E02af24c129c2eEf51F2aDf0411c1Df69"
      implementationNames.0x5f962474834Cf1981Df6232e4b6431d3d10cb71D:
-        "Proxy"
      implementationNames.0x9a3292E64C7b7bf6E04c1ebC7D6671bD82dAbf8B:
-        "OptimismMintableERC20Factory"
      implementationNames.eth:0x5f962474834Cf1981Df6232e4b6431d3d10cb71D:
+        "Proxy"
      implementationNames.eth:0x9a3292E64C7b7bf6E04c1ebC7D6671bD82dAbf8B:
+        "OptimismMintableERC20Factory"
    }
```

```diff
    EOA  (0x61fB1FDA30c900404CDfa22D3eAdCA86FdB95450) {
    +++ description: None
      address:
-        "0x61fB1FDA30c900404CDfa22D3eAdCA86FdB95450"
+        "eth:0x61fB1FDA30c900404CDfa22D3eAdCA86FdB95450"
    }
```

```diff
    contract RedstoneMultisig (0x70FdbCb066eD3621647Ddf61A1f40aaC6058Bc89) {
    +++ description: None
      address:
-        "0x70FdbCb066eD3621647Ddf61A1f40aaC6058Bc89"
+        "eth:0x70FdbCb066eD3621647Ddf61A1f40aaC6058Bc89"
      values.$implementation:
-        "0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
+        "eth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
      values.$members.0:
-        "0x5DeB7dD12ccF0BFb3b2D26D0A4f302Fb6ACBdcA8"
+        "eth:0x5DeB7dD12ccF0BFb3b2D26D0A4f302Fb6ACBdcA8"
      values.$members.1:
-        "0x61fB1FDA30c900404CDfa22D3eAdCA86FdB95450"
+        "eth:0x61fB1FDA30c900404CDfa22D3eAdCA86FdB95450"
      values.$members.2:
-        "0x7211399b320a0417286897fCeD1ee4ba1C1771d4"
+        "eth:0x7211399b320a0417286897fCeD1ee4ba1C1771d4"
      implementationNames.0x70FdbCb066eD3621647Ddf61A1f40aaC6058Bc89:
-        "GnosisSafeProxy"
      implementationNames.0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
-        "GnosisSafe"
      implementationNames.eth:0x70FdbCb066eD3621647Ddf61A1f40aaC6058Bc89:
+        "GnosisSafeProxy"
      implementationNames.eth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
+        "GnosisSafe"
    }
```

```diff
    EOA  (0x7211399b320a0417286897fCeD1ee4ba1C1771d4) {
    +++ description: None
      address:
-        "0x7211399b320a0417286897fCeD1ee4ba1C1771d4"
+        "eth:0x7211399b320a0417286897fCeD1ee4ba1C1771d4"
    }
```

```diff
    contract SystemConfig (0x8f2428F7189c0d92D1c4a5358903A8c80Ec6a69D) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      address:
-        "0x8f2428F7189c0d92D1c4a5358903A8c80Ec6a69D"
+        "eth:0x8f2428F7189c0d92D1c4a5358903A8c80Ec6a69D"
      values.$admin:
-        "0xCC53b447aFe07926423aB96D5496b1af30485ED2"
+        "eth:0xCC53b447aFe07926423aB96D5496b1af30485ED2"
      values.$implementation:
-        "0xd20eF07Ca38301735782e3B89c0E192fD8Ec002d"
+        "eth:0xd20eF07Ca38301735782e3B89c0E192fD8Ec002d"
      values.$pastUpgrades.0.2.0:
-        "0xd20eF07Ca38301735782e3B89c0E192fD8Ec002d"
+        "eth:0xd20eF07Ca38301735782e3B89c0E192fD8Ec002d"
      values.batcherHash:
-        "0xA31cb9Bc414601171D4537580f98F66C03aECd43"
+        "eth:0xA31cb9Bc414601171D4537580f98F66C03aECd43"
      values.batchInbox:
-        "0xff00000000000000000000000000000000000690"
+        "eth:0xff00000000000000000000000000000000000690"
      values.l1CrossDomainMessenger:
-        "0x592C1299e0F8331D81A28C0FC7352Da24eDB444a"
+        "eth:0x592C1299e0F8331D81A28C0FC7352Da24eDB444a"
      values.l1ERC721Bridge:
-        "0x4FFB98dBC3086bA85d5E626a6EbC3D0d08533fF4"
+        "eth:0x4FFB98dBC3086bA85d5E626a6EbC3D0d08533fF4"
      values.l1StandardBridge:
-        "0xc473ca7E02af24c129c2eEf51F2aDf0411c1Df69"
+        "eth:0xc473ca7E02af24c129c2eEf51F2aDf0411c1Df69"
      values.l2OutputOracle:
-        "0xa426A052f657AEEefc298b3B5c35a470e4739d69"
+        "eth:0xa426A052f657AEEefc298b3B5c35a470e4739d69"
      values.optimismMintableERC20Factory:
-        "0x5f962474834Cf1981Df6232e4b6431d3d10cb71D"
+        "eth:0x5f962474834Cf1981Df6232e4b6431d3d10cb71D"
      values.optimismPortal:
-        "0xC7bCb0e8839a28A1cFadd1CF716de9016CdA51ae"
+        "eth:0xC7bCb0e8839a28A1cFadd1CF716de9016CdA51ae"
      values.owner:
-        "0xb356B146F1629c49C44344464F69BCDAfb4bb664"
+        "eth:0xb356B146F1629c49C44344464F69BCDAfb4bb664"
      values.sequencerInbox:
-        "0xff00000000000000000000000000000000000690"
+        "eth:0xff00000000000000000000000000000000000690"
      values.unsafeBlockSigner:
-        "0xA5bdf717af725a47Fd7378d3D9C833776951efa0"
+        "eth:0xA5bdf717af725a47Fd7378d3D9C833776951efa0"
      implementationNames.0x8f2428F7189c0d92D1c4a5358903A8c80Ec6a69D:
-        "Proxy"
      implementationNames.0xd20eF07Ca38301735782e3B89c0E192fD8Ec002d:
-        "SystemConfig"
      implementationNames.eth:0x8f2428F7189c0d92D1c4a5358903A8c80Ec6a69D:
+        "Proxy"
      implementationNames.eth:0xd20eF07Ca38301735782e3B89c0E192fD8Ec002d:
+        "SystemConfig"
    }
```

```diff
    contract DataAvailabilityChallenge (0x97A2dA87d3439b172e6DD027220e01c9Cb565B80) {
    +++ description: The DataAvailabilityChallenge contract is used to challenge the full availability of data behind commimted transaction data hashes. See the technology section for more details.
      address:
-        "0x97A2dA87d3439b172e6DD027220e01c9Cb565B80"
+        "eth:0x97A2dA87d3439b172e6DD027220e01c9Cb565B80"
      values.$admin:
-        "0xCC53b447aFe07926423aB96D5496b1af30485ED2"
+        "eth:0xCC53b447aFe07926423aB96D5496b1af30485ED2"
      values.$implementation:
-        "0xba2507dbC415e0D0fa3AA10C2D4559049A93d946"
+        "eth:0xba2507dbC415e0D0fa3AA10C2D4559049A93d946"
      values.$pastUpgrades.0.2.0:
-        "0xba2507dbC415e0D0fa3AA10C2D4559049A93d946"
+        "eth:0xba2507dbC415e0D0fa3AA10C2D4559049A93d946"
      values.owner:
-        "0xb356B146F1629c49C44344464F69BCDAfb4bb664"
+        "eth:0xb356B146F1629c49C44344464F69BCDAfb4bb664"
      implementationNames.0x97A2dA87d3439b172e6DD027220e01c9Cb565B80:
-        "Proxy"
      implementationNames.0xba2507dbC415e0D0fa3AA10C2D4559049A93d946:
-        "DataAvailabilityChallenge"
      implementationNames.eth:0x97A2dA87d3439b172e6DD027220e01c9Cb565B80:
+        "Proxy"
      implementationNames.eth:0xba2507dbC415e0D0fa3AA10C2D4559049A93d946:
+        "DataAvailabilityChallenge"
    }
```

```diff
    EOA  (0xA31cb9Bc414601171D4537580f98F66C03aECd43) {
    +++ description: None
      address:
-        "0xA31cb9Bc414601171D4537580f98F66C03aECd43"
+        "eth:0xA31cb9Bc414601171D4537580f98F66C03aECd43"
    }
```

```diff
    contract L2OutputOracle (0xa426A052f657AEEefc298b3B5c35a470e4739d69) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      address:
-        "0xa426A052f657AEEefc298b3B5c35a470e4739d69"
+        "eth:0xa426A052f657AEEefc298b3B5c35a470e4739d69"
      values.$admin:
-        "0xCC53b447aFe07926423aB96D5496b1af30485ED2"
+        "eth:0xCC53b447aFe07926423aB96D5496b1af30485ED2"
      values.$implementation:
-        "0xB78071f03F4D7601129773070F2Dde6184e1BD87"
+        "eth:0xB78071f03F4D7601129773070F2Dde6184e1BD87"
      values.$pastUpgrades.0.2.0:
-        "0xB78071f03F4D7601129773070F2Dde6184e1BD87"
+        "eth:0xB78071f03F4D7601129773070F2Dde6184e1BD87"
+++ severity: HIGH
      values.challenger:
-        "0xb356B146F1629c49C44344464F69BCDAfb4bb664"
+        "eth:0xb356B146F1629c49C44344464F69BCDAfb4bb664"
      values.CHALLENGER:
-        "0xb356B146F1629c49C44344464F69BCDAfb4bb664"
+        "eth:0xb356B146F1629c49C44344464F69BCDAfb4bb664"
+++ severity: HIGH
      values.proposer:
-        "0x4c465E58946145bb2BFC38833154f5A3B5728CF7"
+        "eth:0x4c465E58946145bb2BFC38833154f5A3B5728CF7"
      values.PROPOSER:
-        "0x4c465E58946145bb2BFC38833154f5A3B5728CF7"
+        "eth:0x4c465E58946145bb2BFC38833154f5A3B5728CF7"
      implementationNames.0xa426A052f657AEEefc298b3B5c35a470e4739d69:
-        "Proxy"
      implementationNames.0xB78071f03F4D7601129773070F2Dde6184e1BD87:
-        "L2OutputOracle"
      implementationNames.eth:0xa426A052f657AEEefc298b3B5c35a470e4739d69:
+        "Proxy"
      implementationNames.eth:0xB78071f03F4D7601129773070F2Dde6184e1BD87:
+        "L2OutputOracle"
    }
```

```diff
    EOA  (0xA5bdf717af725a47Fd7378d3D9C833776951efa0) {
    +++ description: None
      address:
-        "0xA5bdf717af725a47Fd7378d3D9C833776951efa0"
+        "eth:0xA5bdf717af725a47Fd7378d3D9C833776951efa0"
    }
```

```diff
    EOA  (0xb356B146F1629c49C44344464F69BCDAfb4bb664) {
    +++ description: None
      address:
-        "0xb356B146F1629c49C44344464F69BCDAfb4bb664"
+        "eth:0xb356B146F1629c49C44344464F69BCDAfb4bb664"
    }
```

```diff
    contract L1StandardBridge (0xc473ca7E02af24c129c2eEf51F2aDf0411c1Df69) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      address:
-        "0xc473ca7E02af24c129c2eEf51F2aDf0411c1Df69"
+        "eth:0xc473ca7E02af24c129c2eEf51F2aDf0411c1Df69"
      values.$admin:
-        "0xCC53b447aFe07926423aB96D5496b1af30485ED2"
+        "eth:0xCC53b447aFe07926423aB96D5496b1af30485ED2"
      values.$implementation:
-        "0x49b20cBfA1d582475b2466A784B91dEe4549C737"
+        "eth:0x49b20cBfA1d582475b2466A784B91dEe4549C737"
      values.l2TokenBridge:
-        "0x4200000000000000000000000000000000000010"
+        "eth:0x4200000000000000000000000000000000000010"
      values.messenger:
-        "0x592C1299e0F8331D81A28C0FC7352Da24eDB444a"
+        "eth:0x592C1299e0F8331D81A28C0FC7352Da24eDB444a"
      values.MESSENGER:
-        "0x592C1299e0F8331D81A28C0FC7352Da24eDB444a"
+        "eth:0x592C1299e0F8331D81A28C0FC7352Da24eDB444a"
      values.OTHER_BRIDGE:
-        "0x4200000000000000000000000000000000000010"
+        "eth:0x4200000000000000000000000000000000000010"
      values.otherBridge:
-        "0x4200000000000000000000000000000000000010"
+        "eth:0x4200000000000000000000000000000000000010"
      values.superchainConfig:
-        "0x4b5b41c240173191425F5928bc6bdd0d439331BB"
+        "eth:0x4b5b41c240173191425F5928bc6bdd0d439331BB"
      implementationNames.0xc473ca7E02af24c129c2eEf51F2aDf0411c1Df69:
-        "L1ChugSplashProxy"
      implementationNames.0x49b20cBfA1d582475b2466A784B91dEe4549C737:
-        "L1StandardBridge"
      implementationNames.eth:0xc473ca7E02af24c129c2eEf51F2aDf0411c1Df69:
+        "L1ChugSplashProxy"
      implementationNames.eth:0x49b20cBfA1d582475b2466A784B91dEe4549C737:
+        "L1StandardBridge"
    }
```

```diff
    contract OptimismPortal (0xC7bCb0e8839a28A1cFadd1CF716de9016CdA51ae) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      address:
-        "0xC7bCb0e8839a28A1cFadd1CF716de9016CdA51ae"
+        "eth:0xC7bCb0e8839a28A1cFadd1CF716de9016CdA51ae"
      values.$admin:
-        "0xCC53b447aFe07926423aB96D5496b1af30485ED2"
+        "eth:0xCC53b447aFe07926423aB96D5496b1af30485ED2"
      values.$implementation:
-        "0xD0e1065F2A941Dd723F800C34D2D4282C3158A00"
+        "eth:0xD0e1065F2A941Dd723F800C34D2D4282C3158A00"
      values.$pastUpgrades.0.2.0:
-        "0xD0e1065F2A941Dd723F800C34D2D4282C3158A00"
+        "eth:0xD0e1065F2A941Dd723F800C34D2D4282C3158A00"
      values.guardian:
-        "0xb356B146F1629c49C44344464F69BCDAfb4bb664"
+        "eth:0xb356B146F1629c49C44344464F69BCDAfb4bb664"
      values.GUARDIAN:
-        "0xb356B146F1629c49C44344464F69BCDAfb4bb664"
+        "eth:0xb356B146F1629c49C44344464F69BCDAfb4bb664"
      values.L2_ORACLE:
-        "0xa426A052f657AEEefc298b3B5c35a470e4739d69"
+        "eth:0xa426A052f657AEEefc298b3B5c35a470e4739d69"
      values.l2Oracle:
-        "0xa426A052f657AEEefc298b3B5c35a470e4739d69"
+        "eth:0xa426A052f657AEEefc298b3B5c35a470e4739d69"
      values.l2Sender:
-        "0x000000000000000000000000000000000000dEaD"
+        "eth:0x000000000000000000000000000000000000dEaD"
      values.superchainConfig:
-        "0x4b5b41c240173191425F5928bc6bdd0d439331BB"
+        "eth:0x4b5b41c240173191425F5928bc6bdd0d439331BB"
      values.SYSTEM_CONFIG:
-        "0x8f2428F7189c0d92D1c4a5358903A8c80Ec6a69D"
+        "eth:0x8f2428F7189c0d92D1c4a5358903A8c80Ec6a69D"
      values.systemConfig:
-        "0x8f2428F7189c0d92D1c4a5358903A8c80Ec6a69D"
+        "eth:0x8f2428F7189c0d92D1c4a5358903A8c80Ec6a69D"
      implementationNames.0xC7bCb0e8839a28A1cFadd1CF716de9016CdA51ae:
-        "Proxy"
      implementationNames.0xD0e1065F2A941Dd723F800C34D2D4282C3158A00:
-        "OptimismPortal"
      implementationNames.eth:0xC7bCb0e8839a28A1cFadd1CF716de9016CdA51ae:
+        "Proxy"
      implementationNames.eth:0xD0e1065F2A941Dd723F800C34D2D4282C3158A00:
+        "OptimismPortal"
    }
```

```diff
    contract ProxyAdmin (0xCC53b447aFe07926423aB96D5496b1af30485ED2) {
    +++ description: None
      address:
-        "0xCC53b447aFe07926423aB96D5496b1af30485ED2"
+        "eth:0xCC53b447aFe07926423aB96D5496b1af30485ED2"
      values.addressManager:
-        "0xFe27f187A9E46104a932189dDF229871E06B22F8"
+        "eth:0xFe27f187A9E46104a932189dDF229871E06B22F8"
      values.owner:
-        "0x70FdbCb066eD3621647Ddf61A1f40aaC6058Bc89"
+        "eth:0x70FdbCb066eD3621647Ddf61A1f40aaC6058Bc89"
      implementationNames.0xCC53b447aFe07926423aB96D5496b1af30485ED2:
-        "ProxyAdmin"
      implementationNames.eth:0xCC53b447aFe07926423aB96D5496b1af30485ED2:
+        "ProxyAdmin"
    }
```

```diff
    contract AddressManager (0xFe27f187A9E46104a932189dDF229871E06B22F8) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      address:
-        "0xFe27f187A9E46104a932189dDF229871E06B22F8"
+        "eth:0xFe27f187A9E46104a932189dDF229871E06B22F8"
      values.owner:
-        "0xCC53b447aFe07926423aB96D5496b1af30485ED2"
+        "eth:0xCC53b447aFe07926423aB96D5496b1af30485ED2"
      implementationNames.0xFe27f187A9E46104a932189dDF229871E06B22F8:
-        "AddressManager"
      implementationNames.eth:0xFe27f187A9E46104a932189dDF229871E06B22F8:
+        "AddressManager"
    }
```

```diff
    EOA  (0xff00000000000000000000000000000000000690) {
    +++ description: None
      address:
-        "0xff00000000000000000000000000000000000690"
+        "eth:0xff00000000000000000000000000000000000690"
    }
```

```diff
+   Status: CREATED
    contract SuperchainConfig (0x4b5b41c240173191425F5928bc6bdd0d439331BB)
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
```

```diff
+   Status: CREATED
    contract L1ERC721Bridge (0x4FFB98dBC3086bA85d5E626a6EbC3D0d08533fF4)
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
```

```diff
+   Status: CREATED
    contract L1CrossDomainMessenger (0x592C1299e0F8331D81A28C0FC7352Da24eDB444a)
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
```

```diff
+   Status: CREATED
    contract OptimismMintableERC20Factory (0x5f962474834Cf1981Df6232e4b6431d3d10cb71D)
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintableERC20 as this chain's representation of a token on the host chain, or vice-versa.
```

```diff
+   Status: CREATED
    contract RedstoneMultisig (0x70FdbCb066eD3621647Ddf61A1f40aaC6058Bc89)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SystemConfig (0x8f2428F7189c0d92D1c4a5358903A8c80Ec6a69D)
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
```

```diff
+   Status: CREATED
    contract DataAvailabilityChallenge (0x97A2dA87d3439b172e6DD027220e01c9Cb565B80)
    +++ description: The DataAvailabilityChallenge contract is used to challenge the full availability of data behind commimted transaction data hashes. See the technology section for more details.
```

```diff
+   Status: CREATED
    contract L2OutputOracle (0xa426A052f657AEEefc298b3B5c35a470e4739d69)
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
```

```diff
+   Status: CREATED
    contract L1StandardBridge (0xc473ca7E02af24c129c2eEf51F2aDf0411c1Df69)
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
```

```diff
+   Status: CREATED
    contract OptimismPortal (0xC7bCb0e8839a28A1cFadd1CF716de9016CdA51ae)
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0xCC53b447aFe07926423aB96D5496b1af30485ED2)
    +++ description: None
```

```diff
+   Status: CREATED
    contract AddressManager (0xFe27f187A9E46104a932189dDF229871E06B22F8)
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
```

Generated with discovered.json: 0xc0bd537020642e28768e3607cd301a3686c1f539

# Diff at Mon, 14 Jul 2025 08:02:46 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@0dc82cd5064c9c6dc9fb20e2291a8bb6b2048e27 block: 22208357
- current block number: 22208357

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22208357 (main branch discovery), not current.

```diff
    contract OptimismMintableERC20Factory (0x5f962474834Cf1981Df6232e4b6431d3d10cb71D) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintableERC20 as this chain's representation of a token on the host chain, or vice-versa.
      description:
-        "A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa."
+        "A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintableERC20 as this chain's representation of a token on the host chain, or vice-versa."
    }
```

Generated with discovered.json: 0x923529edd24d5d701c22f115564ae76ea885cd2a

# Diff at Fri, 04 Jul 2025 12:19:17 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f56dc47fe915564d4555300304da4d3bcbc087f block: 22208357
- current block number: 22208357

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22208357 (main branch discovery), not current.

```diff
    EOA  (0x4c465E58946145bb2BFC38833154f5A3B5728CF7) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0xa426A052f657AEEefc298b3B5c35a470e4739d69"
+        "eth:0xa426A052f657AEEefc298b3B5c35a470e4739d69"
      receivedPermissions.1.from:
-        "ethereum:0xa426A052f657AEEefc298b3B5c35a470e4739d69"
+        "eth:0xa426A052f657AEEefc298b3B5c35a470e4739d69"
    }
```

```diff
    contract RedstoneMultisig (0x70FdbCb066eD3621647Ddf61A1f40aaC6058Bc89) {
    +++ description: None
      receivedPermissions.0.via.0.address:
-        "ethereum:0xCC53b447aFe07926423aB96D5496b1af30485ED2"
+        "eth:0xCC53b447aFe07926423aB96D5496b1af30485ED2"
      receivedPermissions.0.from:
-        "ethereum:0xFe27f187A9E46104a932189dDF229871E06B22F8"
+        "eth:0xFe27f187A9E46104a932189dDF229871E06B22F8"
      receivedPermissions.1.via.0.address:
-        "ethereum:0xCC53b447aFe07926423aB96D5496b1af30485ED2"
+        "eth:0xCC53b447aFe07926423aB96D5496b1af30485ED2"
      receivedPermissions.1.from:
-        "ethereum:0x4b5b41c240173191425F5928bc6bdd0d439331BB"
+        "eth:0x4b5b41c240173191425F5928bc6bdd0d439331BB"
      receivedPermissions.2.via.0.address:
-        "ethereum:0xCC53b447aFe07926423aB96D5496b1af30485ED2"
+        "eth:0xCC53b447aFe07926423aB96D5496b1af30485ED2"
      receivedPermissions.2.from:
-        "ethereum:0x4FFB98dBC3086bA85d5E626a6EbC3D0d08533fF4"
+        "eth:0x4FFB98dBC3086bA85d5E626a6EbC3D0d08533fF4"
      receivedPermissions.3.via.0.address:
-        "ethereum:0xCC53b447aFe07926423aB96D5496b1af30485ED2"
+        "eth:0xCC53b447aFe07926423aB96D5496b1af30485ED2"
      receivedPermissions.3.from:
-        "ethereum:0x592C1299e0F8331D81A28C0FC7352Da24eDB444a"
+        "eth:0x592C1299e0F8331D81A28C0FC7352Da24eDB444a"
      receivedPermissions.4.via.0.address:
-        "ethereum:0xCC53b447aFe07926423aB96D5496b1af30485ED2"
+        "eth:0xCC53b447aFe07926423aB96D5496b1af30485ED2"
      receivedPermissions.4.from:
-        "ethereum:0x5f962474834Cf1981Df6232e4b6431d3d10cb71D"
+        "eth:0x5f962474834Cf1981Df6232e4b6431d3d10cb71D"
      receivedPermissions.5.via.0.address:
-        "ethereum:0xCC53b447aFe07926423aB96D5496b1af30485ED2"
+        "eth:0xCC53b447aFe07926423aB96D5496b1af30485ED2"
      receivedPermissions.5.from:
-        "ethereum:0x8f2428F7189c0d92D1c4a5358903A8c80Ec6a69D"
+        "eth:0x8f2428F7189c0d92D1c4a5358903A8c80Ec6a69D"
      receivedPermissions.6.via.0.address:
-        "ethereum:0xCC53b447aFe07926423aB96D5496b1af30485ED2"
+        "eth:0xCC53b447aFe07926423aB96D5496b1af30485ED2"
      receivedPermissions.6.from:
-        "ethereum:0x97A2dA87d3439b172e6DD027220e01c9Cb565B80"
+        "eth:0x97A2dA87d3439b172e6DD027220e01c9Cb565B80"
      receivedPermissions.7.via.0.address:
-        "ethereum:0xCC53b447aFe07926423aB96D5496b1af30485ED2"
+        "eth:0xCC53b447aFe07926423aB96D5496b1af30485ED2"
      receivedPermissions.7.from:
-        "ethereum:0xa426A052f657AEEefc298b3B5c35a470e4739d69"
+        "eth:0xa426A052f657AEEefc298b3B5c35a470e4739d69"
      receivedPermissions.8.via.0.address:
-        "ethereum:0xCC53b447aFe07926423aB96D5496b1af30485ED2"
+        "eth:0xCC53b447aFe07926423aB96D5496b1af30485ED2"
      receivedPermissions.8.from:
-        "ethereum:0xc473ca7E02af24c129c2eEf51F2aDf0411c1Df69"
+        "eth:0xc473ca7E02af24c129c2eEf51F2aDf0411c1Df69"
      receivedPermissions.9.via.0.address:
-        "ethereum:0xCC53b447aFe07926423aB96D5496b1af30485ED2"
+        "eth:0xCC53b447aFe07926423aB96D5496b1af30485ED2"
      receivedPermissions.9.from:
-        "ethereum:0xC7bCb0e8839a28A1cFadd1CF716de9016CdA51ae"
+        "eth:0xC7bCb0e8839a28A1cFadd1CF716de9016CdA51ae"
      directlyReceivedPermissions.0.from:
-        "ethereum:0xCC53b447aFe07926423aB96D5496b1af30485ED2"
+        "eth:0xCC53b447aFe07926423aB96D5496b1af30485ED2"
    }
```

```diff
    EOA  (0xA31cb9Bc414601171D4537580f98F66C03aECd43) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0x8f2428F7189c0d92D1c4a5358903A8c80Ec6a69D"
+        "eth:0x8f2428F7189c0d92D1c4a5358903A8c80Ec6a69D"
    }
```

```diff
    EOA  (0xb356B146F1629c49C44344464F69BCDAfb4bb664) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0xa426A052f657AEEefc298b3B5c35a470e4739d69"
+        "eth:0xa426A052f657AEEefc298b3B5c35a470e4739d69"
      receivedPermissions.1.from:
-        "ethereum:0xa426A052f657AEEefc298b3B5c35a470e4739d69"
+        "eth:0xa426A052f657AEEefc298b3B5c35a470e4739d69"
      receivedPermissions.2.from:
-        "ethereum:0x4b5b41c240173191425F5928bc6bdd0d439331BB"
+        "eth:0x4b5b41c240173191425F5928bc6bdd0d439331BB"
      receivedPermissions.3.from:
-        "ethereum:0xC7bCb0e8839a28A1cFadd1CF716de9016CdA51ae"
+        "eth:0xC7bCb0e8839a28A1cFadd1CF716de9016CdA51ae"
      receivedPermissions.4.from:
-        "ethereum:0xC7bCb0e8839a28A1cFadd1CF716de9016CdA51ae"
+        "eth:0xC7bCb0e8839a28A1cFadd1CF716de9016CdA51ae"
      receivedPermissions.5.from:
-        "ethereum:0x8f2428F7189c0d92D1c4a5358903A8c80Ec6a69D"
+        "eth:0x8f2428F7189c0d92D1c4a5358903A8c80Ec6a69D"
      receivedPermissions.6.from:
-        "ethereum:0x97A2dA87d3439b172e6DD027220e01c9Cb565B80"
+        "eth:0x97A2dA87d3439b172e6DD027220e01c9Cb565B80"
    }
```

```diff
    contract ProxyAdmin (0xCC53b447aFe07926423aB96D5496b1af30485ED2) {
    +++ description: None
      directlyReceivedPermissions.0.from:
-        "ethereum:0xFe27f187A9E46104a932189dDF229871E06B22F8"
+        "eth:0xFe27f187A9E46104a932189dDF229871E06B22F8"
      directlyReceivedPermissions.1.from:
-        "ethereum:0x4b5b41c240173191425F5928bc6bdd0d439331BB"
+        "eth:0x4b5b41c240173191425F5928bc6bdd0d439331BB"
      directlyReceivedPermissions.2.from:
-        "ethereum:0x4FFB98dBC3086bA85d5E626a6EbC3D0d08533fF4"
+        "eth:0x4FFB98dBC3086bA85d5E626a6EbC3D0d08533fF4"
      directlyReceivedPermissions.3.from:
-        "ethereum:0x592C1299e0F8331D81A28C0FC7352Da24eDB444a"
+        "eth:0x592C1299e0F8331D81A28C0FC7352Da24eDB444a"
      directlyReceivedPermissions.4.from:
-        "ethereum:0x5f962474834Cf1981Df6232e4b6431d3d10cb71D"
+        "eth:0x5f962474834Cf1981Df6232e4b6431d3d10cb71D"
      directlyReceivedPermissions.5.from:
-        "ethereum:0x8f2428F7189c0d92D1c4a5358903A8c80Ec6a69D"
+        "eth:0x8f2428F7189c0d92D1c4a5358903A8c80Ec6a69D"
      directlyReceivedPermissions.6.from:
-        "ethereum:0x97A2dA87d3439b172e6DD027220e01c9Cb565B80"
+        "eth:0x97A2dA87d3439b172e6DD027220e01c9Cb565B80"
      directlyReceivedPermissions.7.from:
-        "ethereum:0xa426A052f657AEEefc298b3B5c35a470e4739d69"
+        "eth:0xa426A052f657AEEefc298b3B5c35a470e4739d69"
      directlyReceivedPermissions.8.from:
-        "ethereum:0xc473ca7E02af24c129c2eEf51F2aDf0411c1Df69"
+        "eth:0xc473ca7E02af24c129c2eEf51F2aDf0411c1Df69"
      directlyReceivedPermissions.9.from:
-        "ethereum:0xC7bCb0e8839a28A1cFadd1CF716de9016CdA51ae"
+        "eth:0xC7bCb0e8839a28A1cFadd1CF716de9016CdA51ae"
    }
```

Generated with discovered.json: 0x2300e4f445745af9d36dd6497d10b83f1edfc2c5

# Diff at Mon, 16 Jun 2025 08:42:44 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@e1208475abce20cea1768d2e4878c03350c1b7c9 block: 22208357
- current block number: 22208357

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22208357 (main branch discovery), not current.

```diff
    contract L1CrossDomainMessenger (0x592C1299e0F8331D81A28C0FC7352Da24eDB444a) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      values.$admin:
+        "0xCC53b447aFe07926423aB96D5496b1af30485ED2"
    }
```

```diff
    contract RedstoneMultisig (0x70FdbCb066eD3621647Ddf61A1f40aaC6058Bc89) {
    +++ description: None
      receivedPermissions.9:
+        {"permission":"upgrade","from":"ethereum:0x592C1299e0F8331D81A28C0FC7352Da24eDB444a","role":"admin","via":[{"address":"ethereum:0xCC53b447aFe07926423aB96D5496b1af30485ED2"}]}
    }
```

```diff
    contract ProxyAdmin (0xCC53b447aFe07926423aB96D5496b1af30485ED2) {
    +++ description: None
      directlyReceivedPermissions.9:
+        {"permission":"upgrade","from":"ethereum:0x592C1299e0F8331D81A28C0FC7352Da24eDB444a","role":"admin"}
    }
```

Generated with discovered.json: 0x2e5c793482769287ef6933e12754550285ec0b40

# Diff at Fri, 30 May 2025 07:13:51 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@a4d8c436027d17df0f9b76843cd6deb1888fa381 block: 22208357
- current block number: 22208357

## Description

config: change comment about eip1559 fee val

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22208357 (main branch discovery), not current.

```diff
    contract SystemConfig (0x8f2428F7189c0d92D1c4a5358903A8c80Ec6a69D) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      fieldMeta.eip1559Denominator:
+        {"description":"volatility param: lower denominator -> quicker fee changes on L2"}
    }
```

Generated with discovered.json: 0x12fd714825f353a038f651d00e4a6ff9a5587a1f

# Diff at Fri, 23 May 2025 09:41:02 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@69cd181abbc3c830a6caf2f4429b37cae72ffdb8 block: 22208357
- current block number: 22208357

## Description

Introduced .role field on each permission, defaulting to field name on which it was defined (with '.' prefix)

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22208357 (main branch discovery), not current.

```diff
    EOA  (0x4c465E58946145bb2BFC38833154f5A3B5728CF7) {
    +++ description: None
      receivedPermissions.1:
+        {"permission":"propose","from":"0xa426A052f657AEEefc298b3B5c35a470e4739d69","role":".proposer"}
      receivedPermissions.0.role:
+        ".PROPOSER"
    }
```

```diff
    contract RedstoneMultisig (0x70FdbCb066eD3621647Ddf61A1f40aaC6058Bc89) {
    +++ description: None
      receivedPermissions.8.role:
+        "admin"
      receivedPermissions.7.role:
+        "admin"
      receivedPermissions.6.role:
+        "admin"
      receivedPermissions.5.role:
+        "admin"
      receivedPermissions.4.from:
-        "0xc473ca7E02af24c129c2eEf51F2aDf0411c1Df69"
+        "0x8f2428F7189c0d92D1c4a5358903A8c80Ec6a69D"
      receivedPermissions.4.description:
-        "upgrading the bridge implementation can give access to all funds escrowed therein."
      receivedPermissions.4.role:
+        "admin"
      receivedPermissions.3.from:
-        "0x8f2428F7189c0d92D1c4a5358903A8c80Ec6a69D"
+        "0xC7bCb0e8839a28A1cFadd1CF716de9016CdA51ae"
      receivedPermissions.3.role:
+        "admin"
      receivedPermissions.2.from:
-        "0xC7bCb0e8839a28A1cFadd1CF716de9016CdA51ae"
+        "0xa426A052f657AEEefc298b3B5c35a470e4739d69"
      receivedPermissions.2.role:
+        "admin"
      receivedPermissions.1.from:
-        "0xa426A052f657AEEefc298b3B5c35a470e4739d69"
+        "0xc473ca7E02af24c129c2eEf51F2aDf0411c1Df69"
      receivedPermissions.1.description:
+        "upgrading the bridge implementation can give access to all funds escrowed therein."
      receivedPermissions.1.role:
+        ".$admin"
      receivedPermissions.0.role:
+        ".owner"
      directlyReceivedPermissions.0.role:
+        ".owner"
    }
```

```diff
    EOA  (0xA31cb9Bc414601171D4537580f98F66C03aECd43) {
    +++ description: None
      receivedPermissions.0.role:
+        ".batcherHash"
    }
```

```diff
    EOA  (0xb356B146F1629c49C44344464F69BCDAfb4bb664) {
    +++ description: None
      receivedPermissions.6:
+        {"permission":"guard","from":"0xC7bCb0e8839a28A1cFadd1CF716de9016CdA51ae","role":".GUARDIAN"}
      receivedPermissions.5:
+        {"permission":"guard","from":"0x4b5b41c240173191425F5928bc6bdd0d439331BB","role":".guardian"}
      receivedPermissions.4.permission:
-        "guard"
+        "interact"
      receivedPermissions.4.from:
-        "0x4b5b41c240173191425F5928bc6bdd0d439331BB"
+        "0x97A2dA87d3439b172e6DD027220e01c9Cb565B80"
      receivedPermissions.4.description:
+        "can upgrade the parameters of DA challenges like the bond size or refund percentages, potentially making challenges infeasable or insecure."
      receivedPermissions.4.role:
+        ".owner"
      receivedPermissions.3.permission:
-        "interact"
+        "guard"
      receivedPermissions.3.from:
-        "0x97A2dA87d3439b172e6DD027220e01c9Cb565B80"
+        "0xC7bCb0e8839a28A1cFadd1CF716de9016CdA51ae"
      receivedPermissions.3.description:
-        "can upgrade the parameters of DA challenges like the bond size or refund percentages, potentially making challenges infeasable or insecure."
      receivedPermissions.3.role:
+        ".guardian"
      receivedPermissions.2.permission:
-        "guard"
+        "challenge"
      receivedPermissions.2.from:
-        "0xC7bCb0e8839a28A1cFadd1CF716de9016CdA51ae"
+        "0xa426A052f657AEEefc298b3B5c35a470e4739d69"
      receivedPermissions.2.role:
+        ".CHALLENGER"
      receivedPermissions.1.permission:
-        "interact"
+        "challenge"
      receivedPermissions.1.from:
-        "0x8f2428F7189c0d92D1c4a5358903A8c80Ec6a69D"
+        "0xa426A052f657AEEefc298b3B5c35a470e4739d69"
      receivedPermissions.1.description:
-        "it can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system."
      receivedPermissions.1.role:
+        ".challenger"
      receivedPermissions.0.permission:
-        "challenge"
+        "interact"
      receivedPermissions.0.from:
-        "0xa426A052f657AEEefc298b3B5c35a470e4739d69"
+        "0x8f2428F7189c0d92D1c4a5358903A8c80Ec6a69D"
      receivedPermissions.0.description:
+        "it can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system."
      receivedPermissions.0.role:
+        ".owner"
    }
```

```diff
    contract ProxyAdmin (0xCC53b447aFe07926423aB96D5496b1af30485ED2) {
    +++ description: None
      directlyReceivedPermissions.8.role:
+        "admin"
      directlyReceivedPermissions.7.role:
+        "admin"
      directlyReceivedPermissions.6.role:
+        "admin"
      directlyReceivedPermissions.5.role:
+        "admin"
      directlyReceivedPermissions.4.from:
-        "0xc473ca7E02af24c129c2eEf51F2aDf0411c1Df69"
+        "0x8f2428F7189c0d92D1c4a5358903A8c80Ec6a69D"
      directlyReceivedPermissions.4.description:
-        "upgrading the bridge implementation can give access to all funds escrowed therein."
      directlyReceivedPermissions.4.role:
+        "admin"
      directlyReceivedPermissions.3.from:
-        "0x8f2428F7189c0d92D1c4a5358903A8c80Ec6a69D"
+        "0xC7bCb0e8839a28A1cFadd1CF716de9016CdA51ae"
      directlyReceivedPermissions.3.role:
+        "admin"
      directlyReceivedPermissions.2.from:
-        "0xC7bCb0e8839a28A1cFadd1CF716de9016CdA51ae"
+        "0xa426A052f657AEEefc298b3B5c35a470e4739d69"
      directlyReceivedPermissions.2.role:
+        "admin"
      directlyReceivedPermissions.1.from:
-        "0xa426A052f657AEEefc298b3B5c35a470e4739d69"
+        "0xc473ca7E02af24c129c2eEf51F2aDf0411c1Df69"
      directlyReceivedPermissions.1.description:
+        "upgrading the bridge implementation can give access to all funds escrowed therein."
      directlyReceivedPermissions.1.role:
+        ".$admin"
      directlyReceivedPermissions.0.role:
+        ".owner"
    }
```

Generated with discovered.json: 0xc1dc712ef9cbae85dc25395c5d975f32922c7199

# Diff at Tue, 29 Apr 2025 08:19:10 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@ef7477af00fe0b57a2f7cacf7e958c12494af662 block: 22208357
- current block number: 22208357

## Description

Field .issuedPermissions is removed from the output as no longer needed. Added 'permissionsConfigHash' due to refactoring of the modelling process (into a separate command).

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22208357 (main branch discovery), not current.

```diff
    contract SuperchainConfig (0x4b5b41c240173191425F5928bc6bdd0d439331BB) {
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      issuedPermissions:
-        [{"permission":"guard","to":"0xb356B146F1629c49C44344464F69BCDAfb4bb664","via":[]},{"permission":"upgrade","to":"0x70FdbCb066eD3621647Ddf61A1f40aaC6058Bc89","via":[{"address":"0xCC53b447aFe07926423aB96D5496b1af30485ED2"}]}]
    }
```

```diff
    contract L1ERC721Bridge (0x4FFB98dBC3086bA85d5E626a6EbC3D0d08533fF4) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x70FdbCb066eD3621647Ddf61A1f40aaC6058Bc89","via":[{"address":"0xCC53b447aFe07926423aB96D5496b1af30485ED2"}]}]
    }
```

```diff
    contract OptimismMintableERC20Factory (0x5f962474834Cf1981Df6232e4b6431d3d10cb71D) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x70FdbCb066eD3621647Ddf61A1f40aaC6058Bc89","via":[{"address":"0xCC53b447aFe07926423aB96D5496b1af30485ED2"}]}]
    }
```

```diff
    contract SystemConfig (0x8f2428F7189c0d92D1c4a5358903A8c80Ec6a69D) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      issuedPermissions:
-        [{"permission":"interact","to":"0xb356B146F1629c49C44344464F69BCDAfb4bb664","description":"it can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system.","via":[]},{"permission":"sequence","to":"0xA31cb9Bc414601171D4537580f98F66C03aECd43","via":[]},{"permission":"upgrade","to":"0x70FdbCb066eD3621647Ddf61A1f40aaC6058Bc89","via":[{"address":"0xCC53b447aFe07926423aB96D5496b1af30485ED2"}]}]
    }
```

```diff
    contract DataAvailabilityChallenge (0x97A2dA87d3439b172e6DD027220e01c9Cb565B80) {
    +++ description: The DataAvailabilityChallenge contract is used to challenge the full availability of data behind commimted transaction data hashes. See the technology section for more details.
      issuedPermissions:
-        [{"permission":"interact","to":"0xb356B146F1629c49C44344464F69BCDAfb4bb664","description":"can upgrade the parameters of DA challenges like the bond size or refund percentages, potentially making challenges infeasable or insecure.","via":[]},{"permission":"upgrade","to":"0x70FdbCb066eD3621647Ddf61A1f40aaC6058Bc89","via":[{"address":"0xCC53b447aFe07926423aB96D5496b1af30485ED2"}]}]
    }
```

```diff
    contract L2OutputOracle (0xa426A052f657AEEefc298b3B5c35a470e4739d69) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      issuedPermissions:
-        [{"permission":"challenge","to":"0xb356B146F1629c49C44344464F69BCDAfb4bb664","via":[]},{"permission":"propose","to":"0x4c465E58946145bb2BFC38833154f5A3B5728CF7","via":[]},{"permission":"upgrade","to":"0x70FdbCb066eD3621647Ddf61A1f40aaC6058Bc89","via":[{"address":"0xCC53b447aFe07926423aB96D5496b1af30485ED2"}]}]
    }
```

```diff
    contract L1StandardBridge (0xc473ca7E02af24c129c2eEf51F2aDf0411c1Df69) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x70FdbCb066eD3621647Ddf61A1f40aaC6058Bc89","description":"upgrading the bridge implementation can give access to all funds escrowed therein.","via":[{"address":"0xCC53b447aFe07926423aB96D5496b1af30485ED2"}]}]
    }
```

```diff
    contract OptimismPortal (0xC7bCb0e8839a28A1cFadd1CF716de9016CdA51ae) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      issuedPermissions:
-        [{"permission":"guard","to":"0xb356B146F1629c49C44344464F69BCDAfb4bb664","via":[]},{"permission":"upgrade","to":"0x70FdbCb066eD3621647Ddf61A1f40aaC6058Bc89","via":[{"address":"0xCC53b447aFe07926423aB96D5496b1af30485ED2"}]}]
    }
```

```diff
    contract AddressManager (0xFe27f187A9E46104a932189dDF229871E06B22F8) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      issuedPermissions:
-        [{"permission":"interact","to":"0x70FdbCb066eD3621647Ddf61A1f40aaC6058Bc89","description":"set and change address mappings.","via":[{"address":"0xCC53b447aFe07926423aB96D5496b1af30485ED2"}]}]
    }
```

Generated with discovered.json: 0x48aa24cb6cc2d6c0f5670178394c5afb3e5a7f9b

# Diff at Thu, 27 Mar 2025 11:14:58 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@8cc2e36080df3a74dfd8475d41c64f46203f5218 block: 21235431
- current block number: 21235431

## Description

Config related: add guardian description details, hide some noisy values, hide AddressManager as spam cat, add proposer / challenger to permissioned opfp chains.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21235431 (main branch discovery), not current.

```diff
    contract AddressManager (0xFe27f187A9E46104a932189dDF229871E06B22F8) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      category:
+        {"name":"Spam","priority":-1}
    }
```

Generated with discovered.json: 0x5fff40e0cdb0d5e92c8ac18758d7a202296e3fcf

# Diff at Wed, 19 Mar 2025 13:05:19 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@e950b6e93c84855ee2ec1740913b7b4c994b9ae2 block: 21235431
- current block number: 21235431

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21235431 (main branch discovery), not current.

```diff
    contract undefined (0x4c465E58946145bb2BFC38833154f5A3B5728CF7) {
    +++ description: None
      severity:
-        "HIGH"
    }
```

```diff
    contract undefined (0xb356B146F1629c49C44344464F69BCDAfb4bb664) {
    +++ description: None
      severity:
-        "HIGH"
    }
```

Generated with discovered.json: 0xbbc694e8e5506e52ef380837945e5e6fb7da73ba

# Diff at Tue, 04 Mar 2025 11:26:13 GMT:

- author: Michał Podsiadły (<michal.podsiadly@l2beat.com>)
- comparing to: main@be38e12d3ff947ca8de40f3a23a9ba1875a54f5a block: 21235431
- current block number: 21235431

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21235431 (main branch discovery), not current.

```diff
    contract SystemConfig (0x8f2428F7189c0d92D1c4a5358903A8c80Ec6a69D) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      values.opStackDA.isSomeTxsLengthEqualToCelestiaDAExample:
-        false
      values.opStackDA.isUsingCelestia:
+        false
    }
```

Generated with discovered.json: 0xaf17c73463d7201b509ae8a1b91c5d351815f047

# Diff at Tue, 04 Mar 2025 10:39:41 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@98d260b45fe0d2195ce5e629bd7b200c8706e8ba block: 21235431
- current block number: 21235431

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21235431 (main branch discovery), not current.

```diff
    contract SuperchainConfig (0x4b5b41c240173191425F5928bc6bdd0d439331BB) {
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      sinceBlock:
+        19578320
    }
```

```diff
    contract L1ERC721Bridge (0x4FFB98dBC3086bA85d5E626a6EbC3D0d08533fF4) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      sinceBlock:
+        19578335
    }
```

```diff
    contract L1CrossDomainMessenger (0x592C1299e0F8331D81A28C0FC7352Da24eDB444a) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      sinceBlock:
+        19578332
    }
```

```diff
    contract OptimismMintableERC20Factory (0x5f962474834Cf1981Df6232e4b6431d3d10cb71D) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      sinceBlock:
+        19578333
    }
```

```diff
    contract RedstoneMultisig (0x70FdbCb066eD3621647Ddf61A1f40aaC6058Bc89) {
    +++ description: None
      sinceBlock:
+        19578315
    }
```

```diff
    contract SystemConfig (0x8f2428F7189c0d92D1c4a5358903A8c80Ec6a69D) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      sinceBlock:
+        19578330
    }
```

```diff
    contract DataAvailabilityChallenge (0x97A2dA87d3439b172e6DD027220e01c9Cb565B80) {
    +++ description: The DataAvailabilityChallenge contract is used to challenge the full availability of data behind commimted transaction data hashes. See the technology section for more details.
      sinceBlock:
+        19578326
    }
```

```diff
    contract L2OutputOracle (0xa426A052f657AEEefc298b3B5c35a470e4739d69) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      sinceBlock:
+        19578337
    }
```

```diff
    contract L1StandardBridge (0xc473ca7E02af24c129c2eEf51F2aDf0411c1Df69) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      sinceBlock:
+        19578331
    }
```

```diff
    contract OptimismPortal (0xC7bCb0e8839a28A1cFadd1CF716de9016CdA51ae) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      sinceBlock:
+        19578329
    }
```

```diff
    contract ProxyAdmin (0xCC53b447aFe07926423aB96D5496b1af30485ED2) {
    +++ description: None
      sinceBlock:
+        19578317
    }
```

```diff
    contract AddressManager (0xFe27f187A9E46104a932189dDF229871E06B22F8) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      sinceBlock:
+        19578316
    }
```

Generated with discovered.json: 0xea59fad5ddb034eb3fd8d3f7dc7023db5ec0f54c

# Diff at Wed, 26 Feb 2025 10:32:59 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@18513668f913fbe57a197f43655b19111df0e627 block: 21235431
- current block number: 21235431

## Description

config related: added categories for all opstack, op stack and polygoncdk stack templates.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21235431 (main branch discovery), not current.

```diff
    contract SuperchainConfig (0x4b5b41c240173191425F5928bc6bdd0d439331BB) {
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      category:
+        {"name":"Governance","priority":3}
    }
```

```diff
    contract L1ERC721Bridge (0x4FFB98dBC3086bA85d5E626a6EbC3D0d08533fF4) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      category:
+        {"name":"Canonical Bridges","priority":2}
    }
```

```diff
    contract L1CrossDomainMessenger (0x592C1299e0F8331D81A28C0FC7352Da24eDB444a) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      category:
+        {"name":"Canonical Bridges","priority":2}
    }
```

```diff
    contract SystemConfig (0x8f2428F7189c0d92D1c4a5358903A8c80Ec6a69D) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract DataAvailabilityChallenge (0x97A2dA87d3439b172e6DD027220e01c9Cb565B80) {
    +++ description: The DataAvailabilityChallenge contract is used to challenge the full availability of data behind commimted transaction data hashes. See the technology section for more details.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract L2OutputOracle (0xa426A052f657AEEefc298b3B5c35a470e4739d69) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract L1StandardBridge (0xc473ca7E02af24c129c2eEf51F2aDf0411c1Df69) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      category:
+        {"name":"Canonical Bridges","priority":2}
    }
```

```diff
    contract OptimismPortal (0xC7bCb0e8839a28A1cFadd1CF716de9016CdA51ae) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

Generated with discovered.json: 0xd7657d54ce6d797e43550f92d71f7c06c68e46e0

# Diff at Fri, 21 Feb 2025 14:10:44 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@d219f271711b2cf7a164e3443bead5e4957d13a8 block: 21235431
- current block number: 21235431

## Description

Config related: Change some severities and add templates.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21235431 (main branch discovery), not current.

```diff
    contract L2OutputOracle (0xa426A052f657AEEefc298b3B5c35a470e4739d69) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      fieldMeta.proposer:
+        {"severity":"HIGH"}
      fieldMeta.challenger:
+        {"severity":"HIGH"}
      fieldMeta.deletedOutputs:
+        {"severity":"HIGH"}
    }
```

Generated with discovered.json: 0x57c77b1634629a41361a692f82f5fc7da911d18e

# Diff at Fri, 21 Feb 2025 08:59:59 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1cf9ec35847912163c4b663a633e258a434c0bca block: 21235431
- current block number: 21235431

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21235431 (main branch discovery), not current.

```diff
    contract SuperchainConfig (0x4b5b41c240173191425F5928bc6bdd0d439331BB) {
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      categories:
-        ["Upgrades&Governance"]
    }
```

```diff
    contract L1CrossDomainMessenger (0x592C1299e0F8331D81A28C0FC7352Da24eDB444a) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      categories:
-        ["Core"]
    }
```

```diff
    contract L1StandardBridge (0xc473ca7E02af24c129c2eEf51F2aDf0411c1Df69) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      categories:
-        ["Gateways&Escrows"]
    }
```

Generated with discovered.json: 0x2fef294bf16365b3f704c5a34ad4146968a4b43a

# Diff at Mon, 10 Feb 2025 19:04:30 GMT:

- author: Michał Podsiadły (<michal.podsiadly@l2beat.com>)
- comparing to: main@3756adff7c1ac86d8af3374a90a75c1999aae2b3 block: 21235431
- current block number: 21235431

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21235431 (main branch discovery), not current.

```diff
    contract SystemConfig (0x8f2428F7189c0d92D1c4a5358903A8c80Ec6a69D) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      values.opStackDA.isUsingEigenDA:
+        false
    }
```

Generated with discovered.json: 0x160c98d907ceb1ffd1e5598d7a0a78a8f504c08a

# Diff at Tue, 04 Feb 2025 12:31:56 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@145553eed7ba44636411ecb25e4099728acd02f9 block: 21235431
- current block number: 21235431

## Description

Rename 'configure' permission to 'interact'

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21235431 (main branch discovery), not current.

```diff
    contract RedstoneMultisig (0x70FdbCb066eD3621647Ddf61A1f40aaC6058Bc89) {
    +++ description: None
      receivedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract SystemConfig (0x8f2428F7189c0d92D1c4a5358903A8c80Ec6a69D) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      issuedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract DataAvailabilityChallenge (0x97A2dA87d3439b172e6DD027220e01c9Cb565B80) {
    +++ description: The DataAvailabilityChallenge contract is used to challenge the full availability of data behind commimted transaction data hashes. See the technology section for more details.
      issuedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract ProxyAdmin (0xCC53b447aFe07926423aB96D5496b1af30485ED2) {
    +++ description: None
      directlyReceivedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract AddressManager (0xFe27f187A9E46104a932189dDF229871E06B22F8) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      issuedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

Generated with discovered.json: 0x8c18621e73e524cfa6e824346b3450d74e6197fb

# Diff at Mon, 20 Jan 2025 11:09:58 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@2c8b4f3d9910bb6371be9b4df87b70856e7d8c64 block: 21235431
- current block number: 21235431

## Description

Rerun on the same block number. Applies fixes to permissions and via field. Renames permission's target to to/from.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21235431 (main branch discovery), not current.

```diff
    contract SuperchainConfig (0x4b5b41c240173191425F5928bc6bdd0d439331BB) {
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      issuedPermissions.1.target:
-        "0x70FdbCb066eD3621647Ddf61A1f40aaC6058Bc89"
      issuedPermissions.1.via.0.delay:
-        0
      issuedPermissions.1.to:
+        "0x70FdbCb066eD3621647Ddf61A1f40aaC6058Bc89"
      issuedPermissions.0.target:
-        "0xb356B146F1629c49C44344464F69BCDAfb4bb664"
      issuedPermissions.0.to:
+        "0xb356B146F1629c49C44344464F69BCDAfb4bb664"
    }
```

```diff
    contract L1ERC721Bridge (0x4FFB98dBC3086bA85d5E626a6EbC3D0d08533fF4) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      issuedPermissions.0.target:
-        "0x70FdbCb066eD3621647Ddf61A1f40aaC6058Bc89"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x70FdbCb066eD3621647Ddf61A1f40aaC6058Bc89"
    }
```

```diff
    contract OptimismMintableERC20Factory (0x5f962474834Cf1981Df6232e4b6431d3d10cb71D) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      issuedPermissions.0.target:
-        "0x70FdbCb066eD3621647Ddf61A1f40aaC6058Bc89"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x70FdbCb066eD3621647Ddf61A1f40aaC6058Bc89"
    }
```

```diff
    contract RedstoneMultisig (0x70FdbCb066eD3621647Ddf61A1f40aaC6058Bc89) {
    +++ description: None
      receivedPermissions.8.target:
-        "0xC7bCb0e8839a28A1cFadd1CF716de9016CdA51ae"
      receivedPermissions.8.from:
+        "0xC7bCb0e8839a28A1cFadd1CF716de9016CdA51ae"
      receivedPermissions.7.target:
-        "0xc473ca7E02af24c129c2eEf51F2aDf0411c1Df69"
      receivedPermissions.7.from:
+        "0xc473ca7E02af24c129c2eEf51F2aDf0411c1Df69"
      receivedPermissions.6.target:
-        "0xa426A052f657AEEefc298b3B5c35a470e4739d69"
      receivedPermissions.6.from:
+        "0xa426A052f657AEEefc298b3B5c35a470e4739d69"
      receivedPermissions.5.target:
-        "0x97A2dA87d3439b172e6DD027220e01c9Cb565B80"
      receivedPermissions.5.from:
+        "0x97A2dA87d3439b172e6DD027220e01c9Cb565B80"
      receivedPermissions.4.target:
-        "0x8f2428F7189c0d92D1c4a5358903A8c80Ec6a69D"
      receivedPermissions.4.from:
+        "0x8f2428F7189c0d92D1c4a5358903A8c80Ec6a69D"
      receivedPermissions.3.target:
-        "0x5f962474834Cf1981Df6232e4b6431d3d10cb71D"
      receivedPermissions.3.from:
+        "0x5f962474834Cf1981Df6232e4b6431d3d10cb71D"
      receivedPermissions.2.target:
-        "0x4FFB98dBC3086bA85d5E626a6EbC3D0d08533fF4"
      receivedPermissions.2.from:
+        "0x4FFB98dBC3086bA85d5E626a6EbC3D0d08533fF4"
      receivedPermissions.1.target:
-        "0x4b5b41c240173191425F5928bc6bdd0d439331BB"
      receivedPermissions.1.from:
+        "0x4b5b41c240173191425F5928bc6bdd0d439331BB"
      receivedPermissions.0.target:
-        "0xFe27f187A9E46104a932189dDF229871E06B22F8"
      receivedPermissions.0.from:
+        "0xFe27f187A9E46104a932189dDF229871E06B22F8"
      directlyReceivedPermissions.0.target:
-        "0xCC53b447aFe07926423aB96D5496b1af30485ED2"
      directlyReceivedPermissions.0.from:
+        "0xCC53b447aFe07926423aB96D5496b1af30485ED2"
    }
```

```diff
    contract SystemConfig (0x8f2428F7189c0d92D1c4a5358903A8c80Ec6a69D) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      issuedPermissions.2.target:
-        "0x70FdbCb066eD3621647Ddf61A1f40aaC6058Bc89"
      issuedPermissions.2.via.0.delay:
-        0
      issuedPermissions.2.to:
+        "0x70FdbCb066eD3621647Ddf61A1f40aaC6058Bc89"
      issuedPermissions.1.target:
-        "0xA31cb9Bc414601171D4537580f98F66C03aECd43"
      issuedPermissions.1.to:
+        "0xA31cb9Bc414601171D4537580f98F66C03aECd43"
      issuedPermissions.0.target:
-        "0xb356B146F1629c49C44344464F69BCDAfb4bb664"
      issuedPermissions.0.to:
+        "0xb356B146F1629c49C44344464F69BCDAfb4bb664"
      issuedPermissions.0.description:
+        "it can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system."
    }
```

```diff
    contract DataAvailabilityChallenge (0x97A2dA87d3439b172e6DD027220e01c9Cb565B80) {
    +++ description: The DataAvailabilityChallenge contract is used to challenge the full availability of data behind commimted transaction data hashes. See the technology section for more details.
      issuedPermissions.1.target:
-        "0x70FdbCb066eD3621647Ddf61A1f40aaC6058Bc89"
      issuedPermissions.1.via.0.delay:
-        0
      issuedPermissions.1.to:
+        "0x70FdbCb066eD3621647Ddf61A1f40aaC6058Bc89"
      issuedPermissions.0.target:
-        "0xb356B146F1629c49C44344464F69BCDAfb4bb664"
      issuedPermissions.0.to:
+        "0xb356B146F1629c49C44344464F69BCDAfb4bb664"
      issuedPermissions.0.description:
+        "can upgrade the parameters of DA challenges like the bond size or refund percentages, potentially making challenges infeasable or insecure."
    }
```

```diff
    contract L2OutputOracle (0xa426A052f657AEEefc298b3B5c35a470e4739d69) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      issuedPermissions.2.target:
-        "0x70FdbCb066eD3621647Ddf61A1f40aaC6058Bc89"
      issuedPermissions.2.via.0.delay:
-        0
      issuedPermissions.2.to:
+        "0x70FdbCb066eD3621647Ddf61A1f40aaC6058Bc89"
      issuedPermissions.1.target:
-        "0x4c465E58946145bb2BFC38833154f5A3B5728CF7"
      issuedPermissions.1.to:
+        "0x4c465E58946145bb2BFC38833154f5A3B5728CF7"
      issuedPermissions.0.target:
-        "0xb356B146F1629c49C44344464F69BCDAfb4bb664"
      issuedPermissions.0.to:
+        "0xb356B146F1629c49C44344464F69BCDAfb4bb664"
    }
```

```diff
    contract L1StandardBridge (0xc473ca7E02af24c129c2eEf51F2aDf0411c1Df69) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      issuedPermissions.0.target:
-        "0x70FdbCb066eD3621647Ddf61A1f40aaC6058Bc89"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.via.0.description:
-        "upgrading the bridge implementation can give access to all funds escrowed therein."
      issuedPermissions.0.to:
+        "0x70FdbCb066eD3621647Ddf61A1f40aaC6058Bc89"
      issuedPermissions.0.description:
+        "upgrading the bridge implementation can give access to all funds escrowed therein."
    }
```

```diff
    contract OptimismPortal (0xC7bCb0e8839a28A1cFadd1CF716de9016CdA51ae) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      issuedPermissions.1.target:
-        "0x70FdbCb066eD3621647Ddf61A1f40aaC6058Bc89"
      issuedPermissions.1.via.0.delay:
-        0
      issuedPermissions.1.to:
+        "0x70FdbCb066eD3621647Ddf61A1f40aaC6058Bc89"
      issuedPermissions.0.target:
-        "0xb356B146F1629c49C44344464F69BCDAfb4bb664"
      issuedPermissions.0.to:
+        "0xb356B146F1629c49C44344464F69BCDAfb4bb664"
    }
```

```diff
    contract ProxyAdmin (0xCC53b447aFe07926423aB96D5496b1af30485ED2) {
    +++ description: None
      directlyReceivedPermissions.8.target:
-        "0xC7bCb0e8839a28A1cFadd1CF716de9016CdA51ae"
      directlyReceivedPermissions.8.from:
+        "0xC7bCb0e8839a28A1cFadd1CF716de9016CdA51ae"
      directlyReceivedPermissions.7.target:
-        "0xc473ca7E02af24c129c2eEf51F2aDf0411c1Df69"
      directlyReceivedPermissions.7.from:
+        "0xc473ca7E02af24c129c2eEf51F2aDf0411c1Df69"
      directlyReceivedPermissions.6.target:
-        "0xa426A052f657AEEefc298b3B5c35a470e4739d69"
      directlyReceivedPermissions.6.from:
+        "0xa426A052f657AEEefc298b3B5c35a470e4739d69"
      directlyReceivedPermissions.5.target:
-        "0x97A2dA87d3439b172e6DD027220e01c9Cb565B80"
      directlyReceivedPermissions.5.from:
+        "0x97A2dA87d3439b172e6DD027220e01c9Cb565B80"
      directlyReceivedPermissions.4.target:
-        "0x8f2428F7189c0d92D1c4a5358903A8c80Ec6a69D"
      directlyReceivedPermissions.4.from:
+        "0x8f2428F7189c0d92D1c4a5358903A8c80Ec6a69D"
      directlyReceivedPermissions.3.target:
-        "0x5f962474834Cf1981Df6232e4b6431d3d10cb71D"
      directlyReceivedPermissions.3.from:
+        "0x5f962474834Cf1981Df6232e4b6431d3d10cb71D"
      directlyReceivedPermissions.2.target:
-        "0x4FFB98dBC3086bA85d5E626a6EbC3D0d08533fF4"
      directlyReceivedPermissions.2.from:
+        "0x4FFB98dBC3086bA85d5E626a6EbC3D0d08533fF4"
      directlyReceivedPermissions.1.target:
-        "0x4b5b41c240173191425F5928bc6bdd0d439331BB"
      directlyReceivedPermissions.1.from:
+        "0x4b5b41c240173191425F5928bc6bdd0d439331BB"
      directlyReceivedPermissions.0.target:
-        "0xFe27f187A9E46104a932189dDF229871E06B22F8"
      directlyReceivedPermissions.0.from:
+        "0xFe27f187A9E46104a932189dDF229871E06B22F8"
    }
```

```diff
    contract AddressManager (0xFe27f187A9E46104a932189dDF229871E06B22F8) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      issuedPermissions.0.target:
-        "0x70FdbCb066eD3621647Ddf61A1f40aaC6058Bc89"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.via.0.description:
-        "set and change address mappings."
      issuedPermissions.0.to:
+        "0x70FdbCb066eD3621647Ddf61A1f40aaC6058Bc89"
      issuedPermissions.0.description:
+        "set and change address mappings."
    }
```

Generated with discovered.json: 0x811aa9e2be53b2bee01e28997bcc9a2d00d32cac

# Diff at Wed, 08 Jan 2025 09:05:52 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@deefa974378c2cd6b74f061e1f5a494bbbe1d63a block: 21235431
- current block number: 21235431

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21235431 (main branch discovery), not current.

```diff
    contract L1StandardBridge (0xc473ca7E02af24c129c2eEf51F2aDf0411c1Df69) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      description:
-        "The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token."
+        "The main entry point to deposit ERC20 tokens from host chain to this chain."
    }
```

Generated with discovered.json: 0xb97c0c588c077c234d1d92b8daa72b8d235e35e9

# Diff at Thu, 21 Nov 2024 10:13:06 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@de1745323b367dd0fbb18ad6c862147dd90e90b0 block: 19831040
- current block number: 21235431

## Description

Move to discodriven data.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19831040 (main branch discovery), not current.

```diff
-   Status: DELETED
    contract FaultDisputeGame (0x5A50b05676705cd0189970d806a7c9d2a0201Da7)
    +++ description: None
```

```diff
-   Status: DELETED
    contract MIPS (0x66D6be83984e3F026B4a9e2D8Fb082ecDBd43648)
    +++ description: None
```

```diff
    contract RedstoneMultisig (0x70FdbCb066eD3621647Ddf61A1f40aaC6058Bc89) {
    +++ description: None
      name:
-        "ProxyAdminOwner"
+        "RedstoneMultisig"
      receivedPermissions.10:
-        {"permission":"upgrade","target":"0xC7bCb0e8839a28A1cFadd1CF716de9016CdA51ae","via":[{"address":"0xCC53b447aFe07926423aB96D5496b1af30485ED2"}]}
      receivedPermissions.9:
-        {"permission":"upgrade","target":"0xc473ca7E02af24c129c2eEf51F2aDf0411c1Df69","description":"upgrading the bridge implementation can give access to all funds escrowed therein.","via":[{"address":"0xCC53b447aFe07926423aB96D5496b1af30485ED2"}]}
      receivedPermissions.8.target:
-        "0xa426A052f657AEEefc298b3B5c35a470e4739d69"
+        "0xC7bCb0e8839a28A1cFadd1CF716de9016CdA51ae"
      receivedPermissions.7.target:
-        "0xa130523fD22e2a9D78F8aB232b01ff552845B4A9"
+        "0xc473ca7E02af24c129c2eEf51F2aDf0411c1Df69"
      receivedPermissions.7.description:
+        "upgrading the bridge implementation can give access to all funds escrowed therein."
      receivedPermissions.6.target:
-        "0x97A2dA87d3439b172e6DD027220e01c9Cb565B80"
+        "0xa426A052f657AEEefc298b3B5c35a470e4739d69"
      receivedPermissions.5.target:
-        "0x8f68E849eaf8EB943536F9d1D49Ea9C9b5868b98"
+        "0x97A2dA87d3439b172e6DD027220e01c9Cb565B80"
    }
```

```diff
-   Status: DELETED
    contract DisputeGameFactory (0x8f68E849eaf8EB943536F9d1D49Ea9C9b5868b98)
    +++ description: None
```

```diff
    contract DataAvailabilityChallenge (0x97A2dA87d3439b172e6DD027220e01c9Cb565B80) {
    +++ description: The DataAvailabilityChallenge contract is used to challenge the full availability of data behind commimted transaction data hashes. See the technology section for more details.
      issuedPermissions.1:
+        {"permission":"upgrade","target":"0x70FdbCb066eD3621647Ddf61A1f40aaC6058Bc89","via":[{"address":"0xCC53b447aFe07926423aB96D5496b1af30485ED2","delay":0}]}
      issuedPermissions.0.permission:
-        "upgrade"
+        "configure"
      issuedPermissions.0.target:
-        "0x70FdbCb066eD3621647Ddf61A1f40aaC6058Bc89"
+        "0xb356B146F1629c49C44344464F69BCDAfb4bb664"
      issuedPermissions.0.via.0:
-        {"address":"0xCC53b447aFe07926423aB96D5496b1af30485ED2","delay":0}
      template:
+        "opstack/DataAvailabilityChallenge"
      description:
+        "The DataAvailabilityChallenge contract is used to challenge the full availability of data behind commimted transaction data hashes. See the technology section for more details."
    }
```

```diff
-   Status: DELETED
    contract DelayedWETH (0xa130523fD22e2a9D78F8aB232b01ff552845B4A9)
    +++ description: None
```

```diff
-   Status: DELETED
    contract PermissionedDisputeGame (0xC5E3333f1Dd5e5bBca0Cf49B8799E0Eb567000ba)
    +++ description: None
```

```diff
    contract ProxyAdmin (0xCC53b447aFe07926423aB96D5496b1af30485ED2) {
    +++ description: None
      directlyReceivedPermissions.10:
-        {"permission":"upgrade","target":"0xC7bCb0e8839a28A1cFadd1CF716de9016CdA51ae"}
      directlyReceivedPermissions.9:
-        {"permission":"upgrade","target":"0xc473ca7E02af24c129c2eEf51F2aDf0411c1Df69","description":"upgrading the bridge implementation can give access to all funds escrowed therein."}
      directlyReceivedPermissions.8.target:
-        "0xa426A052f657AEEefc298b3B5c35a470e4739d69"
+        "0xC7bCb0e8839a28A1cFadd1CF716de9016CdA51ae"
      directlyReceivedPermissions.7.target:
-        "0xa130523fD22e2a9D78F8aB232b01ff552845B4A9"
+        "0xc473ca7E02af24c129c2eEf51F2aDf0411c1Df69"
      directlyReceivedPermissions.7.description:
+        "upgrading the bridge implementation can give access to all funds escrowed therein."
      directlyReceivedPermissions.6.target:
-        "0x97A2dA87d3439b172e6DD027220e01c9Cb565B80"
+        "0xa426A052f657AEEefc298b3B5c35a470e4739d69"
      directlyReceivedPermissions.5.target:
-        "0x8f68E849eaf8EB943536F9d1D49Ea9C9b5868b98"
+        "0x97A2dA87d3439b172e6DD027220e01c9Cb565B80"
    }
```

```diff
-   Status: DELETED
    contract PreimageOracle (0xE7d0fE72637B3C949cd81c63A4Ff1fb23feeF3b2)
    +++ description: None
```

Generated with discovered.json: 0x7d991160ad9ad14a7c5265df1310c37cec84d286

# Diff at Fri, 01 Nov 2024 12:23:53 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@cd1f0e71bb08ce16b2084a11b768538e8aa6ba8c block: 19831040
- current block number: 19831040

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19831040 (main branch discovery), not current.

```diff
    contract SuperchainConfig (0x4b5b41c240173191425F5928bc6bdd0d439331BB) {
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      description:
-        "This is NOT the shared SuperchainConfig of the OP stack Superchain. This SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system."
+        "This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system."
    }
```

```diff
    contract ProxyAdminOwner (0x70FdbCb066eD3621647Ddf61A1f40aaC6058Bc89) {
    +++ description: None
      receivedPermissions.9.description:
-        "upgrading bridge implementation allows to access all funds and change every system component."
+        "upgrading the bridge implementation can give access to all funds escrowed therein."
    }
```

```diff
    contract L1StandardBridge (0xc473ca7E02af24c129c2eEf51F2aDf0411c1Df69) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token.
      issuedPermissions.0.via.0.description:
-        "upgrading bridge implementation allows to access all funds and change every system component."
+        "upgrading the bridge implementation can give access to all funds escrowed therein."
    }
```

```diff
    contract ProxyAdmin (0xCC53b447aFe07926423aB96D5496b1af30485ED2) {
    +++ description: None
      directlyReceivedPermissions.9.description:
-        "upgrading bridge implementation allows to access all funds and change every system component."
+        "upgrading the bridge implementation can give access to all funds escrowed therein."
    }
```

Generated with discovered.json: 0xf2d32f0a807af241619eaa8e04fe7795c093fb5c

# Diff at Tue, 29 Oct 2024 13:17:06 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@7b3fc9dc9074e1d423b48522c3f0273c86aab54a block: 19831040
- current block number: 19831040

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19831040 (main branch discovery), not current.

```diff
    contract L2OutputOracle (0xa426A052f657AEEefc298b3B5c35a470e4739d69) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      fieldMeta:
+        {"FINALIZATION_PERIOD_SECONDS":{"description":"Challenge period (Number of seconds until a state root is finalized)."}}
    }
```

Generated with discovered.json: 0x24e649821231f095333e76f505aee74c9b5b7841

# Diff at Tue, 22 Oct 2024 13:50:33 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@c4e420ffba204be049626040a9ea287e023948f8 block: 19831040
- current block number: 19831040

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19831040 (main branch discovery), not current.

```diff
    contract SuperchainConfig (0x4b5b41c240173191425F5928bc6bdd0d439331BB) {
    +++ description: This is NOT the shared SuperchainConfig of the OP stack Superchain. This SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      template:
-        "opstack/SuperchainConfig"
+        "opstack/SuperchainConfigFake"
      description:
-        "Used to manage global configuration values for multiple OP Chains within a single Superchain network. The SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the Superchain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system."
+        "This is NOT the shared SuperchainConfig of the OP stack Superchain. This SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system."
    }
```

Generated with discovered.json: 0xf6592ccaf0b0164c7026bd0c501841d54c603476

# Diff at Mon, 21 Oct 2024 12:47:48 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@e660599f23a07618fe949a07be1f516ce44f1914 block: 19831040
- current block number: 19831040

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19831040 (main branch discovery), not current.

```diff
    contract SuperchainConfig (0x4b5b41c240173191425F5928bc6bdd0d439331BB) {
    +++ description: Used to manage global configuration values for multiple OP Chains within a single Superchain network. The SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the Superchain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      descriptions:
-        ["Used to manage global configuration values for multiple OP Chains within a single Superchain network. The SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the Superchain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system."]
      description:
+        "Used to manage global configuration values for multiple OP Chains within a single Superchain network. The SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the Superchain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system."
    }
```

```diff
    contract L1ERC721Bridge (0x4FFB98dBC3086bA85d5E626a6EbC3D0d08533fF4) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      descriptions:
-        ["Used to bridge ERC-721 tokens from host chain to this chain."]
      description:
+        "Used to bridge ERC-721 tokens from host chain to this chain."
    }
```

```diff
    contract L1CrossDomainMessenger (0x592C1299e0F8331D81A28C0FC7352Da24eDB444a) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      descriptions:
-        ["Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function."]
      description:
+        "Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function."
    }
```

```diff
    contract OptimismMintableERC20Factory (0x5f962474834Cf1981Df6232e4b6431d3d10cb71D) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      descriptions:
-        ["A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa."]
      description:
+        "A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa."
    }
```

```diff
    contract SystemConfig (0x8f2428F7189c0d92D1c4a5358903A8c80Ec6a69D) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      descriptions:
-        ["Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address."]
      description:
+        "Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address."
    }
```

```diff
    contract L2OutputOracle (0xa426A052f657AEEefc298b3B5c35a470e4739d69) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      descriptions:
-        ["Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots."]
      description:
+        "Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots."
    }
```

```diff
    contract L1StandardBridge (0xc473ca7E02af24c129c2eEf51F2aDf0411c1Df69) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token.
      descriptions:
-        ["The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token."]
      description:
+        "The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token."
    }
```

```diff
    contract OptimismPortal (0xC7bCb0e8839a28A1cFadd1CF716de9016CdA51ae) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      descriptions:
-        ["The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals."]
      description:
+        "The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals."
    }
```

```diff
    contract AddressManager (0xFe27f187A9E46104a932189dDF229871E06B22F8) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      descriptions:
-        ["Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts."]
      description:
+        "Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts."
    }
```

Generated with discovered.json: 0x04d4e3d6558da515a7cdd157d7800716754c76dd

# Diff at Mon, 21 Oct 2024 11:09:32 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@8895d33866f5665c4c710f4ddaa32bfa63cc3c78 block: 19831040
- current block number: 19831040

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19831040 (main branch discovery), not current.

```diff
    contract SuperchainConfig (0x4b5b41c240173191425F5928bc6bdd0d439331BB) {
    +++ description: Used to manage global configuration values for multiple OP Chains within a single Superchain network. The SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the Superchain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      values.$pastUpgrades.0.2:
+        ["0x45920c2242a7F2121716431Dd7c2d68740726934"]
      values.$pastUpgrades.0.1:
-        ["0x45920c2242a7F2121716431Dd7c2d68740726934"]
+        "0xd939a10e3833a3a491de738731a0c8bced220433bffc41ebc4c26e3de1e7350d"
    }
```

```diff
    contract L1ERC721Bridge (0x4FFB98dBC3086bA85d5E626a6EbC3D0d08533fF4) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      values.$pastUpgrades.0.2:
+        ["0x91Cb4eb84F7117196B1c117C7705F2eAF55AfA16"]
      values.$pastUpgrades.0.1:
-        ["0x91Cb4eb84F7117196B1c117C7705F2eAF55AfA16"]
+        "0xa5ea670d4c54694d3b6205fb324a0bf6df7f76a23a2de4915ba2b302a8cb1178"
    }
```

```diff
    contract L1CrossDomainMessenger (0x592C1299e0F8331D81A28C0FC7352Da24eDB444a) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      values.$pastUpgrades.0.2:
+        ["0x17AaA27ecEc9a0c530e6Dbd086b6049DCF6D9382"]
      values.$pastUpgrades.0.1:
-        ["0x17AaA27ecEc9a0c530e6Dbd086b6049DCF6D9382"]
+        "0x1596672f469063a73fcb89c6de464d4102a5e1f8e6943d0d7fea90e09e583357"
    }
```

```diff
    contract OptimismMintableERC20Factory (0x5f962474834Cf1981Df6232e4b6431d3d10cb71D) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      values.$pastUpgrades.0.2:
+        ["0x9a3292E64C7b7bf6E04c1ebC7D6671bD82dAbf8B"]
      values.$pastUpgrades.0.1:
-        ["0x9a3292E64C7b7bf6E04c1ebC7D6671bD82dAbf8B"]
+        "0xa50adeccfa5cfbd2975667e646b3481c0860cbeb428555f80379e163cf995860"
    }
```

```diff
    contract SystemConfig (0x8f2428F7189c0d92D1c4a5358903A8c80Ec6a69D) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      values.$pastUpgrades.0.2:
+        ["0xd20eF07Ca38301735782e3B89c0E192fD8Ec002d"]
      values.$pastUpgrades.0.1:
-        ["0xd20eF07Ca38301735782e3B89c0E192fD8Ec002d"]
+        "0x50f32695d91406fffb379d86fc419709302f876eafff6be1bbc031193899bd3e"
    }
```

```diff
    contract DisputeGameFactory (0x8f68E849eaf8EB943536F9d1D49Ea9C9b5868b98) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0x4ed3b4332B2d14CD01a68F4e9d1A24E2e4BDa427"]
      values.$pastUpgrades.0.1:
-        ["0x4ed3b4332B2d14CD01a68F4e9d1A24E2e4BDa427"]
+        "0x36d726238272b4ef65362c452fbb69c0c49a1285637941ef3eec7deddfd15b52"
    }
```

```diff
    contract DataAvailabilityChallenge (0x97A2dA87d3439b172e6DD027220e01c9Cb565B80) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0xba2507dbC415e0D0fa3AA10C2D4559049A93d946"]
      values.$pastUpgrades.0.1:
-        ["0xba2507dbC415e0D0fa3AA10C2D4559049A93d946"]
+        "0x116cc85d8a00169cf0139e080fe70308ade8270518a12d773974f8379d755ebb"
    }
```

```diff
    contract DelayedWETH (0xa130523fD22e2a9D78F8aB232b01ff552845B4A9) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0x7415C3928718d14FB9A4160c78e53f6DA282Ebbc"]
      values.$pastUpgrades.0.1:
-        ["0x7415C3928718d14FB9A4160c78e53f6DA282Ebbc"]
+        "0x3430ae665a5342e24cb43a108ab6c5df4c7ef887d9013f74f6acd2212ad1eec3"
    }
```

```diff
    contract L2OutputOracle (0xa426A052f657AEEefc298b3B5c35a470e4739d69) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      values.$pastUpgrades.0.2:
+        ["0xB78071f03F4D7601129773070F2Dde6184e1BD87"]
      values.$pastUpgrades.0.1:
-        ["0xB78071f03F4D7601129773070F2Dde6184e1BD87"]
+        "0xf323b3f7134b93571d9553f5ee8c2c1dade64e6a366d3f2deccdb72c9d814bc8"
    }
```

```diff
    contract OptimismPortal (0xC7bCb0e8839a28A1cFadd1CF716de9016CdA51ae) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      values.$pastUpgrades.0.2:
+        ["0xD0e1065F2A941Dd723F800C34D2D4282C3158A00"]
      values.$pastUpgrades.0.1:
-        ["0xD0e1065F2A941Dd723F800C34D2D4282C3158A00"]
+        "0xc390979b2ba99e44724e57d179f9ad92e63f86529a80075f669a6956ac3e0210"
    }
```

Generated with discovered.json: 0xe64b26d561d42cfdcb10705e2a26a68e61d13055

# Diff at Wed, 16 Oct 2024 11:39:38 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@a3d139b799cc0b28e5e912febb17464d4e5aef5d block: 19831040
- current block number: 19831040

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19831040 (main branch discovery), not current.

```diff
    contract SuperchainConfig (0x4b5b41c240173191425F5928bc6bdd0d439331BB) {
    +++ description: Used to manage global configuration values for multiple OP Chains within a single Superchain network. The SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the Superchain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      issuedPermissions.1:
+        {"permission":"upgrade","target":"0x70FdbCb066eD3621647Ddf61A1f40aaC6058Bc89","via":[{"address":"0xCC53b447aFe07926423aB96D5496b1af30485ED2","delay":0}]}
      issuedPermissions.0.permission:
-        "upgrade"
+        "guard"
      issuedPermissions.0.target:
-        "0x70FdbCb066eD3621647Ddf61A1f40aaC6058Bc89"
+        "0xb356B146F1629c49C44344464F69BCDAfb4bb664"
      issuedPermissions.0.via.0:
-        {"address":"0xCC53b447aFe07926423aB96D5496b1af30485ED2","delay":0}
    }
```

```diff
    contract SystemConfig (0x8f2428F7189c0d92D1c4a5358903A8c80Ec6a69D) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      issuedPermissions.2:
+        {"permission":"upgrade","target":"0x70FdbCb066eD3621647Ddf61A1f40aaC6058Bc89","via":[{"address":"0xCC53b447aFe07926423aB96D5496b1af30485ED2","delay":0}]}
      issuedPermissions.1.permission:
-        "upgrade"
+        "sequence"
      issuedPermissions.1.target:
-        "0x70FdbCb066eD3621647Ddf61A1f40aaC6058Bc89"
+        "0xA31cb9Bc414601171D4537580f98F66C03aECd43"
      issuedPermissions.1.via.0:
-        {"address":"0xCC53b447aFe07926423aB96D5496b1af30485ED2","delay":0}
    }
```

```diff
    contract L2OutputOracle (0xa426A052f657AEEefc298b3B5c35a470e4739d69) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      issuedPermissions.2:
+        {"permission":"upgrade","target":"0x70FdbCb066eD3621647Ddf61A1f40aaC6058Bc89","via":[{"address":"0xCC53b447aFe07926423aB96D5496b1af30485ED2","delay":0}]}
      issuedPermissions.1:
+        {"permission":"propose","target":"0x4c465E58946145bb2BFC38833154f5A3B5728CF7","via":[]}
      issuedPermissions.0.permission:
-        "upgrade"
+        "challenge"
      issuedPermissions.0.target:
-        "0x70FdbCb066eD3621647Ddf61A1f40aaC6058Bc89"
+        "0xb356B146F1629c49C44344464F69BCDAfb4bb664"
      issuedPermissions.0.via.0:
-        {"address":"0xCC53b447aFe07926423aB96D5496b1af30485ED2","delay":0}
    }
```

```diff
    contract OptimismPortal (0xC7bCb0e8839a28A1cFadd1CF716de9016CdA51ae) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      issuedPermissions.1:
+        {"permission":"upgrade","target":"0x70FdbCb066eD3621647Ddf61A1f40aaC6058Bc89","via":[{"address":"0xCC53b447aFe07926423aB96D5496b1af30485ED2","delay":0}]}
      issuedPermissions.0.permission:
-        "upgrade"
+        "guard"
      issuedPermissions.0.target:
-        "0x70FdbCb066eD3621647Ddf61A1f40aaC6058Bc89"
+        "0xb356B146F1629c49C44344464F69BCDAfb4bb664"
      issuedPermissions.0.via.0:
-        {"address":"0xCC53b447aFe07926423aB96D5496b1af30485ED2","delay":0}
    }
```

Generated with discovered.json: 0x08e1383064139a7701f5a1de2db9af4c546962dc

# Diff at Mon, 14 Oct 2024 10:54:52 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1afc77ff111ceb0970e7d09efcc7b2f376b0c281 block: 19831040
- current block number: 19831040

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19831040 (main branch discovery), not current.

```diff
    contract SuperchainConfig (0x4b5b41c240173191425F5928bc6bdd0d439331BB) {
    +++ description: Used to manage global configuration values for multiple OP Chains within a single Superchain network. The SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the Superchain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      sourceHashes:
+        ["0x7913a1d7d0c47796c94eb6f8fd87a89ae9f2716eda57c9be4fd2b27c70bed617","0x3ac96c9c95e25f689f65a50f24b325e3f891029cb1cea96dc642418bbb535b1d"]
    }
```

```diff
    contract L1ERC721Bridge (0x4FFB98dBC3086bA85d5E626a6EbC3D0d08533fF4) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      sourceHashes:
+        ["0x7913a1d7d0c47796c94eb6f8fd87a89ae9f2716eda57c9be4fd2b27c70bed617","0x482ec6e91304ac39a3fb4505634427bddfddee23b8e93a4f7f995ca5083ae3c3"]
    }
```

```diff
    contract L1CrossDomainMessenger (0x592C1299e0F8331D81A28C0FC7352Da24eDB444a) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      sourceHashes:
+        ["0x20a2eb4d3677fc8a15e944f7b1843acd01b2e92acdc4c7a7f7a35b07b891149b","0x1cc8a3b7de3d2c54c4706bb3f3015714d3b56647fc9fbfd6f8b068f5f63c1c25"]
    }
```

```diff
    contract FaultDisputeGame (0x5A50b05676705cd0189970d806a7c9d2a0201Da7) {
    +++ description: None
      sourceHashes:
+        ["0xe7a783911f817eb6a8df79fb9a26cbb877160af433f5f309ca8c40004292e69d"]
    }
```

```diff
    contract OptimismMintableERC20Factory (0x5f962474834Cf1981Df6232e4b6431d3d10cb71D) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      sourceHashes:
+        ["0x7913a1d7d0c47796c94eb6f8fd87a89ae9f2716eda57c9be4fd2b27c70bed617","0x4c5ac4e53576924cabbd2a471f368a541bc3f4b1f53fa41a389692fcc62f6176"]
    }
```

```diff
    contract MIPS (0x66D6be83984e3F026B4a9e2D8Fb082ecDBd43648) {
    +++ description: None
      sourceHashes:
+        ["0xd7ae10b5c4f34815de81693db2a7198fe7e401acf8891edecccc6b4492000bf2"]
    }
```

```diff
    contract ProxyAdminOwner (0x70FdbCb066eD3621647Ddf61A1f40aaC6058Bc89) {
    +++ description: None
      sourceHashes:
+        ["0x81a7349eebb98ac33b0bc6842e3cb258034a8f2a4ba004570bb8e2e25947f9ff","0xd42bbf9f7dcd3720a7fc6bdc6edfdfae8800a37d6dd4decfa0ef6ca4a2e88940"]
    }
```

```diff
    contract SystemConfig (0x8f2428F7189c0d92D1c4a5358903A8c80Ec6a69D) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      sourceHashes:
+        ["0x7913a1d7d0c47796c94eb6f8fd87a89ae9f2716eda57c9be4fd2b27c70bed617","0xdf9a11b46747139bfe0135df8a65a2728a2dbd60a689e2398c45627915cdd752"]
    }
```

```diff
    contract DisputeGameFactory (0x8f68E849eaf8EB943536F9d1D49Ea9C9b5868b98) {
    +++ description: None
      sourceHashes:
+        ["0x7913a1d7d0c47796c94eb6f8fd87a89ae9f2716eda57c9be4fd2b27c70bed617","0x9bb48ab971d5ae364c19aa29e6eef56f1d698e2e858d5c9fe118cbb173bf7f1b"]
    }
```

```diff
    contract DataAvailabilityChallenge (0x97A2dA87d3439b172e6DD027220e01c9Cb565B80) {
    +++ description: None
      sourceHashes:
+        ["0x7913a1d7d0c47796c94eb6f8fd87a89ae9f2716eda57c9be4fd2b27c70bed617","0xc3e65c7b165290e34daf0095d095072dd3684f21965a97ddedde3ab52b34b04a"]
    }
```

```diff
    contract DelayedWETH (0xa130523fD22e2a9D78F8aB232b01ff552845B4A9) {
    +++ description: None
      sourceHashes:
+        ["0x7913a1d7d0c47796c94eb6f8fd87a89ae9f2716eda57c9be4fd2b27c70bed617","0xd9f0f25f0f2b746b552c3b72265e7c886267e3d298629bf4014b9f70ab754742"]
    }
```

```diff
    contract L2OutputOracle (0xa426A052f657AEEefc298b3B5c35a470e4739d69) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      sourceHashes:
+        ["0x7913a1d7d0c47796c94eb6f8fd87a89ae9f2716eda57c9be4fd2b27c70bed617","0x025c187b0231be4785898f25f98d749f953f5d06781772aef242812e2ecf52e3"]
    }
```

```diff
    contract L1StandardBridge (0xc473ca7E02af24c129c2eEf51F2aDf0411c1Df69) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token.
      sourceHashes:
+        ["0xe60978aadd7b7babd6a7af621f97d7f7e58f1e93f631dd66a13fe4eae9b14761","0x1010ff7f40ab4d53e6d9996aefa04423dabe9d0e22fac2d02b330ed3aa2c5740"]
    }
```

```diff
    contract PermissionedDisputeGame (0xC5E3333f1Dd5e5bBca0Cf49B8799E0Eb567000ba) {
    +++ description: None
      sourceHashes:
+        ["0x552fd756cd3cf160b9b3249f1eca69e85d59ce620f137694aa694ff59261283f"]
    }
```

```diff
    contract OptimismPortal (0xC7bCb0e8839a28A1cFadd1CF716de9016CdA51ae) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      sourceHashes:
+        ["0x7913a1d7d0c47796c94eb6f8fd87a89ae9f2716eda57c9be4fd2b27c70bed617","0xe35fb7bc0433439337b3eadda3d6fb7991918162f62a337a695e8c7f948cdd35"]
    }
```

```diff
    contract ProxyAdmin (0xCC53b447aFe07926423aB96D5496b1af30485ED2) {
    +++ description: None
      template:
-        "opstack/ProxyAdmin"
+        "global/ProxyAdmin"
      sourceHashes:
+        ["0x1d29007e3a6ea19186d632b4d79251aa21baae9b59fbc0b4c88ff3958b5c2730"]
    }
```

```diff
    contract PreimageOracle (0xE7d0fE72637B3C949cd81c63A4Ff1fb23feeF3b2) {
    +++ description: None
      sourceHashes:
+        ["0xfad0959800cdaf145db1109f3401621b37a4a0759e96e2528dd5fcdd9df10c5f"]
    }
```

```diff
    contract AddressManager (0xFe27f187A9E46104a932189dDF229871E06B22F8) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      sourceHashes:
+        ["0xdc86a850f11dc2b5c0472a05d0e3c14f239baf2c3b1ab19631591b0827985380"]
    }
```

Generated with discovered.json: 0x284f1ba9e910d9863bb018d5f12de92c9b02c3f9

# Diff at Wed, 09 Oct 2024 13:10:38 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@37683e2b3d0587372f886eef49e921277810c8bf block: 19831040
- current block number: 19831040

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19831040 (main branch discovery), not current.

```diff
    contract SuperchainConfig (0x4b5b41c240173191425F5928bc6bdd0d439331BB) {
    +++ description: Used to manage global configuration values for multiple OP Chains within a single Superchain network. The SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the Superchain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      issuedPermissions.0.target:
-        "0xCC53b447aFe07926423aB96D5496b1af30485ED2"
+        "0x70FdbCb066eD3621647Ddf61A1f40aaC6058Bc89"
      issuedPermissions.0.via.0:
+        {"address":"0xCC53b447aFe07926423aB96D5496b1af30485ED2","delay":0}
    }
```

```diff
    contract L1ERC721Bridge (0x4FFB98dBC3086bA85d5E626a6EbC3D0d08533fF4) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      issuedPermissions.0.target:
-        "0xCC53b447aFe07926423aB96D5496b1af30485ED2"
+        "0x70FdbCb066eD3621647Ddf61A1f40aaC6058Bc89"
      issuedPermissions.0.via.0:
+        {"address":"0xCC53b447aFe07926423aB96D5496b1af30485ED2","delay":0}
    }
```

```diff
    contract OptimismMintableERC20Factory (0x5f962474834Cf1981Df6232e4b6431d3d10cb71D) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      issuedPermissions.0.target:
-        "0xCC53b447aFe07926423aB96D5496b1af30485ED2"
+        "0x70FdbCb066eD3621647Ddf61A1f40aaC6058Bc89"
      issuedPermissions.0.via.0:
+        {"address":"0xCC53b447aFe07926423aB96D5496b1af30485ED2","delay":0}
    }
```

```diff
    contract ProxyAdminOwner (0x70FdbCb066eD3621647Ddf61A1f40aaC6058Bc89) {
    +++ description: None
      receivedPermissions:
+        [{"permission":"configure","target":"0xFe27f187A9E46104a932189dDF229871E06B22F8","description":"set and change address mappings.","via":[{"address":"0xCC53b447aFe07926423aB96D5496b1af30485ED2"}]},{"permission":"upgrade","target":"0x4b5b41c240173191425F5928bc6bdd0d439331BB","via":[{"address":"0xCC53b447aFe07926423aB96D5496b1af30485ED2"}]},{"permission":"upgrade","target":"0x4FFB98dBC3086bA85d5E626a6EbC3D0d08533fF4","via":[{"address":"0xCC53b447aFe07926423aB96D5496b1af30485ED2"}]},{"permission":"upgrade","target":"0x5f962474834Cf1981Df6232e4b6431d3d10cb71D","via":[{"address":"0xCC53b447aFe07926423aB96D5496b1af30485ED2"}]},{"permission":"upgrade","target":"0x8f2428F7189c0d92D1c4a5358903A8c80Ec6a69D","via":[{"address":"0xCC53b447aFe07926423aB96D5496b1af30485ED2"}]},{"permission":"upgrade","target":"0x8f68E849eaf8EB943536F9d1D49Ea9C9b5868b98","via":[{"address":"0xCC53b447aFe07926423aB96D5496b1af30485ED2"}]},{"permission":"upgrade","target":"0x97A2dA87d3439b172e6DD027220e01c9Cb565B80","via":[{"address":"0xCC53b447aFe07926423aB96D5496b1af30485ED2"}]},{"permission":"upgrade","target":"0xa130523fD22e2a9D78F8aB232b01ff552845B4A9","via":[{"address":"0xCC53b447aFe07926423aB96D5496b1af30485ED2"}]},{"permission":"upgrade","target":"0xa426A052f657AEEefc298b3B5c35a470e4739d69","via":[{"address":"0xCC53b447aFe07926423aB96D5496b1af30485ED2"}]},{"permission":"upgrade","target":"0xc473ca7E02af24c129c2eEf51F2aDf0411c1Df69","description":"upgrading bridge implementation allows to access all funds and change every system component.","via":[{"address":"0xCC53b447aFe07926423aB96D5496b1af30485ED2"}]},{"permission":"upgrade","target":"0xC7bCb0e8839a28A1cFadd1CF716de9016CdA51ae","via":[{"address":"0xCC53b447aFe07926423aB96D5496b1af30485ED2"}]}]
      directlyReceivedPermissions:
+        [{"permission":"act","target":"0xCC53b447aFe07926423aB96D5496b1af30485ED2"}]
    }
```

```diff
    contract SystemConfig (0x8f2428F7189c0d92D1c4a5358903A8c80Ec6a69D) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      issuedPermissions.1.target:
-        "0xCC53b447aFe07926423aB96D5496b1af30485ED2"
+        "0x70FdbCb066eD3621647Ddf61A1f40aaC6058Bc89"
      issuedPermissions.1.via.0:
+        {"address":"0xCC53b447aFe07926423aB96D5496b1af30485ED2","delay":0}
    }
```

```diff
    contract DisputeGameFactory (0x8f68E849eaf8EB943536F9d1D49Ea9C9b5868b98) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xCC53b447aFe07926423aB96D5496b1af30485ED2"
+        "0x70FdbCb066eD3621647Ddf61A1f40aaC6058Bc89"
      issuedPermissions.0.via.0:
+        {"address":"0xCC53b447aFe07926423aB96D5496b1af30485ED2","delay":0}
    }
```

```diff
    contract DataAvailabilityChallenge (0x97A2dA87d3439b172e6DD027220e01c9Cb565B80) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xCC53b447aFe07926423aB96D5496b1af30485ED2"
+        "0x70FdbCb066eD3621647Ddf61A1f40aaC6058Bc89"
      issuedPermissions.0.via.0:
+        {"address":"0xCC53b447aFe07926423aB96D5496b1af30485ED2","delay":0}
    }
```

```diff
    contract DelayedWETH (0xa130523fD22e2a9D78F8aB232b01ff552845B4A9) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xCC53b447aFe07926423aB96D5496b1af30485ED2"
+        "0x70FdbCb066eD3621647Ddf61A1f40aaC6058Bc89"
      issuedPermissions.0.via.0:
+        {"address":"0xCC53b447aFe07926423aB96D5496b1af30485ED2","delay":0}
    }
```

```diff
    contract L2OutputOracle (0xa426A052f657AEEefc298b3B5c35a470e4739d69) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      issuedPermissions.0.target:
-        "0xCC53b447aFe07926423aB96D5496b1af30485ED2"
+        "0x70FdbCb066eD3621647Ddf61A1f40aaC6058Bc89"
      issuedPermissions.0.via.0:
+        {"address":"0xCC53b447aFe07926423aB96D5496b1af30485ED2","delay":0}
    }
```

```diff
    contract L1StandardBridge (0xc473ca7E02af24c129c2eEf51F2aDf0411c1Df69) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token.
      issuedPermissions.0.target:
-        "0xCC53b447aFe07926423aB96D5496b1af30485ED2"
+        "0x70FdbCb066eD3621647Ddf61A1f40aaC6058Bc89"
      issuedPermissions.0.via.0:
+        {"address":"0xCC53b447aFe07926423aB96D5496b1af30485ED2","delay":0,"description":"upgrading bridge implementation allows to access all funds and change every system component."}
    }
```

```diff
    contract OptimismPortal (0xC7bCb0e8839a28A1cFadd1CF716de9016CdA51ae) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      issuedPermissions.0.target:
-        "0xCC53b447aFe07926423aB96D5496b1af30485ED2"
+        "0x70FdbCb066eD3621647Ddf61A1f40aaC6058Bc89"
      issuedPermissions.0.via.0:
+        {"address":"0xCC53b447aFe07926423aB96D5496b1af30485ED2","delay":0}
    }
```

```diff
    contract ProxyAdmin (0xCC53b447aFe07926423aB96D5496b1af30485ED2) {
    +++ description: None
      receivedPermissions:
-        [{"permission":"configure","target":"0xFe27f187A9E46104a932189dDF229871E06B22F8"},{"permission":"upgrade","target":"0x4b5b41c240173191425F5928bc6bdd0d439331BB"},{"permission":"upgrade","target":"0x4FFB98dBC3086bA85d5E626a6EbC3D0d08533fF4"},{"permission":"upgrade","target":"0x5f962474834Cf1981Df6232e4b6431d3d10cb71D"},{"permission":"upgrade","target":"0x8f2428F7189c0d92D1c4a5358903A8c80Ec6a69D"},{"permission":"upgrade","target":"0x8f68E849eaf8EB943536F9d1D49Ea9C9b5868b98"},{"permission":"upgrade","target":"0x97A2dA87d3439b172e6DD027220e01c9Cb565B80"},{"permission":"upgrade","target":"0xa130523fD22e2a9D78F8aB232b01ff552845B4A9"},{"permission":"upgrade","target":"0xa426A052f657AEEefc298b3B5c35a470e4739d69"},{"permission":"upgrade","target":"0xc473ca7E02af24c129c2eEf51F2aDf0411c1Df69","description":"upgrading bridge implementation allows to access all funds and change every system component."},{"permission":"upgrade","target":"0xC7bCb0e8839a28A1cFadd1CF716de9016CdA51ae"}]
      template:
+        "opstack/ProxyAdmin"
      directlyReceivedPermissions:
+        [{"permission":"configure","target":"0xFe27f187A9E46104a932189dDF229871E06B22F8","description":"set and change address mappings."},{"permission":"upgrade","target":"0x4b5b41c240173191425F5928bc6bdd0d439331BB"},{"permission":"upgrade","target":"0x4FFB98dBC3086bA85d5E626a6EbC3D0d08533fF4"},{"permission":"upgrade","target":"0x5f962474834Cf1981Df6232e4b6431d3d10cb71D"},{"permission":"upgrade","target":"0x8f2428F7189c0d92D1c4a5358903A8c80Ec6a69D"},{"permission":"upgrade","target":"0x8f68E849eaf8EB943536F9d1D49Ea9C9b5868b98"},{"permission":"upgrade","target":"0x97A2dA87d3439b172e6DD027220e01c9Cb565B80"},{"permission":"upgrade","target":"0xa130523fD22e2a9D78F8aB232b01ff552845B4A9"},{"permission":"upgrade","target":"0xa426A052f657AEEefc298b3B5c35a470e4739d69"},{"permission":"upgrade","target":"0xc473ca7E02af24c129c2eEf51F2aDf0411c1Df69","description":"upgrading bridge implementation allows to access all funds and change every system component."},{"permission":"upgrade","target":"0xC7bCb0e8839a28A1cFadd1CF716de9016CdA51ae"}]
    }
```

```diff
    contract AddressManager (0xFe27f187A9E46104a932189dDF229871E06B22F8) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      issuedPermissions.0.target:
-        "0xCC53b447aFe07926423aB96D5496b1af30485ED2"
+        "0x70FdbCb066eD3621647Ddf61A1f40aaC6058Bc89"
      issuedPermissions.0.via.0:
+        {"address":"0xCC53b447aFe07926423aB96D5496b1af30485ED2","delay":0,"description":"set and change address mappings."}
      descriptions:
+        ["Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts."]
    }
```

Generated with discovered.json: 0x4707c84e1b48a87393f2811fe8c352c489ec3f9e

# Diff at Tue, 01 Oct 2024 10:54:37 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bd754dc73c66120164006054f8d25c5fae9cd910 block: 19831040
- current block number: 19831040

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19831040 (main branch discovery), not current.

```diff
    contract SuperchainConfig (0x4b5b41c240173191425F5928bc6bdd0d439331BB) {
    +++ description: Used to manage global configuration values for multiple OP Chains within a single Superchain network. The SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the Superchain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      values.$pastUpgrades:
+        [["2024-04-03T22:47:47.000Z",["0x45920c2242a7F2121716431Dd7c2d68740726934"]]]
    }
```

```diff
    contract L1ERC721Bridge (0x4FFB98dBC3086bA85d5E626a6EbC3D0d08533fF4) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      values.$pastUpgrades:
+        [["2024-04-03T22:54:47.000Z",["0x91Cb4eb84F7117196B1c117C7705F2eAF55AfA16"]]]
    }
```

```diff
    contract L1CrossDomainMessenger (0x592C1299e0F8331D81A28C0FC7352Da24eDB444a) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      values.$pastUpgrades:
+        [["2024-04-03T22:55:35.000Z",["0x17AaA27ecEc9a0c530e6Dbd086b6049DCF6D9382"]]]
      values.$upgradeCount:
+        1
    }
```

```diff
    contract OptimismMintableERC20Factory (0x5f962474834Cf1981Df6232e4b6431d3d10cb71D) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      values.$pastUpgrades:
+        [["2024-04-03T22:54:59.000Z",["0x9a3292E64C7b7bf6E04c1ebC7D6671bD82dAbf8B"]]]
    }
```

```diff
    contract SystemConfig (0x8f2428F7189c0d92D1c4a5358903A8c80Ec6a69D) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      values.$pastUpgrades:
+        [["2024-04-03T22:54:11.000Z",["0xd20eF07Ca38301735782e3B89c0E192fD8Ec002d"]]]
    }
```

```diff
    contract DisputeGameFactory (0x8f68E849eaf8EB943536F9d1D49Ea9C9b5868b98) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-04-03T22:56:23.000Z",["0x4ed3b4332B2d14CD01a68F4e9d1A24E2e4BDa427"]]]
    }
```

```diff
    contract DataAvailabilityChallenge (0x97A2dA87d3439b172e6DD027220e01c9Cb565B80) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-04-03T22:48:59.000Z",["0xba2507dbC415e0D0fa3AA10C2D4559049A93d946"]]]
    }
```

```diff
    contract DelayedWETH (0xa130523fD22e2a9D78F8aB232b01ff552845B4A9) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-04-03T22:56:35.000Z",["0x7415C3928718d14FB9A4160c78e53f6DA282Ebbc"]]]
    }
```

```diff
    contract L2OutputOracle (0xa426A052f657AEEefc298b3B5c35a470e4739d69) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      values.$pastUpgrades:
+        [["2024-04-03T22:55:59.000Z",["0xB78071f03F4D7601129773070F2Dde6184e1BD87"]]]
    }
```

```diff
    contract L1StandardBridge (0xc473ca7E02af24c129c2eEf51F2aDf0411c1Df69) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token.
      values.$pastUpgrades:
+        []
    }
```

```diff
    contract OptimismPortal (0xC7bCb0e8839a28A1cFadd1CF716de9016CdA51ae) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      values.$pastUpgrades:
+        [["2024-04-03T22:56:59.000Z",["0xD0e1065F2A941Dd723F800C34D2D4282C3158A00"]]]
    }
```

Generated with discovered.json: 0xa526e146c92b2e9e53f7089d48c773ab4b5f7512

# Diff at Thu, 12 Sep 2024 15:38:15 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@e6761599b8d9e0b597372bb0e9ca885e08af7101 block: 19831040
- current block number: 19831040

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19831040 (main branch discovery), not current.

```diff
    contract SystemConfig (0x8f2428F7189c0d92D1c4a5358903A8c80Ec6a69D) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      issuedPermissions.1:
+        {"permission":"upgrade","target":"0xCC53b447aFe07926423aB96D5496b1af30485ED2","via":[]}
      issuedPermissions.0.permission:
-        "upgrade"
+        "configure"
      issuedPermissions.0.target:
-        "0xCC53b447aFe07926423aB96D5496b1af30485ED2"
+        "0xb356B146F1629c49C44344464F69BCDAfb4bb664"
    }
```

Generated with discovered.json: 0xa3f4b7a7607ed5f77ed8a412d3d532b6dcc1685d

# Diff at Sun, 08 Sep 2024 17:24:45 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@fd881462cca0d7ef4519f907f3c6cfd5fe1cde8f block: 19831040
- current block number: 19831040

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19831040 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0xCC53b447aFe07926423aB96D5496b1af30485ED2) {
    +++ description: None
      descriptions:
-        ["It can upgrade the bridge implementation potentially gaining access to all funds, and change any system component."]
      receivedPermissions.9.description:
+        "upgrading bridge implementation allows to access all funds and change every system component."
    }
```

Generated with discovered.json: 0x2d4fd87e5fb9446fe7e9ccb8e79572459ccf3999

# Diff at Fri, 30 Aug 2024 07:56:26 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@6c1bd1f41fadf5f2cb1c1805b5a2c6138a3ed35a block: 19831040
- current block number: 19831040

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19831040 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0xCC53b447aFe07926423aB96D5496b1af30485ED2) {
    +++ description: It can upgrade the bridge implementation potentially gaining access to all funds, and change any system component.
      receivedPermissions.10.via:
-        []
      receivedPermissions.9.via:
-        []
      receivedPermissions.8.via:
-        []
      receivedPermissions.7.via:
-        []
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

Generated with discovered.json: 0xb2dc5858819a071d0f96a8aaea006ddab7f899fc

# Diff at Fri, 23 Aug 2024 09:54:43 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@67597c7d6c810bc726594446890178150240711e block: 19831040
- current block number: 19831040

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19831040 (main branch discovery), not current.

```diff
    contract SuperchainConfig (0x4b5b41c240173191425F5928bc6bdd0d439331BB) {
    +++ description: Used to manage global configuration values for multiple OP Chains within a single Superchain network. The SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the Superchain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      values.$upgradeCount:
+        1
    }
```

```diff
    contract L1ERC721Bridge (0x4FFB98dBC3086bA85d5E626a6EbC3D0d08533fF4) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      values.$upgradeCount:
+        1
    }
```

```diff
    contract OptimismMintableERC20Factory (0x5f962474834Cf1981Df6232e4b6431d3d10cb71D) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      values.$upgradeCount:
+        1
    }
```

```diff
    contract SystemConfig (0x8f2428F7189c0d92D1c4a5358903A8c80Ec6a69D) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      values.$upgradeCount:
+        1
    }
```

```diff
    contract DisputeGameFactory (0x8f68E849eaf8EB943536F9d1D49Ea9C9b5868b98) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract DataAvailabilityChallenge (0x97A2dA87d3439b172e6DD027220e01c9Cb565B80) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract DelayedWETH (0xa130523fD22e2a9D78F8aB232b01ff552845B4A9) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract L2OutputOracle (0xa426A052f657AEEefc298b3B5c35a470e4739d69) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      values.$upgradeCount:
+        1
    }
```

```diff
    contract L1StandardBridge (0xc473ca7E02af24c129c2eEf51F2aDf0411c1Df69) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token.
      values.$upgradeCount:
+        0
    }
```

```diff
    contract OptimismPortal (0xC7bCb0e8839a28A1cFadd1CF716de9016CdA51ae) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      values.$upgradeCount:
+        1
    }
```

Generated with discovered.json: 0x7a956280c2a98972735887b98527cbd54c123f04

# Diff at Wed, 21 Aug 2024 10:05:23 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@2f6dde3357bf5d79196b6e94f79d853a6c4ec72b block: 19831040
- current block number: 19831040

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19831040 (main branch discovery), not current.

```diff
    contract SuperchainConfig (0x4b5b41c240173191425F5928bc6bdd0d439331BB) {
    +++ description: Used to manage global configuration values for multiple OP Chains within a single Superchain network. The SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the Superchain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xCC53b447aFe07926423aB96D5496b1af30485ED2","via":[]}]
    }
```

```diff
    contract L1ERC721Bridge (0x4FFB98dBC3086bA85d5E626a6EbC3D0d08533fF4) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xCC53b447aFe07926423aB96D5496b1af30485ED2","via":[]}]
    }
```

```diff
    contract OptimismMintableERC20Factory (0x5f962474834Cf1981Df6232e4b6431d3d10cb71D) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xCC53b447aFe07926423aB96D5496b1af30485ED2","via":[]}]
    }
```

```diff
    contract SystemConfig (0x8f2428F7189c0d92D1c4a5358903A8c80Ec6a69D) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xCC53b447aFe07926423aB96D5496b1af30485ED2","via":[]}]
    }
```

```diff
    contract DisputeGameFactory (0x8f68E849eaf8EB943536F9d1D49Ea9C9b5868b98) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xCC53b447aFe07926423aB96D5496b1af30485ED2","via":[]}]
    }
```

```diff
    contract DataAvailabilityChallenge (0x97A2dA87d3439b172e6DD027220e01c9Cb565B80) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xCC53b447aFe07926423aB96D5496b1af30485ED2","via":[]}]
    }
```

```diff
    contract DelayedWETH (0xa130523fD22e2a9D78F8aB232b01ff552845B4A9) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xCC53b447aFe07926423aB96D5496b1af30485ED2","via":[]}]
    }
```

```diff
    contract L2OutputOracle (0xa426A052f657AEEefc298b3B5c35a470e4739d69) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xCC53b447aFe07926423aB96D5496b1af30485ED2","via":[]}]
    }
```

```diff
    contract L1StandardBridge (0xc473ca7E02af24c129c2eEf51F2aDf0411c1Df69) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token.
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xCC53b447aFe07926423aB96D5496b1af30485ED2","via":[]}]
    }
```

```diff
    contract OptimismPortal (0xC7bCb0e8839a28A1cFadd1CF716de9016CdA51ae) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xCC53b447aFe07926423aB96D5496b1af30485ED2","via":[]}]
    }
```

```diff
    contract ProxyAdmin (0xCC53b447aFe07926423aB96D5496b1af30485ED2) {
    +++ description: It can upgrade the bridge implementation potentially gaining access to all funds, and change any system component.
      assignedPermissions:
-        {"upgrade":["0x4FFB98dBC3086bA85d5E626a6EbC3D0d08533fF4","0x4b5b41c240173191425F5928bc6bdd0d439331BB","0x5f962474834Cf1981Df6232e4b6431d3d10cb71D","0x8f2428F7189c0d92D1c4a5358903A8c80Ec6a69D","0x8f68E849eaf8EB943536F9d1D49Ea9C9b5868b98","0x97A2dA87d3439b172e6DD027220e01c9Cb565B80","0xC7bCb0e8839a28A1cFadd1CF716de9016CdA51ae","0xa130523fD22e2a9D78F8aB232b01ff552845B4A9","0xa426A052f657AEEefc298b3B5c35a470e4739d69","0xc473ca7E02af24c129c2eEf51F2aDf0411c1Df69"],"configure":["0xFe27f187A9E46104a932189dDF229871E06B22F8"]}
      receivedPermissions:
+        [{"permission":"configure","target":"0xFe27f187A9E46104a932189dDF229871E06B22F8","via":[]},{"permission":"upgrade","target":"0x4b5b41c240173191425F5928bc6bdd0d439331BB","via":[]},{"permission":"upgrade","target":"0x4FFB98dBC3086bA85d5E626a6EbC3D0d08533fF4","via":[]},{"permission":"upgrade","target":"0x5f962474834Cf1981Df6232e4b6431d3d10cb71D","via":[]},{"permission":"upgrade","target":"0x8f2428F7189c0d92D1c4a5358903A8c80Ec6a69D","via":[]},{"permission":"upgrade","target":"0x8f68E849eaf8EB943536F9d1D49Ea9C9b5868b98","via":[]},{"permission":"upgrade","target":"0x97A2dA87d3439b172e6DD027220e01c9Cb565B80","via":[]},{"permission":"upgrade","target":"0xa130523fD22e2a9D78F8aB232b01ff552845B4A9","via":[]},{"permission":"upgrade","target":"0xa426A052f657AEEefc298b3B5c35a470e4739d69","via":[]},{"permission":"upgrade","target":"0xc473ca7E02af24c129c2eEf51F2aDf0411c1Df69","via":[]},{"permission":"upgrade","target":"0xC7bCb0e8839a28A1cFadd1CF716de9016CdA51ae","via":[]}]
    }
```

```diff
    contract AddressManager (0xFe27f187A9E46104a932189dDF229871E06B22F8) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"configure","target":"0xCC53b447aFe07926423aB96D5496b1af30485ED2","via":[]}]
    }
```

Generated with discovered.json: 0x33dc285c032ae58e69afa1c98a32724786bb2663

# Diff at Fri, 09 Aug 2024 12:01:48 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bf40aa32f030fd312056ca0ef198c8550467d1d7 block: 19831040
- current block number: 19831040

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19831040 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0xCC53b447aFe07926423aB96D5496b1af30485ED2) {
    +++ description: It can upgrade the bridge implementation potentially gaining access to all funds, and change any system component.
      assignedPermissions.upgrade.9:
-        "0xa130523fD22e2a9D78F8aB232b01ff552845B4A9"
+        "0xc473ca7E02af24c129c2eEf51F2aDf0411c1Df69"
      assignedPermissions.upgrade.8:
-        "0x4b5b41c240173191425F5928bc6bdd0d439331BB"
+        "0xa426A052f657AEEefc298b3B5c35a470e4739d69"
      assignedPermissions.upgrade.7:
-        "0x4FFB98dBC3086bA85d5E626a6EbC3D0d08533fF4"
+        "0xa130523fD22e2a9D78F8aB232b01ff552845B4A9"
      assignedPermissions.upgrade.5:
-        "0xa426A052f657AEEefc298b3B5c35a470e4739d69"
+        "0x97A2dA87d3439b172e6DD027220e01c9Cb565B80"
      assignedPermissions.upgrade.4:
-        "0xc473ca7E02af24c129c2eEf51F2aDf0411c1Df69"
+        "0x8f68E849eaf8EB943536F9d1D49Ea9C9b5868b98"
      assignedPermissions.upgrade.3:
-        "0x5f962474834Cf1981Df6232e4b6431d3d10cb71D"
+        "0x8f2428F7189c0d92D1c4a5358903A8c80Ec6a69D"
      assignedPermissions.upgrade.2:
-        "0x8f68E849eaf8EB943536F9d1D49Ea9C9b5868b98"
+        "0x5f962474834Cf1981Df6232e4b6431d3d10cb71D"
      assignedPermissions.upgrade.1:
-        "0x8f2428F7189c0d92D1c4a5358903A8c80Ec6a69D"
+        "0x4b5b41c240173191425F5928bc6bdd0d439331BB"
      assignedPermissions.upgrade.0:
-        "0x97A2dA87d3439b172e6DD027220e01c9Cb565B80"
+        "0x4FFB98dBC3086bA85d5E626a6EbC3D0d08533fF4"
    }
```

Generated with discovered.json: 0x54a2ddb99f629fcf58a5adbc7d6e271f8e71e9a1

# Diff at Fri, 09 Aug 2024 10:11:47 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f0da1d0aab7bc6b3b5e54e7e93480bd98e57035 block: 19831040
- current block number: 19831040

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19831040 (main branch discovery), not current.

```diff
    contract ProxyAdminOwner (0x70FdbCb066eD3621647Ddf61A1f40aaC6058Bc89) {
    +++ description: None
      values.$multisigThreshold:
-        "2 of 3 (67%)"
      values.getOwners:
-        ["0x5DeB7dD12ccF0BFb3b2D26D0A4f302Fb6ACBdcA8","0x61fB1FDA30c900404CDfa22D3eAdCA86FdB95450","0x7211399b320a0417286897fCeD1ee4ba1C1771d4"]
      values.getThreshold:
-        2
      values.$members:
+        ["0x5DeB7dD12ccF0BFb3b2D26D0A4f302Fb6ACBdcA8","0x61fB1FDA30c900404CDfa22D3eAdCA86FdB95450","0x7211399b320a0417286897fCeD1ee4ba1C1771d4"]
      values.$threshold:
+        2
      values.multisigThreshold:
+        "2 of 3 (67%)"
    }
```

```diff
    contract ProxyAdmin (0xCC53b447aFe07926423aB96D5496b1af30485ED2) {
    +++ description: It can upgrade the bridge implementation potentially gaining access to all funds, and change any system component.
      assignedPermissions.admin:
-        ["0x4FFB98dBC3086bA85d5E626a6EbC3D0d08533fF4","0x4b5b41c240173191425F5928bc6bdd0d439331BB","0x5f962474834Cf1981Df6232e4b6431d3d10cb71D","0x8f2428F7189c0d92D1c4a5358903A8c80Ec6a69D","0x8f68E849eaf8EB943536F9d1D49Ea9C9b5868b98","0x97A2dA87d3439b172e6DD027220e01c9Cb565B80","0xC7bCb0e8839a28A1cFadd1CF716de9016CdA51ae","0xa130523fD22e2a9D78F8aB232b01ff552845B4A9","0xa426A052f657AEEefc298b3B5c35a470e4739d69","0xc473ca7E02af24c129c2eEf51F2aDf0411c1Df69"]
      assignedPermissions.owner:
-        ["0xFe27f187A9E46104a932189dDF229871E06B22F8"]
      assignedPermissions.upgrade:
+        ["0x97A2dA87d3439b172e6DD027220e01c9Cb565B80","0x8f2428F7189c0d92D1c4a5358903A8c80Ec6a69D","0x8f68E849eaf8EB943536F9d1D49Ea9C9b5868b98","0x5f962474834Cf1981Df6232e4b6431d3d10cb71D","0xc473ca7E02af24c129c2eEf51F2aDf0411c1Df69","0xa426A052f657AEEefc298b3B5c35a470e4739d69","0xC7bCb0e8839a28A1cFadd1CF716de9016CdA51ae","0x4FFB98dBC3086bA85d5E626a6EbC3D0d08533fF4","0x4b5b41c240173191425F5928bc6bdd0d439331BB","0xa130523fD22e2a9D78F8aB232b01ff552845B4A9"]
      assignedPermissions.configure:
+        ["0xFe27f187A9E46104a932189dDF229871E06B22F8"]
    }
```

Generated with discovered.json: 0x8080f6b341ed853b1b78a52d7f943b56c347e976

# Diff at Tue, 30 Jul 2024 11:13:58 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@b2b6471ff62871f4956541f42ec025c356c08f7e block: 19831040
- current block number: 19831040

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19831040 (main branch discovery), not current.

```diff
    contract SystemConfig (0x8f2428F7189c0d92D1c4a5358903A8c80Ec6a69D) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      fieldMeta:
+        {"gasLimit":{"severity":"LOW","description":"Gas limit for blocks on L2."}}
    }
```

Generated with discovered.json: 0x42b0896c07a6f4663a5afad0472fd7d120ecea0e

# Diff at Thu, 18 Jul 2024 10:32:57 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@d89fe52cb65d643cef712d1d7910564a7acf2dce block: 19831040
- current block number: 19831040

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19831040 (main branch discovery), not current.

```diff
    contract SuperchainConfig (0x4b5b41c240173191425F5928bc6bdd0d439331BB) {
    +++ description: None
      template:
+        "opstack/SuperchainConfig"
      descriptions:
+        ["Used to manage global configuration values for multiple OP Chains within a single Superchain network. The SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the Superchain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system."]
      categories:
+        ["Upgrades&Governance"]
    }
```

```diff
    contract L1ERC721Bridge (0x4FFB98dBC3086bA85d5E626a6EbC3D0d08533fF4) {
    +++ description: None
      template:
+        "opstack/L1ERC721Bridge"
      descriptions:
+        ["Used to bridge ERC-721 tokens from host chain to this chain."]
    }
```

```diff
    contract L1CrossDomainMessenger (0x592C1299e0F8331D81A28C0FC7352Da24eDB444a) {
    +++ description: None
      template:
+        "opstack/L1CrossDomainMessenger"
      descriptions:
+        ["Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function."]
      categories:
+        ["Core"]
    }
```

```diff
    contract OptimismMintableERC20Factory (0x5f962474834Cf1981Df6232e4b6431d3d10cb71D) {
    +++ description: None
      template:
+        "opstack/OptimismMintableERC20Factory"
      descriptions:
+        ["A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa."]
    }
```

```diff
    contract SystemConfig (0x8f2428F7189c0d92D1c4a5358903A8c80Ec6a69D) {
    +++ description: None
      template:
+        "opstack/SystemConfig"
      descriptions:
+        ["Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address."]
    }
```

```diff
    contract L2OutputOracle (0xa426A052f657AEEefc298b3B5c35a470e4739d69) {
    +++ description: None
      template:
+        "opstack/L2OutputOracle"
      descriptions:
+        ["Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots."]
    }
```

```diff
    contract L1StandardBridge (0xc473ca7E02af24c129c2eEf51F2aDf0411c1Df69) {
    +++ description: None
      template:
+        "opstack/L1StandardBridge"
      descriptions:
+        ["The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token."]
      categories:
+        ["Gateways&Escrows"]
    }
```

```diff
    contract OptimismPortal (0xC7bCb0e8839a28A1cFadd1CF716de9016CdA51ae) {
    +++ description: None
      template:
+        "opstack/OptimismPortal"
      descriptions:
+        ["The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals."]
    }
```

```diff
    contract ProxyAdmin (0xCC53b447aFe07926423aB96D5496b1af30485ED2) {
    +++ description: None
      descriptions:
+        ["It can upgrade the bridge implementation potentially gaining access to all funds, and change any system component."]
    }
```

Generated with discovered.json: 0xb990382e14702eae00a5fe05d18bee4ea8b31e66

# Diff at Thu, 09 May 2024 07:38:07 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@d3bba0812727b9105a3f44fe55a68572c804b992 block: 19810497
- current block number: 19831040

## Description

The ProxyAdminOwner Multisig has two new signers and is now 2/3. Challenger, Guardian, SystemConfig, DataAvailabilityChallenge stay EOA-owned.

## Watched changes

```diff
    contract ProxyAdminOwner (0x70FdbCb066eD3621647Ddf61A1f40aaC6058Bc89) {
    +++ description: None
      upgradeability.threshold:
-        "1 of 1 (100%)"
+        "2 of 3 (67%)"
      values.getOwners.2:
+        "0x7211399b320a0417286897fCeD1ee4ba1C1771d4"
      values.getOwners.1:
+        "0x61fB1FDA30c900404CDfa22D3eAdCA86FdB95450"
      values.getOwners.0:
-        "0xb356B146F1629c49C44344464F69BCDAfb4bb664"
+        "0x5DeB7dD12ccF0BFb3b2D26D0A4f302Fb6ACBdcA8"
      values.getThreshold:
-        1
+        2
    }
```

Generated with discovered.json: 0x8c5f2b36bcdbbb428884c05c17a594382bc8a420

# Diff at Mon, 06 May 2024 10:38:42 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- current block number: 19810497

## Description

OP stack chain in Plasma mode (DA challenges, not really Plasma imo). Reading the project page is enough to understand the system, in particular the Technology section. In the discovery there are additional contracts related to the proof system (the one live on Sepolia for OP Mainnet) but they are currently not utilized and disconnected. The way to notice that is that this system is still using the L2OutputOracle for state roots while in the version with the fraud proof system it is deprecated.

## Initial discovery

```diff
+   Status: CREATED
    contract SuperchainConfig (0x4b5b41c240173191425F5928bc6bdd0d439331BB)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1ERC721Bridge (0x4FFB98dBC3086bA85d5E626a6EbC3D0d08533fF4)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1CrossDomainMessenger (0x592C1299e0F8331D81A28C0FC7352Da24eDB444a)
    +++ description: None
```

```diff
+   Status: CREATED
    contract FaultDisputeGame (0x5A50b05676705cd0189970d806a7c9d2a0201Da7)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OptimismMintableERC20Factory (0x5f962474834Cf1981Df6232e4b6431d3d10cb71D)
    +++ description: None
```

```diff
+   Status: CREATED
    contract MIPS (0x66D6be83984e3F026B4a9e2D8Fb082ecDBd43648)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyAdminOwner (0x70FdbCb066eD3621647Ddf61A1f40aaC6058Bc89)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SystemConfig (0x8f2428F7189c0d92D1c4a5358903A8c80Ec6a69D)
    +++ description: None
```

```diff
+   Status: CREATED
    contract DisputeGameFactory (0x8f68E849eaf8EB943536F9d1D49Ea9C9b5868b98)
    +++ description: None
```

```diff
+   Status: CREATED
    contract DataAvailabilityChallenge (0x97A2dA87d3439b172e6DD027220e01c9Cb565B80)
    +++ description: None
```

```diff
+   Status: CREATED
    contract DelayedWETH (0xa130523fD22e2a9D78F8aB232b01ff552845B4A9)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L2OutputOracle (0xa426A052f657AEEefc298b3B5c35a470e4739d69)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1StandardBridge (0xc473ca7E02af24c129c2eEf51F2aDf0411c1Df69)
    +++ description: None
```

```diff
+   Status: CREATED
    contract PermissionedDisputeGame (0xC5E3333f1Dd5e5bBca0Cf49B8799E0Eb567000ba)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OptimismPortal (0xC7bCb0e8839a28A1cFadd1CF716de9016CdA51ae)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0xCC53b447aFe07926423aB96D5496b1af30485ED2)
    +++ description: None
```

```diff
+   Status: CREATED
    contract PreimageOracle (0xE7d0fE72637B3C949cd81c63A4Ff1fb23feeF3b2)
    +++ description: None
```

```diff
+   Status: CREATED
    contract AddressManager (0xFe27f187A9E46104a932189dDF229871E06B22F8)
    +++ description: None
```
