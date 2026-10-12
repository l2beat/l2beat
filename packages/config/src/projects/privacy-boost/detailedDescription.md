Privacy Boost is a shielded ledger for ERC-20 tokens on Base, aimed at institutional users. Privacy and liveness depend on the operator's TEE, while zero-knowledge proofs secure funds and a forced exit.

### Architecture

Deposits become notes whose Poseidon2 commitments enter an onchain Merkle tree, and spending a note publishes its nullifier. The TEE collects the transfers and withdrawals users approve and batches them into epochs. A permissioned relay submits each epoch with a Groth16 validity proof.

Accounts approve spends with registered keys or with onchain spend approvals, which also serve smart-wallet accounts. Both are leaves of an auth Merkle tree in the AuthRegistry. Epoch proofs may use a tree root up to {{epochAuthStaleness}} old, so a revoked key or approval stays usable that long.

### Forced withdrawals

A user can prove a forced withdrawal of up to {{maxForcedInputs}} notes locally. The contract checks the authorization at request time, and anyone can execute the withdrawal {{forcedWithdrawalDelay}} later if the notes are still unspent. The account owner can cancel it. This is the exit when the operator stops, and it publishes the spent notes and the linked account.

### Portal deposits, gifts and DeFi

Portal deposits use EIP-7702 addresses that users generate locally. Anyone can send ERC-20 tokens there, and sweeps move them into the pool for the hidden recipient. Gift notes go to the recipient or back to the sender after a deadline, privately through the relay or through a public gift exit. Withdrawals can call approved gateways for DeFi.

### Compliance

Auditors appointed by the admin multisig can query the TEE's Audit API for the balance and history of any address, without the user's consent. The AuditGateway lists {{auditorCount}} auditors today. The TEE is meant to record each access on that contract, but with its code unpublished this is unverifiable.

### Privacy considerations

Every private transaction exists in plaintext inside the operator's TEE, whose source code is unpublished. Privacy therefore also rests on the hardware vendor and on resistance to attacks by anyone with physical access. Practical privacy also depends on the timing and amounts of deposits and withdrawals, see [OPSEC best practice](/publications/privacy-best-practices).

### Fees

Standard deposits pay no protocol fee. Portal deposits pay a sweeper fee of {{portalSweepFee}}, capped at 10%, and have token-specific minimum sweep amounts. Withdrawals, forced withdrawals and public gift exits pay {{withdrawFee}} to the treasury. A forced withdrawal fixes its fee at request time.

### Deposit and withdrawal statistics

The statistics count every ERC-20 transfer into the pool as a deposit and every transfer out as a withdrawal, since pool events omit per-transfer amounts. This includes portal sweeps, refunds of cancelled deposit requests, withdrawal fees sent to the treasury and both legs of gateway DeFi calls.
