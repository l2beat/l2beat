import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import type { ScalingProject } from '../../internalTypes'
import { upcomingL3 } from '../../templates/upcoming'

export const toy: ScalingProject = upcomingL3({
  id: 'toy',
  capability: 'universal',
  addedAt: UnixTime(1755155703),
  hostChain: ProjectId('arbitrum'),
  display: {
    name: 'TOY',
    slug: 'toy',
    description:
      'TOY offers a solution by building consumer AI tools that integrate with any game on the most popular streaming platforms, connecting players with viewers and creating value, connections, and increased sales.',
    purposes: ['AI', 'Gaming'],
    stacks: ['Arbitrum'],
    links: {
      websites: ['https://playontoy.com/'],
      explorers: ['https://testnet-explorer.playontoy.com/'],
      bridges: ['https://portal.caldera.xyz/bridge/toy-chain-testnet'],
      documentation: ['https://toy-chain.gitbook.io/toy-chain'],
      socialMedia: [
        'https://discord.com/invite/playontoy',
        'https://x.com/playonTOY',
        'https://t.me/playonTOY',
        'https://instagram.com/playontoy_chain/',
        'https://youtube.com/@playonTOY',
        'https://tiktok.com/@playontoy',
      ],
    },
  },
  proofSystem: {
    type: 'Optimistic',
  },
  ecosystemInfo: {
    id: ProjectId('arbitrum-orbit'),
  },
})
