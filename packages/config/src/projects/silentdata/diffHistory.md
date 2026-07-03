Generated with discovered.json: 0x871210b01eed285873bd5d7563e1f0c58c776ab4

# Diff at Tue, 09 Jun 2026 12:43:39 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@ae67a38d37457ad735e5d55080d2e5479d5df7dc block: 1765551112
- current timestamp: 1765551112

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1765551112 (main branch discovery), not current.

```diff
    EOA  (eth:0x3e3F6b6010237678723a33aE227d167B55888C20) {
    +++ description: None
      receivedPermissions.0.description:
+        "Allowed to post new state roots of the current layer to the host chain."
      receivedPermissions.0.permission:
-        "propose"
+        "interact"
    }
```

```diff
    contract Safe (eth:0x90f72cB63E608dD6c63793b7d90804963b478ccd) [GnosisSafe] {
    +++ description: None
      receivedPermissions.0.description:
+        "Allowed to pause withdrawals. In op stack systems with a proof system, the Guardian can also blacklist dispute games and set the respected game type (permissioned / permissionless)."
      receivedPermissions.0.permission:
-        "guard"
+        "interact"
    }
```

```diff
    EOA  (eth:0xCa4c95A5A1660D14df8EC6C53537964f9c5367C7) {
    +++ description: None
      receivedPermissions.0.description:
+        "Allowed to commit transactions from the current layer to the host chain."
      receivedPermissions.0.permission:
-        "sequence"
+        "interact"
    }
```

```diff
    EOA  (eth:0xD04464568a8a8A5da8c9218714e6d9f4BD40DF65) {
    +++ description: None
      receivedPermissions.0.description:
+        "Allowed to challenge or delete state roots proposed by a Proposer."
      receivedPermissions.0.permission:
-        "challenge"
+        "interact"
    }
```

Generated with discovered.json: 0x159d9662481823da946d2fbaded2b2570ec0e630

# Diff at Fri, 08 May 2026 07:52:21 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@488d190650457a1fba9b18a83f14a17ab8b2c84c block: 1765551112
- current timestamp: 1765551112

## Description

Use the new flattener implementation

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1765551112 (main branch discovery), not current.

```diff
    contract OptimismMintableERC20Factory (eth:0x00e3001F111ba89F20a8336Bb986a78d8f734E7E) [opstack/OptimismMintableERC20Factory] {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintableERC20 as this chain's representation of a token on the host chain, or vice-versa.
      sourceHashes.1:
-        "0x9650b4bba6299e410f01a369a95a2c57e1c3ca35f0d80c13f4f59fc468f370e5"
+        "0x38811adfaa2c3c1a79fd731951dfcb607841950cdc119cd765fadcc62bc8e61d"
    }
```

```diff
    contract DisputeGameFactory (eth:0x139Cf05B34D0EC49D3BFB9704EC4cEbA6ae95dD1) [opstack/DisputeGameFactory] {
    +++ description: The dispute game factory allows the creation of dispute games, used to propose state roots and eventually challenge them.
      sourceHashes.1:
-        "0x85ca17941ef36ac6b28a4f8f89803d0d41ef419c47586dcd3acdb47ee9617285"
+        "0xfbbe43e439b6631cf110db5ab40bb632fbb1e89cc43125e59a52305d4307e429"
    }
```

```diff
    contract PermissionedDisputeGame (eth:0x1B99b322085dA031e68C1202fdB756b3FFbaC7A6) [opstack/PermissionedDisputeGame] {
    +++ description: Same as FaultDisputeGame, but only two permissioned addresses are designated as proposer and challenger.
      sourceHashes.0:
-        "0x0a442058af95748cc6199d889a46c775f9f6f4d29a61df5124ceb93ff631074d"
+        "0x0865e7c3caf7894a1b91d8420844e95bfde27db825f297d0aab90aa1d46fd5d9"
    }
```

