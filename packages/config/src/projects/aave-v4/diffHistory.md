Generated with discovered.json: 0x773be8aca32ec6e3ae5057649669ac9db222efeb

# Diff at Mon, 20 Apr 2026 05:26:22 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- current timestamp: 1775724196

## Description

Discovery rerun on the same block number with only config-related changes.

## Initial discovery

```diff
+   Status: CREATED
    contract GoldSpokeOracle (eth:0x0083421fd178749af2201ddA5A7C3feB5790B80c)
    +++ description: Per-reserve price oracle for an Aave V4 spoke. Maps each reserveId on the paired spoke to a price source contract (a Chainlink feed wrapped in a price-cap adapter, or a fixed-price adapter for stables). The Spoke depends on it for every borrow, withdraw, and liquidation calculation.
```

```diff
+   Status: CREATED
    contract PrimeACLManager (eth:0x013E2C7567b6231e865BB9273F8c7656103611c0)
    +++ description: Legacy Aave V3 access control contract (OpenZeppelin AccessControl with bytes32 roles). This is the SECOND trust path in Aave V4, independent of the OZ V5 AccessManager. RISK_ADMIN and POOL_ADMIN role holders can change PriceCapAdapter discount rates (setDiscountRatePerYear), which directly affects wrapped-asset price caps and liquidation thresholds. DEFAULT_ADMIN_ROLE can grant and revoke every other role. Users must trust both access control systems independently.
```

```diff
+   Status: CREATED
    contract EACAggregatorProxy (eth:0x04F84020Fdf10d9ee64D1dcC2986EDF2F556DA11)
    +++ description: Chainlink price feed proxy. Wraps an underlying aggregator and forwards latestAnswer / latestRoundData; the admin chain belongs to Chainlink, not the consuming protocol.
```

```diff
+   Status: CREATED
    contract PlusHub (eth:0x06002e9c4412CB7814a791eA3666D905871E536A)
    +++ description: Aave V4 Hub. Cross-chain accounting hub: per-asset config (interest rate strategy, treasury, premium) and the registry of spokes that hold each asset across all chains. Trust assumption: governance (via HubConfigurator) can change feeReceiver (redirecting revenue), irStrategy (swapping the interest rate model), reinvestmentController (who can sweep idle liquidity), and liquidityFee (fee percentage) per asset. The Hub also gates spoke-to-hub calls (add/remove/draw/restore) via data-level checks: the calling spoke must be registered, active, and not halted.
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
    contract AaveV4AdminMultisig (eth:0x187AAE17d4931310B3fc75743e7F16Bdc9eD77e9)
    +++ description: None
```

```diff
+   Status: CREATED
    contract LombardBTCSpokeOracle (eth:0x198Cac7f54FFc7d709Ac0FEc4B6454CE73e21D3D)
    +++ description: Per-reserve price oracle for an Aave V4 spoke. Maps each reserveId on the paired spoke to a price source contract (a Chainlink feed wrapped in a price-cap adapter, or a fixed-price adapter for stables). The Spoke depends on it for every borrow, withdraw, and liquidation calculation.
```

```diff
+   Status: CREATED
    contract MainDiscountRateAgent (eth:0x1B3bD355c43d2247946b8e0889d4b4e701bf430d)
    +++ description: Aave V3 automation agent (AaveDiscountRateAgent). Holds RISK_ADMIN on the ACLManager to perform automated discount rate adjustments. The agent's admin is the Aave Governance V3 Executor via the AgentHub.
```

```diff
+   Status: CREATED
    contract ProxyAdmin (eth:0x1De446C91cF141c76f6eeF2331128ED7A4536846)
    +++ description: None
```

```diff
+   Status: CREATED
    contract HubConfigurator (eth:0x1F0753480bB03EaA00863224602267B7E0525C3d)
    +++ description: Privileged admin interface for the Hub, gated through the AccessManager's restricted modifier. Every function on this contract is a trust-critical operation: listing/delisting assets, swapping interest rate strategies, redirecting fee receivers, adding/removing spokes, and setting position caps. The HubConfigurator is the primary path through which governance changes Hub-side parameters.
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
    contract RsETHGhoDirectMinter (eth:0x2cE01c87Fec1b71A9041c52CaED46Fc5f4807285)
    +++ description: Aave V3 GhoDirectMinter. Contract that can mint/burn GHO tokens via an Aave V3 Pool facilitator. Holds RISK_ADMIN on the ACLManager. The guardian can pause minting. Owned by Aave Governance (Executor).
```

