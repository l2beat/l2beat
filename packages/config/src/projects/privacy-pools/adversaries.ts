import {
  definePrivacyAdversaries,
  PRIVACY_ADVERSARY_SNIPPETS as S,
} from '../../common/privacyAdversaries'

const WEBSITE =
  'https://github.com/0xbow-io/privacy-pools-website/blob/62a962f68def3cbeb801c4259e743fd3d4762928/src/'

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
      sentiment: 'bad',
      exposure:
        "Event sync is forced through 0xbow's own proxy with no option for a public node. On login the app looks up the block of each of your deposits, then polls your wallet balance and the withdrawal receipt from the same session. Relayers receive amount and recipient for a quote.",
      advice:
        'Use a client with an RPC setting, such as the raw SDK, pointed at your own node. The official frontend cannot avoid the lookups.',
      sources: [
        {
          title: "Reads go to Alchemy under 0xbow's key, no RPC setting",
          url: WEBSITE + 'config/wagmiConfig.ts#L46-L58',
        },
        {
          title: "Event sync through 0xbow's Hypersync proxy",
          url: WEBSITE + 'config/chainData.ts#L135-L140',
        },
        {
          title: 'Block lookup for every deposit on login',
          url: WEBSITE + 'utils/sdk.ts#L439-L442',
        },
        {
          title: 'Wallet balance polled every 10 seconds',
          url: WEBSITE + 'providers/ChainProvider.tsx#L126-L133',
        },
        {
          title: 'Withdrawal receipt polled after relay',
          url: WEBSITE + 'hooks/useWithdraw.ts#L414-L416',
        },
        {
          title: 'Login requires a connected wallet',
          url: WEBSITE + 'providers/AuthProvider.tsx#L33-L36',
        },
        {
          title: 'Relayer quote carries amount and recipient',
          url: WEBSITE + 'utils/relayerClient.ts#L45-L58',
        },
      ],
    },
    privilegedInsider: {
      sentiment: 'warning',
      exposure:
        'The ASP postman sets a new approved list at any time with no delay, and the pool accepts only the latest one. It can deny you a private exit or publish a list with only your deposit, which is then your whole anonymity set. The website shows the anonymity set but does not block a tiny one.',
      advice:
        'Check the anonymity set shown before withdrawing, or count the approved list yourself with a client that fetches it whole, such as the raw SDK.',
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
          title: 'Anonymity set shown, not enforced',
          url:
            WEBSITE + 'containers/Modals/Withdraw/WithdrawForm.tsx#L204-L213',
        },
        {
          title: 'Kohaku fetches the approved list whole',
          url: 'https://github.com/ethereum/kohaku/blob/master/packages/privacy-pools/src/data/0xbowAsp.service.ts',
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
          url: 'https://github.com/0xbow-io/privacy-pools-website/blob/main/src/utils/walletSeed.ts',
        },
        { section: 'trusted-setups' },
      ],
    },
  },
})
