Generated with discovered.json: 0xc95962501cab0f4c35b48a4bf093e2a2e73306ac

# Diff at Thu, 09 Apr 2026 10:28:06 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- current timestamp: 1775724196

## Description

Discovery rerun on the same block number with only config-related changes.

## Initial discovery

```diff
+   Status: CREATED
    contract StablesPlusTBTCOracle (eth:0x0083421fd178749af2201ddA5A7C3feB5790B80c)
    +++ description: Per-reserve price oracle for an Aave V4 spoke. Maps each reserveId on the paired spoke to a price source contract (a Chainlink feed wrapped in a price-cap adapter, or a fixed-price adapter for stables). The Spoke depends on it for every borrow, withdraw, and liquidation calculation.
```

```diff
+   Status: CREATED
    contract RsETHACLManager (eth:0x013E2C7567b6231e865BB9273F8c7656103611c0)
    +++ description: Aave V4 ACLManager (legacy bytes32 role variant). Tracks roles like RISK_ADMIN, EMERGENCY_ADMIN, BRIDGE, etc. for the price-cap adapters and other contracts that consult it via ACL_MANAGER. Distinct from the OZ V5 AccessManager that gates Hub/Spoke functions.
```

```diff
+   Status: CREATED
    contract EACAggregatorProxy (eth:0x04F84020Fdf10d9ee64D1dcC2986EDF2F556DA11)
    +++ description: Chainlink price feed proxy. Wraps an underlying aggregator and forwards latestAnswer / latestRoundData; the admin chain belongs to Chainlink, not the consuming protocol.
```

```diff
+   Status: CREATED
    contract EthenaHub (eth:0x06002e9c4412CB7814a791eA3666D905871E536A)
    +++ description: Aave V4 Hub. Cross-chain accounting hub: per-asset config (interest rate strategy, treasury, premium) and the registry of spokes that hold each asset across all chains. Trust assumption: governance role members in the AccessManager (authority) can change every per-asset parameter and the spoke whitelist; the HubProxyAdmin can swap the implementation.
```

```diff
+   Status: CREATED
    contract ProxyAdmin (eth:0x078247481bCFa9AB3C566f7a769352b8B4189532)
    +++ description: None
```

```diff
+   Status: CREATED
    contract AccessManager (eth:0x08aE3BE30958cDd1847ec58fFfd4C451a87fDF01)
    +++ description: OpenZeppelin V5 AccessManager with an enumerable extension. The single source of truth for which roles can call which functions on which Aave V4 contracts. Trusting any Aave V4 instance ultimately reduces to trusting the role members and target gating registered here.
```

```diff
+   Status: CREATED
    contract PendlePriceAdapterA (eth:0x0a72df02CE3E4185b6CEDf561f0AE651E9BeE235)
    +++ description: Aave-deployed price oracle adapter that wraps a Chainlink feed (BASE_TO_USD_AGGREGATOR) with a growth-rate cap and an optional ratio provider (RATIO_PROVIDER) for liquid-staked or correlated assets. The cap bounds how fast the wrapped price can grow; the ACL_MANAGER is the only contract that can re-snapshot or re-arm the cap. The ratio provider is the underlying staked-asset contract; the trust analysis treats it as a foreign asset, not as something to walk.
```

```diff
+   Status: CREATED
    contract ProxyAdmin (eth:0x128E41124dbc7d81434f332F9759B93243758F7B)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Safe (eth:0x187AAE17d4931310B3fc75743e7F16Bdc9eD77e9)
    +++ description: None
```

```diff
+   Status: CREATED
    contract BTCSpokeOracle (eth:0x198Cac7f54FFc7d709Ac0FEc4B6454CE73e21D3D)
    +++ description: Per-reserve price oracle for an Aave V4 spoke. Maps each reserveId on the paired spoke to a price source contract (a Chainlink feed wrapped in a price-cap adapter, or a fixed-price adapter for stables). The Spoke depends on it for every borrow, withdraw, and liquidation calculation.
```

```diff
+   Status: CREATED
    contract ProxyAdmin (eth:0x1De446C91cF141c76f6eeF2331128ED7A4536846)
    +++ description: None
```