```diff
+   Status: CREATED
    contract ProtocolEmergencyGuardian (eth:0x2CFe3ec4d5a6811f4B8067F0DE7e47DfA938Aa30)
    +++ description: None
```

```diff
+   Status: CREATED
    contract PoolAddressesProvider (eth:0x2f39d218133AFaB8F2B819B1066c7E434Ad94E9e)
    +++ description: Aave V3 addresses provider (registry). Reached from Aave V4 because some V4 reserves are GHO-related contracts that route through the V3 GHO module. Cut walks into V3 internals; the V3 stack belongs to its own discovery.
```

```diff
+   Status: CREATED
    contract PlusHubIRStrategy (eth:0x31280650661b8443723fa9739b3A164E3696af48)
    +++ description: Per-asset interest rate model used by the Aave V4 Hub. Stores the kink + growth-rate parameters per assetId; the assetId space is owned by HUB.getAssetCount. Trust assumption: anyone who can change these parameters can squeeze borrowers or starve depositors.
```

```diff
+   Status: CREATED
    contract KelpeSpoke (eth:0x3131FE68C4722e726fe6B2819ED68e514395B9a4)
    +++ description: Aave V4 Spoke. The user-facing lending contract that holds per-asset reserves and routes liquidity through the Hub. Trust assumption: you trust the AccessManager role holders not to swap the oracle feed (updateReservePriceSource), not to activate a malicious position manager (updatePositionManager), not to freeze your reserves (updateReserveConfig), and not to push a malicious code upgrade via the proxy admin. All admin functions carry the restricted modifier, user functions require onlyPositionManager, and liquidationCall is permissionless by design.
```

```diff
+   Status: CREATED
    contract KelpeSpokeOracle (eth:0x37C316996C714Bf906743071e04E62220b3271ac)
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
    contract RiskCouncilMultisig (eth:0x47c71dFEB55Ebaa431Ae3fbF99Ea50e0D3d30fA8)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CappedRsETHPriceAdapter (eth:0x47F52B2e43D0386cF161e001835b03Ad49889e3b)
    +++ description: Aave-deployed price oracle adapter that wraps a Chainlink feed (BASE_TO_USD_AGGREGATOR) with a growth-rate cap and an optional ratio provider (RATIO_PROVIDER) for liquid-staked or correlated assets. The cap bounds how fast the wrapped price can grow; the ACL_MANAGER is the only contract that can re-snapshot or re-arm the cap. The ratio provider is the underlying staked-asset contract; the trust analysis treats it as a foreign asset, not as something to walk.
```

```diff
+   Status: CREATED
    contract MainEModeAgent (eth:0x4F2858d4A4e4464b34Aa4a22C41B2Ef540a59BF4)
    +++ description: Aave V3 automation agent (AaveDiscountRateAgent). Holds RISK_ADMIN on the ACLManager to perform automated discount rate adjustments. The agent's admin is the Aave Governance V3 Executor via the AgentHub.
```

```diff
+   Status: CREATED
    contract RsETHCapoAgent (eth:0x52E652182b22C41d0202bB8D834982F43B12Cd21)
    +++ description: Aave V3 automation agent (AaveDiscountRateAgent). Holds RISK_ADMIN on the ACLManager to perform automated discount rate adjustments. The agent's admin is the Aave Governance V3 Executor via the AgentHub.
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
    contract MainGhoDirectMinter (eth:0x5513224daaEABCa31af5280727878d52097afA05)
    +++ description: Aave V3 GhoDirectMinter. Contract that can mint/burn GHO tokens via an Aave V3 Pool facilitator. Holds RISK_ADMIN on the ACLManager. The guardian can pause minting. Owned by Aave Governance (Executor).
```

```diff
+   Status: CREATED
    contract CoreHubProxyAdmin (eth:0x55b71C0aeD3c616162eE7c608c089A1055CEA3Bf)
    +++ description: None
```

