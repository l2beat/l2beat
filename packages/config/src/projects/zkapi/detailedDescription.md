zkAPI lets you prepay AI usage with ETH and chat without revealing which deposit pays for which request. Deposits and withdrawals are public, and the model provider can read your prompts.

Users trust Open Anonymity, which runs the service and owns the vault, and the inference providers behind OpenRouter. The operator approves withdrawals and sees each request's time and budget. The owner can pause the vault, and expired deposits fall to its treasury. You can leave without the operator through a {{challengePeriod}} escape, as long as your note has not expired.

### Flow

1. **Deposit** ETH from your wallet. The vault records a public note with amount and expiry, {{noteTtl}} rounded up to {{expiryBucket}}.
2. **Request access.** The app proves locally that some active note covers the budget, at most {{requestChargeCap}} ETH per request. The operator returns a short-lived OpenRouter key.
3. **Chat.** Prompts go to OpenRouter with that key.
4. **Settle.** The operator charges the usage and signs a new hidden balance, which the app keeps. The next request re-blinds it, so the balance does not link your requests.
5. **Withdraw.** In a cooperative close, the operator needs to clear your note. The remaining ETH goes to an address you choose, the used part to the treasury. The note id and the remaining balance thus become public.

### Keys

The note secret and the latest signed balance stay on your device. Losing them loses the funds.

### App

The ratings assume OA Chat, a hosted browser app with public source and local build instructions. It fetches the whole note tree and proves in the browser. It relays inference through a relay at refraction.network by default, with a fallback to direct connections. The hosted build runs code beyond the public main branch, including Fathom analytics. zkapi-clientd is a local daemon with an OpenAI-compatible API. It asks the operator's indexer for your note's path, reuses a key for 60 seconds by default and can route everything through Tor with a kill switch, so it never connects directly.

### Vault and owner

ZkApiVault on Ethereum holds the ETH and the Merkle tree of active notes. It is immutable. Its owner can pause it and redirect the treasury, see [upgrades and governance](#upgrades-and-governance). Expiry sweeps keep working while paused: anyone can send an expired note's full deposit, used or not, to the treasury. Withdraw before expiry.

### Operator

Open Anonymity verifies request proofs, issues keys, signs balances and clears withdrawals. Its signing keys are fixed in the vault. It also runs the indexer that serves Merkle paths and a challenger that disputes escapes started from an outdated balance.

### Providers and verifier

OpenRouter and the model provider can read prompts and responses and link requests under one key. Open Anonymity's key stations hold the OpenRouter accounts. A verifier running in an attestable Azure confidential container checks that a station's account has provider logging disabled. Its build reproduces from source and matches the attested measurement, see the verification steps. Both clients pin only the verifier's address, so the check holds when you verify it yourself.

### Exits

**Escape.** Without a cooperative close, you start an escape with your latest signed balance and finalize it after {{challengePeriod}}. The operator can cancel it with a request proof for that balance, which publishes that request's link. While the owner pauses the vault, no one can start an escape, but one already started still finalizes.

### Compliance

The vault has no onchain screening. The operator can refuse keys or clearance.

### Fees

Usage is billed in USD and converted to ETH through a Chainlink feed, with no fee on top of the provider's price. The unused balance returns at withdrawal.
