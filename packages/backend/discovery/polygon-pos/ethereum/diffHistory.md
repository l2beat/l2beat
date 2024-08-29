Generated with discovered.json: 0x662970b1bf0b32ad873da4a0f522ee69aef1a773

# Diff at Wed, 28 Aug 2024 16:41:41 GMT:

- author: Bartek Kiepuszewski (<bkiepuszewski@gmail.com>)
- comparing to: main@ec0c665426c9791ef4860f527c8da5a8193eb4c2 block: 20612504
- current block number: 20628344

## Description

Predicates changed as ABI for exits got a new parameter. Insignificant change wrt to risks

## Watched changes

```diff
    contract ERC1155Predicate (0x0B9020d4E32990D67559b1317c7BF0C15D6EB88f) {
    +++ description: None
      values.$implementation:
-        "0xb86357daD9c3567dD70862a5b49fFFaFb0F094Ac"
+        "0xCFA65db73cB45D458d0a98006d3d558b5e1F021d"
      values.implementation:
-        "0xb86357daD9c3567dD70862a5b49fFFaFb0F094Ac"
+        "0xCFA65db73cB45D458d0a98006d3d558b5e1F021d"
    }
```

```diff
    contract MintableERC1155Predicate (0x2d641867411650cd05dB93B59964536b1ED5b1B7) {
    +++ description: None
      values.$implementation:
-        "0x985Dbac75cf625dD6baB03Da784CF0D51B4bEcef"
+        "0xFD47E7d657b07B071C3362bBCe908a70895EE747"
      values.implementation:
-        "0x985Dbac75cf625dD6baB03Da784CF0D51B4bEcef"
+        "0xFD47E7d657b07B071C3362bBCe908a70895EE747"
    }
```

```diff
    contract ERC20Predicate (0x40ec5B33f54e0E8A33A975908C5BA1c14e5BbbDf) {
    +++ description: None
      values.$implementation:
-        "0xb774EBbeF817390483FEA5bEd0F0cB0EDEBE4065"
+        "0xB1fd4ae726c64A793588001EB465c46BD1BdF1cB"
      values.implementation:
-        "0xb774EBbeF817390483FEA5bEd0F0cB0EDEBE4065"
+        "0xB1fd4ae726c64A793588001EB465c46BD1BdF1cB"
    }
```

```diff
    contract EtherPredicate (0x8484Ef722627bf18ca5Ae6BcF031c23E6e922B30) {
    +++ description: None
      values.$implementation:
-        "0x3129B90fB7bF58A0B36226f2e6547B89C0BbdE42"
+        "0xeB185ED8f664D105903EF434E5becd214a8AC874"
      values.implementation:
-        "0x3129B90fB7bF58A0B36226f2e6547B89C0BbdE42"
+        "0xeB185ED8f664D105903EF434E5becd214a8AC874"
    }
```

```diff
    contract MintableERC721Predicate (0x932532aA4c0174b8453839A6E44eE09Cc615F2b7) {
    +++ description: None
      values.$implementation:
-        "0x34AF15A166def1d89D38a70120Ea33CD8cc10C45"
+        "0xba31389292f7EdfC7b60B937b97014b4C354689b"
      values.implementation:
-        "0x34AF15A166def1d89D38a70120Ea33CD8cc10C45"
+        "0xba31389292f7EdfC7b60B937b97014b4C354689b"
    }
```

```diff
    contract MintableERC20Predicate (0x9923263fA127b3d1484cFD649df8f1831c2A74e4) {
    +++ description: None
      values.$implementation:
-        "0xab00328234bC22430c78847094A68a6836574fFB"
+        "0x94D40724d6aA4AB313065006E4bA8CA448dcDfae"
      values.implementation:
-        "0xab00328234bC22430c78847094A68a6836574fFB"
+        "0x94D40724d6aA4AB313065006E4bA8CA448dcDfae"
    }
```

```diff
    contract RootChainManager (0xA0c68C638235ee32657e8f720a23ceC1bFc77C77) {
    +++ description: None
      values.$implementation:
-        "0x1633012a2cB27eFBC2944f2E43b9197Bc3964359"
+        "0x8F372f5404514cec63A3F88BAac772Cc620F2281"
      values.implementation:
-        "0x1633012a2cB27eFBC2944f2E43b9197Bc3964359"
+        "0x8F372f5404514cec63A3F88BAac772Cc620F2281"
    }
```

```diff
    contract ERC721Predicate (0xE6F45376f64e1F568BD1404C155e5fFD2F80F7AD) {
    +++ description: None
      values.$implementation:
-        "0x9F5B43C0d6d57a76E5B24CE05E11b70C3C7eA8Ec"
+        "0x02Bc987f54B54bf18Ca6E20a13e57508ec561072"
      values.implementation:
-        "0x9F5B43C0d6d57a76E5B24CE05E11b70C3C7eA8Ec"
+        "0x02Bc987f54B54bf18Ca6E20a13e57508ec561072"
    }
```

## Source code changes

```diff
.../{.flat@20612504 => .flat}/ERC1155Predicate/ERC1155Predicate.sol  | 4 ++++
 .../{.flat@20612504 => .flat}/ERC20Predicate/ERC20Predicate.sol      | 4 ++++
 .../{.flat@20612504 => .flat}/ERC721Predicate/ERC721Predicate.sol    | 4 ++++
 .../{.flat@20612504 => .flat}/EtherPredicate/EtherPredicate.sol      | 5 +++++
 .../MintableERC1155Predicate/MintableERC1155Predicate.sol            | 4 ++++
 .../MintableERC20Predicate/MintableERC20Predicate.sol                | 4 ++++
 .../MintableERC721Predicate/MintableERC721Predicate.sol              | 4 ++++
 .../{.flat@20612504 => .flat}/RootChainManager/RootChainManager.sol  | 1 +
 8 files changed, 30 insertions(+)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20612504 (main branch discovery), not current.

```diff
    contract ERC1155Predicate (0x0B9020d4E32990D67559b1317c7BF0C15D6EB88f) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xFa7D2a996aC6350f4b56C043112Da0366a59b74c","via":[]}]
    }
