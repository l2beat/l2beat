# Aave V4 Static Analysis Report

Static analysis of 12 core Aave V4 contracts using Slither 0.11.5, Aderyn 0.1.9, Wake 4.22.1, and Semgrep 1.159.0 with custom L2BEAT trust rules (solc 0.8.28). This report focuses exclusively on counterparty risk and trust assumptions: who can do what with user funds, and what access controls gate each privileged action. Implementation bugs (reentrancy, arithmetic, etc.) are out of scope.

## Methodology

### Slither

For each contract, three Slither passes were run:

1. `--print modifiers`: maps every function to its access control modifier
2. `--print vars-and-auth`: maps every function to the state variables it writes and any `msg.sender` conditions
3. `--detect arbitrary-send-erc20,arbitrary-send-eth,suicidal,tx-origin,missing-zero-check,unprotected-upgrade,controlled-delegatecall,events-access`: trust-relevant detectors

Contracts were analyzed via Etherscan-verified source (implementation addresses for proxied contracts). Full raw output is in `/tmp/slither-analysis/results/`.

### Wake

Wake's `state-changes` printer was run on critical functions across SpokeInstance, HubConfigurator, and Treasury. Unlike Slither's `vars-and-auth` (which only names the state variable), Wake shows the exact struct-field assignments and cross-contract call boundaries. This is the precision needed to write trust statements like "governance can freeze each reserve individually" rather than the vague "governance can modify reserves".

### Semgrep (custom L2BEAT trust rules)

The off-the-shelf Decurity rules (`semgrep-smart-contracts`) target specific function names from past DeFi exploits (`setOracleData`, `sweepToken`, etc.). Zero trust-relevant rules fired on Aave V4 because it uses different naming conventions.

Instead, 10 custom L2BEAT trust rules were written to match trust-relevant patterns: `restricted` functions that control oracle sources, pause/freeze flags, position managers, fee receivers, interest rates, and caps; `onlyOwner` functions that can transfer/withdraw arbitrary tokens; functions that can swap the `authority` pointer; and permissionless liquidation functions. These rules scanned ALL contract instances (10 Spokes, 10 Oracles, 3 Hubs, both Configurators, Treasury) in a single pass, confirming cross-instance consistency. The rules are reusable across future DeFi projects.

### Aderyn

All 8 core contract codebases were analyzed with Aderyn's 63 detectors, including its `centralization-risk` detector which explicitly flags functions gated by `onlyOwner`, `onlyRole`, or `restricted` as centralization risks. This detector has no Slither equivalent.

## Trust root: the AccessManager

All Aave V4 access control flows through a single OpenZeppelin V5 `AccessManagerEnumerable` at `0x08aE3BE30958cDd1847ec58fFfd4C451a87fDF01`. The contract uses the `onlyAuthorized` modifier internally and exposes role management functions:

| Function | What it controls |
|---|---|
| `grantRole` / `revokeRole` | Adds/removes addresses from a role. Gated by the role's admin role. |
| `setRoleAdmin` / `setRoleGuardian` | Changes which role can administrate or cancel operations for another role. |
| `setGrantDelay` | Sets a time delay before a newly granted role becomes active. |
| `setTargetFunctionRole` | Wires a (target contract, function selector) pair to a required role. This is how the permission matrix is configured: "to call `addReserve` on `SpokeInstance`, the caller needs role X." |
| `setTargetClosed` | Disables all gated calls to an entire target contract (emergency kill switch). |
| `updateAuthority` | Calls `setAuthority` on a target contract, swapping which AccessManager governs it. |
| `schedule` / `execute` / `cancel` | Scheduled operation lifecycle for time-delayed actions. |

**Trust implication**: `ADMIN_ROLE` (role ID 0) holders can reconfigure the entire permission system. They can reassign which roles can call which functions, close targets, change authority pointers, and grant/revoke any role. This is the root of trust for the entire protocol. The current `ADMIN_ROLE` holder is the Aave Governance V3 Executor.

