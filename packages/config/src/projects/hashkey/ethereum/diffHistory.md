Generated with discovered.json: 0xc6ed5dabcc0bd5d03848a28153e8618f71c32a69

# Diff at Thu, 24 Jul 2025 16:48:23 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@a3f740c0fd51a5745c45d8f349ab01f4f33f7770 block: 22243976
- current block number: 22243976

## Description

set dispute game impl changes to high severity.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22243976 (main branch discovery), not current.

```diff
    contract DisputeGameFactory (0x04Ec030f362CE5A0b5Fe2d4B4219f287C2EBDE50) {
    +++ description: The dispute game factory allows the creation of dispute games, used to propose state roots and eventually challenge them.
      fieldMeta:
+        {"gameImpls":{"severity":"HIGH"},"game1337":{"severity":"HIGH"}}
    }
```

```diff
    contract OptimismPortal2 (0xe7Aa79B59CAc06F9706D896a047fEb9d3BDA8bD3) {
    +++ description: The OptimismPortal contract is the main entry point to deposit funds from L1 to L2. It also allows to prove and finalize withdrawals. It specifies which game type can be used for withdrawals, which currently is the PermissionedDisputeGame.
      fieldMeta.respectedGameType:
+        {"severity":"HIGH"}
    }
```

Generated with discovered.json: 0xae77281c01afd59a212ad9f56a3578d73ad39c87

# Diff at Tue, 22 Jul 2025 14:09:09 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@d5d65d1883c757ae790bbd0a6f785c98310d2516 block: 22243976
- current block number: 22243976

## Description

Config: Kailua added to OptimismPortal2 and DisputeGameFectory.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22243976 (main branch discovery), not current.

```diff
    contract DisputeGameFactory (0x04Ec030f362CE5A0b5Fe2d4B4219f287C2EBDE50) {
    +++ description: The dispute game factory allows the creation of dispute games, used to propose state roots and eventually challenge them.
      values.game1337:
+        "eth:0x0000000000000000000000000000000000000000"
    }
```

```diff
    contract OptimismPortal2 (0xe7Aa79B59CAc06F9706D896a047fEb9d3BDA8bD3) {
    +++ description: The OptimismPortal contract is the main entry point to deposit funds from L1 to L2. It also allows to prove and finalize withdrawals. It specifies which game type can be used for withdrawals, which currently is the PermissionedDisputeGame.
      usedTypes.0.arg.1337:
+        "KailuaGame"
    }
```

Generated with discovered.json: 0xb3a5406815941fb342990ced0cbde82dca4e1bc7

# Diff at Mon, 14 Jul 2025 12:45:09 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@9f4300dad2f3d080cd56fa311d4a848556c74e72 block: 22243976
- current block number: 22243976

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22243976 (main branch discovery), not current.

```diff
    EOA  (0x000000000000000000000000000000000000dEaD) {
    +++ description: None
      address:
-        "0x000000000000000000000000000000000000dEaD"
+        "eth:0x000000000000000000000000000000000000dEaD"
    }
```

```diff
    EOA  (0x0004cb44C80b6Fbf8ceb1d80AF688C9f7C0b2aB5) {
    +++ description: None
      address:
-        "0x0004cb44C80b6Fbf8ceb1d80AF688C9f7C0b2aB5"
+        "eth:0x0004cb44C80b6Fbf8ceb1d80AF688C9f7C0b2aB5"
    }
```

```diff
    EOA  (0x01D94b8F6b0da7f14D36d660EC0E746ed877151c) {
    +++ description: None
      address:
-        "0x01D94b8F6b0da7f14D36d660EC0E746ed877151c"
+        "eth:0x01D94b8F6b0da7f14D36d660EC0E746ed877151c"
    }
```

```diff
    contract OptimismMintableERC20Factory (0x0407af506d86bFA5e401099b2fC2355590638f19) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintableERC20 as this chain's representation of a token on the host chain, or vice-versa.
      address:
-        "0x0407af506d86bFA5e401099b2fC2355590638f19"
+        "eth:0x0407af506d86bFA5e401099b2fC2355590638f19"
      values.$admin:
-        "0x7986eD289935A0F47FC434C00cDE309fE2c51f1C"
+        "eth:0x7986eD289935A0F47FC434C00cDE309fE2c51f1C"
      values.$implementation:
-        "0x3FAe8259417036C02156DF91BdaF9d8F0ae5551f"
+        "eth:0x3FAe8259417036C02156DF91BdaF9d8F0ae5551f"
      values.$pastUpgrades.0.2.0:
-        "0x3FAe8259417036C02156DF91BdaF9d8F0ae5551f"
+        "eth:0x3FAe8259417036C02156DF91BdaF9d8F0ae5551f"
      values.bridge:
-        "0x2171E6d3B7964fA9654Ce41dA8a8fFAff2Cc70be"
+        "eth:0x2171E6d3B7964fA9654Ce41dA8a8fFAff2Cc70be"
      values.BRIDGE:
-        "0x2171E6d3B7964fA9654Ce41dA8a8fFAff2Cc70be"
+        "eth:0x2171E6d3B7964fA9654Ce41dA8a8fFAff2Cc70be"
      implementationNames.0x0407af506d86bFA5e401099b2fC2355590638f19:
-        "Proxy"
      implementationNames.0x3FAe8259417036C02156DF91BdaF9d8F0ae5551f:
-        "OptimismMintableERC20Factory"
      implementationNames.eth:0x0407af506d86bFA5e401099b2fC2355590638f19:
+        "Proxy"
      implementationNames.eth:0x3FAe8259417036C02156DF91BdaF9d8F0ae5551f:
+        "OptimismMintableERC20Factory"
    }
```

```diff
    contract DisputeGameFactory (0x04Ec030f362CE5A0b5Fe2d4B4219f287C2EBDE50) {
    +++ description: The dispute game factory allows the creation of dispute games, used to propose state roots and eventually challenge them.
      address:
-        "0x04Ec030f362CE5A0b5Fe2d4B4219f287C2EBDE50"
+        "eth:0x04Ec030f362CE5A0b5Fe2d4B4219f287C2EBDE50"
      values.$admin:
-        "0x7986eD289935A0F47FC434C00cDE309fE2c51f1C"
+        "eth:0x7986eD289935A0F47FC434C00cDE309fE2c51f1C"
      values.$implementation:
-        "0x71442A5586bde0f5EfD6588D01c2B2820D9D236D"
+        "eth:0x71442A5586bde0f5EfD6588D01c2B2820D9D236D"
      values.$pastUpgrades.0.2.0:
-        "0x71442A5586bde0f5EfD6588D01c2B2820D9D236D"
+        "eth:0x71442A5586bde0f5EfD6588D01c2B2820D9D236D"
      values.gameImpls.0:
-        "0xC3E7f3606aeAC543bD268a637c6847E92d69B8aA"
+        "eth:0xC3E7f3606aeAC543bD268a637c6847E92d69B8aA"
      values.gameImpls.1:
-        "0x78075eA46A562c3201E61664645c0f0537a8DDd5"
+        "eth:0x78075eA46A562c3201E61664645c0f0537a8DDd5"
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
-        "0x441F31C4cdf772558D4EA31f3114de59aE145E7c"
+        "eth:0x441F31C4cdf772558D4EA31f3114de59aE145E7c"
      implementationNames.0x04Ec030f362CE5A0b5Fe2d4B4219f287C2EBDE50:
-        "Proxy"
      implementationNames.0x71442A5586bde0f5EfD6588D01c2B2820D9D236D:
-        "DisputeGameFactory"
      implementationNames.eth:0x04Ec030f362CE5A0b5Fe2d4B4219f287C2EBDE50:
+        "Proxy"
      implementationNames.eth:0x71442A5586bde0f5EfD6588D01c2B2820D9D236D:
+        "DisputeGameFactory"
    }
```

```diff
    EOA  (0x1524C875105840c7DCdd269463b0f968BB0B2358) {
    +++ description: None
      address:
-        "0x1524C875105840c7DCdd269463b0f968BB0B2358"
+        "eth:0x1524C875105840c7DCdd269463b0f968BB0B2358"
    }
```

```diff
    contract L1StandardBridge (0x2171E6d3B7964fA9654Ce41dA8a8fFAff2Cc70be) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      address:
-        "0x2171E6d3B7964fA9654Ce41dA8a8fFAff2Cc70be"
+        "eth:0x2171E6d3B7964fA9654Ce41dA8a8fFAff2Cc70be"
      values.$admin:
-        "0x7986eD289935A0F47FC434C00cDE309fE2c51f1C"
+        "eth:0x7986eD289935A0F47FC434C00cDE309fE2c51f1C"
      values.$implementation:
-        "0x4634e74d04992BDd5192Cd75897CbD432971aAB6"
+        "eth:0x4634e74d04992BDd5192Cd75897CbD432971aAB6"
      values.l2TokenBridge:
-        "0x4200000000000000000000000000000000000010"
+        "eth:0x4200000000000000000000000000000000000010"
      values.messenger:
-        "0x899F07862D3A03F70E07b7f01183934b485d2e97"
+        "eth:0x899F07862D3A03F70E07b7f01183934b485d2e97"
      values.MESSENGER:
-        "0x899F07862D3A03F70E07b7f01183934b485d2e97"
+        "eth:0x899F07862D3A03F70E07b7f01183934b485d2e97"
      values.OTHER_BRIDGE:
-        "0x4200000000000000000000000000000000000010"
+        "eth:0x4200000000000000000000000000000000000010"
      values.otherBridge:
-        "0x4200000000000000000000000000000000000010"
+        "eth:0x4200000000000000000000000000000000000010"
      values.superchainConfig:
-        "0xfd1255b6c09D939E7F3896A16C32CDBCD6F8B40A"
+        "eth:0xfd1255b6c09D939E7F3896A16C32CDBCD6F8B40A"
      values.systemConfig:
-        "0x43F8DeFe3E9286D152E91BB16a248808E7247198"
+        "eth:0x43F8DeFe3E9286D152E91BB16a248808E7247198"
      implementationNames.0x2171E6d3B7964fA9654Ce41dA8a8fFAff2Cc70be:
-        "L1ChugSplashProxy"
      implementationNames.0x4634e74d04992BDd5192Cd75897CbD432971aAB6:
-        "L1StandardBridge"
      implementationNames.eth:0x2171E6d3B7964fA9654Ce41dA8a8fFAff2Cc70be:
+        "L1ChugSplashProxy"
      implementationNames.eth:0x4634e74d04992BDd5192Cd75897CbD432971aAB6:
+        "L1StandardBridge"
    }
```

```diff
    EOA  (0x2381D617547521a633022F12fbFd35F4128F0d06) {
    +++ description: None
      address:
-        "0x2381D617547521a633022F12fbFd35F4128F0d06"
+        "eth:0x2381D617547521a633022F12fbFd35F4128F0d06"
    }
```

```diff
    contract Hashkey Multisig 3 (0x29Fbda675Fa5a07B621C2C1a6E3F874C14F612F3) {
    +++ description: None
      address:
-        "0x29Fbda675Fa5a07B621C2C1a6E3F874C14F612F3"
+        "eth:0x29Fbda675Fa5a07B621C2C1a6E3F874C14F612F3"
      values.$implementation:
-        "0x41675C099F32341bf84BFc5382aF534df5C7461a"
+        "eth:0x41675C099F32341bf84BFc5382aF534df5C7461a"
      values.$members.0:
-        "0xfC8013c385d625f03B32d7b140593603CE9A870E"
+        "eth:0xfC8013c385d625f03B32d7b140593603CE9A870E"
      values.$members.1:
-        "0x936916b961bCB3899a0A5c900d4e4856462C3052"
+        "eth:0x936916b961bCB3899a0A5c900d4e4856462C3052"
      values.$members.2:
-        "0x936A3612A17FFAF824F80F4386e21d3a3F80EafD"
+        "eth:0x936A3612A17FFAF824F80F4386e21d3a3F80EafD"
      values.$members.3:
-        "0xfF57AA0CC7A727FF219673Cf329C05945685c0f2"
+        "eth:0xfF57AA0CC7A727FF219673Cf329C05945685c0f2"
      values.$members.4:
-        "0xa8AC7D03BEb92Fa3E6030AEB21629D00Ffb66dD7"
+        "eth:0xa8AC7D03BEb92Fa3E6030AEB21629D00Ffb66dD7"
      implementationNames.0x29Fbda675Fa5a07B621C2C1a6E3F874C14F612F3:
-        "SafeProxy"
      implementationNames.0x41675C099F32341bf84BFc5382aF534df5C7461a:
-        "Safe"
      implementationNames.eth:0x29Fbda675Fa5a07B621C2C1a6E3F874C14F612F3:
+        "SafeProxy"
      implementationNames.eth:0x41675C099F32341bf84BFc5382aF534df5C7461a:
+        "Safe"
    }
```

