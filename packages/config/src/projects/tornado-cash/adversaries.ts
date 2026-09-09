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
      condition: 'sender, recipient, amount public',
      sentiment: 'good',
      exposure:
        'Everyone can see who deposited, who withdrew and how much, since each pool has a fixed amount. What nobody can see is which deposit paid for which withdrawal.',
      advice:
        'Withdraw through a relayer, so that no wallet of yours pays the gas and appears next to the receiving address.',
      boundary: {
        sender: 'exposed',
        recipient: 'exposed',
        amount: 'exposed',
        asset: 'exposed',
        linkage: 'private',
        identity: 'private',
      },
      sources: [
        { contract: 'Pool_1_ETH', title: '1 ETH pool' },
        {
          title: 'Withdrawal circuit',
          url: 'https://github.com/tornadocash/tornado-core/blob/master/circuits/withdraw.circom',
        },
      ],
    },
    chainAnalyst: {
      condition:
        'private with patience, an active pool and a fresh exit address',
      sentiment: 'good',
      exposure:
        "Every withdrawal spends exactly one deposit of the same fixed amount, so the analyst's candidates are the unspent notes in that pool at that moment: a few thousand in the ETH pools, a handful in the stablecoin and WBTC pools. No delay is enforced, so timing and address reuse narrow that set further.",
      advice:
        'Use the ETH pools, wait days or weeks before withdrawing, withdraw to a fresh address that never touches your other wallets, and deposit a large sum as one note.',
      boundary: {
        sender: 'exposed',
        recipient: 'exposed',
        amount: 'exposed',
        asset: 'exposed',
        linkage: {
          verdict: 'atRisk',
          note: 'Wait long, use active pools only, use each address once, deposit as one note, and let a relayer pay the withdrawal gas.',
        },
        identity: {
          verdict: 'atRisk',
          note: 'Exchange KYC on the deposit address plus timing identifies most single-note users.',
        },
      },
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
      condition: 'IP to relayer unless Tor',
      sentiment: 'good',
      exposure:
        'Your note never leaves your device: the app downloads all deposits and searches locally, so a node operator learns only which pool you looked at. The relayer sees your withdrawal, which is public a minute later anyway, plus your IP address.',
      advice: 'Use Tor when you withdraw and sync from your own node.',
      boundary: {
        sender: 'exposed',
        recipient: 'exposed',
        amount: 'exposed',
        asset: 'exposed',
        linkage: 'private',
        identity: {
          verdict: 'atRisk',
          note: 'The default UI exposes the IP to every probed relayer and to The Graph unless routed through Tor; note-account recovery sends the wallet address to The Graph.',
        },
      },
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
      condition: 'no role can see or block',
      sentiment: 'good',
      exposure:
        'Nobody holds a key or a switch over the pools: they cannot be paused, upgraded or made to reveal anything. Governance controls only the website, the router and the relayer list.',
      advice:
        'Use the frontend from its ENS name or run it locally; a tampered copy could read your notes.',
      boundary: {
        sender: 'exposed',
        recipient: 'exposed',
        amount: 'exposed',
        asset: 'exposed',
        linkage: 'private',
        identity: 'private',
      },
      sources: [
        { contract: 'Pool_0.1_ETH', title: '0.1 ETH pool (no operator)' },
        { contract: 'InstanceRegistry' },
        { section: 'permissions' },
      ],
    },
    futureAdversary: {
      condition: 'one open question; backups exposed',
      sentiment: 'warning',
      exposure:
        'The proofs stay secret forever. Whether the deposit-to-withdrawal link survives a quantum computer is an open question about the hash Tornado uses; users who backed up notes onchain are exposed outright.',
      advice:
        'Keep the note only on your device and skip the onchain backup option.',
      boundary: {
        sender: 'exposed',
        recipient: 'exposed',
        amount: 'exposed',
        asset: 'exposed',
        linkage: {
          verdict: 'unverifiable',
          note: 'Leaked for users with onchain note backups. For everyone else it depends on whether the Pedersen hash inputs can be recovered once a quantum computer removes the elliptic-curve layer; nobody has published an answer.',
        },
        identity: {
          verdict: 'atRisk',
          note: 'Inherits everything the chain analyst learns.',
        },
      },
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