```

```diff
    contract MintableERC1155Predicate (0x2d641867411650cd05dB93B59964536b1ED5b1B7) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xFa7D2a996aC6350f4b56C043112Da0366a59b74c","via":[]}]
    }
```

```diff
    contract ERC20Predicate (0x40ec5B33f54e0E8A33A975908C5BA1c14e5BbbDf) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xFa7D2a996aC6350f4b56C043112Da0366a59b74c","via":[]}]
    }
```

```diff
    contract StakeManager (0x5e3Ef299fDDf15eAa0432E6e66473ace8c13D908) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xFa7D2a996aC6350f4b56C043112Da0366a59b74c","via":[]}]
    }
```

```diff
    contract EventsHub (0x6dF5CB08d3f0193C768C8A01f42ac4424DC5086b) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xFa7D2a996aC6350f4b56C043112Da0366a59b74c","via":[]}]
    }
```

```diff
    contract EtherPredicate (0x8484Ef722627bf18ca5Ae6BcF031c23E6e922B30) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xFa7D2a996aC6350f4b56C043112Da0366a59b74c","via":[]}]
    }
```

```diff
    contract MintableERC721Predicate (0x932532aA4c0174b8453839A6E44eE09Cc615F2b7) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xFa7D2a996aC6350f4b56C043112Da0366a59b74c","via":[]}]
    }
```

```diff
    contract MintableERC20Predicate (0x9923263fA127b3d1484cFD649df8f1831c2A74e4) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xFa7D2a996aC6350f4b56C043112Da0366a59b74c","via":[]}]
    }
```

```diff
    contract RootChainManager (0xA0c68C638235ee32657e8f720a23ceC1bFc77C77) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xFa7D2a996aC6350f4b56C043112Da0366a59b74c","via":[]}]
    }
```

```diff
    contract ChainExitERC1155Predicate (0xDB2382413bCb9c2F1B6b62B52238558266361D68) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xFa7D2a996aC6350f4b56C043112Da0366a59b74c","via":[]}]
    }
```

```diff
    contract ERC721Predicate (0xE6F45376f64e1F568BD1404C155e5fFD2F80F7AD) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xFa7D2a996aC6350f4b56C043112Da0366a59b74c","via":[]}]
    }
```

```diff
    contract PolygonMultisig (0xFa7D2a996aC6350f4b56C043112Da0366a59b74c) {
    +++ description: None
      assignedPermissions:
-        {"upgrade":["0x0B9020d4E32990D67559b1317c7BF0C15D6EB88f","0x2d641867411650cd05dB93B59964536b1ED5b1B7","0x40ec5B33f54e0E8A33A975908C5BA1c14e5BbbDf","0x5e3Ef299fDDf15eAa0432E6e66473ace8c13D908","0x6dF5CB08d3f0193C768C8A01f42ac4424DC5086b","0x8484Ef722627bf18ca5Ae6BcF031c23E6e922B30","0x932532aA4c0174b8453839A6E44eE09Cc615F2b7","0x9923263fA127b3d1484cFD649df8f1831c2A74e4","0xA0c68C638235ee32657e8f720a23ceC1bFc77C77","0xDB2382413bCb9c2F1B6b62B52238558266361D68","0xE6F45376f64e1F568BD1404C155e5fFD2F80F7AD"]}
      receivedPermissions:
+        [{"permission":"upgrade","target":"0x0B9020d4E32990D67559b1317c7BF0C15D6EB88f","via":[]},{"permission":"upgrade","target":"0x2d641867411650cd05dB93B59964536b1ED5b1B7","via":[]},{"permission":"upgrade","target":"0x40ec5B33f54e0E8A33A975908C5BA1c14e5BbbDf","via":[]},{"permission":"upgrade","target":"0x5e3Ef299fDDf15eAa0432E6e66473ace8c13D908","via":[]},{"permission":"upgrade","target":"0x6dF5CB08d3f0193C768C8A01f42ac4424DC5086b","via":[]},{"permission":"upgrade","target":"0x8484Ef722627bf18ca5Ae6BcF031c23E6e922B30","via":[]},{"permission":"upgrade","target":"0x932532aA4c0174b8453839A6E44eE09Cc615F2b7","via":[]},{"permission":"upgrade","target":"0x9923263fA127b3d1484cFD649df8f1831c2A74e4","via":[]},{"permission":"upgrade","target":"0xA0c68C638235ee32657e8f720a23ceC1bFc77C77","via":[]},{"permission":"upgrade","target":"0xDB2382413bCb9c2F1B6b62B52238558266361D68","via":[]},{"permission":"upgrade","target":"0xE6F45376f64e1F568BD1404C155e5fFD2F80F7AD","via":[]}]
    }
