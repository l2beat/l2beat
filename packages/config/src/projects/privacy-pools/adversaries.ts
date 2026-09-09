import { definePrivacyAdversaries } from '../../common/privacyAdversaries'

const CORE = 'https://github.com/0xbow-io/privacy-pools-core/blob/main'
const SITE = 'https://github.com/0xbow-io/privacy-pools-website/blob/main'
const ENTRYPOINT =
  'https://etherscan.io/address/0x6818809EefCe719E480a7526D76bD3e561526b46'

// Verdicts backed by .flat/PrivacyPoolsEntrypoint, .flat/PrivacyPool*.sol,
// discovered.json, the privacy-pools-core v1.2.1 circuits and SDK, and the
// privacy-pools-website source. Measurements as of 2026-09-08, block 25,933,805.
export const privacyPoolsAdversaries = definePrivacyAdversaries({
  promise: {
    protects: 'linkage',
    text: 'Hides which deposit funds which withdrawal, for deposits the association set approves. Everything else is public.',
  },
  cells: {
    publicObserver: {
      sentiment: 'good',
      condition: 'sender, recipient, amount public',
      exposure:
        'Deposits and withdrawals show address, amount and asset, and the list of approved deposits is public. Hidden is which approved deposit a withdrawal spends.',
      advice:
        'Withdraw through a relayer, and never ragequit a change note: that reveals the withdrawal it came from.',
      boundary: {
        sender: {
          verdict: 'exposed',
          note: 'Self-processed withdrawals put a user-controlled gas payer next to the recipient; they are rare in practice.',
        },
        recipient: 'exposed',
        amount: 'exposed',
        asset: 'exposed',
        linkage: {
          verdict: 'private',
          note: 'Ragequitting a change note reveals the withdrawal that created it.',
        },
        identity: 'private',
      },
      sources: [
        { contract: 'PrivacyPoolsEntrypoint' },
        {
          title: 'Withdrawal circuit',
          url: 'https://github.com/0xbow-io/privacy-pools-core/blob/main/packages/circuits/circuits/withdraw.circom',
        },
      ],
    },
    chainAnalyst: {
      sentiment: 'warning',
      condition: 'active pool, common amount, patience',
      exposure:
        'Amounts are arbitrary and full exits often match one deposit exactly, so an analyst links many users by amount and timing. Only the ETH, USDC and USDT pools have enough activity to hide in.',
      advice:
        'Use an active pool, withdraw common amounts rather than everything at once, wait before withdrawing, and use a fresh address.',
      boundary: {
        sender: 'exposed',
        recipient: 'exposed',
        amount: 'exposed',
        asset: 'exposed',
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
      exposure:
        "The SDK syncs by downloading every deposit, withdrawal and ragequit event of every pool and matches notes locally, so the RPC learns nothing about the user. The reference website, however, sends the labels of all the user's own deposits to the association set provider API on every account load, so the ASP learns IP and deposit set, and it then sends the recipient to one of two hardcoded relayers from the same IP. Anyone seeing both requests recovers the link. Neither request is needed by the protocol: the approved set is public on IPFS and relaying is permissionless, but the website offers no way to avoid them. Error reports also send wallet address and recipient to Sentry.",
      boundary: {
        sender: 'exposed',
        recipient: 'exposed',
        amount: 'exposed',
        asset: 'exposed',
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
          title: 'ASP lookup by label',
          url: 'https://github.com/0xbow-io/privacy-pools-website/blob/main/src/utils/aspClient.ts',
        },
        {
          title: 'Relayer request',
          url: 'https://github.com/0xbow-io/privacy-pools-website/blob/main/src/utils/relayerClient.ts',
        },
        {
          title: 'SDK event sync',
          url: 'https://github.com/0xbow-io/privacy-pools-core/blob/main/packages/sdk/src/core/data.service.ts',
        },
      ],
    },
    privilegedInsider: {
      sentiment: 'bad',
      condition: 'ASP decides who exits privately',
      exposure:
        'Withdrawing privately requires your deposit to be in the current approved list, which a 2-of-4 multisig or a single key publishes hourly with no delay. They can leave you only a public exit, and can single out one deposit by publishing a list with just that one in it.',
      boundary: {
        sender: 'exposed',
        recipient: 'exposed',
        amount: 'exposed',
        asset: 'exposed',
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
        { contract: 'PrivacyPoolsEntrypoint' },
        { section: 'permissions' },
      ],
    },
    futureAdversary: {
      sentiment: 'good',
      condition: 'seed-phrase account, not wallet-derived',
      exposure:
        "Nothing encrypted is written onchain. Commitments and nullifiers are Poseidon hashes of random secrets, and the Groth16 proofs are perfectly zero-knowledge, so a quantum computer recovers nothing from the chain and a compromised trusted setup only enables forged withdrawals. The exception is the website's default account creation, which derives the seed from a deterministic wallet signature over a fixed message: a quantum adversary who recovers the wallet key from any of its signatures recomputes every note of that account. Users who wrote down a seed phrase are unaffected.",
      boundary: {
        sender: 'exposed',
        recipient: 'exposed',
        amount: 'exposed',
        asset: 'exposed',
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
          title: 'Commitment circuit (Poseidon)',
          url: 'https://github.com/0xbow-io/privacy-pools-core/blob/main/packages/circuits/circuits/commitment.circom',
        },
        {
          title: 'Wallet-signature seed derivation',
          url: 'https://github.com/0xbow-io/privacy-pools-website/blob/main/src/utils/walletSeed.ts',
        },
        { section: 'trusted-setups' },
      ],
    },
  },
})