```diff
+   Status: CREATED
    contract EthenaCorrelatedSpoke (eth:0x58131E79531caB1d52301228d1f7b842F26B9649)
    +++ description: Aave V4 Spoke. The user-facing lending contract that holds per-asset reserves and routes liquidity through the Hub. Trust assumption: you trust the AccessManager role holders not to swap the oracle feed (updateReservePriceSource), not to activate a malicious position manager (updatePositionManager), not to freeze your reserves (updateReserveConfig), and not to push a malicious code upgrade via the proxy admin. All admin functions carry the restricted modifier, user functions require onlyPositionManager, and liquidationCall is permissionless by design.
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
    contract RsETHGhoAaveSteward (eth:0x5C905d62B22e4DAa4967E517C4a047Ff6026C731)
    +++ description: Aave V3 GhoAaveSteward. Automation contract that holds RISK_ADMIN to adjust GHO-specific parameters within hardcoded bounds: max 5% rate parameter change per update, 1-day cooldown. The RISK_COUNCIL address can trigger these changes without a governance proposal. Owned by Aave Governance (Executor).
```

```diff
+   Status: CREATED
    contract EACAggregatorProxy (eth:0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419)
    +++ description: Chainlink price feed proxy. Wraps an underlying aggregator and forwards latestAnswer / latestRoundData; the admin chain belongs to Chainlink, not the consuming protocol.
```

```diff
+   Status: CREATED
    contract GoldSpoke (eth:0x65407b940966954b23dfA3caA5C0702bB42984DC)
    +++ description: Aave V4 Spoke. The user-facing lending contract that holds per-asset reserves and routes liquidity through the Hub. Trust assumption: you trust the AccessManager role holders not to swap the oracle feed (updateReservePriceSource), not to activate a malicious position manager (updatePositionManager), not to freeze your reserves (updateReserveConfig), and not to push a malicious code upgrade via the proxy admin. All admin functions carry the restricted modifier, user functions require onlyPositionManager, and liquidationCall is permissionless by design.
```

```diff
+   Status: CREATED
    contract LidoeSpokeOracle (eth:0x664D73b6C3591333Fd79510f7ce9ef81228824F5)
    +++ description: Per-reserve price oracle for an Aave V4 spoke. Maps each reserveId on the paired spoke to a price source contract (a Chainlink feed wrapped in a price-cap adapter, or a fixed-price adapter for stables). The Spoke depends on it for every borrow, withdraw, and liquidation calculation.
```

```diff
+   Status: CREATED
    contract RsETHRiskSteward (eth:0x7e6a6B115D31d4A837E3C737c49Cf6Fafe6112C3)
    +++ description: Aave V3 RiskSteward. Automation contract that holds RISK_ADMIN to adjust risk parameters within hardcoded bounds (3-day cooldown per parameter). The RISK_COUNCIL address can trigger these changes without a governance proposal. Owned by Aave Governance (Executor).
```

```diff
+   Status: CREATED
    contract LombardBTCSpoke (eth:0x7EC68b5695e803e98a21a9A05d744F28b0a7753D)
    +++ description: Aave V4 Spoke. The user-facing lending contract that holds per-asset reserves and routes liquidity through the Hub. Trust assumption: you trust the AccessManager role holders not to swap the oracle feed (updateReservePriceSource), not to activate a malicious position manager (updatePositionManager), not to freeze your reserves (updateReserveConfig), and not to push a malicious code upgrade via the proxy admin. All admin functions carry the restricted modifier, user functions require onlyPositionManager, and liquidationCall is permissionless by design.
```

```diff
+   Status: CREATED
    contract GhoRiskCouncilMultisig (eth:0x8513e6F37dBc52De87b166980Fa3F50639694B60)
    +++ description: None
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
    +++ description: Delegatecall library shared by every Spoke to execute liquidations. Immutable (set at Spoke construction time, cannot be changed at runtime). The liquidationCall entry point is permissionless by design: anyone can liquidate undercollateralized positions. The liquidator transfers their own tokens to repay part of the debt and receives the borrower's collateral at a discount determined by the Spoke's liquidation config.
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
    contract PrimeHub (eth:0x943827DCA022D0F354a8a8c332dA1e5Eb9f9F931)
    +++ description: Aave V4 Hub. Cross-chain accounting hub: per-asset config (interest rate strategy, treasury, premium) and the registry of spokes that hold each asset across all chains. Trust assumption: governance (via HubConfigurator) can change feeReceiver (redirecting revenue), irStrategy (swapping the interest rate model), reinvestmentController (who can sweep idle liquidity), and liquidityFee (fee percentage) per asset. The Hub also gates spoke-to-hub calls (add/remove/draw/restore) via data-level checks: the calling spoke must be registered, active, and not halted.
```

