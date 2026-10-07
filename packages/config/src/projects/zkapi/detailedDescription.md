zkAPI hides the link between a user's onchain money and their AI usage. It does not hide deposits, withdrawals or prompts.

zkAPI lets users prepay for AI inference with ETH and then use it without revealing which deposit pays for which request. A user deposits ETH into a vault on Ethereum once and then makes API requests. Each request carries a zero-knowledge proof that some funded deposit can pay, without saying which one. It is built by Open Anonymity with the Ethereum Foundation and powers the Ethereum wallet option of the 'OA Chat' website.

### Typical user flow

1. **Deposit:** the app creates a secret locally and deposits ETH from the user's wallet. This creates a public, numbered note showing the funding address and amount. The note expires after {{noteTtl}}, rounded up in {{expiryBucket}} steps.
2. **Get access:** the app proves locally that it controls a funded, unspent note and sends the proof to the zkAPI operator. The operator checks it and hands out a short-lived OpenRouter API key with a budget of at most {{requestChargeCap}} ETH.
3. **Chat:** the app sends prompts with that key to OpenRouter, which forwards them to the model provider.
4. **Settle:** the operator charges the measured usage and returns a new signed balance. The app stores it locally for the next request.
5. **Withdraw:** with the operator's approval, the app closes the note, sends the remaining ETH to an address of the user's choice and the used part to the operator's treasury. Without approval, an escape withdrawal takes {{challengePeriod}}. Users must withdraw before expiry: anyone can send the **entire deposit of an expired note, including unused funds**, to the treasury.

### Architecture

- **ZkApiVault** on Ethereum holds the ETH and a Merkle tree of active notes. It verifies withdrawal proofs and handles escapes and expiry. It is not upgradeable.
- **Clients** keep note secrets and the latest signed balance on the user's device and generate proofs there. OA Chat uses the browser SDK. `zkapi-clientd` is a local daemon offering an OpenAI-compatible API for apps like Open WebUI.
- **The operator** (Open Anonymity) verifies request proofs, issues API keys, signs new balances and approves withdrawals. It also runs the indexer serving Merkle paths and a challenger that disputes escape withdrawals using outdated balances.
- **Open Anonymity's key stations and verifier** hold the OpenRouter accounts behind the issued keys and check provider privacy settings. OpenRouter and the model providers run the inference.
- **Chainlink's ETH/USD feed** converts USD inference costs into ETH.

Balances live offchain. The vault only knows each note's original deposit. The current balance is a hidden commitment signed by the operator and held by the user. Each request spends that state exactly once, enforced by a nullifier, and the operator signs a successor.

The proofs are Groth16 over BN254, with Poseidon hashes, Baby-JubJub balance commitments and Schnorr signatures. The proving keys come from a single-party trusted setup.

### Privacy considerations

**Private:** which note pays for a request. Request proofs hide the note, its exact balance and its signed state. Individual charges stay offchain.

**Public:** deposits show the funding address, amount and note id. Withdrawals show the same note id, the payout address and the remaining balance. Deposit and withdrawal of a note are always linked, and its total spending is public.

**Seen by services:**

- The operator sees request timing, budgets and billed usage. During an escape withdrawal it can publish a request proof onchain, linking that request to the note.
- OpenRouter and the model provider read prompts and responses and can link all requests using the same key. The verifier's approval does not prove that providers keep no logs. Avoid identifying prompts.
- Services see the user's IP unless a proxy or Tor is used. OA Chat sends inference through a Wisp proxy, but falls back to direct connections by default and sends protocol requests outside the proxy. `zkapi-clientd` connects directly unless configured with Tor and reuses a key for 60 seconds by default. Neither client isolates Tor circuits or hides request timing.
- The hosted app can read local secrets and chats after an update. Inspected local builds avoid this.

Users are advised to research [OPSEC best practice](/publications/privacy-best-practices).

### Risks and trust assumptions

- **Owner:** an EOA can pause deposits, cooperative withdrawals and new escapes at any time, and change the treasury. Expiry sweeps keep working while paused, so a pause until expiry lets the owner redirect all active deposits to its treasury.
- **Operator:** controls billing, key issuance and withdrawal approval. Its signing keys are fixed in the vault. If it receives a request but never returns the signed new balance, it can challenge the user's escape with that request and the note eventually expires into the treasury.
- **Trusted setup:** whoever ran the single-party setup can forge withdrawal proofs if they kept its secrets.
- **Local data:** losing the note secret or latest signed balance means losing the funds.

### Fees

The public server code adds no fee on top of the usage reported by Open Anonymity's key service. Usage is priced in USD, converted to ETH via Chainlink and paid to the treasury at withdrawal or expiry. Users pay Ethereum gas for deposits and withdrawals.

### Compliance

There is no onchain screening or allowlist. The operator can refuse to issue keys or approve withdrawals.

### Anonymity set

To the operator, a request can come from any active, unexpired note whose deposit covers the request budget. This set only contains zkAPI users and is small. Using a fresh deposit right away, unusual budgets or distinctive timing can narrow it to a single note. Waiting after a deposit helps.
