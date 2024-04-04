import { upcomingL2 } from './templates/upcoming'
import { Layer2 } from './types'

export const polygonmiden: Layer2 = upcomingL2({
  id: 'polygon-miden',
  display: {
    name: 'Polygon Miden',
    slug: 'polygon-miden',
    description:
      "Polygon Miden is a ZK rollup built on top of Ethereum running on the Miden VM. It will allow you to build high-throughput & private applications using smart contract languages like Rust that offer greater safety and lower fees while still benefiting from Ethereum's security.",
    purposes: ['Universal'],
    category: 'ZK Rollup',
    provider: 'Polygon',
    links: {
      websites: ['https://polygon.technology/polygon-miden'],
      apps: [],
      documentation: [
        'https://0xpolygonmiden.github.io/miden-base/introduction.html',
      ],
      explorers: [],
      repositories: ['https://github.com/0xPolygonMiden'],
      socialMedia: [
        'https://twitter.com/0xPolygonLabs',
        'https://discord.gg/0xPolygon',
        'https://t.me/polygonofficial',
      ],
    },
  },
})
