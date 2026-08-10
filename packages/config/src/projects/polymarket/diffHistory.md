Generated with discovered.json: 0x2311d9e486dcf881d39230429b396e4108d1a772

# Diff at Tue, 11 Aug 2026 08:16:13 GMT:

- author: vincfurc (<vincfurc@users.noreply.github.com>)
- current timestamp: 1785484385

## Description

Discovery rerun on the same block number with only config-related changes.

## Initial discovery

```diff
+   Status: CREATED
    contract DepositWalletFactory (matic:0x00000000000Fb5C9ADea0298D729A0CB3823Cc07) [polymarket/DepositWalletFactory]
    +++ description: Upgradeable CREATE2 factory deploying per-user smart wallets at deterministic addresses and relaying owner-signed call batches to them; both paths are restricted to operator-role holders. Admins set the 1h delay that wallet owners must wait after pausing before withdrawals unlock.
```

```diff
+   Status: CREATED
    contract PositionManager (matic:0x006F54F7f9A22e0000CC2AB60031000000ae9fEF) [polymarket/PositionManager]
    +++ description: Upgradeable ERC1155 ledger of combination-outcome positions, mintable and burnable only by the outcome module registered for each position or a cross-authorised module. Admins register modules, which grants them mint and burn power over the ledger.
```

```diff
+   Status: CREATED
    contract AddressWhitelist (matic:0x0f79d0039956D58a7d5d006a6Dd64a35616Aa2c6) [uma/AddressWhitelist]
    +++ description: A simple address whitelist for tokens that can be used as bonds and/or fees. This whitelist is checked and enforced by various smart contracts in the UMA ecosystem.
```

```diff
+   Status: CREATED
    contract BinaryModule (matic:0x1000008dD9001B968442c1000017eaE6E0dA00Ba) [polymarket/BinaryModule]
    +++ description: Upgradeable outcome module for two-sided markets: anyone can split collateral into outcome positions, merge them back, or redeem resolved ones. Bridge-role holders can mint positions without collateral backing, and resolver-role holders can report results directly, bypassing the oracle path.
```

```diff
+   Status: CREATED
    contract FeeReceiverSafe (matic:0x115F48DC2A731aA16251c6d6e1BEfC42f92Accc9) [GnosisSafe]
    +++ description: None
```

```diff
+   Status: CREATED
    contract NegRiskModule (matic:0x200000900045e3B6259600682756002200028933) [polymarket/NegRiskModule]
    +++ description: Upgradeable outcome module for multi-outcome (negative-risk) markets: split, merge, redeem and event-level conversions are permissionless. Bridge-role holders can mint positions without collateral backing, and resolver-role holders can report results directly, bypassing the oracle path.
```

```diff
+   Status: CREATED
    contract USD Coin (PoS) Token (matic:0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174) [N/A]
    +++ description: None
```

```diff
+   Status: CREATED
    contract CollateralOfframp (matic:0x2957922Eb93258b93368531d39fAcCA3B4dC5854) [polymarket/CollateralOfframp]
    +++ description: Permissionless unwrap entrypoint: anyone can burn collateral tokens and have the underlying stablecoin released from the vault. Admins can pause unwrapping per asset with no delay.
```

```diff
+   Status: CREATED
    contract ManagedOptimisticOracleV2 (matic:0x2C0367a9DB231dDeBd88a94b4f6461a6e47C58B1) [uma/ManagedOptimisticOracleV2]
    +++ description: Managed (permissioned) variant of the UMA Optimistic Oracle V2 that acts as an escalation layer before UMA's DVM. Price requests are restricted to a requester whitelist and proposals to a proposer whitelist. A proposal can be disputed during its liveness window (default 2h, with a minimum dispute window of 5m), and settlement is restricted to the resolver role. Because settlement is permissioned, a proposal that outlives its liveness window does not become final on its own and can still be disputed until a resolver settles it. Roles (OpenZeppelin AccessControl): the default admin can upgrade the contract and manage the config admin role; the config admin sets the requester and proposer whitelists, the default liveness, the minimum dispute window and the allowed bond ranges, and manages request managers; request managers set per-request proposer whitelists, bonds and liveness; the self-governing resolver admin manages resolvers.
```

