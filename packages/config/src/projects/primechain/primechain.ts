import { UnixTime } from '@l2beat/shared-pure'
import type { ScalingProject } from '../../internalTypes'
import { upcomingL2 } from '../../templates/upcoming'

export const primechain: ScalingProject = upcomingL2({
  //might actually be an L4? adding as L2 for now as B3 as host is not supported
  id: 'primechain',
  capability: 'universal',
  addedAt: UnixTime(1755155703),
  display: {
    name: 'Prime Chain',
    slug: 'primechain',
    description:
      'Prime Chain is a dedicated gamechain that enhances the gaming experience by enabling cross-chain interoperability while reducing fragmentation.',
    purposes: ['Gaming'],
    stacks: ['Arbitrum'],
    links: {
      websites: ['https://echelon.io/'],
      explorers: ['https://prime-chain.explorer.caldera.xyz/'],
      bridges: ['https://portal.caldera.xyz/bridge/prime-chain'],
      documentation: ['https://docs.echelon.io/'],
      socialMedia: [
        'https://discord.com/invite/echelonfnd',
        'https://x.com/EchelonFND',
      ],
    },
  },
  proofSystem: {
    type: 'Optimistic',
  },
})