```diff
+   Status: CREATED
    contract HubConfigurator (eth:0x1F0753480bB03EaA00863224602267B7E0525C3d)
    +++ description: Aave V4 HubConfigurator. Privileged interface (gated through the AccessManager) for configuring per-asset parameters on the Hub: irStrategy, treasury, premium, spoke whitelist, asset listing/delisting.
```

```diff
+   Status: CREATED
    contract EACAggregatorProxy (eth:0x214eD9Da11D2fbe465a6fc601a91E62EbEc1a0D6)
    +++ description: Chainlink price feed proxy. Wraps an underlying aggregator and forwards latestAnswer / latestRoundData; the admin chain belongs to Chainlink, not the consuming protocol.
```

```diff
+   Status: CREATED
    contract ProxyAdmin (eth:0x22249b31797bD067E37F49dC93614C316976B158)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CappedFrxUSDPriceAdapter (eth:0x25DEd2f9aE6ae9416693AB63Abe3aB25493861FD)
    +++ description: Aave-deployed price oracle adapter that wraps a Chainlink feed (BASE_TO_USD_AGGREGATOR) with a growth-rate cap and an optional ratio provider (RATIO_PROVIDER) for liquid-staked or correlated assets. The cap bounds how fast the wrapped price can grow; the ACL_MANAGER is the only contract that can re-snapshot or re-arm the cap. The ratio provider is the underlying staked-asset contract; the trust analysis treats it as a foreign asset, not as something to walk.
```

```diff
+   Status: CREATED
    contract CappedUSDTPriceAdapter (eth:0x260326c220E469358846b187eE53328303Efe19C)
    +++ description: Aave-deployed price oracle adapter that wraps a Chainlink feed (BASE_TO_USD_AGGREGATOR) with a growth-rate cap and an optional ratio provider (RATIO_PROVIDER) for liquid-staked or correlated assets. The cap bounds how fast the wrapped price can grow; the ACL_MANAGER is the only contract that can re-snapshot or re-arm the cap. The ratio provider is the underlying staked-asset contract; the trust analysis treats it as a foreign asset, not as something to walk.
```

```diff
+   Status: CREATED
    contract EACAggregatorProxy (eth:0x26C46B7aD0012cA71F2298ada567dC9Af14E7f2A)
    +++ description: Chainlink price feed proxy. Wraps an underlying aggregator and forwards latestAnswer / latestRoundData; the admin chain belongs to Chainlink, not the consuming protocol.
```

```diff
+   Status: CREATED
    contract ProxyAdmin (eth:0x2A2DEEe71645Ef881C788C85eD0C8E9f152B6531)
    +++ description: None
```

```diff
+   Status: CREATED
    contract EACAggregatorProxy (eth:0x2c1d072e956AFFC0D435Cb7AC38EF18d24d9127c)
    +++ description: Chainlink price feed proxy. Wraps an underlying aggregator and forwards latestAnswer / latestRoundData; the admin chain belongs to Chainlink, not the consuming protocol.
```

```diff
+   Status: CREATED
    contract PoolAddressesProvider (eth:0x2f39d218133AFaB8F2B819B1066c7E434Ad94E9e)
    +++ description: Aave V3 addresses provider (registry). Reached from Aave V4 because some V4 reserves are GHO-related contracts that route through the V3 GHO module. Cut walks into V3 internals; the V3 stack belongs to its own discovery.
```

```diff
+   Status: CREATED
    contract EthenaInterestRateStrategy (eth:0x31280650661b8443723fa9739b3A164E3696af48)
    +++ description: Per-asset interest rate model used by the Aave V4 Hub. Stores the kink + growth-rate parameters per assetId; the assetId space is owned by HUB.getAssetCount. Trust assumption: anyone who can change these parameters can squeeze borrowers or starve depositors.
```

```diff
+   Status: CREATED
    contract RsETHCorrelatedSpoke (eth:0x3131FE68C4722e726fe6B2819ED68e514395B9a4)
    +++ description: Aave V4 Spoke. Holds the per-asset reserves on this chain and routes liquidity through the Hub. Trust assumption: if you trust this contract you trust the Aave V4 governance role members in the AccessManager (authority) to upgrade it via the SpokeProxyAdmin and to reconfigure its reserve list, and you trust the AaveOracle to price each reserve correctly.
```