```diff
+   Status: CREATED
    contract CombinatorialModule (matic:0x30000034706C7d8e12009DAB006Be20000c031A8) [polymarket/CombinatorialModule]
    +++ description: Upgradeable outcome module for combinatorial positions built from legs of other modules; payouts derive from the legs' resolved payouts. All operations are permissionless, and bridge-role holders can mint positions without collateral backing.
```

```diff
+   Status: CREATED
    contract WrappedCollateral (matic:0x3A3BD7bb9528E159577F7C2e685CC81A765002E2) [polymarket/WrappedCollateral]
    +++ description: ERC20 wrapper around an underlying token, owned by the single adapter that deployed it. Anyone can unwrap; only the owner can wrap, mint without backing, and release the underlying held here to any recipient.
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
    +++ description: Per-user proxy wallet implementation cloned by its factory; only the owner set at initialization can execute batches of arbitrary calls through it.
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
    +++ description: Per-user smart wallet implementation shared through a beacon: every call batch needs the owner's (or a time-limited session signer's) EIP-712 signature, and direct withdrawals are owner-only and unlock only while the wallet is paused. The beacon owner can replace every wallet's code at once; owners can opt out by pinning the current implementation.
```

```diff
+   Status: CREATED
    contract UmaCtfAdapterBinary (matic:0x65070BE91477460D8A7AeEb94ef92fe056C2f2A7) [polymarket/UmaCtfAdapter]
    +++ description: Resolution adapter registering market questions with an UMA optimistic oracle and reporting settled answers to the outcome-token ledger; initializing and resolving are permissionless. Admins can pause or reset any question, and can flag one and resolve it manually with an outcome of their choosing after 1h.
```

```diff
+   Status: CREATED
    contract NegRiskOperator (matic:0x661992aebf6BecF7BA5abB66f6b0Bf62Aa7a2E93) [polymarket/NegRiskOperator]
    +++ description: Permissioned operator between the resolution adapter and the multi-outcome adapter. Anyone can finalize a reported question after 0s; admins can flag a question and force an outcome of their choosing after the same delay - currently zero, so both can happen in one transaction.
```

```diff
+   Status: CREATED
    contract UmaCtfAdapterNegRisk (matic:0x69c47De9D4D3Dad79590d61b9e05918E03775f24) [polymarket/UmaCtfAdapter]
    +++ description: Resolution adapter registering market questions with an UMA optimistic oracle and reporting settled answers to the outcome-token ledger; initializing and resolving are permissionless. Admins can pause or reset any question, and can flag one and resolve it manually with an outcome of their choosing after 1h.
```

```diff
+   Status: CREATED
    contract UmaCtfAdapterLegacy (matic:0x6A9D222616C90FcA5754cd1333cFD9b7fb6a4F74) [polymarket/UmaCtfAdapterLegacy]
    +++ description: Earlier generation of the resolution adapter, still holding legacy markets. Admins can flag a question - with no way to unflag - and after 2d resolve it with an arbitrary payout array.
```

```diff
+   Status: CREATED
    contract GnosisSafeL2 (matic:0x6ee4D971142afadEa1828445124D6137080B4146) [GnosisSafe]
    +++ description: None
```

```diff
+   Status: CREATED
    contract DepositWalletBeacon (matic:0x7A18EDfe055488A3128f01F563e5B479D92ffc3a) [polymarket/DepositWalletBeacon]
    +++ description: Beacon holding the implementation pointer for every wallet deployed by the wallet factory. Its owner can replace the implementation of all of them in one transaction; individual wallets can opt out by pinning the current implementation.
```

```diff
+   Status: CREATED
    contract NegRiskFeeVault (matic:0x7f67327E88c258932D7d8f72950bE0d46975E11D) [polymarket/NegRiskFeeVault]
    +++ description: Vault holding accrued protocol fees. Admins can transfer out any ERC20 or ERC1155 balance to any recipient at any time, with no delay.
```

```diff
+   Status: CREATED
    contract SafeL2 (matic:0x7FB4492Ff58E4326a99D7d4F66aE1f47c8286Fc6) [GnosisSafe]
    +++ description: None
```

```diff
+   Status: CREATED
    contract CollateralOnramp (matic:0x93070a847efEf7F70739046A929D47a521F5B8ee) [polymarket/CollateralOnramp]
    +++ description: Permissionless wrap entrypoint: anyone can deposit the underlying stablecoin and mint an equal amount of the collateral token. Admins can pause wrapping per asset with no delay.
```