```diff
    contract PreimageOracle (eth:0x1fb8cdFc6831fc866Ed9C51aF8817Da5c287aDD3) [opstack/PreimageOracle] {
    +++ description: The PreimageOracle contract is used to load the required data from L1 for a dispute game.
      sourceHashes.0:
-        "0xd9838f1f137bd5397f583f33c414ec9c0fc3dc69401213fae0f09c36d4ac8e47"
+        "0x16701fcaa0e04e5481701a81736e7c8ee2c8aa32da272bf74e0589e6a90c3615"
    }
```

```diff
    contract AnchorStateRegistry (eth:0x1ffFf41f5E6384D6737D27B1F471E69212150e55) [opstack/AnchorStateRegistry] {
    +++ description: Contains the latest confirmed state root that can be used as a starting point in a dispute game.
      sourceHashes.1:
-        "0x5d50c259a38eef46641553e8ec1910a443c1b25062ea558d0b3e0bc7218adae1"
+        "0x5994cf601fe1082877a6b5e5c804511df86a7e532b6a509236b8707a2393517a"
    }
```

```diff
    contract DelayedWETH (eth:0x2DDf646eaaac38AEA031268a07de4E9ff1D967bd) [opstack/DelayedWETH] {
    +++ description: Contract designed to hold the bonded ETH for each game. It is designed as a wrapper around WETH to allow an owner to function as a backstop if a game would incorrectly distribute funds.
      sourceHashes.1:
-        "0x1c7d0fda5ed6d8fc7f5b5f7df5e307f0fcfd173fa5833ea9fce8875d5d44d86a"
+        "0xab80c8a5584b65d2ff6b730e9d93b954abfd1eb823ef737f3a3a2cb2be0cf07e"
    }
```

```diff
    contract L1CrossDomainMessenger (eth:0x3131b01DF2F9eF6F42113090Edead5c97612c473) [opstack/L1CrossDomainMessenger] {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      sourceHashes.1:
-        "0xfaa50769db48b1d2c04c06a8a0a4771b87b3c0ff20a508115bfdb2b576fdb454"
+        "0x03131d801162a21556019f80cf9d7a305762eac7a92072aff72e06964be7903f"
    }
```

```diff
    contract SuperchainConfig (eth:0x50F08E501f8A9D124eaB4990b057fDEfE3F6ae3E) [opstack/SuperchainConfigFake] {
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      sourceHashes.1:
-        "0x03dba37173051b02bc81487e181c791bcf1aef664c249e5d035f11f488bdd686"
+        "0xde74738fcd4f62744e6f08252b2f44de58e31a582bdb2b6fa9e05b5b723f0ae7"
    }
```

```diff
    contract SystemConfig (eth:0x5c3Efe3cA554816E9960C02AE3B4EB3A9a8D2E16) [opstack/SystemConfig] {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      sourceHashes.1:
-        "0x6e293d82eb36a83fb5d8b06268cd4fbf46027b87eea77fcc68f78e4b010a3774"
+        "0xbb8f5f75035cc1b5b80a43723a5abfd8c84416e8ab5aa4d5b67dc90231b9639b"
    }
```

```diff
    contract Safe (eth:0x61E7D85244Db59e0c03D8C82A0c8ABA78BcBa6Af) [GnosisSafe] {
    +++ description: None
      sourceHashes.1:
-        "0x7d388119a66f3eae147d748f86136f073d907d6b36f7e87e9363c4c7a2899a8a"
+        "0xe23c519b7324d6dc9132c8567ac55ae72bdf168c914d22825c7614d822364b0f"
    }
```

```diff
    contract L1ERC721Bridge (eth:0x74A3065E6A4FFAA07dAC542E28452995f3c32EeA) [opstack/L1ERC721Bridge] {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      sourceHashes.1:
-        "0x9de28f19e0d1200bf0afda5ab90c9d2dffa44a775e71cfe9232ee1808338996c"
+        "0x827908a1ae39059a43a39fdadfae74b1165afe71814fdca6c42a1581da796446"
    }
```

