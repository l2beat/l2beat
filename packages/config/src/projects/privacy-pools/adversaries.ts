import { definePrivacyAdversaries } from '../../common/privacyAdversaries'

export const privacyPoolsAdversaries = definePrivacyAdversaries({
  promise: {
    protects: 'linkage',
    text: 'Hides which deposit funds which withdrawal for deposits that the permissioned association set provider approves. Everything else is public.',
  },
  cells: {
    publicObserver: {
      sentiment: 'good',
      exposure:
        'Which approved deposit a withdrawal spends is hidden. Partial withdrawals with change notes are supported and indistinguishable from full withdrawals, but cannot consume more than a single deposit.',
      advice:
        'Withdraw through a relayer. Use partial withdrawals to fresh addresses. Ragequit only untouched deposits. Ragequitting a change note reveals the withdrawal it came from.',
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
      exposure:
        'The approved set at any block is public, so the candidates for a withdrawal are known exactly and matched by amount and timing. Any amount is allowed, so an unusual one pairs a deposit with its withdrawal. The anonymity set differs sharply between pools.',
      advice:
        'Use a pool with a large anonymity set. Withdraw common amounts rather than everything at once, wait before withdrawing, and use a fresh address.',
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
      sentiment: 'bad',
      exposure:
        "Event sync is forced through 0xbow's own proxy with no option for a public node. On login it looks up the block of each of your deposits, then polls your wallet balance and the withdrawal receipt from the same session. The relayers receive amount and recipient for a quote and then submit the finished withdrawal.",
      advice:
        'Do not use the official frontend. Use a client with an RPC setting, such as the raw SDK, pointed at your own node. Nothing in the website avoids the block lookups.',
      sources: [
        {
          title: "Reads go to Alchemy under 0xbow's key, no RPC setting",
          url: 'https://github.com/0xbow-io/privacy-pools-website/blob/62a962f68def3cbeb801c4259e743fd3d4762928/src/config/wagmiConfig.ts#L46-L58',
        },
        {
          title: "Event sync through 0xbow's Hypersync proxy",
          url: 'https://github.com/0xbow-io/privacy-pools-website/blob/62a962f68def3cbeb801c4259e743fd3d4762928/src/config/chainData.ts#L135-L140',
        },
        {
          title: 'Block lookup for every deposit on login',
          url: 'https://github.com/0xbow-io/privacy-pools-website/blob/62a962f68def3cbeb801c4259e743fd3d4762928/src/utils/sdk.ts#L439-L442',
        },
        {
          title: 'Wallet balance polled every 10 seconds',
          url: 'https://github.com/0xbow-io/privacy-pools-website/blob/62a962f68def3cbeb801c4259e743fd3d4762928/src/providers/ChainProvider.tsx#L126-L133',
        },
        {
          title: 'Withdrawal receipt polled after relay',
          url: 'https://github.com/0xbow-io/privacy-pools-website/blob/62a962f68def3cbeb801c4259e743fd3d4762928/src/hooks/useWithdraw.ts#L414-L416',
        },
        {
          title: 'Login requires a connected wallet',
          url: 'https://github.com/0xbow-io/privacy-pools-website/blob/62a962f68def3cbeb801c4259e743fd3d4762928/src/providers/AuthProvider.tsx#L33-L36',
        },
        {
          title: 'Relayer quote carries amount and recipient',
          url: 'https://github.com/0xbow-io/privacy-pools-website/blob/62a962f68def3cbeb801c4259e743fd3d4762928/src/utils/relayerClient.ts#L45-L58',
        },
      ],
    },
    privilegedInsider: {
      sentiment: 'warning',
      exposure:
        'The ASP postman new lists and the pool accepts only the latest one, so they can deny you a private exit or publish a list with just your deposit in it. The website shows the anonymity set for your amount but does not block a tiny one. It requests only pool-wide data from the ASP, so the operator and rpc provider can learn which deposits are yours only from the RPC traffic described under network observer.',
      advice:
        'Check the anonymity set shown before withdrawing or count the approved list yourself with a client that fetches it whole, such as the raw SDK.',
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
          title:
            'ASP requests are pool-wide, per-label lookup is legacy migration only',
          url: 'https://github.com/0xbow-io/privacy-pools-website/blob/62a962f68def3cbeb801c4259e743fd3d4762928/src/utils/aspClient.ts#L163-L170',
        },
        {
          title: 'Approval derived locally from the whole leaf set',
          url: 'https://github.com/0xbow-io/privacy-pools-website/blob/62a962f68def3cbeb801c4259e743fd3d4762928/src/utils/accountStatus.ts#L11-L36',
        },
        {
          title: 'Anonymity set shown, not enforced',
          url: 'https://github.com/0xbow-io/privacy-pools-website/blob/62a962f68def3cbeb801c4259e743fd3d4762928/src/containers/Modals/Withdraw/WithdrawForm.tsx#L204-L213',
        },
        {
          title: 'Count reads unavailable until the feed carries review status',
          url: 'https://github.com/0xbow-io/privacy-pools-website/blob/62a962f68def3cbeb801c4259e743fd3d4762928/src/utils/anonymitySet.ts#L1-L21',
        },
        {
          title: 'Kohaku fetches the approved list whole',
          url: 'https://github.com/ethereum/kohaku/blob/master/packages/privacy-pools/src/data/0xbowAsp.service.ts',
        },
      ],
    },
    futureAdversary: {
      sentiment: 'good',
      exposure:
        "Nothing encrypted is written onchain and commitments are plain hashes, so a quantum computer recovers nothing, except for accounts created from a wallet signature, which reduce to that wallet's key.",
      advice:
        'Create your account from a seed phrase, not from a wallet signature.',
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
