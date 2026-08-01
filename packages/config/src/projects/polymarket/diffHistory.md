Generated with discovered.json: 0xab27aa476ce5aaf2d8fc35dff4bceda70f1012d5

# Diff at Sat, 01 Aug 2026 16:27:50 GMT:

- author: vincfurc (<vincfurc@users.noreply.github.com>)
- current timestamp: 1785484385

## Description

Discovery rerun on the same block number with only config-related changes.

## Initial discovery

```diff
+   Status: CREATED
    contract DepositWalletFactory (matic:0x00000000000Fb5C9ADea0298D729A0CB3823Cc07) [polymarket/DepositWalletFactory]
    +++ description: Upgradeable CREATE2 factory deploying per-user smart wallets as beacon proxies at deterministic addresses, and relaying signed call batches to them. Holders of the operator role deploy wallets and forward batch executions (each batch is still authorised by the individual wallet owner's signature). Holders of the legacy-deployer role deploy wallets in the older non-beacon proxy shape at the addresses the previous factory version would have assigned. Holders of the admin role manage the operator and legacy-deployer roles and set the user-protection timelock delay of 1h (at most 7d) that wallet owners must wait after pausing their wallet before withdrawals become possible. The owner (not the role holders) manages admins, sets and authorises wallet implementations for legacy upgrades, and authorises upgrades of the factory itself.
```

```diff
+   Status: CREATED
    contract PositionManager (matic:0x006F54F7f9A22e0000CC2AB60031000000ae9fEF) [polymarket/PositionManager]
    +++ description: Upgradeable ERC1155 ledger of combination-outcome positions. Position tokens can only be minted and burned by the outcome module registered for the position's module id, or by a module that has been explicitly cross-authorised to act across all modules. Holders of the admin role register and remove modules and set the cross-module authorisation flag: registering a module and cross-authorising it grants that module mint and burn power over every position in the ledger. The owner authorises implementation upgrades.
```

```diff
+   Status: CREATED
    contract AddressWhitelist (matic:0x0f79d0039956D58a7d5d006a6Dd64a35616Aa2c6) [uma/AddressWhitelist]
    +++ description: A simple address whitelist for tokens that can be used as bonds and/or fees. This whitelist is checked and enforced by various smart contracts in the UMA ecosystem.
```

```diff
+   Status: CREATED
    contract BinaryModule (matic:0x1000008dD9001B968442c1000017eaE6E0dA00Ba) [polymarket/BinaryModule]
    +++ description: Upgradeable outcome module for two-sided markets, registered on the outcome-token ledger. Its split, merge and redeem functions are external with no access control: split burns pre-transferred collateral and mints both outcome positions, while merge and redeem mint the collateral token against outcome positions that were pre-transferred to the module (merge burns equal amounts of both sides, redeem pays out resolved positions pro rata). Holders of the bridge role can mint positions without any collateral backing and burn positions held by the module. Holders of the resolver role (and bridge-role holders) can report results for any condition directly, bypassing the oracle-derived resolution path; a reported result is final and cannot be overwritten. Holders of the admin role manage the operator, creator, bridge and resolver roles and can pause individual resolvers or individual conditions. Holders of the creator role register legacy conditions for migration. The owner authorises implementation upgrades.
```

```diff
+   Status: CREATED
    contract FeeReceiverSafe (matic:0x115F48DC2A731aA16251c6d6e1BEfC42f92Accc9) [GnosisSafe]
    +++ description: None
```

```diff
+   Status: CREATED
    contract NegRiskModule (matic:0x200000900045e3B6259600682756002200028933) [polymarket/NegRiskModule]
    +++ description: Upgradeable outcome module for multi-outcome (negative-risk) markets, registered on the outcome-token ledger. Its split, merge, redeem and event-level operations (horizontal split, horizontal merge, convert) are external with no access control and mint the collateral token or new outcome positions against positions or collateral pre-transferred to the module. Holders of the bridge role can mint positions without any collateral backing, burn positions held by the module, and additionally resolve the synthetic fallback outcome of an event. Holders of the resolver role (and bridge-role holders) can report results for any condition directly, bypassing the oracle-derived resolution path; the module enforces that reported YES results across an event's conditions sum to at most 100% and auto-derives the fallback outcome. Holders of the admin role manage the operator, creator, bridge and resolver roles and can pause individual resolvers or individual conditions. Holders of the creator role register legacy conditions for migration. The owner authorises implementation upgrades.
```

