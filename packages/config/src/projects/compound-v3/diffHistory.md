Generated with discovered.json: 0xa90c8c0cb5b903521e2c42069ac38187c9c40222

# Diff at Tue, 16 Sep 2025 15:01:50 GMT:

- author: emduc (<emilien@defiscan.info>)
- comparing to: main@3bd42d7957fc19e12ad8ed19f9f962993d9a0f0b block: 1757977446
- current timestamp: 1758034799

## Description

Provide description of changes. This section will be preserved.

## Watched changes

```diff
    contract CompoundGovernor (eth:0x309a862bbC1A00e45506cB8A802D1ff10004c8C0) {
    +++ description: None
      values.clock:
-        23371636
+        23376384
    }
```

```diff
    contract EACAggregatorProxy (eth:0x8fFfFfd4AfB6115b954Bd326cbe7B4BA576818f6) {
    +++ description: None
      values.latestAnswer:
-        99983469
+        99974998
      values.latestRound:
-        "55340232221128655336"
+        "55340232221128655338"
      values.latestRoundData.roundId:
-        "55340232221128655336"
+        "55340232221128655338"
      values.latestRoundData.answer:
-        99983469
+        99974998
      values.latestRoundData.startedAt:
-        1757923215
+        1758009621
      values.latestRoundData.updatedAt:
-        1757923235
+        1758009635
      values.latestRoundData.answeredInRound:
-        "55340232221128655336"
+        "55340232221128655338"
      values.latestTimestamp:
-        1757923235
+        1758009635
    }
```

```diff
    contract cUSDTv3 (eth:0xA17581A9E3356d9A858b789D68B4d866e593aE94) {
    +++ description: Compound v3 USDT market - lending pool for USDT
      values.getReserves:
-        "872526111210753473767"
+        "872639268228300096330"
      values.getUtilization:
-        "810669589048657414"
+        "817448870736661865"
      values.totalBorrow:
-        "58455015570777876910673"
+        "58408774961507803390216"
      values.totalSupply:
-        "72107064060892115393399"
+        "71452429319487457358848"
    }
```

```diff
    contract Wrapped Ether Token (eth:0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2) {
    +++ description: None
      values.totalSupply:
-        "2407277308337512964437645"
+        "2424800640101308417747633"
    }
```

```diff
    contract cUSDCv3 (eth:0xc3d688B66703497DAA19211EEdff47f25384cdc3) {
    +++ description: Compound v3 USDC market - main lending pool for USDC with enhanced capital efficiency
      values.getReserves:
-        15918347969921
+        15922176926246
      values.getUtilization:
-        "902047324418176623"
+        "906501826373232731"
      values.totalBorrow:
-        481924382623519
+        484708170130205
      values.totalSupply:
-        534256178479821
+        534701734018329
    }
```

```diff
    contract AccessControlledOCR2Aggregator (eth:0xc9E1a09622afdB659913fefE800fEaE5DBbFe9d7) {
    +++ description: None
      values.getBilling.reasonableGasPriceGwei:
-        75
+        60
      values.getBilling.observationPaymentGjuels:
-        11412073
+        15976902
      values.getBilling.transmissionPaymentGjuels:
-        68472074
+        95860904
      values.latestConfigDigestAndEpoch.epoch:
-        18424
+        18904
      values.linkAvailableForPayment:
-        "38101228315926340441"
+        "35988452326685929145"
    }
```

```diff
    contract ConstantPriceFeed (eth:0xD72ac1bCE9177CFe7aEb5d0516a38c88a64cE0AB) {
    +++ description: None
      values.latestRoundData.startedAt:
-        1757977439
+        1758034799
      values.latestRoundData.updatedAt:
-        1757977439
+        1758034799
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1757977446 (main branch discovery), not current.

```diff
    contract CometExtAssetList (eth:0x16F3532e6AF45A2C51B6C77b1267cEF34A9cf3B3) {
    +++ description: None
      values.writeFunctionPermissions:
+        [{"skipped":true,"reason":"tooManySourceFiles","fileCount":7}]
    }
```

```diff
    contract CometProxyAdmin (eth:0x1EC63B5883C3481134FD50D5DAebc83Ecd2E8779) {
    +++ description: None
      values.writeFunctionPermissions:
+        [{"skipped":true,"reason":"tooManySourceFiles","fileCount":12}]
    }
```

```diff
    contract GnosisSafe (eth:0x21f73D42Eb58Ba49dDB685dc29D3bF5c0f0373CA) {
    +++ description: None
      values.writeFunctionPermissions:
+        [{"skipped":true,"reason":"tooManyWriteFunctions","count":16}]
    }
```

```diff
    contract GatewayMinter (eth:0x2222222d7164433c4C09B0b0D809a9b52C04C205) {
    +++ description: Entrypoint or minter of USDC on this chain for the Gateway protocol.
      values.writeFunctionPermissions:
+        [{"skipped":true,"reason":"tooManyWriteFunctions","count":16}]
    }
