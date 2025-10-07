import { UnixTime } from '@l2beat/shared-pure'
import type { ScalingProject } from '../../internalTypes'
import { upcomingL2 } from '../../templates/upcoming'

export const aztecV2: ScalingProject = upcomingL2({
  id: 'aztec-v2',
  addedAt: UnixTime(1700568758), // '2023-11-21T12:12:38Z'
  capability: 'universal',
  hasTestnet: true,
  display: {
    name: 'Aztec',
    slug: 'aztec',
    description:
      'Aztec is an open source layer 2 network that brings programmable privacy and scalability to Ethereum, powered by Noir, an open-source general programming language.',
    purposes: ['Universal', 'Privacy'],
    links: {
      websites: ['https://aztec.network/', 'https://aztec.network/noir'],
      documentation: ['https://docs.aztec.network/'],
      explorers: ['https://aztecscan.xyz', 'https://aztecexplorer.xyz'],
      repositories: ['https://github.com/AztecProtocol/aztec-packages'],
      socialMedia: [
        'https://twitter.com/aztecnetwork',
        'https://medium.com/aztec-protocol',
        'https://t.me/aztecprotocol',
      ],
    },
  },
  proofSystem: {
    type: 'Validity',
  },
})