```

Generated with discovered.json: 0x56953e56a39e1e3fb701ecb601d4eda075c91bb0

# Diff at Mon, 26 Aug 2024 11:36:43 GMT:

- author: Bartek Kiepuszewski (<bkiepuszewski@gmail.com>)
- comparing to: main@c6cddecec9c1434aa3f47c8b7a73acab7954bc66 block: 20532676
- current block number: 20612504

## Description

- Timlock has been removed - now Polygon MultiSig is a direct owner
- ERC20PredicateBurnOnly and ERC1155Predicate contracts have been replaced
  by new implementation. We don't track these as escrows (they are burn-only)
  so ignored
- WithdrawManager is only used by the Plasma bridge, so its implementation
  upgrade is ignored here

## Watched changes

```diff
    contract ERC1155Predicate (0x0B9020d4E32990D67559b1317c7BF0C15D6EB88f) {
    +++ description: None
      values.$admin:
-        "0xCaf0aa768A3AE1297DF20072419Db8Bb8b5C8cEf"
+        "0xFa7D2a996aC6350f4b56C043112Da0366a59b74c"
      values.$implementation:
-        "0x62D7e87677ac7e3bd02c198e3FABeFFdBc5eB2A3"
+        "0xb86357daD9c3567dD70862a5b49fFFaFb0F094Ac"
      values.implementation:
-        "0x62D7e87677ac7e3bd02c198e3FABeFFdBc5eB2A3"
+        "0xb86357daD9c3567dD70862a5b49fFFaFb0F094Ac"
      values.proxyOwner:
-        "0xCaf0aa768A3AE1297DF20072419Db8Bb8b5C8cEf"
+        "0xFa7D2a996aC6350f4b56C043112Da0366a59b74c"
    }
```

```diff
-   Status: DELETED
    contract ERC20PredicateBurnOnly (0x158d5fa3Ef8e4dDA8a5367deCF76b94E7efFCe95)
    +++ description: None
```

```diff
    contract WithdrawManager (0x2A88696e0fFA76bAA1338F2C74497cC013495922) {
    +++ description: None
      values.$implementation:
-        "0x4ef5123a30e4CFeC02B3E2F5Ce97F1328B29f7de"
+        "0xA376680d32Cece9756D9f1087318400DA2fd83dF"
      values.implementation:
-        "0x4ef5123a30e4CFeC02B3E2F5Ce97F1328B29f7de"
+        "0xA376680d32Cece9756D9f1087318400DA2fd83dF"
      values.owner:
-        "0xCaf0aa768A3AE1297DF20072419Db8Bb8b5C8cEf"
+        "0xFa7D2a996aC6350f4b56C043112Da0366a59b74c"
    }
```

```diff
    contract MintableERC1155Predicate (0x2d641867411650cd05dB93B59964536b1ED5b1B7) {
    +++ description: None
      values.$admin:
-        "0xCaf0aa768A3AE1297DF20072419Db8Bb8b5C8cEf"
+        "0xFa7D2a996aC6350f4b56C043112Da0366a59b74c"
      values.$implementation:
-        "0xDb161A896Be50a020B636D6B60DA7c59817412a5"
+        "0x985Dbac75cf625dD6baB03Da784CF0D51B4bEcef"
      values.implementation:
-        "0xDb161A896Be50a020B636D6B60DA7c59817412a5"
+        "0x985Dbac75cf625dD6baB03Da784CF0D51B4bEcef"
      values.proxyOwner:
-        "0xCaf0aa768A3AE1297DF20072419Db8Bb8b5C8cEf"
+        "0xFa7D2a996aC6350f4b56C043112Da0366a59b74c"
    }
```

```diff
    contract Registry (0x33a02E6cC863D393d6Bf231B697b82F6e499cA71) {
    +++ description: None
      values.erc20Predicate:
-        "0x158d5fa3Ef8e4dDA8a5367deCF76b94E7efFCe95"
+        "0x626fb210bf50e201ED62cA2705c16DE2a53DC966"
      values.erc721Predicate:
-        "0x54150f44c785D412Ec262fe895Cc3B689c72F49B"
+        "0x36C2503d53C6948331144b85D1e74a3B96731d1b"
    }
```

```diff
    contract ERC20Predicate (0x40ec5B33f54e0E8A33A975908C5BA1c14e5BbbDf) {
    +++ description: None
      values.$admin:
-        "0xCaf0aa768A3AE1297DF20072419Db8Bb8b5C8cEf"
+        "0xFa7D2a996aC6350f4b56C043112Da0366a59b74c"
      values.$implementation:
-        "0x608669d4914Eec1E20408Bc4c9eFFf27BB8cBdE5"
+        "0xb774EBbeF817390483FEA5bEd0F0cB0EDEBE4065"
      values.implementation:
-        "0x608669d4914Eec1E20408Bc4c9eFFf27BB8cBdE5"
+        "0xb774EBbeF817390483FEA5bEd0F0cB0EDEBE4065"
      values.proxyOwner:
-        "0xCaf0aa768A3AE1297DF20072419Db8Bb8b5C8cEf"
+        "0xFa7D2a996aC6350f4b56C043112Da0366a59b74c"
    }
```

```diff
-   Status: DELETED
    contract ERC721PredicateBurnOnly (0x54150f44c785D412Ec262fe895Cc3B689c72F49B)
    +++ description: None
```

```diff
    contract StakeManager (0x5e3Ef299fDDf15eAa0432E6e66473ace8c13D908) {
    +++ description: None
      values.$admin:
-        "0xCaf0aa768A3AE1297DF20072419Db8Bb8b5C8cEf"
+        "0xFa7D2a996aC6350f4b56C043112Da0366a59b74c"
      values.owner:
-        "0xCaf0aa768A3AE1297DF20072419Db8Bb8b5C8cEf"
+        "0xFa7D2a996aC6350f4b56C043112Da0366a59b74c"
    }