```

```diff
    contract TokenMessengerV2 (eth:0x28b5a0e9C621a5BadaA536219b3a228C8168cf5d) {
    +++ description: Part of CCTP
      values.writeFunctionPermissions:
+        [{"skipped":true,"reason":"tooManyWriteFunctions","count":20}]
    }
```

```diff
    contract ConfirmedTransactionModule (eth:0x2e1B5a40Edc922bCE489668b11749B8eAbd67f6b) {
    +++ description: None
      values.writeFunctionPermissions:
+        [{"function":"changeMasterCopy","signature":"function changeMasterCopy(address _masterCopy)","file":"ConfirmedTransactionModule.sol","permissionType":"none","category":"administrative","requireStatementCount":1},{"function":"confirmTransaction","signature":"function confirmTransaction(bytes32 transactionHash)","file":"ConfirmedTransactionModule.sol","permissionType":"msgSender","category":"other","hasMsgSenderCheck":true,"requireStatementCount":4},{"function":"executeTransaction","signature":"function executeTransaction(\r\n        address to,\r\n        uint256 value,\r\n        bytes memory data,\r\n        Enum.Operation operation,\r\n        bytes32 witness\r\n    )","file":"ConfirmedTransactionModule.sol","permissionType":"msgSender","category":"other","hasMsgSenderCheck":true,"requireStatementCount":2},{"function":"revokeTransaction","signature":"function revokeTransaction(bytes32 transactionHash)","file":"ConfirmedTransactionModule.sol","permissionType":"msgSender","category":"other","hasMsgSenderCheck":true,"requireStatementCount":3},{"function":"setExecutor","signature":"function setExecutor(address executor, bool allowed)","file":"ConfirmedTransactionModule.sol","permissionType":"msgSender","category":"administrative","hasMsgSenderCheck":true,"requireStatementCount":3},{"function":"setup","signature":"function setup()","file":"ConfirmedTransactionModule.sol","permissionType":"msgSender","category":"administrative","hasMsgSenderCheck":true,"requireStatementCount":2}]
    }
```

```diff
    contract CompoundGovernor (eth:0x309a862bbC1A00e45506cB8A802D1ff10004c8C0) {
    +++ description: None
      values.writeFunctionPermissions:
+        [{"skipped":true,"reason":"tooManyWriteFunctions","count":29}]
    }
```

```diff
    contract cWETHv3 (eth:0x316f9708bB98af7dA9c68C1C3b5e79039cD336E3) {
    +++ description: Compound v3 WETH market - lending pool for WETH
      values.writeFunctionPermissions:
+        [{"skipped":true,"reason":"tooManyWriteFunctions","count":35}]
    }
```

```diff
    contract AuthorizedForwarder (eth:0x35a06994a99B335b700bB3c875408489a9F8BbeF) {
    +++ description: None
      values.writeFunctionPermissions:
+        [{"skipped":true,"reason":"tooManySourceFiles","fileCount":6}]
    }
```

```diff
    contract AuthorizedForwarder (eth:0x3Dc0D7C8f6925422AF7CFEafaF1588c185C05624) {
    +++ description: None
      values.writeFunctionPermissions:
+        [{"skipped":true,"reason":"tooManySourceFiles","fileCount":6}]
    }
```

```diff
    contract AssetListFactory (eth:0x3fF744cF6078714bB9d3c4fE5Ab37fA6d05dEC4E) {
    +++ description: None
      values.writeFunctionPermissions:
+        [{"skipped":true,"reason":"tooManySourceFiles","fileCount":9}]
    }
```

```diff
    contract AuthorizedForwarder (eth:0x42Afc2F6aE88678296EcB2eBA34cCfbd1Adc5F93) {
    +++ description: None
      values.writeFunctionPermissions:
+        [{"skipped":true,"reason":"tooManySourceFiles","fileCount":6}]
    }
```

```diff
    contract AuthorizedForwarder (eth:0x4b4df3c44FA13f9D12277458e2069EcBbeE1b085) {
    +++ description: None
      values.writeFunctionPermissions:
+        [{"skipped":true,"reason":"tooManySourceFiles","fileCount":6}]
    }
```

```diff
    contract ChainLink Token (eth:0x514910771AF9Ca656af840dff83E8264EcF986CA) {
    +++ description: None
      values.writeFunctionPermissions:
+        [{"function":"approve","signature":"function approve(address spender, uint256 value)","file":"LinkToken.sol","permissionType":"msgSender","category":"other","hasMsgSenderCheck":true},{"function":"transfer","signature":"function transfer(address to, uint256 value)","file":"LinkToken.sol","permissionType":"msgSender","category":"financial","hasMsgSenderCheck":true},{"function":"transferAndCall","signature":"function transferAndCall(address to, uint value, bytes data)","file":"LinkToken.sol","permissionType":"msgSender","category":"financial","hasMsgSenderCheck":true},{"function":"transferFrom","signature":"function transferFrom(address from, address to, uint256 value)","file":"LinkToken.sol","permissionType":"msgSender","category":"financial","hasMsgSenderCheck":true}]
    }
