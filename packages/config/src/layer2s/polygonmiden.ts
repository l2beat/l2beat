import { upcoming } from './templates/upcoming'
import { Layer2 } from './types'

export const polygonmiden: Layer2 = upcoming({
  id: 'polygon-miden',
  display: {
    name: 'Polygon Miden',
    slug: 'polygon-miden',
    description:
      "Polygon Miden is a zero-knowledge rollup built on top of Ethereum running on the Miden VM. With Polygon Miden, you will be able to build high-throughput & private applications using modern smart contract languages like Rust that offer greater safety and also aim for very low fees while still benefiting from Ethereum's security.",
    purpose: 'Universal',
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