```diff
    contract Safe (eth:0x90f72cB63E608dD6c63793b7d90804963b478ccd) [GnosisSafe] {
    +++ description: None
      sourceHashes.1:
-        "0x7d388119a66f3eae147d748f86136f073d907d6b36f7e87e9363c4c7a2899a8a"
+        "0xe23c519b7324d6dc9132c8567ac55ae72bdf168c914d22825c7614d822364b0f"
    }
```

```diff
    contract MIPS (eth:0xaA59A0777648BC75cd10364083e878c1cCd6112a) [opstack/MIPS] {
    +++ description: The MIPS contract is used to execute the final step of the dispute game which objectively determines the winner of the dispute.
      sourceHashes.0:
-        "0xee3a1122871bc9fb46239036b055832fd091a7bb04a848208c582bf47b5d37a0"
+        "0xcd4e3fb86e322e49885119fd0881d3bdaebf38d4cf1ca2a5584c685acb76421c"
    }
```

```diff
    contract OptimismPortal2 (eth:0xCcd285b1ccf1cdaB36Da995B9fC68870E287694E) [opstack/OptimismPortal2] {
    +++ description: The OptimismPortal contract is the main entry point to deposit funds from L1 to L2. It also allows to prove and finalize withdrawals. It specifies which game type can be used for withdrawals, which currently is the PermissionedDisputeGame.
      sourceHashes.1:
-        "0x67ee16b5b6c32cdcc862bea390e45017908e6945cfaa01d3ef75dc9de7c9d946"
+        "0x1ead4d29895a9ce6ad3f5108e5c36e86c33bfc5dd1a44459c431c6c77557d05b"
    }
```

```diff
    contract Safe (eth:0xE512f69D8aEed75c737190F4dB84687FBa7C5e88) [GnosisSafe] {
    +++ description: None
      sourceHashes.1:
-        "0x7d388119a66f3eae147d748f86136f073d907d6b36f7e87e9363c4c7a2899a8a"
+        "0xe23c519b7324d6dc9132c8567ac55ae72bdf168c914d22825c7614d822364b0f"
    }
```

```diff
    contract L1StandardBridge (eth:0xe97d73B0079e04f4ea4162b9173604a6213eF158) [opstack/L1StandardBridge] {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      sourceHashes.1:
-        "0x4a2d83507f25be218f504b76815e4494138af88734cc54d34666c631aea88af5"
+        "0x00acd2cc74c24c20807330313139b19b195c3667e5df2e5f3404edfb917aa6a3"
    }
```

Generated with discovered.json: 0x2d20e6e62e7dce88527f87b6e909b40db8817417

# Diff at Tue, 05 May 2026 10:23:06 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@b6437082b3ea8fb0d97f4474b1c3452a1ce271b0 block: 1765551112
- current timestamp: 1765551112

## Description

Include deployer address

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1765551112 (main branch discovery), not current.

```diff
    contract OptimismMintableERC20Factory (eth:0x00e3001F111ba89F20a8336Bb986a78d8f734E7E) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintableERC20 as this chain's representation of a token on the host chain, or vice-versa.
      deployerAddress:
+        "eth:0xF29a1335F914bf355D4f5cB5366a2BB1EA575e86"
    }
```

```diff
    contract DisputeGameFactory (eth:0x139Cf05B34D0EC49D3BFB9704EC4cEbA6ae95dD1) {
    +++ description: The dispute game factory allows the creation of dispute games, used to propose state roots and eventually challenge them.
      deployerAddress:
+        "eth:0xF29a1335F914bf355D4f5cB5366a2BB1EA575e86"
    }
```