```

```diff
    contract AuthorizedForwarder (eth:0x585B3e95EEdd03AF221F724557D03384864Da3ca) {
    +++ description: None
      values.writeFunctionPermissions:
+        [{"skipped":true,"reason":"tooManySourceFiles","fileCount":6}]
    }
```

```diff
    contract AuthorizedForwarder (eth:0x5C026B7107f1F92a9768CF64f8B2a22252B0788d) {
    +++ description: None
      values.writeFunctionPermissions:
+        [{"skipped":true,"reason":"tooManySourceFiles","fileCount":6}]
    }
```

```diff
    contract AuthorizedForwarder (eth:0x5Dc428646BF9a29A4d623E0CDB57384E811f6F77) {
    +++ description: None
      values.writeFunctionPermissions:
+        [{"skipped":true,"reason":"tooManySourceFiles","fileCount":6}]
    }
```

```diff
    contract AuthorizedForwarder (eth:0x5eA7eAe0EBC1f4256806C8bf234F672d410Fc988) {
    +++ description: None
      values.writeFunctionPermissions:
+        [{"skipped":true,"reason":"tooManySourceFiles","fileCount":6}]
    }
```

```diff
    contract SimpleWriteAccessController (eth:0x641B698aD1C6E503470520B0EeCb472c0589dfE6) {
    +++ description: None
      values.writeFunctionPermissions:
+        [{"function":"acceptOwnership","signature":"function acceptOwnership()","file":"SimpleWriteAccessController.sol","permissionType":"modifier","category":"other","modifiers":["onlyOwner"],"hasMsgSenderCheck":true,"requireStatementCount":2},{"function":"addAccess","signature":"function addAccess(address _user)","file":"SimpleWriteAccessController.sol","permissionType":"modifier","category":"other","modifiers":["onlyOwner"],"hasMsgSenderCheck":true,"requireStatementCount":1},{"function":"disableAccessCheck","signature":"function disableAccessCheck()","file":"SimpleWriteAccessController.sol","permissionType":"modifier","category":"other","modifiers":["onlyOwner"],"hasMsgSenderCheck":true,"requireStatementCount":1},{"function":"enableAccessCheck","signature":"function enableAccessCheck()","file":"SimpleWriteAccessController.sol","permissionType":"modifier","category":"other","modifiers":["onlyOwner"],"hasMsgSenderCheck":true,"requireStatementCount":1},{"function":"removeAccess","signature":"function removeAccess(address _user)","file":"SimpleWriteAccessController.sol","permissionType":"modifier","category":"other","modifiers":["onlyOwner"],"hasMsgSenderCheck":true,"requireStatementCount":1},{"function":"transferOwnership","signature":"function transferOwnership(address _to)","file":"SimpleWriteAccessController.sol","permissionType":"modifier","category":"financial","modifiers":["onlyOwner"],"hasMsgSenderCheck":true,"requireStatementCount":2}]
    }
```

```diff
    contract AuthorizedForwarder (eth:0x6aEeF00A3A55b2a11C96e59b48bdb3f30DD8125A) {
    +++ description: None
      values.writeFunctionPermissions:
+        [{"skipped":true,"reason":"tooManySourceFiles","fileCount":6}]
    }
```

```diff
    contract AuthorizedForwarder (eth:0x6D53d5E35F5226a1613877e071b81217387aC6B5) {
    +++ description: None
      values.writeFunctionPermissions:
+        [{"skipped":true,"reason":"tooManySourceFiles","fileCount":6}]
    }
```

```diff
    contract Timelock (eth:0x6d903f6003cca6255D85CcA4D3B5E5146dC33925) {
    +++ description: None
      values.writeFunctionPermissions:
+        [{"function":"acceptAdmin","signature":"function acceptAdmin()","file":"Timelock.sol","permissionType":"msgSender","category":"other","hasMsgSenderCheck":true,"requireStatementCount":8},{"function":"cancelTransaction","signature":"function cancelTransaction(address target, uint value, string memory signature, bytes memory data, uint eta)","file":"Timelock.sol","permissionType":"msgSender","category":"other","hasMsgSenderCheck":true,"requireStatementCount":6},{"function":"executeTransaction","signature":"function executeTransaction(address target, uint value, string memory signature, bytes memory data, uint eta)","file":"Timelock.sol","permissionType":"msgSender","category":"other","hasMsgSenderCheck":true,"requireStatementCount":5},{"function":"queueTransaction","signature":"function queueTransaction(address target, uint value, string memory signature, bytes memory data, uint eta)","file":"Timelock.sol","permissionType":"msgSender","category":"other","hasMsgSenderCheck":true,"requireStatementCount":7},{"function":"setDelay","signature":"function setDelay(uint delay_)","file":"Timelock.sol","permissionType":"msgSender","category":"administrative","hasMsgSenderCheck":true,"requireStatementCount":8},{"function":"setPendingAdmin","signature":"function setPendingAdmin(address pendingAdmin_)","file":"Timelock.sol","permissionType":"msgSender","category":"administrative","hasMsgSenderCheck":true,"requireStatementCount":8}]
    }
