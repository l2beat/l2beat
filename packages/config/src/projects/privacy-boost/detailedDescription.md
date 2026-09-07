Privacy Boost is a shielded pool for registered ERC-20 tokens on OP Mainnet, aimed at institutional users. The operator's TEE setup has to be trusted for privacy and liveness, while ZKPs ensure validity and an exit path against a malicious or faulty operator.

### Architecture

Deposited tokens are represented as notes whose Poseidon2 commitments are appended to an onchain Merkle tree, and spending a note publishes its nullifier. Users can privately transfer deposited tokens to other users. The TEE collects user-approved transfers and withdrawals, batches them into epochs, and a permissioned relay submits each epoch onchain with a Groth16 proof that checks correctness.

Accounts can authorize spending with registered approval keys or with explicit onchain spend approvals, including batches and approval-only smart-wallet accounts. Epoch proofs use current auth roots or roots superseded no more than {{epochAuthStaleness}} ago.

Users can locally prove a forced withdrawal of up to {{maxForcedInputs}} notes. The contract checks that the referenced auth key or spend approval is live and unexpired when the request is submitted, and records the authorized withdrawal and fee. Anyone can execute it {{forcedWithdrawalDelay}} later if the notes remain unspent, without cooperation from the TEE or relays. The account owner can cancel a pending request.

Portal deposits use EIP-7702 delegated deposit addresses to sweep tokens into escrow while hiding the recipient in the deposit proof. Gift notes can be claimed by recipients or refunded by senders after a bound deadline, either privately through a relay or through a permissionless public gift exit. Proof-authorized withdrawals can also call approved external gateways for DeFi operations.

If the operator disappears, no new deposits or private transfers can be processed and the pool effectively enters this exit-only mode, in which the zero-knowledge guarantees alone are sufficient to recover funds.

### Privacy considerations

All private data exists in plaintext inside the operator's TEE. This privacy depends on the hardware security of the TEE against actors with physical access (side-channel and microarchitectural attacks could expose the full plaintext ledger), as well as vendor vulnerabilities. The source code running within the TEE is not published.

Portal recipient anonymity additionally depends on the offchain discovery registry that maps portal addresses to their recipients. Access to its plaintext data can reveal those links.

A permissionless forced withdrawal publishes the commitments of the spent notes and the registered account ID, publicly linking the exit of specific notes with the EOA that registered auth keys. It is a fallback mechanism that reclaims the user's tokens but strips the privacy.

Practical privacy also depends on the timing and amounts of deposits and withdrawals, as well as on the frontend used to interact with the pool. Normal withdrawals and transfers within the private pool are not submitted as onchain transactions via RPC nodes, but directly to the TEE, thus not leaking anything to the RPC. Users are advised to research [OPSEC best practice](/publications/privacy-best-practices).

### Fees

Standard deposits are free of protocol fees. Portal deposits can charge a separate sweeper fee, capped at 10% and currently set to {{portalSweepFee}}, and have token-specific minimum sweep amounts. Withdrawals, including forced withdrawals and public gift exits, pay a {{withdrawFee}} fee forwarded to the treasury; a forced withdrawal records the fee at request time.

### Compliance

Registered auditors can query the Audit API of the TEE to fetch the balance and transaction history of any address. The TEE serves such requests without user consent, but is supposed to emit a record of every access on the AuditGateway smart contract, so that users can publicly verify whether and when their private data was disclosed.

The source code running within the TEE is not published, so it is impossible to verify the onchain audit attestation mechanism.
