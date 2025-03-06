import { UnixTime } from '@l2beat/shared-pure'
import type { Layer2 } from '../../internalTypes'
import { upcomingL2 } from './templates/upcoming'

export const penchain: Layer2 = upcomingL2({
  id: 'penchain',
  capability: 'universal',
  addedAt: new UnixTime(1740706975),
  display: {
    name: 'Pen chain',
    slug: 'penchain',
    description:
      'Pen Chain is a zkEVM blockchain powered by ZK stack and secured by Ethereum. It is dedicated to mainstream adoption of Web3 gaming, DeFi, and SocialFi.',
    purposes: ['Gaming'],
    category: 'ZK Rollup',
    stack: 'ZK Stack',
    links: {
      websites: ['https://pentagon.games/pen-chain'],
      documentation: [],
      explorers: ['https://explorer-testnet.pentagon.games/'],
      socialMedia: [
        'https://x.com/pentagongames88',
        'https://discord.com/invite/pentagongamesxp',
        'https://youtube.com/@PentagonGamesXP',
        'https://t.me/PentagonGamesXP',
      ],
    },
  },
})
