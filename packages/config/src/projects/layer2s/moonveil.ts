import { UnixTime } from '@l2beat/shared-pure'
import type { Layer2 } from '../../types'
import { upcomingL2 } from './templates/upcoming'

export const moonveil: Layer2 = upcomingL2({
  id: 'moonveil',
  capability: 'universal',
  addedAt: new UnixTime(1721918879), // 2024-07-25T14:47:59Z
  display: {
    name: 'Moonveil',
    slug: 'moonveil',
    description: 'Moonveil is a gaming chain utilizing Polygon CDK technology.',
    purposes: ['Gaming'],
    category: 'Validium',
    stack: 'Polygon',
    links: {
      websites: ['https://moonveil.gg/'],
      apps: ['https://moonveil.gg/AstrArk/'],
      repositories: ['https://github.com/SwellNetwork'],
      socialMedia: [
        'https://x.com/Moonveil_Studio',
        'https://discord.gg/moonveil',
        'https://t.me/+AeiqS8o2YmswYTgx',
        'https://youtube.com/channel/UCFtFhgsjtdSgXarKvSYpz3A',
        'https://medium.com/@Moonveil_Studio',
      ],
    },
  },
})