```diff
    contract PermissionedDisputeGame (eth:0x1B99b322085dA031e68C1202fdB756b3FFbaC7A6) {
    +++ description: Same as FaultDisputeGame, but only two permissioned addresses are designated as proposer and challenger.
      deployerAddress:
+        "eth:0xF29a1335F914bf355D4f5cB5366a2BB1EA575e86"
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
    contract AnchorStateRegistry (eth:0x1ffFf41f5E6384D6737D27B1F471E69212150e55) {
    +++ description: Contains the latest confirmed state root that can be used as a starting point in a dispute game.
      deployerAddress:
+        "eth:0xF29a1335F914bf355D4f5cB5366a2BB1EA575e86"
    }
```

```diff
    contract DelayedWETH (eth:0x2DDf646eaaac38AEA031268a07de4E9ff1D967bd) {
    +++ description: Contract designed to hold the bonded ETH for each game. It is designed as a wrapper around WETH to allow an owner to function as a backstop if a game would incorrectly distribute funds.
      deployerAddress:
+        "eth:0xF29a1335F914bf355D4f5cB5366a2BB1EA575e86"
    }
```

```diff
    contract L1CrossDomainMessenger (eth:0x3131b01DF2F9eF6F42113090Edead5c97612c473) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      deployerAddress:
+        "eth:0xF29a1335F914bf355D4f5cB5366a2BB1EA575e86"
    }
```

```diff
    contract SuperchainConfig (eth:0x50F08E501f8A9D124eaB4990b057fDEfE3F6ae3E) {
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      deployerAddress:
+        "eth:0xF29a1335F914bf355D4f5cB5366a2BB1EA575e86"
    }
```

```diff
    contract SystemConfig (eth:0x5c3Efe3cA554816E9960C02AE3B4EB3A9a8D2E16) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      deployerAddress:
+        "eth:0xF29a1335F914bf355D4f5cB5366a2BB1EA575e86"
    }
```

```diff
    contract Safe (eth:0x61E7D85244Db59e0c03D8C82A0c8ABA78BcBa6Af) {
    +++ description: None
      deployerAddress:
+        "eth:0xeda455B5F0727Db1A13f849ea372b6110b7c2C42"
    }
```

```diff
    contract L1ERC721Bridge (eth:0x74A3065E6A4FFAA07dAC542E28452995f3c32EeA) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      deployerAddress:
+        "eth:0xF29a1335F914bf355D4f5cB5366a2BB1EA575e86"
    }
```

```diff
    contract Safe (eth:0x90f72cB63E608dD6c63793b7d90804963b478ccd) {
    +++ description: None
      deployerAddress:
+        "eth:0xeda455B5F0727Db1A13f849ea372b6110b7c2C42"
    }
```

```diff
    contract ProxyAdmin (eth:0xa78F3521D5aDF038826f0FE3e809DF64Ec8a241D) {
    +++ description: None
      deployerAddress:
+        "eth:0xF29a1335F914bf355D4f5cB5366a2BB1EA575e86"
    }
```

```diff
    contract MIPS (eth:0xaA59A0777648BC75cd10364083e878c1cCd6112a) {
    +++ description: The MIPS contract is used to execute the final step of the dispute game which objectively determines the winner of the dispute.
      deployerAddress:
+        "eth:0x1D0519EeD308BcD49e4ebc149284F83ebC275284"
    }
```

```diff
    contract OptimismPortal2 (eth:0xCcd285b1ccf1cdaB36Da995B9fC68870E287694E) {
    +++ description: The OptimismPortal contract is the main entry point to deposit funds from L1 to L2. It also allows to prove and finalize withdrawals. It specifies which game type can be used for withdrawals, which currently is the PermissionedDisputeGame.
      deployerAddress:
+        "eth:0xF29a1335F914bf355D4f5cB5366a2BB1EA575e86"
    }
```

```diff
    contract ProxyAdmin (eth:0xd8eAb3ed39Df0afB9BFD853f49637F7E73963966) {
    +++ description: None
      deployerAddress:
+        "eth:0xF29a1335F914bf355D4f5cB5366a2BB1EA575e86"
    }
```

