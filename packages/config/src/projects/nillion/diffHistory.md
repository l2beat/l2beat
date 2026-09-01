Generated with discovered.json: 0xa969d0c299eb93368da205b2f582cbde1955a397

# Diff at Thu, 27 Aug 2026 12:40:03 GMT:

- author: vincfurc (<vincfurc@users.noreply.github.com>)
- comparing to: main@07685e2b690dd5d880203f3696ff2e1bc300a13d block: 1786722114
- current timestamp: 1787834329

## Description

Conduit Multisig 1: member added; threshold 4/10 → 4/11.

## Watched changes

```diff
    contract Conduit Multisig 1 (eth:0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) [GnosisSafe] {
    +++ description: None
      values.$members.0:
+        "eth:0x9402c42dB162d5a0927c032136f40Cc9C71853F2"
      values.multisigThreshold:
-        "4 of 10 (40%)"
+        "4 of 11 (36%)"
    }
```

Generated with discovered.json: 0xcb8c8b3f78326299e3c129e53f992116791075f8

# Diff at Fri, 14 Aug 2026 15:43:09 GMT:

- author: vincfurc (<vincfurc@users.noreply.github.com>)
- comparing to: main@8be200f5fe2231607b3283aa3e1ba9da3c89bcd5 block: 1785878882
- current timestamp: 1786722114

## Description

Upgrade 19b "Karst" (op-contracts/v7.0.0): core L1 contracts upgraded to their v7 implementations (OptimismPortal2, SystemConfig, DisputeGameFactory, AnchorStateRegistry, bridges, etc.), executed via a Conduit-deployed OPContractsManagerV2 (v7.1.17). The chain remains on permissioned fault proofs (respected game type 1); it did not move to CANNON_KONA.

## Watched changes

```diff
    contract SuperchainConfig (eth:0x097f99768A0a4a0A81bAbbCB1ea18193bA9D53cC) [opstack/SuperchainConfigFake_expiry] {
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages pause states for each chain connected to it, as well as a global pause state for all chains. The guardian role can pause either separately, but each pause expires after 3mo 1d if left untouched.
      sourceHashes.1:
-        "0x5fb525d1572fb90d060d122143b915059cbff39e0298b345857fd4267d7f6b28"
+        "0x2cd597b7305a446a1df355e6909cbd75fe38aa045faf4876a8e5496eebc1734f"
      values.$implementation:
-        "eth:0xb08Cc720F511062537ca78BdB0AE691F04F5a957"
+        "eth:0xE4F9779ab53070a55db24dFAeFf9AF147c6ED550"
      values.$pastUpgrades.8:
+        ["2026-08-13T13:32:47.000Z","0x2c62c31e4108c24123b9f5b3c26a87e5ec6b4fc3b85163c7257edb523316f9db",["eth:0x2476c911E6D4D9411E677D8Faf15a64ac1fDEEe8"]]
      values.$pastUpgrades.9:
+        ["2026-08-13T13:32:47.000Z","0x2c62c31e4108c24123b9f5b3c26a87e5ec6b4fc3b85163c7257edb523316f9db",["eth:0xE4F9779ab53070a55db24dFAeFf9AF147c6ED550"]]
      values.$upgradeCount:
-        8
+        10
      values.version:
-        "2.4.0"
+        "2.4.2"
      implementationNames.eth:0xb08Cc720F511062537ca78BdB0AE691F04F5a957:
-        "SuperchainConfig"
      implementationNames.eth:0xE4F9779ab53070a55db24dFAeFf9AF147c6ED550:
+        "SuperchainConfig"
    }
```

```diff
-   Status: DELETED
    contract PreimageOracle (eth:0x1fb8cdFc6831fc866Ed9C51aF8817Da5c287aDD3) [opstack/PreimageOracle]
    +++ description: The PreimageOracle contract is used to load the required data from L1 for a dispute game.
```

```diff
    contract Conduit Multisig 1 (eth:0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) [GnosisSafe] {
    +++ description: None
      receivedPermissions.1:
-        {"permission":"interact","from":"eth:0x64A42dB261E1a19a56C51E541F45b42139a4488a","description":"Allowed to challenge or delete state roots proposed by a Proposer.","role":".challenger"}
      receivedPermissions.7:
-        {"permission":"upgrade","from":"eth:0x643207A886613F651A9D4c49138c761c61C5df3B","role":"admin","via":[{"address":"eth:0x5306B2A086d477eCc7302447519dA688f9176e3D"}]}
      receivedPermissions.10:
+        {"permission":"upgrade","from":"eth:0xae6115713F1FD54ea754A1519034BB3839A9b7F6","role":"admin","via":[{"address":"eth:0x5306B2A086d477eCc7302447519dA688f9176e3D"}]}
    }
```

```diff
    contract ProxyAdmin (eth:0x5306B2A086d477eCc7302447519dA688f9176e3D) [global/ProxyAdmin] {
    +++ description: None
      directlyReceivedPermissions.3:
-        {"permission":"upgrade","from":"eth:0x643207A886613F651A9D4c49138c761c61C5df3B","role":"admin"}
      directlyReceivedPermissions.7:
+        {"permission":"upgrade","from":"eth:0xae6115713F1FD54ea754A1519034BB3839A9b7F6","role":"admin"}
    }
```

```diff
    contract DisputeGameFactory (eth:0x5931f05809932a43C2A6c86f3F9BC2788f840b1C) [opstack/DisputeGameFactory_v2] {
    +++ description: The dispute game factory allows the creation of dispute games, used to propose state roots and eventually challenge them. This variant exposes per-type reads only; the legacy array views (gameImpls[], initBonds[]) were removed in the new implementation.
      template:
-        "opstack/DisputeGameFactory"
+        "opstack/DisputeGameFactory_v2"
      sourceHashes.1:
-        "0x7daf6049672fd2ab7dc8dd3b6287e1d0a40958346c5e2857c4616a73dcac4da6"
+        "0x8912e655e26f51d4384fc950df847ae65bccf1f5ec5458642402f385c3dadf78"
      description:
-        "The dispute game factory allows the creation of dispute games, used to propose state roots and eventually challenge them."
+        "The dispute game factory allows the creation of dispute games, used to propose state roots and eventually challenge them. This variant exposes per-type reads only; the legacy array views (gameImpls[], initBonds[]) were removed in the new implementation."
      values.$implementation:
-        "eth:0x74Fac1D45B98bae058F8F566201c9A81B85C7D50"
+        "eth:0x72B971717E088B59F26d4236BE222ADB6ACD393b"
      values.$pastUpgrades.3:
+        ["2026-08-13T15:16:35.000Z","0x8a8c4c8088ec9aa3b462938d7e631bb6241d52aa3a813aefda82ef44da948b10",["eth:0xc040F392E52Cb6970CA8E110c280fE24E07C5e2c"]]
      values.$pastUpgrades.4:
+        ["2026-08-13T15:16:35.000Z","0x8a8c4c8088ec9aa3b462938d7e631bb6241d52aa3a813aefda82ef44da948b10",["eth:0x2476c911E6D4D9411E677D8Faf15a64ac1fDEEe8"]]
      values.$pastUpgrades.5:
+        ["2026-08-13T15:16:35.000Z","0x8a8c4c8088ec9aa3b462938d7e631bb6241d52aa3a813aefda82ef44da948b10",["eth:0x72B971717E088B59F26d4236BE222ADB6ACD393b"]]
      values.$upgradeCount:
-        3
+        6
      values.challengerFromDGF:
-        "UNRESOLVED"
+        "eth:0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      values.game2000:
-        "eth:0x0000000000000000000000000000000000000000"
      values.gameImpls:
-        ["eth:0x0000000000000000000000000000000000000000","eth:0x64A42dB261E1a19a56C51E541F45b42139a4488a","eth:0x0000000000000000000000000000000000000000","eth:0x0000000000000000000000000000000000000000","eth:0x0000000000000000000000000000000000000000","eth:0x0000000000000000000000000000000000000000","eth:0x0000000000000000000000000000000000000000"]
      values.initBonds:
-        [0,0,0,0,0]
      values.permissionedGameArgs:
-        "0x"
+        "0x03682932cec7ce0a3874b19675a6bbc923054a7b321efc7d3835187b172494b6acc005dcd857b401e4732e6f7837135a22825cfa92a4334c1b7876d3a6fba0614ac3ceccf2121568ae6115713f1fd54ea754a1519034bb3839a9b7f6000000000000000000000000000000000000000000000000000000000001823b6303836f83b9bc24f80be698d97256daf688905e4a4962275df8c60a80d3a25faec5aa7de116a746"
      values.proposerFromDGF:
-        "UNRESOLVED"
+        "eth:0x6303836F83B9bC24F80bE698D97256DAf688905E"
      values.version:
-        "1.3.0"
+        "1.6.1"
      values.wethFromDGF:
-        "UNRESOLVED"
+        "eth:0xae6115713F1FD54ea754A1519034BB3839A9b7F6"
+++ severity: HIGH
      values.game0:
+        "eth:0x0000000000000000000000000000000000000000"
+++ severity: HIGH
      values.game1:
+        "eth:0xe1dFFCBE4e22B813F26d2106D943C102e7cAb87e"
+++ severity: HIGH
      values.game621:
+        "eth:0x0000000000000000000000000000000000000000"
+++ severity: HIGH
      values.game8:
+        "eth:0x0000000000000000000000000000000000000000"
      values.game8Args:
+        "0x"
      values.game8Vm:
+        "UNRESOLVED"
      values.initBondGame0:
+        0
      values.initBondGame1:
+        0
      values.initBondGame621:
+        0
      values.initBondGame8:
+        0
      fieldMeta.gameImpls:
-        {"severity":"HIGH"}
      fieldMeta.game2000:
-        {"severity":"HIGH"}
      fieldMeta.game621:
+        {"severity":"HIGH"}
      fieldMeta.game0:
+        {"severity":"HIGH"}
      fieldMeta.game1:
+        {"severity":"HIGH"}
      fieldMeta.game8:
+        {"severity":"HIGH"}
      implementationNames.eth:0x74Fac1D45B98bae058F8F566201c9A81B85C7D50:
-        "DisputeGameFactory"
      implementationNames.eth:0x72B971717E088B59F26d4236BE222ADB6ACD393b:
+        "DisputeGameFactory"
      usedTypes.0:
+        {"typeCaster":"SliceAddress","arg":{"offset":32}}
    }
```

