# Architecture
The Router is CCIP's main user entrypoint for sending and receiving crosschain messages. It selects an OnRamp for each destination and recognizes the OffRamps allowed to deliver messages from each source. CCIP 2.0 is being introduced route by route, so v2.0, v1.6 and older lane-specific ramps currently coexist.

This page analyzes contracts and permissions on Ethereum. A complete risk assessment must also review the corresponding contracts, token pools and governance on every source and destination chain: a remote-chain misconfiguration or compromise can cause losses on Ethereum. Chainlink currently lists [more than 70 supported chains](https://docs.chain.link/ccip/directory/mainnet).

# v2.0 Architecture
The v2.0 OnRamp accepts messages only from the Router configured for their destination. It obtains token pools from the TokenAdminRegistry, locks or burns at most one token, selects the message's cross-chain verifiers (CCVs) and executor, prices their work through the FeeQuoter and emits the message for verification and delivery. Messages can also specify their required finality.

Each directional route has default CCVs and can additionally have lane-mandated CCVs. Defaults are fallbacks rather than an unconditional verifier floor, while lane-mandated CCVs are always required and cannot be removed by the sender, token pool or receiver.

A v2-compatible token pool can require its own CCVs. A pool without custom requirements uses the route defaults, while custom pool CCVs can replace that fallback. For token-only transfers, the pool determines the token-specific verification policy. When a receiver is called, its verifier policy is also enforced. The destination OffRamp independently derives and enforces the complete required set from the route, token pool and receiver policies.

At the tracked block, all 13 source and destination routes configured on Ethereum's v2 ramps have empty lane-mandated CCV lists. Every route instead has the same CommitteeVerifier resolver as its sole default CCV.

A finality request selects exactly one mode: full finality, the chain's safe head, or an explicit block depth. Full finality is always accepted, while each verifier, pool and executor declares which faster modes it accepts.

Execution on the v2.0 OffRamp is immediately permissionless. The OffRamp validates the source route, source OnRamp, destination address and RMN curse status, then requires the CCVs selected by the route, receiver and token pool to verify the message before tokens are released or minted and the receiver is called. Failed messages can be retried, while successful messages cannot be replayed.

The default CCV is a VersionedVerifierResolver backed by a CommitteeVerifier. The resolver allows verifier implementations to change while routes retain a stable CCV address. The CommitteeVerifier requires 9 signatures for each configured source chain, generally from a set of 16 signers, and can additionally enforce sender allowlists and finality constraints. The selected Executor sets the fee policy for automated delivery; it is not an authorization gate for the permissionless OffRamp.

USDC uses a registered routing pool with four owner-configurable children: Circle CCTP v1, Circle CCTP v2, CCTP v2 through a USDC-specific CCV, and siloed lock/release. If the CCV mechanism is selected, a pure token transfer can use the USDC CCTP resolver instead of the default Committee resolver. At the tracked block, however, every configured route selects either CCTP v1 or lock/release; none selects the CCTP v2 or CCV child. The lock/release routes each use a distinct custody lockbox. The USDC CCV resolver retains two inbound verifier versions for in-flight compatibility and selects its newer implementation for every configured outbound route.

# v1.6 Architecture
In v1.6, messages are validated by a fixed OCR signer set, currently equivalent to a {{ocrCommitQuorum}}/{{ocrCommitN}} multisig on Ethereum. The OnRamp prices messages through the FeeQuoter, fetches token pools through the TokenAdminRegistry, supports multiple tokens per message and can enforce sender or content filters. A shared NonceManager preserves ordered-message nonces across lanes and ramp migrations.

The v1.6 OffRamp uses a two-stage pipeline. First, the commit OCR network signs reports that store Merkle roots and price updates. The execution OCR network then submits messages with proofs against those roots. Tokens are released or minted through their pools before the Router calls the receiver. Permissioned execution transmitters normally relay messages; after {{permissionLessExecutionThresholdFmt}}, anyone can execute a committed message, and failed messages can be retried manually.

# Verification and governance updates
The v1.6 commit OCR set corresponds to a {{ocrCommitQuorum}}/{{ocrCommitN}} multisig on Ethereum. The OffRamp owner can replace its signer threshold, signers and transmitters.

In v2.0, the owner instead controls the OnRamp and OffRamp route configuration, default and mandatory CCVs, resolver mappings, CommitteeVerifier signer sets and thresholds, finality policy and Executor endpoint. The Executor endpoint's target is replaceable. These controls can change the verification and delivery policy for affected routes; see the Permissions section for their governing timelocks and multisigs.

# Token pools
Pools either lock or burn tokens on the source chain and release or mint them on the destination chain. They can be managed by Chainlink or by the token issuer and can have independent governance. Some pools implement crosschain rate limits. In v2.0, compatible pools can also select required CCVs, finality constraints, token-specific arguments and fees. A complete assessment of a token must include every pool and ramp generation through which it can arrive.

The TokenPoolFactory is permissionless. It can deploy a burn/mint or lock/release pool, configure its remote peers and rate limits, and transfer ownership to the caller. When it also deploys the token, it registers the token and pool and initiates transfer of token ownership and TokenAdminRegistry administration to the caller.

# Fee estimation
The FeeQuoter holds per-destination parameters such as route enablement, maximum message size and gas limit, gas overheads, the per-byte gas rate, network fee and LINK fee discount. It also stores token and destination-gas prices without checking them for staleness. Permissioned callers update those prices, and any priced token is accepted as a fee token. In v2.0, the total quote also includes the selected verifiers, token pool and executor fees.

# Cursing
The Ethereum ARM proxy points to an RMN 2.1 contract that can apply a universal curse or target individual chain paths. Both ramp generations check curses as an emergency stop. On the tracked v1.6 routes, OCR validates message roots; in v2.0, the selected CCVs validate each message.

Two governance paths control curses. The RMN owner is the legacy RMN timelock and can curse or uncurse subjects and add or remove authorized curse callers. Separately, a zero-delay RBAC timelock is an authorized caller, so it can curse but cannot uncurse. This curse-only timelock is administered by the ARM timelock; proposing, cancelling and bypassing operations are each assigned to a 1-of-7 ManyChainMultiSig, while its executor proxy is permissionless. See the Permissions section for more details.

# v1.5 Architecture
While v1.6 and v2.0 share one ramp across many remote chains, v1.5 deploys one OnRamp and one OffRamp for each active path. Token pools can accept incoming messages from several ramp generations at once, so a complete token assessment must include every authorized OffRamp.

# Monitoring
Chainlink provides [an explorer](https://ccip.chain.link/) for crosschain transactions and a [directory](https://docs.chain.link/ccip/directory/mainnet) for registered OnRamps and OffRamps. These tools do not provide a complete view of the permissioned actors and configurable verification paths involved for each token.
