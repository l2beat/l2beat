import {
  definePrivacyAdversaries,
  PRIVACY_ADVERSARY_SNIPPETS as S,
} from '../../common/privacyAdversaries'

// v1.0.0 of the web app, the build privacypools.com serves.
const WEBSITE =
  'https://github.com/0xbow-io/privacy-pools-website-v2/blob/bfb752cdf7c0659bb4fd25e97933e04fce844c4a/'
// v1.0.2 of the monorepo: the circuits behind the live verifiers and the SDK the app vendors.
const MONOREPO =
  'https://github.com/0xbow-io/privacy-pools-v2-monorepo/blob/61fac03acd1fc306164ddc234f7fac4147d04493/'
const DOCS = 'https://privacy-pools-v2-docs.vercel.app/'

export const privacyPoolsV2Adversaries = definePrivacyAdversaries({
  promise: {
    protects: 'linkage',
    text: 'Hides which deposit funds which withdrawal and who pays whom inside the pool, for deposits the ASP approves. Deposits and withdrawals are public.',
  },
  cells: {
    publicObserver: {
      sentiment: 'good',
      exposureShort:
        'A zero-knowledge proof hides which approved notes a withdrawal or transfer spends, and a transfer publishes only encrypted notes.',
      exposureContinued:
        'A relayed transfer pays its fee as a public withdrawal to the relayer, so transfers are visible as events. A ragequit publishes the owner, the amount, the label and the commitment, which names the transaction that created the note. Claiming a payment to an unregistered address registers that wallet.',
      advice:
        'Exit through a relayer, so none of your wallets pay gas for the receiving address. Ragequit only notes you deposited and never spent from. On any other note, a ragequit names the private transaction that created it.',
      interior: {
        sender: 'private',
        recipient: 'private',
        amount: 'private',
        asset: 'private',
        linkage: {
          verdict: 'atRisk',
          note: 'A ragequit names the transaction that created the note.',
        },
      },
      sources: [
        { contract: 'PoolVault' },
        {
          title: 'Transact circuit',
          url:
            MONOREPO + 'packages/circuits/circuits/templates/Transact.circom',
        },
        {
          title: 'Relayed transfers pay the fee as a public output',
          url: DOCS + 'operations/transfer',
        },
        {
          title: 'Ragequit publishes the label and owner',
          url: DOCS + 'operations/ragequit',
        },
      ],
    },
    chainAnalyst: {
      sentiment: 'warning',
      exposureShort:
        "A note's label passes to every later payee, and the ASP update that first approved it often leaves one candidate deposit.",
      exposureContinued: `The ASP adds ten labels per update, decoys included, so an update that follows a single deposit names it. Without a payee, a relayed exit of a common amount hides among every approved deposit of its asset. Any amount is allowed, so an unusual one pairs a deposit with its withdrawal, and a yield deposit's share count encodes the day it was made. ${S.walletFingerprint('relayer')}`,
      advice: `Reshield into another asset before paying someone who should not learn the deposit, since the reshield deposits the funds again under a new label. ${S.largeAnonymitySet} ${S.commonAmounts} ${S.freshExit}`,
      interior: {
        sender: 'private',
        recipient: 'private',
        amount: 'private',
        asset: 'private',
        linkage: {
          verdict: 'atRisk',
          note: "A received note's label, an unusual amount or a share count only one deposit day produces can pair the two ends.",
        },
      },
      sources: [
        {
          title: 'Every output note inherits the label of an input',
          url:
            MONOREPO +
            'packages/circuits/circuits/templates/helpers/ValueConservation.circom',
        },
        {
          contract: 'ASPRegistry',
          title: 'Each root update links its list on IPFS',
        },
        {
          title: 'Share counts encode the exchange rate at deposit',
          url: DOCS + 'concepts/yield-shares',
        },
        {
          title: 'Tutela (arXiv:2201.06811)',
          url: 'https://arxiv.org/abs/2201.06811',
        },
      ],
    },
    networkObserver: {
      sentiment: 'warning',
      exposureShort:
        "The default RPCs, Alchemy under 0xbow's key with a public node as fallback, see the account at sign-in and can time it against the withdrawal.",
      exposureContinued:
        "Network services like the LI.FI swap service and Sentry error reporting receive your IP address unless the app is used over Tor or a VPN, while the Tor mode is not compatible with a local Ethereum node. The app confirms a relayed withdrawal from bulk reads, so no request names it, and the pairing rests on timing, which Tor does not hide. The app downloads the pool's events whole from the ASP and matches notes locally. The relayer learns the recipient at quote time. Tor Browser works, but the relayer refuses many Tor exits and the app offers no other relayer.",
      advice:
        'Set your own node, served over https, as the endpoint for the chain before signing in. Withdraw in a new Tor Browser session signed in with your account key, so no wallet is connected, and retry on a new circuit when the relayer refuses.',
      interior: {
        sender: 'private',
        recipient: 'private',
        amount: 'private',
        asset: 'private',
        linkage: {
          verdict: 'atRisk',
          note: 'Private only from an own node, with a new Tor Browser session for the exit.',
        },
      },
      sources: [
        {
          title: 'Alchemy first, public node last',
          url: WEBSITE + 'config/rpc-order.ts#L55-L70',
        },
        {
          title: 'Allowlist refuses per-note reads and topic filters',
          url: WEBSITE + 'services/egress-policy.ts#L447-L520',
        },
        {
          title: 'The receive quote carries the recipient',
          url: WEBSITE + 'services/egress-policy.ts#L606-L617',
        },
        {
          title: 'Tor needs a gateway the user runs',
          url: WEBSITE + 'config/tor.ts#L1-L50',
        },
      ],
    },
    privilegedInsider: {
      sentiment: 'warning',
      exposureShort:
        'The ASP postman can publish a new approved list at any time with no delay, and every private spend must prove against the latest one.',
      exposureContinued:
        "A list without a deposit's label freezes every note descending from it, and a list with few labels narrows the set to them. 0xbow's relayer sees the IP and recipient of every private exit and its ASP feeds see the IP of every session, so one operator can pair a deposit session with its withdrawal. The request logs of its Alchemy key show it the account each sign-in looks up, which it can time against the withdrawals its relayer submits. One key holds every admin role and can upgrade the four core contracts without delay.",
      advice:
        'Before withdrawing, check the size of the approved list behind the latest root, which the ASPRegistry links on IPFS. Exit as the network observer advice says, so 0xbow sees no IP it saw at the deposit and no account lookup.',
      interior: {
        sender: 'private',
        recipient: {
          verdict: 'atRisk',
          note: 'The relayer sees the recipient of every exit, with the IP that asked.',
        },
        amount: 'private',
        asset: 'private',
        linkage: {
          verdict: 'atRisk',
          note: 'The ASP can narrow the approved list, and 0xbow can pair sessions across ASP, relayer and its Alchemy logs.',
        },
      },
      sources: [
        {
          contract: 'ASPRegistry',
          title: 'updateASPRoot: the postman sets a new root with no delay',
        },
        {
          contract: 'PoolVault',
          title: 'transact: only the latest ASP root is accepted',
        },
        {
          title: 'What the relayer receives, the IP included',
          url: DOCS + 'introduction/threat-model',
        },
        {
          title: 'Alchemy request logs show the key owner each payload',
          url: 'https://www.alchemy.com/docs/alchemy-request-logs',
        },
      ],
    },
    futureAdversary: {
      sentiment: 'bad',
      exposureShort:
        "Every registered account's viewing public key sits in the Keystore, so whoever breaks elliptic-curve cryptography decrypts every note ever sent to it from the chain.",
      exposureContinued: `A decrypted note holds value, token and deposit lineage, which pairs each transfer's commitments with their deposit and recipient. ${S.walletSignatureAccounts()} Breaking the ASP's key the same way decrypts the data that ties each deposit to its label.`,
      interior: {
        sender: 'exposed',
        recipient: 'exposed',
        amount: 'exposed',
        asset: 'exposed',
        linkage: 'exposed',
      },
      sources: [
        {
          contract: 'Keystore',
          title: 'viewingKeys: X25519 public key per account',
        },
        {
          title: 'Notes encrypted with X25519 ECDH and XChaCha20',
          url:
            MONOREPO +
            'packages/core-sdk/src/services/NoteComputationService.ts#L242-L260',
        },
        {
          title: 'Three keys from one wallet signature',
          url:
            MONOREPO +
            'packages/core-sdk/src/services/AbstractCryptoService.ts#L147-L195',
        },
        { section: 'trusted-setups' },
      ],
    },
  },
})