## Per-contract findings

### SpokeInstance (user-facing lending contract)

The Spoke is where users interact: supply, borrow, withdraw, repay, liquidate. Every Spoke uses two access control layers: the `restricted` modifier (OZ V5 AccessManager roles, resolved at runtime) for admin functions, and `onlyPositionManager` for user actions.

#### Privileged functions (`restricted`)

| Function | State written | Trust implication |
|---|---|---|
| `addReserve` | `_reserves`, `_reserveCount`, `_dynamicConfig`, `_hubAssetIdToReserveId` | Lists a new asset in the market. A malicious asset listing could introduce a manipulable collateral type. |
| `updateReserveConfig` | Reserve flags | Changes whether an asset is borrowable, usable as collateral, paused, or frozen. Can freeze a market, preventing withdrawals. |
| `updateReservePriceSource` | Delegates to `AaveOracle.setReserveSource` | **Critical**: replaces the price feed for any reserve. A malicious oracle feed enables unfair liquidations or prevents legitimate liquidations. |
| `updateLiquidationConfig` | `_liquidationConfig` | Changes health factor thresholds and bonus factors. Adjusting these affects when and how positions get liquidated. |
| `addDynamicReserveConfig` / `updateDynamicReserveConfig` | `_dynamicConfig` | Changes per-reserve dynamic parameters (e-mode style risk bucketing). |
| `updatePositionManager` | `_positionManager` | **Critical**: controls which contracts can call supply/withdraw/borrow/repay on behalf of users. Setting this to a malicious contract compromises all user positions in the market. |
| `updateUserRiskPremium` | `_userPositions`, `_positionStatus` | Can change a specific user's risk premium, affecting their borrowing cost. |
| `updateUserDynamicConfig` | `_userPositions`, `_positionStatus` | Can change a user's dynamic config assignment. |

#### User functions (`onlyPositionManager`)

`supply`, `withdraw`, `borrow`, `repay`, `setUsingAsCollateral`: require `msg.sender` to be an approved position manager for the `onBehalfOf` user. Users approve position managers via `setUserPositionManager` (self-gated) or `setUserPositionManagersWithSig` (EIP-712 signature).

#### Permissionless functions (no access control modifier)

| Function | Access check | Purpose |
|---|---|---|
| `liquidationCall` | `nonReentrant` only | Anyone can liquidate undercollateralized positions. By design. |
| `setUserPositionManager` | Self-gated (user approves for themselves) | Users manage their own PM approvals. |
| `setUserPositionManagersWithSig` | EIP-712 signature verification | Batch PM approval via signed messages. |

### HubInstance (cross-chain accounting hub)

The Hub coordinates per-asset accounting across all chains. Most admin functions are called through HubConfigurator (which adds the `restricted` modifier), but the Hub also exposes direct entry points for spoke-to-hub operations.

#### Privileged functions (`restricted`)

| Function | State written | Trust implication |
|---|---|---|
| `addAsset` | `_assetCount`, `_assets`, `_underlyingToAssetId`, `_spokes` | Lists a new asset with fee receiver, interest rate strategy, and spoke whitelist. |
| `updateAssetConfig` | `_assets`, `_spokes` | **Critical**: can change `feeReceiver` (redirecting protocol fees to any address), `irStrategy` (swapping the interest rate model), `reinvestmentController` (who can sweep idle liquidity), and `liquidityFee` (fee percentage). |
| `addSpoke` / `updateSpokeConfig` | `_spokes` | Registers spoke contracts and sets their add/draw caps and risk premium thresholds. |
| `setInterestRateData` | Writes to InterestRateStrategy | Changes interest rate curve parameters per asset. |
| `mintFeeShares` | `_assets`, `_spokes` | Mints shares to the fee receiver. |
| `eliminateDeficit` | `_assets`, `_spokes` | Removes shares to cover a deficit. |

#### Data-gated functions (no Solidity modifier, but runtime checks)

