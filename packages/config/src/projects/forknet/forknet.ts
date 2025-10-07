import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import type { ScalingProject } from '../../internalTypes'
import { upcomingL2 } from '../../templates/upcoming'

export const forknet: ScalingProject = upcomingL2({
  id: 'forknet',
  capability: 'universal',
  addedAt: UnixTime(1756724480), // 2025-09-01T12:01:20Z
  hasTestnet: true,
  display: {
    name: 'Forknet',
    slug: 'forknet',
    description:
      'An onchain order book DEX for spot and perpetuals, built on CDK OP Stack and natively integrated with Agglayer for unified liquidity.',
    purposes: ['Universal'],
    stacks: ['Agglayer CDK'],
    links: {
      websites: ['https://forknet.io/'],
      bridges: ['https://bridge.forknet.io/'],
      explorers: ['https://testnet.forkscan.org'],
      socialMedia: ['https://x.com/forknet_io'],
    },
  },
  ecosystemInfo: {
    id: ProjectId('agglayer'),
  },
  proofSystem: {
    type: 'Validity',
  },
})