```diff
    contract SystemConfig (0x43F8DeFe3E9286D152E91BB16a248808E7247198) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      address:
-        "0x43F8DeFe3E9286D152E91BB16a248808E7247198"
+        "eth:0x43F8DeFe3E9286D152E91BB16a248808E7247198"
      values.$admin:
-        "0x7986eD289935A0F47FC434C00cDE309fE2c51f1C"
+        "eth:0x7986eD289935A0F47FC434C00cDE309fE2c51f1C"
      values.$implementation:
-        "0xbc10fE919504D53953d27989CD5B48B9A7c08Be0"
+        "eth:0xbc10fE919504D53953d27989CD5B48B9A7c08Be0"
      values.$pastUpgrades.0.2.0:
-        "0xbc10fE919504D53953d27989CD5B48B9A7c08Be0"
+        "eth:0xbc10fE919504D53953d27989CD5B48B9A7c08Be0"
      values.batcherHash:
-        "0xf09ebb62b5ba0cf402b77aBA61691cBCf005206f"
+        "eth:0xf09ebb62b5ba0cf402b77aBA61691cBCf005206f"
      values.batchInbox:
-        "0x0004cb44C80b6Fbf8ceb1d80AF688C9f7C0b2aB5"
+        "eth:0x0004cb44C80b6Fbf8ceb1d80AF688C9f7C0b2aB5"
      values.disputeGameFactory:
-        "0x04Ec030f362CE5A0b5Fe2d4B4219f287C2EBDE50"
+        "eth:0x04Ec030f362CE5A0b5Fe2d4B4219f287C2EBDE50"
      values.gasPayingToken.addr_:
-        "0xE7C6BF469e97eEB0bFB74C8dbFF5BD47D4C1C98a"
+        "eth:0xE7C6BF469e97eEB0bFB74C8dbFF5BD47D4C1C98a"
      values.l1CrossDomainMessenger:
-        "0x899F07862D3A03F70E07b7f01183934b485d2e97"
+        "eth:0x899F07862D3A03F70E07b7f01183934b485d2e97"
      values.l1ERC721Bridge:
-        "0xd4C83D93c6fAE3E0804B785F9Cf465BE95449D04"
+        "eth:0xd4C83D93c6fAE3E0804B785F9Cf465BE95449D04"
      values.l1StandardBridge:
-        "0x2171E6d3B7964fA9654Ce41dA8a8fFAff2Cc70be"
+        "eth:0x2171E6d3B7964fA9654Ce41dA8a8fFAff2Cc70be"
      values.optimismMintableERC20Factory:
-        "0x0407af506d86bFA5e401099b2fC2355590638f19"
+        "eth:0x0407af506d86bFA5e401099b2fC2355590638f19"
      values.optimismPortal:
-        "0xe7Aa79B59CAc06F9706D896a047fEb9d3BDA8bD3"
+        "eth:0xe7Aa79B59CAc06F9706D896a047fEb9d3BDA8bD3"
      values.owner:
-        "0x29Fbda675Fa5a07B621C2C1a6E3F874C14F612F3"
+        "eth:0x29Fbda675Fa5a07B621C2C1a6E3F874C14F612F3"
      values.sequencerInbox:
-        "0x0004cb44C80b6Fbf8ceb1d80AF688C9f7C0b2aB5"
+        "eth:0x0004cb44C80b6Fbf8ceb1d80AF688C9f7C0b2aB5"
      values.unsafeBlockSigner:
-        "0xCc467FdB41B5b5A4E23021CAd69ED27550a41694"
+        "eth:0xCc467FdB41B5b5A4E23021CAd69ED27550a41694"
      implementationNames.0x43F8DeFe3E9286D152E91BB16a248808E7247198:
-        "Proxy"
      implementationNames.0xbc10fE919504D53953d27989CD5B48B9A7c08Be0:
-        "SystemConfig"
      implementationNames.eth:0x43F8DeFe3E9286D152E91BB16a248808E7247198:
+        "Proxy"
      implementationNames.eth:0xbc10fE919504D53953d27989CD5B48B9A7c08Be0:
+        "SystemConfig"
    }
```

```diff
    contract Hashkey Multisig 1 (0x441F31C4cdf772558D4EA31f3114de59aE145E7c) {
    +++ description: None
      address:
-        "0x441F31C4cdf772558D4EA31f3114de59aE145E7c"
+        "eth:0x441F31C4cdf772558D4EA31f3114de59aE145E7c"
      values.$implementation:
-        "0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
+        "eth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
      values.$members.0:
-        "0x1524C875105840c7DCdd269463b0f968BB0B2358"
+        "eth:0x1524C875105840c7DCdd269463b0f968BB0B2358"
      values.$members.1:
-        "0x01D94b8F6b0da7f14D36d660EC0E746ed877151c"
+        "eth:0x01D94b8F6b0da7f14D36d660EC0E746ed877151c"
      values.$members.2:
-        "0x7623aA9B6D2c1a31E96ba47C9Bc07c6051E5189e"
+        "eth:0x7623aA9B6D2c1a31E96ba47C9Bc07c6051E5189e"
      values.$members.3:
-        "0x2381D617547521a633022F12fbFd35F4128F0d06"
+        "eth:0x2381D617547521a633022F12fbFd35F4128F0d06"
      values.$members.4:
-        "0xa31d8CDDf0D931Dfda2C9D03E35bd8b5d3A6aEC9"
+        "eth:0xa31d8CDDf0D931Dfda2C9D03E35bd8b5d3A6aEC9"
      implementationNames.0x441F31C4cdf772558D4EA31f3114de59aE145E7c:
-        "GnosisSafeProxy"
      implementationNames.0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
-        "GnosisSafe"
      implementationNames.eth:0x441F31C4cdf772558D4EA31f3114de59aE145E7c:
+        "GnosisSafeProxy"
      implementationNames.eth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
+        "GnosisSafe"
    }
```

```diff
    contract AnchorStateRegistry (0x4deC2aA521108d78d983c0c12656c6CF8631F2ED) {
    +++ description: Contains the latest confirmed state root that can be used as a starting point in a dispute game.
      address:
-        "0x4deC2aA521108d78d983c0c12656c6CF8631F2ED"
+        "eth:0x4deC2aA521108d78d983c0c12656c6CF8631F2ED"
      values.$admin:
-        "0x7986eD289935A0F47FC434C00cDE309fE2c51f1C"
+        "eth:0x7986eD289935A0F47FC434C00cDE309fE2c51f1C"
      values.$implementation:
-        "0xE5a698154470AF2626b27fEecb684F8fb265F2E0"
+        "eth:0xE5a698154470AF2626b27fEecb684F8fb265F2E0"
      values.$pastUpgrades.0.2.0:
-        "0xE5a698154470AF2626b27fEecb684F8fb265F2E0"
+        "eth:0xE5a698154470AF2626b27fEecb684F8fb265F2E0"
      values.disputeGameFactory:
-        "0x04Ec030f362CE5A0b5Fe2d4B4219f287C2EBDE50"
+        "eth:0x04Ec030f362CE5A0b5Fe2d4B4219f287C2EBDE50"
      values.superchainConfig:
-        "0xfd1255b6c09D939E7F3896A16C32CDBCD6F8B40A"
+        "eth:0xfd1255b6c09D939E7F3896A16C32CDBCD6F8B40A"
      implementationNames.0x4deC2aA521108d78d983c0c12656c6CF8631F2ED:
-        "Proxy"
      implementationNames.0xE5a698154470AF2626b27fEecb684F8fb265F2E0:
-        "AnchorStateRegistry"
      implementationNames.eth:0x4deC2aA521108d78d983c0c12656c6CF8631F2ED:
+        "Proxy"
      implementationNames.eth:0xE5a698154470AF2626b27fEecb684F8fb265F2E0:
+        "AnchorStateRegistry"
    }
```

```diff
    EOA  (0x51a3d95b25d932026c435527ff2Bee2E12b796Cf) {
    +++ description: None
      address:
-        "0x51a3d95b25d932026c435527ff2Bee2E12b796Cf"
+        "eth:0x51a3d95b25d932026c435527ff2Bee2E12b796Cf"
    }
```

```diff
    contract PreimageOracle (0x5B9bEf4d8C36FB013c70d0A6F455807c6BD5270b) {
    +++ description: The PreimageOracle contract is used to load the required data from L1 for a dispute game.
      address:
-        "0x5B9bEf4d8C36FB013c70d0A6F455807c6BD5270b"
+        "eth:0x5B9bEf4d8C36FB013c70d0A6F455807c6BD5270b"
      implementationNames.0x5B9bEf4d8C36FB013c70d0A6F455807c6BD5270b:
-        "PreimageOracle"
      implementationNames.eth:0x5B9bEf4d8C36FB013c70d0A6F455807c6BD5270b:
+        "PreimageOracle"
    }
```

```diff
    contract AddressManager (0x679A65aD62972Ea3561F40A12e93CcA6f79F35E6) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      address:
-        "0x679A65aD62972Ea3561F40A12e93CcA6f79F35E6"
+        "eth:0x679A65aD62972Ea3561F40A12e93CcA6f79F35E6"
      values.owner:
-        "0x7986eD289935A0F47FC434C00cDE309fE2c51f1C"
+        "eth:0x7986eD289935A0F47FC434C00cDE309fE2c51f1C"
      implementationNames.0x679A65aD62972Ea3561F40A12e93CcA6f79F35E6:
-        "AddressManager"
      implementationNames.eth:0x679A65aD62972Ea3561F40A12e93CcA6f79F35E6:
+        "AddressManager"
    }
```

```diff
    contract MIPS (0x7447b25b91336127042CC6899B2C15668a1Ab8BA) {
    +++ description: The MIPS contract is used to execute the final step of the dispute game which objectively determines the winner of the dispute.
      address:
-        "0x7447b25b91336127042CC6899B2C15668a1Ab8BA"
+        "eth:0x7447b25b91336127042CC6899B2C15668a1Ab8BA"
      values.oracle:
-        "0x5B9bEf4d8C36FB013c70d0A6F455807c6BD5270b"
+        "eth:0x5B9bEf4d8C36FB013c70d0A6F455807c6BD5270b"
      implementationNames.0x7447b25b91336127042CC6899B2C15668a1Ab8BA:
-        "MIPS"
      implementationNames.eth:0x7447b25b91336127042CC6899B2C15668a1Ab8BA:
+        "MIPS"
    }
```

```diff
    EOA  (0x7623aA9B6D2c1a31E96ba47C9Bc07c6051E5189e) {
    +++ description: None
      address:
-        "0x7623aA9B6D2c1a31E96ba47C9Bc07c6051E5189e"
+        "eth:0x7623aA9B6D2c1a31E96ba47C9Bc07c6051E5189e"
    }
```

```diff
    contract PermissionedDisputeGame (0x78075eA46A562c3201E61664645c0f0537a8DDd5) {
    +++ description: Same as FaultDisputeGame, but only two permissioned addresses are designated as proposer and challenger.
      address:
-        "0x78075eA46A562c3201E61664645c0f0537a8DDd5"
+        "eth:0x78075eA46A562c3201E61664645c0f0537a8DDd5"
      values.anchorStateRegistry:
-        "0x4deC2aA521108d78d983c0c12656c6CF8631F2ED"
+        "eth:0x4deC2aA521108d78d983c0c12656c6CF8631F2ED"
      values.challenger:
-        "0xFCF35CeE40325db21c3dc5b45849251E78Be47eb"
+        "eth:0xFCF35CeE40325db21c3dc5b45849251E78Be47eb"
      values.gameCreator:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.l2BlockNumberChallenger:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.proposer:
-        "0xC55763132E9b76766D62e59728b3933F54C998C5"
+        "eth:0xC55763132E9b76766D62e59728b3933F54C998C5"
      values.vm:
-        "0x7447b25b91336127042CC6899B2C15668a1Ab8BA"
+        "eth:0x7447b25b91336127042CC6899B2C15668a1Ab8BA"
      values.weth:
-        "0xd9c31D15f2c649e525C2574bC025b3CAafAaf6fe"
+        "eth:0xd9c31D15f2c649e525C2574bC025b3CAafAaf6fe"
      implementationNames.0x78075eA46A562c3201E61664645c0f0537a8DDd5:
-        "PermissionedDisputeGame"
      implementationNames.eth:0x78075eA46A562c3201E61664645c0f0537a8DDd5:
+        "PermissionedDisputeGame"
    }
```

```diff
    contract ProxyAdmin (0x7986eD289935A0F47FC434C00cDE309fE2c51f1C) {
    +++ description: None
      address:
-        "0x7986eD289935A0F47FC434C00cDE309fE2c51f1C"
+        "eth:0x7986eD289935A0F47FC434C00cDE309fE2c51f1C"
      values.addressManager:
-        "0x679A65aD62972Ea3561F40A12e93CcA6f79F35E6"
+        "eth:0x679A65aD62972Ea3561F40A12e93CcA6f79F35E6"
      values.owner:
-        "0x441F31C4cdf772558D4EA31f3114de59aE145E7c"
+        "eth:0x441F31C4cdf772558D4EA31f3114de59aE145E7c"
      implementationNames.0x7986eD289935A0F47FC434C00cDE309fE2c51f1C:
-        "ProxyAdmin"
      implementationNames.eth:0x7986eD289935A0F47FC434C00cDE309fE2c51f1C:
+        "ProxyAdmin"
    }
```