These functions appear "unguarded" in Slither because their access control is data-level (checking `spoke.active` and `!spoke.halted` in storage) rather than modifier-level:

| Function | Who can call | Purpose |
|---|---|---|
| `add` / `remove` | Registered, active, non-halted spokes only | Spokes add/remove liquidity to the Hub |
| `draw` / `restore` | Same | Spokes draw/restore borrowed liquidity |
| `sweep` / `reclaim` | `asset.reinvestmentController` only | Sweep idle liquidity to a yield strategy |
| `refreshPremium` | Anyone | Trigger premium recalculation (permissionless, no risk) |

**Important**: Slither flags these as having no access control, but they are safe. The spoke registration check in storage prevents arbitrary callers. The `sweep`/`reclaim` check `require(caller == asset.reinvestmentController)` restricts to the configured controller.

### HubConfigurator

A wrapper around Hub admin functions. ALL functions carry the `restricted` modifier. This is the interface the AccessManager's role holders actually call.

Notable functions and their trust implications:

| Function | Trust implication |
|---|---|
| `updateFeeReceiver` | Redirects where protocol revenue goes. |
| `updateInterestRateStrategy` | Replaces the entire interest rate model contract. |
| `updateReinvestmentController` | Controls who can sweep idle liquidity out of the Hub. |
| `resetAssetCaps` / `updateSpokeAddCap` / `updateSpokeDrawCap` | Changes position size limits. |
| `deactivateAsset` / `haltAsset` | Emergency controls: halt stops new operations, deactivate is permanent. |
| `deactivateSpoke` / `haltSpoke` | Emergency controls for specific spokes. |

### SpokeConfigurator

Same pattern as HubConfigurator. ALL functions `restricted`. Controls spoke-side parameters:

| Function | Trust implication |
|---|---|
| `updateReservePriceSource` | **Critical**: oracle feed replacement, affects all users' collateralization. |
| `updateCollateralRisk` / `updateCollateralFactor` / `updateMaxLiquidationBonus` / `updateLiquidationFee` | Risk parameters that determine liquidation thresholds and penalties. |
| `pauseAllReserves` / `freezeAllReserves` / `pauseReserve` / `freezeReserve` | Emergency pause/freeze. Frozen reserves prevent withdrawals and new deposits. |
| `updatePositionManager` | **Critical**: controls who can manage user positions (same as SpokeInstance above). |

### Treasury (TreasurySpokeInstance)

Uses `Ownable2Step` (NOT the AccessManager). The owner is a GnosisSafe multisig.

| Function | Modifier | Trust implication |
|---|---|---|
| `supply` / `supplySkimmed` | `onlyOwner` | Invest treasury funds into a Hub. |
| `withdraw` | `onlyOwner` | **Critical**: pull assets from Hub to any arbitrary address. The Treasury owner can drain all accumulated protocol fees. |
| `transfer` | `onlyOwner` | **Critical**: transfer any ERC20 token the Treasury holds to any address. |
| `transferOwnership` | `onlyOwner` | Start 2-step ownership transfer. Must be accepted by the new owner via `acceptOwnership`. |

**Trust implication**: the Treasury owner (currently a GnosisSafe) has unconstrained ability to drain all accumulated protocol fees. The 2-step ownership transfer prevents accidental or malicious one-step takeover.

### AaveOracle

Custom inline access control (no modifiers, no AccessManager):

| Function | Access check | Trust implication |
|---|---|---|
| `setSpoke` | `msg.sender == DEPLOYER`, one-time call | Links the oracle to its spoke. Reverts if already set. Safe by design. |
| `setReserveSource` | `msg.sender == spoke` | Only the linked Spoke can update price feeds. Since Spoke's `updateReservePriceSource` is `restricted`, this is transitively gated by the AccessManager. |

### AssetInterestRateStrategy

Single state-changing function:

