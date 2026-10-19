import {
  definePrivacyAdversaries,
  PRIVACY_ADVERSARY_SNIPPETS as S,
} from '../../common/privacyAdversaries'

// v2.16.2, the build privacypools.com serves.
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
      advice: `${S.exitViaRelayer('relayer')} Ragequit only deposits the user never withdrew from, since ragequitting a change note reveals the withdrawal that left it.`,
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
      advice: `${S.largeAnonymitySet} ${S.commonAmounts} ${S.freshExit}`,
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
        "The relayer receives amount and asset for a quote and the recipient once the user confirms. With a wallet sign-in on the default RPC, Alchemy sees the wallet and then the polling for the user's withdrawal, tying the two by timing.",
      advice:
        "Withdraw in a new Tor Browser session, signed in with the user's recovery phrase so no wallet address is queried. Before signing in, set the user's own node as the Ethereum endpoint.",
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
          title: 'A custom endpoint takes over reads and scans',
          url: WEBSITE + 'config/chainData.ts#L660-L689',
        },
        {
          title: 'Recipient sent to the relayer on confirm',
          url: WEBSITE + 'utils/quotePhases.ts#L4-L43',
        },
      ],
    },
    privilegedInsider: {
      sentiment: 'warning',
      exposureShort:
        'The ASP postman can publish a new approved list at any time with no delay, and withdrawals must prove against the latest one.',
      exposureContinued:
        "It can deny the user a private exit or publish a list containing only their deposit, reducing their anonymity set to one. The website counts the anonymity set it shows from 0xbow's own feed, not from the list the user's withdrawal proves against. 0xbow can also change the hosted website at any time.",
      advice: `Before withdrawing, check the size of the approved list behind the latest root, which its RootUpdated event links on IPFS. ${S.localBuild}`,
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
      advice: S.notWalletSignature('from a recovery phrase'),
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
})
