zkAPI uses ETH deposits on Ethereum to obtain API credentials without revealing which deposit pays for them. Open Anonymity's deployed integration sends prompts to OpenRouter and its model providers, which can read them.

### What stays private

The wallet generates note secrets and proofs locally. A [request proof](https://github.com/ethereum/zkapi/blob/045b444ea1b52538d1b40273c7cb6ed09468a052/protocol/rust/crates/zkapi-proof/src/groth16.rs#L368-L485) hides the note id, exact balance and operator signature while proving sufficient funds and an eligible expiry. Deposits publicly reveal the funder, amount, commitment, note id and expiry. Optional withdrawals of unused deposits reveal the original note, destination, remaining balance and total consumption.

The operator learns the authorization's timing, budget and issued credential. It signs updated balances after usage. Proofs establish authorization, while correct billing and service delivery depend on the operator. The service's request cap is {{requestChargeCap}} ETH.

### Privacy features

- **Unlinkable inference:** proofs hide the paying deposit, but prompts, IPs and timing can identify users. Requests sharing a credential remain linkable. The desktop reuses credentials across compatible requests by default. [Client privacy boundaries](https://github.com/ethereum/zkapi/blob/045b444ea1b52538d1b40273c7cb6ed09468a052/zkapi-clientd/docs/PRIVACY.md).
- **Verifiable privacy:** the verifier checks provider privacy settings and credential ownership. It receives API keys, while prompts go to providers. Enclave assurance depends on reviewed code/program, hardware and attestation services. It does not attest providers' internal logging. [Verifier implementation](https://github.com/OpenAnonymity/oa-verifier/blob/86b7031c2f15d01d19efb77f547812e29992d4d9/internal/config/config.go#L26-L80).
- **Prompt rewriting, memory agents and Parallel/Council:** these features are disabled in zkAPI mode. Local chat storage does not stop conversation context sent for inference from reaching providers. The app's rewriter sends the original prompt to Tinfoil through ordinary HTTPS, without client-side enclave attestation in that request path.
- **Browser proxy:** proxied inference hides the user's IP from providers, while Refraction sees connecting IPs, destinations and timing. Direct fallback is enabled by default. The proxy does not cover every wallet or Ethereum RPC request. [Proxy implementation](https://github.com/OpenAnonymity/oa-chat/blob/60ed5be2957d984c70a7299474927becec47b61f/chat/services/networkProxy.js#L677-L775), [inference integration](https://github.com/OpenAnonymity/oa-chat/blob/60ed5be2957d984c70a7299474927becec47b61f/chat/zkapi/api.js#L15-L33).

The browser downloads a [common tree snapshot](https://github.com/ethereum/zkapi/blob/045b444ea1b52538d1b40273c7cb6ed09468a052/sdk/services/browserWalletRuntime.js#L829-L845) and derives its note path locally. The desktop companion instead [queries by note id](https://github.com/ethereum/zkapi/blob/20aa542ae98e767c0507133fd34b12a56f5ccd3d/crates/zkapi-clientd/src/indexer.rs#L69-L104), exposing the deposit to the indexer. Its Tor/Wisp setting does not cover the separate Rust protocol transport. An inspected local browser build and Tor covering all application traffic reduce these exposures. Hosted code updates can access local secrets and chats.

### Anonymity set

The chart counts eligible active notes deposited in the previous 30 days. It is an **upper bound**, since private spending can exhaust balances and several notes can belong to one user. Larger budgets, proof timing and traffic correlation can narrow the candidates.

### Recovering funds

A cooperative withdrawal requires operator clearance. An escape waits {{challengePeriod}}. A valid request proof by the provider can challenge and cancel it without evidence of service delivery, leaving recovery dependent on a permissioned signed successor state.

Notes expire after {{noteTtl}}, rounded up to a {{expiryBucket}} boundary. Anyone can sweep an expired active note's **entire deposit, including unused funds**, to the treasury. Pending escapes are protected. The owner can block new withdrawals until expiry and redirect the treasury. [Verified vault logic](https://etherscan.io/address/0x4386FDbdA35D995beB3BF8625118Ec5982ec81fe#code).

Proofs rely on a single-party trusted setup. Retained setup secrets allow forgery. Lost note secrets, settlement state or fixed operator signing keys can prevent recovery.