```diff
+   Status: CREATED
    contract MainSpoke (eth:0x94e7A5dCbE816e498b89aB752661904E2F56c485)
    +++ description: Aave V4 Spoke. The user-facing lending contract that holds per-asset reserves and routes liquidity through the Hub. Trust assumption: you trust the AccessManager role holders not to swap the oracle feed (updateReservePriceSource), not to activate a malicious position manager (updatePositionManager), not to freeze your reserves (updateReserveConfig), and not to push a malicious code upgrade via the proxy admin. All admin functions carry the restricted modifier, user functions require onlyPositionManager, and liquidationCall is permissionless by design.
```

```diff
+   Status: CREATED
    contract BluechipSpoke (eth:0x973a023A77420ba610f06b3858aD991Df6d85A08)
    +++ description: Aave V4 Spoke. The user-facing lending contract that holds per-asset reserves and routes liquidity through the Hub. Trust assumption: you trust the AccessManager role holders not to swap the oracle feed (updateReservePriceSource), not to activate a malicious position manager (updatePositionManager), not to freeze your reserves (updateReserveConfig), and not to push a malicious code upgrade via the proxy admin. All admin functions carry the restricted modifier, user functions require onlyPositionManager, and liquidationCall is permissionless by design.
```

```diff
+   Status: CREATED
    contract MainGhoAaveSteward (eth:0x98217A06721Ebf727f2C8d9aD7718ec28b7aAe34)
    +++ description: Aave V3 GhoAaveSteward. Automation contract that holds RISK_ADMIN to adjust GHO-specific parameters within hardcoded bounds: max 5% rate parameter change per update, 1-day cooldown. The RISK_COUNCIL address can trigger these changes without a governance proposal. Owned by Aave Governance (Executor).
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
    contract EthenaCorrelatedSpokeOracle (eth:0x9b91a0943CADf554742E8Fb358B1cC4ae4F85F01)
    +++ description: Per-reserve price oracle for an Aave V4 spoke. Maps each reserveId on the paired spoke to a price source contract (a Chainlink feed wrapped in a price-cap adapter, or a fixed-price adapter for stables). The Spoke depends on it for every borrow, withdraw, and liquidation calculation.
```

```diff
+   Status: CREATED
    contract SpokeConfigurator (eth:0x9BFFf48BFb5A7AE70c348d4d4cb97E8DEFa5389a)
    +++ description: Privileged admin interface for Spokes, gated through the AccessManager's restricted modifier. Controls the most security-sensitive Spoke operations: oracle price source replacement (updateReservePriceSource), position manager activation (updatePositionManager), per-reserve pause/freeze flags, collateral risk weights, liquidation parameters, and reserve listing/delisting. All functions carry the restricted modifier.
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
    contract CoreHubIRStrategy (eth:0xAD88791B0F81D1FA242f637eB05bee0cbc53fe2f)
    +++ description: Per-asset interest rate model used by the Aave V4 Hub. Stores the kink + growth-rate parameters per assetId; the assetId space is owned by HUB.getAssetCount. Trust assumption: anyone who can change these parameters can squeeze borrowers or starve depositors.
```

```diff
+   Status: CREATED
    contract ForexSpokeOracle (eth:0xB3CE6E7b6d389a66eA4a3777bA07219d00FB3a9D)
    +++ description: Per-reserve price oracle for an Aave V4 spoke. Maps each reserveId on the paired spoke to a price source contract (a Chainlink feed wrapped in a price-cap adapter, or a fixed-price adapter for stables). The Spoke depends on it for every borrow, withdraw, and liquidation calculation.
```

```diff
+   Status: CREATED
    contract EACAggregatorProxy (eth:0xb49f677943BC038e9857d61E7d053CaA2C1734C1)
    +++ description: Chainlink price feed proxy. Wraps an underlying aggregator and forwards latestAnswer / latestRoundData; the admin chain belongs to Chainlink, not the consuming protocol.
```