| Function | Access check | Trust implication |
|---|---|---|
| `setInterestRateData` | `msg.sender == HUB` (immutable) | Only the Hub can update interest rate parameters. The Hub's `setInterestRateData` is `restricted`, so this is transitively gated by the AccessManager. |

### PriceCapAdapter

Custom inline ACL check:

| Function | Access check | Trust implication |
|---|---|---|
| `setDiscountRatePerYear` | `ACL_MANAGER.isRiskAdmin(msg.sender) \|\| ACL_MANAGER.isPoolAdmin(msg.sender)` | **Risk Admin or Pool Admin on the ACLManager** can change the discount rate that directly affects the price cap of wrapped assets (Pendle PTs, sUSDe, etc.). A malicious rate change could under-price collateral and trigger unfair liquidations. |

Note: this function uses the legacy `ACLManager` (bytes32 roles), NOT the V5 AccessManager. This is a separate trust path.

### Executor (Aave Governance V3)

| Function | Modifier | Trust implication |
|---|---|---|
| `executeTransaction` | `onlyOwner` | Supports both `call` and `delegatecall` to arbitrary targets with arbitrary calldata. The owner (PayloadsController / Governance) can execute any action in the Executor's context. |

## Detector findings

Only 2 contracts produced detector findings:

### SpokeInstance / LiquidationLogic: `arbitrary-send-erc20` (High impact, High confidence)

**Finding**: In `LiquidationLogic._liquidateDebt`, the line `IERC20(params.underlying).safeTransferFrom(params.liquidator, address(params.hub), amountToRestore)` uses `params.liquidator` as the `from` address in a `transferFrom` call.

**Verdict: False positive.** `params.liquidator` is always `msg.sender` passed through the liquidation call chain. The liquidator is spending their own pre-approved tokens to repay the undercollateralized debt and seize the collateral. This is the standard liquidation flow in lending protocols.

### Executor: `controlled-delegatecall` (High impact, Medium confidence)

**Finding**: The Executor's `executeTransaction` can perform `delegatecall` to any target with any calldata.

**Verdict: True positive, by design.** The Executor is the governance execution endpoint. The `onlyOwner` guard means only the governance system (PayloadsController) can trigger delegatecalls. This is intentional: governance proposals need to execute arbitrary actions.

## Wake findings: struct-field-level state changes

Wake's `state-changes` printer reveals the exact struct fields each privileged function modifies. This is more precise than Slither's output (which only reports the top-level variable name) and directly informs trust statements.

### SpokeInstance: what governance can change at the field level

| Function | Exact state modification | Trust statement |
|---|---|---|
| `addReserve` | `_reserveCount++`; `_reserves[id] = Reserve({ underlying, hub, assetId, decimals, collateralRisk, flags: {paused, frozen, borrowable, receiveSharesEnabled}, dynamicConfigKey })`; `_dynamicConfig[id][key] = dynamicConfig` | Governance can list new assets with full control over initial risk parameters, pause/freeze state, and collateral eligibility. |
| `updateReserveConfig` | `reserve.collateralRisk = config.collateralRisk`; `reserve.flags = ReserveFlagsMap.create({ paused, frozen, borrowable, receiveSharesEnabled })` | Governance can individually toggle each reserve's pause, freeze, borrow, and collateral flags, and change its collateral risk weight. A freeze prevents new deposits and withdrawals. |
| `updateLiquidationConfig` | `_liquidationConfig = config` (targetHealthFactor, healthFactorForMaxBonus, liquidationBonusFactor) | Governance sets the liquidation bonus and health factor thresholds that determine when and how aggressively positions are liquidated. |
| `updateReservePriceSource` | Cross-contract call: `IAaveOracle(ORACLE).setReserveSource(reserveId, priceSource)` | Governance can swap the price feed for any reserve. The modification happens on the Oracle contract, not the Spoke itself. |
| `updatePositionManager` | `_positionManager[positionManager].active = active` | Governance can activate or deactivate any address as a position manager. An active position manager can supply, withdraw, borrow, and repay on behalf of any user who has approved it. |

