# Architecture

deBridge deploys a central `DeBridgeGate` contract on each supported chain. It combines an arbitrary message bridge and a lock-and-mint token bridge: on an asset's native chain, tokens are locked in the gate escrow; on all other chains, the gate mints and burns deBridge-wrapped tokens (*deTokens*). Optional calldata attached to a transfer is executed by a dedicated `CallProxy` contract, which performs the call from its own address to isolate it from the gate's balances. Asset listing on the native side is permissionless: sending any local ERC20 through the gate auto-registers it (with unlimited transfer caps and no elevated-confirmation threshold until the admin configures them).

# Message lifecycle

A `send()` or `sendMessage()` call locks or burns the asset and emits a *submission* whose ID commits to the bridged asset, source and destination chain IDs, amount, receiver, a gate-wide nonce and — if calldata is attached — the execution fee, flags, fallback address, calldata hash and original sender. The protocol charges a flat native-token fee (currently 0.001 ETH on Ethereum) plus a variable fee (currently 10 bps).

On the destination chain, claiming is permissionless, but depends on validator signatures: anyone can submit them for a submission ID to `claim()`, earning the optional execution fee as a relayer reward. Attached calldata is forwarded to the `CallProxy` together with the bridged funds.

# Crosschain validation

deBridge validators observe source chains offchain and sign submission IDs with plain ECDSA keys. The `SignatureVerifier` on the destination chain — callable only by the gate — accepts a submission if at least `minConfirmations` of the registered validator addresses have signed (currently 8 of 12 on Ethereum) and every validator flagged as *required* has signed (currently none is flagged).

Two additional rate limits exist in the code: transfers above a per-asset amount threshold require an elevated signature count, and a per-block circuit breaker raises the requirement once more than `confirmationThreshold` submissions are approved within one block. As currently configured on Ethereum, both elevated thresholds are set to 3 signatures — below the baseline quorum of 8 — and the per-asset amount thresholds are unset (max), so neither mechanism has any effect. Deploying a deToken for a new asset (`deployNewAsset`) is likewise permissionless but requires the same validator quorum over the asset's metadata.

# Wrapped tokens (deTokens)

deTokens are deployed on first use by the `DeBridgeTokenDeployer` (callable only by the gate) as beacon proxies at deterministic addresses. The beacon is the deployer contract itself: its admin can re-point the shared implementation of **all** deTokens on the chain in a single transaction that emits no event. Each deToken grants `MINTER_ROLE` to the gate and both `DEFAULT_ADMIN_ROLE` and `PAUSER_ROLE` to the configured `deBridgeTokenAdmin` (the deBridge multisig on Ethereum), which can therefore pause transfers of any deToken or grant additional minters — i.e. mint unbacked deTokens — without touching the bridge itself.

# Censorship and pausing

The gate admin can block (and unblock) individual submission IDs, permanently preventing specific already-signed transfers from being claimed, and can toggle entire chains as supported senders or receivers. Pausing is asymmetric: the `GOVMONITORING_ROLE` can pause all sends, claims and deToken deployments unilaterally, while only the `DEFAULT_ADMIN_ROLE` can unpause (on Ethereum, both roles are held by the same multisig).

# Upgradeability and governance

All core contracts are upgradeable by a 5/8 deBridge multisig, with no timelock or exit window. The same multisig holds the `DEFAULT_ADMIN_ROLE` on all of them, so without an upgrade it can already replace the `SignatureVerifier` (i.e. swap out the entire validation layer), change the validator set and signature thresholds, replace the `CallProxy` and token deployer, redirect fee withdrawal rights, and censor submissions. The gate also has a `feeContractUpdater` slot that can adjust the flat protocol fee automatically (unset on Ethereum).

# Monitoring

deBridge provides an [explorer](https://app.debridge.finance/explorer) for tracking crosschain transfers, and the gate emits dedicated `MonitoringSendEvent`/`MonitoringClaimEvent` events carrying the locked/minted totals as an offchain solvency-tracking aid. However, many security-relevant admin functions (replacing the signature verifier, changing signature thresholds or amount thresholds, re-pointing the deToken beacon implementation, setting the fee proxy or fee discounts) emit no events at all, so they can only be caught by storage diffing.
