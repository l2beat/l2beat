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
