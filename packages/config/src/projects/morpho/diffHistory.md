Generated with discovered.json: 0xc16d96bacfc646970cd0406f89fe95ae318391af

# Diff at Tue, 02 Dec 2025 18:33:39 GMT:

- author: emduc (<emilien@defiscan.info>)
- comparing to: main@f4ea5da2ba5ce2f29b2bd094dcf24538fed3aae1 block: 1758827629
- current timestamp: 1764700344

## Description

Provide description of changes. This section will be preserved.

## Watched changes

```diff
    contract Morpho Token (eth:0x58D97B57BB95320F9a05dC918Aef65434969c2B2) {
    +++ description: None
      values.totalSupply:
-        "1000000000000000000000000000"
+        "999999999801032726017310661"
    }
```

```diff
    contract Wrapped Ether Token (eth:0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2) {
    +++ description: None
      values.totalSupply:
-        "2430015647464185564221932"
+        "2787522463126466628993882"
    }
```

```diff
    contract GnosisSafe (eth:0xF057afeEc22E220f47AD4220871364e9E828b2e9) {
    +++ description: None
      values.$members.0:
-        "eth:0x32b9800409c3A6Ace972Cbb5a33145e071DD94CE"
+        "eth:0xE161c14651ec72b696ab461a5aE51043E680B3Ff"
      values.$members.4:
-        "eth:0x4203aF750DE8F4707DACC2CA7e5dC91121DD5B59"
      values.$members.5:
-        "eth:0xEEb1645eDa43F591d6b69e2460d7EED4b4057Ac6"
+        "eth:0x435eC8504b628FD7871914A5023567715544Abae"
      values.multisigThreshold:
-        "3 of 8 (38%)"
+        "3 of 7 (43%)"
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1758827629 (main branch discovery), not current.

```diff
    contract MetaMorphoV1_1Factory (eth:0x1897A8997241C1cD4bD0698647e4EB7213535c24) {
    +++ description: None
      values.writeFunctionPermissions:
-        [{"skipped":true,"reason":"sourceCodeTooLarge","sizeBytes":260362}]
    }
```

```diff
    contract UniversalRewardsDistributor (eth:0x330eefa8a787552DC5cAd3C3cA644844B1E61Ddb) {
    +++ description: None
      values.writeFunctionPermissions:
-        [{"function":"acceptRoot","signature":"function acceptRoot()","file":"src/UniversalRewardsDistributor.sol","permissionType":"msgSender","category":"other","hasMsgSenderCheck":true,"requireStatementCount":6},{"function":"claim","signature":"function claim(address account, address reward, uint256 claimable, bytes32[] calldata proof)","file":"src/UniversalRewardsDistributor.sol","permissionType":"modifier","category":"other","modifiers":["onlyOwner"],"hasMsgSenderCheck":true,"requireStatementCount":6},{"function":"revokePendingRoot","signature":"function revokePendingRoot()","file":"src/UniversalRewardsDistributor.sol","permissionType":"msgSender","category":"other","hasMsgSenderCheck":true,"requireStatementCount":6},{"function":"setOwner","signature":"function setOwner(address newOwner)","file":"src/UniversalRewardsDistributor.sol","permissionType":"modifier","category":"administrative","modifiers":["onlyOwner"],"requireStatementCount":1},{"function":"setRoot","signature":"function setRoot(bytes32 newRoot, bytes32 newIpfsHash)","file":"src/UniversalRewardsDistributor.sol","permissionType":"modifier","category":"administrative","modifiers":["onlyOwner"],"hasMsgSenderCheck":true,"requireStatementCount":5},{"function":"setRootUpdater","signature":"function setRootUpdater(address updater, bool active)","file":"src/UniversalRewardsDistributor.sol","permissionType":"modifier","category":"administrative","modifiers":["onlyOwner"],"requireStatementCount":2},{"function":"setTimelock","signature":"function setTimelock(uint256 newTimelock)","file":"src/UniversalRewardsDistributor.sol","permissionType":"modifier","category":"administrative","modifiers":["onlyOwner"],"requireStatementCount":3},{"function":"submitRoot","signature":"function submitRoot(bytes32 newRoot, bytes32 newIpfsHash)","file":"src/UniversalRewardsDistributor.sol","permissionType":"msgSender","category":"other","hasMsgSenderCheck":true,"requireStatementCount":6}]
    }