```

```diff
    contract EventsHub (0x6dF5CB08d3f0193C768C8A01f42ac4424DC5086b) {
    +++ description: None
      values.$admin:
-        "0xCaf0aa768A3AE1297DF20072419Db8Bb8b5C8cEf"
+        "0xFa7D2a996aC6350f4b56C043112Da0366a59b74c"
      values.owner:
-        "0xCaf0aa768A3AE1297DF20072419Db8Bb8b5C8cEf"
+        "0xFa7D2a996aC6350f4b56C043112Da0366a59b74c"
    }
```

```diff
    contract Governance (0x6e7a5820baD6cebA8Ef5ea69c0C92EbbDAc9CE48) {
    +++ description: None
      values.owner:
-        "0xCaf0aa768A3AE1297DF20072419Db8Bb8b5C8cEf"
+        "0xFa7D2a996aC6350f4b56C043112Da0366a59b74c"
    }
```

```diff
    contract EtherPredicate (0x8484Ef722627bf18ca5Ae6BcF031c23E6e922B30) {
    +++ description: None
      values.$admin:
-        "0xCaf0aa768A3AE1297DF20072419Db8Bb8b5C8cEf"
+        "0xFa7D2a996aC6350f4b56C043112Da0366a59b74c"
      values.$implementation:
-        "0x54006763154c764da4AF42a8c3cfc25Ea29765D5"
+        "0x3129B90fB7bF58A0B36226f2e6547B89C0BbdE42"
      values.implementation:
-        "0x54006763154c764da4AF42a8c3cfc25Ea29765D5"
+        "0x3129B90fB7bF58A0B36226f2e6547B89C0BbdE42"
      values.proxyOwner:
-        "0xCaf0aa768A3AE1297DF20072419Db8Bb8b5C8cEf"
+        "0xFa7D2a996aC6350f4b56C043112Da0366a59b74c"
    }
```

```diff
    contract RootChain (0x86E4Dc95c7FBdBf52e33D563BbDB00823894C287) {
    +++ description: None
      values.owner:
-        "0xCaf0aa768A3AE1297DF20072419Db8Bb8b5C8cEf"
+        "0xFa7D2a996aC6350f4b56C043112Da0366a59b74c"
    }
```

```diff
    contract MintableERC721Predicate (0x932532aA4c0174b8453839A6E44eE09Cc615F2b7) {
    +++ description: None
      values.$admin:
-        "0xCaf0aa768A3AE1297DF20072419Db8Bb8b5C8cEf"
+        "0xFa7D2a996aC6350f4b56C043112Da0366a59b74c"
      values.$implementation:
-        "0x7FBd00c577cAA70318BCF1c6c11e23732823b387"
+        "0x34AF15A166def1d89D38a70120Ea33CD8cc10C45"
      values.implementation:
-        "0x7FBd00c577cAA70318BCF1c6c11e23732823b387"
+        "0x34AF15A166def1d89D38a70120Ea33CD8cc10C45"
      values.proxyOwner:
-        "0xCaf0aa768A3AE1297DF20072419Db8Bb8b5C8cEf"
+        "0xFa7D2a996aC6350f4b56C043112Da0366a59b74c"
      values.TRANSFER_WITH_METADATA_EVENT_SIG:
+        "0xf94915c6d1fd521cee85359239227480c7e8776d7caf1fc3bacad5c269b66a14"
      values.WITHDRAW_BATCH_EVENT_SIG:
+        "0xf871896b17e9cb7a64941c62c188a4f5c621b86800e3d15452ece01ce56073df"
    }
```

```diff
    contract MintableERC20Predicate (0x9923263fA127b3d1484cFD649df8f1831c2A74e4) {
    +++ description: None
      values.$admin:
-        "0xCaf0aa768A3AE1297DF20072419Db8Bb8b5C8cEf"
+        "0xFa7D2a996aC6350f4b56C043112Da0366a59b74c"
      values.$implementation:
-        "0x0f92D459B20D21F6bf9E02056EA9165d3f78bA62"
+        "0xab00328234bC22430c78847094A68a6836574fFB"
      values.implementation:
-        "0x0f92D459B20D21F6bf9E02056EA9165d3f78bA62"
+        "0xab00328234bC22430c78847094A68a6836574fFB"
      values.proxyOwner:
-        "0xCaf0aa768A3AE1297DF20072419Db8Bb8b5C8cEf"
+        "0xFa7D2a996aC6350f4b56C043112Da0366a59b74c"
    }
```

```diff
    contract RootChainManager (0xA0c68C638235ee32657e8f720a23ceC1bFc77C77) {
    +++ description: None
      values.$admin:
-        "0xCaf0aa768A3AE1297DF20072419Db8Bb8b5C8cEf"
+        "0xFa7D2a996aC6350f4b56C043112Da0366a59b74c"
      values.$implementation:
-        "0x37D26DC2890b35924b40574BAc10552794771997"
+        "0x1633012a2cB27eFBC2944f2E43b9197Bc3964359"
      values.implementation:
-        "0x37D26DC2890b35924b40574BAc10552794771997"
+        "0x1633012a2cB27eFBC2944f2E43b9197Bc3964359"
      values.proxyOwner:
-        "0xCaf0aa768A3AE1297DF20072419Db8Bb8b5C8cEf"
+        "0xFa7D2a996aC6350f4b56C043112Da0366a59b74c"
    }
```

```diff
-   Status: DELETED
    contract Timelock (0xCaf0aa768A3AE1297DF20072419Db8Bb8b5C8cEf)
    +++ description: None
