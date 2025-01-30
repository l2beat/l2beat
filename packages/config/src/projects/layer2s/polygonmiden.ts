import { UnixTime } from '@l2beat/shared-pure'
import type { Layer2 } from '../../types'
import { upcomingL2 } from './templates/upcoming'

export const polygonmiden: Layer2 = upcomingL2({
  id: 'polygon-miden',
  capability: 'universal',
  addedAt: new UnixTime(1690896554), // 2023-08-01T13:29:14Z
  display: {
    name: 'Polygon Miden',
    slug: 'polygon-miden',
    description:
      "Polygon Miden is a ZK rollup built on top of Ethereum running on the Miden VM. It will allow you to build high-throughput & private applications using smart contract languages like Rust that offer greater safety and lower fees while still benefiting from Ethereum's security.",
    purposes: ['Universal'],
    category: 'ZK Rollup',
    stack: 'Polygon',
    links: {
      websites: ['https://polygon.technology/polygon-miden'],
      documentation: ['https://docs.polygon.technology/miden/'],
      repositories: ['https://github.com/0xPolygonMiden'],
      socialMedia: [
        'https://x.com/0xPolygon',
        'https://x.com/0xPolygonMiden',
        'https://discord.gg/0xPolygon',
        'https://t.me/polygonofficial',
      ],
    },
  },
})