```diff
    contract OptimismMintableERC20Factory (eth:0x6201ED1a86d680B443f44382964ceCf83BEb9c2F) [opstack/OptimismMintableERC20Factory] {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintableERC20 as this chain's representation of a token on the host chain, or vice-versa.
      sourceHashes.1:
-        "0x307d4cb83e682629880fe9bb874a188805e3b93cb11a2cbf80095975f1e5b04e"
+        "0x11b0ed6f15cabf613492a8d54c55304a17cf60f4fd94a655d7e720d4556906d0"
      values.$implementation:
-        "eth:0x8ee6fB13c6c9a7e401531168E196Fbf8b05cEabB"
+        "eth:0xaAbEA75Da509fA518Fd8a91Eae4BE5813B829b12"
      values.$pastUpgrades.2:
+        ["2026-08-13T15:16:35.000Z","0x8a8c4c8088ec9aa3b462938d7e631bb6241d52aa3a813aefda82ef44da948b10",["eth:0x8ee6fB13c6c9a7e401531168E196Fbf8b05cEabB"]]
      values.$pastUpgrades.3:
+        ["2026-08-13T15:16:35.000Z","0x8a8c4c8088ec9aa3b462938d7e631bb6241d52aa3a813aefda82ef44da948b10",["eth:0x2476c911E6D4D9411E677D8Faf15a64ac1fDEEe8"]]
      values.$pastUpgrades.4:
+        ["2026-08-13T15:16:35.000Z","0x8a8c4c8088ec9aa3b462938d7e631bb6241d52aa3a813aefda82ef44da948b10",["eth:0xaAbEA75Da509fA518Fd8a91Eae4BE5813B829b12"]]
      values.$upgradeCount:
-        2
+        5
      values.version:
-        "1.10.2"
+        "1.11.0"
      values.proxyAdmin:
+        "eth:0x5306B2A086d477eCc7302447519dA688f9176e3D"
      values.proxyAdminOwner:
+        "eth:0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      implementationNames.eth:0x8ee6fB13c6c9a7e401531168E196Fbf8b05cEabB:
-        "OptimismMintableERC20Factory"
      implementationNames.eth:0xaAbEA75Da509fA518Fd8a91Eae4BE5813B829b12:
+        "OptimismMintableERC20Factory"
    }
```

```diff
    EOA  (eth:0x6303836F83B9bC24F80bE698D97256DAf688905E) {
    +++ description: None
      receivedPermissions:
-        [{"permission":"interact","from":"eth:0x64A42dB261E1a19a56C51E541F45b42139a4488a","description":"Allowed to post new state roots of the current layer to the host chain.","role":".proposer"}]
    }
```

```diff
-   Status: DELETED
    contract DelayedWETH (eth:0x643207A886613F651A9D4c49138c761c61C5df3B) [opstack/DelayedWETH]
    +++ description: Contract designed to hold the bonded ETH for each game. It is designed as a wrapper around WETH to allow an owner to function as a backstop if a game would incorrectly distribute funds.
```

```diff
-   Status: DELETED
    contract MIPS (eth:0x6463dEE3828677F6270d83d45408044fc5eDB908) [opstack/MIPS]
    +++ description: The MIPS contract is used to execute the final step of the dispute game which objectively determines the winner of the dispute.
```

```diff
-   Status: DELETED
    contract PermissionedDisputeGame (eth:0x64A42dB261E1a19a56C51E541F45b42139a4488a) [opstack/PermissionedDisputeGame]
    +++ description: Same as FaultDisputeGame, but only two permissioned addresses are designated as proposer and challenger.
```

```diff
    contract L1CrossDomainMessenger (eth:0x793c90d3f04ac72Cc7E46Faa8AcaDEA0A10e8D52) [opstack/L1CrossDomainMessenger] {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      sourceHashes.1:
-        "0x1f2c13ad1144ce6548e578b834c33b0d65b1564aeb0d5c708ed4e7fb50535cc6"
+        "0x694050f95b40e6d92ee91ca0f60acb9c4a74d1b0325c33fd4bd7445fde90e806"
      values.$implementation:
-        "eth:0xb686F13AfF1e427a1f993F29ab0F2E7383729FE0"
+        "eth:0x59D497530b00062f40950ba8EaB88868bf7F86f0"
      values.$pastUpgrades.3:
+        ["2026-08-13T15:16:35.000Z","0x8a8c4c8088ec9aa3b462938d7e631bb6241d52aa3a813aefda82ef44da948b10",["eth:0xb686F13AfF1e427a1f993F29ab0F2E7383729FE0"]]
      values.$pastUpgrades.4:
+        ["2026-08-13T15:16:35.000Z","0x8a8c4c8088ec9aa3b462938d7e631bb6241d52aa3a813aefda82ef44da948b10",["eth:0x2476c911E6D4D9411E677D8Faf15a64ac1fDEEe8"]]
      values.$pastUpgrades.5:
+        ["2026-08-13T15:16:35.000Z","0x8a8c4c8088ec9aa3b462938d7e631bb6241d52aa3a813aefda82ef44da948b10",["eth:0x59D497530b00062f40950ba8EaB88868bf7F86f0"]]
      values.$upgradeCount:
-        3
+        6
      values.version:
-        "2.11.0"
+        "2.11.1"
      implementationNames.eth:0xb686F13AfF1e427a1f993F29ab0F2E7383729FE0:
-        "L1CrossDomainMessenger"
      implementationNames.eth:0x59D497530b00062f40950ba8EaB88868bf7F86f0:
+        "L1CrossDomainMessenger"
    }
```

```diff
    contract OptimismPortal2 (eth:0x7b96e2c80696D5D2d673f0EA62b67352E18747C0) [opstack/OptimismPortal2] {
    +++ description: The OptimismPortal contract is the main entry point to deposit funds from L1 to L2. It also allows to prove and finalize withdrawals. It specifies which game type can be used for withdrawals, which currently is the PermissionedDisputeGame.
      sourceHashes.1:
-        "0x3e7e2cb08ba995795937c9c2e8ea9d0e4d2e2de852f389055073384d5f79c59d"
+        "0xe1df4caf26d9a0735bd53eeb020546840bd2f2fd4d0d9e2519f873306b5e19b1"
      values.$implementation:
-        "eth:0x7Cf803296662e8C72A6C1d6450572209aCF7f202"
+        "eth:0xe89F13c5ee4033B2D3cD76C9d6958eFBfe26D3C2"
      values.$pastUpgrades.3:
+        ["2026-08-13T15:16:35.000Z","0x8a8c4c8088ec9aa3b462938d7e631bb6241d52aa3a813aefda82ef44da948b10",["eth:0x97cEbbf8959e2A5476fbe9B98A21806Ec234609B"]]
      values.$pastUpgrades.4:
+        ["2026-08-13T15:16:35.000Z","0x8a8c4c8088ec9aa3b462938d7e631bb6241d52aa3a813aefda82ef44da948b10",["eth:0x2476c911E6D4D9411E677D8Faf15a64ac1fDEEe8"]]
      values.$pastUpgrades.5:
+        ["2026-08-13T15:16:35.000Z","0x8a8c4c8088ec9aa3b462938d7e631bb6241d52aa3a813aefda82ef44da948b10",["eth:0xe89F13c5ee4033B2D3cD76C9d6958eFBfe26D3C2"]]
      values.$upgradeCount:
-        3
+        6
      values.version:
-        "5.1.1"
+        "5.6.1"
      implementationNames.eth:0x7Cf803296662e8C72A6C1d6450572209aCF7f202:
-        "OptimismPortal2"
      implementationNames.eth:0xe89F13c5ee4033B2D3cD76C9d6958eFBfe26D3C2:
+        "OptimismPortal2"
    }
```

