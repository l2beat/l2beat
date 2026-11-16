zkAPI lets the user prepay AI usage with ETH and chat without revealing which deposit pays for which request. Deposits and withdrawals are public, and the model provider can read the user's prompts.

Users trust Open Anonymity, which runs the service and owns the vault, and the inference providers behind OpenRouter. The operator approves withdrawals and sees each request's time and budget tier. The owner can pause the vault, and expired deposits fall to its treasury. Without the operator, the user can start a {{challengePeriod}} escape while the vault is unpaused and the note active. The operator can cancel an escape from a balance the user already spent from by withholding a signed update.

### Architecture

Open Anonymity verifies request proofs before issuing API keys. Its signing keys are fixed in the vault. A new key requires proof that the user's balance covers a budget of at least {{requestChargeCap}} ETH.

The user's app keeps the exact balance locally. The operator receives a commitment to the user's deposit. Initially, the balance equals the deposit.

The commitment is homomorphic: the operator subtracts a known charge without reading the balance and signs the result. The app checks both and stores the new state.

The operator also runs the indexer and a challenger that disputes escapes from outdated balances.

### Flow

1. **Deposit** ETH from your wallet. The vault records its amount and an expiry about {{noteTtl}} later.
2. **Request access.** The app proves an active note covers the budget tier of your chosen model. The operator returns a short-lived OpenRouter key.
3. **Chat.** Send prompts to OpenRouter with that key.
4. **Settle.** The operator bills the key's usage.
5. **Withdraw.** A cooperative close needs the operator's clearance. The vault publishes the note id and remaining balance. It returns the remainder to your chosen address and pays usage to the treasury.

### Keys

Losing the note secret and latest signed balance that are saved by the app loses the funds.

### App

OA Chat is a hosted browser app with local build instructions. It fetches the whole note tree and proves in the browser. It relays inference and chain reads through a proxy at refraction.network by default, with a fallback to direct connections. The hosted build serves the [public source](https://github.com/OpenAnonymity/oa-chat/tree/6c6046141f8b2cf4e4ba9e6967a7fa4dfcff716d) with a private layer for the sign-in pages, including Google sign-in, and Fathom analytics.

### Providers and verifier

OpenRouter and the model provider can read prompts and responses and link requests under one key. Open Anonymity's stations hold the OpenRouter accounts. A verifier in an attestable Azure confidential container checks that each station's account disables provider logging. Its attested image rebuilds from [public source](https://github.com/OpenAnonymity/oa-verifier/tree/a2916c6af618ee46a851af28dee201606de895d8). A station whose settings it cannot read stays approved for up to seven days after its last pass. OA Chat pins only the verifier's address, so the user must check the attestation personally. When the verifier is unreachable, OA Chat still accepts a station-signed key and shows "Key not verified".

### Exits

**Escape.** Without a cooperative close, the user starts an escape with their latest signed balance and finalizes it after {{challengePeriod}}. The operator can cancel it with a request proof for that balance, which publishes that request's link. While the owner pauses the vault, no one can start an escape, but one already started still finalizes.

### Compliance

The vault has no onchain screening. The operator can refuse keys or clearance.

### Fees

Usage is billed in USD and converted to ETH through a Chainlink feed, with no fee on top of the provider's price. The unused balance returns at withdrawal.
