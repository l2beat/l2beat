Generated with discovered.json: 0xa4c6ab84ced3370a955d42e32c2e328f189e57cb

# Diff at Tue, 11 Aug 2026 13:48:09 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- current timestamp: 1785484385

## Description

Discovery rerun on the same block number with only config-related changes.

## Initial discovery

```diff
+   Status: CREATED
    contract DepositWalletFactory (matic:0x00000000000Fb5C9ADea0298D729A0CB3823Cc07) [polymarket/DepositWalletFactory]
    +++ description: Upgradeable CREATE2 wallet factory. Operator-role holders deploy deterministic beacon-proxy wallets and relay signed call batches; legacy-deployer-role holders can separately deploy deterministic legacy UUPS wallets. Admins manage both roles and set the 1h delay that wallet owners must wait after pausing before withdrawals unlock.
```

```diff
+   Status: CREATED
    contract PositionManager (matic:0x006F54F7f9A22e0000CC2AB60031000000ae9fEF) [polymarket/PositionManager]
    +++ description: Upgradeable ERC1155 ledger of combination-outcome positions, mintable and burnable only by the outcome module registered for each position or a cross-authorised module. Admins can register or remove modules and grant registered modules cross-module mint and burn power.
```

```diff
+   Status: CREATED
    contract AddressWhitelist (matic:0x0f79d0039956D58a7d5d006a6Dd64a35616Aa2c6) [uma/AddressWhitelist]
    +++ description: Owner-managed address whitelist. Other contracts can query whether an address is listed; the whitelist itself does not assign a meaning to the listed addresses.
```

```diff
+   Status: CREATED
    contract BinaryModule (matic:0x1000008dD9001B968442c1000017eaE6E0dA00Ba) [polymarket/BinaryModule]
    +++ description: Upgradeable outcome module for two-sided markets. Split, merge and redemption functions have no caller restriction. Bridge-role holders can mint positions without collateral backing, while resolver-role holders can report results directly, bypassing the oracle path; admins can pause reporting by a resolver or for a condition.
```

```diff
+   Status: CREATED
    contract FeeReceiverSafe (matic:0x115F48DC2A731aA16251c6d6e1BEfC42f92Accc9) [GnosisSafe]
    +++ description: None
```

```diff
+   Status: CREATED
    contract NegRiskModule (matic:0x200000900045e3B6259600682756002200028933) [polymarket/NegRiskModule]
    +++ description: Upgradeable outcome module for multi-outcome (negative-risk) markets. Split, merge, redemption and event-level conversion functions have no caller restriction. Bridge-role holders can mint positions without collateral backing, while resolver-role holders can report results directly, bypassing the oracle path; admins can pause reporting by a resolver or for a condition.
```

```diff
+   Status: CREATED
    contract USD Coin (PoS) Token (matic:0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174) [N/A]
    +++ description: None
```

```diff
+   Status: CREATED
    contract CollateralOfframp (matic:0x2957922Eb93258b93368531d39fAcCA3B4dC5854) [polymarket/CollateralOfframp]
    +++ description: Lets anyone burn collateral tokens and release an equal amount of a supported asset from the configured collateral token's vault while that asset is not paused. Admins can pause or unpause unwrapping per asset with no delay.
```

```diff
+   Status: CREATED
    contract ManagedOptimisticOracleV2 (matic:0x2C0367a9DB231dDeBd88a94b4f6461a6e47C58B1) [uma/ManagedOptimisticOracleV2]
    +++ description: Managed variant of the UMA Optimistic Oracle V2 that acts as an escalation layer before UMA's DVM. Only whitelisted requesters can create price requests. Both the proposal submitter and credited proposer must pass the effective proposer whitelist, which can be overridden per request. Anyone can dispute an active proposal by posting the required bond, but only a resolver-role holder can settle the request. The proposal liveness defaults to 2h, with a minimum dispute window of 5m. Because settlement is permissioned, a proposal that outlives its liveness window does not become final on its own and can still be disputed until a resolver settles it. Roles (OpenZeppelin AccessControl): the default admin can upgrade the contract and manage the config admin role; the config admin sets the requester and default proposer whitelists, the default liveness, the minimum dispute window and the allowed bond ranges, and manages request managers; request managers set per-request proposer whitelists, bonds and liveness; the self-governing resolver admin manages resolvers.
```