```diff
    EOA  (0x892Aa95AD0b733A72e2f3F5EB20d5314CBBbD180) {
    +++ description: None
      address:
-        "0x892Aa95AD0b733A72e2f3F5EB20d5314CBBbD180"
+        "eth:0x892Aa95AD0b733A72e2f3F5EB20d5314CBBbD180"
    }
```

```diff
    contract L1CrossDomainMessenger (0x899F07862D3A03F70E07b7f01183934b485d2e97) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      address:
-        "0x899F07862D3A03F70E07b7f01183934b485d2e97"
+        "eth:0x899F07862D3A03F70E07b7f01183934b485d2e97"
      values.$admin:
-        "0x7986eD289935A0F47FC434C00cDE309fE2c51f1C"
+        "eth:0x7986eD289935A0F47FC434C00cDE309fE2c51f1C"
      values.$implementation:
-        "0x21971eCC803C30A181ee111803253C869083baF1"
+        "eth:0x21971eCC803C30A181ee111803253C869083baF1"
      values.$pastUpgrades.0.2.0:
-        "0x21971eCC803C30A181ee111803253C869083baF1"
+        "eth:0x21971eCC803C30A181ee111803253C869083baF1"
      values.OTHER_MESSENGER:
-        "0x4200000000000000000000000000000000000007"
+        "eth:0x4200000000000000000000000000000000000007"
      values.otherMessenger:
-        "0x4200000000000000000000000000000000000007"
+        "eth:0x4200000000000000000000000000000000000007"
      values.portal:
-        "0xe7Aa79B59CAc06F9706D896a047fEb9d3BDA8bD3"
+        "eth:0xe7Aa79B59CAc06F9706D896a047fEb9d3BDA8bD3"
      values.PORTAL:
-        "0xe7Aa79B59CAc06F9706D896a047fEb9d3BDA8bD3"
+        "eth:0xe7Aa79B59CAc06F9706D896a047fEb9d3BDA8bD3"
      values.ResolvedDelegateProxy_addressManager:
-        "0x679A65aD62972Ea3561F40A12e93CcA6f79F35E6"
+        "eth:0x679A65aD62972Ea3561F40A12e93CcA6f79F35E6"
      values.superchainConfig:
-        "0xfd1255b6c09D939E7F3896A16C32CDBCD6F8B40A"
+        "eth:0xfd1255b6c09D939E7F3896A16C32CDBCD6F8B40A"
      values.systemConfig:
-        "0x43F8DeFe3E9286D152E91BB16a248808E7247198"
+        "eth:0x43F8DeFe3E9286D152E91BB16a248808E7247198"
      implementationNames.0x899F07862D3A03F70E07b7f01183934b485d2e97:
-        "ResolvedDelegateProxy"
      implementationNames.0x21971eCC803C30A181ee111803253C869083baF1:
-        "L1CrossDomainMessenger"
      implementationNames.eth:0x899F07862D3A03F70E07b7f01183934b485d2e97:
+        "ResolvedDelegateProxy"
      implementationNames.eth:0x21971eCC803C30A181ee111803253C869083baF1:
+        "L1CrossDomainMessenger"
    }
```

```diff
    EOA  (0x936916b961bCB3899a0A5c900d4e4856462C3052) {
    +++ description: None
      address:
-        "0x936916b961bCB3899a0A5c900d4e4856462C3052"
+        "eth:0x936916b961bCB3899a0A5c900d4e4856462C3052"
    }
```

```diff
    EOA  (0x936A3612A17FFAF824F80F4386e21d3a3F80EafD) {
    +++ description: None
      address:
-        "0x936A3612A17FFAF824F80F4386e21d3a3F80EafD"
+        "eth:0x936A3612A17FFAF824F80F4386e21d3a3F80EafD"
    }
```

```diff
    EOA  (0xa31d8CDDf0D931Dfda2C9D03E35bd8b5d3A6aEC9) {
    +++ description: None
      address:
-        "0xa31d8CDDf0D931Dfda2C9D03E35bd8b5d3A6aEC9"
+        "eth:0xa31d8CDDf0D931Dfda2C9D03E35bd8b5d3A6aEC9"
    }
```

```diff
    EOA  (0xa8AC7D03BEb92Fa3E6030AEB21629D00Ffb66dD7) {
    +++ description: None
      address:
-        "0xa8AC7D03BEb92Fa3E6030AEB21629D00Ffb66dD7"
+        "eth:0xa8AC7D03BEb92Fa3E6030AEB21629D00Ffb66dD7"
    }
```

```diff
    EOA  (0xaF462439A057f32A0f2Ce0353cBC6E0515c40dE3) {
    +++ description: None
      address:
-        "0xaF462439A057f32A0f2Ce0353cBC6E0515c40dE3"
+        "eth:0xaF462439A057f32A0f2Ce0353cBC6E0515c40dE3"
    }
```

```diff
    contract DelayedWETH (0xBb70D595147A141e268532BFEF61A8c25054d26D) {
    +++ description: Contract designed to hold the bonded ETH for each game. It is designed as a wrapper around WETH to allow an owner to function as a backstop if a game would incorrectly distribute funds.
      address:
-        "0xBb70D595147A141e268532BFEF61A8c25054d26D"
+        "eth:0xBb70D595147A141e268532BFEF61A8c25054d26D"
      values.$admin:
-        "0x7986eD289935A0F47FC434C00cDE309fE2c51f1C"
+        "eth:0x7986eD289935A0F47FC434C00cDE309fE2c51f1C"
      values.$implementation:
-        "0xB8566D805b8DD2E2EC41542A2dc4Af96855f75d8"
+        "eth:0xB8566D805b8DD2E2EC41542A2dc4Af96855f75d8"
      values.$pastUpgrades.0.2.0:
-        "0xB8566D805b8DD2E2EC41542A2dc4Af96855f75d8"
+        "eth:0xB8566D805b8DD2E2EC41542A2dc4Af96855f75d8"
      values.config:
-        "0xfd1255b6c09D939E7F3896A16C32CDBCD6F8B40A"
+        "eth:0xfd1255b6c09D939E7F3896A16C32CDBCD6F8B40A"
      values.owner:
-        "0x441F31C4cdf772558D4EA31f3114de59aE145E7c"
+        "eth:0x441F31C4cdf772558D4EA31f3114de59aE145E7c"
      implementationNames.0xBb70D595147A141e268532BFEF61A8c25054d26D:
-        "Proxy"
      implementationNames.0xB8566D805b8DD2E2EC41542A2dc4Af96855f75d8:
-        "DelayedWETH"
      implementationNames.eth:0xBb70D595147A141e268532BFEF61A8c25054d26D:
+        "Proxy"
      implementationNames.eth:0xB8566D805b8DD2E2EC41542A2dc4Af96855f75d8:
+        "DelayedWETH"
    }
```

```diff
    contract FaultDisputeGame (0xC3E7f3606aeAC543bD268a637c6847E92d69B8aA) {
    +++ description: Logic of the dispute game. When a state root is proposed, a dispute game contract is deployed. Challengers can use such contracts to challenge the proposed state root.
      address:
-        "0xC3E7f3606aeAC543bD268a637c6847E92d69B8aA"
+        "eth:0xC3E7f3606aeAC543bD268a637c6847E92d69B8aA"
      values.anchorStateRegistry:
-        "0x4deC2aA521108d78d983c0c12656c6CF8631F2ED"
+        "eth:0x4deC2aA521108d78d983c0c12656c6CF8631F2ED"
      values.gameCreator:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.l2BlockNumberChallenger:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.vm:
-        "0x7447b25b91336127042CC6899B2C15668a1Ab8BA"
+        "eth:0x7447b25b91336127042CC6899B2C15668a1Ab8BA"
      values.weth:
-        "0xBb70D595147A141e268532BFEF61A8c25054d26D"
+        "eth:0xBb70D595147A141e268532BFEF61A8c25054d26D"
      implementationNames.0xC3E7f3606aeAC543bD268a637c6847E92d69B8aA:
-        "FaultDisputeGame"
      implementationNames.eth:0xC3E7f3606aeAC543bD268a637c6847E92d69B8aA:
+        "FaultDisputeGame"
    }
```

```diff
    EOA  (0xC55763132E9b76766D62e59728b3933F54C998C5) {
    +++ description: None
      address:
-        "0xC55763132E9b76766D62e59728b3933F54C998C5"
+        "eth:0xC55763132E9b76766D62e59728b3933F54C998C5"
    }
```

```diff
    contract Hashkey Multisig 2 (0xC7fCbE26c1Db751d63869F72F782a56710f6be5A) {
    +++ description: None
      address:
-        "0xC7fCbE26c1Db751d63869F72F782a56710f6be5A"
+        "eth:0xC7fCbE26c1Db751d63869F72F782a56710f6be5A"
      values.$implementation:
-        "0x41675C099F32341bf84BFc5382aF534df5C7461a"
+        "eth:0x41675C099F32341bf84BFc5382aF534df5C7461a"
      values.$members.0:
-        "0x892Aa95AD0b733A72e2f3F5EB20d5314CBBbD180"
+        "eth:0x892Aa95AD0b733A72e2f3F5EB20d5314CBBbD180"
      values.$members.1:
-        "0x51a3d95b25d932026c435527ff2Bee2E12b796Cf"
+        "eth:0x51a3d95b25d932026c435527ff2Bee2E12b796Cf"
      values.$members.2:
-        "0xaF462439A057f32A0f2Ce0353cBC6E0515c40dE3"
+        "eth:0xaF462439A057f32A0f2Ce0353cBC6E0515c40dE3"
      values.$members.3:
-        "0xd1E15028fe575AD2D8F6d7bd1CB22589dFA68fbe"
+        "eth:0xd1E15028fe575AD2D8F6d7bd1CB22589dFA68fbe"
      values.$members.4:
-        "0xa8AC7D03BEb92Fa3E6030AEB21629D00Ffb66dD7"
+        "eth:0xa8AC7D03BEb92Fa3E6030AEB21629D00Ffb66dD7"
      implementationNames.0xC7fCbE26c1Db751d63869F72F782a56710f6be5A:
-        "SafeProxy"
      implementationNames.0x41675C099F32341bf84BFc5382aF534df5C7461a:
-        "Safe"
      implementationNames.eth:0xC7fCbE26c1Db751d63869F72F782a56710f6be5A:
+        "SafeProxy"
      implementationNames.eth:0x41675C099F32341bf84BFc5382aF534df5C7461a:
+        "Safe"
    }
```

```diff
    EOA  (0xCc467FdB41B5b5A4E23021CAd69ED27550a41694) {
    +++ description: None
      address:
-        "0xCc467FdB41B5b5A4E23021CAd69ED27550a41694"
+        "eth:0xCc467FdB41B5b5A4E23021CAd69ED27550a41694"
    }
```

```diff
    EOA  (0xd1E15028fe575AD2D8F6d7bd1CB22589dFA68fbe) {
    +++ description: None
      address:
-        "0xd1E15028fe575AD2D8F6d7bd1CB22589dFA68fbe"
+        "eth:0xd1E15028fe575AD2D8F6d7bd1CB22589dFA68fbe"
    }
```

```diff
    contract L1ERC721Bridge (0xd4C83D93c6fAE3E0804B785F9Cf465BE95449D04) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      address:
-        "0xd4C83D93c6fAE3E0804B785F9Cf465BE95449D04"
+        "eth:0xd4C83D93c6fAE3E0804B785F9Cf465BE95449D04"
      values.$admin:
-        "0x7986eD289935A0F47FC434C00cDE309fE2c51f1C"
+        "eth:0x7986eD289935A0F47FC434C00cDE309fE2c51f1C"
      values.$implementation:
-        "0xcD8f943e7d506cD92dE582Ac5065dE718E568580"
+        "eth:0xcD8f943e7d506cD92dE582Ac5065dE718E568580"
      values.$pastUpgrades.0.2.0:
-        "0xcD8f943e7d506cD92dE582Ac5065dE718E568580"
+        "eth:0xcD8f943e7d506cD92dE582Ac5065dE718E568580"
      values.messenger:
-        "0x899F07862D3A03F70E07b7f01183934b485d2e97"
+        "eth:0x899F07862D3A03F70E07b7f01183934b485d2e97"
      values.MESSENGER:
-        "0x899F07862D3A03F70E07b7f01183934b485d2e97"
+        "eth:0x899F07862D3A03F70E07b7f01183934b485d2e97"
      values.OTHER_BRIDGE:
-        "0x4200000000000000000000000000000000000014"
+        "eth:0x4200000000000000000000000000000000000014"
      values.otherBridge:
-        "0x4200000000000000000000000000000000000014"
+        "eth:0x4200000000000000000000000000000000000014"
      values.superchainConfig:
-        "0xfd1255b6c09D939E7F3896A16C32CDBCD6F8B40A"
+        "eth:0xfd1255b6c09D939E7F3896A16C32CDBCD6F8B40A"
      implementationNames.0xd4C83D93c6fAE3E0804B785F9Cf465BE95449D04:
-        "Proxy"
      implementationNames.0xcD8f943e7d506cD92dE582Ac5065dE718E568580:
-        "L1ERC721Bridge"
      implementationNames.eth:0xd4C83D93c6fAE3E0804B785F9Cf465BE95449D04:
+        "Proxy"
      implementationNames.eth:0xcD8f943e7d506cD92dE582Ac5065dE718E568580:
+        "L1ERC721Bridge"
    }
```