```

```diff
    contract MorphoChainlinkOracleV2Factory (eth:0x3A7bB36Ee3f3eE32A60e9f2b33c1e5f2E83ad766) {
    +++ description: None
      values.writeFunctionPermissions:
-        [{"function":"createMorphoChainlinkOracleV2","signature":"function createMorphoChainlinkOracleV2(\n        IERC4626 baseVault,\n        uint256 baseVaultConversionSample,\n        AggregatorV3Interface baseFeed1,\n        AggregatorV3Interface baseFeed2,\n        uint256 baseTokenDecimals,\n        IERC4626 quoteVault,\n        uint256 quoteVaultConversionSample,\n        AggregatorV3Interface quoteFeed1,\n        AggregatorV3Interface quoteFeed2,\n        uint256 quoteTokenDecimals,\n        bytes32 salt\n    )","file":"src/morpho-chainlink/MorphoChainlinkOracleV2Factory.sol","permissionType":"msgSender","category":"other","hasMsgSenderCheck":true}]
    }
```

```diff
    contract EthereumBundlerV2 (eth:0x4095F064B8d3c3548A3bebfd0Bbfd04750E30077) {
    +++ description: None
      values.writeFunctionPermissions:
-        [{"skipped":true,"reason":"tooManyWriteFunctions","count":33}]
    }
```

```diff
    contract Morpho Token (eth:0x58D97B57BB95320F9a05dC918Aef65434969c2B2) {
    +++ description: None
      values.writeFunctionPermissions:
-        [{"function":"upgradeToAndCall","signature":"function upgradeToAndCall(address newImplementation, bytes memory data)","file":"lib/openzeppelin-contracts-upgradeable/lib/openzeppelin-contracts/contracts/proxy/ERC1967/ERC1967Utils.sol","permissionType":"none","category":"other"}]
      errors:
-        {"proxiableUUID":"Processing error occurred."}
    }
```

```diff
    contract PreLiquidationFactory (eth:0x6FF33615e792E35ed1026ea7cACCf42D9BF83476) {
    +++ description: None
      values.writeFunctionPermissions:
-        [{"function":"createPreLiquidation","signature":"function createPreLiquidation(Id id, PreLiquidationParams calldata preLiquidationParams)","file":"src/PreLiquidationFactory.sol","permissionType":"none","category":"other"}]
    }
```

```diff
    contract AdaptiveCurveIrm (eth:0x870aC11D48B15DB9a138Cf899d20F13F79Ba00BC) {
    +++ description: None
      values.writeFunctionPermissions:
-        [{"function":"borrowRate","signature":"function borrowRate(MarketParams memory marketParams, Market memory market)","file":"src/AdaptiveCurveIrm.sol","permissionType":"msgSender","category":"liquidation","hasMsgSenderCheck":true,"requireStatementCount":1}]
    }
```

```diff
    contract MorphoToken (eth:0x9994E35Db50125E0DF82e4c2dde62496CE330999) {
    +++ description: None
      values.writeFunctionPermissions:
-        [{"function":"approve","signature":"function approve(address spender, uint256 amount)","file":"lib/semitransferable-token/lib/solmate/src/tokens/ERC20.sol","permissionType":"msgSender","category":"other","hasMsgSenderCheck":true,"requireStatementCount":1},{"function":"burn","signature":"function burn(uint256 amount)","file":"lib/semitransferable-token/src/Token.sol","permissionType":"msgSender","category":"financial","hasMsgSenderCheck":true},{"function":"mint","signature":"function mint(address to, uint256 amount)","file":"lib/semitransferable-token/src/Token.sol","permissionType":"msgSender","category":"financial","hasMsgSenderCheck":true},{"function":"permit","signature":"function permit(\n        address owner,\n        address spender,\n        uint256 value,\n        uint256 deadline,\n        uint8 v,\n        bytes32 r,\n        bytes32 s\n    )","file":"lib/semitransferable-token/lib/solmate/src/tokens/ERC20.sol","permissionType":"none","category":"other","requireStatementCount":2},{"function":"setOwner","signature":"function setOwner(address newOwner)","file":"lib/semitransferable-token/src/Auth.sol","permissionType":"msgSender","category":"administrative","hasMsgSenderCheck":true},{"function":"setPublicCapability","signature":"function setPublicCapability(\n        bytes4 functionSig,\n        bool enabled\n    )","file":"lib/semitransferable-token/src/RolesAuthority.sol","permissionType":"none","category":"administrative"},{"function":"setRoleCapability","signature":"function setRoleCapability(\n        uint8 role,\n        bytes4 functionSig,\n        bool enabled\n    )","file":"lib/semitransferable-token/src/RolesAuthority.sol","permissionType":"none","category":"administrative"},{"function":"setUserRole","signature":"function setUserRole(\n        address user,\n        uint8 role,\n        bool enabled\n    )","file":"lib/semitransferable-token/src/RolesAuthority.sol","permissionType":"none","category":"administrative"},{"function":"transfer","signature":"function transfer(address to, uint256 amount)","file":"lib/semitransferable-token/src/Token.sol","permissionType":"msgSender","category":"financial","hasMsgSenderCheck":true},{"function":"transferFrom","signature":"function transferFrom(\n    address from,\n    address to,\n    uint256 amount\n  )","file":"lib/semitransferable-token/src/Token.sol","permissionType":"msgSender","category":"financial","hasMsgSenderCheck":true}]
    }