```diff
+   Status: CREATED
    contract CombinatorialModule (matic:0x30000034706C7d8e12009DAB006Be20000c031A8) [polymarket/CombinatorialModule]
    +++ description: Upgradeable outcome module for combinatorial positions built from legs of other modules; payouts derive from the legs' resolved payouts. Position preparation, transformation and redemption functions have no caller restriction. Bridge-role holders can mint positions without collateral backing.
```

```diff
+   Status: CREATED
    contract WrappedCollateral (matic:0x3A3BD7bb9528E159577F7C2e685CC81A765002E2) [polymarket/WrappedCollateral]
    +++ description: ERC20 wrapper around an immutable underlying token. Its immutable owner is the deployer. Anyone can burn their wrapper units to send an equal amount of underlying to any recipient; only the owner can wrap, mint without depositing underlying, burn its own units, and release underlying held by the contract.
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
    +++ description: Initializable wallet whose initialize() function assigns its caller as owner while the owner slot is still empty. The stored owner can execute batches of arbitrary calls or delegatecalls; delegatecalls run in the wallet's context and can modify its storage, including the owner slot.
```

```diff
+   Status: CREATED
    contract Timelock (matic:0x47EbFAC3353314C788B96CDCbf41daadfE03629C) [polymarket/Timelock]
    +++ description: Timelock with enumerable roles: proposers queue batches with a delay of at least 12h and executors run them once it elapses. Role grants are not delayed, so an admin can install new proposers, executors or cancellers instantly.
```

```diff
+   Status: CREATED
    contract ConditionalTokens (matic:0x4D97DCd97eC945f40cF65F87097ACe5EA0476045) [polymarket/ConditionalTokens]
    +++ description: Immutable, adminless ERC1155 ledger of conditional outcome tokens: anyone can split collateral into a complete outcome set, merge it back, or redeem after resolution. Only the oracle named at preparation can report payouts, and reports are write-once.
```

```diff
+   Status: CREATED
    contract DepositWallet (matic:0x58CA52ebe0DadfdF531Cde7062e76746de4Db1eB) [polymarket/DepositWallet]
    +++ description: Smart-wallet implementation for factory-deployed proxies. Only the configured factory can submit call batches, which require an EIP-712 signature from the owner or an unexpired session signer. The owner can pause the wallet and, after the factory-configured delay, withdraw assets and revoke token approvals.
```

```diff
+   Status: CREATED
    contract UmaCtfAdapterBinary (matic:0x65070BE91477460D8A7AeEb94ef92fe056C2f2A7) [polymarket/UmaCtfAdapter]
    +++ description: Resolution adapter registering market questions with an UMA optimistic oracle and reporting settled answers to the outcome-token ledger. Anyone can call initialize, but the adapter is the requester seen by the oracle, and the oracle's own access controls determine who may propose and settle the answer. After the oracle has settled an answer, anyone can call resolve to copy it into the outcome-token ledger unless an admin has paused the question. Admins can pause, unpause, reset or flag initialized questions, unflag them until the safety period has passed, and after 1h manually resolve a flagged question with either outcome or an even split.
```

```diff
+   Status: CREATED
    contract NegRiskOperator (matic:0x661992aebf6BecF7BA5abB66f6b0Bf62Aa7a2E93) [polymarket/NegRiskOperator]
    +++ description: Permissioned operator between the resolution adapter and the multi-outcome adapter. Anyone can finalize an unflagged reported question after 0s; admins can flag or unflag a question and force an outcome of their choosing after the same delay. This implementation hardcodes the delay to zero, so it enforces no waiting time after reporting or flagging.
```