```diff
+   Status: CREATED
    contract RsETHCorrelatedOracle (eth:0x37C316996C714Bf906743071e04E62220b3271ac)
    +++ description: Per-reserve price oracle for an Aave V4 spoke. Maps each reserveId on the paired spoke to a price source contract (a Chainlink feed wrapped in a price-cap adapter, or a fixed-price adapter for stables). The Spoke depends on it for every borrow, withdraw, and liquidation calculation.
```

```diff
+   Status: CREATED
    contract EACAggregatorProxy (eth:0x3E7d1eAB13ad0104d2750B8863b489D65364e32D)
    +++ description: Chainlink price feed proxy. Wraps an underlying aggregator and forwards latestAnswer / latestRoundData; the admin chain belongs to Chainlink, not the consuming protocol.
```

```diff
+   Status: CREATED
    contract CappedSUSDePriceAdapter (eth:0x42bc86f2f08419280a99d8fbEa4672e7c30a86ec)
    +++ description: Aave-deployed price oracle adapter that wraps a Chainlink feed (BASE_TO_USD_AGGREGATOR) with a growth-rate cap and an optional ratio provider (RATIO_PROVIDER) for liquid-staked or correlated assets. The cap bounds how fast the wrapped price can grow; the ACL_MANAGER is the only contract that can re-snapshot or re-arm the cap. The ratio provider is the underlying staked-asset contract; the trust analysis treats it as a foreign asset, not as something to walk.
```

```diff
+   Status: CREATED
    contract CappedRsETHPriceAdapter (eth:0x47F52B2e43D0386cF161e001835b03Ad49889e3b)
    +++ description: Aave-deployed price oracle adapter that wraps a Chainlink feed (BASE_TO_USD_AGGREGATOR) with a growth-rate cap and an optional ratio provider (RATIO_PROVIDER) for liquid-staked or correlated assets. The cap bounds how fast the wrapped price can grow; the ACL_MANAGER is the only contract that can re-snapshot or re-arm the cap. The ratio provider is the underlying staked-asset contract; the trust analysis treats it as a foreign asset, not as something to walk.
```

```diff
+   Status: CREATED
    contract AaveGovV3Executor (eth:0x5300A1a15135EA4dc7aD5a167152C01EFc9b192A)
    +++ description: Aave Governance V3 Executor. The chain-specific executor that runs proposals approved by Aave Governance V3. From Aave V4's perspective, this is the upgrade authority of the AccessManager and a leaf trust root: deeper Aave Gov V3 internals (PayloadsController, Governance, voting portals) belong in Aave Gov V3's own discovery.
```

```diff
+   Status: CREATED
    contract EACAggregatorProxy (eth:0x547a514d5e3769680Ce22B2361c10Ea13619e8a9)
    +++ description: Chainlink price feed proxy. Wraps an underlying aggregator and forwards latestAnswer / latestRoundData; the admin chain belongs to Chainlink, not the consuming protocol.
```

```diff
+   Status: CREATED
    contract MainHubProxyAdmin (eth:0x55b71C0aeD3c616162eE7c608c089A1055CEA3Bf)
    +++ description: None
```

```diff
+   Status: CREATED
    contract EthenaIsolatedSpoke (eth:0x58131E79531caB1d52301228d1f7b842F26B9649)
    +++ description: Aave V4 Spoke. Holds the per-asset reserves on this chain and routes liquidity through the Hub. Trust assumption: if you trust this contract you trust the Aave V4 governance role members in the AccessManager (authority) to upgrade it via the SpokeProxyAdmin and to reconfigure its reserve list, and you trust the AaveOracle to price each reserve correctly.
```

