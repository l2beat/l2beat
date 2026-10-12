zkAPI lets you prepay AI usage with ETH and chat without revealing which deposit pays for which request. Deposits and withdrawals are public, and the model provider can read your prompts.

Users trust Open Anonymity, which runs the service and owns the vault, and the inference providers behind OpenRouter. The operator approves withdrawals and sees each request's time and budget. The owner can pause the vault, and expired deposits fall to its treasury. You can leave without the operator through a {{challengePeriod}} escape, as long as your note has not expired.

### Architecture

Open Anonymity verifies request proofs before issuing API keys. Its signing keys are fixed in the vault. A new key requires proof that your balance covers a budget of at least {{requestChargeCap}} ETH.

Your app keeps the exact balance locally. The operator receives a commitment to your deposit. Initially, the balance equals the deposit.

The commitment is homomorphic: the operator can subtract a known charge without reading the balance. It signs the updated commitment. The local app checks the subtraction and signature, then stores the updated state.

The operator also runs the indexer and a challenger that disputes escapes from outdated balances.

### Flow

1. **Deposit** ETH from your wallet. The vault records its amount and an expiry about {{noteTtl}} later.
2. **Request access.** The app proves an active note covers your chosen budget. The operator returns a short-lived OpenRouter key.
3. **Chat.** Send prompts to OpenRouter with that key.
4. **Settle.** The operator bills the key's usage.
5. **Withdraw.** A cooperative close needs the operator's clearance. The vault publishes the note id and remaining balance. It returns the remainder to your chosen address and pays usage to the treasury.

### Keys

Losing the note secret and latest signed balance that are saved by the app loses the funds.

### App

The ratings assume OA Chat, a hosted browser app with public source and local build instructions. It fetches the whole note tree and proves in the browser. It relays inference through a proxy at refraction.network by default, with a fallback to direct connections. The hosted build runs code beyond the public main branch, including analytics. zkapi-clientd is a local daemon with an OpenAI-compatible API. It asks the operator's indexer for your note's path, and reuses keys across requests which can both harm your privacy.

### Providers and verifier

OpenRouter and the model provider can read prompts and responses and link requests under one key. Open Anonymity holds the OpenRouter accounts. A verifier running in an attestable Azure confidential container checks that OA's account has provider logging disabled. Its build reproduces from source and matches the attested measurement, see the verification steps. Both clients pin only the verifier's address, so the check only holds when you verify it yourself.

### Exits

**Escape.** Without a cooperative close, you start an escape with your latest signed balance and finalize it after {{challengePeriod}}. The operator can cancel it with a request proof for that balance, which publishes that request's link. While the owner pauses the vault, no one can start an escape, but one already started still finalizes.

### Compliance

The vault has no onchain screening. The operator can refuse keys or clearance.

### Fees

Usage is billed in USD and converted to ETH through a Chainlink feed, with no fee on top of the provider's price. The unused balance returns at withdrawal.
