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
      condition: 'interior fully encrypted',
      sentiment: 'good',
      exposure:
        'Shielding and unshielding show your address, token and amount. Everything inside the pool is encrypted, and nobody can see which shield funds which unshield.',
      advice:
        'Unshield through a broadcaster, so that no wallet of yours pays the gas next to the recipient. Expect DeFi through the pool to show tokens and amounts; only your identity stays hidden.',
      boundary: {
        sender: {
          verdict: 'exposed',
          note: 'At exit the gas payer is the broadcaster; self-broadcasting exposes the user EOA.',
        },
        recipient: 'exposed',
        amount: 'exposed',
        asset: 'exposed',
        linkage: 'private',
        identity: 'private',
      },
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
        identity: 'private',
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
      condition:
        'private with patience, uneven amounts and fresh exit addresses',
      sentiment: 'good',
      exposure:
        'The candidates for an unshield are limited to shields of the same token in the same tree, and no delay is enforced beyond the one-hour proof-of-innocence wait; hundreds of addresses shield each month, and transfers inside the pool break the one-to-one match of a mixer. Timing and exact or round amounts narrow the set. Activity inside the pool stays private.',
      advice:
        'Keep funds shielded for a while, unshield uneven amounts that differ from any single shield, and use a fresh exit address every time.',
      boundary: {
        sender: 'exposed',
        recipient: 'exposed',
        amount: 'exposed',
        asset: 'exposed',
        linkage: {
          verdict: 'atRisk',
          note: 'Wait, unshield uneven amounts, use a broadcaster, and use a fresh exit address each time.',
        },
        identity: {
          verdict: 'atRisk',
          note: 'Exchange KYC on the shielding EOA or the unshield destination.',
        },
      },
      interior: {
        sender: 'private',
        recipient: 'private',
        amount: 'private',
        asset: 'private',
        linkage: 'private',
        identity: 'private',
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
      condition: 'own node and POI list needed',
      sentiment: 'good',
      exposure:
        'Your wallet finds notes by trying to decrypt every note locally, so nodes learn nothing about which are yours. The broadcaster sees your unshield destination, public a block later anyway, but not your address or IP.',
      advice:
        'Point the wallet at your own node: by default it sends the pending transaction to the configured node for a gas estimate. Use a self-hosted proof-of-innocence list, or the default nodes learn which notes belong to one wallet.',
      boundary: {
        sender: 'exposed',
        recipient: 'exposed',
        amount: 'exposed',
        asset: 'exposed',
        linkage: 'private',
        identity: {
          verdict: 'atRisk',
          note: 'Configured RPC sees IP and the pending unshield destination during gas estimation; default sync indexer and Waku fleet see the IP of a Railgun wallet. Use a self-hosted node for both.',
        },
      },
      interior: {
        sender: 'private',
        recipient: 'private',
        amount: 'private',
        asset: 'private',
        linkage: 'private',
        identity: {
          verdict: 'atRisk',
          note: 'POI nodes receive the blinded commitments of a wallet in batches and its submissions per spend, tying an IP to a note cluster and to transaction ids. Use a self-hosted list.',
        },
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
        {
          title: 'POI node interface',
          url: 'https://github.com/Railgun-Community/engine/blob/main/src/poi/poi.ts',
        },
      ],
    },
    privilegedInsider: {
      condition: 'no view keys, 7-day upgrade delay',
      sentiment: 'good',
      exposure:
        'There is no view key, so nobody can read past activity. The DAO can upgrade the contracts after a seven-day delay, which could weaken privacy for future activity but not decrypt the past. Broadcasters may refuse transactions that fail a sanctions screening.',
      advice:
        'Watch governance proposals; you have seven days to unshield before an upgrade takes effect.',
      boundary: {
        sender: 'exposed',
        recipient: 'exposed',
        amount: 'exposed',
        asset: 'exposed',
        linkage: 'private',
        identity: 'private',
      },
      interior: {
        sender: 'private',
        recipient: 'private',
        amount: 'private',
        asset: 'private',
        linkage: 'private',
        identity: 'private',
      },
      sources: [
        { section: 'permissions', title: 'Governance roles' },
        {
          title: 'POI required lists',
          url: 'https://github.com/Railgun-Community/shared-models/blob/main/src/models/poi.ts',
        },
      ],
    },
    futureAdversary: {
      condition: 'notes of shared addresses decrypt',
      sentiment: 'warning',
      exposure:
        'Notes are encrypted with elliptic-curve key exchange. A future quantum computer decrypts every note sent to any address that was ever shared, including all broadcaster fee notes, revealing amounts, tokens and counterparties.',
      advice:
        'Treat your 0zk address like a secret: share it privately with each counterparty, and use a fresh one per counterparty where you can.',
      boundary: {
        sender: 'exposed',
        recipient: 'exposed',
        amount: 'exposed',
        asset: 'exposed',
        linkage: {
          verdict: 'atRisk',
          note: 'Leaked for wallets whose 0zk address was ever shared: shield decryption ties the shielding EOA to the 0zk identity and its later notes.',
        },
        identity: {
          verdict: 'atRisk',
          note: 'Inherits everything the chain analyst learns.',
        },
      },
      interior: {
        sender: {
          verdict: 'atRisk',
          note: 'Decrypts for notes touching any shared 0zk address.',
        },
        recipient: 'atRisk',
        amount: 'atRisk',
        asset: 'atRisk',
        linkage: 'atRisk',
        identity: 'atRisk',
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