```

```diff
    contract UrdFactory (eth:0x9baA51245CDD28D8D74Afe8B3959b616E9ee7c8D) {
    +++ description: None
      values.writeFunctionPermissions:
-        [{"function":"createUrd","signature":"function createUrd(\n        address initialOwner,\n        uint256 initialTimelock,\n        bytes32 initialRoot,\n        bytes32 initialIpfsHash,\n        bytes32 salt\n    )","file":"src/UrdFactory.sol","permissionType":"msgSender","category":"other","hasMsgSenderCheck":true}]
    }
```

```diff
    contract Wrapper (eth:0x9D03bb2092270648d7480049d0E58d2FcF0E5123) {
    +++ description: None
      values.writeFunctionPermissions:
-        [{"function":"depositFor","signature":"function depositFor(address account, uint256 value)","file":"src/Wrapper.sol","permissionType":"msgSender","category":"financial","hasMsgSenderCheck":true,"requireStatementCount":4},{"function":"withdrawTo","signature":"function withdrawTo(address account, uint256 value)","file":"src/Wrapper.sol","permissionType":"msgSender","category":"financial","hasMsgSenderCheck":true,"requireStatementCount":2}]
    }
```

```diff
    contract Morpho (eth:0xBBBBBbbBBb9cC5e90e3b3Af64bdAF62C37EEFFCb) {
    +++ description: None
      values.writeFunctionPermissions:
-        [{"function":"accrueInterest","signature":"function accrueInterest(MarketParams memory marketParams)","file":"src/Morpho.sol","permissionType":"msgSender","category":"other","hasMsgSenderCheck":true,"requireStatementCount":1},{"function":"borrow","signature":"function borrow(\n        MarketParams memory marketParams,\n        uint256 assets,\n        uint256 shares,\n        address onBehalf,\n        address receiver\n    )","file":"src/Morpho.sol","permissionType":"msgSender","category":"liquidation","hasMsgSenderCheck":true,"requireStatementCount":9},{"function":"createMarket","signature":"function createMarket(MarketParams memory marketParams)","file":"src/Morpho.sol","permissionType":"msgSender","category":"other","hasMsgSenderCheck":true,"requireStatementCount":6},{"function":"enableIrm","signature":"function enableIrm(address irm)","file":"src/Morpho.sol","permissionType":"modifier","category":"other","modifiers":["onlyOwner"],"requireStatementCount":10},{"function":"enableLltv","signature":"function enableLltv(uint256 lltv)","file":"src/Morpho.sol","permissionType":"modifier","category":"other","modifiers":["onlyOwner"],"requireStatementCount":9},{"function":"flashLoan","signature":"function flashLoan(address token, uint256 assets, bytes calldata data)","file":"src/Morpho.sol","permissionType":"msgSender","category":"liquidation","hasMsgSenderCheck":true,"requireStatementCount":5},{"function":"liquidate","signature":"function liquidate(\n        MarketParams memory marketParams,\n        address borrower,\n        uint256 seizedAssets,\n        uint256 repaidShares,\n        bytes calldata data\n    )","file":"src/Morpho.sol","permissionType":"none","category":"liquidation","requireStatementCount":3},{"function":"repay","signature":"function repay(\n        MarketParams memory marketParams,\n        uint256 assets,\n        uint256 shares,\n        address onBehalf,\n        bytes calldata data\n    )","file":"src/Morpho.sol","permissionType":"msgSender","category":"liquidation","hasMsgSenderCheck":true,"requireStatementCount":6},{"function":"setAuthorization","signature":"function setAuthorization(address authorized, bool newIsAuthorized)","file":"src/Morpho.sol","permissionType":"msgSender","category":"administrative","hasMsgSenderCheck":true,"requireStatementCount":5},{"function":"setAuthorizationWithSig","signature":"function setAuthorizationWithSig(Authorization memory authorization, Signature calldata signature)","file":"src/Morpho.sol","permissionType":"msgSender","category":"administrative","hasMsgSenderCheck":true,"requireStatementCount":4},{"function":"setFee","signature":"function setFee(MarketParams memory marketParams, uint256 newFee)","file":"src/Morpho.sol","permissionType":"modifier","category":"administrative","modifiers":["onlyOwner"],"requireStatementCount":8},{"function":"setFeeRecipient","signature":"function setFeeRecipient(address newFeeRecipient)","file":"src/Morpho.sol","permissionType":"modifier","category":"administrative","modifiers":["onlyOwner"],"requireStatementCount":7},{"function":"setOwner","signature":"function setOwner(address newOwner)","file":"src/Morpho.sol","permissionType":"modifier","category":"administrative","modifiers":["onlyOwner"],"requireStatementCount":11},{"function":"supply","signature":"function supply(\n        MarketParams memory marketParams,\n        uint256 assets,\n        uint256 shares,\n        address onBehalf,\n        bytes calldata data\n    )","file":"src/Morpho.sol","permissionType":"msgSender","category":"other","hasMsgSenderCheck":true,"requireStatementCount":7},{"function":"supplyCollateral","signature":"function supplyCollateral(MarketParams memory marketParams, uint256 assets, address onBehalf, bytes calldata data)","file":"src/Morpho.sol","permissionType":"msgSender","category":"other","hasMsgSenderCheck":true,"requireStatementCount":8},{"function":"withdraw","signature":"function withdraw(\n        MarketParams memory marketParams,\n        uint256 assets,\n        uint256 shares,\n        address onBehalf,\n        address receiver\n    )","file":"src/Morpho.sol","permissionType":"msgSender","category":"financial","hasMsgSenderCheck":true,"requireStatementCount":8},{"function":"withdrawCollateral","signature":"function withdrawCollateral(MarketParams memory marketParams, uint256 assets, address onBehalf, address receiver)","file":"src/Morpho.sol","permissionType":"msgSender","category":"financial","hasMsgSenderCheck":true,"requireStatementCount":8}]
    }
