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
| Public archives and future compromise | Which ciphertexts, proofs and keys can anyone download today? What does a known quantum attack recover from them, and what can a recovered key request from a live service? Which assumption still has to hold? Data whose exposure requires operator retention belongs to the privileged insider. |

## Checked apps

The reference app is the most private released app found for the protocol. Screen every other released app with the questions below. Answer them from source at a release tag, or for a closed app from a short trace and its served bundle. Compare each answer with the reference app's.

- An app that leaks more gets one finding: its first answer that leaks more, or, when several do, the one its settings and Tor cannot avoid.
- A finding comes with a source and a fix, what the app changes to match the reference app. A closed app's source is its URL with the check date.
- An app that leaks less on an answer about the promised field gets a full review as a reference candidate.
- When answers are mixed, compare each app's worst leak that settings and Tor cannot avoid. The one that reaches fewer parties wins, and a public link outweighs a link at one server.

| Scope | Questions |
| --- | --- |
| Every app | Is it released, open at a tagged commit, or closed? Does it ship built-in Tor or work in Tor Browser? Does a custom RPC cover every request, including startup and fallbacks? Which third parties receive the account, notes or transaction hashes, and is that never, opt-in, prompted, by default or always? Are keys generated locally, or derived from a wallet signature? Does one session load several of the user's accounts against one endpoint? How does the code arrive: hosted per visit, store release, signed or reproducible release, onchain pin? |
| Pool | Is the deposit secret generated locally? Are tree and events fetched whole, or queried per deposit? Can the user pick the relayer or broadcast the withdrawal themselves? Does the relayer get the IP? Is the approval list fetched whole? Are ragequit and deposit import supported? |
| Shielded ledger | Does note discovery scan locally, or query a server by account or viewing key? Does the viewing key leave the device? Is a relayer or broadcaster the default, and can the user pick or bypass it? Are compliance proofs built locally, or queried per note? Is proving local or hosted? Do payouts reach shielded addresses? |
| Stealth address | Who resolves the recipient? Who scans announcements, and with which key? Where are stealth keys derived? How do withdrawals pay gas? Does the app merge stealth balances in one request or transaction? |
| Confidential amounts | Who can request decryption, and which delegations does the app grant by default? Does the gateway or relayer need an API key tied to the user? Which screening calls fire? |
| Anonymous access | Is the note tree fetched whole, or the user's path queried? Are keys or sessions reused across requests? Which relay carries requests? Does the app check the attestation of the services it trusts? |
| Secret ballot | Is the ballot encrypted on the device? Who relays it, and what does the relay learn? Is the voter's weight hidden? Where does the voter key live? |

## Evidence and reporting

For each finding, record **who learns what, through which path, under which conditions**, with a source reference. Separate direct disclosure, correlation, active operator attacks and unknown behavior. A server's ability to receive data is observable even when its retention policy is unknown.

Use the fields, adversaries and rating conventions in [privacyAdversaries.ts](src/common/privacyAdversaries.ts). Existing project reviews provide examples.
