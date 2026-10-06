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
    text: 'Inference request proofs hide the paying Ethereum deposit. Deposits and withdrawals remain publicly linked by note id. The issuer knows the API credential, and the inference provider receives it along with prompts and responses.',
  },
  fieldDescriptions: {
    linkage:
      'Whether an API authorization can be tied to the deposit funding it.',
  },
  cells: {
    publicObserver: {
      sentiment: 'good',
      exposure:
        'Ordinary API authorizations stay offchain and hide the paying note. Deposits publish the funder, amount and note id; withdrawals publish the same note id, payout address and remaining balance, revealing total consumption. An escape challenge publishes a request proof linked to its funding note.',
      advice:
        'Treat funding, payouts and total consumption as public. Use addresses you accept being linked. An escape dispute also reveals an authorization.',
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
        'The anonymity set is small, limited to zkapi users. Only eligible zkAPI notes can fund an authorization. If an analyst obtains its proof, timing and spending bounds can narrow the candidates to one deposit. An escape challenge directly identifies the funding note. Deposits and withdrawals are publicly linked.',
      advice:
        'Check that other active notes could cover your request budget. Wait before using a new deposit. A fresh payout address still remains linked to the deposit.',
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
      sentiment: 'warning',
      exposure:
        'Tor hides the source IP, but shared circuits and timing can still link deposits to API authorizations. The browser app derives note paths from a common snapshot. The local daemon (zkapi-clientd) queries by public note id before authorization; indexing and authorization share a hostname. Its Tor setting covers the Rust wallet companion, but neither client isolates unrelated operations onto separate Tor circuits or obscures request timing.',
      advice:
        'Prefer the browser app, route the app and wallet broadcasts through Tor, and wait before using a new deposit. For zkapi-clientd, configure a local Tor SOCKS proxy and disable key reuse. These settings do not provide circuit isolation or prevent timing correlation. Using your own Ethereum node requires a reviewed deployment profile and matching manifest.',
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
          note: 'Note-id queries, shared Tor circuits and timing can link authorizations to deposits. Browser snapshots avoid disclosing the queried note id, but do not remove timing correlation.',
        },
      },
      sources: [
        {
          title: 'Browser derives note paths from the common snapshot',
          url: `${SRC}sdk/services/browserWalletRuntime.js#L829-L845`,
        },
        {
          title: 'Local daemon queries the indexer by public note id',
          url: `${COMPANION}indexer.rs#L71-L80`,
        },
        {
          title: 'Indexer and authorization service share a hostname',
          url: `${SRC}zkapi-clientd/internal/zkapi/deployments/mainnet.json#L20-L22`,
        },
        {
          title: 'SOCKS transport supplies no Tor isolation credentials',
          url: `${SRC}zkapi-clientd/internal/relay/socks5.go#L53-L59`,
        },
        {
          title: 'Companion inherits the configured local CONNECT proxy',
          url: `${SRC}zkapi-clientd/internal/zkapi/companion.go#L109-L127`,
        },
        {
          title: 'CONNECT bridge uses the same SOCKS or Wisp route as Go',
          url: `${SRC}zkapi-clientd/internal/relay/connect.go#L18-L44`,
        },
        {
          title: 'Browser fetches its snapshot and quote before proving',
          url: `${SRC}sdk/services/browserWalletRuntime.js#L1624-L1659`,
        },
      ],
    },
    privilegedInsider: {
      sentiment: 'bad',
      exposure:
        "During an escape withdrawal, the zkAPI operator can publish a request proof linked to it. It also receives authorization timing, budgets and billed usage, and can time-correlate the local daemon's note-id queries with requests. The issuer knows the API credential. The provider sees prompts and responses and can link requests sharing it. Hosted wallet code can read secrets or redirect payments.",
      advice:
        "Run inspected local code and avoid identifying prompts. Prefer the browser's common snapshots. For zkapi-clientd, set --key-reuse-window-seconds 0. These steps do not prevent the operator from linking an authorization to its note through an escape challenge.",
      interior: {
        sender: 'exposed',
        recipient: 'exposed',
        amount: {
          verdict: 'exposed',
          note: 'The operator and provider know individual billed usage even though the remaining note balance is hidden.',
        },
        asset: 'exposed',
        linkage: {
          verdict: 'exposed',
          note: 'An operator can publish an escape challenge linking its request proof to the public funding note.',
        },
      },
      sources: [
        {
          title:
            'Operator signs balance updates and persists request transcripts',
          url: `${SRC}crates/zkapi-serverd/src/processor_v2.rs#L1267-L1381`,
        },
        {
          title: 'Local daemon fetches the note path before authorization',
          url: `${COMPANION}service.rs#L1648-L1685`,
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
        'Deposit and payout links, note totals and published challenges are permanent. Retained service logs can connect note-id queries, credentials, prompts and timing. Quantum attacks threaten signatures and proof soundness, but do not by themselves reveal hashed note secrets or uniquely open blinded balances.',
      advice:
        'Treat public chain data as permanent and assume providers may retain what you send. Protect local secrets and avoid identifying prompts.',
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
