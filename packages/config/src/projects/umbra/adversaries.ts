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
        'Everyone sees who paid, how much, and the fresh address that received it. Hidden is who owns that address, until it spends to somewhere tied to you.',
      advice:
        'Withdraw to a fresh, unregistered address without an ENS name, and use it once.',
      boundary: {
        sender: 'exposed',
        recipient: {
          verdict: 'atRisk',
          note: 'Hidden at entry. At exit the destination is public, so withdrawing to a registered, reused or ENS-labelled address reveals the recipient.',
        },
        amount: 'exposed',
        asset: 'exposed',
        linkage: {
          verdict: 'atRisk',
          note: 'Sender to stealth address and stealth address to destination are both public; only the identity behind the destination can stay unknown.',
        },
        identity: 'private',
      },
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
        'Each payment lands in one fresh address that is spent once, so there is no anonymity set: the analyst pairs the payment with its spend and asks who owns the destination. A reused destination, a registered one, or funds sent back to the payer answer that question.',
      advice: 'Wait before spending.',
      boundary: {
        sender: 'exposed',
        recipient: {
          verdict: 'atRisk',
          note: 'Survives with a fresh, unregistered destination used once, and a delay before spending.',
        },
        amount: 'exposed',
        asset: 'exposed',
        linkage: 'exposed',
        identity: {
          verdict: 'atRisk',
          note: 'Exchange KYC on the sender or on the destination.',
        },
      },
      sources: [
        {
          title:
            'Kovács & Seres, Anonymity Analysis of Umbra (arXiv:2308.01703)',
          url: 'https://arxiv.org/abs/2308.01703',
        },
      ],
    },
    networkObserver: {
      condition: 'own build and node needed',
      sentiment: 'warning',
      exposure:
        "The protocol needs nothing but a node. The hosted app, however, tells the Umbra indexer which wallet is scanning and asks your wallet's node for exactly your stealth addresses, linking them. Token withdrawals go through a closed relayer that sees the destination and your IP.",
      advice:
        'Build the app from source with the indexer disabled and point your wallet at your own node. Receive ETH rather than tokens where you can; token exits need either the relayer or a public gas top-up.',
      boundary: {
        sender: 'exposed',
        recipient: {
          verdict: 'atRisk',
          note: 'Wallet RPC sees the wallet-to-stealth multicall unless the wallet uses a self-hosted node; the relayer sees stealth-to-destination for tokens.',
        },
        amount: 'exposed',
        asset: 'exposed',
        linkage: {
          verdict: 'atRisk',
          note: 'Hidden for ETH with own build and node; for tokens either the relayer or the public observer learns the link.',
        },
        identity: {
          verdict: 'atRisk',
          note: 'Hosted frontend sends the scanning wallet address and IP to the indexer on every default scan; a build from source with the indexer disabled keeps them local.',
        },
      },
      sources: [
        {
          title: 'Registration lookup sends wallet address',
          url: 'https://github.com/ScopeLift/umbra-protocol/blob/master/umbra-js/src/utils/utils.ts',
        },
        {
          title: 'Balance multicall of matched addresses',
          url: 'https://github.com/ScopeLift/umbra-protocol/blob/master/frontend/src/components/AccountReceiveTable.vue',
        },
        {
          title: 'Relayer API client',
          url: 'https://github.com/ScopeLift/umbra-protocol/blob/master/frontend/src/utils/umbra-api.ts',
        },
      ],
    },
    privilegedInsider: {
      condition: 'owner can only stop new payments',
      sentiment: 'good',
      exposure:
        'The contracts are immutable and nobody holds a view key. The owner can only raise the fee on new payments; funds already received are unaffected.',
      boundary: {
        sender: 'exposed',
        recipient: 'atRisk',
        amount: 'exposed',
        asset: 'exposed',
        linkage: 'atRisk',
        identity: 'private',
      },
      sources: [{ contract: 'Umbra' }, { section: 'permissions' }],
    },
    futureAdversary: {
      condition: 'key exchange breaks',
      sentiment: 'bad',
      exposure:
        'Recipient privacy rests on elliptic-curve key exchange with keys published in the registry. A quantum computer links every payment since 2021 to its registered recipient.',
      boundary: {
        sender: 'exposed',
        recipient: 'exposed',
        amount: 'exposed',
        asset: 'exposed',
        linkage: 'exposed',
        identity: {
          verdict: 'atRisk',
          note: 'Inherits everything the chain analyst learns.',
        },
      },
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
