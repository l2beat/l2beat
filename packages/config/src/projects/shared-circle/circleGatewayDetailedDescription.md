# Architecture
[Circle Gateway](https://developers.circle.com/gateway) is a chain-abstraction layer for USDC: users deposit native USDC into `GatewayWallet` contracts on supported source chains and Circle's Gateway system tracks those deposits as an offchain unified balance. The user can spend against the aggregate balance on any supported destination chain.

# Crosschain Oracle and validation
A user deposits through `GatewayWallet`. To spend the unified balance, the user signs one or more `BurnIntent` payloads specifying source and destination domains, token, recipient, amount, fee cap, expiry, and optional hook data. On the destination chain, anyone can call `GatewayMinter.gatewayMint` with the attestation payload and a signature from a configured Gateway attestation signer; `GatewayMinter` mints USDC to the destination recipient. On the source chain, `GatewayWallet` validates the signed burn intent, deducts the user's available or withdrawing balance, collects fees, and burns the corresponding USDC (this happens after the mint at the destination!). The Ethereum `GatewayWallet` and `GatewayMinter` use {{gatewayWalletSignerCount}} burn signer on `GatewayWallet` and {{gatewayMinterSignerCount}} attestation signer on `GatewayMinter`.

# Withdrawal self-service
If the Circle API is unavailable, users can use an onchain two-step withdrawal path; on Ethereum the discovered `withdrawalDelay` is {{gatewayWithdrawalDelayTime}}. This delay gives the Gateway system time to burn funds that may already have been minted elsewhere before the withdrawal completes.

# Upgradeability
Both Gateway contracts are proxies with owner/admin, pauser, denylister, signer-management, fee-recipient, and token-support roles; upgrade admins on Ethereum can replace implementations with no onchain delay.

# Monitoring
Circle does not provide a block explorer. There currently is no security, transparency or monitoring related tooling for CCTP or Gateway users.