```diff
    contract AddressManager (eth:0xDD05146D14613BDC6a6cad371d15f1aE4269480e) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      deployerAddress:
+        "eth:0xF29a1335F914bf355D4f5cB5366a2BB1EA575e86"
    }
```

```diff
    contract Safe (eth:0xE512f69D8aEed75c737190F4dB84687FBa7C5e88) {
    +++ description: None
      deployerAddress:
+        "eth:0xeda455B5F0727Db1A13f849ea372b6110b7c2C42"
    }
```

```diff
    contract L1StandardBridge (eth:0xe97d73B0079e04f4ea4162b9173604a6213eF158) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      deployerAddress:
+        "eth:0xF29a1335F914bf355D4f5cB5366a2BB1EA575e86"
    }
```

Generated with discovered.json: 0x60738eff109ad49a0261c8a18857dc03a67ecf44

# Diff at Fri, 13 Feb 2026 11:33:21 GMT:

- author: vincfurc (<vincfurc@users.noreply.github.com>)
- comparing to: main@55ab80636f1e0c000e757a7a146f11035a19e9c0 block: 1765551112
- current timestamp: 1765551112

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1765551112 (main branch discovery), not current.

```diff
    contract DisputeGameFactory (eth:0x139Cf05B34D0EC49D3BFB9704EC4cEbA6ae95dD1) {
    +++ description: The dispute game factory allows the creation of dispute games, used to propose state roots and eventually challenge them.
      values.challengerFromDGF:
+        "UNRESOLVED"
      values.permissionedGameArgs:
+        "EXPECT_REVERT"
      values.proposerFromDGF:
+        "UNRESOLVED"
      values.wethFromDGF:
+        "UNRESOLVED"
      usedTypes:
+        [{"typeCaster":"SliceAddress","arg":{"offset":124}},{"typeCaster":"SliceAddress","arg":{"offset":144}},{"typeCaster":"SliceAddress","arg":{"offset":72}}]
    }
```

Generated with discovered.json: 0x775330dcd7d66c7c9d976af0b2ca6c27fb1dfbb0

# Diff at Fri, 12 Dec 2025 16:20:06 GMT:

- author: vincfurc (<vincfurc@users.noreply.github.com>)
- comparing to: main@d2235ef7f5c90cb4a3a617fea7d52a655dc22fa1 block: 1759407917
- current timestamp: 1765551112

## Description

Added game 42 to template.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1759407917 (main branch discovery), not current.

```diff
    contract DisputeGameFactory (eth:0x139Cf05B34D0EC49D3BFB9704EC4cEbA6ae95dD1) {
    +++ description: The dispute game factory allows the creation of dispute games, used to propose state roots and eventually challenge them.
+++ severity: HIGH
      values.game2000:
+        "eth:0x0000000000000000000000000000000000000000"
+++ severity: HIGH
      values.game42:
+        "eth:0x0000000000000000000000000000000000000000"
      values.initBondGame42:
+        0
      fieldMeta.game2000:
+        {"severity":"HIGH"}
      fieldMeta.game42:
+        {"severity":"HIGH"}
    }
```

Generated with discovered.json: 0x2f6ebd478e3cb2194d0a5d12107ee77b63de2277

# Diff at Tue, 04 Nov 2025 11:34:25 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@9ff7b62a511791b99f61b604fb6b56e4ea223bb0 block: 1759407917
- current timestamp: 1759407917

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1759407917 (main branch discovery), not current.

```diff
    contract PermissionedDisputeGame (eth:0x1B99b322085dA031e68C1202fdB756b3FFbaC7A6) {
    +++ description: Same as FaultDisputeGame, but only two permissioned addresses are designated as proposer and challenger.
      sourceHashes.0:
-        "0x7129ee348039f13e017c18c90ffcb319f67a8fdd3b4a5a28c39aabc8bf0c57f6"
+        "0x0a442058af95748cc6199d889a46c775f9f6f4d29a61df5124ceb93ff631074d"
    }
```

