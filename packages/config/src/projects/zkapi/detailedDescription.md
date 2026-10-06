zkAPI uses ETH deposits on Ethereum and request proofs that hide the paying deposit. Open Anonymity's integration sends prompts to OpenRouter and its model providers, which can read them.

### What stays private

The wallet generates secrets and proofs locally. A [request proof](https://github.com/ethereum/zkapi/blob/045b444ea1b52538d1b40273c7cb6ed09468a052/protocol/rust/crates/zkapi-proof/src/groth16.rs#L368-L485) hides the note id and exact balance. Deposits publicly reveal the funder, amount and note id. Withdrawals reveal the same note id, destination and remaining balance, exposing total consumption.

The operator knows authorization timing, budgets and billed usage. It signs balance updates; correct billing and service delivery depend on it. The service's request cap is {{requestChargeCap}} ETH.

### Clients and network privacy

- **Browser app:** OA Chat uses the browser SDK to store notes and generate proofs locally. It downloads a [common tree snapshot](https://github.com/ethereum/zkapi/blob/045b444ea1b52538d1b40273c7cb6ed09468a052/sdk/services/browserWalletRuntime.js#L829-L845), avoiding queries that identify a user's note. Its [Wisp proxy](https://github.com/OpenAnonymity/oa-chat/blob/60ed5be2957d984c70a7299474927becec47b61f/chat/services/networkProxy.js#L677-L775) hides IPs from inference providers, while the relay sees connection metadata. Direct fallback is enabled by default, and protocol/indexer requests use a [same-origin route](https://github.com/ethereum/zkapi/blob/045b444ea1b52538d1b40273c7cb6ed09468a052/sdk/services/browserWalletRuntime.js#L778-L793) outside that proxy. Use Tor covering the app and wallet broadcasts, and prefer inspected local code.
- **Local daemon:** `zkapi-clientd` runs on your computer and supplies an OpenAI-compatible API for apps such as Open WebUI. Its Rust wallet companion [queries the indexer by public note id](https://github.com/ethereum/zkapi/blob/20aa542ae98e767c0507133fd34b12a56f5ccd3d/crates/zkapi-clientd/src/indexer.rs#L71-L80) before authorization. Direct HTTPS is the default. Configure `--relay-url socks5://127.0.0.1:9050` with Tor running locally; this also [routes the companion](https://github.com/ethereum/zkapi/blob/045b444ea1b52538d1b40273c7cb6ed09468a052/zkapi-clientd/internal/relay/connect.go#L18-L44). Set `--key-reuse-window-seconds 0` to disable the default 60-second credential reuse across compatible requests. [Client privacy boundaries](https://github.com/ethereum/zkapi/blob/045b444ea1b52538d1b40273c7cb6ed09468a052/zkapi-clientd/docs/PRIVACY.md).

Neither client isolates unrelated operations onto separate Tor circuits or obscures request timing. The daemon's [SOCKS handshake supplies no isolation credentials](https://github.com/ethereum/zkapi/blob/045b444ea1b52538d1b40273c7cb6ed09468a052/zkapi-clientd/internal/relay/socks5.go#L53-L59), and indexing and authorization [share a hostname](https://github.com/ethereum/zkapi/blob/045b444ea1b52538d1b40273c7cb6ed09468a052/zkapi-clientd/internal/zkapi/deployments/mainnet.json#L20-L22). Shared circuits and timing can link authorizations to deposits even over Tor. Prefer browser snapshots and wait before using a new deposit. Using your own Ethereum node requires a reviewed deployment profile and matching manifest.

### Provider privacy

Avoid identifying prompts. Providers can read content and link requests sharing credentials. The [verifier](https://github.com/OpenAnonymity/oa-verifier/blob/86b7031c2f15d01d19efb77f547812e29992d4d9/internal/config/config.go#L26-L80) receives API keys and checks provider privacy settings and credential ownership; approval does not establish absence of logging. [Browser attestation checks](https://github.com/OpenAnonymity/oa-chat/blob/60ed5be2957d984c70a7299474927becec47b61f/chat/components/VerifierAttestationModal.js#L195-L285) are offchain, and the vault does not bind operator keys to an attested enclave.

### Anonymity set

The chart counts eligible active notes deposited in the previous 30 days. It is an **upper bound**: spending can exhaust balances, several notes may belong to one user, and budgets and timing can narrow the candidates.

### Recovering funds

A cooperative withdrawal requires operator clearance. An escape waits {{challengePeriod}}. The operator can challenge it with a valid request proof, publicly linking that authorization to the note without proving service delivery. Recovery then requires a signed successor state.

Notes expire after {{noteTtl}}, rounded up to a {{expiryBucket}} boundary. Anyone can sweep an expired active note's **entire deposit, including unused funds**, to the treasury. Pending escapes are protected. The owner can block new withdrawals until expiry and redirect the treasury. [Vault logic](https://etherscan.io/address/0x4386FDbdA35D995beB3BF8625118Ec5982ec81fe#code).

Proofs rely on a single-party trusted setup. Retained setup secrets allow forgery. Lost note secrets, settlement state or fixed operator signing keys can prevent recovery.
