import type { ProjectPrivacyAdversaries } from '../../types'

const CORE = 'https://github.com/0xbow-io/privacy-pools-core/blob/main'
const SITE = 'https://github.com/0xbow-io/privacy-pools-website/blob/main'
const ENTRYPOINT =
  'https://etherscan.io/address/0x6818809EefCe719E480a7526D76bD3e561526b46'

// Verdicts backed by .flat/PrivacyPoolsEntrypoint, .flat/PrivacyPool*.sol,
// discovered.json, the privacy-pools-core v1.2.1 circuits and SDK, and the
// privacy-pools-website source. Measurements as of 2026-09-08, block 25,933,805.
export const privacyPoolsAdversaries: ProjectPrivacyAdversaries = {
  protects: 'linkage',
  cells: {
    publicObserver: {
      sentiment: 'good',
      condition: 'sender, recipient, amount public',
      description:
        'Deposits and withdrawals are plain transactions with depositor, recipient, amount and asset in cleartext; deposits are arbitrary amounts and a note can be withdrawn in parts, leaving a change note whose remaining value is hidden. The one thing hidden is which approved deposit a withdrawal spends: only Poseidon hashes appear onchain and the Groth16 proof reveals nothing else. The approved set is itself public on IPFS, so everyone can see which deposits are excluded. Ragequitting publishes the deposit behind a note and, for a change note, the withdrawal that created it.',
      boundary: {
        sender: {
          verdict: 'leaked',
          note: 'Self-processed withdrawals put a user-controlled gas payer next to the recipient; they are rare in practice.',
        },
        recipient: 'leaked',
        amount: 'leaked',
        asset: 'leaked',
        linkage: {
          verdict: 'hidden',
          note: 'Ragequitting a change note reveals the withdrawal that created it.',
        },
        identity: 'hidden',
      },
      sources: [
        { title: 'Entrypoint deposit / relay', url: `${ENTRYPOINT}#code` },
        {
          title: 'withdraw.circom',
          url: `${CORE}/packages/circuits/circuits/withdraw.circom`,
        },
      ],
    },
    chainAnalyst: {
      sentiment: 'warning',
      condition: 'active pool, common amount, patience',
      description:
        'Amounts are arbitrary and the vetting fee turns round deposits into recognisable 0.995 multiples, so exact-amount matching of a full exit against a single deposit is easy; about a quarter of ETH deposits have a unique amount. Change notes with hidden remaining value and the few-thousand-note ETH pool give a careful user real cover, but no delay is enforced, the approved set at each block is public and bounds the candidate deposits, three relayers carry most withdrawals, and eleven of the fourteen pools are near-empty so a withdrawal there matches a handful of deposits by amount alone.',
      boundary: {
        sender: 'leaked',
        recipient: 'leaked',
        amount: 'leaked',
        asset: 'leaked',
        linkage: {
          verdict: 'atRisk',
          note: 'Use the ETH, USDC or USDT pool, withdraw common amounts rather than a full exit, wait, never ragequit a change note.',
        },
        identity: {
          verdict: 'atRisk',
          note: 'Exchange KYC on the depositor or on the address the recipient sweeps to.',
        },
      },
      sources: [
        {
          title: 'Blockchain Privacy and Regulatory Compliance (design paper)',
          url: 'https://papers.ssrn.com/sol3/papers.cfm?abstract_id=4563364',
        },
        {
          title: 'Tutela heuristics (arXiv:2201.06811)',
          url: 'https://arxiv.org/abs/2201.06811',
        },
      ],
    },
    networkObserver: {
      sentiment: 'warning',
      condition: 'raw SDK and Tor needed',
      description:
        "The SDK syncs by downloading every deposit, withdrawal and ragequit event of every pool and matches notes locally, so the RPC learns nothing about the user. The reference website, however, sends the labels of all the user's own deposits to the association set provider API on every account load, so the ASP learns IP and deposit set, and it then sends the recipient to one of two hardcoded relayers from the same IP. Anyone seeing both requests recovers the link. Neither request is needed by the protocol: the approved set is public on IPFS and relaying is permissionless, but the website offers no way to avoid them. Error reports also send wallet address and recipient to Sentry.",
      boundary: {
        sender: 'leaked',
        recipient: 'leaked',
        amount: 'leaked',
        asset: 'leaked',
        linkage: {
          verdict: 'atRisk',
          note: 'Whoever sees both the ASP label lookup and the relayer request from one IP links deposit to withdrawal; avoidable only with the raw SDK, IPFS leaves and own relaying.',
        },
        identity: {
          verdict: 'atRisk',
          note: 'ASP learns IP and deposit set; relayer learns IP and recipient; Tor removes the IP.',
        },
      },
      sources: [
        {
          title: 'ASP lookup by label (X-Labels header)',
          url: `${SITE}/src/utils/aspClient.ts`,
        },
        { title: 'Relayer request', url: `${SITE}/src/utils/relayerClient.ts` },
        {
          title: 'SDK full-range event sync',
          url: `${CORE}/packages/sdk/src/core/data.service.ts`,
        },
      ],
    },
    privilegedInsider: {
      sentiment: 'bad',
      condition: 'ASP decides who exits privately',
      description:
        'Private withdrawals must prove membership in the latest association set root, which a 2-of-4 multisig or a single EOA posts about hourly with no delay. Declining a deposit, or dropping an approved one from later roots, leaves the depositor only a public ragequit; about one in six ETH deposits is currently outside the set. Posting a root that contains only a target deposit deanonymizes the next withdrawal proven against it, and the website does not check the set size. The same multisig can upgrade the Entrypoint, remove pools and set fees instantly. No role can decrypt anything, and past private withdrawals stay unlinkable, because there are no keys and no encrypted data.',
      boundary: {
        sender: 'leaked',
        recipient: 'leaked',
        amount: 'leaked',
        asset: 'leaked',
        linkage: {
          verdict: 'atRisk',
          note: 'The ASP postman can deanonymize a targeted withdrawal by posting a partitioned root; detectable afterwards, not preventable.',
        },
        identity: {
          verdict: 'atRisk',
          note: "The ASP operator also runs the API that receives the user's labels and IP.",
        },
      },
      sources: [
        { title: 'Entrypoint roles and updateRoot', url: `${ENTRYPOINT}#code` },
        {
          title: 'Privacy Pools Multisig (2 of 4)',
          url: 'https://etherscan.io/address/0xAd7f9A19E2598b6eFE0A25C84FB1c87F81eB7159',
        },
      ],
    },
    futureAdversary: {
      sentiment: 'good',
      condition: 'seed-phrase account, not wallet-derived',
      description:
        "Nothing encrypted is written onchain. Commitments and nullifiers are Poseidon hashes of random secrets, and the Groth16 proofs are perfectly zero-knowledge, so a quantum computer recovers nothing from the chain and a compromised trusted setup only enables forged withdrawals. The exception is the website's default account creation, which derives the seed from a deterministic wallet signature over a fixed message: a quantum adversary who recovers the wallet key from any of its signatures recomputes every note of that account. Users who wrote down a seed phrase are unaffected.",
      boundary: {
        sender: 'leaked',
        recipient: 'leaked',
        amount: 'leaked',
        asset: 'leaked',
        linkage: {
          verdict: 'atRisk',
          note: "Hidden for seed-phrase accounts; wallet-derived accounts reduce to the wallet's secp256k1 key.",
        },
        identity: {
          verdict: 'atRisk',
          note: 'Inherits what the chain analyst learns.',
        },
      },
      sources: [
        {
          title: 'Poseidon commitment circuit',
          url: `${CORE}/packages/circuits/circuits/commitment.circom`,
        },
        {
          title: 'Wallet-signature seed derivation',
          url: `${SITE}/src/utils/walletSeed.ts`,
        },
      ],
    },
  },
}