```diff
    contract MIPS (eth:0xaA59A0777648BC75cd10364083e878c1cCd6112a) {
    +++ description: The MIPS contract is used to execute the final step of the dispute game which objectively determines the winner of the dispute.
      sourceHashes.0:
-        "0x65fba25d8e4f3948f7d63aff835445e0f93ba92b8aa4e4f1bdfe6851a5d9476c"
+        "0xee3a1122871bc9fb46239036b055832fd091a7bb04a848208c582bf47b5d37a0"
    }
```

Generated with discovered.json: 0x34976051c3026062a28044947483fa8f7bbc6269

# Diff at Thu, 02 Oct 2025 12:26:28 GMT:

- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@bc66d9d4f7a557c1ee6b24a9705fc6b59b44a47b block: 1756971267
- current timestamp: 1759407917

## Description

Deployed Safe at address (which probably was pre-computed).

## Watched changes

```diff
    contract Safe (eth:0x61E7D85244Db59e0c03D8C82A0c8ABA78BcBa6Af) {
    +++ description: None
      type:
-        "EOA"
+        "Contract"
      proxyType:
-        "EOA"
+        "gnosis safe"
      name:
+        "Safe"
      template:
+        "GnosisSafe"
      sourceHashes:
+        ["0xfe0725afd3cf2e5fb7627005a6bcf13ef7e35f78034eed2211edbffdb6a9aab5","0x7d388119a66f3eae147d748f86136f073d907d6b36f7e87e9363c4c7a2899a8a"]
      sinceTimestamp:
+        1759223651
      sinceBlock:
+        23474844
      values:
+        {"$immutable":false,"$implementation":"eth:0x41675C099F32341bf84BFc5382aF534df5C7461a","$members":["eth:0xD02AB52D1C7CF31E3f72A007d969D5b80ad113D0","eth:0xf5280A5Ae8c9C8B97B624c8eb4B34B55aBe30e33","eth:0x486792B2D74545C1Aa3614ca0415025983a2f9Dc","eth:0xb9B3e5Aa67136790F1c4980683f39f16eE26E548","eth:0xf95d55523149E37F9ADa9A4828B1f77cA0339830"],"$threshold":2,"domainSeparator":"0x43cb652102be3238c78e02ed9b8e1e665312dbddff7b1f4f98c5c6e59c2f0a67","getChainId":1,"GnosisSafe_modules":[],"multisigThreshold":"2 of 5 (40%)","nonce":1,"VERSION":"1.4.1"}
      implementationNames:
+        {"eth:0x61E7D85244Db59e0c03D8C82A0c8ABA78BcBa6Af":"SafeProxy","eth:0x41675C099F32341bf84BFc5382aF534df5C7461a":"Safe"}
    }
```

```diff
    contract Safe (eth:0x90f72cB63E608dD6c63793b7d90804963b478ccd) {
    +++ description: None
      type:
-        "EOA"
+        "Contract"
      proxyType:
-        "EOA"
+        "gnosis safe"
      name:
+        "Safe"
      template:
+        "GnosisSafe"
      sourceHashes:
+        ["0xfe0725afd3cf2e5fb7627005a6bcf13ef7e35f78034eed2211edbffdb6a9aab5","0x7d388119a66f3eae147d748f86136f073d907d6b36f7e87e9363c4c7a2899a8a"]
      sinceTimestamp:
+        1759224011
      sinceBlock:
+        23474874
      values:
+        {"$immutable":false,"$implementation":"eth:0x41675C099F32341bf84BFc5382aF534df5C7461a","$members":["eth:0xD02AB52D1C7CF31E3f72A007d969D5b80ad113D0","eth:0xf5280A5Ae8c9C8B97B624c8eb4B34B55aBe30e33","eth:0x486792B2D74545C1Aa3614ca0415025983a2f9Dc","eth:0xb9B3e5Aa67136790F1c4980683f39f16eE26E548","eth:0xf95d55523149E37F9ADa9A4828B1f77cA0339830"],"$threshold":2,"domainSeparator":"0xa03fc76cde0d43f928a1476d0f54dce561b638263bf06ae6ab9fb81a07c849fa","getChainId":1,"GnosisSafe_modules":[],"multisigThreshold":"2 of 5 (40%)","nonce":1,"VERSION":"1.4.1"}
      implementationNames:
+        {"eth:0x90f72cB63E608dD6c63793b7d90804963b478ccd":"SafeProxy","eth:0x41675C099F32341bf84BFc5382aF534df5C7461a":"Safe"}
    }
```

