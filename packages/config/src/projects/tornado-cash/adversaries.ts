import { definePrivacyAdversaries } from '../../common/privacyAdversaries'

const CORE = 'https://github.com/tornadocash/tornado-core'
const UI = 'https://github.com/tornadocash/tornado-classic-ui'

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
      description:
        'Deposits and withdrawals are plain transactions on fixed-denomination pools, so sender, recipient, amount, asset and pool membership are all public. The one thing hidden is which deposit a withdrawal spends: only a Pedersen commitment and a nullifier hash appear onchain, and the Groth16 proof reveals nothing else. Self-relayed withdrawals additionally expose the gas-paying address.',
      boundary: {
        sender: 'leaked',
        recipient: 'leaked',
        amount: 'leaked',
        asset: 'leaked',
        linkage: 'private',
        identity: 'private',
      },
      sources: [
        {
          title: 'Pool.withdraw public inputs',
          url: 'https://etherscan.io/address/0x47CE0C6eD5B0Ce3d3A51fdb1C52DC66a7c3c2936#code',
        },
        {
          title: 'withdraw.circom',
          url: `${CORE}/blob/master/circuits/withdraw.circom`,
        },
      ],
    },
    chainAnalyst: {
      condition: 'timing and pool activity narrow it',
      sentiment: 'warning',
      description:
        'Every withdrawal spends exactly one deposit of the same denomination and there is no in-pool activity or enforced delay, so the anonymity set of a withdrawal is the set of unspent notes in that pool at that moment. In the ETH pools this is a few thousand notes; the stablecoin, WBTC and cDAI pools are near-dead, so a withdrawal there links to a handful of deposits. Published heuristics (address reuse, timing, multi-denomination patterns, gas and wallet fingerprints, relayer choice) recover the link for a large share of users. Combined with exchange KYC on the deposit address this usually suffices.',
      boundary: {
        sender: 'leaked',
        recipient: 'leaked',
        amount: 'leaked',
        asset: 'leaked',
        linkage: {
          verdict: 'atRisk',
          note: 'Wait long, use active pools only, avoid address reuse and multi-note patterns, never fund the recipient from a linked address.',
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
      description:
        'The note never leaves the device: the client downloads all deposit events of a pool and searches for its own commitment locally, so the RPC provider only learns which pool the user cares about. The relayer receives the complete withdrawal, but recipient, pool, fee and nullifier hash become public onchain a block later anyway; its genuine extra knowledge is the IP address and the pre-broadcast timing, which Tor removes. Self-relaying is not an escape: it places a user-controlled gas payer next to the recipient in a public transaction. Relaying is permissionless, and the top two relayers carried around 40% of ETH-pool withdrawals in the last 30 days.',
      boundary: {
        sender: 'leaked',
        recipient: 'leaked',
        amount: 'leaked',
        asset: 'leaked',
        linkage: 'private',
        identity: {
          verdict: 'atRisk',
          note: 'The default UI exposes the IP to every probed relayer and to The Graph unless routed through Tor; note-account recovery sends the wallet address to The Graph.',
        },
      },
      sources: [
        {
          title: 'Event sync (services/events.js)',
          url: `${UI}/blob/master/services/events.js`,
        },
        {
          title: 'Relayer selection (store/relayer.js)',
          url: `${UI}/blob/master/store/relayer.js`,
        },
        {
          title: 'Relayer withdraw endpoint',
          url: 'https://github.com/tornadocash/tornado-relayer/blob/master/src/contollers/controller.js',
        },
      ],
    },
    privilegedInsider: {
      condition: 'no role can see or block',
      sentiment: 'good',
      description:
        'No role can see or block pool users. The pools have no live operator (the legacy operator slot is zero on the 2019 pools and absent on the 2021 pools), no view or decryption key, no association set provider and no pause. Governance, behind a 2-day timelock, controls only the periphery: it can disable pools in the router and registry, remove relayers from the UI-visible list and point the ENS name at a new frontend. Direct calls to the pools always work, so the exclusion capability is limited to the default UI path.',
      boundary: {
        sender: 'leaked',
        recipient: 'leaked',
        amount: 'leaked',
        asset: 'leaked',
        linkage: 'private',
        identity: 'private',
      },
      sources: [
        {
          title: 'Pool operator == 0x0',
          url: 'https://etherscan.io/address/0x12D66f87A04A9E220743712cE6d9bB1B5616B8Fc#readContract',
        },
        {
          title: 'InstanceRegistry gating',
          url: 'https://etherscan.io/address/0xB20c66C4DE72433F3cE747b58B86830c459CA911#code',
        },
      ],
    },
    futureAdversary: {
      condition: 'one open question; backups exposed',
      sentiment: 'warning',
      description:
        'The zero-knowledge proof is safe: Groth16 proofs reveal nothing about their inputs even to a quantum computer, and a compromised trusted setup only enables forged withdrawals, not deanonymization. Everything else hinges on two hashes. Each deposit publishes a hash of two secret numbers and each withdrawal publishes a hash of the first one; linking a withdrawal to its deposit means matching them, which is impossible today because hashes cannot be reversed. Tornado, however, uses a Pedersen hash built from elliptic-curve arithmetic rather than a conventional hash function. A quantum computer can undo the curve part and turn each hash back into a single number that is a fixed combination of the secret inputs. Whether the inputs can be recovered from that number has no published analysis; our own estimate is that it is hard but without the margin a conventional hash would give. Separately, the roughly 3% of users who backed up their notes onchain used elliptic-curve encryption that breaks outright, so their deposits and withdrawals link exactly.',
      boundary: {
        sender: 'leaked',
        recipient: 'leaked',
        amount: 'leaked',
        asset: 'leaked',
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
        {
          title: 'EncryptedNote on TornadoRouter',
          url: 'https://etherscan.io/address/0xd90e2f925DA726b50C4Ed8D0Fb90Ad053324F31b#code',
        },
      ],
    },
  },
})