```diff
+   Status: CREATED
    contract UChildAdministrableERC20 (matic:0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174) [N/A]
    +++ description: None
```

```diff
+   Status: CREATED
    contract CollateralOfframp (matic:0x2957922Eb93258b93368531d39fAcCA3B4dC5854) [polymarket/CollateralOfframp]
    +++ description: Permissionless unwrap entrypoint for the collateral token: anyone can burn their collateral tokens and have the underlying stablecoin released from the vault to a recipient of their choice. The contract holds no balance. Holders of the admin role can pause unwrapping per asset with no delay, which blocks withdrawals through this contract, and can add or remove other admins; the owner grants and revokes roles at will.
```

```diff
+   Status: CREATED
    contract ManagedOptimisticOracleV2 (matic:0x2C0367a9DB231dDeBd88a94b4f6461a6e47C58B1) [uma/ManagedOptimisticOracleV2]
    +++ description: Managed (permissioned) variant of the UMA Optimistic Oracle V2 that acts as an escalation layer before UMA's DVM. Price requests are restricted to a requester whitelist and proposals to a proposer whitelist. A proposal can be disputed during its liveness window (default 2h, with a minimum dispute window of 5m), and settlement is restricted to the resolver role. Because settlement is permissioned, a proposal that outlives its liveness window does not become final on its own and can still be disputed until a resolver settles it. Roles (OpenZeppelin AccessControl): the default admin can upgrade the contract and manage the config admin role; the config admin sets the requester and proposer whitelists, the default liveness, the minimum dispute window and the allowed bond ranges, and manages request managers; request managers set per-request proposer whitelists, bonds and liveness; the self-governing resolver admin manages resolvers.
```

```diff
+   Status: CREATED
    contract CombinatorialModule (matic:0x30000034706C7d8e12009DAB006Be20000c031A8) [polymarket/CombinatorialModule]
    +++ description: Upgradeable outcome module for combinatorial positions built as conjunctions of position legs from other outcome modules. It stores no outcomes of its own: payouts are derived on the fly by multiplying the resolved payouts of the referenced legs, with the NO side paying the complement. Preparing a combinatorial condition and all split, merge, refinement, extraction, wrap and redemption operations are external with no access control and mint the collateral token or outcome positions against positions or collateral pre-transferred to the module. Because it must mint and burn the position legs of other modules, it operates with cross-module authorisation on the outcome-token ledger and mint rights on the collateral token. Holders of the bridge role can mint positions without any collateral backing and burn positions held by the module. Holders of the admin role manage the operator, creator and bridge roles. The owner authorises implementation upgrades.
```

```diff
+   Status: CREATED
    contract WrappedCollateral (matic:0x3A3BD7bb9528E159577F7C2e685CC81A765002E2) [polymarket/WrappedCollateral]
    +++ description: ERC20 wrapper around an underlying token, owned by the single adapter contract that deployed it (the owner is immutable, fixed at deployment). Anyone can unwrap: burning wrapper units releases the same amount of the underlying. Only the owner can wrap (deposit underlying and mint) and, more importantly, mint wrapper units without any underlying backing and release arbitrary amounts of the underlying held by this contract to any recipient.
```

```diff
+   Status: CREATED
    contract USD Coin Token (matic:0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359) [tokens/circle/USDC]
    +++ description: None
```

```diff
+   Status: CREATED
    contract AdminSafe (matic:0x3dcE0a29139A851Da1dFCa56Af8e8a6440b4D952) [GnosisSafe]
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyWallet (matic:0x44e999d5c2F66Ef0861317f9A4805AC2e90aEB4f) [polymarket/ProxyWallet]
    +++ description: Per-user proxy wallet implementation that is cloned by its factory. Each clone is initialized once, with the first caller (the factory) becoming its owner; only that owner can execute batches of arbitrary calls and delegatecalls through the wallet. The wallet can receive ERC1155 tokens and holds the user's balances.
```