```diff
    contract SystemConfig (eth:0x8a502d8EEa2Ed3e89c4D52DE51364688590cE591) [opstack/SystemConfig] {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      sourceHashes.1:
-        "0xaa1b3bedab4e63198240e9dea4503f0e615e4d18a545961c9f11b72143279fbc"
+        "0x3d8e7cdbbdbf274bba0a11a060b01d5a50e3a478683af9ec079874d1758576d6"
      values.$implementation:
-        "eth:0x2fA28989fc559836E9d66dFf3010C7F7f41c65ED"
+        "eth:0x42Ad0173051225Ac784100e9acD43349707F4db9"
      values.$pastUpgrades.3:
+        ["2026-08-13T15:16:35.000Z","0x8a8c4c8088ec9aa3b462938d7e631bb6241d52aa3a813aefda82ef44da948b10",["eth:0xd392c27B84b1cA776528F2704BC67B82a62132d2"]]
      values.$pastUpgrades.4:
+        ["2026-08-13T15:16:35.000Z","0x8a8c4c8088ec9aa3b462938d7e631bb6241d52aa3a813aefda82ef44da948b10",["eth:0x2476c911E6D4D9411E677D8Faf15a64ac1fDEEe8"]]
      values.$pastUpgrades.5:
+        ["2026-08-13T15:16:35.000Z","0x8a8c4c8088ec9aa3b462938d7e631bb6241d52aa3a813aefda82ef44da948b10",["eth:0x42Ad0173051225Ac784100e9acD43349707F4db9"]]
      values.$upgradeCount:
-        3
+        6
      values.getAddresses.delayedWETH:
+        "eth:0xae6115713F1FD54ea754A1519034BB3839A9b7F6"
      values.getAddresses.opcm:
+        "eth:0xbfb9219d933ec96Ac99C4f3D7231eFE43757811F"
      values.version:
-        "3.11.0"
+        "3.14.2"
      values.DELAYED_WETH_SLOT:
+        "0x51547f31a231e1007dca33017faa3da20d959b95087c588a7768bfb922fd58ff"
      values.delayedWETH:
+        "eth:0xae6115713F1FD54ea754A1519034BB3839A9b7F6"
      values.isCustomGasToken:
+        false
      values.lastUsedOPCM:
+        "eth:0xbfb9219d933ec96Ac99C4f3D7231eFE43757811F"
      values.lastUsedOPCMVersion:
+        "7.1.17"
      values.OPCM_SLOT:
+        "0x99f45962df4bc30de8d4c3c6d1ffc0f100edce16e80c7a5768b6d55ca463ff42"
      implementationNames.eth:0x2fA28989fc559836E9d66dFf3010C7F7f41c65ED:
-        "SystemConfig"
      implementationNames.eth:0x42Ad0173051225Ac784100e9acD43349707F4db9:
+        "SystemConfig"
    }
```

```diff
    contract AnchorStateRegistry (eth:0x92A4334C1B7876d3A6Fba0614ac3CECcF2121568) [opstack/AnchorStateRegistry_post20] {
    +++ description: Contains the latest confirmed state root that can be used as a starting point in a dispute game. This variant stores respectedGameType, retirementTimestamp, and disputeGameFinalityDelaySeconds locally and drops the legacy *FromGame fields, since the AggregateVerifier model does not expose vm()/weth()/absolutePrestate() on its game implementation.
      template:
-        "opstack/AnchorStateRegistry_post13"
+        "opstack/AnchorStateRegistry_post20"
      sourceHashes.1:
-        "0xf808a203af41f7932eb8e39985e56a7c75c940a260fb17d76d1003a3793281b5"
+        "0x10f64124093daab87c84d97148854054f9622bf86e09e98d496f123be3368122"
      description:
-        "Contains the latest confirmed state root that can be used as a starting point in a dispute game. It specifies which game type can be used for withdrawals, which currently is the PermissionedDisputeGame."
+        "Contains the latest confirmed state root that can be used as a starting point in a dispute game. This variant stores respectedGameType, retirementTimestamp, and disputeGameFinalityDelaySeconds locally and drops the legacy *FromGame fields, since the AggregateVerifier model does not expose vm()/weth()/absolutePrestate() on its game implementation."
      values.$implementation:
-        "eth:0xeb69cC681E8D4a557b30DFFBAd85aFfD47a2CF2E"
+        "eth:0x8F40Cc98D694AB986F026C5383A181FCc9B6B281"
      values.$pastUpgrades.1:
+        ["2026-08-13T15:16:35.000Z","0x8a8c4c8088ec9aa3b462938d7e631bb6241d52aa3a813aefda82ef44da948b10",["eth:0x36398155Cd17cfe804F69b233eDDA800DD4D5aA5"]]
      values.$pastUpgrades.2:
+        ["2026-08-13T15:16:35.000Z","0x8a8c4c8088ec9aa3b462938d7e631bb6241d52aa3a813aefda82ef44da948b10",["eth:0x2476c911E6D4D9411E677D8Faf15a64ac1fDEEe8"]]
      values.$pastUpgrades.3:
+        ["2026-08-13T15:16:35.000Z","0x8a8c4c8088ec9aa3b462938d7e631bb6241d52aa3a813aefda82ef44da948b10",["eth:0x8F40Cc98D694AB986F026C5383A181FCc9B6B281"]]
      values.$upgradeCount:
-        1
+        4
      values.absolutePrestateFromGame:
-        "0x03682932cec7ce0a3874b19675a6bbc923054a7b321efc7d3835187b172494b6"
      values.challengePeriodFromOracle:
-        86400
      values.oracleFromVm:
-        "eth:0x1fb8cdFc6831fc866Ed9C51aF8817Da5c287aDD3"
      values.version:
-        "3.5.0"
+        "3.9.0"
      values.vmFromGame:
-        "eth:0x6463dEE3828677F6270d83d45408044fc5eDB908"
      values.wethFromGame:
-        "eth:0x643207A886613F651A9D4c49138c761c61C5df3B"
      values.getStartingAnchorRoot:
+        {"root":"0xdead000000000000000000000000000000000000000000000000000000000000","l2SequenceNumber":0}
      fieldMeta.retirementTimestamp:
+        {"severity":"HIGH"}
      fieldMeta.disputeGameFinalityDelaySeconds:
+        {"severity":"HIGH"}
      implementationNames.eth:0xeb69cC681E8D4a557b30DFFBAd85aFfD47a2CF2E:
-        "AnchorStateRegistry"
      implementationNames.eth:0x8F40Cc98D694AB986F026C5383A181FCc9B6B281:
+        "AnchorStateRegistry"
      usedTypes.0.arg.621:
+        "AggregateVerifier"
      usedTypes.0.arg.8:
+        "FaultDisputeGame"
    }
```

```diff
    contract L1StandardBridge (eth:0xDD72d0bD01Fc7BeCe4Cc0cFdD2be6a29b846B072) [opstack/L1StandardBridge] {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      sourceHashes.1:
-        "0xcacd38e7b52353ad3463da40b7e7a29b028f95500a82590d2b8f8ffd26b83f6d"
+        "0x6469155800e1489607c8fa062550a362dfa8978885df4714ca4653e5f3d25b0c"
      values.$implementation:
-        "eth:0x61525EaaCDdB97D9184aFc205827E6A4fd0Bf62A"
+        "eth:0xB37a11AadF167B2F0b8dD85372De4bC66CD4A891"
      values.version:
-        "2.8.0"
+        "2.8.2"
      implementationNames.eth:0x61525EaaCDdB97D9184aFc205827E6A4fd0Bf62A:
-        "L1StandardBridge"
      implementationNames.eth:0xB37a11AadF167B2F0b8dD85372De4bC66CD4A891:
+        "L1StandardBridge"
    }
```