```

```diff
    contract ProxyAdmin (eth:0x725ED7F44F0888aeC1b7630AB1ACdced91E0591A) {
    +++ description: None
      values.writeFunctionPermissions:
+        [{"skipped":true,"reason":"tooManySourceFiles","fileCount":12}]
    }
```

```diff
    contract GatewayWallet (eth:0x77777777Dcc4d5A8B6E418Fd04D8997ef11000eE) {
    +++ description: Exit point or burner of USDC on this chain for the Gateway protocol.
      values.writeFunctionPermissions:
+        [{"skipped":true,"reason":"tooManyWriteFunctions","count":27}]
    }
```

```diff
    contract AuthorizedForwarder (eth:0x7A13cD97D442856FF5387d55a7b3F09bf680102B) {
    +++ description: None
      values.writeFunctionPermissions:
+        [{"skipped":true,"reason":"tooManySourceFiles","fileCount":6}]
    }
```

```diff
    contract AuthorizedForwarder (eth:0x7B740d24396B09F992B655A590139D7Fbb5C73c8) {
    +++ description: None
      values.writeFunctionPermissions:
+        [{"skipped":true,"reason":"tooManySourceFiles","fileCount":6}]
    }
```

```diff
    contract AuthorizedForwarder (eth:0x8AaDF849561DcCeC75DA44d1147E736E0cc0134E) {
    +++ description: None
      values.writeFunctionPermissions:
+        [{"skipped":true,"reason":"tooManySourceFiles","fileCount":6}]
    }
```

```diff
    contract EACAggregatorProxy (eth:0x8fFfFfd4AfB6115b954Bd326cbe7B4BA576818f6) {
    +++ description: None
      values.writeFunctionPermissions:
+        [{"function":"acceptOwnership","signature":"function acceptOwnership()","file":"EACAggregatorProxy.sol","permissionType":"modifier","category":"other","modifiers":["onlyOwner"],"hasMsgSenderCheck":true,"requireStatementCount":2},{"function":"confirmAggregator","signature":"function confirmAggregator(address _aggregator)","file":"EACAggregatorProxy.sol","permissionType":"modifier","category":"other","modifiers":["onlyOwner"],"requireStatementCount":2},{"function":"proposeAggregator","signature":"function proposeAggregator(address _aggregator)","file":"EACAggregatorProxy.sol","permissionType":"modifier","category":"other","modifiers":["onlyOwner"],"requireStatementCount":2},{"function":"setController","signature":"function setController(address _accessController)","file":"EACAggregatorProxy.sol","permissionType":"modifier","category":"administrative","modifiers":["onlyOwner"]},{"function":"transferOwnership","signature":"function transferOwnership(address _to)","file":"EACAggregatorProxy.sol","permissionType":"modifier","category":"financial","modifiers":["onlyOwner"],"hasMsgSenderCheck":true,"requireStatementCount":2}]
    }
```

```diff
    contract AuthorizedForwarder (eth:0x990cfBBDc5aeB794B657b4309017F84479e8Eb7D) {
    +++ description: None
      values.writeFunctionPermissions:
+        [{"skipped":true,"reason":"tooManySourceFiles","fileCount":6}]
    }
```

```diff
    contract SimpleWriteAccessController (eth:0x9db83CEf9f68b63989E4E82D65D549e7fF2aCda9) {
    +++ description: None
      values.writeFunctionPermissions:
+        [{"function":"acceptOwnership","signature":"function acceptOwnership()","file":"SimpleWriteAccessController.sol","permissionType":"modifier","category":"other","modifiers":["onlyOwner"],"hasMsgSenderCheck":true,"requireStatementCount":2},{"function":"addAccess","signature":"function addAccess(address _user)","file":"SimpleWriteAccessController.sol","permissionType":"modifier","category":"other","modifiers":["onlyOwner"],"hasMsgSenderCheck":true,"requireStatementCount":1},{"function":"disableAccessCheck","signature":"function disableAccessCheck()","file":"SimpleWriteAccessController.sol","permissionType":"modifier","category":"other","modifiers":["onlyOwner"],"hasMsgSenderCheck":true,"requireStatementCount":1},{"function":"enableAccessCheck","signature":"function enableAccessCheck()","file":"SimpleWriteAccessController.sol","permissionType":"modifier","category":"other","modifiers":["onlyOwner"],"hasMsgSenderCheck":true,"requireStatementCount":1},{"function":"removeAccess","signature":"function removeAccess(address _user)","file":"SimpleWriteAccessController.sol","permissionType":"modifier","category":"other","modifiers":["onlyOwner"],"hasMsgSenderCheck":true,"requireStatementCount":1},{"function":"transferOwnership","signature":"function transferOwnership(address _to)","file":"SimpleWriteAccessController.sol","permissionType":"modifier","category":"financial","modifiers":["onlyOwner"],"hasMsgSenderCheck":true,"requireStatementCount":2}]
    }
