import { UnixTime } from '@l2beat/shared-pure'
import type { ScalingProject } from '../../internalTypes'
import { upcomingL2 } from './templates/upcoming'

export const quarkchain: ScalingProject = upcomingL2({
  id: 'quarkchain',
  capability: 'universal',
  addedAt: UnixTime(1741609623),
  display: {
    name: 'QuarkChain',
    slug: 'quarkchain',
    description:
      'QuarkChain is a Fully Decentralized L2 Delivering Unmatched Scalability, Security, and On-Chain Verifiable Storage - The Ultimate Infrastructure for AI and dApps.',
    purposes: ['AI'],
    category: 'Optimistic Rollup',
    links: {
      websites: ['https://quarkchain.io/'],
      apps: [
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