```diff
+   Status: CREATED
    contract AddressWhitelist (matic:0x9F35885CE8f67a942D7B2f4Fbf937987DA08c463) [uma/AddressWhitelist]
    +++ description: A simple address whitelist for tokens that can be used as bonds and/or fees. This whitelist is checked and enforced by various smart contracts in the UMA ecosystem.
```

```diff
+   Status: CREATED
    contract AutoRedeemer (matic:0xa1200000d0002264C9a1698e001292D00E1b00af) [polymarket/AutoRedeemer]
    +++ description: Upgradeable helper that batch-redeems resolved positions for users who opted in by granting it an ERC1155 approval. Operator-role holders only choose when redemption happens; proceeds always go to the position owner and the contract cannot redirect funds.
```

```diff
+   Status: CREATED
    EOA  (matic:0xA49e1a819c856162D87100cF20E63062e87c0E84)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SafeProxyFactory (matic:0xaacFeEa03eb1561C4e67d661e40682Bd20E3541b) [polymarket/SafeProxyFactory]
    +++ description: Deterministic factory for single-owner smart-contract wallets: anyone can deploy a wallet for a signer from an EIP-712 signature, at an address derived from the signer's address. The settlement exchanges use the same derivation to validate wallet-owner signatures.
```

```diff
+   Status: CREATED
    contract ProxyWalletFactory (matic:0xaB45c5A4B0c941a2F231C04C3f49182e1A254052) [polymarket/ProxyWalletFactory]
    +++ description: Deterministic factory deploying a minimal-proxy wallet per user and forwarding batched calls to it; the settlement exchanges use the same address derivation to validate wallet-owner signatures. Its owner can only replace the gas-relay module.
```

```diff
+   Status: CREATED
    contract OperationsAccount (matic:0xAC9930b2AE455a671b62dE86876A7e8587825294) [N/A]
    +++ description: None
```

```diff
+   Status: CREATED
    contract CtfCollateralAdapter (matic:0xADa100874d00e3331D00F2007a9c336a65009718) [polymarket/CtfCollateralAdapter]
    +++ description: Adapter letting anyone split wrapped collateral into outcome positions, merge, or redeem on the conditional-token ledger, unwrapping and re-wrapping in the same call; it cannot redirect funds to third parties. Admins can pause all operations, including redemptions, with no delay.
```

```diff
+   Status: CREATED
    contract CtfCollateralAdapter2 (matic:0xAdA100Db00Ca00073811820692005400218FcE1f) [polymarket/CtfCollateralAdapter]
    +++ description: Adapter letting anyone split wrapped collateral into outcome positions, merge, or redeem on the conditional-token ledger, unwrapping and re-wrapping in the same call; it cannot redirect funds to third parties. Admins can pause all operations, including redemptions, with no delay.
```

```diff
+   Status: CREATED
    contract NegRiskCtfCollateralAdapter (matic:0xAdA200001000ef00D07553cEE7006808F895c6F1) [polymarket/NegRiskCtfCollateralAdapter]
    +++ description: Adapter letting anyone split, merge, redeem or convert wrapped collateral into multi-outcome positions, unwrapping and re-wrapping in the same call; it cannot redirect funds to third parties. Admins can pause all operations, including redemptions, with no delay.
```

```diff
+   Status: CREATED
    contract NegRiskCtfCollateralAdapter2 (matic:0xadA2005600Dec949baf300f4C6120000bDB6eAab) [polymarket/NegRiskCtfCollateralAdapter]
    +++ description: Adapter letting anyone split, merge, redeem or convert wrapped collateral into multi-outcome positions, unwrapping and re-wrapping in the same call; it cannot redirect funds to third parties. Admins can pause all operations, including redemptions, with no delay.
```

```diff
+   Status: CREATED
    contract ProxyWallet (matic:0xB7B9D7c6627714523F2Bf612Ef8AE17Fc77A19D0) [polymarket/ProxyWallet]
    +++ description: Per-user proxy wallet implementation cloned by its factory; only the owner set at initialization can execute batches of arbitrary calls through it.
```

```diff
+   Status: CREATED
    contract CollateralToken (matic:0xC011a7E12a19f7B1f670d46F03B03f3342E82DFB) [polymarket/CollateralToken]
    +++ description: Upgradeable ERC20 (pUSD) wrapping a stablecoin one-for-one, with the underlying held in a separate vault. Wrapping and unwrapping are restricted to wrapper-role holders (the ramps and adapters), and minter-role holders can mint without any backing.
```

