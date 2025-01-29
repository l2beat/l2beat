import { UnixTime } from '@l2beat/shared-pure'
import type { Layer2 } from '../../types'
import { upcomingL2 } from './templates/upcoming'

export const myshell: Layer2 = upcomingL2({
  id: 'myshell',
  capability: 'universal',
  addedAt: new UnixTime(1716981396), // 2024-05-29T11:16:36Z
  display: {
    name: 'MyShell L2',
    slug: 'myshell',
    description:
      'MyShell announced new L2 aimed to connect users, creators, and open-source AI model researchers, powered by EigenDA and OP Stack.',
    purposes: ['AI'],
    category: 'Optimium',
    stack: 'OP Stack',
    links: {
      websites: ['https://myshell.ai/'],
      documentation: ['https://docs.myshell.ai/'],
      socialMedia: [
        'https://twitter.com/myshell_ai',
        'https://discord.com/invite/myshell',
      ],
    },
  },
})
