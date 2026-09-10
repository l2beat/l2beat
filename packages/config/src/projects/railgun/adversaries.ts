import { definePrivacyAdversaries } from '../../common/privacyAdversaries'

// Verdicts backed by .flat/RailgunSmartWallet, discovered.json, the engine,
// wallet, broadcaster and POI sources. Measurements as of 2026-09-08,
// block 25,931,791.
export const railgunAdversaries = definePrivacyAdversaries({
  promise: {
    protects: 'linkage',
    text: 'Hides everything inside the pool. Deposits and withdrawals are public.',
  },
  cells: {
    publicObserver: {
      sentiment: 'good',
      exposure:
        'Everything inside the pool is encrypted, and nobody can see which shield funds which unshield. Shielding and unshielding show your address, token and amount.',
      advice:
        'Unshield through a broadcaster, so no wallet of yours pays the gas next to the recipient. DeFi through the pool shows tokens and amounts.',
      interior: {
        sender: 'private',
        recipient: 'private',
        amount: {
          verdict: 'private',
          note: 'Leaked for DeFi bundles, which unshield to RelayAdapt in cleartext.',
        },
        asset: {
          verdict: 'private',
          note: 'Leaked for DeFi bundles.',
        },
        linkage: 'private',
      },
      sources: [
        { contract: 'RailgunSmartWallet' },
        {
          title: 'Note ciphertext format',
          url: 'https://github.com/Railgun-Community/engine/blob/main/src/note/transact-note.ts',
        },
      ],
    },
    chainAnalyst: {
      sentiment: 'good',
      exposure:
        'The candidates for an unshield are the shields of the same token in the same tree: transfers inside break the one-to-one match of a mixer, and no delay is enforced beyond the one-hour proof-of-innocence wait. Timing and exact or round amounts narrow the set.',
      advice:
        'Keep funds shielded for a while, unshield uneven amounts that differ from any single shield, and use a fresh exit address every time.',
      interior: {
        sender: 'private',
        recipient: 'private',
        amount: 'private',
        asset: 'private',
        linkage: 'private',
      },
      sources: [
        {
          title: 'A Tattered Cloak of Invisibility (arXiv:2606.25926)',
          url: 'https://arxiv.org/abs/2606.25926',
        },
        {
          title: 'The Anonymity Gap (arXiv:2608.22987)',
          url: 'https://arxiv.org/abs/2608.22987',
        },
      ],
    },
    networkObserver: {
      sentiment: 'good',
      exposure:
        'The wallet finds its notes by trying to decrypt every note locally, so nodes learn nothing about which are yours. By default it sends the pending unshield to the configured node for a gas estimate, which reveals the destination early.',
      advice: 'Point the wallet at your own node.',
      interior: {
        sender: 'private',
        recipient: 'private',
        amount: 'private',
        asset: 'private',
        linkage: 'private',
      },
      sources: [
        {
          title: 'Gas estimation with dummy proof',
          url: 'https://github.com/Railgun-Community/wallet/blob/main/src/services/transactions/tx-gas-details.ts',
        },
        {
          title: 'Broadcaster decrypts request',
          url: 'https://github.com/Railgun-Community/ppoi-safe-broadcaster-example/blob/main/src/server/waku-broadcaster/methods/transact-method.ts',
        },
      ],
    },
    privilegedInsider: {
      sentiment: 'good',
      exposure:
        'There is no view key, so nobody can read past activity. The DAO can upgrade the contracts after a seven-day delay, which could weaken future privacy. The proof-of-innocence list provider can refuse to list a shield, leaving only a self-broadcast exit, and its nodes receive blinded commitments and spend submissions per wallet.',
      advice:
        'Watch governance proposals; you have seven days to unshield before an upgrade takes effect. Self-host the proof-of-innocence list.',
      interior: {
        sender: 'private',
        recipient: 'private',
        amount: 'private',
        asset: 'private',
        linkage: {
          verdict: 'atRisk',
          note: 'POI nodes tie a session to a note cluster and its transaction ids.',
        },
      },
      sources: [
        { section: 'permissions', title: 'Governance roles' },
        {
          title: 'POI required lists',
          url: 'https://github.com/Railgun-Community/shared-models/blob/main/src/models/poi.ts',
        },
        {
          title: 'POI node interface',
          url: 'https://github.com/Railgun-Community/engine/blob/main/src/poi/poi.ts',
        },
      ],
    },
    futureAdversary: {
      sentiment: 'warning',
      exposure:
        'Notes are encrypted with elliptic-curve key exchange. A quantum computer decrypts every note sent to any 0zk address that was ever shared, including all broadcaster fee notes: amounts, tokens and counterparties.',
      advice:
        'Treat your 0zk address like a secret: share it privately with each counterparty, and use a fresh one per counterparty where you can.',
      interior: {
        sender: {
          verdict: 'atRisk',
          note: 'Decrypts for notes touching any shared 0zk address.',
        },
        recipient: 'atRisk',
        amount: 'atRisk',
        asset: 'atRisk',
        linkage: 'atRisk',
      },
      sources: [
        {
          title: 'Shared key derivation (Ed25519 ECDH)',
          url: 'https://github.com/Railgun-Community/engine/blob/main/src/utils/keys-utils.ts',
        },
        {
          title: 'AES-GCM note encryption',
          url: 'https://github.com/Railgun-Community/engine/blob/main/src/utils/encryption/aes.ts',
        },
      ],
    },
  },
})
