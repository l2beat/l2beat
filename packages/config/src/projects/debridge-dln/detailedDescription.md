# Architecture

The deBridge Liquidity Network (DLN) is an intent protocol built on top of the deBridge messaging protocol, sharing its validation layer and governance. Users (*makers*) create cross-chain orders by locking their *give* funds directly in the `DlnSource` contract on the source chain. On the destination chain, *takers* fulfill orders through the `DlnDestination` contract by paying the *take* amount, which is forwarded to the recipient within the same transaction, so `DlnDestination` holds no user funds. A protocol fee (currently {{fixedNativeFee}} ETH flat plus {{transferFeeBps}} bps on Ethereum, refunded on cancellation) is deducted from the give amount at order creation.

# Order lifecycle

Fulfillment is permissionless — anyone can fill any order unless the maker restricted it — and the filler names an *unlock authority* for the order. Only that unlock authority can later trigger the unlock, which sends a message back to the source chain's `DlnSource` through the `DeBridgeGate`. Once the deBridge validators attest the message, the escrowed give funds are released to the taker's chosen beneficiary.

# Crosschain validation

`DlnSource` releases escrowed funds only to calls from the deBridge `CallProxy` whose authenticated original sender is the `DlnDestination` address configured for the order's destination chain (an admin-set, event-tracked map currently routing to {{activeDestinationChains}} chains). The authenticity of that claim rests entirely on the deBridge validator set: a quorum of validator signatures (currently {{quorum}} on Ethereum) attests each unlock or cancellation message. A compromised validator quorum, or an admin change of the per-chain routing addresses, allows draining all order funds escrowed in `DlnSource`.

# User recovery

Unfilled orders can be cancelled from the destination chain by the maker-designated order authority, refunding the full escrow to the maker on the source chain. A `GOVERNANCE_DELEGATED_ORDER_CANCEL_ROLE` can force-cancel unfulfilled orders on behalf of makers, but refunds can only go to a maker-designated address, making it a liveness rather than a theft power. Fulfilled orders cannot be cancelled.

# External calls

Orders can carry calldata to be executed on the destination chain after fulfillment. In that case the taker's funds are routed to an `ExternalCallAdapter` escrow, which releases them when the registered executor contract runs the calldata or refunds the order authority on cancellation. The adapter is admin-replaceable in `DlnDestination`, so a malicious adapter could steal the funds of every order carrying calldata.

# Intents

A newer intent-manager stack automates order creation: users sign an EIP-712 *intent* offchain — the signature covers only an opaque 32-byte intent hash, so wallets cannot display the actual constraints — and permissionless fillers turn intents into DLN orders through the `DeBridgeIntentManager`. There is no signature nonce; an intent is multi-fill until its budget is exhausted, expired, cancelled or nullified. Input tokens are pulled through the `DeBridgeAllowanceHolder`, the single immutable contract holding all user approvals of the intent system: its transfer functions carry no intent-level checks, so any holder of its `ALLOWED_SPENDER_ROLE` can move any approved token from any approver to any recipient. All user protection lives in the constraints of the signed intent itself (price bounds, allowed senders, receivers, budgets); the fill fee is *not* part of the signed intent and is set by the intent manager admin.

# Upgradeability and governance

`DlnSource` (which escrows all in-flight maker funds), `DlnDestination` and the `ExternalCallAdapter` are upgradeable by the same {{multisigStats}} deBridge multisig that governs the messaging protocol, with no timelock or exit window. The multisig also holds the `DEFAULT_ADMIN_ROLE` on both DLN contracts, controlling the trusted cross-chain routing addresses, fees, the external call adapter, and unpausing. The intent-manager stack has a weaker setup: on Ethereum, a single EOA is simultaneously the admin of `DeBridgeIntentManager` and `DeBridgeAllowanceHolder` and the owner of the ProxyAdmin that can upgrade the intent manager — an upgrade there could abuse the allowance holder's spender role to drain all outstanding user approvals. Several satellite contracts have unverified source code.

# Monitoring

Order creation, fulfillment, unlock and cancellation all emit events, and the per-chain routing configuration is event-tracked. deBridge provides an [explorer](https://app.debridge.finance/explorer) (DLN trades are labeled as such) for tracking order flow.