```diff
+   Status: CREATED
    contract UmaCtfAdapterNegRisk (matic:0x69c47De9D4D3Dad79590d61b9e05918E03775f24) [polymarket/UmaCtfAdapter]
    +++ description: Resolution adapter registering market questions with an UMA optimistic oracle and reporting settled answers to the outcome-token ledger. Anyone can call initialize, but the adapter is the requester seen by the oracle, and the oracle's own access controls determine who may propose and settle the answer. After the oracle has settled an answer, anyone can call resolve to copy it into the outcome-token ledger unless an admin has paused the question. Admins can pause, unpause, reset or flag initialized questions, unflag them until the safety period has passed, and after 1h manually resolve a flagged question with either outcome or an even split.
```

```diff
+   Status: CREATED
    contract UmaCtfAdapterLegacy (matic:0x6A9D222616C90FcA5754cd1333cFD9b7fb6a4F74) [polymarket/UmaCtfAdapterLegacy]
    +++ description: Resolution adapter registering binary questions with an UMA optimistic oracle and reporting settled answers to an outcome-token ledger. Anyone can initialize a question and resolve it when an oracle price is available unless an admin has paused it. Admins can pause, unpause, reset or flag initialized questions. A flagged question cannot be unflagged and, after 2d, can be resolved by an admin with any two-value payout array that is not all zeroes.
```

```diff
+   Status: CREATED
    contract GnosisSafeL2 (matic:0x6ee4D971142afadEa1828445124D6137080B4146) [GnosisSafe]
    +++ description: None
```

```diff
+   Status: CREATED
    contract DepositWalletBeacon (matic:0x7A18EDfe055488A3128f01F563e5B479D92ffc3a) [polymarket/DepositWalletBeacon]
    +++ description: Beacon with an owner-controlled default wallet implementation and per-caller implementation pins. Its owner can replace the default implementation in one transaction; callers can pin themselves to the current default and later rejoin default upgrades.
```

```diff
+   Status: CREATED
    contract NegRiskFeeVault (matic:0x7f67327E88c258932D7d8f72950bE0d46975E11D) [polymarket/NegRiskFeeVault]
    +++ description: Vault that can hold arbitrary ERC20 and ERC1155 tokens. Admins can transfer any balance to any recipient at any time, with no delay.
```

```diff
+   Status: CREATED
    contract SafeL2 (matic:0x7FB4492Ff58E4326a99D7d4F66aE1f47c8286Fc6) [GnosisSafe]
    +++ description: None
```

```diff
+   Status: CREATED
    contract CollateralOnramp (matic:0x93070a847efEf7F70739046A929D47a521F5B8ee) [polymarket/CollateralOnramp]
    +++ description: Lets anyone deposit an asset supported by the configured collateral token and mint an equal amount of collateral tokens while that asset is not paused. Admins can pause or unpause wrapping per asset with no delay.
```

```diff
+   Status: CREATED
    contract AddressWhitelist (matic:0x9F35885CE8f67a942D7B2f4Fbf937987DA08c463) [uma/AddressWhitelist]
    +++ description: Owner-managed address whitelist. Other contracts can query whether an address is listed; the whitelist itself does not assign a meaning to the listed addresses.
```

```diff
+   Status: CREATED
    contract AutoRedeemer (matic:0xa1200000d0002264C9a1698e001292D00E1b00af) [polymarket/AutoRedeemer]
    +++ description: Upgradeable helper that batch-redeems resolved positions for users who approved it on the relevant ERC1155 ledger. Operator-role holders choose which approved positions to redeem and when, but the current implementation always sends proceeds to the position owner.
```

```diff
+   Status: CREATED
    EOA  (matic:0xA49e1a819c856162D87100cF20E63062e87c0E84)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SafeProxyFactory (matic:0xaacFeEa03eb1561C4e67d661e40682Bd20E3541b) [polymarket/SafeProxyFactory]
    +++ description: Deterministic factory for single-owner Safe proxies. Anyone can submit an EIP-712 creation signature to deploy a wallet owned by the recovered signer at an address derived from that signer.
```