```diff
+   Status: CREATED
    contract CappedUSDCPriceAdapter (eth:0x581b8Bc9d6104F71ad6da1f483B67500968C5994)
    +++ description: Aave-deployed price oracle adapter that wraps a Chainlink feed (BASE_TO_USD_AGGREGATOR) with a growth-rate cap and an optional ratio provider (RATIO_PROVIDER) for liquid-staked or correlated assets. The cap bounds how fast the wrapped price can grow; the ACL_MANAGER is the only contract that can re-snapshot or re-arm the cap. The ratio provider is the underlying staked-asset contract; the trust analysis treats it as a foreign asset, not as something to walk.
```

```diff
+   Status: CREATED
    contract ProxyAdmin (eth:0x5BeA32dE95a6107E3B8A9Faa5CB1D182C7D60D0d)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CappedLBTCPriceAdapter (eth:0x5C1771583dbbAE5AFEd71ACD2BfC0eA4029EBB04)
    +++ description: Aave-deployed price oracle adapter that wraps a Chainlink feed (BASE_TO_USD_AGGREGATOR) with a growth-rate cap and an optional ratio provider (RATIO_PROVIDER) for liquid-staked or correlated assets. The cap bounds how fast the wrapped price can grow; the ACL_MANAGER is the only contract that can re-snapshot or re-arm the cap. The ratio provider is the underlying staked-asset contract; the trust analysis treats it as a foreign asset, not as something to walk.
```

```diff
+   Status: CREATED
    contract EACAggregatorProxy (eth:0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419)
    +++ description: Chainlink price feed proxy. Wraps an underlying aggregator and forwards latestAnswer / latestRoundData; the admin chain belongs to Chainlink, not the consuming protocol.
```

```diff
+   Status: CREATED
    contract StablesPlusTBTCSpoke (eth:0x65407b940966954b23dfA3caA5C0702bB42984DC)
    +++ description: Aave V4 Spoke. Holds the per-asset reserves on this chain and routes liquidity through the Hub. Trust assumption: if you trust this contract you trust the Aave V4 governance role members in the AccessManager (authority) to upgrade it via the SpokeProxyAdmin and to reconfigure its reserve list, and you trust the AaveOracle to price each reserve correctly.
```

```diff
+   Status: CREATED
    contract WstETHCorrelatedOracle (eth:0x664D73b6C3591333Fd79510f7ce9ef81228824F5)
    +++ description: Per-reserve price oracle for an Aave V4 spoke. Maps each reserveId on the paired spoke to a price source contract (a Chainlink feed wrapped in a price-cap adapter, or a fixed-price adapter for stables). The Spoke depends on it for every borrow, withdraw, and liquidation calculation.
```

```diff
+   Status: CREATED
    contract BTCSpoke (eth:0x7EC68b5695e803e98a21a9A05d744F28b0a7753D)
    +++ description: Aave V4 Spoke. Holds the per-asset reserves on this chain and routes liquidity through the Hub. Trust assumption: if you trust this contract you trust the Aave V4 governance role members in the AccessManager (authority) to upgrade it via the SpokeProxyAdmin and to reconfigure its reserve list, and you trust the AaveOracle to price each reserve correctly.
```

```diff
+   Status: CREATED
    contract CappedWstETHPriceAdapter (eth:0x869C9Ae2C8fbe82a8b0F768b9F791f89E083222C)
    +++ description: Aave-deployed price oracle adapter that wraps a Chainlink feed (BASE_TO_USD_AGGREGATOR) with a growth-rate cap and an optional ratio provider (RATIO_PROVIDER) for liquid-staked or correlated assets. The cap bounds how fast the wrapped price can grow; the ACL_MANAGER is the only contract that can re-snapshot or re-arm the cap. The ratio provider is the underlying staked-asset contract; the trust analysis treats it as a foreign asset, not as something to walk.
```

```diff
+   Status: CREATED
    contract ProxyAdmin (eth:0x8867D58d75745020669D61677ae29d69330c6cD5)
    +++ description: None
```

```diff
+   Status: CREATED
    contract LiquidationLogic (eth:0x88dF535473C5adf1f57789734A05E555F7Deb8DB)
    +++ description: Aave V4 LiquidationLogic. Delegatecall library invoked by every Spoke to execute liquidations. Replacing this changes the liquidation pricing/bonus logic for every market that points to it.
```

