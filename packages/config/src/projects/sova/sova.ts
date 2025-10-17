import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import type { ScalingProject } from '../../internalTypes'
import { upcomingL2 } from '../../templates/upcoming'

export const sova: ScalingProject = upcomingL2({
  id: 'sova',
  capability: 'universal',
  addedAt: UnixTime(1754639625),
  display: {
    name: 'Sova',
    slug: 'sova',
    description:
      "Sova is an Ethereum L2 running the OP rollup stack. The network's key innovation is providing native Bitcoin integration at the network level enabling smart contracts to directly interact with Bitcoin.",
    purposes: ['Universal'],
    stacks: ['OP Stack'],
    links: {
      websites: ['https://sova.io/'],
      documentation: ['https://docs.sova.io/'],
      explorers: ['https://explorer.testnet.sova.io/'],
      socialMedia: [
        'https://x.com/sovabtc',
        'https://t.me/+I54xZyHrNbUyYmMx',
        'https://discord.com/invite/sovabtc',
      ],
      bridges: ['https://app.sova.io/bridge'],
      repositories: ['https://github.com/SovaNetwork'],
    },
  },
  hasTestnet: true,
  ecosystemInfo: {
    id: ProjectId('superchain'),
  },
  proofSystem: {
    type: 'Optimistic',
  },
})