```diff
+   Status: CREATED
    contract Timelock (matic:0x47EbFAC3353314C788B96CDCbf41daadfE03629C) [polymarket/Timelock]
    +++ description: Timelock with enumerable roles (Solady-style). Proposer role holders queue transaction batches with a delay of at least 12h, executor role holders execute them once the delay has passed, and canceller role holders can cancel queued batches. Changing the minimum delay can only be done by the timelock calling itself, so it is itself subject to the delay. Role assignments are not delayed: an admin role holder can grant or revoke any role instantly, so an admin can immediately install new proposers, executors or cancellers without waiting.
```

```diff
+   Status: CREATED
    contract ConditionalTokens (matic:0x4D97DCd97eC945f40cF65F87097ACe5EA0476045) [polymarket/ConditionalTokens]
    +++ description: Immutable, adminless ERC1155 ledger of conditional outcome tokens. Anyone can prepare a condition naming an oracle, split collateral into a complete set of outcome tokens, merge them back, or redeem winning tokens once the condition is resolved. Only the oracle named at preparation can report the payout vector for its own condition, and payouts are write-once: once set, they can never be changed. The contract has no admin, no upgradeability, and no pause.
```

```diff
+   Status: CREATED
    contract DepositWallet (matic:0x58CA52ebe0DadfdF531Cde7062e76746de4Db1eB) [polymarket/DepositWallet]
    +++ description: Per-user smart wallet implementation shared by all wallets deployed from the wallet factory. Call batches are relayed by the factory, but each batch must be authorised by the wallet owner's (or a time-limited session signer's) EIP-712 signature over a nonce and deadline, verified via ERC-1271; session signers cannot call the wallet itself or its beacon. Direct withdrawals of native, ERC20 and ERC1155 assets and approval revocations are owner-only and only possible while the wallet is paused and the factory's timelock delay has elapsed. Because the implementation is resolved through a shared beacon, the beacon owner can replace the implementation of every wallet at once; a wallet owner can opt out of beacon upgrades by pinning the current implementation (a paused-only operation).
```

```diff
+   Status: CREATED
    contract UmaCtfAdapterBinary (matic:0x65070BE91477460D8A7AeEb94ef92fe056C2f2A7) [polymarket/UmaCtfAdapter]
    +++ description: Resolution adapter that registers market questions with an UMA optimistic oracle and reports the settled answer to the outcome-token ledger. Anyone can initialize a question, which prepares the condition and requests a price from the oracle, and anyone can resolve it once the oracle has settled a price. A first dispute on the oracle automatically resets the question with a fresh price request; a second dispute escalates to UMA's DVM. Admins can pause, unpause and reset any question, and can flag a question -- which pauses it -- and, once 1h have passed since flagging, resolve it manually with an outcome of their choosing, bypassing the oracle. Flagging can be reverted within the safety period.
```

```diff
+   Status: CREATED
    contract NegRiskOperator (matic:0x661992aebf6BecF7BA5abB66f6b0Bf62Aa7a2E93) [polymarket/NegRiskOperator]
    +++ description: Permissioned operator sitting between the resolution adapter (registered as its oracle) and the multi-outcome adapter. The oracle reports a boolean outcome per question, and anyone can then finalize a reported question after a delay of 0s. Admins prepare markets and questions, can flag a question -- which blocks the permissionless resolution path -- and can force an outcome of their choosing on a flagged question once 0s have passed since flagging. The delay period is a constant currently set to zero, so flagging and forcing an outcome can happen in the same transaction, with no advance notice.
```

```diff
+   Status: CREATED
    contract UmaCtfAdapterNegRisk (matic:0x69c47De9D4D3Dad79590d61b9e05918E03775f24) [polymarket/UmaCtfAdapter]
    +++ description: Resolution adapter that registers market questions with an UMA optimistic oracle and reports the settled answer to the outcome-token ledger. Anyone can initialize a question, which prepares the condition and requests a price from the oracle, and anyone can resolve it once the oracle has settled a price. A first dispute on the oracle automatically resets the question with a fresh price request; a second dispute escalates to UMA's DVM. Admins can pause, unpause and reset any question, and can flag a question -- which pauses it -- and, once 1h have passed since flagging, resolve it manually with an outcome of their choosing, bypassing the oracle. Flagging can be reverted within the safety period.
```