```

```diff
    contract USD Coin Token (eth:0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48) {
    +++ description: None
      values.writeFunctionPermissions:
+        [{"skipped":true,"reason":"tooManyWriteFunctions","count":34}]
    }
```

```diff
    contract cUSDTv3 (eth:0xA17581A9E3356d9A858b789D68B4d866e593aE94) {
    +++ description: Compound v3 USDT market - lending pool for USDT
      values.writeFunctionPermissions:
+        [{"skipped":true,"reason":"tooManyWriteFunctions","count":22}]
    }
```

```diff
    contract CometExtAssetList (eth:0xA70a0227028aD005F4Fc9376a82cd1462e3AAedC) {
    +++ description: None
      values.writeFunctionPermissions:
+        [{"skipped":true,"reason":"tooManySourceFiles","fileCount":7}]
    }
```

```diff
    contract GnosisSafe (eth:0xbbf3f1421D886E9b2c5D716B5192aC998af2012c) {
    +++ description: None
      values.writeFunctionPermissions:
+        [{"skipped":true,"reason":"tooManyWriteFunctions","count":16}]
    }
```

```diff
    contract TokenMessenger (eth:0xBd3fa81B58Ba92a82136038B25aDec7066af3155) {
    +++ description: Part of CCTP
      values.writeFunctionPermissions:
+        [{"skipped":true,"reason":"tooManyWriteFunctions","count":12}]
    }
```

```diff
    contract Compound Token (eth:0xc00e94Cb662C3520282E6f5717214004A7f26888) {
    +++ description: None
      values.writeFunctionPermissions:
+        [{"function":"approve","signature":"function approve(address spender, uint rawAmount)","file":"Comp.sol","permissionType":"msgSender","category":"other","hasMsgSenderCheck":true},{"function":"delegate","signature":"function delegate(address delegatee)","file":"Comp.sol","permissionType":"msgSender","category":"other","hasMsgSenderCheck":true,"requireStatementCount":3},{"function":"delegateBySig","signature":"function delegateBySig(address delegatee, uint nonce, uint expiry, uint8 v, bytes32 r, bytes32 s)","file":"Comp.sol","permissionType":"none","category":"other","requireStatementCount":4},{"function":"transfer","signature":"function transfer(address dst, uint rawAmount)","file":"Comp.sol","permissionType":"msgSender","category":"financial","hasMsgSenderCheck":true},{"function":"transferFrom","signature":"function transferFrom(address src, address dst, uint rawAmount)","file":"Comp.sol","permissionType":"msgSender","category":"financial","hasMsgSenderCheck":true,"requireStatementCount":3}]
    }
```

```diff
    contract Wrapped Ether Token (eth:0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2) {
    +++ description: None
      values.writeFunctionPermissions:
+        [{"function":"approve","signature":"function approve(address guy, uint wad)","file":"WETH9.sol","permissionType":"msgSender","category":"other","hasMsgSenderCheck":true,"requireStatementCount":2},{"function":"deposit","signature":"function deposit()","file":"WETH9.sol","permissionType":"msgSender","category":"financial","hasMsgSenderCheck":true,"requireStatementCount":3},{"function":"transfer","signature":"function transfer(address dst, uint wad)","file":"WETH9.sol","permissionType":"msgSender","category":"financial","hasMsgSenderCheck":true,"requireStatementCount":2},{"function":"transferFrom","signature":"function transferFrom(address src, address dst, uint wad)","file":"WETH9.sol","permissionType":"msgSender","category":"financial","hasMsgSenderCheck":true,"requireStatementCount":2},{"function":"withdraw","signature":"function withdraw(uint wad)","file":"WETH9.sol","permissionType":"msgSender","category":"financial","hasMsgSenderCheck":true,"requireStatementCount":3}]
    }
```

```diff
    contract cUSDCv3 (eth:0xc3d688B66703497DAA19211EEdff47f25384cdc3) {
    +++ description: Compound v3 USDC market - main lending pool for USDC with enhanced capital efficiency
      values.functionPermissions:
-        [{"function":"_beforeFallback","signature":"function _beforeFallback()","file":"contracts/vendor/proxy/transparent/TransparentUpgradeableProxy.sol","permissionType":"msgSender","requireStatements":["msg.sender != _getAdmin("]}]
      values.writeFunctionPermissions:
+        [{"skipped":true,"reason":"tooManyWriteFunctions","count":22}]
    }
```

```diff
    contract TokenMinter (eth:0xc4922d64a24675E16e1586e3e3Aa56C06fABe907) {
    +++ description: Part of CCTP: Used for automated access control for minting.
      values.writeFunctionPermissions:
+        [{"skipped":true,"reason":"tooManyWriteFunctions","count":15}]
    }