```diff
+   Status: CREATED
    contract TreasuryProxyAdmin (eth:0x890B79dDcdCCd663B4D7fC121A7A70184489b505)
    +++ description: None
```

```diff
+   Status: CREATED
    contract EACAggregatorProxy (eth:0x8fFfFfd4AfB6115b954Bd326cbe7B4BA576818f6)
    +++ description: Chainlink price feed proxy. Wraps an underlying aggregator and forwards latestAnswer / latestRoundData; the admin chain belongs to Chainlink, not the consuming protocol.
```

```diff
+   Status: CREATED
    contract CorePrimeHub (eth:0x943827DCA022D0F354a8a8c332dA1e5Eb9f9F931)
    +++ description: Aave V4 Hub. Cross-chain accounting hub: per-asset config (interest rate strategy, treasury, premium) and the registry of spokes that hold each asset across all chains. Trust assumption: governance role members in the AccessManager (authority) can change every per-asset parameter and the spoke whitelist; the HubProxyAdmin can swap the implementation.
```

```diff
+   Status: CREATED
    contract MainSpoke (eth:0x94e7A5dCbE816e498b89aB752661904E2F56c485)
    +++ description: Aave V4 Spoke. Holds the per-asset reserves on this chain and routes liquidity through the Hub. Trust assumption: if you trust this contract you trust the Aave V4 governance role members in the AccessManager (authority) to upgrade it via the SpokeProxyAdmin and to reconfigure its reserve list, and you trust the AaveOracle to price each reserve correctly.
```

```diff
+   Status: CREATED
    contract MainSpokeV2 (eth:0x973a023A77420ba610f06b3858aD991Df6d85A08)
    +++ description: Aave V4 Spoke. Holds the per-asset reserves on this chain and routes liquidity through the Hub. Trust assumption: if you trust this contract you trust the Aave V4 governance role members in the AccessManager (authority) to upgrade it via the SpokeProxyAdmin and to reconfigure its reserve list, and you trust the AaveOracle to price each reserve correctly.
```

```diff
+   Status: CREATED
    contract MainSpokeOracle (eth:0x99B2B6CEa9C3D2fd8F4d90f86741C44B212a6127)
    +++ description: Per-reserve price oracle for an Aave V4 spoke. Maps each reserveId on the paired spoke to a price source contract (a Chainlink feed wrapped in a price-cap adapter, or a fixed-price adapter for stables). The Spoke depends on it for every borrow, withdraw, and liquidation calculation.
```

```diff
+   Status: CREATED
    contract EACAggregatorProxy (eth:0x9B4a96210bc8D9D55b1908B465D8B0de68B7fF83)
    +++ description: Chainlink price feed proxy. Wraps an underlying aggregator and forwards latestAnswer / latestRoundData; the admin chain belongs to Chainlink, not the consuming protocol.
```

```diff
+   Status: CREATED
    contract EthenaIsolatedOracle (eth:0x9b91a0943CADf554742E8Fb358B1cC4ae4F85F01)
    +++ description: Per-reserve price oracle for an Aave V4 spoke. Maps each reserveId on the paired spoke to a price source contract (a Chainlink feed wrapped in a price-cap adapter, or a fixed-price adapter for stables). The Spoke depends on it for every borrow, withdraw, and liquidation calculation.
```

```diff
+   Status: CREATED
    contract SpokeConfigurator (eth:0x9BFFf48BFb5A7AE70c348d4d4cb97E8DEFa5389a)
    +++ description: Aave V4 SpokeConfigurator. Privileged interface (gated through the AccessManager) for configuring per-reserve parameters on a Spoke: collateral flags, borrow flags, freeze, pause, and reserve listing/delisting.
```

```diff
+   Status: CREATED
    contract ProxyAdmin (eth:0xA0a8d221F6592780F00dF65eE9ABc2489395C29f)
    +++ description: None
```

