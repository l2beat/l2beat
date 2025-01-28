import { UnixTime } from '@l2beat/shared-pure'
import type { Layer2 } from '../../types'
import { upcomingL2 } from './templates/upcoming'

export const solo: Layer2 = upcomingL2({
  id: 'solo',
  capability: 'universal',
  addedAt: new UnixTime(1734420940), // 2024-12-17T07:35:40Z
  display: {
    name: 'SOLO',
    slug: 'solo',
    description:
      'SoloChain is a programmable, variable-cost, user-centric Ethereum L2 built to allow users to mine and launch projects with seamless DePIN integrations, equitable mining curves, and AI agentic mechanisms to redefine the internet.',
    purposes: ['AI'],
    category: 'Optimium',
    stack: 'OP Stack',
    links: {
      websites: ['https://solo.tech'],
      apps: ['https://solo-testnet.bridge.caldera.xyz'],
      documentation: ['https://docs.solo.tech/'],
      explorers: ['https://solo-testnet.explorer.caldera.xyz/'],
      socialMedia: ['https://x.com/SoloDePIN', 'https://t.me/SoloDePIN'],
    },
  },
})
