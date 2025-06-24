import { UnixTime } from '@l2beat/shared-pure'
import type { ScalingProject } from '../../internalTypes'
import { upcomingL2 } from '../../templates/upcoming'

export const quarkchain: ScalingProject = upcomingL2({
  id: 'quarkchain',
  capability: 'universal',
  addedAt: UnixTime(1741609623),
  display: {
    name: 'QuarkChain',
    slug: 'quarkchain',
    description:
      'QuarkChain is an L2 that aims to serve as infrastructure for AI and dApps. It is planning to integrate EthStorage to open up new possibilities for fully on-chain AI with all models and training data stored there.',
    purposes: ['AI'],
    category: 'Optimistic Rollup',
    links: {
      websites: ['https://quarkchain.io/'],
      bridges: [
        'https://bridge.beta.testnet.l2.quarkchain.io',
        'https://qkc-l2-faucet.eth.sep.w3link.io',
      ],
      documentation: ['https://docs.quarkchain.io/'],
      explorers: ['https://explorer.beta.testnet.l2.quarkchain.io/'],
      socialMedia: [
        'https://x.com/quark_chain',
        'https://discord.com/invite/GbkGhY3qkh',
        'https://quarkchainio.medium.com/',
        'https://t.me/quarkchainio',
      ],
    },
  },
})
