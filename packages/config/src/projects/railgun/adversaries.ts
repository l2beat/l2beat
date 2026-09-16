import {
  definePrivacyAdversaries,
  PRIVACY_ADVERSARY_SNIPPETS as S,
} from '../../common/privacyAdversaries'

const ENGINE = 'https://github.com/Railgun-Community/engine/blob/main/src/'

export const railgunAdversaries = definePrivacyAdversaries({
  promise: {
    protects: 'linkage',
    text: 'Hides everything inside the pool, including which shield funds which unshield. Shields and unshields are public.',
  },
  cells: {
    publicObserver: {
      sentiment: 'good',
      exposure: `Everything inside the pool is hidden, including which shield funds which unshield. ${S.entryExitPublic('Shields and unshields')} DeFi bundles unshield to the adapter in cleartext.`,
      advice: S.exitViaRelayer('broadcaster'),
      interior: {
        sender: 'private',
        recipient: 'private',
        amount: {
          verdict: 'private',
          note: 'Leaked for DeFi bundles, which unshield to the adapter in cleartext.',
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
          url: ENGINE + 'note/transact-note.ts',
        },
      ],
    },
    chainAnalyst: {
      sentiment: 'good',
      exposure: `The candidates for an unshield are the shields of the same token. In-pool transfers break the one-to-one match of a mixer, but timing and exact or round amounts narrow the set. ${S.walletFingerprint('broadcaster')}`,
      advice: `${S.commonAmounts} ${S.freshExit}`,
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
        'The wallet finds its notes by trial-decrypting every note locally, so nodes learn nothing about which are yours. By default it sends the pending unshield to the configured node for a gas estimate, which reveals the destination early.',
      advice: S.ownNodeAndTor('broadcaster'),
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
        'There is no view key, so nobody can read past activity. The DAO can upgrade the contracts after a seven-day delay. The proof-of-innocence list provider can refuse to list a shield, leaving only a self-broadcast exit.',
      advice:
        'Watch governance proposals; you have seven days to unshield before an upgrade takes effect. Be ready to self-broadcast if the list provider censors you.',
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
        { title: 'POI node interface', url: ENGINE + 'poi/poi.ts' },
      ],
    },
    futureAdversary: {
      sentiment: 'warning',
      exposure:
        'Notes are encrypted with elliptic-curve key exchange. A quantum computer decrypts every note sent to a 0zk address that was ever shared, including broadcaster fee notes: amounts, tokens and counterparties.',
      advice:
        'Treat your 0zk address as a secret: share it privately, and use a fresh one per counterparty where you can.',
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
          url: ENGINE + 'utils/keys-utils.ts',
        },
        {
          title: 'AES-GCM note encryption',
          url: ENGINE + 'utils/encryption/aes.ts',
        },
      ],
    },
  },
})