```diff
    contract DelayedWETH (0xd9c31D15f2c649e525C2574bC025b3CAafAaf6fe) {
    +++ description: Contract designed to hold the bonded ETH for each game. It is designed as a wrapper around WETH to allow an owner to function as a backstop if a game would incorrectly distribute funds.
      address:
-        "0xd9c31D15f2c649e525C2574bC025b3CAafAaf6fe"
+        "eth:0xd9c31D15f2c649e525C2574bC025b3CAafAaf6fe"
      values.$admin:
-        "0x7986eD289935A0F47FC434C00cDE309fE2c51f1C"
+        "eth:0x7986eD289935A0F47FC434C00cDE309fE2c51f1C"
      values.$implementation:
-        "0xB8566D805b8DD2E2EC41542A2dc4Af96855f75d8"
+        "eth:0xB8566D805b8DD2E2EC41542A2dc4Af96855f75d8"
      values.$pastUpgrades.0.2.0:
-        "0xB8566D805b8DD2E2EC41542A2dc4Af96855f75d8"
+        "eth:0xB8566D805b8DD2E2EC41542A2dc4Af96855f75d8"
      values.config:
-        "0xfd1255b6c09D939E7F3896A16C32CDBCD6F8B40A"
+        "eth:0xfd1255b6c09D939E7F3896A16C32CDBCD6F8B40A"
      values.owner:
-        "0x441F31C4cdf772558D4EA31f3114de59aE145E7c"
+        "eth:0x441F31C4cdf772558D4EA31f3114de59aE145E7c"
      implementationNames.0xd9c31D15f2c649e525C2574bC025b3CAafAaf6fe:
-        "Proxy"
      implementationNames.0xB8566D805b8DD2E2EC41542A2dc4Af96855f75d8:
-        "DelayedWETH"
      implementationNames.eth:0xd9c31D15f2c649e525C2574bC025b3CAafAaf6fe:
+        "Proxy"
      implementationNames.eth:0xB8566D805b8DD2E2EC41542A2dc4Af96855f75d8:
+        "DelayedWETH"
    }
```

```diff
    contract OptimismPortal2 (0xe7Aa79B59CAc06F9706D896a047fEb9d3BDA8bD3) {
    +++ description: The OptimismPortal contract is the main entry point to deposit funds from L1 to L2. It also allows to prove and finalize withdrawals. It specifies which game type can be used for withdrawals, which currently is the PermissionedDisputeGame.
      address:
-        "0xe7Aa79B59CAc06F9706D896a047fEb9d3BDA8bD3"
+        "eth:0xe7Aa79B59CAc06F9706D896a047fEb9d3BDA8bD3"
      values.$admin:
-        "0x7986eD289935A0F47FC434C00cDE309fE2c51f1C"
+        "eth:0x7986eD289935A0F47FC434C00cDE309fE2c51f1C"
      values.$implementation:
-        "0x18A7868ECe35A45aC9138108E5b6e021aD1038d1"
+        "eth:0x18A7868ECe35A45aC9138108E5b6e021aD1038d1"
      values.$pastUpgrades.0.2.0:
-        "0x18A7868ECe35A45aC9138108E5b6e021aD1038d1"
+        "eth:0x18A7868ECe35A45aC9138108E5b6e021aD1038d1"
      values.disputeGameFactory:
-        "0x04Ec030f362CE5A0b5Fe2d4B4219f287C2EBDE50"
+        "eth:0x04Ec030f362CE5A0b5Fe2d4B4219f287C2EBDE50"
      values.guardian:
-        "0xC7fCbE26c1Db751d63869F72F782a56710f6be5A"
+        "eth:0xC7fCbE26c1Db751d63869F72F782a56710f6be5A"
      values.l2Sender:
-        "0x000000000000000000000000000000000000dEaD"
+        "eth:0x000000000000000000000000000000000000dEaD"
      values.superchainConfig:
-        "0xfd1255b6c09D939E7F3896A16C32CDBCD6F8B40A"
+        "eth:0xfd1255b6c09D939E7F3896A16C32CDBCD6F8B40A"
      values.systemConfig:
-        "0x43F8DeFe3E9286D152E91BB16a248808E7247198"
+        "eth:0x43F8DeFe3E9286D152E91BB16a248808E7247198"
      implementationNames.0xe7Aa79B59CAc06F9706D896a047fEb9d3BDA8bD3:
-        "Proxy"
      implementationNames.0x18A7868ECe35A45aC9138108E5b6e021aD1038d1:
-        "OptimismPortal2"
      implementationNames.eth:0xe7Aa79B59CAc06F9706D896a047fEb9d3BDA8bD3:
+        "Proxy"
      implementationNames.eth:0x18A7868ECe35A45aC9138108E5b6e021aD1038d1:
+        "OptimismPortal2"
    }
```

```diff
    EOA  (0xf09ebb62b5ba0cf402b77aBA61691cBCf005206f) {
    +++ description: None
      address:
-        "0xf09ebb62b5ba0cf402b77aBA61691cBCf005206f"
+        "eth:0xf09ebb62b5ba0cf402b77aBA61691cBCf005206f"
    }
```

```diff
    EOA  (0xfC8013c385d625f03B32d7b140593603CE9A870E) {
    +++ description: None
      address:
-        "0xfC8013c385d625f03B32d7b140593603CE9A870E"
+        "eth:0xfC8013c385d625f03B32d7b140593603CE9A870E"
    }
```

```diff
    EOA  (0xFCF35CeE40325db21c3dc5b45849251E78Be47eb) {
    +++ description: None
      address:
-        "0xFCF35CeE40325db21c3dc5b45849251E78Be47eb"
+        "eth:0xFCF35CeE40325db21c3dc5b45849251E78Be47eb"
    }
```

```diff
    contract SuperchainConfig (0xfd1255b6c09D939E7F3896A16C32CDBCD6F8B40A) {
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      address:
-        "0xfd1255b6c09D939E7F3896A16C32CDBCD6F8B40A"
+        "eth:0xfd1255b6c09D939E7F3896A16C32CDBCD6F8B40A"
      values.$admin:
-        "0x7986eD289935A0F47FC434C00cDE309fE2c51f1C"
+        "eth:0x7986eD289935A0F47FC434C00cDE309fE2c51f1C"
      values.$implementation:
-        "0x1d31a15050DBE75c6c060D6da696332a5CB943e1"
+        "eth:0x1d31a15050DBE75c6c060D6da696332a5CB943e1"
      values.$pastUpgrades.0.2.0:
-        "0x1d31a15050DBE75c6c060D6da696332a5CB943e1"
+        "eth:0x1d31a15050DBE75c6c060D6da696332a5CB943e1"
      values.guardian:
-        "0xC7fCbE26c1Db751d63869F72F782a56710f6be5A"
+        "eth:0xC7fCbE26c1Db751d63869F72F782a56710f6be5A"
      implementationNames.0xfd1255b6c09D939E7F3896A16C32CDBCD6F8B40A:
-        "Proxy"
      implementationNames.0x1d31a15050DBE75c6c060D6da696332a5CB943e1:
-        "SuperchainConfig"
      implementationNames.eth:0xfd1255b6c09D939E7F3896A16C32CDBCD6F8B40A:
+        "Proxy"
      implementationNames.eth:0x1d31a15050DBE75c6c060D6da696332a5CB943e1:
+        "SuperchainConfig"
    }
```

```diff
    EOA  (0xfF57AA0CC7A727FF219673Cf329C05945685c0f2) {
    +++ description: None
      address:
-        "0xfF57AA0CC7A727FF219673Cf329C05945685c0f2"
+        "eth:0xfF57AA0CC7A727FF219673Cf329C05945685c0f2"
    }
```

```diff
+   Status: CREATED
    contract OptimismMintableERC20Factory (0x0407af506d86bFA5e401099b2fC2355590638f19)
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintableERC20 as this chain's representation of a token on the host chain, or vice-versa.
```

```diff
+   Status: CREATED
    contract DisputeGameFactory (0x04Ec030f362CE5A0b5Fe2d4B4219f287C2EBDE50)
    +++ description: The dispute game factory allows the creation of dispute games, used to propose state roots and eventually challenge them.
```

```diff
+   Status: CREATED
    contract L1StandardBridge (0x2171E6d3B7964fA9654Ce41dA8a8fFAff2Cc70be)
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
```

```diff
+   Status: CREATED
    contract Hashkey Multisig 3 (0x29Fbda675Fa5a07B621C2C1a6E3F874C14F612F3)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SystemConfig (0x43F8DeFe3E9286D152E91BB16a248808E7247198)
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
```

```diff
+   Status: CREATED
    contract Hashkey Multisig 1 (0x441F31C4cdf772558D4EA31f3114de59aE145E7c)
    +++ description: None
```

```diff
+   Status: CREATED
    contract AnchorStateRegistry (0x4deC2aA521108d78d983c0c12656c6CF8631F2ED)
    +++ description: Contains the latest confirmed state root that can be used as a starting point in a dispute game.
```

```diff
+   Status: CREATED
    contract PreimageOracle (0x5B9bEf4d8C36FB013c70d0A6F455807c6BD5270b)
    +++ description: The PreimageOracle contract is used to load the required data from L1 for a dispute game.
```

```diff
+   Status: CREATED
    contract AddressManager (0x679A65aD62972Ea3561F40A12e93CcA6f79F35E6)
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
```

```diff
+   Status: CREATED
    contract MIPS (0x7447b25b91336127042CC6899B2C15668a1Ab8BA)
    +++ description: The MIPS contract is used to execute the final step of the dispute game which objectively determines the winner of the dispute.
```

```diff
+   Status: CREATED
    contract PermissionedDisputeGame (0x78075eA46A562c3201E61664645c0f0537a8DDd5)
    +++ description: Same as FaultDisputeGame, but only two permissioned addresses are designated as proposer and challenger.
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x7986eD289935A0F47FC434C00cDE309fE2c51f1C)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1CrossDomainMessenger (0x899F07862D3A03F70E07b7f01183934b485d2e97)
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
```

```diff
+   Status: CREATED
    contract DelayedWETH (0xBb70D595147A141e268532BFEF61A8c25054d26D)
    +++ description: Contract designed to hold the bonded ETH for each game. It is designed as a wrapper around WETH to allow an owner to function as a backstop if a game would incorrectly distribute funds.
```

```diff
+   Status: CREATED
    contract FaultDisputeGame (0xC3E7f3606aeAC543bD268a637c6847E92d69B8aA)
    +++ description: Logic of the dispute game. When a state root is proposed, a dispute game contract is deployed. Challengers can use such contracts to challenge the proposed state root.
```

```diff
+   Status: CREATED
    contract Hashkey Multisig 2 (0xC7fCbE26c1Db751d63869F72F782a56710f6be5A)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1ERC721Bridge (0xd4C83D93c6fAE3E0804B785F9Cf465BE95449D04)
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
```

```diff
+   Status: CREATED
    contract DelayedWETH (0xd9c31D15f2c649e525C2574bC025b3CAafAaf6fe)
    +++ description: Contract designed to hold the bonded ETH for each game. It is designed as a wrapper around WETH to allow an owner to function as a backstop if a game would incorrectly distribute funds.
```

```diff
+   Status: CREATED
    contract OptimismPortal2 (0xe7Aa79B59CAc06F9706D896a047fEb9d3BDA8bD3)
    +++ description: The OptimismPortal contract is the main entry point to deposit funds from L1 to L2. It also allows to prove and finalize withdrawals. It specifies which game type can be used for withdrawals, which currently is the PermissionedDisputeGame.
```

```diff
+   Status: CREATED
    contract SuperchainConfig (0xfd1255b6c09D939E7F3896A16C32CDBCD6F8B40A)
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
```

Generated with discovered.json: 0x4c9de3a6a10a10c4de8dd06bcf22149d4b0e1b0b

# Diff at Mon, 14 Jul 2025 08:02:44 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@0dc82cd5064c9c6dc9fb20e2291a8bb6b2048e27 block: 22243976
- current block number: 22243976

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22243976 (main branch discovery), not current.

```diff
    contract OptimismMintableERC20Factory (0x0407af506d86bFA5e401099b2fC2355590638f19) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintableERC20 as this chain's representation of a token on the host chain, or vice-versa.
      description:
-        "A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa."
+        "A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintableERC20 as this chain's representation of a token on the host chain, or vice-versa."
    }
```

Generated with discovered.json: 0xb0bd0053e50fe2b79c9a8a21d0a5796487c13bd7

# Diff at Fri, 04 Jul 2025 12:19:02 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f56dc47fe915564d4555300304da4d3bcbc087f block: 22243976
- current block number: 22243976

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22243976 (main branch discovery), not current.