```diff
+   Status: CREATED
    contract ProxyWalletFactory (matic:0xaB45c5A4B0c941a2F231C04C3f49182e1A254052) [polymarket/ProxyWalletFactory]
    +++ description: Deterministic factory that associates each effective caller with one minimal-proxy wallet and forwards batched calls to it. The constructor deploys and stores the wallet implementation, with no direct setter. The owner can replace the gas-relay module, whose code executes by delegatecall and can modify factory storage.
```

```diff
+   Status: CREATED
    contract OperationsAccount (matic:0xAC9930b2AE455a671b62dE86876A7e8587825294) [N/A]
    +++ description: None
```

```diff
+   Status: CREATED
    contract CtfCollateralAdapter (matic:0xADa100874d00e3331D00F2007a9c336a65009718) [polymarket/CtfCollateralAdapter]
    +++ description: Adapter letting anyone split wrapped collateral into outcome positions, merge, or redeem on the conditional-token ledger while the underlying asset is not paused. It unwraps and re-wraps in the same call and cannot redirect funds to third parties. Admins can pause or unpause all operations, including redemptions, per asset with no delay.
```

```diff
+   Status: CREATED
    contract CtfCollateralAdapter2 (matic:0xAdA100Db00Ca00073811820692005400218FcE1f) [polymarket/CtfCollateralAdapter]
    +++ description: Adapter letting anyone split wrapped collateral into outcome positions, merge, or redeem on the conditional-token ledger while the underlying asset is not paused. It unwraps and re-wraps in the same call and cannot redirect funds to third parties. Admins can pause or unpause all operations, including redemptions, per asset with no delay.
```

```diff
+   Status: CREATED
    contract NegRiskCtfCollateralAdapter (matic:0xAdA200001000ef00D07553cEE7006808F895c6F1) [polymarket/NegRiskCtfCollateralAdapter]
    +++ description: Adapter letting anyone split, merge, redeem or convert wrapped collateral into multi-outcome positions while the underlying asset is not paused. It unwraps and re-wraps in the same call and cannot redirect funds to third parties. Admins can pause or unpause all operations, including redemptions, per asset with no delay.
```

```diff
+   Status: CREATED
    contract NegRiskCtfCollateralAdapter2 (matic:0xadA2005600Dec949baf300f4C6120000bDB6eAab) [polymarket/NegRiskCtfCollateralAdapter]
    +++ description: Adapter letting anyone split, merge, redeem or convert wrapped collateral into multi-outcome positions while the underlying asset is not paused. It unwraps and re-wraps in the same call and cannot redirect funds to third parties. Admins can pause or unpause all operations, including redemptions, per asset with no delay.
```

```diff
+   Status: CREATED
    contract ProxyWallet (matic:0xB7B9D7c6627714523F2Bf612Ef8AE17Fc77A19D0) [polymarket/ProxyWallet]
    +++ description: Initializable wallet whose initialize() function assigns its caller as owner while the owner slot is still empty. The stored owner can execute batches of arbitrary calls or delegatecalls; delegatecalls run in the wallet's context and can modify its storage, including the owner slot.
```

```diff
+   Status: CREATED
    contract CollateralToken (matic:0xC011a7E12a19f7B1f670d46F03B03f3342E82DFB) [polymarket/CollateralToken]
    +++ description: Upgradeable ERC20 (pUSD) that wraps either of two immutable supported assets one-for-one, transferring deposits to an immutable vault. Wrapper-role holders can wrap and unwrap; minter-role holders can mint without depositing an asset and burn their own balance.
```

```diff
+   Status: CREATED
    contract GnosisSafeL2 (matic:0xC193b33ff5E8A68F422a5d36A2dEf1D196b15160) [N/A]
    +++ description: None
```

```diff
+   Status: CREATED
    contract CollateralVault (matic:0xC417fD8E9661c0d2120B64a04Bb3278C17E99DB1) [polymarket/CollateralVault]
    +++ description: Upgradeable ERC-4337 single-owner smart account. Its owner can execute arbitrary calls, install or uninstall plugins, and upgrade the implementation, giving it full control over any assets held by the account.
```