```

```diff
    contract ChainExitERC1155Predicate (0xDB2382413bCb9c2F1B6b62B52238558266361D68) {
    +++ description: None
      values.$admin:
-        "0xCaf0aa768A3AE1297DF20072419Db8Bb8b5C8cEf"
+        "0xFa7D2a996aC6350f4b56C043112Da0366a59b74c"
      values.proxyOwner:
-        "0xCaf0aa768A3AE1297DF20072419Db8Bb8b5C8cEf"
+        "0xFa7D2a996aC6350f4b56C043112Da0366a59b74c"
    }
```

```diff
    contract ERC721Predicate (0xE6F45376f64e1F568BD1404C155e5fFD2F80F7AD) {
    +++ description: None
      values.$admin:
-        "0xCaf0aa768A3AE1297DF20072419Db8Bb8b5C8cEf"
+        "0xFa7D2a996aC6350f4b56C043112Da0366a59b74c"
      values.$implementation:
-        "0xd515C8fF03eC79e7d5B3410c036f738e7f396C90"
+        "0x9F5B43C0d6d57a76E5B24CE05E11b70C3C7eA8Ec"
      values.implementation:
-        "0xd515C8fF03eC79e7d5B3410c036f738e7f396C90"
+        "0x9F5B43C0d6d57a76E5B24CE05E11b70C3C7eA8Ec"
      values.proxyOwner:
-        "0xCaf0aa768A3AE1297DF20072419Db8Bb8b5C8cEf"
+        "0xFa7D2a996aC6350f4b56C043112Da0366a59b74c"
    }
```

```diff
    contract PolygonMultisig (0xFa7D2a996aC6350f4b56C043112Da0366a59b74c) {
    +++ description: None
      assignedPermissions:
+        {"upgrade":["0x0B9020d4E32990D67559b1317c7BF0C15D6EB88f","0x2d641867411650cd05dB93B59964536b1ED5b1B7","0x40ec5B33f54e0E8A33A975908C5BA1c14e5BbbDf","0x5e3Ef299fDDf15eAa0432E6e66473ace8c13D908","0x6dF5CB08d3f0193C768C8A01f42ac4424DC5086b","0x8484Ef722627bf18ca5Ae6BcF031c23E6e922B30","0x932532aA4c0174b8453839A6E44eE09Cc615F2b7","0x9923263fA127b3d1484cFD649df8f1831c2A74e4","0xA0c68C638235ee32657e8f720a23ceC1bFc77C77","0xDB2382413bCb9c2F1B6b62B52238558266361D68","0xE6F45376f64e1F568BD1404C155e5fFD2F80F7AD"]}
    }
```

```diff
+   Status: CREATED
    contract ERC721PredicateBurnOnly (0x36C2503d53C6948331144b85D1e74a3B96731d1b)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ERC20PredicateBurnOnly (0x626fb210bf50e201ED62cA2705c16DE2a53DC966)
    +++ description: None
```

## Source code changes

```diff
.../ERC1155Predicate/ERC1155Predicate.sol          | 338 +++++++----
 .../ERC20Predicate/ERC20Predicate.sol              | 331 ++++++----
 .../ERC20PredicateBurnOnly.sol                     | 248 ++++----
 .../ERC721Predicate/ERC721Predicate.sol            |  23 +-
 .../ERC721PredicateBurnOnly.sol                    | 248 ++++----
 .../EtherPredicate/EtherPredicate.sol              |  17 +-
 .../MintableERC1155Predicate.sol                   |  39 +-
 .../MintableERC20Predicate.sol                     |  25 +-
 .../MintableERC721Predicate.sol                    | 142 ++++-
 .../RootChainManager/RootChainManager.sol          |  51 +-
 .../.flat@20532676/Timelock.sol => /dev/null       | 675 ---------------------
 .../WithdrawManager/WithdrawManager.sol            | 250 ++++----
 12 files changed, 1112 insertions(+), 1275 deletions(-)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20532676 (main branch discovery), not current.

```diff
    contract ERC1155Predicate (0x0B9020d4E32990D67559b1317c7BF0C15D6EB88f) {
    +++ description: None
      issuedPermissions:
-        [{"permission":"upgrade","target":"0xCaf0aa768A3AE1297DF20072419Db8Bb8b5C8cEf","via":[]}]
    }
```

```diff
    contract MintableERC1155Predicate (0x2d641867411650cd05dB93B59964536b1ED5b1B7) {
    +++ description: None
      issuedPermissions:
-        [{"permission":"upgrade","target":"0xCaf0aa768A3AE1297DF20072419Db8Bb8b5C8cEf","via":[]}]
    }
```

```diff
    contract ERC20Predicate (0x40ec5B33f54e0E8A33A975908C5BA1c14e5BbbDf) {
    +++ description: None
      issuedPermissions:
-        [{"permission":"upgrade","target":"0xCaf0aa768A3AE1297DF20072419Db8Bb8b5C8cEf","via":[]}]
    }
```

```diff
    contract StakeManager (0x5e3Ef299fDDf15eAa0432E6e66473ace8c13D908) {
    +++ description: None
      issuedPermissions:
-        [{"permission":"upgrade","target":"0xCaf0aa768A3AE1297DF20072419Db8Bb8b5C8cEf","via":[]}]
    }
```

```diff
    contract EventsHub (0x6dF5CB08d3f0193C768C8A01f42ac4424DC5086b) {
    +++ description: None
      issuedPermissions:
-        [{"permission":"upgrade","target":"0xCaf0aa768A3AE1297DF20072419Db8Bb8b5C8cEf","via":[]}]
    }
```

```diff
    contract EtherPredicate (0x8484Ef722627bf18ca5Ae6BcF031c23E6e922B30) {
    +++ description: None
      issuedPermissions:
-        [{"permission":"upgrade","target":"0xCaf0aa768A3AE1297DF20072419Db8Bb8b5C8cEf","via":[]}]
    }
```