```diff
    contract Hashkey Multisig 3 (0x29Fbda675Fa5a07B621C2C1a6E3F874C14F612F3) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0x43F8DeFe3E9286D152E91BB16a248808E7247198"
+        "eth:0x43F8DeFe3E9286D152E91BB16a248808E7247198"
    }
```

```diff
    contract Hashkey Multisig 1 (0x441F31C4cdf772558D4EA31f3114de59aE145E7c) {
    +++ description: None
      receivedPermissions.0.via.0.address:
-        "ethereum:0x7986eD289935A0F47FC434C00cDE309fE2c51f1C"
+        "eth:0x7986eD289935A0F47FC434C00cDE309fE2c51f1C"
      receivedPermissions.0.from:
-        "ethereum:0x679A65aD62972Ea3561F40A12e93CcA6f79F35E6"
+        "eth:0x679A65aD62972Ea3561F40A12e93CcA6f79F35E6"
      receivedPermissions.1.from:
-        "ethereum:0xBb70D595147A141e268532BFEF61A8c25054d26D"
+        "eth:0xBb70D595147A141e268532BFEF61A8c25054d26D"
      receivedPermissions.2.from:
-        "ethereum:0xd9c31D15f2c649e525C2574bC025b3CAafAaf6fe"
+        "eth:0xd9c31D15f2c649e525C2574bC025b3CAafAaf6fe"
      receivedPermissions.3.via.0.address:
-        "ethereum:0x7986eD289935A0F47FC434C00cDE309fE2c51f1C"
+        "eth:0x7986eD289935A0F47FC434C00cDE309fE2c51f1C"
      receivedPermissions.3.from:
-        "ethereum:0x0407af506d86bFA5e401099b2fC2355590638f19"
+        "eth:0x0407af506d86bFA5e401099b2fC2355590638f19"
      receivedPermissions.4.via.0.address:
-        "ethereum:0x7986eD289935A0F47FC434C00cDE309fE2c51f1C"
+        "eth:0x7986eD289935A0F47FC434C00cDE309fE2c51f1C"
      receivedPermissions.4.from:
-        "ethereum:0x04Ec030f362CE5A0b5Fe2d4B4219f287C2EBDE50"
+        "eth:0x04Ec030f362CE5A0b5Fe2d4B4219f287C2EBDE50"
      receivedPermissions.5.via.0.address:
-        "ethereum:0x7986eD289935A0F47FC434C00cDE309fE2c51f1C"
+        "eth:0x7986eD289935A0F47FC434C00cDE309fE2c51f1C"
      receivedPermissions.5.from:
-        "ethereum:0x2171E6d3B7964fA9654Ce41dA8a8fFAff2Cc70be"
+        "eth:0x2171E6d3B7964fA9654Ce41dA8a8fFAff2Cc70be"
      receivedPermissions.6.via.0.address:
-        "ethereum:0x7986eD289935A0F47FC434C00cDE309fE2c51f1C"
+        "eth:0x7986eD289935A0F47FC434C00cDE309fE2c51f1C"
      receivedPermissions.6.from:
-        "ethereum:0x43F8DeFe3E9286D152E91BB16a248808E7247198"
+        "eth:0x43F8DeFe3E9286D152E91BB16a248808E7247198"
      receivedPermissions.7.via.0.address:
-        "ethereum:0x7986eD289935A0F47FC434C00cDE309fE2c51f1C"
+        "eth:0x7986eD289935A0F47FC434C00cDE309fE2c51f1C"
      receivedPermissions.7.from:
-        "ethereum:0x4deC2aA521108d78d983c0c12656c6CF8631F2ED"
+        "eth:0x4deC2aA521108d78d983c0c12656c6CF8631F2ED"
      receivedPermissions.8.via.0.address:
-        "ethereum:0x7986eD289935A0F47FC434C00cDE309fE2c51f1C"
+        "eth:0x7986eD289935A0F47FC434C00cDE309fE2c51f1C"
      receivedPermissions.8.from:
-        "ethereum:0x899F07862D3A03F70E07b7f01183934b485d2e97"
+        "eth:0x899F07862D3A03F70E07b7f01183934b485d2e97"
      receivedPermissions.9.via.0.address:
-        "ethereum:0x7986eD289935A0F47FC434C00cDE309fE2c51f1C"
+        "eth:0x7986eD289935A0F47FC434C00cDE309fE2c51f1C"
      receivedPermissions.9.from:
-        "ethereum:0xBb70D595147A141e268532BFEF61A8c25054d26D"
+        "eth:0xBb70D595147A141e268532BFEF61A8c25054d26D"
      receivedPermissions.10.via.0.address:
-        "ethereum:0x7986eD289935A0F47FC434C00cDE309fE2c51f1C"
+        "eth:0x7986eD289935A0F47FC434C00cDE309fE2c51f1C"
      receivedPermissions.10.from:
-        "ethereum:0xd4C83D93c6fAE3E0804B785F9Cf465BE95449D04"
+        "eth:0xd4C83D93c6fAE3E0804B785F9Cf465BE95449D04"
      receivedPermissions.11.via.0.address:
-        "ethereum:0x7986eD289935A0F47FC434C00cDE309fE2c51f1C"
+        "eth:0x7986eD289935A0F47FC434C00cDE309fE2c51f1C"
      receivedPermissions.11.from:
-        "ethereum:0xd9c31D15f2c649e525C2574bC025b3CAafAaf6fe"
+        "eth:0xd9c31D15f2c649e525C2574bC025b3CAafAaf6fe"
      receivedPermissions.12.via.0.address:
-        "ethereum:0x7986eD289935A0F47FC434C00cDE309fE2c51f1C"
+        "eth:0x7986eD289935A0F47FC434C00cDE309fE2c51f1C"
      receivedPermissions.12.from:
-        "ethereum:0xe7Aa79B59CAc06F9706D896a047fEb9d3BDA8bD3"
+        "eth:0xe7Aa79B59CAc06F9706D896a047fEb9d3BDA8bD3"
      receivedPermissions.13.via.0.address:
-        "ethereum:0x7986eD289935A0F47FC434C00cDE309fE2c51f1C"
+        "eth:0x7986eD289935A0F47FC434C00cDE309fE2c51f1C"
      receivedPermissions.13.from:
-        "ethereum:0xfd1255b6c09D939E7F3896A16C32CDBCD6F8B40A"
+        "eth:0xfd1255b6c09D939E7F3896A16C32CDBCD6F8B40A"
      directlyReceivedPermissions.0.from:
-        "ethereum:0x7986eD289935A0F47FC434C00cDE309fE2c51f1C"
+        "eth:0x7986eD289935A0F47FC434C00cDE309fE2c51f1C"
    }
```

```diff
    contract ProxyAdmin (0x7986eD289935A0F47FC434C00cDE309fE2c51f1C) {
    +++ description: None
      directlyReceivedPermissions.0.from:
-        "ethereum:0x679A65aD62972Ea3561F40A12e93CcA6f79F35E6"
+        "eth:0x679A65aD62972Ea3561F40A12e93CcA6f79F35E6"
      directlyReceivedPermissions.1.from:
-        "ethereum:0x0407af506d86bFA5e401099b2fC2355590638f19"
+        "eth:0x0407af506d86bFA5e401099b2fC2355590638f19"
      directlyReceivedPermissions.2.from:
-        "ethereum:0x04Ec030f362CE5A0b5Fe2d4B4219f287C2EBDE50"
+        "eth:0x04Ec030f362CE5A0b5Fe2d4B4219f287C2EBDE50"
      directlyReceivedPermissions.3.from:
-        "ethereum:0x2171E6d3B7964fA9654Ce41dA8a8fFAff2Cc70be"
+        "eth:0x2171E6d3B7964fA9654Ce41dA8a8fFAff2Cc70be"
      directlyReceivedPermissions.4.from:
-        "ethereum:0x43F8DeFe3E9286D152E91BB16a248808E7247198"
+        "eth:0x43F8DeFe3E9286D152E91BB16a248808E7247198"
      directlyReceivedPermissions.5.from:
-        "ethereum:0x4deC2aA521108d78d983c0c12656c6CF8631F2ED"
+        "eth:0x4deC2aA521108d78d983c0c12656c6CF8631F2ED"
      directlyReceivedPermissions.6.from:
-        "ethereum:0x899F07862D3A03F70E07b7f01183934b485d2e97"
+        "eth:0x899F07862D3A03F70E07b7f01183934b485d2e97"
      directlyReceivedPermissions.7.from:
-        "ethereum:0xBb70D595147A141e268532BFEF61A8c25054d26D"
+        "eth:0xBb70D595147A141e268532BFEF61A8c25054d26D"
      directlyReceivedPermissions.8.from:
-        "ethereum:0xd4C83D93c6fAE3E0804B785F9Cf465BE95449D04"
+        "eth:0xd4C83D93c6fAE3E0804B785F9Cf465BE95449D04"
      directlyReceivedPermissions.9.from:
-        "ethereum:0xd9c31D15f2c649e525C2574bC025b3CAafAaf6fe"
+        "eth:0xd9c31D15f2c649e525C2574bC025b3CAafAaf6fe"
      directlyReceivedPermissions.10.from:
-        "ethereum:0xe7Aa79B59CAc06F9706D896a047fEb9d3BDA8bD3"
+        "eth:0xe7Aa79B59CAc06F9706D896a047fEb9d3BDA8bD3"
      directlyReceivedPermissions.11.from:
-        "ethereum:0xfd1255b6c09D939E7F3896A16C32CDBCD6F8B40A"
+        "eth:0xfd1255b6c09D939E7F3896A16C32CDBCD6F8B40A"
    }
```

```diff
    EOA  (0xC55763132E9b76766D62e59728b3933F54C998C5) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0x78075eA46A562c3201E61664645c0f0537a8DDd5"
+        "eth:0x78075eA46A562c3201E61664645c0f0537a8DDd5"
    }
```

```diff
    contract Hashkey Multisig 2 (0xC7fCbE26c1Db751d63869F72F782a56710f6be5A) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0xfd1255b6c09D939E7F3896A16C32CDBCD6F8B40A"
+        "eth:0xfd1255b6c09D939E7F3896A16C32CDBCD6F8B40A"
    }
```

```diff
    EOA  (0xf09ebb62b5ba0cf402b77aBA61691cBCf005206f) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0x43F8DeFe3E9286D152E91BB16a248808E7247198"
+        "eth:0x43F8DeFe3E9286D152E91BB16a248808E7247198"
    }
```

```diff
    EOA  (0xFCF35CeE40325db21c3dc5b45849251E78Be47eb) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0x78075eA46A562c3201E61664645c0f0537a8DDd5"
+        "eth:0x78075eA46A562c3201E61664645c0f0537a8DDd5"
    }
```

Generated with discovered.json: 0xcb29b7b11d981c24ef6d68e6faae3338cba71ae7

# Diff at Mon, 16 Jun 2025 10:14:38 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@e1208475abce20cea1768d2e4878c03350c1b7c9 block: 22243976
- current block number: 22243976

## Description

Config: add permissioned opfp role tags.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22243976 (main branch discovery), not current.

```diff
    contract Hashkey Multisig 1 (0x441F31C4cdf772558D4EA31f3114de59aE145E7c) {
    +++ description: None
      receivedPermissions.13:
+        {"permission":"upgrade","from":"ethereum:0xd4C83D93c6fAE3E0804B785F9Cf465BE95449D04","role":"admin","via":[{"address":"ethereum:0x7986eD289935A0F47FC434C00cDE309fE2c51f1C"}]}
      receivedPermissions.12.from:
-        "ethereum:0xd4C83D93c6fAE3E0804B785F9Cf465BE95449D04"
+        "ethereum:0x43F8DeFe3E9286D152E91BB16a248808E7247198"
      receivedPermissions.11.from:
-        "ethereum:0x43F8DeFe3E9286D152E91BB16a248808E7247198"
+        "ethereum:0x899F07862D3A03F70E07b7f01183934b485d2e97"
    }
```

```diff
    contract ProxyAdmin (0x7986eD289935A0F47FC434C00cDE309fE2c51f1C) {
    +++ description: None
      directlyReceivedPermissions.11:
+        {"permission":"upgrade","from":"ethereum:0xd4C83D93c6fAE3E0804B785F9Cf465BE95449D04","role":"admin"}
      directlyReceivedPermissions.10.from:
-        "ethereum:0xd4C83D93c6fAE3E0804B785F9Cf465BE95449D04"
+        "ethereum:0x43F8DeFe3E9286D152E91BB16a248808E7247198"
      directlyReceivedPermissions.9.from:
-        "ethereum:0x43F8DeFe3E9286D152E91BB16a248808E7247198"
+        "ethereum:0x899F07862D3A03F70E07b7f01183934b485d2e97"
    }
```

```diff
    contract L1CrossDomainMessenger (0x899F07862D3A03F70E07b7f01183934b485d2e97) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      values.$admin:
+        "0x7986eD289935A0F47FC434C00cDE309fE2c51f1C"
    }
```