```diff
    contract L1ERC721Bridge (eth:0xeA869DCE9Fd2Fdda1ec61492662dD715755b24E1) [opstack/L1ERC721Bridge] {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      sourceHashes.1:
-        "0x1f65fda230b6d0df44e466b06418b2e12a401ef82c07521ad18d2f4ae6c70fb2"
+        "0xc5ed62b03fb7c1340609ace7ebb0c5bf8d43b1814b1ab4f10863bfa21d13b90b"
      values.$implementation:
-        "eth:0x74f1aC50EB0BE98853805D381C884f5f9abDEcf9"
+        "eth:0x9F164f1d02A81e06D639E55F65a87f0070E3Cb2e"
      values.$pastUpgrades.3:
+        ["2026-08-13T15:16:35.000Z","0x8a8c4c8088ec9aa3b462938d7e631bb6241d52aa3a813aefda82ef44da948b10",["eth:0x74f1aC50EB0BE98853805D381C884f5f9abDEcf9"]]
      values.$pastUpgrades.4:
+        ["2026-08-13T15:16:35.000Z","0x8a8c4c8088ec9aa3b462938d7e631bb6241d52aa3a813aefda82ef44da948b10",["eth:0x2476c911E6D4D9411E677D8Faf15a64ac1fDEEe8"]]
      values.$pastUpgrades.5:
+        ["2026-08-13T15:16:35.000Z","0x8a8c4c8088ec9aa3b462938d7e631bb6241d52aa3a813aefda82ef44da948b10",["eth:0x9F164f1d02A81e06D639E55F65a87f0070E3Cb2e"]]
      values.$upgradeCount:
-        3
+        6
      values.version:
-        "2.9.0"
+        "2.9.1"
      implementationNames.eth:0x74f1aC50EB0BE98853805D381C884f5f9abDEcf9:
-        "L1ERC721Bridge"
      implementationNames.eth:0x9F164f1d02A81e06D639E55F65a87f0070E3Cb2e:
+        "L1ERC721Bridge"
    }
```

```diff
+   Status: CREATED
    contract DelayedWETH (eth:0xae6115713F1FD54ea754A1519034BB3839A9b7F6) [opstack/DelayedWETH]
    +++ description: Contract designed to hold the bonded ETH for each game. It is designed as a wrapper around WETH to allow an owner to function as a backstop if a game would incorrectly distribute funds.
```

```diff
+   Status: CREATED
    contract PermissionedDisputeGame (eth:0xe1dFFCBE4e22B813F26d2106D943C102e7cAb87e) [opstack/PermissionedDisputeGame]
    +++ description: Same as FaultDisputeGame, but only two permissioned addresses are designated as proposer and challenger.
```

## Source code changes

```diff
.../AnchorStateRegistry/AnchorStateRegistry.sol    | 1189 +-----
 .../DelayedWETH/DelayedWETH.sol                    |   54 +-
 .../DisputeGameFactory/DisputeGameFactory.sol      |   92 +-
 .../L1CrossDomainMessenger.sol                     | 1619 +++-----
 .../L1ERC721Bridge/L1ERC721Bridge.sol              |  208 +-
 .../L1StandardBridge/L1StandardBridge.sol          |  212 +-
 .../nillion/.flat@1785878882/MIPS.sol => /dev/null | 3274 ---------------
 .../OptimismMintableERC20Factory.sol               |  341 +-
 .../OptimismPortal2/OptimismPortal2.sol            | 1522 ++-----
 .../PermissionedDisputeGame.sol                    | 4372 ++++++++++----------
 .../PreimageOracle.sol => /dev/null                | 1463 -------
 .../SuperchainConfig/SuperchainConfig.sol          |   34 +-
 .../SystemConfig/SystemConfig.sol                  | 1615 ++------
 13 files changed, 4446 insertions(+), 11549 deletions(-)
```

Generated with discovered.json: 0x5d246fd081f37b8b5c4e417d54d593e305b9de7c

# Diff at Tue, 04 Aug 2026 21:29:19 GMT:

- author: vincfurc (<vincfurc@users.noreply.github.com>)
- comparing to: main@44e2212a46e585fd2ddb21d6755695cf74e1f876 block: 1784563060
- current timestamp: 1785878882

## Description

Shared SuperchainConfig implementation rolled back v2.4.2 → v2.4.0. The two versions differ only in comments, unused internal constants, and the version string; no change to logic or storage.

## Watched changes

```diff
    contract SuperchainConfig (eth:0x097f99768A0a4a0A81bAbbCB1ea18193bA9D53cC) [opstack/SuperchainConfigFake_expiry] {
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages pause states for each chain connected to it, as well as a global pause state for all chains. The guardian role can pause either separately, but each pause expires after 3mo 1d if left untouched.
      sourceHashes.1:
-        "0x2cd597b7305a446a1df355e6909cbd75fe38aa045faf4876a8e5496eebc1734f"
+        "0x5fb525d1572fb90d060d122143b915059cbff39e0298b345857fd4267d7f6b28"
      values.$implementation:
-        "eth:0xE4F9779ab53070a55db24dFAeFf9AF147c6ED550"
+        "eth:0xb08Cc720F511062537ca78BdB0AE691F04F5a957"
      values.$pastUpgrades.5:
+        ["2026-08-04T13:59:35.000Z","0xfb6124f237aaaccedd1f8d1298ae5f3b19871f7af18bd4c791a818487cc199de",["eth:0x4da82a327773965b8d4D85Fa3dB8249b387458E7"]]
      values.$pastUpgrades.6:
+        ["2026-08-04T14:11:35.000Z","0xf7dd2207111f0f269b7cdfa8a7fa703b664585513bc113e0d2c8bc7ce9eb355f",["eth:0xCe28685EB204186b557133766eCA00334EB441E4"]]
      values.$pastUpgrades.7:
+        ["2026-08-04T14:16:11.000Z","0xeb6b35d861c5b232c47bc0e604f0834975876f80181776e46cb486f7a398cf03",["eth:0xb08Cc720F511062537ca78BdB0AE691F04F5a957"]]
      values.$upgradeCount:
-        5
+        8
      values.version:
-        "2.4.2"
+        "2.4.0"
      implementationNames.eth:0xE4F9779ab53070a55db24dFAeFf9AF147c6ED550:
-        "SuperchainConfig"
      implementationNames.eth:0xb08Cc720F511062537ca78BdB0AE691F04F5a957:
+        "SuperchainConfig"
    }
```

## Source code changes

```diff
.../SuperchainConfig/SuperchainConfig.sol          | 34 ++++------------------
 1 file changed, 6 insertions(+), 28 deletions(-)
```

Generated with discovered.json: 0x28aee8482032745a9bae7c87258645aaead57b26

# Diff at Mon, 20 Jul 2026 15:58:44 GMT:

- author: vincfurc (<vincfurc@users.noreply.github.com>)
- comparing to: main@ab4290b6bc5b6a34b8b091245cd07a7a94441102 block: 1781176827
- current timestamp: 1784563060

## Description

