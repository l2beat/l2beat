import { definePrivacyAdversaries } from '../../common/privacyAdversaries'

// Verdicts backed by .flat/PrivacyPoolsEntrypoint, .flat/PrivacyPool*.sol,
// discovered.json, the privacy-pools-core v1.2.1 circuits and SDK, and the
// privacy-pools-website source. Measurements as of 2026-09-08, block 25,933,805.
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
        "Event sync is forced through 0xbow's own proxy with no option for a public node. On login it looks up the block of each of your deposits, then polls your wallet balance and the withdrawal receipt from the same session. The relayers, Fast Relay and Cloaked, only submit the finished withdrawal.",
      advice: 'Use a client with an RPC setting, such as the raw SDK, pointed at your own node. Nothing in the website avoids the block lookups.',
      sources: [
        {
          title: 'Relayer request',
          url: 'https://github.com/0xbow-io/privacy-pools-website/blob/main/src/utils/relayerClient.ts',
        },
        {
          title: 'Relayer list and event proxy',
          url: 'https://github.com/0xbow-io/privacy-pools-website/blob/main/src/config/chainData.ts',
        },
      ],
    },
    privilegedInsider: {
      sentiment: 'bad',
      exposure:
        'The website sends the labels of all your deposits to the ASP on every load, and the amount you type before withdrawing, so 0xbow can pair your deposits with the withdrawal that follows. The ASP publishes new approved lists with no delay and the pool accepts only the latest one, so it can deny you a private exit or publish a list with just your deposit in it, which the website does not detect.',
      advice:
        'Use a client that fetches the approved list whole and checks it locally, such as Kohaku or the raw SDK, and check the list size before withdrawing.',
      sources: [
        { contract: 'PrivacyPoolsEntrypoint' },
        {
          section: 'permissions',
          title: 'Privacy Pools Multisig and ASP postman',
        },
        {
          title: 'ASP lookup by label',
          url: 'https://github.com/0xbow-io/privacy-pools-website/blob/main/src/utils/aspClient.ts',
        },
        {
          title: 'Amount sent to the ASP before withdrawing',
          url: 'https://github.com/0xbow-io/privacy-pools-website/blob/main/src/containers/Modals/Withdraw/WithdrawForm.tsx',
        },
        {
          title: 'Kohaku fetches the approved list whole',
          url: 'https://github.com/ethereum/kohaku/blob/main/packages/privacy-pools/src/data/0xbowAsp.service.ts',
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