```diff
    EOA  (0xC55763132E9b76766D62e59728b3933F54C998C5) {
    +++ description: None
      receivedPermissions:
+        [{"permission":"propose","from":"ethereum:0x78075eA46A562c3201E61664645c0f0537a8DDd5","role":".proposer"}]
    }
```

```diff
    EOA  (0xFCF35CeE40325db21c3dc5b45849251E78Be47eb) {
    +++ description: None
      receivedPermissions:
+        [{"permission":"challenge","from":"ethereum:0x78075eA46A562c3201E61664645c0f0537a8DDd5","role":".challenger"}]
    }
```

Generated with discovered.json: 0x018cc95ecfc26c1589f24bd8cab845cf00c14f07

# Diff at Fri, 30 May 2025 06:59:37 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@a4d8c436027d17df0f9b76843cd6deb1888fa381 block: 22243976
- current block number: 22243976

## Description

config: change comment about eip1559 fee val

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22243976 (main branch discovery), not current.

```diff
    contract SystemConfig (0x43F8DeFe3E9286D152E91BB16a248808E7247198) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      fieldMeta.eip1559Denominator:
+        {"description":"volatility param: lower denominator -> quicker fee changes on L2"}
    }
```

Generated with discovered.json: 0x16172b17a891a3ea469bbc4c62701d18431ce9ee

# Diff at Fri, 23 May 2025 09:40:57 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@69cd181abbc3c830a6caf2f4429b37cae72ffdb8 block: 22243976
- current block number: 22243976

## Description

Introduced .role field on each permission, defaulting to field name on which it was defined (with '.' prefix)

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22243976 (main branch discovery), not current.

```diff
    contract Hashkey Multisig 3 (0x29Fbda675Fa5a07B621C2C1a6E3F874C14F612F3) {
    +++ description: None
      receivedPermissions.0.role:
+        ".owner"
    }
```

```diff
    contract Hashkey Multisig 1 (0x441F31C4cdf772558D4EA31f3114de59aE145E7c) {
    +++ description: None
      receivedPermissions.12.permission:
-        "interact"
+        "upgrade"
      receivedPermissions.12.from:
-        "0xBb70D595147A141e268532BFEF61A8c25054d26D"
+        "0xd4C83D93c6fAE3E0804B785F9Cf465BE95449D04"
      receivedPermissions.12.description:
-        "can pull funds from the contract in case of emergency."
      receivedPermissions.12.role:
+        "admin"
      receivedPermissions.12.via:
+        [{"address":"0x7986eD289935A0F47FC434C00cDE309fE2c51f1C"}]
      receivedPermissions.11.from:
-        "0xd4C83D93c6fAE3E0804B785F9Cf465BE95449D04"
+        "0x0407af506d86bFA5e401099b2fC2355590638f19"
      receivedPermissions.11.role:
+        "admin"
      receivedPermissions.10.permission:
-        "interact"
+        "upgrade"
      receivedPermissions.10.from:
-        "0xd9c31D15f2c649e525C2574bC025b3CAafAaf6fe"
+        "0xBb70D595147A141e268532BFEF61A8c25054d26D"
      receivedPermissions.10.description:
-        "can pull funds from the contract in case of emergency."
      receivedPermissions.10.role:
+        "admin"
      receivedPermissions.10.via:
+        [{"address":"0x7986eD289935A0F47FC434C00cDE309fE2c51f1C"}]
      receivedPermissions.9.from:
-        "0x0407af506d86bFA5e401099b2fC2355590638f19"
+        "0x43F8DeFe3E9286D152E91BB16a248808E7247198"
      receivedPermissions.9.role:
+        "admin"
      receivedPermissions.8.from:
-        "0xBb70D595147A141e268532BFEF61A8c25054d26D"
+        "0x04Ec030f362CE5A0b5Fe2d4B4219f287C2EBDE50"
      receivedPermissions.8.role:
+        "admin"
      receivedPermissions.7.from:
-        "0x43F8DeFe3E9286D152E91BB16a248808E7247198"
+        "0xfd1255b6c09D939E7F3896A16C32CDBCD6F8B40A"
      receivedPermissions.7.role:
+        "admin"
      receivedPermissions.6.from:
-        "0x04Ec030f362CE5A0b5Fe2d4B4219f287C2EBDE50"
+        "0xd9c31D15f2c649e525C2574bC025b3CAafAaf6fe"
      receivedPermissions.6.role:
+        "admin"
      receivedPermissions.5.from:
-        "0xfd1255b6c09D939E7F3896A16C32CDBCD6F8B40A"
+        "0x4deC2aA521108d78d983c0c12656c6CF8631F2ED"
      receivedPermissions.5.role:
+        "admin"
      receivedPermissions.4.permission:
-        "upgrade"
+        "interact"
      receivedPermissions.4.from:
-        "0xd9c31D15f2c649e525C2574bC025b3CAafAaf6fe"
+        "0xBb70D595147A141e268532BFEF61A8c25054d26D"
      receivedPermissions.4.via:
-        [{"address":"0x7986eD289935A0F47FC434C00cDE309fE2c51f1C"}]
      receivedPermissions.4.description:
+        "can pull funds from the contract in case of emergency."
      receivedPermissions.4.role:
+        ".owner"
      receivedPermissions.3.permission:
-        "upgrade"
+        "interact"
      receivedPermissions.3.from:
-        "0x4deC2aA521108d78d983c0c12656c6CF8631F2ED"
+        "0xd9c31D15f2c649e525C2574bC025b3CAafAaf6fe"
      receivedPermissions.3.via:
-        [{"address":"0x7986eD289935A0F47FC434C00cDE309fE2c51f1C"}]
      receivedPermissions.3.description:
+        "can pull funds from the contract in case of emergency."
      receivedPermissions.3.role:
+        ".owner"
      receivedPermissions.2.role:
+        "admin"
      receivedPermissions.1.role:
+        ".owner"
      receivedPermissions.0.role:
+        ".$admin"
      directlyReceivedPermissions.0.role:
+        ".owner"
    }
```

```diff
    contract ProxyAdmin (0x7986eD289935A0F47FC434C00cDE309fE2c51f1C) {
    +++ description: None
      directlyReceivedPermissions.10.role:
+        "admin"
      directlyReceivedPermissions.9.role:
+        "admin"
      directlyReceivedPermissions.8.role:
+        "admin"
      directlyReceivedPermissions.7.role:
+        "admin"
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
      directlyReceivedPermissions.1.role:
+        ".owner"
      directlyReceivedPermissions.0.role:
+        ".$admin"
    }
```

```diff
    contract Hashkey Multisig 2 (0xC7fCbE26c1Db751d63869F72F782a56710f6be5A) {
    +++ description: None
      receivedPermissions.0.role:
+        ".guardian"
    }
```

```diff
    EOA  (0xf09ebb62b5ba0cf402b77aBA61691cBCf005206f) {
    +++ description: None
      receivedPermissions.0.role:
+        ".batcherHash"
    }
```

Generated with discovered.json: 0xff9e596b595c5ad1bf3593d048167abb96b1c7c3

# Diff at Thu, 08 May 2025 10:03:00 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@8e1926142ab0c57cc131de4d8da307e13d9af54d block: 22243976
- current block number: 22243976

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22243976 (main branch discovery), not current.

```diff
    contract PermissionedDisputeGame (0x78075eA46A562c3201E61664645c0f0537a8DDd5) {
    +++ description: Same as FaultDisputeGame, but only two permissioned addresses are designated as proposer and challenger.
      usedTypes.0.arg.0x03682932cec7ce0a3874b19675a6bbc923054a7b321efc7d3835187b172494b6:
+        "v1.6.0 (cannon64)"
    }
```

```diff
    contract FaultDisputeGame (0xC3E7f3606aeAC543bD268a637c6847E92d69B8aA) {
    +++ description: Logic of the dispute game. When a state root is proposed, a dispute game contract is deployed. Challengers can use such contracts to challenge the proposed state root.
      usedTypes.0.arg.0x03682932cec7ce0a3874b19675a6bbc923054a7b321efc7d3835187b172494b6:
+        "v1.6.0 (cannon64)"
    }
```

Generated with discovered.json: 0x78d825d4a7e7c3fe48acfddc610aa027c65dd766

# Diff at Tue, 29 Apr 2025 08:19:04 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@ef7477af00fe0b57a2f7cacf7e958c12494af662 block: 22243976
- current block number: 22243976

## Description

Field .issuedPermissions is removed from the output as no longer needed. Added 'permissionsConfigHash' due to refactoring of the modelling process (into a separate command).

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22243976 (main branch discovery), not current.

```diff
    contract OptimismMintableERC20Factory (0x0407af506d86bFA5e401099b2fC2355590638f19) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x441F31C4cdf772558D4EA31f3114de59aE145E7c","via":[{"address":"0x7986eD289935A0F47FC434C00cDE309fE2c51f1C"}]}]
    }
```

```diff
    contract DisputeGameFactory (0x04Ec030f362CE5A0b5Fe2d4B4219f287C2EBDE50) {
    +++ description: The dispute game factory allows the creation of dispute games, used to propose state roots and eventually challenge them.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x441F31C4cdf772558D4EA31f3114de59aE145E7c","via":[{"address":"0x7986eD289935A0F47FC434C00cDE309fE2c51f1C"}]}]
    }
```

```diff
    contract L1StandardBridge (0x2171E6d3B7964fA9654Ce41dA8a8fFAff2Cc70be) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x441F31C4cdf772558D4EA31f3114de59aE145E7c","description":"upgrading the bridge implementation can give access to all funds escrowed therein.","via":[{"address":"0x7986eD289935A0F47FC434C00cDE309fE2c51f1C"}]}]
    }
```

```diff
    contract SystemConfig (0x43F8DeFe3E9286D152E91BB16a248808E7247198) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      issuedPermissions:
-        [{"permission":"interact","to":"0x29Fbda675Fa5a07B621C2C1a6E3F874C14F612F3","description":"it can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system.","via":[]},{"permission":"sequence","to":"0xf09ebb62b5ba0cf402b77aBA61691cBCf005206f","via":[]},{"permission":"upgrade","to":"0x441F31C4cdf772558D4EA31f3114de59aE145E7c","via":[{"address":"0x7986eD289935A0F47FC434C00cDE309fE2c51f1C"}]}]
    }
```

```diff
    contract AnchorStateRegistry (0x4deC2aA521108d78d983c0c12656c6CF8631F2ED) {
    +++ description: Contains the latest confirmed state root that can be used as a starting point in a dispute game.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x441F31C4cdf772558D4EA31f3114de59aE145E7c","via":[{"address":"0x7986eD289935A0F47FC434C00cDE309fE2c51f1C"}]}]
    }
```

```diff
    contract AddressManager (0x679A65aD62972Ea3561F40A12e93CcA6f79F35E6) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      issuedPermissions:
-        [{"permission":"interact","to":"0x441F31C4cdf772558D4EA31f3114de59aE145E7c","description":"set and change address mappings.","via":[{"address":"0x7986eD289935A0F47FC434C00cDE309fE2c51f1C"}]}]
    }
```

```diff
    contract DelayedWETH (0xBb70D595147A141e268532BFEF61A8c25054d26D) {
    +++ description: Contract designed to hold the bonded ETH for each game. It is designed as a wrapper around WETH to allow an owner to function as a backstop if a game would incorrectly distribute funds.
      issuedPermissions:
-        [{"permission":"interact","to":"0x441F31C4cdf772558D4EA31f3114de59aE145E7c","description":"can pull funds from the contract in case of emergency.","via":[]},{"permission":"upgrade","to":"0x441F31C4cdf772558D4EA31f3114de59aE145E7c","via":[{"address":"0x7986eD289935A0F47FC434C00cDE309fE2c51f1C"}]}]
    }
```

```diff
    contract L1ERC721Bridge (0xd4C83D93c6fAE3E0804B785F9Cf465BE95449D04) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x441F31C4cdf772558D4EA31f3114de59aE145E7c","via":[{"address":"0x7986eD289935A0F47FC434C00cDE309fE2c51f1C"}]}]
    }
```

```diff
    contract DelayedWETH (0xd9c31D15f2c649e525C2574bC025b3CAafAaf6fe) {
    +++ description: Contract designed to hold the bonded ETH for each game. It is designed as a wrapper around WETH to allow an owner to function as a backstop if a game would incorrectly distribute funds.
      issuedPermissions:
-        [{"permission":"interact","to":"0x441F31C4cdf772558D4EA31f3114de59aE145E7c","description":"can pull funds from the contract in case of emergency.","via":[]},{"permission":"upgrade","to":"0x441F31C4cdf772558D4EA31f3114de59aE145E7c","via":[{"address":"0x7986eD289935A0F47FC434C00cDE309fE2c51f1C"}]}]
    }
```

```diff
    contract OptimismPortal2 (0xe7Aa79B59CAc06F9706D896a047fEb9d3BDA8bD3) {
    +++ description: The OptimismPortal contract is the main entry point to deposit funds from L1 to L2. It also allows to prove and finalize withdrawals. It specifies which game type can be used for withdrawals, which currently is the PermissionedDisputeGame.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x441F31C4cdf772558D4EA31f3114de59aE145E7c","via":[{"address":"0x7986eD289935A0F47FC434C00cDE309fE2c51f1C"}]}]
    }
```