```

```diff
    contract AccessControlledOCR2Aggregator (eth:0xc9E1a09622afdB659913fefE800fEaE5DBbFe9d7) {
    +++ description: None
      values.writeFunctionPermissions:
+        [{"skipped":true,"reason":"tooManyWriteFunctions","count":19}]
    }
```

```diff
    contract Safe (eth:0xd17B14ff80d3bF8e95D719e177d247Be02d553d2) {
    +++ description: None
      values.writeFunctionPermissions:
+        [{"skipped":true,"reason":"tooManyWriteFunctions","count":14}]
    }
```

```diff
    contract MasterMinter (eth:0xE982615d461DD5cD06575BbeA87624fda4e3de17) {
    +++ description: None
      values.writeFunctionPermissions:
+        [{"function":"configureController","signature":"function configureController(\r\n        address _controller,\r\n        address _worker\r\n    )","file":"MasterMinter.sol","permissionType":"modifier","category":"administrative","modifiers":["onlyOwner"],"requireStatementCount":4},{"function":"configureMinter","signature":"function configureMinter(\r\n        address _minter,\r\n        uint256 _minterAllowedAmount\r\n    )","file":"MasterMinter.sol","permissionType":"none","category":"administrative"},{"function":"decrementMinterAllowance","signature":"function decrementMinterAllowance(\r\n        uint256 _allowanceDecrement\r\n    )","file":"MasterMinter.sol","permissionType":"modifier","category":"other","modifiers":["onlyController"],"hasMsgSenderCheck":true,"requireStatementCount":2},{"function":"incrementMinterAllowance","signature":"function incrementMinterAllowance(\r\n        uint256 _allowanceIncrement\r\n    )","file":"MasterMinter.sol","permissionType":"modifier","category":"other","modifiers":["onlyController"],"hasMsgSenderCheck":true,"requireStatementCount":4},{"function":"removeController","signature":"function removeController(\r\n        address _controller\r\n    )","file":"MasterMinter.sol","permissionType":"modifier","category":"other","modifiers":["onlyOwner"],"requireStatementCount":2},{"function":"removeMinter","signature":"function removeMinter(address _minter)","file":"MasterMinter.sol","permissionType":"none","category":"other"},{"function":"setMinterManager","signature":"function setMinterManager(\r\n        address _newMinterManager\r\n    )","file":"MasterMinter.sol","permissionType":"modifier","category":"administrative","modifiers":["onlyOwner","onlyController"],"hasMsgSenderCheck":true,"requireStatementCount":2},{"function":"transferOwnership","signature":"function transferOwnership(address newOwner)","file":"MasterMinter.sol","permissionType":"modifier","category":"financial","modifiers":["onlyOwner"],"requireStatementCount":1}]
    }
```

```diff
    contract AuthorizedForwarder (eth:0xE9DcbaCc91dB0e37562a8455c80d0734D7CF3bd1) {
    +++ description: None
      values.writeFunctionPermissions:
+        [{"skipped":true,"reason":"tooManySourceFiles","fileCount":6}]
    }
```

```diff
    contract AssetListFactory (eth:0xEA2a6E7B41505d62d404F927F991Edc9E45883c2) {
    +++ description: None
      values.writeFunctionPermissions:
+        [{"skipped":true,"reason":"tooManySourceFiles","fileCount":9}]
    }
```

```diff
    contract AuthorizedForwarder (eth:0xF38326579519377178725A741C35999E8051e907) {
    +++ description: None
      values.writeFunctionPermissions:
+        [{"skipped":true,"reason":"tooManySourceFiles","fileCount":6}]
    }
```

```diff
    contract TokenMinterV2 (eth:0xfd78EE919681417d192449715b2594ab58f5D002) {
    +++ description: Part of CCTP: Used for automated access control for minting.
      values.writeFunctionPermissions:
+        [{"skipped":true,"reason":"tooManyWriteFunctions","count":16}]
    }
```

Generated with discovered.json: 0xec1ea09985ca15c0805609211a2e51ea300e22c7

# Diff at Mon, 15 Sep 2025 23:06:27 GMT:

- author: emduc (<emilien@defiscan.info>)
- comparing to: main@1bd0b192fca7ed96c47d0936b3e6d500e8f5cdba block: 1757963686
- current timestamp: 1757977446

## Description

Provide description of changes. This section will be preserved.

## Watched changes

```diff
    contract CompoundGovernor (eth:0x309a862bbC1A00e45506cB8A802D1ff10004c8C0) {
    +++ description: None
      values.clock:
-        23370495
+        23371636
    }
```

```diff
    contract cUSDTv3 (eth:0xA17581A9E3356d9A858b789D68B4d866e593aE94) {
    +++ description: Compound v3 USDT market - lending pool for USDT
      values.getReserves:
-        "872493543548497944455"
+        "872526111210753473767"
      values.getUtilization:
-        "839030305768989979"
+        "810669589048657414"
      values.totalBorrow:
-        "60203436681637574138412"
+        "58455015570777876910673"
      values.totalSupply:
-        "71753522968133608510372"
+        "72107064060892115393399"
    }
