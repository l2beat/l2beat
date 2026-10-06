zkAPI uses ETH deposits on Ethereum and request proofs that hide the paying deposit. Open Anonymity's integration sends prompts to OpenRouter and its model providers, which can read them.

### What stays private

The wallet generates secrets and proofs locally. A request proof hides the note id and exact balance. Deposits publicly reveal the funder, amount and note id. Withdrawals reveal the same note id, destination and remaining balance, exposing total consumption.

The operator knows authorization timing, budgets and billed usage. It signs balance updates; correct billing and service delivery depend on it. The service's request cap is {{requestChargeCap}} ETH.

### Clients and network

- **Browser app:** OA Chat uses the browser SDK to store notes and generate proofs locally. It downloads a common tree snapshot, avoiding queries that identify a user's note. Its Wisp proxy hides IPs from inference providers, while the relay sees connection metadata. Direct fallback is enabled by default, and protocol/indexer requests use a same-origin route outside that proxy. Use Tor covering the app and wallet broadcasts, and prefer inspected local code.
- **Local daemon:** `zkapi-clientd` runs on your computer and supplies an OpenAI-compatible API for apps such as Open WebUI. Its Rust wallet companion queries the indexer by public note id before authorization. Direct HTTPS is the default. Configure `--relay-url socks5://127.0.0.1:9050` with Tor running locally; this also routes the companion. Set `--key-reuse-window-seconds 0` to disable the default 60-second credential reuse across compatible requests. [Client privacy boundaries](https://github.com/ethereum/zkapi/blob/045b444ea1b52538d1b40273c7cb6ed09468a052/zkapi-clientd/docs/PRIVACY.md).

Neither client isolates unrelated operations onto separate Tor circuits or obscures request timing. The daemon's SOCKS handshake supplies no isolation credentials, and indexing and authorization share a hostname. Shared circuits and timing can link authorizations to deposits even over Tor. Prefer browser snapshots and wait before using a new deposit. Using your own Ethereum node requires a reviewed deployment profile and matching manifest.

### Provider

Avoid identifying prompts. Providers can read content and link requests sharing credentials. The verifier receives API keys and checks provider privacy settings and credential ownership; approval does not establish absence of logging. Browser attestation checks are offchain, and the vault does not bind operator keys to an attested enclave.

### Recovering funds

A cooperative withdrawal requires operator clearance. An escape waits {{challengePeriod}}. The operator can challenge it with a valid request proof, publicly linking that authorization to the note without proving service delivery. Recovery then requires a signed successor state.

Notes expire after {{noteTtl}}, rounded up to a {{expiryBucket}} boundary. Anyone can sweep an expired active note's **entire deposit, including unused funds**, to the treasury. Pending escapes are protected. The owner can block new withdrawals until expiry and redirect the treasury.

Proofs rely on a single-party trusted setup. Retained setup secrets allow forgery. Lost note secrets, settlement state or fixed operator signing keys can prevent recovery.