```diff
+   Status: CREATED
    contract UmaCtfAdapterLegacy (matic:0x6A9D222616C90FcA5754cd1333cFD9b7fb6a4F74) [polymarket/UmaCtfAdapterLegacy]
    +++ description: Earlier generation of the resolution adapter that registers market questions with an UMA optimistic oracle and reports the settled answer to the outcome-token ledger. Anyone can initialize a question, which prepares the condition and requests a price from the oracle, and anyone can resolve it once the oracle has settled a price. Admins can pause, unpause and reset any question, and can flag a question -- which pauses it, with no function to unflag -- and, once 2d have passed since flagging, resolve it via emergencyResolve() with an arbitrary payout array of which only the length is validated.
```

```diff
+   Status: CREATED
    contract GnosisSafeL2 (matic:0x6ee4D971142afadEa1828445124D6137080B4146) [GnosisSafe]
    +++ description: None
```

```diff
+   Status: CREATED
    contract DepositWalletBeacon (matic:0x7A18EDfe055488A3128f01F563e5B479D92ffc3a) [polymarket/DepositWalletBeacon]
    +++ description: Upgradeable beacon holding the implementation pointer for every smart wallet proxy deployed by the wallet factory. Its owner can replace the implementation of every wallet pointing at it in a single transaction; candidate implementations must answer an interface probe before being accepted. Individual wallets can opt out of upgrades by pinning the current implementation for themselves, and opt back in later.
```

```diff
+   Status: CREATED
    contract NegRiskFeeVault (matic:0x7f67327E88c258932D7d8f72950bE0d46975E11D) [polymarket/NegRiskFeeVault]
    +++ description: Vault holding accrued protocol fees in the form of ERC20 and ERC1155 balances. Its admins can transfer out any ERC20 or ERC1155 balance to any recipient at any time, with no delay. Admins also add and remove other admins.
```

```diff
+   Status: CREATED
    contract SafeL2 (matic:0x7FB4492Ff58E4326a99D7d4F66aE1f47c8286Fc6) [GnosisSafe]
    +++ description: None
```

```diff
+   Status: CREATED
    contract CollateralOnramp (matic:0x93070a847efEf7F70739046A929D47a521F5B8ee) [polymarket/CollateralOnramp]
    +++ description: Permissionless wrap entrypoint for the collateral token: anyone can deposit the underlying stablecoin and have an equal amount of the collateral token minted to a recipient of their choice. The contract holds no balance, the underlying is forwarded within the same call. Holders of the admin role can pause wrapping per asset and add or remove other admins; the owner grants and revokes roles at will.
```

```diff
+   Status: CREATED
    contract AddressWhitelist (matic:0x9F35885CE8f67a942D7B2f4Fbf937987DA08c463) [uma/AddressWhitelist]
    +++ description: A simple address whitelist for tokens that can be used as bonds and/or fees. This whitelist is checked and enforced by various smart contracts in the UMA ecosystem.
```

```diff
+   Status: CREATED
    contract AutoRedeemer (matic:0xa1200000d0002264C9a1698e001292D00E1b00af) [polymarket/AutoRedeemer]
    +++ description: Upgradeable batch redemption helper. Holders of the operator role trigger redemption of resolved positions on behalf of users who opted in by granting this contract an ERC1155 approval; users without the approval are skipped. Proceeds always go to the position owner: the recipient is not a parameter of any call, and the contract has no sweep or rescue function. It can only move positions into their outcome module for redemption and forward the resulting collateral back to the owner, so operator-role holders cannot redirect funds, only choose when redemption happens. Holders of the admin role manage operators. The owner authorises implementation upgrades.
```

```diff
+   Status: CREATED
    EOA  (matic:0xA49e1a819c856162D87100cF20E63062e87c0E84)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SafeProxyFactory (matic:0xaacFeEa03eb1561C4e67d661e40682Bd20E3541b) [polymarket/SafeProxyFactory]
    +++ description: Deterministic factory for single-owner smart-contract wallets. Anyone can submit an EIP-712 signature to deploy a wallet proxy at an address derived solely from the signer's address; the new wallet is set up with the signer as its only owner (threshold 1) and a fixed fallback handler, optionally paying a deployment fee from the wallet. The wallet singleton and fallback handler are set in the constructor and there are no functions to change them. The settlement exchanges use the same address derivation to validate signatures made by wallet owners.
```

