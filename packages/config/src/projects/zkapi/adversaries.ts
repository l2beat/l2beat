import { definePrivacyAdversaries } from '../../common/privacyAdversaries'

const SRC =
  'https://github.com/ethereum/zkapi/blob/045b444ea1b52538d1b40273c7cb6ed09468a052/'
const COMPANION =
  'https://github.com/ethereum/zkapi/blob/20aa542ae98e767c0507133fd34b12a56f5ccd3d/crates/zkapi-clientd/src/'

// Linkage here means deposit-to-authorization. The public deposit-to-withdrawal
// link is documented separately in the promise and exposure text.
export const zkApiAdversaries = definePrivacyAdversaries({
  promise: {
    protects: 'linkage',
    text: 'Hides which Ethereum deposit funds an API request. Deposits and withdrawals remain publicly linked by note id. The credential issuer and inference provider receive the API credential, and the provider receives prompts and responses.',
  },
  fieldDescriptions: {
    linkage:
      'Whether an API authorization can be tied to the deposit funding it.',
  },
  cells: {
    publicObserver: {
      sentiment: 'good',
      exposure:
        'API authorizations stay offchain. Their proofs hide the deposit note and exact remaining balance. Ethereum publishes deposit sender, commitment, amount and expiry, then the same note id, payout address and remaining balance on closure. The difference reveals total consumption for that note. Publishing a challenge exposes a request proof and its nullifier alongside the note being withdrawn.',
      advice:
        'Treat funding, payouts and total consumption as public. Use a funding wallet and payout address that you accept being linked. An escape dispute reveals additional authorization metadata.',
      interior: {
        sender: 'exposed',
        recipient: {
          verdict: 'exposed',
          note: 'Payments are for the configured service operator.',
        },
        amount: {
          verdict: 'private',
          note: 'Individual request charges stay offchain. A closed note reveals its total consumed amount.',
        },
        asset: 'exposed',
        linkage: {
          verdict: 'private',
          note: 'Request proofs hide the funding note. Publishing a challenge reveals its deposit-to-authorization link.',
        },
      },
      sources: [
        { contract: 'ZkApiVault' },
        { contract: 'Groth16ProofAdapter' },
        {
          title: 'Request circuit hides note id, balance and state signature',
          url: `${SRC}protocol/rust/crates/zkapi-proof/src/groth16.rs#L368-L485`,
        },
      ],
    },
    chainAnalyst: {
      sentiment: 'warning',
      exposure:
        'Ordinary authorizations and their spending bounds stay offchain. If an analyst obtains a request proof, its time and spending bound narrow the eligible notes using public deposit amounts and rounded expiries. A unique eligible note can identify the funding account. A published withdrawal challenge directly identifies the note behind its request proof. There is no pool anonymity between deposit and withdrawal.',
      advice:
        'Check that other active notes can cover your request budget. Avoid authorizing immediately after funding. Choosing a fresh payout address does not remove the published note-id link.',
      interior: {
        sender: 'exposed',
        recipient: 'exposed',
        amount: 'atRisk',
        asset: 'exposed',
        linkage: {
          verdict: 'atRisk',
          note: 'The eligible set may contain only one plausible note.',
        },
      },
      sources: [
        { contract: 'ZkApiVault' },
        {
          title:
            'Authorization checks expiry, balance bound and active-note membership',
          url: `${SRC}protocol/rust/crates/zkapi-proof/src/groth16.rs#L388-L437`,
        },
      ],
    },
    networkObserver: {
      sentiment: 'good',
      exposure:
        'Direct connections reveal IPs and timing to the protocol service, indexer, credential verifier and inference provider. RPCs see funding accounts and withdrawal transactions. The browser fetches a common tree snapshot and derives note paths locally. The desktop companion instead requests paths containing its note id, identifying the deposit to the indexer. Its Go Tor/Wisp transport is separate from the Rust companion HTTP client. Prompts can identify the user independently of funding.',
      advice:
        'Use an inspected browser SDK build with a reviewed production profile, route all traffic and wallet broadcasts through Tor, and read Ethereum through your own node. Changing the pinned RPC requires a reviewed profile and matching manifest. For the desktop client, disable credential reuse and route the whole application, including its Rust companion. The relay setting alone does not cover companion requests.',
      interior: {
        sender: 'exposed',
        recipient: 'exposed',
        amount: {
          verdict: 'atRisk',
          note: 'Request budgets, settlement responses and provider usage reach their respective services over TLS.',
        },
        asset: 'exposed',
        linkage: {
          verdict: 'atRisk',
          note: 'Direct traffic or desktop note-path queries can link authorizations to deposits. A browser using common snapshots and separately isolated network identities avoids this direct link.',
        },
      },
      sources: [
        {
          title: 'Browser derives note paths from the common snapshot',
          url: `${SRC}sdk/services/browserWalletRuntime.js#L829-L845`,
        },
        {
          title: 'Desktop companion queries the indexer by note id',
          url: `${COMPANION}indexer.rs#L69-L104`,
        },
        {
          title: 'Companion patch preserves a separate HTTP client',
          url: `${SRC}zkapi-clientd/internal/zkapi/companion.patch#L271-L321`,
        },
        {
          title: 'Protocol requests construct their own Rust HTTP client',
          url: `${SRC}zkapi-clientd/internal/zkapi/protocol-transport.patch#L23-L80`,
        },
        {
          title: 'Tor route and credential-reuse settings',
          url: `${SRC}zkapi-clientd/cmd/zkapi-clientd/configure.go#L26-L39`,
        },
      ],
    },
    privilegedInsider: {
      sentiment: 'warning',
      exposure:
        'The protocol operator receives the proof, spending bound, timing, lease metadata and billed cost. Randomized commitments hide the exact balance and note, but an operator sharing indexer logs can correlate desktop note-path queries with authorization requests. The credential issuer knows the provider key it issues, and the inference provider sees that key and all content sent with it. The desktop reuses keys across compatible requests by default. Hosted wallet code can read local secrets or substitute future payment instructions. A challenge explicitly associates a submitted authorization with a public note.',
      advice:
        'Run inspected local code, use the browser snapshot path, isolate funding and API network identities, and send no identifying content. Disable desktop key reuse with --key-reuse-window-seconds 0. The issuer and provider still learn the credential and content needed to deliver the service.',
      interior: {
        sender: 'exposed',
        recipient: 'exposed',
        amount: {
          verdict: 'exposed',
          note: 'The operator and provider know individual billed usage even though the remaining note balance is hidden.',
        },
        asset: 'exposed',
        linkage: {
          verdict: 'atRisk',
          note: 'Operator-held metadata and desktop indexer queries can link authorizations to deposits. The proof alone does not reveal the link.',
        },
      },
      sources: [
        {
          title:
            'Operator signs balance updates and persists request transcripts',
          url: `${SRC}crates/zkapi-serverd/src/processor_v2.rs#L1267-L1381`,
        },
        {
          title: 'Desktop request authorizations fetch the active note path',
          url: `${COMPANION}service.rs#L1668-L1685`,
        },
        {
          title: 'Provider access reuse and plaintext boundaries',
          url: `${SRC}zkapi-clientd/docs/PRIVACY.md`,
        },
        {
          title: 'Wallet secrets and recovery state are stored locally',
          url: `${SRC}sdk/services/browserWalletStore.js`,
        },
        {
          contract: 'ZkApiVault',
          title:
            'Challenge calldata links a submitted authorization to its note',
        },
        { section: 'permissions' },
      ],
    },
    futureAdversary: {
      sentiment: 'warning',
      exposure:
        'Deposit and payout links, note totals and published challenges are permanent. Retained service logs can preserve note-path queries, credentials, prompts, timestamps and usage for later correlation. A quantum computer breaks the elliptic-curve signatures and proof soundness used by this protocol. This does not by itself uniquely open uniformly blinded balance commitments or reveal every historical note secret, which is hashed with Poseidon.',
      advice:
        'Treat chain data and information given to providers as permanently available. Preserve local secrets carefully and avoid identifiable prompts. The protocol has no post-quantum proof or signature protection.',
      interior: {
        sender: 'exposed',
        recipient: 'exposed',
        amount: {
          verdict: 'atRisk',
          note: 'Per-request charges require retained offchain records. Note-level totals are already public.',
        },
        asset: 'exposed',
        linkage: {
          verdict: 'atRisk',
          note: 'Retained indexer and service logs can connect authorizations to public deposits.',
        },
      },
      sources: [
        { contract: 'ZkApiVault' },
        {
          title: 'Blinded note-bound commitments and cryptographic assumptions',
          url: `${SRC}docs/note-bound-commitments.md`,
        },
        {
          title: 'Durable operator transcripts',
          url: `${SRC}crates/zkapi-serverd/src/nullifier_store.rs`,
        },
      ],
    },
  },
})