```diff
+   Status: CREATED
    contract GnosisSafeL2 (matic:0xC193b33ff5E8A68F422a5d36A2dEf1D196b15160) [N/A]
    +++ description: None
```

```diff
+   Status: CREATED
    contract CollateralVault (matic:0xC417fD8E9661c0d2120B64a04Bb3278C17E99DB1) [polymarket/CollateralVault]
    +++ description: ERC-4337 smart account holding the stablecoin that backs the collateral token. Its owner can execute arbitrary calls from the account, giving it full control over the held funds.
```

```diff
+   Status: CREATED
    contract NegRiskAdapter (matic:0xd91E80cF2E7be2e162c6513ceD06f1dD0dA35296) [polymarket/NegRiskAdapter]
    +++ description: Immutable adapter composing binary conditions into multi-outcome (negative-risk) markets and acting as the on-ledger oracle for them. Splitting, merging, redeeming and converting are permissionless; converting can charge a per-market fee that accrues to a fixed vault.
```

```diff
+   Status: CREATED
    contract CTFExchange (matic:0xE111180000d2663C0091e4f400237545B87B996B) [polymarket/CTFExchange]
    +++ description: Immutable exchange settling EIP-712 signed limit orders that are matched off-chain by operator-role holders, who also choose the fee on each fill. The fee is not part of the signed order and is bounded only by an admin-set maximum, currently 0 bps; a maximum of zero disables the check, so no on-chain ceiling applies. Users can pause their own orders, effective after 100 blocks.
```

```diff
+   Status: CREATED
    contract CompatibilityFallbackHandler (matic:0xe16bA5bF81E5BB113e4752E4fdC20351d796fB24) [N/A]
    +++ description: None
```

```diff
+   Status: CREATED
    contract NegRiskCtfExchange (matic:0xe2222d279d744050d28e00520010520000310F59) [polymarket/CTFExchange]
    +++ description: Immutable exchange settling EIP-712 signed limit orders that are matched off-chain by operator-role holders, who also choose the fee on each fill. The fee is not part of the signed order and is bounded only by an admin-set maximum, currently 0 bps; a maximum of zero disables the check, so no on-chain ceiling applies. Users can pause their own orders, effective after 100 blocks.
```

```diff
+   Status: CREATED
    contract CombosExchange (matic:0xe3333700cA9d93003F00f0F71f8515005F6c00Aa) [polymarket/CombosExchange]
    +++ description: Upgradeable request-for-quote exchange where operator-role holders settle EIP-712 signed orders for combination positions. The fee on each fill is bounded by the order's signed rate and a global maximum of 1000 bps fixed at deployment.
```

```diff
+   Status: CREATED
    contract GnosisSafeL2 (matic:0xE51abdf814f8854941b9Fe8e3A4F65CAB4e7A4a8) [N/A]
    +++ description: None
```

```diff
+   Status: CREATED
    contract PermissionedRamp (matic:0xebC2459Ec962869ca4c0bd1E06368272732BCb08) [polymarket/PermissionedRamp]
    +++ description: Wrap/unwrap entrypoint for the collateral token that additionally requires an EIP-712 signature from a witness-role holder. Admins can pause either direction per asset with no delay.
```

```diff
+   Status: CREATED
    contract OptimisticOracleV2 (matic:0xeE3Afe347D5C74317041E2618C49534dAf887c24) [uma/OptimisticOracleV2]
    +++ description: Standard permissionless UMA Optimistic Oracle V2. Anyone can request a price for a registered identifier, anyone can propose an answer by posting a bond, and anyone can dispute a proposal within its liveness window (2h by default, customizable per request). Undisputed proposals become final and settleable once the liveness window has passed, while disputes are escalated to UMA's DVM, where UMA token holders vote on the outcome and the loser's bond is partly awarded to the winner.
```

```diff
+   Status: CREATED
    contract DepositWallet (matic:0xf7f27C29e60fe6325beF8dA7F93250353d2e3294) [polymarket/DepositWallet]
    +++ description: Per-user smart wallet implementation shared through a beacon: every call batch needs the owner's (or a time-limited session signer's) EIP-712 signature, and direct withdrawals are owner-only and unlock only while the wallet is paused. The beacon owner can replace every wallet's code at once; owners can opt out by pinning the current implementation.
```