```diff
+   Status: CREATED
    contract TreasurySpoke (eth:0xB9B0b8616f6Bf6841972a52058132BE08d723155)
    +++ description: Receives the per-asset accrued protocol fees (configured in Hub.getAssetConfig.feeReceiver). Uses Ownable2Step (NOT the AccessManager), meaning the owner (a GnosisSafe multisig) has unconstrained authority. The transfer(token, to, amount) and withdraw(hub, assetId, amount, to) functions can move any token the Treasury holds to any address with no timelock. Ownership transfer requires acceptance by the new owner (2-step).
```

```diff
+   Status: CREATED
    contract EthenaEcosystemSpoke (eth:0xba1B3D55D249692b669A164024A838309B7508AF)
    +++ description: Aave V4 Spoke. The user-facing lending contract that holds per-asset reserves and routes liquidity through the Hub. Trust assumption: you trust the AccessManager role holders not to swap the oracle feed (updateReservePriceSource), not to activate a malicious position manager (updatePositionManager), not to freeze your reserves (updateReserveConfig), and not to push a malicious code upgrade via the proxy admin. All admin functions carry the restricted modifier, user functions require onlyPositionManager, and liquidationCall is permissionless by design.
```

```diff
+   Status: CREATED
    contract ProxyAdmin (eth:0xbceB5eBf77DcBBE1d2081d6BF591F04154BBa494)
    +++ description: None
```

```diff
+   Status: CREATED
    contract EtherFieSpoke (eth:0xbF10BDfE177dE0336aFD7fcCF80A904E15386219)
    +++ description: Aave V4 Spoke. The user-facing lending contract that holds per-asset reserves and routes liquidity through the Hub. Trust assumption: you trust the AccessManager role holders not to swap the oracle feed (updateReservePriceSource), not to activate a malicious position manager (updatePositionManager), not to freeze your reserves (updateReserveConfig), and not to push a malicious code upgrade via the proxy admin. All admin functions carry the restricted modifier, user functions require onlyPositionManager, and liquidationCall is permissionless by design.
```

```diff
+   Status: CREATED
    contract CappedUSDePriceAdapter (eth:0xC26D4a1c46d884cfF6dE9800B6aE7A8Cf48B4Ff8)
    +++ description: Aave-deployed price oracle adapter that wraps a Chainlink feed (BASE_TO_USD_AGGREGATOR) with a growth-rate cap and an optional ratio provider (RATIO_PROVIDER) for liquid-staked or correlated assets. The cap bounds how fast the wrapped price can grow; the ACL_MANAGER is the only contract that can re-snapshot or re-arm the cap. The ratio provider is the underlying staked-asset contract; the trust analysis treats it as a foreign asset, not as something to walk.
```

```diff
+   Status: CREATED
    contract CoreACLManager (eth:0xc2aaCf6553D20d1e9d78E365AAba8032af9c85b0)
    +++ description: Legacy Aave V3 access control contract (OpenZeppelin AccessControl with bytes32 roles). This is the SECOND trust path in Aave V4, independent of the OZ V5 AccessManager. RISK_ADMIN and POOL_ADMIN role holders can change PriceCapAdapter discount rates (setDiscountRatePerYear), which directly affects wrapped-asset price caps and liquidation thresholds. DEFAULT_ADMIN_ROLE can grant and revoke every other role. Users must trust both access control systems independently.
```

```diff
+   Status: CREATED
    contract EthenaEcosystemSpokeOracle (eth:0xc390dbe9fc00D6db73C52d375642b47008C33c90)
    +++ description: Per-reserve price oracle for an Aave V4 spoke. Maps each reserveId on the paired spoke to a price source contract (a Chainlink feed wrapped in a price-cap adapter, or a fixed-price adapter for stables). The Spoke depends on it for every borrow, withdraw, and liquidation calculation.
```

```diff
+   Status: CREATED
    contract CapoAgent (eth:0xCc18Be380838956aad41FD22466085eD66aaBB46)
    +++ description: Aave V3 automation agent (AaveDiscountRateAgent). Holds RISK_ADMIN on the ACLManager to perform automated discount rate adjustments. The agent's admin is the Aave Governance V3 Executor via the AgentHub.
```

