import {
  definePrivacyAdversaries,
  PRIVACY_ADVERSARY_SNIPPETS as S,
} from '../../common/privacyAdversaries'

export const tornadoCashAdversaries = definePrivacyAdversaries({
  promise: {
    protects: 'linkage',
    text: 'Hides which deposit funds which withdrawal. Everything else is public.',
  },
  cells: {
    publicObserver: {
      sentiment: 'good',
      exposure:
        'Which deposit funds which withdrawal is hidden. Each pool has one fixed amount and no in-pool transfers, so every withdrawal spends exactly one deposit.',
      advice: S.exitViaRelayer('relayer'),
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
      exposure: `The candidates for a withdrawal are the unspent deposits of the same pool, the tracked anonymity set, which differs sharply between pools. Timing, address reuse and relayer choice narrow it further. ${S.walletFingerprint('relayer')}`,
      advice: `${S.largeAnonymitySet} Deposit a large sum as one note. ${S.freshExit}`,
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
        'The app downloads all deposits and matches locally, so a node learns only which pool you looked at. The relayer receives only the finished withdrawal.',
      advice: S.ownNodeAndTor('relayer'),
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
      advice: `${S.localBuild} Otherwise load it from its ENS name or IPFS hash.`,
      sources: [
        { contract: 'Pool_0.1_ETH', title: '0.1 ETH pool (no operator)' },
        { contract: 'InstanceRegistry' },
        { section: 'permissions' },
      ],
    },
    futureAdversary: {
      sentiment: 'warning',
      exposure:
        'Commitments use a Pedersen hash on an elliptic curve. A quantum computer could test whether a given deposit can fund a withdrawal, shrinking the candidate set without singling out one deposit. Notes backed up onchain are encrypted with elliptic-curve keys and become readable.',
      advice: `${S.largeAnonymitySet} Keep the note on your device and skip the onchain backup.`,
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