```

```diff
    contract Wrapped Ether Token (eth:0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2) {
    +++ description: None
      values.totalSupply:
-        "2402015453354402779696981"
+        "2407277308337512964437645"
    }
```

```diff
    contract cUSDCv3 (eth:0xc3d688B66703497DAA19211EEdff47f25384cdc3) {
    +++ description: Compound v3 USDC market - main lending pool for USDC with enhanced capital efficiency
      values.getReserves:
-        15917465808252
+        15918347969921
      values.getUtilization:
-        "901617279594948882"
+        "902047324418176623"
      values.totalBorrow:
-        481778021137199
+        481924382623519
      values.totalSupply:
-        534348676381201
+        534256178479821
    }
```

```diff
    contract ConstantPriceFeed (eth:0xD72ac1bCE9177CFe7aEb5d0516a38c88a64cE0AB) {
    +++ description: None
      values.latestRoundData.startedAt:
-        1757963675
+        1757977439
      values.latestRoundData.updatedAt:
-        1757963675
+        1757977439
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1757963686 (main branch discovery), not current.

```diff
    contract cUSDCv3 (eth:0xc3d688B66703497DAA19211EEdff47f25384cdc3) {
    +++ description: Compound v3 USDC market - main lending pool for USDC with enhanced capital efficiency
      values.functionPermissions:
+        [{"function":"_beforeFallback","signature":"function _beforeFallback()","file":"contracts/vendor/proxy/transparent/TransparentUpgradeableProxy.sol","permissionType":"msgSender","requireStatements":["msg.sender != _getAdmin("]}]
    }
```

Generated with discovered.json: 0x45735f2fb3895ba1bfdd5335780a0893ec3fc515

# Diff at Mon, 15 Sep 2025 19:16:51 GMT:

- author: emduc (<emilien@defiscan.info>)
- current timestamp: 1757963686

## Description

Discovery rerun on the same block number with only config-related changes.

## Initial discovery

```diff
+   Status: CREATED
    contract CometExtAssetList (eth:0x16F3532e6AF45A2C51B6C77b1267cEF34A9cf3B3)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CometProxyAdmin (eth:0x1EC63B5883C3481134FD50D5DAebc83Ecd2E8779)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafe (eth:0x21f73D42Eb58Ba49dDB685dc29D3bF5c0f0373CA)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GatewayMinter (eth:0x2222222d7164433c4C09B0b0D809a9b52C04C205)
    +++ description: Entrypoint or minter of USDC on this chain for the Gateway protocol.
```

```diff
+   Status: CREATED
    contract TokenMessengerV2 (eth:0x28b5a0e9C621a5BadaA536219b3a228C8168cf5d)
    +++ description: Part of CCTP
```

```diff
+   Status: CREATED
    contract ConfirmedTransactionModule (eth:0x2e1B5a40Edc922bCE489668b11749B8eAbd67f6b)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CompoundGovernor (eth:0x309a862bbC1A00e45506cB8A802D1ff10004c8C0)
    +++ description: None
```

```diff
+   Status: CREATED
    contract cWETHv3 (eth:0x316f9708bB98af7dA9c68C1C3b5e79039cD336E3)
    +++ description: Compound v3 WETH market - lending pool for WETH
```

```diff
+   Status: CREATED
    contract AuthorizedForwarder (eth:0x35a06994a99B335b700bB3c875408489a9F8BbeF)
    +++ description: None
```

```diff
+   Status: CREATED
    contract AuthorizedForwarder (eth:0x3Dc0D7C8f6925422AF7CFEafaF1588c185C05624)
    +++ description: None
```

```diff
+   Status: CREATED
    contract AssetListFactory (eth:0x3fF744cF6078714bB9d3c4fE5Ab37fA6d05dEC4E)
    +++ description: None
```

```diff
+   Status: CREATED
    contract AuthorizedForwarder (eth:0x42Afc2F6aE88678296EcB2eBA34cCfbd1Adc5F93)
    +++ description: None
```

```diff
+   Status: CREATED
    contract AuthorizedForwarder (eth:0x4b4df3c44FA13f9D12277458e2069EcBbeE1b085)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ChainLink Token (eth:0x514910771AF9Ca656af840dff83E8264EcF986CA)
    +++ description: None
```

```diff
+   Status: CREATED
    contract AuthorizedForwarder (eth:0x585B3e95EEdd03AF221F724557D03384864Da3ca)
    +++ description: None
```

```diff
+   Status: CREATED
    contract AuthorizedForwarder (eth:0x5C026B7107f1F92a9768CF64f8B2a22252B0788d)
    +++ description: None
```

```diff
+   Status: CREATED
    contract AuthorizedForwarder (eth:0x5Dc428646BF9a29A4d623E0CDB57384E811f6F77)
    +++ description: None
```

```diff
+   Status: CREATED
    contract AuthorizedForwarder (eth:0x5eA7eAe0EBC1f4256806C8bf234F672d410Fc988)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SimpleWriteAccessController (eth:0x641B698aD1C6E503470520B0EeCb472c0589dfE6)
    +++ description: None
```

```diff
+   Status: CREATED
    contract AuthorizedForwarder (eth:0x6aEeF00A3A55b2a11C96e59b48bdb3f30DD8125A)
    +++ description: None
```

```diff
+   Status: CREATED
    contract AuthorizedForwarder (eth:0x6D53d5E35F5226a1613877e071b81217387aC6B5)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Timelock (eth:0x6d903f6003cca6255D85CcA4D3B5E5146dC33925)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyAdmin (eth:0x725ED7F44F0888aeC1b7630AB1ACdced91E0591A)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GatewayWallet (eth:0x77777777Dcc4d5A8B6E418Fd04D8997ef11000eE)
    +++ description: Exit point or burner of USDC on this chain for the Gateway protocol.
```

```diff
+   Status: CREATED
    contract AuthorizedForwarder (eth:0x7A13cD97D442856FF5387d55a7b3F09bf680102B)
    +++ description: None
```

```diff
+   Status: CREATED
    contract AuthorizedForwarder (eth:0x7B740d24396B09F992B655A590139D7Fbb5C73c8)
    +++ description: None
```

```diff
+   Status: CREATED
    contract AuthorizedForwarder (eth:0x8AaDF849561DcCeC75DA44d1147E736E0cc0134E)
    +++ description: None
```

```diff
+   Status: CREATED
    contract EACAggregatorProxy (eth:0x8fFfFfd4AfB6115b954Bd326cbe7B4BA576818f6)
    +++ description: None
```

```diff
+   Status: CREATED
    contract AuthorizedForwarder (eth:0x990cfBBDc5aeB794B657b4309017F84479e8Eb7D)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SimpleWriteAccessController (eth:0x9db83CEf9f68b63989E4E82D65D549e7fF2aCda9)
    +++ description: None
```

```diff
+   Status: CREATED
    contract USD Coin Token (eth:0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48)
    +++ description: None
```

```diff
+   Status: CREATED
    contract cUSDTv3 (eth:0xA17581A9E3356d9A858b789D68B4d866e593aE94)
    +++ description: Compound v3 USDT market - lending pool for USDT
```

```diff
+   Status: CREATED
    contract CometExtAssetList (eth:0xA70a0227028aD005F4Fc9376a82cd1462e3AAedC)
    +++ description: None
```

```diff
+   Status: CREATED
    contract AssetList (eth:0xB7859b967374566bdeA8d23C6d248e6619BC0f88)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafe (eth:0xbbf3f1421D886E9b2c5D716B5192aC998af2012c)
    +++ description: None
```

```diff
+   Status: CREATED
    contract TokenMessenger (eth:0xBd3fa81B58Ba92a82136038B25aDec7066af3155)
    +++ description: Part of CCTP
```

```diff
+   Status: CREATED
    contract Compound Token (eth:0xc00e94Cb662C3520282E6f5717214004A7f26888)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Wrapped Ether Token (eth:0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2)
    +++ description: None
```

```diff
+   Status: CREATED
    contract cUSDCv3 (eth:0xc3d688B66703497DAA19211EEdff47f25384cdc3)
    +++ description: Compound v3 USDC market - main lending pool for USDC with enhanced capital efficiency
```

```diff
+   Status: CREATED
    contract TokenMinter (eth:0xc4922d64a24675E16e1586e3e3Aa56C06fABe907)
    +++ description: Part of CCTP: Used for automated access control for minting.
```

```diff
+   Status: CREATED
    contract AccessControlledOCR2Aggregator (eth:0xc9E1a09622afdB659913fefE800fEaE5DBbFe9d7)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Safe (eth:0xd17B14ff80d3bF8e95D719e177d247Be02d553d2)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ConstantPriceFeed (eth:0xD72ac1bCE9177CFe7aEb5d0516a38c88a64cE0AB)
    +++ description: None
```

```diff
+   Status: CREATED
    contract MasterMinter (eth:0xE982615d461DD5cD06575BbeA87624fda4e3de17)
    +++ description: None
```

```diff
+   Status: CREATED
    contract AuthorizedForwarder (eth:0xE9DcbaCc91dB0e37562a8455c80d0734D7CF3bd1)
    +++ description: None
```

```diff
+   Status: CREATED
    contract AssetListFactory (eth:0xEA2a6E7B41505d62d404F927F991Edc9E45883c2)
    +++ description: None
```

```diff
+   Status: CREATED
    contract AssetList (eth:0xF2B41D0AFE27A1E6E5e30A00Cecc17d41202cfe9)
    +++ description: None
```

```diff
+   Status: CREATED
    contract AuthorizedForwarder (eth:0xF38326579519377178725A741C35999E8051e907)
    +++ description: None
```

```diff
+   Status: CREATED
    contract TokenMinterV2 (eth:0xfd78EE919681417d192449715b2594ab58f5D002)
    +++ description: Part of CCTP: Used for automated access control for minting.
```
