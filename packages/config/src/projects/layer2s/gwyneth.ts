import { UnixTime } from '@l2beat/shared-pure'
import type { Layer2 } from '../../types'
import { upcomingL2 } from './templates/upcoming'

export const gwyneth: Layer2 = upcomingL2({
  id: 'gwyneth',
  capability: 'universal',
  addedAt: new UnixTime(1721989895), // 2024-07-26T10:31:35Z
  display: {
    name: 'Gwyneth',
    slug: 'gwyneth',
    description:
      'Gwyneth is a based booster rollup synchronously composable with Ethereum utilizing Taiko technology.',
    purposes: ['Universal'],
    category: 'ZK Rollup',
    stack: 'Taiko',
    links: {
      websites: [
        'https://mirror.xyz/0xeac5Bc2abB5141c1510c18a9637437D49cE71e3F/r6CyuXtA7HKGw4FtF3b6YBHRoL5Kmbh_zufHFvKxIuQ',
      ],
      repositories: ['https://github.com/taikoxyz/taiko-reth/pulls'],
      socialMedia: [
        'https://x.com/gwyneth_taiko',
        'https://discord.gg/7EU5aP8P',
      ],
    },
  },
})