```diff
+   Status: CREATED
    contract PendlePriceAdapterB (eth:0xa0dc0249c32fa79e8B9b17c735908a60b1141B40)
    +++ description: Aave-deployed price oracle adapter that wraps a Chainlink feed (BASE_TO_USD_AGGREGATOR) with a growth-rate cap and an optional ratio provider (RATIO_PROVIDER) for liquid-staked or correlated assets. The cap bounds how fast the wrapped price can grow; the ACL_MANAGER is the only contract that can re-snapshot or re-arm the cap. The ratio provider is the underlying staked-asset contract; the trust analysis treats it as a foreign asset, not as something to walk.
```

```diff
+   Status: CREATED
    contract CappedEURCPriceAdapter (eth:0xa6aB031A4d189B24628EC9Eb155F0a0f1A0E55a3)
    +++ description: Aave-deployed price oracle adapter that wraps a Chainlink feed (BASE_TO_USD_AGGREGATOR) with a growth-rate cap and an optional ratio provider (RATIO_PROVIDER) for liquid-staked or correlated assets. The cap bounds how fast the wrapped price can grow; the ACL_MANAGER is the only contract that can re-snapshot or re-arm the cap. The ratio provider is the underlying staked-asset contract; the trust analysis treats it as a foreign asset, not as something to walk.
```

```diff
+   Status: CREATED
    contract MainInterestRateStrategy (eth:0xAD88791B0F81D1FA242f637eB05bee0cbc53fe2f)
    +++ description: Per-asset interest rate model used by the Aave V4 Hub. Stores the kink + growth-rate parameters per assetId; the assetId space is owned by HUB.getAssetCount. Trust assumption: anyone who can change these parameters can squeeze borrowers or starve depositors.
```

```diff
+   Status: CREATED
    contract StablesOracle (eth:0xB3CE6E7b6d389a66eA4a3777bA07219d00FB3a9D)
    +++ description: Per-reserve price oracle for an Aave V4 spoke. Maps each reserveId on the paired spoke to a price source contract (a Chainlink feed wrapped in a price-cap adapter, or a fixed-price adapter for stables). The Spoke depends on it for every borrow, withdraw, and liquidation calculation.
```

```diff
+   Status: CREATED
    contract EACAggregatorProxy (eth:0xb49f677943BC038e9857d61E7d053CaA2C1734C1)
    +++ description: Chainlink price feed proxy. Wraps an underlying aggregator and forwards latestAnswer / latestRoundData; the admin chain belongs to Chainlink, not the consuming protocol.
```

```diff
+   Status: CREATED
    contract Treasury (eth:0xB9B0b8616f6Bf6841972a52058132BE08d723155)
    +++ description: Aave V4 Treasury (a TreasurySpoke instance). Receives the per-asset accrued fees defined in HubInstance.getAssetConfig.feeReceiver. Owned by an Aave-controlled GnosisSafe; upgradeable via the TreasuryProxyAdmin.
```

```diff
+   Status: CREATED
    contract EthenaPlusStablesSpoke (eth:0xba1B3D55D249692b669A164024A838309B7508AF)
    +++ description: Aave V4 Spoke. Holds the per-asset reserves on this chain and routes liquidity through the Hub. Trust assumption: if you trust this contract you trust the Aave V4 governance role members in the AccessManager (authority) to upgrade it via the SpokeProxyAdmin and to reconfigure its reserve list, and you trust the AaveOracle to price each reserve correctly.
```

```diff
+   Status: CREATED
    contract ProxyAdmin (eth:0xbceB5eBf77DcBBE1d2081d6BF591F04154BBa494)
    +++ description: None
```

```diff
+   Status: CREATED
    contract WeETHCorrelatedSpoke (eth:0xbF10BDfE177dE0336aFD7fcCF80A904E15386219)
    +++ description: Aave V4 Spoke. Holds the per-asset reserves on this chain and routes liquidity through the Hub. Trust assumption: if you trust this contract you trust the Aave V4 governance role members in the AccessManager (authority) to upgrade it via the SpokeProxyAdmin and to reconfigure its reserve list, and you trust the AaveOracle to price each reserve correctly.
```