```diff
    contract Safe (eth:0xE512f69D8aEed75c737190F4dB84687FBa7C5e88) {
    +++ description: None
      type:
-        "EOA"
+        "Contract"
      proxyType:
-        "EOA"
+        "gnosis safe"
      controlsMajorityOfUpgradePermissions:
-        true
      name:
+        "Safe"
      template:
+        "GnosisSafe"
      sourceHashes:
+        ["0xfe0725afd3cf2e5fb7627005a6bcf13ef7e35f78034eed2211edbffdb6a9aab5","0x7d388119a66f3eae147d748f86136f073d907d6b36f7e87e9363c4c7a2899a8a"]
      sinceTimestamp:
+        1759223963
      sinceBlock:
+        23474870
      values:
+        {"$immutable":false,"$implementation":"eth:0x41675C099F32341bf84BFc5382aF534df5C7461a","$members":["eth:0xD02AB52D1C7CF31E3f72A007d969D5b80ad113D0","eth:0xf5280A5Ae8c9C8B97B624c8eb4B34B55aBe30e33","eth:0x486792B2D74545C1Aa3614ca0415025983a2f9Dc","eth:0xb9B3e5Aa67136790F1c4980683f39f16eE26E548","eth:0xf95d55523149E37F9ADa9A4828B1f77cA0339830"],"$threshold":2,"domainSeparator":"0xee66177d4fcb8445b816cf77dd0262ff9f7b298578a68f07d40ac6b075a2f8b0","getChainId":1,"GnosisSafe_modules":[],"multisigThreshold":"2 of 5 (40%)","nonce":1,"VERSION":"1.4.1"}
      implementationNames:
+        {"eth:0xE512f69D8aEed75c737190F4dB84687FBa7C5e88":"SafeProxy","eth:0x41675C099F32341bf84BFc5382aF534df5C7461a":"Safe"}
    }
```

## Source code changes

```diff
.../Safe.sol                                       | 1088 ++++++++++++++++++++
 .../SafeProxy.p.sol                                |   37 +
 .../Safe.sol                                       | 1088 ++++++++++++++++++++
 .../SafeProxy.p.sol                                |   37 +
 .../Safe.sol                                       | 1088 ++++++++++++++++++++
 .../SafeProxy.p.sol                                |   37 +
 6 files changed, 3375 insertions(+)
```

Generated with discovered.json: 0xebdfeb48fd47c010a80df79dc9a14edefbadab9d

# Diff at Mon, 15 Sep 2025 09:50:48 GMT:

- author: Sergey Shemyakov (<sergey.shemyakov@l2beat.com>)
- comparing to: main@37882e40cb6029f3a2ae2bb177048e3e846b833d block: 1756971267
- current timestamp: 1756971267

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1756971267 (main branch discovery), not current.

```diff
    contract DisputeGameFactory (eth:0x139Cf05B34D0EC49D3BFB9704EC4cEbA6ae95dD1) {
    +++ description: The dispute game factory allows the creation of dispute games, used to propose state roots and eventually challenge them.
+++ severity: HIGH
      values.gameImpls.2:
+        "eth:0x0000000000000000000000000000000000000000"
+++ severity: HIGH
      values.gameImpls.3:
+        "eth:0x0000000000000000000000000000000000000000"
    }
```

