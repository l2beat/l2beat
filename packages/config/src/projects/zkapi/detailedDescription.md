zkAPI hides which deposit pays for which AI request. Deposits and withdrawals are public, and the provider reads prompts.

**Whom you trust:** Open Anonymity, which runs the service and owns the vault, and the inference providers behind OpenRouter.<br>
**What they can do:** the operator sees your usage and approves withdrawals. The owner can pause the vault, and expired deposits fall to its treasury.<br>
**Can you leave:** without the operator, through a {{challengePeriod}} escape, as long as your note has not expired.

### How it works

1. **Deposit** ETH from your wallet. The vault records a public note with amount and expiry, {{noteTtl}} rounded up to {{expiryBucket}}.
2. **Request access.** The app proves locally that some active note covers the budget, at most {{requestChargeCap}} ETH per request, and the operator returns a short-lived OpenRouter key.
3. **Chat.** Prompts go to OpenRouter with that key.
4. **Settle.** The operator charges the usage and signs a new hidden balance, which the app keeps.
5. **Withdraw.** With the operator's clearance, the remaining ETH goes to an address you choose and the used part to the treasury.

### Vault and owner

ZkApiVault on Ethereum holds the ETH and the Merkle tree of active notes. It is immutable. Its owner can pause it and redirect the treasury, see upgrades and governance. Expiry sweeps keep working while paused: anyone can send an expired note's full deposit, used or not, to the treasury. Withdraw before expiry.

### Operator

Open Anonymity verifies request proofs, issues keys, signs balances and clears withdrawals. Its signing keys are fixed in the vault. It also runs the indexer that serves Merkle paths and a challenger that disputes escapes started from an outdated balance. Usage is billed in USD, converted to ETH through a Chainlink feed, with no fee on top of the provider's price. There is no onchain screening. The operator can refuse keys or clearance.

### Providers and verifier

OpenRouter and the model provider read prompts and responses and can link requests under one key. Open Anonymity's key stations hold the OpenRouter accounts. A verifier running in an attestable Azure confidential container checks that a station's account has provider logging disabled. Its build reproduces from source and matches the attested measurement, see the verification steps. Both clients pin only the verifier's address, so the check holds when you verify it yourself.

### Clients

OA Chat is a hosted browser app with public source and local build instructions. It fetches the whole note tree and proves in the browser, and relays inference through Open Anonymity's proxy by default with a fallback to direct connections. zkapi-clientd is a local daemon with an OpenAI-compatible API. It asks the operator's indexer for your note's path (see privileged insider), reuses a key for 60 seconds by default and can route everything through Tor, failing closed. Both keep the note secret and the latest signed balance on your device. Losing them loses the funds.

### Proofs

Groth16 over BN254 with Poseidon hashes, Baby Jubjub balance commitments and Schnorr signatures. The request circuit proves membership of an active note with enough balance, hiding which. The withdrawal circuit reveals the note id and remaining balance. The proving keys come from a single-party setup.
