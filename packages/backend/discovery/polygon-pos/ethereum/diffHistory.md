Generated with discovered.json: 0x84907ddae0075c8662a5e520974c96a028ba743b

# Diff at Wed, 07 Aug 2024 08:47:00 GMT:

- author: Bartek Kiepuszewski (<bkiepuszewski@gmail.com>)
- comparing to: main@048ee50ddf07f7a442b6e0eff57ad2af666cf872 block: 20175273
- current block number: 20475590

## Description

Provide description of changes. This section will be preserved.

## Watched changes

```diff
    contract StakingNFT (0x47Cbe25BbDB40a774cC37E1dA92d10C2C7Ec897F) {
    +++ description: None
      values.totalSupply:
-        126
+        127
    }
```

```diff
    contract StakeManager (0x5e3Ef299fDDf15eAa0432E6e66473ace8c13D908) {
    +++ description: None
      values.NFTCounter:
-        174
+        175
      values.totalHeimdallFee:
-        "10101939209428901681108"
+        "10132939209428901681108"
    }
```

```diff
    contract MintableERC20Predicate (0x9923263fA127b3d1484cFD649df8f1831c2A74e4) {
    +++ description: None
      values.accessControl.DEFAULT_ADMIN_ROLE.members.1:
-        "0xFa7D2a996aC6350f4b56C043112Da0366a59b74c"
      values.accessControl.DEFAULT_ADMIN_ROLE.members.0:
-        "0x63ec5767F54F6943750A70eB6117EA2D9Ca77313"
+        "0xFa7D2a996aC6350f4b56C043112Da0366a59b74c"
      values.accessControl.MANAGER_ROLE.members.1:
-        "0xA0c68C638235ee32657e8f720a23ceC1bFc77C77"
      values.accessControl.MANAGER_ROLE.members.0:
-        "0x63ec5767F54F6943750A70eB6117EA2D9Ca77313"
+        "0xA0c68C638235ee32657e8f720a23ceC1bFc77C77"
    }
```

```diff
    contract StakingInfo (0xa59C847Bd5aC0172Ff4FE912C5d29E5A71A7512B) {
    +++ description: None
      values.owner:
-        "0xA2D9846c352cA61dCb20D6AaD40Cec1d1b228a78"
+        "0xFa7D2a996aC6350f4b56C043112Da0366a59b74c"
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20175273 (main branch discovery), not current.

```diff
    contract ERC20EscrowPredicate (0x21ada4D8A799c4b0ADF100eB597a6f1321bCD3E4) {
    +++ description: None
      values.accessControl:
+        {"DEFAULT_ADMIN_ROLE":{"adminRole":"DEFAULT_ADMIN_ROLE","members":[]}}
    }
```

```diff
    contract PolygonERC20MintBurnPredicate (0x436f5Ba0DCf22f991475fC7A6DE75DAAE2f40cB5) {
    +++ description: None
      name:
-        "ERC20MintBurnPredicate"
+        "PolygonERC20MintBurnPredicate"
    }
```

```diff
    contract EtherPredicate (0x8484Ef722627bf18ca5Ae6BcF031c23E6e922B30) {
    +++ description: None
      values.accessControl:
+        {"DEFAULT_ADMIN_ROLE":{"adminRole":"DEFAULT_ADMIN_ROLE","members":["0xFa7D2a996aC6350f4b56C043112Da0366a59b74c"]},"MANAGER_ROLE":{"adminRole":"DEFAULT_ADMIN_ROLE","members":["0xA0c68C638235ee32657e8f720a23ceC1bFc77C77"]}}
    }
```

```diff
    contract RootChain (0x86E4Dc95c7FBdBf52e33D563BbDB00823894C287) {
    +++ description: None
      values.constructorArgs:
+        {"_proxyTo":"0x5A09cD4601b66bc107D377AB81E0dbb5dFABaA84","_registry":"0x33a02E6cC863D393d6Bf231B697b82F6e499cA71","_heimdallId":"heimdall-137"}
    }
```

```diff
    contract MintableERC721Predicate (0x932532aA4c0174b8453839A6E44eE09Cc615F2b7) {
    +++ description: None
      name:
-        "UnstoppableDomainsPredicate"
+        "MintableERC721Predicate"
    }
```

```diff
    contract MintableERC20Predicate (0x9923263fA127b3d1484cFD649df8f1831c2A74e4) {
    +++ description: None
      values.accessControl:
+        {"DEFAULT_ADMIN_ROLE":{"adminRole":"DEFAULT_ADMIN_ROLE","members":["0x63ec5767F54F6943750A70eB6117EA2D9Ca77313","0xFa7D2a996aC6350f4b56C043112Da0366a59b74c"]},"MANAGER_ROLE":{"adminRole":"DEFAULT_ADMIN_ROLE","members":["0x63ec5767F54F6943750A70eB6117EA2D9Ca77313","0xA0c68C638235ee32657e8f720a23ceC1bFc77C77"]}}
    }
