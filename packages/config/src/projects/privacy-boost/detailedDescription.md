Privacy Boost is a shielded pool for registered ERC-20 tokens on OP Mainnet, aimed at institutional users. The operator's TEE secures all privacy guarantees and processes all private transactions, while ZKPs ensure validity and an exit path against a malicious or faulty operator.

### Architecture

Deposited tokens are represented as notes whose Poseidon2 commitments are appended to an onchain Merkle tree, and spending a note publishes its nullifier. Users can privately transfer deposited tokens to other users. The TEE collects user-approved transfers and withdrawals, batches them into epochs, and an allowed relay submits each epoch onchain with a Groth16 proof that checks correctness.

Each user registers an approval public key in the AuthRegistry, and the pool normally snapshots the registry's Merkle roots every {{authSnapshotInterval}}. Any user whose approval key is included in the snapshot can locally generate a forced withdrawal to an address of their choice, executable {{forcedWithdrawalDelay}} after it is requested. A forced withdrawal is generated locally and executed onchain, with no cooperation from the TEE or relays.

If the operator disappears, no new deposits or private transfers can be processed and the pool effectively enters this exit-only mode, in which the zero-knowledge guarantees alone are sufficient to recover funds.

### Privacy considerations

All private data exists in plaintext inside the operator's TEE. This privacy depends on the hardware security of the TEE against actors with physical access: side-channel and microarchitectural attacks or attestation key compromise could expose the full plaintext ledger.

A permissionless forced withdrawal publishes the commitments of the spent notes and the registered account ID, publicly linking the exit of specific notes with the EOA that registered auth keys. It is a fallback mechanism that reclaims the user's tokens but strips the privacy.

Practical privacy also depends on the timing and amounts of deposits and withdrawals, as well as on the frontend used to interact with the pool. Normal withdrawals and transfers within the private pool are not submitted as onchain transactions via RPC nodes, but directly to the TEE, thus not leaking anything to the RPC. Users are advised to research [OPSEC best practice](/publications/privacy-best-practices).

### Fees

Deposits into the pool are free of protocol fees. All withdrawals pay a {{withdrawFee}} fee on the withdrawn amount, which is forwarded to the treasury.

### Compliance

Registered auditors can query the Audit API of the TEE to fetch the balance and transaction history of any address. The TEE serves such requests without user consent, but it emits a record of every access on the AuditGateway smart contract, so users can publicly verify whether and when their private data was disclosed.