```diff
+   Status: CREATED
    contract ProxyWalletFactory (matic:0xaB45c5A4B0c941a2F231C04C3f49182e1A254052) [polymarket/ProxyWalletFactory]
    +++ description: Deterministic per-user proxy-wallet factory. On the first call routed through it, it deploys a minimal-proxy wallet at an address derived from the user's address and then forwards batched calls to that wallet; the settlement exchanges use the same derivation to validate signatures made by wallet owners. Calls can arrive directly or through a gas-relay network, in which case the effective sender is recovered from the relayed data. The wallet implementation being cloned is fixed at deployment; the factory's owner can only replace the gas-relay module, which is executed via delegatecall in this contract's context when processing relayed calls.
```

```diff
+   Status: CREATED
    contract OperationsAccount (matic:0xAC9930b2AE455a671b62dE86876A7e8587825294) [N/A]
    +++ description: None
```

```diff
+   Status: CREATED
    contract CtfCollateralAdapter (matic:0xADa100874d00e3331D00F2007a9c336a65009718) [polymarket/CtfCollateralAdapter]
    +++ description: Adapter between the wrapped collateral token and the conditional-token ledger: anyone can split wrapped collateral into a pair of outcome positions, merge positions back, or redeem resolved positions. It unwraps into the underlying stablecoin, performs the operation on the ledger, and re-wraps the proceeds. Unwrapped funds are always sent to the contract itself and wrapped proceeds and position tokens to the caller, so it cannot redirect funds to a third party. It keeps a standing maximum allowance of the underlying towards the conditional-token ledger. Holders of the admin role can pause all operations (including redemptions) with no delay and add or remove other admins; the owner grants and revokes roles at will.
```

```diff
+   Status: CREATED
    contract CtfCollateralAdapter2 (matic:0xAdA100Db00Ca00073811820692005400218FcE1f) [polymarket/CtfCollateralAdapter]
    +++ description: Adapter between the wrapped collateral token and the conditional-token ledger: anyone can split wrapped collateral into a pair of outcome positions, merge positions back, or redeem resolved positions. It unwraps into the underlying stablecoin, performs the operation on the ledger, and re-wraps the proceeds. Unwrapped funds are always sent to the contract itself and wrapped proceeds and position tokens to the caller, so it cannot redirect funds to a third party. It keeps a standing maximum allowance of the underlying towards the conditional-token ledger. Holders of the admin role can pause all operations (including redemptions) with no delay and add or remove other admins; the owner grants and revokes roles at will.
```

```diff
+   Status: CREATED
    contract NegRiskCtfCollateralAdapter (matic:0xAdA200001000ef00D07553cEE7006808F895c6F1) [polymarket/NegRiskCtfCollateralAdapter]
    +++ description: Adapter between the wrapped collateral token and the conditional-token ledger for multi-outcome (negative-risk) markets, routing operations through a dedicated market adapter: anyone can split wrapped collateral into outcome positions, merge positions back, redeem resolved positions, or convert positions between outcomes (subject to the fee configured in the market adapter). It unwraps into the underlying stablecoin, performs the operation, and re-wraps the proceeds. Unwrapped funds are always sent to the contract itself and wrapped proceeds and position tokens to the caller, so it cannot redirect funds to a third party. It keeps standing maximum allowances of the underlying towards both the conditional-token ledger and the market adapter. Holders of the admin role can pause all operations (including redemptions) with no delay and add or remove other admins; the owner grants and revokes roles at will.
```

```diff
+   Status: CREATED
    contract NegRiskCtfCollateralAdapter2 (matic:0xadA2005600Dec949baf300f4C6120000bDB6eAab) [polymarket/NegRiskCtfCollateralAdapter]
    +++ description: Adapter between the wrapped collateral token and the conditional-token ledger for multi-outcome (negative-risk) markets, routing operations through a dedicated market adapter: anyone can split wrapped collateral into outcome positions, merge positions back, redeem resolved positions, or convert positions between outcomes (subject to the fee configured in the market adapter). It unwraps into the underlying stablecoin, performs the operation, and re-wraps the proceeds. Unwrapped funds are always sent to the contract itself and wrapped proceeds and position tokens to the caller, so it cannot redirect funds to a third party. It keeps standing maximum allowances of the underlying towards both the conditional-token ledger and the market adapter. Holders of the admin role can pause all operations (including redemptions) with no delay and add or remove other admins; the owner grants and revokes roles at will.
```

