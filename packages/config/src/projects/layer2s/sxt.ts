import { UnixTime } from '@l2beat/shared-pure'
import type { Layer2 } from '../../types'
import { upcomingL2 } from './templates/upcoming'

export const sxt: Layer2 = upcomingL2({
  id: 'sxt',
  capability: 'universal',
  addedAt: new UnixTime(1716819511), // 2024-05-27T14:18:31Z
  display: {
    name: 'Space and Time',
    slug: 'sxt',
    description:
      "Space and Time (SxT) is a decentralized data warehouse that aims to provide a zk 'Proof of SQL' to bring offchain data to smart contracts onchain. Built on ZK Stack, the SxT hyperchain will serve as a settlement layer and payment hub for data queries.",
    purposes: ['AI', 'Information'],
    category: 'ZK Rollup',
    stack: 'ZK Stack',
    links: {
      websites: ['https://spaceandtime.io'],
      apps: ['https://app.spaceandtime.ai'],
      documentation: ['https://docs.spaceandtime.io'],
      repositories: ['https://github.com/spaceandtimelabs'],
      socialMedia: [
        'https://x.com/SpaceandTimeDB',
        'https://discord.com/invite/spaceandtimeDB',
        'https://linkedin.com/company/space-and-time-db/',
        'https://youtube.com/channel/UCXJyE7ahmqCH11aO7L76PBA',
        'https://t.me/spaceandtimedb',
        'https://instagram.com/spaceandtimedb/',
        'https://spaceandtime.io/blog',
      ],
    },
  },
})