```diff
    contract MintableERC721Predicate (0x932532aA4c0174b8453839A6E44eE09Cc615F2b7) {
    +++ description: None
      issuedPermissions:
-        [{"permission":"upgrade","target":"0xCaf0aa768A3AE1297DF20072419Db8Bb8b5C8cEf","via":[]}]
    }
```

```diff
    contract MintableERC20Predicate (0x9923263fA127b3d1484cFD649df8f1831c2A74e4) {
    +++ description: None
      issuedPermissions:
-        [{"permission":"upgrade","target":"0xCaf0aa768A3AE1297DF20072419Db8Bb8b5C8cEf","via":[]}]
    }
```

```diff
    contract RootChainManager (0xA0c68C638235ee32657e8f720a23ceC1bFc77C77) {
    +++ description: None
      issuedPermissions:
-        [{"permission":"upgrade","target":"0xCaf0aa768A3AE1297DF20072419Db8Bb8b5C8cEf","via":[]}]
    }
```

```diff
    contract Timelock (0xCaf0aa768A3AE1297DF20072419Db8Bb8b5C8cEf) {
    +++ description: None
      receivedPermissions:
-        [{"permission":"upgrade","target":"0x0B9020d4E32990D67559b1317c7BF0C15D6EB88f","via":[]},{"permission":"upgrade","target":"0x2d641867411650cd05dB93B59964536b1ED5b1B7","via":[]},{"permission":"upgrade","target":"0x40ec5B33f54e0E8A33A975908C5BA1c14e5BbbDf","via":[]},{"permission":"upgrade","target":"0x5e3Ef299fDDf15eAa0432E6e66473ace8c13D908","via":[]},{"permission":"upgrade","target":"0x6dF5CB08d3f0193C768C8A01f42ac4424DC5086b","via":[]},{"permission":"upgrade","target":"0x8484Ef722627bf18ca5Ae6BcF031c23E6e922B30","via":[]},{"permission":"upgrade","target":"0x932532aA4c0174b8453839A6E44eE09Cc615F2b7","via":[]},{"permission":"upgrade","target":"0x9923263fA127b3d1484cFD649df8f1831c2A74e4","via":[]},{"permission":"upgrade","target":"0xA0c68C638235ee32657e8f720a23ceC1bFc77C77","via":[]},{"permission":"upgrade","target":"0xDB2382413bCb9c2F1B6b62B52238558266361D68","via":[]},{"permission":"upgrade","target":"0xE6F45376f64e1F568BD1404C155e5fFD2F80F7AD","via":[]}]
      assignedPermissions:
+        {"upgrade":["0x0B9020d4E32990D67559b1317c7BF0C15D6EB88f","0x2d641867411650cd05dB93B59964536b1ED5b1B7","0x40ec5B33f54e0E8A33A975908C5BA1c14e5BbbDf","0x5e3Ef299fDDf15eAa0432E6e66473ace8c13D908","0x6dF5CB08d3f0193C768C8A01f42ac4424DC5086b","0x8484Ef722627bf18ca5Ae6BcF031c23E6e922B30","0x932532aA4c0174b8453839A6E44eE09Cc615F2b7","0x9923263fA127b3d1484cFD649df8f1831c2A74e4","0xA0c68C638235ee32657e8f720a23ceC1bFc77C77","0xDB2382413bCb9c2F1B6b62B52238558266361D68","0xE6F45376f64e1F568BD1404C155e5fFD2F80F7AD"]}
    }
```

```diff
    contract ChainExitERC1155Predicate (0xDB2382413bCb9c2F1B6b62B52238558266361D68) {
    +++ description: None
      issuedPermissions:
-        [{"permission":"upgrade","target":"0xCaf0aa768A3AE1297DF20072419Db8Bb8b5C8cEf","via":[]}]
    }
```

```diff
    contract ERC721Predicate (0xE6F45376f64e1F568BD1404C155e5fFD2F80F7AD) {
    +++ description: None
      issuedPermissions:
-        [{"permission":"upgrade","target":"0xCaf0aa768A3AE1297DF20072419Db8Bb8b5C8cEf","via":[]}]
    }
```

Generated with discovered.json: 0x01458911ac13541e146efb27aa563c6ac7b285d0

# Diff at Wed, 21 Aug 2024 10:05:04 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@2f6dde3357bf5d79196b6e94f79d853a6c4ec72b block: 20532676
- current block number: 20532676

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20532676 (main branch discovery), not current.

```diff
    contract ERC1155Predicate (0x0B9020d4E32990D67559b1317c7BF0C15D6EB88f) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xCaf0aa768A3AE1297DF20072419Db8Bb8b5C8cEf","via":[]}]
    }
```

```diff
    contract MintableERC1155Predicate (0x2d641867411650cd05dB93B59964536b1ED5b1B7) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xCaf0aa768A3AE1297DF20072419Db8Bb8b5C8cEf","via":[]}]
    }
```

```diff
    contract ERC20Predicate (0x40ec5B33f54e0E8A33A975908C5BA1c14e5BbbDf) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xCaf0aa768A3AE1297DF20072419Db8Bb8b5C8cEf","via":[]}]
    }
```

```diff
    contract StakeManager (0x5e3Ef299fDDf15eAa0432E6e66473ace8c13D908) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xCaf0aa768A3AE1297DF20072419Db8Bb8b5C8cEf","via":[]}]
    }
```

```diff
    contract EventsHub (0x6dF5CB08d3f0193C768C8A01f42ac4424DC5086b) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xCaf0aa768A3AE1297DF20072419Db8Bb8b5C8cEf","via":[]}]
    }
```