### SpokeInstance: what users and liquidators modify

| Function | Exact state modification | Cross-contract calls |
|---|---|---|
| `supply` | `userPosition.suppliedShares += suppliedShares` | `reserve.hub.add(reserve.assetId, amount)` |
| `withdraw` | `userPosition.suppliedShares -= withdrawnShares`; `userPosition.premiumShares += premiumDelta`; `positionStatus.riskPremium = newRiskPremium` | `hub.remove(assetId, withdrawnAmount, msg.sender)`; `hub.refreshPremium(assetId, premiumDelta)` |
| `liquidationCall` | `userPositionStatus.riskPremium = 0`; `userPosition.drawnShares -= debtComponents.drawnShares`; `userPosition.suppliedShares = newUserSuppliedShares`; `liquidatorPosition.suppliedShares += sharesToLiquidator` | `hub.reportDeficit(assetId, ...)`, `hub.remove(...)` |

The cross-contract call boundaries show that every supply/withdraw/borrow/liquidation touches BOTH the Spoke (user position accounting) and the Hub (global asset accounting). A compromise of either contract affects fund flows.

### HubConfigurator: what governance can configure on the Hub

| Function | What it changes on the Hub | Trust implication |
|---|---|---|
| `updateFeeReceiver` | `asset.feeReceiver = newReceiver` | Redirects protocol revenue for a given asset to any address. |
| `updateInterestRateStrategy` | `asset.irStrategy = newStrategy` | Swaps the contract that computes interest rates. A malicious strategy could set extreme rates. |
| `updateReinvestmentController` | `asset.reinvestmentController = newController` | The reinvestment controller can call `hub.sweep()` and `hub.reclaim()` to move idle liquidity in and out of yield strategies. |
| `haltAsset` / `deactivateAsset` | Spoke-level flags on the Hub | Halt stops new operations; deactivate is permanent. |
| `updateSpokeAddCap` / `updateSpokeDrawCap` | `spoke.addCap` / `spoke.drawCap` | Position size limits per spoke per asset. Setting to zero effectively freezes the spoke. |
| `resetAssetCaps` / `resetSpokeCaps` | Resets caps to `MAX_ALLOWED_SPOKE_CAP` | Removes all position size limits. |

### Treasury: what the owner can do

| Function | Exact state modification |
|---|---|
| `transfer(token, to, amount)` | Calls `IERC20(token).safeTransfer(to, amount)` — moves any token the Treasury holds to any address. |
| `withdraw(hub, assetId, amount, to)` | Calls `hub.remove(assetId, amount, to)` — pulls assets from the Hub to any address. |
| `supply(hub, assetId, amount)` / `supplySkimmed(hub, assetId)` | Calls `hub.add(assetId, amount)` — invests Treasury funds into a Hub. |

The Treasury owner (a GnosisSafe multisig) can drain all accumulated protocol fees with `transfer` or `withdraw`. There is no timelock on these operations.

## Trust summary

### The two trust paths

Aave V4 has two separate access control systems that users must trust:

1. **OpenZeppelin V5 AccessManager** (role-based, time-delayed): gates all Hub and Spoke admin functions via the `restricted` modifier. Root of trust is `ADMIN_ROLE`, currently held by the Aave Governance V3 Executor. This controls: reserve listing/delisting, oracle feed replacement, interest rate strategy changes, spoke caps, fee receiver changes, emergency pause/freeze, position manager updates.

2. **Legacy ACLManager** (bytes32 roles from Aave V3): gates the PriceCapAdapter's `setDiscountRatePerYear` function. `RISK_ADMIN` and `POOL_ADMIN` roles can change the discount rate on wrapped-asset price adapters (Pendle PTs, sUSDe, etc.). This is a separate trust path from the AccessManager.

### Critical privileged actions (what governance can do)