```diff
+   Status: CREATED
    contract CappedUSDePriceAdapter (eth:0xC26D4a1c46d884cfF6dE9800B6aE7A8Cf48B4Ff8)
    +++ description: Aave-deployed price oracle adapter that wraps a Chainlink feed (BASE_TO_USD_AGGREGATOR) with a growth-rate cap and an optional ratio provider (RATIO_PROVIDER) for liquid-staked or correlated assets. The cap bounds how fast the wrapped price can grow; the ACL_MANAGER is the only contract that can re-snapshot or re-arm the cap. The ratio provider is the underlying staked-asset contract; the trust analysis treats it as a foreign asset, not as something to walk.
```

```diff
+   Status: CREATED
    contract MainACLManager (eth:0xc2aaCf6553D20d1e9d78E365AAba8032af9c85b0)
    +++ description: Aave V4 ACLManager (legacy bytes32 role variant). Tracks roles like RISK_ADMIN, EMERGENCY_ADMIN, BRIDGE, etc. for the price-cap adapters and other contracts that consult it via ACL_MANAGER. Distinct from the OZ V5 AccessManager that gates Hub/Spoke functions.
```

```diff
+   Status: CREATED
    contract EthenaPlusStablesOracle (eth:0xc390dbe9fc00D6db73C52d375642b47008C33c90)
    +++ description: Per-reserve price oracle for an Aave V4 spoke. Maps each reserveId on the paired spoke to a price source contract (a Chainlink feed wrapped in a price-cap adapter, or a fixed-price adapter for stables). The Spoke depends on it for every borrow, withdraw, and liquidation calculation.
```

```diff
+   Status: CREATED
    contract MainHub (eth:0xCca852Bc40e560adC3b1Cc58CA5b55638ce826c9)
    +++ description: Aave V4 Hub. Cross-chain accounting hub: per-asset config (interest rate strategy, treasury, premium) and the registry of spokes that hold each asset across all chains. Trust assumption: governance role members in the AccessManager (authority) can change every per-asset parameter and the spoke whitelist; the HubProxyAdmin can swap the implementation.
```

```diff
+   Status: CREATED
    contract PoolAddressesProvider (eth:0xcfBf336fe147D643B9Cb705648500e101504B16d)
    +++ description: Aave V3 addresses provider (registry). Reached from Aave V4 because some V4 reserves are GHO-related contracts that route through the V3 GHO module. Cut walks into V3 internals; the V3 stack belongs to its own discovery.
```

```diff
+   Status: CREATED
    contract GhoPriceOracle (eth:0xD110cac5d8682A3b045D5524a9903E031d70FCCd)
    +++ description: Aave-deployed price oracle adapter that wraps a Chainlink feed (BASE_TO_USD_AGGREGATOR) with a growth-rate cap and an optional ratio provider (RATIO_PROVIDER) for liquid-staked or correlated assets. The cap bounds how fast the wrapped price can grow; the ACL_MANAGER is the only contract that can re-snapshot or re-arm the cap. The ratio provider is the underlying staked-asset contract; the trust analysis treats it as a foreign asset, not as something to walk.
```

```diff
+   Status: CREATED
    contract ProxyAdmin (eth:0xD56EF224603F64b5d9530b49cA690ED76C3d3cF1)
    +++ description: None
```

```diff
+   Status: CREATED
    contract WeETHCorrelatedOracle (eth:0xd8B153FaAA8f2b1bC774916FEd333A4F3dE48792)
    +++ description: Per-reserve price oracle for an Aave V4 spoke. Maps each reserveId on the paired spoke to a price source contract (a Chainlink feed wrapped in a price-cap adapter, or a fixed-price adapter for stables). The Spoke depends on it for every borrow, withdraw, and liquidation calculation.
```

```diff
+   Status: CREATED
    contract StablesSpoke (eth:0xD8B93635b8C6d0fF98CbE90b5988E3F2d1Cd9da1)
    +++ description: Aave V4 Spoke. Holds the per-asset reserves on this chain and routes liquidity through the Hub. Trust assumption: if you trust this contract you trust the Aave V4 governance role members in the AccessManager (authority) to upgrade it via the SpokeProxyAdmin and to reconfigure its reserve list, and you trust the AaveOracle to price each reserve correctly.
```

