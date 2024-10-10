import { UnixTime } from '@l2beat/shared-pure'
import { upcomingL2 } from './templates/upcoming'
import { Layer2 } from './types'

export const moonveil: Layer2 = upcomingL2({
  id: 'moonveil',
  createdAt: new UnixTime(1721918879), // 2024-07-25T14:47:59Z
  display: {
    name: 'Moonveil',
    slug: 'moonveil',
    description: 'Moonveil is a gaming chain utilizing Polygon CDK technology.',
    purposes: ['Gaming'],
    category: 'Validium',
    provider: 'Polygon',
    links: {
      websites: ['https://www.moonveil.gg/'],
      apps: ['https://www.moonveil.gg/AstrArk/'],
      documentation: [],
      explorers: [],
      repositories: ['https://github.com/SwellNetwork'],
      socialMedia: [
        'https://x.com/Moonveil_Studio',
        'https://discord.gg/moonveil',
        'https://t.me/+AeiqS8o2YmswYTgx',
        'https://www.youtube.com/channel/UCFtFhgsjtdSgXarKvSYpz3A',
        'https://medium.com/@Moonveil_Studio',
      ],
    },
  },
})