| Action | Contract path | Impact |
|---|---|---|
| Replace oracle feed | SpokeConfigurator → Spoke → Oracle | Can manipulate all prices; enables unfair liquidation or prevents legitimate liquidation |
| Change interest rate strategy | HubConfigurator → Hub | Can change borrowing costs arbitrarily |
| Redirect fee receiver | HubConfigurator → Hub | Can redirect protocol revenue to any address |
| Update reinvestment controller | HubConfigurator → Hub | Can grant an address the ability to sweep idle liquidity |
| Pause/freeze markets | SpokeConfigurator → Spoke | Can freeze withdrawals and deposits |
| Change position manager | SpokeConfigurator → Spoke | Can grant a contract the ability to act on behalf of all users |
| Drain treasury | Treasury.withdraw / transfer (Ownable2Step) | Can move all accumulated fees to any address |
| Swap AccessManager | AccessManager.updateAuthority | Can replace the entire governance system on any target contract |
| Change discount rate | PriceCapAdapter.setDiscountRatePerYear (ACLManager) | Can under/over-price wrapped-asset collateral |

## Semgrep findings: cross-instance trust surface confirmation

Custom L2BEAT trust rules scanned every contract instance in the `.code/` directory (all 10 Spoke implementations, all 10 Oracle implementations, all 3 Hubs, both Configurators, the Treasury). 188 findings, 8 rules triggered, zero false positives.

### Privileged oracle source changes (21 findings)

Rule `restricted-oracle-source` confirmed that `updateReservePriceSource` (gated by `restricted`) exists on every one of the 10 Spoke implementations, and `setReserveSource` (gated by `msg.sender == spoke`) exists on every one of the 10 Oracle implementations. The SpokeConfigurator also exposes this as a restricted function. The oracle price source is replaceable on every market, and every replacement path is gated by the AccessManager.

### Privileged pause/freeze/halt (137 findings)

Rule `restricted-pause-freeze-halt` fired on every Spoke (10x: `updateLiquidationConfig` which controls pause/freeze via reserve config), every Hub (3x: `haltAsset`, `deactivateAsset`, `haltSpoke`, `deactivateSpoke`), and both Configurators (HubConfigurator: `haltAsset`, `deactivateAsset`, `haltSpoke`, `deactivateSpoke`, `resetAssetCaps`, `resetSpokeCaps`; SpokeConfigurator: `pauseReserve`, `freezeReserve`, `pauseAllReserves`, `freezeAllReserves`).

This confirms that governance can individually pause, freeze, halt, or deactivate:
- any single reserve on any single Spoke
- any single Spoke on any Hub
- any entire asset across all Spokes

### Privileged position manager changes (11 findings)

Rule `restricted-position-manager` found `updatePositionManager` on all 10 Spokes plus the SpokeConfigurator. This is the function that controls which contracts can act on behalf of users (supply, withdraw, borrow, repay). All 11 instances are gated by `restricted`.

### Permissionless liquidation (10 findings)

Rule `permissionless-liquidation` confirmed that `liquidationCall` on all 10 Spokes is gated only by `nonReentrant` (no access control). This is by design: anyone can liquidate undercollateralized positions. The rule confirms the pattern is consistent across every market.

### Treasury drain path (1 finding)

Rule `owner-unrestricted-transfer` found exactly one instance:

```
Treasury/implementation/spoke/TreasurySpoke.sol:58
  function transfer(address token, address to, uint256 amount) external onlyOwner {
    IERC20(token).safeTransfer(to, amount);
  }
```

The Treasury owner (a GnosisSafe multisig) can transfer any ERC20 the Treasury holds to any address with no timelock.

### Other privileged operations confirmed

| Rule | Findings | Contracts |
|---|---|---|
| `restricted-caps-reset` | 4 | HubConfigurator: `resetAssetCaps`, `resetSpokeCaps`, `updateSpokeAddCap`, `updateSpokeDrawCap` |
| `restricted-fee-receiver` | 2 | HubConfigurator: `updateFeeReceiver`, `updateFeeConfig` |
| `restricted-interest-rate` | 2 | HubConfigurator: `updateInterestRateStrategy`, `updateInterestRateData` |

