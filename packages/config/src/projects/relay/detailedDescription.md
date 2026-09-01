# Architecture

Relay is an intent-based, non-minting bridge and crosschain payments network with a deliberately minimal onchain footprint. Users request a quote from the centralized [Relay API](https://docs.relay.link/references/api/api_guides/bridging-integration-guide) and pay on the origin chain; a Relay solver then fills them on the destination chain from its own pre-positioned liquidity with a plain transfer, swap, or contract call. All order matching, pricing, and balance accounting happen offchain and on Relay-operated infrastructure — no contract on the origin or destination chain verifies any relationship between the user's payment and the solver's fill.

There are three origin-side payment paths. In the legacy flow, native tokens are sent to the `RelayReceiver`, which immediately forwards them to a solver address hardcoded at deployment and merely emits the order commitment as an event (ERC20s in this flow are transferred to the solver directly). In the router flow, the `RelayApprovalProxyV3` pulls user ERC20s (approvals, EIP-2612/ERC-3009 permits, or Permit2) into the stateless `RelayRouterV3`, which atomically executes the calls of the quote. In the settlement flow, funds are escrowed in the `RelayDepository` tagged with an order id — the contract keeps no balance accounting and only emits a deposit event.

# Crosschain validation and settlement

After filling, the solver asks the Relay Oracle — an offchain service run by Relay — to attest the origin deposit and destination fill. The attestation is submitted to an Oracle contract on the 'Relay Chain' (a Relay-operated sovereign EVM rollup posting data to Celestia), where a `Hub` contract credits the deposit to the solver's balance. Solvers replenish their capital by requesting a withdrawal from the `Allocator`, a contract on Aurora that uses NEAR's MPC 'chain signatures' network to produce a signed payload accepted by the `RelayDepository` on the target chain.

From the perspective of each deposit chain, this entire settlement stack reduces to a 1-of-1 trust assumption: `RelayDepository.execute()` performs arbitrary external calls authorized by a single signature from the registered `allocator` address — on Base a plain address without contract code — protected only by a nonce and an expiration. The claims that this key is threshold-MPC-managed, that withdrawals are bounded by solver balances on the Hub, and that a Security Council multisig on Aurora can suspend withdrawers, all live offchain or on other chains and are not verifiable or enforced by the Depository. Moreover, the Depository's `owner` — currently an EOA on Base — can replace the allocator at any time and without delay, taking direct control of all escrowed funds.

# Solvers

Filling is not permissionless: orders are filled by Relay-operated solver infrastructure, and withdrawal rights from the settlement protocol are granted by an `APPROVED_WITHDRAWER_ROLE` on the Aurora allocator. There is no onchain solver collateral or slashing; the user's destination outcome depends entirely on the solver filling correctly and quickly.

# User recovery

There is no onchain refund path in any of the three flows. Funds sent through the `RelayReceiver` or the router flow are with the solver in the same transaction, and funds escrowed in the `RelayDepository` can only leave via an allocator-signed call. Failed or unfillable orders depend on Relay's discretionary, oracle-attested refund process.

# Upgradeability and governance

None of the onchain contracts are proxies — the `RelayDepository`, `RelayReceiver`, `RelayRouterV3`, and `RelayApprovalProxyV3` are all immutable. This offers limited protection because the critical powers are held by keys rather than code: the Depository owner can swap the allocator (full control of the escrow), and the allocator key alone moves escrowed funds. The `RelayApprovalProxyV3` owner can only sweep funds stuck in that contract; user token approvals to it cannot be spent by the owner.

# Monitoring

Deposits emit events onchain (`RelayNativeDeposit`/`RelayErc20Deposit` in the Depository, `FundsForwardedWithData` in the RelayReceiver, `FundsMovement` in the router flow), but fills on the destination chain are ordinary transfers from solver liquidity and are not marked as protocol activity. Relay provides an [explorer](https://relay.link/transactions) and an [API](https://docs.relay.link/references/api/overview) for order tracking, and the Relay Chain acts as the protocol's crosschain accounting ledger.
