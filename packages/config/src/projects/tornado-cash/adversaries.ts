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
        'Which deposit paid for which withdrawal is private. Each pool has a fixed amount and there are no in-pool transfers, meaning each withdrawal is funded by exactly one deposit.',
      advice:
        'Withdraw through a relayer, so no wallet of yours pays the gas to the receiving address.',
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
        'Every withdrawal spends one deposit of the same fixed amount, so the candidates are the unspent notes in that pool, the tracked anonymity set, which differs sharply between pools. Timing, address reuse, gas and relayer fingerprinting narrow the set further.',
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
      advice:
        'Use a local node for reading the blockchain and a public RPC via Tor to send your transaction and disassociate it from your IP. Use a popular relayer.',
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
        'Load a publicly audited version of the app from its ENS name or IPFS hash or run it locally. Do not use IPFS gateways.',
      sources: [
        { contract: 'Pool_0.1_ETH', title: '0.1 ETH pool (no operator)' },
        { contract: 'InstanceRegistry' },
        { section: 'permissions' },
      ],
    },
    futureAdversary: {
      sentiment: 'warning',
      exposure:
        'A quantum computer that solves discrete logs on the Pedersen curve reduces the commitment to a structured equation over the secret, so an attacker is expected to be able to test whether a given deposit could fund a withdrawal. This shrinks the candidate set but does not single out the deposit, since many unrelated deposits pass the test. The proofs themselves reveal nothing. Notes backed up onchain are not post-quantum secure.',
      advice:
        'Use a pool with a large anonymity set, since the quantum test only shrinks the candidate set. Keep the note only on your device and skip the onchain backup option.',
      sources: [
        {
          title: 'Pedersen hash circuit (pinned circomlib fork)',
          url: 'https://github.com/tornadocash/circomlib/blob/c372f14d324d57339c88451834bf2824e73bbdbc/circuits/pedersen.circom',
        },
        {
          title: 'Commitment and nullifier hashing',
          url: 'https://github.com/tornadocash/tornado-core/blob/v2.1/circuits/withdraw.circom',
        },
        { contract: 'TornadoRouter', title: 'Onchain note backups' },
      ],
    },
  },
})