Shared Conduit SuperchainConfig upgraded 2.4.0 → 2.4.2 ([diff](https://disco.l2beat.com/diff/eth:0xb08Cc720F511062537ca78BdB0AE691F04F5a957/eth:0xE4F9779ab53070a55db24dFAeFf9AF147c6ED550)). No behavioral change — just an import-path move, a stale pause-state warning removed, and the version tick, as with the main-Superchain upgrade on 2026-06-25.

## Watched changes

```diff
    contract SuperchainConfig (eth:0x097f99768A0a4a0A81bAbbCB1ea18193bA9D53cC) [opstack/SuperchainConfigFake_expiry] {
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages pause states for each chain connected to it, as well as a global pause state for all chains. The guardian role can pause either separately, but each pause expires after 3mo 1d if left untouched.
      sourceHashes.1:
-        "0x5fb525d1572fb90d060d122143b915059cbff39e0298b345857fd4267d7f6b28"
+        "0x2cd597b7305a446a1df355e6909cbd75fe38aa045faf4876a8e5496eebc1734f"
      values.$implementation:
-        "eth:0xb08Cc720F511062537ca78BdB0AE691F04F5a957"
+        "eth:0xE4F9779ab53070a55db24dFAeFf9AF147c6ED550"
      values.$pastUpgrades.3:
+        ["2026-07-17T11:30:11.000Z","0x1f1d4768cc0d3f218a3f5aea7b6ceed0ae663498958e8194f208e88522c6404b",["eth:0x2476c911E6D4D9411E677D8Faf15a64ac1fDEEe8"]]
      values.$pastUpgrades.4:
+        ["2026-07-17T11:30:11.000Z","0x1f1d4768cc0d3f218a3f5aea7b6ceed0ae663498958e8194f208e88522c6404b",["eth:0xE4F9779ab53070a55db24dFAeFf9AF147c6ED550"]]
      values.$upgradeCount:
-        3
+        5
      values.version:
-        "2.4.0"
+        "2.4.2"
      implementationNames.eth:0xb08Cc720F511062537ca78BdB0AE691F04F5a957:
-        "SuperchainConfig"
      implementationNames.eth:0xE4F9779ab53070a55db24dFAeFf9AF147c6ED550:
+        "SuperchainConfig"
    }
```

## Source code changes

```diff
.../SuperchainConfig/SuperchainConfig.sol          | 34 ++++++++++++++++++----
 1 file changed, 28 insertions(+), 6 deletions(-)
```

Generated with discovered.json: 0x818eaaa854f397cceb82033cbe4b8c8616814300

# Diff at Tue, 30 Jun 2026 20:24:42 GMT:

- author: vincfurc (<vincfurc@users.noreply.github.com>)
- comparing to: main@d6a4cf0104ece715f88d9597c7e158a2841e88fd block: 1781176827
- current timestamp: 1781176827

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1781176827 (main branch discovery), not current.

```diff
    contract OptimismPortal2 (eth:0x7b96e2c80696D5D2d673f0EA62b67352E18747C0) [opstack/OptimismPortal2] {
    +++ description: The OptimismPortal contract is the main entry point to deposit funds from L1 to L2. It also allows to prove and finalize withdrawals. It specifies which game type can be used for withdrawals, which currently is the PermissionedDisputeGame.
      usedTypes.0.arg.8:
+        "FaultDisputeGame"
    }
```

Generated with discovered.json: 0xaa97c96b4c4cf2fc79351f9cb11a0ac24627bd01

# Diff at Thu, 11 Jun 2026 11:21:44 GMT:

- author: vincfurc (<vincfurc@users.noreply.github.com>)
- comparing to: main@91b2eba1ff9c1c8341d0eaf6594dac4179405ef6 block: 1780397597
- current timestamp: 1781176827

## Description

Conduit Multisig 1 dropped two signers.

## Watched changes

```diff
    contract Conduit Multisig 1 (eth:0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) [GnosisSafe] {
    +++ description: None
      values.$members.4:
-        "eth:0x65D1d44B8B2fE15d45A03708E0835C7E98a56007"
      values.$members.8:
-        "eth:0xa4000bDD2bB92ce6750b31F1eeda47Bd1cB8e6e4"
      values.multisigThreshold:
-        "4 of 12 (33%)"
+        "4 of 10 (40%)"
    }
```

Generated with discovered.json: 0x75ac472d4467b63aa63f995a85afefcba34f3f65

# Diff at Tue, 09 Jun 2026 12:43:36 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@ae67a38d37457ad735e5d55080d2e5479d5df7dc block: 1780397597
- current timestamp: 1780397597

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1780397597 (main branch discovery), not current.

```diff
    EOA  (eth:0x17B6188D515B824B76D0706bb9168035f5898685) {
    +++ description: None
      receivedPermissions.0.description:
+        "Allowed to commit transactions from the current layer to the host chain."
      receivedPermissions.0.permission:
-        "sequence"
+        "interact"
    }
```

```diff
    contract Conduit Multisig 1 (eth:0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) [GnosisSafe] {
    +++ description: None
      receivedPermissions.0.description:
+        "Allowed to pause withdrawals. In op stack systems with a proof system, the Guardian can also blacklist dispute games and set the respected game type (permissioned / permissionless)."
      receivedPermissions.0.role:
-        ".challenger"
+        ".guardian"
      receivedPermissions.0.from:
-        "eth:0x64A42dB261E1a19a56C51E541F45b42139a4488a"
+        "eth:0x097f99768A0a4a0A81bAbbCB1ea18193bA9D53cC"
      receivedPermissions.0.permission:
-        "challenge"
+        "interact"
      receivedPermissions.1.description:
+        "Allowed to challenge or delete state roots proposed by a Proposer."
      receivedPermissions.1.role:
-        ".guardian"
+        ".challenger"
      receivedPermissions.1.from:
-        "eth:0x097f99768A0a4a0A81bAbbCB1ea18193bA9D53cC"
+        "eth:0x64A42dB261E1a19a56C51E541F45b42139a4488a"
      receivedPermissions.1.permission:
-        "guard"
+        "interact"
    }
```

```diff
    EOA  (eth:0x6303836F83B9bC24F80bE698D97256DAf688905E) {
    +++ description: None
      receivedPermissions.0.description:
+        "Allowed to post new state roots of the current layer to the host chain."
      receivedPermissions.0.permission:
-        "propose"
+        "interact"
    }
```

Generated with discovered.json: 0xb59e0a4804373ae68639d89216c56437a1698e73

# Diff at Thu, 04 Jun 2026 17:42:22 GMT:

- author: vincfurc (<vincfurc@users.noreply.github.com>)
- comparing to: main@8ad83b88dd9180e282e419267cebe10e93daf01d block: 1777994269
- current timestamp: 1780397597

## Description

Conduit Multisig 1 rotated one signer (operator key `0x3840…fd5f` → `0xcdC9…4853`); same rotation propagated across Conduit Multisigs 1/2/3 on eth/arb1/base.

New game name (aggregateVerifier) added to portal.

## Watched changes

```diff
    contract Conduit Multisig 1 (eth:0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) [GnosisSafe] {
    +++ description: None
      values.$members.0:
+        "eth:0xcdC931935768c0562AfE989A366a3Dc4d52F4853"
      values.$members.8:
-        "eth:0x3840f487A17A41100DD1Bf0946c34f132a57Fd5f"
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1777994269 (main branch discovery), not current.

```diff
    contract OptimismPortal2 (eth:0x7b96e2c80696D5D2d673f0EA62b67352E18747C0) [opstack/OptimismPortal2] {
    +++ description: The OptimismPortal contract is the main entry point to deposit funds from L1 to L2. It also allows to prove and finalize withdrawals. It specifies which game type can be used for withdrawals, which currently is the PermissionedDisputeGame.
      usedTypes.0.arg.621:
+        "AggregateVerifier"
    }
```

Generated with discovered.json: 0xc9171045bbc1bc73222052d957dd5b7edcba887f

# Diff at Fri, 08 May 2026 07:51:42 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@488d190650457a1fba9b18a83f14a17ab8b2c84c block: 1777994269
- current timestamp: 1777994269

## Description

Use the new flattener implementation

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1777994269 (main branch discovery), not current.

```diff
    contract SuperchainConfig (eth:0x097f99768A0a4a0A81bAbbCB1ea18193bA9D53cC) [opstack/SuperchainConfigFake_expiry] {
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages pause states for each chain connected to it, as well as a global pause state for all chains. The guardian role can pause either separately, but each pause expires after 3mo 1d if left untouched.
      sourceHashes.1:
-        "0x53a6b3db7f270298025bbfef7f6c77b420a9808341212fa9cf54a5e157a18567"
+        "0x5fb525d1572fb90d060d122143b915059cbff39e0298b345857fd4267d7f6b28"
      deployerAddress:
+        "eth:0x0a1C5E42e423fab63746d375B84d3Fe4cAf9b513"
    }
```

```diff
    contract PreimageOracle (eth:0x1fb8cdFc6831fc866Ed9C51aF8817Da5c287aDD3) [opstack/PreimageOracle] {
    +++ description: The PreimageOracle contract is used to load the required data from L1 for a dispute game.
      sourceHashes.0:
-        "0xd9838f1f137bd5397f583f33c414ec9c0fc3dc69401213fae0f09c36d4ac8e47"
+        "0x16701fcaa0e04e5481701a81736e7c8ee2c8aa32da272bf74e0589e6a90c3615"
      deployerAddress:
+        "eth:0x1D0519EeD308BcD49e4ebc149284F83ebC275284"
    }
```

```diff
    contract Conduit Multisig 1 (eth:0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) [GnosisSafe] {
    +++ description: None
      sourceHashes.1:
-        "0xd42bbf9f7dcd3720a7fc6bdc6edfdfae8800a37d6dd4decfa0ef6ca4a2e88940"
+        "0x22c7fb8365a538c05d34b77dd9c1967d1ddb7427eda69f84989d4c56603312b7"
      deployerAddress:
+        "eth:0x0954eC5B731501abf85766B5c6f5DE4C2B60BC44"
    }
```

```diff
    contract ProxyAdmin (eth:0x5306B2A086d477eCc7302447519dA688f9176e3D) [global/ProxyAdmin] {
    +++ description: None
      deployerAddress:
+        "eth:0x58Cb6D59Cf449f2fF149cCac1746aD9D9F3c55dc"
    }
```

```diff
    contract DisputeGameFactory (eth:0x5931f05809932a43C2A6c86f3F9BC2788f840b1C) [opstack/DisputeGameFactory] {
    +++ description: The dispute game factory allows the creation of dispute games, used to propose state roots and eventually challenge them.
      sourceHashes.1:
-        "0x19f3f7c7ee3977705261bfb86f826d5f97b885796f2246be7cc3e815c3e95dca"
+        "0x7daf6049672fd2ab7dc8dd3b6287e1d0a40958346c5e2857c4616a73dcac4da6"
      deployerAddress:
+        "eth:0x58Cb6D59Cf449f2fF149cCac1746aD9D9F3c55dc"
    }
```

```diff
    contract OptimismMintableERC20Factory (eth:0x6201ED1a86d680B443f44382964ceCf83BEb9c2F) [opstack/OptimismMintableERC20Factory] {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintableERC20 as this chain's representation of a token on the host chain, or vice-versa.
      sourceHashes.1:
-        "0x25bad2bdb7df4347412a48e271dea1489299460192b43b8ca52ed191b4940992"
+        "0x307d4cb83e682629880fe9bb874a188805e3b93cb11a2cbf80095975f1e5b04e"
      deployerAddress:
+        "eth:0x58Cb6D59Cf449f2fF149cCac1746aD9D9F3c55dc"
    }
```

```diff
    contract DelayedWETH (eth:0x643207A886613F651A9D4c49138c761c61C5df3B) [opstack/DelayedWETH] {
    +++ description: Contract designed to hold the bonded ETH for each game. It is designed as a wrapper around WETH to allow an owner to function as a backstop if a game would incorrectly distribute funds.
      sourceHashes.1:
-        "0x6ad951c662b7a889a64dd91252b0b8bc9694fd4df15a08bdec6693673a44dda1"
+        "0xee6bf3279fe5b849ed7e945391e2f05982b56336bdd0c0764e365d9efe3a70b9"
      deployerAddress:
+        "eth:0x81175155D85377C337d92f1FA52Da166C3A4E7Ac"
    }
```

```diff
    contract MIPS (eth:0x6463dEE3828677F6270d83d45408044fc5eDB908) [opstack/MIPS] {
    +++ description: The MIPS contract is used to execute the final step of the dispute game which objectively determines the winner of the dispute.
      sourceHashes.0:
-        "0xff203abbbb6edba7fff3caefb2752c4e7b786992b19c4f0f8ab568bc0a5fbf04"
+        "0x4a578c18a0b50fb7778c6a6b805dcb18427478d4002c8f7f28c2146dcfbf3a33"
      deployerAddress:
+        "eth:0x1D0519EeD308BcD49e4ebc149284F83ebC275284"
    }
```

```diff
    contract PermissionedDisputeGame (eth:0x64A42dB261E1a19a56C51E541F45b42139a4488a) [opstack/PermissionedDisputeGame] {
    +++ description: Same as FaultDisputeGame, but only two permissioned addresses are designated as proposer and challenger.
      sourceHashes.0:
-        "0x284eddae8c2726c3558d3ce1656fcd222947612b13d4d440519d6a82fc68acec"
+        "0x23375b62bc80656613e6e37217856dbef4aa805d14edc5827ca5e26e87cf4af4"
      deployerAddress:
+        "eth:0x81175155D85377C337d92f1FA52Da166C3A4E7Ac"
    }
```

```diff
    contract L1CrossDomainMessenger (eth:0x793c90d3f04ac72Cc7E46Faa8AcaDEA0A10e8D52) [opstack/L1CrossDomainMessenger] {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      sourceHashes.1:
-        "0xfa9c986019a03bd66efb7584a7064e708f6fb71956643a9d4daa2c0972a29c03"
+        "0x1f2c13ad1144ce6548e578b834c33b0d65b1564aeb0d5c708ed4e7fb50535cc6"
      deployerAddress:
+        "eth:0x58Cb6D59Cf449f2fF149cCac1746aD9D9F3c55dc"
    }
```

```diff
    contract OptimismPortal2 (eth:0x7b96e2c80696D5D2d673f0EA62b67352E18747C0) [opstack/OptimismPortal2] {
    +++ description: The OptimismPortal contract is the main entry point to deposit funds from L1 to L2. It also allows to prove and finalize withdrawals. It specifies which game type can be used for withdrawals, which currently is the PermissionedDisputeGame.
      sourceHashes.1:
-        "0xec3fef2865ee3bd465fea37851bfc490f143eba36d1e45d220832d39770aa8f2"
+        "0x3e7e2cb08ba995795937c9c2e8ea9d0e4d2e2de852f389055073384d5f79c59d"
      deployerAddress:
+        "eth:0x58Cb6D59Cf449f2fF149cCac1746aD9D9F3c55dc"
    }
```

```diff
    contract SystemConfig (eth:0x8a502d8EEa2Ed3e89c4D52DE51364688590cE591) [opstack/SystemConfig] {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      sourceHashes.1:
-        "0x09e12b8c0307a4da75a8b84ed7c88ced81e386ec09025ec5b36873b4f69614d0"
+        "0xaa1b3bedab4e63198240e9dea4503f0e615e4d18a545961c9f11b72143279fbc"
      deployerAddress:
+        "eth:0x58Cb6D59Cf449f2fF149cCac1746aD9D9F3c55dc"
    }
```

```diff
    contract AnchorStateRegistry (eth:0x92A4334C1B7876d3A6Fba0614ac3CECcF2121568) [opstack/AnchorStateRegistry_post13] {
    +++ description: Contains the latest confirmed state root that can be used as a starting point in a dispute game. It specifies which game type can be used for withdrawals, which currently is the PermissionedDisputeGame.
      sourceHashes.1:
-        "0x1601463fd2e47d8994c28a90b556c6933f38e8685214f702dc41a5ae08d9787c"
+        "0xf808a203af41f7932eb8e39985e56a7c75c940a260fb17d76d1003a3793281b5"
      deployerAddress:
+        "eth:0x81175155D85377C337d92f1FA52Da166C3A4E7Ac"
    }
```

```diff
    contract ProxyAdmin (eth:0xb4899FF43Ae727B1E9CB19AC44660e4A43Fad0b5) [global/ProxyAdmin] {
    +++ description: None
      deployerAddress:
+        "eth:0x0a1C5E42e423fab63746d375B84d3Fe4cAf9b513"
    }
```

```diff
    contract L1StandardBridge (eth:0xDD72d0bD01Fc7BeCe4Cc0cFdD2be6a29b846B072) [opstack/L1StandardBridge] {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      sourceHashes.1:
-        "0x0114d3af66179d6404d14360203dc6bcf404f23e2db4ee1b5848e923e131bc00"
+        "0xcacd38e7b52353ad3463da40b7e7a29b028f95500a82590d2b8f8ffd26b83f6d"
      deployerAddress:
+        "eth:0x58Cb6D59Cf449f2fF149cCac1746aD9D9F3c55dc"
    }
```

```diff
    contract AddressManager (eth:0xe86C1ea70e6ef0D9EBBe303aAFAbc4a7369669Fc) [opstack/AddressManager] {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      deployerAddress:
+        "eth:0x58Cb6D59Cf449f2fF149cCac1746aD9D9F3c55dc"
    }
```

```diff
    contract L1ERC721Bridge (eth:0xeA869DCE9Fd2Fdda1ec61492662dD715755b24E1) [opstack/L1ERC721Bridge] {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      sourceHashes.1:
-        "0x75cd470a9d1c1afc343b599b1c14731f55bb36fe8a4e844ddb88a0b791918795"
+        "0x1f65fda230b6d0df44e466b06418b2e12a401ef82c07521ad18d2f4ae6c70fb2"
      deployerAddress:
+        "eth:0x58Cb6D59Cf449f2fF149cCac1746aD9D9F3c55dc"
    }
```

Generated with discovered.json: 0xed229fd8517ed68cab8c680903ca9c450aa68e47

# Diff at Tue, 05 May 2026 15:18:53 GMT:

- author: vincfurc (<vincfurc@users.noreply.github.com>)
- comparing to: main@c30884758a8f4ef4178d2eb572fb25911670bcff block: 1769787652
- current timestamp: 1777994269

## Description

Conduit Multisig 1 (`eth:0x4a496227...`) — signer `0x381624F7` removed. Threshold unchanged at 4; total signers 13 → 12 (31% → 33%). Shared multisig (referenced by multiple Conduit-managed chains).

## Watched changes

```diff
    contract Conduit Multisig 1 (eth:0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      values.$members.1:
-        "eth:0x381624F7912BddD83dc67c6C53Ef6FE61B87Cf07"
      values.multisigThreshold:
-        "4 of 13 (31%)"
+        "4 of 12 (33%)"
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1769787652 (main branch discovery), not current.

```diff
    contract SuperchainConfig (eth:0x097f99768A0a4a0A81bAbbCB1ea18193bA9D53cC) {
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages pause states for each chain connected to it, as well as a global pause state for all chains. The guardian role can pause either separately, but each pause expires after 3mo 1d if left untouched.
      deployerAddress:
-        "eth:0x0a1C5E42e423fab63746d375B84d3Fe4cAf9b513"
    }
```

```diff
    contract PreimageOracle (eth:0x1fb8cdFc6831fc866Ed9C51aF8817Da5c287aDD3) {
    +++ description: The PreimageOracle contract is used to load the required data from L1 for a dispute game.
      deployerAddress:
-        "eth:0x1D0519EeD308BcD49e4ebc149284F83ebC275284"
    }
```

```diff
    contract Conduit Multisig 1 (eth:0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      deployerAddress:
-        "eth:0x0954eC5B731501abf85766B5c6f5DE4C2B60BC44"
    }
```

```diff
    contract ProxyAdmin (eth:0x5306B2A086d477eCc7302447519dA688f9176e3D) {
    +++ description: None
      deployerAddress:
-        "eth:0x58Cb6D59Cf449f2fF149cCac1746aD9D9F3c55dc"
    }
```

```diff
    contract DisputeGameFactory (eth:0x5931f05809932a43C2A6c86f3F9BC2788f840b1C) {
    +++ description: The dispute game factory allows the creation of dispute games, used to propose state roots and eventually challenge them.
      deployerAddress:
-        "eth:0x58Cb6D59Cf449f2fF149cCac1746aD9D9F3c55dc"
    }
```

```diff
    contract OptimismMintableERC20Factory (eth:0x6201ED1a86d680B443f44382964ceCf83BEb9c2F) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintableERC20 as this chain's representation of a token on the host chain, or vice-versa.
      deployerAddress:
-        "eth:0x58Cb6D59Cf449f2fF149cCac1746aD9D9F3c55dc"
    }
```

```diff
    contract DelayedWETH (eth:0x643207A886613F651A9D4c49138c761c61C5df3B) {
    +++ description: Contract designed to hold the bonded ETH for each game. It is designed as a wrapper around WETH to allow an owner to function as a backstop if a game would incorrectly distribute funds.
      deployerAddress:
-        "eth:0x81175155D85377C337d92f1FA52Da166C3A4E7Ac"
    }
```

```diff
    contract MIPS (eth:0x6463dEE3828677F6270d83d45408044fc5eDB908) {
    +++ description: The MIPS contract is used to execute the final step of the dispute game which objectively determines the winner of the dispute.
      deployerAddress:
-        "eth:0x1D0519EeD308BcD49e4ebc149284F83ebC275284"
    }
```

```diff
    contract PermissionedDisputeGame (eth:0x64A42dB261E1a19a56C51E541F45b42139a4488a) {
    +++ description: Same as FaultDisputeGame, but only two permissioned addresses are designated as proposer and challenger.
      deployerAddress:
-        "eth:0x81175155D85377C337d92f1FA52Da166C3A4E7Ac"
    }
```

```diff
    contract L1CrossDomainMessenger (eth:0x793c90d3f04ac72Cc7E46Faa8AcaDEA0A10e8D52) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      deployerAddress:
-        "eth:0x58Cb6D59Cf449f2fF149cCac1746aD9D9F3c55dc"
    }
```

```diff
    contract OptimismPortal2 (eth:0x7b96e2c80696D5D2d673f0EA62b67352E18747C0) {
    +++ description: The OptimismPortal contract is the main entry point to deposit funds from L1 to L2. It also allows to prove and finalize withdrawals. It specifies which game type can be used for withdrawals, which currently is the PermissionedDisputeGame.
      deployerAddress:
-        "eth:0x58Cb6D59Cf449f2fF149cCac1746aD9D9F3c55dc"
    }
```

```diff
    contract SystemConfig (eth:0x8a502d8EEa2Ed3e89c4D52DE51364688590cE591) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      deployerAddress:
-        "eth:0x58Cb6D59Cf449f2fF149cCac1746aD9D9F3c55dc"
    }
```

```diff
    contract AnchorStateRegistry (eth:0x92A4334C1B7876d3A6Fba0614ac3CECcF2121568) {
    +++ description: Contains the latest confirmed state root that can be used as a starting point in a dispute game. It specifies which game type can be used for withdrawals, which currently is the PermissionedDisputeGame.
      deployerAddress:
-        "eth:0x81175155D85377C337d92f1FA52Da166C3A4E7Ac"
    }
```

```diff
    contract ProxyAdmin (eth:0xb4899FF43Ae727B1E9CB19AC44660e4A43Fad0b5) {
    +++ description: None
      deployerAddress:
-        "eth:0x0a1C5E42e423fab63746d375B84d3Fe4cAf9b513"
    }
```

```diff
    contract L1StandardBridge (eth:0xDD72d0bD01Fc7BeCe4Cc0cFdD2be6a29b846B072) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      deployerAddress:
-        "eth:0x58Cb6D59Cf449f2fF149cCac1746aD9D9F3c55dc"
    }
```

```diff
    contract AddressManager (eth:0xe86C1ea70e6ef0D9EBBe303aAFAbc4a7369669Fc) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      deployerAddress:
-        "eth:0x58Cb6D59Cf449f2fF149cCac1746aD9D9F3c55dc"
    }
```

```diff
    contract L1ERC721Bridge (eth:0xeA869DCE9Fd2Fdda1ec61492662dD715755b24E1) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      deployerAddress:
-        "eth:0x58Cb6D59Cf449f2fF149cCac1746aD9D9F3c55dc"
    }
```

Generated with discovered.json: 0xce570eb01aaf0fbdfec31b963c52eb47feb355f9

# Diff at Tue, 05 May 2026 10:22:30 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@b6437082b3ea8fb0d97f4474b1c3452a1ce271b0 block: 1769787652
- current timestamp: 1769787652

## Description

Include deployer address

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1769787652 (main branch discovery), not current.

```diff
    contract SuperchainConfig (eth:0x097f99768A0a4a0A81bAbbCB1ea18193bA9D53cC) {
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages pause states for each chain connected to it, as well as a global pause state for all chains. The guardian role can pause either separately, but each pause expires after 3mo 1d if left untouched.
      deployerAddress:
+        "eth:0x0a1C5E42e423fab63746d375B84d3Fe4cAf9b513"
    }
```

```diff
    contract PreimageOracle (eth:0x1fb8cdFc6831fc866Ed9C51aF8817Da5c287aDD3) {
    +++ description: The PreimageOracle contract is used to load the required data from L1 for a dispute game.
      deployerAddress:
+        "eth:0x1D0519EeD308BcD49e4ebc149284F83ebC275284"
    }
```

```diff
    contract Conduit Multisig 1 (eth:0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      deployerAddress:
+        "eth:0x0954eC5B731501abf85766B5c6f5DE4C2B60BC44"
    }
```

```diff
    contract ProxyAdmin (eth:0x5306B2A086d477eCc7302447519dA688f9176e3D) {
    +++ description: None
      deployerAddress:
+        "eth:0x58Cb6D59Cf449f2fF149cCac1746aD9D9F3c55dc"
    }
```

```diff
    contract DisputeGameFactory (eth:0x5931f05809932a43C2A6c86f3F9BC2788f840b1C) {
    +++ description: The dispute game factory allows the creation of dispute games, used to propose state roots and eventually challenge them.
      deployerAddress:
+        "eth:0x58Cb6D59Cf449f2fF149cCac1746aD9D9F3c55dc"
    }
```

```diff
    contract OptimismMintableERC20Factory (eth:0x6201ED1a86d680B443f44382964ceCf83BEb9c2F) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintableERC20 as this chain's representation of a token on the host chain, or vice-versa.
      deployerAddress:
+        "eth:0x58Cb6D59Cf449f2fF149cCac1746aD9D9F3c55dc"
    }
```

```diff
    contract DelayedWETH (eth:0x643207A886613F651A9D4c49138c761c61C5df3B) {
    +++ description: Contract designed to hold the bonded ETH for each game. It is designed as a wrapper around WETH to allow an owner to function as a backstop if a game would incorrectly distribute funds.
      deployerAddress:
+        "eth:0x81175155D85377C337d92f1FA52Da166C3A4E7Ac"
    }
```

```diff
    contract MIPS (eth:0x6463dEE3828677F6270d83d45408044fc5eDB908) {
    +++ description: The MIPS contract is used to execute the final step of the dispute game which objectively determines the winner of the dispute.
      deployerAddress:
+        "eth:0x1D0519EeD308BcD49e4ebc149284F83ebC275284"
    }
```

```diff
    contract PermissionedDisputeGame (eth:0x64A42dB261E1a19a56C51E541F45b42139a4488a) {
    +++ description: Same as FaultDisputeGame, but only two permissioned addresses are designated as proposer and challenger.
      deployerAddress:
+        "eth:0x81175155D85377C337d92f1FA52Da166C3A4E7Ac"
    }
```

```diff
    contract L1CrossDomainMessenger (eth:0x793c90d3f04ac72Cc7E46Faa8AcaDEA0A10e8D52) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      deployerAddress:
+        "eth:0x58Cb6D59Cf449f2fF149cCac1746aD9D9F3c55dc"
    }
```

```diff
    contract OptimismPortal2 (eth:0x7b96e2c80696D5D2d673f0EA62b67352E18747C0) {
    +++ description: The OptimismPortal contract is the main entry point to deposit funds from L1 to L2. It also allows to prove and finalize withdrawals. It specifies which game type can be used for withdrawals, which currently is the PermissionedDisputeGame.
      deployerAddress:
+        "eth:0x58Cb6D59Cf449f2fF149cCac1746aD9D9F3c55dc"
    }
```

```diff
    contract SystemConfig (eth:0x8a502d8EEa2Ed3e89c4D52DE51364688590cE591) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      deployerAddress:
+        "eth:0x58Cb6D59Cf449f2fF149cCac1746aD9D9F3c55dc"
    }
```

```diff
    contract AnchorStateRegistry (eth:0x92A4334C1B7876d3A6Fba0614ac3CECcF2121568) {
    +++ description: Contains the latest confirmed state root that can be used as a starting point in a dispute game. It specifies which game type can be used for withdrawals, which currently is the PermissionedDisputeGame.
      deployerAddress:
+        "eth:0x81175155D85377C337d92f1FA52Da166C3A4E7Ac"
    }
```

```diff
    contract ProxyAdmin (eth:0xb4899FF43Ae727B1E9CB19AC44660e4A43Fad0b5) {
    +++ description: None
      deployerAddress:
+        "eth:0x0a1C5E42e423fab63746d375B84d3Fe4cAf9b513"
    }
```

```diff
    contract L1StandardBridge (eth:0xDD72d0bD01Fc7BeCe4Cc0cFdD2be6a29b846B072) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      deployerAddress:
+        "eth:0x58Cb6D59Cf449f2fF149cCac1746aD9D9F3c55dc"
    }
```

```diff
    contract AddressManager (eth:0xe86C1ea70e6ef0D9EBBe303aAFAbc4a7369669Fc) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      deployerAddress:
+        "eth:0x58Cb6D59Cf449f2fF149cCac1746aD9D9F3c55dc"
    }
```

```diff
    contract L1ERC721Bridge (eth:0xeA869DCE9Fd2Fdda1ec61492662dD715755b24E1) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      deployerAddress:
+        "eth:0x58Cb6D59Cf449f2fF149cCac1746aD9D9F3c55dc"
    }
```

Generated with discovered.json: 0x242e6259596132b55f433f1010f1d432d9cee45d

# Diff at Fri, 13 Feb 2026 11:33:16 GMT:

- author: vincfurc (<vincfurc@users.noreply.github.com>)
- comparing to: main@55ab80636f1e0c000e757a7a146f11035a19e9c0 block: 1769787652
- current timestamp: 1769787652

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1769787652 (main branch discovery), not current.

```diff
    contract DisputeGameFactory (eth:0x5931f05809932a43C2A6c86f3F9BC2788f840b1C) {
    +++ description: The dispute game factory allows the creation of dispute games, used to propose state roots and eventually challenge them.
      values.challengerFromDGF:
+        "UNRESOLVED"
      values.permissionedGameArgs:
+        "0x"
      values.proposerFromDGF:
+        "UNRESOLVED"
      values.wethFromDGF:
+        "UNRESOLVED"
      usedTypes:
+        [{"typeCaster":"SliceAddress","arg":{"offset":124}},{"typeCaster":"SliceAddress","arg":{"offset":144}},{"typeCaster":"SliceAddress","arg":{"offset":72}}]
    }
```

Generated with discovered.json: 0x595fb9d8388837dfd0e8a949e1499adc59c265e2

# Diff at Fri, 30 Jan 2026 15:41:57 GMT:

- author: vincfurc (<vincfurc@users.noreply.github.com>)
- current timestamp: 1769787652

## Description

Discovery rerun on the same block number with only config-related changes.

## Initial discovery

```diff
+   Status: CREATED
    contract SuperchainConfig (eth:0x097f99768A0a4a0A81bAbbCB1ea18193bA9D53cC)
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages pause states for each chain connected to it, as well as a global pause state for all chains. The guardian role can pause either separately, but each pause expires after 3mo 1d if left untouched.
```

```diff
+   Status: CREATED
    contract PreimageOracle (eth:0x1fb8cdFc6831fc866Ed9C51aF8817Da5c287aDD3)
    +++ description: The PreimageOracle contract is used to load the required data from L1 for a dispute game.
```

```diff
+   Status: CREATED
    contract Conduit Multisig 1 (eth:0x4a4962275DF8C60a80d3a25faEc5AA7De116A746)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyAdmin (eth:0x5306B2A086d477eCc7302447519dA688f9176e3D)
    +++ description: None
```

```diff
+   Status: CREATED
    contract DisputeGameFactory (eth:0x5931f05809932a43C2A6c86f3F9BC2788f840b1C)
    +++ description: The dispute game factory allows the creation of dispute games, used to propose state roots and eventually challenge them.
```

```diff
+   Status: CREATED
    contract OptimismMintableERC20Factory (eth:0x6201ED1a86d680B443f44382964ceCf83BEb9c2F)
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintableERC20 as this chain's representation of a token on the host chain, or vice-versa.
```

```diff
+   Status: CREATED
    contract DelayedWETH (eth:0x643207A886613F651A9D4c49138c761c61C5df3B)
    +++ description: Contract designed to hold the bonded ETH for each game. It is designed as a wrapper around WETH to allow an owner to function as a backstop if a game would incorrectly distribute funds.
```

```diff
+   Status: CREATED
    contract MIPS (eth:0x6463dEE3828677F6270d83d45408044fc5eDB908)
    +++ description: The MIPS contract is used to execute the final step of the dispute game which objectively determines the winner of the dispute.
```

```diff
+   Status: CREATED
    contract PermissionedDisputeGame (eth:0x64A42dB261E1a19a56C51E541F45b42139a4488a)
    +++ description: Same as FaultDisputeGame, but only two permissioned addresses are designated as proposer and challenger.
```

```diff
+   Status: CREATED
    contract L1CrossDomainMessenger (eth:0x793c90d3f04ac72Cc7E46Faa8AcaDEA0A10e8D52)
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
```

```diff
+   Status: CREATED
    contract OptimismPortal2 (eth:0x7b96e2c80696D5D2d673f0EA62b67352E18747C0)
    +++ description: The OptimismPortal contract is the main entry point to deposit funds from L1 to L2. It also allows to prove and finalize withdrawals. It specifies which game type can be used for withdrawals, which currently is the PermissionedDisputeGame.
```

```diff
+   Status: CREATED
    contract SystemConfig (eth:0x8a502d8EEa2Ed3e89c4D52DE51364688590cE591)
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
```

```diff
+   Status: CREATED
    contract AnchorStateRegistry (eth:0x92A4334C1B7876d3A6Fba0614ac3CECcF2121568)
    +++ description: Contains the latest confirmed state root that can be used as a starting point in a dispute game. It specifies which game type can be used for withdrawals, which currently is the PermissionedDisputeGame.
```

```diff
+   Status: CREATED
    contract ProxyAdmin (eth:0xb4899FF43Ae727B1E9CB19AC44660e4A43Fad0b5)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1StandardBridge (eth:0xDD72d0bD01Fc7BeCe4Cc0cFdD2be6a29b846B072)
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
```

```diff
+   Status: CREATED
    contract AddressManager (eth:0xe86C1ea70e6ef0D9EBBe303aAFAbc4a7369669Fc)
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
```

```diff
+   Status: CREATED
    contract L1ERC721Bridge (eth:0xeA869DCE9Fd2Fdda1ec61492662dD715755b24E1)
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
```