### Cross-instance consistency confirmed

The key value of the Semgrep pass: every Spoke implementation (10 contracts with identical bytecode deployed across different markets) has the same access control pattern. There are no "rogue" Spokes with different modifiers, no markets with weaker access controls, and no Oracle instances with permissionless price updates. The trust surface is uniform across all markets.

## Aderyn findings

Aderyn's `centralization-risk` detector flagged two contracts with explicit centralization warnings. These confirm the Slither findings from a different angle.

### Treasury: 14 centralization-risk instances

Aderyn flags every `onlyOwner` function on the Treasury as a centralization risk:

| Function | Flagged pattern |
|---|---|
| `transfer(address token, address to, uint256 amount)` | `onlyOwner` — can move any ERC20 to any address |
| `transferOwnership(address newOwner)` | `onlyOwner` — can start ownership transfer |
| `renounceOwnership()` | `onlyOwner` — can permanently brick the Treasury |
| `supply` / `supplySkimmed` / `withdraw` | `onlyOwner` — can invest or withdraw from Hub |

The Treasury uses `Ownable2Step` (not the AccessManager), meaning ownership changes require acceptance by the new owner. But the owner itself (a GnosisSafe multisig) has unconstrained transfer authority over all accumulated fees.

### ACLManager: 8 centralization-risk instances

Aderyn flags every `onlyRole(getRoleAdmin(role))` function as a centralization risk:

| Function | Flagged pattern |
|---|---|
| `grantRole` / `revokeRole` | `onlyRole` — role admin can grant/revoke any address |
| Role admin functions (POOL_ADMIN, RISK_ADMIN, etc.) | `onlyRole(DEFAULT_ADMIN_ROLE)` — the default admin can assign every other role |

The ACLManager's `DEFAULT_ADMIN_ROLE` is the trust root for the legacy access control path (PriceCapAdapter discount rates, and potentially other Aave V3-era contracts). This is separate from the OZ V5 AccessManager that gates Hub/Spoke functions.

### Other Aderyn findings evaluated

| Finding | Contracts | Verdict |
|---|---|---|
| `delegatecall` in loop (H) | MainSpoke (`multicall`) | **Safe by design**: `multicall` uses delegatecall to batch calls to itself (same contract). Standard OZ pattern. |
| Arbitrary `from` in `transferFrom` (H) | LiquidationLogic | **False positive**: same as Slither. The `from` is `msg.sender` (the liquidator spending their own tokens). |
| Unprotected initializer (H) | MainHub, MainSpoke, Treasury | **Proxy initializers**: these use OZ `initializer` / `reinitializer` modifiers. The "unprotected" flag is because Aderyn doesn't trace the modifier through the proxy's delegatecall context. |
| Contract locks Ether (H) | AccessManager | **Not a concern**: the OZ AccessManager can receive ETH as part of scheduled operations, but Aave V4 doesn't send ETH to it. |
| Missing `address(0)` check on `_setAuthority` (L) | HubConfigurator, SpokeConfigurator | **False positive**: the public `setAuthority` function validates `newAuthority.code.length != 0` before calling the internal `_setAuthority`. The only way to reach the internal function without validation is via the one-time initializer. |

### What Slither cannot tell us (and discovery fills in)

Slither shows the implementation-level access control (which functions are `restricted`, which state they write). It CANNOT resolve:

- Which role IDs are assigned to which functions on which targets (runtime configuration in AccessManager storage)
- Which addresses currently hold which roles (runtime role membership)
- What time delays are configured per role (grant delays, execution delays)
- The governance proposal lifecycle (how long from proposal to execution)

These are answered by the discovery's event-handler data (milestone 3): the `targetGatedFunctions`, `roleMembers`, `roleGrantDelays`, and `targetAdminDelays` fields on the AccessManagerEnumerable template reconstruct the full runtime permission matrix from onchain logs.