```diff
    contract EtherPredicate (0x8484Ef722627bf18ca5Ae6BcF031c23E6e922B30) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xCaf0aa768A3AE1297DF20072419Db8Bb8b5C8cEf","via":[]}]
    }
```

```diff
    contract MintableERC721Predicate (0x932532aA4c0174b8453839A6E44eE09Cc615F2b7) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xCaf0aa768A3AE1297DF20072419Db8Bb8b5C8cEf","via":[]}]
    }
```

```diff
    contract MintableERC20Predicate (0x9923263fA127b3d1484cFD649df8f1831c2A74e4) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xCaf0aa768A3AE1297DF20072419Db8Bb8b5C8cEf","via":[]}]
    }
```

```diff
    contract RootChainManager (0xA0c68C638235ee32657e8f720a23ceC1bFc77C77) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xCaf0aa768A3AE1297DF20072419Db8Bb8b5C8cEf","via":[]}]
    }
```

```diff
    contract Timelock (0xCaf0aa768A3AE1297DF20072419Db8Bb8b5C8cEf) {
    +++ description: None
      assignedPermissions:
-        {"upgrade":["0x0B9020d4E32990D67559b1317c7BF0C15D6EB88f","0x2d641867411650cd05dB93B59964536b1ED5b1B7","0x40ec5B33f54e0E8A33A975908C5BA1c14e5BbbDf","0x5e3Ef299fDDf15eAa0432E6e66473ace8c13D908","0x6dF5CB08d3f0193C768C8A01f42ac4424DC5086b","0x8484Ef722627bf18ca5Ae6BcF031c23E6e922B30","0x932532aA4c0174b8453839A6E44eE09Cc615F2b7","0x9923263fA127b3d1484cFD649df8f1831c2A74e4","0xA0c68C638235ee32657e8f720a23ceC1bFc77C77","0xDB2382413bCb9c2F1B6b62B52238558266361D68","0xE6F45376f64e1F568BD1404C155e5fFD2F80F7AD"]}
      receivedPermissions:
+        [{"permission":"upgrade","target":"0x0B9020d4E32990D67559b1317c7BF0C15D6EB88f","via":[]},{"permission":"upgrade","target":"0x2d641867411650cd05dB93B59964536b1ED5b1B7","via":[]},{"permission":"upgrade","target":"0x40ec5B33f54e0E8A33A975908C5BA1c14e5BbbDf","via":[]},{"permission":"upgrade","target":"0x5e3Ef299fDDf15eAa0432E6e66473ace8c13D908","via":[]},{"permission":"upgrade","target":"0x6dF5CB08d3f0193C768C8A01f42ac4424DC5086b","via":[]},{"permission":"upgrade","target":"0x8484Ef722627bf18ca5Ae6BcF031c23E6e922B30","via":[]},{"permission":"upgrade","target":"0x932532aA4c0174b8453839A6E44eE09Cc615F2b7","via":[]},{"permission":"upgrade","target":"0x9923263fA127b3d1484cFD649df8f1831c2A74e4","via":[]},{"permission":"upgrade","target":"0xA0c68C638235ee32657e8f720a23ceC1bFc77C77","via":[]},{"permission":"upgrade","target":"0xDB2382413bCb9c2F1B6b62B52238558266361D68","via":[]},{"permission":"upgrade","target":"0xE6F45376f64e1F568BD1404C155e5fFD2F80F7AD","via":[]}]
    }
```

```diff
    contract ChainExitERC1155Predicate (0xDB2382413bCb9c2F1B6b62B52238558266361D68) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xCaf0aa768A3AE1297DF20072419Db8Bb8b5C8cEf","via":[]}]
    }
```

```diff
    contract ERC721Predicate (0xE6F45376f64e1F568BD1404C155e5fFD2F80F7AD) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xCaf0aa768A3AE1297DF20072419Db8Bb8b5C8cEf","via":[]}]
    }
```

Generated with discovered.json: 0x364bd3d2dcb91f84b0d8b117701e0b905c60133f

# Diff at Fri, 09 Aug 2024 12:01:26 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bf40aa32f030fd312056ca0ef198c8550467d1d7 block: 20476663
- current block number: 20476663

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20476663 (main branch discovery), not current.

```diff
    contract Timelock (0xCaf0aa768A3AE1297DF20072419Db8Bb8b5C8cEf) {
    +++ description: None
      assignedPermissions.upgrade.10:
-        "0x6dF5CB08d3f0193C768C8A01f42ac4424DC5086b"
+        "0xE6F45376f64e1F568BD1404C155e5fFD2F80F7AD"
      assignedPermissions.upgrade.9:
-        "0x5e3Ef299fDDf15eAa0432E6e66473ace8c13D908"
+        "0xDB2382413bCb9c2F1B6b62B52238558266361D68"
      assignedPermissions.upgrade.8:
-        "0x932532aA4c0174b8453839A6E44eE09Cc615F2b7"
+        "0xA0c68C638235ee32657e8f720a23ceC1bFc77C77"
      assignedPermissions.upgrade.7:
-        "0xE6F45376f64e1F568BD1404C155e5fFD2F80F7AD"
+        "0x9923263fA127b3d1484cFD649df8f1831c2A74e4"
      assignedPermissions.upgrade.6:
-        "0x0B9020d4E32990D67559b1317c7BF0C15D6EB88f"
+        "0x932532aA4c0174b8453839A6E44eE09Cc615F2b7"
      assignedPermissions.upgrade.5:
-        "0x40ec5B33f54e0E8A33A975908C5BA1c14e5BbbDf"
+        "0x8484Ef722627bf18ca5Ae6BcF031c23E6e922B30"
      assignedPermissions.upgrade.4:
-        "0xDB2382413bCb9c2F1B6b62B52238558266361D68"
+        "0x6dF5CB08d3f0193C768C8A01f42ac4424DC5086b"
      assignedPermissions.upgrade.3:
-        "0x2d641867411650cd05dB93B59964536b1ED5b1B7"
+        "0x5e3Ef299fDDf15eAa0432E6e66473ace8c13D908"
      assignedPermissions.upgrade.2:
-        "0x9923263fA127b3d1484cFD649df8f1831c2A74e4"
+        "0x40ec5B33f54e0E8A33A975908C5BA1c14e5BbbDf"
      assignedPermissions.upgrade.1:
-        "0x8484Ef722627bf18ca5Ae6BcF031c23E6e922B30"
+        "0x2d641867411650cd05dB93B59964536b1ED5b1B7"
      assignedPermissions.upgrade.0:
-        "0xA0c68C638235ee32657e8f720a23ceC1bFc77C77"
+        "0x0B9020d4E32990D67559b1317c7BF0C15D6EB88f"
    }
```

