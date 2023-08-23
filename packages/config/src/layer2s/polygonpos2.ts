import { ProjectId } from '@l2beat/shared-pure'

import { CONTRACTS, TECHNOLOGY, UPCOMING_RISK_VIEW } from './common'
import { Layer2 } from './types'

export const polygonpos2: Layer2 = {
  isUpcoming: true,
  type: 'layer2',
  id: ProjectId('polygon-pos-2'),
  display: {
    name: 'Polygon PoS 2.0',
    slug: 'polygon-pos-2',
    description:
      'Polygon PoS 2.0 leverages bleeding edge ZK technology and fit into the Polygon 2.0 vision, ideally without changing anything for users or developers. All applications should continue working and fees should stay just as low. The only difference should be higher security for users and seamless interoperability with every other chain in the Polygon 2.0 ecosystem.',
    purpose: 'Universal',
    category: 'Validium',
    provider: 'Polygon',
    links: {
      websites: ['https://polygon.technology'],
      apps: ['https://wallet.polygon.technology/'],
      documentation: ['https://wiki.polygon.technology/'],
      explorers: ['https://polygonscan.com/'],
      repositories: ['https://github.com/maticnetwork/'],
      socialMedia: [
        'https://twitter.com/0xPolygonLabs',
        'https://discord.gg/0xPolygon',
        'https://t.me/polygonofficial',
      ],
    },
  },
  config: {
    escrows: [],
  },
  riskView: UPCOMING_RISK_VIEW,
  technology: TECHNOLOGY.UPCOMING,
  contracts: CONTRACTS.EMPTY,
}