```

```diff
    contract Wrapped Ether Token (eth:0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2) {
    +++ description: None
      values.writeFunctionPermissions:
-        [{"function":"approve","signature":"function approve(address guy, uint wad)","file":"WETH9.sol","permissionType":"msgSender","category":"other","hasMsgSenderCheck":true,"requireStatementCount":2},{"function":"deposit","signature":"function deposit()","file":"WETH9.sol","permissionType":"msgSender","category":"financial","hasMsgSenderCheck":true,"requireStatementCount":3},{"function":"transfer","signature":"function transfer(address dst, uint wad)","file":"WETH9.sol","permissionType":"msgSender","category":"financial","hasMsgSenderCheck":true,"requireStatementCount":2},{"function":"transferFrom","signature":"function transferFrom(address src, address dst, uint wad)","file":"WETH9.sol","permissionType":"msgSender","category":"financial","hasMsgSenderCheck":true,"requireStatementCount":2},{"function":"withdraw","signature":"function withdraw(uint wad)","file":"WETH9.sol","permissionType":"msgSender","category":"financial","hasMsgSenderCheck":true,"requireStatementCount":3}]
    }
```

```diff
    contract GnosisSafe (eth:0xcBa28b38103307Ec8dA98377ffF9816C164f9AFa) {
    +++ description: None
      values.writeFunctionPermissions:
-        []
    }
