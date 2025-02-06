import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'
import type { Layer3 } from '../../types'
import { underReviewL3 } from '../layer2s/templates/underReview'

export const forta: Layer3 = underReviewL3({
  id: 'forta',
  capability: 'universal',
  addedAt: new UnixTime(1738766610), // 2025-02-05T15:43:09Z
  hostChain: ProjectId('arbitrum'),
  display: {
    name: 'Forta',
    slug: 'forta',
    description:
      'Forta is a Layer 3 powered by Arbitrum Orbit. It is being built to support the Forta Firewall, which screens high-risk transactions, ensuring a safer blockchain environment. The Forta Chain records critical data like analyzed transaction batches, delayed/blocked transactions, and maintains a decentralized inbox for delayed transactions.',
    purposes: ['Universal'],
    category: 'Optimistic Rollup',
    stack: 'Arbitrum',
    links: {
      websites: ['https://forta.org/'],
      apps: [
        'https://app.forta.network/bots',
        'https://firewall.forta.network/',
      ],
      documentation: ['https://docs.forta.network/'],
      explorers: ['https://explorer.forta.org/'],
      socialMedia: ['https://x.com/FortaNetwork'],
    },
  },
  transactionApi: {
    type: 'rpc',
    startBlock: 1,
    defaultUrl: 'https://rpc-forta-chain-8gj1qndmfc.t.conduit.xyz/',
    defaultCallsPerMinute: 1500,
    adjustCount: { type: 'SubtractOne' },
  },
  escrows: [
    {
      address: EthereumAddress('0x9afa3dac8a88b56a7dafe9b300d65fd039b8e4c7'), // Bridge
      sinceTimestamp: new UnixTime(1730862045),
      tokens: ['FORT'],
      includeInTotal: false,
      chain: 'arbitrum',
    },
  ],
})
