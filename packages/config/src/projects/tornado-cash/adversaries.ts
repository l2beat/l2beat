import type { PrivacyAdversaryAssessments } from '../../types'

const CORE = 'https://github.com/tornadocash/tornado-core'
const UI = 'https://github.com/tornadocash/tornado-classic-ui'

// Verdicts backed by pool sources (.flat/Pool_*.sol), discovered.json and the
// linked client repositories. Measurements as of 2026-09-08, block 25,931,789.
export const tornadoCashAdversaries: PrivacyAdversaryAssessments = {
  publicObserver: {
    value: 'Only linkage hidden',
    sentiment: 'good',
    description:
      'Deposits and withdrawals are plain transactions on fixed-denomination pools, so sender, recipient, amount, asset and pool membership are all public. The one thing hidden is which deposit a withdrawal spends: only a Pedersen commitment and a nullifier hash appear onchain, and the Groth16 proof reveals nothing else. Self-relayed withdrawals additionally expose the gas-paying address.',
    boundary: {
      sender: 'leaked',
      recipient: 'leaked',
      amount: 'leaked',
      asset: 'leaked',
      linkage: 'hidden',
      membership: 'leaked',
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
  dragnetAnalyst: {
    value: 'Heuristics link careless users',
    sentiment: 'warning',
    description:
      'Every withdrawal spends exactly one deposit of the same denomination and there is no in-pool activity or enforced delay, so the anonymity set of a withdrawal is the set of unspent notes in that pool at that moment. In the ETH pools this is a few thousand notes; the stablecoin, WBTC and cDAI pools are near-dead, so a withdrawal there links to a handful of deposits. Published heuristics (address reuse, timing, multi-denomination patterns, gas and wallet fingerprints, relayer choice) recover the link for a large share of users. Combined with exchange KYC on the deposit address this usually suffices.',
    boundary: {
      sender: 'leaked',
      recipient: 'leaked',
      amount: 'leaked',
      asset: 'leaked',
      linkage: {
        verdict: 'hygiene',
        note: 'Wait long, use active pools only, avoid address reuse and multi-note patterns, never fund the recipient from a linked address.',
      },
      membership: 'leaked',
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
    value: 'Relayer sees recipient and IP',
    sentiment: 'warning',
    description:
      'The note never leaves the device: the client downloads all deposit events of a pool and searches for its own commitment locally, so the RPC provider only learns which pool the user cares about. The relayer, however, receives the complete withdrawal (pool, proof, recipient, fee) together with the HTTP metadata, and the reference UI probes every registered relayer before picking one. Relaying is permissionless, and the top two relayers carried around 40% of ETH-pool withdrawals in the last 30 days. The default UI queries The Graph first and, for note-account recovery, sends the wallet address.',
    boundary: {
      recipient: {
        verdict: 'leaked',
        note: 'Relayer learns recipient, nullifier hash and IP at once.',
      },
      linkage: 'hidden',
      membership: {
        verdict: 'hygiene',
        note: 'Without Tor, every probed relayer and The Graph learn the IP of a Tornado user.',
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
    value: 'None',
    sentiment: 'good',
    description:
      'No role can see or block pool users. The pools have no live operator (the legacy operator slot is zero on the 2019 pools and absent on the 2021 pools), no view or decryption key, no association set provider and no pause. Governance, behind a 2-day timelock, controls only the periphery: it can disable pools in the router and registry, remove relayers from the UI-visible list and point the ENS name at a new frontend. Direct calls to the pools always work, so the exclusion capability is limited to the default UI path.',
    boundary: {
      linkage: 'hidden',
      membership: 'leaked',
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
    value: 'Backed-up notes exposed',
    sentiment: 'warning',
    description:
      'Groth16 is perfectly zero-knowledge, so the proofs themselves never leak, and the trusted setup only affects soundness. Users who backed their notes up onchain (the EncryptedNote and Echo events, about 3% of recent router deposits) encrypted them with X25519, which a quantum adversary breaks: those notes decrypt and link deposit to withdrawal exactly. For everyone else the commitment and nullifier hash are unblinded Pedersen hashes on Baby Jubjub. Given a discrete-log oracle the nullifier is determined by onchain data and linking reduces to a structured knapsack whose hardness is unproven, so this linkage is not information-theoretically hidden.',
    boundary: {
      linkage: {
        verdict: 'unverifiable',
        note: 'Leaked for users with onchain note backups; for plain notes the residual hardness of Pedersen-hash inversion under a DL oracle has no published analysis.',
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
}
