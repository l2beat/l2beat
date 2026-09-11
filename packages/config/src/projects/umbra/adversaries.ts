import { definePrivacyAdversaries } from '../../common/privacyAdversaries'

const UMBRA_JS =
  'https://github.com/ScopeLift/umbra-protocol/blob/a81df24e76a0d6ab1ec79c6353e28c527b1b1a80/'

export const umbraAdversaries = definePrivacyAdversaries({
  promise: {
    protects: 'recipient',
    text: 'Hides who controls the receiving address. Sender, amount and the address itself are public.',
  },
  cells: {
    publicObserver: {
      sentiment: 'warning',
      exposure:
        'Who owns the receiving address stays hidden until it spends to somewhere tied to you. Everyone sees who paid, how much, the fresh address that received it, and the list of addresses that have published stealth keys, which is where recipients are drawn from.',
      advice:
        'Withdraw to a fresh, unregistered address without an ENS name, and use it once.',
      sources: [
        { contract: 'Umbra' },
        { contract: 'StealthKeyRegistry', title: 'Public list of recipients' },
        {
          title: 'Stealth derivation (umbra-js)',
          url: UMBRA_JS + 'umbra-js/src/classes/Umbra.ts',
        },
      ],
    },
    chainAnalyst: {
      sentiment: 'bad',
      exposure:
        'The anonymity set is very small since the onchain announcement ties every transaction to this protocol.',
      advice: 'Use a stealth address protocol with a larger anonymity set.',
      sources: [
        { contract: 'StealthKeyRegistry' },
        {
          title:
            'Kovács & Seres, Anonymity Analysis of Umbra (arXiv:2308.01703)',
          url: 'https://arxiv.org/abs/2308.01703',
        },
      ],
    },
    networkObserver: {
      sentiment: 'good',
      exposure:
        "The protocol needs nothing but a node. The app reads the balances of exactly your stealth addresses through your wallet's node, which ties them to your wallet unless that node is yours.",
      advice: 'Point your wallet at your own node.',
      sources: [
        {
          title: 'Registration lookup sends wallet address',
          url: UMBRA_JS + 'umbra-js/src/utils/utils.ts',
        },
        {
          title: 'Balance multicall of matched addresses',
          url: UMBRA_JS + 'frontend/src/components/AccountReceiveTable.vue',
        },
      ],
    },
    privilegedInsider: {
      sentiment: 'good',
      exposure:
        'The contracts are immutable and nobody holds a view key. The owner can only raise the fee on new payments. The indexer learns which wallet scans and the token relayer the withdrawal destination, nothing beyond the chain.',
      sources: [
        { contract: 'Umbra' },
        { section: 'permissions' },
        {
          title: 'Relayer API client',
          url: UMBRA_JS + 'frontend/src/utils/umbra-api.ts',
        },
      ],
    },
    futureAdversary: {
      sentiment: 'bad',
      exposure:
        'Recipient privacy rests on elliptic-curve key exchange with keys published in the registry. A quantum computer links every payment since 2021 to its registered recipient.',
      sources: [
        { contract: 'StealthKeyRegistry' },
        {
          title: 'Shared secret derivation',
          url: UMBRA_JS + 'umbra-js/src/utils/sharedSecret.ts',
        },
      ],
    },
  },
})
