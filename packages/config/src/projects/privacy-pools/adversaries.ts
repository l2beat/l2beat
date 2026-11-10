import {
  ADVICE_SNIPPETS as A,
  definePrivacyAdversaries,
  PRIVACY_ADVERSARY_SNIPPETS as S,
} from '../../common/privacyAdversaries'

// v1.privacypools.com serves main 8b3fbf0 (v2.17.0 and a Next.js bump), whose
// diff from this pin touches no network code.
const WEBSITE =
  'https://github.com/0xbow-io/privacy-pools-website/blob/7df411128f7a18a61a77f7a0371bf0b857969e2a/src/'
// v1.2.1, the circuits behind the verified verifiers.
const CIRCUITS =
  'https://github.com/0xbow-io/privacy-pools-core/blob/a80836a47451e662f127af17e11430ffa976c234/packages/circuits/circuits/'

export const privacyPoolsAdversaries = definePrivacyAdversaries({
  promise: {
    protects: 'linkage',
    text: 'Hides which deposit funds which withdrawal, for deposits the ASP approves. Everything else is public.',
  },
  cells: {
    publicObserver: {
      sentiment: 'good',
      exposureShort:
        'A zero-knowledge proof hides which approved deposit a withdrawal spends.',
      exposureContinued:
        'Partial withdrawals leave a change note and look like full ones.',
      sources: [
        { contract: 'PrivacyPoolsEntrypoint' },
        { title: 'Withdrawal circuit', url: CIRCUITS + 'withdraw.circom' },
        {
          contract: 'PrivacyPoolETH',
          title: 'ragequit: only the depositing address, in public',
        },
      ],
    },
    chainAnalyst: {
      sentiment: 'good',
      exposureShort:
        'A relayed withdrawal of a common amount hides among all approved deposits of its pool.',
      exposureContinued: `The approved list at any block is public. Any amount is allowed, so an unusual one pairs a deposit with its withdrawal. ${S.walletFingerprint('relayer')}`,
      sources: [
        {
          contract: 'PrivacyPoolsEntrypoint',
          title: 'relay: anyone can relay, the fee comes from the withdrawal',
        },
        {
          title: 'Blockchain Privacy and Regulatory Compliance (design paper)',
          url: 'https://papers.ssrn.com/sol3/papers.cfm?abstract_id=4563364',
        },
        {
          title: 'Tutela (arXiv:2201.06811)',
          url: 'https://arxiv.org/abs/2201.06811',
        },
      ],
    },
    networkObserver: {
      sentiment: 'good',
      exposureShort:
        "The website works in Tor Browser and scans every pool whole, matching notes locally without revealing the user's deposits to third parties.",
      exposureContinued:
        "Fast Relay receives amount and asset for a quote and the recipient once the user confirms, Cloaked Relay all three with the first quote. The website confirms a relayed withdrawal from bulk reads of new blocks, so no request names its hash. 0xbow's Google Analytics runs without a consent prompt and records the hash of any explorer link the user opens. On a quiet pool, the RPC can time a wallet sign-in against the withdrawal the same session waits for.",
      sources: [
        {
          title: 'Sign-in with a recovery phrase needs no wallet',
          url: WEBSITE + 'providers/AuthProvider.tsx#L39-L47',
        },
        {
          title: 'Pools scanned whole from deployment',
          url: WEBSITE + 'utils/dataService.ts#L11-L34',
        },
        {
          title: 'Relayed withdrawals confirmed without naming the hash',
          url: WEBSITE + 'utils/relayedReceipt.ts#L1-L44',
        },
        {
          title:
            'Recipient sent on confirm, or with the first quote where the relayer requires it',
          url: WEBSITE + 'utils/quotePhases.ts#L4-L140',
        },
      ],
    },
    privilegedInsider: {
      sentiment: 'warning',
      exposureShort:
        'The ASP postman can publish a new approved list at any time with no delay, and withdrawals must prove against the latest one.',
      exposureContinued:
        "It can deny the user a private exit or publish a list containing only their deposit, reducing their anonymity set to one. The website counts the anonymity set it shows from 0xbow's own feed, not from the list the user's withdrawal proves against. 0xbow sees every session's IP at its website and ASP feeds, so it can pair a deposit session with a withdrawal session. It can also change the website at any time.",
      sources: [
        {
          contract: 'PrivacyPoolsEntrypoint',
          title: 'updateRoot: the postman sets a new root with no delay',
        },
        {
          contract: 'PrivacyPoolETH',
          title: 'validWithdrawal: only the latest ASP root is accepted',
        },
        {
          title: "Displayed anonymity set counted from 0xbow's amount feed",
          url: WEBSITE + 'hooks/useASP.ts#L63-L75',
        },
        {
          section: 'permissions',
          title: 'Privacy Pools Multisig and ASP postman',
        },
      ],
    },
    futureAdversary: {
      sentiment: 'good',
      exposureShort:
        'Nothing encrypted is written onchain and commitments are Poseidon hashes, so whoever breaks elliptic-curve cryptography recovers nothing from the chain.',
      exposureContinued: S.walletSignatureAccounts(),
      sources: [
        {
          title: 'Commitment circuit (Poseidon)',
          url: CIRCUITS + 'commitment.circom',
        },
        {
          title: 'Wallet-signature seed derivation',
          url: WEBSITE + 'utils/walletSeed.ts#L40-L73',
        },
        {
          title: 'Random recovery phrase option',
          url: WEBSITE + 'utils/seedPhrase.ts#L3-L7',
        },
        { section: 'trusted-setups' },
      ],
    },
  },
  advice: [
    {
      name: 'Deposit',
      text: `${A.notWalletSignature('from a recovery phrase')} ${A.largestPool} Your usual browser and wallet will do, since the deposit is public.`,
      against: ['futureAdversary', 'chainAnalyst'],
    },
    {
      name: 'Wait',
      text: A.wait,
      against: ['chainAnalyst'],
      randomWait: true,
    },
    {
      name: 'Sign in',
      text: `${A.torBrowser} Sign in with your recovery phrase, so no wallet address is queried. Open no explorer links in that session.`,
      against: ['networkObserver'],
      outside: true,
    },
    {
      name: 'Check',
      text: 'Before withdrawing, find the latest RootUpdated event of the Entrypoint contract and open the list it names on IPFS. Withdraw only if the list holds many deposits.',
      against: ['privilegedInsider'],
      outside: true,
    },
    {
      name: 'Withdraw',
      text: `${A.relayer('relayer')} ${A.commonAmounts} ${A.freshAddress}`,
      against: ['publicObserver', 'chainAnalyst'],
    },
    {
      name: 'Ragequit',
      text: 'Ragequit only deposits you never withdrew from, since ragequitting a change note reveals the withdrawal that left it.',
      against: ['publicObserver'],
    },
  ],
})