```diff
+   Status: CREATED
    contract NegRiskAdapter (matic:0xd91E80cF2E7be2e162c6513ceD06f1dD0dA35296) [polymarket/NegRiskAdapter]
    +++ description: Immutable adapter composing binary conditions into multi-outcome (negative-risk) markets and acting as the on-ledger oracle for them. Split, merge, redeem and conversion functions have no caller restriction; conversions can charge a per-market fee that accrues to a fixed vault.
```

```diff
+   Status: CREATED
    contract CTFExchange (matic:0xE111180000d2663C0091e4f400237545B87B996B) [polymarket/CTFExchange]
    +++ description: Exchange settling EIP-712 signed limit orders that are matched off-chain by operator-role holders, who also choose the fee on each fill. The fee is not part of the signed order and is checked against an admin-configurable rate limit, currently 0 bps. A zero rate means fees have no percentage cap, not that fees are zero: an operator can charge up to all proceeds on a sell or collect an additional amount from a buyer, subject to the buyer's balance and allowance. Users can pause settlement of all their orders, effective after 100 blocks, an interval the admins can change.
```

```diff
+   Status: CREATED
    contract CompatibilityFallbackHandler (matic:0xe16bA5bF81E5BB113e4752E4fdC20351d796fB24) [N/A]
    +++ description: None
```

```diff
+   Status: CREATED
    contract NegRiskCtfExchange (matic:0xe2222d279d744050d28e00520010520000310F59) [polymarket/CTFExchange]
    +++ description: Exchange settling EIP-712 signed limit orders that are matched off-chain by operator-role holders, who also choose the fee on each fill. The fee is not part of the signed order and is checked against an admin-configurable rate limit, currently 0 bps. A zero rate means fees have no percentage cap, not that fees are zero: an operator can charge up to all proceeds on a sell or collect an additional amount from a buyer, subject to the buyer's balance and allowance. Users can pause settlement of all their orders, effective after 100 blocks, an interval the admins can change.
```

```diff
+   Status: CREATED
    contract CombosExchange (matic:0xe3333700cA9d93003F00f0F71f8515005F6c00Aa) [polymarket/CombosExchange]
    +++ description: Upgradeable request-for-quote exchange where operator-role holders settle EIP-712 signed orders for combination positions. Operators supply the fee on each fill; it is not part of the signed order and is checked only against a global limit of 1000 bps fixed at deployment. A zero limit means fees have no percentage cap, not that fees are zero: an operator can charge up to all proceeds on a sell or collect an additional amount from a buyer, subject to the buyer's balance and allowance.
```

```diff
+   Status: CREATED
    contract GnosisSafeL2 (matic:0xE51abdf814f8854941b9Fe8e3A4F65CAB4e7A4a8) [N/A]
    +++ description: None
```

```diff
+   Status: CREATED
    contract PermissionedRamp (matic:0xebC2459Ec962869ca4c0bd1E06368272732BCb08) [polymarket/PermissionedRamp]
    +++ description: Wrap/unwrap entrypoint for the collateral token that additionally requires an EIP-712 signature from a witness-role holder. Admins can pause or unpause both directions for an asset with no delay.
```

```diff
+   Status: CREATED
    contract OptimisticOracleV2 (matic:0xeE3Afe347D5C74317041E2618C49534dAf887c24) [uma/OptimisticOracleV2]
    +++ description: Standard UMA Optimistic Oracle V2 with no caller allowlist. Anyone can request a price using a supported identifier and collateral, propose an answer by posting a bond, or dispute a proposal within its liveness window (2h by default, customizable per request). Undisputed proposals become final and settleable once the liveness window has passed, while disputes are escalated to UMA's DVM, where UMA token holders vote on the outcome and the loser's bond is partly awarded to the winner.
```

```diff
+   Status: CREATED
    contract DepositWallet (matic:0xf7f27C29e60fe6325beF8dA7F93250353d2e3294) [polymarket/DepositWallet]
    +++ description: Smart-wallet implementation for factory-deployed proxies. Only the configured factory can submit call batches, which require an EIP-712 signature from the owner or an unexpired session signer. The owner can pause the wallet and, after the factory-configured delay, withdraw assets and revoke token approvals.
```