Generated with discovered.json: 0xaacfa15e83d69426247c4a4ffb59e3c243023805

# Diff at Fri, 09 Aug 2024 10:11:28 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f0da1d0aab7bc6b3b5e54e7e93480bd98e57035 block: 20476663
- current block number: 20476663

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20476663 (main branch discovery), not current.

```diff
    contract Timelock (0xCaf0aa768A3AE1297DF20072419Db8Bb8b5C8cEf) {
    +++ description: None
      assignedPermissions.admin:
-        ["0x0B9020d4E32990D67559b1317c7BF0C15D6EB88f","0x2d641867411650cd05dB93B59964536b1ED5b1B7","0x40ec5B33f54e0E8A33A975908C5BA1c14e5BbbDf","0x5e3Ef299fDDf15eAa0432E6e66473ace8c13D908","0x6dF5CB08d3f0193C768C8A01f42ac4424DC5086b","0x8484Ef722627bf18ca5Ae6BcF031c23E6e922B30","0x932532aA4c0174b8453839A6E44eE09Cc615F2b7","0x9923263fA127b3d1484cFD649df8f1831c2A74e4","0xA0c68C638235ee32657e8f720a23ceC1bFc77C77","0xDB2382413bCb9c2F1B6b62B52238558266361D68","0xE6F45376f64e1F568BD1404C155e5fFD2F80F7AD"]
      assignedPermissions.upgrade:
+        ["0xA0c68C638235ee32657e8f720a23ceC1bFc77C77","0x8484Ef722627bf18ca5Ae6BcF031c23E6e922B30","0x9923263fA127b3d1484cFD649df8f1831c2A74e4","0x2d641867411650cd05dB93B59964536b1ED5b1B7","0xDB2382413bCb9c2F1B6b62B52238558266361D68","0x40ec5B33f54e0E8A33A975908C5BA1c14e5BbbDf","0x0B9020d4E32990D67559b1317c7BF0C15D6EB88f","0xE6F45376f64e1F568BD1404C155e5fFD2F80F7AD","0x932532aA4c0174b8453839A6E44eE09Cc615F2b7","0x5e3Ef299fDDf15eAa0432E6e66473ace8c13D908","0x6dF5CB08d3f0193C768C8A01f42ac4424DC5086b"]
    }
```

```diff
    contract PolygonMultisig (0xFa7D2a996aC6350f4b56C043112Da0366a59b74c) {
    +++ description: None
      values.$multisigThreshold:
-        "5 of 9 (56%)"
      values.getOwners:
-        ["0xA7499Aa6464c078EeB940da2fc95C6aCd010c3Cc","0x1aE033D45ce93bbB0dDBF71a0Da9de01FeFD8529","0x0D2600C228D9Bcc9757B64bBb232F86A912B7b03","0xD0FD9303fe99EdFAF5eD4A2c1657a347d8053C9a","0x39415255619783A2E71fcF7d8f708A951d92e1b6","0xb771380f912E4b5F6beDdf81314C383c13F16ab5","0x803B74766D8f79195D4DaeCF6f2aac31Dba78F25","0x80D63799b1e08a80f73FB7a83264b5c31600bF3a","0x8Eab5aEfe2755E1bAD2052944Ea096AEbdA1d602"]
      values.getThreshold:
-        5
      values.$members:
+        ["0xA7499Aa6464c078EeB940da2fc95C6aCd010c3Cc","0x1aE033D45ce93bbB0dDBF71a0Da9de01FeFD8529","0x0D2600C228D9Bcc9757B64bBb232F86A912B7b03","0xD0FD9303fe99EdFAF5eD4A2c1657a347d8053C9a","0x39415255619783A2E71fcF7d8f708A951d92e1b6","0xb771380f912E4b5F6beDdf81314C383c13F16ab5","0x803B74766D8f79195D4DaeCF6f2aac31Dba78F25","0x80D63799b1e08a80f73FB7a83264b5c31600bF3a","0x8Eab5aEfe2755E1bAD2052944Ea096AEbdA1d602"]
      values.$threshold:
+        5
      values.multisigThreshold:
+        "5 of 9 (56%)"
    }
```

Generated with discovered.json: 0xfe133444b6608c15f9e11dfb4d0676627004fd3b

# Diff at Wed, 07 Aug 2024 12:22:45 GMT:

- author: Bartek Kiepuszewski (<bkiepuszewski@gmail.com>)
- comparing to: main@048ee50ddf07f7a442b6e0eff57ad2af666cf872 block: 20175273
- current block number: 20476663

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