```diff
    contract SuperchainConfig (0xfd1255b6c09D939E7F3896A16C32CDBCD6F8B40A) {
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      issuedPermissions:
-        [{"permission":"guard","to":"0xC7fCbE26c1Db751d63869F72F782a56710f6be5A","via":[]},{"permission":"upgrade","to":"0x441F31C4cdf772558D4EA31f3114de59aE145E7c","via":[{"address":"0x7986eD289935A0F47FC434C00cDE309fE2c51f1C"}]}]
    }
```

Generated with discovered.json: 0x34425974767d48b5d9d0ca5c8101dae12a89badf

# Diff at Fri, 11 Apr 2025 13:15:49 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@b607477490db79d49274f7585039ac7263456118 block: 22243976
- current block number: 22243976

## Description

Config: global mapping updated for op stack prestates.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22243976 (main branch discovery), not current.

```diff
    contract PermissionedDisputeGame (0x78075eA46A562c3201E61664645c0f0537a8DDd5) {
    +++ description: Same as FaultDisputeGame, but only two permissioned addresses are designated as proposer and challenger.
      usedTypes.0.arg.0x03ee2917da962ec266b091f4b62121dc9682bb0db534633707325339f99ee405:
+        "v1.5.1-rc.1 (cannon64)"
      usedTypes.0.arg.0x0354eee87a1775d96afee8977ef6d5d6bd3612b256170952a01bf1051610ee01:
+        "v1.5.1-rc.1"
      usedTypes.0.arg.0x039970872142f48b189d18dcbc03a3737338d098b0101713dc2d6710f9deb5ef:
+        "v1.5.0 (cannon64)"
      usedTypes.0.arg.0x039facea52b20c605c05efb0a33560a92de7074218998f75bcdf61e8989cb5d9:
+        "v1.5.0"
      usedTypes.0.arg.0x0336751a224445089ba5456c8028376a0faf2bafa81d35f43fab8730258cdf37:
+        "v1.4.0-unichain"
    }
```

```diff
    contract FaultDisputeGame (0xC3E7f3606aeAC543bD268a637c6847E92d69B8aA) {
    +++ description: Logic of the dispute game. When a state root is proposed, a dispute game contract is deployed. Challengers can use such contracts to challenge the proposed state root.
      usedTypes.0.arg.0x03ee2917da962ec266b091f4b62121dc9682bb0db534633707325339f99ee405:
+        "v1.5.1-rc.1 (cannon64)"
      usedTypes.0.arg.0x0354eee87a1775d96afee8977ef6d5d6bd3612b256170952a01bf1051610ee01:
+        "v1.5.1-rc.1"
      usedTypes.0.arg.0x039970872142f48b189d18dcbc03a3737338d098b0101713dc2d6710f9deb5ef:
+        "v1.5.0 (cannon64)"
      usedTypes.0.arg.0x039facea52b20c605c05efb0a33560a92de7074218998f75bcdf61e8989cb5d9:
+        "v1.5.0"
      usedTypes.0.arg.0x0336751a224445089ba5456c8028376a0faf2bafa81d35f43fab8730258cdf37:
+        "v1.4.0-unichain"
    }
```

Generated with discovered.json: 0xf2343d384ae34d4a9cbc8b06f91a393e234e552b

# Diff at Fri, 11 Apr 2025 06:42:55 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@a946e9842245b891a11dfd66e5a103281bde27da block: 22081892
- current block number: 22243976

## Description

batcherHash changed, added nonTemplateTrackedTransactions.
Config: anchorGame ignored.

## Watched changes

```diff
    contract DisputeGameFactory (0x04Ec030f362CE5A0b5Fe2d4B4219f287C2EBDE50) {
    +++ description: The dispute game factory allows the creation of dispute games, used to propose state roots and eventually challenge them.
      values.gameImpls.4:
-        "0x3fEF4F3e99936E89A8bBdD9E08D83c471D5E152D"
+        "0x78075eA46A562c3201E61664645c0f0537a8DDd5"
    }
```

```diff
-   Status: DELETED
    contract PermissionedDisputeGame (0x3fEF4F3e99936E89A8bBdD9E08D83c471D5E152D)
    +++ description: Same as FaultDisputeGame, but only two permissioned addresses are designated as proposer and challenger.
```

```diff
    contract SystemConfig (0x43F8DeFe3E9286D152E91BB16a248808E7247198) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      issuedPermissions.1.permission:
-        "sequence"
+        "upgrade"
      issuedPermissions.1.to:
-        "0x9391791f7CB74F8BFDA65edc0749efd964311b55"
+        "0x441F31C4cdf772558D4EA31f3114de59aE145E7c"
      issuedPermissions.1.via.0:
+        {"address":"0x7986eD289935A0F47FC434C00cDE309fE2c51f1C"}
      issuedPermissions.0.permission:
-        "upgrade"
+        "sequence"
      issuedPermissions.0.to:
-        "0x441F31C4cdf772558D4EA31f3114de59aE145E7c"
+        "0xf09ebb62b5ba0cf402b77aBA61691cBCf005206f"
      issuedPermissions.0.via.0:
-        {"address":"0x7986eD289935A0F47FC434C00cDE309fE2c51f1C"}
      values.batcherHash:
-        "0x9391791f7CB74F8BFDA65edc0749efd964311b55"
+        "0xf09ebb62b5ba0cf402b77aBA61691cBCf005206f"
      values.unsafeBlockSigner:
-        "0xBc80De532cf87543aaD3267Cc8A4cAA2813130E7"
+        "0xCc467FdB41B5b5A4E23021CAd69ED27550a41694"
    }
```

```diff
+   Status: CREATED
    contract PermissionedDisputeGame (0x78075eA46A562c3201E61664645c0f0537a8DDd5)
    +++ description: Same as FaultDisputeGame, but only two permissioned addresses are designated as proposer and challenger.
```

Generated with discovered.json: 0x651dc10812ef91726304aa73dbe185bef077f2b4

# Diff at Fri, 04 Apr 2025 09:24:34 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@b3154c4385e52c9ffc0dab984c207390e5ccc13d block: 22081892
- current block number: 22081892

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22081892 (main branch discovery), not current.

```diff
    contract Hashkey Multisig 1 (0x441F31C4cdf772558D4EA31f3114de59aE145E7c) {
    +++ description: None
      receivedPermissions.12:
+        {"permission":"interact","from":"0xBb70D595147A141e268532BFEF61A8c25054d26D","description":"can pull funds from the contract in case of emergency."}
      receivedPermissions.11:
+        {"permission":"upgrade","from":"0xd4C83D93c6fAE3E0804B785F9Cf465BE95449D04","via":[{"address":"0x7986eD289935A0F47FC434C00cDE309fE2c51f1C"}]}
      receivedPermissions.10.permission:
-        "upgrade"
+        "interact"
      receivedPermissions.10.from:
-        "0xd4C83D93c6fAE3E0804B785F9Cf465BE95449D04"
+        "0xd9c31D15f2c649e525C2574bC025b3CAafAaf6fe"
      receivedPermissions.10.via:
-        [{"address":"0x7986eD289935A0F47FC434C00cDE309fE2c51f1C"}]
      receivedPermissions.10.description:
+        "can pull funds from the contract in case of emergency."
    }
```

```diff
    contract DelayedWETH (0xBb70D595147A141e268532BFEF61A8c25054d26D) {
    +++ description: Contract designed to hold the bonded ETH for each game. It is designed as a wrapper around WETH to allow an owner to function as a backstop if a game would incorrectly distribute funds.
      issuedPermissions.1:
+        {"permission":"interact","to":"0x441F31C4cdf772558D4EA31f3114de59aE145E7c","description":"can pull funds from the contract in case of emergency.","via":[]}
    }
```

```diff
    contract DelayedWETH (0xd9c31D15f2c649e525C2574bC025b3CAafAaf6fe) {
    +++ description: Contract designed to hold the bonded ETH for each game. It is designed as a wrapper around WETH to allow an owner to function as a backstop if a game would incorrectly distribute funds.
      issuedPermissions.1:
+        {"permission":"interact","to":"0x441F31C4cdf772558D4EA31f3114de59aE145E7c","description":"can pull funds from the contract in case of emergency.","via":[]}
    }
```

Generated with discovered.json: 0x2fe2a9a67c32b28da60823e8ff511363f2150789

# Diff at Thu, 27 Mar 2025 11:14:24 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@8cc2e36080df3a74dfd8475d41c64f46203f5218 block: 22081892
- current block number: 22081892

## Description

Config related: add guardian description details, hide some noisy values, hide AddressManager as spam cat, add proposer / challenger to permissioned opfp chains.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22081892 (main branch discovery), not current.

```diff
    contract AddressManager (0x679A65aD62972Ea3561F40A12e93CcA6f79F35E6) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      category:
+        {"name":"Spam","priority":-1}
    }
```

Generated with discovered.json: 0x0e3c8f012c252da8bdcfd0b243c6ad87c7919070

# Diff at Wed, 19 Mar 2025 15:45:13 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@4609d8355d7594946b66bef47876090fce6b0842 block: 21680579
- current block number: 22081892

## Description

Ignore.

## Watched changes

```diff
    contract DelayedWETH (0xd9c31D15f2c649e525C2574bC025b3CAafAaf6fe) {
    +++ description: Contract designed to hold the bonded ETH for each game. It is designed as a wrapper around WETH to allow an owner to function as a backstop if a game would incorrectly distribute funds.
      values.owner:
-        "0xa31d8CDDf0D931Dfda2C9D03E35bd8b5d3A6aEC9"
+        "0x441F31C4cdf772558D4EA31f3114de59aE145E7c"
    }
```

Generated with discovered.json: 0xd6c97df3b74fc191d918c81da667c8887e79245a

# Diff at Tue, 18 Mar 2025 08:12:53 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@4ef7a8dbcec1cd9fec77aae2b73d81347a4ffb13 block: 21680579
- current block number: 21680579

## Description

Config: change Multisig names.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21680579 (main branch discovery), not current.

```diff
    contract Hashkey Multisig 3 (0x29Fbda675Fa5a07B621C2C1a6E3F874C14F612F3) {
    +++ description: None
      name:
-        "HashkeyOpsMultisig"
+        "Hashkey Multisig 3"
    }
```

```diff
    contract Hashkey Multisig 1 (0x441F31C4cdf772558D4EA31f3114de59aE145E7c) {
    +++ description: None
      name:
-        "HashkeyUpgradeMultisig"
+        "Hashkey Multisig 1"
    }
```

```diff
    contract Hashkey Multisig 2 (0xC7fCbE26c1Db751d63869F72F782a56710f6be5A) {
    +++ description: None
      name:
-        "HashkeyGuardianMultisig"
+        "Hashkey Multisig 2"
    }
```

Generated with discovered.json: 0x7ac57517f8403e7b8c906f7b419ec3e32048218f

# Diff at Tue, 04 Mar 2025 11:25:46 GMT:

- author: Michał Podsiadły (<michal.podsiadly@l2beat.com>)
- comparing to: main@be38e12d3ff947ca8de40f3a23a9ba1875a54f5a block: 21680579
- current block number: 21680579

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21680579 (main branch discovery), not current.

```diff
    contract SystemConfig (0x43F8DeFe3E9286D152E91BB16a248808E7247198) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      values.opStackDA.isSomeTxsLengthEqualToCelestiaDAExample:
-        false
      values.opStackDA.isUsingCelestia:
+        false
    }
```

Generated with discovered.json: 0xa30878174564cbe6a36fa928de6d7a82a230dd4e

# Diff at Tue, 04 Mar 2025 10:39:14 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@98d260b45fe0d2195ce5e629bd7b200c8706e8ba block: 21680579
- current block number: 21680579

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21680579 (main branch discovery), not current.

```diff
    contract OptimismMintableERC20Factory (0x0407af506d86bFA5e401099b2fC2355590638f19) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      sinceBlock:
+        21414643
    }
```

```diff
    contract DisputeGameFactory (0x04Ec030f362CE5A0b5Fe2d4B4219f287C2EBDE50) {
    +++ description: The dispute game factory allows the creation of dispute games, used to propose state roots and eventually challenge them.
      sinceBlock:
+        21414645
    }
```

```diff
    contract L1StandardBridge (0x2171E6d3B7964fA9654Ce41dA8a8fFAff2Cc70be) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      sinceBlock:
+        21414641
    }
```

```diff
    contract HashkeyOpsMultisig (0x29Fbda675Fa5a07B621C2C1a6E3F874C14F612F3) {
    +++ description: None
      sinceBlock:
+        21377718
    }
```

```diff
    contract PermissionedDisputeGame (0x3fEF4F3e99936E89A8bBdD9E08D83c471D5E152D) {
    +++ description: Same as FaultDisputeGame, but only two permissioned addresses are designated as proposer and challenger.
      sinceBlock:
+        21414684
    }
```

```diff
    contract SystemConfig (0x43F8DeFe3E9286D152E91BB16a248808E7247198) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      sinceBlock:
+        21414640
    }
```