```diff
+   Status: CREATED
    contract CoreHub (eth:0xCca852Bc40e560adC3b1Cc58CA5b55638ce826c9)
    +++ description: Aave V4 Hub. Cross-chain accounting hub: per-asset config (interest rate strategy, treasury, premium) and the registry of spokes that hold each asset across all chains. Trust assumption: governance (via HubConfigurator) can change feeReceiver (redirecting revenue), irStrategy (swapping the interest rate model), reinvestmentController (who can sweep idle liquidity), and liquidityFee (fee percentage) per asset. The Hub also gates spoke-to-hub calls (add/remove/draw/restore) via data-level checks: the calling spoke must be registered, active, and not halted.
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
    contract EtherFieSpokeOracle (eth:0xd8B153FaAA8f2b1bC774916FEd333A4F3dE48792)
    +++ description: Per-reserve price oracle for an Aave V4 spoke. Maps each reserveId on the paired spoke to a price source contract (a Chainlink feed wrapped in a price-cap adapter, or a fixed-price adapter for stables). The Spoke depends on it for every borrow, withdraw, and liquidation calculation.
```

```diff
+   Status: CREATED
    contract ForexSpoke (eth:0xD8B93635b8C6d0fF98CbE90b5988E3F2d1Cd9da1)
    +++ description: Aave V4 Spoke. The user-facing lending contract that holds per-asset reserves and routes liquidity through the Hub. Trust assumption: you trust the AccessManager role holders not to swap the oracle feed (updateReservePriceSource), not to activate a malicious position manager (updatePositionManager), not to freeze your reserves (updateReserveConfig), and not to push a malicious code upgrade via the proxy admin. All admin functions carry the restricted modifier, user functions require onlyPositionManager, and liquidationCall is permissionless by design.
```

```diff
+   Status: CREATED
    contract BluechipSpokeOracle (eth:0xdA1266a7b8620819dAE3F8bd6B546Da36e505bB8)
    +++ description: Per-reserve price oracle for an Aave V4 spoke. Maps each reserveId on the paired spoke to a price source contract (a Chainlink feed wrapped in a price-cap adapter, or a fixed-price adapter for stables). The Spoke depends on it for every borrow, withdraw, and liquidation calculation.
```

```diff
+   Status: CREATED
    contract MainRatesAgent (eth:0xdA626E64f34f24e0236E0C9cD2F11ce4549a08c6)
    +++ description: Aave V3 automation agent (AaveDiscountRateAgent). Holds RISK_ADMIN on the ACLManager to perform automated discount rate adjustments. The agent's admin is the Aave Governance V3 Executor via the AgentHub.
```

```diff
+   Status: CREATED
    contract PrimeHubIRStrategy (eth:0xDCd924047a4bDBFef9CCDDe845E5D45373Ad276D)
    +++ description: Per-asset interest rate model used by the Aave V4 Hub. Stores the kink + growth-rate parameters per assetId; the assetId space is owned by HUB.getAssetCount. Trust assumption: anyone who can change these parameters can squeeze borrowers or starve depositors.
```

```diff
+   Status: CREATED
    contract ProxyAdmin (eth:0xDdC6B7F9e0E1A17a2140Ed4d1bA75E68a2D45B43)
    +++ description: None
```

```diff
+   Status: CREATED
    contract LidoeSpoke (eth:0xe1900480ac69f0B296841Cd01cC37546d92F35Cd)
    +++ description: Aave V4 Spoke. The user-facing lending contract that holds per-asset reserves and routes liquidity through the Hub. Trust assumption: you trust the AccessManager role holders not to swap the oracle feed (updateReservePriceSource), not to activate a malicious position manager (updatePositionManager), not to freeze your reserves (updateReserveConfig), and not to push a malicious code upgrade via the proxy admin. All admin functions carry the restricted modifier, user functions require onlyPositionManager, and liquidationCall is permissionless by design.
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
    contract MainRiskSteward (eth:0xFCE597866Ffaf617EFdcA1C1Ad50eBCB16B5171E)
    +++ description: Aave V3 RiskSteward. Automation contract that holds RISK_ADMIN to adjust risk parameters within hardcoded bounds (3-day cooldown per parameter). The RISK_COUNCIL address can trigger these changes without a governance proposal. Owned by Aave Governance (Executor).
```

```diff
+   Status: CREATED
    contract MainSpokeProxyAdmin (eth:0xfFeAcCAd70f4393701272212dACD791c01957f7f)
    +++ description: None
```