```diff
+   Status: CREATED
    contract ProxyWallet (matic:0xB7B9D7c6627714523F2Bf612Ef8AE17Fc77A19D0) [polymarket/ProxyWallet]
    +++ description: Per-user proxy wallet implementation that is cloned by its factory. Each clone is initialized once, with the first caller (the factory) becoming its owner; only that owner can execute batches of arbitrary calls and delegatecalls through the wallet. The wallet can receive ERC1155 tokens and holds the user's balances.
```

```diff
+   Status: CREATED
    contract CollateralToken (matic:0xC011a7E12a19f7B1f670d46F03B03f3342E82DFB) [polymarket/CollateralToken]
    +++ description: Upgradeable ERC20 (pUSD) that wraps a stablecoin one-for-one and serves as the collateral asset of the exchange. Wrapping moves the underlying into a separate vault contract and mints this token; unwrapping burns it and pulls the underlying back out of that vault. Both directions are restricted to holders of the wrapper role, which are the ramp and adapter contracts. Holders of the minter role can additionally mint and burn without any underlying backing. The owner grants and revokes both roles and authorises implementation upgrades; the accepted underlying assets and the vault address are fixed at deployment and can only be changed by upgrading.
```

```diff
+   Status: CREATED
    contract GnosisSafeL2 (matic:0xC193b33ff5E8A68F422a5d36A2dEf1D196b15160) [N/A]
    +++ description: None
```

```diff
+   Status: CREATED
    contract CollateralVault (matic:0xC417fD8E9661c0d2120B64a04Bb3278C17E99DB1) [polymarket/CollateralVault]
    +++ description: ERC-4337 modular smart-contract account used as the vault holding the underlying stablecoin that backs the circulating supply of the collateral token. Its native owner can execute arbitrary calls from the account, install and uninstall plugins, transfer or renounce ownership, and upgrade the account implementation, giving it full control over the held funds. The vault grants the collateral token an allowance so that unwrapping can pull the underlying out.
```

```diff
+   Status: CREATED
    contract NegRiskAdapter (matic:0xd91E80cF2E7be2e162c6513ceD06f1dD0dA35296) [polymarket/NegRiskAdapter]
    +++ description: Immutable adapter that composes binary conditions on the underlying conditional-token ledger into multi-outcome ('negative risk') markets, acting as the on-ledger oracle for the conditions it creates. Splitting, merging, redeeming, and converting positions is permissionless; converting a set of no-positions into the complementary yes-positions plus collateral can charge a per-market fee that accrues to a fixed vault address. Each market's outcomes are reported exclusively by the oracle address that prepared that market. Admins can relay outcome-token transfers on behalf of a user, but only if the user has independently approved that admin on the token ledger.
```

```diff
+   Status: CREATED
    contract CTFExchange (matic:0xE111180000d2663C0091e4f400237545B87B996B) [polymarket/CTFExchange]
    +++ description: Immutable order-settlement exchange for conditional outcome tokens. Trades are EIP-712 signed limit orders that are matched off-chain and settled on-chain exclusively by holders of the operator role, who choose which orders to match and what fee to charge on each fill. The fee is not part of the signed order: it is supplied by the operator at settlement, added on top of the amount a buyer signed for and deducted from a seller's proceeds. It is bounded only by a maximum rate the admins set, currently 0 bps; a maximum of zero disables the check entirely rather than forbidding fees, so at that setting the contracts enforce no upper bound on the fee. Operators can also preapprove an order, which itself requires a valid maker signature, so that later fills of that order may omit the signature bytes; no fill is possible without a signature the maker produced. Admins add and remove admins and operators, pause and unpause all trading, and set the fee receiver and the maximum fee rate. Any user can pause trading of their own orders, effective 100 blocks after the request. The authorization mixin grants the admin and operator roles to the address supplied at deployment without emitting an event, so that admin never appears in the added/removed sets; it is instead recovered from the granter recorded on later authorization events.
```

```diff
+   Status: CREATED
    contract CompatibilityFallbackHandler (matic:0xe16bA5bF81E5BB113e4752E4fdC20351d796fB24) [N/A]
    +++ description: None
```

