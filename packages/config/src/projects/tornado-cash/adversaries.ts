import { definePrivacyAdversaries } from '../../common/privacyAdversaries'

// Verdicts backed by pool sources (.flat/Pool_*.sol), discovered.json and the
// linked client repositories. Measurements as of 2026-09-08, block 25,931,789.
export const tornadoCashAdversaries = definePrivacyAdversaries({
  promise: {
    protects: 'linkage',
    text: 'Hides which deposit funds which withdrawal. Everything else is public.',
  },
  cells: {
    publicObserver: {
      sentiment: 'good',
      exposure:
        'Which deposit paid for which withdrawal is hidden. Each pool has a fixed amount, so who deposited, who withdrew and how much is public.',
      advice:
        'Withdraw through a relayer, so no wallet of yours pays the gas next to the receiving address.',
      sources: [
        { contract: 'Pool_1_ETH', title: '1 ETH pool' },
        {
          title: 'Withdrawal circuit',
          url: 'https://github.com/tornadocash/tornado-core/blob/master/circuits/withdraw.circom',
        },
      ],
    },
    chainAnalyst: {
      sentiment: 'good',
      exposure:
        'Every withdrawal spends one deposit of the same fixed amount, so the candidates are the unspent notes in that pool, the tracked anonymity set, which differs sharply between pools. Timing and address reuse narrow the set further.',
      advice:
        'Use a pool with a large anonymity set, wait days or weeks before withdrawing, withdraw to a fresh address that never touches your other wallets, and deposit a large sum as one note.',
      sources: [
        {
          title: 'Tutela (arXiv:2201.06811)',
          url: 'https://arxiv.org/abs/2201.06811',
        },
        {
          title: 'Blockchain is Watching You (arXiv:2005.14051)',
          url: 'https://arxiv.org/abs/2005.14051',
        },
      ],
    },
    networkObserver: {
      sentiment: 'good',
      exposure:
        'The app downloads all deposits and searches locally, so a node learns only which pool you looked at. The relayer only submits the finished withdrawal.',
      sources: [
        {
          title: 'Event sync (classic UI)',
          url: 'https://github.com/tornadocash/tornado-classic-ui/blob/master/services/events.js',
        },
        {
          title: 'Relayer endpoint',
          url: 'https://github.com/tornadocash/tornado-relayer/blob/master/src/contollers/controller.js',
        },
      ],
    },
    privilegedInsider: {
      sentiment: 'good',
      exposure:
        'The pools cannot be paused, upgraded or made to reveal anything. Governance controls only the website, the router and the relayer list.',
      advice:
        'Load the frontend from its ENS name or run it locally; a tampered copy could read your notes.',
      sources: [
        { contract: 'Pool_0.1_ETH', title: '0.1 ETH pool (no operator)' },
        { contract: 'InstanceRegistry' },
        { section: 'permissions' },
      ],
    },
    futureAdversary: {
      sentiment: 'warning',
      exposure:
        'Whether a quantum computer can invert the Pedersen hash that hides the link is an open question. The proofs themselves reveal nothing, ever. Notes backed up onchain are exposed outright.',
      advice:
        'Keep the note only on your device and skip the onchain backup option.',
      sources: [
        {
          title: 'Pedersen hash (circomlib)',
          url: 'https://github.com/iden3/circomlib/blob/master/circuits/pedersen.circom',
        },
        { contract: 'TornadoRouter', title: 'Onchain note backups' },
      ],
    },
  },
})
