# Privacy review

Trace a user's data through the deployed contracts, released app and offchain services. Start with what the project hides: sender, recipient, amount, asset or linkage. Identify who can learn each field and how.

Review at least the default setup and the best setup supported by the released client. Check what custom RPCs, Tor, local builds and self-hosted services actually mitigate. Distinguish supported settings from required client modifications.

## Minimum focus points

| Vector | What to inspect |
| --- | --- |
| Public onchain data | Events, calldata, proof inputs, ciphertext handles, nullifiers, handshakes, registry records and transaction shapes. Can these identify accounts, link operations or distinguish this application's users? Include bridges and DeFi adapters. |
| Correlation and anonymity set | Amounts after fees, timing, asset, gas funding, address reuse and wallet fingerprints. Which candidates remain for this operation's pool, asset and approved set? Account for private incoming transfers before inferring balances from public deposits. |
| Note discovery | Does the wallet scan and decrypt a common feed locally, or query by account, tag, note, commitment or transaction? Can the server cluster a user's notes or connect a deposit address to its recipient? |
| Node RPCs and indexers | Reads, balance queries, gas estimates, simulations, receipt lookups and broadcasts. What private intent reaches the endpoint before publication? Does a custom RPC setting cover every request, including startup and fallback paths? |
| Backends and telemetry | Authentication, name resolution, quotes, screening, payment links, analytics and crash reports. Follow addresses, keys, URL secrets, IPs and session identifiers through request payloads and storage. Can one operator join deposits and withdrawals across services? |
| Relayers and sequencers | What does each service receive: a witness, plaintext operation, ciphertext, proof or public transaction? What can it link to the requester? Check fee payments, quote requests, submission timing and required authentication. |
| Wallet code and configuration | Who can replace the frontend, desktop release, endpoint list, contract address or encryption key? Check update paths, unsigned manifests and client verification. A local build may still fetch operator-controlled configuration or require vendor authentication. |
| Key generation and storage | Who generates, derives, receives and retains spending and viewing keys? Inspect wallet-signature derivation, passkeys, local storage, backups, exports and diagnostics. Separate read access from spending authority. |
| Privileged operators | View keys, decryption committees, enclaves, hosted provers and upgrade or registry owners. Can they read history, substitute keys, change disclosure rules or target a user? Can an approval-list operator narrow the user's anonymity set? |
| Proofs and encryption | Check the actual circuit, proof flavor, public inputs, witness handling and encryption recipients. A validity proof may lack zero knowledge. For TEEs, check client attestation validation and the approved binary's correspondence to source. |
| Recovery and exceptional routes | Refunds, forced exits, ragequits, account restoration, swaps and payment-link claims. Do these publish notes, ownership, keys or links hidden on the ordinary path? Can censorship leave only a public recovery route? |
| Retained data and future compromise | Which ciphertexts, proofs, identifiers and service logs remain available? Which later key leak or cryptographic break would expose them? Distinguish data permanently public from data whose exposure requires operator retention. |

## Evidence and reporting

For each finding, record **who learns what, through which path, under which conditions**, with a source reference. Separate direct disclosure, correlation, active operator attacks and unknown behavior. A server's ability to receive data is observable even when its retention policy is unknown.

Use the fields, adversaries and rating conventions in [privacyAdversaries.ts](src/common/privacyAdversaries.ts). Existing project reviews provide examples.