```diff
+   Status: CREATED
    contract NegRiskCtfExchange (matic:0xe2222d279d744050d28e00520010520000310F59) [polymarket/CTFExchange]
    +++ description: Immutable order-settlement exchange for conditional outcome tokens. Trades are EIP-712 signed limit orders that are matched off-chain and settled on-chain exclusively by holders of the operator role, who choose which orders to match and what fee to charge on each fill. The fee is not part of the signed order: it is supplied by the operator at settlement, added on top of the amount a buyer signed for and deducted from a seller's proceeds. It is bounded only by a maximum rate the admins set, currently 0 bps; a maximum of zero disables the check entirely rather than forbidding fees, so at that setting the contracts enforce no upper bound on the fee. Operators can also preapprove an order, which itself requires a valid maker signature, so that later fills of that order may omit the signature bytes; no fill is possible without a signature the maker produced. Admins add and remove admins and operators, pause and unpause all trading, and set the fee receiver and the maximum fee rate. Any user can pause trading of their own orders, effective 100 blocks after the request. The authorization mixin grants the admin and operator roles to the address supplied at deployment without emitting an event, so that admin never appears in the added/removed sets; it is instead recovered from the granter recorded on later authorization events.
```

```diff
+   Status: CREATED
    contract CombosExchange (matic:0xe3333700cA9d93003F00f0F71f8515005F6c00Aa) [polymarket/CombosExchange]
    +++ description: Upgradeable request-for-quote settlement exchange for combination positions. Holders of the operator role settle EIP-712 signed orders by matching a taker order against maker orders, moving collateral and outcome positions between the signers and minting or merging position pairs through the outcome modules as needed; they can also preapprove order signatures in advance. The fee taken from each fill is bounded by the order's signed fee rate and globally by a maximum of 1000 basis points fixed at deployment; fees go to a fixed receiver address. Holders of the admin role can pause all trading, manage operators and set the delay for user-initiated pauses. Users can pause their own orders after a block delay. The owner authorises implementation upgrades and manages admins.
```

```diff
+   Status: CREATED
    contract GnosisSafeL2 (matic:0xE51abdf814f8854941b9Fe8e3A4F65CAB4e7A4a8) [N/A]
    +++ description: None
```

```diff
+   Status: CREATED
    contract PermissionedRamp (matic:0xebC2459Ec962869ca4c0bd1E06368272732BCb08) [polymarket/PermissionedRamp]
    +++ description: Wrap/unwrap entrypoint for the collateral token that additionally requires an EIP-712 signature from a holder of the witness role, checked against a per-sender nonce and a deadline. Wrapping deposits the underlying stablecoin and mints the collateral token to a chosen recipient; unwrapping burns collateral tokens and releases the underlying from the vault. The contract holds no balance. Holders of the admin role can pause either direction per asset with no delay and add or remove admins and witnesses; the owner grants and revokes roles at will.
```

```diff
+   Status: CREATED
    contract OptimisticOracleV2 (matic:0xeE3Afe347D5C74317041E2618C49534dAf887c24) [uma/OptimisticOracleV2]
    +++ description: Standard permissionless UMA Optimistic Oracle V2. Anyone can request a price for a registered identifier, anyone can propose an answer by posting a bond, and anyone can dispute a proposal within its liveness window (2h by default, customizable per request). Undisputed proposals become final and settleable once the liveness window has passed, while disputes are escalated to UMA's DVM, where UMA token holders vote on the outcome and the loser's bond is partly awarded to the winner.
```

```diff
+   Status: CREATED
    contract DepositWallet (matic:0xf7f27C29e60fe6325beF8dA7F93250353d2e3294) [polymarket/DepositWallet]
    +++ description: Per-user smart wallet implementation shared by all wallets deployed from the wallet factory. Call batches are relayed by the factory, but each batch must be authorised by the wallet owner's (or a time-limited session signer's) EIP-712 signature over a nonce and deadline, verified via ERC-1271; session signers cannot call the wallet itself or its beacon. Direct withdrawals of native, ERC20 and ERC1155 assets and approval revocations are owner-only and only possible while the wallet is paused and the factory's timelock delay has elapsed. Because the implementation is resolved through a shared beacon, the beacon owner can replace the implementation of every wallet at once; a wallet owner can opt out of beacon upgrades by pinning the current implementation (a paused-only operation).
```