```diff
    contract HashkeyUpgradeMultisig (0x441F31C4cdf772558D4EA31f3114de59aE145E7c) {
    +++ description: None
      sinceBlock:
+        21414630
    }
```

```diff
    contract AnchorStateRegistry (0x4deC2aA521108d78d983c0c12656c6CF8631F2ED) {
    +++ description: Contains the latest confirmed state root that can be used as a starting point in a dispute game.
      sinceBlock:
+        21414649
    }
```

```diff
    contract PreimageOracle (0x5B9bEf4d8C36FB013c70d0A6F455807c6BD5270b) {
    +++ description: The PreimageOracle contract is used to load the required data from L1 for a dispute game.
      sinceBlock:
+        21414662
    }
```

```diff
    contract AddressManager (0x679A65aD62972Ea3561F40A12e93CcA6f79F35E6) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      sinceBlock:
+        21414630
    }
```

```diff
    contract MIPS (0x7447b25b91336127042CC6899B2C15668a1Ab8BA) {
    +++ description: The MIPS contract is used to execute the final step of the dispute game which objectively determines the winner of the dispute.
      sinceBlock:
+        21414663
    }
```

```diff
    contract ProxyAdmin (0x7986eD289935A0F47FC434C00cDE309fE2c51f1C) {
    +++ description: None
      sinceBlock:
+        21414630
    }
```

```diff
    contract L1CrossDomainMessenger (0x899F07862D3A03F70E07b7f01183934b485d2e97) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      sinceBlock:
+        21414642
    }
```

```diff
    contract DelayedWETH (0xBb70D595147A141e268532BFEF61A8c25054d26D) {
    +++ description: Contract designed to hold the bonded ETH for each game. It is designed as a wrapper around WETH to allow an owner to function as a backstop if a game would incorrectly distribute funds.
      sinceBlock:
+        21414647
    }
```

```diff
    contract FaultDisputeGame (0xC3E7f3606aeAC543bD268a637c6847E92d69B8aA) {
    +++ description: Logic of the dispute game. When a state root is proposed, a dispute game contract is deployed. Challengers can use such contracts to challenge the proposed state root.
      sinceBlock:
+        21414682
    }
```

```diff
    contract HashkeyGuardianMultisig (0xC7fCbE26c1Db751d63869F72F782a56710f6be5A) {
    +++ description: None
      sinceBlock:
+        21377739
    }
```

```diff
    contract L1ERC721Bridge (0xd4C83D93c6fAE3E0804B785F9Cf465BE95449D04) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      sinceBlock:
+        21414644
    }
```

```diff
    contract DelayedWETH (0xd9c31D15f2c649e525C2574bC025b3CAafAaf6fe) {
    +++ description: Contract designed to hold the bonded ETH for each game. It is designed as a wrapper around WETH to allow an owner to function as a backstop if a game would incorrectly distribute funds.
      sinceBlock:
+        21414648
    }
```

```diff
    contract OptimismPortal2 (0xe7Aa79B59CAc06F9706D896a047fEb9d3BDA8bD3) {
    +++ description: The OptimismPortal contract is the main entry point to deposit funds from L1 to L2. It also allows to prove and finalize withdrawals. It specifies which game type can be used for withdrawals, which currently is the PermissionedDisputeGame.
      sinceBlock:
+        21414639
    }
```

```diff
    contract SuperchainConfig (0xfd1255b6c09D939E7F3896A16C32CDBCD6F8B40A) {
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      sinceBlock:
+        21414631
    }
```

Generated with discovered.json: 0x5e044da9333a3ba156ee3ca0563ffa62a6b64bf4

# Diff at Thu, 27 Feb 2025 12:01:44 GMT:

- author: Michał Podsiadły (<michal.podsiadly@l2beat.com>)
- comparing to: main@a4b50e45bb44f8ceeea29f9236088d26a843c885 block: 21680579
- current block number: 21680579

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21680579 (main branch discovery), not current.

```diff
    contract OptimismPortal2 (0xe7Aa79B59CAc06F9706D896a047fEb9d3BDA8bD3) {
    +++ description: The OptimismPortal contract is the main entry point to deposit funds from L1 to L2. It also allows to prove and finalize withdrawals. It specifies which game type can be used for withdrawals, which currently is the PermissionedDisputeGame.
      displayName:
-        "OptimismPortal"
    }
```

Generated with discovered.json: 0x0448fe6d0fb2b41934c5c7e4228520cf11166d23

# Diff at Wed, 26 Feb 2025 10:32:50 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@18513668f913fbe57a197f43655b19111df0e627 block: 21680579
- current block number: 21680579

## Description

config related: added categories for all opstack, op stack and polygoncdk stack templates.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21680579 (main branch discovery), not current.

```diff
    contract DisputeGameFactory (0x04Ec030f362CE5A0b5Fe2d4B4219f287C2EBDE50) {
    +++ description: The dispute game factory allows the creation of dispute games, used to propose state roots and eventually challenge them.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract L1StandardBridge (0x2171E6d3B7964fA9654Ce41dA8a8fFAff2Cc70be) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      category:
+        {"name":"Canonical Bridges","priority":2}
    }
```

```diff
    contract SystemConfig (0x43F8DeFe3E9286D152E91BB16a248808E7247198) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract L1CrossDomainMessenger (0x899F07862D3A03F70E07b7f01183934b485d2e97) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      category:
+        {"name":"Canonical Bridges","priority":2}
    }
```

```diff
    contract L1ERC721Bridge (0xd4C83D93c6fAE3E0804B785F9Cf465BE95449D04) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      category:
+        {"name":"Canonical Bridges","priority":2}
    }
```

```diff
    contract OptimismPortal2 (0xe7Aa79B59CAc06F9706D896a047fEb9d3BDA8bD3) {
    +++ description: The OptimismPortal contract is the main entry point to deposit funds from L1 to L2. It also allows to prove and finalize withdrawals. It specifies which game type can be used for withdrawals, which currently is the PermissionedDisputeGame.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract SuperchainConfig (0xfd1255b6c09D939E7F3896A16C32CDBCD6F8B40A) {
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      category:
+        {"name":"Governance","priority":3}
    }
```

Generated with discovered.json: 0xa8c9d4f6ed2ffd3264f3870473c5ceffd77edb6b

# Diff at Fri, 21 Feb 2025 08:59:32 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1cf9ec35847912163c4b663a633e258a434c0bca block: 21680579
- current block number: 21680579

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21680579 (main branch discovery), not current.

```diff
    contract L1StandardBridge (0x2171E6d3B7964fA9654Ce41dA8a8fFAff2Cc70be) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      categories:
-        ["Gateways&Escrows"]
    }
```

```diff
    contract L1CrossDomainMessenger (0x899F07862D3A03F70E07b7f01183934b485d2e97) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      categories:
-        ["Core"]
    }
```

```diff
    contract SuperchainConfig (0xfd1255b6c09D939E7F3896A16C32CDBCD6F8B40A) {
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      categories:
-        ["Upgrades&Governance"]
    }
```

Generated with discovered.json: 0x06541c5713224e8b06ea82aab98c41ea7965f092

# Diff at Mon, 10 Feb 2025 19:04:01 GMT:

- author: Michał Podsiadły (<michal.podsiadly@l2beat.com>)
- comparing to: main@3756adff7c1ac86d8af3374a90a75c1999aae2b3 block: 21680579
- current block number: 21680579

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21680579 (main branch discovery), not current.

```diff
    contract SystemConfig (0x43F8DeFe3E9286D152E91BB16a248808E7247198) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      values.opStackDA.isUsingEigenDA:
+        false
    }
```

Generated with discovered.json: 0x4d1332455915e582e5fae4777f33f92bd21a2f4c

# Diff at Tue, 04 Feb 2025 12:31:32 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@145553eed7ba44636411ecb25e4099728acd02f9 block: 21680579
- current block number: 21680579

## Description

Rename 'configure' permission to 'interact'

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21680579 (main branch discovery), not current.

```diff
    contract HashkeyOpsMultisig (0x29Fbda675Fa5a07B621C2C1a6E3F874C14F612F3) {
    +++ description: None
      receivedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract SystemConfig (0x43F8DeFe3E9286D152E91BB16a248808E7247198) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      issuedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract HashkeyUpgradeMultisig (0x441F31C4cdf772558D4EA31f3114de59aE145E7c) {
    +++ description: None
      receivedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract AddressManager (0x679A65aD62972Ea3561F40A12e93CcA6f79F35E6) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      issuedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract ProxyAdmin (0x7986eD289935A0F47FC434C00cDE309fE2c51f1C) {
    +++ description: None
      directlyReceivedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

Generated with discovered.json: 0x5eef6ac4cba7feb138f1fd5f8fb8510bd37a0087

# Diff at Wed, 22 Jan 2025 14:18:50 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- current block number: 21680579

## Description

Initial discovery. Uses OptiPortal2 (post OPFP) and system contract beta versions to allow for custom gasTokens. No other significant changes to the current Optimism contracts.

Respected Game type is permissioned, no SecurityCouncil, no Superchain gov.

## Initial discovery

```diff
+   Status: CREATED
    contract OptimismMintableERC20Factory (0x0407af506d86bFA5e401099b2fC2355590638f19)
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
```

```diff
+   Status: CREATED
    contract DisputeGameFactory (0x04Ec030f362CE5A0b5Fe2d4B4219f287C2EBDE50)
    +++ description: The dispute game factory allows the creation of dispute games, used to propose state roots and eventually challenge them.
```

```diff
+   Status: CREATED
    contract L1StandardBridge (0x2171E6d3B7964fA9654Ce41dA8a8fFAff2Cc70be)
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
```

```diff
+   Status: CREATED
    contract HashkeyOpsMultisig (0x29Fbda675Fa5a07B621C2C1a6E3F874C14F612F3)
    +++ description: None
```

```diff
+   Status: CREATED
    contract PermissionedDisputeGame (0x3fEF4F3e99936E89A8bBdD9E08D83c471D5E152D)
    +++ description: Same as FaultDisputeGame, but only two permissioned addresses are designated as proposer and challenger.
```

```diff
+   Status: CREATED
    contract SystemConfig (0x43F8DeFe3E9286D152E91BB16a248808E7247198)
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
```

```diff
+   Status: CREATED
    contract HashkeyUpgradeMultisig (0x441F31C4cdf772558D4EA31f3114de59aE145E7c)
    +++ description: None
```

```diff
+   Status: CREATED
    contract AnchorStateRegistry (0x4deC2aA521108d78d983c0c12656c6CF8631F2ED)
    +++ description: Contains the latest confirmed state root that can be used as a starting point in a dispute game.
```

```diff
+   Status: CREATED
    contract PreimageOracle (0x5B9bEf4d8C36FB013c70d0A6F455807c6BD5270b)
    +++ description: The PreimageOracle contract is used to load the required data from L1 for a dispute game.
```

```diff
+   Status: CREATED
    contract AddressManager (0x679A65aD62972Ea3561F40A12e93CcA6f79F35E6)
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
```

```diff
+   Status: CREATED
    contract MIPS (0x7447b25b91336127042CC6899B2C15668a1Ab8BA)
    +++ description: The MIPS contract is used to execute the final step of the dispute game which objectively determines the winner of the dispute.
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x7986eD289935A0F47FC434C00cDE309fE2c51f1C)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1CrossDomainMessenger (0x899F07862D3A03F70E07b7f01183934b485d2e97)
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
```

```diff
+   Status: CREATED
    contract DelayedWETH (0xBb70D595147A141e268532BFEF61A8c25054d26D)
    +++ description: Contract designed to hold the bonded ETH for each game. It is designed as a wrapper around WETH to allow an owner to function as a backstop if a game would incorrectly distribute funds.
```

```diff
+   Status: CREATED
    contract FaultDisputeGame (0xC3E7f3606aeAC543bD268a637c6847E92d69B8aA)
    +++ description: Logic of the dispute game. When a state root is proposed, a dispute game contract is deployed. Challengers can use such contracts to challenge the proposed state root.
```

```diff
+   Status: CREATED
    contract HashkeyGuardianMultisig (0xC7fCbE26c1Db751d63869F72F782a56710f6be5A)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1ERC721Bridge (0xd4C83D93c6fAE3E0804B785F9Cf465BE95449D04)
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
```

```diff
+   Status: CREATED
    contract DelayedWETH (0xd9c31D15f2c649e525C2574bC025b3CAafAaf6fe)
    +++ description: Contract designed to hold the bonded ETH for each game. It is designed as a wrapper around WETH to allow an owner to function as a backstop if a game would incorrectly distribute funds.
```

```diff
+   Status: CREATED
    contract OptimismPortal2 (0xe7Aa79B59CAc06F9706D896a047fEb9d3BDA8bD3)
    +++ description: The OptimismPortal contract is the main entry point to deposit funds from L1 to L2. It also allows to prove and finalize withdrawals. It specifies which game type can be used for withdrawals, which currently is the PermissionedDisputeGame.
```

```diff
+   Status: CREATED
    contract SuperchainConfig (0xfd1255b6c09D939E7F3896A16C32CDBCD6F8B40A)
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
```