```

```diff
    contract Timelock (0xCaf0aa768A3AE1297DF20072419Db8Bb8b5C8cEf) {
    +++ description: None
      assignedPermissions.admin.10:
+        "0xE6F45376f64e1F568BD1404C155e5fFD2F80F7AD"
      assignedPermissions.admin.9:
+        "0xDB2382413bCb9c2F1B6b62B52238558266361D68"
      assignedPermissions.admin.8:
-        "0xE6F45376f64e1F568BD1404C155e5fFD2F80F7AD"
+        "0xA0c68C638235ee32657e8f720a23ceC1bFc77C77"
      assignedPermissions.admin.7:
-        "0xDB2382413bCb9c2F1B6b62B52238558266361D68"
+        "0x9923263fA127b3d1484cFD649df8f1831c2A74e4"
      assignedPermissions.admin.6:
-        "0xA0c68C638235ee32657e8f720a23ceC1bFc77C77"
+        "0x932532aA4c0174b8453839A6E44eE09Cc615F2b7"
      assignedPermissions.admin.5:
-        "0x9923263fA127b3d1484cFD649df8f1831c2A74e4"
+        "0x8484Ef722627bf18ca5Ae6BcF031c23E6e922B30"
      assignedPermissions.admin.4:
-        "0x932532aA4c0174b8453839A6E44eE09Cc615F2b7"
+        "0x6dF5CB08d3f0193C768C8A01f42ac4424DC5086b"
      assignedPermissions.admin.3:
-        "0x8484Ef722627bf18ca5Ae6BcF031c23E6e922B30"
+        "0x5e3Ef299fDDf15eAa0432E6e66473ace8c13D908"
    }
```

```diff
+   Status: CREATED
    contract SlashingManager (0x01F645DcD6C796F6BC6C982159B32fAaaebdC96A)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ERC20PredicateBurnOnly (0x158d5fa3Ef8e4dDA8a5367deCF76b94E7efFCe95)
    +++ description: None
```

```diff
+   Status: CREATED
    contract WithdrawManager (0x2A88696e0fFA76bAA1338F2C74497cC013495922)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Registry (0x33a02E6cC863D393d6Bf231B697b82F6e499cA71)
    +++ description: None
```

```diff
+   Status: CREATED
    contract StakingNFT (0x47Cbe25BbDB40a774cC37E1dA92d10C2C7Ec897F)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ERC721PredicateBurnOnly (0x54150f44c785D412Ec262fe895Cc3B689c72F49B)
    +++ description: None
```

```diff
+   Status: CREATED
    contract StakeManager (0x5e3Ef299fDDf15eAa0432E6e66473ace8c13D908)
    +++ description: None
```

```diff
+   Status: CREATED
    contract EventsHub (0x6dF5CB08d3f0193C768C8A01f42ac4424DC5086b)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Governance (0x6e7a5820baD6cebA8Ef5ea69c0C92EbbDAc9CE48)
    +++ description: None
```

```diff
+   Status: CREATED
    contract MaticToken (0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0)
    +++ description: None
```

```diff
+   Status: CREATED
    contract MaticWETH (0xa45b966996374E9e65ab991C6FE4Bfce3a56DDe8)
    +++ description: None
```

```diff
+   Status: CREATED
    contract StakingInfo (0xa59C847Bd5aC0172Ff4FE912C5d29E5A71A7512B)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ValidatorShareFactory (0xc4FA447A0e77Eff9717b09C057B40570813bb642)
    +++ description: None
```

```diff
+   Status: CREATED
    contract  (0xD9c7C4ED4B66858301D0cb28Cc88bf655Fe34861)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ExitNFT (0xDF74156420Bd57ab387B195ed81EcA36F9fABAca)
    +++ description: None
```

```diff
+   Status: CREATED
    contract StakeManagerExtension (0xef49Ea6996073752b6840CDA34773FFA78F78166)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ValidatorShareImpl (0xf98864DA30a5bd657B13e70A57f5718aBf7BAB31)
    +++ description: None
```

Generated with discovered.json: 0x84a918c8ec832eda854b0e2559e0f0fc7b33ca2f

# Diff at Wed, 26 Jun 2024 10:30:17 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@cb9200e010745e10244c0b3851b3acf21fe41f31 block: 19532088
- current block number: 20175273

## Description

The implementation of the GnosisSafe is upgraded to version 1.3.0.

## Watched changes

```diff
    contract PolygonMultisig (0xFa7D2a996aC6350f4b56C043112Da0366a59b74c) {
    +++ description: None
      upgradeability.masterCopy:
-        "0x34CfAC646f301356fAa8B21e94227e3583Fe3F5F"
+        "0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
      implementations.0:
-        "0x34CfAC646f301356fAa8B21e94227e3583Fe3F5F"
+        "0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
      values.domainSeparator:
-        "0x3bc292918071cc597c13d3994268d3c83097b8388d750481c8cbce67a284ed5c"
+        "0x1fedebc30994a7dba640edeed88b9bdc774c9f02b3797c8a6d3a2f17399477f4"
      values.getModules:
-        []
      values.NAME:
-        "Gnosis Safe"
      values.VERSION:
-        "1.1.1"
+        "1.3.0"
      values.getChainId:
+        1
    }
```

## Source code changes

```diff
.../PolygonMultisig/GnosisSafe.sol                 | 932 ++++++++++-----------
 1 file changed, 463 insertions(+), 469 deletions(-)
```

Generated with discovered.json: 0xc189443ef5863f0d6d62094fa2495d76a066f101

# Diff at Thu, 28 Mar 2024 10:43:30 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@dd32bb06b292cc8459fb09925454ee3a90f5c27e block: 17770180
- current block number: 19532088

## Description

Update discovery to include the multisig threshold.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 17770180 (main branch discovery), not current.

```diff
    contract PolygonMultisig (0xFa7D2a996aC6350f4b56C043112Da0366a59b74c) {
    +++ description: None
      upgradeability.threshold:
+        "5 of 9 (56%)"
    }
```

Generated with discovered.json: 0xacd709a0779fdac120b133ad8ef7a45438d5ed12