```diff
+   Status: CREATED
    contract MainSpokeV2Oracle (eth:0xdA1266a7b8620819dAE3F8bd6B546Da36e505bB8)
    +++ description: Per-reserve price oracle for an Aave V4 spoke. Maps each reserveId on the paired spoke to a price source contract (a Chainlink feed wrapped in a price-cap adapter, or a fixed-price adapter for stables). The Spoke depends on it for every borrow, withdraw, and liquidation calculation.
```

```diff
+   Status: CREATED
    contract CorePrimeInterestRateStrategy (eth:0xDCd924047a4bDBFef9CCDDe845E5D45373Ad276D)
    +++ description: Per-asset interest rate model used by the Aave V4 Hub. Stores the kink + growth-rate parameters per assetId; the assetId space is owned by HUB.getAssetCount. Trust assumption: anyone who can change these parameters can squeeze borrowers or starve depositors.
```

```diff
+   Status: CREATED
    contract ProxyAdmin (eth:0xDdC6B7F9e0E1A17a2140Ed4d1bA75E68a2D45B43)
    +++ description: None
```

```diff
+   Status: CREATED
    contract WstETHCorrelatedSpoke (eth:0xe1900480ac69f0B296841Cd01cC37546d92F35Cd)
    +++ description: Aave V4 Spoke. Holds the per-asset reserves on this chain and routes liquidity through the Hub. Trust assumption: if you trust this contract you trust the Aave V4 governance role members in the AccessManager (authority) to upgrade it via the SpokeProxyAdmin and to reconfigure its reserve list, and you trust the AaveOracle to price each reserve correctly.
```

```diff
+   Status: CREATED
    contract CappedRLUSDPriceAdapter (eth:0xf0eaC18E908B34770FDEe46d069c846bDa866759)
    +++ description: Aave-deployed price oracle adapter that wraps a Chainlink feed (BASE_TO_USD_AGGREGATOR) with a growth-rate cap and an optional ratio provider (RATIO_PROVIDER) for liquid-staked or correlated assets. The cap bounds how fast the wrapped price can grow; the ACL_MANAGER is the only contract that can re-snapshot or re-arm the cap. The ratio provider is the underlying staked-asset contract; the trust analysis treats it as a foreign asset, not as something to walk.
```

```diff
+   Status: CREATED
    contract CappedWeETHPriceAdapter (eth:0xf112aF6F0A332B815fbEf3Ff932c057E570b62d3)
    +++ description: Aave-deployed price oracle adapter that wraps a Chainlink feed (BASE_TO_USD_AGGREGATOR) with a growth-rate cap and an optional ratio provider (RATIO_PROVIDER) for liquid-staked or correlated assets. The cap bounds how fast the wrapped price can grow; the ACL_MANAGER is the only contract that can re-snapshot or re-arm the cap. The ratio provider is the underlying staked-asset contract; the trust analysis treats it as a foreign asset, not as something to walk.
```

```diff
+   Status: CREATED
    contract FixedUSDGPriceAdapter (eth:0xF29b1e3b68Fd59DD0a413811fD5d0AbaE653216d)
    +++ description: Aave-deployed price oracle adapter that wraps a Chainlink feed (BASE_TO_USD_AGGREGATOR) with a growth-rate cap and an optional ratio provider (RATIO_PROVIDER) for liquid-staked or correlated assets. The cap bounds how fast the wrapped price can grow; the ACL_MANAGER is the only contract that can re-snapshot or re-arm the cap. The ratio provider is the underlying staked-asset contract; the trust analysis treats it as a foreign asset, not as something to walk.
```

```diff
+   Status: CREATED
    contract EACAggregatorProxy (eth:0xF4030086522a5bEEa4988F8cA5B36dbC97BeE88c)
    +++ description: Chainlink price feed proxy. Wraps an underlying aggregator and forwards latestAnswer / latestRoundData; the admin chain belongs to Chainlink, not the consuming protocol.
```

```diff
+   Status: CREATED
    contract MainSpokeProxyAdmin (eth:0xfFeAcCAd70f4393701272212dACD791c01957f7f)
    +++ description: None
```
