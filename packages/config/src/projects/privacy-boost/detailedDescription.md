Privacy Boost lets apps on Base give their users a private ERC-20 balance. The user deposits tokens, sends them privately to other users, uses them in DeFi through approved gateways and withdraws to any address. Everything inside stays hidden from the chain, while the operator's enclave sees every transfer in plaintext.

Users trust the operator, Sunnyside Labs, whose TEE processes and whose relay submits every transaction. They also trust the admin multisig, which can upgrade every contract instantly. If the operator stops, a forced withdrawal takes funds out after {{forcedWithdrawalDelay}}, in public.

### Architecture

Deposits become notes whose Poseidon2 commitments enter an onchain Merkle tree, and spending a note publishes its nullifier. The TEE collects the transfers and withdrawals users approve and batches them into epochs. A permissioned relay submits each epoch with a Groth16 validity proof. The TEE's code is unpublished, so what it does with the plaintext cannot be checked. Its isolation rests on the hardware vendor and on resistance to attacks by anyone with physical access.

### Flow

1. **Deposit.** You deposit tokens directly, or anyone sends them to a portal address (EIP-7702) you generate locally. A sweep then moves them into the pool for you. Depositor, token and amount are public.
2. **Transfer.** You approve a spend, and the TEE includes it in the next epoch.
3. **Gift.** A gift note goes to its recipient, or back to the sender after a deadline. Either way runs privately through the relay or through a public gift exit.
4. **Withdraw.** The pool pays out to any address and can call an approved gateway for DeFi. Recipient, token and amount are public.

### Keys

The closed SDK can derive the private account's keys from a wallet signature, which links that wallet to the account. The hosted wallet can upload a backup of the private keys to the operator. Accounts approve spends with registered keys or with onchain spend approvals. Both are leaves of an auth Merkle tree in the AuthRegistry contract. Epoch proofs may use a tree root up to {{epochAuthStaleness}} old, so a revoked key or approval stays usable that long.

### App

Apps integrate the Privacy Boost SDK, whose core ships as closed-source WebAssembly and takes its endpoints from the operator's server.

### Exits

**Forced withdrawal.** If operator turns malicious or stops processing withdrawals, a user can prove a forced withdrawal of up to {{maxForcedInputs}} notes locally. The contract checks the authorization at request time, and anyone can execute the withdrawal {{forcedWithdrawalDelay}} later if the notes are still unspent. The account owner can cancel it. It publishes the spent notes and exposes the linked account.

### Compliance

Auditors appointed by the admin multisig can query the TEE's Audit API for the balance and history of any address, without the user's consent. The AuditGateway lists {{auditorCount}} auditors today. The TEE is meant to record each access on that contract, but with its code unpublished this is unverifiable.

### Fees

Standard deposits pay no protocol fee. Portal deposits pay a sweeper fee of {{portalSweepFee}}, capped at 10%, and have token-specific minimum sweep amounts. Withdrawals, forced withdrawals and public gift exits pay {{withdrawFee}} to the treasury. A forced withdrawal fixes its fee at request time.

### Deposit and withdrawal statistics

The statistics count every ERC-20 transfer into the pool as a deposit and every transfer out as a withdrawal, since pool events omit per-transfer amounts. This includes portal sweeps, refunds of cancelled deposit requests, withdrawal fees sent to the treasury and both legs of gateway DeFi calls.
