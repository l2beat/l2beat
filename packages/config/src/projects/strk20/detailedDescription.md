STRK-20 is a privacy pool deployed as [a smart contract on starknet](https://voyager.online/contract/0x040337b1af3c663e86e333bab5a4b28da8d4652a15a69beee2b677776ffe812a). It uses a UTXO-style note model: users deposit ERC20 tokens into the pool, create encrypted notes, spend notes by publishing nullifiers, and withdraw to public Starknet addresses.

The pool contract source code was reviewed for this entry, but the TypeScript SDK and proving stack are not open source yet. Because the prover and core program is not published, nobody can independently audit and verify the software that produces proofs or see what is actually proven. This adds a major trust assumption for liveness and validity.

### Privacy considerations
The protocol supports private transfers, arbitrary amounts, partial withdrawals through private change notes, and DeFi actions through external helper contracts. DeFi integrations use open notes: the pool creates a note whose final amount is filled after an external helper, such as a swap or lending adapter, measures the onchain output.

Recipients discover notes from onchain data through account-linked channels and token-specific subchannels. This avoids scanning all pool activity, but the discovery address is visible when channel metadata is written or read. Using a trusted or local node for note / channel discovery or separating note discovery from withdrawal submission is therefore crucial for privacy.

### Fees
The pool currently charges a flat fee of 4 STRK plus gas for any action that uses the privacy pool, including deposits, swaps, and withdrawals.

### Compliance
The compliance model relies on an 'auditor' public key. Users register an encrypted private viewing key, but all 'private' actions must include auditor-encrypted metadata. Whoever controls the auditor private key can decrypt user metadata offchain from onchain-emitted cyphertexts; this does not grant spending authority, but it can centrally remove any user's privacy, even retroactively.

### Anonymity set
The anonymity set, in the best case, corresponds to the set of all users of the privacy pool. But metadata leaks and the centralized auditor reduce the anonymity set in practice.
