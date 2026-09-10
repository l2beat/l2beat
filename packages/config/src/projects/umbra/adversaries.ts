import { definePrivacyAdversaries } from '../../common/privacyAdversaries'

// Verdicts backed by .flat/Umbra.sol, .flat/StealthKeyRegistry.sol,
// discovered.json and the umbra-js / frontend sources. Measurements as of
// 2026-09-08, block 25,931,789.
export const umbraAdversaries = definePrivacyAdversaries({
  promise: {
    protects: 'recipient',
    text: 'Hides who controls the receiving address. Sender, amount and the address itself are public.',
  },
  cells: {
    publicObserver: {
      condition: 'sender and amount public',
      sentiment: 'good',
      exposure:
        'Everyone sees who paid, how much, and the fresh address that received it. Who owns that address stays hidden until it spends to somewhere tied to you.',
      advice:
        'Withdraw to a fresh, unregistered address without an ENS name, and use it once.',
      sources: [
        { contract: 'Umbra' },
        {
          title: 'Stealth derivation (umbra-js)',
          url: 'https://github.com/ScopeLift/umbra-protocol/blob/master/umbra-js/src/classes/Umbra.ts',
        },
      ],
    },
    chainAnalyst: {
      condition: 'private with a fresh destination and patience',
      sentiment: 'good',
      exposure:
        'Each payment lands in one fresh address spent once, so there is no anonymity set: the analyst pairs payment with spend and asks who owns the destination. A reused or registered destination, or funds sent back to the payer, answer that.',
      advice: 'Wait before spending.',
      sources: [
        {
          title:
            'Kovács & Seres, Anonymity Analysis of Umbra (arXiv:2308.01703)',
          url: 'https://arxiv.org/abs/2308.01703',
        },
      ],
    },
    networkObserver: {
      condition: 'own node in the wallet',
      sentiment: 'good',
      exposure:
        "The protocol needs nothing but a node. The app reads the balances of exactly your stealth addresses through your wallet's node, which ties them to your wallet unless that node is yours.",
      advice: 'Point your wallet at your own node.',
      sources: [
        {
          title: 'Registration lookup sends wallet address',
          url: 'https://github.com/ScopeLift/umbra-protocol/blob/master/umbra-js/src/utils/utils.ts',
        },
        {
          title: 'Balance multicall of matched addresses',
          url: 'https://github.com/ScopeLift/umbra-protocol/blob/master/frontend/src/components/AccountReceiveTable.vue',
        },
      ],
    },
    privilegedInsider: {
      condition: 'owner can only stop new payments',
      sentiment: 'good',
      exposure:
        'The contracts are immutable and nobody holds a view key. The owner can only raise the fee on new payments. The indexer learns which wallet scans and the token relayer the withdrawal destination, nothing beyond the chain.',
      sources: [
        { contract: 'Umbra' },
        { section: 'permissions' },
        {
          title: 'Relayer API client',
          url: 'https://github.com/ScopeLift/umbra-protocol/blob/master/frontend/src/utils/umbra-api.ts',
        },
      ],
    },
    futureAdversary: {
      condition: 'key exchange breaks',
      sentiment: 'bad',
      exposure:
        'Recipient privacy rests on elliptic-curve key exchange with keys published in the registry. A quantum computer links every payment since 2021 to its registered recipient.',
      sources: [
        { contract: 'StealthKeyRegistry' },
        {
          title: 'Shared secret derivation',
          url: 'https://github.com/ScopeLift/umbra-protocol/blob/master/umbra-js/src/utils/sharedSecret.ts',
        },
      ],
    },
  },
})
