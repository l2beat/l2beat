import {
  definePrivacyAdversaries,
  PRIVACY_ADVERSARY_SNIPPETS as S,
} from '../../common/privacyAdversaries'

// v2.16.0, the release that added the custom RPC setting (PR #246).
const WEBSITE =
  'https://github.com/0xbow-io/privacy-pools-website/blob/f34be7cb666b0607130c8a134973b3b30c33feb1/src/'

export const privacyPoolsAdversaries = definePrivacyAdversaries({
  promise: {
    protects: 'linkage',
    text: 'Hides which deposit funds which withdrawal, for deposits approved by the permissioned ASP. Everything else is public.',
  },
  cells: {
    publicObserver: {
      sentiment: 'good',
      exposure:
        'Which approved deposit a withdrawal spends is hidden. Partial withdrawals leave a change note and look like full ones.',
      advice: `${S.exitViaRelayer('relayer')} Withdraw partially to fresh addresses, and ragequit only untouched deposits: ragequitting a change note reveals the withdrawal it came from.`,
      sources: [
        { contract: 'PrivacyPoolsEntrypoint' },
        {
          title: 'Withdrawal circuit',
          url: 'https://github.com/0xbow-io/privacy-pools-core/blob/main/packages/circuits/circuits/withdraw.circom',
        },
      ],
    },
    chainAnalyst: {
      sentiment: 'good',
      exposure: `The approved set at any block is public, bounding the anonymity set. Any amount is allowed, so an unusual one pairs a deposit with its withdrawal. ${S.walletFingerprint('relayer')}`,
      advice: `${S.largeAnonymitySet} ${S.commonAmounts} ${S.freshExit}`,
      sources: [
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
      exposure:
        "The official frontend allows you to set your own RPC endpoint per network, scans every pool whole and matches notes locally, so a node learns only which pools you looked at. 0xbow's servers still see that a session happened, through bulk feeds that carry nothing about the notes. A relayer receives amount and asset for a quote and the recipient once you confirm.",
      advice: `Set an endpoint for every network before signing in, and sign in with a recovery phrase so no wallet address is queried. Without an endpoint, every read goes through 0xbow's proxy and Alchemy under 0xbow's key. ${S.ownNodeAndTor('relayer')}`,
      sources: [
        {
          title:
            'RPC setting, one endpoint per network, offered before sign-in',
          url: WEBSITE + 'containers/Header.tsx#L39',
        },
        {
          title: 'Event sync and reads both move to the custom endpoint',
          url: WEBSITE + 'config/chainData.ts#L667-L682',
        },
        {
          title: 'Networks without an endpoint are skipped, not proxied',
          url: WEBSITE + 'config/customRpc.ts#L638-L642',
        },
        {
          title:
            "Default reads through 0xbow's Hypersync proxy and Alchemy key",
          url: WEBSITE + 'config/chainData.ts#L140-L141',
        },
        {
          title: 'Pools scanned whole from deployment, dates from bulk logs',
          url: WEBSITE + 'utils/dataService.ts#L11-L25',
        },
        {
          title: 'No block lookup per deposit',
          url: WEBSITE + 'utils/sdk.ts#L510-L516',
        },
        {
          title: 'Relayed receipt read from bulk logs, hash never sent',
          url: WEBSITE + 'utils/relayedReceipt.ts#L3-L44',
        },
        {
          title: 'Wallet balance read on a fixed cadence',
          url: WEBSITE + 'providers/ChainProvider.tsx#L125-L147',
        },
        {
          title: 'Recipient sent to the relayer on confirm only',
          url: WEBSITE + 'utils/quotePhases.ts#L4-L10',
        },
        {
          title: 'Sign-in with a recovery phrase needs no wallet',
          url: WEBSITE + 'providers/AuthProvider.tsx#L39-L47',
        },
      ],
    },
    privilegedInsider: {
      sentiment: 'warning',
      exposure:
        'The ASP postman sets a new approved list at any time with no delay, and the pool accepts only the latest one. It can deny you a private exit or publish a list with only your deposit, which is then your whole anonymity set. The website shows the anonymity set but does not block a tiny one.',
      advice:
        'Check the displayed anonymity set shown before withdrawing.',
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
          section: 'permissions',
          title: 'Privacy Pools Multisig and ASP postman',
        },
        {
          title: 'Anonymity set counted locally from the published list',
          url:
            WEBSITE + 'containers/Modals/Withdraw/WithdrawForm.tsx#L175-L180',
        },
        {
          title: 'Anonymity set shown, not enforced',
          url:
            WEBSITE +
            'containers/Modals/Withdraw/AmountInputSection.tsx#L94-L95',
        },
      ],
    },
    futureAdversary: {
      sentiment: 'good',
      exposure: `Nothing encrypted is written onchain and commitments are plain hashes, so a quantum computer recovers nothing. ${S.walletSignatureAccounts()}`,
      advice: S.notWalletSignature('from a seed phrase'),
      sources: [
        {
          title: 'Commitment circuit (Poseidon)',
          url: 'https://github.com/0xbow-io/privacy-pools-core/blob/main/packages/circuits/circuits/commitment.circom',
        },
        {
          title: 'Wallet-signature seed derivation',
          url: WEBSITE + 'utils/walletSeed.ts#L40-L73',
        },
        {
          title: 'Random seed phrase option',
          url: WEBSITE + 'utils/seedPhrase.ts#L3-L7',
        },
        { section: 'trusted-setups' },
      ],
    },
  },
})
