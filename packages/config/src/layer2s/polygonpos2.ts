import { upcoming } from './templates/upcoming'
import { Layer2 } from './types'

export const polygonpos2: Layer2 = upcoming({
  id: 'polygon-pos-2',
  display: {
    name: 'Polygon PoS 2.0',
    slug: 'polygon-pos-2',
    description:
      'Polygon PoS 2.0 leverages ZK technology, ideally without changing anything for users or developers. All applications should continue working and fees should stay just as low. The only difference should be higher security and seamless interoperability with other chains in the Polygon 2.0 ecosystem.',
    purposes: ['Universal'],
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
})