```

```diff
    contract GnosisSafe (eth:0xF057afeEc22E220f47AD4220871364e9E828b2e9) {
    +++ description: None
      values.writeFunctionPermissions:
-        []
    }
```

```diff
    contract PublicAllocator (eth:0xfd32fA2ca22c76dD6E550706Ad913FC6CE91c75D) {
    +++ description: None
      values.writeFunctionPermissions:
-        [{"function":"reallocateTo","signature":"function reallocateTo(address vault, Withdrawal[] calldata withdrawals, MarketParams calldata supplyMarketParams)","file":"src/PublicAllocator.sol","permissionType":"msgSender","category":"other","hasMsgSenderCheck":true},{"function":"setAdmin","signature":"function setAdmin(address vault, address newAdmin)","file":"src/PublicAllocator.sol","permissionType":"modifier","category":"administrative","modifiers":["onlyAdmin"],"hasMsgSenderCheck":true},{"function":"setFee","signature":"function setFee(address vault, uint256 newFee)","file":"src/PublicAllocator.sol","permissionType":"modifier","category":"administrative","modifiers":["onlyAdmin"],"hasMsgSenderCheck":true},{"function":"setFlowCaps","signature":"function setFlowCaps(address vault, FlowCapsConfig[] calldata config)","file":"src/PublicAllocator.sol","permissionType":"modifier","category":"administrative","modifiers":["onlyAdmin"],"hasMsgSenderCheck":true},{"function":"transferFee","signature":"function transferFee(address vault, address payable feeRecipient)","file":"src/PublicAllocator.sol","permissionType":"modifier","category":"financial","modifiers":["onlyAdmin"],"hasMsgSenderCheck":true}]
    }
```

Generated with discovered.json: 0xcd6aa33c4ae73155b0c7ad3e7dc93fb9e1f976f9

# Diff at Thu, 25 Sep 2025 19:16:04 GMT:

- author: emduc (<emilien@defiscan.info>)
- current timestamp: 1758827629

## Description

Discovery rerun on the same block number with only config-related changes.

## Initial discovery

```diff
+   Status: CREATED
    contract MetaMorphoV1_1Factory (eth:0x1897A8997241C1cD4bD0698647e4EB7213535c24)
    +++ description: None
```

```diff
+   Status: CREATED
    contract UniversalRewardsDistributor (eth:0x330eefa8a787552DC5cAd3C3cA644844B1E61Ddb)
    +++ description: None
```

```diff
+   Status: CREATED
    contract MorphoChainlinkOracleV2Factory (eth:0x3A7bB36Ee3f3eE32A60e9f2b33c1e5f2E83ad766)
    +++ description: None
```

```diff
+   Status: CREATED
    contract EthereumBundlerV2 (eth:0x4095F064B8d3c3548A3bebfd0Bbfd04750E30077)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Morpho Token (eth:0x58D97B57BB95320F9a05dC918Aef65434969c2B2)
    +++ description: None
```

```diff
+   Status: CREATED
    contract PreLiquidationFactory (eth:0x6FF33615e792E35ed1026ea7cACCf42D9BF83476)
    +++ description: None
```

```diff
+   Status: CREATED
    contract AdaptiveCurveIrm (eth:0x870aC11D48B15DB9a138Cf899d20F13F79Ba00BC)
    +++ description: None
```

```diff
+   Status: CREATED
    contract MorphoToken (eth:0x9994E35Db50125E0DF82e4c2dde62496CE330999)
    +++ description: None
```

```diff
+   Status: CREATED
    contract UrdFactory (eth:0x9baA51245CDD28D8D74Afe8B3959b616E9ee7c8D)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Wrapper (eth:0x9D03bb2092270648d7480049d0E58d2FcF0E5123)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Morpho (eth:0xBBBBBbbBBb9cC5e90e3b3Af64bdAF62C37EEFFCb)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Wrapped Ether Token (eth:0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafe (eth:0xcBa28b38103307Ec8dA98377ffF9816C164f9AFa)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafe (eth:0xF057afeEc22E220f47AD4220871364e9E828b2e9)
    +++ description: None
```

```diff
+   Status: CREATED
    contract PublicAllocator (eth:0xfd32fA2ca22c76dD6E550706Ad913FC6CE91c75D)
    +++ description: None
```