Generated with discovered.json: 0x0d448f8b121efd5c2c043d4f0a3cdfab442f0d56

# Diff at Thu, 04 Sep 2025 07:35:35 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- current timestamp: 1756971267

## Description

Initial discovery:
- standard op stack deployment (all template code)
- permissioned opfp
- all-EOA admins
- no DA (no activity/rpc)

## Initial discovery

```diff
+   Status: CREATED
    contract OptimismMintableERC20Factory (eth:0x00e3001F111ba89F20a8336Bb986a78d8f734E7E)
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintableERC20 as this chain's representation of a token on the host chain, or vice-versa.
```

```diff
+   Status: CREATED
    contract DisputeGameFactory (eth:0x139Cf05B34D0EC49D3BFB9704EC4cEbA6ae95dD1)
    +++ description: The dispute game factory allows the creation of dispute games, used to propose state roots and eventually challenge them.
```

```diff
+   Status: CREATED
    contract PermissionedDisputeGame (eth:0x1B99b322085dA031e68C1202fdB756b3FFbaC7A6)
    +++ description: Same as FaultDisputeGame, but only two permissioned addresses are designated as proposer and challenger.
```

```diff
+   Status: CREATED
    contract PreimageOracle (eth:0x1fb8cdFc6831fc866Ed9C51aF8817Da5c287aDD3)
    +++ description: The PreimageOracle contract is used to load the required data from L1 for a dispute game.
```

```diff
+   Status: CREATED
    contract AnchorStateRegistry (eth:0x1ffFf41f5E6384D6737D27B1F471E69212150e55)
    +++ description: Contains the latest confirmed state root that can be used as a starting point in a dispute game.
```

```diff
+   Status: CREATED
    contract DelayedWETH (eth:0x2DDf646eaaac38AEA031268a07de4E9ff1D967bd)
    +++ description: Contract designed to hold the bonded ETH for each game. It is designed as a wrapper around WETH to allow an owner to function as a backstop if a game would incorrectly distribute funds.
```

```diff
+   Status: CREATED
    contract L1CrossDomainMessenger (eth:0x3131b01DF2F9eF6F42113090Edead5c97612c473)
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
```

```diff
+   Status: CREATED
    contract SuperchainConfig (eth:0x50F08E501f8A9D124eaB4990b057fDEfE3F6ae3E)
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
```

```diff
+   Status: CREATED
    contract SystemConfig (eth:0x5c3Efe3cA554816E9960C02AE3B4EB3A9a8D2E16)
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
```

```diff
+   Status: CREATED
    contract L1ERC721Bridge (eth:0x74A3065E6A4FFAA07dAC542E28452995f3c32EeA)
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
```

```diff
+   Status: CREATED
    contract ProxyAdmin (eth:0xa78F3521D5aDF038826f0FE3e809DF64Ec8a241D)
    +++ description: None
```

```diff
+   Status: CREATED
    contract MIPS (eth:0xaA59A0777648BC75cd10364083e878c1cCd6112a)
    +++ description: The MIPS contract is used to execute the final step of the dispute game which objectively determines the winner of the dispute.
```

```diff
+   Status: CREATED
    contract OptimismPortal2 (eth:0xCcd285b1ccf1cdaB36Da995B9fC68870E287694E)
    +++ description: The OptimismPortal contract is the main entry point to deposit funds from L1 to L2. It also allows to prove and finalize withdrawals. It specifies which game type can be used for withdrawals, which currently is the PermissionedDisputeGame.
```

```diff
+   Status: CREATED
    contract ProxyAdmin (eth:0xd8eAb3ed39Df0afB9BFD853f49637F7E73963966)
    +++ description: None
```

```diff
+   Status: CREATED
    contract AddressManager (eth:0xDD05146D14613BDC6a6cad371d15f1aE4269480e)
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
```

```diff
+   Status: CREATED
    contract L1StandardBridge (eth:0xe97d73B0079e04f4ea4162b9173604a6213eF158)
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
```
