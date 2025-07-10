import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import type { ScalingProject } from '../../internalTypes'
import { upcomingL2 } from '../../templates/upcoming'

export const polygonpos2: ScalingProject = upcomingL2({
  id: 'polygonpos2',
  capability: 'universal',
  addedAt: UnixTime(1690896554), // 2023-08-01T13:29:14Z
  display: {
    name: 'Polygon PoS 2.0',
    slug: 'polygon-pos-2',
    description:
      'Polygon PoS 2.0 leverages ZK technology, ideally without changing anything for users or developers. All applications should continue working and fees should stay just as low. The only difference should be higher security and seamless interoperability with other chains in the Polygon 2.0 ecosystem.',
    purposes: ['Universal'],
    category: 'Validium',
    stacks: ['Agglayer CDK'],
    links: {
      websites: ['https://polygon.technology'],
      bridges: ['https://wallet.polygon.technology/'],
      documentation: ['https://wiki.polygon.technology/'],
      explorers: [
        'https://polygonscan.com/',
        'https://polygon.blockscout.com/',
      ],
      repositories: ['https://github.com/maticnetwork/'],
      socialMedia: [
        'https://twitter.com/0xPolygonLabs',
        'https://discord.gg/0xPolygon',
        'https://t.me/polygonofficial',
      ],
    },
  },
  ecosystemInfo: {
    id: ProjectId('agglayer'),
  },
})
