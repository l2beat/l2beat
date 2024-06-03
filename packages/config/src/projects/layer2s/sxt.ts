import { upcomingL2 } from './templates/upcoming'
import { Layer2 } from './types'

export const sxt: Layer2 = upcomingL2({
  id: 'sxt',
  display: {
    name: 'Space and Time',
    slug: 'sxt',
    description:
      "Space and Time (SxT) is a decentralized data warehouse that aims to provide a zk 'Proof of SQL' to bring offchain data to smart contracts onchain. Built on ZK Stack, the SxT hyperchain will serve as a settlement layer and payment hub for data queries.",
    purposes: ['AI', 'Information'],
    category: 'ZK Rollup',
    provider: 'ZK Stack',
    links: {
      websites: ['https://spaceandtime.io'],
      apps: ['https://app.spaceandtime.ai'],
      documentation: ['https://docs.spaceandtime.io'],
      explorers: [],
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
